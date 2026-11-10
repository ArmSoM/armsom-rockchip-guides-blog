---
title: "RK3528 Datasheet V1.0 解读：用 ArmSoM Sige1 规划媒体与轻量 Linux 应用"
description: "从原始数据手册梳理 RK3528 的四核 A53、视频、显示、存储和 USB/PCIe 取舍，并给出 Sige1 项目验证方法。"
excerpt: "从原始数据手册梳理 RK3528 的四核 A53、视频、显示、存储和 USB/PCIe 取舍，并给出 Sige1 项目验证方法。"
translation_key: "rk3528-datasheet-v10"
slug: "rk3528-datasheet-v10"
lang: "zh"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige1"]
tags: ["RK3528", "hardware design", "ArmSoM"]
image: "/assets/datasheet-series-20261110/rk3528-datasheet-p14.png"
---

本文按选型和调试任务解读原稿，保留关键参数、边界和原图；不是逐页翻译或完整引脚／寄存器手册。原厂示例不是 ArmSoM 实测。应用前须核对具体板卡版本、原理图、SDK/BSP、内核及驱动；本文未新增硬件验证。

**主要资料：** `Rockchip RK3528 Datasheet V1.0-20230522.pdf` · PDF 28 页.

## RK3528 适合解决什么问题

RK3528 V1.0 面向 IPTV、OTT 和多媒体设备。四核 Cortex-A53 负责应用与网络，视频和图形模块承担专用处理任务。ArmSoM Sige1 官方资料确认采用 RK3528，可用作软件验证入口；原厂芯片框图中的功能不能直接当成 Sige1 接口清单。



[![RK3528 原厂功能框图](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)

*RK3528 原厂功能框图 — 英文原图. `Rockchip RK3528 Datasheet V1.0-20230522.pdf`, PDF p. 14.*



## 核心规格与边界

| 项目 | 原稿内容 | 选型时要确认 |
| --- | --- | --- |
| CPU / GPU | 4× Cortex-A53；Mali-450；OpenGL ES 1.1/2.0、OpenVG 1.1 | 本文不据此承诺现代 Vulkan 应用兼容 |
| 内存 | 32-bit；DDR3(L)/LPDDR3/DDR4/LPDDR4(4X)；4GB 寻址 | 实际容量和类型取决于板卡配置 |
| eMMC | eMMC 5.1、HS400、CMD Queue | 控制器能力不等于实际闪存持续写入速度 |
| 解码 | H.264/H.265/AVS2 最高 4K×2K@60fps | 格式、Profile、位深及播放器路径要匹配 |
| 编码 | H.264/H.265 最高 1920×1080@60fps；JPEG 编码 | 摄像头输入方式和驱动支持另行核对 |
| 显示 | HDMI 2.0b；CVBS 480i/576i；HDR10、HLG、Vivid HDR | 显示器、色彩格式、带宽和软件需共同验证 |
| 网络 | 千兆 MAC；另有百兆 MAC/PHY 资源 | 以 Sige1 实际连接器和原理图为准 |

这份数据手册没有提供 NPU 功能依据，因此不把 Sige1 宣传为具备 RKNN NPU 加速的平台。CPU 可运行的算法与专用 NPU 加速是两件事。

## USB 与 PCIe 的资源取舍

第 13 页脚注明确给出两种组合：`1× USB2 Host + 1× USB2 OTG + PCIe`，或 `1× USB2 Host + 1× USB3.0`。不能把 USB3 和 PCIe 作为完全独立的资源同时规划。需要 USB 摄像头、外置存储或扩展控制器时，先核对板级接线，再确认 BSP 的 PHY 配置。

章节标题写 PCIe2.1，描述中同时出现 Base Specification Revision 3.0，但列出的单 lane 速率是 2.5/5.0Gbps。本文保留这个差异，不把它升级描述为 8.0Gbps PCIe Gen3。

## 三条 Sige1 项目路线

**数字标牌与信息终端：** 先选定实际视频样片，验证硬件解码路径、字幕合成、旋转和音画同步。再测试网络中断时本地播放、更新回滚和定时恢复。最高解码分辨率不能保证带复杂网页动画的整套应用同样流畅。

**局域网媒体与轻量服务：** 可以评估文件共享、设备状态面板或媒体播放管理。分别测量网络、存储和协议开销，建立磁盘满、文件损坏及断电恢复策略。只有单一读写测速并不足以证明长期服务可靠性。

**设备通信与教学：** 在文档明确引出的接口上实现传感器采集或协议实验。先检查电平和复用，再接外设。将服务管理、日志轮转、看门狗和升级流程一并纳入，形成可维护的 Linux 设备。

## 多媒体指标不能省略条件

“支持某种编码格式”不代表所有 Profile、位深和封装都支持。将源文件信息、播放器版本、解码设备、CPU 占用、丢帧数、温度和播放时长记录在同一份表里。编码场景还要检查码率控制、延迟与输出质量，不只看瞬间帧率。

HDMI 章节原文写有 `10.2bps` 带宽字样，与上下文量级不协调。本篇不擅自补单位，也不依赖这一句推导显示能力；设计时查正式更新资料及具体输出模式。

## 电源、温度和版本仍需核对

电气表内多项上限为 `TBD`，温度栏有 `NA`；热管理章节另写结温需低于 125℃。不要把缺失值当作无限制，也不要把结温当作环境温度。选择适合实际板卡的电源和散热方案，测试持续负载后再决定外壳。

新项目先保存 Sige1 板卡修订、镜像、内核和驱动版本，再完成显示、网络、存储单测与并发运行。已有 RK3528 硬件设计文章负责原理图和 PCB 规则，本篇负责把芯片资料转成选型与验证问题。


## 产品与开发资料

- **Sige1** — [产品页](https://www.armsom.org/sige1) · [官方文档](https://docs.armsom.org/armsom-sige1)

<!-- datasheet-series-20261110 -->

## 数据手册专题与原始 PDF

- [RK3528 总览](/zh/articles/rk3528-datasheet-v10/)
- [RK3528 架构与接口详解：内存、4K 视频及共享 PHY](/zh/articles/rk3528-architecture-memory-media/)
- [RK3528 封装与引脚：401 球完整编号表](/zh/articles/rk3528-package-pin-reference/)
- [RK3528 电气与热设计：电源、I/O 和热阻](/zh/articles/rk3528-electrical-power-thermal/)
- [下载完整原始 PDF](/assets/datasheet-series-20261110/Rockchip-RK3528-Datasheet-V1.0-20230522.pdf)


<!-- datasheet-related-20261110 -->
## 其他芯片数据手册

以下用于跨平台查阅，各芯片的电气条件和引脚不可互换。

- [RK3506B](/zh/articles/rk3506b-datasheet-v10/)
- [RK3576](/zh/articles/rk3576-datasheet-v10/)
- [RK3588](/zh/articles/rk3588-datasheet-v14/)
- [RK3568](/zh/articles/rk3568-datasheet-v12/)
- [RK730](/zh/articles/rk730-audio-codec-design/)
