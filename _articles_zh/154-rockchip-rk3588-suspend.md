---
title: "RK3588 系统待机配置指南：电源模式、DTS 与唤醒"
description: "RK3588 系统待机配置指南：电源模式、DTS 与唤醒 — V1.1.0"
excerpt: "RK3588 系统待机配置指南：电源模式、DTS 与唤醒"
translation_key: 154-rockchip-rk3588-suspend
slug: 154-rockchip-rk3588-suspend
lang: zh
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3588, suspend, DTS]
---

{% raw %}

# RK3588 系统待机配置指南：电源模式、DTS 与唤醒

完整整理中文原稿 V1.1.0，适用范围为 RK3588、内核 5.10。仅作 ArmSoM 平台参考：应核对实际板卡、SoC、SDK/BSP、trust/BL31、内核、PMIC、电源树、晶振与唤醒电路。不能由本文推断所有 ArmSoM 板卡均支持。没有英文原稿；四语均以中文正文为准。原稿无独立技术配图，配置及日志全部保留为可复制正文。未进行 ArmSoM 硬件实测，未运行休眠或电源命令。

> 错误的断电或唤醒配置可能导致无法唤醒或数据丢失。保留原稿宏、日志数值及占位符，使用前须核对具体 BSP。正文 RKPM_TIMEOUT_WAKEUP_EN 与代码 RKPM_TIME_OUT_WKUP_EN 写法不同；RKPM_PMUMCU_CEC_WKUP_EN 在示例中使用但未在此宏表列出，不猜补定义。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. 系统待机

凡是带有 trust 的 SoC 平台,系统待机(system suspend)的工作都在 trust 中完成。因为各个平台的trust 对于系统待机实现各不相同,所以不同平台之间的待机配置选项/方法没有任何关联性和参考性,本文档仅适用于 RK3588 平台。系统待机流程一般会有如下操作:关闭 power domain、模块 IP、时钟、PLL、ddr 进入自刷新、系统总线切到低速时钟(24M 或 32K)、vdd_arm /vdd_log断电、配置唤醒源等。为了满足不同产品对待机模式的需求,目前都是通过 DTS 节点把相关配置在开机阶段传递给 trust。

### 1.1 驱动文件

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3588.h
```

### 1.2 DTS 节点

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

## 2. DTS 配置

目前已支持的配置选项都定义在:

```text
./include/dt-bindings/suspend/rockchip-rk3588.h
```

### 2.1 常规配置

配置项:

```text
rockchip,sleep-mode-config = <...>;
```

配置源:

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

注意事项:需要根据具体产品对唤醒源的需求进行相关配置,比如usb唤醒,那休眠时就不能将usb的电源和时钟关闭,所以不能配置RKPM_SLP_ARMOFF_LOGOFF、RKPM_SLP_PMU_DIS_OSC、RKPM_SLP_PMU_PMUALIVE_32K等选项。

### 2.2 唤醒配置

配置项:

```text
rockchip,wakeup-config = <...>;
```

配置源:

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

唤醒源注意事项:RKPM_GPIO_WKUP_EN(首选):GPIO0~4 中仅支持 GPIO0 这组 pin 脚作为唤醒源,该模式下 GPIO0 上的 pin 脚中断信号被直接送往 PMU 状态机,不经过 GIC。在硬件设计上,建议用戶把需要的唤醒源尽量都放到 GPIO0 这组pin 脚上。RKPM_CPU0_WKUP_EN(次选):支持所有在 kernel 阶段用 enable_irq_wake()注册到 GIC 的可唤醒中断,适用的唤醒中断源数量比RKPM_GPIO_WKUP_EN更多。但这种方式相当于把唤醒源的管理权分散交给了 kernel 各个模块,待机时系统有可能被不期望的中断唤醒。RKPM_TIMEOUT_WAKEUP_EN:PMU 内部的 timer 唤醒,默认 1s 超时产生中断,一般仅用于开发阶段测试休眠唤醒使用。

### 2.3 debug 配置

配置项:

```text
rockchip,sleep-mode-config = <...>;
```

配置源:

```text
#define RKPM_SLP_TIME_OUT_WKUP      BIT(25)
#define RKPM_SLP_PMU_DBG            BIT(26)
```

debug 注意点:RKPM_SLP_TIME_OUT_WKUP:使能该配置后,待机后1s左右会自动唤醒,且只有pmu内部timer才能唤醒系统,该配置只用于休眠唤醒测试和debug。RKPM_SLP_PMU_DBG:使能该配置后,待机时 PMU 状态机会通过 GPIO0_A5 一直输出特定波形信号,用于反馈当前 PMU 状态机内部状态,该功能仅用于休眠唤醒测试和debug。

### 2.4 io retention 配置

在vdd_logic断电的休眠场景下,用戶如果仍想维持某个io的电平,则可以配置该属性。配置项:

```text
rockchip,sleep-io-ret-config = <
    (0
    | RKPM_VCCIO1_RET_EN
    ...
    )
>;
```

配置源:

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

注意事项:用戶想要维持某个io的电平时,要配置上这个io所在的io域,且该io域的电源不能断电,否则无法维持电平。

### 2.5 假关机配置

有些产品关机时无法断电,需要使用休眠场景来代替关机场景以降低功耗。配置项:

```text
// 0：关闭假关机模式， 1：开启假关机模式；开启假关机模式后，系统⾛关机流程时就会跑到休眠流程中去
rockchip,virtual-poweroff = <...>;

// 配置关机时的唤醒中断号，系统收到唤醒中断信号后重启开机
rockchip,virtual-poweroff-irqs = < xx xx xx ...>;
```

## 3. 打印信息

如下简要介绍系统待机和唤醒时的 trust 打印信息含义。为注释方便,如下对一些打印内容进行分行,不同的待机功耗模式同样也会带来不同的打印,所有打印信息内容以实际显示为主。配置项:

```text
rockchip,sleep-debug-en = <...>;
```

0:休眠时不会打印log, 1:休眠时会打印log。RK3588 系统待机打印:

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

RK3588 系统唤醒打印:

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

## 4. 典型配置案例

### 4.1 logic断电模式

该模式可以支持vdd_logic断电,降低休眠功耗。配置如下

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

### 4.2 uart0唤醒

如果产品有uart唤醒需求,则应尽量选择uart0。因为uart0在pd_pmu1中,可以在logic断电的情况下支持uart0唤醒,这样功耗更低。配置如下

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

注意事项uart0唤醒需要24M晶振保持工作,所以24M晶振电源不能关闭。

### 4.3 pwm唤醒

如果产品有红外唤醒需求,则需要使用pwm唤醒。配置如下

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

注意事项pwm唤醒需要24M晶振保持工作,所以24M晶振电源不能关闭。pwm唤醒不能关闭vdd_logic。

### 4.4 mcu唤醒

如果产品需要pmu mcu在休眠时进行一些工作(比如中断过滤等),则需要使用mcu唤醒。配置如下

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

注意事项mcu唤醒需要24M晶振保持工作,所以24M晶振电源不能关闭。mcu唤醒不能关闭vdd_logic。

### 4.5 gpio唤醒

如果产品有gpio0的唤醒需求,因为gpio0在pd_pmu中,则使用logic断电模式的配置即可。如果是gpio1~4的唤醒,则vdd_logic不能断电,配置如下

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

注意事项gpio1~4唤醒需要24M晶振保持工作,所以24M晶振电源不能关闭

{% endraw %}
