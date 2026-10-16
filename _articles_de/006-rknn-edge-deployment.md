---
title: "Ein RKNN-Modell am Edge bereitstellen und belastbare Messwerte erheben"
description: "Erstellen Sie für ArmSoM-Geräte mit RK3576 und RK3588 einen nachvollziehbaren Inferenzpfad und kennzeichnen Sie Herstellerangaben und eigene Messergebnisse eindeutig."
translation_key: "006-rknn-edge-deployment"
slug: "rknn-edge-deployment"
lang: de
date: 2026-10-12
author: "ArmSoM-Redaktion"
category: ai
products: [Sige5, Sige7]
tags: [RKNN Toolkit Lite2, NPU-Bereitstellung, RK3576 RK3588, ArmSoM]
keywords: "RKNN Toolkit Lite2, NPU-Bereitstellung, RK3576 RK3588, ArmSoM"
canonical_url: ""
---

# Ein RKNN-Modell am Edge bereitstellen und belastbare Messwerte erheben

Erstellen Sie für ArmSoM-Geräte mit RK3576 und RK3588 einen nachvollziehbaren Inferenzpfad und kennzeichnen Sie Herstellerangaben und eigene Messergebnisse eindeutig.

![Ein RKNN-Modell am Edge bereitstellen und belastbare Messwerte erheben – Ablaufdiagramm](/assets/006-rknn-edge-deployment-flow.svg)

## Welche Entscheidungen dieser Artikel unterstützt

Ein bereitstellbares Modell umfasst mehr als eine RKNN-Datei: Vorverarbeitung, Quantisierung, Tensorlayout, Laufzeitversion und Validierungsbeispiele müssen gemeinsam versioniert werden. Dieser Leitfaden beschreibt einen technischen Arbeitsablauf. Beachten Sie außerdem den Schaltplan, die Versionshinweise und die Sicherheitshinweise für das konkrete ArmSoM-Produkt und dessen Revision.

## Plattformkontext

Beide Produktfamilien bieten NPU-Funktionen. Für belastbare Latenz- und Genauigkeitswerte müssen Modell, Eingabeform, Laufzeit, Taktraten, thermischer Zustand und Messmethode angegeben werden.

Dokumentieren Sie Board, BSP-/Image-Version, Peripherierevision, Stromversorgung und reproduzierbare Befehle gemeinsam in einem Projektprotokoll. So lassen sich Fehler im Feldeinsatz untersuchen, und eine funktionierende Laborkonfiguration bleibt nachvollziehbar.

## Reproduzierbarer Einstieg

Verwenden Sie die passende RKNN-Laufzeitversion und vergleichen Sie die Ausgaben mit einem festen Referenzdatensatz.

```bash
python3 - <<'PY'
# Pseudocode: record metadata next to each model artifact
print({"model":"model.rknn", "input":"1x3x224x224", "runtime":"verify-on-target"})
PY
```

Protokollieren Sie die Befehlsausgabe, die Kernel- und Image-Version, die Boardrevision sowie die Kennungen angeschlossener Peripherie. Bevor ein Befehl Datenträger beschreibt, die Bootkonfiguration verändert oder die Stromversorgung steuert, lesen Sie das Handbuch des jeweiligen Boards.

![Ein RKNN-Modell am Edge bereitstellen und belastbare Messwerte erheben – Diagramm des Prüfablaufs](/assets/006-rknn-edge-deployment-validation.svg)

## Prüfliste

- [ ] Prüfen Sie das genaue ArmSoM-Board, seine Revision, die RAM-/Speichervariante und die Art der Stromversorgung.
- [ ] Erfassen Sie `uname -a`, die Image-/Build-Version und das vollständige serielle Bootprotokoll.
- [ ] Prüfen Sie vor der Leistungsoptimierung den erwarteten Hardwareknoten beziehungsweise Anschluss.
- [ ] Ändern Sie jeweils nur eine Variable und dokumentieren Sie den Zustand davor und danach.
- [ ] Geben Sie zu jedem Ergebnis die Arbeitslast, Umgebung, Softwareversionen und Messmethode an.

## Fehlersuche

**Symptom: Das erwartete Gerät oder Verhalten fehlt.** Vergleichen Sie zunächst das laufende Image und den Device Tree mit der Produktdokumentation. Prüfen Sie anschließend Stromversorgung, Kabelausrichtung, Steckverbindungen und Bootprotokolle.

**Symptom: Der Befehl ist vorhanden, liefert aber ein unerwartetes Ergebnis.** Veröffentlichen Sie keine Durchsatzwerte aus einem Konvertierungslauf auf dem Host. Messen Sie auf dem Zielgerät mit Aufwärmphase und Wiederholungen, geben Sie Perzentile an und dokumentieren Sie Temperatur- und Versorgungsbedingungen.

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
