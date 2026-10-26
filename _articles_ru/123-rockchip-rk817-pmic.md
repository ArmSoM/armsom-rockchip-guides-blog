---
title: "Полное руководство Rockchip RK817 PMIC: выводы, питание, DTS и отладка"
description: "Полное руководство Rockchip RK817 PMIC: выводы, питание, DTS и отладка — V1.0.0"
excerpt: "Полное руководство Rockchip RK817 PMIC: выводы, питание, DTS и отладка — V1.0.0"
translation_key: 123-rockchip-rk817-pmic
slug: 123-rockchip-rk817-pmic
lang: ru
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, PMIC, DTS, battery]
---

{% raw %}

# Полное руководство Rockchip RK817 PMIC: выводы, питание, DTS и отладка

Китайский оригинал V1.0.0; ядра 4.4 / 4.19. Сохранена область технического предисловия: понятия, функции, конфигурация и диагностика модулей. Английского PDF во входных материалах нет; четыре языка полностью основаны на китайском оригинале и используют его технические рисунки, если они есть. Только платформенный справочник ArmSoM: сверяйте PMIC, SoC, SDK/BSP, ядро, питание и батарею конкретной платы. Аппаратных испытаний не было; поддержка всех плат не заявляется.

> Код, параметры и журналы — примеры производителя, не измерения ArmSoM. Изменение питания, зарядного тока, напряжения или тепловой защиты может вызвать отключение, повреждение или опасность батареи. Не копируйте настройки вслепую; не отключайте тепловую защиту при обычной работе. Противоречия сохранены без угадывания констант; см. запись сверки. Проверьте исходные пути rl817, каталог rockchi, ступень 0.737.5, число функций и ramp-delay; предположительных исправлений нет.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Основы

### 1.1 Обзор

RK817 — высокопроизводительный PMIC: 4 мощных DCDC, 9 LDO, 1 BOOST, 1 SWITCH, 1 RTC, 1 высокопроизводительный CODEC, настраиваемое включение, импульсная зарядка, интеллектуальные пути питания и счётчик кулонов. Питание системы обычно DCDC либо LDO; ниже общие особенности (подробности см. в дополнительных материалах).

1. DCDC: высокий КПД при большой разнице входного и выходного напряжений, но относительно большие пульсации и стоимость. Применяется при большом перепаде напряжения и токе нагрузки. Обычно доступны PWM (хорошие пульсации/переходная характеристика, меньший КПД) и PFM (высокий КПД, меньшая нагрузочная способность).

2. LDO: низкий КПД при большом перепаде напряжения, но низкая стоимость. Для повышения КПД оптимизируют систему: например, вход LDO с выходом 1.1V можно питать от DCDC VCCIO_3.3V. Если схема позволяет, подключайте вход LDO к выходу DCDC, учитывая последовательность включения.

### 1.2 Функции

С точки зрения пользователя функции RK817 описаны как четыре части:

1. regulator: управление состоянием отдельных источников DCDC и LDO.

2. rtc: часы, отсчёт времени и связанные функции.

3. gpio: обычные GPIO с поддержкой pinctrl.

4. pwrkey: определяет нажатие/отпускание кнопки питания, экономя один GPIO AP.

5. clk: два выхода тактовой частоты 32.768KHZ; один постоянно включён и неуправляемый, второй управляется программно.

6. codec: частота до 192KHZ, поддержка 16bit/32bit, DAC и ADC PDM. Здесь не рассматривается; оригинал обещает отдельный документ.

7. Зарядка и измерение заряда здесь не рассматриваются; оригинал обещает отдельный документ.

### 1.3 Функции выводов

![Оригинал китайского PDF · p6](/docs/rockchip-rk817-pmic/assets/cn-p006-figure-01.png)

*Оригинал китайского PDF · p6*

Особое внимание уделите SLEEP и INT; вывод sleep также предоставляет расширенную функцию GPIO.

![Оригинал китайского PDF · p7](/docs/rockchip-rk817-pmic/assets/cn-p007-figure-01.png)

*Оригинал китайского PDF · p7*

![Оригинал китайского PDF · p7](/docs/rockchip-rk817-pmic/assets/cn-p007-figure-02.png)

*Оригинал китайского PDF · p7*

![Оригинал китайского PDF · p8](/docs/rockchip-rk817-pmic/assets/cn-p008-figure-01.png)

*Оригинал китайского PDF · p8*

![Оригинал китайского PDF · p8](/docs/rockchip-rk817-pmic/assets/cn-p008-figure-02.png)

*Оригинал китайского PDF · p8*

Редактируемая транскрипция исходных таблиц выше.

| № вывода | Имя | Описание |
| --- | --- | --- |
| 1 | SCL | Вход тактов I2C |
| 2 | SDA | Вход/выход данных I2C (открытый сток) |
| 3 | LDO7 | Выход LDO7 |
| 4 | VCC7 | Питание LDO7/8/9 |
| 5 | LDO8 | Выход LDO8 |
| 6 | LDO9 | Выход LDO9 |
| 7 | INT | Запрос прерывания, открытый сток |
| 8 | FB2 | Обратная связь выходного напряжения BUCK2 |
| 9 | SW2 | Узел переключения BUCK2 |
| 10 | VCC2 | Питание BUCK2 |
| 11 | VCC1 | Питание BUCK1 |
| 12 | SW1 | Узел переключения BUCK1 |
| 13 | FB1 | Обратная связь выходного напряжения BUCK1 |
| 14 | LRCLK | Кадровый такт I2S |
| 15 | BCLK | Битовый такт I2S |
| 16 | MCLK | Вход основного такта I2S |
| 17 | SDI | Входные данные I2S DAC |
| 18 | SDO/PDMDATA | Выходные данные I2S ADC / PDM для DSADC |
| 19 | PDMCLK | PDM CLK для выхода DSADC |
| 20 | LDO3 | Выход LDO3 |
| 21 | LDO2 | Выход LDO2 |
| 22 | VCC5 | Питание LDO1/2/3 |
| 23 | LDO1 | Выход LDO1 |
| 24 | VCC3 | Питание BUCK3 |
| 25 | SW3 | Узел переключения BUCK3 |
| 26 | VBUCK3 | Выход BUCK3 |
| 27 | FB3 | Обратная связь выходного напряжения BUCK3 |
| 28 | LDO4 | Выход LDO4; внутреннее питание I2S Pin14–Pin19 |
| 29 | LDO5 | Выход LDO5 |
| 30 | VCC6 | Питание LDO4/5/6 |
| 31 | LDO6 | Выход LDO6 |
| 32 | SPKP_OUT | Положительный выход драйвера динамика |
| 33 | VCC_SPK_HP | Питание динамика и наушников |
| 34 | SPKN_OUT | Отрицательный выход драйвера динамика |
| 35 | VCC_CPVSS | Отрицательное питание наушников |
| 36 | CPN | Отрицательный узел переключения зарядового насоса |
| 37 | CPP | Положительный узел переключения зарядового насоса |
| 38 | VCC_CPVDD | Положительное питание наушников |
| 39 | HPL_OUT | Выход левого канала наушников |
| 40 | HP_SNS | Опорная земля наушников |
| 41 | HPR_OUT | Выход правого канала наушников |
| 42 | MICIN | Отрицательный вход микрофона |
| 43 | MICIP | Положительный вход микрофона |
| 44 | VCC_1P8A | Питание внутренней аналоговой схемы 1.8V |
| 45 | VCC_RTC | Фильтр питания |
| 46 | VREF | Внутреннее опорное напряжение |
| 47 | GNDREF | Опорная земля |
| 48 | VCC_1P8D | Питание внутренней цифровой схемы 1.8V |
| 49 | SLEEP | Вход управления режимом сна |
| 50 | XIN | Вход кварцевого генератора 32.768KHz |
| 51 | XOUT | Выход кварцевого генератора 32.768KHz |
| 52 | PWRON | Вход кнопки питания, активный низкий уровень; внутренняя подтяжка 17k к VCC_RTC |
| 53 | SW5 | Узел переключения зарядного устройства/повышающего преобразователя |
| 54 | MIDU/BOOST | Средняя точка питания USB / выход повышающего преобразователя |
| 55 | USB/OTG | Питание USB / выход OTG |
| 56 | BAT | Положительный вывод батареи |
| 57 | BAT | Положительный вывод батареи |
| 58 | SYS | Выход DC-DC для питания системы и зарядки батареи |
| 59 | SYS | Выход DC-DC для питания системы и зарядки батареи |
| 60 | GATE/GPIO | Управление внешним PMOS для снижения сопротивления либо GPIO по регистру |
| 61 | TS/GPIO | Термистор подключается к земле; при выборе ADC — аналоговый вход внутреннего ADC, либо GPIO по регистру |
| 62 | SNSP | Положительный вывод измерения тока заряда/разряда батареи |
| 63 | SNSN | Отрицательный вывод измерения тока заряда/разряда батареи |
| 64 | FB4 | Обратная связь выходного напряжения BUCK4 |
| 65 | SW4 | Узел переключения BUCK4 |
| 66 | VCC4 | Питание BUCK4 |
| 67 | RESETB | Сброс после включения, активный низкий уровень |
| 68 | CLK32K | Выход 32.768KHz, открытый сток |
| Exposed pad | Exposed ground | Земля |

### 1.4 Важные понятия

Адрес I2C: 7-битный адрес ведомого `0x20`. PMIC имеет три режима работы.

1. Режим PMIC normal: при обычной работе системы PMIC находится в normal, а pmic_sleep имеет низкий уровень.

2. Режим PMIC sleep снижает потребление PMIC при приостановке системы. По требованиям изделия напряжения отдельных линий снижают либо отключают выходы. В ожидании AP через I2C настраивает pmic_sleep для sleep и поднимает его для входа в сон. При пробуждении SoC вывод возвращается в низкий уровень и PMIC выходит из сна.

3. PMIC shutdown: PMIC отключает питание всей системы. AP через I2C настраивает pmic_sleep как shutdown и поднимает вывод. Обычно pmic_sleep низкий для normal; высокий переводит в sleep или shutdown. В RK817 вывод мультиплексирован, нужная функция выбирается через pinctrl:

1. SLEEP: переключение режима SLEEP.

2. Выключение: POWER DOWN.

3. Сброс: RESET.

4. Простой: без действия.

**pmic_int:** обычно высокий, при прерывании низкий до обработки.

**pmic_pwron:** аппаратная кнопка питания должна подключаться сюда; драйвер определяет нажатие/отпускание.

**Режимы DCDC:** PWM (force PWM) и PFM, AUTO переключает динамически. PMIC поддерживает PWM и AUTO PWM/PFM. AUTO эффективнее, но хуже по пульсациям/переходному отклику. Для стабильности при работе PWM, при suspend AUTO PWM/PFM.

**Напряжение DCDC3:** не изменяется регистрами, задаётся внешним делителем. Для изменения нужна аппаратная переделка. Rockchip обычно использует для VCC_DDR.

**Рабочие диапазоны DCDC/LDO:**

1. Прерывистые диапазоны напряжений DCDC:

| Диапазон (V) | Шаг (mV) | Значения (V) |
| --- | --- | --- |
| 0.7125 ~ 1.5 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.5 |
| 1.6 ~ 2.4 | 100 | 1.6、1.7、1.8、1.9、......、2.4 |

2. Непрерывные напряжения LDO:

| Диапазон (V) | Шаг (mV) | Значения (V) |
| --- | --- | --- |
| 0.6 ~ 3.4 | 25 | 0.6、0.625、0.65、0.675、...... 、3.4 |

### 1.5 Условия и порядок включения

1. Условия включения: достаточно любого из следующих условий:

- EN переходит из низкого уровня в высокий.
- EN остаётся высоким и возникает прерывание будильника RTC.
- EN остаётся высоким и нажата кнопка PWRON.
- EN остаётся высоким и подключается зарядное устройство.

2. Последовательность включения: требования к порядку включения линий могут различаться между SoC. Ниже приведены последовательности; конкретные требования уточняйте по актуальному datasheet.

![Оригинал китайского PDF · p10](/docs/rockchip-rk817-pmic/assets/cn-p010-figure-01.png)

*Оригинал китайского PDF · p10*


| Выход | Диапазон | Макс. ток | RK817-1 напряжение | RK817-1 порядок |
| --- | --- | --- | --- | --- |
| BUCK1 | 0.5V–2.4V | 2.5A | 1.1V | 1 |
| BUCK2 | 0.5V–2.4V | 2.5A | 1.1V | 1 |
| BUCK3 | X (внешний делитель) / 0.5V–2.4V (внутренний делитель) | 1.5A | x | 3 |
| BUCK4 | 0.5V–3.4V | 1.5A | 3.0V | 4 |
| BOOST | 4.7V–5.4V | 1.5A | 5.0V | OFF |
| LDO1 | 0.6V–3.4V | 400mA | 1.0V | 1 |
| LDO2 | 0.6V–3.4V | 400mA | 1.8V | 2 |
| LDO3 | 0.6V–3.4V | 100mA | 1.0V | 1 |
| LDO4 | 0.6V–3.4V | 400mA | 3.0V | 4 |
| LDO5 | 0.6V–3.4V | 400mA | 3.0V | 4 |
| LDO6 | 0.6V–3.4V | 400mA | 3.0V | 4 |
| LDO7 | 0.6V–3.4V | 400mA | 2.8V | OFF |
| LDO8 | 0.6V–3.4V | 400mA | 1.8V | OFF |
| LDO9 | 0.6V–3.4V | 400mA | 1.5V | OFF |
| OTG | = BOOST | 1.5A | 5.0V | OFF |

## 2. Конфигурация

### 2.1 Драйверы и menuconfig

Конфигурация ядра 4.4. Файлы драйвера RK817:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk8xx-pwrkey.c
drivers/rtc/rtc-rk808.c
drivers/gpio/gpio-rk8xx.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
drivers/power/rl817_battery.c
drivers/power/rl817_charger.c
sound/soc/codecs/rl817_codec.c
```

Эталонный файл DTS RK817:

```text
arch/arm64/boot/dts/rockchi/rk3326-evb-lp3-v10.dtsi
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_GPIO_RK8XX
CONFIG_REGULATOR_RK818
CONFIG_INPUT_RK8XX_PWRKEY
CONFIG_COMMON_CLK_RK808
CONFIG_BATTERY_RK817
CONFIG_CHARGER_RK817
SND_SOC_RK817
```

Конфигурация ядра 4.19. Файлы драйвера RK817:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk805-pwrkey.c       // 跟4.4内核不同
drivers/rtc/rtc-rk808.c
drivers/pinctrl/pinctrl-rk805.c         // 跟4.4内核不同
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
drivers/power/rl817_battery.c
drivers/power/rl817_charger.c
sound/soc/codecs/rl817_codec.c
```

Эталонный файл DTS RK817:

```text
arch/arm64/boot/dts/rockchi/rk3326-evb-lp3-v10.dtsi
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_PINCTRL_RK805
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK805_PWRKEY
CONFIG_COMMON_CLK_RK808
CONFIG_BATTERY_RK817
CONFIG_CHARGER_RK817
SND_SOC_RK817
```

### 2.2 Конфигурация DTS

DTS ядра 4.4: подключение i2c, основные свойства, rtc, pwrkey, gpio и regulator.

```text
&pinctrl {
    pmic {
        pmic_int: pmic_int {
            rockchip,pins =
                <0 RK_PA7 RK_FUNC_GPIO &pcfg_pull_up>;
        };
        soc_slppin_gpio: soc_slppin_gpio {
            rockchip,pins =
                <0 RK_PA4 RK_FUNC_GPIO &pcfg_output_low>;
        };
        soc_slppin_slp: soc_slppin_slp {
            rockchip,pins =
                <0 RK_PA4 RK_FUNC_1 &pcfg_pull_none>;
        };
        soc_slppin_rst: soc_slppin_rst {
            rockchip,pins =
                <0 RK_PA4 RK_FUNC_2 &pcfg_pull_none>;
        };
    };
};
&i2c1 {
    status = "okay";
    rk817: pmic@20 {
        compatible = "rockchip,rk817";
        reg = <0x20>;
        interrupt-parent = <&gpio0>;
        interrupts = <7 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default", "pmic-sleep",
                "pmic-power-off", "pmic-reset";
        pinctrl-0 = <&pmic_int>;
        pinctrl-1 = <&soc_slppin_slp>, <&rk817_slppin_slp>;
        pinctrl-2 = <&soc_slppin_gpio>, <&rk817_slppin_pwrdn>;
        pinctrl-3 = <&soc_slppin_rst>, <&rk817_slppin_rst>;
        rockchip,system-power-controller;
        wakeup-source;
        #clock-cells = <1>;
        clock-output-names = "rk808-clkout1", "rk808-clkout2";
        //fb-inner-reg-idxs = <2>;
        /* 1: rst regs (default in codes), 0: rst the pmic */
        pmic-reset-func = <1>;
        vcc1-supply = <&vccsys>;
        vcc2-supply = <&vccsys>;
        vcc3-supply = <&vccsys>;
        vcc4-supply = <&vccsys>;
        vcc5-supply = <&vccsys>;
        vcc6-supply = <&vccsys>;
        vcc7-supply = <&vcc_3v0>;
        vcc8-supply = <&vccsys>;
        vcc9-supply = <&dcdc_boost>;
        pwrkey {
            status = "okay";
};
pinctrl_rk8xx: pinctrl_rk8xx {
    gpio-controller;
    #gpio-cells = <2>;
    rk817_ts_gpio1: rk817_ts_gpio1 {
        pins = "gpio_ts";
        function = "pin_fun1";
        /* output-low; */
        /* input-enable; */
    };
    rk817_gt_gpio2: rk817_gt_gpio2 {
        pins = "gpio_gt";
        function = "pin_fun1";
    };
    rk817_pin_ts: rk817_pin_ts {
        pins = "gpio_ts";
        function = "pin_fun0";
    };
    rk817_pin_gt: rk817_pin_gt {
        pins = "gpio_gt";
        function = "pin_fun0";
    };
    rk817_slppin_null: rk817_slppin_null {
        pins = "gpio_slp";
        function = "pin_fun0";
    };
    rk817_slppin_slp: rk817_slppin_slp {
        pins = "gpio_slp";
        function = "pin_fun1";
    };
    rk817_slppin_pwrdn: rk817_slppin_pwrdn {
        pins = "gpio_slp";
        function = "pin_fun2";
    };
    rk817_slppin_rst: rk817_slppin_rst {
        pins = "gpio_slp";
        function = "pin_fun3";
    };
};
regulators {
    vdd_logic: DCDC_REG1 {
        regulator-always-on;
        regulator-boot-on;
        regulator-min-microvolt = <950000>;
        regulator-max-microvolt = <1350000>;
        regulator-ramp-delay = <6001>;
        regulator-initial-mode = <0x2>;
        regulator-name = "vdd_logic";
        regulator-state-mem {
            regulator-on-in-suspend;
            regulator-suspend-microvolt = <950000>;
        };
    };
    vdd_arm: DCDC_REG2 {
        regulator-always-on;
        regulator-boot-on;
        regulator-min-microvolt = <950000>;
        regulator-max-microvolt = <1350000>;
        regulator-ramp-delay = <6001>;
        regulator-initial-mode = <0x2>;
        regulator-name = "vdd_arm";
        regulator-state-mem {
            regulator-off-in-suspend;
            regulator-suspend-microvolt = <950000>;
        };
    };
    vcc_ddr: RK817_DCDC3@2 {
        .................
    };
    .............................
};
battery {
    compatible = "rk817,battery";
    ocv_table = <3500 3625 3685 3697 3718 3735 3748
    3760 3774 3788 3802 3816 3834 3853
    3877 3908 3946 3975 4018 4071 4106>;
    design_capacity = <2500>;
    design_qmax = <2750>;
    bat_res = <100>;
    sleep_enter_current = <300>;
    sleep_exit_current = <300>;
    sleep_filter_current = <100>;
    power_off_thresd = <3500>;
    zero_algorithm_vol = <3850>;
    max_soc_offset = <60>;
    monitor_sec = <5>;
    sample_res = <10>;
    virtual_power = <1>;
};
charger {
    compatible = "rk817,charger";
    min_input_voltage = <4500>;
    max_input_current = <1500>;
    max_chrg_current = <2000>;
    max_chrg_voltage = <4200>;
    chrg_term_mode = <0>;
    chrg_finish_cur = <300>;
    virtual_power = <0>;
    dc_det_adc = <0>;
    extcon = <&u2phy>;
        };

        rk817_codec: codec {
            #sound-dai-cells = <0>;
            compatible = "rockchip,rk817-codec";
            clocks = <&cru SCLK_I2S1_OUT>;
            clock-names = "mclk";
            pinctrl-names = "default";
            pinctrl-0 = <&i2s1_2ch_mclk>;
            hp-volume = <20>;
            spk-volume = <3>;
            status = "okay";
        };
    };
};
```

1. Подключение i2c: разместите полный узел RK817 в соответствующем i2c и задайте `status = "okay";`.

2. Основные свойства — следующее не изменять:

```text
compatible = "rockchip,rk817";
reg = <0x20>;
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

5. power off: RK817 может выключаться непосредственно сигналом I/O. Ядро регистрирует pm_shutdown_prepare_fn для подготовки: прежде всего отключения RTC-прерываний и настройки IOMUX специальных выводов. По оригиналу фактическое выключение происходит «в PCIE»: pm_power_off непосредственно управляет I/O.

```text
static int rk817_shutdown_prepare(struct rk808 *rk808)
{
    int ret;

    /* close rtc int when power off */
    regmap_update_bits(rk808->regmap,
               RK817_INT_STS_MSK_REG1,
               (0x3 << 5), (0x3 << 5));
    regmap_update_bits(rk808->regmap,
               RK817_RTC_INT_REG,
               (0x3 << 2), (0x0 << 2));

    if (rk808->pins && rk808->pins->p && rk808->pins->power_off) {
        ret = regmap_update_bits(rk808->regmap,
                     RK817_SYS_CFG(3),
                     RK817_SLPPIN_FUNC_MSK,
                     SLPPIN_NULL_FUN);
        if (ret) {
            pr_err("shutdown: config SLPPIN_NULL_FUN error!\n");
            return 0;
        }

        ret = regmap_update_bits(rk808->regmap,
                     RK817_SYS_CFG(3),
                     RK817_SLPPOL_MSK,
                     RK817_SLPPOL_H);
        if (ret) {
            pr_err("shutdown: config RK817_SLPPOL_H error!\n");
            return 0;
        }
        ret = pinctrl_select_state(rk808->pins->p,
                       rk808->pins->power_off);
        if (ret)
            pr_info("%s:failed to activate pwroff state\n",
                __func__);
        else
            return ret;
    }

    /* pmic sleep shutdown function */
    ret = regmap_update_bits(rk808->regmap,
                 RK817_SYS_CFG(3),
                 RK817_SLPPIN_FUNC_MSK, SLPPIN_DN_FUN);
    return ret;
}
```

6. clk: узел, использующий тактовый сигнал RK817, ссылается на него так:

`clocks = <&rk817 1>;`

Первый аргумент: &rk817, неизменяемый. Второй: индекс тактового выхода, только 0 или 1; 0 = rk817-clkout1, 1 = rk817-clkout2.

DTS ядра 4.19

См. DTS ядра 4.4. Отличие: в ядре 4.19 дочерний узел gpio больше не нужен, но другие модули по-прежнему обращаются к выводам RK817 через `gpios = <&rk817 0 GPIO_ACTIVE_LOW>;`.

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

rdev_logic = regulator_get(NULL, "vdd_logic");      // 获取vdd_logic
regulator_enable(rdev_logic);               // 使能vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
regulator_disable(rdev_logic);              // 关闭vdd_logic
regulator_put(rdev_logic);              // 释放vdd_logic
```

Ядра 4.4 и 4.19 также предоставляют интерфейсы regulator с префиксом devm_, управляющие выделяемыми ресурсами.

## 3. Debug

### 3.1 ядро

Формат команд такой же, как в ядре 3.10; меняется только путь. Ядро 4.4 использует `/sys/rk8xx/rk8xx_dbg`.

### 3.2 ядро

См. команды для ядра 4.4.

{% endraw %}
