---
title: "RK3588: настройка сна системы, режимы питания, DTS и пробуждение"
description: "RK3588: настройка сна системы, режимы питания, DTS и пробуждение — V1.1.0"
excerpt: "RK3588: настройка сна системы, режимы питания, DTS и пробуждение"
translation_key: 154-rockchip-rk3588-suspend
slug: 154-rockchip-rk3588-suspend
lang: ru
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3588, suspend, DTS]
---

{% raw %}

# RK3588: настройка сна системы, режимы питания, DTS и пробуждение

Полный китайский оригинал V1.1.0 для RK3588, ядро 5.10. Только платформенный справочник ArmSoM: проверяйте плату, SoC, SDK/BSP, trust/BL31, ядро, PMIC, питание, кварц и цепи пробуждения. Поддержка всех плат ArmSoM не подразумевается. Английского оригинала нет; четыре языка следуют китайскому тексту. Отдельных технических рисунков нет; все настройки и журналы доступны для копирования. Аппаратных испытаний ArmSoM и выполнения команд сна/питания не было.

> Ошибочная настройка отключения питания или пробуждения может препятствовать выходу из сна или привести к потере данных. Макросы, значения журналов и заполнители сохранены; сверяйте BSP. В тексте указан RKPM_TIMEOUT_WAKEUP_EN, а в коде RKPM_TIME_OUT_WKUP_EN. Примеры используют RKPM_PMUMCU_CEC_WKUP_EN, но таблица макросов не даёт определения; оно не выдумывается.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Приостановка системы

В SoC с trust приостановка системы выполняется в trust. Реализация различается между платформами, поэтому их параметры и методы настройки сна не взаимозаменяемы. Руководство относится только к RK3588. Обычно отключаются домены питания, IP-блоки, тактовые сигналы и PLL, DDR переходит в саморегенерацию, системная шина переключается на медленный тактовый сигнал (24M или 32K), отключаются vdd_arm/vdd_log и настраиваются источники пробуждения. Для разных требований изделий настройки DTS передаются в trust во время загрузки.

### 1.1 Файлы драйверов

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3588.h
```

### 1.2 Узел DTS

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

## 2. Настройка DTS

Поддерживаемые параметры конфигурации определены в:

```text
./include/dt-bindings/suspend/rockchip-rk3588.h
```

### 2.1 Основная настройка

Свойство конфигурации:

```text
rockchip,sleep-mode-config = <...>;
```

Определения конфигурации:

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

Примечания: Настройки должны соответствовать источникам пробуждения изделия. Для USB нельзя отключать его питание и тактирование во сне, поэтому не выбирайте RKPM_SLP_ARMOFF_LOGOFF, RKPM_SLP_PMU_DIS_OSC и RKPM_SLP_PMU_PMUALIVE_32K.

### 2.2 Настройка пробуждения

Свойство конфигурации:

```text
rockchip,wakeup-config = <...>;
```

Определения конфигурации:

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

Примечания: RKPM_GPIO_WKUP_EN (предпочтительно): Из GPIO0–4 в этом режиме поддерживаются только выводы GPIO0. Их прерывания поступают прямо в автомат PMU, минуя GIC. При проектировании по возможности размещайте источники пробуждения на GPIO0. RKPM_CPU0_WKUP_EN (второй выбор): поддерживает все пробуждающие прерывания, зарегистрированные в GIC через enable_irq_wake() в ядре; источников больше, чем у RKPM_GPIO_WKUP_EN. Но управление распределяется между модулями ядра, поэтому возможны нежелательные пробуждения. RKPM_TIMEOUT_WAKEUP_EN: внутренний таймер PMU, по умолчанию прерывание через 1s; обычно только для тестирования сна/пробуждения при разработке.

### 2.3 Настройка отладки

Свойство конфигурации:

```text
rockchip,sleep-mode-config = <...>;
```

Определения конфигурации:

```text
#define RKPM_SLP_TIME_OUT_WKUP      BIT(25)
#define RKPM_SLP_PMU_DBG            BIT(26)
```

Отладка: RKPM_SLP_TIME_OUT_WKUP: система автоматически пробуждается примерно через 1s сна, причём пробуждать её может только внутренний таймер PMU. Только для испытаний и отладки сна/пробуждения. RKPM_SLP_PMU_DBG непрерывно выводит через GPIO0_A5 сигнал внутреннего состояния автомата PMU во сне; только для тестирования и отладки.

### 2.4 Настройка удержания I/O

Для удержания уровня I/O во сне при отключённом vdd_logic настройте это свойство. Свойство:

```text
rockchip,sleep-io-ret-config = <
    (0
    | RKPM_VCCIO1_RET_EN
    ...
    )
>;
```

Определения конфигурации:

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

Примечание: Для удержания уровня настройте соответствующий I/O-домен и не отключайте его питание, иначе удержать уровень невозможно.

### 2.5 Настройка виртуального выключения

Некоторые изделия не могут физически отключить питание при выключении. Для снижения потребления вместо выключения используется сон. Свойство:

```text
// 0：关闭假关机模式， 1：开启假关机模式；开启假关机模式后，系统⾛关机流程时就会跑到休眠流程中去
rockchip,virtual-poweroff = <...>;

// 配置关机时的唤醒中断号，系统收到唤醒中断信号后重启开机
rockchip,virtual-poweroff-irqs = < xx xx xx ...>;
```

## 3. Сообщения журнала

Ниже объясняются сообщения trust при сне и пробуждении. Для удобства комментариев некоторые строки разделены. Разные режимы энергопотребления дают разные журналы; ориентируйтесь на фактический вывод. Свойство:

```text
rockchip,sleep-debug-en = <...>;
```

0: Журнал сна выключен; 1: Журнал сна включён. Журнал сна RK3588:

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

Журнал пробуждения RK3588:

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

## 4. Типовые конфигурации

### 4.1 Режим отключения logic

Режим позволяет отключать vdd_logic для снижения потребления во сне. Конфигурация:

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

### 4.2 Пробуждение от uart0

Если требуется пробуждение от UART, предпочтителен uart0. Он находится в pd_pmu1 и может пробуждать систему при отключённом logic, снижая потребление. Конфигурация:

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

Примечание: Пробуждение от uart0 требует работающего кварца 24M, поэтому его питание отключать нельзя.

### 4.3 Пробуждение от pwm

Для инфракрасного пробуждения используйте PWM. Конфигурация:

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

Примечание: Пробуждение от pwm требует работающего кварца 24M, поэтому его питание отключать нельзя. Питание vdd_logic также должно сохраняться.

### 4.4 Пробуждение от mcu

Если PMU MCU должен выполнять задачи во сне, например фильтровать прерывания, используйте MCU-пробуждение. Конфигурация:

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

Примечание: Пробуждение от mcu требует работающего кварца 24M, поэтому его питание отключать нельзя. Питание vdd_logic также должно сохраняться.

### 4.5 Пробуждение от gpio

Для пробуждения от gpio0 достаточно режима отключения logic, поскольку gpio0 находится в pd_pmu. Для gpio1–4 питание vdd_logic отключать нельзя. Конфигурация:

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

Примечание: Пробуждение от gpio1–4 требует работающего кварца 24M, поэтому его питание отключать нельзя.

{% endraw %}
