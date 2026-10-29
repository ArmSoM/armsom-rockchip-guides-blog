---
title: "Rockchip RK356X 系统待机完整指南：DTS、唤醒与日志"
description: "Rockchip RK356X 系统待机完整指南：DTS、唤醒与日志 — V1.0.0"
excerpt: "Rockchip RK356X 系统待机完整指南：DTS、唤醒与日志"
translation_key: 152-rockchip-rk356x-suspend
slug: 152-rockchip-rk356x-suspend
lang: zh
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
reference_products: ["Sige3", "CM3", "AIM3", "KVM"]
products: []
tags: [ArmSoM, Rockchip, RK356X, suspend, DTS]
---

{% raw %}

# Rockchip RK356X 系统待机完整指南：DTS、唤醒与日志

依据中文原稿 V1.0.0 完整整理，技术范围为 RK356X、Linux 4.19 / 5.10。仅作 ArmSoM 平台参考：必须核对实际板卡 SoC、SDK/BSP、trust/ATF、内核、PMIC、电源树和唤醒引脚；不笼统宣称所有 ArmSoM 板卡支持。此输入无英文 PDF，也无独立技术配图；四语以中文原稿为共同基准。所有代码、配置与日志均为原文示例，未进行硬件测试或执行休眠/供电命令。

> 配置电源断电、时钟或唤醒源错误可能导致系统无法唤醒或数据丢失；示例应由熟悉具体硬件的工程师核对后使用。原稿代码注释、拼写、占位符与疑点保留，不补造缺失常量。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. 系统待机

凡是带有 trust 的 SoC 平台,系统待机(system suspend)的工作都在 trust 中完成。因为各个平台的trust 对于系统待机实现各不相同,所以不同平台之间的待机配置选项/方法没有任何关联性和参考性,本文档仅适用于 RK356X 平台。系统待机流程一般会有如下操作:关闭 power domain、模块 IP、时钟、PLL、ddr 进入自刷新、系统总线切到低速时钟(24M 或 32K)、vdd_arm /vdd_log断电、配置唤醒源等。为了满足不同产品对待机模式的需求,目前都是通过 DTS 节点把相关配置在开机阶段传递给 trust。

### 1.1 驱动文件

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3568.h
```

### 1.2 DTS 节点

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

## 2. DTS 配置

目前已支持的配置选项都定义在:

```text
./include/dt-bindings/suspend/rockchip-rk3568.h
```

### 2.1 常规配置

配置项:

```text
rockchip,sleep-mode-config = <...>;
```

配置源:

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

### 2.2 唤醒源配置

配置项:

```text
rockchip,wakeup-config = <...>;
```

配置源:

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

唤醒源注意事项:RKPM_GPIO_WKUP_EN:仅支持 GPIO0 这组 pin 脚作为唤醒源。在硬件设计上,建议用戶把需要的唤醒源设计在 GPIO0 这组 pin 脚上。

### 2.3 debug 配置

配置项:

```text
rockchip,sleep-debug-en = <...>;
```

debug 注意点:赋值1则打开debug功能,在休眠唤醒中会打印出ATF中休眠和唤醒的log。

## 3. 打印信息

如下简要介绍系统待机和唤醒时的 trust 打印信息含义。为注释方便,如下对一些打印内容进行分行,不同的待机功耗模式同样也会带来不同的打印,所有打印信息内容以实际显示为主。RK356X 系统待机打印:

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

RK356X 系统唤醒打印:

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
