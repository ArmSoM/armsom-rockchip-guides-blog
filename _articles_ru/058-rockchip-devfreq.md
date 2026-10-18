---
title: "Полное руководство Rockchip Devfreq: GPU, DDR и BUS DVFS"
description: "Полная настройка Devfreq для GPU, DDR и BUS Rockchip: регуляторы, OPP/PVTM, IR-Drop, низкие температуры и изменение частоты по сценарию, нагрузке и VOP. Команды и различия исходных версий сохранены."
translation_key: "058-rockchip-devfreq"
slug: "058-rockchip-devfreq"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: ["Rockchip", "Devfreq", "DVFS", "OPP", "PVTM", "Linux"]
keywords: "ArmSoM Rockchip Devfreq DVFS OPP PVTM Linux"
excerpt: "Полная настройка Devfreq для GPU, DDR и BUS Rockchip: регуляторы, OPP/PVTM, IR-Drop, низкие температуры и изменение частоты по сценарию, нагрузке и VOP. Команды и различия исходных версий сохранены."
---

{% raw %}

# Полное руководство Rockchip Devfreq: GPU, DDR и BUS DVFS

Это справочное руководство Rockchip Devfreq, а не инструкция, проверенная на оборудовании ArmSoM. Таблица версий оригинала указывает все микросхемы и Linux 4.4 / 4.19; это не подтверждает поддержку каждой платы ArmSoM или современного BSP. Перед адаптацией проверьте SoC, схему питания платы и PMIC/регулятор, дерево тактирования, таблицу OPP, поддержку eFuse/OTP/PVTM и драйверы SDK/BSP/ядра. Не переносите частоты, напряжения или настройки регистров без проверки. Журналы, результаты испытаний и пределы частот принадлежат исходнику, а не испытаниям ArmSoM. Команды изменения частот и напряжений не выполнялись. Китайский оригинал — V1.1.1 (26 страниц), английский — V1.0.0 (30 страниц). Структура глав совпадает, но обозначения версий и отдельные пояснения различаются; полные тексты сохранены без утверждения, что это одна версия. Китайская статья использует рисунок китайского оригинала; английская и русская — английского. Русская статья полностью переводит английский технический текст; комментарии кода сохранены на языке оригинала.

| Микросхемы по оригиналу | Версия ядра |
| --- | --- |
| Все микросхемы (формулировка оригинала; требуется проверка платы) | Linux 4.4 / Linux 4.19 |

[Редакционные замечания](/docs/rockchip-devfreq/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Введение

Devfreq — подсистема ядра для динамического изменения частоты и напряжения согласно выбранному governor. Она снижает энергопотребление с учётом производительности. Devfreq подобна CPUFreq, но CPUFreq предназначена только для CPU, тогда как Devfreq обслуживает остальные модули, которым требуется динамическое изменение частоты. Подсистема состоит из governor, core, driver и event. Программная архитектура показана ниже:

![Архитектура: рисунок английского оригинала, PDF p. 5](/docs/rockchip-devfreq/assets/en-p5-1.png)

Devfreq governor определяет момент изменения частоты и целевую частоту. Ядро включает следующие governor:

- simple ondemand: динамически изменяет частоту в зависимости от загрузки.

- userspace: предоставляет пользовательским приложениям интерфейс изменения частоты.

- powersave: отдаёт приоритет энергопотреблению и постоянно устанавливает минимальную частоту.

- performance: отдаёт приоритет производительности и постоянно устанавливает максимальную частоту.

- dmc ondemand: основан на simple ondemand и поддерживает изменение частоты по сценарию и пропускной способности VOP; предназначен специально для изменения частоты DDR.

Devfreq core инкапсулирует и абстрагирует governor и драйверы devfreq, определяя чёткий интерфейс.

Devfreq driver инициализирует таблицу частот и устанавливает целевую частоту.

Devfreq event отслеживает загрузку устройства.

## 2. Пути исходного кода

Код governor:

```text
drivers/devfreq/governor_simpleondemand.c /* simple ondemand governor */
drivers/devfreq/governor_performance.c /* performance governor */

drivers/devfreq/governor_powersave.c /* powersave governor */
drivers/devfreq/governor_userspace.c /* userspace governor */
drivers/devfreq/rockchip_dmc.c     /* dmc ondemand governor */
```

Код event:

```text
drivers/devfreq/devfreq-event.c
drivers/devfreq/event/rockchip-dfi.c /* monitor DDR read and write cycles */
drivers/devfreq/event/rockchip-nocp.c /* monitor bytes accessed by each module */
```

Код core:

```text
drivers/devfreq/devfreq.c
```

Код driver:

```text
drivers/devfreq/rockchip_dmc.c                  /* DMC driver
*/

drivers/gpu/arm/midgard/backend/gpu/mali_kbase_devfreq.c /* GPU driver
*/
drivers/gpu/arm/bifrost_for_linux/backend/gpu/mali_kbase_devfreq.c /* GPU driver
*/
drivers/gpu/arm/bifrost/backend/gpu/mali_kbase_devfreq.c /* GPU driver
*/
drivers/gpu/arm/mali400/mali/linux/mali_devfreq.c /* GPU driver
*/
drivers/devfreq/rockchip_bus.c                  /* bus driver
*/
drivers/soc/rockchip/rockchip_opp_select.c    /* interface for
opp */
```

## 3. Настройка Menuconfig

```text
Device Drivers --->
   [*] Generic Dynamic Voltage and Frequency Scaling (DVFS) support --->
      --- Generic Dynamic Voltage and Frequency Scaling (DVFS) support

         *** DEVFREQ Governors *** /* devfreq governor */
      -*- Simple Ondemand
<*> Performance
<*> Powersave
   *** DEVFREQ Drivers ***

<*> ARM ROCKCHIP BUS DEVFREQ Driver /* bus devfreq driver */
<*> ARM ROCKCHIP DMC DEVFREQ Driver /* dmc devfreq driver */
[*] DEVFREQ-Event device Support --->
   --- DEVFREQ-Event device Support
   -*- ROCKCHIP DFI DEVFREQ event Driver /* dfi event driver */
   /* nocp event driver */
   <*> ROCKCHIP NoC (Network On Chip) Probe DEVFREQ event Driver
```

Изменяйте конфигурацию разных платформ согласно фактическим условиям.

## 4. Настройка дерева устройств

### 4.1 Настройка GPU DVFS

#### 4.1.1 Настройка тактирования

Согласно платформе добавьте свойства тактирования и clock-names в узел GPU, обычно в DTSI. В пояснении исходника написано clock, а в коде — clocks. Подробности приведены в документации Rockchip по тактированию. Пример для RK3399:

```text
gpu: gpu@ff9a0000 {
   compatible = "arm,malit860",

            "arm,malit86x",
            "arm,malit8xx",
            "arm,mali-midgard";
   ...
   clocks = <&cru ACLK_GPU>;
   clock-names = "clk_mali";
   ...
};
```

#### 4.1.2 Настройка регулятора напряжения

Согласно схеме питания изделия добавьте свойство mali-supply в узел GPU, обычно в DTS платы. Подробности настройки регулятора приведены в документации по Regulator и PMIC. Пример для RK3399:

```text
&i2c0 {
   ...
   vdd_gpu: syr828@41 {

      compatible = "silergy,syr828";
      reg = <0x41>;
      vin-supply = <&vcc5v0_sys>;
      regulator-compatible = "fan53555-reg";
      pinctrl-0 = <&vsel2_gpio>;

      vsel-gpios = <&gpio1 14 GPIO_ACTIVE_HIGH>;
      regulator-name = "vdd_gpu";
      regulator-min-microvolt = <712500>;
      regulator-max-microvolt = <1500000>;
      regulator-ramp-delay = <1000>;
      fcs,suspend-voltage-selector = <1>;
      regulator-always-on;
      regulator-boot-on;
      regulator-initial-state = <3>;
         regulator-state-mem {
         regulator-off-in-suspend;
      };

   };
};

&gpu {
   status = "okay";
   mali-supply = <&vdd_gpu>;
};
```

#### 4.1.3 Настройка таблицы OPP

Ядро хранит настройки частот и напряжений в дереве устройств. Узел с такими настройками называется таблицей OPP. Он содержит узлы OPP с частотами и напряжениями, а также свойства настройки leakage и PVTM.

Подробности настройки OPP приведены в следующих документах:

```text
Documentation/devicetree/bindings/opp/opp.txt
Documentation/power/opp.txt
```

##### 4.1.3.1 Добавление таблицы OPP

Согласно платформе добавьте таблицу OPP и свойство operating-points-v2 в узел GPU, обычно в DTSI. Пример для RK3399:

```text
&gpu {
   operating-points-v2 = <&gpu_opp_table>;

};

gpu_opp_table: opp-table2 {
   compatible = "operating-points-v2";

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>; /* unit in Hz */
      opp-microvolt = <800000>;    /* unit in uV */
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;

      opp-microvolt = <1100000>;
   };
}
```

##### 4.1.3.2 Удаление OPP

Для удаления отдельных частотных точек используйте следующие способы.

Способ 1: добавьте `status = "disabled";` в соответствующий узел OPP. В английском пояснении оригинала написано disabeld; код использует disabled. Пример:

```text
gpu_opp_table: opp-table2 {
   compatible = "operating-points-v2";


   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>; /* unit in Hz */
      opp-microvolt = <800000>;    /* unit in uV */
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;
      opp-microvolt = <1100000>;
      status = "disabled";
   };
}
```

Способ 2: повторно обратитесь к таблице OPP в DTS платы и добавьте `status = "disabled";` в нужный узел OPP. В английском пояснении оригинала написано disabeld; код использует disabled. Пример:

```text
&gpu_opp_table {
   opp-800000000 {

      status = "disabled";
   }；
};
```

#### 4.1.4 Изменение таблицы OPP по leakage

IDDQ (Integrated Circuit Quiescent Current), также называемый leakage, — ток покоя интегральной схемы. Leakage GPU означает ток покоя GPU при заданном напряжении. Если GPU находится в домене VD logic, его leakage эквивалентен leakage логического домена: току покоя при подаче заданного напряжения на VD logic. При производстве микросхем значение записывается в eFuse или OTP.

##### 4.1.4.1 Изменение напряжения по leakage

Предпосылка: согласно испытаниям исходного документа, Vmin микросхем с малым leakage выше, чем у микросхем с большим leakage. Для последних можно снизить напряжение, уменьшая энергопотребление и улучшая производительность. Это не испытания ArmSoM.

Принцип работы: значение leakage GPU считывается из eFuse или OTP, после чего по таблице определяется соответствующий селектор напряжения. Свойство `opp-microvolt-<selector>` в каждом OPP задаёт целевое напряжение.

Настройка: сначала добавьте код eFuse или OTP согласно соответствующей документации. Затем добавьте в таблицу OPP свойства rockchip,leakage-voltage-sel, nvmem-cells и nvmem-cell-names, а в узлы OPP — `opp-microvolt-<name>` согласно фактическим условиям. Обычно настройки находятся в DTSI. Пример для RK3328. Английский поясняющий текст называет свойство rockchip,leak-voltage-sel; здесь явно использовано имя rockchip,leakage-voltage-sel из кода и китайского оригинала.

```text
gpu_opp_table: gpu-opp-table {
   compatible = "operating-points-v2";


   /*
   * Get GPU leakage from eFuse or OTP
   */
   nvmem-cells = <&gpu_leakage>;
   nvmem-cell-names = "gpu_leakage";

   /*
   * If leakage is between 1mA and 10mA, OPP will use the voltage specified by
   * opp-microvolt-L0.
   * If leakage is between 11mA and 254mA, OPP will use the voltage specified
by
   * opp-microvolt-L1

   *
   * If delete "rockchip,leakage-voltage-sel" or leakage exceed the range, OPP
will
   * use the voltage specified by "opp-microvolt".
   */
   rockchip,leakage-voltage-sel = <
      1  10  0
      11 254 1
   >;

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>;
      opp-microvolt = <950000>;

      opp-microvolt-L0 = <950000>;
      opp-microvolt-L1 = <950000>;
   };
   ...
   opp-500000000 {
      opp-hz = /bits/ 64 <500000000>;
      opp-microvolt = <1150000>;
      opp-microvolt-L0 = <1150000>;
      opp-microvolt-L1 = <1100000>;
   };
};
```

Для отключения функции удалите rockchip,leakage-voltage-sel; тогда OPP будет использовать напряжение opp-microvolt. Английское пояснение исходника называет свойство rockchip,leak-voltage-sel; здесь использовано имя из кода.

#### 4.1.5 Изменение таблицы OPP по PVTM

GPU PVTM (Process-Voltage-Temperature Monitor) — модуль рядом с GPU, отражающий различия производительности микросхем. На него влияют технологический процесс, напряжение и температура.

##### 4.1.5.1 Изменение напряжения по PVTM

Предпосылка: согласно испытаниям исходного документа, Vmin микросхем с малым PVTM выше, чем у микросхем с большим PVTM. Для последних можно снизить напряжение, уменьшая энергопотребление и улучшая производительность. Это не испытания ArmSoM.

Принцип работы: измеряется PVTM при заданных напряжении и частоте, затем результат пересчитывается к опорной температуре. По таблице выбирается селектор напряжения. В каждом OPP свойство `opp-microvolt-<selector>` задаёт целевое напряжение.

Настройка: сначала добавьте код PVTM согласно документации PVTM. Затем добавьте в таблицу OPP rockchip,pvtm-voltage-sel, rockchip,thermal-zone и `rockchip,pvtm-<name>`. При нескольких вариантах технологического процесса добавьте nvmem-cells и nvmem-cell-names. В узлы OPP добавьте `opp-microvolt-<name>` согласно фактическим условиям. Обычно настройки находятся в DTSI. Пример для RK3399:

```text
gpu_opp_table: opp-table2 {
   compatible = "operating-points-v2";


   /*
   * If PVTM value is between 0 and 121000, OPP will use the voltage specified
by
   * "opp-microvolt-L0"
   * If PVTM value is between 121001 and 125500, OPP will use the voltage
specified by
   * "opp-microvolt-L1"
   * If PVTM value is between 125501 and 128500, OPP will use the voltage
specified by
   * "opp-microvolt-L2"
   * If PVTM value is between 128501 and 999999, OPP will use the voltage
specified by

   * "opp-microvolt-L3"
   *
   * If deleted "rockchip,pvtm-voltage-sel" or PVTM value exceeds the range of
the
   * table, OPP will use the voltage specified by "opp-microvolt".
   */
   rockchip,pvtm-voltage-sel = <
      0     121000 0
      121001 125500 1
      125501 128500 2

      128501 999999 3
   >;
   /* Before get PVTM value, change GPU frequency to 200000Khz */
   rockchip,pvtm-freq = <200000>;
   /* Before get PVTM value, change GPU voltage to 900000uV */
   rockchip,pvtm-volt = <900000>;
   /* PVTM channel, format <channel sel> */
   rockchip,pvtm-ch = <3 0>;
   rockchip,pvtm-sample-time = <1000>; /* PVTM sampling time, unit is us */
   rockchip,pvtm-number = <10>; /* PVTM sampling number */
   rockchip,pvtm-error = <1000>; /* error can be afford between sampling
data */

   rockchip,pvtm-ref-temp = <41>; /* refrence temperature */
   /*
   * Proportional coefficient of temperature, when below reference temperature
use the
   * first coefficient, when higher use the second one
   */
   rockchip,pvtm-temp-prop = <46 12>;
   rockchip,thermal-zone = "gpu-thermal"; /* get temperature from soc-thermal
*/

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>;
      opp-microvolt = <800000>;

      opp-microvolt-L0 = <800000>;
      opp-microvolt-L1 = <800000>;
      opp-microvolt-L2 = <800000>;
      opp-microvolt-L3 = <800000>;
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;
      opp-microvolt = <1100000>;
      opp-microvolt-L0 = <1100000>;
      opp-microvolt-L1 = <1075000>;
      opp-microvolt-L2 = <1050000>;

      opp-microvolt-L3 = <1025000>;
   };
};
```

Для отключения функции удалите rockchip,pvtm-voltage-sel; OPP будет использовать напряжение opp-microvolt.

#### 4.1.6 Изменение таблицы OPP по IR-Drop

IR-Drop — изменение напряжения в сетях питания и земли интегральной схемы. Здесь под ним понимаются отклонения напряжения из-за пульсаций питания и разводки платы, как описано в оригинале.

Предпосылка: у некоторых заказных плат отмечены значительные пульсации напряжения. Если использовать таблицу OPP от EVB, напряжение на некоторых частотах может оказаться слишком низким, нарушая стабильность системы. Тогда таблицу OPP необходимо скорректировать с учётом IR-Drop.

Принцип работы: разница между пульсациями EVB и целевой платы на каждой частоте определяет добавку напряжения для этой частоты.

Дополнение из китайского PDF, стр. 11, §4.1.6: если итоговое напряжение превышает максимально допустимое, соответствующая рабочая точка удаляется.

Настройка: добавьте в таблицу OPP rockchip,max-volt, rockchip,evb-irdrop и rockchip,board-irdrop. Обычно rockchip,board-irdrop задаётся в DTS платы, остальные свойства — в DTSI.

Пример для RK3326: настройка DTSI:

```text
gpu_opp_table: gpu-opp-table {
   compatible = "operating-points-v2";


   rockchip,max-volt = <1175000>; /* the highest voltage, unit is uV */
   rockchip,evb-irdrop = <25000>; /* ripple voltage of EVB or SDK */
   ...
}
```

Настройка DTS платы:

```text
&gpu_opp_table {
   /*

   * max IR-drop values on different freq condition for this board!
   */
   /*
   * ripple voltage at diffrent frequencies
   * If frequency is between 200Mhz-520MHz, ripple voltage is 50000uV, the
target
   * voltage will add 25000uV(50000-25000(EVB ripple voltage))
   */
   rockchip,board-irdrop = <
      /* MHz MHz uV */
        200 520 50000
   >;
};
```

Для отключения функции удалите rockchip,board-irdrop.

#### 4.1.7 Настройка широкого температурного диапазона

Под широким температурным диапазоном обычно понимается температура окружающей среды от -40 °C до +85 °C.

Предпосылка: в исходнике отмечено, что некоторые платформы нестабильны при низкой температуре, но работают устойчиво после повышения напряжения на отдельных частотах. Поэтому напряжение следует регулировать по температуре.

Принцип работы: при температуре ниже заданного значения система повышает напряжение каждой частотной точки. Если напряжение превышает установленный системой максимум, соответствующая частота запрещается. При возвращении к нормальной температуре восстанавливается исходное напряжение.

Настройка: для низких температур добавьте в таблицу OPP rockchip,temp-hysteresis, rockchip,low-temp, rockchip,low-temp-min-volt, rockchip,low-temp-adjust-volt и rockchip,max-volt.

Обычно эти настройки находятся в DTSI. Пример для RK3399:

```text
gpu_opp_table: opp-table2 {
   compatible = "operating-points-v2";


   /*
   * Hysteresis parameter, unit is millicelusius, prevent from entry into low
   * temperatures or high temperatures frequently
   * For example, when temperature less than 0 Celsius degrees, work on the low
   * temperature state, higher than 5 Celsius degrees, return to normal state.
   */
   rockchip,temp-hysteresis = <5000>;
   rockchip,low-temp = <0>; /* Threshold for low temperature,
millicelsius */
   rockchip,low-temp-min-volt = <900000>; /* Minimum voltage at low temperature,
uV */
   /* At lower temperature state, add 25mV to frequency at 0-800MHz */

   rockchip,low-temp-adjust-volt = <
      /* MHz MHz  uV */
        0    800  25000
   >;
   rockchip,max-volt = <1150000>; /* highest voltage, unit is uV */
   ...
}
```

#### 4.1.8 Настройка upthreshold и downdifferential

Предпосылка: governor simple ondemand имеет параметры upthreshold и downdifferential со значениями по умолчанию 90 и 5. При загрузке выше 90% устанавливается максимальная частота. При загрузке ниже 90%, но выше 90%-5%, текущая частота сохраняется. При загрузке ниже 90%-5% подбирается частота, обеспечивающая загрузку примерно 90%-5%/2. При стандартной настройке в некоторых сценариях GPU повышает частоту недостаточно быстро, что приводит к пропускам кадров. Поэтому требуется изменение настройки. Формула сохранена в записи исходника.

Настройка: добавьте upthreshold и downdifferential в узел GPU.

Обычно настройки находятся в DTSI. Пример для RK3288:

```text
gpu: gpu@ffa30000 {
   compatible = "arm,malit764",
            "arm,malit76x",

            "arm,malit7xx",
            "arm,mali-midgard";
   reg = <0x0 0xffa30000 0x0 0x10000>;

   upthreshold = <75>;
   downdifferential = <10>;
   ...
}
```

### 4.2 Настройка DMC DVFS

DMC (Dynamic Memory Controller) DVFS означает динамическое изменение напряжения и частоты DDR.

#### 4.2.1 Настройка тактирования

Согласно платформе добавьте свойство тактирования в узел DMC, обычно в DTSI. В пояснении оригинала написано clock, в примере — clocks. Подробности приведены в документации Rockchip по тактированию. Пример для RK3399:

```text
dmc: dmc {
   compatible = "rockchip,rk3399-dmc";
   ...

   clocks = <&cru SCLK_DDRCLK>;
   clock-names = "dmc_clk";
   ...
};
```

#### 4.2.2 Настройка регулятора напряжения

Согласно фактической схеме питания изделия добавьте center-supply в узел DMC, обычно в DTS платы. Подробности настройки регулятора приведены в документации по Regulator и PMIC. Пример для RK3399:

```text
&i2c0 {
   ...

   rk808: pmic@1b {
      ...
      regulators {
         vdd_center: DCDC_REG1 {
           regulator-always-on;
           regulator-boot-on;
           regulator-min-microvolt = <750000>;
           regulator-max-microvolt = <1350000>;
           regulator-ramp-delay = <6001>;
           regulator-name = "vdd_center";
           regulator-state-mem {

              regulator-off-in-suspend;
           };
         };
      };
   };
};

&dmc {
   status = "okay";
   center-supply = <&vdd_center>;
};
```

#### 4.2.3 Настройка таблицы OPP

Ядро хранит настройки частот и напряжений в дереве устройств. Узел с этими настройками называется таблицей OPP. Он содержит узлы OPP с частотами и напряжениями, а также свойства настройки leakage и PVTM.

Подробности настройки OPP приведены в следующих документах:

```text
Documentation/devicetree/bindings/opp/opp.txt
Documentation/power/opp.txt
```

##### 4.2.3.1 Добавление таблицы OPP

Согласно платформе добавьте таблицу OPP и свойство operating-points-v2 в узел DMC, обычно в DTSI. Пример для RK3399:

```text
&dmc {
   operating-points-v2 = <&dmc_opp_table>;

};

dmc_opp_table: opp-table3 {
   compatible = "operating-points-v2";

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>; /* Hz */
      opp-microvolt = <900000>;    /* uV */
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;
      opp-microvolt = <900000>;

   };
};
```

##### 4.2.3.2 Удаление OPP

Для удаления отдельных частотных точек используйте следующие способы.

Способ 1: добавьте `status = "disabled";` в соответствующий узел OPP. В английском пояснении оригинала написано disabeld; код использует disabled. Пример:

```text
dmc_opp_table: opp-table3 {
   compatible = "operating-points-v2";


   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>; /* Hz */
      opp-microvolt = <800000>;    /* uV */
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;
      opp-microvolt = <900000>;
      status = "disabled";
   };
}
```

Способ 2: повторно обратитесь к таблице OPP в DTS платы и добавьте `status = "disabled";` в соответствующий узел OPP. В английском пояснении оригинала написано disabeld; код использует disabled. Пример:

```text
&dmc_opp_table {
   opp-800000000 {
      status = "disabled";

   };
};
```

#### 4.2.4 Изменение таблицы OPP по leakage

IDDQ (Integrated Circuit Quiescent Current), также называемый leakage, — ток покоя интегральной схемы. Leakage DDR означает ток покоя DDR при заданном напряжении. При производстве микросхем значение записывается в eFuse или OTP.

Дополнение из китайского PDF, стр. 15, §4.2.4: если DDR находится в VD logic, leakage DDR эквивалентен leakage логического домена — току покоя при подаче заданного напряжения на этот домен.

##### 4.2.4.1 Изменение напряжения по leakage

Предпосылка: испытания из исходного документа показали, что Vmin микросхем с малым leakage выше, чем у микросхем с большим leakage. Для последних можно снизить напряжение, уменьшая энергопотребление и улучшая производительность. Это не испытания ArmSoM.

Принцип работы: leakage DDR считывается из eFuse или OTP, затем по таблице выбирается селектор напряжения. Свойство `opp-microvolt-<selector>` каждого OPP задаёт целевое напряжение.

Настройка: сначала добавьте код eFuse или OTP согласно соответствующей документации. Затем добавьте в таблицу OPP rockchip,leakage-voltage-sel, nvmem-cells и nvmem-cell-names, а в узлы OPP — `opp-microvolt-<name>` согласно фактическим условиям. Обычно настройки находятся в DTSI. Пример для RK3328:

```text
dmc_opp_table: dmc-opp-table {
   compatible = "operating-points-v2";


   /*
   * Get DDR leakage from eFuse or OTP
   */
   nvmem-cells = <&logic_leakage>;
   nvmem-cell-names = "ddr_leakage";

   /*
   * If leakage is between 1mA and 10mA, OPP will use the voltage specified by
   * opp-microvolt-L0.
   * If leakage is between 11mA and 254mA, OPP will use the voltage specified
by
   * opp-microvolt-L1

   *
   * If delete "rockchip,leakage-voltage-sel" or leakage exceed the range, OPP
will
   * use the voltage specified by "opp-microvolt".
   */
   rockchip,leakage-voltage-sel = <
      1  10  0
      11 254 1
   >;

   opp-400000000 {
      opp-hz = /bits/ 64 <400000000>;
      opp-microvolt = <950000>;

      opp-microvolt-L0 = <950000>;
      opp-microvolt-L1 = <950000>;
   };
   ...
   opp-1066000000 {
      opp-hz = /bits/ 64 <1066000000>;
      opp-microvolt = <1175000>;
      opp-microvolt-L0 = <1175000>;
      opp-microvolt-L1 = <1150000>;
   };
};
```

Для отключения функции удалите rockchip,leakage-voltage-sel; OPP будет использовать напряжение opp-microvolt.

#### 4.2.5 Изменение OPP по PVTM

##### 4.2.5.1 Изменение напряжения по PVTM

Предпосылка: испытания из исходного документа показали, что Vmin микросхем с малым PVTM выше, чем у микросхем с большим PVTM. Для последних можно снизить напряжение, уменьшая энергопотребление и улучшая производительность. Это не испытания ArmSoM.

Принцип работы: измеряется PVTM при заданных напряжении и частоте, затем значение пересчитывается к опорной температуре. По таблице выбирается селектор напряжения. Свойство `opp-microvolt-<selector>` каждого OPP задаёт целевое напряжение.

Настройка: сначала добавьте код PVTM согласно документации PVTM. Затем добавьте в таблицу OPP rockchip,pvtm-voltage-sel, rockchip,thermal-zone и `rockchip,pvtm-<name>`. При нескольких вариантах технологического процесса добавьте nvmem-cells и nvmem-cell-names. В узлы OPP добавьте `opp-microvolt-<name>` согласно фактическим условиям. Обычно настройки находятся в DTSI. Пример для PX30:

```text
dmc_opp_table: dmc-opp-table {
   compatible = "operating-points-v2";


   /*
   * If PVTM value is between 0 and 50000, OPP will use the voltage specified
by "opp-
   * microvolt-L0"
   * If PVTM value is between 50001 and 54000, OPP will use the voltage
specified by
   * "opp-microvolt-L1"
   * If PVTM value is between 54001 and 60000, OPP will use the voltage
specified by
   * "opp-microvolt-L2"
   * If PVTM value is between 60001 and 99999, OPP will use the voltage
specified by

   * "opp-microvolt-L3"
   *
   * If deleted "rockchip,pvtm-voltage-sel" or PVTM value exceeds the range of
the
   * table, OPP will use the voltage specified by "opp-microvolt".
   */
   rockchip,pvtm-voltage-sel = <
      0     50000 0
      50001 54000 1
      54001 60000 2
      60001 99999 3
   >;

   /* PVTM channel, format <channel sel>, here reuse the PVTM value of the CPU
*/
   rockchip,pvtm-ch = <0 0>;

   opp-194000000 {
      opp-hz = /bits/ 64 <194000000>;
      opp-microvolt = <950000>;
      opp-microvolt-L0 = <950000>;
      opp-microvolt-L1 = <950000>;
      opp-microvolt-L2 = <950000>;
      opp-microvolt-L3 = <950000>;
   };
   ...

   opp-786000000 {
      opp-hz = /bits/ 64 <786000000>;
      opp-microvolt = <1100000>;
      opp-microvolt-L0 = <1100000>;
      opp-microvolt-L1 = <1050000>;
      opp-microvolt-L2 = <1025000>;

      opp-microvolt-L3 = <1000000>;
      status = "disabled";
   };
};
```

Для отключения функции удалите rockchip,pvtm-voltage-sel; OPP будет использовать напряжение opp-microvolt.

#### 4.2.6 Изменение таблицы OPP по IR-Drop

IR-Drop — изменение напряжения в сетях питания и земли интегральной схемы. Здесь под ним понимаются отклонения напряжения из-за пульсаций питания и разводки платы, как описано в оригинале.

Предпосылка: у некоторых заказных плат отмечены значительные пульсации напряжения. При использовании таблицы OPP от EVB напряжение на отдельных частотах может оказаться слишком низким, нарушая стабильность системы. Тогда таблицу OPP необходимо скорректировать с учётом IR-Drop.

Принцип работы: разница между пульсациями EVB и целевой платы на каждой частоте определяет добавку напряжения для этой частоты.

Дополнение из китайского PDF, стр. 17, §4.2.6: если итоговое напряжение превышает максимально допустимое, соответствующая рабочая точка удаляется.

Настройка: добавьте в таблицу OPP rockchip,max-volt, rockchip,evb-irdrop и rockchip,board-irdrop. Обычно rockchip,board-irdrop задаётся в DTS платы, остальные свойства — в DTSI. Пример настройки DTSI для RK3326:

```text
dmc_opp_table: dmc-opp-table {
   compatible = "operating-points-v2";


   rockchip,max-volt = <1150000>; /* the highest voltage, unit is uV */
   rockchip,evb-irdrop = <25000>; /* ripple voltage of EVB or SDK */
   ...
}
```

Настройка DTS платы:

```text
&dmc_opp_table {
   /*

   * max IR-drop values on different freq condition for this board!
   */
   /*
   * ripple voltage at diffrent frequencies
   * If frequency is between 451Mhz-800MHz, ripple voltage is 75000uV, the
target
   * voltage will add 50000uV(75000-25000(EVB ripple voltage))
   */
   rockchip,board-irdrop = <
      /* MHz MHz uV */
        451 800 75000
   >;
};
```

Для отключения функции удалите rockchip,board-irdrop.

#### 4.2.7 Изменение частоты по сценарию

Предпосылка: при фиксированной частоте DDR высокая частота повышает энергопотребление, а низкая снижает производительность, что затрудняет выполнение требований изделия. Для сценариев с достаточно определённой потребностью в пропускной способности DDR, например тестов производительности, видео и ожидания, частоту динамически повышают или понижают согласно требованиям к производительности или энергопотреблению.

Принцип работы: при входе в специальный сценарий частота DDR изменяется на заданную для него. Если одновременно действуют несколько сценариев, выбирается максимальная частота. В обоих оригиналах далее дважды написано SYS_STATUS_DUALVIEW: для указанных двух сценариев изменение частоты DDR не поддерживается, поэтому даже при входе в сценарий с более высокой требуемой частотой она сохраняется до выхода из них. Следующий раздел 4.2.8 называет пару SYS_STATUS_DUALVIEW и SYS_STATUS_ISP; расхождение отмечено, а не скрыто.

Настройка: добавьте system-status-freq в узел DMC. Пример для RK3399:

```text
&dmc {
   status = "okay";
   ...

   system-status-freq = <
      /* system status freq(KHz) */
      /*
      * Except for the scenarios defined below, this frequency is constant
used in
      * other scenarios
      */
      SYS_STATUS_NORMAL 800000
      SYS_STATUS_REBOOT 528000 /* set frequency before reboot */
      SYS_STATUS_SUSPEND 200000 /* set frequency after screen is off */
      SYS_STATUS_VIDEO_1080P 200000 /* set frequency before play 1080p video
*/
      SYS_STATUS_VIDEO_4K 600000 /* set frequency before play 4k video*/

      SYS_STATUS_VIDEO_4K_10B 800000 /* set frequency before play 4k 10bit
video */
      SYS_STATUS_PERFORMANCE 800000 /* set frequency before run benchmark */
      /* modified the minimum frequency after touching the screen */
      SYS_STATUS_BOOST 400000
      /* fixed DDR frequency before the second screen display*/
      SYS_STATUS_DUALVIEW 600000
      SYS_STATUS_ISP   600000 /* fix DDR frequency before ISP work */
   >;
}
```

#### 4.2.8 Изменение частоты по загрузке

Предпосылка: сценарный подход охватывает лишь часть ситуаций. В остальных случаях требуется динамически изменять частоту DDR по степени её использования, оптимизируя производительность и энергопотребление.

Принцип работы: периодически измеряется загрузка DDR и выбирается частота по алгоритму simple ondemand с учётом требований активного сценария к пропускной способности DDR. В итоге берётся максимальное значение. В сценариях SYS_STATUS_DUALVIEW и SYS_STATUS_ISP частота DDR фиксирована.

Настройка: добавьте devfreq-events, upthreshold, downdifferential, system-status-freq, auto-min-freq и auto-freq-en в узел DMC. В английском пояснении System-status-freq начинается с заглавной буквы; здесь использовано имя system-status-freq из кода. Пример для RK3399:

```text
&dmc {
   status = "okay";
   ...

   devfreq-events = <&dfi>;  /* Monitor DDR utilization through dfi */
   /*
   * When the load exceeds 40%, change to the highest frequency,
   * When the load is less than 40% and greater than 40% -20%, maintain the
current
   * frequency
   * When the load is less than 40% -20%, it will be change to a frequency so
that
   * the load is almost equals to 40% - 20% / 2.
   */
   upthreshold = <40>;
   downdifferential = <20>;
   system-status-freq = <

      /* system status freq(KHz) */
      /*
      * Except for the scenarios defined below, this frequency is constant
used in
      * other scenarios
      */
      SYS_STATUS_NORMAL 800000
      SYS_STATUS_REBOOT 528000 /* set frequency before reboot */
      SYS_STATUS_SUSPEND 200000 /* set frequency after screen is off */
      SYS_STATUS_VIDEO_1080P 200000 /* set frequency before play 1080p video
*/
      SYS_STATUS_VIDEO_4K 600000 /* set frequency before play 4k video*/

      SYS_STATUS_VIDEO_4K_10B 800000 /* set frequency before play 4k 10bit
video */
      SYS_STATUS_PERFORMANCE 800000 /* set frequency before run benchmark */
      /* modified the minimum frequency after touching the screen */
      SYS_STATUS_BOOST 400000
      /* fixed DDR frequency before the second screen display*/
      SYS_STATUS_DUALVIEW 600000
      SYS_STATUS_ISP   600000 /* fix DDR frequency before ISP work */
   >;
   /*
   * In addition to the scenarios defined above, set the minimum frequency for
other
   * scenarios to prevent the screen splash.

   */
   auto-min-freq = <400000>;
   auto-freq-en = <1>;       /* 1 is enabled, 0 is disabled */
};
```

#### 4.2.9 Изменение частоты по пропускной способности VOP

Предпосылка: после включения auto-freq необходимо задать auto-min-freq, ограничивающий минимальную частоту для предотвращения искажений изображения. При этом остаются возможности снижения энергопотребления: частоту DDR можно изменять по потребности VOP в пропускной способности.

Принцип работы: перед отображением каждого кадра драйвер VOP рассчитывает требуемую пропускную способность DDR, затем соответствующим образом изменяет минимальную частоту DDR.

Настройка: добавьте vop-bw-dmc-freq в узел DMC. Пример для RK3399:

```text
&dmc {
   status = "okay";
   ...

   /*
   * bandwidth is 0-577MB/s, the minimum DDR frequency is 200MHz.
   * bandwidth is 578-1701MB/s, the minimum DDR frequency is 300MHz.
   * bandwidth is 1702-99999MB/s, the minimum DDR frequency is 400MHz.
   */
   vop-bw-dmc-freq = <
   /* min_bw(MB/s) max_bw(MB/s) freq(KHz) */
      0    577    200000
      578  1701   300000
      1702 99999  400000
   >;
   /*

   * After support changing frequency according to VOP bandwidth, this value can
be
   * changed to a low frequency.
   */
   auto-min-freq = <200000>;
};
```

### 4.3 Настройка BUS DVFS

Помимо GPU и DMC, динамическое изменение частоты и напряжения требуется и другим модулям, например PLL и CCI. Здесь они объединены в категорию BUS DVFS.

#### 4.3.1 Настройка PLL DVFS

Предпосылка: на некоторых платформах при превышении определённой частоты PLL необходимо повысить напряжение домена, в котором находится PLL. Поэтому напряжение следует регулировать по частоте PLL.

Принцип работы: частота PLL отслеживается через зарегистрированный clock notifier. При повышении частоты сначала увеличивается напряжение, затем частота. При понижении сначала уменьшается частота, затем напряжение.

Настройка: добавьте в узел устройства rockchip,busfreq-policy, clocks, clock-names, operating-points-v2 и bus-supply. Английское пояснение использует Bus-supply; здесь явно использовано имя bus-supply из кода.

Пример настройки DTSI для PX30:

```text
bus_apll: bus-apll {
   compatible = "rockchip,px30-bus";

   /*
   * Use clkfreq policy to monitor PLL frequency. If PLL frequency is raising,
   * first raise the voltage and then increase the frequency. If PLL frequency
is
   * going down, first decrease the frequency and then decrease the voltage.
   */
   rockchip,busfreq-policy = "clkfreq";
   clocks = <&cru PLL_APLL>;       /* Clock configuration */
   clock-names = "bus";
   operating-points-v2 = <&bus_apll_opp_table>; /* OPP Table configuration */
   status = "disabled";
};


bus_apll_opp_table: bus-apll-opp-table {
   compatible = "operating-points-v2";
   opp-shared;
   /*
   * If PLL frequency less than or equal to 1008MHz, voltage is 950mV,
   * if greater than 1008MHz, voltage is 1000mV
   */
   opp-1512000000 {
      opp-hz = /bits/ 64 <1512000000>;
      opp-microvolt = <1000000>;
   opp-1008000000 {
      opp-hz = /bits/ 64 <1008000000>;

      opp-microvolt = <950000>;
   };
};
```

Настройка платы:

```text
&i2c0 {
   status = "okay";

   rk809: pmic@20 {
      compatible = "rockchip,rk809";
      reg = <0x20>;
      ...
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
      }

   }
}

&bus_apll {
   /*
   * regulator configuration,
   * it should be modified according to the actual product hardware power
solution
   */
   bus-supply = <&vdd_logic>;
   status = "okay";
};
```

## 5. Интерфейс пользовательского пространства

После успешной регистрации устройства в devfreq в `/sys/class/devfreq/` создаётся подкаталог с пользовательскими интерфейсами, например ff9a0000.gpu. Через них можно менять governor, проверять текущую частоту, изменять её и выполнять другие действия, как показано ниже:

```text
available_frequencies /* available frequencies */
available_governors  /* available devfreq governors */

cur_freq             /* the current frequency */
governor             /* current devfreq governor */
load                 /* current load */
max_freq             /* the maximum frequency */
min_freq             /* the minimum frequency */
polling_interval     /* the polling interval in ms. 0 disables polling */
target_freq          /* the last frequency set by software*/
trans_stat           /* scaling times and running time at each frequency
*/
```

## 6. Частые вопросы

### 6.1 Просмотр таблицы OPP

Выполните следующую команду:

```text
cat /sys/kernel/debug/opp/opp_summary
```

Пример для PX30:

```text
 device          rate(Hz) target(uV) min(uV) max(uV)
-------------------------------------------------------------------
 platform-dmc

                194000000  950000   950000   950000
                328000000  950000   950000   950000
                450000000  950000   950000   950000
                528000000  975000   975000   975000
                666000000  1000000 1000000  1000000
 platform-ff400000.gpu
                200000000  950000   950000   950000
                300000000  950000   950000   950000
                400000000  1025000 1025000  1025000
                480000000  1100000 1100000  1100000
 platform-bus-apll
               1008000000  950000   950000   950000

               1512000000  1000000 1000000  1000000
```

### 6.2 Фиксация частоты

Способ 1: отключите ненужные OPP в таблице, оставив только требуемые. Пример для PX30: фиксированная частота GPU 400 MHz.

```text
gpu_opp_table: gpu-opp-table {
   compatible = "operating-points-v2";
   ...

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>;
      opp-microvolt = <950000>;
      opp-microvolt-L0 = <950000>;
      opp-microvolt-L1 = <950000>;
      opp-microvolt-L2 = <950000>;
      opp-microvolt-L3 = <950000>;
      status = "disabled";
   };
   opp-300000000 {
      opp-hz = /bits/ 64 <300000000>;
      opp-microvolt = <975000>;

      opp-microvolt-L0 = <975000>;
      opp-microvolt-L1 = <950000>;
      opp-microvolt-L2 = <950000>;
      opp-microvolt-L3 = <950000>;
      status = "disabled";

   };
   opp-400000000 {
      opp-hz = /bits/ 64 <400000000>;
      opp-microvolt = <1050000>;
      opp-microvolt-L0 = <1050000>;
      opp-microvolt-L1 = <1025000>;
      opp-microvolt-L2 = <975000>;
      opp-microvolt-L3 = <950000>;
   };
   opp-480000000 {
      opp-hz = /bits/ 64 <480000000>;
      opp-microvolt = <1125000>;

      opp-microvolt-L0 = <1125000>;
      opp-microvolt-L1 = <1100000>;
      opp-microvolt-L2 = <1050000>;
      opp-microvolt-L3 = <1000000>;
      status = "disabled";
   };
};
```

Способ 2: выполните команды во время работы устройства. Пример для PX30:

```text
/* set governor to userspace */
echo userspace > /sys/class/devfreq/ff400000.gpu/governor

/* set frequency to 400MHz */
echo 400000000 > /sys/class/devfreq/ff400000.gpu/userspace/set_freq
/* check the current frequency */
cat /sys/class/devfreq/ff400000.gpu/cur_freq
```

### 6.3 Просмотр текущей частоты

Частоту можно проверить через пользовательский интерфейс devfreq или интерфейс debugfs тактирования.

Команды для PX30:

```text
/* Method 1: devfreq userspace interface */
cat /sys/class/devfreq/ff400000.gpu/cur_freq


/* Method 2: clock debug interface */
cat /sys/kernel/debug/clk/aclk_gpu/clk_rate
```

### 6.4 Просмотр текущего напряжения

Напряжение можно проверить через отладочный интерфейс регулятора. Пример просмотра напряжения GPU на PX30:

```text
/* here vdd_logic is not fixed name, please modify */
cat /sys/kernel/debug/regulator/vdd_logic/voltage
```

### 6.5 Раздельная настройка напряжения и частоты

Пример для GPU PX30: установите частоту 400 MHz и напряжение 1000 mV.

```text
/* set governor to userspace */
echo userspace > /sys/class/devfreq/ff400000.gpu/governor


/* set frequency to 400MHz */
echo 400000000 > /sys/kernel/debug/clk/aclk_gpu/clk_rate
cat /sys/kernel/debug/clk/aclk_gpu/clk_rate

/* set voltage to 1000mV */
echo 1000000 > /sys/kernel/debug/regulator/vdd_logic/voltage
cat /sys/kernel/debug/regulator/vdd_logic/voltage
```

Внимание: при повышении частоты сначала увеличьте напряжение, затем частоту. При понижении сначала уменьшите частоту, затем напряжение.

### 6.6 Просмотр селектора напряжения OPP

Если поддерживается изменение напряжения по PVTM, выполните следующую команду:

```text
dmesg | grep pvtm
```

Пример вывода для RK3399:

```text
[  0.669456] cpu cpu0: temp=22222, pvtm=138792 (140977 + -2185)
[  0.670601] cpu cpu0: pvtm-volt-sel=0

[  0.683008] cpu cpu4: temp=22222, pvtm=148761 (150110 + -1349)
[  0.683109] cpu cpu4: pvtm-volt-sel=0
[  1.495247] rockchip-dmc dmc: Failed to get pvtm
[  3.366028] mali ff9a0000.gpu: temp=22777, pvtm=120824 (121698 + -874)
/* pvtm-volt-sel = 0, opp-microvolt-L0 property will be used in GPU OPP table */
[  3.366915] mali ff9a0000.gpu: pvtm-volt-sel=0
```

Аналогично, если поддерживается изменение напряжения по leakage, следующая команда выдаст похожую информацию.

```text
dmesg | grep leakage
```

### 6.7 Просмотр текущего leakage

Выполните следующую команду:

```text
dmesg | grep leakage
```

Пример вывода для CPU RK3399:

```text
[  0.656175] cpu cpu0: leakage=10
[  0.671092] cpu cpu4: leakage=20

[  1.492769] rockchip-dmc dmc: Failed to get leakage
/* leakage=15，GPU's leakage is 15mA*/
[  3.341084] mali ff9a0000.gpu: leakage=15
```

### 6.8 Изменение напряжения OPP

Способ 1: непосредственно измените напряжение каждой точки OPP.

Например, увеличьте напряжение для 200 MHz на 25000 uV. Пример исходной настройки:

```text
opp-200000000 {
   opp-hz = /bits/ 64 <200000000>;
   opp-microvolt = <800000>;

   opp-microvolt-L0 = <800000>;
   opp-microvolt-L1 = <800000>;
   opp-microvolt-L2 = <800000>;
   opp-microvolt-L3 = <800000>;
};
```

После изменения:

```text
opp-200000000 {
   opp-hz = /bits/ 64 <200000000>;

   /* Add 25000uV for each property */
   opp-microvolt = <825000>;
   opp-microvolt-L0 = <825000>;
   opp-microvolt-L1 = <825000>;
   opp-microvolt-L2 = <825000>;
   opp-microvolt-L3 = <825000>;
};
```

Способ 2: измените напряжение через настройки IR-Drop, см. раздел 4.2.6 исходного документа.

Например, увеличьте напряжение GPU на частоте 200 MHz на 25000 uV. Пример исходной настройки IR-Drop:

```text
&gpu_opp_table {
   /*
   * max IR-drop values on different freq condition for this board!

   */
   /*
   * ripple voltage at diffrent frequencies
   * 200Mhz-520MHz，ripple voltage is 50000uV，the target voltage will increase
by
   * 25000uV（50000-25000(EVB ripple voltage))

   */
   rockchip,board-irdrop = <
      /* MHz MHz uV */
        200 520 50000
   >;
};
```

После изменения:

```text
&gpu_opp_table {
   /*

   * max IR-drop values on different freq condition for this board!
   */
   /*
   * ripple voltage at diffrent frequencies
   * 200Mhz-299MHz，ripple voltage is 50000uV，the target voltage will increase
by
   * 50000uV（75000-25000(EVB ripple voltage))
   * 300Mhz-520MHz，ripple voltage is 50000uV，the target voltage will increase
by
   * 25000uV（50000-25000(EVB ripple voltage))
   */
   rockchip,board-irdrop = <
      /* MHz MHz uV */

        200 299 75000 /* from 50000 to 75000 */
        300 520 50000
   >;
};
```

{% endraw %}
