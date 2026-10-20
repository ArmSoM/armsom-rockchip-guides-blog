---
title: "Vollständiger Rockchip-Devfreq-Leitfaden: GPU-, DDR- und BUS-DVFS"
description: "Rockchip-Devfreq für GPU, DDR und BUS: Regler, OPP/PVTM, IR-Drop, Tieftemperaturkompensation und szenario-/last-/VOP-bandbreitenabhängige Skalierung mit vollständigen Befehlen und Quellversionsunterschieden."
translation_key: "058-rockchip-devfreq"
slug: "058-rockchip-devfreq"
lang: "de"
date: "2026-10-18"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "power"
products: []
tags: ["Rockchip", "Devfreq", "DVFS", "OPP", "PVTM", "Linux"]
keywords: "ArmSoM Rockchip Devfreq DVFS OPP PVTM Linux"
excerpt: "Rockchip-Devfreq für GPU, DDR und BUS: Regler, OPP/PVTM, IR-Drop, Tieftemperaturkompensation und szenario-/last-/VOP-bandbreitenabhängige Skalierung mit vollständigen Befehlen und Quellversionsunterschieden."
---

{% raw %}

# Vollständiger Rockchip-Devfreq-Leitfaden: GPU-, DDR- und BUS-DVFS

Dies ist eine Rockchip-Devfreq-Plattformreferenz, kein an ArmSoM-Hardware getestetes Tutorial. Die Produktversionstabelle der Quelle nennt alle Chips und Linux 4.4 / 4.19; daraus ergibt sich keine Unterstützung für jedes ArmSoM-Board oder aktuelle BSP. Prüfen Sie vor der Anpassung die SoC-Variante, Stromversorgung und PMIC/Regler des Boards, Taktbaum, OPP-Tabelle, eFuse-/OTP-/PVTM-Unterstützung sowie SDK/BSP/Kernel-Treiber. Übernehmen Sie Frequenzen, Spannungen oder Registereinstellungen nicht ungeprüft. Protokolle, Testergebnisse und Frequenzgrenzen stammen aus der Quelle und sind keine ArmSoM-Messungen. Es wurden keine Frequenz-/Spannungsbefehle ausgeführt. Die chinesische Quelle ist V1.1.1 (26 Seiten), die englische V1.0.0 (30 Seiten). Die Kapitelstruktur entspricht einander, Versionsangaben und einzelne Erläuterungen unterscheiden sich jedoch; jeder vollständige Haupttext bleibt erhalten, ohne die Originale als dieselbe Version auszugeben. Chinesisch verwendet die chinesische Originalabbildung; Englisch, Russisch und diese deutsche Fassung verwenden die englische Originalabbildung. Deutsch übersetzt den vollständigen geprüften englischen technischen Text; Codekommentare bleiben in der Quellsprache erhalten.

| Chip-Geltungsbereich der Quelle | Kernel-Version |
| --- | --- |
| Alle Chips (Quellformulierung; Prüfung je Board erforderlich) | Linux 4.4 / Linux 4.19 |

[Redaktionelle Hinweise](/docs/rockchip-devfreq/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Einführung

Devfreq ist ein von Kernel-Entwicklern definiertes Framework zur dynamischen Anpassung von Frequenz und Spannung nach einem gewählten Governor. Es kann den Stromverbrauch unter Berücksichtigung der Leistung reduzieren. Devfreq ähnelt CPUFreq, doch CPUFreq ist ausschließlich für die CPU zuständig, während Devfreq andere Module mit dynamischem Frequenzbedarf steuert. Das Framework besteht aus Governor, Core, Driver und Event. Die Softwarearchitektur ist nachfolgend dargestellt:

![Architekturdiagramm aus dem englischen Original, PDF-S. 5](/docs/rockchip-devfreq/assets/en-p5-1.png)

Devfreq-Governor: Bestimmt, wann und auf welche Frequenz umgeschaltet wird. Der Kernel enthält folgende Governors:

- simple ondemand: Ändert die Frequenz dynamisch entsprechend der Last.

- userspace: Stellt eine Schnittstelle bereit, über die Userspace-Anwendungen die Frequenz ändern können.

- powersave: Priorisiert geringen Stromverbrauch und setzt die Frequenz immer auf den niedrigsten Wert.

- performance: Priorisiert Leistung und setzt die Frequenz immer auf den höchsten Wert.

- dmc ondemand: Basiert auf simple ondemand und unterstützt Frequenzänderungen nach Szenario und VOP-Bandbreite; speziell für DDR-Frequenzskalierung.

Devfreq-Core: Kapselt und abstrahiert Governors und Treiber und definiert eine klare Schnittstelle.

Devfreq-Treiber: Initialisiert die Frequenztabelle und stellt die Zielfrequenz ein.

Devfreq-Event: Überwacht die Lastinformationen des Geräts.

## 2. Codepfade

Governor-bezogener Code:

```text
drivers/devfreq/governor_simpleondemand.c /* simple ondemand governor */
drivers/devfreq/governor_performance.c /* performance governor */

drivers/devfreq/governor_powersave.c /* powersave governor */
drivers/devfreq/governor_userspace.c /* userspace governor */
drivers/devfreq/rockchip_dmc.c     /* dmc ondemand governor */
```

Event-bezogener Code:

```text
drivers/devfreq/devfreq-event.c
drivers/devfreq/event/rockchip-dfi.c /* monitor DDR read and write cycles */
drivers/devfreq/event/rockchip-nocp.c /* monitor bytes accessed by each module */
```

Core-bezogener Code:

```text
drivers/devfreq/devfreq.c
```

Treiberbezogener Code:

```text
drivers/devfreq/rockchip_dmc.c                  /* DMC driver
*/

drivers/gpu/arm/midgard/backend/gpu/mali_kbase_devfreq.c /* GPU driver
*/
drivers/gpu/arm/bifrost_for_linux/backend/gpu/mali_kbase_devfreq.c /* GPU driver
*/
drivers/gpu/arm/bifrost/backend/gpu/mali_kbase_devfreq.c /* GPU driver
*/
drivers/gpu/arm/mali400/mali/linux/mali_devfreq.c /* GPU driver
*/
drivers/devfreq/rockchip_bus.c                  /* bus driver
*/
drivers/soc/rockchip/rockchip_opp_select.c    /* interface for
opp */
```

## 3. Menuconfig-Konfiguration

```text
Device Drivers --->
   [*] Generic Dynamic Voltage and Frequency Scaling (DVFS) support --->
      --- Generic Dynamic Voltage and Frequency Scaling (DVFS) support

         *** DEVFREQ Governors *** /* devfreq governor */
      -*- Simple Ondemand
<*> Performance
<*> Powersave
   *** DEVFREQ Drivers ***

<*> ARM ROCKCHIP BUS DEVFREQ Driver /* bus devfreq driver */
<*> ARM ROCKCHIP DMC DEVFREQ Driver /* dmc devfreq driver */
[*] DEVFREQ-Event device Support --->
   --- DEVFREQ-Event device Support
   -*- ROCKCHIP DFI DEVFREQ event Driver /* dfi event driver */
   /* nocp event driver */
   <*> ROCKCHIP NoC (Network On Chip) Probe DEVFREQ event Driver
```

Passen Sie die Konfiguration an die tatsächlichen Anforderungen der jeweiligen Plattform an.

## 4. Device-Tree-Konfiguration

### 4.1 GPU-DVFS-Konfiguration

#### 4.1.1 Taktkonfiguration

Ergänzen Sie je nach Plattform die Eigenschaften "clock" und "clock-names" am GPU-Knoten, normalerweise in der DTSI-Datei. Details zur Taktkonfiguration finden Sie in der zugehörigen Rockchip-Taktentwicklungsdokumentation. Beispiel RK3399:

```text
gpu: gpu@ff9a0000 {
   compatible = "arm,malit860",

            "arm,malit86x",
            "arm,malit8xx",
            "arm,mali-midgard";
   ...
   clocks = <&cru ACLK_GPU>;
   clock-names = "clk_mali";
   ...
};
```

#### 4.1.2 Reglerkonfiguration

Ergänzen Sie entsprechend der Stromversorgung der Produkthardware die Eigenschaft “mali-supply” am GPU-Knoten, normalerweise in der boardspezifischen DTS-Datei. Details zur Reglerkonfiguration finden Sie in den Entwicklungsdokumenten zu Reglern und PMICs. Beispiel RK3399:

```text
&i2c0 {
   ...
   vdd_gpu: syr828@41 {

      compatible = "silergy,syr828";
      reg = <0x41>;
      vin-supply = <&vcc5v0_sys>;
      regulator-compatible = "fan53555-reg";
      pinctrl-0 = <&vsel2_gpio>;

      vsel-gpios = <&gpio1 14 GPIO_ACTIVE_HIGH>;
      regulator-name = "vdd_gpu";
      regulator-min-microvolt = <712500>;
      regulator-max-microvolt = <1500000>;
      regulator-ramp-delay = <1000>;
      fcs,suspend-voltage-selector = <1>;
      regulator-always-on;
      regulator-boot-on;
      regulator-initial-state = <3>;
         regulator-state-mem {
         regulator-off-in-suspend;
      };

   };
};

&gpu {
   status = "okay";
   mali-supply = <&vdd_gpu>;
};
```

#### 4.1.3 OPP-Tabellenkonfiguration

Der Kernel legt die Frequenz- und Spannungskonfiguration im Device Tree ab. Die daraus gebildeten Knoten werden als OPP-Tabelle bezeichnet. Ihr Knoten enthält OPP-Knoten mit Frequenzen und Spannungen sowie Eigenschaften zur Leckstrom- und PVTM-Konfiguration.

Detaillierte Hinweise zur OPP-Konfiguration enthalten folgende Dokumente:

```text
Documentation/devicetree/bindings/opp/opp.txt
Documentation/power/opp.txt
```

##### 4.1.3.1 OPP-Tabelle hinzufügen

Ergänzen Sie entsprechend der Plattform einen OPP-Tabellenknoten und die Eigenschaft "operating-points-v2" am GPU-Knoten, normalerweise in der DTSI-Datei. Beispiel RK3399:

```text
&gpu {
   operating-points-v2 = <&gpu_opp_table>;

};

gpu_opp_table: opp-table2 {
   compatible = "operating-points-v2";

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>; /* unit in Hz */
      opp-microvolt = <800000>;    /* unit in uV */
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;

      opp-microvolt = <1100000>;
   };
}
```

##### 4.1.3.2 OPP entfernen

Zum Entfernen bestimmter Frequenzpunkte können folgende Verfahren verwendet werden.

Verfahren 1: Ergänzen Sie "status = "disabeld";" am betreffenden OPP-Knoten, beispielsweise:

Redaktioneller Hinweis: Die Erläuterung der Quelle schreibt disabeld, der Code hingegen disabled. Diese Abweichung bleibt erhalten; prüfen Sie die tatsächliche Konfiguration anhand des Treibers.

```text
gpu_opp_table: opp-table2 {
   compatible = "operating-points-v2";


   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>; /* unit in Hz */
      opp-microvolt = <800000>;    /* unit in uV */
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;
      opp-microvolt = <1100000>;
      status = "disabled";
   };
}
```

Verfahren 2: Referenzieren Sie den OPP-Tabellenknoten erneut in der boardspezifischen DTS und ergänzen Sie "status = "disabeld";" am betreffenden OPP-Knoten, beispielsweise:

Redaktioneller Hinweis: Die Erläuterung der Quelle schreibt disabeld, der Code hingegen disabled. Diese Abweichung bleibt erhalten; prüfen Sie die tatsächliche Konfiguration anhand des Treibers.

```text
&gpu_opp_table {
   opp-800000000 {

      status = "disabled";
   }；
};
```

#### 4.1.4 OPP-Tabelle anhand des Leckstroms anpassen

IDDQ (Integrated Circuit Quiescent Current) wird auch Leckstrom genannt. Der GPU-Leckstrom ist der Ruhestrom der GPU bei einer bestimmten angelegten Spannung. Liegt die GPU in VD logic, entspricht er dem Logik-Leckstrom, also dem Ruhestrom der Logikdomäne bei einer bestimmten Spannung. Bei der Chipfertigung wird der Leckstromwert in eFuse oder OTP gespeichert.

##### 4.1.4.1 Spannung anhand des Leckstroms anpassen

Hintergrund: Laut den Tests der Quelle ist Vmin bei Chips mit geringem Leckstrom höher als bei Chips mit hohem Leckstrom. Deshalb kann bei Chips mit hohem Leckstrom die Spannung zur Senkung des Verbrauchs und Verbesserung der Leistung reduziert werden.

Funktion: Der GPU-Leckstromwert wird aus eFuse oder OTP gelesen und einer Tabelle der entsprechende Spannungsselektor entnommen. Die Eigenschaft "opp-microvolt-&lt;selector&gt;" im jeweiligen OPP gibt dann dessen Zielspannung an.

Konfiguration: Ergänzen Sie zunächst den zugehörigen eFuse- oder OTP-Code gemäß den entsprechenden Dokumenten. Fügen Sie anschließend "rockchip,leak-voltage-sel", "nvmem-cells" und "nvmem-cell-names" zum OPP-Tabellenknoten hinzu. Ergänzen Sie außerdem entsprechend den tatsächlichen Bedingungen "opp-microvolt-&lt;name&gt;" am OPP-Knoten. Diese Einstellungen stehen normalerweise in der DTSI-Datei. Beispiel RK3328:

Redaktioneller Hinweis: Die Quellerläuterung verwendet rockchip,leak-voltage-sel, Code und chinesisches Original hingegen rockchip,leakage-voltage-sel. Diese Abweichung bleibt zur Nachverfolgbarkeit erhalten.

```text
gpu_opp_table: gpu-opp-table {
   compatible = "operating-points-v2";


   /*
   * Get GPU leakage from eFuse or OTP
   */
   nvmem-cells = <&gpu_leakage>;
   nvmem-cell-names = "gpu_leakage";

   /*
   * If leakage is between 1mA and 10mA, OPP will use the voltage specified by
   * opp-microvolt-L0.
   * If leakage is between 11mA and 254mA, OPP will use the voltage specified
by
   * opp-microvolt-L1

   *
   * If delete "rockchip,leakage-voltage-sel" or leakage exceed the range, OPP
will
   * use the voltage specified by "opp-microvolt".
   */
   rockchip,leakage-voltage-sel = <
      1  10  0
      11 254 1
   >;

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>;
      opp-microvolt = <950000>;

      opp-microvolt-L0 = <950000>;
      opp-microvolt-L1 = <950000>;
   };
   ...
   opp-500000000 {
      opp-hz = /bits/ 64 <500000000>;
      opp-microvolt = <1150000>;
      opp-microvolt-L0 = <1150000>;
      opp-microvolt-L1 = <1100000>;
   };
};
```

Zum Abschalten dieser Funktion kann die Eigenschaft "rockchip,leak-voltage-sel" entfernt werden. OPP verwendet dann die durch "opp-microvolt" angegebene Spannung.

Redaktioneller Hinweis: Die Quellerläuterung verwendet rockchip,leak-voltage-sel, Code und chinesisches Original hingegen rockchip,leakage-voltage-sel. Diese Abweichung bleibt zur Nachverfolgbarkeit erhalten.

#### 4.1.5 OPP-Tabelle anhand von PVTM anpassen

GPU-PVTM (Process-Voltage-Temperature Monitor) ist ein Modul nahe der GPU, das Leistungsunterschiede zwischen Chips widerspiegelt. Es wird durch Fertigungsprozess, Spannung und Temperatur beeinflusst.

##### 4.1.5.1 Spannung anhand von PVTM anpassen

Hintergrund: Laut den Tests der Quelle ist Vmin bei Chips mit kleinen PVTM-Werten höher als bei solchen mit großen PVTM-Werten. Daher kann bei großen PVTM-Werten die Spannung reduziert werden, um Verbrauch zu senken und Leistung zu verbessern.

Funktion: Der PVTM-Wert wird bei festgelegter Spannung und Frequenz ermittelt und auf die Referenztemperatur umgerechnet. Aus einer Tabelle wird der passende Spannungsselektor bestimmt. Die Eigenschaft "opp-microvolt-&lt;selector&gt;" des jeweiligen OPP gibt dessen Zielspannung an.

Konfiguration: Ergänzen Sie zunächst den PVTM-Code gemäß den PVTM-Dokumenten. Fügen Sie "rockchip,pvtm-voltage-sel", "rockchip,thermal-zone" und "rockchip,pvtm-&lt;name&gt;" zum OPP-Tabellenknoten hinzu. Bei unterschiedlichen Fertigungsprozessen ergänzen Sie "nvmem-cells" und "nvmem-cell-names". Ergänzen Sie entsprechend den tatsächlichen Bedingungen "opp-microvolt-&lt;name&gt;" am OPP-Knoten. Diese Einstellungen stehen normalerweise in der DTSI-Datei. Beispiel RK3399:

```text
gpu_opp_table: opp-table2 {
   compatible = "operating-points-v2";


   /*
   * If PVTM value is between 0 and 121000, OPP will use the voltage specified
by
   * "opp-microvolt-L0"
   * If PVTM value is between 121001 and 125500, OPP will use the voltage
specified by
   * "opp-microvolt-L1"
   * If PVTM value is between 125501 and 128500, OPP will use the voltage
specified by
   * "opp-microvolt-L2"
   * If PVTM value is between 128501 and 999999, OPP will use the voltage
specified by

   * "opp-microvolt-L3"
   *
   * If deleted "rockchip,pvtm-voltage-sel" or PVTM value exceeds the range of
the
   * table, OPP will use the voltage specified by "opp-microvolt".
   */
   rockchip,pvtm-voltage-sel = <
      0     121000 0
      121001 125500 1
      125501 128500 2

      128501 999999 3
   >;
   /* Before get PVTM value, change GPU frequency to 200000Khz */
   rockchip,pvtm-freq = <200000>;
   /* Before get PVTM value, change GPU voltage to 900000uV */
   rockchip,pvtm-volt = <900000>;
   /* PVTM channel, format <channel sel> */
   rockchip,pvtm-ch = <3 0>;
   rockchip,pvtm-sample-time = <1000>; /* PVTM sampling time, unit is us */
   rockchip,pvtm-number = <10>; /* PVTM sampling number */
   rockchip,pvtm-error = <1000>; /* error can be afford between sampling
data */

   rockchip,pvtm-ref-temp = <41>; /* refrence temperature */
   /*
   * Proportional coefficient of temperature, when below reference temperature
use the
   * first coefficient, when higher use the second one
   */
   rockchip,pvtm-temp-prop = <46 12>;
   rockchip,thermal-zone = "gpu-thermal"; /* get temperature from soc-thermal
*/

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>;
      opp-microvolt = <800000>;

      opp-microvolt-L0 = <800000>;
      opp-microvolt-L1 = <800000>;
      opp-microvolt-L2 = <800000>;
      opp-microvolt-L3 = <800000>;
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;
      opp-microvolt = <1100000>;
      opp-microvolt-L0 = <1100000>;
      opp-microvolt-L1 = <1075000>;
      opp-microvolt-L2 = <1050000>;

      opp-microvolt-L3 = <1025000>;
   };
};
```

Zum Abschalten dieser Funktion entfernen Sie "rockchip,pvtm-voltage-sel". OPP verwendet dann die durch "opp-microvolt" angegebene Spannung.

#### 4.1.6 OPP-Tabelle anhand des IR-Drops anpassen

IR-Drop bezeichnet einen Spannungsabfall oder -anstieg in den Versorgungs- und Massennetzen integrierter Schaltungen. Hier wird darunter die durch Versorgungswelligkeit und Platinenlayout verursachte Spannungswelligkeit verstanden.

Hintergrund: Einige Kundenlösungen weisen laut Quelle ungünstige Spannungswelligkeit auf. Bei Verwendung derselben OPP-Tabelle wie beim EVB ist die Spannung an manchen Frequenzpunkten zu niedrig, was die Systemstabilität beeinträchtigt. Dann muss die OPP-Tabelle anhand des IR-Drops angepasst werden.

Funktion: Die Differenz der Spannungswelligkeit zwischen EVB und Prototypplatine bei jeder Frequenz ergibt die dort zusätzlich benötigte Spannung.

Ergänzung aus dem chinesischen PDF, S. 11, §4.1.6: Überschreitet die resultierende Spannung den zulässigen Höchstwert, wird der betreffende Betriebspunkt entfernt.

Konfiguration: Ergänzen Sie "rockchip,max-volt", "rockchip,evb-irdrop" und "rockchip,board-irdrop" am OPP-Tabellenknoten. "rockchip,board-irdrop" steht normalerweise in der boardspezifischen DTS-Datei, die anderen Eigenschaften in der DTSI-Datei.

Beispielsweise wird die DTSI für RK3326 wie folgt konfiguriert:

```text
gpu_opp_table: gpu-opp-table {
   compatible = "operating-points-v2";


   rockchip,max-volt = <1175000>; /* the highest voltage, unit is uV */
   rockchip,evb-irdrop = <25000>; /* ripple voltage of EVB or SDK */
   ...
}
```

Die boardspezifische DTS wird wie folgt konfiguriert:

```text
&gpu_opp_table {
   /*

   * max IR-drop values on different freq condition for this board!
   */
   /*
   * ripple voltage at diffrent frequencies
   * If frequency is between 200Mhz-520MHz, ripple voltage is 50000uV, the
target
   * voltage will add 25000uV(50000-25000(EVB ripple voltage))
   */
   rockchip,board-irdrop = <
      /* MHz MHz uV */
        200 520 50000
   >;
};
```

Zum Abschalten dieser Funktion entfernen Sie “rockchip,board-irdrop”.

#### 4.1.7 Konfiguration für einen erweiterten Temperaturbereich

Ein erweiterter Temperaturbereich bezeichnet üblicherweise Umgebungstemperaturen von − 40℃ bis + 85℃.

Hintergrund: Einige Plattformen sind laut Quelle bei niedriger Temperatur instabil und werden nach einer Spannungserhöhung an bestimmten Frequenzpunkten stabil. Hier muss die Spannung temperaturabhängig angepasst werden.

Funktion: Erkennt das System eine Temperatur unterhalb eines festgelegten Werts, erhöht es die Spannung aller Frequenzpunkte. Überschreitet die Spannung eines Punkts die Systemobergrenze, wird dieser Frequenzpunkt gesperrt. Bei Rückkehr zur normalen Temperatur kehren die Spannungen zum Standardzustand zurück.

Konfiguration für niedrige Temperaturen: Ergänzen Sie "rockchip,temp-hysteresis", "rockchip,low-temp", "rockchip,low-temp-min-volt", "rockchip,low-temp-adjust-volt" und "rockchip,max-volt" am OPP-Tabellenknoten.

Diese Einstellungen stehen normalerweise in der DTSI-Datei. Beispiel RK3399:

```text
gpu_opp_table: opp-table2 {
   compatible = "operating-points-v2";


   /*
   * Hysteresis parameter, unit is millicelusius, prevent from entry into low
   * temperatures or high temperatures frequently
   * For example, when temperature less than 0 Celsius degrees, work on the low
   * temperature state, higher than 5 Celsius degrees, return to normal state.
   */
   rockchip,temp-hysteresis = <5000>;
   rockchip,low-temp = <0>; /* Threshold for low temperature,
millicelsius */
   rockchip,low-temp-min-volt = <900000>; /* Minimum voltage at low temperature,
uV */
   /* At lower temperature state, add 25mV to frequency at 0-800MHz */

   rockchip,low-temp-adjust-volt = <
      /* MHz MHz  uV */
        0    800  25000
   >;
   rockchip,max-volt = <1150000>; /* highest voltage, unit is uV */
   ...
}
```

#### 4.1.8 Konfiguration von upthreshold und downdifferential

Hintergrund: Der Governor simple ondemand besitzt die Parameter upthreshold und downdifferential mit Standardwerten 90 und 5. Übersteigt die Last 90%, wird die höchste Frequenz eingestellt. Liegt sie unter 90% und über 90%-5%, bleibt die Frequenz unverändert. Unter 90%-5% wird eine passende Frequenz gewählt, sodass die Last ungefähr 90%-5%/2 beträgt. Mit der Standardkonfiguration erhöht die GPU in manchen Szenarien ihre Frequenz nicht rechtzeitig, was zu Frameverlusten führt. Deshalb kann eine Anpassung erforderlich sein.

Konfiguration: Ergänzen Sie “upthreshold” und “downdifferential” am GPU-Knoten.

Diese Einstellungen stehen normalerweise in der DTSI-Datei. Beispiel RK3288:

```text
gpu: gpu@ffa30000 {
   compatible = "arm,malit764",
            "arm,malit76x",

            "arm,malit7xx",
            "arm,mali-midgard";
   reg = <0x0 0xffa30000 0x0 0x10000>;

   upthreshold = <75>;
   downdifferential = <10>;
   ...
}
```

### 4.2 DMC-DVFS-Konfiguration

DMC-DVFS (Dynamic Memory Controller) bedeutet dynamische Skalierung der DDR-Spannung und -Frequenz.

#### 4.2.1 Taktkonfiguration

Ergänzen Sie entsprechend der Plattform die Eigenschaft "clock" am DMC-Knoten, normalerweise in der DTSI-Datei. Details enthält die zugehörige Rockchip-Taktentwicklungsdokumentation. Beispiel RK3399:

```text
dmc: dmc {
   compatible = "rockchip,rk3399-dmc";
   ...

   clocks = <&cru SCLK_DDRCLK>;
   clock-names = "dmc_clk";
   ...
};
```

#### 4.2.2 Reglerkonfiguration

Ergänzen Sie entsprechend der Stromversorgung der Produkthardware “center-supply” am DMC-Knoten, normalerweise in der boardspezifischen DTS-Datei. Details zur Reglerkonfiguration enthalten die Dokumente zu Reglern und PMICs. Beispiel RK3399:

```text
&i2c0 {
   ...

   rk808: pmic@1b {
      ...
      regulators {
         vdd_center: DCDC_REG1 {
           regulator-always-on;
           regulator-boot-on;
           regulator-min-microvolt = <750000>;
           regulator-max-microvolt = <1350000>;
           regulator-ramp-delay = <6001>;
           regulator-name = "vdd_center";
           regulator-state-mem {

              regulator-off-in-suspend;
           };
         };
      };
   };
};

&dmc {
   status = "okay";
   center-supply = <&vdd_center>;
};
```

#### 4.2.3 OPP-Tabellenkonfiguration

Der Kernel legt die Frequenz- und Spannungskonfiguration im Device Tree ab. Die daraus gebildeten Knoten werden als OPP-Tabelle bezeichnet. Ihr Knoten enthält OPP-Knoten mit Frequenzen und Spannungen sowie Eigenschaften zur Leckstrom- und PVTM-Konfiguration.

Detaillierte Hinweise zur OPP-Konfiguration enthalten folgende Dokumente:

```text
Documentation/devicetree/bindings/opp/opp.txt
Documentation/power/opp.txt
```

##### 4.2.3.1 OPP-Tabelle hinzufügen

Ergänzen Sie entsprechend der Plattform einen OPP-Tabellenknoten und "operating-points-v2" am DMC-Knoten, normalerweise in der DTSI-Datei. Beispiel RK3399:

```text
&dmc {
   operating-points-v2 = <&dmc_opp_table>;

};

dmc_opp_table: opp-table3 {
   compatible = "operating-points-v2";

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>; /* Hz */
      opp-microvolt = <900000>;    /* uV */
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;
      opp-microvolt = <900000>;

   };
};
```

##### 4.2.3.2 OPP entfernen

Zum Entfernen bestimmter Frequenzpunkte können folgende Verfahren verwendet werden.

Verfahren 1: Ergänzen Sie "status = "disabeld";" am betreffenden OPP-Knoten, beispielsweise:

Redaktioneller Hinweis: Die Erläuterung der Quelle schreibt disabeld, der Code hingegen disabled. Diese Abweichung bleibt erhalten; prüfen Sie die tatsächliche Konfiguration anhand des Treibers.

```text
dmc_opp_table: opp-table3 {
   compatible = "operating-points-v2";


   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>; /* Hz */
      opp-microvolt = <800000>;    /* uV */
   };
   ...
   opp-800000000 {
      opp-hz = /bits/ 64 <800000000>;
      opp-microvolt = <900000>;
      status = "disabled";
   };
}
```

Verfahren 2: Referenzieren Sie den OPP-Tabellenknoten erneut in der boardspezifischen DTS und ergänzen Sie "status = "disabeld";" am betreffenden OPP-Knoten, beispielsweise:

Redaktioneller Hinweis: Die Erläuterung der Quelle schreibt disabeld, der Code hingegen disabled. Diese Abweichung bleibt erhalten; prüfen Sie die tatsächliche Konfiguration anhand des Treibers.

```text
&dmc_opp_table {
   opp-800000000 {
      status = "disabled";

   };
};
```

#### 4.2.4 OPP-Tabelle anhand des Leckstroms anpassen

IDDQ (Integrated Circuit Quiescent Current) wird auch Leckstrom genannt. DDR-Leckstrom ist der Ruhestrom von DDR bei einer bestimmten angelegten Spannung. Bei der Chipfertigung wird dieser Wert in eFuse oder OTP gespeichert.

Ergänzung aus dem chinesischen PDF, S. 15, §4.2.4: Gehört DDR zu VD logic, entspricht der DDR-Leckstrom dem Logik-Leckstrom, gemessen als Ruhestrom bei einer bestimmten Spannung an der Logikdomäne.

##### 4.2.4.1 Spannung anhand des Leckstroms anpassen

Hintergrund: Laut den Tests der Quelle ist Vmin bei Chips mit geringem Leckstrom höher als bei Chips mit hohem Leckstrom. Deshalb kann bei Chips mit hohem Leckstrom die Spannung zur Senkung des Verbrauchs und Verbesserung der Leistung reduziert werden.

Funktion: Lesen Sie den DDR-Leckstromwert aus eFuse oder OTP und bestimmen Sie den passenden Spannungsselektor aus einer Tabelle. Die Eigenschaft "opp-microvolt-&lt;selector&gt;" im jeweiligen OPP liefert dessen Zielspannung.

Konfiguration: Ergänzen Sie zunächst den eFuse- oder OTP-Code gemäß den entsprechenden Dokumenten. Fügen Sie dann "rockchip,leakage-voltage-sel", "nvmem-cells" und "nvmem-cell-names" am OPP-Tabellenknoten hinzu. Ergänzen Sie passend zu den tatsächlichen Bedingungen "opp-microvolt-&lt;name&gt;" am OPP-Knoten. Diese Einstellungen stehen normalerweise in der DTSI-Datei. Beispiel RK3328:

```text
dmc_opp_table: dmc-opp-table {
   compatible = "operating-points-v2";


   /*
   * Get DDR leakage from eFuse or OTP
   */
   nvmem-cells = <&logic_leakage>;
   nvmem-cell-names = "ddr_leakage";

   /*
   * If leakage is between 1mA and 10mA, OPP will use the voltage specified by
   * opp-microvolt-L0.
   * If leakage is between 11mA and 254mA, OPP will use the voltage specified
by
   * opp-microvolt-L1

   *
   * If delete "rockchip,leakage-voltage-sel" or leakage exceed the range, OPP
will
   * use the voltage specified by "opp-microvolt".
   */
   rockchip,leakage-voltage-sel = <
      1  10  0
      11 254 1
   >;

   opp-400000000 {
      opp-hz = /bits/ 64 <400000000>;
      opp-microvolt = <950000>;

      opp-microvolt-L0 = <950000>;
      opp-microvolt-L1 = <950000>;
   };
   ...
   opp-1066000000 {
      opp-hz = /bits/ 64 <1066000000>;
      opp-microvolt = <1175000>;
      opp-microvolt-L0 = <1175000>;
      opp-microvolt-L1 = <1150000>;
   };
};
```

Zum Abschalten entfernen Sie "rockchip,leakage-voltage-sel". OPP verwendet dann die durch "opp-microvolt" vorgegebene Spannung.

#### 4.2.5 OPP anhand von PVTM anpassen

##### 4.2.5.1 Spannung anhand von PVTM anpassen

Hintergrund: Laut den Tests der Quelle ist Vmin bei Chips mit kleinen PVTM-Werten höher als bei solchen mit großen PVTM-Werten. Daher kann bei großen PVTM-Werten die Spannung reduziert werden, um Verbrauch zu senken und Leistung zu verbessern.

Funktion: Der PVTM-Wert wird bei festgelegter Spannung und Frequenz ermittelt und auf die Referenztemperatur umgerechnet. Aus einer Tabelle wird der passende Spannungsselektor bestimmt. Die Eigenschaft "opp-microvolt-&lt;selector&gt;" des jeweiligen OPP gibt dessen Zielspannung an.

Konfiguration: Ergänzen Sie zunächst den PVTM-Code gemäß den PVTM-Dokumenten. Fügen Sie "rockchip,pvtm-voltage-sel", "rockchip,thermal-zone" und "rockchip,pvtm-&lt;name&gt;" zum OPP-Tabellenknoten hinzu. Bei unterschiedlichen Fertigungsprozessen ergänzen Sie "nvmem-cells" und "nvmem-cell-names". Ergänzen Sie passend zu den tatsächlichen Bedingungen "opp-microvolt-&lt;name&gt;" am OPP-Knoten. Diese Einstellungen stehen normalerweise in der DTSI-Datei. Beispiel PX30:

```text
dmc_opp_table: dmc-opp-table {
   compatible = "operating-points-v2";


   /*
   * If PVTM value is between 0 and 50000, OPP will use the voltage specified
by "opp-
   * microvolt-L0"
   * If PVTM value is between 50001 and 54000, OPP will use the voltage
specified by
   * "opp-microvolt-L1"
   * If PVTM value is between 54001 and 60000, OPP will use the voltage
specified by
   * "opp-microvolt-L2"
   * If PVTM value is between 60001 and 99999, OPP will use the voltage
specified by

   * "opp-microvolt-L3"
   *
   * If deleted "rockchip,pvtm-voltage-sel" or PVTM value exceeds the range of
the
   * table, OPP will use the voltage specified by "opp-microvolt".
   */
   rockchip,pvtm-voltage-sel = <
      0     50000 0
      50001 54000 1
      54001 60000 2
      60001 99999 3
   >;

   /* PVTM channel, format <channel sel>, here reuse the PVTM value of the CPU
*/
   rockchip,pvtm-ch = <0 0>;

   opp-194000000 {
      opp-hz = /bits/ 64 <194000000>;
      opp-microvolt = <950000>;
      opp-microvolt-L0 = <950000>;
      opp-microvolt-L1 = <950000>;
      opp-microvolt-L2 = <950000>;
      opp-microvolt-L3 = <950000>;
   };
   ...

   opp-786000000 {
      opp-hz = /bits/ 64 <786000000>;
      opp-microvolt = <1100000>;
      opp-microvolt-L0 = <1100000>;
      opp-microvolt-L1 = <1050000>;
      opp-microvolt-L2 = <1025000>;

      opp-microvolt-L3 = <1000000>;
      status = "disabled";
   };
};
```

Zum Abschalten dieser Funktion entfernen Sie "rockchip,pvtm-voltage-sel". OPP verwendet dann die durch "opp-microvolt" angegebene Spannung.

#### 4.2.6 OPP-Tabelle anhand des IR-Drops anpassen

IR-Drop bezeichnet einen Spannungsabfall oder -anstieg in den Versorgungs- und Massennetzen integrierter Schaltungen. Hier wird darunter die durch Versorgungswelligkeit und Platinenlayout verursachte Spannungswelligkeit verstanden.

Hintergrund: Einige Kundenlösungen weisen laut Quelle ungünstige Spannungswelligkeit auf. Bei Verwendung derselben OPP-Tabelle wie beim EVB ist die Spannung an manchen Frequenzpunkten zu niedrig, was die Systemstabilität beeinträchtigt. Dann muss die OPP-Tabelle anhand des IR-Drops angepasst werden.

Funktion: Die Differenz der Spannungswelligkeit zwischen EVB und Prototypplatine bei jeder Frequenz ergibt die dort zusätzlich benötigte Spannung.

Ergänzung aus dem chinesischen PDF, S. 17, §4.2.6: Überschreitet die resultierende Spannung den zulässigen Höchstwert, wird der betreffende Betriebspunkt entfernt.

Konfiguration: Ergänzen Sie "rockchip,max-volt", "rockchip,evb-irdrop" und "rockchip,board-irdrop" am OPP-Tabellenknoten. "rockchip,board-irdrop" steht normalerweise in der boardspezifischen DTS-Datei, die anderen Eigenschaften in der DTSI-Datei. Beispiel für die DTSI des RK3326:

```text
dmc_opp_table: dmc-opp-table {
   compatible = "operating-points-v2";


   rockchip,max-volt = <1150000>; /* the highest voltage, unit is uV */
   rockchip,evb-irdrop = <25000>; /* ripple voltage of EVB or SDK */
   ...
}
```

Die boardspezifische DTS wird wie folgt konfiguriert:

```text
&dmc_opp_table {
   /*

   * max IR-drop values on different freq condition for this board!
   */
   /*
   * ripple voltage at diffrent frequencies
   * If frequency is between 451Mhz-800MHz, ripple voltage is 75000uV, the
target
   * voltage will add 50000uV(75000-25000(EVB ripple voltage))
   */
   rockchip,board-irdrop = <
      /* MHz MHz uV */
        451 800 75000
   >;
};
```

Zum Abschalten dieser Funktion entfernen Sie “rockchip,board-irdrop”.

#### 4.2.7 Frequenz anhand des Szenarios ändern

Hintergrund: Eine feste DDR-Frequenz erschwert die Erfüllung der Produktanforderungen: Hohe Frequenz erhöht den Verbrauch, niedrige Frequenz mindert die Leistung. Bei Szenarien mit relativ klarem DDR-Bandbreitenbedarf, etwa Benchmarks, Video oder Standby, wird die DDR-Frequenz dynamisch erhöht oder gesenkt, um die jeweiligen Leistungs- und Verbrauchsanforderungen zu erfüllen.

Funktion: Beim Eintritt in bestimmte Szenarien wird die DDR-Frequenz auf den jeweiligen Vorgabewert gesetzt. Sind mehrere Szenarien gleichzeitig aktiv, gilt der höchste Wert. Die Quelle nennt zweimal SYS_STATUS_DUALVIEW als Szenarien ohne DDR-Frequenzskalierung. Nach deren Eintritt bleibt die DDR-Frequenz daher bis zum Verlassen unverändert, selbst wenn ein weiteres Szenario eine höhere Frequenz verlangt. Die doppelte Quellbezeichnung bleibt erhalten.

Konfiguration: Ergänzen Sie “system-status-freq” am DMC-Knoten. Beispiel RK3399:

```text
&dmc {
   status = "okay";
   ...

   system-status-freq = <
      /* system status freq(KHz) */
      /*
      * Except for the scenarios defined below, this frequency is constant
used in
      * other scenarios
      */
      SYS_STATUS_NORMAL 800000
      SYS_STATUS_REBOOT 528000 /* set frequency before reboot */
      SYS_STATUS_SUSPEND 200000 /* set frequency after screen is off */
      SYS_STATUS_VIDEO_1080P 200000 /* set frequency before play 1080p video
*/
      SYS_STATUS_VIDEO_4K 600000 /* set frequency before play 4k video*/

      SYS_STATUS_VIDEO_4K_10B 800000 /* set frequency before play 4k 10bit
video */
      SYS_STATUS_PERFORMANCE 800000 /* set frequency before run benchmark */
      /* modified the minimum frequency after touching the screen */
      SYS_STATUS_BOOST 400000
      /* fixed DDR frequency before the second screen display*/
      SYS_STATUS_DUALVIEW 600000
      SYS_STATUS_ISP   600000 /* fix DDR frequency before ISP work */
   >;
}
```

#### 4.2.8 Frequenz anhand der Last ändern

Hintergrund: Nur wenige Szenarien lassen sich explizit abdecken. In anderen Fällen muss die DDR-Frequenz anhand der DDR-Auslastung dynamisch angepasst werden, um Leistung und Verbrauch zu optimieren.

Funktion: Die DDR-Auslastung wird regelmäßig erfasst und mit dem in der Quelle als simple ondeman bezeichneten Algorithmus eine Zielfrequenz gewählt. Dabei werden szenariospezifische DDR-Bandbreitenanforderungen berücksichtigt; letztlich gilt der höchste Wert. In den Szenarien SYS_STATUS_DUALVIEW und SYS_STATUS_ISP bleibt die DDR-Frequenz fest.

Konfiguration: Ergänzen Sie "devfreq-events", "upthreshold", "downdifferential", "System-status-freq", "auto-min-freq" und "auto-freq-en" am DMC-Knoten. Beispiel RK3399:

```text
&dmc {
   status = "okay";
   ...

   devfreq-events = <&dfi>;  /* Monitor DDR utilization through dfi */
   /*
   * When the load exceeds 40%, change to the highest frequency,
   * When the load is less than 40% and greater than 40% -20%, maintain the
current
   * frequency
   * When the load is less than 40% -20%, it will be change to a frequency so
that
   * the load is almost equals to 40% - 20% / 2.
   */
   upthreshold = <40>;
   downdifferential = <20>;
   system-status-freq = <

      /* system status freq(KHz) */
      /*
      * Except for the scenarios defined below, this frequency is constant
used in
      * other scenarios
      */
      SYS_STATUS_NORMAL 800000
      SYS_STATUS_REBOOT 528000 /* set frequency before reboot */
      SYS_STATUS_SUSPEND 200000 /* set frequency after screen is off */
      SYS_STATUS_VIDEO_1080P 200000 /* set frequency before play 1080p video
*/
      SYS_STATUS_VIDEO_4K 600000 /* set frequency before play 4k video*/

      SYS_STATUS_VIDEO_4K_10B 800000 /* set frequency before play 4k 10bit
video */
      SYS_STATUS_PERFORMANCE 800000 /* set frequency before run benchmark */
      /* modified the minimum frequency after touching the screen */
      SYS_STATUS_BOOST 400000
      /* fixed DDR frequency before the second screen display*/
      SYS_STATUS_DUALVIEW 600000
      SYS_STATUS_ISP   600000 /* fix DDR frequency before ISP work */
   >;
   /*
   * In addition to the scenarios defined above, set the minimum frequency for
other
   * scenarios to prevent the screen splash.

   */
   auto-min-freq = <400000>;
   auto-freq-en = <1>;       /* 1 is enabled, 0 is disabled */
};
```

#### 4.2.9 Frequenz anhand der VOP-Bandbreite ändern

Hintergrund: Nach Aktivierung von auto-freq muss "auto-min-freq" ergänzt werden, um eine Mindestfrequenz festzulegen und Bildstörungen zu vermeiden. In diesen Szenarien besteht daher weiteres Energiesparpotenzial durch Anpassung der DDR-Frequenz an die VOP-Bandbreite.

Funktion: Vor der Anzeige jedes Frames berechnet der VOP-Treiber dessen DDR-Bandbreitenbedarf und passt anschließend die DDR-Mindestfrequenz entsprechend an.

Konfiguration: Ergänzen Sie "vop-bw-dmc-freq" am DMC-Knoten. Beispiel RK3399:

```text
&dmc {
   status = "okay";
   ...

   /*
   * bandwidth is 0-577MB/s, the minimum DDR frequency is 200MHz.
   * bandwidth is 578-1701MB/s, the minimum DDR frequency is 300MHz.
   * bandwidth is 1702-99999MB/s, the minimum DDR frequency is 400MHz.
   */
   vop-bw-dmc-freq = <
   /* min_bw(MB/s) max_bw(MB/s) freq(KHz) */
      0    577    200000
      578  1701   300000
      1702 99999  400000
   >;
   /*

   * After support changing frequency according to VOP bandwidth, this value can
be
   * changed to a low frequency.
   */
   auto-min-freq = <200000>;
};
```

### 4.3 BUS-DVFS-Konfiguration

Neben GPU und DMC benötigen weitere Module wie PLL und CCI eine dynamische Frequenz- und Spannungsanpassung. Sie werden hier unter BUS-DVFS zusammengefasst.

#### 4.3.1 PLL-DVFS-Konfiguration

Hintergrund: Auf manchen Plattformen muss die Spannung der PLL-Domäne erhöht werden, sobald die PLL-Frequenz einen bestimmten Wert überschreitet. Die Spannung muss daher abhängig von der PLL-Frequenz angepasst werden.

Funktion: Ein registrierter Clock-Notifier überwacht die PLL-Frequenz. Bei einer Erhöhung wird zuerst die Spannung und dann die Frequenz angehoben. Bei einer Absenkung wird zuerst die Frequenz und dann die Spannung reduziert.

Konfiguration: Ergänzen Sie "rockchip,busfreq-policy", "clocks", "clock-names", "operating-points-v2" und "Bus-supply" am Geräteknoten.

Die DTSI-Konfiguration am Beispiel von PX30 lautet:

```text
bus_apll: bus-apll {
   compatible = "rockchip,px30-bus";

   /*
   * Use clkfreq policy to monitor PLL frequency. If PLL frequency is raising,
   * first raise the voltage and then increase the frequency. If PLL frequency
is
   * going down, first decrease the frequency and then decrease the voltage.
   */
   rockchip,busfreq-policy = "clkfreq";
   clocks = <&cru PLL_APLL>;       /* Clock configuration */
   clock-names = "bus";
   operating-points-v2 = <&bus_apll_opp_table>; /* OPP Table configuration */
   status = "disabled";
};


bus_apll_opp_table: bus-apll-opp-table {
   compatible = "operating-points-v2";
   opp-shared;
   /*
   * If PLL frequency less than or equal to 1008MHz, voltage is 950mV,
   * if greater than 1008MHz, voltage is 1000mV
   */
   opp-1512000000 {
      opp-hz = /bits/ 64 <1512000000>;
      opp-microvolt = <1000000>;
   opp-1008000000 {
      opp-hz = /bits/ 64 <1008000000>;

      opp-microvolt = <950000>;
   };
};
```

Die Board-Konfiguration lautet:

```text
&i2c0 {
   status = "okay";

   rk809: pmic@20 {
      compatible = "rockchip,rk809";
      reg = <0x20>;
      ...
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
      }

   }
}

&bus_apll {
   /*
   * regulator configuration,
   * it should be modified according to the actual product hardware power
solution
   */
   bus-supply = <&vdd_logic>;
   status = "okay";
};
```

## 5. Einführung in die Benutzerschnittstelle

Nach erfolgreicher Devfreq-Registrierung eines Geräts entsteht unter "/sys/class/devfreq/" ein Unterverzeichnis mit der Userspace-Schnittstelle, etwa "ff9a0000.gpu". Darüber können Governor gewechselt, aktuelle Frequenzen geprüft und Frequenzen geändert werden:

```text
available_frequencies /* available frequencies */
available_governors  /* available devfreq governors */

cur_freq             /* the current frequency */
governor             /* current devfreq governor */
load                 /* current load */
max_freq             /* the maximum frequency */
min_freq             /* the minimum frequency */
polling_interval     /* the polling interval in ms. 0 disables polling */
target_freq          /* the last frequency set by software*/
trans_stat           /* scaling times and running time at each frequency
*/
```

## 6. Häufig gestellte Fragen

### 6.1 OPP-Tabelle prüfen

Geben Sie folgenden Befehl ein:

```text
cat /sys/kernel/debug/opp/opp_summary
```

Beispiel PX30:

```text
 device          rate(Hz) target(uV) min(uV) max(uV)
-------------------------------------------------------------------
 platform-dmc

                194000000  950000   950000   950000
                328000000  950000   950000   950000
                450000000  950000   950000   950000
                528000000  975000   975000   975000
                666000000  1000000 1000000  1000000
 platform-ff400000.gpu
                200000000  950000   950000   950000
                300000000  950000   950000   950000
                400000000  1025000 1025000  1025000
                480000000  1100000 1100000  1100000
 platform-bus-apll
               1008000000  950000   950000   950000

               1512000000  1000000 1000000  1000000
```

### 6.2 Frequenz fest einstellen

Verfahren 1: Deaktivieren Sie alle nicht benötigten OPPs in der OPP-Tabelle und behalten Sie nur den gewünschten. Beispiel: GPU-Frequenz des PX30 auf 400MHz festlegen.

```text
gpu_opp_table: gpu-opp-table {
   compatible = "operating-points-v2";
   ...

   opp-200000000 {
      opp-hz = /bits/ 64 <200000000>;
      opp-microvolt = <950000>;
      opp-microvolt-L0 = <950000>;
      opp-microvolt-L1 = <950000>;
      opp-microvolt-L2 = <950000>;
      opp-microvolt-L3 = <950000>;
      status = "disabled";
   };
   opp-300000000 {
      opp-hz = /bits/ 64 <300000000>;
      opp-microvolt = <975000>;

      opp-microvolt-L0 = <975000>;
      opp-microvolt-L1 = <950000>;
      opp-microvolt-L2 = <950000>;
      opp-microvolt-L3 = <950000>;
      status = "disabled";

   };
   opp-400000000 {
      opp-hz = /bits/ 64 <400000000>;
      opp-microvolt = <1050000>;
      opp-microvolt-L0 = <1050000>;
      opp-microvolt-L1 = <1025000>;
      opp-microvolt-L2 = <975000>;
      opp-microvolt-L3 = <950000>;
   };
   opp-480000000 {
      opp-hz = /bits/ 64 <480000000>;
      opp-microvolt = <1125000>;

      opp-microvolt-L0 = <1125000>;
      opp-microvolt-L1 = <1100000>;
      opp-microvolt-L2 = <1050000>;
      opp-microvolt-L3 = <1000000>;
      status = "disabled";
   };
};
```

Verfahren 2: Per Befehl während des Gerätebetriebs. Am Beispiel PX30 lauten die Befehle:

```text
/* set governor to userspace */
echo userspace > /sys/class/devfreq/ff400000.gpu/governor

/* set frequency to 400MHz */
echo 400000000 > /sys/class/devfreq/ff400000.gpu/userspace/set_freq
/* check the current frequency */
cat /sys/class/devfreq/ff400000.gpu/cur_freq
```

### 6.3 Aktuelle Frequenz prüfen

Die Frequenz kann über die Devfreq-Benutzerschnittstelle und die debugfs-Taktschnittstelle geprüft werden.

Am Beispiel PX30 lauten die Befehle:

```text
/* Method 1: devfreq userspace interface */
cat /sys/class/devfreq/ff400000.gpu/cur_freq


/* Method 2: clock debug interface */
cat /sys/kernel/debug/clk/aclk_gpu/clk_rate
```

### 6.4 Aktuelle Spannung prüfen

Die Spannung kann über die Debug-Schnittstelle des Reglers geprüft werden. Beispiel für die GPU-Spannung des PX30:

```text
/* here vdd_logic is not fixed name, please modify */
cat /sys/kernel/debug/regulator/vdd_logic/voltage
```

### 6.5 Spannung und Frequenz getrennt einstellen

Am Beispiel der PX30-GPU werden Frequenz und Spannung auf 400MHz beziehungsweise 1000mV gesetzt.

```text
/* set governor to userspace */
echo userspace > /sys/class/devfreq/ff400000.gpu/governor


/* set frequency to 400MHz */
echo 400000000 > /sys/kernel/debug/clk/aclk_gpu/clk_rate
cat /sys/kernel/debug/clk/aclk_gpu/clk_rate

/* set voltage to 1000mV */
echo 1000000 > /sys/kernel/debug/regulator/vdd_logic/voltage
cat /sys/kernel/debug/regulator/vdd_logic/voltage
```

Hinweis: Bei einer Frequenzerhöhung zuerst die Spannung und dann die Frequenz erhöhen; bei einer Absenkung zuerst die Frequenz und dann die Spannung reduzieren.

### 6.6 Spannung eines OPP prüfen

Wenn die PVTM-basierte Spannungsanpassung unterstützt wird, geben Sie folgenden Befehl ein:

```text
dmesg | grep pvtm
```

Am Beispiel RK3399 ergibt sich folgende Ausgabe:

```text
[  0.669456] cpu cpu0: temp=22222, pvtm=138792 (140977 + -2185)
[  0.670601] cpu cpu0: pvtm-volt-sel=0

[  0.683008] cpu cpu4: temp=22222, pvtm=148761 (150110 + -1349)
[  0.683109] cpu cpu4: pvtm-volt-sel=0
[  1.495247] rockchip-dmc dmc: Failed to get pvtm
[  3.366028] mali ff9a0000.gpu: temp=22777, pvtm=120824 (121698 + -874)
/* pvtm-volt-sel = 0, opp-microvolt-L0 property will be used in GPU OPP table */
[  3.366915] mali ff9a0000.gpu: pvtm-volt-sel=0
```

Bei unterstützter leckstromabhängiger Spannungsanpassung liefert der folgende Befehl entsprechend eine ähnliche Ausgabe.

```text
dmesg | grep leakage
```

### 6.7 Aktuellen Leckstrom prüfen

Geben Sie folgenden Befehl ein:

```text
dmesg | grep leakage
```

Am Beispiel der RK3399-CPU ergibt sich folgende Ausgabe:

```text
[  0.656175] cpu cpu0: leakage=10
[  0.671092] cpu cpu4: leakage=20

[  1.492769] rockchip-dmc dmc: Failed to get leakage
/* leakage=15，GPU's leakage is 15mA*/
[  3.341084] mali ff9a0000.gpu: leakage=15
```

### 6.8 Spannung eines OPP ändern

Verfahren 1: Die jeweilige OPP-Spannung direkt ändern.

Beispielsweise bei 200MHz um 25000uV erhöhen. Die Standardkonfiguration lautet:

```text
opp-200000000 {
   opp-hz = /bits/ 64 <200000000>;
   opp-microvolt = <800000>;

   opp-microvolt-L0 = <800000>;
   opp-microvolt-L1 = <800000>;
   opp-microvolt-L2 = <800000>;
   opp-microvolt-L3 = <800000>;
};
```

Nach der Änderung:

```text
opp-200000000 {
   opp-hz = /bits/ 64 <200000000>;

   /* Add 25000uV for each property */
   opp-microvolt = <825000>;
   opp-microvolt-L0 = <825000>;
   opp-microvolt-L1 = <825000>;
   opp-microvolt-L2 = <825000>;
   opp-microvolt-L3 = <825000>;
};
```

Verfahren 2: Spannung durch Anpassung der IR-Drop-Konfiguration ändern; siehe Abschnitt 4.2.6.

Beispielsweise die Spannung bei 200MHz GPU-Frequenz um 25000uV erhöhen. Die IR-Drop-Standardkonfiguration lautet:

```text
&gpu_opp_table {
   /*
   * max IR-drop values on different freq condition for this board!

   */
   /*
   * ripple voltage at diffrent frequencies
   * 200Mhz-520MHz，ripple voltage is 50000uV，the target voltage will increase
by
   * 25000uV（50000-25000(EVB ripple voltage))

   */
   rockchip,board-irdrop = <
      /* MHz MHz uV */
        200 520 50000
   >;
};
```

Nach der Änderung:

```text
&gpu_opp_table {
   /*

   * max IR-drop values on different freq condition for this board!
   */
   /*
   * ripple voltage at diffrent frequencies
   * 200Mhz-299MHz，ripple voltage is 50000uV，the target voltage will increase
by
   * 50000uV（75000-25000(EVB ripple voltage))
   * 300Mhz-520MHz，ripple voltage is 50000uV，the target voltage will increase
by
   * 25000uV（50000-25000(EVB ripple voltage))
   */
   rockchip,board-irdrop = <
      /* MHz MHz uV */

        200 299 75000 /* from 50000 to 75000 */
        300 520 50000
   >;
};
```

{% endraw %}
