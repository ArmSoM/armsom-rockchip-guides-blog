---
title: "Rockchip RK356X System Suspend: Complete DTS, Wake-up and Logging Guide"
description: "Rockchip RK356X System Suspend: Complete DTS, Wake-up and Logging Guide — V1.0.0"
excerpt: "Rockchip RK356X System Suspend: Complete DTS, Wake-up and Logging Guide"
translation_key: 152-rockchip-rk356x-suspend
slug: 152-rockchip-rk356x-suspend
lang: en
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK356X, suspend, DTS]
---

{% raw %}

# Rockchip RK356X System Suspend: Complete DTS, Wake-up and Logging Guide

Complete technical text from Chinese V1.0.0, covering RK356X and Linux 4.19 / 5.10. ArmSoM platform reference only: verify the exact board SoC, SDK/BSP, trust/ATF, kernel, PMIC, power tree and wake-up pins. This does not establish support for every ArmSoM board. No English PDF or standalone technical figures are present; all four languages share the Chinese source. Code, configuration and logs are source examples, not hardware-tested ArmSoM results; no suspend or power commands were executed.

> Incorrect power-off, clock or wake-source settings may prevent resume or cause data loss. Have an engineer familiar with the hardware verify examples before use. Source code comments, spelling, placeholders and ambiguities are retained without inventing constants.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. System suspend

On SoC platforms with trust, system suspend is implemented in trust. Its implementation differs by platform, so suspend options and methods must not be transferred between platforms; this guide applies only to RK356X. Typical operations include powering down power domains, IP modules, disabling clocks and PLLs, placing DDR in self-refresh, switching the system bus to a low-speed clock (24M or 32K), powering off vdd_arm/vdd_log and configuring wake-up sources. To meet product-specific suspend requirements, these settings are passed to trust through DTS nodes during boot.

### 1.1 Driver files

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3568.h
```

### 1.2 DTS node

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

## 2. DTS configuration

Currently supported configuration options are defined in:

```text
./include/dt-bindings/suspend/rockchip-rk3568.h
```

### 2.1 General configuration

Configuration property:

```text
rockchip,sleep-mode-config = <...>;
```

Configuration definitions:

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

### 2.2 Wake-up source configuration

Configuration property:

```text
rockchip,wakeup-config = <...>;
```

Configuration definitions:

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

Wake-up note: RKPM_GPIO_WKUP_EN supports only the GPIO0 pin group as a wake-up source. The source recommends assigning required wake-up signals to GPIO0 in the hardware design.

### 2.3 Debug configuration

Configuration property:

```text
rockchip,sleep-debug-en = <...>;
```

Debug note: assigning 1 enables debug output. ATF suspend and resume logs are printed during suspend/resume.

## 3. Log messages

The following explains trust messages during system suspend and resume. Some output is split into lines for annotation. Different low-power modes also produce different messages; the actual output is authoritative.

RK356X system suspend log:

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

RK356X system resume log:

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
