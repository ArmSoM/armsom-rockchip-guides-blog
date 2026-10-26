---
title: "Rockchip USB SQ Tool: USB2.0/USB3.1 PHY Tuning and Code Integration"
description: "Rockchip USB SQ Tool: USB2.0/USB3.1 PHY Tuning and Code Integration — V1.8.0"
excerpt: "Rockchip USB SQ Tool: USB2.0/USB3.1 PHY Tuning and Code Integration"
translation_key: "165-rockchip-usb-sq-tool"
slug: "165-rockchip-usb-sq-tool"
lang: "en"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, PHY, Linux, Signal]
---

{% raw %}

# Rockchip USB SQ Tool: USB2.0/USB3.1 PHY Tuning and Code Integration

ArmSoM platform reference from Chinese RK-SM-YF-195 V1.8.0. The source lists Linux 4.4/4.19/5.10/6.1 and RT-Thread; chip/port support is detailed below. Verify the actual ArmSoM board, BSP and PHY driver; not every board is supported. No English PDF exists in the supplied pair; the full English/Russian/German translations use all 13 Chinese-source figures. The source explains that PHY manuals are not publicly released and TRMs lack detailed PHY registers; the tool simplifies debugging by providing compliance-test and tuning commands and generating PHY-driver reference code. No tuning or hardware tests performed.

Source caveats: §3.13 RK3562 ends with `]` rather than `}`; the source page confirms this, so it is retained and is not directly compilable. Ellipsis examples in §3.25/3.26 are not complete patches. The §2.1 USB3.1 list omits RK3588S but Table 2 includes it; both are retained, and actual support requires confirmation. TXPREEMPPLUSE is retained as written. Tool text inside Chinese figures is not redrawn. Larger parameter values are not automatically better.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip USB SQ Tool](https://redmine.rock-chips.com/documents/113)

## 1. Rockchip USB PHY signal tuning

USB signal-quality problems in actual applications can be addressed by improving the hardware circuit or tuning USB PHY registers in software. In either case, first measure the USB eye diagram and use its report for analysis and adjustment. Rockchip USB SQ Tool provides software tuning for failed eye tests, enumeration failures caused by signal quality or PHY supply-voltage differences, unexpected disconnections, and failure to detect unplugging. Signal problems strongly depend on hardware, including poor/long cables and excessive trace or cable impedance. Improve the hardware first; consider software tuning only when hardware improvement is unavailable.

## 2. Rockchip USB SQ Tool interface

### 2.1 Main window

USB 2.0 tuning supports RK1808, RK1820, RK2116, RK2118, RK3036, RK312X, RK3228, RK3288, RK3308, RK3308B-S, RK3326, RK3326S, RK3328, RK3399, RK3506, RK3528, RK3562, RK3566, RK3568, RK3576, RK3588, RK3588S, RV1103, RV1103B, RV1106, RV1109, RV1126, RV1126B, RV1126B-P, PX30 and PX30S. RK3328 currently supports only USB2.0 OTG and HOST tuning, not the USB3.0 U2PHY. USB 3.1 tuning supports RK1808, RK1820, RK3399, RK3528, RK3562, RK3566, RK3568, RK3576, RK3588 and RV1126B; other platforms are planned after development/validation. The tool runs only on Windows. Source download: https://redmine.rock-chips.com/documents/113 . Open Rockchip USB SQ Tool.exe; the platform selector in Figure 1 appears. Select a platform button to open its tuning window.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p006-figure-01.png)

Figure 1. USB SQ Tool main window. Some platforms share the same PHY tuning interface, so one represents the group. Tables 1 and 2 map USB2.0 and USB3.1 platforms to their example interfaces.

Table 1. USB2.0 PHY interface examples.

| Platform | Example PHY tuning interface |
| --- | --- |
| RK1808 | RK1808 USB2.0 Tuning interface |
| RK3036、RK312X、RK3228、RK3308、RK3326、RK3328 、RK3399、PX30 | RK3399 USB2.0 Tuning interface |
| RK1820、RK3308B-S、RK3326S、RK3506、RK3528、RK3562、RK3566、 RK3568、RV1126B、RV1126B-P、PX30S | RK3568 USB2.0 Tuning interface |
| RK3576、RK3588、RK3588S | RK3588 USB2.0 Tuning interface |
| RK2116、RK2118、RV1103、RV1103B、RV1106 | RV1106 USB2.0 Tuning interface |
| RV1109、RV1126 | RV1109 USB2.0 Tuning interface |

Table 2. USB3.1 PHY interface examples.

| Platform | Example PHY tuning interface |
| --- | --- |
| RK1808 | RK1808 USB3.1 Tuning interface |
| RK1820 | RK1820 USB3.1 Tuning interface |
| RK3399 | RK3399 USB3.1 Tuning interface |
| RK3528、RK3562、RK3566、RK3568、RV1126B | RK3528 USB3.1 Tuning interface |
| RK3576、RK3588、RK3588S | RK3588 USB3.1 Tuning interface |

Follow the tuning order shown in the tool. Proceed to the next step only if earlier steps do not improve the result or meet requirements; steps with negligible effect may be skipped. Signal tuning carries risk: do not adjust blindly. Ideally observe the eye diagram while making moderate changes; stop when requirements are met, since larger settings are not necessarily better. Users must assess the risk themselves.

### 2.2 RK1808 USB2.0 Tuning interface

RK1808 USB2.0 tuning has the same parameters as RK3568. Unlike RK3568, its PHY registers have upper-16-bit write_enable bits, so reading initial values is unnecessary. Parameter descriptions are in the RK3568 USB2.0 subsection.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p008-figure-01.png)

Figure 2.  RK1808 USB2.0 PHY Tuning Interface

### 2.3 RK3399 USB2.0 Tuning interface

RK3399 USB2.0 supports TYPE-C0, TYPE-C1, HOST0 and HOST1. Tuning steps:

1. Select the test interface on the left of red box 1; the right-hand field automatically generates its SQ test command.

2. Select parameters in red box 2. Pre-emphasize is selected using checkboxes; other items use controls like box 4, accepting typed values or up/down buttons. Each item shows its valid range and description.

3. Choose the parameters and press Confirm in red box 3. The adjacent field generates io commands, and Code Output in box 5 generates reference code.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p009-figure-01.png)

Figure 3.  RK3399 USB2.0 PHY Tuning InterfaceRK3399 USB2.0 signal-tuning parameters. 

Table 3.  RK3399 USB2.0 signal-tuning parameters

| Parameter | Description |
| --- | --- |
| Pre-emphasize | Adjust HS Tx pre-emphasis |
| Slew Rate | Adjust HS Tx eye slew rate |
| Compensation Voltage | Adjust HS Tx voltage calibration; raising it increases eye height |
| Compensation Current | Adjust HS Tx current calibration; raising it increases eye height |
| Pre-emphasize Strength | Adjust HS Tx pre-emphasis strength |
| Bypass ODT &amp; Driver Strength | Bypass automatic resistance adjustment in the compensation circuit to adjust eye height |
| Squelch | Adjust HS Rx squelch threshold |
| HOST Disconnect Detection | Adjust HS disconnect threshold; HOST only |

### 2.4 RK3568 USB2.0 Tuning interface

RK3568 USB2.0 supports OTG, HOST1, HOST2 and HOST3. Tuning steps:

1. Select the test interface on the left of red box 1; the right-hand field automatically generates its SQ test command.

2. RK3568 USB2.0 PHY registers lack upper-16-bit write_enable bits. To avoid changing unrelated or untuned bits, read the initial register value using the command in red box 2 and enter it in the initial-value field to its right.

3. Select parameters in red box 3. Pre-emphasize uses checkboxes; other items use controls like box 5, with manual entry or up/down buttons. Each item supplies the range and description.

4. Press Confirm in red box 4. The adjacent field generates io commands and Code Output in box 6 generates reference code. Important: the initial-value field contains defaults. If not manually replaced, those defaults may affect tuning. Always read the current register value and enter it before testing.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p011-figure-01.png)

Figure 4. RK3568 USB2.0 PHY interface. Four categories are provided: SQ, squelch threshold, disconnect threshold and B_Sessionvalid. SQ adjusts pre-emphasis, eye height, slew rate and drive strength. Table 4 lists the parameters.

| Parameter | Description |
| --- | --- |
| Pre-emphasize | Adjust HS Tx pre-emphasis |
| HS Eye Height | Adjust HS Tx eye height |
| HS ODT Value | Adjust the 45Ω ODT resistance. Higher input lowers resistance and increases eye height, but also increases FS/LS slew rate |
| Slew Rate | Adjust HS eye slew rate; effect is small |
| Squelch | Adjust HS Rx squelch threshold |
| HOST Disconnect Detection | Adjust disconnect threshold; HOST only |
| B_Session Valid | Adjust VBUS DET threshold; Device only |

RK3568 USB2.0 squelch: a long, poor-quality or high-impedance cable may prevent enumeration of a High-speed device. The PHY noise threshold is typically 150mV. Cable attenuation can lower valid signals below 150mV, causing them to be treated as noise. Squelch tuning can moderately lower the threshold, typically to 125mV or 112.5mV.

RK3568 disconnect threshold: use Host Disconnect Detection tuning. Typical Rockchip Host attachment logs follow:

```text
[ 1204.092638] usb 1-1: new high-speed USB device number 3 using ehci-platform
[ 1204.280373] usb 1-1: New USB device found, idVendor=058f, idProduct=6387, bcdDevice= 1.04
[ 1204.280449] usb 1-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[ 1204.280476] usb 1-1: Product: Mass Storage
[ 1204.280498] usb 1-1: SerialNumber: FA45A19C
```

Typical Rockchip Host disconnection log:

```text
[ 985.341233] usb 1-1: USB disconnect, device number 2
```

1) Unplugging a USB2.0 device is not detected. If removal produces no disconnect log, try the following improvements:

1. Enable EOP pre-emphasis, disabled by default in the SDK, as shown in Figure 5.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p013-figure-01.png)

Figure 5. Enabling EOP pre-emphasis.

2. Reduce the Host disconnect threshold. Some Rockchip chips have no EOP adjustment: skip step 1 according to the actual tool interface. Otherwise perform step 2 in addition to step 1 only if step 1 gives no clear improvement. Excessively reducing the threshold can cause spontaneous disconnections during normal use; assess this risk.

2) Unexpected USB2.0 disconnection during normal operation: try increasing the Host disconnect threshold. Not every disconnect is threshold-related; device faults or hardware conditions are often responsible, so do not tune blindly. EOP pre-emphasis is already off by default in the SDK; no extra disabling write is needed. Excessive threshold increases may prevent unplug detection.

RK356X B_Sessionvalid tuning addresses a PC failing to recognize a USB Device (ADB/MTP) or losing it after detection. Try lowering the voltage decision threshold: default 3'b000; recommended source settings are 3'b111 (7) or 3'b101 (5).

Three main hardware causes of Device connection failure: low VBUS (below 4.7V commonly causes problems); excessive USB_AVDD1V0 ripple or raising it to 1.2V, preventing valid Bvalid detection; excessive Logic voltage ripple, disrupting the controller.

### 2.5 RK3588 USB2.0 Tuning interface

RK3588 USB2.0 supports TYPE-C0, TYPE-C1, USB2.0 HOST0 and USB2.0 HOST1. Steps:

1. Select the test interface on the left of red box 1; the right-hand field automatically generates its SQ test command.

2. Select parameters in red box 2 by typing or using up/down buttons. Each item shows its range and description.

3. Choose the parameters and press Confirm in red box 2. The adjacent field generates io commands, and Code Output in box 3 generates reference code.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p014-figure-01.png)

Figure 6.  RK3588 USB2.0 PHY Tuning InterfaceRK3588 USB2.0  signal-tuning parameters. 

Table 5.  RK3588 USB2.0  signal-tuning parameters

| Parameter | Description |
| --- | --- |
| TXRISE | Adjust HS Tx slew rate to change rise/fall times |
| TXPREEMPAMP | Adjust HS Tx pre-emphasis current |
| TXPREEMPPLUSE | Adjust pre-emphasis-current duty cycle; effective only with TXPREEMPAMP TUNE enabled |
| TXHSXV | Adjust HS Tx DP/DM crossing voltage; no obvious change |
| TXVREF | Adjust HS Tx DC voltage; visibly changes eye amplitude |
| TXRES | Adjust HS Tx impedance; changes amplitude and rise/fall times |
| TXFSLS | Adjust FS/LS Tx impedance; changes amplitude, rise/fall times, crossing voltage and duty cycle |
| HOST DISCONNECT DETECTION | Adjust disconnect threshold; HOST only |

### 2.6 RV1106 USB2.0 Tuning interface

RV1106 USB2.0 supports pre-emphasis, its strength, ODT, eye height, squelch, Bvalid and disconnect thresholds. RV1103 and RV1103B lack a VBUS DET package pin and therefore cannot adjust Bvalid; other options match RV1106.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p016-figure-01.png)

Figure 7.  RV1106 USB2.0 PHY Tuning Interface

Table 6.  RV1106 USB2.0  signal-tuning parameters

| Parameter | Description |
| --- | --- |
| Pre-emphasize | Adjust HS Tx pre-emphasis; enabled by default |
| Pre-emphasize Strength | Adjust HS Tx pre-emphasis strength; register is effective only when pre-emphasis is enabled |
| HS ODT Value | Adjust 45Ω ODT resistance. Higher input lowers resistance and raises eye height without affecting FS/LS slew rate |
| Eye Height | Adjust HS Tx eye height. Setting 4:470mV also requires chip logic voltage &gt; 850mV |
| Squelch | Adjust HS Rx squelch threshold |
| BValid | Adjust VBUS DET threshold; Device only |
| HOST Disconnect Detection | Adjust disconnect threshold; HOST only |

### 2.7 RV1109 USB2.0 Tuning interface

RV1109 USB2.0 supports slew rate, eye height, squelch and disconnect threshold. RV1126 has the same options.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p017-figure-01.png)

Figure 8.  RV1109 USB2.0 PHY Tuning Interface



Table 7.  RV1109 USB2.0  signal-tuning parameters

| Parameter | Description |
| --- | --- |
| Slew Rate | Adjust HS Tx eye slew rate |
| Eye Height | Adjust HS Tx eye height |
| Squelch | Adjust HS Rx squelch threshold |
| HOST Disconnect Detection | Adjust disconnect threshold; HOST only |

### 2.8 RK1808 USB3.1 Tuning interface

RK1808 USB3.1 supports Tx driver voltage, Tx driver swing and Tx driver pre-emphasis strength.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p018-figure-01.png)

Figure 9.  RK1808 USB3.1 PHY Tuning Interface

Table 8.  RK1808 USB3.1  signal-tuning parameters

| Parameter | Description |
| --- | --- |
| TX driver voltage | Tune Tx output common-mode voltage of TXP/TXN differential signals |
| TX driver swing | Tune Tx driver swing |
| TX driver pre-emphasis strength | Tune Tx driver pre-emphasis strength |

### 2.9 RK1820 USB3.1 Tuning interface

RK1820 USB3.1 supports Full Txswing and Txmargin, Low Swing and Txmargin, Tx De-emphasis and Boost Level. Steps:

1. RK1820 USB3.1 supports PHY ID configuration. Read the register using the command in red box 1, then enter the value in the register-value field; otherwise an error is reported.

2. Press start in red box 2 to enable the Confirm buttons.

3. Choose the parameters and press Confirm in red box 3. The adjacent field generates io commands, and Code Output in box Code Output generates reference code.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p019-figure-01.png)

### 2.10 RK3399 USB3.1 Tuning interface

RK3399 USB3.1 supports OTG0 and OTG1. Steps:

1. Select the test interface on the left of red box 1; the right-hand field automatically generates its SQ test command.

2. RK3399 USB3.1 detects both Type-C orientations. With the Type-C cable correctly attached, read the orientation register using the command in box 2 and enter its value; otherwise an error appears.

3. Press start in box 3. Interface selection in box 1 becomes unavailable and Confirm in box 5 becomes active.

4. RK3399 USB3.1 PHY registers lack upper-16-bit write_enable bits. To avoid changing unrelated or untuned bits, read the initial register value using the command in red box 4 and enter it in the initial-value field to its right.

5. Choose the parameters and press Confirm in red box 5. The adjacent field generates io commands, and Code Output in box 6 generates reference code.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p020-figure-01.png)

Figure 10.  RK3399 USB3.1 PHY Tuning InterfaceRK3399 USB3.1  signal-tuning parameters. 

Table 9.  RK3399 USB3.1  signal-tuning parameters

| Parameter | Description |
| --- | --- |
| BOOST LEVEL | Adjust Tx boost level |

### 2.11 RK3528 USB3.1 Tuning interface

RK3528 USB3.1 supports Full Txswing and Txmargin, Low Swing and Txmargin, Tx De-emphasis and Boost Level. RK3562 and RK3568 share these options.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p021-figure-01.png)

Figure 11.  RK3528 USB3.1 PHY Tuning Interface

Table 10.  RK3528 USB3.1  signal-tuning parameters

| Parameter | Description |
| --- | --- |
| Full Txswing and TXmargin | Full swing/Txmargin tuning: TX_SWING and TX_MARGIN[2:0] jointly control Tx output amplitude |
| Low swing and Txmargin | Low swing/Txmargin tuning; same function as Full Tx swing, different levels |
| TX De-emphasis | Configure transmitter de-emphasis level |
| Boost Level | Adjust Tx boost level |

### 2.12 RK3588 USB3.1 Tuning interface

RK3588 USB3.1 tuning covers USB3-OTG0 (USB3&amp;Dp CombPhy0), USB3-OTG1 (USB3&amp;Dp CombPhy1) and USB3-HOST2 (USB3&amp;PCIE&amp;SATA CombPhy). Steps:

1. Select the test interface on the left of red box 1; the right-hand field automatically generates its SQ test command.

2. For USB3-OTG0/1, first read the orientation register for CombPhy0/1 using box 2, then enter its value. It must match 0xCx or 0x3x, otherwise an error appears. If reading fails (usually with Type-C), attach a USB cable to the port under test so CombPhy0/1 is active, then read again.

3. For USB3-HOST2 skip box 2 and press START in box 3.

4. After START, USB3-OTG0/1 activates the left-side Confirm buttons in box 5 and disables the right-side USB3-HOST2 buttons in box 6; selecting HOST2 reverses this.

5. RK3588 USB3.1 PHY registers lack upper-16-bit write_enable bits. To avoid changing unrelated or untuned bits, read the initial register value using the command in red box 4 and enter it in the initial-value field to its right.

6. Choose the parameters and press Confirm in red box 5. The adjacent field generates io commands, and Code Output in box 7 generates reference code.

![Interface figure from Chinese source](/docs/rockchip-usb-sq-tool/assets/cn-p023-figure-01.png)

Figure 12.  RK3588 USB3.0 PHY Tuning InterfaceRK3588 USB3.1 signal-tuning parameters. 

Table 11.  RK3588 USB3.1  signal-tuning parameters

| Parameter | Description |
| --- | --- |
| TX Driver main-tap level(USB3-OTG) | Adjust SS Tx voltage |
| TX Pmos current control(USB3-OTG) | Adjust SS Tx current; use only if voltage tuning is insufficient |
| TX De-emphasis(USB3-OTG) | Adjust SS Tx de-emphasis |
| TX Slew Rate(USB3-OTG) | Adjust SS Tx slew rate |
| Full Txswing and TXmargin(USB3-HOST) | Full swing/Txmargin tuning: TX_SWING and TX_MARGIN[2:0] jointly control Tx output amplitude |
| Low swing and Txmargin(USB3-HOST) | Low swing/Txmargin tuning; same function as Full Tx swing, different levels |
| TX De-emphasis(USB3- HOST) | Configure transmitter de-emphasis level |

## 3. Generated USB PHY tuning code

### 3.1 RK1808 USB2.0 PHY

Add RK1808 USB2.0 tuning code in `rk1808_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk1808_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 3.2 RK1820 USB2.0 PHY

Add RK1820 USB2.0 tuning code in `HAL_USB_HsPhyInit()` in `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c`.

```text
HAL_Status HAL_USB_HsPhyInit(uint8_t id)
{
    ...
#elif defined(SOC_RK1820)
    /* OTG/Host PHY Tuning Code */
#elif defined(XXXX)
    ...
}
```

### 3.3 RK2116 USB2.0 PHY

Add RK2116 USB2.0 tuning code in `HAL_USB_HsPhyInit()` in `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c`.

```text
HAL_Status HAL_USB_HsPhyInit(uint8_t id)
{
    ...
#elif defined(RKMCU_RK2116)
    /* OTG PHY Tuning Code */
#elif defined(XXXX)
    ...
}
```

### 3.4 RK2118 USB2.0 PHY

Add RK2118 USB2.0 tuning code in `HAL_USB_HsPhyInit()` in `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c`.

```text
HAL_Status HAL_USB_HsPhyInit(uint8_t id)
{
    ...
#elif defined(RKMCU_RK2118)
    /* OTG PHY Tuning Code */
#elif defined(XXXX)
    ...
}
```

### 3.5 RK3036/RK312X USB2.0 PHY

RK3036 currently supports only kernel 3.10. Add the code to `usb20otg_hw_init()` in `kernel/drivers/usb/dwc_otg_310/usbdev_rk3036.c`.

```text
static void usb20otg_hw_init(void) {
    .../* OTG/Host PHY Tuning Code */
}
```

Add RK312X tuning code in `rk312x_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk312x_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 3.6 RK3228 USB2.0 PHY

Add RK3228 tuning code in `rk3228_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk3228_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 3.7 RK3288 USB2.0 PHY

RK3288 has two PHY-driver versions. Select Kernel Version 4.4 for kernel 4.4 and older, or 4.19 for kernel 4.19 and newer. This affects only generated code format, not io commands. For 4.19, append tuning to `rk3288_usb_phy_probe_init()` in `kernel/drivers/phy/rockchip/phy-rockchip-usb.c`. Three USB ports require a register-offset condition before each converted code fragment. OTG code:

```text
if (rk_phy->reg_offset == 0x320) {
    ... /* OTG PHY Tuning Code */
}
```

HOST1 code:

```text
if (rk_phy->reg_offset == 0x334) {
    ... /* HOST1 PHY Tuning Code */
}
```

HOST2 code:

```text
if (rk_phy->reg_offset == 0x348) {
    ... /* HOST2 PHY Tuning Code */
}
```

RK3288 kernel 4.4 driver: `kernel/drivers/usb/dwc_otg_310/usbdev_rk32.c`. Append OTG code to `usb20otg_hw_init()`, HOST1 to `rk_ehci_hw_init()`, and HOST2 to `usb20host_hw_init()`.

### 3.8 RK3308B_S/RK3308 USB2.0 PHY

For RK3308B_S, add code at the end of the `soc_is_rk3308bs()` branch in `rk3308_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
if (soc_is_rk3308bs()) {
    ... /* OTG/HOST PHY Tuning Code */
}
```

For RK3308, append code to the else branch in `rk3308_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
if (soc_is_rk3308bs()) {
    ...
} else {
    .../* OTG/HOST PHY Tuning Code */
}
```

### 3.9 RK3326S/PX30S/RK3326/PX30/RK3328 USB2.0 PHY

For RK3326S/PX30S, append code to the `soc_is_px30s()` branch of `rk3328_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
if (soc_is_px30s()) {
    .../* OTG/HOST PHY Tuning Code */
}
```

For RK3326/PX30/RK3328, append code to the else branch of `rk3328_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
if (soc_is_px30s()) {
    ...
} else {
    .../* OTG/HOST PHY Tuning Code */
}
```

### 3.10 RK3399 USB2.0 PHY

Add RK3399 USB2.0 tuning before `if (!of_property_read_bool(node, "rockchip,u2phy-tuning"))` in `rk3399_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. TYPE-C0/HOST0 share the PHY at 0xe450; TYPE-C1/HOST1 share 0xe460. Prefix generated code with a register-address condition to distinguish these four ports.

```text
if (rphy->phy_cfg->reg == 0xe450) {
    .../* TYPE-C0/HOST0 PHY Tuning Code */
} else {
    ... /* TYPE-C1/HOST1 PHY Tuning Code */
}
if (!of_property_read_bool(node, "rockchip,u2phy-tuning"))
    return ret;
```

### 3.11 RK3506 USB2.0 PHY

Add RK3506 USB2.0 tuning code in `rk3506_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk3506_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
}
```

### 3.12 RK3528 USB2.0 PHY

Add RK3528 USB2.0 tuning code in `rk3528_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk3528_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
}
```

### 3.13 RK3562 USB2.0 PHY

Add RK3562 USB2.0 tuning code in `rk3562_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rk3562_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
]
```

### 3.14 RK3568/RK3566 USB2.0 PHY

RK3568/RK3566 share code appended to `rk3568_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. RK3568 OTG/HOST1 share base 0xfe8a0000; HOST2/HOST3 share 0xfe8b0000. Use a base-address condition before the generated code. OTG/HOST1:

```text
if (rphy->phy_cfg->reg == 0xfe8a0000) {
    ... /* OTG/Host1 PHY Tuning Code */
}
```

HOST2/HOST3 code:

```text
if (rphy->phy_cfg->reg == 0xfe8b0000) {
    ... /* Host2/Host3 PHY Tuning Code */
}
```

### 3.15 RK3576 USB2.0 PHY

Add RK3576 USB2.0 tuning in `rk3576_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. Its two ports OTG0/OTG1 are distinguished by `rphy->phy_cfg->reg`, as shown:

```text
static int rk3576_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
        unsigned int reg;
        int ret = 0;

        if (rphy->phy_cfg->reg == 0x0) {
            .../* OTG0 PHY Tuning Code */
        } else if (rphy->phy_cfg->reg == 0x2000) {
            .../* OTG1 PHY Tuning Code */
        }
        return ret;
}
```

### 3.16 RK3588 USB2.0 PHY

Add RK3588 USB2.0 tuning in `rk3588_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. Distinguish TYPE-C0, TYPE-C1, HOST0 and HOST1 by `rphy->phy_cfg->reg`:

```text
if (rphy->phy_cfg->reg == 0x0000) {
    .../* TYPE-C0 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0x4000) {
    .../* TYPE-C1 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0x8000) {
    .../* HOST0 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0xc000) {
    .../* HOST1 PHY Tuning Code */
}
```

### 3.17 RV1103/RV1106 USB2.0 PHY

Add RV1103/RV1106 tuning code in `rv1106_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rv1106_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG PHY Tuning Code */
}
```

### 3.18 RV1103B USB2.0 PHY

Add RV1103B tuning code in `rv1103b_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rv1103b_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG PHY Tuning Code */
}
```

### 3.19 RV1109/RV1126 USB2.0 PHY

Add RV1109/RV1126 tuning code in `rv1126_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-usb2.c`.

```text
static int rv1126_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    if (rphy->phy_cfg->reg == 0xff4c0000) {
        .../* OTG PHY Tuning Code */
    }
    if (rphy->phy_cfg->reg == 0xff4c8000) {
        .../* HOST PHY Tuning Code */
    }
}
```

### 3.20 RV1126B/RV1126B-P USB2.0 PHY

Add RV1126B/RV1126B-P tuning code in `rv1126b_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`.

```text
static int rv1126b_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/HOST PHY Tuning Code */
}
```

### 3.21 RK1808 USB3.1 PHY

Add RK1808 USB3.1 tuning code in `rk1808_combphy_cfg` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-combphy.c`.

```text
static int rk1808_combphy_cfg(struct rockchip_combphy_priv *priv)
{
    ...
    if (priv->phy_type == PHY_TYPE_PCIE) {
        ...
    } else if (priv->phy_type == PHY_TYPE_USB3) {
        ...
        /*
         * Tuning Tx:
         * offset 0x21b8 bit[7:4]: lane 0 TX driver swing
         * tuning bits with weight, "1111" represents the
         * largest swing and "0000" the smallest.
         */
        reg = readl(priv->mmio + 0x21b8);
        reg = (reg & ~0xf0) | 0xe0;
        writel(reg, priv->mmio + 0x21b8);

        .../* USB3.1 PHY Tuning Code */

        ...
    } else {
        dev_err(priv->dev, "failed to cfg incompatible PHY type\n");
        return -EINVAL;
    }
    return 0;
}
```

### 3.22 RK1820 USB3.1 PHY

Add RK1820 USB3.1 tuning code in `HAL_USB_SsPhyInit()` in `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c`.

```text
HAL_Status HAL_USB_SsPhyInit(uint8_t id)
{
    ...
    switch (id) {
    case 0:
#ifdef COMB_PIPE_PHY0_BASE
    /* OTG PHY Tuning Code */
#endif
        break;
    case 1:
#ifdef COMB_PIPE_PHY1_BASE
    /* OTG PHY Tuning Code */
#endif
        break;
    default:
        break;
    }
    ...
}
```

### 3.23 RK3399 USB3.1 PHY

Add RK3399 USB3.1 tuning code in `tcphy_tx_usb3_cfg_lane()` in `kernel/drivers/phy/phy-rockchip-typec.c`.

```text
static void tcphy_tx_usb3_cfg_lane(struct rockchip_typec_phy *tcphy, u32 lane)
{
    .../* OTG0/OTG1 PHY Tuning Code */
}
```

### 3.24 RK3528/RK3562/RK3566/RK3568 USB3.1 PHY

RK3528, RK3562 and RK3568 USB3.1 code belongs in the corresponding combphy_cfg function in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`. The RK3528 insertion point in `rk3528_combphy_cfg` follows:

```text
case PHY_TYPE_USB3:
    ...
    /* Enable adaptive CTLE for USB3.0 Rx */
    val = readl(priv->mmio + 0x200);
    val &= ~GENMASK(17, 17);
    val |= 0x01;
    writel(val, priv->mmio + 0x200);
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

RK3562 insertion point in `rk3562_combphy_cfg`:

```text
case PHY_TYPE_USB3:
    /* Set SSC downward spread spectrum */
    val = readl(priv->mmio + (0x1f << 2));
    val &= ~GENMASK(5, 4);
    val |= 0x01 << 4;
    writel(val, priv->mmio + 0x7c);
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

RK3566 and RK3568 share code; insert it at this point in `rk3568_combphy_cfg`:

```text
case PHY_TYPE_USB3:
    ...
    /* Set PLL KVCO to min and set PLL charge pump current to max */
    writel(0xf0, priv->mmio + (0xa << 2));
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
```

### 3.25 RK3576 USB3.1 PHY

Append RK3576 USB3-OTG0 tuning to `udphy_init()` in `kernel/drivers/phy/rockchip/phy-rockchip-usbdp.c`.

```text
ret = udphy_status_check(udphy);
if (ret)
    goto assert_phy;
    .../* USB3-OTG0 PHY Tuning Code */
return 0;
```

Append RK3576 USB3-OTG1 tuning to `rk3576_combphy_cfg()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`.

```text
case PHY_TYPE_USB3:
    /* Set Rx squelch input filler bandwidth */
    writel(0x0d, priv->mmio + (0x14 << 2));
    ...
    .../* USB3-OTG1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

### 3.26 RK3588 USB3.1 PHY

RK3588 USB3-OTG and USB3-HOST use different insertion points. USB3-OTG currently lacks a dedicated tuning interface like USB2.0, so append its code to `rk3588_udphy_init()` in `kernel/drivers/phy/rockchip/phy-rockchip-usbdp.c`.

```text
ret = rk3588_udphy_status_check(udphy);
if (ret)
    goto assert_phy;
    .../* USB3-OTG PHY Tuning Code */
return 0;
```

RK3588 USB3-HOST tuning belongs in `rk3588_combphy_cfg()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`.

```text
case PHY_TYPE_USB3:
    /* Set SSC downward spread spectrum */
    val = readl(priv->mmio + (0x1f << 2));
    val &= ~GENMASK(5, 4);
    val |= 0x01 << 4;
    ...
    .../* USB3-HOST PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

### 3.27 RV1126B USB3.1 PHY

Add RV1126B USB3.1 tuning code in `rv1126b_combphy_cfg()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`.

```text
case PHY_TYPE_USB3:
    /* Set Rx squelch input filler bandwidth */
    writel(0x0e, priv->mmio + (0x14 << 2));
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    rockchip_combphy_param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    rockchip_combphy_param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    rockchip_combphy_param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    rockchip_combphy_param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

{% endraw %}
