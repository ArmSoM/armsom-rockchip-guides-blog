---
title: "ArmSoM Forge1: develop industrial gateways, HMI and data acquisition"
description: "Industrial development starts by making displays, equipment communication and application software operate together reliably."
excerpt: "Industrial development starts by making displays, equipment communication and application software operate together reliably."
translation_key: "forge1-industrial-hmi-gateway"
slug: "forge1-industrial-hmi-gateway"
lang: "en"
date: "2026-11-02"
author: "ArmSoM"
category: "production"
products: ["CM1", "Forge1"]
tags: ["RK3506J", "RK3506B", "CM1", "Forge1", "Rockchip", "ArmSoM"]
image: "/assets/rk3506/forge1.jpg"
---

![Original illustration — ArmSoM Forge1](/assets/rk3506/forge1.jpg)

Industrial development starts by making displays, equipment communication and application software operate together reliably. ArmSoM Forge1 integrates RK3506J with common board interfaces for HMI, gateways and acquisition terminals. A later custom product can be evaluated around CM1.

## What the board provides

Forge1 specifications list 512MB DDR3L, 512MB NAND, dual Fast Ethernet, MIPI DSI, USB2.0 Host and RS485/CAN resources in a 92×62mm board. Power options are DC 12V/1A or Type-C 5V/2A; follow the board manual for connection details.

The software description lists Buildroot, Linux 6.1, RT-Thread 4.1, AMP, Preempt-RT/Xenomai and LVGL. This describes official resources, not proof that every downloadable image enables everything simultaneously. Confirm the image, kernel configuration and examples before testing.

## HMI that serves the equipment

Build status, settings, alarm history and maintenance pages. Drive them with real equipment data and measure touch response during communication load. Decouple acquisition from rendering, bound update size and avoid large image decoding or frequent writes disrupting interaction.

Display integration needs panel timing, drivers and touch support. A 2D engine does not automatically accelerate any UI library; verify the rendering backend and driver path.

## A gateway between field devices and networks

Use RS485 or CAN for equipment communication and two Ethernet interfaces for field and upstream networks. Modbus and MQTT are software options to evaluate, not claims that all protocols ship in the factory image.

Define polling cycles, timeouts, retries, buffer limits and deduplication. Check termination, grounding, isolation, surge protection and cables. Interface names do not replace complete-system EMC validation.

## Traceable acquisition

Timestamp states, counts and alarms, with bounded offline buffering and periodic upload. Specify behaviour when network time is unavailable, retain configuration versions and test unexpected power loss. Analogue, thermocouple or high-voltage inputs need suitable external acquisition and isolation circuits.

## Evaluate real-time behaviour

Linux, real-time patches and AMP offer different approaches. Support for a real-time architecture does not guarantee a worst-case response time. Exercise networking, display and storage concurrently, recording latency distribution and maximum values. Decide whether critical loops need an independent controller from system timing and failure requirements.

## Where Forge1 fits

Forge1 suits early board-interface and application validation; CM1 suits a later custom carrier. The board's documented −40 to 85°C range does not automatically apply to a complete product with a display. The official page contains both NAND specifications and eMMC boot wording: this series follows the NAND specification and leaves actual boot-media verification to the delivered revision.

The official interface illustration labels 92×60mm, while the specification table states 92×62mm. This discrepancy is retained: use the delivered revision’s mechanical drawing for enclosures and mounting, not dimensions taken from a promotional image.

## Related articles and official resources

- [RK3506J explained: industrial HMI and connected equipment](/articles/rk3506j-chip-guide/)
- [ArmSoM CM1: an RK3506J module for your industrial terminal](/articles/cm1-rk3506j-industrial-module/)
- [RK3506B Datasheet V1.0: download, architecture, pins and electrical design](/articles/rk3506b-datasheet-v10/)
- [Rockchip RK3506](https://www.rock-chips.com/a/cn/product/RK35xilie/2025/1208/2125.html)
- [ArmSoM CM1](https://docs.armsom.org/armsom-cm1)
- [ArmSoM Forge1](https://docs.armsom.org/armsom-forge1)
- [ArmSoM](https://www.armsom.org/)
