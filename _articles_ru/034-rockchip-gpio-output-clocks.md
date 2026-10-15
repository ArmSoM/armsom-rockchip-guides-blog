---
title: "Вывод тактовой частоты на GPIO Rockchip: mapping, DTS и тестирование"
description: "Справочник Rockchip по pinmux, частотам, DTS и проверке вывода clock на GPIO."
translation_key: "034-rockchip-gpio-output-clocks"
slug: "034-rockchip-gpio-output-clocks"
lang: "ru"
date: "2026-10-15"
author: "Редакция ArmSoM · документация Rockchip"
category: "hardware"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["Rockchip", "GPIO", "clock output", "pinmux", "DTS"]
keywords: "ArmSoM Rockchip GPIO вывод тактовой частоты pinmux RK3588 RK3576"
excerpt: "Сопоставление выводов, DTS-паттерны и безопасная проверка clock output Rockchip."
---

# Вывод тактовой частоты на GPIO Rockchip: mapping, DTS и тестирование

Справка подготовлена по *Rockchip Gpio Output Clocks* V1.4.0 (2025-04-16), это не отчёт об испытаниях ArmSoM. Источник охватывает RK3399, RK1808, RK3328, RK3308, RV1126, PX30, RK3566/3568, RK3588, RK3528, RK3576, RK2118 и RV1126B/P. До включения проверяйте схему платы, разводку, домен IO-напряжения, занятость pad, BSP и TRM. Волновая форма и совместимость с периферией на платах ArmSoM не подтверждались.

Английский источник содержит 29 страниц и не имеет отдельно извлекаемых технических иллюстраций. Удалены юридическая обложка, контакты, аудитория и журнал версий. [Примечания редакции](/docs/rockchip-gpio-output-clocks/EDITORIAL-NOTES.md).

## 1. Условия использования

SoC может вывести внутренний reference clock на определённый IO вместо внешнего генератора. Нужны одновременно: функция clock в IOMUX данного pad, верно настроенные источник и частота, достаточная drive capability и пригодный электрический тракт. По источнику, прямой 24 MHz bypass от кристалла даёт лучшее качество при замене 24 MHz crystal; сигнал после делителя PLL требует проверки по допускам периферии.

## 2. Основные соответствия

| SoC | Clock | GPIO | Частоты из источника |
|---|---|---|---|
| RK3288/RK3328/PX30/RK3308/RV1108/RV1126/RK3368/RK3399 | `SCLK_TESTOUT` или вариант | GPIO0_C1, GPIO1_A6, GPIO1_D6/GPIO0_B5, GPIO0_A4, GPIO0_A6, GPIO1_A4, GPIO0_B0, GPIO2_D1/GPIO0_B0 | 24 MHz, 32 kHz |
| RK3566/8 | `CLK_WIFI` | GPIO0_A0 | 24 MHz |
| RK3566/8 | `CLK_MAC0_OUT` / `CLK_MAC1_OUT` | GPIO2_C1 / GPIO3_B0 или GPIO4_B3 | 24/25/50/125 MHz |
| RK3566/8 | `CLK_CIF_OUT` / `CLK_CAM0_OUT` | GPIO4_C0 / GPIO4_A7 | 24/27/37.125 MHz |
| RK3588 | `REFCLKOUT`, GMAC, ETH, MIPI camera, CIF outputs | GPIO0_A0, GPIO4_C3/B0/B1/B4, GPIO3_A6, GPIO1_B6/B7/D6/D7 | 24, 25, 27, 32 kHz, 37.125, 50, 125 MHz по функции |
| RK3528 | `CLK_REFOUT`, `CLK_DEEPSLOW`, `CLK_TESTOUT` | GPIO0_A1/GPIO3_C3, GPIO3_C3/GPIO1_C3, GPIO2_A5 | 24 MHz / 32 kHz / по конфигурации |
| RK3576 | REF, ETH, VI/CIF, CAM и UFS outputs | указанные в источнике GPIO0..GPIO4 pads | 12/24/25/26/27/37.125/50/125 MHz по функции |
| RK2118 | REF, ETH, OSC, 32K outputs | GPIO3_B1, GPIO0_A3/A2/B3/A4 | 24/24.576/40/49.152/50 MHz; 25/50 MHz; bypass; 32 kHz |
| RV1126B/P | SAI MCLK, CAM/VI/ETH, 32K/REF | pinctrl целевого SoC | 12.288/24/24.576/49.152 и 24/25/26/27/37.125/50 MHz |

Один физический pad может иметь несколько функций. Реально выбирается только одна функция согласно pinmux, корпусу и разводке платы.

## 3. DTS

```dts
pinctrl-names = "default";
pinctrl-0 = <&test_clkout>;
assigned-clocks = <&cru SCLK_TESTOUT>;
assigned-clock-parents = <&xin24m>;
assigned-clock-rates = <24000000>;
clocks = <&cru SCLK_TESTOUT>;
clock-names = "soc_24M";
```

Для другого SoC используйте его ID: `SCLK_TEST_OUT`, `SCLK_TESTCLKOUT1/2`, `CLK_WIFI`, `CLK_CIFOUT_OUT` либо clock камеры/ethernet. Группа pinctrl также зависит от платы. На RK3528 `CLK_TESTOUT` зарезервирован для self-test; `CLK_REFOUT` фиксирован на 24 MHz и только включается/выключается; `CLK_DEEPSLOW` фиксирован на 32 kHz и не меняется. Там нужен только pinctrl.

## 4. Примеры разработки

```sh
# RK3399: testout1 24 MHz через GPIO2_D1
echo 24000000 > /sys/kernel/debug/clk/clk_testout1_pll_src/clk_rate
echo 24000000 > /sys/kernel/debug/clk/clk_testout1/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_testout1/clk_enable_count
io -4 0xff77e004 0x000c0008

# RK3588: GMAC 50 MHz
echo 50000000 > /sys/kernel/debug/clk/clk_gmac_50m/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_gmac_50m/clk_prepare_enable
io -4 0xfd5f8090 0xf0001000

# RK3576: 50 MHz GMAC0 reference output
echo 50000000 > /sys/kernel/debug/clk/refclko25m_gmac0_out/clk_rate
echo 1 > /sys/kernel/debug/clk/refclko25m_gmac0_out/clk_prepare_enable
io -4 0x26044064 0x000f0003
```

Команды `io -4` из примеров применимы только к указанному SoC: адреса CRU/GRF, write-mask и поля разные. Для поддержки BSP источник добавляет binding ID, массив родителей и ветвь `GATE`/`MUX`/`COMPOSITE`, затем ссылается на clock из DTS.

## 5. Проверка

1. Убедитесь, что pad выведен на плату, не занят boot/debug/storage и находится в совместимом домене IO.
2. Проверьте выбор clock-функции, а не GPIO-функции с тем же pad.
3. Проверьте parent, rate и enable через `clk_summary`.
4. Измеряйте частоту, duty cycle, амплитуду и старт на стороне периферии.
5. Проверьте clock lock/трафик, нагрузку и suspend/resume, особенно для Ethernet и audio.
