---
title: "Rockchip Thermal: терморегулирование, Power Allocator и RK3576"
description: "Rockchip Thermal: терморегулирование, Power Allocator и RK3576 — V1.2.0 / V1.1.1"
excerpt: "Rockchip Thermal: терморегулирование, Power Allocator и RK3576"
translation_key: "145-rockchip-thermal"
slug: "145-rockchip-thermal"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []
tags: [ArmSoM, Rockchip, Thermal, RK3576, RK3399]
---

{% raw %}

# Rockchip Thermal: терморегулирование, Power Allocator и RK3576

Четыре языка основаны на китайском V1.2.0 (19 стр.) с дополнениями английского V1.1.1 (21 стр.). Примеры вне RK3576 относятся к Linux4.4/4.19, RK3576 — к Linux6.1; новые разделы 3.2.2 и 3.3.2 сохранены полностью. Справочник ArmSoM требует проверки платы/SoC, BSP, соединений PMIC и охлаждения. Поддержка всех плат и безопасность этих порогов не подтверждены. Китайский рисунок взят из китайского PDF, EN/RU/DE — из английского. Расчёты являются исходными примерами, аппаратных испытаний не было.

> Сохранены сомнения источника: путь power_allocator. в китайском без c, в английском — power_allocator.c. Пример RK3576 всё ещё называет ядра A53/A72; при threshold=75 подставляет 85−70, а 1353mW не следует из записанного выражения. Формулу t_scale RK3399 также нужно сверить с результатом 778250. Значения не исправлены и не предназначены для прямого проектирования охлаждения. Отключение защиты сохранено только как исходный отладочный материал, не рекомендация для штатной работы; команды не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Обзор

Thermal — модель ядра для управления температурой через заданный governor и защиты чипа от перегрева. Фреймворк состоит из governor, core, cooling device и драйвера датчика. Архитектура показана ниже.

![Архитектура Thermal (английский оригинал)](/docs/rockchip-thermal/assets/en-p005-figure-01.png)

Архитектура Thermal (английский оригинал)

Thermal governor решает, нужно ли снижать частоту cooling device и насколько. В Linux4.4 источник перечисляет:

- power_allocator: PID-регулирование динамически распределяет мощность по текущей температуре и преобразует её в частоту.
- step_wise: поэтапно снижает частоту в зависимости от температуры.
- fair share: в первую очередь снижает частоту устройств с большим числом частотных ступеней.
- userspace: китайский текст говорит «не ограничивает частоту»; английский уточняет «только уведомляет userspace о тепловых событиях».

Thermal core абстрагирует governor и драйверы, задавая интерфейсы. Thermal sensor driver измеряет температуру, например tsadc. Thermal cooling device — источник тепла либо охлаждающее устройство, например CPU, GPU, DDR.

## 2. Пути исходников

Код governor:

```text
drivers/thermal/power_allocator.    /* power allocator温控策略 */
drivers/thermal/step_wise.c         /* step wise温控策略 */
drivers/thermal/fair_share.c        /* fair share温控策略 */
drivers/thermal/user_space.c        /* userspace温控策略 */
```

Код cooling device:

```text
drivers/thermal/devfreq_cooling.c
drivers/thermal/cpu_cooling.c
```

Код core:

```text
drivers/thermal/thermal_core.c
```

Код драйверов:

```text
drivers/thermal/rockchip_thermal.c    /* 除了RK3368外的其他平台的tsadc驱动 */
drivers/thermal/rk3368_thermal.c      /* RK3368平台tsadc驱动 */
```

## 3. Настройка

### 3.1 Menuconfig

```text
<*> Generic Thermal sysfs driver  --->
    --- Generic Thermal sysfs driver
    [*]   APIs to parse thermal data out of device tree
    [*]   Enable writable trip points
        Default Thermal governor (power_allocator)  --->    /* default thermal
governor */
    [ ]   Fair-share thermal governor
    [ ]   Step_wise thermal governor                            /* step_wise
governor */
    [ ]   Bang Bang thermal governor
    [*]   User_space thermal governor                           /* user_space
governor */
    -*-   Power allocator thermal governor                      /*
power_allocator governor */
    [*]   generic cpu cooling support                           /* cooling device
*/
    [ ]   Generic clock cooling support
    [*]   Generic device cooling support                        /* cooling device
*/
    [ ]   Thermal emulation mode support
    < >   Temperature sensor driver for Freescale i.MX SoCs
    <*>   Rockchip thermal driver                               /* thermal sensor
driver */
    < >     rk_virtual thermal driver
    <*>     rk3368 thermal driver legacy                        /* thermal sensor
driver */
```

Выберите стратегию через Default Thermal governor; настройка зависит от требований продукта.

### 3.2 Настройка Tsadc

#### 3.2.1 Пример конфигурации

Tsadc служит датчиком температуры. Обычно требуется настройка и DTSI, и DTS. Пример DTSI для RK3399:

```text
tsadc: tsadc@ff260000 {
    compatible = "rockchip,rk3399-tsadc";
    reg = <0x0 0xff260000 0x0 0x100>;                   /* 寄存器基地址和寄存器地址总
⻓度 */
    interrupts = <GIC_SPI 97 IRQ_TYPE_LEVEL_HIGH 0>;    /* 中断号及中断触发方式 */
    assigned-clocks = <&cru SCLK_TSADC>;                /* 工作时钟,750KHz */
    assigned-clock-rates = <750000>;
    clocks = <&cru SCLK_TSADC>, <&cru PCLK_TSADC>;      /* 工作时钟和配置时钟 */
    clock-names = "tsadc", "apb_pclk";
    resets = <&cru SRST_TSADC>;                         /* 复位信号 */
    reset-names = "tsadc-apb";
    rockchip,grf = <&grf>;                              /* 引用grf模块,部分平台需要
*/
    rockchip,hw-tshut-temp = <120000>;                  /* 过温重启阈值,120摄氏度 */
    /* tsadc输出引脚配置,支持两种模式:gpio和otpout */
    pinctrl-names = "gpio", "otpout";
    pinctrl-0 = <&otp_gpio>;
    pinctrl-1 = <&otp_out>;
    /*
     * thermal sensor标识,表示tsadc可以作为一个thermal sensor,
     * 并指定了引用tsadc节点的时候需要带几个参数。
     * 如果SoC里面只有一个tsadc,可以设置为0,超过一个必须设置为1。
     */
    #thermal-sensor-cells = <1>;
    status = "disabled";
};

/* IO口配置 */
pinctrl: pinctrl {
    ...
    tsadc {
        /* 配置为gpio模式 */
        otp_gpio: otp-gpio {
            rockchip,pins = <1 6 RK_FUNC_GPIO &pcfg_pull_none>;
        };
        /* 配置为over temperature protection模式 */
        otp_out: otp-out {
            rockchip,pins = <1 6 RK_FUNC_1 &pcfg_pull_none>;
        };
    };
    ....
}
```

DTS выбирает сброс через CRU или GPIO и активный низкий либо высокий уровень. Для GPIO выход tsadc должен быть физически соединён со входом сброса PMIC; иначе следует использовать CRU.

```text
&tsadc {
    rockchip,hw-tshut-mode = <1>;        /* tshut mode 0:CRU 1:GPIO */
    rockchip,hw-tshut-polarity = <1>;    /* tshut polarity 0:LOW 1:HIGH */
    status = "okay";
};
```

См. `Documentation/devicetree/bindings/thermal/rockchip-thermal.txt`.

#### 3.2.2 RK3576

```text
tsadc: tsadc@2ae70000 {
    compatible = "rockchip,rk3576-tsadc";
    reg = <0x0 0x2ae70000 0x0 0x400>;                   /* 寄存器基地址和寄存器地址总
⻓度 */
    interrupts = <GIC_SPI 123 IRQ_TYPE_LEVEL_HIGH>;     /* 中断号及中断触发方式 */
    clocks = <&cru CLK_TSADC>, <&cru PCLK_TSADC>;       /* 工作时钟和配置时钟 */
    clock-names = "tsadc", "apb_pclk";
    assigned-clocks = <&cru CLK_TSADC>;                 /* 工作时钟,2MHz */
    assigned-clock-rates = <2000000>;
    resets = <&cru SRST_TSADC>, <&cru SRST_P_TSADC>;    /* 复位信号 */
    reset-names = "tsadc", "tsadc-apb";
    #thermal-sensor-cells = <1>;
    rockchip,hw-tshut-temp = <120000>;                  /* 过温重启阈值,120摄氏度 */
    rockchip,hw-tshut-mode = <0>;                       /* tshut mode 0:CRU
1:GPIO */
    rockchip,hw-tshut-polarity = <0>;                   /* tshut polarity 0:LOW
1:HIGH */
    status = "disabled";
};
```

При rockchip,hw-tshut-mode=CRU свойства pinctrl-names, pinctrl-0 и pinctrl-1 не нужны; источник рекомендует CRU. Для GPIO необходимы все три:

```text
tsadc: tsadc@2ae70000 {
    ...
    rockchip,hw-tshut-polarity = <1>;    /* tshut polarity 0:LOW 1:HIGH */
    pinctrl-names = "gpio", "otpout";
    pinctrl-0 = <&otp_gpio>;
    pinctrl-1 = <&tsadc_ctrl_pins>;
    status = "disabled";
};
/* rk3576-pinctrl.dtsi中需要有otp_gpio和tsadc_ctrl_pins */
&pinctrl {
    ...
    tsadc_ctrl {
        /omit-if-no-ref/
        otp_gpio: otp-gpio {
            rockchip,pins = <0 RK_PA1 RK_FUNC_GPIO &pcfg_pull_none>;
        };
        /omit-if-no-ref/
        tsadc_ctrl_pins: tsadc_ctrl-pins {
            rockchip,pins =
                /* tsadc_ctrl_org */
                <0 RK_PA1 10 &pcfg_pull_none>;
        };
    };
    ....
}
```

### 3.3 Настройка Power allocator

Power allocator использует PID-регулирование для распределения мощности cooling device по текущей температуре. При низкой температуре доступная мощность больше и допустимая частота выше. По мере нагрева мощность и частота снижаются, ограничивая нагрев.

#### 3.3.1 Пример конфигурации

#### 3.3.1.1 CPU

Для CPU как cooling device узел должен содержать #cooling-cells и dynamic-power-coefficient. Пример RK3399:

```text
cpu_l0: cpu@0 {
    device_type = "cpu";
    compatible = "arm,cortex-a53", "arm,armv8";
    reg = <0x0 0x0>;
    enable-method = "psci";
    #cooling-cells = <2>;                 /* cooling device标识,表示该设备可以作为一
个cooling device */
    clocks = <&cru ARMCLKL>;
    cpu-idle-states = <&CPU_SLEEP &CLUSTER_SLEEP>;
    dynamic-power-coefficient = <100>;    /* 动态功耗常数C,动态功耗公式为Pdyn=C*V^2*F
*/
};
...
cpu_b0: cpu@100 {
    device_type = "cpu";
    compatible = "arm,cortex-a72", "arm,armv8";
    reg = <0x0 0x100>;
    enable-method = "psci";
    #cooling-cells = <2>;                 /* cooling device标识,表示该设备可以作为一
个cooling device */
    clocks = <&cru ARMCLKB>;
    cpu-idle-states = <&CPU_SLEEP &CLUSTER_SLEEP>;
    dynamic-power-coefficient = <436>;    /* 用于计算动态功耗的参数 */
};
```

#### 3.3.1.2 GPU

Для GPU как cooling device требуются #cooling-cells и дочерний power_model. Пример RK3399:

```text
gpu: gpu@ff9a0000 {
    compatible = "arm,malit860",
    "arm,malit86x",
    "arm,malit8xx",
    "arm,mali-midgard";

    reg = <0x0 0xff9a0000 0x0 0x10000>;

    interrupts = <GIC_SPI 19 IRQ_TYPE_LEVEL_HIGH 0>,
    <GIC_SPI 20 IRQ_TYPE_LEVEL_HIGH 0>,
    <GIC_SPI 21 IRQ_TYPE_LEVEL_HIGH 0>;
    interrupt-names = "GPU", "JOB", "MMU";

    clocks = <&cru ACLK_GPU>;
    clock-names = "clk_mali";
    #cooling-cells = <2>;                     /* cooling device标识,表示该设备可以作
为一个cooling device */
    power-domains = <&power RK3399_PD_GPU>;
    power-off-delay-ms = <200>;
    status = "disabled";

    gpu_power_model: power_model {
        compatible = "arm,mali-simple-power-model";
        static-coefficient = <411000>;    /* 用于计算静态功耗的参数 */
        dynamic-coefficient = <733>;      /* 用于计算动态功耗的参数 */
        ts = <32000 4700 (-80) 2>;        /* 用于计算静态功耗的参数 */
        thermal-zone = "gpu-thermal";     /* 从gpu-thermal获取温度,用于计算静态功耗
*/
    };
};
```

#### 3.3.1.3 Thermal Zone

Узел thermal zone настраивает параметры стратегии и создаёт соответствующие интерфейсы userspace. Пример RK3399:

```text
thermal_zones: thermal-zones {
    /* 一个节点对应一个thermal zone,并包含温控策略相关参数 */
    soc_thermal: soc-thermal {
        /* 温度高于trip-point-0指定的值,每隔20ms获取一次温度 */
        polling-delay-passive = <20>; /* milliseconds */
        /* 温度低于trip-point-0指定的值,每隔1000ms获取一次温度 */
        polling-delay = <1000>; /* milliseconds */
        /* 温度等于trip-point-1指定的值时,系统分配给cooling device的能量 */
        sustainable-power = <1000>; /* milliwatts */
        /* 当前thermal zone通过tsadc0获取温度 */
        thermal-sensors = <&tsadc 0>;

        /* trips包含不同温度阈值,不同的温控策略,配置不一定相同 */
        trips {
            /*
             * 温控阈值,超过该值温控策略开始工作,但不一定⻢上限制频率,
             * power小到一定程度才开始限制频率
             */
            threshold: trip-point-0 {
                /* 超过70摄氏度,温控策略开始工作,并且70摄氏度也是tsadc触发中断的一个阈值
*/
                temperature = <70000>; /* millicelsius */
                /* 温度低于temperature-hysteresis时触发中断,当前未实现,但是框架要求必须
填 */
                hysteresis = <2000>; /* millicelsius */
                type = "passive"; /* 表示超过该温度值时,使用polling-delay-passive */
            };
            /* 温控目标温度,期望通过降频使得芯片不超过该值 */
            target: trip-point-1 {
                /* 期望通过降频使得芯片不超过85摄氏度,并且85摄氏度也是tsadc触发中断的一个阈
值 */
                temperature = <85000>; /* millicelsius */
                /* 温度低于temperature-hysteresis时触发中断,当前未实现,但是框架要求必须
填 */
                hysteresis = <2000>; /* millicelsius */
                type = "passive"; /* 表示超过该温度值时,使用polling-delay-passive */
            };
            /* 过温保护阈值,如果降频后温度仍然上升,那么超过该值后,让系统重启 */
            soc_crit: soc-crit {
                /* 超过115摄氏度重启,并且115摄氏度也是tsadc触发中断的一个阈值  */
                temperature = <115000>; /* millicelsius */
                /* 温度低于temperature-hysteresis时触发中断,当前未实现,但是框架要求必须
填 */
                hysteresis = <2000>; /* millicelsius */
                type = "critical"; /* 表示超过该温度值时,重启 */
            };
        };

        /* cooling device配置节点,每个子节点代表一个cooling device */
        cooling-maps {
            map0 {
                /*
                 * 表示在target trip下,该cooling device才起作用,
                 * 对于power allocater策略必须填target
                 */
                trip = <&target>;
                /* A53做为cooloing device, THERMAL_NO_LIMIT不起作用,但必须填 */
                cooling-device =
                    <&cpu_l0 THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <4096>; /* 计算功耗时乘以4096/1024倍,用于调整降频顺序和
尺度 */
            };
            map1 {
                /*
                 * 表示在target trip下,该cooling device才起作用,
                 * 对于power allocater策略必须填target
                 */
                trip = <&target>;
                /* A72做为cooloing device, THERMAL_NO_LIMIT不起作用,但必须填 */
                cooling-device =
                    <&cpu_b0 THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <1024>;/* 计算功耗时乘以1024/1024倍,用于调整降频顺序和尺
度 */
            };
            map2 {
                /*
                 * 表示在target trip下,该cooling device才起作用,
                 * 对于power allocater策略必须填target
                 */
                trip = <&target>;
                /* GPU做为cooloing device, THERMAL_NO_LIMIT不起作用,但必须填 */
                cooling-device =
                    <&gpu THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <4096>;/* 计算功耗时乘以4096/1024倍,用于调整降频顺序和尺
度 */
            };
        };
    };
    /* 一个节点对应一个thermal zone,并包含温控策略相关参数,当前thermal zone只用于获取温度
*/
    gpu_thermal: gpu-thermal {
        /* 包含温控策略配置的情况下才起作用,架要求必须填 */
        polling-delay-passive = <100>; /* milliseconds */
        /* 每隔1000ms获取一次温度 */
        polling-delay = <1000>; /* milliseconds */

        /* 当前thermal zone通过tsadc1获取温度 */
        thermal-sensors = <&tsadc 1>;
    };
};
```

См. `Documentation/devicetree/bindings/thermal/thermal.txt` и `Documentation/thermal/power_allocator.txt`.

#### 3.3.1.4 Настройка параметров

Часть параметров определяется чипом и обычно не меняется; остальные подбираются для продукта.

(1) Задайте целевую температуру. Пример: управление начинается выше 70°C с более частым опросом; максимальная желаемая температура — 85°C, сброс — выше 115°C:

```text
thermal_zones: thermal-zones {
    soc_thermal: soc-thermal {
        ....
        trips {
            threshold: trip-point-0 {
                /*
                 * 70度以上温控开始工作,缩短了获取温度的是时间间隔,但不一定⻢上降频,
                 * 还跟sustainable-power有关
                 */
                temperature = <70000>; /* millicelsius */
                hysteresis = <2000>; /* millicelsius */
                type = "passive";
            };
            target: trip-point-1 {
                /* 期望最高温度不超过85度 */
                temperature = <85000>; /* millicelsius */
                hysteresis = <2000>; /* millicelsius */
                type = "passive";
            };
            soc_crit: soc-crit {
                /* 超过115度系统重启 */
                temperature = <115000>; /* millicelsius */
                hysteresis = <2000>; /* millicelsius */
                type = "critical";
            };
        };
    ...
    }
};
```

(2) Выберите cooling device. Если продукт на RK3399 использует CPU и GPU, конфигурация следующая:

```text
thermal_zones: thermal-zones {
    soc_thermal: soc-thermal {
        ...
        /* A53、A72、GPU三个模块都作为cooling device,可通过降频降温 */
        cooling-maps {
            map0 {
                trip = <&target>;
                cooling-device =
                    <&cpu_l0 THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <4096>;
            };
            map1 {
                trip = <&target>;
                cooling-device =
                    <&cpu_b0 THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <1024>;
            };
            map2 {
                trip = <&target>;
                cooling-device =
                    <&gpu THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <4096>;
            };
        };
    ...
    };
};
```

Если используется только CPU:

```text
thermal_zones: thermal-zones {
    soc_thermal: soc-thermal {
        ...
        /* 只有A53、A72两个模块作为cooling device,可通过降频降温 */
        cooling-maps {
            map0 {
                trip = <&target>;
                cooling-device =
                    <&cpu_l0 THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <4096>;
            };
            map1 {
                trip = <&target>;
                cooling-device =
                    <&cpu_b0 THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <1024>;
            };
        };
    ...
    };
};
```

(3) Настройте sustainable-power. Диапазон 70–85°C означает большую доступную мощность при 70°C и её снижение с нагревом. Частота начинает снижаться лишь после достаточно малого power и продолжает снижаться при нагреве. Поэтому превышение 70°C само по себе лишь учащает опрос; момент снижения частоты регулируется sustainable. Пусть управление начинается выше 70°C, ограничение частоты — при 75°C, а максимум — 85°C; это уменьшает колебания частоты при начале регулирования. Сначала приравняйте power при 75°C сумме максимальных мощностей всех cooling device, затем постепенно уменьшайте и проверяйте. Мощность состоит из статической и динамической частей; формулы:

Статическая мощность: a, b, c, d, C — константы DTSI, обычно сохраняемые по умолчанию; T — температура, V — напряжение по условиям. Динамическая мощность: C — константа DTSI по умолчанию, V — напряжение, F — частота по условиям. Далее исходные формулы и комментарии.

```text
静态功耗公式:
    /* a、b、c、d、C是常量,在DTSI中配置,保持默认值即可,T是温度,V是电压,需要根据实际情况调
整 */
    t_scale = (a * T^3) + (b * T^2) + (c * T) + d
    v_scale = V^3
    P(s)= C * T_scale * V_scale
动态功耗公式:
    /* C是常量,在DTSI中配置,保持默认值即可,V是电压,F是频率,需要根据实际情况调整 */
    P(d)= C * V^2 * F
```

Пример RK3399: A53, A72 и GPU работают и ограничиваются; максимумы — 1416MHz/1125mV, 1800MHz/1200mV и 800MHz/1100mV соответственно. Расчёт:

Динамическая мощность A53: dynamic-power-coefficient C=100, V=1125mV, F=1416MHz, четыре ядра. A72: C=436, V=1200mV, F=1800MHz, два ядра. GPU: dynamic-coefficient C=733, V=1100mV, F=800MHz. Статическая мощность GPU: static-coefficient=411000, ts=<32000 4700 -80 2>, то есть C=411000, a=2, b=-80, c=4700, d=32000, T=75000mC при начале ограничения, V=1100mV. Источник учитывает статическую мощность только GPU и предлагает для удобства считать эти примеры в Excel.

```text
A53 动态功耗:C = 100(dynamic-power-coefficient配置为100),V = 1125mV,F = 1416MHz,
四核
    P_d_a53 = 100 * 1125 * 1125 * 1416 * 4 / 1000000000 = 716 mW

A72 动态功耗:C = 436(dynamic-power-coefficient配置为436),V = 1200mV,F = 1800MHz,
双核
    P_d_a72 = 436 * 1200 * 1200 * 1800 * 2 / 1000000000 = 2260 mW

GPU 动态功耗:C = 733(dynamic-coefficient配置为733),V = 1100mV,F = 800MHz
    P_d_gpu = 733 * 1100 * 1100 * 800 / 1000000000 = 709 mW

GPU 静态功耗:DTSI中static-coefficient配置为411000,ts配置为32000 4700 -80 2,则C =
411000,
a = 2,b = -80,c = 4700,d = 32000,温度为开始降频的温度值T = 75000mC,V = 1100mV
    t_scale = ( 2 * 75000 * 75000 * 75000 / 1000000 ) + ( -80 * 75000 * 75000 /
1000) +
    ( 4700 * 75000 ) + 32000 * 1000 =  778250
    v_scale = 1100 * 1100 * 1100 / 1000000 = 1331
    P_s_gpu = 411000 * 778250 / 1000000 * 1331 / 1000000 = 425mW

    P_max = P_d_a53 + P_d_a72 + P_d_gpu + P_s_gpu = 4110mW

    注意:当前只有GPU有计算静态功耗;当前只是列出计算方法,实际上通过exel表格计算比较方便;
```

Чтобы снижение частоты начиналось после 75°C, приравняйте мощность при 75°C максимальной, затем вычислите sustainable:

```text
sustainable + 2 * sustainable / (target- threshold) * (target- 75) = P_75
sustainable + 2 * sustainable / (85 - 70) * (85 - 75) = 4110
sustainable = 1761mW
```

Сначала задайте sustainable-power=1761 в DTSI. Испытайте сценарии Antutu, Geekbench и другие, соберите trace, проанализируйте частоту и температуру непосредственно либо графиками lisa. Если результат не соответствует ожиданиям, уменьшайте значение и повторяйте настройку.

(4) Настройте contribution: оно меняет порядок и степень снижения частоты. Даже без явной настройки используется 1024. Если при полной нагрузке A53 и A72 в жарких условиях A53 ограничивается раньше, а нужно приоритетно ограничивать A72, увеличьте contribution A53:

```text
thermal_zones: thermal-zones {
    soc_thermal: soc-thermal {
        ...
        cooling-maps {
            map0 {
                trip = <&target>;
                cooling-device =
                    <&cpu_l0 THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <4096>; /* 从默认值1024,改为4096 */
            };
            map1 {
                trip = <&target>;
                cooling-device =
                    <&cpu_b0 THERMAL_NO_LIMIT THERMAL_NO_LIMIT>;
                contribution = <1024>;
            };
        };
    ...
    };
};
```

(5) Соберите trace для анализа. Сначала включите соответствующие параметры menuconfig:

```text
Kernel hacking  --->
    [*] Tracers  --->
        --- Tracers
        [ ]   Kernel Function Tracer
        [ ]   Enable trace events for preempt and irq disable/enable
        [ ]   Interrupts-off Latency Tracer
        [ ]   Preemption-off Latency Tracer
        [ ]   Scheduling Latency Tracer
        [*]   Trace process context switches and events
        [ ]   Trace syscalls
        [ ]   Create a snapshot trace buffer
        Branch Profiling (No branch profiling)  --->
        [ ]   Trace max stack
        [ ]   Support for tracing block IO actions
        [ ]   Add tracepoint that benchmarks tracepoints
        < >   Ring buffer benchmark stress tester
        [ ]   Ring buffer startup self test
        [ ]   Show enum mappings for trace events
        [*]   Trace gpio events
```

Способ 1: trace-cmd из пакета lisa; установку lisa см. в её документации. Через adb перенесите trace-cmd на плату и запишите тепловые события:

```text
/* -b指定缓存的大小,单位是Kb,不同的平台DDR容量不一样,可能需要调整 */
trace-cmd record -e thermal -e thermal_power_allocator -b 102400
```

Ctrl+C останавливает запись. В текущем каталоге появляется trace.dat; преобразуйте формат:

```text
trace-cmd report trace.dat > trace.txt
```

Через adb скопируйте файл на ПК и анализируйте напрямую либо в lisa. Можно перенести trace.dat и преобразовать его в trace.txt на ПК.

Способ 2: без trace-cmd включите события командами:

```text
echo 1 > /sys/kernel/debug/tracing/events/thermal/enable
echo 1 > /sys/kernel/debug/tracing/events/thermal_power_allocator/enable
echo 1 > /sys/kernel/debug/tracing/tracing_on
```

Выведите trace и сохраните в файл:

```text
cat /sys/kernel/debug/tracing/trace
```

Либо заберите файл непосредственно через adb:

```text
/* 获取数据后,可以直接打开trace.txt进行分析,或者使用lisa工具分析 */
adb pull /sys/kernel/debug/tracing/trace ./trace.txt
```

Другие операции:

```text
echo 0 > /sys/kernel/debug/tracing/tracing_on  /* 暂停抓取数据 */
echo 0 > /sys/kernel/debug/tracing/trace       /* 清空之前的数据 */
```

#### 3.3.2 RK3576

CPU настраивается по предыдущему примеру; коэффициент динамической мощности обычно не меняется. Для GPU статическая мощность не вычисляется, power_model не нужен, настройка аналогична CPU:

```text
gpu: gpu@27800000 {
    ...
    #cooling-cells = <2>;                  /* cooling device标识,表示该设备可以作为一
个cooling device */
    dynamic-power-coefficient = <1625>;    /* 用于计算动态功耗的参数 */
    status = "disabled";
};
```

Thermal Zone и параметры регулируются как в примере. Для расчёта sustainable-power максимумы малых ядер, больших ядер и GPU равны 2208MHz/950mV, 2304MHz/950mV и 950MHz/850mV:

Динамическая мощность: C — обычно неизменная константа DTSI, V — напряжение, F — частота по реальным условиям.

```text
动态功耗公式:
    /* C是常量,在DTSI中配置,保持默认值即可,V是电压,F是频率,需要根据实际情况调整 */
    P(d)= C * V^2 * F
```

Первый кластер источник называет A53: dynamic-power-coefficient C=120, V=950mV, F=2208MHz, четыре ядра. Второй — A72: C=320, V=950mV, F=2304MHz, четыре ядра. GPU: C=1625, V=850mV, F=950MHz. Это методика расчёта; источник предлагает Excel. Названия ядер не исправлены без проверки.

```text
A53 动态功耗:C = 120(dynamic-power-coefficient配置为120),V = 950mV,F = 2208MHz,四
核
    P_d_a53 = 120 * 950 * 950 * 2208 * 4 / 1000000000 = 957 mW

A72 动态功耗:C = 320,V = 950mV,F = 2304MHz,四核
    P_d_a72 = 320 * 950 * 950 * 2304 * 4 / 1000000000 = 2662 mW

GPU 动态功耗:C = 1625,V = 850mV,F = 950MHz
    P_d_gpu = 1625 * 850 * 850 * 950 / 1000000000 = 1115 mW

    P_max = P_d_a53 + P_d_a72 + P_d_gpu = 4734mW

    注意:当前只是列出计算方法,实际上通过exel表格计算比较方便;
```

Если управление должно начинаться выше 75°C с учащением опроса, частота — снижаться после 77°C, а максимум — 85°C, то threshold=75, target=85. Мощность при 77°C можно приравнять максимальной и вычислить sustainable следующими исходными формулами:

```text
sustainable + 2 * sustainable / (target- threshold) * (target- 77) = P_max
sustainable + 2 * sustainable / (85 - 70) * (85 - 77) = 4734
sustainable = 1353mW
```

Сначала задайте sustainable-power=1353 в DTSI. Испытайте Antutu, Geekbench и другие сценарии, соберите trace и проверьте изменение частоты/температуры напрямую или графиками lisa. При несоответствии корректируйте значение до нужного результата.

## 4. Интерфейс userspace

Интерфейсы `/sys/class/thermal/` соответствуют узлам thermal zone в DTSI. Один дочерний узел даёт каталог thermal_zone0; два — thermal_zone0 и thermal_zone1. Через них можно менять governor, читать температуру и т.д. Пример типичных данных `/sys/class/thermal/thermal_zone0/` для RK3399:

Описание полей: `temp` — текущая температура; `available_policies` — поддерживаемые регуляторы, `policy` — текущий регулятор. `sustainable_power` — мощность, соответствующая желаемой максимальной температуре. `integral_cutoff` задаёт условие включения интегральной составляющей PID: текущая температура минус желаемая максимальная температура должна быть меньше `integral_cutoff`. `k_d` и `k_i` — параметры составляющих D и I; `k_po` и `k_pu` — параметры P. При `mode=enabled` температура периодически измеряется для определения необходимости снижения частоты; `disabled` отключает эту функцию. `type` обозначает тип thermal zone. Поля `trip_point_0_*`, `trip_point_1_*` и `trip_point_2_*` соответствуют порогам узла `trips`. Состояния cooling device соответствуют `cooling-maps`: `cdev0` обозначает одно устройство, а некоторые платформы также предоставляют `cdev1`, `cdev2` и т. д. Его `cur_state` — текущая частотная ступень, `max_state` — максимальное число ступеней согласно описанию источника, `type` — тип устройства. `cdev0_weight` — множитель при расчёте мощности этого cooling device. Ниже сохранены исходные поля и комментарии.

```text
temp                                /* 当前温度 */
available_policies                  /* 支持的温控策略 */
policy                              /* 当前使用的温控策略 */
sustainable_power                   /* 期望的最高温度下对应的power值 */
integral_cutoff                     /* PID算法中I的触发条件:当前温度-期望的最高温度
<integral_cutoff */
k_d                                 /* PID算法中计算D的时候用的参数 */
k_i                                 /* PID算法中计算I的时候用的参数 */
k_po                                /* PID算法中计算P的时候用的参数 */
k_pu                                /* PID算法中计算P的时候用的参数 */
mode                                /* enabled:自带定时获取温度,判断是否需要降频。
disabled关闭该功能 */
type                                /* 当前thermal zone的类型 */
/* 不同的温度阈值,对应trips节点的配置 */
trip_point_0_hyst
trip_point_0_temp
trip_point_0_type
trip_point_1_hyst
trip_point_1_temp
trip_point_1_type
trip_point_2_hyst
trip_point_2_temp
trip_point_2_type
/* 不同cooling devic的状态,对应cooling-maps节点的配置 */
cdev0                               /* 代表一个cooling devic,有的平台还有cdev1、
cdev2等 */
    cur_state                   /* 该cooling device当前频率的档位 */
    max_state                   /* 该cooling device最多有几个档位 */
    type                        /* 该cooling device的类型 */
cdev0_weight                        /* 该cooling devic在计算power时扩大的倍数 */
```

См. `Documentation/thermal/sysfs-api.txt`.

## 5. Частые вопросы

### 5.1 Отключение терморегулирования

Способ 1: выберите user_space как governor по умолчанию в menuconfig.

```text
<*> Generic Thermal sysfs driver  --->
    --- Generic Thermal sysfs driver
    [*]   APIs to parse thermal data out of device tree
    [*]   Enable writable trip points
        Default Thermal governor (user_space)  --->  /* power_allocator改为
user_space */
```

Способ 2: после загрузки переключите policy в user_space или mode в disabled. Затем снимите ограничение, задав cur_state=0 для всех cdev в userspace. Пример RK3399, переход в user_space:

```text
echo user_space > /sys/class/thermal/thermal_zone0/policy
```

Либо отключите mode:

```text
echo disabled > /sys/class/thermal/thermal_zone0/mode
```

Снимите ограничение частоты:

```text
/* 具体有多少个cdev,根据实际情况修改 */
echo 0 > /sys/class/thermal/thermal_zone0/cdev0/cur_state
echo 0 > /sys/class/thermal/thermal_zone0/cdev1/cur_state
echo 0 > /sys/class/thermal/thermal_zone0/cdev2/cur_state
```

### 5.2 Чтение текущей температуры

Читайте temp в thermal_zone0 или thermal_zone1. Для температуры CPU RK3399 введите в консоли:

```text
cat /sys/class/thermal/thermal_zone0/temp
```

Для температуры GPU введите:

```text
cat /sys/class/thermal/thermal_zone1/temp
```

{% endraw %}
