---
title: "Rockchip GPIO Output Clocks: Pin Mapping, DTS and Test Procedures"
description: "Rockchip GPIO clock-output reference for pinmux, supported clock frequencies, DTS configuration and SoC-specific test examples."
translation_key: "034-rockchip-gpio-output-clocks"
slug: "034-rockchip-gpio-output-clocks"
lang: "en"
date: "2026-10-15"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["Rockchip", "GPIO", "clock output", "pinmux", "DTS"]
keywords: "ArmSoM Rockchip GPIO output clock pinmux RK3588 RK3576"
excerpt: "SoC-specific GPIO output-clock pin mapping, DTS patterns and safe validation steps."
---

# Rockchip GPIO Output Clocks: Pin Mapping, DTS and Test Procedures

This source-derived reference is based on *Rockchip Gpio Output Clocks*, V1.4.0 (2025-04-16). It is not an ArmSoM hardware validation report. It documents RK3399, RK1808, RK3328, RK3308, RV1126, PX30, RK3566/RK3568, RK3588, RK3528, RK3576, RK2118 and RV1126B/RV1126B-P. Confirm the board schematic, connector routing, IO voltage domain, pin ownership, released BSP and target SoC TRM before enabling any output. No waveform, signal-integrity or peripheral-compatibility result is claimed for ArmSoM boards.

The English source has 29 pages. It contains no extractable figure assets. Cover legal/contact material, intended audience and revision history are intentionally omitted. [Editorial notes](/docs/rockchip-gpio-output-clocks/EDITORIAL-NOTES.md).

## 1. What GPIO clock output is for

A SoC IO can emit a selected internal reference clock to replace an external oscillator and reduce peripheral circuitry. This works only when all three conditions are satisfied:

1. The selected pin's IOMUX supports that clock-output function.
2. The clock source and rate are configured for the intended consumer.
3. The IO drive setting and board electrical path produce an acceptable waveform.

The source identifies direct 24 MHz crystal bypass as the best-quality option when replacing a 24 MHz crystal. A PLL-divider output can be lower quality; the peripheral's own reference-clock limits decide whether it is usable. Do not infer a safe drive strength from this document - measure on the actual board.

## 2. Hardware correspondence

| SoC | Clock name | GPIO | Supported frequencies in source |
|---|---|---|---|
| RK3288 | `SCLK_TESTOUT` | GPIO0_C1 | 24 MHz, 32 kHz |
| RK3328 | `SCLK_TESTOUT` | GPIO1_A6 | 24 MHz, 32 kHz |
| PX30 | `SCLK_TEST_OUT` | GPIO1_D6 or GPIO0_B5 | 24 MHz, 32 kHz |
| RK3308 | `SCLK_TESTOUT` | GPIO0_A4 | 24 MHz, 32 kHz |
| RV1108 | `SCLK_TESTOUT` | GPIO0_A6 | 24 MHz, 32 kHz |
| RV1126 | `SCLK_TESTOUT` | GPIO1_A4 | 24 MHz, 32 kHz |
| RK3368 | `SCLK_TESTOUT` | GPIO0_B0 | 24 MHz, 32 kHz |
| RK3399 | `SCLK_TESTOUT` | GPIO2_D1 or GPIO0_B0 | 24 MHz, 32 kHz |
| RK3566/8 | `CLK_WIFI` | GPIO0_A0 | 24 MHz |
| RK3566/8 | `CLK_MAC0_OUT` | GPIO2_C1 | 24/25/50/125 MHz |
| RK3566/8 | `CLK_MAC1_OUT` | GPIO3_B0 or GPIO4_B3 | 24/25/50/125 MHz |
| RK3566/8 | `CLK_CIF_OUT` | GPIO4_C0 | 24/27/37.125 MHz |
| RK3566/8 | `CLK_CAM0_OUT` | GPIO4_A7 | 24/27/37.125 MHz |
| RK3588 | `REFCLKOUT` | GPIO0_A0 | 24 MHz |
| RK3588 | `CLK_GMAC_50M` | GPIO4_C3 | 50/125 MHz |
| RK3588 | `REFCLK25M_ETH0` | GPIO4_B0 | 25/50 MHz |
| RK3588 | `CLK_DEEPSLOW` | GPIO2_C5 | 32 kHz |
| RK3588 | `CLK_MIPI_CAMARAOUT_M0..M4` | GPIO4_B1, GPIO1_B6/B7/D6/D7 | 24/27/37.125 MHz |
| RK3588 | `CLK_CIF_OUT` | GPIO4_B4 | 24/27/37.125 MHz |
| RK3588 | `REFCLK25M_ETH1` | GPIO3_A6 | 25/50 MHz |

| SoC | Clock/output | GPIO | Supported frequencies in source |
|---|---|---|---|
| RK3528 | `CLK_REFOUT` | GPIO0_A1 or GPIO3_C3 | 24 MHz |
| RK3528 | `CLK_DEEPSLOW` | GPIO3_C3 or GPIO1_C3 | 32 kHz |
| RK3528 | `CLK_TESTOUT` | GPIO2_A5 | Depends on configuration |
| RK3576 | `REF_CLK0/1/2_OUT` | GPIO0_A0/B4/B5 | 12/24/27/37.125 MHz |
| RK3576 | `CLK_32K_OUT` | GPIO0_A2 | 32 kHz |
| RK3576 | `ETH_CLK0/1_25M_OUT` | GPIO3_A4/GPIO2_D7; GPIO2_D6/GPIO1_D5 | 25/27/50/125 MHz |
| RK3576 | `VI_CIF_CLKOUT` | GPIO3_A2 | 24/27/37.125 MHz |
| RK3576 | `CAM_CLK0/1/2_OUT` | GPIO3_D7/GPIO2_D2; GPIO4_A0/GPIO2_D6; GPIO4_A1/GPIO2_D7 | 24/25/26/27/37.125/50 MHz |
| RK3576 | `UFS_REFCLK` | GPIO4_D1 | 24/26 MHz |
| RK2118 | `REF_CLK0/1_OUT` | GPIO3_B1 / GPIO0_A3 | 24/24.576/40/49.152/50 MHz |
| RK2118 | `ETH_CLK_25M_OUT` | GPIO0_A2 | 25/50 MHz |
| RK2118 | `OSC_CLK_OUT` / `CLK_32K` | GPIO0_B3 / GPIO0_A4 | crystal bypass / 32 kHz |
| RV1126B/P | `SAI0/1/2_MCLK` | GPIO7_A2/GPIO6_A4; GPIO1_B0/GPIO4_A3; GPIO3_B6/GPIO5_A3 | 12.288/24/24.576/49.152 MHz |
| RV1126B/P | `CAM_CLK0..3_OUT`, `VI_CIF_CLKOUT`, `ETH_CLK_25M_OUT` | source-defined alternate pins | 24/25/26/27/37.125/50 MHz |
| RV1126B/P | `CLK_32K_OUT` / `CLK_REFOUT` | GPIO0_A2 / GPIO0_A0 | 32 kHz / 24 MHz |

The same pad can appear in more than one row. Pinmux, package and board routing select the real function; two alternatives must not be enabled at once.

## 3. DTS pattern

For source-supported programmable outputs, select pinctrl, bind the intended clock, set a parent when required, and specify the rate:

```dts
pinctrl-names = "default";
pinctrl-0 = <&test_clkout>;
assigned-clocks = <&cru SCLK_TESTOUT>;
assigned-clock-parents = <&xin24m>;
assigned-clock-rates = <24000000>;
clocks = <&cru SCLK_TESTOUT>;
clock-names = "soc_24M";
```

The identifier differs by SoC (`SCLK_TEST_OUT`, `SCLK_TESTCLKOUT1/2`, `CLK_WIFI`, `CLK_CIFOUT_OUT`, or a camera/ethernet output). The pinctrl group is also SoC and board-specific. RK3528 is called out specially: `CLK_TESTOUT` is reserved for internal self-test; `CLK_REFOUT` is fixed at 24 MHz and can only be enabled/disabled; `CLK_DEEPSLOW` is fixed at 32 kHz and supports neither enable/disable nor rate change. Only pinctrl is necessary there.

## 4. Runtime test examples

Use debugfs only on a development image, and only after the named clock/node and pin function have been confirmed. These source examples are SoC-specific.

```sh
# RK3399: select 24 MHz and enable testout1, then pinmux GPIO2_D1
echo 24000000 > /sys/kernel/debug/clk/clk_testout1_pll_src/clk_rate
echo 24000000 > /sys/kernel/debug/clk/clk_testout1/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_testout1/clk_enable_count
io -4 0xff77e004 0x000c0008

# RK3566/RK3568: 25 MHz MAC0 output
echo 25000000 > /sys/kernel/debug/clk/clk_mac0_out/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_mac0_out/clk_enable_count
io -4 0xfdc60048 0x00070003

# RK3588: 50 MHz GMAC output, 6.1-style prepare-enable node
echo 50000000 > /sys/kernel/debug/clk/clk_gmac_50m/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_gmac_50m/clk_prepare_enable
io -4 0xfd5f8090 0xf0001000

# RK3576: 50 MHz Ethernet reference output
echo 50000000 > /sys/kernel/debug/clk/refclko25m_gmac0_out/clk_rate
echo 1 > /sys/kernel/debug/clk/refclko25m_gmac0_out/clk_prepare_enable
io -4 0x26044064 0x000f0003
```

Additional source command sequences for RK3288, RK3328, PX30, RK3308, RV110X, RV1126, RK3368, RK3528, RK2118 and RV1126B/P are intentionally retained as SoC-specific source material in the paired PDF inventory rather than represented as cross-platform commands. Do not paste any `io -4` write into an unrelated SoC: CRU/GRF address, write-mask semantics and field layout differ.

## 5. BSP implementation notes

The source adds a clock binding ID, parent-name array and a `GATE`/`MUX`/`COMPOSITE` (or equivalent) branch to the relevant Rockchip clock driver, then references it from DTS. A representative pattern is:

```c
PNAME(mux_sclk_testout_p) = { "xin24m", "armclk", /* SoC-specific parents */ };
COMPOSITE(SCLK_TESTOUT, "sclk_testout", mux_sclk_testout_p,
          CLK_SET_RATE_NO_REPARENT, /* target SoC registers and fields */);
```

This is a pattern, not compilable code for every SoC. Use the exact patch section for the target kernel generation, its binding header and CRU driver. The source warns to consult pinctrl documentation if the DTS control is unclear; on IO-rich RK3568/RK3588 designs, first identify the valid clock-to-IO correspondence and then follow the SoC example.

## 6. Verification checklist

1. Confirm the selected pad is physically routed, unused by boot/debug/storage, and in a compatible IO voltage domain.
2. Confirm pinctrl applies the clock function, not a GPIO function with the same pad name.
3. Confirm parent/rate/enable state in `clk_summary` before probing.
4. Measure frequency, duty cycle, amplitude and startup behaviour at the peripheral pin, not only at the SoC ball.
5. Run the downstream peripheral's tolerance and system suspend/resume tests. For Ethernet and audio, validate link/clock-lock behavior under load.
