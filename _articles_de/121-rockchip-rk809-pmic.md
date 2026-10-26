---
title: "Vollständiger Rockchip RK809 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging"
description: "Vollständiger Rockchip RK809 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging — V1.0.0"
excerpt: "Vollständiger Rockchip RK809 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging — V1.0.0"
translation_key: 121-rockchip-rk809-pmic
slug: 121-rockchip-rk809-pmic
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, RK809, PMIC, DTS, regulator]
---

{% raw %}

# Vollständiger Rockchip RK809 PMIC-Leitfaden: Pins, Einschaltsequenz, DTS und Debugging

Chinesische Quelle V1.0.0, Kernelbereich 4.4 / 4.19. Das technische Vorwort beschreibt Konzepte, Funktionen, DTS und Fehlersuche der RK809-Teilmodule; der technische Text bleibt vollständig erhalten. Kein englisches PDF vorhanden: Alle vier Sprachen verwenden Originalbilder des chinesischen PDFs, teils bereits englisch beschriftet. Nur Plattformreferenz: PMIC, SoC, Versorgungsbaum, Pins, SDK/BSP und Kernel der konkreten ArmSoM prüfen. Keine pauschale Unterstützung aller Platinen und keine Hardwaretests.

> Spannungs-, Pinmodus- und Registeränderungen können Hardware abschalten oder beschädigen; Quellenbeispiele wurden nicht ausgeführt. `0.737.5`, Unterschiede zwischen Spannungs-/Sequenztabellen, `regulator-ramp-delay` 12500 gegenüber 6001 im Beispiel sowie „vier Funktionen“ bei abweichender Listenzahl bleiben ohne vermutete Korrekturen erhalten. Mit dem BSP abgleichen: Abschaltort „PCIE“, rockchi-Pfad und DCDC3 nur mit externem Teiler gegenüber internen Spannungsstufen in der Sequenztabelle. Die Originalüberschriften 3.1/3.2 nennen nur „Kernel“; keine Version ergänzt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Grundlagen

### 1.1 Übersicht

RK809 ist ein leistungsfähiger PMIC mit 5 Hochstrom-DCDCs, 9 LDOs, 2 SWITCH-Ausgängen, 1 RTC, 1 leistungsfähigen CODEC und einstellbarer Einschaltsequenz. Die Versorgungen werden in DCDC und LDO eingeteilt; allgemeine Eigenschaften folgen, Details sind in weiterführenden Unterlagen nachzulesen.

1. DCDC: hoher Wirkungsgrad bei großer Ein-/Ausgangsspannungsdifferenz, jedoch relativ hohe Welligkeit und Kosten; daher für große Spannungsabfälle und hohe Lastströme. Übliche Modi sind PWM mit gutem Welligkeits-/Transientenverhalten, aber geringerem Wirkungsgrad, und PFM mit höherem Wirkungsgrad, jedoch geringerer Belastbarkeit.

2. LDO: geringer Wirkungsgrad bei großer Spannungsdifferenz, aber niedrige Kosten. Zur Verbesserung des Wirkungsgrads wird das System optimiert: Ein LDO mit 1.1V Ausgang kann beispielsweise vom DCDC VCCIO_3.3V gespeist werden. Soweit die Schaltung dies erlaubt, den LDO an einen DCDC-Ausgang anschließen und die Einschaltreihenfolge beachten.

### 1.2 Funktionen

Aus Anwendersicht werden die RK809-Funktionen als vier Bereiche beschrieben:

1. regulator: steuert den Zustand der einzelnen DCDC- und LDO-Versorgungen.

2. rtc: Zeitführung, Zeitsteuerung und verwandte Funktionen.

3. gpio: allgemeine GPIO-Funktion mit pinctrl-Unterstützung.

4. pwrkey: erkennt Drücken/Loslassen der Einschalttaste und spart einen AP-GPIO.

5. clk: zwei 32.768KHZ-Taktausgänge; einer ist ständig aktiv und nicht steuerbar, der andere wird per Software gesteuert.

6. codec: Abtastraten bis 192KHZ, 16bit und 32bit, DAC, ADC, PDM und weitere Funktionen. Hier nicht behandelt; laut Quelle soll ein eigenes Dokument folgen.

### 1.3 Pinfunktionen

![Originalabbildung aus dem chinesischen PDF · p6](/docs/rockchip-rk809-pmic/assets/cn-p006-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p6*

Besonders auf SLEEP und INT achten; der sleep-Pin bietet zusätzlich erweiterte GPIO-Funktionalität.

![Originalabbildung aus dem chinesischen PDF · p7](/docs/rockchip-rk809-pmic/assets/cn-p007-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p7*

![Originalabbildung aus dem chinesischen PDF · p7](/docs/rockchip-rk809-pmic/assets/cn-p007-figure-02.png)

*Originalabbildung aus dem chinesischen PDF · p7*

![Originalabbildung aus dem chinesischen PDF · p8](/docs/rockchip-rk809-pmic/assets/cn-p008-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p8*

Bearbeitbare Abschrift der Originaltabellen oben.

| Pinnummer | Name | Beschreibung |
| --- | --- | --- |
| 1 | SCL | I2C-Takteingang |
| 2 | SDA | I2C-Datenein-/ausgang |
| 3 | LDO7 | LDO7-Ausgang |
| 4 | VCC7 | Versorgung für LDO7/8/9 |
| 5 | LDO8 | LDO8-Ausgang |
| 6 | LDO9 | LDO9-Ausgang |
| 7 | INT | Interruptanforderung, Open Drain |
| 8 | FB2 | Ausgangsspannungsrückführung von BUCK2 |
| 9 | SW2 | Schaltknoten von BUCK2 |
| 10 | VCC2 | Versorgung für BUCK2 |
| 11 | VCC1 | Versorgung für BUCK1 |
| 12 | SW1 | Schaltknoten von BUCK1 |
| 13 | FB1 | Ausgangsspannungsrückführung von BUCK1 |
| 14 | LRCLK | I2S-Rahmentakt |
| 15 | BCLK | I2S-Bittakt |
| 16 | MCLK | I2S-Haupttakteingang |
| 17 | SDI | I2S-DAC-Eingangsdaten |
| 18 | SDO/PDMDATA | I2S-ADC-Ausgangsdaten/PDM-Daten für DSADC |
| 19 | PDMCLK | PDM CLK für DSADC-Ausgang |
| 20 | LDO3 | LDO3-Ausgang |
| 21 | LDO2 | LDO2-Ausgang |
| 22 | VCC5 | Versorgung für LDO1/2/3 |
| 23 | LDO1 | LDO1-Ausgang |
| 24 | VCC3 | Versorgung für BUCK3 |
| 25 | SW3 | Schaltknoten von BUCK3 |
| 26 | VBUCK3 | BUCK3-Ausgang |
| 27 | FB3 | Ausgangsspannungsrückführung von BUCK3 |
| 28 | LDO4 | LDO4-Ausgang |
| 29 | LDO5 | LDO5-Ausgang |
| 30 | VCC6 | Versorgung für LDO4/5/6 |
| 31 | LDO6 | LDO6-Ausgang |
| 32 | SPKP_OUT | Positiver Lautsprechertreiberausgang |
| 33 | VCC_SPK_HP | Versorgung für Lautsprecher und Ladungspumpe |
| 34 | SPKN_OUT | Negativer Lautsprechertreiberausgang |
| 35 | VCC_CPVSS | Negative Kopfhörerversorgung |
| 36 | CPN | Negativer Schaltknoten der Ladungspumpe |
| 37 | CPP | Positiver Schaltknoten der Ladungspumpe |
| 38 | VCC_CPVDD | Positive Kopfhörerversorgung |
| 39 | HPL_OUT | Linker Kopfhörerkanalausgang |
| 40 | HP_SNS | Kopfhörer-Referenzmasse |
| 41 | HPR_OUT | Rechter Kopfhörerkanalausgang |
| 42 | MICIN | Negativer Mikrofoneingang |
| 43 | MICIP | Positiver Mikrofoneingang |
| 44 | VCC_1P8A | Versorgung der internen 1.8V-Analogschaltung |
| 45 | VCC_RTC | Versorgungsfilter |
| 46 | VREF | Interne Referenzspannung |
| 47 | GNDREF | Referenzmasse |
| 48 | VCC_1P8D | Versorgung der internen 1.8V-Digitalschaltung |
| 49 | SLEEP | Steuereingang für Schlafmodus |
| 50 | XIN | Eingang des 32.768KHz-Quarzoszillators |
| 51 | XOUT | Ausgang des 32.768KHz-Quarzoszillators |
| 52 | PWRON | Einschalttasteneingang, aktiv Low; interner 17k-Pull-up nach VCC_RTC |
| 53 | SW5 | Schaltknoten von BUCK5 |
| 54 | VCC9 | Versorgung für BUCK5 / SWOUT1 |
| 55 | SWOUT1 | SWITCH1-Ausgang |
| 56 | BATDIV | Geteilte Spannung des Batteriepluspols |
| 57 | VCC8 | Versorgung für SWOUT2 |
| 58 | SWOUT2 | SWITCH2-Ausgang |
| 59 | FB5 | Ausgangsspannungsrückführung von BUCK5 |
| 60 | EXT_EN | Freigabe für externen Hochspannungs-BUCK |
| 61 | VDC | Erstes Überschreiten von 0.55V startet den PMIC (steigende Flanke); üblicherweise am Spannungsteiler der externen Versorgung |
| 62 | SNSP | Positiver Messanschluss für Batterielade-/entladestrom |
| 63 | SNSN | Negativer Messanschluss für Batterielade-/entladestrom |
| 64 | FB4 | Ausgangsspannungsrückführung von BUCK4 |
| 65 | SW4 | Schaltknoten von BUCK4 |
| 66 | VCC4 | Versorgung für BUCK4 |
| 67 | RESETB | Reset nach Einschalten, aktiv Low |
| 68 | CLK32K | 32.768KHz-Taktausgang, Open Drain |
| Exposed pad | Exposed ground | Masse |

### 1.4 Wichtige Konzepte

I2C-Adresse: 7-Bit-Slaveadresse `0x20`. Der PMIC besitzt drei Betriebsarten.

1. PMIC normal: Im normalen Systembetrieb befindet sich der PMIC im normal-Modus; pmic_sleep ist Low.

2. PMIC sleep reduziert den Eigenverbrauch beim System-Suspend. Produktspezifisch werden einzelne Spannungen gesenkt oder Ausgänge abgeschaltet. Im Standby konfiguriert der AP pmic_sleep über I2C für sleep und setzt ihn auf High. Beim SoC-Aufwachen wird der Pin wieder Low und der PMIC verlässt sleep.

3. PMIC shutdown: Der PMIC schaltet das ganze System ab. Der AP konfiguriert pmic_sleep über I2C für shutdown und setzt den Pin auf High. Normalerweise ist pmic_sleep für normal Low; High schaltet auf sleep oder shutdown. Bei RK809 ist der Pin gemultiplext; die Funktion wird über pinctrl gewählt:

1. SLEEP: SLEEP-Modus umschalten.

2. Abschalten: POWER DOWN.

3. Zurücksetzen: RESET.

4. Leerlauf: keine Funktion.

**pmic_int:** normalerweise High; ein Interrupt zieht den Pin auf Low. Er bleibt Low, bis der Interrupt bearbeitet wurde.

**pmic_pwron:** Die physische Einschalttaste an diesen Pin anschließen; der Treiber erkennt darüber Drücken und Loslassen.

**DCDC-Modi:** Neben PWM (force PWM) und PFM schaltet AUTO dynamisch zwischen PWM und PFM um. Der PMIC unterstützt PWM und AUTO PWM/PFM. AUTO bietet höheren Wirkungsgrad, aber schlechteres Welligkeits-/Transientenverhalten. Für Stabilität wird im Betrieb PWM und im Suspend AUTO PWM/PFM verwendet.

**DCDC3-Spannung:** Diese besondere Schiene ist nicht per Register einstellbar, sondern über externe Spannungsteilerwiderstände. Spannungsänderungen erfordern daher Hardwareänderungen. In Rockchip-Designs wird sie meist für VCC_DDR verwendet.

**Einstellbereiche von DCDC und LDO im Betrieb:**

1. Nicht kontinuierliche DCDC-Spannungsbereiche:

| Spannungsbereich (V) | Schritt (mV) | Spannungsstufen (V) |
| --- | --- | --- |
| 0.7125 ~ 1.5 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.5 |
| 1.6 ~ 2.4 | 100 | 1.6、1.7、1.8、1.9、......、2.4 |

2. Kontinuierliche LDO-Spannungen:

| Spannungsbereich (V) | Schritt (mV) | Spannungsstufen (V) |
| --- | --- | --- |
| 0.6 ~ 3.4 | 25 | 0.6、0.625、0.65、0.675、...... 、3.4 |

### 1.5 Einschaltbedingungen und -sequenz

1. Einschaltbedingungen: Eine der folgenden Bedingungen reicht aus:

- EN wechselt von Low auf High.
- EN bleibt High und ein RTC-Alarminterrupt tritt auf.
- EN bleibt High und die PWRON-Taste wird gedrückt.
- EN bleibt High und ein Ladegerät wird eingesteckt.

2. Einschaltsequenz: SoC-Plattformen können unterschiedliche Reihenfolgen der Versorgungsschienen verlangen. Die Sequenzen sind unten dargestellt; Einzelheiten dem aktuellen passenden Datenblatt entnehmen.

![Originalabbildung aus dem chinesischen PDF · p10](/docs/rockchip-rk809-pmic/assets/cn-p010-figure-01.png)

*Originalabbildung aus dem chinesischen PDF · p10*

![Originalabbildung aus dem chinesischen PDF · p10](/docs/rockchip-rk809-pmic/assets/cn-p010-figure-02.png)

*Originalabbildung aus dem chinesischen PDF · p10*


Sequenztabelle aus dem Originalbild; Leerfelder, x, OTP und ON/OFF bleiben erhalten.

| Schiene | Ausgangsbereich | Maximalstrom | Standardspannung | Reihenfolge |
| --- | --- | --- | --- | --- |
| BUCK1 | 0.5V-2.4V | 2.5A | 1.0V | 2 |
| BUCK2 | 0.5V-2.4V | 2.5A | 1.0V | 2 |
| BUCK3 | X (externer Teiler) / 0.5V-2.4V (interner Teiler) | 1.5A | x | 4 |
| BUCK4 | 0.5V-3.4V | 1.5A | 3.0V | 5 |
| LDO1 | 0.6V-3.4V | 400mA | 2.5V | 3 |
| LDO2 | 0.6V-3.4V | 400mA | 1.8V | 3 |
| LDO3 | 0.6V-3.4V | 400mA | 1.0V | 2 |
| LDO4 | 0.6V-3.4V | 100mA | 3.0V | 5 |
| LDO5 | 0.6V-3.4V | 400mA | 3.0V | 5 |
| LDO6 | 0.6V-3.4V | 400mA | 3.0V | 5 |
| LDO7 | 0.6V-3.4V | 400mA | 2.8V | OFF |
| LDO8 | 0.6V-3.4V | 400mA | 1.8V | OFF |
| LDO9 | 0.6V-3.4V | 400mA | 1.5V | OFF |
| BUCK5 | 1.5V-3.6V | 2.5A | 3.3V | 1 |
| SWOUT1 |  |  |  | OFF |
| SWOUT2 |  |  |  | OFF |

## 2. Konfiguration

### 2.1 Treiber und menuconfig

Kernel-4.4-Konfiguration. RK809-Treiberdateien nutzen teilweise Komponenten von rk817 und rk805:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk8xx-pwrkey.c
drivers/rtc/rtc-rk808.c
drivers/gpio/gpio-rk8xx.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
```

RK809-DTS-Referenzdatei:

```text
arch/arm64/boot/dts/rockchi/px30-evb-ddr4-v10.dts
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_GPIO_RK8XX
CONFIG_REGULATOR_RK818
CONFIG_INPUT_RK8XX_PWRKEY
CONFIG_COMMON_CLK_RK808
```

Kernel-4.19-Konfiguration. RK809-Treiberdateien:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk805-pwrkey.c       // 跟4.4内核不同
drivers/rtc/rtc-rk808.c
drivers/pinctrl/pinctrl-rk805.c         // 跟4.4内核不同
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
```

RK809-DTS-Referenzdatei:

```text
arch/arm64/boot/dts/rockchi/px30-evb-ddr4-v10.dts
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_PINCTRL_RK805
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK805_PWRKEY
CONFIG_COMMON_CLK_RK808
```

### 2.2 DTS-Konfiguration

Kernel-4.4-DTS: i2c-Anbindung, Haupteigenschaften, rtc, pwrkey, gpio und regulator.

```text
&pinctrl {
    pmic {
        pmic_int: pmic_int {
            rockchip,pins =
                <0 RK_PA7 RK_FUNC_GPIO &pcfg_pull_up>;
        };
        soc_slppin_gpio: soc_slppin_gpio {
            rockchip,pins =
                <0 RK_PA4 RK_FUNC_GPIO &pcfg_output_low>;
        };
        soc_slppin_slp: soc_slppin_slp {
            rockchip,pins =
                <0 RK_PA4 RK_FUNC_1 &pcfg_pull_none>;
        };
        soc_slppin_rst: soc_slppin_rst {
            rockchip,pins =
                <0 RK_PA4 RK_FUNC_2 &pcfg_pull_none>;
        };
    };
};
&i2c1 {
    status = "okay";
    rk809: pmic@20 {
        compatible = "rockchip,rk809";
        reg = <0x20>;
        interrupt-parent = <&gpio0>;
        interrupts = <7 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default", "pmic-sleep",
                "pmic-power-off", "pmic-reset";
        pinctrl-0 = <&pmic_int>;
        pinctrl-1 = <&soc_slppin_slp>, <&rk817_slppin_slp>;
        pinctrl-2 = <&soc_slppin_gpio>, <&rk817_slppin_pwrdn>;
        pinctrl-3 = <&soc_slppin_rst>, <&rk817_slppin_rst>;
        rockchip,system-power-controller;
        wakeup-source;
        #clock-cells = <1>;
        clock-output-names = "rk808-clkout1", "rk808-clkout2";
        //fb-inner-reg-idxs = <2>;
        /* 1: rst regs (default in codes), 0: rst the pmic */
        pmic-reset-func = <1>;
        vcc1-supply = <&vcc5v0_sys>;
        vcc2-supply = <&vcc5v0_sys>;
        vcc3-supply = <&vcc5v0_sys>;
        vcc4-supply = <&vcc5v0_sys>;
        vcc5-supply = <&vcc3v3_sys>;
        vcc6-supply = <&vcc3v3_sys>;
        vcc7-supply = <&vcc3v3_sys>;
        vcc8-supply = <&vcc3v3_sys>;
        vcc9-supply = <&vcc5v0_sys>;
        pwrkey {
    status = "okay";
};
pinctrl_rk8xx: pinctrl_rk8xx {
    gpio-controller;
    #gpio-cells = <2>;
    rk817_slppin_null: rk817_slppin_null {
        pins = "gpio_slp";
        function = "pin_fun0";
    };
    rk817_slppin_slp: rk817_slppin_slp {
        pins = "gpio_slp";
        function = "pin_fun1";
    };
    rk817_slppin_pwrdn: rk817_slppin_pwrdn {
        pins = "gpio_slp";
        function = "pin_fun2";
    };
    rk817_slppin_rst: rk817_slppin_rst {
        pins = "gpio_slp";
        function = "pin_fun3";
    };
};
regulators {
    vdd_logic: DCDC_REG1 {
        regulator-always-on;
        regulator-boot-on;
        regulator-min-microvolt = <950000>;
        regulator-max-microvolt = <1350000>;
        regulator-ramp-delay = <6001>;
        regulator-initial-mode = <0x2>;
        regulator-name = "vdd_logic";
        regulator-state-mem {
            regulator-on-in-suspend;
            regulator-suspend-microvolt = <950000>;
        };
    };
    vdd_arm: DCDC_REG2 {
        regulator-always-on;
        regulator-boot-on;
        regulator-min-microvolt = <950000>;
        regulator-max-microvolt = <1350000>;
        regulator-ramp-delay = <6001>;
        regulator-initial-mode = <0x2>;
        regulator-name = "vdd_arm";
        regulator-state-mem {
            regulator-off-in-suspend;
            regulator-suspend-microvolt = <950000>;
        };
    };
            vcc_ddr: RK809_DCDC3@2 {
                .................
            };
            .............................
        };
        rk809_codec: codec {
            #sound-dai-cells = <0>;
            compatible = "rockchip,rk809-codec", "rockchip,rk817-codec";
            clocks = <&cru SCLK_I2S1_OUT>;
            clock-names = "mclk";
            pinctrl-names = "default";
            pinctrl-0 = <&i2s1_2ch_mclk>;
            hp-volume = <20>;
            spk-volume = <3>;
            status = "okay";
        };
    };
};
```

1. i2c-Anbindung: Den vollständigen RK809-Knoten unter dem zugehörigen i2c-Knoten platzieren und `status = "okay";` setzen.

2. Haupteigenschaften — Folgendes nicht ändern:

```text
compatible = "rockchip,rk809";
reg = <0x20>;
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

5. power off: RK809 lässt sich direkt über ein I/O-Signal ausschalten. Der Kernel registriert pm_shutdown_prepare_fn zur Vorbereitung, insbesondere RTC-Interrupts deaktivieren und IOMUX spezieller Pins konfigurieren. Laut Quelle erfolgt das eigentliche Abschalten „in PCIE“, indem pm_power_off direkt das I/O ansteuert.

```text
static int rk817_shutdown_prepare(struct rk808 *rk808)
{
    int ret;

    /* close rtc int when power off */
    regmap_update_bits(rk808->regmap,
               RK817_INT_STS_MSK_REG1,
               (0x3 << 5), (0x3 << 5));
    regmap_update_bits(rk808->regmap,
               RK817_RTC_INT_REG,
               (0x3 << 2), (0x0 << 2));

    if (rk808->pins && rk808->pins->p && rk808->pins->power_off) {
        ret = regmap_update_bits(rk808->regmap,
                     RK817_SYS_CFG(3),
                     RK817_SLPPIN_FUNC_MSK,
                     SLPPIN_NULL_FUN);
        if (ret) {
            pr_err("shutdown: config SLPPIN_NULL_FUN error!\n");
            return 0;
        }

        ret = regmap_update_bits(rk808->regmap,
                     RK817_SYS_CFG(3),
                     RK817_SLPPOL_MSK,
                     RK817_SLPPOL_H);
        if (ret) {
            pr_err("shutdown: config RK817_SLPPOL_H error!\n");
            return 0;
        }
        ret = pinctrl_select_state(rk808->pins->p,
                       rk808->pins->power_off);
        if (ret)
            pr_info("%s:failed to activate pwroff state\n",
                __func__);
        else
            return ret;
    }

    /* pmic sleep shutdown function */
    ret = regmap_update_bits(rk808->regmap,
                 RK817_SYS_CFG(3),
                 RK817_SLPPIN_FUNC_MSK, SLPPIN_DN_FUN);
    return ret;
}
```

6. clk: Ein Knoten verwendet einen RK809-Takt über folgenden Verweis:

`clocks = <&rk809 1>;`

Erstes Argument: &rk809, fest. Zweites: Taktindex, nur 0 oder 1; 0 = rk809-clkout1, 1 = rk809-clkout2.

Kernel-4.19-DTS-Konfiguration

Siehe Kernel-4.4-DTS. Unterschied: Kernel 4.19 benötigt keinen gpio-Unterknoten mehr; andere Module referenzieren RK809-Pins weiterhin mit `gpios = <&rk809 0 GPIO_ACTIVE_LOW>;`.

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

rdev_logic = regulator_get(NULL, "vdd_logic");      // 获取vdd_logic
regulator_enable(rdev_logic);               // 使能vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
regulator_disable(rdev_logic);              // 关闭vdd_logic
regulator_put(rdev_logic);              // 释放vdd_logic
```

Kernel 4.4 und 4.19 stellen außerdem Regulator-Schnittstellen mit devm_-Präfix zur Verwaltung angeforderter Ressourcen bereit.

## 3. Debug

### 3.1 Kernel

Das Befehlsformat entspricht Kernel 3.10; nur der Pfad unterscheidet sich. Kernel 4.4 verwendet `/sys/rk8xx/rk8xx_dbg`.

### 3.2 Kernel

Siehe die Befehle für Kernel 4.4.

{% endraw %}
