---
title: "Rockchip FLEXBUS FSPI 完整指南：SPI NOR Flash、内核与 DTS"
description: "Rockchip FLEXBUS FSPI 完整指南：SPI NOR Flash、内核与 DTS：保留完整技术章节、代码、参数及原文疑点。"
translation_key: "061-rockchip-flexbus-fspi"
slug: "061-rockchip-flexbus-fspi"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus-fspi"
excerpt: "Rockchip FLEXBUS FSPI 完整指南：SPI NOR Flash、内核与 DTS：保留完整技术章节、代码、参数及原文疑点。"
---

{% raw %}

# Rockchip FLEXBUS FSPI 完整指南：SPI NOR Flash、内核与 DTS

本文完整整理原厂技术正文，作为 ArmSoM 平台参考。原文适用范围：原文称支持 FLEXBUS 的 SoC；具体板卡待核对，Linux kernel 6.1。使用前须核对实际板卡、SoC、SDK/BSP 分支、引脚与外设配置；未做板级硬件验证，不代表所有 ArmSoM 板卡均支持。文中输出和数值为原文示例，不是 ArmSoM 实测。

中文保留中文原稿正文，英文保留英文原稿，俄文完整翻译英文正文；代码、注释和命令输出保留源语言。 原稿技术正文没有独立技术配图或表格，没有补造配图。

中英文原稿版本均为 V1.0.0。

**操作注意**：预留内存、DMA、引脚复用和设备写操作会影响实际硬件。所有命令仅供阅读，未执行硬件读写；先核对原理图、供电、时序和实际设备。DTS 中 xxx 和省略号是原文占位示例，不能直接当作完整配置。

来源与修复详见 [EDITORIAL-NOTES](/docs/rockchip-flexbus-fspi/EDITORIAL-NOTES.md)。官方参考：[ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

原文产品版本表（PDF p.2；仅表示原稿范围，非板级验证结论）：

| 芯片名称 | 内核版本 |
| --- | --- |
| 所有支持 FLEXBUS 模块的芯片 | 6.1 |

<!-- Source CN PDF p.4, block 0 -->

## 1. FLEXBUS FSPI 模式

<!-- Source CN PDF p.4, block 1 -->

### 1.1 概述

<!-- Source CN PDF p.4, block 2 -->

FLEXBUS FSPI 模式指的是通过 FLEXBUS 模拟 RK FSPI（Flexible Serial Peripheral Interface）来实现相应功能，例如：

<!-- Source CN PDF p.4, block 3 -->

single line output/quad line input，满足 Linux MTD Quad SPI Flash 驱动的典型配置

<!-- Source CN PDF p.4, block 4 -->

关键特性：

<!-- Source CN PDF p.4, block 5 -->

时钟频率最高 100MHz

<!-- Source CN PDF p.4, block 6 -->

### 1.2 配置

<!-- Source CN PDF p.4, block 7 -->

#### 1.2.1 内核配置

<!-- Source CN PDF p.4, block 8 -->

FLEXBUS FSPI mode 为标准 SPI 框架驱动实现，且仅实现 spi-mem 结构，支持外接 SPI Flash 或支持

<!-- Source CN PDF p.4, block 9 -->

spi-mem 协议的外设：

<!-- Source CN PDF p.4, block 10 -->

```text
CONFIG_SPI=y
CONFIG_SPI_ROCKCHIP_FLEXBUS_FSPI=y
```

<!-- Source CN PDF p.4, block 11 -->

#### 1.2.2 dts 配置

<!-- Source CN PDF p.4, block 12 -->

以外接 SPI Nor flash 子设备为例：

<!-- Source CN PDF p.4, block 13 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_SPI>;
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_NULL>;
    status = "okay";
};
&flexbus_fspi {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus0m1_pins &flexbus0_clk_pins
                 &flexbus0_d0_pins &flexbus0_d1_pins
                 &flexbus0_d2_pins &flexbus0_d3_pins>;
    status = "okay";
    flash@0 {
        compatible = "jedec,spi-nor";
        reg = <0>;
        spi-max-frequency = <100000000>;
        spi-rx-bus-width = <4>;
        spi-tx-bus-width = <1>;
    };
};
```

<!-- Source CN PDF p.5, block 15 -->

说明：

<!-- Source CN PDF p.5, block 16 -->

mode_bits 为 SPI_RX_QUAD：

<!-- Source CN PDF p.5, block 17 -->

支持配置 spi-rx-bus-width 为 4

<!-- Source CN PDF p.5, block 18 -->

默认配置为 SPI mode 0，MSB mode，相关参数 dts 不可调，请自行参考控制器手册做进一步开发

<!-- Source CN PDF p.5, block 19 -->

#### 1.2.3 驱动文件

<!-- Source CN PDF p.5, block 20 -->

驱动文件为 drivers/spi/spi-rockchip-flexbus-fspi.c 。

{% endraw %}
