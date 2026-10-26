---
title: "Rockchip RK801 PMIC: Versorgung, DTS und Register-Debugging"
description: "Rockchip RK801 PMIC: Versorgung, DTS und Register-Debugging — V1.1.0"
excerpt: "Rockchip RK801 PMIC: Versorgung, DTS und Register-Debugging — V1.1.0"
translation_key: "117-rockchip-rk801-pmic"
slug: "117-rockchip-rk801-pmic"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK801", "PMIC", "Linux"]
---

{% raw %}

Plattformreferenz: RK-KF-YF-C57 V1.1.0, RK801 / Linux 6.1. Behandelt Module, Begriffe, Funktionen, DTS und Fehlerdiagnose. PMIC, SoC, SDK/BSP, Kernel, Versorgung und Verdrahtung der konkreten ArmSoM-Platine prüfen; keine allgemeine Kompatibilitätszusage. Keine ArmSoM-Hardwarevalidierung. Chinesisch nutzt chinesische Bilder, EN/RU/DE englische. Hardwarebefehle sind dokumentiert, nicht ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- en PDF p.5 -->

## 1. Grundlagen

<!-- en PDF p.5 -->

### 1.1 Überblick

<!-- en PDF p.5 -->

RK801 ist eine leistungsfähige PMIC mit 4 Hochstrom-DCDC, 2 LDO, 1 SWITCH, 1 PWRON und einstellbarer Einschaltreihenfolge. Systemversorgungen werden allgemein in DCDC und LDO unterteilt. Ihre allgemeinen Eigenschaften folgen; Einzelheiten sind separat nachzuschlagen.

<!-- en PDF p.5 -->

1. DCDC: hoher Wirkungsgrad bei großer Ein-/Ausgangsspannungsdifferenz, jedoch größere Welligkeit und höhere Kosten; für große Spannungsdifferenzen und Lastströme. Üblich sind PWM (gutes dynamisches Welligkeitsverhalten, niedriger Wirkungsgrad) und PFM (hoher Wirkungsgrad, aber geringe Belastbarkeit).

<!-- en PDF p.5 -->

2. LDO: bei großer Spannungsdifferenz niedriger Wirkungsgrad und geringe Kosten. Schaltungsoptimierungen erhöhen den Wirkungsgrad: Bei 1.1V LDO-Ausgang kann der Eingang beispielsweise vom DCDC VCCIO_3.3V gespeist werden. Soweit schaltungstechnisch möglich, den LDO am DCDC-Ausgang betreiben und die Einschaltreihenfolge beachten.

<!-- en PDF p.5 -->

### 1.2 Chipfunktionen

<!-- en PDF p.5 -->

Aus Anwendersicht hat RK801 zwei Funktionsgruppen:

<!-- en PDF p.5 -->

1. Regulator: Versorgungszustand jedes DCDC und LDO steuern.

<!-- en PDF p.5 -->

2. Pwrkey: Drücken/Loslassen der Einschalttaste erkennen und damit einen GPIO des AP einsparen.

<!-- en PDF p.6 -->

### 1.3 Chipanschlüsse

<!-- en PDF p.6 -->

![Englische Originalabbildung — p.6](/docs/rockchip-rk801-pmic/assets/en-p006-figure-01.png)

*Englische Originalabbildung — p.6*

<!-- en PDF p.6 -->

In der folgenden Beschreibung besonders auf PWRCTRL und INT achten.

<!-- en PDF p.7 -->

![Englische Originalabbildung — p.7](/docs/rockchip-rk801-pmic/assets/en-p007-figure-01.png)

*Englische Originalabbildung — p.7*

<!-- en PDF p.7 -->

![Englische Originalabbildung — p.7](/docs/rockchip-rk801-pmic/assets/en-p007-figure-02.png)

*Englische Originalabbildung — p.7*

<!-- en PDF p.7 -->

Pindefinitionen (zeilenweise aus den obigen Abbildungen übertragen; Quellnamen und I/O beibehalten)

| Pin-Nr. | Pinname | Beschreibung |
| --- | --- | --- |
| 1 | VCC4 | Versorgung von BUCK4 |
| 2 | SCL | I2C-Takteingang (Open-Drain-Ausgang) |
| 3 | SDA | I2C-Datenein-/ausgang (Open Drain) |
| 4 | RESETB | Reset-Pin nach dem Einschalten, aktiv Low |
| 5 | VCCA | Versorgung von inner circuit |
| 6 | BST2 | Bootstrap-Kondensator des Hochvolt-BUCK2 |
| 7 | INT | Interrupt-Anforderung (Open Drain) |
| 8 | SW2 | Schaltknoten von high voltage BUCK2 |
| 9 | VCCH2 | Versorgung von high voltage BUCK2 |
| 10 | VOUT2 | Ausgangsrückkopplungsspannung von high voltage BUCK2 |
| 11 | PWRCTLR | PWRCTLR-Steuereingang |
| 12 | VOUT1 | Ausgangsrückkopplungsspannung von high voltage BUCK1 |
| 13 | VCCH1 | Versorgung von high voltage BUCK1 |
| 14 | SW1 | Schaltknoten von high voltage BUCK1 |
| 15 | BST1 | Bootstrap-Kondensator des Hochvolt-BUCK1 |
| 16 | LDO2 | LDO2-Ausgang |
| 17 | VCC6 | Versorgung von LDO2 |
| 18 | VCC5 | Versorgung von LDO1 |
| 19 | LDO1 | LDO1-Ausgang |
| 20 | VDC | VDC-Eingang |
| 21 | VCC3 | Versorgung von BUCK3 |
| 22 | SW3 | Schaltknoten von BUCK3 |
| 23 | VFB3 | Ausgangsrückkopplungsspannung von BUCK3 |
| 24 | VSW | SWITCH-Ausgang |
| 25 | PWRON | Einschalttasteneingang, aktiv Low, interner 22k-Pull-up nach VCCA |
| 26 | VCC7 | Versorgung von SWITCH |
| 27 | VOUT4 | Ausgangsrückkopplungsspannung von BUCK4 |
| 28 | SW4 | Schaltknoten von BUCK4 |
| Exposed pad | Exposed ground | Masse |

### 1.4 Wichtige Begriffe

<!-- en PDF p.7 -->

I2C-Adresse: 7-Bit-Slave-Adresse 0x27. Die PMIC hat 3 Betriebsarten.

<!-- en PDF p.7 -->

1. PMIC-Normalbetrieb. Im normalen Systembetrieb arbeitet die PMIC im Normalmodus; pmic_pwrctrl liegt auf Low.

<!-- en PDF p.7 -->

2. PMIC-Schlafmodus. Im Schlaf soll der Standby-Verbrauch möglichst gering sein; die PMIC wechselt zur Senkung ihres Eigenverbrauchs in den Schlafmodus. Üblicherweise werden Ausgangsspannungen einzelner Versorgungen reduziert oder Ausgänge abgeschaltet, entsprechend den Produktanforderungen. Beim Standby des Systems

<!-- en PDF p.8 -->

konfiguriert der AP pmic_pwrctrl über I2C für den Schlafmodus und setzt den Anschluss anschließend auf High. Beim Aufwachen des SoC wird pmic_pwrctrl wieder Low und die PMIC verlässt den Schlafmodus.

<!-- en PDF p.8 -->

3. PMIC-Abschaltmodus. Beim Herunterfahren muss die PMIC die Versorgung des gesamten Systems abschalten. Der AP weist pmic_pwrctrl per I2C den Abschaltmodus zu und setzt den Anschluss auf High. Der Treiber wechselt diese Betriebsarten automatisch gemäß DTS und Szenario; keine zusätzliche Anwendersteuerung ist nötig.

- pmic_pwrctrl: normalerweise Low für Normalbetrieb; High aktiviert Schlaf- oder Abschaltmodus.
- pmic_int: normalerweise High; bei einem Interrupt Low, bis dieser bearbeitet ist.
- pmic_pwron: Einschalttaste hardwareseitig anschließen; der Treiber erkennt Drücken/Loslassen.
- DCDC-Betriebsarten: PWM (force PWM) und PFM. AUTO schaltet dynamisch zwischen PWM/PFM um. Unterstützt werden PWM und AUTO PWM/PFM. AUTO bietet hohen Wirkungsgrad, aber schlechteres dynamisches Welligkeitsverhalten. Für Stabilität wird im Betrieb PWM und im Schlaf AUTO PWM/PFM verwendet.
- DCDC3 lässt sich nicht über Register einstellen, sondern nur über externe Spannungsteilerwiderstände. Eine Änderung erfordert Hardwareanpassung. Bei Rockchip wird dieser Ausgang üblicherweise als VCC_DDR genutzt.
- Laufzeit-Spannungsbereiche von DCDC und LDO: Der DCDC-Bereich ist nicht kontinuierlich; siehe Kommentare oder Datenblatt.

<!-- en PDF p.8 -->

```text
// BUCK1
static const struct linear_range rk801_buck1_voltage_ranges[] = {
   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5V - 1.5V, step 12.5mV */
   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8V - 2.2V */
   REGULATOR_LINEAR_RANGE(3300000, 83, 83, 0), /* 3.3V */
   REGULATOR_LINEAR_RANGE(5000000, 84, 84, 0), /* 5.0V */
   REGULATOR_LINEAR_RANGE(5250000, 85, 85, 0), /* 5.25V */
};

// BUCK2
static const struct linear_range rk801_buck2_voltage_ranges[] = {
   REGULATOR_LINEAR_RANGE(800000,  0, 2, 50000),   /* 0.8V - 0.9V */
   REGULATOR_LINEAR_RANGE(1800000, 3, 4, 400000),  /* 1.8V - 2.2V */
   REGULATOR_LINEAR_RANGE(3300000, 5, 5, 0),   /* 3.3V */
   REGULATOR_LINEAR_RANGE(5000000, 6, 6, 0),   /* 5.0V */
   REGULATOR_LINEAR_RANGE(5250000, 7, 7, 0),   /* 5.25V */
};

// BUCK4
static const struct linear_range rk801_buck4_voltage_ranges[] = {
   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5V - 1.5V */
   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8V - 2.2V */
   REGULATOR_LINEAR_RANGE(2500000, 83, 83, 0), /* 2.5V */
   REGULATOR_LINEAR_RANGE(2800000, 84, 84, 0), /* 2.8V */
   REGULATOR_LINEAR_RANGE(3000000, 85, 85, 0), /* 3.0V */
   REGULATOR_LINEAR_RANGE(3300000, 86, 86, 0), /* 3.3V */
};
```

<!-- en PDF p.9 -->

Die LDO-Spannung ist kontinuierlich einstellbar:

<!-- en PDF p.9 -->

| Spannungsbereich(V) | Schritt(mV) |
| --- | --- |
| 0.5 ~ 3.4 | 50 |

<!-- en PDF p.9 -->

### 1.5 Einschaltbedingungen und -reihenfolge

<!-- en PDF p.9 -->

1. Einschaltbedingungen: Eine Bedingung genügt — VDC auf High oder Betätigung von PWRON im ausgeschalteten Zustand.

<!-- en PDF p.9 -->

2. Einschaltreihenfolge: Verschiedene SoC-Plattformen können unterschiedliche Reihenfolgen der Versorgungen verlangen. Einzelheiten zu verfügbaren Reihenfolgen stehen im aktuellen Datenblatt.

<!-- en PDF p.9 -->

## 2. Konfiguration

<!-- en PDF p.9 -->

### 2.1 Treiber und menuconfig

<!-- en PDF p.9 -->

Treiberdateien:

<!-- en PDF p.9 -->

```text
drivers/mfd/rk808.c
drivers/regulator/rk801-regulator.c
drivers/input/misc/rk805-pwrkey.c
```

<!-- en PDF p.9 -->

menuconfig-Einstellungen:

<!-- en PDF p.10 -->

```text
CONFIG_MFD_RK808
CONFIG_REGULATOR_RK801
CONFIG_INPUT_RK805_PWRKEY
```

<!-- en PDF p.10 -->

### 2.2 Treiberversion

<!-- en PDF p.10 -->

Für vollständige und stabile Funktionen mindestens auf die folgende Treiberversion aktualisieren. drivers/mfd/rk808.c:

<!-- en PDF p.10 -->

```text
commit 0439f30ead1393813d69a01587530652908c9171
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Fri Jun 13 17:19:25 2025 +0800

    mfd: rk808: Print full chip id of rk801

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: I195858d23c862d0f961acb4c04bb1102ab9954c9
```

<!-- en PDF p.10 -->

drivers/regulator/rk801-regulator.c:

<!-- en PDF p.10 -->

```text
commit 1a81f4f6344f7cd4203be508150daeedc00fbedb
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Thu May 29 11:39:58 2025 +0800

    mfd: rk801: Add support for pwrctrl active pol set and reboot rst

    - Don't require pwrctrl dvs if hw compatible version >= 3.
    - Auto parse pwrctrl active pol from GPIO_ACTIVE_{HIGH,LOW} flag.
    - Reset pmic and soc when system reboot if required.

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: I29e60c2a717cee5c9d1e3c6e46ee687352d4a1be
```

<!-- en PDF p.10 -->

### 2.3 DTS-Konfiguration

<!-- en PDF p.10 -->

Die DTS umfasst I2C-Anbindung, Hauptknoten, regulator und weitere Teile. Beispiel: arch/arm/boot/dts/rk3506-rk801.dts. Hardwareschaltung:

<!-- en PDF p.11 -->

![Englische Originalabbildung — p.11](/docs/rockchip-rk801-pmic/assets/en-p011-figure-01.png)

*Englische Originalabbildung — p.11*

<!-- en PDF p.11 -->

DTS-Konfiguration:

<!-- en PDF p.11 -->

```text
&i2c0 {
    status = "okay";
    ......

    rk801: rk801@27 {
        // Cannot be modified.
        compatible = "rockchip,rk801";
        status = "okay";
        reg = <0x27>;

        // PMIC_INT pin configuration. Here is GPIO0_C2, active low.
        interrupt-parent = <&gpio0>;
        interrupts = <RK_PC2 IRQ_TYPE_LEVEL_LOW>;

        // PWRCTRL pin configuration. Here is GPIO0_C1, active high.
        pwrctrl-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;

        // Pinctrl configuration.
        pinctrl-names = "default", "pmic-reset";
        // Initialize pmic_int pin state.
        pinctrl-0 = <&pmic_int>;
        // Set the state of pwrctrl when rebooting. After this configuration, PMIC will reset its various voltages together with the SoC.
        pinctrl-1 = <&soc_pwrctrl_reset>;

        // Cannot be modified. Declare that RK801 has the function of managing system power-down.
        rockchip,system-power-controller;

        // Cannot be modified. Declare PMIC_INT as a wake-up source.
        wakeup-source;

        // Input sources for each regulator.
        // vcc1~7 correspond to: BUCK1/2/3/4, LDO1/2, SWITCH.
        vcc1-supply = <&vcc12v_dc>;
        vcc2-supply = <&vcc12v_dc>;
        vcc3-supply = <&vcc5v0_sys>;
        vcc4-supply = <&vcc5v0_sys>;
        vcc5-supply = <&vcc3v3_sys>;
        vcc6-supply = <&vcc3v3_sys>;
        vcc7-supply = <&vcc3v3_sys>;
        regulators {
            vcc3v3_sys: DCDC_REG1 {
                regulator-name = "vcc3v3_sys";
                regulator-min-microvolt = <3300000>;
                regulator-max-microvolt = <3300000>;
                regulator-initial-mode = <0x1>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <3300000>;
                };
            };

            vcc5v0_sys: DCDC_REG2 {
                regulator-name = "vcc5v0_sys";
                regulator-min-microvolt = <5000000>;
                regulator-max-microvolt = <5000000>;
                regulator-initial-mode = <0x1>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <5000000>;
                };
            };

            vcc_ddr: DCDC_REG3 {
                regulator-name = "vcc_ddr";
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                };
            };

            vdd_cpu: DCDC_REG4 {
                regulator-name = "vdd_cpu";
                regulator-min-microvolt = <500000>;
                regulator-max-microvolt = <1500000>;
                regulator-initial-mode = <0x1>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-off-in-suspend;
                };
            };
            vdd0v9_sys: LDO_REG1 {
                regulator-name = "vdd0v9_sys";
                regulator-min-microvolt = <900000>;
                regulator-max-microvolt = <900000>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <900000>;
                };
            };

            vcc_1v8: LDO_REG2 {
                regulator-name = "vcc_1v8";
                regulator-min-microvolt = <1800000>;
                regulator-max-microvolt = <1800000>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1800000>;
                };
            };

            vcc_3v3: SWITCH_REG {
                regulator-name = "vcc_3v3";
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                };
            };
        };
    };
};

&pinctrl {
    ......

    pmic {
        // pmic_int is set to normally high level, that is, active low.
        pmic_int: pmic-int {
            rockchip,pins = <0 RK_PC2 RK_FUNC_GPIO &pcfg_pull_up>;
        };

        // The level state that the pwrctrl pin should maintain during system reset, must be opposite to the SoC's default power-on state.
        // For example: if the default power-on is down, configure as output high; otherwise, configure as output low.
        soc_pwrctrl_reset: soc-pwrctrl-reset {
            rockchip,pins = <0 RK_PC1 RK_FUNC_GPIO &pcfg_output_high>;
        };
    };
};
```

<!-- en PDF p.14 -->

regulator-Eigenschaften:

- regulator-compatible: Name für den Abgleich bei der Treiberregistrierung; nicht ändern, sonst schlägt das Laden fehl.
- regulator-name: Versorgungsname, möglichst gemäß Schaltplan; für regulator_get abzugleichen.
- regulator-init-microvolt: Initialspannung in u-boot, im Kernel unwirksam.
- regulator-min-microvolt / regulator-max-microvolt: minimale/maximale im Betrieb einstellbare Spannung.
- regulator-initial-mode: DCDC-Laufzeitmodus, üblicherweise 1; 1 = force pwm, 2 = auto pwm/pfm.
- regulator-mode: DCDC-Schlafmodus, üblicherweise 2; dieselben Werte 1/2.
- regulator-boot-on: schaltet die Versorgung bei der regulator-Registrierung ein.
- regulator-always-on: verbietet das Abschalten im Betrieb und schaltet bei der Registrierung ein.
- regulator-on-in-suspend: Versorgung im Schlaf eingeschaltet halten; zum Abschalten durch regulator-off-in-suspend ersetzen.
- regulator-suspend-microvolt: Standby-Spannung bei nicht abgeschalteter Versorgung.

Sind regulator-min-microvolt und regulator-max-microvolt gleich, setzt das Framework bei der Registrierung automatisch diese Spannung und aktiviert die Versorgung. Mit regulator-boot-on oder regulator-always-on wird ebenfalls automatisch eingeschaltet. Bei gleichen Grenzwerten wird diese Spannung gesetzt; bei unterschiedlichen bleibt die hardwareseitige PMIC-Einschaltspannung bestehen.

<!-- en PDF p.14 -->

pwrkey-Konfiguration: Ein fehlender pwrkey-Knoten unter rk801 entspricht aktiviertem pwrkey. Zum Abschalten den Knoten ausdrücklich ergänzen und disabled setzen.

<!-- en PDF p.14 -->

```text
rk801: rk801@27 {

    ......

    pwrkey {
        status = "disabled";
    };
};
```

<!-- en PDF p.15 -->

### 2.4 Funktionsschnittstellen

<!-- en PDF p.15 -->

Die folgenden Schnittstellen decken den üblichen Bedarf ab: regulator ein-/ausschalten sowie Spannung setzen und auslesen.

<!-- en PDF p.15 -->

1. Regulator beziehen: `struct regulator *regulator_get(struct device *dev, const char *id)`. dev darf NULL sein; id entspricht regulator-name in der DTS.

<!-- en PDF p.15 -->

2. Regulator freigeben: `void regulator_put(struct regulator *regulator)`

<!-- en PDF p.15 -->

3. Regulator einschalten: `int regulator_enable(struct regulator *regulator)`

<!-- en PDF p.15 -->

4. Regulator ausschalten: `int regulator_disable(struct regulator *regulator)`

<!-- en PDF p.15 -->

5. Spannung lesen: `int regulator_get_voltage(struct regulator *regulator)`

<!-- en PDF p.15 -->

6. Spannung setzen: `int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)`. Der Aufrufer muss min_uV = max_uV gewährleisten.

<!-- en PDF p.15 -->

7. Beispiel

<!-- en PDF p.15 -->

```text
struct regulator *rdev_logic;

rdev_logic = regulator_get(NULL, "vdd_logic");          // Get vdd_logic
regulator_enable(rdev_logic);                           // Enable vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // Set voltage 1.1v
regulator_disable(rdev_logic);                          // Disable vdd_logic
regulator_put(rdev_logic);                              // Release vdd_logic
```

<!-- en PDF p.15 -->

Kernel ab 4.4 bieten außerdem regulator-Schnittstellen mit Präfix devm_ zur Verwaltung angeforderter Ressourcen.

<!-- en PDF p.15 -->

## 3. Debugging

<!-- en PDF p.15 -->

Die PMIC-Treiberlogik ist relativ einfach; entscheidend sind die endgültigen Registereinstellungen. Nutzbar sind das eingebaute i2cdump oder folgendes Verfahren. Knoten: /sys/rk8xx/rk8xx_dbg

<!-- en PDF p.16 -->

```text
# Read register
echo r [addr]  > /sys/rk8xx/rk8xx_dbg
# Write register
echo w [addr] [value] > /sys/rk8xx/rk8xx_dbg
```

<!-- en PDF p.16 -->

Anwendungsbeispiel:

<!-- en PDF p.16 -->

```text
echo r 0x2f > /sys/rk8xx/rk8xx_dbg          # Read the value of register 0x2f
echo w 0x2f 0x9c > /sys/rk8xx/rk8xx_dbg     # Set the value of register 0x2f to 0x9c
```

<!-- en PDF p.16 -->

Nach dem Schreiben erneut lesen, um den Erfolg zu überprüfen.

Redaktionshinweis: Pintabelle PWRCTLR, Fließtext PWRCTRL. Quellschreibweisen bleiben erhalten; vor Anpassung Hardwareunterlagen prüfen.

{% endraw %}
