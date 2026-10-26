---
title: "Rockchip RT-Thread I2C 开发指南：驱动配置与 IOMUX"
description: "I2C 的功能配置分成驱动框架和 VENDOR 配置两个部分，需要以下配置。按需求启用 I2C 总线，也可以全部启用，但会额外占用少量内存。"
excerpt: "I2C 的功能配置分成驱动框架和 VENDOR 配置两个部分，需要以下配置。按需求启用 I2C 总线，也可以全部启用，但会额外占用少量内存。"
translation_key: "133-rockchip-rtthread-i2c"
slug: "133-rockchip-rtthread-i2c"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, I2C, IOMUX]
---

{% raw %}

# Rockchip RT-Thread I2C 开发指南：驱动配置与 IOMUX

本文完整整理中文 RK-KF-YF-113 V1.0.2 的技术正文。原稿范围是 RK2108/Pisces、RT-Thread 3.1.3。尚未确认对应 ArmSoM 板卡组合，因此作为平台参考；使用前需核对 SoC、RT-Thread BSP、总线编号、引脚复用、电压域和上拉电阻，不等同于 Linux I2C 配置或全板支持。只有中文原稿，无独立技术图；英文、俄文、德文完整翻译正文，保留配置及原代码注释。未进行硬件验证。

[ArmSoM Docs](https://docs.armsom.org/)

## 1. 功能配置

I2C 的功能配置分成驱动框架和 VENDOR 配置两个部分，需要以下配置。按需求启用 I2C 总线，也可以全部启用，但会额外占用少量内存。

```text
# I2C驱动框架
RT_USING_I2C [=y]
# VENDOR驱动，根据需求启用你需要的I2C总线，也可以全开，只是会浪费一点点的内存
RT_USING_I2C0 [=y]
RT_USING_I2C1 [=y]
RT_USING_I2C2 [=y]
```

## 2. 板级配置

RK2108 和 Pisces 的 I2C IO 都是复用的，因此需确保 IOMUX 配置把相关 IO 切换为 I2C 模式。具体参见 Rockchip RT-Thread 开发指南中的 IOMUX 章节。原 PDF 指向该指南的链接为不完整相对地址，未伪造网站内文章链接。

## 3. 开发指南

Rockchip I2C 驱动遵循 RTT 系统标准 I2C 驱动框架，可直接参考 [RTT 官方 I2C 开发指南](https://www.rt-thread.org/document/site/programming-manual/device/i2c/i2c/)。

{% endraw %}
