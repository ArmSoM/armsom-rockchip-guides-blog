---
title: "RK3576: настройка сна системы, режимы питания, DTS и пробуждение"
description: "RK3576: настройка сна системы, режимы питания, DTS и пробуждение — V1.0.0"
excerpt: "RK3576: настройка сна системы, режимы питания, DTS и пробуждение"
translation_key: 153-rockchip-rk3576-suspend
slug: 153-rockchip-rk3576-suspend
lang: ru
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK3576, suspend, DTS]
---

{% raw %}

# RK3576: настройка сна системы, режимы питания, DTS и пробуждение

Полный китайский оригинал V1.0.0 для RK3576, ядро 6.10. Только платформенный справочник ArmSoM: проверяйте плату, SoC, SDK/BSP, trust/BL31, ядро, PMIC, питание, кварц и цепи пробуждения. Поддержка всех плат ArmSoM не подразумевается. Английского оригинала нет; четыре языка следуют китайскому тексту. Отдельных технических рисунков нет; все настройки и журналы доступны для копирования. Аппаратных испытаний ArmSoM и выполнения команд сна/питания не было.

> Ошибочная настройка отключения питания или пробуждения может препятствовать выходу из сна или привести к потере данных. Макросы, значения журналов и заполнители сохранены; сверяйте BSP. В тексте указан RKPM_TIMEOUT_WAKEUP_EN, а в коде RKPM_TIMEOUT_WKUP_EN. Примеры используют RKPM_SLP_PMIC_LP, но таблица макросов не даёт определения; оно не выдумывается. Таблица версий действительно содержит Linux 6.10; значение сохранено как вопрос для проверки, а не заменено на 6.1.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Приостановка системы

В SoC с bl31 приостановка системы выполняется в bl31. Реализация различается между платформами, поэтому их параметры и методы настройки сна не взаимозаменяемы. Руководство относится только к RK3576. Обычно отключаются домены питания, IP-блоки, тактовые сигналы и PLL, DDR переходит в саморегенерацию, системная шина переключается на медленный тактовый сигнал (24M или 32K), отключаются vdd_arm/vdd_log и настраиваются источники пробуждения. Для разных требований изделий настройки DTS передаются в bl31 во время загрузки.

### 1.1 Файлы драйверов

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3576.h
```

### 1.2 Узел DTS

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

## 2. Настройка DTS

Поддерживаемые параметры конфигурации определены в:

```text
./include/dt-bindings/suspend/rockchip-rk3576.h
```

### 2.1 Основная настройка

Свойство

```text
rockchip,sleep-mode-config = <...>;
```

Параметры конфигурации

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

Примечания: Настройки должны соответствовать источникам пробуждения изделия. Для USB нельзя отключать его питание и тактирование во сне, поэтому не выбирайте RKPM_SLP_ARMOFF_LOGOFF, RKPM_SLP_PMU_DIS_OSC и RKPM_SLP_PMU_PMUALIVE_32K. RKPM_SLP_PMU_DBG: автомат PMU непрерывно выводит специальный сигнал через GPIO0_B0 для отображения внутреннего состояния во сне. Функция предназначена только для испытаний и отладки сна/пробуждения.

RKPM_SLP_TIME_OUT_WKUP: система автоматически пробуждается примерно через 1s сна, причём пробуждать её может только внутренний таймер PMU. Только для испытаний и отладки сна/пробуждения.

### 2.2 Настройка пробуждения

Свойство

```text
rockchip,wakeup-config = <...>;
```

Параметры конфигурации

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

Примечания: RKPM_GPIO_WKUP_EN (предпочтительно):

Из GPIO0–4 в этом режиме поддерживаются только выводы GPIO0. Их прерывания поступают прямо в автомат PMU, минуя GIC. При проектировании по возможности размещайте источники пробуждения на GPIO0. RKPM_CPU0_WKUP_EN (второй выбор): поддерживает все пробуждающие прерывания, зарегистрированные в GIC через enable_irq_wake() в ядре; источников больше, чем у RKPM_GPIO_WKUP_EN. Но управление распределяется между модулями ядра, поэтому возможны нежелательные пробуждения. RKPM_TIMEOUT_WAKEUP_EN: внутренний таймер PMU, по умолчанию прерывание через 1s; обычно только для тестирования сна/пробуждения при разработке.

### 2.3 Настройка удержания I/O

Для удержания уровня I/O во сне при отключённом vdd_logic настройте это свойство. Свойство:

```text
rockchip,sleep-io-ret-config = <
    (0
    | RKPM_VCCIO0_RET_EN
    ...
    )
>;
```

Параметры конфигурации

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

Примечание: Для удержания уровня настройте соответствующий I/O-домен и не отключайте его питание, иначе удержать уровень невозможно.

### 2.4 Настройка sleep pin

Sleep pin отключает питание во время сна. Настройте его согласно фактической схеме. Свойство:

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

Параметры конфигурации

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

Примечание: По умолчанию RK3576 устанавливает высокий уровень sleep pin0.

### 2.5 Настройка виртуального выключения

Некоторые изделия не могут физически отключить питание при выключении. Для снижения потребления вместо выключения используется сон. Свойство:

```text
// 0：关闭假关机模式， 1：开启假关机模式。
rockchip,virtual-poweroff = <...>;

// 配置关机时的唤醒中断号，系统收到唤醒中断信号后重启开机
rockchip,virtual-poweroff-irqs = < xx xx xx ...>;
```

Примечание: Если rockchip,virtual-poweroff-irqs не настроено, источником пробуждения по умолчанию служит pwm0 channel0.

## 3. Сообщения журнала

Ниже объясняются сообщения bl31 при сне и пробуждении. Для удобства комментариев некоторые строки разделены. Разные режимы энергопотребления дают разные журналы; ориентируйтесь на фактический вывод. Свойство:

```text
// 0：休眠时不会打印log， 1：休眠时会打印log
rockchip,sleep-debug-en = <...>;
```

Журнал RK3576: сон

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

Журнал RK3576: пробуждение

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

## 4. Типовые конфигурации

### 4.1 Режим отключения logic

Режим позволяет отключать vdd_logic для снижения потребления во сне. Конфигурация:

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

### 4.2 Режим отключения PMU1

Кроме отключения logic, этот режим отключает pd pmu1 и позволяет выключить питание PMUIO1. Потребление ниже, чем при отключении только logic. Конфигурация:

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

### 4.3 Пробуждение от uart1

Если требуется пробуждение от UART, предпочтителен uart1. Он находится в pd_pmu1 и может пробуждать систему при отключённом logic, снижая потребление. Конфигурация:

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

Примечание: Пробуждение от uart1 требует работающего кварца 24M, поэтому его питание отключать нельзя.

### 4.4 Пробуждение от usb

Для USB-пробуждения желательно объединить питание USB 0.75V, 1.8V и 3.3V с питанием PMU. Это позволяет пробуждаться при отключённом logic и снижает потребление. Конфигурация:

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

Примечание: Пробуждение от usb требует работающего кварца 24M, поэтому его питание отключать нельзя.

### 4.5 Пробуждение от pwm

Для инфракрасного пробуждения используется PWM. Предпочтительно подключать ИК к pwm0 channel0: pwm0 находится в pd_pmu1 и позволяет пробуждение при отключённом logic с меньшим потреблением. Конфигурация:

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

Примечание: Пробуждение от pwm требует работающего кварца 24M, поэтому его питание отключать нельзя.

### 4.6 Пробуждение от mcu

Если PMU MCU должен выполнять задачи во сне, например фильтровать прерывания, используйте MCU-пробуждение. Конфигурация:

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

Примечание: Пробуждение от mcu требует работающего кварца 24M, поэтому его питание отключать нельзя. Питание vdd_logic также должно сохраняться.

### 4.7 Пробуждение от gpio

Для пробуждения от gpio0 достаточно режима отключения logic, поскольку gpio0 находится в pd_pmu. Для gpio1–4 питание vdd_logic отключать нельзя. Конфигурация:

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

Примечание: Пробуждение от gpio1–4 требует работающего кварца 24M, поэтому его питание отключать нельзя.

{% endraw %}
