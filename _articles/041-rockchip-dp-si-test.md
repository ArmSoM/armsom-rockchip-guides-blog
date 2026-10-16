---
title: "Rockchip DP Signal Testing: RK3576/RK3588 USBDP PHY Registers and Tuning"
description: "Complete source-derived reference for DP PHY amplitude, equalization, slew rate, SSC, AUX and driver configuration, with original register tables and source discrepancies."
translation_key: "041-rockchip-dp-si-test"
slug: "041-rockchip-dp-si-test"
lang: "en"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: ["Sige5", "Sige7"]
tags: ["Rockchip", "DisplayPort", "RK3576", "RK3588", "USBDP PHY"]
keywords: "ArmSoM Rockchip 瑞芯微 RK3576 RK3588 DP PHY SSC AUX signal integrity"
excerpt: "Complete source-derived reference for DP PHY amplitude, equalization, slew rate, SSC, AUX and driver configuration, with original register tables and source discrepancies."
---

# Rockchip DP Signal Testing: RK3576/RK3588 USBDP PHY Registers and Tuning

This complete reference is derived from Rockchip DP Signal Test Guide V1.0.0 (RK-KF-YF-C13), covering RK3576/RK3588 with the Rockchip BSP on Linux 5.10/6.1. Official documentation identifies RK3576 on ArmSoM [Sige5](https://docs.armsom.org/armsom-sige5) and RK3588 on [Sige7](https://docs.armsom.org/armsom-sige7). This remains a platform reference: verify board routing, PHY instance, DP/Type-C interface, SDK/BSP commit, kernel and driver versions before use. No ArmSoM hardware validation has been performed.

Only the Chinese PDF was supplied (13 pages); English and Russian are full translations of that source. The source has no independent technical figures. All register tables are editable; no English original figures are claimed. Specified cover notices, contact details, intended audience and revision history are omitted; the technical version and complete technical body are retained.

**Verify before operating:** the `io -4` examples directly write hardware registers; they are not universal board configurations. The source contains commands with missing spaces and inconsistent bit widths, offsets and headings. These are retained for traceability. Do not execute disputed rows by copying them. Read the editorial notes below and verify against the TRM/BSP first.

## 1. DP PHY overview

RK3576 and RK3588 share the USBDP PHY between DP and USB. This guide describes signal tuning when the PHY is used for DP. The base addresses are listed below; each register address is the selected PHY base plus its register offset.

<!-- Source PDF page 4 -->

| USBDP PHY | USBDP PHY base address |
|---|---|
| RK3588 USBDP PHY0 | 0xfed88000 |
| RK3588 USBDP PHY1 | 0xfed98000 |
| RK3576 USBDP PHY | 0x2b018000 |

## 2. DP signal tuning

The source IO commands use Lane0 of RK3588 PHY0. Other lanes require different offsets; RK3588 PHY1 and RK3576 require different base addresses (the source spells the latter RK3756 here; see the notes). Registers usually serve several functions. Before combining adjustments, read the current value, apply the new tuning bits with an OR operation as described by the source, then write back; otherwise earlier settings may be overwritten.

### 2.1 DP amplitude control

#### 2.1.1 DP TX driver main-tap level

The source recommends adjusting this register first when tuning voltage. The offsets are shown below; bit5 enables the setting and the default is `0x0f`.

```text
lane0: 0x0810[5:0]
lane1: 0x1010[5:0]
lane2: 0x1810[5:0]
lane3: 0x2010[5:0]
```

Adjustment ranges and commands below apply to Lane0. For example, the Lane1 address is `0xfed89010` (`0xfed88810 + 0x800`).

<!-- Source PDF page 5 -->

| Amplitude | Command [ reg offset 0x0810, bit 5:0] |
|---|---|
| 4'b1010 : 1200mv (max) | io -4 0xfed88810 0x2a |
| 4'b1001: | io -4 0xfed88810 0x29 |
| 4'b1000: | io -4 0xfed888100x28 |
| 4'b0111: | io -4 0xfed88810 0x27 |
| 4'b0110 : | io -4 0xfed88810 0x26 |
| 4'b0101: | io -4 0xfed88810 0x25 |
| 4'b0100: | io -4 0xfed88810 0x24 |
| 4'b0011: | io -4 0xfed88810 0x23 |
| 4'b0010 : | io -4 0xfed88810 0x22 |
| 4'b0001: | io -4 0xfed88810 0x21 |
| 4'b0000: 400mv (min) | io -4 0xfed88810 0x20 |

#### 2.1.2 DP TX PMOS current control

Adjust the current register when voltage adjustment is insufficient. Enable bits are bit[1:0], with defaults `{0x1, 0xe7}`. The table lists the adjustment range.

```text
lane0: enable: 0x0818[1:0]; control: 0x081c[7:5]={3'b000 ~ 3'b111}
lane1: enable: 0x1018[1:0]; control: 0x101c[7:5]
lane2: enable: 0x1818[1:0]; control: 0x181c[7:5]
lane3: enable: 0x2018[1:0]; control: 0x201c[7:5]
```

<!-- Source PDF page 6 -->

| Amplitude | Command [ reg offset 0x081c, bit 7:5] |
|---|---|
| 3'b111: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0xe5 |
| 3'b110: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0xc5 |
| 3'b101: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0xa5 |
| 3'b100: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x85 |
| 3'b011 : | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x65 |
| 3'b010 : | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x45 |
| 4'b001: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x25 |
| 4'b000: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x05 |

### 2.2 DP equalization

#### 2.2.1 DP TX de-emphasis

Offsets are shown below. Bit4 is the enable bit; the default is `0x0`, or 0 dB. Levels and source recommendations follow.

```text
lane0: 0x0814[4:0]
lane1: 0x1014[4:0]
lane2: 0x1814[4:0]
lane3: 0x2014[4:0]
```

<!-- Source PDF page 6 -->

| Level | Command [ reg offset 0x0814, bit 4:0] |
|---|---|
| 5'b10000: 0 dB | io -4 0xfed88814 0x10 |
| 5'b11011: -5 dB (Recommend to use over 5 Gbps speed) | io -4 0xfed88814 0x1b |
| 5'b10101: -2.8 dB (Recommend to use over 10 Gbps speed) | io -4 0xfed88814 0x15 |
| 5'b11001: -6.9 dB (Not recommend to use) | io -4 0xfed88814 0x19 |

#### 2.2.2 DP TX preshoot level

Bit6 enables the setting; the default is `0x0`. This register is shared with TX PMOS current control. Commands apply to Lane0; adjust offsets for other lanes, for example `0xfed89018` for Lane1 (`0xfed88818 + 0x800`).

```text
lane0: 0x0818[6:2]
lane1: 0x1018[6:2]
lane2: 0x1818[6:2]
lane3: 0x2018[6:2]
```

<!-- Source PDF page 7 -->

| Level | Command [ reg offset 0x0818, bit 6:2] |
|---|---|
| 5'b1000000: 0 dB (default, Recommend to use over 5 Gbps speed) | io -4 0xfed88818 0x40 |
| 5'b1011000: -1.6 dB (Recommend to use over 10 Gbps speed) | io -4 0xfed88818 0x58 |
| 5'b11001: -6.9 dB (Not recommend to use) | io -4 0xfed88818 0x64 |

### 2.3 DP TX slew rate

#### 2.3.1 Faster slew rate control

Defaults are `{0xe7, 0x60}`. Register offsets for enabling the setting and controlling drive strength follow.

```text
lane0: enable: 0x081c[1:0]={2'b11}; strength: 0x0820[5:3]={3'b111 ~ 3'b000}
lane1: enable: 0x101c[1:0]; strength: 0x1020[5:3]
lane2: enable: 0x181c[1:0]; strength: 0x1820[5:3]
lane3: enable: 0x201c[1:0]; strength: 0x2020[5:3]
```

The following adjustment range and IO commands apply to Lane0. Other lanes require different offsets, for example `0xfed8901c` for Lane1 (`0xfed8881c + 0x800`).

<!-- Source PDF page 8 -->

| Amplitude | Command [ reg offset 0x081c, bit 7:5] |
|---|---|
| 3'b111: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x78 |
| 3'b110: | io -4 0xfed8881c 0xe7<br>io -4 0xfed888200x70 |
| 3'b101: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x68 |
| 3'b100: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x60 |
| 3'b011 : | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x58 |
| 3'b010 : | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x50 |
| 4'b001: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x48 |
| 4'b000: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x40 |

#### 2.3.2 Slower slew rate control

Defaults are `{0xe7, 0x60}`. Register offsets for enabling the setting and controlling drive strength follow.

```text
lane0: enable: 0x081c[1:0]={2'b10}; strength: 0x0820[5:3]={3'b111 ~ 3'b000}
lane1: enable: 0x101c[1:0]; strength: 0x1020[5:3]
lane2: enable: 0x181c[1:0]; strength: 0x1820[5:3]
lane3: enable: 0x201c[1:0]; strength: 0x2020[5:3]
```

The following adjustment range and IO commands apply to Lane0. Other lanes require different offsets, for example `0xfed8901c` for Lane1 (`0xfed8881c + 0x800`).

Note: this register is shared with TX PMOS current control.

<!-- Source PDF page 9 -->

| Amplitude | Command [ reg offset 0x081c, bit 7:5] |
|---|---|
| 3'b111: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x78 |
| 3'b110: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x70 |
| 3'b101: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x68 |
| 3'b100: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x60 |
| 3'b011 : | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x58 |
| 3'b010 : | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x50 |
| 4'b001: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x48 |
| 4'b000: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x40 |

### 2.4 DP TX SSC control

#### 2.4.1 PLL SSC modulation deviation

The default is `0x19`; offsets for each rate and the adjustment range follow.

```text
RBR: 0x03F0[5:0]
HBR: 0x03F4[5:0]
HBR2: 0x03F8[5:0]
HBR3: 0x03FC[5:0]
```

<!-- Source PDF page 9 -->

| Level | Command [ reg offset 0x03F0, bit5:0] |
|---|---|
| 6'b000000: | io -4 0xfed883f0 0x00 |
| 6'b000001: | io -4 0xfed883f0 0x01 |
| ... | ... |
| 4'b111110: | io -4 0xfed883f0 0x3e |
| 4'b111111: | io -4 0xfed883f0 0x3f |

#### 2.4.2 PLL SSC modulation frequency

The default is `0x0f`, while HBR3 defaults to `0x3c`. HBR3 requires a left shift by two bits. The source offset list differs from the command table; both are retained below and require verification before use.

```text
RBR: 0x0404[4:0]
HBR: 0x0408[4:0]
HBR2: 0x040c[4:0]
HBR3: 0x0410[6:2] (default=0x3c)
```

<!-- Source PDF page 10 -->

| Level | Command [ reg offset 0x0400, bit4:0] |
|---|---|
| 5'b00000: | io -4 0xfed88400 0x00 (HBR3:io -4 0xfed88410 0x00) |
| 5'b00001: | io -4 0xfed88400 0x01 (HBR3:io -4 0xfed88410 0x04) |
| ... | ... |
| 5'b11110: | io -4 0xfed88400 0x1e (HBR3:io -4 0xfed88410 0x38) |
| 5'b11111: | io -4 0xfed88400 0x1f (HBR3:io -4 0xfed88410 0x3c) |

### 2.5 DP TX AUX amplitude control

The default is `0x36`; the adjustment range follows.

```text
aux swing: 0x0024[6:3]
```

<!-- Source PDF page 11 -->

| Level | Command [ reg offset 0x0024, bit6:3] (bit[2:0] = 0x6(default)) |
|---|---|
| 4'b0000: 0 mVpp | io -4 0xfed88024 0x06 |
| 4'b0001: | io -4 0xfed88024 0x0e |
| 4'b0010: | io -4 0xfed88024 0x16 |
| 4'b0011: | io -4 0xfed88024 0x1e |
| 4'b0100: | io -4 0xfed88024 0x26 |
| 4'b0101: | io -4 0xfed88024 0x2e |
| 4'b0110: | io -4 0xfed88024 0x36 |
| 4'b0111: 390 mVpp | io -4 0xfed88024 0x3e |
| 4'b1000: | io -4 0xfed88024 0x46 |
| 4'b1001: | io -4 0xfed88024 0x4e |
| 4'b1010: | io -4 0xfed88024 0x56 |
| 4'b1011: | io -4 0xfed88024 0x5e |
| 4'b1100: | io -4 0xfed88024 0x66 |
| 4'b1101: | io -4 0xfed88024 0x6e |
| 4'b1110: | io -4 0xfed88024 0x76 |
| 4'b1111: 880 mVpp | io -4 0xfed88024 0x7e |

## 3. Adjusting driver configuration parameters

Kernel driver: `drivers/phy/rockchip/phy-rockchip-usbdp.c`. U-Boot driver: `drivers/phy/phy-rockchip-usbdp.c`. Registers controlling swing and pre-emphasis are represented by:

```text
struct dp_tx_drv_ctrl {
    u32 trsv_reg0204;
    u32 trsv_reg0205;
    u32 trsv_reg0206;
    u32 trsv_reg0207;
};
```

Register offsets for each lane follow. The source repeats `trsv_reg0206` in the last two headings; this is retained and documented in the notes.

<!-- Source PDF page 12 -->

|  | trsv_reg0204 | trsv_reg0205 | trsv_reg0206 | trsv_reg0206 |
|---|---|---|---|---|
| lane0 | 0x0810 | 0x0814 | 0x0818 | 0x081C |
| lane1 | 0x1010 | 0x1014 | 0x1018 | 0x101C |
| lane2 | 0x1810 | 0x1814 | 0x1818 | 0x181C |
| lane3 | 0x2010 | 0x2014 | 0x2018 | 0x201C |

DP link rates have four levels: RBR, HBR, HBR2 and HBR3. The following arrays configure swing and pre-emphasis. For a standard DP connector:

<!-- Source PDF page 12 -->

|  | RK3576 configuration | RK3588 configuration |
|---|---|---|
| RBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr |
| HBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr |
| HBR2 | rk3588_dp_tx_drv_ctrl_hbr2 | rk3588_dp_tx_drv_ctrl_hbr2 |
| HBR3 | rk3588_dp_tx_drv_ctrl_hbr3 | rk3588_dp_tx_drv_ctrl_hbr3 |

For Type-C output:

<!-- Source PDF page 12 -->

|  | RK3576 configuration | RK3588 configuration |
|---|---|---|
| RBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec |
| HBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec |
| HBR2 | rk3588_dp_tx_drv_ctrl_hbr2 | rk3588_dp_tx_drv_ctrl_hbr2 |
| HBR3 | rk3588_dp_tx_drv_ctrl_hbr3 | rk3588_dp_tx_drv_ctrl_hbr3 |

Each array is 4×4 and stores register settings for combinations of swing and pre-emphasis levels. SSC is configured in:

```text
static const struct reg_sequence rk3588_udphy_24m_refclk_cfg[] = {
    ......
    {0x03f0, 0x0a}, {0x03f4, 0x07},
    {0x03f8, 0x07}, {0x03fc, 0x0c},
    {0x0404, 0x12}, {0x0408, 0x1a},
    {0x040c, 0x1a}, {0x0410, 0x3f},
    ......
};
```

AUX amplitude is configured in:

```text
static const struct reg_sequence rk3588_udphy_init_sequence[] = {
    ......
    {0x0024, 0x6e},
};
```

## Editorial notes and usage limitations

The source writes `RK3756` in §2 despite identifying RK3576 elsewhere. Bit-width forms such as `4'b001`, `4'b111110` and `5'b1000000`, and the mapping between preshoot levels and register values, remain as printed pending verification. Slew-rate table headings say `0x081c, bit 7:5`, whereas the text lists `0x0820[5:3]`. For SSC modulation frequency, the RBR offset is listed as `0x0404` but commands use `0xfed88400`; the upper HBR3 values also appear inconsistent with the two-bit shift instruction. Do not guess corrections.

Visual inspection confirms that page 5 prints `io -4 0xfed888100x28` and page 8 prints `io -4 0xfed888200x70` without argument-separating spaces. These are source defects, not extraction defects, and are retained rather than presented as executable commands. Register writes may affect active DP/USB operation; verify masks, shared bits and driver state in a recoverable test environment. [Detailed editorial record](/docs/rockchip-dp-si-test/EDITORIAL-NOTES.md).
