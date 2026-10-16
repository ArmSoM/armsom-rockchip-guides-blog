---
title: "Erster Start und Wiederherstellung über die serielle Konsole auf ArmSoM-Boards mit RK3576 und RK3588"
description: "Richten Sie für Sige5, CM5, Sige7, AIM5 und AIM7 einen wiederholbaren Ablauf zur Inbetriebnahme ein, bei dem die serielle Konsole zuerst eingerichtet wird."
translation_key: "003-first-boot-serial-recovery"
slug: "first-boot-serial-recovery"
lang: de
date: 2026-10-12
author: "ArmSoM-Redaktion"
category: linux
products: [Sige5, Sige7, CM5, AIM5, AIM7]
tags: [serielle Konsole, Bootdiagnose, Rockchip Linux, ArmSoM Sige5 Sige7]
keywords: "serielle Konsole, Bootdiagnose, Rockchip Linux, ArmSoM Sige5 Sige7"
canonical_url: ""
---

# Erster Start und Wiederherstellung über die serielle Konsole auf ArmSoM-Boards mit RK3576 und RK3588

Richten Sie für Sige5, CM5, Sige7, AIM5 und AIM7 einen wiederholbaren Ablauf zur Inbetriebnahme ein, bei dem die serielle Konsole zuerst eingerichtet wird.

![Erster Start und Wiederherstellung über die serielle Konsole auf ArmSoM-Boards mit RK3576 und RK3588 – Ablaufdiagramm](/assets/003-first-boot-serial-recovery-flow.svg)

## Welche Entscheidungen dieser Artikel unterstützt

Nutzen Sie die serielle Konsole als wichtigste Diagnosequelle. Erfassen Sie Bootprotokolle, bevor Sie Images oder Bootmedien ändern. Dieser Leitfaden beschreibt einen technischen Arbeitsablauf. Beachten Sie außerdem den Schaltplan, die Versionshinweise und die Sicherheitshinweise für das konkrete ArmSoM-Produkt und dessen Revision.

## Plattformkontext

ArmSoM stellt produktspezifische Handbücher und Images bereit. Die UART-Pinbelegung unterscheidet sich zwischen den Boards; übernehmen Sie daher keine Steckerbelegung von einem anderen Produkt.

Dokumentieren Sie Board, BSP-/Image-Version, Peripherierevision, Stromversorgung und reproduzierbare Befehle gemeinsam in einem Projektprotokoll. So lassen sich Fehler im Feldeinsatz untersuchen, und eine funktionierende Laborkonfiguration bleibt nachvollziehbar.

## Reproduzierbarer Einstieg

Beginnen Sie mit einer nachweislich funktionierenden Stromversorgung, einem dokumentierten Image und dem boardspezifischen UART-Anschluss.

```bash
sudo picocom -b 1500000 /dev/ttyUSB0
# Capture the complete boot log before resetting again
```

Protokollieren Sie die Befehlsausgabe, die Kernel- und Image-Version, die Boardrevision sowie die Kennungen angeschlossener Peripherie. Bevor ein Befehl Datenträger beschreibt, die Bootkonfiguration verändert oder die Stromversorgung steuert, lesen Sie das Handbuch des jeweiligen Boards.

![Erster Start und Wiederherstellung über die serielle Konsole auf ArmSoM-Boards mit RK3576 und RK3588 – Diagramm des Prüfablaufs](/assets/003-first-boot-serial-recovery-validation.svg)

## Prüfliste

- [ ] Prüfen Sie das genaue ArmSoM-Board, seine Revision, die RAM-/Speichervariante und die Art der Stromversorgung.
- [ ] Erfassen Sie `uname -a`, die Image-/Build-Version und das vollständige serielle Bootprotokoll.
- [ ] Prüfen Sie vor der Leistungsoptimierung den erwarteten Hardwareknoten beziehungsweise Anschluss.
- [ ] Ändern Sie jeweils nur eine Variable und dokumentieren Sie den Zustand davor und danach.
- [ ] Geben Sie zu jedem Ergebnis die Arbeitslast, Umgebung, Softwareversionen und Messmethode an.

## Fehlersuche

**Symptom: Das erwartete Gerät oder Verhalten fehlt.** Vergleichen Sie zunächst das laufende Image und den Device Tree mit der Produktdokumentation. Prüfen Sie anschließend Stromversorgung, Kabelausrichtung, Steckverbindungen und Bootprotokolle.

**Symptom: Der Befehl ist vorhanden, liefert aber ein unerwartetes Ergebnis.** Baudrate und UART-Gerät sind lediglich Beispiele. Befolgen Sie das Produkthandbuch. Eine stumme Konsole kann durch Verkabelung, Spannungspegel, Multiplexing, Bootphase oder Zugriffsrechte auf dem Host verursacht werden.

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
