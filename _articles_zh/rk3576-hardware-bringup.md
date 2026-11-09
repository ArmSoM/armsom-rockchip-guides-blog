---
title: "RK3576 硬件设计入门：最小系统与首次上电检查"
description: "把“板子能启动”拆成可验证的步骤：电源、时钟、复位、启动介质和调试接口，并区分 RK3576 芯片设计与 CM5 载板开发。"
excerpt: "把“板子能启动”拆成可验证的步骤：电源、时钟、复位、启动介质和调试接口，并区分 RK3576 芯片设计与 CM5 载板开发。"
translation_key: "rk3576-hardware-bringup"
slug: "rk3576-hardware-bringup"
lang: "zh"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: production
products: ["CM5", "Sige5"]
tags: ["Rockchip", "ArmSoM", "hardware design"]
image: "/assets/hardware-design-series/rk3576-hardware-bringup-zh.svg"
---

# RK3576 硬件设计入门：最小系统与首次上电检查

![阅读路线](/assets/hardware-design-series/rk3576-hardware-bringup-zh.svg)

## 适用范围与资料

本篇为围绕工程问题编写的专题导读，不是整本 PDF 的逐页翻译。原文示例不代表 ArmSoM 实测；具体电压、引脚、SDK/BSP 和内核应按实际板卡版本核对。

**Rockchip:** `RK3576_Hardware_Design_Guide_V1.1_20240528_CN.pdf` · V1.1 · §2.1, §2–3

## 从最小系统开始

RK3576 硬件设计指南 V1.1 的第 2.1 节依次讨论时钟、复位、引导、JTAG、UART 和存储。第一次调试不必同时接入摄像头、显示器和高速外设。先建立一套能重复启动、输出串口日志、进入恢复模式的最小配置，再逐项增加负载。这样每次出现异常时，都能知道最近改变了什么。

在自研芯片主板上，DDR、供电和时钟属于最小系统；使用 CM5 时，应从模块接口与配套载板资料出发，避免把芯片内部电源轨当作模块输入。Sige5 可用于应用与外设验证，但不能替代自研板的电气验证。

## 首次上电的五道检查

| 检查项 | 上电前 | 上电后保留的证据 |
| --- | --- | --- |
| 电源 | 按实际 BOM 核对电压、极性、短路与限流设置 | 输入电流、各电源轨及启动瞬态 |
| 时钟 | 核对晶体、负载网络与 PCB | 使用适合的探测方法检查频率与波形 |
| 复位 | 核对电源域、上下拉和复位源 | 电源稳定与复位释放的相对时间 |
| 启动 | 确认介质、配置电阻、Loader 和板卡版本 | 从 BootROM/Loader 到内核的完整日志 |
| 调试 | 保留 UART、恢复和必要测试点 | 冷启动、重启与失败恢复的可重复结果 |

原稿 §2.1.1 以外部 24MHz 晶体说明主时钟电路；这不是要求在 CM5 载板再增加同样的晶体。复位电平和调试串口电平也应按对应网络的电源域核对，不能套用其他开发板的默认设置。

## 启动异常如何缩小范围

没有串口输出时，先检查适配器电平、公共地、TX/RX、波特率与供电复位，而不是立即更换系统镜像。已有 Loader 日志却无法进入内核时，再检查 DDR 初始化、启动介质、镜像和设备树是否属于同一硬件版本。内核起来后外设失效，应分别核对接口供电、引脚复用、时钟与驱动。

每轮只改变一个变量，并记录原理图版本、模块版本、镜像校验值和日志。启动成功之后，还需要重复冷启动、掉电恢复和负载测试；单次启动不能作为量产放行依据。

## 在 ArmSoM 上落实

用 CM5 开发定制设备时，先以配套 IO 板建立软件基线，再迁移到自己的载板。用 Sige5 评估应用时，记录外设型号、线缆和供电条件，方便后续复现。本文提供调试方法，没有给出未经验证的通用电压表，也不代替具体硬件的设计审查。

## 原文配图

[![原文配图 — rk3576](/assets/hardware-design-series/rk3576-cn.png)](/assets/hardware-design-series/rk3576-cn.png)

中文稿原图。 参考设计，不是 ArmSoM 板卡原理图。

`RK3576_Hardware_Design_Guide_V1.1_20240528_CN.pdf` · PDF p. 23.

## 相关产品与开发资料

- **CM5** — [产品页面](https://www.armsom.org/cm5) · [开发文档](https://docs.armsom.org/armsom-cm5)
- **Sige5** — [产品页面](https://www.armsom.org/sige5) · [开发文档](https://docs.armsom.org/armsom-sige5)

## 继续阅读本系列

- [ArmSoM CM5 载板设计检查表：供电、启动与接口规划](/zh/articles/019-cm5-carrier-production/)
- [RK3576 高速接口设计：原理图与 PCB 如何配合检查](/zh/articles/rk3576-high-speed-interface-design/)
- [RK3588S 硬件设计指南：从芯片参考设计到 CM7s 载板](/zh/articles/rk3588s-cm7s-carrier-design/)
- [RK3588 边缘 AI 设备设计：供电、散热与扩展接口规划](/zh/articles/rk3588-edge-ai-hardware-design/)
- [RK3588 高速 PCB 设计：叠层、阻抗与布线检查](/zh/articles/rk3588-high-speed-pcb-review/)
- [RK3506 工业 HMI 硬件设计：结合 CM1 与 Forge1 选择开发路径](/zh/articles/rk3506-industrial-hmi-hardware/)
- [RK3308 系列芯片差异与兼容检查：P2 Pro 音频项目参考](/zh/articles/rk3308-hardware-variant-compatibility/)
- [RK3588S 与 RK3588S2 有什么区别？改版前需要核对什么](/zh/articles/rk3588s-rk3588s2-hardware-differences/)
- [Rockchip 设备从样机到量产：工艺要求与测试清单](/zh/articles/rockchip-hardware-production-checklist/)
