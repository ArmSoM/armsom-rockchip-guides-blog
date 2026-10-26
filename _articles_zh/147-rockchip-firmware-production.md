---
title: "Rockchip 量产烧录完整指南：USB、SD、烧录器与故障排查"
description: "Rockchip 量产烧录完整指南：USB、SD、烧录器与故障排查 — V1.2.3"
excerpt: "Rockchip 量产烧录完整指南：USB、SD、烧录器与故障排查"
translation_key: 147-rockchip-firmware-production
slug: 147-rockchip-firmware-production
lang: zh
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: production
products: []
tags: [ArmSoM, Rockchip, FactoryTool, firmware, production]
---

{% raw %}

# Rockchip 量产烧录完整指南：USB、SD、烧录器与故障排查

中文和英文均 V1.2.3，完整保留量产方案、工具操作和故障处理。适用原稿平台：RK3326/RK3399/RK3368/RK3288 为 Linux 4.4、4.19；RK3328 另列 Linux 3.10。仅作 ArmSoM 平台参考，须核对实际板卡、SDK/BSP、loader、工具版本及存储器件，未运行烧录、擦除或上电操作，未进行硬件验证。

> 烧录、制作升级卡、擦除 Flash 会覆盖现有数据。请备份并核对目标、loader、镜像和供电，不直接对生产设备执行示例。

中文使用中文原图；英文/俄文/德文使用对应英文原图。中文准备 IDB 失败有两张图，英文将其合为一张；按各自原稿保留。截图命令另行转录为可复制文本，仍属原文示例。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip tools](https://github.com/rockchip-linux/rkdeveloptool)

## 1. 量产烧录方案

### 1.1 方案一(USB升级方案)

1. 制作update.img升级固件
2. 使用FactoryTool进行批量烧录

### 1.2 方案二(SD升级方案)

1. 制作update.img升级固件
2. 使用SD_Firmware_Tool工具制作固件升级的SD卡
3. 插入升级SD卡,重新上电,进行固件烧录

### 1.3 方案三(烧录器升级方案)

1. 制作update.img升级固件
2. 使用SpiImageTool工具制作烧录器的烧录文件
3. 存储芯片接入烧录器,进行固件烧录

## 2. 工具使用

### 2.1 FactoryTool批量烧录工具

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p005-figure-01.png)

*中文原稿工具截图*

使用步骤:点击”固件”,选择升级固件如果有烧录Demo镜像,则勾选”Demo”选择Demo镜像(可选),Demo镜像制作⻅OemTool工具使用点击”启动”,开始自动检测升级设备连接升级设备,工具检测到后,自动开始升级

### 2.2 OemTool(制作Demo镜像工具)

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p005-figure-02.png)

*中文原稿工具截图*

制作Demo镜像步骤:

1. 点击”选择...”,选择制作镜像的Demo目录

2. 勾选”Fat32”,目前只支持Fat32格式镜像

3. 设置”磁盘大小”,只要大于user分区的容量,按100M对⻬即可

4. 点击”开始执行”,成功后会在工具目录下生成一个OemImage.img镜像文件

### 2.3 SD_Firmware_Tool(SD升级卡制作工具)

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p006-figure-01.png)

*中文原稿工具截图*

SD升级卡制作步骤:

1. 从下拉列表中,选中要制作的SD卡或U盘

2. 勾选”固件升级”

3. 点击”选择固件”,选择update.img升级固件

4. 点击”开始创建”

### 2.4 SpiImageTool(烧录器镜像制作工具)

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p006-figure-02.png)

*中文原稿工具截图*

烧录器镜像制作步骤:

1. 点击”选择固件”,选取update.img升级固件

2. 存储使用Emmc时,勾选”数据区预留”

3. 存储使用Emmc时,空白填充选择0,存储使用nandflash时,空白填充选择0xFF

4. 点击”生成文件”,成功时会在工具目录下生成boot0.bin和data.bin。emmc情况只使用data.bin,nandflash情况需要使用boot0.bin和data.bin

## 3. 制作升级固件

### 3.1 步骤

1. 在Android源代码目录下,运行mkimage.sh脚本带上ota参数,生成system.img、boot.img和recovery.img等,将其拷⻉到rockdev的image目录下。

2. 在AndroidTool的rockdev目录下,执行mkupdate.bat批处理,生成update.img升级固件.ubuntu下执行mkupdate.sh脚本生成。下图为mkupdate.bat内容:

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p007-figure-01.png)

*中文原稿工具截图*

```bat
Afptool -pack ./ Image\update.img
RKImageMaker.exe -RK31 RK3188Loader(L)_V2.10.bin Image\update.img update.img -os_type:androidos
```

重点关注-RK31这个参数,它需要跟设备匹配。如果不清楚这个值,可以通过下面方法获得:打开androidtool工具,进入高级功能,选择这个方案的loader文件,点击”下载”

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p007-figure-02.png)

*中文原稿工具截图*

点击下方的”读取Chip信息”,右方会打印出以下信息,Image Chip Flag就是那个参数

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p007-figure-03.png)

*中文原稿工具截图*

## 4. 烧录器设置

### 4.1 EMMC烧录数据:

EMMC分为3个部分,USER区,BOOT1区和BOOT2,只需要烧录USER分区即可,烧录的文件为SpiImageTool 生成的data.bin。

### 4.2 EMMC EXT_CSD配置信息:

全部使用默认值,不需要配置。

```text
EXT_CSD[167] = 0x1f（默认值）

EXT_CSD[162] = 0x0 (默认值)

EXT_CSD[177] = 0x0 (默认值)

EXT_CSD[178] = 0x0 (默认值)

EXT_CSD[179] = 0x0 (默认值)
```

## 5. 常⻅升级问题

### 5.1 下载Boot失败一

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p008-figure-01.png)

*中文原稿工具截图*

日志提示:

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p008-figure-02.png)

*中文原稿工具截图*

可能的原因:

1. USB信号不好(检查usb线路上的电容和电阻参数是否正常,usb供电是否正常)

2. 主控虚焊或者电源供电问题

### 5.2 下载Boot失败二

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p009-figure-01.png)

*中文原稿工具截图*

可能的原因:DDR颗粒或者走线问题

### 5.3 准备IDB失败

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p009-figure-02.png)

*中文原稿工具截图*

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p009-figure-03.png)

*中文原稿工具截图*

可能的原因:Flash虚焊或者不支持的颗粒

### 5.4 下载IDB失败

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p009-figure-04.png)

*中文原稿工具截图*

可能的原因:

1. USB通讯问题(断电重试,需要使用有源usb hub)

2. DDR稳定性问题(使用DDR测试工具进行稳定性测试)

### 5.5 下载固件失败

![中文原稿工具截图](/docs/rockchip-firmware-production/assets/cn-p010-figure-01.png)

*中文原稿工具截图*

可能的原因:

1. USB通讯问题(断电重试,需要使用有源usb hub)

2. Flash问题(使用AndroidTool擦除flash重试)

{% endraw %}
