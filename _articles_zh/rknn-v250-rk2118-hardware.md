---
title: "RK2118 NPU 入门（一）：开发板、连接与串口"
description: "RK2118 NPU 入门（一）：开发板、连接与串口 · RKNN2 V2.5.0"
excerpt: "RK2118 NPU 入门（一）：开发板、连接与串口"
translation_key: "rknn-v250-rk2118-hardware"
slug: "rknn-v250-rk2118-hardware"
lang: "zh"
date: "2026-10-28"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

平台参考：本文适用于原稿 RK_EVB1_RK2118G_V20（RK2118）开发板。尚未确认对应 ArmSoM 板卡，不可直接套用到 RK3588/RK3576。来源为本地中英文 RKNN2 RK2118 快速入门 V2.5.0，第 1–2 章（第 4–7 页）；后续 SDK 使用 RT-Thread，本文不指定 Linux 内核或已验证 BSP。未进行 ArmSoM 硬件实测。

版本校对：中英文均为 V2.5.0。中文连接步骤称 USB2.0 HOST 为“烧录口”，而同稿后文又用于插入 U 盘，英文连接步骤没有前一表述。下面保留中文原稿写法，使用前须按该板原理图和烧录文档核对，不据此判断端口模式。英文、俄文、德文依据英文连接顺序，并保留这项差异说明。中文使用中文 PDF 的 5 张原图，其他三语使用英文 PDF 的 5 张原图。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**RK2118 入门系列 · 1/5**

**RK2118 NPU 入门（一）：开发板、连接与串口**

[RK2118 NPU 入门（二）：主机环境与 Toolkit2 安装](/zh/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU 入门（三）：RT-Thread 与 DSP 固件编译](/zh/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU 入门（四）：模型转换、U 盘输入与推理结果](/zh/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU 入门（五）：Docker、常见问题与参考文档](/zh/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 1. 主要说明

此文档面向零基础用戶详细介绍如何快速在计算机上使用 RKNN-Toolkit2 完成模型转换,并通过 RKNPU2 部署到 Rockchip 开发板上。

支持的平台:RK2118系列。

## 2. 准备开发板

本章将介绍如何将开发板连接到计算机。分为三个部分:

- 硬件清单

- 开发板和连接工具介绍

- 连接开发板

### 2.1 硬件清单

运行本文档示例程序需要准备以下硬件:

| 硬件 | 数量 |
| --- | --- |
| 计算机 | 1 |
| RK_EVB1_RK2118G_V20开发板 | 1 |
| USB-A数据线 | 1 |
| USB-C数据线 | 1 |
| RK2118电源适配器 | 1 |

说明: 以下章节中RK_EVB1_RK2118G_V20开发板简称RK2118

### 2.2 开发板和连接工具介绍

**1. 开发板**

![图2-1 RK_EVB1_RK2118G_V20开发板](/assets/images/rknn-v250/rk2118/cn/p005-figure-01.png)

图2-1 RK_EVB1_RK2118G_V20开发板

![图2-2 RK_EVB1_RK2118G_V20开发板侧面](/assets/images/rknn-v250/rk2118/cn/p005-figure-02.png)

图2-2 RK_EVB1_RK2118G_V20开发板侧面

**2. 连接开发板和计算机的数据线**

![图2-3 USB-C 数据线](/assets/images/rknn-v250/rk2118/cn/p006-figure-01.png)

图2-3 USB-C 数据线

![图2-4 USB-A 数据线](/assets/images/rknn-v250/rk2118/cn/p006-figure-02.png)

图2-4 USB-A 数据线

**3. 电源适配器**

![图2-5 输出 12V-2A 的电源适配器](/assets/images/rknn-v250/rk2118/cn/p006-figure-03.png)

图2-5 输出 12V-2A 的电源适配器

### 2.3 连接开发板

下面以 RK2118 为例说明如何将开发板连至计算机:

1. 准备一台操作系统为 Ubuntu18.04 / Ubuntu20.04 / Ubuntu22.04 的计算机。

2. 找到图2-1中电源接口的位置,连接开发板电源适配器。

3. 使用数据线连接开发板与计算机(注意,由于生产批次不同,开发板的数据线接口类型和位置可能会发生变化。通常情况下,开发板上印有 SYSTEM DEBUG 字样的接口为串口,USB2.0 HOST为烧录口)。

4. 打开电源开关,等待开发板系统启动完成。

5. 查看开发板是否连接至计算机

使用TYPEC线连接开发板的"SYSTEM DEBUG"口和计算机。在计算机上使用串口工具查看RK2118的情况。比如使用minicom。串口波特率为

```text
1500000 8N1
```

{% endraw %}
