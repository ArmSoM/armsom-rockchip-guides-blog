---
title: "Rockchip RK356X: полное руководство по приостановке, DTS, пробуждению и журналам"
description: "Rockchip RK356X: полное руководство по приостановке, DTS, пробуждению и журналам — V1.0.0"
excerpt: "Rockchip RK356X: полное руководство по приостановке, DTS, пробуждению и журналам"
translation_key: 152-rockchip-rk356x-suspend
slug: 152-rockchip-rk356x-suspend
lang: ru
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: power
products: []
tags: [ArmSoM, Rockchip, RK356X, suspend, DTS]
---

{% raw %}

# Rockchip RK356X: полное руководство по приостановке, DTS, пробуждению и журналам

Полный технический текст китайского оригинала V1.0.0: RK356X, Linux 4.19 / 5.10. Только платформенный справочник ArmSoM: сверяйте SoC конкретной платы, SDK/BSP, trust/ATF, ядро, PMIC, питание и выводы пробуждения. Поддержка всех плат ArmSoM не заявляется. Английского PDF и отдельных технических рисунков нет; четыре языка основаны на китайском оригинале. Код, настройки и журналы — примеры источника, не аппаратные испытания ArmSoM; команды сна и управления питанием не выполнялись.

> Ошибочные настройки отключения питания, тактирования или пробуждения могут препятствовать пробуждению или вызвать потерю данных. Примеры должен проверить инженер, знакомый с аппаратурой. Комментарии кода, написание, заполнители и неоднозначности источника сохранены; константы не выдумываются.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Приостановка системы

На платформах SoC с trust приостановка системы реализована в trust. Реализация различается между платформами, поэтому их параметры и методы нельзя переносить друг на друга; это руководство относится только к RK356X. Типичные операции: отключение доменов питания, блоков IP, тактирования и PLL, перевод DDR в саморегенерацию, переключение системной шины на низкочастотный источник (24M или 32K), отключение vdd_arm/vdd_log и настройка источников пробуждения. Для удовлетворения требований конкретного изделия параметры передаются trust через узлы DTS при загрузке.

### 1.1 Файлы драйверов

```text
./drivers/soc/rockchip/rockchip_pm_config.c
./drivers/firmware/rockchip_sip.c
./include/dt-bindings/suspend/rockchip-rk3568.h
```

### 1.2 Узел DTS

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

## 2. Настройка DTS

Поддерживаемые параметры конфигурации определены в:

```text
./include/dt-bindings/suspend/rockchip-rk3568.h
```

### 2.1 Основная настройка

Свойство конфигурации:

```text
rockchip,sleep-mode-config = <...>;
```

Определения конфигурации:

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

### 2.2 Настройка источников пробуждения

Свойство конфигурации:

```text
rockchip,wakeup-config = <...>;
```

Определения конфигурации:

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

Пробуждение: RKPM_GPIO_WKUP_EN поддерживает только группу выводов GPIO0 в качестве источника пробуждения. При проектировании аппаратуры источник рекомендует подключать необходимые сигналы пробуждения к GPIO0.

### 2.3 Настройка отладки

Свойство конфигурации:

```text
rockchip,sleep-debug-en = <...>;
```

Отладка: значение 1 включает вывод сообщений. При засыпании и пробуждении выводятся журналы соответствующих операций ATF.

## 3. Сообщения журнала

Ниже объясняются сообщения trust при засыпании и пробуждении системы. Для удобства пояснений часть вывода разбита на строки. Разные режимы энергосбережения также дают разные сообщения; ориентируйтесь на фактический вывод.

RK356X: журнал засыпания системы:

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

RK356X: журнал пробуждения системы:

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
