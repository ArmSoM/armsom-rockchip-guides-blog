---
title: "Защита Rockchip при внезапном отключении питания: eMMC/UFS, пороги PMIC и сброс"
description: "Защита Rockchip при внезапном отключении питания: eMMC/UFS, пороги PMIC и сброс — RK806, RK817/RK809, RK801, RK805; V1.0.0."
translation_key: "098-rockchip-power-loss-protection"
slug: "098-rockchip-power-loss-protection"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: ["ArmSoM", "Rockchip", "eMMC", "UFS", "PMIC", "RK3588"]
excerpt: "Защита Rockchip при внезапном отключении питания: eMMC/UFS, пороги PMIC и сброс — RK806, RK817/RK809, RK801, RK805; V1.0.0."
---

{% raw %}

# Защита Rockchip при внезапном отключении питания: eMMC/UFS, пороги PMIC и сброс

Статья полностью сохраняет технический текст китайского оригинала RK-KF-YF-C45 / V1.0.0. Отдельного английского PDF нет; английская, русская и немецкая версии полностью переведены с китайского. Независимых технических изображений в источнике нет; патчи восстановлены как редактируемый код, а не выданы за английские иллюстрации. Источник указывает «все продукты» без конкретной версии ядра, но это не подтверждает применимость ко всем платам ArmSoM. Это только справочник по платформе: проверьте SoC платы, модель и подключение PMIC, список поддержки eMMC/UFS, спад напряжения, последовательность сброса, SDK/BSP, ветки U-Boot и ядра. Путь DTS RK3588 — пример производителя, а не проверенный ArmSoM или универсальный патч. Аппаратные испытания потери питания, надёжности данных и измерения порогов не проводились.

> Перед изменением порогов оцените аппаратную схему: ошибочная настройка сброса при пониженном напряжении может вызвать циклический сброс или повреждение данных. Патчи, прошивка и испытания отключения питания не выполнялись. Фраза оригинала «порог по умолчанию 3.2V» отличается от старого значения патча 2700mV; оба значения сохранены и отмечены без догадок.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-power-loss-protection/EDITORIAL-NOTES.md)

## 1. Введение

Документ предлагает разработчикам встраиваемых систем, промышленного оборудования и потребительской электроники способы защиты данных eMMC/UFS при неожиданной потере питания.

Для моделей, у которых в списке поддержки отмечена необходимость повышения напряжения сброса при потере питания, используйте соответствующий вариант питания ниже.

Если проблемы возникают у моделей без такой отметки, эти решения также можно использовать как справочные.

## 2. Варианты защиты при потере питания

Выбранные eMMC и UFS должны входить в опубликованный Rockchip список поддержки, чтобы обеспечить прохождение испытаний надёжности при неожиданной потере питания.

При отключении питания сброс контроллера, пока VCC eMMC (или UFS) остаётся в нормальном диапазоне, снижает потребление системы и увеличивает время спада VCC. Одновременно контроллер прекращает отправку данных в eMMC (или UFS), предотвращая запись неверных данных и смещение адресов.

### 2.1 RK806

Измените DTS ядра, повысив напряжение выключения (`shutdown_voltage_threshold`) до 3.2V. При падении входного напряжения PMIC ниже 3.2V (в оригинале — «порог по умолчанию») PMIC автоматически сбрасывает контроллер.

Ниже приведён справочный патч; в разных проектах изменяются разные файлы:

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

Добавьте следующий патч в U-Boot: при падении входного напряжения PMIC ниже 3.2V (в оригинале — «порог по умолчанию») PMIC автоматически сбрасывает контроллер.

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

Сброс контроллера при напряжении питания ниже 3.6V уже поддерживается по умолчанию; обновление патча не требуется.

### 2.4 RK805

RK805 не поддерживает сброс контроллера при пониженном напряжении. Не рекомендуется выбирать eMMC (UFS), для которых список поддержки требует повышенного напряжения сброса.

### 2.5 Внешняя микросхема сброса

Микросхема сброса контролирует питание VCC eMMC. Требуется микросхема с порогом ≥2.93V. Когда VCC падает ниже 2.93V, она немедленно сбрасывает контроллер.

### 2.6 Резервный источник питания

Системы с резервной батареей или конденсатором могут отслеживать падение напряжения питания DC в реальном времени и запускать штатное выключение для защиты данных.

Дополнительное обновление патча не требуется.

### 2.7 Другие варианты питания

Если невозможно обнаружить отключение питания и сбросить контроллер, не рекомендуется выбирать eMMC (UFS), для которых список поддержки требует повышенного напряжения сброса.

{% endraw %}
