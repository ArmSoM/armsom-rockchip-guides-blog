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

## Kommandozeilenhandbuch: Versionen und Geltungsbereich

Die folgenden vollständigen technischen Abschnitte verbinden das chinesische Handbuch V1.0 mit der als V1.1 bezeichneten Datei. Deren Deckblatt nennt weiterhin 1.0, die technische Ergänzung betrifft SPI-NAND-Löschen. Die Vorlage nennt RK3308, RK3326, RK3399, RK3328, RK3228H, RK3229, RK3368, RK3228, RK3288, RK3128, RK3126, RK3188, RK3036, RK1808, PX30, RV1109, RV1126, RK3566 und RK3568. Dies ist keine Liste getesteter ArmSoM-Boards.

### 1. Update-Geräte auflisten

```text
upgrade_tool ld
```

Update-fähige Geräte heißen Rockusb und befinden sich im Loader- oder Maskrom-Modus. Bei mehreren Boards zuerst das Ziel bestimmen; die LocationID ist keine dauerhafte Seriennummer.

### 2. Boot in den Arbeitsspeicher laden

```text
upgrade_tool db rkxxloader.bin
```

In Maskrom zuerst Boot für die weitere Kommunikation laden. Dabei wird der Gerätespeicher nicht beschrieben. Bei Fehlern DDR/SoC beziehungsweise USB prüfen und das Gerät vor dem erneuten Versuch neu starten. Der Dateiname ist ein Quellenbeispiel; erforderlich ist der passende Board-Loader.

### 3. Loader programmieren

```text
upgrade_tool ul rkxxloader.bin
upgrade_tool ul rkxxloader.bin -noreset
upgrade_tool ul rkxxloader.bin SPINOR
```

Die drei Varianten starten nach dem Schreiben neu, unterdrücken den Neustart oder wählen SPINOR bei mehreren Speichertypen. Maskrom und Loader sind zulässig; Boot wird geladen, IDBlock erzeugt und in den Speicher geschrieben. Flash-Unterstützung und Lötstellen prüfen. Sporadische Kommunikationsfehler sprechen für eine USB-Prüfung, reproduzierbare Fehler für eine Untersuchung der Geräteseite.

### 4. Partitionsabbilder programmieren

```text
upgrade_tool di -p parameter.txt
upgrade_tool di -k kernel.img
upgrade_tool di -u uboot.img -b boot.img
upgrade_tool di -vendor vendor.img
upgrade_tool di -boot_a boot.img -boot_b boot.img
```

Zuerst die Partitionstabelle, danach einzelne oder mehrere Abbilder schreiben. Ohne definiertes Kürzel den vollständigen Partitionsnamen verwenden, auch bei A/B. Nachstehend alle Kürzel der Vorlage. Fehlende/belegte Dateien, zu große Abbilder und USB-Fehler getrennt untersuchen; eine erzwungene Adresse behebt keinen Größenkonflikt.

| Option | Partition |
|---|---|
| `-b` | `boot` |
| `-k` | `kernel` |
| `-r` | `recovery` |
| `-s` | `system` |
| `-u` | `uboot` |
| `-m` | `misc` |
| `-t` | `trust` |

### 5. Von Loader zu Maskrom wechseln

```text
upgrade_tool rd 3
```

### 6. Vollständige Firmware aktualisieren

```text
upgrade_tool uf update.img
upgrade_tool uf update.img -noreset
```

In Maskrom oder Loader ohne vorherigen Boot-Download aktualisieren; die zweite Variante unterdrückt den abschließenden Neustart. Die Vorlage nennt sieben Fehlerfälle: fehlende/belegte Datei; falsche Firmware-Kennung (Paketaufbau prüfen); Hashfehler (Änderung prüfen); Lesefehler (Packer aktualisieren und neu erzeugen); Abbild größer als Partition; falsches Chip-Flag (Chipdaten lesen und neu packen); Kommunikationsfehler (bei sporadischen Fehlern USB, bei reproduzierbaren die Geräteseite prüfen).

### 7. Lesen und Schreiben nach Adresse

```text
upgrade_tool wl 0x12000 oem.img
upgrade_tool rl 0x12000 0x2000 out.img
```

Die erste Zeile schreibt bei LBA `0x12000`, die zweite liest ab `0x12000` insgesamt `0x2000` Sektoren nach `out.img`. Dies sind Quellenbeispiele, keine allgemein gültigen Partitionsadressen.

### 8. Löschen und die V1.1-Abweichung

```text
upgrade_tool ef rkxxloader.bin
upgrade_tool el 0 0x2000
```

`ef` löscht in Maskrom alle Daten ohne vorherigen Boot-Download; die Vorlage nennt eMMC und NAND. Das `el`-Beispiel löscht ab Sektor 0 insgesamt `0x2000` Sektoren. V1.0 nennt nur eMMC, V1.1 dagegen `emmc|spinand|spinor`. Für vollständiges SPI-NAND-Löschen verlangt V1.1 Maskrom und die folgenden zwei Zeilen in dieser Reihenfolge. `-1` stammt unverändert aus der Quelle; die konkrete Implementierung vorher bestätigen.

```text
upgrade_tool db rkxxloader.bin
upgrade_tool el 0 -1
```

### 9. Geräteinformationen lesen

```text
upgrade_tool rfi
upgrade_tool rci
upgrade_tool pl
```

Liest nacheinander Speicherinformationen, Chip-ID und Partitionstabelle.

### 10. Speicher auswählen

```text
upgrade_tool ssd
```

Nach erfolgreichem Boot-Download in Maskrom ausführen. `*` markiert den aktuellen Speicher; die vor dem gewünschten Speicher angegebene No eingeben.

### 11. Gerät auswählen

```text
upgrade_tool -s 100 ul rkxxloader.bin
```

Mit `ld` die Ziel-LocationID bestimmen und über `-s` wählen; `100` ist ein Beispiel. Diese Geräteauswahl unterscheidet sich vom Kürzel für die system-Partition in `di -s`.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## GitHub-Werkzeugverzeichnis, Versionen und SHA-256

Das passende GitHub-Verzeichnis öffnen, Host und Version wählen, Dateihash prüfen und vollständig entpacken. Die folgenden Links öffnen Repository-Verzeichnisse.

[Werkzeugverzeichnis auf GitHub öffnen](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/upgrade-tool)

| Plattform / Version | Datei | SHA-256 |
|---|---|---|
| Linux / 2.44 | `upgrade_tool_v2.44_for_linux.zip` | `b779239cb1dc6cadd823520439e4163cf223145d048e6b5f9eaf1735b407cff8` |
| macOS / 2.13 | `upgrade_tool_v2.13_for_mac.zip` | `d49db00e892b72a1760b9766b5e4ab998e75a17a37cb3acc8bf13b981b0ffc34` |
| Windows / 2.46 | `upgrade_tool_v2.46.zip` | `de1dc7ce00ed5cfdaa0432f1c7e3efaf096e5dbb7e0ad851345739f6342c06dc` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- 命令行开发工具使用文档.pdf
- 命令行开发工具使用文档v1.1.pdf

## Verwandte Arbeitsabläufe

- [RKDevTool: Download, Loader, Partitionen und update.img](/de/articles/rockchip-tool-rkdevtool/)
- [Rockchip-Speicherleitfaden: Flash, Startablauf, Partitionen, Programmierung und Vendor Storage](/de/articles/099-rockchip-storage-application/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
