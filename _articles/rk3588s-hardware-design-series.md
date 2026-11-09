---
title: "RK3588S hardware design: 30 circuit, PCB and validation topics"
description: "Explore RK3588S circuits, PCB constraints and validation with CM7S and Sige7S."
excerpt: "Explore RK3588S circuits, PCB constraints and validation with CM7S and Sige7S."
translation_key: "rk3588s-hardware-design-series"
slug: "rk3588s-hardware-design-series"
lang: "en"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["CM7s", "Sige7s"]
tags: ["RK3588S", "hardware design", "CM7s", "Sige7s"]
image: "/assets/rk3588s-hardware-series/rk3588s-cn-p17.png"
---
# RK3588S hardware design: 30 circuit, PCB and validation topics

Based on the Chinese RK3588S Hardware Design Guide V1.2 (2023-12-14) for circuit and PCB review. CM7S carriers must follow module interface definitions; Sige7S supports software and peripheral evaluation. SoC capabilities are not a board connector list. Verify SDK/BSP, kernel, board revision, firmware and multiplexing. Values are source references, not ArmSoM hardware measurements.

## Reading path

CM7S supports custom carriers: first identify supplies, DDR and boot circuits already integrated in the module, then design outside its connectors. Sige7S provides a starting point for software and peripheral evaluation. For both products, verify exposed interfaces, pin assignments, levels, system images and cooling against the relevant revision. A chip reference schematic is not a product wiring diagram.

1. [RK3588S and CM7S carrier design: resources and validation](/articles/rk3588s-cm7s-carrier-design/)
2. [RK3588S clocks: 24MHz, 32kHz and layout](/articles/rk3588s-clock-hardware-design/)
3. [RK3588S reset, watchdog and thermal protection](/articles/rk3588s-reset-watchdog-hardware/)
4. [RK3588S boot and recovery: Maskrom, JTAG and UART](/articles/rk3588s-boot-debug-hardware/)
5. [RK3588S rails: startup requirements and unused PHYs](/articles/rk3588s-power-rail-planning/)
6. [RK3588S power sequencing: RESETn and S0/S3](/articles/rk3588s-power-sequencing-design/)
7. [RK3588S and RK806: single and dual PMIC power trees](/articles/rk3588s-rk806-pmic-design/)
8. [RK3588S DDR circuits: LPDDR4/4X/5 and capacity](/articles/rk3588s-ddr-circuit-design/)
9. [RK3588S DDR routing: length and delay matching](/articles/rk3588s-ddr-pcb-routing/)
10. [RK3588S eMMC: clock, pull-ups and strobe](/articles/rk3588s-emmc-hardware-design/)
11. [RK3588S FSPI Flash: boot, supply and matching](/articles/rk3588s-fspi-boot-hardware/)
12. [RK3588S SDMMC and SDIO Wi-Fi: voltage switching and protection](/articles/rk3588s-sdmmc-sdio-wifi-design/)
13. [RK3588S USB and Type-C: controllers, PHYs and recovery](/articles/rk3588s-usb-typec-hardware-design/)
14. [RK3588S SATA: three controllers and shared PHYs](/articles/rk3588s-sata-hardware-design/)
15. [RK3588S PCIe: lanes, reference clocks and supplies](/articles/rk3588s-pcie-hardware-design/)
16. [RK3588S cameras: CSI, D/C PHY and CIF planning](/articles/rk3588s-camera-hardware-design/)
17. [RK3588S versus RK3588S2: camera PHYs and compatibility](/articles/rk3588s-rk3588s2-hardware-differences/)
18. [RK3588S HDMI TX: FRL, TMDS and compatibility circuits](/articles/rk3588s-hdmi-tx-hardware-design/)
19. [RK3588S MIPI displays: D-PHY, C-PHY and panel integration](/articles/rk3588s-mipi-display-hardware/)
20. [RK3588S DP and eDP: shared PHYs, AUX and coupling](/articles/rk3588s-dp-edp-hardware-design/)
21. [RK3588S audio hardware: I2S, PDM and microphone arrays](/articles/rk3588s-audio-hardware-design/)
22. [RK3588S Ethernet hardware: GMAC, PHY and clock direction](/articles/rk3588s-gmac-hardware-design/)
23. [RK3588S GPIO and SARADC: domains and button inputs](/articles/rk3588s-gpio-saradc-hardware/)
24. [RK3588S UART, SPI, CAN, I2C and PWM allocation](/articles/rk3588s-serial-control-hardware/)
25. [RK3588S stackup and fanout: HDI versus through-hole](/articles/rk3588s-pcb-stackup-fanout/)
26. [RK3588S high-speed PCB: pads and vias above 8GT/s](/articles/rk3588s-high-speed-pcb-review/)
27. [RK3588S power PCB and PDN: copper, returns and decoupling](/articles/rk3588s-power-pcb-pdn-design/)
28. [RK3588S thermal design: reference resistance and system validation](/articles/rk3588s-thermal-hardware-design/)
29. [RK3588S ESD and EMI: interface protection and return paths](/articles/rk3588s-esd-emi-hardware-design/)
30. [RK3588S assembly and storage: reflow, MSL3 and bake records](/articles/rk3588s-assembly-storage-design/)

## Using source figures

No corresponding English design guide was found for this batch. All four editions use Chinese source screenshots with localized captions. Open an image for full resolution; the article text and parameter tables remain copyable. Page references are physical PDF pages.

- [ArmSoM CM7S](https://www.armsom.org/cm7s)

- [ArmSoM Sige7S](https://www.armsom.org/sige7s)
