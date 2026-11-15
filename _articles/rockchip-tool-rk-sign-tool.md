---
title: "rk_sign_tool and sign_tool: prepare and verify signed Rockchip firmware"
description: "Signing prepares boot artifacts for an established trust chain. It is separate from programming a public-key hash into OTP/eFuse."
excerpt: "Signing prepares boot artifacts for an established trust chain. It is separate from programming a public-key hash into OTP/eFuse."
translation_key: "rockchip-tool-rk-sign-tool"
slug: "rockchip-tool-rk-sign-tool"
lang: "en"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "rk_sign_tool and sign_tool"]
---

{% raw %}

![rk_sign_tool and sign_tool](/assets/rockchip-tools/flows/rk-sign-tool-en.svg)

Signing prepares boot artifacts for an established trust chain. It is separate from programming a public-key hash into OTP/eFuse. This collection includes Linux 1.42, an older Linux directory snapshot and macOS 1.2; their command names and capabilities must be checked individually.

## Establish the signing identity

Choose the target chip and key policy from the board SDK. Keep private keys outside the tool repository and application logs. Preserve unsigned inputs, output names and key identifiers so a release can be reproduced. Do not generate a new key merely to fix a failed update on an already provisioned device.

## Source workflow example

The Linux README provides this RK3326 sequence using an existing key pair:

```text
rk_sign_tool cc --chip 3326
rk_sign_tool lk --key privateKey.pem --pubkey publicKey.pem
rk_sign_tool sl --loader loader.bin
rk_sign_tool si --img uboot.img
```

This example changes local artifacts; it is not a universal command for RK3576/RK3588. The `sign_tool` PDF additionally describes `sf`/`vf` for signing/verifying full firmware, `sl`/`vl` for Loaders and `si`/`vi` for images. Use each binary's supported verification command and verify the artifact before deployment.

## Important switches

The manual's `ss --flag=0x20` enables miniloader OTP writing. It is not a harmless formatting option. The A/B setting `exclude_boot_sign=true` skips automatic boot-image signing, so another deliberate signing step may be required. External signing uses extract/inject stages; retain the exact data association across those stages.

## Acceptance and faults

Validate the signature, intended chip, key identity and boot-chain coverage. A valid signature with the wrong enrolled key still fails boot. Different padding modes and image formats are platform-specific. Test signed upgrade and recovery with the product's security policy before enabling irreversible provisioning. No keys were generated and no hardware trust state was changed here.

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

## Download, versions and SHA-256

Download the matching archive, verify the hash, and extract the entire directory. For the split Linux PinDebug archive, follow the linked reconstruction instructions; the hash below is for the reconstructed file.

| Host / version | Package |
|---|---|
| Linux / 1.42 | [rk_sign_tool_v1.42_linux.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/rk_sign_tool_v1.42_linux.zip) |
| Linux / directory snapshot | [rk_sign_tool-linux-directory-snapshot.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/rk_sign_tool-linux-directory-snapshot.zip) |
| macOS / 1.2 | [sign_tool_v1.2_mac.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/sign_tool_v1.2_mac.zip) |

**rk_sign_tool_v1.42_linux.zip — SHA-256**

```text
799a0fad6e363b141e244580479ed8434e05c070d924db8a289e277e50a7ca1d
```

**rk_sign_tool-linux-directory-snapshot.zip — SHA-256**

```text
db3cd185e5e38b886be0a162a92d3400368acfb5684744b8e91af5ef9cdeb06e
```

**sign_tool_v1.2_mac.zip — SHA-256**

```text
30ee08cb35681b735f1636bcc9215af64c4b6b5ca303a0889509be32209ea8ed
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Source documents and figures

- rk_sign_tool/readme.txt; sign_tool用户使用手册.pdf V1.0; package revision notes
- [Original PDF: sign_tool用户使用手册.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/8528f18eea87.pdf)

## Continue with the related workflow

- [Complete Rockchip Secure Boot Application Guide: Signing, eFuse, OTP and Verification](/articles/105-rockchip-secure-boot/)
- [Rockchip Linux Secure Boot Developer Guide](/articles/203-rockchip-linux-secure-boot/)
- [EfuseTool 1.42: prepare a traceable Secure Boot provisioning station](/articles/rockchip-tool-efuse-tool/)
- [Rockchip tool download and workflow index](/articles/rockchip-tools-download-guide/)

## Find the correct ArmSoM board documentation

For board and carrier requirements, use the product manual first. The links below are platform references, not a statement that this archived tool has been validated on these products.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
