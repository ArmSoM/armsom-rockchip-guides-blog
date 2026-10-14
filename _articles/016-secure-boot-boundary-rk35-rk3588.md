---
title: "Secure-Boot Boundaries on RK3576, RK3588 and RK3506J"
description: "How to write an accurate security claim for ArmSoM products by separating silicon features, bootloader policy and manufacturing controls."
translation_key: "016-secure-boot-boundary-rk35-rk3588"
slug: "secure-boot-boundary-rk35-rk3588"
date: 2026-10-14
author: "ArmSoM Editorial"
category: production
products: [Sige5, Sige7, Forge1]
tags: [secure boot, RK3576, RK3588, Forge1, security]
keywords: "Rockchip secure boot ArmSoM, RK3588 security, Forge1"
---

# Secure-Boot Boundaries on RK3576, RK3588 and RK3506J

![Secure boot chain](../assets/016-secure-boot.svg)

“Supports secure boot” is incomplete unless it names the verified chain. ROM, first-stage loader, U-Boot, kernel, device tree and root filesystem can each have different signing and recovery behavior.

## Build an evidence table

For each ArmSoM SKU record the SoC, boot media, loader build, key hierarchy, fuse state, debug policy and recovery procedure. Never infer a security property from Raspberry Pi or Jetson Nano documentation; their trust anchors and tooling differ.

```bash
cat /proc/cmdline
cat /proc/device-tree/compatible
dmesg | grep -iE 'verified|secure|rollback|avb'
```

These reads identify runtime context; they do not prove a production fuse configuration. Use the board manual and Rockchip security documentation for provisioning.

## Product positioning

Sige5 (RK3576) and Sige7 (RK3588) target flexible Linux/Android development. Forge1 (RK3506J) targets industrial control with Buildroot. The right security design depends on update ownership, physical access and service life—not on TOPS or connector count.

## References

- [Sige5](https://docs.armsom.org/armsom-sige5)
- [Sige7](https://docs.armsom.org/armsom-sige7)
- [Forge1](https://docs.armsom.org/zh/armsom-forge1)

## Pre-publication check

- [ ] Name the exact boot chain and key owner.
- [ ] Separate lab debug from production fuse policy.
- [ ] Demonstrate recovery after a rejected image.
