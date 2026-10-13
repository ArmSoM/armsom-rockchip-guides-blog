---
title: "Thermal and Performance Observability for RK3576 and RK3588 Edge Systems"
description: "Measure an ArmSoM edge system as a thermal and workload-dependent system, not a single benchmark number."
translation_key: "011-thermal-performance-observability"
slug: "thermal-performance-observability"
date: 2026-10-12
author: "ArmSoM Editorial"
tags: [thermal design, Linux telemetry, RK3576 RK3588, ArmSoM]
keywords: "thermal design, Linux telemetry, RK3576 RK3588, ArmSoM"
canonical_url: ""
---

# Thermal and Performance Observability for RK3576 and RK3588 Edge Systems

Measure an ArmSoM edge system as a thermal and workload-dependent system, not a single benchmark number.

![Thermal and Performance Observability for RK3576 and RK3588 Edge Systems workflow diagram](/assets/011-thermal-performance-observability-flow.svg)

## What this article helps you decide

Instrument temperature, frequency policy, workload, ambient conditions, and cooling configuration before comparing software releases. This guide is an engineering workflow, not a substitute for the schematic, release notes, or safety instructions for the exact ArmSoM product and revision.

## Platform context

ArmSoM product pages specify operating ranges for particular boards. They are not a substitute for measurement of the complete enclosure, power supply, and workload.

The practical rule is to keep the board, BSP/image version, peripheral revision, power arrangement, and reproducible commands together in one project record. That makes a field issue diagnosable and prevents a working lab configuration from becoming an undocumented dependency.

## Reproducible starting procedure

Log sensors and policy data alongside application timestamps, then report methodology with every result.

```bash
watch -n 1 "cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null; cat /sys/devices/system/cpu/cpufreq/policy*/scaling_cur_freq 2>/dev/null"
```

Record the command output, kernel release, image release, board revision, and any attached peripheral identifiers. When a command writes media, changes boot configuration, or controls power, stop and consult the board-specific manual before proceeding.

![Thermal and Performance Observability for RK3576 and RK3588 Edge Systems validation loop diagram](/assets/011-thermal-performance-observability-validation.svg)

## Validation checklist

- [ ] Confirm the exact ArmSoM board, revision, memory/storage SKU, and power method.
- [ ] Capture `uname -a`, image/build version, and the full serial boot log.
- [ ] Verify the expected hardware node or connector before tuning performance.
- [ ] Change one variable at a time and keep the before/after evidence.
- [ ] State workload, environment, software versions, and method with any result.

## Troubleshooting

**Symptom: the expected device or behavior is absent.** First compare the running image and device tree to the product documentation, then check power, cable direction, connector seating, and boot logs.

**Symptom: the command exists but gives an unexpected result.** Thermal-zone order and frequency nodes vary. Convert temperature units only after inspecting the platform; do not compare raw readings across images without identifying the sensor.

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
