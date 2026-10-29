---
title: "Rockchip RK3308 系统待机完整指南：DTS、唤醒与日志"
description: "Rockchip RK3308 系统待机完整指南：DTS、唤醒与日志 — V1.1.1"
excerpt: "Rockchip RK3308 系统待机完整指南：DTS、唤醒与日志"
translation_key: 149-rockchip-rk3308-suspend
slug: 149-rockchip-rk3308-suspend
lang: zh
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
reference_products: ["P2pro"]
products: []
tags: [ArmSoM, Rockchip, RK3308, suspend, DTS]
---

{% raw %}

# Rockchip RK3308 系统待机完整指南：DTS、唤醒与日志

以中文 V1.1.1 为共同正文基准，逐章核对英文原稿（封面 V1.0.0、修订表至 V1.1.0）；技术范围 RK3308、Linux 4.4/4.19。中文新版修订说明为格式调整，已核对技术章节并保留英文明确的范围写法差异。两稿均无独立技术图片。仅作 ArmSoM 平台参考，须核对实际 SoC、板卡、SDK/BSP、trust、内核、电源树与唤醒电路；未进行硬件测试或运行休眠、供电命令。

> 配置电源断电、时钟或唤醒源错误可能导致系统无法唤醒或数据丢失；示例应由熟悉具体硬件的工程师核对后使用。原稿代码注释、拼写、占位符与疑点保留，不补造缺失常量。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. 系统待机

凡是带有 trust 的 SoC 平台,系统待机(system suspend)的工作都在 trust 中完成。因为各个平台的trust 对于系统待机实现各不相同,所以不同平台之间的待机配置选项/方法没有任何关联性和参考性,本文档仅适用于 RK3308 平台。系统待机流程一般会有如下操作:关闭 power domain、模块 IP、时钟、PLL、ddr 进入自刷新、系统总线切到低速时钟(24M 或 32K)、vdd_arm 断电、配置唤醒源等。为了满足不同产品对待机模式的需求,目前都是通过 DTS 节点把相关配置在开机阶段传递给 trust。

### 1.1 驱动文件

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3308.h
```

### 1.2 DTS 节点

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

## 2. DTS 配置

目前已支持的配置选项都定义在:

```text
./include/dt-bindings/suspend/rockchip-rk3308.h
```

### 2.1 常规配置

配置项:

```text
rockchip,sleep-mode-config = <...>;
```

配置源:

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

目前 RK3308 支持的待机模式可分为 2 类:VAD 类产品:待机时需要支持 VAD 唤醒源,不会关闭 VAD/ACODEC/PDM 等相关模块 IP 和时钟,需保持 24M 晶振和相关 PLL 正常工作。目前待机时 trust 会先检测 VAD 相关模式是否在 kernel 阶段已经关闭,如果没有关闭则默认是 VAD 类产品,待机时切到支持 VAD 唤醒的低功耗模式。非 VAD 类产品:待机时没有需要维持工作的模块 IP,所有的模块和时钟几乎都可以关闭,是一种最低功耗的模式。这种模式下,系统时钟可以切到 32K 或者 24M。

### 2.2 电源配置

配置项:

```text
rockchip,pwm-regulator-config = <...>;
```

配置源:

```text
// 使⽤pwm-regulator
#define RKPM_PWM_REGULATOR          BIT(2)
```

电源注意点:根据外部硬件电路设计确定是否使用了 pwm-regulator。

### 2.3 唤醒配置

配置项:

```text
rockchip,wakeup-config = <...>;
```

配置源:

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

唤醒源注意点:RKPM_GPIO0_WAKEUP_EN(首选):GPIO0~3 中仅支持 GPIO0 这组 pin 脚作为唤醒源,该模式下 GPIO0 上的 pin 脚中断信号被直接送往 PMU 状态机,不经过 GIC。在硬件设计上,建议用戶把需要的唤醒源尽量都放到 GPIO0 这组pin 脚上。RKPM_ARM_GIC_WAKEUP_EN(次选):

支持所有在 kernel 阶段用 enable_irq_wake()注册到 GIC 的可唤醒中断,适用的唤醒中断源数量比RKPM_GPIO0_WAKEUP_EN 更多。但这种方式相当于把唤醒源的管理权分散交给了 kernel 各个模块,待机时系统有可能被不期望的中断唤醒。RKPM_TIMEOUT_WAKEUP_EN:PMU 内部的 timer 唤醒,默认 5s 超时产生中断,一般仅用于开发阶段测试休眠唤醒使用。

### 2.4 debug 配置

配置项:

```text
rockchip,sleep-mode-config = <...>;
```

配置源:

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

debug 注意点:RKPM_DBG_CLK_UNGATE:如果怀疑待机阶段某些 clk 被关闭而引起系统/模块唤醒异常,可使能该配置。RKPM_DBG_REG:如果怀疑待机阶段某些寄存器值被 trust 修改,可使能该配置。RKPM_DBG_FSM_SOUT:使能该配置后,待机时 PMU 状态机会通过 GPIO4_D5 一直输出特定波形信号,用于反馈当前 PMU 状态机内部状态,该功能仅在发生系统待机时 PMU 状态机本身死机的情况下有用处。

### 2.5 reboot 复位配置

配置项:

```text
rockchip,apios-suspend = <...>;
```

配置源:

```text
#define GLB1RST_IGNORE_PWM0        BIT(23)
#define GLB1RST_IGNORE_PWM1        BIT(24)
#define GLB1RST_IGNORE_PWM2        BIT(25)
#define GLB1RST_IGNORE_GPIO0       BIT(26)
#define GLB1RST_IGNORE_GPIO1       BIT(27)
#define GLB1RST_IGNORE_GPIO2       BIT(28)
#define GLB1RST_IGNORE_GPIO3       BIT(29)
```

reboot 复位注意点：RK3308 默认使用 first global software reset，reboot 时所有模块 IP 都会复位。需要保持某些 IP 不复位时配置以上选项。中文原稿该处范围排版为 pwm0 下标3/gpio0 上标3，显示不完整；英文明确写 pwm0–3/gpio0–3 不复位，但宏列表仅有 PWM0–2、GPIO0–3，保留疑点，需核对实现。GPIO 不复位示例：某些电路提供“power hold”电源控制引脚，需要软件在上电早期拉高/低以保证供电；reboot 时该引脚也不能复位，否则系统将下电。

## 3. 打印信息

如下简要介绍系统待机和唤醒时的 trust 打印信息含义。为注释方便,如下对一些打印内容进行分行,不同的待机功耗模式同样也会带来不同的打印,所有打印信息内容以实际显示为主。RK3308 系统待机打印:

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

RK3308 系统唤醒打印:

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
