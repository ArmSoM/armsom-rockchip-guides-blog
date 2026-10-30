---
title: "Rockchip Box 厂测工具：功能、老化与写号配置"
description: "Rockchip Box 厂测工具：功能、老化与写号配置"
excerpt: "Rockchip Box 厂测工具：功能、老化与写号配置"
translation_key: "266-rockchip-box-factory-test-tool"
slug: "266-rockchip-box-factory-test-tool"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

本文完整整理 RK-YH-YF-501《厂测工具操作说明》V3.0 的技术正文。原稿记录 Android 4.4 以上兼容性及 Android Q 支持，但正文另提到 V4.0 计算器入口，版本矛盾保留并注明。用于 ArmSoM 时仅作为 Rockchip Android SDK 平台参考：必须核对实际板卡、SoC、BSP、工具和内核版本；LED、按键和 Framework 功能需要产品适配，未进行 ArmSoM 硬件测试。全部三张图来自中文 PDF，无独立英文图。参考 [ArmSoM 官方文档](https://docs.armsom.org/)。

## 1 概述

工具用于量产设备的功能检查及长时间运行老化稳定性测试。通过 U 盘或 SDCard 引导，面向运行完整固件的 PCBA 或整机。功能测试包括 WIFI、BT、LAN、SD、USB、HDMI、左右声道、按键、LED、CVBS；老化测试包括 Cpu、Vpu、Gpu、Memory。

## 2 功能测试

### 2.1 界面预览

![功能测试界面，中文原稿第 6 页。](/docs/rockchip-box-factory-test-tool/images/cn-p006-1.png)

功能测试界面，中文原稿第 6 页。

### 2.2 配置说明

创建 `Factory_Test.ini`。不需要某项测试时，将对应 `activated` 设为 `0`；`1` 开启。每项均支持 `test_key` 快捷重测属性，例如 `test_key = 1` 表示按遥控器 1 键重测失败项。以下参数及注释按原稿保留；注释中的多余斜杠不擅自更改。

```ini
[WIFI]
activated = 1 //是否启用该测试项，1：开启， 0：禁用
wifi_ap = zhangwen //测试使用的 Wifi Ap 名称
password = //Wifi Ap 密码
connect = 1 //是否连接 wifi 测试，1：连接 AP, 0：不连接
db_start = -30 //信号强度范围
db_end = -70 //信号强度范围

[BT]
activated = 1 //是否启用该测试项，1：开启， 0：禁用
bt_name = //配置指定蓝牙名称，默认为空

[LAN]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[SD]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[USB]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[HDMI]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[CHNL]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[LED]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[REST]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[CVBS]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
```

WIFI 参数：`wifi_ap` 是测试 AP 名称，`password` 是密码，`connect = 1` 连接 AP、`0` 不连接；`db_start` 和 `db_end` 为信号强度范围。BT 的 `bt_name` 为指定蓝牙设备名称，默认空。`CHNL` 对应左右声道，`REST` 为原稿的 RESET 测试节名。

### 2.3 加密配置文件

运行 `EncryptTool` 目录中的 `EncryptTool`，点击“加密”，选择 `Factory_Test.ini`。工具在相同目录生成 `Factory_Test_Signed.bin`，将其重命名为 `Factory_Test.bin`。

![EncryptTool，中文原稿第 8 页。](/docs/rockchip-box-factory-test-tool/images/cn-p008-1.png)

EncryptTool，中文原稿第 8 页。

### 2.4 启动功能测试

将 `Factory_Test.bin` 放在 SDCard 或 U 盘根目录，插入设备即自动启动功能测试。

### 2.5 功能测试说明

| 项目 | 判定与说明 |
|---|---|
| Wifi | 自动搜索配置 AP，按配置决定是否连接，自动判断并显示结果；失败时备注显示原因。 |
| Bluetooth | 自动搜索蓝牙设备；配置名称时必须找到指定设备，否则找到任意蓝牙设备即通过，界面显示结果。 |
| Lan | 自动获取 IP 地址判断并显示结果。 |
| SDCard | 自动读写文件校验并显示结果。 |
| USB | 自动读写文件校验；多个 USB 口的结果分别列在备注栏。 |
| HDMI | 手动观察自动播放的测试视频；正常播放且无杂线等异常即通过。默认片源 `/sdcard/Aging_Test_Video.mp4`。 |
| CVBS | 手动观察自动切换至 CVBS 后 HDMI 屏熄灭、CVBS 屏显示，即通过。 |
| CHNL | 手动听音：左声道男音、右声道女音即通过。 |
| LED | 手动观察 LED 正常间断亮灭。非通用功能：按产品增加内核 LED 控制节点，或将新节点地址配置到 `persist.sys.leds_path`。 |
| RESET | 按住板背 RESET；通过后提示框消失、界面显示成功。非通用功能，需按产品配置按键映射。 |

界面显示的 Mac 地址默认是以太网地址。

## 3 老化测试

### 3.1 界面预览

![老化测试界面，中文原稿第 11 页。](/docs/rockchip-box-factory-test-tool/images/cn-p011-1.png)

老化测试界面，中文原稿第 11 页。

### 3.2 配置说明

创建 `Aging_Test.ini`。防呆配置控制是否必须先通过功能测试。大量量产时，可把片源内置于固件 `system/usr/` 或 `/sdcard/`，避免重复向大量 U 盘/SDCard 拷贝。

正文称 V4.0 及以上可在 Android 计算器输入 `000.=` 进入老化界面；这与封面 V3.0 不一致，需核对实际工具。进入前必须已有片源，否则 VPU 老化不能开启。默认两路视频分别是 `/sdcard/Aging_Test_Video.mp4` 与 `/sdcard/Aging_Test_Video_Float.mp4`；若 `system/usr/` 有片源则优先使用。

```ini
[FactoryTest]
required = 0 ////是否必须要通过功能测试后，才能进行老化测试。
///// 1：必须通过功能测试， 0：不必通过功能测试
```

`required = 1` 必须通过功能测试；`0` 不要求。

### 3.3 加密配置文件

按功能测试同样步骤加密，最终文件为 `Aging_Test.bin`。

### 3.4 开启老化测试

把 `Aging_Test.bin` 放到 SDCard/U 盘根目录并插入设备自动启动。测试开始红绿灯同时闪烁；测试程序异常退出 6 秒后红绿灯同时亮；测试出错红绿灯同时熄灭。灯状态并非通用，需产品配置。

### 3.5 退出老化测试

为防遥控器误操作，退出时按 HOME 回桌面。此功能不通用，需要修改 SDK Framework 配合。

## 4 写号

### 4.1 配置说明

创建 `SN_Test.ini`，`adb_enable = 1` 开启 ADB，`0` 关闭。

```ini
[ADB]
adb_enable = 1 //开启或关闭 ADB 1：开启，0：关闭
```

### 4.2 加密配置文件

按功能测试同样步骤加密，最终生成 `SN_Test.bin`。

### 4.3 开启写号

把 `SN_Test.bin` 放到 SDCard/U 盘根目录，插入设备后自动开启 ADB，供其他写号工具使用。写号由其他工具实现，本操作仅配合开启 ADB，可以扩展定制。

**注意：三个配置文件同时放在一个 U 盘中时，默认仅启动功能测试。**

{% endraw %}
