---
title: "Rockchip-Leitfaden zur Leistungsanalyse: Messung, CPU, DDR und Temperaturregelung"
description: "Rockchip-Leitfaden zur Leistungsanalyse: Messung, CPU, DDR und Temperaturregelung — V1.0.1"
excerpt: "Rockchip-Leitfaden zur Leistungsanalyse: Messung, CPU, DDR und Temperaturregelung"
translation_key: "127-rockchip-power-analysis"
slug: "127-rockchip-power-analysis"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: [ArmSoM, Rockchip, DVFS, CPUFREQ, DEVFREQ, DDR]
---

{% raw %}

# Rockchip-Leitfaden zur Leistungsanalyse: Messung, CPU, DDR und Temperaturregelung

Vollständiger technischer Text aus dem chinesischen RK-KF-YF-176 und englischen RK-KF-YF-177, beide V1.0.1. Die Quelle nennt alle Chips/Kernel, ihre Beispiele betreffen jedoch RK3399, RK3126/RK816, RK3326, PX30 und ältere Linux-/Android-Frequenz- und cgroup-Schnittstellen. Für ArmSoM als Plattformreferenz behandeln: SoC, Boardversorgung, PMIC, BSP, Kernelschnittstellen und Messpunkte prüfen. Spannungen und Registerpfade nicht ungeprüft übernehmen. Alle Messwerte sind Quellenbeispiele, keine ArmSoM-Tests; keine Spannungsänderung, Kernabschaltung oder Hardwareprüfung durchgeführt. ZH-Abbildungen stammen aus dem chinesischen PDF, EN/RU/DE aus dem englischen; einige Hardwarebeschriftungen darin bleiben chinesisch.

> Beibehaltene Unklarheiten: Abschnitt 1.3 druckt `80%90%`, der chinesische Abschnitt 3.1 ausdrücklich `~80%-90%`. Ein fehlendes Trennzeichen gilt nicht als bestätigter Bereich. Der Kommentar „10ms Periode“ steht bei `cpu.cfs_quota_us=10000`, „5ms Laufzeit“ bei `cpu.cfs_period_us=5000`: ein semantischer Widerspruch. Auch der DDR-Kommentar `40%-2%/2` ist mit `downdifferential=<20>` abzugleichen. Einige Quellbefehle enden tatsächlich mit einem einzelnen `<`; DTS-Auszüge enthalten keine schließenden Klammern. Sie bleiben erhalten, sind aber keine direkt ausführbaren Skripte. Die Schreibweise `Contex`, kHz-Angaben in cpustats und die Aussage, cpu.shares beeinflusse den Verbrauch nicht, wurden nicht stillschweigend korrigiert. Vor Verwendung am konkreten Kernel und Treiber prüfen.

[ArmSoM Docs](https://docs.armsom.org/) · [Linux kernel documentation](https://docs.kernel.org/)

## 1. Grundbegriffe

### 1.1 Frequenz (clk) und Spannung (voltage)

Ein SoC enthält üblicherweise viele Module, beispielsweise ARM, GPU, DDR, I2C, SPI und USB. Im Betrieb benötigt die digitale Logik jedes Moduls eine geeignete Frequenz und die zugehörige Spannung. Eine höhere Modulfrequenz erfordert eine höhere Spannung. Frequenz und Spannung sind zwei wichtige Parameter der Leistungsaufnahme.

### 1.2 Spannungsdomänen VD (voltage domain) und Leistungsdomänen PD (power domain)

SoC-Module bestehen normalerweise aus digitaler Logik und IO. Die Logik übernimmt Berechnungen und Zustandssteuerung, IO die Übertragung von Schnittstellensignalen. Manche Module, etwa ARM und GPU, besitzen keinen IO-Anteil. Logik und IO werden üblicherweise getrennt versorgt. Die IO-Leistungsaufnahme ist relativ konstant, während die der Logik stark von Frequenz und Spannung abhängt. Zur Optimierung wird die digitale Logik in Spannungs- und Leistungsdomänen unterteilt.

Eine Spannungsdomäne umfasst mehrere Module mit einer gemeinsamen externen Versorgung, deren Spannung unabhängig eingestellt oder abgeschaltet werden kann. Module mit ähnlichen Betriebsspannungen und geringem Verbrauch können zusammengefasst werden. Für leistungsstarke Module empfiehlt sich eine eigene Domäne: Das erleichtert die Verwaltung und verhindert, dass der Spitzenstrom die Grenze der externen Versorgung überschreitet. Die Spannung muss den höchsten Bedarf aller aktiven Module erfüllen; abgeschaltete Module zählen nicht.

Nicht alle Module einer Domäne arbeiten gleichzeitig. Inaktive, aber versorgte Module verursachen Leckstrom. Deshalb wird eine Spannungsdomäne in Bereiche mit unabhängig abschaltbarer Versorgung (switch off) unterteilt. Ein abgeschalteter Bereich wird von anderen Modulen isoliert (isolation), was den Leckstrom deutlich verringert. Ein solcher Bereich heißt Leistungsdomäne.

Der RK3399 besitzt sechs VD:

- VD_CORE_B: zwei große Contex-A72-Kerne; wegen hoher Leistungsaufnahme eigene Domäne.
- VD_CORE_L: vier kleine Contex-A53-Kerne; ebenfalls eigene Domäne wegen hoher Leistungsaufnahme.
- VD_LOGIC: Peripheriecontroller und Systembusse wie USB, EMMC, GMAC, SPI, I2C, EDP, VOP, AXI, AHB und APB.
- VD_CENTER: vdpu, vepu, iep, rga und DDR-Controller.

- VD_GPU: GPU; wegen hoher Leistungsaufnahme eigene Domäne.
- VD_PMU: PMU, SRAM, GPIO, PVTM und weitere am Standby-/Aufwachablauf beteiligte Module.

Das Blockdiagramm folgt unten.

![Spannungs- und Leistungsdomänen des RK3399](/docs/rockchip-power-analysis/assets/en-p005-figure-01.png)

*Spannungs- und Leistungsdomänen des RK3399*

### 1.3 DCDC (Direct Current) und LDO (low dropout regulator)

Die externe SoC-Versorgung verwendet hauptsächlich DCDC und LDO. DCDC bezeichnet üblicherweise ein Schaltnetzteil mit hohem Wirkungsgrad; die Originalzeile druckt den Wert als „80%90%“ ohne eindeutiges Trennzeichen. Bei großen Strömen erhöht DCDC die Versorgungseffizienz. Beim LDO entspricht der Eingangsstrom dem Ausgangsstrom; der Wirkungsgrad ist daher Ausgangsspannung/Eingangsspannung. Bei 3.8V Eingang und 1.0V Ausgang beträgt er 1V/3.8V=26.3% und ist somit niedrig.

Beispiel RK3126+RK816: Die vier BUCK-Kanäle des RK816 versorgen ARM, LOG, DDR und IO des RK3126, da dort relativ große Ströme fließen. BUCK ist ein abwärtswandelnder DCDC-Wandler. Die sechs LDOs versorgen PLL, PHY und einige Peripheriemodule mit normalerweise kleinen Strömen. Das Versorgungsdiagramm folgt unten.

![Versorgung von RK3126 und RK816](/docs/rockchip-power-analysis/assets/en-p006-figure-01.png)

*Versorgung von RK3126 und RK816*

### 1.4 Statische und dynamische Leistungsaufnahme

Statische Leistungsaufnahme entsteht durch Transistorleckströme bei inaktiven SoC-Modulen; sie steigt mit Temperatur und Spannung. Dynamische Leistungsaufnahme entsteht durch Schaltvorgänge in den Schaltungen eines aktiven Moduls und steigt mit Frequenz und Spannung.

Formel der dynamischen Leistungsaufnahme: C ist konstant, V die Spannung, F die Frequenz.

```text
    /* C is constant, V is voltage, F is frequency*/
    P(d)= C * V^2 * F
```

### 1.5 DVFS (Dynamic Voltage and Frequency Scaling), CPUFREQ und DEVFREQ

Höhere Betriebsfrequenz und Spannung eines Moduls erhöhen die Leistungsaufnahme. Deshalb werden beide dynamisch angepasst: im Leerlauf abgesenkt und bei hoher Systemlast angehoben.

DVFS bezeichnet die Technik zur dynamischen Frequenz- und Spannungsanpassung als Grundlage von CPUFREQ und DEVFREQ. CPUFREQ ist das Softwareframework zur dynamischen CPU-Frequenzanpassung mit mehreren Strategien; Einzelheiten stehen in „Rockchip-Developer-Guide-Linux4.4-CPUFreq-CN“. DEVFREQ übernimmt die dynamische Frequenzanpassung von Peripherie, nicht der CPU, ebenfalls mit mehreren Strategien; siehe „Rockchip-Developer-Guide-Linux4.4-Devfreq“.

## 2. Messung der Leistungsaufnahme

Vor der Optimierung Spannung und Strom sämtlicher Versorgungsschienen messen, die Daten analysieren und anschließend passende Maßnahmen wählen. Die Temperatur beeinflusst den Verbrauch wesentlich und muss während der Messung fortlaufend aufgezeichnet werden. Abfragebefehl:

```text
cat /sys/class/thermal/thermal_zone0/temp
```

### 2.1 Messverfahren

Einen Widerstand R in Reihe schalten und den Spannungsabfall U messen: I=U/R. Üblich sind 0.01 Ohm; der Widerstand ist jedoch an den Strom anzupassen. Beim RK3399 EVB liegen an den Ausgängen VDD_CPU_B, VDD_CPU_L, VCC_1V8 und VCC_DDR jeweils 0.01-Ohm-Reihenwiderstände zur Spannungsmessung, wie unten dargestellt.

![Strommessschaltung des RK3399 EVB](/docs/rockchip-power-analysis/assets/en-p007-figure-01.png)

*Strommessschaltung des RK3399 EVB*

### 2.2 Messwerkzeug

Bei vielen Versorgungsschienen erhöht eine mehrkanalige Spannungs- und Stromerfassung die Messeffizienz. Das von Rockchip entwickelte Werkzeug PowerMeterage erfasst gleichzeitig Verbrauchsdaten von 20 Kanälen. Die Oberfläche ist unten abgebildet.

![PowerMeterage-Oberfläche aus der Quelle](/docs/rockchip-power-analysis/assets/en-p008-figure-01.png)

*PowerMeterage-Oberfläche aus der Quelle*

Hardwareanschluss von PowerMeterage:

![PowerMeterage-Hardwareanschluss](/docs/rockchip-power-analysis/assets/en-p008-figure-02.png)

*PowerMeterage-Hardwareanschluss*

## 3. Analyse der Verbrauchsdaten

### 3.1 Berechnung der theoretischen Leistungsaufnahme

Mit PowerMeterage den Verbrauch nach Versorgungsschienen aufschlüsseln. DCDC auf die Batterieseite umrechnen; der englische Originaltext nennt den Wirkungsgrad „80%90%“, während der chinesische Abschnitt 3.1 ausdrücklich ~80%-90% schreibt. Beim LDO sind Ausgangs- und Eingangsstrom gleich. DCDC, LDO und weitere Versorgungen auf die Batterieseite umrechnen und zur Gesamtabschätzung addieren. Große Abweichungen von der Batteriemessung können auf Leckströme hindeuten und erfordern weitere Analyse. Es folgt das Beispiel eines statischen Desktops auf dem RK3326 EVB.

Alle Schienenwerte müssen auf die Batterie (3.8V) bezogen werden. Daher ist der Vergleich von gemessenem und berechnetem Batteriestrom zweckmäßig.

| Typ | Versorgung | Spannung (V) | Gemessener Strom (mA) | Berechneter Strom bei 3.8V (mA) | Anmerkung |
| --- | --- | --- | --- | --- | --- |
| DC/DC | VDD_ARM | 0.96 | 10.20 | 3.23 | 80% Wirkungsgrad: V * I / Wirkungsgrad / Batteriespannung |
| DC/DC | VDD_LOG | 0.96 | 89.30 | 28.20 | LOG-Beispiel: 0.96 * 89.3 / 0.8 / 3.8 = 28.2 |
| DC/DC | VCC_DDR | 1.26 | 38.50 | 15.91 |  |
| DC/DC | VCC_IO | 2.99 | 4.50 | 4.43 |  |
| LDO | VCC_1V8 | 1.81 | 28.80 | 28.80 | LDO-Ausgangsstrom gleich Eingangsstrom |
| LDO | VDD_1V0 | 1.00 | 10.90 | 10.90 |  |
| LDO | VCC3V0_PMU | 3.01 | 1.20 | 1.20 |  |
| Batterie | VBAT | 3.81 | 94.60 | 92.67 | Berechnung nahe am Messwert |

### 3.2 Vergleich mit dem EVB

Die einzelnen Versorgungsschienen im gleichen Szenario mit dem EVB vergleichen, um Auffälligkeiten zu erkennen. Unten steht der Vergleich des statischen Desktops auf RK3326 EVB und Kundenprototyp. ARM und LOG des Kundenboards sind auffällig und müssen weiter untersucht werden.

| Typ | Versorgung | EVB-Spannung (V) | EVB-Strom (mA) | Kundenspannung (V) | Kundenstrom (mA) |
| --- | --- | --- | --- | --- | --- |
| DC/DC | VDD_ARM | 0.96 | 10.20 | 1.10 | 212.50 |
| DC/DC | VDD_LOG | 0.96 | 89.30 | 1.00 | 151.30 |
| DC/DC | VCC_DDR | 1.26 | 38.50 | 1.27 | 40.50 |
| DC/DC | VCC_IO | 2.99 | 4.50 | 2.99 | 4.80 |
| LDO | VCC_1V8 | 1.81 | 28.80 | 1.81 | 29.80 |
| LDO | VDD_1V0 | 1.00 | 10.90 | 1.00 | 10.20 |
| LDO | VCC3V0_PMU | 3.01 | 1.20 | 3.01 | 1.40 |
| Versorgung | VBAT | 3.81 | 94.60 | 3.81 | 191.6 |

### 3.3 Analyse der einzelnen Versorgungsschienen

#### 3.3.1 VDD_CORE/VDD_CPU/VDD_ARM

Diese drei Namen bezeichnen dieselbe Versorgung der ARM-Kerne. Frequenz-/Spannungstabelle (opp-table) prüfen und gemessene mit eingestellter Spannung vergleichen. Zugehörige Befehle:

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

CPU-Auslastung prüfen und auffällige Tasks oder Interrupts untersuchen.

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

Für VDD_GPU hauptsächlich die Frequenz-/Spannungstabelle sowie die Übereinstimmung von Mess- und Sollspannung über devfreq-Knoten prüfen. Bei manchen SoCs besitzt die GPU keine eigene VD, sondern liegt in VDD_LOGIC; dann ist dessen Spannung zu prüfen.

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

ff400000 ist die GPU-Registeradresse; daher hängt der Name ff400000.gpu vom Chip ab.

#### 3.3.3 VDD_LOGIC

VDD_LOGIC enthält normalerweise viele Module und ist für die Verbrauchsverwaltung in mehrere PD unterteilt. Betriebsfrequenzen und Ein-/Aus-Zustände der Module prüfen.

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

Ein-/Aus-Zustand jeder PD prüfen.

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

Das DDR-Modul liegt üblicherweise in VDD_LOGIC und benötigt relativ viel Leistung. Wie die GPU verwendet es devfreq; Frequenz-/Spannungstabelle und Messspannungen prüfen. DDR besitzt zusätzliche Stromsparparameter wie pd_idle, sr_idle, odt-Schaltung und weitere Timing-Einstellungen. Die Abstimmung ist komplex; dafür die ausführliche DDR-Dokumentation verwenden.

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

Weitere Befehle zur Frequenz- und Spannungseinstellung entsprechen GPU devfreq.

#### 3.3.4 VCC_DDR

VCC_DDR versorgt hauptsächlich DDR-Bausteine und den DDR-IO-Anteil des SoC. Frequenz, Auslastung, Stromspareinstellungen und DDR-Typ beeinflussen den Verbrauch. Selbst unter gleichen Bedingungen können Bausteine verschiedener Hersteller deutlich unterschiedliche Leistungsaufnahmen haben.

#### 3.3.5 VCC_IO

VCC_IO versorgt hauptsächlich die IO-Pads des SoC und einige Peripheriegeräte. Betriebszustand und Leckströme der Peripherie sowie übereinstimmende Pinzustände prüfen, beispielsweise einen High-Ausgang des SoC bei einem angeschlossenen Low-Pin der Peripherie.

### 3.4 Typische Szenarien

#### 3.4.1 Statischer Desktop

Hauptsächlich arbeitet das Anzeigemodul. CPU, GPU und DDR sollten auf minimale Frequenzen und in Stromsparzustände wechseln; VDD_CPU, VDD_GPU und VDD_LOGIC auf die niedrigsten opp-table-Spannungen. clk_summary und pm_genpd_summary prüfen und sicherstellen, dass WIFI, BT und weitere Peripherie ausgeschaltet sind. Der statische Desktop bildet die Grundlage anderer Szenarien und sollte zuerst optimiert werden.

#### 3.4.2 Videowiedergabe

Hauptsächlich arbeitet der Videodecoder VPU/RKVDEC; die GPU ist normalerweise ausgeschaltet. Insbesondere DDR-Frequenz und VDD_LOGIC-Spannung prüfen.

#### 3.4.3 Spiele

Hauptsächlich arbeiten CPU und GPU. Auslastung, Frequenzänderungen und korrekte VDD_CPU-/VDD_GPU-Spannungen analysieren.

#### 3.4.4 Tiefschlaf

Normalerweise sind VDD_CPU und VDD_GPU abgeschaltet; VDD_LOG versorgt nur bestimmte Aufwachmodule. Daher besonders IO, DDR-Bausteine und Peripherie untersuchen.

## 4. Optimierungsstrategien

### 4.1 CPU-Optimierung

cpufreq-Parameter anpassen.

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

Wichtige Parameter: hispeed_freq, target_loads und timer_rate. Für hispeed_freq eine passende Übergangsfrequenz wählen, die die CPU mit optimalem Verbrauch im mittleren Bereich hält; zu hohe oder niedrige Werte begünstigen Sprünge auf hohe Frequenzen. Größere target_loads- oder timer_rate-Werte erleichtern niedrige Frequenzen und verringern sowohl Verbrauch als auch Leistung.

Einige CPUs abschalten und die maximale CPU-Frequenz begrenzen.

```text
/* close cpu2，cpu3 */
echo 0 > /sys/devices/system/cpu/cpu2/online
echo 0 > /sys/devices/system/cpu/cpu3/online

/* set the max frequency of cpu0 to 1200MHz */
echo 1200000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq
```

Bei ARM-Big-Little-SoCs lassen sich rechenintensive Tasks mittels CPUSET an die energieeffizienteren kleinen Kerne binden. Auch bei SMP können Tasks auf bestimmte CPUs konzentriert werden, damit andere Stromsparzustände erreichen. Dadurch können die aktiven CPUs jedoch häufiger hohe Frequenzen benötigen und den Verbrauch sogar erhöhen.

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

Ergänzende Erläuterungen aus der chinesischen Quelle: `background` enthält Hintergrundaufgaben; `foreground` enthält Vordergrundaufgaben; `system-background` enthält Hintergrundaufgaben auf Systemebene; `top-app` enthält die Vordergrundaufgabe mit Eingabefokus. Die englische Quelle nennt diese Gruppen ohne diese Kommentare.

CPU-Zeit rechenintensiver Tasks über CPUCTL begrenzen; CONFIG_CFS_BANDWIDTH muss aktiviert sein.

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

### 4.2 DDR-Optimierung

Szenarioabhängige Frequenzanpassung: unterschiedliche DDR-Frequenzen für 4K-Video, Aufnahme, zwei Displays und weitere Szenarien konfigurieren.

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

Lastabhängige Anpassung: Auslastung überwachen und DDR-Frequenz automatisch regeln. Dies kann die Leistung verringern; mit der Szenariosteuerung kombinieren und bei Bedarf eine feste Frequenz verwenden.

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

Ausführliche DDR-DEVFREQ-Konfiguration und -Optimierung: „Rockchip-Developer-Guide-Linux4.4-Devfreq“.

### 4.3 Optimierung der Temperaturregelung

Ab einer bestimmten Temperatur steigt die Leistungsaufnahme stark, besonders bei hoher Spannung. Hardwarekühlung verbessern. Die softwareseitige Temperaturstrategie so abstimmen, dass starke Temperaturschwankungen vermieden werden. Hohe Spannung bei hoher Temperatur per Software begrenzen.

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

### 4.4 Optimierung der Versorgung

Bei Abwärtswandlung mit großem Spannungsabfall und Strom empfiehlt sich DCDC, um Wirkungsgrad zu erhöhen und Verbrauch zu senken. Beispiel: 3.3V Eingang, 1.0V–50mA Ausgang.

| Versorgungstyp | Eingangsstrom | Leistungsaufnahme |
| --- | --- | --- |
| LDO | 50mA | 165mW |
| DCDC (80% Wirkungsgrad) | 18.9mA | 62.4mW |

{% endraw %}
