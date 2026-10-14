---
title: "First Boot and Serial Recovery on ArmSoM RK3576 and RK3588 Boards"
description: "Establish a repeatable serial-first bring-up workflow for Sige5, CM5, Sige7, AIM5, and AIM7 deployments."
translation_key: "003-first-boot-serial-recovery"
slug: "first-boot-serial-recovery"
date: 2026-10-12
author: "ArmSoM Editorial"
category: linux
products: [Sige5, Sige7, CM5, AIM5, AIM7]
tags: [serial console, boot diagnosis, Rockchip Linux, ArmSoM Sige5 Sige7]
keywords: "serial console, boot diagnosis, Rockchip Linux, ArmSoM Sige5 Sige7"
canonical_url: ""
---

# First Boot and Serial Recovery on ArmSoM RK3576 and RK3588 Boards

Establish a repeatable serial-first bring-up workflow for Sige5, CM5, Sige7, AIM5, and AIM7 deployments.

![First Boot and Serial Recovery on ArmSoM RK3576 and RK3588 Boards workflow diagram](/assets/003-first-boot-serial-recovery-flow.svg)

## What this article helps you decide

Treat the serial console as the primary evidence source; capture boot logs before changing images or boot media. This guide is an engineering workflow, not a substitute for the schematic, release notes, or safety instructions for the exact ArmSoM product and revision.

## Platform context

ArmSoM documentation publishes product-specific manuals and images. UART pin multiplexing differs by board, so never transplant a header pinout between products.

The practical rule is to keep the board, BSP/image version, peripheral revision, power arrangement, and reproducible commands together in one project record. That makes a field issue diagnosable and prevents a working lab configuration from becoming an undocumented dependency.

## Reproducible starting procedure

Start with a known-good power supply, documented image, and the board-specific UART connection.

```bash
sudo picocom -b 1500000 /dev/ttyUSB0
# Capture the complete boot log before resetting again
```

Record the command output, kernel release, image release, board revision, and any attached peripheral identifiers. When a command writes media, changes boot configuration, or controls power, stop and consult the board-specific manual before proceeding.

![First Boot and Serial Recovery on ArmSoM RK3576 and RK3588 Boards validation loop diagram](/assets/003-first-boot-serial-recovery-validation.svg)

## Validation checklist

- [ ] Confirm the exact ArmSoM board, revision, memory/storage SKU, and power method.
- [ ] Capture `uname -a`, image/build version, and the full serial boot log.
- [ ] Verify the expected hardware node or connector before tuning performance.
- [ ] Change one variable at a time and keep the before/after evidence.
- [ ] State workload, environment, software versions, and method with any result.

## Troubleshooting

**Symptom: the expected device or behavior is absent.** First compare the running image and device tree to the product documentation, then check power, cable direction, connector seating, and boot logs.

**Symptom: the command exists but gives an unexpected result.** The baud rate and UART device are examples only. Use the product manual; a silent console can be wiring, level, mux, boot-stage, or host-permission related.

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
