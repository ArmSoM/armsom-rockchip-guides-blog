---
title: "Перенос драйвера Realtek Wi-Fi на Rockchip: RTL8723CS"
description: "Перенос драйвера Realtek Wi-Fi на Rockchip: RTL8723CS"
excerpt: "Перенос драйвера Realtek Wi-Fi на Rockchip: RTL8723CS"
translation_key: "273-rockchip-realtek-wifi-driver-porting"
slug: "273-rockchip-realtek-wifi-driver-porting"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Статья охватывает техническую часть двуязычного документа RK-SM-YF-210 V1.0. Пример использует RTL8723CS и интерфейсы ядра BSP Rockchip. Версия ядра не указана; требование WIFI_HAL относится к Android 8.0 и новее. Для ArmSoM это справочный материал: сверяйте модуль Wi-Fi, SoC, BSP и интерфейсы ядра. Аппаратная проверка не проводилась. Рисунки взяты из единого двуязычного PDF и содержат китайский интерфейс; отдельных английских рисунков нет.

## 1 Назначение

Помочь разработчикам перенести драйвер Realtek Wi-Fi на Rockchip. Далее используется rtl8723cs.

## 2 Изменения драйвера

### 2.1 Добавление в ядро

Общий каталог — `drivers/net/wireless/rockchip_wlan/`. Добавьте в его `Makefile`:

```make
obj-$(CONFIG_RTL8723CS) += rtl8723cs/
```

Добавьте в `Kconfig` того же каталога:

```kconfig
source "drivers/net/wireless/rockchip_wlan/rtl8723cs/Kconfig"
```

Переименуйте пакет драйвера в `rtl8723cs` и поместите его в `drivers/net/wireless/rockchip_wlan/rtl8723cs`.

### 2.2 Изменение Makefile драйвера

По умолчанию драйвер Realtek предназначен для PC. Для Rockchip измените `CONFIG_PLATFORM_I386_PC = y` на `n`, а `CONFIG_PLATFORM_ARM_RK3188 = n` — на `y`. Rockchip использует драйвер `.ko`; задайте имя модуля `8723cs`.

```make
ifeq ($(CONFIG_PLATFORM_ARM_RK3188), y)
EXTRA_CFLAGS+= -DCONFIG_LITTLE_ENDIAN -DCONFIG_PLATFORM_ANDROID -DCONFIG_PLATFORM_ROCKCHIPS
……
#EXTRA_CFLAGS += -DRTW_ENABLE_WIFI_CONTROL_FUNC //注意这个要注释掉 Need to comment this out
……
MODULE_NAME := 8723cs
Endif
```

В исходном фрагменте есть многоточия и завершающее `Endif`, сохранённое здесь. В реальном GNU Make проверьте строчное ключевое слово `endif`. Закомментируйте строку `RTW_ENABLE_WIFI_CONTROL_FUNC`. Для Android 8.0 и новее также измените `CONFIG_RTW_WIFI_HAL = n` на `CONFIG_RTW_WIFI_HAL = y`.

### 2.3 Изменение входных функций

Общая входная функция Realtek — `rtw_drv_entry`: для USB в `os_dep/linux/usb_intf.c`, SDIO в `os_dep/linux/sdio_intf.c`, PCIe в `os_dep/linux/pci_intf.c`.

1. Замените `static int __init rtw_drv_entry(void)` на `static int rtw_drv_entry(void)`.
2. Замените `static void __exit rtw_drv_halt(void)` на `static void rtw_drv_halt(void)`.
3. Закомментируйте `module_init(rtw_drv_entry);` и `module_exit(rtw_drv_halt);`.
4. Добавьте входные обёртки Rockchip.

![Входные функции до изменения (двуязычный оригинал)](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p07-1.png)

Входные функции до изменения (двуязычный оригинал)

![Обёртки после изменения (правый край строк журнала обрезан в оригинале)](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p08-2.png)

Обёртки после изменения (правый край строк журнала обрезан в оригинале)

Ниже переписан видимый код. Две строки журнала с `DRIVERVERSION` обрезаны в исходном изображении; комментарии отмечают их без выдумывания отсутствующих символов. Тела исходных функций свёрнуты, поэтому это не полный исходный файл.

```c
#include <linux/rfkill-wlan.h>
extern int get_wifi_chip_type(void);
extern int rockchip_wifi_power(int on);
extern int rockchip_wifi_set_carddetect(int val);

int rockchip_wifi_init_module_rtkwifi(void)
{
#ifdef CONFIG_WIFI_LOAD_DRIVER_WHEN_KERNEL_BOOTUP
    int type = get_wifi_chip_type();
    if (type < WIFI_AP6XXX_SERIES || type == WIFI_ESP8089) return 0;
#endif
    printk("\n");
    printk("=======================================================\n");
    printk("==== Launching Wi-Fi driver! (Powered by Rockchip) ====\n");
    printk("=======================================================\n");
    /* Source log line clipped after DRIVERVERSION; see original figure. */
    rockchip_wifi_power(1);
    rockchip_wifi_set_carddetect(1);
    return rtw_drv_entry();
}

void rockchip_wifi_exit_module_rtkwifi(void)
{
#ifdef CONFIG_WIFI_LOAD_DRIVER_WHEN_KERNEL_BOOTUP
    int type = get_wifi_chip_type();
    if (type < WIFI_AP6XXX_SERIES || type == WIFI_ESP8089) return;
#endif
    printk("\n");
    printk("=======================================================\n");
    printk("==== Dislaunching Wi-Fi driver! (Powered by Rockchip) ====\n");
    printk("=======================================================\n");
    /* Source log line clipped after DRIVERVERSION; see original figure. */
    rtw_drv_halt();
    rockchip_wifi_set_carddetect(0);
    rockchip_wifi_power(0);
}
#ifdef CONFIG_WIFI_BUILD_MODULE
module_init(rockchip_wifi_init_module_rtkwifi);
module_exit(rockchip_wifi_exit_module_rtkwifi);
#else
#ifdef CONFIG_WIFI_LOAD_DRIVER_WHEN_KERNEL_BOOTUP
late_initcall(rockchip_wifi_init_module_rtkwifi);
module_exit(rockchip_wifi_exit_module_rtkwifi);
#else
EXPORT_SYMBOL(rockchip_wifi_init_module_rtkwifi);
EXPORT_SYMBOL(rockchip_wifi_exit_module_rtkwifi);
#endif
#endif
//module_init(rtw_drv_entry);
//module_exit(rtw_drv_halt);
```

### 2.4 MAC-адрес Rockchip (необязательно)

По требованиям проекта измените `rtl8723cs/core/rtw_ieee80211.c`: добавьте `#include <linux/rfkill-wlan.h>` и поддержку `rockchip_wifi_mac_addr(mac)` в `void rtw_macaddr_cfg(u8 *out, const u8 *hw_mac_addr)`.

![Изменение MAC-адреса](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p09-3.png)

Изменение MAC-адреса

```c
/* Use the mac address stored in the Efuse */
if (hw_mac_addr) {
    _rtw_memcpy(mac, hw_mac_addr, ETH_ALEN);
}
if (!rockchip_wifi_mac_addr(mac)) {
    printk("Get mac address from flash:[%02x:%02x:%02x:%02x:%02x:%02x]\n", mac[0], mac[1],
        mac[2], mac[3], mac[4], mac[5]);
}
```

### 2.5 Поддержка WOWLAN (необязательно)

При необходимости измените `CONFIG_WOWLAN = n` и `CONFIG_GPIO_WAKEUP = n` на `y` в `Makefile` драйвера. Добавьте поддержку `rockchip_wifi_get_oob_irq()` в `platform/platform_ops.c`:

![Изменения прерывания пробуждения](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p10-4.png)

Изменения прерывания пробуждения

```c
#include <linux/rfkill-wlan.h>
extern unsigned int oob_irq;
int platform_wifi_power_on(void)
{
    int ret = 0;
    oob_irq = rockchip_wifi_get_oob_irq();
    return ret;
}
```

## Справка

[Документация ArmSoM](https://docs.armsom.org/); источник RK-SM-YF-210 V1.0, страницы PDF 5–10.

{% endraw %}
