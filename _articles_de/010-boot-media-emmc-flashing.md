---
title: "Bootmedien und sicheres Flashen von eMMC auf Rockchip-ArmSoM-Plattformen"
description: "Erstellen Sie ein sicheres Flashverfahren mit nachvollziehbarer Dokumentation und prüfen Sie, welche Wiederherstellungswerkzeuge zum konkreten Fehler passen."
translation_key: "010-boot-media-emmc-flashing"
slug: "boot-media-emmc-flashing"
lang: de
date: 2026-10-12
author: "ArmSoM-Redaktion"
category: linux
products: [Sige5, Sige7]
tags: [eMMC-Flashen, Rockchip-Bootmedien, ArmSoM-Bereitstellung]
keywords: "eMMC-Flashen, Rockchip-Bootmedien, ArmSoM-Bereitstellung"
canonical_url: ""
---

# Bootmedien und sicheres Flashen von eMMC auf Rockchip-ArmSoM-Plattformen

Erstellen Sie ein sicheres Flashverfahren mit nachvollziehbarer Dokumentation und prüfen Sie, welche Wiederherstellungswerkzeuge zum konkreten Fehler passen.

![Bootmedien und sicheres Flashen von eMMC auf Rockchip-ArmSoM-Plattformen – Ablaufdiagramm](/assets/010-boot-media-emmc-flashing-flow.svg)

## Welche Entscheidungen dieser Artikel unterstützt

Image-Herkunft, Boardrevision, Bootziel und ein Rollbackplan gehören in jedes Protokoll für das Flashen in der Produktion. Dieser Leitfaden beschreibt einen technischen Arbeitsablauf. Beachten Sie außerdem den Schaltplan, die Versionshinweise und die Sicherheitshinweise für das konkrete ArmSoM-Produkt und dessen Revision.

## Plattformkontext

ArmSoM stellt boardspezifische Betriebssystemimages und Dokumentation bereit. Entnehmen Sie das Layout der Bootmedien und die Wiederherstellungsanleitung dem passenden Produkthandbuch.

Dokumentieren Sie Board, BSP-/Image-Version, Peripherierevision, Stromversorgung und reproduzierbare Befehle gemeinsam in einem Projektprotokoll. So lassen sich Fehler im Feldeinsatz untersuchen, und eine funktionierende Laborkonfiguration bleibt nachvollziehbar.

## Reproduzierbarer Einstieg

Prüfen Sie Prüfsummen, beschriften Sie Wechseldatenträger, sichern Sie ein serielles Protokoll und testen Sie die Wiederherstellung zunächst auf einem Gerät außerhalb der Produktion.

```bash
sha256sum image.img
lsblk
# Confirm the target device manually before using any flashing tool
```

Protokollieren Sie die Befehlsausgabe, die Kernel- und Image-Version, die Boardrevision sowie die Kennungen angeschlossener Peripherie. Bevor ein Befehl Datenträger beschreibt, die Bootkonfiguration verändert oder die Stromversorgung steuert, lesen Sie das Handbuch des jeweiligen Boards.

![Bootmedien und sicheres Flashen von eMMC auf Rockchip-ArmSoM-Plattformen – Diagramm des Prüfablaufs](/assets/010-boot-media-emmc-flashing-validation.svg)

## Prüfliste

- [ ] Prüfen Sie das genaue ArmSoM-Board, seine Revision, die RAM-/Speichervariante und die Art der Stromversorgung.
- [ ] Erfassen Sie `uname -a`, die Image-/Build-Version und das vollständige serielle Bootprotokoll.
- [ ] Prüfen Sie vor der Leistungsoptimierung den erwarteten Hardwareknoten beziehungsweise Anschluss.
- [ ] Ändern Sie jeweils nur eine Variable und dokumentieren Sie den Zustand davor und danach.
- [ ] Geben Sie zu jedem Ergebnis die Arbeitslast, Umgebung, Softwareversionen und Messmethode an.

## Fehlersuche

**Symptom: Das erwartete Gerät oder Verhalten fehlt.** Vergleichen Sie zunächst das laufende Image und den Device Tree mit der Produktdokumentation. Prüfen Sie anschließend Stromversorgung, Kabelausrichtung, Steckverbindungen und Bootprotokolle.

**Symptom: Der Befehl ist vorhanden, liefert aber ein unerwartetes Ergebnis.** Übernehmen Sie keinen Befehl zum blockweisen Schreiben ungeprüft aus einem Artikel in die Produktion. Ein falsches Ziel kann Daten auf dem Host oder Wechseldatenträger zerstören. Verwenden Sie das offizielle Verfahren für das jeweilige Board.

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
