---
title: "Rockchip Android Application Preinstallation"
description: "Rockchip Android Application Preinstallation"
excerpt: "Rockchip Android Application Preinstallation"
translation_key: "254-rockchip-android-application-preinstallation"
slug: "254-rockchip-android-application-preinstallation"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android"]
---

{% raw %}

# Rockchip Android Application Preinstallation

Complete technical pages 6–7 of bilingual RK-SM-YF-203 V1.2. The technical scope is Android 8.1 and later with an Android Q update: historical source scope requiring target-BSP verification. Chinese/English follow their respective text, with extraction-collapsed English spacing repaired; Russian/German are complete translations. No technical images/tables exist. Cover dates, disclaimers, contacts, audience and revision history are removed. No commands, flashing or hardware tests were performed.

Audit: all three installation behaviors, input directories and output directories remain in their original order; the page-split correspondence is joined. No source script path was supplied, so none is guessed. The source pairs $OUT/oem with odm/odm.img; retain this and verify the target SDK. The systemuid restriction and native mk integration reference remain. Flashing may erase data: use authorized devices, back up and verify the image. This document does not grant redistribution rights for third-party APKs.

<!-- source:bilingual p6 unit:0 -->

## 1 Overview

<!-- source:bilingual p6 unit:1 -->

Android application preinstallation pre-installs prepared third-party applications into Android when configuring a product according to manufacturer requirements.

<!-- source:bilingual p6 unit:2 -->

Preinstallation includes:

<!-- source:bilingual p6 unit:3 -->

1. Install applications that cannot be uninstalled.

<!-- source:bilingual p6 unit:4 -->

2. Install applications that can be permanently uninstalled.

<!-- source:bilingual p6 unit:5 -->

3. Install applications that are automatically restored after a factory reset if previously uninstalled.

<!-- source:bilingual p6 unit:6 -->

## 2 Function enable instruction

<!-- source:bilingual p6 unit:7 -->

### 2.1 Configuration and usage

<!-- source:bilingual p6 unit:8 -->

After source, enter the following command to find the corresponding target directory, such as device/rockchip/rk3126c/.

<!-- source:bilingual p6 unit:9 -->

```text
get_build_var TARGET_DEVICE_DIR
```

<!-- source:bilingual p6 unit:10 -->

The target directory contains three folders:

<!-- source:bilingual p6 unit:11 -->

```text
1. preinstall
2. preinstall_del_forever
3. preinstall_del
```

<!-- source:bilingual p6 unit:12 -->

They respectively correspond to the types in the overview. Put applications in the appropriate folder. Prefer English APK filenames and avoid spaces.

<!-- source:bilingual p6 unit:13 -->

After a successful make, corresponding folders are generated under $OUT/oem:

<!-- source:bilingual p6 unit:14 -->

```text
1. bundled_persist-app
2. bundled_uninstall_gone-app
3. bundled_uninstall_back-app
```

<!-- source:bilingual p6 unit:15 -->

These also correspond to the types described in the overview.

<!-- source:bilingual p7 unit:16 -->

After flashing, the system automatically installs these applications into the corresponding directories.

<!-- source:bilingual p7 unit:17 -->

Note: preinstallation of applications with systemuid is not supported. Use the native Android method to write the mk file; see the integration under vendor/rockchip/common/apps/RkDeviceTest/.

<!-- source:bilingual p7 unit:18 -->

### 2.2 Compiling result

<!-- source:bilingual p7 unit:19 -->

After compilation, the configuration files are output to the odm partition ($OUT/oem/). After adding them, ensure odm.img is flashed for them to take effect.

{% endraw %}
