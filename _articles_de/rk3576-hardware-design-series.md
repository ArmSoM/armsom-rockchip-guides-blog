---
title: "RK3576-Hardwaredesign: 30 Themen zu Schaltung, PCB und Prüfung"
description: "30 Themen verbinden Schaltungsentwurf, PCB-Prüfung und Inbetriebnahme."
excerpt: "30 Themen verbinden Schaltungsentwurf, PCB-Prüfung und Inbetriebnahme."
translation_key: "rk3576-hardware-design-series"
slug: "rk3576-hardware-design-series"
lang: "de"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["CM5", "Sige5"]
tags: ["RK3576", "hardware design", "CM5", "Sige5"]
image: "/assets/rk3576-hardware-series/rk3576-en-p77.png"
---
# RK3576-Hardwaredesign: 30 Themen zu Schaltung, PCB und Prüfung

30 Themen verbinden Schaltungsentwurf, PCB-Prüfung und Inbetriebnahme.

Grundlage sind die chinesische und englische Ausgabe des RK3576 Hardware Design Guide V1.1 (2024-05-28) für SoC-Platinen. CM5-Träger müssen der Moduldefinition folgen; Sige5 kann als Software-/Peripheriebasis dienen. Eine universelle SDK-/BSP- oder Kernelversion wird nicht vorgegeben; jede Platine prüfen. Werte stammen aus der Quelle, nicht aus ArmSoM-Messungen.

## Einstieg

Für die erste SoC-Platine der Reihenfolge folgen. Bei einem CM5-Träger Minimalsystem, Boot/Debug, Sequenz und USB priorisieren und anschließend Modulstecker und IO-Board-Unterlagen prüfen. DDR und interner PMIC erklären die Modulgrenzen; sie werden nicht auf dem Träger dupliziert.

1. [RK3576-Minimalsystem: vom Schaltplan zum reproduzierbaren Erststart](/de/articles/rk3576-hardware-bringup/)
2. [RK3576-Taktentwurf: 24MHz-Quarz, 32kHz-Standby und Peripherietakte](/de/articles/rk3576-clock-circuit-design/)
3. [RK3576-Reset: NPOR, RK806S-5, Watchdog und Übertemperaturschutz](/de/articles/rk3576-reset-watchdog-design/)
4. [RK3576-Boot und Debugging: Konfiguration, Maskrom, UART und JTAG](/de/articles/rk3576-boot-debug-design/)
5. [RK3576-Spannungsdomänen: CPU, GPU, NPU, LOGIC und Entkopplung](/de/articles/rk3576-power-domain-design/)
6. [RK3576 und RK806S-5: PMIC-Auswahl, Steuerpins und Rückkopplung](/de/articles/rk3576-rk806s5-pmic-design/)
7. [RK3576-Power-Sequencing und Standby: Reset, Haltespannungen und Aufwecken](/de/articles/rk3576-power-sequencing-standby/)
8. [RK3576-DDR-Schaltung und Versorgung: LPDDR4, LPDDR4X und LPDDR5](/de/articles/rk3576-ddr-circuit-power/)
9. [RK3576-DDR-Layout: Impedanz, Längen, Rückstrompfade und PDN](/de/articles/rk3576-ddr-pcb-routing/)
10. [RK3576-USB/Type-C-Ergänzung: Multiplexing, Wiederherstellung und Schutz](/de/articles/168-rockchip-rk3576-usb/)

## Parameter und Abbildungen verwenden

Die Referenzseiten enthalten die zugehörigen Schalt- oder Zeitdiagramme; für volle Auflösung anklicken. Bezeichner und Werte gehören zum Referenzentwurf, nicht zum Schaltplan eines ArmSoM-Produkts.

Jeder Artikel nennt Geltungsbereich, typische Werte und Quellenwidersprüche. Adressgrenzen sind keine Standardbestückung, Referenzspitzen keine gemessene Boardleistung und optionale Schnittstellen keine herausgeführten Buchsen. Beim Wechsel von Sige5-Erprobung zum CM5-Produkt SDK, Boardrevision und Prüfnachweise dokumentieren.

[ArmSoM CM5](https://www.armsom.org/cm5) · [ArmSoM Sige5](https://www.armsom.org/sige5)

## Vertiefung: Speicher, Schnittstellen und Zuverlässigkeit

11. [RK3576-eMMC-Hardware: Versorgung, Pull-ups und HS400-Routing](/de/articles/rk3576-emmc-hardware-design/)
12. [RK3576-UFS-Hardware: Speicherkompatibilität, Sequenz und Differenzleitungen](/de/articles/rk3576-ufs-hardware-design/)
13. [RK3576-FSPI-Boot: NOR/NAND, Spannung und Chip-Select-Zustand](/de/articles/rk3576-fspi-boot-hardware/)
14. [RK3576-SD-Karten und SDIO-WLAN: Pegelwechsel, Versorgung und HF-Layout](/de/articles/rk3576-sdio-wifi-hardware/)
15. [RK3576-PCIe: Root Complex, gemeinsam genutzte PHYs und Endgeräteversorgung](/de/articles/rk3576-pcie-hardware-design/)
16. [RK3576-SATA-Hardware: PHY-Aufteilung, Kopplung und Laufwerksversorgung](/de/articles/rk3576-sata-hardware-design/)
17. [RK3576-Kamerahardware: CSI-Gruppen, DCPHY-Modi und Versorgung](/de/articles/rk3576-camera-hardware-design/)
18. [RK3576-Displayhardware: MIPI, RGB, Hintergrundbeleuchtung und Touch](/de/articles/rk3576-display-panel-hardware/)
19. [RK3576-HDMI-Hardware: FRL/TMDS, DDC-Pegel und Schutz](/de/articles/rk3576-hdmi-hardware-design/)
20. [RK3576-DP/eDP: PHY-Zuordnung, AUX und abweichende Koppelwerte](/de/articles/rk3576-dp-edp-hardware-design/)
21. [RK3576-Audiohardware: SAI, PDM, ASRC und Mikrofonlayout](/de/articles/rk3576-audio-hardware-design/)
22. [RK3576-Ethernet-Hardware: RGMII-Verzögerung, PHY-Takt und Schutz](/de/articles/rk3576-gmac-hardware-design/)
23. [RK3576-GPIO und SARADC: Spannungsdomänen, Rückspeisung und Tasten](/de/articles/rk3576-gpio-saradc-hardware/)
24. [RK3576-Steuerschnittstellen: UART, I2C/I3C, SPI, CAN und PWM](/de/articles/rk3576-industrial-control-interfaces/)
25. [RK3576-FlexBus und DSMC: FPGA, PSRAM und Parallelrouting](/de/articles/rk3576-flexbus-dsmc-hardware/)
26. [RK3576-PCB-Lagen und Fanout: sechs/acht Lagen und gemischtes BGA-Raster](/de/articles/rk3576-pcb-stackup-fanout/)
27. [RK3576-Hochgeschwindigkeitsschnittstellen: Impedanz, Rückwege und Stubs](/de/articles/rk3576-high-speed-interface-design/)
28. [RK3576-Versorgungs-PCB und PDN: RK806S-5, Feedback und Stromschleifen](/de/articles/rk3576-power-pcb-pdn-design/)
29. [RK3576-Thermik: Wärmewiderstand, PCB-Wärmeleitung und Dauerlast](/de/articles/rk3576-thermal-hardware-design/)
30. [RK3576-ESD und EMI: Ableitwege, Reset-Störfestigkeit und Fertigungsprüfung](/de/articles/rk3576-esd-emi-reliability-design/)
