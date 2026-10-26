---
title: "Rockchip RK801 PMIC: питание, DTS и отладка регистров"
description: "Rockchip RK801 PMIC: питание, DTS и отладка регистров — V1.1.0"
excerpt: "Rockchip RK801 PMIC: питание, DTS и отладка регистров — V1.1.0"
translation_key: "117-rockchip-rk801-pmic"
slug: "117-rockchip-rk801-pmic"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK801", "PMIC", "Linux"]
---

{% raw %}

Справочник платформы: RK-KF-YF-C57 V1.1.0, RK801 / Linux 6.1. Рассматриваются модули, понятия, функции, DTS и диагностика. Проверьте PMIC, SoC, SDK/BSP, ядро, питание и разводку конкретной платы ArmSoM; совместимость всех плат не заявляется. Примеры аппаратно не проверялись на ArmSoM. Китайская версия использует китайские рисунки, EN/RU/DE — английские. Команды приведены, но не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- en PDF p.5 -->

## 1. Основы

<!-- en PDF p.5 -->

### 1.1 Обзор

<!-- en PDF p.5 -->

RK801 — высокопроизводительная PMIC с 4 сильноточными DCDC, 2 LDO, 1 SWITCH, 1 PWRON и регулируемой последовательностью включения. Источники питания системы делятся на DCDC и LDO. Их общие свойства приведены ниже; подробности следует изучать отдельно.

<!-- en PDF p.5 -->

1. DCDC: высокая эффективность при большой разности входного и выходного напряжений, но значительные пульсации и высокая стоимость; применяется при большой разности напряжений и большом токе нагрузки. Обычно имеются PWM (хорошая переходная характеристика пульсаций, низкая эффективность) и PFM (высокая эффективность, но ограниченная нагрузочная способность).

<!-- en PDF p.5 -->

2. LDO: при большой разности напряжений эффективность низкая, стоимость небольшая. Для повышения эффективности применяются схемные оптимизации: например, при выходе LDO 1.1V вход можно питать от DCDC VCCIO_3.3V. Если схема допускает, подключайте LDO к выходу DCDC, учитывая последовательность включения.

<!-- en PDF p.5 -->

### 1.2 Функции чипа

<!-- en PDF p.5 -->

С точки зрения пользователя RK801 имеет две группы функций:

<!-- en PDF p.5 -->

1. Regulator: управление питанием каждого DCDC и LDO.

<!-- en PDF p.5 -->

2. Pwrkey: обнаружение нажатия/отпускания кнопки питания, позволяющее сэкономить GPIO процессора AP.

<!-- en PDF p.6 -->

### 1.3 Выводы чипа

<!-- en PDF p.6 -->

![Английский оригинал — p.6](/docs/rockchip-rk801-pmic/assets/en-p006-figure-01.png)

*Английский оригинал — p.6*

<!-- en PDF p.6 -->

Особое внимание в следующем описании уделяется выводам PWRCTRL и INT.

<!-- en PDF p.7 -->

![Английский оригинал — p.7](/docs/rockchip-rk801-pmic/assets/en-p007-figure-01.png)

*Английский оригинал — p.7*

<!-- en PDF p.7 -->

![Английский оригинал — p.7](/docs/rockchip-rk801-pmic/assets/en-p007-figure-02.png)

*Английский оригинал — p.7*

<!-- en PDF p.7 -->

Определения выводов (построчная расшифровка рисунков выше; имена и I/O сохранены)

| № вывода | Имя вывода | Описание |
| --- | --- | --- |
| 1 | VCC4 | Питание BUCK4 |
| 2 | SCL | Тактовый вход I2C (выход с открытым стоком) |
| 3 | SDA | Вход/выход данных I2C (открытый сток) |
| 4 | RESETB | Вывод сброса после включения, активный низкий уровень |
| 5 | VCCA | Питание inner circuit |
| 6 | BST2 | Конденсатор bootstrap высоковольтного BUCK2 |
| 7 | INT | Запрос прерывания (открытый сток) |
| 8 | SW2 | Коммутационный узел high voltage BUCK2 |
| 9 | VCCH2 | Питание high voltage BUCK2 |
| 10 | VOUT2 | Напряжение обратной связи high voltage BUCK2 |
| 11 | PWRCTLR | Управляющий вход PWRCTLR |
| 12 | VOUT1 | Напряжение обратной связи high voltage BUCK1 |
| 13 | VCCH1 | Питание high voltage BUCK1 |
| 14 | SW1 | Коммутационный узел high voltage BUCK1 |
| 15 | BST1 | Конденсатор bootstrap высоковольтного BUCK1 |
| 16 | LDO2 | Выход LDO2 |
| 17 | VCC6 | Питание LDO2 |
| 18 | VCC5 | Питание LDO1 |
| 19 | LDO1 | Выход LDO1 |
| 20 | VDC | Вход VDC |
| 21 | VCC3 | Питание BUCK3 |
| 22 | SW3 | Коммутационный узел BUCK3 |
| 23 | VFB3 | Напряжение обратной связи BUCK3 |
| 24 | VSW | Выход SWITCH |
| 25 | PWRON | Вход кнопки включения, активный низкий уровень, внутренняя подтяжка 22k к VCCA |
| 26 | VCC7 | Питание SWITCH |
| 27 | VOUT4 | Напряжение обратной связи BUCK4 |
| 28 | SW4 | Коммутационный узел BUCK4 |
| Exposed pad | Exposed ground | Земля |

### 1.4 Важные понятия

<!-- en PDF p.7 -->

Адрес I2C: 7-битный адрес ведомого 0x27. PMIC имеет 3 режима работы.

<!-- en PDF p.7 -->

1. Нормальный режим PMIC. При нормальной работе системы PMIC находится в normal mode; pmic_pwrctrl имеет низкий уровень.

<!-- en PDF p.7 -->

2. Режим сна PMIC. Во сне требуется минимальное потребление; PMIC переходит в sleep mode для уменьшения собственного потребления. Обычно напряжение некоторых выходов снижается либо выходы отключаются согласно требованиям изделия. При переходе системы в ожидание

<!-- en PDF p.8 -->

AP через I2C настраивает pmic_pwrctrl для сна, затем устанавливает высокий уровень, переводя PMIC в сон. При пробуждении SoC pmic_pwrctrl возвращается к низкому уровню и PMIC выходит из сна.

<!-- en PDF p.8 -->

3. Режим выключения PMIC. При выключении системы PMIC должна отключить питание всей системы. AP через I2C назначает pmic_pwrctrl режим выключения и поднимает уровень вывода. Драйвер автоматически переключает эти режимы согласно DTS и сценарию; пользователю не требуется дополнительное управление.

- pmic_pwrctrl: обычно низкий уровень, нормальный режим; высокий уровень переводит в сон или выключение.
- pmic_int: обычно высокий уровень, при прерывании становится низким и остаётся таким до обработки.
- pmic_pwron: аппаратно подключается кнопка питания; драйвер определяет её нажатие/отпускание.
- Режимы DCDC: PWM (force PWM) и PFM. AUTO динамически переключает PWM/PFM. Поддерживаются PWM и AUTO PWM/PFM. AUTO эффективен, но имеет худшую переходную характеристику пульсаций. Для стабильности во время работы используется PWM; при засыпании — AUTO PWM/PFM.
- Напряжение DCDC3 не регулируется регистрами, только внешними резисторами делителя. Изменение требует аппаратной переделки. В решении Rockchip обычно это VCC_DDR.
- Диапазон регулировки напряжений DCDC и LDO: диапазон DCDC прерывистый, см. комментарии или datasheet.

<!-- en PDF p.8 -->

```text
// BUCK1
static const struct linear_range rk801_buck1_voltage_ranges[] = {
   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5V - 1.5V, step 12.5mV */
   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8V - 2.2V */
   REGULATOR_LINEAR_RANGE(3300000, 83, 83, 0), /* 3.3V */
   REGULATOR_LINEAR_RANGE(5000000, 84, 84, 0), /* 5.0V */
   REGULATOR_LINEAR_RANGE(5250000, 85, 85, 0), /* 5.25V */
};

// BUCK2
static const struct linear_range rk801_buck2_voltage_ranges[] = {
   REGULATOR_LINEAR_RANGE(800000,  0, 2, 50000),   /* 0.8V - 0.9V */
   REGULATOR_LINEAR_RANGE(1800000, 3, 4, 400000),  /* 1.8V - 2.2V */
   REGULATOR_LINEAR_RANGE(3300000, 5, 5, 0),   /* 3.3V */
   REGULATOR_LINEAR_RANGE(5000000, 6, 6, 0),   /* 5.0V */
   REGULATOR_LINEAR_RANGE(5250000, 7, 7, 0),   /* 5.25V */
};

// BUCK4
static const struct linear_range rk801_buck4_voltage_ranges[] = {
   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5V - 1.5V */
   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8V - 2.2V */
   REGULATOR_LINEAR_RANGE(2500000, 83, 83, 0), /* 2.5V */
   REGULATOR_LINEAR_RANGE(2800000, 84, 84, 0), /* 2.8V */
   REGULATOR_LINEAR_RANGE(3000000, 85, 85, 0), /* 3.0V */
   REGULATOR_LINEAR_RANGE(3300000, 86, 86, 0), /* 3.3V */
};
```

<!-- en PDF p.9 -->

Напряжение LDO регулируется непрерывно:

<!-- en PDF p.9 -->

| Диапазон напряжения(V) | Шаг(mV) |
| --- | --- |
| 0.5 ~ 3.4 | 50 |

<!-- en PDF p.9 -->

### 1.5 Условия и последовательность включения

<!-- en PDF p.9 -->

1. Условия включения: достаточно любого из условий — высокий уровень VDC либо нажатие PWRON в выключенном состоянии.

<!-- en PDF p.9 -->

2. Последовательность включения: требования разных платформ SoC к порядку включения источников могут отличаться. Доступные последовательности уточняйте по последнему datasheet.

<!-- en PDF p.9 -->

## 2. Настройка

<!-- en PDF p.9 -->

### 2.1 Драйвер и menuconfig

<!-- en PDF p.9 -->

Файлы драйвера:

<!-- en PDF p.9 -->

```text
drivers/mfd/rk808.c
drivers/regulator/rk801-regulator.c
drivers/input/misc/rk805-pwrkey.c
```

<!-- en PDF p.9 -->

Настройки menuconfig:

<!-- en PDF p.10 -->

```text
CONFIG_MFD_RK808
CONFIG_REGULATOR_RK801
CONFIG_INPUT_RK805_PWRKEY
```

<!-- en PDF p.10 -->

### 2.2 Версия драйвера

<!-- en PDF p.10 -->

Для полноты и стабильности функций обновите драйвер как минимум до следующей версии. drivers/mfd/rk808.c:

<!-- en PDF p.10 -->

```text
commit 0439f30ead1393813d69a01587530652908c9171
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Fri Jun 13 17:19:25 2025 +0800

    mfd: rk808: Print full chip id of rk801

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: I195858d23c862d0f961acb4c04bb1102ab9954c9
```

<!-- en PDF p.10 -->

drivers/regulator/rk801-regulator.c:

<!-- en PDF p.10 -->

```text
commit 1a81f4f6344f7cd4203be508150daeedc00fbedb
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Thu May 29 11:39:58 2025 +0800

    mfd: rk801: Add support for pwrctrl active pol set and reboot rst

    - Don't require pwrctrl dvs if hw compatible version >= 3.
    - Auto parse pwrctrl active pol from GPIO_ACTIVE_{HIGH,LOW} flag.
    - Reset pmic and soc when system reboot if required.

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: I29e60c2a717cee5c9d1e3c6e46ee687352d4a1be
```

<!-- en PDF p.10 -->

### 2.3 Настройка DTS

<!-- en PDF p.10 -->

DTS содержит подключение I2C, основной узел, regulator и другие части. Пример — arch/arm/boot/dts/rk3506-rk801.dts. Аппаратная схема:

<!-- en PDF p.11 -->

![Английский оригинал — p.11](/docs/rockchip-rk801-pmic/assets/en-p011-figure-01.png)

*Английский оригинал — p.11*

<!-- en PDF p.11 -->

Настройка DTS:

<!-- en PDF p.11 -->

```text
&i2c0 {
    status = "okay";
    ......

    rk801: rk801@27 {
        // Cannot be modified.
        compatible = "rockchip,rk801";
        status = "okay";
        reg = <0x27>;

        // PMIC_INT pin configuration. Here is GPIO0_C2, active low.
        interrupt-parent = <&gpio0>;
        interrupts = <RK_PC2 IRQ_TYPE_LEVEL_LOW>;

        // PWRCTRL pin configuration. Here is GPIO0_C1, active high.
        pwrctrl-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;

        // Pinctrl configuration.
        pinctrl-names = "default", "pmic-reset";
        // Initialize pmic_int pin state.
        pinctrl-0 = <&pmic_int>;
        // Set the state of pwrctrl when rebooting. After this configuration, PMIC will reset its various voltages together with the SoC.
        pinctrl-1 = <&soc_pwrctrl_reset>;

        // Cannot be modified. Declare that RK801 has the function of managing system power-down.
        rockchip,system-power-controller;

        // Cannot be modified. Declare PMIC_INT as a wake-up source.
        wakeup-source;

        // Input sources for each regulator.
        // vcc1~7 correspond to: BUCK1/2/3/4, LDO1/2, SWITCH.
        vcc1-supply = <&vcc12v_dc>;
        vcc2-supply = <&vcc12v_dc>;
        vcc3-supply = <&vcc5v0_sys>;
        vcc4-supply = <&vcc5v0_sys>;
        vcc5-supply = <&vcc3v3_sys>;
        vcc6-supply = <&vcc3v3_sys>;
        vcc7-supply = <&vcc3v3_sys>;
        regulators {
            vcc3v3_sys: DCDC_REG1 {
                regulator-name = "vcc3v3_sys";
                regulator-min-microvolt = <3300000>;
                regulator-max-microvolt = <3300000>;
                regulator-initial-mode = <0x1>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <3300000>;
                };
            };

            vcc5v0_sys: DCDC_REG2 {
                regulator-name = "vcc5v0_sys";
                regulator-min-microvolt = <5000000>;
                regulator-max-microvolt = <5000000>;
                regulator-initial-mode = <0x1>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <5000000>;
                };
            };

            vcc_ddr: DCDC_REG3 {
                regulator-name = "vcc_ddr";
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                };
            };

            vdd_cpu: DCDC_REG4 {
                regulator-name = "vdd_cpu";
                regulator-min-microvolt = <500000>;
                regulator-max-microvolt = <1500000>;
                regulator-initial-mode = <0x1>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-off-in-suspend;
                };
            };
            vdd0v9_sys: LDO_REG1 {
                regulator-name = "vdd0v9_sys";
                regulator-min-microvolt = <900000>;
                regulator-max-microvolt = <900000>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <900000>;
                };
            };

            vcc_1v8: LDO_REG2 {
                regulator-name = "vcc_1v8";
                regulator-min-microvolt = <1800000>;
                regulator-max-microvolt = <1800000>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1800000>;
                };
            };

            vcc_3v3: SWITCH_REG {
                regulator-name = "vcc_3v3";
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                };
            };
        };
    };
};

&pinctrl {
    ......

    pmic {
        // pmic_int is set to normally high level, that is, active low.
        pmic_int: pmic-int {
            rockchip,pins = <0 RK_PC2 RK_FUNC_GPIO &pcfg_pull_up>;
        };

        // The level state that the pwrctrl pin should maintain during system reset, must be opposite to the SoC's default power-on state.
        // For example: if the default power-on is down, configure as output high; otherwise, configure as output low.
        soc_pwrctrl_reset: soc-pwrctrl-reset {
            rockchip,pins = <0 RK_PC1 RK_FUNC_GPIO &pcfg_output_high>;
        };
    };
};
```

<!-- en PDF p.14 -->

Свойства regulator:

- regulator-compatible: имя для сопоставления при регистрации драйвера, изменять нельзя, иначе загрузка не удастся.
- regulator-name: имя питания; рекомендуется согласовать со схемой. Используется при regulator_get.
- regulator-init-microvolt: начальное напряжение u-boot, не действует в ядре.
- regulator-min-microvolt / regulator-max-microvolt: минимальное/максимальное регулируемое рабочее напряжение.
- regulator-initial-mode: режим DCDC при работе, обычно 1; 1 — force pwm, 2 — auto pwm/pfm.
- regulator-mode: режим DCDC во сне, обычно 2; те же значения 1/2.
- regulator-boot-on: наличие свойства включает питание при регистрации regulator.
- regulator-always-on: запрещает отключать питание при работе и включает его при регистрации.
- regulator-on-in-suspend: сохраняет питание во сне; для отключения заменить на regulator-off-in-suspend.
- regulator-suspend-microvolt: напряжение ожидания, если во сне питание не отключено.

Если regulator-min-microvolt и regulator-max-microvolt равны, системный framework при регистрации автоматически задаёт это напряжение и включает питание. При наличии regulator-boot-on либо regulator-always-on питание также автоматически включается. Если минимальное и максимальное напряжения равны, задаётся это напряжение; если различны — сохраняется аппаратное напряжение включения PMIC.

<!-- en PDF p.14 -->

Настройка pwrkey: отсутствие узла pwrkey внутри rk801 эквивалентно включению. Для отключения явно добавьте узел и задайте disabled.

<!-- en PDF p.14 -->

```text
rk801: rk801@27 {

    ......

    pwrkey {
        status = "disabled";
    };
};
```

<!-- en PDF p.15 -->

### 2.4 Программные интерфейсы

<!-- en PDF p.15 -->

Следующие интерфейсы покрывают обычные операции: включение/отключение regulator, установку и чтение напряжения.

<!-- en PDF p.15 -->

1. Получить regulator: `struct regulator *regulator_get(struct device *dev, const char *id)`. dev допускает NULL; id соответствует regulator-name в DTS.

<!-- en PDF p.15 -->

2. Освободить regulator: `void regulator_put(struct regulator *regulator)`

<!-- en PDF p.15 -->

3. Включить regulator: `int regulator_enable(struct regulator *regulator)`

<!-- en PDF p.15 -->

4. Отключить regulator: `int regulator_disable(struct regulator *regulator)`

<!-- en PDF p.15 -->

5. Прочитать напряжение: `int regulator_get_voltage(struct regulator *regulator)`

<!-- en PDF p.15 -->

6. Задать напряжение: `int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)`. Вызывающий код обязан обеспечить min_uV = max_uV.

<!-- en PDF p.15 -->

7. Пример

<!-- en PDF p.15 -->

```text
struct regulator *rdev_logic;

rdev_logic = regulator_get(NULL, "vdd_logic");          // Get vdd_logic
regulator_enable(rdev_logic);                           // Enable vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // Set voltage 1.1v
regulator_disable(rdev_logic);                          // Disable vdd_logic
regulator_put(rdev_logic);                              // Release vdd_logic
```

<!-- en PDF p.15 -->

Ядра 4.4 и новее также предоставляют regulator-интерфейсы с префиксом devm_ для управления запрашиваемыми ресурсами.

<!-- en PDF p.15 -->

## 3. Отладка

<!-- en PDF p.15 -->

Логика PMIC-драйверов относительно проста; основное внимание уделяется итоговым регистрам. Можно использовать встроенную команду i2cdump или следующий способ. Узел: /sys/rk8xx/rk8xx_dbg

<!-- en PDF p.16 -->

```text
# Read register
echo r [addr]  > /sys/rk8xx/rk8xx_dbg
# Write register
echo w [addr] [value] > /sys/rk8xx/rk8xx_dbg
```

<!-- en PDF p.16 -->

Пример использования:

<!-- en PDF p.16 -->

```text
echo r 0x2f > /sys/rk8xx/rk8xx_dbg          # Read the value of register 0x2f
echo w 0x2f 0x9c > /sys/rk8xx/rk8xx_dbg     # Set the value of register 0x2f to 0x9c
```

<!-- en PDF p.16 -->

После записи рекомендуется повторное чтение для проверки результата.

Примечание: в таблице PWRCTLR, в тексте PWRCTRL. Написание источника сохранено; перед адаптацией сверить документацию.

{% endraw %}
