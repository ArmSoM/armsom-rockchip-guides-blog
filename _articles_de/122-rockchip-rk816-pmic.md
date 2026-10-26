---
title: "Vollständiger Rockchip RK816 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging"
description: "Vollständiger Rockchip RK816 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging — V1.0.1"
excerpt: "Vollständiger Rockchip RK816 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging — V1.0.1"
translation_key: 122-rockchip-rk816-pmic
slug: 122-rockchip-rk816-pmic
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, RK816, PMIC, DTS, regulator]
---

{% raw %}

# Vollständiger Rockchip RK816 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging

Chinesische Quelle V1.0.1, Kernelbereich 3.10 / 4.4 / 4.19. Das technische Vorwort beschreibt Konzepte, Funktionen, DTS und Fehlersuche der RK816-Teilmodule; der technische Text bleibt vollständig erhalten. Kein englisches PDF vorhanden: Alle vier Sprachen verwenden Originalbilder des chinesischen PDFs, teils bereits englisch beschriftet. Nur Plattformreferenz: PMIC, SoC, Versorgungsbaum, Pins, SDK/BSP und Kernel der konkreten ArmSoM prüfen. Keine pauschale Unterstützung aller Platinen und keine Hardwaretests.

> Spannungs-, Pinmodus- und Registeränderungen können Hardware abschalten oder beschädigen; Quellenbeispiele wurden nicht ausgeführt. `0.737.5`, Unterschiede zwischen Spannungs-/Sequenztabellen, `regulator-ramp-delay` 12500 gegenüber 6001 im Beispiel sowie „vier Funktionen“ bei abweichender Listenzahl bleiben ohne vermutete Korrekturen erhalten. Das Hauptattributbeispiel reg = <0x18> weicht von 0x1a im vollständigen DTS und der I2C-Adresse ab; unverändert übernommen und vor Nutzung zu prüfen. Auch der Pinname NRESPWON bleibt wie im Originalbild.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Grundlagen

### 1.1 Übersicht

RK816 ist ein leistungsfähiger PMIC mit 4 Hochstrom-DCDCs, 1 BOOST-Wandler, 6 LDOs, 1 OTG-Ausgang, 1 RTC und einstellbarer Einschaltsequenz. Außerdem integriert er Schaltladung, intelligentes Leistungspfadmanagement und einen Coulomb-Zähler. Die Versorgungen werden in DCDC und LDO eingeteilt; allgemeine Eigenschaften folgen, weitere Details stehen in anderer Literatur.

1. DCDC: hoher Wirkungsgrad bei großer Ein-/Ausgangsspannungsdifferenz, jedoch relativ hohe Welligkeit und Kosten; daher für große Spannungsabfälle und hohe Lastströme. Übliche Modi sind PWM mit gutem Welligkeits-/Transientenverhalten, aber geringerem Wirkungsgrad, und PFM mit höherem Wirkungsgrad, jedoch geringerer Belastbarkeit.

2. LDO: geringer Wirkungsgrad bei großer Spannungsdifferenz, aber niedrige Kosten. Zur Verbesserung des Wirkungsgrads wird das System optimiert: Ein LDO mit 1.1V Ausgang kann beispielsweise vom DCDC VCCIO_3.3V gespeist werden. Soweit die Schaltung dies erlaubt, den LDO an einen DCDC-Ausgang anschließen und die Einschaltreihenfolge beachten.

### 1.2 Funktionen

Aus Anwendersicht werden die RK816-Funktionen als vier Bereiche beschrieben:

1. regulator: steuert den Zustand der einzelnen DCDC- und LDO-Versorgungen.

2. rtc: Zeitführung, Zeitsteuerung und verwandte Funktionen.

3. gpio: out1 und out2 sind Push-Pull-Ausgänge, als allgemeine GPIOs nutzbar, jedoch nur als Ausgang.

4. pwrkey: erkennt Drücken/Loslassen der Einschalttaste und spart einen AP-GPIO.

5. Lade- und Fuel-Gauge-Funktionen werden hier nicht näher beschrieben; siehe Rockchip_RK818_RK816_Developer_Guide_Fuel_Gauge_CN.

### 1.3 Pinfunktionen

![Originalabbildung aus dem chinesischen PDF · p5](/docs/rockchip-rk816-pmic/assets/cn-p005-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p5*

Bei den folgenden Beschreibungen besonders auf die Pins SLEEP und INT achten.

![Originalabbildung aus dem chinesischen PDF · p6](/docs/rockchip-rk816-pmic/assets/cn-p006-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p6*

![Originalabbildung aus dem chinesischen PDF · p6](/docs/rockchip-rk816-pmic/assets/cn-p006-figure-02.png)

*Originalabbildung aus dem chinesischen PDF · p6*

Bearbeitbare Abschrift der Originaltabellen oben.

| Pinnummer | Name | Beschreibung |
| --- | --- | --- |
| 1 | SCL | I2C-Takteingang |
| 2 | SDA | I2C-Datenein-/ausgang |
| 3 | INT | Interruptanforderung |
| 4 | SW5 | Schaltknoten von Ladegerät/Boost-Wandler |
| 5 | MIDU | USB-Versorgungsmittelpunkt/Boost-Ausgang |
| 6 | USB | Versorgung für USB |
| 7 | VCC3 | Versorgung für BUCK3 |
| 8 | SW3 | Schaltknoten von BUCK3 |
| 9 | VFB3 | Ausgangsspannungsrückführung von BUCK3 |
| 10 | XIN | Eingang des 32.768KHz-Quarzoszillators |
| 11 | XOUT | Ausgang des 32.768KHz-Quarzoszillators |
| 12 | PWRON | Ein-/Ausschaltfreigabe, aktiv Low; interner 20k-Pull-up zur Versorgung |
| 13 | VCC2 | Versorgung für BUCK2 |
| 14 | SW2 | Schaltknoten von BUCK2 |
| 15 | VFB2 | Ausgangsspannungsrückführung von BUCK2 |
| 16 | VCC1 | Versorgung für BUCK1 |
| 17 | SW1 | Schaltknoten von BUCK1 |
| 18 | VFB1 | Ausgangsspannungsrückführung von BUCK1 |
| 19 | NRESPWON | Reset nach Einschalten, aktiv Low |
| 20 | CLK32K | 32.768KHz-Taktausgang, Open Drain |
| 21 | LDO3 | LDO3-Ausgang |
| 22 | VCC5 | Versorgung für LDO1/2/3 |
| 23 | LDO1 | LDO1-Ausgang |
| 24 | LDO2 | LDO2-Ausgang |
| 25 | REFGND | Referenzmasse |
| 26 | VREF | Interne Referenzspannung |
| 27 | LDO4 | LDO4-Ausgang |
| 28 | LDO5 | LDO5-Ausgang |
| 29 | VCC6 | Versorgung für LDO4/5/6 |
| 30 | LDO6 | LDO6-Ausgang |
| 31 | VCCRTC | RTC-Versorgung; mit 1uF gegen GND entkoppeln |
| 32 | SNSN | Negativer Messanschluss für Batterielade-/entladestrom |
| 33 | SNSP | Positiver Messanschluss für Batterielade-/entladestrom |
| 34 | TS(GPIO1) | Thermistoreingang; Thermistor nach Masse, meist im Akkupack; Mehrfachfunktion GPIO1 |
| 35 | BAT | Batteriepluspol |
| 36 | SYS | Systemanschluss |
| 37 | SW4 | Schaltknoten von BUCK4 |
| 38 | VFB4 | Ausgangsspannungsrückführung von BUCK4 |
| 39 | VCC4 | Versorgung für BUCK4 |
| 40 | SLEEP | Steuereingang für Schlafmodus |
| Exposed pad | Exposed ground | Masse |

### 1.4 Wichtige Konzepte

I2C-Adresse: 7-Bit-Slaveadresse `0x1a`. Der PMIC besitzt drei Betriebsarten.

1. PMIC normal: Im normalen Systembetrieb befindet sich der PMIC im normal-Modus; pmic_sleep ist Low.

2. PMIC sleep reduziert den Eigenverbrauch beim System-Suspend. Produktspezifisch werden einzelne Spannungen gesenkt oder Ausgänge abgeschaltet. Im Standby konfiguriert der AP pmic_sleep über I2C für sleep und setzt ihn auf High. Beim SoC-Aufwachen wird der Pin wieder Low und der PMIC verlässt sleep.

3. PMIC shutdown: Beim Herunterfahren schaltet der PMIC die gesamte Systemversorgung ab. Der AP konfiguriert pmic_sleep über I2C für shutdown und setzt anschließend pmic_sleep auf High.

Pin pmic_sleep:

Normalerweise Low für den normal-Modus; High schaltet auf sleep oder shutdown um.

**pmic_int:** normalerweise High; ein Interrupt zieht den Pin auf Low. Er bleibt Low, bis der Interrupt bearbeitet wurde.

**pmic_pwron:** Die physische Einschalttaste an diesen Pin anschließen; der Treiber erkennt darüber Drücken und Loslassen.

**DCDC-Modi:** Neben PWM (force PWM) und PFM schaltet AUTO dynamisch zwischen PWM und PFM um. Der PMIC unterstützt PWM und AUTO PWM/PFM. AUTO bietet höheren Wirkungsgrad, aber schlechteres Welligkeits-/Transientenverhalten. Für Stabilität wird im Betrieb PWM und im Suspend AUTO PWM/PFM verwendet.

**DCDC3-Spannung:** Diese besondere Schiene ist nicht per Register einstellbar, sondern über externe Spannungsteilerwiderstände. Spannungsänderungen erfordern daher Hardwareänderungen. In Rockchip-Designs wird sie meist für VCC_DDR verwendet.

**Einstellbereiche von DCDC und LDO im Betrieb:**

**out1/out2:** allgemeine Push-Pull-GPIOs, ausschließlich Ausgangsmodus.

1. Nicht kontinuierliche DCDC-Spannungsbereiche:

| Spannungsbereich (V) | Schritt (mV) | Spannungsstufen (V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 2.2 | 200 | 1.8、 2.0、2.2 |
| 2.3 | Keiner | 2.3 |

2. Kontinuierliche LDO-Spannungen:

| Spannungsbereich (V) | Schritt (mV) | Spannungsstufen (V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、 0.9、1.0、1.1、 1.2、 ...... 3.4 |

### 1.5 Einschaltbedingungen und -sequenz

1. Einschaltbedingungen: Eine der folgenden Bedingungen reicht aus:

- EN wechselt von Low auf High.
- EN bleibt High und ein RTC-Alarminterrupt tritt auf.
- EN bleibt High und die PWRON-Taste wird gedrückt.

2. Einschaltsequenz: SoC-Plattformen können unterschiedliche Reihenfolgen der Versorgungsschienen verlangen. Die Sequenzen sind unten dargestellt; Einzelheiten dem aktuellen passenden Datenblatt entnehmen.

![Originalabbildung aus dem chinesischen PDF · p8](/docs/rockchip-rk816-pmic/assets/cn-p008-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p8*


Sequenztabelle aus dem Originalbild; Leerfelder, x, OTP und ON/OFF bleiben erhalten.

| Schiene | Ausgangsbereich | Maximalstrom | 1 (RK816B-1) Standardspannung | 1 (RK816B-1) Reihenfolge | 0 (RK816B-2) Standardspannung | 0 (RK816B-2) Reihenfolge | 0 (RK816B-3) Standardspannung | 0 (RK816B-3) Reihenfolge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUCK1 | 0.7125V-2.3V (0.7125-1.45V, Schritt 12.5mV) | 2A | 1.1V | 2 | 1.0V | 3 | 1.1V | 2 |
| BUCK2 | 0.7125V-2.3V (0.7125-1.45V, Schritt 12.5mV) | 2A | 1.1V | 1 | 2.2V | 1 | 1.1V | 1 |
| BUCK3 | externe Widerstände | 1A | x | 3 | x | 4 | x | 3 |
| BUCK4 | 0.8V-3.5V (Schritt 0.1V) | 1A | 3.3V | 1 | 3.3V | 6 | 3.3V | 1 |
| BOOST | 4.7V-5.4V (Schritt 0.1V) | 2A | 5V | OFF | 5V | OFF | 5V | OFF |
| LDO1 | 0.8V-3.4V (Schritt 0.1V) | 300mA | 1.0V | OFF | 1.0V | 2 | 1.8V | OFF |
| LDO2 | 0.8V-3.4V (Schritt 0.1V) | 300mA | 1.8V | 1 | 1.8V | 5 | 1.8V | 1 |
| LDO3 | 0.8V-3.4V (Schritt 0.1V) | 100mA | 1.1V | 1 | 1.0V | 2 | 1.1V | 1 |
| LDO4 | 0.8V-3.4V (Schritt 0.1V) | 300mA | 1.0V | OFF | 3.3V | 6 | 3.3V | OFF |
| LDO5 | 0.8V-3.4V (Schritt 0.1V) | 300mA | 3.0V | 4 | 1.8V | OFF | 3.3V | 4 |
| LDO6 | 0.8V-3.4V (Schritt 0.1V) | 300mA | 3.0V | 4 | 2.8V | OFF | 3.3V | 4 |

## 2. Konfiguration

### 2.1 Treiber und menuconfig

Kernel-3.10-Konfiguration. RK816-Treiberdateien (Wiederverwendung des RK816-Treibers):

```text
drivers/mfd/rk816.c
drivers/input/misc/rk816-pwrkey.c
drivers/rtc/rtc-rk816.c
drivers/gpio/gpio-rk816.c
drivers/regulator/rk816-regulator.c
drivers/power/rk816_battery.c
```

RK816-DTS-Referenzdatei:

```text
arch/arm/boot/dts/rk816.dtsi
arch/arm/boot/dts/rk3126-86v-rk816.dts
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK816
CONFIG_GPIO_RK816
CONFIG_RTC_RK816
CONFIG_REGULATOR_RK816
CONFIG_INPUT_RK816_PWRKEY
CONFIG_BATTERY_RK816
```

Kernel-4.4-Konfiguration. RK816-Treiberdateien:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk8xx-pwrkey.c
drivers/rtc/rtc-rk808.c
drivers/gpio/gpio-rk8xx.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
drivers/power/rk816_battery.c
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_GPIO_RK8XX
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK8XX_PWRKEY
CONFIG_COMMON_CLK_RK808
CONFIG_BATTERY_RK816
```

Kernel-4.19-Konfiguration. RK816-Treiberdateien:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk816-pwrkey.c       // 跟4.4内核不同
drivers/rtc/rtc-rk808.c
drivers/pinctrl/pinctrl-rk816.c         // 跟4.4内核不同
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
drivers/power/rk816_battery.c
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_PINCTRL_RK816
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK816_PWRKEY
CONFIG_COMMON_CLK_RK808
CONFIG_BATTERY_RK816
```

### 2.2 DTS-Konfiguration

Kernel-3.10-Konfiguration

Die DTS-Konfiguration umfasst I2C-Anbindung, Haupteigenschaften, regulator, rtc und poweroff.

```text
&i2c1 {
    rk816: rk816@1a {
        reg = <0x1a>;
        status = "okay";
    };
};

/include/ "rk816.dtsi"
&rk816 {
    gpios = <&gpio1 GPIO_A5 GPIO_ACTIVE_HIGH>, <&gpio1 GPIO_A1 GPIO_ACTIVE_LOW>;
    rk816,system-power-controller;
    rk816,support_dc_chg = <1>;/*1: dc chg; 0:usb chg*/
    io-channels = <&adc 0>;
    gpio-controller;
    #gpio-cells = <2>;
    rtc {
        status = "okay";
    };

    regulators {
        rk816_dcdc1_reg: regulator@0{
            regulator-name= "vdd_arm";
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x1>;
            regulator-initial-state = <3>;
            regulator-always-on;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-disabled;
                regulator-state-uv = <900000>;
            };
        };

        rk816_dcdc2_reg: regulator@1 {
            regulator-name= "vdd_logic";
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x1>;
            regulator-initial-state = <3>;
            regulator-always-on;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-enabled;
                regulator-state-uv = <1000000>;
            };
        };
        rk816_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

1. I2C-Anbindung: Den vollständigen RK816-Knoten unter dem passenden i2c-Knoten platzieren und `status = "okay";` setzen.

2. Haupteigenschaften — Folgendes nicht ändern:

`rk816,system-power-controller`: erklärt RK816 für das Abschalten des Systems zuständig.

`gpio-controller`: erklärt die GPIO-Funktionalität des RK816.

`#gpio-cells`: Anzahl erforderlicher Argumente beim Referenzieren der RK816-GPIOs.

Ein RK816-GPIO wird mit `gpios = <&rk816 0 GPIO_ACTIVE_LOW>;` referenziert. Erstes Argument &rk816 ist fest. Zweites: GPIO-Index, nur 0 = out1 oder 1 = out2. Drittes: GPIO-Polarität. Die konfigurierbare Haupteigenschaft gpios gibt zuerst pmic_int und danach pmic_sleep an.

3. regulator

- `regulator-name`: Versorgungsname; möglichst wie im Schaltplan. regulator_get verwendet diesen Namen.

- `regulator-min-microvolt`: Kleinste einstellbare Betriebsspannung.

- `regulator-max-microvolt`: Größte einstellbare Betriebsspannung.

- `regulator-initial-mode`: DCDC-Betriebsmodus, normalerweise 1: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-state-mode`: DCDC-Suspend-Modus, normalerweise 2: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-initial-state`: Suspend-Zustand; muss 3 sein.

- `regulator-boot-on`: Aktiviert die Schiene bei der Regulator-Registrierung.

- `regulator-always-on`: Verbietet Abschalten im Betrieb und aktiviert die Schiene bei der Registrierung.

- `regulator-state-enabled`: Im Suspend eingeschaltet lassen; zum Abschalten durch regulator-state-disabled ersetzen.

- `regulator-state-uv`: Standby-Spannung bei weiterhin eingeschalteter Schiene.

Hinweise:

Sind regulator-min-microvolt und regulator-max-microvolt gleich, stellt das Framework bei der Registrierung diese Spannung ein und aktiviert die Schiene ohne Benutzereingriff.

Bei regulator-boot-on oder regulator-always-on aktiviert das Framework die Schiene bei der Registrierung. Sind Minimum und Maximum gleich, wird diese Spannung gesetzt; andernfalls bleibt die Hardware-Standard-Einschaltspannung des PMIC bestehen.

4. rtc: Wird RTC nicht benötigt (etwa bei einer Box), den oben gezeigten Knoten hinzufügen und ausdrücklich `status = "disabled"` setzen. Zum Aktivieren den gesamten RTC-Knoten entfernen oder `status = "okay"` setzen.

5. poweroff

```text
gpio_poweroff {
    compatible = "gpio-poweroff";
    gpios = <&gpio2 GPIO_D2 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

RK816 kann den gesamten PMIC durch High an pmic_sleep abschalten; daher diesen Knoten an der Wurzel hinzufügen. Die konfigurierbare Eigenschaft gpios bezeichnet pmic_sleep. Ohne Registrierung dieser Funktion ist auch Software-Shutdown des RK816 wie bei RK808 und RK818 möglich.

Kernel-4.4-DTS: i2c-Anbindung, Haupteigenschaften, rtc, pwrkey, gpio und regulator.

```text
&pinctrl {
    pmic {
        pmic_int_l: pmic-int-l {
        rockchip,pins =
            <2 6 RK_FUNC_GPIO &pcfg_pull_up>;   /* gpio2_a6 */
        };
    };
};
&i2c1 {
    status = "okay";
    rk816: pmic@1a {
        compatible = "rockchip,rk816";
        reg = <0x1a>;
        interrupt-parent = <&gpio0>;
        interrupts = <2 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l>;
        rockchip,system-power-controller;
        wakeup-source;
        gpio-controller;
        #gpio-cells = <2>;
        #clock-cells = <1>;
        clock-output-names = "rk816-clkout1", "rk816-clkout2";
        extcon = <&u2phy>;
        vcc1-supply = <&vcc_sys>;
        vcc2-supply = <&vcc_sys>;
        vcc3-supply = <&vcc_sys>;
        vcc4-supply = <&vcc_sys>;
        vcc5-supply = <&vcc_io>;
        vcc6-supply = <&vcc_sys>;
        gpio {
            status = "okay";
        };
        pwrkey {
            status = "okay";
        };
        rtc {
            status = "okay";
        };
        battery {
            compatible = "rk816-battery";
            ocv_table = < 3500 3625 3685 3697 3718 3735 3748
                    3760 3774 3788 3802 3816 3834 3853
                    3877 3908 3946 3975 4018 4071 4106>;
            design_capacity = <2500>;
            design_qmax = <2750>;
            bat_res = <100>;
            max_input_current = <1500>;
            max_chrg_current = <1300>;
            max_chrg_voltage = <4200>;
            sleep_enter_current = <300>;
            sleep_exit_current = <300>;
            sleep_filter_current = <100>;
            power_off_thresd = <3500>;
            zero_algorithm_vol = <3850>;
            max_soc_offset = <60>;
            monitor_sec = <5>;
            virtual_power = <0>;
            power_dc2otg = <0>;
            dc_det_adc = <0>;
        };

        regulators {

            vdd_arm: DCDC_REG1{
                regulator-name= "vdd_arm";
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1500000>;
                regulator-ramp-delay = <6001>;
                regulator-initial-mode = <1>;
                regulator-always-on;
                regulator-boot-on;
                regulator-state-mem {
                    regulator-off-in-suspend;
                    regulator-suspend-microvolt = <900000>;
                };
            };

            vdd_log: DCDC_REG2 {
                regulator-name= "vdd_logic";
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1500000>;
                regulator-ramp-delay = <6001>;
                regulator-initial-mode = <1>;
                regulator-always-on;
                regulator-boot-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };
            vcc_ddr: RK816_DCDC3@2 {
                .................
            };
            .............................
        };
    };
};
```

1. i2c-Anbindung: Den vollständigen RK816-Knoten unter dem zugehörigen i2c-Knoten platzieren und `status = "okay";` setzen.

2. Haupteigenschaften — Folgendes nicht ändern:

```text
compatible = "rockchip,rk816";
reg = <0x18>;
rockchip,system-power-controller;
wakeup-source;
gpio-controller;
#gpio-cells = <2>;
```

Konfigurierbar nach pinctrl-Regeln:

- interrupt-parent: GPIO-Controller von pmic_int.
- interrupts: Pinindex und Polarität von pmic_int auf diesem Controller.
- pinctrl-names: nicht ändern, fest "default".
- pinctrl-0: Verweis auf den in pinctrl definierten pmic_int-Pin.

3. rtc, pwrkey und gpio: Sind sie in menuconfig gewählt, werden aber nicht benötigt, die entsprechenden DTS-Knoten mit `status = "disabled"` hinzufügen. Die Treiber werden nicht geladen; dadurch entstehende Bootfehler können hier ignoriert werden. Zum Aktivieren die Knoten entfernen oder `status = "okay"` setzen.

4. regulator

- `regulator-compatible`: Für die Treiberzuordnung erforderlicher Name; Änderungen verhindern das Laden.

- `regulator-name`: Versorgungsname; möglichst wie im Schaltplan. regulator_get verwendet diesen Namen.

- `regulator-init-microvolt`: Initialspannung in U-Boot; im Kernel unwirksam.

- `regulator-min-microvolt`: Kleinste einstellbare Betriebsspannung.

- `regulator-max-microvolt`: Größte einstellbare Betriebsspannung.

- `regulator-initial-mode`: DCDC-Betriebsmodus, normalerweise 1: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-mode`: DCDC-Suspend-Modus, normalerweise 2: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-initial-state`: Suspend-Zustand; muss 3 sein.

- `regulator-boot-on`: Aktiviert die Schiene bei der Regulator-Registrierung.

- `regulator-always-on`: Verbietet Abschalten im Betrieb und aktiviert die Schiene bei der Registrierung.

- `regulator-ramp-delay`: DCDC-Spannungsanstiegszeit; fester Quellenwert 12500.

- `regulator-on-in-suspend`: Im Suspend eingeschaltet lassen; zum Abschalten durch regulator-off-in-suspend ersetzen.

- `regulator-suspend-microvolt`: Standby-Spannung bei weiterhin eingeschalteter Schiene.

Kernel-4.19-DTS-Konfiguration

Siehe Kernel-4.4-DTS. Unterschied: Kernel 4.19 benötigt keinen gpio-Unterknoten mehr; andere Module referenzieren RK816-Pins weiterhin mit `gpios = <&rk816 0 GPIO_ACTIVE_LOW>;`.

### 2.3 Funktionsschnittstellen

Die folgenden Schnittstellen decken übliche Regulator-Funktionen ab: Ein-/Ausschalten sowie Spannung setzen und lesen.

1. Regulator anfordern:

`struct regulator *regulator_get(struct device *dev, const char *id)`

Für dev standardmäßig NULL verwenden; id entspricht regulator-name in DTS.

2. Freigeben regulator:

`void regulator_put(struct regulator *regulator)`

3. Einschalten regulator:

`int regulator_enable(struct regulator *regulator)`

4. Ausschalten regulator:

`int regulator_disable(struct regulator *regulator)`

5. Spannung lesen regulator:

`int regulator_get_voltage(struct regulator *regulator)`

6. Regulator-Spannung setzen:

`int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)`

Der Aufrufer muss min_uV = max_uV sicherstellen.

7. Beispiel

```text
struct regulator *rdev_logic;

rdev_logic = regulator_get(NULL, "vdd_logic");          // 获取vdd_logic
regulator_enable(rdev_logic);                           // 使能vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
regulator_disable(rdev_logic);                          // 关闭vdd_logic
regulator_put(rdev_logic);                              // 释放vdd_logic
```

Kernel 4.4 und 4.19 stellen außerdem Regulator-Schnittstellen mit devm_-Präfix zur Verwaltung angeforderter Ressourcen bereit.

## 3. Debug

### 3.1 3.10 Kernel

Die PMIC-Treiberlogik ist relativ einfach; entscheidend sind die endgültigen Registereinstellungen. Eine übliche Debugmethode ist die Registerprüfung über `/sys/rk816/rk816_test`.

Lesen: `echo r [addr] > /sys/rk816/rk816_test`

Schreiben: `echo w [addr] [value] > /sys/rk816/rk816_test`

Beispiel: `echo r 0x2f > /sys/rk816/rk816_test` liest Register 0x2f; das Quellenergebnis ist 0x9b.

![Originalabbildung aus dem chinesischen PDF · p16](/docs/rockchip-rk816-pmic/assets/cn-p016-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p16*

`echo w 0x2f 0x9c > /sys/rk816/rk816_test` setzt Register 0x2f auf 0x9c. Danach zur Kontrolle erneut lesen.

![Originalabbildung aus dem chinesischen PDF · p17](/docs/rockchip-rk816-pmic/assets/cn-p017-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p17*

> Quellenprüfung: Das Schreibbeispiel nennt 0x9c; das folgende Originalbild zeigt weiterhin 0x9b und wiederholt den vorherigen Screenshot. Es belegt keinen erfolgreichen Schreibzugriff; separat und sicher an realer Hardware prüfen.

### 3.2 4.4 Kernel

Das Befehlsformat entspricht Kernel 3.10; nur der Pfad unterscheidet sich. Kernel 4.4 verwendet `/sys/rk8xx/rk8xx_dbg`.

### 3.3 4.19 Kernel

Siehe die Befehle für Kernel 4.4.

{% endraw %}
