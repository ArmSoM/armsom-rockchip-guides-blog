---
title: "Rockchip Android 9.0 蓝牙配置说明"
description: "Rockchip Android 9.0 蓝牙配置说明 — V1.0.0"
excerpt: "Rockchip Android 9.0 蓝牙配置说明"
translation_key: "235-rockchip-android9-bluetooth-configuration"
slug: "235-rockchip-android9-bluetooth-configuration"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Bluetooth]
---

{% raw %}

# Rockchip Android 9.0 蓝牙配置说明

依据 V1.0（2018-11-16）7 页中文原稿，完整保留技术页 4–7 的配置与问题排查。标题 Android 9.0，但目的段原写 Android 8.1，二者按原稿保留，不作当前平台兼容性承诺。只有中文来源，无英文原图；技术正文没有图片或表格，所有 DTS 和命令均可编辑。封面、修订、目录、重复页眉页脚移除。未运行命令、修改固件或测试硬件。

校对：BT DTS 跨页接续，libbt 路径和 snoop 属性中的排版折行已接合；32k、GPIO、端口、属性和源码拼写保持原文。原 DTS pinctrl 示例的括号/分号不完整，未猜补，使用前按实际源码与硬件校验。上电/下电命令仅用于获授权设备；snoop 日志可能包含通信和设备隐私，限制访问，调试后关闭并按需清理。

<!-- source:cn p4 unit:0 -->

## 1 目的

<!-- source:cn p4 unit:1 -->

明确 android 8.1 平台上 BT 自动兼容原理和注意事项，按照本文档 BT 提供的完全自动兼容说明生成固件后，即可支持相应的 BT 模块，并且一套固件可以支持多个 BT 模块。

<!-- source:cn p4 unit:2 -->

### 1.1 Kernel 注意事项

<!-- source:cn p4 unit:3 -->

1. 首先配置 wifi_chip_type，系统会根据不同的 chip_type 加载不同的 libbt 库。

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

2. BT 部分 DTS 配置

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

上面部分内容是 BT 的 DTS 配置内容，主要包括电源控制、中断等功能脚的配置，具体根据实际硬件原理图修改相应的配置。

<!-- source:cn p5 unit:8 -->

3. BT 电源控制驱动位于：net/rfkill/rfkill-bt.c，代码会生成节点 /sys/class/rfkill/rfkill0/state。

<!-- source:cn p5 unit:9 -->

执行以下第一条命令可以手动给蓝牙模块上电；第二条可以手动下电。系统在打开蓝牙时候，会自动执行上电过程。

<!-- source:cn p5 unit:10 -->

```text
echo 1 > /sys/class/rfkill/rfkill0/state
echo 0 > /sys/class/rfkill/rfkill0/state
```

<!-- source:cn p5 unit:11 -->

### 1.2 Android 注意事项

<!-- source:cn p5 unit:12 -->

#### 1. Libbt

<!-- source:cn p5 unit:13 -->

Libbt 负责蓝牙芯片的初始化，如加载蓝牙 firmware 等操作，不同蓝牙芯片使用不同的 libbt，libbt 一般都由芯片厂家提供。目前主要使用的是 broadcom 和 realtek，源码分别位于 hardware/broadcom/libbt 和 hardware/realtek/rtkbt/code/libbt-vendor。Libbt 一般都不需要做什么修改，只需要配置一下蓝牙模组使用的端口以及蓝牙 firmware 的路径即可，broadcom 和 realtek 模组的配置并不相同，分别位于 hardware/broadcom/libbt/conf/rockchip/rksdk/bt_vendor.conf 和 hardware/realtek/rtkbt/code/vendor/etc/bluetooth/rtkbt.conf。

<!-- source:cn p6 unit:14 -->

#### 2. bluedroid

<!-- source:cn p6 unit:15 -->

Bluedroid 源码在 system/bt 下面，从 android9.0 开始，bluedroid 编译出来的库是 libbluetooth.so。bluedroid 有些可以配置的宏可以放在 device/rockchip/rk3368/bluetooth/bdroid_buildcfg.h 下面来配置。

<!-- source:cn p6 unit:16 -->

可以通过修改机器中 /system/etc/bt_stack.conf 来修改 bluedroid 中各部分的 log 输出级别。

<!-- source:cn p6 unit:17 -->

可以通过设置 "persist.bluetooth.btsnoopenable" 来控制是否输出 snoop log；设置 "persist.bluetooth.btsnooppath" 修改 snoop log 的保存路径，系统默认为 "/data/misc/bluetooth/logs/btsnoop_hci.log"；可以修改 "persist.bluetooth.btsnoopsize" 来设置 snoop log 文件的大小。

<!-- source:cn p6 unit:18 -->

#### 3. pcba bt 测试

<!-- source:cn p6 unit:19 -->

Pcba 的 bt 测试代码默认蓝牙模组使用的端口是 /dev/ttyS0，如果有需要修改端口号，可以通过修改 /system/etc/bt_stack.conf 来配置。

<!-- source:cn p7 unit:20 -->

## 2 BT 问题排查

<!-- source:cn p7 unit:21 -->

### 2.1 BT 无法打开

<!-- source:cn p7 unit:22 -->

#### 1. 硬件问题

<!-- source:cn p7 unit:23 -->

（1）测量 bt 上电时序是否正确；（2）测量 32k 时钟是否正常供给；（3）测量串口数据通信是否正常；

<!-- source:cn p7 unit:24 -->

#### 2. 软件问题

<!-- source:cn p7 unit:25 -->

（1）确认蓝牙模组跟主控 cpu 通信端口是否配置正确；（2）确认内核 dts 配置是否符合硬件设计；（3）确认蓝牙模组使用的 firmware 是否跟模组匹配；

<!-- source:cn p7 unit:26 -->

3. 由于 android8.0 以后的蓝牙协议栈默认需要 BLE 功能，所以必须使用具备 ble 功能的蓝牙模组，否则蓝牙无法启动。

<!-- source:cn p7 unit:27 -->

### 2.2 蓝牙音乐卡顿

<!-- source:cn p7 unit:28 -->

#### 1. 硬件问题

<!-- source:cn p7 unit:29 -->

（1）检查 bt 天线是否焊接正常；（2）测量 bt 射频指标是否满足要求；

<!-- source:cn p7 unit:30 -->

#### 2. 软件问题

<!-- source:cn p7 unit:31 -->

音乐卡顿很多情况都是硬件的问题引起。Wifi 和 bt 的共存问题也会引起蓝牙音乐卡顿，所以首先要保证 wifi 驱动更新到最新。另外很多低端的 wifi 和 bt 二合一模块，在 wifi 扫描或者 bt 扫描时候，都可能引起蓝牙音乐卡顿。

{% endraw %}
