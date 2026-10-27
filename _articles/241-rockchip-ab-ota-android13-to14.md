---
title: "Rockchip A/B OTA: Android 13 to Android 14 Upgrade Guide"
description: "Rockchip A/B OTA: Android 13 to Android 14 Upgrade Guide — A/B, Virtual A/B, BSP, keymaster, userdata"
excerpt: "Rockchip A/B OTA: Android 13 to Android 14 Upgrade Guide"
translation_key: "241-rockchip-ab-ota-android13-to14"
slug: "241-rockchip-ab-ota-android13-to14"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "A/B"]
---

{% raw %}

# Rockchip A/B OTA: Android 13 to Android 14 Upgrade Guide

ArmSoM platform reference based on Chinese source RK-KF-YF-787 V1.0.0. Its product table lists RK3326/RK3399/RK356x/RK3588/RK3562 and kernels 5.10/6.10; these original values do not establish support for every chip/kernel combination or ArmSoM board. Verify the actual Android BSP, lunch target, A/B mode, partitions and encryption. No hardware validation was performed.

Flashing and security settings require authorized development devices and backups. The source userdebug/SELinux settings are debugging references, not production security recommendations. No commands were executed or patches downloaded.

| Chips listed in source | Kernel versions listed in source |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588/RK3562 | 5.10, 6.10 |

## 1. Overview

This document describes OTA migration from Rockchip Android 13.0 A/B to Android 14.0 A/B.

## 2. Android 14.0 patches

### 2.1 A/B configuration

Enable A/B in the project BoardConfig.mk. Android 14 must match the Android 13 A/B configuration; if virtual A/B was not enabled on Android 13, do not enable it on Android 14. A/B reference configuration:

```text
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
 BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
```

Virtual A/B reference configuration:

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.2 data and keymaster

a. First follow chapter 3. If Android reaches its main screen after updating, ignore b; otherwise follow b.

b. Obtain patches from the userdata_patches directory at the link below and apply them to the corresponding Android 14 SDK repositories. Usage is described in the directory README.txt.

Link: https://pan.baidu.com/s/1HcH1QbUE4mAJplV5KoP-1w ; access code: `0nsa`.

Only for projects upgrading existing Android 13 devices to Android 14. Do not use these patches for newly developed Android 14 devices.

## 3. Upgrading Android 13.0 to Android 14.0

Generate the OTA package on Rockchip Android 14.0, place it on the Rockchip Android 13.0 device and perform a normal OTA update. Read chapter 4 precautions first.

1. Select the lunch target for 13.0-to-14.0 migration, such as `lunch rk3588_t-userdebug` or `lunch rk3568_t-userdebug`. The project directory can normally be copied directly from the Android 13 SDK.

2. Build uboot and kernel normally, run lunch, then use this source build command:

```text
make clean && make –j32 && make dist -j32 && ./mkimage_ab.sh ota
```

3. Name the package from step 2 update.zip.
4. Place it on the Android 13 device and update.

Note (1): If the current Android 13 came from Android 12 via `Rockchip_Developer_Guide_AB_System_OTA_from_Android12_to_Android13_CN`, follow `Rockchip_Developer_Guide_AB_System_OTA_from_Android12_to_Android14_CN` for the next migration. In the Android 14 SDK select the original Android 12 lunch target, such as `lunch rk3568_s-userdebug` or `lunch rk3588_s-userdebug`, and build normally. The source then says to put `upddate.zip` on an “Android 14.0 device”. That filename conflicts with update.zip, and the device version conflicts with the pre-update Android 13. Preserve and verify these discrepancies before use.

Note (2): If Android 13 came from Android 11 via `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android13_CN`, follow `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android14_CN`. Select the original Android 11 lunch target in the Android 14 SDK, such as `lunch rk3568_r-userdebug`, and build normally. The source again names `upddate.zip` and an “Android 14.0 device”; the same discrepancies require verification.

## 4. Precautions

1. For validation and debugging, use userdebug builds on each Android platform, such as Android 13.0 and 14.0, and set `BOARD_SELINUX_ENFORCING := false`. This source test configuration is not a production security recommendation.

2. Before OTA, ensure that the partition table in `parameter.txt` is identical. For migration from 13.0 to 14.0, the built 14.0 firmware must use the same `parameter.txt` as 13.0.

3. Before OTA, the data filesystem and encryption mode in fstab, such as `fstab.rk30board`, must match. For migration from 13.0 to 14.0, the built 14.0 firmware must retain the 13.0 data filesystem and encryption mode.

4. Verify that the firmware itself works before OTA. For migration from 13.0 to 14.0, flash the built 14.0 firmware using a tool such as RKDevTool and confirm normal boot and correct operation of all functions.

## Editorial and source notes

No matching English PDF; English, Russian and German translate the complete Chinese text. No technical figures exist; product-table scope is retained above. Nontechnical cover, audience and revisions are omitted. Source `–j32` uses U+2013 and is retained, not silently rewritten; verify before running. The discrepancy between `upddate.zip` and `update.zip` is explicit. Download links and codes originate in the source and were not validated.

The product table says kernel 6.10; it is not guessed to mean 6.1. Chapter 3 calls the historical-upgrade target device Android 14 despite its current Android 13; all languages expose this conflict. Preserve the old device A/B versus virtual-A/B mode. The end-of-page-4 restriction against patches on new devices and final page-5 validation conditions are retained.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
