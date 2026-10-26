---
title: "Rockchip RK805 PMIC: Versorgung, DTS und Debugging"
description: "Rockchip RK805 PMIC: Versorgung, DTS und Debugging — V1.1.1"
excerpt: "Rockchip RK805 PMIC: Versorgung, DTS und Debugging — V1.1.1"
translation_key: "118-rockchip-rk805-pmic"
slug: "118-rockchip-rk805-pmic"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK805", "PMIC", "Linux"]
---

{% raw %}

Quelle RK-KF-YF-127 V1.1.1, RK805, Linux 3.10 / 4.4 / 4.19. PMIC-Module, Begriffe, Funktionen, DTS und Diagnose. Nur Plattformreferenz: PMIC, SoC, SDK/BSP, Kernel, Versorgung und Verdrahtung der ArmSoM-Platine prüfen. Keine Hardwarevalidierung. Nur chinesisches PDF vorhanden; alle vier Sprachen verwenden dessen Originalabbildungen einschließlich eingebetteter englischer Beschriftungen. Kein entsprechendes englisches PDF in dieser Charge. Hardwarebefehle wurden nicht ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- cn PDF p.4 -->

## 1. Grundlagen

<!-- cn PDF p.4 -->

### 1.1 Überblick

<!-- cn PDF p.4 -->

RK805 ist eine leistungsfähige PMIC mit 4 Hochstrom-DCDC, 3 LDO, 1 RTC und einstellbarer Einschaltreihenfolge. Systemversorgungen sind allgemein DCDC oder LDO; ihre Eigenschaften folgen (Einzelheiten separat nachschlagen).

<!-- cn PDF p.4 -->

1. DCDC: hoher Wirkungsgrad bei großer Ein-/Ausgangsspannungsdifferenz, jedoch größere Welligkeit und höhere Kosten; für große Spannungsdifferenzen und Lastströme. Üblich sind PWM (gutes dynamisches Welligkeitsverhalten, niedriger Wirkungsgrad) und PFM (hoher Wirkungsgrad, aber geringe Belastbarkeit).

<!-- cn PDF p.4 -->

2. LDO: bei großer Spannungsdifferenz niedriger Wirkungsgrad und geringe Kosten. Schaltungsoptimierungen erhöhen den Wirkungsgrad: Bei 1.1V LDO-Ausgang kann der Eingang beispielsweise vom DCDC VCCIO_3.3V gespeist werden. Soweit schaltungstechnisch möglich, den LDO am DCDC-Ausgang betreiben und die Einschaltreihenfolge beachten.

<!-- cn PDF p.4 -->

### 1.2 Funktionen

<!-- cn PDF p.4 -->

RK805 bietet vier Funktionsgruppen:

<!-- cn PDF p.4 -->

1. Regulator: Versorgungszustand jedes DCDC und LDO steuern.

<!-- cn PDF p.4 -->

2. RTC: Zeitmessung und Zeitgeber.

<!-- cn PDF p.4 -->

3. GPIO: out1 und out2 sind Push-Pull-Ausgänge; als normale GPIOs, jedoch nur ausgangsseitig nutzbar.

<!-- cn PDF p.4 -->

2. Pwrkey: Drücken/Loslassen der Einschalttaste erkennen und damit einen GPIO des AP einsparen.

<!-- cn PDF p.5 -->

### 1.3 Anschlussfunktionen

<!-- cn PDF p.5 -->

![Originalabbildung aus chinesischem PDF — p.5](/docs/rockchip-rk805-pmic/assets/cn-p005-figure-01.png)

*Originalabbildung aus chinesischem PDF — p.5*

<!-- cn PDF p.5 -->

Besonders auf SLEEP und INT achten.

<!-- cn PDF p.5 -->

![Originalabbildung aus chinesischem PDF — p.5](/docs/rockchip-rk805-pmic/assets/cn-p005-figure-02.png)

*Originalabbildung aus chinesischem PDF — p.5*

<!-- cn PDF p.6 -->

![Originalabbildung aus chinesischem PDF — p.6](/docs/rockchip-rk805-pmic/assets/cn-p006-figure-01.png)

*Originalabbildung aus chinesischem PDF — p.6*

<!-- cn PDF p.6 -->

Pindefinitionen (zeilenweise aus den obigen Abbildungen übertragen; Quellnamen und I/O beibehalten)

| Pin-Nr. | Pinname | Beschreibung |
| --- | --- | --- |
| 1 | EN | Ein-/Ausschaltfreigabe, aktiv High, interner 800k-Pull-down nach Masse |
| 2 | SLEEP | Steuereingang für Schlafmodus |
| 3 | LDO1 | LDO1-Ausgang |
| 4 | VCC5 | Versorgung von LDO1/2 |
| 5 | LDO2 | LDO2-Ausgang |
| 6 | INT | Interrupt-Anforderung, Open Drain |
| 7 | SCL | I2C-Takteingang |
| 8 | SDA | I2C-Datenein-/ausgang |
| 9 | RESETB | Reset-Pin nach dem Einschalten, aktiv Low |
| 10 | FB2 | Ausgangsrückkopplungsspannung von buck2 |
| 11 | SW2 | Schaltknoten von buck2 |
| 12 | VCC2 | Versorgung von buck2 |
| 13 | VCC1 | Versorgung von buck1 |
| 14 | SW1 | Schaltknoten von buck1 |
| 15 | FB1 | Ausgangsrückkopplungsspannung von buck1 |
| 16 | OUT1 | Allgemeiner Digitalausgang 1, CMOS-Pegel, High entspricht VFB4 |
| 17 | OUT2 | Allgemeiner Digitalausgang 2, CMOS-Pegel, High entspricht VFB4 |
| 18 | XIN | 32.768KHz-Quarzoszillatoreingang |
| 19 | XOUT | 32.768KHz-Quarzoszillatorausgang |
| 20 | VREF | Interne Referenzspannung |
| 21 | REFGND | Referenzmasse |
| 22 | VCCA | Versorgung von controller |
| 23 | VCC6 | Versorgung von LDO3 |
| 24 | LDO3 | LDO3-Ausgang |
| 25 | CLK32K | 32.768KHz-Taktausgang, Open Drain |
| 26 | FB4 | Ausgangsrückkopplungsspannung von buck4 |
| 27 | SW4 | Schaltknoten von buck4 |
| 28 | VCC4 | Versorgung von buck4 |
| 29 | VCC3 | Versorgung von buck3 |
| 30 | SW3 | Schaltknoten von buck3 |
| 31 | FB3 | Ausgangsrückkopplungsspannung von buck3 |
| 32 | PWRON | Einschalttasteneingang, aktiv Low, interner 17k-Pull-up nach VCCA |
| Exposed pad | Exposed ground | Masse |

### 1.4 Wichtige Begriffe

<!-- cn PDF p.6 -->

I2C-7-Bit-Slave-Adresse: 0x18. Die PMIC hat drei Betriebsarten.

<!-- cn PDF p.6 -->

1. Normalbetrieb: Im normalen Systembetrieb liegt pmic_sleep auf Low.

<!-- cn PDF p.6 -->

2. Schlaf: Zur Minimierung des Standby-Verbrauchs senkt die PMIC ihren Eigenverbrauch, reduziert einzelne Spannungen oder deaktiviert Ausgänge gemäß Produktbedarf. Der AP konfiguriert pmic_sleep per I2C für Schlaf und setzt es auf High. Beim Aufwachen des SoC wird es Low und die PMIC verlässt den Schlafmodus.

<!-- cn PDF p.6 -->

3. Abschalten: Der AP konfiguriert pmic_sleep per I2C zum Abschalten und setzt es auf High, um das gesamte System auszuschalten.

- pmic_sleep: Low = Normalbetrieb; High = Schlaf oder Abschalten.
- pmic_int: normalerweise High, bei Interrupt bis zur Bearbeitung Low.
- out1/out2: allgemeine GPIOs nur als Push-Pull-Ausgänge.
- pmic_pwron: Einschalttaste anschließen; der Treiber erkennt Drücken/Loslassen.
- DCDC: PWM (force PWM), PFM und dynamisches AUTO. AUTO ist effizienter, hat aber schlechteres dynamisches Welligkeitsverhalten. Für Stabilität läuft das System mit PWM und schläft mit AUTO PWM/PFM.
- DCDC3-Spannungseinstellung:

<!-- cn PDF p.7 -->

DCDC3 lässt sich nur durch externe Spannungsteilerwiderstände, nicht per Register einstellen. Bei Bedarf Hardware ändern; Rockchip nutzt ihn meist für VCC_DDR. Es folgen DCDC-/LDO-Bereiche.

<!-- cn PDF p.7 -->

1. DCDC-Spannungsbereich ist nicht kontinuierlich:

<!-- cn PDF p.7 -->

| Spannungsbereich(V) | Schritt(mV) | Werte(V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 2.2 | 200 | 1.8、 2.0、2.2 |
| 2.3 | Keiner | 2.3 |

<!-- cn PDF p.7 -->

2. LDO-Spannungsbereich ist kontinuierlich:

<!-- cn PDF p.7 -->

| Spannungsbereich(V) | Schritt(mV) | Werte(V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、 0.9、1.0、1.1、 1.2、 ...... 3.4 |

<!-- cn PDF p.7 -->

### 1.5 Einschaltbedingungen und -reihenfolge

<!-- cn PDF p.7 -->

1. Einschalten: Eine Bedingung genügt — EN wechselt Low→High; EN bleibt High und RTC-Alarminterrupt tritt auf; EN bleibt High und PWRON wird gedrückt.

<!-- cn PDF p.7 -->

2. Einschaltreihenfolge: Verschiedene SoC-Plattformen können unterschiedliche Reihenfolgen der Versorgungen verlangen. Einzelheiten zu verfügbaren Reihenfolgen stehen im aktuellen Datenblatt.

<!-- cn PDF p.7 -->

![Originalabbildung aus chinesischem PDF — p.7](/docs/rockchip-rk805-pmic/assets/cn-p007-figure-01.png)

*Originalabbildung aus chinesischem PDF — p.7*

<!-- cn PDF p.8 -->

Editierbare Übertragung von Tabelle 4-1: RK805-0 AP=Null, BOOT(OTP)=0; RK805-1 AP=RK3228, BOOT(OTP)=1; RK805-2 AP=RK1108, BOOT(OTP)=1.

| Ausgang | Spannungsbereich (Schritt) | Max. Strom | RK805-0 Spannung / Sequenz | RK805-1 Spannung / Sequenz | RK805-2 Spannung / Sequenz |
| --- | --- | --- | --- | --- | --- |
| BUCK1 | 0.7125V–1.45V (12.5mV) / 1.8V / 2V / 2.2V / 2.3V | 2.5A | 1.0V / 2 | 1.1V / 2 | 1.0V / 2 |
| BUCK2 | 0.7125V–1.45V (12.5mV) / 1.8V / 2V / 2.2V / 2.3V | 2.5A | 1.0V / 2 | 1.1V / 2 | 1.0V / X |
| BUCK3 | Durch externe Widerstände festgelegt | 1.5A | X / 3 | X / 3 | X / 3 |
| BUCK4 | 0.8V–3.5V (0.1V) | 1.5A | 3.3V / 5 | 3.3V / 5 | 3.3V / 5 |
| LDO1 | 0.8V–3.4V (0.1V) | 300mA | 1.0V / 1 | 1.8V / 4 | 1.0V / 1 |
| LDO2 | 0.8V–3.4V (0.1V) | 300mA | 1.8V / 4 | 1.8V / 4 | 1.8V / 4 |
| LDO3 | 0.8V–3.4V (0.1V) | 100mA | 1.0V / 1 | 1.0V / 1 | 1.0V / 1 |
| RESETB |  |  | X / 8 | X / 10 | X / 10 |

## 2. Konfiguration

<!-- cn PDF p.8 -->

### 2.1 Treiber und menuconfig

<!-- cn PDF p.8 -->

Kernel 3.10: RK805 verwendet den RK816-Treiber:

<!-- cn PDF p.8 -->

```text
drivers/mfd/rk816.c
drivers/input/misc/rk816-pwrkey.c
drivers/rtc/rtc-rk816.c
drivers/gpio/gpio-rk816.c
drivers/regulator/rk816-regulator.c
```

<!-- cn PDF p.8 -->

menuconfig-Einstellungen:

<!-- cn PDF p.8 -->

```text
CONFIG_MFD_RK816
CONFIG_GPIO_RK816
CONFIG_RTC_RK816
CONFIG_REGULATOR_RK816
CONFIG_INPUT_RK816_PWRKEY
```

<!-- cn PDF p.8 -->

Kernel 4.4. RK805-Treiberdateien:

<!-- cn PDF p.8 -->

```text
drivers/mfd/rk808.c
drivers/input/misc/rk8xx-pwrkey.c
drivers/rtc/rtc-rk808.c
drivers/gpio/gpio-rk8xx.c
drivers/regulator/rk818-regulator.c
drivers/clk/clk-rk808.c
```

<!-- cn PDF p.8 -->

menuconfig-Einstellungen:

<!-- cn PDF p.8 -->

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_GPIO_RK8XX
CONFIG_REGULATOR_RK818
CONFIG_INPUT_RK8XX_PWRKEY
CONFIG_COMMON_CLK_RK808
```

<!-- cn PDF p.8 -->

Kernel 4.19. RK805-Treiberdateien:

<!-- cn PDF p.9 -->

```text
drivers/mfd/rk808.c
drivers/input/misc/rk805-pwrkey.c       // 跟4.4内核不同
drivers/rtc/rtc-rk808.c
drivers/pinctrl/pinctrl-rk805.c         // 跟4.4内核不同
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
```

<!-- cn PDF p.9 -->

menuconfig-Einstellungen:

<!-- cn PDF p.9 -->

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_PINCTRL_RK805
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK805_PWRKEY
CONFIG_COMMON_CLK_RK808
```

<!-- cn PDF p.9 -->

### 2.2 DTS-Konfiguration

<!-- cn PDF p.9 -->

Die DTS für Kernel 3.10 enthält I2C-Anbindung, Hauptknoten, regulator, rtc und poweroff.

<!-- cn PDF p.9 -->

```text
&i2c1 {
    rk805: rk805@18 {
        reg = <0x18>;
        status = "okay";
    };
};

#include "../../../arm/boot/dts/rk805.dtsi"
&rk805 {
    gpios = <&gpio2 GPIO_A6 GPIO_ACTIVE_HIGH>, <&gpio2 GPIO_D2 GPIO_ACTIVE_LOW>;
    rk805,system-power-controller;
    gpio-controller;
    #gpio-cells = <2>;

    rtc {
        status = "disabled";
    };

    regulators {
        rk805_dcdc1_reg: regulator@0 {
            regulator-name = "vdd_logic";
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x1>;
            regulator-initial-state = <3>;
            regulator-boot-on;
            regulator-always-on;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-enabled;
                regulator-state-uv = <1000000>;
            };
        };
        rk805_dcdc2_reg: regulator@1 {
                    .............
        };
        rk805_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

<!-- cn PDF p.10 -->

1. Vollständigen rk805-Knoten unter dem zugehörigen I2C-Knoten einfügen, status = "okay" setzen.

<!-- cn PDF p.10 -->

2. Hauptknoten: Folgendes nicht verändern.

<!-- cn PDF p.10 -->

```text
rk805,system-power-controller：声明RK805具备管理系统下电的功能；
gpio-controller：声明RK805具有GPIO的功能；
#gpio-cells：使⽤者引⽤RK805的GPIO时需要指定的参数个数;
```

<!-- cn PDF p.10 -->

RK805-GPIO referenzieren: gpios = <&rk805 0 GPIO_ACTIVE_LOW>;. Parameter 1 ist fest &rk805, Parameter 2 ist 0 (out1) oder 1 (out2), Parameter 3 die Polarität. Änderbares gpios im Hauptknoten benennt zuerst pmic_int, dann pmic_sleep.

<!-- cn PDF p.10 -->

3. Regulator-Eigenschaften:

- regulator-name: Versorgungsname möglichst gemäß Schaltplan; Abgleich in regulator_get.
- regulator-min-microvolt / regulator-max-microvolt: minimale/maximale Laufzeitspannung.
- regulator-initial-mode: DCDC-Laufzeitmodus, normalerweise 1; 1 force pwm, 2 auto pwm/pfm.
- regulator-state-mode: DCDC-Schlafmodus, normalerweise 2; dieselben Werte.
- regulator-initial-state: Suspend-Modus, muss 3 sein.
- regulator-boot-on: bei Registrierung einschalten.
- regulator-always-on: Abschalten im Betrieb verbieten und bei Registrierung einschalten.
- regulator-state-enabled: im Schlaf versorgt bleiben; zum Abschalten durch regulator-state-disabled ersetzen.
- regulator-state-uv: Standby-Spannung bei nicht abgeschalteter Versorgung.

<!-- cn PDF p.11 -->

Bei gleichen Werten von regulator-min-microvolt und regulator-max-microvolt setzt die Registrierung automatisch diese Spannung und aktiviert die Versorgung. regulator-boot-on oder regulator-always-on aktiviert ebenfalls: Gleiche Grenzwerte setzen die Spannung, unterschiedliche behalten die hardwareseitige PMIC-Einschaltspannung.

<!-- cn PDF p.11 -->

4. RTC: Zum Abschalten etwa in einem Box-Produkt den Knoten mit status = "disabled" ergänzen. Zum Aktivieren gesamten RTC-Knoten entfernen oder status = "okay" setzen.

<!-- cn PDF p.11 -->

5. Poweroff

<!-- cn PDF p.11 -->

```text
gpio_poweroff {
    compatible = "gpio-poweroff";
    gpios = <&gpio2 GPIO_D2 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

<!-- cn PDF p.11 -->

RK805 schaltet die gesamte PMIC durch High an pmic_sleep ab. Diesen Knoten unter der Wurzel ergänzen; gpios ist änderbar und benennt pmic_sleep.

<!-- cn PDF p.11 -->

Kernel-4.4-DTS: I2C-Anbindung, Hauptknoten, rtc, pwrkey, gpio und regulator.

<!-- cn PDF p.11 -->

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
    rk805: rk805@18 {
        compatible = "rockchip,rk805";
        status = "okay";
        reg = <0x18>;
        interrupt-parent = <&gpio2>;
        interrupts = <6 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l>;
        rockchip,system-power-controller;
        wakeup-source;
        gpio-controller;
        #gpio-cells = <2>;
        rtc {
            status = "disabled";
        };
        pwrkey {
            status = "disabled";
        };
        gpio {
            status = "okay";
        };
        regulators {
            compatible = "rk805-regulator";
            status = "okay";
            #address-cells = <1>;
            #size-cells = <0>;
            vdd_logic: RK805_DCDC1@0 {
                regulator-compatible = "RK805_DCDC1";
                regulator-name = "vdd_logic";
                regulator-init-microvolt = <1100000>;
                regulator-min-microvolt = <712500>;
                regulator-max-microvolt = <1450000>;
                regulator-initial-mode = <0x1>;
                regulator-ramp-delay = <12500>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };

            vdd_arm: RK805_DCDC2@1 {
                .................
            };
            vcc_ddr: RK805_DCDC3@2 {
                .................
            };
            .............................
        };
    };
};
```

<!-- cn PDF p.12 -->

1. Vollständigen rk805-Knoten unter dem zugehörigen I2C-Knoten einfügen, status = "okay" setzen.

<!-- cn PDF p.12 -->

2. Hauptknoten: Folgendes nicht verändern.

<!-- cn PDF p.12 -->

```text
compatible = "rockchip,rk805";
reg = <0x18>;
rockchip,system-power-controller;
wakeup-source;
gpio-controller;
#gpio-cells = <2>;
```

<!-- cn PDF p.12 -->

Änderbare Felder gemäß pinctrl-Regeln:

<!-- cn PDF p.13 -->

interrupt-parent: GPIO-Controller von pmic_int; interrupts: Pinindex und Polarität darin; pinctrl-names: fest "default"; pinctrl-0: Referenz auf pmic_int aus pinctrl.

<!-- cn PDF p.13 -->

3. rtc, pwrkey, gpio: Falls in menuconfig gewählt, aber nicht benötigt, entsprechende DTS-Knoten mit status = "disabled" ergänzen. Die Treiber bleiben deaktiviert; mögliche Boot-Fehlermeldungen können ignoriert werden. Zum Aktivieren Knoten entfernen oder status = "okay" setzen.

<!-- cn PDF p.13 -->

4. Regulator:

- regulator-compatible: Abgleichname bei Registrierung; nicht ändern, sonst Ladefehler.
- regulator-name: Versorgungsname gemäß Hardware; von regulator_get verwendet.
- regulator-init-microvolt: Initialspannung in u-boot, im Kernel unwirksam.
- regulator-min-microvolt / regulator-max-microvolt: Laufzeitminimum/-maximum.
- regulator-initial-mode: Laufzeit-DCDC-Modus, normalerweise 1; 1 force pwm, 2 auto pwm/pfm.
- regulator-mode: Schlafmodus, normalerweise 2; dieselben Werte.
- regulator-initial-state: Suspend-Modus, muss 3 sein.
- regulator-boot-on: bei Registrierung aktivieren.
- regulator-always-on: Abschalten im Betrieb verbieten, bei Registrierung aktivieren.
- regulator-ramp-delay: DCDC-Spannungsanstiegszeit, fest 12500.
- regulator-on-in-suspend: Versorgung im Schlaf behalten; zum Abschalten regulator-off-in-suspend.
- regulator-suspend-microvolt: Standby-Spannung bei aktiver Versorgung.

<!-- cn PDF p.13 -->

Kernel 4.19: DTS wie 4.4, jedoch ohne gpio-Unterknoten. Andere Module referenzieren RK805-Pins weiterhin mit gpios = <&rk805 0 GPIO_ACTIVE_LOW>;.

<!-- cn PDF p.13 -->

### 2.4 Funktionsschnittstellen

<!-- cn PDF p.13 -->

Die folgenden Schnittstellen decken den üblichen Bedarf ab: regulator ein-/ausschalten sowie Spannung setzen und auslesen.

<!-- cn PDF p.13 -->

1. Regulator beziehen: `struct regulator *regulator_get(struct device *dev, const char *id)`. dev darf NULL sein; id entspricht regulator-name in der DTS.

<!-- cn PDF p.13 -->

2. Regulator freigeben: `void regulator_put(struct regulator *regulator)`

<!-- cn PDF p.14 -->

3. Regulator einschalten: `int regulator_enable(struct regulator *regulator)`

<!-- cn PDF p.14 -->

4. Regulator ausschalten: `int regulator_disable(struct regulator *regulator)`

<!-- cn PDF p.14 -->

5. Spannung lesen: `int regulator_get_voltage(struct regulator *regulator)`

<!-- cn PDF p.14 -->

6. Spannung setzen: `int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)`. Der Aufrufer muss min_uV = max_uV gewährleisten.

<!-- cn PDF p.14 -->

7. Beispiel

<!-- cn PDF p.14 -->

```text
struct regulator *rdev_logic;

rdev_logic = regulator_get(NULL, "vdd_logic");          // 获取vdd_logic
regulator_enable(rdev_logic);                           // 使能vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
regulator_disable(rdev_logic);                          // 关闭vdd_logic
regulator_put(rdev_logic);                              // 释放vdd_logic
```

<!-- cn PDF p.14 -->

Kernel 4.4 und 4.19 bieten auch devm_-Regulator-Schnittstellen zur Ressourcenverwaltung.

<!-- cn PDF p.14 -->

## 3. Debugging

<!-- cn PDF p.14 -->

### 3.1 Kernel 3.10

<!-- cn PDF p.14 -->

Die PMIC-Treiberlogik ist einfach; entscheidend sind Registerwerte. Knoten: /sys/rk816/rk816_test. Lesen: `echo r [addr] > /sys/rk816/rk816_test`. Schreiben: `echo w [addr] [value] > /sys/rk816/rk816_test`. Beispiel `echo r 0x2f > /sys/rk816/rk816_test` liest 0x2f, im Beispiel 0x9b.

<!-- cn PDF p.14 -->

![Originalabbildung aus chinesischem PDF — p.14](/docs/rockchip-rk805-pmic/assets/cn-p014-figure-01.png)

Transkription lesbarer Bildinhalte (Quellbeispiel; unlesbare abgeschnittene Randfragmente werden nicht geraten):

```text
1|shell@rk3228h:/ # echo r 0x2f > /sys/rk816/rk816_test
[  283.091704]  [2:             sh:  618] ------zhangqing: get cmd = r
[  283.091766]  [2:             sh:  618] CMD : r 2f
[  283.091914]  [2:             sh:  618]
[  283.091914]  [2:             sh:  618] 2f 9b
```

*Originalabbildung aus chinesischem PDF — p.14*

<!-- cn PDF p.14 -->

`echo w 0x2f 0x9c > /sys/rk816/rk816_test` setzt Register 0x2f auf 0x9c.

<!-- cn PDF p.15 -->

Nach dem Schreiben erneut lesen, um den Erfolg zu überprüfen.

<!-- cn PDF p.15 -->

![Originalabbildung aus chinesischem PDF — p.15](/docs/rockchip-rk805-pmic/assets/cn-p015-figure-01.png)

Transkription lesbarer Bildinhalte (Quellbeispiel; unlesbare abgeschnittene Randfragmente werden nicht geraten):

```text
1|shell@rk3228h:/ # echo r 0x2f > /sys/rk816/rk816_test
[  283.091704]  [2:             sh:  618] ------zhangqing: get cmd = r
[  283.091766]  [2:             sh:  618] CMD : r 2f
[  283.091914]  [2:             sh:  618]
[  283.091914]  [2:             sh:  618] 2f 9b
```

*Originalabbildung aus chinesischem PDF — p.15*

<!-- cn PDF p.15 -->

### 3.2 Kernel 4.4

<!-- cn PDF p.15 -->

Befehlssyntax wie 3.10, aber unter 4.4 lautet der Pfad /sys/rk8xx/rk8xx_dbg.

<!-- cn PDF p.15 -->

### 3.3 Kernel 4.19

<!-- cn PDF p.15 -->

Siehe Befehle für Kernel 4.4.

Redaktionshinweis: Die Spannungstabelle enthält 0.737.5; mutmaßlicher Tippfehler unverändert übernommen. Registerbilder sind Quellbeispiele, keine ArmSoM-Messungen.

{% endraw %}
