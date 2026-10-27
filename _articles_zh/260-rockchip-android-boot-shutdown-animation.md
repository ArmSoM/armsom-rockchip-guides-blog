---
title: "Rockchip Android开关机动画与铃声"
description: "定制Android开关机动画压缩包、音频格式、帧时序及ODM打包。"
excerpt: "定制Android开关机动画压缩包、音频格式、帧时序及ODM打包。"
translation_key: "260-rockchip-android-boot-shutdown-animation"
slug: "260-rockchip-android-boot-shutdown-animation"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}


来源RK-SM-YF-202 V1.1中英合稿，所述SDK适用Android8.1及以上，V1.1更新Android Q。以下为Rockchip说明，非ArmSoM实测或所有后续版本支持确认；未执行命令。两张截图仅在双语PDF出现一次、界面中文，无独立英文截图，四语保留这些原图。

## 1 概述

本文涵盖Android开机铃声、关机铃声、开机动画、关机动画定制；快速使用见第2节。

## 2 快速开启方法

### 2.1 开启与关闭

在device/rockchip/common/BoardConfig.mk将BOOT_SHUTDOWN_ANIMATION_RINGING由false改true，开启编译时打包进固件；false关闭此打包功能。

```make
BOOT_SHUTDOWN_ANIMATION_RINGING := true
```

### 2.2 文件放置位置

从Android7.0起动画与铃音合并，将开关机动画及铃声放到下表对应源码位置。编译输出$OUT/odm/media/，新增后需烧写odm.img生效。

| 用途 | 源码路径 | 设备路径 |
| --- | --- | --- |
| 开机 | device/rockchip/common/bootshutdown/bootanimation.zip | /odm/media/bootanimation.zip |
| 关机 | device/rockchip/common/bootshutdown/shutdownanimation.zip | /odm/media/shutdownanimation.zip |

### 2.3 编译结果

编译后的媒体输出到$OUT/odm/media/。新增动画铃声后，应烧写odm.img使其生效。

## 3 文件要求

开机铃声必须WAV；关机铃声必须WAV或OGG。图片PNG、颜色位深8，尺寸适配屏幕分辨率。

### 3.1 制作bootanimation.zip

开机动画是一组连续PNG帧，不是单个GIF。打包名bootanimation.zip，ZIP方式必须“存储”（不压缩）。desc.txt保存为ANSI，指定尺寸、帧率、循环次数、目录名；part0为第一阶段PNG，part1为第二阶段PNG。原目录截图还含part2，但正文示例仅定义part0/part1。

![压缩包内容：双语原稿中的中文界面](/docs/rockchip-android-boot-shutdown-animation/images/archive-content.png)

压缩包内容：双语原稿中的中文界面 - 原稿技术图；PDF页 7 (BILINGUAL).

```text
480 427 30
p 1 0 part0
p 0 10 part1
```

首行宽480、高427、帧率30。后续每行依次标志符、循环次数、以帧时长为单位的切换间隔、目录；原稿要求标志符p。循环0为无限，因此part0一次间隔0，part1无限间隔10。30fps每帧1/30s≈33.3ms，间隔10约333ms。间隔期间动画进程休眠让CPU初始化系统；原稿说明长间隔可加快启动但影响动画效果。

准备连续动画，批量调整尺寸适配屏幕，输出PNG并连续编号如0000.png、0001.png；分别放入part0/part1，按实际修改desc.txt。原截图展示连续编号PNG。

![连续PNG帧（并非ZIP设置窗口）](/docs/rockchip-android-boot-shutdown-animation/images/zip-store.png)

连续PNG帧（并非ZIP设置窗口） - 原稿技术图；PDF页 9 (BILINGUAL).

最后生成bootanimation.zip：必须ZIP且方法选“存储”，否则所述系统无法读取；成功后替换原动画。中文另要求bootanimation.zip权限755，平行英文漏掉该句；这里保留中文要求，并需按目标SDK核实。

{% endraw %}
