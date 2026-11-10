---
title: "RK3528 电气与热设计：电源、I/O 和热阻"
description: "区分绝对最大值和推荐条件，保留 TBD 与测试条件，核对电源、USB、PLL、温度和热阻。"
excerpt: "区分绝对最大值和推荐条件，保留 TBD 与测试条件，核对电源、USB、PLL、温度和热阻。"
translation_key: "rk3528-electrical-power-thermal"
slug: "rk3528-electrical-power-thermal"
lang: "zh"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige1"]
tags: ["RK3528", "datasheet", "hardware design", "ArmSoM"]
image: "/assets/datasheet-series-20261110/rk3528-datasheet-p14.png"
---

本文基于指定版本数据手册整理。表中数值是原厂规格，不是 ArmSoM 实测；未新增硬件验证。使用前核对实际芯片版本、板卡原理图、SDK/BSP、内核和驱动。专题解释与可编辑表格用于辅助阅读，完整规范及未展开的位定义请查阅原始 PDF。

**RK3528 · Rockchip RK3528 Datasheet V1.0-20230522.pdf · PDF 23–28.**


[![RK3528 电气与热设计：电源、I/O 和热阻](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)

*英文原图，来源 PDF 第 14.*


## 额定边界与工作点

绝对最大值不是稳压器正常设定值。推荐 Min/Typ/Max 也不能替代上电顺序、动态压降和芯片频率电压表。应在芯片供电点测量启动、空闲和负载切换，而不只看稳压模块输出。

## 推荐供电与时钟


### PDF 23


| 电源／时钟 | Min | Typ | Max | 单位 |
|---|---|---|---|---|
| CPU_DVDD | 0.81 | 0.90 | TBD | V |
| GPU_DVDD | 0.81 | 0.90 | TBD | V |
| LOGIC_DVDD | 0.81 | 0.90 | 0.99 | V |
| PMU_LOGIC_DVDD | 0.81 | 0.90 | 0.99 | V |
| PMU_PLL_AVDD1V8<br>DDR_PLL_AVDD1V8 | 1.62 | 1.8 | TBD | V |
| VCCIOi(i=0~4) | 1.62<br>3.0 | 1.8<br>3.3 | 1.98<br>3.465 | V |
| PMUIO_VCC3V3 | 3.0 | 3.3 | 3.465 | V |
| HDMI_TX_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| USB20_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| USB20_AVDD3V3 | 3.0 | 3.3 | 3.6 | V |
| FEPHY_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| FEPHY_AVDD3V3 | 2.97 | 3.3 | 3.63 | V |
| OTP_VCC1V8 | 1.62 | 1.8 | 1.98 | V |
| VDAC_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| ACODEC_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |


### PDF 24


| 电源／时钟 | Min | Typ | Max | 单位 |
|---|---|---|---|---|
| PCIE20_USB30_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| SARADC_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| DDR3 / DDR_VDDQ | 1.425 | 1.5 | 1.575 | V |
| DDR3L / DDR_VDDQ | 1.283 | 1.35 | 1.417 | V |
| LPDDR3 / DDR_VDDQ | 1.14 | 1.2 | 1.3 | V |
| DDR4 / DDR_VDDQ | 1.14 | 1.2 | 1.3 | V |
| LPDDR4 / DDR_VDDQ | 1.06 | 1.1 | 1.17 | V |
| LPDDR4X / DDR_VDDQL | 0.54 | 0.6 | 0.66 | V |
| CPU | NA | NA | TBD | GHz |
| GPU | NA | NA | TBD | MHz |
| TA | 0 | NA | 80 | ℃ |



## GPIO 电平与内部电阻



| 项目 | 规格／原稿说明 |
|---|---|
| 3.3 V I/O: VIL | −0.3…0.8 V |
| 3.3 V I/O: VIH | 2.0…VDDO+0.3 V |
| 3.3 V I/O: VOL | −0.3…0.4 V |
| 3.3 V I/O: VOH | 2.4…VDDO+0.3 V |
| 1.8 V I/O: VIL max | 0.35 × VDDO |
| 1.8 V I/O: VIH min | 0.65 × VDDO |
| 1.8 V I/O: VOH min | 1.4 V |
| 内部上拉／下拉 | 16 / 26 / 43 kΩ (Min/Typ/Max) |



## PLL 与 USB 参数



| 项目 | 规格／原稿说明 |
|---|---|
| PLL integer: Fin / Fvco / Fout | 10–800 / 475–1900 / 9–1900 MHz |
| PLL integer: lock | 1000 typ / 1500 max input-clock cycles |
| PLL fractional: Fin / Fvco / Fout | 1–1200 / 950–3800 / 19–3800 MHz |
| PLL fractional: lock | 250 typ / 500 max input-clock cycles |
| USB output resistance | 40.5 / 45 / 49.5 Ω |
| USB HS high | 360 / 400 / 440 mV |
| USB HS low | −40 / 0 / 40 mV |
| USB disconnect | 570 / 600 / 664 mV |
| USB squelch | 100 / NA / 150 mV |



## 温度与散热边界

热阻是指定 PCB 模型的原厂仿真，不是 ArmSoM 板卡实测。外壳、铜面积、气流、散热器和功耗分布都会影响温升。传感器测量范围也不能代替环境工作温度。

| 项目 | 规格／原稿说明 |
|---|---|
| θJA / θJB / θJC | 22.8 / 9.3 / 6.87 °C/W |
| 热模型 | 4-layer PCB · 114.3 × 101.6 mm |
| Tj | 原稿要求低于 125 °C |
| Ta | 0…80 °C |
| SARADC | 10 bit · ≤1 MS/s |
| TSADC | −40…125 °C · ±3 °C accuracy · 0.6 °C resolution |



## 保留原文疑点

RK3528 绝对最大值表多项为 TBD，CPU/GPU 最大电压和频率也未确定，PLL 推荐供电上限仍为 TBD，不能用其他芯片补齐。功能章节温度分辨率写 5 °C，电气表写 0.6 °C、精度 ±3 °C。热章节要求 Tj 低于 125 °C，但绝对最大值温度行写 NA；这些差异需向供应商核对。

模拟 DAC 的 93 dB SNR、−84 dB THD 来自 1 kHz 信号、48 kHz 采样、600 Ω 等原稿条件，不是所有负载的性能承诺。

## ArmSoM 产品与应用边界

Sige1 是 RK3528 产品入口；芯片支持的接口并不意味着板卡全部引出。具体连接器、电压、镜像与引脚定义以 Sige1 文档为准。

- [Sige1](https://www.armsom.org/sige1) · [Docs](https://docs.armsom.org/armsom-sige1)

## 数据手册专题与原始 PDF

- [RK3528 总览](/zh/articles/rk3528-datasheet-v10/)
- [RK3528 架构与接口详解：内存、4K 视频及共享 PHY](/zh/articles/rk3528-architecture-memory-media/)
- [RK3528 封装与引脚：401 球完整编号表](/zh/articles/rk3528-package-pin-reference/)
- [RK3528 电气与热设计：电源、I/O 和热阻](/zh/articles/rk3528-electrical-power-thermal/)
- [下载完整原始 PDF](/assets/datasheet-series-20261110/Rockchip-RK3528-Datasheet-V1.0-20230522.pdf)
