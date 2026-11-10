---
title: "RK3528 / RK3528A hardware design: nine engineering topics"
description: "RK3528 / RK3528A hardware design: nine engineering topics. Read both V1.0 guides by engineering task, from boot, power and DDR to interfaces, PCB, thermal design and production."
excerpt: "RK3528 / RK3528A hardware design: nine engineering topics. Read both V1.0 guides by engineering task, from boot, power and DDR to interfaces, PCB, thermal design and production."
translation_key: "rk3528-rk3528a-hardware-design-series"
slug: "rk3528-rk3528a-hardware-design-series"
lang: "en"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige1"]
tags: ["RK3528", "RK3528A", "hardware design"]
image: "/assets/rk3528-hardware-series/rk3528-p18.png"
---

# RK3528 / RK3528A hardware design: nine engineering topics

This engineering topic is based on the Chinese RK3528 V1.0 (2023-05-25) and RK3528A V1.0 (2023-07-12) hardware guides; it is not a verbatim translation of both PDFs. The discussed chapters are closely aligned, which does not establish drop-in chip compatibility. The official [Sige1 board documentation](https://docs.armsom.org/armsom-sige1) identifies RK3528 in ArmSoM [Sige1](https://www.armsom.org/sige1), providing a product for evaluating related applications. This does not identify Sige1 as an RK3528A board or establish interchangeability of the chips. SoC reference circuits are not the Sige1 schematic. Confirm pins, package, BSP/SDK, kernel and board revision for the actual product. Values are source references, not ArmSoM hardware measurements.

Read both V1.0 guides by engineering task, from boot, power and DDR to interfaces, PCB, thermal design and production.

## Read by design stage

1. [RK3528 / RK3528A boot and debug: clocks, reset, Maskrom and UART](/articles/rk3528-rk3528a-boot-clock-debug/)
2. [RK3528 / RK3528A power design: discrete rails, sequencing and load checks](/articles/rk3528-rk3528a-power-sequencing/)
3. [RK3528 / RK3528A DDR: topology, rails, swapping rules and PCB](/articles/rk3528-rk3528a-ddr-circuit-routing/)
4. [RK3528 / RK3528A storage and wireless interfaces: eMMC, FSPI, SDMMC and SDIO](/articles/rk3528-rk3528a-storage-sdio-design/)
5. [RK3528 / RK3528A USB and PCIe: shared PHY and channel review](/articles/rk3528-rk3528a-usb-pcie-design/)
6. [RK3528 / RK3528A display and audio: HDMI, CVBS, TSI and analog layout](/articles/rk3528-rk3528a-display-audio-design/)
7. [RK3528 / RK3528A networking and control: RGMII, PHY, UART, I2C and PWM](/articles/rk3528-rk3528a-ethernet-control-interfaces/)
8. [RK3528 / RK3528A PCB review: stackup, fanout, return paths and protection](/articles/rk3528-rk3528a-pcb-stackup-signal-integrity/)
9. [RK3528 / RK3528A thermal design and production: cooling, reflow and moisture control](/articles/rk3528-rk3528a-thermal-assembly-storage/)

## How the two sources are used

RK3528 and RK3528A each have a separate 164-page V1.0 guide. This series combines closely aligned engineering topics into one reading path while retaining chip-specific source images. Similar chapters do not establish identical packages, pins or firmware; check the selected part’s PinOut, TRM and SDK.

## Development and documentation

Choose ArmSoM products from their own documentation; this series does not claim that ArmSoM offers an RK3528/RK3528A board. Interface and software experience from existing ArmSoM boards may inform your workflow, but does not make these voltage, pin or PCB rules interchangeable.

- [ArmSoM](https://www.armsom.org/)
- [ArmSoM Docs](https://docs.armsom.org/)
