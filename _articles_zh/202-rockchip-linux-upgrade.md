---
title: "Rockchip Linux updateEngine 升级方案完整指南"
description: "Rockchip Linux updateEngine 升级方案完整指南 — V1.2.0"
excerpt: "Rockchip Linux updateEngine 升级方案完整指南"
translation_key: "202-rockchip-linux-upgrade"
slug: "202-rockchip-linux-upgrade"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Recovery, OTA, updateEngine]
---

{% raw %}

# Rockchip Linux updateEngine 升级方案完整指南

依据 RK-KF-YF-348 V1.2.0（2023-03-06）中英文原稿，中文为基线。原稿适用表为 RK3308/Linux 4.4、RV1126/RV1109/Linux 4.19；保留全部八章、分区/结构/参数表、代码及流程图。本文为 ArmSoM 平台参考，须核对具体板卡、SDK、分区布局及引导链；未执行升级或硬件测试。固件烧写、SD 制卡和 wipe_userdata 会覆盖或清除数据，必须备份并确认目标。原稿关于掉电恢复与 A/B 回退的描述不构成任意设备上绝不损坏的保证。

## 1. 简介以及代码

### 1.1 简介

Rockchip Linux 平台支持两种启动方案,Recovery 模式和Linux A/B 模式:

1. Recovery 模式,设备上有一个单独的分区(recovery)用于升级操作。

2. Linux A/B 模式,设备上有两套固件,可切换使用。这两种启动模式各有优缺点,用戶根据需求选择使用。

### 1.2 代码

Rockchip Linux 平台有两套升级方案代码。

| 升级方案 | 代码路径 | 是否支持 Recovery 启动模式升 级 | 是否 支持 A/B 启动 模式 升级 | 简介 |
| --- | --- | --- | --- | --- |
| updateEngine | external/recovery/update_engine external/recovery | 支持 | 支持 | RV1126/RV1109平 台使用 |
| rkupdate | external/rkupdate | 支持 | 不支 持 | 其它平台使用,本文 档不作介绍 |

## 2. Recovery 模式

### 2.1 概述

Recovery 模式是在设备上多一个Recovery分区,该分区由kernel+resource+ramdisk 组成,主要用于升级操作。u-boot会根据misc分区(详⻅misc 分区章节)存放的字段来判断将要引导的系统是Normal 系统还是Recovery 系统。由于系统的独立性,所以Recovery模式能保证升级的完整性,即升级过程被中断,如异常掉电,升级仍然能继续执行。优点:

1. 能保证升级的完整性缺点:

1. 系统多了一个分区,该分区仅用于升级

2. 升级过程必须重启进入recovery模式,不能在Normal系统直接进行升级

分区简介:

| 分区名 | 镜像名 | 简介 |
| --- | --- | --- |
| loader | MiniLoaderAll.bin | 一级loader |
| u-boot | uboot.img | 二级loader |
| trust | trust.img | 安全环境,如OP-TEE、ATF (有些平台上会把trust和uboot合并) |
| misc | misc.img | 引导参数分区 |
| recovery | recovery.img | kernel+dtb+ramdisk 组成的根文件系统 |
| boot | boot.img | kernel+dtb |
| rootfs | rootfs.img | 根文件系统,只读 |
| oem | oem.img | 厂商预制,可读写 |
| userdata | userdata.img | 用于数据,可读写 |

### 2.2 配置和编译

Buildroot:recovery 配置文件选择如下(make menuconfig)

```text
BR2_PACKAGE_RECOVERY=y  #开启升级相关功能
BR2_PACKAGE_RECOVERY_USE_UPDATEENGINE=y #使⽤新升级程序，不配置则默认使⽤原有升级流程
BR2_PACKAGE_RECOVERY_RECOVERYBIN=y  #开启recovery bin ⽂件
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y #编译新升级程序
BR2_PACKAGE_RECOVERY_NO_UI=y # 关掉UI
```

Buildroot:rootfs 配置文件选择如下(make menuconfig)

```text
BR2_PACKAGE_RECOVERY=y #开启升级相关功能
BR2_PACKAGE_RECOVERY_USE_UPDATEENGINE=y #使⽤新升级程序
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y  #编译新升级程序
BR2_PACKAGE_RECOVERY_NO_UI=y # 关掉UI
```

带屏与不带屏目前只有RK3308使用不带屏的recovery,如有其它要让recovery不显示界面,在文件buildroot/package/rockchip/recovery/recovery.mk做如下配置即可:

```text
TARGET_MAKE_ENV += RecoveryNoUi=true
```

SDK默认会开启以上配置,用戶无需再次配置。源码目录位于external/recovery/,若有进行相关修改,则按照如下进行编译:

```text
1. source envsetup.sh
2. 选择某⼀个平台的rootfs配置
3. make recovery-dirclean
4. source envsetup.sh
5. 选择某⼀平台的 recovery 配置
6. make recovery-dirclean
7. ./build.sh
8. 重新烧写固件
```

如果SDK版本比较新,可以尝试如下编译:

```text
./build.sh external/recovery
./build.sh
# 重新烧写固件
```

### 2.3 OTA升级

升级支持网络下载和本地升级,且可指定要升级的分区,在normal系统运行如下命令:网络升级:

```text
# updateEngine --misc=update --image_url=固件地址 --partition=0x3FFC00 --
version_url=版本⽂件地址 --savepath=/userdata/update.img --reboot
updateEngine --image_url=http://172.16.21.110:8080/recovery/update.img \
    --misc=update --savepath=/userdata/update.img --reboot &
```

本地升级:

```text
updateEngine --image_url=/userdata/update.img --misc=update \
    --savepath=/userdata/update.img --reboot &
```

流程介绍:

1. 固件版本比较(--version_url)

2. 下载固件(--image_url),并保存到本地(--savepath)

3. 升级recovery 分区

4. 重启(--reboot)

5. 进入recovery模式,升级指定的分区(--partition)

6. 升级成功,重启进入normal系统可缺省参数:

1. --version_url:远程地址或本地地址,没有设置该参数,则不会进行版本比较

2. --savepath:固件保存地址,缺省时为/tmp/update.img,建议传入/userdata/update.img

3. --partition:设置将要升级的分区,建议使用0x3FFC00,不支持升级parameter 和loader分区。详⻅ 参数说明章节。

4. --reboot:升级recovery 完后,重启进入recovery模式

### 2.4 日志的查看

1. 串口日志查看buildroot/output/rockchip_***/target 目录下

```text
touch .rkdebug
```

创建这个隐藏文件,可将 recovery 模式中升级的 log 在串口中打印出来。

2. 通过查看 userdata/recovery/Log 文件查看升级之后,在设备 userdata/recovery 目录中查看 log 文件。

```text
cat userdata/recovery/Log
```

## 3. 差分升级

Linux SDK中提供了 tools/linux/Linux_Diff_Firmware/ 用来做差分升级包,支持的功能有:uboot/trust/kernel分区rootfs分区支持squashfs尚未支持的功能有:ext2/ext4格式的文件系统使用mtd驱动的nand flash系统加密分区A/B模式

### 3.1 依赖及编译

差分包制作、升级涉及到3部分代码,如下:

```text
.
├── buildroot
│   └── 0001-package-recovery-add-bzip2-dependency.
│   └── 0002-bsdiff-use-mmap-to-save-memory-when-apply-patch.patch
├── external
│   └── recovery
│       └── 0001-update_engine-add-differ-ota-funcion.patch
│       └── 0002-update_engine-recover-from-unexpected-reboot-when-do.patch
└── tools
    └── 0001-ota-add-diff-firmware-script.patch
```

请确保上述三个工程中已经包含如上提交。如果还未包含,可通过升级sdk或向RK索要升级补丁。PC端依赖的工具有: bsdiff,md5sum。其中bsdiff可通过下述命令安装:

```text
sudo apt install bsdiff
```

### 3.2 分区大小要求

在板端, 对ddr及分区大小的要求:ddr无要求,与差分补丁包大小无关空闲分区大小有要求:空闲分区大小应不小于update_diff.img和rootfs.img的大小update_diff.img例如保存在/userdata/目录下,那么/userdata/的空闲大小,至少还要能放下完整的新的rootfs.img固件

### 3.3 制作差分补丁包

通过对新、旧OTA固件(update.img)解包、差分、打包,制作补丁包。

![Rockchip Linux updateEngine 升级方案完整指南 — diff](/docs/rockchip-linux-upgrade/assets/cn-differential-flow.png)

差分流程：旧、新 update.img 分别解包；对应 uboot/trust/boot/rootfs 做差分，得到差分固件；新包中不做差分的分区直接参与打包，与差分结果一起生成 diff_img。

注意新的update.img需要为OTA image,而不是下载固件使用的update.img,即只包含要升级的分区旧的固件,建议使用包含所有分区的update.img,至少应该包含需要差分的分区旧的固件务必要与目标机器上的固件相同使用示例:

```text
cd tools/linux/Linux_Diff_Firmware/
./mk-diff-ota.sh update_old.img update_new.img update_diff.img
```

生成的update_diff.img即可用于OTA升级。注意仅支持updateEngine 工具升级, rkupdate升级工具还不支持差分包解析升级

## 4. Linux A/B 模式

### 4.1 概述

Linux A/B,即准备两份独立的系统固件,分别存放在 flash 上,系统可以从其中一个 slot 启动,如果当前 slot 启动失败,可以从另外一个 slot 启动,在Normal模式下直接升级系统,无需进入系统升级模式,只需重启系统即可进入升级过的系统。Linux A/B 由于有两个引导 slot,所以具有以下优点:

1. 升级无需重启进入升级模式,即机器可以在当前系统上直接进行升级。

2. 防止由于升级失败导致机器变砖,如果升级失败,机器可以回到当前版本。

3. 当前系统如果由于一些误操作被破坏掉,系统会自动切换到另外一个 slot 上。缺点:

1. Linux A/B 有两个 slot,所以会增加 flash 上系统固件的占用率。分区:由于 miniloader,trust,uboot,机器上原有已经进行了多备份,所以目前这几个分区暂不支持双分区方案,只对 boot 和 system 进行了双分区。分区表如下:

| 分区名 | 镜像名 | 简介 |
| --- | --- | --- |
| loader | Miniloader.bin | 一级loader,机器备份4份 |
| uboot_a | uboot.img | 二级loader,机器备份2份,可修改u-boot/make.sh来修改备份 份数 |
| uboot_b | uboot.img | uboot_a的备份分区 |
| trust | trust.img | 安全相关,机器备份2份,可修改u-boot/make.sh来修改备份份 数 (有些平台上会把trust和uboot合并) |
| misc | misc.img | 引导参数分区 |
| boot_a | boot.img | kernel+dtb,引导system_a |
| boot_b | boot.img | kernel+dtb,引导system_b |
| system_a | rootfs.img | 根文件系统 |
| system_b | rootfs.img | 根文件系统 |
| oem | oem.img | 厂商预制,可读写 |
| userdata | userdata.img | 用于数据,可读写,无备份 |

### 4.2 引导流程以及数据格式

#### 4.2.1 数据格式及存储

存储位置为 misc 分区偏移 2K 位置,AvbABSlotData 和 AvbABData 数据结构如下:AvbABSlotData:存储 slot_a 和 slot_b

| 数据名称 | 数据作用 |
| --- | --- |
| unsigned char priority | 分区优先级,0~15,0 为不可自动,15 为最高优先级 |
| unsigned char tries_remaining | 尝试启动次数,最高为 7 次,可修改 |
| unsigned char successful_boot | 0:不可启动,1:可启动 |
| unsigned char is_update:1 | 0:升级失败,1:升级成功,后 7 位为保留数据 |

AvbABData:slot_a 和 slot_b 的引导信息

| 数据名称 | 数据作用 |
| --- | --- |
| unsigned char magic[AVB_AB_MAGIC_LEN] | 结构体头部信息:\0AB0 |
| unsigned char version_major | 版本信息 |
| unsigned char version_minor | 版本信息 |
| unsigned char reserved1[2] | 保留数据 |
| AvbABSlotData slots[2] | 分区引导信息 |
| unsigned char last_boot | 上一次成功启动的分区:0->slot_a,1->slot_b |
| unsigned char reserved2[11] | 保留数据 |
| unsigned char crc32 | Crc 数据校验 |

#### 4.2.2 引导流程

根据上层 bootcontrol 程序的设置方式,可分为两种引导方式 successful_boot 和 reset retry。 两种模式的对比如下:

| 模式 | 优点 | 缺点 | 成功启动设置的数据 (A启动) | 升级时设置的数 据(A启动,B升 级) |
| --- | --- | --- | --- | --- |
| Successful boot | 只要正常启 动系统,不 会回退到旧 版本固件 | 设备⻓时间工作 后,如果存储某 些颗粒异常,会 导致系统一直重 启 | tries_remaining=0 successful_boot=1 last_boot=0 | A:priority=14 B:priority=15 |
| Reset retry | 始终保持 retry 机 制,可以应 对存储异常 问题 | 1.机器会回到旧 的版本上,可能 出现版本不可控 问题 2.如果因为用戶 误操作,retry尝 试次数过了,会 误判为当前分区 为可启动 | tries_remaining=7 last_boot=0 | A:priority=14 B:priority=15 |

#### 4.2.3 引导流程图

![Rockchip Linux updateEngine 升级方案完整指南 — cn 12](/docs/rockchip-linux-upgrade/assets/cn-p012-figure-01.png)

### 4.3 编译配置

#### 4.3.1 uboot

defconfig 增加如下配置,如 rk3308 64bit:u-boot/configs/rk3308_defconfig

```text
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_ANDROID_AB=y
```

#### 4.3.2 Buildroot

```text
BR2_PACKAGE_RECOVERY=y  #开启升级功能
BR2_PACKAGE_RECOVERY_BOOTCONTROL=y  #开启引导控制脚本
BR2_PACKAGE_RECOVERY_RETRY=y        #引导⽅式为retry模式，不配置则默认为
successful_boot模式
BR2_PACKAGE_RECOVERY_USE_UPDATEENGINE=y #使⽤新升级程序
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y  #编译新升级程序
BR2_PACKAGE_RECOVERY_NO_UI=y # 关掉UI
```

注意:设置完成之后,须进行重新编译,如下:

```text
make recovery-dirclean
make recovery
./build.sh
```

如果SDK版本比较新,可以尝试如下编译:

```text
./build.sh external/recovery
./build.sh
# 重新烧写固件
```

#### 4.3.3 分区表

相应的 BoardConfig.mk,设置 parameter 分区表,如下:

```text
#选择了 device/rockchip/rk3308/parameter-ab-64bit.txt ⽂件
# parameter for GPT table
export RK_PARAMETER=parameter-ab-64bit.txt
```

64bit:参考/device/rockchip/rk3308/parameter-ab-64bit.txt32bit:参考/device/rockchip/rk3308/parameter-ab-32bit.txt

#### 4.3.4 固件输出

选择相应的板级配置(如BoardConfig***-ab.mk)。如果要使用SD卡启动盘升级AB系统模式,方式如下:

```text
# enable build update_sdcard.img
export RK_UPDATE_SDCARD_ENABLE_FOR_AB=true
```

设置完成之后,运行

```text
./build.sh
```

即可生成如下固件:

```text
tree rockdev/
rockdev/
├── boot.img
├── MiniLoaderAll.bin
├── misc.img
├── oem.img
├── parameter.txt
├── rootfs.img
├── uboot.img
├── update_ab.img
├── update_sdcard.img
├── update_ota.img
└── userdata.img
```

升级固件rockdev 和 IMAGE 目录下,都会有 update_ota.img,用于 OTA 升级,该 IMAGE 包,包含boot.img 和rootfs.img。可根据实际需求修改 tools/linux/Linux_Pack_Firmware/rockdev/rv1126_rv1109-package-file-2-ota 文件。如下图:

```text
# NAME        Relative path
#
#HWDEF        HWDEF
package-file  package-file
bootloader    Image/MiniLoaderAll.bin
parameter     Image/parameter.txt
uboot_a       Image/uboot.img
boot_a        Image/boot.img
system_a      Image/rootfs.img
oem           Image/oem.img
```

烧写固件rockdev 和 IMAGE 目录下,都会生成 update_ab.img,该固件用于烧写。根据需求修改该文件tools/linux/Linux_Pack_Firmware/rockdev/rv1126_rv1109-package-file-2-ab 文件。如下图:

```text
# NAME          Relative path
#
```

```text
#HWDEF          HWDEF
package-file    package-file
bootloader      Image/MiniLoaderAll.bin
parameter       Image/parameter.txt
misc            Image/misc.img
uboot_a         Image/uboot.img
uboot_b         Image/uboot.img
boot_a          Image/boot.img
boot_b          Image/boot.img
system_a        Image/rootfs.img
system_b        Image/rootfs.img
oem             Image/oem.img
```

### 4.4 OTA升级

网络升级:

```text
# updateEngine --update --image_url=固件地址 --partition=0x3FFC00 --version_url=版
本⽂件地址 --savepath=保存的固件地址 --reboot
updateEngine --image_url=http://172.16.21.110:8080/linuxab/update_ota.img --
update --reboot
```

本地升级:

```text
# updateEngine --update --image_url=固件地址(update_ab.img 或 update_ota.img) --
partition=0x3FFC00 --version_url=版本⽂件地址 --savepath=保存的固件地址 --reboot
updateEngine --image_url=/userdata/update_ota.img --update --reboot
```

流程介绍:

1. 固件版本比较

2. 下载固件(--image_url),并保存到本地(--savepath)

3. 升级指定的分区(--partition)

4. 设置升级分区为将要引导分区

5. 重启

6. 尝试引导升级的分区可缺省参数:

1. --partition:设置将要升级的分区 ,Linux A/B模式下,建议只升级uboot_a/uboot_b、boot_a/boot_b和system_a/system_b,即0xFC00,不支持升级parameter 和loader分区。详⻅参数说明

2. --version:没有设置该参数,则不会进行版本比较

3. --savepath:固件保存地址,缺省时为/tmp/update.img,建议使用默认值

4. --reboot:升级完后重启

### 4.5 分区引导设置

#### 4.5.1 可引导设置

通过misc设置当前分区为可引导分区,要在 system 成功引导之后执行,标记系统成功启动,参考如下脚本

```text
$external/recovery/update_engine$ cat S99_bootcontrol
case "$1" in
  start)
        /usr/bin/updateEngine --misc=now
        ;;
  stop)
        printf "stop finished\n"
        ;;
  *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac
exit 0
```

#### 4.5.2 升级分区设置

```text
updateEngine --misc=other --reboot
```

流程介绍:

1. 往misc 偏移4K位置写入一个命令,该命令为引导另一个分区的命令

2. 重启可缺省参数:

1. --reboot,缺省则机器不会立即重启,在下一次重启才会生效注意:updateEngine程序在OTA升级结束之后会自动设置,无需重复设置。

## 5. SD 卡制作启动盘升级

SD卡启动盘升级指将通过SDDiskTool 制卡工具制作的SD卡插入到机器中进行升级,详细描述 SD 卡启动盘的制作及相关升级的问题。

### 5.1 制作SD卡启动盘

如图所示,使用工程目录 tools\windows\SDDiskTool 中的 SD 卡启动盘升级制作工具制作 SD 卡启动盘。

![Rockchip Linux updateEngine 升级方案完整指南 — cn 17](/docs/rockchip-linux-upgrade/assets/cn-p017-figure-01.png)

选择固件中选择打包好的 update.img 文件。所有准备工作完成后,点击开始创建按钮,如果创建成功,会弹窗提示。此时 SD 卡中根目录会存在两个文件,其中选择升级的固件 update.img,会被命名为 sdupdate.img.所有准备工作做好后,设备中插入 SD 卡,并重新上电。

### 5.2 Recovery系统模式的SD卡启动盘制作说明

Recovery系统模式的SD卡启动盘制作只要把update.img用SDDiskTool工具直接制作成sdupdate.img即可。

### 5.3 AB系统模式的SD卡启动盘制作说明

SDK编译AB系统模式时, ./build.sh updateimg 命令会打包出3个update.img,如下:update_ab.img: 包含完整的AB系统分区,可用于完整烧录update_ota.img: 只包含A slot分区系统或B slot分区系统

update_sdcard.img: 只能用于制作AB系统模式SD卡启动盘制作AB系统模式SD卡启动盘时,使用SDDiskTool工具加载update_sdcard.img,制作好SD卡启动盘后,再将update_ab.img或update_ota.img拷⻉到SD卡启动盘上即可。

```text
rksdfw.tag
sd_boot_config.config
sdupdate.img
update_ab.img  # first priority
update_ota.img # second priority
```

## 6. 恢复出厂设置

我们把可以读写的配置文件保存在 userdata 分区, 出厂固件会默认一些配置参数, 用戶使用一段时间后会生成或修改配置文件, 有时用戶需要清除这些数据, 我们就需要恢复到出厂配置。SDK 实现:功能键 RECOVERY + VOLUMEUP 触发恢复出厂配置, 代码请参考:buildroot/board/rockchip/rk3308/fs-overlay/etc/input-event-daemon.confboard/rockchip/rk3308/fs-overlay/usr/sbin/factory_reset_cfg

```text
updateEngine --misc=wipe_userdata --reboot
```

流程介绍:

1. 往misc 分区偏移4k位置处写入格式命令

2. 重启(--reboot)

3. S21mountall.sh 识别misc中有格式化命令

4. 格式化userdata可缺省参数:

1. --reboot 如果没有传入该参数,则在机器下次重启后才会恢复出厂设置。

## 7. 升级程序详细说明

### 7.1 参数说明

updateEngine主要包含升级分区和写Misc配置功能,支持命令参数如下:

```text
*** update_engine: Version V1.1.0 ***.
--misc=now             Linux A/B mode: Setting the current partition to bootable.
--misc=other           Linux A/B mode: Setting another partition to bootable.
--misc=update          Recovery mode: Setting the partition to be upgraded.
```

```text
--misc=wipe_userdata   Format data partition.
--update               Upgrade mode.
--partition=0x3FFC00   Set the partition to be upgraded.(NOTICE: OTA not support
upgrade loader and parameter)
                       0x3FFC00: 0011 1111 1111 1100 0000 0000.
                                 uboot trust boot recovery rootfs oem
                                 uboot_a uboot_b boot_a boot_b system_a system_b.
                       000000000000000000000000: reserved
                       100000000000000000000000: Upgrade loader
                       010000000000000000000000: Upgrade parameter
                       001000000000000000000000: Upgrade uboot
                       000100000000000000000000: Upgrade trust
                       000010000000000000000000: Upgrade boot
                       000001000000000000000000: Upgrade recovery
                       000000100000000000000000: Upgrade rootfs
                       000000010000000000000000: Upgrade oem
                       000000001000000000000000: Upgrade uboot_a
                       000000000100000000000000: Upgrade uboot_b
                       000000000010000000000000: Upgrade boot_a
                       000000000001000000000000: Upgrade boot_b
                       000000000000100000000000: Upgrade system_a
                       000000000000010000000000: Upgrade system_b
                       000000000000001000000000: Upgrade misc
                       000000000000000100000000: Upgrade userdata
--reboot               Restart the machine at the end of the program.
--version_url=url      The path to the file of version.
--image_url=url        Path to upgrade firmware.
--savepath=url         save the update.img to url.
```

--miscnow:供Linux A/B 模式使用,将当前分区设置为可引导分区。注意:external/recovery/update_engine/S99_bootcontrol 脚本在开机最后阶段会运行该命令,将当前分区设置为可引导分区,需要开启

```text
BR2_PACKAGE_RECOVERY_BOOTCONTROL=y
```

other:供Linux A/B 模式使用,将另外一个分区设置为升级完成分区,重启之后会尝试从另外一个分区引导。注意:如果使用updateEngine升级,在升级结束之后,会自动设置,无需重复设置。update:供Recovery模式使用,在normal系统升级recovery分区,在recovery 系统升级其余分区。display:调试使用,显示misc分区的数据结构--updatesdboot:走sdboot升级流程,即直接对flash操作,没有分区概念。不带参数:主要供Linux A/B使用,在当前模式下,直接进行升级。--partition=0x0000设置将要升级的分区,如果缺省,默认值为0x3FFC00,升级uboot,trust,boot,recovery,rootfs,oem,uboot_a,uboot_b,boot_a,boot_b,system_a,system_b分区。高16位已经使用,低8位为保留位,可扩展使用。

1:升级,0:不升级

| 位数 | 分区 |
| --- | --- |
| 23 | loader |
| 22 | parameter |
| 21 | uboot |
| 20 | trust |
| 19 | boot |
| 18 | recovery |
| 17 | rootfs |
| 16 | oem |
| 15 | uboot_a |
| 14 | uboot_b |
| 13 | boot_a |
| 12 | boot_b |
| 11 | system_a |
| 10 | system_b |
| 9 | misc |
| 8 | userdata |
| 7~0 | 保留 |

--rebootupdateEngine 运行成功之后,机器重启--vsersion_url如果有传入路径,升级之前会与/etc/version 文件中的 RK_VERSION= 版本值进行比较本地路径:从固件中读取版本号远程路径:从远程下载版本文件,远程版本文件格式必须跟/etc/version 一致--image_url设置升级固件的路径,可为远程或本地路径。--savepath设置保存固件的位置,如果没有传入且升级的固件路径为远程地址,则默认值为/tmp/update.img

### 7.2 自定义分区升级

```text
typedef struct {
    char name[32];      //固件名称
    bool need_update;   //需要升级
    bool is_ab;         //是否为A/B双分区
    long long size;     //固件⻓度
    long long offset;   //在update.img 中的偏移位置
    long long flash_offset; //flash上的偏移位置
    char dest_path[100];    //⽬标路径
    update_func cmd;        //升级函数
}UPDATE_CMD, *PUPDATE_CMD;
```

如要升级自定义分区,factory,则再下面添加一行, 且--partition 需要对应设置位值为1

```text
{"factory", false, false, 0, 0, 0, "", flash_normal},
```

external/recovery/update_engine/update.cpp

```text
UPDATE_CMD update_cmd[] = {
           {"bootloader" , false , false , 0 , 0 , 0 , "" , flash_bootloader} ,
           {"parameter"  , false , false , 0 , 0 , 0 , "" , flash_parameter}  ,
           {"uboot"      , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"trust"      , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"boot"       , false , true  , 0 , 0 , 0 , "" , flash_normal}     ,
           {"recovery"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"rootfs"     , false , true  , 0 , 0 , 0 , "" , flash_normal}     ,
           {"oem"        , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"uboot_a"    , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"uboot_b"    , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"boot_a"     , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
```

```text
           {"boot_b"     , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"system_a"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"system_b"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"misc"       , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"userdata"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
};
```

## 8. 附录

### 8.1 固件打包工具

#### 8.1.1 windows 工具

Windows 打包工具在 tools\windows\AndroidTool\rockdev 目录下。先修改 package-file 文件将需要升级的 image 加入打包。注意路径是这里的路径是相对路径。 mkupdate.bat 批处理程序会把tools\windows\AndroidTool\rockdev\Image 链接到根目录下的 rockdev 目录。所以请保证 rockdev下 的相应 image 存在。接着执行 mkupdate.bat。mkupdate.bat 脚本会把根目录下 rockdev 中的相应的 image 打包成 update.img 存放在根目录下 rockdev。

#### 8.1.2 linux工具

Linux 打包工具在 tools/linux/Linux_Pack_Firmware/rockdev 目录下。先修改 package-file 文件将需要升级的 image 加入打包。注意路径是这里的路径是相对路径。tools/linux/Linux_Pack_Firmware/rockdev/Image 会链接到根目录下rockdev 目录。所以请保证rockdev 下的相应 image 存在。 接着执行mkupdate.sh。mkupdate.sh脚本会把根目录下rockdev中的相应的image打包成update.img 存放在根目录下 rockdev。

### 8.2 Misc 分区说明

Misc分区是一个没有文件系统的分区,用于存放一些引导配置参数,现有结构如下,详⻅external/recovery/bootloader.h、external/recovery/update_engine/rkbootloader.cpp

| 偏移地址 | 作用 |
| --- | --- |
| 2k | Linux A/B 分区引导信息 |
| 4k | 格式化命令 |
| 16k | Recovery 系统与Normal系统通信 |

## 中英差异、代码边界和源稿问题

- 两稿同为 V1.2.0，中文 21 页、英文 25 页。中文 5.1 为制卡、5.2 为 Recovery、5.3 为 A/B；英文将制卡放在章引言，仅有 5.1/5.2。功能内容均保留。英文差分限制明确包含 EXT3、UBI，中文表述 ext2/ext4 与 mtd NAND；均不能据此支持差分 A/B、加密或可写分区。中文明确新包须为 OTA image、非下载全量包，比英文“最好只包含待升级分区”更严格，采用中文约束。
- 差分图为 PDF 矢量内容，已从原页单独导出（中第 8 页、英第 9 页），不是只保留抽出的零散标签。英文 A/B 图多出 slot_b 成功后 successful_boot=1、tries_remaining=0、last_boot=1 的注释，中文补充这一含义。图初始化为 A priority=15、B=14，均 successful_boot=0、tries_remaining=7；CRC 错误则初始化 misc。比较优先级后，已成功槽可直接启动，未成功槽依剩余重试尝试；耗尽后优先级归零并转另一槽，两槽无优先级时图示使用 last_boot。
- 原稿概述说 uboot 不采用双分区，但表及打包例有 uboot_a/uboot_b，须以实际平台判断。英文 OEM 表明确无备份，中文未写，不能把单个 oem/userdata 当作 A/B 冗余。OTA 包说明只写 boot/rootfs，但 package-file 示例还含 uboot/oem，实际内容由打包配置决定。
- --version、--vsersion_url 与帮助中的 --version_url 不一致，应核对实际程序参数，不盲用错拼。S99bootcontrol/S99_bootcontrol 拼写也不同。英文 recovery/recovery 路径缺 .mk，中文是 recovery/recovery.mk。源码块保留原注释及 PDF 换行，跨行 --update 与 shell 命令不要直接复制运行。示例私网 HTTP 地址只是原稿值，未访问。
- misc：2K 为 A/B 引导信息，4K 为格式化命令，16K 为 Recovery/Normal 通信；然而 4.5.2 切槽正文又写 4K，存在内部冲突，不擅自用裸偏移写入，须检查 rkbootloader.cpp。AvbABData 表写 unsigned char crc32，与 CRC32 名称/宽度有疑点，按实际定义核对；保留原稿类型。successful_boot=0 的表述“不可启动”过于绝对，流程图显示仍可按 tries_remaining 尝试。Reset retry 缺点写重试耗尽误判为“可启动”，与流程矛盾；按实现处理。
- 英文 UPDATE_CMD update_cmd[] 例子末尾遗漏 };，中文具有结束行；英俄德保留原片段并单独补上中文结束行。低 8 位保留，factory 扩展必须与实际 update_cmd 顺序和位映射匹配。0x3FFC00 为文档默认全组，A/B 推荐 0xFC00，均不授权 OTA loader/parameter；虽帮助列出其位定义，正文明确不支持 OTA 更新。
- 英文首个补丁树项止于 0001-package-recovery-add-bzip2-dependency.，中文也如此，实际补丁名请查 SDK。2.2 所说默认无屏配置与“仅 RK3308 无屏”的文字存在历史配置混用，应核对 BR2_PACKAGE_RECOVERY_NO_UI。日志 Log 大小写按实际文件验证。

{% endraw %}
