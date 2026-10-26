---
title: "Vollständiger RK818/RK816-Ladezustandsleitfaden: Laden, DTS, Kalibrierung und Fehlersuche"
description: "Vollständiger RK818/RK816-Ladezustandsleitfaden: Laden, DTS, Kalibrierung und Fehlersuche — V2.2.0"
excerpt: "Vollständiger RK818/RK816-Ladezustandsleitfaden: Laden, DTS, Kalibrierung und Fehlersuche — V2.2.0"
translation_key: 125-rockchip-rk818-rk816-fuel-gauge
slug: 125-rockchip-rk818-rk816-fuel-gauge
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, PMIC, DTS, battery]
---

{% raw %}

# Vollständiger RK818/RK816-Ladezustandsleitfaden: Laden, DTS, Kalibrierung und Fehlersuche

Chinesische Quelle V2.2.0; Kernelbereich 3.10 / 4.4 / 4.19. Der technische Vorwortumfang umfasst Modulkonzepte, Funktionen, Konfiguration und Fehlersuche. Kein englisches PDF liegt vor: Alle vier Sprachen basieren vollständig auf der chinesischen Quelle und nutzen vorhandene technische Originalbilder daraus. Nur ArmSoM-Plattformreferenz: PMIC, SoC, SDK/BSP, Kernel, Versorgungsbaum und Akkuspezifikation der konkreten Platine prüfen. Keine Hardwaretests oder pauschale Platinenunterstützung.

> Code, Parameter und Logs sind Herstellerbeispiele, keine ArmSoM-Messungen. Änderungen an Versorgung, Ladestrom, Spannung oder Temperaturregelung können Abschaltung, Schäden oder Akkurisiken verursachen. Beispiele nicht ungeprüft übernehmen; thermischen Schutz im Normalbetrieb niemals deaktivieren. Quellenwidersprüche bleiben ohne erratene Konstanten erhalten; siehe Prüfnotizen. Die Quelle enthält verbundene OCV-Werte 38163836/39714002, compatible ohne Semikolon/mit typografischen Anführungszeichen sowie 21IRQ_TYPE_LEVEL_LOW. Weitere Widersprüche: bat_res in Ohm bei 120, NTC-Anzahl/Bereich, design_qmax 4100 gegenüber ×1.1 und Richtungsregel parameter3 bei temperature_chrg_table. Als Quelle erhalten, keine kompilierbare oder sichere Konfiguration.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Übersicht RK818/RK816 Ladezustandsmessung

RK818/RK816 ist ein leistungsfähiger PMIC mit mehreren Hochstrom-DCDCs und LDOs, einem linearen Schalter, einem USB-5V- und Boost-Ausgang, Schaltladung, intelligenter Versorgungspfadverwaltung, Coulomb-Zähler, RTC und einstellbarer Einschaltsequenz. Dieses Dokument behandelt Schaltladung, Versorgungspfade und Ladezustandsmessung (Coulomb-Zähler).

1. Ladeverwaltung umfasst Eingangsstrombegrenzung, Erhaltungsladung, Konstantstrom-/Konstantspannungsladung, Ladeabschluss und Schutz bei Ladezeitüberschreitung.

2. Die intelligente Versorgungspfadverwaltung regelt die Ausgangsspannung für die Systemlast und lädt zugleich den Akku. Bei Eingangsstrombegrenzung erhält das System zuerst Leistung; nur der Rest lädt den Akku. Übersteigt der Systembedarf die begrenzte Eingangsleistung oder entfällt die Versorgung, schließt automatisch der Akku-System-Schalter, sodass der Akku zusätzliche Leistung liefert.

3. Die Ladezustandsmessung (Coulomb-Zähler) nutzt den patentierten Herstelleralgorithmus und akkuspezifische Lade-/Entladekurven, misst die Ladung und meldet sie per I2C an den Systemchip. Hinzu kommen Niedrigstromladung tiefentladener Akkus, Akkutemperaturerkennung, Ladesicherheitstimer und thermischer Chipschutz.

## 2. Grundlagen der Ladezustandsmessung

1. Drei Grundprinzipien:

(1) Die Leerlaufspannungs-/Ladezustandskurve (OCV-SOC) hängt vor allem von Akkumaterial und Fertigung ab. Laut Quelle beeinflussen Temperatur und Alterung sie wenig; die SOC-OCV-Kurve bleibt nach der Herstellung im Wesentlichen unverändert.

(2) Polarisation im Betrieb erschwert die Ableitung der OCV aus der Klemmenspannung. Brauchbare OCV erhält man nur bei unpolarisiertem Akku, etwa nach langem Abschalten oder längerem Niedrigstrombetrieb; daraus lässt sich SOC bestimmen.

(3) Ein Coulomb-Zähler misst zu- und abfließende Ladung. Bei bekannter Gesamtkapazität lässt sich SOC einfach berechnen; der kumulierte Fehler ist jedoch groß, und die Kapazität ändert sich mit Temperatur und Alterung. Gute Genauigkeit besteht deshalb nur kurzfristig; die Gesamtkapazität muss regelmäßig aktualisiert werden.

Gute Ladezustandsmesser verbinden OCV-Schätzung und Coulomb-Zählung für die aktuelle Restkapazität.

2. Coulomb-Zählung

Ein Strommesswiderstand wird an den Batterieanschlüssen in Reihe geschaltet. Strom erzeugt V_delta, woraus der Akkustrom berechnet wird. Die Quelle nennt eine Ladungsverfolgung mit bis zu 1% Genauigkeit. Die Einbeziehung von Spannung und Temperatur vermindert Alterungs- und andere Einflüsse erheblich.

3. Stromsignalaufbereitung

Der Strom wird mit 20 oder 10 Milliohm gemessen. Ein Konstantstromquellen-Offset verschiebt negative Signale ins Positive; ein Operationsverstärker verstärkt in den Vref-Bereich, danach digitalisiert ein ADC.

4. Spannungserfassung

Ein Teiler mit Verhältnis 0.5 bringt die Akkuspannung in den Vref-Bereich; anschließend liefert der ADC einen Digitalwert.

5. Erfassung des mittleren Stroms

Der Digitalteil addiert den korrigierten Strom 256-mal pro Sekunde in einen mehrstelligen Akkumulator. Am Sekundenende ergibt die Division durch 256 den Mittelstrom.

6. Aktualisierung des Coulomb-Zählers

Bei jeder Mittelstromaktualisierung wird automatisch einmal akkumuliert.

## 3. Wichtige Konzepte

**OCV-Spannung:** Leerlaufspannung. Der PMIC misst während der Einschaltsequenz bei sehr kleiner, annähernd leerlaufartiger Last; die Quelle betrachtet diesen Wert als genau. Nach mindestens 30 Minuten Abschaltung gilt die Polarisation als weitgehend abgeklungen. OCV wird dann in ocv_table nachgeschlagen, um die Ladung zu aktualisieren und den Coulomb-Zähler zu korrigieren.

**ocv_table:** Jeder Akku hat eine eigene Kennlinie. 0%–100% Ladung wird in 21 Punkte mit 5%-Schritten geteilt und jeweils einer OCV zugeordnet. Diese Spannung-Ladung-Tabelle korrigiert beim ersten Start nach Akkuanschluss, nach langem Abschalten und nach langem Schlaf. Beispiel:

```text
ocv_table = <3400 3599 3671 3701 3728 3746 3762  ......  4088 4132 4183>;
```

Zuordnung: 3400mv → 0%, 3599mv → 5%, 3671mv → 10%, …, 4183mv → 100%.

**Maximaler Eingangs- und Ladestrom:** Der softwareseitig erlaubte Adapterstrom heißt maximaler Eingangsstrom; für 5V/2A werden meist 2A oder z.B. 1.8A eingestellt. RK818/816 versorgt zunächst das System und lädt mit dem Rest. Der maximal erlaubte Reststrom in den Akku heißt maximaler Ladestrom.

**Eingangsstrombegrenzung:** System- und Akkubedarf übersteigen den maximalen Eingangsstrom; die Versorgung reicht nicht aus. Anders gesagt kann der Akku unter seinen Bedingungen nicht mit maximalem Ladestrom geladen werden. Dies ist eines von drei Ladeabschlusskriterien neben Abschlussspannung und -strom.

**Relax-Modus:** Bei sehr geringer Last (derzeit nur Standby der zweiten Stufe) und Laststrom unter einem Schwellwert über eine einstellbare Zeit tritt die Messung in den annähernden Leerlaufmodus ein.

**Relax-Spannung:** Alle 8 Minuten wird darin ein Spannungssatz erfasst. Wegen der kleinen Last gilt er näherungsweise als OCV. Beim Aufwachen korrigiert der Treiber unter bestimmten Bedingungen damit und mit ocv_table den Coulomb-Zähler.

**finish:** Beim Ladeabschluss erzeugt ein Register das Statussignal finish. Erst danach erkennt die Software den echten Hardware-Ladeabschluss an und startet den entsprechenden Algorithmus zur Anzeigeanpassung.

**Thermischer Chipschutz:**

Dies ist eine PMIC-Schutzrückkopplung. Oberhalb der eingestellten Temperatur reduziert die Hardware schrittweise den Eingangsstrom und damit Last und Wärme. Software greift nicht ein; ein festes Temperatur-Strom-Verhältnis gibt es nicht. Extrembedingungen können das Laden stoppen.

**Ladeabschlussbedingungen:** Strom und Spannung erreichen ihre Abschlusswerte, und keine Eingangsbegrenzung liegt vor. Das Abschlusssignal entsteht, die Ladung stoppt, der Akku gilt als voll. Die Begrenzungsprüfung unterscheidet tatsächlich sinkenden Ladestrom von geringer Ladung wegen hoher Systemlast.

## 4. Treiber und menuconfig

### 4.1 Funktionen des Ladezustandstreibers

1. Akkuladung erfassen und anzeigen.

2. Ladestrom/-spannung nach Akku und Ladegerättyp einstellen; ein/zwei Ladeanschlüsse unterstützen.

3. OTG-Geräte mit 5V versorgen.

4. Akkutemperatur erfassen.

### 4.2 Kernel 3.10

RK818-Treiber und Konfigurationssymbole:

```text
CONFIG_BATTERY_RK818
drivers/power/rk818_battery.c           // 负责处理电量显⽰ + 充电器检测、充电电压、电流设置
```

RK816-Treiber und Konfigurationssymbole:

```text
CONFIG_BATTERY_RK816
drivers/power/rk816_battery.c           // 负责处理电量显⽰ + 充电器检测、充电电压、电流设置
```

### 4.3 Kernel 4.4

RK818-Treiber und Konfigurationssymbole (wegen des großen Funktionsumfangs in zwei Treiber aufgeteilt):

```text
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
drivers/power/rk818_battery.c           // 负责处理电量显⽰
drivers/power/rk818_charger.c           // 负责处理充电器检测、充电电压、电流设置
```

RK816-Treiber und Konfigurationssymbole:

```text
CONFIG_BATTERY_RK816
drivers/power/rk816_battery.c           // 负责处理电量显⽰ + 充电器检测、充电电压、电流设置
```

### 4.4 Kernel 4.19

RK818-Treiber und Konfigurationssymbole:

```text
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
drivers/power/supply/rk818_battery.c    // 负责处理电量显⽰
drivers/power/supply/rk818_charger.c    // 负责处理充电器检测、充电电压、电流设置
```

RK816-Treiber und Konfigurationssymbole:

```text
CONFIG_BATTERY_RK816
drivers/power/supply/rk816_battery.c    // 负责处理电量显⽰ + 充电器检测、充电电压、电流设置
```

## 5. DTS-Konfiguration

### 5.1 Kernel 3.10

RK816- und RK818-Knoten sind bis auf einzelne Eigenschaften weitgehend identisch. Das folgende vollständige RK818-battery-Beispiel steht innerhalb des RK818-Knotens. ntc_table, ntc_degree_from, dc_det_gpio und dc_det_adc sind optional, die übrigen erforderlich.

```text
battery {
    compatible = "rk818-battery"  // 如果是rk816，则改成"rk816-battery"
    ocv_table = <3400 3599 3671 3701 3728 3746 3762
                 3772 3781 3792 38163836 3866 3910
                 3942 39714002 4050 4088 4132 4183>;
    ntc_table = <43662 41676 39793 38005 36308 34696 33164
                 31709 30326 29011 27760 26570 25438 24361
                 23335 22358 21427 20540 19695 18890 18121
                 17389 16690 16022  14778 14197 13642 13113
                 12606 12122 11659 11216 10793 10388 10000
                 9629 9273 8933 8607 8295>;
    ntc_degree_from = <1 10>;
    design_capacity = <4000>;
    design_qmax = <4100>;
    bat_res = <120>;
    max_input_current = <2000>;
    max_chrg_current = <1800>;
    max_chrg_voltage = <4200>;
    sleep_enter_current = <300>;
    sleep_exit_current = <300>;
    sleep_filter_current = <100>;   // rk818不需要这个属性
    power_off_thresd = <3400>;
    zero_algorithm_vol = <3850>;
    energy_mode = <0>;
    fb_temperature = <105>;
    max_soc_offset = <60>;
    monitor_sec = <5>;
    virtual_power = <0>;
    power_dc2otg = <1>;
    dc_det_gpio = <&gpio0 GPIO_C1 GPIO_ACTIVE_LOW>;
    dc_det_adc = <1>;   // rk818不需要这个属性，rk816才可能需要
};
```

### 5.2 Kernel 4.4

RK818-DTS-Konfiguration

1. battery: erforderlich. Der folgende vollständige Knoten steht innerhalb RK818; battery- und charger-Untertreiber nutzen seine Daten. ntc_table, ntc_degree_from, temperature_chrg_table und dc_det_gpio sind optional, die übrigen erforderlich.

```text
battery {
    compatible = “rk818-battery”
    ocv_table = <3400 3599 3671 3701 3728 3746 3762
                3772 3781 3792 38163836 3866 3910
                3942 39714002 4050 4088 4132 4183>;
    ntc_table = <43662 41676 39793 38005 36308 34696 33164
                 31709 30326 29011 27760 26570 25438 24361
                 23335 22358 21427 20540 19695 18890 18121
                 17389 16690 16022  14778 14197 13642 13113
                 12606 12122 11659 11216 10793 10388 10000
                 9629 9273 8933 8607 8295>;
    ntc_degree_from = <1 10>;
    temperature_chrg_table = <0 10 1000 1>, <0 20 1200 2>, <1 30 1400 5>, <0 40
700 3>;
    design_capacity = <4000>;
    design_qmax = <4100>;
    bat_res = <120>;
    max_input_current = <2000>;
    max_chrg_current = <1800>;
    max_chrg_voltage = <4200>;
    sleep_enter_current = <300>;
    sleep_exit_current = <300>;
    power_off_thresd = <3400>;
    zero_algorithm_vol = <3850>;
    energy_mode = <0>;
    fb_temperature = <105>;
    sample_res = <10>;
    max_soc_offset = <60>;
    monitor_sec = <5>;
    virtual_power = <0>;
    power_dc2otg = <1>;
    dc_det_gpio = <&gpio0 GPIO_C1 GPIO_ACTIVE_LOW>;
};
```

2. charger: optional. Ohne Type-C-Laden entfällt diese Konfiguration. Mit Type-C unter dem RK818-Wurzelknoten `extcon = <&fusbn>` ergänzen; n=0,1,… richtet sich nach der Hardware. rk818_charger.c registriert darüber die Type-C-Benachrichtigungskette zur Ladegerättyp-Erkennung. Beispiel:

```text
rk818: pmic@1c {
    compatible= "rockchip,rk818";
    status= "okay";
    reg= <0x1c>;
    clock-output-names= "xin32k", "wifibt_32kin";
    interrupt-parent= <&gpio1>;
    interrupts = <21IRQ_TYPE_LEVEL_LOW>;
    pinctrl-names= "default";
    pinctrl-0= <&pmic_int_l>;
    rockchip,system-power-controller;
    rk818,support_dc_chg= <1>;/*1: dc chg; 0:usb chg*/
    wakeup-source;
    extcon = <&fusb0>;      // 重要！！！
    #clock-cells= <1>;

    battery {
            ...........
            ...........
    };
};
```

RK816-DTS: siehe RK818 oben. Unterschied: RK816 benötigt nur battery, keine charger-Konfiguration.

### 5.3 Kernel 4.19

Siehe Konfiguration für Kernel 4.4.

### 5.4 DTS-Parameterbeschreibungen

Die folgenden Beschreibungen gelten versionsübergreifend; unterstützte Eigenschaften stehen in den jeweiligen Kernel-DTS-Beispielen.

**ocv_table:** Leerlaufspannung-Ladung-Tabelle mit 21 Spannungen für 0%–100% in 5%-Schritten. Sie kann vom Akkuhersteller stammen oder bei Rockchip Shenzhen gemessen werden; zuständige Ingenieure konsultieren.

**ntc_table:**

NTC-Widerstandstabelle des Akkus in Ohm. Zur Temperaturmessung ausfüllen; jeder Wert entspricht einer Temperatur, von links nach rechts in 1°C-Schritten. Ohne Temperaturmessung die Eigenschaft entfernen. Das Beispiel umfasst -10°C bis 30°C.

**ntc_degree_from / ntc_degree_from_v2:** Starttemperatur von ntc_table[0] in °C, zusammen mit ntc_table angeben.

- Kernel 3.10/4.4: ntc_degree_from mit zwei Feldern, Vorzeichen (1 negativ, 0 positiv) und Betrag. Quellenbeispiele `ntc_degree_from = <1, 10>` bedeuten -10°C, `<0, 10>` bedeuten 10°C.
- Kernel 4.19: ein Feld ntc_degree_from_v2; `ntc_degree_from_v2 = <(-10)>` bedeutet -10°C, `<10>` bedeutet 10°C.

**temperature_chrg_table / temperature_chrg_table_v2:** eine oder mehrere Temperatur-/Ladestromgruppen. Außerhalb gelten max_input_current und max_chrg_current. Bei Nichtnutzung entfernen. Die Funktion kam später hinzu; prüfen, ob der tatsächliche Treiber die Eigenschaft auswertet.

Kernel 4.4 nutzt temperature_chrg_table, nur RK818. Format: `temperature_chrg_table = <parameter1 parameter2 parameter3 parameter4>, ...`. parameter1: Vorzeichen (1 negativ, 0 positiv); parameter2: Temperaturbetrag; parameter3: Ladestrom; parameter4: Temperaturabweichung. Laut Quelle erweitert positiver parameter3 nach oben, negativer nach unten (siehe Quellenwiderspruch). Beispiel `temperature_chrg_table = <0 10 1000 2>, <1 30 1400 5>;`: `<0 10 1000 2>` bedeutet [10, 12] bei 1000mA; `<1 30 1400 5>` bedeutet [-35, -30] bei 1400mA.

Kernel 4.19 nutzt temperature_chrg_table_v2 für RK818/RK816. Format `<parameter1 parameter2 parameter3>`: Untergrenze, Obergrenze, Ladestrom. Beispiel `temperature_chrg_table_v2 = <(-40) 10 850>, <22 33 1000>, <40 55 1400>;`: [-40, 10] → 850mA; [22, 33] → 1000mA; [40, 55] → 1400mA.

**design_capacity:** gemessene nutzbare Akkukapazität. Bei nominell 4000mah, aber gemessen 3850mah, 3850 eintragen.

**design_qmax:** Maximalkapazität, als Software-Fehlerkorrekturbedingung verwendet. Nennkapazität ×1.1 eintragen.

**bat_res:** Akkuinnenwiderstand; die Quelle nennt Ohm. Wichtig für den Entladealgorithmus, zusammen mit ocv_table messen und nicht auslassen.

**max_input_current:** maximaler Eingangsstrom, folgende Stufen (mA):

```text
RK818: <450, 80, 850, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000>
RK816: <450, 80, 850, 1000, 1250, 1500, 1750, 2000>
```

Die zweite Stufe ist 80, nicht 800! Im normalen Betrieb wird 80mA gewöhnlich nicht gewählt.

**max_chrg_current:** maximaler Ladestrom, Stufen (mA):

```text
RK818: <1000, 1200, 1400, 1600, 1800, 2000, 2250, 2400, 2600, 2800, 3000>
RK816: <1000, 1200, 1400, 1600, 1800, 2000, 2250, 2400>
```

**max_chrg_voltage:** maximale Ladespannung, zugleich Volllade-Abschlussspannung. Stufen (mV):

```text
RK818: <4050, 4100, 4150, 4200, 4250, 4300, 4350>
RK816: <4050, 4100, 4150, 4200, 4250, 4300, 4350>
```

**sleep_enter_current:** Relax-Eintrittsbedingung; derzeit 300, unverändert lassen.

**sleep_exit_current:** Austrittsbedingung; derzeit 300, unverändert lassen.

**sleep_filter_current:** ungültigen Relax-Strom filtern; derzeit 100, unverändert lassen.

**power_off_thresd — sorgfältig lesen:** gewünschte Abschaltspannung in mV. Gemeint ist momentanes VSYS, nicht vbat, obwohl die Messung vbat erfasst! Zwischen vbat und System-VSYS liegen ein MOS-Transistor mit etwa 50 Milliohm und Leiterbahnwiderstände. Deshalb ist VSYS der Abschaltbezug. Bei gleichem vbat senkt höherer Laststrom VSYS; bei gleichem VSYS erfordert höherer Strom höheres vbat. Rockchip empfiehlt nicht unter 3.4v VSYS, da nachgeschaltetes VCC_IO instabil werden kann (normalerweise 3.3v). Beträgt die höchste nachgeschaltete VSYS-Schiene hardwareseitig 3.0v, darf die Abschaltung unter 3.4v liegen.

**zero_algorithm_vol:** mV-Schwelle für den kombinierten Spannungs-/Coulomb-Entladealgorithmus; darunter werden beide genutzt. Quellenempfehlung: 3850mv für 4.2v-Akkus, 3950mv für Akkus ab 4.3v.

**energy_mode:**

Manche Nutzer bevorzugen eine glatte Kurve, andere vollständige Entladung; beides ist schwer auszubalancieren. 1 bevorzugt vollständige Ladungsnutzung, 0 die Kurvenglätte (z.B. kann bei 3.4v-Sollabschaltung gelegentlich bei 3.5v abgeschaltet werden). Der Treiber gleicht beides bereits ab; empfohlen wird 0. Ist die Abschaltschwelle im Test unakzeptabel, 1 versuchen oder den Treiberbetreuer zur Optimierung kontaktieren.

**fb_temperature:** thermische Chipschutzschwelle, vier Stufen (°C):

```text
< 85, 95, 105, 115>
```

Die Quelle wählt 115 für VR, sonst 105. 0 deaktiviert die thermische Rückkopplung und wird nur zur Fehlereingrenzung erwähnt (Quellenverweis „1.5 Häufige Probleme“). Im Normalbetrieb darf sie niemals deaktiviert werden.

**sample_res — sorgfältig lesen:** batterieseitiger Messwiderstand in Milliohm. Darüber bestimmt der Coulomb-Zähler den Strom; tatsächlichen Bestückungswert angeben. Unterstützt werden nur 20mR (Standard) und 10mR (Treiberunterstützung nötig). RK818/RK816 unter Kernel 4.4/4.19 unterstützen beide; Kernel 3.10 benötigt diese Commits:

```text
fdc31b1 power: rk818-battery: support different ohm sample resistor
0f23c4b power: rk816-battery: support different ohm sample resistor
```

Üblich sind 20mR. Mit 10mR verdoppelt sich der Bereich von max_chrg_current:

```text
// rk816
10mR: [2000, 2400, 2800, 3200, 3600, 4000, 4500, 4800]
20mR: [1000, 1200, 1400, 1600, 1800, 2000, 2250, 2400]
// rk818
10mR: [2000, 2400, 2800, 3200, 3600, 4000, 4500, 4800, 5200, 5600, 6000]
20mR: [1000, 1200, 1400, 1600, 1800, 2000, 2250, 2400, 2600, 2800, 3000]
```

Auch bei verdoppeltem Bereich max_chrg_current nach dem tatsächlichen Bedarf setzen: für 4000mA also 4000. 10mR verdoppelt den Ladestrombereich, aber auch den Strom-/Ladungsmessfehler (mAh). Die verdoppelten Ströme sind theoretisch; manche sind wegen der Leistungswandlung nicht erreichbar. Bei 5V/2A:

```text
5V * 2A = U_bat * I_bat
```

Bei minimalem U_bat=3.4v beträgt maximales I_bat 2.94A, nur ohne Verluste und bei vollständiger Zuweisung an den Akku. Tatsächlich hat das System Vorrang; auch Akkusättigung ist zu beachten.

**max_soc_offset:**

Maximal erlaubte Ladungsabweichung bei Startkorrektur. Nach mindestens 30 Minuten Auszeit wird OCV abgefragt und mit dem letzten Abschaltwert verglichen. Übersteigt die Differenz max_soc_offset, wird die Anzeige auf den OCV-Wert gezwungen: beispielsweise von 20% direkt auf 80%. Große Abweichungen folgen oft auf Abstürze. Nach Akzeptanz wählen; unter 60 wird nicht empfohlen.

**monitor_sec:** Abfrageintervall in Sekunden. Die Messung braucht ständiges Polling mit vielen I2C-Zugriffen; wegen unterschiedlicher I2C-Robustheit ist es einstellbar. Empfohlen 5–10s, optimal 5s.

**virtual_power:** Testmodus mit künstlichem Akku. Akkulose Geräte können 5V/2A nutzen; die Messung integriert jedoch Strom über Zeit statt nur Spannung. Trotz konstant 5V kann die Anzeige auf 0% fallen. Bei Belastungstests vermeidet der Modus Abschaltung/Versorgungsprobleme durch Ladungs- oder Stromgrenzen. 1 hebt Ladestromgrenzen auf und hält den Eingang auf max_input_current; Android erhält stets „ladend, 66%“.

**power_dc2otg:** OTG-5v direkt aus DC erlauben. Unterstützende Zweianschlusshardware versorgt OTG aus DC statt zusätzlich aus RK818. 1 bei Unterstützung, sonst 0, auch ohne DC-Anschluss.

**dc_det_gpio:** GPIO des DC-Erkennungspins; bei Nichtnutzung entfernen.

**dc_det_adc:** DC-Erkennung über SARADC, 1 ein, 0 aus. Üblicherweise alternativ zu dc_det_gpio; nur bei RK816.

### 5.5 Wichtige Hinweise

**Akkuladung lässt sich nicht vollständig abschalten.** RK818/RK816 CHRG_CTRL_REG1[7]:CHRG_EN soll Laden ein-/ausschalten, die Hardwarefunktion ist jedoch fehlerhaft und nicht normal nutzbar. Niemals 0 konfigurieren; unzureichende Versorgung kann Instabilität verursachen. Quellen-Workarounds: RK818 — Eingang auf 80mA begrenzen, um Laden zu minimieren, ohne vollständige Lösung; RK816 — 80mA oder BAT_CTRL_REG[6]:USB_SYS_EN=0, wodurch der Adaptereingang vollständig abgeschaltet wird.

Kernelversionen nutzen unterschiedliche DTS-Eigenschaften: ntc_degree_from, ntc_degree_from_v2, temperature_chrg_table, temperature_chrg_table_v2.

Temperatur-/Stromstrategie (nur mit Unterstützung von temperature_chrg_table_v2):

1. Mit ntc_table begrenzt eine Akkutemperatur außerhalb der Grenzen den Eingang auf 80mA. CHRG_EN kann Laden nicht abschalten; es wird nur minimiert.

2. Mit temperature_chrg_table oder temperature_chrg_table_v2 wird Ladestrom bereichsabhängig gesetzt. Unterhalb der kleinsten PMIC-Stufe wird stattdessen der maximale Eingangsstrom begrenzt. Außerhalb begrenzter Bereiche gelten max_input_current, max_chrg_current und Adaptertyp.

3. Temperaturanforderungen unterscheiden sich; der Treiber kann angepasst werden.

## 6. Entwicklung der Ladezustandsmessung

### 6.1 Vorbereitung

1. OCV-Kurve und Innenwiderstand des jeweiligen Akkus messen; laut Quelle bietet Rockchip Shenzhen diese Messung an.

2. DTS gemäß vorigen Abschnitten ausfüllen.

3. Akku gemäß den entsprechenden Abschnitten kalibrieren.

4. Normalbetrieb beginnen.

### 6.2 Problembehandlung

1. Bei Auffälligkeiten sofort Debugging aktivieren, Ereignisprotokoll erfassen und analysieren.

2. Bei Sprüngen oder zu schnellen/langsamen Kurven einen vollständigen Lade-/Entladelog erfassen (0%–100% oder 100%–0%; möglichst großer Bereich).

3. Bei unklarer Ursache Ereignis-/Reproduktionslog in Redmine melden.

Vor der Protokollerfassung Debugausgaben der Ladezustandsmessung aktivieren! Siehe häufige Probleme.

## 7. Akkukalibrierung

### 7.1 Grundlagen der Akkukalibrierung

1. Abschalten deaktiviert DCDC/LDO, trennt aber den PMIC nicht vollständig; er bleibt bei kleinster Last versorgt. Freie Datenregister speichern Ladung, Coulomb-Zählerkapazität und Vollladekapazität (design_capacity) des letzten Abschaltens. Beim Start nutzt der Treiber diese Werte weiter statt sie aus DTS zu ersetzen.

2. Zur Korrektur dieser drei Werte muss der PMIC vollständig stromlos werden. Beim nächsten Einschalten wird GGSTS_REG[4] („erstes Einschalten“) gesetzt. Dies wird durch Abtrennen des Akkus erreicht.

3. Nach Wiederanschluss erkennt der Treiber das erste Einschalten, lädt die DTS-Daten neu und berechnet Kapazität/Ladung für den kalibrierten Zustand.

4. Vor Wiederanschluss muss die Polarisation weitgehend abgeklungen sein; Akku nötigenfalls ruhen lassen. Nach Trennung unter hoher Entladelast erholt sich die Spannung langsam. Sofortiger Wiederanschluss liefert falsche OCV. Für genaue Start-OCV und Ladung ist weitgehende Depolarisation erforderlich.

### 7.2 Akkukalibriermethoden

Eine von zwei Methoden wählen. Hardware: Akku etwa 10s trennen und wieder anschließen. Software: folgende Schritte über die serielle Konsole.

1. bat-Knoten suchen: `busybox find /sys/ -name bat`, z.B. `/sys/rk818/bat`. Für RK816 überall `/sys/rk816/bat` verwenden.

2. Ausführen: `echo m > /sys/rk818/bat`.

3. Rücklesen: `echo r > /sys/rk818/bat`; BIT(4) muss 1 sein (RK816: BIT(1)=1).

4. Normal abschalten und mindestens 30 Minuten vor Neustart warten, damit OCV genau ist. Schritt 2 zurücknehmen: `echo c > /sys/rk818/bat`.

### 7.3 Wann kalibriert werden muss

1. Bei Änderung der DTS-Akkukapazität.

2. Bei offensichtlich falscher Ladung, etwa nach Abstürzen oder speziellen, nicht auf den Ladungsmesser bezogenen Belastungstests.

3. Einmal vor der gesamten Belastungstestserie der Ladezustandsmessung, damit der Ausgangszustand korrekt ist; nicht vor jedem Fall.

## 8. Analyse häufiger Probleme

1. Debug aktivieren und Logs erfassen? Vor dem Kompilieren in der ersten Treiberzeile `static int dbg_enable = 0` auf 1 ändern. Alternativ zur Laufzeit seriell: einschalten `echo 1 > /sys/module/rk818_battery/parameters/dbg_level`; ausschalten `echo 0 > /sys/module/rk818_battery/parameters/dbg_level`. Für RK816 `/sys/module/rk816_battery/parameters/dbg_level`.

2. Warum startet das System mit Adapter/USB nach Abschalten sofort neu? Der PMIC ist so ausgelegt, dass er mit angeschlossenem Ladegerät nicht ausgeschaltet bleibt.

3. Warum stimmt GGSTS[4] nach Akku-Hotplug nicht mit der Anwesenheit überein? Der PMIC unterstützt keine Akku-Hotplug-Erkennung, sondern prüft einmal beim Einschalten.

4. Warum Abschaltung oberhalb des DTS-Werts? Maßgeblich ist die letzte aktuelle VSYS-Spannung im Log. Die momentane Spannung soll nicht unter den Sollwert fallen. Nach Lastabschaltung klingt die Polarisation des Lithiumakkus ab und die Spannung erholt sich; das ist eine Akkueigenschaft.

5. Warum bleibt Ladung bei Power-Cycle-, Reboot- oder Standby-Stufe-2-Tests fast gleich, während Spannung sinkt? Normales Polling ist dabei unmöglich; diese Tests werden für die Messung nicht unterstützt. Laut Quelle müssen Qualitäts-/Kundentests diese drei Fälle nicht prüfen.

6. Warum dauerhaft kleiner Ladestrom? (a) Schlechtes, hochohmiges Kabel prüfen: VBUS kann deutlich unter 5v liegen. Die Quelle schlägt ein geregeltes externes Netzteil und vorsichtige Spannungserhöhung zur Beobachtung vor. (b) Bildschirm abschalten (Standby Stufe1); steigt der Strom, besteht Zusammenhang mit Betriebsverbrauch. (c) Fast volle Akkus ziehen wenig Strom; Spannung prüfen. (d) Wärme/hohe Last kann den Eingang begrenzen. Die Quelle nennt höheres fb_temperature zur Diagnose und nötigenfalls vorübergehend fb_temperature=0. Dies ist Quellen-Fehlersuche, keine Freigabe zum Abschalten des normalen Wärmeschutzes.

7. Warum ändert sich die Ladung nach Akkuentnahme und Neustart? Lässt sich die Anzeige halten? (a) Nach vollständigem PMIC-Stromverlust bleibt nur OCV-Nachschlagen; das ist normale Neukalibrierung. (b) Fast unmöglich ohne Software-Workaround: Ladung vor Abschaltung in Datei speichern und beim Start laden. Kunden mit diesem Bedarf müssen den Code ergänzen.

8. Wie interne PMIC-Temperatur bei thermischer Stromregelung auslesen? Nicht möglich; diese Funktion ist nicht vorgesehen.

9. Warum unplausibles Vorzeichen/Betrag des Stroms? Ausreichend genauen 20/10-Milliohm-Messwiderstand und saubere Lötstellen prüfen. Er gehört zwischen BAT- und GND.

10. Warum finish vor Vollladung, etwa bei 3.9v? Meist lösen schlechte Akkuqualität und zu hoher Ladestrom den Schutz der Akkuplatine aus; der PMIC meldet fälschlich finish.

11. Warum wechselt kleiner Strom bei finish das Vorzeichen? Nullpunktfehler nach Vollladung; laut Quelle unbedenklich.

12. Warum finish bei nur über 90% Anzeige statt 100%? Coulomb-Zählung akkumuliert Fehler, während die Hardware unabhängig abschließt. Exakte Übereinstimmung ist unmöglich und die Abweichung normal. Software nähert die Anzeige unmerklich 100% an, ohne Nutzungsbeeinträchtigung.

13. Warum weicht Betriebsladung stark von ocv_table ab?

Begriffsverwechslung: ocv_table gilt im Leerlauf ohne Last und wird nur zur Start-/Schlafkorrektur genutzt. Der direkte Vergleich mit Lastbetrieb ist prinzipiell nicht sinnvoll.

14. Kann ein anders spezifizierter Akku eingesetzt werden? Nicht ohne erneute Messung und Konfiguration von OCV, Widerstand, Kapazität und weiteren Parametern.

15. Wann erkennt der PMIC Vollladung? Gleichzeitig: Abschlussspannung erreicht, finish-Strom erreicht und keine Eingangsstrombegrenzung.

16. Warum ständig 50% ladend? Treiber test_power deaktivieren.

17. Warum ständig 66% ladend? Kein Akku angeschlossen oder DTS virtual_power=1; auf 0 setzen.

18. Warum fehlen Anschluss-/Trennereignisse? (a) Kernel 4.4: rk818_charger.c erkennt Ladegeräte; USB-/OTG-Ereignisse hängen von der USB-Benachrichtigungskette ab. Nach "rk818-charger: recieve xxx notifier event: xxx" suchen. Fehlt es, könnte die Registrierung fehlgeschlagen sein (unwahrscheinlich) oder der USB-Treiber fehlerhaft sein. (b) Kernel 3.10: rk818_battery.c bearbeitet Erkennung und Ladung. Auch hier hängen USB/OTG von der Kette ab. Nach "rk818-bat: recieve xxx notifier event: xxx" suchen; fehlt es, gelten dieselben Ursachen.

{% endraw %}
