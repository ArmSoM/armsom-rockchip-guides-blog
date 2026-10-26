---
title: "Rockchip Linux Pinctrl: vollständiger Leitfaden zu GPIO, IOMUX, Treiberstärke und DTS"
description: "Rockchip Linux Pinctrl: vollständiger Leitfaden zu GPIO, IOMUX, Treiberstärke und DTS — V1.0.0; Linux 4.19/5.10."
translation_key: "116-rockchip-linux-pinctrl"
slug: "116-rockchip-linux-pinctrl"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, Pinctrl, GPIO, IOMUX]
excerpt: "Rockchip Linux Pinctrl: vollständiger Leitfaden zu GPIO, IOMUX, Treiberstärke und DTS — V1.0.0; Linux 4.19/5.10."
---

{% raw %}

Dieser PIN-CTRL- und DTS-Leitfaden verwendet vereinbarungsgemäß Chinesisch V1.0.0 als gemeinsame Grundlage und übersetzt dessen Zusatzinhalte. Chinesische ID RK-KF-YF-200, englische ID RK-KF-YF-136. Geltungsbereich: Linux-4.19 auf RK3568/RK3399/RK3368/RK3288/PX30/RK3128/RK3126/RV1126; Linux-5.10 auf RK3588/RV1106. Plattformreferenz: Pins des ArmSoM-Boards, VCCIO, SDK/BSP, Kernel und TRM prüfen. Keine Hardwarevalidierung. Die Abbildung stammt aus dem englischen PDF.

> Konflikte bleiben erhalten: chinesischer Pin-Index je Port 0–7, englischer 0–31. Chinesisch nennt mA vor RK3399 und Level nach RK1808, Englisch mA vor RK1808 und Level ab RK3399. Der Haupttext bewahrt die chinesische Formulierung, bestätigt jedoch kein Chipverhalten: konkretes TRM und Treiber prüfen. Chinesische Ergänzungen zu Treibern, SMT, init, PWM und FAQ 4.2/4.3 sind übersetzt. rockchip,pin im Singular, 2cm0 und die init/default-Klammer bleiben ungeklärt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1 Regeln zur Pinbenennung

Die Rockchip-Pin-ID besteht aus Controller (bank), Port (port) und Pin-Index (pin).

### 1.1 GPIO

Die Anzahl der Banks entspricht der Anzahl der GPIO-Controller. Ports sind A, B, C und D; der Index innerhalb eines Ports ist 0, 1, 2, 3, 4, 5, 6 oder 7. Kapitel 20 GPIO in RK3588-TRM.pdf nennt beispielsweise fünf GPIOs: GPIO0 in PD_PMU, GPIO1/GPIO2/GPIO3/GPIO4 in PD_BUS. Jeder der fünf Controller steuert 32 IOs. Im GPIO-Modus bestimmen GPIO-Controllerregister das Portverhalten.

### 1.2 IOMUX

Ein Rockchip-Pin unterstützt mehrere Funktionen. Alternative Pinrouten eines Controllers heißen meist m0, m1, m2 usw. Zwei I2C-Routen heißen im Quelltext beispielsweise 2cm0 und i2cm1 (Schreibweise beibehalten). Pinmux-Register liegen in GRF/PMUGRF, beim RK3588 IOC genannt. Unten steht das RK3588-Beispiel; anschließend folgt I2C5 IOMUX.

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

![RK3588-I2C5-Routen, englische Originalabbildung](/docs/rockchip-linux-pinctrl/assets/en-p006-figure-01.png)

*RK3588-I2C5-Routen, englische Originalabbildung*

Mehrere Routen ermöglichen flexibleres Hardwaredesign: Für Peripherie mit 1.8V oder 3.3V können Pins verschiedener VCCIO-Spannungsdomänen gewählt werden. Hinweis: Die Routenauswahl im Register wirkt auf RX-, nicht auf TX-Pins.

### 1.3 PULL

Der Bias eines Rockchip-IO-PAD unterstützt normalerweise drei Modi: `bias-disable`, `bias-pull-up`, `bias-pull-down`. Die Einstellung wirkt auf das IO PAD und gilt deshalb sowohl für GPIO als auch für IOMUX.

### 1.4 DRIVE-STRENGTH

Die unterstützte IO-PAD-Treiberstärke hängt vom Fertigungsprozess ab. Laut chinesischer Quelle verwenden Chips vor RK3399 mA und Chips nach RK1808 meist Level, dessen Zahlenwert dem Registerwert entspricht. Beispiel GPIO0_C7 aus dem RK3588-TRM (gpio0c7_ds, GPIO0C7 DS control Driver Strength Selection):

```text
3'b000: 100ohm
3'b100: 66ohm
```

Die übrigen Treiberstärken und ihre Level-Zuordnungen stehen unten. In DTS wählt `drive-strength=<5>;` Level5 und schreibt `3'b101` in das Register.

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

### 1.5 SMT (Schmitt-Trigger)

Die meisten Rockchip-Chips unterstützen IO-PAD-SMT, standardmäßig deaktiviert. Aktivierung unterdrückt Flankenjitter, erweitert den VIH/VIL-Spannungsabstand und verbessert die Signalstabilität. Für I2C-SCL/SDA ist SMT üblicherweise standardmäßig aktiv.

## 2 Treibereinführung

Rockchip pinctrl besteht aus dem Pinctrl-Treiber (`drivers/pinctrl/pinctrl-rockchip.c`) und GPIO-Treiber (`drivers/gpio/gpio-rockchip.c`). Pinctrl ist der Haupttreiber mit IO-Operationen für PINMUX, PINCONF und GPIO. Der GPIO-Treiber implementiert gpiochip einschließlich GPIO und IRQ.

### 2.1 pinctrl-rockchip

`//TO-DO` — die Quelle enthält hier keine Implementierungsdetails.

### 2.2 gpio-rockchip

`//TO-DO` — die Quelle enthält hier keine Implementierungsdetails.

## 3 DTS-Einführung

Rockchip-DTS-Dateien platzieren den pinctrl-Knoten normalerweise in soc.dtsi, etwa rk3588s.dtsi, meist als letzten Knoten.

Der pinctrl-Knoten besitzt kein reg und ist kein gewöhnliches platform device. Die Registerbasis wird über `rockchip,grf=<&grf>;` übergeben; der Treiber addiert Offsets zur Konfiguration von IOMUX und PINCONF. GPIO verwendet die reg-Adresse des gpio-Knotens. Beispiel: `arch/arm64/boot/dts/rockchip/rk3588s.dtsi`.

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

Zusätzlich wird `arch/arm64/boot/dts/rockchip/rk3588s-pinctrl.dtsi` in rk3588s.dtsi eingebunden.

### 3.1 pinctrl-Instanzen erstellen

rk3588s-pinctrl.dtsi zählt bereits alle RK3588s-IOMUX-Instanzen auf; Module benötigen normalerweise keine neuen. Neue Instanzen müssen folgende Regeln erfüllen:

1. Unter dem pinctrl-Knoten anlegen.

2. In der Form function + group hinzufügen.

3. Das Format function + group lautet:

```text
function {
    group {
        rockchip,pin = <bank gpio func &ref>;
    };
};
```

4. Die übrigen DTS-Grundregeln beachten.

### 3.2 pinctrl referenzieren

Ein Modul referenziert pinctrl über pinctrl-names und pinctrl-0 und wird damit mit dem pinctrl-Treiber verknüpft. Beispiel RK3588 uart2:

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

uart2m1_xfer ist eine pinctrl-Gruppe. Ein Modul kann mehrere Gruppen gleichzeitig referenzieren. Beispiel RK3588 pdm1:

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

pinctrl-names unterstützt mehrere Zustände. Pinctrl definiert vier Standardzustände:

```text
#define PINCTRL_STATE_DEFAULT "default"
#define PINCTRL_STATE_INIT "init"
#define PINCTRL_STATE_IDLE "idle"
#define PINCTRL_STATE_SLEEP "sleep"
```

"init" gilt während driver probe; danach kann zu "default" zurückgewechselt werden. Der Quelltext sagt in Klammern, dass bei Auswahl eines anderen Zustands in probe keine Rückkehr zu "init" erfolgt; diese Formulierung bleibt zur Prüfung erhalten. pinctrl-names kann angepasst werden und muss vom Treiber zugeordnet und ausgewertet werden. Beispiel RK3588 pwm4:

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

## 4 Häufige Fragen

### 4.1 IOMUX im Benutzerraum konfigurieren

iomux ist eine mit gcc gebaute Binärdatei, die über ioctl des rockchip-pinctrl-Geräts den aktuellen IOMUX-Wert setzt oder liest. Bauen:

```text
gcc tools/testing/selftests/rkpinctrl/iomux.c -o iomux
```

Beispiel: GPIO0_B7 auf func1 setzen.

```text
[root@RK3588:/]# iomux 0 15 1
```

Beispiel: aktuellen GPIO0_B7-IOMUX-Wert lesen.

```text
[root@RK3588:/]# iomux 0 15
mux get (GPIO0-15) = 1
```

### 4.2 GPIO-Pegel setzen

Ein GPIO gehört eventuell keinem bestimmten Modul an, sondern dient als Versorgungsschalter und soll beim Start möglichst früh High oder Low ausgeben. Dafür "regulator-fixed" verwenden, normalerweise für Regler mit fester Spannung oder GPIO-gesteuerte Regler. Beispiel: GPIO2_A1 auf High konfigurieren.

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

### 4.3 pinctrl-0 des Moduls bleibt wirkungslos

Module verwenden pinctrl-names und pinctrl-0 normalerweise für die Standardkonfiguration von IOMUX oder IOCONFIG; diese Eigenschaften dürfen jedoch nicht beliebigen Knoten hinzugefügt werden. Ein durch driver_probe_device aufgerufenes Modul kann sie verwenden. Zur Diagnose Protokollausgaben in pinctrl_bind_pins unter `drivers/base/dd.c` ergänzen und Aufrufe prüfen.

{% endraw %}
