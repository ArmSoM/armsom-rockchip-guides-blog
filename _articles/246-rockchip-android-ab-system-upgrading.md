---
title: "Rockchip Android A/B System Upgrading Guide"
description: "Rockchip Android A/B System Upgrading Guide — V1.2.0"
excerpt: "Rockchip Android A/B System Upgrading Guide"
translation_key: "246-rockchip-android-ab-system-upgrading"
slug: "246-rockchip-android-ab-system-upgrading"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, OTA, AB]
---

{% raw %}

# Rockchip Android A/B System Upgrading Guide

Complete six-chapter technical body (pages 4–12) of the 12-page Chinese RK-SM-YF-208 V1.2.0 source dated . Android >=12 applicability, Android 12/13/>=14 configurations and virtual-A/B advice reflect the historical SDK, not current compatibility. Only a Chinese source exists, with no English original figures. All editions retain the same eight independent original figures; their text is not claimed to be translated. Technical code and readable screenshot configuration/log content are editable. Legal/contact, audience, revision and duplicate contents material is omitted. No build, update, flashing or hardware test was run.

Source issues: Android 12/13 examples still reference rk3399_Android11; section 6.1 spells installcelan and generates update_loader.zip, while 6.2 pushes update.zip without explaining selection/renaming. These differences are retained. Some make option hyphens in chapter 3 are typographic dashes; check ASCII options before use. Patch excerpts retain PDF wraps and are not validated patch files. The fstab screenshot differs from the prose (backup/system_ext appear; not every prose node is shown). Readable settings, addresses and status progress are transcribed; clipped paths and unclear hashes remain in the original figures without guesses. Page 9 filename/size can be checked against later lines in that same image; headers hashes are not reliably readable, so the transcript is not a complete executable update session. Flashing/OTA/bootloader updates may lose data or prevent boot: use authorized test devices, back up, verify partition/firmware matches and prepare recovery. The source warning against routine miniloader updates is retained.

<!-- source:cn p2 unit:scope -->

| Chip name | Kernel version |
| --- | --- |
| <code>RK3326/RK3399/RK356x/RK3588</code> | <code>4.19, 5.10</code> |

<!-- source:cn p4 unit:0 -->

## 1. Overview

<!-- source:cn p4 unit:1 -->

This document describes the Rockchip A/B system for Rockchip Android >= 12. Every updatable partition except super has an a and a b copy, substantially increasing storage requirements compared with traditional Recovery updates. Its advantage is seamless updating: while Android is running, the update can proceed according to customer-defined client/server interaction policies and protocols.

<!-- source:cn p4 unit:2 -->

## 2. System configuration

<!-- source:cn p4 unit:3 -->

A/B support is disabled by default on the Rockchip Android platform. To use it, consider Android, U-Boot and kernel DTS configuration as described below.

<!-- source:cn p4 unit:4 -->

### 2.1 Android system configuration

<!-- source:cn p4 unit:5 -->

#### 2.1.1 Android 12 configuration

<!-- source:cn p4 unit:6 -->

Android 12 configuration includes:

<!-- source:cn p4 unit:7-0 -->

1. Enable A/B updates in device\rockchip\rkxxx\BoardConfig.mk. Set BOARD_USES_AB_IMAGE to true; the default is false. Example for rk3326:

<!-- source:cn p4 unit:7-1 -->

```text
vim device/rockchip/rk3326_s/BoardConfig.mk
#AB image definition
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p4 unit:7-2 -->

Note: To enable virtual A/B (not recommended), set both BOARD_USES_AB_IMAGE and BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE to true:

<!-- source:cn p4 unit:7-3 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p4 unit:8 -->

2. Check for recovery.fstab_AB under the corresponding device\rockchip\rkxxx directory. If present, skip this step; otherwise: (1) Add an A/B recovery fstab named recovery.fstab_AB. Compared with fstab.rk30board, add slotselect to A/B partitions (system/vendor/odm/product), add partition nodes exernal_sd, frp, parameter, baseparameter and resource, and change the data mount options. Reference file: device\rockchip\rk3399\rk3399_Android12\recovery.fstab_AB:

<!-- source:cn p5 unit:9 -->

![Chinese-source figure and editable transcription: p5](/docs/rockchip-android-ab-system-upgrading/assets/cn-p005-figure-01.png)

```text
# Android fstab file.
#<src> <mnt_point> <type> <mnt_flags and options> <fs_mgr_flags>
# The filesystem that contains the filesystem checker binary (typically /system) cannot
# specify MF_CHECK, and must come before any filesystems that do specify MF_CHECK
system /system ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
vendor /vendor ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
odm /odm ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
product /product ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
system_ext /system_ext ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
/dev/block/by-name/metadata /metadata ext4 nodev,noatime,nosuid,discard,sync wait,formattable,first_stage_mount
/dev/block/by-name/misc /misc emmc defaults defaults
/dev/block/by-name/cache /cache ext4 noatime,nodiratime,nosuid,nodev,noauto_da_alloc,discard wait,check
/dev/block/mmcblk0p1 /mnt/external_sd vfat /dev/block/mmcblk0 defaults
/dev/block/by-name/frp /frp emmc defaults defaults
/dev/block/by-name/baseparameter /baseparameter emmc defaults defaults
/dev/block/by-name/backup /backup emmc defaults defaults
/dev/block/zram0 none swap defaults zramsize=50%
/dev/block/by-name/userdata /data f2fs defaults defaults
```

<!-- source:cn p5 unit:10 -->

(2) Import the A/B settings in BoardConfig under device\rockchip\rkxxx, including TARGET_RECOVERY_FSTAB pointing to the newly created recovery.fstab_AB.

<!-- source:cn p5 unit:11 -->

```text
device\rockchip\rk3399\rk3399_Android12\BoardConfig.mk：
diff --git a/ rk3399/rk3399_Android12/BoardConfig.mk b/
rk3399/rk3399_Android12/BoardConfig.mk
index 1e78940..159a3b6 100755
--- a/ rk3399/rk3399_Android12/BoardConfig.mk
+++ b/ rk3399/rk3399_Android12/BoardConfig.mk
+# AB image definition
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+
+ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
+    include device/rockchip/common/BoardConfig_AB.mk
+    TARGET_RECOVERY_FSTAB := device/rockchip/
rk3399/rk3399_Android11/recovery.fstab_AB
+endif
```

<!-- source:cn p5 unit:12 -->

#### 2.1.2 Android 13 configuration

<!-- source:cn p5 unit:13 -->

Android 13 configuration includes:

<!-- source:cn p5 unit:14-0 -->

1. Enable A/B updates in device\rockchip\rkxxx\BoardConfig.mk. Set BOARD_USES_AB_IMAGE to true; the default is false. Example for rk3326:

<!-- source:cn p5 unit:14-1 -->

```text
vim device/rockchip/rk3326_s/BoardConfig.mk
#AB image definition
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p5 unit:14-2 -->

Notes: (1) To enable virtual A/B (not recommended because it affects update performance), set BOARD_USES_AB_IMAGE and BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE to true:

<!-- source:cn p5 unit:14-3 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p5 unit:14-4 -->

(2) Compressed virtual A/B is supported starting with Android 13. To enable it (not recommended because it affects update performance), set BOARD_USES_AB_IMAGE, BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE and BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION to true:

<!-- source:cn p6 unit:15-0 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

<!-- source:cn p6 unit:16 -->

2. Check for recovery.fstab_AB under the corresponding device\rockchip\rkxxx directory. If present, skip this step; otherwise: (1) Add an A/B recovery fstab named recovery.fstab_AB. Compared with fstab.rk30board, add slotselect to A/B partitions (system/vendor/odm/product), add partition nodes exernal_sd, frp, parameter, baseparameter and resource, and change the data mount options. Reference file: device\rockchip\rk3399\rk3399_Android12\recovery.fstab_AB:

<!-- source:cn p6 unit:17 -->

![Chinese-source figure and editable transcription: p6](/docs/rockchip-android-ab-system-upgrading/assets/cn-p006-figure-01.png)

```text
# Android fstab file.
#<src> <mnt_point> <type> <mnt_flags and options> <fs_mgr_flags>
# The filesystem that contains the filesystem checker binary (typically /system) cannot
# specify MF_CHECK, and must come before any filesystems that do specify MF_CHECK
system /system ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
vendor /vendor ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
odm /odm ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
product /product ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
system_ext /system_ext ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
/dev/block/by-name/metadata /metadata ext4 nodev,noatime,nosuid,discard,sync wait,formattable,first_stage_mount
/dev/block/by-name/misc /misc emmc defaults defaults
/dev/block/by-name/cache /cache ext4 noatime,nodiratime,nosuid,nodev,noauto_da_alloc,discard wait,check
/dev/block/mmcblk0p1 /mnt/external_sd vfat /dev/block/mmcblk0 defaults
/dev/block/by-name/frp /frp emmc defaults defaults
/dev/block/by-name/baseparameter /baseparameter emmc defaults defaults
/dev/block/by-name/backup /backup emmc defaults defaults
/dev/block/zram0 none swap defaults zramsize=50%
/dev/block/by-name/userdata /data f2fs defaults defaults
```

<!-- source:cn p6 unit:18 -->

(2) Import the A/B settings in BoardConfig under device\rockchip\rkxxx, including TARGET_RECOVERY_FSTAB pointing to the newly created recovery.fstab_AB.

<!-- source:cn p6 unit:19 -->

```text
device\rockchip\rk3399\rk3399_Android12\BoardConfig.mk：
diff --git a/ rk3399/rk3399_Android12/BoardConfig.mk b/
rk3399/rk3399_Android12/BoardConfig.mk
index 1e78940..159a3b6 100755
--- a/ rk3399/rk3399_Android12/BoardConfig.mk
+++ b/ rk3399/rk3399_Android12/BoardConfig.mk
+# AB image definition
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+
+ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
+    include device/rockchip/common/BoardConfig_AB.mk
+    TARGET_RECOVERY_FSTAB := device/rockchip/
rk3399/rk3399_Android11/recovery.fstab_AB
+endif
```

<!-- source:cn p6 unit:20 -->

#### 2.1.3 Android >= 14 configuration

<!-- source:cn p6 unit:21 -->

Android 14 configuration includes:

<!-- source:cn p6 unit:22 -->

1. Enable the corresponding A/B update setting under device\rockchip\. Set BOARD_USES_AB_IMAGE to true; default false. Example:

<!-- source:cn p7 unit:23 -->

```text
diff --git a/rk3588_u/BoardConfig.mk b/rk3588_u/BoardConfig.mk
index e30391c..c7a86ce 100644
--- a/rk3588_u/BoardConfig.mk
+++ b/rk3588_u/BoardConfig.mk
@@ -14,7 +14,10 @@
+
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p7 unit:24-0 -->

Notes: (1) To enable virtual A/B (not recommended because it affects update performance), set BOARD_USES_AB_IMAGE and BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE to true:

<!-- source:cn p7 unit:24-1 -->

```text
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p7 unit:24-2 -->

(2) To enable compressed virtual A/B for GKI builds (not recommended because it affects update performance), set BOARD_USES_AB_IMAGE, BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE and BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION to true:

<!-- source:cn p7 unit:24-3 -->

```text
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

<!-- source:cn p7 unit:25 -->

### 2.2 Kernel DTS configuration

<!-- source:cn p7 unit:26 -->

For Android >= 12, no kernel configuration is required.

<!-- source:cn p7 unit:27 -->

### 2.3 U-Boot configuration

<!-- source:cn p7 unit:28 -->

Add CONFIG_ANDROID_AB=y to the chip-specific U-Boot configuration file. The screenshot below shows an example.

<!-- source:cn p7 unit:29 -->

![Chinese-source figure and editable transcription: p7](/docs/rockchip-android-ab-system-upgrading/assets/cn-p007-figure-01.png)

```text
diff --git a/configs/rk3326_defconfig b/configs/rk3326_defconfig
old mode 100644
new mode 100755
index 0465f23..d4648c
--- a/configs/rk3326_defconfig
+++ b/configs/rk3326_defconfig
@@ -114,3 +114,4 @@ CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
 CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
 CONFIG_TEST_ROCKCHIP=y
+CONFIG_ANDROID_AB=y
```

<!-- source:cn p7 unit:30 -->

### 2.4 Add partitions in the development flashing tool

<!-- source:cn p7 unit:31 -->

Add B-partition download entries and flash the same firmware to each A/B pair. For Android >= 12, following section 3 automatically creates config.cfg under rockdev/xxxx/. Replace the file of the same name in RKDevTool, then reopen RKDevTool; no manual configuration is needed. Example screenshot follows.

<!-- source:cn p8 unit:32 -->

![Chinese-source figure and editable transcription: p8](/docs/rockchip-android-ab-system-upgrading/assets/cn-p008-figure-01.png)

```text
RKDevTool v2.63
Loader Ver:1.18
# Address Name
1 0x00000000 Loader
2 0x00000000 Parameter
3 0x00004000 Uboot_a
4 0x00006000 Uboot_b
5 0x00008000 trust_a
6 0x0000A000 trust_b
7 0x0000C000 Misc
8 0x00028000 Dtbo_a
9 0x0002A000 Dtbo_b
10 0x0002C000 vbmeta_a
11 0x0002C800 vbmeta_b
12 0x0002D000 Boot_a
13 0x0004D000 Boot_b
```

<!-- source:cn p8 unit:33 -->

Note: Chips such as rk3566/rk3568/rk3588 have no trust partition, so trust_a and trust_b are not required.

<!-- source:cn p8 unit:34 -->

## 3. Build the A/B system and OTA package

<!-- source:cn p8 unit:35 -->

Build A/B firmware in exactly the following order. Method 1:

<!-- source:cn p8 unit:36 -->

```text
source build/envsetup.sh
lunch XXX
make installclean –j16  OR make clean -j16
make –j16
make dist –j16
mkimage_ab.sh  ota
```

<!-- source:cn p8 unit:37 -->

Method 2:

<!-- source:cn p8 unit:38 -->

```text
source build/envsetup.sh
lunch XXX
./build.sh -ABUCKuop
```

<!-- source:cn p8 unit:39 -->

Notes:

<!-- source:cn p8 unit:40 -->

1. After enabling A/B, run make clean before the first build.

<!-- source:cn p8 unit:41 -->

2. Delta packages are built in the same way as non-A/B packages. For full and delta build details, see Rockchip_Developer_Guide_Android_Recovery_CN. For A/B OTA verification, see section 4, “Verification (client and server)”.

<!-- source:cn p9 unit:42 -->

## 4. Verification (client and server)

<!-- source:cn p9 unit:43 -->

A seamless update can download and apply the package simultaneously, requiring an HTTP server and update client. Use update_device.py below for verification. Customers must build production clients and servers themselves; Android's update_engine_client is a reference for the client. The update_device.py example demonstrates its use by ultimately invoking update_engine_client over adb. Verification method: update_device.py makes the host an HTTP server through adb and invokes update_engine_client for seamless updating. Run the following command on the host, with working adb and Python environments:

<!-- source:cn p9 unit:44 -->

```text
system/update_engine/scripts/update_device.py {升级包名字}
```

<!-- source:cn p9 unit:45 -->

Example:

<!-- source:cn p9 unit:46 -->

![Chinese-source figure and editable transcription: p9](/docs/rockchip-android-ab-system-upgrading/assets/cn-p009-figure-01.png)

```text
sudo system/update_engine/scripts/update_device.py ~/rk3326_evb-ota-eng.jdy.zip
INFO:root:Running: adb reverse tcp:1234 tcp:37213
INFO:root:Running: adb shell su 0 update_engine_client --update --follow --payload=http://127.0.0.1:1234/payload --offset=5501 --size=451914571
FILE_SIZE=451914571
METADATA_SIZE=59119
USER_AGENT=Dalvik (something, something)
NETWORK_ID=0
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_IDLE (0), 0)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_UPDATE_AVAILABLE (2), 0)
127.0.0.1 - - [17/Jul/2018 17:24:40] "GET /payload HTTP/1.1" 206 -
INFO:root:Serving request for /payload from /home/jdy/rk3326_evb-ota-eng.jdy.zip [5501, 451920072) length: 451914571
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 4.84229e-05)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0100547)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0200611)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0300673)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0400735)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0500798)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0600861)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0700924)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0800987)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0901049)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.100111)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.110118)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.120124)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.13013)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.140137)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.150143)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.160149)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.170155)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.180161)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.190168)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.200174)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.21018)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.220187)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.230193)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.240199)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.250205)
```

<!-- source:cn p10 unit:47 -->

![Chinese-source figure and editable transcription: p10](/docs/rockchip-android-ab-system-upgrading/assets/cn-p010-figure-01.png)

```text
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.230193)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.240199)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.250205)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.260212)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.270218)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.280224)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.290231)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.300237)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.310243)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.320249)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.330256)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.340262)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.350268)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.360275)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.370281)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.380287)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.390293)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.4003)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.410306)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.420312)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.430318)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.440325)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.450331)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.460337)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.470344)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.48035)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.490356)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.500362)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.510369)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.520375)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.530381)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.540388)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.550394)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.5604)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.570406)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.580413)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.590419)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.600425)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.610432)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.620438)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.630444)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.64045)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.650457)
```

<!-- source:cn p10 unit:48 -->

![Chinese-source figure and editable transcription: p10](/docs/rockchip-android-ab-system-upgrading/assets/cn-p010-figure-02.png)

```text
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.780538)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.790545)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.800551)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.810557)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.820563)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.83057)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.840576)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.850582)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.860589)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.870595)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.880601)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.890607)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.900614)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.91062)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.920626)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.930633)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.940639)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.950645)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.960651)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.970658)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.980664)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.99067)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.01)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.03)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.04)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.05)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.08)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.12)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.13)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.14)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.16)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.17)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.19)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.21)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.22)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.23)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.25)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.26)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.27)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.29)
```

<!-- source:cn p11 unit:49 -->

![Chinese-source figure and editable transcription: p11](/docs/rockchip-android-ab-system-upgrading/assets/cn-p011-figure-01.png)

```text
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.53)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.55)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.56)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.58)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.6)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.61)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.62)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.64)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.65)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.66)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.68)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.7)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.71)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.73)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.74)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.75)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.77)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.78)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.79)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.81)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.83)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.84)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.86)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.87)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.88)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.9)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.91)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.92)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.94)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.95)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.96)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.97)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.99)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_UPDATED_NEED_REBOOT (6), 0)
[INFO:update_engine_client_android.cc(98)] onPayloadApplicationComplete(ErrorCode::kSuccess (0))
INFO:root:Running: adb reverse --remove tcp:1234
INFO:root:Server Terminated
jdy@jdy-Latitude-E6440:/media/jdy/LDSecond/rk3326/rk3326_8.X$
```

<!-- source:cn p11 unit:50 -->

The screenshots above show the source's complete update process. Successful completion prints UPDATE_STATUS_UPDATED_NEED_REBOOT. Manually reboot the device at that point to switch to the newly updated system.

<!-- source:cn p11 unit:51 -->

## 5. Important notes

<!-- source:cn p11 unit:52-0 -->

1. When packaging update.img, modify package-file to add the corresponding partitions. For example, trust and uboot are configured below; other partitions follow the same pattern.

<!-- source:cn p11 unit:52-1 -->

```text
trust_a Image/trust.img
trust_b Image/trust.img
uboot_a Image/uboot.img
uboot_b Image/uboot.img
```

<!-- source:cn p11 unit:52-2 -->

Note: Chips such as rk3566/rk3568/rk3588 have no trust partition, so trust_a and trust_b are not required.

<!-- source:cn p11 unit:53 -->

## 6. A/B miniloader OTA

<!-- source:cn p11 unit:54 -->

Miniloader is Rockchip's first-stage bootloader. Normally it neither needs nor is recommended for OTA updating. In exceptional cases, the following method updates miniloader on Rockchip A/B systems. Its OTA package is independent of, and unrelated to, normal A/B update packages. To update miniloader, generate its specific package using section 6.1 and implement the client as in section 6.2. Those commands enter recovery to update the A/B system's miniloader and automatically reboot afterward.

<!-- source:cn p12 unit:55 -->

### 6.1 Build the rkloader update package

<!-- source:cn p12 unit:56 -->

For Android >= 12, after building firmware in OTA mode (source command: make installcelan && make -j16 && make dist -j16 && ./mkimage_ab.sh ota), the automatically generated rockdev/update_loader.zip is the rk loader OTA package.

<!-- source:cn p12 unit:57 -->

### 6.2 Reference update commands

<!-- source:cn p12 unit:58 -->

The update-client APK can implement the following command sequence:

<!-- source:cn p12 unit:59 -->

```text
adb root
adb push update.zip /cache/
adb shell "echo \"--fw_rkloader=/cache/update.zip\" > /cache/recovery/command"
adb reboot recovery
```

{% endraw %}
