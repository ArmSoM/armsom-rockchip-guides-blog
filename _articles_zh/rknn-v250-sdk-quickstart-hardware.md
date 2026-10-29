---
title: "RKNN2 V2.5.0 入门（二）：硬件连接与 ADB 检查"
description: "RKNN2 V2.5.0 入门（二）：硬件连接与 ADB 检查 · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0 入门（二）：硬件连接与 ADB 检查"
translation_key: "rknn-v250-sdk-quickstart-hardware"
slug: "rknn-v250-sdk-quickstart-hardware"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

适用范围：本系列为 RKNN2 V2.5.0 平台参考，原稿覆盖 RK3562、RK3566/3568/3576/3588 系列及 RV1126B。ArmSoM 同 SoC 板卡仍需匹配的 BSP、NPU 驱动和 Runtime；不能直接照搬 Rockchip EVB 的电源、USB 接口或固件。主机与驱动要求见正文；未进行 ArmSoM 硬件验证。

依据本地中英文 V2.5.0 原稿整理，保留原章节编号。中文用中文原图，英文、俄文和德文用英文原图；恢复 PDF 换行、跨页表格与代码缩进。示例输出不是 ArmSoM 实测。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN2 V2.5.0 入门（一）：部署链路、平台与 SDK 仓库](/zh/articles/rknn-v250-sdk-quickstart-deployment-flow/)

**RKNN2 V2.5.0 入门（二）：硬件连接与 ADB 检查**

[RKNN2 V2.5.0 入门（三）：Toolkit、Android/Linux Runtime 与编译器](/zh/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0 入门（四）：MobileNet 转换与部署](/zh/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0 入门（五）：YOLOv5 检测与精度评估](/zh/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0 入门（六）：Docker、启动问题与文档导航](/zh/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 2. 硬件连接与检查

本章只完成首次运行所需的硬件连接和设备可见性检查。

### 2.1 硬件清单

运行本文档示例程序需要准备以下硬件:

| 硬件 | 数量 | 说明 |
| --- | --- | --- |
| 计算机 | 1 | 操作系统为Ubuntu 18.04/20.04/22.04 |
| 开发板 | 1 | RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B |
| 数据线 | 1 | 类型随开发板而定,见2.2节 |
| 电源适配器 | 1 | 规格随开发板而定,见2.2节 |

说明: 由于生产批次不同,开发板的数据线接口类型和位置可能会发生变化。通常情况下,开发板上印有OTG字样的接口为数据线接口。

### 2.2 开发板和连接工具介绍

**1. 开发板**

RK3562开发板:

![中文原稿配图 · PDF 8](/assets/images/rknn-v250/sdkquick/cn/p008-figure-01.png)

*中文原稿配图 · PDF 8*

图2-1 RK3562开发板

RK3566开发板:

![中文原稿配图 · PDF 9](/assets/images/rknn-v250/sdkquick/cn/p009-figure-01.png)

*中文原稿配图 · PDF 9*

图2-2 RK3566开发板

RK3568开发板:

![中文原稿配图 · PDF 9](/assets/images/rknn-v250/sdkquick/cn/p009-figure-02.png)

*中文原稿配图 · PDF 9*

图2-3 RK3568开发板

RK3588开发板:

![中文原稿配图 · PDF 9](/assets/images/rknn-v250/sdkquick/cn/p009-figure-03.png)

*中文原稿配图 · PDF 9*

图2-4 RK3588开发板

RK3576开发板:

![中文原稿配图 · PDF 10](/assets/images/rknn-v250/sdkquick/cn/p010-figure-01.png)

*中文原稿配图 · PDF 10*

图2-5 RK3576开发板

RV1126B开发板:

![中文原稿配图 · PDF 10](/assets/images/rknn-v250/sdkquick/cn/p010-figure-02.png)

*中文原稿配图 · PDF 10*

图2-6 RV1126B开发板

RV1126B开发板侧面:

![中文原稿配图 · PDF 10](/assets/images/rknn-v250/sdkquick/cn/p010-figure-03.png)

*中文原稿配图 · PDF 10*

图2-7 RV1126B开发板侧面

**2. 数据线**

USB-A数据线(适用于RK3562/RK3568开发板):

![中文原稿配图 · PDF 11](/assets/images/rknn-v250/sdkquick/cn/p011-figure-01.png)

*中文原稿配图 · PDF 11*

图2-8 USB-A 数据线(适用于 RK3562/RK3568 开发板)

Micro USB数据线(适用于RK3566开发板):

![中文原稿配图 · PDF 11](/assets/images/rknn-v250/sdkquick/cn/p011-figure-02.png)

*中文原稿配图 · PDF 11*

图2-9 Micro USB 数据线(适用于 RK3566 开发板)

USB-C数据线(适用于RK3576/RK3588开发板):

![中文原稿配图 · PDF 11](/assets/images/rknn-v250/sdkquick/cn/p011-figure-03.png)

*中文原稿配图 · PDF 11*

图2-10 USB-C 数据线(适用于 RK3576/RK3588 开发板)

**3. 电源适配器**

输出12V-2A的电源适配器(适用于RK3562/RK3566/RK3568开发板):

![中文原稿配图 · PDF 12](/assets/images/rknn-v250/sdkquick/cn/p012-figure-01.png)

*中文原稿配图 · PDF 12*

图2-11 输出 12V-2A 的电源适配器(适用于 RK3562/RK3566/RK3568 开发板)

输出12V-3A的电源适配器(适用于RK3576/RK3588开发板):

![中文原稿配图 · PDF 12](/assets/images/rknn-v250/sdkquick/cn/p012-figure-02.png)

*中文原稿配图 · PDF 12*

图2-12 输出 12V-3A 的电源适配器(适用于 RK3576/RK3588 开发板)

### 2.3 连接开发板

下面以RK3568为例说明如何将开发板连至计算机:

1. 准备一台操作系统为Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04的计算机。

2. 找到下图中电源接口的位置,连接开发板电源适配器。

3. 使用数据线连接开发板与计算机。(注意,由于生产批次不同,开发板的数据线接口类型和位置可能会发生变化。通常情况下,开发板上印有OTG字样的接口为数据线接口。)

4. 打开电源开关,等待开发板系统启动完成。

5. 查看开发板是否连接至计算机

在计算机的终端窗口(命令行界面)中,执行以下命令:

```text
# 如果没有安装过 adb,请先使用 sudo apt install adb 安装
adb devices
```

连接成功时输出信息如下,其中 13af7b28115662cd 为RK3568的设备ID(示例值,实际以本机为准)。若无设备显示请参考6.1 adb devices查看不到设备章节进行排查。

```text
List of devices attached
13af7b28115662cd device
```

### 2.4 检查设备连接状态

在继续安装和模型转换前,至少确认以下检查全部通过:

| 检查项 | 检查命令 | 通过标准 |
| --- | --- | --- |
| ADB工具可用 | adb version | 能正常输出adb版本信息 |
| 板端设备可见 | adb devices | 设备列表中出现开发板设备,且状态为device |

上述检查均通过后,再继续主机端和板端环境准备。

{% endraw %}
