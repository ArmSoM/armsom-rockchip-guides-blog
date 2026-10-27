---
title: "Rockchip Android Recovery Developer Guide"
description: "Rockchip Android Recovery Developer Guide — OTA, update.img, rkLoader, RKUpdateService, V1.2.0"
excerpt: "Rockchip Android Recovery Developer Guide"
translation_key: "248-rockchip-android-recovery"
slug: "248-rockchip-android-recovery"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "Recovery", "OTA"]
---

{% raw %}

# Rockchip Android Recovery Developer Guide

ArmSoM platform reference. Source RK-YH-YF-209 V1.2.0 targets Rockchip Android >= 12, mainly non-AB systems. Its product table lists RK3326/RK3399/RK356x/RK3588 and kernels 4.19/5.10; the body also adds Android 14 delta-package commands. No common BSP tag is specified, so support for every ArmSoM board is not implied. Verify the target Android BSP, partitions, bootloader, signing keys and kernel configuration before adaptation. No hardware validation was performed. Flashing, factory reset and update-media creation may erase data: back up and confirm the target. None of these commands was executed here.

| Chips listed in source | Kernel versions listed in source |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 4.19, 5.10 |

## 1. Overview

This guide describes Rockchip Recovery for Rockchip Android >= 12. Recovery mode can modify internal device data or the system: install a new Android system, back up or update the existing system, or restore factory settings. This guide primarily covers non-AB systems. For AB systems, see Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN.

## 2. Building OTA packages

AB functionality is disabled by default on the source Rockchip Android platform. Enabling it requires configuration in Android, U-BOOT and the kernel DTS; see Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN. The following primarily concerns non-AB systems.

### 2.1 OTA introduction

OTA (Over The Air) is the standard Android software-update mechanism. It supports full updates (complete packages) and incremental updates (delta packages), applied locally or over the network.

### 2.2 Creating a full package

OTA (Over The Air) is the standard Android software-update mechanism. It supports full updates (complete packages) and incremental updates (delta packages), applied locally or over the network. Build commands: 

```text
非AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage.sh ota
AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage_ab.sh ota
```

Alternatively:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

The full OTA package rkxxxx-ota-eng.root.zip is generated under out/target/product/rkxxxx/. Rename it update.zip and copy it to a T card or internal flash for updating. Each Android platform can also use build.sh; include the -o option, as in the source example build.sh –AUCKuop.

Release firmware must use ./mkimage.sh ota to package boot and kernel together; kernel then need not be flashed separately. Separately packaged production firmware affects subsequent delta updates, unless delta updating is not required. When packaging update.img with ./build.sh, use ./build.sh -ou, not merely ./build.sh -u.

### 2.3 Creating a delta package

A delta OTA package contains only differences and is therefore smaller. It is mainly used for online OTA, but also supports local T-card updates. It requires a special manual build process:

(1) Release firmware v1 and create its full package using:

```text
非AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage.sh ota
AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage_ab.sh ota
```

Alternatively:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

(2) Save out/target/product/rkxxxx/obj/PACKAGING/target_files_intermediates/rkxxx-target_files-eng.xxx.zip as rkxxxx-target_files-v1.zip, the base target-files package for v1. Flash the device with the firmware generated under rockdev in step 1; this is essential.

(3) Modify kernel or Android code, release v2 and create its full package using:

```text
make installclean && make -j16 && make otapackage -j16
```

Alternatively:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

(4) Save out/target/product/rkxxxx/obj/PACKAGING/target_files_intermediates/rkxxx-target_files-eng.xxx.zip as rkxxxx-target_files-v2.zip, the base package for v2.

(5) Generate the v1-to-v2 delta package, for example:

```text
./build/tools/releasetools/ota_from_target_files -v -i ./rockdev/v1/rk3588_t-target_files-eng.jdy.zip --block -p ./out/host/linux-x86  ./rockdev/v2/rk3588_t-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

Android 13 requires python3:

```text
python3 ./build/tools/releasetools/ota_from_target_files -v -i ./rockdev/v1/rk3588_t-target_files-eng.jdy.zip --block -p ./out/host/linux-x86 ./rockdev/v2/rk3588_t-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

For Android >= 14:

```text
out/host/linux-x86/bin/ota_from_target_files -v -i ./rockdev/V1/rk3588_u-target_files-eng.jdy.zip  --block -p ./out/host/linux-x86 ./rockdev/V2/rk3588_u-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

Delta-package command syntax:

- ota_from_target_files: package generator.
- -v -i: the earlier target file used for comparison.
- --block: block-based OTA updating.
- -p: host build environment.
- -k: packaging key. Android 13 defaults to device/rockchip/common/security/testkey; other Android platforms default to build/make/target/product/security/testkey.
- Next positional argument: the newer target file.
- Final positional argument: the output OTA delta package.

### 2.4 Important notes

The full update package and the target-files package are different. Delta packages compare the target-files packages of two versions. Therefore, every firmware release must retain its target-files package under obj, its full update package, and all images generated by ./mkimage.sh ota.

## 3. Updating rkLoader

OTA normally does not require an rkloader update. If needed, place the loader to update (the miniloader used by the flashing tool) as RKLoader.bin in $(TARGET_DEVICE_DIR)/ota/loader. OTA packaging will include it. To determine $(TARGET_DEVICE_DIR), run source build/envsetup.sh and lunch XXX in the SDK root, then get_build_var TARGET_DEVICE_DIR.

## 4. Updating update.img directly in Recovery

Normally update.img is flashed by a tool. To install it within Recovery, call the Rockchip recovery do_rk_mode_update interface at the appropriate point in your application logic. For an update.img on USB storage, first ensure the USB device is mounted, either yourself or through:

```text
prksdboot->ensure_usb_mounted();
```

Example use of do_rk_mode_update, assuming update.img is on USB storage:

```text
+ auto ui = device->GetUI();
+ InstallResult result = INSTALL_SUCCESS;

+ prksdboot->sdboot_set_bSDBoot(false);
+ prksdboot->sdboot_set_bUsbBoot(true);
+ /*FileName是相对于U盘根目录的路径，比如update.img位于U盘根目录abc子目录下，则设置
FileName为“/abc/update.img”即可*/
+ result = (InstallResult)do_rk_mode_update(FileName, prksdboot, ui);
```

## 5. Configuration

### 5.1 Log redirection

1. Logs can be written to three destinations: the serial port, SD card and /cache/recovery/.

2. Configure bootable/recovery/Android.bp:

- -DLogToSerial: output to the serial port.
- -DLogToCache: write under /cache/recovery/.
- -DLogToSDCard: write recovery.log on the SD card.

### 5.2 Screen rotation

1. Recovery supports rotations of 0°, 90°, 180° and 270°.

2. Edit device/rockchip/XXXX/BoardConfig.mk. Choose one assignment:

- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_NONE — no rotation.
- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_LEFT — 270°.
- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_RIGHT — 90°.
- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_DOWN — 180°.

### 5.3 Preserving files

The source states that files saved as /cache/recovery/Recovery_* are not removed by formatting.

### 5.4 Updating from NTFS USB/SD media

The source states that NTFS is unsupported by default because of intellectual-property issues and instructs users to obtain the relevant authorization before using it. The default kernel cannot mount NTFS USB storage, so Recovery cannot use it. To add support, enable the corresponding kernel configuration.

## 6. Update procedure

Rockchip supplies RKUpdateService as the default update client for platform validation. Follow the steps below. For AB systems, instead follow Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN.

1. Build an OTA package as in section 2 and rename it update.zip.

2. Copy update.zip to the root of USB/SD storage or to /data/media/0/.

3. The package is detected automatically and an update dialog appears. If not detected, reconnect the USB cable or restart.

4. The device restarts into Recovery and installs the OTA package automatically. After completion it restarts into the Android home screen.

## 7. Update media

### 7.1 SD update card

Use SDDiskTool to create an update card from production firmware update.img. Select the firmware-upgrade function, select the matching update.img, click Start creation and wait. Insert the finished card into the corresponding device slot and power-cycle. For AB systems, set UPGRADE_PROGRAM_PARTITION=boot_b in the SDDiskTool config before creation, then reopen SDDiskTool.

### 7.2 USB update drive

To use USB update media, first enable CONFIG_ROCKCHIP_USB_BOOT in U-Boot, rebuild U-Boot and flash that configured U-Boot to the device. Then create the update drive using the fully built update.img. Example U-Boot configuration for rk3588:

```text
diff --git a/configs/rk3588_defconfig b/configs/rk3588_defconfig
index 67a8c357f0..be47518735 100644
--- a/configs/rk3588_defconfig
+++ b/configs/rk3588_defconfig
@@ -234,3 +234,4 @@ CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
 CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_ROCKCHIP_USB_BOOT=y
```

Use SDDiskTool to turn production update.img into a USB update drive. Select firmware upgrade, choose the matching update.img, click Start creation and wait. Insert the finished drive into the corresponding hardware port and power-cycle. For AB systems, set UPGRADE_PROGRAM_PARTITION=boot_b in the SDDiskTool config before creation and reopen SDDiskTool.

## Source and editorial checks

Only the 9-page Chinese Rockchip_Developer_Guide_Android_Recovery_CN.pdf was supplied. The body is pages 4–8; page 9 is blank. English, Russian and German are full translations, not separate source editions. There are no technical figures to extract. All chip and kernel values from the product table are preserved in the applicability statement.

- The source command `build.sh –AUCKuop` contains U+2013, not an ASCII hyphen. It is retained literally; pasting it may fail in a shell. Check the actual script options rather than silently changing the source command.
- Visual PDF wraps in long OTA commands are joined into one line, preserving literal hyphens in `rk3588_t-target_files` and `rk3588_u-target_files`, lowercase `v1/v2` and uppercase `V1/V2`.
- The do_rk_mode_update example retains diff `+` prefixes and the Chinese code comment. That comment defines FileName relative to the USB root, for example `/abc/update.img`. This is a patch fragment, not a complete executable source file.
- The source groups `-v -i` without separate explanations. Default testkey paths are development examples, not production-key recommendations.
- The claim about preserving `/cache/recovery/Recovery_*` describes the source Recovery implementation, not every formatting or erase operation. Keep an external backup.
- NTFS authorization and default support statements are historical source statements, not a current legal assessment. Check the actual BSP and applicable authorization.
- Cover date/classification, legal/contact sections, audience and revision table are removed; technical version, applicability and all seven chapters remain. The repeated OTA introduction is present in the source and retained.


Official references: [Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab).

{% endraw %}
