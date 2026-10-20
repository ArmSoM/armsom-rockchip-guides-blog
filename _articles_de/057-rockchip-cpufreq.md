---
title: "Rockchip CPUFreq: Vollständige Anleitung zu CPU-DVFS, OPP, PVTM und Fehlersuche"
description: "Rockchip-CPU-Takte, Spannungsregler und OPP-Tabellen konfigurieren: Spannungsauswahl über Leckstrom/PVTM, IR-Drop-Kompensation, Temperaturverhalten und Debugging-Beispiele als Referenz für ArmSoM-Anpassungen."
translation_key: "057-rockchip-cpufreq"
slug: "057-rockchip-cpufreq"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: ["Rockchip", "CPUFreq", "DVFS", "OPP", "PVTM", "Linux"]
keywords: "ArmSoM Rockchip CPUFreq DVFS OPP PVTM Linux"
excerpt: "Rockchip-CPU-Takte, Spannungsregler und OPP-Tabellen konfigurieren: Spannungsauswahl über Leckstrom/PVTM, IR-Drop-Kompensation, Temperaturverhalten und Debugging-Beispiele als Referenz für ArmSoM-Anpassungen."
---

{% raw %}

# Rockchip CPUFreq: Vollständige Anleitung zu CPU-DVFS, OPP, PVTM und Fehlersuche

Dies ist eine Rockchip-CPUFreq-Plattformreferenz, keine auf ArmSoM-Hardware geprüfte Anleitung. Die Produktversionstabelle der Quelle nennt alle Chips und Linux 4.4 / 4.19; daraus ergibt sich keine Unterstützung aller ArmSoM-Boards oder aktueller BSPs. Prüfen Sie vor der Anpassung der Beispiele SoC, Stromversorgung der Platine und PMIC/Spannungsregler, Taktbaum, OPP-Tabelle, eFuse/OTP/PVTM-Unterstützung sowie SDK/BSP/Kernel-Treiber. Übernehmen Sie Frequenzen, Spannungen oder Registereinstellungen nicht ungeprüft. Protokolle, Testergebnisse und Frequenzgrenzen stammen aus der Quelle und sind keine ArmSoM-Messungen. Es wurden keine Frequenz-/Spannungsbefehle ausgeführt. Beide Originale tragen V1.1.1 (Chinesisch 21 Seiten / Englisch 25 Seiten); der jeweilige Inhalt bleibt erhalten und Widersprüche sind dokumentiert. Chinesisch verwendet die chinesische Originalabbildung, Englisch, Russisch und Deutsch die englische. Russisch und Deutsch übersetzen den vollständigen englischen technischen Inhalt; Codekommentare bleiben in der Quellsprache.

| Chip-Geltungsbereich der Quelle | Kernel-Version |
| --- | --- |
| Alle Chips (Formulierung der Quelle; Prüfung je Board erforderlich) | Linux 4.4 / Linux 4.19 |

[Redaktionelle Hinweise](/docs/rockchip-cpufreq/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Überblick

CPUFreq ist ein von Kernel-Entwicklern definiertes Framework, das CPU-Frequenz und -Spannung anhand eines vorgegebenen Governors dynamisch ändert. Es kann den CPU-Energieverbrauch unter Berücksichtigung der Leistung wirksam senken. Das CPUFreq-Framework besteht aus Governor, Core, Driver und Stats. Die Softwarearchitektur ist nachfolgend dargestellt:

![Architekturdiagramm des englischen Originals, PDF S. 5](/docs/rockchip-cpufreq/assets/en-p5-1.png)

CPUFreq-Governor: Er entscheidet, wann die CPU-Frequenz geändert wird und auf welchen Wert. Der Kernel enthält folgende Governors:

- conservative: Ändert die Frequenz dynamisch gemäß CPU-Last und erhöht oder senkt sie schrittweise um einen bestimmten Anteil.

- ondemand: Ändert die Frequenz dynamisch gemäß CPU-Last; große Sprünge sind möglich, etwa direkt von der höchsten beziehungsweise niedrigsten Frequenz.

- interactive: Ändert die Frequenz dynamisch gemäß CPU-Last; reagiert gegenüber ondemand schneller, bietet mehr Parameter und ist flexibler.

- userspace: Stellt eine Benutzerschnittstelle bereit, über die Anwendungen im Benutzermodus die Frequenz ändern können.

- powersave: Bevorzugt niedrigen Energieverbrauch und stellt stets die niedrigste Frequenz ein.

- performance: Bevorzugt Leistung und stellt stets die höchste Frequenz ein.

- schedutil: Ein spezieller Governor für EAS. EAS (Energy Aware Scheduling) ist eine neuere Strategie zur Aufgabenplanung, die CPUFreq und CPU Idle einbezieht. Bei der Auswahl der CPU für eine Aufgabe berücksichtigt sie Leistung und Energieverbrauch, um laut Quelle den Systemenergieverbrauch ohne Leistungseinbußen zu minimieren.

CPUFreq-Core: Kapselt und abstrahiert cpufreq-Governors und cpufreq-Treiber und definiert eindeutige Schnittstellen.

CPUFreq-Driver: Initialisiert die CPU-Frequenztabelle und stellt die CPU-Frequenz ein.

CPUFreq-Stats: Liefert Statistiken zu cpufreq.

## 2. Codepfade

Code zu Governors:

```text
drivers/cpufreq/cpufreq_conservative.c /* conservative governor */
drivers/cpufreq/cpufreq_ondemand.c /* ondemand governor */
drivers/cpufreq/cpufreq_interactive.c /* interactive governor */

drivers/cpufreq/cpufreq_userspace.c /* userspace governor */
drivers/cpufreq/cpufreq_performance.c /* performance governor */
kernel/sched/cpufreq_schedutil.c /* schedutil governor */
```

Code zu Stats:

```text
drivers/cpufreq/cpufreq_stats.c
```

Code zum Core:

```text
drivers/cpufreq/cpufreq.c
```

Code zu Treibern:

```text
drivers/cpufreq/cpufreq-dt.c     /* platform driver */
drivers/cpufreq/rockchip-cpufreq.c /* platform device */
drivers/soc/rockchip/rockchip_opp_select.c /* interface for changing opp */
```

## 3. Konfiguration

### 3.1 Menuconfig

```text
CPU Power Management --->
   CPU Frequency scaling --->
      [*] CPU Frequency scaling

      <*> CPU frequency translation statistics /* cpufreq stats */
[ ]  CPU frequency translation statistics details
[*] CPU frequency time-in-state statistics
   Default CPUFreq governor (interactive) ---> /* cpufreq governor */

<*> 'performance' governor
<*> 'powersave' governor
<*> 'userspace' governor for userspace frequency scaling
<*> 'ondemand' cpufreq policy governor
-*- 'interactive' cpufreq policy governor
<*> 'conservative' cpufreq governor
[ ] 'schedutil' cpufreq policy governor
   *** CPU frequency scaling drivers ***
<*> Generic DT based cpufreq driver /* platform driver */
< > Generic ARM big LITTLE CPUfreq driver
<*> Rockchip CPUfreq driver        /* platform device */
```

Über „Default CPUFreq governor“ wählen Sie den Governor für die Frequenzskalierung und passen ihn an die tatsächlichen Produktanforderungen an.

### 3.2 Taktkonfiguration

Fügen Sie entsprechend der Plattform dem CPU-Knoten die Eigenschaft „clock“ hinzu, in der Regel in der DTSI-Datei. Ausführliche Hinweise zur Taktkonfiguration enthalten die einschlägigen Rockchip-Dokumente zur Taktentwicklung.

Bei Plattformen ohne big.LITTLE-Kerne, etwa RK3326 und RK3328, ergänzen Sie im CPU0-Knoten „clocks = &lt;&cru ARMCLK&gt;;“. Beispiel RK3328:

```text
cpu0: cpu@0 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   clocks = <&cru ARMCLK>;
};
```

Bei big.LITTLE-Plattformen wie RK3368 und RK3399 ergänzen Sie in jedem CPU-Knoten eines großen Kerns „clocks = &lt;&cru ARMCLKB&gt;;“ und in jedem CPU-Knoten eines kleinen Kerns „clocks = &lt;&cru ARMCLKL&gt;;“. Beispiel RK3399:

```text
cpu_l0: cpu@0 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   clocks = <&cru ARMCLKL>;
};

cpu_l1: cpu@1 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";
   ...
   clocks = <&cru ARMCLKL>;
};
cpu_l2: cpu@2 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   clocks = <&cru ARMCLKL>;
};

cpu_l3: cpu@3 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";
   ...
   clocks = <&cru ARMCLKL>;
};

cpu_b0: cpu@100 {

   device_type = "cpu";
   compatible = "arm,cortex-a72", "arm,armv8";
   ...
   clocks = <&cru ARMCLKB>;
};

cpu_b1: cpu@101 {
   device_type = "cpu";
   compatible = "arm,cortex-a72", "arm,armv8";
   ...
   clocks = <&cru ARMCLKB>;
};
```

Hinweis: Ohne Taktkonfiguration schlägt der CPUFreq-Treiber fehl und gibt folgenden Fehler aus:

```text
cpu cpu0: failed to get clock: -2
cpufreq-dt: probe of cpufreq-dt failed with error -2
```

### 3.3 Spannungsregler konfigurieren

Fügen Sie entsprechend der tatsächlichen Hardware-Stromversorgung die Eigenschaft „cpu-supply“ zum CPU-Knoten hinzu, in der Regel in der Board-DTS-Datei. Details zur Regulator-Konfiguration finden Sie in den Entwicklungsdokumenten zu Regulator und PMIC.

Bei Plattformen ohne big.LITTLE ergänzen Sie „cpu-supply“ im CPU0-Knoten. Beispiel RK3328:

```text
&i2c1 {
   status = "okay";
   rk805: rk805@18 {

      compatible = "rockchip,rk805";
      status = "okay";
      ...
      regulators {
         compatible = "rk805-regulator";
         status = "okay";
         ...
         vdd_arm: RK805_DCDC2 {
           regulator-compatible = "RK805_DCDC2";
           regulator-name = "vdd_arm";
           regulator-init-microvolt = <1225000>;

           regulator-min-microvolt = <712500>;
           regulator-max-microvolt = <1450000>;
           regulator-initial-mode = <0x1>;
           regulator-ramp-delay = <12500>;
           regulator-boot-on;
           regulator-always-on;
           regulator-state-mem {
              regulator-mode = <0x2>;
              regulator-on-in-suspend;
              regulator-suspend-microvolt = <950000>;
           };
         };

         ...
      };
   };
};

&cpu0 {
   cpu-supply = <&vdd_arm>;
};
```

Bei big.LITTLE-Plattformen ergänzen Sie „cpu-supply“ in jedem CPU-Knoten. Beispiel RK3399:

```text
&cpu_l0 {
   cpu-supply = <&vdd_cpu_l>;

};

&cpu_l1 {
   cpu-supply = <&vdd_cpu_l>;
};

&cpu_l2 {
   cpu-supply = <&vdd_cpu_l>;
};

&cpu_l3 {
   cpu-supply = <&vdd_cpu_l>;
};


&cpu_b0 {
   cpu-supply = <&vdd_cpu_b>;
};

&cpu_b1 {
   cpu-supply = <&vdd_cpu_b>;
};
```

Hinweis: Ohne Spannungsreglerkonfiguration lässt sich der cpufreq-Treiber weiterhin erfolgreich laden. Die CPU-Frequenz wird dann ohne Spannungsänderung angepasst. Oberhalb einer bestimmten Frequenz kann die zu niedrige Spannung jedoch einen Absturz verursachen.

### 3.4 OPP-Tabelle konfigurieren

Der Kernel hinterlegt die Konfiguration von Frequenz und Spannung im Device Tree. Die aus diesen Angaben bestehenden Knoten werden OPP-Tabelle genannt. Der OPP-Table-Knoten enthält OPP-Knoten mit Frequenz und Spannung sowie Eigenschaften für Leckstrom- und PVTM-Konfiguration.

Ausführliche Hinweise zur OPP-Konfiguration enthalten folgende Dokumente:

```text
Documentation/devicetree/bindings/opp/opp.txt
Documentation/power/opp.txt
```

#### 3.4.1 OPP-Tabelle hinzufügen

Fügen Sie entsprechend der Plattform einen OPP-Table-Knoten hinzu und ergänzen Sie „operating-points-v2“ unter jedem CPU-Knoten, normalerweise in der DTSI-Datei. Beispiel RK3328:

```text
cpu0: cpu@0 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   operating-points-v2 = <&cpu0_opp_table>;
};
cpu1: cpu@1 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";
   ...
   operating-points-v2 = <&cpu0_opp_table>;
};
cpu2: cpu@2 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";

   ...
   operating-points-v2 = <&cpu0_opp_table>;
};
cpu3: cpu@3 {
   device_type = "cpu";
   compatible = "arm,cortex-a53", "arm,armv8";
   ...
   operating-points-v2 = <&cpu0_opp_table>;
};

cpu0_opp_table: opp_table0 {
   compatible = "operating-points-v2";
   opp-shared; /* indicate the OPP Table is shared by multiple CPUs. */


   /*
   * The frequency conversion factor, it will be converted into a frequency by
a
   * certain algorithm, indicating the highest frequency limited by this
platform, and
   * the higher frequency will be deleted. For example, "13" is converted to
   * frequency "1296MHz", the frequency more than 1296MHz in the OPP Table will
be
   * deleted. It is used to prevent the error of filling in a high frequency

which
   * isn't supported by the platform and it would be no need generally.
   */
   rockchip,avs-scale = <13>;

   opp-408000000 {
      opp-hz = /bits/ 64 <408000000>; /* Hz */
      opp-microvolt = <950000 950000 1350000>;/* uV, <target min max> */
      /* ns, the time required to complete the transformation */
      clock-latency-ns = <40000>;
      /*
      * when suspend or the entire big or little cores are shut down, the CPU

      * frequency will be set to the OPP freqency. Only one OPP node contains
this
      * property in a OPP Table.
      */
      opp-suspend;
   };
   ...
   opp-1296000000 {
      opp-hz = /bits/ 64 <1296000000>;
      opp-microvolt = <1350000 1350000 1350000>;
      clock-latency-ns = <40000>;
   };
}
```

Hinweis: Fehlt „operating-points-v2“ für die OPP-Tabelle, schlägt die Initialisierung von cpufreq fehl. Das System kann Frequenz und Spannung nicht ändern und gibt beispielsweise folgenden Fehler aus:

```text
cpu cpu0: OPP-v2 not supported
cpu cpu0: couldn't find opp table for cpu:0, -19
```

#### 3.4.2 OPP entfernen

Sollen bestimmte Frequenzpunkte entfernt werden, kann folgendes Verfahren verwendet werden.

Methode 1: Dem betreffenden OPP-Knoten `status = "disabeld";` hinzufügen, beispielsweise:

Redaktioneller Hinweis: Die Erklärung der Quelle schreibt disabeld, der Code dagegen disabled. Der ursprüngliche Unterschied bleibt erhalten; prüfen Sie die tatsächliche Konfiguration anhand des Treibers.

```text
cpu0_opp_table: opp_table0 {
   compatible = "operating-points-v2";
   opp-shared;


   opp-408000000 {
      opp-hz = /bits/ 64 <408000000>;
      opp-microvolt = <950000 950000 1350000>;
      clock-latency-ns = <40000>;
   };
   ...
   opp-1296000000 {
      opp-hz = /bits/ 64 <1296000000>;
      opp-microvolt = <1350000 1350000 1350000>;
      clock-latency-ns = <40000>;
      status = "disabled";

   };
}
```

Methode 2: Den OPP-Table-Knoten in der Board-DTS erneut referenzieren und im betreffenden OPP-Knoten `status = "disabeld";` ergänzen, beispielsweise:

Redaktioneller Hinweis: Die Erklärung der Quelle schreibt disabeld, der Code dagegen disabled. Der ursprüngliche Unterschied bleibt erhalten; prüfen Sie die tatsächliche Konfiguration anhand des Treibers.

```text
&cpu0_opp_table {
   opp-1296000000 {

      status = "disabled";
   }；
};
```

### 3.5 OPP-Tabelle nach Leckstrom anpassen

IDDQ (Integrated Circuit Quiescent Current) wird auch als Leckstrom bezeichnet. Der CPU-Leckstrom ist der Ruhestrom der CPU bei einer bestimmten Versorgungsspannung. Bei der Chipherstellung wird der Leckstromwert in eFuse oder OTP geschrieben.

#### 3.5.1 Spannung nach Leckstrom anpassen

Hintergrund: Die Tests der Quelle zeigen, dass Vmin bei Chips mit geringem Leckstrom größer ist als bei Chips mit hohem Leckstrom. Daher kann die Spannung bei Chips mit hohem Leckstrom gesenkt werden, um den Energieverbrauch zu reduzieren und die Leistung zu verbessern.

Funktionsweise: Der CPU-Leckstrom wird aus eFuse oder OTP gelesen. Aus einer bestimmten Tabelle wird der zugehörige Spannungsselektor ermittelt. Anschließend wird in jedem OPP die Eigenschaft „opp-microvolt-&lt;selector&gt;“ gesucht; sie enthält dessen Zielspannung.

Konfiguration: Zunächst ist der zugehörige Code für eFuse oder OTP hinzuzufügen; Details stehen in deren Dokumentation. Ergänzen Sie dann die drei Eigenschaften „rockchip,leak-voltage- sel“, „nvmem-cells“ und „nvmem-cell-names“ im OPP-Table-Knoten. Fügen Sie zugleich nach den tatsächlichen Gegebenheiten „opp-microvolt-&lt;name&gt;“ im OPP-Knoten hinzu. Diese Einstellungen stehen normalerweise in der DTSI-Datei. Beispiel RK3328:

```text
cpu0_opp_table: cpu0-opp-table {
   compatible = "operating-points-v2";

   opp-shared;

   /*
   * Get CPU leakage from eFuse or OTP
   */
   nvmem-cells = <&cpu_leakage>;
   nvmem-cell-names = "cpu_leakage";

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

   opp-408000000 {
      opp-hz = /bits/ 64 <408000000>;

      opp-microvolt = <950000 950000 1350000>;
      opp-microvolt-L0 = <950000 950000 1350000>;
      opp-microvolt-L1 = <950000 950000 1350000>;
      clock-latency-ns = <40000>;
      opp-suspend;
   };
   ...
   opp-1296000000 {
      opp-hz = /bits/ 64 <1296000000>;
      opp-microvolt = <1350000 1350000 1350000>;
      opp-microvolt-L0 = <1350000 1350000 1350000>;
      opp-microvolt-L1 = <1300000 1300000 1350000>;
      clock-latency-ns = <40000>;

   };
};
```

Zum Abschalten entfernen Sie „rockchip,leak-voltage-sel“. OPP verwendet dann die in „opp-microvolt“ angegebene Spannung.

Redaktioneller Hinweis: Die Quellerklärung verwendet rockchip,leak-voltage-sel, während der Code und das chinesische Original rockchip,leakage-voltage-sel verwenden. Dieser Unterschied bleibt zur Nachvollziehbarkeit erhalten.

### 3.6 OPP-Tabelle nach PVTM anpassen

CPU PVTM (Process-Voltage-Temperature Monitor) ist ein Modul in CPU-Nähe, das Leistungsunterschiede zwischen Chips abbilden kann. Es wird durch Fertigungsprozess, Spannung und Temperatur beeinflusst.

#### 3.6.1 Spannung nach PVTM anpassen

Hintergrund: Die Tests der Quelle zeigen ein höheres Vmin bei Chips mit kleinem PVTM-Wert als bei Chips mit großem PVTM-Wert. Bei letzteren kann die Spannung gesenkt werden, um Energieverbrauch und Leistung zu verbessern.

Funktionsweise: Der PVTM-Wert wird bei vorgegebener Spannung und Frequenz ermittelt und auf die Referenztemperatur umgerechnet. Eine bestimmte Tabelle liefert den zugehörigen Spannungsselektor. Anschließend wird in jedem OPP die Eigenschaft „opp-microvolt-&lt;selector&gt;“ gesucht, die dessen Zielspannung angibt.

Konfiguration: Ergänzen Sie zunächst den PVTM-Code gemäß PVTM-Dokumentation. Fügen Sie dann „rockchip,pvtm-voltage-sel“, „rockchip,thermal-zone“ und „rockchip,pvtm-&lt;name&gt;“ zum OPP-Table-Knoten hinzu. Bei verschiedenen Fertigungsprozessen kommen „nvmem-cells“ und „nvmem-cell-names“ hinzu. Ergänzen Sie im OPP-Knoten entsprechend den Gegebenheiten „opp-microvolt-&lt;name&gt;“. Dies erfolgt normalerweise in der DTSI-Datei. Beispiel RK3288:

```text
cpu0_opp_table: opp_table0 {
   compatible = "operating-points-v2";
   opp-shared;


   ...
   /*
   * Get CPU process infomation from eFuese or OTP
   * If only contains one process, you should do nothing with process_version.
   * If contains more than one's, need to adding below
   */
   nvmem-cells = <&process_version>;
   nvmem-cell-names = "process";

   /*
   * IF only one process，please add property "rockchip,pvtm-voltage-sel" to OPP

Table
   * node, and add "opp-microvolt-L0","opp-microvolt-L1" to OPP node for
distinguish
   * voltage.
   * If more than one process: for example process0 and process1, if this 2
process
   * configuration different with each other, please add "rockchip,p0-pvtm-
voltage-
   * sel","rockchip,p1-pvtm-voltage-sel" to OPP Table and add "opp-microvolt-
P0-L0",
   * "opp-microvolt-P1-L0" to OPP node for distinguish voltage
   * If this 2 process are the same process configuration, adding
"rockchip,pvtm-

   * voltage-sel" is eghough.
   *
   * If PVTM value is between 0 and 14300, OPP will use the voltage specified
by "opp-
   * microvolt-L0"
   * If PVTM value is between 14301 and 15000, OPP will use the voltage
specified by
   * "opp-microvolt-L1"
   * If PVTM value is between 15001 and 16000, OPP will use the voltage
specified by
   * "opp-microvolt-L2"
   * If PVTM value is between 15001 and 16000, OPP will use the voltage

specified by
   * "opp-microvolt-L3"
   *
   * If deleted "rockchip,pvtm-voltage-sel" or PVTM value exceeds the range of
the
   * table, OPP will use the voltage specified by "opp-microvolt".
   */
   rockchip,pvtm-voltage-sel = <
      0     14300 0
      14301 15000 1
      15001 16000 2

      16001 99999 3
   >;
   /* Before get PVTM value, chang CPU frequency to 408000Khz */
   rockchip,pvtm-freq = <408000>;
   /* Before get PVTM value, change CPU voltage to 1000000uV */
   rockchip,pvtm-volt = <1000000>;
   /* PVTM channel, format <channel sel> */
   rockchip,pvtm-ch = <0 0>;
   rockchip,pvtm-sample-time = <1000>; /* PVTM sampling time, unit is us */
   rockchip,pvtm-number = <10>; /* PVTM sampling number */
   rockchip,pvtm-error = <1000>; /* error can be afford between sampling
data */

   rockchip,pvtm-ref-temp = <35>; /* refrence temperature */
   /*
   * Proportional coefficient of temperature, when below reference temperature
use the
   * first coefficient, when higher use the second one
   */
   rockchip,pvtm-temp-prop = <(-18) (-18)>;
   rockchip,thermal-zone = "soc-thermal"; /* get temperature from soc-thermal
*/

   opp-126000000 {
      opp-hz = /bits/ 64 <126000000>;
      opp-microvolt = <950000 950000 1350000>;

      opp-microvolt-L0 = <950000 950000 1350000>;
      opp-microvolt-L1 = <950000 950000 1350000>;
      opp-microvolt-L2 = <950000 950000 1350000>;
      opp-microvolt-L3 = <950000 950000 1350000>;
      clock-latency-ns = <40000>;
   };
   ...
   opp-1608000000 {
      opp-hz = /bits/ 64 <1608000000>;
      opp-microvolt = <1350000 1350000 1350000>;
      opp-microvolt-L0 = <1350000 1350000 1350000>;
      opp-microvolt-L1 = <1350000 1350000 1350000>;

      opp-microvolt-L2 = <1300000 1300000 1350000>;
      opp-microvolt-L3 = <1250000 1250000 1350000>;
      clock-latency-ns = <40000>;
   };
};
```

Zum Abschalten entfernen Sie „rockchip,pvtm-voltage-sel“. OPP verwendet dann die in „opp-microvolt“ angegebene Spannung.

### 3.7 OPP-Tabelle nach IR-Drop anpassen

IR-Drop bezeichnet einen Spannungsabfall oder -anstieg in Versorgungs- und Massenetzen integrierter Schaltungen. Hier wird darunter die durch Versorgungswelligkeit und Platinenlayout verursachte Spannungsschwankung verstanden.

Hintergrund: Bei manchen Kundenlösungen wurde eine ungünstige Spannungswelligkeit festgestellt. Wird dieselbe OPP-Tabelle wie beim EVB verwendet, kann die Spannung bei manchen Frequenzen zu niedrig sein und die Systemstabilität beeinträchtigen. Dann muss die OPP-Tabelle an den IR-Drop angepasst werden.

Funktionsweise: Die Differenz zwischen der Spannungswelligkeit des EVB und der Prototypplatine bei jeder Frequenz ist die Spannung, die für diese Frequenz zusätzlich benötigt wird.

Konfiguration: Ergänzen Sie „rockchip,max-volt“, „rockchip,evb-irdrop“ und „rockchip,board-irdrop“ im OPP-Table-Knoten. „rockchip,board-irdrop“ wird üblicherweise in der Board-DTS-Datei eingestellt, die übrigen Eigenschaften in der DTSI-Datei.

Beispiel RK3326; die DTSI-Konfiguration lautet:

```text
cpu0_opp_table: cpu0-opp-table {
   compatible = "operating-points-v2";

   opp-shared;

   rockchip,max-volt = <1350000>; /* the highest voltage, unit is uV */
   rockchip,evb-irdrop = <25000>; /* ripple voltage of EVB or SDK */
}
```

Die Board-DTS wird wie folgt konfiguriert:

```text
&cpu0_opp_table {
   /*
   * max IR-drop values on different freq condition for this board!

   */
   /*
   * ripple voltage at diffrent frequencies
   * If frequency is between 0MHz-815MHz, ripple voltage is 37500uV, the target
   * voltage will add 12500uV(37500-25000(EVB ripple voltage))
   * If frequency is between 816Mhz-1119MHz, ripple voltage is 50000uV, the
target
   * voltage will add 25000uV(50000-25000(EVB ripple voltage))
   * If frequency is between 816Mhz-1119MHz, ripple voltage is 50000uV, the
target
   * voltage will add 50000uV(75000-25000(EVB ripple voltage))
   */

   rockchip,board-irdrop = <
   /*MHz MHz  uV */
      0    815   37500
      816  1119  50000
      1200 1512  75000
   >;
};
```

Zum Abschalten entfernen Sie „rockchip,board-irdrop“.

### 3.8 Erweiterten Temperaturbereich konfigurieren

Ein erweiterter Temperaturbereich bezeichnet üblicherweise eine Umgebungstemperatur von −40℃ bis +85℃.

Hintergrund: Manche Plattformen sind bei niedriger Temperatur instabil und laufen nach einer Spannungserhöhung an bestimmten Frequenzen stabil. Hier muss die Spannung temperaturabhängig angepasst werden. Hohe Temperatur bei hoher Spannung verkürzt zudem die Chiplebensdauer; deshalb müssen auch Frequenz und Spannung temperaturabhängig begrenzt werden.

Funktionsweise: Erkennt das System eine Temperatur unter einem bestimmten Wert, erhöht es die Spannung jeder Frequenz. Übersteigt die Spannung an einem Frequenzpunkt die vom System zugelassene Höchstspannung, wird dieser Frequenzpunkt gesperrt und nicht verwendet. Bei Rückkehr zur Normaltemperatur werden die Standardspannungen wiederhergestellt. Oberhalb einer bestimmten Temperatur werden Frequenzen begrenzt, deren Spannung einen vorgegebenen Wert überschreitet. Bei Normaltemperatur wird die Frequenzbegrenzung aufgehoben.

Konfiguration: Für niedrige Temperaturen ergänzen Sie „rockchip,temp-hysteresis“, „rockchip,low-temp“, „rockchip,low-temp-min-volt“, „rockchip,low-temp-adjust-volt“ und „rockchip,max-volt“ im OPP-Table-Knoten. Für hohe Temperaturen ergänzen Sie „rockchip,temp-hysteresis“, „rockchip,high-temp“ und „rockchip,high-temp-max-volt“. Diese Konfiguration steht üblicherweise in der DTSI-Datei.

```text
cpu0_opp_table: opp_table0 {
   compatible = "operating-points-v2";

   opp-shared;

   /*
   * Hysteresis parameter, unit is millicelusius, prevent from entry into low
   * temperatures or high temperatures frequently
   * For example, when temperature less than 0 Celsius degrees, work on the low
   * temperature state, higher than 5 Celsius degrees, return to normal state.
   * Temperature is higher than 85 Celsius degrees work on the high temperature
state,
   * less than 80 Celsius degrees to return to normal state.
   */
   rockchip,temp-hysteresis = <5000>;
   rockchip,low-temp = <0>; /* Threshold for low temperature, millicelsius*/

   rockchip,low-temp-min-volt = <900000>; /* Minimum voltage at low
temperature, uV */
   /* In lower temperature state, add 25mV to frequency at 0-1800MHz */
   rockchip,low-temp-adjust-volt = <
      /* MHz MHz  uV */
        0    1800 25000
   >;
   /* highest voltage, unit is uV */
   rockchip,max-volt = <1250000>;

   rockchip,high-temp = <85000>; /* Threshold for high temperature,
millicelsius */

   /*
   * the highest voltage at high temperature state, if value exceeds which, the
   * frequency will be ristricted
   */
   rockchip,high-temp-max-volt = <1200000>;
   ...

}
```

## 4. Benutzerschnittstellen

Bei Plattformen ohne big.LITTLE wie RK3288, RK3326 und RK3328 teilen sich alle Kerne einen Takt und dieselbe Benutzerschnittstelle „/sys/devices/system/cpu/cpufreq/policy0/“.

big.LITTLE-Plattformen wie RK3368 und RK3399 enthalten zwei Cluster mit jeweils eigenem Takt und eigener Schnittstelle. Beispielsweise umfasst cluster0 die kleinen Kerne mit der Schnittstelle unter „/sys/devices/system/cpu/cpufreq/policy0/“; cluster1 umfasst die großen Kerne unter „/sys/devices/system/cpu/cpufreq/policy4/“.

Über diese Schnittstellen lassen sich unter anderem Governor und Frequenz ändern sowie die aktuelle Frequenz abfragen:

```text
related_cpus          /* All CPUs at the same cluster*/
affected_cpus         /* All online CPUs at the same cluster */
cpuinfo_transition_latency /* the transition time of two frequencies, unit is

ns */
cpuinfo_max_freq      /* the maximun operated frequency */
cpuinfo_min_freq      /* the minimun operated frequency */
cpuinfo_cur_freq      /* current frequency get from hardware */
scaling_available_frequencies /* available frequencies */
scaling_available_governors /* available cpufreq governors */
scaling_governor      /* current cpufreq governor */
scaling_cur_freq      /* the last frequency set by software*/
scaling_max_freq      /* the maximum frequency restricted on software*/
scaling_min_freq      /* the minimum frequency restricted on software*/
scaling_setspeed      /* used to change frequency when governor is
userspace */
stats/time_in_state   /* record work time at each frequency, unit is 10ms

*/
stats/total_trans     /* record frequency scaling times */
stats/trans_table     /* record frequency scaling times of each frequency
*/
```

## 5. Häufige Fragen

### 5.1 Höchstfrequenz verschiedener Plattformen

| Chipsatz | ARM-Kerne | Höchstfrequenz |
| --- | --- | --- |
| RK312x | 4 * A7 | 1200MHz |
| RK322x | 4 * A7 | 1464MHz |
| RK3288 | 4 * A17 | 1608MHz |
| RK3328 | 4 * A53 | 1296MHz |
| RK3368 | 4 * A53 + 4 * A53 | 1512MHz(big) + 1200MHz(little) |
| RK3399 | 2 * A72 + 4 * A53 | 1800MHz(big) + 1416MHz(little) |

### 5.2 OPP-Tabelle prüfen

Geben Sie folgenden Befehl ein:

```text
cat /sys/kernel/debug/opp/opp_summary
```

Beispiel PX30:

```text
 device          rate(Hz) target(uV) min(uV) max(uV)
-------------------------------------------------------------------
 cpu0

                408000000  950000   950000  1350000
                600000000  950000   950000  1350000
                816000000  1000000 1000000  1350000
               1008000000  1125000 1125000  1350000
               1200000000  1275000 1275000  1350000
               1248000000  1300000 1300000  1350000
               1296000000  1350000 1350000  1350000
               1416000000  1350000 1350000  1350000
               1512000000  1350000 1350000  1350000
```

### 5.3 OPP-Spannung ändern

Methode 1: Jede OPP-Spannung direkt ändern.

Beispielsweise 25000uV für 816MHz hinzufügen. Ausgangskonfiguration:

```text
opp-816000000 {
   opp-hz = /bits/ 64 <816000000>;

   opp-microvolt = <1075000 1075000 1350000>;
   opp-microvolt-L0 = <1075000 1075000 1350000>;
   opp-microvolt-L1 = <1050000 1050000 1350000>;
   opp-microvolt-L2 = <1000000 1000000 1350000>;
   opp-microvolt-L3 = <950000 950000 1350000>;
   clock-latency-ns = <40000>;
   opp-suspend;
};
```

Nach der Änderung:

```text
opp-816000000 {
   opp-hz = /bits/ 64 <816000000>;
   /* Unit is uV, format <target min max>, add 25000000 to target and min,

   * max is the highest voltage, don't change it.
   */
   opp-microvolt = <1100000 1100000 1350000>;
   opp-microvolt-L0 = <1100000 1100000 1350000>;
   opp-microvolt-L1 = <107500 1075000 1350000>;
   opp-microvolt-L2 = <1025000 1025000 1350000>;
   opp-microvolt-L3 = <975000 975000 1350000>;
   clock-latency-ns = <40000>;
   opp-suspend;
};
```

Methode 2: Die Spannung über die IR-Drop-Konfiguration ändern; siehe Abschnitt 3.7.

Beispielsweise die Spannung unterhalb einer CPU-Frequenz von 408MHz um 25000uV erhöhen. Beispiel der ursprünglichen IR-Drop-Einstellung:

```text
&cpu0_opp_table {
   /*

   * max IR-drop values on different freq condition for this board!
   */
   /*
   * ripple voltage at diffrent frequencies
   * 0Mhz-815MHz，ripple voltage is 37500uV，the target voltage will increase by
   * 12500uV（37500-25000(EVB ripple voltage))
   * 816Mhz-1119MHz，ripple voltage is 50000uV，the target voltage will increase
by
   * 12500uV（50000-25000(EVB ripple voltage))
   * 1200Mhz-1512MHz，ripple voltage is 75000uV，the target voltage will
increase by
   * 50000uV (75000-25000(EVB ripple voltage))
   */

   rockchip,board-irdrop = <
   /*MHz MHz  uV */
      0    815   37500
      816  1119  50000
      1200 1512  75000
   >;
};
```

Nach der Änderung:

```text
&cpu0_opp_table {
   /*
   * max IR-drop values on different freq condition for this board!

   */
   /*
   * ripple voltage at diffrent frequencies
   * 0Mhz-408Mhz,ripple voltage is 62500uV, the target voltage will increase by
   * 37500uV(62500-25000(EVB ripple voltage)
   * 409Mhz-815MHz，ripple voltage is 37500uV，the target voltage will increase
by
   * 12500uV(37500-25000(EVB ripple voltage))
   * 816Mhz-1119MHz，ripple voltage is 50000uV，the target voltage will increase
by

   * 12500uV(50000-25000(EVB ripple voltage))
   * 1200Mhz-1512MHz，ripple voltage is 75000uV，the target voltage will
increase by
   * 50000uV((75000-25000(EVB ripple voltage))
   */
   rockchip,board-irdrop = <
   /*MHz MHz  uV */
      0    408   62500 /* from 37500 to 62500 */
      409  815   37500
      816  1119  50000
      1200 1512  75000
   >;

};
```

### 5.4 Frequenz fest einstellen

Methode 1: Den Governor in menuconfig auf userspace setzen und die CPU-Frequenz im cru-Knoten des Device Tree einstellen.

Methode 2: Nicht benötigte OPPs in der OPP-Tabelle deaktivieren und nur die benötigten beibehalten. Beispiel RK3308 mit fester CPU-Frequenz von 1008Mhz:

```text
cpu0_opp_table: cpu0-opp-table {
      compatible = "operating-points-v2";
      opp-shared;


      opp-408000000 {
         opp-hz = /bits/ 64 <408000000>;
         opp-microvolt = <950000 950000 1340000>;
         clock-latency-ns = <40000>;
         opp-suspend;
         status = "disabled";
      };
      opp-600000000 {
         opp-hz = /bits/ 64 <600000000>;
         opp-microvolt = <950000 950000 1340000>;
         clock-latency-ns = <40000>;

         status = "disabled";
      };
      opp-816000000 {
         opp-hz = /bits/ 64 <816000000>;
         opp-microvolt = <1025000 1025000 1340000>;
         clock-latency-ns = <40000>;
         status = "disabled";
      };
      opp-1008000000 {
         opp-hz = /bits/ 64 <1008000000>;
         opp-microvolt = <1125000 1125000 1340000>;
         clock-latency-ns = <40000>;
      };
   opp-1200000000 {
      opp-hz = /bits/ 64 <1200000000>;
      opp-microvolt = <1250000 1250000 1340000>;

      clock-latency-ns = <40000>;
      status = "disabled";
   };
   opp-1296000000 {
      opp-hz = /bits/ 64 <1296000000>;
      opp-microvolt = <1300000 1300000 1340000>;
      clock-latency-ns = <40000>;
      status = "disabled";
   };
};
```

Methode 3: Befehle zur Laufzeit auf dem Gerät ausführen:

Für Chipsätze ohne big.LITTLE wie RK3288 lauten die Befehle:

```text
/* set governor to userspace */
echo userspace > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor

/* set frequency to 216MHz */
echo 216000 > /sys/devices/system/cpu/cpufreq/policy0/scaling_setspeed
```

Für big.LITTLE-Chipsätze wie RK3399 lauten die Befehle:

```text
/* set LITTLE core governor to userspace */
echo userspace > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
/* set LITTLE core frequency to 216Mhz */

echo 216000 > /sys/devices/system/cpu/cpufreq/policy0/scaling_setspeed

/* set big core governor to userspace */
echo userspace > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor
/* set big core frequceny to 408Mhz */
echo 408000 > /sys/devices/system/cpu/cpufreq/policy4/scaling_setspeed
```

Hinweis: Das Einstellen der CPU-Frequenz über den cpufreq-Knoten ändert üblicherweise zugleich die Spannung, außer beide Frequenzen verwenden dieselbe Spannung.

### 5.5 Aktuelle Frequenz abfragen

Die cpufreq-Benutzerschnittstelle und die debugfs-Schnittstelle des Takts ermöglichen die Frequenzabfrage.

Für Chipsätze ohne big.LITTLE lauten die Befehle:

```text
/* Method 1: cpufreq userspace interface */
cat /sys/devices/system/cpu/cpufreq/policy0/scaling_cur_freq


/* Method 2: clock debug interface */
cat /sys/kernel/debug/clk/armclk/clk_rate
```

Für big.LITTLE-Chipsätze lauten die Befehle:

```text
/* Method 1: cpufreq userspace interface */
cat /sys/devices/system/cpu/cpufreq/policy0/scaling_cur_freq /* LITTLE core
frequency */

cat /sys/devices/system/cpu/cpufreq/policy4/scaling_cur_freq /* big core
frequency */

/* Method 2: clock debug interface*/
cat /sys/kernel/debug/clk/armclkl/clk_rate /* LITTLE core frequency*/
cat /sys/kernel/debug/clk/armclkb/clk_rate /* big core frequency */
```

### 5.6 Aktuelle Spannung abfragen

Für Chipsätze ohne big.LITTLE lauten die Befehle:

```text
/* here vdd_core is not the fixing name, please modify */
cat /sys/kernel/debug/regulator/vdd_core/voltage
```

Für big.LITTLE-Chipsätze lauten die Befehle:

```text
/* here vdd_core_l and vdd_core_b are not the fixing name, please modify */
cat /sys/kernel/debug/regulator/vdd_core_l/voltage /* LITTLE core voltage*/

cat /sys/kernel/debug/regulator/vdd_core_b/voltage /* big core voltage*/
```

### 5.7 Spannung und Frequenz getrennt einstellen

Setzen Sie den cpufreq-Governor auf userspace; siehe Methode 3 in Abschnitt 5.4.

Stellen Sie die Frequenz über die debugfs-Taktschnittstelle wie folgt ein:

```text
/* For non big.LITTLE core chipset,like RK3288, set frequency to 216MHz */
echo 216000000 > /sys/kernel/debug/clk/armclk/clk_rate /* set frequency */

cat /sys/kernel/debug/clk/armclkl/clk_rate /* get frequency */

/*
 * For big.LITTLE core chipset, such as RK3399, set LITTLE core frequncy to
216MHz, set
 * big core frequency to 408MHz
 */
echo 216000000 > /sys/kernel/debug/clk/armclkl/clk_rate /* set LITTLE core
frequency */
cat /sys/kernel/debug/clk/armclkl/clk_rate /* get LITTLE core
frequency*/
echo 408000000 > /sys/kernel/debug/clk/armclkb/clk_rate /* set big core frequency
*/

cat /sys/kernel/debug/clk/armclkb/clk_rate /* get big core
frequency*/
```

Stellen Sie die Spannung über die debugfs-Regulator-Schnittstelle wie folgt ein:

```text
/*
 * For non big.LITTLE core chipset,like RK3288, set voltage to 950mV
 * vdd_core is not the fixed name, please modify according to the actual

regulator
 * configuration
 */
echo 950000 > /sys/kernel/debug/regulator/vdd_core/voltage /* set voltage */
cat /sys/kernel/debug/regulator/vdd_core/voltage /* get voltage */

/*
 * For big.LITTLE core chipset, such as RK3399, LITTLE core set to 950mV, big
core set
 * to 1000mV
 * vdd_core_l and vdd_core_b are not the fixed name, please modify according to
the

 * actual regulator configuration
 */
/* set LITTLE core voltage */
echo 950000 > /sys/kernel/debug/regulator/vdd_core_l/voltage
/* get LITTLE core voltage */
cat /sys/kernel/debug/regulator/vdd_core_l/voltage
echo 950000 > /sys/kernel/debug/regulator/vdd_core_b/voltage /* set big core
voltage */
cat /sys/kernel/debug/regulator/vdd_core_b/voltage /* get big core
voltage */
```

Hinweis: Erhöhen Sie vor einer Frequenzanhebung zuerst die Spannung. Beim Absenken reduzieren Sie zuerst die Frequenz und danach die Spannung.

### 5.8 OPP-Spannung prüfen

Wenn die Spannungsanpassung anhand von PVTM unterstützt wird, geben Sie folgenden Befehl ein:

```text
dmesg | grep pvtm
```

Am Beispiel RK3399 ergibt sich folgende Ausgabe:

```text
[  0.669456] cpu cpu0: temp=22222, pvtm=138792 (140977 + -2185)
/* pvtm-volt-sel=0, opp-microvolt-L0 property will be used in little cpu OPP
table */

[  0.670601] cpu cpu0: pvtm-volt-sel=0
[  0.683008] cpu cpu4: temp=22222, pvtm=148761 (150110 + -1349)
/* pvtm-volt-sel=1, opp-microvolt-L1 property will be used in big cpu OPP table
*/
[  0.683109] cpu cpu4: pvtm-volt-sel=1
[  1.495247] rockchip-dmc dmc: Failed to get pvtm
[  3.366028] mali ff9a0000.gpu: temp=22777, pvtm=120824 (121698 + -874)
[  3.366915] mali ff9a0000.gpu: pvtm-volt-sel=0
```

Wird entsprechend eine Anpassung nach Leckstrom unterstützt, führt der folgende Befehl zu einer ähnlichen Ausgabe.

```text
dmesg | grep leakage
```

### 5.9 Aktuellen Leckstrom prüfen

Geben Sie folgenden Befehl ein:

```text
dmesg | grep leakage
```

Am Beispiel der RK3399-CPU ergibt sich folgende Ausgabe:

```text
[  0.656175] cpu cpu0: leakage=10 /* leakage=10，little cpu leakage is 10mA */
[  0.671092] cpu cpu4: leakage=20 /* leakage=20，big cpu leakage is 20mA */
[  1.492769] rockchip-dmc dmc: Failed to get leakage

[  3.341084] mali ff9a0000.gpu: leakage=15
```

{% endraw %}
