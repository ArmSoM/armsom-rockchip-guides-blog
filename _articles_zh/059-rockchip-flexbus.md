---
title: "Rockchip FLEXBUS 完整指南：工作模式、内核与 DTS 配置"
description: "Rockchip FLEXBUS 完整指南：工作模式、内核与 DTS 配置：保留完整技术章节、代码、参数及原文疑点。"
translation_key: "059-rockchip-flexbus"
slug: "059-rockchip-flexbus"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus"
excerpt: "Rockchip FLEXBUS 完整指南：工作模式、内核与 DTS 配置：保留完整技术章节、代码、参数及原文疑点。"
---

{% raw %}

# Rockchip FLEXBUS 完整指南：工作模式、内核与 DTS 配置

本文完整整理原厂技术正文，作为 ArmSoM 平台参考。原文适用范围：RK3576，Linux kernel 6.1。使用前须核对实际板卡、SoC、SDK/BSP 分支、引脚与外设配置；未做板级硬件验证，不代表所有 ArmSoM 板卡均支持。文中输出和数值为原文示例，不是 ArmSoM 实测。

中文保留中文原稿正文，英文保留英文原稿，俄文完整翻译英文正文；代码、注释和命令输出保留源语言。 原稿技术正文没有独立技术配图或表格，没有补造配图。

中英文原稿版本均为 V1.0.0。

**操作注意**：预留内存、DMA、引脚复用和设备写操作会影响实际硬件。所有命令仅供阅读，未执行硬件读写；先核对原理图、供电、时序和实际设备。DTS 中 xxx 和省略号是原文占位示例，不能直接当作完整配置。

来源与修复详见 [EDITORIAL-NOTES](/docs/rockchip-flexbus/EDITORIAL-NOTES.md)。官方参考：[ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

原文产品版本表（PDF p.2；仅表示原稿范围，非板级验证结论）：

| 芯片名称 | 内核版本 |
| --- | --- |
| RK3576 | 6.1 |

<!-- Source CN PDF p.4, block 0 -->

## 1. FLEXBUS 概述

<!-- Source CN PDF p.4, block 1 -->

FLEXBUS 模块分为 FLEXBUS0、FLEXBUS1 两部分。FLEXBUS0 支持 TX，部分模式下支持 TX thenRX。FLEXBUS1 只支持 RX。FLEXBUS0、FLEXBUS1 分别只允许对接一个外设。可以同时使用FLEXBUS0 和 FLEXBUS1，也可以只使用 FLEXBUS0 或只使用 FLEXBUS1。

<!-- Source CN PDF p.4, block 2 -->

FLEXBUS0 支持以下模式：

<!-- Source CN PDF p.4, block 3 -->

1\. 高速并行 DAC（本文简称 DAC）

<!-- Source CN PDF p.4, block 4 -->

2\. 模拟 SPI 协议，主要实现 Single/Quad SPI 传输，支持外接 SPI Flash、QSPI 屏

<!-- Source CN PDF p.4, block 5 -->

FLEXBUS1 支持以下模式：

<!-- Source CN PDF p.4, block 6 -->

1\. 高速并行 ADC（本文简称 ADC）

<!-- Source CN PDF p.4, block 7 -->

2\. DVP

<!-- Source CN PDF p.4, block 8 -->

FLEXBUS0、FLEXBUS1 分别有 1 根 CLK、1 根 CSn、16 根 data 线。实际能使用的引脚还要看具体平台的限制和 IOMUX 的配置。

<!-- Source CN PDF p.4, block 9 -->

## 2. FLEXBUS 的使用

<!-- Source CN PDF p.4, block 10 -->

### 2.1 内核配置

<!-- Source CN PDF p.4, block 11 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source CN PDF p.4, block 12 -->

### 2.2 dtsi 配置

<!-- Source CN PDF p.4, block 13 -->

以 RK3576 平台和 RK3576 TEST1 板子，FLEXBUS0 对接 DAC、FLEXBUS1 对接 ADC 为例。

<!-- Source CN PDF p.4, block 14 -->

rk3576.dtsi 中：

<!-- Source CN PDF p.4, block 15 -->

```text
flexbus: flexbus@2a2f0000 {
    compatible = "rockchip,rk3576-flexbus";
    reg = <0x0 0x2a2f0000 0x0 0x200>;
    interrupts = <GIC_SPI 369 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru CLK_HSGPIO_TX>, <&cru CLK_HSGPIO_RX>,
    <&cru ACLK_HSGPIO>, <&cru HCLK_HSGPIO>;
    clock-names = "tx_clk_flexbus", "rx_clk_flexbus",
    "aclk_flexbus", "hclk_flexbus";
    rockchip,grf = <&ioc_grf>; // FLEXBUS 需要配置 GRF
    status = "disabled";
    flexbus_adc: adc {
        ......
    };
    flexbus_dac: dac {
        ......
    };
};
```

<!-- Source CN PDF p.5, block 17 -->

根据需要使用的模式，修改对应的子节点配置（如 flexbus_adc、flexbus_dac），具体参考各模式对应的文档。其它配置一般不需要修改。

<!-- Source CN PDF p.5, block 18 -->

arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi 中：

<!-- Source CN PDF p.5, block 19 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 选择 DAC 模式
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

<!-- Source CN PDF p.5, block 20 -->

rockchip,flexbus0-opmode、rockchip,flexbus1-opmode 分别配置为 FLEXBUS0、FLEXBUS1 实际使用的模式，模式的定义在 include/dt-bindings/mfd/rockchip-flexbus.h。如果没有使用就配成ROCKCHIP_FLEXBUS0_OPMODE_NULL 或 ROCKCHIP_FLEXBUS1_OPMODE_NULL 。

<!-- Source CN PDF p.5, block 21 -->

### 2.3 驱动文件

<!-- Source CN PDF p.5, block 22 -->

驱动文件为 drivers/mfd/rockchip-flexbus.c。这里只包含寄存器读写、初始化等基本操作。各模式的代码位于对应的框架中，具体参考各模式对应的文档。

{% endraw %}
