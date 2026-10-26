---
title: "Полное руководство Rockchip RK816 PMIC: выводы, последовательность питания, DTS и отладка"
description: "Полное руководство Rockchip RK816 PMIC: выводы, последовательность питания, DTS и отладка — V1.0.1"
excerpt: "Полное руководство Rockchip RK816 PMIC: выводы, последовательность питания, DTS и отладка — V1.0.1"
translation_key: 122-rockchip-rk816-pmic
slug: 122-rockchip-rk816-pmic
lang: ru
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, RK816, PMIC, DTS, regulator]
---

{% raw %}

# Полное руководство Rockchip RK816 PMIC: выводы, последовательность питания, DTS и отладка

Китайский оригинал V1.0.1, ядра 3.10 / 4.4 / 4.19. Техническое предисловие описывает понятия, функции, DTS и диагностику модулей RK816; технический текст сохранён полностью. Английского PDF нет; все языки используют рисунки китайского PDF, часть подписей уже английская. Это платформенный справочник: проверьте PMIC, SoC, дерево питания, выводы, SDK/BSP и ядро конкретной ArmSoM. Совместимость всех плат не заявляется; аппаратных испытаний не было.

> Изменение напряжений, режимов выводов и регистров может выключить или повредить оборудование; примеры оригинала не выполнялись. `0.737.5`, различия таблиц напряжений/последовательности, `regulator-ramp-delay` 12500 против 6001 в примере и «четыре функции» при другом количестве пунктов сохранены без предположительных исправлений. Пример основного свойства reg = <0x18> отличается от 0x1a в полном DTS и адресе I2C; сохранён по оригиналу и требует проверки до применения. Имя вывода NRESPWON также сохранено по рисунку.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Основы

### 1.1 Обзор

RK816 — высокопроизводительный PMIC с 4 сильноточными DCDC, 1 преобразователем BOOST, 6 LDO, 1 выходом OTG, 1 RTC и настраиваемой последовательностью включения. Также встроены импульсная зарядка, интеллектуальное управление путём питания и счётчик кулонов. Источники делятся на DCDC и LDO; далее приведены общие свойства, подробности — в дополнительной литературе.

1. DCDC: высокий КПД при большой разнице входного и выходного напряжений, но относительно большие пульсации и стоимость. Применяется при большом перепаде напряжения и токе нагрузки. Обычно доступны PWM (хорошие пульсации/переходная характеристика, меньший КПД) и PFM (высокий КПД, меньшая нагрузочная способность).

2. LDO: низкий КПД при большом перепаде напряжения, но низкая стоимость. Для повышения КПД оптимизируют систему: например, вход LDO с выходом 1.1V можно питать от DCDC VCCIO_3.3V. Если схема позволяет, подключайте вход LDO к выходу DCDC, учитывая последовательность включения.

### 1.2 Функции

С точки зрения пользователя функции RK816 описаны как четыре части:

1. regulator: управление состоянием отдельных источников DCDC и LDO.

2. rtc: часы, отсчёт времени и связанные функции.

3. gpio: out1 и out2 — двухтактные выходы, доступные как обычные GPIO, но только на выход.

4. pwrkey: определяет нажатие/отпускание кнопки питания, экономя один GPIO AP.

5. Зарядка и измерение заряда здесь подробно не рассматриваются; см. Rockchip_RK818_RK816_Developer_Guide_Fuel_Gauge_CN.

### 1.3 Функции выводов

![Оригинальный рисунок китайского PDF · p5](/docs/rockchip-rk816-pmic/assets/cn-p005-figure-01.png)

*Оригинальный рисунок китайского PDF · p5*

В следующих описаниях особое внимание уделите выводам SLEEP и INT.

![Оригинальный рисунок китайского PDF · p6](/docs/rockchip-rk816-pmic/assets/cn-p006-figure-01.png)

*Оригинальный рисунок китайского PDF · p6*

![Оригинальный рисунок китайского PDF · p6](/docs/rockchip-rk816-pmic/assets/cn-p006-figure-02.png)

*Оригинальный рисунок китайского PDF · p6*

Редактируемая транскрипция исходных таблиц выше.

| № вывода | Имя | Описание |
| --- | --- | --- |
| 1 | SCL | Вход тактов I2C |
| 2 | SDA | Вход/выход данных I2C |
| 3 | INT | Запрос прерывания |
| 4 | SW5 | Узел переключения зарядного устройства/повышающего преобразователя |
| 5 | MIDU | Средняя точка питания USB / выход повышающего преобразователя |
| 6 | USB | Питание USB |
| 7 | VCC3 | Питание BUCK3 |
| 8 | SW3 | Узел переключения BUCK3 |
| 9 | VFB3 | Обратная связь выходного напряжения BUCK3 |
| 10 | XIN | Вход кварцевого генератора 32.768KHz |
| 11 | XOUT | Выход кварцевого генератора 32.768KHz |
| 12 | PWRON | Включение/выключение, активный низкий уровень; внутренняя подтяжка 20k к питанию |
| 13 | VCC2 | Питание BUCK2 |
| 14 | SW2 | Узел переключения BUCK2 |
| 15 | VFB2 | Обратная связь выходного напряжения BUCK2 |
| 16 | VCC1 | Питание BUCK1 |
| 17 | SW1 | Узел переключения BUCK1 |
| 18 | VFB1 | Обратная связь выходного напряжения BUCK1 |
| 19 | NRESPWON | Сброс после включения, активный низкий уровень |
| 20 | CLK32K | Выход 32.768KHz, открытый сток |
| 21 | LDO3 | Выход LDO3 |
| 22 | VCC5 | Питание LDO1/2/3 |
| 23 | LDO1 | Выход LDO1 |
| 24 | LDO2 | Выход LDO2 |
| 25 | REFGND | Опорная земля |
| 26 | VREF | Внутреннее опорное напряжение |
| 27 | LDO4 | Выход LDO4 |
| 28 | LDO5 | Выход LDO5 |
| 29 | VCC6 | Питание LDO4/5/6 |
| 30 | LDO6 | Выход LDO6 |
| 31 | VCCRTC | Питание RTC; развязка к GND конденсатором 1uF |
| 32 | SNSN | Отрицательный вывод измерения тока заряда/разряда батареи |
| 33 | SNSP | Положительный вывод измерения тока заряда/разряда батареи |
| 34 | TS(GPIO1) | Вход термистора, подключаемого к земле (обычно в батарейном блоке); альтернативная функция GPIO1 |
| 35 | BAT | Положительный вывод батареи |
| 36 | SYS | Системный вывод |
| 37 | SW4 | Узел переключения BUCK4 |
| 38 | VFB4 | Обратная связь выходного напряжения BUCK4 |
| 39 | VCC4 | Питание BUCK4 |
| 40 | SLEEP | Вход управления режимом сна |
| Exposed pad | Exposed ground | Земля |

### 1.4 Важные понятия

Адрес I2C: 7-битный адрес ведомого `0x1a`. PMIC имеет три режима работы.

1. Режим PMIC normal: при обычной работе системы PMIC находится в normal, а pmic_sleep имеет низкий уровень.

2. Режим PMIC sleep снижает потребление PMIC при приостановке системы. По требованиям изделия напряжения отдельных линий снижают либо отключают выходы. В ожидании AP через I2C настраивает pmic_sleep для sleep и поднимает его для входа в сон. При пробуждении SoC вывод возвращается в низкий уровень и PMIC выходит из сна.

3. Режим PMIC shutdown: при выключении системы PMIC отключает всё системное питание. AP через I2C настраивает pmic_sleep для shutdown, затем поднимает pmic_sleep для перехода в shutdown.

Вывод pmic_sleep:

Обычно низкий уровень удерживает PMIC в normal; высокий переводит его в sleep или shutdown.

**pmic_int:** обычно высокий; при прерывании становится низким и остаётся таким до обработки прерывания.

**pmic_pwron:** подключите к нему аппаратную кнопку питания; драйвер определяет нажатие/отпускание.

**Режимы DCDC:** кроме PWM (force PWM) и PFM, режим AUTO динамически переключает PWM/PFM. PMIC поддерживает PWM и AUTO PWM/PFM. AUTO повышает КПД, но ухудшает пульсации/переходную характеристику. Для стабильности при работе используется PWM, при suspend — AUTO PWM/PFM.

**Напряжение DCDC3:** регистры не позволяют менять напряжение этой особой линии; оно задаётся внешним резистивным делителем. Для изменения напряжения измените внешнюю схему. В решениях Rockchip линия обычно питает VCC_DDR.

**Диапазоны регулировки DCDC и LDO при работе:**

**out1/out2:** обычные двухтактные GPIO, поддерживающие только выход.

1. Прерывистые диапазоны напряжений DCDC:

| Диапазон (V) | Шаг (mV) | Значения (V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 2.2 | 200 | 1.8、 2.0、2.2 |
| 2.3 | Нет | 2.3 |

2. Непрерывные напряжения LDO:

| Диапазон (V) | Шаг (mV) | Значения (V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、 0.9、1.0、1.1、 1.2、 ...... 3.4 |

### 1.5 Условия и последовательность включения

1. Условия включения: достаточно любого из следующих условий:

- EN переходит из низкого уровня в высокий.
- EN остаётся высоким и возникает прерывание будильника RTC.
- EN остаётся высоким и нажата кнопка PWRON.

2. Последовательность включения: требования к порядку включения линий могут различаться между SoC. Ниже приведены последовательности; конкретные требования уточняйте по актуальному datasheet.

![Оригинальный рисунок китайского PDF · p8](/docs/rockchip-rk816-pmic/assets/cn-p008-figure-01.png)

*Оригинальный рисунок китайского PDF · p8*


Таблица последовательности переписана с оригинального рисунка; пустые поля, x, OTP и ON/OFF сохранены.

| Линия | Диапазон выхода | Максимальный ток | 1 (RK816B-1) Напряжение по умолчанию | 1 (RK816B-1) Порядок | 0 (RK816B-2) Напряжение по умолчанию | 0 (RK816B-2) Порядок | 0 (RK816B-3) Напряжение по умолчанию | 0 (RK816B-3) Порядок |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUCK1 | 0.7125V-2.3V (0.7125-1.45V, шаг 12.5mV) | 2A | 1.1V | 2 | 1.0V | 3 | 1.1V | 2 |
| BUCK2 | 0.7125V-2.3V (0.7125-1.45V, шаг 12.5mV) | 2A | 1.1V | 1 | 2.2V | 1 | 1.1V | 1 |
| BUCK3 | внешние резисторы | 1A | x | 3 | x | 4 | x | 3 |
| BUCK4 | 0.8V-3.5V (шаг 0.1V) | 1A | 3.3V | 1 | 3.3V | 6 | 3.3V | 1 |
| BOOST | 4.7V-5.4V (шаг 0.1V) | 2A | 5V | OFF | 5V | OFF | 5V | OFF |
| LDO1 | 0.8V-3.4V (шаг 0.1V) | 300mA | 1.0V | OFF | 1.0V | 2 | 1.8V | OFF |
| LDO2 | 0.8V-3.4V (шаг 0.1V) | 300mA | 1.8V | 1 | 1.8V | 5 | 1.8V | 1 |
| LDO3 | 0.8V-3.4V (шаг 0.1V) | 100mA | 1.1V | 1 | 1.0V | 2 | 1.1V | 1 |
| LDO4 | 0.8V-3.4V (шаг 0.1V) | 300mA | 1.0V | OFF | 3.3V | 6 | 3.3V | OFF |
| LDO5 | 0.8V-3.4V (шаг 0.1V) | 300mA | 3.0V | 4 | 1.8V | OFF | 3.3V | 4 |
| LDO6 | 0.8V-3.4V (шаг 0.1V) | 300mA | 3.0V | 4 | 2.8V | OFF | 3.3V | 4 |

## 2. Конфигурация

### 2.1 Драйверы и menuconfig

Конфигурация ядра 3.10. Файлы RK816 (повторное использование драйвера RK816):

```text
drivers/mfd/rk816.c
drivers/input/misc/rk816-pwrkey.c
drivers/rtc/rtc-rk816.c
drivers/gpio/gpio-rk816.c
drivers/regulator/rk816-regulator.c
drivers/power/rk816_battery.c
```

Эталонный файл DTS RK816:

```text
arch/arm/boot/dts/rk816.dtsi
arch/arm/boot/dts/rk3126-86v-rk816.dts
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK816
CONFIG_GPIO_RK816
CONFIG_RTC_RK816
CONFIG_REGULATOR_RK816
CONFIG_INPUT_RK816_PWRKEY
CONFIG_BATTERY_RK816
```

Конфигурация ядра 4.4. Файлы драйвера RK816:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk8xx-pwrkey.c
drivers/rtc/rtc-rk808.c
drivers/gpio/gpio-rk8xx.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
drivers/power/rk816_battery.c
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_GPIO_RK8XX
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK8XX_PWRKEY
CONFIG_COMMON_CLK_RK808
CONFIG_BATTERY_RK816
```

Конфигурация ядра 4.19. Файлы драйвера RK816:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk816-pwrkey.c       // 跟4.4内核不同
drivers/rtc/rtc-rk808.c
drivers/pinctrl/pinctrl-rk816.c         // 跟4.4内核不同
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
drivers/power/rk816_battery.c
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_PINCTRL_RK816
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK816_PWRKEY
CONFIG_COMMON_CLK_RK808
CONFIG_BATTERY_RK816
```

### 2.2 Конфигурация DTS

Конфигурация ядра 3.10

DTS содержит подключение I2C, основные свойства и разделы regulator, rtc и poweroff.

```text
&i2c1 {
    rk816: rk816@1a {
        reg = <0x1a>;
        status = "okay";
    };
};

/include/ "rk816.dtsi"
&rk816 {
    gpios = <&gpio1 GPIO_A5 GPIO_ACTIVE_HIGH>, <&gpio1 GPIO_A1 GPIO_ACTIVE_LOW>;
    rk816,system-power-controller;
    rk816,support_dc_chg = <1>;/*1: dc chg; 0:usb chg*/
    io-channels = <&adc 0>;
    gpio-controller;
    #gpio-cells = <2>;
    rtc {
        status = "okay";
    };

    regulators {
        rk816_dcdc1_reg: regulator@0{
            regulator-name= "vdd_arm";
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x1>;
            regulator-initial-state = <3>;
            regulator-always-on;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-disabled;
                regulator-state-uv = <900000>;
            };
        };

        rk816_dcdc2_reg: regulator@1 {
            regulator-name= "vdd_logic";
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x1>;
            regulator-initial-state = <3>;
            regulator-always-on;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-enabled;
                regulator-state-uv = <1000000>;
            };
        };
        rk816_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

1. Подключение I2C: разместите весь узел RK816 внутри соответствующего i2c и установите `status = "okay";`.

2. Основные свойства — следующее не изменять:

`rk816,system-power-controller`: объявляет управление выключением системы через RK816.

`gpio-controller`: объявляет GPIO-функции RK816.

`#gpio-cells`: число аргументов при обращении к GPIO RK816.

Для GPIO RK816 используйте `gpios = <&rk816 0 GPIO_ACTIVE_LOW>;`. Первый аргумент &rk816 неизменяемый. Второй — индекс GPIO: только 0 = out1 или 1 = out2. Третий — полярность GPIO. Настраиваемое основное свойство gpios задаёт сначала pmic_int, затем pmic_sleep.

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

5. poweroff

```text
gpio_poweroff {
    compatible = "gpio-poweroff";
    gpios = <&gpio2 GPIO_D2 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

RK816 отключает весь PMIC при высоком pmic_sleep, поэтому этот узел добавляется в корень. Настраиваемое свойство gpios указывает pmic_sleep. Если функция не зарегистрирована, доступно программное выключение RK816 по тому же процессу, что у RK808 и RK818.

DTS ядра 4.4: подключение i2c, основные свойства, rtc, pwrkey, gpio и regulator.

```text
&pinctrl {
    pmic {
        pmic_int_l: pmic-int-l {
        rockchip,pins =
            <2 6 RK_FUNC_GPIO &pcfg_pull_up>;   /* gpio2_a6 */
        };
    };
};
&i2c1 {
    status = "okay";
    rk816: pmic@1a {
        compatible = "rockchip,rk816";
        reg = <0x1a>;
        interrupt-parent = <&gpio0>;
        interrupts = <2 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l>;
        rockchip,system-power-controller;
        wakeup-source;
        gpio-controller;
        #gpio-cells = <2>;
        #clock-cells = <1>;
        clock-output-names = "rk816-clkout1", "rk816-clkout2";
        extcon = <&u2phy>;
        vcc1-supply = <&vcc_sys>;
        vcc2-supply = <&vcc_sys>;
        vcc3-supply = <&vcc_sys>;
        vcc4-supply = <&vcc_sys>;
        vcc5-supply = <&vcc_io>;
        vcc6-supply = <&vcc_sys>;
        gpio {
            status = "okay";
        };
        pwrkey {
            status = "okay";
        };
        rtc {
            status = "okay";
        };
        battery {
            compatible = "rk816-battery";
            ocv_table = < 3500 3625 3685 3697 3718 3735 3748
                    3760 3774 3788 3802 3816 3834 3853
                    3877 3908 3946 3975 4018 4071 4106>;
            design_capacity = <2500>;
            design_qmax = <2750>;
            bat_res = <100>;
            max_input_current = <1500>;
            max_chrg_current = <1300>;
            max_chrg_voltage = <4200>;
            sleep_enter_current = <300>;
            sleep_exit_current = <300>;
            sleep_filter_current = <100>;
            power_off_thresd = <3500>;
            zero_algorithm_vol = <3850>;
            max_soc_offset = <60>;
            monitor_sec = <5>;
            virtual_power = <0>;
            power_dc2otg = <0>;
            dc_det_adc = <0>;
        };

        regulators {

            vdd_arm: DCDC_REG1{
                regulator-name= "vdd_arm";
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1500000>;
                regulator-ramp-delay = <6001>;
                regulator-initial-mode = <1>;
                regulator-always-on;
                regulator-boot-on;
                regulator-state-mem {
                    regulator-off-in-suspend;
                    regulator-suspend-microvolt = <900000>;
                };
            };

            vdd_log: DCDC_REG2 {
                regulator-name= "vdd_logic";
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1500000>;
                regulator-ramp-delay = <6001>;
                regulator-initial-mode = <1>;
                regulator-always-on;
                regulator-boot-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };
            vcc_ddr: RK816_DCDC3@2 {
                .................
            };
            .............................
        };
    };
};
```

1. Подключение i2c: разместите полный узел RK816 в соответствующем i2c и задайте `status = "okay";`.

2. Основные свойства — следующее не изменять:

```text
compatible = "rockchip,rk816";
reg = <0x18>;
rockchip,system-power-controller;
wakeup-source;
gpio-controller;
#gpio-cells = <2>;
```

Настройка по правилам pinctrl:

- interrupt-parent: контроллер GPIO, которому принадлежит pmic_int.
- interrupts: индекс и полярность pmic_int в этом контроллере.
- pinctrl-names: не изменять, фиксированное "default".
- pinctrl-0: ссылка на pmic_int, определённый в pinctrl.

3. rtc, pwrkey и gpio: если они выбраны в menuconfig, но не нужны, добавьте соответствующие узлы DTS с `status = "disabled"`. Драйверы не загрузятся; возникающие при загрузке ошибки в этом случае можно игнорировать. Для включения удалите узлы либо задайте `status = "okay"`.

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

DTS ядра 4.19

См. DTS ядра 4.4. Отличие: в ядре 4.19 дочерний узел gpio больше не нужен, но другие модули по-прежнему обращаются к выводам RK816 через `gpios = <&rk816 0 GPIO_ACTIVE_LOW>;`.

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

Логика драйверов PMIC относительно проста; основное внимание уделяется конечным значениям регистров. Обычный способ отладки — чтение регистров RK816 через `/sys/rk816/rk816_test`.

Чтение: `echo r [addr] > /sys/rk816/rk816_test`

Запись: `echo w [addr] [value] > /sys/rk816/rk816_test`

Пример: `echo r 0x2f > /sys/rk816/rk816_test` читает регистр 0x2f; результат оригинала — 0x9b.

![Оригинальный рисунок китайского PDF · p16](/docs/rockchip-rk816-pmic/assets/cn-p016-figure-01.png)

*Оригинальный рисунок китайского PDF · p16*

`echo w 0x2f 0x9c > /sys/rk816/rk816_test` задаёт регистру 0x2f значение 0x9c. После записи прочитайте значение повторно для проверки.

![Оригинальный рисунок китайского PDF · p17](/docs/rockchip-rk816-pmic/assets/cn-p017-figure-01.png)

*Оригинальный рисунок китайского PDF · p17*

> Проверка оригинала: пример записи задаёт 0x9c, но следующий рисунок по-прежнему показывает чтение 0x9b и повторяет предыдущий снимок. Он не доказывает успешную запись; нужна отдельная безопасная проверка на реальном оборудовании.

### 3.2 4.4 ядро

Формат команд такой же, как в ядре 3.10; меняется только путь. Ядро 4.4 использует `/sys/rk8xx/rk8xx_dbg`.

### 3.3 4.19 ядро

См. команды для ядра 4.4.

{% endraw %}
