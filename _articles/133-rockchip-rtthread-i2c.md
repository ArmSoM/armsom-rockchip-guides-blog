---
title: "Rockchip RT-Thread I2C Guide: Driver Configuration and IOMUX"
description: "I2C configuration has two parts: the driver framework and VENDOR settings. Enable the required I2C buses as below. All buses may be enabled, at the cost of a little extra memory."
excerpt: "I2C configuration has two parts: the driver framework and VENDOR settings. Enable the required I2C buses as below. All buses may be enabled, at the cost of a little extra memory."
translation_key: "133-rockchip-rtthread-i2c"
slug: "133-rockchip-rtthread-i2c"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, I2C, IOMUX]
---

{% raw %}

# Rockchip RT-Thread I2C Guide: Driver Configuration and IOMUX

Complete technical content from Chinese RK-KF-YF-113 V1.0.2. The source covers RK2108/Pisces with RT-Thread 3.1.3. No matching ArmSoM board combination is confirmed, so this is a platform reference: check the SoC, RT-Thread BSP, bus numbers, pin multiplexing, voltage domain and pull-ups before use. This is not Linux I2C configuration or universal board support. Only a Chinese source exists, with no standalone technical figures. English, Russian and German fully translate the text while preserving configuration and original code comments. No hardware validation was performed.

[ArmSoM Docs](https://docs.armsom.org/)

## 1. Functional configuration

I2C configuration has two parts: the driver framework and VENDOR settings. Enable the required I2C buses as below. All buses may be enabled, at the cost of a little extra memory.

```text
# I2C驱动框架
RT_USING_I2C [=y]
# VENDOR驱动，根据需求启用你需要的I2C总线，也可以全开，只是会浪费一点点的内存
RT_USING_I2C0 [=y]
RT_USING_I2C1 [=y]
RT_USING_I2C2 [=y]
```

## 2. Board configuration

The RK2108 and Pisces I2C IO pins are multiplexed. Ensure that IOMUX switches the relevant pins to I2C mode. See the IOMUX chapter of the Rockchip RT-Thread development guide. The original PDF link to that guide is an incomplete relative address; no website article URL has been invented.

## 3. Development guide

The Rockchip I2C driver follows the standard RTT I2C driver framework. Refer directly to the [official RTT I2C development guide](https://www.rt-thread.org/document/site/programming-manual/device/i2c/i2c/).

{% endraw %}
