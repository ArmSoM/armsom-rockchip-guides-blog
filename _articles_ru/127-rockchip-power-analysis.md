---
title: "Анализ и оптимизация энергопотребления Rockchip: измерения, CPU, DDR и температура"
description: "Анализ и оптимизация энергопотребления Rockchip: измерения, CPU, DDR и температура — V1.0.1"
excerpt: "Анализ и оптимизация энергопотребления Rockchip: измерения, CPU, DDR и температура"
translation_key: "127-rockchip-power-analysis"
slug: "127-rockchip-power-analysis"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: [ArmSoM, Rockchip, DVFS, CPUFREQ, DEVFREQ, DDR]
---

{% raw %}

# Анализ и оптимизация энергопотребления Rockchip: измерения, CPU, DDR и температура

Полный технический текст китайского RK-KF-YF-176 и английского RK-KF-YF-177, оба V1.0.1. Источник заявляет все чипы/ядра, но примеры относятся к RK3399, RK3126/RK816, RK3326, PX30 и старым интерфейсам Linux/Android для частот и cgroup. Для ArmSoM это платформенный справочник: проверьте SoC, линии питания платы, PMIC, BSP, интерфейсы ядра и точки измерения. Не переносите напряжения или пути регистров без проверки. Все данные — примеры источника, не измерения ArmSoM; изменение напряжения, отключение ядер и аппаратные тесты не выполнялись. Рисунки ZH взяты из китайского PDF, EN/RU/DE — из английского; часть аппаратных подписей в английских рисунках остаётся китайской.

> Сохранённые неоднозначности: в 1.3 напечатано `80%90%`, а китайский 3.1 явно пишет `~80%-90%`; отсутствие разделителя не считается подтверждённым диапазоном. Комментарий «период 10ms» связан с `cpu.cfs_quota_us=10000`, а «время работы 5ms» — с `cpu.cfs_period_us=5000`: смысловой конфликт. Комментарий DDR `40%-2%/2` также требует сверки с `downdifferential=<20>`. В некоторых исходных командах действительно есть отдельный `<` в конце; фрагменты DTS не имеют закрывающих скобок. Они сохранены, но не являются готовыми исполняемыми сценариями. Написание `Contex`, метки kHz в cpustats и утверждение об отсутствии влияния cpu.shares на потребление не исправлялись молча. Перед применением сверяйте с фактическим ядром и драйвером.

[ArmSoM Docs](https://docs.armsom.org/) · [Linux kernel documentation](https://docs.kernel.org/)

## 1. Основные понятия

### 1.1 Частота (clk) и напряжение (voltage)

SoC обычно содержит множество модулей: ARM, GPU, DDR, I2C, SPI, USB и другие. Во время работы цифровая логика каждого модуля требует подходящей частоты и соответствующего напряжения. Чем выше частота модуля, тем выше необходимое напряжение. Частота и напряжение — два важных параметра энергопотребления.

### 1.2 Домены напряжения VD (voltage domain) и питания PD (power domain)

Модули SoC обычно состоят из цифровой логики и IO. Логика выполняет вычисления и управление состояниями; IO передаёт сигналы интерфейсов. Некоторые модули, например ARM и GPU, не имеют IO. Питание логики и IO обычно разделено. Потребление IO относительно постоянно, а потребление логики существенно меняется с частотой и напряжением. Для оптимизации цифровую логику делят на домены напряжения и питания.

Домен напряжения объединяет несколько модулей, питаемых от одного внешнего источника; его напряжение можно независимо изменять или отключать. Модули с близкими рабочими напряжениями и небольшим потреблением можно объединить. Мощным модулям лучше выделять отдельный домен: это упрощает управление и предотвращает превышение допустимого пикового тока внешнего источника. Напряжение должно соответствовать наибольшему требованию среди работающих модулей; отключённые модули не учитываются.

Не все модули домена работают одновременно. Неактивные, но запитанные модули имеют ток утечки. Поэтому домен напряжения делят на области с независимым отключением питания (switch off). Отключённая область изолируется (isolation) от остальных, что значительно снижает утечку. Такая область называется доменом питания.

У RK3399 шесть VD:

- VD_CORE_B: два больших ядра Contex-A72; из-за высокого потребления выделен отдельный домен.
- VD_CORE_L: четыре малых ядра Contex-A53; также отдельный домен из-за высокого потребления.
- VD_LOGIC: контроллеры периферии и системные шины, например USB, EMMC, GMAC, SPI, I2C, EDP, VOP, AXI, AHB, APB.
- VD_CENTER: vdpu, vepu, iep, rga и контроллер DDR.

- VD_GPU: GPU; отдельный домен из-за высокого потребления.
- VD_PMU: PMU, SRAM, GPIO, PVTM и другие модули, участвующие в переходе в ожидание и пробуждении.

Блок-схема приведена ниже.

![Домены напряжения и питания RK3399](/docs/rockchip-power-analysis/assets/en-p005-figure-01.png)

*Домены напряжения и питания RK3399*

### 1.3 DCDC (Direct Current) и LDO (low dropout regulator)

Внешние источники питания SoC в основном делятся на DCDC и LDO. DCDC обычно означает импульсный преобразователь с высоким КПД; в исходной строке значение напечатано как «80%90%» без чёткого разделителя. При большом токе DCDC повышает эффективность питания. Для LDO входной ток равен выходному, поэтому КПД равен отношению выходного напряжения к входному. При входе 3.8V и выходе 1.0V КПД составляет 1V/3.8V=26.3%, то есть он низок.

Пример RK3126+RK816: четыре канала BUCK RK816 питают ARM, LOG, DDR и IO RK3126, поскольку их токи относительно велики. BUCK — понижающий DCDC-преобразователь. Шесть LDO RK816 питают PLL, PHY и некоторую периферию RK3126 с обычно небольшими токами. Схема питания приведена ниже.

![Питание RK3126 и RK816](/docs/rockchip-power-analysis/assets/en-p006-figure-01.png)

*Питание RK3126 и RK816*

### 1.4 Статическое и динамическое энергопотребление

Статическое потребление обусловлено током утечки транзисторов, когда модули SoC не работают; оно растёт с температурой и напряжением. Динамическое потребление возникает при переключениях внутренних цепей работающего модуля и растёт с частотой и напряжением.

Формула динамического потребления: C — постоянная, V — напряжение, F — частота.

```text
    /* C is constant, V is voltage, F is frequency*/
    P(d)= C * V^2 * F
```

### 1.5 DVFS (Dynamic Voltage and Frequency Scaling), CPUFREQ и DEVFREQ

Чем выше рабочая частота и напряжение модуля, тем больше потребление. Поэтому их динамически регулируют: снижают при простое системы и повышают при нагрузке.

DVFS — технология динамического изменения частоты и напряжения, лежащая в основе CPUFREQ и DEVFREQ. CPUFREQ — программная инфраструктура динамического изменения частоты CPU с несколькими стратегиями; подробности см. в «Rockchip-Developer-Guide-Linux4.4-CPUFreq-CN». DEVFREQ — инфраструктура динамического изменения частоты периферии, кроме CPU, также с несколькими стратегиями; подробности см. в «Rockchip-Developer-Guide-Linux4.4-Devfreq».

## 2. Измерение энергопотребления

Перед оптимизацией измерьте напряжение и ток всех линий питания, проанализируйте данные и затем выбирайте меры. Температура существенно влияет на потребление, поэтому во время измерений её следует записывать в реальном времени. Команда получения температуры:

```text
cat /sys/class/thermal/thermal_zone0/temp
```

### 2.1 Метод измерения

Включите резистор R последовательно в цепь и измерьте падение напряжения U: ток I=U/R. Обычно используют 0.01 Ом, но сопротивление выбирают с учётом тока. На RK3399 EVB резисторы 0.01 Ом включены последовательно на выходах VDD_CPU_B, VDD_CPU_L, VCC_1V8 и VCC_DDR для измерения напряжения, как показано ниже.

![Цепь измерения тока RK3399 EVB](/docs/rockchip-power-analysis/assets/en-p007-figure-01.png)

*Цепь измерения тока RK3399 EVB*

### 2.2 Измерительное средство

При большом числе линий питания многоканальный регистратор напряжения и тока повышает эффективность измерений. Разработанный Rockchip инструмент PowerMeterage одновременно измеряет данные энергопотребления 20 каналов. Его интерфейс показан ниже.

![Интерфейс PowerMeterage из источника](/docs/rockchip-power-analysis/assets/en-p008-figure-01.png)

*Интерфейс PowerMeterage из источника*

Аппаратное подключение PowerMeterage:

![Аппаратное подключение PowerMeterage](/docs/rockchip-power-analysis/assets/en-p008-figure-02.png)

*Аппаратное подключение PowerMeterage*

## 3. Анализ данных энергопотребления

### 3.1 Расчёт теоретического потребления

Разделите потребление по линиям с помощью PowerMeterage. Пересчитайте DCDC на сторону батареи с указанным в английском оригинале КПД «80%90%»; китайский раздел 3.1 явно пишет ~80%-90%. Для LDO выходной ток равен входному. Пересчитав DCDC, LDO и другие источники на сторону батареи, сложите их для оценки общего потребления. Значительное расхождение с измерением батареи может указывать на утечку и требует анализа. Ниже пример статического рабочего стола RK3326 EVB.

Результаты всех линий необходимо привести к батарее (3.8V). Поэтому удобнее сравнивать измеренный и расчётный ток на стороне батареи.

| Тип | Линия | Напряжение (V) | Измеренный ток (mA) | Расчётный ток при 3.8V (mA) | Примечание |
| --- | --- | --- | --- | --- | --- |
| DC/DC | VDD_ARM | 0.96 | 10.20 | 3.23 | КПД 80%: V * I / КПД / напряжение батареи |
| DC/DC | VDD_LOG | 0.96 | 89.30 | 28.20 | Пример LOG: 0.96 * 89.3 / 0.8 / 3.8 = 28.2 |
| DC/DC | VCC_DDR | 1.26 | 38.50 | 15.91 |  |
| DC/DC | VCC_IO | 2.99 | 4.50 | 4.43 |  |
| LDO | VCC_1V8 | 1.81 | 28.80 | 28.80 | Выходной ток LDO равен входному |
| LDO | VDD_1V0 | 1.00 | 10.90 | 10.90 |  |
| LDO | VCC3V0_PMU | 3.01 | 1.20 | 1.20 |  |
| Батарея | VBAT | 3.81 | 94.60 | 92.67 | Расчёт близок к измерению |

### 3.2 Сравнение с EVB

Сравните потребление отдельных линий с EVB в одинаковом сценарии, чтобы выявить отклонения. Ниже сравнение статического рабочего стола RK3326 EVB и прототипа заказчика. На прототипе заметно отклоняются ARM и LOG; требуется дальнейший анализ.

| Тип | Линия | EVB напряжение (V) | EVB ток (mA) | Прототип напряжение (V) | Прототип ток (mA) |
| --- | --- | --- | --- | --- | --- |
| DC/DC | VDD_ARM | 0.96 | 10.20 | 1.10 | 212.50 |
| DC/DC | VDD_LOG | 0.96 | 89.30 | 1.00 | 151.30 |
| DC/DC | VCC_DDR | 1.26 | 38.50 | 1.27 | 40.50 |
| DC/DC | VCC_IO | 2.99 | 4.50 | 2.99 | 4.80 |
| LDO | VCC_1V8 | 1.81 | 28.80 | 1.81 | 29.80 |
| LDO | VDD_1V0 | 1.00 | 10.90 | 1.00 | 10.20 |
| LDO | VCC3V0_PMU | 3.01 | 1.20 | 3.01 | 1.40 |
| Питание | VBAT | 3.81 | 94.60 | 3.81 | 191.6 |

### 3.3 Анализ отдельных линий

#### 3.3.1 VDD_CORE/VDD_CPU/VDD_ARM

Эти три названия обозначают одно питание — ядер ARM. Проверьте таблицу частот и напряжений (opp-table) и соответствие измеренного напряжения заданному. Команды:

```text
/* Acquire the frequency voltage table, target column means the voltage required
by some frequency */
cat /sys/kernel/debug/opp/opp_summary
 device                rate(Hz)    target(uV)    min(uV)    max(uV)
-------------------------------------------------------------------
...
 cpu0
                      408000000       950000      950000     1350000
                      600000000       950000      950000     1350000
                      816000000      1000000     1000000     1350000
                     1008000000      1125000     1125000     1350000
                     1200000000      1275000     1275000     1350000
                     1248000000      1300000     1300000     1350000
                     1296000000      1350000     1350000     1350000

/* Check the frequency scaling strategy currently used by cpufreq, cpu frequency
scaling is enabled with the default interactive strategy */
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
interactive
/* Set userspace strategy to fix the frequency of cpu, then set different
frequencies, compare the set voltage with the measured voltage */
echo userspace > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
userspace

/* Check the frequency point supported by cpufreq */
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_frequencies
408000 600000 816000 1008000 1200000 1248000 1296000

/* Set the fixed frequency */
echo 408000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_setspeed

/* Confirm current frequency*/
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq
408000

/* Confirm current voltage, and compare with measured value, vdd_arm represents
the name of regulator, which is differnt for differnt projects*/
cat /sys/kernel/debug/regulator/vdd_arm/voltage
950000

/* Acquire current voltages of all regulators*/
cat /sys/kernel/debug/regulator/regulator_summary
 regulator                      use open bypass voltage current     min     max
-------------------------------------------------------------------------------
...
 vcc3v8_sys                       0   12      0  3800mV     0mA  3800mV  3800mV
    deviceless                                                      0mV     0mV
    vdd_logic                     0    4      0   950mV     0mA   950mV  1350mV
       dmc                                                        950mV  1350mV
       ff400000.gpu                                               950mV  1350mV
       bus-apll                                                   950mV  1350mV
       deviceless                                                   0mV     0mV
    vdd_arm                       0    2      0   950mV     0mA   950mV  1350mV
       cpu0                                                       950mV  1350mV
       deviceless                                                   0mV     0mV
...
```

Проверьте загрузку CPU и наличие аномальных задач или прерываний.

```text
/* Use top command to check the task loading, the output of top with different
versions will have difference, this version of top supports to check the thread
and the running cpu of the thread */
top -m 5 -t
User 51%, System 2%, IOW 0%, IRQ 0%
User 712 + Nice 0 + Sys 33 + Idle 634 + IOW 0 + IRQ 0 + SIRQ 0 = 1379

/* PR column represents currently running cpu of the thread, the sum of all cpu
loading percentage is equal to 100%, so the highest loading percentage of each
cpu is 100%/NR_CPU, the highest loading percentage of each CPU of SoC with 4
cores is 25% */
  PID   TID PR CPU% S     VSS     RSS PCY UID      Thread          Proc
 2631  2631  3  25% R   3104K    552K  fg root     busybox         busybox
 2632  2632  2  25% R   3104K    552K  fg root     busybox         busybox
 2633  2633  1   3% R    740K    400K  fg root     top             /data/top
  255   476  0   0% S  15492K   4988K  fg system   HwBinder:255_1  /vendor/bin/hw/android.hardware.sensors@1.0-service
  419   478  1   0% S 3770752K 256884K  fg system   SensorService   system_server

/* Use cpustats to observe the frequency change of cpu */
cpustats
Total: User 600 + Nice 0 + Sys 3 + Idle 591 + IOW 0 + IRQ 0 + SIRQ 0 = 1194
  408000kHz 0 +
  600000kHz 0 +
  816000kHz 0 +
  1008000kHz 0 +
  1200000kHz 0 +
  1248000kHz 0 +
  1296000kHz 0 +
  1416000kHz 0 +
  1512000kHz 1200 = 1200 /* within the statistic time, there are 1200 system
jiffies in total, 1512M running for 1200 jiffies */
/* from below, we can see the loading status of each cpu, including user mode,
kernel mode, interrupt and idle time */
cpu0: User 0 + Nice 0 + Sys 1 + Idle 294 + IOW 0 + IRQ 0 + SIRQ 0 = 295
cpu1: User 299 + Nice 0 + Sys 1 + Idle 0 + IOW 0 + IRQ 0 + SIRQ 0 = 300
cpu2: User 1 + Nice 0 + Sys 1 + Idle 296 + IOW 0 + IRQ 0 + SIRQ 0 = 298
cpu3: User 300 + Nice 0 + Sys 1 + Idle 0 + IOW 0 + IRQ 0 + SIRQ 0 = 301

/* check the ratio of running time for each frequency through cpufreq node, time
unit: jiffies */
cat /sys/devices/system/cpu/cpu0/cpufreq/stats/time_in_state
408000 718186
600000 548
816000 368
1008000 1578
1200000 1104
1248000 84
1296000 101
1416000 678
1512000 47495

/* check the inturrupt quantity of all peripherals */
cat /proc/interrupts
           CPU0       CPU1       CPU2       CPU3
  1:          0          0          0          0     GICv2  29 Edge     arch_timer
  2:     181898     165057     636772     839244     GICv2  30 Edge     arch_timer
  5:     180743      39000      28905      65189     GICv2  62 Level     rk_timer
 13:     260634          0          0          0     GICv2  39 Level     ff180000.i2c
 14:     354805          0          0          0     GICv2  40 Level     ff190000.i2c
 15:          0          0          0          0     GICv2  41 Level     ff1a0000.i2c
...
```

#### 3.3.2 VDD_GPU

Для VDD_GPU прежде всего проверьте таблицу частот и напряжений и соответствие измеренного напряжения заданному через узлы devfreq. В некоторых SoC GPU не имеет отдельного VD и находится в VDD_LOGIC; тогда проверяют напряжение VDD_LOGIC.

```text
/* acquire the frequency voltage table */
cat /sys/kernel/debug/opp/opp_summary
 device                rate(Hz)    target(uV)    min(uV)    max(uV)
-------------------------------------------------------------------
...
 platform-ff400000.gpu
                      200000000       950000      950000      950000
                      300000000       950000      950000      950000
                      400000000      1025000     1025000     1025000
                      480000000      1100000     1100000     1100000
                      520000000      1150000     1150000     1150000
...

/* check the frequency scaling strategy currently used by gpu devfreq, gpu
frequency scaling is enabled with the default simple_ondemand strategy */
cat /sys/class/devfreq/ff400000.gpu/governor
simple_ondemand

/* Set userspace strategy to fix the frequency of gpu, then set different
frequencies, compare the set voltage with measured voltage */
echo userspace > /sys/class/devfreq/ff400000.gpu/governor
cat /sys/class/devfreq/ff400000.gpu/governor
userspace

/* check the frequency points supported by gpu devfreq */
cat /sys/class/devfreq/ff400000.gpu/available_frequencies
520000000 480000000 400000000 300000000 200000000

/* set the fixed frequency */
echo 200000000 > /sys/class/devfreq/ff400000.gpu/userspace/set_freq

/* confirm current frequency */
cat /sys/class/devfreq/ff400000.gpu/cur_freq
200000000

/* confirm current voltage, and compare with measued value */
cat /sys/kernel/debug/regulator/vdd_gpu/voltage
950000

/* check gpu loading */
cat /sys/class/devfreq/ff400000.gpu/load
0@200000000Hz
```

ff400000 — адрес регистра GPU, поэтому имя ff400000.gpu зависит от чипа.

#### 3.3.3 VDD_LOGIC

VDD_LOGIC обычно содержит множество модулей и для управления потреблением разделён на несколько PD. Проверьте рабочие частоты и состояния включения модулей.

```text
cat /sys/kernel/debug/clk/clk_summary
   clock                         enable_cnt  prepare_cnt        rate   accuracy phase
----------------------------------------------------------------------------------------
 xin24m                                   9           10    24000000          0 0
...
    pll_gpll                              1            1  1200000000          0 0
       gpll                               9           20  1200000000          0 0
          clk_sdio_div50                  1            1   100000000          0 0
             clk_sdio                     1            5   100000000          0 0
                sdio_sample               0            1    50000000          0 0
                sdio_drv                  0            1    50000000          0 180
          clk_emmc_div50                  1            1   300000000          0 0
             clk_emmc                     1            5   300000000          0 0
                emmc_sample               0            1   150000000          0 42
                emmc_drv                  0            1   150000000          0 180
...
```

Проверьте состояния включения каждого PD.

```text
cat /sys/kernel/debug/pm_genpd/pm_genpd_summary                                <
domain                          status          slaves
    /device                                             runtime status
----------------------------------------------------------------------
pd_gpu                          off
    /devices/platform/ff400000.gpu                      suspended
pd_vi                           off
    /devices/platform/ff4a8000.iommu                    suspended
pd_vo                           on
    /devices/platform/ff460f00.iommu                    active
    /devices/platform/ff470f00.iommu                    suspended
    /devices/platform/ff2e0000.video-phy                suspended
    /devices/platform/ff450000.dsi                      active
    /devices/platform/ff460000.vop                      active
    /devices/platform/ff470000.vop                      suspended
    /devices/platform/ff480000.rk_rga                   suspended
pd_vpu                          off
    /devices/platform/ff440440.iommu                    suspended
    /devices/platform/ff442800.iommu                    suspended
    /devices/platform/vpu_combo                         suspended
pd_mmc_nand                     on
    /devices/platform/ff380000.dwmmc                    unsupported
    /devices/platform/ff390000.dwmmc                    unsupported
    /devices/platform/ff3b0000.nandc                    active
pd_gmac                         off
pd_sdcard                       off
pd_usb                          on
    /devices/platform/ff300000.usb                      active
```

Модуль DDR обычно находится в VDD_LOGIC и имеет значительное потребление. Как и GPU, он использует devfreq; проверьте таблицу частот/напряжений и реальные напряжения. DDR также имеет настройки низкого потребления: pd_idle, sr_idle, переключение odt и другие timing-параметры. Настройка сложна; обращайтесь к подробной документации DDR.

```text
cat /sys/kernel/debug/opp/opp_summary
 device                rate(Hz)    target(uV)    min(uV)    max(uV)
-------------------------------------------------------------------
 platform-dmc
                      194000000       950000      950000      950000
                      328000000       950000      950000      950000
                      450000000       950000      950000      950000
                      528000000       975000      975000      975000
                      666000000      1000000     1000000     1000000
...

/* ddr uses dmc_ondemand frequency scaling strategy by default */
cat /sys/class/devfreq/dmc/governor
dmc_ondemand
```

Остальные команды настройки частоты и напряжения совпадают с GPU devfreq.

#### 3.3.4 VCC_DDR

VCC_DDR в основном питает микросхемы DDR и DDR-IO SoC. На потребление влияют частота, загрузка, настройки низкого потребления и тип DDR. Даже при одинаковых условиях микросхемы разных производителей могут заметно отличаться по потреблению.

#### 3.3.5 VCC_IO

VCC_IO в основном питает IO-площадки SoC и некоторую периферию. Проверьте рабочее состояние периферии и утечки, а также согласованность состояний выводов SoC и внешнего устройства: например, высокий уровень выхода IO при низком уровне подключённого вывода периферии.

### 3.4 Типовые сценарии

#### 3.4.1 Статический рабочий стол

Работает главным образом дисплейный модуль. CPU, GPU и DDR должны перейти на минимальные частоты и в режим низкого потребления, а VDD_CPU, VDD_GPU и VDD_LOGIC — на минимальные напряжения opp-table. Проверьте clk_summary и pm_genpd_summary; убедитесь, что WIFI, BT и другая периферия отключены. Статический рабочий стол служит базой остальных сценариев, поэтому сначала оптимизируют его.

#### 3.4.2 Воспроизведение видео

Работает в основном видеодекодер VPU/RKVDEC; GPU обычно отключён. Особенно проверьте частоту DDR и напряжение VDD_LOGIC.

#### 3.4.3 Игры

Основная нагрузка приходится на CPU и GPU. Анализируйте их загрузку, изменение частот и корректность напряжений VDD_CPU и VDD_GPU.

#### 3.4.4 Глубокий сон

Обычно питание VDD_CPU и VDD_GPU отключено, а VDD_LOG питает только некоторые модули пробуждения. Поэтому анализируют прежде всего IO, микросхемы DDR и периферию.

## 4. Стратегии оптимизации

### 4.1 Оптимизация CPU

Настройте параметры cpufreq.

```text
/* the default frequency scaling strategy used is interactive, relative
parameters are as follows: */
ls -l /sys/devices/system/cpu/cpu0/cpufreq/interactive
go_hispeed_load     /* when the loading is larger than go_hispeed_load and the
frequency is smaller than hispeed_freq, directly jump to hispeed_freq */
hispeed_freq        /* when jumping from low frequency to high frequency, need to
jump to hispedd_freq first */
above_hispeed_delay /* when the frequency is larger than hispeed_freq, the time
duration before each frequency increase */
min_sample_time     /* after each frequency increase, if it is to reduce the
frequency next time , the time duration before frequency reduce */
target_loads        /* the target loading of the frequency scaling */
timer_rate          /* the loading sampling time，unit:us */
timer_slack         /* the loading sampling time after cpu entering idle */
boost               /* when the frequency is smaller than hispeed_freq, keep
boost to hispeed_freq */
boostpulse          /* when the frequency is smaller than hispeed_freq, boost to
hispeed_freq, keep a while */
boostpulse_duration /* time duration of boostpulse, unit:us */
io_is_busy          /* whether to compute io wait to cpu loading */
```

Основные параметры: hispeed_freq, target_loads, timer_rate. Для hispeed_freq выберите переходную частоту, удерживающую CPU на среднем уровне с оптимальным потреблением; слишком высокое или низкое значение провоцирует скачки к высокой частоте. Увеличение target_loads или timer_rate облегчает работу на низких частотах, снижая и потребление, и производительность.

Отключите часть CPU и ограничьте максимальную частоту.

```text
/* close cpu2，cpu3 */
echo 0 > /sys/devices/system/cpu/cpu2/online
echo 0 > /sys/devices/system/cpu/cpu3/online

/* set the max frequency of cpu0 to 1200MHz */
echo 1200000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq
```

В SoC с архитектурой ARM Big-Little с помощью CPUSET можно привязать тяжёлые задачи к малым ядрам, имеющим лучшую энергоэффективность. Для SMP также можно сосредоточить задачи на отдельных CPU, чтобы остальные вошли в режим низкого потребления. Однако оставшиеся CPU могут чаще работать на высокой частоте, что, напротив, увеличит потребление.

```text
/* create group of litte core*/
mkdir /dev/cpuset/little

/* set cpu used by group of little core */
echo 0-3 > /dev/cpuset/little/cpus

/* add pid=1111 task into the group of little core */
echo 1111 > /dev/cpuset/little/tasks

/* Android system creates several groups by default, the framework layer puts the
tasks into differenct groups, you can adjust cpus of each group, analyze the
power consumption */
ls /dev/cpuset
background
foreground
system-background
top-app
```

Дополнительные пояснения из китайского оригинала: `background` — фоновые задачи; `foreground` — задачи переднего плана; `system-background` — фоновые задачи системного уровня; `top-app` — задача переднего плана, имеющая фокус. Английский оригинал перечисляет эти имена групп без данных комментариев.

Ограничьте долю процессорного времени тяжёлых задач через CPUCTL; требуется CONFIG_CFS_BANDWIDTH.

```text
/* create the group of bandwidth limitation */
mkdir /dev/cpuctl/mygroup

/* set the cycle of bandwidth limitation as 10ms */
echo 10000 > /dev/cpuctl/mygroup/cpu.cfs_quota_us

/* within each cycle, total running time of the tasks in the group cannot exceed
5ms, this value can be larger than cfs_quota_us, because it is the total running
time of multiple cpus */
echo 5000 > /dev/cpuctl/mygroup/cpu.cfs_period_us

/* add relative tasks into the group */
echo 1111 > /dev/cpuctl/mygroup/tasks
echo 1112 > /dev/cpuctl/mygroup/tasks

/* cpu.shares means to limit the bandwidth of the task through weight, used for
performance optimization, without affecting the power consumption */
/dev/cpuctl/mygroup/cpu.shares
```

### 4.2 Оптимизация DDR

Изменение частоты по сценарию: назначьте разные частоты DDR для видео 4K, записи, двух дисплеев и других сценариев.

```text
/* scenario definition */
include/dt-bindings/clock/rk_system_status.h
#define SYS_STATUS_NORMAL       (1<<0)
#define SYS_STATUS_SUSPEND      (1<<1)
#define SYS_STATUS_IDLE         (1<<2)
#define SYS_STATUS_REBOOT       (1<<3)
#define SYS_STATUS_VIDEO_4K     (1<<4)
#define SYS_STATUS_VIDEO_1080P  (1<<5)
...

/* configure the frequencies for different scenarios in dts */
arch/arm64/boot/dts/rockchip/px30.dtsi
dmc: dmc {
    compatible = "rockchip,px30-dmc";
    ...
    system-status-freq = <
        /*system status         freq(KHz)*/
        SYS_STATUS_NORMAL       528000
        SYS_STATUS_REBOOT       450000
        SYS_STATUS_SUSPEND      194000
        SYS_STATUS_VIDEO_1080P  450000
        SYS_STATUS_BOOST        528000
        SYS_STATUS_ISP          666000
        SYS_STATUS_PERFORMANCE  666000
    >;
    ...

/* acquire the current scenario */
cat /sys/class/devfreq/dmc/system_status
0x401
```

Изменение частоты по нагрузке: отслеживайте загрузку и автоматически регулируйте DDR. Это может снизить производительность; совместите с управлением по сценарию и фиксируйте частоту там, где необходимо.

```text
/* configure the parameter of frequency scaling with loading in dts, need to open
dfi node to monitor DDR utility ratio */
dmc: dmc {
    compatible = "rockchip,px30-dmc";
    ...

    /* use dfi to monitor the utility ratio of DDR */
    devfreq-events = <&dfi>;

        /*
     * the threshold of frequency scaling：
     * when the utility ratio is over 40%, adjust to the highest frequency.
     * when the loading is less than 40% and larger than 40%-20%, maintain
current frequency.
     * when the loading is less than 40%-20%, it will adjust the frequency to a
certain value to make the loading to be around 40%-2%/2.
     */
    upthreshold = <40>;
    downdifferential = <20>;

/* check the DDR loading of current system */
cat /sys/class/devfreq/dmc/load                                       <
33@528000000Hz
```

Подробную настройку и оптимизацию DDR DEVFREQ см. в «Rockchip-Developer-Guide-Linux4.4-Devfreq».

### 4.3 Оптимизация температурного управления

При повышении температуры до определённого уровня потребление резко возрастает, особенно при высоком напряжении. Улучшите аппаратное охлаждение. Настройте программную термостратегию, избегая больших колебаний температуры. Программно ограничьте высокое напряжение при высокой температуре.

```text
&cpu0_opp_table {
    /* when the temperature is over 85 degree, limit the max voltage of cpu to
1.1V */
    rockchip,high-temp = <85000>;
    rockchip,high-temp-max-volt = <1100000>;

    /* or directly limit the max frequency to avoid the high voltage */
    rockchip,high-temp-max-freq = <1008000>;
};
```

### 4.4 Оптимизация источника питания

В понижающей схеме при большом падении напряжения и токе рекомендуется DCDC для повышения КПД и уменьшения потребления. Пример: вход 3.3V, выход 1.0V–50mA.

| Источник | Входной ток | Мощность |
| --- | --- | --- |
| LDO | 50mA | 165mW |
| DCDC (КПД 80%) | 18.9mA | 62.4mW |

{% endraw %}
