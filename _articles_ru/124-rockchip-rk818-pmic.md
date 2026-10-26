---
title: "Полное руководство Rockchip RK818 PMIC: выводы, питание, DTS и отладка"
description: "Полное руководство Rockchip RK818 PMIC: выводы, питание, DTS и отладка — V1.0.1"
excerpt: "Полное руководство Rockchip RK818 PMIC: выводы, питание, DTS и отладка — V1.0.1"
translation_key: 124-rockchip-rk818-pmic
slug: 124-rockchip-rk818-pmic
lang: ru
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, PMIC, DTS, battery]
---

{% raw %}

# Полное руководство Rockchip RK818 PMIC: выводы, питание, DTS и отладка

Китайский оригинал V1.0.1; ядра 3.10 / 4.4 / 4.19. Сохранена область технического предисловия: понятия, функции, конфигурация и диагностика модулей. Английского PDF во входных материалах нет; четыре языка полностью основаны на китайском оригинале и используют его технические рисунки, если они есть. Только платформенный справочник ArmSoM: сверяйте PMIC, SoC, SDK/BSP, ядро, питание и батарею конкретной платы. Аппаратных испытаний не было; поддержка всех плат не заявляется.

> Код, параметры и журналы — примеры производителя, не измерения ArmSoM. Изменение питания, зарядного тока, напряжения или тепловой защиты может вызвать отключение, повреждение или опасность батареи. Не копируйте настройки вслепую; не отключайте тепловую защиту при обычной работе. Противоречия сохранены без угадывания констант; см. запись сверки. Написание HDIM5V, ступень 0.737.5, ссылка на выключение RK808 и ramp-delay сохранены для проверки.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Основы

### 1.1 Обзор

RK818 — высокопроизводительный PMIC: 4 мощных DCDC, 1 мощный BOOST, 9 LDO, 1 SWITCH, выход HDIM5V (написание оригинала), выход OTG, 1 RTC, настраиваемое включение, импульсная зарядка, интеллектуальные пути питания и счётчик кулонов. Системное питание обычно DCDC либо LDO; особенности ниже (подробности в дополнительных материалах).

1. DCDC: высокий КПД при большой разнице входного и выходного напряжений, но относительно большие пульсации и стоимость. Применяется при большом перепаде напряжения и токе нагрузки. Обычно доступны PWM (хорошие пульсации/переходная характеристика, меньший КПД) и PFM (высокий КПД, меньшая нагрузочная способность).

2. LDO: низкий КПД при большом перепаде напряжения, но низкая стоимость. Для повышения КПД оптимизируют систему: например, вход LDO с выходом 1.1V можно питать от DCDC VCCIO_3.3V. Если схема позволяет, подключайте вход LDO к выходу DCDC, учитывая последовательность включения.

### 1.2 Функции

С точки зрения пользователя функции RK818 описаны как четыре части:

1. regulator: управление состоянием отдельных источников DCDC и LDO.

2. rtc: часы, отсчёт времени и связанные функции.

3. clk: два выхода тактовой частоты 32.768KHZ; один постоянно включён и неуправляемый, второй управляется программно.

4. Зарядка и измеритель заряда здесь не описаны подробно; см. Rockchip_RK818_RK816_Developer_Guide_Fuel_Gauge_CN.

### 1.3 Функции выводов

![Оригинал китайского PDF · p5](/docs/rockchip-rk818-pmic/assets/cn-p005-figure-01.png)

*Оригинал китайского PDF · p5*

В следующих описаниях особое внимание уделите выводам SLEEP и INT.

![Оригинал китайского PDF · p5](/docs/rockchip-rk818-pmic/assets/cn-p005-figure-02.png)

*Оригинал китайского PDF · p5*

![Оригинал китайского PDF · p6](/docs/rockchip-rk818-pmic/assets/cn-p006-figure-01.png)

*Оригинал китайского PDF · p6*

![Оригинал китайского PDF · p6](/docs/rockchip-rk818-pmic/assets/cn-p006-figure-02.png)

*Оригинал китайского PDF · p6*

![Оригинал китайского PDF · p7](/docs/rockchip-rk818-pmic/assets/cn-p007-figure-01.png)

*Оригинал китайского PDF · p7*

Редактируемая транскрипция исходных таблиц выше.

| № вывода | Имя | Описание |
| --- | --- | --- |
| 1 | INT | Запрос прерывания, активный низкий уровень |
| 2 | SLEEP | Вход переключения сна/не-сна |
| 3 | H_5V | Выход питания HDMI 5v |
| 4 | GND5 | Силовая земля |
| 5 | SW5 | Выход ключа |
| 6,7 | BOOST | Выход BOOST |
| 8,9 | USB | Вход питания USB |
| 10 | MIDU | Средняя точка питания USB |
| 11,12 | SW6 | Выход ключа |
| 13 | GND6 | Силовая земля |
| 14 | VLDO1 | Выход LDO1 |
| 15 | VCC6 | Питание LDO |
| 16 | VLDO2 | Выход LDO2 |
| 17 | XIN | Вход кварцевого генератора 32.768KHz |
| 18 | XOUT | Выход кварцевого генератора 32.768KHz |
| 19 | BOOT0 | Младший бит выбора запуска |
| 20 | BOOT1 | Старший бит выбора запуска |
| 21 | PWRON | Включение/выключение, активный низкий уровень; внутренняя подтяжка 100K к питанию |
| 22 | VCC3 | Питание DCDC3 |
| 23 | SW3 | Выход DCDC3 switch |
| 24 | GND3 | Силовая земля |
| 25 | VFB3 | Обратная связь выходного напряжения DCDC3 |
| 26 | VFB2 | Обратная связь выходного напряжения DCDC2 |
| 27 | GND2 | Силовая земля |
| 28,29 | SW2 | Выход DCDC2 switch |
| 30 | VCC2 | Питание DCDC2 |
| 31 | CLK32K1 | Выход такта1 32.768K, открытый сток |
| 32 | CLK32K2 | Выход такта2 32.768K, открытый сток |
| 33 | VDDIO | Питание IO |
| 34 | NRESPWON | Сброс после включения, активный низкий уровень |
| 35 | SCL | Вход тактов I2C |
| 36 | SDA | Вход/выход данных I2C |
| 37 | VPP | Тестовое питание, в приложении не подключать |
| 38 | VFB1 | Обратная связь выходного напряжения DCDC1 |
| 39 | VCC1 | Питание DCDC1 |
| 40,41 | SW1 | Выход DCDC1 switch |
| 42,43 | GND1 | Силовая земля |
| 44 | VLDO7 | Выход LDO7 |
| 45 | VCC7 | Питание LDO |
| 46 | VLDO5 | Выход LDO5 |
| 47 | VLDO3 | Выход LDO3 |
| 48 | VLDO4 | Выход LDO4 |
| 49 | VLDO6 | Выход LDO6 |
| 50 | VCC8 | Питание SWITCH |
| 51 | VLDO8 | Выход LDO8 |
| 52 | VLDO9 | Выход LDO9 |
| 53 | VCC9 | Питание LDO |
| 54 | VSWOUT | Выход ключа |
| 55 | VREF | Внутреннее опорное напряжение |
| 56 | REFGND | Опорная земля |
| 57 | SNSN | Отрицательный вывод измерения тока заряда/разряда батареи |
| 58 | SNSP | Положительный вывод измерения тока заряда/разряда батареи |
| 59,60 | BAT | Положительный вывод батареи |
| 61,62 | SYS | Выход DC-DC для питания системы и зарядки батареи |
| 63 | VCC4 | Питание DCDC4 |
| 64 | SW4 | Выход DCDC4 switch |
| 65 | VFB4 | Обратная связь выходного напряжения DCDC4 |
| 66 | GND4 | Силовая земля |
| 67 | TS1 | Вход термистора1; к земле, обычно внутри батарейного блока |
| 68 | TS2 | Вход термистора2 к земле; при выборе ADC — аналоговый вход внутреннего ADC |
| Exposed pad | Exposed ground | Обязательно соединить с землёй для тепловых/электрических характеристик |

### 1.4 Важные понятия

7-битный ведомый адрес I2C: 0x1c. PMIC имеет три режима.

1. Режим PMIC normal: при обычной работе системы PMIC находится в normal, а pmic_sleep имеет низкий уровень.

2. Режим PMIC sleep снижает потребление PMIC при приостановке системы. По требованиям изделия напряжения отдельных линий снижают либо отключают выходы. В ожидании AP через I2C настраивает pmic_sleep для sleep и поднимает его для входа в сон. При пробуждении SoC вывод возвращается в низкий уровень и PMIC выходит из сна.

3. Режим shutdown: PMIC выключает систему. AP задаёт shutdown для pmic_sleep по I2C, затем поднимает pmic_sleep.

**pmic_sleep:** обычно низкий в normal; высокий переводит в sleep или shutdown.

**pmic_int:** обычно высокий; при прерывании низкий до его обработки.

**pmic_pwron:** аппаратная кнопка питания должна подключаться сюда; драйвер определяет нажатие/отпускание.

**Режимы DCDC:** PWM (force PWM) и PFM, AUTO переключает динамически. PMIC поддерживает PWM и AUTO PWM/PFM. AUTO эффективнее, но хуже по пульсациям/переходному отклику. Для стабильности при работе PWM, при suspend AUTO PWM/PFM.

**Напряжение DCDC3:** не изменяется регистрами, задаётся внешним делителем. Для изменения нужна аппаратная переделка. Rockchip обычно использует для VCC_DDR.

**Рабочие диапазоны DCDC/LDO:**

1. Непрерывные диапазоны напряжения DCDC:

1. Непрерывные диапазоны напряжения DCDC:

| Диапазон (V) | Шаг (mV) | Значения (V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 3.3 | 100 | 1.8、1.9、2.0、2.2....、3.3 |

2. Непрерывные напряжения LDO:

| Диапазон (V) | Шаг (mV) | Значения (V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、0.9、1.0、1.1、1.2、 ...... 3.4 |

### 1.5 Условия и порядок включения

1. Условия включения: достаточно любого из следующих условий:

- EN переходит из низкого уровня в высокий.
- EN остаётся высоким и возникает прерывание будильника RTC.
- EN остаётся высоким и нажата кнопка PWRON.

2. Последовательность включения: требования к порядку включения линий могут различаться между SoC. Ниже приведены последовательности; конкретные требования уточняйте по актуальному datasheet.

![Оригинал китайского PDF · p9](/docs/rockchip-rk818-pmic/assets/cn-p009-figure-01.png)

*Оригинал китайского PDF · p9*

![Оригинал китайского PDF · p9](/docs/rockchip-rk818-pmic/assets/cn-p009-figure-02.png)

*Оригинал китайского PDF · p9*


AP: BOOT11 — RK3188/RK3168/RK3188M/RK3168M/RK3028A/RK3028/RK2928; BOOT10 — частичный OTP (BUCK1–4, LDO3/LDO4/LDO5/LDO7); BOOT01 — RK3066; BOOT00 RK818-1 — RK3288/RK3368; BOOT00 RK818-2 — S-Product.

| Rail | BOOT11 Напряжение | BOOT11 Порядок | BOOT10 Напряжение | BOOT10 Порядок | BOOT01 Напряжение | BOOT01 Порядок | BOOT00 RK818-1 Напряжение | BOOT00 RK818-1 Порядок | BOOT00 RK818-2 Напряжение | BOOT00 RK818-2 Порядок |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUCK1 | 1.1V | 3 | OTP | OTP | 1.2V | 3 | 1.1V | 3 | 1.0V | 12 |
| BUCK2 | 1.1V | 1 | OTP | OTP | 1.2V | 1 | 1.1V | 1 | 1.0V | 12 |
| BUCK3 | x | 4 | x | OTP | x | 4 | X | 3 | X | 13 |
| BUCK4 | 3.0V | 1 | OTP | OTP | 3.0V | 1 | 3.3V | 4 | 3.3V | 14 |
| LDO1 | 3.3V | x | 3.3V | x | 3.3V | x | 3.3V | x | 1.8V | 11 |
| LDO2 | 3.0V | x | 3V | x | 3.0V | x | 3.0V | x | X | X |
| LDO3 | 1.1V | 1 | OTP | OTP | 1.1V | 1 | 1.1V | x | 1.8V | 15 |
| LDO4 | 2.5V | 2 | OTP | OTP | 2.5V | 2 | 2.5V | x | 1.8V | 1 |
| LDO5 | 3V | 1 | OTP | OTP | 3.0V | 2 | 1.8V | 4 | 1.8V | 11 |
| LDO6 | 1.2V | x | 1.2V | x | 1.1V | x | 1.1V | x | X | X |
| LDO7 | 1.8V | 2 | OTP | OTP | 1.8V | 2 | 1.8V | 3 | 1.1V | 15 |
| LDO8 | 1.8V | x | 1.8V | x | 1.8V | x | 1.8V | x | 3.0V | 14 |
| LDO9 | 3.0V | 4 | 3.0V | 5 | 3.0V | 4 | 3.3V | 10 | 1.8V | 15 |
| SWITCH | x | x | x | x | x | x | x | 10 | x | x |
| OTG | 5V | x | 5V | x | 5V | x | 5V | x | 5V | x |
| HDMI_5V | 5V | x | 5V | x | 5V | x | 5V | x | 5V | x |

## 2. Конфигурация

### 2.1 Драйверы и menuconfig

Конфигурация ядра 3.10 — файлы RK818:

```text
drivers/mfd/rk818.c
drivers/mfd/rk818-irq.c
drivers/rtc/rtc-rk818.c
drivers/power/rk818-battery.c
```

Эталонный файл DTS RK818:

```text
arch/arm/boot/dts/rk818.dtsi
arch/arm64/boot/dts/rk3368-p9_818.dts
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK818
CONFIG_RTC_RK818
CONFIG_BATTERY_RK818
```

Конфигурация ядра 4.4. Файлы драйвера RK818:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
drivers/power/rk818_charger.c
drivers/power/rk818_battery.c
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
CONFIG_COMMON_CLK_RK808
```

Конфигурация ядра 4.19. Файлы драйвера RK818:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
drivers/power/supply/rk818_battery.c
drivers/power/supply/rk818_charger.c
```

Соответствующие символы menuconfig:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
CONFIG_COMMON_CLK_RK808
```

### 2.2 Конфигурация DTS

DTS ядра 3.10 включает I2C, основные свойства, regulator, RTC и poweroff.

```text
&i2c1 {
    rk818: rk818@1c {
        reg = <0x1c>;
        status = "okay";
    };
};

/include/ "../../../arm/boot/dts/rk818.dtsi"
&rk818 {
    gpios =<&gpio0 GPIO_A1 GPIO_ACTIVE_HIGH>,<&gpio0 GPIO_A0 GPIO_ACTIVE_LOW>;
    rk818,system-power-controller;
    pinctrl-names = "default";
    pinctrl-0 = <&gpio0_c1>;

    regulators {
        rk818_dcdc1_reg: regulator@0{
            regulator-name= "vdd_arm";/*vcc arm*/
            regulator-min-microvolt = <700000>;/*<725000>;*/
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x2>;
            regulator-initial-state = <3>;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-disabled;
                regulator-state-uv =<900000>;
            };
        };

        rk818_dcdc2_reg: regulator@1 {
            regulator-name= "vdd_logic";/*vcc gpu*/
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1200000>;
            regulator-initial-mode = <0x2>;
            regulator-initial-state = <3>;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-enabled;
                regulator-state-uv = <1200000>;
            };
        };
        rk818_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

1. Подключение I2C: разместите весь узел RK818 внутри соответствующего i2c и установите `status = "okay";`.

2. Основные свойства — следующее не изменять:

`rk818,system-power-controller` объявляет управление выключением системы через RK818.

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

5. poweroff: оригинал называет драйвер RK808, перехватывающий выключение и отключающий выходы PMIC через I2C. rk818_shutdown зарегистрирован как syscore shutdown для подготовки, например отключения прерываний RTC.

```text
static void rk818_shutdown(void)
{
    int ret;
    struct rk818 *rk818 = g_rk818;

    pr_info("%s\n", __func__);
    ret = rk818_set_bits(rk818, RK818_INT_STS_MSK_REG1,(0x3<<5),(0x3<<5));
//close rtc int when power off
    ret = rk818_clear_bits(rk818, RK818_RTC_INT_REG,(0x3<<2)); //close rtc int when power off
    /*disable otg_en*/
    ret = rk818_clear_bits(rk818, RK818_DCDC_EN_REG, (0x1<<7));

    mutex_lock(&rk818->io_lock);
    mdelay(100);
}

static struct syscore_ops rk818_syscore_ops = {
    .shutdown = rk818_shutdown,
};
```

rk808_device_shutdown выполняет фактическую запись I2C для отключения выходов PMIC.

```text
void rk818_device_shutdown(void)
{
    int ret, i;
    u8 reg = 0;
    struct rk818 *rk818 = g_rk818;

    for (i = 0; i < 10; i++) {
        pr_info("%s\n", __func__);
        ret = rk818_i2c_read(rk818, RK818_DEVCTRL_REG, 1, &reg);
        if (ret < 0)
            continue;
        ret = rk818_i2c_write(rk818, RK818_DEVCTRL_REG, 1,
                     (reg | (0x1 << 0)));
        if (ret < 0) {
            pr_err("rk818 power off error!\n");
            continue;
        }
    }
    while(1) wfi();
}
EXPORT_SYMBOL_GPL(rk818_device_shutdown);
```

DTS ядра 4.4 включает I2C, основные свойства, RTC, clk, regulator, charger и battery.

```text
&i2c1 {
    status = "okay";
    rk818: pmic@1c {
        compatible = "rockchip,rk818";
        reg = <0x1c>;
        status = "okay";

        clock-output-names = "rk818-clkout1", "wifibt_32kin";
        interrupt-parent = <&gpio0>;
        interrupts = <1 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l>;
        rockchip,system-power-controller;
        wakeup-source;
        #clock-cells = <1>;

        vcc1-supply = <&vcc_sys>;
        vcc2-supply = <&vcc_sys>;
        vcc3-supply = <&vcc_sys>;
        vcc4-supply = <&vcc_sys>;
        vcc6-supply = <&vcc_sys>;
        vcc7-supply = <&vcc_sys>;
        vcc8-supply = <&vcc_sys>;
        vcc9-supply = <&vcc_io>;

        regulators {
            vdd_logic: DCDC_REG1 {
                regulator-name = "vdd_logic";
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1450000>;
                regulator-ramp-delay = <6001>;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };

            vdd_gpu: DCDC_REG2 {
                regulator-name = "vdd_gpu";
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <800000>;
                regulator-max-microvolt = <1250000>;
                regulator-ramp-delay = <6001>;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };
            vcc_ddr: RK818_DCDC3@2 {
                .................
            };
            .............................
        };
    };
};
```

1. Подключение i2c: разместите полный узел RK818 в соответствующем i2c и задайте `status = "okay";`.

2. Основные свойства — следующее не изменять:

```text
compatible = "rockchip,rk818";
reg = <0x1c>;
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

6. clk: узел, использующий тактовый сигнал RK818, ссылается на него так:

`clocks = <&rk818 1>;`

Первый аргумент: &rk818, неизменяемый. Второй: индекс тактового выхода, только 0 или 1; 0 = rk818-clkout1, 1 = rk818-clkout2.

DTS ядра 4.19

См. DTS ядра 4.4. Отличие: в ядре 4.19 дочерний узел gpio больше не нужен, но другие модули по-прежнему обращаются к выводам RK818 через `gpios = <&rk818 0 GPIO_ACTIVE_LOW>;`.

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

Логика драйверов PMIC относительно проста, главное — итоговые регистры. Обычно их проверяют через `/sys/rk818/rk818_test`.

Чтение: `echo r [addr] > /sys/rk818/rk818_test`

Запись: `echo w [addr] [value] > /sys/rk818/rk818_test`

### 3.2 4.4 ядро

Формат команд такой же, как в ядре 3.10; меняется только путь. Ядро 4.4 использует `/sys/rk8xx/rk8xx_dbg`.

### 3.3 4.19 ядро

См. команды для ядра 4.4.

{% endraw %}
