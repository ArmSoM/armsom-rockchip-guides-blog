---
title: "Rockchip Android开机视频"
description: "配置Rockchip Android开机视频文件、播放时长、音量与启动延迟。"
excerpt: "配置Rockchip Android开机视频文件、播放时长、音量与启动延迟。"
translation_key: "255-rockchip-android-boot-video"
slug: "255-rockchip-android-boot-video"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}


来源RK-SM-YF-505 V1.0.0中文稿。说明Rockchip SDK开机视频原理、定制及使用，非ArmSoM实测或新SDK支持确认。未执行命令，原图均来自中文稿，无英文稿。

## 1 概述

本文说明Android开机视频的原理、定制及使用方法；快速使用可直接阅读第3章。

## 2 开机视频原理

快速使用见第3节。在原生bootanimation中加入bootvideo播放控制，并在audio服务处理开机视频阶段音频，保证音量稳定。原流程图分为两个图像对象，以下连续保留。

![开机视频流程上半部](/docs/rockchip-android-boot-video/images/bootvideo-flow.png)

开机视频流程上半部 - 原稿技术图；PDF页 6 (CN).

![开机视频流程续图](/docs/rockchip-android-boot-video/images/audio-flow.png)

开机视频流程续图 - 原稿技术图；PDF页 6 (CN).

## 3 使用方法

### 3.1 开启与关闭

所述RKSDK已集成开机视频。在device/rockchip/common/BoardConfig.mk添加宏，true开启、false关闭，二选一。

```make
BOOT_VIDEO_ENABLE ?= true
```

```make
BOOT_VIDEO_ENABLE ?= false
```

### 3.2 视频放置位置

素材放到device/rockchip/common/bootvideo/bootanimation.ts。默认按此文件名识别，其它已支持格式可改名bootanimation.ts，无需转换；改名并不增加编码支持。编译复制到system分区media目录，原截图输出如下。

### 3.3 编译结果

编译成功后，bootanimation.ts复制到system分区的media目录。原截图展示以下RK3328 BOX输出路径：

```text
out/target/product/rk3328_box/system/media/bootanimation.ts
```

![编译输出](/docs/rockchip-android-boot-video/images/installed-file.png)

编译输出 - 原稿技术图；PDF页 7 (CN).

### 3.4 素材要求

理论上盒子本地媒体中心可正常播放的视频均可用。但开机启动大量服务、负载高，须按芯片能力选择，优先硬解格式。建议上限RK3328/RK3228H为1080p，RK322x/RK312x为720p。

### 3.5 属性控制

| 属性 | 值与行为 |
| --- | --- |
| persist.sys.bootvideo.enable | true开；false关 |
| persist.sys.bootvideo.showtime | -2默认：读取视频时长保证播完。-1不设时长，系统通知结束即停。正整数为秒，如20播20s，提前结束则停留最后一帧；该模式须&gt;0，超过120按120s。 |
| persist.sys.bootvideo.vol | 1–100，最大100 |
| persist.sys.bootvideo.delaytime | 调试播放延迟≥0秒，5为5s |

## 4 问答

原稿为“待补充”，无其它问答。

{% endraw %}
