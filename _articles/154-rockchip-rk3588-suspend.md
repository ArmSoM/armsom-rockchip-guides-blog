---
title: "RK3588 System Suspend: Power Modes, DTS and Wake-up"
description: "RK3588 System Suspend: Power Modes, DTS and Wake-up — V1.1.0"
excerpt: "RK3588 System Suspend: Power Modes, DTS and Wake-up"
translation_key: 154-rockchip-rk3588-suspend
slug: 154-rockchip-rk3588-suspend
lang: en
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3588, suspend, DTS]
---

{% raw %}

# RK3588 System Suspend: Power Modes, DTS and Wake-up

Complete Chinese source V1.1.0 for RK3588, kernel 5.10. ArmSoM platform reference only: verify the actual board, SoC, SDK/BSP, trust/BL31, kernel, PMIC, power tree, crystal and wake-up circuitry. This is not evidence of support on every ArmSoM board. No English original was supplied; all four languages follow the Chinese source. It contains no standalone technical figures; all configurations and logs remain copyable text. No ArmSoM hardware tests or suspend/power commands were performed.

> Incorrect power-off or wake-up settings can prevent resume or cause data loss. Source macros, log values and placeholders are retained; check the actual BSP before use. The prose uses RKPM_TIMEOUT_WAKEUP_EN while code uses RKPM_TIME_OUT_WKUP_EN. Examples use RKPM_PMUMCU_CEC_WKUP_EN but the listed macros do not define it; no definition has been invented.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. System suspend

On SoCs with trust, system suspend is implemented in trust. The implementation differs between platforms, so suspend configuration options and methods from other platforms are not interchangeable references. This guide applies only to RK3588. A typical suspend sequence powers off power domains and IP blocks, disables clocks and PLLs, puts DDR into self-refresh, switches the system bus to a slow clock (24M or 32K), powers off vdd_arm/vdd_log and configures wake-up sources. To meet different product requirements, the relevant DTS-node settings are passed to trust during boot.

### 1.1 Driver files

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3588.h
```

### 1.2 DTS node

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

## 2. DTS configuration

Currently supported configuration options are defined in:

```text
./include/dt-bindings/suspend/rockchip-rk3588.h
```

### 2.1 General configuration

Configuration property:

```text
rockchip,sleep-mode-config = <...>;
```

Configuration definitions:

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

Notes: Configure the options for the wake-up sources required by the product. For USB wake-up, USB power and clocks must remain active during suspend, so RKPM_SLP_ARMOFF_LOGOFF, RKPM_SLP_PMU_DIS_OSC and RKPM_SLP_PMU_PMUALIVE_32K must not be selected.

### 2.2 Wake-up configuration

Configuration property:

```text
rockchip,wakeup-config = <...>;
```

Configuration definitions:

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

Notes: RKPM_GPIO_WKUP_EN (preferred): Of GPIO0–4, only GPIO0 pins are supported by this wake-up mode. GPIO0 interrupt signals go directly to the PMU state machine without passing through the GIC. During hardware design, place required wake-up sources on GPIO0 wherever possible. RKPM_CPU0_WKUP_EN (second choice): supports all wake-capable interrupts registered with the GIC by enable_irq_wake() in the kernel, covering more sources than RKPM_GPIO_WKUP_EN. However, this distributes wake-up-source management among kernel modules, so unexpected interrupts may wake the system. RKPM_TIMEOUT_WAKEUP_EN: wake-up by the internal PMU timer, with a default 1s timeout interrupt; generally only used for suspend/resume testing during development.

### 2.3 Debug configuration

Configuration property:

```text
rockchip,sleep-mode-config = <...>;
```

Configuration definitions:

```text
#define RKPM_SLP_TIME_OUT_WKUP      BIT(25)
#define RKPM_SLP_PMU_DBG            BIT(26)
```

Debug notes: RKPM_SLP_TIME_OUT_WKUP: When enabled, the system wakes automatically after approximately 1s in suspend, and only the PMU internal timer can wake it. This option is only for suspend/resume testing and debugging. RKPM_SLP_PMU_DBG continuously outputs a waveform on GPIO0_A5 showing the PMU state-machine state during suspend; only for suspend/resume testing and debugging.

### 2.4 I/O retention configuration

Use this property to retain an I/O level during suspend with vdd_logic powered off. Property:

```text
rockchip,sleep-io-ret-config = <
    (0
    | RKPM_VCCIO1_RET_EN
    ...
    )
>;
```

Configuration definitions:

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

Note: To retain an I/O level, configure its I/O domain and keep that domain powered. Otherwise the level cannot be retained.

### 2.5 Virtual power-off configuration

Some products cannot physically cut power at shutdown. Suspend can substitute for shutdown to reduce power consumption. Property:

```text
// 0：关闭假关机模式， 1：开启假关机模式；开启假关机模式后，系统⾛关机流程时就会跑到休眠流程中去
rockchip,virtual-poweroff = <...>;

// 配置关机时的唤醒中断号，系统收到唤醒中断信号后重启开机
rockchip,virtual-poweroff-irqs = < xx xx xx ...>;
```

## 3. Log messages

The following explains trust messages during suspend and resume. Some output lines are split to make annotation easier. Different suspend power modes produce different logs; actual output is authoritative. Property:

```text
rockchip,sleep-debug-en = <...>;
```

0: No suspend log; 1: Print suspend log. RK3588 system suspend log:

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

RK3588 system resume log:

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

## 4. Typical configurations

### 4.1 Logic power-off mode

This mode supports switching off vdd_logic to reduce suspend power. Configuration:

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

### 4.2 uart0 wake-up

If UART wake-up is required, prefer uart0. It belongs to pd_pmu1 and can wake the system while logic is powered off, reducing power consumption. Configuration:

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

Note: uart0 wake-up requires the 24M crystal to remain running, so its supply must not be switched off.

### 4.3 pwm wake-up

For infrared wake-up, use PWM wake-up. Configuration:

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

Note: pwm wake-up requires the 24M crystal to remain running, so its supply must not be switched off. vdd_logic must also remain powered.

### 4.4 mcu wake-up

If the PMU MCU must perform work during suspend, such as interrupt filtering, use MCU wake-up. Configuration:

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

Note: mcu wake-up requires the 24M crystal to remain running, so its supply must not be switched off. vdd_logic must also remain powered.

### 4.5 gpio wake-up

For gpio0 wake-up, the logic power-off configuration is sufficient because gpio0 is in pd_pmu. For gpio1–4 wake-up, vdd_logic must remain powered. Configuration:

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

Note: gpio1–4 wake-up requires the 24M crystal to remain running, so its supply must not be switched off.

{% endraw %}
