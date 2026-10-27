---
title: "Rockchip Android Performance Mode Configuration"
description: "Configure package_performance.xml package names and enable values, with complete build-output instructions and the source odm/oem.img discrepancy."
excerpt: "Configure package_performance.xml package names and enable values, with complete build-output instructions and the source odm/oem.img discrepancy."
translation_key: "259-rockchip-android-performance-mode"
slug: "259-rockchip-android-performance-mode"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM platform reference based on bilingual document RK-SM-YF-204 V1.1. The source states Android 8.1 and later, with V1.1 updated for Android Q; this is a historical SDK scope, not support assurance for every newer release or ArmSoM board. No validated board, SoC or kernel version is specified. Check whether the actual Android BSP implements `package_performance.xml`. No hardware, power or performance tests were performed; enabling a mode for a particular application is not itself a measured result. The source has no technical illustrations; configuration code remains copyable.

## 1. Overview

This document describes how to accelerate and improve performance for particular applications, such as Antutu.

## 2. Quick start method

### 2.1 Enable and disable

Configure `package_performance.xml` under `device/rockchip/rk3xxx/` and add the package name requiring performance mode to its node. The source gives the following command form for obtaining the package name. `file_path.apk` is the source placeholder; check the actual path before use:

```shell
aapt dump badging (file_path.apk)
```

The source has equivalent Chinese and English placeholder templates. This edition uses the English original; descriptive values are not deployable parameters:

```xml
<app package="the package name" mode="whether to enable the speedup, 1 means enable, 0 means disable"/>
```

Set `package` to the application package name. `mode="1"` enables acceleration and `mode="0"` disables it. The source uses Antutu as an example:

```xml
<app package="com.antutu.ABenchMark" mode="1"/>
<app package="com.antutu.benchmark.full" mode="1"/>
```

The file is packaged into the firmware image during compilation.

### 2.2 Compiling result

After compilation, the configuration file is output to the `odm` partition (`$OUT/odm/etc/`). Both source languages instruct you to flash `oem.img` after adding it so that the configuration takes effect.

> Editorial issue: the `odm` path and `oem.img` filename coexist in both source languages; the latter is not silently changed to `odm.img`. Verify the target SDK packaging rules and actual partition mapping. No flashing was performed.

Official tooling background: [Android SDK Build Tools](https://developer.android.com/tools/releases/build-tools). This does not verify the implementation or effectiveness of performance mode in any Rockchip BSP.

{% endraw %}
