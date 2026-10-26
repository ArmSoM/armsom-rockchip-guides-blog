---
title: "Rockchip Thermal: Temperaturregelung, Power Allocator und RK3576"
description: "Rockchip Thermal: Temperaturregelung, Power Allocator und RK3576 — V1.2.0 / V1.1.1"
excerpt: "Rockchip Thermal: Temperaturregelung, Power Allocator und RK3576"
translation_key: "145-rockchip-thermal"
slug: "145-rockchip-thermal"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: [ArmSoM, Rockchip, Thermal, RK3576, RK3399]
---

{% raw %}

# Rockchip Thermal: Temperaturregelung, Power Allocator und RK3576

Alle Sprachen folgen Chinesisch V1.2.0 (19 Seiten), ergänzt um eigenständige Angaben aus Englisch V1.1.1 (21 Seiten). Beispiele außer RK3576 gelten für Linux4.4/4.19, RK3576 für Linux6.1; neue Abschnitte 3.2.2 und 3.3.2 bleiben vollständig erhalten. ArmSoM-Plattformreferenz: Board/SoC, BSP, PMIC-Verdrahtung und Kühlung prüfen. Weder Unterstützung aller Boards noch Sicherheit dieser Temperaturgrenzen sind bestätigt. Chinesisch nutzt die chinesische Architekturabbildung, EN/RU/DE die englische Originalgrafik. Alle Berechnungen stammen aus der Quelle; keine Hardwaretests ausgeführt.

> Quellenprobleme bleiben sichtbar: Im chinesischen Pfad power_allocator. fehlt c, Englisch nennt power_allocator.c. Das RK3576-Beispiel bezeichnet Kerne weiterhin als A53/A72; trotz threshold=75 steht in der Rechnung 85−70, und 1353mW folgt nicht aus der gezeigten Gleichung. Auch der RK3399-Ausdruck t_scale muss mit dem Ergebnis 778250 abgeglichen werden. Originalwerte bleiben unverändert und dürfen nicht ungeprüft für die thermische Produktauslegung dienen. Abschalten der Regelung bleibt ausschließlich Quellenmaterial zur Fehlersuche, keine Empfehlung für Normalbetrieb; keine Befehle ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Überblick

Thermal ist ein Kernel-Framework zur Temperaturregelung über einen festgelegten Governor und zum Schutz vor Überhitzung. Es besteht aus Governor, Core, Cooling Device und Sensortreiber. Die Softwarearchitektur ist unten dargestellt.

![Thermal-Softwarearchitektur (englisches Original)](/docs/rockchip-thermal/assets/en-p005-figure-01.png)

Thermal-Softwarearchitektur (englisches Original)

Der Thermal Governor entscheidet, ob und wie stark ein Cooling Device heruntergetaktet wird. Für Linux4.4 nennt die Quelle:

- power_allocator: PID-Regelung verteilt temperaturabhängig Leistung und setzt diese in Frequenzgrenzen um.
- step_wise: senkt die Frequenz schrittweise abhängig von der Temperatur.
- fair share: reduziert bevorzugt Geräte mit mehr Frequenzstufen.
- userspace: der chinesische Text sagt „begrenzt die Frequenz nicht“; der englische ergänzt „benachrichtigt lediglich den Userspace über thermische Ereignisse“.

Thermal Core abstrahiert Governor und Treiber und definiert Schnittstellen. Der Thermal Sensor Driver erfasst die Temperatur, beispielsweise tsadc. Ein Thermal Cooling Device ist eine Wärmequelle oder kühlende Einrichtung, etwa CPU, GPU oder DDR.

## 2. Quellpfade

Governor-Code:

```text
drivers/thermal/power_allocator.    /* power allocator温控策略 */
drivers/thermal/step_wise.c         /* step wise温控策略 */
drivers/thermal/fair_share.c        /* fair share温控策略 */
drivers/thermal/user_space.c        /* userspace温控策略 */
```

Cooling-Device-Code:

```text
drivers/thermal/devfreq_cooling.c
drivers/thermal/cpu_cooling.c
```

Core-Code:

```text
drivers/thermal/thermal_core.c
```

Treiber-Code:

```text
drivers/thermal/rockchip_thermal.c    /* 除了RK3368外的其他平台的tsadc驱动 */
drivers/thermal/rk3368_thermal.c      /* RK3368平台tsadc驱动 */
```

## 3. Konfiguration

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

Über Default Thermal governor wird die Regelstrategie entsprechend den Produktanforderungen gewählt.

### 3.2 Tsadc-Konfiguration

#### 3.2.1 Beispielkonfiguration

Tsadc dient als Temperatursensor. Normalerweise sind DTSI und DTS zu konfigurieren. DTSI-Beispiel für RK3399:

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

DTS wählt CRU- oder GPIO-Reset sowie aktiven niedrigen oder hohen Pegel. Für GPIO muss der tsadc-Ausgang physisch mit dem Reset-Eingang des PMIC verbunden sein; andernfalls ist CRU zu verwenden.

```text
&tsadc {
    rockchip,hw-tshut-mode = <1>;        /* tshut mode 0:CRU 1:GPIO */
    rockchip,hw-tshut-polarity = <1>;    /* tshut polarity 0:LOW 1:HIGH */
    status = "okay";
};
```

Siehe `Documentation/devicetree/bindings/thermal/rockchip-thermal.txt`.

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

Bei rockchip,hw-tshut-mode=CRU werden pinctrl-names, pinctrl-0 und pinctrl-1 nicht benötigt; die Quelle empfiehlt CRU. Für GPIO sind diese drei Eigenschaften erforderlich:

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

### 3.3 Power-Allocator-Konfiguration

Power Allocator verwendet PID-Regelung, um Cooling Devices temperaturabhängig Leistung zuzuweisen. Bei niedriger Temperatur ist mehr Leistung und damit eine höhere Frequenz möglich. Mit steigender Temperatur sinken Leistung und Frequenz, um die Erwärmung zu begrenzen.

#### 3.3.1 Beispielkonfiguration

#### 3.3.1.1 CPU

Eine CPU als Cooling Device benötigt #cooling-cells und dynamic-power-coefficient im Knoten. RK3399-Beispiel:

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

Eine GPU als Cooling Device benötigt #cooling-cells und den Unterknoten power_model. RK3399-Beispiel:

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

Ein Thermal-Zone-Knoten konfiguriert Regelparameter und erzeugt die entsprechenden Userspace-Schnittstellen. RK3399-Beispiel:

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

Siehe `Documentation/devicetree/bindings/thermal/thermal.txt` und `Documentation/thermal/power_allocator.txt`.

#### 3.3.1.4 Regelparameter einstellen

Einige Parameter sind chipspezifisch und bleiben gewöhnlich unverändert; andere werden an das Produkt angepasst.

(1) Zieltemperaturen festlegen. Beispiel: Regelbeginn oberhalb 70°C mit häufigerer Abfrage, gewünschtes Maximum 85°C und Neustart oberhalb 115°C:

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

(2) Cooling Devices bestimmen. Nutzt ein RK3399-Produkt CPU und GPU, gilt folgendes Beispiel:

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

Wird nur die CPU verwendet:

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

(3) sustainable-power einstellen. Der Bereich 70–85°C bedeutet hohe verfügbare Leistung bei 70°C und sinkende Leistung bei Erwärmung. Erst unterhalb eines bestimmten power-Werts beginnt die Frequenzsenkung; bei weiterer Erwärmung sinken beide weiter. Oberhalb 70°C wird daher zunächst nur häufiger gemessen; sustainable bestimmt den Beginn der Drosselung. Angenommen, Regelbeginn ist über 70°C, Drosselbeginn bei 75°C und Maximum 85°C; dies reduziert anfängliche Frequenzschwankungen. Zunächst power bei 75°C gleich der Summe der maximalen Leistungen aller Cooling Devices setzen, danach schrittweise reduzieren und prüfen. Die Leistung besteht aus statischem und dynamischem Anteil; Formeln:

Statische Leistung: a, b, c, d und C sind DTSI-Konstanten, gewöhnlich unverändert; T ist Temperatur und V Spannung entsprechend dem Einsatz. Dynamische Leistung: C ist eine DTSI-Konstante, V Spannung und F Frequenz nach tatsächlichen Bedingungen. Es folgen Originalformeln und Kommentare.

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

RK3399-Beispiel: A53, A72 und GPU arbeiten und werden begrenzt; ihre Maxima sind 1416MHz/1125mV, 1800MHz/1200mV und 800MHz/1100mV. Berechnung:

A53 dynamisch: dynamic-power-coefficient C=100, V=1125mV, F=1416MHz, vier Kerne. A72: C=436, V=1200mV, F=1800MHz, zwei Kerne. GPU dynamisch: dynamic-coefficient C=733, V=1100mV, F=800MHz. GPU statisch: static-coefficient=411000 und ts=<32000 4700 -80 2>, also C=411000, a=2, b=-80, c=4700, d=32000, T=75000mC bei Drosselbeginn, V=1100mV. Die Quelle berücksichtigt statische Leistung nur für die GPU und empfiehlt zur bequemeren Berechnung eine Excel-Tabelle.

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

Für Drosselbeginn oberhalb 75°C zunächst die Leistung bei 75°C der Maximalleistung gleichsetzen und sustainable berechnen:

```text
sustainable + 2 * sustainable / (target- threshold) * (target- 75) = P_75
sustainable + 2 * sustainable / (85 - 70) * (85 - 75) = 4110
sustainable = 1761mW
```

In DTSI zunächst sustainable-power=1761 setzen. Antutu, Geekbench und weitere Szenarien testen, Trace erfassen und Frequenz/Temperatur direkt oder mit lisa-Diagrammen analysieren. Bei Abweichungen den Wert verringern und erneut abstimmen.

(4) contribution einstellen: Damit lassen sich Reihenfolge und Stärke der Frequenzsenkung beeinflussen. Ohne Angabe gilt 1024. Wird bei hoher Umgebungstemperatur und Volllast von A53 und A72 die A53 früher gedrosselt, soll aber A72 bevorzugt gedrosselt werden, contribution der A53 erhöhen:

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

(5) Trace-Daten analysieren. Zunächst die entsprechenden Menuconfig-Optionen aktivieren:

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

Methode 1: trace-cmd aus dem lisa-Paket; zur Installation die lisa-Dokumentation beachten. trace-cmd per adb auf das Zielboard übertragen und thermische Ereignisse aufzeichnen:

```text
/* -b指定缓存的大小,单位是Kb,不同的平台DDR容量不一样,可能需要调整 */
trace-cmd record -e thermal -e thermal_power_allocator -b 102400
```

Ctrl+C stoppt die Aufzeichnung. Im aktuellen Verzeichnis entsteht trace.dat; Format konvertieren:

```text
trace-cmd report trace.dat > trace.txt
```

Die Datei per adb auf den PC kopieren und direkt oder mit lisa analysieren. Alternativ trace.dat übertragen und dort in trace.txt umwandeln.

Methode 2: Ohne trace-cmd die Ereignisse per Befehl aktivieren:

```text
echo 1 > /sys/kernel/debug/tracing/events/thermal/enable
echo 1 > /sys/kernel/debug/tracing/events/thermal_power_allocator/enable
echo 1 > /sys/kernel/debug/tracing/tracing_on
```

Trace ausgeben und in einer Datei speichern:

```text
cat /sys/kernel/debug/tracing/trace
```

Oder die Datei direkt per adb übertragen:

```text
/* 获取数据后,可以直接打开trace.txt进行分析,或者使用lisa工具分析 */
adb pull /sys/kernel/debug/tracing/trace ./trace.txt
```

Weitere Operationen:

```text
echo 0 > /sys/kernel/debug/tracing/tracing_on  /* 暂停抓取数据 */
echo 0 > /sys/kernel/debug/tracing/trace       /* 清空之前的数据 */
```

#### 3.3.2 RK3576

CPU-Konfiguration wie im Beispiel; der dynamische Leistungskoeffizient bleibt normalerweise unverändert. Für die GPU wird keine statische Leistung berechnet, power_model entfällt; Konfiguration wie bei der CPU:

```text
gpu: gpu@27800000 {
    ...
    #cooling-cells = <2>;                  /* cooling device标识,表示该设备可以作为一
个cooling device */
    dynamic-power-coefficient = <1625>;    /* 用于计算动态功耗的参数 */
    status = "disabled";
};
```

Thermal Zone und Regelparameter wie im Beispiel einstellen. Für sustainable-power betragen die Maxima kleiner Kerne, großer Kerne und GPU 2208MHz/950mV, 2304MHz/950mV und 950MHz/850mV:

Dynamische Leistung: C ist die gewöhnlich unveränderte DTSI-Konstante, V Spannung und F Frequenz nach tatsächlichen Bedingungen.

```text
动态功耗公式:
    /* C是常量,在DTSI中配置,保持默认值即可,V是电压,F是频率,需要根据实际情况调整 */
    P(d)= C * V^2 * F
```

Die Quelle bezeichnet den ersten Cluster als A53: dynamic-power-coefficient C=120, V=950mV, F=2208MHz, vier Kerne. Den zweiten als A72: C=320, V=950mV, F=2304MHz, vier Kerne. GPU: C=1625, V=850mV, F=950MHz. Die Quelle zeigt nur das Rechenverfahren und empfiehlt Excel; die Kernbezeichnungen bleiben bis zur Prüfung unverändert.

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

Soll die Regelung oberhalb 75°C mit häufigerer Messung beginnen, die Frequenz erst nach 77°C sinken und 85°C nicht überschreiten, gilt threshold=75, target=85. Die Leistung bei 77°C kann der Maximalleistung gleichgesetzt werden; sustainable folgt aus den folgenden Originalformeln:

```text
sustainable + 2 * sustainable / (target- threshold) * (target- 77) = P_max
sustainable + 2 * sustainable / (85 - 70) * (85 - 77) = 4734
sustainable = 1353mW
```

In DTSI zunächst sustainable-power=1353 setzen. Antutu, Geekbench und weitere Szenarien testen, Trace erfassen und Frequenz/Temperatur direkt oder mit lisa-Diagrammen prüfen. Bei Abweichungen den Wert anpassen, bis das Ergebnis passt.

## 4. Userspace-Schnittstelle

Die Schnittstellen unter `/sys/class/thermal/` entsprechen den Thermal-Zone-Knoten in DTSI. Ein Unterknoten erzeugt thermal_zone0, zwei erzeugen thermal_zone0 und thermal_zone1. Darüber lassen sich Governor wechseln, Temperaturen lesen usw. Typische Einträge unter `/sys/class/thermal/thermal_zone0/` beim RK3399:

Feldbeschreibungen: `temp` ist die aktuelle Temperatur; `available_policies` nennt die unterstützten Regler und `policy` den aktuellen Regler. `sustainable_power` bezeichnet die Leistung bei der gewünschten Höchsttemperatur. `integral_cutoff` legt die Bedingung für den I-Anteil des PID-Reglers fest: Aktuelle Temperatur minus gewünschte Höchsttemperatur muss kleiner als `integral_cutoff` sein. `k_d` und `k_i` sind Parameter für D und I; `k_po` und `k_pu` sind P-Parameter. Bei `mode=enabled` wird die Temperatur regelmäßig erfasst, um über eine Frequenzsenkung zu entscheiden; `disabled` schaltet diese Funktion aus. `type` bezeichnet den Typ der Thermal Zone. Die Felder `trip_point_0_*`, `trip_point_1_*` und `trip_point_2_*` entsprechen den Schwellenwerten unter `trips`. Die Zustände der Cooling Devices entsprechen `cooling-maps`: `cdev0` steht für ein Gerät; manche Plattformen stellen auch `cdev1`, `cdev2` usw. bereit. Dessen `cur_state` ist die aktuelle Frequenzstufe, `max_state` laut Quellenbeschreibung die maximale Anzahl der Stufen und `type` der Gerätetyp. `cdev0_weight` ist der Faktor bei der Leistungsberechnung dieses Cooling Devices. Die ursprüngliche Feldliste samt Kommentaren bleibt nachfolgend erhalten.

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

Siehe `Documentation/thermal/sysfs-api.txt`.

## 5. Häufige Fragen

### 5.1 Temperaturregelung abschalten

Methode 1: In Menuconfig user_space als Standard-Governor wählen.

```text
<*> Generic Thermal sysfs driver  --->
    --- Generic Thermal sysfs driver
    [*]   APIs to parse thermal data out of device tree
    [*]   Enable writable trip points
        Default Thermal governor (user_space)  --->  /* power_allocator改为
user_space */
```

Methode 2: Nach dem Start policy auf user_space oder mode auf disabled setzen. Anschließend die Frequenzbegrenzung aufheben, indem cur_state aller cdev im Userspace auf 0 gesetzt wird. RK3399-Beispiel für user_space:

```text
echo user_space > /sys/class/thermal/thermal_zone0/policy
```

Alternativ mode deaktivieren:

```text
echo disabled > /sys/class/thermal/thermal_zone0/mode
```

Frequenzbegrenzung aufheben:

```text
/* 具体有多少个cdev,根据实际情况修改 */
echo 0 > /sys/class/thermal/thermal_zone0/cdev0/cur_state
echo 0 > /sys/class/thermal/thermal_zone0/cdev1/cur_state
echo 0 > /sys/class/thermal/thermal_zone0/cdev2/cur_state
```

### 5.2 Aktuelle Temperatur lesen

temp unter thermal_zone0 oder thermal_zone1 lesen. Für die CPU-Temperatur beim RK3399 in der Konsole eingeben:

```text
cat /sys/class/thermal/thermal_zone0/temp
```

Für die GPU-Temperatur eingeben:

```text
cat /sys/class/thermal/thermal_zone1/temp
```

{% endraw %}
