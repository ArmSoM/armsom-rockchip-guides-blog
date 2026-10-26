---
title: "RK3576 System Suspend: Power Modes, DTS and Wake-up"
description: "RK3576 System Suspend: Power Modes, DTS and Wake-up — V1.0.0"
excerpt: "RK3576 System Suspend: Power Modes, DTS and Wake-up"
translation_key: 153-rockchip-rk3576-suspend
slug: 153-rockchip-rk3576-suspend
lang: en
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3576, suspend, DTS]
---

{% raw %}

# RK3576 System Suspend: Power Modes, DTS and Wake-up

Complete Chinese source V1.0.0 for RK3576, kernel 6.10. ArmSoM platform reference only: verify the actual board, SoC, SDK/BSP, trust/BL31, kernel, PMIC, power tree, crystal and wake-up circuitry. This is not evidence of support on every ArmSoM board. No English original was supplied; all four languages follow the Chinese source. It contains no standalone technical figures; all configurations and logs remain copyable text. No ArmSoM hardware tests or suspend/power commands were performed.

> Incorrect power-off or wake-up settings can prevent resume or cause data loss. Source macros, log values and placeholders are retained; check the actual BSP before use. The prose uses RKPM_TIMEOUT_WAKEUP_EN while code uses RKPM_TIMEOUT_WKUP_EN. Examples use RKPM_SLP_PMIC_LP but the listed macros do not define it; no definition has been invented. The source product-version table explicitly prints Linux 6.10; this is retained as an unresolved source issue, not silently changed to 6.1.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. System suspend

On SoCs with bl31, system suspend is implemented in bl31. The implementation differs between platforms, so suspend configuration options and methods from other platforms are not interchangeable references. This guide applies only to RK3576. A typical suspend sequence powers off power domains and IP blocks, disables clocks and PLLs, puts DDR into self-refresh, switches the system bus to a slow clock (24M or 32K), powers off vdd_arm/vdd_log and configures wake-up sources. To meet different product requirements, the relevant DTS-node settings are passed to bl31 during boot.

### 1.1 Driver files

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3576.h
```

### 1.2 DTS node

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

## 2. DTS configuration

Currently supported configuration options are defined in:

```text
./include/dt-bindings/suspend/rockchip-rk3576.h
```

### 2.1 General configuration

Property

```text
rockchip,sleep-mode-config = <...>;
```

Configuration options

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

Notes: Configure the options for the wake-up sources required by the product. For USB wake-up, USB power and clocks must remain active during suspend, so RKPM_SLP_ARMOFF_LOGOFF, RKPM_SLP_PMU_DIS_OSC and RKPM_SLP_PMU_PMUALIVE_32K must not be selected. RKPM_SLP_PMU_DBG: when enabled, the PMU state machine continuously outputs a specific waveform on GPIO0_B0 during suspend to indicate its internal state. This is only for suspend/resume testing and debugging.

RKPM_SLP_TIME_OUT_WKUP: When enabled, the system wakes automatically after approximately 1s in suspend, and only the PMU internal timer can wake it. This option is only for suspend/resume testing and debugging.

### 2.2 Wake-up configuration

Property

```text
rockchip,wakeup-config = <...>;
```

Configuration options

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

Notes: RKPM_GPIO_WKUP_EN (preferred):

Of GPIO0–4, only GPIO0 pins are supported by this wake-up mode. GPIO0 interrupt signals go directly to the PMU state machine without passing through the GIC. During hardware design, place required wake-up sources on GPIO0 wherever possible. RKPM_CPU0_WKUP_EN (second choice): supports all wake-capable interrupts registered with the GIC by enable_irq_wake() in the kernel, covering more sources than RKPM_GPIO_WKUP_EN. However, this distributes wake-up-source management among kernel modules, so unexpected interrupts may wake the system. RKPM_TIMEOUT_WAKEUP_EN: wake-up by the internal PMU timer, with a default 1s timeout interrupt; generally only used for suspend/resume testing during development.

### 2.3 I/O retention configuration

Use this property to retain an I/O level during suspend with vdd_logic powered off. Property:

```text
rockchip,sleep-io-ret-config = <
    (0
    | RKPM_VCCIO0_RET_EN
    ...
    )
>;
```

Configuration options

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

Note: To retain an I/O level, configure its I/O domain and keep that domain powered. Otherwise the level cannot be retained.

### 2.4 Sleep-pin configuration

Sleep pins switch off power during suspend. Configure them according to the actual hardware design. Property:

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

Configuration options

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

Note: RK3576 defaults to driving sleep pin0 high.

### 2.5 Virtual power-off configuration

Some products cannot physically cut power at shutdown. Suspend can substitute for shutdown to reduce power consumption. Property:

```text
// 0：关闭假关机模式， 1：开启假关机模式。
rockchip,virtual-poweroff = <...>;

// 配置关机时的唤醒中断号，系统收到唤醒中断信号后重启开机
rockchip,virtual-poweroff-irqs = < xx xx xx ...>;
```

Note: If rockchip,virtual-poweroff-irqs is not configured, pwm0 channel0 is the default wake-up source.

## 3. Log messages

The following explains bl31 messages during suspend and resume. Some output lines are split to make annotation easier. Different suspend power modes produce different logs; actual output is authoritative. Property:

```text
// 0：休眠时不会打印log， 1：休眠时会打印log
rockchip,sleep-debug-en = <...>;
```

RK3576 system suspend log

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

RK3576 system resume log

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

## 4. Typical configurations

### 4.1 Logic power-off mode

This mode supports switching off vdd_logic to reduce suspend power. Configuration:

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

### 4.2 PMU1 power-off mode

In addition to powering off logic, this mode disables pd pmu1 and supports switching off the PMUIO1 supply. It consumes less power than logic power-off mode. Configuration:

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

### 4.3 uart1 wake-up

If UART wake-up is required, prefer uart1. It belongs to pd_pmu1 and can wake the system while logic is powered off, reducing power consumption. Configuration:

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

Note: uart1 wake-up requires the 24M crystal to remain running, so its supply must not be switched off.

### 4.4 usb wake-up

For USB wake-up, preferably combine the USB 0.75V, 1.8V and 3.3V supplies with the PMU supplies. This permits USB wake-up with logic powered off and reduces consumption. Configuration:

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

Note: usb wake-up requires the 24M crystal to remain running, so its supply must not be switched off.

### 4.5 pwm wake-up

Infrared wake-up requires PWM wake-up. Prefer connecting infrared to pwm0 channel0, since pwm0 is in pd_pmu1 and can wake the system while logic is off, reducing consumption. Configuration:

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

Note: pwm wake-up requires the 24M crystal to remain running, so its supply must not be switched off.

### 4.6 mcu wake-up

If the PMU MCU must perform work during suspend, such as interrupt filtering, use MCU wake-up. Configuration:

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

Note: mcu wake-up requires the 24M crystal to remain running, so its supply must not be switched off. vdd_logic must also remain powered.

### 4.7 gpio wake-up

For gpio0 wake-up, the logic power-off configuration is sufficient because gpio0 is in pd_pmu. For gpio1–4 wake-up, vdd_logic must remain powered. Configuration:

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

Note: gpio1–4 wake-up requires the 24M crystal to remain running, so its supply must not be switched off.

{% endraw %}
