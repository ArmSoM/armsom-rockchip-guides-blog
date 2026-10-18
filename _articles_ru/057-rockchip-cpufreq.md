---
title: "Полное руководство Rockchip CPUFreq: CPU DVFS, OPP, PVTM и диагностика"
description: "Настройка тактирования CPU Rockchip, регуляторов и таблиц OPP; выбор напряжения по leakage/PVTM, компенсация IR-Drop, температурные режимы и диагностика. Справочник для оценки адаптации к ArmSoM."
translation_key: "057-rockchip-cpufreq"
slug: "057-rockchip-cpufreq"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: ["Rockchip", "CPUFreq", "DVFS", "OPP", "PVTM", "Linux"]
keywords: "ArmSoM Rockchip CPUFreq DVFS OPP PVTM Linux"
excerpt: "Настройка тактирования CPU Rockchip, регуляторов и таблиц OPP; выбор напряжения по leakage/PVTM, компенсация IR-Drop, температурные режимы и диагностика. Справочник для оценки адаптации к ArmSoM."
---

{% raw %}

# Полное руководство Rockchip CPUFreq: CPU DVFS, OPP, PVTM и диагностика

Это справочное руководство Rockchip CPUFreq, а не инструкция, проверенная на оборудовании ArmSoM. Таблица версий оригинала указывает все микросхемы и Linux 4.4 / 4.19; это не подтверждает поддержку каждой платы ArmSoM или современного BSP. Перед адаптацией проверьте SoC, схему питания платы и PMIC/регулятор, дерево тактирования, таблицу OPP, поддержку eFuse/OTP/PVTM и драйверы SDK/BSP/ядра. Не переносите частоты, напряжения или настройки регистров без проверки. Журналы, результаты испытаний и пределы частот принадлежат исходнику, а не испытаниям ArmSoM. Команды изменения частот и напряжений не выполнялись. Оба оригинала — V1.1.1 (21 страница на китайском / 25 на английском); сохранены соответствующие тексты, расхождения отмечены. Китайская статья использует рисунок китайского оригинала; английская и русская — английского. Русская статья полностью переводит английский технический текст; комментарии кода сохранены на языке оригинала.

| Микросхемы по оригиналу | Версия ядра |
| --- | --- |
| Все микросхемы (формулировка оригинала; требуется проверка платы) | Linux 4.4 / Linux 4.19 |

[Редакционные замечания](/docs/rockchip-cpufreq/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Обзор

CPUFreq — подсистема ядра для динамического изменения частоты и напряжения CPU согласно выбранному governor. Она позволяет снижать энергопотребление CPU с учётом требований к производительности. CPUFreq состоит из governor, core, driver и stats. Программная архитектура показана ниже:

![Архитектура: рисунок английского оригинала, PDF p. 5](/docs/rockchip-cpufreq/assets/en-p5-1.png)

CPUFreq governor определяет момент изменения частоты CPU и целевую частоту. Ядро включает следующие governor:

- conservative: динамически изменяет частоту в зависимости от загрузки CPU, плавно повышая или понижая её на заданную долю.

- ondemand: динамически изменяет частоту в зависимости от загрузки CPU. Изменение может быть значительным, например непосредственно до максимальной или минимальной частоты.

- interactive: динамически изменяет частоту в зависимости от загрузки CPU; по сравнению с ondemand быстрее реагирует, имеет больше параметров и обеспечивает более гибкую настройку.

- userspace: предоставляет интерфейс, через который приложения пользовательского пространства могут менять частоту.

- powersave: отдаёт приоритет энергопотреблению и постоянно устанавливает минимальную частоту.

- performance: отдаёт приоритет производительности и постоянно устанавливает максимальную частоту.

- schedutil: специальный governor для EAS. EAS (Energy Aware Scheduling) — стратегия планирования задач нового поколения, объединяющая подходы CPUFreq и CPUIdle. При выборе CPU для задачи учитываются производительность и энергопотребление. Согласно описанию исходного документа, это обеспечивает минимальное энергопотребление системы без ухудшения производительности; это не результат испытаний ArmSoM.

CPUFreq core инкапсулирует и абстрагирует governor и драйверы cpufreq, предоставляя чётко определённый интерфейс.

CPUFreq driver инициализирует таблицу частот CPU и устанавливает частоту CPU.

CPUFreq stats предоставляет статистику cpufreq.

## 2. Пути исходного кода

Код governor:

```text
drivers/cpufreq/cpufreq_conservative.c /* conservative governor */
drivers/cpufreq/cpufreq_ondemand.c /* ondemand governor */
drivers/cpufreq/cpufreq_interactive.c /* interactive governor */

drivers/cpufreq/cpufreq_userspace.c /* userspace governor */
drivers/cpufreq/cpufreq_performance.c /* performance governor */
kernel/sched/cpufreq_schedutil.c /* schedutil governor */
```

Код stats:

```text
drivers/cpufreq/cpufreq_stats.c
```

Код core:

```text
drivers/cpufreq/cpufreq.c
```

Код driver:

```text
drivers/cpufreq/cpufreq-dt.c     /* platform driver */
drivers/cpufreq/rockchip-cpufreq.c /* platform device */
drivers/soc/rockchip/rockchip_opp_select.c /* interface for changing opp */
```

## 3. Настройка

### 3.1 Menuconfig

```text
CPU Power Management --->
   CPU Frequency scaling --->
      [*] CPU Frequency scaling

      <*> CPU frequency translation statistics /* cpufreq stats */
[ ]  CPU frequency translation statistics details
[*] CPU frequency time-in-state statistics
   Default CPUFreq governor (interactive) ---> /* cpufreq governor */

<*> 'performance' governor
<*> 'powersave' governor
<*> 'userspace' governor for userspace frequency scaling
<*> 'ondemand' cpufreq policy governor
-*- 'interactive' cpufreq policy governor
<*> 'conservative' cpufreq governor
[ ] 'schedutil' cpufreq policy governor
   *** CPU frequency scaling drivers ***
<*> Generic DT based cpufreq driver /* platform driver */
< > Generic ARM big LITTLE CPUfreq driver
<*> Rockchip CPUfreq driver        /* platform device */
```

Параметр Default CPUFreq governor позволяет выбрать governor изменения частоты. Настройте его согласно фактическим требованиям изделия.

### 3.2 Настройка тактирования

В соответствии с платформой добавьте свойство тактирования в узел CPU, обычно в файле DTSI. В исходном тексте свойство названо clock, а в примерах используется clocks. Подробности настройки приведены в документации Rockchip по тактированию.

На платформах без big.LITTLE, например RK3326 и RK3328, добавьте `clocks = <&cru ARMCLK>;` в узел CPU0. Пример для RK3328:

```text
cpu0: cpu@0 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   clocks = <&cru ARMCLK>;
};
```

На платформах big.LITTLE, например RK3368 и RK3399, добавьте `clocks = <&cru ARMCLKB>;` в каждый узел большого ядра и `clocks = <&cru ARMCLKL>;` в каждый узел малого ядра. Пример для RK3399:

```text
cpu_l0: cpu@0 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   clocks = <&cru ARMCLKL>;
};

cpu_l1: cpu@1 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";
   ...
   clocks = <&cru ARMCLKL>;
};
cpu_l2: cpu@2 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   clocks = <&cru ARMCLKL>;
};

cpu_l3: cpu@3 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";
   ...
   clocks = <&cru ARMCLKL>;
};

cpu_b0: cpu@100 {

   device_type = "cpu";
   compatible = "arm,cortex-a72", "arm,armv8";
   ...
   clocks = <&cru ARMCLKB>;
};

cpu_b1: cpu@101 {
   device_type = "cpu";
   compatible = "arm,cortex-a72", "arm,armv8";
   ...
   clocks = <&cru ARMCLKB>;
};
```

Примечание: если тактирование не настроено, драйвер CPUFreq не сможет инициализироваться и выведет следующую ошибку:

```text
cpu cpu0: failed to get clock: -2
cpufreq-dt: probe of cpufreq-dt failed with error -2
```

### 3.3 Настройка регулятора напряжения

Согласно фактической схеме питания изделия добавьте свойство cpu-supply в узел CPU, обычно в DTS конкретной платы. Подробности настройки Regulator приведены в документации по Regulator и PMIC.

На платформах без big.LITTLE добавьте cpu-supply в узел CPU0. Пример для RK3328:

```text
&i2c1 {
   status = "okay";
   rk805: rk805@18 {

      compatible = "rockchip,rk805";
      status = "okay";
      ...
      regulators {
         compatible = "rk805-regulator";
         status = "okay";
         ...
         vdd_arm: RK805_DCDC2 {
           regulator-compatible = "RK805_DCDC2";
           regulator-name = "vdd_arm";
           regulator-init-microvolt = <1225000>;

           regulator-min-microvolt = <712500>;
           regulator-max-microvolt = <1450000>;
           regulator-initial-mode = <0x1>;
           regulator-ramp-delay = <12500>;
           regulator-boot-on;
           regulator-always-on;
           regulator-state-mem {
              regulator-mode = <0x2>;
              regulator-on-in-suspend;
              regulator-suspend-microvolt = <950000>;
           };
         };

         ...
      };
   };
};

&cpu0 {
   cpu-supply = <&vdd_arm>;
};
```

На платформах big.LITTLE добавьте cpu-supply в каждый узел CPU. Пример для RK3399:

```text
&cpu_l0 {
   cpu-supply = <&vdd_cpu_l>;

};

&cpu_l1 {
   cpu-supply = <&vdd_cpu_l>;
};

&cpu_l2 {
   cpu-supply = <&vdd_cpu_l>;
};

&cpu_l3 {
   cpu-supply = <&vdd_cpu_l>;
};


&cpu_b0 {
   cpu-supply = <&vdd_cpu_b>;
};

&cpu_b1 {
   cpu-supply = <&vdd_cpu_b>;
};
```

Примечание: без настроенного регулятора драйвер cpufreq всё равно может успешно загрузиться. При этом предполагается изменение частоты CPU без изменения напряжения. Однако при превышении определённой частоты недостаточное напряжение может привести к сбою системы.

### 3.4 Настройка таблицы OPP

Ядро хранит настройки частот и напряжений в дереве устройств. Узел, содержащий эти настройки, называется таблицей OPP. Он включает узлы OPP с частотами и напряжениями, а также свойства настройки leakage и PVTM.

Подробное описание настройки OPP приведено в следующих документах:

```text
Documentation/devicetree/bindings/opp/opp.txt
Documentation/power/opp.txt
```

#### 3.4.1 Добавление таблицы OPP

Согласно платформе добавьте узел таблицы OPP и свойство operating-points-v2 в каждый узел CPU, обычно в файле DTSI. Пример для RK3328:

```text
cpu0: cpu@0 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   operating-points-v2 = <&cpu0_opp_table>;
};
cpu1: cpu@1 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";
   ...
   operating-points-v2 = <&cpu0_opp_table>;
};
cpu2: cpu@2 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   operating-points-v2 = <&cpu0_opp_table>;
};
cpu3: cpu@3 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";
   ...
   operating-points-v2 = <&cpu0_opp_table>;
};

cpu0_opp_table: opp_table0 {
   compatible = "operating-points-v2";
   opp-shared; /* indicate the OPP Table is shared by multiple CPUs. */


   /*
   * The frequency conversion factor, it will be converted into a frequency by
a
   * certain algorithm, indicating the highest frequency limited by this
platform, and
   * the higher frequency will be deleted. For example, "13" is converted to
   * frequency "1296MHz", the frequency more than 1296MHz in the OPP Table will
be
   * deleted. It is used to prevent the error of filling in a high frequency

which
   * isn't supported by the platform and it would be no need generally.
   */
   rockchip,avs-scale = <13>;

   opp-408000000 {
      opp-hz = /bits/ 64 <408000000>; /* Hz */
      opp-microvolt = <950000 950000 1350000>;/* uV, <target min max> */
      /* ns, the time required to complete the transformation */
      clock-latency-ns = <40000>;
      /*
      * when suspend or the entire big or little cores are shut down, the CPU

      * frequency will be set to the OPP freqency. Only one OPP node contains
this
      * property in a OPP Table.
      */
      opp-suspend;
   };
   ...
   opp-1296000000 {
      opp-hz = /bits/ 64 <1296000000>;
      opp-microvolt = <1350000 1350000 1350000>;
      clock-latency-ns = <40000>;
   };
}
```

Примечание: если отсутствует operating-points-v2, cpufreq не инициализируется, система не сможет изменять частоту и напряжение и выведет следующую ошибку. Исходный английский текст связывает отсутствие свойства с таблицей OPP; пример задаёт его в узле CPU.

```text
cpu cpu0: OPP-v2 not supported
cpu cpu0: couldn't find opp table for cpu:0, -19
```

#### 3.4.2 Удаление OPP

Для удаления отдельных частотных точек можно использовать следующие способы.

Способ 1: добавьте `status = "disabled";` в соответствующий узел OPP, например как показано ниже. В пояснении английского оригинала написано disabeld; в коде используется disabled.

```text
cpu0_opp_table: opp_table0 {
   compatible = "operating-points-v2";
   opp-shared;


   opp-408000000 {
      opp-hz = /bits/ 64 <408000000>;
      opp-microvolt = <950000 950000 1350000>;
      clock-latency-ns = <40000>;
   };
   ...
   opp-1296000000 {
      opp-hz = /bits/ 64 <1296000000>;
      opp-microvolt = <1350000 1350000 1350000>;
      clock-latency-ns = <40000>;
      status = "disabled";

   };
}
```

Способ 2: повторно обратитесь к узлу таблицы OPP в DTS платы и добавьте `status = "disabled";` в соответствующий узел OPP. В пояснении английского оригинала написано disabeld; в коде используется disabled.

```text
&cpu0_opp_table {
   opp-1296000000 {

      status = "disabled";
   }；
};
```

### 3.5 Изменение таблицы OPP по leakage

IDDQ (Integrated Circuit Quiescent Current), также называемый leakage, — ток покоя интегральной схемы. Leakage CPU означает ток покоя CPU при заданном напряжении. При производстве микросхем значение leakage записывается в eFuse или OTP.

#### 3.5.1 Изменение напряжения по leakage

Предпосылка: испытания, описанные в исходном документе, показали, что Vmin микросхем с малым leakage выше, чем у микросхем с большим leakage. Поэтому для микросхем с большим leakage можно снизить напряжение, уменьшая энергопотребление и улучшая производительность. Это не испытания ArmSoM.

Принцип работы: значение leakage CPU считывается из eFuse или OTP, затем по специальной таблице определяется соответствующий селектор напряжения. В каждом OPP свойство `opp-microvolt-<selector>` задаёт целевое напряжение этой точки.

Настройка: сначала добавьте код поддержки eFuse или OTP согласно соответствующей документации. Затем добавьте в узел таблицы OPP свойства rockchip,leakage-voltage-sel, nvmem-cells и nvmem-cell-names, а в узлы OPP — свойства `opp-microvolt-<name>` согласно фактическим условиям. Обычно настройки находятся в DTSI. Пример для RK3328. В английском пояснении исходника написано rockchip,leak-voltage-sel; точное имя rockchip,leakage-voltage-sel приведено в коде и китайском оригинале.

```text
cpu0_opp_table: cpu0-opp-table {
   compatible = "operating-points-v2";

   opp-shared;

   /*
   * Get CPU leakage from eFuse or OTP
   */
   nvmem-cells = <&cpu_leakage>;
   nvmem-cell-names = "cpu_leakage";

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

   opp-408000000 {
      opp-hz = /bits/ 64 <408000000>;

      opp-microvolt = <950000 950000 1350000>;
      opp-microvolt-L0 = <950000 950000 1350000>;
      opp-microvolt-L1 = <950000 950000 1350000>;
      clock-latency-ns = <40000>;
      opp-suspend;
   };
   ...
   opp-1296000000 {
      opp-hz = /bits/ 64 <1296000000>;
      opp-microvolt = <1350000 1350000 1350000>;
      opp-microvolt-L0 = <1350000 1350000 1350000>;
      opp-microvolt-L1 = <1300000 1300000 1350000>;
      clock-latency-ns = <40000>;

   };
};
```

Для отключения функции удалите rockchip,leakage-voltage-sel; тогда OPP будет использовать напряжение opp-microvolt. Английское пояснение оригинала называет свойство rockchip,leak-voltage-sel; здесь явно использовано имя из кода.

### 3.6 Изменение таблицы OPP по PVTM

CPU PVTM (Process-Voltage-Temperature Monitor) — модуль рядом с CPU, отражающий различия производительности микросхем. На него влияют технологический процесс, напряжение и температура.

#### 3.6.1 Изменение напряжения по PVTM

Предпосылка: испытания из исходного документа показали, что Vmin микросхем с малым значением PVTM выше, чем у микросхем с большим PVTM. Поэтому для последних можно снизить напряжение, уменьшая энергопотребление и улучшая производительность. Это не испытания ArmSoM.

Принцип работы: измеряется PVTM при заданных напряжении и частоте, затем результат пересчитывается к опорной температуре. По специальной таблице определяется соответствующий селектор напряжения. Свойство `opp-microvolt-<selector>` в каждом OPP задаёт целевое напряжение этой точки.

Настройка: сначала добавьте код PVTM согласно документации PVTM. Затем добавьте в таблицу OPP свойства rockchip,pvtm-voltage-sel, rockchip,thermal-zone и `rockchip,pvtm-<name>`. При наличии нескольких вариантов технологического процесса добавьте nvmem-cells и nvmem-cell-names. В узлы OPP добавьте `opp-microvolt-<name>` согласно фактическим условиям. Обычно настройки находятся в DTSI. Пример для RK3288:

```text
cpu0_opp_table: opp_table0 {
   compatible = "operating-points-v2";
   opp-shared;


   ...
   /*
   * Get CPU process infomation from eFuese or OTP
   * If only contains one process, you should do nothing with process_version.
   * If contains more than one's, need to adding below
   */
   nvmem-cells = <&process_version>;
   nvmem-cell-names = "process";

   /*
   * IF only one process，please add property "rockchip,pvtm-voltage-sel" to OPP

Table
   * node, and add "opp-microvolt-L0","opp-microvolt-L1" to OPP node for
distinguish
   * voltage.
   * If more than one process: for example process0 and process1, if this 2
process
   * configuration different with each other, please add "rockchip,p0-pvtm-
voltage-
   * sel","rockchip,p1-pvtm-voltage-sel" to OPP Table and add "opp-microvolt-
P0-L0",
   * "opp-microvolt-P1-L0" to OPP node for distinguish voltage
   * If this 2 process are the same process configuration, adding
"rockchip,pvtm-

   * voltage-sel" is eghough.
   *
   * If PVTM value is between 0 and 14300, OPP will use the voltage specified
by "opp-
   * microvolt-L0"
   * If PVTM value is between 14301 and 15000, OPP will use the voltage
specified by
   * "opp-microvolt-L1"
   * If PVTM value is between 15001 and 16000, OPP will use the voltage
specified by
   * "opp-microvolt-L2"
   * If PVTM value is between 15001 and 16000, OPP will use the voltage

specified by
   * "opp-microvolt-L3"
   *
   * If deleted "rockchip,pvtm-voltage-sel" or PVTM value exceeds the range of
the
   * table, OPP will use the voltage specified by "opp-microvolt".
   */
   rockchip,pvtm-voltage-sel = <
      0     14300 0
      14301 15000 1
      15001 16000 2

      16001 99999 3
   >;
   /* Before get PVTM value, chang CPU frequency to 408000Khz */
   rockchip,pvtm-freq = <408000>;
   /* Before get PVTM value, change CPU voltage to 1000000uV */
   rockchip,pvtm-volt = <1000000>;
   /* PVTM channel, format <channel sel> */
   rockchip,pvtm-ch = <0 0>;
   rockchip,pvtm-sample-time = <1000>; /* PVTM sampling time, unit is us */
   rockchip,pvtm-number = <10>; /* PVTM sampling number */
   rockchip,pvtm-error = <1000>; /* error can be afford between sampling
data */

   rockchip,pvtm-ref-temp = <35>; /* refrence temperature */
   /*
   * Proportional coefficient of temperature, when below reference temperature
use the
   * first coefficient, when higher use the second one
   */
   rockchip,pvtm-temp-prop = <(-18) (-18)>;
   rockchip,thermal-zone = "soc-thermal"; /* get temperature from soc-thermal
*/

   opp-126000000 {
      opp-hz = /bits/ 64 <126000000>;
      opp-microvolt = <950000 950000 1350000>;

      opp-microvolt-L0 = <950000 950000 1350000>;
      opp-microvolt-L1 = <950000 950000 1350000>;
      opp-microvolt-L2 = <950000 950000 1350000>;
      opp-microvolt-L3 = <950000 950000 1350000>;
      clock-latency-ns = <40000>;
   };
   ...
   opp-1608000000 {
      opp-hz = /bits/ 64 <1608000000>;
      opp-microvolt = <1350000 1350000 1350000>;
      opp-microvolt-L0 = <1350000 1350000 1350000>;
      opp-microvolt-L1 = <1350000 1350000 1350000>;

      opp-microvolt-L2 = <1300000 1300000 1350000>;
      opp-microvolt-L3 = <1250000 1250000 1350000>;
      clock-latency-ns = <40000>;
   };
};
```

Для отключения функции удалите rockchip,pvtm-voltage-sel. Тогда OPP будет использовать напряжение, заданное opp-microvolt.

### 3.7 Изменение таблицы OPP по IR-Drop

IR-Drop — изменение напряжения в сетях питания и земли интегральной схемы. Здесь под ним понимается отклонение напряжения, обусловленное пульсациями питания и разводкой платы, как описано в исходном документе.

Предпосылка: у некоторых заказных плат в исходном документе отмечены значительные пульсации напряжения. При использовании таблицы OPP от EVB напряжение на некоторых частотах может оказаться слишком низким и нарушить стабильность системы. В таком случае таблицу OPP следует скорректировать с учётом IR-Drop.

Принцип работы: разница между пульсациями EVB и целевой платы на каждой частоте определяет добавку напряжения для этой частоты.

Настройка: добавьте в таблицу OPP свойства rockchip,max-volt, rockchip,evb-irdrop и rockchip,board-irdrop. Обычно rockchip,board-irdrop задаётся в DTS платы, а остальные свойства — в DTSI.

Пример для RK3326: настройка DTSI:

```text
cpu0_opp_table: cpu0-opp-table {
   compatible = "operating-points-v2";

   opp-shared;

   rockchip,max-volt = <1350000>; /* the highest voltage, unit is uV */
   rockchip,evb-irdrop = <25000>; /* ripple voltage of EVB or SDK */
}
```

Настройка DTS платы:

```text
&cpu0_opp_table {
   /*
   * max IR-drop values on different freq condition for this board!

   */
   /*
   * ripple voltage at diffrent frequencies
   * If frequency is between 0MHz-815MHz, ripple voltage is 37500uV, the target
   * voltage will add 12500uV(37500-25000(EVB ripple voltage))
   * If frequency is between 816Mhz-1119MHz, ripple voltage is 50000uV, the
target
   * voltage will add 25000uV(50000-25000(EVB ripple voltage))
   * If frequency is between 816Mhz-1119MHz, ripple voltage is 50000uV, the
target
   * voltage will add 50000uV(75000-25000(EVB ripple voltage))
   */

   rockchip,board-irdrop = <
   /*MHz MHz  uV */
      0    815   37500
      816  1119  50000
      1200 1512  75000
   >;
};
```

Для отключения функции удалите свойство rockchip,board-irdrop.

### 3.8 Настройка широкого температурного диапазона

Под широким температурным диапазоном обычно понимается температура окружающей среды от -40 °C до +85 °C.

Предпосылка: в исходном документе отмечено, что некоторые платформы нестабильны при низкой температуре, но работают устойчиво после повышения напряжения на отдельных частотах. Поэтому напряжение требуется регулировать по температуре. Кроме того, высокая температура вместе с высоким напряжением сокращает срок службы микросхемы, поэтому частоту и напряжение также следует ограничивать по температуре.

Принцип работы: когда температура падает ниже заданного значения, система повышает напряжение каждой частотной точки. Если оно превышает максимальное разрешённое напряжение, соответствующая частота запрещается. После возвращения к нормальной температуре восстанавливаются исходные напряжения. Когда температура превышает заданное значение, ограничиваются частоты, требующие напряжения выше установленного предела. После нормализации температуры ограничение частоты снимается.

Настройка: для низких температур добавьте в таблицу OPP rockchip,temp-hysteresis, rockchip,low-temp, rockchip,low-temp-min-volt, rockchip,low-temp-adjust-volt и rockchip,max-volt. Для высоких температур добавьте rockchip,temp-hysteresis, rockchip,high-temp и rockchip,high-temp-max-volt. Обычно эти настройки находятся в DTSI.

```text
cpu0_opp_table: opp_table0 {
   compatible = "operating-points-v2";

   opp-shared;

   /*
   * Hysteresis parameter, unit is millicelusius, prevent from entry into low
   * temperatures or high temperatures frequently
   * For example, when temperature less than 0 Celsius degrees, work on the low
   * temperature state, higher than 5 Celsius degrees, return to normal state.
   * Temperature is higher than 85 Celsius degrees work on the high temperature
state,
   * less than 80 Celsius degrees to return to normal state.
   */
   rockchip,temp-hysteresis = <5000>;
   rockchip,low-temp = <0>; /* Threshold for low temperature, millicelsius*/

   rockchip,low-temp-min-volt = <900000>; /* Minimum voltage at low
temperature, uV */
   /* In lower temperature state, add 25mV to frequency at 0-1800MHz */
   rockchip,low-temp-adjust-volt = <
      /* MHz MHz  uV */
        0    1800 25000
   >;
   /* highest voltage, unit is uV */
   rockchip,max-volt = <1250000>;

   rockchip,high-temp = <85000>; /* Threshold for high temperature,
millicelsius */

   /*
   * the highest voltage at high temperature state, if value exceeds which, the
   * frequency will be ristricted
   */
   rockchip,high-temp-max-volt = <1200000>;
   ...

}
```

## 4. Интерфейс пользовательского пространства

На платформах без big.LITTLE, например RK3288, RK3326 и RK3328, все ядра имеют общий тактовый сигнал и общий пользовательский интерфейс `/sys/devices/system/cpu/cpufreq/policy0/`.

На платформах big.LITTLE, например RK3368 и RK3399, имеются два кластера, каждый со своим тактовым сигналом и пользовательским интерфейсом. Например, cluster0 содержит малые ядра и использует `/sys/devices/system/cpu/cpufreq/policy0/`, а cluster1 содержит большие ядра и использует `/sys/devices/system/cpu/cpufreq/policy4/`. В английском оригинале путь policy0 разорван вставкой «In the»; путь восстановлен по китайскому оригиналу и примерам.

Через пользовательский интерфейс можно менять governor, проверять текущую частоту и изменять её, как показано ниже:

```text
related_cpus          /* All CPUs at the same cluster*/
affected_cpus         /* All online CPUs at the same cluster */
cpuinfo_transition_latency /* the transition time of two frequencies, unit is

ns */
cpuinfo_max_freq      /* the maximun operated frequency */
cpuinfo_min_freq      /* the minimun operated frequency */
cpuinfo_cur_freq      /* current frequency get from hardware */
scaling_available_frequencies /* available frequencies */
scaling_available_governors /* available cpufreq governors */
scaling_governor      /* current cpufreq governor */
scaling_cur_freq      /* the last frequency set by software*/
scaling_max_freq      /* the maximum frequency restricted on software*/
scaling_min_freq      /* the minimum frequency restricted on software*/
scaling_setspeed      /* used to change frequency when governor is
userspace */
stats/time_in_state   /* record work time at each frequency, unit is 10ms

*/
stats/total_trans     /* record frequency scaling times */
stats/trans_table     /* record frequency scaling times of each frequency
*/
```

## 5. Частые вопросы

### 5.1 Максимальная частота разных платформ

| Микросхема | Ядра ARM | Максимальная частота |
| --- | --- | --- |
| RK312x | 4 * A7 | 1200MHz |
| RK322x | 4 * A7 | 1464MHz |
| RK3288 | 4 * A17 | 1608MHz |
| RK3328 | 4 * A53 | 1296MHz |
| RK3368 | 4 * A53 + 4 * A53 | 1512MHz(большие) + 1200MHz(малые) |
| RK3399 | 2 * A72 + 4 * A53 | 1800MHz(большие) + 1416MHz(малые) |

### 5.2 Просмотр таблицы OPP

Выполните следующую команду:

```text
cat /sys/kernel/debug/opp/opp_summary
```

Пример для PX30:

```text
 device          rate(Hz) target(uV) min(uV) max(uV)
-------------------------------------------------------------------
 cpu0

                408000000  950000   950000  1350000
                600000000  950000   950000  1350000
                816000000  1000000 1000000  1350000
               1008000000  1125000 1125000  1350000
               1200000000  1275000 1275000  1350000
               1248000000  1300000 1300000  1350000
               1296000000  1350000 1350000  1350000
               1416000000  1350000 1350000  1350000
               1512000000  1350000 1350000  1350000
```

### 5.3 Изменение напряжения OPP

Способ 1: непосредственно измените напряжение каждой точки OPP.

Например, увеличьте напряжение для 816 MHz на 25000 uV. Исходная настройка:

```text
opp-816000000 {
   opp-hz = /bits/ 64 <816000000>;

   opp-microvolt = <1075000 1075000 1350000>;
   opp-microvolt-L0 = <1075000 1075000 1350000>;
   opp-microvolt-L1 = <1050000 1050000 1350000>;
   opp-microvolt-L2 = <1000000 1000000 1350000>;
   opp-microvolt-L3 = <950000 950000 1350000>;
   clock-latency-ns = <40000>;
   opp-suspend;
};
```

После изменения:

```text
opp-816000000 {
   opp-hz = /bits/ 64 <816000000>;
   /* Unit is uV, format <target min max>, add 25000000 to target and min,

   * max is the highest voltage, don't change it.
   */
   opp-microvolt = <1100000 1100000 1350000>;
   opp-microvolt-L0 = <1100000 1100000 1350000>;
   opp-microvolt-L1 = <107500 1075000 1350000>;
   opp-microvolt-L2 = <1025000 1025000 1350000>;
   opp-microvolt-L3 = <975000 975000 1350000>;
   clock-latency-ns = <40000>;
   opp-suspend;
};
```

Способ 2: измените напряжение через настройки IR-Drop, см. раздел 3.7.

Например, увеличьте напряжение на 25000 uV для частот CPU ниже 408 MHz. Пример исходной настройки IR-Drop:

```text
&cpu0_opp_table {
   /*

   * max IR-drop values on different freq condition for this board!
   */
   /*
   * ripple voltage at diffrent frequencies
   * 0Mhz-815MHz，ripple voltage is 37500uV，the target voltage will increase by
   * 12500uV（37500-25000(EVB ripple voltage))
   * 816Mhz-1119MHz，ripple voltage is 50000uV，the target voltage will increase
by
   * 12500uV（50000-25000(EVB ripple voltage))
   * 1200Mhz-1512MHz，ripple voltage is 75000uV，the target voltage will
increase by
   * 50000uV (75000-25000(EVB ripple voltage))
   */

   rockchip,board-irdrop = <
   /*MHz MHz  uV */
      0    815   37500
      816  1119  50000
      1200 1512  75000
   >;
};
```

После изменения:

```text
&cpu0_opp_table {
   /*
   * max IR-drop values on different freq condition for this board!

   */
   /*
   * ripple voltage at diffrent frequencies
   * 0Mhz-408Mhz,ripple voltage is 62500uV, the target voltage will increase by
   * 37500uV(62500-25000(EVB ripple voltage)
   * 409Mhz-815MHz，ripple voltage is 37500uV，the target voltage will increase
by
   * 12500uV(37500-25000(EVB ripple voltage))
   * 816Mhz-1119MHz，ripple voltage is 50000uV，the target voltage will increase
by

   * 12500uV(50000-25000(EVB ripple voltage))
   * 1200Mhz-1512MHz，ripple voltage is 75000uV，the target voltage will
increase by
   * 50000uV((75000-25000(EVB ripple voltage))
   */
   rockchip,board-irdrop = <
   /*MHz MHz  uV */
      0    408   62500 /* from 37500 to 62500 */
      409  815   37500
      816  1119  50000
      1200 1512  75000
   >;

};
```

### 5.4 Фиксация частоты

Способ 1: выберите governor userspace в menuconfig и задайте частоту CPU в узле cru дерева устройств.

Способ 2: отключите ненужные OPP в таблице, оставив только требуемые. Пример для RK3308 с фиксированной частотой CPU 1008 MHz:

```text
cpu0_opp_table: cpu0-opp-table {
      compatible = "operating-points-v2";
      opp-shared;


      opp-408000000 {
         opp-hz = /bits/ 64 <408000000>;
         opp-microvolt = <950000 950000 1340000>;
         clock-latency-ns = <40000>;
         opp-suspend;
         status = "disabled";
      };
      opp-600000000 {
         opp-hz = /bits/ 64 <600000000>;
         opp-microvolt = <950000 950000 1340000>;
         clock-latency-ns = <40000>;

         status = "disabled";
      };
      opp-816000000 {
         opp-hz = /bits/ 64 <816000000>;
         opp-microvolt = <1025000 1025000 1340000>;
         clock-latency-ns = <40000>;
         status = "disabled";
      };
      opp-1008000000 {
         opp-hz = /bits/ 64 <1008000000>;
         opp-microvolt = <1125000 1125000 1340000>;
         clock-latency-ns = <40000>;
      };
   opp-1200000000 {
      opp-hz = /bits/ 64 <1200000000>;
      opp-microvolt = <1250000 1250000 1340000>;

      clock-latency-ns = <40000>;
      status = "disabled";
   };
   opp-1296000000 {
      opp-hz = /bits/ 64 <1296000000>;
      opp-microvolt = <1300000 1300000 1340000>;
      clock-latency-ns = <40000>;
      status = "disabled";
   };
};
```

Способ 3: выполните команды во время работы устройства:

Для микросхем без big.LITTLE, например RK3288:

```text
/* set governor to userspace */
echo userspace > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor

/* set frequency to 216MHz */
echo 216000 > /sys/devices/system/cpu/cpufreq/policy0/scaling_setspeed
```

Для микросхем big.LITTLE, например RK3399:

```text
/* set LITTLE core governor to userspace */
echo userspace > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
/* set LITTLE core frequency to 216Mhz */

echo 216000 > /sys/devices/system/cpu/cpufreq/policy0/scaling_setspeed

/* set big core governor to userspace */
echo userspace > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor
/* set big core frequceny to 408Mhz */
echo 408000 > /sys/devices/system/cpu/cpufreq/policy4/scaling_setspeed
```

Примечание: установка частоты CPU через узел cpufreq обычно одновременно изменяет напряжение, кроме случая, когда обе частоты используют одинаковое напряжение.

### 5.5 Просмотр текущей частоты

Частоту можно проверить через пользовательский интерфейс cpufreq или интерфейс debugfs тактирования.

Для микросхем без big.LITTLE:

```text
/* Method 1: cpufreq userspace interface */
cat /sys/devices/system/cpu/cpufreq/policy0/scaling_cur_freq


/* Method 2: clock debug interface */
cat /sys/kernel/debug/clk/armclk/clk_rate
```

Для микросхем big.LITTLE:

```text
/* Method 1: cpufreq userspace interface */
cat /sys/devices/system/cpu/cpufreq/policy0/scaling_cur_freq /* LITTLE core
frequency */

cat /sys/devices/system/cpu/cpufreq/policy4/scaling_cur_freq /* big core
frequency */

/* Method 2: clock debug interface*/
cat /sys/kernel/debug/clk/armclkl/clk_rate /* LITTLE core frequency*/
cat /sys/kernel/debug/clk/armclkb/clk_rate /* big core frequency */
```

### 5.6 Просмотр текущего напряжения

Для микросхем без big.LITTLE:

```text
/* here vdd_core is not the fixing name, please modify */
cat /sys/kernel/debug/regulator/vdd_core/voltage
```

Для микросхем big.LITTLE:

```text
/* here vdd_core_l and vdd_core_b are not the fixing name, please modify */
cat /sys/kernel/debug/regulator/vdd_core_l/voltage /* LITTLE core voltage*/

cat /sys/kernel/debug/regulator/vdd_core_b/voltage /* big core voltage*/
```

### 5.7 Раздельная настройка частоты и напряжения

Выберите governor userspace для cpufreq, см. способ 3 в разделе 5.4.

Для установки частоты используйте интерфейс debugfs тактирования:

```text
/* For non big.LITTLE core chipset,like RK3288, set frequency to 216MHz */
echo 216000000 > /sys/kernel/debug/clk/armclk/clk_rate /* set frequency */

cat /sys/kernel/debug/clk/armclkl/clk_rate /* get frequency */

/*
 * For big.LITTLE core chipset, such as RK3399, set LITTLE core frequncy to
216MHz, set
 * big core frequency to 408MHz
 */
echo 216000000 > /sys/kernel/debug/clk/armclkl/clk_rate /* set LITTLE core
frequency */
cat /sys/kernel/debug/clk/armclkl/clk_rate /* get LITTLE core
frequency*/
echo 408000000 > /sys/kernel/debug/clk/armclkb/clk_rate /* set big core frequency
*/

cat /sys/kernel/debug/clk/armclkb/clk_rate /* get big core
frequency*/
```

Для установки напряжения используйте интерфейс debugfs регулятора:

```text
/*
 * For non big.LITTLE core chipset,like RK3288, set voltage to 950mV
 * vdd_core is not the fixed name, please modify according to the actual

regulator
 * configuration
 */
echo 950000 > /sys/kernel/debug/regulator/vdd_core/voltage /* set voltage */
cat /sys/kernel/debug/regulator/vdd_core/voltage /* get voltage */

/*
 * For big.LITTLE core chipset, such as RK3399, LITTLE core set to 950mV, big
core set
 * to 1000mV
 * vdd_core_l and vdd_core_b are not the fixed name, please modify according to
the

 * actual regulator configuration
 */
/* set LITTLE core voltage */
echo 950000 > /sys/kernel/debug/regulator/vdd_core_l/voltage
/* get LITTLE core voltage */
cat /sys/kernel/debug/regulator/vdd_core_l/voltage
echo 950000 > /sys/kernel/debug/regulator/vdd_core_b/voltage /* set big core
voltage */
cat /sys/kernel/debug/regulator/vdd_core_b/voltage /* get big core
voltage */
```

Внимание: перед повышением частоты сначала увеличьте напряжение. При понижении сначала уменьшите частоту, затем напряжение.

### 5.8 Просмотр селектора напряжения OPP

Если поддерживается изменение напряжения по PVTM, выполните следующую команду:

```text
dmesg | grep pvtm
```

Пример вывода для RK3399:

```text
[  0.669456] cpu cpu0: temp=22222, pvtm=138792 (140977 + -2185)
/* pvtm-volt-sel=0, opp-microvolt-L0 property will be used in little cpu OPP
table */

[  0.670601] cpu cpu0: pvtm-volt-sel=0
[  0.683008] cpu cpu4: temp=22222, pvtm=148761 (150110 + -1349)
/* pvtm-volt-sel=1, opp-microvolt-L1 property will be used in big cpu OPP table
*/
[  0.683109] cpu cpu4: pvtm-volt-sel=1
[  1.495247] rockchip-dmc dmc: Failed to get pvtm
[  3.366028] mali ff9a0000.gpu: temp=22777, pvtm=120824 (121698 + -874)
[  3.366915] mali ff9a0000.gpu: pvtm-volt-sel=0
```

Аналогично, если поддерживается изменение напряжения по leakage, следующая команда выдаст похожую информацию.

```text
dmesg | grep leakage
```

### 5.9 Просмотр текущего leakage

Выполните следующую команду:

```text
dmesg | grep leakage
```

Пример вывода для CPU RK3399:

```text
[  0.656175] cpu cpu0: leakage=10 /* leakage=10，little cpu leakage is 10mA */
[  0.671092] cpu cpu4: leakage=20 /* leakage=20，big cpu leakage is 20mA */
[  1.492769] rockchip-dmc dmc: Failed to get leakage

[  3.341084] mali ff9a0000.gpu: leakage=15
```

{% endraw %}
