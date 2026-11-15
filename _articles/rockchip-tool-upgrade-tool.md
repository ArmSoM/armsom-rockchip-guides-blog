---
title: "upgrade_tool download: command-line Rockchip firmware workflow"
description: "upgrade_tool exposes Rockusb operations for repeatable workstation procedures. This collection provides Linux 2.44, macOS 2.13 and Windows 2.46 separately."
excerpt: "upgrade_tool exposes Rockusb operations for repeatable workstation procedures. This collection provides Linux 2.44, macOS 2.13 and Windows 2.46 separately."
translation_key: "rockchip-tool-upgrade-tool"
slug: "rockchip-tool-upgrade-tool"
lang: "en"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "upgrade_tool"]
---

{% raw %}

![upgrade_tool](/assets/rockchip-tools/flows/upgrade-tool-en.svg)

`upgrade_tool` exposes Rockusb operations for repeatable workstation procedures. This collection provides Linux 2.44, macOS 2.13 and Windows 2.46 separately. Use the binary for the host; the version numbers are not interchangeable.

## Identify before writing

Connect one correctly powered board in its documented Loader/Maskrom mode. List devices, then query information when the device mode supports it. The following are inspection commands, not an instruction to flash:

```text
upgrade_tool ld
upgrade_tool rfi
upgrade_tool rci
upgrade_tool pl
```

`ld` lists connected devices; `rfi` reads flash information, `rci` chip information and `pl` the partition layout. If identification fails, fix the driver, cable or boot mode before proceeding.

## RAM Loader and persistent writes

The manual's Maskrom download example loads upgrade code into RAM:

```text
upgrade_tool db rkxxloader.bin
```

Replace the example filename with the board's matched Loader. `db` is different from `ul`, which writes a Loader to storage. For partition programming, the manual first supplies parameter and then named images:

```text
upgrade_tool di -p parameter.txt
upgrade_tool di -u uboot.img -b boot.img
```

These commands write storage. The image, partition table, SoC, storage choice and backup must agree. Names such as `-boot_a` and `-boot_b` denote specific partitions; they are not interchangeable with a non-A/B layout. Full firmware uses:

```text
upgrade_tool uf update.img
```

## Multiple devices and destructive operations

The manual uses the LocationID reported by `ld` to select a device; `100` below is an example, not a persistent serial number:

```text
upgrade_tool -s 100 ul rkxxloader.bin
```

Commands `wl`/`rl` access raw storage ranges; derive offsets and lengths from the actual layout. `ef`/`el` erase data. V1.0 describes `el` for eMMC, while V1.1 extends discussion to SPI NAND/NOR; do not transfer that support claim to an older binary.

## Verify and troubleshoot

Check each exit status and retain the device identity and command log. A successful write still requires cold-boot and OS-version verification. An oversized image is a partition mismatch, not a reason to force a raw write. Repeatable chip-flag errors require correct packaging; intermittent USB errors call for cable/power checks. No connected-device operation was run for this article.

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

## Download, versions and SHA-256

Download the matching archive, verify the hash, and extract the entire directory. For the split Linux PinDebug archive, follow the linked reconstruction instructions; the hash below is for the reconstructed file.

| Host / version | Package |
|---|---|
| Linux / 2.44 | [upgrade_tool_v2.44_for_linux.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/upgrade-tool/upgrade_tool_v2.44_for_linux.zip) |
| macOS / 2.13 | [upgrade_tool_v2.13_for_mac.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/upgrade-tool/upgrade_tool_v2.13_for_mac.zip) |
| Windows / 2.46 | [upgrade_tool_v2.46.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/upgrade-tool/upgrade_tool_v2.46.zip) |

**upgrade_tool_v2.44_for_linux.zip — SHA-256**

```text
b779239cb1dc6cadd823520439e4163cf223145d048e6b5f9eaf1735b407cff8
```

**upgrade_tool_v2.13_for_mac.zip — SHA-256**

```text
d49db00e892b72a1760b9766b5e4ab998e75a17a37cb3acc8bf13b981b0ffc34
```

**upgrade_tool_v2.46.zip — SHA-256**

```text
de1dc7ce00ed5cfdaa0432f1c7e3efaf096e5dbb7e0ad851345739f6342c06dc
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Source documents and figures

- 命令行开发工具使用文档.pdf V1.0 (Linux/macOS packages), V1.1 (Windows package)
- [Original PDF: 命令行开发工具使用文档.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/925b67105873.pdf)
- [Original PDF: 命令行开发工具使用文档v1.1.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/8a7aa375abfc.pdf)

## Continue with the related workflow

- [RKDevTool download and workflow: Loader, partitions and update.img](/articles/rockchip-tool-rkdevtool/)
- [Rockchip Storage Application Guide: Flash, Boot Flow, Partitions, Programming and Vendor Storage](/articles/099-rockchip-storage-application/)
- [Rockchip tool download and workflow index](/articles/rockchip-tools-download-guide/)

## Find the correct ArmSoM board documentation

For board and carrier requirements, use the product manual first. The links below are platform references, not a statement that this archived tool has been validated on these products.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
