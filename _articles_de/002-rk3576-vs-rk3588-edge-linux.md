---
title: "RK3576 oder RK3588 für ein Edge-Linux-System auswählen"
description: "Wählen Sie die Plattform anhand von Schnittstellen, Speicherarchitektur, Medienpfaden und Lebenszyklusanforderungen statt allein anhand einer TOPS-Angabe."
translation_key: "002-rk3576-vs-rk3588-edge-linux"
slug: "rk3576-vs-rk3588-edge-linux"
lang: de
date: 2026-10-12
author: "ArmSoM-Redaktion"
category: migration
products: [Sige5, Sige7]
tags: [Architekturauswahl, ArmSoM Sige5 CM5, ArmSoM Sige7 AIM7]
keywords: "Architekturauswahl, ArmSoM Sige5 CM5, ArmSoM Sige7 AIM7"
canonical_url: ""
---

# RK3576 oder RK3588 für ein Edge-Linux-System auswählen

Wählen Sie die Plattform anhand von Schnittstellen, Speicherarchitektur, Medienpfaden und Lebenszyklusanforderungen statt allein anhand einer TOPS-Angabe.

![RK3576 oder RK3588 für ein Edge-Linux-System auswählen – Ablaufdiagramm](/assets/002-rk3576-vs-rk3588-edge-linux-flow.svg)

## Welche Entscheidungen dieser Artikel unterstützt

Vergleichen Sie die benötigten Display-, Kamera-, PCIe- und Speicherfunktionen sowie den Modulformfaktor, bevor Sie das Carrier Board festlegen. Dieser Leitfaden beschreibt einen technischen Arbeitsablauf. Beachten Sie außerdem den Schaltplan, die Versionshinweise und die Sicherheitshinweise für das konkrete ArmSoM-Produkt und dessen Revision.

## Plattformkontext

Sige5/CM5 verwenden RK3576, Sige7/AIM7 verwenden RK3588. Die veröffentlichten Unterlagen nennen unterschiedliche CPU- und Speicherkonfigurationen. Prüfen Sie deshalb vor der Designfreigabe die genaue Boardvariante.

Dokumentieren Sie Board, BSP-/Image-Version, Peripherierevision, Stromversorgung und reproduzierbare Befehle gemeinsam in einem Projektprotokoll. So lassen sich Fehler im Feldeinsatz untersuchen, und eine funktionierende Laborkonfiguration bleibt nachvollziehbar.

## Reproduzierbarer Einstieg

Erstellen Sie eine Anforderungstabelle und gleichen Sie jedes zwingend benötigte Signal mit dem ArmSoM-Handbuch und dem Schaltplan ab.

```bash
python3 - <<'PY'
requirements = {"cameras": 2, "pcie_lanes": 1, "ram_gib": 8}
print(requirements)
PY
```

Protokollieren Sie die Befehlsausgabe, die Kernel- und Image-Version, die Boardrevision sowie die Kennungen angeschlossener Peripherie. Bevor ein Befehl Datenträger beschreibt, die Bootkonfiguration verändert oder die Stromversorgung steuert, lesen Sie das Handbuch des jeweiligen Boards.

![RK3576 oder RK3588 für ein Edge-Linux-System auswählen – Diagramm des Prüfablaufs](/assets/002-rk3576-vs-rk3588-edge-linux-validation.svg)

## Prüfliste

- [ ] Prüfen Sie das genaue ArmSoM-Board, seine Revision, die RAM-/Speichervariante und die Art der Stromversorgung.
- [ ] Erfassen Sie `uname -a`, die Image-/Build-Version und das vollständige serielle Bootprotokoll.
- [ ] Prüfen Sie vor der Leistungsoptimierung den erwarteten Hardwareknoten beziehungsweise Anschluss.
- [ ] Ändern Sie jeweils nur eine Variable und dokumentieren Sie den Zustand davor und danach.
- [ ] Geben Sie zu jedem Ergebnis die Arbeitslast, Umgebung, Softwareversionen und Messmethode an.

## Fehlersuche

**Symptom: Das erwartete Gerät oder Verhalten fehlt.** Vergleichen Sie zunächst das laufende Image und den Device Tree mit der Produktdokumentation. Prüfen Sie anschließend Stromversorgung, Kabelausrichtung, Steckverbindungen und Bootprotokolle.

**Symptom: Der Befehl ist vorhanden, liefert aber ein unerwartetes Ergebnis.** Ein Dictionary mit Anforderungen erkennt keine Hardware. Prüfen Sie die Anschlussbelegung, Spannungsdomänen und Unterstützung im Softwareimage anhand der jeweiligen Boarddokumentation.

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
