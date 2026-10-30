---
title: "Realtek-WLAN-Treiber auf Rockchip portieren: RTL8723CS"
description: "Realtek-WLAN-Treiber auf Rockchip portieren: RTL8723CS"
excerpt: "Realtek-WLAN-Treiber auf Rockchip portieren: RTL8723CS"
translation_key: "273-rockchip-realtek-wifi-driver-porting"
slug: "273-rockchip-realtek-wifi-driver-porting"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Dieser Artikel enthält den technischen Inhalt der zweisprachigen Quelle RK-SM-YF-210 V1.0. Das Beispiel verwendet RTL8723CS und Kernel-Schnittstellen des Rockchip-BSP. Eine Kernel-Version nennt die Quelle nicht; WIFI_HAL wird für Android ab 8.0 verlangt. Für ArmSoM dient dies als Plattformreferenz: WLAN-Modul, SoC, BSP und Kernel-Schnittstellen müssen geprüft werden. Keine Hardwareprüfung wurde durchgeführt. Alle Abbildungen stammen aus demselben zweisprachigen PDF und enthalten chinesische UI; separate englische Abbildungen liegen nicht vor.

## 1 Zweck

Entwickler beim Portieren eines Realtek-WLAN-Treibers auf Rockchip unterstützen. Das Beispiel verwendet rtl8723cs.

## 2 Treiberänderungen

### 2.1 Zum Kernel hinzufügen

Das gemeinsame Verzeichnis ist `drivers/net/wireless/rockchip_wlan/`. In dessen `Makefile` ergänzen:

```make
obj-$(CONFIG_RTL8723CS) += rtl8723cs/
```

In `Kconfig` desselben Verzeichnisses ergänzen:

```kconfig
source "drivers/net/wireless/rockchip_wlan/rtl8723cs/Kconfig"
```

Das Treiberpaket in `rtl8723cs` umbenennen und unter `drivers/net/wireless/rockchip_wlan/rtl8723cs` ablegen.

### 2.2 Treiber-Makefile ändern

Der Realtek-Treiber ist standardmäßig für PC konfiguriert. Für Rockchip `CONFIG_PLATFORM_I386_PC = y` auf `n` und `CONFIG_PLATFORM_ARM_RK3188 = n` auf `y` ändern. Rockchip verwendet einen `.ko`-Treiber; den Modulnamen auf `8723cs` setzen.

```make
ifeq ($(CONFIG_PLATFORM_ARM_RK3188), y)
EXTRA_CFLAGS+= -DCONFIG_LITTLE_ENDIAN -DCONFIG_PLATFORM_ANDROID -DCONFIG_PLATFORM_ROCKCHIPS
……
#EXTRA_CFLAGS += -DRTW_ENABLE_WIFI_CONTROL_FUNC //注意这个要注释掉 Need to comment this out
……
MODULE_NAME := 8723cs
Endif
```

Der Quellenauszug enthält Auslassungen und endet mit `Endif`; dies bleibt nachvollziehbar erhalten. Im tatsächlichen GNU Make ist das kleingeschriebene Abschlusswort `endif` zu prüfen. Die Zeile `RTW_ENABLE_WIFI_CONTROL_FUNC` auskommentieren. Für Android ab 8.0 zusätzlich `CONFIG_RTW_WIFI_HAL = n` auf `CONFIG_RTW_WIFI_HAL = y` ändern.

### 2.3 Eintrittsfunktionen ändern

Die gemeinsame Realtek-Eintrittsfunktion ist `rtw_drv_entry`: für USB in `os_dep/linux/usb_intf.c`, SDIO in `os_dep/linux/sdio_intf.c` und PCIe in `os_dep/linux/pci_intf.c`.

1. `static int __init rtw_drv_entry(void)` durch `static int rtw_drv_entry(void)` ersetzen.
2. `static void __exit rtw_drv_halt(void)` durch `static void rtw_drv_halt(void)` ersetzen.
3. `module_init(rtw_drv_entry);` und `module_exit(rtw_drv_halt);` auskommentieren.
4. Die Rockchip-Eintrittsfunktionen ergänzen.

![Eintrittsfunktionen vor der Änderung (zweisprachiges Original)](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p07-1.png)

Eintrittsfunktionen vor der Änderung (zweisprachiges Original)

![Eintrittsfunktionen nach der Änderung (Protokollzeilen bereits im Original rechts abgeschnitten)](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p08-2.png)

Eintrittsfunktionen nach der Änderung (Protokollzeilen bereits im Original rechts abgeschnitten)

Nachfolgend ist der sichtbare Code transkribiert. Zwei Protokollzeilen mit `DRIVERVERSION` sind im Original abgeschnitten; Kommentare markieren sie, ohne fehlende Zeichen zu erfinden. Die ursprünglichen Funktionskörper sind eingeklappt; dies ist keine vollständige Quelldatei.

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

### 2.4 Rockchip-MAC-Adresse (optional)

Je nach Projekt `rtl8723cs/core/rtw_ieee80211.c` ändern: `#include <linux/rfkill-wlan.h>` und Unterstützung für `rockchip_wifi_mac_addr(mac)` in `void rtw_macaddr_cfg(u8 *out, const u8 *hw_mac_addr)` ergänzen.

![Änderungen der MAC-Adresse](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p09-3.png)

Änderungen der MAC-Adresse

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

### 2.5 WOWLAN-Unterstützung (optional)

Bei Bedarf im Treiber-`Makefile` sowohl `CONFIG_WOWLAN = n` als auch `CONFIG_GPIO_WAKEUP = n` auf `y` setzen. In `platform/platform_ops.c` Unterstützung für `rockchip_wifi_get_oob_irq()` ergänzen:

![Änderungen des Wake-Interrupts](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p10-4.png)

Änderungen des Wake-Interrupts

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

## Referenz

[ArmSoM-Dokumentation](https://docs.armsom.org/); Quelle RK-SM-YF-210 V1.0, PDF-Seiten 5–10.

{% endraw %}
