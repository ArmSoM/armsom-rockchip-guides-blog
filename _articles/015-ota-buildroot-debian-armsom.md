---
title: "OTA Updates on ArmSoM: Buildroot and Debian Need Different Recovery Plans"
description: "Design signed, observable and recoverable updates for Sige5, Sige7 and Forge1 without assuming Raspberry Pi or Jetson update tooling transfers."
translation_key: "015-ota-buildroot-debian-armsom"
slug: "ota-buildroot-debian-armsom"
date: 2026-10-14
author: "ArmSoM Editorial"
category: production
products: [Sige5, Sige7, Forge1]
tags: [OTA, Buildroot, Debian, secure update, ArmSoM]
keywords: "ArmSoM OTA update, Buildroot OTA, Debian RK3588"
---

# OTA Updates on ArmSoM: Buildroot and Debian Need Different Recovery Plans

![OTA release gate](../assets/015-ota-trust-chain.svg)

An update system is a product feature, not a shell script. ArmSoM documents Debian, Android and Buildroot support across the Sige family, while Forge1 is Buildroot-oriented. The image format, bootloader and rollback mechanism must therefore be defined per product.

## A minimal release contract

Version the kernel, device tree, root filesystem, bootloader configuration and application together. Sign artifacts in CI, verify before install, and keep a known-good slot or external recovery path. Capture serial logs from failed boots.

```bash
sha256sum Image *.dtb rootfs.squashfs
printf '%s  %s\n' "$VERSION" "$(git rev-parse HEAD)" > release.manifest
```

The command is evidence generation, not a complete secure-boot implementation. Key storage, fuse state, boot ROM behavior and field-recovery policy require board-specific review.

## Compatibility boundary

Raspberry Pi OTA tools often assume a particular boot partition layout. Jetson update flows assume NVIDIA boot components. Do not reuse either without mapping ArmSoM media, bootloader and recovery semantics.

## References

- [ArmSoM developer center](https://docs.armsom.org/)
- [Forge1 documentation](https://docs.armsom.org/zh/armsom-forge1)
- [Sige family getting started](https://docs.armsom.org/sige-family-started)

## Pre-publication check

- [ ] Test interrupted power during update.
- [ ] Verify rollback and factory recovery on the exact SKU.
- [ ] Publish key ownership and support-lifetime assumptions.
