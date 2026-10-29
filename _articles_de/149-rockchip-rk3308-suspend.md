---
title: "Rockchip RK3308: vollständiger Leitfaden zu System-Suspend, DTS, Aufwecken und Logs"
description: "Rockchip RK3308: vollständiger Leitfaden zu System-Suspend, DTS, Aufwecken und Logs — V1.1.1"
excerpt: "Rockchip RK3308: vollständiger Leitfaden zu System-Suspend, DTS, Aufwecken und Logs"
translation_key: 149-rockchip-rk3308-suspend
slug: 149-rockchip-rk3308-suspend
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
reference_products: ["P2pro"]
products: []
tags: [ArmSoM, Rockchip, RK3308, suspend, DTS]
---

{% raw %}

# Rockchip RK3308: vollständiger Leitfaden zu System-Suspend, DTS, Aufwecken und Logs

Gemeinsame technische Grundlage ist das chinesische V1.1.1, kapitelweise mit der englischen Quelle abgeglichen (Deckblatt V1.0.0, Änderungsverlauf bis V1.1.0). Geltungsbereich: RK3308, Linux 4.4/4.19. Die chinesische Revision nennt Formatänderungen; technische Kapitel wurden geprüft und die explizite englische Bereichsangabe separat vermerkt. Keine separaten technischen Abbildungen. Nur ArmSoM-Plattformreferenz: SoC, Platine, SDK/BSP, trust, Kernel, Versorgungsbaum und Aufweckschaltung prüfen. Keine Hardwaretests oder Suspend-/Versorgungsbefehle ausgeführt.

> Fehlerhafte Abschalt-, Takt- oder Aufweckeinstellungen können Resume verhindern oder Datenverlust verursachen. Beispiele vor Verwendung von einem mit der Hardware vertrauten Ingenieur prüfen lassen. Quellkommentare, Schreibweisen, Platzhalter und Unklarheiten bleiben erhalten; Konstanten werden nicht erfunden.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. System-Suspend

Auf SoC-Plattformen mit trust übernimmt trust den System-Suspend. Die Implementierungen unterscheiden sich; Optionen und Methoden anderer Plattformen sind nicht als Konfigurationsvorlage geeignet. Dieses Handbuch gilt nur für RK3308. Typischerweise werden Power-Domänen, IP-Module, Takte und PLLs abgeschaltet, DDR in Selbstauffrischung versetzt, der Systembus auf einen langsamen Takt (24M oder 32K) umgeschaltet, vdd_arm abgeschaltet und Aufweckquellen konfiguriert. Produktspezifische Einstellungen werden trust beim Start über DTS-Knoten übergeben.

### 1.1 Treiberdateien

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3308.h
```

### 1.2 DTS-Knoten

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3308";
    status = "okay";
    // 常规配置
    rockchip,sleep-mode-config = <
        (0
        | RKPM_PMU_HW_PLLS_PD
        | RKPM_DBG_FSM_SOUT
        )
    >;
    // 唤醒源配置
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO0_WAKEUP_EN
        )
    >;
    // 电源配置
    rockchip,pwm-regulator-config = <
        (0
        | RKPM_xxx
        )
    >;
    // reboot复位配置
    rockchip,apios-suspend = <
        (0
        | RKPM_xxx
        )
    >;
};
```

## 2. DTS-Konfiguration

Die derzeit unterstützten Konfigurationsoptionen sind hier definiert:

```text
./include/dt-bindings/suspend/rockchip-rk3308.h
```

### 2.1 Allgemeine Konfiguration

Konfigurationseigenschaft:

```text
rockchip,sleep-mode-config = <...>;
```

Konfigurationsdefinitionen:

```text
// 断电vdd_arm，需要硬件电路设计上能⽀持
#define RKPM_ARMOFF                 BIT(0)
// 关闭vad模块，不需要VAD唤醒时可关闭
#define RKPM_VADOFF                 BIT(1)
// 默认必选
#define RKPM_PMU_HW_PLLS_PD         BIT(3)
// 关闭24M晶振，最低功耗模式时可使能，需要配合选中下⾯的xxx_32K时钟源配置
#define RKPM_PMU_DIS_OSC            BIT(4)
// 使⽤PMU内部的32K时钟源作为系统时钟（相⽐外部32K时钟，推荐此⽅法）
#define RKPM_PMU_PMUALIVE_32K       BIT(5)
// 使⽤外部32K晶振作为系统时钟，不推荐
#define RKPM_PMU_EXT_32K            BIT(6)
// 默认不选
#define RKPM_DDR_SREF_HARDWARE      BIT(7)
// 默认不选
#define RKPM_DDR_EXIT_SRPD_IDLE     BIT(8)
// RKPM_ARMOFF的情况下关闭PDM的clk时钟
#define RKPM_PDM_CLK_OFF            BIT(9)
// 待机时pwm-regulator设置和maskrom⼀样的电压（否则会使⽤更低的电压，⽬前仅宽温芯⽚需要选择此项）
#define RKPM_PWM_VOLTAGE_DEFAULT    BIT(10)
```

RK3308-Suspend-Modi fallen in zwei Kategorien. VAD-Produkte benötigen VAD-Aufwecken: VAD/ACODEC/PDM sowie zugehörige IP-Blöcke und Takte bleiben aktiv, ebenso der 24M-Quarz und die zugehörigen PLLs. Trust prüft zunächst, ob der Kernel den VAD-Modus deaktiviert hat. Andernfalls wird ein VAD-Produkt angenommen und ein entsprechender Stromsparmodus gewählt. Nicht-VAD-Produkte benötigen keine weiterlaufenden IP-Blöcke; fast alle Module und Takte können für minimalen Verbrauch abgeschaltet werden. Der Systemtakt kann auf 32K oder 24M wechseln.

### 2.2 Versorgungskonfiguration

Konfigurationseigenschaft:

```text
rockchip,pwm-regulator-config = <...>;
```

Konfigurationsdefinitionen:

```text
// 使⽤pwm-regulator
#define RKPM_PWM_REGULATOR          BIT(2)
```

Versorgungshinweis: Aus der externen Schaltung ermitteln, ob pwm-regulator verwendet wird.

### 2.3 Aufweckkonfiguration

Konfigurationseigenschaft:

```text
rockchip,wakeup-config = <...>;
```

Konfigurationsdefinitionen:

```text
// ⽀持所有的中断唤醒（不经过GIC管理），不推荐使⽤
#define RKPM_ARM_PRE_WAKEUP_EN      BIT(11)
// ⽀持所有的中断唤醒（经过GIC管理的休眠可唤醒中断）
#define RKPM_ARM_GIC_WAKEUP_EN      BIT(12)
// SDMMC唤醒
#define RKPM_SDMMC_WAKEUP_EN        BIT(13)
#define RKPM_SDMMC_GRF_IRQ_WAKEUP_EN    BIT(14)
// RK TIMER唤醒
#define RKPM_TIMER_WAKEUP_EN        BIT(15)
// USB唤醒
#define RKPM_USBDEV_WAKEUP_EN       BIT(16)
// PMU内部timer唤醒（默认5s），⼀般⽤于测试休眠唤醒使⽤
#define RKPM_TIMEOUT_WAKEUP_EN      BIT(17)
// GPIO0唤醒
#define RKPM_GPIO0_WAKEUP_EN        BIT(18)
// VAD唤醒
#define RKPM_VAD_WAKEUP_EN          BIT(19)
```

Aufweckquellen: RKPM_GPIO0_WAKEUP_EN wird bevorzugt. Von GPIO0–3 werden nur GPIO0-Pins unterstützt. Ihre Interruptsignale gehen direkt an den PMU-Zustandsautomaten, ohne GIC. Benötigte Aufwecksignale im Hardwareentwurf möglichst auf GPIO0 legen. Zweite Wahl ist RKPM_ARM_GIC_WAKEUP_EN:

Alle vom Kernel über enable_irq_wake() beim GIC registrierten aufweckfähigen Interrupts werden unterstützt; damit stehen mehr Quellen als mit RKPM_GPIO0_WAKEUP_EN bereit. Die Verwaltung verteilt sich allerdings auf Kernelmodule, sodass unerwartete Interrupts das System wecken können. RKPM_TIMEOUT_WAKEUP_EN nutzt den internen PMU-Timer, standardmäßig mit 5s Zeitüberschreitung; normalerweise nur für Suspend/Resume-Tests während der Entwicklung.

### 2.4 Debug-Konfiguration

Konfigurationseigenschaft:

```text
rockchip,sleep-mode-config = <...>;
```

Konfigurationsdefinitionen:

```text
// 忽略
#define RKPM_DBG_INT_TIMER_TEST     BIT(22)
#define RKPM_DBG_WOARKAROUND        BIT(23)
#define RKPM_DBG_VAD_INT_OFF        BIT(24)
// 休眠时常开所有的clk
#define RKPM_DBG_CLK_UNGATE         BIT(25)
// 忽略
#define RKPM_DBG_CLKOUT             BIT(26)
// PMU状态机信号输出
#define RKPM_DBG_FSM_SOUT           BIT(27)
// 忽略
#define RKPM_DBG_FSM_STATE          BIT(28)
// DUMP某些寄存器：gpio/grf/sgrf...
#define RKPM_DBG_REG                BIT(29)
// 忽略
#define RKPM_DBG_VERBOSE            BIT(30)
#define RKPM_CONFIG_WAKEUP_END      BIT(31)
```

Debug-Hinweise: RKPM_DBG_CLK_UNGATE aktivieren, wenn abgeschaltete Takte als Ursache von Resume-Problemen vermutet werden. RKPM_DBG_REG aktivieren, wenn trust möglicherweise Register im Suspend verändert. RKPM_DBG_FSM_SOUT lässt den PMU-Zustandsautomaten während Suspend kontinuierlich ein bestimmtes Signal an GPIO4_D5 ausgeben, das seinen internen Zustand anzeigt. Dies hilft nur beim Hängenbleiben des PMU-Zustandsautomaten selbst.

### 2.5 Reboot-/Reset-Konfiguration

Konfigurationseigenschaft:

```text
rockchip,apios-suspend = <...>;
```

Konfigurationsdefinitionen:

```text
#define GLB1RST_IGNORE_PWM0        BIT(23)
#define GLB1RST_IGNORE_PWM1        BIT(24)
#define GLB1RST_IGNORE_PWM2        BIT(25)
#define GLB1RST_IGNORE_GPIO0       BIT(26)
#define GLB1RST_IGNORE_GPIO1       BIT(27)
#define GLB1RST_IGNORE_GPIO2       BIT(28)
#define GLB1RST_IGNORE_GPIO3       BIT(29)
```

Reboot/Reset: RK3308 verwendet standardmäßig first global software reset und setzt dabei alle IP-Module zurück. Die obigen Optionen können ausgewählte IPs erhalten. Die chinesische Bereichsdarstellung ist fehlerhaft; die englische Quelle nennt ausdrücklich pwm0–3/gpio0–3, die Makroliste jedoch nur PWM0–2 und GPIO0–3. Diese Quelldifferenz bleibt erhalten; Implementierung prüfen. GPIO-Beispiel: Manche Schaltungen besitzen einen "power hold"-Pin, den Software früh beim Start auf High/Low setzen muss, um die Versorgung zu halten. Er darf beim Reboot nicht zurückgesetzt werden, sonst schaltet das System ab.

## 3. Protokollmeldungen

Nachfolgend werden trust-Meldungen bei Suspend/Resume erläutert. Einige Ausgaben sind für Anmerkungen zeilenweise getrennt; verschiedene Stromsparmodi erzeugen unterschiedliche Ausgaben. Maßgeblich sind die tatsächlichen Logs. RK3308-Suspend-Protokoll:

```text
// 具备当唤醒源的pin脚
GPIO0_INTEN: 00000041
GPIO4_INTEN: 00001000
// kernel配置信息打印
v1.3(release):005c64b, cnt=1, config=0x8040009:armoff-hwplldown-ddrsw-gating-24M-
sout-
// 休眠流程步骤打印：每个字符都代表trust⾥的⼀个休眠步骤
0123a4
// vad相关模块的使能状态，1：使能，0：关闭
Enabling: vad(1) acodec(1) pdm(0) i2s_2(1)
// 各个模块占⽤的PLL情况， "Enabling"表⽰系统正在使⽤的PLL（因为不⼀定所有PLL都会开着）
DDR: vpll0 | VOICE(sum): vpll0 | I2S: vpll0 | PWM: dpll | Enabling: apll dpll
vpll0 | CRU_MODE: 3955
// "Disabling"表⽰待机时会被关闭的PLL
PMU Disabling: apll dpll vpll1
// PMU寄存器值（忽略）。"24Mhz"表⽰当前的系统时钟，如果当前是32K情况，则打印也随之变化体现
PMU: pd-000e wake-000c core-0bfb lo-180d hi-000e if-4001 24Mhz
// 休眠流程步骤打印。注意：打印完“wfi”就表⽰系统已经完全待机下去了！
5bRc678wfi
```

RK3308-Resume-Protokoll:

```text
// 唤醒流程步骤打印
876ab543210
// 唤醒源
IRQ=89
PMU wakeup int: vad
VAD int=00000113
// 本次系统深度待机时⻓
Wfi total: 2.419s(this: 2.419s)
```

{% endraw %}
