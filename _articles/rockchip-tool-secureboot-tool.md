---
title: "SecureBootTool 1.85: understand a historical Rockchip Secure Boot workflow"
description: "SecureBootTool belongs to a historical Rockchip security toolchain. Its bundled application note covers signing, eFuse provisioning, firmware upgrades and testing."
excerpt: "SecureBootTool belongs to a historical Rockchip security toolchain. Its bundled application note covers signing, eFuse provisioning, firmware upgrades and testing."
translation_key: "rockchip-tool-secureboot-tool"
slug: "rockchip-tool-secureboot-tool"
lang: "en"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "SecureBootTool"]
---

{% raw %}

![SecureBootTool](/assets/rockchip-tools/flows/secureboot-tool-en.svg)

SecureBootTool belongs to a historical Rockchip security toolchain. Its bundled application note covers signing, eFuse provisioning, firmware upgrades and testing. It must not be presented as a ready-made security solution for every current ArmSoM board.

## Match the documented platform first

The 2016 V1.2 application note names RK3126, RK3128, RK3228, RK3288 and RK3368. It also gives component-version prerequisites such as miniloader 2.19 and U-Boot 2.17 or later within that historical solution. Those numbers are not minimum requirements for unrelated modern SDKs. The package's location in a Linux source folder alone does not determine the executable's host architecture.

## Separate four stages

1. **Design:** select the exact SoC security scheme and decide key custody, update signing and recovery policy.
2. **Prepare:** create or load the approved key material and sign every required boot artifact using the matched toolchain.
3. **Verify:** validate signatures and test the boot/update chain while recovery remains available.
4. **Provision:** only the product-specific procedure may commit public-key hashes or enable one-time states. Ordinary firmware flashing does not substitute for this process.

## Practical acceptance record

Record hardware revision, SDK, ROM/Loader scheme, key identifier, signed artifact hashes, provisioning state and recovery result. Keep secret key material separate from the record. A security GUI reporting success is not evidence that all boot stages are authenticated.

## Use modern references where appropriate

For contemporary Linux platforms, compare the linked newer Linux Secure Boot guide with the exact board BSP. Do not combine an old GUI's steps with newer OTP layouts or certificate formats. This article is an orientation and migration guide for the archived package, not an invented universal fuse-burning tutorial.

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

## Download, versions and SHA-256

Download the matching archive, verify the hash, and extract the entire directory. For the split Linux PinDebug archive, follow the linked reconstruction instructions; the hash below is for the reconstructed file.

| Host / version | Package |
|---|---|
| Host to verify / 1.85 | [SecureBootTool_v1.85_foruser.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/secureboot-tool/SecureBootTool_v1.85_foruser.zip) |

**SecureBootTool_v1.85_foruser.zip — SHA-256**

```text
d241ccc7503a3202c68a036f51cdd7f5d2db2a7594eb749ec19e2ffb2c67681a
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Source documents and figures

- SecureBootTool_v1.85_foruser.zip; Rockchip Secure Boot Application Note V1.2 (2016)
- [Original PDF: Rockchip Secure Boot Application Note_v1.2_20160202.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/094883c784c1.pdf)

## Continue with the related workflow

- [Complete Rockchip Secure Boot Application Guide: Signing, eFuse, OTP and Verification](/articles/105-rockchip-secure-boot/)
- [Rockchip Linux Secure Boot Developer Guide](/articles/203-rockchip-linux-secure-boot/)
- [rk_sign_tool and sign_tool: prepare and verify signed Rockchip firmware](/articles/rockchip-tool-rk-sign-tool/)
- [EfuseTool 1.42: prepare a traceable Secure Boot provisioning station](/articles/rockchip-tool-efuse-tool/)
- [Rockchip tool download and workflow index](/articles/rockchip-tools-download-guide/)

## Find the correct ArmSoM board documentation

For board and carrier requirements, use the product manual first. The links below are platform references, not a statement that this archived tool has been validated on these products.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
