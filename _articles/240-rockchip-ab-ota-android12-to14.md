---
title: "Rockchip A/B OTA: Android 12 to Android 14 Upgrade Guide"
description: "Rockchip A/B OTA: Android 12 to Android 14 Upgrade Guide — A/B, Virtual A/B, BSP, keymaster, userdata"
excerpt: "Rockchip A/B OTA: Android 12 to Android 14 Upgrade Guide"
translation_key: "240-rockchip-ab-ota-android12-to14"
slug: "240-rockchip-ab-ota-android12-to14"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "A/B"]
---

{% raw %}

# Rockchip A/B OTA: Android 12 to Android 14 Upgrade Guide

ArmSoM platform reference based on Chinese source RK-KF-YF-795 V1.0.0. Its product table lists RK3326/RK3399/RK356x/RK3588 and kernels 6.1/5.10/4.9; these original values do not establish support for every chip/kernel combination or ArmSoM board. Verify the actual Android BSP, lunch target, A/B mode, partitions and encryption. No hardware validation was performed.

Flashing and security settings require authorized development devices and backups. The source userdebug/SELinux settings are debugging references, not production security recommendations. No commands were executed or patches downloaded.

| Chips listed in source | Kernel versions listed in source |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 6.1, 5.10, 4.9 |

## 1. Overview

This document describes OTA migration from Rockchip Android 12.0 A/B to Android 14.0 A/B.

## 2. Android 14.0 patches

Apply the patches below to the Android 14.0 SDK. The source provides all patches at https://pan.baidu.com/s/1IIvpiRiy6dTJ6R6Uf2ZSrQ ; access code: `vgp7`; archive password: `rk12to14JDY39`.

### 2.1 RK3588

1. In `device/rockchip/common`, apply `jdy_device_rockchip_common_device.diff` and `jdy_device_rockchip_common_manifests.diff`.
2. In `build/make`, apply `jdy_build_make.diff`.
3. For RK3588, the source states that Android 14 enables FRP by default whereas Android 12 does not. To match the Android 12 project, disable FRP only if that project actually uses this configuration; the existing project configuration is authoritative.

```text
diff --git a/rk3588_s/BoardConfig.mk b/rk3588_s/BoardConfig.mk
index a1c5c20..64afecc 100644
--- a/rk3588_s/BoardConfig.mk
+++ b/rk3588_s/BoardConfig.mk
@@ -37,3 +37,5 @@ PRODUCT_KERNEL_DTS := rk3588-evb1-lp4-v10
 BOARD_GSENSOR_MXC6655XA_SUPPORT := true
 BOARD_CAMERA_SUPPORT_EXT := true
 BOARD_HS_ETHERNET := true
+
+BUILD_WITH_GOOGLE_FRP := false
```

If FRP must be disabled, also apply `jdy_packages_apps_Settings.diff` in `packages/apps/Settings`.

(4) Enable the corresponding A/B settings under `device/rockchip/rk3588`; they must match the original Android 12 project. Source example:

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.2 RK356X

1. In `device/rockchip/common`, apply `jdy_device_rockchip_common_device.diff` and `jdy_device_rockchip_common_manifests.diff`.
2. In `build/make`, apply `jdy_build_make.diff`.
3. For rk3568, apply `0001-Add-rk3568_s.patch` in `device/rockchip/rk356x`.

For rk3566, apply `0002-Add-rk3566_s.patch` in `device/rockchip/rk356x`.

For the rk3566 Go variant, apply `0003-Add-rk3566_sgo.patch` in `device/rockchip/rk356x`. Add the appropriate entries to `device/rockchip/rk356x/AndroidProducts.mk`; the rk3568 example follows.

```text
diff --git a/AndroidProducts.mk b/AndroidProducts.mk
index 70af8e4..eaa4c50 100644
--- a/AndroidProducts.mk
+++ b/AndroidProducts.mk
@@ -15,11 +15,14 @@
 #

 PRODUCT_MAKEFILES := \
+        $(LOCAL_DIR)/rk3568_s/rk3568_s.mk \
         $(LOCAL_DIR)/rk3566_tgo/rk3566_tgo.mk \
         $(LOCAL_DIR)/rk3566_t/rk3566_t.mk \
         $(LOCAL_DIR)/rk3568_t/rk3568_t.mk

 COMMON_LUNCH_CHOICES := \
+    rk3568_s-userdebug \
+    rk3568_s-user \
     rk3566_tgo-userdebug \
     rk3566_tgo-user \
     rk3566_t-userdebug \
```

(4) This source paragraph says Android 13 SDK enables FRP by default, while Android 12 does not; match the actual Android 12 project. Set `BUILD_WITH_GOOGLE_FRP := false` in `device/rockchip/rk356x/XXX/BoardConfig.mk` if required. “Android 13” conflicts with the document’s Android 14 target and is retained for verification.

```text
+BUILD_WITH_GOOGLE_FRP := false
```

If FRP must be disabled, also apply `jdy_packages_apps_Settings.diff` in `packages/apps/Settings`.

(5) Enable the corresponding A/B settings under `device/rockchip/rk356x/XXX`; they must match the original Android 12 project. Source example:

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.3 Other chips, such as RK3399

1. In `device/rockchip/common`, apply `jdy_device_rockchip_common_device.diff` and `jdy_device_rockchip_common_manifests.diff`.
2. In `build/make`, apply `jdy_build_make.diff`.
3. Copy the corresponding Android 12 project lunch entry from the Android 12 SDK into the Android 14 SDK, such as `rk3399_Android12`, `rk3568_s` or `rk3588_s`.
4. The source states that Android 14 enables FRP by default whereas Android 12 does not. If necessary, disable FRP to match the actual Android 12 configuration. The source uses this reference patch:

```text
diff --git a/rk3588_s/BoardConfig.mk b/rk3588_s/BoardConfig.mk
index a1c5c20..64afecc 100644
--- a/rk3588_s/BoardConfig.mk
+++ b/rk3588_s/BoardConfig.mk
@@ -37,3 +37,5 @@ PRODUCT_KERNEL_DTS := rk3588-evb1-lp4-v10
 BOARD_GSENSOR_MXC6655XA_SUPPORT := true
 BOARD_CAMERA_SUPPORT_EXT := true
 BOARD_HS_ETHERNET := true
+
+BUILD_WITH_GOOGLE_FRP := false
```

If FRP must be disabled, also apply `jdy_packages_apps_Settings.diff` in `packages/apps/Settings`.

(4) Enable the corresponding A/B settings under `device/rockchip/rk3588`; they must match the original Android 12 project. Source example:

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

## 3. Upgrading Android 12.0 to Android 14.0

Generate the OTA package on the Rockchip Android 14.0 platform as follows, then place it on the Rockchip Android 12.0 device and perform a normal OTA update. Read section 4, Precautions, first (the source incorrectly refers to “3. Precautions”).

1. Select the lunch target for migration from 12.0 to 14.0, such as `rk3568_s` or `rk3588_s`. Its project directory can normally be copied directly from the Android 12 SDK.

2. Build the system normally: build uboot and kernel, run lunch, then execute the following source command.

```text
make clean && make –j32 && make dist -j32 && ./mkimage_ab.sh ota
```

3. Take the update package generated in step 2 and name it `update.zip`.

4. Put the corresponding `update.zip` on the Android 12 device and update it.

Note: If the current Android 12.0 installation was itself upgraded from Android 11.0 using `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android12_CN`, further migration to Android 14.0 follows `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android14_CN`: select the Android 11.0 lunch target in the Android 14.0 SDK, such as `rk3399_Android11`, build normally, and put the resulting package on that Android 12.0 device. The source spells this package `upddate.zip` here, unlike `update.zip` elsewhere; verify the actual filename.

## 4. Precautions

1. For validation and debugging, use userdebug builds on each Android platform, such as Android 12.0 and 14.0, and set `BOARD_SELINUX_ENFORCING := false`. This source test configuration is not a production security recommendation.

2. Before OTA, ensure that the partition table in `parameter` is identical. For migration from 12.0 to 14.0, the built 14.0 firmware must use the same `parameter` as 12.0.

3. Before OTA, the data filesystem and encryption mode in fstab, such as `fstab.rk30board`, must match. For migration from 12.0 to 14.0, the built 14.0 firmware must retain the 12.0 data filesystem and encryption mode.

4. Verify that the firmware itself works before OTA. For migration from 12.0 to 14.0, flash the built 14.0 firmware using a tool such as RKDevTool and confirm normal boot and correct operation of all functions.

5. data and keymaster

a. First follow section 3. If Android reaches its main screen after the update, ignore item b; otherwise follow it.

b. Obtain the relevant patches from the `userdata_patches` directory at https://pan.baidu.com/s/1kugy2rNZWu9w-aAG6qlRtA (access code `jset`) and apply them to the corresponding Android 14 SDK repositories. See `userdata_patches/README.txt` for usage instructions.

**These patches apply only to projects upgrading existing Android 12 devices to Android 14; do not use them when developing new Android 14 devices.**

## Editorial and source notes

No matching English PDF; English, Russian and German translate the complete Chinese text. No technical figures exist; product-table scope is retained above. Nontechnical cover, audience and revisions are omitted. Source `–j32` uses U+2013 and is retained, not silently rewritten; verify before running. The discrepancy between `upddate.zip` and `update.zip` is explicit. Download links and codes originate in the source and were not validated.

Section 2.2 says Android 13 default FRP despite the Android 14 topic. Section 2.3 still uses rk3588 paths and repeats item (4). The source reference to “3. Precautions” means chapter 4. These issues are retained; rk3588 settings are not assumed valid unchanged on rk3399. Kernel 4.9 is not silently changed to 4.19. This A/B source contains no automatic data-wipe patch from the non-AB guide; none is mixed in.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
