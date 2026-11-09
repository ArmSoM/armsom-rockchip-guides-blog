---
title: "RK3588S hardware design: from a reference circuit to a CM7s carrier"
description: "Use the RK3588S V1.2 hardware guide to separate module, carrier and complete-product responsibilities."
excerpt: "Use the RK3588S V1.2 hardware guide to separate module, carrier and complete-product responsibilities."
translation_key: "rk3588s-cm7s-carrier-design"
slug: "rk3588s-cm7s-carrier-design"
lang: "en"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: production
products: ["CM7s", "Sige7s"]
tags: ["Rockchip", "ArmSoM", "hardware design"]
image: "/assets/hardware-design-series/rk3588s-cm7s-carrier-design-en.svg"
---

# RK3588S hardware design: from a reference circuit to a CM7s carrier

![Reading guide](/assets/hardware-design-series/rk3588s-cm7s-carrier-design-en.svg)

## Scope and sources

This is a task-focused engineering guide, not a page-by-page translation of the complete PDF. Source examples are not ArmSoM measurements. Check voltages, pins, SDK/BSP and kernel against the actual board revision.

**Rockchip:** `RK3588S Hardware Design Guide-V1.2-20231214.pdf` · V1.2 · §1–5

## A module changes the boundary

CM7s integrates an RK3588S compute platform. Start a carrier with its actual pins, mechanics, connectors and power requirements, not a wholesale copy of an EVB schematic. Chip-level DDR escape and regulator circuits explain the system; carrier work focuses on peripheral supplies, connections, protection and enclosure cooling.

RK3588S and RK3588 do not expose identical interfaces. RK3588S2 pin definitions must not silently replace RK3588S definitions either. Lock the complete chip name, module revision and document version.

## Assign three levels of responsibility

| Level | Main work | Evidence |
| --- | --- | --- |
| Module | Integrated processor, memory, boot and power implementation | CM7s schematic and revision |
| Carrier | Routed signals, peripheral power, connectors and protection | Module pinout and carrier circuit |
| Product | Cables, cooling, enclosure, EMC and workload | Mechanical design and validation plan |

At the module boundary, still check voltage domains, reset and enable timing, unused pins and multiplexing. Integration does not remove those obligations.

## Validate camera and display combinations

Start with a particular panel or sensor. Besides video lanes, reserve control buses, clocks, reset and backlight or sensor power. Record resolution, frame rate, lane configuration, cable and connector, then match the driver and device tree. SoC interface counts do not establish carrier-level concurrency.

## Test cooling with the interfaces active

Concurrent AI, video, display and storage create a different load from an idle desktop. Define a heat path to the heatsink, enclosure or air, leaving mechanical and insulation clearance. Record ambient and system temperatures, throttling and application throughput. A short peak is not sustained performance.

Sige7s or a CM7s IO platform can establish an application baseline. Their connectors and mechanics differ, so results apply only to the tested configuration and must be rechecked on a custom carrier.

## Source illustration

[![Source illustration — rk3588s](/assets/hardware-design-series/rk3588s-cn.png)](/assets/hardware-design-series/rk3588s-cn.png)

Chinese original; no matching English figure was found in the supplied materials. Reference design, not an ArmSoM board schematic.

`RK3588S Hardware Design Guide-V1.2-20231214.pdf` · PDF p. 17.

## Products and development resources

- **CM7s** — [Product page](https://www.armsom.org/cm7s) · [Documentation](https://docs.armsom.org/armsom-cm7s)
- **Sige7s** — [Product page](https://www.armsom.org/sige7s) · [Documentation](https://docs.armsom.org/armsom-sige7s)

## Continue this series

- [RK3576 hardware bring-up: minimum system and first-power checks](/articles/rk3576-hardware-bringup/)
- [ArmSoM CM5 carrier-board checklist: power, boot and interface planning](/articles/019-cm5-carrier-production/)
- [RK3576 high-speed interfaces: review schematics and PCB together](/articles/rk3576-high-speed-interface-design/)
- [RK3588 edge-AI hardware: plan power, cooling and expansion together](/articles/rk3588-edge-ai-hardware-design/)
- [RK3588 high-speed PCB review: stackup, impedance and routing](/articles/rk3588-high-speed-pcb-review/)
- [RK3506 industrial HMI hardware: choosing a CM1 or Forge1 development path](/articles/rk3506-industrial-hmi-hardware/)
- [RK3308 hardware variants: compatibility checks for P2 Pro audio projects](/articles/rk3308-hardware-variant-compatibility/)
- [RK3588S versus RK3588S2: what to check before a hardware revision](/articles/rk3588s-rk3588s2-hardware-differences/)
- [Rockchip prototype to production: process requirements and test records](/articles/rockchip-hardware-production-checklist/)
