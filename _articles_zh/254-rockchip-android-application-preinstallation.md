---
title: "Rockchip Android 应用预安装功能说明"
description: "Rockchip Android 应用预安装功能说明"
excerpt: "Rockchip Android 应用预安装功能说明"
translation_key: "254-rockchip-android-application-preinstallation"
slug: "254-rockchip-android-application-preinstallation"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android"]
---

{% raw %}

# Rockchip Android 应用预安装功能说明

依据 RK-SM-YF-203 V1.2 双语原稿，完整保留技术页 6–7。技术适用说明为 Android 8.1 及以上，并含 Android Q 更新；属于原稿历史范围，需核对实际 BSP。中英文采用各自原文，修复英文提取的粘连空格；俄德完整翻译。原稿无技术图片/表格。封面日期、声明、联系信息、读者和修订记录移除。未进行命令、刷写或硬件测试。

校对：三个安装行为、三个源目录和三个输出目录按原顺序完整保留，跨页对应关系已接续。source 未给出脚本路径，未猜补。原文同时使用 $OUT/oem 与 odm 分区/odm.img，保持原样并要求按目标 SDK 核对；systemuid 限制和原生 mk 集成参考保留。刷写可能清除数据，须确认授权设备、备份并核对镜像。本说明不授予第三方 APK 分发许可。

<!-- source:bilingual p6 unit:0 -->

## 1 概述

<!-- source:bilingual p6 unit:1 -->

Android 上的应用预安装功能，主要是指配置产品时，根据厂商要求，将事先准备好的第三方应用预制进 Android 系统。

<!-- source:bilingual p6 unit:2 -->

预安装分为：

<!-- source:bilingual p6 unit:3 -->

1. 安装不可卸载应用；

<!-- source:bilingual p6 unit:4 -->

2. 安装可永久卸载应用；

<!-- source:bilingual p6 unit:5 -->

3. 安装卸载后恢复出厂设置后自动恢复的应用。

<!-- source:bilingual p6 unit:6 -->

## 2 功能启用说明

<!-- source:bilingual p6 unit:7 -->

### 2.1 配置和使用

<!-- source:bilingual p6 unit:8 -->

source 之后输入以下命令找到对应目标文件夹，比如 device/rockchip/rk3126c/。

<!-- source:bilingual p6 unit:9 -->

```text
get_build_var TARGET_DEVICE_DIR
```

<!-- source:bilingual p6 unit:10 -->

在目标文件夹下有三个文件夹，分别为：

<!-- source:bilingual p6 unit:11 -->

```text
1. preinstall
2. preinstall_del_forever
3. preinstall_del
```

<!-- source:bilingual p6 unit:12 -->

分别对应概述中的几种。请将需要预置的应用放入对应的文件夹，注意 apk 文件名尽量使用英文，避免空格。

<!-- source:bilingual p6 unit:13 -->

顺利的话，make 之后会在 $OUT/oem 目录生成对应的文件夹：

<!-- source:bilingual p6 unit:14 -->

```text
1. bundled_persist-app
2. bundled_uninstall_gone-app
3. bundled_uninstall_back-app
```

<!-- source:bilingual p6 unit:15 -->

仍旧对应概述中的几种。

<!-- source:bilingual p7 unit:16 -->

在烧录后，系统会自动安装这些应用到对应目录。

<!-- source:bilingual p7 unit:17 -->

注意：不支持带 systemuid 应用的预制，请使用 android 原生方式编写 mk 文件。可参考 vendor/rockchip/common/apps/RkDeviceTest/ 的集成方式。

<!-- source:bilingual p7 unit:18 -->

### 2.2 编译结果

<!-- source:bilingual p7 unit:19 -->

编译后配置文件将会输出到 odm 分区（$OUT/oem/），增加后请确认烧写了 odm.img 来使其生效。

{% endraw %}
