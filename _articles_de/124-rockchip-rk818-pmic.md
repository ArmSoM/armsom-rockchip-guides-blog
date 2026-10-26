---
title: "Vollständiger Rockchip-RK818-PMIC-Leitfaden: Pins, Stromsequenz, DTS und Debugging"
description: "Vollständiger Rockchip-RK818-PMIC-Leitfaden: Pins, Stromsequenz, DTS und Debugging — V1.0.1"
excerpt: "Vollständiger Rockchip-RK818-PMIC-Leitfaden: Pins, Stromsequenz, DTS und Debugging — V1.0.1"
translation_key: 124-rockchip-rk818-pmic
slug: 124-rockchip-rk818-pmic
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, PMIC, DTS, battery]
---

{% raw %}

# Vollständiger Rockchip-RK818-PMIC-Leitfaden: Pins, Stromsequenz, DTS und Debugging

Chinesische Quelle V1.0.1; Kernelbereich 3.10 / 4.4 / 4.19. Der technische Vorwortumfang umfasst Modulkonzepte, Funktionen, Konfiguration und Fehlersuche. Kein englisches PDF liegt vor: Alle vier Sprachen basieren vollständig auf der chinesischen Quelle und nutzen vorhandene technische Originalbilder daraus. Nur ArmSoM-Plattformreferenz: PMIC, SoC, SDK/BSP, Kernel, Versorgungsbaum und Akkuspezifikation der konkreten Platine prüfen. Keine Hardwaretests oder pauschale Platinenunterstützung.

> Code, Parameter und Logs sind Herstellerbeispiele, keine ArmSoM-Messungen. Änderungen an Versorgung, Ladestrom, Spannung oder Temperaturregelung können Abschaltung, Schäden oder Akkurisiken verursachen. Beispiele nicht ungeprüft übernehmen; thermischen Schutz im Normalbetrieb niemals deaktivieren. Quellenwidersprüche bleiben ohne erratene Konstanten erhalten; siehe Prüfnotizen. HDIM5V-Schreibweise, 0.737.5-Stufe, RK808-Abschaltverweis und ramp-delay bleiben zur Prüfung erhalten.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Grundlagen

### 1.1 Übersicht

RK818 integriert 4 Hochstrom-DCDCs, 1 Hochstrom-BOOST, 9 LDOs, 1 SWITCH, einen HDIM5V-Ausgang (Quellenschreibweise), einen OTG-Ausgang, 1 RTC, einstellbare Sequenz, Schaltladung, intelligente Versorgungspfade und Coulomb-Zähler. Systemversorgungen sind meist DCDC oder LDO; Eigenschaften folgen (Details in weiterer Literatur).

1. DCDC: hoher Wirkungsgrad bei großer Ein-/Ausgangsspannungsdifferenz, jedoch relativ hohe Welligkeit und Kosten; daher für große Spannungsabfälle und hohe Lastströme. Übliche Modi sind PWM mit gutem Welligkeits-/Transientenverhalten, aber geringerem Wirkungsgrad, und PFM mit höherem Wirkungsgrad, jedoch geringerer Belastbarkeit.

2. LDO: geringer Wirkungsgrad bei großer Spannungsdifferenz, aber niedrige Kosten. Zur Verbesserung des Wirkungsgrads wird das System optimiert: Ein LDO mit 1.1V Ausgang kann beispielsweise vom DCDC VCCIO_3.3V gespeist werden. Soweit die Schaltung dies erlaubt, den LDO an einen DCDC-Ausgang anschließen und die Einschaltreihenfolge beachten.

### 1.2 Funktionen

Aus Anwendersicht werden die RK818-Funktionen als vier Bereiche beschrieben:

1. regulator: steuert den Zustand der einzelnen DCDC- und LDO-Versorgungen.

2. rtc: Zeitführung, Zeitsteuerung und verwandte Funktionen.

3. clk: zwei 32.768KHZ-Taktausgänge; einer ist ständig aktiv und nicht steuerbar, der andere wird per Software gesteuert.

4. Lade- und Ladezustandsfunktionen werden hier nicht detailliert behandelt; siehe Rockchip_RK818_RK816_Developer_Guide_Fuel_Gauge_CN.

### 1.3 Pinfunktionen

![Original des chinesischen PDFs · p5](/docs/rockchip-rk818-pmic/assets/cn-p005-figure-01.png)

*Original des chinesischen PDFs · p5*

Bei den folgenden Beschreibungen besonders auf die Pins SLEEP und INT achten.

![Original des chinesischen PDFs · p5](/docs/rockchip-rk818-pmic/assets/cn-p005-figure-02.png)

*Original des chinesischen PDFs · p5*

![Original des chinesischen PDFs · p6](/docs/rockchip-rk818-pmic/assets/cn-p006-figure-01.png)

*Original des chinesischen PDFs · p6*

![Original des chinesischen PDFs · p6](/docs/rockchip-rk818-pmic/assets/cn-p006-figure-02.png)

*Original des chinesischen PDFs · p6*

![Original des chinesischen PDFs · p7](/docs/rockchip-rk818-pmic/assets/cn-p007-figure-01.png)

*Original des chinesischen PDFs · p7*

Bearbeitbare Abschrift der Originaltabellen oben.

| Pinnummer | Name | Beschreibung |
| --- | --- | --- |
| 1 | INT | Interruptanforderung, aktiv Low |
| 2 | SLEEP | Eingang zum Wechsel Schlaf/Nicht-Schlaf |
| 3 | H_5V | 5v-Versorgungsausgang für HDMI |
| 4 | GND5 | Leistungsmasse |
| 5 | SW5 | Schaltausgang |
| 6,7 | BOOST | BOOST-Ausgang |
| 8,9 | USB | Versorgungseingang von USB |
| 10 | MIDU | Mittelpunkt der USB-Versorgung |
| 11,12 | SW6 | Schaltausgang |
| 13 | GND6 | Leistungsmasse |
| 14 | VLDO1 | LDO1-Ausgang |
| 15 | VCC6 | Versorgung für LDO |
| 16 | VLDO2 | LDO2-Ausgang |
| 17 | XIN | Eingang des 32.768KHz-Quarzoszillators |
| 18 | XOUT | Ausgang des 32.768KHz-Quarzoszillators |
| 19 | BOOT0 | Niederwertiges Bit der Startsequenzauswahl |
| 20 | BOOT1 | Höherwertiges Bit der Startsequenzauswahl |
| 21 | PWRON | Ein-/Ausschaltfreigabe, aktiv Low; interner 100K-Pull-up zur Versorgung |
| 22 | VCC3 | Versorgung für DCDC3 |
| 23 | SW3 | DCDC3 switch-Ausgang |
| 24 | GND3 | Leistungsmasse |
| 25 | VFB3 | Ausgangsspannungsrückführung von DCDC3 |
| 26 | VFB2 | Ausgangsspannungsrückführung von DCDC2 |
| 27 | GND2 | Leistungsmasse |
| 28,29 | SW2 | DCDC2 switch-Ausgang |
| 30 | VCC2 | Versorgung für DCDC2 |
| 31 | CLK32K1 | 32.768K-Taktausgang1, Open Drain |
| 32 | CLK32K2 | 32.768K-Taktausgang2, Open Drain |
| 33 | VDDIO | Versorgung für IO |
| 34 | NRESPWON | Reset nach Einschalten, aktiv Low |
| 35 | SCL | I2C-Takteingang |
| 36 | SDA | I2C-Datenein-/ausgang |
| 37 | VPP | Testversorgung, in Anwendung offen lassen |
| 38 | VFB1 | Ausgangsspannungsrückführung von DCDC1 |
| 39 | VCC1 | Versorgung für DCDC1 |
| 40,41 | SW1 | DCDC1 switch-Ausgang |
| 42,43 | GND1 | Leistungsmasse |
| 44 | VLDO7 | LDO7-Ausgang |
| 45 | VCC7 | Versorgung für LDO |
| 46 | VLDO5 | LDO5-Ausgang |
| 47 | VLDO3 | LDO3-Ausgang |
| 48 | VLDO4 | LDO4-Ausgang |
| 49 | VLDO6 | LDO6-Ausgang |
| 50 | VCC8 | Versorgung für SWITCH |
| 51 | VLDO8 | LDO8-Ausgang |
| 52 | VLDO9 | LDO9-Ausgang |
| 53 | VCC9 | Versorgung für LDO |
| 54 | VSWOUT | Schaltausgang |
| 55 | VREF | Interne Referenzspannung |
| 56 | REFGND | Referenzmasse |
| 57 | SNSN | Negativer Messanschluss für Batterielade-/entladestrom |
| 58 | SNSP | Positiver Messanschluss für Batterielade-/entladestrom |
| 59,60 | BAT | Batteriepluspol |
| 61,62 | SYS | DC-DC-Reglerausgang für Systemlast und Akkuladung |
| 63 | VCC4 | Versorgung für DCDC4 |
| 64 | SW4 | DCDC4 switch-Ausgang |
| 65 | VFB4 | Ausgangsspannungsrückführung von DCDC4 |
| 66 | GND4 | Leistungsmasse |
| 67 | TS1 | Thermistor1-Eingang; Thermistor nach Masse, meist im Akkupack |
| 68 | TS2 | Thermistor2-Eingang nach Masse; bei ADC-Steuerbit als interner ADC-Analogeingang nutzbar |
| Exposed pad | Exposed ground | Für Wärme-/Elektroeigenschaften zwingend an Masse anschließen |

### 1.4 Wichtige Konzepte

7-Bit-I2C-Slaveadresse: 0x1c. Der PMIC hat drei Betriebsmodi.

1. PMIC normal: Im normalen Systembetrieb befindet sich der PMIC im normal-Modus; pmic_sleep ist Low.

2. PMIC sleep reduziert den Eigenverbrauch beim System-Suspend. Produktspezifisch werden einzelne Spannungen gesenkt oder Ausgänge abgeschaltet. Im Standby konfiguriert der AP pmic_sleep über I2C für sleep und setzt ihn auf High. Beim SoC-Aufwachen wird der Pin wieder Low und der PMIC verlässt sleep.

3. PMIC-shutdown: Der PMIC schaltet das System ab. Der AP wählt per I2C shutdown für pmic_sleep und setzt den Pin High.

**pmic_sleep:** normalerweise Low im Normalmodus; High wählt sleep oder shutdown.

**pmic_int:** normalerweise High, bei Interrupt bis zur Bearbeitung Low.

**pmic_pwron:** Hardware-Einschalttaste hier anschließen; der Treiber erkennt Drücken/Loslassen.

**DCDC-Modi:** PWM (force PWM) und PFM; AUTO schaltet dynamisch. Unterstützt werden PWM und AUTO PWM/PFM. AUTO ist effizienter, hat aber schlechteres Ripple-/Transientenverhalten. Für Stabilität im Betrieb PWM, im Suspend AUTO PWM/PFM.

**DCDC3-Spannung:** nicht per Register veränderbar; externe Teilerwiderstände bestimmen sie. Für andere Spannung die Hardware ändern. Rockchip nutzt meist VCC_DDR.

**DCDC-/LDO-Betriebsspannungsbereiche:**

1. Kontinuierliche DCDC-Spannungsbereiche:

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

![Original des chinesischen PDFs · p9](/docs/rockchip-rk818-pmic/assets/cn-p009-figure-01.png)

*Original des chinesischen PDFs · p9*

![Original des chinesischen PDFs · p9](/docs/rockchip-rk818-pmic/assets/cn-p009-figure-02.png)

*Original des chinesischen PDFs · p9*


AP-Zuordnung: BOOT11 = RK3188/RK3168/RK3188M/RK3168M/RK3028A/RK3028/RK2928; BOOT10 = partielles OTP (BUCK1–4, LDO3/LDO4/LDO5/LDO7); BOOT01 = RK3066; BOOT00 RK818-1 = RK3288/RK3368; BOOT00 RK818-2 = S-Product.

| Rail | BOOT11 Spannung | BOOT11 Sequenz | BOOT10 Spannung | BOOT10 Sequenz | BOOT01 Spannung | BOOT01 Sequenz | BOOT00 RK818-1 Spannung | BOOT00 RK818-1 Sequenz | BOOT00 RK818-2 Spannung | BOOT00 RK818-2 Sequenz |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUCK1 | 1.1V | 3 | OTP | OTP | 1.2V | 3 | 1.1V | 3 | 1.0V | 12 |
| BUCK2 | 1.1V | 1 | OTP | OTP | 1.2V | 1 | 1.1V | 1 | 1.0V | 12 |
| BUCK3 | x | 4 | x | OTP | x | 4 | X | 3 | X | 13 |
| BUCK4 | 3.0V | 1 | OTP | OTP | 3.0V | 1 | 3.3V | 4 | 3.3V | 14 |
| LDO1 | 3.3V | x | 3.3V | x | 3.3V | x | 3.3V | x | 1.8V | 11 |
| LDO2 | 3.0V | x | 3V | x | 3.0V | x | 3.0V | x | X | X |
| LDO3 | 1.1V | 1 | OTP | OTP | 1.1V | 1 | 1.1V | x | 1.8V | 15 |
| LDO4 | 2.5V | 2 | OTP | OTP | 2.5V | 2 | 2.5V | x | 1.8V | 1 |
| LDO5 | 3V | 1 | OTP | OTP | 3.0V | 2 | 1.8V | 4 | 1.8V | 11 |
| LDO6 | 1.2V | x | 1.2V | x | 1.1V | x | 1.1V | x | X | X |
| LDO7 | 1.8V | 2 | OTP | OTP | 1.8V | 2 | 1.8V | 3 | 1.1V | 15 |
| LDO8 | 1.8V | x | 1.8V | x | 1.8V | x | 1.8V | x | 3.0V | 14 |
| LDO9 | 3.0V | 4 | 3.0V | 5 | 3.0V | 4 | 3.3V | 10 | 1.8V | 15 |
| SWITCH | x | x | x | x | x | x | x | 10 | x | x |
| OTG | 5V | x | 5V | x | 5V | x | 5V | x | 5V | x |
| HDMI_5V | 5V | x | 5V | x | 5V | x | 5V | x | 5V | x |

## 2. Konfiguration

### 2.1 Treiber und menuconfig

Kernel-3.10-Konfiguration — RK818-Treiberdateien:

```text
drivers/mfd/rk818.c
drivers/mfd/rk818-irq.c
drivers/rtc/rtc-rk818.c
drivers/power/rk818-battery.c
```

RK818-DTS-Referenzdatei:

```text
arch/arm/boot/dts/rk818.dtsi
arch/arm64/boot/dts/rk3368-p9_818.dts
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK818
CONFIG_RTC_RK818
CONFIG_BATTERY_RK818
```

Kernel-4.4-Konfiguration. RK818-Treiberdateien:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
drivers/power/rk818_charger.c
drivers/power/rk818_battery.c
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
CONFIG_COMMON_CLK_RK808
```

Kernel-4.19-Konfiguration. RK818-Treiberdateien:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
drivers/power/supply/rk818_battery.c
drivers/power/supply/rk818_charger.c
```

Zugehörige menuconfig-Symbole:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
CONFIG_COMMON_CLK_RK808
```

### 2.2 DTS-Konfiguration

DTS für Kernel 3.10 umfasst I2C-Anbindung, Haupteigenschaften, regulator, RTC und poweroff.

```text
&i2c1 {
    rk818: rk818@1c {
        reg = <0x1c>;
        status = "okay";
    };
};

/include/ "../../../arm/boot/dts/rk818.dtsi"
&rk818 {
    gpios =<&gpio0 GPIO_A1 GPIO_ACTIVE_HIGH>,<&gpio0 GPIO_A0 GPIO_ACTIVE_LOW>;
    rk818,system-power-controller;
    pinctrl-names = "default";
    pinctrl-0 = <&gpio0_c1>;

    regulators {
        rk818_dcdc1_reg: regulator@0{
            regulator-name= "vdd_arm";/*vcc arm*/
            regulator-min-microvolt = <700000>;/*<725000>;*/
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x2>;
            regulator-initial-state = <3>;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-disabled;
                regulator-state-uv =<900000>;
            };
        };

        rk818_dcdc2_reg: regulator@1 {
            regulator-name= "vdd_logic";/*vcc gpu*/
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1200000>;
            regulator-initial-mode = <0x2>;
            regulator-initial-state = <3>;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-enabled;
                regulator-state-uv = <1200000>;
            };
        };
        rk818_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

1. I2C-Anbindung: Den vollständigen RK818-Knoten unter dem passenden i2c-Knoten platzieren und `status = "okay";` setzen.

2. Haupteigenschaften — Folgendes nicht ändern:

`rk818,system-power-controller` deklariert die Systemabschaltung durch RK818.

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

5. poweroff: Laut Quelle fängt der RK808-Treiber das Abschalten ab und deaktiviert PMIC-Ausgänge per I2C. rk818_shutdown ist als syscore shutdown für Vorbereitungen wie RTC-Interruptabschaltung registriert.

```text
static void rk818_shutdown(void)
{
    int ret;
    struct rk818 *rk818 = g_rk818;

    pr_info("%s\n", __func__);
    ret = rk818_set_bits(rk818, RK818_INT_STS_MSK_REG1,(0x3<<5),(0x3<<5));
//close rtc int when power off
    ret = rk818_clear_bits(rk818, RK818_RTC_INT_REG,(0x3<<2)); //close rtc int when power off
    /*disable otg_en*/
    ret = rk818_clear_bits(rk818, RK818_DCDC_EN_REG, (0x1<<7));

    mutex_lock(&rk818->io_lock);
    mdelay(100);
}

static struct syscore_ops rk818_syscore_ops = {
    .shutdown = rk818_shutdown,
};
```

rk808_device_shutdown führt die eigentlichen I2C-Schreibzugriffe zum Abschalten der PMIC-Ausgänge aus.

```text
void rk818_device_shutdown(void)
{
    int ret, i;
    u8 reg = 0;
    struct rk818 *rk818 = g_rk818;

    for (i = 0; i < 10; i++) {
        pr_info("%s\n", __func__);
        ret = rk818_i2c_read(rk818, RK818_DEVCTRL_REG, 1, &reg);
        if (ret < 0)
            continue;
        ret = rk818_i2c_write(rk818, RK818_DEVCTRL_REG, 1,
                     (reg | (0x1 << 0)));
        if (ret < 0) {
            pr_err("rk818 power off error!\n");
            continue;
        }
    }
    while(1) wfi();
}
EXPORT_SYMBOL_GPL(rk818_device_shutdown);
```

DTS für Kernel 4.4 umfasst I2C-Anbindung, Haupteigenschaften, RTC, clk, regulator, charger und battery.

```text
&i2c1 {
    status = "okay";
    rk818: pmic@1c {
        compatible = "rockchip,rk818";
        reg = <0x1c>;
        status = "okay";

        clock-output-names = "rk818-clkout1", "wifibt_32kin";
        interrupt-parent = <&gpio0>;
        interrupts = <1 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l>;
        rockchip,system-power-controller;
        wakeup-source;
        #clock-cells = <1>;

        vcc1-supply = <&vcc_sys>;
        vcc2-supply = <&vcc_sys>;
        vcc3-supply = <&vcc_sys>;
        vcc4-supply = <&vcc_sys>;
        vcc6-supply = <&vcc_sys>;
        vcc7-supply = <&vcc_sys>;
        vcc8-supply = <&vcc_sys>;
        vcc9-supply = <&vcc_io>;

        regulators {
            vdd_logic: DCDC_REG1 {
                regulator-name = "vdd_logic";
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1450000>;
                regulator-ramp-delay = <6001>;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };

            vdd_gpu: DCDC_REG2 {
                regulator-name = "vdd_gpu";
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <800000>;
                regulator-max-microvolt = <1250000>;
                regulator-ramp-delay = <6001>;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };
            vcc_ddr: RK818_DCDC3@2 {
                .................
            };
            .............................
        };
    };
};
```

1. i2c-Anbindung: Den vollständigen RK818-Knoten unter dem zugehörigen i2c-Knoten platzieren und `status = "okay";` setzen.

2. Haupteigenschaften — Folgendes nicht ändern:

```text
compatible = "rockchip,rk818";
reg = <0x1c>;
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

6. clk: Ein Knoten verwendet einen RK818-Takt über folgenden Verweis:

`clocks = <&rk818 1>;`

Erstes Argument: &rk818, fest. Zweites: Taktindex, nur 0 oder 1; 0 = rk818-clkout1, 1 = rk818-clkout2.

Kernel-4.19-DTS-Konfiguration

Siehe Kernel-4.4-DTS. Unterschied: Kernel 4.19 benötigt keinen gpio-Unterknoten mehr; andere Module referenzieren RK818-Pins weiterhin mit `gpios = <&rk818 0 GPIO_ACTIVE_LOW>;`.

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

PMIC-Treiberlogik ist relativ einfach; entscheidend sind Registerwerte. Übliche Prüfung über `/sys/rk818/rk818_test`.

Lesen: `echo r [addr] > /sys/rk818/rk818_test`

Schreiben: `echo w [addr] [value] > /sys/rk818/rk818_test`

### 3.2 4.4 Kernel

Das Befehlsformat entspricht Kernel 3.10; nur der Pfad unterscheidet sich. Kernel 4.4 verwendet `/sys/rk8xx/rk8xx_dbg`.

### 3.3 4.19 Kernel

Siehe die Befehle für Kernel 4.4.

{% endraw %}
