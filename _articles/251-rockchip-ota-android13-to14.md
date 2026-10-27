---
title: "Rockchip Non-A/B OTA: Android 13 to Android 14"
description: "Complete non-A/B OTA data/keymaster patch, build steps, upgrade-history branches and partition compatibility requirements."
excerpt: "Complete non-A/B OTA data/keymaster patch, build steps, upgrade-history branches and partition compatibility requirements."
translation_key: "251-rockchip-ota-android13-to14"
slug: "251-rockchip-ota-android13-to14"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM platform reference: complete non-A/B Android 13→14 OTA procedure from Chinese document RK-KF-YF-788 V1.0.0. Its scope lists RK3326/RK3399/RK356x/RK3588/RK3562 and kernels 5.10 and 6.10; 6.10 is retained, not silently changed to 6.1. This does not certify any ArmSoM board. Check the actual board, Android BSP, partitions and security configuration; hardware validation has not been performed. Only a Chinese source is available. It contains no technical illustrations; tables and patches remain editable.

> Risk: the source patch wipes user data and the debugging setting weakens SELinux protection. These are source examples, not executed commands. Back up data and independently review the target SDK; do not treat them as a production configuration.

| Source SoCs | Source kernels |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588/RK3562 | 5.10, 6.10 |

## 1. Overview

This guide describes upgrading a Rockchip Android 13.0 non-A/B system to an Android 14.0 non-A/B system through OTA.

## 2. Android 14.0 patches

### 2.1 data partition and keymaster

(1) After a major-version upgrade, the source strongly recommends wiping `data` to avoid complex compatibility problems that prevent Android from starting. Applying the following reference patch in the Android 14 SDK `build/make` repository automatically wipes `data` after the upgrade.

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

(2) To retain `data` after the upgrade:

a. First perform the upgrade in section 3. If the Android main interface starts normally, skip b; otherwise follow b.

b. Obtain the applicable patches from `userdata_patches` at the source download below and apply them to the corresponding Android 14 SDK repositories. Follow `README.txt` in that directory for the exact usage.

Source download: [patches](https://pan.baidu.com/s/1HcH1QbUE4mAJplV5KoP-1w), extraction code `0nsa`. Current availability is unverified; nothing was downloaded or executed.

Important: these patches are only for projects upgrading existing Android 13 devices to Android 14; do not use them for new Android 14 devices.

## 3. Upgrading Android 13.0 to Android 14.0

Generate the matching OTA package on the Rockchip Android 14.0 platform, copy it to the Rockchip Android 13.0 device and perform a normal OTA upgrade. Read the precautions in section 4 first.

1. Select the Android 13→14 `lunch` target, for example `lunch rk3588_t-userdebug` or `lunch rk3568_t-userdebug`. The corresponding lunch project directory can normally be copied from the Android 13 SDK.
2. Build the system normally: compile uboot and kernel, run lunch, then use the source command:

```shell
make clean && make –j32 && make dist -j32 && ./mkimage.sh ota
```

The first `–j32` contains a non-ASCII dash in the source and is retained for traceability; verify the actual option before execution. This is not a guarantee that direct copying will work.

3. Take the package from step 2 and name it `update.zip`.
4. Place the matching `update.zip` on the Android 13 device and upgrade.

**Upgrade history:**

(1) If the current Android 13.0 was upgraded from Android 12.0 using `Rockchip_Developer_Guide_OTA_from_Android12_to_Android13_CN`, the further upgrade to 14.0 follows `Rockchip_Developer_Guide_OTA_from_Android12_to_Android14_CN`: select the Android 12.0 lunch target in the 14.0 tree, such as `lunch rk3568_s-userdebug` or `lunch rk3588_s-userdebug`, build normally, and place the package spelled `upddate.zip` in the source on what that paragraph calls the “Android 14.0 device” to upgrade.

(2) If Android 13.0 came from Android 11.0 using `Rockchip_Developer_Guide_OTA_from_Android11_to_Android13_CN`, follow `Rockchip_Developer_Guide_OTA_from_Android11_to_Android14_CN`: select the Android 11.0 lunch target in the 14.0 tree, such as `lunch rk3568_r-userdebug`, build normally, and place the source-spelled `upddate.zip` on what that paragraph calls the “Android 14.0 device” to upgrade.

Editorial note: `upddate.zip` conflicts with `update.zip` in the main procedure, and “Android 14.0 device” conflicts with the pre-upgrade Android 13.0 context. Both source discrepancies are retained; verify the real filename and target device.

## 4. Precautions

1. For validation/debugging, the source requires `userdebug` on each Android platform, such as Android 13.0/14.0, with the following variable. This debugging example must not be adopted directly for production.

```make
BOARD_SELINUX_ENFORCING := false
```

2. Before OTA, ensure that the `parameter` partition tables match. For 13.0→14.0, the 14.0 firmware must use the same `parameter.txt` as 13.0.
3. Ensure matching data filesystems and encryption in `fstab`, for example `fstab.rk30board`. For 13.0→14.0, the 14.0 data filesystem and encryption must match 13.0.
4. Verify that the firmware itself works before OTA. For 13.0→14.0, flash the 14.0 firmware with a tool such as `RKDevTool` and confirm normal boot and correct operation of all functions.

Official background: [AOSP non-A/B OTA](https://source.android.com/docs/core/ota/nonab). This reference does not validate the source Rockchip patches against a current SDK.

{% endraw %}
