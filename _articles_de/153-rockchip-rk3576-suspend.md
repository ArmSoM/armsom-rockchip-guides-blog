---
title: "RK3576: System-Suspend, Leistungsmodi, DTS und Aufwecken"
description: "RK3576: System-Suspend, Leistungsmodi, DTS und Aufwecken — V1.0.0"
excerpt: "RK3576: System-Suspend, Leistungsmodi, DTS und Aufwecken"
translation_key: 153-rockchip-rk3576-suspend
slug: 153-rockchip-rk3576-suspend
lang: de
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3576, suspend, DTS]
---

{% raw %}

# RK3576: System-Suspend, Leistungsmodi, DTS und Aufwecken

Vollständige chinesische Quelle V1.0.0 für RK3576, Kernel 6.10. Nur ArmSoM-Plattformreferenz: konkrete Platine, SoC, SDK/BSP, trust/BL31, Kernel, PMIC, Versorgung, Quarz und Aufweckschaltung prüfen. Keine pauschale Unterstützung aller ArmSoM-Platinen. Kein englisches Original vorhanden; alle vier Sprachen folgen der chinesischen Quelle. Keine separaten technischen Abbildungen; Konfigurationen und Logs bleiben kopierbarer Text. Keine ArmSoM-Hardwaretests oder Suspend-/Versorgungsbefehle ausgeführt.

> Fehlerhafte Abschalt- oder Aufweckeinstellungen können Resume verhindern oder Datenverlust verursachen. Makros, Logwerte und Platzhalter bleiben erhalten; mit dem tatsächlichen BSP abgleichen. Der Text nennt RKPM_TIMEOUT_WAKEUP_EN, der Code RKPM_TIMEOUT_WKUP_EN. Beispiele nutzen RKPM_SLP_PMIC_LP, ohne dass die Makroliste ihn definiert; keine Definition wurde erfunden. Die Quelltabelle nennt ausdrücklich Linux 6.10. Dies bleibt als offene Quellenfrage erhalten und wird nicht stillschweigend in 6.1 geändert.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. System-Suspend

Bei SoCs mit bl31 wird System-Suspend in bl31 ausgeführt. Die Implementierungen unterscheiden sich je Plattform; Optionen und Verfahren anderer Plattformen sind daher nicht übertragbar. Dieses Handbuch gilt nur für RK3576. Typischerweise werden Power-Domains, IP-Blöcke, Takte und PLLs abgeschaltet, DDR in Self-Refresh versetzt, der Systembus auf einen langsamen Takt (24M oder 32K) umgestellt, vdd_arm/vdd_log abgeschaltet und Aufweckquellen konfiguriert. Für die unterschiedlichen Produktanforderungen werden die DTS-Einstellungen beim Booten an bl31 übergeben.

### 1.1 Treiberdateien

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3576.h
```

### 1.2 DTS-Knoten

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "okay";
    // 休眠log开关配置，0：关闭打印， 1：打开打印
    rockchip,sleep-debug-en = <1>;
    // 常规配置
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_LOGOFF
        | RKPM_SLP_PMU_PMUALIVE_32K
        | RKPM_SLP_PMU_DIS_OSC
        | RKPM_SLP_PMIC_LP
        | RKPM_SLP_32K_EXT
        )
    >;
    // 唤醒源配置
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        )
    >;
    // io retention功能配置
    rockchip,sleep-io-ret-config = <
        (0)
    >;
    // sleep pin配置
    rockchip,sleep-pin-config = <
        (0
        | RKPM_SLEEP_PIN0_EN
        )
        (0)
    >;
};
```

## 2. DTS-Konfiguration

Die derzeit unterstützten Konfigurationsoptionen sind hier definiert:

```text
./include/dt-bindings/suspend/rockchip-rk3576.h
```

### 2.1 Allgemeine Konfiguration

Eigenschaft

```text
rockchip,sleep-mode-config = <...>;
```

Konfigurationsoptionen

```text
// 断电vdd_arm，且DDR控制器断电，需要硬件电路设计上能⽀持
#define RKPM_SLP_ARMOFF_DDRPD       BIT(2)
// 断电vdd_arm和vdd_log，需要硬件电路设计上能⽀持
#define RKPM_SLP_ARMOFF_LOGOFF      BIT(3)
// 断电vdd_arm和vdd_log，且PMU1电源域断电，需要硬件电路设计上能⽀持
#define RKPM_SLP_ARMOFF_PMUOFF      BIT(4)

// 休眠时使⽤32K时钟源作为系统时钟
#define RKPM_SLP_PMU_PMUALIVE_32K   BIT(9)
// 关闭24M晶振，最低功耗模式时可使能，需要配合RKPM_SLP_PMU_PMUALIVE_32K使⽤
#define RKPM_SLP_PMU_DIS_OSC        BIT(10)
// 休眠时的32K时钟源是否选⽤外部的32K钟源，不配该选项则默认选⽤内部32K时钟源，需要配合RKPM_SLP_PMU_PMUALIVE_32K使⽤
#define RKPM_SLP_32K_EXT            BIT(24)
// 休眠定时唤醒功能，⽤于测试使⽤
#define RKPM_SLP_TIME_OUT_WKUP      BIT(25)
// 休眠时输出pmu状态机波形，⽤于debug使⽤
#define RKPM_SLP_PMU_DBG            BIT(26)
```

Hinweise: Die Optionen müssen zu den benötigten Aufweckquellen passen. Für USB-Wakeup müssen USB-Versorgung und -Takte im Suspend aktiv bleiben; RKPM_SLP_ARMOFF_LOGOFF, RKPM_SLP_PMU_DIS_OSC und RKPM_SLP_PMU_PMUALIVE_32K dürfen daher nicht gesetzt werden. RKPM_SLP_PMU_DBG: Der PMU-Zustandsautomat gibt im Suspend fortlaufend eine spezielle Wellenform an GPIO0_B0 aus, um seinen internen Zustand anzuzeigen. Dies dient nur Suspend-/Resume-Tests und Debugging.

RKPM_SLP_TIME_OUT_WKUP: Das System wacht nach ungefähr 1s im Suspend automatisch auf; nur der interne PMU-Timer kann es aufwecken. Nur für Suspend-/Resume-Tests und Debugging.

### 2.2 Aufweckkonfiguration

Eigenschaft

```text
rockchip,wakeup-config = <...>;
```

Konfigurationsoptionen

```text
// ⽀持所有的中断唤醒（经过GIC管理的休眠可唤醒中断），⼀般由cpu0运⾏休眠流程，需要时只配RKPM_CPU0_WKUP_EN即可
#define RKPM_CPU0_WKUP_EN       BIT(0)
#define RKPM_CPU1_WKUP_EN       BIT(1)
#define RKPM_CPU2_WKUP_EN       BIT(2)
#define RKPM_CPU3_WKUP_EN       BIT(3)
#define RKPM_CPU4_WKUP_EN       BIT(4)
#define RKPM_CPU5_WKUP_EN       BIT(5)
#define RKPM_CPU6_WKUP_EN       BIT(6)
#define RKPM_CPU7_WKUP_EN       BIT(7)
// GPIO0唤醒
#define RKPM_GPIO_WKUP_EN       BIT(8)
// SDMMC唤醒
#define RKPM_SDMMC_WKUP_EN      BIT(9)
// SDIO唤醒
#define RKPM_SDIO_WKUP_EN       BIT(10)
// USB DEV唤醒
#define RKPM_USB_WKUP_EN        BIT(11)
// UART1唤醒
#define RKPM_UART_WKUP_EN       BIT(12)
// MCU唤醒
#define RKPM_MCU_WKUP_EN        BIT(13)
// PMU TIMER唤醒
#define RKPM_TIMER_WKUP_EN      BIT(14)
// ⽀持所有的中断唤醒（不经过GIC管理），不推荐使⽤
#define RKPM_SYSINT_WKUP_EN     BIT(15)
// pwm唤醒，⼀般⽤于红外唤醒使⽤
#define RKPM_PWM_WKUP_EN        BIT(16)
// tsadc唤醒
#define RKPM_TSADC_WKUP_EN      BIT(17)
// hptimer唤醒
#define RKPM_HPTIMER_WKUP_EN    BIT(18)
// saradc唤醒
#define RKPM_SARADC_WKUP_EN     BIT(19)
// PMU内部timer唤醒（默认1s），⽤于测试和debug
#define RKPM_TIMEOUT_WKUP_EN    BIT(20)
```

Hinweise: RKPM_GPIO_WKUP_EN (bevorzugt):

Von GPIO0–4 unterstützt dieser Modus nur GPIO0-Pins. Ihre Interrupts gehen direkt an den PMU-Zustandsautomaten, ohne den GIC zu durchlaufen. Benötigte Aufweckquellen beim Hardwareentwurf möglichst auf GPIO0 legen. RKPM_CPU0_WKUP_EN (zweite Wahl): unterstützt alle im Kernel mittels enable_irq_wake() beim GIC registrierten aufweckfähigen Interrupts und damit mehr Quellen als RKPM_GPIO_WKUP_EN. Die Verwaltung verteilt sich aber auf Kernelmodule, sodass unerwartete Interrupts das System wecken können. RKPM_TIMEOUT_WAKEUP_EN: interner PMU-Timer mit standardmäßig 1s bis zum Interrupt, normalerweise nur für Suspend-/Resume-Tests während der Entwicklung.

### 2.3 I/O-Retention konfigurieren

Mit dieser Eigenschaft lässt sich bei ausgeschaltetem vdd_logic im Suspend ein I/O-Pegel halten. Eigenschaft:

```text
rockchip,sleep-io-ret-config = <
    (0
    | RKPM_VCCIO0_RET_EN
    ...
    )
>;
```

Konfigurationsoptionen

```text
// ⽀持配置以下九个io域
#define RKPM_VCCIO0_RET_EN      BIT(0)
#define RKPM_VCCIO1_RET_EN      BIT(1)
#define RKPM_VCCIO2_RET_EN      BIT(2)
#define RKPM_VCCIO3_RET_EN      BIT(3)
#define RKPM_VCCIO4_RET_EN      BIT(4)
#define RKPM_VCCIO5_RET_EN      BIT(5)
#define RKPM_VCCIO6_RET_EN      BIT(6)
#define RKPM_VCCIO7_RET_EN      BIT(7)
#define RKPM_PMUIO1_RET_EN      BIT(8)
```

Hinweis: Zum Halten eines I/O-Pegels muss dessen I/O-Domain konfiguriert und weiterhin versorgt werden. Andernfalls lässt sich der Pegel nicht halten.

### 2.4 Sleep-Pin konfigurieren

Sleep-Pins schalten im Suspend Versorgungen ab. Die Konfiguration muss zur tatsächlichen Hardware passen. Eigenschaft:

```text
rockchip,sleep-pin-config = <
    (0
    | RKPM_SLEEP_PIN0_EN
    ...
    )
    (0
    | RKPM_SLEEP_PIN0_ACT_LOW
    ...
    )
>;
```

Konfigurationsoptionen

```text
// ⽀持以下三个sleep pin
#define RKPM_SLEEP_PIN0_EN          BIT(0)  /* GPIO0_A3 */
#define RKPM_SLEEP_PIN1_EN          BIT(1)  /* GPIO0_A4 */
#define RKPM_SLEEP_PIN2_EN          BIT(2)  /* GPIO0_A5 */

// 如果是拉低sleep pin来关闭电源，则配置下⾯对应项，默认拉⾼sleep pin
#define RKPM_SLEEP_PIN0_ACT_LOW     BIT(0)  /* GPIO0_A3 */
#define RKPM_SLEEP_PIN1_ACT_LOW     BIT(1)  /* GPIO0_A4 */
#define RKPM_SLEEP_PIN2_ACT_LOW     BIT(2)  /* GPIO0_A5 */
```

Hinweis: RK3576 setzt sleep pin0 standardmäßig auf High.

### 2.5 Virtuelles Ausschalten konfigurieren

Bei manchen Produkten lässt sich die Versorgung beim Ausschalten nicht trennen. Suspend kann dann das Ausschalten ersetzen, um den Verbrauch zu senken. Eigenschaft:

```text
// 0：关闭假关机模式， 1：开启假关机模式。
rockchip,virtual-poweroff = <...>;

// 配置关机时的唤醒中断号，系统收到唤醒中断信号后重启开机
rockchip,virtual-poweroff-irqs = < xx xx xx ...>;
```

Hinweis: Ohne rockchip,virtual-poweroff-irqs wird standardmäßig pwm0 channel0 als Aufweckquelle verwendet.

## 3. Protokollmeldungen

Nachfolgend werden bl31-Meldungen bei Suspend und Resume erläutert. Für Kommentare wurden manche Ausgabezeilen aufgeteilt. Unterschiedliche Suspend-Leistungsmodi erzeugen unterschiedliche Logs; maßgeblich ist die tatsächliche Ausgabe. Eigenschaft:

```text
// 0：休眠时不会打印log， 1：休眠时会打印log
rockchip,sleep-debug-en = <...>;
```

RK3576-suspend-Log

```text
// 休眠所⽤bl31版本及commit信息
INFO:    BL31: v2.3():v2.3-775-gacfcb4fbd:derrick.huang, fwver: v1.05

// 休眠模式配置及休眠次数打印
INFO:    enter: cfg=0x1020608, sleeptimes:1

// 休眠模式打印
INFO:    deep
INFO:    armoff_logoff
INFO:    pmu_pmualive_32k
INFO:    pmu_dis_osc
INFO:    pmic_low_power
INFO:    32k ext
INFO:    io_ret (0x8)
INFO:    sleep_pin: 0x1 0x0
INFO:    GPIO POWER INFO:
INFO:           not config

// 休眠gpio中断配置状态打印
INFO:    GPIO0_INTEN: 0xffff 0xffff 0xfd9e 0xffff 0x0 0xd408611e
INFO:    GPIO1_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0xef03f600
INFO:    GPIO2_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0x9fdb0c20
INFO:    GPIO3_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0xaf8c3ec4
INFO:    GPIO4_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0xfe92c7d7

// 休眠系统中断状态打印
INFO:     IRQ_EN: 77
INFO:     IRQ_EN: 108
INFO:     IRQ_EN: 135
INFO:     IRQ_EN: 132
INFO:     IRQ_EN: 189
INFO:     IRQ_EN: 185
INFO:     IRQ_EN: 201
INFO:     IRQ_EN: 197
INFO:     IRQ_EN: 193
INFO:     IRQ_EN: 312
INFO:     IRQ_PED: 268

// 休眠关键寄存器信息打印
INFO:    PMU1_PWR_CON(0x2101) PMU1_CRU_PWR_CON(0x22f) PMU1_WAKEUP_INT_CON(0x100)
PMU2_BUS_IDLE_ST(0x7ffff) PMU2_PWR_GATE_ST(0x3ffffc1)
PMU2_BUS_IDLE_CON(0x0 0x3ff8)
PMU2_PWR_GATE_CON(0x3e 0x0)
PMU2_VOL_GATE_CON(0x31 0x200)
PMU1_DDR_PWR_CON(0x2b 0x2b)
PMU1_PLLPD_CON(0xfff)
INFO:    PMU0_PWR_CON(0x0) PMU0_WAKEUP_INT_CON(0x0)
PMU0_DDR_RET_CON(0x0 0x0) PMU0_GRF_OS_REGS17(0xe707d445)
PMU0GRF_SOC_CON5(0x64)
```

RK3576-resume-Log

```text
// 唤醒流程步骤打印
012abcdef3456789
987654fedcba3210

// 唤醒源
INFO:    wake up status: 0x100
INFO:    GPIO0 interrupt wakeup: 0x40

// gpio唤醒的话会打印出具体的gpio
INFO:      gpio0_a6
```

## 4. Typische Konfigurationen

### 4.1 Logic-Abschaltmodus

Dieser Modus unterstützt das Abschalten von vdd_logic zur Senkung des Suspend-Verbrauchs. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_LOGOFF
        | RKPM_SLP_PMU_PMUALIVE_32K
        | RKPM_SLP_PMU_DIS_OSC
        | RKPM_SLP_PMIC_LP
        | RKPM_SLP_32K_EXT
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        )
    >;
    rockchip,sleep-io-ret-config = <
        (0)
    >;
    rockchip,sleep-pin-config = <
        (0
        | RKPM_SLEEP_PIN0_EN
        )
        (0)
    >;
};
```

### 4.2 PMU1-Abschaltmodus

Zusätzlich zum Abschalten von logic deaktiviert dieser Modus pd pmu1 und erlaubt das Abschalten der PMUIO1-Versorgung. Sein Verbrauch ist niedriger als im Logic-Abschaltmodus. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_PMUOFF
        | RKPM_SLP_PMU_PMUALIVE_32K
        | RKPM_SLP_PMU_DIS_OSC
        | RKPM_SLP_PMIC_LP
        | RKPM_SLP_32K_EXT
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        )
    >;
    rockchip,sleep-io-ret-config = <
        (0)
    >;
    rockchip,sleep-pin-config = <
        (0
        | RKPM_SLEEP_PIN0_EN
        )
        (0)
    >;
};
```

### 4.3 Aufwecken durch uart1

Für UART-Wakeup vorzugsweise uart1 verwenden. Er liegt in pd_pmu1 und kann bei abgeschaltetem logic aufwecken, was den Verbrauch senkt. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_LOGOFF
        | RKPM_SLP_PMIC_LP
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        | RKPM_UART_WKUP_EN
        )
    >;
    rockchip,sleep-io-ret-config = <
        (0)
    >;
    rockchip,sleep-pin-config = <
        (0
        | RKPM_SLEEP_PIN0_EN
        )
        (0)
    >;
};
```

Hinweis: uart1-Wakeup benötigt den laufenden 24M-Quarz; dessen Versorgung darf nicht abgeschaltet werden.

### 4.4 Aufwecken durch usb

Für USB-Wakeup die USB-Versorgungen 0.75V, 1.8V und 3.3V möglichst mit den PMU-Versorgungen zusammenfassen. So ist USB-Wakeup bei ausgeschaltetem logic mit geringerem Verbrauch möglich. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_LOGOFF
        | RKPM_SLP_PMIC_LP
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        | RKPM_USB_WKUP_EN
        )
    >;
    rockchip,sleep-io-ret-config = <
        (0)
    >;
    rockchip,sleep-pin-config = <
        (0
        | RKPM_SLEEP_PIN0_EN
        )
        (0)
    >;
};
```

Hinweis: usb-Wakeup benötigt den laufenden 24M-Quarz; dessen Versorgung darf nicht abgeschaltet werden.

### 4.5 Aufwecken durch pwm

Infrarot-Wakeup benötigt PWM-Wakeup. Infrarot möglichst an pwm0 channel0 anschließen: pwm0 liegt in pd_pmu1 und ermöglicht stromsparendes Aufwecken bei abgeschaltetem logic. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_LOGOFF
        | RKPM_SLP_PMIC_LP
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        | RKPM_PWM_WKUP_EN
        )
    >;
    rockchip,sleep-io-ret-config = <
        (0)
    >;
    rockchip,sleep-pin-config = <
        (0
        | RKPM_SLEEP_PIN0_EN
        )
        (0)
    >;
};
```

Hinweis: pwm-Wakeup benötigt den laufenden 24M-Quarz; dessen Versorgung darf nicht abgeschaltet werden.

### 4.6 Aufwecken durch mcu

Soll die PMU-MCU während Suspend Aufgaben wie Interruptfilterung übernehmen, MCU-Wakeup verwenden. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_DDRPD
        | RKPM_SLP_PMIC_LP
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        | RKPM_MCU_WKUP_EN
        )
    >;
    rockchip,sleep-io-ret-config = <
        (0)
    >;
    rockchip,sleep-pin-config = <
        (0
        | RKPM_SLEEP_PIN0_EN
        )
        (0)
    >;
};
```

Hinweis: mcu-Wakeup benötigt den laufenden 24M-Quarz; dessen Versorgung darf nicht abgeschaltet werden. Auch vdd_logic muss eingeschaltet bleiben.

### 4.7 Aufwecken durch gpio

Für gpio0-Wakeup genügt der Logic-Abschaltmodus, da gpio0 in pd_pmu liegt. Für gpio1–4-Wakeup muss vdd_logic eingeschaltet bleiben. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "okay";
    rockchip,sleep-debug-en = <0>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_DDRPD
        | RKPM_SLP_PMIC_LP
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        | RKPM_CPU0_WKUP_EN
        )
    >;
    rockchip,sleep-io-ret-config = <
        (0)
    >;
    rockchip,sleep-pin-config = <
        (0
        | RKPM_SLEEP_PIN0_EN
        )
        (0)
    >;
};
```

Hinweis: gpio1–4-Wakeup benötigt den laufenden 24M-Quarz; dessen Versorgung darf nicht abgeschaltet werden.

{% endraw %}
