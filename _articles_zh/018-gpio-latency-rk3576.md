---
title: "ArmSoM RK3576 GPIO 时序：40 针接口相似不代表实时兼容"
description: "用 Sige5 或 CM5 替代 Raspberry Pi 控制器前，验证引脚复用、电压和延迟。"
translation_key: "018-gpio-latency-rk3576"
slug: "gpio-latency-rk3576"
date: 2026-10-14
author: "ArmSoM Editorial"
category: interfaces
products: [Sige5, CM5]
tags: [GPIO, RK3576, Sige5, CM5, real-time Linux]
keywords: "ArmSoM RK3576 GPIO 时序：40 针接口相似不代表实时兼容, Sige5, CM5"
lang: zh
---

# ArmSoM RK3576 GPIO 时序：40 针接口相似不代表实时兼容

![GPIO 时序验证](../assets/018-gpio-realtime.svg)

Sige5 文档描述了兼容 Raspberry Pi 的 40 针排针，CM5 则通过载板提供类似的信号类型。即使称为“兼容”，仍需检查电压、复用功能、上下拉状态、中断路由和时序。

## 验证一个信号

```bash
gpioinfo
gpiomon --num-events=1000 gpiochip0 4
```

使用示波器或逻辑分析仪测量边沿到边沿的延迟和抖动。用户空间 GPIO 循环不保证硬实时；当截止时间是关键要求时，应考虑内核驱动、PREEMPT_RT 或专用外设。

## 迁移边界

Raspberry Pi 的 overlay 和 BCM GPIO 编号不能直接映射到 Rockchip 名称，Jetson GPIO 工具也与平台相关。迁移电气设计与设备树后，应使用最终载板和线束重新进行 EMC 与时序测试。

## 参考链接

- [Sige5 官方规格与文档](https://docs.armsom.org/armsom-sige5)
- [CM5 官方规格与文档](https://docs.armsom.org/armsom-cm5)
- [Linux GPIO 文档](https://docs.kernel.org/driver-api/gpio/index.html)

## 发布前核对

- [ ] 提供电压与引脚复用的验证证据。
- [ ] 报告抖动分布，而非单个最优结果。
- [ ] 明确哪些环节需要硬件定时器或 MCU。
