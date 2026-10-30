---
title: "Rockchip Android Magisk 安装：Pie 与 Q 历史指南"
description: "完整保留历史启动镜像修补、TWRP 安装、ramdisk 配置与 SafetyNet 原稿说明。"
excerpt: "完整保留历史启动镜像修补、TWRP 安装、ramdisk 配置与 SafetyNet 原稿说明。"
translation_key: "268-rockchip-android-magisk"
slug: "268-rockchip-android-magisk"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

## 适用范围与历史原稿

本文完整整理所提供的英文 Magisk 安装指南，原稿适用于 Rockchip Android Pie 和 Android Q。封面写 V1.0.1，修订表却已到 V1.0.2，作为版本疑点并列保留。文中描述历史版本的 MagiskManager、Magisk Hide 和 SafetyNet 流程，不作为当前版本安装建议，也不保证能够通过完整性检查。尚未确认具体 ArmSoM 板卡、BSP 构建或内核版本；使用前需核对实际启动镜像结构和匹配的 SDK。没有执行刷机、root 安装或硬件测试。未提供中文 PDF，四语统一使用英文原稿唯一截图。

## 1 简介

原稿将 Magisk 描述为 Android 定制开源工具集，支持 Android 5.0（API 21）及以后版本，覆盖 root、启动脚本、SELinux 补丁，以及移除 AVB2.0、dm-verity、forceencrypt 等功能。Systemless Interface 可改变 system 或 vendor 行为，同时保持实际分区完整。历史原稿还描述了向银行应用、企业监控应用、游戏反作弊系统和 Google SafetyNet 隐藏修改的能力；这是原稿主张，不是对当前能力的验证。

上游参考：[Magisk](https://github.com/topjohnwu/Magisk)。

## 2 安装方式

原稿给出两种集成方式：

1. 刷入由 Magisk Manager 修补的启动镜像。
2. 使用第三方 recovery（例如 TWRP）刷入 Magisk ZIP。

## 3 刷入 Magisk Manager 修补的启动镜像

原稿指出大多数 Rockchip 设备为非 A/B。Android Pie 的非 A/B 设备采用 system-as-root，`boot.img` 中不包含 ramdisk，而 Magisk 需要把文件安装进启动镜像的 ramdisk，因此必须确保其存在。Android Q 中 ramdisk 回到 `boot.img`。参考 A/B 设备的安排，可以在 `boot.img` 中加入 ramdisk，并在 cmdline 设置 `skip_initramfs` 以跳过它。

### 3.1 准备

构建包含 ramdisk 的 `boot.img`：启用 `BOOTIMG_SUPPORT_MAGISK`，然后编译启动镜像。原稿将 BoardConfig 位置写为 `device/rockchip/rk3328/rk3328_box BoardConfig.mk`（中间为空格）；这里保留原始写法，请核对实际文件路径，不要将其当成命令。

```make
BOOTIMG_SUPPORT_MAGISK := true
```

```sh
make bootimage
```

Android Q 的 `boot.img` 已包含 ramdisk，应跳过上述构建准备步骤。从[上游发行页](https://github.com/topjohnwu/Magisk/releases)获取与该历史流程匹配的 MagiskManager。

### 3.2 安装步骤

1. 将 `boot.img` 推送到设备。

```sh
adb push path/to/boot.img /storage/emulated/0/Download
```

2. 安装 MagiskManager。

```sh
adb install /path/to/MagiskManager.apk
```

3. 在 MagiskManager 中点击 **install → Patch Boot Image File**，选择第 1 步传入的 `boot.img`。MagiskManager 会下载 Magisk ZIP 并自动修补镜像。
4. 将修补镜像拉取到电脑。

```sh
adb pull /storage/emulated/0/Download/boot_patched.img
```

5. 使用 AndroidTools 将 `boot_patched.img` 刷入 boot 分区。

原稿注意事项：

1. 点击 Patch Boot Image File 后若 APK 崩溃，原稿建议安装第三方文件管理器，以 ES File Explorer File Manager 为历史示例。
2. 安装后若 adb 不可用，在 **Settings → Settings → Magisk Hide** 中关闭 Magisk Hide，然后重启设备。
3. 安装 MagiskManager 后必须连接网络，否则可能看不到安装按钮，如图 1。

![图 1：缺少安装按钮的 MagiskManager；英文原稿第 5 页。](/docs/rockchip-android-magisk/images/magisk-manager.png)

图 1：缺少安装按钮的 MagiskManager；英文原稿第 5 页。

## 4 通过 TWRP 刷入 Magisk ZIP

### 4.1 准备

- 编译 [Rockchip TWRP](https://github.com/rockchip-software/TWRP)。
- 按前文构建包含 ramdisk 的 `boot.img`。
- 从 [Magisk 发行页](https://github.com/topjohnwu/Magisk/releases)下载 `Magisk.zip`。

### 4.2 安装

1. 使用 AndroidTool 刷入 TWRP（`recovery.img`）和 `boot.img`。
2. 将 `Magisk.zip` 推送到设备。

```sh
adb push /path/to/Magisk.zip /sdcard/
```

3. 重启进入 recovery。

```sh
adb reboot recovery
```

4. 使用 TWRP 安装 `Magisk.zip`。
5. 重启设备。
6. 安装 MagiskManager。

```sh
adb install /path/to/MagiskManager.apk
```

## 5 SafetyNet 检查——历史原稿流程

原稿将 SafetyNet 分为 CTS compatibility 和 Basic integrity：CTS 是较难伪装的服务端检查，Basic integrity 是设备端较低层级的检查。部分应用只使用 Basic integrity，因此即使完整 SafetyNet 检查失败，也可能运行。这些描述按历史语境保留。

原稿认为，若 Basic integrity 为 true 而 SafetyNet 失败，可能是 Google 不信任该设备，并提出用 MagiskHide Props Config 将属性（尤其 `ro.build.fingerprint`）匹配到已通过检查的 ROM。该方法不代表设备获得认证，也不保证检查成功。

原稿安装途径包括 Magisk Manager 的 Downloads，或从 Manager/模块支持帖子下载 ZIP，再通过 **Magisk Manager → Modules** 或 TWRP 等 recovery 安装。安装模块并重启后，原稿给出：

```sh
adb shell
su
props
```

从提供的列表中选择已认证的 fingerprint。原稿参考：[MagiskHide SafetyNet 文档](https://www.didgeridoohan.com/magisk/MagiskHideSafetyNet)、[MagiskHidePropsConf](https://github.com/Magisk-Modules-Repo/MagiskHidePropsConf)。

原稿注意：若已集成其他 root 工具，应先移除。

ArmSoM 平台文档：[docs.armsom.org](https://docs.armsom.org/)。

{% endraw %}
