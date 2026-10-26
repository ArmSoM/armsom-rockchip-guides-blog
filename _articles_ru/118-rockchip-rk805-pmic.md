---
title: "Rockchip RK805 PMIC: питание, DTS и отладка"
description: "Rockchip RK805 PMIC: питание, DTS и отладка — V1.1.1"
excerpt: "Rockchip RK805 PMIC: питание, DTS и отладка — V1.1.1"
translation_key: "118-rockchip-rk805-pmic"
slug: "118-rockchip-rk805-pmic"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK805", "PMIC", "Linux"]
---

{% raw %}

Источник RK-KF-YF-127 V1.1.1, RK805, Linux 3.10 / 4.4 / 4.19. Модули PMIC, понятия, функции, DTS и диагностика. Только справочник платформы: проверьте PMIC, SoC, SDK/BSP, ядро, питание и разводку платы ArmSoM. Аппаратная проверка не проводилась. Есть только китайский PDF; все четыре языка используют его исходные рисунки, включая имеющиеся английские подписи. Английского PDF в этой партии нет. Команды приведены, но не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- cn PDF p.4 -->

## 1. Основы

<!-- cn PDF p.4 -->

### 1.1 Обзор

<!-- cn PDF p.4 -->

RK805 — высокопроизводительная PMIC с 4 сильноточными DCDC, 3 LDO, 1 RTC и регулируемым порядком включения. Питание системы делится на DCDC и LDO; ниже их свойства (подробности изучайте отдельно).

<!-- cn PDF p.4 -->

1. DCDC: высокая эффективность при большой разности входного и выходного напряжений, но значительные пульсации и высокая стоимость; применяется при большой разности напряжений и большом токе нагрузки. Обычно имеются PWM (хорошая переходная характеристика пульсаций, низкая эффективность) и PFM (высокая эффективность, но ограниченная нагрузочная способность).

<!-- cn PDF p.4 -->

2. LDO: при большой разности напряжений эффективность низкая, стоимость небольшая. Для повышения эффективности применяются схемные оптимизации: например, при выходе LDO 1.1V вход можно питать от DCDC VCCIO_3.3V. Если схема допускает, подключайте LDO к выходу DCDC, учитывая последовательность включения.

<!-- cn PDF p.4 -->

### 1.2 Функции

<!-- cn PDF p.4 -->

Функции RK805 делятся на четыре группы:

<!-- cn PDF p.4 -->

1. Regulator: управление питанием каждого DCDC и LDO.

<!-- cn PDF p.4 -->

2. RTC: отсчёт времени и таймеры.

<!-- cn PDF p.4 -->

3. GPIO: out1 и out2 — двухтактные выходы, пригодные как обычные GPIO, но только на выход.

<!-- cn PDF p.4 -->

2. Pwrkey: обнаружение нажатия/отпускания кнопки питания, позволяющее сэкономить GPIO процессора AP.

<!-- cn PDF p.5 -->

### 1.3 Функции выводов

<!-- cn PDF p.5 -->

![Рисунок из китайского PDF — p.5](/docs/rockchip-rk805-pmic/assets/cn-p005-figure-01.png)

*Рисунок из китайского PDF — p.5*

<!-- cn PDF p.5 -->

Особенно важны выводы SLEEP и INT.

<!-- cn PDF p.5 -->

![Рисунок из китайского PDF — p.5](/docs/rockchip-rk805-pmic/assets/cn-p005-figure-02.png)

*Рисунок из китайского PDF — p.5*

<!-- cn PDF p.6 -->

![Рисунок из китайского PDF — p.6](/docs/rockchip-rk805-pmic/assets/cn-p006-figure-01.png)

*Рисунок из китайского PDF — p.6*

<!-- cn PDF p.6 -->

Определения выводов (построчная расшифровка рисунков выше; имена и I/O сохранены)

| № вывода | Имя вывода | Описание |
| --- | --- | --- |
| 1 | EN | Разрешение включения/выключения, активный высокий уровень, внутренняя подтяжка 800k к земле |
| 2 | SLEEP | Вход управления сном |
| 3 | LDO1 | Выход LDO1 |
| 4 | VCC5 | Питание LDO1/2 |
| 5 | LDO2 | Выход LDO2 |
| 6 | INT | Запрос прерывания, открытый сток |
| 7 | SCL | Тактовый вход I2C |
| 8 | SDA | Вход/выход данных I2C |
| 9 | RESETB | Вывод сброса после включения, активный низкий уровень |
| 10 | FB2 | Напряжение обратной связи buck2 |
| 11 | SW2 | Коммутационный узел buck2 |
| 12 | VCC2 | Питание buck2 |
| 13 | VCC1 | Питание buck1 |
| 14 | SW1 | Коммутационный узел buck1 |
| 15 | FB1 | Напряжение обратной связи buck1 |
| 16 | OUT1 | Цифровой выход 1, CMOS, высокий уровень VFB4 |
| 17 | OUT2 | Цифровой выход 2, CMOS, высокий уровень VFB4 |
| 18 | XIN | Вход кварцевого генератора 32.768KHz |
| 19 | XOUT | Выход кварцевого генератора 32.768KHz |
| 20 | VREF | Внутреннее опорное напряжение |
| 21 | REFGND | Опорная земля |
| 22 | VCCA | Питание controller |
| 23 | VCC6 | Питание LDO3 |
| 24 | LDO3 | Выход LDO3 |
| 25 | CLK32K | Выход тактового сигнала 32.768KHz, открытый сток |
| 26 | FB4 | Напряжение обратной связи buck4 |
| 27 | SW4 | Коммутационный узел buck4 |
| 28 | VCC4 | Питание buck4 |
| 29 | VCC3 | Питание buck3 |
| 30 | SW3 | Коммутационный узел buck3 |
| 31 | FB3 | Напряжение обратной связи buck3 |
| 32 | PWRON | Вход кнопки включения, активный низкий уровень, внутренняя подтяжка 17k к VCCA |
| Exposed pad | Exposed ground | Земля |

### 1.4 Важные понятия

<!-- cn PDF p.6 -->

7-битный адрес ведомого I2C: 0x18. PMIC имеет три режима.

<!-- cn PDF p.6 -->

1. Нормальный режим: при обычной работе системы pmic_sleep имеет низкий уровень.

<!-- cn PDF p.6 -->

2. Сон: для снижения потребления PMIC уменьшает своё потребление, снижает выбранные напряжения либо отключает выходы согласно требованиям изделия. AP через I2C назначает pmic_sleep режим сна и повышает уровень. При пробуждении SoC уровень снижается, PMIC выходит из сна.

<!-- cn PDF p.6 -->

3. Выключение: AP через I2C назначает pmic_sleep режим выключения и повышает уровень для отключения всей системы.

- pmic_sleep: низкий уровень — нормальная работа; высокий — сон или выключение.
- pmic_int: обычно высокий, при IRQ низкий до обработки.
- out1/out2: обычные GPIO только с двухтактным выходом.
- pmic_pwron: подключение кнопки питания, драйвер обнаруживает нажатие/отпускание.
- DCDC: PWM (force PWM), PFM и AUTO с динамическим переключением. AUTO эффективен, но хуже по переходным пульсациям. Для стабильности при работе используется PWM, во сне AUTO PWM/PFM.
- Регулировка DCDC3:

<!-- cn PDF p.7 -->

DCDC3 регулируется только внешними резисторами делителя, не регистрами. При необходимости измените схему; обычно Rockchip использует его для VCC_DDR. Далее диапазоны DCDC/LDO.

<!-- cn PDF p.7 -->

1. Диапазон DCDC прерывистый:

<!-- cn PDF p.7 -->

| Диапазон(V) | Шаг(mV) | Значения(V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 2.2 | 200 | 1.8、 2.0、2.2 |
| 2.3 | Нет | 2.3 |

<!-- cn PDF p.7 -->

2. Диапазон LDO непрерывный:

<!-- cn PDF p.7 -->

| Диапазон(V) | Шаг(mV) | Значения(V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、 0.9、1.0、1.1、 1.2、 ...... 3.4 |

<!-- cn PDF p.7 -->

### 1.5 Условия и последовательность включения

<!-- cn PDF p.7 -->

1. Включение: достаточно любого условия — EN меняется с низкого на высокий; EN остаётся высоким и приходит IRQ будильника RTC; EN высокий и нажата PWRON.

<!-- cn PDF p.7 -->

2. Последовательность включения: требования разных платформ SoC к порядку включения источников могут отличаться. Доступные последовательности уточняйте по последнему datasheet.

<!-- cn PDF p.7 -->

![Рисунок из китайского PDF — p.7](/docs/rockchip-rk805-pmic/assets/cn-p007-figure-01.png)

*Рисунок из китайского PDF — p.7*

<!-- cn PDF p.8 -->

Расшифровка таблицы 4-1: RK805-0 AP=Null, BOOT(OTP)=0; RK805-1 AP=RK3228, BOOT(OTP)=1; RK805-2 AP=RK1108, BOOT(OTP)=1.

| Выход | Диапазон (шаг) | Макс. ток | RK805-0 напряжение / порядок | RK805-1 напряжение / порядок | RK805-2 напряжение / порядок |
| --- | --- | --- | --- | --- | --- |
| BUCK1 | 0.7125V–1.45V (12.5mV) / 1.8V / 2V / 2.2V / 2.3V | 2.5A | 1.0V / 2 | 1.1V / 2 | 1.0V / 2 |
| BUCK2 | 0.7125V–1.45V (12.5mV) / 1.8V / 2V / 2.2V / 2.3V | 2.5A | 1.0V / 2 | 1.1V / 2 | 1.0V / X |
| BUCK3 | Задаётся внешними резисторами | 1.5A | X / 3 | X / 3 | X / 3 |
| BUCK4 | 0.8V–3.5V (0.1V) | 1.5A | 3.3V / 5 | 3.3V / 5 | 3.3V / 5 |
| LDO1 | 0.8V–3.4V (0.1V) | 300mA | 1.0V / 1 | 1.8V / 4 | 1.0V / 1 |
| LDO2 | 0.8V–3.4V (0.1V) | 300mA | 1.8V / 4 | 1.8V / 4 | 1.8V / 4 |
| LDO3 | 0.8V–3.4V (0.1V) | 100mA | 1.0V / 1 | 1.0V / 1 | 1.0V / 1 |
| RESETB |  |  | X / 8 | X / 10 | X / 10 |

## 2. Настройка

<!-- cn PDF p.8 -->

### 2.1 Драйвер и menuconfig

<!-- cn PDF p.8 -->

Ядро 3.10: RK805 использует драйвер RK816:

<!-- cn PDF p.8 -->

```text
drivers/mfd/rk816.c
drivers/input/misc/rk816-pwrkey.c
drivers/rtc/rtc-rk816.c
drivers/gpio/gpio-rk816.c
drivers/regulator/rk816-regulator.c
```

<!-- cn PDF p.8 -->

Настройки menuconfig:

<!-- cn PDF p.8 -->

```text
CONFIG_MFD_RK816
CONFIG_GPIO_RK816
CONFIG_RTC_RK816
CONFIG_REGULATOR_RK816
CONFIG_INPUT_RK816_PWRKEY
```

<!-- cn PDF p.8 -->

Ядро 4.4. Файлы драйвера RK805:

<!-- cn PDF p.8 -->

```text
drivers/mfd/rk808.c
drivers/input/misc/rk8xx-pwrkey.c
drivers/rtc/rtc-rk808.c
drivers/gpio/gpio-rk8xx.c
drivers/regulator/rk818-regulator.c
drivers/clk/clk-rk808.c
```

<!-- cn PDF p.8 -->

Настройки menuconfig:

<!-- cn PDF p.8 -->

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_GPIO_RK8XX
CONFIG_REGULATOR_RK818
CONFIG_INPUT_RK8XX_PWRKEY
CONFIG_COMMON_CLK_RK808
```

<!-- cn PDF p.8 -->

Ядро 4.19. Файлы драйвера RK805:

<!-- cn PDF p.9 -->

```text
drivers/mfd/rk808.c
drivers/input/misc/rk805-pwrkey.c       // 跟4.4内核不同
drivers/rtc/rtc-rk808.c
drivers/pinctrl/pinctrl-rk805.c         // 跟4.4内核不同
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
```

<!-- cn PDF p.9 -->

Настройки menuconfig:

<!-- cn PDF p.9 -->

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_PINCTRL_RK805
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK805_PWRKEY
CONFIG_COMMON_CLK_RK808
```

<!-- cn PDF p.9 -->

### 2.2 Настройка DTS

<!-- cn PDF p.9 -->

DTS ядра 3.10 включает I2C, основной узел, regulator, rtc и poweroff.

<!-- cn PDF p.9 -->

```text
&i2c1 {
    rk805: rk805@18 {
        reg = <0x18>;
        status = "okay";
    };
};

#include "../../../arm/boot/dts/rk805.dtsi"
&rk805 {
    gpios = <&gpio2 GPIO_A6 GPIO_ACTIVE_HIGH>, <&gpio2 GPIO_D2 GPIO_ACTIVE_LOW>;
    rk805,system-power-controller;
    gpio-controller;
    #gpio-cells = <2>;

    rtc {
        status = "disabled";
    };

    regulators {
        rk805_dcdc1_reg: regulator@0 {
            regulator-name = "vdd_logic";
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x1>;
            regulator-initial-state = <3>;
            regulator-boot-on;
            regulator-always-on;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-enabled;
                regulator-state-uv = <1000000>;
            };
        };
        rk805_dcdc2_reg: regulator@1 {
                    .............
        };
        rk805_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

<!-- cn PDF p.10 -->

1. Поместите весь rk805 под соответствующим I2C-узлом, задайте status = "okay".

<!-- cn PDF p.10 -->

2. Основной узел: следующее изменять нельзя.

<!-- cn PDF p.10 -->

```text
rk805,system-power-controller：声明RK805具备管理系统下电的功能；
gpio-controller：声明RK805具有GPIO的功能；
#gpio-cells：使⽤者引⽤RK805的GPIO时需要指定的参数个数;
```

<!-- cn PDF p.10 -->

Для GPIO RK805: gpios = <&rk805 0 GPIO_ACTIVE_LOW>;. Первый параметр фиксирован &rk805, второй 0 (out1) или 1 (out2), третий — полярность. Изменяемое gpios основного узла задаёт сначала pmic_int, затем pmic_sleep.

<!-- cn PDF p.10 -->

3. Свойства regulator:

- regulator-name: имя питания по схеме; сопоставляется в regulator_get.
- regulator-min-microvolt / regulator-max-microvolt: минимальное/максимальное рабочее напряжение.
- regulator-initial-mode: рабочий DCDC-режим, обычно 1; 1 force pwm, 2 auto pwm/pfm.
- regulator-state-mode: режим во сне, обычно 2; значения те же.
- regulator-initial-state: режим suspend, обязательно 3.
- regulator-boot-on: включение при регистрации.
- regulator-always-on: запрет отключения при работе и включение при регистрации.
- regulator-state-enabled: питание во сне; для отключения заменить на regulator-state-disabled.
- regulator-state-uv: напряжение ожидания, если питание во сне сохраняется.

<!-- cn PDF p.11 -->

Если regulator-min-microvolt и regulator-max-microvolt равны, регистрация автоматически задаёт напряжение и включает питание. regulator-boot-on либо regulator-always-on также включает питание: равные границы задают напряжение, разные сохраняют аппаратное напряжение включения PMIC.

<!-- cn PDF p.11 -->

4. RTC: для отключения, например в приставке, добавьте узел со status = "disabled". Для включения удалите весь узел RTC или задайте status = "okay".

<!-- cn PDF p.11 -->

5. Poweroff

<!-- cn PDF p.11 -->

```text
gpio_poweroff {
    compatible = "gpio-poweroff";
    gpios = <&gpio2 GPIO_D2 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

<!-- cn PDF p.11 -->

RK805 выключается при высоком pmic_sleep. Добавьте этот узел в корень; изменяемое gpios указывает pmic_sleep.

<!-- cn PDF p.11 -->

DTS ядра 4.4: I2C, основной узел, rtc, pwrkey, gpio и regulator.

<!-- cn PDF p.11 -->

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
    rk805: rk805@18 {
        compatible = "rockchip,rk805";
        status = "okay";
        reg = <0x18>;
        interrupt-parent = <&gpio2>;
        interrupts = <6 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l>;
        rockchip,system-power-controller;
        wakeup-source;
        gpio-controller;
        #gpio-cells = <2>;
        rtc {
            status = "disabled";
        };
        pwrkey {
            status = "disabled";
        };
        gpio {
            status = "okay";
        };
        regulators {
            compatible = "rk805-regulator";
            status = "okay";
            #address-cells = <1>;
            #size-cells = <0>;
            vdd_logic: RK805_DCDC1@0 {
                regulator-compatible = "RK805_DCDC1";
                regulator-name = "vdd_logic";
                regulator-init-microvolt = <1100000>;
                regulator-min-microvolt = <712500>;
                regulator-max-microvolt = <1450000>;
                regulator-initial-mode = <0x1>;
                regulator-ramp-delay = <12500>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };

            vdd_arm: RK805_DCDC2@1 {
                .................
            };
            vcc_ddr: RK805_DCDC3@2 {
                .................
            };
            .............................
        };
    };
};
```

<!-- cn PDF p.12 -->

1. Поместите весь rk805 под соответствующим I2C-узлом, задайте status = "okay".

<!-- cn PDF p.12 -->

2. Основной узел: следующее изменять нельзя.

<!-- cn PDF p.12 -->

```text
compatible = "rockchip,rk805";
reg = <0x18>;
rockchip,system-power-controller;
wakeup-source;
gpio-controller;
#gpio-cells = <2>;
```

<!-- cn PDF p.12 -->

Изменяемые поля по правилам pinctrl:

<!-- cn PDF p.13 -->

interrupt-parent: GPIO-контроллер pmic_int; interrupts: индекс вывода и полярность; pinctrl-names: фиксированное "default"; pinctrl-0: ссылка на pmic_int, определённый в pinctrl.

<!-- cn PDF p.13 -->

3. rtc, pwrkey, gpio: если выбраны в menuconfig, но не нужны, добавьте соответствующие DTS-узлы со status = "disabled". Драйверы не включатся; сообщения об ошибках загрузки можно игнорировать. Для включения удалите узел или задайте status = "okay".

<!-- cn PDF p.13 -->

4. Regulator:

- regulator-compatible: имя сопоставления при регистрации; не изменять, иначе загрузка не удастся.
- regulator-name: имя питания по схеме; используется regulator_get.
- regulator-init-microvolt: напряжение u-boot, в ядре не действует.
- regulator-min-microvolt / regulator-max-microvolt: рабочий минимум/максимум.
- regulator-initial-mode: рабочий DCDC-режим, обычно 1; 1 force pwm, 2 auto pwm/pfm.
- regulator-mode: режим сна, обычно 2; те же значения.
- regulator-initial-state: suspend, обязательно 3.
- regulator-boot-on: включение при регистрации.
- regulator-always-on: запрет отключения при работе, включение при регистрации.
- regulator-ramp-delay: время нарастания напряжения DCDC, фиксированное 12500.
- regulator-on-in-suspend: сохранить питание во сне; для отключения regulator-off-in-suspend.
- regulator-suspend-microvolt: напряжение ожидания при сохранении питания.

<!-- cn PDF p.13 -->

Ядро 4.19: DTS как для 4.4, но дочерний gpio больше не нужен. Другие модули по-прежнему ссылаются на выводы: gpios = <&rk805 0 GPIO_ACTIVE_LOW>;.

<!-- cn PDF p.13 -->

### 2.4 Программные интерфейсы

<!-- cn PDF p.13 -->

Следующие интерфейсы покрывают обычные операции: включение/отключение regulator, установку и чтение напряжения.

<!-- cn PDF p.13 -->

1. Получить regulator: `struct regulator *regulator_get(struct device *dev, const char *id)`. dev допускает NULL; id соответствует regulator-name в DTS.

<!-- cn PDF p.13 -->

2. Освободить regulator: `void regulator_put(struct regulator *regulator)`

<!-- cn PDF p.14 -->

3. Включить regulator: `int regulator_enable(struct regulator *regulator)`

<!-- cn PDF p.14 -->

4. Отключить regulator: `int regulator_disable(struct regulator *regulator)`

<!-- cn PDF p.14 -->

5. Прочитать напряжение: `int regulator_get_voltage(struct regulator *regulator)`

<!-- cn PDF p.14 -->

6. Задать напряжение: `int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)`. Вызывающий код обязан обеспечить min_uV = max_uV.

<!-- cn PDF p.14 -->

7. Пример

<!-- cn PDF p.14 -->

```text
struct regulator *rdev_logic;

rdev_logic = regulator_get(NULL, "vdd_logic");          // 获取vdd_logic
regulator_enable(rdev_logic);                           // 使能vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
regulator_disable(rdev_logic);                          // 关闭vdd_logic
regulator_put(rdev_logic);                              // 释放vdd_logic
```

<!-- cn PDF p.14 -->

Ядра 4.4 и 4.19 также предоставляют regulator-интерфейсы devm_ для управления ресурсами.

<!-- cn PDF p.14 -->

## 3. Отладка

<!-- cn PDF p.14 -->

### 3.1 Ядро 3.10

<!-- cn PDF p.14 -->

Логика PMIC-драйвера проста; важны итоговые регистры. Узел: /sys/rk816/rk816_test. Чтение: `echo r [addr] > /sys/rk816/rk816_test`. Запись: `echo w [addr] [value] > /sys/rk816/rk816_test`. Пример `echo r 0x2f > /sys/rk816/rk816_test` читает 0x2f, в примере 0x9b.

<!-- cn PDF p.14 -->

![Рисунок из китайского PDF — p.14](/docs/rockchip-rk805-pmic/assets/cn-p014-figure-01.png)

Расшифровка читаемого содержимого исходного изображения (пример источника; обрезанные неразборчивые фрагменты не восстанавливаются догадками):

```text
1|shell@rk3228h:/ # echo r 0x2f > /sys/rk816/rk816_test
[  283.091704]  [2:             sh:  618] ------zhangqing: get cmd = r
[  283.091766]  [2:             sh:  618] CMD : r 2f
[  283.091914]  [2:             sh:  618]
[  283.091914]  [2:             sh:  618] 2f 9b
```

*Рисунок из китайского PDF — p.14*

<!-- cn PDF p.14 -->

`echo w 0x2f 0x9c > /sys/rk816/rk816_test` записывает 0x9c в регистр 0x2f.

<!-- cn PDF p.15 -->

После записи рекомендуется повторное чтение для проверки результата.

<!-- cn PDF p.15 -->

![Рисунок из китайского PDF — p.15](/docs/rockchip-rk805-pmic/assets/cn-p015-figure-01.png)

Расшифровка читаемого содержимого исходного изображения (пример источника; обрезанные неразборчивые фрагменты не восстанавливаются догадками):

```text
1|shell@rk3228h:/ # echo r 0x2f > /sys/rk816/rk816_test
[  283.091704]  [2:             sh:  618] ------zhangqing: get cmd = r
[  283.091766]  [2:             sh:  618] CMD : r 2f
[  283.091914]  [2:             sh:  618]
[  283.091914]  [2:             sh:  618] 2f 9b
```

*Рисунок из китайского PDF — p.15*

<!-- cn PDF p.15 -->

### 3.2 Ядро 4.4

<!-- cn PDF p.15 -->

Синтаксис как в 3.10, но в 4.4 путь /sys/rk8xx/rk8xx_dbg.

<!-- cn PDF p.15 -->

### 3.3 Ядро 4.19

<!-- cn PDF p.15 -->

См. команды ядра 4.4.

Примечание: в исходной таблице напряжений стоит 0.737.5; возможная опечатка сохранена без догадок. Скриншоты регистров — примеры источника, не измерения ArmSoM.

{% endraw %}
