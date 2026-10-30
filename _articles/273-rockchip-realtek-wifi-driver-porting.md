---
title: "Porting a Realtek Wi-Fi driver to Rockchip: RTL8723CS"
description: "Porting a Realtek Wi-Fi driver to Rockchip: RTL8723CS"
excerpt: "Porting a Realtek Wi-Fi driver to Rockchip: RTL8723CS"
translation_key: "273-rockchip-realtek-wifi-driver-porting"
slug: "273-rockchip-realtek-wifi-driver-porting"
lang: "en"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

This article covers the technical body of bilingual source RK-SM-YF-210 V1.0. It uses RTL8723CS and Rockchip BSP kernel interfaces. The source does not specify a kernel version; its WIFI_HAL requirement applies to Android 8.0 and later. For ArmSoM this is a platform reference: check the actual wireless module, SoC, BSP and kernel interfaces. No hardware validation was performed. Figures come from the single bilingual PDF, including Chinese UI; no separate English figures exist.

## 1 Purpose

Help developers port a Realtek Wi-Fi driver to Rockchip. The example below is rtl8723cs.

## 2 Driver changes

### 2.1 Add the driver to the kernel

The common directory is `drivers/net/wireless/rockchip_wlan/`. Add to its `Makefile`:

```make
obj-$(CONFIG_RTL8723CS) += rtl8723cs/
```

Add to `Kconfig` in the same directory:

```kconfig
source "drivers/net/wireless/rockchip_wlan/rtl8723cs/Kconfig"
```

Rename the driver package to `rtl8723cs` and place it in `drivers/net/wireless/rockchip_wlan/rtl8723cs`.

### 2.2 Modify the driver Makefile

The Realtek driver defaults to PC. Switch to Rockchip: change `CONFIG_PLATFORM_I386_PC = y` to `n`, and `CONFIG_PLATFORM_ARM_RK3188 = n` to `y`. Rockchip uses a `.ko` driver; change its module name to `8723cs`.

```make
ifeq ($(CONFIG_PLATFORM_ARM_RK3188), y)
EXTRA_CFLAGS+= -DCONFIG_LITTLE_ENDIAN -DCONFIG_PLATFORM_ANDROID -DCONFIG_PLATFORM_ROCKCHIPS
……
#EXTRA_CFLAGS += -DRTW_ENABLE_WIFI_CONTROL_FUNC //注意这个要注释掉 Need to comment this out
……
MODULE_NAME := 8723cs
Endif
```

The source excerpt contains ellipses and ends with `Endif`, retained here. Check the actual GNU Make closing keyword, lowercase `endif`. Comment out the `RTW_ENABLE_WIFI_CONTROL_FUNC` line. For Android 8.0 and later also change `CONFIG_RTW_WIFI_HAL = n` to `CONFIG_RTW_WIFI_HAL = y`.

### 2.3 Modify entry functions

The common Realtek entry is `rtw_drv_entry`: USB uses `os_dep/linux/usb_intf.c`, SDIO uses `os_dep/linux/sdio_intf.c`, and PCIe uses `os_dep/linux/pci_intf.c`.

1. Change `static int __init rtw_drv_entry(void)` to `static int rtw_drv_entry(void)`.
2. Change `static void __exit rtw_drv_halt(void)` to `static void rtw_drv_halt(void)`.
3. Comment out `module_init(rtw_drv_entry);` and `module_exit(rtw_drv_halt);`.
4. Add the Rockchip entry wrappers.

![Entry functions before modification (bilingual source)](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p07-1.png)

Entry functions before modification (bilingual source)

![Entry wrappers after modification (log lines are already clipped at the right in the source)](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p08-2.png)

Entry wrappers after modification (log lines are already clipped at the right in the source)

The following transcribes visible code. Two log lines containing `DRIVERVERSION` are clipped by the original image; comments identify them without inventing missing characters. Original function bodies are collapsed in the screenshot, so this is not a complete source file.

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

### 2.4 Rockchip MAC address support (optional)

If required by the project, modify `rtl8723cs/core/rtw_ieee80211.c`: add `#include <linux/rfkill-wlan.h>` and support for `rockchip_wifi_mac_addr(mac)` in `void rtw_macaddr_cfg(u8 *out, const u8 *hw_mac_addr)`.

![MAC address changes](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p09-3.png)

MAC address changes

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

### 2.5 WOWLAN support (optional)

As required by the project, change both `CONFIG_WOWLAN = n` and `CONFIG_GPIO_WAKEUP = n` to `y` in the driver `Makefile`. Add `rockchip_wifi_get_oob_irq()` support in `platform/platform_ops.c`:

![Wake interrupt changes](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p10-4.png)

Wake interrupt changes

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

## Reference

[Official ArmSoM documentation](https://docs.armsom.org/); source RK-SM-YF-210 V1.0, PDF pages 5–10.

{% endraw %}
