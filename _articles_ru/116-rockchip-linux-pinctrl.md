---
title: "Rockchip Linux Pinctrl: полное руководство по GPIO, IOMUX, силе драйвера и DTS"
description: "Rockchip Linux Pinctrl: полное руководство по GPIO, IOMUX, силе драйвера и DTS — V1.0.0; Linux 4.19/5.10."
translation_key: "116-rockchip-linux-pinctrl"
slug: "116-rockchip-linux-pinctrl"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, Pinctrl, GPIO, IOMUX]
excerpt: "Rockchip Linux Pinctrl: полное руководство по GPIO, IOMUX, силе драйвера и DTS — V1.0.0; Linux 4.19/5.10."
---

{% raw %}

Руководство по PIN-CTRL и DTS использует согласованный китайский V1.0.0 как общую основу с переводом дополнительных разделов. Китайский ID RK-KF-YF-200, английский RK-KF-YF-136. Область: Linux-4.19 на RK3568/RK3399/RK3368/RK3288/PX30/RK3128/RK3126/RV1126; Linux-5.10 на RK3588/RV1106. Это справочник платформы: проверьте выводы платы ArmSoM, VCCIO, SDK/BSP, ядро и TRM. Аппаратная проверка не проводилась. Рисунок взят из английского PDF.

> Сохранены противоречия: китайский индекс вывода внутри порта 0–7, английский 0–31. Китайский текст задаёт mA до RK3399 и Level после RK1808, английский — mA до RK1808 и Level начиная с RK3399. Основной текст сохраняет китайский вариант, но не подтверждает поведение чипа: проверьте его TRM и драйвер. Переведены китайские дополнения о драйверах, SMT, init, PWM и FAQ 4.2/4.3. Исходные rockchip,pin в единственном числе, 2cm0 и оговорка init/default требуют проверки.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1 Правила обозначения выводов

ID вывода Rockchip состоит из контроллера (bank), порта (port) и номера вывода (pin).

### 1.1 GPIO

Количество банков равно числу контроллеров GPIO. Порты — A, B, C, D; индекс внутри порта — 0, 1, 2, 3, 4, 5, 6, 7. Например, глава 20 GPIO в RK3588-TRM.pdf указывает пять GPIO: GPIO0 в PD_PMU, GPIO1/GPIO2/GPIO3/GPIO4 в PD_BUS. Каждый из пяти контроллеров управляет 32 IO. В режиме GPIO поведение порта задаётся регистрами контроллера GPIO.

### 1.2 IOMUX

Вывод Rockchip поддерживает несколько функций. Альтернативные маршруты одного контроллера обычно называются m0, m1, m2 и т. д. Например, два маршрута I2C названы 2cm0 и i2cm1 (написание источника). Регистры мультиплексирования находятся в GRF/PMUGRF, на RK3588 называемых IOC. Пример RK3588 приведён ниже; затем показан IOMUX I2C5.

```text
BUS_IOC_GPIO1B_IOMUX_SEL_H
Address: Operational Base + offset (0x002C)
gpio1b7_sel
4'h0: GPIO
4'h2: MIPI_CAMERA2_CLK_M0
4'h3: SPDIF1_TX_M0
4'h4: PCIE30X2_PERSTN_M3
4'h5: HDMI_RX_CEC_M2
4'h6: SATA2_ACT_LED_M1
4'h9: I2C5_SDA_M3
4'ha: UART1_RX_M1
4'hb: PWM13_M2
```

![Маршруты RK3588 I2C5, рисунок английского оригинала](/docs/rockchip-linux-pinctrl/assets/en-p006-figure-01.png)

*Маршруты RK3588 I2C5, рисунок английского оригинала*

Несколько маршрутов делают аппаратный дизайн гибче: для периферии на 1.8V или 3.3V можно выбрать выводы разных доменов VCCIO. Примечание: регистр выбора маршрута влияет на RX-выводы, но не на TX-выводы.

### 1.3 PULL

Подтяжка IO PAD Rockchip обычно имеет три режима: `bias-disable`, `bias-pull-up`, `bias-pull-down`. Она задаётся на IO PAD и действует как в режиме GPIO, так и IOMUX.

### 1.4 DRIVE-STRENGTH

Поддерживаемая сила драйвера IO PAD зависит от техпроцесса. Китайский источник указывает единицы mA для чипов до RK3399, а для чипов после RK1808 — обычно Level, численно соответствующий значению регистра. Пример GPIO0_C7 из RK3588 TRM (gpio0c7_ds, GPIO0C7 DS control Driver Strength Selection):

```text
3'b000: 100ohm
3'b100: 66ohm
```

Остальные значения силы драйвера и соответствующие уровни приведены ниже. В DTS `drive-strength=<5>;` выбирает Level5, то есть запись `3'b101` в регистр.

```text
3'b010: 50ohm
3'b110: 40ohm
3'b001: 33ohm
3'b101: 25ohm

3'b000: Level0
3'b100: Level4
3'b010: Level2
3'b110: Level6
3'b001: Level1
3'b101: Level5
```

### 1.5 SMT (триггер Шмитта)

Большинство чипов Rockchip поддерживает SMT на IO PAD, по умолчанию отключённый. Включение подавляет дрожание фронтов, расширяет интервал напряжений VIH/VIL и улучшает стабильность сигнала. Для SCL/SDA I2C SMT обычно включается по умолчанию.

## 2 Описание драйверов

Rockchip pinctrl включает драйвер Pinctrl (`drivers/pinctrl/pinctrl-rockchip.c`) и драйвер GPIO (`drivers/gpio/gpio-rockchip.c`). Pinctrl — основной драйвер, предоставляющий операции IO: PINMUX, PINCONF и GPIO. Драйвер GPIO реализует gpiochip, включая GPIO и IRQ.

### 2.1 pinctrl-rockchip

`//TO-DO` — источник не содержит здесь описания реализации.

### 2.2 gpio-rockchip

`//TO-DO` — источник не содержит здесь описания реализации.

## 3 Описание DTS

В Rockchip DTS узел pinctrl обычно находится в soc.dtsi, например rk3588s.dtsi, как правило последним узлом.

Узел pinctrl не имеет reg и не является стандартным platform device. База регистров передаётся через `rockchip,grf=<&grf>;`; драйвер добавляет смещения для настройки IOMUX и PINCONF. GPIO использует адрес reg своего gpio-узла. Пример: `arch/arm64/boot/dts/rockchip/rk3588s.dtsi`.

```text
{
    pinctrl: pinctrl {
        compatible = "rockchip,rk3588-pinctrl";
        rockchip,grf = <&ioc>;
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;

        gpio0: gpio@fd8a0000 {
            compatible = "rockchip,gpio-bank";
            reg = <0x0 0xfd8a0000 0x0 0x100>;
            interrupts = <GIC_SPI 277 IRQ_TYPE_LEVEL_HIGH>;
            clocks = <&cru PCLK_GPIO0>, <&cru DBCLK_GPIO0>;

            gpio-controller;
            #gpio-cells = <2>;
            interrupt-controller;
            #interrupt-cells = <2>;
        };

        gpio1: gpio@fec20000 {
            compatible = "rockchip,gpio-bank";
            reg = <0x0 0xfec20000 0x0 0x100>;
            interrupts = <GIC_SPI 278 IRQ_TYPE_LEVEL_HIGH>;
            clocks = <&cru PCLK_GPIO1>, <&cru DBCLK_GPIO1>;

            gpio-controller;
            #gpio-cells = <2>;
            interrupt-controller;
            #interrupt-cells = <2>;
        };

        gpio2: gpio@fec30000 {
            compatible = "rockchip,gpio-bank";
            reg = <0x0 0xfec30000 0x0 0x100>;
            interrupts = <GIC_SPI 279 IRQ_TYPE_LEVEL_HIGH>;
            clocks = <&cru PCLK_GPIO2>, <&cru DBCLK_GPIO2>;

            gpio-controller;
            #gpio-cells = <2>;
            interrupt-controller;
            #interrupt-cells = <2>;
        };

        gpio3: gpio@fec40000 {
            compatible = "rockchip,gpio-bank";
            reg = <0x0 0xfec40000 0x0 0x100>;
            interrupts = <GIC_SPI 280 IRQ_TYPE_LEVEL_HIGH>;
            clocks = <&cru PCLK_GPIO3>, <&cru DBCLK_GPIO3>;
            gpio-controller;
            #gpio-cells = <2>;
            interrupt-controller;
            #interrupt-cells = <2>;
        };

        gpio4: gpio@fec50000 {
            compatible = "rockchip,gpio-bank";
            reg = <0x0 0xfec50000 0x0 0x100>;
            interrupts = <GIC_SPI 281 IRQ_TYPE_LEVEL_HIGH>;
            clocks = <&cru PCLK_GPIO4>, <&cru DBCLK_GPIO4>;

            gpio-controller;
            #gpio-cells = <2>;
            interrupt-controller;
            #interrupt-cells = <2>;
        };
    };
};
```

Файл `arch/arm64/boot/dts/rockchip/rk3588s-pinctrl.dtsi` также включается в rk3588s.dtsi.

### 3.1 Создание экземпляров pinctrl

rk3588s-pinctrl.dtsi уже перечисляет все экземпляры IOMUX RK3588s; модулям обычно не нужно создавать новые. Для новых экземпляров действуют правила:

1. Разместить под узлом pinctrl.

2. Добавить в форме function + group.

3. Формат function + group:

```text
function {
    group {
        rockchip,pin = <bank gpio func &ref>;
    };
};
```

4. Соблюдать остальные базовые правила DTS.

### 3.2 Ссылки на pinctrl

Модуль ссылается на pinctrl через pinctrl-names и pinctrl-0, связывающие его с драйвером pinctrl. Пример RK3588 uart2:

```text
{
    uart2: serial@feb50000 {
        compatible = "rockchip,rk3588-uart", "snps,dw-apb-uart";
        reg = <0x0 0xfeb50000 0x0 0x100>;
        interrupts = <GIC_SPI 333 IRQ_TYPE_LEVEL_HIGH>;
        clocks = <&cru SCLK_UART2>, <&cru PCLK_UART2>;
        clock-names = "baudclk", "apb_pclk";
        reg-shift = <2>;
        reg-io-width = <4>;
        dmas = <&dmac0 10>, <&dmac0 11>;
        pinctrl-names = "default";
        pinctrl-0 = <&uart2m1_xfer>;
        status = "disabled";
    };
};
```

uart2m1_xfer — группа pinctrl. Модуль может одновременно ссылаться на несколько групп. Пример RK3588 pdm1:

```text
{
    pdm1: pdm@fe4c0000 {
        compatible = "rockchip,rk3588-pdm";
        reg = <0x0 0xfe4c0000 0x0 0x1000>;
        clocks = <&cru MCLK_PDM1>, <&cru HCLK_PDM1>;
        clock-names = "pdm_clk", "pdm_hclk";
        assigned-clocks = <&cru MCLK_PDM1>;
        assigned-clock-parents = <&cru PLL_AUPLL>;
        dmas = <&dmac1 4>;
        dma-names = "rx";
        power-domains = <&power RK3588_PD_AUDIO>;
        pinctrl-names = "default";
        pinctrl-0 = <&pdm1m0_clk
                 &pdm1m0_clk1
                 &pdm1m0_sdi0
                 &pdm1m0_sdi1
                 &pdm1m0_sdi2
                 &pdm1m0_sdi3>;
/* 等同于如下写法 */
/*
 *      pinctrl-0 = <&pdm1m0_clk>,
 *                  <&pdm1m0_clk1>,
 *                  <&pdm1m0_sdi0>,
 *                  <&pdm1m0_sdi1>,
 *                  <&pdm1m0_sdi2>,
 *                  <&pdm1m0_sdi3>;
 */
        #sound-dai-cells = <0>;
        status = "disabled";
    };
};
```

pinctrl-names поддерживает несколько состояний. Pinctrl определяет четыре стандартных состояния:

```text
#define PINCTRL_STATE_DEFAULT "default"
#define PINCTRL_STATE_INIT "init"
#define PINCTRL_STATE_IDLE "idle"
#define PINCTRL_STATE_SLEEP "sleep"
```

"init" действует во время driver probe; после probe возможен переход к "default". В скобках источник утверждает, что при выборе другого состояния в probe возврата к "init" не будет; эта формулировка сохранена для проверки. pinctrl-names можно настраивать, а драйвер должен сопоставлять и разбирать имена. Пример RK3588 pwm4:

```text
{
    pwm4: pwm@febd0000 {
        compatible = "rockchip,rk3588-pwm", "rockchip,rk3328-pwm";
        reg = <0x0 0xfebd0000 0x0 0x10>;
        #pwm-cells = <3>;
        pinctrl-names = "active";
        pinctrl-0 = <&pwm4m0_pins>;
        clocks = <&cru CLK_PWM1>, <&cru PCLK_PWM1>;
        clock-names = "pwm", "pclk";
        status = "disabled";
    };
};
```

## 4 Частые вопросы

### 4.1 Настройка IOMUX из пользовательского пространства

iomux — двоичная программа, собранная gcc; через ioctl устройства rockchip-pinctrl она задаёт или читает текущее значение IOMUX. Сборка:

```text
gcc tools/testing/selftests/rkpinctrl/iomux.c -o iomux
```

Пример: установить GPIO0_B7 в func1.

```text
[root@RK3588:/]# iomux 0 15 1
```

Пример: прочитать текущее значение IOMUX GPIO0_B7.

```text
[root@RK3588:/]# iomux 0 15
mux get (GPIO0-15) = 1
```

### 4.2 Установка уровня GPIO

GPIO иногда не относится к определённому модулю, а служит выключателем питания: нужно установить высокий или низкий уровень как можно раньше при загрузке. Используйте "regulator-fixed", обычно задающий регулятор фиксированного напряжения или регулятор, управляемый GPIO. Пример: установить высокий уровень GPIO2_A1.

```text
/ {
    foo_name: foo-name {
        compatible = "regulator-fixed";
        pinctrl-names = "default";
        pinctrl-0 = <&gpio_foo>;
        regulator-name = "vcc-foo";
        regulator-always-on;
    };
};

&pinctrl {
    gpio-foo {
        gpio_foo: gpio-foo {
            rockchip,pins = <2 RK_PA1 RK_FUNC_GPIO &pcfg_output_high>;
        };
    };
};
```

### 4.3 pinctrl-0 модуля не действует

Модули обычно используют pinctrl-names и pinctrl-0 для начальной настройки IOMUX или IOCONFIG, но эти свойства нельзя добавлять произвольно всем узлам. Ими может пользоваться модуль, вызываемый driver_probe_device. Для диагностики добавьте вывод в pinctrl_bind_pins в `drivers/base/dd.c` и проверьте вызовы.

{% endraw %}
