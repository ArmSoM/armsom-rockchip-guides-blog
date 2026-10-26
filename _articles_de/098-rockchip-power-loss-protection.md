---
title: "Rockchip-Schutz bei plötzlichem Stromausfall: eMMC/UFS, PMIC-Schwellen und Reset"
description: "Rockchip-Schutz bei plötzlichem Stromausfall: eMMC/UFS, PMIC-Schwellen und Reset — RK806, RK817/RK809, RK801, RK805; V1.0.0."
translation_key: "098-rockchip-power-loss-protection"
slug: "098-rockchip-power-loss-protection"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: ["ArmSoM", "Rockchip", "eMMC", "UFS", "PMIC", "RK3588"]
excerpt: "Rockchip-Schutz bei plötzlichem Stromausfall: eMMC/UFS, PMIC-Schwellen und Reset — RK806, RK817/RK809, RK801, RK805; V1.0.0."
---

{% raw %}

# Rockchip-Schutz bei plötzlichem Stromausfall: eMMC/UFS, PMIC-Schwellen und Reset

Der vollständige technische Text basiert auf dem chinesischen Original RK-KF-YF-C45 / V1.0.0. Ein entsprechendes englisches PDF wurde nicht geliefert; Englisch, Russisch und Deutsch wurden vollständig aus dem Chinesischen übersetzt. Die Quelle enthält keine eigenständigen technischen Abbildungen; Patches liegen als editierbarer Code vor und werden nicht als englische Originalbilder ausgegeben. Die Quelle nennt „alle Produkte“ ohne konkrete Kernelversion; daraus folgt keine Eignung für jede ArmSoM-Platine. Dies ist nur eine Plattformreferenz: SoC, PMIC-Modell und Beschaltung, eMMC/UFS-Freigabeliste, Spannungsabfall, Reset-Timing, SDK/BSP sowie U-Boot- und Kernelzweig prüfen. Der RK3588-DTS-Pfad ist ein Herstellerbeispiel, kein von ArmSoM getesteter oder allgemeingültiger Patch. Hardwaretests zu Stromausfall, Datenzuverlässigkeit und Schwellen wurden nicht durchgeführt.

> Vor Schwellenänderungen die Hardware prüfen: Eine falsche Unterspannungs-Reset-Konfiguration kann Reset-Schleifen oder Datenverlust verursachen. Es werden keine Patches ausgeführt, Geräte geflasht oder Stromausfalltests durchgeführt. Die Quellenangabe „Standardschwelle 3.2V“ weicht vom alten Patchwert 2700mV ab; beides bleibt nachvollziehbar erhalten.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-power-loss-protection/EDITORIAL-NOTES.md)

## 1. Einführung

Das Dokument beschreibt für Entwickler eingebetteter Systeme, industrieller Geräte und Unterhaltungselektronik Maßnahmen zum Schutz von eMMC/UFS-Daten bei unerwartetem Stromausfall.

Bei Modellen, für die die Freigabeliste eine höhere Reset-Spannung bei Stromausfall verlangt, ist die passende Versorgungslösung unten anzuwenden.

Auch bei nicht entsprechend markierten Modellen können diese Maßnahmen bei Stromausfallproblemen als Referenz dienen.

## 2. Schutzmaßnahmen bei Stromausfall

Die gewählten eMMC- und UFS-Bausteine müssen in der von Rockchip veröffentlichten Freigabeliste stehen, damit die Zuverlässigkeitstests bei unerwartetem Stromausfall abgedeckt sind.

Wird der Controller bei Stromausfall zurückgesetzt, solange die VCC-Versorgung von eMMC beziehungsweise UFS noch im Normalbereich liegt, sinkt der Systemverbrauch und der VCC-Abfall wird verzögert. Gleichzeitig beendet der Controller die Datenübertragung, um fehlerhafte Schreibvorgänge oder Adressverschiebungen zu vermeiden.

### 2.1 RK806

Im Kernel-DTS die Abschaltspannung (`shutdown_voltage_threshold`) auf 3.2V erhöhen. Fällt die PMIC-Eingangsspannung unter 3.2V (laut Quelle die „Standardschwelle“), setzt der PMIC den Controller automatisch zurück.

Der folgende Patch dient als Referenz; je nach Projekt sind andere Dateien anzupassen:

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

Den folgenden Patch in U-Boot übernehmen: Fällt die PMIC-Eingangsspannung unter 3.2V (laut Quelle die „Standardschwelle“), setzt der PMIC den Controller automatisch zurück.

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

Der Controller-Reset bei einer Versorgungsspannung unter 3.6V wird standardmäßig bereits unterstützt; ein Patch-Update ist nicht erforderlich.

### 2.4 RK805

RK805 unterstützt keinen Controller-Reset bei Unterspannung. eMMC-/UFS-Bausteine, für die die Freigabeliste eine höhere Reset-Spannung verlangt, werden daher nicht empfohlen.

### 2.5 Externer Reset-IC

Der Reset-IC überwacht die VCC-Versorgung des eMMC. Ein Reset-IC mit einer Schwellenspannung ≥2.93V ist erforderlich. Fällt VCC unter 2.93V, setzt der IC den Controller sofort zurück.

### 2.6 Notstromversorgung

Systeme mit Pufferbatterie oder Kondensatorversorgung können den Abfall der DC-Versorgungsspannung in Echtzeit überwachen und zum Datenschutz den normalen Abschaltablauf auslösen.

Ein zusätzlicher Patch ist nicht erforderlich.

### 2.7 Andere Versorgungslösungen

Wenn Stromausfall nicht erkannt und der Controller nicht zurückgesetzt werden kann, werden eMMC-/UFS-Bausteine mit laut Freigabeliste erforderlicher höherer Reset-Spannung nicht empfohlen.

{% endraw %}
