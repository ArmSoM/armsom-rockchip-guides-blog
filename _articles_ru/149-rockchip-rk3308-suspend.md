---
title: "Rockchip RK3308: полное руководство по приостановке, DTS, пробуждению и журналам"
description: "Rockchip RK3308: полное руководство по приостановке, DTS, пробуждению и журналам — V1.1.1"
excerpt: "Rockchip RK3308: полное руководство по приостановке, DTS, пробуждению и журналам"
translation_key: 149-rockchip-rk3308-suspend
slug: 149-rockchip-rk3308-suspend
lang: ru
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
reference_products: ["P2pro"]
products: []
tags: [ArmSoM, Rockchip, RK3308, suspend, DTS]
---

{% raw %}

# Rockchip RK3308: полное руководство по приостановке, DTS, пробуждению и журналам

Общий технический базис — китайский V1.1.1, сверенный по главам с английским оригиналом (обложка V1.0.0, история до V1.1.0). Область: RK3308, Linux 4.4/4.19. Новая китайская редакция описывает изменения оформления; главы сверены, явное английское обозначение диапазонов отмечено отдельно. Отдельных технических рисунков нет. Только справочник ArmSoM: сверяйте SoC, плату, SDK/BSP, trust, ядро, питание и цепи пробуждения. Аппаратных испытаний и выполнения команд сна/питания не было.

> Ошибочные настройки отключения питания, тактирования или пробуждения могут препятствовать пробуждению или вызвать потерю данных. Примеры должен проверить инженер, знакомый с аппаратурой. Комментарии кода, написание, заполнители и неоднозначности источника сохранены; константы не выдумываются.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Приостановка системы

На SoC с trust приостановка системы выполняется в trust. Реализации различаются, поэтому нельзя использовать параметры и методы других платформ как руководство по настройке; документ относится только к RK3308. Обычно отключаются домены питания, IP-блоки, тактирование и PLL, DDR переходит в саморегенерацию, шина переключается на низкочастотный такт (24M или 32K), отключается vdd_arm и задаются источники пробуждения. Настройки изделия передаются trust через DTS при загрузке.

### 1.1 Файлы драйверов

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3308.h
```

### 1.2 Узел DTS

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

## 2. Настройка DTS

Поддерживаемые параметры конфигурации определены в:

```text
./include/dt-bindings/suspend/rockchip-rk3308.h
```

### 2.1 Основная настройка

Свойство конфигурации:

```text
rockchip,sleep-mode-config = <...>;
```

Определения конфигурации:

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

Режимы RK3308 делятся на две категории. Изделия VAD требуют пробуждения VAD: VAD/ACODEC/PDM и связанные IP-блоки и такты остаются включёнными, как и кварц 24M со связанными PLL. Trust проверяет, отключён ли режим VAD ядром; если нет, считает изделие VAD и выбирает экономичный режим с таким пробуждением. Изделия без VAD не требуют работающих IP-блоков; почти все модули и такты можно отключить для минимального потребления. Системный такт переключается на 32K или 24M.

### 2.2 Настройка питания

Свойство конфигурации:

```text
rockchip,pwm-regulator-config = <...>;
```

Определения конфигурации:

```text
// 使⽤pwm-regulator
#define RKPM_PWM_REGULATOR          BIT(2)
```

Питание: необходимость pwm-regulator определяется внешней аппаратной схемой.

### 2.3 Настройка пробуждения

Свойство конфигурации:

```text
rockchip,wakeup-config = <...>;
```

Определения конфигурации:

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

Источники пробуждения: предпочтителен RKPM_GPIO0_WAKEUP_EN. Из GPIO0–3 поддерживается только группа GPIO0. Прерывания этих выводов поступают прямо в автомат PMU, минуя GIC. По возможности размещайте необходимые сигналы пробуждения на GPIO0. Второй выбор — RKPM_ARM_GIC_WAKEUP_EN:

Поддерживаются все прерывания пробуждения, зарегистрированные в GIC через enable_irq_wake() ядром; источников больше, чем у RKPM_GPIO0_WAKEUP_EN. Однако управление распределяется между модулями ядра, и непредусмотренное прерывание может пробудить систему. RKPM_TIMEOUT_WAKEUP_EN использует внутренний таймер PMU с тайм-аутом 5s по умолчанию; обычно он нужен только для испытаний сна/пробуждения при разработке.

### 2.4 Настройка отладки

Свойство конфигурации:

```text
rockchip,sleep-mode-config = <...>;
```

Определения конфигурации:

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

Отладка: включите RKPM_DBG_CLK_UNGATE, если подозревается, что отключённые во сне такты мешают пробуждению системы или модуля. RKPM_DBG_REG полезен при подозрении на изменение регистров trust. RKPM_DBG_FSM_SOUT заставляет автомат PMU непрерывно выдавать определённый сигнал на GPIO4_D5 во сне, отражая внутреннее состояние. Это полезно только при зависании самого автомата PMU.

### 2.5 Настройка сброса при перезагрузке

Свойство конфигурации:

```text
rockchip,apios-suspend = <...>;
```

Определения конфигурации:

```text
#define GLB1RST_IGNORE_PWM0        BIT(23)
#define GLB1RST_IGNORE_PWM1        BIT(24)
#define GLB1RST_IGNORE_PWM2        BIT(25)
#define GLB1RST_IGNORE_GPIO0       BIT(26)
#define GLB1RST_IGNORE_GPIO1       BIT(27)
#define GLB1RST_IGNORE_GPIO2       BIT(28)
#define GLB1RST_IGNORE_GPIO3       BIT(29)
```

Сброс: RK3308 по умолчанию использует first global software reset, сбрасывая все IP-модули при перезагрузке. Указанные параметры позволяют сохранять выбранные IP. Диапазоны китайского оригинала отображены некорректно; английский явно указывает pwm0–3/gpio0–3, хотя список макросов содержит только PWM0–2 и GPIO0–3. Расхождение сохранено; проверьте реализацию. Пример GPIO: цепь может иметь вывод "power hold", который ПО устанавливает в высокий/низкий уровень в начале загрузки для удержания питания. При перезагрузке он не должен сбрасываться, иначе система выключится.

## 3. Сообщения журнала

Ниже объясняются сообщения trust при засыпании и пробуждении. Для пояснений часть вывода разделена на строки; режимы энергосбережения дают разный вывод. Ориентируйтесь на реальные журналы. Журнал засыпания RK3308:

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

Журнал пробуждения RK3308:

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
