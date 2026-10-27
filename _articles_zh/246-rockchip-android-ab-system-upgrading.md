---
title: "Rockchip Android A/B 系统升级指南"
description: "Rockchip Android A/B 系统升级指南 — V1.2.0"
excerpt: "Rockchip Android A/B 系统升级指南"
translation_key: "246-rockchip-android-ab-system-upgrading"
slug: "246-rockchip-android-ab-system-upgrading"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, OTA, AB]
---

{% raw %}

# Rockchip Android A/B 系统升级指南

依据 RK-SM-YF-208 V1.2.012 页中文原稿，完整保留六章技术正文（页 4–12）。适用说明 Android >=12，Android 12/13/>=14 配置及虚拟 AB 建议属于原稿历史 SDK 状态，不是当前兼容性结论。只有中文来源，无英文原图；四语均使用同一中文原稿的 8 幅独立原图，图中文字不伪称已翻译。技术代码与截图配置/可辨识日志均补为可编辑文本。封面法律、联络、受众、修订和重复目录移除。未执行构建、升级、烧写或硬件测试。

原稿疑点：Android 12/13 示例路径仍指 rk3399_Android11；6.1 原写 installcelan，生成 update_loader.zip，但 6.2 推送 update.zip，重命名/选择步骤没有交代。保留这些差异，不猜改。3 节 make 的部分短横原为排版长横，使用前需核对 ASCII 参数；补丁含 PDF 折行，不是可直接应用的验证补丁。正文列的 fstab 分区与截图存在差异（图含 backup/system_ext，未显示全部正文节点）。图中完整可读配置、地址、状态进度转录；被裁切路径、散列等模糊字段以原图为准，不猜补。第 9 页完整文件名/大小可由同图后续日志核对，命令的 headers 散列未可靠辨清，转录不是可执行的完整更新会话。烧写/OTA/引导程序更新可能造成数据丢失或设备不可启动：只在授权测试设备使用，先备份，核实分区和固件匹配并准备恢复方案。miniloader 升级保留原文“不建议”的警告。

<!-- source:cn p2 unit:scope -->

| 芯片名称 | 内核版本 |
| --- | --- |
| <code>RK3326/RK3399/RK356x/RK3588</code> | <code>4.19, 5.10</code> |

<!-- source:cn p4 unit:0 -->

## 1. 概述

<!-- source:cn p4 unit:1 -->

本文档描述了Rockchip A/B系统的使用说明,可以在Rockchip Android >= 12平台上使用。使用该升级方法,所有待升级的分区(除super之外)都有a和b两份,相比传统的Recovery升级方式会大幅增加存储空间需求。其优点是A/B升级是无缝升级,可以在Android系统运行过程中,根据客户定制的客户端和服务器之间的交互策略与协议来完成升级。

<!-- source:cn p4 unit:2 -->

## 2. 系统配置说明

<!-- source:cn p4 unit:3 -->

在Rockchip Android 平台上,AB系统功能默认关闭,要使用AB系统,需要从Android系统、U-BOOT和kernel dts三个方面进行配置。以下对此进行详细说明。

<!-- source:cn p4 unit:4 -->

### 2.1 Android系统配置说明

<!-- source:cn p4 unit:5 -->

#### 2.1.1 Android 12系统配置

<!-- source:cn p4 unit:6 -->

Android 12系统的配置包括:

<!-- source:cn p4 unit:7-0 -->

1.在device\rockchip\rkxxx\BoardConfig.mk中打开AB升级配置项。将BOARD_USES_AB_IMAGE配置设置为true,默认为false.以rk3326为例:

<!-- source:cn p4 unit:7-1 -->

```text
vim device/rockchip/rk3326_s/BoardConfig.mk
#AB image definition
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p4 unit:7-2 -->

注意:如果要开启虚拟AB功能(不建议),则需要同时配置BOARD_USES_AB_IMAGE 和BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE为true,即:

<!-- source:cn p4 unit:7-3 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p4 unit:8 -->

2.在对应的device\rockchip\rkxxx目录下,确认是否已经有recovery.fstab_AB文件,如果已有,则直接跳过这一步;如果没有recovery.fstab_AB文件,则按如下步骤执行:(1)新增针对AB的recovery fstab文件recovery.fstab_AB与对应的fstab.rk30board的主要区别在于AB分区增加slotselect挂载参数(system/vendor/odm/product增加slotselect参数),同时将exernal_sd, frp, parameter, baseparameter, resource的分区节点添加进去,并更改data区的挂载方式选项。一个参考文件如下:device\rockchip\rk3399\rk3399_Android12\recovery.fstab_AB:

<!-- source:cn p5 unit:9 -->

![中文原稿图与可编辑转录: p5](/docs/rockchip-android-ab-system-upgrading/assets/cn-p005-figure-01.png)

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

(2)device\rockchip\rkxxx下的BoardConfig中导入AB配置,包括TARGET_RECOVERY_FSTAB,使其指向刚刚创建的recovery.fstab_AB文件。

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

#### 2.1.2 Android 13系统配置

<!-- source:cn p5 unit:13 -->

Android 13系统的配置包括:

<!-- source:cn p5 unit:14-0 -->

1.在device\rockchip\rkxxx\BoardConfig.mk中打开AB升级配置项。将BOARD_USES_AB_IMAGE配置设置为true,默认为false.以rk3326为例:

<!-- source:cn p5 unit:14-1 -->

```text
vim device/rockchip/rk3326_s/BoardConfig.mk
#AB image definition
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p5 unit:14-2 -->

注意:(1)如果要开启虚拟AB功能(不建议,对升级性能有影响),则需要同时配置BOARD_USES_AB_IMAGE 和BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE为true,即:

<!-- source:cn p5 unit:14-3 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p5 unit:14-4 -->

(2)从Android 13开始支持压缩的虚拟AB功能,如果要开启压缩的虚拟AB功能(不建议,对升级性能有影响),则需要同时配置BOARD_USES_AB_IMAGE 、BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE和BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION为true,即:

<!-- source:cn p6 unit:15-0 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

<!-- source:cn p6 unit:16 -->

2.在对应的device\rockchip\rkxxx目录下,确认是否已经有recovery.fstab_AB文件,如果已有,则直接跳过这一步;如果没有recovery.fstab_AB文件,则按如下步骤执行:(1)新增针对AB的recovery fstab文件recovery.fstab_AB与对应的fstab.rk30board的主要区别在于AB分区增加slotselect挂载参数(system/vendor/odm/product增加slotselect参数),同时将exernal_sd, frp, parameter, baseparameter, resource的分区节点添加进去,并更改data区的挂载方式选项。一个参考文件如下:device\rockchip\rk3399\rk3399_Android12\recovery.fstab_AB:

<!-- source:cn p6 unit:17 -->

![中文原稿图与可编辑转录: p6](/docs/rockchip-android-ab-system-upgrading/assets/cn-p006-figure-01.png)

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

(2)device\rockchip\rkxxx下的BoardConfig中导入AB配置,包括TARGET_RECOVERY_FSTAB,使其指向刚刚创建的recovery.fstab_AB文件。

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

#### 2.1.3 Android >=14系统配置

<!-- source:cn p6 unit:21 -->

Android 14系统的配置包括:

<!-- source:cn p6 unit:22 -->

1.在device\rockchip\下打开对应AB升级配置项。将BOARD_USES_AB_IMAGE配置设置为true,默认为false。如:

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

注意:(1)如果要开启虚拟AB功能(不建议,对升级性能有影响),则需要同时配置BOARD_USES_AB_IMAGE 和BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE为true,即:

<!-- source:cn p7 unit:24-1 -->

```text
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p7 unit:24-2 -->

(2)如果要开启压缩的虚拟AB功能(针对GKI版本,不建议,对升级性能有影响),则需要同时配置BOARD_USES_AB_IMAGE 、BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE和BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION为true,即:

<!-- source:cn p7 unit:24-3 -->

```text
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

<!-- source:cn p7 unit:25 -->

### 2.2 kernel dts配置

<!-- source:cn p7 unit:26 -->

对于Android >=12来说,kernel不需要任何配置。

<!-- source:cn p7 unit:27 -->

### 2.3 uboot配置

<!-- source:cn p7 unit:28 -->

在uboot中,针对具体芯片的配置文件,添加CONFIG_ANDROID_AB=y配置项,参考配置如下截图所示:

<!-- source:cn p7 unit:29 -->

![中文原稿图与可编辑转录: p7](/docs/rockchip-android-ab-system-upgrading/assets/cn-p007-figure-01.png)

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

### 2.4 开发烧写工具增加分区

<!-- source:cn p7 unit:31 -->

下载工具增加B分区的下载项,同时所有AB分区都烧写相同的固件。对于>=Android 12来说,根据“3.AB系统与OTA包编译”指令完成编译后,在rockdev/xxxx/下自动产生config.cfg文件,将该配置文件替换RKDevTool工具下的同名文件,然后再重新打开RKDevTool即可,不需要手动配置。一个烧写工具截图如下:

<!-- source:cn p8 unit:32 -->

![中文原稿图与可编辑转录: p8](/docs/rockchip-android-ab-system-upgrading/assets/cn-p008-figure-01.png)

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

注意,对于rk3566/rk3568/rk3588等芯片来说,没有trust分区,则不需要trust_a和trust_b分区。

<!-- source:cn p8 unit:34 -->

## 3. AB系统与OTA包编译

<!-- source:cn p8 unit:35 -->

编译AB系统固件步骤(务必按如下步骤执行):方法一:

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

方法二:

<!-- source:cn p8 unit:38 -->

```text
source build/envsetup.sh
lunch XXX
./build.sh -ABUCKuop
```

<!-- source:cn p8 unit:39 -->

注意:

<!-- source:cn p8 unit:40 -->

1.开启AB后,第一次需要make clean后再编译。

<!-- source:cn p8 unit:41 -->

2.差异包的编译方法与非AB一致。完整包和差异包的详细编译方法请参考《Rockchip_Developer_Guide_Android_Recovery_CN》,AB OTA升级验证方法请参考本文档第4节“验证方法(客户端与服务器)”中的介绍。

<!-- source:cn p9 unit:42 -->

## 4. 验证方法(客户端与服务器)

<!-- source:cn p9 unit:43 -->

在无缝升级过程中,升级包可以一边下载,一边升级。这时候需要有一个HTTP服务器和一个升级客户端。请使用以下update_device.py验证。至于产品化的升级客户端和升级服务器需要客户自行搭建,升级客户端可以参考Android默认提供的update_engine_client。关于update_engine_client的使用方法请参考如下验证方法update_device.py,该脚本就是通过adb最终调用update_engine_client来实现升级的。验证方法:update_device.pyupdate_device.py脚本通过adb方式,将主机变成HTTP服务器,然后调用update_engine_client来实现无缝升级。使用方法如下:在主机中执行如下命令(请确保该主机adb功能和python环境正常):

<!-- source:cn p9 unit:44 -->

```text
system/update_engine/scripts/update_device.py {升级包名字}
```

<!-- source:cn p9 unit:45 -->

示例如下:

<!-- source:cn p9 unit:46 -->

![中文原稿图与可编辑转录: p9](/docs/rockchip-android-ab-system-upgrading/assets/cn-p009-figure-01.png)

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

![中文原稿图与可编辑转录: p10](/docs/rockchip-android-ab-system-upgrading/assets/cn-p010-figure-01.png)

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

![中文原稿图与可编辑转录: p10](/docs/rockchip-android-ab-system-upgrading/assets/cn-p010-figure-02.png)

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

![中文原稿图与可编辑转录: p11](/docs/rockchip-android-ab-system-upgrading/assets/cn-p011-figure-01.png)

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

上面的截图展示了完整的升级过程,升级成功后,会有UPDATE_STATUS_UPDATED_NEED_REBOOT地打印信息,如上截图所示。此时手动重启设备,就可以切换到新的升级后的系统。

<!-- source:cn p11 unit:51 -->

## 5. 注意事项

<!-- source:cn p11 unit:52-0 -->

1. 打包生成update.img时要注意修改package-file增加对应的分区。比如trust和uboot配置如下,其他分区类似。

<!-- source:cn p11 unit:52-1 -->

```text
trust_a Image/trust.img
trust_b Image/trust.img
uboot_a Image/uboot.img
uboot_b Image/uboot.img
```

<!-- source:cn p11 unit:52-2 -->

注意,对于rk3566/rk3568/rk3588等芯片来说,没有trust分区,则不需要trust_a和trust_b分区。

<!-- source:cn p11 unit:53 -->

## 6. A/B miniloader OTA

<!-- source:cn p11 unit:54 -->

Miniloader是Rockchip平台的一级引导程序,正常情况下该固件不需要进行OTA升级,并且也不建议这么做,在特殊情况下,如果需要对miniloader进行OTA升级,针对Rockchip A/B系统平台,可采用本节介绍的方案来实现。需要注意的是该miniloader OTA升级包与正常的A/B升级包没有任何关系,相互独立。也就是说当有需要升级A/B系统中的miniloader时需按照本节6.1介绍的方法生成对应的miniloader升级包,并且客户端需按照6.2的说明进行开发(在升级miniloader升级包时执行6.2的参考指令后会进入recovery模式升级A/B系统的miniloader,升级完成后自动重启)。

<!-- source:cn p12 unit:55 -->

### 6.1 rkloader升级包构建

<!-- source:cn p12 unit:56 -->

对于>=Android 12来说,以OTA方式完成固件编译后(即make installcelan && make -j16 && make dist -j16 && ./mkimage_ab.sh ota),在rockdev下自动生成的update_loader.zip文件就是rk loader OTA升级包。

<!-- source:cn p12 unit:57 -->

### 6.2 升级命令参考

<!-- source:cn p12 unit:58 -->

升级客户端apk可参考如下命令方式实现:

<!-- source:cn p12 unit:59 -->

```text
adb root
adb push update.zip /cache/
adb shell "echo \"--fw_rkloader=/cache/update.zip\" > /cache/recovery/command"
adb reboot recovery
```

{% endraw %}
