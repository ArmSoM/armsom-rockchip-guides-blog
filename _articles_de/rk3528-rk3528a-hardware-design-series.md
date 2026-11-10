---
title: "RK3528 / RK3528A: neun Hardware-Entwicklungsthemen"
description: "RK3528 / RK3528A: neun Hardware-Entwicklungsthemen. Beide V1.0-Handbücher nach Aufgaben lesen: Boot, Versorgung, DDR, Schnittstellen, PCB, Thermik und Fertigung."
excerpt: "RK3528 / RK3528A: neun Hardware-Entwicklungsthemen. Beide V1.0-Handbücher nach Aufgaben lesen: Boot, Versorgung, DDR, Schnittstellen, PCB, Thermik und Fertigung."
translation_key: "rk3528-rk3528a-hardware-design-series"
slug: "rk3528-rk3528a-hardware-design-series"
lang: "de"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige1"]
tags: ["RK3528", "RK3528A", "hardware design"]
image: "/assets/rk3528-hardware-series/rk3528-p18.png"
---

# RK3528 / RK3528A: neun Hardware-Entwicklungsthemen

Dieses Entwicklungsthema basiert auf den chinesischen Hardwarehandbüchern RK3528 V1.0 (2023-05-25) und RK3528A V1.0 (2023-07-12), nicht auf einer vollständigen wörtlichen PDF-Übersetzung. Ähnliche Kapitel belegen keine direkte Austauschbarkeit der Chips. Die offizielle [Sige1-Dokumentation](https://docs.armsom.org/armsom-sige1) nennt RK3528 für ArmSoM [Sige1](https://www.armsom.org/sige1), das zur Bewertung entsprechender Anwendungen dienen kann. Daraus folgt weder, dass Sige1 RK3528A verwendet, noch dass beide Chips austauschbar sind. SoC-Referenzschaltungen sind nicht der Sige1-Schaltplan; Pins, Gehäuse, BSP/SDK, Kernel und Boardrevision am tatsächlichen Produkt prüfen. Werte stammen aus den Quellen, nicht aus ArmSoM-Hardwaremessungen.

Beide V1.0-Handbücher nach Aufgaben lesen: Boot, Versorgung, DDR, Schnittstellen, PCB, Thermik und Fertigung.

## Nach Entwicklungsphase lesen

1. [RK3528 / RK3528A: Takt, Reset, Maskrom und Debug-UART](/de/articles/rk3528-rk3528a-boot-clock-debug/)
2. [RK3528 / RK3528A: diskrete Versorgung, Sequenzierung und Lastprüfung](/de/articles/rk3528-rk3528a-power-sequencing/)
3. [RK3528 / RK3528A DDR: Topologie, Versorgung, Pin-Swaps und PCB](/de/articles/rk3528-rk3528a-ddr-circuit-routing/)
4. [RK3528 / RK3528A: eMMC, FSPI, SDMMC und SDIO](/de/articles/rk3528-rk3528a-storage-sdio-design/)
5. [RK3528 / RK3528A: gemeinsamer USB-/PCIe-PHY und Kanalprüfung](/de/articles/rk3528-rk3528a-usb-pcie-design/)
6. [RK3528 / RK3528A: HDMI, CVBS, TSI und analoges Audiolayout](/de/articles/rk3528-rk3528a-display-audio-design/)
7. [RK3528 / RK3528A: RGMII, PHY, UART, I2C und PWM](/de/articles/rk3528-rk3528a-ethernet-control-interfaces/)
8. [RK3528 / RK3528A PCB: Lagen, Fanout, Rückstrompfade und Schutz](/de/articles/rk3528-rk3528a-pcb-stackup-signal-integrity/)
9. [RK3528 / RK3528A: Kühlung, Reflow und Feuchtemanagement](/de/articles/rk3528-rk3528a-thermal-assembly-storage/)

## Verwendung beider Quellen

Für RK3528 und RK3528A existieren separate V1.0-Handbücher mit jeweils 164 Seiten. Die Serie verbindet ähnliche Entwicklungsthemen, erhält aber chipspezifische Bilder und Quellen. Ähnliche Kapitel belegen keine identischen Gehäuse, Pins oder Firmware; PinOut, TRM und SDK des ausgewählten Bauteils prüfen.

## Entwicklung und Dokumentation

ArmSoM-Produkte anhand ihrer eigenen Dokumentation wählen; die Serie behauptet kein ArmSoM-Board mit RK3528/RK3528A. Schnittstellen- und Softwareerfahrung anderer Boards hilft methodisch, macht Spannungen, Pins oder PCB-Regeln aber nicht austauschbar.

- [ArmSoM](https://www.armsom.org/)
- [ArmSoM Docs](https://docs.armsom.org/)
