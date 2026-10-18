---
title: "Руководство Rockchip FLEXBUS FSPI: SPI NOR Flash, ядро и DTS"
description: "Руководство Rockchip FLEXBUS FSPI: SPI NOR Flash, ядро и DTS с полными техническими разделами, кодом, параметрами и замечаниями к исходнику."
translation_key: "061-rockchip-flexbus-fspi"
slug: "061-rockchip-flexbus-fspi"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "FLEXBUS"]
keywords: "ArmSoM Rockchip rockchip-flexbus-fspi"
excerpt: "Руководство Rockchip FLEXBUS FSPI: SPI NOR Flash, ядро и DTS с полными техническими разделами, кодом, параметрами и замечаниями к исходнику."
---

{% raw %}

# Руководство Rockchip FLEXBUS FSPI: SPI NOR Flash, ядро и DTS

Это полный технический материал на основе исходника, справочник по платформе для ArmSoM. Область исходника: SoC с FLEXBUS согласно исходнику; поддержка конкретной платы требует проверки, Linux kernel 6.1. Перед применением проверьте плату, SoC, ветку SDK/BSP, выводы и периферию. Аппаратная проверка не проводилась; поддержка всеми платами ArmSoM не подразумевается. Вывод и числовые результаты — примеры исходника, а не испытания ArmSoM.

Китайская статья следует китайскому исходнику, английская — английскому; русская полностью переводит английский технический текст. Код, комментарии и вывод команд сохраняют язык источника. В технической части исходника нет отдельных технических рисунков или таблиц; вымышленные иллюстрации не добавлялись.

Оба исходника имеют версию V1.0.0.

**Осторожно:** резервирование памяти, DMA, мультиплексирование выводов и запись в устройства влияют на оборудование. Команды приведены для изучения; аппаратные операции не выполнялись. Проверьте схему, питание, тайминги и устройство. xxx и многоточия в DTS — заполнители исходника, а не готовая конфигурация.

Источники и исправления: [EDITORIAL-NOTES](/docs/rockchip-flexbus-fspi/EDITORIAL-NOTES.md)。Официальные материалы: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Таблица версий продукта из исходника (PDF p.2; область исходника, не результат проверки платы):

| SoC | Версия ядра |
| --- | --- |
| Все SoC с поддержкой FLEXBUS | 6.1 |

<!-- Source EN PDF p.5, block 0 -->

## 1. Режим FLEXBUS FSPI

<!-- Source EN PDF p.5, block 1 -->

### 1.1 Обзор

<!-- Source EN PDF p.5, block 2 -->

Режим FLEXBUS FSPI реализует соответствующие функции путём эмуляции RK FSPI (Flexible Serial Peripheral Interface) средствами FLEXBUS, например:

<!-- Source EN PDF p.5, block 3 -->

Передача по одной линии и приём по четырём линиям — типичная конфигурация драйвера Linux MTD Quad SPI Flash.

<!-- Source EN PDF p.5, block 4 -->

Основная характеристика:

<!-- Source EN PDF p.5, block 5 -->

Тактовая частота до 100MHz

<!-- Source EN PDF p.5, block 6 -->

### 1.2 Настройка

<!-- Source EN PDF p.5, block 7 -->

#### 1.2.1 Настройка ядра

<!-- Source EN PDF p.5, block 8 -->

Режим FLEXBUS FSPI реализован драйвером стандартной подсистемы SPI, но предоставляет только структуру spi-mem. Поддерживаются внешняя SPI Flash и периферийные устройства, использующие протокол spi-mem:

<!-- Source EN PDF p.5, block 9 -->

```text
CONFIG_SPI=y
CONFIG_SPI_ROCKCHIP_FLEXBUS_FSPI=y
```

<!-- Source EN PDF p.5, block 10 -->

#### 1.2.2 Настройка DTS

<!-- Source EN PDF p.5, block 11 -->

Пример с внешним дочерним устройством SPI NOR Flash:

<!-- Source EN PDF p.5, block 12 -->

```text
&flexbus {
    rockchip,flexbus0-opmode = <ROCKCHIP_FLEXBUS0_OPMODE_SPI>;
    rockchip,flexbus1-opmode = <ROCKCHIP_FLEXBUS1_OPMODE_NULL>;
    status = "okay";
};
&flexbus_fspi {
    pinctrl-names = "default";
    pinctrl-0 = <&flexbus0m1_pins &flexbus0_clk_pins
                 &flexbus0_d0_pins &flexbus0_d1_pins
                 &flexbus0_d2_pins &flexbus0_d3_pins>;
    status = "okay";
    flash@0 {
        compatible = "jedec,spi-nor";
        reg = <0>;
        spi-max-frequency = <100000000>;
        spi-rx-bus-width = <4>;
        spi-tx-bus-width = <1>;
    };
};
```

<!-- Source EN PDF p.6, block 14 -->

Пояснение:

<!-- Source EN PDF p.6, block 15 -->

mode_bits имеет значение SPI_RX_QUAD:

<!-- Source EN PDF p.6, block 16 -->

Допускается spi-rx-bus-width = 4.

<!-- Source EN PDF p.6, block 17 -->

По умолчанию используются SPI mode 0 и MSB mode. Соответствующие параметры нельзя изменить в DTS; для дальнейшей доработки обратитесь к руководству контроллера.

<!-- Source EN PDF p.6, block 18 -->

#### 1.2.3 Файл драйвера

<!-- Source EN PDF p.6, block 19 -->

Файл драйвера — drivers/spi/spi-rockchip-flexbus-fspi.c.

{% endraw %}
