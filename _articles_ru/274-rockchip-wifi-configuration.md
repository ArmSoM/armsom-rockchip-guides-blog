---
title: "Настройка Wi-Fi Rockchip Android и диагностика SDIO"
description: "Настройка Wi-Fi Rockchip Android и диагностика SDIO"
excerpt: "Настройка Wi-Fi Rockchip Android и диагностика SDIO"
translation_key: "274-rockchip-wifi-configuration"
slug: "274-rockchip-wifi-configuration"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

На основе двуязычного RK-SM-YF-211 V1.6: совместимость Wi-Fi, сборка/загрузка модулей и SDIO. Источник охватывает Android 8/9/10/11 и Linux 4.4 и новее, не все современные BSP. Для ArmSoM сверяйте модуль, SoC, BSP, выводы и ядро. Это справка без аппаратной проверки. Все рисунки из одного двуязычного оригинала, отдельного английского набора нет.

## 1 Назначение

Прошивка с механизмом совместимости поддерживает несколько модулей. По источнику дополнительных настроек Android/ядра не требуется при соблюдении SDK, списка устройств и аппаратных условий.

### 1.1 Ядро

AP6xxx и Realtek должны быть модулями, не частью kernel.img. Встроенный вариант — раздел 6 (в источнике ошибочно 7). Defconfig:

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

![Технический рисунок 1, страница PDF 6 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p06-1.png)

Технический рисунок 1, страница PDF 6 (двуязычный оригинал)

Тип чипа в DTS необязателен: загрузка не зависит от wifi_chip_type. Для неэталонной платы проверьте выводы; с Linux 4.4 питание задаётся через SDIO reset-gpios.

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

В эталоне питание активно высоким уровнем; проверьте вывод и полярность. Для всех поддерживаемых модулей заранее согласуйте питание плат и SDIO, см. раздел 4.

### 1.2 Android

Сборка ядра создаёт .ko; Android копирует их в /vendor/lib/modules/ образа vendor.img. Файл vendor/rockchip/common/wifi/wifi.mk:

```make
WIFI_KO_FILES := $(shell find $(TOPDIR)kernel/drivers/net/wireless/rockchip_wlan -name "*.ko" -type f)
BOARD_VENDOR_KERNEL_MODULES += \
    $(foreach file, $(WIFI_KO_FILES), $(file))
```

![Технический рисунок 1, страница PDF 7 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p07-2.png)

Технический рисунок 1, страница PDF 7 (двуязычный оригинал)

## 2 Принцип совместимости

### 2.1 Определение

1. Включить питание и сканировать SDIO при загрузке.
2. При включении Wi-Fi читать uevent в sys/bus/sdio, sys/bus/usb и исходном sys/bus/pic (PCIe); pic вероятно опечатка, проверьте PCI-путь.
3. Загрузить .ko по VID/PID.
4. Выбрать параметры wpa_supplicant по типу. Каталоги:

```text
android/frameworks/opt/net/wifi
kernel/net/rfkill/rfkill-wlan.c
hardware/broadcom
external/wpa_supplicant_8
```

## 3 Новые модули

SDK уже содержит механизм; измените следующие места.

### 3.1 Перенос

Драйверы в kernel/drivers/net/wireless/rockchip_wlan. Добавьте Kconfig/Makefile в kernel/drivers/net/wireless; некоторым нужны изменения собственных файлов. Для Realtek см. руководство переноса. Ядро должно создавать .ko; после изменения сети пересоберите во избежание несовместимости стека.

### 3.2 Таблица совместимости

Добавьте имена и VID/PID в supported_wifi_devices[] файла frameworks/opt/net/wifi/libwifi_hal/rk_wifi_ctrl.cpp; ID читаются из uevent. AP6255 в тексте 02d0:09bf, на снимке и далее 02d0:a9bf; проверьте реальное обнаружение.

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

![Технический рисунок 1, страница PDF 9 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p09-3.png)

Технический рисунок 1, страница PDF 9 (двуязычный оригинал)

wifi_ko_file_name module_list[] в wifi_hal_common.cpp хранит пути и параметры с именами XXXX_DRIVER_MODULE_PATH. Без аргументов — UNKKOWN_DRIVER_MODULE_ARG (исходное написание), иначе по драйверу. Имена совпадают с supported_wifi_devices[]; в источнике есть supported_wifi_devies[].

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

![Технический рисунок 1, страница PDF 10 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p10-4.png)

Технический рисунок 1, страница PDF 10 (двуязычный оригинал)

![Технический рисунок 2, страница PDF 10 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p10-5.png)

Технический рисунок 2, страница PDF 10 (двуязычный оригинал)

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

![Технический рисунок 1, страница PDF 11 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p11-6.png)

Технический рисунок 1, страница PDF 11 (двуязычный оригинал)

### 3.3 Параметры wpa_supplicant

init.connectivity.rc читает /vendor/etc/wifi/wpa_config.txt:

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

В пути deivice/rockchip/common/wpa_config.txt вероятна опечатка device. wpa_supplicant/main.c выбирает по чипу; APxxx ищет [broadcom] через BROADCOM_MODULE_NAME.

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

![Технический рисунок 1, страница PDF 12 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p12-7.png)

Технический рисунок 1, страница PDF 12 (двуязычный оригинал)

![Технический рисунок 2, страница PDF 12 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p12-8.png)

Технический рисунок 2, страница PDF 12 (двуязычный оригинал)

![Технический рисунок 3, страница PDF 12 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p12-9.png)

Технический рисунок 3, страница PDF 12 (двуязычный оригинал)

Есть параметры [broadcom], [realtek], [ssv], [esp]; добавьте остальные в том же формате.

## 4 Аппаратно-программная совместимость

Одна прошивка SDK поддерживает SDIO2.0/3.0 с пределом50M/150M. См. Rockchip-Developer-Guide-linux4.4-SDMMC-SDIO-eMMC.pdf и Rockchip-Developer-Guide-linux4.4-PCIe.pdf.

## 5 Сборка .ko

.ko должен совпадать с сетевой конфигурацией kernel.img. После изменения выполните mkimage.sh, пересоберите vendor.img и прошейте оба.

## 6 Загрузка

Без автосовместимости драйвер можно встроить. Пример AP6255 (в первом имени нет CONFIG_; проверьте Kconfig):

```kconfig
WIFI_BUILD_MODULE = n
CONFIG_AP6XXX = y
```

![Технический рисунок 1, страница PDF 14 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p14-10.png)

Технический рисунок 1, страница PDF 14 (двуязычный оригинал)

## 7 Wi-Fi не включается

Сначала подтвердите USB/SDIO после загрузки. Нормальные журналы:

```text
mmc2: new ultra high speed SDR104 SDIO card at address 0001
usb 2-1: new high-speed USB device number 2 using ehci-platform
usb 2-1: New USB device found, idVendor=0bda, idProduct=b82c
usb 2-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
usb 2-1: Product: 802.11ac NIC
```

При отсутствии проверьте питание, сканирование, аппаратуру и DTS. Питание необходимо для ID. Читайте uevent в sys/bus/sdio/devices или sys/bus/usb/devices. Пример AP6255:

```text
cat /sys/bus/sdio/devices/mmc1\:0001\:3/uevent
SDIO_CLASS=02
SDIO_ID=02D0:A9BF
MODALIAS=sdio:c02v02D0dA9BF
```

![Технический рисунок 1, страница PDF 15 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p15-11.png)

Технический рисунок 1, страница PDF 15 (двуязычный оригинал)

![Технический рисунок 2, страница PDF 15 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p15-12.png)

Технический рисунок 2, страница PDF 15 (двуязычный оригинал)

После определения проверьте загрузку; рисунок показывает not ready→ready. Таблица сохранена; RTL8188EU→8188fu.ko выглядит ошибкой. Проверьте android/frameworks/opt/net/wifi/libwifi_hal/wifi_hal_common.cpp.

| Модуль | .ko |
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

При ошибке/отсутствии вернитесь к1.1/1.2. На старом снимке /vendor/lib/modules/wifi, в тексте /vendor/lib/modules/; сверяйте SDK. Изменение сети без пересборки ko может вызвать kernel panic, см.5.

![Технический рисунок 1, страница PDF 16 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p16-13.png)

Технический рисунок 1, страница PDF 16 (двуязычный оригинал)

## 8 Диагностика SDIO

### 8.1 Аппаратура

Проверьте зелёные рамки:

![Технический рисунок 2, страница PDF 16 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p16-14.png)

Технический рисунок 2, страница PDF 16 (двуязычный оригинал)

![Технический рисунок 1, страница PDF 17 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p17-15.png)

Технический рисунок 1, страница PDF 17 (двуязычный оригинал)

![Технический рисунок 2, страница PDF 17 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p17-16.png)

Технический рисунок 2, страница PDF 17 (двуязычный оригинал)

- WIFI_D0~3 и WIFI_CMD обычно высокие, напряжение VCCIO_WL.
- WIFI_CLK обычно низкий, уровень зависит отVCCIO_WL.
- VBAT_WL постоянно высокий; исходное “need to print3.3V” неясно. Сохранено3.3V, сверяйте модуль.
- VCCIO_WL питает DATA/CMD/CLK от3.3V/1.8V; дляSDIO3.0 источник требует1.8V.
- WIFI_REG_ON:3.3V в работе,0V при выключении.
- Генераторы32K и26M/37.4M должны выдавать сигнал.

Сначала проверьте напряжения и генераторы. Постоянные VBAT_WL/VCCIO_WL могут проседать при общем питании, вызывая сбои; на схеме VCC_IO питает несколько устройств.

![Технический рисунок 1, страница PDF 18 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p18-17.png)

Технический рисунок 1, страница PDF 18 (двуязычный оригинал)

### 8.2 ПО и сигналы

Команда/ответ содержит начало, передачу, данные, CRC и конец. Сохранены длинные ответы и все ширины шины.

![Технический рисунок 2, страница PDF 18 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p18-18.png)

Технический рисунок 2, страница PDF 18 (двуязычный оригинал)

![Технический рисунок 3, страница PDF 18 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p18-19.png)

Технический рисунок 3, страница PDF 18 (двуязычный оригинал)

![Технический рисунок 1, страница PDF 19 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p19-20.png)

Технический рисунок 1, страница PDF 19 (двуязычный оригинал)

![Технический рисунок 2, страница PDF 19 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p19-21.png)

Технический рисунок 2, страница PDF 19 (двуязычный оригинал)

Источник указывает48 тактов/48 бит от хоста и карты; реальная длина зависит от команды. Выше идентификация, ниже многоблочные чтение/запись.

![Технический рисунок 1, страница PDF 20 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p20-22.png)

Технический рисунок 1, страница PDF 20 (двуязычный оригинал)

![Технический рисунок 2, страница PDF 20 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p20-23.png)

Технический рисунок 2, страница PDF 20 (двуязычный оригинал)

Пример: зелёный SDMMC_CLK, жёлтый SDMMC_CMD, в покое высокий. По источнику высокий/низкий старт — команда хоста, два низких — ответ; сверяйте битовую диаграмму. Обычно48 бит/тактов; проверьте ответ карты. SDIO в DTS — okay, без конфликтов выводов.

![Технический рисунок 1, страница PDF 21 (двуязычный оригинал)](/docs/rockchip-wifi-configuration/images/pdf-p21-24.png)

Технический рисунок 1, страница PDF 21 (двуязычный оригинал)

### 8.3 Типичные ошибки

1. Напряжение: WIFI_DATA и VCCIO_WL.

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

2. Сбой Wi-Fi: проверьте VBAT_WL, WIFI_REG_ON и генераторы; либо длинные трассы портят сигнал: снизьте частоту/измените аппаратуру.

```text
dwmmc_rockchip 10218000.rksdmmc: req failed (CMD52): error = 110, timeout = 8000ms
[mmc2] - Timeout recovery procedure start --
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
mmc_host mmc2: Bus speed (slot 0) = 37500000Hz (slot req 400000Hz, actual 398936HZ div = 47)
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
[mmc2] -- Timeout recovery procedure finished --
```

3. Длинные трассы/плохой сигнал: снизьте частоту или измените аппаратуру.

```text
[ 200.731403] [mmc2] Data transmission error !!!! MINTSTS: [0x00000080]
[ 200.731426] [mmc2] host was already tuning, Don't need to retry tune again ignore 0.
```

4. Ненормальный WIFI_REG_ON.

```text
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 800000Hz for init[mmc2]
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 400000Hz for init[mmc2]
rk_sdmmc: BOOT dw_mci_setup_bus: argue clk_mmc workaround out 600000Hz for init[mmc2]
```

## Справка

[Документация ArmSoM](https://docs.armsom.org/), RK-SM-YF-211 V1.6, страницы PDF5–22.

{% endraw %}
