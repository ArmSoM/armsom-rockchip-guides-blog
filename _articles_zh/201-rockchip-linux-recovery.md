---
title: "Rockchip Linux Recovery 升级开发指南"
description: "Rockchip Linux Recovery 升级开发指南 — V1.2.1"
excerpt: "Rockchip Linux Recovery 升级开发指南"
translation_key: "201-rockchip-linux-recovery"
slug: "201-rockchip-linux-recovery"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Recovery, OTA]
---

{% raw %}

# Rockchip Linux Recovery 升级开发指南

依据 RK-KF-YF-353 V1.2.1（2021-07-30）中英文原稿，中文为技术基线。原稿产品范围为 RK3308、RK3226、RK3399、RK3288、RK3326、PX30 等，Linux 4.4。本文为 ArmSoM 平台参考，需核对实际板卡、SoC、SDK/BSP、分区和存储介质；没有执行任何设备命令或硬件验证。恢复出厂与 wipe_all/wipe_data 会清除数据；SD 制卡及固件烧写也可能覆盖介质。先备份并核对目标，不能把原稿“无损失升级”的概述理解为所有路径均保留数据。

## 1. OTA升级

### 1.1 概述

OTA(Over-the-Air)即空间下载技术。 OTA 升级是 Android 系统提供的标准软件升级方式。它功能强大,可以无损失升级系统,主要通过网络,例如 WIFI、3G/4G 自动下载 OTA 升级包、自动升级,也支持通过下载 OTA 升级包到 SD 卡/U 盘升级,OTA 的升级包非常的小,一般几 MB 到十几 MB。本文主要介绍了使用 OTA 技术升级时,本地升级程序 recovery 执行升级的流程及技术细节,以便用戶在开发过程中了解升级的过程及注意事项。

### 1.2 编译

rootfs 主系统rootfs 需要打开update 的支持,configs 文件配置 BR2_PACKAGE_UPDATE=y。

```text
source envsetup.sh
#choose a combo number to build rootfs according to platform chip
make menuconfig
```

具体配置如下:

```text
Target packages  --->
  [*] Rockchip BSP packages  --->
      [*]   Rockchip OTA update for linux
```

Recoverybuildroot/configs/rockchip/recovery.config 中已经将不同平台的recovery配置抽取出来了。只需系统根目录下执行:

```text
./build.sh recovery
```

成功后,会生成文件 buildroot/output/rockchip_rkxxxx_recovery/images/recovery.img 。rkxxxx为具体某一芯片名称。执行:

```text
./mkfirmware.sh
```

会将生成的固件拷⻉至 rockdev/目录下。与 recovery 相关的主要源码路径:

external/recovery/ :主要生成 recovery 二进制 bin 程序,recovery 模式下的关键程序。external/rkupdate/ :主要生成 rkupdate 二进制 bin 程序,解析 update.img 固件中各个分区数据,并执行对各分区执行升级的关键程序,该程序被recovery 二进制bin程序内部调用。若有修改以上两个目录中的源码文件之后的编译方法:

1. source envsetup.sh

2. 选择某一平台的 recovery 配置

3. make recovery-dirclean &amp;&amp; make recovery

4. make rkupdate-dirclean &amp;&amp; make rkupdate

5. ./build.sh recovery

6. ./mkfirmware.sh

7. 烧写 recovery.img

### 1.3 升级流程

#### 1.3.1 升级固件准备

修改 tools/linux/Linux_Pack_Firmware/rockdev/package-file ,根据需要升级的分区配置,修改该文件。根目录下执行命令:

```text
./build.sh updateimg
```

命令执行成功后,会将package-file指定的分区镜像打包生成update.img 升级固件,放在 rockdev/目录下。使用该update.img 升级。如果升级过程中遇到错误“Error!imageHead.uiTag !=0x57464B52”,该错误表明固件打包有错误,请按照上述操作,重新生成 update.img 重试。

![升级包错误日志](/docs/rockchip-linux-recovery/assets/cn-p005-figure-01.png)

#### 1.3.2 升级过程

将升级固件 update.img 放在 SD 卡或 U 盘根目录或者设备的/userdata 目录下。Normal 系统下执行升级程序 update ota /xxx/update.img ,设备将会进入 recovery 模式,并进行升级。可使用的路径如下:

U 盘的挂载路径: /udisksdcard 的挂载路径: /mnt/sdcard/ 或/sdcardflash 的挂载路径: /userdata/升级成功后会 reboot 到正常的 normal 系统。升级流程图如下:

![OTA 升级流程](/docs/rockchip-linux-recovery/assets/cn-p006-figure-01.png)

### 1.4 恢复出厂模式

我们把可以读写的配置文件保存在 userdata 分区,出厂固件会默认一些配置参数,用戶使用一段时间后会生成或修改配置文件,有时用戶需要清除这些数据,我们就需要恢复到出厂配置。直接运行update 后面不加任何参数或者加 factory/reset 参数均可进入 recovery 后恢复出厂配置。

### 1.5 注意事项

打包 update.img 固件时需要注意,升级固件不一定要全分区升级,可修改 package-file 文件,将不要升级的分区去掉,这样可以减少升级包(update.img )的大小。package-file 中 recovery.img 如果打包进去的话 ,不会在 Recovery 模式中升级,为了预防升级recovery.img过程中掉电导致后面其他分区无法正常升级的问题,该分区升级放在 normal 系统下升级,即,执行 update 命令时会先检测 update.img 升级包中是否有打包 recovery.img,若有则升级 recovery 分区,再进入 Recovery 模式升级其他分区固件。misc 分区不建议打包进 update.img 中,即使有打包进去,也会在升级程序中加载判断到而忽略该分区,即使升级了 misc 分区,升级成功后 recovery 程序仍会清空 misc 分区中所有的命令及参数,从而导致达不到预想的结果。如果将 update.img 升级包放置在 flash 中的 userdata 分区,则需要保证 package-file 中括 不包括 userdata.img 被打包进去,原因是可能会导致文件系统的损坏,升级成功后可能使 oem或userdata 分区mount不成功。若从SD卡或 U 盘升级时,可以打包 userdata.img,从而对userdata 分区进行升级。升级完成后会对 userdata 分区重新resize 操作。

## 2. 运行调试

### 2.1 Recovery 模式中log的查看

buildroot/output/rockchip_rkxxxx_recovery/target 目录下创建一个隐藏文件,

```text
touch .rkdebug
```

可将Recovery 模式中升级的 log 在串口中打印出来。

![开启 Recovery 调试日志](/docs/rockchip-linux-recovery/assets/cn-p008-figure-01.png)

另外一种是通过查看 userdata/recovery/Log 文件升级之后,在设备 userdata/recovery 目录中查看 log 文件。

```text
cat userdata/recovery/log
```

### 2.2 带屏设备与不带屏设备

Recovery 执行过程中如果失败,且提示如下 log 信息:

```text
failed to read font: res=-1, fall back to the compiled-in font
cannot find/open a drm device: No such file or directory
```

从log 可知,找不到或者打不开一个 drm 设备,此时如果开发的是带屏的设备,需要接上显示屏,如果是开发不带屏的设备需要进行如下配置。默认 SDK 代码 recovery 配置中为不带屏设备。

```text
cd Path_to_SDK/buildroot/package/rockchip/recovery

vim recovery.mk
```

打开 buildroot/package/rockchip/recovery 中的 recovery Makefile 文件如下图所示:

![无屏编译配置](/docs/rockchip-linux-recovery/assets/cn-p009-figure-01.png)

上图中,若配置了BR2_PACKAGE_RECOVERY_NO_UI,则定义RecoveryNoUi的宏定义为true。否则会链接显示相关的库。

```text
ifeq ($(BR2_PACKAGE_RECOVERY_NO_UI),y)
    TARGET_MAKE_ENV += RecoveryNoUi=true
else
    RECOVERY_BUILD_OPTS += -lz -lpng -ldrm
    RECOVERY_DEPENDENCIES += libzlib libpng libdrm
endif
```

故若不带屏设备需要在Recovery配置中打开BR2_PACKAGE_RECOVERY_NO_UI的配置。修改后的编译:

1. source envsetup.sh rockchip_xxxx_recovery (xxxx 为具体芯片平台)

2. make menuconfig ,打开配置No UI for recovery。

3. make recovery-dirclean &amp;&amp; make recovery

4. ./build.sh recovery

5. ./mkimage.sh

6. 烧录 rockdev/recovery.img

#### 2.2.1 带屏设备的旋转与显示

若需要将 Recovery 升级过程中显示的界面根据显示设备的方向做一些旋转操作,可按如下说明操作。

1. 更新Recovery 代码到最新。

2. 修改 minui/graphics.c 中 gr_init 函数调用的 gr_rotate 接口函数的参数。旋转参数说明:ROTATION_NONE 默认不做旋转ROTATION_RIGHT 顺时针旋转 90°ROTATION_DOWN 顺时针旋转 180°ROTATION_LEFT 顺时针旋转 270°

3. 重新编译 Recovery,生成 Recovery 分区固件,烧录。若需要调整 UI 显示的亮度,可修改 gr_color 接口中最后一个参数 alpha 透明度。最大值 255 为不透明,最小值0 表示全透明。更换 Recovery 中 UI 显示的背景图片。可自行更换 external/recovery/res/images 目录下的图片文件,保持文件名不变。

### 2.3 Debian 与 Ubuntu 系统的升级

与 Buildroot recovery 升级一样,该Recovery OTA升级方案也支持 Debian 或 Ubuntu 系统下的升级。由于Recovery 模式下升级需要通过设备各个分区节点来识别并写入不同设备分区节点的固件数据,Buildroot 系统是通过 udev 中的别名方式(by-name)来对设备分区节点做了通用的易识别的处理。Debian 或 Ubuntu 系统中因为缺少这样的方式,导致了实际中不 Recovery 不能正常运行的情况,所以只需要将 Debian 或 Ubuntu 系统中设备分区的节点也跟Buildroot 系统下可通过 by-name 别名方式标识出来,Recovery 即可正常工作。具体修改方式如下:buildroot/output/rockchip_rkxxxx/target/lib/udev/rules.d/61-partition-init.rules ,或者 buildroot/output/rockchip_rkxxxx_recovery/target/lib/udev/rules.d/61-partition-init.rules拷⻉到 Debian 或 Ubuntu 系统下相关的位置,如 rootfs/overlay-debug/lib/udev/rules.d/ 下。此处rkxxxx 为具体某一 rk芯片平台(RK3308、RK3328、RK3399、RK3326 等)。修改的目的就是开机启动后可以将 Debian 系统或 Ubuntu 系统中各个分区节点形如 /dev/mmcblk0p0、 /dev/mmcblk0p1 、 /dev/mmcblk0p2 、 /dev/mmcblk0p3 ... 修改为/dev/block/by-name/uboot 、 /dev/block/by-name/misc 、 /dev/block/by-name/boot 、 /dev/block/by-name/rootfs ...等。若还是出现如下类似设备节点:

```text
root@linaro-alip:~# ls /dev/block/
179:0 179:3 179:5 179:7 179:96 7:0 7:3 7:6
179:1 179:32 179:6 179:8 1:0 7:1 7:4 7:7
179:2 179:4 179:64 179:9 254:0 7:2 7:5
```

可尝试将 61-partition-init.rules放在 Debian 或 Ubuntu /etc/udev/rules.d/ 或/lib/udev/rules.d/ 。

## 3. SD 卡制作启动盘升级

本章节主要为了解决使用 SD 卡启动,进行裸片升级的需求,详细描述 SD 卡启动盘的制作及相关升级的问题。使用工程目录中 tools\windows\SDDiskTool 中的 SD 卡启动盘升级制作工具制作 SD卡启动盘。

![SDDiskTool 制作升级卡](/docs/rockchip-linux-recovery/assets/cn-p011-figure-01.png)

选择固件中选择打包好的 update.img 文件。所有准备工作完成后,点击开始创建按钮,如果创建成功,会弹窗提示。此时 SD 卡中根目录会存在两个文件,其中选择升级的固件 update.img,会被命名为 sdupdate.img.所有准备工作做好后,设备中插入 SD 卡,并重新上电。Log 中如果出现下面内容,说明 SD 卡启动设备成功:

```text
U-Boot 2017.09-g1bee468 (Oct 11 2018 - 16:53:06 +0800) V1.000
Model: USM-110 a102-1
Board:Advantech usm110_rk3288 Board,HW version:0
DRAM: 2 GiB
Relocation Offset is: 7ff5a000
PMIC: RK808
vdd_arm 1100000 uV
vdd_gpu 1100000 uV
vcc_io 3300000 uV
regulator(LDO_REG2) init 3300000 uV
regulator(LDO_REG3) init 1100000 uV
regulator(LDO_REG4) init 1800000 uV
regulator(LDO_REG5) init 3300000 uV
regulator(LDO_REG6) init 1100000 uV
regulator(LDO_REG7) init 1800000 uV
regulator(LDO_REG8) init 1800000 uV
```

```text
MMC: dwmmc@ff0c0000: 1, dwmmc@ff0f0000: 0
SF: Detected w25q32bv with page size 256 Bytes, erase size 4 KiB, total 4 MiB
*** Warning - bad CRC, using default environment
In: serial
Out: serial
Err: serial
switch to partitions #0, OK
mmc1 is current device
do_rkimg_test found IDB in SDcard
Boot from SDcard
enter Recovery mode!
SF: Detected w25q32bv with page size 256 Bytes, erase size 4 KiB, total 4 MiB
Skipped ethaddr assignment due to invalid,using default!
Net: No ethernet found.
Hit any key to stop autoboot: 0
ANDROID: reboot reason: "recovery"
FDT load addr 0x10f00000 size 263 KiB
Booting kernel at 0x3575c70 with fdt at 42cf470...
```

若串口 log 中打印如下的 log,说明 SD 卡启动进入了 recovery 固件对裸片设备的升级过程。

```text
firmware update will from SDCARD.
is_sdcard_update out
sdupdate_package = /mnt/sdcard/sdupdate.img
Command: "/usr/bin/recovery"
sdboot update will update from /mnt/sdcard/sdupdate.img
start with main.
```

## 4. 附录

### 4.1 misc 分区说明

misc 其实是英文 miscellaneous 的前四个字母,杂项、混合体、大杂烩的意思。misc 分区的概念来源于 Android 系统,Linux 系统中常用来作为系统升级时或者恢复出厂设置时使用。misc 分区的读写:misc 分区在以下情况下会被读写。

1) Uboot:设备加电启动时,首先启动 Uboot,在 Uboot 中会读取 misc 分区的内容。根据 misc分区中 command 命令内容决定是进入正常系统还是 recovery 模式。Command 为 boot-recovery,则进入 recovery 模式。Command 为空,则进入正常系统。

2) Recovery:在设备进入 recovery 模式中,可以读取 misc 分区中 recovery 部分的内容,从而执行不同的动作,或升级分区固件,或擦除用戶分区数据,或其他操作等等。misc 分区的结构及内容:misc 分区的结构组成详⻅下图。

![misc BootLoader Msg 结构](/docs/rockchip-linux-recovery/assets/cn-p013-figure-01.png)

下面以 RK3308 平台使用的 misc 分区为例,使用 winhex 或 ultraEdit 等工具,以二进制形式打开misc.img 文件,在距文件开始位置偏移 16K(16384 Byte)字节位置处开始,存放 BootLoader Msg结构体的内容。

![misc 二进制偏移示例](/docs/rockchip-linux-recovery/assets/cn-p013-figure-02.png)

Recovery 中支持的命令部分,可参考 external/recovery/recovery.c 中 OPTIONS 结构中内容。

#### 4.1.1 misc.img 选择

SDK 根目录 device/rockchip/rockimg 目录下是经常使用的 misc.img 文件。生成固件的时候根据配置选择拷⻉哪一个 misc.img 的文件。

```text
.
├ ── blank-misc.img     #空⽩的 misc 分区⽂件
├── pcba_small_misc.img #不常⽤
├── pcba_whole_misc.img #不常⽤
└── wipe_all-misc.img   #格式化⽤⼾分区使⽤的 misc 分区⽂件
```

常用的两种 misc.img 文件是 blank-misc.img 与 wipe_all-misc.img。打开具体芯片平台的 BoardConfig.mk 文件, 可配置 misc.img 的具体使用。

```text
cd device/rockchip/rkxxxx
vim BoardConfig.mk
```

![BoardConfig.mk 中选择 misc](/docs/rockchip-linux-recovery/assets/cn-p014-figure-01.png)

从上图中可看到,默认使用 wipe_all-misc.img 作为 misc 分区的固件,使用该 misc固件,烧写后会格式化用戶(/userdata 或/data )分区与客制(/oem)分区的数据。若希望开机不进入 recovery 模式,而进入正常系统,可以修改 BoardConfig.mk 这里 misc image 的具体文件为 blank-misc.img 。然后重新编译,生成新的固件。

### 4.2 Recovery 不同场景下的使用

#### 4.2.1 第一次开机

烧写过 misc.img、recovery.img 的设备会进入第一次开机流程。串口log打印如下内容:

```text
Boot command: boot-recovery
Got arguments from boot message
Command: "recovery" "--wipe_all"
format '/dev/block/by-name/userdata' to ext2 filesystem
executing '/sbin/mke2fs'
executed '/sbin/mke2fs' done
executed '/sbin/mke2fs' return 0
executing '/sbin/e2fsck'
e2fsck 1.43.9 (8-Feb-2018)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/block/by-name/userdata: 11/2304 files (0.0% non-contiguous), 82/2299 blocks
executed '/sbin/e2fsck' done
executed '/sbin/e2fsck' return 0
executing '/usr/sbin/e2fsck'
e2fsck 1.43.9 (8-Feb-2018)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/block/by-name/oem: 18/2448 files (0.0% non-contiguous), 513/16384 blocks
executed '/usr/sbin/e2fsck' done
```

```text
executed '/usr/sbin/e2fsck' return 1
executing '/usr/sbin/resize2fs'
resize2fs 1.43.9 (8-Feb-2018)
The filesystem is already 16384 (1k) blocks long. Nothing to do!
executed '/usr/sbin/resize2fs' done
executed '/usr/sbin/resize2fs' return 0
```

#### 4.2.2 恢复出厂设置

命令行运行 update 程序,设备会进入 recovery,并进行格式化,格式化完成之后会自动进入 normal系统。

```text
update （或 update reset）
```

串口log打印如下内容:

```text
I:Boot command: boot-recovery
I:Got arguments from boot message
Command: "recovery" "--wipe_data"
format '/dev/block/by-name/userdata' to ext2 filesystem
executing '/sbin/mke2fs'
[ 4.692437] vendor storage:20160801 ret = -1
[ 6.030842] phy phy-ff008000.syscon:usb2-phy@100.0: charger =
USB_SDP_CHARGER
[ 10.891460] random: nonblocking pool is initialized
```

#### 4.2.3 升级

执行 update ota /xxx/update.img ,设备会进入 recovery,并进行升级。

```text
update ota /udisk/update.img
```

以从 U 盘升级为例,串口可能打印的 log 如下:

```text
I:Boot command: boot-recovery
I:Got arguments from boot message
Command: "recovery" "--update_package=/udisk/update.img"
。。。。
librkupdate_ui_print = parameter writing....
########### RKA_Gpt_Download #########
librkupdate_###### Download trust ... #######
```

### 4.3 常⻅问题汇总

#### 4.3.1 “cannot find/open a drm device ”

常⻅在非 RK3308 平台,进入 recovery 模式后串口打印如下 log:

```text
we are in recovery, skip init oem/userdata
start debug recovery...
Starting recovery on Fri Jan 18 09:19:51 2013
failed to read font: res=-1, fall back to the compiled-in font
Starting network: cannot find/open a drm device: No such file or directory
```

遇到此情况时,解决方法是:接上设备支持的显示屏,或者 HDMI 设备。原因分析:从提示的 log 看是找不到或者打开drm 设备失败。因为,默认非 RK3308 平台 recovery程序的编译是打开支持 UI 显示的,如果进入 recovery 模式之后,打开显示设备失败,则会导致 recovery执行失败。解决方式:

1、 source envsetup.sh

2、现在使用平台的recovery配置编号,回⻋

3、 make menuconfig ,打开 No UI for recovery 的配置

```text
> Target packages  --->
    [*] Rockchip BSP packages  --->
        [*]   Rockchip recovery for linux
        [*]   No UI for recovery
        [ ]   Linux AB bool control
           Linux A/B bringup features. (successful_boot)  --->
           choice the update bin of recovery. (rkupdate)  --->
        -*-   recovery bin
        [ ]   updateEngine bin
```

external/recovery/Makefile 中就不会编译与显示相关的代码。

![RecoveryNoUi 影响的对象文件](/docs/rockchip-linux-recovery/assets/cn-p017-figure-01.png)

4、重新编译 recovery包

```text
make recovery-dirclean && make recovery
```

5、重新生成 recovery 固件

```text
./build.sh recovery
```

6、生成固件。

```text
./mkfirmware.sh
```

#### 4.3.2 misc 分区固件修改默认命令

如果想修改 misc 固件中打包不同的 recovery 命令,或者使用空白的 misc 分区固件。可按如下方式修改:工程根目录下:修改 mkfirmware.sh。

![mkfirmware.sh 中选择 misc](/docs/rockchip-linux-recovery/assets/cn-p018-figure-01.png)

#### 4.3.3 userdata 分区设置为 vfat 文件系统

SDK 中默认 userdata 分区为 ext2/ext4 文件系统,若想修改为 vfat32 文件系统,可按如下修改:

1. 修改 board/rockchip/rkxxxx/fs-overlay-recovery/etc/fstab修改前:

```text
/dev/block/by-name/userdata /userdata ext2 defaults0
```

修改后:

```text
/dev/block/by-name/userdata /userdata vfat defaults0 0
```

2. 修改 configs/rockchip_rkxxxx_release_defconfig增加以下配置:

```text
BR2_PACKAGE_DOSFSTOOLS=y
BR2_PACKAGE_DOSFSTOOLS_FATLABEL=y
BR2_PACKAGE_DOSFSTOOLS_FSCK_FAT=y
BR2_PACKAGE_DOSFSTOOLS_MKFS_FAT=y
```

3. 修改 package/rockchip/usbdevice/S50usbdevice

```text
start)
mkdir /dev/usb-ffs -m 0770
mkdir /dev/usb-ffs/adb -m 0770
mount -t configfs none /sys/kernel/config
mkdir /sys/kernel/config/usb_gadget/rockchip -m 0770
echo 0x2207 > /sys/kernel/config/usb_gadget/rockchip/idVendor
echo "ums_adb" >
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuratio
n
mount -t functionfs adb /dev/usb-ffs/adb
mount -t vfat /dev/disk/by-partlabel/userdata /media/usb0
export service_adb_tcp_port=5555
adbd &
sleep 1
```

4. 确保已更新以下补丁

0001-common-mk-userdata-Fix-wrong-FS_TYPE-check.patch

```text
case $FS_TYPE in
ext[2-4])
$COMMON_DIR/mke2img.sh $USERDATA_DIR $USERDATA_IMG
;;
fat|vfat)
SIZE=$(du -h -BM --max-depth=1 $USERDATA_DIR|awk '{print int($1)}')
# echo "create image size=${SIZE}M"
dd if=/dev/zero of=$USERDATA_IMG bs=1M count=$SIZE >/dev/null 2>&1
mkfs.vfat $USERDATA_IMG >/dev/null 2>&1
mcopy -i $USERDATA_IMG $USERDATA_DIR/* ::/ >/dev/null 2>&1
;;
*)
echo "file system: $FS_TYPE not support."
exit 1
;;
Esac
```

5. 修改 common/mk-userdata.sh

```text
SIZE=$(du -h -BM --max-depth=1 $USERDATA_DIR|awk '{print int($1)}')
# echo "create image size=${SIZE}M"
dd if=/dev/zero of=$USERDATA_IMG bs=1M count=$SIZE >/dev/null 2>&1
mkfs.vfat -F 32 $USERDATA_IMG >/dev/null 2>&1
mcopy -i $USERDATA_IMG $USERDATA_DIR/* ::/ >/dev/null 2>&1
;;
*)
```

6. 修改 rk3308/BoardConfig.mkexport RK_USERDATA_FS_TYPE=ext2

```text
# Set userdata partition type, including ext2, fat
export RK_USERDATA_FS_TYPE=vfat
```

#### 4.3.4 userdata (或/data )分区不格式化

BoardConfig.mk 中配置了 wipe_all-misc.img ,却不希望格式化用戶或客制(userdata 或 oem)分区,此时需要修改 recovery 的代码。修改 external/recovery/reocvery.c : main 函数中如下图的代码,将下图红框中的代码注释掉后,重新编译 recovery 分区固件,烧写 recovery 分区固件即可。

![wipe_all 分支代码](/docs/rockchip-linux-recovery/assets/cn-p020-figure-01.png)

#### 4.3.5 SD卡升级问题

在实际项目开发中,经常遇到使用 SD 卡制作启动盘,用以升级裸片或者升级Flash固件。在第3章节,我们阐述了SD 卡制作启动盘并可以正常进入 recovery 模式,进行升级的情况,但实际使用过程中,常遇到 SD 卡升级无法正常进行,串口亦无任何输出的情况。本小节就此情景下做针对性的说明。此处,以 RK1808 平台为例,其他 RK 平台芯片(RK3288、RK3399、RK3399PRO)类似,给出SD卡管脚与 UART 2 调试串口 IO复用后,SD卡作为启动卡升级的解决方案。

1. 首先检查硬件原路图,查看 SD 卡 GPIO 管脚是否与 uart2 串口管脚复用,若硬件有复用,需调整uboot 下的dtsi,打开使能 sdmmc,禁用 uart2 (系统默认使用uart 2 作为调试串口)。若无复用,检查 SD 卡上电与初始化部分。

2. 修改 loader,将 loader 中 uart 的打印重新配置,修改 SDK/rkbin/tools/ddrbin_param.txt 中uart id 。假如可以将串口⻜线连接到 uart1 m0,则 uart id=1;如果⻜到 uart1 m1,那么 uartid=1 uart iomux=1。

3. 重新生成 ddr.bin,执行以下命令

```text
cd SDK/rkbin/tools
rkbin/tools$./ddrbin_tool ddrbin_param.txt
../bin/rk1x/rk1808_ddr_933MHz_v1.04.bin
```

此处 rk1808_ddr_933MHz_v1.04.bin 文件,根据 SDK 中当前 rkbin/bin/rk1x/ 目录下的文件名保持一致。具体平台目录有差异,根据实际芯片平台的前两个数字命名。ddrbin_tool工具参数详细内容,可参考说明文档:SDK/rkbin/tools/ddrbin_tool_user_guide.txt 。

4. 修改 kernel dts配置。修改调试串口,除了 ddr.bin 修改外,内核也需要修改。

![FIQ debugger UART 配置](/docs/rockchip-linux-recovery/assets/cn-p020-figure-02.png)

5. 修改启动参数 cmdline:kernel/arch/arm64/boot/dts/rockchip/rk1808-evb-v10.dts

```text
chosen {
    bootargs = "earlycon=uart8250,mmio32,0xff550000 console=ttyFIQ0
root=PARTUUID=614e0000-0000 rootfstype=ext4 rootwait swiotlb=1 kpti=0
snd_aloop.index=7";
};
```

此处 0xff550000 这个地址要根据实际的串口修改,各个不同串口地址在arch/arm64/boot/dts/rockchip/rk1808.dtsi 这个文件里可以搜索找到,其他平台类似,查找对应平台的设备树文件。如:RK1808 平台 uart2: serial@ff550000, uart1: serial@ff540000。

![RK1808 UART 寄存器地址](/docs/rockchip-linux-recovery/assets/cn-p021-figure-01.png)

6. 编译固件uboot编译: ./build.sh uboot 或者进入u-boot目录中,执行 ./make.sh rk1808编译后生成文件在 u-boot 目录下:

```text
u-boot/
├── rk1808_loader_v1.03.104.bin
├── trust.img
└── uboot.img
```

kernel编译: ./build.sh kernelrecovery编译: ./build.sh recovery最后 ./build.sh updateimg 。

7. 正确烧录编译好的固件以后打包生成 update.img 升级包, 使用“SDDiskTool_v1.62”或更新版本,烧录 update.img 到SD卡中。开发板断电, 插上SD卡,上电。此时串口可以从uart1或其他当前所指定的⻜线的串口打印log,观察log,并根据log具体分析SD卡升级问题。

## 中英差异与源稿核对

- 两稿均为 V1.2.1。中文正文从第 4 页、英文从第 5 页开始，全部四章、五个 FAQ 和技术图保留。中文明确 rkupdate 由 recovery 内部调用；常用 misc 文件为 blank-misc.img 与 wipe_all-misc.img，英文正文说明较简略，已在此补齐。
- 英文重编译步骤漏写 make：make recovery-dirclean && recovery；中文是 make recovery-dirclean && make recovery。英文末节 kernel/recovery 命令出现“. /build.sh”，按中文应是 ./build.sh。代码区保留源例；说明处明确差异。第 2.2 节写 ./mkimage.sh，其他节写 ./mkfirmware.sh，不擅自认为两者可互换，按具体 SDK 核对。
- 第 2.2 节称默认无屏，而 FAQ 4.3.1 又称非 RK3308 默认开启 UI；这是两稿共有的矛盾。以实际 BR2_PACKAGE_RECOVERY_NO_UI 和 Makefile 为准。gr_color 的 alpha 是透明度，255 不透明、0 全透明，并非硬件背光设置。
- 4.3.4 的 external/recovery/reocvery.c 是源稿拼写错误，对应 recovery.c。中文要求注释红框代码、英文要求删除，目标均是改变 wipe_all 分支；不能据此承诺其它擦除路径也失效。图中实际是 erase_volume("/userdata") 与 resize_volume("/oem")，所以“格式化两分区”的概括要结合实现判断。
- 英文 fstab 源码为 defaults0 / defaults0 0，中文为 defaults0 / defaults0 0 同样有空格问题，应按实际 fstab 字段核对。英文 case 片段末尾 Esac 应与 shell 的 esac 区分；保留源例并告警。日志路径正文 Log、命令 log 大小写不同。update (or update reset) 是选择说明，不能把括号一起当作 shell 命令。
- misc 结构图共 1088 字节：Command 32、Status 32、Recovery 768、Reserved 256；RK3308 示例起点为 16384 字节。图中 mis、wip_all 是文字错误，实际字段/命令请看 misc、wipe_all 与 OPTIONS。英文流程图未画出 recovery 不在升级包中的旁路，不代表此时不能继续；正文明确按是否包含决定是否先更新 recovery。
- SD/UART 排障需要同时核对 U-Boot pinmux、loader UART ID/IOMUX、kernel fiq-debugger 的 rockchip,serial-id，以及 cmdline 地址。RK1808 图中 serial-id 原值 2 必须改成实际接线 UART；UART2=0xff550000、UART1=0xff540000。这些是原稿平台实例，不是任意 ArmSoM 板卡通用地址。

{% endraw %}
