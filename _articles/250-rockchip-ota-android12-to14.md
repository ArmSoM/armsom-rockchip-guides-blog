---
title: "Rockchip Android 12 to Android 14 OTA Upgrade Guide"
description: "Rockchip Android 12 to Android 14 OTA Upgrade Guide — RK3588/RK356x/RK3399, BSP, parameter, fstab, userdata"
excerpt: "Rockchip Android 12 to Android 14 OTA Upgrade Guide"
translation_key: "250-rockchip-ota-android12-to14"
slug: "250-rockchip-ota-android12-to14"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "RK3588", "RK356x"]
---

{% raw %}

# Rockchip Android 12 to Android 14 OTA Upgrade Guide

ArmSoM platform reference, based on Chinese source RK-KF-YF-796 V1.0.0, covering non-AB OTA migration from Android 12 to 14. Its product table lists RK3326/RK3399/RK356x/RK3588 and kernels 6.1/5.10/4.19. This does not establish support for every chip/kernel combination or direct upgrade support for any ArmSoM board. Check the actual Android BSP, lunch target, partitions, encryption and device adaptation. No hardware validation was performed.

Warning: the source includes FRP disabling, SELinux debugging settings and a patch that automatically erases data. Evaluate only in controlled development on authorized devices; validate production security separately and back up data first. No commands were executed or patches downloaded.

| Chips listed in source | Kernel versions listed in source |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 6.1, 5.10, 4.19 |

## 1. Overview

This document describes OTA migration from Rockchip Android 12.0 to Android 14.0.

## 2. Android 14.0 patches

Apply the patches below to the Android 14.0 SDK. The source provides all patches at https://pan.baidu.com/s/1IIvpiRiy6dTJ6R6Uf2ZSrQ ; access code: `vgp7`; archive password: `rk12to14JDY39`.

### 2.1 RK3588

1. In `device/rockchip/common`, apply `jdy_device_rockchip_common_device.diff` and `jdy_device_rockchip_common_manifests.diff`.
2. In `build/make`, apply `jdy_build_make.diff`.
3. For RK3588, the source states that Android 14 enables FRP by default whereas Android 12 does not. To match the Android 12 project, disable FRP only if that project actually uses this configuration; the existing project configuration is authoritative.

```diff
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

### 2.2 RK356X

1. In `device/rockchip/common`, apply `jdy_device_rockchip_common_device.diff` and `jdy_device_rockchip_common_manifests.diff`.
2. In `build/make`, apply `jdy_build_make.diff`.
3. For rk3568, apply `0001-Add-rk3568_s.patch` in `device/rockchip/rk356x`.

For rk3566, apply `0002-Add-rk3566_s.patch` in `device/rockchip/rk356x`.

For the rk3566 Go variant, apply `0003-Add-rk3566_sgo.patch` in `device/rockchip/rk356x`. Add the appropriate entries to `device/rockchip/rk356x/AndroidProducts.mk`; the rk3568 example follows.

```diff
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

4. For RK356X, the source likewise states that Android 14 enables FRP by default while Android 12 does not. Match the actual Android 12 project configuration. If disabling FRP is required, set `BUILD_WITH_GOOGLE_FRP := false` in the relevant `BoardConfig.mk` under `device/rockchip/rk356x/XXX`, for example:

```diff
+BUILD_WITH_GOOGLE_FRP := false
```

If FRP must be disabled, also apply `jdy_packages_apps_Settings.diff` in `packages/apps/Settings`.

### 2.3 Other chips, such as RK3399

1. In `device/rockchip/common`, apply `jdy_device_rockchip_common_device.diff` and `jdy_device_rockchip_common_manifests.diff`.
2. In `build/make`, apply `jdy_build_make.diff`.
3. Copy the corresponding Android 12 project lunch entry from the Android 12 SDK into the Android 14 SDK, such as `rk3399_Android12`, `rk3568_s` or `rk3588_s`.
4. The source states that Android 14 enables FRP by default whereas Android 12 does not. If necessary, disable FRP to match the actual Android 12 configuration. The source uses this reference patch:

```diff
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

## 3. Upgrading Android 12.0 to Android 14.0

Generate the OTA package on the Rockchip Android 14.0 platform as follows, then place it on the Rockchip Android 12.0 device and perform a normal OTA update. Read section 4, Precautions, first (the source incorrectly refers to “3. Precautions”).

1. Select the lunch target for migration from 12.0 to 14.0, such as `rk3568_s` or `rk3588_s`. Its project directory can normally be copied directly from the Android 12 SDK.

2. Build the system normally: build uboot and kernel, run lunch, then execute the following source command.

```text
make clean && make –j32 && make dist -j32 && ./mkimage.sh ota
```

3. Take the update package generated in step 2 and name it `update.zip`.

4. Put the corresponding `update.zip` on the Android 12 device and update it.

Note: If the current Android 12.0 installation was itself upgraded from Android 11.0 using `Rockchip_Developer_Guide_OTA_from_Android11_to_Android12_CN`, further migration to Android 14.0 follows `Rockchip_Developer_Guide_OTA_from_Android11_to_Android14_CN`: select the Android 11.0 lunch target in the Android 14.0 SDK, such as `rk3399_Android11`, build normally, and put the resulting package on that Android 12.0 device. The source spells this package `upddate.zip` here, unlike `update.zip` elsewhere; verify the actual filename.

## 4. Precautions

1. For validation and debugging, use userdebug builds on each Android platform, such as Android 12.0 and 14.0, and set `BOARD_SELINUX_ENFORCING := false`. This source test configuration is not a production security recommendation.

2. Before OTA, ensure that the partition table in `parameter` is identical. For migration from 12.0 to 14.0, the built 14.0 firmware must use the same `parameter` as 12.0.

3. Before OTA, the data filesystem and encryption mode in fstab, such as `fstab.rk30board`, must match. For migration from 12.0 to 14.0, the built 14.0 firmware must retain the 12.0 data filesystem and encryption mode.

4. Verify that the firmware itself works before OTA. For migration from 12.0 to 14.0, flash the built 14.0 firmware using a tool such as RKDevTool and confirm normal boot and correct operation of all functions.

5. data and keymaster

(1) After a major-version upgrade, the source strongly recommends erasing data to avoid complex compatibility problems that prevent Android from starting. The following reference patch in the Android 14 SDK `build/make` repository automatically erases data after the update. **This destroys user data; back it up and obtain authorization before use.**

```diff
diff --git a/tools/releasetools/ota_from_target_files.py b/tools/releasetools/ota_from_target_files.py
index d1b935845f..a3f2e28af0 100755
--- a/tools/releasetools/ota_from_target_files.py
+++ b/tools/releasetools/ota_from_target_files.py
@@ -279,7 +279,7 @@ logger = logging.getLogger(__name__)
 OPTIONS = ota_utils.OPTIONS
 OPTIONS.verify = False
 OPTIONS.patch_threshold = 0.95
-OPTIONS.wipe_user_data = False
+OPTIONS.wipe_user_data = True
 OPTIONS.extra_script = None
 OPTIONS.worker_threads = multiprocessing.cpu_count() // 2
 if OPTIONS.worker_threads == 0:
@@ -1498,14 +1498,15 @@ def main(argv):
   else:
     OPTIONS.info_dict = ParseInfoDict(args[0])

-  if OPTIONS.wipe_user_data:
+  '''if OPTIONS.wipe_user_data:
     if not OPTIONS.vabc_downgrade:
       logger.info("Detected downgrade/datawipe OTA."
                   "When wiping userdata, VABC OTA makes the user "
                   "wait in recovery mode for merge to finish. Disable VABC by "
                   "default. If you really want to do VABC downgrade, pass "
                   "--vabc_downgrade")
-      OPTIONS.disable_vabc = True
+      OPTIONS.disable_vabc = True'''
+  if OPTIONS.downgrade:
     # We should only allow downgrading incrementals (as opposed to full).
     # Otherwise the device may go back from arbitrary build with this full
     # OTA package.
```

(2) If data really must be retained after the update:

a. First follow section 3. If Android reaches its main screen after the update, ignore item b; otherwise follow it.

b. Obtain the relevant patches from the `userdata_patches` directory at https://pan.baidu.com/s/1kugy2rNZWu9w-aAG6qlRtA (access code `jset`) and apply them to the corresponding Android 14 SDK repositories. See `userdata_patches/README.txt` for usage instructions.

**These patches apply only to projects upgrading existing Android 12 devices to Android 14; do not use them when developing new Android 14 devices.**

## Editorial and source notes

- No matching English PDF was supplied; English, Russian and German are translated from the Chinese technical body. There are no technical figures. Product-table scope is retained above.
- All four chapters on PDF pages 4–7 are retained; page 8 is blank. Nontechnical cover material, audience and revision history are omitted. The final restriction against using the userdata patches on new Android 14 devices is restored from the last line of page 7.
- The source build command uses `–j32` (U+2013), not an ASCII hyphen. It is retained as source text; verify before running and do not blindly copy it. The visually wrapped first diff line is joined; other code parameters are unchanged.
- Section 3 incorrectly points to “3. Precautions”; this is section 4. `upddate.zip` conflicts with `update.zip` and is not treated as a verified filename.
- Section 2.3 repeats a path phrase and reuses an RK3588 example; neither proves direct applicability to RK3399. Download links, access codes and archive password originate in the PDF and were not downloaded or validated; they are not local credentials.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
