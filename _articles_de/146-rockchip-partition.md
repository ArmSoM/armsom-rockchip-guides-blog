---
title: "Rockchip-Partitionen: vollständiger Leitfaden zu Parameter, GPT, CMDLINE und Flash-Adressen"
description: "Rockchip-Partitionen: vollständiger Leitfaden zu Parameter, GPT, CMDLINE und Flash-Adressen — V1.5.1"
excerpt: "Rockchip-Partitionen: vollständiger Leitfaden zu Parameter, GPT, CMDLINE und Flash-Adressen"
translation_key: 146-rockchip-partition
slug: 146-rockchip-partition
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: storage
products: []
tags: [ArmSoM, Rockchip, GPT, CMDLINE, parameter]
---

{% raw %}

# Rockchip-Partitionen: vollständiger Leitfaden zu Parameter, GPT, CMDLINE und Flash-Adressen

Chinesische und englische Quelle tragen V1.5.1. Technischer Text und alle Tabellen bleiben erhalten. ArmSoM-Plattformreferenz: SoC, SDK/BSP, U-Boot, Kernel, Speicher und bestehende Partitionstabelle prüfen; keine universelle Gültigkeit für alle Platinen. Quellbeispiel ist RK3326. Keine Flash-/Partitionierungsbefehle oder Hardwaretests ausgeführt. Beide Quellen enthalten keine separaten technischen Abbildungen.

> Quelldifferenzen bleiben erhalten: ATAG im Beispiel 0x00200800, in Abschnitt 2.6 jedoch 0x60000800; Abschnitt 2.7 nennt MACHINE:3226, Vorschau und Tabelle dagegen 3326. Die Quellschreibweise updata.img bleibt unverändert. Flashen oder Neupartitionieren kann Daten löschen; zuerst prüfen und sichern.

Technisches Vorwort: Rockchip Android verwendet parameter für Firmwareversion, Speicherpartitionen und weitere Einstellungen. Diese wichtige Datei nur mit Verständnis aller Felder ändern; fehlerhafte Konfiguration kann den Systembetrieb verhindern. Maximalgröße: 64KB.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip tools](https://github.com/rockchip-linux/rkdeveloptool)

## 1. Vorschau der Parameter-Datei

Die Parameter-Datei definiert hauptsächlich die Partitionstabelle. Unterstützt werden GPT und herkömmliche CMDLINE-Partitionen. Der Inhalt unterscheidet sich nach Projekt und Plattform. Dieses Handbuch verwendet RK3326-Beispiele. RK3326-GPT-Parameterdefinition:

```text
FIRMWARE_VER:9.0
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(misc),0x00002000@0x0000a000(dtb),0x00002000@0x0000c000(dtbo),0x00000800@0x0000e000(vbmeta),0x00010000@0x0000e800(boot),0x00030000@0x0001e800(recovery),0x00028000@0x0004e800(backup),0x00002000@0x00076800(security),0x00070000@0x00078800(cache),0x002d0000@0x000e8800(system),0x00008000@0x003b8800(metadata),0x00070000@0x003c0800(vendor),0x00020000@0x00430800(oem),0x00000400@0x00450800(frp),-@0x00450c00(userdata:grow)
uuid:system=af01642c-9b84-11e8-9b2a-234eb5e198a0
```

RK3326-Parameterdefinition für herkömmliche CMDLINE-Partitionen:

```text
FIRMWARE_VER:9.0
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
CMDLINE:console=ttyFIQ0 androidboot.console=ttyFIQ0 initrd=0x62000000,0x00800000 mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(misc),0x00002000@0x0000a000(dtb),0x00002000@0x0000c000(dtbo),0x00000800@0x0000e000(vbmeta),0x00010000@0x0000e800(boot),0x00030000@0x0001e800(recovery),0x00028000@0x0004e800(backup),0x00002000@0x00076800(security),0x00070000@0x00078800(cache),0x002d0000@0x000e8800(system),0x00008000@0x003b8800(metadata),0x00070000@0x003c0800(vendor),0x00020000@0x00430800(oem),0x00000400@0x00450800(frp),-@0x00450c00(userdata)
```

Wesentliche Unterschiede der Parameter-Datei für GPT gegenüber herkömmlicher Partitionierung: TYPE: GPT definieren.

Der letzten Partition grow hinzufügen, beispielsweise userdata:grow. UUID für system oder rootfs festlegen, etwa uuid:system=af01642c-9b84-11e8-9b2a-234eb5e198a0. Die Parameter-Datei selbst wird nicht in NVM (EMMC, NAND usw.) geschrieben; verwendet werden nur mtdparts-Partitionsdefinitionen und UUID. Andere Angaben dienen der Kompatibilität mit Aktualisierungswerkzeugen.

## 2. Dateiinhalt

### 2.1 FIRMWARE_VER:9.0

| Eintrag | FIRMWARE_VER |
| --- | --- |
| Typ | Dezimal, Format X.X |
| Wert | 0 - 255 |
| Beschreibung | Wird beim Erstellen von updata.img verwendet; das Aktualisierungswerkzeug erkennt daran die Firmwareversion. |

### 2.2 MACHINE_MODEL:RK3326

| Eintrag | MACHINE_MODEL |
| --- | --- |
| Typ | Zeichenfolge |
| Länge | 255 (maximal) |
| Beschreibung | Gerätemodell für updata.img. Für verschiedene Projekte änderbar; wird im Aktualisierungswerkzeug angezeigt. Bei recovery-Updates kann damit die Übereinstimmung von Firmware und Gerät geprüft werden. |

### 2.3 MACHINE_ID:007

| Eintrag | MACHINE_ID |
| --- | --- |
| Typ | Zeichenfolge |
| Länge | 255 (maximal) |
| Beschreibung | Produktentwicklungs-ID aus Zeichen und Ziffern für updata.img. Unterschiedliche Projekte verwenden unterschiedliche IDs zur Modellidentifizierung. Bei recovery-Updates lässt sich damit die Firmwarezuordnung prüfen. |

### 2.4 MANUFACTURER:rk3326

| Eintrag | MANUFACTURER |
| --- | --- |
| Typ | Zeichenfolge |
| Länge | 255 (maximal) |
| Beschreibung | Herstellerangabe für updata.img; änderbar und im Aktualisierungswerkzeug sichtbar. |

### 2.5 MAGIC:0x5041524B

| Eintrag | MAGIC |
| --- | --- |
| Typ | Hexadezimalzahl |
| Wert | 0x5041524B (fest) |
| Beschreibung | MAGIC-Kennung, nicht ändern. Einige neuere APs verwenden DTS und benötigen das Feld nicht; aus Kompatibilitätsgründen dennoch unverändert lassen. |

### 2.6 ATAG:0x60000800

| Eintrag | ATAG |
| --- | --- |
| Typ | Hexadezimalzahl |
| Wert | 32-Bit-DDR-Adresse |
| Beschreibung | DDR-Speicheradresse für ATAG. Einige neuere APs verwenden DTS und benötigen das Feld nicht; aus Kompatibilitätsgründen nicht entfernen oder ändern. |

### 2.7 MACHINE:3226

| Eintrag | MACHINE |
| --- | --- |
| Typ | Zeichenfolge |
| Länge | 255 (maximal) |
| Beschreibung | Zur Kernel-Identifizierung; nicht ändern, die Definition muss zum Kernel passen. |

Werte für einige Plattformen:

| Chip | MACHINE |
| --- | --- |
| RK29xx | 2929 |
| RK292X | 2928 |
| RK3066 | 3066 |
| RK3126C | 3126c |
| RK3326 | 3326 |
| RK3399 | 3399 |
| RK3308 | 3308 |

### 2.8 CHECK_MASK:0x80

| Eintrag | CHECK_MASK |
| --- | --- |
| Typ | Hexadezimalzahl |
| Wert | 0x80 (fest) |
| Beschreibung | Reserviert; nicht ändern. |

### 2.9 TYPE:GPT

Kennung der GPT-Partitionstabelle. Das Flash-Werkzeug erstellt GPT anhand der CMDLINE-Partitionen. Die Parameter-Datei wird nicht in NVM-Speicher (NAND, EMMC usw.) geschrieben.

### 2.10 CMDLINE:

console=ttyFIQ0 androidboot.console=ttyFIQ0 definiert die serielle Konsole. Bei initrd=0x62000000,0x00800000 ist der erste Wert die DDR-Ladeadresse der RAMDISK und der zweite deren Größe; laut Quelle besteht derzeit keine Größenbeschränkung. androidboot.xxx-Angaben werden beim Android-Start verwendet und auf manchen Plattformen im Kernel-DTS definiert. Normalerweise die Vorgaben des veröffentlichten SDK unverändert lassen. MTD-Partitionsdefinition:

```text
mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),0x00002000@0x00006000(misc),0x00008000@0x00008000(resource),0x00010000@0x00010000(kernel),0x00010000@0x00020000(boot),0x00020000@0x00030000(recovery),0x00038000@0x00050000(backup),0x00002000@0x00088000(security),0x00100000@0x0008a000(cache),0x00400000@0x0018a000(system),0x00008000@0x0058a000(metadata),0x00080000@0x00592000(vendor),0x00080000@0x00612000(oem),0x00000400@0x00692000(frp),-@0x00692400(userdata)
```

Hinweise zur Partitionsdefinition:

1. Aus Kompatibilitätsgründen verwenden alle APs rk29xxnand als Kennung.

2. Bei 0x00002000@0x00008000(boot) bezeichnet der Wert vor @ die Größe, der danach den Beginn und die Klammer den Namen. Alle Werte gelten in Sektoren zu 512Bytes. boot beginnt bei Sektor 0x8000 und umfasst 0x2000 Sektoren (4MB).

3. Für die Leistung muss jeder Partitionsbeginn auf 32KB (64 Sektoren) ausgerichtet und die Größe ein Vielfaches von 32KB sein.

4. Bei Aktualisierung eines sparse-Abbilds werden Daten gelöscht. Für bessere Kompatibilität die betreffende Partition auf 4MB ausrichten und ihre Größe als Vielfaches von 4MB wählen.

5. Bei GPT sind Parameter-Adressen tatsächliche logische Blockadressen (LBA). uboot bei 0x4000 wird beispielsweise sowohl in EMMC als auch NAND an die logische Adresse 0x4000 geschrieben.

| Name | Parameter-Adresse | Logische EMMC-Adresse | Logische NAND-Adresse | Größe |
| --- | --- | --- | --- | --- |
| GPT | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| Reserviert | -- | 0x2000 | 0x2000 | 4MB |
| UBOOT | 0x4000 | 0x4000 | 0x4000 | 4MB |
| TRUST | 0x6000 | 0x6000 | 0x6000 | 4MB |

Für die letzte Partition grow angeben; das Werkzeug weist ihr den gesamten verbleibenden Speicher zu.

6. Bei herkömmlichen cmdline-Partitionen auf EMMC sind 0–4MB für loader reserviert; zu allen Partitionsadressen aus parameter kommen daher 4MB hinzu. uboot bei 0x2000 wird tatsächlich an 0x4000 geschrieben, wie bei GPT. Bei NAND gelten zur Kompatibilität mit älteren Produkten die tatsächlichen logischen Adressen: uboot bei 0x2000 wird an NAND-Adresse 0x2000 geschrieben, anders als mit GPT.

| Name | Parameter-Adresse | Logische EMMC-Adresse | Logische NAND-Adresse | Größe |
| --- | --- | --- | --- | --- |
| Reserviert | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| parameter | -- | 0x2000 | 0x0 | 4MB |
| UBOOT | 0x2000 | 0x4000 | 0x2000 | 4MB |
| TRUST | 0x4000 | 0x6000 | 0x4000 | 4MB |

Hinweis: Bei NAND-FLASH-Systemen kann das loader-Abbild bei 0x40 im selben 4MB-Bereich wie parameter liegen. Gültige Daten werden versetzt gespeichert und überschreiben einander nicht.

## 3. Regeln zur Partitionsdefinition

1. Alle von bootrom, pre-loader, uboot oder trust beschriebenen Partitionen vor recovery platzieren.

2. Auch kundenspezifische neue Partitionen, die pre-loader, uboot oder trust beschreiben, müssen vor recovery liegen.

3. Die frühen Rockchip-Firmwarestufen greifen auf misc, vbmeta und security zu; alle müssen vor recovery liegen.

{% endraw %}
