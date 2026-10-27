---
title: "Rockchip Android Recovery 完整开发指南"
description: "Rockchip Android Recovery 完整开发指南 — OTA, update.img, rkLoader, RKUpdateService, V1.2.0"
excerpt: "Rockchip Android Recovery 完整开发指南"
translation_key: "248-rockchip-android-recovery"
slug: "248-rockchip-android-recovery"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "Recovery", "OTA"]
---

{% raw %}

# Rockchip Android Recovery 完整开发指南

ArmSoM 平台参考。原稿 RK-YH-YF-209 V1.2.0 面向 Rockchip Android >= 12，主要为非 AB 系统；产品版本表列 RK3326/RK3399/RK356x/RK3588、内核 4.19/5.10，并在正文补充 Android 14 的差异包命令。没有给出统一 BSP 标签，不能据此宣称任意 ArmSoM 板卡均可使用。核对目标板 Android BSP、分区、bootloader、签名密钥和内核配置后再适配。未进行硬件验证。以下刷写、恢复出厂及制作升级介质操作可能清除数据，需备份并确认目标设备；本次没有执行这些命令。

| 原稿芯片名称 | 原稿内核版本 |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 4.19, 5.10 |

## 1. 概述

本文档描述了Rockchip Recovery系统的使用说明,可以在Rockchip Android >= 12平台上使用。Recovery模式指的是一种可以对安卓机内部的数据或系统进行修改的模式。在这个模式下我们可以刷入新的安卓系统,或者对已有的系统进行备份或升级,也可以在此恢复出厂设置。本文档主要针对非AB系统,对于AB系统请参考文档《Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN》。

## 2. 编译OTA包

在Rockchip Android 平台上,AB系统功能默认关闭,要使用AB系统,需要从Android系统、U-BOOT和kernel dts三个方面进行配置,具体请参考文档《Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN》,本文档主要针对非AB系统进行说明。

### 2.1 OTA介绍

OTA (Over The Air)升级是Android 系统提供的标准软件升级方式。它功能强大,提供了完全升级(完整包)、增量升级模式(差异包),可以通过本地升级,也可以通过网络升级。

### 2.2 生成完整包

OTA (Over The Air)升级是Android 系统提供的标准软件升级方式。它功能强大,提供了完全升级(完整包)、增量升级模式(差异包),可以通过本地升级,也可以通过网络升级。编译命令如下:

```text
非AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage.sh ota
AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage_ab.sh ota
```

或者如下:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

在out/target/product/rkxxxx/目录下会生成ota完整包rkxxxx-ota-eng.root.zip,改成update.zip即可拷贝到T卡或者内置的flash进行升级。此外各个Android平台,都可以使用build.sh编译,当使用build.sh时需要带-o选项,如build.sh –AUCKuop。

发布固件必须使用./mkimage.sh ota,将boot与kernel打包,不需要单独烧kernel,如果量产固件是分开的,将会影响后面差异包升级,除非你不需要用差异升级。如果使用./build.sh来打包update.img,必须使用 ./build.sh -ou,不能仅仅使用 ./build.sh -u。

### 2.3 生成差异包

OTA差异包只有差异内容,包大小比较小,主要用于OTA在线升级,也可T卡本地升级。OTA差异包制作需要特殊的编译进行手动制作。步骤如下:(1)首先发布v1版本的固件,生成v1版本的完整包。编译命令如下:

```text
非AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage.sh ota
AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage_ab.sh ota
```

或者

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

(2)保存out/target/product/rkxxxx/obj/PACKAGING/target_files_intermediates/rkxxx-target_files-eng.xxx.zip 为rkxxxx-target_files-v1.zip,作为v1版本的基础素材包。同时设备烧写第1步编译后rockdev下的固件(切记这一点非常重要)。(3)修改kernel代码或者android 代码,发布v2版本固件,生成v2版本完整包。编译命令如下:

```text
make installclean && make -j16 && make otapackage -j16
```

或者

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

(4)保存out/target/product/rkxxxx/obj/PACKAGING/target_files_intermediates/rkxxx-target_files-eng.xxx.zip 为rkxxxx-target_files-v2.zip,作为v2版本的基础素材包。(5)生成v1-v2的差异升级包。参考命令如下:

```text
./build/tools/releasetools/ota_from_target_files -v -i ./rockdev/v1/rk3588_t-target_files-eng.jdy.zip --block -p ./out/host/linux-x86  ./rockdev/v2/rk3588_t-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

对于Android 13,必须使用python3,参考命令如下:

```text
python3 ./build/tools/releasetools/ota_from_target_files -v -i ./rockdev/v1/rk3588_t-target_files-eng.jdy.zip --block -p ./out/host/linux-x86 ./rockdev/v2/rk3588_t-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

对于>=Android 14,参考命令如下:

```text
out/host/linux-x86/bin/ota_from_target_files -v -i ./rockdev/V1/rk3588_u-target_files-eng.jdy.zip  --block -p ./out/host/linux-x86 ./rockdev/V2/rk3588_u-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

生成差异包的命令格式：

- `ota_from_target_files`：生成工具。
- `-v -i`：用于比较的前一个 target file。
- `--block`：使用 block 方式进行 OTA 升级。
- `-p`：host 主机编译环境。
- `-k`：打包密钥。Android 13 默认路径为 `device/rockchip/common/security/testkey`，其他 Android 平台为 `build/make/target/product/security/testkey`。
- 后一个 target file：用于比较的新版本素材包。
- 最后一个参数：输出的 OTA 差异包。

### 2.4 注意事项

完整包和素材包是不一样的。从生成差异包的方法可以知道,差异包是两个版本的素材包做差异生成,所以每发布一个版本固件必须保存obj下的素材包以及升级的完整包和./mkimage.sh ota 生成的各个image。

## 3. rkLoader升级

正常情况下OTA升级时不需要升级rkloader,当需要升级rkloader时,将需要升级的loader(即用于烧写工具烧录时使用的miniloader),以RKLoader.bin格式放到$(TARGET_DEVICE_DIR)/ota/loader目录下,OTA 打包时就会加入到升级包中。对于$(TARGET_DEVICE_DIR)的具体取值,可以在SDK根目录下source build/envsetup.sh和lunch XXX之后,通过get_build_var TARGET_DEVICE_DIR来确认。

## 4. Recovery中直接升级update.img

正常情况下update.img只用于工具烧录,如果要在Recovery里面升级update.img只要按照客户自己的应用逻辑在适当的位置调用RK recovery中的do_rk_mode_update接口即可。以U盘升级update.img为例,调用接口之前,首先确保U盘已经挂载,可以自行挂载,也可以直接调用如下接口:

```text
prksdboot->ensure_usb_mounted();
```

do_rk_mode_update接口的参考使用方式如下(假设update.img位于U盘):

```text
+ auto ui = device->GetUI();
+ InstallResult result = INSTALL_SUCCESS;

+ prksdboot->sdboot_set_bSDBoot(false);
+ prksdboot->sdboot_set_bUsbBoot(true);
+ /*FileName是相对于U盘根目录的路径，比如update.img位于U盘根目录abc子目录下，则设置
FileName为“/abc/update.img”即可*/
+ result = (InstallResult)do_rk_mode_update(FileName, prksdboot, ui);
```

## 5. 配置说明

### 5.1 Log 重定向

1. 功能说明:Log 可以输出到串口、SD卡、/cache/recovery/、三个地方。

2. 打开方式：在 `bootable/recovery/Android.bp` 中配置：

- `-DLogToSerial`：日志输出到串口。
- `-DLogToCache`：日志输出到 `/cache/recovery/`。
- `-DLogToSDCard`：日志输出到 SD 卡中的 `recovery.log`。

### 5.2 屏幕旋转

1. 功能说明:Recovery 屏幕可以旋转0°,90°,180°,270°。

2. 修改 `device/rockchip/XXXX/BoardConfig.mk`，按需选择一个赋值：

- `TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_NONE`：不旋转。
- `TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_LEFT`：旋转 270°。
- `TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_RIGHT`：旋转 90°。
- `TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_DOWN`：旋转 180°。

### 5.3 文件保存

将文件保存到/cache/recovery/Recovery_*,格式化不会清除该文件。

### 5.4 NTFS 格式U盘/SD卡升级支持

NTFS文件系统目前存在知识产权问题,默认不支持。如果要使用NTFS,确保获得相关权利方授权后再使用。kernel默认不支持NTFS格式U盘的挂载,所以recovery中无法支持。如需支持NTFS,只需要打开kernel中的相应配置即可。

## 6. 升级步骤

对于验证RK平台来说,RK默认提供升级客户端RKUpdateService来验证,操作步骤如下。注意,如果是AB系统,请参考《Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN》来验证。

1.参照“2.编译OTA包”,生成OTA包,并重新命名为update.zip

2.将update.zip拷贝到USB、SD卡根目录,或/data/media/0/ 目录下

3.会自动检测升级包,并弹出升级对话框。如果没有自动检测到,建议插拔下USB线或者直接重启下。

4.自动重启升级:重启进入Recovery系统中自动完成OTA包的升级,等待升级完成会自动重启到Android主界面。

## 7. 升级卡

### 7.1 SD升级卡

可以使用SDDiskTool工具来将量产固件update.img做成升级卡来使用。使用SDDiskTool工具时,功能模式中选择“固件升级”,然后选择对应的升级固件update.img,最后点击“开始创建”,然后等待制卡完成。升级卡制作完成后,插入设备对应硬件接口,然后重新上电即可。对于AB系统来说,制卡之前需要将SDDiskTool工具的config里面配置UPGRADE_PROGRAM_PARTITION=boot_b,然后重新打开SDDiskTool进行制卡

### 7.2 USB升级盘

如果要使用USB来制作升级盘,首先需要在u-boot中打开CONFIG_ROCKCHIP_USB_BOOT配置,然后重新编译u-boot,并且将具有该配置的u-boot烧录到设备中,最后再使用完整编译的update.img来制作升级盘。以rk3588为例,u-boot参考配置如下:

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

可以使用SDDiskTool工具来将量产固件update.img做成升级盘来使用。使用SDDiskTool工具时,功能模式中选择“固件升级”,然后选择对应的升级固件update.img,最后点击“开始创建”,然后等待制盘完成。升级盘制作完成后,插入设备对应硬件接口,然后重新上电即可。对于AB系统来说,制卡之前需要将SDDiskTool工具的config里面配置UPGRADE_PROGRAM_PARTITION=boot_b,然后重新打开SDDiskTool进行制卡。

## 来源与校对说明

仅提供中文 `Rockchip_Developer_Guide_Android_Recovery_CN.pdf`，9 页；正文为第4–8页，第9页空白。英俄德为全文翻译，没有独立英文稿。原稿无技术配图，不制造配图；产品版本表的全部芯片与内核值已保留在适用说明。

- 原稿 `build.sh –AUCKuop` 使用 U+2013 长短横线，代码原样保留；直接复制可能不被 shell 识别，应核对实际脚本选项，不在原始命令中静默替换。
- OTA 长命令的 PDF 视觉断行已接成单行；保留 `rk3588_t-target_files`、`rk3588_u-target_files`、小写 `v1/v2` 与大写 `V1/V2`。前者是路径中字面的连字符，不能在合行时丢失。
- `do_rk_mode_update` 示例保留 diff 的 `+` 和中文代码注释；注释说明 FileName 相对 USB 根目录，例如 `/abc/update.img`，不是直接可执行的完整源文件。
- 参数说明将 `-v -i` 合写，未分别解释；原稿 testkey 路径只是默认开发示例，不代表生产密钥建议。
- “格式化不清除 `/cache/recovery/Recovery_*`”是原稿特定 Recovery 行为描述，不能解释为任意格式化或擦除均保留；操作前仍需外部备份。
- NTFS 授权与默认内核支持的说明来自该历史原稿，不是对当前许可状态的法律判断；须按实际 BSP 和适用授权核对。
- 移除封面日期、密级、免责声明、商标版权段落、联系信息、读者对象、修订表；保留技术版本、兼容范围与全部七章。重复 OTA 概述属于原文，保留。


官方参考: [Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab).

{% endraw %}
