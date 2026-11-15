---
title: "RKPCBATool 1.2.1: configure Linux board functional tests and operator checks"
description: "RKPCBATool combines a Windows host application with test programs on the Linux target."
excerpt: "RKPCBATool combines a Windows host application with test programs on the Linux target."
translation_key: "rockchip-tool-pcba-tool"
slug: "rockchip-tool-pcba-tool"
lang: "en"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "RKPCBATool"]
---

{% raw %}

![RKPCBATool](/assets/rockchip-tools/flows/pcba-tool-en.svg)

## The PCBA manual is available as four-language articles

The package contains the 37-page Chinese and 43-page English RK-KF-YF-301 V1.2.0 manuals, matching the primary sources of our existing Linux PCBA Developer Guide. We reuse its complete editable technical article instead of duplicating the same 80 source pages. The links below open article text, not PDF downloads.

The complete guide covers installation/ADB paths, JSON test items, automatic/manual judgments, reboot settings, secondary development and packaging, software architecture, all nine protocol tables, device-side code and rootfs/recovery builds, display-equipped PCBA tests, and installation, ADB forward, Windows 10 and upload-file-fail troubleshooting.

[Read the complete Linux PCBA Developer Guide](/articles/197-rockchip-linux-pcba/)

- 1. PCBA Test Tool
- 2. PCBA Software Design Guide
- 3. Code Framework for PCBA Testing
- 4. PCBA Test with Screen
- 5. Appendix

### Separate package and manual versions

Package V1.2.1, manual V1.2.0 and the product-table V1.7 are different version identifiers. Chinese removed the old camera-button section while English retains it; the full guide labels it historical and separates the new automatic camera test. RK3358, protocol TPYE/TYPE, CMD/RES and differing code paths remain traceable source discrepancies, not silently corrected guesses.

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

## GitHub tool directory, versions and SHA-256

Open the matching GitHub directory, select the required host/version, then verify the file hash and extract the full directory. Links below open repository directories.

[Open the tool directory on GitHub](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/pcba-tool)

| Platform / version | File | SHA-256 |
|---|---|---|
| Windows host + Linux target / 1.2.1 | `RKPCBATool_v1.2.1_20251226.zip` | `ec3747fa2360e8e1793920882d7ec51a4aa1087a4cfab5d3c218f677999440bc` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Source documents and figures

- Rockchip_Developer_Guide_Linux_PCBA_CN.pdf
- Rockchip_Developer_Guide_Linux_PCBA_EN.pdf

## Continue with the related workflow

- [Rockchip Linux PCBA Test Developer Guide](/articles/197-rockchip-linux-pcba/)
- [Rockchip PCBA Test Tool Developer Guide](/articles/252-rockchip-pcba-test-tool/)
- [RKDevInfoWriteTool: controlled serial-number and MAC provisioning](/articles/rockchip-tool-devinfo-write/)
- [Rockchip tool download and workflow index](/articles/rockchip-tools-download-guide/)

## Find the correct ArmSoM board documentation

For board and carrier requirements, use the product manual first. The links below are platform references, not a statement that this archived tool has been validated on these products.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
