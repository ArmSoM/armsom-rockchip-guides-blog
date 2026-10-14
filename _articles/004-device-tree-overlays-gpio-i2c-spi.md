---
title: "Device Tree Overlays for GPIO I2C and SPI on RK3576 and RK3588"
description: "Use overlays and pin control deliberately when extending an ArmSoM RK3576 or RK3588 design."
translation_key: "004-device-tree-overlays-gpio-i2c-spi"
slug: "device-tree-overlays-gpio-i2c-spi"
date: 2026-10-12
author: "ArmSoM Editorial"
category: interfaces
products: [Sige5, Sige7]
tags: [Linux device tree, GPIO, I2C, SPI, ArmSoM 40-pin header]
keywords: "Linux device tree, GPIO, I2C, SPI, ArmSoM 40-pin header"
canonical_url: ""
---

# Device Tree Overlays for GPIO I2C and SPI on RK3576 and RK3588

Use overlays and pin control deliberately when extending an ArmSoM RK3576 or RK3588 design.

![Device Tree Overlays for GPIO I2C and SPI on RK3576 and RK3588 workflow diagram](/assets/004-device-tree-overlays-gpio-i2c-spi-flow.svg)

## What this article helps you decide

Device tree changes describe hardware intent. A GPIO header pin is not safe to repurpose until its alternate functions and electrical constraints are checked. This guide is an engineering workflow, not a substitute for the schematic, release notes, or safety instructions for the exact ArmSoM product and revision.

## Platform context

ArmSoM pin tables show multiple functions per 40-pin-header signal; Linux overlay documentation explains how overlay changes are resolved against a base tree.

The practical rule is to keep the board, BSP/image version, peripheral revision, power arrangement, and reproducible commands together in one project record. That makes a field issue diagnosable and prevents a working lab configuration from becoming an undocumented dependency.

## Reproducible starting procedure

Begin with a minimal node, compile it with the kernel-matched dtc, and inspect the live tree after boot.

```bash
/dts-v1/; /plugin/;
/ { fragment@0 { target-path = "/"; __overlay__ { demo { compatible = "vendor,demo"; status = "okay"; }; }; }; };
```

Record the command output, kernel release, image release, board revision, and any attached peripheral identifiers. When a command writes media, changes boot configuration, or controls power, stop and consult the board-specific manual before proceeding.

![Device Tree Overlays for GPIO I2C and SPI on RK3576 and RK3588 validation loop diagram](/assets/004-device-tree-overlays-gpio-i2c-spi-validation.svg)

## Validation checklist

- [ ] Confirm the exact ArmSoM board, revision, memory/storage SKU, and power method.
- [ ] Capture `uname -a`, image/build version, and the full serial boot log.
- [ ] Verify the expected hardware node or connector before tuning performance.
- [ ] Change one variable at a time and keep the before/after evidence.
- [ ] State workload, environment, software versions, and method with any result.

## Troubleshooting

**Symptom: the expected device or behavior is absent.** First compare the running image and device tree to the product documentation, then check power, cable direction, connector seating, and boot logs.

**Symptom: the command exists but gives an unexpected result.** This is a syntax demonstration, not a board-ready overlay. Resolve labels, pinctrl groups, regulators, and bus addresses from the exact ArmSoM kernel tree.

**Symptom: a configuration appears to work once but not after reboot.** Check whether the change belongs in the image, boot configuration, device tree, service definition, or a transient runtime command. Preserve the serial log and a minimal reproduction.

## Publishing notes

This article intentionally contains no fabricated benchmark, compatibility claim, or laboratory measurement. Add measured results only with the test unit, software revision, workload, ambient conditions, repetitions, and raw evidence.

## References

- [ArmSoM Open Source Hardware Developer Center](https://docs.armsom.org/)
- [ArmSoM Sige5 RK3576 documentation](https://docs.armsom.org/armsom-sige5)
- [ArmSoM Sige7 RK3588 documentation](https://docs.armsom.org/armsom-sige7)
- [ArmSoM AIM5 RK3576 documentation](https://docs.armsom.org/armsom-aim5)
- [ArmSoM AIM7 RK3588 documentation](https://docs.armsom.org/armsom-aim7)
- [Linux kernel DeviceTree documentation](https://docs.kernel.org/devicetree/)
- [Rockchip RK3588 brief datasheet](https://www.rock-chips.com/uploads/pdf/2022.8.26/191/RK3588%20Brief%20Datasheet.pdf)


## Pre-publication check

- [ ] Verify each product capability and pin/interface statement against the current board documentation.
- [ ] Replace generic commands with the tested image/release-specific command where needed.
- [ ] Confirm screenshots, diagrams, and alt text match the final board and workflow.
- [ ] Add a canonical URL and author/editor attribution in front matter.
- [ ] Have a technical owner review safety, flashing, electrical, and availability statements.
