---
title: "Rockchip Linux Flash: vollständiger Entwicklerleitfaden zur Open-Source-Lösung"
description: "Rockchip Linux Flash: vollständiger Entwicklerleitfaden zur Open-Source-Lösung — NAND, NOR, MTD, UBIFS, JFFS2, OTA; V3.18.0."
translation_key: "103-rockchip-flash-open-source"
slug: "103-rockchip-flash-open-source"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: [ArmSoM, Rockchip, Flash, NAND, NOR, UBIFS, MTD]
excerpt: "Rockchip Linux Flash: vollständiger Entwicklerleitfaden zur Open-Source-Lösung — NAND, NOR, MTD, UBIFS, JFFS2, OTA; V3.18.0."
---

{% raw %}

Grundlage ist der chinesische technische Text RK-KF-YF-314 V3.18.0, abgeglichen mit der englischen Quelle derselben Version. Geltungsbereich: Chips mit FSPI (früher SFC), Linux 4.4, 4.19, 5.10 und 6.1. Frühe proprietäre 4.4-SDKs und der spätere Wechsel zu Open Source beschreiben die Herstellerhistorie, nicht sämtliche ArmSoM-BSPs. Plattformreferenz: Flash-Typ, Verdrahtung, Loader, SDK/BSP und Kerneltreiber des konkreten Boards prüfen. Keine ArmSoM-Hardwarevalidierung durchgeführt. Verwendet werden englische Originalabbildungen.

> Quellenkonflikte: vereinbarte chinesische Grundlage. In §5.3.1 ist NAND off\|partition in Byte angegeben (seitenausgerichtet, ohne OOB), count als hexadezimale Seitenanzahl; die englische Quelle nennt dagegen page beziehungsweise byte. Vor Ausführung die tatsächliche U-Boot-Befehlsimplementierung prüfen. Für ENV-SPI-NAND-IDB nennt Chinesisch Blöcke 1–3, Englisch 1–7; chinesische Werte bleiben erhalten und sind am Loader zu prüfen. Die Formel 5456KB + 4KB *256 =6456KB ist widersprüchlich; auch 512B/s als Sektoreinheit und SPI NAND im SPI-NOR-Absatz sind zu prüfen. Löschen, Flashen und Partitionieren können Daten unwiederbringlich vernichten; diese Befehle wurden nicht ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

<!-- Chinese baseline PDF p.7 -->

## 1 Hinweise zur Open-Source-Lösung

### 1.1 Merkmale der Lösung

Folgende Eigenschaften der offenen Implementierungen prüfen:

| Lösung | Hauptsächlich unterstützte Flash-Typen | Registrierte Gerätetypen | Hauptsächlich unterstützte Dateisysteme | Unterstützte Programmierverfahren |
| --- | --- | --- | --- | --- |
| Open-Source-Lösung für SLC NAND (parallele NAND) | SLC Nand | mtd-Geräte, ubiblock | SquashFS、UBIFS | Updates über USB, SD-Karte und Programmiergerät |
| Open-Source-Lösung für SPI NAND | SPI Nand | mtd-Geräte, ubiblock | SquashFS、UBIFS | Updates über USB, SD-Karte und Programmiergerät |
| Open-Source-Lösung für SPI NOR | SPI Nor | mtd-Geräte, mtdblock-Geräte | SquashFS、JFFS2 | Updates über USB, SD-Karte und Programmiergerät |

Hauptprüfpunkte: gewählter Flash-Typ und Eignung des Dateisystems für die Anforderungen.

### 1.2 Auswahl von NAND Flash

UBIFS-Abbilder hängen von den NAND-Spezifikationen ab und sind nicht zwischen Bausteinen mit unterschiedlichen Seiten- oder Blockgrößen austauschbar. NAND-Bauteilspezifikationen müssen übereinstimmen. SLC NAND bezeichnet hier paralleles NAND.

### 1.3 Partitionserweiterung je Chip

Wie unter Partitionskonfiguration beschrieben, erweitert das RK SDK MTD-Partitionen. Die Unterstützung je Chip prüfen:

<!-- Chinese baseline PDF p.8 -->

| Chip | GPT-Partitionserweiterung | ENV-Partitionserweiterung |
| --- | --- | --- |
| RK3308 | Y | N |
| RV1126 & RV1109 | Y | N |
| RK3568 & RK3566 | Y | N |
| RK3588 & RK3588s | Y (Standard) | Y (optional) |
| RV1106/RV1103 | N | Y |
| RK3528 | Y | N |
| RK3562 | Y | N |
| RK3576 | Y | N |
| RV1106B/RV1103B | N | Y |
| RK3506 | Y | N |

### 1.4 Wesentliche FSPI/SFC-Funktionen

Aufgeführt sind nur SoCs mit offener Speicherimplementierung:

| SOC | FSPI/SFC IO rate | FSPI/SFCdata io lines | ROM-ContRead-Unterstützung |
| --- | --- | --- | --- |
| RK3308 | <= 48MHz (empfohlen) | x1\x4 | N |
| RV1126 & RV1109 | <= 125MHz | x1\x4 | N |
| RK3568/RK3566 | <= 150MHz, feste Frequenzen OSC\50\75\100\125\150 MHz | x1\x4 | N |
| RK3588/RK3588s | <= 150MHz | x1\x4 | N |
| RV1106/RV1103 | <= 150MHz; 125MHz und 150MHz unterstützt, Zwischenfrequenzen wegen Teilerbeschränkungen nicht verfügbar | x1\x4 | N |
| RK3528 | <= 150MHz | x1\x4 | N |
| RK3562 | <= 150MHz | x1\x4 | N |
| RK3576 | <= 133MHz; wegen Taktteilung höchstens 125MHz | x1\x4 | Y |
| RV1106B/RV1103B | FSPI0 <= 133MHz,FSPI1 <= 125MHz | x1\x4 | Y |
| RK3506 | <= 133MHz | x1\x4 | Y |

Hinweise:

<!-- Chinese baseline PDF p.9 -->

Das IP unterstützt x4 und ist mit x2 kompatibel, das offene Framework jedoch nicht mit dual SPI. Trotz höherer IP-Grenzen nutzt das SDK meist niedrigere Frequenzen; empfohlen sind 80MHz, angepasst an Projekt und Baustein. Quad SPI NAND erreicht üblicherweise 133MHz, Quad SPI NOR ebenfalls 133MHz, teils 166MHz. Octal SPI Flash erreicht üblicherweise 200MHz. Nahe der Bausteingrenze die tatsächliche Frequenz messen, Übertaktung erkennen und nötigenfalls reduzieren; üblicherweise genügt der Vergleich der Spezifikation mit der mittleren Oszilloskopmessung.

### 1.5 Partitionserweiterungen und IDB-Layout

#### 1.5.1 Verfahren zur Partitionserweiterung

| Chip | GPT-Partitionserweiterung | ENV-Partitionserweiterung |
| --- | --- | --- |
| RK3308 | Standardschema (Kompatibilitätsschema 1) | N |
| RV1126/RV1109 | Standardschema (Kompatibilitätsschema 2) | N |
| RK3568/RK3566 | Standardschema | N |
| RK3588/RK3588s | Standardschema | N |
| RV1106/RV1103 | N | Standardschema |
| RK3528 | Standardschema | N |
| RK3562 | Standardschema | N |
| RK3576 | Standardschema | N |
| RV1106B/RV1103B | N | Standardschema |
| RK3506 | Standardschema | N |

Änderungen der Kompatibilitätsvarianten siehe IDB-Planung für GPT-Partitionserweiterung.

#### 1.5.2 IDB-Layout bei ENV-Partitionserweiterung

| Speichertyp | idb-Startadresse | Anforderungen an Mehrfachkopien |
| --- | --- | --- |
| SLC Nand | 256KB | Zwei Imagekopien erforderlich |
| SPI Nand | 256KB | Mehrere Imagekopien erforderlich |
| SPI Nor | 64KB | Zwei Imagekopien erforderlich |

<!-- Chinese baseline PDF p.10 -->

#### 1.5.3 IDB-Layout bei GPT-Partitionserweiterung

| Speichertyp | idb-Startadresse | Anforderungen an Mehrfachkopien |
| --- | --- | --- |
| SLC Nand | Flash-Blockgröße (128KB oder 256KB) | Werkzeug muss zwei Kopien unterstützen; Größe an Flash-Blockgröße ausrichten |
| SPI Nand | Flash-Blockgröße (128KB oder 256KB) | Werkzeug muss zwei Kopien unterstützen; Größe an Flash-Blockgröße ausrichten |
| SPI Nor | 64KB | Werkzeug muss zwei Kopien unterstützen; Größe an 64KB ausrichten |

PC-Upgradewerkzeuge unterstützen zwei IDB-Kopien. Kompatibilitätsvariante 1: RK3308 SPI-NOR-IDB unterstützt nur eine Kopie; SPI-NAND-Blöcke 1–8 bilden den Mehrfachkopiebereich mit bis zu fünf Kopien. Variante 2: RV1126/RV1109 SPI-NOR-IDB beginnt bei 32KB und unterstützt eine Kopie.

## 2 Speichertreiber konfigurieren

### 2.1 SPL- und U-Boot-Grundkonfiguration

defconfig-Einstellungen:

```text
// MTD 驱动⽀持
CONFIG_MTD=y
CONFIG_CMD_MTD_BLK=y
CONFIG_SPL_MTD_SUPPORT=y
CONFIG_MTD_BLK=y
CONFIG_MTD_DEVICE=y

// spi nand 驱动⽀持
CONFIG_MTD_SPI_NAND=y
CONFIG_ROCKCHIP_SFC=y
CONFIG_SPL_SPI_FLASH_SUPPORT=y
CONFIG_SPL_SPI_SUPPORT=y

// nand 驱动⽀持
CONFIG_NAND=y
CONFIG_CMD_NAND=y
CONFIG_NAND_ROCKCHIP=y /* NandC v6 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，0x00000801 */
//CONFIG_NAND_ROCKCHIP_V9=y  /* NandC v9 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x56393030, 例如：RK3326/PX30 为此版本 */
CONFIG_SPL_NAND_SUPPORT=y
CONFIG_SYS_NAND_U_BOOT_LOCATIONS=y

// spi nor 驱动⽀持
CONFIG_CMD_SF=y
CONFIG_CMD_SPI=y
CONFIG_SPI_FLASH=y
CONFIG_SF_DEFAULT_MODE=0x1
CONFIG_SF_DEFAULT_SPEED=50000000
CONFIG_SPI_FLASH_GIGADEVICE=y
CONFIG_SPI_FLASH_MACRONIX=y
CONFIG_SPI_FLASH_WINBOND=y
CONFIG_SPI_FLASH_MTD=y
CONFIG_ROCKCHIP_SFC=y
CONFIG_SPL_SPI_SUPPORT=y
CONFIG_SPL_MTD_SUPPORT=y
CONFIG_SPL_SPI_FLASH_SUPPORT=y
```

rkflash/rknand-Makroeinstellungen entfernen:

```text
CONFIG_RKFLASH=n
CONFIG_RKNAND=n
```

Treiberdateien:

```text
./drivers/mtd/nand/raw          //SLC Nand 主控驱动及协议层
./drivers/mtd/nand/spi          //SPI Nand 协议层
./drivers/spi/rockchip_sfc.c    //SPI Flash 主控驱动
./drivers/mtd/spi               //SPI Nor 协议层
```

Für SPI NOR siehe drivers/mtd/spi/spi-nor-ids.c; die Quelle nennt die unterstützten Bausteine hier SPI NAND, ein zu prüfender Begriffswiderspruch. Für Winbound SPI NAND siehe drivers/mtd/nand/spi/winbond.c; weitere Bausteine liegen im gleichen Verzeichnis. Über Flash-ID oder Gehäuseaufdruck zuordnen.

### 2.2 Kernel-Grundkonfiguration

#### 2.2.1 SLC NAND

Framework-Überblick:

| Lösung | Hauptsächlich unterstützte Flash-Typen | Controllertreiber | Flash-Framework |
| --- | --- | --- | --- |
| Open-Source-Lösung für SLC NAND | SLC Nand | drivers/mtd/nand/raw | drivers/mtd/nand/raw |

defconfig-Einstellungen:

<!-- Chinese baseline PDF p.12 -->

```text
CONFIG_RK_NANDC_NAND=n   /* 不兼容 */
CONFIG_MTD_NAND_ROCKCHIP_V6=y /* NandC v6 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x00000801 */
# CONFIG_MTD_NAND_ROCKCHIP_V9=y /* NandC v9 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x56393030 */
CONFIG_MTD_CMDLINE_PARTS=y
```

#### 2.2.2 SPI NOR/NAND

##### 2.2.2.1 Linux 4.19 und früher

Framework-Überblick:

| Lösung | Hauptsächlich unterstützte Flash-Typen | Controllertreiber | Flash-Framework |
| --- | --- | --- | --- |
| Open-Source-Lösung für SPI NAND | SPI Nand | drivers/rkflash | drivers/rkflash |
| Open-Source-Lösung für SPI NOR | SPI Nor | drivers/rkflash | drivers/rkflash |

defconfig-Einstellungen:

```text
CONFIG_RK_FLASH=y

CONFIG_RK_SFC_NAND=y     /* SPI Nand flash */
CONFIG_RK_SFC_NAND_MTD=y /* SPI Nand flash 及其分区注册为 mtd 设备，不选中则注册为普通 block 设备
（rkflash0pn） */
CONFIG_RK_SFC_NOR=y      /* SPI Nor flash */
CONFIG_RK_SFC_NOR_MTD=y  /* SPI Nor flash 及其分区注册为 mtd 设备，不选中则注册为普通 block 设备
（rkflash0pn） */
CONFIG_MTD_CMDLINE_PARTS=y
```

DTS-Einstellungen:

```text
&sfc {
    assigned-clocks = <&cru SCLK_SFC>; # 选择 dtsi sfc 设备节点中的 clk_sfc 对应时钟源修改 IO 速率
    assigned-clock-rates = <100000000>;
    status = "okay";
};
```

##### 2.2.2.2 Linux 5.10 und neuer

Framework-Überblick:

<!-- Chinese baseline PDF p.13 -->

| Lösung | Hauptsächlich unterstützte Flash-Typen | Controllertreiber | Flash-Framework |
| --- | --- | --- | --- |
| Open-Source-Lösung für SPI NAND | SPI Nand | drivers/spi/spi-rockchip-sfc.c | drivers/mtd/nand/spi |
| Open-Source-Lösung für SPI NOR | SPI Nor | drivers/spi/spi-rockchip-sfc.c | drivers/mtd/spi-nor |

Unterstützte Winbound-SPI-NOR-Bausteine stehen in drivers/mtd/spi-nor/winbond.c; weitere Hersteller im gleichen Verzeichnis. Für Winbound SPI NAND drivers/mtd/nand/spi/winbond.c und benachbarte Dateien verwenden. Flash-ID oder Aufdruck zuordnen. Die Software identifiziert den Baustein anhand der Flash-ID. Sind Quellkonfiguration und DTS-bus-width des Controllers auf quad/octal gesetzt, nutzt der Treiber quad/octal. defconfig-Einstellungen:

```text
CONFIG_SPI_ROCKCHIP_SFC=y
CONFIG_MTD_SPI_NAND=y
CONFIG_MTD_SPI_NOR=y
```

DTS-Einstellungen:

```text
&fspi { # 旧平台节点命名为 sfc
    sfc-cs-gpios = <&gpio4 RK_PB0 GPIO_ACTIVE_LOW>, <&gpio4 RK_PA5 GPIO_ACTIVE_LOW>; # 扩展 gpio 为 CSN
    status = "okay";

    flash@0 {
        compatible = "spi-nand";    # compatible = "jedec,spi-nor"; for spinor
        reg = <0>;
        spi-max-frequency = <75000000>; # 修改 IO 速率
        spi-rx-bus-width = <4>;         # 阅读 "芯⽚ FSPI/SFC 关键特性" 确认⽀持的线宽
        spi-tx-bus-width = <1>;         # 阅读 "芯⽚ FSPI/SFC 关键特性" 确认⽀持的线宽，x4 软件⾃动降级为兼容性更好的 x1 传输
    };
};
```

### 2.3 Partitionierung konfigurieren

#### 2.3.1 Grundlagen der MTD-Partitionen

Die offene Flash-Lösung registriert MTD-Geräte und verarbeitet nur standardisierte mtd-partition-Informationen. Üblicherweise wird mtdparts in der Kernel-DTS-cmdline definiert.

<!-- Chinese baseline PDF p.14 -->

#### 2.3.2 GPT-Partitionserweiterung

Einige RK SDKs lesen GPT in U-Boot, erzeugen MTD-mtdparts und übergeben dies per cmdline an den Kernel. Chipunterstützung im Abschnitt zur Partitionserweiterung prüfen. Die Umwandlung erfolgt in u-boot/drivers/mtd_blk.c. GPT wird ähnlich MTD Partition über parameter konfiguriert, mit vier Unterschieden:

1. TYPE auf GPT setzen.

2. Keine parameter-Partition definieren; eine vorhandene wird nicht verwendet.

3. Der letzten Partition grow hinzufügen.

4. MTD benötigt keine rootfs-UUID.

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000 (uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000 (misc),0x00008000@0x0000a000 (resource),0x00010000@0x00012000(kernel),0x00010000@0x00022000 (boot),0x00020000@0x00032000 (recovery),0x00038000@0x00052000(backup),0x00002000@0x0008a000 (security),0x000c0000@0x0008c000(cache),0x00300000@0x0014c000 (system),0x00008000@0x0044c000(metadata),0x000c0000@0x00454000 (vendor),0x00040000@0x00514000 (oem),0x00000400@0x00554000(frp),-@0x00554400 (userdata:grow)
```

GPT-Aktualisierungsablauf:

1. Partitionsdefinitionen aus parameter lesen.

2. Speicherkapazität von Loader abfragen.

3. Größe der letzten Partition anpassen und GPT-Datei erstellen.

4. Tabelle an Speicheradressen 0 und -33 (Ende) schreiben.

5. Die parameter-Datei selbst wird nicht in den Speicher geschrieben.

#### 2.3.3 ENV-Partitionserweiterung

Einige RK SDKs unterstützen ENV mit standardmäßigen U-Boot-Umgebungsvariablen, die per cmdline zum Kernel gelangen. Chipunterstützung unter Partitionserweiterungen prüfen. ENV mit ./tools/mkenvimage im U-Boot-Verzeichnis und einer eigenen Datei wie env.txt erstellen:

<!-- Chinese baseline PDF p.15 -->

```text
mtdparts=spi-nand0:256K(env),256K@256K(idblock),4M(uboot),8M(boot),72M(rootfs),32M(userdata),-(media)
sys_bootargs=ubi.mtd=4 root=ubi0:rootfs rootfstype=ubifs
```

SPI-NAND-Beispiel: ./tools/mkenvimage -s 0x40000 -p 0x0 -o env.img env_.txt. SPI-NOR-Beispiel: ./tools/mkenvimage -s 0x10000 -p 0x0 -o env.img env.txt. sys_bootargs gemäß tatsächlichem SDK und Entwicklerhandbuch setzen.

#### 2.3.4 NAND-Partitionen planen

Pro SLC-/SPI-NAND-Partition 3–4 Flash-Blöcke für Bad-Block-Ersatz reservieren, besonders für U-Boot. Über 10MB die Reserve auf 4 + Partitionsblockanzahl * 1% erhöhen; bei 128KB-Blöcken und 16MB oem (128 Blöcke) etwa 5. Partitionsanfänge auf Blockgröße ausrichten. Die letzten vier Blöcke sind global für die Bad-Block-Tabelle reserviert und gehören nicht in die letzte Benutzerpartition. Andernfalls werden vier Blöcke absichtlich als schlecht markiert und die Kapazität sinkt um vier Blöcke. Ein deutlich kleineres Abbild kann funktionieren, dennoch wird davon abgeraten.

### 2.4 Vendor Storage

Vendor Storage speichert kleine ungeschützte Daten wie SN/MAC. vnvm nach IDB und vor uboot anlegen, vorzugsweise vier Blöcke: SPI NOR 256KB, SPI NAND 1MB (128KB/256KB-kompatibel). parameter.txt: NOR 0x00000200@0x00000800(vnvm), NAND 0x00000800@0x00001800(vnvm). env.txt: NOR 256K@1M(vnvm), NAND 1M@3M(vnvm). U-Boot aktiviert dies mit CONFIG_MTD_BLK = y; Implementierung arch/arm/mach-rockchip/vendor.c, Schnittstelle ./arch/arm/include/asm/arch-rockchip/vendor.h. Kernel: CONFIG_ROCKCHIP_MTD_VENDOR_STORAGE=y, drivers/soc/rockchip/mtd_vendor_storage.c und ./include/linux/soc/rockchip/rk_vendor_storage.h.

<!-- Chinese baseline PDF p.16 -->

PC-Werkzeuge, Produktionswerkzeuge und Kernel-Userspace-Schnittstellen werden unterstützt; siehe Rockchip_Application_Notes_Storage_CN.pdf.

## 3 Angepasste Lösungen

### 3.1 Thunder Boot mit SPI NAND Continuous Read Mode

Einige SPI-NAND-Familien unterstützen continuous read ohne Seitengrenze und können bestimmte Abläufe erwartbar von 20MB/s auf etwa 50MB/s beschleunigen. RK integriert dies in Thunder Boot: ROM lädt auf unterstützten SoCs kontinuierlich (Rom ContRead unter FSPI/SFC prüfen), ebenso SPL. usbplug ersetzt beim Flashen schlechte Blöcke, sodass ramdisk ohne ECC-Ergebnisprüfung schnell gelesen und entpackt wird. Andere Stufen nutzen Buffer Read, da kleine Dateisystemzugriffe nicht profitieren. Die Kosten sind höher. Am Flash-Ende bbm_reserved für Blockersatz reservieren. 1Gbit: [0000,999] user/scan; [1000,1019] user/replay/bbm_reserved; [1020,1023] reserved/RK bbt. 2Gbit: [0000,2003] user/scan; [2004,2043] user/replay/bbm_reserved; [2044,2047] reserved/RK bbt. 4Gbit: [0000,4011] user/scan; [4012,4091] user/replay/bbm_reserved; [4092,4095] reserved/RK bbt. Wegen notwendiger vorheriger Neuzuordnung des gesamten Geräts wird Vorprogrammierung per Programmiergerät nicht unterstützt. Bei unterstützten ROMs die rkbin-Loader-Packkonfiguration mit Endung _CONT_TB.ini wählen.

<!-- Chinese baseline PDF p.17 -->

In SPL/U-Boot CONFIG_SPI_NAND_CONT_READ aktivieren; im Kernel den Knoten rockchip,thunder-boot-sfc und CONFIG_ROCKCHIP_THUNDER_BOOT_SFC.

### 3.2 SPI-NOR-AUTO_MERGE-Softwarelösung

#### 3.2.1 Einführung

RK SDK unterstützt zusätzliche SPI NOR über cs-gpio, jedoch unabhängig: PC-Werkzeuge flashen nur CS0, SPL/U-Boot/Linux verwalten CS0/CS1 getrennt. AUTO_MERGE verbindet zwei NORs für diese Ebenen zu einem virtuellen Gerät doppelter Kapazität. Beide Chips müssen dasselbe Modell sein. Ein-Chip-Hardware bleibt kompatibel, der CS1N-GPIO-Pin gibt beim Start aber Erkennungssignale aus. Bei Schnellstart darf preload-Firmware wie ramdisk nicht über Gerätegrenzen reichen. Das offene usbplug_auto_merge wird aus U-Boot gebaut und unterstützt nur USB; UART benötigt eine für CS1 GPIO neu erstellte geschlossene usbplug.bin. Folgenden U-Boot-Patch prüfen:

```text
spi: rockchip_sfc: Support auto_merge

Change-Id: I4416b004d315f2f5689312b1eb53e36fce7f6bbf
Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

Folgenden Kernel-Patch prüfen:

```text
spi: rockchip-sfc: Support sfc-cs-gpio

Change-Id: I24bfbf39ed7bea0596f299d3413159c7e2038ba8
Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese baseline PDF p.18 -->

#### 3.2.2 Grundkonfiguration

Vollständiges rv1103b-Beispiel: U-Boot-DTS-Einstellungen.

```text
&gpio1 {
+   u-boot,dm-spl;
    status = "okay";
};

&gpio2 {
+   u-boot,dm-spl;
    status = "okay";
};

&sfc {
+   sfc-cs-gpios= <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio2 RK_PA6 GPIO_ACTIVE_LOW>;
    u-boot,dm-spl;
    status = "okay";

@@ -104,6 +105,7 @@
        spi-tx-bus-width = <1>;
        spi-rx-bus-width = <4>;
        spi-max-frequency = <80000000>;
+       status = "disabled";
    };
```

U-Boot-CS0/CS1-GPIO-IOMUX-Einstellungen.

```text
diff --git a/arch/arm/mach-rockchip/rv1103b/rv1103b.c b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
index 7353528afdd..8e30240076e 100644
--- a/arch/arm/mach-rockchip/rv1103b/rv1103b.c
+++ b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
@@ -252,9 +252,9 @@ int arch_cpu_init(void)
        writel(0x00000000, USBPHY_APB_BASE + USBPHY_FSLS_DIFF_RECEIVER);

+#ifdef CONFIG_SPI_FLASH_AUTO_MERGE
+       /* gpio1a5/gpio2a6 cs-gpio */
+       writel(0x00F00000, GPIO1_IOC_BASE + GPIO1A_IOMUX_SEL_1_0);
+       writel(0x0F000000, GPIO2_IOC_BASE + GPIO2A_IOMUX_SEL_1_1);
+#endif
 #endif
```

U-Boot-defconfig-Einstellungen.

```text
CONFIG_SPI_FLASH_AUTO_MERGE=y
CONFIG_SPL_GPIO_SUPPORT=y
```

Kernel-DTS-Einstellungen.

<!-- Chinese baseline PDF p.19 -->

```text
&fspi0 {
    sfc-cs-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA6 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&fspi_cs0n &fspi_cs1n>;
    status = "okay";

    flash@0 {
        compatible = "jedec,spi-nor";
        reg = <0>;
        spi-max-frequency = <75000000>;
        spi-rx-bus-width = <4>;
        spi-tx-bus-width = <1>;
    };
};

&pinctrl {
    fspi {
        fspi_cs0n: fspi-cs0n {
            rockchip,pins = <1 RK_PA5 RK_FUNC_GPIO &pcfg_pull_up>;
        };
        fspi_cs1n: fspi-cs1n {
            rockchip,pins = <1 RK_PA6 RK_FUNC_GPIO &pcfg_pull_up>;
        };
    };
};
```

Kernel-defconfig-Einstellungen.

```text
CONFIG_MTD_SPI_NOR_AUTO_MERGE=y
```

#### 3.2.3 USBPLUG aktualisieren

usbplug.bin ist die Rockchip-Startprogrammierfirmware. Für auto_merge empfohlenen CS1 GPIO und die Standardversion usbplug_auto_merge im U-Boot-Quellverzeichnis verwenden:

```text
./make.sh rv1103b-usbplug
cp u-boot.bin ./../rkbin/bin/rv11/rv1103b_usbplug_*.bin
./make.sh loader
```

Standard-CS1-GPIO-Einstellungen ausgewählter usbplug_auto_merge-Firmware:

| Chip | CS1 GPIO |
| --- | --- |
| RV1103B | GPIO2_A6 |

<!-- Chinese baseline PDF p.20 -->

#### 3.2.4 Funktionstest

Mit flash_stresstest aus rockchip_test belasten: eine 20MB-userdata-Partition mit JFFS2 anlegen, die beide SPI-NOR-Geräte überspannt.

## 4 Flashen mit PC-Werkzeugen

### 4.1 PC-Flashen: GPT-Partitionserweiterung

AndroidTools V2.7.8+ und upgrade_tools V1.5.6+ erforderlich. PC-Flashen kopiert IDB in NAND-Blöcke 1–7: GPT und IDB liegen in den ersten 1MB bei 2KB-Seiten beziehungsweise 2MB bei 4KB-Seiten. NOR erhält zwei IDB-Kopien: erste bei 64KB, zweite direkt danach mit 64KB-Größenausrichtung. Nach GPT-Änderungen in Maskrom aktualisieren, um UBIFS-Mountprobleme zu vermeiden. Werkzeuge erkennen UBIFS, löschen die Zielpartition und flashen sie anschließend; die englische Quelle vervollständigt hier den abgebrochenen chinesischen Satz.

### 4.2 PC-Flashen: ENV-Partitionserweiterung

SocToolKit für Windows/Linux mit passendem Produktionswerkzeug verwenden.

## 5 OTA

### 5.1 OTA-Hinweise

Vor Online-Updates das Ziel-UBIFS aushängen. Bei MTD mit parameter-Partitionsinformationen gpt/idb in parameter.txt ergänzen, falls GPT und IDB aktualisiert werden sollen:

<!-- Chinese baseline PDF p.21 -->

NAND mit 128KB-Blöcken: 0x00000100@0x00000000(gpt),0x00000700@0x00000100(idb). 256KB-Blöcke: 0x00000200@0x00000000(gpt),0x00000e00@0x00000200(idb). SPI NOR: 0x00000080@0x00000000(gpt),0x00000780@0x00000080(idb).

### 5.2 Image-Quellen

OTA unterstützt nur vorab erstellte Abbilder; siehe Abbilderstellung im Programmiergerät-Kapitel.

### 5.3 MTD-Partitionen über die Befehlszeile aktualisieren

Für UBIFS in einer MTD-Partition das Kapitel zum UBIFS-Shell-Update verwenden. Dieses MTD-Verfahren betrifft schreibgeschützte Firmwarepartitionen ohne Dateisystem wie IDB, U-Boot und Kernel.

#### 5.3.1 SLC NAND in U-Boot

nand info:

```text
nand info
```

nand erase:

```text
nand erase off size
```

off und size: blockausgerichtet, Byte, nur hexadezimal, ohne OOB. Bei 128KB Daten + 8KB OOB gilt 128KB. nand write:

```text
nand write.raw[.noverify] - addr off|partition [count]
```

addr: hexadezimale Speicheradresse. off\|partition: seitenausgerichtet, Byte, hexadezimal, ohne OOB (128KB Daten + 8KB OOB zählen als 128KB). count: Seiten, hexadezimal; OOB zur Abbildgröße zählen, etwa 0x800 Daten + 0x80 OOB ergibt count = file_size / 0x880. Rückleseprüfung ist standardmäßig aktiv. nand read:

```text
nand read.raw - addr off|partition [count]
```

<!-- Chinese baseline PDF p.22 -->

addr: hexadezimale Speicheradresse. off\|partition: seitenausgerichtet, Byte, hexadezimal, ohne OOB (128KB Daten + 8KB OOB zählen als 128KB). count: Seiten, hexadezimal; OOB zur Abbildgröße zählen, etwa 0x800 Daten + 0x80 OOB ergibt count = file_size / 0x880. Empfohlene Partitionsupdate-Reihenfolge:

```text
tftp 0x4000000 rootfs.img
nand erase 0x600000 0x200000                        /* 升级分区时先擦除整个分区 */
nand write.raw 0x4000000 0x600000 0x1000
```

#### 5.3.2 SLC NAND im Kernel

flash_erase:

```text
flash_erase       /* 例如: flash_erase /dev/mtd1 0 0 */
```

nanddump:

```text
nanddump -o -n --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img
```

--bb=skipbad: schlechte Blöcke überspringen; -o: OOB lesen; -n: ohne ECC lesen. nandwrite:

```text
nandwrite -o -n -p /dev/mtd3 /rockchip_test/rockchip_test.sh
```

-o: Eingabe enthält OOB; -n: ohne ECC schreiben. Empfohlene Partitionsupdate-Reihenfolge:

```text
flash_erase /dev/mtd4 0 0                       /* 升级分区时先擦除整个分区 */
nandwrite -o -n -p /dev/mtd4 /userdata/boot.img
sync
nanddump -o -n --bb=skipbad /dev/mtd4 -f /userdata/boot_read.img -l 0xXXXX
md5sum /userdata/boot_read.img ...              /* 建议添加校验 */
```

<!-- Chinese baseline PDF p.23 -->

#### 5.3.3 SPI NAND in U-Boot

SPI NAND kann nand-Befehle nicht nutzen. cmd/mtd.c verwenden; schlechte Blöcke werden weiterhin übersprungen. mtd erase:

```text
mtd erase <name> <off> <size>
```

name: spi-nand0 für SPI-NAND-MTD. off und size: blockgrößenausgerichtet, Byte, nur hexadezimal. mtd write:

```text
mtd write <name> <addr> <off> <size>
```

name: spi-nand0. addr: Speicheradresse, nur hexadezimal. off und size: seitenausgerichtet, Byte, nur hexadezimal. mtd read:

```text
mtd read <name> <addr> <off> <size>
```

name: spi-nand0. addr: Speicheradresse, nur hexadezimal. off und size: seitenausgerichtet, Byte, nur hexadezimal. Empfohlene Updatereihenfolge:

```text
tftp 0x4000000 rootfs.img
mtd erase spi-nand0 0x600000 0x200000                       /* 升级分区时先擦除整个分区 */
mtd write spi-nand0 0x4000000 0x600000 0x200000
```

#### 5.3.4 SPI NAND im Kernel

flash_erase:

```text
flash_erase       /* 例如: flash_erase /dev/mtd1 0 0 */
```

nanddump:

```text
nanddump --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img
```

<!-- Chinese baseline PDF p.24 -->

--bb=skipbad: schlechte Blöcke überspringen. nandwrite:

```text
nandwrite -p /dev/mtd3 /rockchip_test/rockchip_test.sh
```

Empfohlene Partitionsupdate-Reihenfolge:

```text
flash_erase /dev/mtd4 0 0                       /* 升级分区时先擦除整个分区 */
nandwrite -p /dev/mtd4 /userdata/boot.img
sync
nanddump --bb=skipbad /dev/mtd3 /userdata/boot_read.img -l 0xXXXX
md5sum /userdata/boot_read.img ...              /* 建议添加校验 */
```

#### 5.3.5 SPI NOR in U-Boot

MTD-Schnittstelle verwenden; cmd/sf.c ist eine Alternative. mtd erase:

```text
mtd erase <name> <off> <size>
```

name: nor0 für SPI-NOR-MTD. off und size: sektorausgerichtet (4KB), Byte, nur hexadezimal. mtd write:

```text
mtd write <name> <addr> <off> <size>
```

name: nor0. addr: Speicheradresse, nur hexadezimal. off und size: mindestens byteausgerichtet, Byte-Einheiten, nur hexadezimal. mtd read:

```text
mtd read <name> <addr> <off> <size>
```

name: nor0. addr: Speicheradresse, nur hexadezimal. off und size: mindestens byteausgerichtet, Byte-Einheiten, nur hexadezimal. Empfohlene Partitionsupdate-Reihenfolge:

<!-- Chinese baseline PDF p.25 -->

```text
tftp 0x4000000 rootfs.img
mtd erase nor0 0x600000 0x200000                        /* 升级分区时先擦除整个分区 */
mtd write nor0 0x4000000 0x600000 0x200000
```

#### 5.3.6 SPI NOR im Kernel

mtd_debug-Schnittstelle verwenden.

### 5.4 UBIFS-Image-Partitionen über die Befehlszeile aktualisieren

Siehe UBIFS-Dateisystem → UBIFS OTA.

### 5.5 MTD-Partitionen über Funktionsschnittstellen aktualisieren

Bei MTD mit UBIFS das Shell-UBIFS-Updatekapitel nutzen; rohe MTD-Operationen betreffen dateisystemlose schreibgeschützte IDB-/U-Boot-/Kernelpartitionen. U-Boot: Bad-Block-bewusste Lese-/Schreib-/Lösch-APIs in drivers/mtd/nand/raw/nand_util.c verwenden. Für kleine vollständige Schreibvorgänge (empfohlen unter 2KB je Einschalten) kommen RK-MTD-zu-Block-Schnittstellen in drivers/mtd/mtd_blk.c infrage. Jeder Schreibzugriff löscht den betreffenden Flashblock unabhängig von der Anfragemenge; häufige fragmentierte Zugriffe verkürzen die Lebensdauer. Kernel: mtd-utils ./miscutils/nandwrite.c und ./miscutils/flash_eraseall.c mit Bad-Block-Behandlung nutzen. Userspace: gleiche Beispiele und MTD-ioctl aus include/uapi/mtd/mtd-abi.h. Leserückgaben: 0 gültig/ECC OK; -EUCLEAN gültig, ECC an Korrekturgrenze, Auffrischung durch Lesen/Löschen/Neuschreiben erwägen; -EBADMSG Daten-/ECC-Fehler; -EIO und weitere Fehler bedeuten ungültige Daten und Controller-/Verarbeitungsprobleme. Übliche Ergebnisprüfung folgt:

<!-- Chinese baseline PDF p.26 -->

```text
ret = mtd_read(mtd, from, len, &retlen, data);
if (ret < 0 && ret != -EUCLEAN) {
    return ret;
}
```

## 6 Dateisysteme

### 6.1 UBIFS-Dateisystem

#### 6.1.1 Einführung

UBIFS steht für Unsorted Block Image File System, häufig auf Raw-NAND als JFFS2-Nachfolger genutzt. Laut Quelle erfolgen MTD-Interaktionen über das UBIFS-Subsystem.

#### 6.1.2 Konfiguration

Kernelunterstützung:

```text
CONFIG_MTD_UBI=y
CONFIG_UBIFS_FS=y
CONFIG_UBIFS_FS_ADVANCED_COMPR=y
CONFIG_UBIFS_FS_LZO=y /* 建议选⽤ lzo 压缩 */
```

#### 6.1.3 Image erstellen und einhängen

##### 6.1.3.1 Offline-Abbilderstellung

Detaillierte Befehlsbeschreibung:

```text
Usage: mkfs.ubifs [OPTIONS] target
Make a UBIFS file system image from an existing directory tree
Examples:
Build file system from directory /opt/img, writting the result in the ubifs.img file
        mkfs.ubifs -m 512 -e 128KiB -c 100 -r /opt/img ubifs.img
The same, but writting directly to an UBIFS volume
        mkfs.ubifs -r /opt/img/dev/ubi0_0
Creating an empty UBIFS filesystem on an UBIFS volume
        mkfs.ubifs/dev/ubi0_0
Options:
-r, -d, --root=DIR         build file system from directory DIR, 待制作的⽂件系统⽬录
-m, --min-io-size=SIZE     minimum I/O unit size，最⼩输⼊输出⼤⼩, NAND FLASH 的最⼩读写单元，⼀
般为 page size，有 4096 或 2048
-e, --leb-size=SIZE        logical erase block size 逻辑可擦出块⼤⼩，为 block size-2x (page
size)，如 block_size 256KB page_size 2KB 应设置 -e 258048，如 block_size 128KB page_size 2KB 应
设置 -e 126976
-c, --max-leb-cnt=COUNT    maximum logical erase block count 最⼤逻辑可擦出块数⽬，autoresize 时
⽂件系统的的上限
-o, --output=FILE          output to FILE 输出⽂件名
-j, --jrn-size=SIZE        journal size
-R, --reserved=SIZE        how much space should be reserved for the super-user
-x, --compr=TYPE           compression type - "lzo", "favor_lzo", "zlib" or "none" (default:
"lzo")
-X, --favor-percent        may only be used with favor LZO compression and defines how many
percent better zlib should compress to make mkfs.ubifs use zlib instead of LZO (default 20%)
-f, --fanout=NUM           fanout NUM (default: 8)
-F, --space-fixup          file-system free space has to be fixed up on first mount(requires
kernel version 3.0 or greater),如果是通过 u-boot 烧写需要使能此功能。
-k, --keyhash=TYPE         key hash type - "r5" or "test" (default: "r5")
-p, --orph-lebs=COUNT      count of erase blocks for orphans (default: 1)
-D, --devtable=FILE        use device table FILE
-U, --SquashFS-uids        SquashFS owners making all files owned by root
-l, --log-lebs=COUNT       count of erase blocks for the log (used only for debugging)
-v, --verbose              verbose operation
-V, --version              display version information
-g, --debug=LEVEL          display debug information (0 - none, 1 - statistics, 2 - files, 3
- more details)
-h, --help                 display this help text
```

Ablauf:

1. UBIFS-Abbild erstellen; normalerweise genügen folgende Parameter.

```text
mkfs.ubifs -F -d rootfs_dir -e real_value -c real_value -m real_value -v -o rootfs.ubifs
```

2. In das Flash-Programmierformat umwandeln.

```text
ubinize -o ubi.img -m 2048 -p 128KiB ubinize.cfg
```

-p: Blockgröße. -m: kleinste NAND-Lese-/Schreibeinheit, meist Seitengröße. -o: Ausgabe ubi.img. ubinize.cfg-Einstellungen:

```text
[ubifs-volumn]
mode=ubi
image=rootfs.ubifs
vol_id=0
vol_type=dynamic
vol_alignment=1
vol_name=ubifs
vol_flags=autoresize
```

<!-- Chinese baseline PDF p.28 -->

mode=ubi ist vorgeschrieben; andere Werte sind reserviert. image=out/rootfs.ubifs ist die Eingabe. vol_id=0 unterscheidet Volumes eines Mehrvolume-UBI. vol_type=dynamic bedeutet Lesen/Schreiben, static schreibgeschützt. vol_name=ubifs benennt das Volume. vol_flags=autosize erlaubt Erweiterung. Beispiel: 2KB-Seiten, 64 Seiten/Block, 128KB-Blöcke, 64MB-Partition:

```text
mkfs.ubifs -F -d /path-to-it/buildroot/output/rockchip_rv1126_rv1109_spi_nand/target -e 0x1f000 -c 0x200 -m 0x800 -v -o rootfs.ubifs
ubinize -o ubi.img -m 2048 -p 128KiB ubinize.cfg
```

2KB-Seiten, 128 Seiten/Block, 256KB-Blöcke, 64MB-Partition:

```text
mkfs.ubifs -F -d /path-to-it/buildroot/output/rockchip_rv1126_rv1109_spi_nand/target -e 0x3f000 -c 0x100 -m 0x800 -v -o rootfs.ubifs
ubinize -o ubi.img -m 2048 -p 256KiB ubinize.cfg
```

4KB-Seiten, 64 Seiten/Block, 256KB-Blöcke, 64MB-Partition:

```text
mkfs.ubifs -F -d /path-to-it/buildroot/output/rockchip_rv1126_rv1109_spi_nand/target -e 0x3e000 -c 0x100 -m 0x1000 -v -o rootfs.ubifs
ubinize -o ubi.img -m 0x1000 -p 256KiB ubinize.cfg
```

Mehrvolume-Beispiel: 2KB-Seiten, 64 Seiten/Block, 128KB-Blöcke; 8MB oem und 8MB userdata zusammenfassen.

```text
mkfs.ubifs -F -d oem -e 0x1f000 -c 0x40 -m 0x800 -v -o oem.ubifs
mkfs.ubifs -F -d userdata -e 0x1f000 -c 0x40 -m 0x800 -v -o userdata.ubifs
ubinize -o oem_userdata.img -p 0x20000 -m 2048 -s 2048 -v ubinize_oem_userdata.cfg
```

ubinize_oem_userdata.cfg wie folgt setzen:

```text
[oem-volume]
mode=ubi
image=oem.ubifs
vol_id=0
vol_size=8MiB
vol_type=dynamic
vol_name=oem

[userdata-volume]
mode=ubi
image=userdata.ubifs
vol_id=1
vol_size=8MiB
vol_type=dynamic
vol_name=userdata
vol_flags=autoresize
```

Partitionen einhängen:

```text
ubiattach /dev/ubi_ctrl -m 4 -d 4 -b 5
mount -t ubifs /dev/ubi4_0 /oem
mount -t ubifs /dev/ubi4_1 /uesrdata
```

Einzelne Volumes lassen sich nicht einfach unabhängig über direkte Flashzugriffe aktualisieren. OTA-Anforderungen und Updatehäufigkeiten der Volumes sollten daher ähnlich sein.

##### 6.1.3.2 Online-Low-Level-Formatierung im Kernel

```text
umount userdata/
ubidetach -m 4
ubiformat -y /dev/mtd4
ubiattach /dev/ubi_ctrl -m 4 -d 4
ubimkvol /dev/ubi4 -N userdata -m                        # -N 指定卷名，-m 将分区设备 autorisize 可动态调整到最⼤
mount -t ubifs /dev/ubi4_0 /userdata
```

##### 6.1.3.3 UBIFS per Befehl einhängen

MTD-Gerät an UBI anbinden:

```text
ubiattach /dev/ubi_ctrl -m 4 -d 4
```

-m: MTD-Partitionsnummer. -d: resultierende UBI-Nummer, vorzugsweise gleich MTD. -b/--max-beb-per1024: erwartete maximale schlechte Eraseblocks je 1024; Hinweise:

1. Ohne Angabe gilt 20.

2. Vorgefertigtes Abbild: Reserveblöcke &lt; tatsächlicher --max-beb-per1024 &lt; konfigurierter --max-beb-per1024. Der tatsächliche Wert kann kleiner sein.

3. Beim Erstellen einer leeren UBI-Partition per Befehl entspricht der tatsächliche Wert der Einstellung.

4. Das SDK kann 10 vorgeben; ältere SDKs setzen den Wert möglicherweise nicht.

5. Zur Platzoptimierung 4 + Blockanzahl * 1%; bei 128KB-Blöcken und 16MB oem (128 Blöcke) etwa 5.

```text
mount -t ubifs /dev/ubi4_0 /oem
```

<!-- Chinese baseline PDF p.30 -->

##### 6.1.3.4 Automatisches UBIFS-Einhängen

```text
ubi.mtd=4 root=ubi0:rootfs rootfstype=ubifs
```

##### 6.1.3.5 UBI-Partitionsoverhead

Die nutzbare eingehängte UBI-Kapazität ist wegen UBIFS-Metadaten und Bad-Block-Reserve kleiner als die Partition. Genaue Berechnung:

```text
UBI overhead = (B + 4) * SP + 0 * (P - B - 4) /* 该空间⽤⼾⽆法获取 */
P - MTD 设备上物理除块的总数
SP - 物理擦除块⼤⼩,通常为 128KB 或 256KB
SL - 逻辑擦除块，即 mkfs 时 -e 参数值,通常为 block_size - 2 * page_size
B - 为坏块替换预留的 f1ash blocks,与 ubiattach- b参数相关
O - 与以字节为单位存储 EC 和 VID ⽂件头有关的开销, i.e. 0 = SP - SL
```

Beispiel 1: 128KB-Blöcke, 2KB-Seiten, 128MB-Gerät; ubiattach -b standardmäßig 20.

```text
SP = block size = 128KB
SL = 128kb - 2 * 2KB = 124KB
B = --max-beb-per1024 * n_1024 = 20 * 1 = 20
O = 128KB -124KB = 4KB
UBI overhead = (20 + 4) * 128KB + 4KB * (P - 20 - 4) = 2976KB + 4KB * P
```

Für 32MB Partition ist P = 256: UBI overhead = 2976KB + 4KB * 256 = 4000KB. Beispiel 2: 128KB-Blöcke, 2KB-Seiten, 256MB-Gerät; ubiattach -b standardmäßig 20.

```text
SP = block size = 128KB
SL = 128kb - 2 * 2KB = 124KB
B = --max-beb-per1024 * n_1024 = 20 * 2 = 40
O = 128KB -124KB = 4KB
UBI overhead = (40 + 4) * 128KB + 4KB * (P - 40 - 4) = 5456KB + 4KB * P
```

Für 32MB Partition ist P = 256: Die Quelle nennt UBI overhead = 5456KB + 4KB * 256 = 6456KB. Siehe Flash space overhead: http://www.linux-mtd.infradead.org/doc/ubi.html#L_overhead.

#### 6.1.4 SquashFS-Unterstützung über UBI Block

Kernelkonfiguration:

```text
+CONFIG_MTD_UBI_BLOCK=y
```

<!-- Chinese baseline PDF p.31 -->

rootfs in DTS festlegen:

```text
dts 中 bootargs 参数指定了 cmdline 中相关 ubi 的参数。

- ubi.mtd=4              : 选择 MTD 设备（从0开始）
- ubi.block=0,rootfs     : "rootfs" 是 vol_name (参考 ubinize.cfg), block=0 指定了ubi block的序
号
- root=/dev/ubiblock0_0  : 指定 rootfs 分区名；由 ubi block 驱动根据 ubi.block 参数⽣成的块设备
- rootfstype=squashfs    : 指定⽂件系统类型
```

Beispiel:

```text
ubi.mtd=3 ubi.block=0,rootfs root=/dev/ubiblock0_0 rootfstype=squashfs
```

Hinweise:

1. Leitet U-Boot MTD-Partitionen aus GPT ab, entsprechen sie parameter.txt eins zu eins, beginnend mit mtd0 oder mtdblock0.

2. mtd ist ein Zeichengerät, mtdblock ein Blockgerät. Für ein SquashFS-UBI-Volume erzeugt Buildroot standardmäßig SquashFS. Separat mksquashfs verwenden, etwa:

```text
sudo mksquashfs squashfs-root/ squashfs.img -noappend -always-use-fragments
```

SquashFS mit ubinize als UBI-Abbild verpacken. Zuerst ubinize.cfg erstellen:

```text
cat > ubinize.cfg << EOF
[ubifs]
mode=ubi
vol_id=0
vol_type=static
vol_name=rootfs
vol_alignment=1
vol_flags=autoresize
image=/data/rk/projs/rv1126/sdk/buildroot/output/rockchip_rv1126_robot/images/rootfs.squashfs
EOF
```

vol_type=static legt Schreibschutz fest; image gibt den SquashFS-Pfad an. Danach ubinize ausführen:

```text
ubinize -o rootfs.ubi -p 0x20000 -m 2048 -s 2048 -v ubinize.cfg
```

<!-- Chinese baseline PDF p.32 -->

-p: physische Eraseblock-Größe. -m: kleinste I/O-Einheit, 1 für NOR und Seitengröße für NAND. -s: Subseitengröße, 1 für NOR und NAND-Subseitengröße für NAND. rootfs.ubi dient zum Update. Bei NAND SquashFS auf UBI block statt mtdblock einhängen: mtdblock erkennt und überspringt keine schlechten Blöcke. Beispiel für manuelles Einhängen:

```text
ubiattach /dev/ubi_ctrl -m 4 -d 4   /* 先挂载 UBI 设备 */
ubiblock -c /dev/ubi4_0             /* UBI 设备上扩展 UBI block ⽀持 */
mount -t squashfs /dev/ubiblock4_0 /oem
```

#### 6.1.5 Image-Größe optimieren

Nutzbare Abbildkapazität lässt sich auf drei Arten optimieren:

1. --max-beb-per1024 passend wählen; siehe Punkt 5 zur -b-Erklärung beim Erstellen/Einhängen leerer UBI.

2. UBIFS-Overhead mit mehreren UBI-Volumes teilen; siehe Mehrvolume-Abbilderstellung.

3. SquashFS über UBI block verwenden; siehe entsprechenden Abschnitt. Kleinste UBIFS-Partition:

```text
Minimum block num = 4（固定预留） + B + 17  /* B - 为坏块替换预留的 f1ash blocks,与 ubiattach - b
参数相关，UBIFS_MIN_LEB_CNT 等于 17 */
```

ubiattach-Protokoll prüfen, beispielsweise:

```text
ubi4: available PEBs: 7, total reserved PEBs: 24, PEBs reserved for bad PEB handling: 20
/* B = 20 */
```

Einhängen schlägt fehl, wenn available PEBs + total reserved PEBs &lt; Minimum block num:

```text
mount: mounting /dev/ubi4_0 on userdata failed: Invalid argument
```

#### 6.1.6 UBIFS OTA

UBIFS-Partitionen mit ubiupdatevol aktualisieren:

```text
ubiupdatevol /dev/ubi1_0 rootfs.ubifs
```

<!-- Chinese baseline PDF p.33 -->

rootfs.ubifs stammt aus mkfs.ubifs, nicht aus dem abschließenden ubinize-Programmierabbild.

#### 6.1.7 UBIFS FASTMAP

FASTMAP wird als experimentelle optionale UBI-Funktion mit CONFIG_MTD_UBI_FASTMAP=y beschrieben. Bei fm_autoconvert=1 (Standard 0) erstellt UBI automatisch ein internes fastmap-Volume für schnelleres späteres Anbinden. Der Pool belegt maximal 5% physischer Blöcke und mindestens zwei für fastmaps. Größere Partitionen können profitieren; Quellenmessungen zeigten keinen deutlichen Startvorteil bei 128MB UBIFS/UBI Block SquashFS. Kernelkonfiguration:

```text
CONFIG_MTD_UBI_FASTMAP=y
```

fm_autoconvert nach Kernelstart aktivieren:

```text
echo 1 > /sys/module/ubi/parameters/fm_autoconvert
```

Danach mit ubiattach anbinden, beispielsweise:

```text
ubiattach /dev/ubi_ctrl -m 7 -d 7
```

fastmap lässt sich beim ubiattach deaktivieren; manche älteren Werkzeuge unterstützen dies nicht.

```text
ubiattach /dev/ubi_ctrl -m 7 -d 7 -f
```

Mangels deutlichen Vorteils im allgemeinen SDK standardmäßig deaktiviert; bedarfsgerecht aktivieren.

#### 6.1.8 UBIFS-Unterstützung in U-Boot

U-Boot-UBIFS unterstützt nur Lesen, kein Schreiben oder Löschen. SLC-NAND-Patch: RK3308-Unterstützung unten.

```text
CONFIG_CMD_UBI=y

diff --git a/include/configs/rk3308_common.h b/include/configs/rk3308_common.h
index 1c2b9e4461..bc861acde8 100644
--- a/include/configs/rk3308_common.h
+++ b/include/configs/rk3308_common.h
@@ -57,6 +57,9 @@
 #define CONFIG_USB_FUNCTION_MASS_STORAGE
 #define CONFIG_ROCKUSB_G_DNL_PID        0x330d
+#define MTDIDS_DEFAULT "nand0=rk-nand"
+#define MTDPARTS_DEFAULT "mtdparts=rk-nand:0x100000@0x400000(uboot),0x100000@0x500000(trust),0x600000@0x600000(boot),0x3000000@0xc00000(rootfs),0x1200000@0x4000000(oem),0x9f60000@0x6000000(userdata)"
+
 #ifdef CONFIG_ARM64
 #define ENV_MEM_LAYOUT_SETTINGS \
        "scriptaddr=0x00500000\0" \
```

SPI-NAND-Patch: RK3568-Unterstützung unten.

```text
diff --git a/include/configs/rk3568_common.h b/include/configs/rk3568_common.h
index cce44b52a8..eb93455c62 100644
--- a/include/configs/rk3568_common.h
+++ b/include/configs/rk3568_common.h
@@ -92,6 +92,9 @@
        "run distro_bootcmd;"
 #endif
+#define MTDIDS_DEFAULT "spi-nand0=spi-nand0"
+#define MTDPARTS_DEFAULT "mtdparts=spi-nand0:0x100000@0x400000(vnvm),0x440000@0x500000(uboot),0x1600000@0xa00000(boot),0x4400000@0x2000000(rootfs),0x1b60000@0x6400000(userdata)"
+
 /* rockchip ohci host driver */
 #define CONFIG_USB_OHCI_NEW
 #define CONFIG_SYS_USB_OHCI_MAX_ROOT_PORTS     1
(END)
```

Makros in menuconfig aktivieren:

```text
#define CONFIG_CMD_UBI = y
```

rootfs-Mountbeispiel; Details in doc/README.ubi.

```text
mtdpart
ubi part rootfs
ubifsmount ubi0:rootfs
ubifsls
```

U-Boot übergibt mtdparts per cmdline wie unter GPT-Erweiterung, ausgenommen MTDPARTS_DEFAULT. mtdparts zur Kernel-cmdline hinzufügen, um MTD-Partitionen zu definieren.

<!-- Chinese baseline PDF p.35 -->

#### 6.1.9 UBIFS-SDK-Konfiguration

RK3568-EVB1-Beispiel: SDK verkleinern und rootfs.ubi erzeugen, dazu buildroot/configs/rockchip_rk3568_defconfig ändern.

```text
#include "base/base.config"
#include "chips/rk3566_rk3568_aarch64.config"
#include "fs/ubifs.config"
```

Ausgabe-Symlink rootfs.img auf rootfs.ubi ändern.

```text
diff --git a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
index a2788203..31528f73 100644
--- a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
+++ b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
@@ -1,3 +1,6 @@
 RK_KERNEL_DTS_NAME="rk3568-evb1-ddr4-v10-linux"
 RK_PARAMETER="parameter-buildroot-fit.txt"
 RK_USE_FIT_IMG=y
+RK_ROOTFS_UBI=y
```

NAND-Vorgaben von 2KB-Seiten/128KB-Blöcken auf 4KB-Seiten/256KB-Blöcke ändern:

```text
diff --git a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
index a2788203..31528f73 100644
--- a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
+++ b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
@@ -1,3 +1,6 @@
 RK_KERNEL_DTS_NAME="rk3568-evb1-ddr4-v10-linux"
 RK_PARAMETER="parameter-buildroot-fit.txt"
 RK_USE_FIT_IMG=y
+RK_UBI_PAGE_SIZE=0x1000
+RK_UBI_BLOCK_SIZE=0x40000
```

RK_UBI_PAGE_SIZE und RK_UBI_BLOCK_SIZE entsprechen folgenden Buildroot-Parametern:

```text
BR2_TARGET_ROOTFS_UBI=y
BR2_TARGET_ROOTFS_UBI_PEBSIZE=0x40000
BR2_TARGET_ROOTFS_UBI_SUBSIZE=4096
BR2_TARGET_ROOTFS_UBI_OPTS="-v"
BR2_TARGET_ROOTFS_UBIFS_LEBSIZE=0x3e000
BR2_TARGET_ROOTFS_UBIFS_MINIOSIZE=4096
BR2_TARGET_ROOTFS_UBIFS_MAX_SIZE=1024
BR2_TARGET_ROOTFS_UBIFS_OPTS="-F -v"
```

Nach Parameteränderungen rootfs neu bauen und Firmware neu verpacken.

<!-- Chinese baseline PDF p.36 -->

### 6.2 JFFS2-Dateisystemunterstützung

#### 6.2.1 Einführung

JFFS2 bedeutet Journalling Flash FileSystem Version 2. Es implementiert ein Journaldateisystem direkt auf MTD, ohne Übersetzungsschicht für klassische Dateisysteme. Beim Einhängen scannt es das MTD-Journal und rekonstruiert Strukturen im RAM.

#### 6.2.2 Hinweise

1. mkfs.jffs2 kann keine JFFS2-Abbilder mit 4KB-Löschgröße vorerstellen.

1. Standard-mtd-utils unterstützt kein 4KB-Löschen.

2. RK Buildroot passt mtd-utils für 4KB an; Änderungen folgen.

```text
diff --git a/jffsX-utils/mkfs.jffs2.c b/jffsX-utils/mkfs.jffs2.c
index 9aa6c39..3cec529 100644
--- a/jffsX-utils/mkfs.jffs2.c
+++ b/jffsX-utils/mkfs.jffs2.c
@@ -1668,6 +1668,11 @@ int main(int argc, char **argv)

                          /* If it's less than 8KiB, they're not allowed */
                          if (erase_block_size < 0x2000) {
+                             if (erase_block_size == 0x1000) {
+                                 warnmsg("Set Erase size to 4KB with Experimental.\n");
+                                 erase_block_size = 0x1000;
+                                 break;
+                             }
                              fprintf(stderr, "Erase size 0x%x too small. Increasing to 8KiB minimum\n",
                                      erase_block_size);
                              erase_block_size = 0x2000;
diff --git a/jffsX-utils/sumtool.c b/jffsX-utils/sumtool.c
index 68268a9..836b426 100644
--- a/jffsX-utils/sumtool.c
+++ b/jffsX-utils/sumtool.c
@@ -194,6 +194,11 @@ static void process_options (int argc, char **argv)

                          /* If it's less than 8KiB, they're not allowed */
                          if (erase_block_size < 0x2000) {
+                             if (erase_block_size == 0x1000) {
+                                 warnmsg("Set Erase size to 4KB with Experimental.\n");
+                                 erase_block_size = 0x1000;
+                                 break;
+                             }
                              warnmsg("Erase size 0x%x too small. Increasing to 8KiB minimum\n",
                                    erase_block_size);
                              erase_block_size = 0x2000;
--
2.23.0-rc1
```

2. Kernel-JFFS2 unterstützt NOR-4KB-Löschen und flash_erase -j zur Low-Level-Formatierung einer nutzbaren 4KB-JFFS2-Partition.

#### 6.2.3 Konfiguration

Kernelkonfiguration:

```text
CONFIG_JFFS2_FS=y
CONFIG_MTD_SPI_NOR_USE_4K_SECTORS=n /* 内核版本 5.10 及更⾼版本可配 */
```

Ab Linux 5.10 nutzt RK SPI NOR das Standard-MTD-NOR-Framework. Die meisten Bausteine besitzen SECT_4K; CONFIG_MTD_SPI_NOR_USE_4K_SECTORS wählt 64KB/4KB. 64KB ist schneller (GD25Q256E typisch 0.12s/0.15s), verschwendet durch Ausrichtung aber mehr Platz. 4KB ist langsamer (typisch 30ms, unter einem Drittel des Blocklöschdurchsatzes), nutzt Platz jedoch besser.

#### 6.2.4 Image erstellen

Beispiel zur Abbilderstellung:

```text
mkfs.jffs2 -r data/ -o data.jffs2 -e 0x10000 --pad=0x400000 -s 0x1000 -n
Options:
 --pad [=SIZE]            Pad output to SIZE bytes with 0xFF. If SIZE is
                          not specified, the output is padded to the end of
                          the final erase block
  -r, -d, --root=DIR      Build file system from directory DIR (default: cwd)
  -s, --pagesize=SIZE     Use page size (max data node size) SIZE.
                          Set according to target system's memory management
                          page size (default: 4KiB)
  -e, --eraseblock=SIZE   Use erase block size SIZE (default: 64KiB)
  -n, --no-cleanmarkers   Don't add a cleanmarker to every eraseblock
```

--pad: Partitionsgröße. -e: Löschgröße, standardmäßig nur 64KB; mtd-utils für 4KB gemäß Hinweisen anpassen. -s: standardmäßig 4KB.

<!-- Chinese baseline PDF p.38 -->

## 7 Flashen mit einem Programmiergerät

### 7.1 SPI-NAND-Image flashen: GPT

#### 7.1.1 SPI-NAND-Programmierimage erstellen

Eingabe: SDK-Ausgabeabbilder für PC-Flashwerkzeuge.

```text
[/IMAGES] tree
.
├── parameter.txt
├── MiniLoaderAll.bin
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

programmer_image_tool liegt unter SDK rkbin/. Verwendung:

```text
./tools/programmer_image_tool  --help
NAME
        programmer_image_tool - creating image for programming on flash
SYNOPSIS
        programmer_image_tool [-iotbpsvh]
DESCRIPTION
        This tool aims to convert firmware into image for programming
        From now on,it can support slc nand(rk)|spi nand|nor|emmc.
OPTIONS:
          -i    input firmware
          -o    output directory
          -t    storage type,range in[SLC|SPINAND|SPINOR|EMMC]
          -b    block size,unit KB
          -p    page size,unit KB
          -s    oob size,unit B
          -2    2k data in one page
          -l    using page linked l
```

Beispiel: rv1126 mit 128KB-Blöcken, 2KB-Seiten; 256KB, 4KB * 64.

```text
./tools/programmer_image_tool  -i update.img -b 128 -p 2 -t spinand -o out
input firmware is 'update.img'
block size is '128'
page size is '2'
flash type is 'spinand'
output directory is 'out'
writing idblock...
start to write partitions...gpt=1
preparing gpt saving at out/gpt.img
writing gpt...OK
preparing trust saving at out/trust.img
writing trust...OK
preparing uboot saving at out/uboot.img
writing uboot...OK
preparing boot saving at out/boot.img
writing boot...OK
preparing rootfs saving at out/rootfs.img
writing rootfs...OK
preparing recovery saving at out/recovery.img
writing recovery...OK
preparing oem saving at out/oem.img
writing oem...OK
preparing userdata:grow saving at out/userdata:grow.img
writing userdata:grow...OK
preparing misc saving at out/misc.img
writing misc...OK
creating programming image ok.
```

Für 4KB-Seiten -2 zu programmer_image_tool hinzufügen. Ausgabe: Programmiergeräteabbilder.

```text
out
├── boot.img
├── gpt.img
├── idblock.img            // ⾃⾏根据需求制作 idblock_mutli_copies.img 的多备份镜像
├── misc.img
├── oem.img
├── recovery.img
├── rootfs.img
├── trust.img
├── uboot.img
└── userdata.img
```

Beispiel für mehrere IDB-Kopien; zwei genügen normalerweise:

```text
cat out/idblock.img > out/idblock_mutli_copies.img   // 1 copy
cat out/idblock.img >> out/idblock_mutli_copies.img  // 2 copies
```

<!-- Chinese baseline PDF p.40 -->

#### 7.1.2 SPI NAND mit Programmiergerät flashen

Programmieradressen: Vergleich von PC-Werkzeug und Programmiergerät bei 128KB-Flashblöcken:

| Quelldatei des Programmierimages: Standardausgabe des SDK | Sektoradresse des PC-Programmierwerkzeugs | Programmierimage | Blockstartadresse des Programmiergeräts | Endadresse | Firmwaregröße | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- |
| paramter.txt | 0 | gpt.img | 0x0 | 0x1 | 0x1 | Hinweis 1 |
| MiniLoaderAll.bin | 0 | idblock_mutli_copies.img | 0x1 | 0x7 | 0x6 | Hinweis 2 |
| uboot.img | 0x2000 | uboot.img | 0x20 | 0x47 | 0x20 | Hinweis 3 |
| boot.img | 0x4800 | boot.img | 0x48 | 0xa0 | 0x50 |  |
| ... | ... | ... | ... |  |  |  |
| xxx.img | 0x3E000 | xxx.img | 0x3e0 | 0x3fb | 0x18 | Hinweis 4 |

Tabellenhinweise:

1. gpt.img in Block 0 schreiben; U-Boot repariert/erzeugt Backup-GPT automatisch.

2. idblock_mutli_copies.img beginnt bei Block 1 und endet bei Block 7; Abbild kleiner als Partition halten, einen Ersatzblock reservieren.

3. Außer speziellen Adressen für gpt.img/idblocks.img gilt parameter.txt. Die Quelle schreibt 512B/s als Sektoreinheit; gerechnet wird mit 512 Byte: Blockadresse = sectors * 512B / block_size, also sectors / 0x100 bei 128KB und / 0x200 bei 256KB. Außer gpt.img Abbilder 1–2 Blöcke kleiner als Partitionen halten.

4. Letzte vier Flashblöcke für Bad-Block-Tabelle reservieren. Benutzerpartitionen dürfen nicht hineinreichen; eine reverved-Partition (Quellschreibweise) gegen Nutzung/Missbrauch erwägen. Weitere Hinweise:

1. RK-SPI-NAND-FSPI (früher SFC) besitzt keine ECC; Geräte-ECC ist nötig. Abbilder enthalten keine OOB-Daten; das Programmiergerät füllt OOB mit FF und aktiviert Geräte-ECC.

2. Bei nicht leerem Flash vor dem Programmieren alle guten Blöcke löschen.

3. Programmierprüfung aktivieren.

<!-- Chinese baseline PDF p.41 -->

### 7.2 SLC-NAND-Image flashen: GPT

#### 7.2.1 SLC-NAND-Programmierimage erstellen

Eingabe: SDK-Ausgabeabbilder für PC-Flashwerkzeuge.

```text
[/IMAGES] tree
.
├── parameter.txt
├── MiniLoaderAll.bin
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

Abbilderstellungsbeispiel: rv1126, 128KB-Blöcke, 2KB-Seiten, OOB-Größe 128.

```text
./tools/programmer_image_tool -i update.img -b 128 -p 2 -s 128 -t slc -o out
input firmware is 'update.img'
block size is '128'
page size is '2'
oob size is '128'
flash type is 'slc'
2k data page on.
output directory is 'out'
writing idblock...
start to write partitions...gpt=1
preparing gpt saving at out/gpt.img
writing gpt...OK
preparing trust saving at out/trust.img
writing trust...OK
preparing uboot saving at out/uboot.img
writing uboot...OK
preparing boot saving at out/boot.img
writing boot...OK
preparing rootfs saving at out/rootfs.img
writing rootfs...OK
preparing recovery saving at out/recovery.img
writing recovery...OK
preparing oem saving at out/oem.img
writing oem...OK
preparing userdata:grow saving at out/userdata:grow.img
writing userdata:grow...OK
preparing misc saving at out/misc.img
writing misc...OK
creating programming image ok.
```

<!-- Chinese baseline PDF p.42 -->

Für RK3326/PX30/RK3568 -l zur Änderung der Listenverknüpfung hinzufügen; für RV1126/RK3326/PX30/RK3308 mit 4KB-Seiten -2. Ausgabe auf Blockgröße mit OOB ausgerichtet; siehe NAND-Informationen. Ausgabe für Programmiergerät.

```text
out
├── boot.img
├── gpt.img
├── idblock.img            // ⾃⾏根据需求制作 idblock_mutli_copies.img 的多备份镜像
├── misc.img
├── oem.img
├── recovery.img
├── rootfs.img
├── trust.img
├── uboot.img
└── userdata.img
```

Befehlsreferenz für IDB-Mehrfachkopien; Backup genügt normalerweise:

```text
cat out/idblock.img > out/idblock_mutli_copies.img   // 1 copy
cat out/idblock.img >> out/idblock_mutli_copies.img  // 2 copies
```

#### 7.2.2 SLC NAND mit Programmiergerät flashen

Programmieradressen: Vergleich von PC-Werkzeug und Programmiergerät bei 128KB-Flashblöcken:

| Quelldatei des Programmierimages: Standardausgabe des SDK | Sektoradresse des PC-Programmierwerkzeugs | Programmierimage | Blockstartadresse des Programmiergeräts | Endadresse | Firmwaregröße | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- |
| paramter.txt | 0 | gpt.img | 0x0 | 0x1 | 0x1 | Hinweis 1 |
| MiniLoaderAll.bin | 0 | idblock_mutli_copies.img | 0x1 | 0x7 | 0x6 | Hinweis 2 |
| uboot.img | 0x2000 | uboot.img | 0x20 | 0x47 | 0x20 | Hinweis 3 |
| boot.img | 0x4800 | boot.img | 0x48 | 0xa0 | 0x50 |  |
| ... | ... | ... | ... |  |  |  |
| xxx.img | 0x3E000 | xxx.img | 0x3e0 | 0x3fb | 0x18 | Hinweis 4 |

Tabellenhinweise:

<!-- Chinese baseline PDF p.43 -->

1. gpt.img in Block 0 programmieren.

2. idblock_mutli_copies.img beginnt bei Block 1, endet bei Block 7 und muss unter sieben Blöcken bleiben; einen Ersatzblock reservieren.

3. Außer speziellen Adressen für gpt.img/idblocks.img gilt parameter.txt. Die Quelle schreibt 512B/s als Sektoreinheit; gerechnet wird mit 512 Byte: Blockadresse = sectors * 512B / block_size, also sectors / 0x100 bei 128KB und / 0x200 bei 256KB. Außer gpt.img Abbilder 1–2 Blöcke kleiner als Partitionen halten.

4. Letzte vier Flashblöcke für Bad-Block-Tabelle reservieren. Benutzerpartitionen dürfen nicht hineinreichen; eine reverved-Partition (Quellschreibweise) gegen Nutzung/Missbrauch erwägen. Weitere Hinweise:

1. Alle Abbilder enthalten OOB-Daten.

2. Bei nicht leerem Flash vor dem Programmieren alle guten Blöcke löschen.

3. Programmierprüfung aktivieren.

### 7.3 SPI-NOR-Image flashen: GPT

#### 7.3.1 SPI-NOR-Programmierimage erstellen

Eingabe: SDK-Ausgabeabbilder für PC-Flashwerkzeuge.

```text
[/IMAGES] tree
.
├── parameter.txt
├── MiniLoaderAll.bin
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

Beispiel zur Abbilderstellung:

```text
./tools/programmer_image_tool -i update.img  -t SPINOR -o ./out
input firmware is 'update.img'
flash type is 'SPINOR'
output directory is './out'
writing idblock...
start to write partitions...gpt=1
preparing gpt at 0x00000000
writing gpt...OK
preparing trust at 0x00002800
writing trust...OK
preparing uboot at 0x00002000
writing uboot...OK
preparing boot at 0x00009800
writing boot...OK
preparing rootfs at 0x0000c800
writing rootfs...OK
preparing recovery at 0x00003800
writing recovery...OK
preparing misc at 0x00003000
writing misc...OK
creating programming image ok.
```

Ausgabe: Abbilder für das Programmiergerät.

```text
tree
.
└── out_image.img
```

#### 7.3.2 SPI NOR mit Programmiergerät flashen

programmer_image_tool-Ausgabe an SPI-NOR-Adresse 0 schreiben.

### 7.4 SPI-NAND-Image flashen: ENV

#### 7.4.1 SPI-NAND-Programmierimage erstellen

Eingabe: SDK-Abbilder.

```text
[/IMAGES] tree
.
├── boot.img
├── download.bin
├── env.img
├── idblock.img
├── oem_2KB_128KB_48MB.ubi
├── oem_2KB_256KB_48MB.ubi
├── oem_4KB_256KB_48MB.ubi
├── oem.img
├── rootfs_2KB_128KB_32MB.ubi
├── rootfs_2KB_256KB_32MB.ubi
├── rootfs_4KB_256KB_32MB.ubi
├── rootfs.img
├── sd_update.txt
├── tftp_update.txt
├── uboot.img
├── update.img
├── userdata_2KB_128KB_32MB.ubi
├── userdata_2KB_256KB_32MB.ubi
├── userdata_4KB_256KB_32MB.ubi
└── userdata.img
```

SDK-Abbilder dienen PC-Upgrades und Programmiergeräten. Standard-idblock.img unterstützt SPI NAND mit 2KB-Seiten; für 4KB neu erstellen. Ausgabe bleibt idblock.img:

```text
./rkbin/tools/programmer_image_tool  -i download.bin -b 256 -p 4 -2 -t spinand -o ./
```

#### 7.4.2 SPI NAND mit Programmiergerät flashen

Programmieradressen: Vergleich von PC-Werkzeug und Programmiergerät bei 128KB-Flashblöcken:

| Quelldatei des Programmierimages: Standardausgabe des SDK | Sektoradresse des PC-Programmierwerkzeugs | Programmierimage | Blockstartadresse des Programmiergeräts | Endadresse | Firmwaregröße | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- |
| env.img | 0 | env.img | 0x0 | 0x1 | 0x1 | Hinweis 1 |
| idblock.img | 0x40000 | idblock_mutli_copies.img | 0x1 | 0x3 | 0x3 | Hinweis 2 |
| uboot.img | 0x80000 | uboot.img | 0x4 | 0x7 | 0x4 | Hinweis 3 |
| boot.img | 0xC0000 | boot.img | 0x8 | 0x47 | 0x40 |  |
| ... | ... | ... | ... |  |  |  |
| xxx.img | 0x58C0000 | xxx.img | 0x2c6 | 0x3fc | 0x136 | Hinweis 4 |

Tabellenhinweise:

1. env.img in Block 0 schreiben.

2. idblock_mutli_copies.img beginnt bei Block 1 und endet bei Block 3; unter Partitionsgröße mit einem Reserveblock bleiben.

3. Außer speziellen gpt.img/idblocks.img (Quellwortlaut) Byteadressen aus env.img verwenden. Blockadresse = address / block_size: / 0x20000 bei 128KB, / 0x40000 bei 256KB. Außer env.img 1–2 Reserveblöcke pro Partition lassen.

4. Letzte vier Flashblöcke für Bad-Block-Tabelle reservieren. Benutzerpartitionen dürfen nicht hineinreichen; eine reverved-Partition (Quellschreibweise) gegen Nutzung/Missbrauch erwägen. Weitere Hinweise:

<!-- Chinese baseline PDF p.46 -->

1. RK-SPI-NAND-FSPI (früher SFC) besitzt keine ECC; Geräte-ECC ist nötig. Abbilder enthalten keine OOB-Daten; das Programmiergerät füllt OOB mit FF und aktiviert Geräte-ECC.

2. Bei nicht leerem Flash vor dem Programmieren alle guten Blöcke löschen.

3. Programmierprüfung aktivieren.

### 7.5 SPI-NOR-Image flashen: ENV

#### 7.5.1 SPI-NOR-Programmierimage erstellen

Eingabe: SDK-Ausgabeabbilder für PC-Flashwerkzeuge.

```text
[/IMAGES] tree
.
├── env.img
├── idblock.img
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

Beispiel zur Abbilderstellung:

```text
./tools/programmer_image_tool -i update.img  -t SPINOR -o ./out
input firmware is 'update.img'
flash type is 'SPINOR'
output directory is './out'
start to write partitions...env
preparing env at 0x00000000
writing env...OK
preparing idblock at 0x00000200
writing idblock...OK
preparing uboot at 0x00000400
writing uboot...OK
preparing boot at 0x00000600
writing boot...OK
preparing rootfs at 0x00004600
writing rootfs...OK
preparing oem at 0x00014600
writing oem...OK
preparing userdata at 0x0002c600
writing userdata...OK
creating programming image ok.
```

Ausgabe: Abbilder für das Programmiergerät.

<!-- Chinese baseline PDF p.47 -->

```text
tree
.
└── out_image.img
```

#### 7.5.2 SPI NOR mit Programmiergerät flashen

programmer_image_tool-Ausgabe an SPI-NOR-Adresse 0 schreiben.

## 8 Testfälle

### 8.1 Tests für NAND-Flash-Produkte

Gilt für SLC-Parallel-NAND- und SPI-NAND-Produkte.

#### 8.1.1 Lese-/Schreib-Stresstest flash_stress_test

Ziel: SPI-NAND-Stabilität unter Lese-/Schreiblast. Tests sind meist in SDK Buildroot integriert; rockchip_test aktivieren. Zehn Geräte mit etwa 30MB Reserve in userdata vorbereiten. Ablauf:

1. „3 flash_stress_test“ in SDK Buildroot ./rockchip_test/rockchip_test.sh wählen. Versorgung nicht unterbrechen.

Testprotokolle aufzeichnen.

3. Am Host mit ctrl + c stoppen.

Bestanden bei normalem Betrieb nach 24 Stunden, sonst fehlgeschlagen. Protokolle nach ubi und error durchsuchen.

#### 8.1.2 Unerwarteter Stromausfall: power_lost_test

NAND-Produkte, besonders ohne Batterie, erleben unerwartete Stromausfälle; gezielte Robustheitstests werden empfohlen. Tests sind meist in SDK Buildroot vorhanden; rockchip_test hinzufügen. Zehn Geräte mit etwa 30MB in userdata vorbereiten. Ablauf:

1. „18 nand power lost test“ in ./rockchip_test/rockchip_test.sh wählen. Nach erneutem Einschalten beginnt Dauertest; serielle Protokolle aufzeichnen.

<!-- Chinese baseline PDF p.48 -->

2. 14 Sekunden versorgen, 3 Sekunden ausschalten: 17-Sekunden-Zyklen für 24 Stunden, etwa 5000 Ausfälle. Jeder Neustart muss Boot und Skriptstart innerhalb 17 Sekunden schaffen.

Testprotokolle aufzeichnen.

4. Vom Host stoppen: echo off &gt; /data/cfg/rockchip_test/reboot_cnt

Bestanden bei normalem Betrieb nach 24 Stunden, sonst fehlgeschlagen. Protokolle nach ubi und error durchsuchen.

## 9 Häufige Fragen

### 9.1 Informationen zu NAND Flash

Für UBIFS und IDB (Pre loader) NAND-Parameter dem Handbuch entnehmen: Seiten meist 2KB/4KB, OOB 64B/128B/256B, Seiten/Block 64/128. block size = page_size * page_per_block, meist 128KB/256KB; mit OOB: (page_size + oob_size) * page_per_block. Programmiergeräte-/UBIFS-Abbilder nutzen oft 2KB/128KB als Vorgabe; für andere Bausteine nach Handbuch anpassen.

![Abbildung der englischen Quelle, Seite 52](/docs/rockchip-flash-open-source/assets/en-p052-figure-01.png)

*Abbildung der englischen Quelle, Seite 52*

<!-- Chinese baseline PDF p.49 -->

### 9.2 IDB-Layout

IDB verpackt ddr.bin und spl.bin als erste Firmware nach Masken-ROM. PC-Werkzeuge füllen Blöcke 1–7 mit Kopien. Programmiergeräteplatzierung siehe Programmieradressen im entsprechenden Kapitel.

### 9.3 SPI-Flash-Durchsatz im Kernel messen

Freie MTD-Partition ohne eingehängtes Dateisystem wählen, um Einflüsse zu vermeiden; mit mtd_debug messen:

```text
#测试准备
dd if=/dev/random of=/tmp/test4M bs=1M count=4
mtd_debug read /dev/mtd6 0 0x400000 /tmp/test_backup
sync

#写速率测试
mtd_debug erase /dev/mtd6 0 0x400000 && sync
time mtd_debug write /dev/mtd6 0 0x400000 /tmp/test4M && time sync

#读测试
time mtd_debug read /dev/mtd6 0 0x400000 /tmp/test4M && time sync

#擦除测试
time mtd_debug erase /dev/mtd6 0 0x400000 && time sync

#测试结束
time mtd_debug write /dev/mtd6 0 0x400000 /tmp/test_backup && time sync
```

SPI-NAND-Beispiel W25N01KVxxIR, AC Electrical Characteristics: 128KB-Block, 2KB-Seite; typisch tBE 2ms, tPP 250us, tRD mit ECC 45us. Bei 100MHz Single-Line-I/O tIO 160us, Schreiben page_size/(tPP+tIO) etwa 5MB/s; Kernel schreibt standardmäßig einspurig. Bei 100MHz Quad-I/O tIO 40us, Lesen page_size/(tRD+tIO) etwa 23MB/s.

<!-- Chinese baseline PDF p.50 -->

Löschen ohne I/O-Verzögerung: block_size/tBE ≈64MB/s. SPI-NOR-Beispiel XT25F128B: 64KB-Block, 256B-Seite, typisch tBE 200ms und tPP 300us, Lesen nahe tIO. Bei 100MHz Single-Line und Quellwert tIO 160us ergibt page_size/(tPP+tIO) ≈557KB/s; Kernel schreibt standardmäßig einspurig. Lesen bei 100MHz Quad etwa 50MB/s. Löschen block_size/tBE ≈320KB/s.

### 9.4 Lebensdauer von NAND-Produkten

NAND-Lebensdauer wird in P/E-Zyklen angegeben, oft 100K. Reserve einplanen: Hersteller begrenzen wiederholte Zugriffe auf denselben Block und teils die Datenbalance zur Ladungserhaltung. Tatsächliche Lebensdauer und Herstellerunterschiede berücksichtigen, beispielsweise 50% bzw. 50K Zyklen. Eine 100M-Partition erlaubt dann 50K * 100M Rohdaten. Dateisystempolitik reduziert dies: UBIFS-Overhead etwa 20% (rund 25KB eines 128KB-Blocks), somit 50K * 100M * 80% = 4T Nutzdaten. Bei 50% Kompression etwa 8T Benutzerdaten. Nur Hauptfaktoren sind berücksichtigt; Dateisystem, Kompression und tatsächliche Lebensdauer verändern das Ergebnis. UBIFS gibt beim Start Partitions-P/E aus:

```text
ubi0: max/mean erase counter: 164/10, WL threshold: 4096, image sequence number: 207598880
```

Erläuterung:

<!-- Chinese baseline PDF p.51 -->

max ist die höchste Blocklöschzahl der Partition. Nach Belastung vergleichen: Anstieg um 100 in 24h bei reduziertem 50K-P/E-Budget ergibt 500 Tage. Ohne Dateisystem überwacht folgender Patch userdata:

```text
diff --git a/drivers/mtd/mtdcore.c b/drivers/mtd/mtdcore.c
index ad527bdbd463..ae34665e5c89 100644
--- a/drivers/mtd/mtdcore.c
+++ b/drivers/mtd/mtdcore.c
@@ -36,6 +36,28 @@

 struct backing_dev_info *mtd_bdi;

+#include <linux/moduleparam.h>
+
+static int e_count;
+module_param(e_count, int, S_IRUGO);
+MODULE_PARM_DESC(e_count, "e_count");
+
+static int p_count;
+module_param(p_count, int, S_IRUGO);
+MODULE_PARM_DESC(p_count, "p_count");
+
+static int r_count;
+module_param(r_count, int, S_IRUGO);
+MODULE_PARM_DESC(r_count, "r_count");
+
+static inline int mtd_trace(struct mtd_info *mtd, char *cmp_name, int len)
+{
+       if (cmp_name && strcmp(mtd->name, cmp_name))
+               return 0;
+       else
+               return len;
+}
+
 #ifdef CONFIG_PM_SLEEP

 static int mtd_cls_suspend(struct device *dev)
@@ -1336,6 +1358,8 @@ int mtd_erase(struct mtd_info *mtd, struct erase_info *instr)
        struct erase_info adjinstr;
        int ret;

+       e_count += mtd_trace(mtd, "userdata", mtd->erasesize);
+
        instr->fail_addr = MTD_FAIL_ADDR_UNKNOWN;
        adjinstr = *instr;

@@ -1467,6 +1491,8 @@ int mtd_read(struct mtd_info *mtd, loff_t from, size_t len, size_t *retlen,
        };
        int ret;

+       r_count += mtd_trace(mtd, "userdata", len);
+
        ret = mtd_read_oob(mtd, from, &ops);
        *retlen = ops.retlen;

@@ -1483,6 +1509,8 @@ int mtd_write(struct mtd_info *mtd, loff_t to, size_t len, size_t *retlen,
        };
        int ret;

+       p_count += mtd_trace(mtd, "userdata", len);
+
        ret = mtd_write_oob(mtd, to, &ops);
        *retlen = ops.retlen;

(END)
```

Gepatchte Firmware installieren, belasten und Lösch-/Programmier-/Lesemengen e/p/r in Byte abfragen:

```text
cat /sys/module/mtd/parameters/e_count
cat /sys/module/mtd/parameters/p_count
cat /sys/module/mtd/parameters/r_count
```

Geschriebene MB pro Stunde berechnen. 50MB bei 100K P/E ergeben nominal 5T; Lebensdauer = Gesamtdaten / stündliche Schreibmenge. Im Quellmodell ist P/E das Hauptmaß, andere Werte wirken weniger.

### 9.5 Unerwarteter Stromausfall bei NAND

Unerwarteter Stromverlust umgeht die normale Deinitialisierung und kann NAND bei instabiler Spannung betreiben. Besonders betroffen sind Löschen (Millisekunden) und Programmieren (Hunderte Mikrosekunden). Ein 3V3-Baustein benötigt meist mindestens 2.7V; Handbuch prüfen. Typische Fehler sind unvollständige Schreibdaten sowie:

<!-- Chinese baseline PDF p.53 -->

Befehle bei instabiler Spannung können Zufallsfehler auslösen. Dateisystemwiederherstellung schützt die Struktur bei unvollständigen Schreibzugriffen, Daten können verloren gehen. PMIC überwacht eine Schiene und setzt CPU unter einer Schwelle zurück, stoppt NAND-Lösch-/Schreibbefehle; Entladeschaltung hält etwa 1ms Arbeitsspannung für die letzte Operation. Reset IC arbeitet ähnlich. RK NPOR löst unter Schwelle einen Interrupt aus und erlaubt Spannungsstatusabfragen. Batterie oder konstante Versorgung bevorzugen. Andernfalls VCC IO per PMIC/Reset IC/RK NPOR überwachen und CPU vor Niederspannungszugriffen zurücksetzen; VCC3V3-Kondensatoren anhand RK-Schaltplänen für tPROG, möglichst tBERS, optimieren. Ausfälle während Zugriffen reduzieren. Schlüsseldaten durch doppelte Firmware und Nur-Lese-Speicher schützen; beschreibbare Partitionen brauchen Wiederherstellung oder OTA. Unter realen Produkt-/Lastbedingungen power_lost_test durchführen und VCC3V3/RESETn-Abschaltzeiten erfassen:

![Abbildung der englischen Quelle, Seite 57](/docs/rockchip-flash-open-source/assets/en-p057-figure-01.png)

*Abbildung der englischen Quelle, Seite 57*

<!-- Chinese baseline PDF p.54 -->

Am Oszilloskop RESETn-Auslösung als Y1, VCC3V3-Abfall auf 2V7 als Y2 markieren (Bausteinminimum beachten). ΔY1Y2 mehrfach messen und Minimum nehmen; Überlagerung kann helfen. Bei einigen RKNPOR-SoCs ist RESETn intern; stattdessen letzte fallende FSPI-CSN-Flanke nutzen, etwa RV1106.

### 9.6 Kernel-Skripte zum Flash-Signaltest

MTD_TESTS liegt in drivers/mtd/tests. Bei SPI-NAND-Schreibsignaltests Verzögerungen statt häufiger Statusabfragen ergänzen.

```text
diff --git a/drivers/mtd/nand/spi/core.c b/drivers/mtd/nand/spi/core.c
index f0ba92a09ae5..3f1d09200f74 100644
--- a/drivers/mtd/nand/spi/core.c
+++ b/drivers/mtd/nand/spi/core.c
@@ -573,6 +573,7 @@ static int spinand_write_page(struct spinand_device *spinand,
        if (ret)
                return ret;

+       mdelay(1);
        ret = spinand_wait(spinand, &status);
        if (!ret && (status & STATUS_PROG_FAILED))
                ret = -EIO;
```

CONFIG_MTD_TESTS=m aktivieren. Module: mtd_readtest.ko, mtd_torturetest.ko. Testmodule übertragen:

```text
adb push mtd_readtest.ko mtd_torturetest.ko /data
```

Lese-/Schreibbefehle:

<!-- Chinese baseline PDF p.55 -->

```text
insmod /data/mtd_readtest.ko dev=0 cycles_count=10                  # 读测试，可以通过修改 cycles_count 来调整测试时⻓
rmmod mtd_readtest                                                  # 读测试清除，如需重新测试，重新 insmod

insmod /data/mtd_torturetest.ko dev=0 check=0 cycles_count=10 random_pattern=1      # 写测试，可以通过修改 cycles_count 来调整测试时⻓
rmmod mtd_torturetest                                               # 写测试清除，如需重新测试，重新 insmod
```

Für Lesen große Partition mit gültigen Daten wählen, damit Pegelwechsel sichtbar sind. Für Schreiben freie Partition wählen, um den Betrieb nicht zu stören.

### 9.7 Update- oder Startfehler nach Austausch gegen einen unterstützten Flash-Baustein

Neue Flashbausteine benötigen meist aktualisierte Speichertreiber. Redmine-Zugang bei RK anfordern und Speicherpatches synchronisieren.

### 9.8 Sporadische Startfehler oder Prüfsummenfehler beim Dateisystemlesen

Signaländerungen versuchen; besteht danach der Belastungstest, Signalqualität messen und optimieren. Frequenz gemäß Kernel-Grundkonfiguration senken. Für einspuriges MTD spi-rx-bus-width im DTS-spiflash-Knoten auf 1 setzen. rkflash-SPI-NAND-Patch folgt:

```text
diff --git a/drivers/rkflash/sfc_nand.c b/drivers/rkflash/sfc_nand.c
index 4accf3d791c6..98b1cfecc821 100644
--- a/drivers/rkflash/sfc_nand.c
+++ b/drivers/rkflash/sfc_nand.c
@@ -1179,6 +1179,8 @@ u32 sfc_nand_init(void)
                return -ENOMEM;
        }

+       p_nand_info->feature &= ~(FEA_4BIT_READ | FEA_4BIT_PROG); // 单线写、单线读
+       // p_nand_info->feature &= (~FEA_4BIT_PROG); // 单线写、四线读
        if (p_nand_info->feature & FEA_4BIT_READ) {
                if ((p_nand_info->has_qe_bits && sfc_nand_enable_QE() == SFC_OK) ||
                    !p_nand_info->has_qe_bits) {
```

rkflash-SPI-NOR-Single-Line-Patch:

```text
diff --git a/drivers/rkflash/sfc_nor.c b/drivers/rkflash/sfc_nor.c
index c38801b4fb0d..4badff4249ac 100644
--- a/drivers/rkflash/sfc_nor.c
+++ b/drivers/rkflash/sfc_nor.c
@@ -678,7 +678,9 @@ static int snor_parse_flash_table(struct SFNOR_DEV *p_dev,
                        p_dev->write_status = snor_write_status1;
                else if (i == 2)
                        p_dev->write_status = snor_write_status2;

+               g_spi_flash_info->feature &= ~(FEA_4BIT_READ | FEA_4BIT_PROG); // 单线写、单线读
+               // g_spi_flash_info->feature &= ~(FEA_4BIT_PROG); // 单线写、四线读
                if (g_spi_flash_info->feature & FEA_4BIT_READ) {
                        ret = SFC_OK;
                        if (g_spi_flash_info->QE_bits)
```

### 9.9 UBIFS mit ro ist nicht wirklich schreibgeschützt

Auch bei ro-Mount können UBIFS-Hintergrundalgorithmen NAND löschen/schreiben. Für echtes Nur-Lesen SquashFS auf UBI Block verwenden.

### 9.10 SPI-NOR-ROM-Schnellstart

RK-SPI-NOR-ROM-Schnellstart: PC-usbplug ergänzt gültiges Loader-idblock automatisch um bootconfig. Programmiergeräte-Standard: vorgefertigte Abbilder ohne bootconfig bieten keinen ROM-Schnellstart; beim ersten Kernelstart ergänzt idb_bootconfig die Daten mit einem idblock-Lösch-/Schreibvorgang. Alternative Vorverarbeitung: BOOT0_PARAM zur passenden rkbin/RKBOOT-Pack-INI hinzufügen, um bootconfig in idblock.img einzufügen. Parameter aus seriellen PC-Flashprotokollen entnehmen, beispielsweise:

```text
[BOOT0_PARAM]
WORD_0=0x524f4e53
WORD_1=0x0
WORD_2=0xe
WORD_3=0x326b0203
WORD_4=0x90dd820
WORD_5=0x2000000
WORD_6=0x0
WORD_7=0x0
WORD_8=0x0
WORD_9=0x0
```

<!-- Chinese baseline PDF p.57 -->

Entsprechende Informationen zur INI hinzufügen:

```text
diff --git a/RKBOOT/RV1103BMINIALL.ini b/RKBOOT/RV1103BMINIALL.ini
index de54116c2106..4b27d284c5f4 100644
--- a/RKBOOT/RV1103BMINIALL.ini
+++ b/RKBOOT/RV1103BMINIALL.ini
@@ -25,3 +25,14 @@ NEWIDB=true
 471_RC4_OFF=true
 RC4_OFF=true
 CREATE_IDB=true
+[BOOT0_PARAM]
+WORD_0=0x524f4e53
+WORD_1=0x0
+WORD_2=0xe
+WORD_3=0x326b0203
+WORD_4=0x90dd820
+WORD_5=0x2000000
+WORD_6=0x0
+WORD_7=0x0
+WORD_8=0x0
+WORD_9=0x0
```

### 9.11 Weitere Fehlerdiagnose

Weitere Fragen: Rockchip_Developer_FAQ_Storage_CN.pdf (Redmine-Schreibweise Rokchip_Developer_FAQ_Storage_CN.pdf). Grundlagen: Flash-Einführung und Bausteinprüfung in Rockchip_Application_Notes_Storage_CN.pdf (Redmine: Rockchip_Application_Notes_Storage_CN). Dual-Storage-Treiber: Rockchip_Developer_Guide_Dual_Storage_CN.pdf, gleicher Redmine-Pfad.

## 10 Referenzen im Anhang

[1] UBI FAQ: http://www.linux-mtd.infradead.org/faq/ubi.html
[2] UBIFS FAQ: http://www.linux-mtd.infradead.org/faq/ubifs.html#L_lebsz_mismatch
[3] MTD FAQ: http://www.linux-mtd.infradead.org/faq/general.html

### Ergänzungen der englischen Quelle und genaue Unterschiede

Englisch §6.1.4 ergänzt: ubinize `-p, --peb-size` ist obligatorisch und akzeptiert die physische Löschblockgröße in bytes, KiB oder MiB. `-s, --sub-page-size` bezeichnet die minimale E/A-Einheit für UBI-Header, etwa eine NAND-Unterseite; ohne Angabe entspricht sie der minimalen E/A-Einheit.

Das englische Rücklesebeispiel in §5.3.2 lautet `nanddump -o -n --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img -l 0xXXXX`, das chinesische liest dagegen `/dev/mtd4`. Englisch §5.3.4 verwendet `nanddump --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img -l 0xXXXX`; in der chinesischen Zeile fehlt `-f`. Die Hauptbeispiele folgen der chinesischen Quelle. Vor Einsatz Zielpartition und Argumente des installierten Werkzeugs prüfen; die Ausführbarkeit wurde nicht validiert.

Die englische ENV-Programmiertabelle nennt für idblock Size(block) `0x6`, die chinesische `0x3`; die PC-Adresse für xxx.img lautet englisch `0x3E000`, chinesisch `0x58C0000`. Beide nennen Programmer Start(block) `0x2c6`. Tabellen behalten die chinesischen Werte; keine dieser Anordnungen gilt als validiert.

{% endraw %}
