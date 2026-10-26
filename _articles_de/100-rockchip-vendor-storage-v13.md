---
title: "Rockchip Vendor Storage V1.3.0: Datenlayouts, IDs und U-Boot/Linux/Android-APIs"
description: "Rockchip Vendor Storage V1.3.0: Datenlayouts, IDs und U-Boot/Linux/Android-APIs — RK-KF-YF-C35, kernel 4.19/5.10/6.1, GKI, SN, MAC."
translation_key: "100-rockchip-vendor-storage-v13"
slug: "100-rockchip-vendor-storage-v13"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Vendor Storage", "GKI", "Linux", "Android"]
excerpt: "Rockchip Vendor Storage V1.3.0: Datenlayouts, IDs und U-Boot/Linux/Android-APIs — RK-KF-YF-C35, kernel 4.19/5.10/6.1, GKI, SN, MAC."
---

{% raw %}

# Rockchip Vendor Storage V1.3.0: Datenlayouts, IDs und U-Boot/Linux/Android-APIs

Dieser Artikel bewahrt den vollständigen technischen Inhalt von RK-KF-YF-C35 V1.3.0, englisches PDF, Seiten 5–18. Es liegt nur das englische Original vor; Chinesisch, Russisch und Deutsch sind vollständige Übersetzungen. Alle vier Sprachen verwenden englische Originalbilder. Dies ist nicht die ältere Rev.08 aus Artikel 097: Layouts, IDs und GKI-/Android-Schnittstellen unterscheiden sich. Die Quelle nennt RockChip-Kernel 4.19, 5.10 und 6.1, aber keine konkreten ArmSoM-Platinen oder SDK/BSP-Versionen. Dies ist eine Plattformreferenz, keine universelle Freigabe: SoC, Speicherbackend, reservierte Bereiche, Kernel-ABI/Modulkonfiguration, Android-Zweig und SDK/BSP prüfen. Es erfolgten keine Hardware-Lese-/Schreib- oder Stromausfalltests.

> Sicherheit und Quellenunklarheiten: Das Beispiel überschreibt ID 1 (SN) mit Bytewerten 0–31. Nicht auf Produktionsgeräten ausführen; Identitäts-/Provisionierungsdaten zuerst sichern. ID 1063 trägt eine Super-Resolution-Funktionsbezeichnung, aber eine MEMC-Beschreibung. ID 76 heißt „Offline key reserved field“, obwohl 1076 darauf zurückverweist. Beides bleibt ohne Vermutungen erhalten. ID 61 kombiniert Super-Resolution-Reserve und HDCP2.x RKIV. Die ID-Zuordnung aus Artikel 097/099 nicht übernehmen. Der GKI-Modulsatz ist grammatisch unklar; Bau und Laden von ram_vendor_storage.ko anhand des BSP prüfen. Quellschreibweisen, Typen und unvollständige Fehler-/Aufräumdefinitionen bleiben im Code erhalten.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-vendor-storage-v13/EDITORIAL-NOTES.md)

<!-- English PDF p.5 -->

## 1. Übersicht der Anwendungshinweise

<!-- English PDF p.5 -->

Vendor Storage speichert SN, MAC und weitere Herstellerdaten. Funktionen:

- Zugriff über eindeutige ID.
- Zuverlässige Datenvalidierung.
- Wiederherstellung nach Stromausfall.
- Lesen und Schreiben vom PC.
- Lesen und Schreiben aus UBOOT.
- Lesen und Schreiben aus dem Kernel.
- Lesen und Schreiben aus Linux-Anwendungen.

<!-- English PDF p.5 -->

## 2. Vendor-Storage-Architektur

<!-- English PDF p.5 -->

![2. Vendor-Storage-Architektur: englisches Original, Seite 5](/docs/rockchip-vendor-storage-v13/assets/en-p005-figure-01.png)

*2. Vendor-Storage-Architektur: englisches Original, Seite 5*

<!-- English PDF p.6 -->

## 3. Datenlayout

<!-- English PDF p.6 -->

### 3.1 SPI-NOR-Datenlayout

<!-- English PDF p.6 -->

![3.1 SPI-NOR-Datenlayout: englisches Original, Seite 6](/docs/rockchip-vendor-storage-v13/assets/en-p006-figure-01.png)

*3.1 SPI-NOR-Datenlayout: englisches Original, Seite 6*

<!-- English PDF p.6 -->

### 3.2 Raw-NAND- und SPI-NAND-Datenlayout

<!-- English PDF p.6 -->

![3.2 Raw-NAND- und SPI-NAND-Datenlayout: englisches Original, Seite 6](/docs/rockchip-vendor-storage-v13/assets/en-p006-figure-02.png)

*3.2 Raw-NAND- und SPI-NAND-Datenlayout: englisches Original, Seite 6*

<!-- English PDF p.7 -->

### 3.3 EMMC-Datenlayout

<!-- English PDF p.7 -->

![3.3 EMMC-Datenlayout: englisches Original, Seite 7](/docs/rockchip-vendor-storage-v13/assets/en-p007-figure-01.png)

*3.3 EMMC-Datenlayout: englisches Original, Seite 7*

<!-- English PDF p.7 -->

### 3.4 Datenstruktur

<!-- English PDF p.7 -->

![3.4 Datenstruktur: englisches Original, Seite 7](/docs/rockchip-vendor-storage-v13/assets/en-p007-figure-02.png)

*3.4 Datenstruktur: englisches Original, Seite 7*

| Offset (B) | Größe (B) | Name |
| --- | --- | --- |
| 0x0000 | 0x0004 | Tag, Wert 0x524B5644. |
| 0x0004 | 0x0004 | Version, nach Schreibzugriff erhöht |
| 0x0008 | 0x0002 | Nächster Index |
| 0x000A | 0x0002 | Gesamtzahl der Elemente |
| 0x000C | 0x0002 | Offset des freien Bereichs |
| 0x000E | 0x0002 | Größe des freien Bereichs |
| 0x0010 | 0x0002 | Item0->id |
| 0x0012 | 0x0002 | Item0->offset |
| 0x0014 | 0x0002 | Item0->size |
| 0x0016 | 0x0002 | Item0->flag(reversed) |
| 0x0018 | 0x0008 | Item1 |
| ... | ... | Item x |
| --- | --- | Daten |
| Size – 0x08 | 0x0004 | Hash |
| Size – 0x04 | 0x0004 | Version2, Wert identisch mit Version |

<!-- English PDF p.8 -->

### 3.5 ID-Definitionen

<!-- English PDF p.8 -->

| ID | Funktion | Beschreibung |
| --- | --- | --- |
| 1 | SN | Seriennummer |
| 2 | WIFI MAC | WIFI-MAC-Adresse |
| 3 | LAN MAC | Ethernet-MAC-Adresse |
| 4 | BT MAC | Bluetooth-MAC-Adresse |
| 5 | HDMITX HDCP1.4 KEY | HDMITX HDCP1.4 KEY |
| 6 | DP HDCP1.4 KEY | DP HDCP1.4 KEY |
| 7 | HDCP_2X_ID |  |
| 8 | DRM_KEY_ID |  |
| 9 | PLAYREADY_CERT_ID |  |
| 10 | ATTENTION_KEY_ID |  |
| 11 | PLAYREADY_ROOT_KEY_0_ID |  |
| 12 | PLAYREADY_ROOT_KEY_1_ID |  |
| 13 | HDMIRX HDCP1.4 KEY | HDMIRX HDCP1.4 KEY |
| 14 | SENSOR_CALIBRATION_ID |  |
| 15 | IMEI_ID |  |
| 16 | LAN_RGMII_DL_ID |  |
| 17 | EINK_VCOM_ID | VCOM-Spannung des E-Ink-Bildschirms |
| 18 |  |  |
| 19 |  |  |
| 20 | HDMIRX HDCP2.3 KEY | HDMIRX HDCP2.3 KEY |
| ... |  |  |
| 60 | sr | Speichert den Online-Autorisierungsschlüssel für Super-Resolution; zugehörige Offline-Schlüsselposition +1000, also 1060. |
| 61 | Super-Resolution reserviertes Algorithmusfeld / HDCP2.x RKIV | Reserviertes Super-Resolution-Algorithmusfeld, entsprechend Offline-Reserve 1061. RKIV ist ein 16-Byte-Verschlüsselungsschlüssel für HDMI2.x-Firmware als zusätzlicher Schutz. Laut Quelle verwenden einige Kunden von 3528 und 356x dieses zusätzliche Verfahren. |

<!-- English PDF p.9 -->

| ID | Funktion | Beschreibung |
| --- | --- | --- |
| 62 | memc | Speichert den Online-Autorisierungsschlüssel für MEMC; zugehörige Offline-Schlüsselposition +1000, also 1062. |
| 63 | MEMC reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für MEMC, entsprechend Offline-Reserve 1063. |
| 64 | pq | Speichert den Online-Autorisierungsschlüssel für PQ; zugehörige Offline-Schlüsselposition +1000, also 1064. |
| 65 | PQ reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für PQ, entsprechend Offline-Reserve 1065. |
| 66 | RKP reserviertes Feld | Von RKP CSR verwendet: Seriennummer beim Erzeugen des CSR |
| 67 | RKP reserviertes Feld | Von RKP CSR verwendet: Inhalt des erzeugten CSR |
| 68 | multi-module | Speichert den Online-Autorisierungsschlüssel für multi-module; zugehörige Offline-Schlüsselposition +1000, also 1068. |
| 69 | multi-module reserviertes Feld | Reserviertes Algorithmusfeld für multi-module, entsprechend Offline-Reserve 1069. |
| 70 | touch_read | Speichert den Online-Autorisierungsschlüssel für Touch-Read; zugehörige Offline-Schlüsselposition +1000, also 1070. |
| 71 | touch_read reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für Touch-Read, entsprechend Offline-Reserve 1071. |
| 72 | rknpu_ocr | Speichert den Online-Autorisierungsschlüssel für OCR-Algorithmus; zugehörige Offline-Schlüsselposition +1000, also 1072. |
| 73 | rknpu_ocr reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für OCR-Algorithmus, entsprechend Offline-Reserve 1073. |
| 74 | face | Speichert den Online-Autorisierungsschlüssel für Gesichtsentsperrung; zugehörige Offline-Schlüsselposition +1000, also 1074. |
| 75 | Gesichtsentsperrung reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für Gesichtsentsperrung, entsprechend Offline-Reserve 1075. |
| 76 | knowledge | Reserviertes Offline-Schlüsselfeld |
| 77 | knowledge reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für Knowledge, entsprechend Offline-Reserve 1077. |
| ... |  |  |
| 84 | asr | Speichert den Online-Autorisierungsschlüssel für ASR-Sprache-zu-Text-Algorithmus; zugehörige Offline-Schlüsselposition +1000, also 1084. |

<!-- English PDF p.10 -->

| ID | Funktion | Beschreibung |
| --- | --- | --- |
| 85 | asr reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für ASR-Sprache-zu-Text-Algorithmus, entsprechend Offline-Reserve 1085. |
| 86 | llm | Speichert den Online-Autorisierungsschlüssel für LLM-Übersetzung; zugehörige Offline-Schlüsselposition +1000, also 1086. |
| 87 | llm reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für LLM-Übersetzung, entsprechend Offline-Reserve 1087. |
| 88 | tts | Speichert den Online-Autorisierungsschlüssel für TTS-Text-zu-Sprache-Algorithmus; zugehörige Offline-Schlüsselposition +1000, also 1088. |
| 89 | tts reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für TTS-Text-zu-Sprache-Algorithmus, entsprechend Offline-Reserve 1089. |
| ... |  |  |
| 96 | aieraser | Speichert den Online-Autorisierungsschlüssel für AI-Eraser-Algorithmus; zugehörige Offline-Schlüsselposition +1000, also 1096. |
| 97 | aieraser reserviertes Algorithmusfeld | Reserviertes Algorithmusfeld für AI-Eraser-Algorithmus, entsprechend Offline-Reserve 1097. |
| ... |  |  |
| 156 | Kundenreserve | Für Kunden reserviert, nicht für RK-interne Nutzung |
| ... | Kundenreserve | Für Kunden reserviert, nicht für RK-interne Nutzung |
| 256 | Kundenreserve | Für Kunden reserviert, nicht für RK-interne Nutzung |
| 1060 | Super-Resolution Offline-Schlüsselposition | Offline-Schlüsselposition für Super-Resolution; minus 1000 ergibt Online-Schlüsselposition 60. |
| 1061 | Super-Resolution reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für Super-Resolution |
| 1062 | MEMC Offline-Schlüsselposition | Offline-Schlüsselposition für MEMC; minus 1000 ergibt Online-Schlüsselposition 62. |
| 1063 | Super-Resolution reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für MEMC |
| 1064 | PQ Offline-Schlüsselposition | Offline-Schlüsselposition für PQ; minus 1000 ergibt Online-Schlüsselposition 64. |
| 1065 | PQ reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für PQ |
| 1068 | multi-module Offline-Schlüsselposition | Offline-Schlüsselposition für multi-module; minus 1000 ergibt Online-Schlüsselposition 68. |

<!-- English PDF p.11 -->

| ID | Funktion | Beschreibung |
| --- | --- | --- |
| 1069 | multi-module reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für multi-module |
| 1070 | Touch-Read Offline-Schlüsselposition | Offline-Schlüsselposition für Touch-Read; minus 1000 ergibt Online-Schlüsselposition 70. |
| 1071 | Touch-Read reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für Touch-Read |
| 1072 | OCR Offline-Schlüsselposition | Offline-Schlüsselposition für OCR-Algorithmus; minus 1000 ergibt Online-Schlüsselposition 72. |
| 1073 | OCR reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für OCR-Algorithmus |
| 1074 | Face Offline-Schlüsselposition | Offline-Schlüsselposition für Gesichtsentsperrung; minus 1000 ergibt Online-Schlüsselposition 74. |
| 1075 | Face reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für Gesichtsentsperrung |
| 1076 | Knowledge Offline-Schlüsselposition | Offline-Schlüsselposition für Knowledge; minus 1000 ergibt Online-Schlüsselposition 76. |
| 1077 | Knowledge reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für Knowledge |
| 1084 | ASR Offline-Schlüsselposition | Offline-Schlüsselposition für ASR-Sprache-zu-Text-Algorithmus; minus 1000 ergibt Online-Schlüsselposition 84. |
| 1085 | ASR reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für ASR-Sprache-zu-Text-Algorithmus |
| 1086 | LLM Offline-Schlüsselposition | Offline-Schlüsselposition für LLM-Übersetzung; minus 1000 ergibt Online-Schlüsselposition 86. |
| 1087 | LLM reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für LLM-Übersetzung |
| 1088 | TTS Offline-Schlüsselposition | Offline-Schlüsselposition für TTS-Text-zu-Sprache-Algorithmus; minus 1000 ergibt Online-Schlüsselposition 88. |
| 1089 | TTS reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für TTS-Text-zu-Sprache-Algorithmus |
| 1096 | AI Eraser Algorithm Offline-Schlüsselposition | Offline-Schlüsselposition für AI-Eraser-Algorithmus; minus 1000 ergibt Online-Schlüsselposition 96. |
| 1097 | AI Eraser Algorithm reserviertes Offline-Schlüsselfeld | Reserviertes Offline-Schlüsselfeld für AI-Eraser-Algorithmus |

<!-- English PDF p.11 -->

Hinweis: Daten werden im NVM auf 64 Byte ausgerichtet gespeichert. Ein Element belegt mindestens 64 Byte: Für 1–64 geschriebene Byte werden 64 Byte, für 65–128 Byte werden 128 Byte zugewiesen.

<!-- English PDF p.12 -->

## 4. UBOOT-API

<!-- English PDF p.12 -->

Quellcode: `u-boot/board/rockchip/common/storage/storage.c`

<!-- English PDF p.12 -->

```text
int vendor_storage_init(void)
function: Initialize vendor storage
input : none
return: 0: Initialize success
        other: Initialize fail

int vendor_storage_read(u32 id, void *pbuf, u32 size)
function: read vendor storage by id
input : id, item id;
pbuf, data buffer;
size, number byte to read.
return: other: number byte have read.
        -1: read fail.

int vendor_storage_write(u32 id, void *pbuf, u32 size)
function: write vendor storage by id
input : id: item id;
pbuf: data buffer;
size: number bytes to write.
return:  0: write success
         other: write fail
```

<!-- English PDF p.12 -->

### 4.1 API für NON-GKI-Kernel

<!-- English PDF p.12 -->

Quellcode: `kernel/drivers/soc/rockchip/rk_vendor_storage.c`

<!-- English PDF p.12 -->

```text
int rk_vendor_read(u32 id, void *pbuf, u32 size)
function: read vendor storage by id
input : id: item id;
pbuf: data buffer;
size: number bytes to read.
return: other: number byte have read.
        -1: read fail

int rk_vendor_write(u32 id, void *pbuf, u32 size)
function: write vendor storage by id
input : id, item id;
pbuf: data buffer;
size: number bytes to write.
return: 0: write success
        other : write fail
```

<!-- English PDF p.13 -->

Menuconfig-Konfiguration

<!-- English PDF p.13 -->

![4.1 API für NON-GKI-Kernel: englisches Original, Seite 13](/docs/rockchip-vendor-storage-v13/assets/en-p013-figure-01.png)

*4.1 API für NON-GKI-Kernel: englisches Original, Seite 13*

```text
CONFIG_ROCKCHIP_VENDOR_STORAGE:

Say Y here to enable vendor storage support.
Vendor storage is used for stored SN, MAC, BT ADDR etc.

Symbol: ROCKCHIP_VENDOR_STORAGE [=y]
Type  : boolean
Prompt: Rockchip vendor storage support
  Location:
    -> Device Drivers
      -> SOC (System On Chip) specific Drivers
  Defined at drivers/soc/rockchip/Kconfig:6
  Depends on: ARCH_ROCKCHIP [=y] || COMPILE_TEST
```

<!-- English PDF p.13 -->

### 4.2 API für GKI-Kernel

<!-- English PDF p.13 -->

Aufgrund der GKI-Kernelschnittstellenbeschränkungen verlangt die Quelle, `ram_vendor_storage.ko` zum Kernel hinzuzufügen, damit Vendor Storage die Leseschnittstelle unterstützt; die Schreibschnittstelle wird nicht unterstützt.

<!-- English PDF p.13 -->

### 4.3 Android-API

<!-- English PDF p.13 -->

Quellcode: `hardware/rockchip/libvendor_storage/vendor_storage.c`

<!-- English PDF p.13 -->

```text
/*
 * vendor_storage_init must be call first
 * rerurn:  ret=0 succes   ret<0 failed
 */
 int vendor_storage_init(void);

/*
 * emmc_vendor_write
 * id: item id
 * pbuf: write data
 * size: vendor_item.size
 * rerurn:  ret>0 succes   ret<0 failed
 */
 int emmc_vendor_write(uint32 id, void *pbuf, uint32 size);

 /*
 * emmc_vendor_read
 * id: item id
 * pbuf: read data
 * size: vendor_item.size
 * rerurn:  ret>0 succes   ret<0 failed
 */
 int emmc_vendor_read(uint32 id, void *pbuf, uint32 size);
```

<!-- English PDF p.13 -->

Ein Anwendungsbeispiel enthält `hardware/rockchip/libvendor_storage/vendor_storage_test.c`.

<!-- English PDF p.14 -->

## 5. PC-Demowerkzeug

<!-- English PDF p.14 -->

SN auswählen, den SN-Wert eingeben und ENTER drücken, um das SN-Element zur Schreibanforderungsliste hinzuzufügen.

<!-- English PDF p.14 -->

![5. PC-Demowerkzeug: englisches Original, Seite 14](/docs/rockchip-vendor-storage-v13/assets/en-p014-figure-01.png)

*5. PC-Demowerkzeug: englisches Original, Seite 14*

<!-- English PDF p.14 -->

Mit der Schaltfläche Burning werden die Daten in Vendor Storage geschrieben.

<!-- English PDF p.15 -->

![5. PC-Demowerkzeug: englisches Original, Seite 15](/docs/rockchip-vendor-storage-v13/assets/en-p015-figure-01.png)

*5. PC-Demowerkzeug: englisches Original, Seite 15*

<!-- English PDF p.15 -->

SN auswählen und Read anklicken, um Daten aus Vendor Storage zu lesen.

<!-- English PDF p.15 -->

![5. PC-Demowerkzeug: englisches Original, Seite 15](/docs/rockchip-vendor-storage-v13/assets/en-p015-figure-02.png)

*5. PC-Demowerkzeug: englisches Original, Seite 15*

<!-- English PDF p.16 -->

## 6. Quellcode des PC-Werkzeugs

<!-- English PDF p.16 -->

Daten mit dem PC-Werkzeug lesen

<!-- English PDF p.16 -->

```text
/*----------------------------------------------------------------------
Name    : RK_ReadProvisioningData
Desc    : Read provisioning data by id
Params  : (IN)nID: id
          (OUT)pDataBuffer: buffer to save data, malloc by caller
          (IN|OUT)nBufferSize: in = size of buffer,out = actual data size
          (IN)dwLayer:device layer
Return  : TRUE: SUCCESSED
          FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_ReadProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT &nBufferSize,DWORD dwLayer=0);
```

<!-- English PDF p.16 -->

Daten mit dem PC-Werkzeug schreiben

<!-- English PDF p.16 -->

```text
 /*----------------------------------------------------------------------
Name    : RK_WriteProvisioningData
Desc    : Write provisioning data by id
Params  : (IN)nID: id
          (IN)pDataBuffer: buffer to save data, malloc by caller
          (IN)nBufferSize: size of buffer
          (IN)dwLayer:device layer
Return  : TRUE: SUCCESSED
          FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_WriteProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT nBufferSize,DWORD dwLayer=0);
```

<!-- English PDF p.16 -->

## 7. Linux-Anwendungsbeispiel

<!-- English PDF p.16 -->

Zugriff über den vom Kernel bereitgestellten Knoten `vendor_storage`.

<!-- English PDF p.16 -->

```text
#include <fcntl.h>
#include <sys/ioctl.h>

typedef unsigned short uint16;
typedef unsigned long uint32;
typedef unsigned char uint8;

#define VENDOR_REQ_TAG      0x56524551
#define VENDOR_READ_IO      _IOW('v', 0x01, unsigned int)
#define VENDOR_WRITE_IO     _IOW('v', 0x02, unsigned int)
#define VENDOR_SN_ID        1
#define VENDOR_WIFI_MAC_ID  2
#define VENDOR_LAN_MAC_ID   3
#define VENDOR_BLUETOOTH_ID 4

struct rk_vendor_req {
    u32 tag;
    u16 id;
    u16 len;
    u8 data[1];
};

int vendor_storage_read_test(void)
{
    uint32 i;
    int ret ;
    uint8 p_buf[2048]; /* malloc req buffer or used extern buffer */
    struct rk_vendor_req *req;

    req = (struct rk_vendor_req *)p_buf;
    int sys_fd = open("/dev/vendor_storage",O_RDWR,0);
    if(sys_fd < 0){
        ERROR("vendor_storage open fail\n");
        return -1;
    }

    req->tag = VENDOR_REQ_TAG;
    req->id = VENDOR_SN_ID;
    req->len = 512; /* max read length to read*/

    ret = ioctl(sys_fd, VENDOR_READ_IO, req);
    /* return req->len is the real data length stored in the NV-storage */
    if(ret){
        ERROR("vendor read error\n");
        return -1;
    }

    return 0;
}

int vendor_storage_write_test(void)
{
    uint32 i;
    int ret ;
    uint8 p_buf[2048]; /* malloc req buffer or used extern buffer */
    struct rk_vendor_req *req;

    req = (struct rk_vendor_req *)p_buf;
    int sys_fd = open("/dev/vendor_storage",O_RDWR,0);
    if(sys_fd < 0){
        ERROR("vendor_storage open fail\n");
        return -1;
    }
    req->tag = VENDOR_REQ_TAG;
    req->id = VENDOR_SN_ID;
    req->len = 32; /* data len */
    for (i = 0; i < 32; i++)
        req->data[i] = i;
    ret = ioctl(sys_fd, VENDOR_WRITE_IO, req);
    if(ret){
        ERROR("vendor write error\n");
        return -1;
    }

    return 0;
}
```

<!-- English PDF p.18 -->

Zugriff aus Benutzeranwendungen ohne Kerneltreiber:

<!-- English PDF p.18 -->

Implementierung siehe `hardware/rockchip/libvendor_storage/vendor_storage_test.c`.

{% endraw %}
