---
title: "RK3528 / RK3528A 硬件设计系列：9 个工程专题"
description: "RK3528 / RK3528A 硬件设计系列：9 个工程专题. 从启动、电源和 DDR 到高速接口、PCB、热设计与生产，按工程问题阅读两份 V1.0 指南。"
excerpt: "RK3528 / RK3528A 硬件设计系列：9 个工程专题. 从启动、电源和 DDR 到高速接口、PCB、热设计与生产，按工程问题阅读两份 V1.0 指南。"
translation_key: "rk3528-rk3528a-hardware-design-series"
slug: "rk3528-rk3528a-hardware-design-series"
lang: "zh"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige1"]
tags: ["RK3528", "RK3528A", "hardware design"]
image: "/assets/rk3528-hardware-series/rk3528-p18.png"
---

# RK3528 / RK3528A 硬件设计系列：9 个工程专题

本文是依据 RK3528 V1.0（2023-05-25）与 RK3528A V1.0（2023-07-12）中文硬件指南整理的工程专题，不是两本 PDF 的逐字全文翻译。两稿在所述章节高度相近，但并不据此保证芯片可直接替换。ArmSoM [Sige1](https://www.armsom.org/sige1) 的官方[板卡文档](https://docs.armsom.org/armsom-sige1)确认其采用 RK3528，可用于评估 RK3528 系列相关应用；这不表示 Sige1 使用 RK3528A，也不能据此将两款芯片的封装或电气设计直接互换。本文的芯片参考电路不等同于 Sige1 的实际原理图；引脚、封装、BSP/SDK、内核与板卡版本必须按实际产品核对。数值为原稿参考，未经 ArmSoM 硬件实测。

从启动、电源和 DDR 到高速接口、PCB、热设计与生产，按工程问题阅读两份 V1.0 指南。

## 按设计阶段阅读

1. [RK3528 / RK3528A 启动与调试：时钟、复位、Maskrom 和串口](/zh/articles/rk3528-rk3528a-boot-clock-debug/)
2. [RK3528 / RK3528A 电源设计：分立电源、时序与负载验证](/zh/articles/rk3528-rk3528a-power-sequencing/)
3. [RK3528 / RK3528A DDR：拓扑、供电、交换限制与 PCB](/zh/articles/rk3528-rk3528a-ddr-circuit-routing/)
4. [RK3528 / RK3528A 存储与无线接口：eMMC、FSPI、SDMMC、SDIO](/zh/articles/rk3528-rk3528a-storage-sdio-design/)
5. [RK3528 / RK3528A USB 与 PCIe：共享 PHY 和高速通道审查](/zh/articles/rk3528-rk3528a-usb-pcie-design/)
6. [RK3528 / RK3528A 显示与音频：HDMI、CVBS、TSI 和模拟布局](/zh/articles/rk3528-rk3528a-display-audio-design/)
7. [RK3528 / RK3528A 网络与控制：RGMII 时序、PHY、UART、I2C 和 PWM](/zh/articles/rk3528-rk3528a-ethernet-control-interfaces/)
8. [RK3528 / RK3528A PCB 审查：叠层、扇出、回流与保护布局](/zh/articles/rk3528-rk3528a-pcb-stackup-signal-integrity/)
9. [RK3528 / RK3528A 从热设计到量产：散热、回流焊与潮敏管理](/zh/articles/rk3528-rk3528a-thermal-assembly-storage/)

## 两份原稿如何使用

RK3528 与 RK3528A 各有独立 V1.0 指南，全文均为 164 页。本系列将高度相近的设计问题合并为一个阅读路径，并保留各芯片的原图和出处。不能从章节相似推导封装、引脚或固件完全兼容；最终仍需对照所用型号的 PinOut、TRM 和 SDK。

## 继续开发与资料入口

ArmSoM 产品选型应以产品文档为准；本系列不表示 ArmSoM 已提供 RK3528/RK3528A 板卡。已有 ArmSoM 板卡上的接口设计与软件经验可作为方法参考，不能直接套用本系列电压、引脚或 PCB 规则。

- [ArmSoM](https://www.armsom.org/)
- [ArmSoM Docs](https://docs.armsom.org/)
