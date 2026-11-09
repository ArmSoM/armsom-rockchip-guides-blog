---
title: "RK3588S-Hardwaredesign: 30 Themen zu Schaltung, PCB und Prüfung"
description: "RK3588S-Schaltungen, PCB-Vorgaben und Prüfung mit CM7S und Sige7S."
excerpt: "RK3588S-Schaltungen, PCB-Vorgaben und Prüfung mit CM7S und Sige7S."
translation_key: "rk3588s-hardware-design-series"
slug: "rk3588s-hardware-design-series"
lang: "de"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["CM7s", "Sige7s"]
tags: ["RK3588S", "hardware design", "CM7s", "Sige7s"]
image: "/assets/rk3588s-hardware-series/rk3588s-cn-p17.png"
---
# RK3588S-Hardwaredesign: 30 Themen zu Schaltung, PCB und Prüfung

Grundlage ist der chinesische RK3588S Hardware Design Guide V1.2 (2023-12-14) zur Schaltungs- und PCB-Prüfung. CM7S-Träger folgen den Modulschnittstellen; Sige7S dient der Software-/Peripherieerprobung. SoC-Funktionen sind keine Boardanschlussliste. SDK/BSP, Kernel, Revision, Firmware und Multiplexing prüfen. Werte sind Quellenreferenzen, keine ArmSoM-Messungen.

## Lernpfad

CM7S eignet sich für eigene Träger: zunächst integrierte Versorgung, DDR und Bootschaltungen bestimmen, dann außerhalb der Modulstecker planen. Sige7S dient als Ausgangspunkt für Software-/Peripherieerprobung. Bei beiden Produkten herausgeführte Interfaces, Pins, Pegel, Images und Kühlung revisionsbezogen prüfen. Ein Chipreferenzplan ist kein Produktanschlussplan.

1. [RK3588S und CM7S-Träger: Ressourcen und Validierung](/de/articles/rk3588s-cm7s-carrier-design/)
2. [RK3588S-Takte: 24MHz, 32kHz und Layout](/de/articles/rk3588s-clock-hardware-design/)
3. [RK3588S-Reset, Watchdog und Temperaturschutz](/de/articles/rk3588s-reset-watchdog-hardware/)
4. [RK3588S-Boot und Recovery: Maskrom, JTAG und UART](/de/articles/rk3588s-boot-debug-hardware/)
5. [RK3588S-Versorgung: Startanforderungen und ungenutzte PHYs](/de/articles/rk3588s-power-rail-planning/)
6. [RK3588S-Einschaltfolge: RESETn und S0/S3](/de/articles/rk3588s-power-sequencing-design/)
7. [RK3588S und RK806: Einzel- und Doppel-PMIC](/de/articles/rk3588s-rk806-pmic-design/)
8. [RK3588S-DDR-Schaltung: LPDDR4/4X/5 und Kapazität](/de/articles/rk3588s-ddr-circuit-design/)
9. [RK3588S-DDR-Routing: Längen- und Laufzeitabgleich](/de/articles/rk3588s-ddr-pcb-routing/)
10. [RK3588S-eMMC: Takt, Pull-ups und Strobe](/de/articles/rk3588s-emmc-hardware-design/)
11. [RK3588S-FSPI-Flash: Boot, Versorgung und Anpassung](/de/articles/rk3588s-fspi-boot-hardware/)
12. [RK3588S-SDMMC und SDIO-WLAN: Pegelwechsel und Schutz](/de/articles/rk3588s-sdmmc-sdio-wifi-design/)
13. [RK3588S-USB und Type-C: Controller, PHYs und Recovery](/de/articles/rk3588s-usb-typec-hardware-design/)
14. [RK3588S-SATA: drei Controller und gemeinsame PHYs](/de/articles/rk3588s-sata-hardware-design/)
15. [RK3588S-PCIe: Lanes, Referenztakte und Versorgung](/de/articles/rk3588s-pcie-hardware-design/)
16. [RK3588S-Kameras: CSI, D/C-PHY und CIF planen](/de/articles/rk3588s-camera-hardware-design/)
17. [RK3588S und RK3588S2: Kamera-PHYs und Kompatibilität](/de/articles/rk3588s-rk3588s2-hardware-differences/)
18. [RK3588S-HDMI-TX: FRL, TMDS und Kompatibilität](/de/articles/rk3588s-hdmi-tx-hardware-design/)
19. [RK3588S-MIPI-Displays: D-PHY, C-PHY und Panels](/de/articles/rk3588s-mipi-display-hardware/)
20. [RK3588S-DP und eDP: PHYs, AUX und Kopplung](/de/articles/rk3588s-dp-edp-hardware-design/)
21. [RK3588S-Audiohardware: I2S, PDM und Mikrofonarrays](/de/articles/rk3588s-audio-hardware-design/)
22. [RK3588S-Ethernet: GMAC, PHY und Taktrichtung](/de/articles/rk3588s-gmac-hardware-design/)
23. [RK3588S-GPIO und SARADC: Domänen und Tasten](/de/articles/rk3588s-gpio-saradc-hardware/)
24. [RK3588S-UART, SPI, CAN, I2C und PWM zuordnen](/de/articles/rk3588s-serial-control-hardware/)
25. [RK3588S-Lagenaufbau und Fanout: HDI oder PTH](/de/articles/rk3588s-pcb-stackup-fanout/)
26. [RK3588S-Hochgeschwindigkeits-PCB: Pads und Vias ab 8GT/s](/de/articles/rk3588s-high-speed-pcb-review/)
27. [RK3588S-Power-PCB und PDN: Kupfer, Rückwege und Abblockung](/de/articles/rk3588s-power-pcb-pdn-design/)
28. [RK3588S-Thermik: Referenzwärmewiderstand und Systemprüfung](/de/articles/rk3588s-thermal-hardware-design/)
29. [RK3588S-ESD und EMI: Schnittstellenschutz und Rückwege](/de/articles/rk3588s-esd-emi-hardware-design/)
30. [RK3588S-Montage und Lagerung: Reflow, MSL3 und Backprotokoll](/de/articles/rk3588s-assembly-storage-design/)

## Quellenabbildungen verwenden

Für diese Reihe liegt kein entsprechendes englisches Designhandbuch vor. Alle vier Fassungen nutzen chinesische Originalausschnitte mit lokalisierten Beschriftungen. Bilder lassen sich in voller Auflösung öffnen; Text und Parametertabellen bleiben kopierbar. Seitenangaben beziehen sich auf physische PDF-Seiten.

- [ArmSoM CM7S](https://www.armsom.org/cm7s)

- [ArmSoM Sige7S](https://www.armsom.org/sige7s)
