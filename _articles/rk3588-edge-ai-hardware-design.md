---
title: "RK3588 edge-AI hardware: plan power, cooling and expansion together"
description: "Turn an AI prototype into a testable product using the RK3588 hardware guide as a review framework."
excerpt: "Turn an AI prototype into a testable product using the RK3588 hardware guide as a review framework."
translation_key: "rk3588-edge-ai-hardware-design"
slug: "rk3588-edge-ai-hardware-design"
lang: "en"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: production
products: ["AIM7", "Sige7", "LM7"]
tags: ["Rockchip", "ArmSoM", "hardware design"]
image: "/assets/hardware-design-series/rk3588-edge-ai-hardware-design-en.svg"
---

# RK3588 edge-AI hardware: plan power, cooling and expansion together

![Reading guide](/assets/hardware-design-series/rk3588-edge-ai-hardware-design-en.svg)

## Scope and sources

This is a task-focused engineering guide, not a page-by-page translation of the complete PDF. Source examples are not ArmSoM measurements. Check voltages, pins, SDK/BSP and kernel against the actual board revision.

**Rockchip:** `RK3588 Hardware Design Guide-CN-V1.3-20230213.pdf` · V1.3 · §2–5

## Define the application load first

An edge device runs more than a model. Capture, preprocessing, NPU inference, display, networking and storage compete for resources. Specify input count, resolution, latency, operating duration and ambient temperature before selecting hardware. The scenarios below are planning examples, not ArmSoM benchmarks.

The V1.3 guide covers schematics in chapter 2, thermal design in chapter 4 and ESD/EMI in chapter 5. EVB values and vendor thermal simulations are not measured results for AIM7, Sige7 or LM7.

## Translate workloads into tests

| Scenario | Main resources | Observe |
| --- | --- | --- |
| Visual inspection | Camera, memory, NPU, network | Dropped frames, end-to-end latency, supply transients |
| Multimedia terminal | Decode, display, audio, touch | Display combinations, temperature, long-term stability |
| Acquisition device | Network, storage, external IO | Sustained writes, power loss and recovery |

Budget the board, peripheral startup peaks and conversion losses; check cable and connector voltage drop. Processor typical power is not a complete-product supply rating. Do not mix numbers from different regulator topologies.

## Cooling belongs in mechanical design

Define the path from heat source to heatsink, enclosure and ambient. Check interface material, pressure, insulation and airflow. A closed enclosure differs from an open bench. Log ambient and chip temperature, frequency, inference latency and frame loss over time rather than presenting one peak result.

Throttling logs show whether protection is active. Falling performance requires checking heat transfer and power; disabling protection is not a sound route to a better benchmark.

## Choose an ArmSoM development path

Evaluate AIM7, Sige7 and LM7 against their documented mechanics and interfaces. Prove the model, video pipeline and peripherals before freezing the enclosure or carrier. A Jetson migration needs separate assessment of CUDA dependencies and model deployment; similar form factors do not establish software compatibility.

The handover should include interface configuration, BSP and model versions, cables and sustained-load records. Claims should apply only to the configuration actually tested.

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
- [RK3588 high-speed PCB review: stackup, impedance and routing](/articles/rk3588-high-speed-pcb-review/)
- [RK3506 industrial HMI hardware: choosing a CM1 or Forge1 development path](/articles/rk3506-industrial-hmi-hardware/)
- [RK3308 hardware variants: compatibility checks for P2 Pro audio projects](/articles/rk3308-hardware-variant-compatibility/)
- [RK3588S versus RK3588S2: what to check before a hardware revision](/articles/rk3588s-rk3588s2-hardware-differences/)
- [Rockchip prototype to production: process requirements and test records](/articles/rockchip-hardware-production-checklist/)
