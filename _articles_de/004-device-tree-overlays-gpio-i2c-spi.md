---
title: "Device-Tree-Overlays für GPIO, I2C und SPI auf RK3576 und RK3588"
description: "Setzen Sie Overlays und Pinsteuerung gezielt ein, wenn Sie ein ArmSoM-Design mit RK3576 oder RK3588 erweitern."
translation_key: "004-device-tree-overlays-gpio-i2c-spi"
slug: "device-tree-overlays-gpio-i2c-spi"
lang: de
date: 2026-10-12
author: "ArmSoM-Redaktion"
category: interfaces
products: [Sige5, Sige7]
tags: [Linux-Device-Tree, GPIO, I2C, SPI, ArmSoM-40-Pin-Anschluss]
keywords: "Linux-Device-Tree, GPIO, I2C, SPI, ArmSoM-40-Pin-Anschluss"
canonical_url: ""
---

# Device-Tree-Overlays für GPIO, I2C und SPI auf RK3576 und RK3588

Setzen Sie Overlays und Pinsteuerung gezielt ein, wenn Sie ein ArmSoM-Design mit RK3576 oder RK3588 erweitern.

![Device-Tree-Overlays für GPIO, I2C und SPI auf RK3576 und RK3588 – Ablaufdiagramm](/assets/004-device-tree-overlays-gpio-i2c-spi-flow.svg)

## Welche Entscheidungen dieser Artikel unterstützt

Änderungen am Device Tree beschreiben die vorgesehene Hardwarekonfiguration. Prüfen Sie alternative Funktionen und elektrische Grenzen eines GPIO-Steckerpins, bevor Sie ihn für einen anderen Zweck verwenden. Dieser Leitfaden beschreibt einen technischen Arbeitsablauf. Beachten Sie außerdem den Schaltplan, die Versionshinweise und die Sicherheitshinweise für das konkrete ArmSoM-Produkt und dessen Revision.

## Plattformkontext

Die ArmSoM-Pintabellen zeigen mehrere Funktionen je Signal des 40-Pin-Anschlusses. Die Linux-Dokumentation zu Overlays erläutert, wie Änderungen auf einen Basisbaum angewendet werden.

Dokumentieren Sie Board, BSP-/Image-Version, Peripherierevision, Stromversorgung und reproduzierbare Befehle gemeinsam in einem Projektprotokoll. So lassen sich Fehler im Feldeinsatz untersuchen, und eine funktionierende Laborkonfiguration bleibt nachvollziehbar.

## Reproduzierbarer Einstieg

Beginnen Sie mit einem minimalen Knoten, kompilieren Sie ihn mit einem zum Kernel passenden dtc und untersuchen Sie nach dem Booten den aktiven Device Tree.

```bash
/dts-v1/; /plugin/;
/ { fragment@0 { target-path = "/"; __overlay__ { demo { compatible = "vendor,demo"; status = "okay"; }; }; }; };
```

Protokollieren Sie die Befehlsausgabe, die Kernel- und Image-Version, die Boardrevision sowie die Kennungen angeschlossener Peripherie. Bevor ein Befehl Datenträger beschreibt, die Bootkonfiguration verändert oder die Stromversorgung steuert, lesen Sie das Handbuch des jeweiligen Boards.

![Device-Tree-Overlays für GPIO, I2C und SPI auf RK3576 und RK3588 – Diagramm des Prüfablaufs](/assets/004-device-tree-overlays-gpio-i2c-spi-validation.svg)

## Prüfliste

- [ ] Prüfen Sie das genaue ArmSoM-Board, seine Revision, die RAM-/Speichervariante und die Art der Stromversorgung.
- [ ] Erfassen Sie `uname -a`, die Image-/Build-Version und das vollständige serielle Bootprotokoll.
- [ ] Prüfen Sie vor der Leistungsoptimierung den erwarteten Hardwareknoten beziehungsweise Anschluss.
- [ ] Ändern Sie jeweils nur eine Variable und dokumentieren Sie den Zustand davor und danach.
- [ ] Geben Sie zu jedem Ergebnis die Arbeitslast, Umgebung, Softwareversionen und Messmethode an.

## Fehlersuche

**Symptom: Das erwartete Gerät oder Verhalten fehlt.** Vergleichen Sie zunächst das laufende Image und den Device Tree mit der Produktdokumentation. Prüfen Sie anschließend Stromversorgung, Kabelausrichtung, Steckverbindungen und Bootprotokolle.

**Symptom: Der Befehl ist vorhanden, liefert aber ein unerwartetes Ergebnis.** Das Beispiel zeigt die Syntax. Für ein einsatzfähiges Overlay müssen Sie Labels, pinctrl-Gruppen, Spannungsregler und Busadressen aus dem konkreten ArmSoM-Kernelbaum übernehmen.

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
