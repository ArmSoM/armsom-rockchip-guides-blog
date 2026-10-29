---
title: "RV1103/RV1106 RKNN 入门（二）：硬件连接与设备检查"
description: "RV1103/RV1106 RKNN 入门（二）：硬件连接与设备检查 · RKNN2 V2.5.0"
excerpt: "RV1103/RV1106 RKNN 入门（二）：硬件连接与设备检查"
translation_key: "rknn-v250-rv1106-hardware"
slug: "rknn-v250-rv1106-hardware"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RV1103", "RV1106", "Mini Runtime"]
---

平台参考：本系列对应 RKNN2 V2.5.0 的 RV1103/RV1103B/RV1106/RV1106B 入门资料，使用匹配的板级 SDK、RKNPU2 驱动及 librknnmrt.so。尚未确认对应 ArmSoM 板卡；原稿 Linux 5.10.160 日志和推理输出仅为示例，不是 ArmSoM 硬件验证。请按实际板卡 BSP 核对供电、接口及驱动。

来源：本地中英文 V2.5.0 PDF。中文正文与图片取自中文稿，英文、俄文和德文取自英文稿。保留全部技术章节、命令和表格；仅恢复 PDF 造成的换行与目录树缩进。示例旧驱动日志不代表推荐版本；原文推荐版本见正文。未锁定版本的下载和 pip 安装应与实际 SDK 配套核对。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RV1103/RV1106 RKNN 入门（一）：部署链路、平台与仓库](/zh/articles/rknn-v250-rv1106-deployment-flow/)

**RV1103/RV1106 RKNN 入门（二）：硬件连接与设备检查**

[RV1103/RV1106 RKNN 入门（三）：主机环境与 Mini Runtime](/zh/articles/rknn-v250-rv1106-host-runtime/)

[RV1103/RV1106 RKNN 入门（四）：YOLOv5 转换、Python 和 C 部署](/zh/articles/rknn-v250-rv1106-yolov5/)

[RV1103/RV1106 RKNN 入门（五）：Docker、启动问题与后续文档](/zh/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 2. 硬件连接与检查

本章只完成首次运行所需的硬件连接和设备可见性检查。确认开发板能够通过 ADB 被计算机识别后,再继续环境安装和模型转换。

### 2.1 硬件清单

运行本文档示例程序需要准备以下硬件:

| 硬件 | 数量 |
| --- | --- |
| Ubuntu 计算机 | 1 |
| RV1103/RV1103B/RV1106/RV1106B 开发板 | 1 |
| Micro USB 数据线 | 1 |
| 12V-2A 电源适配器 | 1 |

### 2.2 开发板和连接工具介绍

RV1103 开发板

![中文原稿配图 · PDF 8](/assets/images/rknn-v250/rv1106/cn/p008-figure-01.png)

*中文原稿配图 · PDF 8*

图2-1 RV1103开发板

RV1103B 开发板

![中文原稿配图 · PDF 9](/assets/images/rknn-v250/rv1106/cn/p009-figure-01.png)

*中文原稿配图 · PDF 9*

图2-2 RV1103B开发板

RV1106 开发板

![中文原稿配图 · PDF 10](/assets/images/rknn-v250/rv1106/cn/p010-figure-01.png)

*中文原稿配图 · PDF 10*

图2-3 RV1106开发板

Micro USB 数据线

![中文原稿配图 · PDF 10](/assets/images/rknn-v250/rv1106/cn/p010-figure-02.png)

*中文原稿配图 · PDF 10*

图2-4 Micro USB 数据线

电源适配器

![中文原稿配图 · PDF 11](/assets/images/rknn-v250/rv1106/cn/p011-figure-01.png)

*中文原稿配图 · PDF 11*

图2-5 输出 12V-2A 的电源适配器

### 2.3 连接开发板

下面以 RV1106 为例说明如何将开发板连接到计算机:

1. 准备一台操作系统为 Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04 的计算机;

2. 找到开发板电源接口并连接电源适配器;

3. 使用数据线连接开发板与计算机。由于生产批次不同,开发板的数据线接口类型和位置可能发生变化,通常开发板上印有 OTG 字样的接口为数据线接口;

4. 打开电源开关,等待开发板系统启动完成。

![中文原稿配图 · PDF 12](/assets/images/rknn-v250/rv1106/cn/p012-figure-01.png)

*中文原稿配图 · PDF 12*

图2-6 RV1106开发板

### 2.4 检查设备连接状态

在计算机终端中执行:

```text
# 如果没有安装 adb,请先安装
sudo apt install adb

# 查询 ADB 设备
adb devices
```

连接成功时输出信息如下,其中 421ca310c9b9242b 为 RV1106 的设备 ID(示例值,实际以本机为准):

```text
List of devices attached
421ca310c9b9242b device
```

在继续安装和模型转换前,至少确认以下检查通过:

| 检查项 | 检查命令 | 预期结果 |
| --- | --- | --- |
| ADB 工具可用 | adb version | 能正常输出 ADB 版本信息 |
| 开发板可见 | adb devices | 列表中出现状态为 device 的开发板 |

如果 adb devices 无设备显示,请参考 6.1 设备无法识别。

{% endraw %}
