---
title: "RK3588S 与 RK3588S2 有什么区别？改版前需要核对什么"
description: "根据 V1.0 差异说明，重点核对 MIPI CSI RX、AN37/AN38 球位和软件映射，不把型号相近当作直接兼容。"
excerpt: "根据 V1.0 差异说明，重点核对 MIPI CSI RX、AN37/AN38 球位和软件映射，不把型号相近当作直接兼容。"
translation_key: "rk3588s-rk3588s2-hardware-differences"
slug: "rk3588s-rk3588s2-hardware-differences"
lang: "zh"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: production
products: ["CM7s"]
tags: ["Rockchip", "ArmSoM", "hardware design"]
image: "/assets/hardware-design-series/rk3588s-rk3588s2-hardware-differences-zh.svg"
---

# RK3588S 与 RK3588S2 有什么区别？改版前需要核对什么

![阅读路线](/assets/hardware-design-series/rk3588s-rk3588s2-hardware-differences-zh.svg)

## 适用范围与资料

本篇为围绕工程问题编写的专题导读，不是整本 PDF 的逐页翻译。原文示例不代表 ArmSoM 实测；具体电压、引脚、SDK/BSP 和内核应按实际板卡版本核对。

**Rockchip:** `RK3588S与RK3588S2差异说明_V1.0_20231214_CN.pdf` · V1.0 · §1–2

## 变化集中在摄像头输入 PHY

原稿第 1 章说明：RK3588S 有两组 MIPI D/C-PHY CSI_RX 和一组 MIPI DPHY CSI_RX；RK3588S2 改为一组 D/C-PHY 和两组 DPHY。这不是简单增加一个相同接口，而是 PHY 类型和接口分布发生变化。

对既有设计，先确认传感器使用 D-PHY 还是 C-PHY、lane 配置和连接器映射。软件中的端口编号也不能只按原名字沿用。CM7s 官方资料对应 RK3588S，不能因为阅读了 S2 文档就把它宣传为 S2 产品。

## 球位和端口变化

| 对照项 | RK3588S | RK3588S2 |
| --- | --- | --- |
| 原 D/C-PHY CSI_RX PORT0 位置 | D/C-PHY，1×4 lane | DPHY CSI_RX PORT0，1×4 或 2×2 lane |
| AN37/AN38 | GND | 新增 MIPI_CSI0_CLK1P/MIPI_CSI0_CLK1N |
| D/C-PHY CSI_RX PORT1 | 原接口 | 功能保持不变 |
| 原 DPHY CSI_RX PORT0 位置 | PORT0 | 更名为 DPHY CSI_RX PORT1 |

AN37/AN38 从接地球位变为时钟功能，是不能遗漏的硬件差异。设计审查应逐个核对原表中的完整球位清单，不能只凭端口名称判断连线。

## 旧 PCB 与新 PCB 是两种场景

原文第 2 章要求：在原 RK3588S PCB 上贴 RK3588S2 时，需要 RK 的兼容补丁并调整接口映射。对于新设计的 S2 PCB，应使用新的 S2 参考设计；原稿写最多支持 5 路摄像头。

“最多 5 路”属于该芯片参考方案的能力描述，不是 CM7s 的接口承诺，也没有说明任意分辨率、帧率和 ISP 配置都能同时运行。原稿没有提供补丁文件名、BSP 提交或完整并发限制，项目必须取得与实际软件版本匹配的资料。

## 改版前的放行清单

1. 锁定实际芯片丝印、PCB 和模块版本。
2. 对照球位、PHY 类型和传感器模式，检查原理图与实装连接。
3. 核对兼容补丁、设备树端口、时钟与复位。
4. 单路验证后，再按目标组合验证采集、丢帧和恢复。
5. 在生产记录中保存硬件版本和镜像校验值。

本文为差异解读，未执行芯片替换或摄像头并发测试。

## 原文配图

[![原文配图 — s2](/assets/hardware-design-series/s2-cn.png)](/assets/hardware-design-series/s2-cn.png)

中文稿原图。 参考设计，不是 ArmSoM 板卡原理图。

`RK3588S与RK3588S2差异说明_V1.0_20231214_CN.pdf` · PDF p. 6.

## 相关产品与开发资料

- **CM7s** — [产品页面](https://www.armsom.org/cm7s) · [开发文档](https://docs.armsom.org/armsom-cm7s)

## 继续阅读本系列

- [RK3576 硬件设计入门：最小系统与首次上电检查](/zh/articles/rk3576-hardware-bringup/)
- [ArmSoM CM5 载板设计检查表：供电、启动与接口规划](/zh/articles/019-cm5-carrier-production/)
- [RK3576 高速接口设计：原理图与 PCB 如何配合检查](/zh/articles/rk3576-high-speed-interface-design/)
- [RK3588S 硬件设计指南：从芯片参考设计到 CM7s 载板](/zh/articles/rk3588s-cm7s-carrier-design/)
- [RK3588 边缘 AI 设备设计：供电、散热与扩展接口规划](/zh/articles/rk3588-edge-ai-hardware-design/)
- [RK3588 高速 PCB 设计：叠层、阻抗与布线检查](/zh/articles/rk3588-high-speed-pcb-review/)
- [RK3506 工业 HMI 硬件设计：结合 CM1 与 Forge1 选择开发路径](/zh/articles/rk3506-industrial-hmi-hardware/)
- [RK3308 系列芯片差异与兼容检查：P2 Pro 音频项目参考](/zh/articles/rk3308-hardware-variant-compatibility/)
- [Rockchip 设备从样机到量产：工艺要求与测试清单](/zh/articles/rockchip-hardware-production-checklist/)
