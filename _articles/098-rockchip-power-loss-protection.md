---
title: "Rockchip Power-Loss Protection: Complete eMMC/UFS, PMIC Threshold and Reset Guide"
description: "Rockchip Power-Loss Protection: Complete eMMC/UFS, PMIC Threshold and Reset Guide — RK806, RK817/RK809, RK801, RK805; V1.0.0."
translation_key: "098-rockchip-power-loss-protection"
slug: "098-rockchip-power-loss-protection"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: ["ArmSoM", "Rockchip", "eMMC", "UFS", "PMIC", "RK3588"]
excerpt: "Rockchip Power-Loss Protection: Complete eMMC/UFS, PMIC Threshold and Reset Guide — RK806, RK817/RK809, RK801, RK805; V1.0.0."
---

{% raw %}

# Rockchip Power-Loss Protection: Complete eMMC/UFS, PMIC Threshold and Reset Guide

This article preserves the complete technical body of the Chinese RK-KF-YF-C45 / V1.0.0 source. No corresponding English PDF was supplied; English, Russian and German fully translate the Chinese original. The source has no independent technical images; patches are editable code, not purported English figures. The source lists “all products” without a specific kernel version, but this does not establish applicability to every ArmSoM board. This is a platform reference only: verify the actual board SoC, PMIC model and wiring, eMMC/UFS support list, supply-voltage decay, reset timing, SDK/BSP, U-Boot and kernel branch. The original RK3588 DTS path is a vendor example, not an ArmSoM-tested or universal patch. No hardware power-loss, data-reliability or threshold measurements were performed.

> Assess the hardware before changing thresholds: incorrect undervoltage-reset configuration can cause reset loops or data corruption. No patches, firmware flashing or power-loss tests are executed here. The source wording “3.2V default threshold” differs from the old patch value of 2700mV; both are preserved and documented, not silently reconciled.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-power-loss-protection/EDITORIAL-NOTES.md)

## 1. Introduction

This document provides designers of embedded systems, industrial equipment and consumer electronics with implementation schemes for protecting data in eMMC/UFS storage during unexpected power loss.

For models marked in the support list as requiring a higher power-loss reset voltage, apply the appropriate power-supply scheme below.

Unmarked models experiencing unexpected-power-loss problems may also refer to these implementation schemes.

## 2. Power-loss protection schemes

The selected eMMC and UFS devices must be models on the Rockchip-published support list to ensure they have passed unexpected-power-loss reliability testing.

When unexpected power loss occurs, resetting the controller while eMMC (or UFS) VCC remains within its normal range reduces system power consumption and extends the VCC decay time. The controller also stops sending data to eMMC (or UFS), avoiding incorrect data writes or address misalignment.

### 2.1 RK806

Modify the kernel DTS to raise the shutdown voltage (`shutdown_voltage_threshold`) to 3.2V. When the PMIC input falls below 3.2V (called the “default threshold” in the source), the PMIC automatically resets the controller.

The following is a reference patch; different projects require changes to different files:

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

Apply the following patch to U-Boot: when the PMIC input voltage falls below 3.2V (the source calls this the “default threshold”), the PMIC automatically resets the controller.

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

Resetting the controller when the supply falls below 3.6V is already supported by default; no patch update is required.

### 2.4 RK805

RK805 does not support resetting the controller on low voltage. Using eMMC (UFS) devices marked in the support list as requiring a higher reset voltage is not recommended.

### 2.5 External reset IC

The reset IC monitors the eMMC VCC supply. Select a reset IC with a threshold voltage ≥2.93V. When VCC falls below 2.93V, the reset IC immediately resets the controller.

### 2.6 Backup power supply

Systems with a backup battery or capacitor supply can monitor DC supply-voltage drops in real time and trigger the normal shutdown sequence to ensure data safety.

No additional patch update is required.

### 2.7 Other power-supply schemes

If power loss cannot be detected and the controller cannot be reset, using eMMC (UFS) devices marked in the support list as requiring a higher reset voltage is not recommended.

{% endraw %}
