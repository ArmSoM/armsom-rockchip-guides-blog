---
title: "Полное руководство Rockchip RK808 PMIC: выводы, последовательность питания, DTS и отладка"
description: "Полное руководство Rockchip RK808 PMIC: выводы, последовательность питания, DTS и отладка — V1.0.1"
excerpt: "Полное руководство Rockchip RK808 PMIC: выводы, последовательность питания, DTS и отладка — V1.0.1"
translation_key: 120-rockchip-rk808-pmic
slug: 120-rockchip-rk808-pmic
lang: ru
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, RK808, PMIC, DTS, regulator]
---

{% raw %}

# Полное руководство Rockchip RK808 PMIC: выводы, последовательность питания, DTS и отладка

Китайский оригинал V1.0.1, ядра 3.10 / 4.4 / 4.19. Техническое предисловие описывает понятия, функции, DTS и диагностику модулей RK808; технический текст сохранён полностью. Английского PDF нет; все языки используют рисунки китайского PDF, часть подписей уже английская. Это платформенный справочник: проверьте PMIC, SoC, дерево питания, выводы, SDK/BSP и ядро конкретной ArmSoM. Совместимость всех плат не заявляется; аппаратных испытаний не было.

> Изменение напряжений, режимов выводов и регистров может выключить или повредить оборудование; примеры оригинала не выполнялись. `0.737.5`, различия таблиц напряжений/последовательности, `regulator-ramp-delay` 12500 против 6001 в примере и «четыре функции» при другом количестве пунктов сохранены без предположительных исправлений. Сверьте с даташитом INT (в таблице по умолчанию высокий активный уровень, в тексте низкий), VCC11 в строке VCC10, тип I для OSC32KOUT и незавершённое описание VCCA. В исходной последовательности LDO7 значение 1.8/OFF не содержит V.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Основы

### 1.1 Обзор

RK808 — высокопроизводительный PMIC с 4 сильноточными DCDC, 8 LDO, 2 выходами SWITCH, 1 RTC и настраиваемой последовательностью включения. Системные источники питания обычно делятся на DCDC и LDO. Ниже приведены общие свойства; подробности следует искать в дополнительной литературе.

1. DCDC: высокий КПД при большой разнице входного и выходного напряжений, но относительно большие пульсации и стоимость. Применяется при большом перепаде напряжения и токе нагрузки. Обычно доступны PWM (хорошие пульсации/переходная характеристика, меньший КПД) и PFM (высокий КПД, меньшая нагрузочная способность).

2. LDO: низкий КПД при большом перепаде напряжения, но низкая стоимость. Для повышения КПД оптимизируют систему: например, вход LDO с выходом 1.1V можно питать от DCDC VCCIO_3.3V. Если схема позволяет, подключайте вход LDO к выходу DCDC, учитывая последовательность включения.

### 1.2 Функции

С точки зрения пользователя функции RK808 описаны как четыре части:

1. regulator: управление состоянием отдельных источников DCDC и LDO.

2. rtc: часы, отсчёт времени и связанные функции.

3. clk: два выхода тактовой частоты 32.768KHZ; один постоянно включён и неуправляемый, второй управляется программно.

### 1.3 Функции выводов

![Оригинальный рисунок китайского PDF · p5](/docs/rockchip-rk808-pmic/assets/cn-p005-figure-01.png)

*Оригинальный рисунок китайского PDF · p5*

В следующих описаниях особое внимание уделите выводам SLEEP и INT.

![Оригинальный рисунок китайского PDF · p6](/docs/rockchip-rk808-pmic/assets/cn-p006-figure-01.png)

*Оригинальный рисунок китайского PDF · p6*

![Оригинальный рисунок китайского PDF · p7](/docs/rockchip-rk808-pmic/assets/cn-p007-figure-01.png)

*Оригинальный рисунок китайского PDF · p7*

![Оригинальный рисунок китайского PDF · p8](/docs/rockchip-rk808-pmic/assets/cn-p008-figure-01.png)

*Оригинальный рисунок китайского PDF · p8*

![Оригинальный рисунок китайского PDF · p9](/docs/rockchip-rk808-pmic/assets/cn-p009-figure-01.png)

*Оригинальный рисунок китайского PDF · p9*

Редактируемая транскрипция исходных таблиц выше.

| № вывода | Имя | Питание | Функциональный блок | Тип | I/O | Описание | PU/PD |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 9 | VCCRTC | VCCRTC/AGND | RTC | Power | O | Питание RTC | NO |
| 65 | OSC32KIN | VCCRTC/DGND | RTC | Analog | I | Вход кварцевого генератора 32KHz | NO |
| 66 | OSC32KOUT | VCCRTC/DGND | RTC | Analog | I | Выход кварцевого генератора 32KHz | NO |
| 68 | CLK32KOUT1 | VCCRTC/DGND | RTC | Digital | O | Выход такта 32KHz №1, открытый сток, всегда включён | NO |
| 67 | CLK32KOUT2 | VCCRTC/DGND | RTC | Digital | O | Выход такта 32KHz №2, открытый сток | PD |
| 37 | VREF | VCCA/REFGND | REFERENCE | Analog | O | Напряжение запрещённой зоны | PD |
| 64 | VREFGND | REFGND | REFERENCE | Analog | Gnd | Опорная земля | NO |
| 36 | VCCA | VCCA/GNDA | Analog Power | Power | I | Питание для (фраза оригинала не завершена) | NO |
| 6 | VPPOTP | VPPOTP/GNDA | Analog Power | Power | I | Питание OTP | NO |
| 45 | VCC1 | VCC1/GND1 | BUCK1 | Power | I/O | Питание BUCK1 DC-DC | NO |
| 44 | VCC1 | VCC1/GND1 | BUCK1 | Power | I/O | Питание BUCK1 DC-DC | NO |
| 43 | SW1 | VCC1/GND1 | BUCK1 | Power | I/O | Выход BUCK1 DC-DC switch | PD |
| 42 | SW1 | VCC1/GND1 | BUCK1 | Power | I/O | Выход BUCK1 DC-DC switch | PD |
| 41 | GND1 | VCC1/GND1 | BUCK1 | Power | Gnd | Земля | NO |
| 40 | GND1 | VCC1/GND1 | BUCK1 | Power | Gnd | Земля | NO |
| 39 | VFB1 | VCC1/REFGND | BUCK1 | Analog | I | Обратная связь выходного напряжения BUCK1 DC-DC switch | PD |
| 23 | VCC2 | VCC2/GND2 | BUCK2 | Power | I | Питание BUCK2 DC-DC | NO |
| 24 | VCC2 | VCC2/GND2 | BUCK2 | Power | I | Питание BUCK2 DC-DC | NO |
| 25 | SW2 | VCC2/GND2 | BUCK2 | Power | I/O | Выход BUCK2 DC-DC switch | PD |
| 26 | SW2 | VCC2/GND2 | BUCK2 | Power | I/O | Выход BUCK2 DC-DC switch | PD |
| 27 | GND2 | VCC2/GND2 | BUCK2 | Power | Gnd | Земля | NO |
| 28 | GND2 | VCC2/GND2 | BUCK2 | Power | Gnd | Земля | NO |
| 29 | VFB2 | VCC2/REFGND | BUCK2 | Analog | I | Обратная связь выходного напряжения BUCK2 DC-DC switch | PD |
| 59 | VCC3 | VCC3/GND3 | BUCK3 | Power | I | Питание BUCK3 DC-DC | NO |
| 58 | SW3 | VCC3/GND3 | BUCK3 | Power | I/O | Выход BUCK3 DC-DC switch | PD |
| 57 | GND3 | VCC3/GND3 | BUCK3 | Power | Gnd | Земля | NO |
| 56 | VFB3 | VCC3/REFGND | BUCK3 | Analog | I | Обратная связь выходного напряжения BUCK3 DC-DC switch | PD |
| 60 | VCC4 | VCC4/GND4 | BUCK4 | Power | I | Питание BUCK4 DC-DC | NO |
| 61 | SW4 | VCC4/GND4 | BUCK4 | Power | I/O | Выход BUCK4 DC-DC switch | PD |
| 62 | GND4 | VCC4/GND4 | BUCK4 | Power | Gnd | Земля | NO |
| 63 | VFB4 | VCC4/REFGND | BUCK4 | Analog | I | Обратная связь выходного напряжения BUCK4 DC-DC switch | PD |
| 47 | NC |  |  |  |  |  |  |
| 46 | GND5 | VCCA/GND5 | LDO1–8, SWITCH1,2 | Power | Gnd | Земля | NO |
| 48 | NC |  |  |  |  |  |  |
| 32 | VCC6 | VCC6/AGND | LDO1–8, SWITCH1,2 | Power | I | Питание LDO1,LDO2 | NO |
| 4 | VCC7 | VCC7/AGND | LDO1–8, SWITCH1,2 | Power | I | Питание LDO3,LDO7 | NO |
| 8 | VCC8 | VCC8/AGND | LDO1–8, SWITCH1,2 | Power | I | Питание SWITCH1 | NO |
| 13 | VCC9 | VCC9/AGND | LDO1–8, SWITCH1,2 | Power | I | Питание LDO4,LDO5 | NO |
| 1 | VCC10 | VCC11/AGND | LDO1–8, SWITCH1,2 | Power | I | Питание LDO6 | NO |
| 16 | VCC11 | VCC11/AGND | LDO1–8, SWITCH1,2 | Power | I | Питание LDO8 | NO |
| 10 | VCC12 | VCC12/AGND | LDO1–8, SWITCH1,2 | Power | I | Питание SWITCH2 | NO |
| 31 | VLDO1 | VCC7/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход LDO1 regulator | PD |
| 33 | VLDO2 | VCC7/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход LDO2 regulator | PD |
| 3 | VLDO3 | VCC8/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход LDO3 regulator | PD |
| 12 | VLDO4 | VCC9/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход LDO4 regulator | PD |
| 14 | VLDO5 | VCC10/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход LDO5 regulator | PD |
| 2 | VLDO6 | VCC9/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход LDO6 regulator | PD |
| 5 | VLDO7 | VCC11/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход LDO7 regulator | PD |
| 15 | VLDO8 | VCC11/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход LDO8 regulator | PD |
| 7 | VSWOUT1 | VCC8/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход SWITCH1 | PD |
| 11 | VSWOUT2 | VCC12/AGND | LDO1–8, SWITCH1,2 | Power | O | Выход SWITCH2 | PD |
| 30 | AGND | POWER PAD | Analog ground | Power | Gnd | Аналоговая земля | NO |
| 35 | VLDOA | POWER PAD | LDOA | Power | I/O | Питание внутренней аналоговой схемы | NO |
| 38 | DGND | POWER PAD | Digital ground | Power | Gnd | Цифровая земля | NO |
| 17 | VDDIO | VDDIO/DGND | IO | Power | I/O | Питание цифровых I/O | NO |
| 50 | SLEEP | VDDIO/DGND | IO | Digital | I | Сигнал перехода активный режим/сон | NO |
| 20 | NRESPWRON | VDDIO/DGND | IO | Digital | I/O | Сброс AP при выключении / внешний сброс цифрового ядра (кроме RTC) | PD при выключении |
| 49 | INT | VDDIO/DGND | IO | Digital | O | Флаг прерывания; полярность задаётся I2C, по умолчанию активный высокий уровень | Программируемые PU/PD |
| 51 | PWRON | VCCRTC/DGND | IO | Digital | I | Внешнее управление включением (кнопка ON) | NO |
| 18 | SDA | VDDIO/DGND | IO | Digital | I/O | Сигнал данных I2C | NO |
| 19 | SCL | VDDIO/DGND | IO | Digital | I/O | Тактовый сигнал I2C | NO |
| 52 | BOOT0 | VCCRTC/DGND | IO | Digital | I | Выбор последовательности включения | NO |
| 53 | BOOT1 | VCCRTC/DGND | IO | Digital | I | Выбор последовательности включения | NO |
| 55 | EXT_EN | VCCRTC/DGND | IO | Digital | O | Разрешение выхода внешнего BUCK при двух элементах батареи | PD |
| 22 | DVS1 | VDDIO/DGND | IO | Digital | I | Переключение BUCK1 DVS/нормальное напряжение; полярность I2C, по умолчанию активный высокий уровень | NO |
| 21 | DVS2 | VDDIO/DGND | IO | Digital | I | Переключение BUCK2 DVS/нормальное напряжение; полярность I2C, по умолчанию активный высокий уровень | NO |
| 54 | DVSOK | VDDIO/DGND | IO | Digital | O | Power-good BUCK1/BUCK2 после динамической настройки напряжения | PD |
| 34 | VDC | VDC/AGND | IO | Digital | I | Вход обнаружения напряжения адаптера | NO |

### 1.4 Важные понятия

Адрес I2C: 7-битный адрес ведомого `0x1b`. PMIC имеет три режима работы.

1. Режим PMIC normal: при обычной работе системы PMIC находится в normal, а pmic_sleep имеет низкий уровень.

2. Режим PMIC sleep: при приостановке системы PMIC переходит в sleep для снижения собственного потребления. Обычно напряжения некоторых выходов уменьшаются либо выходы отключаются; это настраивается под изделие. Высокий уровень pmic_sleep вводит PMIC в sleep. При пробуждении SoC pmic_sleep возвращается в низкий уровень и PMIC выходит из сна.

3. Режим PMIC shutdown: при выключении системы PMIC отключает всё системное питание. AP через I2C настраивает pmic_sleep для shutdown, затем поднимает pmic_sleep для перехода в shutdown.

Вывод pmic_sleep:

Обычно низкий уровень удерживает PMIC в normal; высокий переводит его в sleep или shutdown.

**pmic_int:** обычно высокий; при прерывании становится низким и остаётся таким до обработки прерывания.

**pmic_pwron:** подключите к нему аппаратную кнопку питания; драйвер определяет нажатие/отпускание.

**Режимы DCDC:** кроме PWM (force PWM) и PFM, режим AUTO динамически переключает PWM/PFM. PMIC поддерживает PWM и AUTO PWM/PFM. AUTO повышает КПД, но ухудшает пульсации/переходную характеристику. Для стабильности при работе используется PWM, при suspend — AUTO PWM/PFM.

**Напряжение DCDC3:** регистры не позволяют менять напряжение этой особой линии; оно задаётся внешним резистивным делителем. Для изменения напряжения измените внешнюю схему. В решениях Rockchip линия обычно питает VCC_DDR.

**Диапазоны регулировки DCDC и LDO при работе:**

1. Непрерывные диапазоны напряжения DCDC:

| Диапазон (V) | Шаг (mV) | Значения (V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 3.3 | 100 | 1.8、1.9、2.0、2.2....、3.3 |

2. Непрерывные напряжения LDO:

| Диапазон (V) | Шаг (mV) | Значения (V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、0.9、1.0、1.1、1.2、 ...... 3.4 |

### 1.5 Условия и последовательность включения

1. Условия включения: достаточно любого из следующих условий:

- EN переходит из низкого уровня в высокий.
- EN остаётся высоким и возникает прерывание будильника RTC.
- EN остаётся высоким и нажата кнопка PWRON.

2. Последовательность включения: требования к порядку включения линий могут различаться между SoC. Ниже приведены последовательности; конкретные требования уточняйте по актуальному datasheet.

![Оригинальный рисунок китайского PDF · p11](/docs/rockchip-rk808-pmic/assets/cn-p011-figure-01.png)

*Оригинальный рисунок китайского PDF · p11*


Таблица последовательности переписана с оригинального рисунка; пустые поля, x, OTP и ON/OFF сохранены.

| Линия | 00 Порядок | 00 Напряжение по умолчанию | 01 Порядок | 01 Напряжение по умолчанию | 10 Порядок | 10 Напряжение по умолчанию | 11 Порядок | 11 Напряжение по умолчанию |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUCK1 | 4 | 1.1V/ON | 4 | 1.2V/ON | 4 | 1.0V/ON | OTP | OTP |
| BUCK2 | 5 | 1.1V/ON | 5 | 1.2V/ON | 4 | 1.0V/ON | OTP | OTP |
| BUCK3 | 2 | 1.2V/ON | 2 | 1.2V/ON | 3 | 1.2V/ON | OTP | OTP |
| BUCK4 | 1 | 3.0V/ON | 1 | 3.0V/ON | 1 | 3.0V/ON | OTP | OTP |
| LDO1 |  | 3.3V/OFF |  | 3.3V/OFF | 1 | 3.3V/ON | OTP | OTP |
| LDO2 |  | 3.3V/OFF | 2 | 3.3V/ON |  | 3.3V/OFF | OTP | OTP |
| LDO3 | 3 | 1.1V/ON | 3 | 1.2V/ON | 2 | 1.0V/ON | OTP | OTP |
| LDO4 | 3 | 2.5V/ON |  | 2.5V/OFF | 2 | 1.8V/ON | OTP | OTP |
| LDO5 |  | 2.8V/OFF |  | 2.8V/OFF |  | 2.8V/OFF | OTP | OTP |
| LDO6 |  | 1.2V/OFF |  | 1.2V/OFF |  | 1.2V/OFF | OTP | OTP |
| LDO7 |  | 1.8/OFF |  | 1.8V/OFF |  | 1.8V/OFF | OTP | OTP |
| LDO8 |  | 3.3V/OFF |  | 1.8V/OFF |  | 3.3V/OFF | OTP | OTP |
| SWITCH1 | 1 | 3.0V/ON | 1 | 3.0V/ON | 5 | 3.0V/ON | OTP | OTP |
| SWITCH2 |  | 3.0V/OFF |  | 3.0V/OFF |  | 3.0V/OFF | OTP | OTP |

## 2. Конфигурация

### 2.1 Драйверы и menuconfig

#### 2.1.1 3.10 ядроКонфигурация

Файлы драйвера RK808:

```text
drivers/mfd/rk808.c
drivers/mfd/rk808-irq.c
drivers/rtc/rtc-rk808.c
```

Эталонный файл DTS RK808:

```text
arch/arm/boot/dts/rk808.dtsi
arch/arm/boot/dts/rk3288-evb-android-rk808-edp.dts
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
```

#### 2.1.2 4.4 ядроКонфигурация

Файлы драйвера RK808:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
```

Эталонный файл DTS RK808:

```text
arch/arm64/boot/dts/rockchip/rk3399-evb-rev3.dtsi
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_COMMON_CLK_RK808
```

#### 2.1.3 4.19 ядроКонфигурация

Файлы драйвера RK808:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_COMMON_CLK_RK808
```

### 2.2 Конфигурация DTS

#### 2.2.1 3.10 ядро Конфигурация DTS

DTS содержит подключение I2C, основные свойства и разделы regulator, rtc и poweroff.

```text
&i2c1 {
    rk808: rk808@1b {
        reg = <0x1b>;
        status = "okay";
    };
};

/include/ "rk808.dtsi"
&rk808 {
    gpios = <&gpio0 GPIO_A4 GPIO_ACTIVE_HIGH>,
            <&gpio0 GPIO_B3 GPIO_ACTIVE_LOW>;
    rk808,system-power-controller;

    rtc {
        status = "disabled";
    };

    regulators {
        rk808_dcdc1_reg: regulator@0 {
            regulator-always-on;
            regulator-boot-on;
            regulator-min-microvolt = <750000>;
            regulator-max-microvolt = <1400000>;
            regulator-init-microvolt = <1300000>;
            regulator-name = "vdd_arm";
            regulator-state-mem {
                regulator-off-in-suspend;
            };
        };
        rk808_dcdc2_reg: regulator@1 {
                    .............
        };
        rk808_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

1. Подключение I2C: разместите весь узел RK808 внутри соответствующего i2c и установите `status = "okay";`.

2. Основные свойства — следующее не изменять:

`rk808,system-power-controller`: объявляет управление выключением системы через RK808.

Настраивается gpios: первый вывод — pmic_int, второй — pmic_sleep.

3. regulator

- `regulator-name`: Имя питания; рекомендуется совпадение со схемой. Используется regulator_get.

- `regulator-min-microvolt`: Минимальное регулируемое напряжение при работе.

- `regulator-max-microvolt`: Максимальное регулируемое напряжение при работе.

- `regulator-initial-mode`: Рабочий режим DCDC, обычно 1: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-state-mode`: Режим DCDC во сне, обычно 2: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-initial-state`: Состояние suspend; обязательно 3.

- `regulator-boot-on`: Включает линию при регистрации regulator.

- `regulator-always-on`: Запрещает отключение при работе и включает линию при регистрации.

- `regulator-state-enabled`: Сохраняет питание во сне; для отключения заменить на regulator-state-disabled.

- `regulator-state-uv`: Напряжение ожидания, если линия остаётся включённой.

Примечания:

Если regulator-min-microvolt равен regulator-max-microvolt, framework при регистрации задаёт это напряжение и включает линию без вмешательства пользователя.

При наличии regulator-boot-on или regulator-always-on framework включает линию при регистрации. При равенстве минимального и максимального напряжений устанавливается это значение; при различии сохраняется аппаратное напряжение включения PMIC по умолчанию.

4. rtc: если RTC не нужен (например, в ТВ-приставке), добавьте показанный выше узел и явно задайте `status = "disabled"`. Для включения RTC удалите весь узел RTC либо задайте `status = "okay"`.

5. poweroff: драйвер RK808 перехватывает выключение и через I2C отключает выходы PMIC. rk808_shutdown регистрируется как syscore shutdown для подготовки: вывода напряжений при выключении, отключения прерываний RTC и т. п.

```text
static void rk808_shutdown(void)
{
    int ret,i,val;
    u16 reg = 0;
    struct rk808 *rk808 = g_rk808;

    printk("%s\n",__func__);
    /***************get dc1\dc2 voltage *********************/
    for(i=0;i<2;i++){
    reg = rk808_reg_read(rk808,rk808_BUCK_SET_VOL_REG(i));
    reg &= BUCK_VOL_MASK;
    val = 712500 + reg * 12500;
    printk("%s,line=%d dc[%d]= %d\n", __func__,__LINE__,(i+1),val);
    }
    /*****************************************************/
    ret = rk808_set_bits(rk808, RK808_INT_STS_MSK_REG1,(0x3<<5),(0x3<<5));
//close rtc int when power off
    ret = rk808_clear_bits(rk808, RK808_RTC_INT_REG,(0x3<<2)); //close rtc int when power off
    mutex_lock(&rk808->io_lock);
    mdelay(100);
}

static struct syscore_ops rk808_syscore_ops = {
    .shutdown = rk808_shutdown,
};
```

rk808_device_shutdown выполняет фактическую запись I2C для отключения выходов PMIC.

```text
static void rk808_device_shutdown(void)
{
    int ret,i;
    u8 reg = 0;
    struct rk808 *rk808 = g_rk808;
    for(i=0;i < 10;i++){
        printk("%s\n",__func__);
        ret = rk808_i2c_read(rk808,RK808_DEVCTRL_REG,1,&reg);
        if(ret < 0)
            continue;
        ret = rk808_i2c_write(rk808, RK808_DEVCTRL_REG, 1,(reg |(0x1 <<3)));
        if (ret < 0) {
            printk("rk808 power off error!\n");
            continue;
        }
    }
    while(1)wfi();
}
EXPORT_SYMBOL_GPL(rk808_device_shutdown);
```

#### 2.2.2 4.4 ядро Конфигурация DTS

DTS включает подключение i2c, основные свойства, rtc, clk и regulator.

```text
&i2c1 {
    status = "okay";
    rk808: pmic@1b {
        compatible = "rockchip,rk808";
        reg = <0x1b>;
        interrupt-parent = <&gpio1>;
        interrupts = <21 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l &pmic_dvs2>;
        rockchip,system-power-controller;
        wakeup-source;
        #clock-cells = <1>;
        clock-output-names = "rk808-clkout1", "rk808-clkout2";

        vcc1-supply = <&vcc3v3_sys>;
        vcc2-supply = <&vcc3v3_sys>;
        vcc3-supply = <&vcc3v3_sys>;
        vcc4-supply = <&vcc3v3_sys>;
        vcc6-supply = <&vcc3v3_sys>;
        vcc7-supply = <&vcc3v3_sys>;
        vcc8-supply = <&vcc3v3_sys>;
        vcc9-supply = <&vcc3v3_sys>;
        vcc10-supply = <&vcc3v3_sys>;
        vcc11-supply = <&vcc3v3_sys>;
        vcc12-supply = <&vcc3v3_sys>;
        vddio-supply = <&vcc1v8_pmu>;

        regulators {
            vdd_log: DCDC_REG1 {
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1350000>;
                regulator-ramp-delay = <6001>;
                regulator-name = "vdd_log";
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <900000>;
                };
            };
            vdd_cpu_l: DCDC_REG2 {
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1350000>;
                regulator-ramp-delay = <6001>;
                regulator-name = "vdd_cpu_l";
                regulator-state-mem {
                    regulator-off-in-suspend;
                };
            };
            vcc_ddr: DCDC_REG3 {
                .................
            };
            .............................
        };
    };
};
```

1. Подключение i2c: разместите полный узел RK808 в соответствующем i2c и задайте `status = "okay";`.

2. Основные свойства

Не изменять:

```text
compatible = "rockchip,rk808";
reg = <0x1b>;
rockchip,system-power-controller;
wakeup-source;
#clock-cells = <1>;
```

Настройка по правилам pinctrl:

- interrupt-parent: контроллер GPIO, которому принадлежит pmic_int.
- interrupts: индекс и полярность pmic_int в этом контроллере.
- pinctrl-names: не изменять, фиксированное "default".
- pinctrl-0: ссылка на pmic_int, определённый в pinctrl.

3. rtc: если модуль выбран в menuconfig, но не нужен, добавьте узел rtc в DTS с `status = "disabled"`. Драйвер не включится; возникающие при загрузке сообщения об ошибках в этом случае можно игнорировать. Для включения удалите узел либо задайте `status = "okay"`.

4. regulator

- `regulator-compatible`: Имя для сопоставления драйвера; изменение приводит к ошибке загрузки.

- `regulator-name`: Имя питания; рекомендуется совпадение со схемой. Используется regulator_get.

- `regulator-init-microvolt`: Начальное напряжение в U-Boot; в ядре не действует.

- `regulator-min-microvolt`: Минимальное регулируемое напряжение при работе.

- `regulator-max-microvolt`: Максимальное регулируемое напряжение при работе.

- `regulator-initial-mode`: Рабочий режим DCDC, обычно 1: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-mode`: Режим DCDC во сне, обычно 2: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-initial-state`: Состояние suspend; обязательно 3.

- `regulator-boot-on`: Включает линию при регистрации regulator.

- `regulator-always-on`: Запрещает отключение при работе и включает линию при регистрации.

- `regulator-ramp-delay`: Время нарастания напряжения DCDC; фиксированное значение оригинала 12500.

- `regulator-on-in-suspend`: Сохраняет питание во сне; для отключения заменить на regulator-off-in-suspend.

- `regulator-suspend-microvolt`: Напряжение ожидания при сохранённом питании.

5. poweroff

В ядре 4.4 pm_power_off_prepare готовит выключение: отключает прерывания RTC, настраивает специальные регистры и т. п. Зарегистрированный syscore shutdown выполняет фактическое отключение PMIC.

6. clk: узел, использующий тактовый сигнал RK808, ссылается на него так:

`clocks = <&rk808 1>;`

Первый аргумент: &rk808, неизменяемый. Второй: индекс тактового выхода, только 0 или 1; 0 = rk808-clkout1, 1 = rk808-clkout2.

#### 2.2.3 4.19 ядро Конфигурация DTS

См. DTS ядра 4.4. Отличие: в ядре 4.19 дочерний узел gpio больше не нужен, но другие модули по-прежнему обращаются к выводам RK808 через `gpios = <&rk808 0 GPIO_ACTIVE_LOW>;`.

### 2.3 Программные интерфейсы

Следующие интерфейсы покрывают обычные операции regulator: включение, выключение, установка и чтение напряжения.

1. Получить regulator:

`struct regulator *regulator_get(struct device *dev, const char *id)`

По умолчанию dev = NULL; id соответствует regulator-name в DTS.

2. Освободить regulator:

`void regulator_put(struct regulator *regulator)`

3. Включить regulator:

`int regulator_enable(struct regulator *regulator)`

4. Отключить regulator:

`int regulator_disable(struct regulator *regulator)`

5. Получить напряжение regulator:

`int regulator_get_voltage(struct regulator *regulator)`

6. Установить напряжение regulator:

`int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)`

Вызывающая сторона обязана обеспечить min_uV = max_uV.

7. Пример

```text
struct regulator *rdev_logic;

rdev_logic = regulator_get(NULL, "vdd_logic");          // 获取vdd_logic
regulator_enable(rdev_logic);                           // 使能vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
regulator_disable(rdev_logic);                          // 关闭vdd_logic
regulator_put(rdev_logic);                              // 释放vdd_logic
```

Ядра 4.4 и 4.19 также предоставляют интерфейсы regulator с префиксом devm_, управляющие выделяемыми ресурсами.

## 3. Debug

### 3.1 3.10 ядро

Логика драйверов PMIC относительно проста; основное внимание уделяется конечным значениям регистров. Обычный способ отладки — чтение регистров RK808 через `/sys/rk808/rk808_test`.

Чтение: `echo r [addr] > /sys/rk808/rk808_test`

Запись: `echo w [addr] [value] > /sys/rk808/rk808_test`

После записи рекомендуется прочитать значение повторно для проверки.

### 3.2 4.4 ядро

Формат команд такой же, как в ядре 3.10; меняется только путь. Ядро 4.4 использует `/sys/rk8xx/rk8xx_dbg`.

### 3.3 4.19 ядро

См. команды для ядра 4.4.

{% endraw %}
