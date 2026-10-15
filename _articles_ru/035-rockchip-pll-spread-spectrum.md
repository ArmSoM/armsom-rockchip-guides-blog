---
title: "Rockchip PLL spread spectrum: EMI, SSMOD и SSCG"
description: "Справочник по настройке Rockchip PLL spread spectrum: параметры, регистры, изменения U-Boot/ядра, jitter и стабильность."
translation_key: "035-rockchip-pll-spread-spectrum"
slug: "035-rockchip-pll-spread-spectrum"
lang: "ru"
date: "2026-10-15"
author: "Редакция ArmSoM · исходная документация Rockchip"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["PLL", "SSCG", "SSMOD", "EMI", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip PLL spread spectrum SSCG SSMOD EMI RK3588 RK3576"
excerpt: "Полный справочник параметров, регистров и рисков Rockchip PLL spread spectrum."
---

{% raw %}
# Rockchip PLL spread spectrum: EMI, SSMOD и SSCG

Это справочник по исходному документу, а не отчёт о валидации ArmSoM. На уровне SoC/BSP он применим к платам с поддерживаемыми SoC, включая Sige7/AIM7 (RK3588) и Sige5/CM5/AIM5 (RK3576). Перед записью регистра проверьте карту CRU, дерево PLL, потребителей и поставляемый boot firmware/kernel. Измерения EMI, jitter, стабильности и сертификация ArmSoM не проводились.

Источник: *Rockchip PLL Frequency Spreading Function Detailed Explanation*, V1.8.0, 2025-04-16. Китайский PDF — 13 страниц, английский — 12; разница вызвана отдельной страницей истории редакций. Оригинальные диаграммы находятся на CN 6–7 и EN 5–6. Обложка/юридический текст, аудитория и история редакций исключены. [Редакторская проверка](/docs/rockchip-pll-ssmod-clock/EDITORIAL-NOTES.md).

## 1. Концепция

SSCG/SSG модулирует частоту тактового сигнала и распределяет энергию, которая иначе была бы сосредоточена в узкой полосе; это снижает пики основной и нечётных гармоник EMI. Синхронные data/address/control сигналы модулируются вместе с источником, поэтому решение системное.

![Исходная диаграмма: принцип SSG](/docs/rockchip-pll-ssmod-clock/assets/Rockchip_Developer_Guide_Pll_Ssmod_Clock_EN-p5-X42.png)

- **Modulation rate** — скорость изменения частоты; она должна быть намного ниже исходной частоты, но выше слышимой области 20 Hz–20 kHz. Источник указывает типично 30–120 kHz.
- **Modulation depth** — процентное отклонение частоты; большая глубина обычно снижает EMI-пик сильнее, но ограничена допустимым диапазоном системы.

![Исходная диаграмма: EMI при разной глубине](/docs/rockchip-pll-ssmod-clock/assets/Rockchip_Developer_Guide_Pll_Ssmod_Clock_EN-p6-X48.png)

## 2. Параметры PLL

### 2.1 Общие PLL, кроме RK3588

Установите `dsmpd = 0` (fractional mode), `ssmod_reset = 0`, `ssmod_disable_sscg = 0`, `ssmod_bp = 0`; `ssmod_spread = n` (`0…0x1f`, значение `0.n%`); `ssmod_divval = n` (`0…0xf`).

```text
spread-spectrum rate (Hz) = 24000000 / refdiv / 128 / n
```

`refdiv` — параметр PLL, обычно 1, но проверяется по TRM. Только RK3399 требует external vector table: `ssmod_sel_ext_wave = 1`, `ssmod_ext_maxaddr = 0xff`.

### 2.2 RK3588

`sscg_en = 1` включает dithered mode. `mrr = 0…63` задаёт амплитуду: `MR = mfr*mrr/m/32`; `mfr = 0…255` задаёт скорость: `MF = Fin/p/mfr/32`. `sel_pf`: 0 — down spread, 1 — up spread, 1x — center spread. Источник обычно рекомендует center spread из-за jitter.

## 3. Примеры регистров

Адреса и значения ниже — исходные примеры, они не являются универсальной безопасной инструкцией.

```sh
# RK3399 GPLL
io -4 0xff760094 0x00010001
io -4 0xff760090 0x1f000100
io -4 0xff760090 0x00f000f0
io -4 0xff760094 0xff00ff00
io -4 0xff76008c 0x00080000
io -4 0xff760090 0x00070000

# RK356X GPLL
io -4 0xfdd2004c 0x1f000800
io -4 0xfdd2004c 0x00f00060
io -4 0xfdd20044 0x10000000
io -4 0xfdd2004c 0x00070000

# RK3588 GPLL
io -4 0xfd7c01cc 0x00ff000c
io -4 0xfd7c01cc 0x3f000500
io -4 0xfd7c01cc 0xc0008000
io -4 0xfd7c01d0 0x00010001

# RK3576 GPLL
io -4 0x272001cc 0x00ff000c
io -4 0x272001cc 0x3f000500
io -4 0x272001cc 0xc0008000
io -4 0x272001d0 0x00010001
```

Источник также приводит аналогичные general-PLL последовательности для RK3328, PX30, RK3308, RV1126, RK1808, RK3528, RK3562, RK2118, RV1103B, RK3506 и RV1126B/RV1126B-P. Используйте точные адреса и полные значения из TRM. RK3036, RK312X, RK322X, RK3188, RK3288, RK3368 не поддерживают функцию. Рекомендована скорость 30 kHz; универсальной глубины нет — её определяют измерением и EMI-сертификацией.

## 4. Постоянная конфигурация

После выбора параметров настраивайте их как можно раньше. В исходнике есть изменения RK3399 U-Boot `drivers/clk/rockchip/clk_rk3399.c` и ядра `drivers/clk/rockchip/clk-rk3399.c`. Для DPLL/DDR SSC используйте LOADER: изменение DDR clock в другом месте может вызвать нестабильность или сбой.

```c
writel(0x1f001f00, &priv->cru->dpll_con[4]);
writel(0x00f00060, &priv->cru->dpll_con[4]);
writel(0x7f002700, &priv->cru->dpll_con[5]);
writel(0x00080000, &priv->cru->dpll_con[3]);
writel(0x00070000, &priv->cru->dpll_con[4]);
writel(0x00010001, &priv->cru->dpll_con[5]);
```

## 5. Границы и проверка

Ethernet и CAN чувствительны к точности clock, поэтому spread spectrum нельзя включать без анализа. SSC добавляет jitter и может вызвать ошибки setup/hold, высокий error rate и потерю lock. Оценка источника «менее ~0.05% period jitter» не является гарантией конкретной платы. Все self-clock ниже PLL также переходят в spread mode; общие PLL eMMC/SDIO требуют совместной проверки. DDR, USB, SDIO, I2C, SPI, I2S, USB3.0, PCIe и eDP могут иметь собственные SSC требования. Включайте SSC только при необходимости и с минимальной глубиной, удовлетворяющей EMI; каждый проект требует отдельного теста стабильности и совместимости.
{% endraw %}
