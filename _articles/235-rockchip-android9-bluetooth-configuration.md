---
title: "Rockchip Android 9.0 Bluetooth Configuration"
description: "Rockchip Android 9.0 Bluetooth Configuration — V1.0.0"
excerpt: "Rockchip Android 9.0 Bluetooth Configuration"
translation_key: "235-rockchip-android9-bluetooth-configuration"
slug: "235-rockchip-android9-bluetooth-configuration"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Bluetooth]
---

{% raw %}

# Rockchip Android 9.0 Bluetooth Configuration

Complete configuration and troubleshooting text from technical pages 4–7 of the seven-page Chinese V1.0 source (2018-11-16). Its title says Android 9.0 but its purpose paragraph says Android 8.1; both are retained as historical source claims, not current compatibility guarantees. Only a Chinese source exists; no English original figures. The technical body has no images or tables; DTS and commands are editable. Cover, revision, contents and repeated headers/footers are omitted. No commands, firmware changes or hardware tests were performed.

Audit: joined page-split BT DTS and layout wraps in libbt paths and snoop properties. Original 32k, GPIOs, ports, properties and code spelling are retained. The source pinctrl DTS has incomplete braces/semicolons; these are not guessed. Check actual source and hardware before use. Power commands are for authorized devices only. Snoop logs may expose communications and device information: restrict access, disable logging after debugging and remove unneeded logs.

<!-- source:cn p4 unit:0 -->

## 1 Purpose

<!-- source:cn p4 unit:1 -->

Explain automatic BT compatibility on Android 8.1 and the associated precautions. Firmware built according to this document's fully automatic compatibility instructions supports the corresponding BT modules; one firmware image can support multiple BT modules.

<!-- source:cn p4 unit:2 -->

### 1.1 Kernel considerations

<!-- source:cn p4 unit:3 -->

1. Configure wifi_chip_type first. The system loads different libbt libraries according to chip_type.

<!-- source:cn p4 unit:4 -->

```text
wireless-wlan {
compatible = "wlan-platdata";
wifi_chip_type ="ap6255"; //或者如”rtl8723ds”;
WIFI,host_wake_irq = <&gpio0 GPIO_D4 GPIO_ACTIVE_HIGH>;
status = "okay";
};
```

<!-- source:cn p4 unit:5 -->

2. BT DTS configuration

<!-- source:cn p4 unit:6 -->

```text
wireless-bluetooth {
compatible = "bluetooth-platdata";
clocks = <&rk808 1>;
clock-names = "ext_clock";
//wifi-bt-power-toggle;
uart_rts_gpios = <&gpio2 19 GPIO_ACTIVE_LOW>;
pinctrl-names = "default", "rts_gpio";
pinctrl-0 = <&uart0_rts>;
pinctrl-1 = <&uart0_gpios>;
//BT,power_gpio = <&gpio3 19 GPIO_ACTIVE_HIGH>;
BT,reset_gpio = <&gpio0 9 GPIO_ACTIVE_HIGH>;
BT,wake_gpio = <&gpio2 26 GPIO_ACTIVE_HIGH>;
BT,wake_host_irq = <&gpio0 4 GPIO_ACTIVE_HIGH>;
status = "okay";
};
&pinctrl {
wireless-bluetooth {
uart0_gpios: uart0-gpios {
rockchip,pins =
<2 19 RK_FUNC_GPIO &pcfg_pull_none>;
}
};
```

<!-- source:cn p5 unit:7 -->

The preceding BT DTS configuration primarily defines power control, interrupts and other function pins. Modify it according to the actual hardware schematic.

<!-- source:cn p5 unit:8 -->

3. The BT power-control driver is net/rfkill/rfkill-bt.c. It creates /sys/class/rfkill/rfkill0/state.

<!-- source:cn p5 unit:9 -->

The first command below manually powers on the Bluetooth module; the second powers it off. The system powers it on automatically when Bluetooth is enabled.

<!-- source:cn p5 unit:10 -->

```text
echo 1 > /sys/class/rfkill/rfkill0/state
echo 0 > /sys/class/rfkill/rfkill0/state
```

<!-- source:cn p5 unit:11 -->

### 1.2 Android considerations

<!-- source:cn p5 unit:12 -->

#### 1. Libbt

<!-- source:cn p5 unit:13 -->

Libbt initializes the Bluetooth chip, including loading its firmware. Different chips use different libbt implementations, generally supplied by the chip vendor. The source primarily uses Broadcom and Realtek, with code in hardware/broadcom/libbt and hardware/realtek/rtkbt/code/libbt-vendor respectively. Libbt normally needs no changes beyond the Bluetooth module's port and firmware path. Broadcom and Realtek use different configuration files: hardware/broadcom/libbt/conf/rockchip/rksdk/bt_vendor.conf and hardware/realtek/rtkbt/code/vendor/etc/bluetooth/rtkbt.conf respectively.

<!-- source:cn p6 unit:14 -->

#### 2. bluedroid

<!-- source:cn p6 unit:15 -->

Bluedroid source is under system/bt. Starting with Android 9.0, its compiled library is libbluetooth.so. Some configurable macros can be placed in device/rockchip/rk3368/bluetooth/bdroid_buildcfg.h.

<!-- source:cn p6 unit:16 -->

Edit /system/etc/bt_stack.conf on the device to change log output levels for Bluedroid components.

<!-- source:cn p6 unit:17 -->

Set "persist.bluetooth.btsnoopenable" to control snoop logging. "persist.bluetooth.btsnooppath" changes its output path, which defaults to "/data/misc/bluetooth/logs/btsnoop_hci.log". "persist.bluetooth.btsnoopsize" sets the snoop log file size.

<!-- source:cn p6 unit:18 -->

#### 3. PCBA BT testing

<!-- source:cn p6 unit:19 -->

The PCBA BT test code assumes /dev/ttyS0 as the Bluetooth module port. If another port is required, configure it in /system/etc/bt_stack.conf.

<!-- source:cn p7 unit:20 -->

## 2 BT troubleshooting

<!-- source:cn p7 unit:21 -->

### 2.1 BT cannot be enabled

<!-- source:cn p7 unit:22 -->

#### 1. Hardware problems

<!-- source:cn p7 unit:23 -->

(1) Measure whether BT power-up timing is correct; (2) verify that the 32k clock is supplied normally; (3) verify normal serial-port data communication.

<!-- source:cn p7 unit:24 -->

#### 2. Software problems

<!-- source:cn p7 unit:25 -->

(1) Confirm the BT-module/host-CPU communication port is configured correctly; (2) confirm kernel DTS matches the hardware design; (3) confirm the firmware matches the Bluetooth module.

<!-- source:cn p7 unit:26 -->

3. The source states that the Bluetooth stack after Android 8.0 requires BLE by default. A BLE-capable module is therefore required, otherwise Bluetooth cannot start.

<!-- source:cn p7 unit:27 -->

### 2.2 Bluetooth music stutters

<!-- source:cn p7 unit:28 -->

#### 1. Hardware problems

<!-- source:cn p7 unit:29 -->

(1) Check correct soldering of the BT antenna; (2) measure whether BT RF performance meets requirements.

<!-- source:cn p7 unit:30 -->

#### 2. Software problems

<!-- source:cn p7 unit:31 -->

Music stuttering is often caused by hardware. Wi-Fi/BT coexistence can also cause it, so first ensure the Wi-Fi driver is up to date. Many low-end Wi-Fi/BT combo modules may also cause Bluetooth music stuttering during either Wi-Fi or BT scanning.

{% endraw %}
