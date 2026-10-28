---
title: "ArmSoM CM5 运行 RetroArch：用 RK3576 搭建复古游戏终端"
description: "在 ArmSoM CM5 开发套件的 Debian 12 桌面上体验 Falling、GBAtris 和 Snake，了解 RetroArch 开源核心、实机演示与上游源码构建教程。"
excerpt: "从连接 HDMI 显示器与 USB 键盘，到运行开源游戏和编译 RetroArch，看看 CM5 如何成为桌面上的复古游戏开发平台。"
translation_key: "armsom-cm5-retroarch"
slug: "armsom-cm5-retroarch"
lang: zh
date: 2026-10-27
author: "ArmSoM"
category: projects
products: [CM5]
tags: [ArmSoM, CM5, RK3576, RetroArch, Debian, Linux, libretro]
image: /assets/cm5-retroarch/three-games.png
---

连接显示器，打开 RetroArch，按下方向键，熟悉的像素画面便出现在 ArmSoM CM5 驱动的屏幕上。这次，我们用 CM5 开发套件，在原生 Debian 12 桌面环境中搭建了一套复古游戏演示，体验 Falling、GBAtris 和 Snake，也把源码构建路径分享给想亲手复现的开发者。

![ArmSoM CM5 上的 Falling、GBAtris 和 Snake 实机截图拼图](/assets/cm5-retroarch/three-games.png)

*从左到右为 Falling、GBAtris 和 Snake。原始截图以最近邻方式放大拼排，保留像素边缘，不代表游戏以拼图尺寸渲染。*

## 看看 CM5 实机试玩

<video controls playsinline preload="metadata" width="1080" height="1920" style="display:block;width:100%;height:auto;max-width:420px;aspect-ratio:9/16;margin:1.5rem auto;background:#101820" aria-label="ArmSoM CM5 RetroArch 英文竖版演示视频">
  <source src="/assets/cm5-retroarch/retroarch-en-portrait.mp4" type="video/mp4">
  您的浏览器不支持内嵌视频。
</video>

*英文竖版演示视频，可点击播放或切换全屏查看。*

本次演示使用 HDMI 显示器和 USB 键盘。Falling、GBAtris 和 Snake 分别对应 NES、GBA 和 GB 内容，已完成基础运行、键盘操作、暂停及存读档检查。

在 Falling 中控制角色移动，在 GBAtris 中旋转和落下方块，在 Snake 中转向、寻找食物。从选择内容到进入游戏，再到暂停和继续，同一套前端串起了完整的试玩过程。

这些结果对应本次使用的系统、核心与游戏内容，不代表所有游戏兼容，也不是持续帧率或长期稳定性测试结论。

## RetroArch 如何连接不同游戏核心

RetroArch 是开源、跨平台的前端，为模拟器、游戏引擎和媒体播放器提供统一界面。它通过加载不同的 libretro 核心运行相应内容：前端管理菜单、输入和音视频，核心负责具体平台的模拟或内容运行。玩家可以在同一套界面中选择游戏、配置操作，并使用相应核心支持的即时存档等功能。

对爱好者来说，统一入口便于整理游戏库；对开发者来说，开放源码和模块化核心也便于围绕 Linux 设备构建专属的交互体验。这次项目使用 RetroArch 前端及 Nestopia、mGBA 核心，将社区的软件成果带到 CM5 开发套件上。

![RetroArch 上游 README 中的 XMB 菜单示意图](/assets/cm5-retroarch/retroarch-xmb-readme.jpg)

*RetroArch XMB 菜单示意图，来自上游 README，不是本次 CM5 实机截图。*

## 小尺寸模块适合动手搭建

ArmSoM CM5 将 Rockchip RK3576、内存和板载存储集成在 55 × 40 mm 的计算模块上。配合载板，它可以成为桌面上的游戏开发套件；围绕按键、屏幕和外壳继续设计，还可以探索小型街机或专用交互终端。

![ArmSoM CM5 计算模块产品图](/assets/cm5-retroarch/armsom-cm5-product.png)

*产品图片来自 ArmSoM 官方文档。计算模块需要配合载板、电源及外设使用。*

RK3576 集成四核 Cortex-A72 和四核 Cortex-A53，最高主频分别为 2.2 GHz 和 1.8 GHz，图形部分为 Mali-G52 MC3 GPU。具体规格以 [ArmSoM CM5 官方产品文档](https://docs.armsom.org/zh/armsom-cm5)及实际硬件版本为准。

本项目已接通 OpenGL ES 3.2 图形路径，通过 HDMI 输出显示，使用 USB 键盘操作。硬件规格提供了开发基础，实际游戏表现仍取决于系统、图形驱动、核心、内容和配置，不应仅凭处理器参数推断兼容性。

## 从试玩继续走向源码构建

除了体验现成应用，我们还在 CM5 原生 Debian 12 环境中，从未修改的上游源码编译了 RetroArch 1.22.2，并完成安装与 Falling 运行验证；测试核心使用 Debian 软件包。

这里需要区分两组验证：三款游戏的试玩检查，是本次演示的运行记录；上游源码构建后的运行验证，则明确对应 Falling。不能将后者扩展成对所有核心或所有游戏的验证。

相关构建教程已进入 libretro 文档仓库。想复现的开发者，可以按教程准备环境、编译并验证，再把遇到的问题与改进建议反馈给社区。

[阅读 Building RetroArch on ArmSoM CM5 构建教程](https://github.com/libretro/docs/blob/master/docs/guides/armsom-cm5.md)

![libretro docs 仓库中的 ArmSoM CM5 构建教程页面截图](/assets/cm5-retroarch/github-cm5-tutorial.png)

*素材包提供的教程页面截图；最新内容以链接中的文档为准。*

![RetroArch 上游源码仓库页面截图](/assets/cm5-retroarch/github-retroarch-source.png)

*RetroArch 上游源码仓库，便于继续查阅实现、构建说明与项目更新。*

## 开始自己的 CM5 项目

如果你想搭建类似的演示，可以从 CM5 开发套件、合适的电源、HDMI 显示器和 USB 键盘开始，先按教程复现基础环境，再逐项尝试输入设备、核心和自己的界面设计。

- [了解 ArmSoM CM5 产品与硬件资源](https://docs.armsom.org/zh/armsom-cm5)
- [查看 CM5 上的 RetroArch 构建教程](https://github.com/libretro/docs/blob/master/docs/guides/armsom-cm5.md)
- [访问 RetroArch 上游源码](https://github.com/libretro/RetroArch)
- [阅读 Libretro 官方文档](https://docs.libretro.com/)
- [继续了解 CM5 载板设计](/zh/articles/019-cm5-carrier-production/)

本次演示使用开源游戏。游戏、核心、项目截图及其他素材保留各自的权利归属；使用和分发时应遵守相应许可。本文运行结果来自本次项目记录，不构成对其他系统镜像、核心版本或商业游戏的兼容性承诺。
