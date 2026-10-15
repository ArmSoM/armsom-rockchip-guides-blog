---
title: "Структура тактирования Rockchip: PLL, DTS, API драйвера и отладка"
description: "Справочник по дереву тактирования Rockchip Linux: PLL, DTS, API драйвера и debugfs."
translation_key: "033-rockchip-clock-framework"
slug: "033-rockchip-clock-framework"
lang: "ru"
date: "2026-10-15"
author: "Редакция ArmSoM · документация Rockchip"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["Rockchip", "clock", "PLL", "device tree", "Linux"]
keywords: "ArmSoM Rockchip тактирование PLL DTS Linux RK3588 RK3576"
excerpt: "Практический справочник по дереву тактирования, DTS и Clock API Rockchip Linux."
---

# Структура тактирования Rockchip: PLL, DTS, API драйвера и отладка

Материал подготовлен по *Rockchip Clock Developer Guide* V1.2.0 от 2024-08-02 и является платформенной справкой, а не отчётом об испытаниях ArmSoM. Документ охватывает перечисленные в источнике SoC и BSP Linux; перед применением обязательно сверяйте SoC платы ArmSoM, выпущенный BSP, карту CRU/PMUCRU, DTS и цепочку загрузки. Измерения частоты, джиттера и потребления на платах ArmSoM не проводились.

Английский и китайский источники содержат по 24 страницы. Здесь применены английские исходные схемы; удалены обложка, юридические сведения, контакты, аудитория и журнал версий. [Примечания редакции](/docs/rockchip-clock/EDITORIAL-NOTES.md).

## 1. Модель clock tree

Под CLOCK понимается иерархия, питающая аппаратные потребители SoC, а не системное время Linux. Дерево состоит из генератора/кварца, PLL, делителей, MUX, gate и потребителей. Для каждого SoC своя схема PLL, родителей, делителей и MUX; переносить настройки между SoC нельзя.

![Исходная схема дерева тактирования](/docs/rockchip-clock/assets/Rockchip_Developer_Guide_Clock_EN-p6-X67.png)

Обычный процесс: включить или выключить clock, задать его частоту и выбрать parent. Исходник указывает `drivers/clk/rockchip/clk-rk3xxx.c` для описания регистров/дерева, binding-ID в `include/dt-bindings/clock/`, особые clocks в `drivers/clk/rockchip/clk-xxx.c`, а API - в `drivers/clk/`.

## 2. PLL, шины, gate

| PLL | Назначение в источнике | Типичные значения |
|---|---|---|
| APLL | CPU, `CLOCK_CORE` | меняется с частотой CPU |
| DPLL | DDR, `CLOCK_DDR` | меняется с DDR |
| GPLL | резерв для шин/периферии | 594 или 1200 MHz |
| CPLL | GMAC/прочее/LCDC | 400/500/800/1000 MHz |
| NPLL | прочее/LCDC | 1188 MHz |

ACLK переносит данные; PCLK и HCLK обычно обслуживают доступ к регистрам. В источнике даны диапазоны ACLK 100–300 MHz, PCLK 50–150 MHz, HCLK 37–150 MHz. BUS обычно содержит I2C/I2S/SPI, PERI - eMMC/GMAC/USB; часть быстрых устройств имеет отдельный ACLK. RK3399 разделяет высокоскоростные `*_PERIHP` и низкоскоростные `*_PERILP*` шины.

Gate имеют древовидную ссылочную семантику: включение листа включает родителей, а родитель отключается только после всех детей. Управляйте clock, объявленным потребителем, а не общим родителем.

## 3. DTS и начальная настройка

Начиная с Linux 4.4, `of_clk_set_defaults()` читает `assigned-clocks`, `assigned-clock-parents` и `assigned-clock-rates`. Все списки обязаны совпадать по позиции.

```dts
assigned-clocks = <&cru ACLK_VOP0>, <&cru HCLK_VOP0>;
assigned-clock-parents = <&cru VPLL>, <&cru VPLL>;
assigned-clock-rates = <400000000>, <200000000>;
```

Это сокращённый пример RK3399: используйте полные binding-имена целевого SoC. Неиспользуемые clocks могут отключаться после инициализации. Для преднамеренного сохранения применяют список `*_critical_clocks`, флаг `CLK_IGNORE_UNUSED`, а в 6.1 - `CLK_IS_CRITICAL`. Аргументы `clk_gate.always_on=1 pm_domains.always_on=1` сохраняют все clocks, но расходуют энергию.

ID берутся только из binding-заголовка нужного SoC. В `clk-rk3xxx.c` используются `GATE`, `MUX` и `COMPOSITE`; числовые ID другого SoC непригодны.

## 4. Драйвер и API

```dts
clocks = <&cru SCLK_TSADC>, <&cru PCLK_TSADC>;
clock-names = "tsadc", "apb_pclk";
assigned-clocks = <&cru SCLK_TSADC>;
assigned-clock-rates = <750000>;
```

```c
#include <linux/clk.h>
dev->pclk = devm_clk_get(&pdev->dev, "tsadc");
dev->clk = devm_clk_get(&pdev->dev, "apb_pclk");
```

Основные API: `devm_clk_get()`, `clk_get()/clk_put()`, `devm_clk_get_optional()`, `devm_clk_bulk_get()`, `devm_clk_bulk_get_all()`, `clk_prepare()/clk_unprepare()`, `clk_enable()/clk_disable()`, `clk_prepare_enable()/clk_disable_unprepare()`, `clk_get_rate()`, `clk_round_rate()` и `clk_set_rate()` в Hz. Предпочтительны managed и bulk варианты. `prepare/unprepare` могут sleep и запрещены в atomic context; `enable/disable` являются atomic. Все get/enable должны иметь парный put/disable, включая ошибки probe и remove.

## 5. Отладка и ограничения

```sh
cat /sys/kernel/debug/clk/clk_summary
cat /sys/kernel/debug/clk_saradc/clk_rate
echo 24000000 > /sys/kernel/debug/clk_saradc/clk_rate
echo 1 > /sys/kernel/debug/clk_saradc/clk_enable_count
echo 0 > /sys/kernel/debug/clk_saradc/clk_enable_count
```

В примере 6.1 используется узел `clk_prepare_enable`. Наличие debugfs зависит от сборки. Источник также предлагает `TEST_CLK_OUT`; для RK3399 на схеме показаны смещения CRU `0x050c`, `0x01e8`, `0x0334` для MUX/DIV/GATE. До измерения проверяйте pinmux, схему платы и TRM.

```text
VCO  = 24 MHz × FBDIV / REFDIV  (450–2200 MHz в источнике)
FOUT = VCO / POSTDIV1 / POSTDIV2
POSTDIV1 >= POSTDIV2
```

Пример источника: `24 MHz × 99 / 2 = 1188 MHz`; после `/2/1` получается 594 MHz. Больший VCO уменьшает джиттер, но увеличивает потребление. Автоматический расчёт параметров не гарантирует максимальный VCO и не рекомендован там, где важен джиттер.

DCLK дисплея обычно требует отдельный PLL. Для I2S/UART с дробным делением источник требует частоту в 20 раз выше parent, иначе возникают джиттер и ошибка частоты. Ethernet обычно требует точные 50 MHz для gigabit и 125 MHz для 10G; если PLL-план не даёт точность, нужен внешний генератор. RK3576/RK3506 могут принимать reference от кварца или IO для аудиосинхронизации - только по документации BSP целевого SoC.

## 6. Безопасный порядок работ

1. Начинайте с выпущенных DTS и clock driver платы.
2. Зафиксируйте потребителя, целевую частоту, допуск, родителей и совместных потребителей.
3. Сохраняйте позиционное соответствие `assigned-*`; проверяйте результат `clk_round_rate()`.
4. Сверяйте parent, rate и счётчик через `clk_summary`.
5. Проверяйте suspend/resume, периферию, display, Ethernet и точность serial clock.
