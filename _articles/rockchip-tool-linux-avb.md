---
title: "Linux SecurityAVB: keys, signed boot images and version boundaries"
description: "The supplied Linux AVB package documents an older verified-boot arrangement using certificates and permanent attributes."
excerpt: "The supplied Linux AVB package documents an older verified-boot arrangement using certificates and permanent attributes."
translation_key: "rockchip-tool-linux-avb"
slug: "rockchip-tool-linux-avb"
lang: "en"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "Linux SecurityAVB"]
---

{% raw %}

![Linux SecurityAVB](/assets/rockchip-tools/flows/linux-avb-en.svg)

The supplied Linux AVB package documents an older verified-boot arrangement using certificates and permanent attributes. It is useful for maintaining that BSP generation; it is not a universal replacement for a newer SDK's verified-boot implementation.

## Inspect the supplied interface

The script's usage lists `-n`, `-f`, `-s`, `-d`, `-l` and `-u`. Begin by reading the script and its help:

```text
./avb_user_tool.sh -h
```

`-n` takes a 16-byte product identifier and creates keys; in this script it removes an existing `avb_keys` directory first. Do not run it in a directory containing keys you need. `-f` prepares attributes using the Secure Boot private key; `-s` signs boot/recovery images. `-d` programs permanent attributes, while `-l`/`-u` lock/unlock the device. These are not equivalent-risk operations.

## Prepare isolated inputs

The distributed clean package omits the original sample-key directory. Generate and protect project-specific keys in a controlled environment. The script refers to PRK, PIK, PSK and PUK roles; their certificates and product identifier must remain consistent. Verify Python/OpenSSL and host-tool compatibility with this historical script before use.

## Image-size requirements

The script requires partition-size alignment to 4096 bytes and room for AVB metadata; its error text describes 68K beyond the original file. Review the actual calculation and partition size rather than trimming an image to make signing succeed. Authentication is not filesystem encryption.

## Avoid mixing generations

The V2.2.5 manual discusses a 4M security partition and historical OP-TEE arrangements. Newer Blog references describe different SDK versions; retain each version's partition and trust-chain requirements. Test verification failure, signed updates and recovery before any permanent provisioning. This article does not supply production keys or claim hardware validation.

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

## Download, versions and SHA-256

Download the matching archive, verify the hash, and extract the entire directory. For the split Linux PinDebug archive, follow the linked reconstruction instructions; the hash below is for the reconstructed file.

| Host / version | Package |
|---|---|
| Linux / manual 2.2.5 | [linux-security-avb-without-keys.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/linux-avb/linux-security-avb-without-keys.zip) |

**linux-security-avb-without-keys.zip — SHA-256**

```text
fc7eae22caeadd51d85723b65451c70e88475a2c9ba7e7f5394ca1314688d17d
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Source documents and figures

- Rockchip_User_Manual_Linux_AVB_EN.pdf V2.2.5; avb_user_tool.sh
- [Original PDF: Rockchip_User_Manual_Linux_AVB_EN.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/50f19e52844b.pdf)

## Continue with the related workflow

- [Rockchip Linux Secure Boot Developer Guide](/articles/203-rockchip-linux-secure-boot/)
- [Rockchip U-Boot Nextdev Developer Guide: Boot, Drivers, FIT and Platform Configuration](/articles/157-rockchip-uboot-nextdev/)
- [rk_sign_tool and sign_tool: prepare and verify signed Rockchip firmware](/articles/rockchip-tool-rk-sign-tool/)
- [Rockchip tool download and workflow index](/articles/rockchip-tools-download-guide/)

## Find the correct ArmSoM board documentation

For board and carrier requirements, use the product manual first. The links below are platform references, not a statement that this archived tool has been validated on these products.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
