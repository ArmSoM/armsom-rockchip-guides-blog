---
title: "Vollständiger Rockchip RK808 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging"
description: "Vollständiger Rockchip RK808 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging — V1.0.1"
excerpt: "Vollständiger Rockchip RK808 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging — V1.0.1"
translation_key: 120-rockchip-rk808-pmic
slug: 120-rockchip-rk808-pmic
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, RK808, PMIC, DTS, regulator]
---

{% raw %}

# Vollständiger Rockchip RK808 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging

Chinesische Quelle V1.0.1, Kernelbereich 3.10 / 4.4 / 4.19. Das technische Vorwort beschreibt Konzepte, Funktionen, DTS und Fehlersuche der RK808-Teilmodule; der technische Text bleibt vollständig erhalten. Kein englisches PDF vorhanden: Alle vier Sprachen verwenden Originalbilder des chinesischen PDFs, teils bereits englisch beschriftet. Nur Plattformreferenz: PMIC, SoC, Versorgungsbaum, Pins, SDK/BSP und Kernel der konkreten ArmSoM prüfen. Keine pauschale Unterstützung aller Platinen und keine Hardwaretests.

> Spannungs-, Pinmodus- und Registeränderungen können Hardware abschalten oder beschädigen; Quellenbeispiele wurden nicht ausgeführt. `0.737.5`, Unterschiede zwischen Spannungs-/Sequenztabellen, `regulator-ramp-delay` 12500 gegenüber 6001 im Beispiel sowie „vier Funktionen“ bei abweichender Listenzahl bleiben ohne vermutete Korrekturen erhalten. Mit dem Datenblatt prüfen: INT standardmäßig aktiv High in der Tabelle gegenüber Low im Text, VCC11 in der VCC10-Zeile, Typ I für OSC32KOUT und unvollständige VCCA-Beschreibung. Beim Quellenwert 1.8/OFF für LDO7 fehlt V.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Grundlagen

### 1.1 Übersicht

RK808 ist ein leistungsfähiger PMIC mit 4 Hochstrom-DCDCs, 8 LDOs, 2 SWITCH-Ausgängen, 1 RTC und einstellbarer Einschaltsequenz. Die Versorgungsschienen werden allgemein in DCDC und LDO eingeteilt. Ihre allgemeinen Eigenschaften folgen; Einzelheiten sind in weiterführenden Unterlagen nachzulesen.

1. DCDC: hoher Wirkungsgrad bei großer Ein-/Ausgangsspannungsdifferenz, jedoch relativ hohe Welligkeit und Kosten; daher für große Spannungsabfälle und hohe Lastströme. Übliche Modi sind PWM mit gutem Welligkeits-/Transientenverhalten, aber geringerem Wirkungsgrad, und PFM mit höherem Wirkungsgrad, jedoch geringerer Belastbarkeit.

2. LDO: geringer Wirkungsgrad bei großer Spannungsdifferenz, aber niedrige Kosten. Zur Verbesserung des Wirkungsgrads wird das System optimiert: Ein LDO mit 1.1V Ausgang kann beispielsweise vom DCDC VCCIO_3.3V gespeist werden. Soweit die Schaltung dies erlaubt, den LDO an einen DCDC-Ausgang anschließen und die Einschaltreihenfolge beachten.

### 1.2 Funktionen

Aus Anwendersicht werden die RK808-Funktionen als vier Bereiche beschrieben:

1. regulator: steuert den Zustand der einzelnen DCDC- und LDO-Versorgungen.

2. rtc: Zeitführung, Zeitsteuerung und verwandte Funktionen.

3. clk: zwei 32.768KHZ-Taktausgänge; einer ist ständig aktiv und nicht steuerbar, der andere wird per Software gesteuert.

### 1.3 Pinfunktionen

![Originalabbildung aus dem chinesischen PDF · p5](/docs/rockchip-rk808-pmic/assets/cn-p005-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p5*

Bei den folgenden Beschreibungen besonders auf die Pins SLEEP und INT achten.

![Originalabbildung aus dem chinesischen PDF · p6](/docs/rockchip-rk808-pmic/assets/cn-p006-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p6*

![Originalabbildung aus dem chinesischen PDF · p7](/docs/rockchip-rk808-pmic/assets/cn-p007-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p7*

![Originalabbildung aus dem chinesischen PDF · p8](/docs/rockchip-rk808-pmic/assets/cn-p008-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p8*

![Originalabbildung aus dem chinesischen PDF · p9](/docs/rockchip-rk808-pmic/assets/cn-p009-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p9*

Bearbeitbare Abschrift der Originaltabellen oben.

| Pinnummer | Name | Versorgungen | Funktionsblock | Typ | I/O | Beschreibung | PU/PD |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 9 | VCCRTC | VCCRTC/AGND | RTC | Power | O | RTC-Versorgung | NO |
| 65 | OSC32KIN | VCCRTC/DGND | RTC | Analog | I | 32KHz-Quarzoszillatoreingang | NO |
| 66 | OSC32KOUT | VCCRTC/DGND | RTC | Analog | I | 32KHz-Quarzoszillatorausgang | NO |
| 68 | CLK32KOUT1 | VCCRTC/DGND | RTC | Digital | O | 32KHz-Taktausgang 1, Open Drain, immer aktiv | NO |
| 67 | CLK32KOUT2 | VCCRTC/DGND | RTC | Digital | O | 32KHz-Taktausgang 2, Open Drain | PD |
| 37 | VREF | VCCA/REFGND | REFERENCE | Analog | O | Bandgap-Spannung | PD |
| 64 | VREFGND | REFGND | REFERENCE | Analog | Gnd | Referenzmasse | NO |
| 36 | VCCA | VCCA/GNDA | Analog Power | Power | I | Versorgung für (Original unvollständig) | NO |
| 6 | VPPOTP | VPPOTP/GNDA | Analog Power | Power | I | Versorgung für OTP | NO |
| 45 | VCC1 | VCC1/GND1 | BUCK1 | Power | I/O | Versorgung für BUCK1 DC-DC | NO |
| 44 | VCC1 | VCC1/GND1 | BUCK1 | Power | I/O | Versorgung für BUCK1 DC-DC | NO |
| 43 | SW1 | VCC1/GND1 | BUCK1 | Power | I/O | BUCK1 DC-DC switch-Ausgang | PD |
| 42 | SW1 | VCC1/GND1 | BUCK1 | Power | I/O | BUCK1 DC-DC switch-Ausgang | PD |
| 41 | GND1 | VCC1/GND1 | BUCK1 | Power | Gnd | Masse | NO |
| 40 | GND1 | VCC1/GND1 | BUCK1 | Power | Gnd | Masse | NO |
| 39 | VFB1 | VCC1/REFGND | BUCK1 | Analog | I | Ausgangsspannungsrückführung von BUCK1 DC-DC switch | PD |
| 23 | VCC2 | VCC2/GND2 | BUCK2 | Power | I | Versorgung für BUCK2 DC-DC | NO |
| 24 | VCC2 | VCC2/GND2 | BUCK2 | Power | I | Versorgung für BUCK2 DC-DC | NO |
| 25 | SW2 | VCC2/GND2 | BUCK2 | Power | I/O | BUCK2 DC-DC switch-Ausgang | PD |
| 26 | SW2 | VCC2/GND2 | BUCK2 | Power | I/O | BUCK2 DC-DC switch-Ausgang | PD |
| 27 | GND2 | VCC2/GND2 | BUCK2 | Power | Gnd | Masse | NO |
| 28 | GND2 | VCC2/GND2 | BUCK2 | Power | Gnd | Masse | NO |
| 29 | VFB2 | VCC2/REFGND | BUCK2 | Analog | I | Ausgangsspannungsrückführung von BUCK2 DC-DC switch | PD |
| 59 | VCC3 | VCC3/GND3 | BUCK3 | Power | I | Versorgung für BUCK3 DC-DC | NO |
| 58 | SW3 | VCC3/GND3 | BUCK3 | Power | I/O | BUCK3 DC-DC switch-Ausgang | PD |
| 57 | GND3 | VCC3/GND3 | BUCK3 | Power | Gnd | Masse | NO |
| 56 | VFB3 | VCC3/REFGND | BUCK3 | Analog | I | Ausgangsspannungsrückführung von BUCK3 DC-DC switch | PD |
| 60 | VCC4 | VCC4/GND4 | BUCK4 | Power | I | Versorgung für BUCK4 DC-DC | NO |
| 61 | SW4 | VCC4/GND4 | BUCK4 | Power | I/O | BUCK4 DC-DC switch-Ausgang | PD |
| 62 | GND4 | VCC4/GND4 | BUCK4 | Power | Gnd | Masse | NO |
| 63 | VFB4 | VCC4/REFGND | BUCK4 | Analog | I | Ausgangsspannungsrückführung von BUCK4 DC-DC switch | PD |
| 47 | NC |  |  |  |  |  |  |
| 46 | GND5 | VCCA/GND5 | LDO1–8, SWITCH1,2 | Power | Gnd | Masse | NO |
| 48 | NC |  |  |  |  |  |  |
| 32 | VCC6 | VCC6/AGND | LDO1–8, SWITCH1,2 | Power | I | Versorgung für LDO1,LDO2 | NO |
| 4 | VCC7 | VCC7/AGND | LDO1–8, SWITCH1,2 | Power | I | Versorgung für LDO3,LDO7 | NO |
| 8 | VCC8 | VCC8/AGND | LDO1–8, SWITCH1,2 | Power | I | Versorgung für SWITCH1 | NO |
| 13 | VCC9 | VCC9/AGND | LDO1–8, SWITCH1,2 | Power | I | Versorgung für LDO4,LDO5 | NO |
| 1 | VCC10 | VCC11/AGND | LDO1–8, SWITCH1,2 | Power | I | Versorgung für LDO6 | NO |
| 16 | VCC11 | VCC11/AGND | LDO1–8, SWITCH1,2 | Power | I | Versorgung für LDO8 | NO |
| 10 | VCC12 | VCC12/AGND | LDO1–8, SWITCH1,2 | Power | I | Versorgung für SWITCH2 | NO |
| 31 | VLDO1 | VCC7/AGND | LDO1–8, SWITCH1,2 | Power | O | LDO1 regulator-Ausgang | PD |
| 33 | VLDO2 | VCC7/AGND | LDO1–8, SWITCH1,2 | Power | O | LDO2 regulator-Ausgang | PD |
| 3 | VLDO3 | VCC8/AGND | LDO1–8, SWITCH1,2 | Power | O | LDO3 regulator-Ausgang | PD |
| 12 | VLDO4 | VCC9/AGND | LDO1–8, SWITCH1,2 | Power | O | LDO4 regulator-Ausgang | PD |
| 14 | VLDO5 | VCC10/AGND | LDO1–8, SWITCH1,2 | Power | O | LDO5 regulator-Ausgang | PD |
| 2 | VLDO6 | VCC9/AGND | LDO1–8, SWITCH1,2 | Power | O | LDO6 regulator-Ausgang | PD |
| 5 | VLDO7 | VCC11/AGND | LDO1–8, SWITCH1,2 | Power | O | LDO7 regulator-Ausgang | PD |
| 15 | VLDO8 | VCC11/AGND | LDO1–8, SWITCH1,2 | Power | O | LDO8 regulator-Ausgang | PD |
| 7 | VSWOUT1 | VCC8/AGND | LDO1–8, SWITCH1,2 | Power | O | SWITCH1-Ausgang | PD |
| 11 | VSWOUT2 | VCC12/AGND | LDO1–8, SWITCH1,2 | Power | O | SWITCH2-Ausgang | PD |
| 30 | AGND | POWER PAD | Analog ground | Power | Gnd | Analogmasse | NO |
| 35 | VLDOA | POWER PAD | LDOA | Power | I/O | Versorgung der internen Analogschaltung | NO |
| 38 | DGND | POWER PAD | Digital ground | Power | Gnd | Digitalmasse | NO |
| 17 | VDDIO | VDDIO/DGND | IO | Power | I/O | Digitale I/O-Versorgung | NO |
| 50 | SLEEP | VDDIO/DGND | IO | Digital | I | Steuersignal für Aktiv-/Schlafwechsel | NO |
| 20 | NRESPWRON | VDDIO/DGND | IO | Digital | I/O | Abschalt-Reset für AP / externer Reset des Digitalkerns (ohne RTC) | PD im ausgeschalteten Zustand |
| 49 | INT | VDDIO/DGND | IO | Digital | O | Interruptflag; Polarität über I2C programmierbar, standardmäßig aktiv High | Programmierbares PU/PD |
| 51 | PWRON | VCCRTC/DGND | IO | Digital | I | Externe Einschaltsteuerung (ON-Taste) | NO |
| 18 | SDA | VDDIO/DGND | IO | Digital | I/O | I2C-Datensignal | NO |
| 19 | SCL | VDDIO/DGND | IO | Digital | I/O | I2C-Taktsignal | NO |
| 52 | BOOT0 | VCCRTC/DGND | IO | Digital | I | Auswahl der Einschaltsequenz | NO |
| 53 | BOOT1 | VCCRTC/DGND | IO | Digital | I | Auswahl der Einschaltsequenz | NO |
| 55 | EXT_EN | VCCRTC/DGND | IO | Digital | O | Ausgangsfreigabe für externen BUCK bei zwei Batteriezellen | PD |
| 22 | DVS1 | VDDIO/DGND | IO | Digital | I | BUCK1-DVS-/Normalspannungswechsel; I2C-programmierbare Polarität, standardmäßig aktiv High | NO |
| 21 | DVS2 | VDDIO/DGND | IO | Digital | I | BUCK2-DVS-/Normalspannungswechsel; I2C-programmierbare Polarität, standardmäßig aktiv High | NO |
| 54 | DVSOK | VDDIO/DGND | IO | Digital | O | BUCK1-/BUCK2-Power-good nach dynamischer Spannungseinstellung | PD |
| 34 | VDC | VDC/AGND | IO | Digital | I | Eingang zur Erkennung der Adapterspannung | NO |

### 1.4 Wichtige Konzepte

I2C-Adresse: 7-Bit-Slaveadresse `0x1b`. Der PMIC besitzt drei Betriebsarten.

1. PMIC normal: Im normalen Systembetrieb befindet sich der PMIC im normal-Modus; pmic_sleep ist Low.

2. PMIC sleep: Beim Suspend wechselt der PMIC zur Senkung seines Eigenverbrauchs in sleep. Dabei werden üblicherweise einige Ausgangsspannungen gesenkt oder Ausgänge abgeschaltet; dies ist produktspezifisch konfigurierbar. High an pmic_sleep aktiviert sleep. Beim Aufwachen des SoC wird pmic_sleep wieder Low und der PMIC verlässt sleep.

3. PMIC shutdown: Beim Herunterfahren schaltet der PMIC die gesamte Systemversorgung ab. Der AP konfiguriert pmic_sleep über I2C für shutdown und setzt anschließend pmic_sleep auf High.

Pin pmic_sleep:

Normalerweise Low für den normal-Modus; High schaltet auf sleep oder shutdown um.

**pmic_int:** normalerweise High; ein Interrupt zieht den Pin auf Low. Er bleibt Low, bis der Interrupt bearbeitet wurde.

**pmic_pwron:** Die physische Einschalttaste an diesen Pin anschließen; der Treiber erkennt darüber Drücken und Loslassen.

**DCDC-Modi:** Neben PWM (force PWM) und PFM schaltet AUTO dynamisch zwischen PWM und PFM um. Der PMIC unterstützt PWM und AUTO PWM/PFM. AUTO bietet höheren Wirkungsgrad, aber schlechteres Welligkeits-/Transientenverhalten. Für Stabilität wird im Betrieb PWM und im Suspend AUTO PWM/PFM verwendet.

**DCDC3-Spannung:** Diese besondere Schiene ist nicht per Register einstellbar, sondern über externe Spannungsteilerwiderstände. Spannungsänderungen erfordern daher Hardwareänderungen. In Rockchip-Designs wird sie meist für VCC_DDR verwendet.

**Einstellbereiche von DCDC und LDO im Betrieb:**

1. Kontinuierliche DCDC-Spannungsbereiche:

| Spannungsbereich (V) | Schritt (mV) | Spannungsstufen (V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 3.3 | 100 | 1.8、1.9、2.0、2.2....、3.3 |

2. Kontinuierliche LDO-Spannungen:

| Spannungsbereich (V) | Schritt (mV) | Spannungsstufen (V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、0.9、1.0、1.1、1.2、 ...... 3.4 |

### 1.5 Einschaltbedingungen und -sequenz

1. Einschaltbedingungen: Eine der folgenden Bedingungen reicht aus:

- EN wechselt von Low auf High.
- EN bleibt High und ein RTC-Alarminterrupt tritt auf.
- EN bleibt High und die PWRON-Taste wird gedrückt.

2. Einschaltsequenz: SoC-Plattformen können unterschiedliche Reihenfolgen der Versorgungsschienen verlangen. Die Sequenzen sind unten dargestellt; Einzelheiten dem aktuellen passenden Datenblatt entnehmen.

![Originalabbildung aus dem chinesischen PDF · p11](/docs/rockchip-rk808-pmic/assets/cn-p011-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p11*


Sequenztabelle aus dem Originalbild; Leerfelder, x, OTP und ON/OFF bleiben erhalten.

| Schiene | 00 Reihenfolge | 00 Standardspannung | 01 Reihenfolge | 01 Standardspannung | 10 Reihenfolge | 10 Standardspannung | 11 Reihenfolge | 11 Standardspannung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUCK1 | 4 | 1.1V/ON | 4 | 1.2V/ON | 4 | 1.0V/ON | OTP | OTP |
| BUCK2 | 5 | 1.1V/ON | 5 | 1.2V/ON | 4 | 1.0V/ON | OTP | OTP |
| BUCK3 | 2 | 1.2V/ON | 2 | 1.2V/ON | 3 | 1.2V/ON | OTP | OTP |
| BUCK4 | 1 | 3.0V/ON | 1 | 3.0V/ON | 1 | 3.0V/ON | OTP | OTP |
| LDO1 |  | 3.3V/OFF |  | 3.3V/OFF | 1 | 3.3V/ON | OTP | OTP |
| LDO2 |  | 3.3V/OFF | 2 | 3.3V/ON |  | 3.3V/OFF | OTP | OTP |
| LDO3 | 3 | 1.1V/ON | 3 | 1.2V/ON | 2 | 1.0V/ON | OTP | OTP |
| LDO4 | 3 | 2.5V/ON |  | 2.5V/OFF | 2 | 1.8V/ON | OTP | OTP |
| LDO5 |  | 2.8V/OFF |  | 2.8V/OFF |  | 2.8V/OFF | OTP | OTP |
| LDO6 |  | 1.2V/OFF |  | 1.2V/OFF |  | 1.2V/OFF | OTP | OTP |
| LDO7 |  | 1.8/OFF |  | 1.8V/OFF |  | 1.8V/OFF | OTP | OTP |
| LDO8 |  | 3.3V/OFF |  | 1.8V/OFF |  | 3.3V/OFF | OTP | OTP |
| SWITCH1 | 1 | 3.0V/ON | 1 | 3.0V/ON | 5 | 3.0V/ON | OTP | OTP |
| SWITCH2 |  | 3.0V/OFF |  | 3.0V/OFF |  | 3.0V/OFF | OTP | OTP |

## 2. Konfiguration

### 2.1 Treiber und menuconfig

#### 2.1.1 3.10 KernelKonfiguration

RK808-Treiberdateien:

```text
drivers/mfd/rk808.c
drivers/mfd/rk808-irq.c
drivers/rtc/rtc-rk808.c
```

RK808-DTS-Referenzdatei:

```text
arch/arm/boot/dts/rk808.dtsi
arch/arm/boot/dts/rk3288-evb-android-rk808-edp.dts
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
```

#### 2.1.2 4.4 KernelKonfiguration

RK808-Treiberdateien:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
```

RK808-DTS-Referenzdatei:

```text
arch/arm64/boot/dts/rockchip/rk3399-evb-rev3.dtsi
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_COMMON_CLK_RK808
```

#### 2.1.3 4.19 KernelKonfiguration

RK808-Treiberdateien:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_COMMON_CLK_RK808
```

### 2.2 DTS-Konfiguration

#### 2.2.1 3.10 Kernel DTS-Konfiguration

Die DTS-Konfiguration umfasst I2C-Anbindung, Haupteigenschaften, regulator, rtc und poweroff.

```text
&i2c1 {
    rk808: rk808@1b {
        reg = <0x1b>;
        status = "okay";
    };
};

/include/ "rk808.dtsi"
&rk808 {
    gpios = <&gpio0 GPIO_A4 GPIO_ACTIVE_HIGH>,
            <&gpio0 GPIO_B3 GPIO_ACTIVE_LOW>;
    rk808,system-power-controller;

    rtc {
        status = "disabled";
    };

    regulators {
        rk808_dcdc1_reg: regulator@0 {
            regulator-always-on;
            regulator-boot-on;
            regulator-min-microvolt = <750000>;
            regulator-max-microvolt = <1400000>;
            regulator-init-microvolt = <1300000>;
            regulator-name = "vdd_arm";
            regulator-state-mem {
                regulator-off-in-suspend;
            };
        };
        rk808_dcdc2_reg: regulator@1 {
                    .............
        };
        rk808_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

1. I2C-Anbindung: Den vollständigen RK808-Knoten unter dem passenden i2c-Knoten platzieren und `status = "okay";` setzen.

2. Haupteigenschaften — Folgendes nicht ändern:

`rk808,system-power-controller`: erklärt RK808 für das Abschalten des Systems zuständig.

Konfigurierbar: gpios gibt zuerst pmic_int und dann pmic_sleep an.

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

5. poweroff: Der RK808-Treiber fängt das Herunterfahren ab und schaltet PMIC-Ausgänge per I2C aus. rk808_shutdown ist als syscore shutdown für Vorbereitungen registriert, etwa Ausgabe der Abschaltspannungen und Deaktivierung von RTC-Interrupts.

```text
static void rk808_shutdown(void)
{
    int ret,i,val;
    u16 reg = 0;
    struct rk808 *rk808 = g_rk808;

    printk("%s\n",__func__);
    /***************get dc1\dc2 voltage *********************/
    for(i=0;i<2;i++){
    reg = rk808_reg_read(rk808,rk808_BUCK_SET_VOL_REG(i));
    reg &= BUCK_VOL_MASK;
    val = 712500 + reg * 12500;
    printk("%s,line=%d dc[%d]= %d\n", __func__,__LINE__,(i+1),val);
    }
    /*****************************************************/
    ret = rk808_set_bits(rk808, RK808_INT_STS_MSK_REG1,(0x3<<5),(0x3<<5));
//close rtc int when power off
    ret = rk808_clear_bits(rk808, RK808_RTC_INT_REG,(0x3<<2)); //close rtc int when power off
    mutex_lock(&rk808->io_lock);
    mdelay(100);
}

static struct syscore_ops rk808_syscore_ops = {
    .shutdown = rk808_shutdown,
};
```

rk808_device_shutdown führt die eigentlichen I2C-Schreibzugriffe zum Abschalten der PMIC-Ausgänge aus.

```text
static void rk808_device_shutdown(void)
{
    int ret,i;
    u8 reg = 0;
    struct rk808 *rk808 = g_rk808;
    for(i=0;i < 10;i++){
        printk("%s\n",__func__);
        ret = rk808_i2c_read(rk808,RK808_DEVCTRL_REG,1,&reg);
        if(ret < 0)
            continue;
        ret = rk808_i2c_write(rk808, RK808_DEVCTRL_REG, 1,(reg |(0x1 <<3)));
        if (ret < 0) {
            printk("rk808 power off error!\n");
            continue;
        }
    }
    while(1)wfi();
}
EXPORT_SYMBOL_GPL(rk808_device_shutdown);
```

#### 2.2.2 4.4 Kernel DTS-Konfiguration

DTS umfasst i2c-Anbindung, Haupteigenschaften, rtc, clk und regulator.

```text
&i2c1 {
    status = "okay";
    rk808: pmic@1b {
        compatible = "rockchip,rk808";
        reg = <0x1b>;
        interrupt-parent = <&gpio1>;
        interrupts = <21 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l &pmic_dvs2>;
        rockchip,system-power-controller;
        wakeup-source;
        #clock-cells = <1>;
        clock-output-names = "rk808-clkout1", "rk808-clkout2";

        vcc1-supply = <&vcc3v3_sys>;
        vcc2-supply = <&vcc3v3_sys>;
        vcc3-supply = <&vcc3v3_sys>;
        vcc4-supply = <&vcc3v3_sys>;
        vcc6-supply = <&vcc3v3_sys>;
        vcc7-supply = <&vcc3v3_sys>;
        vcc8-supply = <&vcc3v3_sys>;
        vcc9-supply = <&vcc3v3_sys>;
        vcc10-supply = <&vcc3v3_sys>;
        vcc11-supply = <&vcc3v3_sys>;
        vcc12-supply = <&vcc3v3_sys>;
        vddio-supply = <&vcc1v8_pmu>;

        regulators {
            vdd_log: DCDC_REG1 {
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1350000>;
                regulator-ramp-delay = <6001>;
                regulator-name = "vdd_log";
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <900000>;
                };
            };
            vdd_cpu_l: DCDC_REG2 {
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1350000>;
                regulator-ramp-delay = <6001>;
                regulator-name = "vdd_cpu_l";
                regulator-state-mem {
                    regulator-off-in-suspend;
                };
            };
            vcc_ddr: DCDC_REG3 {
                .................
            };
            .............................
        };
    };
};
```

1. i2c-Anbindung: Den vollständigen RK808-Knoten unter dem zugehörigen i2c-Knoten platzieren und `status = "okay";` setzen.

2. Haupteigenschaften

Nicht ändern:

```text
compatible = "rockchip,rk808";
reg = <0x1b>;
rockchip,system-power-controller;
wakeup-source;
#clock-cells = <1>;
```

Konfigurierbar nach pinctrl-Regeln:

- interrupt-parent: GPIO-Controller von pmic_int.
- interrupts: Pinindex und Polarität von pmic_int auf diesem Controller.
- pinctrl-names: nicht ändern, fest "default".
- pinctrl-0: Verweis auf den in pinctrl definierten pmic_int-Pin.

3. rtc: Ist das Modul in menuconfig gewählt, wird aber nicht benötigt, einen rtc-Knoten mit `status = "disabled"` hinzufügen. Der Treiber wird nicht aktiviert; Boot-Fehlermeldungen können in diesem Fall ignoriert werden. Zum Aktivieren den Knoten entfernen oder `status = "okay"` setzen.

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

5. poweroff

Kernel 4.4 verwendet pm_power_off_prepare für Vorbereitungen wie das Deaktivieren von RTC-Interrupts und Konfigurieren spezieller Register. Der registrierte syscore shutdown schaltet den PMIC tatsächlich ab.

6. clk: Ein Knoten verwendet einen RK808-Takt über folgenden Verweis:

`clocks = <&rk808 1>;`

Erstes Argument: &rk808, fest. Zweites: Taktindex, nur 0 oder 1; 0 = rk808-clkout1, 1 = rk808-clkout2.

#### 2.2.3 4.19 Kernel DTS-Konfiguration

Siehe Kernel-4.4-DTS. Unterschied: Kernel 4.19 benötigt keinen gpio-Unterknoten mehr; andere Module referenzieren RK808-Pins weiterhin mit `gpios = <&rk808 0 GPIO_ACTIVE_LOW>;`.

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

Die PMIC-Treiberlogik ist relativ einfach; entscheidend sind die endgültigen Registereinstellungen. Eine übliche Debugmethode ist die Registerprüfung über `/sys/rk808/rk808_test`.

Lesen: `echo r [addr] > /sys/rk808/rk808_test`

Schreiben: `echo w [addr] [value] > /sys/rk808/rk808_test`

Nach dem Schreiben den Wert zur Kontrolle erneut lesen.

### 3.2 4.4 Kernel

Das Befehlsformat entspricht Kernel 3.10; nur der Pfad unterscheidet sich. Kernel 4.4 verwendet `/sys/rk8xx/rk8xx_dbg`.

### 3.3 4.19 Kernel

Siehe die Befehle für Kernel 4.4.

{% endraw %}
