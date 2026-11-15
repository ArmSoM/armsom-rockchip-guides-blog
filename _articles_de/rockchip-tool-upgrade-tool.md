---
title: "upgrade_tool: Rockchip-Firmware per Kommandozeile schreiben"
description: "upgrade_tool bietet Rockusb-Funktionen für wiederholbare Abläufe. Die Sammlung enthält Linux 2.44, macOS 2.13 und Windows 2.46 als getrennte Pakete. Wählen Sie das passende Host-System."
excerpt: "upgrade_tool bietet Rockusb-Funktionen für wiederholbare Abläufe. Die Sammlung enthält Linux 2.44, macOS 2.13 und Windows 2.46 als getrennte Pakete. Wählen Sie das passende Host-System."
translation_key: "rockchip-tool-upgrade-tool"
slug: "rockchip-tool-upgrade-tool"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "upgrade_tool"]
---

{% raw %}

![upgrade_tool](/assets/rockchip-tools/flows/upgrade-tool-de.svg)

`upgrade_tool` bietet Rockusb-Funktionen für wiederholbare Abläufe. Die Sammlung enthält Linux 2.44, macOS 2.13 und Windows 2.46 als getrennte Pakete. Wählen Sie das passende Host-System.

## Vor dem Schreiben identifizieren

Verbinden Sie ein korrekt versorgtes Board in Loader/Maskrom. Diese Abfragen dienen der Prüfung, soweit der Gerätemodus sie unterstützt:

```text
upgrade_tool ld
upgrade_tool rfi
upgrade_tool rci
upgrade_tool pl
```

`ld` listet Geräte, `rfi` Speicherinformationen, `rci` Chipinformationen und `pl` Partitionen. Klären Sie Treiber-, Kabel- oder Modusprobleme zuerst.

## RAM-Download und dauerhafte Speicherung

Das Handbuch zeigt diesen Download des Aktualisierungscodes in den RAM:

```text
upgrade_tool db rkxxloader.bin
```

Ersetzen Sie den Dateinamen durch den passenden Board-Loader. `db` unterscheidet sich von `ul`, das den Loader in den Speicher schreibt. Bei Partitionen wird zuerst parameter angegeben:

```text
upgrade_tool di -p parameter.txt
upgrade_tool di -u uboot.img -b boot.img
```

Diese Befehle schreiben Daten. Backup, SoC, Abbilder, Partitionstabelle und Zielspeicher müssen stimmen. `-boot_a`/`-boot_b` bezeichnen tatsächliche A/B-Partitionen. Ein vollständiges Paket verwendet:

```text
upgrade_tool uf update.img
```

## Mehrere Geräte und Grenzen

Die LocationID kommt aus `ld`; `100` ist ein Beispiel und keine dauerhafte Seriennummer:

```text
upgrade_tool -s 100 ul rkxxloader.bin
```

`wl`/`rl` arbeiten mit Rohbereichen und benötigen geprüfte Offsets. `ef`/`el` löschen Daten. V1.0 beschreibt `el` für eMMC, V1.1 behandelt zusätzlich SPI NAND/NOR. Übertragen Sie diese Aussage nicht ungeprüft auf ältere Programme.

Prüfen Sie jeden Rückgabestatus und dokumentieren Sie Gerätekennung und Befehle. Nach dem Schreiben Kaltstart und OS-Version prüfen. Ein zu großes Abbild verlangt eine korrigierte Partitionierung; chip-flag-Fehler eine korrigierte Verpackung. Sporadische USB-Fehler erfordern Kabel- und Versorgungskontrollen. Für diesen Artikel wurden keine Gerätebefehle ausgeführt.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## Download, Versionen und SHA-256

Passendes Archiv laden, Hash prüfen und den vollständigen Ordner entpacken. Linux PinDebug zuerst nach verlinkter Anleitung zusammensetzen; der angegebene Hash gehört zur vollständigen Datei.

| Host / Version | Paket |
|---|---|
| Linux / 2.44 | [upgrade_tool_v2.44_for_linux.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/upgrade-tool/upgrade_tool_v2.44_for_linux.zip) |
| macOS / 2.13 | [upgrade_tool_v2.13_for_mac.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/upgrade-tool/upgrade_tool_v2.13_for_mac.zip) |
| Windows / 2.46 | [upgrade_tool_v2.46.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/upgrade-tool/upgrade_tool_v2.46.zip) |

**upgrade_tool_v2.44_for_linux.zip — SHA-256**

```text
b779239cb1dc6cadd823520439e4163cf223145d048e6b5f9eaf1735b407cff8
```

**upgrade_tool_v2.13_for_mac.zip — SHA-256**

```text
d49db00e892b72a1760b9766b5e4ab998e75a17a37cb3acc8bf13b981b0ffc34
```

**upgrade_tool_v2.46.zip — SHA-256**

```text
de1dc7ce00ed5cfdaa0432f1c7e3efaf096e5dbb7e0ad851345739f6342c06dc
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- 命令行开发工具使用文档.pdf V1.0 (Linux/macOS packages), V1.1 (Windows package)
- [Original-PDF: 命令行开发工具使用文档.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/925b67105873.pdf)
- [Original-PDF: 命令行开发工具使用文档v1.1.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/8a7aa375abfc.pdf)

## Verwandte Arbeitsabläufe

- [RKDevTool: Download, Loader, Partitionen und update.img](/de/articles/rockchip-tool-rkdevtool/)
- [Rockchip-Speicherleitfaden: Flash, Startablauf, Partitionen, Programmierung und Vendor Storage](/de/articles/099-rockchip-storage-application/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
