---
title: "PinDebug: inspect Rockchip IOMUX, GPIO and voltage domains"
description: "PinDebug connects pin-function planning with the registers currently configured on a target. It is useful when an interface fails because a pad remains assigned to GPIO or another peripheral."
excerpt: "PinDebug connects pin-function planning with the registers currently configured on a target. It is useful when an interface fails because a pad remains assigned to GPIO or another peripheral."
translation_key: "rockchip-tool-pin-debug"
slug: "rockchip-tool-pin-debug"
lang: "en"
date: "2026-11-15"
author: "ArmSoM"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "PinDebug"]
---

{% raw %}

![PinDebug](/assets/rockchip-tools/flows/pin-debug-en.svg)

PinDebug connects pin-function planning with the registers currently configured on a target. It is useful when an interface fails because a pad remains assigned to GPIO or another peripheral. The manual is V1.1; downloads are Linux 1.11 and Windows 1.18.

## Begin offline

Open a project for the correct SoC before searching pins. The manual lists RK3588, RK3566/3568, RV1126/1109, RV1106/1103 and RK3528; that does not establish support for RK3576 or every ArmSoM product. Pin and IOMUX views serve different navigation needs. Right-clicking a function can show the corresponding I/O command for review.

## Read the running board

Use a matched BSP with the required ADB/debug access. Connect, read the IOMUX registers, and compare actual assignments with the schematic and DTS. Record the current values before changing anything. A double-click can write a change when connected; offline inspection is not equivalent to a harmless live interaction.

## Interpret GPIO fields

`ddr` is GPIO direction here, not DDR memory. `dr` is the output data setting and `ext_port` represents the observed port level. The tool also exposes pull settings, drive strength and `vsel`. Check voltage domains and external circuitry before any electrical change. A register value alone cannot establish that an attached peripheral tolerates the voltage.

## Make a lasting fix

After identifying a conflict, reproduce the intended configuration in the BSP's pinctrl/DTS or appropriate driver. Runtime register changes can disappear on reboot or be overwritten by a driver. Export the GPIO table where supported and keep the before/after record. Test cold boot, suspend/resume and the affected peripheral.

The Linux archive is distributed in two parts due to size; follow its reconstruction link before extracting. The source screenshots remain Chinese where no English original exists. No live register write or voltage adjustment was performed here.

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

## Download, versions and SHA-256

Download the matching archive, verify the hash, and extract the entire directory. For the split Linux PinDebug archive, follow the linked reconstruction instructions; the hash below is for the reconstructed file.

| Host / version | Package |
|---|---|
| Linux / 1.11 | [pin_debug_tool_v1.11_for_linux.tar.gz](https://github.com/ArmSoM/rockchip-tools/blob/main/downloads/pin-debug/README.md) |
| Windows / 1.18 | [pin_debug_tool_v1.18_20250322_win.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/pin-debug/pin_debug_tool_v1.18_20250322_win.zip) |

**pin_debug_tool_v1.11_for_linux.tar.gz — SHA-256**

```text
16cb25b8fc2533e8f730a790c7486ab5042baa964b3bdb95a161ddce143c4a34
```

**pin_debug_tool_v1.18_20250322_win.zip — SHA-256**

```text
88c550ee9a578eaa451a9b8a05b3d088247dc63dd9bd426b832191994dc6a7d5
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Source documents and figures

- PinDebug_UserManual.pdf V1.1; Linux 1.11 and Windows 1.18 packages
- [Original PDF: PinDebug_UserManual.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/1cae2e2c0777.pdf)

Figures are extracted from the identified original PDF. If only a Chinese original exists, its interface text is retained; captions are localized. Screenshots are historical examples, not current ArmSoM test results.

![Original manual illustration · PinDebug](/assets/rockchip-tools/pin-debug/zh-p02-01.png)

PinDebug_UserManual.pdf · p. 2

![Original manual illustration · PinDebug](/assets/rockchip-tools/pin-debug/zh-p02-02.png)

PinDebug_UserManual.pdf · p. 2

![Original manual illustration · PinDebug](/assets/rockchip-tools/pin-debug/zh-p03-01.png)

PinDebug_UserManual.pdf · p. 3

## Continue with the related workflow

- [Rockchip Linux Pinctrl: Complete GPIO, IOMUX, Drive Strength and DTS Guide](/articles/116-rockchip-linux-pinctrl/)
- [USB SQ Tool 1.5: from USB eye-diagram diagnosis to PHY settings](/articles/rockchip-tool-usb-sq-tool/)
- [Rockchip tool download and workflow index](/articles/rockchip-tools-download-guide/)

## Find the correct ArmSoM board documentation

For board and carrier requirements, use the product manual first. The links below are platform references, not a statement that this archived tool has been validated on these products.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
