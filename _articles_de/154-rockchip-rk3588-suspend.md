---
title: "RK3588: System-Suspend, Leistungsmodi, DTS und Aufwecken"
description: "RK3588: System-Suspend, Leistungsmodi, DTS und Aufwecken — V1.1.0"
excerpt: "RK3588: System-Suspend, Leistungsmodi, DTS und Aufwecken"
translation_key: 154-rockchip-rk3588-suspend
slug: 154-rockchip-rk3588-suspend
lang: de
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3588, suspend, DTS]
---

{% raw %}

# RK3588: System-Suspend, Leistungsmodi, DTS und Aufwecken

Vollständige chinesische Quelle V1.1.0 für RK3588, Kernel 5.10. Nur ArmSoM-Plattformreferenz: konkrete Platine, SoC, SDK/BSP, trust/BL31, Kernel, PMIC, Versorgung, Quarz und Aufweckschaltung prüfen. Keine pauschale Unterstützung aller ArmSoM-Platinen. Kein englisches Original vorhanden; alle vier Sprachen folgen der chinesischen Quelle. Keine separaten technischen Abbildungen; Konfigurationen und Logs bleiben kopierbarer Text. Keine ArmSoM-Hardwaretests oder Suspend-/Versorgungsbefehle ausgeführt.

> Fehlerhafte Abschalt- oder Aufweckeinstellungen können Resume verhindern oder Datenverlust verursachen. Makros, Logwerte und Platzhalter bleiben erhalten; mit dem tatsächlichen BSP abgleichen. Der Text nennt RKPM_TIMEOUT_WAKEUP_EN, der Code RKPM_TIME_OUT_WKUP_EN. Beispiele nutzen RKPM_PMUMCU_CEC_WKUP_EN, ohne dass die Makroliste ihn definiert; keine Definition wurde erfunden.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. System-Suspend

Bei SoCs mit trust wird System-Suspend in trust ausgeführt. Die Implementierungen unterscheiden sich je Plattform; Optionen und Verfahren anderer Plattformen sind daher nicht übertragbar. Dieses Handbuch gilt nur für RK3588. Typischerweise werden Power-Domains, IP-Blöcke, Takte und PLLs abgeschaltet, DDR in Self-Refresh versetzt, der Systembus auf einen langsamen Takt (24M oder 32K) umgestellt, vdd_arm/vdd_log abgeschaltet und Aufweckquellen konfiguriert. Für die unterschiedlichen Produktanforderungen werden die DTS-Einstellungen beim Booten an trust übergeben.

### 1.1 Treiberdateien

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3588.h
```

### 1.2 DTS-Knoten

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3588";
    status = "okay";
    // 休眠log开关配置，0：关闭打印， 1：打开打印
    rockchip,sleep-debug-en = <1>;
    // 常规配置
    rockchip,sleep-mode-config = <
        (0
         | RKPM_SLP_ARMOFF_DDRPD
         | RKPM_SLP_PMU_PMUALIVE_32K
         | RKPM_SLP_PMU_DIS_OSC
         | RKPM_SLP_32K_EXT
         | RKPM_SLP_PMU_DBG
        )
        >;
    // 唤醒源配置
    rockchip,wakeup-config = <
        (0
         | RKPM_GPIO_WKUP_EN
        )
        >;
};
```

## 2. DTS-Konfiguration

Die derzeit unterstützten Konfigurationsoptionen sind hier definiert:

```text
./include/dt-bindings/suspend/rockchip-rk3588.h
```

### 2.1 Allgemeine Konfiguration

Konfigurationseigenschaft:

```text
rockchip,sleep-mode-config = <...>;
```

Konfigurationsdefinitionen:

```text
// 断电vdd_arm，需要硬件电路设计上能⽀持
#define RKPM_SLP_ARMOFF             BIT(1)
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
```

Hinweise: Die Optionen müssen zu den benötigten Aufweckquellen passen. Für USB-Wakeup müssen USB-Versorgung und -Takte im Suspend aktiv bleiben; RKPM_SLP_ARMOFF_LOGOFF, RKPM_SLP_PMU_DIS_OSC und RKPM_SLP_PMU_PMUALIVE_32K dürfen daher nicht gesetzt werden.

### 2.2 Aufweckkonfiguration

Konfigurationseigenschaft:

```text
rockchip,wakeup-config = <...>;
```

Konfigurationsdefinitionen:

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
// USB DEV 唤醒
#define RKPM_USB_WKUP_EN        BIT(11)
// UART0唤醒
#define RKPM_UART0_WKUP_EN      BIT(12)
// VAD唤醒
#define RKPM_VAD_WKUP_EN        BIT(13)
// RK TIMER 唤醒
#define RKPM_TIMER_WKUP_EN      BIT(14)
// ⽀持所有的中断唤醒（不经过GIC管理），不推荐使⽤
#define RKPM_SYSINT_WKUP_EN     BIT(15)
// PMU内部timer唤醒（默认1s），⽤于测试和debug
#define RKPM_TIME_OUT_WKUP_EN   BIT(16)
```

Hinweise: RKPM_GPIO_WKUP_EN (bevorzugt): Von GPIO0–4 unterstützt dieser Modus nur GPIO0-Pins. Ihre Interrupts gehen direkt an den PMU-Zustandsautomaten, ohne den GIC zu durchlaufen. Benötigte Aufweckquellen beim Hardwareentwurf möglichst auf GPIO0 legen. RKPM_CPU0_WKUP_EN (zweite Wahl): unterstützt alle im Kernel mittels enable_irq_wake() beim GIC registrierten aufweckfähigen Interrupts und damit mehr Quellen als RKPM_GPIO_WKUP_EN. Die Verwaltung verteilt sich aber auf Kernelmodule, sodass unerwartete Interrupts das System wecken können. RKPM_TIMEOUT_WAKEUP_EN: interner PMU-Timer mit standardmäßig 1s bis zum Interrupt, normalerweise nur für Suspend-/Resume-Tests während der Entwicklung.

### 2.3 Debug-Konfiguration

Konfigurationseigenschaft:

```text
rockchip,sleep-mode-config = <...>;
```

Konfigurationsdefinitionen:

```text
#define RKPM_SLP_TIME_OUT_WKUP      BIT(25)
#define RKPM_SLP_PMU_DBG            BIT(26)
```

Debug-Hinweise: RKPM_SLP_TIME_OUT_WKUP: Das System wacht nach ungefähr 1s im Suspend automatisch auf; nur der interne PMU-Timer kann es aufwecken. Nur für Suspend-/Resume-Tests und Debugging. RKPM_SLP_PMU_DBG gibt im Suspend fortlaufend eine Wellenform für den PMU-Zustand an GPIO0_A5 aus; nur für Tests und Debugging.

### 2.4 I/O-Retention konfigurieren

Mit dieser Eigenschaft lässt sich bei ausgeschaltetem vdd_logic im Suspend ein I/O-Pegel halten. Eigenschaft:

```text
rockchip,sleep-io-ret-config = <
    (0
    | RKPM_VCCIO1_RET_EN
    ...
    )
>;
```

Konfigurationsdefinitionen:

```text
// ⽀持配置以下⼋个io域
#define RKPM_EMMCIO_RET_EN      BIT(0)
#define RKPM_VCCIO1_RET_EN      BIT(1)
#define RKPM_VCCIO2_RET_EN      BIT(2)
#define RKPM_VCCIO3_RET_EN      BIT(3)
#define RKPM_VCCIO4_RET_EN      BIT(4)
#define RKPM_VCCIO5_RET_EN      BIT(5)
#define RKPM_VCCIO6_RET_EN      BIT(6)
#define RKPM_PMUIO2_RET_EN      BIT(7)
```

Hinweis: Zum Halten eines I/O-Pegels muss dessen I/O-Domain konfiguriert und weiterhin versorgt werden. Andernfalls lässt sich der Pegel nicht halten.

### 2.5 Virtuelles Ausschalten konfigurieren

Bei manchen Produkten lässt sich die Versorgung beim Ausschalten nicht trennen. Suspend kann dann das Ausschalten ersetzen, um den Verbrauch zu senken. Eigenschaft:

```text
// 0：关闭假关机模式， 1：开启假关机模式；开启假关机模式后，系统⾛关机流程时就会跑到休眠流程中去
rockchip,virtual-poweroff = <...>;

// 配置关机时的唤醒中断号，系统收到唤醒中断信号后重启开机
rockchip,virtual-poweroff-irqs = < xx xx xx ...>;
```

## 3. Protokollmeldungen

Nachfolgend werden trust-Meldungen bei Suspend und Resume erläutert. Für Kommentare wurden manche Ausgabezeilen aufgeteilt. Unterschiedliche Suspend-Leistungsmodi erzeugen unterschiedliche Logs; maßgeblich ist die tatsächliche Ausgabe. Eigenschaft:

```text
rockchip,sleep-debug-en = <...>;
```

0: Kein Suspend-Log; 1: Suspend-Log ausgeben. RK3588-Suspend-Log:

```text
//休眠所⽤trust bl31版本及commit信息
INFO:    BL31: v2.3():v2.3-264-g378cb8595:derrick.huang

//休眠模式配置及休眠次数打印
INFO:    enter: cfg=0x5000604, sleeptimes:1

//休眠模式打印
INFO:    armoff_ddrpd
INFO:    pmu_pmualive_32k
INFO:    pmu_dis_osc
INFO:    32k ext
INFO:    pmu debug

//休眠gpio中断配置状态打印
INFO:    GPIO0_INTEN: 0xffff 0xffff 0xff7f 0xefff 0x0 0xc81e142d
INFO:    GPIO1_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0xe82863
INFO:    GPIO2_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0xffefcef7
INFO:    GPIO3_INTEN: 0xffff 0xffff 0xeffe 0xffff 0x0 0xf0044483
INFO:    GPIO4_INTEN: 0xffff 0xffff 0xffff 0xffff 0x0 0xe0dc2003

//休眠关键寄存器信息打印
INFO:    PMU1_PWR_CON(0x1) PMU1_CRU_PWR_CON(0x23) PMU1_WAKEUP_INT_CON(0x100)
PMU2_BUS_IDLE_ST(0x27fffff 0x0) PMU2_BUS_IDLE_ACK(0x27fffff 0x0)
PMU2_PWR_GATE_ST(0x67ffffff 0x0)
PMU2_BUS_IDLE_CON(0x0 0xfd80 0xf007) PMU2_BIU_AUTO_CON(0xffff 0xffff 0x7)
PMU2_PWR_GATE_CON(0x0 0x9000 0x3)
PMU2_VOL_GATE_CON(0x7 0x0 0x3)
PMU2_QCHANNEL_PWR_CON(0x0) PMU2_QCHANNEL_STATUS(0xfe0007f)
PMU1_DDR_PWR_CON(0x747 0x747 0x747 0x747)
PMU1_DDR_PWR_SFTCON(0x900 0x900 0x900 0x900)
PMU1_PLLPD_CON(0xffff 0x3)
PMU2_DSU_PWR_CON(0x3)
PMU2_CORE_PWR_CON0(0x1 0x1)
PMU2_CORE_AUTO_PWR_CON0(0x0 0x0)
PMU2_CLUSTER_IDLE_CON(0x75)
INFO:    PMU0_PWR_CON(0x0) PMU0_WAKEUP_INT_CON(0x0)
PMU0_DDR_RET_CON(0x0 0x0)
PMU1_GRF_SOC_CON2(0x7777) PMU0_GRF_OS_REGS9(0xd8394dc7)
```

RK3588-Resume-Log:

```text
// 唤醒流程步骤打印
012376543edcba2

// 唤醒源
INFO:      gpio0_a7
INFO:    wake up status: 0x100
INFO:    the wake up information:
INFO:    GPIO0 interrupt wakeup
INFO:    GPIO0: 0x80
```

## 4. Typische Konfigurationen

### 4.1 Logic-Abschaltmodus

Dieser Modus unterstützt das Abschalten von vdd_logic zur Senkung des Suspend-Verbrauchs. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3588";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_LOGOFF
        | RKPM_SLP_PMU_PMUALIVE_32K
        | RKPM_SLP_PMU_DIS_OSC
        | RKPM_SLP_32K_EXT
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        )
    >;
};
```

### 4.2 Aufwecken durch uart0

Für UART-Wakeup vorzugsweise uart0 verwenden. Er liegt in pd_pmu1 und kann bei abgeschaltetem logic aufwecken, was den Verbrauch senkt. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3588";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_LOGOFF
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        | RKPM_UART0_WKUP_EN
        )
    >;
};
```

Hinweis: uart0-Wakeup benötigt den laufenden 24M-Quarz; dessen Versorgung darf nicht abgeschaltet werden.

### 4.3 Aufwecken durch pwm

Für Infrarot-Wakeup PWM-Wakeup verwenden. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3588";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_DDRPD
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_CPU0_WKUP_EN
        | RKPM_GPIO_WKUP_EN
        )
    >;
};
```

Hinweis: pwm-Wakeup benötigt den laufenden 24M-Quarz; dessen Versorgung darf nicht abgeschaltet werden. Auch vdd_logic muss eingeschaltet bleiben.

### 4.4 Aufwecken durch mcu

Soll die PMU-MCU während Suspend Aufgaben wie Interruptfilterung übernehmen, MCU-Wakeup verwenden. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3588";
    status = "okay";
    rockchip,sleep-debug-en = <1>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_DDRPD
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        | RKPM_PMUMCU_CEC_WKUP_EN
        )
    >;
};
```

Hinweis: mcu-Wakeup benötigt den laufenden 24M-Quarz; dessen Versorgung darf nicht abgeschaltet werden. Auch vdd_logic muss eingeschaltet bleiben.

### 4.5 Aufwecken durch gpio

Für gpio0-Wakeup genügt der Logic-Abschaltmodus, da gpio0 in pd_pmu liegt. Für gpio1–4-Wakeup muss vdd_logic eingeschaltet bleiben. Konfiguration:

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3588";
    status = "okay";
    rockchip,sleep-debug-en = <0>;
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_DDRPD
        )
    >;
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        | RKPM_CPU0_WKUP_EN
        )
    >;
};
```

Hinweis: gpio1–4-Wakeup benötigt den laufenden 24M-Quarz; dessen Versorgung darf nicht abgeschaltet werden.

{% endraw %}
