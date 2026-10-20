---
title: "Rockchip Linux DMA-BUF：内存泄漏、IOVA 与峰值调试"
description: "完整整理 RK3588 Linux 5.10 DMA-BUF 调试宏、procfs、视频播放内存与峰值示例。"
translation_key: "084-rockchip-linux-dmabuf"
slug: "084-rockchip-linux-dmabuf"
lang: "zh"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "DMA-BUF"]
keywords: "ArmSoM Rockchip Linux linux dmabuf"
excerpt: "完整整理 RK3588 Linux 5.10 DMA-BUF 调试宏、procfs、视频播放内存与峰值示例。"
---

{% raw %}

# Rockchip Linux DMA-BUF：内存泄漏、IOVA 与峰值调试

## ArmSoM 适用说明与来源

本文是 ArmSoM 适配前的平台参考，来源为中文 V1.0.0。原文范围：RK3588，Linux 5.10。没有英文 PDF；英文、俄文、德文均完整译自中文，德文复用英文文章的同一配图。尚未核实具体 ArmSoM 板卡、SDK/BSP 或驱动组合，未进行硬件验证。请核对实际 SoC、板卡内存布局、SDK/BSP、内核配置和驱动实现。代码、地址、日志及数据是原文示例，不是 ArmSoM 实测。

[校对记录](/docs/rockchip-linux-dmabuf/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

本文介绍内存泄漏、数据流错误及内存映射失败的 DMA-BUF 调试手段。原稿无技术配图，不添加虚构原图。

| 原文芯片 | 原文内核 |
| --- | --- |
| RK3588 | Linux 5.10 |

<!-- Source CN PDF p.4, unit 0 -->

## 1. 简介

<!-- Source CN PDF p.4, unit 1 -->

DMABUF是多媒体设备之间共享内存的一种特定buffer结构，不同设备可以通过DMABUF的fd进行跨进程共享内存，实现零拷贝提高性能，支持异步访问降低模块耦合度。

<!-- Source CN PDF p.4, unit 2 -->

## 2. DMABUF 调试Linux修改

<!-- Source CN PDF p.4, unit 3 -->

### 2.1 DMABUF_DEBUG

<!-- Source CN PDF p.4, unit 4 -->

Linux-5.10开始支持DMABUF debug，支持此功能需要修改arch/arm64/configs/rockchip_defconfig

<!-- Source CN PDF p.4, unit 5 -->

```text
CONFIG_DMABUF_DEBUG=y
```

<!-- Source CN PDF p.4, unit 6 -->

打开该宏定义，每个DMABUF会默认设置name，以pid+taskname的形式，16个字符。如

<!-- Source CN PDF p.4, unit 7 -->

```text
416-allocator@4.
```

<!-- Source CN PDF p.4, unit 8 -->

### 2.2 DMABUF_PROCFS

<!-- Source CN PDF p.4, unit 9 -->

Linux-5.10开始支持DMABUF procfs，支持此功能需要修改arch/arm64/configs/rockchip_defconfig

<!-- Source CN PDF p.4, unit 10 -->

```text
CONFIG_RK_DMABUF_PROCFS=y
```

<!-- Source CN PDF p.4, unit 11 -->

打开该宏定义，在/proc/节点下创建一个rk_dmabuf的子结点，该子节点支持多种调试节点，如

<!-- Source CN PDF p.4, unit 12 -->

```text
dev # 显示所有DMABUF已经attach的device
sgt # 显示所有DMABUF的ScatterListTable，显示其IOVA
size # 显示所有DMABUF的total size
peak # 显示所有DMABUF的total size的峰值
```

节点含义：dev 显示 attach 的设备；sgt 显示 ScatterListTable 及 IOVA；size 显示总大小；peak 显示总大小峰值。

<!-- Source CN PDF p.4, unit 13 -->

### 2.3 DMABUF_DEBUG_ADVANCED

<!-- Source CN PDF p.4, unit 14 -->

是DMABUF procfs的一个子功能，用于获取DMABUF的内存物理地址，支持此功能需要修改arch/arm64/configs/rockchip_defconfig

<!-- Source CN PDF p.4, unit 15 -->

```text
CONFIG_DMABUF_DEBUG_ADVANCED=y
```

<!-- Source CN PDF p.5, unit 16 -->

打开该宏定义，所有DMABUF都会通过fake device去attach/map，从而获取到它的sgt，协助/proc/rk_dmabuf_sgt完整显示所有DMABUF的IOVA。

<!-- Source CN PDF p.5, unit 17 -->

## 3. QA

<!-- Source CN PDF p.5, unit 18 -->

### 3.1 RK3588 视频播放DMABUF内存泄漏?

<!-- Source CN PDF p.5, unit 19 -->

打开调试宏，在进入主界面

<!-- Source CN PDF p.5, unit 20 -->

```text
console:/ # cat /proc/rk_dmabuf/size
Total: 65552 KiB
```

<!-- Source CN PDF p.5, unit 21 -->

播放视频、退出播放、删除历史内容、回到主界面

<!-- Source CN PDF p.5, unit 22 -->

```text
console:/ # cat /proc/rk_dmabuf/size
Total: 83948 KiB
```

<!-- Source CN PDF p.5, unit 23 -->

### 3.2 RK3588 视频播放DMABUF内存峰值？

<!-- Source CN PDF p.5, unit 24 -->

通过mpp的调试节点，查看播放视频的DMABUF的总内存大小

<!-- Source CN PDF p.5, unit 25 -->

```text
console:/ # cat /proc/mpp_service/sessions-summary
fdc38100.rkvdec-core Total: 699760 KiB
```

<!-- Source CN PDF p.5, unit 26 -->

通过DMABUF的调试节点，查看DMABUF峰值内存

<!-- Source CN PDF p.5, unit 27 -->

```text
console:/ # cat /proc/rk_dmabuf/peak
Peak: 1544 MiB
```

<!-- Source CN PDF p.5, unit 28 -->

清零重新观察

<!-- Source CN PDF p.5, unit 29 -->

```text
console:/ # echo 0 > /proc/rk_dmabuf/peak
```

{% endraw %}
