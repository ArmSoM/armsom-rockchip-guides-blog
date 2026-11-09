---
title: "RK3588 高速 PCB 设计：叠层、阻抗与布线检查"
description: "按 V1.3 指南第 3 章组织一次可交付的高速 PCB 审查，重点关注完整通道和参考平面。"
excerpt: "按 V1.3 指南第 3 章组织一次可交付的高速 PCB 审查，重点关注完整通道和参考平面。"
translation_key: "rk3588-high-speed-pcb-review"
slug: "rk3588-high-speed-pcb-review"
lang: "zh"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: production
products: ["AIM7", "Sige7", "LM7"]
tags: ["Rockchip", "ArmSoM", "hardware design"]
image: "/assets/hardware-design-series/rk3588-high-speed-pcb-review-zh.svg"
---

# RK3588 高速 PCB 设计：叠层、阻抗与布线检查

![阅读路线](/assets/hardware-design-series/rk3588-high-speed-pcb-review-zh.svg)

## 适用范围与资料

本篇为围绕工程问题编写的专题导读，不是整本 PDF 的逐页翻译。原文示例不代表 ArmSoM 实测；具体电压、引脚、SDK/BSP 和内核应按实际板卡版本核对。

**Rockchip:** `RK3588 Hardware Design Guide-CN-V1.3-20230213.pdf` · V1.3 · §2–5

## 先锁定制造能力

PCB 叠层不只是层数。介质厚度、材料、铜厚和制造公差共同决定阻抗与损耗。把目标接口、参考层、线宽线距和计算依据交给板厂确认，再将结果写入约束文件。不能从别人的参考板复制线宽后，就认为阻抗已经相同。

原稿 §3.1 讨论叠层和扇出，§3.2 是通用建议，§3.3 针对 8GT/s 及以上信号，§3.4 分接口给出要求。本篇是审查导读，各接口具体数值仍须查对应章节。

## 三个容易遗漏的通道位置

1. **BGA 与连接器焊盘**：局部寄生电容可能改变阻抗；参考层处理须对应实际焊盘、叠层和仿真。
2. **换层与过孔**：检查信号过孔、残桩和附近回流路径，避免信号换层却没有合理的参考转换。
3. **耦合与保护器件**：既要满足电路功能，也要核对封装与焊盘引起的不连续。增加 ESD 器件不代表高速链路仍然满足要求。

指南还讨论玻纤编织效应。它与材料和走线几何有关，不应仅靠末端蛇形补偿就认定已经解决。

## 布线审查清单

| 检查 | 应留下的结果 |
| --- | --- |
| 参考平面连续性 | 关键网络经过区域的逐段检查 |
| 阻抗与长度 | 板厂确认值、模式相关限值及裕量 |
| 过孔和连接器 | 通道中数量、位置、型号与模型 |
| 电源和回流 | 去耦回路、地连接、接口屏蔽路径 |
| 可测试性 | 测量方法与不会显著破坏通道的接入方式 |

不要为了加测试点在高速线上产生未经评估的长支线。也不要为了“等长”增加不必要的耦合与绕线。

## 从设计审查走向实测

设计规则检查只能发现已编码的规则，不能证明链路裕量。按照目标接口安排信号完整性检查、枚举或训练、目标速率与长期传输验证，并加入实际线缆和机壳。低速能工作但高速失败时，应分别检查通道、供电和软件设置。

使用 ArmSoM 模块时，载板只是完整链路的一部分；使用 Sige7 验证应用时，也不能将其 PCB 结果转移为另一块板的认证。

## 原文配图

[![原文配图 — rk3588](/assets/hardware-design-series/rk3588-cn.png)](/assets/hardware-design-series/rk3588-cn.png)

中文稿原图。 参考设计，不是 ArmSoM 板卡原理图。

`RK3588 Hardware Design Guide-CN-V1.3-20230213.pdf` · PDF p. 20.

## 相关产品与开发资料

- **AIM7** — [产品页面](https://www.armsom.org/aim7) · [开发文档](https://docs.armsom.org/armsom-aim7)
- **Sige7** — [产品页面](https://www.armsom.org/sige7) · [开发文档](https://docs.armsom.org/armsom-sige7)
- **LM7** — [产品页面](https://www.armsom.org/lm7) · [开发文档](https://docs.armsom.org/armsom-lm7)

## 继续阅读本系列

- [RK3576 硬件设计入门：最小系统与首次上电检查](/zh/articles/rk3576-hardware-bringup/)
- [ArmSoM CM5 载板设计检查表：供电、启动与接口规划](/zh/articles/019-cm5-carrier-production/)
- [RK3576 高速接口设计：原理图与 PCB 如何配合检查](/zh/articles/rk3576-high-speed-interface-design/)
- [RK3588S 硬件设计指南：从芯片参考设计到 CM7s 载板](/zh/articles/rk3588s-cm7s-carrier-design/)
- [RK3588 边缘 AI 设备设计：供电、散热与扩展接口规划](/zh/articles/rk3588-edge-ai-hardware-design/)
- [RK3506 工业 HMI 硬件设计：结合 CM1 与 Forge1 选择开发路径](/zh/articles/rk3506-industrial-hmi-hardware/)
- [RK3308 系列芯片差异与兼容检查：P2 Pro 音频项目参考](/zh/articles/rk3308-hardware-variant-compatibility/)
- [RK3588S 与 RK3588S2 有什么区别？改版前需要核对什么](/zh/articles/rk3588s-rk3588s2-hardware-differences/)
- [Rockchip 设备从样机到量产：工艺要求与测试清单](/zh/articles/rockchip-hardware-production-checklist/)
