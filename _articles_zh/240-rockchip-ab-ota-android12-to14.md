---
title: "Rockchip A/B OTA：Android 12 升级 Android 14 完整指南"
description: "Rockchip A/B OTA：Android 12 升级 Android 14 完整指南 — A/B, Virtual A/B, BSP, keymaster, userdata"
excerpt: "Rockchip A/B OTA：Android 12 升级 Android 14 完整指南"
translation_key: "240-rockchip-ab-ota-android12-to14"
slug: "240-rockchip-ab-ota-android12-to14"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "A/B"]
---

{% raw %}

# Rockchip A/B OTA：Android 12 升级 Android 14 完整指南

ArmSoM 平台参考。依据中文原稿 RK-KF-YF-795 V1.0.0，产品表原列 RK3326/RK3399/RK356x/RK3588，内核 6.1/5.10/4.9。保留原版本值，不推定所有芯片/内核组合或 ArmSoM 板卡均支持。必须核对具体 Android BSP、lunch 项、A/B模式、分区和加密配置；未进行硬件验证。

本文涉及刷写与安全配置，须在授权开发设备上备份后验证；userdebug/SELinux配置仅为原文调试参考，不代表生产安全建议。未执行命令或下载补丁。

| 原稿芯片名称 | 原稿内核版本 |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 6.1, 5.10, 4.9 |

## 1. 概述

本文档描述 Rockchip Android 12.0 A/B 系统通过 OTA 升级到 Android 14.0 A/B 系统。

## 2. Android 14.0补丁

根据如下说明,在Android 14.0 SDK上面打如下对应补丁。如下说明中提到的所有补丁都可以从如下百度网盘获取,解压密码为: rk12to14JDY39链接:https://pan.baidu.com/s/1IIvpiRiy6dTJ6R6Uf2ZSrQ提取码:vgp7

### 2.1 RK3588

(1)device/rockchip/common打补丁jdy_device_rockchip_common_device.diff和jdy_device_rockchip_common_manifests.diff(2)build/make下打补丁jdy_build_make.diff(3)对于RK3588来说,需要注意的是Android 14 SDK默认开启了FRP,为了与Android 12一致(Android 12默认没有开启FRP),需要关闭FRP。注意:以对应Android 12项目的具体配置为准。

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

如果需要关闭FRP,则需要在packages/apps/Settings下面打补丁jdy_packages_apps_Settings.diff

（4）在 `device/rockchip/rk3588` 开启对应 A/B 配置，必须与原 Android 12 项目一致。原文参考配置：

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.2 RK356X

(1)device/rockchip/common打补丁jdy_device_rockchip_common_device.diff和jdy_device_rockchip_common_manifests.diff(2)build/make下打补丁jdy_build_make.diff(3)如果是rk3568,在device/rockchip/rk356x下打补丁0001-Add-rk3568_s.patch。

如果是 rk3566，在 device/rockchip/rk356x 下打补丁 0002-Add-rk3566_s.patch。

如果是rk3566 Go版本,在device/rockchip/rk356x下打补丁0003-Add-rk3566_sgo.patch。然后在device/rockchip/rk356x下的device/rockchip/rk356x/AndroidProducts.mk添加对应的配置,以rk3568为例,参考配置如下:

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

（4）原文此处写 Android 13 SDK 默认开启 FRP，为了与 Android 12（默认未开启）一致需关闭，具体以原 Android 12 项目为准。在 device/rockchip/rk356x/XXX 的 BoardConfig.mk 配置 BUILD_WITH_GOOGLE_FRP := false。这里“Android 13”与全文 Android 14 目标不一致，原文差异保留待核对。

```text
+BUILD_WITH_GOOGLE_FRP := false
```

如果需要关闭FRP,则需要在packages/apps/Settings下面打补丁jdy_packages_apps_Settings.diff

（5）在 `device/rockchip/rk356x/XXX` 开启对应 A/B 配置，必须与原 Android 12 项目一致。原文参考配置：

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.3 其它芯片(如RK3399)

(1)device/rockchip/common打补丁jdy_device_rockchip_common_device.diff和jdy_device_rockchip_common_manifests.diff(2)build/make下打补丁jdy_build_make.diff(3)从Android 12 SDK上将对应的Android 12项目的lunch项拷贝到Android 14 SDK。如rk3399_Android12, rk3568_s或者rk3588_s等。(4)需要注意的是Android 14 SDK默认开启了FRP,为了与Android 12一致(Android 12默认没有开启FRP),需要关闭FRP。注意:以对应Android 12项目的具体配置为准。关闭FRP的参考配置如下:

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

如果需要关闭FRP,则需要在packages/apps/Settings下面打补丁jdy_packages_apps_Settings.diff

（4）在 `device/rockchip/rk3588` 开启对应 A/B 配置，必须与原 Android 12 项目一致。原文参考配置：

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

## 3. Android 12.0升级到Android 14.0

在Rockchip Android 14.0平台上,按如下方式操作产生对应的OTA升级包,然后将该升级包放置在Rockchip Android 12.0设备上,进行正常的OTA升级即可。升级前请仔细阅读 “3.注意事项”。

1. 选择12.0系统升级到14.0系统的对应lunch项,如rk3568_s或者rk3588_s等通常对应的lunch项目目录可以直接从Android 12 SDK上拷贝过来。

2. 正常编译系统：编译 uboot、kernel 并执行 lunch 后，使用以下原文命令。

```text
make clean && make –j32 && make dist -j32 && ./mkimage_ab.sh ota
```

3. 取出第2步编译出来的升级包,命名为update.zip

4. 将对应的update.zip放置在Android 12设备上升级即可。

注意:(1)如果当前设备的Android 12.0系统是通过Android 11.0系统升级而来的(通过《Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android12_CN》),在此基础上如果要将该Android 12.0系统进一步升级到Android 14.0系统,则操作方法与《Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android14_CN》相同,即在14.0系统上选择对应11.0的lunch项(如rk3399_Android11等),正常编译系统,将编译出来的upddate.zip放入该Android 12.0设备上升级即可。

## 4. 注意事项

1.验证调试时各Android平台(如Android12.0/Android14.0)请使用userdebug版本,并且设置BOARD_SELINUX_ENFORCING := false。

2.OTA升级前确保parameter文件分区表必须一致。比如从Android 12.0升级到Android 14.0,需确保编译出来的14.0固件使用的parameter与12.0一致。

3.OTA升级前确保fstab(如fstab.rk30board)中data区的文件系统、加密方式必须一致。比如从Android12.0升级到Android 14.0,需确保编译出来的14.0固件使用的data区文件系统、加密方式与12.0一致。

4.OTA升级前需确保编译出来的固件本身必须是正常的。比如从Android 12.0升级到Android 14.0,需确保编译出来的14.0固件通过工具(如RKDevTool)烧写到设备后必须能正常启动,并且各方面功能正常。

5. data 区与 keymaster

a\ 首先按照上面“3.Android 12.0升级到Android 14.0”中的说明进行操作,如果升级完成后,系统可以正常进入Android主界面,则忽略下面的b点说明;如果升级完成后,无法正常进入Android主界面,则按照如下b点说明操作。b\ 从如下网盘链接中的userdata_patches目录获取对应补丁,然后打在Android 14 SDK中的对应仓库。关于补丁的具体使用方法,请参考userdata_patches目录下的README.txt文件。链接:https://pan.baidu.com/s/1kugy2rNZWu9w-aAG6qlRtA提取码:jset注意:补丁只适用于从旧的Android 12设备升级到Android 14设备的项目使用,如果是开发Android 14的新设备则不能使用这部分补丁。

## 校对与来源

无对应英文PDF，英俄德为中文全文翻译。原稿无技术插图；产品表信息保留于开头。非技术封面、读者对象及修订表已移除。原文命令 `–j32` 使用 U+2013，保留而不静默改写，运行前核对。`upddate.zip` 与 `update.zip` 不一致；本文明确标注。网盘与口令来自原稿，未验证有效性。

第2.2节写 Android 13 默认FRP，与Android14主题冲突；第2.3仍用rk3588路径且两次编号（4）；原交叉引用“3.注意事项”实际指第4章。保留并注明这些疑点，不推定rk3399能原样使用rk3588配置。产品表4.9不擅改为4.19。本A/B稿没有非AB稿的自动擦除data补丁，未混入。

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
