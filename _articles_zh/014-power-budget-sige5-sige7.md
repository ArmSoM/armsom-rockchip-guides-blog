---
title: "ArmSoM Sige5 与 Sige7 部署中的供电预算"
description: "替代 Raspberry Pi 或 Jetson Nano 硬件时，如何可重复地验证输入电压、峰值电流、散热及线缆压降。"
translation_key: "014-power-budget-sige5-sige7"
slug: "power-budget-sige5-sige7"
date: 2026-10-14
author: "ArmSoM Editorial"
category: power
products: [Sige5, Sige7, CM5]
tags: [power, thermal, Sige5, Sige7, RK3576, RK3588]
keywords: "ArmSoM Sige5 与 Sige7 部署中的供电预算, Sige5, Sige7, CM5"
lang: zh
---

# ArmSoM Sige5 与 Sige7 部署中的供电预算

![整机供电验证链路](../assets/014-power-budget.svg)

ArmSoM 文档给出的 Sige5 和 Sige7 输入范围为 5–23 V，CM5 模块则使用 5 V 电源轨。输入额定值说明板卡接受的供电条件，并不能说明 SSD、摄像头、USB 设备或风扇的电流峰值。

## 测量完整系统

在板卡连接器处使用串接式电表或示波器。同时测试冷启动、CPU 负载、NPU 负载、显示、网络流量和存储活动。记录板卡端电压，而不仅是适配器端电压。

```bash
for z in /sys/class/thermal/thermal_zone*/temp; do
  printf '%s ' "$z"; cat "$z"; done
cat /sys/devices/system/cpu/cpufreq/policy*/scaling_cur_freq
```

为线缆电阻和瞬态负载预留电源裕量。实验台上正常的 PD 协商，可能在线缆较长或机箱风扇同时启动时失败。

## 迁移边界

Raspberry Pi HAT 的供电假设以及 Jetson Nano 圆孔电源接口的要求，不能直接套用于 ArmSoM 连接器。应重新确定连接器引脚、PD 档位、导热接口和机箱气流等设计条件。

## 参考链接

- [Sige5 官方规格与文档](https://docs.armsom.org/armsom-sige5)
- [Sige7 官方规格与文档](https://docs.armsom.org/armsom-sige7)
- [Sige 系列入门与供电指南](https://docs.armsom.org/sige-family-started)

## 发布前核对

- [ ] 报告电源、线缆、外设负载和环境条件。
- [ ] 测试最不利的组合负载。
- [ ] 不要将输入电压范围表述为实际功耗。
