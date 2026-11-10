---
title: "RK3568-Hardwaredesign: 10 Themen zu Schaltung, PCB und Fertigung"
description: "RK3568-Hardwaredesign: 10 Themen zu Schaltung, PCB und Fertigung — Schaltungen, Schnittstellenvorgaben, PCB und Prüfgrenzen anhand der Quellen."
translation_key: "rk3568-hardware-design-series"
slug: "rk3568-hardware-design-series"
lang: "de"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige3"]
tags: ["RK3568", "hardware design", "PCB"]
image: "/assets/rk3568-hardware-series/rk3568-cn-p20.png"
excerpt: "RK3568-Hardwaredesign: 10 Themen zu Schaltung, PCB und Fertigung — Schaltungen, Schnittstellenvorgaben, PCB und Prüfgrenzen anhand der Quellen."
---

# RK3568-Hardwaredesign: 10 Themen zu Schaltung, PCB und Fertigung

Die Reihe ordnet RK3568 Hardware Design Guide V1.1 (Chinesisch, 2021-06-08) und den separaten High Speed PCB Design Guide V1.0.0 (Englisch, 2021-04-12) nach Entwicklungsfragen. ArmSoM [Sige3](https://www.armsom.org/sige3) verwendet RK3568B2. Die [Boarddokumentation](https://docs.armsom.org/armsom-sige3) bietet einen Produktbezug zum Lernen und Bewerten dieser Entwurfsfragen. SoC-Referenzschaltungen beschreiben nicht alle tatsächlichen Schaltungen und herausgeführten Schnittstellen des Sige3. SDK/BSP, Kernel, Chiprevision, Firmware und Peripheriekombination prüfen. Werte sind Quellenreferenzen, keine ArmSoM-Messungen.

## Ein Entwicklungsthema auswählen

1. [RK3568-Minimalsystem: Takt, Reset, Boot und Debug](/de/articles/rk3568-boot-clock-reset-hardware/)
2. [RK3568-Versorgung und IO-Domänen: RK809-5 und Standby](/de/articles/rk3568-power-io-domain-hardware/)
3. [RK3568-DDR-Design: Bausteine, Topologie, ECC und Routing](/de/articles/rk3568-ddr-topology-routing/)
4. [RK3568-Bootspeicher: eMMC-, FSPI-, NAND- und SDMMC-Schaltungen](/de/articles/rk3568-storage-emmc-fspi-sdmmc-hardware/)
5. [RK3568-Erweiterungen: USB, SATA, PCIe-Multiplexing und Takt](/de/articles/rk3568-usb-sata-pcie-hardware/)
6. [RK3568-Ethernet: zwei GMACs, RGMII und QSGMII](/de/articles/rk3568-ethernet-rgmii-qsgmii-hardware/)
7. [RK3568-Display und Kamera: VOP, MIPI, HDMI und Versorgung](/de/articles/rk3568-display-camera-hardware/)
8. [RK3568-Audio und Steuerung: I2S, UART, SPI, CAN und I2C](/de/articles/rk3568-audio-control-interfaces-hardware/)
9. [RK3568-PCB-Design: Stackup, Fanout und Rückstrompfade](/de/articles/rk3568-pcb-stackup-return-path-design/)
10. [RK3568-Fertigungsprüfung: Wärme, ESD, Montage und Lagerung](/de/articles/rk3568-thermal-esd-assembly-hardware/)

## Umfang und Verwendung der Reihe

Vom Minimalsystem über Versorgung, Speicher, High-Speed-IO, Netzwerk, Multimedia und Steuerung zu PCB und Fertigung lesen. Die PDFs sind keine Sprachfassungen desselben Dokuments. Die Reihe ordnet Entwicklungsthemen, ersetzt aber nicht jede Pinzuordnung, Topologietabelle oder Bauteilliste der Originale. Vor Umsetzung Originale, aktuelle TRM, Errata und SDK prüfen.

Die Quellenseiten erhalten Schaltungsbeschriftung und Kontext; Text und Tabellen bleiben editierbar. Eine passende englische Ausgabe des chinesischen Haupthandbuchs liegt nicht vor, daher bleiben dessen Abbildungen in allen Sprachen chinesisch. Bilder des separaten englischen PCB-Handbuchs sind entsprechend markiert. Seitenzahlen beziehen sich auf physische PDF-Seiten.

- [ArmSoM Docs](https://docs.armsom.org/)
- [ArmSoM](https://www.armsom.org/)
