---
title: "Rockchip FLEXBUS ADC/DAC Guide: Parallel Converters, DMA and IIO"
description: "Rockchip FLEXBUS ADC/DAC Guide: Parallel Converters, DMA and IIO with complete technical sections, code, parameters and source caveats."
translation_key: "060-rockchip-flexbus-adc-dac"
slug: "060-rockchip-flexbus-adc-dac"
lang: "en"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus-adc-dac"
excerpt: "Rockchip FLEXBUS ADC/DAC Guide: Parallel Converters, DMA and IIO with complete technical sections, code, parameters and source caveats."
---

{% raw %}

# Rockchip FLEXBUS ADC/DAC Guide: Parallel Converters, DMA and IIO

This complete source-based technical article is an ArmSoM platform reference. Source scope: RK3576, Linux kernel 6.1. Verify the actual board, SoC, SDK/BSP branch, pins and peripherals before use. No board-level hardware validation has been performed, and support on all ArmSoM boards is not implied. Outputs and measurements are source examples, not ArmSoM test results.

Chinese follows the Chinese source; English follows the English source; Russian fully translates the English technical body. Code, comments and command output retain their source language. The source technical body contains no independent technical figures or tables; none have been invented.

Both source versions are V1.0.0.

**Operational caution:** reserved memory, DMA, pin multiplexing and device writes affect hardware. Commands are provided for reading; no hardware operations were executed. Verify the schematic, power, timing and actual device. Any xxx or ellipsis in DTS is a source placeholder, not a complete usable configuration.

**Source issues:** English §2.3.1 says iio:device1, whereas its command and the Chinese explanation use iio:device2. In both sources, §2.3.2 changes to device0 but the following prompt is device2. These original values are retained. Identify the DAC using its name file before writing; do not blindly copy device numbers.

Sources and repairs: [EDITORIAL-NOTES](/docs/rockchip-flexbus-adc-dac/EDITORIAL-NOTES.md)。Official references: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Source product-version table (PDF p.2; source scope, not board-level validation):

| Chipset | Kernel Version |
| --- | --- |
| RK3576 | 6.1 |

<!-- Source EN PDF p.5, block 0 -->

## 1. FLEXBUS ADC mode

<!-- Source EN PDF p.5, block 1 -->

### 1.1 Overview

<!-- Source EN PDF p.5, block 2 -->

FLEXBUS ADC mode is FLEXBUS1 interfacing high-speed parallel ADC devices such as TI ADS6144 (https://www.ti.com/product/ADS6144) and ADI LTC2207 (https://www.analog.com/en/products/ltc2207.html). ADC devices with interface types such as SPI and I2C are not supported.

<!-- Source EN PDF p.5, block 3 -->

Clock frequency up to 100MHz

<!-- Source EN PDF p.5, block 4 -->

Resolution up to 16-Bit

<!-- Source EN PDF p.5, block 5 -->

### 1.2 Configuration

<!-- Source EN PDF p.5, block 6 -->

#### 1.2.1 Hardware configuration

<!-- Source EN PDF p.5, block 7 -->

The LSB of the ADC device needs to be connected to FLEXBUS1_D0, such as 10-Bit ADC to FLEXBUS1_D[9:0], 16-Bit ADC to FLEXBUS1_D[15:0]

<!-- Source EN PDF p.5, block 8 -->

Slave mode indicates that the device provides CLK to FLEXBUS1, and master mode indicates that FLEXBUS1 provides CLK to the device

<!-- Source EN PDF p.5, block 9 -->

#### 1.2.2 Kernel configuration

<!-- Source EN PDF p.5, block 10 -->

FLEXBUS ADC mode relies on the iio/adc framework.

<!-- Source EN PDF p.5, block 11 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source EN PDF p.5, block 12 -->

`Device Drivers -> Industrial I/O support -> Analog to digital converters -> Rockchip Flexbus ADC opmode driver`

<!-- Source EN PDF p.5, block 13 -->

#### 1.2.3 dtsi configuration

<!-- Source EN PDF p.5, block 14 -->

Take RK3576 platform and RK3576 TEST1 board, FLEXBUS1 for ADC as an example.

<!-- Source EN PDF p.5, block 15 -->

In rk3576.dtsi:

<!-- Source EN PDF p.5, block 16 -->

```text
flexbus: flexbus@2a2f0000 {
    ......
    flexbus_adc: adc {
        compatible = "rockchip,flexbus-adc";
        #io-channel-cells = <0>;
        rockchip,slave-mode; // Configuring this is the slave mode, not configuring this is the master mode
        rockchip,free-sclk; // Configuring this is clock keeps output, not configuring this is clock follows data
        rockchip,auto-pad; // Default configuration
        rockchip,cpol; // Configuring this is CPOL = 1, not configuring this is 0
        rockchip,cpha; // Configuring this is CPHA = 1, not configuring this is 0
        rockchip,dfs = <16>; // data frames
        status = "disabled";
    };
    flexbus_dac: dac {
        ......
    };
};
```

<!-- Source EN PDF p.6, block 18 -->

rockchip,slave-mode: With configuring this is slave mode, the device provides CLK to FLEXBUS1; Without configuring this is master mode, FLEXBUS1 provides CLK to the device

<!-- Source EN PDF p.6, block 19 -->

rockchip,free-sclk: With configuring this, clock keeps output; Without configuring this, clock follow data (this configuration is only valid in master mode)

<!-- Source EN PDF p.6, block 20 -->

rockchip,cpol, rockchip,cpha: Same as SPI protocol definitions, configured according to the timing diagram in the device datasheet

<!-- Source EN PDF p.6, block 21 -->

rockchip,dfs: data frames, only support configuration of 4, 8, 16; If the resolution of the device is not 4, 8 or 16, it needs to be rounded up; For example, when using ADC devices with 14-Bit resolution, rockchip,dfs needs to be configured to 16, and only 14bit data is obtained through software processing when receiving data

<!-- Source EN PDF p.6, block 22 -->

In arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi:

<!-- Source EN PDF p.6, block 23 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_xxx>;
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_ADC>; // FLEXBUS1 selects ADC mode
    status = "okay"; // Enable FLEXBUS
};
&flexbus_adc {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus1m4_csn &flexbus1_clk
             &flexbus1_d0 &flexbus1_d1 &flexbus1_d2 &flexbus1_d3
             &flexbus1_d4 &flexbus1_d5 &flexbus1_d6 &flexbus1_d7
             &flexbus1_d8 &flexbus1_d9 &flexbus1_d10 &flexbus1_d11
             &flexbus1m1_d12 &flexbus1m1_d13 &flexbus1m1_d14 &flexbus1m1_d15>;
// Configure IOMUX for FLEXBUS1 ADC mode
    status = "okay"; // Enable ADC mode
};
```

<!-- Source EN PDF p.7, block 24 -->

#### 1.2.4 Driver file

<!-- Source EN PDF p.7, block 25 -->

The driver file is drivers/iio/adc/rockchip-flexbus-adc.c.

<!-- Source EN PDF p.7, block 26 -->

rockchip_flexbus_adc_read_block() is a function of reading ADC device data. The main operations are as follows:

<!-- Source EN PDF p.7, block 27 -->

(1) `rockchip_flexbus_writel(rkfb, FLEXBUS_RX_NUM, num_of_dfs);`

<!-- Source EN PDF p.7, block 28 -->

Configure the number of RX in dfs (rockchip,dfs in dtsi)

<!-- Source EN PDF p.7, block 29 -->

(2) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_DST_ADDR0, (ulong)dst_phys >> 2);`

<!-- Source EN PDF p.7, block 30 -->

Configure physical address of dst buffer

<!-- Source EN PDF p.7, block 31 -->

(3) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_DST_LEN0, dst_len);`

<!-- Source EN PDF p.7, block 32 -->

Configure length of dst buffer

<!-- Source EN PDF p.7, block 33 -->

(4) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_RX_ENR);`

<!-- Source EN PDF p.7, block 34 -->

Enable RX transfer

<!-- Source EN PDF p.7, block 35 -->

(5) `wait_for_completion_timeout(&rkfb_adc->completion, FLEXBUS_ADC_TIMEOUT)`

<!-- Source EN PDF p.7, block 36 -->

Wait for the RX transfer to complete and generate an interrupt (the interrupt handler is rockchip_flexbus_adc_isr())

<!-- Source EN PDF p.7, block 37 -->

(6) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_RX_DIS);`

<!-- Source EN PDF p.7, block 38 -->

Disable RX transfer

<!-- Source EN PDF p.7, block 39 -->

### 1.3 Common interface

<!-- Source EN PDF p.7, block 40 -->

#### 1.3.1 Check the device corresponding to FLEXBUS ADC

<!-- Source EN PDF p.7, block 41 -->

For example:

<!-- Source EN PDF p.7, block 42 -->

```text
root@rk3576-buildroot:/# cat /sys/bus/iio/devices/iio\:device0/name
2a2f0000.flexbus:adc
```

<!-- Source EN PDF p.7, block 43 -->

FLEXBUS ADC corresponds to iio:device0.

<!-- Source EN PDF p.7, block 44 -->

#### 1.3.2 Get ADC value

<!-- Source EN PDF p.7, block 45 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat in_voltage_raw
33004
```

<!-- Source EN PDF p.8, block 46 -->

#### 1.3.3 Get and change clock frequency

<!-- Source EN PDF p.8, block 47 -->

Get clock frequency:

<!-- Source EN PDF p.8, block 48 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat in_voltage_sampling_frequency
99000000
```

<!-- Source EN PDF p.8, block 49 -->

The current clock frequency is 99MHz.

<!-- Source EN PDF p.8, block 50 -->

Change clock frequency:

<!-- Source EN PDF p.8, block 51 -->

```text
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# echo 25000000 > in_voltage_sampling_frequency
```

<!-- Source EN PDF p.8, block 52 -->

The clock frequency is changed to 25MHz。

<!-- Source EN PDF p.8, block 53 -->

Note:

<!-- Source EN PDF p.8, block 54 -->

Only master mode supports getting and changing clock frequency. The CLK of slave mode comes from the ADC device

<!-- Source EN PDF p.8, block 55 -->

Clock frequency up to 100MHz

<!-- Source EN PDF p.8, block 56 -->

## 2. FLEXBUS DAC mode

<!-- Source EN PDF p.8, block 57 -->

### 2.1 Overview

<!-- Source EN PDF p.8, block 58 -->

FLEXBUS DAC mode is FLEXBUS0 interfacing high-speed parallel DAC devices such as ADI max5885 (https://www.analog.com/en/products/max5885.html) and ADI AD9744 (https://www.analog.com/en/products/ad9744.html). DAC devices with interface types such as SPI and I2C are not supported.

<!-- Source EN PDF p.8, block 59 -->

Clock frequency up to 100MHz

<!-- Source EN PDF p.8, block 60 -->

Resolution up to 16-Bit

<!-- Source EN PDF p.8, block 61 -->

### 2.2 Configuration

<!-- Source EN PDF p.8, block 62 -->

#### 2.2.1 Hardware configuration

<!-- Source EN PDF p.8, block 63 -->

The LSB of the DAC device needs to be connected to FLEXBUS0_D0, such as 10-Bit DAC to FLEXBUS0_D[9:0], 16-Bit DAC to FLEXBUS0_D[15:0]

<!-- Source EN PDF p.9, block 64 -->

#### 2.2.2 Kernel configuration

<!-- Source EN PDF p.9, block 65 -->

FLEXBUS DAC mode relies on the iio/dac framework.

<!-- Source EN PDF p.9, block 66 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source EN PDF p.9, block 67 -->

`Device Drivers -> Industrial I/O support -> Digital to analog converters -> Rockchip Flexbus DAC opmode driver`

<!-- Source EN PDF p.9, block 68 -->

#### 2.2.3 dtsi configuration

<!-- Source EN PDF p.9, block 69 -->

Take RK3576 platform and RK3576 TEST1 board, FLEXBUS0 for DAC as an example.

<!-- Source EN PDF p.9, block 70 -->

In rk3576.dtsi:

<!-- Source EN PDF p.9, block 71 -->

```text
flexbus: flexbus@2a2f0000 {
    ......
    flexbus_adc: adc {
        ......
    };
    flexbus_dac: dac {
        compatible = "rockchip,flexbus-dac";
        #io-channel-cells = <0>;
        rockchip,free-sclk; // Configuring this is clock keeps output, not configuring this is clock follows data
        rockchip,cpol; // Configuring this is CPOL = 1, not configuring this is 0
        rockchip,cpha; // Configuring this is CPHA = 1, not configuring this is 0
        rockchip,dfs = <16>; // data frames
        status = "disabled";
    };
};
```

<!-- Source EN PDF p.9, block 72 -->

rockchip,free-sclk: With configuring this, clock keeps output; Without configuring this, clock follow data

<!-- Source EN PDF p.9, block 73 -->

rockchip,cpol, rockchip,cpha: Same as SPI protocol definitions, configured according to the timing diagram in the device datasheet

<!-- Source EN PDF p.9, block 74 -->

rockchip,dfs: data frames, only support configuration of 4, 8, 16; If the resolution of the device is not 4, 8 or 16, it needs to be rounded up; For example, when using DAC devices with 14-Bit resolution, rockchip,dfs needs to be configured to 16, and bit15 and bit14 of the sent data are replaced by 0.

<!-- Source EN PDF p.9, block 75 -->

In arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi:

<!-- Source EN PDF p.9, block 76 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 selects DAC mode
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_xxx>;
    status = "okay"; // Enable FLEXBUS
};
&flexbus_dac {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus0m4_csn &flexbus0_clk
             &flexbus0_d0 &flexbus0_d1 &flexbus0_d2 &flexbus0_d3
             &flexbus0_d4 &flexbus0_d5 &flexbus0_d6 &flexbus0_d7
             &flexbus0_d8 &flexbus0_d9 &flexbus0_d10 &flexbus0_d11
             &flexbus0_d12 &flexbus0m0_d13 &flexbus0m0_d14 &flexbus0m0_d15>;
// Configure IOMUX for FLEXBUS0 DAC mode
    status = "okay"; // Enable DAC mode
};
```

<!-- Source EN PDF p.10, block 78 -->

#### 2.2.4 Driver file

<!-- Source EN PDF p.10, block 79 -->

The driver file is drivers/iio/dac/rockchip-flexbus-dac.c.

<!-- Source EN PDF p.10, block 80 -->

rockchip_flexbus_dac_write_block() is a function of sending data to DAC device. The main operations are as follows:

<!-- Source EN PDF p.10, block 81 -->

(1) `rockchip_flexbus_writel(rkfb, FLEXBUS_TX_NUM, num_of_dfs);`

<!-- Source EN PDF p.10, block 82 -->

Configure the number of TX in dfs (rockchip,dfs in dtsi)

<!-- Source EN PDF p.10, block 83 -->

(2) `rockchip_flexbus_writel(rkfb, FLEXBUS_TXWAT_START, val);`

<!-- Source EN PDF p.10, block 84 -->

Configure waterline

<!-- Source EN PDF p.10, block 85 -->

(3) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_SRC_ADDR0, (ulong)src_phys >> 2);`

<!-- Source EN PDF p.10, block 86 -->

Configure physical address of src buffer

<!-- Source EN PDF p.10, block 87 -->

(4) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_SRC_LEN0, src_len);`

<!-- Source EN PDF p.10, block 88 -->

Configure length of src buffer

<!-- Source EN PDF p.10, block 89 -->

(5) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_TX_ENR);`

<!-- Source EN PDF p.10, block 90 -->

Enable TX transfer

<!-- Source EN PDF p.10, block 91 -->

(6) `wait_for_completion_timeout(&rkfb_dac->completion, FLEXBUS_DAC_TIMEOUT)`

<!-- Source EN PDF p.10, block 92 -->

Wait for the TX transfer to complete and generate an interrupt (the interrupt handler is rockchip_flexbus_dac_isr())

<!-- Source EN PDF p.10, block 93 -->

(7) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_TX_DIS);`

<!-- Source EN PDF p.10, block 94 -->

Disable TX transfer

<!-- Source EN PDF p.10, block 95 -->

### 2.3 Common interface

<!-- Source EN PDF p.10, block 96 -->

#### 2.3.1 Check the device corresponding to FLEXBUS DAC

<!-- Source EN PDF p.10, block 97 -->

For example:

<!-- Source EN PDF p.10, block 98 -->

```text
root@rk3576-buildroot:/# cat /sys/bus/iio/devices/iio\:device2/name
2a2f0000.flexbus:dac
```

<!-- Source EN PDF p.11, block 99 -->

FLEXBUS DAC corresponds to iio:device1.

<!-- Source EN PDF p.11, block 100 -->

#### 2.3.2 Send data to DAC

<!-- Source EN PDF p.11, block 101 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# echo 16383 > out_voltage_raw
```

<!-- Source EN PDF p.11, block 102 -->

#### 2.3.3 Get and change clock frequency

<!-- Source EN PDF p.11, block 103 -->

Get clock frequency:

<!-- Source EN PDF p.11, block 104 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device2
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# cat out_voltage_sampling_frequency
99000000
```

<!-- Source EN PDF p.11, block 105 -->

The current clock frequency is 99MHz.

<!-- Source EN PDF p.11, block 106 -->

Change clock frequency:

<!-- Source EN PDF p.11, block 107 -->

```text
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# echo 25000000 > out_voltage_sampling_frequency
```

<!-- Source EN PDF p.11, block 108 -->

The clock frequency is changed to 25MHz。

<!-- Source EN PDF p.11, block 109 -->

Note:

<!-- Source EN PDF p.11, block 110 -->

Clock frequency up to 100MHz

{% endraw %}
