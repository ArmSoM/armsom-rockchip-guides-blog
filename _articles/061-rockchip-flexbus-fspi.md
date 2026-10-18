---
title: "Rockchip FLEXBUS FSPI Guide: SPI NOR Flash, Kernel and DTS"
description: "Rockchip FLEXBUS FSPI Guide: SPI NOR Flash, Kernel and DTS with complete technical sections, code, parameters and source caveats."
translation_key: "061-rockchip-flexbus-fspi"
slug: "061-rockchip-flexbus-fspi"
lang: "en"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus-fspi"
excerpt: "Rockchip FLEXBUS FSPI Guide: SPI NOR Flash, Kernel and DTS with complete technical sections, code, parameters and source caveats."
---

{% raw %}

# Rockchip FLEXBUS FSPI Guide: SPI NOR Flash, Kernel and DTS

This complete source-based technical article is an ArmSoM platform reference. Source scope: SoCs supporting FLEXBUS according to the source; board support remains to be verified, Linux kernel 6.1. Verify the actual board, SoC, SDK/BSP branch, pins and peripherals before use. No board-level hardware validation has been performed, and support on all ArmSoM boards is not implied. Outputs and measurements are source examples, not ArmSoM test results.

Chinese follows the Chinese source; English follows the English source; Russian fully translates the English technical body. Code, comments and command output retain their source language. The source technical body contains no independent technical figures or tables; none have been invented.

Both source versions are V1.0.0.

**Operational caution:** reserved memory, DMA, pin multiplexing and device writes affect hardware. Commands are provided for reading; no hardware operations were executed. Verify the schematic, power, timing and actual device. Any xxx or ellipsis in DTS is a source placeholder, not a complete usable configuration.

Sources and repairs: [EDITORIAL-NOTES](/docs/rockchip-flexbus-fspi/EDITORIAL-NOTES.md)。Official references: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Source product-version table (PDF p.2; source scope, not board-level validation):

| Chipset | Kernel Version |
| --- | --- |
| All SOC support FLEXBUS | 6.1 |

<!-- Source EN PDF p.5, block 0 -->

## 1. FLEXBUS FSPI Mode

<!-- Source EN PDF p.5, block 1 -->

### 1.1 Overview

<!-- Source EN PDF p.5, block 2 -->

FLEXBUS FSPI mode refers to the implementation of the corresponding functions by simulating RK FSPI (Flexible Serial Peripheral Interface) through FLEXBUS, such as:

<!-- Source EN PDF p.5, block 3 -->

Single line output/quad line input, meeting the typical configuration for Linux MTD Quad SPI Flash driver

<!-- Source EN PDF p.5, block 4 -->

The key feature：

<!-- Source EN PDF p.5, block 5 -->

A clock frequency up to 100MHz

<!-- Source EN PDF p.5, block 6 -->

### 1.2 Configuration

<!-- Source EN PDF p.5, block 7 -->

#### 1.2.1 Kernel Configuration

<!-- Source EN PDF p.5, block 8 -->

FLEXBUS FSPI mode is implemented by the standard SPI framework driver and only implements the spi-mem structure, supporting external SPI Flash or peripherals that support the spi-mem protocol:

<!-- Source EN PDF p.5, block 9 -->

```text
CONFIG_SPI=y
CONFIG_SPI_ROCKCHIP_FLEXBUS_FSPI=y
```

<!-- Source EN PDF p.5, block 10 -->

#### 1.2.2 DTS Configuration

<!-- Source EN PDF p.5, block 11 -->

Taking the external SPI Nor flash sub-device as an example:

<!-- Source EN PDF p.5, block 12 -->

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

<!-- Source EN PDF p.6, block 14 -->

Explanation:

<!-- Source EN PDF p.6, block 15 -->

mode_bits is SPI_RX_QUAD:

<!-- Source EN PDF p.6, block 16 -->

It supports configuring spi-rx-bus-width to 4

<!-- Source EN PDF p.6, block 17 -->

The default configuration is SPI mode 0, MSB mode, the relevant parameters of dts are not adjustable, please refer to the controller manual for further development

<!-- Source EN PDF p.6, block 18 -->

#### 1.2.3 Driver File

<!-- Source EN PDF p.6, block 19 -->

The driver file is drivers/spi/spi-rockchip-flexbus-fspi.c .

{% endraw %}
