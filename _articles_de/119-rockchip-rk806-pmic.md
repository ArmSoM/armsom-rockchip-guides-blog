---
title: "Rockchip RK806 PMIC: Versorgung, DTS und Debugging"
description: "Rockchip RK806 PMIC: Versorgung, DTS und Debugging — V1.0.0"
excerpt: "Rockchip RK806 PMIC: Versorgung, DTS und Debugging — V1.0.0"
translation_key: "119-rockchip-rk806-pmic"
slug: "119-rockchip-rk806-pmic"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK806", "PMIC", "Linux"]
---

{% raw %}

Quelle RK-KF-YF-199 V1.0.0, RK806, Linux 5.10. PMIC-Module, Begriffe, Funktionen, DTS und Diagnose. Nur Plattformreferenz: PMIC, SoC, SDK/BSP, Kernel, Versorgung und Verdrahtung der ArmSoM-Platine prüfen. Keine Hardwarevalidierung. Nur chinesisches PDF vorhanden; alle vier Sprachen verwenden dessen Originalabbildungen einschließlich eingebetteter englischer Beschriftungen. Kein entsprechendes englisches PDF in dieser Charge. Hardwarebefehle wurden nicht ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- cn PDF p.4 -->

## 1. Grundlagen

<!-- cn PDF p.4 -->

### 1.1 Überblick

<!-- cn PDF p.4 -->

RK806 integriert 10 Hochstrom-DCDC, 5 NLDO, 6 PLDO und einstellbare Einschaltreihenfolge. Systemversorgungen sind allgemein DCDC und LDO mit folgenden Eigenschaften (Einzelheiten separat nachschlagen).

<!-- cn PDF p.4 -->

1. DCDC: hoher Wirkungsgrad bei großer Ein-/Ausgangsspannungsdifferenz, jedoch größere Welligkeit und höhere Kosten; für große Spannungsdifferenzen und Lastströme. Üblich sind PWM (gutes dynamisches Welligkeitsverhalten, niedriger Wirkungsgrad) und PFM (hoher Wirkungsgrad, aber geringe Belastbarkeit).

<!-- cn PDF p.4 -->

2. PLDO: wie LDO früherer PMICs, Eingang mindestens 2.0V und höchstens 5.5V.

<!-- cn PDF p.4 -->

3. NLDO: niedrige Ein-/Ausgangsspannungen und geringere Verluste, etwa 1.1V Eingang und 0.9V Ausgang.

<!-- cn PDF p.4 -->

### 1.2 Funktionen

<!-- cn PDF p.4 -->

RK806 bietet drei Funktionsgruppen:

<!-- cn PDF p.4 -->

1. Regulator: Versorgungszustand jedes DCDC und LDO steuern.

<!-- cn PDF p.4 -->

2. GPIO: Drei IOs können die gesamte PMIC in Standby versetzen, einzelne zugewiesene Versorgungen in Standby steuern oder als gewöhnliche GPIOs dienen.

<!-- cn PDF p.4 -->

3. Pwrkey: Drücken/Loslassen der Einschalttaste erkennen und einen AP-GPIO einsparen.

<!-- cn PDF p.5 -->

### 1.3 Anschlussfunktionen

<!-- cn PDF p.5 -->

![Originalabbildung aus chinesischem PDF — p.5](/docs/rockchip-rk806-pmic/assets/cn-p005-figure-01.png)

*Originalabbildung aus chinesischem PDF — p.5*

<!-- cn PDF p.5 -->

Besonders auf SLEEP und INT achten.

<!-- cn PDF p.6 -->

![Originalabbildung aus chinesischem PDF — p.6](/docs/rockchip-rk806-pmic/assets/cn-p006-figure-01.png)

*Originalabbildung aus chinesischem PDF — p.6*

<!-- cn PDF p.7 -->

![Originalabbildung aus chinesischem PDF — p.7](/docs/rockchip-rk806-pmic/assets/cn-p007-figure-01.png)

*Originalabbildung aus chinesischem PDF — p.7*

<!-- cn PDF p.7 -->

Pindefinitionen (zeilenweise aus den obigen Abbildungen übertragen; Quellnamen und I/O beibehalten)

| Pin-Nr. | Pinname | Beschreibung | I/O |
| --- | --- | --- | --- |
| 1 | VCC9 | Versorgung von buck9 | I |
| 2 | SYNC | Master-/Slave-Synchronisationssignal | I/O |
| 3 | SYNC_CLK | 32k-Synchronisationstakt | I/O |
| 4 | PWRON | Einschalttaste, interner Pull-up etwa 45K | I |
| 5 | VOUT8 | Ausgangsrückkopplungsspannung von buck8 | O |
| 6 | SW8 | Schaltknoten von buck8 | O |
| 7 | VCC8 | Versorgung von buck8 | I |
| 8 | NLDO5 | NMOS LDO5-Ausgang | O |
| 9 | VCC14 | Versorgung von NLDO3/4/5 | I |
| 10 | NLDO4 | NMOS LDO4-Ausgang | O |
| 11 | NLDO3 | NMOS LDO3-Ausgang | O |
| 12 | NLDO2 | NMOS LDO2-Ausgang | O |
| 13 | VCC13 | Versorgung von NLDO1/2 | I |
| 14 | NLDO1 | NMOS LDO1-Ausgang | O |
| 15 | MOSI/SCL | SPI MOSI, I2C SCL | I/O |
| 16 | MISO/SDA/PWRCRTL3 | SPI MISO, I2C SDA, PWRCRTL3-Steuerung | I/O |
| 17 | CLK | SPI CLK | O |
| 18 | CS | I2C/SPI-Auswahl; Verbindung mit VCCA wählt I2C | I |
| 19 | INT | Interrupt | O |
| 20 | VCCIO/PLDO6 | PMOS-LDO6-Ausgang; VCCIO für SPI/I2C-Schnittstelle | O |
| 21 | VCCA | Analogversorgung; Versorgung von PLDO6 und Systemlogik | I |
| 22 | VCC4 | Versorgung von buck4 | I |
| 23 | SW4 | Schaltknoten von buck4 | O |
| 24 | VOUT4 | Ausgangsrückkopplungsspannung von buck4 | O |
| 25 | VOUT10 | Ausgangsrückkopplungsspannung von buck10 | O |
| 26 | SW10 | Schaltknoten von buck10 | O |
| 27 | VCC10 | Versorgung von buck10 | I |
| 28 | VCC6 | Versorgung von buck6 | I |
| 29 | SW6 | Schaltknoten von buck6 | O |
| 30 | VOUT6 | Ausgangsrückkopplungsspannung von buck6 | O |
| 31 | FB6 | Rückkopplung von buck6 bei externem Widerstandsteiler | O |
| 32 | VDC | VDC-Einschaltsignal | I |
| 33 | VCC2 | Versorgung von buck2 | I |
| 34 | VCC2 | Versorgung von buck2 | I |
| 35 | SW2 | Schaltknoten von buck2 | O |
| 36 | SW2 | Schaltknoten von buck2 | O |
| 37 | VOUT2 | Ausgangsrückkopplungsspannung von buck2 | O |
| 38 | FB2 | Rückkopplung von buck2 bei externem Widerstandsteiler | O |
| 39 | EXT_EN | Externe DCDC-Freigabe; Master-/Slave-Auswahl | I |
| 40 | RESETB | AP zurücksetzen | I/O |
| 41 | VOUT7 | Ausgangsrückkopplungsspannung von buck7 | O |
| 42 | SW7 | Schaltknoten von buck7 | O |
| 43 | VCC7 | Versorgung von buck7 | I |
| 44 | VCC5 | Versorgung von buck5 | I |
| 45 | SW5 | Schaltknoten von buck5 | O |
| 46 | VOUT5 | Ausgangsrückkopplungsspannung von buck5 | O |
| 47 | FB5 | Rückkopplung von buck5 bei externem Widerstandsteiler | O |
| 48 | FB1 | Rückkopplung von buck1 bei externem Widerstandsteiler | O |
| 49 | VOUT1 | Ausgangsrückkopplungsspannung von buck1 | O |
| 50 | SW1 | Schaltknoten von buck1 | O |
| 51 | SW1 | Schaltknoten von buck1 | O |
| 52 | VCC1 | Versorgung von buck1 | I |
| 53 | VCC1 | Versorgung von buck1 | I |
| 54 | VCC3 | Versorgung von buck3 | I |
| 55 | SW3 | Schaltknoten von buck3 | O |
| 56 | VOUT3 | Ausgangsrückkopplungsspannung von buck3 | O |
| 57 | PLDO3 | PMOS LDO3-Ausgang | O |
| 58 | PLDO2 | PMOS LDO2-Ausgang | O |
| 59 | VCC11 | Versorgung von PLDO1/2/3 | I |
| 60 | PLDO1 | PMOS LDO1-Ausgang | O |
| 61 | PWRCRTL2 | PWRCRTL2-Steuerung | I/O |
| 62 | PWRCRTL1 | PWRCRTL1-Steuerung | I/O |
| 63 | PLDO4 | PMOS LDO4-Ausgang | O |
| 64 | VCC12 | Versorgung von PLDO4/5 | I |
| 65 | PLDO5 | PMOS LDO5-Ausgang | O |
| 66 | FB9 | Rückkopplung von buck9 bei externem Widerstandsteiler | O |
| 67 | VOUT9 | Ausgangsrückkopplungsspannung von buck9 | O |
| 68 | SW9 | Schaltknoten von buck9 | O |
| Exposed | ePAD | Masse |  |

### 1.4 Wichtige Begriffe

<!-- cn PDF p.7 -->

Der Chip unterstützt SPI und I2C. Die dokumentierte Software unterstützt nur SPI, standardmäßig mit 1M. Die PMIC hat drei Betriebsarten.

<!-- cn PDF p.7 -->

1. Normalbetrieb: Der aktive Pegel von pmic_sleep ist einstellbar.

<!-- cn PDF p.8 -->

2. Schlafmodus: Standby-Verbrauch durch Absenken einzelner Spannungen oder Abschalten von Versorgungen nach Produktbedarf reduzieren. Der AP konfiguriert pmic_sleep über SPI und setzt es High; beim SoC-Aufwachen wird es Low und die PMIC verlässt den Schlafmodus.

<!-- cn PDF p.8 -->

3. Abschalten: Der AP konfiguriert pmic_sleep über SPI und setzt es High, um das System abzuschalten.

- int: normalerweise High, bei Interrupt bis zur Bearbeitung Low.
- pwrcrtl1/pwrcrtl2/pwrcrtl3: als gewöhnliche GPIOs nutzbar. Die Quelle nennt trotz drei aufgeführter Anschlüsse „diese zwei Pins“; Abweichung prüfen.
- pwron: Einschalttaste zur Erkennung von Drücken/Loslassen.
- DCDC: PWM (force PWM), PFM und AUTO. AUTO ist effizienter, aber schlechter im dynamischen Welligkeitsverhalten. Für Stabilität im Betrieb PWM, im Schlaf AUTO PWM/PFM.
- PLDO6: PMIC/AP-VCCIO-Versorgung. Verwendete IOs müssen mit mindestens 1.8V versorgt werden; PLDO6 darf daher üblicherweise nicht unter 1.8V liegen oder im Standby abgeschaltet werden.
- Es folgen DCDC-/LDO-Laufzeitbereiche.

<!-- cn PDF p.8 -->

1. DCDC-Spannungsbereich ist nicht kontinuierlich:

<!-- cn PDF p.8 -->

| Spannungsbereich(V) | Schritt(mV) | Werte(V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 6.25 | 0.5、0.50625、 ...... 1.5 |
| 1.5~ 3.4 | 25 | 1.5、1.525、...... 3.4 |

<!-- cn PDF p.8 -->

2. NLDO-/PLDO-Spannungsbereich ist kontinuierlich:

<!-- cn PDF p.8 -->

| Spannungsbereich(V) | Schritt(mV) | Werte(V) |
| --- | --- | --- |
| 0.5 ~ 3.4 | 12.5 | 0.5125、0.525、...... 3.4 |

<!-- cn PDF p.8 -->

### 1.5 Betrieb mit zwei PMICs

<!-- cn PDF p.8 -->

Master/Slave wird beim ersten Einschalten über EXT_EN festgelegt: mit VCCA kurzgeschlossen = Slave; offen oder nach Low gezogen = Master. Bei zwei RK806 SYNC_CLK und SYNC verbinden. Master liefert SYNC_CLK nahe 32K, Slave empfängt ihn. SYNC-Impulse synchronisieren Ein-/Ausschalten, Reset und Versorgungsreihenfolge.

<!-- cn PDF p.9 -->

PWRON beider Chips und RESETB beider Chips jeweils verbinden, für Einschaltfreigabe und externe Resettaste. VDC-Anschlüsse können gemeinsam verbunden werden; alternativ Slave-VDC an Master-EXT_EN.

<!-- cn PDF p.9 -->

## 2. Konfiguration

<!-- cn PDF p.9 -->

### 2.1 Treiber und menuconfig

<!-- cn PDF p.9 -->

RK806-Treiberdateien:

<!-- cn PDF p.9 -->

```text
drivers/mfd/rk806-core.c
drivers/mfd/rk806-spi.c
drivers/pinctrl/pinctrl-rk806.c
drivers/regulator/rk806-regulator.c
```

<!-- cn PDF p.9 -->

menuconfig-Einstellungen:

<!-- cn PDF p.9 -->

```text
CONFIG_PINCTRL_RK806=y
CONFIG_MFD_RK806_SPI=y
CONFIG_REGULATOR_RK806=y
```

<!-- cn PDF p.9 -->

### 2.2 DTS-Konfiguration

<!-- cn PDF p.9 -->

Kernel-5.10-DTS umfasst SPI-Anbindung, GPIO und regulator. DTS für einen RK806:

<!-- cn PDF p.9 -->

```text
&pinctrl {
         pmic {
                soc_slppin_gpio: soc_slppin_gpio {
                        rockchip,pins = <0 RK_PA2
                                RK_FUNC_GPIO &pcfg_output_low>;
                };
                soc_slppin_shutdown: soc_slppin_shutdown {
                        rockchip,pins = <0 RK_PA2
                                RK_FUNC_GPIO &pcfg_output_high>;
                };
        };
};

&spi2 {
        status = "okay";
        assigned-clocks = <&cru CLK_SPI2>;
        assigned-clock-rates = <200000000>;
        num-cs = <&spi2 {
        status = "okay";
        assigned-clocks = <&cru CLK_SPI2>;
        assigned-clock-rates = <200000000>;
        num-cs = <2>;

        rk806single@0 {
                compatible = "rockchip,rk806";
                spi-max-frequency = <1000000>;
                reg = <0x0>;

                interrupt-parent = <&gpio0>;
                interrupts = <7 IRQ_TYPE_LEVEL_LOW>;

                pinctrl-names = "default", "pmic-sleep", "pmic-power-off", "pmic-reset";
                pinctrl-0 = <&soc_slppin_gpio>, <&rk806_dvs1_null>, <&rk806_dvs2_null>, <&rk806_dvs3_null>;
                pinctrl-1 = <&soc_slppin_gpio>, <&rk806_dvs1_slp>, <&rk806_dvs2_null>, <&rk806_dvs3_null>;
                pinctrl-2 = <&rk806_dvs1_pwrdn>, <&rk806_dvs2_null>, <&rk806_dvs3_null>;
                pinctrl-3 = <&rk806_dvs1_rst>, <&rk806_dvs2_null>, <&rk806_dvs3_null>;

                /* 2800mv-3500mv */
                low_voltage_threshold = <3000>;
                /* 2700mv-3400mv */
                shutdown_voltage_threshold = <2700>;
                /* 140 160 */
                shutdown_temperture_threshold = <160>;
                hotdie_temperture_threshold = <115>;

                /* 0: restart PMU;
                 * 1: reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode;
                 * 2: Reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode,
                 *    and simultaneously pull down the RESETB PIN for 5mS before releasing
                 */
                pmic-reset-func = <1>;

                vcc1-supply = <&vcc5v0_sys>;
                vcc2-supply = <&vcc5v0_sys>;
                vcc3-supply = <&vcc5v0_sys>;
                vcc4-supply = <&vcc5v0_sys>;
                vcc5-supply = <&vcc5v0_sys>;
                vcc6-supply = <&vcc5v0_sys>;
                vcc7-supply = <&vcc5v0_sys>;
                vcc8-supply = <&vcc5v0_sys>;
                vcc9-supply = <&vcc5v0_sys>;
                vcc10-supply = <&vcc5v0_sys>;
                vcc11-supply = <&vcc_2v0_pldo_s3>;
                vcc12-supply = <&vcc5v0_sys>;
                vcc13-supply = <&vcc_1v1_nldo_s3>;
                vcc14-supply = <&vcc_1v1_nldo_s3>;
                vcca-supply = <&vcc5v0_sys>;2>;

                regulators {
                        vdd_gpu_s0: vdd_gpu_mem_s0: DCDC_REG1 {
                                regulator-always-on;
                                regulator-boot-on;
                                regulator-min-microvolt = <550000>;
                                regulator-max-microvolt = <950000>;
                                regulator-ramp-delay = <12500>;
                                regulator-name = "vdd_gpu_s0";
                                regulator-state-mem {
                                        regulator-off-in-suspend;
                                };
                        };

                        vdd_cpu_lit_s0: vdd_cpu_lit_mem_s0: DCDC_REG2 {
                                regulator-always-on;
                                regulator-boot-on;
                                regulator-min-microvolt = <550000>;
                                regulator-max-microvolt = <950000>;
                                regulator-ramp-delay = <12500>;
                                regulator-name = "vdd_cpu_lit_s0";
                                regulator-state-mem {
                                        regulator-off-in-suspend;
                                };
                        };

                        vdd_log_s0: DCDC_REG3 {
                            .................
                        };

                        vdd_vdenc_s0: vdd_vdenc_mem_s0: DCDC_REG4 {
                            .................
                       };
                       .............................
               };
        };
};
```

<!-- cn PDF p.11 -->

DTS für zwei RK806:

<!-- cn PDF p.11 -->

```text
&pinctrl {
    pmic {
            soc_slppin_gpio: soc_slppin_gpio {
                    rockchip,pins = <0 RK_PA2
                            RK_FUNC_GPIO &pcfg_output_low>;
            };
            soc_slppin_shutdown: soc_slppin_shutdown {
                    rockchip,pins = <0 RK_PA2
                            RK_FUNC_GPIO &pcfg_output_high>;
            };
    };
};

&spi2 {
        status = "okay";
        assigned-clocks = <&cru CLK_SPI2>;
        assigned-clock-rates = <200000000>;
        num-cs = <2>;
        rk806master@0 {
                compatible = "rockchip,rk806";
                spi-max-frequency = <1000000>;
                reg = <0x0>;

                interrupt-parent = <&gpio0>;
                interrupts = <7 IRQ_TYPE_LEVEL_LOW>;
                /* 0: restart PMU;
                 * 1: reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode;
                 * 2: Reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode,
                 *    and simultaneously pull down the RESETB PIN for 5mS before releasing
                 */
                pmic-reset-func = <1>;

                vcc1-supply = <&vcc5v0_sys>;
                vcc2-supply = <&vcc5v0_sys>;
                .................
                vcca-supply = <&vcc5v0_sys>;
                regulators {
                        vdd_gpu_s0: DCDC_REG1 {
                                regulator-always-on;
                                regulator-boot-on;
                                regulator-min-microvolt = <550000>;
                                regulator-max-microvolt = <950000>;
                                regulator-ramp-delay = <12500>;
                                regulator-name = "vdd_gpu_s0";
                                regulator-state-mem {
                                        regulator-off-in-suspend;
                                };
                      };
                        vdd_npu_s0: DCDC_REG2 {
                        .................
                        }；
                        .................
              };
       };
       rk806slave@1 {
                compatible = "rockchip,rk806";
                spi-max-frequency = <1000000>;
                reg = <0x01>;

                interrupt-parent = <&gpio0>;
                interrupts = <7 IRQ_TYPE_LEVEL_LOW>;
                /* 0: restart PMU;
                 * 1: reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode;
                 * 2: Reset all the power off reset registers,
                 *    forcing the state to switch to ACTIVE mode,
                 *    and simultaneously pull down the RESETB PIN for 5mS before releasing
               */
                pmic-reset-func = <1>;

                vcc1-supply = <&vcc5v0_sys>;
                vcc2-supply = <&vcc5v0_sys>;
                .................
                vcca-supply = <&vcc5v0_sys>;

                pwrkey {
                        status = "disabled";
                };
                regulators {
                        vdd_cpu_big1_s0: DCDC_REG1 {
                                regulator-always-on;
                                regulator-boot-on;
                                regulator-min-microvolt = <550000>;
                                regulator-max-microvolt = <950000>;
                                regulator-ramp-delay = <12500>;
                                regulator-name = "vdd_cpu_big1_s0";
                                regulator-state-mem {
                                        regulator-off-in-suspend;
                                };
                        };
                        vdd_cpu_big0_s0: DCDC_REG2 {
                        .................
                        };
                        .................
                };
       };
};
```

<!-- cn PDF p.13 -->

1. Vollständigen rk806-Knoten unter SPI einfügen und status = "okay" setzen.

<!-- cn PDF p.13 -->

2. Hauptknoten: Folgendes nicht verändern.

<!-- cn PDF p.13 -->

```text
compatible = "rockchip,rk806";
spi-max-frequency = <1000000>;
reg = <0x0>;

interrupt-parent = <&gpio0>;
interrupts = <7 IRQ_TYPE_LEVEL_LOW>;
```

<!-- cn PDF p.13 -->

Änderbar gemäß pinctrl: interrupt-parent wählt den GPIO-Controller von pmic_int; interrupts dessen Pinindex und Polarität.

<!-- cn PDF p.13 -->

3. pwrkey/gpio: Bei Nichtverwendung DTS-Knoten mit status = "disabled" ergänzen. Treiber bleiben deaktiviert; Boot-Fehlermeldungen können ignoriert werden.

<!-- cn PDF p.14 -->

```text
pwrkey {
        status = "disabled";
};
```

<!-- cn PDF p.14 -->

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

<!-- cn PDF p.14 -->

Kernel 5.10: siehe obige Kernel-5.10-DTS-Konfiguration.

<!-- cn PDF p.14 -->

### 2.4 Funktionsschnittstellen

<!-- cn PDF p.14 -->

Die folgenden Schnittstellen decken den üblichen Bedarf ab: regulator ein-/ausschalten sowie Spannung setzen und auslesen.

<!-- cn PDF p.14 -->

1. Regulator beziehen: `struct regulator *devm_regulator_get_optional(struct device *dev, const char *id)`. dev ist das aktuelle Gerät; id entspricht der DTS-Eigenschaft -supply.

<!-- cn PDF p.14 -->

2. Regulator freigeben: `void regulator_put(struct regulator *regulator)`

<!-- cn PDF p.14 -->

3. Regulator einschalten: `int regulator_enable(struct regulator *regulator)`

<!-- cn PDF p.14 -->

4. Regulator ausschalten: `int regulator_disable(struct regulator *regulator)`

<!-- cn PDF p.14 -->

5. Regulator-Spannung lesen

<!-- cn PDF p.15 -->

`int regulator_get_voltage(struct regulator *regulator)`

<!-- cn PDF p.15 -->

6. Spannung setzen: `int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)`. Der Aufrufer muss min_uV <= max_uV sicherstellen.

<!-- cn PDF p.15 -->

7. Beispiel

<!-- cn PDF p.15 -->

```text
struct regulator *vdd_ana;

vdd_ana = devm_regulator_get_optional(dev, "power");
/* 从dts获取power-supply
   power-supply = <&vcc3v3_lcd0_n> */
regulator_enable(vdd_ana);
regulator_disable(vdd_ana);                         // 关闭vdd_ana
regulator_put(vdd_ana);                             // 释放vdd_ana
```

<!-- cn PDF p.15 -->

## 3. Debugging

<!-- cn PDF p.15 -->

### 3.1 Kernel

<!-- cn PDF p.15 -->

Die PMIC-Treiberlogik ist einfach; entscheidend sind endgültige Registereinstellungen. Debug-Einstieg: /sys/kernel/debug/regulator.

<!-- cn PDF p.15 -->

![Originalabbildung aus chinesischem PDF — p.15](/docs/rockchip-rk806-pmic/assets/cn-p015-figure-01.png)

Transkription lesbarer Bildinhalte (Quellbeispiel; unlesbare abgeschnittene Randfragmente werden nicht geraten):

```text
console:/ # ls /sys/kernel/debug/regulator/
avcc_1v8_codec_s0         vcc5v0_sys             vdd_0v75_s3
avcc_1v8_s0               vcc5v0_usb             vdd_0v85_s0
avdd1v8_ddr_pll_s0        vcc5v0_usbdcin         vdd_1v8_pll_s0
avdd_0v75_s0              vcc_1v1_nldo_s3        vdd_2v0_pldo_s3
avdd_0v85_s0              vcc_1v8_cam_s0         vdd_cpu_big0_mem_s0
avdd_1v2_cam_s0           vcc_1v8_s0             vdd_cpu_big0_s0
avdd_1v2_s0               vcc_2v8_cam_s0         vdd_cpu_big1_mem_s0
pcie20_avdd0v85           vcc_3v3_s0             vdd_cpu_big1_s0
pcie20_avdd1v8            vcc_3v3_s3             vdd_cpu_lit_mem_s0
pcie30_avdd0v75           vcc_3v3_sd_s0          vdd_cpu_lit_s0
pcie30_avdd1v8            vcc_mipicsi0           vdd_ddr_pll_s0
pldo6_s3                  vcc_mipicsi1           vdd_ddr_s0
reg-dummy-regulator-dummy vcc_mipidcphy0         vdd_gpu_mem_s0
regulator_summary        vccio_1v8_s3           vdd_gpu_s0
supply_map               vccio_sd_s0            vdd_log_s0
vbus5v0_typec             vdd1_1v8_ddr_s3        vdd_npu_mem_s0
vcc12v_dcin               vdd2_ddr_s3            vdd_npu_s0
vcc3v3_lcd0_n             vdd21_0v9_ddr_s3       vdd_vdenc_mem_s0
vcc3v3_pcie30             vdd_0v75_hdmi_edp_s0   vdd_vdenc_s0
vcc5v0_host               vdd_0v75_pll_s0        vddq_ddr_s0
```

*Originalabbildung aus chinesischem PDF — p.15*

<!-- cn PDF p.15 -->

/sys/kernel/debug/regulator/regulator_summary

<!-- cn PDF p.16 -->

![Originalabbildung aus chinesischem PDF — p.16](/docs/rockchip-rk806-pmic/assets/cn-p016-figure-01.png)

Transkription lesbarer Bildinhalte (Quellbeispiel; unlesbare abgeschnittene Randfragmente werden nicht geraten):

```text
 regulator                    use open bypass opmode  voltage current min max
 regulator-dummy                5 5 0 unknown 0mV 0mA 0mV 0mV
    fe210000.sata-target         1                 0mA 0mV 0mV
    fe210000.sata-phy            1                 0mA 0mV 0mV
    fe210000.sata-ahci           1                 0mA 0mV 0mV
    backlight-power             1                 0mA 0mV 0mV
    regulator-dummy             0                 0mA 0mV 0mV
 vcc12v_dcin                    3 4 0 unknown 12000mV 0mA 12000mV 12000mV
    vcc12v_dcin                  0                 0mA 0mV 0mV
    vcc5v0_sys                  30 30 0 unknown 5000mV 0mA 5000mV 5000mV
       vcc5v0_sys                0                 0mA 0mV 0mV
       vdd_gpu_s0                1 3 0 normal 750mV 0mA 550mV 950mV
          fb000000.gpu-mali      0                 0mA 750mV 950mV
          fb000000.gpu-mali      0                 0mA 0mV 0mV
          vdd_gpu_s0             0                 0mA 0mV 0mV
       vdd_npu_s0                1 1 0 normal 750mV 0mA 550mV 950mV
          vdd_npu_s0             0                 0mA 0mV 0mV
       vdd_log_s0                1 1 0 normal 750mV 0mA 750mV 750mV
          vdd_log_s0             0                 0mA 0mV 0mV
       vdd_vdenc_s0              1 1 0 normal 750mV 0mA 550mV 950mV
          vdd_vdenc_s0           0                 0mA 0mV 0mV
       vdd_gpu_mem_s0            1 3 0 normal 750mV 0mA 675mV 950mV
          fb000000.gpu-mem       0                 0mA 750mV 950mV
          fb000000.gpu-mem       0                 0mA 0mV 0mV
          vdd_gpu_mem_s0         0                 0mA 0mV 0mV
       vdd_npu_mem_s0            1 1 0 normal 750mV 0mA 675mV 950mV
          vdd_npu_mem_s0         0                 0mA 0mV 0mV
       vdd_2v0_pldo_s3           9 9 0 normal 2000mV 0mA 2000mV 2000mV
          vdd_2v0_pldo_s3        0                 0mA 0mV 0mV
          avcc_1v8_s0            1 3 0 unknown 1800mV 0mA 1800mV 1800mV
             avcc_1v8_s0         0                 0mA 0mV 0mV
             pcie20_avdd1v8      0 1 0 unknown 1800mV 0mA 1800mV 1800mV
                pcie20_avdd1v8   0                 0mA 0mV 0mV
             pcie30_avdd1v8      0 1 0 unknown 1800mV 0mA 1800mV 1800mV
                pcie30_avdd1v8   0                 0mA 0mV 0mV
          vdd1_1v8_ddr_s3        1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             vdd1_1v8_ddr_s3     0                 0mA 0mV 0mV
          avcc_1v8_codec_s0      1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             avcc_1v8_codec_s0   0                 0mA 0mV 0mV
          avdd_1v2_cam_s0        1 1 0 unknown 1200mV 0mA 1200mV 1200mV
             avdd_1v2_cam_s0     0                 0mA 0mV 0mV
          avdd_1v2_s0            1 1 0 unknown 1200mV 0mA 1200mV 1200mV
             avdd_1v2_s0         0                 0mA 0mV 0mV
          vcc_1v8_cam_s0         1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             vcc_1v8_cam_s0      0                 0mA 0mV 0mV
          avdd1v8_ddr_pll_s0     1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             avdd1v8_ddr_pll_s0  0                 0mA 0mV 0mV
          vdd_1v8_pll_s0         1 1 0 unknown 1800mV 0mA 1800mV 1800mV
             vdd_1v8_pll_s0      0                 0mA 0mV 0mV
       vdd_vdenc_mem_s0          1 1 0 normal 750mV 0mA 675mV 950mV
          vdd_vdenc_mem_s0       0                 0mA 0mV 0mV
       vdd2_ddr_s3               1 1 0 normal 1100mV 0mA 0mV 0mV
          vdd2_ddr_s3            0                 0mA 0mV 0mV
       vcc_1v1_nldo_s3           6 6 0 normal 1100mV 0mA 1100mV 1100mV
          vcc_1v1_nldo_s3        0                 0mA 0mV 0mV
       avdd_0v75_s0              1 2 0 unknown 750mV 0mA 750mV 750mV
```

*Originalabbildung aus chinesischem PDF — p.16*

<!-- cn PDF p.16 -->

Eigenschaften und Spannungswerte jeder Versorgung sind über folgenden Knoten zu finden:

<!-- cn PDF p.16 -->

![Originalabbildung aus chinesischem PDF — p.16](/docs/rockchip-rk806-pmic/assets/cn-p016-figure-02.png)

Transkription lesbarer Bildinhalte (Quellbeispiel; unlesbare abgeschnittene Randfragmente werden nicht geraten):

```text
console:/sys/kernel/debug/regulator/vdd_gpu_mem_s0 # ls
bypass_count  fb000000.gpu-mem  mode        vdd_gpu_mem_s0
consumers     force_disable   open_count  voltage
enable        load            use_count
```

*Originalabbildung aus chinesischem PDF — p.16*

<!-- cn PDF p.16 -->

### 3.2 Kernel 5.10

<!-- cn PDF p.16 -->

Siehe Kernel-5.10-Befehle.

Redaktionshinweis: BUCK-Bereich 0.7125–1.45, aufgelistete Werte 0.5–1.5; NLDO-Bereich ab 0.5, erster Wert 0.5125. Drei PWRCTRL-Pins werden beschrieben, zugleich steht „zwei“. Die Pintabelle nutzt PWRCRTL und kennzeichnet SPI CLK mit O. Unverändert beibehalten; vor Anpassung prüfen.

Hinweis zum Quell-DTS: Seite 9 endet tatsächlich mit `num-cs = <&spi2 {`, gefolgt von wiederholten SPI-Eigenschaften; Seite 12 enthält zudem ein vollbreites Semikolon. Dies ist kein unmittelbar kompilierbares vollständiges DTS. Quellprobleme bleiben unverändert; mit dem passenden BSP-Quellcode abgleichen. Die Originalüberschrift 3.1 lautet nur „Kernel“, ohne Versionsangabe.

{% endraw %}
