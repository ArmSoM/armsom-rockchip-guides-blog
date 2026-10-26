---
title: "Rockchip-Produktionsfirmware: USB, SD, Programmiergeräte und Fehlersuche"
description: "Rockchip-Produktionsfirmware: USB, SD, Programmiergeräte und Fehlersuche — V1.2.3"
excerpt: "Rockchip-Produktionsfirmware: USB, SD, Programmiergeräte und Fehlersuche"
translation_key: 147-rockchip-firmware-production
slug: 147-rockchip-firmware-production
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: production
products: []
tags: [ArmSoM, Rockchip, FactoryTool, firmware, production]
---

{% raw %}

# Rockchip-Produktionsfirmware: USB, SD, Programmiergeräte und Fehlersuche

Chinesische und englische Quelle sind V1.2.3. Produktionsverfahren, Werkzeugschritte und Fehlersuche bleiben vollständig erhalten. Quellbereich: RK3326/RK3399/RK3368/RK3288 mit Linux 4.4/4.19; für RK3328 zusätzlich Linux 3.10. Nur ArmSoM-Plattformreferenz: Platine, SDK/BSP, Loader, Werkzeugversion und Speicher prüfen. Kein Flashen, Löschen, Aus-/Einschalten oder Hardwaretest durchgeführt.

> Flashen, Erstellen von Aktualisierungsmedien und Löschen von Flash überschreiben Daten. Ziel, Loader, Abbild und Versorgung prüfen und sichern; Beispiele nicht direkt auf Produktionsgeräten ausführen.

Chinesisch verwendet chinesische, EN/RU/DE die entsprechenden englischen Bilder. Zwei chinesische Bilder zum IDB-Vorbereitungsfehler sind im englischen Original zusammengefasst; die jeweilige Anordnung bleibt erhalten. Screenshot-Befehle sind zusätzlich als kopierbarer Quelltext transkribiert.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip tools](https://github.com/rockchip-linux/rkdeveloptool)

## 1. Verfahren zum Produktions-Flashen

### 1.1 USB-Aktualisierung

1. update.img-Aktualisierungsfirmware erstellen.
2. Geräte mit FactoryTool in Serie flashen.

### 1.2 SD-Aktualisierung

1. update.img erstellen.
2. Mit SD_Firmware_Tool eine SD-Aktualisierungskarte erstellen.
3. Karte einlegen und die Versorgung neu einschalten, um die Firmware zu flashen.

### 1.3 Aktualisierung mit Programmiergerät

1. update.img erstellen.
2. Mit SpiImageTool Programmierdateien erstellen.
3. Speicherchip mit dem Programmiergerät verbinden und flashen.

## 2. Werkzeugbedienung

### 2.1 Serien-Flashen mit FactoryTool

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p004-figure-01.png)

*Werkzeug-Screenshot der englischen Quelle*

Ablauf:
1. Firmware anklicken und Aktualisierungsfirmware wählen.
2. Optional Demo aktivieren und ein Demo-Abbild wählen; Erstellung siehe OemTool.
3. Start anklicken, um Geräte automatisch zu erkennen.
4. Geräte verbinden; nach Erkennung beginnt die Aktualisierung automatisch.

### 2.2 OemTool: Demo-Abbild erstellen

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p005-figure-01.png)

*Werkzeug-Screenshot der englischen Quelle*

Schritte zur Demo-Abbilderstellung:

1. Select... anklicken und das Demo-Verzeichnis wählen.

2. Fat32 aktivieren; derzeit werden nur Fat32-Abbilder unterstützt.

3. Disk Size größer als die user-Partitionskapazität und auf 100M ausgerichtet einstellen.

4. Start anklicken; nach Erfolg liegt OemImage.img im Werkzeugverzeichnis.

### 2.3 SD_Firmware_Tool: SD-Aktualisierungskarten

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p006-figure-01.png)

*Werkzeug-Screenshot der englischen Quelle*

Erstellen der SD-Aktualisierungskarte:

1. Ziel-SD-Karte oder USB-Laufwerk aus der Liste wählen.

2. Firmware Upgrade aktivieren.

3. Select Firmware anklicken und update.img wählen.

4. Create anklicken.

### 2.4 SpiImageTool: Programmiergeräte-Abbilder

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p006-figure-02.png)

*Werkzeug-Screenshot der englischen Quelle*

Erstellen der Programmiergeräte-Abbilder:

1. Select Firmware anklicken und update.img wählen.

2. Bei Emmc Reserve Data Area aktivieren.

3. Leerbereiche bei Emmc mit 0, bei nandflash mit 0xFF füllen.

4. Generate File anklicken. Bei Erfolg entstehen boot0.bin und data.bin. Emmc benötigt nur data.bin, nandflash beide Dateien.

## 3. Aktualisierungsfirmware erstellen

### 3.1 Schritte

1. Im Android-Quellverzeichnis mkimage.sh mit dem Argument ota ausführen, um system.img, boot.img, recovery.img usw. zu erzeugen. Nach rockdev/image kopieren.

2. In AndroidTool/rockdev mkupdate.bat zum Erzeugen von update.img ausführen; unter Ubuntu mkupdate.sh. Der Screenshot zeigt mkupdate.bat:

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p007-figure-01.png)

*Werkzeug-Screenshot der englischen Quelle*

```bat
Afptool -pack ./ Image\update.img
RKImageMaker.exe -RK31 RK3188Loader(L)_V2.10.bin Image\update.img update.img -os_type:androidos
```

Besonders -RK31 beachten: Es muss zum Gerät passen. Falls unbekannt, AndroidTool öffnen, Advanced Functions wählen, die Loader-Datei der Plattform auswählen und Download anklicken.

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p007-figure-02.png)

*Werkzeug-Screenshot der englischen Quelle*

Unten Read Chip Info anklicken. Rechts erscheinen die Informationen; Image Chip Flag ist der gesuchte Parameter.

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p007-figure-03.png)

*Werkzeug-Screenshot der englischen Quelle*

## 4. Programmiergerät konfigurieren

### 4.1 EMMC-Programmierdaten

EMMC besitzt USER-, BOOT1- und BOOT2-Bereiche. Nur USER muss mit der von SpiImageTool erzeugten data.bin programmiert werden.

### 4.2 EMMC-EXT_CSD-Einstellungen

Alle Standardwerte verwenden; keine Konfiguration erforderlich.

```text
EXT_CSD[167] = 0x1f（默认值）

EXT_CSD[162] = 0x0 (默认值)

EXT_CSD[177] = 0x0 (默认值)

EXT_CSD[178] = 0x0 (默认值)

EXT_CSD[179] = 0x0 (默认值)
```

## 5. Häufige Aktualisierungsprobleme

### 5.1 Boot-Download fehlgeschlagen: Fall 1

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p008-figure-01.png)

*Werkzeug-Screenshot der englischen Quelle*

Protokollmeldung:

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p009-figure-01.png)

*Werkzeug-Screenshot der englischen Quelle*

Mögliche Ursachen:

1. Schlechtes USB-Signal: Kondensator-/Widerstandswerte der USB-Leitung und USB-Versorgung prüfen.

2. Fehlerhafte Lötstellen am Hauptcontroller oder Versorgungsprobleme.

### 5.2 Boot-Download fehlgeschlagen: Fall 2

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p009-figure-02.png)

*Werkzeug-Screenshot der englischen Quelle*

Mögliche Ursache: DDR-Bausteine oder Leiterbahnführung.

### 5.3 IDB-Vorbereitung fehlgeschlagen

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p009-figure-03.png)

*Werkzeug-Screenshot der englischen Quelle*

Mögliche Ursache: schlechte Flash-Lötstellen oder nicht unterstützter Baustein.

### 5.4 IDB-Download fehlgeschlagen

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p010-figure-01.png)

*Werkzeug-Screenshot der englischen Quelle*

Mögliche Ursachen:

1. USB-Kommunikationsproblem: Versorgung aus-/einschalten und erneut versuchen; aktiven USB-Hub verwenden.

2. DDR-Stabilitätsproblem: Stabilität mit dem DDR-Testwerkzeug prüfen.

### 5.5 Firmware-Download fehlgeschlagen

![Werkzeug-Screenshot der englischen Quelle](/docs/rockchip-firmware-production/assets/en-p010-figure-02.png)

*Werkzeug-Screenshot der englischen Quelle*

Mögliche Ursachen:

1. USB-Kommunikationsproblem: Versorgung aus-/einschalten und erneut versuchen; aktiven USB-Hub verwenden.

2. Flash-Problem: Flash mit AndroidTool löschen und erneut versuchen.

{% endraw %}
