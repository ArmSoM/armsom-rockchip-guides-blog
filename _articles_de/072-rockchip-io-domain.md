---
title: "Rockchip IO-Domain: Versorgungszuordnung, Spannungsregister und DTS-Debugging"
description: "Vollständiger IO-Domain-Leitfaden mit Versorgungszuordnung, GRF/PMUGRF, Festspannungsreglern und Spannungsprüfungen am RK3399."
translation_key: "072-rockchip-io-domain"
slug: "072-rockchip-io-domain"
lang: "de"
date: "2026-10-18"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "power"
products: []
tags: ["ArmSoM", "Rockchip", "IO-Domain"]
keywords: "ArmSoM Rockchip rockchip io domain"
excerpt: "Vollständiger IO-Domain-Leitfaden mit Versorgungszuordnung, GRF/PMUGRF, Festspannungsreglern und Spannungsprüfungen am RK3399."
---

{% raw %}

# Rockchip IO-Domain: Versorgungszuordnung, Spannungsregister und DTS-Debugging

## Anwendbarkeit auf ArmSoM und Geltungsbereich der Quelle

Plattformreferenz zur Anpassung von ArmSoM-Systemen auf Grundlage der chinesischen Version V1.0.1; kein englisches PDF vorhanden. Keine Kombination aus Board, SDK/BSP, Kernel und Verdrahtung wurde hier an Hardware geprüft. Der nachstehende Geltungsbereich der Quelle bedeutet nicht, dass jedes ArmSoM-Board oder jeder Kernel diese Funktionen unterstützt. Prüfen Sie den genauen SoC, den Board-Schaltplan, das SDK/BSP, den Kernel-Treiber und das Pinmux. Befehle, Patches, Protokolle und Messwerte sind Beispiele aus der Quelle und keine ArmSoM-Testergebnisse.

Ein englisches PDF wurde nicht bereitgestellt. Die englische und russische Fassung übersetzen die chinesische Quelle vollständig; diese deutsche Fassung folgt dem geprüften englischen Artikel. Verwendet werden die chinesischen Originalabbildungen mit lokalisierten Bildunterschriften.

| SoC der Quelle | Kernel-Geltungsbereich der Quelle |
| --- | --- |
| RK3188 | 4.4 |
| RK3288 | 4.4 |
| RK3036 | 4.4 |
| RK312x | 4.4 |
| RK322x | 4.4 |
| RK3368 | 3.10 |
| RK3368 | 4.4 |
| RK3366 | 4.4 |
| RK3399 | 4.4 |
| RV1108 | 3.10 |
| RV1108 | 4.4 |
| RK3228H | 3.10 |
| RK3328 | 4.4 |
| RK3326/PX30 | 4.4 |
| RK3308 | 4.4 |

IO-Versorgungen können 1.8v, 3.3v, 2.5v oder 5.0v verwenden; manche IOs unterstützen mehrere Pegel. IO-Domain konfiguriert die Register der Spannungsdomänen entsprechend dem tatsächlichen Spannungsbereich der Hardware. Falsche Einstellungen verhindern den ordnungsgemäßen Betrieb. Die Quelltabelle nennt Chips, die eine Konfiguration benötigen; sie garantiert keine Spannungstoleranz eines bestimmten Pins.

[Redaktionelle Hinweise](/docs/rockchip-io-domain/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, unit 0 -->

## 1. Treiberdatei und DTS-Knoten

<!-- Source CN PDF p.4, unit 1 -->

### 1.1 Treiberdatei

<!-- Source CN PDF p.4, unit 2 -->

Treiberpfad: `drivers/power/avs/rockchip-io-domain.c`.

<!-- Source CN PDF p.4, unit 3 -->

### 1.2 DTS-Knoten

<!-- Source CN PDF p.4, unit 4 -->

Im Kernel 3.10 sind die DTS-Knoten zusammengefasst:

<!-- Source CN PDF p.4, unit 5 -->

```text
io-domains {
    compatible = "rockchip,rk3368-io-voltage-domain";
    rockchip,grf = <&grf>;
    rockchip,pmugrf = <&pmugrf>;
    /*GRF_IO_VSEL*/
    dvp-supply = <&ldo7_reg>; /* DVPIO_VDD */
    wifi-supply = <&ldo7_reg>; /* APIO2_VDD */
    audio-supply = <&dcdc2_reg>; /* APIO3_VDD */
    sdcard-supply = <&ldo1_reg>; /* SDMMC0_VDD */
    gpio30-supply = <&dcdc2_reg>; /* APIO1_VDD */
    gpio1830-supply = <&dcdc2_reg>;/* ADIO4_VDD */
    /*PMU_GRF_IO_VSEL*/
    pmu-supply = <&ldo5_reg>; /* PMUIO_VDD */
    vop-supply = <&ldo5_reg>; /* LCDC_VDD */
};
```

<!-- Source CN PDF p.4, unit 6 -->

Im Kernel 4.4 sind die DTS-Knoten für GRF und PMUGRF getrennt:

<!-- Source CN PDF p.4, unit 7 -->

```text
&io_domains {
    status = "okay";
    dvp-supply = <&vcc_18>;
    audio-supply = <&vcc_io>;
    gpio30-supply = <&vcc_io>;
    gpio1830-supply = <&vcc_io>;
    sdcard-supply = <&vccio_sd>;
    wifi-supply = <&vccio_wl>;
};
&pmu_io_domains {
    status = "okay";
    pmu-supply = <&vcc_io>;
    vop-supply = <&vcc_io>;
};
```

<!-- Source CN PDF p.5, unit 8 -->

## 2. Beschreibungen im TRM

<!-- Source CN PDF p.5, unit 9 -->

Wenn die io-domain-Register im TRM schwer zu finden sind, suchen Sie in den GRF-/PMUGRF-Kapiteln nach `vsel`, `VSEL` oder `volsel`. Die io-domain-Register in PMUGRF steuern die PMU-IOs.

<!-- Source CN PDF p.5, unit 10 -->

Beschrieben werden zwei konfigurierbare Spannungsbereiche: 1.8v und 3.3v.

<!-- Source CN PDF p.5, unit 11 -->

Ein Registerwert von 1 entspricht üblicherweise 1.62v–1.98v bei einer typischen Spannung von 1.8v.

<!-- Source CN PDF p.5, unit 12 -->

Ein Registerwert von 0 entspricht üblicherweise 3.00v–3.60v bei einer typischen Spannung von 3.3v.

<!-- Source CN PDF p.5, unit 13 -->

Die genauen Spannungsgrenzen entnehmen Sie dem Datenblatt des tatsächlich eingesetzten Chips.

<!-- Source CN PDF p.5, unit 14 -->

## 3. Softwareablauf des Treibers

<!-- Source CN PDF p.5, unit 15 -->

Der Ablauf des Treibers `rockchip-io-domain.c` umfasst zwei Hauptteile:

<!-- Source CN PDF p.5, unit 16 -->

### 3.1 Initialisierung

<!-- Source CN PDF p.5, unit 17 -->

In probe ermittelt der Treiber anhand des Versorgungsnamens den unter diesem Namen in DTS definierten Regler. Anschließend konfiguriert er das io-domain-Register entsprechend der Reglerspannung: Das Bit wird für den 1.8v-Bereich auf 1 und für den 3.3v-Bereich auf 0 gesetzt.

<!-- Source CN PDF p.6, unit 18 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.6, cn-p06-initialization-flow.png](/docs/rockchip-io-domain/assets/cn-p06-initialization-flow.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.6, cn-p06-initialization-flow.png.*

Ablauf: Start → Supply_Name zuordnen → Regler ermittelt? Wenn nein, verwerfen; wenn ja, io-domain konfigurieren. Fortsetzen? Wenn ja, die nächste Versorgung verarbeiten; wenn nein, beenden.

<!-- Source CN PDF p.6, unit 25 -->

### 3.2 Dynamische Konfiguration

<!-- Source CN PDF p.6, unit 26 -->

Während der Initialisierung bindet sich der Treiber an den Regler und registriert einen Notifier. Ändert sich die Spannung dieses Reglers, veranlasst der Notifier den io-domain-Treiber zur Aktualisierung des betreffenden Registers. Dadurch wird eine dynamische Konfiguration der Spannungsdomäne ermöglicht.

<!-- Source CN PDF p.6, unit 27 -->

## 4. Konfigurieren von io-domain

<!-- Source CN PDF p.6, unit 28 -->

Nicht jede IO-Versorgungsdomäne benötigt eine Konfiguration: Manche haben feste Spannungen. Die folgenden drei Schritte beschreiben die Softwarekonfiguration von io-domain.

<!-- Source CN PDF p.7, unit 29 -->

### 4.1 Versorgungsnamen in rockchip-io-domain.txt ermitteln

<!-- Source CN PDF p.7, unit 30 -->

Die IO-Versorgungsdomänen, die eine DTS-Konfiguration benötigen, sind in `Documentation/devicetree/bindings/power/rockchip-io-domain.txt` im Linux-Kernel-Quellbaum beschrieben. Eine Domäne kann im TRM und im Hardware-Schaltplan unterschiedlich heißen; dieses Binding-Dokument ordnet die Namen einander zu.

<!-- Source CN PDF p.7, unit 31 -->

Für RK3399 nennt der Quelltext bt565, audio, sdmmc, gpio1830 und pmu1830 in PMUGRF. Der folgende Binding-Auszug verwendet `bt656-supply`, nicht bt565; diese Abweichung der Quelle bleibt erhalten. Die Formulierung „The supply connected to ***_VDD“ bezeichnet die entsprechende Versorgungsschiene im Schaltplan.

<!-- Source CN PDF p.7, unit 32 -->

Mögliche Versorgungen für rk3399:

<!-- Source CN PDF p.7, unit 33 -->

`bt656-supply`: die mit APIO2_VDD verbundene Versorgung.

<!-- Source CN PDF p.7, unit 34 -->

`audio-supply`: die mit APIO5_VDD verbundene Versorgung.

<!-- Source CN PDF p.7, unit 35 -->

`sdmmc-supply`: die mit SDMMC0_VDD verbundene Versorgung.

<!-- Source CN PDF p.7, unit 36 -->

`gpio1830-supply`: die mit APIO4_VDD verbundene Versorgung.

<!-- Source CN PDF p.7, unit 37 -->

Mögliche Versorgungen für rk3399 pmu-domains:

<!-- Source CN PDF p.7, unit 38 -->

`pmu1830-supply`: die mit PMUIO2_VDD verbundene Versorgung.

<!-- Source CN PDF p.7, unit 39 -->

### 4.2 Tatsächliche Domänenspannung im Schaltplan ermitteln

<!-- Source CN PDF p.7, unit 40 -->

Am Beispiel des RK3399-EVB-Schaltplans und der Domäne bt656 ordnet das Binding bt656 der Versorgung APIO2_VDD zu. Verfolgt man APIO2_VDD im Schaltplan, erkennt man die Versorgung durch VCC1V8_DVP vom RK808.

<!-- Source CN PDF p.7, unit 41 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.7, cn-p07-figure1.png](/docs/rockchip-io-domain/assets/cn-p07-figure1.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.7, cn-p07-figure1.png.*

<!-- Source CN PDF p.8, unit 42 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.8, cn-p08-figure1.png](/docs/rockchip-io-domain/assets/cn-p08-figure1.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.8, cn-p08-figure1.png.*

<!-- Source CN PDF p.8, unit 43 -->

### 4.3 DTS konfigurieren

<!-- Source CN PDF p.8, unit 44 -->

Nachdem Versorgungsname und physische Quelle feststehen, suchen Sie den Regler `vcc1v8_dvp` in DTS und ergänzen Sie `bt656-supply = <&vcc1v8_dvp>;` in `rk3399-evb.dtsi`. Konfigurieren Sie weitere Domänen auf dieselbe Weise.

<!-- Source CN PDF p.8, unit 45 -->

## 5. Durch Hardware-Pins gesteuerte Domänen bleiben normalerweise unkonfiguriert

<!-- Source CN PDF p.8, unit 46 -->

Einige Rockchip-IO-Domänen werden bereits durch einen Hardware-Pin gesteuert. Die Kernel-DTS konfiguriert sie normalerweise nicht, sodass der vorhandene Hardwarezustand erhalten bleibt. Flash- und eMMC-IO-Domänen werden häufig so gesteuert.

<!-- Source CN PDF p.8, unit 47 -->

Die Registerbeschreibungen im TRM nennen die durch Pins gesteuerten Domänen und erläutern, wie die Eingangsspannung des Pins deren Konfiguration bestimmt. Alternativ ist eine Konfiguration über GRF möglich; es gibt also zwei Steuerungsverfahren.

<!-- Source CN PDF p.8, unit 48 -->

Beispielsweise enthalten das RK3368-TRM und der RK3368-EVB-Schaltplan die folgenden Register- und Hardware-Pin-Definitionen.

<!-- Source CN PDF p.8, unit 49 -->

Registerbeschreibungen im TRM:

<!-- Source CN PDF p.8, unit 50 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.8, cn-p08-figure2.png](/docs/rockchip-io-domain/assets/cn-p08-figure2.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.8, cn-p08-figure2.png.*

Bearbeitbare Übertragung der sichtbaren Originalabbildung; die Überschriften wurden redaktionell ergänzt, die Registerwerte sind unverändert.

| Bit | Zugriff | Reset | Feld / Bedeutung |
| --- | --- | --- | --- |
| 14 | RW | 0x0 | flash_poc_control<br>Auswahl der POC-Steuerung der Flash-IO-Domäne<br>0: Steuerung durch Pad gpio_0b5<br>1: Steuerung durch Bit 2 von IO_VSEL |

<!-- Source CN PDF p.8, unit 51 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.8, cn-p08-figure3.png](/docs/rockchip-io-domain/assets/cn-p08-figure3.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.8, cn-p08-figure3.png.*

Bearbeitbare Übertragung der sichtbaren Originalabbildung; die Überschriften wurden redaktionell ergänzt, die Registerwerte sind unverändert.

| Bit | Zugriff | Reset | Feld / Bedeutung |
| --- | --- | --- | --- |
| 2 | RW | 0x1 | flash0_v18sel<br>Auswahl der 1.8V-Spannung für die FLASH0-IO-Domäne<br>1'b0: 3.3V/2.5V<br>1'b1: 1.8V |

<!-- Source CN PDF p.8, unit 52 -->

Hardware-Schaltplan:

<!-- Source CN PDF p.9, unit 53 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.9, cn-p09-figure1.png](/docs/rockchip-io-domain/assets/cn-p09-figure1.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.9, cn-p09-figure1.png.*

<!-- Source CN PDF p.9, unit 54 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.9, cn-p09-figure2.png](/docs/rockchip-io-domain/assets/cn-p09-figure2.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.9, cn-p09-figure2.png.*

Bearbeitbare Übertragung der sichtbaren Originalabbildung; die Überschriften wurden redaktionell ergänzt, die Registerwerte sind unverändert.

| FLASH_VOL_SEL | FLASH_IO-Spannung |
| --- | --- |
| 1.8V oder 2.5V oder 3.3V | 1.8V-Treiber-IO |
| 0V | 3.3V-Treiber-IO |

Im Schaltplan stehen außerdem die Angaben `FLASH_VOLTAGE_SEL=0 FLASH_IO=3.3V` und `FLASH_VOLTAGE_SEL=1 FLASH_IO=1.8V`. Dies sind Schaltungsanmerkungen aus der Quelle, keine allgemeingültigen Pin-Toleranzen.

<!-- Source CN PDF p.9, unit 55 -->

## 6. Umgang mit einem in DTS fehlenden Regler

<!-- Source CN PDF p.9, unit 56 -->

Wenn der betreffende Regler nicht gefunden wird, verwendet das Design möglicherweise keinen PMIC, sondern eine einfache feste Versorgung. Ergänzen Sie fixed-regulator-Definitionen in DTS. Üblicherweise reichen zwei Regler für 3.3v und 1.8v aus.

<!-- Source CN PDF p.9, unit 57 -->

Das folgende Beispiel stammt aus `rk3229-evb.dts`. Ermitteln Sie, ob die tatsächliche Hardware 1.8v oder 3.3v verwendet, und wählen Sie anschließend den passenden Regler:

<!-- Source CN PDF p.9, unit 58 -->

```text
    regulators {
       compatible = "simple-bus";
       #address-cells = <1>;
       #size-cells = <0>;
       vccio_1v8_reg: regulator@0 {
           compatible = "regulator-fixed";
           regulator-name = "vccio_1v8";
           regulator-min-microvolt = <1800000>;
           regulator-max-microvolt = <1800000>;
           regulator-always-on;
       };
       vccio_3v3_reg: regulator@1 {
           compatible = "regulator-fixed";
           regulator-name = "vccio_3v3";
           regulator-min-microvolt = <3300000>;
           regulator-max-microvolt = <3300000>;
           regulator-always-on;
       };
    };
&io_domains {
    status = "okay";
    vccio1-supply = <&vccio_3v3_reg>;
    vccio2-supply = <&vccio_1v8_reg>;
    vccio4-supply = <&vccio_3v3_reg>;
};
```

<!-- Source CN PDF p.10, unit 60 -->

## 7. Häufig gestellte Fragen

<!-- Source CN PDF p.10, unit 61 -->

### 7.1 Domänenregister eines Pins auf Korrektheit prüfen

<!-- Source CN PDF p.10, unit 62 -->

Eine unerwartete Pin-Spannung kann auf eine fehlerhafte Konfiguration der Versorgungsdomäne hinweisen. Beispielsweise setzt die Software beim RK3399 GPIO2_B1 auf High, doch die gemessene Spannung ist falsch. Bestätigen Registerabfragen den GPIO-Mux-Modus und eine High-Ausgabe, könnte io-domain falsch konfiguriert sein. Prüfen Sie das Domänenregister, indem Sie die zuvor beschriebenen Konfigurationsschritte rückwärts nachvollziehen.

<!-- Source CN PDF p.10, unit 63 -->

Bestimmen Sie zunächst die Domäne anhand des Schaltplans oder Datenblatts. In diesem RK3399-Beispiel gehört GPIO2_B1 zu APIO2_VDD, das mit VCC1V8_DVP verbunden ist.

<!-- Source CN PDF p.10, unit 64 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.10, cn-p10-figure1.png](/docs/rockchip-io-domain/assets/cn-p10-figure1.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.10, cn-p10-figure1.png.*

<!-- Source CN PDF p.11, unit 65 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.11, cn-p11-figure1.png](/docs/rockchip-io-domain/assets/cn-p11-figure1.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.11, cn-p11-figure1.png.*

<!-- Source CN PDF p.11, unit 66 -->

Ermitteln Sie den entsprechenden Softwarenamen in `rockchip-io-domain.txt`; hier lautet der Domänenname `bt656`.

<!-- Source CN PDF p.11, unit 67 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.11, cn-p11-figure2.png](/docs/rockchip-io-domain/assets/cn-p11-figure2.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.11, cn-p11-figure2.png.*

Kopierbarer Binding-Auszug aus dem Screenshot (die Quelle schreibt `gpio1830` ohne Suffix `-supply` und ohne Doppelpunkt; diese Schreibweise darf nicht stillschweigend vereinheitlicht werden):

```text
Possible supplies for rk3368 pmu-domains:
- pmu-supply:    The supply connected to PMUIO_VDD.
- vop-supply:    The supply connected to LCDC_VDD.

Possible supplies for rk3399:
- bt656-supply:  The supply connected to APIO2_VDD.
- audio-supply:  The supply connected to APIO5_VDD.
- sdmmc-supply:  The supply connected to SDMMC0_VDD.
- gpio1830      The supply connected to APIO4_VDD.

Possible supplies for rk3399 pmu-domains:
- pmu1830-supply:The supply connected to PMUIO2_VDD.
```

Die PMU-Domänen des RK3368 ordnen pmu/vop den Versorgungen PMUIO_VDD/LCDC_VDD zu. Beim RK3399 werden bt656/audio/sdmmc/gpio1830 den Versorgungen APIO2_VDD/APIO5_VDD/SDMMC0_VDD/APIO4_VDD zugeordnet; die PMU-Versorgung entspricht PMUIO2_VDD.

<!-- Source CN PDF p.11, unit 68 -->

Suchen Sie das Register im TRM und lesen Sie es mit `io` oder einem anderen geeigneten Werkzeug; die Basis liegt normalerweise in GRF oder PMUGRF. Hier ist bt656 das bit0 beim Offset `0xe640`, mit der GRF-Basis `0xff770000`. Führen Sie im seriellen Terminal `io -4 0xff77e640` aus. Ist bit0 gleich 1, ist der Bereich 1.8v eingestellt, passend zu VCC1V8_DVP, und der DTS-Eintrag ist korrekt. Ist bit0 gleich 0, wird 3.3v gewählt, was nicht zu VCC1V8_DVP passt; der Eintrag ist somit falsch. Diese Adressen gelten für das RK3399-Beispiel der Quelle, nicht für beliebige Boards.

<!-- Source CN PDF p.11, unit 69 -->

![Technische Abbildung — 072, Quelle: chinesisches PDF, S.11, cn-p11-figure3.png](/docs/rockchip-io-domain/assets/cn-p11-figure3.png)

*Technische Abbildung — 072, Quelle: chinesisches PDF, S.11, cn-p11-figure3.png.*

Bearbeitbare Übertragung der sichtbaren Originalabbildung; die Überschriften wurden redaktionell ergänzt, die Registerwerte sind unverändert.

| Bit | Zugriff | Reset | Feld / Bedeutung |
| --- | --- | --- | --- |
| 3 | RW | 0x0 | gpio1833_gpio4cd_ms |
| 2 | RW | 0x0 | sdmmc_gpio4b_ms |
| 1 | RW | 0x0 | audio_gpio3d4a_ms |
| 0 | RW | 0x0 | bt656_gpio2ab_ms |

Der Screenshot zeigt `gpio1833_gpio4cd_ms`, während der Binding-Screenshot `gpio1830` verwendet. Behalten Sie beide Schreibweisen der Quelle bei und prüfen Sie sie anhand des passenden TRM/BSP.

<!-- Source CN PDF p.12, unit 70 -->

### 7.2 Fehlerhafte io-domain-Register

<!-- Source CN PDF p.12, unit 71 -->

Häufige Ursachen einer falschen Registerkonfiguration sind:

<!-- Source CN PDF p.12, unit 72 -->

Die konfigurierte Reglerspannung ist falsch.

<!-- Source CN PDF p.12, unit 73 -->

Der Regler ist nicht konfiguriert oder nicht aktiviert.

<!-- Source CN PDF p.12, unit 74 -->

Der Regler wird später als der io-domain-Treiber geladen und kann daher nicht ermittelt werden.

{% endraw %}
