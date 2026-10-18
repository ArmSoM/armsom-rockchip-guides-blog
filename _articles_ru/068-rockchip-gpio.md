---
title: "Руководство Rockchip GPIO: ядро, U-Boot, отладка, приостановка и прерывания"
description: "Полный материал по GPIO: домены питания, DTS, код драйверов, U-Boot, sysfs, пробуждение, отладка и частые вопросы."
translation_key: "068-rockchip-gpio"
slug: "068-rockchip-gpio"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "GPIO", "U-Boot", "RK3588", "RK3399"]
keywords: "ArmSoM Rockchip GPIO IOMUX U-Boot"
excerpt: "Полный материал по GPIO: домены питания, DTS, код драйверов, U-Boot, sysfs, пробуждение, отладка и частые вопросы."
---

{% raw %}

# Руководство Rockchip GPIO: ядро, U-Boot, отладка, приостановка и прерывания

Статья полностью следует китайскому исходнику V1.0.1 объёмом 42 страницы. Английская и русская версии полностью переводят технический текст. Соответствующий английский PDF не предоставлен: все три версии используют 17 рисунков китайского PDF. Английские подписи, уже присутствующие на рисунках, сохранены; это не рисунки из английского исходника. Код, команды, комментарии и журналы сохраняют язык источника; подписи рисунков локализованы.

В таблице применимости указаны все платформы Rockchip, но отдельные примеры относятся к RK3399, RK3588 Android12, RV1103/RV1106, RV1108 и другим платформам. Это справочник по платформе для ArmSoM. Проверьте плату, SoC, ветку SDK/BSP, версию ядра/U-Boot, функции выводов и питание. Поддержка всеми платами и версиями не подразумевается. Единой версии ядра исходник не задаёт; отдельные примеры упоминают kernel-5.10 и настройки Android. Аппаратная проверка ArmSoM не проводилась; журналы и примеры взяты из исходника.

**Аппаратный риск:** несоответствие напряжения IO может повредить выводы. Прямая запись регистров, выход GPIO, управление тактированием и приостановкой способны влиять на периферию, систему и питание. Команды, патчи и аппаратные операции не выполнялись. Авторы, лицензии и технические сведения о коммитах внутри кода и патчей сохранены.

| SoC по исходнику |
|---|
| Все платформы Rockchip |

Неоднозначности исходника, исправления извлечения и проверка разделов:
[EDITORIAL-NOTES](/docs/rockchip-gpio/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, block 0 -->

## 1. IO-Domain

<!-- Source CN PDF p.4, block 1 -->

Типичные уровни выхода IO — 1.8v, 3.0v и 3.3v. Выходное напряжение зависит от напряжения домена питания данного IO и определяется аппаратным питанием.

<!-- Source CN PDF p.4, block 2 -->

io-domain — программная настройка регистров домена питания IO. Если она не соответствует реальному питанию, выводы этого домена могут перестать управляться и выдавать неправильные сигналы. Если IO работает неверно, мультиплексирование настроено правильно и другие потребители его не используют, но измеренный сигнал остаётся неправильным или программно не удаётся установить высокий/низкий уровень, проверьте регистры соответствующего домена питания. Подробное руководство io-domain находится в документации SDK.

<!-- Source CN PDF p.4, block 3 -->

Путь документации Android SDK: `RKDocs\common\IO-Domain`

<!-- Source CN PDF p.4, block 4 -->

Путь документации Linux SDK: `docs\cn\Common\IO-DOMAIN`

<!-- Source CN PDF p.4, block 5 -->

Примечание: некоторые SDK не содержат руководства io-domain. Используйте инструкции ниже либо запросите документ у соответствующего FAE.

<!-- Source CN PDF p.4, block 6 -->

Особое внимание следует обратить на новые микросхемы RK, например RK3588, RK3562, RV1106 и RV1103: согласно исходнику, программная настройка io_domains им не требуется, поскольку микросхема автоматически адаптируется к домену напряжения. Для проверки соберите стандартную прошивку EVB и просмотрите скрытый файл `.xxx.dtb.dts.tmp`, сохранённый при сборке ядра. Если в нём нет настройки io-domain, программно настраивать домен напряжения не требуется.

<!-- Source CN PDF p.4, block 7 -->

### 1.1 Настройка ядра

<!-- Source CN PDF p.4, block 8 -->

На примере RK3399 откройте раздел GRM/PMUGRF его TRM и найдите регистры io-domain по ключевым словам VSEL, volsel и vsel.

<!-- Source CN PDF p.5, block 9 -->

![Технический рисунок китайского исходника, p.5](/docs/rockchip-gpio/assets/cn-p05-figure1.png)

*Технический рисунок китайского исходника, PDF p.5.*

`GRF_IO_VSEL` — Адрес: рабочая база + смещение (`0x0e640`).

| Биты | Атрибут | Сброс | Описание |
| --- | --- | --- | --- |
| 31:16 | RW | 0x0000 | write_enable: разрешение записи bit0~15. При bit16=1 ПО может записывать bit0, при bit16=0 — не может; при bit17=1 ПО может записывать bit1, при bit17=0 — не может; …… при bit31=1 ПО может записывать bit15, при bit31=0 — не может. |
| 15:4 | RO | 0x0 | Зарезервировано |
| 3 | RW | 0x0 | gpio1830_gpio4cd_ms: 1’b0: домен IO работает при 3.0V; 1’b1: при 1.8V. |
| 2 | RW | 0x0 | sdmmc_gpio4b_ms: 1’b0: домен IO работает при 3.0V; 1’b1: при 1.8V. |
| 1 | RW | 0x0 | audio_gpio3d4a_ms: 1’b0: домен IO работает при 3.0V; 1’b1: при 1.8V. |
| 0 | RW | 0x0 | bt656_gpio2ab_ms: 1’b0: домен IO работает при 3.0V; 1’b1: при 1.8V. |

<!-- Source CN PDF p.5, block 10 -->

![Технический рисунок китайского исходника, p.5](/docs/rockchip-gpio/assets/cn-p05-figure2.png)

*Технический рисунок китайского исходника, PDF p.5.*

| Биты | Атрибут | Сброс | Описание |
| --- | --- | --- | --- |
| 9 | RW | 0x1 | pmu1830_vol: выбор PMU IO 1.8V/3.0V. 0: домен IO работает при 3.0V; 1: при 1.8V. |

<!-- Source CN PDF p.5, block 11 -->

Найдя регистры по ключевым словам, проверьте на схеме питание соответствующих выводов. Например, предположим, что весь ряд выводов gpio2 управляется неправильно:

<!-- Source CN PDF p.6, block 12 -->

![Технический рисунок китайского исходника, p.6](/docs/rockchip-gpio/assets/cn-p06-figure1.png)

*Технический рисунок китайского исходника, PDF p.6.*

<!-- Source CN PDF p.6, block 13 -->

Этот ряд выводов питается от APIO2. В каталоге ядра SDK откройте `kernel/Documentation/devicetree/bindings/power/rockchip-io-domain.txt`. Там подробно описано программное определение питания APIO2:

<!-- Source CN PDF p.6, block 14 -->

```text
Possible supplies for rk3399:
- bt656-supply: The supply connected to APIO2_VDD.
- audio-supply: The supply connected to APIO5_VDD.
- sdmmc-supply: The supply connected to SDMMC0_VDD.
- gpio1830 The supply connected to APIO4_VDD.
Possible supplies for rk3399 pmu-domains:
- pmu1830-supply:The supply connected to PMUIO2_VDD.
```

<!-- Source CN PDF p.6, block 15 -->

Найдите io_domain в каталоге dts:

<!-- Source CN PDF p.6, block 16 -->

```text
&io_domains {
    status = "okay";
    bt656-supply = <&vcc1v8_dvp >;
    audio-supply = <&vcca1v8_codec>;
    sdmmc-supply = <&vcc_sdio>;
    gpio1830-supply = <&vcc_3v0>;
};
```

<!-- Source CN PDF p.6, block 17 -->

Убедитесь, что программная настройка соответствующего питания совпадает с аппаратной:

<!-- Source CN PDF p.6, block 18 -->

```text
bt656-supply = <&vcc1v8_dvp>;
```

<!-- Source CN PDF p.6, block 19 -->

Просмотрите информацию отладочного узла:

<!-- Source CN PDF p.6, block 20 -->

```text
console:/ # cat sys/kernel/debug/regulator/regulator_summary
```

<!-- Source CN PDF p.7, block 21 -->

Указанные здесь 1.8V правильны только при совпадении со схемой. Если значения различаются, приведите настройку в соответствие.

<!-- Source CN PDF p.7, block 22 -->

### 1.2 Настройка U-Boot

<!-- Source CN PDF p.7, block 23 -->

См. раздел 9.13 документа `RKDocs/rk3399/Rockchip_RK3399_Developer_Guide_Android7.1_Software_CN&EN.pdf`: добавление настройки io-domain в ветку rkdevelop U-Boot. Эта возможность решает следующие проблемы:

<!-- Source CN PDF p.7, block 24 -->

Она устраняет неправильные уровни IO или невозможность настройки iomux из-за неверного io-domain в U-Boot. Без настройки io-domain в U-Boot микросхема использует значения по умолчанию до загрузки ядром правильной конфигурации DTS; это занимает около 3~4s. Если домен подключён к 3.0V, а по умолчанию настроен на 1.8V, несоответствие напряжений может повредить IO RK3399.

<!-- Source CN PDF p.7, block 25 -->

Настройте io-domain ядра и убедитесь, что в U-Boot и ядре есть следующие два коммита (`u-boot/drivers/power/rockchip-io-domain.c`):

<!-- Source CN PDF p.7, block 26 -->

```text
u-boot：
commit 5a4e354a116b45b8ac2311aaa3464a7e88cd13d5
Author: Jianqun Xu <jay.xu@rock-chips.com>
Date: Thu Mar 19 15:38:19 2020 +0800
power: support rockchip io-domain set
This patch should work with kernel dtb node property - "uboot-set" in io-domain node or pmu-io-domain node.
Change-Id: I86fa43d234091310ee08978ec42f5895fb010a8c
Signed-off-by: Jianqun Xu <jay.xu@rock-chips.com>
Signed-off-by: Wenping Zhang <wenping.zhang@rock-chips.com>
kernel：
commit f95ad65aabffa7450ff90a0dd4778cd5500de937
Author: Jianqun Xu <jay.xu@rock-chips.com>
Date: Fri Mar 20 09:52:57 2020 +0800
arm64: dts: rockchip: add 'uboot-set' in io-domain node for rk3399.
Add 'uboot-set' for io-domain node, which used by u-boot board init to set io domain.
Change-Id: Ia897e240c04d0b362551952278dadc8b4f2a8f2f
Signed-off-by: Jianqun Xu <jay.xu@rock-chips.com>
Signed-off-by: Wenping Zhang <wenping.zhang@rock-chips.com>
```

<!-- Source CN PDF p.7, block 27 -->

## 2. Разработка GPIO в ядре

<!-- Source CN PDF p.7, block 28 -->

В этом разделе описаны настройки и методы разработки GPIO в ядре.

<!-- Source CN PDF p.7, block 29 -->

### 2.1 Мультиплексирование GPIO

<!-- Source CN PDF p.7, block 30 -->

Настройка DTS

<!-- Source CN PDF p.8, block 31 -->

Следующая конфигурация использует RK3588 Android12 в качестве примера. Для работы с gpio3b7 задайте в DTS `enable-gpios = <&gpio3 RK_PB7 GPIO_ACTIVE_HIGH>`. Чтобы вывод до запуска ядра не оказался переключён на другую функцию и недоступен как GPIO, выберите функцию GPIO через pinctrl-names и pinctrl-0. Для запроса прерывания IO пример gpio3b6 показывает настройку входа с триггером Шмитта.

<!-- Source CN PDF p.8, block 32 -->

```text
/{
    gpio_demo: gpio-demo {
        status = "okay";
        compatible = "rockchip,gpio-demo";
        enable-gpios = <&gpio3 RK_PB7 GPIO_ACTIVE_HIGH>;
        irq-gpios = <&gpio3 RK_PB6 GPIO_ACTIVE_HIGH>;
        pinctrl-names = "default";
        pinctrl-0 = <&gpio_pin &gpio_irq>;
    };
};
&pinctrl {
    gpio-pin {
        gpio_pin: gpio-pin {
            // Configure gpio3b7 iomux to GPIO
            rockchip,pins = <3 RK_PB7 RK_FUNC_GPIO &pcfg_pull_none>;
        };
    };
    gpio-irq {
        gpio_irq: gpio-irq {
            // Configure gpio3b6 iomux to GPIO and schmidt input mode
            rockchip,pins = <3 RK_PB6 RK_FUNC_GPIO &pcfg_pull_none_smt>;
        };
    };
};
```

<!-- Source CN PDF p.8, block 33 -->

Узлы, на которые ссылается pinctrl-0, должны соблюдать следующие правила:

<!-- Source CN PDF p.8, block 34 -->

Они должны находиться внутри pinctrl, иметь структуру function+group и соблюдать остальные основные правила DTS. Формат function+group:

<!-- Source CN PDF p.8, block 35 -->

```text
function {
    group {
        rockchip,pin = <gpiobank gpionum iomuxfunc &config>;
    };
};
```

<!-- Source CN PDF p.8, block 36 -->

iomuxfunc определяет выбранную функцию; RK_FUNC_GPIO задаёт GPIO. config настраивает подтяжку вверх/вниз, входной триггер Шмитта и силу выходного драйвера. См. файл SDK rockchip-pinconf.dtsi: RK перечисляет доступные конфигурации в узле pinctrl DTS, например:

<!-- Source CN PDF p.8, block 37 -->

```text
&pinctrl {
    pcfg_pull_up: pcfg-pull-up {
        bias-pull-up;
    };
    pcfg_pull_down: pcfg-pull-down {
        bias-pull-down;
    };
    pcfg_pull_none: pcfg-pull-none {
        bias-disable;
    };
    pcfg_pull_none_smt: pcfg-pull-none-smt {
        bias-disable;
        input-schmitt-enable;
    };
    pcfg_pull_none_drv_level_0: pcfg-pull-none-drv-level-0 {
        bias-disable;
        drive-strength = <0>;
    };
    ......
    pcfg_output_high: pcfg-output-high {
        output-high;
    };
    ......
    pcfg_output_low: pcfg-output-low {
        output-low;
    };
    ......
};
```

<!-- Source CN PDF p.9, block 39 -->

Здесь `drive-strength = <2>` выбирает уровень силы драйвера 2; в соответствующий регистр записывается 2. На рисунке показаны уровни gpio2a0 из TRM RK3588: уровень 2 соответствует 50ohm.

<!-- Source CN PDF p.10, block 40 -->

![Технический рисунок китайского исходника, p.10](/docs/rockchip-gpio/assets/cn-p10-figure1.png)

*Технический рисунок китайского исходника, PDF p.10.*

RK3588 TRM

| Биты | Атрибут | Сброс | Описание |
| --- | --- | --- | --- |
| 2:0 | RW | 0x6 | gpio2a0_ds: управление GPIO2A0 DS, выбор силы драйвера. 3'b000: 100ohm; 3'b001: 66ohm; 3'b010: 50ohm; 3'b011: 40ohm; 3'b100: 33ohm; 3'b101: 25ohm. |

<!-- Source CN PDF p.10, block 41 -->

Код пользовательского драйвера

<!-- Source CN PDF p.10, block 42 -->

На примере RK3588 Android12: после настройки DTS пользовательский драйвер получает эту конфигурацию и управляет GPIO. Для запроса GPIO и работы с ним используются следующие функции.

<!-- Source CN PDF p.10, block 43 -->

```text
// Get the GPIO device. If multiple devices are used, the index parameter must be included
struct gpio_desc *gpiod_get(struct device *dev, const char *con_id,
                    enum gpiod_flags flags)
struct gpio_desc *gpiod_get_index(struct device *dev,
                      const char *con_id, unsigned int idx,
                      enum gpiod_flags flags)
// Release the GPIO device
void gpiod_put(struct gpio_desc *desc)
void gpiod_put_array(struct gpio_descs *descs)
// Set gpio input/output
int gpiod_direction_input(struct gpio_desc *desc)
int gpiod_direction_output(struct gpio_desc *desc, int value)
// Get/Set gpio value
int gpiod_get_value(const struct gpio_desc *desc);
void gpiod_set_value(struct gpio_desc *desc, int value);
//Get the GPIO IRQ interrupt number
int gpiod_to_irq(const struct gpio_desc *desc)
......
```

<!-- Source CN PDF p.10, block 44 -->

Пример работы с GPIO в пользовательском драйвере:

<!-- Source CN PDF p.10, block 45 -->

```text
// SPDX-License-Identifier: GPL-2.0
/*
 * Copyright (c) 2020 Rockchip Electronics Co. Ltd.
 *
 * Author:Johnny Shi <nengqiang.shi@rock-chips.com>
 */
/* The following code is based on the RK3588 Android 12 platform */
#include <linux/gpio/consumer.h>
#include <linux/interrupt.h>
#include <linux/kernel.h>
#include <linux/math64.h>
#include <linux/module.h>
#include <linux/of_graph.h>
#include <linux/phy/phy.h>
#include <linux/platform_device.h>
static irqreturn_t irq_demo_handler(int irq, void *dev_id)
{
    printk("------irq_demo------\n");
    return IRQ_HANDLED;
}
static int gpio_demo_probe(struct platform_device *pdev)
{
    struct gpio_desc *enable_gpio, *irq_gpio;
    int irq;
    int ret;
    printk("------gpio_demo_probe------\n");
    // Get the gpio3b7 pin and set it as output
    enable_gpio = devm_gpiod_get_index(&pdev->dev, "enable", 0, GPIOD_OUT_HIGH);
    if (IS_ERR(enable_gpio)) {
        ret = PTR_ERR(enable_gpio);
         dev_err(&pdev->dev, "failed to request enable GPIO: %d\n", ret);
        return ret;
    }
    // Get the gpio3b6 pin and set it as input
    irq_gpio = devm_gpiod_get_index(&pdev->dev, "irq", 0, GPIOD_IN);
    if (IS_ERR(irq_gpio)) {
        ret = PTR_ERR(irq_gpio);
         dev_err(&pdev->dev, "failed to request irq GPIO: %d\n", ret);
        return ret;
    }
    // Get the gpio3b6 IRQ interrupt number and request IRQ
    irq = gpiod_to_irq(irq_gpio);
    ret = request_irq(irq, irq_demo_handler, IRQF_TRIGGER_FALLING, "demo_irq", NULL);
    if (ret) {
         dev_err(&pdev->dev, "failed to request IRQ: %d\n", ret);
        return ret;
    }
    // Set gpio3b7 pin output high
    gpiod_set_value(enable_gpio, 1);
    return 0;
}
static const struct of_device_id gpio_demo_of_match[] = {
    { .compatible = "rockchip,gpio-demo" },
    {}
};
static struct platform_driver gpio_demo_driver = {
    .driver = {
        .name = "gpio-demo",
        .of_match_table = of_match_ptr(gpio_demo_of_match),
    },
    .probe = gpio_demo_probe,
// .remove = gpio_demo_remove,
};
module_platform_driver(gpio_demo_driver);
MODULE_DESCRIPTION("Rockchip gpio demo driver");
MODULE_LICENSE("GPL v2");
```

<!-- Source CN PDF p.12, block 49 -->

Согласно DTS драйвер получает gpio3b7 через `devm_gpiod_get_index(&pdev->dev, "enable", 0, GPIOD_OUT_HIGH)`. Свойство GPIO_ACTIVE_HIGH задаёт активный высокий уровень, а GPIOD_OUT_HIGH инициализирует gpio3b7 как выход. `gpiod_set_value(enable_gpio, 1)` устанавливает высокий уровень. Для запроса IRQ сначала получите gpio3b6 через `devm_gpiod_get_index(&pdev->dev, "irq", 0, GPIOD_IN)` и инициализируйте его как вход. Затем используйте `gpiod_to_irq(irq_gpio)` и `request_irq(irq, irq_demo_handler, IRQF_TRIGGER_FALLING, "demo_irq", NULL)`.

<!-- Source CN PDF p.12, block 50 -->

### 2.2 Ввод и вывод GPIO

<!-- Source CN PDF p.12, block 51 -->

В DTS задайте pinctrl-names равным default и настройте свойство GPIO в pinctrl-0 как pcfg_output_high либо pcfg_output_low для непосредственного вывода высокого или низкого уровня. При загрузке драйвер автоматически применяет свойства GPIO из pinctrl-0.

<!-- Source CN PDF p.12, block 52 -->

Например:

<!-- Source CN PDF p.12, block 53 -->

```text
imx415: imx415@1a {
    compatible = "sony,imx415";
    reg = <0x1a>;
    clocks = <&cru CLK_MIPI_CAMARAOUT_M1>;
    clock-names = "xvclk";
    pinctrl-names = "default";
- pinctrl-0 = <&mipim0_camera1_clk>;
+ pinctrl-0 = <&mipim0_camera1_clk &test_gpio>; //添加一个test_gpio
    power-domains = <&power RK3588_PD_VI>;
    ......
}
&pinctrl {
    test {
        test_gpio: test-gpio {
            //GPIO3_B1配置为高电平输出，也可以配置为pcfg_output_low，低电平输出。
            rockchip,pins = <3 RK_PB1 RK_FUNC_GPIO &pcfg_output_high>;
        };
    };
}
```

<!-- Source CN PDF p.13, block 55 -->

Для входа GPIO обычно достаточно pcfg_pull_none либо pcfg_pull_none_smt.

<!-- Source CN PDF p.13, block 56 -->

### 2.3 Динамическое переключение функций IO

<!-- Source CN PDF p.13, block 57 -->

Функцию вывода IO можно менять динамически: например, на одном этапе работы ядра использовать его как UART, а на другом — как обычный GPIO. Ниже приведена конфигурация для RK3588 Android12.

<!-- Source CN PDF p.13, block 58 -->

Настройка DTS

<!-- Source CN PDF p.13, block 59 -->

Помимо четырёх состояний ядра в pinctrl-names можно задавать собственные состояния. Состояние default выбирает выводы uart3 и автоматически привязывается и применяется ядром после сопоставления пользовательского драйвера; драйверу не требуется повторять настройку. Собственное состояние показано в pinctrl-names="iomux-exchange". Драйвер может разобрать его и динамически выбирать функции выводов по необходимости.

<!-- Source CN PDF p.13, block 60 -->

```text
/{
    iomux_exchange: iomux-exchange {
        compatible= "iomux-exchange-demo";
        pinctrl-names= "default", "iomux-exchange";
        pinctrl-0= <&uart3m0_xfer>;
        pinctrl-1= <&uart3m0_gpio>;
    };
    &pinctrl {
        uart3 {
            /omit-if-no-ref/
            uart3m0_xfer: uart3m0-xfer {
                rockchip,pins =
                    /* uart3_rx_m0 */
                    <1 RK_PC0 10 &pcfg_pull_up>,
                    /* uart3_tx_m0 */
                    <1 RK_PC1 10 &pcfg_pull_up>;
            };
        uart3-gpio{
            uart3m0_gpio: uart3m0-gpio {
                rockchip,pins =
                    <1 RK_PC0 RK_FUNC_GPIO &pcfg_pull_none>,
                    <1 RK_PC1 RK_FUNC_GPIO &pcfg_pull_none>;
            };
        };
    };
};
```

<!-- Source CN PDF p.13, block 61 -->

Код пользовательского драйвера

<!-- Source CN PDF p.14, block 62 -->

Драйвер получает ресурсы pinctrl через devm_pinctrl_get, собственную конфигурацию GPIO через pinctrl_lookup_state и применяет состояние выводов через pinctrl_select_state. Пример кода:

<!-- Source CN PDF p.14, block 63 -->

```text
// SPDX-License-Identifier: GPL-2.0
/*
 * Copyright (c) 2020 Rockchip Electronics Co. Ltd.
 *
 * Author:Johnny Shi <nengqiang.shi@rock-chips.com>
 */
/* The following code is based on the RK3588 Android 12 platform */
#include <linux/gpio/consumer.h>
#include <linux/interrupt.h>
#include <linux/kernel.h>
#include <linux/math64.h>
#include <linux/module.h>
#include <linux/of_graph.h>
#include <linux/phy/phy.h>
#include <linux/platform_device.h>
#include <linux/pinctrl/consumer.h>
struct pinctrl *uart_pinctrl;
struct pinctrl_state *uart_default;//uart
struct pinctrl_state *uart_gpio;//gpio
static int iomux_exchange(int select) {
    int ret = 0;
    if (select) {
        ret = pinctrl_select_state(uart_pinctrl, uart_gpio);
    } else {
        ret = pinctrl_select_state(uart_pinctrl, uart_default);
    }
    return ret;
}
static int iomux_exchange_demo_probe(struct platform_device *pdev)
{
    printk("------iomux_exchange_demo_probe------\n");
    uart_pinctrl = devm_pinctrl_get(&pdev->dev);
    if (IS_ERR_OR_NULL(uart_pinctrl)) {
        printk("Failed to get pin ctrl\n");
        return PTR_ERR(uart_pinctrl);
    }
    // Gets the pinctrl status property of "default"
    uart_default = pinctrl_lookup_state(uart_pinctrl, "default");
    if (IS_ERR_OR_NULL(uart_default)) {
        printk("Failed to lookup pinctrl default state\n");
        return PTR_ERR(uart_default);
    }
    // Get the custom "iomux-exchange" pinctrl status properties
    uart_gpio = pinctrl_lookup_state(uart_pinctrl, "iomux-exchange");
    if (IS_ERR_OR_NULL(uart_gpio)) {
        printk("Failed to lookup pinctrl iomux-exchange state\n");
        return PTR_ERR(uart_gpio);
    }
    iomux_exchange(1);
    //iomux_exchange(0);
    return 0;
}
static const struct of_device_id iomux_exchange_demo_of_match[] = {
    { .compatible = "iomux-exchange-demo" },
    {}
};
static struct platform_driver iomux_exchange_demo_driver = {
    .driver = {
        .name = "iomux-exchange-demo",
        .of_match_table = of_match_ptr(iomux_exchange_demo_of_match),
    },
    .probe = iomux_exchange_demo_probe,
// .remove = iomux_exchange_demo_remove,
};
module_platform_driver(iomux_exchange_demo_driver);
MODULE_DESCRIPTION("Rockchip iomux exchange demo driver");
MODULE_LICENSE("GPL v2");
```

<!-- Source CN PDF p.15, block 65 -->

Если приведённый код не вызывает iomux_exchange(1), выводы по умолчанию работают как UART. После загрузки введите следующую команду для проверки мультиплексирования:

<!-- Source CN PDF p.15, block 66 -->

```text
console:/ # cat sys/kernel/debug/pinctrl/pinctrl-rockchip-pinctrl/pinmux-pins
......
pin 44 (gpio1-12): (MUX UNCLAIMED) (GPIO UNCLAIMED)
pin 45 (gpio1-13): fde60000.dp gpio1:45 function dp group dp1-hpd
pin 46 (gpio1-14): 5-001a (GPIO UNCLAIMED) function mipi group mipim0-camera1-clk
pin 47 (gpio1-15): (MUX UNCLAIMED) (GPIO UNCLAIMED)
pin 48 (gpio1-16): iomux-exchange (GPIO UNCLAIMED) function uart3 group uart3m0-xfer
pin 49 (gpio1-17): iomux-exchange (GPIO UNCLAIMED) function uart3 group uart3m0-xfer
pin 50 (gpio1-18): 7-0011 (GPIO UNCLAIMED) function i2s0 group i2s0-mclk
pin 51 (gpio1-19): fe470000.i2s (GPIO UNCLAIMED) function i2s0 group i2s0-idle
pin 52 (gpio1-20): (MUX UNCLAIMED) gpio1:52
pin 53 (gpio1-21): fe470000.i2s (GPIO UNCLAIMED) function i2s0 group i2s0-idle
......
```

<!-- Source CN PDF p.15, block 67 -->

gpio1-16 и gpio1-17 настроены как UART. После вызова iomux_exchange(1) проверьте их снова:

<!-- Source CN PDF p.16, block 68 -->

```text
console:/ # cat sys/kernel/debug/pinctrl/pinctrl-rockchip-pinctrl/pinmux-pins
......
pin 44 (gpio1-12): (MUX UNCLAIMED) (GPIO UNCLAIMED)
pin 45 (gpio1-13): fde60000.dp gpio1:45 function dp group dp1-hpd
pin 46 (gpio1-14): 5-001a (GPIO UNCLAIMED) function mipi group mipim0-camera1-clk
pin 47 (gpio1-15): (MUX UNCLAIMED) (GPIO UNCLAIMED)
pin 48 (gpio1-16): iomux-exchange (GPIO UNCLAIMED) function uart3-gpio group uart3m0-gpio
pin 49 (gpio1-17): iomux-exchange (GPIO UNCLAIMED) function uart3-gpio group uart3m0-gpio
pin 50 (gpio1-18): 7-0011 (GPIO UNCLAIMED) function i2s0 group i2s0-mclk
pin 51 (gpio1-19): fe470000.i2s (GPIO UNCLAIMED) function i2s0 group i2s0-idle
pin 52 (gpio1-20): (MUX UNCLAIMED) gpio1:52
pin 53 (gpio1-21): fe470000.i2s (GPIO UNCLAIMED) function i2s0 group i2s0-idle
......
```

<!-- Source CN PDF p.16, block 69 -->

gpio1-16 и gpio1-17 успешно переключены на функцию GPIO.

<!-- Source CN PDF p.16, block 70 -->

## 3. Разработка GPIO в U-Boot

<!-- Source CN PDF p.16, block 71 -->

В U-Boot можно управлять GPIO прямым чтением и записью регистров через readl и writel, но такой код непереносим. Здесь описан способ работы через драйвер U-Boot. Ниже показаны конфигурация DTS U-Boot и код драйвера на примере RK3588 Android12.

<!-- Source CN PDF p.16, block 72 -->

### 3.1 Разработка драйвера LED в U-Boot

<!-- Source CN PDF p.16, block 73 -->

Настройка DTS

<!-- Source CN PDF p.16, block 74 -->

U-Boot имеет собственные файлы DTS. При сборке соответствующий DTB создаётся автоматически и добавляется в конец u-boot.bin. Настройка GPIO в DTS аналогична ядру, но в узел необходимо добавить u-boot,dm-spl либо u-boot,dm-pre-reloc.

<!-- Source CN PDF p.16, block 75 -->

```text
/{
    leds {
        compatible = "gpio-leds";
        status = "okay";
        u-boot,dm-spl;
        blue-led {
            u-boot,dm-spl;
            gpios = <&gpio2 RK_PA1 GPIO_ACTIVE_LOW>;
            label = "blue_full";
            default-state = "on";
        };
        green-led {
            u-boot,dm-spl;
            gpios = <&gpio2 RK_PA0 GPIO_ACTIVE_LOW>;
            label = "green_led";
            default-state = "on";
        };
    };
};
```

<!-- Source CN PDF p.17, block 77 -->

Примечание: конфигурация gpio-leds в DTS обычно находится в ядре. Параметр label обязателен, иначе led_gpio.c выдаёт ошибку bind. Следующий патч выводит значение label:

<!-- Source CN PDF p.17, block 78 -->

```text
diff --git a/drivers/led/led_gpio.c b/drivers/led/led_gpio.c
index 56702a1417..18062f2ac1 100644
--- a/drivers/led/led_gpio.c
+++ b/drivers/led/led_gpio.c
@@ -112,6 +112,7 @@ static int led_gpio_bind(struct udevice *parent)
                const char *label;
                label = ofnode_read_string(node, "label");
+ printf("%s: label %s\n", __func__, label);
                if (!label) {
                        debug("%s: node %s has no label\n", __func__,
                              ofnode_get_name(node));
```

<!-- Source CN PDF p.17, block 79 -->

После сборки U-Boot проверьте содержимое DTB командой fdtdump:

<!-- Source CN PDF p.17, block 80 -->

```text
fdtdump ./u-boot.dtb | less
```

<!-- Source CN PDF p.17, block 81 -->

Код пользовательского драйвера

<!-- Source CN PDF p.17, block 82 -->

Ниже рассматривается драйвер LED в U-Boot. Сначала включите следующие параметры:

<!-- Source CN PDF p.17, block 83 -->

```text
/u-boot/configs/rk3588_defconfig
CONFIG_LED=y
CONFIG_LED_GPIO=y
```

<!-- Source CN PDF p.17, block 84 -->

Код соответствующей подсистемы показан ниже:

<!-- Source CN PDF p.17, block 85 -->

```text
u-boot/drivers/led/led-uclass.c // 默认编译
u-boot/drivers/led/led_gpio.c // 支持 compatible = "gpio-leds"
```

<!-- Source CN PDF p.17, block 86 -->

Соответствующие программные интерфейсы

<!-- Source CN PDF p.17, block 87 -->

```text
// 获取led device
int led_get_by_label(const char *label, struct udevice **devp);
// 设置/获取led状态
int led_set_state(struct udevice *dev, enum led_state_t state);
enum led_state_t led_get_state(struct udevice *dev);
// 忽略，目前未做底层驱动实现
int led_set_period(struct udevice *dev, int period_ms);
```

<!-- Source CN PDF p.17, block 88 -->

Для включения LED достаточно вызвать led_get_by_label. В примере ниже добавьте вызов led_get_by_label в board_late_init. После запуска системы можно наблюдать включение LED на gpio2a0 и gpio2a1.

<!-- Source CN PDF p.18, block 89 -->

```text
/u-boot/arch/arm/mach-rockchip/board.c
#include <led.h>
int board_late_init(void)
{
    struct udevice *led_dev;
    ...
    led_get_by_label("blue_full", &led_dev);
    led_set_state(led_dev, LEDST_ON);
    ...
}
```

<!-- Source CN PDF p.18, block 90 -->

В отличие от ядра, U-Boot на этапе инициализации не запускает автоматически probe зарегистрированных пар device-driver, хотя использует модель device-driver. Пользователь должен явно инициировать probe. Поэтому led_gpio_probe выполняется только после вызова led_get_by_label. Основной вызов внутри led_get_by_label — device_probe, который запускает probe драйвера LED. Через led_set_state можно управлять включением и выключением LED.

<!-- Source CN PDF p.18, block 91 -->

<!-- Source CN PDF p.18, block 92 -->

На основе драйвера LED можно создать собственный драйвер GPIO для U-Boot. Интерфейс получения пользовательского устройства:

<!-- Source CN PDF p.18, block 93 -->

```text
int uclass_get_device(enum uclass_id id, int index, struct udevice **devp);
int uclass_get_device_by_name(enum uclass_id id, const char *name,
struct udevice **devp);
int uclass_get_device_by_seq(enum uclass_id id, int seq, struct udevice **devp);
int uclass_get_device_by_of_offset(enum uclass_id id, int node, struct udevice
**devp);
int uclass_get_device_by_ofnode(enum uclass_id id, ofnode node, struct udevice
**devp);
int uclass_get_device_by_phandle_id(enum uclass_id id,
int phandle_id, struct udevice **devp);
int uclass_get_device_by_phandle(enum uclass_id id,
struct udevice *parent, struct udevice **devp);
int uclass_get_device_by_driver(enum uclass_id id,
const struct driver *drv, struct udevice
**devp);
int uclass_get_device_tail(struct udevice *dev, int ret, struct udevice **devp);
......
```

<!-- Source CN PDF p.18, block 94 -->

Интерфейсы работы с GPIO:

<!-- Source CN PDF p.18, block 95 -->

```text
// 申请/释放GPIO
int gpio_request_by_name(struct udevice *dev, const char *list_name,
int index, struct gpio_desc *desc, int flags);
int gpio_request_by_name_nodev(ofnode node, const char *list_name, int index,
struct gpio_desc *desc, int flags);
int gpio_request_list_by_name(struct udevice *dev, const char *list_name,
struct gpio_desc *desc_list, int max_count, int
flags);
int gpio_request_list_by_name_nodev(ofnode node, const char *list_name,
struct gpio_desc *desc_list, int max_count,
int flags);
int dm_gpio_free(struct udevice *dev, struct gpio_desc *desc)
// 配置GPIO方向。@flags：GPIOD_IS_OUT（输出）和 GPIOD_IS_IN（输入）
int dm_gpio_set_dir_flags(struct gpio_desc *desc, ulong flags);
// 设置/获取GPIO电平
int dm_gpio_get_value(const struct gpio_desc *desc)
int dm_gpio_set_value(const struct gpio_desc *desc, int value)
```

<!-- Source CN PDF p.19, block 97 -->

udevice получают через uclass_id. Регистрация драйвера LED показана ниже:

<!-- Source CN PDF p.19, block 98 -->

```text
U_BOOT_DRIVER(led_gpio) = {
  .name = "gpio_led",
  .id = UCLASS_LED,
  .of_match = led_gpio_ids,
  .ops = &gpio_led_ops,
  .priv_auto_alloc_size = sizeof(struct led_gpio_priv),
  .bind = led_gpio_bind,
  .probe = led_gpio_probe,
  .remove = led_gpio_remove,
};
```

<!-- Source CN PDF p.19, block 99 -->

UCLASS_LED определён в u-boot/include/dm/uclass-id.h.

<!-- Source CN PDF p.19, block 100 -->

### 3.2 Разработка драйвера GPIO в U-Boot

<!-- Source CN PDF p.19, block 101 -->

Описанный драйвер LED уже реализован в U-Boot; достаточно настроить DTS и вызвать его интерфейсы. Далее приведён пример разработки драйвера GPIO для U-Boot. Включите следующие параметры:

<!-- Source CN PDF p.19, block 102 -->

```text
/u-boot/configs/rk3588_defconfig
CONFIG_DM_GPIO=y
CONFIG_GPIO_HOG=y
CONFIG_ARCH_ROCKCHIP=y
CONFIG_SPL_GPIO_SUPPORT=y
```

<!-- Source CN PDF p.19, block 103 -->

Настройка DTS

<!-- Source CN PDF p.19, block 104 -->

Например, для управления gpio3b7 настройте DTS U-Boot следующим образом:

<!-- Source CN PDF p.19, block 105 -->

```text
gpio_uboot_demo {
    u-boot,dm-pre-reloc;
    compatible="gpio_uboot_demo";
    enable-gpios = <&gpio3 RK_PB7 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
&gpio3 {
    u-boot,dm-pre-reloc;
    status = "okay";
};
```

<!-- Source CN PDF p.19, block 106 -->

Код пользовательского драйвера

<!-- Source CN PDF p.20, block 108 -->

```text
/*
 * Copyright (c) 2015 Google, Inc
 * Written by Simon Glass <sjg@chromium.org>
 *
 * SPDX-License-Identifier: GPL-2.0+
 */
/* The following code is based on the RK3588 Android 12 platform */
#include <common.h>
#include <dm.h>
#include <errno.h>
#include <asm/gpio.h>
#include <dm/lists.h>
#include <dm/ofnode.h>
static int gpio_uboot_demo_probe(struct udevice *dev)
{
    struct gpio_desc gpio_uboot ;
    int ret;
    printf("----gpio_uboot_demo_probe----\n");
    ret = gpio_request_by_name(dev, "enable-gpios", 0, &gpio_uboot, GPIOD_IS_OUT);
    if(ret)
    {
        printf("can not get eepro_wp gpio\n");
    }
    dm_gpio_set_value(&gpio_uboot, 1);
    return 0;
}
static int gpio_uboot_demo_remove(struct udevice *dev)
{
    printf("----gpio_uboot_demo_remove----\n");
    return 0;
}
static const struct udevice_id gpio_uboot_demo_ids[] = {
    { .compatible = "gpio_uboot_demo" },
    { }
};
U_BOOT_DRIVER(gpio_uboot_demo) = {
    .name = "gpio_uboot_demo",
    .id = UCLASS_GPIO,
    .of_match = gpio_uboot_demo_ids,
    .probe = gpio_uboot_demo_probe,
    .remove = gpio_uboot_demo_remove,
};
```

<!-- Source CN PDF p.20, block 109 -->

Драйвер получает gpio3b7 через `gpio_request_by_name(dev, "enable-gpios", 0, &gpio_uboot, GPIOD_IS_OUT)` и настраивает его как выход. Для выполнения probe GPIO пользователь должен явно вызвать соответствующий интерфейс:

<!-- Source CN PDF p.21, block 110 -->

```text
/u-boot/arch/arm/mach-rockchip/board.c
int board_late_init(void)
{
    struct udevice *dev;
    ...
    uclass_get_device_by_driver(UCLASS_GPIO, DM_GET_DRIVER(gpio_uboot_demo), &dev);
    ...
}
```

<!-- Source CN PDF p.21, block 111 -->

Вызов uclass_get_device_by_driver из board_late_init в итоге запускает приведённую функцию probe драйвера. `dm_gpio_set_value(&gpio_uboot, 1)` устанавливает высокий выходной уровень.

<!-- Source CN PDF p.21, block 112 -->

## 4. Работа с GPIO в пользовательском пространстве

<!-- Source CN PDF p.21, block 113 -->

Работать с GPIO из пользовательского пространства можно разными способами; здесь рассматривается распространённая команда echo. Ядро Linux предоставляет интерфейс отладки GPIO в /sys/class/gpio/:

<!-- Source CN PDF p.21, block 114 -->

```text
console:/sys/class/gpio# ls
export gpiochip128 gpiochip509 gpiochip96
gpiochip0 gpiochip32 gpiochip64 unexport
```

<!-- Source CN PDF p.21, block 115 -->

Файл export сообщает системе номер вывода GPIO, который требуется экспортировать для управления; unexport отменяет экспорт. gpiochipN содержит сведения о регистрах GPIO: начальный номер base управляемых выводов, имя регистра и общее число выводов.

<!-- Source CN PDF p.21, block 116 -->

Например, экспортируйте gpio1b1. Сначала вычислите его номер: номер вывода = база управляющего регистра + номер бита в нём. gpio1b1 = 32 + 9 = 41. Экспорт gpio1b1:

<!-- Source CN PDF p.21, block 117 -->

```text
console:/sys/class/gpio# echo 41 > export
```

<!-- Source CN PDF p.21, block 118 -->

Задайте направление: in — вход, out — выход:

<!-- Source CN PDF p.21, block 119 -->

```text
console:/sys/class/gpio/gpio41# echo out > direction
```

<!-- Source CN PDF p.21, block 120 -->

Прочитайте направление:

<!-- Source CN PDF p.21, block 121 -->

```text
console:/sys/class/gpio/gpio41# cat direction
```

<!-- Source CN PDF p.21, block 122 -->

Задайте выход:

<!-- Source CN PDF p.21, block 123 -->

```text
console:/sys/class/gpio/gpio41# echo 1 > value
```

<!-- Source CN PDF p.21, block 124 -->

Прочитайте значение входа/выхода:

<!-- Source CN PDF p.21, block 125 -->

```text
console:/sys/class/gpio/gpio41# cat value
```

<!-- Source CN PDF p.21, block 126 -->

Отмените экспорт вывода:

<!-- Source CN PDF p.22, block 127 -->

```text
console:/sys/class/gpio# echo 41 > unexport
```

<!-- Source CN PDF p.22, block 128 -->

Для этих операций IO должен быть переключён на функцию GPIO. Если выбрана другая функция, управление входом/выходом GPIO невозможно. Сначала проверьте мультиплексирование. Помимо чтения регистров инструментом io, следующая команда показывает функции и настройки всех выводов:

<!-- Source CN PDF p.22, block 129 -->

```text
console:/ # cat sys/kernel/debug/pinctrl/pinctrl-rockchip-pinctrl/pinmux-pins
Pinmux settings per pin
Format: pin (name): mux_owner gpio_owner hog?
pin 0 (gpio0-0): (MUX UNCLAIMED) (GPIO UNCLAIMED)
pin 1 (gpio0-1): (MUX UNCLAIMED) (GPIO UNCLAIMED)
pin 2 (gpio0-2): (MUX UNCLAIMED) (GPIO UNCLAIMED)
pin 3 (gpio0-3): (MUX UNCLAIMED) (GPIO UNCLAIMED)
pin 4 (gpio0-4): (MUX UNCLAIMED) gpio0:4
pin 5 (gpio0-5): (MUX UNCLAIMED) gpio0:5
pin 6 (gpio0-6): ff420030.pwm (GPIO UNCLAIMED) function pwm3a group pwm3a-pin
pin 7 (gpio0-7): fe320000.dwmmc (GPIO UNCLAIMED) function sdmmc group sdmcc-cd
pin 8 (gpio0-8): (MUX UNCLAIMED) (GPIO UNCLAIMED)
pin 9 (gpio0-9): (MUX UNCLAIMED) gpio0:9
pin 10 (gpio0-10): (MUX UNCLAIMED) gpio0:10
......
console:/ # cat sys/kernel/debug/gpio
gpiochip0: GPIOs 0-31, parent: platform/pinctrl, gpio0:
 gpio-1 ( |vcc3v0_sd ) out hi
 gpio-4 ( |bt_default_wake_host) in lo
 gpio-5 ( |GPIO Key Power ) in hi
 gpio-9 ( |bt_default_reset ) out lo
 gpio-10 ( |reset ) out hi
 gpio-11 ( |spk-con ) out lo
gpiochip1: GPIOs 32-63, parent: platform/pinctrl, gpio1:
 gpio-34 ( |int-n ) in hi
 gpio-45 ( |enable ) out hi
gpiochip2: GPIOs 64-95, parent: platform/pinctrl, gpio2:
 gpio-64 ( |vbus-5v ) out lo
 gpio-83 ( |bt_default_rts ) in hi
 gpio-90 ( |bt_default_wake ) in lo
gpiochip3: GPIOs 96-127, parent: platform/pinctrl, gpio3:
 gpio-111 ( |mdio-reset ) out hi
gpiochip4: GPIOs 128-159, parent: platform/pinctrl, gpio4:
 gpio-150 ( |? ) out hi
 gpio-153 ( |vcc5v0_host ) out hi
 gpio-157 ( |enable ) out hi
 gpio-158 ( |vcc_lcd ) out hi
```

<!-- Source CN PDF p.23, block 130 -->

## 5. Настройка IO при приостановке и пробуждении

<!-- Source CN PDF p.23, block 131 -->

Операции приостановки и пробуждения на уровне микросхемы сейчас в основном реализованы в ATF; соответствующий код закрыт. Для требований разных изделий через DTS выбирается режим пониженного энергопотребления при sleep. Разным проектам нужны разные источники пробуждения; включите соответствующие источники в DTS.

<!-- Source CN PDF p.23, block 132 -->

При переходе в ожидание обычно отключаются домены питания, блоки IP, тактовые сигналы и PLL; DDR переходит в самообновление; системная шина переключается на низкую частоту (24M или 32K); отключаются vdd_arm/vdd_log и задаются источники пробуждения. Для разных требований к ожиданию настройки передаются trust при загрузке через узлы DTS. Пример RK3588:

<!-- Source CN PDF p.23, block 133 -->

```text
arch/arm64/boot/dts/rockchip/rk3588s.dtsi
rockchip_suspend: rockchip-suspend {
        compatible = "rockchip,pm-rk3588";
        status = "disabled";
        // Set the sleep log switch. 0: printing is disabled, 1: printing is enabled
        rockchip,sleep-debug-en = <0>;
         // Sleep configuration
        rockchip,sleep-mode-config = <
                (0
                | RKPM_SLP_ARMOFF_LOGOFF //进入深度休眠断电vdd_arm和vdd_log
                | RKPM_SLP_PMU_PMUALIVE_32K //进入深度休眠时使用32K时钟源作为系统时钟
                | RKPM_SLP_PMU_DIS_OSC //关闭24M晶振，最低功耗模式时可使能
                | RKPM_SLP_32K_EXT //休眠时的32K时钟源是否选用外部的32K钟源
                )
        >;
        // Wakeup source configuration
        rockchip,wakeup-config = <
                (0
                | RKPM_GPIO_WKUP_EN //GPIO0唤醒
                )
        >;
};
```

<!-- Source CN PDF p.23, block 134 -->

### 5.1 Настройка пробуждения от GPIO

<!-- Source CN PDF p.23, block 135 -->

На RK3588 питание выводов GPIO0 по умолчанию сохраняется при приостановке и дополнительной настройки не требует. Для пробуждения от GPIO вне группы GPIO0 выполните следующие настройки:

<!-- Source CN PDF p.23, block 136 -->

Сохраните питание этого GPIO при приостановке.

<!-- Source CN PDF p.24, block 137 -->

```text
vdd_log_s0: DCDC_REG3 {
    regulator-always-on;
    regulator-boot-on;
    regulator-min-microvolt = <675000>;
    regulator-max-microvolt = <750000>;
    regulator-ramp-delay = <12500>;
    regulator-name = "vdd_log_s0";
    regulator-state-mem {
    // regulator-off-in-suspend;
    regulator-on-in-suspend;
    regulator-suspend-microvolt = <750000>;
    };
};
```

<!-- Source CN PDF p.24, block 138 -->

regulator-off-in-suspend отключает это питание при приостановке. Чтобы сохранить его, замените параметр на regulator-on-in-suspend.

<!-- Source CN PDF p.24, block 139 -->

Настройте узел rockchip_suspend.

<!-- Source CN PDF p.24, block 140 -->

```text
&rockchip_suspend {
        status = "okay";
        rockchip,sleep-debug-en = <1>;
        rockchip,sleep-mode-config = <
                (0
                 // | RKPM_SLP_ARMOFF_LOGOFF
                | RKPM_SLP_ARMOFF_DDRPD
                | RKPM_SLP_PMU_PMUALIVE_32K
                | RKPM_SLP_PMU_DIS_OSC
                | RKPM_SLP_32K_EXT
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

<!-- Source CN PDF p.24, block 141 -->

В rockchip_suspend параметр RKPM_SLP_ARMOFF_LOGOFF отключает vdd_arm и vdd_log. Замените его на RKPM_SLP_ARMOFF_DDRPD, чтобы сохранить vdd_log. Также задайте RKPM_CPU0_WKUP_EN в rockchip_suspend.

<!-- Source CN PDF p.24, block 142 -->

Не каждый GPIO может быть источником пробуждения. Проверьте PMU_WAKEUP_INT_CON в TRM: многие платформы поддерживают пробуждение только от группы GPIO0.

<!-- Source CN PDF p.25, block 143 -->

### 5.2 Настройка уровней GPIO при приостановке

<!-- Source CN PDF p.25, block 144 -->

Пример RK3399:

<!-- Source CN PDF p.25, block 145 -->

```text
&rockchip_suspend {
    status = "okay";
+ rockchip,power-ctrl =
+ <&gpio1 17 GPIO_ACTIVE_HIGH>, //配置休眠时GPIO1_C1为高电平
+ <&gpio1 14 GPIO_ACTIVE_HIGH>; //配置休眠时GPIO1_B6为高电平
```

<!-- Source CN PDF p.25, block 146 -->

rockchip,power-ctrl может выбирать только GPIO на PMUIO1/2. Предпочтительна группа GPIO0; иначе состояние IO после приостановки не сохраняется. Новая подсистема приостановки возвращает IO доменов питания, не управляемых PMU, в состояние по умолчанию.

<!-- Source CN PDF p.25, block 147 -->

## 6. Расширители GPIO

<!-- Source CN PDF p.25, block 148 -->

Этот раздел описывает базовую настройку и использование расширителей GPIO на примере PCA9555 — 16-разрядного расширителя GPIO с прерыванием и слабыми подтягивающими резисторами для шины I2c/SMBus.

<!-- Source CN PDF p.25, block 149 -->

Настройка DTS

<!-- Source CN PDF p.25, block 150 -->

```text
&i2c6 {
    status = "okay";
    pca9555_20: pca9555_20@20 {
        compatible = "nxp,pca9555";
        reg = <0x20>;
    };
    imx586: imx586@1a {
        compatible = "sony,imx586";
        status = "okay";
        reset-gpio-index = <503>;
        ......
    };
};
```

<!-- Source CN PDF p.25, block 151 -->

reset-gpio-index — номер GPIO; его можно проверить командой `cat /sys/kernel/debug/gpio`.

<!-- Source CN PDF p.25, block 152 -->

Вызовы драйвера

<!-- Source CN PDF p.25, block 153 -->

```text
ret |= of_property_read_u32(node, "reset-gpio-index",
        &test->reset_gpio_index);
gpio_to_desc(test->reset_gpio_index);
```

<!-- Source CN PDF p.26, block 154 -->

## 7. Программная реализация I2C через GPIO

<!-- Source CN PDF p.26, block 155 -->

Здесь описана базовая настройка I2C через GPIO. Соответствующий драйвер: kernel/drivers/i2c/busses/i2c-gpio.c.

<!-- Source CN PDF p.26, block 156 -->

Параметры конфигурации

<!-- Source CN PDF p.26, block 157 -->

Задайте CONFIG_I2C_GPIO=y в defconfig либо выберите GPIO-based bitbanging I2C в menuconfig.

<!-- Source CN PDF p.26, block 158 -->

![Технический рисунок китайского исходника, p.26](/docs/rockchip-gpio/assets/cn-p26-figure1.png)

*Технический рисунок китайского исходника, PDF p.26.*

<!-- Source CN PDF p.26, block 159 -->

Соответствующий параметр:

<!-- Source CN PDF p.26, block 160 -->

```text
Device Drivers->
    I2C support --->
        I2C Hardware Bus support --->
            <*> GPIO-based bitbanging I2C
```

<!-- Source CN PDF p.26, block 161 -->

Настройка DTS

<!-- Source CN PDF p.26, block 162 -->

```text
i2c9: i2c@9 {
    compatible = "i2c-gpio";
    pinctrl-names = "default";
    pinctrl-0 = <&i2c9_xfer>;
    scl-gpios = <&gpio3 RK_PB3 GPIO_ACTIVE_HIGH>; //scl
    sda-gpios = <&gpio3 RK_PB4 GPIO_ACTIVE_HIGH>; //sda
    i2c-gpio,delay-us = <2>; /* ~100 kHz */
    #address-cells = <1>;
    #size-cells = <0>;
};
&pinctrl {
    i2c9 {
        /omit-if-no-ref/
        i2c9_xfer: i2c9-xfer {
            rockchip,pins =
                /* i2c9_scl */
                <3 RK_PB3 0 &pcfg_pull_none_smt>,
                /* i2c9_sda */
                <3 RK_PB4 0 &pcfg_pull_none_smt>;
        };
    };
};
```

<!-- Source CN PDF p.27, block 164 -->

## 8. Средства отладки GPIO

<!-- Source CN PDF p.27, block 165 -->

В этом разделе представлены средства отладки GPIO.

<!-- Source CN PDF p.27, block 166 -->

### 8.1 Инструмент IO

<!-- Source CN PDF p.27, block 167 -->

Платформы Rockchip предоставляют инструмент IO для прямого чтения и записи регистров при отладке.

<!-- Source CN PDF p.27, block 168 -->

#### 8.1.1 Инструмент IO на этапе ядра

<!-- Source CN PDF p.27, block 169 -->

Из-за требований безопасности Android10 и более новые версии требуют ручной настройки отладки. Например, для команд IO на RK3399 Android12 включите следующие параметры:

<!-- Source CN PDF p.27, block 170 -->

```text
kernel-5.10/kernel/configs/android-11.config
CONFIG_DEVMEM=y
```

<!-- Source CN PDF p.27, block 171 -->

Введите io и нажмите Enter в последовательном терминале или adb, чтобы вывести подробные параметры команды.

<!-- Source CN PDF p.27, block 172 -->

```text
console:/# io
Raw memory i/o utility - $Revision: 1.5 $
io -v -1|2|4 -r|w [-l <len>] [-f <file>] <addr> [<value>]
    -v Verbose, asks for confirmation
    -1|2|4 Sets memory access size in bytes (default byte)
    -l <len> Length in bytes of area to access (defaults to
               one access, or whole file length)
    -r|w Read from or Write to memory (default read)
    -f <file> File to write on memory read, or
               to read on memory write
    <addr> The memory address to access
    <val> The value to write (implies -w)
Examples:
    io 0x1000 Reads one byte from 0x1000
    io 0x1000 0x12 Writes 0x12 to location 0x1000
    io -2 -l 8 0x1000 Reads 8 words from 0x1000
    io -r -f dmp -l 100 200 Reads 100 bytes from addr 200 to file
    io -w -f img 0x10000 Writes the whole of file to memory
Note access size (-1|2|4) does not apply to file based accesses.
```

<!-- Source CN PDF p.28, block 174 -->

Проверка мультиплексирования GPIO инструментом IO

<!-- Source CN PDF p.28, block 175 -->

На примере RK3399 используйте описания регистров TRM для определения мультиплексирования IO. Для gpio4b0 на схеме указаны следующие функции:

<!-- Source CN PDF p.28, block 176 -->

```text
GPIO4_B0/SDMMC0_D0/UART2A_RX_u
```

<!-- Source CN PDF p.28, block 177 -->

Найдите gpio4b0 в TRM RK3399, чтобы получить описание регистра:

<!-- Source CN PDF p.28, block 178 -->

![Технический рисунок китайского исходника, p.28](/docs/rockchip-gpio/assets/cn-p28-figure1.png)

*Технический рисунок китайского исходника, PDF p.28.*

| Биты | Атрибут | Сброс | Описание |
| --- | --- | --- | --- |
| 1:0 | RW | 0x0 | gpio4b0_sel: выбор iomux GPIO4B[0]. 2'b00: gpio; 2'b01: sdmmc_data0; 2'b10: uart2dbga_sin; 2'b11: зарезервировано. |

<!-- Source CN PDF p.28, block 179 -->

TRM указывает базовую область GRF и смещение 0x0e024:

<!-- Source CN PDF p.28, block 180 -->

![Технический рисунок китайского исходника, p.28](/docs/rockchip-gpio/assets/cn-p28-figure2.png)

*Технический рисунок китайского исходника, PDF p.28.*

`GRF_GPIO4B_IOMUX` — Адрес: рабочая база + смещение (`0x0e024`). Управление iomux GPIO4B.

<!-- Source CN PDF p.28, block 181 -->

Найдите address mapping в документации и определите базовый адрес GRF:

<!-- Source CN PDF p.29, block 182 -->

![Технический рисунок китайского исходника, p.29](/docs/rockchip-gpio/assets/cn-p29-figure1.png)

*Технический рисунок китайского исходника, PDF p.29.*

<!-- Source CN PDF p.29, block 183 -->

![Технический рисунок китайского исходника, p.29](/docs/rockchip-gpio/assets/cn-p29-figure2.png)

*Технический рисунок китайского исходника, PDF p.29.*

<!-- Source CN PDF p.29, block 184 -->

Добавьте смещение к базе GRF: адрес регистра мультиплексирования gpio4b0 равен 0xff77e024. Введите в последовательном терминале либо adb:

<!-- Source CN PDF p.29, block 185 -->

```text
console:/ # io -4 -l 0x100 0xff77e024
ff77e024: 00000555 0000855f 00000000 00000000
ff77e034: 00000000 00000000 00000000 000002a5
ff77e044: 00005450 0000ff03 00000143 00000000
ff77e054: 00004010 00000001 00000000 0000aa80
ff77e064: 00000455 00002040 0000aaa1 00000000
ff77e074: 00000000 00000000 00000000 00000000
ff77e084: 00000000 00000000 00000000 00000000
ff77e094: 00000000 00000000 00000000 00000000
ff77e0a4: 000000ff 00000000 00000000 00000000
ff77e0b4: 00000000 00000000 00000000 00000000
ff77e0c4: 00000000 00000000 00000000 00000000
ff77e0d4: 00000000 00000000 00000000 00000000
ff77e0e4: 00000000 00000000 00000000 00000000
ff77e0f4: 00000000 00000000 00000000 00000000
ff77e104: 00000000 00000000 00000000 0000b01b
ff77e114: 00000001 00003000 00000000 00000018
```

<!-- Source CN PDF p.30, block 187 -->

Первая строка результата:

<!-- Source CN PDF p.30, block 188 -->

```text
ff77e024: 00000555 0000855f 00000000 00000000
```

<!-- Source CN PDF p.30, block 189 -->

Четыре значения соответствуют следующим адресам:

<!-- Source CN PDF p.30, block 190 -->

```text
0xff77e024、0xff77e028、0xff77e02c、0xff77e030
```

<!-- Source CN PDF p.30, block 191 -->

Соответствие в шестнадцатеричном виде:

<!-- Source CN PDF p.30, block 192 -->

```text
0xff77e024：00000555
```

<!-- Source CN PDF p.30, block 193 -->

Преобразуйте 0x555 в двоичный вид с дополнением до 32 бит:

<!-- Source CN PDF p.30, block 194 -->

```text
0000 0000 0000 0000 0000 0101 0101 0101
```

<!-- Source CN PDF p.30, block 195 -->

В преобразованном значении младшие биты находятся справа, старшие слева: крайний справа — бит 0, крайний слева — бит 31. Сопоставьте их с описанием GRF_GPIO4B_IOMUX для интерпретации результата.

<!-- Source CN PDF p.30, block 196 -->

![Технический рисунок китайского исходника, p.30](/docs/rockchip-gpio/assets/cn-p30-figure1.png)

*Технический рисунок китайского исходника, PDF p.30.*

| Биты | Атрибут | Сброс | Описание |
| --- | --- | --- | --- |
| 1:0 | RW | 0x0 | gpio4b0_sel: выбор iomux GPIO4B[0]. 2'b00: gpio; 2'b01: sdmmc_data0; 2'b10: uart2dbga_sin; 2'b11: зарезервировано. |

<!-- Source CN PDF p.30, block 197 -->

В двоичном представлении вывода биты [1:0] равны 01, что выбирает sdmmc_data0. Это определяет текущую функцию gpio4b0. Если она не соответствует требуемой, найдите код, который её установил.

<!-- Source CN PDF p.30, block 198 -->

Как найти настройку мультиплексирования в коде? Предположим, gpio4b0 должен работать как GPIO с высоким/низким уровнем, но запрос показывает sdmmc_data0. Сначала найдите узел sdmmc в DTS и проверьте, не ссылается ли его свойство pinctrl на тот же GPIO.

<!-- Source CN PDF p.30, block 199 -->

Запись регистров инструментом IO

<!-- Source CN PDF p.30, block 200 -->

Для временной экспериментальной записи регистра используйте io -w.

<!-- Source CN PDF p.30, block 201 -->

Например, после чтения регистра командой `io -4 -r 0xff77e024` запишите 1 в бит 0 адреса 0xff77e024 следующим образом:

<!-- Source CN PDF p.31, block 202 -->

Почему в шестнадцатеричном значении после адреса регистра бит 16 должен быть равен 1? Биты 16–31 разрешают запись и по умолчанию равны 0, то есть запись запрещена. Для записи бита 0 необходимо также установить соответствующий разрешающий бит 16. Это определяется описанием регистра:

<!-- Source CN PDF p.31, block 203 -->

![Технический рисунок китайского исходника, p.31](/docs/rockchip-gpio/assets/cn-p31-figure1.png)

*Технический рисунок китайского исходника, PDF p.31.*

`GRF_GPIO4B_IOMUX` — Адрес: рабочая база + смещение (`0x0e024`). Управление iomux GPIO4B.

| Биты | Атрибут | Сброс | Описание |
| --- | --- | --- | --- |
| 31:16 | RW | 0x0000 | write_enable: разрешение записи bit0~15. При bit16=1 ПО может записывать bit0, при bit16=0 — не может; при bit17=1 ПО может записывать bit1, при bit17=0 — не может; …… при bit31=1 ПО может записывать bit15, при bit31=0 — не может. |

<!-- Source CN PDF p.31, block 204 -->

Значения регистров, записанные инструментом IO, не сохраняются после перезагрузки.

<!-- Source CN PDF p.31, block 205 -->

Просмотр регистров GPIO инструментом IO

<!-- Source CN PDF p.31, block 206 -->

Чтение регистров позволяет определить, является ли GPIO входом или выходом и какой уровень он выдаёт. Для gpio4b0 найдите ADDRESS MAPPING в TRM RK3399 и определите базу GPIO4:

<!-- Source CN PDF p.31, block 207 -->

![Технический рисунок китайского исходника, p.31](/docs/rockchip-gpio/assets/cn-p31-figure2.png)

*Технический рисунок китайского исходника, PDF p.31.*

| Модуль | База | Размер |
| --- | --- | --- |
| GPIO4 | FF79_0000 | 32K |

<!-- Source CN PDF p.31, block 208 -->

Прочитайте состояние GPIO4 командой io:

<!-- Source CN PDF p.31, block 209 -->

```text
console:/ # io -4 -l 0x100 0xFF790000
ff790000: 42000000 6a400000 00000000 00000000
ff790010: 00000000 00000000 00000000 00000000
ff790020: 00000000 00000000 00000000 00000000
ff790030: ffffffff ffffffff 00000000 00000000
ff790040: 00000000 9434d0f9 00000000 00000000
ff790050: 438b2f06 00000000 00000000 00000000
ff790060: 00000000 00000000 00000000 3230372a
ff790070: 00000000 00000000 00000000 00000000
ff790080: 42000000 6a400000 00000000 00000000
ff790090: 00000000 00000000 00000000 00000000
ff7900a0: 00000000 00000000 00000000 00000000
ff7900b0: ffffffff ffffffff 00000000 00000000
ff7900c0: 00000000 9434d0f9 00000000 00000000
ff7900d0: 438b2f06 00000000 00000000 00000000
ff7900e0: 00000000 00000000 00000000 3230372a
ff7900f0: 00000000 00000000 00000000 00000000
```

<!-- Source CN PDF p.32, block 211 -->

Интерпретируйте результат по описаниям регистров GPIO в TRM RK3399. Например, для gpio4b0:

<!-- Source CN PDF p.32, block 212 -->

![Технический рисунок китайского исходника, p.32](/docs/rockchip-gpio/assets/cn-p32-figure1.png)

*Технический рисунок китайского исходника, PDF p.32.*

10.4.1 Сводка регистров

| Имя | Смещение | Размер | Сброс | Описание |
| --- | --- | --- | --- | --- |
| GPIO_SWPORTA_DR | 0x0000 | W | 0x00000000 | Регистр данных порта A |
| GPIO_SWPORTA_DDR | 0x0004 | W | 0x00000000 | Регистр направления данных порта A |
| GPIO_INTEN | 0x0030 | W | 0x00000000 | Регистр разрешения прерываний |
| GPIO_INTMASK | 0x0034 | W | 0x00000000 | Регистр маски прерываний |
| GPIO_INTTYPE_LEVEL | 0x0038 | W | 0x00000000 | Регистр уровня прерывания |
| GPIO_INT_POLARITY | 0x003c | W | 0x00000000 | Регистр полярности прерываний |
| GPIO_INT_STATUS | 0x0040 | W | 0x00000000 | Состояние прерываний порта A |
| GPIO_INT_RAWSTATUS | 0x0044 | W | 0x00000000 | Необработанное состояние прерываний порта A |
| GPIO_DEBOUNCE | 0x0048 | W | 0x00000000 | Регистр разрешения подавления дребезга |
| GPIO_PORTA_EOI | 0x004c | W | 0x00000000 | Регистр сброса прерываний порта A |
| GPIO_EXT_PORTA | 0x0050 | W | 0x00000000 | Регистр внешнего порта A |
| GPIO_LS_SYNC | 0x0060 | W | 0x00000000 | Регистр разрешения синхронизации по уровню |

Размер: B = Byte (8 бит); HW = Half WORD (16 бит); W = WORD (32 бита).

<!-- Source CN PDF p.32, block 213 -->

Смещение 0x4 — регистр направления, 0x0 — регистр данных. Чтение регистра направления 0xff790004 возвращает 0x6a400000. Соответствие битов:

<!-- Source CN PDF p.32, block 214 -->

| gpio4d | gpio4c | gpio4b | gpio4a |
|---|---|---|---|
| 0x6a | 0x40 | 0x00 | 0x00 |

<!-- Source CN PDF p.32, block 215 -->

Каждая пара шестнадцатеричных цифр преобразуется в восемь бит, соответствующих справа налево выводам 0–7. Например, 0x6a превращается в 0110 1010; биты справа налево соответствуют gpio4d0–gpio4d7. По описанию регистра:

<!-- Source CN PDF p.32, block 216 -->

![Технический рисунок китайского исходника, p.32](/docs/rockchip-gpio/assets/cn-p32-figure2.png)

*Технический рисунок китайского исходника, PDF p.32.*

`RK3399 TRM` — Адрес: рабочая база + смещение (`0x0004`). Регистр направления данных порта A.

| Биты | Атрибут | Сброс | Описание |
| --- | --- | --- | --- |
| 31:0 | RW | 0x00000000 | gpio_swporta_ddr: записываемые значения независимо управляют направлением соответствующего бита данных порта A. 0: вход (по умолчанию); 1: выход. |

<!-- Source CN PDF p.32, block 217 -->

Следовательно, gpio4b0 сейчас является входом. Если бы он был выходом, его высокий/низкий уровень можно было бы определить по 0xFF790000. Для входа прочитайте 0xFF790050 (GPIO_EXT_PORTA).

<!-- Source CN PDF p.33, block 218 -->

#### 8.1.2 Инструмент IO в U-Boot

<!-- Source CN PDF p.33, block 219 -->

Удерживайте ctrl + c при запуске U-Boot для перехода в командную строку. U-Boot предоставляет множество команд; введите ?, чтобы вывести поддерживаемые команды:

<!-- Source CN PDF p.33, block 220 -->

```text
=> ?
? - alias for 'help'
android_print_hdr- print android image header
base - print or set address offset
bdinfo - print Board Info structure
bidram_dump- Dump bidram layout
boot - boot default, i.e., run 'bootcmd'
……
iomem - Show iomem data by device compatible(high priority) or node name
……
md - memory display
……
```

<!-- Source CN PDF p.33, block 221 -->

Для ранних версий используйте следующую конфигурацию, пересоберите и загрузите U-Boot:

<!-- Source CN PDF p.33, block 222 -->

Для команд IO включите следующий макрос:

<!-- Source CN PDF p.33, block 223 -->

```text
diff --git a/include/configs/rk_default_config.h b/include/configs/rk_default_config.h
index 9852917d4f..305de26347 100755
--- a/include/configs/rk_default_config.h
+++ b/include/configs/rk_default_config.h
@@ -304,7 +304,7 @@
/* rk io command tool */
-#undef CONFIG_RK_IO_TOOL
+#define CONFIG_RK_IO_TOOL
```

<!-- Source CN PDF p.33, block 224 -->

В U-Boot также можно использовать команду md.

<!-- Source CN PDF p.33, block 225 -->

Для md добавьте следующий макрос:

<!-- Source CN PDF p.33, block 226 -->

```text
diff --git a/include/configs/rk33plat.h b/include/configs/rk33plat.h
index 0906c0c091..3f94e9eabe 100755
--- a/include/configs/rk33plat.h
+++ b/include/configs/rk33plat.h
@@ -140,6 +140,7 @@
#define CONFIG_RK_GPIO_EXT_FUNC
#define CONFIG_CHARGE_LED
#define CONFIG_POWER_FUSB302
+ #define CONFIG_CMD_MEMORY
#endif
#if defined(CONFIG_RKCHIP_RK322XH)
```

<!-- Source CN PDF p.33, block 227 -->

Задайте bootdelay:

<!-- Source CN PDF p.34, block 228 -->

```text
diff --git a/common/autoboot.c b/common/autoboot.c
index c27cc2c751..fe28adb2fd 100644
--- a/common/autoboot.c
+++ b/common/autoboot.c
@@ -146,6 +146,7 @@ static int abortboot_normal(int bootdelay)
{
int abort = 0;
unsigned long ts;
+ bootdelay = 3; //此处添加时间可自由定义，单位：秒
#ifdef CONFIG_MENUPROMPT
printf(CONFIG_MENUPROMPT);
```

<!-- Source CN PDF p.34, block 229 -->

В стандартной конфигурации Rockchip эти параметры включены. Исходник рекомендует команды md для доступа к регистрам. Операции:

<!-- Source CN PDF p.34, block 230 -->

```text
// 读操作
md - memory display
Usage: md [.b, .w, .l, .q] address [# of objects]
// 写操作
mw - memory write (fill)
Usage: mw [.b, .w, .l, .q] address value [count]
```

<!-- Source CN PDF p.34, block 231 -->

Пример чтения: вывести 0x10 последовательных элементов данных с адреса 0x76000000.

<!-- Source CN PDF p.34, block 232 -->

```text
=> md.l 0x76000000 0x10
76000000: fffffffe ffffffff ffffffff ffffffff ................
76000010: ffffffdf ffffffff feffffff ffffffff ................
76000020: ffffffff ffffffff ffffffff ffffffff ................
76000030: ffffffff ffffffff ffffffff ffffffff ................
```

<!-- Source CN PDF p.34, block 233 -->

Пример записи: записать 0x1234 по адресу 0x76000000.

<!-- Source CN PDF p.34, block 234 -->

```text
=> mw.l 0x76000000 0xffff1234 // 高16位有mask
=> md.l 0x76000000 0x10 // 回读
76000000: ffff1234 ffffffff ffffffff ffffffff ................
76000010: ffffffdf ffffffff feffffff ffffffff ................
76000020: ffffffff ffffffff ffffffff ffffffff ................
76000030: ffffffff ffffffff ffffffff ffffffff ................
```

<!-- Source CN PDF p.34, block 235 -->

### 8.2 Инструмент IOMUX

<!-- Source CN PDF p.34, block 236 -->

iomux — двоичный файл, собранный GCC, который получает и задаёт параметры выводов GPIO через ioctl устройства rockchip-pinctrl. По умолчанию он отключён; задайте CONFIG_ROCKCHIP_IOMUX=y в defconfig.

<!-- Source CN PDF p.34, block 237 -->

Исходный код iomux:

<!-- Source CN PDF p.34, block 238 -->

```text
kernel/tools/testing/selftests/rkpinctrl/iomux.c
```

<!-- Source CN PDF p.34, block 239 -->

Способ сборки:

<!-- Source CN PDF p.35, block 240 -->

```text
gcc kernel/tools/testing/selftests/rkpinctrl/iomux.c -o iomux
```

<!-- Source CN PDF p.35, block 241 -->

Использование:

<!-- Source CN PDF p.35, block 242 -->

Пример: установить func1 для GPIO0_B7.

<!-- Source CN PDF p.35, block 243 -->

```text
[root@RK3588:/]# iomux 0 15 1
```

<!-- Source CN PDF p.35, block 244 -->

Пример: получить iomux GPIO0_B7.

<!-- Source CN PDF p.35, block 245 -->

```text
[root@RK3588:/]# iomux 0 15
mux get (GPIO0-15) = 1
```

<!-- Source CN PDF p.35, block 246 -->

### 8.3 Инструмент Pinconfig

<!-- Source CN PDF p.35, block 247 -->

PinConfig предоставляет разработчикам аппаратуры и ПО единые средства настройки и проверки IO. В исходнике поддерживаются RK3588, RK3566, RK3568, RV1126 и RV1109.

<!-- Source CN PDF p.35, block 248 -->

Подробные инструкции находятся в PinConfig_UserManual.pdf, поставляемом с инструментом.

<!-- Source CN PDF p.35, block 249 -->

### 8.4 Инструмент PinDebug

<!-- Source CN PDF p.35, block 250 -->

PinDebug — средство отладки выводов для чтения iomux и настройки их свойств. В исходнике поддерживаются RK3588, RK3566, RK3568, RV1126, RV1109, RV1106, RV1103 и RK3528.

<!-- Source CN PDF p.35, block 251 -->

Подробные инструкции находятся в PinDebug_UserManual.pdf, поставляемом с инструментом.

<!-- Source CN PDF p.35, block 252 -->

## 9. Порядок диагностики GPIO

<!-- Source CN PDF p.35, block 253 -->

Здесь приведён базовый порядок диагностики GPIO. Если вход или выход GPIO не управляется, выполните следующие действия.

<!-- Source CN PDF p.35, block 254 -->

### 9.1 Проверка питания

<!-- Source CN PDF p.35, block 255 -->

Измерьте напряжение питания выводов домена GPIO. Нормально ли оно и соответствует ли схеме? Правильно ли настроен io-domain в DTS? Прямая проверка — чтение регистров io-domain инструментом io. Настройка питания описана в разделе IO-Domain.

<!-- Source CN PDF p.35, block 256 -->

### 9.2 Проверка мультиплексирования IO

<!-- Source CN PDF p.35, block 257 -->

Чаще всего GPIO не управляется из-за выбора другой функции вывода. Используйте средства отладки GPIO, обычно io для прямого чтения регистра мультиплексирования; см. раздел инструментов отладки. Предварительную проверку можно также выполнить по временному файлу DTS.

<!-- Source CN PDF p.36, block 258 -->

### 9.3 Проверка тактирования GPIO

<!-- Source CN PDF p.36, block 259 -->

Например, чтение регистров GPIO4 инструментом IO может вернуть:

<!-- Source CN PDF p.36, block 260 -->

```text
ff790000: 42400000 42400000 42400000 42400000
ff790010: 42400000 42400000 42400000 42400000
ff790020: 42400000 42400000 42400000 42400000
ff790030: 42400000 42400000 42400000 42400000
ff790040: 42400000 42400000 42400000 42400000
ff790050: 42400000 42400000 42400000 42400000
ff790060: 42400000 42400000 42400000 42400000
ff790070: 42400000 42400000 42400000 42400000
ff790080: 42400000 42400000 42400000 42400000
ff790090: 42400000 42400000 42400000 42400000
ff7900a0: 42400000 42400000 42400000 42400000
ff7900b0: 42400000 42400000 42400000 42400000
ff7900c0: 42400000 42400000 42400000 42400000
ff7900d0: 42400000 42400000 42400000 42400000
ff7900e0: 42400000 42400000 42400000 42400000
ff7900f0: 42400000 42400000 42400000 42400000
```

<!-- Source CN PDF p.36, block 261 -->

Все значения подозрительно одинаковы. Если часть или все результаты io имеют одно и то же необычное значение, тактирование GPIO отключено и чтение/запись недоступны. Включите тактирование GPIO4 RK3399; найдите gpio4_en в TRM:

<!-- Source CN PDF p.36, block 262 -->

![Технический рисунок китайского исходника, p.36](/docs/rockchip-gpio/assets/cn-p36-figure1.png)

*Технический рисунок китайского исходника, PDF p.36.*

`CRU_CLKGATE_CON31` — Адрес: рабочая база + смещение (`0x037c`). Внутренний регистр управления тактированием 31. База CRU FF76_0000, размер 64K.

| Биты | Атрибут | Сброс | Описание |
| --- | --- | --- | --- |
| 5 | RW | 0x0 | pclk_gpio4_en: бит отключения тактирования pclk_gpio4. HIGH отключает тактирование. |

<!-- Source CN PDF p.36, block 263 -->

Сначала прочитайте состояние тактирования GPIO4 через io. Единица в бите регистра означает отключение:

<!-- Source CN PDF p.36, block 264 -->

```text
io -4 -l 0x100 0xFF76037C
ff76037c: 000001b8 00000010 00000000 0000002a
ff76038c: 00000000 00000000 00000000 00000000
ff76039c: 00000000 00000000 00000000 00000000
ff7603ac: 00000000 00000000 00000000 00000000
ff7603bc: 00000000 00000000 00000000 00000000
ff7603cc: 00000000 00000000 00000000 00000000
ff7603dc: 00000000 00000000 00000000 00000000
ff7603ec: 00000000 00000000 00000000 00000000
ff7603fc: 00000000 00000000 000 00000 00000000
ff76040c: 00000000 00000000 00000000 00000000
ff76041c: 00000000 00000000 00004040 00000000
ff76042c: 00000014 00000000 00000000 00000000
ff76043c: 00000000 00000000 00000000 00000000
ff76044c: 00000000 00000000 00000000 00000000
ff76045c: 00000000 00000000 00000000 00000000
ff76046c: 00000000 00000000 00000000 00000000
```

<!-- Source CN PDF p.37, block 266 -->

Результат 0x000001b8 в двоичном виде — 0001 1011 1000. Тактированию GPIO4 соответствует бит 5 справа; он равен 1, то есть отключён. Включите его, чтобы io мог нормально читать и записывать:

<!-- Source CN PDF p.37, block 267 -->

```text
io -4 -w 0xFF76037C 0x00200000
io -4 -l 0x100 0xFF790000
ff790000: 42000000 6a400000 00000000 00000000
ff790010: 00000000 00000000 00000000 00000000
ff790020: 00000000 00000000 00000000 00000000
ff790030: ffffffff ffffffff 00000000 00000000
ff790040: 00000000 9434d0f9 00000000 00000000
ff790050: 438b2f06 00000000 00000000 00000000
ff790060: 00000000 00000000 00000000 3230372a
ff790070: 00000000 00000000 00000000 00000000
ff790080: 42000000 6a400000 00000000 00000000
ff790090: 00000000 00000000 00000000 00000000
ff7900a0: 00000000 00000000 00000000 00000000
ff7900b0: ffffffff ffffffff 00000000 00000000
ff7900c0: 00000000 9434d0f9 00000000 00000000
ff7900d0: 438b2f06 00000000 00000000 00000000
ff7900e0: 00000000 00000000 00000000 3230372a
ff7900f0: 00000000 00000000 00000000 00000000
```

<!-- Source CN PDF p.37, block 268 -->

Помимо записи регистров, тактирование можно включить через интерфейс sys, например:

<!-- Source CN PDF p.37, block 269 -->

```text
console:sys/kernel/debug/clk # cat clk_summary | grep gpio3
pclk_gpio3 0 1 0 100000000 0 0 50000
console:sys/kernel/debug/clk # ls pclk_gpio3
pclk_gpio3/clk_accuracy pclk_gpio3/clk_parent
pclk_gpio3/clk_available_parent pclk_gpio3/clk_phase
pclk_gpio3/clk_duty_cycle pclk_gpio3/clk_prepare_count
pclk_gpio3/clk_enable_count pclk_gpio3/clk_protect_count
pclk_gpio3/clk_flags pclk_gpio3/clk_rate
pclk_gpio3/clk_notifier_count
console:sys/kernel/debug/clk # echo 1 > pclk_gpio3/clk_enable_count
console:sys/kernel/debug/clk # cat clk_summary | grep gpio3
    pclk_gpio3 1 2 0 100000000 0 0 50000
```

<!-- Source CN PDF p.38, block 270 -->

Примечание: включение тактирования GPIO зависит от его активности, например прерывания или передачи данных, а не непосредственно от настройки или вызова API.

<!-- Source CN PDF p.38, block 271 -->

### 9.4 Проверка конфликтов с другими драйверами GPIO

<!-- Source CN PDF p.38, block 272 -->

Если для GPIO правильно настроены функция и питание, но осциллограмма не соответствует высоким/низким уровням, задаваемым вашим драйвером, выводом может управлять другой драйвер. Добавьте отладочную печать в gpio_direction_output и gpio_direction_input, как показано ниже, чтобы вывести все операции GPIO.

<!-- Source CN PDF p.38, block 273 -->

```text
drivers/gpio/gpiolib.c
int gpiod_direction_input(struct gpio_desc *desc)
{
    + pr_info("%s: %d\n", __func__, desc_to_gpio(desc));
    ......
}
int gpiod_direction_output(struct gpio_desc *desc, int value)
{
    + pr_info("%s: %d\n", __func__, desc_to_gpio(desc));
    ......
}
```

<!-- Source CN PDF p.38, block 274 -->

Для диагностики неуправляемого gpio4b3 RK3588 сначала определите начальный номер gpio4a0 следующей командой:

<!-- Source CN PDF p.38, block 275 -->

```text
root@rk3588-buildroot:/# cat /sys/kernel/debug/gpio
gpiochip0: GPIOs 0-31, parent: platform/fd8a0000.gpio, gpio0:
 gpio-26 ( |GTP_RST_PORT ) out hi
 gpio-27 ( |GTP_INT_IRQ ) in hi
gpiochip1: GPIOs 32-63, parent: platform/fec20000.gpio, gpio1:
 gpio-41 ( |vcc-mipicsi0-regulat) out lo
 gpio-42 ( |vcc-mipicsi1-regulat) out lo
gpiochip2: GPIOs 64-95, parent: platform/fec30000.gpio, gpio2:
 gpio-76 ( |reset ) out hi ACTIVE LOW
 gpio-77 ( |hdmirx-det ) in hi ACTIVE LOW
 gpio-84 ( |vcc-mipidcphy0-regul) out hi
gpiochip3: GPIOs 96-127, parent: platform/fec40000.gpio, gpio3:
 gpio-96 ( |bt_default_wake_host) in lo
 gpio-113 ( |ircut-open ) out lo
 gpio-115 ( |vcc3v3-pcie30 ) out lo
#gpio4a0的引脚首编号为128
gpiochip4: GPIOs 128-159, parent: platform/fec50000.gpio, gpio4:
 gpio-130 ( |reset ) out hi
 gpio-133 ( |reset ) out hi
 gpio-134 ( |sbu1-dc ) out lo
 gpio-135 ( |sbu2-dc ) out hi
 gpio-136 ( |vcc5v0-host ) out hi
gpio-137 ( |enable ) out lo
gpio-138 ( |enable ) out lo
gpio-152 ( |vbus5v0-typec ) out lo
```

<!-- Source CN PDF p.39, block 277 -->

Вычислите номер gpio4b3:

<!-- Source CN PDF p.39, block 278 -->

```text
gpio4b3 = 128 + (B-A) * 8 + 3 = 128 + 1 * 8 + 3 = 139
```

<!-- Source CN PDF p.39, block 279 -->

Найдите сообщения с числом 139:

<!-- Source CN PDF p.39, block 280 -->

```text
root@rk3588-buildroot:/# dmesg | grep "gpiod_direction_output"
[ 1.460212] gpiod_direction_output: 152
[ 1.460291] gpiod_direction_output: 115
[ 1.460391] gpiod_direction_output: 136
......
[ 1.735094] gpiod_direction_output: 133
[ 1.806359] gpiod_direction_output: 139 #有驱动控制了gpio4b3
[ 2.136271] gpiod_direction_output: 113
```

<!-- Source CN PDF p.39, block 281 -->

### 9.5 Проверка регистров GPIO

<!-- Source CN PDF p.39, block 282 -->

Если домен питания и сброс IO проверены, напрямую прочитайте/запишите регистры GPIO через io, чтобы окончательно определить, связана ли проблема с программной настройкой.

<!-- Source CN PDF p.39, block 283 -->

Проверьте три регистра GPIO:

<!-- Source CN PDF p.39, block 284 -->

Port Data Register: регистр выхода GPIO (Low/High)

<!-- Source CN PDF p.39, block 285 -->

Port Data Direction Register: регистр направления GPIO (Input/Output)

<!-- Source CN PDF p.39, block 286 -->

External Port Data Register: фактический уровень внешнего порта GPIO (Low/High)

<!-- Source CN PDF p.39, block 287 -->

Например, если для высокого выхода регистр данных равен 1 и регистр направления равен 1, но уровень внешнего порта равен 0, причина, скорее всего, аппаратная: внешняя схема тянет GPIO к низкому уровню.

<!-- Source CN PDF p.39, block 288 -->

## 10. Частые вопросы

<!-- Source CN PDF p.39, block 289 -->

### 10.1 Невозможно управлять уровнем сразу после подачи питания

<!-- Source CN PDF p.39, block 290 -->

ПО не может управлять уровнем непосредственно при подаче питания. Выберите GPIO с требуемой аппаратной подтяжкой вверх или вниз по умолчанию. На примере RK3399 gpio2c2 без внешней схемы проверьте начальное состояние по документации или суффиксу имени вывода на схеме:

<!-- Source CN PDF p.39, block 291 -->

![Технический рисунок китайского исходника, p.39](/docs/rockchip-gpio/assets/cn-p39-figure1.png)

*Технический рисунок китайского исходника, PDF p.39.*

<!-- Source CN PDF p.40, block 292 -->

Для высокого уровня при подаче питания выберите GPIO с суффиксом -u; для низкого — с -d.

<!-- Source CN PDF p.40, block 293 -->

Некоторые выводы по умолчанию не работают как GPIO. Проверьте начальное значение регистра мультиплексирования в TRM; например, выводы JTAG по умолчанию настроены на JTAG.

<!-- Source CN PDF p.40, block 294 -->

### 10.2 Ложные прерывания GPIO

<!-- Source CN PDF p.40, block 295 -->

При ложных прерываниях GPIO включите триггер Шмитта, задав pcfg_pull_none_smt.

<!-- Source CN PDF p.40, block 296 -->

### 10.3 Не управляются gpio3b0~gpio3c3 на RV1103/RV1106

<!-- Source CN PDF p.40, block 297 -->

Выводы gpio3b0~gpio3c3 RV1103/RV1106 имеют особенности: для GPIO нужна дополнительная настройка регистров, и они могут работать только как входы. Режимы GPIO и MIPI этой группы взаимоисключающие. Выполните следующие действия:

<!-- Source CN PDF p.40, block 298 -->

```text
io -4 0xFF3B4804 0x40000000 #使能gpio3b的clk
io -4 0xFF3B4808 0x00100000 #使能gpio3c的clk
io -4 0xFF3E8000 0x7D #Clk/data lane enable
io -4 0xFF3E8080 0x5F #MIPI/LVDS enable
# 如果引脚是gpio3b6~gpio3b7和gpio3c0~gpio3c，则配置0xFF3E844C寄存器
io -4 0xFF3E844C 0x00010001 #切换csi_dphy_path0为TLL_MODE
# 如果引脚是gpio3b0~gpio3b5，则配置0xFF3E884C寄存器
io -4 0xFF3E884C 0x00010001 #切换csi_dphy_path1为TLL_MODE
io -4 0xFF55804c 0x00070000 #设置GPIO3_B4复用寄存器
```

<!-- Source CN PDF p.40, block 299 -->

### 10.4 Не управляются gpio1a0~gpio1b1 на RV1108

<!-- Source CN PDF p.40, block 300 -->

Здесь исходный текст указывает gpio3b0~gpio3c3 RV1108. Для режима GPIO настройте DPHY_LVDS_TTL на TTL mode следующим образом:

<!-- Source CN PDF p.40, block 301 -->

```text
io -4 0x2022838C 0x00000004 #enable TTL mode，disable LVDS mode，disable mipi mode
io -4 0x202283AC 0x000000fd #disable Data Lane，disable Clock Lane
```

<!-- Source CN PDF p.40, block 302 -->

### 10.5 Не управляются gpio4d2 и gpio4d3 на RK3588

<!-- Source CN PDF p.40, block 303 -->

Для RK3588, а также других платформ, например RK3576 с аналогичной проблемой, перед выбором GPIO проверьте force_jtag в руководстве:

<!-- Source CN PDF p.41, block 304 -->

![Технический рисунок китайского исходника, p.41](/docs/rockchip-gpio/assets/cn-p41-figure1.png)

*Технический рисунок китайского исходника, PDF p.41.*

`SYS_GRF_SOC_CON6` — Адрес: рабочая база + смещение (`0x0318`).

| Биты | Атрибут | Сброс | Описание |
| --- | --- | --- | --- |
| 31:16 | WO | 0x0000 | write_enable: отдельное разрешение записи для каждого из младших 16 бит. 1'b0: запись запрещена; 1'b1: разрешена. |
| 15 | RW | 0x0 | pciephy_dtb_sel: выбор PCIEPHY DTB. 1'b0: вывод PCIE0 PHY DTB на IO; 1'b1: вывод PCIE1 PHY DTB на IO. |
| 14 | RW | 0x1 | force_jtag: принудительное включение функции JTAG на SDMMC IO. Если force_jtag высокий, gpio4_d2_sel = 0x1, gpio4_d3_sel = 0x1 и SDMMC_DETECTN неактивен, SDMMC IO переключается на CPU JTAG. |

<!-- Source CN PDF p.41, block 305 -->

Сбросьте установленный по умолчанию бит force_jtag:

<!-- Source CN PDF p.41, block 306 -->

```text
io -4 0xFD58C318 0x40000000 #disable force_jtag
io -4 0xFD5F8098 0x0F000000 #iomux set to gpio
```

<!-- Source CN PDF p.41, block 307 -->

### 10.6 В Android SDK отсутствует /sys/class/gpio

<!-- Source CN PDF p.41, block 308 -->

В device/rockchip/rk3588/BoardConfig.mk задайте `BOARD_BUILD_GKI := false` и включите CONFIG_DEBUG_GPIO и CONFIG_GPIO_SYSFS в конфигурации ядра.

<!-- Source CN PDF p.41, block 309 -->

### 10.7 Неправильное чтение уровня GPIO

<!-- Source CN PDF p.41, block 310 -->

1\. Настроен ли IOMUX как GPIO?

<!-- Source CN PDF p.41, block 311 -->

2\. Настроен ли регистр DDR GPIO на вход?

<!-- Source CN PDF p.41, block 312 -->

3\. Включено ли тактирование GPIO?

<!-- Source CN PDF p.41, block 313 -->

4\. Есть ли у GPIO внутренняя/внешняя подтяжка вверх?

<!-- Source CN PDF p.41, block 314 -->

5\. Прочитайте GPIO_EXT_PORT для проверки уровня. Регистр отражает реальный уровень вывода, поэтому IOMUX и DDR должны быть настроены правильно, а подтяжки не должны оставлять высокоимпедансное состояние.

<!-- Source CN PDF p.41, block 315 -->

### 10.8 Привязка прерывания GPIO к определённому ядру

<!-- Source CN PDF p.41, block 316 -->

Следующий патч изменяет привязку прерывания на CPU2:

<!-- Source CN PDF p.41, block 317 -->

```text
--- a/drivers/gpio/gpio-rockchip.c
+++ b/drivers/gpio/gpio-rockchip.c
@@ -579,6 +579,25 @@ static int rockchip_interrupts_register(struct rockchip_pin_bank *bank)
        irq_set_chained_handler_and_data(bank->irq,
                                         rockchip_irq_demux, bank);
+ // +++ 新增：设置中断亲和性到CPU2 +++
+ {
+ struct cpumask cpumask;
+ int cpu = 2; // 指定CPU2
+
+ // 检查CPU2是否有效
+ if (cpu < num_possible_cpus()) {
+ cpumask_clear(&cpumask);
+ cpumask_set_cpu(cpu, &cpumask);
+ if (irq_set_affinity_hint(bank->irq, &cpumask)) {
+ dev_warn(bank->dev, "Failed to set IRQ affinity for CPU%d\n", cpu);
+ } else {
+ dev_warn(bank->dev, "IRQ%d affinity set to CPU%d\n", bank->irq, cpu);
+ }
+ } else {
+ dev_warn(bank->dev, "Invalid CPU%d for IRQ affinity\n", cpu);
+ }
+ }
+
        return 0;
 }
```

<!-- Source CN PDF p.42, block 319 -->

### 10.9 Задержка реакции на прерывание GPIO

<!-- Source CN PDF p.42, block 320 -->

1\. Измените привязку прерывания.

<!-- Source CN PDF p.42, block 321 -->

2\. CONFIG_HZ=1000 // Измените интервал системного тика

<!-- Source CN PDF p.42, block 322 -->

- Высокое значение HZ, например 1000: прерывание таймера возникает каждую 1ms, и задержка реакции планировщика на новую задачу составляет не более 1ms.
- Низкое значение HZ, например 100: прерывание возникает каждые 10ms, и задержка переключения задач может достигать 10ms.

<!-- Source CN PDF p.42, block 323 -->

3\. Увеличьте частоту CPU.

<!-- Source CN PDF p.42, block 324 -->

4\. Примените патч реального времени по документации в `docs\Patches\Real-Time-Performance`.

{% endraw %}
