---
title: "Rockchip 异常掉电保护：eMMC/UFS、PMIC 阈值与复位方案完整说明"
description: "Rockchip 异常掉电保护：eMMC/UFS、PMIC 阈值与复位方案完整说明 — RK806, RK817/RK809, RK801, RK805; V1.0.0."
translation_key: "098-rockchip-power-loss-protection"
slug: "098-rockchip-power-loss-protection"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: ["ArmSoM", "Rockchip", "eMMC", "UFS", "PMIC", "RK3588"]
excerpt: "Rockchip 异常掉电保护：eMMC/UFS、PMIC 阈值与复位方案完整说明 — RK806, RK817/RK809, RK801, RK805; V1.0.0."
---

{% raw %}

# Rockchip 异常掉电保护：eMMC/UFS、PMIC 阈值与复位方案完整说明

本文依据 RK-KF-YF-C45 / V1.0.0 中文原稿，完整保留技术正文。没有对应英文 PDF，英文、俄文和德文均由中文完整翻译；原稿无独立技术图片，补丁恢复为可复制代码，没有伪称存在英文配图。原稿产品范围写“所有产品”、内核版本未指定，但不能据此推断所有 ArmSoM 板卡均适用。本文仅为平台参考：须先核对实际板卡 SoC、PMIC 型号及接线、eMMC/UFS 支持列表、供电跌落曲线、复位时序、SDK/BSP、U-Boot 与内核分支。原稿 RK3588 DTS 路径是厂商参考示例，不是 ArmSoM 实测或通用补丁。未进行硬件掉电、数据可靠性或阈值测量。

> 先评估硬件再修改阈值；错误的欠压复位配置可能造成复位循环或数据损坏。本文不执行补丁、刷机或掉电测试。原稿“3.2V 默认阈值”与补丁旧值 2700mV 存在表述差异，保留并记录，不猜测修正。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-power-loss-protection/EDITORIAL-NOTES.md)

## 1. 前言

本文旨在为嵌入式系统、工业设备及消费电子产品设计人员提供 eMMC/UFS 存储器件在异常掉电场景下的数据保护实施方案。

对于支持列表中标注需要提升异常掉电复位电压的型号，请根据以下不同供电方案进行处理。

未标注的型号若遇到异常掉电问题，亦可参考本文提供的实施方案。

## 2. 异常掉电保护方案

选用的 eMMC 和 UFS 器件必须为 Rockchip 发布的支持列表中的型号，以确保其通过了异常掉电可靠性测试。

当异常掉电发生时，在 eMMC（或 UFS）的 VCC 供电仍处于正常范围内时复位主控，可有效降低系统功耗，延长 VCC 电压跌落时间。同时，主控将停止向 eMMC（或 UFS）发送数据，避免错误数据写入 eMMC（或 UFS）中或发生地址错位问题。

### 2.1 RK806

请更改 kernel 的 DTS，把关机电压（`shutdown_voltage_threshold`）提高到 3.2V。当 PMIC 输入电压低于 3.2V（原文称“默认阈值”）时，PMIC 将自动复位主控。

下面是参考补丁，不同项目需要修改不同文件：

```diff
diff --git a/arch/arm64/boot/dts/rockchip/rk3588-rk806-single.dtsi b/arch/arm64/boot/dts/rockchip/rk3588-rk806-single.dtsi
index 62f3403789b7..df6c601a468b 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588-rk806-single.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-rk806-single.dtsi
@@ -30,7 +30,7 @@ rk806single: rk806single@0 {
                /* 2800mv-3500mv */
                low_voltage_threshold = <3000>;
                /* 2700mv-3400mv */
-               shutdown_voltage_threshold = <2700>;
+               shutdown_voltage_threshold = <3200>;
                /* 140 160 */
                shutdown_temperture_threshold = <160>;
                hotdie_temperture_threshold = <115>;
```

### 2.2 RK817/RK809

请将以下补丁更新至 U-Boot：当 PMIC 输入电压低于 3.2V（原文称“默认阈值”）时，PMIC 将自动复位主控。

```diff
From 571669bdf3facc1d25f746630dd42236ffb55811 Mon Sep 17 00:00:00 2001
From: Shengfei Xu <xsf@rock-chips.com>
Date: Tue, 27 May 2025 17:52:50 +0800
Subject: [PATCH] pmic: rk8xx: rk809/rk17: Configure low-voltage shutdown
 threshold
Set low-voltage shutdown threshold to 3200mV
Change-Id: Icdf6b8cfdae9a91d6c7d71ee0e1130968804a3e6
Signed-off-by: Shengfei Xu <xsf@rock-chips.com>
---
 drivers/power/pmic/rk8xx.c | 2 +-
 include/power/rk8xx_pmic.h | 2 +-
 2 files changed, 2 insertions(+), 2 deletions(-)
diff --git a/drivers/power/pmic/rk8xx.c b/drivers/power/pmic/rk8xx.c
index 0820881a80c..da92ea4e36e 100644
--- a/drivers/power/pmic/rk8xx.c
+++ b/drivers/power/pmic/rk8xx.c
@@ -172,7 +172,7 @@ static struct reg_data rk817_init_reg[] = {
  * the under-voltage protection will shutdown the LDO3 and reset the PMIC
  */
    { RK817_BUCK4_CMIN, 0x6e, 0x6e},
-   { RK817_PMIC_SYS_CFG1, 0x20, 0x70},
+   { RK817_PMIC_SYS_CFG0, 0x24, 0x7f},
    /* Set pmic_sleep as none function */
    { RK817_PMIC_SYS_CFG3, 0x00, 0x18 },
    /* GATE pin function: gate function */
diff --git a/include/power/rk8xx_pmic.h b/include/power/rk8xx_pmic.h
index 068f009942c..edf90d33513 100644
--- a/include/power/rk8xx_pmic.h
+++ b/include/power/rk8xx_pmic.h
@@ -213,7 +213,7 @@ enum {
 #define RK8XX_ID_MSK   0xfff0
 #define RK817_PMIC_CHRG_TERM   0xe6
-#define RK817_PMIC_SYS_CFG1    0xf1
+#define RK817_PMIC_SYS_CFG0    0xf1
 #define RK817_PMIC_SYS_CFG3    0xf4
 #define RK817_GPIO_INT_CFG 0xfe
---
2.34.1
```

### 2.3 RK801

默认已经支持供电电压低于 3.6V 时复位主控，不需要更新补丁。

### 2.4 RK805

RK805 不支持低电复位主控，不建议选用支持列表中要求提高复位电压的 eMMC（UFS）器件。

### 2.5 外部复位 IC

复位 IC 检测的电压为 eMMC 的 VCC 供电，需选用阈值电压 ≥2.93V 的复位 IC。当 VCC 电压跌落至 2.93V 以下时，复位 IC 将立即复位主控。

### 2.6 有后备电源

对于有后备电池或电容供电方案的系统，可实时监测 DC 电源电压跌落情况，并触发正常关机流程以确保数据安全。

不需要额外更新补丁。

### 2.7 其他供电方案

如果无法检测掉电和复位主控，不建议选用支持列表中要求提高复位电压的 eMMC（UFS）器件。

{% endraw %}
