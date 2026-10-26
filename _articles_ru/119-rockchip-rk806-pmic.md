---
title: "Rockchip RK806 PMIC: питание, DTS и отладка"
description: "Rockchip RK806 PMIC: питание, DTS и отладка — V1.0.0"
excerpt: "Rockchip RK806 PMIC: питание, DTS и отладка — V1.0.0"
translation_key: "119-rockchip-rk806-pmic"
slug: "119-rockchip-rk806-pmic"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK806", "PMIC", "Linux"]
---

{% raw %}

Источник RK-KF-YF-199 V1.0.0, RK806, Linux 5.10. Модули PMIC, понятия, функции, DTS и диагностика. Только справочник платформы: проверьте PMIC, SoC, SDK/BSP, ядро, питание и разводку платы ArmSoM. Аппаратная проверка не проводилась. Есть только китайский PDF; все четыре языка используют его исходные рисунки, включая имеющиеся английские подписи. Английского PDF в этой партии нет. Команды приведены, но не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- cn PDF p.4 -->

## 1. Основы

<!-- cn PDF p.4 -->

### 1.1 Обзор

<!-- cn PDF p.4 -->

RK806 интегрирует 10 сильноточных DCDC, 5 NLDO, 6 PLDO и регулируемый порядок включения. Источники системы делятся на DCDC и LDO со следующими свойствами (подробности изучайте отдельно).

<!-- cn PDF p.4 -->

1. DCDC: высокая эффективность при большой разности входного и выходного напряжений, но значительные пульсации и высокая стоимость; применяется при большой разности напряжений и большом токе нагрузки. Обычно имеются PWM (хорошая переходная характеристика пульсаций, низкая эффективность) и PFM (высокая эффективность, но ограниченная нагрузочная способность).

<!-- cn PDF p.4 -->

2. PLDO: как LDO прежних PMIC, вход от 2.0V до 5.5V.

<!-- cn PDF p.4 -->

3. NLDO: низкие входные/выходные напряжения и меньшие потери, например вход 1.1V, выход 0.9V.

<!-- cn PDF p.4 -->

### 1.2 Функции

<!-- cn PDF p.4 -->

Функции RK806 делятся на три группы:

<!-- cn PDF p.4 -->

1. Regulator: управление питанием каждого DCDC и LDO.

<!-- cn PDF p.4 -->

2. GPIO: три IO переводят всю PMIC в ожидание, управляют ожиданием назначенных источников отдельно либо работают обычными GPIO.

<!-- cn PDF p.4 -->

3. Pwrkey: обнаружение нажатия/отпускания кнопки питания, экономия GPIO AP.

<!-- cn PDF p.5 -->

### 1.3 Функции выводов

<!-- cn PDF p.5 -->

![Рисунок из китайского PDF — p.5](/docs/rockchip-rk806-pmic/assets/cn-p005-figure-01.png)

*Рисунок из китайского PDF — p.5*

<!-- cn PDF p.5 -->

Особенно важны выводы SLEEP и INT.

<!-- cn PDF p.6 -->

![Рисунок из китайского PDF — p.6](/docs/rockchip-rk806-pmic/assets/cn-p006-figure-01.png)

*Рисунок из китайского PDF — p.6*

<!-- cn PDF p.7 -->

![Рисунок из китайского PDF — p.7](/docs/rockchip-rk806-pmic/assets/cn-p007-figure-01.png)

*Рисунок из китайского PDF — p.7*

<!-- cn PDF p.7 -->

Определения выводов (построчная расшифровка рисунков выше; имена и I/O сохранены)

| № вывода | Имя вывода | Описание | I/O |
| --- | --- | --- | --- |
| 1 | VCC9 | Питание buck9 | I |
| 2 | SYNC | Сигнал синхронизации ведущего и ведомого | I/O |
| 3 | SYNC_CLK | Тактовая синхронизация 32k | I/O |
| 4 | PWRON | Кнопка включения, внутренняя подтяжка около 45K | I |
| 5 | VOUT8 | Напряжение обратной связи buck8 | O |
| 6 | SW8 | Коммутационный узел buck8 | O |
| 7 | VCC8 | Питание buck8 | I |
| 8 | NLDO5 | Выход NMOS LDO5 | O |
| 9 | VCC14 | Питание NLDO3/4/5 | I |
| 10 | NLDO4 | Выход NMOS LDO4 | O |
| 11 | NLDO3 | Выход NMOS LDO3 | O |
| 12 | NLDO2 | Выход NMOS LDO2 | O |
| 13 | VCC13 | Питание NLDO1/2 | I |
| 14 | NLDO1 | Выход NMOS LDO1 | O |
| 15 | MOSI/SCL | SPI MOSI, I2C SCL | I/O |
| 16 | MISO/SDA/PWRCRTL3 | SPI MISO, I2C SDA, управление PWRCRTL3 | I/O |
| 17 | CLK | SPI CLK | O |
| 18 | CS | Выбор I2C/SPI; подключение к VCCA выбирает I2C | I |
| 19 | INT | Прерывание | O |
| 20 | VCCIO/PLDO6 | Выход PMOS LDO6; VCCIO интерфейса SPI/I2C | O |
| 21 | VCCA | Аналоговое питание; питание PLDO6 и системной логики | I |
| 22 | VCC4 | Питание buck4 | I |
| 23 | SW4 | Коммутационный узел buck4 | O |
| 24 | VOUT4 | Напряжение обратной связи buck4 | O |
| 25 | VOUT10 | Напряжение обратной связи buck10 | O |
| 26 | SW10 | Коммутационный узел buck10 | O |
| 27 | VCC10 | Питание buck10 | I |
| 28 | VCC6 | Питание buck6 | I |
| 29 | SW6 | Коммутационный узел buck6 | O |
| 30 | VOUT6 | Напряжение обратной связи buck6 | O |
| 31 | FB6 | Обратная связь buck6 с внешним резистивным делителем | O |
| 32 | VDC | Сигнал включения VDC | I |
| 33 | VCC2 | Питание buck2 | I |
| 34 | VCC2 | Питание buck2 | I |
| 35 | SW2 | Коммутационный узел buck2 | O |
| 36 | SW2 | Коммутационный узел buck2 | O |
| 37 | VOUT2 | Напряжение обратной связи buck2 | O |
| 38 | FB2 | Обратная связь buck2 с внешним резистивным делителем | O |
| 39 | EXT_EN | Разрешение внешнего DCDC; выбор Master/Slave | I |
| 40 | RESETB | Сброс AP | I/O |
| 41 | VOUT7 | Напряжение обратной связи buck7 | O |
| 42 | SW7 | Коммутационный узел buck7 | O |
| 43 | VCC7 | Питание buck7 | I |
| 44 | VCC5 | Питание buck5 | I |
| 45 | SW5 | Коммутационный узел buck5 | O |
| 46 | VOUT5 | Напряжение обратной связи buck5 | O |
| 47 | FB5 | Обратная связь buck5 с внешним резистивным делителем | O |
| 48 | FB1 | Обратная связь buck1 с внешним резистивным делителем | O |
| 49 | VOUT1 | Напряжение обратной связи buck1 | O |
| 50 | SW1 | Коммутационный узел buck1 | O |
| 51 | SW1 | Коммутационный узел buck1 | O |
| 52 | VCC1 | Питание buck1 | I |
| 53 | VCC1 | Питание buck1 | I |
| 54 | VCC3 | Питание buck3 | I |
| 55 | SW3 | Коммутационный узел buck3 | O |
| 56 | VOUT3 | Напряжение обратной связи buck3 | O |
| 57 | PLDO3 | Выход PMOS LDO3 | O |
| 58 | PLDO2 | Выход PMOS LDO2 | O |
| 59 | VCC11 | Питание PLDO1/2/3 | I |
| 60 | PLDO1 | Выход PMOS LDO1 | O |
| 61 | PWRCRTL2 | Управление PWRCRTL2 | I/O |
| 62 | PWRCRTL1 | Управление PWRCRTL1 | I/O |
| 63 | PLDO4 | Выход PMOS LDO4 | O |
| 64 | VCC12 | Питание PLDO4/5 | I |
| 65 | PLDO5 | Выход PMOS LDO5 | O |
| 66 | FB9 | Обратная связь buck9 с внешним резистивным делителем | O |
| 67 | VOUT9 | Напряжение обратной связи buck9 | O |
| 68 | SW9 | Коммутационный узел buck9 | O |
| Exposed | ePAD | Земля |  |

### 1.4 Важные понятия

<!-- cn PDF p.7 -->

Чип поддерживает SPI и I2C. Описанное ПО поддерживает только SPI, частота по умолчанию 1M. PMIC имеет три режима.

<!-- cn PDF p.7 -->

1. Нормальный режим: активный уровень pmic_sleep настраивается.

<!-- cn PDF p.8 -->

2. Сон: снизить потребление, уменьшив напряжения либо отключив выбранные источники согласно изделию. AP через SPI настраивает pmic_sleep для сна и повышает уровень; при пробуждении SoC уровень снижается и PMIC выходит из сна.

<!-- cn PDF p.8 -->

3. Выключение: AP через SPI настраивает pmic_sleep и повышает уровень для отключения системы.

- int: обычно высокий, при IRQ низкий до обработки.
- pwrcrtl1/pwrcrtl2/pwrcrtl3: обычные GPIO. Источник пишет «эти два вывода», перечислив три; расхождение требует проверки.
- pwron: кнопка питания для обнаружения нажатия/отпускания.
- DCDC: PWM (force PWM), PFM и AUTO. AUTO эффективен, но хуже по переходным пульсациям. Для стабильности при работе PWM, во сне AUTO PWM/PFM.
- PLDO6: питание VCCIO PMIC/AP. При использовании этих IO питание обязательно, не менее 1.8V; поэтому PLDO6 обычно нельзя снижать ниже 1.8V или отключать в ожидании.
- Далее рабочие диапазоны DCDC/LDO.

<!-- cn PDF p.8 -->

1. Диапазон DCDC прерывистый:

<!-- cn PDF p.8 -->

| Диапазон(V) | Шаг(mV) | Значения(V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 6.25 | 0.5、0.50625、 ...... 1.5 |
| 1.5~ 3.4 | 25 | 1.5、1.525、...... 3.4 |

<!-- cn PDF p.8 -->

2. Диапазон NLDO/PLDO непрерывный:

<!-- cn PDF p.8 -->

| Диапазон(V) | Шаг(mV) | Значения(V) |
| --- | --- | --- |
| 0.5 ~ 3.4 | 12.5 | 0.5125、0.525、...... 3.4 |

<!-- cn PDF p.8 -->

### 1.5 Совместная работа двух PMIC

<!-- cn PDF p.8 -->

Роль задаётся EXT_EN при первом включении: соединён с VCCA — Slave; плавает либо подтянут вниз — Master. У двух RK806 соединяют SYNC_CLK и SYNC. Master выдаёт SYNC_CLK около 32K, Slave принимает. Импульсы SYNC синхронизируют включение, выключение, сброс и порядок питания.

<!-- cn PDF p.9 -->

Соедините PWRON обоих чипов и RESETB обоих чипов для включения и внешней кнопки сброса. VDC можно соединить вместе либо подключить VDC Slave к EXT_EN Master.

<!-- cn PDF p.9 -->

## 2. Настройка

<!-- cn PDF p.9 -->

### 2.1 Драйвер и menuconfig

<!-- cn PDF p.9 -->

Файлы драйвера RK806:

<!-- cn PDF p.9 -->

```text
drivers/mfd/rk806-core.c
drivers/mfd/rk806-spi.c
drivers/pinctrl/pinctrl-rk806.c
drivers/regulator/rk806-regulator.c
```

<!-- cn PDF p.9 -->

Настройки menuconfig:

<!-- cn PDF p.9 -->

```text
CONFIG_PINCTRL_RK806=y
CONFIG_MFD_RK806_SPI=y
CONFIG_REGULATOR_RK806=y
```

<!-- cn PDF p.9 -->

### 2.2 Настройка DTS

<!-- cn PDF p.9 -->

DTS ядра 5.10 содержит SPI, GPIO и regulator. DTS для одного RK806:

<!-- cn PDF p.9 -->

```text
&pinctrl {
         pmic {
                soc_slppin_gpio: soc_slppin_gpio {
                        rockchip,pins = <0 RK_PA2
                                RK_FUNC_GPIO &pcfg_output_low>;
                };
                soc_slppin_shutdown: soc_slppin_shutdown {
                        rockchip,pins = <0 RK_PA2
                                RK_FUNC_GPIO &pcfg_output_high>;
                };
        };
};

&spi2 {
        status = "okay";
        assigned-clocks = <&cru CLK_SPI2>;
        assigned-clock-rates = <200000000>;
        num-cs = <&spi2 {
        status = "okay";
        assigned-clocks = <&cru CLK_SPI2>;
        assigned-clock-rates = <200000000>;
        num-cs = <2>;

        rk806single@0 {
                compatible = "rockchip,rk806";
                spi-max-frequency = <1000000>;
                reg = <0x0>;

                interrupt-parent = <&gpio0>;
                interrupts = <7 IRQ_TYPE_LEVEL_LOW>;

                pinctrl-names = "default", "pmic-sleep", "pmic-power-off", "pmic-reset";
                pinctrl-0 = <&soc_slppin_gpio>, <&rk806_dvs1_null>, <&rk806_dvs2_null>, <&rk806_dvs3_null>;
                pinctrl-1 = <&soc_slppin_gpio>, <&rk806_dvs1_slp>, <&rk806_dvs2_null>, <&rk806_dvs3_null>;
                pinctrl-2 = <&rk806_dvs1_pwrdn>, <&rk806_dvs2_null>, <&rk806_dvs3_null>;
                pinctrl-3 = <&rk806_dvs1_rst>, <&rk806_dvs2_null>, <&rk806_dvs3_null>;

                /* 2800mv-3500mv */
                low_voltage_threshold = <3000>;
                /* 2700mv-3400mv */
                shutdown_voltage_threshold = <2700>;
                /* 140 160 */
                shutdown_temperture_threshold = <160>;
                hotdie_temperture_threshold = <115>;

                /* 0: restart PMU;
                 * 1: reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode;
                 * 2: Reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode,
                 *    and simultaneously pull down the RESETB PIN for 5mS before releasing
                 */
                pmic-reset-func = <1>;

                vcc1-supply = <&vcc5v0_sys>;
                vcc2-supply = <&vcc5v0_sys>;
                vcc3-supply = <&vcc5v0_sys>;
                vcc4-supply = <&vcc5v0_sys>;
                vcc5-supply = <&vcc5v0_sys>;
                vcc6-supply = <&vcc5v0_sys>;
                vcc7-supply = <&vcc5v0_sys>;
                vcc8-supply = <&vcc5v0_sys>;
                vcc9-supply = <&vcc5v0_sys>;
                vcc10-supply = <&vcc5v0_sys>;
                vcc11-supply = <&vcc_2v0_pldo_s3>;
                vcc12-supply = <&vcc5v0_sys>;
                vcc13-supply = <&vcc_1v1_nldo_s3>;
                vcc14-supply = <&vcc_1v1_nldo_s3>;
                vcca-supply = <&vcc5v0_sys>;2>;

                regulators {
                        vdd_gpu_s0: vdd_gpu_mem_s0: DCDC_REG1 {
                                regulator-always-on;
                                regulator-boot-on;
                                regulator-min-microvolt = <550000>;
                                regulator-max-microvolt = <950000>;
                                regulator-ramp-delay = <12500>;
                                regulator-name = "vdd_gpu_s0";
                                regulator-state-mem {
                                        regulator-off-in-suspend;
                                };
                        };

                        vdd_cpu_lit_s0: vdd_cpu_lit_mem_s0: DCDC_REG2 {
                                regulator-always-on;
                                regulator-boot-on;
                                regulator-min-microvolt = <550000>;
                                regulator-max-microvolt = <950000>;
                                regulator-ramp-delay = <12500>;
                                regulator-name = "vdd_cpu_lit_s0";
                                regulator-state-mem {
                                        regulator-off-in-suspend;
                                };
                        };

                        vdd_log_s0: DCDC_REG3 {
                            .................
                        };

                        vdd_vdenc_s0: vdd_vdenc_mem_s0: DCDC_REG4 {
                            .................
                       };
                       .............................
               };
        };
};
```

<!-- cn PDF p.11 -->

DTS для двух RK806:

<!-- cn PDF p.11 -->

```text
&pinctrl {
    pmic {
            soc_slppin_gpio: soc_slppin_gpio {
                    rockchip,pins = <0 RK_PA2
                            RK_FUNC_GPIO &pcfg_output_low>;
            };
            soc_slppin_shutdown: soc_slppin_shutdown {
                    rockchip,pins = <0 RK_PA2
                            RK_FUNC_GPIO &pcfg_output_high>;
            };
    };
};

&spi2 {
        status = "okay";
        assigned-clocks = <&cru CLK_SPI2>;
        assigned-clock-rates = <200000000>;
        num-cs = <2>;
        rk806master@0 {
                compatible = "rockchip,rk806";
                spi-max-frequency = <1000000>;
                reg = <0x0>;

                interrupt-parent = <&gpio0>;
                interrupts = <7 IRQ_TYPE_LEVEL_LOW>;
                /* 0: restart PMU;
                 * 1: reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode;
                 * 2: Reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode,
                 *    and simultaneously pull down the RESETB PIN for 5mS before releasing
                 */
                pmic-reset-func = <1>;

                vcc1-supply = <&vcc5v0_sys>;
                vcc2-supply = <&vcc5v0_sys>;
                .................
                vcca-supply = <&vcc5v0_sys>;
                regulators {
                        vdd_gpu_s0: DCDC_REG1 {
                                regulator-always-on;
                                regulator-boot-on;
                                regulator-min-microvolt = <550000>;
                                regulator-max-microvolt = <950000>;
                                regulator-ramp-delay = <12500>;
                                regulator-name = "vdd_gpu_s0";
                                regulator-state-mem {
                                        regulator-off-in-suspend;
                                };
                      };
                        vdd_npu_s0: DCDC_REG2 {
                        .................
                        }；
                        .................
              };
       };
       rk806slave@1 {
                compatible = "rockchip,rk806";
                spi-max-frequency = <1000000>;
                reg = <0x01>;

                interrupt-parent = <&gpio0>;
                interrupts = <7 IRQ_TYPE_LEVEL_LOW>;
                /* 0: restart PMU;
                 * 1: reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode;
                 * 2: Reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode,
                 *    and simultaneously pull down the RESETB PIN for 5mS before releasing
               */
                pmic-reset-func = <1>;

                vcc1-supply = <&vcc5v0_sys>;
                vcc2-supply = <&vcc5v0_sys>;
                .................
                vcca-supply = <&vcc5v0_sys>;

                pwrkey {
                        status = "disabled";
                };
                regulators {
                        vdd_cpu_big1_s0: DCDC_REG1 {
                                regulator-always-on;
                                regulator-boot-on;
                                regulator-min-microvolt = <550000>;
                                regulator-max-microvolt = <950000>;
                                regulator-ramp-delay = <12500>;
                                regulator-name = "vdd_cpu_big1_s0";
                                regulator-state-mem {
                                        regulator-off-in-suspend;
                                };
                        };
                        vdd_cpu_big0_s0: DCDC_REG2 {
                        .................
                        };
                        .................
                };
       };
};
```

<!-- cn PDF p.13 -->

1. Поместите полный rk806 под SPI-узлом, задайте status = "okay".

<!-- cn PDF p.13 -->

2. Основной узел: следующее изменять нельзя.

<!-- cn PDF p.13 -->

```text
compatible = "rockchip,rk806";
spi-max-frequency = <1000000>;
reg = <0x0>;

interrupt-parent = <&gpio0>;
interrupts = <7 IRQ_TYPE_LEVEL_LOW>;
```

<!-- cn PDF p.13 -->

Изменяемые поля по pinctrl: interrupt-parent — GPIO-контроллер pmic_int; interrupts — индекс вывода и полярность.

<!-- cn PDF p.13 -->

3. pwrkey/gpio: если не нужны, добавьте DTS-узлы со status = "disabled". Драйверы не включатся; ошибки загрузки можно игнорировать.

<!-- cn PDF p.14 -->

```text
pwrkey {
        status = "disabled";
};
```

<!-- cn PDF p.14 -->

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

<!-- cn PDF p.14 -->

Ядро 5.10: см. настройку DTS 5.10 выше.

<!-- cn PDF p.14 -->

### 2.4 Программные интерфейсы

<!-- cn PDF p.14 -->

Следующие интерфейсы покрывают обычные операции: включение/отключение regulator, установку и чтение напряжения.

<!-- cn PDF p.14 -->

1. Получить regulator: `struct regulator *devm_regulator_get_optional(struct device *dev, const char *id)`. dev — текущее устройство, id соответствует DTS-свойству -supply.

<!-- cn PDF p.14 -->

2. Освободить regulator: `void regulator_put(struct regulator *regulator)`

<!-- cn PDF p.14 -->

3. Включить regulator: `int regulator_enable(struct regulator *regulator)`

<!-- cn PDF p.14 -->

4. Отключить regulator: `int regulator_disable(struct regulator *regulator)`

<!-- cn PDF p.14 -->

5. Прочитать напряжение regulator

<!-- cn PDF p.15 -->

`int regulator_get_voltage(struct regulator *regulator)`

<!-- cn PDF p.15 -->

6. Задать напряжение: `int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)`. Вызывающий код обеспечивает min_uV <= max_uV.

<!-- cn PDF p.15 -->

7. Пример

<!-- cn PDF p.15 -->

```text
struct regulator *vdd_ana;

vdd_ana = devm_regulator_get_optional(dev, "power");
/* 从dts获取power-supply
   power-supply = <&vcc3v3_lcd0_n> */
regulator_enable(vdd_ana);
regulator_disable(vdd_ana);                         // 关闭vdd_ana
regulator_put(vdd_ana);                             // 释放vdd_ana
```

<!-- cn PDF p.15 -->

## 3. Отладка

<!-- cn PDF p.15 -->

### 3.1 Ядро

<!-- cn PDF p.15 -->

Логика PMIC-драйвера проста; важны итоговые регистры. Узел отладки: /sys/kernel/debug/regulator.

<!-- cn PDF p.15 -->

![Рисунок из китайского PDF — p.15](/docs/rockchip-rk806-pmic/assets/cn-p015-figure-01.png)

Расшифровка читаемого содержимого исходного изображения (пример источника; обрезанные неразборчивые фрагменты не восстанавливаются догадками):

```text
console:/ # ls /sys/kernel/debug/regulator/
avcc_1v8_codec_s0         vcc5v0_sys             vdd_0v75_s3
avcc_1v8_s0               vcc5v0_usb             vdd_0v85_s0
avdd1v8_ddr_pll_s0        vcc5v0_usbdcin         vdd_1v8_pll_s0
avdd_0v75_s0              vcc_1v1_nldo_s3        vdd_2v0_pldo_s3
avdd_0v85_s0              vcc_1v8_cam_s0         vdd_cpu_big0_mem_s0
avdd_1v2_cam_s0           vcc_1v8_s0             vdd_cpu_big0_s0
avdd_1v2_s0               vcc_2v8_cam_s0         vdd_cpu_big1_mem_s0
pcie20_avdd0v85           vcc_3v3_s0             vdd_cpu_big1_s0
pcie20_avdd1v8            vcc_3v3_s3             vdd_cpu_lit_mem_s0
pcie30_avdd0v75           vcc_3v3_sd_s0          vdd_cpu_lit_s0
pcie30_avdd1v8            vcc_mipicsi0           vdd_ddr_pll_s0
pldo6_s3                  vcc_mipicsi1           vdd_ddr_s0
reg-dummy-regulator-dummy vcc_mipidcphy0         vdd_gpu_mem_s0
regulator_summary        vccio_1v8_s3           vdd_gpu_s0
supply_map               vccio_sd_s0            vdd_log_s0
vbus5v0_typec             vdd1_1v8_ddr_s3        vdd_npu_mem_s0
vcc12v_dcin               vdd2_ddr_s3            vdd_npu_s0
vcc3v3_lcd0_n             vdd21_0v9_ddr_s3       vdd_vdenc_mem_s0
vcc3v3_pcie30             vdd_0v75_hdmi_edp_s0   vdd_vdenc_s0
vcc5v0_host               vdd_0v75_pll_s0        vddq_ddr_s0
```

*Рисунок из китайского PDF — p.15*

<!-- cn PDF p.15 -->

/sys/kernel/debug/regulator/regulator_summary

<!-- cn PDF p.16 -->

![Рисунок из китайского PDF — p.16](/docs/rockchip-rk806-pmic/assets/cn-p016-figure-01.png)

Расшифровка читаемого содержимого исходного изображения (пример источника; обрезанные неразборчивые фрагменты не восстанавливаются догадками):

```text
 regulator                    use open bypass opmode  voltage current min max
 regulator-dummy                5 5 0 unknown 0mV 0mA 0mV 0mV
    fe210000.sata-target         1                 0mA 0mV 0mV
    fe210000.sata-phy            1                 0mA 0mV 0mV
    fe210000.sata-ahci           1                 0mA 0mV 0mV
    backlight-power             1                 0mA 0mV 0mV
    regulator-dummy             0                 0mA 0mV 0mV
 vcc12v_dcin                    3 4 0 unknown 12000mV 0mA 12000mV 12000mV
    vcc12v_dcin                  0                 0mA 0mV 0mV
    vcc5v0_sys                  30 30 0 unknown 5000mV 0mA 5000mV 5000mV
       vcc5v0_sys                0                 0mA 0mV 0mV
       vdd_gpu_s0                1 3 0 normal 750mV 0mA 550mV 950mV
          fb000000.gpu-mali      0                 0mA 750mV 950mV
          fb000000.gpu-mali      0                 0mA 0mV 0mV
          vdd_gpu_s0             0                 0mA 0mV 0mV
       vdd_npu_s0                1 1 0 normal 750mV 0mA 550mV 950mV
          vdd_npu_s0             0                 0mA 0mV 0mV
       vdd_log_s0                1 1 0 normal 750mV 0mA 750mV 750mV
          vdd_log_s0             0                 0mA 0mV 0mV
       vdd_vdenc_s0              1 1 0 normal 750mV 0mA 550mV 950mV
          vdd_vdenc_s0           0                 0mA 0mV 0mV
       vdd_gpu_mem_s0            1 3 0 normal 750mV 0mA 675mV 950mV
          fb000000.gpu-mem       0                 0mA 750mV 950mV
          fb000000.gpu-mem       0                 0mA 0mV 0mV
          vdd_gpu_mem_s0         0                 0mA 0mV 0mV
       vdd_npu_mem_s0            1 1 0 normal 750mV 0mA 675mV 950mV
          vdd_npu_mem_s0         0                 0mA 0mV 0mV
       vdd_2v0_pldo_s3           9 9 0 normal 2000mV 0mA 2000mV 2000mV
          vdd_2v0_pldo_s3        0                 0mA 0mV 0mV
          avcc_1v8_s0            1 3 0 unknown 1800mV 0mA 1800mV 1800mV
             avcc_1v8_s0         0                 0mA 0mV 0mV
             pcie20_avdd1v8      0 1 0 unknown 1800mV 0mA 1800mV 1800mV
                pcie20_avdd1v8   0                 0mA 0mV 0mV
             pcie30_avdd1v8      0 1 0 unknown 1800mV 0mA 1800mV 1800mV
                pcie30_avdd1v8   0                 0mA 0mV 0mV
          vdd1_1v8_ddr_s3        1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             vdd1_1v8_ddr_s3     0                 0mA 0mV 0mV
          avcc_1v8_codec_s0      1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             avcc_1v8_codec_s0   0                 0mA 0mV 0mV
          avdd_1v2_cam_s0        1 1 0 unknown 1200mV 0mA 1200mV 1200mV
             avdd_1v2_cam_s0     0                 0mA 0mV 0mV
          avdd_1v2_s0            1 1 0 unknown 1200mV 0mA 1200mV 1200mV
             avdd_1v2_s0         0                 0mA 0mV 0mV
          vcc_1v8_cam_s0         1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             vcc_1v8_cam_s0      0                 0mA 0mV 0mV
          avdd1v8_ddr_pll_s0     1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             avdd1v8_ddr_pll_s0  0                 0mA 0mV 0mV
          vdd_1v8_pll_s0         1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             vdd_1v8_pll_s0      0                 0mA 0mV 0mV
       vdd_vdenc_mem_s0          1 1 0 normal 750mV 0mA 675mV 950mV
          vdd_vdenc_mem_s0       0                 0mA 0mV 0mV
       vdd2_ddr_s3               1 1 0 normal 1100mV 0mA 0mV 0mV
          vdd2_ddr_s3            0                 0mA 0mV 0mV
       vcc_1v1_nldo_s3           6 6 0 normal 1100mV 0mA 1100mV 1100mV
          vcc_1v1_nldo_s3        0                 0mA 0mV 0mV
       avdd_0v75_s0              1 2 0 unknown 750mV 0mA 750mV 750mV
```

*Рисунок из китайского PDF — p.16*

<!-- cn PDF p.16 -->

Свойства и напряжения каждого источника можно найти через следующий узел:

<!-- cn PDF p.16 -->

![Рисунок из китайского PDF — p.16](/docs/rockchip-rk806-pmic/assets/cn-p016-figure-02.png)

Расшифровка читаемого содержимого исходного изображения (пример источника; обрезанные неразборчивые фрагменты не восстанавливаются догадками):

```text
console:/sys/kernel/debug/regulator/vdd_gpu_mem_s0 # ls
bypass_count  fb000000.gpu-mem  mode        vdd_gpu_mem_s0
consumers     force_disable   open_count  voltage
enable        load            use_count
```

*Рисунок из китайского PDF — p.16*

<!-- cn PDF p.16 -->

### 3.2 Ядро 5.10

<!-- cn PDF p.16 -->

См. команды ядра 5.10.

Примечание: диапазон BUCK указан 0.7125–1.45, значения 0.5–1.5; диапазон NLDO начинается с 0.5, первое значение — 0.5125. Упомянуты три PWRCTRL, но также сказано «два». Таблица использует PWRCRTL, SPI CLK помечен O. Расхождения сохранены; требуется проверка перед адаптацией.

Оговорка к исходному DTS: страница 9 заканчивается `num-cs = <&spi2 {`, далее свойства SPI повторяются; на странице 12 также есть полноширинная точка с запятой. Это не готовый к компиляции полный DTS. Ошибки источника сохранены; сверить с исходниками соответствующего BSP. Заголовок 3.1 в оригинале — только «Ядро», без версии.

{% endraw %}
