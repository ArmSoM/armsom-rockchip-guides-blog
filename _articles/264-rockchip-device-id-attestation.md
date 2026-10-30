---
title: "Rockchip Android Device ID attestation: production programming and verification"
description: "Rockchip Android Device ID attestation: production programming and verification — Android / Rockchip"
excerpt: "Rockchip Android Device ID attestation: production programming and verification — Android / Rockchip"
translation_key: "264-rockchip-device-id-attestation"
slug: "264-rockchip-device-id-attestation"
lang: "en"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Platform reference for ArmSoM developers. Source: RK-YH-YF-780 V1.0.0. Match the SoC, Android SDK/BSP, kernel configuration and vendor tools to your board before use; the source does not establish support for a specific ArmSoM board or kernel release. No ArmSoM hardware validation was performed. Examples and screenshots are from the source, not ArmSoM test results.

## Source scope

V1.0.0 covers RK3399, RK3326, RK3562, RK3568, RK3588 and RK3576 running Android 14 or later. The SDK, TEE and production tools must support the procedure. Only the Chinese source PDF is available; its three original figures are used in every language.

## 1 Overview

ID attestation lets a device prove hardware identifiers such as its serial number or IMEI. Proving device identity makes use cases such as true zero-touch remote provisioning more secure: the remote party can establish that it is talking to the intended device rather than an impersonator.

Before shipment, a copy of the hardware identifiers is created that only the trusted execution environment (TEE) can access. A user can unlock the bootloader and modify system software and identifiers reported by the Android framework, but cannot manipulate the TEE-held copy in that way. Attestation therefore proves the original hardware identifiers and prevents identity impersonation. This guide describes programming, verification and associated precautions.

## 2 Programming and verification

### 2.1 Hardware identifiers

Supported identifiers are:

1. Brand name: `Build.BRAND`
2. Device name: `Build.DEVICE`
3. Product name: `Build.PRODUCT`
4. Manufacturer: `Build.MANUFACTURER`
5. Model: `Build.MODEL`
6. Serial number
7. IMEI of every radio
8. MEID of every radio

All Android devices have the first six identifiers, which are necessary for this feature. Devices with integrated cellular radios must also support attestation of their IMEI or MEID. Each property is limited to **32 bytes**; observe this limit when configuring product properties and supplying GMS application information.

### 2.2 Programming sequence

![Typical keybox and ID attestation configuration sequence](/docs/rockchip-device-id-attestation/images/p004-01.png)

*Typical keybox and ID attestation configuration sequence — Chinese source PDF; original figure, p. 4.*

The serial number written with `RKDevInfoWriteTool` and the serial number configured in ID attestation must be identical on the same device. Customers may customize tools using the corresponding Rockchip interfaces. The next figure is a reference programming sequence.

![Reference production programming sequence](/docs/rockchip-device-id-attestation/images/p005-01.png)

*Reference production programming sequence — Chinese source PDF; original figure, p. 5.*

Dependencies:

- Generating an RKP CSR requires the device serial-number property; program the serial number first.
- The RKP CSR generation service runs only after Android has started normally.

RKP CSR generation is triggered when the serial-number storage changes from empty to a written value, or when the stored serial number differs from the one used for the previous CSR.

#### 2.2.1 Write ID attestation

Use `RKDevInfoTool-for-IDATTE-V1.0.0` or `rk_vendor_storage`.

![RKDevInfoTool ID attestation dialog](/docs/rockchip-device-id-attestation/images/p006-01.png)

*RKDevInfoTool ID attestation dialog — Chinese source PDF; original figure, p. 6.*

The command-line example is below. Refer to `vendorstorage-tutorial` for tool usage. **All ID attestation properties must be written together in one operation; they cannot be written separately over multiple operations.**

```text
rk_vendor_storage.exe -w -i 21 -v "rockchip;rk3562_tgo;rk3562_tgo;rockchip;rk3562_tgo;rk83991906;;;"
```

#### 2.2.2 Verify ID attestation

Two verification methods are described. First, inspect the serial log:

```text
write_id_attestation_to_secure_storage size=288
write id attestation : ret=0
```

Second, run the VTS test:

```sh
data/local/tmp/VtsAidlKeyMintTargetTest --gtest_filter=PerInstance/AttestKeyTest.EcdsaAttestationID/0_android_hardware_security_keymint_IKeyMintDevice_default
```

Build `VtsAidlKeyMintTargetTest` by running `mm` in the source directory `hardware/interfaces/security/keymint/aidl/vts/functional`. The source writes the executable path without a leading `/`; this transcription preserves that path and joins PDF line wraps in the option and test name. Verify the actual location on the target.

To prevent user modification, ID attestation cannot be changed after writing. A repeated write produces this original log message:

```text
id attestation already exsit,you cannot update it!
```

If a change is required, the source instructs using the firmware flashing tool’s **Erase All** operation before writing again. This is a destructive erase, not an ordinary property update.

## 3 Appendix

The original appendix contains only empty items `1.` and `2.`; no references or technical content follow them. Nothing has been reconstructed or invented.

Related official documentation: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
