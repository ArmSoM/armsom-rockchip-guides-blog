---
title: "Rockchip Android Samba：客户端与 CIFS 挂载"
description: "Rockchip Android Samba：客户端与 CIFS 挂载 — Android / Rockchip"
excerpt: "Rockchip Android Samba：客户端与 CIFS 挂载 — Android / Rockchip"
translation_key: "261-rockchip-android-samba"
slug: "261-rockchip-android-samba"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM 开发者平台参考。来源：RK-SM-YF-295 V1.0.0。使用前需核对板卡 SoC、Android SDK/BSP、内核配置和厂商工具；原文未确认特定 ArmSoM 板卡或内核版本的适配。本次未进行 ArmSoM 硬件验证，示例和截图来自原稿，不是 ArmSoM 实测。

## 原稿适用范围

V1.0.0 原稿介绍 Rockchip Android 10/11 的 Samba 使用，芯片范围写为“所有芯片”；这是原稿的平台范围，不代表所有 ArmSoM 镜像均包含客户端或 CIFS 支持。本主题只有中文 PDF，四语均使用其中的两张原始截图。

## 1 Samba Client

### 1.1 使用 Android Samba Client 软件

Google 为 Android 提供开源 Samba 客户端，源码见 [samba-documents-provider](https://github.com/google/samba-documents-provider/)。原稿说明官方未提供编译好的 APK，可自行编译，也可寻找他人编译的 APK；此处保留原稿说明，不代表已经核验当前发行状态。

![Android Samba Client 连接界面](/docs/rockchip-android-samba/images/p002-01.png)

*Android Samba Client 连接界面 — 中文原稿图, p. 2.*

填写 Samba 服务器共享文件夹及账户信息，点击 `MOUNT` 挂载。挂载成功后，应用自动启动 Google Files 浏览该共享文件夹。

![Google Files 中已挂载的共享目录](/docs/rockchip-android-samba/images/p003-01.png)

*Google Files 中已挂载的共享目录 — 中文原稿图, p. 3.*

### 1.2 使用命令行挂载 Samba 共享文件夹

内核必须支持 CIFS。在 Kernel config 中开启以下配置，重新编译内核镜像并烧写。原稿流程无需修改 Android 侧。

```text
CONFIG_CIFS=y
```

先在 PC 端搭建 Samba 服务器，原稿未展开服务器配置。设备端进入 ADB shell、创建挂载点并挂载共享。第二条 mount 是原稿具体示例，应按服务器实际情况选择一条挂载命令。

```sh
adb shell
mkdir -p /sdcard/share
mount -t cifs -o username=<SMB_USER>,password=<SMB_PASSWORD>,vers=2.1 //<SMB_IP>/<SMB_PATH> /sdcard/share

mount -t cifs -o username=all,password=all,vers=2.1 //10.10.10.201/all /sdcard/share
```

挂载成功后列出共享目录内容；使用结束后卸载。

```sh
ls -l /sdcard/share
umount /sdcard/share
```

相关官方文档: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
