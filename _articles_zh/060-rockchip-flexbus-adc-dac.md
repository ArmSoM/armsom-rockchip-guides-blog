---
title: "Rockchip FLEXBUS ADC/DAC 完整指南：并行转换器、DMA 与 IIO"
description: "Rockchip FLEXBUS ADC/DAC 完整指南：并行转换器、DMA 与 IIO：保留完整技术章节、代码、参数及原文疑点。"
translation_key: "060-rockchip-flexbus-adc-dac"
slug: "060-rockchip-flexbus-adc-dac"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus-adc-dac"
excerpt: "Rockchip FLEXBUS ADC/DAC 完整指南：并行转换器、DMA 与 IIO：保留完整技术章节、代码、参数及原文疑点。"
---

{% raw %}

# Rockchip FLEXBUS ADC/DAC 完整指南：并行转换器、DMA 与 IIO

本文完整整理原厂技术正文，作为 ArmSoM 平台参考。原文适用范围：RK3576，Linux kernel 6.1。使用前须核对实际板卡、SoC、SDK/BSP 分支、引脚与外设配置；未做板级硬件验证，不代表所有 ArmSoM 板卡均支持。文中输出和数值为原文示例，不是 ArmSoM 实测。

中文保留中文原稿正文，英文保留英文原稿，俄文完整翻译英文正文；代码、注释和命令输出保留源语言。 原稿技术正文没有独立技术配图或表格，没有补造配图。

中英文原稿版本均为 V1.0.0。

**操作注意**：预留内存、DMA、引脚复用和设备写操作会影响实际硬件。所有命令仅供阅读，未执行硬件读写；先核对原理图、供电、时序和实际设备。DTS 中 xxx 和省略号是原文占位示例，不能直接当作完整配置。

**原文待核对**：英文 §2.3.1 说明写 iio:device1，但命令和中文说明使用 iio:device2；两份原稿 §2.3.2 的 cd 指向 device0，而下一行提示符是 device2。本文保留这些原值；实际写入前必须通过 name 文件确认 DAC 设备，不能直接照抄设备编号。

来源与修复详见 [EDITORIAL-NOTES](/docs/rockchip-flexbus-adc-dac/EDITORIAL-NOTES.md)。官方参考：[ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

原文产品版本表（PDF p.2；仅表示原稿范围，非板级验证结论）：

| 芯片名称 | 内核版本 |
| --- | --- |
| RK3576 | 6.1 |

<!-- Source CN PDF p.4, block 0 -->

## 1. FLEXBUS ADC 模式

<!-- Source CN PDF p.4, block 1 -->

### 1.1 概述

<!-- Source CN PDF p.4, block 2 -->

FLEXBUS ADC 模式指的是 FLEXBUS1 对接高速并行 ADC 器件，例如 TI 的 ADS6144（https://www.ti.com.cn/product/cn/ADS6144）、ADI 的 LTC2207（https://www.analog.com/cn/products/ltc2207.html）。不支持 SPI、I2C 等接口类型的 ADC 器件。

<!-- Source CN PDF p.4, block 3 -->

时钟频率最高 100MHz

<!-- Source CN PDF p.4, block 4 -->

分辨率最高 16-Bit

<!-- Source CN PDF p.4, block 5 -->

### 1.2 配置

<!-- Source CN PDF p.4, block 6 -->

#### 1.2.1 硬件配置

<!-- Source CN PDF p.4, block 7 -->

只支持将 ADC 器件的 LSB 连接到 FLEXBUS1_D0，例如 10-Bit ADC 连接至 FLEXBUS1_D[9:0]、16-Bit ADC 连接至 FLEXBUS1_D[15:0]

<!-- Source CN PDF p.4, block 8 -->

slave 模式为器件向 FLEXBUS1 提供 CLK，master 模式为 FLEXBUS1 向器件提供 CLK

<!-- Source CN PDF p.4, block 9 -->

#### 1.2.2 内核配置

<!-- Source CN PDF p.4, block 10 -->

FLEXBUS ADC 模式依赖 iio/adc 框架。

<!-- Source CN PDF p.4, block 11 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source CN PDF p.4, block 12 -->

`Device Drivers -> Industrial I/O support -> Analog to digital converters -> Rockchip Flexbus ADCopmode driver`

<!-- Source CN PDF p.4, block 13 -->

#### 1.2.3 dtsi 配置

<!-- Source CN PDF p.4, block 14 -->

以 RK3576 平台和 RK3576 TEST1 板子，FLEXBUS1 对接 ADC 为例。

<!-- Source CN PDF p.4, block 15 -->

rk3576.dtsi 中：

<!-- Source CN PDF p.4, block 16 -->

```text
flexbus: flexbus@2a2f0000 {
    ......
    flexbus_adc: adc {
        compatible = "rockchip,flexbus-adc";
        #io-channel-cells = <0>;
        rockchip,slave-mode; // 配置 slave 模式，不配置则为 master 模式
        rockchip,free-sclk; // 配置时钟保持输出，不配置则时钟跟随数据
        rockchip,auto-pad; // 默认配置
        rockchip,cpol; // 配置 CPOL = 1，不配置则为 0
        rockchip,cpha; // 配置 CPHA = 1，不配置则为 0
        rockchip,dfs = <16>; // data frames
        status = "disabled";
    };
    flexbus_dac: dac {
        ......
    };
};
```

<!-- Source CN PDF p.5, block 18 -->

rockchip,slave-mode：配置了为 slave 模式为器件向 FLEXBUS1 提供 CLK；不配置为 master 模式，FLEXBUS1 向器件提供 CLK

<!-- Source CN PDF p.5, block 19 -->

rockchip,free-sclk：配置了则时钟一直保持输出，不配置则只在数据传输时输出时钟（该配置仅在master 模式有效）

<!-- Source CN PDF p.5, block 20 -->

rockchip,cpol、rockchip,cpha：与 SPI 协议的定义相同，根据器件手册的时序图配置

<!-- Source CN PDF p.5, block 21 -->

rockchip,dfs：数据的位宽，仅支持配置成 4、8、16；如果器件分辨率不是 4、8 或 16，需要向上取整；例如对接 14-Bit 分辨率的 ADC 器件时，需要把 rockchip,dfs 配成 16，接收数据时通过软件处理只取 14bit 的数据

<!-- Source CN PDF p.5, block 22 -->

arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi 中：

<!-- Source CN PDF p.5, block 23 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_xxx>;
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_ADC>; // FLEXBUS1 选择 ADC 模式
    status = "okay"; // 使能 FLEXBUS
};
&flexbus_adc {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus1m4_csn &flexbus1_clk
             &flexbus1_d0 &flexbus1_d1 &flexbus1_d2 &flexbus1_d3
             &flexbus1_d4 &flexbus1_d5 &flexbus1_d6 &flexbus1_d7
             &flexbus1_d8 &flexbus1_d9 &flexbus1_d10 &flexbus1_d11
             &flexbus1m1_d12 &flexbus1m1_d13 &flexbus1m1_d14 &flexbus1m1_d15>;
// 配置 FLEXBUS1 ADC 模式需要的 IOMUX
    status = "okay"; // 使能 ADC 模式
};
```

<!-- Source CN PDF p.5, block 24 -->

#### 1.2.4 驱动文件

<!-- Source CN PDF p.5, block 25 -->

驱动文件为 drivers/iio/adc/rockchip-flexbus-adc.c。

<!-- Source CN PDF p.5, block 26 -->

其中 rockchip_flexbus_adc_read_block() 是 read ADC 器件数据的函数，主要操作有：

<!-- Source CN PDF p.5, block 27 -->

(1) `rockchip_flexbus_writel(rkfb, FLEXBUS_RX_NUM, num_of_dfs);`

<!-- Source CN PDF p.5, block 28 -->

配置 RX 数量，单位是 dfs（dtsi 中的 rockchip,dfs）

<!-- Source CN PDF p.5, block 29 -->

(2) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_DST_ADDR0, (ulong)dst_phys >> 2);`

<!-- Source CN PDF p.5, block 30 -->

配置 dst buffer 的物理地址

<!-- Source CN PDF p.5, block 31 -->

(3) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_DST_LEN0, dst_len);`

<!-- Source CN PDF p.6, block 32 -->

配置 dst buffer 的长度

<!-- Source CN PDF p.6, block 33 -->

(4) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_RX_ENR);`

<!-- Source CN PDF p.6, block 34 -->

Enable RX 传输

<!-- Source CN PDF p.6, block 35 -->

(5) `wait_for_completion_timeout(&rkfb_adc->completion, FLEXBUS_ADC_TIMEOUT)`

<!-- Source CN PDF p.6, block 36 -->

等待 RX 传输完成，产生中断（中断处理函数为 rockchip_flexbus_adc_isr()）

<!-- Source CN PDF p.6, block 37 -->

(6) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_RX_DIS);`

<!-- Source CN PDF p.6, block 38 -->

Disable RX 传输

<!-- Source CN PDF p.6, block 39 -->

### 1.3 常用接口

<!-- Source CN PDF p.6, block 40 -->

#### 1.3.1 确认 FLEXBUS ADC 对应的 device

<!-- Source CN PDF p.6, block 41 -->

例如：

<!-- Source CN PDF p.6, block 42 -->

```text
root@rk3576-buildroot:/# cat /sys/bus/iio/devices/iio\:device0/name
2a2f0000.flexbus:adc
```

<!-- Source CN PDF p.6, block 43 -->

说明 FLEXBUS ADC 对应 iio:device0

<!-- Source CN PDF p.6, block 44 -->

#### 1.3.2 获取 ADC 值

<!-- Source CN PDF p.6, block 45 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat in_voltage_raw
33004
```

<!-- Source CN PDF p.6, block 46 -->

#### 1.3.3 获取和修改时钟频率

<!-- Source CN PDF p.6, block 47 -->

获取时钟频率：

<!-- Source CN PDF p.6, block 48 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# cat in_voltage_sampling_frequency
99000000
```

<!-- Source CN PDF p.6, block 49 -->

说明当前时钟频率为 99MHz。

<!-- Source CN PDF p.6, block 50 -->

修改时钟频率：

<!-- Source CN PDF p.6, block 51 -->

```text
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device0# echo 25000000 > in_voltage_sampling_frequency
```

<!-- Source CN PDF p.6, block 52 -->

时钟频率就被改为 25MHz。

<!-- Source CN PDF p.6, block 53 -->

Note：

<!-- Source CN PDF p.6, block 54 -->

只有 master 模式支持获取和修改时钟频率，slave 模式的 CLK 来源于 ADC 器件

<!-- Source CN PDF p.7, block 55 -->

时钟频率最高 100MHz

<!-- Source CN PDF p.7, block 56 -->

## 2. FLEXBUS DAC 模式

<!-- Source CN PDF p.7, block 57 -->

### 2.1 概述

<!-- Source CN PDF p.7, block 58 -->

FLEXBUS DAC 模式指的是 FLEXBUS0 对接高速并行 DAC 器件，例如 ADI 的 MAX5885（https://www.analog.com/cn/products/max5885.html）、ADI 的 AD9744（https://www.analog.com/cn/products/ad9744.html）。不支持 SPI、I2C 等接口类型的 DAC 器件。

<!-- Source CN PDF p.7, block 59 -->

时钟频率最高 100MHz

<!-- Source CN PDF p.7, block 60 -->

分辨率最高 16-Bit

<!-- Source CN PDF p.7, block 61 -->

### 2.2 配置

<!-- Source CN PDF p.7, block 62 -->

#### 2.2.1 硬件配置

<!-- Source CN PDF p.7, block 63 -->

只支持将 DAC 器件的 LSB 连接到 FLEXBUS0_D0，例如 10-Bit DAC 连接至 FLEXBUS0_D[9:0]、16-Bit DAC 连接至 FLEXBUS0_D[15:0]

<!-- Source CN PDF p.7, block 64 -->

#### 2.2.2 内核配置

<!-- Source CN PDF p.7, block 65 -->

FLEXBUS DAC 模式依赖 iio/dac 框架。

<!-- Source CN PDF p.7, block 66 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source CN PDF p.7, block 67 -->

`Device Drivers -> Industrial I/O support -> Digital to analog converters -> Rockchip Flexbus DACopmode driver`

<!-- Source CN PDF p.7, block 68 -->

#### 2.2.3 dtsi 配置

<!-- Source CN PDF p.7, block 69 -->

以 RK3576 平台和 RK3576 TEST1 板子，FLEXBUS0 对接 DAC 为例。

<!-- Source CN PDF p.7, block 70 -->

rk3576.dtsi 中：

<!-- Source CN PDF p.7, block 71 -->

```text
flexbus: flexbus@2a2f0000 {
    ......
    flexbus_adc: adc {
        ......
    };
    flexbus_dac: dac {
        compatible = "rockchip,flexbus-dac";
        #io-channel-cells = <0>;
        rockchip,free-sclk; // 配置时钟保持输出，不配置则时钟跟随数据
        rockchip,cpol; // 配置 CPOL = 1，不配置则为 0
        rockchip,cpha; // 配置 CPHA = 1，不配置则为 0
        rockchip,dfs = <16>; // data frames
        status = "disabled";
    };
};
```

<!-- Source CN PDF p.8, block 73 -->

rockchip,free-sclk：配置了则时钟一直保持输出，不配置则只在数据传输时输出时钟

<!-- Source CN PDF p.8, block 74 -->

rockchip,cpol、rockchip,cpha：与 SPI 协议的定义相同，根据器件手册的时序图配置

<!-- Source CN PDF p.8, block 75 -->

rockchip,dfs：数据的位宽，仅支持配置成 4、8、16；如果器件分辨率不是 4、8 或 16，需要向上取整；例如对接 14-Bit 分辨率的 DAC 器件时，需要把 rockchip,dfs 配成 16，发送数据的 bit15、14 补 0

<!-- Source CN PDF p.8, block 76 -->

arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi 中：

<!-- Source CN PDF p.8, block 77 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 选择 DAC 模式
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_xxx>;
    status = "okay"; // 使能 FLEXBUS
};
&flexbus_dac {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus0m4_csn &flexbus0_clk
             &flexbus0_d0 &flexbus0_d1 &flexbus0_d2 &flexbus0_d3
             &flexbus0_d4 &flexbus0_d5 &flexbus0_d6 &flexbus0_d7
             &flexbus0_d8 &flexbus0_d9 &flexbus0_d10 &flexbus0_d11
             &flexbus0_d12 &flexbus0m0_d13 &flexbus0m0_d14 &flexbus0m0_d15>;
// 配置 FLEXBUS0 DAC 模式需要的 IOMUX
    status = "okay"; // 使能 DAC 模式
};
```

<!-- Source CN PDF p.8, block 78 -->

#### 2.2.4 驱动文件

<!-- Source CN PDF p.8, block 79 -->

驱动文件为 drivers/iio/dac/rockchip-flexbus-dac.c。

<!-- Source CN PDF p.8, block 80 -->

其中 rockchip_flexbus_dac_write_block() 是向 DAC 器件发送数据的函数，主要操作有：

<!-- Source CN PDF p.8, block 81 -->

(1) `rockchip_flexbus_writel(rkfb, FLEXBUS_TX_NUM, num_of_dfs);`

<!-- Source CN PDF p.8, block 82 -->

配置 TX 数量，单位是 dfs（dtsi 中的 rockchip,dfs）

<!-- Source CN PDF p.8, block 83 -->

(2) `rockchip_flexbus_writel(rkfb, FLEXBUS_TXWAT_START, val);`

<!-- Source CN PDF p.8, block 84 -->

配置水线

<!-- Source CN PDF p.8, block 85 -->

(3) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_SRC_ADDR0, (ulong)src_phys >> 2);`

<!-- Source CN PDF p.8, block 86 -->

配置 src buffer 的物理地址

<!-- Source CN PDF p.8, block 87 -->

(4) `rockchip_flexbus_writel(rkfb, FLEXBUS_DMA_SRC_LEN0, src_len);`

<!-- Source CN PDF p.8, block 88 -->

配置 src buffer 的长度

<!-- Source CN PDF p.8, block 89 -->

(5) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_TX_ENR);`

<!-- Source CN PDF p.8, block 90 -->

Enable TX 传输

<!-- Source CN PDF p.9, block 91 -->

(6) `wait_for_completion_timeout(&rkfb_dac->completion, FLEXBUS_DAC_TIMEOUT)`

<!-- Source CN PDF p.9, block 92 -->

等待 TX 传输完成，产生中断（中断处理函数为 rockchip_flexbus_dac_isr()）

<!-- Source CN PDF p.9, block 93 -->

(7) `rockchip_flexbus_writel(rkfb, FLEXBUS_ENR, FLEXBUS_TX_DIS);`

<!-- Source CN PDF p.9, block 94 -->

Disable TX 传输

<!-- Source CN PDF p.9, block 95 -->

### 2.3 常用接口

<!-- Source CN PDF p.9, block 96 -->

#### 2.3.1 确认 FLEXBUS DAC 对应的 device

<!-- Source CN PDF p.9, block 97 -->

例如：

<!-- Source CN PDF p.9, block 98 -->

```text
root@rk3576-buildroot:/# cat /sys/bus/iio/devices/iio\:device2/name
2a2f0000.flexbus:dac
```

<!-- Source CN PDF p.9, block 99 -->

说明 FLEXBUS DAC 对应 iio:device2

<!-- Source CN PDF p.9, block 100 -->

#### 2.3.2 向 DAC 发送数据

<!-- Source CN PDF p.9, block 101 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device0
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# echo 16383 > out_voltage_raw
```

<!-- Source CN PDF p.9, block 102 -->

#### 2.3.3 获取和修改时钟频率

<!-- Source CN PDF p.9, block 103 -->

获取时钟频率：

<!-- Source CN PDF p.9, block 104 -->

```text
root@rk3576-buildroot:/# cd /sys/bus/iio/devices/iio\:device2
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# cat out_voltage_sampling_frequency
99000000
```

<!-- Source CN PDF p.9, block 105 -->

说明当前时钟频率为 99MHz。

<!-- Source CN PDF p.9, block 106 -->

修改时钟频率：

<!-- Source CN PDF p.9, block 107 -->

```text
root@rk3576-buildroot:/sys/bus/iio/devices/iio:device2# echo 25000000 > out_voltage_sampling_frequency
```

<!-- Source CN PDF p.9, block 108 -->

时钟频率就被改为 25MHz。

<!-- Source CN PDF p.9, block 109 -->

Note：

<!-- Source CN PDF p.9, block 110 -->

时钟频率最高 100MHz

{% endraw %}
