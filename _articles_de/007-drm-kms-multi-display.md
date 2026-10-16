---
title: "Mehrere Displays mit DRM/KMS auf Rockchip RK3588 und RK3576 in Betrieb nehmen"
description: "Nehmen Sie Displays unter Berücksichtigung des Linux-DRM-Modells, des Anschlusszustands und des Routings im Device Tree in Betrieb."
translation_key: "007-drm-kms-multi-display"
slug: "drm-kms-multi-display"
lang: de
date: 2026-10-12
author: "ArmSoM-Redaktion"
category: media
products: [Sige7]
tags: [DRM KMS, HDMI, MIPI DSI, ArmSoM RK3588 RK3576]
keywords: "DRM KMS, HDMI, MIPI DSI, ArmSoM RK3588 RK3576"
canonical_url: ""
---

# Mehrere Displays mit DRM/KMS auf Rockchip RK3588 und RK3576 in Betrieb nehmen

Nehmen Sie Displays unter Berücksichtigung des Linux-DRM-Modells, des Anschlusszustands und des Routings im Device Tree in Betrieb.

![Mehrere Displays mit DRM/KMS auf Rockchip RK3588 und RK3576 in Betrieb nehmen – Ablaufdiagramm](/assets/007-drm-kms-multi-display-flow.svg)

## Welche Entscheidungen dieser Artikel unterstützt

Untersuchen Sie die physische Verbindung, die Moduseinstellung und das Verhalten des Compositors getrennt. So vermeiden Sie irreführende Diagnosen bei einem schwarzen Bildschirm. Dieser Leitfaden beschreibt einen technischen Arbeitsablauf. Beachten Sie außerdem den Schaltplan, die Versionshinweise und die Sicherheitshinweise für das konkrete ArmSoM-Produkt und dessen Revision.

## Plattformkontext

Die ArmSoM-Boardleitfäden enthalten Display- und Overlay-Beispiele. Welche Anschlüsse verfügbar sind, hängt vom Board ab, auch wenn SoCs dieselben Grafik- und Displaysubsysteme verwenden.

Dokumentieren Sie Board, BSP-/Image-Version, Peripherierevision, Stromversorgung und reproduzierbare Befehle gemeinsam in einem Projektprotokoll. So lassen sich Fehler im Feldeinsatz untersuchen, und eine funktionierende Laborkonfiguration bleibt nachvollziehbar.

## Reproduzierbarer Einstieg

Untersuchen Sie Anschlüsse und Modi, bevor Sie die Desktop-Einstellungen ändern.

```bash
modetest -c
cat /sys/class/drm/card0-*/status
# Then test a documented mode with the image's DRM tools
```

Protokollieren Sie die Befehlsausgabe, die Kernel- und Image-Version, die Boardrevision sowie die Kennungen angeschlossener Peripherie. Bevor ein Befehl Datenträger beschreibt, die Bootkonfiguration verändert oder die Stromversorgung steuert, lesen Sie das Handbuch des jeweiligen Boards.

![Mehrere Displays mit DRM/KMS auf Rockchip RK3588 und RK3576 in Betrieb nehmen – Diagramm des Prüfablaufs](/assets/007-drm-kms-multi-display-validation.svg)

## Prüfliste

- [ ] Prüfen Sie das genaue ArmSoM-Board, seine Revision, die RAM-/Speichervariante und die Art der Stromversorgung.
- [ ] Erfassen Sie `uname -a`, die Image-/Build-Version und das vollständige serielle Bootprotokoll.
- [ ] Prüfen Sie vor der Leistungsoptimierung den erwarteten Hardwareknoten beziehungsweise Anschluss.
- [ ] Ändern Sie jeweils nur eine Variable und dokumentieren Sie den Zustand davor und danach.
- [ ] Geben Sie zu jedem Ergebnis die Arbeitslast, Umgebung, Softwareversionen und Messmethode an.

## Fehlersuche

**Symptom: Das erwartete Gerät oder Verhalten fehlt.** Vergleichen Sie zunächst das laufende Image und den Device Tree mit der Produktdokumentation. Prüfen Sie anschließend Stromversorgung, Kabelausrichtung, Steckverbindungen und Bootprotokolle.

**Symptom: Der Befehl ist vorhanden, liefert aber ein unerwartetes Ergebnis.** Anschlussnamen und Kartenindizes können abweichen. Der Status connected bestätigt weder die korrekte Einschaltsequenz des Panels noch die Bridge-Konfiguration oder das Modustiming.

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
