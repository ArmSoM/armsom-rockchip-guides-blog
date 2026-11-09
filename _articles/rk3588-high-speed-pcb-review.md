---
title: "RK3588 high-speed PCB review: stackup, impedance and routing"
description: "Use chapter 3 of the V1.3 guide to structure a review of the complete channel and its reference planes."
excerpt: "Use chapter 3 of the V1.3 guide to structure a review of the complete channel and its reference planes."
translation_key: "rk3588-high-speed-pcb-review"
slug: "rk3588-high-speed-pcb-review"
lang: "en"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: production
products: ["AIM7", "Sige7", "LM7"]
tags: ["Rockchip", "ArmSoM", "hardware design"]
image: "/assets/hardware-design-series/rk3588-high-speed-pcb-review-en.svg"
---

# RK3588 high-speed PCB review: stackup, impedance and routing

![Reading guide](/assets/hardware-design-series/rk3588-high-speed-pcb-review-en.svg)

## Scope and sources

This is a task-focused engineering guide, not a page-by-page translation of the complete PDF. Source examples are not ArmSoM measurements. Check voltages, pins, SDK/BSP and kernel against the actual board revision.

**Rockchip:** `RK3588 Hardware Design Guide-CN-V1.3-20230213.pdf` · V1.3 · §2–5

## Fix the manufacturing assumptions

A stackup is more than a layer count. Dielectric thickness, material, copper and tolerances determine impedance and loss. Agree interface targets, reference layers and trace geometry with the fabricator, then record them as constraints. Copying a reference board's trace width does not reproduce its impedance.

The source covers stackup and escape in §3.1, general routing in §3.2, signals at 8GT/s and above in §3.3, and interface-specific rules in §3.4. Numerical limits still require the relevant section.

## Three frequently missed channel transitions

1. **BGA and connector pads:** local capacitance changes impedance; reference-plane treatment needs the actual footprint and stackup.
2. **Vias and layer changes:** examine stubs and return-current transitions rather than the signal via alone.
3. **Coupling and protection parts:** electrical function and pad discontinuity both matter. Adding ESD protection does not automatically preserve high-speed margin.

The guide also addresses glass-weave effects. Their dependence on material and geometry cannot be solved merely by adding length compensation at the far end.

## Review deliverables

| Check | Evidence |
| --- | --- |
| Reference continuity | Inspection along critical routes |
| Impedance and length | Fabricator-confirmed values, mode-specific limits and margin |
| Vias and connectors | Count, position, parts and models |
| Power and return paths | Decoupling loops, ground and shield connections |
| Testability | Access methods that do not materially disturb the channel |

Avoid unevaluated long test-point branches. Do not create unnecessary coupling and meanders simply to achieve equal length.

## Move from rules to measurements

DRC only checks encoded rules; it cannot demonstrate channel margin. Plan signal-integrity checks, enumeration or training, target-rate operation and sustained transfers using actual cables and enclosure. If low speed works but high speed fails, investigate the channel, supply and software separately.

A carrier is only part of an ArmSoM module's channel. Likewise, successful application tests on Sige7 do not certify another PCB.

## Source illustration

[![Source illustration — rk3588](/assets/hardware-design-series/rk3588-en.png)](/assets/hardware-design-series/rk3588-en.png)

Original from the English document, shared by EN/RU/DE. Reference design, not an ArmSoM board schematic.

`RK3588 hardware design guide-EN-V1.3-20230213.pdf` · PDF p. 25.

## Products and development resources

- **AIM7** — [Product page](https://www.armsom.org/aim7) · [Documentation](https://docs.armsom.org/armsom-aim7)
- **Sige7** — [Product page](https://www.armsom.org/sige7) · [Documentation](https://docs.armsom.org/armsom-sige7)
- **LM7** — [Product page](https://www.armsom.org/lm7) · [Documentation](https://docs.armsom.org/armsom-lm7)

## Continue this series

- [RK3576 hardware bring-up: minimum system and first-power checks](/articles/rk3576-hardware-bringup/)
- [ArmSoM CM5 carrier-board checklist: power, boot and interface planning](/articles/019-cm5-carrier-production/)
- [RK3576 high-speed interfaces: review schematics and PCB together](/articles/rk3576-high-speed-interface-design/)
- [RK3588S hardware design: from a reference circuit to a CM7s carrier](/articles/rk3588s-cm7s-carrier-design/)
- [RK3588 edge-AI hardware: plan power, cooling and expansion together](/articles/rk3588-edge-ai-hardware-design/)
- [RK3506 industrial HMI hardware: choosing a CM1 or Forge1 development path](/articles/rk3506-industrial-hmi-hardware/)
- [RK3308 hardware variants: compatibility checks for P2 Pro audio projects](/articles/rk3308-hardware-variant-compatibility/)
- [RK3588S versus RK3588S2: what to check before a hardware revision](/articles/rk3588s-rk3588s2-hardware-differences/)
- [Rockchip prototype to production: process requirements and test records](/articles/rockchip-hardware-production-checklist/)
