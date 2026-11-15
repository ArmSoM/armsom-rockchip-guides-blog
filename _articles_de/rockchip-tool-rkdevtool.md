---
title: "RKDevTool: Download, Loader, Partitionen und update.img"
description: "RKDevTool ist das Windows-Werkzeug mit grafischer Oberfläche für Rockusb. Es unterstützt die Inbetriebnahme von ArmSoM-Boards und die Fehlersuche beim Flashen."
excerpt: "RKDevTool ist das Windows-Werkzeug mit grafischer Oberfläche für Rockusb. Es unterstützt die Inbetriebnahme von ArmSoM-Boards und die Fehlersuche beim Flashen."
translation_key: "rockchip-tool-rkdevtool"
slug: "rockchip-tool-rkdevtool"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "RKDevTool"]
---

{% raw %}

![RKDevTool](/assets/rockchip-tools/flows/rkdevtool-de.svg)

RKDevTool ist das Windows-Werkzeug mit grafischer Oberfläche für Rockusb. Es unterstützt die Inbetriebnahme von ArmSoM-Boards und die Fehlersuche beim Flashen. Eine vollständige `update.img`, einzelne Partitionsabbilder und ein Loader benötigen unterschiedliche Abläufe.

## Vorbereitung

Installieren Sie den passenden Rockusb-Treiber mit DriverAssitant. Entpacken Sie den vollständigen Ordner einschließlich DLLs und Sprachdateien. Prüfen Sie im Board-Handbuch den USB-Datenanschluss, die Versorgung und den Einstieg in Maskrom. Sichern Sie Daten vor Schreibvorgängen. ADB im laufenden Betriebssystem ist kein Loader- oder Maskrom-Modus.

## Wiederholbare Partitionskonfiguration

1. Wählen Sie im Download-Bereich Import configuration, den Dateityp **ParameterFile** und die parameter-Datei derselben Firmware-Version.
2. Entfernen Sie nicht benötigte Einträge; ordnen Sie Abbilder und gegebenenfalls den Zielspeicher zu.
3. Vergleichen Sie Abbild- und Partitionsgrößen und exportieren Sie eine **ConfigFile**. `DEFAULT_IMAGE_CONFIG` in `config.ini` legt laut Handbuch die Startkonfiguration fest.
4. Kontrollieren Sie vor Execute alle aktivierten Zeilen. Ein erfolgreicher Import bestätigt keine Board-Kompatibilität.

## LoaderToDDR und Loader unterscheiden

**LoaderToDDR** lädt im Maskrom-Modus den Aktualisierungscode in den RAM und schreibt laut Anleitung keinen Massenspeicher. **Loader** erzeugt dagegen einen IDBlock und schreibt ihn in den Speicher. Verwenden Sie jeweils den zum Board und DDR passenden Loader.

Für ein vollständiges Update wählen Sie `update.img`, verbinden das Board in Maskrom/Loader und starten Upgrade. Bei einzelnen Partitionen zuerst parameter laden. Übernehmen Sie bei adressbasierter Ausgabe keine Offsets anderer Boards. Erase All löscht den Speicherinhalt.

## Fehler eingrenzen und Ergebnis prüfen

Fehlt das Gerät, prüfen Sie Datenkabel, Port, Treiber und Betriebsart. Bei Download-Boot-Fehlern DDR/Loader, Versorgung und USB prüfen und vor dem nächsten Versuch neu starten. Zu große Abbilder erfordern passende Partitionen; chip-flag- und digest-Fehler eine Prüfung der Firmware-Erstellung. Sporadische Übertragungsfehler deuten auf Verbindungsprobleme, reproduzierbare Fehler erfordern zusätzlich eine Prüfung des Zielsystems.

Das Paket enthält zweisprachige V1.2-Handbücher von 2018, eine chinesische V1.0-Anleitung von 2021 für V2.88 und Versionshinweise bis 3.37. Eine kleinere Dokumentnummer kann deshalb neuer sein. Nach dem Schreiben Kaltstart, Speichererkennung und Betriebssystemversion prüfen. Ein erfolgreicher Transfer ist keine vollständige Produktprüfung.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## Download, Versionen und SHA-256

Passendes Archiv laden, Hash prüfen und den vollständigen Ordner entpacken. Linux PinDebug zuerst nach verlinkter Anleitung zusammensetzen; der angegebene Hash gehört zur vollständigen Datei.

| Host / Version | Paket |
|---|---|
| Windows / 3.37 release notes | [RKDevTool-windows-directory-snapshot.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rkdevtool/RKDevTool-windows-directory-snapshot.zip) |

**RKDevTool-windows-directory-snapshot.zip — SHA-256**

```text
d453bd22c00141f12ef39469629d478aa61304763bdb2977288d6f019a74f20c
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- RKDevTool_manual_v1.2_cn.pdf; RKDevTool_manual_v1.2_en.pdf (2018)
- 开发工具使用说明_v1.0.pdf (2021, tool V2.88); bundled revision notes through 3.37
- [Original-PDF: RKDevTool_manual_v1.2_cn.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/27081f89d32f.pdf)
- [Original-PDF: RKDevTool_manual_v1.2_en.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/6a8a5813c129.pdf)
- [Original-PDF: 开发工具使用说明_v1.0.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/be6d064c5f70.pdf)

Abbildungen stammen aus den angegebenen PDFs. Existiert nur eine chinesische Vorlage, bleiben deren Oberflächentexte erhalten; Bildunterschriften sind übersetzt. Es sind historische Beispiele, keine ArmSoM-Testergebnisse.

![Abbildung aus dem Originalhandbuch · RKDevTool](/assets/rockchip-tools/rkdevtool/en-p05-02.png)

RKDevTool_manual_v1.2_en.pdf · p. 5

![Abbildung aus dem Originalhandbuch · RKDevTool](/assets/rockchip-tools/rkdevtool/en-p05-03.png)

RKDevTool_manual_v1.2_en.pdf · p. 5

## Verwandte Arbeitsabläufe

- [Rockchip-Speicherleitfaden: Flash, Startablauf, Partitionen, Programmierung und Vendor Storage](/de/articles/099-rockchip-storage-application/)
- [DriverAssitant 5.13: Rockusb- und ADB-Treiber unter Windows](/de/articles/rockchip-tool-driver-assistant/)
- [upgrade_tool: Rockchip-Firmware per Kommandozeile schreiben](/de/articles/rockchip-tool-upgrade-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
