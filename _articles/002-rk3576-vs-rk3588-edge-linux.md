---
title: "How to Choose RK3576 or RK3588 for an Edge Linux Design"
description: "Select the platform from interfaces, memory topology, media paths, and lifecycle constraints rather than a TOPS headline."
slug: "rk3576-vs-rk3588-edge-linux"
date: 2026-10-12
author: "ArmSoM Editorial"
tags: [architecture selection, ArmSoM Sige5 CM5, ArmSoM Sige7 AIM7]
keywords: "architecture selection, ArmSoM Sige5 CM5, ArmSoM Sige7 AIM7"
canonical_url: ""
---

# How to Choose RK3576 or RK3588 for an Edge Linux Design

Select the platform from interfaces, memory topology, media paths, and lifecycle constraints rather than a TOPS headline.

![How to Choose RK3576 or RK3588 for an Edge Linux Design workflow diagram](/assets/002-rk3576-vs-rk3588-edge-linux-flow.svg)

## What this article helps you decide

Compare required display, camera, PCIe, memory, and module form factor before finalizing a carrier. This guide is an engineering workflow, not a substitute for the schematic, release notes, or safety instructions for the exact ArmSoM product and revision.

## Platform context

Sige5/CM5 uses RK3576; Sige7/AIM7 uses RK3588. The published documents list different CPU and memory configurations, so verify the exact board SKU before a design freeze.

The practical rule is to keep the board, BSP/image version, peripheral revision, power arrangement, and reproducible commands together in one project record. That makes a field issue diagnosable and prevents a working lab configuration from becoming an undocumented dependency.

## Reproducible starting procedure

Use a requirements table; carry every “must have” signal to the ArmSoM manual and schematic.

```bash
python3 - <<'PY'
requirements = {"cameras": 2, "pcie_lanes": 1, "ram_gib": 8}
print(requirements)
PY
```

Record the command output, kernel release, image release, board revision, and any attached peripheral identifiers. When a command writes media, changes boot configuration, or controls power, stop and consult the board-specific manual before proceeding.

![How to Choose RK3576 or RK3588 for an Edge Linux Design validation loop diagram](/assets/002-rk3576-vs-rk3588-edge-linux-validation.svg)

## Validation checklist

- [ ] Confirm the exact ArmSoM board, revision, memory/storage SKU, and power method.
- [ ] Capture `uname -a`, image/build version, and the full serial boot log.
- [ ] Verify the expected hardware node or connector before tuning performance.
- [ ] Change one variable at a time and keep the before/after evidence.
- [ ] State workload, environment, software versions, and method with any result.

## Troubleshooting

**Symptom: the expected device or behavior is absent.** First compare the running image and device tree to the product documentation, then check power, cable direction, connector seating, and boot logs.

**Symptom: the command exists but gives an unexpected result.** A requirements dict is not hardware discovery. Confirm connector routing, voltage domains, and software image support in the relevant board documentation.

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
