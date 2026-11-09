---
title: "RK3588-PCB-Prüfung: Lagenaufbau, Impedanz und Leiterführung"
description: "Kapitel 3 des Leitfadens V1.3 als Grundlage für die Prüfung des gesamten Kanals und seiner Referenzebenen nutzen."
excerpt: "Kapitel 3 des Leitfadens V1.3 als Grundlage für die Prüfung des gesamten Kanals und seiner Referenzebenen nutzen."
translation_key: "rk3588-high-speed-pcb-review"
slug: "rk3588-high-speed-pcb-review"
lang: "de"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: production
products: ["AIM7", "Sige7", "LM7"]
tags: ["Rockchip", "ArmSoM", "hardware design"]
image: "/assets/hardware-design-series/rk3588-high-speed-pcb-review-de.svg"
---

# RK3588-PCB-Prüfung: Lagenaufbau, Impedanz und Leiterführung

![Leseweg](/assets/hardware-design-series/rk3588-high-speed-pcb-review-de.svg)

## Geltungsbereich und Quellen

Dies ist ein thematischer Engineering-Leitfaden, keine seitenweise Übersetzung des gesamten PDF. Quellenbeispiele sind keine ArmSoM-Messungen. Spannungen, Pins, SDK/BSP und Kernel mit der tatsächlichen Platinenrevision abgleichen.

**Rockchip:** `RK3588 Hardware Design Guide-CN-V1.3-20230213.pdf` · V1.3 · §2–5

## Fertigungsannahmen festlegen

Der Lagenaufbau umfasst mehr als die Layerzahl. Dielektrikumsdicke, Material, Kupfer und Toleranzen bestimmen Impedanz und Verlust. Schnittstellenziele, Referenzlagen und Geometrie mit dem Fertiger abstimmen und als Regeln festhalten. Eine kopierte Leiterbahnbreite reproduziert nicht automatisch die Referenzimpedanz.

§3.1 behandelt Aufbau und Fanout, §3.2 allgemeines Routing, §3.3 Signale ab 8GT/s und §3.4 einzelne Schnittstellen. Zahlenwerte sind dem jeweiligen Abschnitt zu entnehmen.

## Drei häufig übersehene Übergänge

1. **BGA- und Steckerpads:** Lokale Kapazität verändert die Impedanz; die Referenzfläche muss zu Footprint und Aufbau passen.
2. **Vias und Lagenwechsel:** Stubs und Rückstromübergänge zusätzlich zum Signalvia prüfen.
3. **Kopplung und Schutz:** Funktion und Padübergang sind beide relevant. Ein ESD-Bauteil garantiert keine unveränderte Kanalreserve.

Auch Glasgewebeeffekte werden behandelt. Ihre Material- und Geometrieabhängigkeit lässt sich nicht allein durch einen Längenausgleich am Leitungsende beheben.

## Ergebnisse der Designprüfung

| Prüfung | Nachweis |
| --- | --- |
| Durchgehende Referenz | Prüfung entlang kritischer Leitungen |
| Impedanz und Länge | Fertigerwerte, modusspezifische Grenzen, Reserve |
| Vias und Stecker | Anzahl, Position, Bauteile und Modelle |
| Versorgung und Rückstrom | Entkopplung, Masse und Schirmanschlüsse |
| Prüfbarkeit | Messzugang ohne wesentliche Kanalstörung |

Unbewertete lange Messpunktabzweige vermeiden. Keine unnötigen Kopplungen und Mäander allein für gleiche Leitungslängen erzeugen.

## Von Regeln zu Messungen

DRC prüft hinterlegte Regeln, belegt aber keine Kanalreserve. Signalintegrität, Erkennung oder Training, Zielrate und Dauerübertragung mit tatsächlichen Kabeln und Gehäuse prüfen. Funktioniert nur eine niedrigere Rate, Kanal, Versorgung und Software getrennt untersuchen.

Ein Träger ist nur Teil des Kanals eines ArmSoM-Moduls. Ebenso zertifiziert ein erfolgreicher Anwendungstest auf Sige7 keine andere PCB.

## Abbildung aus der Quelle

[![Abbildung aus der Quelle — rk3588](/assets/hardware-design-series/rk3588-en.png)](/assets/hardware-design-series/rk3588-en.png)

Original aus dem englischen Dokument, gemeinsam für EN/RU/DE. Referenzdesign, kein ArmSoM-Platinenschaltplan.

`RK3588 hardware design guide-EN-V1.3-20230213.pdf` · PDF p. 25.

## Produkte und Entwicklungsunterlagen

- **AIM7** — [Produktseite](https://www.armsom.org/aim7) · [Dokumentation](https://docs.armsom.org/armsom-aim7)
- **Sige7** — [Produktseite](https://www.armsom.org/sige7) · [Dokumentation](https://docs.armsom.org/armsom-sige7)
- **LM7** — [Produktseite](https://www.armsom.org/lm7) · [Dokumentation](https://docs.armsom.org/armsom-lm7)

## Weitere Beiträge der Reihe

- [RK3576 in Betrieb nehmen: Minimalsystem und erste Einschaltprüfung](/de/articles/rk3576-hardware-bringup/)
- [ArmSoM CM5-Trägerplatine: Checkliste für Versorgung, Boot und Schnittstellen](/de/articles/019-cm5-carrier-production/)
- [RK3576-Hochgeschwindigkeitsschnittstellen: Schaltplan und PCB gemeinsam prüfen](/de/articles/rk3576-high-speed-interface-design/)
- [RK3588S-Hardwaredesign: vom Referenzschaltplan zur CM7s-Trägerplatine](/de/articles/rk3588s-cm7s-carrier-design/)
- [RK3588 für Edge-KI: Versorgung, Kühlung und Erweiterung gemeinsam planen](/de/articles/rk3588-edge-ai-hardware-design/)
- [RK3506-HMI-Hardware: Entwicklung mit CM1 oder Forge1](/de/articles/rk3506-industrial-hmi-hardware/)
- [RK3308-Varianten: Hardwarekompatibilität für P2-Pro-Audioprojekte](/de/articles/rk3308-hardware-variant-compatibility/)
- [RK3588S und RK3588S2: Prüfungen vor einer Hardwareänderung](/de/articles/rk3588s-rk3588s2-hardware-differences/)
- [Vom Rockchip-Prototyp zur Serie: Prozessvorgaben und Prüfunterlagen](/de/articles/rockchip-hardware-production-checklist/)
