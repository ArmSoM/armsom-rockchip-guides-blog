---
title: "Temperatur und Leistung von Edge-Systemen mit RK3576 und RK3588 überwachen"
description: "Erfassen Sie das Verhalten eines ArmSoM-Edge-Systems in Abhängigkeit von Temperatur und Arbeitslast, statt es auf einen einzelnen Benchmarkwert zu reduzieren."
translation_key: "011-thermal-performance-observability"
slug: "thermal-performance-observability"
lang: de
date: 2026-10-12
author: "ArmSoM-Redaktion"
category: power
products: [Sige5, Sige7]
tags: [Thermisches Design, Linux-Telemetrie, RK3576 RK3588, ArmSoM]
keywords: "Thermisches Design, Linux-Telemetrie, RK3576 RK3588, ArmSoM"
canonical_url: ""
---

# Temperatur und Leistung von Edge-Systemen mit RK3576 und RK3588 überwachen

Erfassen Sie das Verhalten eines ArmSoM-Edge-Systems in Abhängigkeit von Temperatur und Arbeitslast, statt es auf einen einzelnen Benchmarkwert zu reduzieren.

![Temperatur und Leistung von Edge-Systemen mit RK3576 und RK3588 überwachen – Ablaufdiagramm](/assets/011-thermal-performance-observability-flow.svg)

## Welche Entscheidungen dieser Artikel unterstützt

Erfassen Sie Temperatur, Taktregelung, Arbeitslast, Umgebungsbedingungen und Kühlung, bevor Sie Softwareversionen vergleichen. Dieser Leitfaden beschreibt einen technischen Arbeitsablauf. Beachten Sie außerdem den Schaltplan, die Versionshinweise und die Sicherheitshinweise für das konkrete ArmSoM-Produkt und dessen Revision.

## Plattformkontext

Die ArmSoM-Produktseiten nennen Betriebsbereiche für bestimmte Boards. Messen Sie darüber hinaus das Gesamtsystem mit Gehäuse, Stromversorgung und vorgesehener Arbeitslast.

Dokumentieren Sie Board, BSP-/Image-Version, Peripherierevision, Stromversorgung und reproduzierbare Befehle gemeinsam in einem Projektprotokoll. So lassen sich Fehler im Feldeinsatz untersuchen, und eine funktionierende Laborkonfiguration bleibt nachvollziehbar.

## Reproduzierbarer Einstieg

Protokollieren Sie Sensordaten und Taktregelung gemeinsam mit den Zeitstempeln der Anwendung. Geben Sie zu jedem Ergebnis die Messmethode an.

```bash
watch -n 1 "cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null; cat /sys/devices/system/cpu/cpufreq/policy*/scaling_cur_freq 2>/dev/null"
```

Protokollieren Sie die Befehlsausgabe, die Kernel- und Image-Version, die Boardrevision sowie die Kennungen angeschlossener Peripherie. Bevor ein Befehl Datenträger beschreibt, die Bootkonfiguration verändert oder die Stromversorgung steuert, lesen Sie das Handbuch des jeweiligen Boards.

![Temperatur und Leistung von Edge-Systemen mit RK3576 und RK3588 überwachen – Diagramm des Prüfablaufs](/assets/011-thermal-performance-observability-validation.svg)

## Prüfliste

- [ ] Prüfen Sie das genaue ArmSoM-Board, seine Revision, die RAM-/Speichervariante und die Art der Stromversorgung.
- [ ] Erfassen Sie `uname -a`, die Image-/Build-Version und das vollständige serielle Bootprotokoll.
- [ ] Prüfen Sie vor der Leistungsoptimierung den erwarteten Hardwareknoten beziehungsweise Anschluss.
- [ ] Ändern Sie jeweils nur eine Variable und dokumentieren Sie den Zustand davor und danach.
- [ ] Geben Sie zu jedem Ergebnis die Arbeitslast, Umgebung, Softwareversionen und Messmethode an.

## Fehlersuche

**Symptom: Das erwartete Gerät oder Verhalten fehlt.** Vergleichen Sie zunächst das laufende Image und den Device Tree mit der Produktdokumentation. Prüfen Sie anschließend Stromversorgung, Kabelausrichtung, Steckverbindungen und Bootprotokolle.

**Symptom: Der Befehl ist vorhanden, liefert aber ein unerwartetes Ergebnis.** Die Reihenfolge der Thermalzonen und die Taktknoten können abweichen. Prüfen Sie vor einer Umrechnung die Temperatureinheiten der Plattform und identifizieren Sie den Sensor, bevor Sie Rohwerte verschiedener Images vergleichen.

**Symptom: Eine Konfiguration funktioniert zunächst, nach einem Neustart jedoch nicht mehr.** Prüfen Sie, ob die Änderung im Image, in der Bootkonfiguration, im Device Tree, in einer Dienstdefinition oder nur als vorübergehender Laufzeitbefehl vorgenommen wurde. Bewahren Sie das serielle Protokoll und eine minimale Reproduktion auf.

## Hinweise zur Veröffentlichung

Dieser Artikel enthält keine erfundenen Benchmarks, Kompatibilitätsaussagen oder Labormessungen. Ergänzen Sie Messergebnisse nur zusammen mit Angaben zum Prüfling, Softwarestand, zur Arbeitslast, zu Umgebungsbedingungen, Wiederholungen und Rohdaten.

## Quellen

- [ArmSoM-Entwicklerzentrum für Open-Source-Hardware](https://docs.armsom.org/)
- [Dokumentation zu ArmSoM Sige5 mit RK3576](https://docs.armsom.org/armsom-sige5)
- [Dokumentation zu ArmSoM Sige7 mit RK3588](https://docs.armsom.org/armsom-sige7)
- [Dokumentation zu ArmSoM AIM5 mit RK3576](https://docs.armsom.org/armsom-aim5)
- [Dokumentation zu ArmSoM AIM7 mit RK3588](https://docs.armsom.org/armsom-aim7)
- [DeviceTree-Dokumentation des Linux-Kernels](https://docs.kernel.org/devicetree/)
- [Rockchip RK3588: Kurzdatenblatt](https://www.rock-chips.com/uploads/pdf/2022.8.26/191/RK3588%20Brief%20Datasheet.pdf)


## Prüfung vor der Veröffentlichung

- [ ] Gleichen Sie jede Aussage zu Produkteigenschaften, Pins und Schnittstellen mit der aktuellen Boarddokumentation ab.
- [ ] Ersetzen Sie allgemeine Befehle bei Bedarf durch die für das jeweilige Image beziehungsweise Release geprüften Varianten.
- [ ] Prüfen Sie, ob Screenshots, Diagramme und Alternativtexte zum endgültigen Board und Arbeitsablauf passen.
- [ ] Ergänzen Sie im Front Matter eine kanonische URL und Angaben zu Autor beziehungsweise Redaktion.
- [ ] Lassen Sie Aussagen zu Sicherheit, Flashen, elektrischen Eigenschaften und Verfügbarkeit durch die technisch verantwortliche Person prüfen.
