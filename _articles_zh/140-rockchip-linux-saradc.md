---
title: "Rockchip Linux SARADC：V1/V2/V3 驱动、DMA与测试接口"
description: "Rockchip Linux SARADC：V1/V2/V3 驱动、DMA与测试接口 — V1.1.0 / V1.0.0"
excerpt: "Rockchip Linux SARADC：V1/V2/V3 驱动、DMA与测试接口"
translation_key: "140-rockchip-linux-saradc"
slug: "140-rockchip-linux-saradc"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, Linux, SARADC, DMA]
---

{% raw %}

# Rockchip Linux SARADC：V1/V2/V3 驱动、DMA与测试接口

以中文RK-KF-YF-079 V1.1.0（8页）为四语主线，英文V1.0.0（7页）的独有说明单列补充。中文范围为Rockchip/Linux 4.4、4.19、5.10、6.1；这是平台参考，未确认某ArmSoM板卡的SARADC代际、引脚、参考电压或测试接口支持。核对具体SoC TRM、BSP与DTS，不把示例IRQ/通道号直接套用。两稿无独立技术配图。未进行硬件采样测试。

> 原稿概述：6通道、10bit、输入13MHz时1MSPS，中文称“数模转化器”。这些措辞与ADC用途、后文0–7测试通道需按具体芯片核对；不静默改原值。两稿DTS写io-channel-cells（未带#）及1.8V对应1024，照录并提示检查实际binding/分辨率。第6章日志含537和538，原文解释仅说537，保留两者。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. SARADC 驱动

### 1.1 驱动文件

驱动文件所在位置:drivers/iio/adc/rockchip_saradc.c

### 1.2 DTS 节点配置

DTS配置参考 `Documentation/devicetree/bindings/iio/adc/rockchip-saradc.txt`，主要参数：

- `interrupts = <GIC_SPI 62 IRQ_TYPE_LEVEL_HIGH 0>;`：转换完成产生中断。
- `io-channel-cells = <1>;`：必须为1，见iio-bindings.txt。
- `vref-supply = <&vccadc_ref>;`：参考电压按具体硬件设置，原文最大1.8V对应SARADC值1024，电压与ADC值呈线性关系。

## 2. SARADC 使用

### 2.1 概述

SARADC作为IIO框架的实例，需要实例化 `struct iio_dev`，调用 `iio_device_register(indio_dev)` 注册，见 `rockchip_saradc_probe`。

adc-key是主要应用实例，其key驱动依赖input框架，需要实例化 `struct input_polled_dev`，调用 `input_register_polled_device(poll_dev);` 注册，见 `drivers/input/keyboard/adc-keys.c` 的 `adc_keys_probe`。

通常使用getevent测试按键，假设adc-key为event0，执行 `getevent -s /dev/input/event0` 的调用关系如下：

```text
adc_keys_poll -> iio_read_channel_processed -> iio_channel_read -> chan->indio_dev
->info->read_raw(rockchip_saradc_read_raw) -> iio_convert_raw_to_processed_unlocked
```

以上是adc-key采样的完整路径,可以按照以上的路径跟踪saradc工作流程。

### 2.2 工作流程

#### 2.2.1 采样配置

`rockchip_saradc_read_raw` 是采样配置的主要函数。驱动中主要由 `struct rockchip_saradc_data` 的 `start` 回调实现，三个版本的采样配置差异主要体现在start回调上。

##### 2.2.1.1 rockchip_saradc_start_v1

```text
writel_relaxed(8, info->regs + SARADC_DLY_PU_SOC);
```

设置power up到开始采样的间隔。

```text
writel(SARADC_CTRL_POWER_CTRL | (chan->channel & SARADC_CTRL_CHN_MASK) |
SARADC_CTRL_IRQ_ENABLE,info->regs + SARADC_CTRL);
```

设置采样通道,使能中断,开始采样。以上是V1版本采样配置的主要步骤。

##### 2.2.1.2 rockchip_saradc_start_v2

```text
writel_relaxed(0xc, info->regs + SARADC_T_DAS_SOC);
writel_relaxed(0x20, info->regs + SARADC_T_PD_SOC);
```

配置PHY兼容性

```text
val = FIELD_PREP(SARADC2_EN_END_INT, 1);
val |= SARADC2_EN_END_INT << 16;
writel_relaxed(val, info->regs + SARADC2_END_INT_EN);
```

使能END_INT中断

```text
val = FIELD_PREP(SARADC2_START, 1) |
    FIELD_PREP(SARADC2_SINGLE_MODE, 1) |
    FIELD_PREP(SARADC2_CONV_CHANNELS, chn);
val |= (SARADC2_START | SARADC2_SINGLE_MODE | SARADC2_CONV_CHANNELS) << 16;
writel(val, info->regs + SARADC2_CONV_CON);
```

设置采样模式,设置采样通道,开始采样。

##### 2.2.1.3 rockchip_saradc_start_v3

V3非DMA模式配置和V2一样。V3版本DMA模式调用函数rockchip_saradc_start_v3_dma。

###### 2.2.1.3.1 rockchip_saradc_start_v3_dma

```text
writel_relaxed(0x11, info->regs + SARADC_T_DAS_SOC);
writel_relaxed(0x20, info->regs + SARADC_T_PD_SOC);
writel_relaxed(0x0, info->regs + SARADC_T_SEL_SOC);
```

配置PHY兼容性

```text
val = FIELD_PREP(SARADC3_PMASTER_EN, 1);
val |= SARADC3_PMASTER_EN << 16;
writel_relaxed(val, info->regs + SARADC3_FIFO_CON);
```

使能FIFO功能

```text
writel_relaxed((u64)info->dma_phys >> 32, info->regs + SARADC3_PADDR_BASE_H);
writel_relaxed(((u32)info->dma_phys) >> 2, info->regs + SARADC3_PADDR_BASE_L);
```

配置DMA写buffer目的地址。

```text
writel_relaxed((SARADC3_DMA_SIZE >> 2) - 1, info->regs + SARADC3_PADDR_OFF_MAX);
```

配置DMA写buffer的size。

```text
val = FIELD_PREP(SARADC3_EN_END_MAX_INT, 1);
val |= SARADC3_EN_END_MAX_INT << 16;
writel_relaxed(val, info->regs + SARADC2_END_INT_EN);
```

配置MAX_INT中断。

```text
val = BIT(chn) << 16 | BIT(chn);
writel_relaxed(val, info->regs + SARADC3_AUTO_CH_EN);
```

配置对应通道为auto模式。

```text
val = FIELD_PREP(SARADC2_START, 1) |
    FIELD_PREP(SARADC3_AUTO_MODE, 1) |
    FIELD_PREP(SARADC2_CONV_CHANNELS, chn);
val |= (SARADC2_START | SARADC3_AUTO_MODE | SARADC2_CONV_CHANNELS) << 16;
writel(val, info->regs + SARADC2_CONV_CON);
```

配置循环采样模式,并开启采样。

#### 2.2.2 等待saradc完成采样

```text
wait_for_completion_timeout(&info->completion, SARADC_TIMEOUT)
```

#### 2.2.3 读数据

采样完成产生中断，`rockchip_saradc_isr` 调用 `rockchip_saradc_read` 读取采样值存入 `info->last_val`，唤醒 `rockchip_saradc_read_raw`，通过 `*val = info->last_val` 赋值返回。不同版本的read实现分别为：

```text
rockchip_saradc_read_v1
rockchip_saradc_read_v2
rockchip_saradc_read_v3
```

由于read函数比较简单,不展开分析。

#### 2.2.4 关闭saradc

调用以下函数关闭saradc,只有V1版本需要手动关闭,V2/V3采样结束自动关闭。

```text
rockchip_saradc_power_down
```

#### 2.2.5 总结

完整过程：`rockchip_saradc_read_raw` 配置并打开SARADC，开始采样，等待中断；中断函数清除中断、读取采样值，唤醒 `rockchip_saradc_read_raw`，返回采样值，关闭SARADC。

## 3. 内核配置

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

## 4. SARADC常用接口

1. 用户态获取ADC值，*为通道号：

```sh
cat /sys/bus/iio/devices/iio\:device0/in_voltage*_raw
```

例如channel0：

```sh
cat /sys/bus/iio/devices/iio\:device0/in_voltage0_raw
```

2. 内核接口：获取ADC值 `iio_read_channel_raw()`；获取电压 `iio_read_channel_processed()`。

## 5. V2/V3的改进

V2不兼容V1，增加阈值中断模式和自动采样模式。

V3兼容V2，并增加DMA写外部内存模式。

## 6. 测试接口

需要使能

```text
CONFIG_ROCKCHIP_SARADC_TEST_CHN
```

会在sys目录下生成saradc_test_chn节点,搜索saradc_test_chn完整路径

```text
echo chn > /sys/full_path_of_saradc_test_chn/saradc_test_chn
```

其中chn为0-7时即对相应的通道进行循环采样,并且串口会输出以下log:

```text
chn[0] val = 537
chn[0] val = 537
chn[0] val = 538
```

以上log即表示通道0的采样值为537。

```text
echo 8 > /sys/full_path_of_saradc_test_chn/saradc_test_chn
```

写大于最大有效通道号,比如8,即可关闭采样。

## 英文V1.0.0补充：V1旧实现细节

英文第5–6页明确延迟为8个sclk周期，并列出上电、选通道、使能中断/开始采样。等待完成和中断后，采样值赋给val；`iio_convert_raw_to_processed_unlocked` 将采样值换算为电压。旧版ISR直接读取SARADC_DATA，随后写0清中断并关闭SARADC：

```c
*val = info->last_val;
info->last_val = readl_relaxed(info->regs + SARADC_DATA);
writel_relaxed(0, info->regs + SARADC_CTRL);
```

{% endraw %}
