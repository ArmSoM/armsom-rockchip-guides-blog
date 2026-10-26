---
title: "Rockchip Linux SARADC: V1/V2/V3 Drivers, DMA and Testing"
description: "Rockchip Linux SARADC: V1/V2/V3 Drivers, DMA and Testing — V1.1.0 / V1.0.0"
excerpt: "Rockchip Linux SARADC: V1/V2/V3 Drivers, DMA and Testing"
translation_key: "140-rockchip-linux-saradc"
slug: "140-rockchip-linux-saradc"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, Linux, SARADC, DMA]
---

{% raw %}

# Rockchip Linux SARADC: V1/V2/V3 Drivers, DMA and Testing

Chinese RK-KF-YF-079 V1.1.0 (8 pages) is the common four-language baseline; unique English V1.0.0 (7 pages) details are added separately. Chinese scope: Rockchip/Linux 4.4, 4.19, 5.10 and 6.1. This platform reference does not confirm an ArmSoM board’s SARADC generation, pins, reference voltage or test interface. Check its SoC TRM, BSP and DTS; do not copy example IRQ/channel numbers indiscriminately. Neither source has standalone technical figures. No hardware sampling tests were performed.

> Source overview: 6 channels, 10bit, 1MSPS at 13MHz; the Chinese wording calls it a digital-to-analog converter. Reconcile this wording and the later 0–7 test channels with the actual chip, not by silently changing source values. Both DTS examples use io-channel-cells without # and associate 1.8V with 1024; verify the actual binding/resolution. Section 6 logs contain both 537 and 538 although the original explanation only says 537; both are retained.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. SARADC driver

### 1.1 Driver file

Driver path: `drivers/iio/adc/rockchip_saradc.c`

### 1.2 DTS node configuration

Refer to `Documentation/devicetree/bindings/iio/adc/rockchip-saradc.txt`. Key parameters:

- `interrupts = <GIC_SPI 62 IRQ_TYPE_LEVEL_HIGH 0>;`: interrupt on conversion completion.
- `io-channel-cells = <1>;`: must be 1; see iio-bindings.txt.
- `vref-supply = <&vccadc_ref>;`: set the reference voltage for the hardware. The source gives a maximum of 1.8V corresponding to SARADC value 1024, with a linear voltage/ADC relationship.

## 2. Using SARADC

### 2.1 Overview

As an IIO instance, SARADC needs a `struct iio_dev` initialized and registered through `iio_device_register(indio_dev)`; see `rockchip_saradc_probe`.

A major use is adc-key. Its key driver depends on the input framework: initialize `struct input_polled_dev` and register using `input_register_polled_device(poll_dev);`; see `adc_keys_probe` in `drivers/input/keyboard/adc-keys.c`.

Use getevent to test keys. Assuming adc-key is event0, `getevent -s /dev/input/event0` follows this call chain:

```text
adc_keys_poll -> iio_read_channel_processed -> iio_channel_read -> chan->indio_dev
->info->read_raw(rockchip_saradc_read_raw) -> iio_convert_raw_to_processed_unlocked
```

This is the complete adc-key sampling path and can be used to trace SARADC operation.

### 2.2 Workflow

#### 2.2.1 Sampling configuration

`rockchip_saradc_read_raw` configures sampling. In the driver it is primarily implemented through the `start` callback of `struct rockchip_saradc_data`; the configuration differences between the three versions therefore mainly lie in this callback.

##### 2.2.1.1 rockchip_saradc_start_v1

```text
writel_relaxed(8, info->regs + SARADC_DLY_PU_SOC);
```

Set the delay between power-up and sampling start.

```text
writel(SARADC_CTRL_POWER_CTRL | (chan->channel & SARADC_CTRL_CHN_MASK) |
SARADC_CTRL_IRQ_ENABLE,info->regs + SARADC_CTRL);
```

Set the sampling channel, enable interrupts and start sampling. These are the main V1 configuration steps.

##### 2.2.1.2 rockchip_saradc_start_v2

```text
writel_relaxed(0xc, info->regs + SARADC_T_DAS_SOC);
writel_relaxed(0x20, info->regs + SARADC_T_PD_SOC);
```

Configure PHY compatibility.

```text
val = FIELD_PREP(SARADC2_EN_END_INT, 1);
val |= SARADC2_EN_END_INT << 16;
writel_relaxed(val, info->regs + SARADC2_END_INT_EN);
```

Enable the END_INT interrupt.

```text
val = FIELD_PREP(SARADC2_START, 1) |
    FIELD_PREP(SARADC2_SINGLE_MODE, 1) |
    FIELD_PREP(SARADC2_CONV_CHANNELS, chn);
val |= (SARADC2_START | SARADC2_SINGLE_MODE | SARADC2_CONV_CHANNELS) << 16;
writel(val, info->regs + SARADC2_CONV_CON);
```

Set the sampling mode and channel, then start sampling.

##### 2.2.1.3 rockchip_saradc_start_v3

V3 non-DMA configuration is the same as V2. V3 DMA mode calls rockchip_saradc_start_v3_dma.

###### 2.2.1.3.1 rockchip_saradc_start_v3_dma

```text
writel_relaxed(0x11, info->regs + SARADC_T_DAS_SOC);
writel_relaxed(0x20, info->regs + SARADC_T_PD_SOC);
writel_relaxed(0x0, info->regs + SARADC_T_SEL_SOC);
```

Configure PHY compatibility.

```text
val = FIELD_PREP(SARADC3_PMASTER_EN, 1);
val |= SARADC3_PMASTER_EN << 16;
writel_relaxed(val, info->regs + SARADC3_FIFO_CON);
```

Enable FIFO functionality.

```text
writel_relaxed((u64)info->dma_phys >> 32, info->regs + SARADC3_PADDR_BASE_H);
writel_relaxed(((u32)info->dma_phys) >> 2, info->regs + SARADC3_PADDR_BASE_L);
```

Configure the DMA destination buffer address.

```text
writel_relaxed((SARADC3_DMA_SIZE >> 2) - 1, info->regs + SARADC3_PADDR_OFF_MAX);
```

Configure the DMA write-buffer size.

```text
val = FIELD_PREP(SARADC3_EN_END_MAX_INT, 1);
val |= SARADC3_EN_END_MAX_INT << 16;
writel_relaxed(val, info->regs + SARADC2_END_INT_EN);
```

Configure the MAX_INT interrupt.

```text
val = BIT(chn) << 16 | BIT(chn);
writel_relaxed(val, info->regs + SARADC3_AUTO_CH_EN);
```

Set the selected channel to auto mode.

```text
val = FIELD_PREP(SARADC2_START, 1) |
    FIELD_PREP(SARADC3_AUTO_MODE, 1) |
    FIELD_PREP(SARADC2_CONV_CHANNELS, chn);
val |= (SARADC2_START | SARADC3_AUTO_MODE | SARADC2_CONV_CHANNELS) << 16;
writel(val, info->regs + SARADC2_CONV_CON);
```

Configure continuous sampling mode and start sampling.

#### 2.2.2 Wait for sampling completion

```text
wait_for_completion_timeout(&info->completion, SARADC_TIMEOUT)
```

#### 2.2.3 Read data

Completion generates an interrupt. `rockchip_saradc_isr` calls `rockchip_saradc_read` to store the sample in `info->last_val`, wakes `rockchip_saradc_read_raw`, and returns it through `*val = info->last_val`. The read implementations for the versions are:

```text
rockchip_saradc_read_v1
rockchip_saradc_read_v2
rockchip_saradc_read_v3
```

The read functions are simple and are not analyzed further in the source.

#### 2.2.4 Turn SARADC off

Call the following function to turn SARADC off. Only V1 requires manual shutdown; V2/V3 shut down automatically after sampling.

```text
rockchip_saradc_power_down
```

#### 2.2.5 Summary

A full cycle configures and enables SARADC through `rockchip_saradc_read_raw`, starts sampling and waits for an interrupt. The handler clears the interrupt, reads the sample, wakes `rockchip_saradc_read_raw`, returns the sample and shuts SARADC down.

## 3. Kernel configuration

```text
Symbol: ROCKCHIP_SARADC [=y]
Type  : tristate
Prompt: Rockchip SARADC driver
    Location:
        -> Device Drivers
            -> Industrial I/O support (IIO [=y])
(1)             -> Analog to digital converters
    Defined at drivers/iio/adc/Kconfig:319
    Depends on: IIO [=y] && (ARCH_ROCKCHIP [=y] || ARM && COMPILE_TEST [=n]) &&
    RESET_CONTROLLER [=y]
```

## 4. Common SARADC interfaces

1. Obtain ADC values from userspace; * is the channel number:

```sh
cat /sys/bus/iio/devices/iio\:device0/in_voltage*_raw
```

For example, channel0:

```sh
cat /sys/bus/iio/devices/iio\:device0/in_voltage0_raw
```

2. Kernel interfaces: `iio_read_channel_raw()` obtains the ADC value; `iio_read_channel_processed()` obtains voltage.

## 5. V2/V3 improvements

V2 is incompatible with V1 and adds threshold-interrupt and automatic-sampling modes.

V3 is compatible with V2 and adds DMA writes to external memory.

## 6. Test interface

Enable:

```text
CONFIG_ROCKCHIP_SARADC_TEST_CHN
```

This creates a saradc_test_chn node under sys. Locate its full path:

```text
echo chn > /sys/full_path_of_saradc_test_chn/saradc_test_chn
```

For chn values 0–7, the corresponding channel is sampled continuously and the serial port outputs:

```text
chn[0] val = 537
chn[0] val = 537
chn[0] val = 538
```

The source describes this log as channel 0 having sample value 537.

```text
echo 8 > /sys/full_path_of_saradc_test_chn/saradc_test_chn
```

Write a value greater than the maximum valid channel number, for example 8, to stop sampling.

## English V1.0.0 supplement: older V1 implementation

English pages 5–6 specify a delay of 8 sclk cycles and explicitly list power-up, channel selection, interrupt enable and sampling start. After completion and the interrupt, the sample is assigned to val; `iio_convert_raw_to_processed_unlocked` converts it to voltage. The older ISR reads SARADC_DATA directly, then writes 0 to clear the interrupt and turn SARADC off:

```c
*val = info->last_val;
info->last_val = readl_relaxed(info->regs + SARADC_DATA);
writel_relaxed(0, info->regs + SARADC_CTRL);
```

{% endraw %}
