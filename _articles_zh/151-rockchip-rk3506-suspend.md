---
title: "Rockchip RK3506 系统待机完整指南：DTS、唤醒与日志"
description: "Rockchip RK3506 系统待机完整指南：DTS、唤醒与日志 — V1.1.0"
excerpt: "Rockchip RK3506 系统待机完整指南：DTS、唤醒与日志"
translation_key: 151-rockchip-rk3506-suspend
slug: 151-rockchip-rk3506-suspend
lang: zh
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3506, suspend, DTS]
---

{% raw %}

# Rockchip RK3506 系统待机完整指南：DTS、唤醒与日志

依据中文原稿 V1.1.0 完整整理，技术范围为 RK3506、Linux 6.1。仅作 ArmSoM 平台参考：必须核对实际板卡 SoC、SDK/BSP、trust/ATF、内核、PMIC、电源树和唤醒引脚；不笼统宣称所有 ArmSoM 板卡支持。此输入无英文 PDF，也无独立技术配图；四语以中文原稿为共同基准。所有代码、配置与日志均为原文示例，未进行硬件测试或执行休眠/供电命令。

> 配置电源断电、时钟或唤醒源错误可能导致系统无法唤醒或数据丢失；示例应由熟悉具体硬件的工程师核对后使用。原稿代码注释、拼写、占位符与疑点保留，不补造缺失常量。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. 系统待机

Linux平台上的待机流程:Linux内核的通用待机流程(完成外设模块、OS的Suspend)==> 进入RK3506的OPTEE中完成SoC的待机流程。固件版本说明:OPTEE固件对应rkbin仓库中的rk3506_tee_vx.yy.bin文件。考虑到功能的完善、BUG的修复等方面,建议客户使用的版本不低于:

```text
rk3506_tee_v2.10.bin      // sdk默认
rk3506_tee_ta_v1.10.bin   // 客户有ta需求时使用
```

OPTEE中的待机流程一般会有如下操作:关闭模块 IP、时钟、PLL、ddr 进入自刷新、系统总线切到低速时钟(24M 或 32K)、vdd_arm/vdd_logic 断电、配置唤醒源等。为了满足不同产品对待机模式的需求,目前都是通过 DTS 节点把相关配置在开机阶段传递给 OPTEE。注意:不同平台之间的待机配置选项/方法没有任何关联性和参考性,本文档仅适用于 RK3506 平台。当前文档中提到的 "VD_PMU、VD_Logic域" 概念请参考TRM的PMU章节。

### 1.1 驱动文件

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3506.h
```

### 1.2 DTS 节点

```text
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-rk3506";
    status = "okay";
    // 常规配置（必要，根据实际需求配置）
    rockchip,sleep-mode-config = <
        (0
        | RKPM_ARMOFF_DDRPD
        | RKPM_24M_OSC_DIS
        | RKPM_32K_CLK
        | RKPM_32K_SRC_RC
        )
    >;
    // 唤醒源配置（必要，根据实际需求配置）
    rockchip,wakeup-config = <
        (0
        | RKPM_GPIO0_WAKEUP_EN
        )
    >;
    // 电源配置（必要，根据实际硬件设计进行配置）
    rockchip,apios-suspend = <
        (0
        | RKPM_PWREN_CORE_GPIO0A2 | RKPM_PWREN_CORE_ACT_LOW
        | RKPM_PWREN_SLEEP_GPIO0A0 | RKPM_PWREN_SLEEP_ACT_LOW
        )
    >;
    // GPIO配置（可选，根据实际需求配置。用于配置外设io状态以便降低待机功耗）
#define GPIO0_IOC_GPIO0A_PULL_REG   0xff950200
#define GPIO0_IOC_GPIO0C_PULL_REG   0xff950208
#define GPIO0A3_PULL_DOWN       0x00c00080
#define GPIO0C5_PULL_DOWN       0x0c000800
    rockchip,sleep-io-config = <
        GPIO0_IOC_GPIO0C_PULL_REG GPIO0C5_PULL_DOWN /* PWM0_CH0_CPU */
        GPIO0_IOC_GPIO0A_PULL_REG GPIO0A3_PULL_DOWN /* PWM0_CH2_LCD_BL */
    >;
    // 调试配置（可选，根据实际需求配置。用于调试分析）
    rockchip,sleep-debug-en = <
        (0
        | RKPM_DBG_TIMEOUT_S(3)
        )
    >;
};
```

Rockchip SDK中给的配置一般是通用且比较完整的配置参考,客户请根据自己的实际需求进行增减。

## 2. DTS 配置

目前已支持的配置选项都定义在:

```text
./include/dt-bindings/suspend/rockchip-rk3506.h
```

### 2.1 常规配置

配置项:

```text
rockchip,sleep-mode-config = <...>;
```

配置源:

```text
// ARM不断电。产品上一般不使用，仅用于排查问题。
#define RKPM_ARMPD                       BIT(0)

// ARM断电 + ddr不进入低功耗。产品上一般不使用，仅用于排查问题。
#define RKPM_ARMOFF                      BIT(1)

// ARM断电 + ddr进入低功耗。
#define RKPM_ARMOFF_DDRPD                BIT(2)

// ARM断电 + Logic断电 + ddr进入低功耗。
#define RKPM_ARMOFF_LOGOFF               BIT(3)

// 关闭24M晶振（只有切到32k时钟的情况下才允许配上）。
#define RKPM_24M_OSC_DIS                 BIT(4)

// 系统时钟切到32K。
#define RKPM_32K_CLK                     BIT(5)
// 32K系统时钟的来源（要求必须配置RKPM_32K_CLK）。分别是：
// - 外部32k晶振（需要板子支持）
// - SoC内置RC400时钟分频到32k
// - 24M晶振分频(此时不能配置RKPM_24M_OSC_DIS)
// 如果在意待机耗时的准确性，选择建议：外部32k晶振 > 24M晶振分频(此时待机不能关晶振，功耗会比选择RC时钟更大) > SoC内置RC时钟。
// 如果不在意待机耗时的准确性，选择建议：SoC内置RC时钟。
#define RKPM_32K_SRC_OSC                 BIT(6)
#define RKPM_32K_SRC_RC                  BIT(7)
#define RKPM_32K_SRC_24XIN               BIT(8)

// 使用分立电源方案且VDD_ARM使用PWM0_CH0控制PWM调压，需要配上。
#define RKPM_PWM0_CH0_REGULATOR          BIT(9)

// 不关PWM0时钟，对应cru gate1[1]。如果待机时需要pwm0上的呼吸灯继续工作，需要配上。
#define RKPM_PWM0_SRC_24M_EN             BIT(10)

// 不关PWM0时钟，对应cru gate1[0]。产品上一般不配，仅特殊需求或排查问题时使用。
#define RKPM_PWM0_SRC_PLL_EN             BIT(11)

// 不关VD_Logic域的总时钟。产品上一般不配，仅特殊需求或排查问题时使用。
#define RKPM_LOG_CLK_ALIVE               BIT(12)

// 不关PLL。产品上一般不配，仅特殊需求或排查问题时使用。
#define RKPM_GPLL_ALIVE                  BIT(13)
#define RKPM_V0PLL_ALIVE                 BIT(14)
#define RKPM_V1PLL_ALIVE                 BIT(15)
// 关闭GPIO4的输入使能。可能有一点待机功耗收益，但是无法支持GPIO4作为唤醒源。
// 客户自行验证后确认是否要用。
#define RKPM_GPIO4_IE_DIS                BIT(16)

// VD_PMU域的模块不切到低速时钟。一般是待机情况下还需要VD_PMU域的模块正常工作时需要配上。
// 例如：系统待机时MCU也还继续工作，它要控制GPIO0上的pin脚状态。
#define RKPM_PMU_BUS_CLK_HS              BIT(17)

// 仅在RK801电源方案上才配置。
#define RKPM_PWM0_CH0_CORE_PWREN         BIT(18)
```

目前 RK3506 支持的待机模式有两种:ARM断电。ARM+LOGIC断电。

### 2.2 电源配置

配置项:

```text
rockchip,apios-suspend = <...>;
```

配置源:

```text
// PWRCTRL_SLEEP脚关电源时的极性
#define RKPM_PWREN_SLEEP_ACT_LOW         PIN0(PWREN_ACT_LOW_MASK)
#define RKPM_PWREN_SLEEP_ACT_HIGH        PIN0(PWREN_ACT_HIGH_MASK)
// PWRCTRL_SLEEP脚定义
#define RKPM_PWREN_SLEEP_GPIO0A0         PIN0(0)
#define RKPM_PWREN_SLEEP_GPIO0A1         PIN0(1)
#define RKPM_PWREN_SLEEP_GPIO0A2         PIN0(2)
#define RKPM_PWREN_SLEEP_GPIO0A3         PIN0(3)
#define RKPM_PWREN_SLEEP_GPIO0A4         PIN0(4)
#define RKPM_PWREN_SLEEP_GPIO0A5         PIN0(5)
#define RKPM_PWREN_SLEEP_GPIO0A6         PIN0(6)
#define RKPM_PWREN_SLEEP_GPIO0A7         PIN0(7)
#define RKPM_PWREN_SLEEP_GPIO0B0         PIN0(8)
#define RKPM_PWREN_SLEEP_GPIO0B1         PIN0(9)
#define RKPM_PWREN_SLEEP_GPIO0B2         PIN0(10)
#define RKPM_PWREN_SLEEP_GPIO0B3         PIN0(11)
#define RKPM_PWREN_SLEEP_GPIO0B4         PIN0(12)
#define RKPM_PWREN_SLEEP_GPIO0B5         PIN0(13)
#define RKPM_PWREN_SLEEP_GPIO0B6         PIN0(14)
#define RKPM_PWREN_SLEEP_GPIO0B7         PIN0(15)
#define RKPM_PWREN_SLEEP_GPIO0C0         PIN0(16)
#define RKPM_PWREN_SLEEP_GPIO0C1         PIN0(17)
#define RKPM_PWREN_SLEEP_GPIO0C2         PIN0(18)
#define RKPM_PWREN_SLEEP_GPIO0C3         PIN0(19)
#define RKPM_PWREN_SLEEP_GPIO0C4         PIN0(20)
#define RKPM_PWREN_SLEEP_GPIO0C5         PIN0(21)
#define RKPM_PWREN_SLEEP_GPIO0C6         PIN0(22)
#define RKPM_PWREN_SLEEP_GPIO0C7         PIN0(23)
#define RKPM_PWREN_SLEEP_GPIO1B1         PIN0(24)
#define RKPM_PWREN_SLEEP_GPIO1B2         PIN0(25)
#define RKPM_PWREN_SLEEP_GPIO1B3         PIN0(26)
#define RKPM_PWREN_SLEEP_GPIO1C2         PIN0(27)
#define RKPM_PWREN_SLEEP_GPIO1C3         PIN0(28)
#define RKPM_PWREN_SLEEP_GPIO1D1         PIN0(29)
#define RKPM_PWREN_SLEEP_GPIO1D2         PIN0(30)
#define RKPM_PWREN_SLEEP_GPIO1D3         PIN0(31)

// PWRCTRL_CORE脚关电源时的极性
#define RKPM_PWREN_CORE_ACT_LOW          PIN8(PWREN_ACT_LOW_MASK)
#define RKPM_PWREN_CORE_ACT_HIGH         PIN8(PWREN_ACT_HIGH_MASK)
// PWRCTRL_CORE脚定义
#define RKPM_PWREN_CORE_GPIO0A0          PIN8(0)
#define RKPM_PWREN_CORE_GPIO0A1          PIN8(1)
#define RKPM_PWREN_CORE_GPIO0A2          PIN8(2)
#define RKPM_PWREN_CORE_GPIO0A3          PIN8(3)
#define RKPM_PWREN_CORE_GPIO0A4          PIN8(4)
#define RKPM_PWREN_CORE_GPIO0A5          PIN8(5)
#define RKPM_PWREN_CORE_GPIO0A6          PIN8(6)
#define RKPM_PWREN_CORE_GPIO0A7          PIN8(7)
#define RKPM_PWREN_CORE_GPIO0B0          PIN8(8)
#define RKPM_PWREN_CORE_GPIO0B1          PIN8(9)
#define RKPM_PWREN_CORE_GPIO0B2          PIN8(10)
#define RKPM_PWREN_CORE_GPIO0B3          PIN8(11)
#define RKPM_PWREN_CORE_GPIO0B4          PIN8(12)
#define RKPM_PWREN_CORE_GPIO0B5          PIN8(13)
#define RKPM_PWREN_CORE_GPIO0B6          PIN8(14)
#define RKPM_PWREN_CORE_GPIO0B7          PIN8(15)
#define RKPM_PWREN_CORE_GPIO0C0          PIN8(16)
#define RKPM_PWREN_CORE_GPIO0C1          PIN8(17)
#define RKPM_PWREN_CORE_GPIO0C2          PIN8(18)
#define RKPM_PWREN_CORE_GPIO0C3          PIN8(19)
#define RKPM_PWREN_CORE_GPIO0C4          PIN8(20)
#define RKPM_PWREN_CORE_GPIO0C5          PIN8(21)
#define RKPM_PWREN_CORE_GPIO0C6          PIN8(22)
#define RKPM_PWREN_CORE_GPIO0C7          PIN8(23)
#define RKPM_PWREN_CORE_GPIO1B1          PIN8(24)
#define RKPM_PWREN_CORE_GPIO1B2          PIN8(25)
#define RKPM_PWREN_CORE_GPIO1B3          PIN8(26)
#define RKPM_PWREN_CORE_GPIO1C2          PIN8(27)
#define RKPM_PWREN_CORE_GPIO1C3          PIN8(28)
#define RKPM_PWREN_CORE_GPIO1D1          PIN8(29)
#define RKPM_PWREN_CORE_GPIO1D2          PIN8(30)
#define RKPM_PWREN_CORE_GPIO1D3          PIN8(31)
```

目前RK3506硬件设计上支持用一个或两个pwrctrl引脚,用于控制vdd_core、vdd_logic和其它电源的待机状态。请根据产品的实际硬件设计和待机需求进行配置。例如 arch/arm/boot/dts/rk3502-evb1-v10.dtsi 的配置:

```text
rockchip,sleep-mode-config = <
        (0
        | RKPM_ARMOFF_DDRPD
        | RKPM_24M_OSC_DIS
        | RKPM_32K_CLK
        | RKPM_32K_SRC_RC
        | RKPM_PWM0_CH0_REGULATOR
        )
    >;

// - pwrctrl_core(gpio0_a2), 拉低时关vdd_core。
// - pwrctrl_sleep(gpio0_a0), 拉低时关vdd_logic和其它电源。
// - 注意：虽然这里两个pwrctrl脚都配置了，但RKPM_ARMOFF_DDRPD待机模式下只拉pwrctrl_core，只有RKPM_ARMOFF_LOGOFF模式下才会拉两个pwrctrl脚。
rockchip,apios-suspend = <
    (0
    | RKPM_PWREN_CORE_GPIO0A2 | RKPM_PWREN_CORE_ACT_LOW
    | RKPM_PWREN_SLEEP_GPIO0A0 | RKPM_PWREN_SLEEP_ACT_LOW
    )
>;
```

### 2.3 唤醒源配置

配置项:

```text
rockchip,wakeup-config = <...>;
```

配置源:

```text
// 暂不支持。有需求请提Redmine。
#define RKPM_ARM_WAKEUP_EN               BIT(0)
#define RKPM_M0_WAKEUP_EN                BIT(1)
#define RKPM_HPTIMER_WAKEUP_EN           BIT(2)

// 已支持。
#define RKPM_GPIO0_WAKEUP_EN             BIT(3)
#define RKPM_GPIO1_SHADOW_WAKEUP_EN      BIT(4)
#define RKPM_GPIO2_WAKEUP_EN             BIT(5)
#define RKPM_GPIO3_WAKEUP_EN             BIT(6)
#define RKPM_GPIO4_WAKEUP_EN             BIT(7)

// 暂不支持。有需求请提Redmine。
#define RKPM_PWM0_WAKEUP_EN              BIT(8)
#define RKPM_PWM1_WAKEUP_EN              BIT(9)
#define RKPM_PWM2_WAKEUP_EN              BIT(10)

// 已支持。UART作为唤醒源的配置注意点：
// - 待机模式选择：vdd_logic不断电、时钟不要切到32k。
// - 内核uart节点：增加"wakeup-source;"属性。
// - uart时钟源应该是24M晶振、保证待机前uart时钟没有关闭。
#define RKPM_UART0_WAKEUP_EN             BIT(11)
#define RKPM_UART1_WAKEUP_EN             BIT(12)
#define RKPM_UART2_WAKEUP_EN             BIT(13)
#define RKPM_UART3_WAKEUP_EN             BIT(14)
#define RKPM_UART4_WAKEUP_EN             BIT(15)
#define RKPM_UART5_WAKEUP_EN             BIT(16)
// 已支持。（待机时系统时钟可以切到32K模式）
#define RKPM_USB0_DET_WAKEUP_EN          BIT(17)
#define RKPM_USB1_DET_WAKEUP_EN          BIT(18)

// 暂不支持。有需求请提Redmine。
#define RKPM_MAC0_WAKEUP_EN              BIT(19)
#define RKPM_MAC1_WAKEUP_EN              BIT(20)
#define RKPM_TIMER0_WAKEUP_EN            BIT(21)
#define RKPM_TIMER1_WAKEUP_EN            BIT(22)
#define RKPM_CAN0_WAKEUP_EN              BIT(23)
#define RKPM_CAN1_WAKEUP_EN              BIT(24)
#define RKPM_TOUCH_KEY_WAKEUP_EN         BIT(25)
#define RKPM_SARADC_WAKUP_EN             BIT(26)
#define RKPM_ALARM_WAKEUP_EN             BIT(27)
#define RKPM_SECOND_CATCH_WAKEUP_EN      BIT(28)

// 已支持。
#define RKPM_PMU_TIMEOUT_EN              BIT(29)
```

唤醒源注意点:ARM+LOGIC断电的情况:唤醒源只支持VD_PMU域的模块中断,主要是GPIO0、GPIO1_Shadow。USB唤醒请确认内核仓库包含如下补丁:

```text
commit 8e6926b1d4ae8ace396f5bd59e3e7801ca2ee98f
Author: Jianwei Zheng <jianwei.zheng@rock-chips.com>
Date:   Fri Nov 15 16:37:45 2024 +0800

    phy: rockchip: inno-usb2: support usb wakeup for rk3506

    1. Support linestate filter time control register for OTG0 and OTG1.
    2. Disable disconnect rise and disconnect fall irq. Because these
    two interrupts will be triggered immediately after the system goes
    into sleep mode, causing the system to be unable to sleep.

    Change-Id: Ia6c1e58ef926f86dee6df0013aafe9bfe4586b52
    Signed-off-by: Jianwei Zheng <jianwei.zheng@rock-chips.com>
```

### 2.4 GPIO配置

配置项:

```text
rockchip,sleep-io-config = <...>;
```

该配置项主要用于优化待机功耗。目前产品上的待机功耗要求都比较高,而不合理的GPIO状态(输入、输出、上下拉等)会增加一定程度的待机功耗。对于这类GPIO,如果对应的驱动代码不方便设置待机时的GPIO状态,那么可以在这里进行配置。这里指定的配置会在待机流程的最后阶段设下去,唤醒时会把寄存器恢复成休眠前的状态,请结合自身硬件设计按需配置。

配置采用键值对的方式:"寄存器地址 配置值",最多支持16组。但只能配置:GPIO控制器的GPIO_SWPORT_DR、GPIO_SWPORT_DDR寄存器。IOC控制器的所有寄存器。如果键值对非法,则待机打印会提示"(invalid)"并忽略该配置;如果键值对超出16组,则待机打印会提示"(overflow)"并忽略该配置。

### 2.5 调试配置

配置项:

```text
rockchip,sleep-debug-en = <...>;
```

产品上不使用,仅排查问题时使用。配置源:

```text
// 待机时使能所有的时钟。
#define RKPM_DBG_CLK_UNGATE              BIT(0)

// 待机时保持所有PLL都常开。
#define RKPM_DBG_PLLS_ALIVE              BIT(1)

// 忽略。
#define RKPM_DBG_PMU_SOUT                BIT(2)

// 执行SoC待机流程之前打印寄存器值。
#define RKPM_DBG_REG1                    BIT(3)

// 执行SoC待机流程之后打印寄存器值。
#define RKPM_DBG_REG2                    BIT(4)

// 忽略。
#define RKPM_DBG_DEEP_JTAG               BIT(5)
#define RKPM_DBG_JTAG                    BIT(6)

// PMU内部的timer超时后自动唤醒(单位:秒)，一般仅用于开发阶段测试休眠唤醒使用。
#define RKPM_DBG_TIMEOUT_S(i)            (((i) & 0xf) << 7)

// 执行SoC待机流程之前就让CPU进入低功耗。
// 用于测试中断无法唤醒系统的情况，目的是确认中断失效是否是因为SoC待机流程配置引起。
#define RKPM_DBG_DUMMY_WFI               BIT(11)

// 在SoC待机流程的起始和结束位置插入两个5s的delay。用于确认某些异常是否因SoC待机流程引起。
#define RKPM_DBG_DUMMY_DELAY1            BIT(12)
#define RKPM_DBG_DUMMY_DELAY2            BIT(13)

// 类同 RKPM_DBG_REG1/2，打印出更多外设模块的寄存器值。
#define RKPM_DBG_PERI_REG                BIT(14)
```

RKPM_DBG_REG1:相当于内核完成所有SUSPEND流程之后打印寄存器状态。

RKPM_DBG_REG2:相当于OPTEE完成最后一步休眠之前打印寄存器状态。如果要分析待机时的io功耗,应以这个配置项为准。

### 2.6 LOGIC断电配置

为了适应大部分产品形态的待机场景,发布的SDK默认都配置为ARM断电模式。下面是参考板上对应的ARM+LOGIC断电模式配置。RK3506G-EVB1板:

```text
diff --git a/arch/arm/boot/dts/rk3502-evb1-v10.dtsi b/arch/arm/boot/dts/rk3502-evb1-v10.dtsi
index 852840cc78c..69124f89661 100644
--- a/arch/arm/boot/dts/rk3502-evb1-v10.dtsi
+++ b/arch/arm/boot/dts/rk3502-evb1-v10.dtsi
@@ -396,7 +396,7 @@
 &rockchip_suspend {
        rockchip,sleep-mode-config = <
                (0
-               | RKPM_ARMOFF_DDRPD
+               | RKPM_ARMOFF_LOGOFF
                | RKPM_24M_OSC_DIS
                | RKPM_32K_CLK
                | RKPM_32K_SRC_RC
```

RK3506G-DEMO(RK801)板:

```text
diff --git a/arch/arm/boot/dts/rk3506-rk801.dtsi b/arch/arm/boot/dts/rk3506-rk801.dtsi
index a0c0778a214..5028e00031b 100644
--- a/arch/arm/boot/dts/rk3506-rk801.dtsi
+++ b/arch/arm/boot/dts/rk3506-rk801.dtsi
@@ -104,7 +104,7 @@
                                regulator-boot-on;
                                regulator-always-on;
                                regulator-state-mem {
-                                       regulator-on-in-suspend;
+                                       regulator-off-in-suspend;
                                        regulator-suspend-microvolt = <1800000>;
                                };
                        };
@@ -114,7 +114,7 @@
                                regulator-boot-on;
                                regulator-always-on;
                                regulator-state-mem {
-                                       regulator-on-in-suspend;
+                                       regulator-off-in-suspend;
                                };
                        };
                };
diff --git a/arch/arm/boot/dts/rk3506g-demo-display-control.dts b/arch/arm/boot/dts/rk3506g-demo-display-control.dts
index 59f8ade8a32..f982c38bd89 100644
--- a/arch/arm/boot/dts/rk3506g-demo-display-control.dts
+++ b/arch/arm/boot/dts/rk3506g-demo-display-control.dts
@@ -580,7 +580,7 @@
 &rockchip_suspend {
        rockchip,sleep-mode-config = <
                (0
-               | RKPM_ARMOFF_DDRPD
+               | RKPM_ARMOFF_LOGOFF
                | RKPM_24M_OSC_DIS
                | RKPM_32K_CLK
                | RKPM_32K_SRC_RC
```

## 3. 打印信息

如下简要介绍系统待机和唤醒时的 打印信息含义。为注释方便,如下对一些打印内容进行分行,不同的待机功耗模式同样也会带来不同的打印,所有打印信息内容以实际显示为主。RK3506 系统待机打印:

```text
// 版本信息。其中："fwver: v1.10"是固件版本号；"-gxxxxx"是固件编译点的commit号。
3.13.0-885-gf24e46b4e16 #chenjh (gcc version 10.2.1 20201103 (GNU Toolchain for
the A-profile Architecture 10.2-2020.11 (arm-10.16))) #4 Fri Oct 18 17:07:30 CST
2024 arm, fwver: v1.10
// 配置信息。这些值对应了内核dts中rockchip_suspend节点的配置值，其中"cnt"表示当前第几次进入待机。
gcfg: cnt=2 global=0x000002b8, pwren=0x0000c2c0, wakeup=0x20000008,
dbg=0x00000180, idle: 0, 0, 0
// rc时钟信息，可以不关心。
rc400: hz=362900, div=6170/65319
// 待机配置的展开信息。对应内核dts中rockchip_suspend节点的配置内容，此处展开为字符串方便阅读。
suspend-mode: armoff_logoff, 24m_osc_dis, 32k_clk, 32k_src_rc, pwm0_ch0_regulator
debug-mode: timeout_3s
pwren-core: gpio0_a2 (act:low)
pwren-sleep: gpio0_a0 (act:low)
wakeup-en: gpio0_int, pmu_timeout_int
// 'sleep-io-config'的配置：
//  - 如果键值对非法，则有类似显示："ff950210 0c000800(invalid)"。
//  - 如果键值对超出16组，则有类似显示："ff950210 0c000800(overflow)"。
sleep-io:
  ff950208 0c000800
  ff950200 00c00080
// 0123... 表示待机过程中的软件步骤。打印完"wfi"表示整个SoC完全进入低功耗待机，等待外部中断唤醒系统。
0123g4567|wfi
```

RK3506 系统唤醒打印(只是arm断电):

```text
// |654... 表示唤醒后软件步骤。注意：如果是Logic断电唤醒，则在这段信息之前还会有一段DDR bin的打印。
|6543g210
// 唤醒源和中断号。
wakeup-pmu: gpio0_int
wakeup-gpio: gpio0_c1
wakeup-irq: 32
// 系统待机累计时长（本轮待机时长）
Wfi-total: 3.441s (this: 1.420s)
```

RK3506 系统唤醒打印(arm+logic断电):

```text
// 唤醒后先是一段ddr打印
DDR c7d3dcd3f0 typ 24/10/11-16:20:18,fwver: v1.02
tREFI:4x, sr_idle:93, pd_idle:13
ES
get rd_skew=0x2a, wr_skew=0x2a
PHY drv:clk:60,ca:160,DQ:80,odt:480
vrefinner:50%, vrefout:50%
dram drv:40,odt:0
sr_dq:0, sr_ca:0, sr_clk:0
rg:0x19-0x0-0x2, 0xd-0x0-0x2,status:a007
DDR3, 750MHz
BW=16 Col=10 Bk=8 CS0 Row=13 CS=1 Size=128MB
jump 0x68f4
// 唤醒流程代码的打印
|6543g210
wakeup-pmu: pmu_timeout_int

Wfi-total: 1394.184s (this: 4.979s)
```

{% endraw %}
