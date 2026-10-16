---
title: "Eine reproduzierbare Kamerapipeline mit V4L2 und GStreamer aufbauen"
description: "Gehen Sie von der Sensorerkennung zu einer gut untersuchbaren Aufnahmepipeline über und prüfen Sie dabei das tatsächlich eingesetzte Kameramodul und Format."
translation_key: "005-v4l2-gstreamer-camera-pipeline"
slug: "v4l2-gstreamer-camera-pipeline"
lang: de
date: 2026-10-12
author: "ArmSoM-Redaktion"
category: camera
products: [Sige5, Sige7]
tags: [V4L2-GStreamer-Kamera, RK3588 ISP, ArmSoM-Kamera]
keywords: "V4L2-GStreamer-Kamera, RK3588 ISP, ArmSoM-Kamera"
canonical_url: ""
---

# Eine reproduzierbare Kamerapipeline mit V4L2 und GStreamer aufbauen

Gehen Sie von der Sensorerkennung zu einer gut untersuchbaren Aufnahmepipeline über und prüfen Sie dabei das tatsächlich eingesetzte Kameramodul und Format.

![Eine reproduzierbare Kamerapipeline mit V4L2 und GStreamer aufbauen – Ablaufdiagramm](/assets/005-v4l2-gstreamer-camera-pipeline-flow.svg)

## Welche Entscheidungen dieser Artikel unterstützt

Prüfen Sie die Medientopologie und das ausgehandelte Pixelformat, bevor Sie KI-Inferenz, Encodierung oder Anzeige ergänzen. Dieser Leitfaden beschreibt einen technischen Arbeitsablauf. Beachten Sie außerdem den Schaltplan, die Versionshinweise und die Sicherheitshinweise für das konkrete ArmSoM-Produkt und dessen Revision.

## Plattformkontext

ArmSoM beschreibt den RK3588-Kamerapfad als Sensor → D-PHY → CSI-Host → VICAP → ISP. Bei mehreren Kameras müssen die Pfade gemäß der dokumentierten Hardwaretopologie verteilt werden.

Dokumentieren Sie Board, BSP-/Image-Version, Peripherierevision, Stromversorgung und reproduzierbare Befehle gemeinsam in einem Projektprotokoll. So lassen sich Fehler im Feldeinsatz untersuchen, und eine funktionierende Laborkonfiguration bleibt nachvollziehbar.

## Reproduzierbarer Einstieg

Listen Sie die Entitäten auf, wählen Sie einen Videoknoten und dokumentieren Sie die Caps, bevor Sie optimieren.

```bash
media-ctl -p
v4l2-ctl --list-devices
gst-launch-1.0 v4l2src device=/dev/video0 ! videoconvert ! fakesink
```

Protokollieren Sie die Befehlsausgabe, die Kernel- und Image-Version, die Boardrevision sowie die Kennungen angeschlossener Peripherie. Bevor ein Befehl Datenträger beschreibt, die Bootkonfiguration verändert oder die Stromversorgung steuert, lesen Sie das Handbuch des jeweiligen Boards.

![Eine reproduzierbare Kamerapipeline mit V4L2 und GStreamer aufbauen – Diagramm des Prüfablaufs](/assets/005-v4l2-gstreamer-camera-pipeline-validation.svg)

## Prüfliste

- [ ] Prüfen Sie das genaue ArmSoM-Board, seine Revision, die RAM-/Speichervariante und die Art der Stromversorgung.
- [ ] Erfassen Sie `uname -a`, die Image-/Build-Version und das vollständige serielle Bootprotokoll.
- [ ] Prüfen Sie vor der Leistungsoptimierung den erwarteten Hardwareknoten beziehungsweise Anschluss.
- [ ] Ändern Sie jeweils nur eine Variable und dokumentieren Sie den Zustand davor und danach.
- [ ] Geben Sie zu jedem Ergebnis die Arbeitslast, Umgebung, Softwareversionen und Messmethode an.

## Fehlersuche

**Symptom: Das erwartete Gerät oder Verhalten fehlt.** Vergleichen Sie zunächst das laufende Image und den Device Tree mit der Produktdokumentation. Prüfen Sie anschließend Stromversorgung, Kabelausrichtung, Steckverbindungen und Bootprotokolle.

**Symptom: Der Befehl ist vorhanden, liefert aber ein unerwartetes Ergebnis.** Knotennummerierung, Formate und ISP-Verfügbarkeit hängen von Image, Sensortreiber und Device Tree ab. Prüfen Sie, ob /dev/video0 tatsächlich eine Aufnahmequelle ist.

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
