---
title: "Rockchip RK3588 Linux 性能测试报告"
description: "Rockchip RK3588 Linux 性能测试报告 — V1.0.0; RK3588 EVB1"
excerpt: "Rockchip RK3588 Linux 性能测试报告"
translation_key: "212-rockchip-rk3588-linux-performance"
slug: "212-rockchip-rk3588-linux-performance"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, RK3588, Linux, Benchmark]
---

{% raw %}

# Rockchip RK3588 Linux 性能测试报告

ArmSoM 平台参考，完整整理 Rockchip 原稿 V1.0.0（RK-CS-YF-922）的技术内容。原稿测试平台是 RK3588-EVB1-LP4-V10，板级配置 `BoardConfig-rk3588-evb1-lp4-v10.mk`，不是 ArmSoM 板卡。本页所有分数均为原稿历史测量值，不是 ArmSoM 实测，也不保证其他板卡达到同一结果。实际板卡、SDK/BSP、内核、散热、电源和内存配置需要单独匹配；原稿未给出内核及 SDK 版本，尚未进行硬件验证。

原稿提供 RK3588 在通用 Linux 性能测试工具中的基准数据，供验证芯片性能、排查分析性能问题和评估预期性能时参考。工具包括 SPEC 2006、Unixbench、Glmark2、Stream。只有中文目录中的这一份原稿，没有配对英文 PDF；英、俄、德文均据此完整翻译。原稿没有技术配图，所有数据表恢复为可编辑表格。

## 1. 测试环境配置

### 1.1 硬件环境配置

| 配置 | 说明 |
| --- | --- |
| Motherboard | RK3588-EVB1-LP4-V10 |
| CPU | RK3588; 4xA76-Based@2.4GHz; 4xA55@1.8GHz |
| GPU | RK3588; 4 core Mali-G610 1000MHz |
| RAM | 8G LPDDR4X 2112MHz 16bit*4Channel |
| ROM | eMMC HS400 32GB |
| OS | debian11 |

### 1.2 软件环境配置

性能测试时，将 CPU、GPU 设置为性能模式。以下为原稿命令；GPU 重定向路径原来跨行，已恢复为一条命令。请先核对实际 BSP 的节点，不要假定所有板卡都存在这些路径。

```sh
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor

echo performance > /sys/devices/platform/fb000000.gpu/devfreq/fb000000.gpu/governor
```

设置后，可用以下方法读取 CPU、GPU 当前运行频率：

```sh
cat /sys/devices/system/cpu/cpufreq/policy0/cpuinfo_cur_freq
cat /sys/devices/system/cpu/cpufreq/policy4/cpuinfo_cur_freq
cat /sys/devices/system/cpu/cpufreq/policy6/cpuinfo_cur_freq

cat /sys/devices/platform/fb000000.gpu/devfreq/fb000000.gpu/cur_freq
```

## 2. 测试软件组

### 2.1 SPEC 2006

测试内容：CPU 整数和浮点性能。工具版本：SPEC 2006 V1.01。原稿性能数据如下。

| 测试项 | 分数 |
| --- | --- |
| 单核 整数 base | 25.5 |
| 单核 浮点 base | 29.9 |
| 多核（8 核） 整数 base | 86.9 |
| 多核（8 核） 浮点 base | 84.6 |

### 2.2 Unixbench

测试内容：系统调用、读写、进程、图形化测试、2D、3D、管道、运算、C 库等系统基准性能。工具版本：原稿写作 `Unixbenc V5.1.3`（名称少 h，原文可追溯保留）。

| 测试项 | 分数 |
| --- | --- |
| 单核 | 1273.7 |
| 多核（8 核） | 3662.2 |

### 2.3 Glmark2

测试内容：GPU OpenGL 2.0 和 ES 2.0 性能。工具版本：glmark2 2021.02。

#### X11

| 测试项 | 分数 |
| --- | --- |
| `glmark2-es2 --off-screen` | 3639 |
| `glmark2-es2` | 1376 |
| `glmark2-es2 --fullscreen` | 622 |

#### Wayland

| 测试项 | 分数 |
| --- | --- |
| `glmark2-es2-wayland --off-screen` | 3680 |
| `glmark2-es2-wayland` | 2670 |
| `glmark2-es2-wayland --fullscreen` | 1258 |

### 2.4 Stream

测试内容：内存 Copy、Scale、Add、Triad 性能。工具版本：`stream1.0 V5.10`，保留原稿写法。

| 测试项 | 单线程 (MB/s) | 多线程 (MB/s) |
| --- | --- | --- |
| Copy | 17912.8 | 20481.3 |
| Scale | 17982.8 | 20473.4 |
| Add | 17079.8 | 18205.1 |
| Triad | 17021.3 | 18126.3 |

## 适配与来源说明

原稿没有给出 SPEC 完整运行参数、散热条件或 Stream 编译参数，不能据此复现全部测试。软件包版本和性能值均作为历史记录保留。

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
