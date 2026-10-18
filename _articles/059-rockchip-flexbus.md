---
title: "Rockchip FLEXBUS Guide: Operating Modes, Kernel and DTS Configuration"
description: "Rockchip FLEXBUS Guide: Operating Modes, Kernel and DTS Configuration with complete technical sections, code, parameters and source caveats."
translation_key: "059-rockchip-flexbus"
slug: "059-rockchip-flexbus"
lang: "en"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus"
excerpt: "Rockchip FLEXBUS Guide: Operating Modes, Kernel and DTS Configuration with complete technical sections, code, parameters and source caveats."
---

{% raw %}

# Rockchip FLEXBUS Guide: Operating Modes, Kernel and DTS Configuration

This complete source-based technical article is an ArmSoM platform reference. Source scope: RK3576, Linux kernel 6.1. Verify the actual board, SoC, SDK/BSP branch, pins and peripherals before use. No board-level hardware validation has been performed, and support on all ArmSoM boards is not implied. Outputs and measurements are source examples, not ArmSoM test results.

Chinese follows the Chinese source; English follows the English source; Russian fully translates the English technical body. Code, comments and command output retain their source language. The source technical body contains no independent technical figures or tables; none have been invented.

Both source versions are V1.0.0.

**Operational caution:** reserved memory, DMA, pin multiplexing and device writes affect hardware. Commands are provided for reading; no hardware operations were executed. Verify the schematic, power, timing and actual device. Any xxx or ellipsis in DTS is a source placeholder, not a complete usable configuration.

Sources and repairs: [EDITORIAL-NOTES](/docs/rockchip-flexbus/EDITORIAL-NOTES.md)。Official references: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Source product-version table (PDF p.2; source scope, not board-level validation):

| Chipset | Kernel Version |
| --- | --- |
| RK3576 | 6.1 |

<!-- Source EN PDF p.5, block 0 -->

## 1. FLEXBUS overview

<!-- Source EN PDF p.5, block 1 -->

The FLEXBUS module consists of two parts: FLEXBUS0 and FLEXBUS1. FLEXBUS0 supports TX, and TX then RX is supported in some modes. FLEXBUS1 supports only RX. FLEXBUS0 and FLEXBUS1 can connect to only one peripheral respectively. You can use both FLEXBUS0 and FLEXBUS1, or you can use only FLEXBUS0 or FLEXBUS1.

<!-- Source EN PDF p.5, block 2 -->

FLEXBUS0 supports the following modes:

<!-- Source EN PDF p.5, block 3 -->

1\. High-speed parallel DAC (DAC for short)

<!-- Source EN PDF p.5, block 4 -->

2\. Emulate SPI protocol, mainly used for Single/Quad SPI transmission, supports external SPI Flash and QSPI screen

<!-- Source EN PDF p.5, block 5 -->

FLEXBUS1 supports the following modes:

<!-- Source EN PDF p.5, block 6 -->

1\. High-speed Parallel ADC (ADC for short)

<!-- Source EN PDF p.5, block 7 -->

2\. DVP

<!-- Source EN PDF p.5, block 8 -->

FLEXBUS0 and FLEXBUS1 each have 1 CLK, 1 CSn, and 16 data pins. The actual pins that can be used depend on the platform limitations and IOMUX configuration.

<!-- Source EN PDF p.5, block 9 -->

## 2. Use of FLEXBUS

<!-- Source EN PDF p.5, block 10 -->

### 2.1 Kernel configuration

<!-- Source EN PDF p.5, block 11 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source EN PDF p.5, block 12 -->

### 2.2 dtsi configuration

<!-- Source EN PDF p.5, block 13 -->

Take RK3576 platform and RK3576 TEST1 board, FLEXBUS0 for DAC, FLEXBUS1 for ADC as an example.

<!-- Source EN PDF p.5, block 14 -->

In rk3576.dtsi:

<!-- Source EN PDF p.5, block 15 -->

```text
flexbus: flexbus@2a2f0000 {
    compatible = "rockchip,rk3576-flexbus";
    reg = <0x0 0x2a2f0000 0x0 0x200>;
    interrupts = <GIC_SPI 369 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru CLK_HSGPIO_TX>, <&cru CLK_HSGPIO_RX>,
    <&cru ACLK_HSGPIO>, <&cru HCLK_HSGPIO>;
    clock-names = "tx_clk_flexbus", "rx_clk_flexbus",
    "aclk_flexbus", "hclk_flexbus";
    rockchip,grf = <&ioc_grf>; // GRF needs to be configured for FLEXBUS
    status = "disabled";
    flexbus_adc: adc {
        ......
    };
    flexbus_dac: dac {
        ......
    };
};
```

<!-- Source EN PDF p.6, block 17 -->

Modify the child node configuration (for example, flexbus_adc and flexbus_dac) based on the required mode. For details, see the documents corresponding to each mode. Other configurations usually do not need to be modified.

<!-- Source EN PDF p.6, block 18 -->

In arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi:

<!-- Source EN PDF p.6, block 19 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 selects DAC mode
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

<!-- Source EN PDF p.6, block 20 -->

Set "rockchip,flexbus0-opmode" and "rockchip,flexbus1-opmode" to the actual modes used by FLEXBUS0 and FLEXBUS1. The mode is defined in include/dt-bindings/mfd/rockchip-flexbus.h. If not used, set it to ROCKCHIP_FLEXBUS0_OPMODE_NULL or ROCKCHIP_FLEXBUS1_OPMODE_NULL .

<!-- Source EN PDF p.7, block 21 -->

### 2.3 Driver file

<!-- Source EN PDF p.7, block 22 -->

The driver file is drivers/mfd/rockchip-flexbus.c. Only basic operations such as register read/write and initialization are included here. The codes for each modes are located in the corresponding frameworks. Please refer to the corresponding documentations for each modes.

{% endraw %}
