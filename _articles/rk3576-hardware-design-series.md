---
title: "RK3576 hardware design series: from minimum system to DDR and USB"
description: "A ten-topic path connecting schematic design, PCB review and power-up validation."
excerpt: "A ten-topic path connecting schematic design, PCB review and power-up validation."
translation_key: "rk3576-hardware-design-series"
slug: "rk3576-hardware-design-series"
lang: "en"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["CM5", "Sige5"]
tags: ["RK3576", "hardware design", "CM5", "Sige5"]
image: "/assets/rk3576-hardware-series/rk3576-en-p77.png"
---
# RK3576 hardware design series: from minimum system to DDR and USB

A ten-topic path connecting schematic design, PCB review and power-up validation.

Based on the Chinese and English RK3576 Hardware Design Guide V1.1 (2024-05-28), for SoC-board design. CM5 carriers must follow the module interface; Sige5 can establish a software/peripheral baseline. This guide does not prescribe one SDK/BSP or kernel for every product; verify each board. Values are source references, not ArmSoM measurements.

## Where to start

For a first SoC board, follow the order below. For a CM5 carrier, prioritize minimum system, boot/debug, sequencing and USB, then return to module connectors and IO-board documentation. DDR and internal PMIC design explain module boundaries and should not be duplicated on the carrier.

1. [RK3576 minimum system: from schematic review to repeatable first boot](/articles/rk3576-hardware-bringup/)
2. [RK3576 clock design: 24MHz crystal, 32kHz standby and peripheral clocks](/articles/rk3576-clock-circuit-design/)
3. [RK3576 reset design: NPOR, RK806S-5, watchdog and thermal shutdown](/articles/rk3576-reset-watchdog-design/)
4. [RK3576 boot and debug design: straps, Maskrom, UART and JTAG](/articles/rk3576-boot-debug-design/)
5. [RK3576 rails and decoupling: CPU, GPU, NPU and LOGIC supply planning](/articles/rk3576-power-domain-design/)
6. [RK3576 and RK806S-5: PMIC selection, control pins and feedback](/articles/rk3576-rk806s5-pmic-design/)
7. [RK3576 power sequencing and standby: reset, retained rails and wake paths](/articles/rk3576-power-sequencing-standby/)
8. [RK3576 DDR circuits and power: LPDDR4, LPDDR4X and LPDDR5](/articles/rk3576-ddr-circuit-power/)
9. [RK3576 DDR PCB routing: impedance, length, return paths and PDN](/articles/rk3576-ddr-pcb-routing/)
10. [RK3576 USB and Type-C hardware supplement: multiplexing, recovery and protection](/articles/168-rockchip-rk3576-usb/)

## Using parameters and figures

The reference pages below contain the relevant circuit or timing figures; click for full resolution. Designators and component values belong to the reference design, not an ArmSoM product schematic.

Each article retains scope, typical-value qualifications and source discrepancies. Do not turn addressing limits into standard product capacity, reference peaks into measured board power or optional interfaces into exposed connectors. Record SDK, board revision and validation evidence when moving from Sige5 evaluation to a custom CM5 product.

[ArmSoM CM5](https://www.armsom.org/cm5) · [ArmSoM Sige5](https://www.armsom.org/sige5)
