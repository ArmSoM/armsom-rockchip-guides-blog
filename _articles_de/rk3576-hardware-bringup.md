---
title: "RK3576 in Betrieb nehmen: Minimalsystem und erste Einschaltprüfung"
description: "Ein nachvollziehbarer Ablauf für Versorgung, Takt, Reset, Bootmedium und Debugzugang, getrennt nach SoC-Platine und CM5-Trägerplatine."
excerpt: "Ein nachvollziehbarer Ablauf für Versorgung, Takt, Reset, Bootmedium und Debugzugang, getrennt nach SoC-Platine und CM5-Trägerplatine."
translation_key: "rk3576-hardware-bringup"
slug: "rk3576-hardware-bringup"
lang: "de"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: production
products: ["CM5", "Sige5"]
tags: ["Rockchip", "ArmSoM", "hardware design"]
image: "/assets/hardware-design-series/rk3576-hardware-bringup-de.svg"
---

# RK3576 in Betrieb nehmen: Minimalsystem und erste Einschaltprüfung

![Leseweg](/assets/hardware-design-series/rk3576-hardware-bringup-de.svg)

## Geltungsbereich und Quellen

Dies ist ein thematischer Engineering-Leitfaden, keine seitenweise Übersetzung des gesamten PDF. Quellenbeispiele sind keine ArmSoM-Messungen. Spannungen, Pins, SDK/BSP und Kernel mit der tatsächlichen Platinenrevision abgleichen.

**Rockchip:** `RK3576_Hardware_Design_Guide_V1.1_20240528_CN.pdf` · V1.1 · §2.1, §2–3

## Mit dem Minimalsystem beginnen

Abschnitt 2.1 des RK3576 Hardware Design Guide V1.1 behandelt Takt, Reset, Boot, JTAG, UART und Speicher. Zunächst sollte eine Konfiguration wiederholt starten, ein serielles Protokoll liefern und eine Wiederherstellung erlauben. Kameras, Displays und schnelle Peripherie kommen einzeln hinzu, damit sich Fehler einer Änderung zuordnen lassen.

Bei einer eigenen SoC-Platine gehören DDR, Taktgeber und Spannungsregler zum Minimalsystem. Beim CM5 sind dagegen Modulanschlüsse und Trägerplatinenunterlagen maßgeblich: Interne Versorgungsschienen des Chips sind keine Moduleingänge. Sige5 eignet sich als Anwendungsreferenz, bestätigt aber nicht das elektrische Design einer anderen Platine.

## Fünf Prüfungen für den ersten Start

| Bereich | Vor dem Einschalten | Aufzuzeichnende Ergebnisse |
| --- | --- | --- |
| Versorgung | BOM, Spannung, Polarität, Kurzschlüsse, Strombegrenzung | Eingangsstrom, Versorgungsschienen, Einschaltvorgänge |
| Takt | Quarz, Lastnetzwerk und Leiterführung | Frequenz und Signalform mit geeigneter Messtechnik |
| Reset | Spannungsdomäne, Pull-Widerstände, Resetquellen | Zeitbezug zwischen stabiler Versorgung und Resetfreigabe |
| Boot | Medium, Konfigurationswiderstände, Loader, Revision | Vollständiges Protokoll bis zum Kernel |
| Debug | UART, Wiederherstellungsweg, Messpunkte | Wiederholbare Kaltstarts und Wiederherstellung |

§2.1.1 beschreibt den Haupttakt mit einem externen 24MHz-Quarz. Daraus folgt keine Pflicht, diese Schaltung auf einer CM5-Trägerplatine zu wiederholen. Auch Reset- und UART-Pegel müssen zu den tatsächlichen Spannungsdomänen passen.

## Startfehler eingrenzen

Bei einem stillen UART zuerst Adapterpegel, Masse, TX/RX, Baudrate, Versorgung und Reset prüfen. Läuft der Loader, aber nicht der Kernel, sind DDR-Initialisierung, Speicher, Image und Device Tree zu prüfen. Nach dem Linux-Start werden Peripherieversorgung, Pinmultiplexing, Takte und Treiber getrennt untersucht.

Pro Versuch nur eine Variable ändern. Schaltplan- und Modulrevision, Image-Prüfsumme und Protokolle festhalten. Auf einen erfolgreichen Start folgen wiederholte Kaltstarts, Wiederherstellung nach Spannungsverlust und Lasttests; ein einzelner Start ist keine Serienfreigabe.

## Umsetzung mit ArmSoM

Beim CM5 zunächst auf der zugehörigen IO-Platine eine Softwarebasis herstellen und erst danach auf die eigene Trägerplatine wechseln. Beim Sige5 Gerätemodelle, Kabel und Versorgung dokumentieren. Der Ablauf ersetzt weder die konkrete Designprüfung noch liefert er eine universelle Spannungstabelle.

## Abbildung aus der Quelle

[![Abbildung aus der Quelle — rk3576](/assets/hardware-design-series/rk3576-en.png)](/assets/hardware-design-series/rk3576-en.png)

Original aus dem englischen Dokument, gemeinsam für EN/RU/DE. Referenzdesign, kein ArmSoM-Platinenschaltplan.

`RK3576_Hardware_Design_Guide_V1.1_20240528_EN.pdf` · PDF p. 22.

## Produkte und Entwicklungsunterlagen

- **CM5** — [Produktseite](https://www.armsom.org/cm5) · [Dokumentation](https://docs.armsom.org/armsom-cm5)
- **Sige5** — [Produktseite](https://www.armsom.org/sige5) · [Dokumentation](https://docs.armsom.org/armsom-sige5)

## Weitere Beiträge der Reihe

- [ArmSoM CM5-Trägerplatine: Checkliste für Versorgung, Boot und Schnittstellen](/de/articles/019-cm5-carrier-production/)
- [RK3576-Hochgeschwindigkeitsschnittstellen: Schaltplan und PCB gemeinsam prüfen](/de/articles/rk3576-high-speed-interface-design/)
- [RK3588S-Hardwaredesign: vom Referenzschaltplan zur CM7s-Trägerplatine](/de/articles/rk3588s-cm7s-carrier-design/)
- [RK3588 für Edge-KI: Versorgung, Kühlung und Erweiterung gemeinsam planen](/de/articles/rk3588-edge-ai-hardware-design/)
- [RK3588-PCB-Prüfung: Lagenaufbau, Impedanz und Leiterführung](/de/articles/rk3588-high-speed-pcb-review/)
- [RK3506-HMI-Hardware: Entwicklung mit CM1 oder Forge1](/de/articles/rk3506-industrial-hmi-hardware/)
- [RK3308-Varianten: Hardwarekompatibilität für P2-Pro-Audioprojekte](/de/articles/rk3308-hardware-variant-compatibility/)
- [RK3588S und RK3588S2: Prüfungen vor einer Hardwareänderung](/de/articles/rk3588s-rk3588s2-hardware-differences/)
- [Vom Rockchip-Prototyp zur Serie: Prozessvorgaben und Prüfunterlagen](/de/articles/rockchip-hardware-production-checklist/)
