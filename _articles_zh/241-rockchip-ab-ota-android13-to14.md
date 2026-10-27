---
title: "Rockchip A/B OTA：Android 13 升级 Android 14 完整指南"
description: "Rockchip A/B OTA：Android 13 升级 Android 14 完整指南 — A/B, Virtual A/B, BSP, keymaster, userdata"
excerpt: "Rockchip A/B OTA：Android 13 升级 Android 14 完整指南"
translation_key: "241-rockchip-ab-ota-android13-to14"
slug: "241-rockchip-ab-ota-android13-to14"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "A/B"]
---

{% raw %}

# Rockchip A/B OTA：Android 13 升级 Android 14 完整指南

ArmSoM 平台参考。依据中文原稿 RK-KF-YF-787 V1.0.0，产品表原列 RK3326/RK3399/RK356x/RK3588/RK3562，内核 5.10/6.10。保留原版本值，不推定所有芯片/内核组合或 ArmSoM 板卡均支持。必须核对具体 Android BSP、lunch 项、A/B模式、分区和加密配置；未进行硬件验证。

本文涉及刷写与安全配置，须在授权开发设备上备份后验证；userdebug/SELinux配置仅为原文调试参考，不代表生产安全建议。未执行命令或下载补丁。

| 原稿芯片名称 | 原稿内核版本 |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588/RK3562 | 5.10, 6.10 |

## 1. 概述

本文档描述 Rockchip Android 13.0 A/B 系统通过 OTA 升级到 Android 14.0 A/B 系统。

## 2. Android 14.0 补丁

### 2.1 A/B 配置

在对应项目的 BoardConfig.mk 开启 A/B 配置。Android 14 必须与 Android 13 的 A/B 配置一致；如果 Android 13 未开启虚拟 A/B，Android 14 也不要开启。A/B 参考配置：

```text
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
 BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
```

虚拟 A/B 参考配置：

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.2 data 区与 keymaster

a. 先按第3章操作。如果升级完成后能正常进入 Android 主界面，则忽略 b；否则按 b 操作。

b. 从下列网盘的 userdata_patches 目录获取补丁，应用到 Android 14 SDK 对应仓库；具体用法参见目录中的 README.txt。

链接：https://pan.baidu.com/s/1HcH1QbUE4mAJplV5KoP-1w ，提取码：`0nsa`。

注意：仅适用于旧 Android 13 设备升级 Android 14 的项目，新开发的 Android 14 设备不能使用这些补丁。

## 3. Android 13.0 升级到 Android 14.0

在 Rockchip Android 14.0 平台生成 OTA 包，放在 Rockchip Android 13.0 设备上正常 OTA 升级。操作前仔细阅读第4章注意事项。

1. 选择从13.0升级到14.0的 lunch 项，例如 `lunch rk3588_t-userdebug` 或 `lunch rk3568_t-userdebug`。通常对应项目目录可以直接从 Android 13 SDK 复制。

2. 正常编译 uboot、kernel，执行 lunch 后使用以下原文编译命令：

```text
make clean && make –j32 && make dist -j32 && ./mkimage_ab.sh ota
```

3. 将第2步生成的升级包命名为 update.zip。
4. 放到 Android 13 设备上执行升级。

注意（1）：如果当前 Android 13 由 Android 12 按《Rockchip_Developer_Guide_AB_System_OTA_from_Android12_to_Android13_CN》升级而来，继续升级14应按《Rockchip_Developer_Guide_AB_System_OTA_from_Android12_to_Android14_CN》操作，在14 SDK选择原12的 lunch 项，如 `lunch rk3568_s-userdebug` 或 `lunch rk3588_s-userdebug`。正常编译后，原文说将 `upddate.zip` 放入“Android 14.0设备”升级。该文件名与 update.zip、该设备版本与升级前 Android 13 冲突，原信息保留，执行前核对。

注意（2）：如果当前 Android 13 由 Android 11 按《Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android13_CN》升级而来，继续升级14应按《Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android14_CN》操作，在14 SDK选择原11的 lunch 项，如 `lunch rk3568_r-userdebug`。正常编译后，原文仍写 `upddate.zip` 放入“Android 14.0设备”；同样保留疑点待核对。

## 4. 注意事项

1.验证调试时各Android平台(如Android13.0/Android14.0)请使用userdebug版本,并且设置BOARD_SELINUX_ENFORCING := false。

2. OTA升级前确保 parameter 分区表一致：14.0 固件使用的 parameter.txt 必须与13.0一致。

3.OTA升级前确保fstab(如fstab.rk30board)中data区的文件系统、加密方式必须一致。比如从Android13.0升级到Android 14.0,需确保编译出来的14.0固件使用的data区文件系统、加密方式与13.0一致。

4.OTA升级前需确保编译出来的固件本身必须是正常的。比如从Android 13.0升级到Android 14.0,需确保编译出来的14.0固件通过工具(如RKDevTool)烧写到设备后必须能正常启动,并且各方面功能正常。

## 校对与来源

无对应英文PDF，英俄德为中文全文翻译。原稿无技术插图；产品表信息保留于开头。非技术封面、读者对象及修订表已移除。原文命令 `–j32` 使用 U+2013，保留而不静默改写，运行前核对。`upddate.zip` 与 `update.zip` 不一致；本文明确标注。网盘与口令来自原稿，未验证有效性。

产品表原写内核6.10，未猜测改为6.1；第3章历史升级路径的目标设备版本写Android14，和当前Android13矛盾，已在四语正文并列注明。A/B/虚拟A/B必须与旧设备一致。第4页末限制新设备不能用补丁、第5页最后验证条件均保留。

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
