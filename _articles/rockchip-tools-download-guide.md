---
title: "ArmSoM Rockchip tools: downloads and 24 practical usage guides"
description: "Choose a tool by the operation you need, then check its host platform, version, source manual and board requirements. This collection contains 24 tool families and 35 packages. Each guide links to the actual GitHub download, and all four language editions share the same commands and hashes."
excerpt: "Choose a tool by the operation you need, then check its host platform, version, source manual and board requirements. This collection contains 24 tool families and 35 packages. Each guide links to the actual GitHub download, and all four language editions share the same commands and hashes."
translation_key: "rockchip-tools-download-guide"
slug: "rockchip-tools-download-guide"
lang: "en"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["Rockchip", "ArmSoM", "Tools"]
---

Choose a tool by the operation you need, then check its host platform, version, source manual and board requirements. This collection contains 24 tool families and 35 packages. Each guide links to the actual GitHub download, and all four language editions share the same commands and hashes.

34 packages are available; USB SQ Tool 1.5 is withheld pending vendor security verification.

[Security review / 核验状态](https://github.com/ArmSoM/rockchip-tools/blob/main/SECURITY-REVIEW.md)

## Download, versions and SHA-256

[ArmSoM / rockchip-tools](https://github.com/ArmSoM/rockchip-tools)

- [RKDevTool download and workflow: Loader, partitions and update.img](/articles/rockchip-tool-rkdevtool/)
- [DriverAssitant 5.13: install Rockusb and ADB drivers on Windows](/articles/rockchip-tool-driver-assistant/)
- [upgrade_tool download: command-line Rockchip firmware workflow](/articles/rockchip-tool-upgrade-tool/)
- [boot_merger: prepare a Rockchip Loader without mixing DDR and boot components](/articles/rockchip-tool-boot-merger/)
- [Firmware_Merger: flat RK, flat GPT and compact GPT images](/articles/rockchip-tool-firmware-merger/)
- [afptool and rkImageMaker: understand and package Rockchip update.img](/articles/rockchip-tool-firmware-pack-tools/)
- [Linux_Diff_Firmware: build a Rockchip differential OTA package](/articles/rockchip-tool-diff-firmware/)
- [DDR Bandwidth Tool: measure memory traffic and interpret Rockchip counters](/articles/rockchip-tool-ddr-bandwidth/)
- [DDR_UserTool 1.41: select DDR test configurations for a board](/articles/rockchip-tool-ddr-user-tool/)
- [rk_ddrbin_tool: inspect and change DDR initialization parameters](/articles/rockchip-tool-ddrbin-tool/)
- [PinDebug: inspect Rockchip IOMUX, GPIO and voltage domains](/articles/rockchip-tool-pin-debug/)
- [USB SQ Tool 1.5: from USB eye-diagram diagnosis to PHY settings](/articles/rockchip-tool-usb-sq-tool/)
- [rk_sign_tool and sign_tool: prepare and verify signed Rockchip firmware](/articles/rockchip-tool-rk-sign-tool/)
- [SecureBootTool 1.85: understand a historical Rockchip Secure Boot workflow](/articles/rockchip-tool-secureboot-tool/)
- [Linux SecurityAVB: keys, signed boot images and version boundaries](/articles/rockchip-tool-linux-avb/)
- [Linux SecurityDM: inspect dm-verity and encrypted-rootfs packaging](/articles/rockchip-tool-linux-dm/)
- [BoardProofTool 1.01: download, CPU ID handling and integration checklist](/articles/rockchip-tool-board-proof/)
- [EfuseTool 1.42: prepare a traceable Secure Boot provisioning station](/articles/rockchip-tool-efuse-tool/)
- [ParameterTool 1.2: review Rockchip partition parameters before flashing](/articles/rockchip-tool-parameter-tool/)
- [RKDevInfoWriteTool: controlled serial-number and MAC provisioning](/articles/rockchip-tool-devinfo-write/)
- [RKPCBATool 1.2.1: configure Linux board functional tests and operator checks](/articles/rockchip-tool-pcba-tool/)
- [HDCP Key Writer: package authorized keys and control device provisioning](/articles/rockchip-tool-hdcp-key-writer/)
- [SDDiskTool 1.78: distinguish SD boot, upgrade and PCBA media](/articles/rockchip-tool-sd-disk-tool/)
- [programmer_image_tool: convert update.img for eMMC, SPI NOR and NAND programmers](/articles/rockchip-tool-programmer-image-tool/)

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

Download the matching archive, verify the hash, and extract the entire directory. For the split Linux PinDebug archive, follow the linked reconstruction instructions; the hash below is for the reconstructed file.

[SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS) · [PDF](https://github.com/ArmSoM/rockchip-tools/tree/main/manuals)
