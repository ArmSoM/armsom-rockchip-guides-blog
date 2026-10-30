---
title: "Rockchip Android Wi-Fi configuration and SDIO troubleshooting"
description: "Rockchip Android Wi-Fi configuration and SDIO troubleshooting"
excerpt: "Rockchip Android Wi-Fi configuration and SDIO troubleshooting"
translation_key: "274-rockchip-wifi-configuration"
slug: "274-rockchip-wifi-configuration"
lang: "en"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Based on bilingual RK-SM-YF-211 V1.6, covering Wi-Fi compatibility, module builds/loading and SDIO diagnosis. The source covers Android 8/9/10/11 and Linux 4.4 or later, not every current BSP. For ArmSoM check wireless module, SoC, BSP, pins and kernel. This is a platform reference without hardware validation. All figures come from the same bilingual source; no separate English set exists.

## 1 Purpose

A firmware built with the compatibility framework supports multiple matching modules. The source says no further Android/kernel configuration is needed, subject to its SDK, device list and hardware assumptions.

### 1.1 Kernel

AP6xxx and Realtek must be modules, not built into kernel.img. For built-in operation see section 6 (the source incorrectly says 7). Defconfig:

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

![Technical figure 1, source PDF page 6 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p06-1.png)

Technical figure 1, source PDF page 6 (bilingual original)

The board DTS chip type is optional; loading does not depend on wifi_chip_type. For non-reference designs check these pins; from Linux 4.4 power is configured through SDIO reset-gpios.

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

The reference power control is active-high; verify actual pin and polarity. For all supported modules, confirm board power pins and SDIO levels beforehand; see section 4.

### 1.2 Android

Kernel builds generate .ko files; Android copies them into /vendor/lib/modules/ in vendor.img. File vendor/rockchip/common/wifi/wifi.mk:

```make
WIFI_KO_FILES := $(shell find $(TOPDIR)kernel/drivers/net/wireless/rockchip_wlan -name "*.ko" -type f)
BOARD_VENDOR_KERNEL_MODULES += \
    $(foreach file, $(WIFI_KO_FILES), $(file))
```

![Technical figure 1, source PDF page 7 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p07-2.png)

Technical figure 1, source PDF page 7 (bilingual original)

## 2 Compatibility principle

### 2.1 Identification

1. Power on and scan SDIO at boot.
2. At Wi-Fi start read uevent under sys/bus/sdio, sys/bus/usb and source sys/bus/pic (PCIe); pic appears misspelled, verify the actual PCI path.
3. Load .ko by VID/PID.
4. Select wpa_supplicant arguments by type. Core directories:

```text
android/frameworks/opt/net/wifi
kernel/net/rfkill/rfkill-wlan.c
hardware/broadcom
external/wpa_supplicant_8
```

## 3 New modules

The SDK already contains the framework; modify these points.

### 3.1 Porting

Drivers are in kernel/drivers/net/wireless/rockchip_wlan. Add Kconfig/Makefile under kernel/drivers/net/wireless; some drivers need their own files changed. For Realtek see its porting guide. Kernel builds must produce .ko correctly; rebuild after network configuration changes to avoid stack mismatch.

### 3.2 Compatibility mapping

Add names and VID/PID to supported_wifi_devices[] in frameworks/opt/net/wifi/libwifi_hal/rk_wifi_ctrl.cpp; read IDs from uevent. AP6255 is 02d0:09bf in prose but 02d0:a9bf in the screenshot and later example; verify actual enumeration.

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

![Technical figure 1, source PDF page 9 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p09-3.png)

Technical figure 1, source PDF page 9 (bilingual original)

wifi_ko_file_name module_list[] in wifi_hal_common.cpp stores paths and arguments, named XXXX_DRIVER_MODULE_PATH. Without arguments use UNKKOWN_DRIVER_MODULE_ARG (source spelling); otherwise follow driver instructions. Names must match supported_wifi_devices[], also misspelled supported_wifi_devies[] in the source.

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

![Technical figure 1, source PDF page 10 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p10-4.png)

Technical figure 1, source PDF page 10 (bilingual original)

![Technical figure 2, source PDF page 10 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p10-5.png)

Technical figure 2, source PDF page 10 (bilingual original)

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

![Technical figure 1, source PDF page 11 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p11-6.png)

Technical figure 1, source PDF page 11 (bilingual original)

### 3.3 wpa_supplicant arguments

init.connectivity.rc reads /vendor/etc/wifi/wpa_config.txt:

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

The source path deivice/rockchip/common/wpa_config.txt appears to misspell device. wpa_supplicant/main.c selects by chip; APxxx uses BROADCOM_MODULE_NAME to find [broadcom].

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

![Technical figure 1, source PDF page 12 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p12-7.png)

Technical figure 1, source PDF page 12 (bilingual original)

![Technical figure 2, source PDF page 12 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p12-8.png)

Technical figure 2, source PDF page 12 (bilingual original)

![Technical figure 3, source PDF page 12 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p12-9.png)

Technical figure 3, source PDF page 12 (bilingual original)

[broadcom], [realtek], [ssv] and [esp] parameters exist; add other modules in this format.

## 4 Hardware/software compatibility

One source SDK firmware supports SDIO2.0/3.0, with clocks up to 50M/150M. See Rockchip-Developer-Guide-linux4.4-SDMMC-SDIO-eMMC.pdf and Rockchip-Developer-Guide-linux4.4-PCIe.pdf.

## 5 Building .ko

.ko must match kernel.img networking configuration. If debugging changes it, run mkimage.sh, regenerate vendor.img and flash both.

## 6 Driver loading

Without automatic compatibility the driver can be built in. AP6255 example (first name lacks CONFIG_ in source; check Kconfig):

```kconfig
WIFI_BUILD_MODULE = n
CONFIG_AP6XXX = y
```

![Technical figure 1, source PDF page 14 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p14-10.png)

Technical figure 1, source PDF page 14 (bilingual original)

## 7 Wi-Fi cannot start

First confirm USB/SDIO exists after boot. Normal logs:

```text
mmc2: new ultra high speed SDR104 SDIO card at address 0001
usb 2-1: new high-speed USB device number 2 using ehci-platform
usb 2-1: New USB device found, idVendor=0bda, idProduct=b82c
usb 2-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
usb 2-1: Product: 802.11ac NIC
```

If absent, check power, enumeration, hardware and DTS pins. Power is required to read IDs. Inspect uevent under sys/bus/sdio/devices or sys/bus/usb/devices. AP6255 example:

```text
cat /sys/bus/sdio/devices/mmc1\:0001\:3/uevent
SDIO_CLASS=02
SDIO_ID=02D0:A9BF
MODALIAS=sdio:c02v02D0dA9BF
```

![Technical figure 1, source PDF page 15 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p15-11.png)

Technical figure 1, source PDF page 15 (bilingual original)

![Technical figure 2, source PDF page 15 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p15-12.png)

Technical figure 2, source PDF page 15 (bilingual original)

After identification check loading; the figure shows not ready to ready. The source mapping is retained; RTL8188EU→8188fu.ko appears wrong. Check android/frameworks/opt/net/wifi/libwifi_hal/wifi_hal_common.cpp.

| Module | .ko |
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

For mismatches/missing files revisit1.1/1.2. The old screenshot uses /vendor/lib/modules/wifi versus /vendor/lib/modules/ in prose; check actual SDK packaging. Networking changes without rebuilding ko may cause kernel panic; see5.

![Technical figure 1, source PDF page 16 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p16-13.png)

Technical figure 1, source PDF page 16 (bilingual original)

## 8 SDIO diagnosis

### 8.1 Hardware

Focus on green boxes:

![Technical figure 2, source PDF page 16 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p16-14.png)

Technical figure 2, source PDF page 16 (bilingual original)

![Technical figure 1, source PDF page 17 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p17-15.png)

Technical figure 1, source PDF page 17 (bilingual original)

![Technical figure 2, source PDF page 17 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p17-16.png)

Technical figure 2, source PDF page 17 (bilingual original)

- WIFI_D0~3 data and WIFI_CMD command lines are normally high at VCCIO_WL voltage.
- WIFI_CLK is normally low, also at VCCIO_WL level.
- VBAT_WL stays high; source wording “need to print3.3V” is unclear. Retain3.3V and check module specifications.
- VCCIO_WL supplies DATA/CMD/CLK at3.3V/1.8V; source requires1.8V forSDIO3.0.
- WIFI_REG_ON is3.3V operating,0V disabled.
- 32K and26M/37.4M oscillators should output waveforms.

Check voltage and oscillators first. Always-on VBAT_WL/VCCIO_WL can sag when shared, causing faults; VCC_IO feeds multiple peripherals in the diagram.

![Technical figure 1, source PDF page 18 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p18-17.png)

Technical figure 1, source PDF page 18 (bilingual original)

### 8.2 Software and waveforms

Command/response formats include start, transmission, content, CRC and end bits. Long responses and all bus-width diagrams are retained.

![Technical figure 2, source PDF page 18 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p18-18.png)

Technical figure 2, source PDF page 18 (bilingual original)

![Technical figure 3, source PDF page 18 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p18-19.png)

Technical figure 3, source PDF page 18 (bilingual original)

![Technical figure 1, source PDF page 19 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p19-20.png)

Technical figure 1, source PDF page 19 (bilingual original)

![Technical figure 2, source PDF page 19 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p19-21.png)

Technical figure 2, source PDF page 19 (bilingual original)

The source summarizes48 clocks/48 bits from host and card; actual length depends on command, not every response. Above identification, below multiblock reads/writes.

![Technical figure 1, source PDF page 20 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p20-22.png)

Technical figure 1, source PDF page 20 (bilingual original)

![Technical figure 2, source PDF page 20 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p20-23.png)

Technical figure 2, source PDF page 20 (bilingual original)

Example: green SDMMC_CLK, yellow SDMMC_CMD, idle high. The source identifies high/low start as host command and two lows as card response; interpret with bit timing. Shown packets are generally48 bits/clocks; confirm the card responds. DTS SDIO must be okay with no pin-mux conflict.

![Technical figure 1, source PDF page 21 (bilingual original)](/docs/rockchip-wifi-configuration/images/pdf-p21-24.png)

Technical figure 1, source PDF page 21 (bilingual original)

### 8.3 Typical errors

1. Voltage: check WIFI_DATA and VCCIO_WL.

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

2. Wi-Fi fault: check VBAT_WL, WIFI_REG_ON and oscillators; or long traces degrade signals: reduce frequency/revise hardware.

```text
dwmmc_rockchip 10218000.rksdmmc: req failed (CMD52): error = 110, timeout = 8000ms
[mmc2] - Timeout recovery procedure start --
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
mmc_host mmc2: Bus speed (slot 0) = 37500000Hz (slot req 400000Hz, actual 398936HZ div = 47)
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
[mmc2] -- Timeout recovery procedure finished --
```

3. Long traces/poor waveforms: reduce frequency or revise hardware.

```text
[ 200.731403] [mmc2] Data transmission error !!!! MINTSTS: [0x00000080]
[ 200.731426] [mmc2] host was already tuning, Don't need to retry tune again ignore 0.
```

4. Abnormal WIFI_REG_ON.

```text
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 400000Hz for init[mmc2]
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 600000Hz for init[mmc2]
```

## Reference

[ArmSoM documentation](https://docs.armsom.org/), RK-SM-YF-211 V1.6, PDF pages5–22.

{% endraw %}
