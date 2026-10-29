---
title: "Rockchip RK3506: полное руководство по приостановке, DTS, пробуждению и журналам"
description: "Rockchip RK3506: полное руководство по приостановке, DTS, пробуждению и журналам — V1.1.0"
excerpt: "Rockchip RK3506: полное руководство по приостановке, DTS, пробуждению и журналам"
translation_key: 151-rockchip-rk3506-suspend
slug: 151-rockchip-rk3506-suspend
lang: ru
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
reference_products: ["CM1", "Forge1"]
products: []
tags: [ArmSoM, Rockchip, RK3506, suspend, DTS]
---

{% raw %}

# Rockchip RK3506: полное руководство по приостановке, DTS, пробуждению и журналам

Полный технический текст китайского оригинала V1.1.0: RK3506, Linux 6.1. Только платформенный справочник ArmSoM: сверяйте SoC конкретной платы, SDK/BSP, trust/ATF, ядро, PMIC, питание и выводы пробуждения. Поддержка всех плат ArmSoM не заявляется. Английского PDF и отдельных технических рисунков нет; четыре языка основаны на китайском оригинале. Код, настройки и журналы — примеры источника, не аппаратные испытания ArmSoM; команды сна и управления питанием не выполнялись.

> Ошибочные настройки отключения питания, тактирования или пробуждения могут препятствовать пробуждению или вызвать потерю данных. Примеры должен проверить инженер, знакомый с аппаратурой. Комментарии кода, написание, заполнители и неоднозначности источника сохранены; константы не выдумываются.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Приостановка системы

Последовательность Linux: общий процесс приостановки ядра завершает Suspend периферии и ОС, затем управление переходит в OPTEE RK3506 для приостановки SoC. Прошивка OPTEE — файл rk3506_tee_vx.yy.bin в rkbin. С учётом доработок функций и исправлений ошибок источник рекомендует версию не ниже:

```text
rk3506_tee_v2.10.bin      // sdk默认
rk3506_tee_ta_v1.10.bin   // 客户有ta需求时使用
```

OPTEE обычно отключает IP-блоки, тактирование и PLL, переводит DDR в саморегенерацию, переключает системную шину на низкочастотный тактовый сигнал (24M или 32K), отключает vdd_arm/vdd_logic и настраивает пробуждение. Настройки изделия передаются OPTEE через узлы DTS при загрузке. Параметры и методы разных платформ нельзя переносить друг на друга; документ относится только к RK3506. Понятия доменов VD_PMU и VD_Logic описаны в главе PMU документа TRM.

### 1.1 Файлы драйверов

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3506.h
```

### 1.2 Узел DTS

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

Rockchip SDK обычно содержит достаточно полную универсальную эталонную конфигурацию. Добавляйте и удаляйте параметры согласно требованиям изделия.

## 2. Настройка DTS

Поддерживаемые параметры конфигурации определены в:

```text
./include/dt-bindings/suspend/rockchip-rk3506.h
```

### 2.1 Основная настройка

Свойство конфигурации:

```text
rockchip,sleep-mode-config = <...>;
```

Определения конфигурации:

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

RK3506 поддерживает два режима: отключение ARM и отключение ARM+LOGIC.

### 2.2 Настройка питания

Свойство конфигурации:

```text
rockchip,apios-suspend = <...>;
```

Определения конфигурации:

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

Аппаратура RK3506 поддерживает один или два вывода pwrctrl для управления состоянием vdd_core, vdd_logic и других источников питания во сне. Настройте их по реальной схеме и требованиям приостановки. Пример из arch/arm/boot/dts/rk3502-evb1-v10.dtsi:

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

### 2.3 Настройка источников пробуждения

Свойство конфигурации:

```text
rockchip,wakeup-config = <...>;
```

Определения конфигурации:

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

Пробуждение: при отключении ARM+LOGIC поддерживаются только прерывания модулей домена VD_PMU, прежде всего GPIO0 и GPIO1_Shadow. Для пробуждения USB убедитесь, что репозиторий ядра содержит следующий патч:

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

### 2.4 Настройка GPIO

Свойство конфигурации:

```text
rockchip,sleep-io-config = <...>;
```

Это свойство оптимизирует потребление во сне. Требования изделий к нему строги, а неподходящие состояния GPIO (вход, выход, подтяжка вверх или вниз) увеличивают потребление. Если драйверу неудобно задавать состояние GPIO при приостановке, настройте его здесь. Значения применяются на последнем этапе засыпания; при пробуждении регистры возвращаются в состояние до сна. Учитывайте реальную схему.

Настройка содержит до 16 пар «адрес регистра значение». Разрешены только GPIO_SWPORT_DR и GPIO_SWPORT_DDR контроллера GPIO, а также все регистры контроллера IOC. Недопустимая пара вызывает сообщение "(invalid)" и игнорируется. При превышении 16 пар выводится "(overflow)", и настройка игнорируется.

### 2.5 Настройка отладки

Свойство конфигурации:

```text
rockchip,sleep-debug-en = <...>;
```

Не применять в изделии; только для диагностики. Определения конфигурации:

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

RKPM_DBG_REG1 выводит состояния регистров после завершения ядром всего процесса SUSPEND.

RKPM_DBG_REG2 выводит состояния регистров перед последним шагом засыпания OPTEE. При анализе потребления IO во сне ориентируйтесь на этот вариант.

### 2.6 Отключение питания LOGIC

Для большинства сценариев изделий выпускаемый SDK по умолчанию использует отключение ARM. Ниже приведены настройки отключения ARM+LOGIC для эталонных плат. Плата RK3506G-EVB1:

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

Плата RK3506G-DEMO (RK801):

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

## 3. Сообщения журнала

Ниже объясняются журналы засыпания и пробуждения. Для пояснений часть вывода разделена на строки; разные режимы дают разные сообщения. Ориентируйтесь на фактический вывод. Журнал засыпания RK3506:

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

Журнал пробуждения RK3506 (отключался только ARM):

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

Журнал пробуждения RK3506 (отключались ARM+LOGIC):

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
