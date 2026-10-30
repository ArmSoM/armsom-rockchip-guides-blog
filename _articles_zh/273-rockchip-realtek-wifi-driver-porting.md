---
title: "Rockchip Realtek Wi-Fi 驱动移植：RTL8723CS 示例"
description: "Rockchip Realtek Wi-Fi 驱动移植：RTL8723CS 示例"
excerpt: "Rockchip Realtek Wi-Fi 驱动移植：RTL8723CS 示例"
translation_key: "273-rockchip-realtek-wifi-driver-porting"
slug: "273-rockchip-realtek-wifi-driver-porting"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

本文完整整理 RK-SM-YF-210 V1.0 双语原稿的技术正文。以 RTL8723CS 为例，涉及 Rockchip BSP 的内核接口；原稿未限定内核版本，WIFI_HAL 条目要求 Android 8.0 及以上。对 ArmSoM 仅作平台参考，必须核对实际无线模块、SoC、BSP 和内核接口，未经本次硬件验证。配图均来自同一双语 PDF，含中文界面，没有独立英文原图。

## 1 目的

帮助客户把 Realtek Wi-Fi 驱动移植到 Rockchip 平台。以下以 rtl8723cs 为例。

## 2 驱动修改

### 2.1 添加到内核

统一路径为 `drivers/net/wireless/rockchip_wlan/`。在该目录的 `Makefile` 添加：

```make
obj-$(CONFIG_RTL8723CS) += rtl8723cs/
```

在同一目录的 `Kconfig` 添加：

```kconfig
source "drivers/net/wireless/rockchip_wlan/rtl8723cs/Kconfig"
```

将驱动包名改为 `rtl8723cs`，放入 `drivers/net/wireless/rockchip_wlan/rtl8723cs`。

### 2.2 修改驱动 Makefile

Realtek 原始驱动默认面向 PC，改为 Rockchip：将 `CONFIG_PLATFORM_I386_PC = y` 改为 `n`，将 `CONFIG_PLATFORM_ARM_RK3188 = n` 改为 `y`。Rockchip 驱动采用 `.ko`，模块名改为 `8723cs`。

```make
ifeq ($(CONFIG_PLATFORM_ARM_RK3188), y)
EXTRA_CFLAGS+= -DCONFIG_LITTLE_ENDIAN -DCONFIG_PLATFORM_ANDROID -DCONFIG_PLATFORM_ROCKCHIPS
……
#EXTRA_CFLAGS += -DRTW_ENABLE_WIFI_CONTROL_FUNC //注意这个要注释掉 Need to comment this out
……
MODULE_NAME := 8723cs
Endif
```

原稿为节选，含省略号，并把结尾写作 `Endif`；按原文保留，实际 GNU Make 条件结束关键字应核对为小写 `endif`。注释掉 `RTW_ENABLE_WIFI_CONTROL_FUNC` 行。Android 8.0 及以上还必须把 `CONFIG_RTW_WIFI_HAL = n` 改为 `CONFIG_RTW_WIFI_HAL = y`。

### 2.3 修改入口函数

Realtek 的统一入口为 `rtw_drv_entry`：USB 在 `os_dep/linux/usb_intf.c`，SDIO 在 `os_dep/linux/sdio_intf.c`，PCIe 在 `os_dep/linux/pci_intf.c`。

1. 将 `static int __init rtw_drv_entry(void)` 改为 `static int rtw_drv_entry(void)`。
2. 将 `static void __exit rtw_drv_halt(void)` 改为 `static void rtw_drv_halt(void)`。
3. 注释掉 `module_init(rtw_drv_entry);` 和 `module_exit(rtw_drv_halt);`。
4. 添加 Rockchip 入口包装函数。

![修改前的入口函数（双语原图）](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p07-1.png)

修改前的入口函数（双语原图）

![修改后的入口包装函数（原图右侧日志行已截断）](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p08-2.png)

修改后的入口包装函数（原图右侧日志行已截断）

以下转录截图中的可见代码。两条包含 `DRIVERVERSION` 的日志行右侧被原图截断，使用注释明确标出，不猜补不可见字符；截图还折叠了原函数体，不能视为完整源文件。

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

### 2.4 Rockchip MAC 地址支持（可选）

按项目需要修改 `rtl8723cs/core/rtw_ieee80211.c`：增加 `#include <linux/rfkill-wlan.h>`，并在 `void rtw_macaddr_cfg(u8 *out, const u8 *hw_mac_addr)` 添加 `rockchip_wifi_mac_addr(mac)` 支持。

![MAC 地址修改对比](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p09-3.png)

MAC 地址修改对比

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

### 2.5 WOWLAN 支持（可选）

按项目需要，在驱动 `Makefile` 将 `CONFIG_WOWLAN = n` 与 `CONFIG_GPIO_WAKEUP = n` 都改为 `y`。在 `platform/platform_ops.c` 增加 `rockchip_wifi_get_oob_irq()` 支持：

![唤醒中断修改对比](/docs/rockchip-realtek-wifi-driver-porting/images/pdf-p10-4.png)

唤醒中断修改对比

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

## 参考

[ArmSoM 官方文档](https://docs.armsom.org/)；原稿 RK-SM-YF-210 V1.0，第 5–10 页。

{% endraw %}
