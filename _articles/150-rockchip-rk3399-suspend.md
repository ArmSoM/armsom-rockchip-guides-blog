---
title: "Rockchip RK3399 System Suspend: Complete DTS, Wake-up and Logging Guide"
description: "Rockchip RK3399 System Suspend: Complete DTS, Wake-up and Logging Guide — V1.0.0"
excerpt: "Rockchip RK3399 System Suspend: Complete DTS, Wake-up and Logging Guide"
translation_key: 150-rockchip-rk3399-suspend
slug: 150-rockchip-rk3399-suspend
lang: en
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3399, suspend, DTS]
---

{% raw %}

# Rockchip RK3399 System Suspend: Complete DTS, Wake-up and Logging Guide

Complete technical text from Chinese V1.0.0, covering RK3399 and Linux 4.4 / 4.19. ArmSoM platform reference only: verify the exact board SoC, SDK/BSP, trust/ATF, kernel, PMIC, power tree and wake-up pins. This does not establish support for every ArmSoM board. No English PDF or standalone technical figures are present; all four languages share the Chinese source. Code, configuration and logs are source examples, not hardware-tested ArmSoM results; no suspend or power commands were executed.

> Incorrect power-off, clock or wake-source settings may prevent resume or cause data loss. Have an engineer familiar with the hardware verify examples before use. Source code comments, spelling, placeholders and ambiguities are retained without inventing constants.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. System suspend

On SoC platforms with trust, system suspend is implemented in trust. Its implementation differs by platform, so suspend options and methods must not be transferred between platforms; this guide applies only to RK3399. Typical operations include powering down power domains, disabling clocks and PLLs, placing DDR in self-refresh, switching the system bus to a low-speed clock (24M or 32K), putting the PMIC into sleep mode and configuring wake-up sources. To meet product-specific suspend requirements, these settings are passed to trust through DTS nodes during boot.

### 1.1 Driver files

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3399.h
```

### 1.2 DTS node

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3399";
    status = "okay";
    // 常规配置
    rockchip,sleep-mode-config = <
        (0
        | RKPM_SLP_ARMPD
        | RKPM_SLP_PERILPPD
        | RKPM_SLP_DDR_RET
        | RKPM_SLP_CENTER_PD
        )
    >;
    // 唤醒源配置
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO_WKUP_EN
        )
    >;
    // 电源配置
    rockchip,pwm-regulator-config = <
        (0
        | PWM2_REGULATOR_EN
        )
    >;
    // 对应APIO断电
    rockchip,apios-suspend = <
        (0
        | RKPM_APIOxxx
        )
    >;
    // 休眠控制GPIO的电平，关断对应供电
    rockchip,power-ctrl =
                <&gpioX RK_PXX GPIO_ACTIVE_HIGH>;
};
```

## 2. DTS configuration

Currently supported configuration options are defined in:

```text
./include/dt-bindings/suspend/rockchip-rk3399.h
```

### 2.1 General configuration

Configuration property:

```text
rockchip,sleep-mode-config = <...>;
```

Configuration definitions:

```text
// 休眠 CPU 处在 WFI 状态，只有调试时⽤到
#define RKPM_SLP_WFI                            (1 << 0)
// 休眠 cpu_pd power down
#define RKPM_SLP_ARMPD                          (1 << 1)
// 休眠perilp_pd power down
#define RKPM_SLP_PERILPPD                       (1 << 2)
// 休眠 ddr 进⼊⾃刷新且处在 retention 状态
#define RKPM_SLP_DDR_RET                        (1 << 3)
// 休眠 PLL power down
#define RKPM_SLP_PLLPD                          (1 << 4)
// 休眠 OSC disable，系统时钟切到 32K
#define RKPM_SLP_OSC_DIS                        (1 << 5)
// 休眠 center_pd power down
#define RKPM_SLP_CENTER_PD                      (1 << 6)
// 休眠 AP_OFF 会被拉⾼，⽤于控制 PMIC 或者其他分⽴电源进⼊休眠态
#define RKPM_SLP_AP_PWROFF                      (1 << 7)
```

### 2.2 Power configuration

Configuration property:

```text
rockchip,pwm-regulator-config = <...>;
```

Configuration definitions:

```text
// 使⽤ pwm-regulator
#define PWM0_REGULATOR_EN                       (1 << 0)
#define PWM1_REGULATOR_EN                       (1 << 1)
#define PWM2_REGULATOR_EN                       (1 << 2)
#define PWM3A_REGULATOR_EN                      (1 << 3)
#define PWM3B_REGULATOR_EN                      (1 << 4)
```

Power note: decide whether to use pwm-regulator according to the external circuit design. The configuration must match the hardware.

### 2.3 Wake-up configuration

Configuration property:

```text
rockchip,wakeup-config = <...>;
```

Configuration definitions:

```text
// ⽀持所有的中断唤醒
#define RKPM_CLUSTER_L_WKUP_EN                  (1 << 0)
// ⽀持所有被指定到⼤核的中断唤醒
#define RKPM_CLUSTER_B_WKUPB_EN                 (1 << 1)
// ⽀持 GPIO 唤醒
#define RKPM_GPIO_WKUP_EN                       (1 << 2)
// ⽀持 SDIO 唤醒
#define RKPM_SDIO_WKUP_EN                       (1 << 3)
// ⽀持 SDMMC 唤醒
#define RKPM_SDMMC_WKUP_EN                      (1 << 4)
// ⽀持 TIMER 唤醒
#define RKPM_TIMER_WKUP_EN                      (1 << 6)
// ⽀持插拔 USB 唤醒
#define RKPM_USB_WKUP_EN                        (1 << 7)
// ⽀持 SOFTWARE 唤醒
#define RKPM_SFT_WKUP_EN                        (1 << 8)
// ⽀持 WDT 唤醒
#define RKPM_WDT_M0_WKUP_EN                     (1 << 9)
// ⽀持 TIMEOUT 唤醒，⼀般⽤于调试
#define RKPM_TIME_OUT_WKUP_EN                   (1 << 10)
// ⽀持 PWM 唤醒
#define RKPM_PWM_WKUP_EN                        (1 << 11)
// ⽀持 PCIE 唤醒
#define RKPM_PCIE_WKUP_EN                       (1 << 13)
// ⽀持 USB 协议唤醒
#define RKPM_USB_LINESTATE_WKUP_EN              (1 << 14)
```

Wake-up note: an interrupt not registered with the GIC through enable_irq_wake() during the kernel stage cannot wake the system.

### 2.4 Debug configuration

Configuration property:

```text
rockchip,sleep-debug-en = <...>;
```

Debug note: assigning 1 enables debug output. ATF suspend and resume logs are printed during suspend/resume.

### 2.5 APIO power-off configuration

Configuration property:

```text
rockchip,apios-suspend = <...>;
```

Configuration definitions:

```text
/* APIO 电压域 */
#define RKPM_APIO0_SUSPEND                      (1 << 0)
#define RKPM_APIO1_SUSPEND                      (1 << 1)
#define RKPM_APIO2_SUSPEND                      (1 << 2)
#define RKPM_APIO3_SUSPEND                      (1 << 3)
#define RKPM_APIO4_SUSPEND                      (1 << 4)
#define RKPM_APIO5_SUSPEND                      (1 << 5)
```

APIO note: the RK3399 GPIO APIO domains are divided into APIO1–APIO5. If the hardware circuit supports it, APIO can be powered off independently during suspend.

### 2.6 GPIO-controlled power

Configuration property:

```text
rockchip,power-ctrl = <...>
```

Configuration example:

```text
// 休眠将GPIO1_C1拉⾼，控制外部电源断电
rockchip,power-ctrl = <&gpio1 RK_PC1 GPIO_ACTIVE_HIGH>,
```

## 3. Log messages

The following explains trust messages during system suspend and resume. Some output is split into lines for annotation. Different low-power modes also produce different messages; the actual output is authoritative.

RK3399 system suspend log:

```text
// 休眠模式
INFO:    sleep mode config[0xde]:
INFO:           AP_PWROFF
INFO:           SLP_ARMPD
INFO:           SLP_PLLPD
INFO:           DDR_RET
INFO:           SLP_CENTER_PD
// ⽀持的唤醒源
INFO:    wakeup source config[0x804]:
INFO:           GPIO interrupt can wakeup system
INFO:           PWM interrupt can wakeup system
// 休眠需要控制的pwm regulator
INFO:    PWM CONFIG[0x4]:
INFO:           PWM: PWM2D_REGULATOR_EN
// 休眠需要控制的APIO
INFO:    APIOS info[0x0]:
INFO:           not config
// 通过GPIO控制的电源
INFO:    GPIO POWER INFO:
INFO:           GPIO1_C1
INFO:           GPIO1_B6
// 休眠模式寄存器的值
INFO:    PMU_MODE_CONG: 0x1466bf51
```

RK3399 system resume log:

```text
// 唤醒打印
INFO:    RK3399 the wake up information:
INFO:    wake up status: 0x4
INFO:           GPIO interrupt wakeup
INFO:           GPIO0: 0x0
INFO:           GPIO1: 0x200000
INFO:           GPIO2: 0x0
INFO:           GPIO3: 0x0
INFO:           GPIO4: 0x0
// 唤醒源
GPIO interrupt wakeup
gpio1_c5中断唤醒系统
```

{% endraw %}
