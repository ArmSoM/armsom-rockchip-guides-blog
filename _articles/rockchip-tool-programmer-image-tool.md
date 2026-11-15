---
title: "programmer_image_tool: convert update.img for eMMC, SPI NOR and NAND programmers"
description: "programmer_image_tool turns a packaged firmware into data for a manufacturing programmer. It prepares files on the host; it does not directly flash the connected board."
excerpt: "programmer_image_tool turns a packaged firmware into data for a manufacturing programmer. It prepares files on the host; it does not directly flash the connected board."
translation_key: "rockchip-tool-programmer-image-tool"
slug: "rockchip-tool-programmer-image-tool"
lang: "en"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "programmer_image_tool"]
---

{% raw %}

![programmer_image_tool](/assets/rockchip-tools/flows/programmer-image-tool-en.svg)

`programmer_image_tool` turns a packaged firmware into data for a manufacturing programmer. It prepares files on the host; it does not directly flash the connected board. The output depends on the target storage technology and geometry.

## eMMC and SPI NOR

The source examples are:

```text
./programmer_image_tool -i update.img -t emmc
```

```text
./programmer_image_tool -i update.img -t spinor
```

The manual describes `out_image.bin` for these cases. Confirm whether the production programmer expects that raw layout and whether the firmware matches the exact product.

## SPI NAND

```text
./programmer_image_tool -i update.img -b 256 -p 4 -t spinand -o out
```

Here `-b 256` means a 256 KB block and `-p 4` a 4 KB page in the original example. These are flash-geometry inputs, not generic performance settings. Output is generated in a directory rather than treated as one universally interchangeable eMMC file.

## SLC NAND

```text
./programmer_image_tool -i update.img -b 256 -p 4 -s 256 -t slc -2 -o rockdev
```

The example adds `-s 256` for 256-byte spare/OOB and preserves the source `-2` option. The short manual does not fully explain `-2`; confirm its required meaning against the matched tool/programmer documentation before production. Do not guess or omit it silently.

## Verify the manufacturing handoff

Record firmware hash, tool version, flash part number, block/page/OOB geometry and output hashes. Check the programmer's handling of bad blocks, ECC/OOB and boot placement with its own documentation; generating a directory does not establish those settings. Program a designated sample, read back where applicable and verify cold boot and storage behavior.

Linux 1.26 and Windows 1.28 are provided separately. Command prefixes/executable names must match the host. The Linux manual contains a broken local image reference; no missing screenshot is claimed to have been recovered. The numeric examples are source examples, not ArmSoM-tested geometry values.

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

## Download, versions and SHA-256

Download the matching archive, verify the hash, and extract the entire directory. For the split Linux PinDebug archive, follow the linked reconstruction instructions; the hash below is for the reconstructed file.

| Host / version | Package |
|---|---|
| Linux / 1.26 | [programmer_image_tool_v1.26_linux.tar.gz](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/programmer-image-tool/programmer_image_tool_v1.26_linux.tar.gz) |
| Windows / 1.28 | [programmer_image_tool_v1.28.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/programmer-image-tool/programmer_image_tool_v1.28.zip) |

**programmer_image_tool_v1.26_linux.tar.gz — SHA-256**

```text
ea38df34e97cd697aa53d09af06fa1ff2b0847fe2c9699c49d1890509cc5c0d0
```

**programmer_image_tool_v1.28.zip — SHA-256**

```text
696d07d8232a637ef59b724d0c0522e500fc9f26571c2633d96271ffce48e56f
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Source documents and figures

- programmer_image_tool 1.26 Linux / 1.28 Windows; both bundled usage PDFs
- [Original PDF: user_manual.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/454e7646c90d.pdf)
- [Original PDF: user_manual.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/47ce51e919d3.pdf)

## Continue with the related workflow

- [Firmware_Merger: flat RK, flat GPT and compact GPT images](/articles/rockchip-tool-firmware-merger/)
- [afptool and rkImageMaker: understand and package Rockchip update.img](/articles/rockchip-tool-firmware-pack-tools/)
- [Rockchip Storage Application Guide: Flash, Boot Flow, Partitions, Programming and Vendor Storage](/articles/099-rockchip-storage-application/)
- [Rockchip tool download and workflow index](/articles/rockchip-tools-download-guide/)

## Find the correct ArmSoM board documentation

For board and carrier requirements, use the product manual first. The links below are platform references, not a statement that this archived tool has been validated on these products.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
