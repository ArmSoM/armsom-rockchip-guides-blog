---
title: "Vollständiger Rockchip-Secure-Boot-Leitfaden: Signierung, eFuse, OTP und Prüfung"
description: "Vollständiger Rockchip-Secure-Boot-Leitfaden: Signierung, eFuse, OTP und Prüfung — RK-SM-YF-024 V2.2.0"
translation_key: "105-rockchip-secure-boot"
slug: "105-rockchip-secure-boot"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Secure Boot", "eFuse", "OTP"]
excerpt: "Vollständiger Rockchip-Secure-Boot-Leitfaden: Signierung, eFuse, OTP und Prüfung — RK-SM-YF-024 V2.2.0"
---

{% raw %}

# Vollständiger Rockchip-Secure-Boot-Leitfaden: Signierung, eFuse, OTP und Prüfung

Vollständige Übertragung des englischen RK-SM-YF-024 V2.2.0 einschließlich technischem Vorwort auf Seiten 2–3 und sämtlichem technischen Inhalt auf Seiten 8–43. Nur das englische PDF liegt vor; alle Sprachversionen verwenden dessen Abbildungen, teilweise mit chinesischen Werkzeugoberflächen. Chipunterstützung gemäß Quelle, ohne Ausweitung auf neuere SoCs oder alle ArmSoM-Platinen. SDK/BSP, Loader/U-Boot, ROM, Schlüsselformat, Programmierspannung und Platinenversorgung prüfen. Keine ArmSoM-Hardwaretests, Signierung, Flash- oder Fuse-Operationen durchgeführt.

> eFuse-/OTP-Programmierung ist irreversibel; falsche Schlüssel oder Spannungen können Start und Updates verhindern. Herstellerreferenzverfahren, keine unmittelbar ausführbare Platinenanleitung. Quellenfragen bleiben dokumentiert: rsaHash[128] gegenüber RSA2048 in §2.5, RK3336 in §7.5 gegenüber RK3326 in §7.6, alte Abschnittsverweise sowie RSA-Encryption/Decryption-Terminologie. Keine geratenen Wertkorrekturen.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1. Vorwort

Begriffe gemäß Quelle:

| Begriff | Definition |
| --- | --- |
| Sector | Sektorgröße 512 Byte |
| eFuse | Einmal programmierbarer Speicher-IP im SoC |
| RSA Encryption | Verschlüsselung mit öffentlichem Schlüssel |
| RSA Decryption | Entschlüsselung mit privatem Schlüssel |
| OTP | Einmal programmierbarer Speicher-IP im SoC |
| MaskRom | BootROM, schreibgeschützter Bootspeicher im SoC |
| loader | Bootloader/erster Loader, meist RKMiniloader oder SPL(uboot) |
| OBM CODE | Meist von OEM/OBM kompilierter oder vertrauter Code |

Dieses Dokument beschreibt die Rockchip-Secure-Boot-Implementierung. Die Firmwaregültigkeit wird geprüft, um ungültige Updates und Starts zu verhindern. Geräte mit programmiertem eFuse aktivieren Secure-Boot-ROM und starten keine unsignierte Firmware; Updates ohne Signatur oder mit unpassendem Schlüssel schlagen fehl.

Hinweis: Gültig signierte Firmware kann weiterhin auf kopierten Platinen oder Hardware derselben CPU-Plattform starten. Secure Boot prüft Softwaregültigkeit, nicht Hardware.

Quellenumfang: RK3126, RK3128, RK3228, RK3229, RK3288, RK3368, RK3399, RK3228H, RK3328, RK3326, RK3308 und PX30. Funktionen: Secure-Boot-ROM, SHA256, RSA2048 und Prüfung des öffentlichen Schlüssels anhand des eFuse-/OTP-Hashes.

Werkzeuganforderungen der Quelle: Efuse tool V1.35 oder neuer; SecureBootTool 1.79 oder neuer; RKBatchTool 1.8 oder neuer (veraltet, FactoryTool verwenden); FactoryTool 1.39 oder neuer. Historische Anforderungen des Dokuments; §7.6 verlangt gesondert SecureBootTool V1.9 oder neuer.

## 2. Architektur

### 2.1 Secure-Boot-Ablauf

![Abbildung der englischen Quelle, Seite 8](/docs/rockchip-secure-boot/assets/en-p008-figure-01.png)

Abbildung 1-1 Secure-Boot-Prozess

### 2.2 Secure-Boot-Sequenz

![Abbildung der englischen Quelle, Seite 9](/docs/rockchip-secure-boot/assets/en-p009-figure-01.png)

Abbildung 1-2 Secure-Boot-Reihenfolge

### 2.3 MaskRom startet den ersten Loader (RKminiLoader/U-Boot)

![Abbildung der englischen Quelle, Seite 9](/docs/rockchip-secure-boot/assets/en-p009-figure-02.png)

Abbildung 1-3-1: MaskRom-zu-loader-Sequenz. Layout des ersten Loaders in der Flash-Benutzerpartition. Tabelle 1-1: Datenlayout des ersten Loaders.

| Range | Beschreibung |
| --- | --- |
| 0–63 sector | 64 sector reverse (Quelle) |
| Erster Loader (8128 sector)(5 Kopien) | Bootloaderpartition |
| 0-2047 | Loaderheader |
| 2048-4095 | Öffentlicher Schlüssel und digitale Signatur |
| 4096 - | Rohbinärbild |
| ... |  |
| Bootloaderkopie-(4)-Partition |  |
| 0-2047 | Loaderheader |
| 2048-4095 | Öffentlicher Schlüssel und digitale Signatur |
| 4096 - | Rohbinärbild |

Struktur von öffentlichem Schlüssel und digitaler Signatur an Adresse 2048–4095:

```c
typedef struct tagBOOT_HEADER
{
    uint32 tag;
    uint32 version;
    uint32 flags;
    uint32 size;
    uint32 reserved1[3];
    uint16 HashBits;
    uint16 RSABits;        /* length in bits of modulus */
    uint32 RSA_N[64];      /* RSA public key*/
    uint32 RSA_E[64];
    uint32 RSA_C[64];
    uint32 HashData[(8+1)*2];
    uint32 signature[64];
}BOOT_HEADER, *PBOOT_HEADER;
```

Öffentlicher Schlüssel: `uint32 RSA_N[64], RSA_E[64], RSA_C[64];` Digitale Signatur: `uint32 signature[64]`. Schritt 1: Öffentlichen Schlüssel aus der ersten Loaderpartition lesen. Schritt 2: SHA256 des Schlüssels berechnen und mit OTP vergleichen; bei Übereinstimmung wird der erste Loader erfolgreich geladen, andernfalls schlägt der Start fehl. Schritt 3: SHA256 des Rohbinärbilds mit der RSA2048-Verschlüsselung der Signatur unter Verwendung des Schlüssels aus Schritt 1 vergleichen; bei Übereinstimmung ersten Loader laden, sonst Startfehler. Die Formulierungen der Quellschritte 2 und 3 bleiben erhalten.

### 2.4 Erster Loader startet U-Boot (optionaler zweiter Loader)

![Abbildung der englischen Quelle, Seite 11](/docs/rockchip-secure-boot/assets/en-p011-figure-01.png)

Abbildung 1-4-1 U-Boot starten

![Abbildung der englischen Quelle, Seite 11](/docs/rockchip-secure-boot/assets/en-p011-figure-02.png)

U-Boot-Bereich: 4MB, 4 Kopien. Quellbereiche und Inhalte:

| Instanz | Bereich | Beschreibung |
| --- | --- | --- |
| U-Boot | 0-2047 | Header, Digitale Signatur |
| U-Boot | 2048- | Rohbinärbild |
| ... | ... | ... |
| U-Boot copy(3) | 0-2047 | Header, Digitale Signatur |
| U-Boot copy(3) | 2048- | Rohbinärbild |

Tabelle 1-4: U-Boot-Layout im Flash. Headerstruktur mit digitaler Signatur an Adresse 0–2047:

```c
typedef struct tag_second_loader_hdr
{
    unsigned char magic[LOADER_MAGIC_SIZE];
    unsigned int version;
    unsigned int reserved0;
    unsigned int loader_load_addr;         /* load to DDR address */
    unsigned int loader_load_size;         /* size in bytes */
    unsigned int crc32;                    /* crc32 */
    unsigned int hash_len;                 /* 20 or 32 , 0 is no hash */
    unsigned char hash[LOADER_HASH_SIZE];  /* sha256 */
    unsigned int js_hash;                  /* js hsah */
    unsigned char reserved[1024-32-32-4];
    unsigned int signTag;                  /* 0x4E474953, "NGIS" */
    unsigned int signlen;                  /* 256 */
    unsigned char rsaHash[256];            /* digital signature */
    unsigned char reserved2[2048-1024-256-8];
}second_loader_hdr;
```

Digitale Signatur: `unsigned char rsaHash[256];` Schritt 1: Öffentlichen Schlüssel aus dem ersten Loader lesen. Schritt 2: SHA256 des Schlüssels mit OTP vergleichen; bei Übereinstimmung fortfahren, sonst Startfehler. Schritt 3: SHA256 des Rohbinärbilds mit der RSA2048-Verschlüsselung der Signatur mit dem Schlüssel aus Schritt 1 vergleichen; bei Übereinstimmung erfolgreich laden und den Schlüssel an U-Boot übergeben, sonst Startfehler.

### 2.5 U-Boot startet ein Bootimage mit Linux-Kernel

![Abbildung der englischen Quelle, Seite 12](/docs/rockchip-secure-boot/assets/en-p012-figure-01.png)

Abbildung 1-5: U-Boot-zu-boot-Sequenz. Tabelle 1-2: Boot-Datenlayout.

| boot.img | Beschreibung |
| --- | --- |
| 0-2047 | Header |
| 2048-4095 | Digitale Signatur |
| 4096- | kernel,ramdisk,dtb... |
| ... |  |

Headerstruktur an Adresse 0–2047:

```c
#define BOOT_MAGIC_SIZE 8
#define BOOT_NAME_SIZE 16
#define BOOT_ARGS_SIZE 512
typedef struct tag_boot_img_hdr
{
    unsigned char magic[BOOT_MAGIC_SIZE]; /* "ANDROID!" */
    unsigned int kernel_size;             /* size in bytes */
    unsigned int kernel_addr;             /* physical load addr */
    unsigned int ramdisk_size;            /* size in bytes */
    unsigned int ramdisk_addr;            /* physical load addr */
    unsigned int second_size;             /* size in bytes */
    unsigned int second_addr;             /* physical load addr */
    unsigned int tags_addr;               /* physical addr for kernel tags */
    unsigned int page_size;               /* flash page size we assume */
    unsigned int unused[2];               /* future expansion: should be 0 */
    unsigned char name[BOOT_NAME_SIZE];   /* asciiz product name */
    unsigned char cmdline[BOOT_ARGS_SIZE];
    unsigned int id[8];                   /* timestamp / checksum / sha1 / etc */
    unsigned char reserved[0x400-0x260];
    unsigned int signTag;                 /* 0x4E474953 */
    unsigned int signlen;                 /* 128 */
    unsigned char rsaHash[128];
}boot_img_hdr;
```

Digitale Signatur: `unsigned char rsaHash[128];` Schritt 1: U-Boot erhält den öffentlichen Schlüssel des ersten Loaders. Schritt 2: SHA256 des Schlüssels mit OTP vergleichen; bei Übereinstimmung fortfahren, sonst Startfehler. Schritt 3: SHA256 des Rohbinärbilds mit RSA2048-Verschlüsselung der Signatur mit dem Schlüssel aus Schritt 1 vergleichen; bei Übereinstimmung Linux starten, sonst Startfehler.

### 2.6 U-Boot startet Recovery

Wie beim Bootimage; die Quelle verweist auf §1.4 (alte Nummer beibehalten, zu prüfen).

## 3. eFuse-Layout

RK3368, RK3288, RK3229 und RK3228 verwenden 1024-bit-eFuse für Secure Boot. Tabelle 2-1: eFuse-Datenlayout.

| 32-Bit-Wortadressierung | Beschreibung |
| --- | --- |
| 0x00 | Sicherheitsflag Bits[7:0]: Aktivierung; Bits[31:8]: reserviert |
| 0x01-0x3 | Reserviert |
| 0x04-0x07 | Reserviert |
| 0x8-0xF | RSA-Public-Key-Hash |
| 0x10-0x17 | Reserviert |
| 0x18 | Reserviert |
| 0x19-0x1A | Reserviert |
| 0x1B-0x1D | Reserviert |
| 0x1E | Reserviert |
| 0x1F | eFuse-Schreibsperrbits |

RK3228H und RK3328 verwenden 7680-bit-OTP für Secure Boot. Tabelle 2-2: OTP-Datenlayout.

| 32-Bit-Wortadressierung | Beschreibung |
| --- | --- |
| 0-63 | Öffentlicher Schlüssel (N) |
| 64-127 | Öffentlicher Schlüssel (E) |
| 128 | Bits[7:0]: 0xff aktiviert; Bits[15:8]: RSA_E-Größe (Quelle: word uint); Bits[31:16]: reserviert |
| 129 | Widerrufszähler vertrauenswürdiger Firmware (ID #0) |
| 130-131 | Widerrufszähler nicht vertrauenswürdiger Firmware (ID #1) |
| 132-239 | Reserviert |

RK3326, PX30 und RK3308 verwenden 4096-bit-OTP für Secure Boot. Tabelle 2-3: OTP-Datenlayout 2.

| 32-Bit-Wortadressierung | Beschreibung |
| --- | --- |
| 0 | Secure-Boot-Aktivierungsflag |
| 1-3 | Reserviert |
| 4-11 | RSA-Public-Key-Hash (SHA256) |
| 12-19 | Geräte-Rootschlüssel |
| 20-23 | Firmware-Verschlüsselungsschlüssel |
| 24-25 | Widerrufszähler vertrauenswürdiger Firmware (ID #0) |
| 26-31 | Widerrufszähler nicht vertrauenswürdiger Firmware (ID #1) |
| 32-97 | Für OEM reserviert |

## 4. Gesamtablauf

Ablauf zum Aktivieren von Secure Boot:

1. update.img packen

2. Firmware update.img signieren

3. eFuse oder OTP programmieren

4. Firmware update.img aktualisieren

5. Aktivierung von Secure Boot prüfen

![Abbildung der englischen Quelle, Seite 18](/docs/rockchip-secure-boot/assets/en-p018-figure-01.png)

Abbildung 3-1 Arbeitsablauf

## 5. update.img erstellen

### 5.1 Images erzeugen

Nach dem Android-Build Images mit `./mkimage.sh ota` erzeugen.

![Abbildung der englischen Quelle, Seite 21](/docs/rockchip-secure-boot/assets/en-p021-figure-01.png)

```text
./mkimage.sh ota
TARGET_PRODUCT=rk3288
TARGET_HARDWARE=rk30board
system filesystem is ext4
make ota images...
create boot.img with kernel... done.
create recovery.img with kernel... done.
create misc.img... done.
create system.img... done.
```

Abbildung 4-1 Paketierungsskript

### 5.2 update.img packen

RKTools/windows/AndroidTool/rockdev/package-file bestimmt die zu packenden Dateien. Für RK3288 den bootloader-Pfad ändern, resource- und kernel-Zeilen auskommentieren und backup auf RESERVED setzen.

![Abbildung der englischen Quelle, Seite 21](/docs/rockchip-secure-boot/assets/en-p021-figure-02.png)

```text
# NAME      Relative path
#
#HWDEF      HWDEF
package-file    package-file
bootloader  Image/RK3288UbootLoader.bin
parameter   rk3288-3.10-uboot.parameter.txt
#uboot      Image/uboot.img
misc        Image/misc.img
#resource   Image/resource.img
#kernel     Image/kernel.img
boot        Image/boot.img
recovery    Image/recovery.img
system      Image/system.img
# 要写入backup分区的文件就是自身（update.img）
# SELF 是关键字，表示升级文件（update.img）自身
# 在生成升级文件时，不加入SELF文件的内容，但在头部信息中有记录
# 在解包升级文件时，不解包SELF文件的内容
# RESERVED不打包backup
backup      RESERVED
update-script   update-script
recover-script  recover-script
```

Abbildung 4-2: package-file zur Paketsteuerung. RKTools/windows auf das Windows-System kopieren und AndroidTool/rockdev/mkupdate.bat zur Erstellung von update.img ausführen.

![Abbildung der englischen Quelle, Seite 22](/docs/rockchip-secure-boot/assets/en-p022-figure-01.png)

Abbildung 4-3 Paketierungsskript

## 6. Firmware signieren

Diese Anleitung gilt für Windows-Werkzeuge; Linux besitzt eigene Werkzeuge.

### 6.1 RSA-Schlüssel erzeugen

![Abbildung der englischen Quelle, Seite 24](/docs/rockchip-secure-boot/assets/en-p024-figure-01.png)

Abbildung 5-1 Schlüsselerzeugung

### 6.2 RSA-Schlüssel speichern

Der Schlüssel wird für signierte Firmware und OTA verwendet; sicher sichern. Das Schlüsselpaar ist äußerst wichtig: Verlust oder Offenlegung setzt das Produkt hohen Risiken aus, und vorhandene Geräte können nicht mehr aktualisiert werden. Über den gesamten Produktlebenszyklus verwalten.

![Abbildung der englischen Quelle, Seite 25](/docs/rockchip-secure-boot/assets/en-p025-figure-01.png)

Abbildung 5-2 Schlüssel speichern

### 6.3 RSA-Schlüssel laden

![Abbildung der englischen Quelle, Seite 25](/docs/rockchip-secure-boot/assets/en-p025-figure-02.png)

Abbildung 5-3 Schlüssel laden

### 6.4 Konfiguration

![Abbildung der englischen Quelle, Seite 26](/docs/rockchip-secure-boot/assets/en-p026-figure-01.png)

SoC-Plattform wählen.

![Abbildung der englischen Quelle, Seite 26](/docs/rockchip-secure-boot/assets/en-p026-figure-02.png)

efuse speichert den RSA-Public-Key-Hash in eFuse und aktiviert Secure-Boot-ROM (Quellenempfehlung). soft dient speziellen Anwendungen, aktiviert Secure-Boot-ROM nicht und verwendet RSA1024 und SHA160.

![Abbildung der englischen Quelle, Seite 26](/docs/rockchip-secure-boot/assets/en-p026-figure-03.png)

Für jedes Produktmodell RSA KEY nur einmal erzeugen und sichern, andernfalls sind Firmwareupdates oder OTA möglicherweise nicht mehr möglich.

![Abbildung der englischen Quelle, Seite 26](/docs/rockchip-secure-boot/assets/en-p026-figure-04.png)

Gesicherten RSA-Schlüssel laden; das von openssl erzeugte .pem-Format wird unterstützt.

![Abbildung der englischen Quelle, Seite 26](/docs/rockchip-secure-boot/assets/en-p026-figure-05.png)

Firmware signieren.

### 6.5 Firmware signieren

Die Quelle verlangt, „sicherzustellen, dass boot.img und recovery.img im kernel image enthalten sind“; siehe Packbefehl. Diese Einschlussformulierung ist fraglich und bleibt ohne abgeleitete Imagestruktur erhalten.

![Abbildung der englischen Quelle, Seite 26](/docs/rockchip-secure-boot/assets/en-p026-figure-06.png)

```text
./mkimage.sh ota
TARGET_PRODUCT=rk3288
TARGET_HARDWARE=rk30board
system filesystem is ext4
make ota images...
create boot.img with kernel... done.
create recovery.img with kernel... done.
create misc.img... done.
create system.img... done.
```

Abbildung 5-4: Image-Packbefehl. Firmwareimage öffnen:

![Abbildung der englischen Quelle, Seite 27](/docs/rockchip-secure-boot/assets/en-p027-figure-01.png)

Abbildung 5-5: Firmwareauswahl in SecureBootTool. Signierte Firmware:

![Abbildung der englischen Quelle, Seite 27](/docs/rockchip-secure-boot/assets/en-p027-figure-02.png)

Abbildung 5-6 Signierte Firmware

## 7. eFuse programmieren

### 7.1 Hardwarebedingungen

Bei Rockchip AP gibt es zwei Verfahren zur Programmierung sicherer Benutzerdaten: eFuse und OTP, das nur einige Chips unterstützen. Beschreibung folgt.

#### 7.1.1 eFuse-Programmierung

RK3126, RK3128, RK3228, RK3229, RK3288, RK3368 und RK3399 unterstützen eFuse-Programmierung. Allgemeine Anforderungen:

A. Ohne benötigte eFuse-Programmierung den Versorgungspin direkt auf GND legen, um versehentliche Datenänderungen zu vermeiden. Bei RK3126/RK3126C ist der Pin mit SARADC geteilt und darf nicht geerdet werden.

B. Bei benötigter Programmierung einen Pulldown an GND anschließen, damit die eFuse-Versorgung im Normalbetrieb nicht schwankt und keine Fehlprogrammierung erfolgt. Widerstand gemäß Plattformschaltplan, üblicherweise 47Ω–10KΩ.

C. Zwei Versorgungsarten: a) Onboard-Versorgung: keine PCBA-Nadelbett-Testplatine nötig; zuerst eFuse programmieren, dann Firmware aktualisieren. Im Normalbetrieb muss die Firmware die Versorgung auf 0V halten. Nachteile: Versorgungsschaltung auf der Hauptplatine, höhere Materialkosten und erforderliche Fehlerfreiheit der Firmware zu jedem Zeitpunkt. Geeignet für Produkte ohne zusätzlichen PCBA-Testprozess, etwa einfache BOX-Produkte, deren Schnittstellen und Montage keine Kontaktprüfplatine benötigen. b) Versorgung über PCBA-Testplatine (Quellenempfehlung): nur Testpunkte auf der Hauptplatine, keine Versorgungsschaltung; der Benutzer kann diesen Versorgungspfad auch nicht per Software angreifen. Nachteile: zusätzlicher PCBA-Testprozess und höhere Prüfkosten. Geeignet für komplex montierte Produkte wie Tablets, bei denen Nacharbeit und Austausch einer defekten PCBA schwierig sind und ein PCBA-Test meist ohnehin existiert; eFuse-Programmierung dort ist sinnvoll.

D. eFuse-Programmierspannung (z. B. 1.5/1.8/2.5V), Pinnummern und Stromanforderungen unterscheiden sich je Plattform.

Empfohlen wird eine Stromlieferfähigkeit über 50mA; Spannung und Pulldownwert siehe Schaltplan. Tabelle 6-1 fasst Hardwareparameter zusammen.

| Chipmodell | eFuse-Versorgung | Programmiermodus | VQPS-Stromanforderung | Pulldownwiderstand | eFuse-Versorgungspin | Hinweis |
| --- | --- | --- | --- | --- | --- | --- |
| RK3126/RK3126C | 2.5V | Versorgung über PCBA-Testplatine | >50mA | Keine | PIN68 | Mit ADC geteilt |
| RK3128 | 2.5V | Onboard- oder externe Versorgung | >50mA | <=10K | R10 |  |
| RK3168/RK3188 | 1.5V | Onboard- oder externe Versorgung | >50mA | <=510R | Y10 |  |
| RK3228/RK3229 | 1.6V | Onboard- oder externe Versorgung | >50mA | <=100R | R10 |  |
| RK3288 | 1.5V | Onboard- oder externe Versorgung | >50mA | <=510R | P19 |  |
| RK3368 | 1.5V | Onboard- oder externe Versorgung | >50mA | <=47R | Y10 |  |
| RK3399 | 1.8V | Onboard- oder externe Versorgung | >50mA | <=1K | AD23 |  |

Empfohlene Versorgung siehe Abbildung. a) PartA: eFuse-Versorgungsschaltung mit passend zur Spannung ausgewähltem LDO auf Haupt- oder PCBA-Testplatine. b) PartB: R4 (47R–10K) zieht den Versorgungspin auf Low gegen Fehlbedienung. Bei Versorgung über die Testplatine benötigt die SoC-Hauptplatine passende Testpunkte für die Prüfnadeln. Achtung: a) RK3126C teilt eFuse-Versorgung mit ADC, daher kein Pulldown; b) bei RK3228/RK3229 werden 1.55–1.6V für mehr Stabilität empfohlen; c) bei Onboard-Versorgung eFuse_PWREN einen unabhängigen GPIO zur LDO-Steuerung zuweisen, damit VCC_eFuse im Normalbetrieb spannungslos bleibt. Siehe Rockchip-Referenzschaltplan; ohne zugewiesenen GPIO fordert die Quelle Herstellerkontakt oder externe Versorgung.

![Abbildung der englischen Quelle, Seite 31](/docs/rockchip-secure-boot/assets/en-p031-figure-01.png)

Abbildung 6-1 eFuse-Schaltung

#### 7.1.2 OTP-Programmierung

RK3328 und RK3228H unterstützen OTP ohne externe Versorgungsschaltung. OTP_VCC18 (PIN16) wird ständig von VCC_18 versorgt; nur die spezielle OTP-Programmiersequenz ist nötig, keine weiteren Hardwareänderungen.

![Abbildung der englischen Quelle, Seite 31](/docs/rockchip-secure-boot/assets/en-p031-figure-02.png)

Abbildung 6-2 OTP-Schaltung

### 7.2 Werkzeugoberfläche

![Abbildung der englischen Quelle, Seite 31](/docs/rockchip-secure-boot/assets/en-p031-figure-03.png)

Abbildung 6-3 Werkzeugoberfläche

### 7.3 Signierte Firmware laden

![Abbildung der englischen Quelle, Seite 32](/docs/rockchip-secure-boot/assets/en-p032-figure-01.png)

Abbildung 6-4 Signierte Firmware laden

### 7.4 Mit Run starten

![Abbildung der englischen Quelle, Seite 32](/docs/rockchip-secure-boot/assets/en-p032-figure-02.png)

Abbildung 6-5 Chip programmieren

### 7.5 eFuse programmieren

Gerät per USB an den PC anschließen; das Werkzeug schreibt den RSA-Public-Key-Hash automatisch in eFuse. Externe Versorgung ist erforderlich, siehe SoC-Datenblatt. Laut Quelle benötigen RK3228H, RK3328, RK3336, RK3308 und PX30 die Schritte 6.2–6.4 nicht; die Programmierung erfolgt über ein signiertes Firmwareupdate. RK3336 und Abschnittsnummern bleiben zur Prüfung erhalten.

### 7.6 OTP programmieren

RK3228H, RK3328, RK3326, RK3308 und PX30 unterstützen OTP. Den Public-Key-Hash wie folgt in OTP schreiben:

1. Zuerst signierte Firmware wie oben flashen. Ein normaler Start bestätigt den Signierprozess; danach OTP programmieren.

2. SecureBootTool V1.9 oder neuer verwenden. In config.ini des Werkzeugverzeichnisses sign_flag= suchen und sign_flag=0x20 (Bit5=1) setzen, um OTP-Schreiben in RKMiniLoader zu aktivieren. Speichern, SecureBootTool.exe neu öffnen und Firmware oder RKMiniLoader neu signieren.

![Abbildung der englischen Quelle, Seite 33](/docs/rockchip-secure-boot/assets/en-p033-figure-01.png)

Abbildung 6-6-1 Werkzeug

![Abbildung der englischen Quelle, Seite 34](/docs/rockchip-secure-boot/assets/en-p034-figure-01.png)

```text
[System]
support_chip=3308|3326|3399|3228h|3229|3368|3228|3288|3128|3036
new_crypto=3308|3326
#using software to check signature,using sha160 ,belong to "soft_sign"
soft_sign=3128|3036
hard_sign_big_hash=3228h|3368|3228|3288
hard_sign_little_hash=3399
hard_sign_pss=3308|3326|3229

sign_flag=0x20
sign_soft_version=
sign_nonce=
```

Einige Kommentare sind im Quellscreenshot rechts abgeschnitten. Alle sichtbaren Konfigurationsschlüssel und Werte sind oben übertragen; Kommentarenden werden nicht geraten.

Abbildung 6-6-2 config.ini-Konfiguration

3. Neu signierte Firmware oder RKMiniLoader flashen und neu starten. RKMiniLoader erzeugt beim Start den Public-Key-Hash, schreibt ihn in OTP und aktiviert Secure Boot.

![Abbildung der englischen Quelle, Seite 35](/docs/rockchip-secure-boot/assets/en-p035-figure-01.png)

Abbildung 6-6-3 OTP-Ablauf

4. Bei Erfolg erscheint seriell `otp write key success!!!`, bei Fehler `otp write error: !!!`.

## 8. Firmwareupdate

### 8.1 Firmwareupdate

Signierte Firmware öffnen und das Gerät mit programmiertem eFuse per USB an den PC anschließen.

![Abbildung der englischen Quelle, Seite 37](/docs/rockchip-secure-boot/assets/en-p037-figure-01.png)

Abbildung 7-1: Upgradewerkzeug 1. Upgrade wählen, Run klicken und Abschluss abwarten.

![Abbildung der englischen Quelle, Seite 38](/docs/rockchip-secure-boot/assets/en-p038-figure-01.png)

Abbildung 7-2 Upgrade-Werkzeug 2

## 9. Überprüfung

### 9.1 Sicherheitsflag prüfen

Startlog mit einem seriellen Werkzeug wie SecureCRT lesen. `Secure Boot Mode: 0x1` oder `SecureMode = 0x1` zeigt aktiviertes Secure Boot an.

![Abbildung der englischen Quelle, Seite 40](/docs/rockchip-secure-boot/assets/en-p040-figure-01.png)

Abbildung 8-1 Startprotokoll

### 9.2 Secure-Boot-Test

Geräte mit programmiertem eFuse aktivieren Secure-Boot-ROM und starten keine unsignierte Firmware. Unsigned- oder Fremdschlüssel-Updates sollen scheitern, passend signierte Firmware erfolgreich starten. RK3128 und RK3126 scheitern bei wait for loader.

![Abbildung der englischen Quelle, Seite 41](/docs/rockchip-secure-boot/assets/en-p041-figure-01.png)

Abbildung 8-2: Upgradefehler 1. Andere SoCs scheitern bei Download Boot:

![Abbildung der englischen Quelle, Seite 41](/docs/rockchip-secure-boot/assets/en-p041-figure-02.png)

Abbildung 8-3 Upgradefehler 2

## 10. Secure Debug

### 10.1 Einführung

Secure Debug deaktiviert lediglich die Secure-Boot-Prüfung für Updates unsignierter Kernel und schnellere Fehlersuche. Jeder SoC besitzt eine eindeutige 128-Bit-CPU-ID. Das Signierwerkzeug liest die ID und führt die in der Quelle Decryption genannte Operation mit dem privaten RSA-Schlüssel aus, um ein Zertifikat zu erzeugen. Das Gerät prüft es mit dem öffentlichen Schlüssel; bei Erfolg deaktiviert U-Boot die Startprüfung. Dies beschreibt den kontrollierten Herstellerprozess, keine Umgehung fremder Geräteautorisierung.

### 10.2 Secure-Debug-Ablauf

![Secure-Debug-Ablauf (englisches Original)](/docs/rockchip-secure-boot/assets/en-p043-secure-debug.png)

{% endraw %}
