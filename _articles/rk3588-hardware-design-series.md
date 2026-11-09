---
title: "RK3588 hardware design: 30 circuit, PCB and validation topics"
description: "Explore RK3588 circuits, PCB constraints and validation with AIM7, Sige7 and LM7."
excerpt: "Explore RK3588 circuits, PCB constraints and validation with AIM7, Sige7 and LM7."
translation_key: "rk3588-hardware-design-series"
slug: "rk3588-hardware-design-series"
lang: "en"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["AIM7", "Sige7", "LM7"]
tags: ["RK3588", "hardware design", "AIM7", "Sige7", "LM7"]
image: "/assets/rk3588-hardware-series/rk3588-en-p26.png"
---
# RK3588 hardware design: 30 circuit, PCB and validation topics

Based on the Chinese and English RK3588 Hardware Design Guide V1.3 (2023-02-13), for reviewing SoC boards and carriers. AIM7 and LM7 carriers must follow module interface definitions; Sige7 provides a starting point for software and peripheral validation. SoC capabilities are not a board connector list. Verify SDK/BSP, kernel, board revision and firmware. Values are source references, not ArmSoM hardware measurements.

## Reading path

AIM7 supports compute-module carrier development, LM7 targets LGA module integration, and Sige7 supports early software and peripheral evaluation. With modules, identify which supplies, DDR and boot circuits are already integrated before designing the carrier. Do not duplicate SoC reference circuits unnecessarily. Follow product documentation for connectors, exposed interfaces, voltages and system support.

1. [RK3588 edge AI hardware: from workload to validation](/articles/rk3588-edge-ai-hardware-design/)
2. [RK3588 clocks: 24MHz, 32kHz and layout](/articles/rk3588-clock-hardware-design/)
3. [RK3588 reset, watchdog and thermal protection](/articles/rk3588-reset-watchdog-hardware/)
4. [RK3588 boot and recovery: Maskrom, JTAG and UART](/articles/rk3588-boot-debug-hardware/)
5. [RK3588 rails: startup requirements and unused PHYs](/articles/rk3588-power-rail-planning/)
6. [RK3588 power sequencing: RESETn and S0/S3](/articles/rk3588-power-sequencing-design/)
7. [RK3588 and RK806: single and dual PMIC power trees](/articles/rk3588-rk806-pmic-design/)
8. [RK3588 DDR circuits: LPDDR4/4X/5 and capacity](/articles/rk3588-ddr-circuit-design/)
9. [RK3588 DDR routing: length and delay matching](/articles/rk3588-ddr-pcb-routing/)
10. [RK3588 eMMC: clock, pull-ups and strobe](/articles/rk3588-emmc-hardware-design/)
11. [RK3588 FSPI Flash: boot, supply and matching](/articles/rk3588-fspi-boot-hardware/)
12. [RK3588 SDMMC and SDIO Wi-Fi: voltage switching and protection](/articles/rk3588-sdmmc-sdio-wifi-design/)
13. [RK3588 USB and Type-C: controllers, PHYs and recovery](/articles/rk3588-usb-typec-hardware-design/)
14. [RK3588 SATA: three controllers and shared PHYs](/articles/rk3588-sata-hardware-design/)
15. [RK3588 PCIe: lanes, reference clocks and supplies](/articles/rk3588-pcie-hardware-design/)
16. [RK3588 cameras: CSI, D/C PHY and CIF planning](/articles/rk3588-camera-hardware-design/)
17. [RK3588 HDMI RX: capture input, CEC and DDC levels](/articles/rk3588-hdmi-rx-hardware-design/)
18. [RK3588 HDMI TX: FRL, TMDS and compatibility circuits](/articles/rk3588-hdmi-tx-hardware-design/)
19. [RK3588 MIPI displays: D-PHY, C-PHY and panel integration](/articles/rk3588-mipi-display-hardware/)
20. [RK3588 DP and eDP: shared PHYs, AUX and coupling](/articles/rk3588-dp-edp-hardware-design/)
21. [RK3588 audio hardware: I2S, PDM and microphone arrays](/articles/rk3588-audio-hardware-design/)
22. [RK3588 Ethernet hardware: GMAC, PHY and clock direction](/articles/rk3588-gmac-hardware-design/)
23. [RK3588 GPIO and SARADC: domains and button inputs](/articles/rk3588-gpio-saradc-hardware/)
24. [RK3588 UART, SPI, CAN, I2C and PWM allocation](/articles/rk3588-serial-control-hardware/)
25. [RK3588 stackup and fanout: HDI versus through-hole](/articles/rk3588-pcb-stackup-fanout/)
26. [RK3588 high-speed PCB: pads and vias above 8GT/s](/articles/rk3588-high-speed-pcb-review/)
27. [RK3588 power PCB and PDN: copper, returns and decoupling](/articles/rk3588-power-pcb-pdn-design/)
28. [RK3588 thermal design: reference resistance and system validation](/articles/rk3588-thermal-hardware-design/)
29. [RK3588 ESD and EMI: interface protection and return paths](/articles/rk3588-esd-emi-hardware-design/)
30. [RK3588 assembly and storage: reflow, MSL3 and bake records](/articles/rk3588-assembly-storage-design/)

## Using source figures

The reference pages below contain the relevant circuit or timing figures; click for full resolution. Designators and component values belong to the reference design, not an ArmSoM product schematic.

- [ArmSoM AIM7](https://www.armsom.org/aim7)

- [ArmSoM Sige7](https://www.armsom.org/sige7)

- [ArmSoM LM7](https://www.armsom.org/lm7)
