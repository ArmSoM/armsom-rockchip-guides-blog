---
title: "RK3576 hardware design: 30 circuit, PCB and validation topics"
description: "A 30-topic path connecting schematic design, PCB review and power-up validation."
excerpt: "A 30-topic path connecting schematic design, PCB review and power-up validation."
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
# RK3576 hardware design: 30 circuit, PCB and validation topics

A 30-topic path connecting schematic design, PCB review and power-up validation.

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

## Advanced topics: storage, interfaces and reliability

11. [RK3576 eMMC hardware: supplies, pull-ups and HS400 routing](/articles/rk3576-emmc-hardware-design/)
12. [RK3576 UFS hardware: device compatibility, sequencing and differential routing](/articles/rk3576-ufs-hardware-design/)
13. [RK3576 FSPI boot hardware: NOR/NAND, voltage and chip-select defaults](/articles/rk3576-fspi-boot-hardware/)
14. [RK3576 SD cards and SDIO Wi-Fi: voltage switching, power and RF layout](/articles/rk3576-sdio-wifi-hardware/)
15. [RK3576 PCIe design: root-complex mode, shared PHYs and endpoint power](/articles/rk3576-pcie-hardware-design/)
16. [RK3576 SATA hardware: PHY sharing, coupling and drive power](/articles/rk3576-sata-hardware-design/)
17. [RK3576 camera hardware: CSI grouping, DCPHY modes and power sequencing](/articles/rk3576-camera-hardware-design/)
18. [RK3576 display hardware: MIPI, RGB, backlight and touch power](/articles/rk3576-display-panel-hardware/)
19. [RK3576 HDMI hardware: FRL/TMDS, DDC levels and protection](/articles/rk3576-hdmi-hardware-design/)
20. [RK3576 DP/eDP design: PHY allocation, AUX and coupling discrepancies](/articles/rk3576-dp-edp-hardware-design/)
21. [RK3576 audio hardware: SAI, PDM, ASRC and microphone layout](/articles/rk3576-audio-hardware-design/)
22. [RK3576 Ethernet hardware: RGMII delay, PHY clocks and protection](/articles/rk3576-gmac-hardware-design/)
23. [RK3576 GPIO and SARADC: voltage domains, back-power and key sensing](/articles/rk3576-gpio-saradc-hardware/)
24. [RK3576 control interfaces: UART, I2C/I3C, SPI, CAN and PWM](/articles/rk3576-industrial-control-interfaces/)
25. [RK3576 FlexBus and DSMC: FPGA, PSRAM and parallel routing](/articles/rk3576-flexbus-dsmc-hardware/)
26. [RK3576 PCB stackup and fanout: six/eight layers and mixed-pitch BGA](/articles/rk3576-pcb-stackup-fanout/)
27. [RK3576 high-speed interfaces: impedance, return paths, stubs and channel review](/articles/rk3576-high-speed-interface-design/)
28. [RK3576 power PCB and PDN: RK806S-5, feedback and high-current loops](/articles/rk3576-power-pcb-pdn-design/)
29. [RK3576 thermal design: thermal resistance, PCB conduction and sustained loads](/articles/rk3576-thermal-hardware-design/)
30. [RK3576 ESD and EMI: connector discharge, reset immunity and production review](/articles/rk3576-esd-emi-reliability-design/)
