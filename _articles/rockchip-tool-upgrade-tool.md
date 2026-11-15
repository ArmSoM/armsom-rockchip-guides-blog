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

## Command-line manual: versions and scope

The complete workflow below combines the Chinese V1.0 manual and the file labelled V1.1. The latter still says 1.0 on its cover, but adds SPI NAND erasure; the difference is retained explicitly. The source lists RK3308, RK3326, RK3399, RK3328, RK3228H, RK3229, RK3368, RK3228, RK3288, RK3128, RK3126, RK3188, RK3036, RK1808, PX30, RV1109, RV1126, RK3566 and RK3568. This is not an ArmSoM hardware-validation list.

### 1. List upgrade devices

```text
upgrade_tool ld
```

Upgradeable devices are collectively called Rockusb and can be in Loader or Maskrom mode. Identify the target before operating multiple boards; LocationID is not a permanent serial number.

### 2. Download Boot into RAM

```text
upgrade_tool db rkxxloader.bin
```

In Maskrom, download Boot before subsequent communication. This does not write device storage. On failure, check DDR/SoC or USB as appropriate and reboot the device before retrying. The filename is a source example; use the board-matched Loader.

### 3. Program the Loader

```text
upgrade_tool ul rkxxloader.bin
upgrade_tool ul rkxxloader.bin -noreset
upgrade_tool ul rkxxloader.bin SPINOR
```

The three forms reboot after programming, suppress that reboot, or select SPINOR on a device with multiple storage types. Both Maskrom and Loader are supported; the operation downloads Boot, generates IDBlock and writes storage. Also check flash support and soldering. For intermittent communication faults inspect USB; for repeatable failures investigate the device.

### 4. Program partition images

```text
upgrade_tool di -p parameter.txt
upgrade_tool di -k kernel.img
upgrade_tool di -u uboot.img -b boot.img
upgrade_tool di -vendor vendor.img
upgrade_tool di -boot_a boot.img -boot_b boot.img
```

Write the partition table first, then one or more images. Use the full partition name when no abbreviation exists, including A/B partitions. All source abbreviations follow. Diagnose missing/busy files, oversized images and USB failures separately; forcing an address is not a fix for a partition-size mismatch.

| Option | Partition |
|---|---|
| `-b` | `boot` |
| `-k` | `kernel` |
| `-r` | `recovery` |
| `-s` | `system` |
| `-u` | `uboot` |
| `-m` | `misc` |
| `-t` | `trust` |

### 5. Switch Loader to Maskrom

```text
upgrade_tool rd 3
```

### 6. Upgrade complete firmware

```text
upgrade_tool uf update.img
upgrade_tool uf update.img -noreset
```

Upgrade in Maskrom or Loader without first downloading Boot; the second form suppresses the final reboot. The seven source fault cases are: missing/busy file; invalid firmware identifier (check packaging); digest failure (check modification); read failure (update the packer and regenerate); image larger than its partition; wrong chip flag (read chip information and repack); and communication failure (USB for intermittent errors, device side for repeatable errors).

### 7. Read and write by address

```text
upgrade_tool wl 0x12000 oem.img
upgrade_tool rl 0x12000 0x2000 out.img
```

The first writes the file at LBA `0x12000`; the second reads `0x2000` sectors starting at `0x12000` into `out.img`. These are source examples, not addresses to reuse with another partition layout.

### 8. Erasure and the V1.1 difference

```text
upgrade_tool ef rkxxloader.bin
upgrade_tool el 0 0x2000
```

`ef` erases all data in Maskrom without a prior Boot download; the source lists eMMC and NAND. The `el` example erases `0x2000` sectors from sector 0. V1.0 lists only eMMC, whereas V1.1 lists `emmc|spinand|spinor`. V1.1 additionally gives this complete SPI NAND erasure sequence: enter Maskrom, then execute the following two lines in order. `-1` is the original value; confirm the corresponding implementation before use.

```text
upgrade_tool db rkxxloader.bin
upgrade_tool el 0 -1
```

### 9. Read device information

```text
upgrade_tool rfi
upgrade_tool rci
upgrade_tool pl
```

Read storage information, chip ID and partition table respectively.

### 10. Select storage

```text
upgrade_tool ssd
```

Run after successfully downloading Boot in Maskrom. `*` marks the current storage; enter the No shown before the desired storage.

### 11. Select a device

```text
upgrade_tool -s 100 ul rkxxloader.bin
```

Use `ld` to obtain the target LocationID and select it with `-s`; `100` is an example. This device-selection `-s` has a different scope from the system-partition abbreviation in `di -s`.

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

## GitHub tool directory, versions and SHA-256

Open the matching GitHub directory, select the required host/version, then verify the file hash and extract the full directory. Links below open repository directories.

[Open the tool directory on GitHub](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/upgrade-tool)

| Platform / version | File | SHA-256 |
|---|---|---|
| Linux / 2.44 | `upgrade_tool_v2.44_for_linux.zip` | `b779239cb1dc6cadd823520439e4163cf223145d048e6b5f9eaf1735b407cff8` |
| macOS / 2.13 | `upgrade_tool_v2.13_for_mac.zip` | `d49db00e892b72a1760b9766b5e4ab998e75a17a37cb3acc8bf13b981b0ffc34` |
| Windows / 2.46 | `upgrade_tool_v2.46.zip` | `de1dc7ce00ed5cfdaa0432f1c7e3efaf096e5dbb7e0ad851345739f6342c06dc` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Source documents and figures

- 命令行开发工具使用文档.pdf
- 命令行开发工具使用文档v1.1.pdf

## Continue with the related workflow

- [RKDevTool download and workflow: Loader, partitions and update.img](/articles/rockchip-tool-rkdevtool/)
- [Rockchip Storage Application Guide: Flash, Boot Flow, Partitions, Programming and Vendor Storage](/articles/099-rockchip-storage-application/)
- [Rockchip tool download and workflow index](/articles/rockchip-tools-download-guide/)

## Find the correct ArmSoM board documentation

For board and carrier requirements, use the product manual first. The links below are platform references, not a statement that this archived tool has been validated on these products.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
