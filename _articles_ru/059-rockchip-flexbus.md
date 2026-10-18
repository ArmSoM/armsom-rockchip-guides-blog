---
title: "Руководство Rockchip FLEXBUS: режимы работы, ядро и настройка DTS"
description: "Руководство Rockchip FLEXBUS: режимы работы, ядро и настройка DTS с полными техническими разделами, кодом, параметрами и замечаниями к исходнику."
translation_key: "059-rockchip-flexbus"
slug: "059-rockchip-flexbus"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus"
excerpt: "Руководство Rockchip FLEXBUS: режимы работы, ядро и настройка DTS с полными техническими разделами, кодом, параметрами и замечаниями к исходнику."
---

{% raw %}

# Руководство Rockchip FLEXBUS: режимы работы, ядро и настройка DTS

Это полный технический материал на основе исходника, справочник по платформе для ArmSoM. Область исходника: RK3576, Linux kernel 6.1. Перед применением проверьте плату, SoC, ветку SDK/BSP, выводы и периферию. Аппаратная проверка не проводилась; поддержка всеми платами ArmSoM не подразумевается. Вывод и числовые результаты — примеры исходника, а не испытания ArmSoM.

Китайская статья следует китайскому исходнику, английская — английскому; русская полностью переводит английский технический текст. Код, комментарии и вывод команд сохраняют язык источника. В технической части исходника нет отдельных технических рисунков или таблиц; вымышленные иллюстрации не добавлялись.

Оба исходника имеют версию V1.0.0.

**Осторожно:** резервирование памяти, DMA, мультиплексирование выводов и запись в устройства влияют на оборудование. Команды приведены для изучения; аппаратные операции не выполнялись. Проверьте схему, питание, тайминги и устройство. xxx и многоточия в DTS — заполнители исходника, а не готовая конфигурация.

Источники и исправления: [EDITORIAL-NOTES](/docs/rockchip-flexbus/EDITORIAL-NOTES.md)。Официальные материалы: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Таблица версий продукта из исходника (PDF p.2; область исходника, не результат проверки платы):

| SoC | Версия ядра |
| --- | --- |
| RK3576 | 6.1 |

<!-- Source EN PDF p.5, block 0 -->

## 1. Обзор FLEXBUS

<!-- Source EN PDF p.5, block 1 -->

Модуль FLEXBUS состоит из FLEXBUS0 и FLEXBUS1. FLEXBUS0 поддерживает TX, а в некоторых режимах — TX с последующим RX. FLEXBUS1 поддерживает только RX. К каждому из FLEXBUS0 и FLEXBUS1 можно подключить только одно периферийное устройство. Допускается одновременное использование обоих блоков либо только FLEXBUS0 или FLEXBUS1.

<!-- Source EN PDF p.5, block 2 -->

FLEXBUS0 поддерживает следующие режимы:

<!-- Source EN PDF p.5, block 3 -->

1\. Высокоскоростной параллельный DAC (далее — DAC)

<!-- Source EN PDF p.5, block 4 -->

2\. Эмуляция протокола SPI, главным образом для Single/Quad SPI; поддерживаются внешняя SPI Flash и QSPI-дисплей

<!-- Source EN PDF p.5, block 5 -->

FLEXBUS1 поддерживает следующие режимы:

<!-- Source EN PDF p.5, block 6 -->

1\. Высокоскоростной параллельный ADC (далее — ADC)

<!-- Source EN PDF p.5, block 7 -->

2\. DVP

<!-- Source EN PDF p.5, block 8 -->

У FLEXBUS0 и FLEXBUS1 имеется по 1 линии CLK, 1 линии CSn и 16 линий данных. Фактически доступные выводы зависят от ограничений платформы и настройки IOMUX.

<!-- Source EN PDF p.5, block 9 -->

## 2. Использование FLEXBUS

<!-- Source EN PDF p.5, block 10 -->

### 2.1 Настройка ядра

<!-- Source EN PDF p.5, block 11 -->

`Device Drivers -> Multifunction device drivers -> Rockchip Flexbus`

<!-- Source EN PDF p.5, block 12 -->

### 2.2 Настройка dtsi

<!-- Source EN PDF p.5, block 13 -->

Пример для платформы RK3576 и платы RK3576 TEST1: FLEXBUS0 подключён к DAC, FLEXBUS1 — к ADC.

<!-- Source EN PDF p.5, block 14 -->

В rk3576.dtsi:

<!-- Source EN PDF p.5, block 15 -->

```text
flexbus: flexbus@2a2f0000 {
    compatible = "rockchip,rk3576-flexbus";
    reg = <0x0 0x2a2f0000 0x0 0x200>;
    interrupts = <GIC_SPI 369 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru CLK_HSGPIO_TX>, <&cru CLK_HSGPIO_RX>,
    <&cru ACLK_HSGPIO>, <&cru HCLK_HSGPIO>;
    clock-names = "tx_clk_flexbus", "rx_clk_flexbus",
    "aclk_flexbus", "hclk_flexbus";
    rockchip,grf = <&ioc_grf>; // GRF needs to be configured for FLEXBUS
    status = "disabled";
    flexbus_adc: adc {
        ......
    };
    flexbus_dac: dac {
        ......
    };
};
```

<!-- Source EN PDF p.6, block 17 -->

Измените настройки дочерних узлов, например flexbus_adc и flexbus_dac, согласно выбранному режиму. Подробности приведены в документации соответствующих режимов. Остальные настройки обычно изменять не требуется.

<!-- Source EN PDF p.6, block 18 -->

В arch/arm64/boot/dts/rockchip/rk3576-test1.dtsi:

<!-- Source EN PDF p.6, block 19 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_DAC>; // FLEXBUS0 selects DAC mode
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_ADC>; // FLEXBUS1 selects ADC mode
    status = "okay"; // Enable FLEXBUS
};
&flexbus_adc {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus1m4_csn &flexbus1_clk
             &flexbus1_d0 &flexbus1_d1 &flexbus1_d2 &flexbus1_d3
             &flexbus1_d4 &flexbus1_d5 &flexbus1_d6 &flexbus1_d7
             &flexbus1_d8 &flexbus1_d9 &flexbus1_d10 &flexbus1_d11
             &flexbus1m1_d12 &flexbus1m1_d13 &flexbus1m1_d14 &flexbus1m1_d15>;
// Configure IOMUX for FLEXBUS1 ADC mode
    status = "okay"; // Enable ADC mode
};
&flexbus_dac {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus0m4_csn &flexbus0_clk
             &flexbus0_d0 &flexbus0_d1 &flexbus0_d2 &flexbus0_d3
             &flexbus0_d4 &flexbus0_d5 &flexbus0_d6 &flexbus0_d7
             &flexbus0_d8 &flexbus0_d9 &flexbus0_d10 &flexbus0_d11
             &flexbus0_d12 &flexbus0m0_d13 &flexbus0m0_d14 &flexbus0m0_d15>;
// Configure IOMUX for FLEXBUS0 DAC mode
    status = "okay"; // Enable DAC mode
};
```

<!-- Source EN PDF p.6, block 20 -->

Задайте rockchip,flexbus0-opmode и rockchip,flexbus1-opmode в соответствии с фактическими режимами FLEXBUS0 и FLEXBUS1. Определения режимов находятся в include/dt-bindings/mfd/rockchip-flexbus.h. Для неиспользуемого блока задайте ROCKCHIP_FLEXBUS0_OPMODE_NULL или ROCKCHIP_FLEXBUS1_OPMODE_NULL.

<!-- Source EN PDF p.7, block 21 -->

### 2.3 Файл драйвера

<!-- Source EN PDF p.7, block 22 -->

Файл драйвера — drivers/mfd/rockchip-flexbus.c. Он содержит только базовые операции: чтение/запись регистров, инициализацию и т. п. Код отдельных режимов расположен в соответствующих подсистемах; см. документацию каждого режима.

{% endraw %}
