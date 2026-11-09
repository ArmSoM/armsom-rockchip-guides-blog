---
title: "RK3576-Hochgeschwindigkeitsschnittstellen: Schaltplan und PCB gemeinsam prüfen"
description: "Ressourcenbelegung, Versorgung und vollständigen Signalweg prüfen, statt nur eine Leiterbahnlänge vorzugeben."
excerpt: "Ressourcenbelegung, Versorgung und vollständigen Signalweg prüfen, statt nur eine Leiterbahnlänge vorzugeben."
translation_key: "rk3576-high-speed-interface-design"
slug: "rk3576-high-speed-interface-design"
lang: "de"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: production
products: ["CM5", "Sige5"]
tags: ["Rockchip", "ArmSoM", "hardware design"]
image: "/assets/hardware-design-series/rk3576-high-speed-interface-design-de.svg"
---

# RK3576-Hochgeschwindigkeitsschnittstellen: Schaltplan und PCB gemeinsam prüfen

![Leseweg](/assets/hardware-design-series/rk3576-high-speed-interface-design-de.svg)

## Geltungsbereich und Quellen

Dies ist ein thematischer Engineering-Leitfaden, keine seitenweise Übersetzung des gesamten PDF. Quellenbeispiele sind keine ArmSoM-Messungen. Spannungen, Pins, SDK/BSP und Kernel mit der tatsächlichen Platinenrevision abgleichen.

**Rockchip:** `RK3576_Hardware_Design_Guide_V1.1_20240528_CN.pdf` · V1.1 · §2.1, §2–3

## Den tatsächlichen Endpunkt festlegen

Die Quelle behandelt Schnittstellenschaltungen in §2.3, Signale ab 8GT/s in §3.4 und modulspezifische PCB-Regeln in §3.5. Ausgangspunkt sind Peripherie, Betriebsart, Stecker und Kabel. Nicht jede im Chipdiagramm gezeigte Ressource ist am Modul herausgeführt oder gleichzeitig nutzbar.

Für Kamera, Display, Speicher und Netzwerk PHY-Mehrfachnutzung, Steuerbusse, Versorgung und Softwareabhängigkeiten erfassen. Die Zuteilung mit der CM5-Pinbelegung beziehungsweise der konkreten Sige5-Revision abgleichen.

## Schaltung und Layout gemeinsam prüfen

| Bereich | Schaltplan | PCB |
| --- | --- | --- |
| Differenzieller Kanal | Richtung, Kopplung, Schutz | Impedanz, Referenzebenen, Vias, Padübergänge |
| Steuerung | Reset, Enable, Busse, Pegel | Abstand und erreichbare Messpunkte |
| Stecker | Artikelnummer, Pins, Schirm | Footprint, Rückstromweg, Orientierung |
| Versorgung | Spitzenstrom, Sequenzierung | Entkopplung, Stromschleifen, Wärmepfad |

Der Leitfaden behandelt BGA-Pads, Glasgewebe, differenzielle Vias, Koppelkondensatoren, ESD-Bauteile und Steckerpads. Lokale Aussparungen der Referenzfläche dienen bestimmten parasitären Effekten; sie erlauben keine beliebigen Unterbrechungen der Masse unter schnellen Signalen.

## Den ganzen Kanal budgetieren

Modulleiterbahnen, Stecker, Trägerplatine, Kabel und Peripherieplatine einbeziehen. Längenabgleich ist nur eine Vorgabe: Via-Stubs, Referenzwechsel und Schutzkapazitäten beeinflussen ebenfalls die Reserve. Zahlenwerte müssen zur Betriebsart und zum berechneten Lagenaufbau des Herstellers passen.

## Validierung abschließen

Jede Schnittstelle zunächst mit der Zielrate testen, anschließend Nachbarkanäle und reale Parallelbelastung zuschalten. Bei kombinierten Fehlern auch Versorgungstransienten, Wärme, Bandbreite und Treiber untersuchen. Kabel, Geräte, BSP und Revisionen dokumentieren. Eine reduzierte Rate hilft bei der Fehlersuche, erfüllt aber nicht die ursprüngliche Anforderung. Beim Übergang vom CM5- oder Sige5-Prototyp zum eigenen Produkt den tatsächlichen Kanal erneut prüfen.

## Abbildung aus der Quelle

[![Abbildung aus der Quelle — rk3576](/assets/hardware-design-series/rk3576-en.png)](/assets/hardware-design-series/rk3576-en.png)

Original aus dem englischen Dokument, gemeinsam für EN/RU/DE. Referenzdesign, kein ArmSoM-Platinenschaltplan.

`RK3576_Hardware_Design_Guide_V1.1_20240528_EN.pdf` · PDF p. 22.

## Produkte und Entwicklungsunterlagen

- **CM5** — [Produktseite](https://www.armsom.org/cm5) · [Dokumentation](https://docs.armsom.org/armsom-cm5)
- **Sige5** — [Produktseite](https://www.armsom.org/sige5) · [Dokumentation](https://docs.armsom.org/armsom-sige5)

## Weitere Beiträge der Reihe

- [RK3576 in Betrieb nehmen: Minimalsystem und erste Einschaltprüfung](/de/articles/rk3576-hardware-bringup/)
- [ArmSoM CM5-Trägerplatine: Checkliste für Versorgung, Boot und Schnittstellen](/de/articles/019-cm5-carrier-production/)
- [RK3588S-Hardwaredesign: vom Referenzschaltplan zur CM7s-Trägerplatine](/de/articles/rk3588s-cm7s-carrier-design/)
- [RK3588 für Edge-KI: Versorgung, Kühlung und Erweiterung gemeinsam planen](/de/articles/rk3588-edge-ai-hardware-design/)
- [RK3588-PCB-Prüfung: Lagenaufbau, Impedanz und Leiterführung](/de/articles/rk3588-high-speed-pcb-review/)
- [RK3506-HMI-Hardware: Entwicklung mit CM1 oder Forge1](/de/articles/rk3506-industrial-hmi-hardware/)
- [RK3308-Varianten: Hardwarekompatibilität für P2-Pro-Audioprojekte](/de/articles/rk3308-hardware-variant-compatibility/)
- [RK3588S und RK3588S2: Prüfungen vor einer Hardwareänderung](/de/articles/rk3588s-rk3588s2-hardware-differences/)
- [Vom Rockchip-Prototyp zur Serie: Prozessvorgaben und Prüfunterlagen](/de/articles/rockchip-hardware-production-checklist/)
