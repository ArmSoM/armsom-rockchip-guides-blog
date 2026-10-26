---
title: "Rockchip RK3308 System Suspend: Complete DTS, Wake-up and Logging Guide"
description: "Rockchip RK3308 System Suspend: Complete DTS, Wake-up and Logging Guide — V1.1.1"
excerpt: "Rockchip RK3308 System Suspend: Complete DTS, Wake-up and Logging Guide"
translation_key: 149-rockchip-rk3308-suspend
slug: 149-rockchip-rk3308-suspend
lang: en
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3308, suspend, DTS]
---

{% raw %}

# Rockchip RK3308 System Suspend: Complete DTS, Wake-up and Logging Guide

Chinese V1.1.1 is the shared technical baseline, checked chapter by chapter against the English source (cover V1.0.0, revision table through V1.1.0). Scope: RK3308, Linux 4.4/4.19. The newer Chinese revision describes formatting changes; technical chapters were cross-checked and the English explicit range wording is noted separately. Neither source has standalone technical figures. ArmSoM platform reference only: verify SoC, board, SDK/BSP, trust, kernel, power tree and wake-up circuitry. No hardware tests or suspend/power commands were performed.

> Incorrect power-off, clock or wake-source settings may prevent resume or cause data loss. Have an engineer familiar with the hardware verify examples before use. Source code comments, spelling, placeholders and ambiguities are retained without inventing constants.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. System suspend

On SoC platforms with trust, system suspend is handled in trust. Implementations differ, so options and methods from other platforms cannot serve as a configuration reference; this guide applies only to RK3308. Typical suspend operations disable power domains, IP modules, clocks and PLLs, put DDR into self-refresh, switch the system bus to a low-speed clock (24M or 32K), power off vdd_arm and configure wake-up sources. To meet product requirements, configuration is passed to trust through DTS nodes at boot.

### 1.1 Driver files

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3308.h
```

### 1.2 DTS node

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

## 2. DTS configuration

Currently supported configuration options are defined in:

```text
./include/dt-bindings/suspend/rockchip-rk3308.h
```

### 2.1 General configuration

Configuration property:

```text
rockchip,sleep-mode-config = <...>;
```

Configuration definitions:

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

RK3308 suspend modes fall into two categories. VAD products require VAD wake-up during suspend: VAD/ACODEC/PDM and related IP and clocks remain enabled, as do the 24M crystal and related PLLs. Trust first checks whether the VAD-related mode was disabled by the kernel; if not, it assumes a VAD product and selects a low-power mode supporting VAD wake-up. Non-VAD products require no IP to keep operating; almost all modules and clocks can be disabled for minimum power consumption. Their system clock can switch to 32K or 24M.

### 2.2 Power configuration

Configuration property:

```text
rockchip,pwm-regulator-config = <...>;
```

Configuration definitions:

```text
// 使⽤pwm-regulator
#define RKPM_PWM_REGULATOR          BIT(2)
```

Power note: determine whether pwm-regulator is used from the external hardware circuit design.

### 2.3 Wake-up configuration

Configuration property:

```text
rockchip,wakeup-config = <...>;
```

Configuration definitions:

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

Wake sources: RKPM_GPIO0_WAKEUP_EN is preferred. Among GPIO0–3, only GPIO0 pins are supported. Their interrupt signals go directly to the PMU state machine, bypassing the GIC. Place required wake-up signals on GPIO0 wherever possible in the hardware design. RKPM_ARM_GIC_WAKEUP_EN is the second choice:

All wake-capable interrupts registered with the GIC through enable_irq_wake() during the kernel stage are supported, giving more sources than RKPM_GPIO0_WAKEUP_EN. However, wake-source management is distributed across kernel modules and an unintended interrupt may wake the system. RKPM_TIMEOUT_WAKEUP_EN uses the PMU internal timer, which times out after 5s by default; it is normally only for development suspend/resume tests.

### 2.4 Debug configuration

Configuration property:

```text
rockchip,sleep-mode-config = <...>;
```

Configuration definitions:

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

Debug notes: enable RKPM_DBG_CLK_UNGATE if disabled clocks during suspend are suspected of causing system/module resume problems. Enable RKPM_DBG_REG if trust is suspected of changing register values during suspend. RKPM_DBG_FSM_SOUT makes the PMU state machine continuously output a specific waveform on GPIO4_D5 during suspend to indicate its internal state. This is useful only when the PMU state machine itself hangs during suspend.

### 2.5 Reboot/reset configuration

Configuration property:

```text
rockchip,apios-suspend = <...>;
```

Configuration definitions:

```text
#define GLB1RST_IGNORE_PWM0        BIT(23)
#define GLB1RST_IGNORE_PWM1        BIT(24)
#define GLB1RST_IGNORE_PWM2        BIT(25)
#define GLB1RST_IGNORE_GPIO0       BIT(26)
#define GLB1RST_IGNORE_GPIO1       BIT(27)
#define GLB1RST_IGNORE_GPIO2       BIT(28)
#define GLB1RST_IGNORE_GPIO3       BIT(29)
```

Reboot/reset notes: RK3308 defaults to first global software reset, resetting every IP module on reboot. Configure the options above to preserve selected IP. The Chinese source has malformed range typography; the English source explicitly says pwm0–3/gpio0–3 can avoid reset, while the actual macro list only enumerates PWM0–2 and GPIO0–3. Preserve this source discrepancy and verify the implementation. GPIO example: some circuits provide a "power hold" pin that software must drive high/low early in boot to keep system power working. It must not reset on reboot, or the system will power off.

## 3. Log messages

The following explains trust suspend/resume messages. Some output is split into lines for annotation; different low-power modes produce different output. Actual logs are authoritative. RK3308 suspend log:

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

RK3308 resume log:

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
