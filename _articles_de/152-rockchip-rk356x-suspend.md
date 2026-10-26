---
title: "Rockchip RK356X: vollständiger Leitfaden zu System-Suspend, DTS, Aufwecken und Logs"
description: "Rockchip RK356X: vollständiger Leitfaden zu System-Suspend, DTS, Aufwecken und Logs — V1.0.0"
excerpt: "Rockchip RK356X: vollständiger Leitfaden zu System-Suspend, DTS, Aufwecken und Logs"
translation_key: 152-rockchip-rk356x-suspend
slug: 152-rockchip-rk356x-suspend
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK356X, suspend, DTS]
---

{% raw %}

# Rockchip RK356X: vollständiger Leitfaden zu System-Suspend, DTS, Aufwecken und Logs

Vollständiger technischer Text aus der chinesischen Quelle V1.0.0 für RK356X und Linux 4.19 / 5.10. Nur ArmSoM-Plattformreferenz: SoC, SDK/BSP, trust/ATF, Kernel, PMIC, Versorgungsbaum und Aufweckpins der konkreten Platine prüfen. Keine pauschale Unterstützung aller ArmSoM-Platinen. Kein englisches PDF und keine separaten technischen Abbildungen vorhanden; alle vier Sprachen basieren auf der chinesischen Quelle. Code, Konfiguration und Logs sind Quellbeispiele, keine ArmSoM-Hardwaretests; Suspend- oder Versorgungsbefehle wurden nicht ausgeführt.

> Fehlerhafte Abschalt-, Takt- oder Aufweckeinstellungen können Resume verhindern oder Datenverlust verursachen. Beispiele vor Verwendung von einem mit der Hardware vertrauten Ingenieur prüfen lassen. Quellkommentare, Schreibweisen, Platzhalter und Unklarheiten bleiben erhalten; Konstanten werden nicht erfunden.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. System-Suspend

Auf SoC-Plattformen mit trust wird System-Suspend in trust implementiert. Die Implementierung unterscheidet sich je nach Plattform; Optionen und Verfahren dürfen daher nicht zwischen Plattformen übertragen werden. Dieses Handbuch gilt ausschließlich für RK356X. Typische Vorgänge sind das Abschalten von Power-Domänen, IP-Blöcken, Takten und PLLs, DDR-Selbstauffrischung, das Umschalten des Systembusses auf einen langsamen Takt (24M oder 32K), das Abschalten von vdd_arm/vdd_log und das Konfigurieren der Aufweckquellen. Für produktspezifische Suspend-Anforderungen werden die Einstellungen beim Start über DTS-Knoten an trust übergeben.

### 1.1 Treiberdateien

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3568.h
```

### 1.2 DTS-Knoten

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3568";
    status = "okay";
    // 休眠log开关配置，0：关闭打印， 1：打开打印
    rockchip,sleep-debug-en = <1>;
    // 常规配置
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMOFF_LOGOFF
        | RKPM_SLP_CENTER_OFF
        | RKPM_SLP_HW_PLLS_OFF
        | RKPM_SLP_PMUALIVE_32K
        | RKPM_SLP_OSC_DIS
        | RKPM_SLP_PMIC_LP
        | RKPM_SLP_32K_PVTM
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
./include/dt-bindings/suspend/rockchip-rk3568.h
```

### 2.1 Allgemeine Konfiguration

Konfigurationseigenschaft:

```text
rockchip,sleep-mode-config = <...>;
```

Konfigurationsdefinitionen:

```text
// 休眠 CPU 处在 WFI 状态，只有调试时⽤到
#define RKPM_SLP_WFI                    BIT(0)
// 休眠 cpu_pd power down
#define RKPM_SLP_ARMOFF                 BIT(1)
// 休眠 ddr 进⼊⾃刷新且处在 retention 状态
#define RKPM_SLP_CENTER_OFF             BIT(2)
// 休眠 logic 断电
#define RKPM_SLP_ARMOFF_LOGOFF          BIT(3)
// ⽀持 uboot 低功耗模式
#define RKPM_SLP_FROM_UBOOT             BIT(4)
// 休眠 PMIC 进⼊低功耗模式
#define RKPM_SLP_PMIC_LP                BIT(5)
// 休眠 PLL poweroff
#define RKPM_SLP_HW_PLLS_OFF            BIT(6)
// 休眠 pmu pd 切到 32k
#define RKPM_SLP_PMUALIVE_32K           BIT(7)
// 休眠 OSC 关闭
#define RKPM_SLP_OSC_DIS                BIT(8)
// 休眠 32K 时钟源由外部提供
#define RKPM_SLP_32K_EXT                BIT(9)
// 休眠 32k 时钟源由内部PVTM产⽣
#define RKPM_SLP_32K_PVTM               BIT(10)
```

### 2.2 Konfiguration der Aufweckquellen

Konfigurationseigenschaft:

```text
rockchip,wakeup-config = <...>;
```

Konfigurationsdefinitionen:

```text
// ⽀持enable_irq_wake的中断唤醒
#define RKPM_CPU0_WKUP_EN               BIT(0)
// ⽀持 GPIO 唤醒
#define RKPM_GPIO_WKUP_EN               BIT(4)
// ⽀持 UART0 唤醒， ，需要24M不能关闭
#define RKPM_UART0_WKUP_EN              BIT(5)
// ⽀持 SDMMC 唤醒
#define RKPM_SDMMC0_WKUP_EN             BIT(6)
#define RKPM_SDMMC1_WKUP_EN             BIT(7)
#define RKPM_SDMMC2_WKUP_EN             BIT(8)
// ⽀持 USB 唤醒
#define RKPM_USB_WKUP_EN                BIT(9)
// ⽀持 PCIE 唤醒
#define RKPM_PCIE_WKUP_EN               BIT(10)
// ⽀持 VAD 唤醒
#define RKPM_VAD_WKUP_EN                BIT(11)
// ⽀持 TIMER 唤醒，需要 24M 不能关闭
#define RKPM_TIMER_WKUP_EN              BIT(12)
// ⽀持 PWM0 唤醒，需要 24M 不能关闭
#define RKPM_PWM0_WKUP_EN               BIT(13)
// ⽀持 TIMEOUT 唤醒，⼀般⽤于调试
#define RKPM_TIMEOUT_WKUP_EN            BIT(14)
// ⽀持 USB 协议唤醒， 需要 24M 不能关闭
#define RKPM_USB_LINESTATE_WKUP_EN      BIT(16)
```

Aufweckhinweis: RKPM_GPIO_WKUP_EN unterstützt nur die Pin-Gruppe GPIO0 als Aufweckquelle. Die Quelle empfiehlt, benötigte Aufwecksignale beim Hardwareentwurf dieser Gruppe zuzuordnen.

### 2.3 Debug-Konfiguration

Konfigurationseigenschaft:

```text
rockchip,sleep-debug-en = <...>;
```

Debug-Hinweis: Der Wert 1 aktiviert Debug-Ausgaben. Während Suspend und Resume werden die entsprechenden ATF-Protokolle ausgegeben.

## 3. Protokollmeldungen

Im Folgenden werden trust-Meldungen bei Suspend und Resume erläutert. Einige Ausgaben sind für die Erläuterung auf mehrere Zeilen verteilt. Unterschiedliche Stromsparmodi liefern ebenfalls unterschiedliche Meldungen; maßgeblich ist die tatsächliche Ausgabe.

RK356X-System-Suspend-Protokoll:

```text
// abcdegh是休眠流程进⾏到哪⼀步骤的标志
// sleep mode config 休眠模式
abcdeghINFO:    sleep mode config[0x5ec]:
INFO:           mode: RKPM_SLP_CENTER_PD
INFO:           mode: RKPM_SLP_ARMOFF_LOGOFF
INFO:           mode: RKPM_SLP_PMIC_LP
INFO:           mode: RKPM_SLP_HW_PLLS_PD
INFO:           mode: RKPM_SLP_PMUALIVE_32K
INFO:           mode: RKPM_SLP_OSC_DIS
INFO:           mode: RKPM_SLP_32K_PVTM
// ⽀持的唤醒源
INFO:    wakeup source config[0x10]:
INFO:           Enable GPIO0 interrupt as wakeup source
ijsramwfi
```

RK356X-System-Resume-Protokoll:

```text
// 唤醒打印
INFO:    [TEST]: wakeup count: 0
INFO:    wake interput ID: 65
INFO:    WAKEUP SOURCE: 0x10
INFO:           GPIO0 interrupt as wakeup source
INFO:                   GPIO0A3
// 唤醒源
GPIO interrupt wakeup
gpio0a3中断唤醒系统
```

{% endraw %}
