---
title: "Rockchip-SD-Boot: Upgrade-, Boot- und Reparaturkarten sowie BCB"
description: "Vollständige V1.3.1-Anleitung: Kartenerstellung, GPT-/Nicht-GPT-Layouts, IDB/BCB und pre-loader/SPL/U-Boot."
translation_key: "087-rockchip-sd-card-boot"
slug: "087-rockchip-sd-card-boot"
lang: "de"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SD", "U-Boot", "BCB"]
keywords: "ArmSoM Rockchip SD boot GPT BCB RK3588"
excerpt: "Vollständige V1.3.1-Anleitung: Kartenerstellung, GPT-/Nicht-GPT-Layouts, IDB/BCB und pre-loader/SPL/U-Boot."
---

{% raw %}

# Rockchip-SD-Boot: Upgrade-, Boot- und Reparaturkarten sowie BCB

Plattformreferenz zur ArmSoM-Anpassung, vollständig auf Grundlage der einzigen bereitgestellten chinesischen Datei Rockchip_Developer_Guide_SD_Boot_CN.pdf (RK-KF-YF-171, V1.3.1, 17 Seiten). Ein englisches PDF fehlt; Englisch, Russisch und Deutsch wurden vollständig aus dem Chinesischen übersetzt. Alle Ausgaben verwenden chinesische Originalabbildungen; Deutsch verwendet exakt die englischen Bild-URLs. Das Produktversionsfeld der Vorlage ist leer; SDK/BSP- und Kernelversion sind nicht festgelegt. Abschnitt 4 nennt lediglich die IDB-/BCB-Unterstützung der SoCs, keine bestätigte Unterstützung aller ArmSoM-Boards. Board-SoC, SD-Verdrahtung und Versorgung, Boot-Priorität, SDK/BSP, pre-loader/SPL/U-Boot, Recovery und SDDiskTool prüfen. Es erfolgte keine Hardwarevalidierung; sämtliche Verfahren und Beispiele stammen aus der Vorlage, nicht aus ArmSoM-Tests.

Kartenerstellung und Upgrades überschreiben die ausgewählte SD-Karte bzw. den Gerätespeicher. Zuerst sichern und das Ziel prüfen. Es wurden weder Karten erstellt noch Datenträger formatiert oder aktualisiert. Die Screenshots mit v1.53 belegen nicht die Erfüllung der BCB-Anforderung v1.67.

[Redaktionelle Hinweise](/docs/rockchip-sd-card-boot/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## Überblick

Dieser Artikel beschreibt die SD-Kartennutzung bei Rockchip: Firmware-Erstellung, Karten für unterschiedliche Funktionen, Firmware-Verteilung auf der Karte und Boot-Ablauf. Er unterstützt die Fehlersuche bei der SD-Kartennutzung.

## 1. Kartentypen

Rockchip unterscheidet normale SD-Karten, Upgrade-Karten, Boot-Karten und Reparaturkarten. Das Rockchip-Werkzeug zur Erstellung von Upgrade-Datenträgern schreibt `update.img` auf die SD-Karte und erstellt damit den gewünschten Kartentyp.

<!-- Source CN PDF p.4: types -->

| Kartentyp | Funktion |
| --- | --- |
| Normale SD-Karte | Gewöhnliches Speichergerät |
| SD-Upgrade-Karte | Startet Recovery von SD; Recovery aktualisiert den Gerätespeicher mit der SD-Firmware |
| SD-Boot-Karte | Gerät startet direkt von SD |
| SD-Reparaturkarte | Kopiert Firmware ab pre-loader von SD in den Gerätespeicher |

## 2. Firmware erstellen

`update.img` ist Rockchips Paket für einen vollständigen Firmware-Satz. Es enthält neben der Firmware zusätzliche Daten wie Integritätsprüfungen und erleichtert die Aktualisierung der gesamten Firmware.

Rockchip stellt ein spezielles Werkzeug zur Erstellung von `update.img` bereit. Im Rockchip SDK das Verzeichnis `RKTools/linux/Linux_Pack_Firmware/rockdev/` öffnen, wie nachfolgend dargestellt.

![Verzeichnis zur Firmware-Paketierung — Chinesisches Original, PDF-S. 4](/docs/rockchip-sd-card-boot/assets/cn-p04.png)

*Verzeichnis zur Firmware-Paketierung — Chinesisches Original, PDF-S. 4*

```text
backupimage/
Image/
AFPTool.exe
baseparamer.img
mkupdate.bat
package-file
recover-script
RKImageMaker.exe
update.img
update-script
```

`package-file` anpassen, um das gewünschte `update.img` zu paketieren. Nachfolgend der Inhalt; der auf PDF-Seiten 4–5 verteilte Code wurde zusammengeführt.

```text
# NAME Relative path
#
#HWDEF HWDEF
package-file package-file
bootloader Image/MiniLoaderAll.bin
parameter Image/parameter.txt
uboot Image/uboot.img
trust Image/trust.img
misc Image/misc.img
resource Image/resource.img
kernel Image/kernel.img
boot Image/boot.img
#recovery Image/recovery.img
#system Image/system.img
#vendor Image/vendor.img
#oem Image/oem.img
# baseparamer Image/baseparamer.img
# 要写入backup分区的文件就是自身(update.img)
# SELF 是关键字,表示升级文件(update.img)自身
# 在生成升级文件时,不加入SELF文件的内容,但在头部信息中有记录
# 在解包升级文件时,不解包SELF文件的内容。
# RESERVED不打包backup
backup backupimage/backup.img
update-script update-script
recover-script recover-script
```

Die Codekommentare erläutern: SELF bezeichnet für backup die Upgrade-Datei `update.img` selbst. Beim Erzeugen wird ihr Inhalt nicht aufgenommen, jedoch im Header vermerkt; beim Entpacken wird SELF nicht extrahiert. RESERVED paketiert backup nicht.

Zum Hinzufügen einer Datei ihren Namen und Firmware-Pfad angeben. Ein `#` vor einem Eintrag schließt die betreffende Firmware aus. `mkupdate.bat` ausführen, um `update.img` zu erzeugen.

## 3. Werkzeug verwenden

### 3.1 Normale SD-Karten

Eine normale SD-Karte wird wie am PC verwendet. Sie dient in U-Boot und im Kernel als gewöhnlicher Speicher; eine Bearbeitung mit dem Werkzeug ist nicht erforderlich.

### 3.2 SD-Upgrade-Karten

Eine SD-Upgrade-Karte wird mit dem RK-Werkzeug erstellt und aktualisiert das System im lokalen Speicher, etwa eMMC oder NAND-Flash, ohne PC oder Netzwerk. Der Boot-Code wird in den reservierten Kartenbereich geschrieben, die Firmware auf die sichtbare Partition kopiert. Startet der Controller von der Karte, schreiben Boot- und Upgrade-Code die Firmware in den lokalen Hauptspeicher. Upgrade-Karten unterstützen außerdem PCBA-Tests und das Kopieren von Demo-Dateien. Das ermöglicht PC-unabhängige Updates und erhöht die Produktionseffizienz. Nachfolgend die Erstellungsschritte.

![Dialog zur Erstellung einer Upgrade-Karte — Chinesisches Original, PDF-S. 6](/docs/rockchip-sd-card-boot/assets/cn-p06.png)

*Dialog zur Erstellung einer Upgrade-Karte — Chinesisches Original, PDF-S. 6*

1. Den Wechseldatenträger auswählen.
2. Funktionsmodus wählen: Firmware-Upgrade.
3. Die zu installierende Firmware auswählen.
4. Auf „Erstellung starten“ klicken.

Die Konfiguration ist in der Abbildung dargestellt.

Die Abbildung dient als Konfigurationsreferenz. Existiert bereits eine Upgrade-Karte und müssen nur Firmware und Demo-Dateien aktualisiert werden, wie folgt vorgehen:

1. Die Firmware ins Stammverzeichnis der SD-Karte kopieren und in `sdupdate.img` umbenennen.
2. Demo-Dateien in das Verzeichnis `Demo` im Kartenstamm kopieren.

#### Upgrade-Karte — Nicht-GPT

<!-- Source CN PDF p.7: upgrade-non-gpt -->

| Offset | Datenbereich |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 64-4M | IDBLOCK(Boot-Kennzeichnung = 0) |
| 4M-8M | Parameter |
| 12M-16M | uboot |
| 16M-20M | trust |
| ...... | misc(BCB enthält recovery\n--rk_fwupdate\n) |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| Restlicher Platz | Fat32 enthält update.img |

#### Upgrade-Karte — GPT

<!-- Source CN PDF p.7: upgrade-gpt -->

| Offset | Datenbereich |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 1-34 | GPT-Partitionstabelle |
| Sektor 64-4M | IDBLOCK(Boot-Kennzeichnung = 0) |
| 4M-8M | Parameter |
| ...... | uboot |
| ...... | trust |
| ...... | misc |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| Restlicher Platz | Fat32 enthält update.img |

### 3.3 SD-Boot-Karten

Eine mit dem RK-Werkzeug erstellte Boot-Karte startet das Gerätesystem direkt von SD. Neu kompilierte Firmware lässt sich dadurch ohne Flashen des Gerätespeichers austauschen; die Karte kann auch als Hauptspeicher dienen. Hauptanwendungen sind SD-Boot und PCBA-Tests. PCBA-Tests sind lediglich eine Recovery-Funktion und sowohl mit Upgrade- als auch mit Boot-Karten möglich. Nachfolgend die Erstellungsschritte.

![Dialog zur Erstellung einer Boot-Karte — Chinesisches Original, PDF-S. 8](/docs/rockchip-sd-card-boot/assets/cn-p08.png)

*Dialog zur Erstellung einer Boot-Karte — Chinesisches Original, PDF-S. 8*

1. Den Wechseldatenträger auswählen.
2. Funktionsmodus wählen: SD-Boot.
3. Die zu installierende Firmware auswählen.
4. Auf „Erstellung starten“ klicken.

Die Konfiguration ist in der Abbildung dargestellt.

#### Boot-Karte — Nicht-GPT

<!-- Source CN PDF p.8: boot-non-gpt -->

| Offset | Datenbereich |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 64-4M | IDBLOCK(Boot-Kennzeichnung = 1) |
| 4M-8M | Parameter |
| 8M-12M | uboot |
| 12M-16M | trust |
| ...... | misc |
| ...... | resource |
| ...... | boot |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | user |

#### Boot-Karte — GPT

<!-- Source CN PDF p.9: boot-gpt -->

| Offset | Datenbereich |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 1-34 | GPT-Partitionstabelle |
| Sektor 64-4M | IDBLOCK(Boot-Kennzeichnung = 1) |
| ...... | uboot |
| ...... | Boot |
| ...... | trust |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | vendor |
| ...... | oem |
| ...... | user |
| Letzte 33 Sektoren | GPT-Sicherung |

### 3.4 SD-Reparaturkarten

Eine Reparaturkarte arbeitet ähnlich wie eine Upgrade-Karte; das Firmware-Update erfolgt jedoch im SD-Upgrade-Code des pre-loader (miniloader). Das Werkzeug schreibt zunächst Boot-Code in den reservierten Bereich und kopiert anschließend die Firmware auf die sichtbare Partition. Beim SD-Start aktualisiert der Upgrade-Code den lokalen Hauptspeicher. Dies dient vor allem der Reparatur von Geräten mit beschädigter Firmware. Nachfolgend die Erstellungsschritte.

![Dialog zur Erstellung einer Reparaturkarte — Chinesisches Original, PDF-S. 10](/docs/rockchip-sd-card-boot/assets/cn-p10.png)

*Dialog zur Erstellung einer Reparaturkarte — Chinesisches Original, PDF-S. 10*

1. Den Wechseldatenträger auswählen.
2. Funktionsmodus wählen: SD-Boot und Reparatur.
3. Die zu installierende Firmware auswählen.
4. Auf „Erstellung starten“ klicken.

Die Konfiguration ist in der Abbildung dargestellt.

#### Reparaturkarte — Nicht-GPT

<!-- Source CN PDF p.11: repair-non-gpt -->

| Offset | Datenbereich |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 64-4M | IDBLOCK(Boot-Kennzeichnung = 2) |
| 4M-8M | Parameter |
| 8M-12M | uboot |
| 12M-16M | trust |
| ...... | misc |
| ...... | resource |
| ...... | boot |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | user |

#### Reparaturkarte — GPT

<!-- Source CN PDF p.11: repair-gpt -->

| Offset | Datenbereich |
| --- | --- |
| Sektor 0 | MBR |
| Sektor 1-34 | GPT-Partitionstabelle |
| Sektor 64-4M | IDBLOCK(Boot-Kennzeichnung = 2) |
| ...... | uboot |
| ...... | Boot |
| ...... | trust |
| ...... | resource |
| ...... | kernel |
| ...... | recovery |
| ...... | system |
| ...... | vendor |
| ...... | oem |
| ...... | user |
| Letzte 33 Sektoren | GPT-Sicherung |

## 4. Kartenkennzeichnungen

SD-Karten enthalten Kennzeichnungen für ihre Funktion. Die magische Zahl `0xFCDC8C3B` am Anfang von Sektor 64 kennzeichnet eine spezielle Karte, deren Firmware zum Gerätestart gelesen wird; andernfalls gilt sie als normale Karte. Bei „Sektor 64 + 616bytes“ liegt die Kartentypkennung mit drei möglichen Werten:

<!-- Source CN PDF p.12: flags -->

| Kennzeichnung | Kartentyp |
| --- | --- |
| 0 | Upgrade- oder PCBA-Testkarte |
| 1 | Boot-Karte |
| 2 | Reparaturkarte |

Das Schreiben eines idb block flag hat folgende Nachteile:

- Es ist eine RK-spezifische, inkompatible Lösung.
- Es besteht ein Sicherheitsproblem: Das Schreiben der Kennzeichnung bei der Kartenerstellung verletzt die Integrität des idb block.
- Neuere idb blocks reservieren keinen Platz dafür. Eine Reservierung würde weiterhin die genannten Probleme verursachen.

RK verwendet stattdessen Android BCB und trägt `recovery\n--rk_fwupdate\n` in dessen recovery-Feld als Kennzeichnung für ein SD-Upgrade ein. Die Unterstützung beider Verfahren ist nachfolgend aufgeführt.

<!-- Source CN PDF p.12: platforms -->

| Plattform | idb block flag | Android BCB |
| --- | --- | --- |
| rk3588 |  | ✓ |
| rk3568/rk3566 |  | ✓ |
| rv1126/rv1109 | ✓ | ✓ |
| rk3399 | ✓ | ✓ |
| rk3368 | ✓ | ✓ |
| rk3328 | ✓ | ✓ |
| rk3326 | ✓ | ✓ |
| rk3308 | ✓ | ✓ |
| rk3288 | ✓ | ✓ |
| rk3229 | ✓ | ✓ |
| rk3128 | ✓ | ✓ |
| rk3126 | ✓ | ✓ |

Mit Plattform- und Werkzeugaktualisierungen soll das Schreiben des idb block flag schrittweise entfallen. **Das Android-BCB-Verfahren erfordert SDDiskTool v1.67 oder neuer.**

## 5. Analyse des Boot-Ablaufs

Der SD-Boot-Ablauf umfasst pre-loader/SPL und U-Boot. Sowohl pre-loader als auch U-Boot erkennen die SD-Karte und prüfen das Startup Flag in ihrem IDB Block, um die entsprechende Funktion auszuführen. SPL gibt der SD-Karte dagegen die höchste Boot-Priorität: Enthält sie bootfähige Firmware, wird diese bevorzugt geladen und gestartet.

### 5.1 Boot-Ablauf des pre-loader

![Originalablauf des pre-loader — Chinesisches Original, PDF-S. 13](/docs/rockchip-sd-card-boot/assets/cn-p13.png)

*Originalablauf des pre-loader — Chinesisches Original, PDF-S. 13*

Kopierbare Erläuterung: maskrom → pre-loader → Speichergeräte suchen. Ohne SD-Karte oder bei einer anderen magischen Zahl als `0xFCDC8C3B` in Sektor 64 erfolgt der normale Start. Andernfalls entscheidet die Kennzeichnung bei „Sektor 64 + 616bytes“: 0 für Upgrade-/PCBA-Testkarte, 1 für Boot-Karte. Beide lesen Firmware von SD und starten UBOOT. Bei 2 handelt es sich um eine Reparaturkarte; die Firmware wird im Loader aktualisiert.

### 5.2 SPL-Boot-Ablauf

![Aus der Vektorvorlage extrahierter SPL-Ablauf — Chinesisches Original, PDF-S. 14](/docs/rockchip-sd-card-boot/assets/cn-p14.png)

*Aus der Vektorvorlage extrahierter SPL-Ablauf — Chinesisches Original, PDF-S. 14*

Start → SPL → Speichergeräte suchen. Ohne SD-Karte werden andere Speichergeräte gesucht. Dasselbe gilt bei vorhandener SD-Karte ohne bootfähige Firmware. Ist bootfähige Firmware vorhanden, die nächste Stufe starten → End.

### 5.3 U-Boot-Ablauf

![U-Boot-Ablauf, erster Teil — Chinesisches Original, PDF-S. 16](/docs/rockchip-sd-card-boot/assets/cn-p16.png)

*U-Boot-Ablauf, erster Teil — Chinesisches Original, PDF-S. 16*

![U-Boot-Ablauf, Fortsetzung auf der nächsten PDF-Seite — Chinesisches Original, PDF-S. 17](/docs/rockchip-sd-card-boot/assets/cn-p17.png)

*U-Boot-Ablauf, Fortsetzung auf der nächsten PDF-Seite — Chinesisches Original, PDF-S. 17*

Knoten und Verzweigungen der Abbildung:

1. Start → Uboot → Speichergeräte suchen. Ohne SD werden andere Speichergeräte geprüft.
2. Mit SD prüfen, ob die magische Zahl am Anfang von Sektor 64 `0xFCDC8C3B` ist. Falls ja, prüfen, ob die Kennzeichnung bei 616bytes gleich 0 ist; andernfalls andere Speichergeräte prüfen.
3. Bei einer anderen Zahl als `0xFCDC8C3B` auf `0x534e4b52` oder `0x534e5252` prüfen. Trifft keines zu, andere Speichergeräte prüfen.
4. Bei alter magischer Zahl und Kennzeichnung 0 oder einer der neuen Zahlen SD als aktuelles Gerät setzen.
5. `sdfwupdate` zu cmdline hinzufügen → Recovery-Boot-Modus aus misc ermitteln → prüfen, ob recovery im BCB `recovery\n--rk_fwupdate\n` entspricht. Andernfalls andere Speichergeräte prüfen.
6. Bei Übereinstimmung fügt die Fortsetzung erneut `sdfwupdate` zu cmdline hinzu, lädt Recovery und wechselt in den Recovery-Modus → End. Der doppelte Knoten bleibt wie in der Vorlage erhalten; das tatsächliche Verhalten anhand des verwendeten U-Boot-Zweigs prüfen.

### 5.4 recovery und PCBA

Für Einzelheiten verweist die Vorlage auf `Rockchip Recovery 用户操作指南 V1.03.pdf` (Rockchip-Recovery-Benutzerhandbuch). Dieses Dokument gehörte nicht zu den Eingabedateien dieses Artikels.

## 6. Wichtige Hinweise

1. Für das Nicht-GPT-Format benötigt U-Boot `CONFIG_RKPARM_PARTITION`.
2. Bei Erstellung einer Upgrade-Karte muss `update.img` die Dateien `MiniloaderAll.bin`, `parameter.txt`, `uboot.img`, `trust.img`, `misc.img`, `resource.img` und `recovery.img` enthalten. Andernfalls wird beim Flashen ein Fehler beim Schreiben des MBR gemeldet. `MiniloaderAll.bin` unterscheidet sich in der Groß-/Kleinschreibung von `MiniLoaderAll.bin` in Abschnitt 2. Beide Schreibweisen der Vorlage bleiben erhalten; den tatsächlichen Dateinamen prüfen.

{% endraw %}
