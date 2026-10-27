---
title: "Rockchip-Parameter-Dateiformat 1.4: Felder, GPT und traditionelle Partitionen"
description: "Rockchip-Parameter-Dateiformat 1.4: Felder, GPT und traditionelle Partitionen"
excerpt: "Rockchip-Parameter-Dateiformat 1.4: Felder, GPT und traditionelle Partitionen"
translation_key: "238-rockchip-parameter-file-format"
slug: "238-rockchip-parameter-file-format"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "parameter", "GPT", "Android"]
---

{% raw %}

# Rockchip-Parameter-Dateiformat 1.4: Felder, GPT und traditionelle Partitionen

Plattformreferenz für ArmSoM auf Basis des einzigen chinesischen Originals Rockchip Parameter File Format 1.4 (2018.1, 5 Seiten), dessen technischer Inhalt vollständig übernommen wird. Eine englische Quelle liegt nicht vor; Englisch, Russisch und Deutsch sind Übersetzungen aus dem Chinesischen. Alle vier verwenden dessen zwei Originalabbildungen. Keine Hardwarevalidierung oder Zusage für andere SoCs beziehungsweise ArmSoM-Platinen. SDK, Bootkette, Speichermedium und Platinenlayout prüfen. Flashen und Neupartitionieren können Daten löschen: vorher sichern.

Interne Quellabweichungen: Abschnitt 3.6 nennt ATAG `0x60000800`, beide Screenshots `0x00200800`. Überschrift 3.7 nennt MACHINE `3226`, Screenshots und RK3326-Liste dagegen `3326`. Beide Angaben bleiben ausdrücklich erhalten, ohne vorgetäuschte Validierung. `updata.img` ist Quellschreibweise; tatsächlichen SDK-Paketnamen prüfen. MB/KB bleiben erhalten, Partitionsberechnungen verwenden 512 Bytes/sector. GPT-Bildadressen unterscheiden sich vom späteren traditionellen Beispiel und dürfen nicht vermischt werden. `androidboot.selinux=permissive` im Bild ist ein historisches Beispiel, keine Sicherheitsempfehlung für die Produktion.

## 1. Überblick

Rockchip-Android-Plattformen konfigurieren mit der parameter-Datei unter anderem Firmwareversion und Speicherpartitionen. Diese kritische Konfiguration nur nach Verständnis aller Felder ändern; fehlerhafte Einstellungen können den Systembetrieb verhindern. Die Datei darf 64KB nicht überschreiten.

Die Quelle nennt unter anderem RK3066, RK3168, RK3188, RK3288, RK312X, RK3036, RK3399, RK3368, RK322X, RK3328 und RK3326.

## 2. Beispiele der parameter-Datei

Die Originalabbildungen zeigen GPT und traditionelle cmdline-Partitionierung. Dateien unterscheiden sich je nach Projekt und Plattform; erläutert werden die RK3326-Referenzdefinitionen. Der Bildcode ist zusätzlich transkribiert; umgebrochene CMDLINE-Texte wurden zu logischen Zeilen verbunden.

![Abbildung 1: GPT-Partitionierung](/docs/rockchip-parameter-file-format/assets/cn-p002-figure-01.png)

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER:rk3326
MAGIC:0x5041524B
ATAG:0x00200800
MACHINE:3326
CHECK_MASK:0x80
TYPE:GPT
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(misc),0x00008000@0x0000a000(resource),0x00010000@0x00012000(kernel),0x00010000@0x00022000(boot),0x00020000@0x00032000(recovery),0x00038000@0x00052000(backup),0x00002000@0x0008a000(security),0x00100000@0x0008c000(cache),0x00400000@0x0018c000(system),0x00008000@0x0058c000(metadata),0x00080000@0x00594000(vendor),0x00080000@0x00614000(oem),0x00000400@0x00694000(frp),-@0x00694400(userdata:grow)
```

![Abbildung 2: traditionelle cmdline-Partitionierung](/docs/rockchip-parameter-file-format/assets/cn-p002-figure-02.png)

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER:rk3326
MAGIC:0x5041524B
ATAG:0x00200800
MACHINE:3326
CHECK_MASK:0x80
CMDLINE:console=ttyFIQ0 androidboot.baseband=N/A androidboot.selinux=permissive androidboot.veritymode=/dev/block/rknand_metadata androidboot.hardware=rk30board androidboot.console=ttyFIQ0 init=/init initrd=0x62000000,0x00800000 mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),0x00002000@0x00006000(misc),0x00008000@0x00008000(resource),0x00010000@0x00010000(kernel),0x00010000@0x00020000(boot),0x00020000@0x00030000(recovery),0x00038000@0x00050000(backup),0x00002000@0x00088000(security),0x00100000@0x0008a000(cache),0x00400000@0x0018a000(system),0x00008000@0x0058a000(metadata),0x00080000@0x00592000(vendor),0x00080000@0x00612000(oem),0x00000400@0x00692000(frp),-@0x00692400(userdata)
```

## 3. Beschreibung der Felder

### 3.1. `FIRMWARE_VER:8.1`

Firmwareversion, verwendet beim Packen des in der Quelle `updata.img` genannten Images. Das Upgrade-Werkzeug erkennt daran die Firmwareversion.

### 3.2. `MACHINE_MODEL:RK3326`

Gerätemodell beim Packen von `updata.img`. Projekte können es für die Anzeige im Upgrade-Werkzeug anpassen. Bei Recovery-Updates kann es zur Kompatibilitätsprüfung dienen.

### 3.3. `MACHINE_ID:007`

Produktentwicklungs-ID aus Buchstaben und Ziffern, verwendet beim Packen von `updata.img`. Unterschiedliche Projekt-IDs identifizieren Modelle und können bei Recovery-Updates die Firmwarezuordnung prüfen.

### 3.4. `MANUFACTURER: rk3326`

Herstellerinformation beim Packen von `updata.img`; für die Anzeige im Upgrade-Werkzeug anpassbar.

### 3.5. `MAGIC: 0x5041524B`

MAGIC-Wert nicht ändern. Manche neueren APs verwenden DTS und benötigen dieses Feld nicht mehr; aus Kompatibilitätsgründen dennoch weder löschen noch ändern.

### 3.6. `ATAG: 0x60000800`

ATAG nicht ändern. Manche neueren APs verwenden DTS und benötigen das Feld nicht mehr; aus Kompatibilitätsgründen unverändert beibehalten.

### 3.7. `MACHINE: 3226`

Zur Kernelidentifikation; muss zum Kernel passen und darf nicht beliebig geändert werden. Die Quellcodes stehen unten.

```text
RK29xx: MACHINE:2929
RK292x: MACHINE:2928
RK3066: MACHINE:3066
RK3326: MACHINE:3326
```

### 3.8. `CHECK_MASK: 0x80`

Reserviertes Feld; nicht ändern.

### 3.9. `TYPE: GPT`

Legt fest, dass die CMDLINE-Partitionsdefinitionen zum Erstellen von GPT dienen. Laut Quelle wird in diesem Modus die parameter-Datei selbst nicht in NVM wie NAND oder EMMC geflasht.

### 3.10. CMDLINE

`console=ttyFIQ0 androidboot.console=ttyFIQ0` definiert die serielle Konsole.

Bei `initrd=0x62000000,0x00800000` ist der erste Wert die SDRAM-Ladeadresse von boot.img, der zweite die ramdisk-Größe. Laut damaliger Quelle war deren Größe nicht begrenzt.

`androidboot.xxx` wird beim Android-Start verwendet; manche Plattformen definieren es im Kernel-DTS. Normalerweise die Vorgaben des veröffentlichten SDK beibehalten.

#### MTD-Partitionsdefinitionen

```text
mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),0x00002000@0x00006000(misc),0x00008000@0x00008000(resource),0x00010000@0x00010000(kernel),0x00010000@0x00020000(boot),0x00020000@0x00030000(recovery),0x00038000@0x00050000(backup),0x00002000@0x00088000(security),0x00100000@0x0008a000(cache),0x00400000@0x0018a000(system),0x00008000@0x0058a000(metadata),0x00080000@0x00592000(vendor),0x00080000@0x00612000(oem),0x00000400@0x00692000(frp),-@0x00692400(userdata)
```

1. Aus Kompatibilitätsgründen verwenden die beschriebenen RK-APs den Bezeichner `rk29xxnand`.

2. In `0x00002000@0x00008000(boot)` steht vor `@` die Größe, dahinter die Startposition, in Klammern der Name. Einheit: sector; 1 sector = 512 Bytes. boot beginnt bei 0x8000 sectors und umfasst 0x2000 sectors, laut Quelle 4MB (binär 4 MiB).

3. Für die Leistung müssen Partitionsanfänge an 32KB (64 sectors) ausgerichtet und Größen Vielfache von 32KB sein.

4. Updates mit sparse-Images löschen Daten. Für bessere Kompatibilität die betreffenden Partitionen an 4MB ausrichten und Größen als Vielfache von 4MB wählen.

5. Im GPT-Modus sind parameter-Adressen tatsächliche logische Blockadressen (LBA). uboot bei 0x4000 wird auf EMMC und NAND an 0x4000 geschrieben. Die letzte Partition muss grow angeben, damit das Werkzeug ihr den gesamten verbleibenden Platz zuweist.

| Name | Parameter-Adresse | Logische EMMC-Adresse | Logische NAND-Adresse | Größe |
| --- | --- | --- | --- | --- |
| GPT | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| Reserviert | -- | 0x2000 | 0x2000 | 4MB |
| UBOOT | 0x4000 | 0x4000 | 0x4000 | 4MB |
| TRUST | 0x6000 | 0x6000 | 0x6000 | 4MB |

6. Traditionelles cmdline reserviert die ersten 0–4MB von EMMC für loader. Daher zu parameter-Adressen 4MB (0x2000 sectors) addieren. uboot mit Definition 0x2000 wird auf EMMC bei 0x4000 geschrieben, wie im GPT-Beispiel. NAND verwendet aus Altprodukt-Kompatibilität den definierten Wert direkt: 0x2000 wird bei 0x2000 geschrieben, anders als im GPT-Beispiel.

| Name | Parameter-Adresse | Logische EMMC-Adresse | Logische NAND-Adresse | Größe |
| --- | --- | --- | --- | --- |
| Reserviert | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| parameter | -- | 0x2000 | 0x0 | 4MB |
| UBOOT | 0x2000 | 0x4000 | 0x2000 | 4MB |
| TRUST | 0x4000 | 0x6000 | 0x4000 | 4MB |

NAND-FLASH-Geräte können loader bei 0x40 im selben 4MB-Bereich wie parameter speichern. Laut Quelle liegen die gültigen Daten versetzt und überschreiben sich nicht. Beliebige eigene Layouts sind dadurch nicht automatisch sicher.

## 4. Häufige Probleme und Lösungen

Seite 5 enthält nur diese Überschrift, ohne Fragen oder Antworten. Fehlender Inhalt wurde nicht erfunden.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
