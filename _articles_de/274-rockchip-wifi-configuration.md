---
title: "Rockchip Android: WLAN-Konfiguration und SDIO-Fehlersuche"
description: "Rockchip Android: WLAN-Konfiguration und SDIO-Fehlersuche"
excerpt: "Rockchip Android: WLAN-Konfiguration und SDIO-Fehlersuche"
translation_key: "274-rockchip-wifi-configuration"
slug: "274-rockchip-wifi-configuration"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Grundlage: zweisprachiges RK-SM-YF-211 V1.6 zu WLAN-Kompatibilität, Modulbau/Laden und SDIO. Behandelt werden Android 8/9/10/11 und Linux ab 4.4, nicht alle aktuellen BSPs. Bei ArmSoM Funkmodul, SoC, BSP, Pins und Kernel prüfen. Plattformreferenz ohne Hardwaretest. Alle Grafiken stammen aus dem zweisprachigen Original, ohne separaten englischen Satz.

## 1 Zweck

Eine Firmware mit Kompatibilitätsrahmen unterstützt mehrere passende Module. Laut Quelle sind danach keine weiteren Android-/Kernel-Einstellungen nötig, sofern SDK, Geräteliste und Hardware passen.

### 1.1 Kernel

AP6xxx und Realtek müssen Module sein, nicht in kernel.img eingebaut. Einbau siehe Abschnitt 6 (Quelle irrtümlich 7). Defconfig:

```kconfig
CONFIG_WL_ROCKCHIP=y
CONFIG_WIFI_BUILD_MODULE=y
# CONFIG_WIFI_LOAD_DRIVER_WHEN_KERNEL_BOOTUP is not set
CONFIG_AP6XXX=m
CONFIG_RTL_WIRELESS_SOLUTION=y
CONFIG_RTL8188EU=m
CONFIG_RTL8188FU=m
CONFIG_RTL8189ES=m
CONFIG_RTL8189FS=m
CONFIG_RTL8723BS=m
CONFIG_RTL8723BU=m
CONFIG_RTL8723CS=m
CONFIG_RTL8723DS=m
```

```text
Device Drivers --->
    [*] Network device support --->
        [*] Wireless LAN --->
            [*] Rockchip Wireless LAN support --->
```

![Technische Abbildung 1, PDF-Seite 6 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p06-1.png)

Technische Abbildung 1, PDF-Seite 6 (zweisprachiges Original)

Der Chiptyp im DTS ist optional; das Laden hängt nicht von wifi_chip_type ab. Bei anderem Design Pins prüfen; ab Linux 4.4 wird die Versorgung über SDIO reset-gpios konfiguriert.

```dts
sdio_pwrseq: sdio-pwrseq {
    compatible = "mmc-pwrseq-simple";
    clocks = <&rk818 1>;
    clock-names = "ext_clock";
    pinctrl-names = "default";
    pinctrl-0 = <&wifi_enable_h>;
    /*
     * On the module itself this is one of these (depending
     * on the actual card populated):
     * - SDIO_RESET_L_WL_REG_ON
     * - PDN (power down when low)
     */
    reset-gpios = <&gpio3 4 GPIO_ACTIVE_LOW>; //wifi power
};
wireless-wlan {
    compatible = "wlan-platdata";
    wifi_chip_type ="ap6255"; //或者配置为 or configured as wifi_chip_type = "";
    WIFI,host_wake_irq = <&gpio0 GPIO_D4 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

Die Referenz-Stromsteuerung ist aktiv High; Pin und Polarität prüfen. Für alle Module Strompins und SDIO-Pegel vorher abgleichen; siehe 4.

### 1.2 Android

Kernelbau erzeugt .ko-Dateien; Android kopiert sie nach /vendor/lib/modules/ in vendor.img. Datei vendor/rockchip/common/wifi/wifi.mk:

```make
WIFI_KO_FILES := $(shell find $(TOPDIR)kernel/drivers/net/wireless/rockchip_wlan -name "*.ko" -type f)
BOARD_VENDOR_KERNEL_MODULES += \
    $(foreach file, $(WIFI_KO_FILES), $(file))
```

![Technische Abbildung 1, PDF-Seite 7 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p07-2.png)

Technische Abbildung 1, PDF-Seite 7 (zweisprachiges Original)

## 2 Kompatibilitätsprinzip

### 2.1 Erkennung

1. Beim Start versorgen und SDIO scannen.
2. Beim WLAN-Start uevent unter sys/bus/sdio, sys/bus/usb und Quellenpfad sys/bus/pic (PCIe) lesen; pic ist vermutlich falsch, PCI-Pfad prüfen.
3. .ko nach VID/PID laden.
4. wpa_supplicant-Argumente nach Typ wählen. Verzeichnisse:

```text
android/frameworks/opt/net/wifi
kernel/net/rfkill/rfkill-wlan.c
hardware/broadcom
external/wpa_supplicant_8
```

## 3 Neue Module

Das SDK enthält den Rahmen; folgende Stellen ändern.

### 3.1 Portierung

Treiber liegen in kernel/drivers/net/wireless/rockchip_wlan. Kconfig/Makefile unter kernel/drivers/net/wireless ergänzen; manche benötigen eigene Änderungen. Für Realtek das Portierungshandbuch beachten. Kernel muss .ko korrekt bauen; nach Netzwerkkonfigurationsänderungen neu bauen, um Stack-Inkompatibilität zu vermeiden.

### 3.2 Kompatibilitätszuordnung

Namen und VID/PID in supported_wifi_devices[] in frameworks/opt/net/wifi/libwifi_hal/rk_wifi_ctrl.cpp ergänzen; IDs aus uevent lesen. AP6255 heißt im Text 02d0:09bf, im Screenshot/später 02d0:a9bf; tatsächliche Enumeration prüfen.

```cpp
typedef struct _wifi_devices
{
    char wifi_name[64];
    char wifi_vid_pid[64];
} wifi_device;

static wifi_device supported_wifi_devices[] = {
    {"RTL8188EU", "0bda:8179"},
    {"RTL8188EU", "0bda:0179"},
    {"RTL8723BU", "0bda:b720"},
    {"RTL8723BS", "024c:b723"},
    {"RTL8822BS", "024c:b822"},
    {"RTL8723CS", "024c:b703"},
    {"RTL8723DS", "024c:d723"},
    {"RTL8188FU", "0bda:f179"},
    {"RTL8822BU", "0bda:b82c"},
    {"RTL8189ES", "024c:8179"},
    {"RTL8189FS", "024c:f179"},
    {"RTL8192DU", "0bda:8194"},
    {"RTL8812AU", "0bda:8812"},
    {"SSV6051", "3030:3030"},
    {"ESP8089", "6666:1111"},
    {"AP6354", "02d0:4354"},
    {"AP6330", "02d0:4330"},
    {"AP6356S", "02d0:4356"},
    {"AP6335", "02d0:4335"},
    {"AP6255", "02d0:a9bf"},
    {"RTL8822BE", "10ec:b822"},
};
```

![Technische Abbildung 1, PDF-Seite 9 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p09-3.png)

Technische Abbildung 1, PDF-Seite 9 (zweisprachiges Original)

wifi_ko_file_name module_list[] in wifi_hal_common.cpp enthält Pfade und Argumente als XXXX_DRIVER_MODULE_PATH. Ohne Argumente UNKKOWN_DRIVER_MODULE_ARG verwenden (Originalschreibweise), sonst Treiberanleitung. Namen müssen supported_wifi_devices[] entsprechen; die Quelle schreibt auch supported_wifi_devies[].

```cpp
#define RTL8188EU_DRIVER_MODULE_PATH "/vendor/lib/modules/8188eu.ko"
#define RTL8723BU_DRIVER_MODULE_PATH "/vendor/lib/modules/8723bu.ko"
#define RTL8723BS_DRIVER_MODULE_PATH "/vendor/lib/modules/8723bs.ko"
#define RTL8723BS_VQ0_DRIVER_MODULE_PATH "/vendor/lib/modules/8723bs-vq0.ko"
#define RTL8723CS_DRIVER_MODULE_PATH "/vendor/lib/modules/8723cs.ko"
#define RTL8723DS_DRIVER_MODULE_PATH "/vendor/lib/modules/8723ds.ko"
#define RTL8188FU_DRIVER_MODULE_PATH "/vendor/lib/modules/8188fu.ko"
#define RTL8822BU_DRIVER_MODULE_PATH "/vendor/lib/modules/8822bu.ko"
#define RTL8822BS_DRIVER_MODULE_PATH "/vendor/lib/modules/8822bs.ko"
#define RTL8189ES_DRIVER_MODULE_PATH "/vendor/lib/modules/8189es.ko"
#define RTL8189FS_DRIVER_MODULE_PATH "/vendor/lib/modules/8189fs.ko"
#define RTL8192DU_DRIVER_MODULE_PATH "/vendor/lib/modules/8192du.ko"
#define RTL8812AU_DRIVER_MODULE_PATH "/vendor/lib/modules/8812au.ko"
#define RTL8822BE_DRIVER_MODULE_PATH "/vendor/lib/modules/8822be.ko"
#define SSV6051_DRIVER_MODULE_PATH "/vendor/lib/modules/ssv6051.ko"
#define ESP8089_DRIVER_MODULE_PATH "/vendor/lib/modules/esp8089.ko"
#define BCM_DRIVER_MODULE_PATH "/vendor/lib/modules/bcmdhd.ko"
#define DRIVER_MODULE_PATH_UNKNOW ""

#define RTL8188EU_DRIVER_MODULE_NAME "8188eu"
#define RTL8723BU_DRIVER_MODULE_NAME "8723bu"
#define RTL8723BS_DRIVER_MODULE_NAME "8723bs"
#define RTL8723BS_VQ0_DRIVER_MODULE_NAME "8723bs-vq0"
#define RTL8723CS_DRIVER_MODULE_NAME "8723cs"
#define RTL8723DS_DRIVER_MODULE_NAME "8723ds"
#define RTL8188FU_DRIVER_MODULE_NAME "8188fu"
#define RTL8822BU_DRIVER_MODULE_NAME "8822bu"
#define RTL8822BS_DRIVER_MODULE_NAME "8822bs"
#define RTL8189ES_DRIVER_MODULE_NAME "8189es"
#define RTL8189FS_DRIVER_MODULE_NAME "8189fs"
#define RTL8192DU_DRIVER_MODULE_NAME "8192du"
#define RTL8812AU_DRIVER_MODULE_NAME "8812au"
#define RTL8822BE_DRIVER_MODULE_NAME "8822be"
#define SSV6051_DRIVER_MODULE_NAME "ssv6051"
#define ESP8089_DRIVER_MODULE_NAME "esp8089"
#define BCM_DRIVER_MODULE_NAME "bcmdhd"
#define DRIVER_MODULE_NAME_UNKNOW ""
```

![Technische Abbildung 1, PDF-Seite 10 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p10-4.png)

Technische Abbildung 1, PDF-Seite 10 (zweisprachiges Original)

![Technische Abbildung 2, PDF-Seite 10 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p10-5.png)

Technische Abbildung 2, PDF-Seite 10 (zweisprachiges Original)

```cpp
wifi_ko_file_name module_list[] =
{
    {"RTL8723BU", RTL8723BU_DRIVER_MODULE_NAME, RTL8723BU_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8188EU", RTL8188EU_DRIVER_MODULE_NAME, RTL8188EU_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8192DU", RTL8192DU_DRIVER_MODULE_NAME, RTL8192DU_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8822BU", RTL8822BU_DRIVER_MODULE_NAME, RTL8822BU_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8822BS", RTL8822BS_DRIVER_MODULE_NAME, RTL8822BS_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8188FU", RTL8188FU_DRIVER_MODULE_NAME, RTL8188FU_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8189ES", RTL8189ES_DRIVER_MODULE_NAME, RTL8189ES_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8723BS", RTL8723BS_DRIVER_MODULE_NAME, RTL8723BS_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8723CS", RTL8723CS_DRIVER_MODULE_NAME, RTL8723CS_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8723DS", RTL8723DS_DRIVER_MODULE_NAME, RTL8723DS_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8812AU", RTL8812AU_DRIVER_MODULE_NAME, RTL8812AU_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8189FS", RTL8189FS_DRIVER_MODULE_NAME, RTL8189FS_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"RTL8822BE", RTL8822BE_DRIVER_MODULE_NAME, RTL8822BE_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"SSV6051", SSV6051_DRIVER_MODULE_NAME, SSV6051_DRIVER_MODULE_PATH, SSV6051_DRIVER_MODULE_ARG},
    {"ESP8089", ESP8089_DRIVER_MODULE_NAME, ESP8089_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"AP6335", BCM_DRIVER_MODULE_NAME, BCM_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"AP6330", BCM_DRIVER_MODULE_NAME, BCM_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"AP6354", BCM_DRIVER_MODULE_NAME, BCM_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"AP6356S", BCM_DRIVER_MODULE_NAME, BCM_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"AP6255", BCM_DRIVER_MODULE_NAME, BCM_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"APXXX", BCM_DRIVER_MODULE_NAME, BCM_DRIVER_MODULE_PATH, UNKKOWN_DRIVER_MODULE_ARG},
    {"UNKNOW", DRIVER_MODULE_NAME_UNKNOW, DRIVER_MODULE_PATH_UNKNOW, UNKKOWN_DRIVER_MODULE_ARG},
};
```

![Technische Abbildung 1, PDF-Seite 11 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p11-6.png)

Technische Abbildung 1, PDF-Seite 11 (zweisprachiges Original)

### 3.3 wpa_supplicant-Argumente

init.connectivity.rc liest /vendor/etc/wifi/wpa_config.txt:

```text
service wpa_supplicant /vendor/bin/hw/wpa_supplicant \
    /vendor/etc/wifi/wpa_config.txt
    # we will start as root and wpa_supplicant will switch to user wifi
    # after setting up the capabilities required for WEXT
    # user wifi
    # group wifi inet keystore
    interface android.hardware.wifi.supplicant@1.0::ISupplicant default
    interface android.hardware.wifi.supplicant@1.1::ISupplicant default
    interface android.hardware.wifi.supplicant@1.2::ISupplicant default
    class main
    socket wpa_wlan0 dgram 660 wifi wifi
    disabled
    oneshot
```

Der Quellenpfad deivice/rockchip/common/wpa_config.txt schreibt vermutlich device falsch. wpa_supplicant/main.c wählt nach Chip; APxxx sucht [broadcom] mit BROADCOM_MODULE_NAME.

```c
int main(int argc, char *argv[])
{
    int ret = -1;
    char module_type[20]={0};
    wpa_printf(MSG_INFO,"argc = %d\n",argc);
    if(argc == 2) {
        if (wifi_type[0] == 0) {
            check_wifi_chip_type_string(wifi_type);
        }
        wpa_printf(MSG_INFO,"Current wifi chip is %s\n",wifi_type);
        if (0 == strncmp(wifi_type, "RTL", 3)) {
            wpa_printf(MSG_INFO,"Start rtl wpa_supplicant\n");
            ret = read_wpa_param_config(REALTEK_MODULE_NAME,argv[1]);
        } else if (0 == strncmp(wifi_type, "AP", 2)) {
            wpa_printf(MSG_INFO,"Start bcm wpa_supplicant\n");
            ret = read_wpa_param_config(BROADCOM_MODULE_NAME,argv[1]);
        } else if (0 == strncmp(wifi_type, "SSV", 3)) {
            wpa_printf(MSG_INFO,"Start ssv wpa_supplicant\n");
            ret = read_wpa_param_config(SSV_MODULE_NAME,argv[1]);
        } else if (0 == strncmp(wifi_type, "ESP", 3)) {
            wpa_printf(MSG_INFO,"Start esp wpa_supplicant\n");
            ret = read_wpa_param_config(ESP_MODULE_NAME,argv[1]);
        } else {
            wpa_printf(MSG_INFO,"Start wpa_supplicant\n");
            sprintf(module_type,"[%s]",wifi_type);
            ret = read_wpa_param_config(module_type,argv[1]);
        }
    } else {
        wpa_printf(MSG_INFO,"Start wpa_supplicant\n");
        ret = main_loop(argc, argv);
    }
    return ret;
}
#define BROADCOM_MODULE_NAME "[broadcom]"
```

```text
[broadcom]
/vendor/bin/hw/wpa_supplicant
-O/data/vendor/wifi/wpa/sockets
-puse_p2p_group_interface=1
-g@android:wpa_wlan0
```

![Technische Abbildung 1, PDF-Seite 12 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p12-7.png)

Technische Abbildung 1, PDF-Seite 12 (zweisprachiges Original)

![Technische Abbildung 2, PDF-Seite 12 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p12-8.png)

Technische Abbildung 2, PDF-Seite 12 (zweisprachiges Original)

![Technische Abbildung 3, PDF-Seite 12 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p12-9.png)

Technische Abbildung 3, PDF-Seite 12 (zweisprachiges Original)

Parameter für [broadcom], [realtek], [ssv], [esp] sind vorhanden; weitere im selben Format ergänzen.

## 4 Hardware-/Software-Kompatibilität

Eine SDK-Firmware unterstützt SDIO2.0/3.0 mit höchstens50M/150M. Siehe Rockchip-Developer-Guide-linux4.4-SDMMC-SDIO-eMMC.pdf und Rockchip-Developer-Guide-linux4.4-PCIe.pdf.

## 5 .ko bauen

.ko muss zur Netzwerkkonfiguration von kernel.img passen. Nach Änderungen mkimage.sh ausführen, vendor.img neu bauen und beide flashen.

## 6 Laden

Ohne automatische Kompatibilität kann der Treiber eingebaut werden. AP6255-Beispiel (erster Name ohne CONFIG_; Kconfig prüfen):

```kconfig
WIFI_BUILD_MODULE = n
CONFIG_AP6XXX = y
```

![Technische Abbildung 1, PDF-Seite 14 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p14-10.png)

Technische Abbildung 1, PDF-Seite 14 (zweisprachiges Original)

## 7 WLAN startet nicht

Zuerst USB/SDIO nach Start prüfen. Normale Protokolle:

```text
mmc2: new ultra high speed SDR104 SDIO card at address 0001
usb 2-1: new high-speed USB device number 2 using ehci-platform
usb 2-1: New USB device found, idVendor=0bda, idProduct=b82c
usb 2-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
usb 2-1: Product: 802.11ac NIC
```

Falls fehlend, Versorgung, Enumeration, Hardware und DTS prüfen. Strom ist für IDs erforderlich. uevent unter sys/bus/sdio/devices oder sys/bus/usb/devices lesen. AP6255-Beispiel:

```text
cat /sys/bus/sdio/devices/mmc1\:0001\:3/uevent
SDIO_CLASS=02
SDIO_ID=02D0:A9BF
MODALIAS=sdio:c02v02D0dA9BF
```

![Technische Abbildung 1, PDF-Seite 15 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p15-11.png)

Technische Abbildung 1, PDF-Seite 15 (zweisprachiges Original)

![Technische Abbildung 2, PDF-Seite 15 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p15-12.png)

Technische Abbildung 2, PDF-Seite 15 (zweisprachiges Original)

Nach Erkennung Laden prüfen; die Grafik zeigt not ready→ready. Quellentabelle bleibt erhalten; RTL8188EU→8188fu.ko scheint falsch. android/frameworks/opt/net/wifi/libwifi_hal/wifi_hal_common.cpp prüfen.

| Modul | .ko |
|---|---|
| AP6xxx(SDIO) | bcmdhd.ko |
| RTL8723BU(USB) | 8723bu.ko |
| RTL8188EU(USB) | 8188eu.ko |
| RTL8188EU(USB) | 8188fu.ko |
| RTL8723BS(SDIO) | 8723bs.ko |
| RTL8723CS(SDIO) | 8723cs.ko |
| RTL8723DS(SDIO) | 8723ds.ko |
| RTL8189ES(SDIO) | 8189es.ko |
| RTL8189FS(SDIO) | 8189fs.ko |

Bei falschen/fehlenden Dateien1.1/1.2 prüfen. Alter Screenshot: /vendor/lib/modules/wifi, Text: /vendor/lib/modules/; SDK-Paketierung prüfen. Netzwerkänderungen ohne ko-Neubau können Kernel-Panic auslösen; siehe5.

![Technische Abbildung 1, PDF-Seite 16 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p16-13.png)

Technische Abbildung 1, PDF-Seite 16 (zweisprachiges Original)

## 8 SDIO-Diagnose

### 8.1 Hardware

Grüne Bereiche prüfen:

![Technische Abbildung 2, PDF-Seite 16 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p16-14.png)

Technische Abbildung 2, PDF-Seite 16 (zweisprachiges Original)

![Technische Abbildung 1, PDF-Seite 17 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p17-15.png)

Technische Abbildung 1, PDF-Seite 17 (zweisprachiges Original)

![Technische Abbildung 2, PDF-Seite 17 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p17-16.png)

Technische Abbildung 2, PDF-Seite 17 (zweisprachiges Original)

- WIFI_D0~3 und WIFI_CMD sind normalerweise High bei VCCIO_WL-Spannung.
- WIFI_CLK ist normalerweise Low, ebenfalls abhängig vonVCCIO_WL.
- VBAT_WL bleibt High; “need to print3.3V” ist unklar.3.3V erhalten, Modulspezifikation prüfen.
- VCCIO_WL versorgt DATA/CMD/CLK mit3.3V/1.8V; fürSDIO3.0 verlangt die Quelle1.8V.
- WIFI_REG_ON:3.3V im Betrieb,0V ausgeschaltet.
- 32K- und26M/37.4M-Oszillatoren müssen Signale liefern.

Zuerst Spannungen und Oszillatoren prüfen. Gemeinsame VBAT_WL/VCCIO_WL-Versorgung kann einbrechen; VCC_IO versorgt laut Grafik viele Peripheriegeräte.

![Technische Abbildung 1, PDF-Seite 18 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p18-17.png)

Technische Abbildung 1, PDF-Seite 18 (zweisprachiges Original)

### 8.2 Software und Signalformen

Befehl/Antwort enthalten Start, Übertragung, Inhalt, CRC und Ende. Lange Antworten und alle Busbreiten bleiben erhalten.

![Technische Abbildung 2, PDF-Seite 18 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p18-18.png)

Technische Abbildung 2, PDF-Seite 18 (zweisprachiges Original)

![Technische Abbildung 3, PDF-Seite 18 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p18-19.png)

Technische Abbildung 3, PDF-Seite 18 (zweisprachiges Original)

![Technische Abbildung 1, PDF-Seite 19 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p19-20.png)

Technische Abbildung 1, PDF-Seite 19 (zweisprachiges Original)

![Technische Abbildung 2, PDF-Seite 19 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p19-21.png)

Technische Abbildung 2, PDF-Seite 19 (zweisprachiges Original)

Quelle nennt48 Takte/48 Bit von Host/Karte; tatsächliche Länge hängt vom Befehl ab, nicht jede Antwort. Oben Erkennung, unten Mehrblock-Lesen/Schreiben.

![Technische Abbildung 1, PDF-Seite 20 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p20-22.png)

Technische Abbildung 1, PDF-Seite 20 (zweisprachiges Original)

![Technische Abbildung 2, PDF-Seite 20 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p20-23.png)

Technische Abbildung 2, PDF-Seite 20 (zweisprachiges Original)

Beispiel: Grün SDMMC_CLK, Gelb SDMMC_CMD, im Leerlauf High. Laut Quelle High/Low-Start Hostbefehl, zweimal Low Kartenantwort; mit Bit-Timing auswerten. Meist48 Bit/Takte; Kartenantwort prüfen. DTS-SDIO muss okay sein, ohne Pin-Mux-Konflikt.

![Technische Abbildung 1, PDF-Seite 21 (zweisprachiges Original)](/docs/rockchip-wifi-configuration/images/pdf-p21-24.png)

Technische Abbildung 1, PDF-Seite 21 (zweisprachiges Original)

### 8.3 Typische Fehler

1. Spannung: WIFI_DATA und VCCIO_WL prüfen.

```text
[ 100.086615] slot->flags = 3
[ 100.086628] CPU: 0 PID: 113 Comm: kworker/u8:3 Tainted: P W O 3.10.0 #250
[ 100.086644] Workqueue: kmmcd mmc_rescan
[ 100.086663] [<c0013e04>] (unwind_backtrace+0x0/0xe0) from [<c0011720>]
(show_stack+0x10/0x14)
[ 100.086677] [<c0011720>] (show_stack+0x10/0x14) from [<c050d3b4>]
(dw_mci_set_ios+0x9c/0x21c)
[ 100.086689] [<c050d3b4>] (dw_mci_set_ios+0x9c/0x21c) from [<c04fabd4>]
(mmc_power_up+0x60/0xa0)
[ 100.086700] [<c04fabd4>] (mmc_power_up+0x60/0xa0) from [<c04faeac>]
(mmc_rescan_try_freq+0x14/0xd0)
[ 100.086710] [<c04faeac>] (mmc_rescan_try_freq+0x14/0xd0) from [<c04fb7b4>]
(mmc_rescan+0x204/0x298)
[ 100.086722] [<c04fb7b4>] (mmc_rescan+0x204/0x298) from [<c00471f0>]
(process_one_work+0x29c/0x458)
[ 100.086734] [<c00471f0>] (process_one_work+0x29c/0x458) from [<c0047540>]
(worker_thread+0x194/0x2d4)
[ 100.086745] [<c0047540>] (worker_thread+0x194/0x2d4) from [<c004ca28>] (kthread+0xa0/0xac)
[ 100.086759] [<c004ca28>] (kthread+0xa0/0xac) from [<c000da98>] (ret_from_fork+0x14/0x3c)
[ 100.086767] 1400..dw_mci_set_ios: wait for unbusy timeout....... STATUS = 0x206 [mmc2]
[ 102.546615] 1009..mci_send_cmd: wait for unbusy timeout.......[mmc2]

[ 102.595819] mmc_host mmc1: Timeout sending command (cmd 0x202000 arg 0x0 status
0x80202000)
```

2. WLAN-Störung: VBAT_WL, WIFI_REG_ON und Oszillatoren prüfen; lange Leiterbahnen verschlechtern Signale: Frequenz senken/Hardware ändern.

```text
dwmmc_rockchip 10218000.rksdmmc: req failed (CMD52): error = 110, timeout = 8000ms
[mmc2] - Timeout recovery procedure start --
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
mmc_host mmc2: Bus speed (slot 0) = 37500000Hz (slot req 400000Hz, actual 398936HZ div = 47)
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
[mmc2] -- Timeout recovery procedure finished --
```

3. Lange Leiterbahnen/schlechte Signalform: Frequenz senken oder Hardware ändern.

```text
[ 200.731403] [mmc2] Data transmission error !!!! MINTSTS: [0x00000080]
[ 200.731426] [mmc2] host was already tuning, Don't need to retry tune again ignore 0.
```

4. Fehlerhaftes WIFI_REG_ON.

```text
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 400000Hz for init[mmc2]
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 600000Hz for init[mmc2]
```

## Referenz

[ArmSoM-Dokumentation](https://docs.armsom.org/), RK-SM-YF-211 V1.6, PDF-Seiten5–22.

{% endraw %}
