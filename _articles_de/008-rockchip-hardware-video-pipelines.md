---
title: "Pipelines für hardwaregestützte Videoencodierung und -decodierung unter Rockchip Linux"
description: "Entwerfen Sie Medienpipelines anhand der Caps-Aushandlung, Puffer und unterstützten Codecs; prüfen Sie Bildraten durch Messungen."
translation_key: "008-rockchip-hardware-video-pipelines"
slug: "rockchip-hardware-video-pipelines"
lang: de
date: 2026-10-12
author: "ArmSoM-Redaktion"
category: camera
products: [Sige5, Sige7]
tags: [Rockchip MPP, GStreamer, Hardware-Video, RK3576 RK3588]
keywords: "Rockchip MPP, GStreamer, Hardware-Video, RK3576 RK3588"
canonical_url: ""
---

# Pipelines für hardwaregestützte Videoencodierung und -decodierung unter Rockchip Linux

Entwerfen Sie Medienpipelines anhand der Caps-Aushandlung, Puffer und unterstützten Codecs; prüfen Sie Bildraten durch Messungen.

![Pipelines für hardwaregestützte Videoencodierung und -decodierung unter Rockchip Linux – Ablaufdiagramm](/assets/008-rockchip-hardware-video-pipelines-flow.svg)

## Welche Entscheidungen dieser Artikel unterstützt

Verwenden Sie die von der Distribution unterstützten Userspace-Komponenten und untersuchen Sie die Pipeline auf dem Zielgerät, bevor Sie Aussagen zu Codecs oder Auflösungen treffen. Dieser Leitfaden beschreibt einen technischen Arbeitsablauf. Beachten Sie außerdem den Schaltplan, die Versionshinweise und die Sicherheitshinweise für das konkrete ArmSoM-Produkt und dessen Revision.

## Plattformkontext

Die ArmSoM-Produktseiten nennen die Hardware-Codec-Funktionen der RK3576- und RK3588-Varianten. Ihre Verfügbarkeit im ausgelieferten Image hängt von den Kerneltreibern und den Medienkomponenten im Userspace ab.

Dokumentieren Sie Board, BSP-/Image-Version, Peripherierevision, Stromversorgung und reproduzierbare Befehle gemeinsam in einem Projektprotokoll. So lassen sich Fehler im Feldeinsatz untersuchen, und eine funktionierende Laborkonfiguration bleibt nachvollziehbar.

## Reproduzierbarer Einstieg

Ermitteln Sie die installierten Elemente und erstellen Sie anschließend einen minimalen Pfad von einer Datei zu fakesink oder von einer Kamera zu einer Datei.

```bash
gst-inspect-1.0 | rg -i "mpp|v4l2|h264|h265"
gst-launch-1.0 filesrc location=input.mp4 ! qtdemux ! fakesink
```

Protokollieren Sie die Befehlsausgabe, die Kernel- und Image-Version, die Boardrevision sowie die Kennungen angeschlossener Peripherie. Bevor ein Befehl Datenträger beschreibt, die Bootkonfiguration verändert oder die Stromversorgung steuert, lesen Sie das Handbuch des jeweiligen Boards.

![Pipelines für hardwaregestützte Videoencodierung und -decodierung unter Rockchip Linux – Diagramm des Prüfablaufs](/assets/008-rockchip-hardware-video-pipelines-validation.svg)

## Prüfliste

- [ ] Prüfen Sie das genaue ArmSoM-Board, seine Revision, die RAM-/Speichervariante und die Art der Stromversorgung.
- [ ] Erfassen Sie `uname -a`, die Image-/Build-Version und das vollständige serielle Bootprotokoll.
- [ ] Prüfen Sie vor der Leistungsoptimierung den erwarteten Hardwareknoten beziehungsweise Anschluss.
- [ ] Ändern Sie jeweils nur eine Variable und dokumentieren Sie den Zustand davor und danach.
- [ ] Geben Sie zu jedem Ergebnis die Arbeitslast, Umgebung, Softwareversionen und Messmethode an.

## Fehlersuche

**Symptom: Das erwartete Gerät oder Verhalten fehlt.** Vergleichen Sie zunächst das laufende Image und den Device Tree mit der Produktdokumentation. Prüfen Sie anschließend Stromversorgung, Kabelausrichtung, Steckverbindungen und Bootprotokolle.

**Symptom: Der Befehl ist vorhanden, liefert aber ein unerwartetes Ergebnis.** Elementnamen und Beschleunigungspfade unterscheiden sich zwischen Images. Prüfen Sie sie mit gst-inspect und Protokollen. Die CPU-Auslastung allein belegt keine Hardwarebeschleunigung.

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
