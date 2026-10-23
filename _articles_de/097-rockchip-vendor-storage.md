---
title: "Rockchip Vendor Storage: Vollständige Datenlayouts, ID-Definitionen und U-Boot/Linux-APIs"
description: "Rockchip Vendor Storage: Vollständige Datenlayouts, ID-Definitionen und U-Boot/Linux-APIs — Rev.08, SN, MAC, NVM, ioctl."
translation_key: "097-rockchip-vendor-storage"
slug: "097-rockchip-vendor-storage"
lang: "de"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Vendor Storage", "NVM", "Linux", "U-Boot"]
excerpt: "Rockchip Vendor Storage: Vollständige Datenlayouts, ID-Definitionen und U-Boot/Linux-APIs — Rev.08, SN, MAC, NVM, ioctl."
---

{% raw %}

# Rockchip Vendor Storage: Vollständige Datenlayouts, ID-Definitionen und U-Boot/Linux-APIs

Der vollständige Text folgt Appnote_rk_storage_0001, Rev.08, Seiten 4–23. Das einzige PDF liegt im chinesischen Verzeichnis, sein Haupttext ist jedoch Englisch. Die englische Fassung folgt dem Original; Chinesisch, Russisch und Deutsch übersetzen es vollständig. Alle vier Fassungen verwenden dessen englische Originaldiagramme und Screenshots; ein separates chinesisches Original oder PDF aus dem englischen Verzeichnis wurde nicht geliefert. Dies ist eine ArmSoM-Plattformreferenz, keine Zusicherung für jede Platine. Die Quelle nennt keine konkrete SoC-, Platinen-, SDK/BSP- oder Kernelversion. Speicherbackend, Bootlayout, Treiberkonfiguration, ABI und Geräteknoten müssen am tatsächlichen System geprüft werden. Hardwarezugriffe und Stromausfalltests wurden nicht durchgeführt.

> Warnung: Das letzte Schreibbeispiel überschreibt ID 1 (SN) mit den Bytes 0–31. Nicht auf Produktionsgeräten ausführen; zunächst Geräteidentität und Provisionierungsdaten sichern. Typdefinitionen, Fehlermakros und Deskriptorbereinigung sind im Original unvollständig. Der Code bleibt nachvollziehbar erhalten, ist aber nicht als direkt lauffähig bestätigt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-vendor-storage/EDITORIAL-NOTES.md)

<!-- PDF p.4 -->

## 1 Anwendungsübersicht

Vendor Storage speichert SN, MAC und weitere Herstellerdaten. Funktionen:

- Zugriff über eindeutige ID
- Zuverlässige Datenprüfung
- Wiederherstellung nach Stromausfall
- Lesen und Schreiben vom PC
- Lesen und Schreiben aus UBOOT
- Lesen und Schreiben aus dem Kernel
- Lesen und Schreiben aus Linux-Anwendungen

<!-- PDF p.5 -->

## 2 Architektur von Vendor Storage

![Architektur von Vendor Storage — PDF p.5](/docs/rockchip-vendor-storage/assets/en-original-p005-figure-01.png)

Das Diagramm verbindet PC → USB → UBOOT sowie Linux Application → IOCTL NODE mit der Vendor Storage API. Auch der Kernel ist damit verbunden. Die darunterliegende Storage API greift auf EMMC, SPI NOR und NAND zu.

<!-- PDF p.6 -->

## 3 Datenlayout

### 3.1 SPI NOR und EMMC

![Datenlayouts für SPI NOR und EMMC — PDF p.6](/docs/rockchip-vendor-storage/assets/en-original-p006-figure-01.png)

Die Originalabbildung zeigt Header / Index / Data innerhalb der Vendor-Blöcke. Bei SPI NOR stehen vor dem 28K-Bereich 4K; die Vergrößerung zeigt vier mit 4K beschriftete Blöcke. Bei EMMC stehen vor dem 256K-Bereich 3.5M; vergrößert sind vier 64K-Blöcke dargestellt. Die Originalwerte bleiben erhalten und müssen mit dem tatsächlichen Boot- und Speicherlayout abgeglichen werden; die Abbildung ist keine allgemeingültige Partitionierungsanweisung.

<!-- PDF p.7 -->

### 3.2 SPI NAND / SLC NAND

![NAND-Datenlayouts mit MTD und FTL — PDF p.7](/docs/rockchip-vendor-storage/assets/en-original-p007-figure-01.png)

- MTD: Für Vendor Storage ist eine `vnvm`-Partition mit mindestens 512KB erforderlich. Das Diagramm zeigt darin vier 4K-Blöcke und Header / Index / Data.
- Mit FTL: Vier 4K-Blöcke liegen im reservierten Bereich von SPI/SLC NAND (FTL). Die System-API kann auf diesen Bereich nicht zugreifen.

<!-- PDF p.8 -->

### 3.3 Datensatzformat

| Offset (B) | Größe (B) | Name |
| --- | --- | --- |
| 0x0000 | 0x0004 | Tag mit dem Wert 0x524B5644. |
| 0x0004 | 0x0004 | Version, wird nach dem Schreiben erhöht |
| 0x0008 | 0x0002 | Nächster Index |
| 0x000A | 0x0002 | Anzahl der Einträge |
| 0x000C | 0x0002 | Offset des freien Bereichs |
| 0x000E | 0x0002 | Größe des freien Bereichs |
| 0x0010 | 0x0002 | Item0-&gt;id |
| 0x0012 | 0x0002 | Item0-&gt;offset |
| 0x0014 | 0x0002 | Item0-&gt;size |
| 0x0016 | 0x0002 | Item0-&gt;flag(reversed) |
| 0x0018 | 0x0008 | Item1 |
| … | … | Item x |
| --- | --- | Daten (EMMC: etwa 62KB, sonst etwa 3.5KB) |
| Size – 0x08 | 0x0004 | Hash |
| Size – 0x04 | 0x0004 | Version2, gleicher Wert wie Version |

<!-- PDF p.9 -->

## 4 ID-Definitionen

| ID | Funktion |
| --- | --- |
| 0 | Reserviert |
| 1 | SN |
| 2 | WIFI MAC |
| 3 | LAN MAC |
| 4 | BT MAC |
| 5 | HDCP 1.4 HDMI |
| 6 | HDCP 1.4 DP |
| 7 | HDCP 2.X |
| 8 | DRM KEY |
| 9 | PLAYREADY Cert |
| 10 | ATTENTION KEY |
| 11 | PLAYREADY ROOT KEY 0 |
| 12 | PLAYREADY ROOT KEY 1 |
| 13 | HDCP 1.4 HDMIRX |
| 14 | SENSOR CALIBRATION (Sensorkalibrierung) |
| 15 | IMEI |
| 16 | LAN_RGMII_DL |
| 17 | EINK_VCOM_ID |
| 18 | FIRMWARE_VER_ID |
| 19 | HDCP_2X_RX_ID |
| 20 | HDCP_2X_HDMIRX_ID |
| 21 – 31 | Für spätere RK-Nutzung reserviert |
| 32 - 65535 | Herstellernutzung |

<!-- PDF p.10 -->

Die Daten werden im NVM auf 64 Byte ausgerichtet gespeichert. Pro Eintrag werden mindestens 64 Byte reserviert: Schreiben von 1–64 Byte belegt 64 Byte, Schreiben von 65–128 Byte belegt 128 Byte.

<!-- PDF p.11 -->

## 5 API für UBOOT

`u-boot/board/rockchip/common/storage/storage.c`

### `vendor_storage_init`

```c
int vendor_storage_init(void);
```

| Feld | Beschreibung |
| --- | --- |
| Funktion | Vendor Storage initialisieren |
| Eingabe | Keine |
| Rückgabe | 0: erfolgreich; sonst: fehlgeschlagen |

### `vendor_storage_read`

```c
int vendor_storage_read(u32 id, void *pbuf, u32 size);
```

| Feld | Beschreibung |
| --- | --- |
| Funktion | Vendor Storage anhand der ID lesen |
| Eingabe | id: Eintrags-ID; pbuf: Datenpuffer; size: Anzahl zu lesender Byte |
| Rückgabe | -1: Lesefehler; sonst: Anzahl gelesener Byte |

<!-- PDF p.12 -->

### `vendor_storage_write`

```c
int vendor_storage_write(u32 id, void *pbuf, u32 size);
```

| Feld | Beschreibung |
| --- | --- |
| Funktion | Vendor Storage anhand der ID schreiben |
| Eingabe | id: Eintrags-ID; pbuf: Datenpuffer; size: Anzahl zu schreibender Byte |
| Rückgabe | 0: Schreiben erfolgreich; sonst: Schreibfehler |

<!-- PDF p.13 -->

## 6 Kernel-API

`kernel/drivers/soc/rockchip/rk_vendor_storage.c`

`kernel/drivers/soc/rockchip/sdmmc_vendor_storage.c`

### `rk_vendor_read`

```c
int rk_vendor_read(u32 id, void *pbuf, u32 size);
```

| Feld | Beschreibung |
| --- | --- |
| Funktion | Vendor Storage anhand der ID lesen |
| Eingabe | id: Eintrags-ID; pbuf: Datenpuffer; size: Anzahl zu lesender Byte |
| Rückgabe | -1: Lesefehler; sonst: Anzahl gelesener Byte |

### `rk_vendor_write`

```c
int rk_vendor_write(u32 id, void *pbuf, u32 size);
```

| Feld | Beschreibung |
| --- | --- |
| Funktion | Vendor Storage anhand der ID schreiben |
| Eingabe | id: Eintrags-ID; pbuf: Datenpuffer; size: Anzahl zu schreibender Byte |
| Rückgabe | 0: Schreiben erfolgreich; sonst: Schreibfehler |

<!-- PDF p.14 -->

## 7 Kernelkonfiguration

### Makefile

![Originalkonfiguration des Makefiles — PDF p.14](/docs/rockchip-vendor-storage/assets/en-original-p014-figure-01.png)

```makefile
#
# Rockchip soc drivers
#
obj-$(CONFIG_MMC_DW_ROCKCHIP) += sdmmc_vendor_storage.o
obj-$(CONFIG_ROCKCHIP_VENDOR_STORAGE) += rk_vendor_storage.o
```

### Menuconfig

![Originalhilfe von menuconfig — PDF p.14](/docs/rockchip-vendor-storage/assets/en-original-p014-figure-02.png)

```text
CONFIG_ROCKCHIP_VENDOR_STORAGE:

Say y here to enable vendor storage support.
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

Mit `y` wird Vendor Storage für SN, MAC, BT ADDR und ähnliche Daten aktiviert. Im Originalbild ist das Symbol aktiviert (`[=y]`), Typ boolean, unter Device Drivers → SOC (System On Chip) specific Drivers. Die Abhängigkeit lautet `ARCH_ROCKCHIP [=y] || COMPILE_TEST`; die Definition steht in `drivers/soc/rockchip/Kconfig:6`.

<!-- PDF p.15 -->

## 8 PC-Demowerkzeug

**1.** **SN** auswählen, den SN-Wert eingeben und mit **ENTER** in die Schreibanforderungsliste aufnehmen. Das Beispiel verwendet `123SN`; der Screenshot zeigt `Not found rockusb`.

![SN zur Anforderungsliste hinzufügen — PDF p.15](/docs/rockchip-vendor-storage/assets/en-original-p015-figure-01.png)

<!-- PDF p.16 -->

**2.** **Burning** schreibt die Daten in Vendor Storage. Das Original zeigt `Burning OK.` und `Found one loader`.

![Schreibergebnis im Original — PDF p.16](/docs/rockchip-vendor-storage/assets/en-original-p016-figure-01.png)

<!-- PDF p.17 -->

**3.** **SN** auswählen und **Read** drücken, um die Daten zurückzulesen. Im Beispiel stehen `123SN`, `Reading OK.` und `Found one loader`.

![Leseergebnis im Original — PDF p.17](/docs/rockchip-vendor-storage/assets/en-original-p017-figure-01.png)

<!-- PDF p.18 -->

## 9 Quellcode des PC-Werkzeugs

![Originaldateiliste des PC-Projekts — PDF p.18](/docs/rockchip-vendor-storage/assets/en-original-p018-figure-01.png)

Die Quelle zeigt das Projektverzeichnis, nicht den Inhalt dieser Quelldateien. Der unten abgeschnittene Dateiname bleibt abgeschnitten; sein verborgener Suffix wird nicht erfunden.

```text
cmLib/
colorEdit/
FontStatic/
grid/
res/
upgradeLib/
ProvisioningTool.aps
ProvisioningTool.cpp
ProvisioningTool.h
ProvisioningTool.rc
ProvisioningTool.vcproj
ProvisioningTool.vcproj.HP-INPRC6N...
ProvisioningToolDlg.cpp
ProvisioningToolDlg.h
ReadMe.txt
resource.h
stdafx.cpp
stdafx.h
targetver.h
```

<!-- PDF p.19 -->

## 10 PC-Werkzeug: Daten lesen

```c
/*----------------------------------------------------------------------
Name   : RK_ReadProvisioningData
Desc   : Read provisioning data by id
Params : (IN)nID                    id
         (OUT)pDataBuffer:          buffer to save data, malloc by caller
         (IN|OUT)nBufferSize:       in = size of buffer,out = actual data size
         (IN)dwLayer:               device layer
Return : TRUE:  SUCCESSED
         FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_ReadProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT &nBufferSize,DWORD dwLayer=0);
```

Provisionierungsdaten anhand der ID lesen. Der Aufrufer reserviert `pDataBuffer`. `nBufferSize` enthält bei der Eingabe die Puffergröße und bei der Ausgabe die tatsächliche Datengröße. `dwLayer` wählt die Geräteebene, Standardwert 0. Erfolg: `TRUE`; Fehler: `FALSE`.

<!-- PDF p.20 -->

## 11 PC-Werkzeug: Daten schreiben

```c
/*----------------------------------------------------------------------
Name   : RK_WriteProvisioningData
Desc   : Write provisioning data by id
Params : (IN)nID                    id
         (IN)pDataBuffer:           buffer to save data, malloc by caller
         (IN)nBufferSize:           size of buffer
         (IN)dwLayer:               device layer
Return : TRUE:  SUCCESSED
         FALSE: FAILED
----------------------------------------------------------------------*/
BOOL RK_WriteProvisioningData(USHORT nID,PBYTE pDataBuffer,USHORT nBufferSize,DWORD dwLayer=0);
```

Provisionierungsdaten anhand der ID schreiben. Der Aufrufer reserviert `pDataBuffer`; `nBufferSize` ist die Eingabepuffergröße. `dwLayer` bezeichnet die Geräteebene, Standardwert 0. Erfolg: `TRUE`; Fehler: `FALSE`.

<!-- PDF p.21 -->

## 12 Linux-Beispielcode

```c
#include <fcntl.h>
#include <sys/ioctl.h>

typedef unsigned short uint16;
typedef unsigned long uint32;
typedef unsigned char uint8;

#define VENDOR_REQ_TAG 0x56524551
#define VENDOR_READ_IO _IOW('v', 0x01, unsigned int)
#define VENDOR_WRITE_IO _IOW('v', 0x02, unsigned int)
#define VENDOR_SN_ID 1
#define VENDOR_WIFI_MAC_ID 2
#define VENDOR_LAN_MAC_ID 3
#define VENDOR_BLUETOOTH_ID 4

struct rk_vendor_req {
    u32 tag;
    u16 id;
    u16 len;
    u8 data[1];
};
```

<!-- PDF p.22 -->

### 12.1 Lesetest

```c
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
```

<!-- PDF p.23 -->

### 12.2 Schreibtest

```c
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
    rknand_print_hex_data("vendor write:", (uint32*)req, req->len + 8);
    ret = ioctl(sys_fd, VENDOR_WRITE_IO, req);
    if(ret){
        ERROR("vendor write error\n");
        return -1;
    }
    return 0;
}
```

{% endraw %}
