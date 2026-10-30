---
title: "Rockchip Android Wi-Fi 自动兼容配置与 SDIO 排查"
description: "Rockchip Android Wi-Fi 自动兼容配置与 SDIO 排查"
excerpt: "Rockchip Android Wi-Fi 自动兼容配置与 SDIO 排查"
translation_key: "274-rockchip-wifi-configuration"
slug: "274-rockchip-wifi-configuration"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

依据 RK-SM-YF-211 V1.6 双语原稿，覆盖 Android Wi-Fi 自动兼容、模块编译加载及 SDIO 排查。原稿覆盖 Android 8/9/10/11，并讨论 Linux 4.4 及以后内核；并非当前全部 Android BSP 的通用配置。ArmSoM 使用前须核对无线模组、SoC、BSP、引脚及内核，仅作平台参考，未经硬件验证。所有图来自同一双语原稿，没有单独英文图版。

## 1 目的

按自动兼容框架生成固件，一套固件可支持对应多个模块。原稿称流程完成后无需额外 Android/内核配置，以其 SDK、支持列表及硬件前提为限。

### 1.1 内核

AP6xxx 和 Realtek 必须编译为模块，不能内建到 kernel.img。不需要自动兼容时见第6节（原稿误指第7节）。defconfig：

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

![原稿第 6 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p06-1.png)

原稿第 6 页技术图 1（双语 PDF 原图）

板级 DTS 无需设置芯片类型（设置也可），加载不依赖 wifi_chip_type。非参考设计先确认以下引脚；Linux 4.4 以后电源改到 SDIO reset-gpios。

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

参考设计供电控制默认高有效，实际必须核对引脚与极性。覆盖支持列表所有模块时各板电源引脚及 SDIO 电平需事先确认，见第4节。

### 1.2 Android

编译内核自动生成 .ko；编译 Android 自动复制到 vendor.img 的 /vendor/lib/modules/。文件 vendor/rockchip/common/wifi/wifi.mk：

```make
WIFI_KO_FILES := $(shell find $(TOPDIR)kernel/drivers/net/wireless/rockchip_wlan -name "*.ko" -type f)
BOARD_VENDOR_KERNEL_MODULES += \
    $(foreach file, $(WIFI_KO_FILES), $(file))
```

![原稿第 7 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p07-2.png)

原稿第 7 页技术图 1（双语 PDF 原图）

## 2 自动兼容原理

### 2.1 识别流程

1. 开机上电并扫描 SDIO。
2. 打开 Wi-Fi 时读取 sys/bus/sdio、sys/bus/usb、原稿 sys/bus/pic（PCIe）的 uevent；pic 疑为误写，实际核对 PCI 路径。
3. 根据 VID/PID 加载对应 .ko。
4. 按类型选择 wpa_supplicant 参数。核心目录：

```text
android/frameworks/opt/net/wifi
kernel/net/rfkill/rfkill-wlan.c
hardware/broadcom
external/wpa_supplicant_8
```

## 3 新模块

原稿 SDK 已有自动兼容框架，新增模块修改以下位置。

### 3.1 移植

驱动在 kernel/drivers/net/wireless/rockchip_wlan，在 kernel/drivers/net/wireless 添加 Kconfig/Makefile，部分模块还需修改自身文件。Realtek 参照配套移植指南。内核编译须正确生成 .ko；网络配置改变后必须重编，避免与网络栈不匹配。

### 3.2 兼容映射

在 frameworks/opt/net/wifi/libwifi_hal/rk_wifi_ctrl.cpp 的 supported_wifi_devices[] 添加模块名和 VID/PID，ID 可从 uevent 读取。AP6255 原稿文字为02d0:09bf，截图和后文为02d0:a9bf，应按实际枚举核对。

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

![原稿第 9 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p09-3.png)

原稿第 9 页技术图 1（双语 PDF 原图）

wifi_hal_common.cpp 的 wifi_ko_file_name module_list[] 保存路径和参数，宏按 XXXX_DRIVER_MODULE_PATH 命名。无参数用 UNKKOWN_DRIVER_MODULE_ARG（原拼写），其他参数按驱动说明。模块名必须与 supported_wifi_devices[] 一致，原稿另拼作 supported_wifi_devies[]。

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

![原稿第 10 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p10-4.png)

原稿第 10 页技术图 1（双语 PDF 原图）

![原稿第 10 页技术图 2（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p10-5.png)

原稿第 10 页技术图 2（双语 PDF 原图）

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

![原稿第 11 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p11-6.png)

原稿第 11 页技术图 1（双语 PDF 原图）

### 3.3 wpa_supplicant 参数

init.connectivity.rc 从 /vendor/etc/wifi/wpa_config.txt 读取：

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

原稿路径 deivice/rockchip/common/wpa_config.txt 疑为 device 误拼。wpa_supplicant/main.c 按芯片读取参数，APxxx 用 BROADCOM_MODULE_NAME 查找 [broadcom]。

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

![原稿第 12 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p12-7.png)

原稿第 12 页技术图 1（双语 PDF 原图）

![原稿第 12 页技术图 2（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p12-8.png)

原稿第 12 页技术图 2（双语 PDF 原图）

![原稿第 12 页技术图 3（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p12-9.png)

原稿第 12 页技术图 3（双语 PDF 原图）

已有 [broadcom]、[realtek]、[ssv]、[esp] 四家参数；新模块按此格式添加。

## 4 软硬件兼容

原稿 SDK 一套固件支持 SDIO2.0/3.0，时钟上限50M/150M。SDIO参考 Rockchip-Developer-Guide-linux4.4-SDMMC-SDIO-eMMC.pdf；PCIe参考 Rockchip-Developer-Guide-linux4.4-PCIe.pdf。

## 5 .ko 编译

.ko 须匹配 kernel.img 的网络配置。单独烧内核调试时若修改网络配置，执行 mkimage.sh 后重建 vendor.img，同时烧两者。

## 6 驱动加载

无需自动兼容可内建驱动。AP6255示例（第一项原稿未加CONFIG_，实际核对Kconfig）：

```kconfig
WIFI_BUILD_MODULE = n
CONFIG_AP6XXX = y
```

![原稿第 14 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p14-10.png)

原稿第 14 页技术图 1（双语 PDF 原图）

## 7 Wi-Fi 无法打开

先确认开机存在USB/SDIO设备，正常日志：

```text
mmc2: new ultra high speed SDR104 SDIO card at address 0001
usb 2-1: new high-speed USB device number 2 using ehci-platform
usb 2-1: New USB device found, idVendor=0bda, idProduct=b82c
usb 2-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
usb 2-1: Product: 802.11ac NIC
```

没有信息则检查供电、扫卡、硬件和DTS引脚；成功供电是读ID前提。也可读 sys/bus/sdio/devices 或 sys/bus/usb/devices 的uevent。AP6255示例：

```text
cat /sys/bus/sdio/devices/mmc1\:0001\:3/uevent
SDIO_CLASS=02
SDIO_ID=02D0:A9BF
MODALIAS=sdio:c02v02D0dA9BF
```

![原稿第 15 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p15-11.png)

原稿第 15 页技术图 1（双语 PDF 原图）

![原稿第 15 页技术图 2（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p15-12.png)

原稿第 15 页技术图 2（双语 PDF 原图）

识别后确认正确ko已加载，原图显示not ready到ready。模块映射表保留原稿，其中 RTL8188EU→8188fu.ko 疑为错误，应查 android/frameworks/opt/net/wifi/libwifi_hal/wifi_hal_common.cpp。

| 模块 | .ko |
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

错配/缺文件回查1.1/1.2。旧截图 /vendor/lib/modules/wifi 与正文 /vendor/lib/modules/ 不同，按实际SDK打包核对。网络配置改变未重编ko可能触发kernel panic，见第5节。

![原稿第 16 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p16-13.png)

原稿第 16 页技术图 1（双语 PDF 原图）

## 8 SDIO排查

### 8.1 硬件

重点为原图绿框：

![原稿第 16 页技术图 2（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p16-14.png)

原稿第 16 页技术图 2（双语 PDF 原图）

![原稿第 17 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p17-15.png)

原稿第 17 页技术图 1（双语 PDF 原图）

![原稿第 17 页技术图 2（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p17-16.png)

原稿第 17 页技术图 2（双语 PDF 原图）

- WIFI_D0~3数据线和WIFI_CMD命令线平时高，电压由VCCIO_WL决定。
- WIFI_CLK平时低，电平取决于VCCIO_WL。
- VBAT_WL模组电源常高；原稿“供电需打印3.3v”文字不清，保留3.3V指标并按模组规格核对。
- VCCIO_WL给DATA/CMD/CLK供电，可3.3V/1.8V；原稿要求SDIO3.0为1.8V。
- WIFI_REG_ON工作3.3V，关闭0V。
- 32K和26M/37.4M晶振工作应有波形。

先查电压及晶振。VBAT_WL/VCCIO_WL虽常供电，但与其他模块共用可能电压塌陷致异常，图中VCC_IO挂多个外设。

![原稿第 18 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p18-17.png)

原稿第 18 页技术图 1（双语 PDF 原图）

### 8.2 软件与波形

命令/响应格式包含起始、传输、内容、CRC和结束位。保留长响应及各数据总线宽度图。

![原稿第 18 页技术图 2（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p18-18.png)

原稿第 18 页技术图 2（双语 PDF 原图）

![原稿第 18 页技术图 3（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p18-19.png)

原稿第 18 页技术图 3（双语 PDF 原图）

![原稿第 19 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p19-20.png)

原稿第 19 页技术图 1（双语 PDF 原图）

![原稿第 19 页技术图 2（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p19-21.png)

原稿第 19 页技术图 2（双语 PDF 原图）

原稿概述主控发送48clk/48bit，卡返回48clk/48bit；实际按命令区分长度，不能泛化全部响应。上图识别时序，下图多块读写。

![原稿第 20 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p20-22.png)

原稿第 20 页技术图 1（双语 PDF 原图）

![原稿第 20 页技术图 2（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p20-23.png)

原稿第 20 页技术图 2（双语 PDF 原图）

实例绿色SDMMC_CLK、黄色SDMMC_CMD，CMD空闲高。原稿说起始一高一低为主控命令、两低为卡响应，应结合位时序判断；所示通常48bit/48clk，重点确认发送后卡是否响应。DTS的SDIO必须okay且引脚不得冲突复用。

![原稿第 21 页技术图 1（双语 PDF 原图）](/docs/rockchip-wifi-configuration/images/pdf-p21-24.png)

原稿第 21 页技术图 1（双语 PDF 原图）

### 8.3 典型错误

1. 电压问题：检查WIFI_DATA和VCCIO_WL。

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

2. Wi-Fi异常：检查VBAT_WL、WIFI_REG_ON、晶振；或走线过长波形差，降频/修改硬件。

```text
dwmmc_rockchip 10218000.rksdmmc: req failed (CMD52): error = 110, timeout = 8000ms
[mmc2] - Timeout recovery procedure start --
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
mmc_host mmc2: Bus speed (slot 0) = 37500000Hz (slot req 400000Hz, actual 398936HZ div = 47)
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
[mmc2] -- Timeout recovery procedure finished --
```

3. 走线过长波形差：降频或改硬件。

```text
[ 200.731403] [mmc2] Data transmission error !!!! MINTSTS: [0x00000080]
[ 200.731426] [mmc2] host was already tuning, Don't need to retry tune again ignore 0.
```

4. WIFI_REG_ON异常。

```text
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 400000Hz for init[mmc2]
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 600000Hz for init[mmc2]
```

## 参考

[ArmSoM官方文档](https://docs.armsom.org/)，RK-SM-YF-211 V1.6，正文PDF第5–22页。

{% endraw %}
