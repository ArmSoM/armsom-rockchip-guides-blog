---
title: "RK3588-Hardwaredesign: 30 Themen zu Schaltung, PCB und Prüfung"
description: "RK3588-Schaltungen, PCB-Vorgaben und Prüfung mit AIM7, Sige7 und LM7."
excerpt: "RK3588-Schaltungen, PCB-Vorgaben und Prüfung mit AIM7, Sige7 und LM7."
translation_key: "rk3588-hardware-design-series"
slug: "rk3588-hardware-design-series"
lang: "de"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["AIM7", "Sige7", "LM7"]
tags: ["RK3588", "hardware design", "AIM7", "Sige7", "LM7"]
image: "/assets/rk3588-hardware-series/rk3588-en-p26.png"
---
# RK3588-Hardwaredesign: 30 Themen zu Schaltung, PCB und Prüfung

Grundlage sind die chinesische und englische Ausgabe des RK3588 Hardware Design Guide V1.3 (2023-02-13) für SoC-Platinen und Träger. AIM7- und LM7-Träger müssen den Moduldefinitionen folgen; Sige7 dient zur Software- und Peripherieprüfung. SoC-Funktionen sind keine Boardanschlussliste. SDK/BSP, Kernel, Boardrevision und Firmware prüfen. Werte sind Quellenreferenzen, keine ArmSoM-Messungen.

## Lernpfad

AIM7 unterstützt Compute-Modul-Träger, LM7 die LGA-Modulintegration und Sige7 frühe Software-/Peripherieerprobung. Vor dem Trägerdesign klären, welche Versorgung, DDR- und Bootschaltungen bereits integriert sind. SoC-Referenzschaltungen nicht unnötig duplizieren. Anschlüsse, herausgeführte Schnittstellen, Pegel und Systemunterstützung anhand der Produktunterlagen prüfen.

1. [RK3588-Edge-AI-Hardware: von der Last zur Prüfung](/de/articles/rk3588-edge-ai-hardware-design/)
2. [RK3588-Takte: 24MHz, 32kHz und Layout](/de/articles/rk3588-clock-hardware-design/)
3. [RK3588-Reset, Watchdog und Temperaturschutz](/de/articles/rk3588-reset-watchdog-hardware/)
4. [RK3588-Boot und Recovery: Maskrom, JTAG und UART](/de/articles/rk3588-boot-debug-hardware/)
5. [RK3588-Versorgung: Startanforderungen und ungenutzte PHYs](/de/articles/rk3588-power-rail-planning/)
6. [RK3588-Einschaltfolge: RESETn und S0/S3](/de/articles/rk3588-power-sequencing-design/)
7. [RK3588 und RK806: Einzel- und Doppel-PMIC](/de/articles/rk3588-rk806-pmic-design/)
8. [RK3588-DDR-Schaltung: LPDDR4/4X/5 und Kapazität](/de/articles/rk3588-ddr-circuit-design/)
9. [RK3588-DDR-Routing: Längen- und Laufzeitabgleich](/de/articles/rk3588-ddr-pcb-routing/)
10. [RK3588-eMMC: Takt, Pull-ups und Strobe](/de/articles/rk3588-emmc-hardware-design/)
11. [RK3588-FSPI-Flash: Boot, Versorgung und Anpassung](/de/articles/rk3588-fspi-boot-hardware/)
12. [RK3588-SDMMC und SDIO-WLAN: Pegelwechsel und Schutz](/de/articles/rk3588-sdmmc-sdio-wifi-design/)
13. [RK3588-USB und Type-C: Controller, PHYs und Recovery](/de/articles/rk3588-usb-typec-hardware-design/)
14. [RK3588-SATA: drei Controller und gemeinsame PHYs](/de/articles/rk3588-sata-hardware-design/)
15. [RK3588-PCIe: Lanes, Referenztakte und Versorgung](/de/articles/rk3588-pcie-hardware-design/)
16. [RK3588-Kameras: CSI, D/C-PHY und CIF planen](/de/articles/rk3588-camera-hardware-design/)
17. [RK3588-HDMI-RX: Capture-Eingang, CEC und DDC](/de/articles/rk3588-hdmi-rx-hardware-design/)
18. [RK3588-HDMI-TX: FRL, TMDS und Kompatibilität](/de/articles/rk3588-hdmi-tx-hardware-design/)
19. [RK3588-MIPI-Displays: D-PHY, C-PHY und Panels](/de/articles/rk3588-mipi-display-hardware/)
20. [RK3588-DP und eDP: PHYs, AUX und Kopplung](/de/articles/rk3588-dp-edp-hardware-design/)
21. [RK3588-Audiohardware: I2S, PDM und Mikrofonarrays](/de/articles/rk3588-audio-hardware-design/)
22. [RK3588-Ethernet: GMAC, PHY und Taktrichtung](/de/articles/rk3588-gmac-hardware-design/)
23. [RK3588-GPIO und SARADC: Domänen und Tasten](/de/articles/rk3588-gpio-saradc-hardware/)
24. [RK3588-UART, SPI, CAN, I2C und PWM zuordnen](/de/articles/rk3588-serial-control-hardware/)
25. [RK3588-Lagenaufbau und Fanout: HDI oder PTH](/de/articles/rk3588-pcb-stackup-fanout/)
26. [RK3588-Hochgeschwindigkeits-PCB: Pads und Vias ab 8GT/s](/de/articles/rk3588-high-speed-pcb-review/)
27. [RK3588-Power-PCB und PDN: Kupfer, Rückwege und Abblockung](/de/articles/rk3588-power-pcb-pdn-design/)
28. [RK3588-Thermik: Referenzwärmewiderstand und Systemprüfung](/de/articles/rk3588-thermal-hardware-design/)
29. [RK3588-ESD und EMI: Schnittstellenschutz und Rückwege](/de/articles/rk3588-esd-emi-hardware-design/)
30. [RK3588-Montage und Lagerung: Reflow, MSL3 und Backprotokoll](/de/articles/rk3588-assembly-storage-design/)

## Quellenabbildungen verwenden

Die Referenzseiten enthalten die zugehörigen Schalt- oder Zeitdiagramme; für volle Auflösung anklicken. Bezeichner und Werte gehören zum Referenzentwurf, nicht zum Schaltplan eines ArmSoM-Produkts.

- [ArmSoM AIM7](https://www.armsom.org/aim7)

- [ArmSoM Sige7](https://www.armsom.org/sige7)

- [ArmSoM LM7](https://www.armsom.org/lm7)
