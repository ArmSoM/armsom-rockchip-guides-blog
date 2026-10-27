---
title: "Rockchip Android 性能模式配置"
description: "完整整理 package_performance.xml 的包名配置、启停值和编译输出，并保留 odm/oem.img 原稿疑点。"
excerpt: "完整整理 package_performance.xml 的包名配置、启停值和编译输出，并保留 odm/oem.img 原稿疑点。"
translation_key: "259-rockchip-android-performance-mode"
slug: "259-rockchip-android-performance-mode"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM 平台参考：依据 RK-SM-YF-204 V1.1 中英双语原稿整理。原稿注明 Android 8.1 及以上，V1.1 更新针对 Android Q；这只是该历史 SDK 的适用说明，不代表所有新版本或 ArmSoM 板卡均支持。原稿未指定已验证板卡、SoC 或内核版本，须检查具体 Android BSP 是否实现 `package_performance.xml`。本文未做硬件、功耗或性能测试，不把对特定应用启用模式当作真实测试结果。原稿没有技术配图，配置代码可复制。

## 1. 概述

本文说明如何针对特定应用（例如安兔兔）进行加速与性能提升。

## 2. 快速开启方法

### 2.1 开启与关闭

在 `device/rockchip/rk3xxx/` 下配置 `package_performance.xml`，在节点中加入需要使用性能模式的包名。原稿用以下命令形式获取包名，`file_path.apk` 为原稿占位参数，执行前按实际文件路径核对：

```shell
aapt dump badging (file_path.apk)
```

中英文原稿给出同义占位模板；本版采用中文模板，英俄德采用英文原模板。说明值不能作为实际参数直接部署：

```xml
<app package="包名" mode="是否启用加速，启用为1，关闭为0"/>
```

`package` 填入应用包名；`mode="1"` 开启加速，`mode="0"` 关闭。原稿以安兔兔为例：

```xml
<app package="com.antutu.ABenchMark" mode="1"/>
<app package="com.antutu.benchmark.full" mode="1"/>
```

编译时该文件会被打包进固件。

### 2.2 编译结果

编译后配置文件输出到 `odm` 分区（`$OUT/odm/etc/`）。原稿中英文均要求：添加后确认烧写了 `oem.img`，以使配置生效。

> 校对疑点：`odm` 路径与 `oem.img` 名称并存于中英文原稿，不擅自将其改成 `odm.img`。须根据目标 SDK 的打包规则和真实分区映射核对。本文未执行烧写。

相关官方工具背景：[Android SDK Build Tools](https://developer.android.com/tools/releases/build-tools)。该说明不证明某一 Rockchip BSP 的性能模式实现或优化效果。

{% endraw %}
