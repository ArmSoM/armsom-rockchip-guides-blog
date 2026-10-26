---
title: "Руководство Rockchip PCIe: ресурсы, DTS, EP, DMA, отладка и устранение неисправностей"
description: "Руководство Rockchip PCIe: ресурсы, DTS, EP, DMA, отладка и устранение неисправностей — V6.29.0"
excerpt: "Руководство Rockchip PCIe: ресурсы, DTS, EP, DMA, отладка и устранение неисправностей — V6.29.0"
translation_key: "107-rockchip-pcie"
slug: "107-rockchip-pcie"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "PCIe", "DMA", "Linux"]
---

{% raw %}

# Руководство Rockchip PCIe: ресурсы, DTS, EP, DMA, отладка и устранение неисправностей

Справочник платформы Rockchip, источник V6.29.0. Проверьте SoC платы ArmSoM, разводку/PHY PCIe, SDK/BSP, ядро, периферию и питание; универсальная поддержка плат не заявляется. Примеры, регистры и патчи исходные, аппаратная проверка ArmSoM не проводилась. Китайская версия использует китайские рисунки, остальные — английские.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## Чипы и ядра, охваченные источником

<!-- Source PDF p.2: technical product-version table, not audience/revision history -->

| Чип | Версия ядра |
| --- | --- |
| RK1808 | 4.4, 4.19 |
| RK3528 | 4.19, 5.10, 6.1 |
| RK3562 | 5.10, 6.1 |
| RK3566/RK3568 | 4.19, 5.10, 6.1 |
| RK3576 | 6.1 |
| RK3588 | 5.4, 5.10, 6.1 |

RK3399 использует другой IP контроллера PCIe и не входит в это руководство; см. Rockchip_RK3399_Developer_Guide_PCIe_CN.

<!-- en PDF p.11 -->

## 1. Ресурсы чипов

<!-- en PDF p.11 -->

Диапазоны адресов BAR, выделяемые каждым контроллером чипа, приведены в разделе Internal Address Mapping главы PCIe соответствующего TRM. Ищите PCIe Outbound Memory. Таблица каждого контроллера содержит начальный адрес Base Address и полный размер Address Length для 32-битных и 64-битных BAR. Пространства конфигурации периферии, I/O и памяти MEM совместно используют этот диапазон; MEM не поддерживает предварительную выборку.

<!-- en PDF p.11 -->

### 1.1 RK1808

<!-- en PDF p.11 -->

| Ресурс | Режим | Разделение lane | DMA | IOMMU | ASPM | Примечания | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 2 lane | RC/EP | Нет | 2 канала чтения + 2 записи | Нет | L0s/L1 | Внутренний такт | 65535 |

<!-- en PDF p.11 -->

### 1.2 RK3528

<!-- en PDF p.11 -->

| Ресурс | Режим | Разделение lane | DMA | IOMMU | ASPM | Примечания | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Только RC | Нет | Нет | Нет | Все | Внутренний такт | 32 |

<!-- en PDF p.11 -->

### 1.3 RK3562

<!-- en PDF p.11 -->

| Ресурс | Режим | Разделение lane | DMA | IOMMU | ASPM | Примечания | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Только RC | Нет | Нет | Нет | Все | Внутренний такт | 32 |

<!-- en PDF p.12 -->

### 1.4 RK3566

<!-- en PDF p.12 -->

| Ресурс | Режим | Разделение lane | DMA | IOMMU | ASPM | Примечания | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Только RC | Нет | Нет | Нет | L0s/L1 | Внутренний такт | 65535 |

<!-- en PDF p.12 -->

### 1.5 RK3568

<!-- en PDF p.12 -->

#### 1.5.1 Контроллер

<!-- en PDF p.12 -->

| Ресурс | Режим | Разделение lane | DMA | IOMMU | ASPM | Примечания | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Только RC | Нет | Нет | Нет | L0s/L1 | Внутренний такт | 65535 |
| PCIe Gen3 x 2 lane | RC/EP | 1 lane RC + 1 lane RC | 2 канала чтения + 2 записи | Нет | Все | Внешний генератор, только pcie30phy | 65535 |
| PCIe Gen3 x 1 lane | RC | 1 lane RC | Нет | Нет | Все | Внешний генератор, только pcie30phy | 65535 |

<!-- en PDF p.12 -->

#### 1.5.2 PHY

<!-- en PDF p.12 -->

| Ресурс | Узел DTS | Опорный такт | Разделение | Совместное использование |
| --- | --- | --- | --- | --- |
| pcie30phy | phy@fe8c0000 | Внешний | 2Lane: По умолчанию 1Lane + 1Lane: rockchip, bifurcation | Только PCIe |
| combphy2_psq | phy@fe840000 | Внутренний/внешний | - | Совместно с SATA/RGMII |

<!-- en PDF p.12 -->

По умолчанию два lane pcie30phy работают как PCIe Gen3 x2. После разделения контроллеры PCIe Gen3 x2 и PCIe Gen3 x1 получают по одному lane. pcie30phy поддерживает раздельные опорные частоты SRNS без SSC. Настройка приведена в приложении «RK3568 pcie30phy SRNS Patch». Рекомендуется проверить целостность сигнала стандартным измерительным комплектом и нагрузочными испытаниями периферии.

<!-- en PDF p.13 -->

### 1.6 RK3576

<!-- en PDF p.13 -->

| Ресурс | Режим | Разделение lane | Поддержка DMA | Поддержка IOMMU | Поддержка ASPM | Примечания | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Только RC | Нет | Нет | Да | Все | Внутренний такт | 32 |
| PCIe Gen2 x 1 lane | Только RC | Нет | Нет | Да | Все | Внутренний такт | 32 |

<!-- en PDF p.13 -->

### 1.7 RK3588

<!-- en PDF p.13 -->

RK3588 содержит пять контроллеров PCIe с одинаковым аппаратным IP и разными конфигурациями. Четырёхлинейный контроллер DM может работать как EP; двухлинейный и три однолинейных — только как RC. Имеются два типа PHY: PCIe 3.0 с двумя портами и четырьмя lane в сумме; три однолинейных PCIe 2.0 PHY, совместно используемых с SATA и USB. Четырёхлинейный PCIe 3.0 PHY можно разделять по требованиям. После разделения необходимо настроить соответствующие контроллеры. Всё задаётся в DTS, изменение драйвера не требуется. Ограничения:

<!-- en PDF p.13 -->

1. После разделения PCIe 3.0 PHY контроллер PCIe 3.0 x4 в режиме двух lane может соединяться только с port0, а в однолинейном режиме — только с port0 lane0.

<!-- en PDF p.13 -->

2. После разделения контроллер PCIe 3.0 x2 в режиме двух lane может соединяться только с port1, а в однолинейном режиме — только с port1 lane0.

<!-- en PDF p.13 -->

3. При разделении PCIe 3.0 PHY на четыре отдельных lane port0 lane1 соединяется только с PCIe 2 x1 l0, а port1 lane1 — только с PCIe 2 x1 l1.

<!-- en PDF p.13 -->

4. Контроллер PCIe 3.0 x4 в режиме EP может использовать четыре lane либо два lane port0; два lane port1 тогда могут работать как RC с другими контроллерами. При общем опорном такте по умолчанию нельзя одновременно использовать lane0 port0 как EP и lane1 как RC с другим контроллером: оба lane port0 имеют общий входной опорный такт, и совместное использование RC и EP может вызвать конфликт.

<!-- en PDF p.13 -->

5. Даже если используется только один порт PCIe 3.0 PHY RK3588, второй порт также должен получать питание; остальные сигналы, включая refclk, можно соединить с землёй.

<!-- en PDF p.14 -->

![Английский оригинал — 14](/docs/rockchip-pcie/assets/en-p014-figure-01.png)

*Английский оригинал — 14*

<!-- en PDF p.15 -->

#### 1.7.1 Контроллер

<!-- en PDF p.15 -->

| Ресурс | Режим | Узел DTS | Доступный PHY | Внутренний DMA | Поддержка ASPM | Поддержка IOMMU | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen3 x 4 lane | RC/EP | pcie3x4: pcie@fe150000 | pcie30phy | 2 канала чтения + 2 записи | Все | Да | 63353 |
| PCIe Gen3 x 2 lane | Только RC | pcie3x2: pcie@fe160000 | pcie30phy | Нет | Все | Да | 63353 |
| PCIe Gen3 x 1 lane | Только RC | pcie2x1l0: pcie@fe170000 | pcie30phy, combphy1_ps | Нет | Все | Да | 63353 |
| PCIe Gen3 x 1 lane | Только RC | pcie2x1l1: pcie@fe180000 | pcie30phy, combphy2_psu | Нет | Все | Да | 63353 |
| PCIe Gen3 x 1 lane | Только RC | pcie2x1l2: pcie@fe190000 | combphy0_ps | Нет | Все | Да | 63353 |

<!-- en PDF p.15 -->

#### 1.7.2 PHY

<!-- en PDF p.15 -->

| Ресурс | Узел DTS | Опорный такт | Разделение | Совместное использование |
| --- | --- | --- | --- | --- |
| pcie30phy | phy@fee80000 | Внешний | 4Lane1: PHY_MODE_PCIE_AGGREGATION 2Lane+2Lane: PHY_MODE_PCIE_NANBNB 2Lane+1Lane+1Lane: PHY_MODE_PCIE_NANBBI 1Lane4: PHY_MODE_PCIE_NABIBI | Только PCIe |
| combphy0_ps | phy@fee00000 | Внутренний/внешний | - | Совместно с SATA |
| combphy1_ps | phy@fee10000 | Внутренний/внешний | - | Совместно с SATA |
| combphy2_psu | phy@fee20000 | Внутренний/внешний | - | Совместно с SATA/USB3 |

<!-- en PDF p.15 -->

pcie30phy не поддерживает архитектуру с раздельными опорными тактами.

<!-- en PDF p.15 -->

### 1.8 RK3588S

<!-- en PDF p.15 -->

RK3588S имеет два однолинейных контроллера и два однолинейных comboPHY для PCIe 2.0, сопоставленных один к одному.

<!-- en PDF p.16 -->

#### 1.8.1 Контроллер

<!-- en PDF p.16 -->

| Ресурс | Режим | Узел DTS | Доступный PHY | Внутренний DMA | ASPM | IOMMU | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen3 x 1 lane | Только RC | pcie2x1l1: pcie@fe180000 | combphy2_psu | Нет | Все | Да | 65535 |
| PCIe Gen3 x 1 lane | Только RC | pcie2x1l2: pcie@fe190000 | combphy0_ps | Нет | Все | Да | 65535 |

<!-- en PDF p.16 -->

#### 1.8.2 PHY

<!-- en PDF p.16 -->

| Ресурс | Узел DTS | Опорный такт | Разделение | Совместно с SATA/USB3 |
| --- | --- | --- | --- | --- |
| combphy0_ps | phy@fee00000 | Внутренний/внешний | - | Совместно с SATA |
| combphy2_psu | phy@fee20000 | Внутренний/внешний | - | Совместно с SATA/USB3 |

<!-- en PDF p.16 -->

## 2. Настройка DTS

<!-- en PDF p.16 -->

### 2.1 Ключевые правила настройки

<!-- en PDF p.16 -->

Большая часть конфигурации PCIe фиксирована; DTS платы требует немного переменных. Основные правила:

<!-- en PDF p.16 -->

1. Включение контроллера/PHY: выбрав схему, включите соответствующие контроллер и PHY согласно принципиальной схеме. Их индексы могут не соответствовать друг другу: например, PCIe2x1l0 RK3588 не соответствует combphy0_ps.

<!-- en PDF p.16 -->

2. Для некоторых контроллеров, например PCIe2x1l0 и PCIe2x1l1 RK3588, возможны несколько PHY. Задайте phys согласно проекту.

<!-- en PDF p.16 -->

3. Для RC обычно требуется reset-gpios, соответствующий сигналу PERSTn на схеме PCIe.

<!-- en PDF p.16 -->

4. Для RC может потребоваться vpcie3v3-supply, соответствующий фиксированному регулятору, управляемому GPIO-сигналом PWREN PCIe.

<!-- en PDF p.16 -->

5. При использовании как EP изменить compatible на строку соответствующего режима EP.

<!-- en PDF p.16 -->

6. PHY: PCIe30phy имеет четыре lane, которые можно использовать раздельно. Задайте rockchip,pcie30-phymode согласно проекту.

<!-- en PDF p.17 -->

### 2.2 RK1808 настройка DTS

<!-- en PDF p.17 -->

Для RK1808 в коде EVB SDK есть примеры всех режимов DTS. Выберите подходящий режим по таблице и перенесите соответствующую конфигурацию в DTS изделия.

<!-- en PDF p.17 -->

| Ресурс | Режим | Пример конфигурации | Узел контроллера | Узел PHY | Примечания |
| --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 2 lane | RC | rk1808-evb.dtsi | pcie0@fc400000 | combphy | Отключить usbdrd_dwc3 и usbdrd3 |
| PCIe Gen2 x 2 lane | EP | Добавить compatible = "rockchip,rk1808-pcie-ep", "snps,dw-pcie" в pcie0 файла rk1808-evb.dtsi; | pcie0@fc400000 | combphy | Отключить usbdrd_dwc3 и usbdrd3 |

<!-- en PDF p.17 -->

### 2.3 RK3528 настройка DTS

<!-- en PDF p.17 -->

Для RK3528 в коде EVB SDK есть примеры всех режимов DTS. Выберите подходящий режим по таблице и перенесите соответствующую конфигурацию в DTS изделия.

<!-- en PDF p.17 -->

| Ресурс | Режим | Пример конфигурации | Узел контроллера | Узел PHY | Примечание |
| --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3528-evb2-ddr3-v10.dtsi | pcie2x1@fe4f0000 | combphy_pu | - |

<!-- en PDF p.17 -->

### 2.4 RK356X настройка DTS

<!-- en PDF p.17 -->

Для RK356x в коде EVB SDK есть примеры всех режимов DTS. Выберите подходящий режим по таблице и перенесите соответствующую конфигурацию в DTS изделия.

<!-- en PDF p.17 -->

#### 2.4.1 RK3562 dts

<!-- en PDF p.17 -->

| Ресурс | Режим | Пример конфигурации | Узел контроллера | Узел PHY |
| --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3562-evb1-lp4x-v10.dtsi | pcie2x1@ff500000 | combphy_pu |

<!-- en PDF p.18 -->

#### 2.4.2 RK3566 dts

<!-- en PDF p.18 -->

| Ресурс | Режим | Пример конфигурации | Узел контроллера | Узел PHY |
| --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3566-evb1-ddr4-v10.dtsi | pcie2x1@fe260000 | combphy2_psq |

<!-- en PDF p.18 -->

#### 2.4.3 RK3568 dts

<!-- en PDF p.18 -->

| Ресурс | Режим | Пример конфигурации | Узел контроллера | Узел PHY |
| --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3568-evb2-lp4x-v10.dtsi | pcie2x1@fe260000 | combphy2_psq |
| PCIe Gen3 x 2 lane | RC | rk3568-evb1-ddr4-v10.dtsi | pcie3x2@fe280000 | pcie30phy |
| PCIe Gen3 Разделение 1 lane + 1 lane | RC | rk3568-evb6-ddr3-v10.dtsi | pcie3x2@fe280000 pcie3x1@fe270000 | pcie30phy |
| PCIe Gen3 x 2 lane | EP | rk3568-iotest-ddr3-v10.dts | pcie3x2@fe280000 | pcie30phy |

<!-- en PDF p.18 -->

#### 2.4.4 RK3576 dts

<!-- en PDF p.18 -->

| Ресурс | Режим | Пример конфигурации | Узел контроллера | Узел PHY |
| --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3576-test1.dtsi | pcie0@2a200000 | combphy0_ps |
| PCIe Gen2 x 1 lane | RC | rk3576-test1.dtsi | pcie1@2a210000 | combphy1_psu |

<!-- en PDF p.18 -->

### 2.5 RK3588 настройка DTS

<!-- en PDF p.18 -->

Комбинации контроллеров и PHY RK3588 многочисленны и не могут быть полностью перечислены в EVB-коде SDK. Настраивайте по основным правилам; ниже приведены типичные примеры. При разделении PCIe 3.0 PHY вывод разрешения микросхемы опорного такта должен совместно управляться всеми полученными контроллерами через узел питания. Возможные способы:

<!-- en PDF p.18 -->

1. Общая ссылка vpcie3v3-supply для всех контроллеров; либо

<!-- en PDF p.18 -->

2. Свойства regulator-always-on и regulator-boot-on в узле vpcie3v3-supply. Иначе аппаратно закрепить сигнал разрешения в постоянно активном состоянии.

<!-- en PDF p.19 -->

#### 2.5.1 Пример 1: PCIe 3.0 x4 RC и два PCIe 2.0 comboPHY (RK3588 EVB1)

<!-- en PDF p.19 -->

```text
/ {
    vcc3v3_pcie30: vcc3v3-pcie30 {
        compatible = "regulator-fixed";
        regulator-name = "vcc3v3_pcie30";
        regulator-min-microvolt = <3300000>;
        regulator-max-microvolt = <3300000>;
        enable-active-high;
        gpios = <&gpio3 RK_PC3 GPIO_ACTIVE_HIGH>;
        startup-delay-us = <5000>;
        vin-supply = <&vcc12v_dcin>;
    };
};

&combphy1_ps {
    status = "okay";
};

&combphy2_psu {
    status = "okay";
};

&pcie2x1l0 {
    phys = <&combphy1_ps PHY_TYPE_PCIE>;
    reset-gpios = <&gpio4 RK_PA5 GPIO_ACTIVE_HIGH>;
    status = "okay";
};

&pcie2x1l1 {
    phys = <&combphy2_psu PHY_TYPE_PCIE>;
    reset-gpios = <&gpio4 RK_PA2 GPIO_ACTIVE_HIGH>;
    pinctrl-names = "default";
    pinctrl-0 = <&rtl8111_isolate>;
    status = "okay";
};

&pcie30phy {
    rockchip,pcie30-phymode = <PHY_MODE_PCIE_AGGREGATION>;
    status = "okay";
};

&pcie3x4 {
    reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};
```

<!-- en PDF p.20 -->

#### 2.5.2 Пример 2: PCIe 3.0 PHY разделён на два x2 RC, три PCIe 2.0 x1 comboPHY

<!-- en PDF p.20 -->

```text
/ {
    vcc3v3_pcie30: vcc3v3-pcie30 {
        compatible = "regulator-fixed";
        regulator-name = "vcc3v3_pcie30";
        regulator-min-microvolt = <3300000>;
        regulator-max-microvolt = <3300000>;
        enable-active-high;
        gpios = <&gpio3 RK_PC3 GPIO_ACTIVE_HIGH>;
        startup-delay-us = <5000>;
        vin-supply = <&vcc12v_dcin>;
    };
};

&combphy0_ps {
    status = "okay";
};

&combphy1_ps {
    status = "okay";
};

&combphy2_psu {
    status = "okay";
};

&pcie2x1l0 {
    phys = <&combphy1_ps PHY_TYPE_PCIE>;
    reset-gpios = <&gpio4 RK_PA5 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie2x1l1 {
    phys = <&combphy2_psu PHY_TYPE_PCIE>;
    reset-gpios = <&gpio4 RK_PA2 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie2x1l2 {
    reset-gpios = <&gpio4 RK_PC1 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie30phy {
    rockchip,pcie30-phymode = <PHY_MODE_PCIE_NANBNB>;
    status = "okay";
};
&pcie3x2 {
    reset-gpios = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie3x4 {
    num-lanes = <2>;
    reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};
```

<!-- en PDF p.21 -->

#### 2.5.3 Пример 3: PCIe 3.0 PHY разделён на четыре x1, один PCIe 2.0 x1 comboPHY

<!-- en PDF p.21 -->

Аппаратно pcie2x1l0/pcie2x1l1 соединены с соответствующими TX/RX PCIe 3.0 PHY; в DTS отключаются combphy1_ps/combphy2_psu. Пример кода:

<!-- en PDF p.21 -->

```text
/ {
    vcc3v3_pcie30: vcc3v3-pcie30 {
        compatible = "regulator-fixed";
        regulator-name = "vcc3v3_pcie30";
        regulator-min-microvolt = <3300000>;
        regulator-max-microvolt = <3300000>;
        enable-active-high;
        gpios = <&gpio3 RK_PC3 GPIO_ACTIVE_HIGH>;
        startup-delay-us = <5000>;
        vin-supply = <&vcc12v_dcin>;
    };
};

&combphy0_ps {
    status = "okay";
};

&pcie2x1l0 {
    phys = <&pcie30phy>;
    reset-gpios = <&gpio4 RK_PA5 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie2x1l1 {
    phys = <&pcie30phy>;
    reset-gpios = <&gpio4 RK_PA2 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie2x1l2 {
    reset-gpios = <&gpio4 RK_PC1 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie30phy {
    rockchip,pcie30-phymode = <PHY_MODE_PCIE_NABIBI>;
    status = "okay";
};

&pcie3x2 {
    num-lanes = <1>;
    reset-gpios = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie3x4 {
    num-lanes = <1>;
    reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};
```

<!-- en PDF p.22 -->

#### 2.5.4 Включение IOMMU

<!-- en PDF p.22 -->

Добавить конфигурацию PCIe IOMMU.

<!-- en PDF p.22 -->

```text
# Enable PCIe IOMMU
--- a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
@@ -3370,7 +3370,7 @@
mmu600_pcie: iommu@fc900000 {
    compatible = "arm,smmu-v3";
    reg = <0x0 0xfc900000 0x0 0x200000>;
    interrupts = <GIC_SPI 369 IRQ_TYPE_LEVEL_HIGH>,
                <GIC_SPI 371 IRQ_TYPE_LEVEL_HIGH>,
                <GIC_SPI 374 IRQ_TYPE_LEVEL_HIGH>,
                <GIC_SPI 367 IRQ_TYPE_LEVEL_HIGH>;
                interrupt-names = "eventq", "gerror", "priq", "cmdq-sync";
                #iommu-cells = <1>;
-               status = "disabled";
+               status = "okay";
};

# Controllers requiring IOMMU should reference iommu-map as needed, ensuring numerical matching with msi-map
--- a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
@@ -548,6 +548,7 @@
                num-viewport = <8>;
                max-link-speed = <3>;
                msi-map = <0x0000 &its1 0x0000 0x1000>;
+               iommu-map = <0x0000 &mmu600_pcie 0x0000 0x1000>;
                num-lanes = <4>;
                phys = <&pcie30phy>;
                phy-names = "pcie-phy";
@@ -603,6 +604,7 @@
                num-viewport = <8>;
                max-link-speed = <3>;
                msi-map = <0x1000 &its1 0x1000 0x1000>;
+               iommu-map = <0x1000 &mmu600_pcie 0x1000 0x1000>;
                num-lanes = <2>;
                phys = <&pcie30phy>;
                phy-names = "pcie-phy";
@@ -658,6 +660,7 @@
                num-viewport = <4>;
                max-link-speed = <2>;
                msi-map = <0x2000 &its0 0x2000 0x1000>;
+               iommu-map = <0x2000 &mmu600_pcie 0x2000 0x1000>;
                num-lanes = <1>;
                phys = <&combphy1_ps PHY_TYPE_PCIE>;
                phy-names = "pcie-phy";
diff --git a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
index 9e19b61..b77a073 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
@@ -6319,6 +6319,7 @@
                num-viewport = <4>;
                max-link-speed = <2>;
                msi-map = <0x3000 &its0 0x3000 0x1000>;
+               iommu-map = <0x3000 &mmu600_pcie 0x3000 0x1000>;
                num-lanes = <1>;
                phys = <&combphy2_psu PHY_TYPE_PCIE>;
                phy-names = "pcie-phy";
@@ -6373,6 +6374,7 @@
                num-viewport = <4>;
                max-link-speed = <2>;
                msi-map = <0x4000 &its0 0x4000 0x1000>;
+               iommu-map = <0x4000 &mmu600_pcie 0x4000 0x1000>;
                num-lanes = <1>;
                phys = <&combphy0_ps PHY_TYPE_PCIE>;
                phy-names = "pcie-phy";
```

<!-- en PDF p.23 -->

Получите Kernel5.10_PCIe_MMU_support.zip или Kernel6.1_PCIe_MMU_support.zip по адресу ресурсов из приложения и примените патчи архива. Старые ядра Linux не могут одновременно поддерживать несколько версий системы IOMMU, поэтому патч содержит специальные изменения. Если графические и мультимедийные IP не нужны, патчи можно не применять, отключив CONFIG_ROCKCHIP_IOMMU.

<!-- en PDF p.24 -->

### 2.6 Свойства DTS

<!-- en PDF p.24 -->

#### 2.6.1 Основные свойства DTS контроллера

<!-- en PDF p.24 -->

1. compatible = <?>; необязательное свойство выбирает RC или EP. Для RK3568 RC: compatible = "rockchip,rk3568-pcie", "snps,dw-pcie"; для EP: compatible = "rockchip,rk3568-pcie-ep", "snps,dw-pcie". Аналогично для RK1808/RK3588 заменить rk3568 на rk1808/rk3588.

<!-- en PDF p.24 -->

2. reset-gpios = <&gpio3 13 GPIO_ACTIVE_HIGH>; обязательное свойство задаёт сброс PERSTN. Для разъёма и распаянной периферии найдите правильный вывод на схеме, иначе соединение может быть нестабильным. При разделении lane каждому узлу требуется отдельная линия PERSTN.

<!-- en PDF p.24 -->

3. num-lanes = <4>; необязательное свойство задаёт число lane устройства PCIe. Обычно уже настроено в dtsi чипа и не требует изменения. При разделяемом PHY рекомендуется задавать по реальной аппаратуре.

<!-- en PDF p.24 -->

4. max-link-speed = <2>; необязательное свойство: 1 — Gen1, 2 — Gen2, 3 — Gen3. Оно связано с чипом и уже задано в dtsi чипа, поэтому обычно не требуется настройка каждой платы. Используется для испытаний или снижения скорости при проблемах проекта платы.

<!-- en PDF p.24 -->

5. status = <okay>; обязательное включение одновременно в узле контроллера и соответствующего PHY.

<!-- en PDF p.24 -->

6. vpcie3v3-supply = <&vdd_pcie3v3>; необязательно, задаёт питание 3V3 периферии. В аппаратной схеме производителя 12V и 3V3 разъёма управляются совместно, поэтому настройка 3V3 управляет и 12V. Если плата должна управлять 3V3, определите соответствующий regulator; см. Documentation/devicetree/bindings/regulator/.

<!-- en PDF p.25 -->

Для PCIe 3.0 обычно нужна внешняя микросхема такта 100M, питание которой в аппаратном проекте объединено с 3V3 периферии. Поэтому проверьте не только питание периферии, но и выход такта. Генератору требуется время стабилизации: соблюдайте минимальное время из его документации и с испытанным запасом задайте startup-delay-us в узле питания. Если после выключения питание разряжается медленно, задайте off-on-delay-us, чтобы выключение/включение были полноценными. Пример RK3568: узел vcc3v3_pcie в rk3568-evb1-ddr4-v10.dtsi.

<!-- en PDF p.25 -->

7. phys; необязательная phandle-ссылка на PHY контроллера. Некоторые контроллеры могут подключаться к нескольким PHY, например pcie2x1l0/pcie2x1l1 RK3588. Способ ссылки зависит от PHY; для comboPHY одновременно задаётся режим работы:

<!-- en PDF p.25 -->

```text
phys = <&pcie30phy>;
phys = <&combphy1_ps PHY_TYPE_PCIE>;
```

<!-- en PDF p.25 -->

8. rockchip,bifurcation; необязательное свойство только RK3568. Разделяет два lane pcie3x2 на два однолинейных контроллера. В DTS включить pcie3x1, pcie3x2 и pcie30phy, добавить rockchip,bifurcation в оба контроллера. См. rk3568-evb6-ddr3-v10.dtsi. Без этого pcie3x1 по умолчанию недоступен. Lane0 используется pcie3x2, lane1 — pcie3x1; разводка должна строго соответствовать схеме производителя. Оба контроллера должны одновременно работать как RC. После подключения двух разных периферийных устройств такт и его питание остаются общими. Не назначайте vpcie3v3-supply только одному контроллеру: получив управление 3V3, он нарушит инициализацию устройства другого контроллера. Соответствующему regulator задать regulator-boot-on и regulator-always-on.

<!-- en PDF p.25 -->

9. prsnt-gpios = <&gpio4 15 GPIO_ACTIVE_LOW>; необязательное свойство для определения наличия периферии и соответствующей схемы. В оригинале указано: при обнаружении эффективного уровня процесс обнаружения устройства пропускается. Согласно электрической спецификации PCIe низкий уровень означает подключение. Для обратной логики платы можно использовать GPIO_ACTIVE_HIGH. Сигнал позволяет одним ПО поддерживать варианты платы с PCIe3 и без него, избегая rcu stall при инициализации контроллера.

<!-- en PDF p.25 -->

10. rockchip,perst-inactive-ms = <500>;

<!-- en PDF p.26 -->

Необязательное время сброса #PERST в миллисекундах. PCIe Express Card Electromechanical Spec требует не менее 100ms от стабилизации питания нижестоящего устройства до снятия #PERST. Без свойства драйвер RK задаёт 200ms. Если периферии этого недостаточно, изменить по фактическим измерениям.

<!-- en PDF p.26 -->

11. rockchip,s2r-perst-inactive-ms = <1>; необязательное время #PERST при пробуждении, в миллисекундах. Без настройки равно rockchip,perst-inactive-ms. Если периферия, например Wi-Fi, сохраняет питание во сне, #PERST уже удерживается в сбросе; при пробуждении время можно сократить, даже до 0.

<!-- en PDF p.26 -->

12. rockchip,wait-for-link-ms = <1>; необязательное ожидание после снятия #PERST в миллисекундах. Для периферии с долгой внутренней инициализацией предотвращает системный тайм-аут; типичные примеры — FPGA и некоторые AI-ускорители.

<!-- en PDF p.26 -->

13. supports-clkreq; необязательно, только RC. Убедитесь, что CLKREQN pinctrl iomux настроен как функциональный IO. Свойство указывает наличие линии CLKREQN от root port к нижестоящему устройству; драйвер моста учитывает её наличие. Например, без CLKREQN root port настраивается без поддержки PM L1 Substates.

<!-- en PDF p.26 -->

14. rockchip,lpbk-master; специальная отладочная настройка для loopback-испытаний сигнала. Контроллер имитирует loopback master и переводит испытуемое устройство в slave. Использовать только для лабораторных испытаний RX loop; для Gen3 может понадобиться compliance mode с loopback slave. Если loopback не относится к задаче, не задавайте это свойство.

<!-- en PDF p.26 -->

15. rockchip,compliance-mode; специальный режим испытаний соответствия сигнала, принудительно переводящий контроллер в compliance test или позволяющий войти в тест с SMA-оснасткой без выключения питания. Массив из двух значений задаёт режим и preset. Для SMA рекомендуется rockchip,compliance-mode=<0 0>;. Для распаянной периферии фиксируются mode и preset: rockchip,compliance-mode=<mode preset>;. Mode 1/2/3 соответствует 2.5GT/5.0GT/8GT. Только для 5GT и 8GT допустимы preset 0–10, соответствующие P0–P10 и другим настройкам предыскажения протокола; см. таблицу PCIe TX Emphasis Preset в приложении.

<!-- en PDF p.26 -->

16. rockchip,keep-power-in-suspend

<!-- en PDF p.27 -->

Необязательно, только RC. Во сне не выключать питание периферии и не сбрасывать её, позволяя автономную работу после сна системы. Узел pcie также должен ссылаться на vpcie3v3-supply.

<!-- en PDF p.27 -->

#### 2.6.2 Настройка comboPHY DTS

<!-- en PDF p.27 -->

Следующие настройки неприменимы к combphy RK1808. Номер узла combphy обозначает Mux, суффикс — совместное использование: p, s, u, q означают PCIe, SATA, USB, QSGMII.

<!-- en PDF p.27 -->

1. rockchip,ext-refclk; специальная настройка только combophy. По умолчанию combphy использует внутренний такт SoC: например, rk3568.dtsi для RK356X задаёт 24MHz. Также поддерживаются 25M и 100M; изменить assigned-clock-rates = <24000000> на требуемую частоту. Внутренний такт наиболее экономичен и принят в SDK по умолчанию. Внешний генератор также возможен: добавить rockchip,ext-refclk в используемый PCIe узел combphy DTS платы и assigned-clock-rates для частоты внешнего входа. Допустимы только 24M, 25M, 100M.

<!-- en PDF p.27 -->

2. rockchip,enable-ssc; специальная настройка combphy для PCIe. По умолчанию выходной такт combophy не использует расширение спектра. При проблемах EMI можно попробовать это свойство в соответствующем узле combphy для включения SSC.

<!-- en PDF p.27 -->

#### 2.6.3 Настройка PCIe30 PHY DTS

<!-- en PDF p.27 -->

1. rockchip,pcie30-phymode; необязательная настройка комбинации PCIe30 PHY; по умолчанию совместно используются четыре lane. Допустимые режимы приведены в include/dt-bindings/phy/phy-snps-pcie3.h:

<!-- en PDF p.28 -->

```text
/*
 * pcie30_phy_mode[2:0]
 * bit2: aggregation
 * bit1: bifurcation for port 1
 * bit0: bifurcation for port 0
 */
#define PHY_MODE_PCIE_AGGREGATION 4 /* PCIe3x4 */
#define PHY_MODE_PCIE_NANBNB    0   /* P1:PCIe3x2  +  P0:PCIe3x2 */
#define PHY_MODE_PCIE_NANBBI    1   /* P1:PCIe3x2  +  P0:PCIe3x1*2 */
#define PHY_MODE_PCIE_NABINB    2   /* P1:PCIe3x1*2 + P0:PCIe3x2 */
#define PHY_MODE_PCIE_NABIBI    3   /* P1:PCIe3x1*2 + P0:PCIe3x1*2 */
```

<!-- en PDF p.28 -->

### 2.7 Заполнение DTS по принципиальной схеме

<!-- en PDF p.28 -->

#### 2.7.1 Низкоскоростные IO

<!-- en PDF p.28 -->

Помимо линий данных и дифференциальных пар опорного такта, PCIe может использовать следующие низкоскоростные IO:

<!-- en PDF p.28 -->

| Имя низкоскоростного IO | Функция | Описание |
| --- | --- | --- |
| PERSTN | Выход GPIO | Обязательно, свойство DTS reset-gpios |
| WAKEN | Вход GPIO домена PMU | Необязательно: функциональный драйвер регистрирует GPIO IRQ и источник пробуждения; драйвер PCIe не обрабатывает |
| PWREN | Выход GPIO | Необязательно, DTS vpcie3v3-supply |
| CLKREQN | Функция | Необязательно, для L1SS задать DTS supports-clkreq |
| PRSNTN | Вход GPIO | Необязательно, DTS prsnt-gpios |

<!-- en PDF p.28 -->

CLKREQN использует функцию PCIe и нужен только для L1SS; иначе можно не подключать. При использовании добавить соответствующее DTS-свойство. GPIO не настраивать как PCIe-функцию в pinctrl; см. нужную DTS-конфигурацию. PERSTN обязателен по протоколу, остальные сигналы зависят от проекта. Выводы режима EP описаны в Rockchip_Developer_Guide_PCIE_EP_Standard_Card_CN.

<!-- en PDF p.29 -->

#### 2.7.2 Метод настройки DTS

<!-- en PDF p.29 -->

Схема описывает оборудование через IO-сигналы, тесно связанные с индексом PHY. Индексы контроллера и PHY RK3588 могут различаться, поэтому внимательно сопоставляйте схему с DTS. Рекомендуемый порядок:

<!-- en PDF p.29 -->

1. Уточнить у разработчиков аппаратуры количество устройств PCIe и распределение интерфейсов чипа.

<!-- en PDF p.29 -->

2. По схеме определить PHY, к которому подключены линии данных устройства.

<!-- en PDF p.29 -->

3. Определить контроллер и PHY устройства и включить их в DTS.

<!-- en PDF p.29 -->

4. Проверить свойство phy и режим контроллера в DTS; например, pcie2x1ln должен выбрать comboPHY и PHY_TYPE_PCIE.

<!-- en PDF p.29 -->

5. ComboPHY может совместно использоваться SATA, USB, RGMII и другими контроллерами. Убедитесь, что остальные соответствующие контроллеры отключены в DTS.

<!-- en PDF p.29 -->

6. Проверить наличие нескольких режимов PHY и правильность настройки; например, разные разбиения pcie30phy требуют соответствующего режима.

<!-- en PDF p.29 -->

7. Определить GPIO сигнала PERSTn интерфейса и правильно задать его в DTS контроллера.

<!-- en PDF p.29 -->

8. Определить GPIO управления PWREN и настроить его в DTS контроллера; настройку также можно разместить в DTS периферии платы.

<!-- en PDF p.29 -->

9. Настроить остальное оборудование, необходимое периферии. На рисунке RK3588 pcie30phy и возможные контроллеры: красная рамка — контроллер, розовая — сигнал PHY, зелёная — сигнал периферии. Контроллер определяется соединениями периферии либо уточняется у разработчика аппаратуры. На RK3588 evb1 подключён слот PCIe3.0 x4, поэтому используется PCIe30X4 (DTS pcie3x4), остальные контроллеры этот PHY не используют.

<!-- en PDF p.30 -->

![Английский оригинал — 30](/docs/rockchip-pcie/assets/en-p030-figure-01.png)

*Английский оригинал — 30*

<!-- en PDF p.30 -->

Рисунок comboPHY RK3588: красный — контроллер, розовый — PHY, зелёный — периферия. Контроллер определяется соединениями или уточняется у аппаратного разработчика. Mux0 PHY combphy0_ps работает как SATA, не PCIe. Mux1 combphy1_ps сопоставлен PCIe30x1_0 (DTS pcie2x1l0) и может работать как PCIe — зависит от подключённого устройства. Mux2 combphy2_psu сопоставлен PCIe30x1_1 (DTS pcie2x1l1), работает как PCIe для сетевой карты.

<!-- en PDF p.31 -->

![Английский оригинал — 31](/docs/rockchip-pcie/assets/en-p031-figure-01.png)

*Английский оригинал — 31*

<!-- en PDF p.31 -->

Рисунок питания PCIe3.0 RK3588 evb1: по PCIE30X4_PWREN_H определить GPIO RK3588 и внести его в DTS контроллера pcie3x4.

<!-- en PDF p.32 -->

![Английский оригинал — 32](/docs/rockchip-pcie/assets/en-p032-figure-01.png)

*Английский оригинал — 32*

<!-- en PDF p.32 -->

### 2.8 Пример дерева устройств Wi-Fi

<!-- en PDF p.32 -->

Wi-Fi обычно подключается к PCIe2.0, у которого сложное мультиплексирование combphy; питание, сон и сброс отличаются от другой периферии. Ниже пример дерева устройств.

<!-- en PDF p.32 -->

1. По схеме определить combphy Wi-Fi. Номер узла задаёт Mux, p/s/u/q означают PCIe/SATA/USB/QSGMII. В примере Wi-Fi соединён с PCIE20/SATA30 Mux0, поэтому нужен combphy0_ps.

<!-- en PDF p.33 -->

![Английский оригинал — 33](/docs/rockchip-pcie/assets/en-p033-figure-01.png)

*Английский оригинал — 33*

<!-- en PDF p.33 -->

2. Проверить DTS и отключить остальные контроллеры, использующие этот combphy, чтобы избежать помех.

<!-- en PDF p.33 -->

3. Перенести wifi_reg_on из wireless_wlan в узел управления питанием PCIe 3.3v.

<!-- en PDF p.33 -->

4. Для энергосберегающего режима Wi-Fi L1.x см. раздел RC mode PM L1 Substates Support.

<!-- en PDF p.33 -->

5. Для беспроводного пробуждения wifi_reg_on должен оставаться высоким во сне, а wifi_host_wake подключаться к сохраняющему питание PMU IO для прерывания пробуждения хоста. Подробности схемы и ПО: Rockchip_Developer_Guide_Linux_WIFI_BT_CN.pdf в SDK.

<!-- en PDF p.33 -->

```text
+ vcc3v3_pcie20_wifi: vcc3v3-pcie20-wifi {
+     compatible = "regulator-fixed";
+     regulator-name = "vcc3v3_pcie20_wifi";
+     regulator-min-microvolt = <3300000>;
+     regulator-max-microvolt = <3300000>;
+     enable-active-high;
+    /*
+     * wifi_reg_on is enabled after vbat and vddio are stable, pulled high before reset-gpios, so
+     * it is placed in the PCIe power node to meet the module timing, referring to wifi_poweren_gpio.
+     */
+     pinctrl-0 = <&wifi_poweren_gpio>;
+     startup-delay-us = <5000>;
+     vin-supply = <&vcc12v_dcin>;
+   };

    wireless_wlan: wireless-wlan {
        compatible = "wlan-platdata";
        wifi_chip_type = "ap6275p";
        pinctrl-names = "default";
        pinctrl-0 = <&wifi_host_wake_irq>;
        WIFI,host_wake_irq = <&gpio0 RK_PA0 GPIO_ACTIVE_HIGH>;
+       /* Note: The wifi_reg_on pin also needs to be configured here for the WiFi driver to control */
+       WIFI,poweren_gpio = <&gpio0 RK_PC7 GPIO_ACTIVE_HIGH>;
        status = "okay";
    };
+
+&sata0 {
+    status = "disabled" /* sata0 and pcie2x1l2 share combphy0_ps, ensure it is disabled */
+}
+
+&combphy0_ps {
+    status = "okay"; /* Ensure phy is enabled */
+};
+
+&pcie2x1l2 {
+    reset-gpios = <&gpio3 RK_PD1 GPIO_ACTIVE_HIGH>;
+    rockchip,skip-scan-in-resume;
+    rockchip,perst-inactive-ms = <500>; /* Refer to the Wi-Fi module manual for the required #PERST reset time */
+    vpcie3v3-supply = <&vcc3v3_pcie20_wifi>;
+    status = "okay";
+};

&pinctrl {
     wireless-wlan {
         wifi_poweren_gpio: wifi-poweren-gpio {
+            //PCIE REG ON: Be sure to configure it as pull-up
+            rockchip,pins = <0 RK_PC7 RK_FUNC_GPIO &pcfg_pull_up>;
         };
     };
};
```

<!-- en PDF p.34 -->

## 3. Настройка menuconfig

<!-- en PDF p.34 -->

1. Для правильной работы PCIe включить следующие конфигурации:

<!-- en PDF p.34 -->

```text
CONFIG_PCI=y
CONFIG_PCI_DOMAINS=y
CONFIG_PCI_DOMAINS_GENERIC=y
CONFIG_PCI_SYSCALL=y
CONFIG_PCI_BUS_ADDR_T_64BIT=y
CONFIG_PCI_MSI=y
CONFIG_PCI_MSI_IRQ_DOMAIN=y
CONFIG_PHY_ROCKCHIP_SNPS_PCIE3=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
CONFIG_PCIE_DW=y
CONFIG_PCIE_DW_HOST=y
CONFIG_PCIE_DW_ROCKCHIP=y
CONFIG_PCIEPORTBUS=y
CONFIG_PCIE_PME=y
CONFIG_GENERIC_MSI_IRQ=y
CONFIG_GENERIC_MSI_IRQ_DOMAIN=y
CONFIG_IRQ_DOMAIN=y
CONFIG_IRQ_DOMAIN_HIERARCHY=y
```

<!-- en PDF p.35 -->

2. NVMe (PCIe SSD), PCIe–AHCI (SATA) и PCIe–USB (XHCI) включены в стандартном config; проверьте это. Для Ethernet, Wi-Fi и другой периферии самостоятельно проверьте соответствующие config.

<!-- en PDF p.35 -->

```text
CONFIG_BLK_DEV_NVME=y
CONFIG_SATA_PMP=y
CONFIG_SATA_AHCI=y
CONFIG_SATA_AHCI_PLATFORM=y
CONFIG_ATA_SFF=y
CONFIG_ATA=y
CONFIG_USB_XHCI_PCI=y
CONFIG_USB_XHCI_HCD=y
```

<!-- en PDF p.35 -->

Стандартное ядро поддерживает только PCIe–SATA устройства из drivers/ata/ahci.c. Для остальных обращайтесь к изготовителю или поставщику устройства.

<!-- en PDF p.35 -->

## 4. Разработка стандартной функции EP

<!-- en PDF p.35 -->

Контроллер PCIe чипов RK поддерживает режим EP, позволяющий создавать стандартные PCIe EP изделия. Реализация описана в Rockchip_Developer_Guide_PCIE_EP_Standard_Card.

<!-- en PDF p.35 -->

## 5. PM L1 Substates в режиме RC

<!-- en PDF p.35 -->

Если и контроллер RK, и периферия поддерживают PM L1 Substates, эта функция позволяет снизить потребление. Если хотя бы одно устройство не поддерживает её, особенно при слотах со сменными устройствами, не включайте: некоторые устройства перестанут работать корректно.

<!-- en PDF p.36 -->

Tpower_on RK PCIe L1SS меньше 10us и не регулируется; теоретически подходит большинству устройств. Некоторые предъявляют строгие требования, поэтому подтвердите ограничения у изготовителя. При внутреннем опорном такте соединить CLKREQN RC и EP. При внешнем такте CLKREQN RC соединяется с OE CLOCK_GEN; если OE активен высоким уровнем, нужен инвертор.

<!-- en PDF p.36 -->

![Английский оригинал — 36](/docs/rockchip-pcie/assets/en-p036-figure-01.png)

*Английский оригинал — 36*

<!-- en PDF p.36 -->

По умолчанию PM L1 Substates выключен: в DTS нет supports-clkreq;, CONFIG_PCIEASPM_POWER_SUPERSAVE=n.

<!-- en PDF p.37 -->

Для включения подтвердить поддержку RC/EP; поддержка RC указана в столбце ASPM ресурсов чипа. Соединить CLKREQN по схеме PM L1 Substates, назначить его iomux функциональному IO и добавить supports-clkreq; в контроллер (источник ссылается на пункт DTS 11). Метод 1: CONFIG_PCIEASPM_POWER_SUPERSAVE=y. Метод 2: некоторые устройства, например Wi-Fi, включают функцию из драйвера. Несоблюдение условий при включении макроса может повредить состояние линии и исключить пробуждение. Ядро должно быть актуальным и содержать commit e18dfa93 PCI: rockchip: dw: Support PM L1 clock removing.

<!-- en PDF p.37 -->

## 6. Обнаружение вставки/извлечения через GPIO

<!-- en PDF p.37 -->

### 6.1 Аппаратные требования

<!-- en PDF p.37 -->

1. PRSNTN_1 слота PCIe соединить с любым GPIO контроллера для обнаружения.

<!-- en PDF p.37 -->

2. Питание устройства PCIe должно включаться и выключаться программно.

<!-- en PDF p.37 -->

### 6.2 Программные требования

<!-- en PDF p.37 -->

1. Должны присутствовать как минимум следующие коммиты; иначе запросите патчи у поставщика.

<!-- en PDF p.38 -->

```text
commit 4de1a0c19e0f9804ba22e7f5e544fea317913957
Author: Shawn Lin <shawn.lin@rockchip.com>
Date:   Tue Mar 12 16:38:46 2024 +0800

    PCI: rockchip: dw: Add gpio based hotplug
    Change-Id: I49c57755d11cc43bbf7cf9eb23542f5e1e11aaa3

commit 86f3010d7f523c9f5a2e88d9f8f1871ed89da098
Author: Vidya Sagar <vidyas@nvidia.com>
Date:   Sat Oct 1 00:57:45 2022 +0530

    FROMLIST: PCI/hotplug: Add GPIO PCIe hotplug driver
    Change-Id: Iafa798ee4d98f195f5d33d80120da0c569132548
```

<!-- en PDF p.38 -->

2. В ядре должны быть включены следующие настройки:

<!-- en PDF p.38 -->

```text
CONFIG_HOTPLUG_PCI=y
CONFIG_HOTPLUG_PCI_GPIO=y
```

<!-- en PDF p.38 -->

3. Пример DTS:

<!-- en PDF p.38 -->

```text
&pcie0 {
  reset-gpios = <&gpio4 RK_PC7 GPIO_ACTIVE_HIGH>;
  vpcie3v3-supply = <&vcc3v3_pcie0>;
  hotplug-gpios = <&gpio4 RK_PC4 IRQ_TYPE_EDGE_BOTH>;
  pinctrl-names = "default";
  pinctrl-0 = <&hot_plug0>;
  status = "okay";
};

&pinctrl {
  pcie {
      hot_plug0: hot-plug0 {
          rockchip,pins = <4 RK_PC4 RK_FUNC_GPIO &pcfg_pull_up>;
      };
  };
};
```

<!-- en PDF p.38 -->

### 6.3 Ограничения использования

<!-- en PDF p.38 -->

1. Подключение/извлечение PCIe под питанием может повредить устройство и контроллер. Выгрузка и отключение питания после извлечения требуют времени, поэтому быстрое повторное подключение запрещено. Перед вставкой дождитесь следующего сообщения удаления:

<!-- en PDF p.39 -->

```text
[   35.680289][  T134] pcieport 0000:00:00.0: Hot-UnPlug Event
[   35.680361][  T134] pcieport 0000:00:00.0: Power Status = 1
[   35.827183][  T134] rk-pcie 2a200000.pcie: rk_pcie_slot_disable
[   35.827303][  T134] pcieport 0000:00:00.0: Hot-UnPlug Event
[   35.827323][  T134] pcieport 0000:00:00.0: Power Status = 0
[   35.827334][  T134] pcieport 0000:00:00.0: Device is already removed
```

<!-- en PDF p.39 -->

2. Для целостности данных и стабильности системы прекратить доступ к извлекаемому устройству.

<!-- en PDF p.39 -->

3. Отдельное горячее подключение нижестоящих устройств switch не поддерживается. При необходимости сначала подтвердите соответствующую поддержку switch, затем используйте rescan по разделу о замене отдельного нижестоящего устройства онлайн; эффект будет аналогичен.

<!-- en PDF p.39 -->

4. Обнаружение вставки/извлечения во сне или standby не поддерживается.

<!-- en PDF p.39 -->

## 7. Kernel DMATEST

<!-- en PDF p.39 -->

До разработки проверьте поддержку DMA контроллером по ресурсам чипа. RK PCIe DMA предоставляет тестовый механизм module_para ядра, аналогичный Linux dmatest; на его основе можно разрабатывать DMA-приложения ядра. Ядро должно содержать как минимум следующий commit; иначе запросить патч у поставщика.

<!-- en PDF p.39 -->

```text
commit a7c40cb119703e566d9d5befb8c1a7b0533dd7b7
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Tue Jan 17 17:46:48 2023 +0800

    PCI: rockchip: dw-dmatest: Suppport rc dma

    1.Set rc dma as default
    2.Changet to ep dma by sending command:
            echo 0 > ./sys/module/pcie_dw_dmatest/parameters/is_rc

    Change-Id: I9b16c328c08f220772e487c7c796b8898d74ae10
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- en PDF p.39 -->

Конфигурация тестовых макросов:

<!-- en PDF p.39 -->

```text
CONFIG_PCIE_DW_DMATEST=y
CONFIG_ROCKCHIP_PCIE_DMA_OBJ=n
```

<!-- en PDF p.39 -->

Подготовка среды: модель соединения PCIe:

<!-- en PDF p.40 -->

Заказчик самостоятельно создаёт RK RC — FPGA EP. Локальная тестовая среда RK: RK RC с конфигурацией dmatest — RK EP с конфигурацией межчипового соединения. MPS = 256B. RC и EP требуют зарезервированной памяти: рекомендуется по 64MB с адреса 0x3c000000 (стандартный тестовый адрес). Остальные ненужные контроллеры PCIe рекомендуется отключить. Подробности теста в pcie-dw-misc-dmatest.c.

<!-- en PDF p.40 -->

```text
static int size = 0x20;
module_param(size, int, 0644);
MODULE_PARM_DESC(size, "each packet size in bytes");

static unsigned int cycles_count = 1;
module_param(cycles_count, uint, 0644);
MODULE_PARM_DESC(cycles_count, "how many erase cycles to do (default 1)");

static bool irq;
module_param(irq, bool, 0644);
MODULE_PARM_DESC(irq, "Using irq? (default: false)");

static unsigned int chn_en = 1;
module_param(chn_en, uint, 0644);
MODULE_PARM_DESC(chn_en, "Each bits for one dma channel, up to 2 channels, (default enable chanel 0)");

static unsigned int rw_test = 3;
module_param(rw_test, uint, 0644);
MODULE_PARM_DESC(rw_test, "Read/Write test, 1-read 2-write 3-both(default 3)");

static unsigned int bus_addr = 0x3c000000;
module_param(bus_addr, uint, 0644);
MODULE_PARM_DESC(bus_addr, "Dmatest chn0 bus_addr(remote), chn1 add offset 0x100000, (default 0x3c000000)");

static unsigned int local_addr = 0x3c000000;
module_param(local_addr, uint, 0644);
MODULE_PARM_DESC(local_addr, "Dmatest chn0 local_addr(local), chn1 add offset 0x100000, (default 0x3c000000)");

static unsigned int test_dev;
module_param(test_dev, uint, 0644);
MODULE_PARM_DESC(test_dev, "Choose dma_obj device,(default 0)");

static bool is_rc = true;
module_param_named(is_rc, is_rc, bool, 0644);
MODULE_PARM_DESC(is_rc, "Test port is rc(default true)");
```

<!-- en PDF p.41 -->

Пример 1: RC, канал 0, запись, размер 1MB, 1000 повторений, локальный и удалённый адреса 0x3c000000:

<!-- en PDF p.41 -->

```text
echo 0 > ./sys/module/pcie_dw_dmatest/parameters/test_dev
echo 1 > ./sys/module/pcie_dw_dmatest/parameters/is_rc
echo 1 > ./sys/module/pcie_dw_dmatest/parameters/chn_en
echo 1 > ./sys/module/pcie_dw_dmatest/parameters/rw_test
echo 0x100000 > ./sys/module/pcie_dw_dmatest/parameters/size
echo 1000 > ./sys/module/pcie_dw_dmatest/parameters/cycles_count
echo 0x3c000000 > ./sys/module/pcie_dw_dmatest/parameters/local_addr
echo 0x3c000000 > ./sys/module/pcie_dw_dmatest/parameters/bus_addr
echo run > ./sys/module/pcie_dw_dmatest/parameters/dmatest
```

<!-- en PDF p.41 -->

Пример 2: EP, каналы 0/1 в двух потоках, чтение/запись, 8KB, 10000 повторений, локальный и удалённый адреса 0x3c000000:

<!-- en PDF p.41 -->

```text
echo 0 > ./sys/module/pcie_dw_dmatest/parameters/test_dev
echo 0 > ./sys/module/pcie_dw_dmatest/parameters/is_rc
echo 3 > ./sys/module/pcie_dw_dmatest/parameters/chn_en
echo 3 > ./sys/module/pcie_dw_dmatest/parameters/rw_test
echo 0x2000 > ./sys/module/pcie_dw_dmatest/parameters/size
echo 10000 > ./sys/module/pcie_dw_dmatest/parameters/cycles_count
echo 0x3c000000 > ./sys/module/pcie_dw_dmatest/parameters/local_addr
echo 0x3c000000 > ./sys/module/pcie_dw_dmatest/parameters/bus_addr
echo run > ./sys/module/pcie_dw_dmatest/parameters/dmatest
```

<!-- en PDF p.41 -->

## 8. Статистика стабильности ядра

<!-- en PDF p.41 -->

При длительной работе PCIe возможны отклонения от ожидаемого поведения. Для анализа используйте debugfs. Требуется commit pcie: rockchip: dw: Add debugfs support; иначе получите 0001-pcie-rockchip-dw-Add-debugfs-support.patch из Redmine по приложению. Порядок использования:

<!-- en PDF p.41 -->

1. Найти адрес узла контроллера проблемного устройства в журнале перечисления при загрузке либо в dtsi.

<!-- en PDF p.41 -->

2. Для примера fe16000.pcie перейти в /sys/kernel/debug/fe160000.pcie (разное написание адреса сохранено из источника).

<!-- en PDF p.41 -->

3. echo disable > err_event выключает всю статистику событий.

<!-- en PDF p.41 -->

4. echo clear > err_event очищает все счётчики.

<!-- en PDF p.41 -->

5. echo enable > err_event включает всю статистику.

<!-- en PDF p.41 -->

6. Начать длительное испытание для воспроизведения сбоя; затем выполнить cat dumpfifo и cat err_event.

<!-- en PDF p.42 -->

7. Сопоставить вывод с таблицей разбора Debugfs из приложения для предварительного определения проблемы.

<!-- en PDF p.42 -->

## 9. AER ядра и тест инъекции

<!-- en PDF p.42 -->

AER (Advanced Error Reporting) — стандартная функция Linux. Она сообщает низкоуровневые ошибки связи демонам пользовательского пространства и создаёт механизмы отказоустойчивой обработки. В сложных сценариях инъекция AER позволяет заранее имитировать события и совершенствовать обработку исключений.

<!-- en PDF p.42 -->

1. Включить AER и инъекцию в ядре для создания /dev/aer_inject:

<!-- en PDF p.42 -->

```text
CONFIG_PCIEAER=y
CONFIG_PCIEAER_INJECT=y
```

<!-- en PDF p.42 -->

2. Настроить cmdline ядра:

<!-- en PDF p.42 -->

```text
#Use RK3588-EVB Linux for example,  add pcie_pme=nomsi
--- a/arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi
@@ -12,7 +12,7 @@ aliases {
        };

        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0 irqchip.gicv3_pseudo_nmi=0 root=PARTUUID=614e0000-0000 rw rootwait rcupdate.rcu_expedited=1 rcu_nocbs=all";
+               bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0 irqchip.gicv3_pseudo_nmi=0 root=PARTUUID=614e0000-0000 rw rootwait rcupdate.rcu_expedited=1 rcu_nocbs=all pcie_pme=nomsi";
        };
```

<!-- en PDF p.42 -->

3. Проверить правильность и регистрацию AER IRQ:

<!-- en PDF p.42 -->

```text
# check the cmdline for sure we set pcie_pme=nomsi
cat /proc/cmdline
# check the irq
root@debian:/userdata# cat /proc/interrupts | grep aerdrv
 60:      0      0      0      0      0      0     0     0     INTx   0 Edge      PCIe PME, aerdrv, PCIe bwctrl
 63:      0      0      0      1      0      0     0     0     INTx   0 Edge      PCIe PME, aerdrv
110:      0      0      0      0      0      0     0     0     INTx   0 Edge      PCIe PME, aerdrv
```

<!-- en PDF p.42 -->

4. Получить aer-inject по адресу ресурсов из приложения.

<!-- en PDF p.43 -->

5. Определить адрес целевого PCIe-устройства:

<!-- en PDF p.43 -->

```text
# Use lspci to obtain the PCIe device address. Example with network card 01:00.0:
00:00.0 PCI bridge: Rockchip Electronics Co., Ltd Device 3576 (rev 01)
01:00.0 Network controller: Broadcom Inc. and subsidiaries Device 449d (rev 02)
```

<!-- en PDF p.43 -->

4. Создать тестовый сценарий (номер сохранён из источника):

<!-- en PDF p.43 -->

```text
# Example script name: aer.txt, content:

AER
BUS 1 DEV 0 FN 0        // BUS, DEV, FN correspond to the BDF of the DUT (Device Under Test)
COR_STATUS BAD_TLP      // Test correctable error: bad TLP
HEADER_LOG 0 1 2 3

AER
BUS 1 DEV 0 FN 0        // BUS, DEV, FN correspond to the BDF of the DUT
UNCOR_STATUS COMP_ABORT // Test uncorrectable error: completion abort
HEADER_LOG 4 5 6 7
```

<!-- en PDF p.43 -->

Исправимые ошибки кроме BAD_TLP: RCVR, BAD_DLLP, REP_ROLL, REP_TIMER. Неисправимые кроме COMP_ABORT: TRAIN, DLP, POISON_TLP, FCP, COMP_TIME, UNX_COM, RX_OVE, MALF_TLP, ECRC, UNSUP. Один сценарий может выполнять разные конфигурации инъекции; настройте по задаче.

<!-- en PDF p.43 -->

5. Выполнить сценарий:

<!-- en PDF p.43 -->

```text
root@rk3576-buildroot:/data# ./aer-inject aer.txt
[  459.689869] pcieport 0000:00:00.0: aer_inject: Injecting errors 00000040/00000000 into device 0000:01:00.0
[  459.690302] pcieport 0000:00:00.0: AER: Corrected error message received from 0000:01:00.0
[  459.690376] pci 0000:01:00.0: PCIe Bus Error: severity=Corrected, type=Data Link Layer, (Receiver ID)
[  459.690404] pci 0000:01:00.0:   device [14e4:449d] error status/mask=00000040/00002000
[  459.690434] pci 0000:01:00.0:    [ 6] BadTLP
```

<!-- en PDF p.43 -->

## 10. Тест инъекции ошибок ядра

<!-- en PDF p.43 -->

Для проверки устойчивости функционального драйвера RC, модели приложения, прошивки EP и аппаратного IP обоих концов можно включить инъекцию ошибок. Она имитирует ошибки взаимодействия и оценивает устойчивость ПО и IP обеих сторон. Порядок:

<!-- en PDF p.43 -->

```text
(1) The following commit needs to be included
commit fe835d5fd3329ba629f8c4290c818ef4b8f9895d
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Wed Sep 4 17:04:37 2024 +0800

    PCI: rockchip: dw: Add fault injection support
    Change-Id: Ib214cc1be565bf16bafb6a847215572f35c43753

(2) The functionality described in the "Kernel Stability Statistical Information" section of this document needs to be enabled, and the corresponding controller directory needs to be entered

(3) echo "einj_number enable_or_disable error_type error_number" > fault_injection
    |-------------------|----------------------------------------------------------|
    | Value             |         Meaning                                            |
    |-------------------|----------------------------------------------------------|
    |einj_number:       |Error injection group number, only supports 0 to 6, other values are invalid                         |
    |-------------------|----------------------------------------------------------|
    |enable_or_disable: |Enable or disable error injection, 0 means disable, 1 means enable, other values are invalid      |
    |-------------------|----------------------------------------------------------|
    |error_type:        |Error injection type selection, choose the error type corresponding to the einj_number group number as described in the appendix|
    |-------------------|----------------------------------------------------------|
    |error_number:      |Error injection quantity, only supports 0 to 255, other values are invalid                         |
    |-------------------|----------------------------------------------------------|
    For example, echo "2 1 2 128" > fault_injection, represents enabling einj2 and injecting 128 NAK DLLP packets

(4) Start the PCIe link transmission, for example, NVMe: dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000

(5) Check if the error occurs: cat err_event
    Rx Recovery Request: 0x1f
    ...
    Tx Nak DLLP: 0x80

(6) Analyze the dual-end software and hardware to see if there are any unexpected software or hardware exceptions
```

<!-- en PDF p.44 -->

## 11. Kernel PMU perf

<!-- en PDF p.44 -->

### 11.1 ПО и конфигурация

<!-- en PDF p.44 -->

```text
(1) The following five commits must be included:
commit 0270f32f207f5682a729c17e977eb87bba83823e
Author: Shuai Xue <xueshuai@linux.alibaba.com>
Date:   Fri Dec 8 10:56:50 2023 +0800
    UPSTREAM: PCI: Move pci_clear_and_set_dword() helper to PCI header
    Change-Id: I35125190a4dd8ba25e6ec14b4712750605c22285

commit 1b627c690ade9a72e3cd488e2e11edffb5d0e879
Author: Shuai Xue <xueshuai@linux.alibaba.com>
Date:   Fri Dec 8 10:56:49 2023 +0800

    UPSTREAM: PCI: Add Alibaba Vendor ID to linux/pci_ids.h
    Change-Id: I86188f119a42548ab777df0449f7d0a933f34d12

commit dcfa6c8947baeac74ab44ea8f03d3831a062c14b
Author: Shuai Xue <xueshuai@linux.alibaba.com>
Date:   Fri Dec 8 10:56:51 2023 +0800

    BACKPORT: drivers/perf: add DesignWare PCIe PMU driver
    Change-Id: I470f4dc2791168760517c77dd31a4dacd7dab591

commit 6cb6a00862fa29f815412634569e2015f86e397a
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Tue Sep 3 16:24:36 2024 +0800

    perf/dwc_pcie: Add support for Rockchip vendor devices
    Change-Id: I6fde80440d2fa058b38a7d927eb846f477812b5f

commit 50cb3fcd18fb9defe23ba95eb3962a287e957166
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Tue Sep 3 16:24:36 2024 +0800

    PCI: rockchip: dw: Add dwc pmu support for rockchip
    Change-Id: Ia27ee055aa3e63deeb7fd646411c3542b7019288

(2) The kernel must enable the CONFIG_PERF_EVENTS configuration.
(3) The system must integrate the perf tool; if not available, it can be downloaded from the development resource access address mentioned in the appendix of this document.
```

<!-- en PDF p.45 -->

### 11.2 Использование

<!-- en PDF p.45 -->

```text
(1) List all configurations supported by DWC PCIe PMU
root@rk3576-buildroot:/# /userdata/perf list | grep dwc_rootport
  dwc_rootport_0/CFG_RCVRY/                          [Kernel PMU event] #Percentage of time link is in rcvry state
  dwc_rootport_0/L0/                                 [Kernel PMU event] #Percentage of time link is in L0 state
  dwc_rootport_0/L1/                                 [Kernel PMU event] #Percentage of time link is in L1 state
  dwc_rootport_0/L1_1/                               [Kernel PMU event] #Percentage of time link is in L1.1 state
  dwc_rootport_0/L1_2/                               [Kernel PMU event] #Percentage of time link is in L1.2 state
  dwc_rootport_0/L1_AUX/                             [Kernel PMU event] #Status not supported by RK
  dwc_rootport_0/RX_L0S/                             [Kernel PMU event] #Percentage of time RX is in L0s state
  dwc_rootport_0/Rx_CCIX_TLP_Data_Payload/           [Kernel PMU event] #RK does not support CCIX data statistics
  dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/           [Kernel PMU event] #RX TLP data volume
  dwc_rootport_0/TX_L0S/                             [Kernel PMU event] #Percentage of time TX is in L0s state
  dwc_rootport_0/TX_RX_L0S/                          [Kernel PMU event] #Percentage of time both TX and RX are in L0s state
  dwc_rootport_0/Tx_CCIX_TLP_Data_Payload/           [Kernel PMU event] #RK does not support CCIX data statistics
  dwc_rootport_0/Tx_PCIe_TLP_Data_Payload/           [Kernel PMU event] #TX TLP data volume
  dwc_rootport_0/one_cycle/                          [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/rx_ack_dllp,lane=?/                 [Kernel PMU event] #Number of DLLPs acknowledged by RX
  dwc_rootport_0/rx_atomic,lane=?/                   [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/rx_ccix_tlp,lane=?/                 [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/rx_completion_with_data,lane=?/     [Kernel PMU event] #RX completion packets with data
  dwc_rootport_0/rx_completion_without_data,lane=?/  [Kernel PMU event] #RX completion packets without data
  dwc_rootport_0/rx_duplicate_tl,lane=?/             [Kernel PMU event] #Number of RX/TL dup errors
  dwc_rootport_0/rx_io_read,lane=?/                  [Kernel PMU event] #Number of ior packets on RX
  dwc_rootport_0/rx_io_write,lane=?/                 [Kernel PMU event] #Number of iow packets on RX
  dwc_rootport_0/rx_memory_read,lane=?/              [Kernel PMU event] #Number of memr packets on RX
  dwc_rootport_0/rx_memory_write,lane=?/             [Kernel PMU event] #Number of memw packets on RX
  dwc_rootport_0/rx_message_tlp,lane=?/              [Kernel PMU event] #Number of messages received on RX
  dwc_rootport_0/rx_nulified_tlp,lane=?/             [Kernel PMU event] #Number of TLPs discarded due to errors on RX
  dwc_rootport_0/rx_tlp_with_prefix,lane=?/          [Kernel PMU event] #Number of TLPs with prefix on RX
  dwc_rootport_0/rx_update_fc_dllp,lane=?/           [Kernel PMU event] #Number of flow control packets received on RX
  dwc_rootport_0/tx_ack_dllp,lane=?/                 [Kernel PMU event] #Number of DLLPs acknowledged by TX
  dwc_rootport_0/tx_atomic,lane=?/                   [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/tx_ccix_tlp,lane=?/                 [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/tx_completion_with_data,lane=?/     [Kernel PMU event] #TX completion packets with data
  dwc_rootport_0/tx_completion_without_data,lane=?/  [Kernel PMU event] #TX completion packets without data
  dwc_rootport_0/tx_configuration_read,lane=?/       [Kernel PMU event] #Number of cfg-r packets on TX
  dwc_rootport_0/tx_configuration_write,lane=?/      [Kernel PMU event] #Number of cfg-w packets on TX
  dwc_rootport_0/tx_io_read,lane=?/                  [Kernel PMU event] #Number of ior packets on TX
  dwc_rootport_0/tx_io_write,lane=?/                 [Kernel PMU event] #Number of iow packets on TX
  dwc_rootport_0/tx_memory_read,lane=?/              [Kernel PMU event] #Number of memr packets on TX
  dwc_rootport_0/tx_memory_write,lane=?/             [Kernel PMU event] #Number of memw packets on TX
  dwc_rootport_0/tx_message_tlp,lane=?/              [Kernel PMU event] #Number of messages received on TX
  dwc_rootport_0/tx_nulified_tlp,lane=?/             [Kernel PMU event] #Number of TLPs discarded due to errors on TX
  dwc_rootport_0/tx_tlp_with_prefix,lane=?/          [Kernel PMU event] #Number of TLPs with prefix sent by TX
  dwc_rootport_0/tx_update_fc_dllp,lane=?/           [Kernel PMU event] #Number of flow control packets sent by TX

(2) Start a perf feature, using time-based statistics for RX TLP as an example
 /userdata/perf stat -a -e dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/

(3) Initiate transmission
root@rk3576-buildroot:/# dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000
dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000
5000+0 records in
5000+0 records out
5242880000 bytes (5.2 GB, 4.9 GiB) copied, 14.9016 s, 352 MB/s

(4) View statistics
Performance counter stats for 'system wide':
5221423060      dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/     (50.01%)
28.298528222 seconds time elapsed

(5) Similarly, test the data volume of TX TLP, and calculate the average RX/TX bandwidth
PCIe RX Bandwidth = Rx_PCIe_TLP_Data_Payload / duration
PCIe TX Bandwidth = Tx_PCIe_TLP_Data_Payload / duration

(6) Statistics for Lane events
Since each Lane has the same events, to avoid generating a large amount of redundant information, it is recommended to specify the Lane ID, for example:
 /userdata/perf stat -a -e dwc_rootport_0/rx_memory_read,lane=1/
```

<!-- en PDF p.48 -->

## 12. Типовые вопросы применения

<!-- en PDF p.48 -->

### 12.1 Можно ли переставлять lane для удобства трассировки?

<!-- en PDF p.48 -->

1. Lane reversal реализуется аппаратным протоколом, изменения ПО не нужны. Ограничение для четырёх lane: RK поддерживает только полное обратное соединение RC Lane[0.1.2.3] с EP Lane[3.2.1.0]; остальные варианты не поддерживаются.

<!-- en PDF p.48 -->

![Английский оригинал — 48](/docs/rockchip-pcie/assets/en-p048-figure-01.png)

*Английский оригинал — 48*

<!-- en PDF p.48 -->

Для двух lane аналогично: RC Lane[0.1] соединяется с EP Lane[1.0].

<!-- en PDF p.48 -->

2. Нельзя объединять сигналы разных lane одной стороны: например, RC lane0 TX и lane1 RX не образуют общую lane для периферии.

<!-- en PDF p.49 -->

### 12.2 Можно ли менять местами дифференциальные сигналы одной lane?

<!-- en PDF p.49 -->

Инверсия PN (Lane polarity) поддерживается: обычно RC TX+ подключается к EP RX+, RC TX- к EP RX-, но RC TX+ можно соединить с EP RX-. Контроллер определяет инверсию автоматически, ПО не меняется. Перекрещивание TX/RX не поддерживается: RC lane1 TX нельзя соединять с EP lane1 TX.

<!-- en PDF p.49 -->

### 12.3 Поддерживает ли интерфейс разделение/объединение?

<!-- en PDF p.49 -->

Некоторые PCIe-порты RK поддерживают разделение и объединение; см. ресурсы чипа, примеры и описание DTS.

<!-- en PDF p.49 -->

### 12.4 Какие входные такты поддерживает PCIe 3.0?

<!-- en PDF p.49 -->

Входной такт PCIe 3.0 PHY может быть HCSL, LPHCSL или другим дифференциальным сигналом, например LVDS с дополнительным преобразованием уровня, при соответствии спецификации PHY.

<!-- en PDF p.49 -->

![Английский оригинал — 49](/docs/rockchip-pcie/assets/en-p049-figure-01.png)

*Английский оригинал — 49*

<!-- en PDF p.49 -->

![Английский оригинал — 49](/docs/rockchip-pcie/assets/en-p049-figure-02.png)

*Английский оригинал — 49*

<!-- en PDF p.50 -->

![Английский оригинал — 50](/docs/rockchip-pcie/assets/en-p050-figure-01.png)

*Английский оригинал — 50*

<!-- en PDF p.50 -->



**Редактируемая транскрипция исходных рисунков**

| Обозначение | Параметр | Мин. | Макс. | Единицы | Условия |
| --- | --- | --- | --- | --- | --- |
| FREF_CLK | Частота опорного такта | 19.2 | 200 | MHz | Не непрерывный диапазон; по протоколу согласно справочнику |
| FREF_OFFSET | Смещение частоты опорного такта | -100 | 100 | ppm | Все протоколы, кроме SATA |
| RMSJREF_CLK <= 8 Gbps | Случайный джиттер опорного такта |  | 1.6 | ps_rms | Интегральный RJ от 12 kHz до 20 MHz |
| RMSJREF_CLK <= 8 Gbps | Случайный джиттер опорного такта |  | 1.2 | ps_rms | Интегральный RJ от 2 MHz до 20 MHz |
| DJREF_CLK <= 8 Gbps | Детерминированный джиттер опорного такта |  | 2.8 | ps, pp | 0.75–10 MHz (offset), a |
| DJREF_CLK <= 8 Gbps | Детерминированный джиттер опорного такта |  | 5.6 | ps, pp | 0.2–50 MHz (offset), a |
| DCREF_CLK | Коэффициент заполнения | 40 | 60 | % |  |
| VCMREF_CLK | Синфазный входной уровень | 0 | vp | V | Дифференциальные входы |
| VDREF_CLK | Размах дифференциального входа | 300 | 2*vp | mVppd | Дифференциальный вход должен удовлетворять VDREF_CLK и VDSEREF_CLK |
| VDSEREF_CLK | Однополярное напряжение дифференциального такта | 0 | vp |  | Дифференциальный вход должен удовлетворять VDREF_CLK и VDSEREF_CLK |
| SKEWDIF_CLK | Перекос дифференциального входного такта |  | 100 | ps |  |
| SWREF_CLK | Скорость нарастания дифференциального такта | 0.1 |  | V/ns | 20–80% |

Для PCIe соблюдайте CEM. Сноска a: пределы DJ относятся к шуму в диапазоне смещения от поделённого опорного такта и его гармоник. Пустые ячейки оставлены как в источнике.

Поддержка 1.2 V в источнике ещё требует исследования характеристик кремния и проверки; это не подтверждённая рабочая точка ArmSoM.

| vph / vp/vpdig/vptxX | Min | Typ | Max |
| --- | --- | --- | --- |
| vph | 1.8 V -10% | 1.8 V | 1.8 V +10% |
| vph | 1.5 V -5% | 1.5 V | 1.5 V +10% |
| vph | 1.2 V -5% | 1.2 V | 1.2 V +10% |
| vp/vpdig/vptxX | 0.9 V -7% | 0.9 V | 0.9 V +10% |

### 12.5 Поддерживаются ли PCIe switch и какие рекомендуются?

<!-- en PDF p.50 -->

### 12.6 Как сопоставить контроллеры и устройства?

<!-- en PDF p.50 -->

Пример RK3568: PCIe2x1 выделяет шины 0x0~0xf, PCIe3x1 — 0x10~0x1f, PCIe3x2 — 0x20~0x2f. Старшие разряды адресов lspci позволяют определить соответствие. Второй столбец Class — тип устройства, третий — VID:PID. Типы: https://pci-ids.ucw.cz/read/PD/; производители/изделия: http://pci-ids.ucw.cz/v2.2/pci.ids.

<!-- en PDF p.50 -->

```text
console:/ # lspci
21:00.0 Class 0108: 144d:a808
20:00.0 Class 0604: 1d87:3566
11:00.0 Class 0c03: 1912:0014
10:00.0 Class 0604: 1d87:3566
01:00.0 Class 0c03: 1912:0014
00:00.0 Class 0604: 1d87:3566
```

<!-- en PDF p.50 -->

Каждому контроллеру резервируется 16 уровней шин для нижестоящих устройств; источник описывает это как 16 устройств, включая switch, обычно достаточно. При необходимости изменить bus-range трёх контроллеров в rk3568.dtsi без пересечений. Если изменение не требуется, дальнейшее пояснение можно пропустить.

<!-- en PDF p.51 -->

Изменение bus-range меняет диапазоны RID MSI(-X); соответственно изменить msi-map.

<!-- en PDF p.51 -->

```text
bus-range = <start address   end address>

msi-map = < start address in bus-range << 8
            &its
            start address in bus-range << 8
            total number of buses allocated in bus-range << 8>
```

<!-- en PDF p.51 -->

Пример: bus-range 0x30~0x60 выделяет нижестоящим устройствам адреса 0x30–0x60, в источнике указано всего 0x30 шин. Тогда msi-map = <0x3000 &its 0x3000 0x3000>. Диапазоны bus-range и msi-map трёх контроллеров не должны пересекаться и должны соответствовать друг другу.

<!-- en PDF p.51 -->

### 12.7 Как определить состояние линии устройства?

<!-- en PDF p.51 -->

Выполнить lspci -vvv инструментом с сервера и найти linkStat устройства: Speed — скорость, Width — число lane. Для разбора остальных полей использовать дополнительные справочники.

<!-- en PDF p.51 -->

### 12.7a Число доступных MSI (дополнение из китайского источника)

Этот абзац есть в китайской V6.29.0, §12.8 (с.46), но отсутствует в английской редакции. Число MSI, выделяемых устройствам PCIe, определяется ресурсами контроллера прерываний. Для всех устройств ниже каждого контроллера RK1808/RK3566/RK3568/RK3588 суммарно доступны 65535 MSI; для RK3528/RK3562/RK3576 — 32. Это данные источника, а не измерения ArmSoM.

### 12.8 Поддерживается ли Legacy INT и как принудительно использовать INTA–INTD?

<!-- en PDF p.51 -->

Legacy INT поддерживается. Приоритет Linux: MSI-X, MSI, Legacy INT, поэтому обычные устройства Legacy INT не запрашивают. Для отладки MSI можно отключить в cmdline согласно Documentation/admin-guide/kernel-parameters.txt, параметрам pci=option[,option...]. Тогда принудительно используется Legacy INT. Для RK356X Android добавить pci=nomsi с пробелами до и после в cmdline arch/arm64/boot/dts/rockchip/rk3568-android.dtsi:

<!-- en PDF p.51 -->

```text
bootargs = "...... pci=nomsi ......";
```

<!-- en PDF p.51 -->

После успешного добавления lspci -vvv показывает MSI и MSI-X Enable-, выделено INT A номер 80. Состояние прерывания 80 смотреть через cat /proc/interrupts.

<!-- en PDF p.52 -->

```text
01:00.0 Class 0108: Device 14a4:22f1 (rev 01) (prog-if 02)
        Subsystem: Device 1b4b:1093
...
        Interrupt: pin A routed to IRQ 80
...
        Capabilities: [50] MSI: Enable- Count=1/1 Maskable+ 64bit+
                Address: 0000000000000000  Data: 0000
                Masking: 00000000  Pending: 00000000
...
        Capabilities: [b0] MSI-X: Enable- Count=19 Masked-
                Vector table: BAR=0 offset=00002000
                PBA: BAR=0 offset=00003000
```

<!-- en PDF p.52 -->

### 12.9 Как обращаться к BAR при 32-битном CPU?

<!-- en PDF p.52 -->

По умолчанию BAR контроллера расположен выше 32-битного адресного пространства. Чип также резервирует низкий BAR, ограничения различаются по контроллерам. На RK3568 каждому доступно только 32MB низких адресов. При 32-битном режиме CPU включить низкое пространство и переназначить ranges каждого PCIe-узла. Пример выделяет 1MB конфигурации, 1MB IO и 30MB 32-битного MEM:

<!-- en PDF p.52 -->

```text
&pcie2x1 {
        ranges = <0x00000800 0x0 0xF4000000 0x0 0xF4000000 0x0 0x100000
                  0x81000000 0x0 0xF4100000 0x0 0xF4100000 0x0 0x100000
                  0x82000000 0x0 0xF4200000 0x0 0xF4200000 0x0 0x1e00000>;
}

&pcie3x1 {
        ranges = <0x00000800 0x0 0xF2000000 0x0 0xF2000000 0x0 0x100000
                  0x81000000 0x0 0xF2100000 0x0 0xF2100000 0x0 0x100000
                  0x82000000 0x0 0xF2200000 0x0 0xF2200000 0x0 0x1e00000>;
}

&pcie3x2 {
        ranges = <0x00000800 0x0 0xF0000000 0x0 0xF0000000 0x0 0x100000
                  0x81000000 0x0 0xF0100000 0x0 0xF0100000 0x0 0x100000
                  0x82000000 0x0 0xF0200000 0x0 0xF0200000 0x0 0x1e00000>;
}
```

<!-- en PDF p.52 -->

Для изменения размеров см. приложение с подробным описанием пространства адресов PCIe.

<!-- en PDF p.53 -->

### 12.10 Как увидеть и сопоставить CPU-адрес и адрес шины PCIe?

<!-- en PDF p.53 -->

lspci показывает адреса домена CPU и домена шины PCIe каждого устройства.

<!-- en PDF p.53 -->

```text
root@linaro-alip: /home/linaro# lspci -Vs 0002:21:00.0 -X
0002:21 :00.0 Non-Volatile memory controller: Intel Corporation SSD Pro 7600p/ 760p/E 6100p Series (rev 03) (prog-if 02 [NVM Express] )
    Subsystem: Intel Corporation SSD Pro 7600p/ 760p/E 6100p Series
    Flags: bus master, fast devsel, latency 0, IRQ 114
    Memory at 380900000 (64-bit, non-prefetchable) [size=16K]
    Capabilities: [40] Power Management version 3
    ....

00: 86 80 a6 f1 06 04 10 00 03 02 08 01 00 00 00 00
10: 04 00 90 80 00 00 00 00 00 00 00 00 00 00 00 00
20: 00 00 00 00 00 00 00 00 00 00 00 00 86 80 0b 39
30: 00 00 00 00 40 00 00 00 00 00 00 00 72 01 00 00
```

<!-- en PDF p.53 -->

CPU-адрес периферии 0x380900000 можно читать командами IO или devmem. Соответствующий адрес шины читается из BAR0 периферии, смещения 0x10–0x14: «04 00 90 80», то есть 0x80900000; младшие 04 обозначают 64bit MEM. При обращении CPU к 0x380900000 ATU по outbound-сопоставлению формирует 0x80900000 на PCIe, позволяя доступ к периферии. Связь задаётся в rk3568.dtsi; пример pcie3x2:

<!-- en PDF p.53 -->

```text
ranges = <0x00000800 0x0 0x80000000 0x3 0x80000000 0x0 0x800000
          0x81000000 0x0 0x80800000 0x3 0x80800000 0x0 0x100000  IO space
          0x83000000 0x0 0x80900000 0x3 0x80900000 0x0 0x3f700000>; Memory space
```

<!-- en PDF p.53 -->

В сегменте Memory 0x83000000 обозначает 64-битное пространство без prefetch. 0x3 0x80900000 — CPU-адрес 0x0000000380900000; 0x0 0x80900000 — PCIe-адрес 0x0000000080900000; 0x3f700000 — полный размер сегмента. Смещение между CPU и PCIe равно 0x300000000, ATU преобразует аппаратно. Подробности в приложении конфигурации адресов.

<!-- en PDF p.54 -->

### 12.11 Как пересканировать или заменить отдельное устройство онлайн?

<!-- en PDF p.54 -->

Повторное перечисление нижестоящего устройства требуется в двух случаях:

<!-- en PDF p.54 -->

1. Пространство BAR устройства меняется на разных этапах.

<!-- en PDF p.54 -->

2. Повреждённое устройство заменяется онлайн.

<!-- en PDF p.54 -->

```text
(1) Identify the downstream device that needs to be replaced or rescanned. Currently, we take the device with BDF 01:00.0 as an example.
console:/ # /data/lspci -k
00:00.0 Class 0604: Device 1d87:3566 (rev 01)
        Kernel driver in use: pcieport
01:00.0 Class 0c03: Device 1912:0014 (rev 03)

(2) Perform the remove operation on the device, and you can see the corresponding device node and the PCIe driver it runs are uninitialized.
console:/ # echo 1 > /sys/bus/pci/devices/0000\:01\:00.0/remove
[   30.624938] xhci_hcd 0000:01:00.0: remove, state 4
[   30.624985] usb usb8: USB disconnect, device number 1
[   30.625741] xhci_hcd 0000:01:00.0: USB bus 8 deregistered
[   30.626115] xhci_hcd 0000:01:00.0: remove, state 4
[   30.626142] usb usb7: USB disconnect, device number 1
[   30.640977] xhci_hcd 0000:01:00.0: USB bus 7 deregistered
[   32.055886] vcc5v0_otg: disabling
[   32.055920] vcc3v3_lcd1_n: disabling

(3) Check again to confirm that the device is no longer detected.
console:/ # /data/lspci -k
00:00.0 Class 0604: Device 1d87:3566 (rev 01)
        Kernel driver in use: pcieport

(4) Initiate a bus rescan. You can choose either of the following two commands. After execution, the new device will be recognized.
console:/ #  echo 1 > /sys/bus/pci/devices/0000\:00\:00.0/rescan
console:/ #  echo 1 > /sys/bus/pci/rescan
[   33.222240] pci 0000:01:00.0: BAR 0: assigned [mem 0x300900000-0x300900fff 64bit]
[   33.222606] xhci_hcd 0000:01:00.0: xHCI Host Controller
[   33.224875] xhci_hcd 0000:01:00.0: new USB bus registered, assigned bus number 7
[   33.225468] xhci_hcd 0000:01:00.0: hcc params 0x002841eb hci version 0x100 quirks 0x0000000000000090
[   33.226318] usb usb7: New USB device found, idVendor=1d6b, idProduct=0002, bcdDevice= 4.19
[   33.226329] usb usb7: New USB device strings: Mfr=3, Product=2, SerialNumber=1
[   33.226345] usb usb7: Product: xHCI Host Controller
[   33.226355] usb usb7: Manufacturer: Linux 4.19.172 xhci-hcd
[   33.226364] usb usb7: SerialNumber: 0000:01:00.0
[   33.227661] hub 7-0:1.0: USB hub found
[   33.227716] hub 7-0:1.0: 1 port detected
[   33.228252] xhci_hcd 0000:01:00.0: xHCI Host Controller
[   33.228581] xhci_hcd 0000:01:00.0: new USB bus registered, assigned bus number 8
[   33.226816] xhci_hcd 0000:01:00.0: Host supports USB 3.0 SuperSpeed
[   33.228678] usb usb8: We don't know the algorithms for LPM for this host, disabling LPM.
[   33.228783] usb usb8: New USB device found, idVendor=1d6b, idProduct=0003, bcdDevice= 4.19
[   33.228796] usb usb8: New USB device strings: Mfr=3, Product=2, SerialNumber=1
[   33.228803] usb usb8: Product: xHCI Host Controller
[   33.228809] usb usb8: Manufacturer: Linux 4.19.172 xhci-hcd
[   33.228814] usb usb8: SerialNumber: 0000:01:00.0
[   33.229360] hub 8-0:1.0: USB hub found
[   33.229406] hub 8-0:1.0: 4 ports detected
[   33.556216] usb 7-1: new high-speed USB device number 2 using xhci_hcd
[   33.700886] usb 7-1: New USB device found, idVendor=2109, idProduct=3431, bcdDevice= 4.20
[   33.700913] usb 7-1: New USB device strings: Mfr=0, Product=1, SerialNumber=0
[   33.700920] usb 7-1: Product: USB2.0 Hub
[   33.702398] hub 7-1:1.0: USB hub found
[   33.702642] hub 7-1:1.0: 4 ports detected
```

<!-- en PDF p.55 -->

### 12.12 Как поддерживать согласованность кеша периферии и драйвера?

<!-- en PDF p.55 -->

Согласно Snoop/No Snoop PCIe периферия выставляет атрибут No Snoop в TLP запроса к хосту, указывая необходимость аппаратной помощи хоста для согласованности кеша.

<!-- en PDF p.55 -->

| No Snoop Bit | Тип согласованности кеша | Модель управления | Примечания |
| --- | --- | --- | --- |
| 0 | Snoop | Аппаратная согласованность кеша | Для Cfg, I/O, Message и MSI(-x) должно быть 0 |
| 1 | No Snoop | Драйвер периферии поддерживает согласованность | - |

<!-- en PDF p.55 -->

При записи TLP в память хоста с No Snoop=0 RC проверяет, находится ли адрес в кеше других CPU, и после записи в физическую память выполняет invalidate всех таких CPU. При чтении памяти хоста с No Snoop=0 RC проверяет кеши всех CPU и при наличии кешированных данных выполняет flush перед чтением. Некоторые RK-чипы не поддерживают Snoop и всегда обрабатывают как No Snoop=1; их функциональные драйверы должны поддерживать согласованность самостоятельно. При поддержке Snoop чип обеспечивает согласованность.

<!-- en PDF p.56 -->

| Платформы без согласованности кеша PCIe | Платформы с согласованностью кеша PCIe |
| --- | --- |
| RK1808, RK3528, RK3562, RK3566, RK3568, RK3588(s) | RK3576 |

<!-- en PDF p.56 -->

### 12.13 Может ли PCIe beacon пробудить хост?

<!-- en PDF p.56 -->

RK не поддерживает пробуждение хоста из L2 сигналом beacon устройства PCIe. Для пробуждения использовать #WAKE как GPIO-источник.

<!-- en PDF p.56 -->

### 12.14 Как командой вызвать MSI от RK PCIe EP?

<!-- en PDF p.56 -->

Перед тестом: RC и EP поддерживают и включают MSI cap; у RK это включено по умолчанию. На RC работает функциональный драйвер EP и запросил MSI. Регистр EP PCIE_CLIENT_MSI_GEN_CON запускает MSI: 32 бита соответствуют 32 прерываниям. Пример RK3588:

<!-- en PDF p.56 -->

```text
io -4 0xFE150038 1
```

<!-- en PDF p.56 -->

Также можно настроить outbound ATU и инициировать memory write от CPU либо через DMA. Некоторые ПК под Linux и Windows позволяют запросить только одно MSI из-за BIOS, например настроек Intel virtualization/VT-d и Interrupt remapper. RK3588 RC поддерживает запрос до 32 MSI.

<!-- en PDF p.56 -->

### 12.15 Как командой вызвать MSI-X от RK PCIe EP?

<!-- en PDF p.56 -->

Принцип: ПК настраивает таблицу MSI через стандартное MSI-X cap с отображением BAR4. Пример RK3568:

<!-- en PDF p.57 -->

```text
# After loading the driver, the msix configuration status can be viewed from the device side by executing the following two commands to see the MSI-X table
io -4 0xfe280270 0x10001      # Enable Dbi writeable during testing
io -4 -l 0x100 0xf6300000
io -4 0xfe280270 0x10000

f6300000:  fee02004 00000000 00000024 00000000
f6300010:  fee08004 00000000 00000024 00000000
f6300020:  fee01004 00000000 00000024 00000000
f6300030:  fee02004 00000000 00000025 00000000
f6300040:  fee08004 00000000 00000025 00000000
f6300050:  fee01004 00000000 00000025 00000000
f6300060:  fee02004 00000000 00000026 00000000
f6300070:  fee04004 00000000 00000026 00000000
f6300080:  00000000 00000000 00000000 00000001
f6300090:  00000000 00000000 00000000 00000001
f63000a0:  00000000 00000000 00000000 00000001
f63000b0:  00000000 00000000 00000000 00000001
f63000c0:  00000000 00000000 00000000 00000001
f63000d0:  00000000 00000000 00000000 00000001
f63000e0:  00000000 00000000 00000000 00000001
f63000f0:  00000000 00000000 00000000 00000001

# Since the current business does not provide an MSI-X interface example, MSI-X can be triggered in the following way
# Set device outbound, the default RK EP outbound configuration CPU addr is 0xf0000000, unchanged during testing, or Bar outbound configuration can be completed through the kernel interface
io -4 0xf6300014 0xfee00000    # Points to the output address of the previous io -4 -l 0x100 0xf5300000
io -4 0xf6300018 0x0

# Trigger MSI-X
io -4 0xf0002004 0x24
io -4 0xf0008004 0x24
io -4 0xf0001004 0x24
io -4 0xf0002004 0x25
io -4 0xf0008004 0x25
io -4 0xf0001004 0x25
io -4 0xf0002004 0x26
io -4 0xf0004004 0x26
```

<!-- en PDF p.57 -->

Пример RK3588:

<!-- en PDF p.57 -->

```text
# After loading the driver, the msix configuration status can be viewed from the device side by executing the following two commands to see the MSI-X table
io -4 0xfe150270 0x10001       # Enable Dbi writeable during testing
io -4 -l 0x100 0xf5300000
io -4 0xfe150270 0x10000

f5300000:  fee02004 00000000 00000024 00000000
f5300010:  fee08004 00000000 00000024 00000000
f5300020:  fee01004 00000000 00000024 00000000
f5300030:  fee02004 00000000 00000025 00000000
f5300040:  fee08004 00000000 00000025 00000000
f5300050:  fee01004 00000000 00000025 00000000
f5300060:  fee02004 00000000 00000026 00000000
f5300070:  fee04004 00000000 00000026 00000000
f5300080:  00000000 00000000 00000000 00000001
f5300090:  00000000 00000000 00000000 00000001
f53000a0:  00000000 00000000 00000000 00000001
f53000b0:  00000000 00000000 00000000 00000001
f53000c0:  00000000 00000000 00000000 00000001
f53000d0:  00000000 00000000 00000000 00000001
f53000e0:  00000000 00000000 00000000 00000001
f53000f0:  00000000 00000000 00000000 00000001

# Since the current business does not provide an MSI-X interface example, MSI-X can be triggered in the following way
# Set device outbound, the default RK EP outbound configuration CPU addr is 0xf0000000, unchanged during testing, or Bar outbound configuration can be completed through the kernel interface
io -4 0xf5300014 0xfee00000    # Points to the output address of the previous io -4 -l 0x100 0xf5300000
io -4 0xf5300018 0x0

# Trigger MSI-X
io -4 0xf0002004 0x24
io -4 0xf0008004 0x24
io -4 0xf0001004 0x24
io -4 0xf0002004 0x25
io -4 0xf0008004 0x25
io -4 0xf0001004 0x25
io -4 0xf0002004 0x26
io -4 0xf0004004 0x26
```

<!-- en PDF p.58 -->

### 12.16 Как увеличить пространство отображения 32bits-np?

<!-- en PDF p.58 -->

PCIe mmio — выделенное физическое адресное пространство CPU-инициируемой передачи PCIe, не входящее в DRAM. У каждого контроллера свой mmio: обычно 32MB 32-битного и 1GB 64-битного пространства. range связывает CPU-адрес с виртуальным адресом PCI-домена. Адрес домена не должен пересекаться с физическим DRAM, иначе EP DMA может обратиться неверно. Поэтому по умолчанию доменный адрес совпадает с физическим mmio соответствующего контроллера. Для расширения ограниченного 32bits-np пространства допускается совместное использование доменных 32bits-np адресов других PCIe-контроллеров, но физический MMIO берётся только из 64-битного MMIO того же контроллера, не другого. Для дальнейшего расширения ищите большие свободные блоки 32-битного MMIO других IP в System Map TRM и используйте их как доменные адреса. При отсутствии таких блоков используйте зарезервированную память ниже 4GB. Пример стандартной конфигурации RK3588:

<!-- en PDF p.59 -->

```text
[    5.325570] pci_bus 0000:00: root bus resource [mem 0xf0200000-0xf0ffffff]
           # RC 14MB 32bits-np mem
[    5.325577] pci_bus 0000:00: root bus resource [mem 0x900000000-0x93fffffff pref]
          # RC 1GB 64bits-pref mem
```

<!-- en PDF p.59 -->

Проблема: стандартного выделения 32bits-np недостаточно. Журнал:

<!-- en PDF p.59 -->

```text
[   11.646077] pci 0000:01:00.0: reg 0x10: [mem 0x00000000-0x00ffffff 64bit]   # Dev requires a total of 26MB 32bits-np, and will eventually align to a requirement of 32MB space
[   11.646113] pci 0000:01:00.0: reg 0x18: [mem 0x00000000-0x007fffff 64bit]
[   11.646150] pci 0000:01:00.0: reg 0x20: [mem 0x00000000-0x001fffff 64bit]
...
[   11.971710] pci 0000:01:00.0: BAR 0: no space for [mem size 0x01000000 64bit]
[   11.971713] pci 0000:01:00.0: BAR 0: failed to assign [mem size 0x01000000 64bit]
[   11.971717] pci 0000:01:00.0: BAR 2: no space for [mem size 0x00800000 64bit]
[   11.971720] pci 0000:01:00.0: BAR 2: failed to assign [mem size 0x00800000 64bit]
[   11.971723] pci 0000:01:00.0: BAR 4: no space for [mem size 0x00200000 64bit]
[   11.971726] pci 0000:01:00.0: BAR 4: failed to assign [mem size 0x00200000 64bit]
```

<!-- en PDF p.59 -->

По TRM подтвердить выделенное PCIe-пространство и добавить недостающие mem ranges. Пример 1: RK3588 pcie3x4, 240MB 32bits-np; изменить range соответствующего узла rk3588.dtsi:

<!-- en PDF p.59 -->

```text
ranges = <0x00000800 0x0 0xff000000 0x0 0xf0000000 0x0 0x100000
          0x81000000 0x0 0xff100000 0x0 0xf0100000 0x0 0x100000
          0x82000000 0x0 0xf0000000 0x9 0x00000000 0x0 0x0f000000
          0xc3000000 0x9 0x10000000 0x9 0x10000000 0x0 0x30000000>;
```

<!-- en PDF p.59 -->

Пример 2: RK3588s pcie2x1l2, 240MB 32bits-np; range в rk3588s.dtsi:

<!-- en PDF p.60 -->

```text
ranges = <0x00000800 0x0 0xff000000 0x0 0xf4000000 0x0 0x100000
          0x81000000 0x0 0xff100000 0x0 0xf4100000 0x0 0x100000
          0x82000000 0x0 0xf0000000 0xa 0x00000000 0x0 0x0f000000
          0xc3000000 0xa 0x10000000 0xa 0x10000000 0x0 0x30000000>;
```

<!-- en PDF p.60 -->

Пример 3: RK3588 pcie2x1l0, 240MB 32bits-np; range в rk3588.dtsi:

<!-- en PDF p.60 -->

```text
ranges = <0x00000800 0x0 0xff000000 0x0 0xff000000 0x0 0x100000
          0x81000000 0x0 0xff100000 0x0 0xff100000 0x0 0x100000
          0x82000000 0x0 0xf0000000 0x9 0x80000000 0x0 0x0f000000
          0xc3000000 0x9 0x90000000 0x9 0x90000000 0x0 0x30000000>;
```

<!-- en PDF p.60 -->

Пример 4: RK3568 pcie3x2, 240MB 32bits-np; range в rk356x.dtsi:

<!-- en PDF p.60 -->

```text
ranges = <0x00000800 0x0 0xff000000 0x0 0xf0000000 0x0 0x100000
          0x81000000 0x0 0xff100000 0x0 0xf0100000 0x0 0x100000
          0x82000000 0x0 0xf0000000 0x3 0x80000000 0x0 0x0f000000
          0xc3000000 0x3 0x90000000 0x3 0x90000000 0x0 0x30000000>;
```

<!-- en PDF p.60 -->

Пример 5: к примеру 1 добавить отображение 256M с адреса 0x30000000 и зарезервировать память:

<!-- en PDF p.60 -->

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
index a10dad37f9cf..d1b16e13c459 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
@@ -233,6 +233,15 @@ wireless_wlan: wireless-wlan {
                WIFI,poweren_gpio = <&gpio3 RK_PB1 GPIO_ACTIVE_HIGH>;
                status = "okay";
        };
+
+       reserved-memory {
+               #address-cells = <2>;
+               #size-cells = <2>;
+               ranges;
+               pcie3x4_range: pcie3x4-range@30000000 {
+                       reg = <0x0 0xdfe00000 0x0 0x10200000>;
+               };
+       };
 };

 &backlight {
diff --git a/arch/arm64/boot/dts/rockchip/rk3588.dtsi b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
index ad414c61fd38..096f16740e11 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
@@ -601,10 +601,11 @@ pcie3x4: pcie@fe150000 {
                phys = <&pcie30phy>;
                phy-names = "pcie-phy";
                power-domains = <&power RK3588_PD_PCIE>;
-               ranges = <0x00000800 0x0 0xf0000000 0x0 0xf0000000 0x0 0x100000
-                         0x81000000 0x0 0xf0100000 0x0 0xf0100000 0x0 0x100000
-                         0x82000000 0x0 0xf0200000 0x0 0xf0200000 0x0 0xe00000
-                         0xc3000000 0x9 0x00000000 0x9 0x00000000 0x0 0x40000000>;
+                ranges = <0x00000800 0x0 0xdfe00000 0x0 0xf0000000 0x0 0x100000
+                          0x81000000 0x0 0xdff00000 0x0 0xf0100000 0x0 0x100000
+                          0x82000000 0x0 0xe0000000 0x9 0x00000000 0x0 0x20000000 // Extended to 512MB
+                          0xc3000000 0x9 0x20000000 0x9 0x20000000 0x0 0x20000000>;
                reg = <0x0 0xfe150000 0x0 0x10000>,
                      <0xa 0x40000000 0x0 0x400000>;
                reg-names = "pcie-apb", "pcie-dbi";
```

<!-- en PDF p.61 -->

### 12.17 Как настроить Maximum Payload Size?

<!-- en PDF p.61 -->

PCIe передаёт TLP. Maximum Payload Size (MPS) задаёт максимальное число байт нагрузки TLP и согласуется концами линии; отправитель не может превысить его. Ядро предоставляет настройку через DTS для PCI subsystem options; см. Documentation/admin-guide/kernel-parameters.txt. Конфигурации:

<!-- en PDF p.61 -->

```text
pcie_bus_tune_off  # Disable MPS adjustment, use the device's default value
pcie_bus_safe      # Enable MPS adjustment, set the maximum MPS value supported by all devices
pcie_bus_perf      # Enable MPS adjustment, set the maximum MPS based on the parent bus and its own capability
pcie_bus_peer2peer # Enable MPS adjustment, set all devices to have an MPS of 128B
```

<!-- en PDF p.61 -->

По умолчанию механизм max payload size — pcie_bus_tune_off. Обычно можно непосредственно добавить pci=pcie_bus_safe в DTS bootargs.

<!-- en PDF p.61 -->

### 12.18 Как закрепить ID перечисленных устройств?

<!-- en PDF p.61 -->

При нескольких однотипных PCIe-устройствах, например сетевых картах, порядок инициализации не фиксирован, поэтому eth0 может соответствовать разным устройствам. Это относится и к NVMe. Для постоянного ID измените функциональный драйвер, используя то, что номер шины задаётся DTS. Два примера:

<!-- en PDF p.61 -->

```text
If RK3588 is connected to three network cards and wants to fix the order as follows:
pcie2x1l0: pcie@fe170000 => eth1
pcie2x1l2: pcie@fe190000 => eth2
pcie2x1l1: pcie@fe180000 => eth3

By querying dtsi, it is known that:
pcie2x1l0 node: bus-range = <0x20 0x2f> -> The bus number allocated to the network card is 0x21 -> eth1
pcie2x1l2 node: bus-range = <0x40 0x4f> -> The bus number allocated to the network card is 0x41 -> eth2
pcie2x1l1 node: bus-range = <0x30 0x3f> -> The bus number allocated to the network card is 0x31 -> eth3

Modify the corresponding function driver to change the name registered to the network subsystem before the register_netdev function is called.
--- a/drivers/net/ethernet/realtek/r8168/r8168_n.c
+++ b/drivers/net/ethernet/realtek/r8168/r8168_n.c
@@ -25481,6 +25481,18 @@ static const struct net_device_ops rtl8168_netdev_ops = {
 };
 #endif

+static void pci_bus_nr_2_id(struct pci_dev *pdev, struct net_device *ndev )
+{
+
+       dev_info(&pdev->dev, "%s pdev->bus->number = 0x%x\n",
+                __func__, pdev->bus->number);
+
+       if(pdev->bus->number == 0x21)
+               strcpy(ndev->name, "eth1");
+       if(pdev->bus->number == 0x41)
+               strcpy(ndev->name, "eth2");
+       if(pdev->bus->number == 0x31)
+               strcpy(ndev->name, "eth3");
+}
+
 static int __devinit
 rtl8168_init_one(struct pci_dev *pdev,
                  const struct pci_device_id *ent)
@@ -25624,7 +25636,7 @@ rtl8168_init_one(struct pci_dev *pdev,
                 rtl8168_set_eeprom_sel_low(tp);

         rtl8168_get_mac_address(dev);
-
+        pci_bus_nr_2_id(pdev, dev); // The modification must be before register_netdev()
         tp->fw_name = rtl_chip_fw_infos[tp->mcfg].fw_name;

Similarly, NVMe storage can be modified in a similar way.
--- a/drivers/nvme/host/core.c
+++ b/drivers/nvme/host/core.c
@@ -5169,6 +5169,19 @@ static void nvme_free_ctrl(struct device *dev)
                nvme_put_subsystem(subsys);
 }

+static void pci_bus_nr_2_id(struct pci_dev *pdev, struct nvme_ctrl *ctrl)
+{
+       dev_info(&pdev->dev, "%s pdev->bus->number = 0x%x\n",
+                __func__, pdev->bus->number);
+
+       if(pdev->bus->number == 0x21)
+               ctrl->instance = 1; //pcie2x1l0 -> nvme1
+       if(pdev->bus->number == 0x41)
+               ctrl->instance = 2; //pcie2x1l2 -> nvme2
+       if(pdev->bus->number == 0x31)
+               ctrl->instance = 3; //pcie2x1l1 -> nvme3
+}
+
 /*
  * Initialize a NVMe controller structures.  This needs to be called during
  * earliest initialization so that we have the initialized structured around
@@ -5178,6 +5191,7 @@ int nvme_init_ctrl(struct nvme_ctrl *ctrl, struct device *dev,
                const struct nvme_ctrl_ops *ops, unsigned long quirks)
 {
        int ret;
+       struct pci_dev *pdev = container_of(dev, struct pci_dev, dev);

        ctrl->state = NVME_CTRL_NEW;
        clear_bit(NVME_CTRL_FAILFAST_EXPIRED, &ctrl->flags);
@@ -5214,6 +5228,8 @@ int nvme_init_ctrl(struct nvme_ctrl *ctrl, struct device *dev,
                goto out;
        ctrl->instance = ret;

+       pci_bus_nr_2_id(pdev, ctrl);
        device_initialize(&ctrl->ctrl_device);
        ctrl->device = &ctrl->ctrl_device;
        ctrl->device->devt = MKDEV(MAJOR(nvme_ctrl_base_chr_devt),
```

<!-- en PDF p.63 -->

### 12.19 Как войти в режим теста PCIe?

<!-- en PDF p.63 -->

Стандартный тестовый комплект: см. rockchip,compliance-mode в конфигурациях DTS контроллера. Глазковая диаграмма TX периферии: подключить измеритель непосредственно к TX. Обычно результат нельзя напрямую сравнивать со стандартным тестовым комплектом, только между устройствами одной модели. Метрики задаются стандартом PCIe. Специальной настройки ПО не нужно: после успешного перечисления тестировать полосу, например fio для NVMe. PCIe 3.0 использует специальный PHY; параметры ПО уже подобраны и не поддерживают регулировку.

<!-- en PDF p.64 -->

Большинство параметров TX/RX Gen3 получены при настройке PHY и не регулируются. Gen1/2 обычно используют combophy с уже подобранными параметрами, их изменение также обычно не допускается. При плохом сигнале проверить метод измерения и соответствие PCB спецификациям RK EVB. При подтверждённом существенном дефекте оптимизировать аппаратную разводку PCB.

<!-- en PDF p.64 -->

### 12.20 Как сохранить PCIe работающим во втором сне?

<!-- en PDF p.64 -->

Стандартный сон/пробуждение: PME_Turn_Off переводит оба конца в L2; затем отключаются опорный такт и питание EP, обе стороны входят в D3 cold; Trust Firmware отключает шину и PLL. После пробуждения устройство заново сканируется. Wi-Fi и другие устройства для пробуждения хоста сохраняют питание во втором standby; их питание управляется функциональным драйвером, а не vpcie3v3-supply PCIe. Если нельзя останавливать также такт/линию:

<!-- en PDF p.64 -->

1. Закомментировать обработчики сна/пробуждения PCIe-драйвера.

<!-- en PDF p.64 -->

```text
--- a/drivers/pci/controller/dwc/pcie-dw-rockchip.c
+++ b/drivers/pci/controller/dwc/pcie-dw-rockchip.c
@@ -1902,6 +1902,8 @@ static int __maybe_unused rockchip_dw_pcie_suspend(struct device *dev)
        struct dw_pcie *pci = rk_pcie->pci;
        u32 status;

+       return 0;
+
        /*
         * This is as per PCI Express Base r5.0 r1.0 May 22-2019,
         * 5.2 Link State Power Management (Page #440).
@@ -1997,6 +1999,8 @@ static int __maybe_unused rockchip_dw_pcie_resume(struct device *dev)
        struct dw_pcie *pci = rk_pcie->pci;
        int ret;

+       return 0;
```

<!-- en PDF p.64 -->

2. Оставить PCIe PD и питание шины постоянно включёнными.

<!-- en PDF p.64 -->

```text
# 1. Query the power-domains node referenced by the PCIe controller node in the dtsi
pcie0: pcie@2a200000 {
    ...
    power-domains = <&power RK3576_PD_PHP>;
    ...
};

# 2. Configure this power-domain node to always be on, and modify the power control in the sleep state
--- a/arch/arm64/boot/dts/rockchip/rk3576.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3576.dtsi
@@ -1717,11 +1717,8 @@
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "disabled";

    rockchip,sleep-debug-en = <0>;
    rockchip,sleep-mode-config = <
            (0
-           | RKPM_SLP_ARMOFF_LOGOFF
-           | RKPM_SLP_PMU_PMUALIVE_32K
-           | RKPM_SLP_PMU_DIS_OSC
+           | RKPM_SLP_ARMOFF_DDRPD
            | RKPM_SLP_PMIC_LP
-           | RKPM_SLP_32K_EXT
            )
    >;

@@ -2325,7 +2325,7 @@
power-domain@RK3576_PD_PHP {
    reg = <RK3576_PD_PHP>;
    #address-cells = <1>;
    #size-cells = <0>;
    pm_qos = <&qos_mmu0>,
             <&qos_mmu1>;
-
+   rockchip,always-on;
    power-domain@RK3576_PD_SUBPHP {
        reg = <RK3576_PD_SUBPHP>;
    };
```

<!-- en PDF p.65 -->

3. Получить у технической команды обновлённую bl31, сохраняющую шину и PLL, затем пересобрать U-Boot.

<!-- en PDF p.66 -->

## 13. Поиск неисправностей

<!-- en PDF p.66 -->

### 13.1 Сбой загрузки драйвера

<!-- en PDF p.66 -->

```text
[    0.417008] rk-pcie 3c0000000.pcie: Linked as a consumer to regulator.14
[    0.417477] rk-pcie 3c0800000.pcie: Linked as a consumer to regulator.14
[    0.417648] rk-pcie 3c0800000.pcie: phy init failed
```

<!-- en PDF p.66 -->

Причина: соответствующий PHY контроллера неверно включён в DTS.

<!-- en PDF p.66 -->

```text
[    0.195567] rochchip_p3phy_init: lock failed 0x6890000, check input refclk and power supply
[    0.195585] phy phy-fe8c0000.phy.8: phy init failed --> -110
[    0.195599] rk-pcie 3c0800000.pcie: fail to init phy, err -110
[    0.195611] rk-pcie 3c0800000.pcie: phy init failed
```

<!-- en PDF p.66 -->

Причина: неправильное питание или входной такт PCIe 3.0 PHY препятствует его работе.

<!-- en PDF p.66 -->

### 13.2 Сбой обучения линии

<!-- en PDF p.66 -->

```text
PCIe Link Fail logs are repeatedly showing "PCIe Linking..." and the LTSSM state machine may differ

rk-pcie 3c0000000.pcie: PCIe Linking... LTSSM is 0x0
rk-pcie 3c0000000.pcie: PCIe Linking... LTSSM is 0x0
rk-pcie 3c0000000.pcie: PCIe Linking... LTSSM is 0x0

Alternatively, there may be a "PCIe Link up" printout, but the LTSSM state machine's bit16 and bit17 are not equal to 0x3, and the values from bit0 to bit8 are not greater than 0x11
[    3.108325] rk-pcie fe150000.pcie: Looking up vpcie3v3-supply from device tree
[    3.126926] rk-pcie fe150000.pcie: missing legacy IRQ resource
[    3.126940] rk-pcie fe150000.pcie: IRQ msi not found
[    3.126944] rk-pcie fe150000.pcie: use outband MSI support
[    3.126947] rk-pcie fe150000.pcie: Missing *config* reg space
[    3.126954] rk-pcie fe150000.pcie: host bridge /pcie@fe150000 ranges:
[    3.126965] rk-pcie fe150000.pcie:      err 0x00f0000000..0x00f00fffff -> 0x00f0000000
[    3.126972] rk-pcie fe150000.pcie:       IO 0x00f0100000..0x00f01fffff -> 0x00f0100000
[    3.126979] rk-pcie fe150000.pcie:      MEM 0x00f0200000..0x00f0ffffff -> 0x00f0200000
[    3.126984] rk-pcie fe150000.pcie:      MEM 0x0900000000..0x090fffffff -> 0x0900000000
[    3.127007] rk-pcie fe150000.pcie: Missing *config* reg space
[    3.127028] rk-pcie fe150000.pcie: invalid resource
[    3.387304] rk-pcie fe150000.pcie: PCIe Link up, LTSSM is 0x0

If the link is truly successful, logs similar to the following should be visible, with "PCIe Link up" printout and LTSSM state machine's bit16 and bit17 equal to 0x3, and values from bit0 to bit8 greater than or equal to 0x11
[    2.410536] rk-pcie 3c0000000.pcie: PCIe Link up, LTSSM is 0x130011
```

<!-- en PDF p.67 -->

Причины: неуспешное обучение, неработающая периферия или нарушение сигнала. Проверить низкоскоростные IO: PERSTN соответствует reset-gpios и должен переключаться; CLKREQN по умолчанию не используется и обычно низкий; WAKEN не используется и обычно высокий. Затем проверить 3V3, достаточную мощность, шум питания; некоторым устройствам нужно 12V. Проверить временные характеристики сброса и питания по спецификации устройства. Если не помогает, исследовать целостность сигнала: предоставить аппаратным инженерам производителя PCB и глазковые диаграммы; предпочтителен лабораторный отчёт TX compliance. Включить RK_PCIE_DBG в pcie-dw-rockchip.c и собрать журнал. При нескольких контроллерах сначала отключить неиспользуемые и исправные, чтобы облегчить анализ. Журнал содержит, например, rk-pcie 3c0000000.pcie: fifo_status = 0x144001. Последние две цифры fifo_status обозначают LTSSM линии PCIe и помогают локализовать сбой; состояния приведены в приложении.

<!-- en PDF p.67 -->

### 13.3 Системный сбой инициализации PCIe3.0

<!-- en PDF p.67 -->

```text
[   21.523506] rcu: INFO: rcu_preempt detected stalls on CPUs/tasks:
[   21.523557] rcu:     1-...0: (0 ticks this GP) idle=652/1/0x4000000000000000 softirq=30/30 fqs=2097
[   21.523579] rcu:     3-...0: (5 ticks this GP) idle=4fa/1/0x4000000000000000 softirq=35/36 fqs=2097
[   21.523590] rcu:     (detected by 2, t=6302 jiffies, g=-1151, q=98)
[   21.523610] Task dump for CPU 1:
[   21.523622] rk-pcie         R  running task        0    55      2 0x0000002a
[   21.523640] Call trace:
[   21.523666]  __switch_to+0xe0/0x128
[   21.523682]  0x43752cfcfe820900
[   21.523694] Task dump for CPU 3:
[   21.523704] kworker/u8:0    R  running task        0     7      2 0x0000002a
[   21.523737] Workqueue: events_unbound enable_ptr_key_workfn
[   21.523751] Call trace:
[   21.523767]  __switch_to+0xe0/0x128
[   21.523786]  event_xdp_redirect+0x8/0x90
[   21.523816] rcu: INFO: rcu_sched detected stalls on CPUs/tasks:
[   21.523840] rcu:     1-...0: (50 ticks this GP) idle=652/1/0x4000000000000000 softirq=7/30 fqs=2099
[   21.523859] rcu:     3-...0: (55 ticks this GP) idle=4fa/1/0x4000000000000000 softirq=5/36 fqs=2099
[   21.523870] rcu:     (detected by 2, t=6302 jiffies, g=-1183, q=1)
[   21.523887] Task dump for CPU 1:
[   21.523898] rk-pcie         R  running task        0    55      2 0x0000002a
[   21.523915] Call trace:
[   21.523931]  __switch_to+0xe0/0x128
[   21.523944]  0x43752cfcfe820900
[   21.523955] Task dump for CPU 3:
[   21.523965] kworker/u8:0    R  running task        0     7      2 0x0000002a
[   21.523990] Workqueue: events_unbound enable_ptr_key_workfn
[   21.524004] Call trace:
```

<!-- en PDF p.68 -->

Зависание возле этого сообщения указывает на неисправность PCIe3.0 PHY. Последовательно проверить внешний такт: отсутствие либо неправильная амплитуда мешают захвату PHY; напряжения PCIE30_AVDD_0V9 и PCIE30_AVDD_1V8; настройки низкоскоростных PCIe IO в DTS платы — временно удалить и повторить тест, сверившись с разделом IO. У RK3588 pcie30phy второй порт должен питаться даже при использовании только первого.

<!-- en PDF p.68 -->

### 13.4 Системный сбой инициализации PCIe2.0

<!-- en PDF p.68 -->

```text
[   21.523870] rcu:     (detected by 2, t=6302 jiffies, g=-1183, q=1)
[   21.523887] Task dump for CPU 1:
[   21.523898] rk-pcie         R  running task        0    55      2 0x0000002a
[   21.523915] Call trace:
[   21.523931]  __switch_to+0xe0/0x128
[   21.523944]  0x43752cfcfe820900
[   21.523955] Task dump for CPU 3:
[   21.523965] kworker/u8:0    R  running task        0     7      2 0x0000002a
[   21.523990] Workqueue: events_unbound enable_ptr_key_workfn
[   21.524004] Call trace:
```

<!-- en PDF p.68 -->

Зависание возле сообщения указывает на PCIe2.0 PHY. Для combphy2_psq RK3568 проверить PCIE30_AVDD_0V9 и PCIE30_AVDD_1V8; удалить для теста настройки низкоскоростных PCIe IO из DTS платы и свериться с разделом IO. В phy-rockchip-naneng-combphy.c добавить в конец rockchip_combphy_init следующий код проверки внутренних настроек:

<!-- en PDF p.69 -->

```text
val = readl(priv->mmio + (0x27 << 2));
dev_err(priv->dev, "TXPLL_LOCK is 0x%x PWON_PLL is 0x%x\n",
val & BIT(0), val & BIT(1));
val = readl(priv->mmio + (0x28 << 2));
dev_err(priv->dev, "PWON_IREF is 0x%x\n", val & BIT(7));
```

<!-- en PDF p.69 -->

Сначала TXPLL_LOCK должен быть 1, иначе PHY не захвачен. Затем PWON_IREF должен быть 1, иначе такт PHY нарушен. Попробовать 25M, затем 100M через assigned-clock-rates combphy2_psq в rk3568.dtsi. Если не помогает, вывести внутренний такт PHY на refclk для измерения: добавить обход в конец rockchip_combphy_pcie_init, выбирая код по чипу:

<!-- en PDF p.69 -->

```text
/* For RK356X, RK3588 */
u32 val;
val = readl(priv->mmio + (0xd << 2));
val |= BIT(5);
writel(val,priv->mmio + (0xd << 2));

/* For RK3528 */
u32 val;
val = readl(priv->mmio + 0x108);
val |= BIT(29);
writel(val, priv->mmio + 0x108);
```

<!-- en PDF p.69 -->

После этого последовательно задать 24M, 25M, 100M и измерить осциллографом refclk: частоту, амплитуду, джиттер. PCIe2.0 разделяет PHY с SATA/USB; ошибочное одновременное включение вызывает похожие сообщения при загрузке и пробуждении:

<!-- en PDF p.69 -->

```text
naneng-combphy 2b060000.phy: phy type select 2 overwriting type 4
rk-pcie 2a210000.pcie: PHY is reused by other controller, check the dts
```

<!-- en PDF p.69 -->

### 13.5 Ошибки выделения Memory BAR

<!-- en PDF p.69 -->

Ошибки выделения ресурсов периферии делятся на три типа. Первый: превышение адресного лимита платформы; размеры см. в вопросе о BAR-пространстве. Ключевой текст no space for: устройство шины 21 запрашивает 3GB 64-битного пространства и превышает лимит. Коммерческое устройство в таком виде RK не поддержит; для собственного устройства уточнить у поставщика возможность изменения кодировки размера BAR.

<!-- en PDF p.70 -->

```text
3.286864] pci 0002:20:00.0: bridge configuration invalid ([bus 01-ff]), reconfiguring
3.286886] scanning [bus 00-00] behind bridge, pass 1
3.288165] pci 0002:21 :00.0: supports D1 D2
3.288170] pci 0002:21 :00.0: PME# supported from DO D1 D3hot
3.298238] pci bus 0002:21: busn res: [bus 21-2f] end is updated to 21
3.298441] pci 0002:21:00.0: BAR 1: no space for [mem size 0xe0000000 ]
3.298456] pci 0002:21:00.0: BAR 1: failed to assign [mem size 0xe0000000 ]
3.298473] pci 0002:21:00.0: BAR 2: assigned [mem 0x380900000- 0x38090ffff pref ]
3.298488] pci 0002:21:00.0: PCI bridge to [bus 21]
```

<!-- en PDF p.70 -->

Второй: недопустимый Class, ключ class 0x000000; lspci показывает все BAR неназначенными. Правильно исправить Class у поставщика модуля. Если невозможно или временно, применить показанный quirk, подставив реальные VID/PID и правильный Class типа устройства. Классы описаны в вопросе о соответствии контроллеров и устройств.

<!-- en PDF p.70 -->

```text
[    2.335899] pci 0000:02:04.0: [13fe:1730] type 00 class 0x000000
[    2.335986] pci 0000:02:04.0: reg 0x10: [io  0x0000-0x00ff]
[    2.336023] pci 0000:02:04.0: reg 0x14: [mem 0x00000000-0x0000007f]
[    2.336058] pci 0000:02:04.0: reg 0x18: [mem 0x00000000-0x000000ff]
[    2.342340] pci_bus 0000:02: busn_res: [bus 02-ff] end is updated to 02
[    2.342444] pci 0000:00:00.0: BAR 8: assigned [mem 0xf4200000-0xf42fffff]
[    2.342484] pci 0000:00:00.0: BAR 6: assigned [mem 0xf4300000-0xf430ffff pref]
[    2.342496] pci 0000:00:00.0: BAR 7: assigned [io  0x1000-0x1fff]
[    2.342510] pci 0000:01:00.0: BAR 8: assigned [mem 0xf4200000-0xf42fffff]
[    2.342519] pci 0000:01:00.0: BAR 7: assigned [io  0x1000-0x1fff]
[    2.342529] pci 0000:01:00.0: PCI bridge to [bus 02]
[    2.342546] pci 0000:01:00.0:   bridge window [io  0x1000-0x1fff]
[    2.342572] pci 0000:01:00.0:   bridge window [mem 0xf4200000-0xf42fffff]
[    2.342616] pci 0000:00:00.0: PCI bridge to [bus 01-ff]
[    2.342631] pci 0000:00:00.0:   bridge window [io  0x1000-0x1fff]
[    2.342645] pci 0000:00:00.0:   bridge window [mem 0xf4200000-0xf42fffff]
[    2.344896] pcieport 0000:00:00.0: Signaling PME with IRQ 87

lspci -vvv:

0000: 02:04.0 Non-VGA unclassified device: Advantech Co. Ltd Device 1730
Subsystem: Advantech Co. Ltd Device 1730
Flags: medium devsel, IRQ 255
I/O ports at[<unassigned> _disabled] [size=256]
Memory at <unassigned> (32-bit, non-prefetchabie) [disabled] [size=128]
Memory at <unassigned> (32-bit, non-prefetchable) [disabled] [size=256]
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@@ -207,6 +207,13 @@ static void quirk_mmio_always_on(struct pci_dev *dev)
 DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_ANY_ID, PCI_ANY_ID,
                                PCI_CLASS_BRIDGE_HOST, 8, quirk_mmio_always_on);

+static void quirk_class_id_fixup(struct pci_dev *dev)
+{
+       dev->class = 0x123456; /* Fixup your own class id ! */
+}
+
+DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_VENDOR_ID_FOO, PCI_DEVICE_ID_BAR, 8, quirk_class_id_fixup); /* Please Add Correct Vendor ID and Device ID ! */
```

<!-- en PDF p.71 -->

Ошибки проверки BAR периферии: ключевые слова assigned [mem и error updating; lspci показывает BAR неназначенными. Записанный адрес не проходит обратное чтение из-за аномального состояния периферии. Возможны ошибки энергосбережения, поддержка RC только Gen1 или другие неисправности модуля.

<!-- en PDF p.71 -->

```text
[    2.460092] pci 0002:21:00.0: calc_l1ss_pwron: Invalid T_PwrOn scale: 3
[    2.472049] pci_bus 0002:21: busn_res: [bus 21-2f] end is updated to 21
[    2.472089] pci 0002:20:00.0: BAR 8: assigned [mem 0xf2200000-0xf23fffff]
[    2.472105] pci 0002:20:00.0: BAR 6: assigned [mem 0xf2400000-0xf240ffff pref]
[    2.472124] pci 0002:21:00.0: BAR 0: assigned [mem 0xf2200000-0xf23fffff 64bit]
[    2.472139] pci 0002:21:00.0: BAR 0: error updating (0xf2200004 != 0xffffffff)
[    2.472153] pci 0002:21:00.0: BAR 0: error updating (high 0x000000 != 0xffffffff)
```

<!-- en PDF p.71 -->

Сначала измерить питание модуля, #PERST и опорный такт 100M относительно требований руководства. Например, постоянное питание QCNFA765 нарушает последовательность и вызывает эту проблему. Если аппаратная схема и временные характеристики соответствуют, последовательно попробовать патчи ниже. Если не помогло, привлечь поставщика для анализа модуля.

<!-- en PDF p.71 -->

1. Отключить ASPM модуля, подставив реальные PID/VID.

<!-- en PDF p.71 -->

```text
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@ -2356,6 +2356,7 @ static void quirk_disable_aspm_l0s_l1(struct pci_dev *dev) * disable both L0s and L1 for now to be safe.
*/
DECLARE_PCI_FIXUP_FINAL(PCI_VENDOR_ID_ASMEDIA, 0x1080, quirk_disable_aspm_l0s_l1);
+DECLARE_PCI_FIXUP_FINAL(PID, VID, quirk_disable_aspm_l0s_l1);  /* Please Add Correct Vendor ID and Device ID to disable L0s and L1 ASPM */
```

<!-- en PDF p.71 -->

2. Ограничить соответствующий контроллер Gen1 через max-link-speed в dtsi:

<!-- en PDF p.72 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
@@ -4552,7 +4552,7 @@
        num-ib-windows = <8>;
        num-ob-windows = <8>;
        num-viewport = <4>;
-       max-link-speed = <2>;
+       max-link-speed = <1>;
        msi-map = <0x4000 &its0 0x4000 0x1000>;
                num-lanes = <1>;
                phys = <&combphy0_ps PHY_TYPE_PCIE>;
```

<!-- en PDF p.72 -->

3. Увеличить время стабилизации питания и сброса #PERST:

<!-- en PDF p.72 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
@@ -159,7 +159,7 @@
                regulator-max-microvolt = <3300000>;
                enable-active-high;
                gpios = <&gpio3 RK_PC3 GPIO_ACTIVE_HIGH>;
-               startup-delay-us = <5000>;
+               startup-delay-us = <500000>;
                vin-supply = <&vcc12v_dcin>;
        }; /* vcc3v3_pcie30 */

@@ -551,6 +551,7 @@
 &pcie3x4 {
        reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_HIGH>;
        vpcie3v3-supply = <&vcc3v3_pcie30>;
+       rockchip,perst-inactive-ms = <1000>;
        status = "okay";
 };
```

<!-- en PDF p.72 -->

4. Известны проблемы некоторых Qualcomm Wi-Fi, включая AR9xxx/QCA9xxx. Для модулей не Qualcomm этот патч не нужен.

<!-- en PDF p.72 -->

```text
--- a/drivers/pci/pcie/aspm.c
+++ b/drivers/pci/pcie/aspm.c
@@ -192,12 +192,56 @@ static void pcie_clkpm_cap_init(struct pcie_link_state *link, int blacklist)
    link->clkpm_disable = blacklist ? 1 : 0;
 }

+static int pcie_downgrade_link_to_gen1(struct pci_dev *parent)
+{
+   u16 reg16;
+   u32 reg32;
+   int ret;
+
+   /* Check if link is capable of higher speed than 2.5 GT/s */
+   pcie_capability_read_dword(parent, PCI_EXP_LNKCAP, &reg32);
+   if ((reg32 & PCI_EXP_LNKCAP_SLS) <= PCI_EXP_LNKCAP_SLS_2_5GB)
+       return 0;
+
+   /* Check if link speed can be downgraded to 2.5 GT/s */
+   pcie_capability_read_dword(parent, PCI_EXP_LNKCAP2, &reg32);
+   if (!(reg32 & PCI_EXP_LNKCAP2_SLS_2_5GB)) {
+       pci_err(parent, "ASPM: Bridge does not support changing Link Speed to 2.5 GT/s\n");
+       return -EOPNOTSUPP;
+   }
+
+   /* Force link speed to 2.5 GT/s */
+   ret = pcie_capability_clear_and_set_word(parent, PCI_EXP_LNKCTL2,
+                        PCI_EXP_LNKCTL2_TLS,
+                        PCI_EXP_LNKCTL2_TLS_2_5GT);
+   if (!ret) {
+       /* Verify that new value was really set */
+       pcie_capability_read_word(parent, PCI_EXP_LNKCTL2, &reg16);
+       if ((reg16 & PCI_EXP_LNKCTL2_TLS) != PCI_EXP_LNKCTL2_TLS_2_5GT)
+           ret = -EINVAL;
+   }
+
+   if (ret) {
+       pci_err(parent, "ASPM: Changing Target Link Speed to 2.5 GT/s failed: %d\n", ret);
+       return ret;
+   }
+
+   pci_info(parent, "ASPM: Target Link Speed changed to 2.5 GT/s due to quirk\n");
+   return 0;
+}
+
 static bool pcie_retrain_link(struct pcie_link_state *link)
 {
    struct pci_dev *parent = link->pdev;
    unsigned long end_jiffies;
    u16 reg16;

+   if ((link->downstream->dev_flags & PCI_DEV_FLAGS_NO_RETRAIN_LINK_WHEN_NOT_GEN1) &&
+       pcie_downgrade_link_to_gen1(parent)) {
+       pci_err(parent, "ASPM: Retrain Link at higher speed is disallowed by quirk\n");
+       return false;
+   }
+
    pcie_capability_read_word(parent, PCI_EXP_LNKCTL, &reg16);
    reg16 |= PCI_EXP_LNKCTL_RL;
    pcie_capability_write_word(parent, PCI_EXP_LNKCTL, reg16);
diff --git a/drivers/pci/quirks.c b/drivers/pci/quirks.c
index 653660e3ba9e..4999ad9d08b8 100644
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@@ -3553,23 +3553,46 @@ static void mellanox_check_broken_intx_masking(struct pci_dev *pdev)
 DECLARE_PCI_FIXUP_FINAL(PCI_VENDOR_ID_MELLANOX, PCI_ANY_ID,
            mellanox_check_broken_intx_masking);

-static void quirk_no_bus_reset(struct pci_dev *dev)
+static void quirk_no_bus_reset_and_no_retrain_link(struct pci_dev *dev)
 {
-   dev->dev_flags |= PCI_DEV_FLAGS_NO_BUS_RESET;
+   dev->dev_flags |= PCI_DEV_FLAGS_NO_BUS_RESET |
+             PCI_DEV_FLAGS_NO_RETRAIN_LINK_WHEN_NOT_GEN1;
 }

 /*
- * Some Atheros AR9xxx and QCA988x chips do not behave after a bus reset.
+ * Atheros AR9xxx and QCA9xxx chips do not behave after a bus reset and also
+ * after retrain link when PCIe bridge is not in GEN1 mode at 2.5 GT/s speed.
  * The device will throw a Link Down error on AER-capable systems and
  * regardless of AER, config space of the device is never accessible again
  * and typically causes the system to hang or reset when access is attempted.
+ * Or if config space is accessible again then it contains only dummy values
+ * like fixed PCI device ID 0xABCD or values not initialized at all.
+ * Retrain link can be called only when using GEN1 PCIe bridge or when
+ * PCIe bridge has forced link speed to 2.5 GT/s via PCI_EXP_LNKCTL2 register.
+ * To reset these cards it is required to do PCIe Warm Reset via PERST# pin.
  * https://lore.kernel.org/r/20140923210318.498dacbd@dualc.maya.org/
+ * https://lore.kernel.org/r/87h7l8axqp.fsf@toke.dk/
+ * https://www.mail-archive.com/ath9k-devel@lists.ath9k.org/msg07529.html
  */
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0030, quirk_no_bus_reset);
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0032, quirk_no_bus_reset);
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x003c, quirk_no_bus_reset);
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0033, quirk_no_bus_reset);
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0034, quirk_no_bus_reset);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x002e,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0030,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0032,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0033,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0034,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x003c,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0042,
+            quirk_no_bus_reset_and_no_retrain_link);
+
+static void quirk_no_bus_reset(struct pci_dev *dev)
+{
+   dev->dev_flags |= PCI_DEV_FLAGS_NO_BUS_RESET;
+}

 /*
  * Root port on some Cavium CN8xxx chips do not successfully complete a bus
diff --git a/include/linux/pci.h b/include/linux/pci.h
index 86c799c97b77..fdbf7254e4ab 100644
--- a/include/linux/pci.h
+++ b/include/linux/pci.h
@@ -227,6 +227,8 @@ enum pci_dev_flags {
    PCI_DEV_FLAGS_NO_FLR_RESET = (__force pci_dev_flags_t) (1 << 10),
    /* Don't use Relaxed Ordering for TLPs directed at this device */
    PCI_DEV_FLAGS_NO_RELAXED_ORDERING = (__force pci_dev_flags_t) (1 << 11),
    /* Device does honor MSI masking despite saying otherwise */
    PCI_DEV_FLAGS_HAS_MSI_MASKING = (__force pci_dev_flags_t) (1 << 12),
+   /* Don't Retrain Link for device when bridge is not in GEN1 mode */
+   PCI_DEV_FLAGS_NO_RETRAIN_LINK_WHEN_NOT_GEN1 = (__force pci_dev_flags_t) (1 << 13),
 };
```

<!-- en PDF p.75 -->

Неиспользуемые порты switch занимают ресурсы. У RK3588 каждый root port может выделить 16MB 32-битного BAR. Например, ASM2812 запрашивает 2MB на порт независимо от наличия периферии. По lspci под портами 2/3/a/b switch шины 12 нет устройств, но они занимают 8MB, из-за чего исправной периферии не хватает ресурсов.

<!-- en PDF p.75 -->

```text
[   22.005666] pci 0001:12:00.0: BAR 8: no space for [mem size 0x00600000]
[   22.040400] pci 0001:12:00.0: BAR 8: failed to assign [mem size 0x00600000]
[   22.040402] pci 0001:12:08.0: BAR 8: no space for [mem size 0x00600000]
[   22.040406] pci 0001:12:08.0: BAR 8: failed to assign [mem size 0x00600000]
[   22.067370] pci 0001:12:00.0: BAR 9: assigned [mem 0x940000000-0x9401fffff 64bit pref]
[   22.067373] pci 0001:12:02.0: BAR 8: no space for [mem size 0x00200000]
[   22.080018] pci 0001:12:02.0: BAR 8: failed to assign [mem size 0x00200000]
[   22.080022] pci 0001:12:02.0: BAR 9: assigned [mem 0x940200000-0x9403fffff 64bit pref]
[   22.093658] pci 0001:12:03.0: BAR 8: no space for [mem size 0x00200000]
[   22.093661] pci 0001:12:03.0: BAR 8: failed to assign [mem size 0x00200000]
[   22.093663] pci 0001:12:03.0: BAR 9: assigned [mem 0x940400000-0x9405fffff 64bit pref]
[   22.106310] pci 0001:12:08.0: BAR 9: assigned [mem 0x940600000-0x9407fffff 64bit pref]
[   22.106313] pci 0001:12:0a.0: BAR 8: no space for [mem size 0x00200000]
[   22.120756] pci 0001:12:0a.0: BAR 8: failed to assign [mem size 0x00200000]
[   22.130702] pci 0001:12:0a.0: BAR 9: assigned [mem 0x940800000-0x9409fffff 64bit pref]
[   22.130705] pci 0001:12:0b.0: BAR 8: no space for [mem size 0x00200000]
[   22.144573] pci 0001:12:0b.0: BAR 8: failed to assign [mem size 0x00200000]

lspci -vvt
-+-[0003:30]---00.0-[31]----00.0  Realtek Semiconductor Co., Ltd. Device [10ec:8125]
 +-[0001:10]---00.0-[11-18]----00.0-[12-18]--+-00.0-[13]----00.0  Aquantia Corp. Device
 |                                           +-02.0-[14]--
 |                                           +-03.0-[15]--
 |                                           +-08.0-[16]----00.0  Aquantia Corp. Device
 |                                           +-0a.0-[17]--
 |                                           \-0b.0-[18]--
 \-[0000:00]---00.0-[01-ff]----00.0  ASMedia Technology Inc. Device [1b21:1164]

lspci -nn
0000:00:00.0 PCI bridge [0604]: Fuzhou Rockchip Electronics Co., Ltd Device [1d87:3588] (rev 01)
0000:01:00.0 SATA controller [0106]: ASMedia Technology Inc. Device [1b21:1164] (rev 02)
0001:10:00.0 PCI bridge [0604]: Fuzhou Rockchip Electronics Co., Ltd Device [1d87:3588] (rev 01)
0001:11:00.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:00.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:02.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:03.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:08.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:0a.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:0b.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:13:00.0 Ethernet controller [0200]: Aquantia Corp. Device [1d6a:14c0] (rev 03)
0001:16:00.0 Ethernet controller [0200]: Aquantia Corp. Device [1d6a:14c0] (rev 03)
0003:30:00.0 PCI bridge [0604]: Fuzhou Rockchip Electronics Co., Ltd Device [1d87:3588] (rev 01)
0003:31:00.0 Ethernet controller [0200]: Realtek Semiconductor Co., Ltd. Device [10ec:8125] (rev 05)
```

<!-- en PDF p.76 -->

Согласовать с изготовителем switch изменение прошивки для отключения BAR портов без устройств. Если это невозможно, а топология изделия фиксирована и случайное подключение к слотам исключено, попробовать фильтрующие патчи:

<!-- en PDF p.76 -->

```text
diff --git a/drivers/pci/probe.c b/drivers/pci/probe.c
index ece90a2..53bef6b 100644
--- a/drivers/pci/probe.c
+++ b/drivers/pci/probe.c
@@ -2794,6 +2794,37 @@ void __weak pcibios_fixup_bus(struct pci_bus *bus)
        /* nothing to do, expected to be removed in the future */
 }

+struct scan_blacklist_devfn {
+       u8 bus; /* bus number */
+       u8 dev; /* device number */
+       u8 func; /* function number */
+};
+
+#define ANY 0xff
+
+/* Please fill in the actual devices to be filtered in the sbl table, taking the above log as an example, filtering ports 2/3/a/b of bus12 */
+static struct scan_blacklist_devfn sbl[] = {
+       {12, 0x2, ANY},
+       {12, 0x3, ANY},
+       {12, 0xa, ANY},
+       {12, 0xb, ANY},
+};
+
+static bool pci_scan_check_blacklist(u8 bus, unsigned int devfn)
+{
+       int i;
+
+       for (i = 0; i < ARRAY_SIZE(sbl); i++) {
+               if (bus == sbl[i].bus && PCI_SLOT(devfn) == sbl[i].dev) {
+                       if (sbl[i].func == ANY)
+                               return true;
+                       else
+                               return sbl[i].func == PCI_FUNC(devfn);
+               }
+       }
+
+       return false;
+}
+
 /**
  * pci_scan_child_bus_extend() - Scan devices below a bus
  * @bus: Bus to scan for devices
@@ -2819,6 +2850,9 @@ static unsigned int pci_scan_child_bus_extend(struct pci_bus *bus,

        /* Go find them, Rover! */
        for (devfn = 0; devfn < 256; devfn += 8) {
+               if (pci_scan_check_blacklist(bus->number, devfn))
+                       continue;
+
                nr_devs = pci_scan_slot(bus, devfn);
```

<!-- en PDF p.77 -->

### 13.6 Ошибки выделения IO BAR

<!-- en PDF p.77 -->

При перечислении возможны ошибки записи IO BAR с assigned [io и error updating либо firmware Bug. Проверить ограничения IO BAR в руководстве устройства:

<!-- en PDF p.77 -->

```text
dmesg | grep "0002:22"
[    2.324600] pci_bus 0002:22: extended config space not accessible
[    2.324764] pci 0002:22:00.0: [13f6:0111] type 00 class 0x040100
[    2.324873] pci 0002:22:00.0: [Firmware Bug]: reg 0x10: invalid BAR (can't size)
[    2.325445] pci 0002:22:00.0: supports D1 D2
[    2.331041] pci_bus 0002:22: busn_res: [bus 22-2f] end is updated to 22
```

<!-- en PDF p.77 -->

Или:

<!-- en PDF p.77 -->

```text
console:/ $ dmesg | grep "0002:22"
[    2.434085] [  T117] pci_bus 0002:22: extended config space not accessible
[    2.434629] [  T117] pci 0002:22:00.0: [13f6:0111] type 00 class 0x040100
[    2.434842] [  T117] pci 0002:22:00.0: reg 0x10: initial BAR value 0x0000d000 invalid
[    2.434869] [  T117] pci 0002:22:00.0: reg 0x10: [io  size 0x0100]
[    2.435536] [  T117] pci 0002:22:00.0: supports D1 D2
[    2.458229] [  T117] pci_bus 0002:22: busn_res: [bus 22-2f] end is updated to 22
[    2.458542] [  T117] pci 0002:22:00.0: BAR 0: assigned [io  0x1000-0x10ff]
[    2.458581] [  T117] pci 0002:22:00.0: BAR 0: error updating (0x80801001 != 0x001001)
[    2.463002] [  T117] snd_cmipci 0002:22:00.0: enabling device (0080 -> 0081)
```

<!-- en PDF p.78 -->

Журналы относятся к PCI-звуковой карте CMI8738. PCI изначально рассчитан на X86, поэтому IO BAR обычно мал. У CMI8738 IO BAR0 ограничен 0xFF00; пример патча:

<!-- en PDF p.78 -->

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3568.dtsi b/arch/arm64/boot/dts/rockchip/rk3568.dtsi
index 9dc057637177..a060dcbf7df5 100644
--- a/arch/arm64/boot/dts/rockchip/rk3568.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568.dtsi
@@ -2311,7 +2311,7 @@
                phy-names = "pcie-phy";
                power-domains = <&power RK3568_PD_PIPE>;
                ranges = <0x00000800 0x0 0x80000000 0x3 0x80000000 0x0 0x800000
-                         0x81000000 0x0 0x80800000 0x3 0x80800000 0x0 0x100000
+                         0x81000000 0x0 0x00000000 0x3 0x80800000 0x0 0x100000
                          0x83000000 0x0 0x80900000 0x3 0x80900000 0x0 0x3f700000>;
                reg = <0x3 0xc0800000 0x0 0x400000>,
                      <0x0 0xfe280000 0x0 0x10000>;
```

<!-- en PDF p.78 -->

### 13.7 MSI/MSI-X недоступны

<!-- en PDF p.78 -->

При переносе драйвера, особенно Wi-Fi, возможна невозможность использовать MSI/MSI-X. Проверить menuconfig, особенно MSI; проверить, не отключён ли its в rk3568.dtsi; выполнить lspci -vvv. В примере заявлены 32 MSI по 64 бита, используется одно, но Enable- означает выключение. Нормально Enable+ и адрес вида 0x00000000fd4400XX. Обычно драйвер не загрузился либо не запросил MSI/MSI-X. Использовать pci_alloc_irq_vectors по зрелым драйверам и Documentation/PCI/MSI-HOWTO.txt для реализации и отладки.

<!-- en PDF p.78 -->

```text
Capabilities: [58] MSI: Enable- Count=1/32 Maskable- 64bit+
                Address: 0000000000000000  Data: 0000
```

<!-- en PDF p.78 -->

При успешном запросе смотреть cat /proc/interrupts. Найти ITS-MSI по имени драйвера в последнем столбце, например xhci_hcd. Теоретически каждая передача увеличивает счётчик. Если связи нет или она нарушена, счётчик 0 либо не растёт после начала обмена.

<!-- en PDF p.79 -->

```text
229: 0 0 0 0 0 0 ITS-MSI 524288 Edge xhci_hcd
```

<!-- en PDF p.79 -->

При случайной потере MSI/MSI-X определить IRQ через cat /proc/interrupts и перенести на другой CPU: например IRQ229 на CPU2 командой echo 2 > /proc/irq/229/smp_affinity_list. Анализатором протокола проверить, отправляет ли периферия прерывания. Анализаторы обычно не работают с распаянными устройствами: получить у поставщика плату с контактным разъёмом и тестировать на EVB RK, поддерживающей стандартные платы. Для M.2 key A/B/M/B+M/E выбрать соответствующий переходник по разделу M.2 приложения.

<!-- en PDF p.79 -->

### 13.8 Ошибки при перечислении и обмене с периферией

<!-- en PDF p.79 -->

Пример — NVMe на RK3566-EVB2, ошибка обмена после нормального перечисления. Исправное включение видно по enabling device (0000 -> 0002), например nvme 0000:01:00.0. После него при сбое измерить осциллографом питание периферии (просадки), #PERST (непреднамеренный сброс), 0v9 и 1v8 PHY (аномалии питания). На EVB RK много мультиплексированных сигналов: перемычки делят #PERST с другими IO. Уточнить у аппаратных разработчиков; известны неверные перемычки некоторых RK3566-EVB2, требующие исправления.

<!-- en PDF p.79 -->

```text
[    2.426038] pci 0000:00:00.0:   bridge window [mem 0x300900000-0x3009fffff]
[    2.426183] pcieport 0000:00:00.0: of_irq_parse_pci: failed with rc=-22
[    2.427493] pcieport 0000:00:00.0: Signaling PME with IRQ 106
[    2.427712] pcieport 0000:00:00.0: AER enabled with IRQ 115
[    2.427899] pcieport 0000:00:00.0: of_irq_parse_pci: failed with rc=-22
[    2.428202] nvme nvme0: pci function 0000:01:00.0
[    2.428259] nvme 0000:01:00.0: enabling device (0000 -> 0002)
[    2.535404] nvme nvme0: missing or invalid SUBNQN field.
[    2.535522] nvme nvme0: Shutdown timeout set to 8 seconds
...
[   48.129408] print_req_error: I/O error, dev nvme0n1, sector 0
[   48.137197] nvme 0000:01:00.0: enabling device (0000 -> 0002)
[   48.137299] nvme nvme0: Removing after probe failure status: -19
[   48.147182] Buffer I/O error on dev nvme0n1, logical block 0, async page read
[   48.162900] nvme nvme0: failed to set APST feature (-19)
```

<!-- en PDF p.80 -->

### 13.9 Сбой прошивки при перечислении

<!-- en PDF p.80 -->

Два следующих типа ошибок при выделении BAR обычно означают несовместимость BAR с протоколом. Нужен quirk в drivers/pci/quirks.c; сведения уточнить у производителя. Для JMB585 известна рекомендация повторно читать BAR для устранения сбоя прошивки. echo 1 > /sys/bus/pci/rescan повторно сканирует шину и может исправить проблему.

<!-- en PDF p.80 -->

```text
Type 1:
[    2.379768] rk-pcie 3c0000000.pcie: PCIe Link up, LTSSM is 0x30011
[    2.380155] rk-pcie 3c0000000.pcie: PCI host bridge to bus 0000:00
[    2.380187] pci_bus 0000:00: root bus resource [bus 00-0f]
[    2.380204] pci_bus 0000:00: root bus resource [??? 0x300000000-0x3007fffff flags 0x0] (bus address [0x00000000-0x007fffff])
[    2.380217] pci_bus 0000:00: root bus resource [io  0x0000-0xfffff] (bus address
[0x800000-0x8fffff])
[    2.380230] pci_bus 0000:00: root bus resource [mem 0x300900000-0x33fffffff] (bus address
[0x00900000-0x3fffffff])
[    2.394983] pci 0000:01:00.0: [Firmware Bug] reg 0x10: invalid BAR (can't size)

Type 2:
[    2.548219] pci 0000:01:00.0: [10ec:b723] type 00 class 0x028000
[    2.548389] pci 0000:01:00.0: reg 0x10: initial BAR value 0x00000000 invalid
[    2.548426] pci 0000:01:00.0: reg 0x10: [io  size 0x0100]
[    2.548549] pci 0000:01:00.0: reg 0x18: [mem 0x00000000-0x00003fff 64bit]
[    2.549132] pci 0000:01:00.0: supports D1 D2
[    2.549138] pci 0000:01:00.0: PME# supported from D0 D1 D2 D3hot D3cold
```

<!-- en PDF p.80 -->

### 13.10 Исключения доступа к переотображённому BAR

<!-- en PDF p.80 -->

1. ioremap BAR в ядре с последующим memset/memcpy вызывает alignment fault. mmap BAR в userspace с memset/memcpy вызывает sigbug (написание источника). Причина — оптимизация выравнивания memcpy или использование memset инструкций DC ZVA на ARM64, не поддерживающих Device memory nGnRE.

<!-- en PDF p.81 -->

```text
[    69.195811] Unhandled fault: alignment fault (0x96000061) at 0xffffff8009800000
[    69.195829] Internal error: : 96000061 [#1] PREEMPT SMP
[    69.363352] Modules linked in:
[    69.363655] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 4.19.172 #691
[    69.364205] Hardware name: Rockchip rk3568 evb board (DT)
[    69.364688] task: ffffffc00a300000 task.stack: ffffffc00a2dc000
[    69.365227] PC is at __memset+0x16c/0x190
[    69.365593] LR is at snda_alloc_res+0xac/0xfc
[    69.366054] pc : [<ffffff800839a2ac>] lr : [<ffffff80085055b8>] pstate: 404000c5
[    69.366713] sp : ffffffc00a2df810
```

<!-- en PDF p.81 -->

Использовать memset_io либо memset_fromio/memset_toio — имена сохранены из источника. В userspace копировать/очищать циклом присваивания. Из-за требований выравнивания при таких исключениях настоятельно рекомендуется CONFIG_ROCKCHIP_ARM64_ALIGN_FAULT_FIX.

<!-- en PDF p.81 -->

2. На RK3588 исключение при присваивании BAR может означать, что компилятор объединил четыре последовательных адреса в неподдерживаемый 16-байтный доступ.

<!-- en PDF p.81 -->

```text
[14037.477507][    C3] SError Interrupt on CPU3, code 0xbe000011 -- SError
[14037.477512][    C3] CPU: 3 PID: 2037 Comm: memtest Not tainted 5.10.110 #1690
[14037.477514][    C3] Hardware name: Rockchip RK3588 EVB1 LP4 V10 Board (DT)
[14037.477516][    C3] pstate: 00001000 (nzcv daif -PAN -UAO -TCO BTYPE=--)
[14037.477518][    C3] pc : 0000000000405d58
[14037.477519][    C3] lr : 0000000000405fb4
[14037.477521][    C3] sp : 0000007fc48effd0
[14037.477522][    C3] x29: 0000007fc48effd0 x28: 0000000000000000
[14037.477529][    C3] x27: 0000000000452000 x26: 000000000048b000
[14037.477533][    C3] x25: 000000000048b000 x24: 0000000000000018
[14037.477537][    C3] x23: 0000000000489030 x22: 0000000000400280
[14037.477541][    C3] x21: 0000000000000000 x20: 0000000000400eb8
[14037.477545][    C3] x19: 0000000000400df0 x18: 0000000000000000
[14037.477549][    C3] x17: 0000000000417e00 x16: 0000000000489030
[14037.477554][    C3] x15: 000000000572c738 x14: 0000000000000000
[14037.477558][    C3] x13: 0000000000000150 x12: 000000000048b000
[14037.477562][    C3] x11: 0000000000000000 x10: 0000200000000000
[14037.477566][    C3] x9 : 00003fffffffffff x8 : 00000000000000de
[14037.477570][    C3] x7 : 0000000000000000 x6 : 000000000048af30
[14037.477574][    C3] x5 : 00000000f0000000 x4 : 0000000000000000
[14037.477578][    C3] x3 : 0000000000000001 x2 : 0000000000000001
[14037.477582][    C3] x1 : 0000000000489058 x0 : 0000000000000000
[14037.477587][    C3] Kernel panic - not syncing: Asynchronous SError Interrupt
[14037.477589][    C3] CPU: 3 PID: 2037 Comm: memtest Not tainted 5.10.110 #1690
[14037.477590][    C3] Hardware name: Rockchip RK3588 EVB1 LP4 V10 Board (DT)
[14037.477592][    C3] Call trace:
[14037.477593][    C3]  dump_backtrace+0x0/0x1a8
[14037.477594][    C3]  show_stack+0x18/0x28
[14037.477596][    C3]  dump_stack_lvl+0xcc/0xf4
[14037.477598][    C3]  dump_stack+0x18/0x58
[14037.477600][    C3]  panic+0x170/0x36c
[14037.477602][    C3]  nmi_panic+0x8c/0x90
[14037.477603][    C3]  arm64_serror_panic+0x78/0x84
[14037.477605][    C3]  arm64_is_fatal_ras_serror+0x34/0xc8
[14037.477607][    C3]  do_serror+0x6c/0x98
[14037.477608][    C3]  el0_error_naked+0x14/0x1c
[14037.477622][    C2] CPU2: stopping
[14037.477684][    C0] CPU0: stopping
[14037.477711][    C1] CPU1: stopping
[14037.477718][    C1] CPU: 1 PID: 0 Comm: swapper/1 Not tainted 5.10.110 #1690
[14037.477720][    C1] Hardware name: Rockchip RK3588 EVB1 LP4 V10 Board (DT)
[14037.477722][    C1] Call trace:
[14037.477729][    C1]  dump_backtrace+0x0/0x1a8
[14037.477734][    C1]  show_stack+0x18/0x28
[14037.477739][    C7] CPU7: stopping
[14037.477744][    C1]  dump_stack_lvl+0xcc/0xf4
[14037.477749][    C6] CPU6: stopping
[14037.477753][    C1]  dump_stack+0x18/0x58
[14037.477760][    C1]  local_cpu_stop+0x60/0x70
[14037.477764][    C1]  ipi_handler+0x1a4/0x310
[14037.477769][    C4] CPU4: stopping
[14037.477778][    C1]  handle_percpu_devid_fasteoi_ipi+0x7c/0x1c8
```

<!-- en PDF p.82 -->

Если addr — переотображённый BAR и выполняются четыре последовательных присваивания, добавить barrier() в любую из точек 1, 2 или 3.

<!-- en PDF p.82 -->

```text
/* If used in user space, the following implementation of barrier is required */
# define barrier() __asm__ __volatile__("": : :"memory")

*((u32 *)((void *)addr + 0x0)) = 0x11111111;
/* Code Point 1 */
*((u32 *)((void *)addr + 0x4)) = 0x44444444;
/* Code Point 2 */
*((u32 *)((void *)addr + 0x8)) = 0x88888888;
/* Code Point 3 */
*((u32 *)((void *)addr + 0xc)) = 0xcccccccc;
```

<!-- en PDF p.82 -->

3. Доступ к BAR требует чётного выравнивания и кратности адреса длине доступа: DWord нельзя адресовать с word-выравниванием, нужен DWord или QWord. Учитывать оптимизацию компилятора: userspace собирать с -O0, чтобы чтение/запись не оптимизировались. Для библиотеки также отключить LTO, обычно найдя -flto в Makefile.

<!-- en PDF p.83 -->

### 13.11 Сбой загрузки PCIe–USB xhci

<!-- en PDF p.83 -->

Некоторые PCIe–USB чипы, например VL805, после установления линии не загружают драйвер из-за тайм-аута сброса xHCI. Вероятно, требуется обновление прошивки моста. Проверить на ПК; если обновление необходимо, обратиться к поставщику.

<!-- en PDF p.83 -->

```text
[ 6.289987] pci 0000:01:00.0: xHCI HW not ready after 5 sec (HC bug?) status = 0x811
[ 6.531098] xhci_hcd 0000:01:00.0: xHCI Host Controller
[ 6.531803] xhci_hcd 0000:01:00.0: new USB bus registered, assigned bus number 3
[ 16.532539] xhci_hcd 0000:01:00.0: can't setup: -110
[ 16.533033] xhci_hcd 0000:01:00.0: USB bus 3 deregistered
[ 16.533712] xhci_hcd 0000:01:00.0: init 0000:01:00.0 fail, -110
[ 16.534281] xhci_hcd: probe of 0000:01:00.0 failed with error -110
```

<!-- en PDF p.83 -->

Если проблема остаётся, попробовать следующий патч drivers/usb/host/pci-quirks.c:

<!-- en PDF p.83 -->

```text
diff --git a/drivers/usb/host/pci-quirks.c b/drivers/usb/host/pci-quirks.c
index 3ea435c..cca536d 100644
--- a/drivers/usb/host/pci-quirks.c
+++ b/drivers/usb/host/pci-quirks.c
@@ -1085,8 +1085,11 @@ static void quirk_usb_early_handoff(struct pci_dev *pdev)
    /* Skip Netlogic mips SoC's internal PCI USB controller.
     * This device does not need/support EHCI/OHCI handoff
     */
-   if (pdev->vendor == 0x184e) /* vendor Netlogic */
+   if ((pdev->vendor == 0x184e) ||
+       (pdev->vendor == PCI_VENDOR_ID_VIA && pdev->device == 0x3483)) {
+       /* Taking VL805 as an example, other chips should fill in the correct vendor ID and device ID */
+       dev_warn(&pdev->dev, "bypass xhci quirk for VL805\n");
        return;
+   }
    if (pdev->class != PCI_CLASS_SERIAL_USB_UHCI &&
            pdev->class != PCI_CLASS_SERIAL_USB_OHCI &&
            pdev->class != PCI_CLASS_SERIAL_USB_EHCI &&
```

<!-- en PDF p.83 -->

### 13.12 Системный сбой PCIe3.0 при сне/пробуждении

<!-- en PDF p.83 -->

Ошибка сна/пробуждения вызвана влиянием отключения 3.3v на питание генератора такта. Проверить три аспекта: разумность min/max vpcie3v3-supply в DTS; измерить, выключился ли генератор перед сном, включился ли после неудачного сна либо недостаточно разрядилось питание и нарушило его работу; временно перевести 3.3v и генератор на внешнее питание для исключения аномалий.

<!-- en PDF p.84 -->

```text
[   17.406781] PM: suspend entry (deep)
[   17.406839] PM: Syncing filesystems ... done.
[   17.471710] Freezing user space processes ... (elapsed 0.002 seconds) done.
[   17.474337] OOM killer disabled.
[   17.474343] Freezing remaining freezable tasks ... (elapsed 0.001 seconds) done.
[   17.476200] Suspending console(s) (use no_console_suspend to debug)
[   17.479152] android_work: sent uevent USB_STATE=DISCONNECTED
[   17.480290] [WLAN_RFKILL]: Enter rfkill_wlan_suspend
[   17.501382] rk-pcie 3c0000000.pcie: fail to set vpcie3v3 regulator
[   17.501406] dpm_run_callback(): genpd_suspend_noirq+0x0/0x18 returns -22
[   17.501418] PM: Device 3c0000000.pcie failed to suspend noirq: error -22
[   38.506580] rcu: INFO: rcu_preempt detected stalls on CPUs/tasks:
[   38.506601] rcu:  1-...0: (1 GPs behind) idle=25a/1/0x4000000000000000 softirq=4657/4657 fqs=2100
[   38.506604] rcu:  (detected by 0, t=6302 jiffies, g=4609, q=17)
[   38.506613] Task dump for CPU 1:
[   38.506617] kworker/u8:4    R  running task        0  1380      2 0x0000002a
[   38.506642] Workqueue: events_unbound async_run_entry_fn
[   38.506647] Call trace:
[   38.506657]  __switch_to+0xe4/0x138
[   38.506667]  pci_pm_resume_noirq+0x0/0x120
[  101.523233] rcu: INFO: rcu_preempt detected stalls on CPUs/tasks:
[  101.523250] rcu:  1-...0: (1 GPs behind) idle=25a/1/0x4000000000000000 softirq=4657/4657 fqs=8402
[  101.523253] rcu:  (detected by 0, t=25207 jiffies, g=4609, q=17)
[  101.523260] Task dump for CPU 1:
[  101.523264] kworker/u8:4    R  running task        0  1380      2 0x0000002a
[  101.523284] Workqueue: events_unbound async_run_entry_fn
[  101.523288] Call trace:
[  101.523297]  __switch_to+0xe4/0x138
[  101.523307]  pci_pm_resume_noirq+0x0/0x120
```

<!-- en PDF p.84 -->

### 13.13 Переход PCIe в PM вызывает сбой модуля

<!-- en PDF p.84 -->

Некоторые Wi-Fi-модули при пробуждении не переходят настройками из D3 hot в D0, вызывая сбой. Драйвер контроллера всё равно принудительно переводит линию в L2 и сбрасывает её, поэтому после пробуждения линия и устройство возвращаются в L0/D0. Успех установки D0 стеком не влияет на последующее использование. Можно последовательно пробовать приведённые патчи.

<!-- en PDF p.84 -->

```text
[ 848.869840] PM: Some devices failed to suspend, or early wake event detected
[ 848.871600] rtl88x2ce 0000:01:00.0: Refused to change power state, currently in D3
[ 848.946128] rtl88x2ce 0000:01:00.0: Refused to change power state, currently in D3
[ 848.962770] rtl88x2ce 0000:01:00.0: Refused to change power state, currently in D3
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@@ -1859,6 +1865,15 @@ static void quirk_d3hot_delay(struct pci_dev *dev, unsigned int delay)
                 dev->d3_delay);
 }

+ /* Some devices report short delay it actually need, fix them! */
+static void quirk_wifi_pm(struct pci_dev *dev)
+{
+       /* Ask your vendor how long it takes for D3 to D0 !!! */
+       if (dev->vendor == PCI_VENDOR_ID_FOO && dev->device == PCI_DEVICE_ID_BAR)
+               quirk_d3hot_delay(dev, 200); /* e.g 200ms, can be more for test */
+}
+
+DECLARE_PCI_FIXUP_FINAL(PCI_VENDOR_ID_FOO, PCI_DEVICE_ID_BAR, quirk_wifi_pm);
+/* Please Add your own PID and VID */
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@@ -1334,6 +1334,12 @@ DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_VENDOR_ID_AL, PCI_ANY_ID,
 DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_VENDOR_ID_VIA, PCI_ANY_ID,
                                PCI_CLASS_STORAGE_IDE, 8, quirk_no_ata_d3);

+/* Some Wireless devices cannot transit from D3 to D0 by writing PCI_PM_CTRL */
+DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_VENDOR_ID_FOO, PCI_DEVICE_ID_BAR,
+                             PCI_CLASS_NOT_DEFINED, 8, quirk_no_ata_d3);
+/* Please Add your own PID and VID */
--- a/drivers/pci/pci.c
+++ b/drivers/pci/pci.c
@@ -818,7 +818,7 @@ static int pci_raw_set_power_state(struct pci_dev *dev, pci_power_t state)
        if (!dev->pm_cap)
            return -EIO;
+       /* Block all requests to D3hot */
+       if (state == PCI_D3hot)
+           return 0;
```

<!-- en PDF p.85 -->

### 13.14 Сбои сна/пробуждения и соединения периферии

<!-- en PDF p.85 -->

Периферия PCIe обычно выключается во сне. При медленном аппаратном разряде быстрое пробуждение повторно подаёт питание до полного отключения и нарушает работу модуля. Это часто, но не исключительно, относится к NVMe с большими конденсаторами защиты от внезапного отключения. Приведённый риск-тестовый патч обычно быстро воспроизводит такой дефект.

<!-- en PDF p.85 -->

```text
--- a/kernel/cpu.c
+++ b/kernel/cpu.c
@@ -1724,11 +1724,11 @@ int freeze_secondary_cpus(int primary)
                if (cpu == primary)
                        continue;

-               if (pm_wakeup_pending()) {
+               //if (pm_wakeup_pending()) {
                        pr_info("Wakeup pending. Abort CPU freeze\n");
                        error = -EBUSY;
                        break;
-               }
+               //}

                trace_suspend_resume(TPS("CPU_OFF"), cpu, true);
                error = _cpu_down(cpu, 1, CPUHP_OFFLINE);
```

<!-- en PDF p.86 -->

Аппаратно оптимизировать разряд PCIe-модуля и определить максимальное время t. Программно добавить задержку выключения/включения, чтобы при пробуждении питание возвращалось только после t. Пример:

<!-- en PDF p.86 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
@@ -63,6 +63,7 @@
                enable-active-high;
                gpio = <&gpio0 RK_PD4 GPIO_ACTIVE_HIGH>;
                startup-delay-us = <5000>;
+               off-on-delay-us = <500000>; //The maximum duration t provided by hardware
                vin-supply = <&dc_12v>;
        };
```

<!-- en PDF p.86 -->

### 13.15 Устройству назначен Legacy IRQ 0

<!-- en PDF p.86 -->

```text
0002:21:00.0 Serial controller: Device 1c00:3853 (rev 10) (prog-if 05 [16850])
        Subsystem: Device 1c00:3853
        Control: I/O- Mem- BusMaster- SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR- FastB2B- DisINTx-
        Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort- >SERR- <PERR- INTx-
        Interrupt: pin A routed to IRQ 0
        Region 0: I/O ports at 1000 [disabled] [size=256]
        Region 1: Memory at 380900000 (32-bit, prefetchable) [disabled] [size=32K]
        Region 2: I/O ports at 100100 [disabled] [size=4]
        [virtual] Expansion ROM at 380908000 [disabled] [size=32K]
        Capabilities: [60] Power Management version 3
```

<!-- en PDF p.87 -->

Pin A получил legacy IRQ 0, то есть стандартное неназначенное состояние. Независимо от отключения MSI в cmdline стек при загрузке pci bus driver должен вызвать pci_assign_irq, прочитать pin из регистра конфигурации 0x3d, сопоставить его виртуальному IRQ и записать номер в 0x3c. Обычно запрос legacy IRQ должен работать. Иначе периферия не посылает корректные legacy-прерывания и драйвер нарушается. При переносе нелинуксовых драйверов некоторые реализации неправильно адаптируют модель pci bus, поэтому pci_assign_irq не вызывается и IRQ остаётся неназначенным.

<!-- en PDF p.87 -->

### 13.16 Недоступно IO-пространство периферии

<!-- en PDF p.87 -->

```text
0002:21:00.0 Serial controller: Device 1c00:3853 (rev 10) (prog-if 05 [16850])
        Subsystem: Device 1c00:3853
        Control: I/O- Mem- BusMaster- SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR- FastB2B- DisINTx-
        Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort- >SERR- <PERR- INTx-
        Interrupt: pin A routed to IRQ 0
        Region 0: I/O ports at 1000 [disabled] [size=256]
        Region 1: Memory at 380900000 (32-bit, prefetchable) [disabled] [size=32K]
        Region 2: I/O ports at 100100 [disabled] [size=4]
        [virtual] Expansion ROM at 380908000 [disabled] [size=32K]
        Capabilities: [60] Power Management version 3

0002:21:00.0 Serial Controler; device 1c00:3853 (rev 10)
00: 00 1c 53 38 00 00 10 00 10 05 00 07 00 00 00 00
10: 01 00 80 80 08 00 90 80 01 01 80 80 00 00 00 00
20: 00 00 00 00 00 00 00 00 00 00 00 00 00 1c 53 38
30: 00 00 00 00 60 00 00 00 00 00 00 00 00 01 00 00

console:/ # cat /proc/ioports
00000000-000fffff : I/O
  00001000-00001fff : PCI Bus 0002:21
    00001000-00001007 : 0002:21:00.0
    00001008-0000100f : 0002:21:00.2
    00001010-00001017 : 0002:21:00.2
```

<!-- en PDF p.87 -->

lspci показывает IO port 0x1000, PCIe bus 0x80800000. В rk3568.dtsi для PCIe3x2 физический IO начинается с 0x380800000 и соответствует шине 0x80800000. Нельзя напрямую читать физический 0x1000 через IO/devmem или ioremap: будет исключение.

<!-- en PDF p.88 -->

Причина историческая: x86 разделяет IO и memory ports, область ниже 16M предназначена IO. ARM имитирует PCIe IO через memory ports. Стек преобразует IO-адреса, сохраняя их ниже 16M и похожими на x86: база 0x1000 с выравниванием 4K. Поэтому 0x1000 из lspci соответствует физическому 0x380800000, доступному через IO/devmem, а 0x1010 соответствует 0x380800010. Для собственного драйвера см. 8250_port.c и 8250_pci.c: pci_ioremap_bar вместе с request_region дают реальный физический IO и CPU-адрес после iomap.

<!-- en PDF p.88 -->

### 13.17 Номера дисков PCIe–SATA меняются

<!-- en PDF p.88 -->

Поточная инициализация не фиксирует порядок внешних SATA-чипов разных PCIe-контроллеров. Диски внутри одного SATA-чипа упорядочены, но между чипами порядок меняется: первый чип может получить sda–sdd, второй sde–sdh, а при следующей загрузке наоборот. Приложение может обойти пути дисков, идентифицировать SATA-чип адресом контроллера, например fe160000.pcie, и создать постоянные символьные ссылки. Для упрощения можно отключить поточную инициализацию, убрав CONFIG_PCIE_RK_THREADED_INIT.

<!-- en PDF p.88 -->

```text
ls -al /sys/block/sd*

rwxrwxrwx    1 root     root             0 Jan  1 00:00 /sys/block/sda -> ../devices/platform/fe160000.pcie/pci0001:10/0001:10:00.0/0001:11:00.0/ata2/host1/target1:0:0/1:0:0:0/block/sda

lrwxrwxrwx    1 root     root             0 Jan  1 00:00 /sys/block/sdb -> ../devices/platform/fe160000.pcie/pci0001:10/0001:10:00.0/0001:11:00.0/ata3/host2/target2:0:0/2:0:0:0/block/sdb

lrwxrwxrwx    1 root     root             0 Jan  1 00:03 /sys/block/sdc -> ../devices/platform/fe160000.pcie/pci0001:10/0001:10:00.0/0001:11:00.0/ata4/host3/target3:0:0/3:0:0:0/block/sdc

lrwxrwxrwx    1 root     root             0 Jan  1 00:00 /sys/block/sdd -> ../devices/platform/fe160000.pcie/pci0001:10/0001:10:00.0/0001:11:00.0/ata5/host4/target4:0:0/4:0:0:0/block/sdd
```

<!-- en PDF p.89 -->

### 13.18 Линия PCIe есть, перечисления нет

<!-- en PDF p.89 -->

Линия поднялась, но устройство не перечислено: например, lspci видит root port bus 0, но не следующий bus 1.

<!-- en PDF p.89 -->

```text
rk-pcie fe150000.pcie: PCIe Link up, LTSSM is 0x30011
rk-pcie fe150000.pcie: PCI host bridge to bus 0000:00
pci_bus 0000:00: root bus resource [bus 00-0f]
pci_bus 0000:00: root bus resource [??? 0xf0000000-0xf00fffff flags 0x0]
pci_bus 0000:00: root bus resource [io  0x300000-0x3fffff] (bus address [0xf0100000-0xf01fffff])
pci_bus 0000:00: root bus resource [mem 0xf0200000-0xf0ffffff]
pci_bus 0000:00: root bus resource [mem 0x900000000-0x93fffffff pref]
pci 0000:00:00.0: [1d87:3588] type 01 class 0x060400
pci 0000:00:00.0: reg 0x10: [mem 0x00000000-0x3fffffff]
pci 0000:00:00.0: reg 0x14: [mem 0x00000000-0x3fffffff]
pci 0000:00:00.0: reg 0x38: [mem 0x00000000-0x0000ffff pref]
pci 0000:00:00.0: supports D1 D2
pci 0000:00:00.0: PME# supported from D0 D1 D3hot

lspci
0000:00:00.0 PCI bridge: Fuzhou Rockchip Electronics Co., Ltd Device 3588 (rev 01) (prog-if 00 [Normal decode])
```

<!-- en PDF p.89 -->

Причина — недопустимый vendor ID устройства bus 1. Добавить вывод в pci_bus_generic_read_dev_vendor_id файла drivers/pci/probe.c; стек различает четыре недопустимых ID.

<!-- en PDF p.89 -->

```text
--- a/drivers/pci/probe.c
+++ b/drivers/pci/probe.c
@@ -2314,6 +2314,8 @@ bool pci_bus_generic_read_dev_vendor_id(struct pci_bus *bus, int devfn, u32 *l,
        if (pci_bus_read_config_dword(bus, devfn, PCI_VENDOR_ID, l))
                return false;

+       dev_info(&bus->dev, "vendor id is 0x%x\n", *l);
+
        /* Some broken boards return 0 or ~0 if a slot is empty: */
        if (*l == 0xffffffff || *l == 0x00000000 ||
            *l == 0x0000ffff || *l == 0xffff0000)
```

<!-- en PDF p.89 -->

ZX-200 требует больше времени после снятия сброса для загрузки bin. При перечислении RC после link up внутренняя программа ещё не готова и читается ID 0. Попробовать следующий патч; если не помогает, привлечь изготовителя устройства для анализа.

<!-- en PDF p.90 -->

```text
--- a/drivers/pci/controller/dwc/pcie-dw-rockchip.c
+++ b/drivers/pci/controller/dwc/pcie-dw-rockchip.c
@@ -814,7 +814,7 @@ static int rk_pcie_establish_link(struct dw_pcie *pci)
                         * that LTSSM max timeout is 24ms per period, we can wait a bit
                         * more for Gen switch.
                         */
-                       msleep(50);
+                       msleep(1000);
                        /* In case link drop after linkup, double check it */
                        if (dw_pcie_link_up(pci)) {
                                dev_info(pci->dev, "PCIe Link up, LTSSM is 0x%x\n",
```

<!-- en PDF p.90 -->

### 13.19 Перечисление успешно, доступ нарушен

<!-- en PDF p.90 -->

Недостаточное время #PERST может иногда позволить перечисление, но нарушить работу. Пример — RTL8111 за PCIe switch. Увеличить reset-время свойством rockchip,perst-inactive-ms в DTS; см. описание свойств.

<!-- en PDF p.90 -->

```text
[    8.739794] enP4p67s0f0: 0xffffffc0127bd000, 86:41:ff:d2:48:a0, IRQ 133
[   10.178084] ------------[ cut here ]------------
[   10.178100] WARNING: CPU: 6 PID: 691 at drivers/net/ethernet/realtek/r8168/r8168_n.c:7291 rtl8168_wait_phy_ups_resume+0x6c/0x88
[   10.178104] Modules linked in:
[   10.178112] CPU: 6 PID: 691 Comm: dhcpcd Not tainted 5.10.66 #1
[   10.178116] Hardware name: Rockchip RK3588 NVR DEMO LP4 V10 Board (DT)
[   10.178121] pstate: 60400089 (nZCv daIf +PAN -UAO -TCO BTYPE=--)
[   10.178127] pc : rtl8168_wait_phy_ups_resume+0x6c/0x88
[   10.178132] lr : rtl8168_wait_phy_ups_resume+0x54/0x88
[   10.178135] sp : ffffffc01358ba30
[   10.178139] x29: ffffffc01358ba30 x28: 0000000000001043
[   10.178145] x27: 0000000000000000 x26: 0000000000008914
[   10.178151] x25: 0000000000000000 x24: ffffff8102e10c38
[   10.178157] x23: 0000000000418958 x22: 0000000000000002
[   10.178163] x21: ffffff8102e109c0 x20: 0000000000000064
[   10.178168] x19: 0000000000000007 x18: 0000000000000000
[   10.178174] x17: 0000000000000000 x16: 0000000000000000
[   10.178179] x15: 000000000000000a x14: 00000000000b49d2
[   10.178186] x13: 0000000000000006 x12: ffffffffffffffff
[   10.178191] x11: 0000000000000010 x10: ffffffc09358b767
[   10.178197] x9 : ffffffc0104d3868 x8 : 0000000000000000
[   10.178202] x7 : 663a31343a363820 x6 : 00000000ffff0000
[   10.178208] x5 : 0000000000000004 x4 : 000000000000ffff
[   10.178213] x3 : 0000000000000006 x2 : ffffffc011dcbbb8
[   10.178219] x1 : ffffffc01358b9f0 x0 : 0000000000005dc3
[   10.178225] Call trace:
[   10.178231]  rtl8168_wait_phy_ups_resume+0x6c/0x88
[   10.178236]  rtl8168_exit_oob+0x2e8/0x36c
[   10.178241]  rtl8168_open+0x1c8/0x37c
[   10.178247]  __dev_open+0x154/0x17c
[   10.178252]  __dev_change_flags+0xfc/0x1ac
[   10.178257]  dev_change_flags+0x30/0x70
[   10.178263]  devinet_ioctl+0x288/0x51c
[   10.178268]  inet_ioctl+0x1b8/0x1e8

Output of lspci -vvv:
0003:31:00.0 Class 0108: Device 8086:f1a5 (rev ff) (prog-if ff)
        !!! Unknown header type 7f
```

<!-- en PDF p.91 -->

### 13.20 Сбой NVMe при длительной работе

<!-- en PDF p.91 -->

```text
[186825.261896] nvme nvme0: Abort status: 0x0
[187047.435152] nvme nvme0: Abort status: 0x0
[187052.740828] nvme nvme0: I/O 256 QID 1 timeout, aborting
[187082.743811] nvme nvme0: I/O 256 QID 1 timeout, reset controller
[187092.649150] nvme nvme0: Abort status: 0x0
[187389.590726] nvme nvme0: I/O 709 QID 2 timeout, aborting
[187396.088472] nvme nvme0: Abort status: 0x0
[187419.670448] nvme nvme0: I/O 736 QID 2 timeout, aborting
[187430.034886] nvme nvme0: Abort status: 0x0
[187449.750258] nvme nvme0: I/O 736 QID 2 timeout, reset controller
```

<!-- en PDF p.91 -->

В нагрузочном тесте NVMe статус устройства 0; при ошибке линии был бы 0xf, поэтому здесь линия исключается. В первую очередь проверить температуру. Включить CONFIG_NVME_HWMON, найти hwmon-узел с именем nvme, например cat /sys/class/hwmon/hwmon8/name. Читать cat /sys/class/hwmon/hwmon8/*input, наблюдать нагрев под нагрузкой и сравнить с допустимой температурой устройства. При превышении улучшить охлаждение либо реализовать температурное управление диском в userspace.

<!-- en PDF p.91 -->

```text
[ 3836.614828] sysrq: Show Blocked State
[ 3836.614921] task:binder:306_2    state:D stack:    0 pid:  329 ppid:     1 flags:0x04000009
[ 3836.614925] Call trace:
[ 3836.614932] __switch_to+0x118/0x148
[ 3836.614936] __schedule+0x538/0x7a4
[ 3836.614938] schedule+0x9c/0xe0
[ 3836.614940] schedule_timeout+0x8c/0xf4
[ 3836.614942] io_schedule_timeout+0x48/0x6c
[ 3836.614944] wait_for_common_io+0x7c/0x100
[ 3836.614945] wait_for_completion_io_timeout+0x10/0x1c
[ 3836.614949] submit_bio_wait+0x70/0xb4
[ 3836.614952] blkdev_issue_discard+0x88/0xd8
[ 3836.614954] blk_ioctl_discard+0x100/0x108
[ 3836.614955] blkdev_common_ioctl+0x388/0x664
[ 3836.614957] blkdev_ioctl+0x16c/0x20c
[ 3836.614959] block_ioctl+0x34/0x44
[ 3836.614962] __arm64_sys_ioctl+0x90/0xc8
[ 3836.614964] el0_svc_common+0xac/0x1ac
[ 3836.614965] do_el0_svc+0x1c/0x28
[ 3836.614968] el0_svc+0x10/0x1c
[ 3836.614970] el0_sync_handler+0x68/0xac
[ 3836.614972] el0_sync+0x160/0x180
```

<!-- en PDF p.92 -->

Если кроме nvme nvme0: I/O 736 QID 2 timeout, aborting появляется указанное сообщение, проверить, не предшествовали ли полное форматирование или синхронное массовое удаление. Полные NVMe большой ёмкости особенно подвержены. Решение:

<!-- en PDF p.92 -->

```text
(1) Set the CONFIG_DEFAULT_HUNG_TASK_TIMEOUT to a slightly larger number of seconds, for example, 120, to avoid the block-mq blockage detection
(2) Adjust the software timeout times for the admin queue and io queue in the NVMe protocol stack
--- a/drivers/nvme/host/core.c
+++ b/drivers/nvme/host/core.c
@@ -41,12 +41,12 @@ struct nvme_ns_info {
        bool is_removed;
 };

-unsigned int admin_timeout = 60;
+unsigned int admin_timeout = 120;
 module_param(admin_timeout, uint, 0644);
 MODULE_PARM_DESC(admin_timeout, "timeout in seconds for admin commands");
 EXPORT_SYMBOL_GPL(admin_timeout);

-unsigned int nvme_io_timeout = 30;
+unsigned int nvme_io_timeout = 120;
 module_param_named(io_timeout, nvme_io_timeout, uint, 0644);
```

<!-- en PDF p.92 -->

Следующие сообщения означают сбой NVMe. Если первопричина не найдена и не устранена, можно попробовать сброс.

<!-- en PDF p.92 -->

```text
nvme nvme0: I/O 528 QID 10 timeout, reset controller
nvme nvme0: controller is down; will reset: CSTS=0xffffffff, PCI_STATUS=0x10
--- a/drivers/nvme/host/pci.c
+++ b/drivers/nvme/host/pci.c
@@ -11,6 +11,9 @@
 #include <linux/blk-mq.h>
 #include <linux/blk-mq-pci.h>
 #include <linux/blk-integrity.h>
+#ifdef CONFIG_ARCH_ROCKCHIP
+#include <linux/aspm_ext.h>
+#endif
 #include <linux/dmi.h>
 #include <linux/init.h>
 #include <linux/interrupt.h>
@@ -132,6 +135,7 @@ struct nvme_dev {
        void __iomem *bar;
        unsigned long bar_mapped_size;
        struct work_struct remove_work;
+       struct pci_saved_state *state;
        struct mutex shutdown_lock;
        bool subsystem;
        u64 cmb_size;
@@ -1324,6 +1328,21 @@ static void nvme_warn_reset(struct nvme_dev *dev, u32 csts)
                 "Try \"nvme_core.default_ps_max_latency_us=0 pcie_aspm=off pcie_port_pm=off\" and report a bug\n");
 }
+
+static struct pci_dev *nvme_get_rc(struct pci_dev *pdev)
+{
+       struct pci_dev *rc;
+
+       /* Walk bus to get root port */
+       rc = pdev;
+       while (rc->bus->parent) {
+               rc = rc->bus->self;
+               if (!rc)
+                       break;
+       }
+
+       return rc;
+}
+
 static enum blk_eh_timer_return nvme_timeout(struct request *req)
 {
        struct nvme_iod *iod = blk_mq_rq_to_pdu(req);
@@ -1344,6 +1363,9 @@ static enum blk_eh_timer_return nvme_timeout(struct request *req)
         * Reset immediately if the controller is failed
         */
        if (nvme_should_reset(dev, csts)) {
+               rockchip_dw_pcie_pm_ctrl_for_user(nvme_get_rc(to_pci_dev(dev->dev)),
+                                                 ROCKCHIP_PCIE_PM_CTRL_RESET);
+               pci_restore_state(to_pci_dev(dev->dev));
                nvme_warn_reset(dev, csts);
                nvme_dev_disable(dev, false);
                nvme_reset_ctrl(&dev->ctrl);
@@ -1839,9 +1861,18 @@ static int nvme_pci_configure_admin_queue(struct nvme_dev *dev)
        lo_hi_writeq(nvmeq->sq_dma_addr, dev->bar + NVME_REG_ASQ);
        lo_hi_writeq(nvmeq->cq_dma_addr, dev->bar + NVME_REG_ACQ);

+       pci_save_state(to_pci_dev(dev->dev));
+
        result = nvme_enable_ctrl(&dev->ctrl);
-       if (result)
-               return result;
+       if (result) {
+               rockchip_dw_pcie_pm_ctrl_for_user(nvme_get_rc(to_pci_dev(dev->dev)),
+                                                 ROCKCHIP_PCIE_PM_CTRL_RESET);
+               pci_restore_state(to_pci_dev(dev->dev));
+               /* Try again */
+               result = nvme_enable_ctrl(&dev->ctrl);
+               if (result)
+                       return result;
+       }

        nvmeq->cq_vector = 0;
        nvme_init_queue(nvmeq, 0);
@@ -3135,10 +3166,12 @@ static unsigned long check_vendor_combination_bug(struct pci_dev *pdev)
 static void nvme_async_probe(void *data, async_cookie_t cookie)
 {
        struct nvme_dev *dev = data;
+       struct pci_dev *pdev = to_pci_dev(dev->dev);

        flush_work(&dev->ctrl.reset_work);
        flush_work(&dev->ctrl.scan_work);
        nvme_put_ctrl(&dev->ctrl);
+       dev->state = pci_store_saved_state(pdev);
 }
```

<!-- en PDF p.94 -->

## 14. Приложение

<!-- en PDF p.94 -->

### 14.1 Автомат LTSSM

<!-- en PDF p.94 -->

| Состояние | Код состояния (6'h) | Примечания |
| --- | --- | --- |
| S_DETECT_QUIET | 0x00 | Не обнаружена RX-терминация периферии, устройство не работает нормально |
| S_DETECT_ACTIVE | 0x01 | - |
| S_POLL_ACTIVE | 0x02 | - |
| S_POLL_COMPLIANCE | 0x03 | Режим compliance; вне теста вход ошибочен из-за нарушений сигнала |
| S_POLL_CONFIG | 0x04 | - |
| S_PRE_DETECT_QUIET | 0x05 | - |
| S_DETECT_WAIT | 0x06 | - |

<!-- en PDF p.95 -->

| Состояние | Код состояния (6'h) | Примечания |
| --- | --- | --- |
| S_CFG_LINKWD_START | 0x07 | - |
| S_CFG_LINKWD_ACEPT | 0x08 | Определение порядка lane |
| S_CFG_LANENUM_WAIT | 0x09 | - |
| S_CFG_LANENUM_ACEPT | 0x0a | - |
| S_CFG_COMPLETE | 0x0b | Обнаружение физического уровня завершено |
| S_CFG_IDLE | 0x0c | - |
| S_RCVRY_LOCK | 0x0d | Переключение скорости |
| S_RCVRY_SPEED | 0x0e | - |
| S_RCVRY_RCVRCFG | 0x0f | - |
| S_RCVRY_IDLE | 0x10 | - |
| S_RCVRY_EQ0 | 0x20 | - |
| S_RCVRY_EQ1 | 0x21 | - |
| S_RCVRY_EQ2 | 0x22 | - |
| S_RCVRY_EQ3 | 0x23 | - |
| S_L0 | 0x11 | Нормальная работа L0 |
| S_L0S | 0x12 | - |
| S_L123_SEND_EIDLE | 0x13 | - |
| S_L1_IDLE | 0x14 | - |
| S_L2_IDLE | 0x15 | - |
| S_L2_WAKE | 0x16 | - |
| S_DISABLED_ENTRY | 0x17 | - |
| S_DISABLED_IDLE | 0x18 | - |
| S_DISABLED | 0x19 | - |
| S_LPBK_ENTRY | 0x1a | - |
| S_LPBK_ACTIVE | 0x1b | Режим loopback, обычно тестовая среда |
| S_LPBK_EXIT | 0x1c | - |
| S_LPBK_EXIT_TIMEOUT | 0x1d | - |

<!-- en PDF p.96 -->

| Состояние | Код состояния (6'h) | Примечания |
| --- | --- | --- |
| S_HOT_RESET_ENTRY | 0x1e | Периферия инициирует hot reset |
| S_HOT_RESET | 0x1f | - |

<!-- en PDF p.97 -->

### 14.2 Разбор вывода Debugfs

<!-- en PDF p.97 -->

| Символ события | Значение |
| --- | --- |
| EBUF Overflow | - |
| EBUF Under-run | - |
| Decode Error | Ошибка декодирования, нарушение сигнала |
| Running Disparity Error | Ошибка полярности, дисбаланс 0/1 в 8bit/10bit, нарушение Gen2 |
| SKP OS Parity Error | Ошибка чётности SKP, нарушение Gen3 |
| SYNC Header Error | Ошибка асинхронного заголовка, сигнал |
| CTL SKP OS Parity Error | Ошибка чётности управляющего SKP, Gen3 |
| Detect EI Infer | Обнаружены перекрёстные помехи |
| Receiver Error | Ошибка приёмника |
| Rx Recovery Request | RX получил запрос периферии, вход в recovery для коррекции сигнала |
| N_FTS Timeout | n_fts периферии не соответствует стандарту, сбой L0s→L0 и recovery |
| Framing Error | Ошибка формата кадра, сигнал |
| Deskew Error | Ошибка deskew, сигнал |
| BAD TLP | Получен неверный TLP |
| LCRC Error | Link CRC, нарушение сигнала |
| BAD DLLP | Неверный DLLP, сигнал |
| Replay Number Rollover | Слишком много повторов, переполнение replay |
| Replay Timeout | Тайм-аут повторной передачи |
| Rx Nak DLLP | Получен DLLP снизу, доступ отклонён |
| Tx Nak DLLP | Отправленный вниз DLLP отклонён |
| Retry TLP | Число повторных TLP, индикатор ошибок |
| FC Timeout | Тайм-аут обновления flow control |
| Poisoned TLP | Неверный тип TLP, возможна линия или переворот бита RAM |

<!-- en PDF p.98 -->

| Символ события | Значение |
| --- | --- |
| ECRC Error | End CRC, нарушение сигнала |
| Unsupported Request | Получен TLP неподдерживаемого запроса, возможен запрет доступа |
| Completer Abort | Устройство получило запрос RC, но внутренняя ошибка требует прекращения доступа |
| Completion Timeout | Чтение ресурса периферии, тайм-аут ответа TLP |
| Common event signal status | Чтение PM-режима контроллера |

<!-- en PDF p.99 -->

### 14.3 Таблица конфигураций инъекции ошибок

<!-- en PDF p.99 -->

| Номер группы einj_number | Описание группы | Тип ошибки error_type | Значение ошибки |
| --- | --- | --- | --- |
| 0 | Ошибка CRC | 0x0 | TLP LCRC Пакет с ошибкой |
| 0 | Ошибка CRC | 0x1 | 16b CRC пакета ACK/NAK DLLP Пакет с ошибкой |
| 0 | Ошибка CRC | 0x2 | 16b CRC пакета Update-FC DLLP Пакет с ошибкой |
| 0 | Ошибка CRC | 0x3 | TLP ECRC Пакет с ошибкой |
| 0 | Ошибка CRC | 0x4 | TLP FCRC Пакет с ошибкой (128b/130bit Кодирование) |
| 0 | Ошибка CRC | 0x5 | Ошибка полярности TX TSOS (128b/130bit Кодирование) |
| 0 | Ошибка CRC | 0x6 | Ошибка полярности TX SKPOS (128b/130bit Кодирование) |
| 0 | Ошибка CRC | 0x8 | RX LCRC Пакет с ошибкой |
| 0 | Ошибка CRC | 0xb | RX ECRC Пакет с ошибкой |
| 1 | Ошибка порядка пакетов | 0x0 | TLP Ошибка SEQ# |
| 1 | Ошибка порядка пакетов | 0x1 | DLLP Ошибка SEQ# ACK_NAK_DLLP |
| 2 | Ошибка DLLP | 0x0 | Блокировать передачу DLLP ACK/NAK пакет[1] |
| 2 | Ошибка DLLP | 0x1 | Блокировать передачу Update FC DLLP пакет[1] |
| 2 | Ошибка DLLP | 0x2 | Всегда отправлять NAK DLLP пакет[1] |
| 3 | Ошибка символа | 0x0 | Инвертировать заголовок синхронизации (128bit/130bit Кодирование) |
| 3 | Ошибка символа | 0x1 | TS1 Ошибка Ordered Set |
| 3 | Ошибка символа | 0x2 | TS2 Ошибка Ordered Set |
| 3 | Ошибка символа | 0x3 | FTS Ошибка Ordered Set |
| 3 | Ошибка символа | 0x4 | E-idle Ошибка Ordered Set |

<!-- en PDF p.100 -->

| Номер группы einj_number | Описание группы | Тип ошибки error_type | Значение ошибки |
| --- | --- | --- | --- |
| 3 | Ошибка символа | 0x5 | END/EDB Ошибка символа |
| 3 | Ошибка символа | 0x6 | STP/SDP Ошибка символа |
| 3 | Ошибка символа | 0x7 | SKP Ошибка Ordered Set |
| 4 | Ошибка управления потоком FC | 0x0 | Posted TLP Кредит заголовка |
| 4 | Ошибка управления потоком FC | 0x1 | Non-Posted TLP Кредит заголовка |
| 4 | Ошибка управления потоком FC | 0x2 | Completion TLP Кредит заголовка |
| 4 | Ошибка управления потоком FC | 0x4 | Posted TLP Кредит данных |
| 4 | Ошибка управления потоком FC | 0x5 | Non-Posted TLP Кредит данных |
| 4 | Ошибка управления потоком FC | 0x6 | Completion TLP Кредит данных |
| 5 | Специальная ошибка TLP | 0x0 | Считать ACK DLLP как NAK DLLP для создания повторных TLP |
| 5 | Специальная ошибка TLP | 0x1 | Создать недопустимые TLP, исходные пакеты направить на повтор |
| 6 | Ошибка проверки заголовка | 0x0 | Создать ошибку заголовка TLP |
| 6 | Ошибка проверки заголовка | 0x1 | Ошибка в первой группе четырёх Dwords префикса TLP |
| 6 | Ошибка проверки заголовка | 0x2 | Ошибка во второй группе Dwords префикса TLP |

<!-- en PDF p.100 -->

[1] Отсчёт до нуля не останавливает; нужна ручная команда остановки.

<!-- en PDF p.101 -->

### 14.4 Таблица PCIe TX Emphasis Preset

<!-- en PDF p.101 -->

| Номер preset | Preshoot(dB) | De-emphasis(dB) |
| --- | --- | --- |
| P0 | 0 | -6.0 ± 1.5 dB |
| P1 | 0 | -3.5 ± 1 dB |
| P2 | 0 | -4.4 ± 1.5 dB |
| P3 | 0 | -2.5 ± 1 dB |
| P4 | 0 | 0 |
| P5 | 1.9 ± 1 dB | 0 |
| P6 | 2.5 ± 1 dB | 0 |
| P7 | 3.5 ± 1 dB | -6.0 ± 1.5 dB |
| P8 | 3.5 ± 1 dB | -3.5 ± 1 dB |
| P9 | 3.5 ± 1 dB | 0 |
| P10 | 0 | x |

<!-- en PDF p.101 -->

### 14.5 Адрес получения ресурсов разработки

<!-- en PDF p.101 -->

После получения прав Redmine материалы доступны по https://redmine.rock-chips.com/documents/107.

<!-- en PDF p.101 -->

### 14.6 Подробная настройка адресов PCIe

<!-- en PDF p.101 -->

Подробное описание настройки адресов PCIe в DTS: https://elinux.org/Device_Tree_Usage#PCI_Host_Bridge.

<!-- en PDF p.101 -->

### 14.7 Аппаратный интерфейс M.2

<!-- en PDF p.101 -->

Key B+M совместим с адаптером Key B или Key M; Key A+E — с Key A либо Key E. Для остальных контактных плат строго выбирать слот переходника по типу интерфейса.

<!-- en PDF p.102 -->

![Английский оригинал — 102](/docs/rockchip-pcie/assets/en-p102-figure-01.png)

*Английский оригинал — 102*

<!-- en PDF p.102 -->

### 14.8 Временные параметры платы

<!-- en PDF p.102 -->

![Английский оригинал — 102](/docs/rockchip-pcie/assets/en-p102-figure-02.png)

*Английский оригинал — 102*

<!-- en PDF p.103 -->

| Регулируемое время | Обозначение | Свойство DTS | Описание (этап ядра Linux) |
| --- | --- | --- | --- |
| Стабилизация питания | t1 | startup-delay-us | Свойство в узле питания, на который ссылается vpcie3v3-supply узла PCIe. |
| Tpvperl | t2 | rockchip,perst-inactive-ms | В узле PCIe; по умолчанию 200ms, действует при загрузке. |
| Tpvperl | t2 | rockchip,s2r-perst-inactive-ms | В узле PCIe; по умолчанию равно rockchip,perst-inactive-ms, действует при возобновлении из сна. |
| Выход из Electrical Idle | t3 | rockchip,wait-for-link-ms | В узле PCIe; по умолчанию 1ms, ожидание каждого запуска линии. |

<!-- en PDF p.103 -->

### 14.9 Патч RK3568 PCIe30PHY SRNS

<!-- en PDF p.103 -->

```text
diff --git a/drivers/phy/rockchip/phy-rockchip-snps-pcie3.c b/drivers/phy/rockchip/phy-rockchip-snps-pcie3.c
index 2392bcb..fa3244e 100644
--- a/drivers/phy/rockchip/phy-rockchip-snps-pcie3.c
+++ b/drivers/phy/rockchip/phy-rockchip-snps-pcie3.c
@@ -19,12 +19,15 @@
 #include <dt-bindings/phy/phy.h>

 #define GRF_PCIE30PHY_CON4 0x10
+#define GRF_PCIE30PHY_CON5 0x14
 #define GRF_PCIE30PHY_CON6 0x18

@@ -97,6 +100,17 @@
                 (0x1 << 15) | (0x1 << 31));
    }

+
+   /* rx0_cmn_refclk_mode disabled */
+   regmap_write(priv->phy_grf, GRF_PCIE30PHY_CON5, (0x0) | (0x1 << 25));
+   /* rx1_cmn_refclk_mode disabled */
+   regmap_write(priv->phy_grf, GRF_PCIE30PHY_CON6, (0x0) | (0x1 << 25));
+
    regmap_write(priv->phy_grf, GRF_PCIE30PHY_CON4,
             (0x0 << 14) | (0x1 << (14 + 16))); //sdram_ld_done
    regmap_write(priv->phy_grf, GRF_PCIE30PHY_CON4,
```

{% endraw %}
