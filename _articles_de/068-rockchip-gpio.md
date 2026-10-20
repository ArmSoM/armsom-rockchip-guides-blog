---
title: "Rockchip GPIO: Entwickleranleitung für Kernel, U-Boot, Fehlersuche, Suspend und Interrupts"
description: "Vollständige GPIO-Referenz zu IO-Domänen, DTS, Treibercode, U-Boot, sysfs, Aufwecken, Debugging-Werkzeugen und häufigen Fragen."
translation_key: "068-rockchip-gpio"
slug: "068-rockchip-gpio"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "GPIO", "U-Boot", "RK3588", "RK3399"]
keywords: "ArmSoM Rockchip GPIO IOMUX U-Boot"
excerpt: "Vollständige GPIO-Referenz zu IO-Domänen, DTS, Treibercode, U-Boot, sysfs, Aufwecken, Debugging-Werkzeugen und häufigen Fragen."
---

{% raw %}

# Rockchip GPIO: Entwickleranleitung für Kernel, U-Boot, Fehlersuche, Suspend und Interrupts

Dieser Artikel folgt vollständig der 42-seitigen chinesischen Quelle V1.0.1. Englisch und Russisch übersetzen deren technischen Inhalt vollständig; Deutsch folgt der geprüften englischen Aufbereitung. Ein entsprechendes englisches PDF wurde nicht bereitgestellt: Alle Sprachfassungen verwenden die 17 Originalabbildungen des chinesischen PDFs. Bereits vorhandene englische Beschriftungen darin bleiben erhalten; sie werden nicht als Abbildungen einer englischen Quelle ausgegeben. Code, Befehle, Kommentare und Protokolle bleiben in der Quellsprache; Bildunterschriften sind lokalisiert.

Die Geltungsbereichstabelle der Quelle nennt alle Rockchip-Plattformen, die einzelnen Beispiele betreffen jedoch RK3399, RK3588 Android12, RV1103/RV1106, RV1108 und weitere unterschiedliche Plattformen. Dies ist eine ArmSoM-Plattformreferenz. Prüfen Sie tatsächliches Board, SoC, SDK/BSP, Kernel-/U-Boot-Version, Pin-Multiplexing und Versorgung. Leiten Sie daraus keine Unterstützung jedes Boards oder jeder Version ab. Die Quelle gibt keine einheitliche Kernel-Version an; manche Beispiele nennen kernel-5.10 und Android-Einstellungen. Es erfolgte keine ArmSoM-Hardwareprüfung; alle Protokolle und Beispiele stammen aus der Quelle.

**Hardwarerisiko:** Eine falsche IO-Domänenspannung kann Pins beschädigen. Direkte Registerschreibzugriffe, GPIO-Ausgabe, Taktsteuerung und Suspend-Einstellungen können Peripherie, System und Versorgung beeinflussen. Es wurden keine Befehle, Patches oder Hardwareaktionen ausgeführt. Autoren, Lizenzen und technische Commit-Metadaten in referenziertem Code und Patches bleiben erhalten.

| Chipsatz-Geltungsbereich der Quelle |
|---|
| Alle Rockchip-Plattformen |

Hinweise zur Quelle, Extraktionskorrekturen und Kapitelprüfungen finden Sie unter
[Redaktionsprotokoll](/docs/rockchip-gpio/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, block 0 -->

## 1. IO-Domäne

<!-- Source CN PDF p.4, block 1 -->

Typische IO-Ausgangspegel sind 1.8v, 3.0v und 3.3v. Die Ausgangsspannung hängt von der durch die Hardwareversorgung bestimmten Spannung der IO-Versorgungsdomäne ab.

<!-- Source CN PDF p.4, block 2 -->

io-domain ist eine Softwareeinstellung für die Register der IO-Versorgungsdomänen. Stimmt sie nicht mit der tatsächlichen Versorgung überein, können IOs der Domäne unkontrollierbar werden und falsche oder nicht spezifikationskonforme Signale liefern. Verhält sich ein IO ungewöhnlich, obwohl Multiplexing korrekt ist und kein anderer Nutzer ihn angefordert hat, während Messungen falsche Signale zeigen oder Software keine High-/Low-Ausgangspegel setzen kann, prüfen Sie die zugehörigen Versorgungsdomänenregister. Die ausführliche io-domain-Entwickleranleitung befindet sich in der SDK-Dokumentation.

<!-- Source CN PDF p.4, block 3 -->

Dokumentationspfad im Android-SDK: `RKDocs\common\IO-Domain`

<!-- Source CN PDF p.4, block 4 -->

Dokumentationspfad im Linux-SDK: `docs\cn\Common\IO-DOMAIN`

<!-- Source CN PDF p.4, block 5 -->

Hinweis: Manche SDKs enthalten das io-domain-Entwicklungsdokument nicht. Folgen Sie den nachstehenden Anweisungen oder beschaffen Sie es über den zuständigen FAE-Kontakt.

<!-- Source CN PDF p.4, block 6 -->

Beachten Sie insbesondere neuere RK-Chips wie RK3588, RK3562, RV1106 und RV1103: Laut Quelle benötigen sie keine Softwarekonfiguration von io_domains, da sich der Chip automatisch an die Spannungsdomäne anpasst. Bauen Sie zur Kontrolle die Standard-EVB-Firmware und untersuchen Sie die während der Kernel-Kompilierung gespeicherte verborgene Datei `.xxx.dtb.dts.tmp`. Enthält sie keine io-domain-Einstellung, ist keine Softwarekonfiguration der Spannungsdomäne erforderlich.

<!-- Source CN PDF p.4, block 7 -->

### 1.1 Kernel-Konfiguration

<!-- Source CN PDF p.4, block 8 -->

Öffnen Sie am Beispiel RK3399 das GRM/PMUGRF-Kapitel des TRM und suchen Sie nach VSEL, volsel oder vsel, um die io-domain-Register zu finden.

<!-- Source CN PDF p.5, block 9 -->

![Technische Abbildung aus der chinesischen Quelle, S.5](/docs/rockchip-gpio/assets/cn-p05-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.5.*

`GRF_IO_VSEL` — Adresse: Betriebsbasis + Versatz (`0x0e640`).

| Bit | Attribut | Reset-Wert | Beschreibung |
| --- | --- | --- | --- |
| 31:16 | RW | 0x0000 | write_enable: Schreibfreigabe für bit0~15. Bei bit16=1 darf Software bit0 schreiben, bei bit16=0 nicht. Bei bit17=1 darf Software bit1 schreiben, bei bit17=0 nicht. …… Bei bit31=1 darf Software bit15 schreiben, bei bit31=0 nicht. |
| 15:4 | RO | 0x0 | Reserviert |
| 3 | RW | 0x0 | gpio1830_gpio4cd_ms: 1’b0: IO-Domäne arbeitet mit 3.0V; 1’b1: IO-Domäne arbeitet mit 1.8V. |
| 2 | RW | 0x0 | sdmmc_gpio4b_ms: 1’b0: IO-Domäne arbeitet mit 3.0V; 1’b1: IO-Domäne arbeitet mit 1.8V. |
| 1 | RW | 0x0 | audio_gpio3d4a_ms: 1’b0: IO-Domäne arbeitet mit 3.0V; 1’b1: IO-Domäne arbeitet mit 1.8V. |
| 0 | RW | 0x0 | bt656_gpio2ab_ms: 1’b0: IO-Domäne arbeitet mit 3.0V; 1’b1: IO-Domäne arbeitet mit 1.8V. |

<!-- Source CN PDF p.5, block 10 -->

![Technische Abbildung aus der chinesischen Quelle, S.5](/docs/rockchip-gpio/assets/cn-p05-figure2.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.5.*

| Bit | Attribut | Reset-Wert | Beschreibung |
| --- | --- | --- | --- |
| 9 | RW | 0x1 | pmu1830_vol: Auswahl PMU-IO 1.8V/3.0V. 0: IO-Domäne arbeitet mit 3.0V; 1: IO-Domäne arbeitet mit 1.8V. |

<!-- Source CN PDF p.5, block 11 -->

Prüfen Sie nach Auffinden der Register im Schaltplan die Versorgung der betreffenden Pins. Angenommen, die gesamte Reihe der gpio2-Pins lässt sich nicht korrekt steuern:

<!-- Source CN PDF p.6, block 12 -->

![Technische Abbildung aus der chinesischen Quelle, S.6](/docs/rockchip-gpio/assets/cn-p06-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.6.*

<!-- Source CN PDF p.6, block 13 -->

Diese Pinreihe verwendet APIO2 als Versorgung. Öffnen Sie im SDK-Kernelverzeichnis `kernel/Documentation/devicetree/bindings/power/rockchip-io-domain.txt`. Dort ist die Softwaredefinition der APIO2-Versorgung ausführlich beschrieben:

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

Suchen Sie im dts-Verzeichnis nach io_domain:

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

Stellen Sie sicher, dass die Software-Versorgungseinstellung der Hardware entspricht:

<!-- Source CN PDF p.6, block 18 -->

```text
bt656-supply = <&vcc1v8_dvp>;
```

<!-- Source CN PDF p.6, block 19 -->

Untersuchen Sie die Informationen des Debug-Knotens:

<!-- Source CN PDF p.6, block 20 -->

```text
console:/ # cat sys/kernel/debug/regulator/regulator_summary
```

<!-- Source CN PDF p.7, block 21 -->

Die Einstellung 1.8V ist hier nur richtig, wenn sie dem Schaltplan entspricht. Bei Abweichung passen Sie sie an.

<!-- Source CN PDF p.7, block 22 -->

### 1.2 U-Boot-Konfiguration

<!-- Source CN PDF p.7, block 23 -->

Siehe Abschnitt 9.13 von `RKDocs/rk3399/Rockchip_RK3399_Developer_Guide_Android7.1_Software_CN&EN.pdf`, der io-domain-Konfiguration im rkdevelop-Zweig von U-Boot ergänzt. Die Funktion behebt folgende Probleme:

<!-- Source CN PDF p.7, block 24 -->

Sie behebt falsche IO-Pegel beziehungsweise die Unmöglichkeit, iomux zu konfigurieren, aufgrund einer falschen io-domain-Einstellung in U-Boot. Ohne diese Einstellung verwendet der Chip seine Vorgaben, bis der Kernel nach etwa 3~4s die richtige DTS-Konfiguration lädt. Wird eine io-domain mit 3.0V versorgt, während ihre Vorgabe 1.8V lautet, kann die Spannungsabweichung den RK3399-IO beschädigen.

<!-- Source CN PDF p.7, block 25 -->

Konfigurieren Sie die Kernel-io-domain und bestätigen Sie, dass U-Boot und Kernel diese beiden Commits enthalten (`u-boot/drivers/power/rockchip-io-domain.c`):

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

## 2. GPIO-Entwicklung im Kernel

<!-- Source CN PDF p.7, block 28 -->

Dieses Kapitel erläutert Konfiguration und Vorgehen für die GPIO-Entwicklung im Kernel.

<!-- Source CN PDF p.7, block 29 -->

### 2.1 GPIO-Multiplexing

<!-- Source CN PDF p.7, block 30 -->

DTS-Konfiguration

<!-- Source CN PDF p.8, block 31 -->

Die folgende Konfiguration verwendet RK3588 Android12 als Beispiel. Um gpio3b7 zu steuern, setzen Sie `enable-gpios = <&gpio3 RK_PB7 GPIO_ACTIVE_HIGH>` im DTS. Damit der Pin vor dem Kernel-Start nicht auf eine andere Funktion umgeschaltet wird und als GPIO unbrauchbar wird, wählen Sie mit pinctrl-names und pinctrl-0 die GPIO-Funktion. Für einen IO-Interrupt zeigt gpio3b6 die Konfiguration als Schmitt-Trigger-Eingang.

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

Von pinctrl-0 referenzierte Knoten müssen folgende Regeln erfüllen:

<!-- Source CN PDF p.8, block 34 -->

Sie müssen unter dem pinctrl-Knoten stehen, die Struktur function+group verwenden und die übrigen DTS-Grundregeln einhalten. Das Format lautet:

<!-- Source CN PDF p.8, block 35 -->

```text
function {
    group {
        rockchip,pin = <gpiobank gpionum iomuxfunc &config>;
    };
};
```

<!-- Source CN PDF p.8, block 36 -->

iomuxfunc legt die Multiplexfunktion fest; RK_FUNC_GPIO wählt GPIO. config setzt Pull-up, Pull-down, Schmitt-Trigger-Eingangsmodus und Treiberstärke. Siehe rockchip-pinconf.dtsi im SDK; RK listet verfügbare Konfigurationen im DTS-pinctrl-Knoten wie folgt auf:

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

Hier wählt `drive-strength = <2>` die Treiberstufe 2, daher wird 2 in das Treiberstärkenregister geschrieben. Das RK3588-TRM nennt die gpio2a0-Treiberstufen in folgender Abbildung; Stufe 2 entspricht 50ohm.

<!-- Source CN PDF p.10, block 40 -->

![Technische Abbildung aus der chinesischen Quelle, S.10](/docs/rockchip-gpio/assets/cn-p10-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.10.*

RK3588 TRM

| Bit | Attribut | Reset-Wert | Beschreibung |
| --- | --- | --- | --- |
| 2:0 | RW | 0x6 | gpio2a0_ds: GPIO2A0-DS-Steuerung, Auswahl der Treiberstärke. 3'b000: 100ohm; 3'b001: 66ohm; 3'b010: 50ohm; 3'b011: 40ohm; 3'b100: 33ohm; 3'b101: 25ohm. |

<!-- Source CN PDF p.10, block 41 -->

Code des eigenen Treibers

<!-- Source CN PDF p.10, block 42 -->

Am Beispiel RK3588 Android12 liest der eigene Treiber nach der DTS-Konfiguration deren Angaben, um GPIO zu steuern. Mit folgenden Funktionen kann er GPIO anfordern und bedienen.

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

Beispielcode für GPIO-Operationen im eigenen Treiber:

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

Gemäß DTS erhält der Treiber gpio3b7 über `devm_gpiod_get_index(&pdev->dev, "enable", 0, GPIOD_OUT_HIGH)`. GPIO_ACTIVE_HIGH im DTS setzt aktive High-Polarität; GPIOD_OUT_HIGH initialisiert gpio3b7 als Ausgang. `gpiod_set_value(enable_gpio, 1)` setzt gpio3b7 auf High. Für den oben gezeigten IRQ fordern Sie zunächst gpio3b6 mit `devm_gpiod_get_index(&pdev->dev, "irq", 0, GPIOD_IN)` an und initialisieren ihn als Eingang. Fordern Sie den IRQ mit `gpiod_to_irq(irq_gpio)` und `request_irq(irq, irq_demo_handler, IRQF_TRIGGER_FALLING, "demo_irq", NULL)` an.

<!-- Source CN PDF p.12, block 50 -->

### 2.2 GPIO-Eingang und -Ausgang

<!-- Source CN PDF p.12, block 51 -->

Setzen Sie im DTS pinctrl-names auf default und die GPIO-Eigenschaft in pinctrl-0 auf pcfg_output_high oder pcfg_output_low, um direkt High beziehungsweise Low auszugeben. Der Treiber wendet die GPIO-Eigenschaften von pinctrl-0 beim Laden automatisch an.

<!-- Source CN PDF p.12, block 52 -->

Beispiel:

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

Für GPIO-Eingänge genügt normalerweise pcfg_pull_none oder pcfg_pull_none_smt.

<!-- Source CN PDF p.13, block 56 -->

### 2.3 IO-Multiplexing dynamisch ändern

<!-- Source CN PDF p.13, block 57 -->

Das Multiplexing eines IO-Pins lässt sich dynamisch ändern: Er kann etwa in einer Kernel-Ausführungsphase als UART und in einer anderen als normaler GPIO dienen. Folgende Konfiguration verwendet RK3588 Android12 als Beispiel.

<!-- Source CN PDF p.13, block 58 -->

DTS-Konfiguration

<!-- Source CN PDF p.13, block 59 -->

Zusätzlich zu den vier vom Kernel definierten Zuständen kann pinctrl-names eigene Zustände angeben. Der Zustand default wählt die uart3-Pins; nach Zuordnung des eigenen Treibers bindet und aktiviert der Kernel ihn automatisch. Der Treiber muss ihn nicht erneut anwenden. Ein eigener Zustand ist unter pinctrl-names="iomux-exchange" dargestellt. Der Treiber kann ihn auswerten und das Pin-Multiplexing nach Bedarf dynamisch auswählen.

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

Code des eigenen Treibers

<!-- Source CN PDF p.14, block 62 -->

Der Treiber erhält pinctrl-Ressourcen über devm_pinctrl_get, den eigenen GPIO-Zustand über pinctrl_lookup_state und aktiviert den IO-Zustand über pinctrl_select_state. Beispiel:

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

Ruft der obige Code iomux_exchange(1) nicht auf, verwenden die Pins standardmäßig UART. Prüfen Sie nach dem Start das IO-Multiplexing mit folgendem Befehl:

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

gpio1-16 und gpio1-17 sind als UART-Pins konfiguriert. Prüfen Sie sie nach dem Aufruf von iomux_exchange(1) erneut:

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

gpio1-16 und gpio1-17 wurden erfolgreich auf GPIO umgeschaltet.

<!-- Source CN PDF p.16, block 70 -->

## 3. GPIO-Entwicklung in U-Boot

<!-- Source CN PDF p.16, block 71 -->

GPIO lässt sich in U-Boot durch direkte Registerzugriffe mit readl und writel steuern, dieser Code ist jedoch nicht portabel. Dieser Abschnitt beschreibt stattdessen die Nutzung eines U-Boot-Treibers. Nachfolgend stehen U-Boot-DTS-Konfiguration und Treibercode für RK3588 Android12.

<!-- Source CN PDF p.16, block 72 -->

### 3.1 U-Boot-LED-Treiber entwickeln

<!-- Source CN PDF p.16, block 73 -->

DTS-Konfiguration

<!-- Source CN PDF p.16, block 74 -->

U-Boot besitzt eigene DTS-Dateien. Bei der Kompilierung wird die entsprechende DTB automatisch erzeugt und an u-boot.bin angehängt. Die GPIO-DTS-Konfiguration entspricht der im Kernel, jedoch muss der Knoten u-boot,dm-spl oder u-boot,dm-pre-reloc enthalten.

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

Hinweis: Die gpio-leds-Konfiguration im DTS wird normalerweise im Kernel abgelegt. Die Option label muss vorhanden sein; andernfalls scheitert led_gpio.c beim bind. Der folgende Patch gibt die label-Einstellung aus:

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

Prüfen Sie nach dem U-Boot-Build den DTB-Inhalt mit fdtdump:

<!-- Source CN PDF p.17, block 80 -->

```text
fdtdump ./u-boot.dtb | less
```

<!-- Source CN PDF p.17, block 81 -->

Code des eigenen Treibers

<!-- Source CN PDF p.17, block 82 -->

Nachfolgend wird der LED-Treiber in U-Boot vorgestellt. Aktivieren Sie zunächst diese Optionen:

<!-- Source CN PDF p.17, block 83 -->

```text
/u-boot/configs/rk3588_defconfig
CONFIG_LED=y
CONFIG_LED_GPIO=y
```

<!-- Source CN PDF p.17, block 84 -->

Der Framework-Code ist nachfolgend dargestellt:

<!-- Source CN PDF p.17, block 85 -->

```text
u-boot/drivers/led/led-uclass.c // 默认编译
u-boot/drivers/led/led_gpio.c // 支持 compatible = "gpio-leds"
```

<!-- Source CN PDF p.17, block 86 -->

Relevante Codeschnittstellen

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

Zum Einschalten der LED genügt led_get_by_label. Im folgenden Beispiel wird led_get_by_label aus board_late_init aufgerufen. Nach dem Systemstart sollten die an gpio2a0 und gpio2a1 angeschlossenen LEDs leuchten.

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

Anders als der Kernel startet U-Boot beim Initialisieren für registrierte Geräte-/Treiberpaare nicht automatisch probe, obwohl es ein Geräte-/Treibermodell verwendet. Der Nutzer muss probe ausdrücklich auslösen. Deshalb läuft led_gpio_probe erst nach dem Aufruf von led_get_by_label. Dessen Kernoperation ist device_probe, das probe des LED-Treibers aufruft. Anschließend kann led_set_state die LED ein- oder ausschalten.

<!-- Source CN PDF p.18, block 91 -->

<!-- Source CN PDF p.18, block 92 -->

Nach dem Vorbild des LED-Treibers lässt sich ein eigener GPIO-Treiber für U-Boot entwickeln. Die Schnittstelle zum Abrufen eines eigenen Gerätetreibers lautet:

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

Die GPIO-Bedienschnittstellen lauten:

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

udevice wird über uclass_id ermittelt. Die Registrierung des LED-Treibers ist nachfolgend dargestellt:

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

UCLASS_LED ist in u-boot/include/dm/uclass-id.h definiert.

<!-- Source CN PDF p.19, block 100 -->

### 3.2 U-Boot-GPIO-Treiber entwickeln

<!-- Source CN PDF p.19, block 101 -->

Der obige LED-Treiber existiert bereits in U-Boot; es genügt, DTS zu konfigurieren und seine Schnittstellen aufzurufen. Nachfolgend ein Entwicklungsbeispiel für einen U-Boot-GPIO-Treiber. Aktivieren Sie diese Optionen:

<!-- Source CN PDF p.19, block 102 -->

```text
/u-boot/configs/rk3588_defconfig
CONFIG_DM_GPIO=y
CONFIG_GPIO_HOG=y
CONFIG_ARCH_ROCKCHIP=y
CONFIG_SPL_GPIO_SUPPORT=y
```

<!-- Source CN PDF p.19, block 103 -->

DTS-Konfiguration

<!-- Source CN PDF p.19, block 104 -->

Konfigurieren Sie beispielsweise für gpio3b7 das U-Boot-DTS wie folgt:

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

Code des eigenen Treibers

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

Der Treiber erhält gpio3b7 über `gpio_request_by_name(dev, "enable-gpios", 0, &gpio_uboot, GPIOD_IS_OUT)` und konfiguriert ihn als Ausgang. Der Nutzer muss ausdrücklich die entsprechende Schnittstelle aufrufen, um die GPIO-probe-Funktion auszuführen:

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

Der Aufruf von uclass_get_device_by_driver aus board_late_init führt schließlich die obige probe-Funktion aus. `dm_gpio_set_value(&gpio_uboot, 1)` setzt den Ausgang auf High.

<!-- Source CN PDF p.21, block 112 -->

## 4. GPIO-Entwicklung im User-Space

<!-- Source CN PDF p.21, block 113 -->

GPIO kann im User-Space auf verschiedene Arten verwendet werden; dieser Abschnitt zeigt den üblichen echo-Befehl. Der Linux-Kernel stellt unter /sys/class/gpio/ eine GPIO-Debug-Schnittstelle für den User-Space bereit:

<!-- Source CN PDF p.21, block 114 -->

```text
console:/sys/class/gpio# ls
export gpiochip128 gpiochip509 gpiochip96
gpiochip0 gpiochip32 gpiochip64 unexport
```

<!-- Source CN PDF p.21, block 115 -->

Über export wird dem System die zu steuernde GPIO-Pinnummer zum Exportieren mitgeteilt; unexport hebt den Export auf. gpiochipN enthält Informationen über die GPIO-Register des Systems, einschließlich Basispinnummer jedes Registers, Name und Gesamtzahl der Pins.

<!-- Source CN PDF p.21, block 116 -->

Exportieren wir beispielsweise gpio1b1. Zunächst wird seine Nummer berechnet: Pinnummer = Basis des steuernden Registers + Bitnummer innerhalb dieses Registers. gpio1b1 = 32 + 9 = 41. Export von gpio1b1:

<!-- Source CN PDF p.21, block 117 -->

```text
console:/sys/class/gpio# echo 41 > export
```

<!-- Source CN PDF p.21, block 118 -->

Richtung setzen: in bedeutet Eingang, out bedeutet Ausgang:

<!-- Source CN PDF p.21, block 119 -->

```text
console:/sys/class/gpio/gpio41# echo out > direction
```

<!-- Source CN PDF p.21, block 120 -->

Richtung lesen:

<!-- Source CN PDF p.21, block 121 -->

```text
console:/sys/class/gpio/gpio41# cat direction
```

<!-- Source CN PDF p.21, block 122 -->

Ausgang setzen:

<!-- Source CN PDF p.21, block 123 -->

```text
console:/sys/class/gpio/gpio41# echo 1 > value
```

<!-- Source CN PDF p.21, block 124 -->

Ein-/Ausgangswert lesen:

<!-- Source CN PDF p.21, block 125 -->

```text
console:/sys/class/gpio/gpio41# cat value
```

<!-- Source CN PDF p.21, block 126 -->

Pinexport aufheben:

<!-- Source CN PDF p.22, block 127 -->

```text
console:/sys/class/gpio# echo 41 > unexport
```

<!-- Source CN PDF p.22, block 128 -->

Diese Operationen setzen voraus, dass der IO als GPIO gemultiplext ist. Bei Auswahl einer anderen Funktion lässt sich sein GPIO-Ein-/Ausgang nicht bedienen. Prüfen Sie daher zunächst das Multiplexing. Neben Registerlesen mit io zeigt folgender Befehl Multiplexing und Konfiguration sämtlicher Pins:

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

## 5. IO-Suspend und Aufwecken konfigurieren

<!-- Source CN PDF p.23, block 131 -->

Suspend-/Aufweckoperationen auf Chipebene sind heute hauptsächlich in ATF umgesetzt, dessen betreffender Code nicht offen ist. Über DTS lassen sich verschiedene während des Systemschlafs verwendete Energiesparmodi für die Produktanforderungen auswählen. Projekte benötigen unterschiedliche Aufweckquellen; aktivieren Sie die passenden Quellen im DTS.

<!-- Source CN PDF p.23, block 132 -->

Die Standby-Sequenz schaltet normalerweise Versorgungsdomänen, IP-Module, Takte und PLLs ab, versetzt DDR in Self-Refresh, schaltet den Systembus auf einen langsamen Takt (24M oder 32K), schaltet vdd_arm/vdd_log ab und konfiguriert Aufweckquellen. Für unterschiedliche Standby-Anforderungen werden die Einstellungen beim Start über DTS-Knoten an trust übergeben. Beispiel RK3588:

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

### 5.1 GPIO als Aufweckquelle konfigurieren

<!-- Source CN PDF p.23, block 135 -->

Bei RK3588 bleibt die GPIO0-Pinversorgung während Suspend standardmäßig aktiv und benötigt keine zusätzliche Konfiguration. Für einen GPIO außerhalb von GPIO0 als Aufweckquelle konfigurieren Sie Folgendes:

<!-- Source CN PDF p.23, block 136 -->

Die Versorgung dieses GPIO während Suspend eingeschaltet lassen.

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

regulator-off-in-suspend schaltet diese Versorgung während Suspend ab. Ändern Sie es in regulator-on-in-suspend, um sie eingeschaltet zu lassen.

<!-- Source CN PDF p.24, block 139 -->

Den rockchip_suspend-Knoten konfigurieren.

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

In rockchip_suspend schaltet RKPM_SLP_ARMOFF_LOGOFF vdd_arm und vdd_log ab. Ändern Sie dies in RKPM_SLP_ARMOFF_DDRPD, um vdd_log zu erhalten. Konfigurieren Sie außerdem RKPM_CPU0_WKUP_EN in rockchip_suspend.

<!-- Source CN PDF p.24, block 142 -->

Nicht jeder GPIO kann als Aufweckquelle dienen. Prüfen Sie PMU_WAKEUP_INT_CON im TRM; viele Plattformen unterstützen nur Aufwecken über die GPIO0-Gruppe.

<!-- Source CN PDF p.25, block 143 -->

### 5.2 GPIO-Pegel während Suspend konfigurieren

<!-- Source CN PDF p.25, block 144 -->

Beispiel RK3399:

<!-- Source CN PDF p.25, block 145 -->

```text
&rockchip_suspend {
    status = "okay";
+ rockchip,power-ctrl =
+ <&gpio1 17 GPIO_ACTIVE_HIGH>, //配置休眠时GPIO1_C1为高电平
+ <&gpio1 14 GPIO_ACTIVE_HIGH>; //配置休眠时GPIO1_B6为高电平
```

<!-- Source CN PDF p.25, block 146 -->

rockchip,power-ctrl kann nur GPIOs auf PMUIO1/2 auswählen. Bevorzugen Sie GPIO0; andernfalls lässt sich der IO-Zustand nach Suspend nicht beibehalten. Das neue Suspend-Framework setzt IOs in nicht von der PMU gesteuerten Versorgungsdomänen während Suspend auf ihren Standardzustand zurück.

<!-- Source CN PDF p.25, block 147 -->

## 6. GPIO-Erweiterungen

<!-- Source CN PDF p.25, block 148 -->

Dieses Kapitel beschreibt grundlegende Konfiguration und Nutzung von GPIO-Expandern am Beispiel PCA9555: ein universeller 16-Bit-GPIO-Expander mit Interrupt-Unterstützung und schwachen Pull-up-Widerständen für I2c-Bus-/SMBus-Anwendungen.

<!-- Source CN PDF p.25, block 149 -->

DTS-Konfiguration

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

reset-gpio-index ist die GPIO-Nummer; sie lässt sich mit `cat /sys/kernel/debug/gpio` prüfen.

<!-- Source CN PDF p.25, block 152 -->

Treiberaufrufe

<!-- Source CN PDF p.25, block 153 -->

```text
ret |= of_property_read_u32(node, "reset-gpio-index",
        &test->reset_gpio_index);
gpio_to_desc(test->reset_gpio_index);
```

<!-- Source CN PDF p.26, block 154 -->

## 7. I2C mit GPIO nachbilden

<!-- Source CN PDF p.26, block 155 -->

Dieses Kapitel beschreibt die grundlegende GPIO-basierte I2C-Konfiguration. Der zugehörige Treiber lautet kernel/drivers/i2c/busses/i2c-gpio.c.

<!-- Source CN PDF p.26, block 156 -->

Konfigurationsoptionen

<!-- Source CN PDF p.26, block 157 -->

Setzen Sie CONFIG_I2C_GPIO=y in defconfig oder wählen Sie GPIO-based bitbanging I2C in menuconfig.

<!-- Source CN PDF p.26, block 158 -->

![Technische Abbildung aus der chinesischen Quelle, S.26](/docs/rockchip-gpio/assets/cn-p26-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.26.*

<!-- Source CN PDF p.26, block 159 -->

Die zugehörige Option lautet:

<!-- Source CN PDF p.26, block 160 -->

```text
Device Drivers->
    I2C support --->
        I2C Hardware Bus support --->
            <*> GPIO-based bitbanging I2C
```

<!-- Source CN PDF p.26, block 161 -->

DTS-Konfiguration

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

## 8. GPIO-Debugging-Werkzeuge

<!-- Source CN PDF p.27, block 165 -->

Dieses Kapitel stellt GPIO-Debugging-Werkzeuge vor.

<!-- Source CN PDF p.27, block 166 -->

### 8.1 IO-Werkzeug

<!-- Source CN PDF p.27, block 167 -->

Rockchip-Plattformen bieten das IO-Werkzeug zum direkten Lesen und Setzen von Registerwerten bei der Fehlersuche.

<!-- Source CN PDF p.27, block 168 -->

#### 8.1.1 IO-Werkzeug in der Kernel-Phase

<!-- Source CN PDF p.27, block 169 -->

Ab Android10 ist aufgrund von Sicherheitsstandards eine manuelle Debugging-Konfiguration erforderlich. Aktivieren Sie beispielsweise auf RK3399 Android12 folgende Optionen für IO-Befehle:

<!-- Source CN PDF p.27, block 170 -->

```text
kernel-5.10/kernel/configs/android-11.config
CONFIG_DEVMEM=y
```

<!-- Source CN PDF p.27, block 171 -->

Geben Sie im seriellen Terminal oder über adb io ein und drücken Sie Enter, um detaillierte Befehlsparameter anzuzeigen.

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

GPIO-Multiplexing mit dem IO-Werkzeug abfragen

<!-- Source CN PDF p.28, block 175 -->

Ermitteln Sie am Beispiel RK3399 das IO-Multiplexing anhand der Registerbeschreibungen seines TRM. Für gpio4b0 zeigt der Schaltplan folgende mögliche Funktionen:

<!-- Source CN PDF p.28, block 176 -->

```text
GPIO4_B0/SDMMC0_D0/UART2A_RX_u
```

<!-- Source CN PDF p.28, block 177 -->

Suchen Sie im RK3399-TRM nach gpio4b0, um diese Registerbeschreibung zu finden:

<!-- Source CN PDF p.28, block 178 -->

![Technische Abbildung aus der chinesischen Quelle, S.28](/docs/rockchip-gpio/assets/cn-p28-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.28.*

| Bit | Attribut | Reset-Wert | Beschreibung |
| --- | --- | --- | --- |
| 1:0 | RW | 0x0 | gpio4b0_sel: GPIO4B[0]-IOMUX-Auswahl. 2'b00: gpio; 2'b01: sdmmc_data0; 2'b10: uart2dbga_sin; 2'b11: reserviert. |

<!-- Source CN PDF p.28, block 179 -->

Das TRM nennt GRF als Registerbasis und 0x0e024 als Versatz:

<!-- Source CN PDF p.28, block 180 -->

![Technische Abbildung aus der chinesischen Quelle, S.28](/docs/rockchip-gpio/assets/cn-p28-figure2.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.28.*

`GRF_GPIO4B_IOMUX` — Adresse: Betriebsbasis + Versatz (`0x0e024`). GPIO4B-IOMUX-Steuerung.

<!-- Source CN PDF p.28, block 181 -->

Suchen Sie im Datenblatt nach der Adresszuordnung und ermitteln Sie die GRF-Basisadresse:

<!-- Source CN PDF p.29, block 182 -->

![Technische Abbildung aus der chinesischen Quelle, S.29](/docs/rockchip-gpio/assets/cn-p29-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.29.*

<!-- Source CN PDF p.29, block 183 -->

![Technische Abbildung aus der chinesischen Quelle, S.29](/docs/rockchip-gpio/assets/cn-p29-figure2.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.29.*

<!-- Source CN PDF p.29, block 184 -->

Addieren Sie den Versatz zur GRF-Basis, um die gpio4b0-Multiplexregisteradresse 0xff77e024 zu erhalten. Geben Sie im seriellen Terminal oder über adb ein:

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

Die erste Ausgabezeile lautet:

<!-- Source CN PDF p.30, block 188 -->

```text
ff77e024: 00000555 0000855f 00000000 00000000
```

<!-- Source CN PDF p.30, block 189 -->

Die vier Werte gehören zu diesen Adressen:

<!-- Source CN PDF p.30, block 190 -->

```text
0xff77e024、0xff77e028、0xff77e02c、0xff77e030
```

<!-- Source CN PDF p.30, block 191 -->

Hexadezimale Zuordnung:

<!-- Source CN PDF p.30, block 192 -->

```text
0xff77e024：00000555
```

<!-- Source CN PDF p.30, block 193 -->

Wandeln Sie 0x555 in Binärdarstellung um und ergänzen Sie auf 32 Bit:

<!-- Source CN PDF p.30, block 194 -->

```text
0000 0000 0000 0000 0000 0101 0101 0101
```

<!-- Source CN PDF p.30, block 195 -->

Die umgewandelte Zahl verläuft vom niedrigstwertigen Bit rechts zum höchstwertigen links: Ganz rechts liegt Bit 0, ganz links Bit 31. Vergleichen Sie die Bits mit GRF_GPIO4B_IOMUX, um das Ergebnis auszuwerten.

<!-- Source CN PDF p.30, block 196 -->

![Technische Abbildung aus der chinesischen Quelle, S.30](/docs/rockchip-gpio/assets/cn-p30-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.30.*

| Bit | Attribut | Reset-Wert | Beschreibung |
| --- | --- | --- | --- |
| 1:0 | RW | 0x0 | gpio4b0_sel: GPIO4B[0]-IOMUX-Auswahl. 2'b00: gpio; 2'b01: sdmmc_data0; 2'b10: uart2dbga_sin; 2'b11: reserviert. |

<!-- Source CN PDF p.30, block 197 -->

In der binären Darstellung der seriellen Ausgabe sind Bits [1:0] gleich 01; damit ist sdmmc_data0 ausgewählt. Dies bestätigt das aktuelle gpio4b0-Multiplexing. Ist es nicht der gewünschte Zustand, suchen Sie den Code, der ihn eingestellt hat.

<!-- Source CN PDF p.30, block 198 -->

Wie findet man die Multiplexeinstellung im Code? Angenommen, gpio4b0 soll als GPIO High/Low ausgeben, die Abfrage meldet jedoch sdmmc_data0. Suchen Sie zunächst den sdmmc-Knoten im DTS und prüfen Sie, ob dessen pinctrl-Eigenschaft ebenfalls diesen GPIO referenziert.

<!-- Source CN PDF p.30, block 199 -->

Register mit dem IO-Werkzeug schreiben

<!-- Source CN PDF p.30, block 200 -->

Für vorübergehende Registeränderungen bei einem Versuch verwenden Sie io -w.

<!-- Source CN PDF p.30, block 201 -->

Lesen Sie beispielsweise das Register mit `io -4 -r 0xff77e024` und schreiben Sie anschließend wie folgt 1 in Bit 0 von 0xff77e024:

<!-- Source CN PDF p.31, block 202 -->

Warum muss Bit 16 im Hexwert nach der Registeradresse 1 sein? Bits 16 bis 31 sind Schreibfreigabebits und standardmäßig 0, wodurch Schreiben gesperrt ist. Zum Schreiben von Bit 0 muss auch das zugehörige Freigabebit 16 auf 1 gesetzt werden. Dies folgt aus der Registerbeschreibung:

<!-- Source CN PDF p.31, block 203 -->

![Technische Abbildung aus der chinesischen Quelle, S.31](/docs/rockchip-gpio/assets/cn-p31-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.31.*

`GRF_GPIO4B_IOMUX` — Adresse: Betriebsbasis + Versatz (`0x0e024`). GPIO4B-IOMUX-Steuerung.

| Bit | Attribut | Reset-Wert | Beschreibung |
| --- | --- | --- | --- |
| 31:16 | RW | 0x0000 | write_enable: Schreibfreigabe für bit0~15. Bei bit16=1 darf Software bit0 schreiben, bei bit16=0 nicht. Bei bit17=1 darf Software bit1 schreiben, bei bit17=0 nicht. …… Bei bit31=1 darf Software bit15 schreiben, bei bit31=0 nicht. |

<!-- Source CN PDF p.31, block 204 -->

Mit dem IO-Werkzeug geschriebene Registerwerte bleiben nach einem Neustart nicht erhalten.

<!-- Source CN PDF p.31, block 205 -->

GPIO-Register mit dem IO-Werkzeug untersuchen

<!-- Source CN PDF p.31, block 206 -->

Registerabfragen zeigen auch, ob ein GPIO Ein- oder Ausgang ist und ob sein Ausgang High oder Low ist. Suchen Sie für gpio4b0 im RK3399-TRM nach ADDRESS MAPPING, um die GPIO4-Basis zu finden:

<!-- Source CN PDF p.31, block 207 -->

![Technische Abbildung aus der chinesischen Quelle, S.31](/docs/rockchip-gpio/assets/cn-p31-figure2.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.31.*

| Modul | Basis | Größe |
| --- | --- | --- |
| GPIO4 | FF79_0000 | 32K |

<!-- Source CN PDF p.31, block 208 -->

GPIO4-Zustand mit io abfragen:

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

Interpretieren Sie die Ausgabe anhand der GPIO-Registerbeschreibungen im RK3399-TRM. Beispiel gpio4b0:

<!-- Source CN PDF p.32, block 212 -->

![Technische Abbildung aus der chinesischen Quelle, S.32](/docs/rockchip-gpio/assets/cn-p32-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.32.*

10.4.1 Registerübersicht

| Name | Versatz | Größe | Reset-Wert | Beschreibung |
| --- | --- | --- | --- | --- |
| GPIO_SWPORTA_DR | 0x0000 | W | 0x00000000 | Datenregister von Port A |
| GPIO_SWPORTA_DDR | 0x0004 | W | 0x00000000 | Datenrichtungsregister von Port A |
| GPIO_INTEN | 0x0030 | W | 0x00000000 | Interrupt-Freigaberegister |
| GPIO_INTMASK | 0x0034 | W | 0x00000000 | Interrupt-Maskenregister |
| GPIO_INTTYPE_LEVEL | 0x0038 | W | 0x00000000 | Interrupt-Pegelregister |
| GPIO_INT_POLARITY | 0x003c | W | 0x00000000 | Interrupt-Polaritätsregister |
| GPIO_INT_STATUS | 0x0040 | W | 0x00000000 | Interruptstatus von Port A |
| GPIO_INT_RAWSTATUS | 0x0044 | W | 0x00000000 | Roher Interruptstatus von Port A |
| GPIO_DEBOUNCE | 0x0048 | W | 0x00000000 | Freigaberegister für Entprellung |
| GPIO_PORTA_EOI | 0x004c | W | 0x00000000 | Register zum Löschen von Port-A-Interrupts |
| GPIO_EXT_PORTA | 0x0050 | W | 0x00000000 | Externes Portregister von Port A |
| GPIO_LS_SYNC | 0x0060 | W | 0x00000000 | Freigaberegister für pegelsensitive Synchronisierung |

Größe: B = Byte-Zugriff (8 Bit); HW = Halbwortzugriff (16 Bit); W = Wortzugriff (32 Bit).

<!-- Source CN PDF p.32, block 213 -->

Versatz 0x4 ist das Richtungsregister und Versatz 0x0 das Datenregister. Das Lesen von Richtungsregister 0xff790004 liefert 0x6a400000. Die Bits sind wie folgt zugeordnet:

<!-- Source CN PDF p.32, block 214 -->

| gpio4d | gpio4c | gpio4b | gpio4a |
|---|---|---|---|
| 0x6a | 0x40 | 0x00 | 0x00 |

<!-- Source CN PDF p.32, block 215 -->

Jedes Paar Hexadezimalziffern ergibt acht Bits, die von rechts nach links Pins 0 bis 7 entsprechen. 0x6a ergibt beispielsweise 0110 1010; dessen Bits von rechts nach links stehen für gpio4d0 bis gpio4d7. Laut Registerbeschreibung:

<!-- Source CN PDF p.32, block 216 -->

![Technische Abbildung aus der chinesischen Quelle, S.32](/docs/rockchip-gpio/assets/cn-p32-figure2.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.32.*

`RK3399 TRM` — Adresse: Betriebsbasis + Versatz (`0x0004`). Datenrichtungsregister von Port A.

| Bit | Attribut | Reset-Wert | Beschreibung |
| --- | --- | --- | --- |
| 31:0 | RW | 0x00000000 | gpio_swporta_ddr: Geschriebene Werte steuern unabhängig die Richtung des jeweiligen Datenbits von Port A. 0: Eingang (Standard); 1: Ausgang. |

<!-- Source CN PDF p.32, block 217 -->

gpio4b0 ist somit aktuell ein Eingang. Wäre es ein Ausgang, würde 0xFF790000 seinen High-/Low-Pegel zeigen. Im Eingangsmodus lesen Sie 0xFF790050 (GPIO_EXT_PORTA), um den Eingangspegel zu bestimmen.

<!-- Source CN PDF p.33, block 218 -->

#### 8.1.2 IO-Werkzeug in U-Boot

<!-- Source CN PDF p.33, block 219 -->

Halten Sie beim U-Boot-Start ctrl + c gedrückt, um die Befehlszeile zu öffnen. U-Boot bietet zahlreiche Befehle; ? listet die aktuell unterstützten auf:

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

Verwenden Sie bei älteren Versionen folgende Konfiguration, bauen Sie U-Boot neu und übertragen Sie es:

<!-- Source CN PDF p.33, block 222 -->

Aktivieren Sie folgendes Makro für IO-Befehle:

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

U-Boot kann auch den Befehl md verwenden.

<!-- Source CN PDF p.33, block 225 -->

Ergänzen Sie folgendes Makro für md:

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

bootdelay einstellen:

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

Diese Optionen sind in der Rockchip-Standardkonfiguration aktiviert. Die Quelle empfiehlt md-Befehle für Registerzugriffe. Die Operationen lauten:

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

Lesebeispiel: 0x10 aufeinanderfolgende Datenelemente ab Adresse 0x76000000 anzeigen.

<!-- Source CN PDF p.34, block 232 -->

```text
=> md.l 0x76000000 0x10
76000000: fffffffe ffffffff ffffffff ffffffff ................
76000010: ffffffdf ffffffff feffffff ffffffff ................
76000020: ffffffff ffffffff ffffffff ffffffff ................
76000030: ffffffff ffffffff ffffffff ffffffff ................
```

<!-- Source CN PDF p.34, block 233 -->

Schreibbeispiel: Adresse 0x76000000 den Wert 0x1234 zuweisen.

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

### 8.2 IOMUX-Werkzeug

<!-- Source CN PDF p.34, block 236 -->

iomux ist eine mit GCC kompilierte Binärdatei, die GPIO-Pins über ioctl-Aufrufe an das rockchip-pinctrl-Gerät abfragt und einstellt. Es ist standardmäßig deaktiviert; setzen Sie CONFIG_ROCKCHIP_IOMUX=y in defconfig.

<!-- Source CN PDF p.34, block 237 -->

Quellcode des iomux-Werkzeugs:

<!-- Source CN PDF p.34, block 238 -->

```text
kernel/tools/testing/selftests/rkpinctrl/iomux.c
```

<!-- Source CN PDF p.34, block 239 -->

Build-Verfahren:

<!-- Source CN PDF p.35, block 240 -->

```text
gcc kernel/tools/testing/selftests/rkpinctrl/iomux.c -o iomux
```

<!-- Source CN PDF p.35, block 241 -->

Verwendung:

<!-- Source CN PDF p.35, block 242 -->

Beispiel: GPIO0_B7 auf func1 setzen.

<!-- Source CN PDF p.35, block 243 -->

```text
[root@RK3588:/]# iomux 0 15 1
```

<!-- Source CN PDF p.35, block 244 -->

Beispiel: iomux von GPIO0_B7 abfragen.

<!-- Source CN PDF p.35, block 245 -->

```text
[root@RK3588:/]# iomux 0 15
mux get (GPIO0-15) = 1
```

<!-- Source CN PDF p.35, block 246 -->

### 8.3 Pinconfig-Werkzeug

<!-- Source CN PDF p.35, block 247 -->

PinConfig bietet Hardware- und Softwareentwicklern eine einheitliche IO-Konfiguration und -Prüfung. Die Quelle unterstützt RK3588, RK3566, RK3568, RV1126 und RV1109.

<!-- Source CN PDF p.35, block 248 -->

Ausführliche Hinweise stehen in der mitgelieferten PinConfig_UserManual.pdf.

<!-- Source CN PDF p.35, block 249 -->

### 8.4 PinDebug-Werkzeug

<!-- Source CN PDF p.35, block 250 -->

PinDebug dient zur Pin-Fehlersuche, iomux-Abfrage und Konfiguration von Pin-Eigenschaften. Die Quelle unterstützt RK3588, RK3566, RK3568, RV1126, RV1109, RV1106, RV1103 und RK3528.

<!-- Source CN PDF p.35, block 251 -->

Ausführliche Hinweise stehen in der mitgelieferten PinDebug_UserManual.pdf.

<!-- Source CN PDF p.35, block 252 -->

## 9. Vorgehen bei GPIO-Fehlern

<!-- Source CN PDF p.35, block 253 -->

Dieses Kapitel beschreibt die grundlegende GPIO-Fehlersuche. Folgen Sie diesen Schritten, wenn sich GPIO-Eingang oder -Ausgang nicht steuern lassen.

<!-- Source CN PDF p.35, block 254 -->

### 9.1 Versorgung prüfen

<!-- Source CN PDF p.35, block 255 -->

Messen Sie die Versorgungsspannung an den Pins der GPIO-Versorgungsdomäne. Ist sie normal und entspricht dem Schaltplan? Ist io-domain im DTS korrekt konfiguriert? Die direkteste Prüfung ist das Lesen der io-domain-Register mit io. Zur Konfiguration siehe Kapitel IO-Domäne.

<!-- Source CN PDF p.35, block 256 -->

### 9.2 IO-Multiplexing prüfen

<!-- Source CN PDF p.35, block 257 -->

Die meisten GPIO-Steuerungsfehler entstehen durch eine andere Multiplexfunktion des Pins. Verwenden Sie die GPIO-Debugging-Werkzeuge, üblicherweise io zum direkten Lesen des Multiplexregisters; siehe Werkzeugkapitel. Eine Vorprüfung ist auch anhand der temporären DTS-Datei möglich.

<!-- Source CN PDF p.36, block 258 -->

### 9.3 GPIO-Taktzustand prüfen

<!-- Source CN PDF p.36, block 259 -->

Beispielsweise kann das Lesen der GPIO4-Register mit dem IO-Werkzeug Folgendes ergeben:

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

Alle Werte sind auffällig identisch. Zeigen einige oder alle io-Lesewerte denselben ungewöhnlichen Wert, ist der GPIO-Takt deaktiviert und Lesen/Schreiben nicht möglich. Aktivieren Sie den RK3399-GPIO4-Takt; suchen Sie im TRM nach gpio4_en:

<!-- Source CN PDF p.36, block 262 -->

![Technische Abbildung aus der chinesischen Quelle, S.36](/docs/rockchip-gpio/assets/cn-p36-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.36.*

`CRU_CLKGATE_CON31` — Adresse: Betriebsbasis + Versatz (`0x037c`). Internes Clock-Gating-Register 31. CRU-Basis FF76_0000, Größe 64K.

| Bit | Attribut | Reset-Wert | Beschreibung |
| --- | --- | --- | --- |
| 5 | RW | 0x0 | pclk_gpio4_en: Abschaltbit für pclk_gpio4. Bei HIGH wird der Takt deaktiviert. |

<!-- Source CN PDF p.36, block 263 -->

Lesen Sie zunächst mit io den aktuellen GPIO4-Taktzustand. Ein gesetztes Registerbit bedeutet deaktiviert:

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

Das Ergebnis 0x000001b8 lautet binär 0001 1011 1000. Der GPIO4-Takt entspricht dem von rechts gezählten Bit 5; dieses ist 1, also deaktiviert. Aktivieren Sie ihn für normale io-Lese- und Schreibzugriffe:

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

Neben Registerzugriffen kann der Takt auch über die sys-Schnittstelle aktiviert werden, beispielsweise:

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

Hinweis: Ob der GPIO-Takt aktiv ist, hängt davon ab, ob der GPIO verwendet wird, etwa bei einem Interrupt oder einer Datenübertragung; dies wird nicht unmittelbar durch Konfiguration oder API-Aufrufe bestimmt.

<!-- Source CN PDF p.38, block 271 -->

### 9.4 Konflikte mit anderen GPIO-Treibern prüfen

<!-- Source CN PDF p.38, block 272 -->

Sind Multiplexing und Versorgungsdomäne eines als GPIO vorgesehenen Pins korrekt, die Oszilloskopkurve folgt aber nicht den High-/Low-Wechseln Ihres Treibers, bedient ihn möglicherweise ein anderer Treiber. Ergänzen Sie wie folgt Debug-Ausgaben in gpio_direction_output und gpio_direction_input, um alle GPIO-Operationen auszugeben.

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

Um unkontrollierbares Verhalten von RK3588 gpio4b3 zu untersuchen, bestimmen Sie zunächst mit diesem Befehl die Basispinnummer von gpio4a0:

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

Pinnummer von gpio4b3 berechnen:

<!-- Source CN PDF p.39, block 278 -->

```text
gpio4b3 = 128 + (B-A) * 8 + 3 = 128 + 1 * 8 + 3 = 139
```

<!-- Source CN PDF p.39, block 279 -->

Nach Meldungen mit 139 suchen:

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

### 9.5 GPIO-Register prüfen

<!-- Source CN PDF p.39, block 282 -->

Wenn IO-Versorgungsdomäne und IO-Reset als korrekt bestätigt sind, prüfen Sie abschließend durch direkte GPIO-Registerzugriffe mit io, ob die Softwarekonfiguration verantwortlich ist.

<!-- Source CN PDF p.39, block 283 -->

Prüfen Sie diese drei GPIO-Register:

<!-- Source CN PDF p.39, block 284 -->

Port Data Register: GPIO-Ausgangsregister (Low/High)

<!-- Source CN PDF p.39, block 285 -->

Port Data Direction Register: GPIO-Richtungsregister (Eingang/Ausgang)

<!-- Source CN PDF p.39, block 286 -->

External Port Data Register: Tatsächlicher externer GPIO-Portpegel (Low/High)

<!-- Source CN PDF p.39, block 287 -->

Ist beispielsweise GPIO auf High konfiguriert, Ausgangsregister und Richtungsregister sind 1, der externe Portpegel aber 0, liegt die Ursache wahrscheinlich in der Hardware: Eine externe Schaltung zieht GPIO auf Low.

<!-- Source CN PDF p.39, block 288 -->

## 10. Häufige Fragen

<!-- Source CN PDF p.39, block 289 -->

### 10.1 Ausgangspegel beim Einschalten nicht steuerbar

<!-- Source CN PDF p.39, block 290 -->

Unmittelbar beim Einschalten kann Software den Pegel nicht steuern. Wählen Sie einen GPIO mit dem erforderlichen Pull-up oder Pull-down im Hardware-Grundzustand. Prüfen Sie am Beispiel RK3399 gpio2c2 ohne externe Beschaltung den Standardzustand im Datenblatt oder anhand des Suffixes des Pinnamens im Schaltplan:

<!-- Source CN PDF p.39, block 291 -->

![Technische Abbildung aus der chinesischen Quelle, S.39](/docs/rockchip-gpio/assets/cn-p39-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.39.*

<!-- Source CN PDF p.40, block 292 -->

Für High beim Einschalten wählen Sie einen GPIO-Pin mit Suffix -u, für Low einen mit -d.

<!-- Source CN PDF p.40, block 293 -->

Manche Pins sind standardmäßig keine GPIOs. Prüfen Sie den Reset-Wert des Multiplexregisters im TRM; JTAG-Pins starten beispielsweise im JTAG-Modus.

<!-- Source CN PDF p.40, block 294 -->

### 10.2 Unerwünschte GPIO-Interrupts

<!-- Source CN PDF p.40, block 295 -->

Aktivieren Sie bei unerwünschten GPIO-Interrupts den Schmitt-Trigger-Modus, indem Sie GPIO als pcfg_pull_none_smt konfigurieren.

<!-- Source CN PDF p.40, block 296 -->

### 10.3 RV1103/RV1106 gpio3b0~gpio3c3 nicht steuerbar

<!-- Source CN PDF p.40, block 297 -->

RV1103/RV1106 gpio3b0~gpio3c3 sind Sonderfälle: Der GPIO-Modus benötigt zusätzliche Registerkonfiguration und erlaubt nur Eingänge. GPIO- und MIPI-Modus dieser Gruppe schließen sich gegenseitig aus. Folgen Sie diesen Schritten:

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

### 10.4 RV1108 gpio1a0~gpio1b1 nicht steuerbar

<!-- Source CN PDF p.40, block 300 -->

Der Quelltext nennt hier RV1108 gpio3b0~gpio3c3. Um sie als GPIO zu konfigurieren, setzen Sie DPHY_LVDS_TTL wie folgt auf TTL-Modus:

<!-- Source CN PDF p.40, block 301 -->

```text
io -4 0x2022838C 0x00000004 #enable TTL mode，disable LVDS mode，disable mipi mode
io -4 0x202283AC 0x000000fd #disable Data Lane，disable Clock Lane
```

<!-- Source CN PDF p.40, block 302 -->

### 10.5 RK3588 gpio4d2 und gpio4d3 nicht steuerbar

<!-- Source CN PDF p.40, block 303 -->

Prüfen Sie bei RK3588 sowie anderen Plattformen mit demselben Problem, etwa RK3576, vor Auswahl des GPIO-Modus force_jtag im Handbuch:

<!-- Source CN PDF p.41, block 304 -->

![Technische Abbildung aus der chinesischen Quelle, S.41](/docs/rockchip-gpio/assets/cn-p41-figure1.png)

*Technische Abbildung aus der chinesischen Quelle, PDF S.41.*

`SYS_GRF_SOC_CON6` — Adresse: Betriebsbasis + Versatz (`0x0318`).

| Bit | Attribut | Reset-Wert | Beschreibung |
| --- | --- | --- | --- |
| 31:16 | WO | 0x0000 | write_enable: Individuelle Schreibfreigabe jedes unteren 16-Bit-Feldbits. 1'b0: Schreibzugriff gesperrt; 1'b1: Schreibzugriff freigegeben. |
| 15 | RW | 0x0 | pciephy_dtb_sel: PCIEPHY-DTB-Auswahl. 1'b0: PCIE0-PHY-DTB-Ausgang auf IO; 1'b1: PCIE1-PHY-DTB-Ausgang auf IO. |
| 14 | RW | 0x1 | force_jtag: Erzwingung von JTAG auf SDMMC-IO aktivieren. Ist force_jtag High, gpio4_d2_sel=0x1, gpio4_d3_sel=0x1 und SDMMC_DETECTN inaktiv, wird SDMMC-IO auf CPU-JTAG umgeschaltet. |

<!-- Source CN PDF p.41, block 305 -->

Löschen Sie das standardmäßig gesetzte force_jtag-Bit:

<!-- Source CN PDF p.41, block 306 -->

```text
io -4 0xFD58C318 0x40000000 #disable force_jtag
io -4 0xFD5F8098 0x0F000000 #iomux set to gpio
```

<!-- Source CN PDF p.41, block 307 -->

### 10.6 /sys/class/gpio fehlt im Android-SDK

<!-- Source CN PDF p.41, block 308 -->

Setzen Sie in device/rockchip/rk3588/BoardConfig.mk `BOARD_BUILD_GKI := false` und aktivieren Sie CONFIG_DEBUG_GPIO sowie CONFIG_GPIO_SYSFS in der Kernel-Konfiguration.

<!-- Source CN PDF p.41, block 309 -->

### 10.7 Falscher GPIO-Pegel beim Zurücklesen

<!-- Source CN PDF p.41, block 310 -->

1\. Ist IOMUX als GPIO konfiguriert?

<!-- Source CN PDF p.41, block 311 -->

2\. Ist das GPIO-DDR-Register für Eingang konfiguriert?

<!-- Source CN PDF p.41, block 312 -->

3\. Ist der GPIO-Takt aktiv?

<!-- Source CN PDF p.41, block 313 -->

4\. Besitzt GPIO einen internen/externen Pull-up?

<!-- Source CN PDF p.41, block 314 -->

5\. Lesen Sie GPIO_EXT_PORT zur Pegelprüfung. Dieses Register zeigt den tatsächlichen Pinpegel; IOMUX und DDR müssen daher korrekt konfiguriert sein und die Pull-Beschaltung darf keinen hochohmigen Zustand belassen.

<!-- Source CN PDF p.41, block 315 -->

### 10.8 GPIO-Interrupt an einen bestimmten Kern binden

<!-- Source CN PDF p.41, block 316 -->

Der folgende Patch verlegt die Interrupt-Affinität auf CPU2:

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

### 10.9 Reaktionslatenz von GPIO-Interrupts

<!-- Source CN PDF p.42, block 320 -->

1\. Interrupt-Affinität ändern.

<!-- Source CN PDF p.42, block 321 -->

2\. CONFIG_HZ=1000 // Timer-Tick-Intervall ändern

<!-- Source CN PDF p.42, block 322 -->

- Hoher HZ-Wert, etwa 1000: Alle 1ms erfolgt ein Timer-Interrupt; der Scheduler reagiert auf eine neue Aufgabe mit höchstens 1ms Verzögerung.
- Niedriger HZ-Wert, etwa 100: Alle 10ms erfolgt ein Interrupt; die Aufgabenwechsel-Latenz kann 10ms erreichen.

<!-- Source CN PDF p.42, block 323 -->

3\. CPU-Frequenz erhöhen.

<!-- Source CN PDF p.42, block 324 -->

4\. Echtzeitpatch gemäß Dokumentation in `docs\Patches\Real-Time-Performance` anwenden.

{% endraw %}
