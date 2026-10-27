---
title: "Rockchip Linux: Lasttests und Optimierung der Leistungsaufnahme"
description: "Rockchip Linux: Lasttests und Optimierung der Leistungsaufnahme — RK3399, Buildroot / Debian 9, RK-SM-YF-385 V1.0.1"
excerpt: "Rockchip Linux: Lasttests und Optimierung der Leistungsaufnahme"
translation_key: "199-rockchip-linux-power-load-test"
slug: "199-rockchip-linux-power-load-test"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK3399", "Linux", "Power"]
---

{% raw %}

# Rockchip Linux: Lasttests und Optimierung der Leistungsaufnahme

Plattformreferenz für ArmSoM. Die Quelle RK-SM-YF-385 V1.0.1 beschreibt Leistungsmessung, erste Fehleranalyse und Optimierung des RK3399 mit Buildroot / Debian 9, um Systemleistung, angemessene Leistungsaufnahme und Sicherheit abzustimmen. Kernel, genaue SDK/BSP-Version und validierte ArmSoM-Platine sind nicht angegeben. Schaltplan, Versorgung, Display, Treiber und SDK vor der Anwendung prüfen. Die Messwerte stammen vom Hersteller, nicht aus ArmSoM-Tests; es erfolgte keine Hardwarevalidierung.

Es liegt nur die chinesische Quelle vor. Englisch, Russisch und Deutsch sind vollständige Übersetzungen; alle drei Abbildungen stammen unverändert aus der chinesischen Quelle. Englische Originalabbildungen liegen nicht vor. Die beiden Rastertabellen sind zusätzlich editierbar rekonstruiert. Unterstützungsstand laut Quelle:

| Chip | Buildroot | Debian 9 |
| --- | --- | --- |
| RK3399 | Y | Y |

## 1. Leistungsaufnahme nach Systemszenario

RK3399-Testbedingungen: CPU 4xA53+2xA72 mit bis zu 1.8GHz, DDR bis zu 856MHz, GPU bis zu 800MHz. Es folgen Messungen für ruhenden Desktop, Videowiedergabe, Stresstest und Tiefschlaf unter Buildroot / Debian 9 Linux.

### 1.1 Szenariomessungen unter Buildroot

![Buildroot: Originalmesstabelle (chinesische Quelle)](/docs/rockchip-linux-power-load-test/assets/cn-p4-1.png)

Buildroot: Originalmesstabelle (chinesische Quelle)

`RK_IND_EVB_RK3399_LP4D200P232SD8_V11_20190905` · `Sample:41810` · `693 Sample/S` · `00:01:00`

| Testszenario | VCC_SOC (mW) | VCC12V_DCIN (V) | VCC12V_DCIN (mA) | VDD_CPU_B (V) | VDD_CPU_B (mA) | VDD_GPU (V) | VDD_GPU (mA) | VDD_LOG (V) | VDD_LOG (mA) | VDD_CENTER (V) | VDD_CENTER (mA) | VDD_CPU_L (V) | VDD_CPU_L (mA) | VCC_DDR (V) | VCC_DDR (mA) | VCC3V3_SYS (V) | VCC3V3_SYS (mA) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ruhender Desktop (mit Display) | 1982.4726 | 11.932 | 907.6 | 0.856 | 16.5 | 0.862 | 60.5 | 0.96 | 276 | 0.924 | 531.7 | 0.832 | 18.5 | 1.088 | 58.1 | 3.26 | 331.7 |
| Ruhender Desktop (ohne Display) | 1876.9895 | 12.02 | 708.9 | 0.853 | 14.8 | 0.86 | 57.5 | 0.963 | 227.6 | 0.921 | 496.8 | 0.829 | 10.2 | 1.091 | 57.2 | 3.259 | 327.5 |
| 1080p Transformers 3 | 2340.035 | 11.89 | 997.5 | 0.857 | 20.7 | 0.862 | 187.4 | 0.959 | 297.1 | 0.929 | 739.1 | 0.841 | 54.3 | 1.08 | 58.8 | 3.261 | 331.2 |
| 4K@30fps Birds | 2392.5669 | 11.881 | 1019.6 | 0.858 | 20.5 | 0.863 | 137.6 | 0.959 | 304.9 | 0.932 | 815.8 | 0.845 | 68.4 | 1.078 | 58.8 | 3.26 | 332 |
| Glmark2-Test | 2410.0431 | 11.887 | 1007.9 | 0.860 | 67.3 | 0.887 | 225.4 | 0.953 | 351 | 0.926 | 593.7 | 0.834 | 47.8 | 1.08 | 58.4 | 3.257 | 357.7 |
| Stresstest | 4126.4532 | 11.736 | 1340 | 0.912 | 764.9 | 1.081 | 191.1 | 0.948 | 438.4 | 0.935 | 818.7 | 1.125 | 763.1 | 1.063 | 60.7 | 3.26 | 336.1 |
| Tiefschlaftest | 120.5585 | 12.325 | 22.1 | 0 | 0 | 0 | 0 | 0.979 | 35.1 | 0 | 0 | 0 | 0 | 1.093 | 53.6 | 3.287 | 8.4 |

Die Quellenauswertung nennt folgende Werte (Originalrundung beibehalten, nicht aus der Tabelle neu berechnet):

| Szenario | Symbol | Leistungsaufnahme |
| --- | --- | --- |
| Display | Pd | 2.3W |
| Desktop gesamt | Pui | 10.8W |
| 1080P-Video gesamt | Pl | 11.86W |
| 4K@30fps-Video gesamt | Pb | 12.1W |
| Glmark2 gesamt | Pg | 11.98W |
| Stresstest gesamt | Ps | 15.72W |
| Desktop SoC | Psui | 1.88W |
| 1080P-Video SoC | Psl | 2.34W |
| 4K-Video SoC | Psb | 2.39W |
| Glmark2 SoC | Psg | 2.41W |
| Stresstest SoC | Pss | 4.13W |
| Tiefschlaf SoC | Ps2 | 120.5mW |

### 1.2 Szenariomessungen unter Debian 9

![Debian 9: Originalmesstabelle (chinesische Quelle)](/docs/rockchip-linux-power-load-test/assets/cn-p4-2.png)

Debian 9: Originalmesstabelle (chinesische Quelle)

`RK_IND_EVB_RK3399_LP4D200P232SD8_V11_20190905` · `Sample:41810` · `693 Sample/S` · `00:01:00`

| Testszenario | VCC_SOC (mW) | VCC12V_DCIN (V) | VCC12V_DCIN (mA) | VDD_CPU_B (V) | VDD_CPU_B (mA) | VDD_GPU (V) | VDD_GPU (mA) | VDD_LOG (V) | VDD_LOG (mA) | VDD_CENTER (V) | VDD_CENTER (mA) | VDD_CPU_L (V) | VDD_CPU_L (mA) | VCC_DDR (V) | VCC_DDR (mA) | VCC3V3_SYS (V) | VCC3V3_SYS (mA) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ruhender Desktop (mit Display) | 1966.9842 | 11.927 | 909.3 | 0.856 | 15 | 0.866 | 52.3 | 0.961 | 270.7 | 0.924 | 525.7 | 0.833 | 14 | 1.088 | 59.2 | 3.261 | 333.3 |
| Ruhender Desktop (ohne Display) | 1894.8035 | 12.021 | 700.9 | 0.853 | 17 | 0.863 | 55.6 | 0.963 | 228.7 | 0.921 | 499.8 | 0.83 | 15.1 | 1.09 | 57.9 | 3.259 | 330.2 |
| 1080p Transformers 3 | 2231.3292 | 11.907 | 959.9 | 0.857 | 18.3 | 0.864 | 61.1 | 0.952 | 356.5 | 0.927 | 701.5 | 0.832 | 25.6 | 1.085 | 58.4 | 3.26 | 333.9 |
| 4K@30fps Birds | 2381.1659 | 11.887 | 1006.8 | 0.857 | 25.8 | 0.864 | 66 | 0.951 | 366.7 | 0.931 | 815.8 | 0.836 | 32.7 | 1.078 | 58.4 | 3.259 | 338.6 |
| Glmark2-Test | 2342.1851 | 11.887 | 1006.8 | 0.866 | 84.7 | 0.954 | 231 | 0.953 | 351.2 | 0.926 | 591.4 | 0.833 | 19.6 | 1.083 | 58.7 | 3.26 | 333.2 |
| Stresstest | 4057.176 | 11.729 | 1360 | 1.01 | 805.7 | 0.867 | 147.5 | 0.948 | 445.5 | 0.938 | 814.4 | 1.123 | 683.5 | 1.057 | 60 | 3.261 | 336.8 |
| Tiefschlaftest | 111.6261 | 12.325 | 20.9 | 0 | 0 | 0 | 0 | 0.979 | 32.3 | 0 | 0 | 0 | 0 | 1.094 | 53.3 | 3.287 | 6.6 |

Die Quellenauswertung nennt folgende Werte (Originalrundung beibehalten, nicht aus der Tabelle neu berechnet):

| Szenario | Symbol | Leistungsaufnahme |
| --- | --- | --- |
| Display | Pd | 2.4W |
| Desktop gesamt | Pui | 10.84W |
| 1080P-Video gesamt | Pl | 11.43W |
| 4K@30fps-Video gesamt | Pb | 11.96W |
| Glmark2 gesamt | Pg | 11.97W |
| Stresstest gesamt | Ps | 15.95W |
| Desktop SoC | Psui | 1.89W |
| 1080P-Video SoC | Psl | 2.23W |
| 4K-Video SoC | Psb | 2.38W |
| Glmark2 SoC | Psg | 2.34W |
| Stresstest SoC | Pss | 4.06W |
| Tiefschlaf SoC | Ps2 | 111.6mW |

## 2. Optimierung der Systemleistungsaufnahme

### 2.1 Erste Diagnoseschritte

#### 2.1.1 Gesamtleistungsaufnahme vergleichen

Zuerst die Gesamtleistungsaufnahme desselben Szenarios anhand der vorherigen Daten vergleichen. Weicht die Kundenplatine deutlich von der Rockchip-SDK-Platine ab, die Aufnahme weiter aufschlüsseln. Abgesehen von Hardwareunterschieden müssen die Bedingungen gleich sein: etwa dieselbe 1080P/4K-Videodatei verwenden sowie eDP-Bildschirm und HDMI-Anzeige entfernen.

#### 2.1.2 Leistungsaufnahme nach Versorgungszweigen aufschlüsseln

Den Power Tree des Projekts verstehen. Die Abbildung zeigt die RK3399-Excavator-Platine. Aus dem Schaltplan den Versorgungsbaum ableiten, einen Widerstand in den jeweiligen Zweig einschleifen (die Quelle empfiehlt allgemein 20mR) und den Strom messen. Aufgeteilt werden VCC3V3_SYS, VDD_CPU_B, VDD_CPU_L, VDD_GPU, VDD_LOG, VDD_0V9, VDD_CENTER, VCC_DDR und VCC_1V8. Zuerst Aufnahme und Frequenzregelung der großen/kleinen CPU-Kerne, GPU und DDR vergleichen. Bei Spannungserhöhung prüfen, ob der Schritt ein ganzzahliges Vielfaches von 12.5mv ist. Bei korrekter Regelstrategie weitere Peripherie vergleichen.

![RK3399-Excavator-Versorgungsbaum (chinesische Quelle)](/docs/rockchip-linux-power-load-test/assets/cn-p5-1.png)

RK3399-Excavator-Versorgungsbaum (chinesische Quelle)

#### 2.1.3 Takte prüfen

Taktfrequenz, enable_count, prepare_count und Eltern-Kind-Beziehungen der Subsysteme prüfen. Die saradc-Beispiele behalten Quellkommentare bei:

```text
# 获取总的Clock状态：
cat /sys/kernel/debug//clk/clk_summary
# 设置频率（单位 HZ）：
echo 24000000 > /sys/kernel/debug/clk_saradc/clk_rate
# 获取频率：
cat /sys/kernel/debug/clk_saradc/clk_rate
# 打开 clock：
echo 1 > /sys/kernel/debug/clk_saradc/clk_enable_count
# 关闭 clock：
echo 0 > /sys/kernel/debug/clk_saradc/clk_enable_count
```

enable_count steigt um 1, wenn ein Treiber den Takt mit clk_enable explizit einschaltet. Bei standardmäßig ständig aktiven Takten kann der Wert 1 oder 0 sein; diese stehen nicht im Vordergrund. Bei ungenutzten Geräten CLK enable_cnt=0 prüfen. Andernfalls empfiehlt die Quelle manuelles Abschalten zur Diagnose; vorher Auswirkungen auf aktive Hardware ausschließen.

#### 2.1.4 Power Domains (PD) prüfen

Den Zustand aller PD prüfen. Ungenutzte Module müssen suspend sein; erst wenn sämtliche Geräte eines PD suspend sind, schaltet dieser ab. Die seitenübergreifende Originalausgabe ist hier zusammengeführt:

```text
# cat /sys/kernel/debug/pm_genpd/pm_genpd_summary
domain status slaves
/device runtime status
----------------------------------------------------------------------
pd_vopl on
/devices/platform/ff8f3f00.iommu active
/devices/platform/ff8f0000.vop active
pd_vopb off
/devices/platform/ff903f00.iommu suspended
/devices/platform/ff900000.vop suspended
pd_vo on pd_vopb, pd_vopl
pd_tcpc1 on
/devices/platform/ff800000.phy active
pd_tcpc0 on
/devices/platform/ff7c0000.phy active
pd_isp1 on
/devices/platform/ff924000.iommu active
/devices/platform/ff920000.rkisp1 suspended
pd_isp0 on
/devices/platform/ff914000.iommu active
/devices/platform/ff910000.rkisp1 suspended
pd_hdcp on
/devices/platform/ff940000.hdmi active
```

DTS-Konfiguration am Beispiel vopb:

```text
vopb: vop@ff900000 {
    power-domains = <&power RK3399_PD_VOPB>;
};
```

Ohne PD-Verweis im DTS-Knoten betrachtet das Framework den Bereich als ungenutzt und schaltet ihn nach dem Start ab. Besteht der Verweis, fehlen aber runtime-Operationen im vop-Treiber, wird das Gerät unsupported und der PD bleibt eingeschaltet. Mit Verweis und runtime-Operationen steuert der Treiber den Zustand. PD summary und Taktbaum prüfen und PD/CLK ungenutzter Module abschalten, um Leckströme interner MOS-Transistoren zu vermeiden.

### 2.2 Erste Optimierungsschritte

#### 2.2.1 Standardhelligkeit der Hintergrundbeleuchtung ändern

```text
[root@rk3399:/]# cat /sys/class/backlight/backlight/brightness
200
```

Der Standardbereich ist 0–255; größere Werte erhöhen die Helligkeit. Zunächst 100 einstellen und je nach Einsatz weiter reduzieren.

```text
echo 100 > /sys/class/backlight/backlight/brightness
```

#### 2.2.2 Bildwiederholrate senken

Liegt die tatsächliche GPU-Bildrate im Einsatz unter 30fps, lässt sich die DSI-Bildwiederholrate anpassen. Der folgende Quell-diff ist unvollständig; das Knotenende fehlt bereits in der Quelle, daher nicht als vollständige DTS verwenden.

```text
native-mode= <&mipi_1280x800>;
mipi_1280x800: mipi-1280x800 {
-clock-frequency = <76000000>;
+ clock-frequency = <60000000>;//45fps
hactive = <800>;
vactive = <1280>;
hsync-len = <10>;
```

#### 2.2.3 ISP deaktivieren

Ungenutzte Module in DTS deaktivieren. Bei einer USB-Kamera empfiehlt die Quelle das Abschalten des ISP:

```text
+&isp0{
+    status = "disabled";
+};
+
+&isp1 {
+    status = "disabled";
+};
+
+&isp0_mmu {
+    status = "disabled";
+};
+
+&isp1_mmu {
+    status = "disabled";
+};
```

#### 2.2.4 Frequenzregelstrategie ändern

```text
--- a/arch/arm64/boot/dts/rockchip/rk3399-opp.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399-opp.dtsi
@@ -50,6 +50,8 @@
rockchip,temp-hysteresis = <5000>;
rockchip,low-temp = <10000>;
rockchip,low-temp-min-volt = <900000>;
+ rockchip,high-temp = <45000>;
+ rockchip,high-temp-max-volt = <1000000>;
nvmem-cells = <&cpul_leakage>, <&specification_serial_number>;
nvmem-cell-names = "cpu_leakage",
@@ -141,6 +143,8 @@
rockchip,temp-hysteresis = <5000>;
rockchip,low-temp = <10000>;
rockchip,low-temp-min-volt = <900000>;
+ rockchip,high-temp = <45000>;
+ rockchip,high-temp-max-volt = <1025000>;
nvmem-cells = <&cpub_leakage>, <&specification_serial_number>;
nvmem-cell-names = "cpu_leakage",
```

#### 2.2.5 target load anpassen

Der Standardwert für load ist 90. Lediglich der PDF-Zeilenumbruch innerhalb des cat-Befehls wurde zusammengeführt:

```text
[root@rk3399:/sys/devices/system/cpu/cpufreq/policy4/interactive]# cat target_loads
90
```

Die Quelle schlägt folgende Werte vor. Das Beispiel zeigt weiterhin eine cat-Ausgabe, keinen Schreibbefehl; cat ist keine Einstelloperation:

```text
[root@rk3399:/sys/devices/system/cpu/cpufreq/policy4/interactive]# cat target_loads
65 1008000:70 1200000:75 1416000:80 1608000:90
```

## Redaktionelle Hinweise und Anpassung

Die Quellschreibweisen `20mR` und `12.5mv` bleiben erhalten; üblicherweise bedeuten sie Milliohm und Millivolt, sind aber anhand von Schaltplan und PMIC zu prüfen. Der doppelte Schrägstrich in `/sys/kernel/debug//clk/clk_summary` und die originalen `clk_saradc`-Pfade bleiben erhalten; mit dem debugfs des tatsächlichen Kernels abgleichen. SoC-Leistung, gesamte Eingangsleistung und Messbedingungen ohne Display unterscheiden sich und dürfen nicht vermischt werden. Rundungen im Fließtext wurden nicht durch Tabellenrechnungen ersetzt. Die Temperatur-/Spannungseinstellungen in 2.2.4 sind keine allgemeingültigen sicheren Werte für jedes SDK.

Offizielle Referenzen: [Rockchip](https://www.rock-chips.com/); [ArmSoM-Dokumentation](https://docs.armsom.org/).

{% endraw %}
