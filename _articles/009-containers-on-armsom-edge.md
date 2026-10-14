---
title: "Production Friendly Containers for ArmSoM Edge Applications"
description: "Package an ARM64 edge service with explicit device access, image provenance, and a practical update path."
translation_key: "009-containers-on-armsom-edge"
slug: "containers-on-armsom-edge"
date: 2026-10-12
author: "ArmSoM Editorial"
category: linux
products: [Sige5, Sige7]
tags: [Docker containers, ARM64 edge Linux, ArmSoM RK3576 RK3588]
keywords: "Docker containers, ARM64 edge Linux, ArmSoM RK3576 RK3588"
canonical_url: ""
---

# Production Friendly Containers for ArmSoM Edge Applications

Package an ARM64 edge service with explicit device access, image provenance, and a practical update path.

![Production Friendly Containers for ArmSoM Edge Applications workflow diagram](/assets/009-containers-on-armsom-edge-flow.svg)

## What this article helps you decide

Containers isolate userspace dependencies but do not make kernel drivers, device nodes, or accelerators portable by themselves. This guide is an engineering workflow, not a substitute for the schematic, release notes, or safety instructions for the exact ArmSoM product and revision.

## Platform context

ArmSoM boards run Linux-oriented images; the host kernel and the vendor media/NPU stack remain part of the deployment contract.

The practical rule is to keep the board, BSP/image version, peripheral revision, power arrangement, and reproducible commands together in one project record. That makes a field issue diagnosable and prevents a working lab configuration from becoming an undocumented dependency.

## Reproducible starting procedure

Build multi-architecture images, pin base-image digests, and declare only the device nodes the service requires.

```bash
docker buildx build --platform linux/arm64 -t example/edge:dev --load .
docker run --rm --device /dev/video0 example/edge:dev
```

Record the command output, kernel release, image release, board revision, and any attached peripheral identifiers. When a command writes media, changes boot configuration, or controls power, stop and consult the board-specific manual before proceeding.

![Production Friendly Containers for ArmSoM Edge Applications validation loop diagram](/assets/009-containers-on-armsom-edge-validation.svg)

## Validation checklist

- [ ] Confirm the exact ArmSoM board, revision, memory/storage SKU, and power method.
- [ ] Capture `uname -a`, image/build version, and the full serial boot log.
- [ ] Verify the expected hardware node or connector before tuning performance.
- [ ] Change one variable at a time and keep the before/after evidence.
- [ ] State workload, environment, software versions, and method with any result.

## Troubleshooting

**Symptom: the expected device or behavior is absent.** First compare the running image and device tree to the product documentation, then check power, cable direction, connector seating, and boot logs.

**Symptom: the command exists but gives an unexpected result.** The device flag is only an example. Validate cgroup, permissions, SELinux/AppArmor policy, libraries, and ABI compatibility on the intended ArmSoM image.

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
