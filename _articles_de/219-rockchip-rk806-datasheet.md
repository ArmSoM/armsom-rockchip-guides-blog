---
title: "Rockchip RK806: Versorgungskanäle, Register und elektrische Grenzwerte"
description: "Rockchip RK806: Versorgungskanäle, Register und elektrische Grenzwerte — Rev1.3"
excerpt: "Rockchip RK806: Versorgungskanäle, Register und elektrische Grenzwerte"
translation_key: "219-rockchip-rk806-datasheet"
slug: "219-rockchip-rk806-datasheet"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK806","datasheet"]
---

{% raw %}

# Rockchip RK806: Versorgungskanäle, Register und elektrische Grenzwerte

Diese ArmSoM-Plattformreferenz beschreibt den RK806-IC, keine bestätigte Kompatibilität einer bestimmten Platine. RK806-Variante, Schaltplan, Versorgung und BSP prüfen. Anwendungsschaltungen und Leistungsdaten sind Rockchip-Beispiele, keine ArmSoM-Hardwaretests. SDK-/Kernelversion nicht angegeben. Quelle: englisches122-seitiges RK806-Rev1.3-PDF vom2023-10-19 (Deckblatt:Oct.2023). Alle33 Abbildungen sind einzeln zugeschnittene englische Originale. Deckblatt, Änderungshistorie und nichttechnische Rechts-/Kontakttexte entfallen; technische Bedingungen und Widersprüche bleiben erhalten.

## 1.1 Übersicht

RK806 ist eine komplexe Power-Management-IC für vollständige Versorgungslösungen mit wenigen externen Bauteilen. Zehn synchrone Abwärts-DC-DC-Wandler verwenden Ripple-Regelung für schnelle Lastsprungantwort. Ihre Ausgänge lassen sich dem Prozessorzustand dynamisch anpassen; die meisten Kanäle werden über I2C/SPI konfiguriert. Softstart senkt Einschaltstrom.2MHz und das Regelverfahren reduzieren externe Induktivität/Kapazität. Sechs LDO-Kanäle erlauben Eingänge bis hinab zu2V; fünf zusätzliche NMOS-LDOs sind integriert. Sämtliche LDO-Ausgänge sind über I2C/SPI einstellbar. OTP-basierte Ein-/Ausschaltsequenzen sind anpassbar. Zwei RK806 können als Master/Slave synchron arbeiten. Gehäuse QFN68,7.0×7.0mm, Raster0.35mm.

## 1.2 Merkmale

Eingang2.7–5.5V; Bereitschaftsstrom10uA. Alle genannten Ausgänge0.5–3.4V. Maximalströme: BUCK1 —6.5A; BUCK2/3/4 —5A; BUCK5/6/7/8/9/10 —3A, jeweils schnelle Transientenantwort. NLDO1/2/5 —300mA; NLDO3/4 —500mA; PLDO1/4 —500mA; PLDO2/3/5 —300mA; VCCIO —300mA. OTP programmiert Sequenzen/Spannung; Dual-PMIC und I2C/SPI werden unterstützt.7×7mm QFN68.

## 1.3 Blockdiagramm

![Abb.1-1 Funktionsblockdiagramm](/docs/rockchip-rk806-datasheet/images/figure-1-1.png)

Abb.1-1 Funktionsblockdiagramm — Englisches Original,Rev1.3,PDF-Seite 9.

## 1.4 Typische Anwendungen

![Einzel-RK806-Anwendung](/docs/rockchip-rk806-datasheet/images/figure-1-2.png)

Einzel-RK806-Anwendung — Englisches Original,Rev1.3,PDF-Seite 10.

![Zwei RK806,I2C](/docs/rockchip-rk806-datasheet/images/figure-1-3.png)

Zwei RK806,I2C — Englisches Original,Rev1.3,PDF-Seite 11.

![Zwei RK806,SPI](/docs/rockchip-rk806-datasheet/images/figure-1-4.png)

Zwei RK806,SPI — Englisches Original,Rev1.3,PDF-Seite 11.

## 2 Gehäuse

RK806-1/-2/-3: RoHS,QFN68(7×7),2000 Stück pro Gurt,5 Gurte pro Karton auf Rollen. Markierung: Rockchip Marke;RKXXXX Chip;ABC Unterauftragnehmer;XXXXXX Die-Los;DEFG Datum;NXXXXXX FXX OSAT-Unterlos. Drei Markierungsbilder kennzeichnen Pin1. Feuchteempfindlichkeit MSL3; Anschlussoberfläche/Pinmaterial Sn. Koplanarität gilt für Anschlüsse, Eckanschlüsse und Die-Attach-Pad. Maß b am metallisierten Anschluss wird0.15–0.30mm von der Spitze gemessen, nicht im optionalen Radius am anderen Ende.

| Bestellvariante | RoHS | Gehäuse | Verpackung |
| --- | --- | --- | --- |
| RK806-1 | RoHS | QFN68 (7×7) | 2000 Stück/Gurt;5 Gurte/Karton;Rollen |
| RK806-2 | RoHS | QFN68 (7×7) | 2000 Stück/Gurt;5 Gurte/Karton;Rollen |
| RK806-3 | RoHS | QFN68 (7×7) | 2000 Stück/Gurt;5 Gurte/Karton;Rollen |

![RK806-1-Oberseitenmarkierung](/docs/rockchip-rk806-datasheet/images/figure-mark-1.png)

RK806-1-Oberseitenmarkierung — Englisches Original,Rev1.3,PDF-Seite 12.

![RK806-2-Oberseitenmarkierung](/docs/rockchip-rk806-datasheet/images/figure-mark-2.png)

RK806-2-Oberseitenmarkierung — Englisches Original,Rev1.3,PDF-Seite 12.

![RK806-3-Oberseitenmarkierung](/docs/rockchip-rk806-datasheet/images/figure-mark-3.png)

RK806-3-Oberseitenmarkierung — Englisches Original,Rev1.3,PDF-Seite 13.

![Abb.2-1 QFN68-Abmessungen](/docs/rockchip-rk806-datasheet/images/figure-2-1.png)

Abb.2-1 QFN68-Abmessungen — Englisches Original,Rev1.3,PDF-Seite 13.

| Symbol | Minimum / mm | Nennwert / mm | Maximum / mm |
| --- | --- | --- | --- |
| A | 0.80 | 0.85 | 0.90 |
| A1 | - | 0.02 | 0.05 |
| b | 0.10 | 0.15 | 0.20 |
| b1 | 0.08 REF |  |  |
| C | 0.18 | 0.20 | 0.25 |
| D | 6.90 | 7.00 | 7.10 |
| D2 | 5.39 | 5.49 | 5.59 |
| e | 0.35BSC |  |  |
| Nd | 5.60BSC |  |  |
| E | 6.90 | 7.00 | 7.10 |
| E2 | 5.39 | 5.49 | 5.59 |
| Ne | 5.60BSC |  |  |
| L | 0.35 | 0.40 | 0.45 |
| L1 | 0.10BSC |  |  |
| L2 | 0.35 | 0.40 | 0.45 |
| k | 0.20 | - | - |
| h | 0.30 | 0.35 | 0.40 |
| aaa | 0.07 |  |  |
| bbb | 0.08 |  |  |
| ccc | 0.10 |  |  |
| ddd | 0.10 |  |  |
| eee | 0.10 |  |  |
| fff | 0.05 |  |  |

Einzelwerte REF/BSC und Geometrietoleranzen überspannen in der Quelle Min/Nenn/Max; einmalige Anzeige bedeutet keinen eigenständigen Mindestwert.

![Abb.2-2 Pinbelegung,Raster0.35mm](/docs/rockchip-rk806-datasheet/images/figure-2-2.png)

Abb.2-2 Pinbelegung,Raster0.35mm — Englisches Original,Rev1.3,PDF-Seite 14.

| Pin | Name | Beschreibung | I/O |
| --- | --- | --- | --- |
| 1 | VCC9 | Versorgung von buck9 | I |
| 2 | SYNC | Master/Slave-Synchronisationssignal | I/O |
| 3 | SYNC_CLK | 32k-Synchronisationstakt | I/O |
| 4 | PWRON | Einschalttaste, intern etwa45K Pull-up an VCCA | I |
| 5 | VOUT8 | Ausgangsrückkopplung von buck8 | I |
| 6 | SW8 | Schaltknoten von buck8 | O |
| 7 | VCC8 | Versorgung von buck8 | I |
| 8 | NLDO5 | NMOS-LDO5-Ausgang | O |
| 9 | VCC14 | Versorgung von NLDO4/5 | I |
| 10 | NLDO4 | NMOS-LDO4-Ausgang | O |
| 11 | NLDO3 | NMOS-LDO3-Ausgang | O |
| 12 | NLDO2 | NMOS-LDO2-Ausgang | O |
| 13 | VCC13 | Versorgung von NLDO1/2/3 | I |
| 14 | NLDO1 | NMOS-LDO1-Ausgang | O |
| 15 | MOSI/SDA | SPI MOSI;I2C SDA | I/O |
| 16 | MISO/PWRCRTL3 | SPI MISO;PWRCRTL3-Steuerung | I/O |
| 17 | CLK/SCL | SPI CLK;I2C SCL | I |
| 18 | CS | SPI/I2C-Wahl beim Einschalten: an VCCA I2C, sonst SPI; im SPI-Modus Chipauswahl CS | I |
| 19 | INT | Interrupt | O |
| 20 | VCCIO | Versorgungsausgang für I2C/SPI | O |
| 21 | VCCA | Analogversorgung für PLDO6/RESETB/INT und Systemlogik | I |
| 22 | VCC4 | Versorgung von buck4 | I |
| 23 | SW4 | Schaltknoten von buck4 | O |
| 24 | VOUT4 | Ausgangsrückkopplung von buck4 | I |
| 25 | VOUT10 | Ausgangsrückkopplung von buck10 | I |
| 26 | SW10 | Schaltknoten von buck10 | O |
| 27 | VCC10 | Versorgung von buck10 | I |
| 28 | VCC6 | Versorgung von buck6 | I |
| 29 | SW6 | Schaltknoten von buck6 | O |
| 30 | VOUT6 | Ausgangsrückkopplung von buck6 | I |
| 31 | FB6 | Rückkopplung von buck6 im externen Widerstandsteilermodus | I |
| 32 | VDC | VDC-Einschaltsignal | I |
| 33 | VCC2 | Versorgung von buck2 | I |
| 34 | VCC2 | Versorgung von buck2 | I |
| 35 | SW2 | Schaltknoten von buck2 | O |
| 36 | SW2 | Schaltknoten von buck2 | O |
| 37 | VOUT2 | Ausgangsrückkopplung von buck2 | I |
| 38 | FB2 | Rückkopplung von buck2 im externen Widerstandsteilermodus | I |
| 39 | EXT_EN | Externe DCDC-Freigabe; Master/Slave-Wahl | I/O |
| 40 | RESETB | AP-Reset; äquivalente Pinkapazität gegen GND höchstens0.3uF | I/O |
| 41 | VOUT7 | Ausgangsrückkopplung von buck7 | I |
| 42 | SW7 | Schaltknoten von buck7 | O |
| 43 | VCC7 | Versorgung von buck7 | I |
| 44 | VCC5 | Versorgung von buck5 | I |
| 45 | SW5 | Schaltknoten von buck5 | O |
| 46 | VOUT5 | Ausgangsrückkopplung von buck5 | I |
| 47 | FB5 | Rückkopplung von buck5 im externen Widerstandsteilermodus | I |
| 48 | FB1 | Rückkopplung von buck1 im externen Widerstandsteilermodus | I |
| 49 | VOUT1 | Ausgangsrückkopplung von buck1 | I |
| 50 | SW1 | Schaltknoten von buck1 | O |
| 51 | SW1 | Schaltknoten von buck1 | O |
| 52 | VCC1 | Versorgung von buck1 | I |
| 53 | VCC1 | Versorgung von buck1 | I |
| 54 | VCC3 | Versorgung von buck3 | I |
| 55 | SW3 | Schaltknoten von buck3 | O |
| 56 | VOUT3 | Ausgangsrückkopplung von buck3 | I |
| 57 | PLDO3 | PMOS-LDO3-Ausgang | O |
| 58 | PLDO2 | PMOS-LDO2-Ausgang | O |
| 59 | VCC11 | Versorgung von PLDO1/2/3 | I |
| 60 | PLDO1 | PMOS-LDO1-Ausgang | O |
| 61 | PWRCRTL2 | PWRCRTL2-Steuerung | I/O |
| 62 | PWRCRTL1 | PWRCRTL1-Steuerung | I/O |
| 63 | PLDO4 | PMOS-LDO4-Ausgang | O |
| 64 | VCC12 | Versorgung von PLDO4/5 | I |
| 65 | PLDO5 | PMOS-LDO5-Ausgang | O |
| 66 | FB9 | Rückkopplung von buck9 im externen Widerstandsteilermodus | I |
| 67 | VOUT9 | Ausgangsrückkopplung von buck9 | I |
| 68 | SW9 | Schaltknoten von buck9 | O |
| Freiliegendes Pad | ePAD | Masse |  |

## 3 Elektrische Eigenschaften

Überschreiten absoluter Grenzwerte kann den Chip dauerhaft beschädigen und Zuverlässigkeit/Sicherheit des Geräts und Systems beeinträchtigen. Funktion außerhalb empfohlener Bedingungen ist nicht garantiert. Typische Daten gelten, sofern nicht anders genannt, bei VCCA=5.0V,TA=25°C. Analogversorgung VCCA muss≥VCC1–VCC14 sein. Quellschreibweisen EST_EN und SYNS_CLK bleiben neben EXT_EN/SYNC_CLK anderer Stellen erhalten. NLDO/PLDO-Genauigkeitszeilen nennen häufig0.99/1/1.01V bei abweichenden Nennspannungen im Hinweis; beide Angaben bleiben unverändert.

### 3.1 Absolute Grenzwerte

| Parameter | Min. | Max. | Einheit |
| --- | --- | --- | --- |
| Spannungsbereich aller Pins | -0.3 | 6.5 | V |
| Spannungsbereich der Pins SWx | -0.3（-2V für &lt;20ns und -3.5V für &lt;10ns） | 6.5(7V für &lt;20ns) | V |
| Lagertemperaturbereich, T S | -40 | 150 | ℃ |
| Betriebstemperaturbereich, T J | -40 | 125 | ℃ |
| Maximale Löttemperatur, T SOLDER |  | 300 | ℃ |

### 3.2 Empfohlene Betriebsbedingungen

| Parameter | Min. | Typ. | Max. | Einheit |
| --- | --- | --- | --- | --- |
| Spannungsbereich der Pins VCCx/VCCA/SYNC/ SYNC_CLK/VDC/PWRON/EST_EN/CS/RESETB/INT | 2.7 | 5 | 5.5 | V |
| Verlustleistung |  |  | 2 | W |
| Spannungsbereich am Pin VCCIO/MOSI/MISO/ PWRCRTL1/ PWRCRTL2 | 1.62 |  | 3.4 | V |

| Parameter | Symbol | Bedingung/Hinweis | Min. | Typ. | Max. | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| I2C (7-Bit-Adressen: Master0x23,Slave0x25) |  |  |  |  |  |  |
| SCL-Taktfrequenz | f SCL |  |  |  | 1000 | KHz |
| Logikeingänge |  |  |  |  |  |  |
| Low-Eingangsspannung:PWRON,SYNC,SYNS_CLK | V IL |  |  |  | 0.3+VCCA | V |
| Low-Eingangsspannung: VDC | V IL1 |  |  |  | 0.65 | V |
| High-Eingangsspannung: MOSI,MISO,CS,PWRCRTL1/2, RESETB,INT | V IH1 |  | VCCIO*0.7 |  | 0.3+VCCIO | V |
| High-Eingangsspannung: PWRON , VCCx,VCCA,SYNC, SYNC_CLK | V IH2 |  | VCCA*0.7 |  | 0.3+VCCA | V |
| High-Eingangsspannung: VDC | V IH3 |  | 0.88 |  |  | V |

### 3.3 DC-Eigenschaften

| Parameter | Symbol | Bedingung/Hinweis | Min. | Typ. | Max. | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| Verlustleistung |  |  |  |  |  |  |
| Abschaltstrom | Isd |  |  | 10 | 12 | uA |
| Einschaltstrom1: alle BUCK/LDO ein, ohne Last | Iq1 |  |  | 1.8 |  | mA |
| Eingeschalteter Schlafstrom: alle BUCK/LDO ein, stromsparend, Schlafmodus, ohne Last | Isleep |  |  | 0.85 |  | mA |
| Systemeigenschaften |  |  |  |  |  |  |
| VB_UV-Schwelle: PMIC schaltet bei niedrigerem VCCx ab | Vuv | 2.7V~3.4 V über I2C programmierbar. Typisch 2.7V. VB_UV_SEL=0b000 | 2.646 | 2.7 | 2.754 | V |
|  |  | VB_UV_SEL=0b011 | 2.94 | 3.0 | 3.06 | V |
|  |  | VB_UV_SEL=0b111 | 3.332 | 3.4 | 3.468 | V |
| VB_LO-Schwelle: bei niedrigerem VCCx Abschaltung oder Interrupt | Vlo | 2.8V~3.5 V über I2C programmierbar. Typisch 3.2V. VB_LO_SEL= 0b000 | 2.744 | 2.8 | 2.856 | V |
|  |  | VB_LO_SEL= 0b100 | 3.136 | 3.2 | 3.264 | V |
|  |  | VB_LO_SEL= 0b111 | 3.43 | 3.5 | 3.57 | V |
| VB_OV-Schwelle: bei höherem VCCx schaltet PMIC ab | Vov |  | 5.8 | 6.0 | 6.2 | V |
| TSD-Schwelle: bei höherer Temperatur schaltet PMIC ab | Tsd | 140/160 ℃ über I2C/SPI programmierbar. Typisch 160℃. TSD_TEMP=0b0 | 135 | 140 | 145 | ℃ |
|  |  | TSD_TEMP=0b1 | 155 | 160 | 165 | ℃ |
| Temperaturwarnschwelle: bei Überschreiten Interrupt | Twa | 85~115 ℃ über I2C/SPI programmierbar. Typisch 115℃. HOTDIE_TEMP[ 1:0]=0b00 | 80 | 85 | 90 | ℃ |
|  |  | HOTDIE_TEMP= 0b01 | 90 | 95 | 100 | ℃ |
|  |  | HOTDIE_TEMP= 0b10 | 100 | 105 | 110 | ℃ |
|  |  | HOTDIE_TEMP= 0b11 | 110 | 115 | 120 | ℃ |
| PWRON-Langdruckzeit | Tlp | 6s~12s über I2C/SPI programmierbar. Typisch 6s. PWRON_LP_OFF_TIME=0b00 | 5.76 | 6 | 6.24 | s |
|  |  | PWRON_LP_OFF_TIME=0b01 | 7.68 | 8 | 8.32 | s |
|  |  | PWRON_LP_OFF_TIME=0b10 | 9.6 | 10 | 10.4 | s |
|  |  | PWRON_LP_OFF_TIME=0b11 | 11.52 | 12 | 12.48 | s |
| RC-Oszillatorfrequenz32.768kHz | 32KHz-Takt |  | 31.45 | 32.768 | 34.08 | kHz |
| PWRON-Kurzdruckzeit | Tst | 20ms/500ms über I2C/SPI programmierbar einschließlich OTP. Typisch 500ms. PWRON_ON_TIME=0b0 | 480 | 500 | 520 | ms |
|  |  | PWRON_ON_TIME=0b1 | 19.2 | 20 | 20.8 | ms |
| Startfolge |  |  |  |  |  |  |
| Startabstand zwischen Kanälen1mS |  |  | 0.96 | 1 | 1.04 | mS |
| BUCK1: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc1 |  | 2.7 |  | 5.5 | V |
| Standard-Rückkopplungsspannung | Vfb1 | Auswahl des externen Widerstandsteilers, R1=R2=100K | 0.99 | 1.0 | 1.01 | V |
| Interne Rückkopplungsreferenz | Vref_exfb | Standard aus, Freigabe durch Register 0xFD&lt;0&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vfb1 | Bei internem Spannungsteiler: 0.5V~3.4V über I2C/SPI programmierbar. Typisch 0.8V.Einstellung in Register 0x1A, Schritt=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| Lastsprungantwort L=0.22uH, Cout=66uF. | Vdrop1 | 0.65A bis 6.5A, 1A/uS, Vout=0.8V |  | 38 |  | mV |
| Nennausgangsstrom | Imax1 |  | 6.5 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw1 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=6.5A Iout=1.5A Iout=0.65A |  | 68 85 81 |  | % |
| BUCK2: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc2 |  | 2.7 |  | 5.5 | V |
| Standard-Rückkopplungsspannung | Vfb2 | Auswahl des externen Widerstandsteilers, R1=R2=100K | 0.99 | 1.0 | 1.01 | V |
| Interne Rückkopplungsreferenz | Vref_exfb | Standard aus, Freigabe durch Register 0xFD&lt;1&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vfb2 | Bei internem Spannungsteiler: 0.5V~3.4V über I2C /SPI programmierbar. Typisch 0.8V. Einstellung in Register 0x1B, Schritt=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| Lastsprungantwort L=0.22uH, Cout=66uF. | Vdrop2 | 0.5A bis 5A, 1A/uS, Vout=0.8V |  | 30 |  | mV |
| Nennausgangsstrom | Imax2 |  | 5 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw2 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=5A Iout=1A Iout=0.5A |  | 67 84 81 |  | % |
| BUCK3: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc3 |  | 2.7 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vbuck3 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 0.8V. Einstellung in Register 0x1C, Schritt=6.25mV | 0.792 | 0.8 | 0.808 | V |
| Lastsprungantwort L=0.22uH, Cout=66uF. | Vdrop3 | 0.5A bis 5.0A, 1A/uS, Vout=0.8V |  | 30 |  | mV |
| Nennausgangsstrom | Imax3 |  | 5 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw3 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=5A Iout=1A Iout=0.5A |  | 66 84 82 |  | % |
| BUCK4: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc4 |  | 2.7 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vfb4 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 0.8V. Einstellung in Register 0x1D, Schritt=6.25mV | 0.792 | 0.8 | 0.808 | V |
| Lastsprungantwort L=0.22uH, Cout=66uF. | Vdrop4 | 0.5A bis 5A, 1A/uS, Vout=0.8V |  | 22 |  | mV |
| Nennausgangsstrom | Imax4 |  | 5 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw4 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=5A Iout=1A Iout=0.5A |  | 66 84 82 |  | % |
| BUCK5: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc5 |  | 2.7 |  | 5.5 | V |
| Standard-Rückkopplungsspannung | Vfb5 | Auswahl des externen Widerstandsteilers, R1=R2=100K. | 0.99 | 1.0 | 1.01 | V |
| Interne Rückkopplungsreferenz | Vref_exfb | Standard aus, Freigabe durch Register 0xFD&lt;4&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vfb5 | Bei internem Spannungsteiler: 0.5V~3.4V über I2C /SPI programmierbar. Typisch 0.8V. Einstellung in Register 0x1E, Schritt=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| Lastsprungantwort L=470nH, Cout=44uF. | Vdrop5 | 0.3A bis 3A, 1A/uS, Vout=0.8V |  | 20 |  | mV |
| Nennausgangsstrom | Imax5 |  | 3 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw5 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK6: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc6 |  | 2.7 |  | 5.5 | V |
| Standard-Rückkopplungsspannung | Vfb6 | Auswahl des externen Widerstandsteilers, R1=R2=100K. | 0.99 | 1.0 | 1.01 | V |
| Interne Rückkopplungsreferenz | Vref_exfb | Standard aus, Freigabe durch Register 0xFD&lt;5&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vfb6 | Bei internem Spannungsteiler: 0.5V~3.4V über I2C/SPI programmierbar. Typisch 0.8V. Einstellung in Register 0x1F, Schritt=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| Lastsprungantwort L=470nH, Cout=44uF. | Vdrop6 | 0.3A bis 3A, 1A/uS, Vout=0.8V |  | 20 |  | mV |
| Nennausgangsstrom | Imax6 |  | 3 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw6 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=2.5A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK7: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc7 |  | 2.7 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vfb7 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 0.8V. Einstellung in Register 0x20, Schritt=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| Lastsprungantwort L=470nH, Cout=44uF. | Vdrop7 | 0.3A bis 3A, 1A/uS, Vout=0.8V |  | 22 |  | mV |
| Nennausgangsstrom | Imax7 |  | 3 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw7 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK8: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc8 |  | 2.7 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vfb8 | 0.5V~3.4V über I2C / SPI programmierbar. Typisch 0.8V. Einstellung in Register 0x21, Schritt=6.25mV | 0.792 | 0.8 | 0.808 | V |
| Lastsprungantwort L=470nH, Cout=44uF. | Vdrop8 | 0.3A bis 3A, 1A/uS, Vout=0.8V |  | 22 |  | mV |
| Nennausgangsstrom | Imax8 |  | 3 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw8 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK9: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc9 |  | 2.7 |  | 5.5 | V |
| Standard-Rückkopplungsspannung | Vfb9 | Auswahl des externen Widerstandsteilers, R1=R2=100K. | 0.99 | 1.0 | 1.01 | V |
| Interne Rückkopplungsreferenz | Vref_exfb | Standard aus, Freigabe durch Register 0xFE&lt;0&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vfb9 | Bei internem Spannungsteiler: 0.5V~3.4V über I2C / SPI programmierbar. Typisch 0.8V. Einstellung in Register 0x22, Schritt=6.25mV | 0.784 | 0.8 | 0.816 | V |
| Lastsprungantwort L=470nH, Cout=44uF. | Vdrop9 | 0.3A bis 3A, 1A/uS, Vout=0.8V |  | 20 |  | mV |
| Nennausgangsstrom | Imax9 |  | 3 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw9 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK10: Abwärtswandler mit schneller Lastantwort |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc10 |  | 2.7 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vfb10 | 0.5V~3.4V über I2C / SPI programmierbar. Typisch 0.8V. Einstellung in Register 0x23, Schritt=6.25mV | 0.792 | 0.8 | 0.808 | V |
| Lastsprungantwort L=470nH, Cout=44uF. | Vdrop10 | 0.3A bis 3A, 0.5A/uS, Vout=0.8V |  | 22 |  | mV |
| Nennausgangsstrom | Imax10 |  | 3 |  |  | A |
| Schaltfrequenz im CCM-Modus (Vin=3.8V,Vout=1.5V) | Fsw10 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| Wirkungsgrad (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| NLDO1 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc13 | VCCA-NLDO1&gt;1.5V | 0.6 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vnldo1 | 0.5V~3.4V über I2C / SPI programmierbar. Typisch 1V. Einstellung in Register 0x43, Schritt=12.5mV . | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl1 | Vcc13-Vnldo1&gt;0.2V | 300 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| NLDO2 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc13 | VCCA-NLDO2&gt;1.5V | 0.6 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vnldo2 | 0.5V~3.4V über I2C SPI programmierbar. Typisch 1.8V. Einstellung in Register 0x44, Schritt=12.5mV | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl2 | Vcc13-Vnldo2&gt;0.2V | 300 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| NLDO3 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc13 | VCCA-NLDO3&gt;1.5V | 0.6 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vnldo3 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 1V. Einstellung in Register 0x45, Schritt=12.5mV | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl3 | Vcc13-Vnldo3&gt;0.2V | 500 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| NLDO4 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc14 | VCCA-NLDO4&gt;1.5V | 0.6 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vnldo4 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 1V. Einstellung in Register 0x46, Schritt=12.5mV | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl4 | Vcc14-Vnldo4&gt;0.2V | 500 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| NLDO5 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc14 | VCCA-NLDO5&gt;1.5V | 0.6 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vnldo5 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 3V. Einstellung in Register 0x47, Schritt=12.5mV | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl5 | Vcc14-Vnldo5&gt;0.2V | 300 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO1 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc11 |  | 1.9 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vpldo1 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 3V. Einstellung in Register 0x4E, Schritt=12.5mV | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl1 | Vcc11-Vpldo1&gt;0.2V VCC11≥2.0V | 500 |  |  | mA |
|  |  | Vcc11-Vpldo1&gt;0.1V | 250 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO2 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc11 |  | 1.9 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vpldo2 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 2.8V. Einstellung in Register 0x4F, Schritt=12.5mV | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl2 | Vcc11-Vpldo2&gt;0.2V， VCC11≥2.0V | 300 |  |  | mA |
|  |  | Vcc11-Vpldo2&gt;0.1V | 150 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO3 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc11 |  | 1.9 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vpldo3 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 1.8V. Einstellung in Register 0x50, Schritt=12.5mV | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl3 | Vcc11-Vpldo3&gt;0.2V， VCC11≥2.0V | 300 |  |  | mA |
|  |  | Vcc11-Vpldo3&gt;0.1V | 150 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO4 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc12 |  | 1.9 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vpldo4 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 1.5V. Einstellung in Register 0x51, Schritt=12.5mV | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl4 | Vcc12-Vpldo4&gt;0.2V， Vcc12&gt;2.0 | 500 |  |  | mA |
|  |  | Vcc12-Vpldo4&gt;0.1V | 250 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO5 |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich | Vcc12 |  | 1.9 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vpldo5 | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 1.8V. Einstellung in Register 0x52, Schritt=12.5mV | 0.99 | 1 | 1.01 | V |
| Nennausgangsstrom | Imaxl5 | Vcc12-Vpldo5&gt;0.2V VCC12≥2.0V | 300 |  |  | mA |
|  |  | Vcc12-Vpldo5&gt;0.1V | 150 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| VCCIO |  |  |  |  |  |  |
| Eingangsversorgungsspannungsbereich[1] | VccA |  | 2.0 |  | 5.5 | V |
| Ausgangsspannungsgenauigkeit über alle Lasten und Eingangsspannungen | Vccio | 0.5V~3.4V über I2C /SPI programmierbar. Typisch 1.8V. Einstellung in Register 0x53, Schritt=12.5mV | 1.782 | 1.8 | 1.818 | V |
| Nennausgangsstrom | Imaxl6 | VccA-Vccio&gt;0.2V | 300 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |

## 4.1.1–4.1.2 Zustandsautomat und Einschalten

Zustände OFF, ACTIVE und SLEEP mit Einschalt-, Abschalt-, Reset- und Schlafübergängen. Drei Einschaltwege: (1) VCCA,VCC1,VCC2 über VB_OK und PWRON500/20ms Low; Zeit über I2C/SPI programmierbar. Kanäle starten mit Standardspannungen in vorgegebener Reihenfolge, Abstand1ms. Nach stabilen Schienen wird RESETB High. T1 prüft externe Versorgung; dargestellt3.5ms<T1<100ms, Anforderungen innerhalb100ms erfüllen. Weitere Diagrammintervalle:10ms/≤16ms. (2) Bei denselben Versorgungsvoraussetzungen schaltet VDC länger als2ms High ein; gleiche T1-Anforderung. (3) Bei0x5F<7>=0 lösen OVP/UVLO nach Einschalten automatischen Neustart aus; regulärer Start nach erkanntem Normalspannungszustand.

![Abb.4-1 Zustand/Einschalttiming](/docs/rockchip-rk806-datasheet/images/figure-4-1.png)

Abb.4-1 Zustand/Einschalttiming — Englisches Original,Rev1.3,PDF-Seite 25.

![Abb.4-2 Zustand/Einschalttiming](/docs/rockchip-rk806-datasheet/images/figure-4-2.png)

Abb.4-2 Zustand/Einschalttiming — Englisches Original,Rev1.3,PDF-Seite 25.

![Abb.4-3 Zustand/Einschalttiming](/docs/rockchip-rk806-datasheet/images/figure-4-3.png)

Abb.4-3 Zustand/Einschalttiming — Englisches Original,Rev1.3,PDF-Seite 26.

## 4.1.3 Abschalten

Sieben Abschaltwege aus ON/SLEEP: (1)0x76<6>=0 und PWRON6/8/10/12s Low, Entprellzeit über I2C. RESETB wird Low, nach1ms schalten Kanäle in eingestellter Reihenfolge ab; Grafik zeigt1ms Abstand und6ms vor EXT_EN. (2)0x72<0>=1 schreiben, gleiche Sequenz. (3)Bei0x5F<7>=1 zieht VCCA/VCC1/VCC2 unter VB_UV (typ.2.7V) oder über VB_OV (typ.6.0V) SYNC Low und schaltet sofort ab. (4)Bei0x5E<3>=0 und Versorgung unter VB_LO (typ.3.2V) für1ms folgt Sequenz1. (5)PWRCTRLn_FUN=010 und aktives PWRCTRLn mit programmierbarer Polarität: Sequenz1. (6)Über TSD (typ.140°C): Sequenz1. (7)Bei0x5F<7>=0 führt Unter-/Überschreiten VB_UV/VB_OV zum sofortigen Abschalten; die Quelle nennt zugleich Sequenz1, beides bleibt erhalten.

![Abb.4-4 PWRON-Abschalttiming](/docs/rockchip-rk806-datasheet/images/figure-4-4.png)

Abb.4-4 PWRON-Abschalttiming — Englisches Original,Rev1.3,PDF-Seite 26.

## 4.1.4 Reset

Die Quelle kündigt vier Resetwege an, listet fünf.0x72<7:6>=00 startet den PMIC neu;01 setzt Register und alle Kanäle auf Standard zurück. In ON/SLEEP: (1)0x76<6>=1 und PWRON6/8/10/12s Low starten neu; Entprellung über I2C/SPI. Diagramm:1ms Kanalabstände und244ms. (2)PWRCTRLn_FUN=011 mit aktivem PWRCTRLn, Polarität PWRCTRLn_POL: gleiche Neustartsequenz. (3)RESETB Low: sofortiger Neustart, gleiche Sequenz. (4)Aktiver WDT mit0x73<4:3>=11: gleicher Neustart. (5)Schreiben0x72<7:5>=001: gleicher Neustart.

![Abb.4-5 PWRON-Neustarttiming](/docs/rockchip-rk806-datasheet/images/figure-4-5.png)

Abb.4-5 PWRON-Neustarttiming — Englisches Original,Rev1.3,PDF-Seite 27.

## 4.1.5–4.1.6 Versorgungsfolgen und Schlaf

Tabellen unterscheiden RK806-1 Master, RK806-2 Master/Slave und RK806-3 Master. Kurzer PWRON-Druck:20ms. Hinweise[1][2][3]: OTP ändert Standardspannungen innerhalb0.5–3.4V und Startreihenfolge. BUCK1/2/5/6/9 erlauben externe Feedbackwiderstände für Sonderwerte. Nach Einschalten legen B2–C3 die Abschaltfolge fest. Schlaf: PWRCTRLn_FUN=001 und PWRCTRLn gemäß PWRCTRLn_POL aktivieren. Schlaf senkt Verluste;0x0D=FF,0x0C=FF und0x61<1>=1 reduzieren Ruhestrom weiter.

### RK806-1（Master）

| Kanal | Ausgangsbereich | Maximalstrom | Standardspannung | Startfolge |
| --- | --- | --- | --- | --- |
| BUCK1 | 0.5V-3.4V | 6.5A | 0.75V | 5 |
| BUCK2 | 0.5V-3.4V | 5A | 0.75V | 3 |
| BUCK3 | 0.5V-3.4V | 5A | 0.75V | 2 |
| BUCK4 | 0.5V-3.4V | 5A | 0.75V | 5 |
| BUCK5 | 0.5V-3.4V | 3A | 0.85V | 2 |
| BUCK6 | X (externer Teiler) oder0.5V–3.4v (interner Teiler) | 3A | 0.5V | 4 |
| BUCK7 | 0.5V-3.4V | 3A | 2.0V | 1 |
| BUCK8 | 0.5V-3.4V | 3A | 3.3V | 6 |
| BUCK9 | X (externer Teiler) oder0.5V–3.4v (interner Teiler) | 3A | 0.5V | 6 |
| BUCK10 | 0.5V-3.4V | 3A | 1.8V | 3 |
| NLDO1 | 0.5V-3.4V | 300mA | 0.75V | 2 |
| NLDO2 | 0.5V-3.4V | 300mA | 0.85V | 2 |
| NLDO3 | 0.5V-3.4V | 500mA | 0.75V | 2 |
| NLDO4 | 0.5V-3.4V | 500mA | 0.85V | 2 |
| NLDO5 | 0.5V-3.4V | 300mA | 0.75V | 2 |
| PLDO1 | 0.5V-3.4V | 500mA | 1.8V | 3 |
| PLDO2 | 0.5V-3.4V | 300mA | 1.8V | 3 |
| PLDO3 | 0.5V-3.4V | 300mA | 1.2V | 4 |
| PLDO4 | 0.5V-3.4V | 500mA | 3.3V | 6 |
| PLDO5 | 0.5V-3.4V | 300mA | 3.3V | 6 |
| PLDO6 | 0.5V-3.4V | 300mA | 1.8V | 3 |
| VB_OK | 2.8V-3.6V | x | 2.8V | x |
| RESETB | x | x | x | 11 |

### RK806-2（Master）

| Kanal | Ausgangsbereich | Maximalstrom | Standardspannung | Startfolge |
| --- | --- | --- | --- | --- |
| BUCK1 | 0.5V-3.4V | 6.5A | 0.75V | 7 |
| BUCK2 | 0.5V-3.4V | 5A | 0.75V | 7 |
| BUCK3 | 0.5V-3.4V | 5A | 0.75V | 2 |
| BUCK4 | 0.5V-3.4V | 5A | 0.75V | 7 |
| BUCK5 | 0.5V-3.4V | 3A | 0.75V | 7 |
| BUCK6 | 0.5V-3.4V | 3A | 0.75V | 7 |
| BUCK7 | 0.5V-3.4V | 3A | 2.0V | 1 |
| BUCK8 | 0.5V-3.4V | 3A | 0.75V | 7 |
| BUCK9 | X (externer Teiler) oder0.5V–3.4v (interner Teiler) | 3A | 0.5V | 4 |
| BUCK10 | 0.5V-3.4V | 3A | 1.10V | 1 |
| NLDO1 | 0.5V-3.4V | 300mA | 0.75V | 2 |
| NLDO2 | 0.5V-3.4V | 300mA | 0.90V | 5 |
| NLDO3 | 0.5V-3.4V | 500mA | 0.75V | 2 |
| NLDO4 | 0.5V-3.4V | 500mA | 0.75V | 2 |
| NLDO5 | 0.5V-3.4V | 300mA | 0.85V | 2 |
| PLDO1 | 0.5V-3.4V | 500mA | 1.80V | 3 |
| PLDO2 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| PLDO3 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| PLDO4 | 0.5V-3.4V | 500mA | 3.30V | 6 |
| PLDO5 | 0.5V-3.4V | 300mA | 3.30V | 6 |
| PLDO6 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| VB_OK | 2.8V-3.6V | x | 2.8V | x |
| RESETB | x | x | x | 20 |

### RK806-2（Slave）

| Kanal | Ausgangsbereich | Maximalstrom | Standardspannung | Startfolge |
| --- | --- | --- | --- | --- |
| BUCK1 | 0.5V-3.4V | 6.5A | 0.75V | 9 |
| BUCK2 | 0.5V-3.4V | 5A | 0.75V | 9 |
| BUCK3 | 0.5V-3.4V | 5A | 0.75V | 8 |
| BUCK4 | 0.5V-3.4V | 5A | 3.30V | 6 |
| BUCK5 | 0.5V-3.4V | 3A | 0.75V | 9 |
| BUCK6 | 0.5V-3.4V | 3A | 0.75V | 9 |
| BUCK7 | 0.5V-3.4V | 3A | 1.80V | 3 |
| BUCK8 | 0.5V-3.4V | 3A | 0.75V | 8 |
| BUCK9 | X (externer Teiler) oder0.5V–3.4v (interner Teiler) | 3A | 0.5V | 6 |
| BUCK10 | 0.5V-3.4V | 3A | 0.85V | 2 |
| NLDO1 | 0.5V-3.4V | 300mA | 0.75V | 2 |
| NLDO2 | 0.5V-3.4V | 300mA | 0.85V | 2 |
| NLDO3 | 0.5V-3.4V | 500mA | 0.85V | 2 |
| NLDO4 | 0.5V-3.4V | 500mA | 0.50V | OFF |
| NLDO5 | 0.5V-3.4V | 300mA | 1.20V | 4 |
| PLDO1 | 0.5V-3.4V | 500mA | 0.50V | OFF |
| PLDO2 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| PLDO3 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| PLDO4 | 0.5V-3.4V | 500mA | 3.30V | 6 |
| PLDO5 | 0.5V-3.4V | 300mA | 2.80V | OFF |
| PLDO6 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| VB_OK | 2.8V-3.6V | x | 2.8V | x |
| RESETB | x | x | x | 20 |

### RK806-3（Master）

| Kanal | Ausgangsbereich | Maximalstrom | Standardspannung | Startfolge |
| --- | --- | --- | --- | --- |
| BUCK1 | X (externer Teiler) oder0.5V–3.4v (interner Teiler) | 6.5A | X | 40 |
| BUCK2 | X (externer Teiler) oder0.5V–3.4v (interner Teiler) | 5A | X | 40 |
| BUCK3 | 0.5V-3.4V | 5A | 0.8V | 0 |
| BUCK4 | 0.5V-3.4V | 5A | 0.8V | 5 |
| BUCK5 | 0.5V-3.4V | 3A | 0.8V | 40 |
| BUCK6 | 0.5V-3.4V | 3A | 0.8V | 45 |
| BUCK7 | 0.5V-3.4V | 3A | 2.0V | 5 |
| BUCK8 | 0.5V-3.4V | 3A | 1.0V | 5 |
| BUCK9 | 0.5V-3.4V | 3A | 1.8V | 45 |
| BUCK10 | 0.5V-3.4V | 3A | 1.8V | 10 |
| NLDO1 | 0.5V-3.4V | 300mA | 0.8V | 40 |
| NLDO2 | 0.5V-3.4V | 300mA | 0.8V | 15 |
| NLDO3 | 0.5V-3.4V | 500mA | 0.8V | 25 |
| NLDO4 | 0.5V-3.4V | 500mA | 1.8V | 20 |
| NLDO5 | 0.5V-3.4V | 300mA | 1.8V | 43 |
| PLDO1 | 0.5V-3.4V | 500mA | 1.8V | 30 |
| PLDO2 | 0.5V-3.4V | 300mA | 1.8V | 35 |
| PLDO3 | 0.5V-3.4V | 300mA | 1.8V | 35 |
| PLDO4 | 0.5V-3.4V | 500mA | 1.8V | 43 |
| PLDO5 | 0.5V-3.4V | 300mA | 1.8V | 55 |
| PLDO6 | 0.5V-3.4V | 300mA | 3.3V | 55 |
| VB_OK | 2.8V-3.6V | x | 2.8V | x |
| RESETB | x | x | x | 63 |

## 4.1.7 Master/Slave-Zusammenarbeit

Zwei RK806 können kooperieren. Beim ersten Einschalten wählt EXT_EN an VCCA den Slave; offen oder über Widerstand Low den Master. Jeweils SYNC_CLK und SYNC verbinden. Der Master liefert den Takt über SYNC_CLK; SYNC-Impulse synchronisieren Start, Abschalten, Reset und Versorgungswechsel. PWRON-Paar und RESETB-Paar jeweils für Einschalten und externen Resettaster verbinden. VDC kann gemeinsam angeschlossen werden, alternativ Slave-VDC an Master-EXT_EN. Bei knappen Host-IOs dürfen INT verbunden werden; Software unterscheidet Quellen durch Lesen der jeweiligen Register.

## 4.1.8 I2C und SPI

Master-/Slave-Busadressen0x23/0x25 (Quelle nennt sie Registeradressen). Beim Erststart wählt CS an VCCA I2C, sonst SPI. VCCIO muss über1.62V liegen und im Standby eingeschaltet bleiben. SPI startet im3-Draht-Modus. Für4-Draht setzt die Hostinitialisierung E8<2>=1; Slave-SO benötigt E9<5>=1. Daten werden bei fallendem CLK vorbereitet und bei High übernommen; maximal20MHz. MISO als SLEEP3 verlangt3-Draht; Host-MOSI/MISO verbinden, Datenaustausch über PMIC-MOSI. Nach SPI-Daten zwei zusätzliche Dummybytes senden. Die folgenden CRC-Wellenformregeln nennen gesondert Dummy-Paketzahlen.

| Signal | Symbol | Parameter | Min. | Typ. | Max. | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| CLK | Fsclk | Taktfrequenz | — | — | 20 | MHz |
| CLK | th_sclk | Takt-High-Zeit | 5 | 25 | — | ns |
| CLK | tl_sclk | Takt-Low-Zeit | 5 | 25 | — | ns |
| CS | tsu_cs | CS-Eingangssetup | 10 | — | — | ns |
| CS | thold_cs | CS-Eingangshaltezeit | 20 | — | — | ns |
| MOSI | tsu_mosi | Dateneingangssetup | 2 | — | — | ns |
| MOSI | thold_mosi | Dateneingangshaltezeit | 2 | — | — | ns |
| MISO | tod_miso | Takt Low bis Ausgang gültig | — | 20 | 23 | ns |

## 4.1.9 SPI-Befehlsformat

Jede Übertragung beginnt mit CMD,REG_L,REG_H. CMD: R/W[7] (0 lesen,1 schreiben), CRC_EN[6] (1 ein,0 aus), Len[3:0]. Mit CRC gilt Len=n−1, maximal16 Datenbytes; CRC folgt an Position Len+1. Ohne CRC wird Len ignoriert und die Slaveadresse erhöht sich im Bereich0–255. REG_L enthält Adressbits7:0, REG_H Bits15:8, die RK806 stets als0 behandelt. Beim3-Draht-Lesen schaltet der Host während REG_H MO auf Eingang, um Konflikte beim Wechsel von Slave-SI zu SO zu vermeiden; bei zwei Eingängen erzwingt der Slave empfangene0. CRC-Polynom X⁸+X⁴+X+1, Anfang0x00. Die erste Erklärung setzt REG_L=REG_H=0 bei der Berechnung, die spätere Definition umfasst REG_L,REG_H und Daten. Beide Quellaussagen bleiben erhalten. CRC-Schreiben benötigt nach CRC ein zusätzliches CRC_CLK_DATA-Dummybyte zur internen Berechnung/Übertragung; weitere unerkennbare Takte nach diesen8 Bit setzen CRC_ERR und stoppen RK806. CRC-Lesen braucht dieses Dummybyte nicht; weitere Takte nach CRC ergeben keine Antwort oder ungültige Daten. Wellenformen: CRC-loses Einzelbyteschreiben erhöht die Adresse nach8 Takten unabhängig von Len; CRC-Einzelbyteschreiben ergänzt Dummy1; Mehrbyteschreiben mit CRC benötigt mindestens ein Dummypaket bei≤8 Bytes, zwei bei>8. Vierdraht-CRC-Lesen liefert Daten und CRC auf MISO; Dreidrahtlesen enthält das leere REG_H-Intervall mit erzwungener0. CRC-loses Lesen erhöht die Adresse alle8 Takte. Diese Paketanzahlen werden neben der Zwei-Dummybyte-Angabe in4.1.8 erhalten.

![SPI-Wellenform: spi-command](/docs/rockchip-rk806-datasheet/images/figure-spi-command.png)

SPI-Wellenform: spi-command — Englisches Original,Rev1.3,PDF-Seite 33.

![SPI-Wellenform: spi-write-no-crc](/docs/rockchip-rk806-datasheet/images/figure-spi-write-no-crc.png)

SPI-Wellenform: spi-write-no-crc — Englisches Original,Rev1.3,PDF-Seite 34.

![SPI-Wellenform: spi-write-crc](/docs/rockchip-rk806-datasheet/images/figure-spi-write-crc.png)

SPI-Wellenform: spi-write-crc — Englisches Original,Rev1.3,PDF-Seite 34.

![SPI-Wellenform: spi-write-multi-crc](/docs/rockchip-rk806-datasheet/images/figure-spi-write-multi-crc.png)

SPI-Wellenform: spi-write-multi-crc — Englisches Original,Rev1.3,PDF-Seite 34.

![SPI-Wellenform: spi-read-four-wire](/docs/rockchip-rk806-datasheet/images/figure-spi-read-four-wire.png)

SPI-Wellenform: spi-read-four-wire — Englisches Original,Rev1.3,PDF-Seite 34.

![SPI-Wellenform: spi-read-three-wire](/docs/rockchip-rk806-datasheet/images/figure-spi-read-three-wire.png)

SPI-Wellenform: spi-read-three-wire — Englisches Original,Rev1.3,PDF-Seite 35.

![SPI-Wellenform: spi-read-no-crc](/docs/rockchip-rk806-datasheet/images/figure-spi-read-no-crc.png)

SPI-Wellenform: spi-read-no-crc — Englisches Original,Rev1.3,PDF-Seite 35.

## 4.2.1 Abwärtswandler

Zehn synchrone BUCK liefern bis6.5A,5A oder3A. Verbessertes Constant-on-time-COT beschleunigt die Lastantwort;2MHz und die Regelarchitektur reduzieren externe L/C-Anforderungen. DVS ermöglicht im Betrieb lineare, allmähliche Spannungsrampen. Schutz umfasst Kurzschluss. Quellbeispiel: BUCK1,Vout=0.8V,Vin=5V,L=0.22uH,Cout=66uF,Last0.065→6.5A,Flanke3A/uS mittels MOSFET; Spannungseinbruch bei steigender Last etwa38mV. Andere BUCK haben dieselbe Architektur. Die elektrische Tabelle nennt separat0.65→6.5A und1A/uS; dies sind unterschiedliche Quellbedingungen, keine ArmSoM-Messungen. Die folgenden Originalabbildungen erhalten steigende/fallende Lastantworten und Wirkungsgradkurven samt Bedingungen.

![Abb.4-6 BUCK1-Lastsprung](/docs/rockchip-rk806-datasheet/images/figure-4-6.png)

Abb.4-6 BUCK1-Lastsprung — Englisches Original,Rev1.3,PDF-Seite 35.

![Abb.4-7 BUCK1-Lastsprung](/docs/rockchip-rk806-datasheet/images/figure-4-7.png)

Abb.4-7 BUCK1-Lastsprung — Englisches Original,Rev1.3,PDF-Seite 36.

![Abb.4-8 BUCK1-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-8.png)

Abb.4-8 BUCK1-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 36.

![Abb.4-9 BUCK2-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-9.png)

Abb.4-9 BUCK2-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 36.

![Abb.4-10 BUCK3-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-10.png)

Abb.4-10 BUCK3-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 37.

![Abb.4-11 BUCK4-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-11.png)

Abb.4-11 BUCK4-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 37.

![Abb.4-12 BUCK5-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-12.png)

Abb.4-12 BUCK5-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 37.

![Abb.4-13 BUCK6-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-13.png)

Abb.4-13 BUCK6-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 38.

![Abb.4-14 BUCK7-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-14.png)

Abb.4-14 BUCK7-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 38.

![Abb.4-15 BUCK8-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-15.png)

Abb.4-15 BUCK8-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 38.

![Abb.4-16 BUCK9-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-16.png)

Abb.4-16 BUCK9-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 39.

![Abb.4-17 BUCK10-Wirkungsgrad](/docs/rockchip-rk806-datasheet/images/figure-4-17.png)

Abb.4-17 BUCK10-Wirkungsgrad — Englisches Original,Rev1.3,PDF-Seite 39.

## 4.2.2 LDO

Die Wirkungsgradkurven verwenden BUCK-Standardspannungen (Diagramme0.8V) und vergleichen5500/4200/3000mV Eingang im PFM-Modus. Fünf NLDO: NLDO3/4 bis500mA,NLDO1/2/5 bis300mA. Von sechs PLDO liefern PLDO1/4 bis500mA. Der Absatz nennt PLDO2/3/VCCIO mit300mA und lässt PLDO5 aus; Merkmals- und elektrische Tabellen nennen auch PLDO5=300mA. Alle LDO dürfen1.0uF Ausgangskapazität zur Kostenreduktion verwenden. Spannungen und weitere Modusparameter sind über I2C/SPI einstellbar.

## 5.1 Registerübersicht

| Name | Offset | Größe | Resetwert | Beschreibung |
| --- | --- | --- | --- | --- |
| POWER_EN0 | 0x0000 | B | OTP |  |
| POWER_EN1 | 0x0001 | B | OTP |  |
| POWER_EN2 | 0x0002 | B | OTP |  |
| POWER_EN3 | 0x0003 | B | OTP |  |
| POWER_EN4 | 0x0004 | B | OTP |  |
| POWER_EN5 | 0x0005 | B | OTP |  |
| POWER_SLP_EN0 | 0x0006 | B | OTP |  |
| POWER_SLP_EN1 | 0x0007 | B | OTP |  |
| POWER_SLP_EN2 | 0x0008 | B | OTP |  |
| POWER_DISCHRG_EN0 | 0x0009 | B | 0xff |  |
| POWER_DISCHRG_EN1 | 0x000a | B | 0xdf |  |
| POWER_DISCHRG_EN2 | 0x000b | B | 0x3f |  |
| BUCK_FB_CONFIG | 0x000c | B | 0x01 |  |
| SLP_LP_CONFIG | 0x000d | B | 0x00 |  |
| POWER_FPWM_EN0 | 0x000e | B | 0x00 |  |
| POWER_FPWM_EN1 | 0x000f | B | 0x00 |  |
| BUCK1_CONFIG | 0x0010 | B | 0x64 |  |
| BUCK2_CONFIG | 0x0011 | B | 0x64 |  |
| BUCK3_CONFIG | 0x0012 | B | 0x64 |  |
| BUCK4_CONFIG | 0x0013 | B | 0x64 |  |
| BUCK5_CONFIG | 0x0014 | B | 0x64 |  |
| BUCK6_CONFIG | 0x0015 | B | 0x64 |  |
| BUCK7_CONFIG | 0x0016 | B | 0x64 |  |
| BUCK8_CONFIG | 0x0017 | B | 0x64 |  |
| BUCK9_CONFIG | 0x0018 | B | 0x64 |  |
| BUCK10_CONFIG | 0x0019 | B | 0x64 |  |
| BUCK1_ON_VSEL | 0x001a | B | OTP |  |
| BUCK2_ON_VSEL | 0x001b | B | OTP |  |
| BUCK3_ON_VSEL | 0x001c | B | OTP |  |
| BUCK4_ON_VSEL | 0x001d | B | OTP |  |
| BUCK5_ON_VSEL | 0x001e | B | OTP |  |
| BUCK6_ON_VSEL | 0x001f | B | OTP |  |
| BUCK7_ON_VSEL | 0x0020 | B | OTP |  |
| BUCK8_ON_VSEL | 0x0021 | B | OTP |  |
| BUCK9_ON_VSEL | 0x0022 | B | OTP |  |
| BUCK10_ON_VSEL | 0x0023 | B | OTP |  |
| BUCK1_SLP_VSEL | 0x0024 | B | OTP |  |
| BUCK2_SLP_VSEL | 0x0025 | B | OTP |  |
| BUCK3_SLP_VSEL | 0x0026 | B | OTP |  |
| BUCK4_SLP_VSEL | 0x0027 | B | OTP |  |
| BUCK5_SLP_VSEL | 0x0028 | B | OTP |  |
| BUCK6_SLP_VSEL | 0x0029 | B | OTP |  |
| BUCK7_SLP_VSEL | 0x002a | B | OTP |  |
| BUCK8_SLP_VSEL | 0x002b | B | OTP |  |
| BUCK9_SLP_VSEL | 0x002c | B | OTP |  |
| BUCK10_SLP_VSEL | 0x002d | B | OTP |  |
| BUCK_DEBUG13 | 0x003c | B | 0x44 |  |
| BUCK_DEBUG14 | 0x003d | B | 0x44 |  |
| BUCK_DEBUG15 | 0x003e | B | 0x44 |  |
| BUCK_DEBUG16 | 0x003f | B | 0x44 |  |
| BUCK_DEBUG17 | 0x0040 | B | 0x44 |  |
| NLDO_IMAX | 0x0042 | B | 0x00 |  |
| NLDO1_ON_VSEL | 0x0043 | B | OTP |  |
| NLDO2_ON_VSEL | 0x0044 | B | OTP |  |
| NLDO3_ON_VSEL | 0x0045 | B | OTP |  |
| NLDO4_ON_VSEL | 0x0046 | B | OTP |  |
| NLDO5_ON_VSEL | 0x0047 | B | OTP |  |
| NLDO1_SLP_VSEL | 0x0048 | B | OTP |  |
| NLDO2_SLP_VSEL | 0x0049 | B | OTP |  |
| NLDO3_SLP_VSEL | 0x004a | B | OTP |  |
| NLDO4_SLP_VSEL | 0x004b | B | OTP |  |
| NLDO5_SLP_VSEL | 0x004c | B | OTP |  |
| PLDO_IMAX | 0x004d | B | 0x00 |  |
| PLDO1_ON_VSEL | 0x004e | B | OTP |  |
| PLDO2_ON_VSEL | 0x004f | B | OTP |  |
| PLDO3_ON_VSEL | 0x0050 | B | OTP |  |
| PLDO4_ON_VSEL | 0x0051 | B | OTP |  |
| PLDO5_ON_VSEL | 0x0052 | B | OTP |  |
| PLDO6_ON_VSEL | 0x0053 | B | OTP |  |
| PLDO1_SLP_VSEL | 0x0054 | B | OTP |  |
| PLDO2_SLP_VSEL | 0x0055 | B | OTP |  |
| PLDO3_SLP_VSEL | 0x0056 | B | OTP |  |
| PLDO4_SLP_VSEL | 0x0057 | B | OTP |  |
| PLDO5_SLP_VSEL | 0x0058 | B | OTP |  |
| PLDO6_SLP_VSEL | 0x0059 | B | OTP |  |
| CHIP_NAME | 0x005a | B | 0x80 |  |
| CHIP_VER | 0x005b | B | 0x62 |  |
| OTP_VER | 0x005c | B | OTP |  |
| SYS_STS | 0x005d | B | 0x00 |  |
| SYS_CFG0 | 0x005e | B | 0x0c |  |
| SYS_CFG1 | 0x005f | B | 0x00 |  |
| SYS_OPTION | 0x0061 | B | 0x00 |  |
| PWRCTRL_CONFIG0 | 0x0062 | B | 0x88 |  |
| PWRCTRL_CONFIG1 | 0x0063 | B | 0x08 |  |
| VSEL_CTR_SEL0 | 0x0064 | B | 0x00 |  |
| VSEL_CTR_SEL1 | 0x0065 | B | 0x00 |  |
| VSEL_CTR_SEL2 | 0x0066 | B | 0x00 |  |
| VSEL_CTR_SEL3 | 0x0067 | B | 0x00 |  |
| VSEL_CTR_SEL4 | 0x0068 | B | 0x00 |  |
| VSEL_CTR_SEL5 | 0x0069 | B | 0x00 |  |
| DVS_CTRL_SEL0 | 0x006a | B | 0x00 |  |
| DVS_CTRL_SEL1 | 0x006b | B | 0x00 |  |
| DVS_CTRL_SEL2 | 0x006c | B | 0x00 |  |
| DVS_CTRL_SEL3 | 0x006d | B | 0x00 |  |
| DVS_CTRL_SEL3 | 0x006e | B | 0x00 |  |
| DVS_START_CTRL | 0x0070 | B | 0x00 |  |
| PWRCTRL_GPIO | 0x0071 | B | 0x00 |  |
| SYS_CFG3 | 0x0072 | B | 0x00 |  |
| WDT_REG | 0x0073 | B | 0x00 |  |
| ON_SOURCE | 0x0074 | B | 0x00 |  |
| OFF_SOURCE | 0x0075 | B | 0x00 |  |
| PWRON_KEY | 0x0076 | B | 0x06<br>bit7：OTP |  |
| INT_STS0 | 0x0077 | B | 0x00 |  |
| INT_MSK0 | 0x0078 | B | 0x00 |  |
| INT_STS1 | 0x0079 | B | 0x00 |  |
| INT_MSK1 | 0x007a | B | 0x00 |  |
| GPIO_INT_CONFIG | 0x007b | B | 0x02 |  |
| DATA_REG0 | 0x007c | B | 0x00 |  |
| DATA_REG1 | 0x007d | B | 0x00 |  |
| DATA_REG2 | 0x007e | B | 0x00 |  |
| DATA_REG3 | 0x007f | B | 0x00 |  |
| DATA_REG4 | 0x0080 | B | 0x00 |  |
| DATA_REG5 | 0x0081 | B | 0x00 |  |
| DATA_REG6 | 0x0082 | B | 0x00 |  |
| DATA_REG7 | 0x0083 | B | 0x00 |  |
| DATA_REG8 | 0x0084 | B | 0x00 |  |
| DATA_REG9 | 0x0085 | B | 0x00 |  |
| DATA_REG10 | 0x0086 | B | 0x00 |  |
| DATA_REG11 | 0x0087 | B | 0x00 |  |
| DATA_REG12 | 0x0088 | B | 0x00 |  |
| DATA_REG13 | 0x0089 | B | 0x00 |  |
| DATA_REG14 | 0x008a | B | 0x00 |  |
| DATA_REG15 | 0x008b | B | 0x00 |  |
| BUCK_SEQ_REG0 | 0x00B2 | B | 0x00 |  |
| BUCK_SEQ_REG1 | 0x00B3 | B | 0x00 |  |
| BUCK_SEQ_REG2 | 0x00B4 | B | 0x00 |  |
| BUCK_SEQ_REG3 | 0x00B5 | B | 0x00 |  |
| BUCK_SEQ_REG4 | 0x00B6 | B | 0x00 |  |
| BUCK_SEQ_REG5 | 0x00B7 | B | 0x00 |  |
| BUCK_SEQ_REG6 | 0x00B8 | B | 0x00 |  |
| BUCK_SEQ_REG7 | 0x00B9 | B | 0x00 |  |
| BUCK_SEQ_REG8 | 0x00BA | B | 0x00 |  |
| BUCK_SEQ_REG9 | 0x00BB | B | 0x00 |  |
| BUCK_SEQ_REG10 | 0x00BC | B | 0x00 |  |
| BUCK_SEQ_REG11 | 0x00BD | B | 0x00 |  |
| BUCK_SEQ_REG12 | 0x00BE | B | 0x00 |  |
| BUCK_SEQ_REG13 | 0x00BF | B | 0x00 |  |
| BUCK_SEQ_REG14 | 0x00C0 | B | 0x00 |  |
| BUCK_SEQ_REG15 | 0x00C1 | B | 0x00 |  |
| BUCK_SEQ_REG16 | 0x00C2 | B | 0x00 |  |
| BUCK_SEQ_REG17 | 0x00C3 | B | 0x00 |  |
| BACKUP_REG7 | 0x00DC | B | 0x00 |  |
| BACKUP_REG6 | 0x00E6 | B | 0x00 |  |
| BACKUP_REG5 | 0x00E7 | B | 0x00 |  |
| BACKUP_REG1 | 0x00E8 | B | 0x00 |  |
| BACKUP_REG2 | 0x00E9 | B | 0x00 |  |
| BACKUP_REG3 | 0x00EA | B | 0x00 |  |
| BACKUP_REG4 | 0x00EB | B | 0x00 |  |
| BUCK_RSERVE_REG3 | 0x00FD | B | 0x00 |  |
| BUCK_RSERVE_REG4 | 0x00FE | B | 0x00 |  |

## 5.2 Registerbeschreibungen

Nachfolgend150 Adressen mit allen476 Bitfeldzeilen, Attributen und Resetwerten. Quellwidersprüche bleiben erhalten: Verweise auf andere BUCK/LDO, unterschiedliche Namen, doppeltes010 bei BUCK9, abweichende BUCK10-Ratencodes in Low-/High-Bit-Beschreibungen. In0xEA fehlt bit2 auch visuell im Original; keine Definition wird erfunden. RW/R/W1C und Bezeichner bleiben wörtlich. „Decode“ ist ein Quellverweis, keine zusätzliche Tabelle in diesem PDF.

### 0x00 — POWER_EN0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK4_EN_MASK BUCK4_EN_MASK: Zum Ändern von BUCK4_EN muss1 geschrieben werden; nach Schreiben von BUCK4_EN sind BUCK4_EN_MASK-Bits zu löschen. |
| 6 | RW | 0x0 | BUCK3_EN_MASK BUCK3_EN_MASK: Zum Ändern von BUCK3_EN muss1 geschrieben werden; nach Schreiben von BUCK3_EN sind BUCK3_EN_MASK-Bits zu löschen. |
| 5 | RW | 0x0 | BUCK2_EN_MASK BUCK2_EN_MASK: Zum Ändern von BUCK2_EN muss1 geschrieben werden; nach Schreiben von BUCK2_EN sind BUCK2_EN_MASK-Bits zu löschen. |
| 4 | RW | 0x0 | BUCK1_EN_MASK BUCK1_EN_MASK: Zum Ändern von BUCK1_EN muss1 geschrieben werden; nach Schreiben von BUCK1_EN sind BUCK1_EN_MASK-Bits zu löschen. |
| 3 | RW | OTP | BUCK4_EN BUCK4_EN: BUCK4-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 2 | RW | OTP | BUCK3_EN BUCK3_EN: BUCK3-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 1 | RW | OTP | BUCK2_EN BUCK2_EN: BUCK2-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 0 | RW | OTP | BUCK1_EN BUCK1_EN: BUCK1-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |

### 0x01 — POWER_EN1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_EN_MASK BUCK8_EN_MASK: Zum Ändern von BUCK8_EN muss1 geschrieben werden; nach Schreiben von BUCK8_EN sind BUCK8_EN_MASK-Bits zu löschen. |
| 6 | RW | 0x0 | BUCK7_EN_MASK BUCK7_EN_MASK: Zum Ändern von BUCK7_EN muss1 geschrieben werden; nach Schreiben von BUCK7_EN sind BUCK7_EN_MASK-Bits zu löschen. |
| 5 | RW | 0x0 | BUCK6_EN_MASK BUCK6_EN_MASK: Zum Ändern von BUCK6_EN muss1 geschrieben werden; nach Schreiben von BUCK6_EN sind BUCK6_EN_MASK-Bits zu löschen. |
| 4 | RW | 0x0 | BUCK5_EN_MASK BUCK5_EN_MASK: Zum Ändern von BUCK5_EN muss1 geschrieben werden; nach Schreiben von BUCK5_EN sind BUCK5_EN_MASK-Bits zu löschen. |
| 3 | RW | OTP | BUCK8_EN BUCK8_EN: BUCK8-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 2 | RW | OTP | BUCK7_EN BUCK7_EN: BUCK7-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 1 | RW | OTP | BUCK6_EN BUCK6_EN: BUCK6-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 0 | RW | OTP | BUCK5_EN BUCK5_EN: BUCK5-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |

### 0x02 — POWER_EN2

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV: reserviert |
| 5 | RW | 0x0 | BUCK10_EN_MASK BUCK10_EN_MASK: Zum Ändern von BUCK10_EN muss1 geschrieben werden; nach Schreiben von BUCK10_EN sind BUCK10_EN_MASK-Bits zu löschen. |
| 4 | RW | 0x0 | BUCK9_EN_MASK BUCK9_EN_MASK: Zum Ändern von BUCK9_EN muss1 geschrieben werden; nach Schreiben von BUCK9_EN sind BUCK9_EN_MASK-Bits zu löschen. |
| 3:2 | RW | 0x0 | RESV: reserviert |
| 1 | RW | OTP | BUCK10_EN BUCK10_EN: BUCK10-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 0 | RW | OTP | BUCK9_EN BUCK9_EN: BUCK9-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |

### 0x03 — POWER_EN3

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | NLDO4_EN_MASK NLDO4_EN_MASK: Zum Ändern von NLDO4_EN muss1 geschrieben werden; nach Schreiben von NLDO4_EN sind NLDO4_EN_MASK-Bits zu löschen. |
| 6 | RW | 0x0 | NLDO3_EN_MASK NLDO3_EN_MASK: Zum Ändern von NLDO3_EN muss1 geschrieben werden; nach Schreiben von NLDO3_EN sind NLDO3_EN_MASK-Bits zu löschen. |
| 5 | RW | 0x0 | NLDO2_EN_MASK NLDO2_EN_MASK: Zum Ändern von NLDO2_EN muss1 geschrieben werden; nach Schreiben von NLDO2_EN sind NLDO2_EN_MASK-Bits zu löschen. |
| 4 | RW | 0x0 | NLDO1_EN_MASK NLDO1_EN_MASK: Zum Ändern von NLDO1_EN muss1 geschrieben werden; nach Schreiben von NLDO1_EN sind NLDO1_EN_MASK-Bits zu löschen. |
| 3 | RW | OTP | NLDO4_EN NLDO4_EN: NLDO4-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 2 | RW | OTP | NLDO3_EN NLDO3_EN: NLDO3-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 1 | RW | OTP | NLDO2_EN NLDO2_EN: NLDO2-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 0 | RW | OTP | NLDO1_EN NLDO1_EN: NLDO1-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |

### 0x04 — POWER_EN4

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | PLDO3_EN_MASK PLDO3_EN_MASK: Zum Ändern von PLDO3_EN muss1 geschrieben werden; nach Schreiben von PLDO3_EN sind PLDO3_EN_MASK-Bits zu löschen. |
| 6 | RW | 0x0 | PLDO2_EN_MASK PLDO2_EN_MASK: Zum Ändern von PLDO2_EN muss1 geschrieben werden; nach Schreiben von PLDO2_EN sind PLDO2_EN_MASK-Bits zu löschen. |
| 5 | RW | 0x0 | PLDO1_EN_MASK PLDO1_EN_MASK: Zum Ändern von PLDO1_EN muss1 geschrieben werden; nach Schreiben von PLDO1_EN sind PLDO1_EN_MASK-Bits zu löschen. |
| 4 | RW | 0x0 | PLDO6_EN_MASK PLDO6_EN_MASK: Zum Ändern von PLDO6_EN muss1 geschrieben werden; nach Schreiben von PLDO6_EN sind PLDO6_EN_MASK-Bits zu löschen. |
| 3 | RW | OTP | PLDO3_EN PLDO3_EN: PLDO3-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 2 | RW | OTP | PLDO2_EN PLDO2_EN: PLDO2-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 1 | RW | OTP | PLDO1_EN PLDO1_EN: PLDO1-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 0 | RW | OTP | PLDO6_EN PLDO6_EN: PLDO6-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |

### 0x05 — POWER_EN5

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | RESV: reserviert |
| 6 | RW | 0x0 | NLDO5_EN_MASK NLDO5_EN_MASK: Zum Ändern von NLDO5_EN muss1 geschrieben werden; nach Schreiben von NLDO5_EN sind NLDO5_EN_MASK-Bits zu löschen. |
| 5 | RW | 0x0 | PLDO5_EN_MASK PLDO5_EN_MASK: Zum Ändern von PLDO5_EN muss1 geschrieben werden; nach Schreiben von PLDO5_EN sind PLDO5_EN_MASK-Bits zu löschen. |
| 4 | RW | 0x0 | PLDO4_EN_MASK PLDO4_EN_MASK: Zum Ändern von PLDO4_EN muss1 geschrieben werden; nach Schreiben von PLDO4_EN sind PLDO4_EN_MASK-Bits zu löschen. |
| 3 | RW | 0x0 | RESV: reserviert |
| 2 | RW | OTP | NLDO5_EN NLDO5_EN: NLDO5-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 1 | RW | OTP | PLDO5_EN PLDO5_EN: PLDO5-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 0 | RW | OTP | PLDO4_EN PLDO4_EN: PLDO4-Freigabe im Aktivmodus;1 aktiv,0 inaktiv. Standard durch OTP. |

### 0x06 — POWER_SLP_EN0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | OTP | BUCK8_SLP_EN BUCK8_SLP_EN: BUCK8-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 6 | RW | OTP | BUCK7_SLP_EN BUCK7_SLP_EN: BUCK7-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 5 | RW | OTP | BUCK6_SLP_EN BUCK6_SLP_EN: BUCK6-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 4 | RW | OTP | BUCK5_SLP_EN BUCK5_SLP_EN: BUCK5-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 3 | RW | OTP | BUCK4_SLP_EN BUCK4_SLP_EN: BUCK4-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 2 | RW | OTP | BUCK3_SLP_EN BUCK3_SLP_EN: BUCK3-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 1 | RW | OTP | BUCK2_SLP_EN BUCK2_SLP_EN: BUCK2-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 0 | RW | OTP | BUCK1_SLP_EN BUCK1_SLP_EN: BUCK1-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |

### 0x07 — POWER_SLP_EN1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | OTP | BUCK10_SLP_EN BUCK10_SLP_EN: BUCK10-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 6 | RW | OTP | BUCK9_SLP_EN BUCK9_SLP_EN: BUCK9-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 5 | RW | OTP | RESV: reserviert |
| 4 | RW | OTP | NLDO5_SLP_EN NLDO5_SLP_EN: NLDO5-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 3 | RW | OTP | NLDO4_SLP_EN NLDO4_SLP_EN: NLDO4-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 2 | RW | OTP | NLDO3_SLP_EN NLDO3_SLP_EN: NLDO3-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 1 | RW | OTP | NLDO2_SLP_EN NLDO2_SLP_EN: NLDO2-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 0 | RW | OTP | NLDO1_SLP_EN NLDO1_SLP_EN: NLDO1-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |

### 0x08 — POWER_SLP_EN2

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV: reserviert |
| 5 | RW | OTP | PLDO5_SLP_EN PLDO5_SLP_EN: PLDO5-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 4 | RW | OTP | PLDO4_SLP_EN PLDO4_SLP_EN: PLDO4-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 3 | RW | OTP | PLDO3_SLP_EN PLDO3_SLP_EN: PLDO3-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 2 | RW | OTP | PLDO2_SLP_EN PLDO2_SLP_EN: PLDO2-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 1 | RW | OTP | PLDO1_SLP_EN PLDO1_SLP_EN: PLDO1-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |
| 0 | RW | OTP | PLDO6_SLP_EN PLDO6_SLP_EN: PLDO6-Freigabe im Schlafmodus;1 aktiv,0 inaktiv. Standard durch OTP. |

### 0x09 — POWER_DISCHRG_EN0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x1 | BUCK8_DISCHG_EN BUCK8_DISCHG_EN: BUCK8-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 6 | RW | 0x1 | BUCK7_DISCHG_EN BUCK7_DISCHG_EN: BUCK7-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 5 | RW | 0x1 | BUCK6_DISCHG_EN BUCK6_DISCHG_EN: BUCK6-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 4 | RW | 0x1 | BUCK5_DISCHG_EN BUCK5_DISCHG_EN: BUCK5-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 3 | RW | 0x1 | BUCK4_DISCHG_EN BUCK4_DISCHG_EN: BUCK4-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 2 | RW | 0x1 | BUCK3_DISCHG_EN BUCK3_DISCHG_EN: BUCK3-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 1 | RW | 0x1 | BUCK2_DISCHG_EN BUCK2_DISCHG_EN: BUCK2-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 0 | RW | 0x1 | BUCK1_DISCHG_EN BUCK1_DISCHG_EN: BUCK1-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |

### 0x0A — POWER_DISCHRG_EN1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x1 | BUCK10_DISCHG_EN BUCK10_DISCHG_EN: BUCK10-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 6 | RW | 0x1 | BUCK9_DISCHG_EN BUCK9_DISCHG_EN: BUCK9-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 5 | RW | 0x0 | RESV: reserviert |
| 4 | RW | 0x1 | NLDO5_DISCHG_EN NLDO5_DISCHG_EN: NLDO5-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 3 | RW | 0x1 | NLDO4_DISCHG_EN NLDO4_DISCHG_EN: NLDO4-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 2 | RW | 0x1 | NLDO3_DISCHG_EN NLDO3_DISCHG_EN: NLDO3-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 1 | RW | 0x1 | NLDO2_DISCHG_EN NLDO2_DISCHG_EN: NLDO2-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 0 | RW | 0x1 | NLDO1_DISCHG_EN NLDO1_DISCHG_EN: NLDO1-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |

### 0x0B — POWER_DISCHRG_EN2

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV: reserviert |
| 5 | RW | 0x1 | PLDO6_DISCHG_EN PLDO6_DISCHG_EN: PLDO6-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 4 | RW | 0x1 | PLDO5_DISCHG_EN PLDO5_DISCHG_EN: PLDO5-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 3 | RW | 0x1 | PLDO4_DISCHG_EN PLDO4_DISCHG_EN: PLDO4-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 2 | RW | 0x1 | PLDO3_DISCHG_EN PLDO3_DISCHG_EN: PLDO3-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 1 | RW | 0x1 | PLDO2_DISCHG_EN PLDO2_DISCHG_EN: PLDO2-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |
| 0 | RW | 0x1 | PLDO1_DISCHG_EN PLDO1_DISCHG_EN: PLDO1-Entladung bei ausgeschaltetem Kanal;0 aus,1 ein. |

### 0x0C — BUCK_FB_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK10_LP_EN BUCK10_LP_EN: Stromsparfunktion von BUCK10;0 aus,1 ein. |
| 6 | RW | 0x0 | BUCK9_LP_EN BUCK9_LP_EN: Stromsparfunktion von BUCK9;0 aus,1 ein. |
| 5 | RW | 0x0 | RESV: reserviert |
| 4 | RW | 0x0 | PLDO_SLP_LP_EN PLDO_SLP_LP_EN: Stromsparfunktion von PLDO;0 aus,1 ein. |
| 3 | RW | 0x0 | NLDO_SLP_LP_EN NLDO_SLP_LP_EN: Stromsparfunktion von NLDO;0 aus,1 ein. |
| 2 | RW | 0x0 | BK_LDO3V_LPEN BUCK3_LP_EN: Stromsparfunktion von 3VLDO;0 aus,1 ein. |
| 1 | RW | 0x0 | BK_LDO3V_BPEN BK_LDO3V_BPEN: Freigabebit zum Abschalten des3V-LDO und Kurzschließen an VDD 0 aus,1 ein |
| 0 | RW | 0X1 | BK_LDO3V_EN BK_LDO3V_EN: Freigabebit von BK_LDO3V 0 aus,1 ein |

### 0x0D — SLP_LP_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_LP_EN BUCK8_LP_EN: Stromsparfunktion von BUCK8;0 aus,1 ein. |
| 6 | RW | 0x0 | BUCK7_LP_EN BUCK7_LP_EN: Stromsparfunktion von BUCK7;0 aus,1 ein. |
| 5 | RW | 0x0 | BUCK6_LP_EN BUCK6_LP_EN: Stromsparfunktion von BUCK6;0 aus,1 ein. |
| 4 | RW | 0x0 | BUCK5_LP_EN BUCK5_LP_EN: Stromsparfunktion von BUCK5;0 aus,1 ein. |
| 3 | RW | 0x0 | BUCK4_LP_EN BUCK4_LP_EN: Stromsparfunktion von BUCK4;0 aus,1 ein. |
| 2 | RW | 0x0 | BUCK3_LP_EN BUCK3_LP_EN: Stromsparfunktion von BUCK3;0 aus,1 ein. |
| 1 | RW | 0x0 | BUCK2_LP_EN BUCK2_LP_EN: Stromsparfunktion von BUCK2;0 aus,1 ein. |
| 0 | RW | 0X1 | BUCK1_LP_EN BUCK1_LP_EN: Stromsparfunktion von BUCK1;0 aus,1 ein. |

### 0x0E — POWER_FPWM_EN0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_ON_FPWM BUCK8_ON_FPWM: Erzwungener PWM-Modus von BUCK8;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |
| 6 | RW | 0x0 | BUCK7_ON_FPWM BUCK7_ON_FPWM: Erzwungener PWM-Modus von BUCK7;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |
| 5 | RW | 0x0 | BUCK6_ON_FPWM BUCK6_ON_FPWM: Erzwungener PWM-Modus von BUCK6;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |
| 4 | RW | 0x0 | BUCK5_ON_FPWM BUCK5_ON_FPWM: Erzwungener PWM-Modus von BUCK5;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |
| 3 | RW | 0x0 | BUCK4_ON_FPWM BUCK4_ON_FPWM: Erzwungener PWM-Modus von BUCK4;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |
| 2 | RW | 0x0 | BUCK3_ON_FPWM BUCK3_ON_FPWM: Erzwungener PWM-Modus von BUCK3;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |
| 1 | RW | 0x0 | BUCK2_ON_FPWM BUCK2_ON_FPWM: Erzwungener PWM-Modus von BUCK2;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |
| 0 | RW | 0X1 | BUCK1_ON_FPWM BUCK1_ON_FPWM: Erzwungener PWM-Modus von BUCK1;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |

### 0x0F — POWER_FPWM_EN1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:2 | RW | 0x0 | RESV: reserviert |
| 1 | RW | 0x0 | BUCK10_ON_FPWM BUCK10_ON_FPWM: Erzwungener PWM-Modus von BUCK10;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |
| 0 | RW | 0X1 | BUCK9_ON_FPWM BUCK9_ON_FPWM: Erzwungener PWM-Modus von BUCK9;1 erzwingt PWM im Aktivmodus,0 automatische PWM/PFM-Umschaltung. |

### 0x10 — BUCK1_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK1_RATE BUCK1_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EB. 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK1_ILPK BUCK1_ILPK: Spitzenstromgrenze von BUCK1; zwingend gemeinsam mit BUCK1_ ILVL einstellen, identischen Code schreiben. 000:6.4A 001:7.0A 010:7.6A 011:8.3A 100:9A 101:9.8A 110:10.7A 111:11.6A |
| 2:0 | RW | 0x4 | BUCK1_ILVL BUCK1_ILVL: Talstromgrenze von BUCK1; gemeinsam mit BUCK1_ ILPK einstellen, identischen Code schreiben. 000:5.0A 001:5.4A 010:5.9A 011:6.4A 100:7A 101:7.6A 110:8.3A 111:9.0A |

### 0x11 — BUCK2_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK2_RATE BUCK2_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EB. 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK2_ILPK BUCK2_ILPK: Spitzenstromgrenze von BUCK1; zwingend gemeinsam mit BUCK2_ILVL einstellen, identischen Code schreiben. 000:4.8A 001:5.3A 010:5.8A 011:6.4A 100:7A 101:7.7A 110:8.5A 111:9.3A |
| 2:0 | RW | 0x4 | BUCK2_ILVL BUCK2_ILVL: Talstromgrenze von BUCK2; gemeinsam mit BUCK2_ILPK einstellen, identischen Code schreiben. 000:3.4A 001:3.8A 010:4.1A 011:4.5A 100:5A 101:5.5A 110:6.1A 111:6.7A |

### 0x12 — BUCK3_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK3_RATE BUCK3_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EB. 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK3_ILPK BUCK3_ILPK: Spitzenstromgrenze von BUCK3; zwingend gemeinsam mit BUCK3_ILVL einstellen, identischen Code schreiben. 000:4.8A 001:5.3A 010:5.8A 011:6.4A 100:7A 101:7.7A 110:8.5A 111:9.3A |
| 2:0 | RW | 0x4 | BUCK3_ILVL BUCK3_ILVL: Talstromgrenze von BUCK3; gemeinsam mit BUCK3_ILPK einstellen, identischen Code schreiben. 000:3.4A 001:3.8A 010:4.1A 011:4.6A 100:5A 101:5.5A 110:6.1A 111:6.7A |

### 0x13 — BUCK4_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK4_RATE BUCK4_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EB. 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK4_ILPK BUCK4_ILPK: Spitzenstromgrenze von BUCK4; zwingend gemeinsam mit BUCK4_ILVL einstellen, identischen Code schreiben. 000:4.8A 001:5.3A 010:5.8A 011:6.4A 100:7A 101:7.7A 110:8.5A 111:9.3A |
| 2:0 | RW | 0x4 | BUCK4_ILVL BUCK4_ILVL: Talstromgrenze von BUCK4; gemeinsam mit BUCK4_ILPK einstellen, identischen Code schreiben. 000:3.4A 001:3.8A 010:4.1A 011:4.5A 100:5A 101:5.5A 110:6.1A 111:6.7A |

### 0x14 — BUCK5_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK5_RATE BUCK5_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EB. 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK5_ILPK BUCK5_ILPK: Spitzenstromgrenze von BUCK5; zwingend gemeinsam mit BUCK5_ILVL einstellen, identischen Code schreiben. 000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK5_ILVL BUCK5_ILVL: Talstromgrenze von BUCK5; gemeinsam mit BUCK5_ILPK einstellen, identischen Code schreiben. 000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x15 — BUCK6_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK6_RATE BUCK6_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EB. 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK6_ILPK BUCK6_ILPK: Spitzenstromgrenze von BUCK6; zwingend gemeinsam mit BUCK6_ILVL einstellen, identischen Code schreiben. 000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK6_ILVL BUCK6_ILVL: Talstromgrenze von BUCK6; gemeinsam mit BUCK6_ILPK einstellen, identischen Code schreiben. 000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x16 — BUCK7_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK7_RATE BUCK7_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EB. 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK7_ILPK BUCK7_ILPK: Spitzenstromgrenze von BUCK7; zwingend gemeinsam mit BUCK1_ILVL einstellen, identischen Code schreiben. 000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK7_ILVL BUCK7_ILVL: Talstromgrenze von BUCK7; gemeinsam mit BUCK7_ILPK einstellen, identischen Code schreiben. 000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x17 — BUCK8_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK8_RATE BUCK8_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EB. 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK8_ILPK BUCK8_ILPK: Spitzenstromgrenze von BUCK8; zwingend gemeinsam mit BUCK8_ILVL einstellen, identischen Code schreiben. 000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK8_ILVL BUCK8_ILVL: Talstromgrenze von BUCK8; gemeinsam mit BUCK8_ILPK einstellen, identischen Code schreiben. 000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x18 — BUCK9_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK9_RATE BUCK9_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EA. 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK9_ILPK BUCK9_ILPK: Spitzenstromgrenze von BUCK9; zwingend gemeinsam mit BUCK9_ILVL einstellen, identischen Code schreiben. 000:2.7A 010:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK9_ILVL BUCK9_ILVL: Talstromgrenze von BUCK9; gemeinsam mit BUCK9_ILPK einstellen, identischen Code schreiben. 000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x19 — BUCK10_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK10_RATE BUCK10_RATE: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit; BIT&lt;2&gt; im Register EA. 000: 4lsb/1clk;001: 2lsb/4clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK10_ILPK BUCK10_ILPK: Spitzenstromgrenze von BUCK10; zwingend gemeinsam mit BUCK10_ILVL einstellen, identischen Code schreiben. 000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK10_ILVL BUCK10_ILVL: Talstromgrenze von BUCK10; gemeinsam mit BUCK10_ILPK einstellen, identischen Code schreiben. 000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x1A — BUCK1_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK1_ON_VSEL BUCK1_ON_VSEL: BUCK1-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x1B — BUCK2_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK2_ON_VSEL BUCK2_ON_VSEL: BUCK2-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x1C — BUCK3_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK3_ON_VSEL BUCK3_ON_VSEL: BUCK3-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x1D — BUCK4_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK4_ON_VSEL BUCK4_ON_VSEL: BUCK4-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x1E — BUCK5_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK5_ON_VSEL BUCK5_ON_VSEL: BUCK5-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x1F — BUCK6_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK6_ON_VSEL BUCK6_ON_VSEL: BUCK1-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x20 — BUCK7_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK7_ON_VSEL BUCK7_ON_VSEL: BUCK7-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x21 — BUCK8_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK8_ON_VSEL BUCK8_ON_VSEL: BUCK8-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x22 — BUCK9_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK9_ON_VSEL BUCK9_ON_VSEL: BUCK9-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x23 — BUCK10_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK10_ON_VSEL BUCK10_ON_VSEL: BUCK10-Spannung im Aktivmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x24 — BUCK1_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK1_SLP_VSEL BUCK1_SLP_VSEL: BUCK1-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x25 — BUCK2_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK2_SLP_VSEL BUCK2_SLP_VSEL: BUCK2-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x26 — BUCK3_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK3_SLP_VSEL BUCK3_SLP_VSEL: BUCK3-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x27 — BUCK4_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK4_SLP_VSEL BUCK4_SLP_VSEL: BUCK4-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x28 — BUCK5_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK5_SLP_VSEL BUCK5_SLP_VSEL: BUCK5-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x29 — BUCK6_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK6_SLP_VSEL BUCK6_SLP_VSEL: BUCK6-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x2A — BUCK7_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK7_SLP_VSEL BUCK7_SLP_VSEL: BUCK7-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x2B — BUCK8_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK8_SLP_VSEL BUCK8_SLP_VSEL: BUCK8-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x2C — BUCK9_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK9_SLP_VSEL BUCK9_SLP_VSEL: BUCK9-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x2D — BUCK10_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK10_SLP_VSEL BUCK10_SLP_VSEL: BUCK10-Spannung im Schlafmodus, 0.5V~1.5V(Schritt=6.25mV), 1.5~3.4V(Schritt=25mV). Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x3C — BUCK_DEBUG13

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK2_CMIN_ENB BUCK2_CMIN_ENB: BUCK2 Mindeststrombegrenzung freigeben. 0 ein,1 aus |
| 6:4 | RW | 0x4 | BUCK2_CMIN_SEL BUCK2_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK2. 000:1.1A; 001:1A; 010:0.906A; 011:0.805A; 100:0.716A; 101:0.636A; 110:0.566A; 111:0.503A |
| 3 | RW | 0x0 | BUCK1_CMIN_ENB BUCK1_CMIN_ENB: BUCK1 Mindeststrombegrenzung freigeben. 0 ein,1 aus |
| 2:0 | RW | 0x4 | BUCK1_CMIN_SEL BUCK1_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK1. 000:1.1A; 001:1A; 010:0.906A; 011:0.805A; 100:0.716A; 101:0.636A; 110:0.566A; 111:0.503A |

### 0x3D — BUCK_DEBUG14

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK4_CMIN_ENB BUCK4_CMIN_ENB: BUCK4 Mindeststrombegrenzung freigeben. 0 ein,1 aus |
| 6:4 | RW | 0x4 | BUCK4_CMIN_SEL BUCK4_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK4. 000:1.1A; 001:1A; 010:0.906A; 011:0.805A; 100:0.716A; 101:0.636A; 110:0.566A; 111:0.503A |
| 3 | RW | 0x0 | BUCK3_CMIN_ENB BUCK3_CMIN_ENB: BUCK3 Mindeststrombegrenzung freigeben. 0 ein,1 aus |
| 2:0 | RW | 0x4 | BUCK3_CMIN_SEL BUCK3_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK3. 000:1.1A; 001:1A; 010:0.906A; 011:0.805A; 100:0.716A; 101:0.636A; 110:0.566A; 111:0.503A |

### 0x3E — BUCK_DEBUG15

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK6_CMIN_ENB BUCK6_CMIN_ENB: BUCK6 Mindeststrombegrenzung freigeben. 0 ein,1 aus |
| 6:4 | RW | 0x4 | BUCK6_CMIN_SEL BUCK6_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK6. 000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |
| 3 | RW | 0x0 | BUCK5_CMIN_ENB BUCK5_CMIN_ENB: BUCK5 Mindeststrombegrenzung freigeben. 0 ein,1 aus |
| 2:0 | RW | 0x4 | BUCK5_CMIN_SEL BUCK5_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK5. 000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |

### 0x3F — BUCK_DEBUG16

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_CMIN_ENB BUCK8_CMIN_ENB: BUCK8 Mindeststrombegrenzung freigeben. 0 ein,1 aus |
| 6:4 | RW | 0x4 | BUCK8_CMIN_SEL BUCK8_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK8. 000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |
| 3 | RW | 0x0 | BUCK7_CMIN_ENB BUCK7_CMIN_ENB: BUCK7 Mindeststrombegrenzung freigeben. 0 ein,1 aus |
| 2:0 | RW | 0x4 | BUCK7_CMIN_SEL BUCK7_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK7. 000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |

### 0x40 — BUCK_DEBUG17

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK10_CMIN_ENB BUCK10_CMIN_ENB: BUCK10 Mindeststrom Begrenzung freigeben. 0 ein,1 aus |
| 6:4 | RW | 0x4 | BUCK10_CMIN_SEL BUCK10_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK10. 000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |
| 3 | RW | 0x0 | BUCK9_CMIN_ENB BUCK9_CMIN_ENB: BUCK9 Mindeststrombegrenzung freigeben. 0 ein,1 aus |
| 2:0 | RW | 0x4 | BUCK9_CMIN_SEL BUCK9_CMIN_SEL: Auswahl der Mindeststromgrenze BUCK9. 000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |

### 0x42 — NLDO_IMAX

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | RESV: reserviert |
| 6 | RW | 0x0 | RESV: reserviert |
| 5 | RW | 0x0 | RESV: reserviert |
| 4 | RW | 0x0 | NLDO5_IMAX NLDO5_IMAX: NLDO5-Stromgrenze;0 normal,1 —130% des Normalwerts. |
| 3 | RW | 0x0 | NLDO4_IMAX NLDO4_IMAX: NLDO4-Stromgrenze;0 normal,1 —130% des Normalwerts. |
| 2 | RW | 0x0 | NLDO3_IMAX NLDO3_IMAX: NLDO3-Stromgrenze;0 normal,1 —130% des Normalwerts. |
| 1 | RW | 0x0 | NLDO2_IMAX NLDO2_IMAX: NLDO2-Stromgrenze;0 normal,1 —130% des Normalwerts. |
| 0 | RW | 0x0 | NLDO1_IMAX NLDO1_IMAX: NLDO1-Stromgrenze;0 normal,1 —130% des Normalwerts. |

### 0x43 — NLDO1_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO1_ON_VSEL NLDO1_ON_VSEL: NLDO1-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x44 — NLDO2_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO2_ON_VSEL NLDO2_ON_VSEL: NLDO2-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x45 — NLDO3_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO3_ON_VSEL NLDO3_ON_VSEL: NLDO3-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x46 — NLDO4_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO4_ON_VSEL NLDO4_ON_VSEL: NLDO4-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x47 — NLDO5_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO5_ON_VSEL NLDO5_ON_VSEL: NLDO5-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x48 — NLDO1_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO1_SLP_VSEL NLDO1_SLP_VSEL: NLDO1-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x49 — NLDO2_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO2_SLP_VSEL NLDO2_SLP_VSEL: NLDO2-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x4A — NLDO3_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO3_SLP_VSEL NLDO3_SLP_VSEL: NLDO3-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x4B — NLDO4_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO4_SLP_VSEL NLDO4_SLP_VSEL: NLDO4-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x4C — NLDO5_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO5_SLP_VSEL NLDO5_SLP_VSEL: NLDO5-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x4D — PLDO_IMAX

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV: reserviert |
| 5 | RW | 0x0 | PLDO6_IMAX PLDO6_IMAX: PLDO6-Stromgrenze;0 normal,1 —130% des Normalwerts. |
| 4 | RW | 0x0 | PLDO5_IMAX PLDO5_IMAX: PLDO5-Stromgrenze;0 normal,1 —130% des Normalwerts. |
| 3 | RW | 0x0 | PLDO4_IMAX PLDO4_IMAX: PLDO4-Stromgrenze;0 normal,1 —130% des Normalwerts. |
| 2 | RW | 0x0 | PLDO3_IMAX PLDO3_IMAX: PLDO3-Stromgrenze;0 normal,1 —130% des Normalwerts. |
| 1 | RW | 0x0 | PLDO2_IMAX PLDO2_IMAX: PLDO2-Stromgrenze;0 normal,1 —130% des Normalwerts. |
| 0 | RW | 0x0 | PLDO1_IMAX PLDO1_IMAX: PLDO1-Stromgrenze;0 normal,1 —130% des Normalwerts. |

### 0x4E — PLDO1_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO1_ON_VSEL PLDO1_ON_VSEL: PLDO1-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x4F — PLDO2_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO2_ON_VSEL PLDO2_ON_VSEL: PLDO2-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x50 — PLDO3_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO3_ON_VSEL PLDO3_ON_VSEL: PLDO3-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x51 — PLDO4_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO4_ON_VSEL PLDO4_ON_VSEL: PLDO4-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x52 — PLDO5_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO5_ON_VSEL PLDO5_ON_VSEL: PLDO5-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x53 — PLDO6_ON_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO6_ON_VSEL PLDO6_ON_VSEL: PLDO6-Spannung im Aktivmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x54 — PLDO1_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO1_ON_VSEL PLDO1_ON_VSEL: PLDO1-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x55 — PLDO2_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO2_ON_VSEL PLDO2_ON_VSEL: PLDO2-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x56 — PLDO3_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO3_ON_VSEL PLDO3_ON_VSEL: PLDO3-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x57 — PLDO4_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO4_ON_VSEL PLDO4_ON_VSEL: PLDO4-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x58 — PLDO5_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO5_ON_VSEL PLDO5_ON_VSEL: PLDO5-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x59 — PLDO6_SLP_VSEL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO6_ON_VSEL PLDO6_ON_VSEL: PLDO6-Spannung im Schlafmodus, 0.5V~3.4V(Schritt=12.5mV).. Bitdekodierung im von der Quelle genannten Blatt „Decode“; Standard durch OTP. |

### 0x5A — CHIP_VER

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RO | 0x80 | CHIP_NAME&lt;11:4&gt; CHIP_NAME&lt;11:4&gt;: RK806 |

### 0x5B — CHIP_VER

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:4 | RO | 0x6 | CHIP_NAME&lt;3:0&gt; CHIP_NAME&lt;3:0&gt;: RK806 |
| 3:0 | RO | 0x2 | CHIP_VER&lt;3:0&gt; CHIP_VER&lt;3:0&gt;:Chipversion |

### 0x5C — OTP_VER

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:4 | RO | 0x0 | RESV: reserviert |
| 3:0 | RO | OTP | OTP_VER&lt;3:0&gt; OTP_VER&lt;3:0&gt;: OTP-Version |

### 0x5D — SYS_STS

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RO | 0x0 | PWRON_STS PWRON_STS : PWRON-Tastenzustand:0 losgelassen,1 gedrückt |
| 6 | RO | 0x0 | VDC_STS VDC_STS: 0 Low;1 High |
| 5 | RO | 0x0 | VB_UV_STS VB_UV_STS: VCC1-Unterspannungssperre (bei1 System abschalten) |
| 4 | RO | 0x0 | VB_LO_STS VB_LO_STS: Batterie-Unterspannungszustand 0: VCC1&gt;VB_LO_SEL 1: VCC1&lt;VB_LO_SEL |
| 3 | RO | 0x0 | HOTDIE_STS HOTDIE_STS: Chip-Übertemperaturwarnung |
| 2 | RO | 0x0 | TSD_STS TSD_STS: thermische Abschaltung |
| 1 | RO | 0x0 | RESV: reserviert |
| 0 | RO | 0x0 | VB_OV_STS VB_OV_STS: SYS-Überspannung aufgetreten |

### 0x5E — SYS_CFG0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | VB_UV_DLY VB_UV_DLY: wirksame Abschaltzeit bei VCC1-Unterspannung 0:5us 1:50us |
| 6:4 | RW | 0x0 | VB_UV_SEL VB_UV_SEL: :System-Abschaltspannung wählen 000~111:2.7v~3.4v |
| 3 | RW | 0x1 | VB_LO_ACT VB_LO_ACT: Aktion bei niedrigem VCC1:0 abschalten,1 Interrupt |
| 2:0 | RW | 0x4 | VB_LO_SEL VB_LO_SEL: VCC1-Unterspannungsschwelle 000~111: 2.8V~ 3.5V, Schritt=100mV |

### 0x5F — SYS_CFG1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | ABNORDET_ENB ABNORDET_ENB: Fehlererkennung freigeben 0 ein,1 aus |
| 6 | RW | 0x0 | TSD_TEMP TSD_TEMP: TSD_TEMP: thermische Abschalttemperatur 0: 140℃; 1: 160℃ |
| 5:4 | RW | 0x0 | HOTDIE_TEMP HOTDIE_TEMP: Chip-Übertemperaturschwelle 00:85℃ 01:95℃ 10:105℃ 11:115℃ |
| 3 | RW | 0x0 | SYS_OV_SD_EN SYS_OV_SD_EN: BUCK1~10 bei VCC1-Überspannung abschalten 0 aus,1 ein |
| 2 | RW | 0x0 | SYS_OV_SD_DLY_SEL SYS_OV_SD_DLY_SEL: SYS-OV-Komparatorverzögerung wählen 0: 8uS 1:30uS |
| 1:0 | RW | 0x0 | DLY_ABN_SHORT DLY_ABN_SHORT: Fehlererkennungsverzögerung 00:x1 01:x0.875 10:x0.75 11:x0.625 |

### 0x61 — SYS_OPTION

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0  | VBUVLOCK_EN VBUVLOCK_EN: UV nach Start verriegeln 0 aus,1 ein |
| 6 | RW | 0x0 | BG_PW_SEL BG_PW_SEL : interne Versorgung wählen 0：VCCRTC 1:LDO3V |
| 5:4 | RW | 0x0 | VCCXDET_DIS VCCXDET_DIS：OVP/UVLO/VB_LO wirken auf 00:VCCA,VCC1,VCC2 01: VCCA, VCC2 10:VCCA,VCC1 11: VCCA |
| 3 | RW | 0x0 | RESV: reserviert |
| 2 | RW | 0x0 | TDLY_ABN_LONG TDLY_ABN_LONG: Fehlererkennungsverzögerung 0: x1 1:x1.5 |
| 1 | RW | 0x0 | 2M_ENB2 2M_ENB2: digitalen2MHz-Ausgangstakt zwangsweise freigeben 0 ein,1 aus |
| 0 | RW | 0x0 | 32K_ENB 32K_ENB: digitalen32KHz-Ausgangstakt zwangsweise freigeben 0 ein,1 aus |

### 0x62 — PWRCTRL_CONFIG0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x1 | PWRCTRL2_POL PWRCTRL2_POL: PWRCTRL2 Pin Polarität 0 aktiv Low,1 aktiv High |
| 6:4 | RW | 0x0 | PWRCTRL2_FUN PWRCTRL2_FUN: PWRCTRL2-Funktionswahl, Reaktion nach100us. 000 ohne Wirkung;001 aktiv: SLEEP, inaktiv: SLEEP verlassen;010 aktiv: PMIC abschalten;011 aktiv: Neustart;100 aktiv: Versorgung der Gruppe n auf XX_SLP_VSEL, inaktiv auf XX_ON_VSEL. Vor Verlassen dieser Spannungswahl XX_VSEL_CTR_SEL zurücksetzen;101 GPIO. |
| 3 | RW | 0x1 | PWRCTRL1_POL PWRCTRL1_POL: PWRCTRL1 Pin Polarität 0 aktiv Low,1 aktiv High |
| 2:0 | RW | 0x0 | PWRCTRL1_FUN PWRCTRL1_FUN: PWRCTRL1-Funktionswahl, Reaktion nach100us. 000 ohne Wirkung;001 aktiv: SLEEP, inaktiv: SLEEP verlassen;010 aktiv: PMIC abschalten;011 aktiv: Neustart;100 aktiv: Versorgung der Gruppe n auf XX_SLP_VSEL, inaktiv auf XX_ON_VSEL. Vor Verlassen dieser Spannungswahl XX_VSEL_CTR_SEL zurücksetzen;101 GPIO. |

### 0x63 — PWRCTRL_CONFIG1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:4 | RW | 0x0 | RESV: reserviert |
| 3 | RW | 0x1 | PWRCTRL3_POL PWRCTRL3_POL: PWRCTRL3 Pin Polarität 0 aktiv Low,1 aktiv High |
| 2:0 | RW | 0x0 | PWRCTRL3_FUN PWRCTRL3_FUN: PWRCTRL3-Funktionswahl, Reaktion nach100us. 000 ohne Wirkung;001 aktiv: SLEEP, inaktiv: SLEEP verlassen;010 aktiv: PMIC abschalten;011 aktiv: Neustart;100 aktiv: Versorgung der Gruppe n auf XX_SLP_VSEL, inaktiv auf XX_ON_VSEL. Vor Verlassen dieser Spannungswahl XX_VSEL_CTR_SEL zurücksetzen;101 GPIO. |

### 0x64 — VSEL_CTR_SEL0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK2_DVS_CTR_SEL BUCK2_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL(1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | BUCK2_VSEL_CTR_SEL BUCK2_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK2_VSEL wählt BUCK2_ON_VSEL oder BUCK2_SLP_VSEL; und O_ BUCK2_EN wählt BUCK2_EN oder BUCK2_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK2_VSEL wählt BUCK2_ON_VSEL oder BUCK2_SLP_VSEL; und O_ BUCK2_EN wählt BUCK2_EN oder BUCK2_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK2_VSEL wählt BUCK2_ON_VSEL oder BUCK2_SLP_VSEL; und O_ BUCK2_EN wählt BUCK2_EN oder BUCK2_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |
| 3:2 | RW | 0x0 | BUCK1_DVS_CTR_SEL BUCK1_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | BUCK1_VSEL_CTR_SEL BUCK1_ VSEL _CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK1_VSEL wählt BUCK1_ON_VSEL oder BUCK1_SLP_VSEL; und O_ BUCK1_EN wählt BUCK1_EN oder BUCK1_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK1_VSEL wählt BUCK1_ON_VSEL oder BUCK1_SLP_VSEL; und O_ BUCK1_EN wählt BUCK1_EN oder BUCK1_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK1_VSEL wählt BUCK1_ON_VSEL oder BUCK1_SLP_VSEL; und O_ BUCK1_EN wählt BUCK1_EN oder BUCK1_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x65 — VSEL _CTR_SEL1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK4_DVS_CTR_SEL BUCK4_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | BUCK4_VSEL_CTR_SEL BUCK4_ VSEL _CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK4_VSEL wählt BUCK4_ON_VSEL oder BUCK4_SLP_VSEL; und O_ BUCK4_EN wählt BUCK4_EN oder BUCK4_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK4_VSEL wählt BUCK4_ON_VSEL oder BUCK4_SLP_VSEL; und O_ BUCK4_EN wählt BUCK4_EN oder BUCK4_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK4_VSEL wählt BUCK4_ON_VSEL oder BUCK4_SLP_VSEL; und O_ BUCK4_EN wählt BUCK4_EN oder BUCK2_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. \ |
| 3:2 | RW | 0x0 | BUCK3_DVS_CTR_SEL BUCK3_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | BUCK3_VSEL_CTR_SEL BUCK3_ VSEL _CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK3_VSEL wählt BUCK3_ON_VSEL oder BUCK3_SLP_VSEL; und O_ BUCK3_EN wählt BUCK3_EN oder BUCK3_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK3_VSEL wählt BUCK3_ON_VSEL oder BUCK3_SLP_VSEL; und O_ BUCK3_EN wählt BUCK3_EN oder BUCK3_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK3_VSEL wählt BUCK3_ON_VSEL oder BUCK3_SLP_VSEL; und O_ BUCK3_EN wählt BUCK3_EN oder BUCK3_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x66 — VSEL_CTR_SEL2

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK6_DVS_CTR_SEL BUCK6_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | BUCK6_VSEL_CTR_SEL BUCK6_ VSEL _CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK6_VSEL wählt BUCK6_ON_VSEL oder BUCK6_SLP_VSEL; und O_ BUCK6_EN wählt BUCK6_EN oder BUCK6_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK6_VSEL wählt BUCK6_ON_VSEL oder BUCK6_SLP_VSEL; und O_ BUCK6_EN wählt BUCK6_EN oder BUCK6_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK6_VSEL wählt BUCK6_ON_VSEL oder BUCK6_SLP_VSEL; und O_ BUCK6_EN wählt BUCK6_EN oder BUCK6_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |
| 3:2 | RW | 0x0 | BUCK5_DVS_CTR_SEL BUCK5_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | BUCK5_VSEL_CTR_SEL BUCK5_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK5_VSEL wählt BUCK5_ON_VSEL oder BUCK5_SLP_VSEL; und O_ BUCK5_EN wählt BUCK5_EN oder BUCK5_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK5_VSEL wählt BUCK5_ON_VSEL oder BUCK5_SLP_VSEL; und O_ BUCK5_EN wählt BUCK5_EN oder BUCK5_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK5_VSEL wählt BUCK5_ON_VSEL oder BUCK5_SLP_VSEL; und O_ BUCK5_EN wählt BUCK5_EN oder BUCK5_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x67 — VSEL_CTR_SEL3

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK8_DVS_CTR_SEL BUCK8_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | BUCK8_VSEL_CTR_SEL BUCK8_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK8_VSEL wählt BUCK8_ON_VSEL oder BUCK8_SLP_VSEL; und O_ BUCK8_EN wählt BUCK8_EN oder BUCK8_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK8_VSEL wählt BUCK8_ON_VSEL oder BUCK8_SLP_VSEL; und O_ BUCK8_EN wählt BUCK8_EN oder BUCK8_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK8_VSEL wählt BUCK8_ON_VSEL oder BUCK8_SLP_VSEL; und O_ BUCK8_EN wählt BUCK8_EN oder BUCK8_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |
| 3:2 | RW | 0x0 | BUCK7_DVS_CTR_SEL BUCK7_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | BUCK7_VSEL_CTR_SEL BUCK7_VSE _CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK7_VSEL wählt BUCK7_ON_VSEL oder BUCK7_SLP_VSEL; und O_ BUCK7_EN wählt BUCK7_EN oder BUCK7_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK7_VSEL wählt BUCK7_ON_VSEL oder BUCK7_SLP_VSEL; und O_ BUCK7_EN wählt BUCK7_EN oder BUCK7_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK7_VSEL wählt BUCK7_ON_VSEL oder BUCK7_SLP_VSEL; und O_ BUCK7_EN wählt BUCK7_EN oder BUCK7_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x68 — VSEL_CTR_SEL4

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK10_DVS_CTR_SEL BUCK10_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | BUCK10_VSEL_CTR_SEL BUCK10_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK10_VSEL wählt BUCK10_ON_VSEL oder BUCK10_SLP_VSEL; und O_ BUCK10_EN wählt BUCK10_EN oder BUCK10_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK10_VSEL wählt BUCK10_ON_VSEL oder BUCK10_SLP_VSEL; und O_ BUCK10_EN wählt BUCK10_EN oder BUCK10_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK10_VSEL wählt BUCK10_ON_VSEL oder BUCK10_SLP_VSEL; und O_ BUCK10_EN wählt BUCK10_EN oder BUCK10_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |
| 3:2 | RW | 0x0 | BUCK9_DVS_CTR_SEL BUCK9_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | BUCK9_VSEL_CTR_SEL BUCK9_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCTRL1:（PWRCTRL1 Signal steuert O_BUCK9_VSEL wählt BUCK9_ON_VSEL oder BUCK9_SLP_VSEL; und O_ BUCK9_EN wählt BUCK9_EN oder BUCK9_SLP_EN） 10：gesteuert durch PWRCTRL2:（PWRCTRL2 Signal steuert O_BUCK9_VSEL wählt BUCK9_ON_VSEL oder BUCK9_SLP_VSEL; und O_ BUCK9_EN wählt BUCK9_EN oder BUCK9_SLP_EN） 11：gesteuert durch PWRCTRL3:（S PWRCTRL3 Signal steuert O_BUCK9_VSEL wählt BUCK9_ON_VSEL oder BUCK9_SLP_VSEL; und O_ BUCK9_EN wählt BUCK9_EN oder BUCK9_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x69 — VSEL_CTR_SEL5

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | NLDO2_DVS_CTR_SEL NLDO2_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | NLDO2_VSEL_CTR_SEL NLDO2_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL:（PWRCRTL1 Signal steuert O_ NLDO2_VSEL wählt NLDO2_ON_VSEL oder NLDO2_SLP_VSEL; und O_ NLDO2_EN wählt NLDO2_EN oder NLDO2_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ NLDO2_VSEL wählt O_ NLDO2_VSEL oder NLDO2_SLP_VSEL; und O_ NLDO2_EN wählt NLDO2_EN oder NLDO2_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ NLDO2_VSEL wählt NLDO2_ON_VSEL oder NLDO2_SLP_VSEL; und O_ NLDO2_EN wählt NLDO2_EN oder NLDO2_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |
| 3:2 | RW | 0x0 | NLDO1_DVS_CTR_SEL NLDO1_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL(1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | NLDO1_VSEL_CTR_SEL NLDO1_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ NLDO1_VSEL wählt NLDO1_ON_VSEL oder NLDO1_SLP_VSEL; und O_ NLDO1_EN wählt NLDO1_EN oder NLDO1_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ NLDO1_VSEL wählt O_ NLDO1_VSEL oder NLDO1_SLP_VSEL; und O_ NLDO1_EN wählt NLDO1_EN oder NLDO1_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ NLDO1_VSEL wählt NLDO1_ON_VSEL oder NLDO1_SLP_VSEL; und O_ NLDO1_EN wählt NLDO1_EN oder NLDO1_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x6A — DVS_CTRL_SEL0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | NLDO4_DVS_CTR_SEL NLDO4_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | NLDO4_VSEL_CTR_SEL NLDO4_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ NLDO4_VSEL wählt NLDO4_ON_VSEL oder NLDO4_SLP_VSEL; und O_ NLDO4_EN wählt NLDO4_EN oder NLDO4_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ NLDO4_VSEL wählt O_ NLDO4_VSEL oder NLDO4_SLP_VSEL; und O_ NLDO4_EN wählt NLDO4_EN oder NLDO4_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ NLDO4_VSEL wählt NLDO4_ON_VSEL oder NLDO4_SLP_VSEL; und O_ NLDO4_EN wählt NLDO4_EN oder NLDO4_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |
| 3:2 | RW | 0x0 | NLDO3_DVS_CTR_SEL NLDO3_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | NLDO3_VSEL_CTR_SEL NLDO3_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ NLDO3_VSEL wählt NLDO3_ON_VSEL oder NLDO3_SLP_VSEL; und O_ NLDO1_EN wählt NLDO3_EN oder NLDO3_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ NLDO3_VSEL wählt O_ NLDO3_VSEL oder NLDO3_SLP_VSEL; und O_ NLDO3_EN wählt NLDO3_EN oder NLDO3_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ NLDO3_VSEL wählt NLDO3_ON_VSEL oder NLDO3_SLP_VSEL; und O_ NLDO3_EN wählt NLDO3_EN oder NLDO3_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x6B — DVS_CTRL_SEL1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:4 | RW | 0x0 | RESV: reserviert |
| 3:2 | RW | 0x0 | NLDO5_DVS_CTR_SEL NLDO5_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | NLDO5_VSEL_CTR_SEL NLDO5_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ NLDO5_VSEL wählt NLDO5_ON_VSEL oder NLDO5_SLP_VSEL; und O_ NLDO5_EN wählt NLDO5_EN oder NLDO5_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ NLDO5_VSEL wählt O_ NLDO5_VSEL oder NLDO5_SLP_VSEL; und O_ NLDO5_EN wählt NLDO5_EN oder NLDO5_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ NLDO5_VSEL wählt NLDO5_ON_VSEL oder NLDO5_SLP_VSEL; und O_ NLDO5_EN wählt NLDO5_EN oder NLDO5_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x6C — DVS_CTRL_SEL2

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO2_DVS_CTR_SEL PLDO2_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | PLDO2_VSEL_CTR_SEL PLDO2_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ PLD02_VSEL wählt PLDO2_ON_VSEL oder PLDO2_SLP_VSEL; und O_ PLDO2_EN wählt PLDO2_EN oder PLDO2_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ PLDO2_VSEL wählt PLDO2_ON_VSEL oder PLDO2_SLP_VSEL; und O_ PLDO2_EN wählt PLDO2_EN oder PLDO2_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ PLDO2_VSEL wählt PLDO2_ON_VSEL oder PLDO2_SLP_VSEL; und O_ PLDO2_EN wählt PLDO2_EN oder PLDO2_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |
| 3:2 | RW | 0x0 | PLDO1_DVS_CTR_SEL PLDO1_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | PLDO1_VSEL_CTR_SEL PLDO1_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ PLD01_VSEL wählt PLDO1_ON_VSEL oder PLDO1_SLP_VSEL; und O_ PLDO1_EN wählt PLDO1_EN oder PLDO1_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ PLDO1_VSEL wählt PLDO1_ON_VSEL oder PLDO1_SLP_VSEL; und O_ PLDO1_EN wählt PLDO1_EN oder PLDO1_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ PLDO1_VSEL wählt PLDO1_ON_VSEL oder PLDO1_SLP_VSEL; und O_ PLDO1_EN wählt PLDO1_EN oder PLDO1_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x6D — DVS_CTRL_SEL3

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO4_DVS_CTR_SEL PLDO4_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | PLDO4_VSEL_CTR_SEL PLDO4_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ PLD04_VSEL wählt PLDO4_ON_VSEL oder PLDO4_SLP_VSEL; und O_ PLDO4_EN wählt PLDO4_EN oder PLDO4_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ PLDO4_VSEL wählt PLDO4_ON_VSEL oder PLDO4_SLP_VSEL; und O_ PLDO4_EN wählt PLDO4_EN oder PLDO4_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ PLDO4_VSEL wählt PLDO4_ON_VSEL oder PLDO4_SLP_VSEL; und O_ PLDO4_EN wählt PLDO4_EN oder PLDO4_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |
| 3:2 | RW | 0x0 | PLDO3_DVS_CTR_SEL PLDO3_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | PLDO3_VSEL_CTR_SEL PLDO3_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ PLD03_VSEL wählt PLDO3_ON_VSEL oder PLDO3_SLP_VSEL; und O_ PLDO3_EN wählt PLDO3_EN oder PLDO3_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ PLDO3_VSEL wählt PLDO3_ON_VSEL oder PLDO3_SLP_VSEL; und O_ PLDO3_EN wählt PLDO3_EN oder PLDO3_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ PLDO3_VSEL wählt PLDO3_ON_VSEL oder PLDO3_SLP_VSEL; und O_ PLDO3_EN wählt PLDO3_EN oder PLDO3_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x6E — DVS_CTRL_SEL4

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO6_DVS_CTR_SEL PLDO6_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 5:4 | RW | 0x0 | PLDO6_VSEL_CTR_SEL PLDO6_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ PLD02_VSEL wählt PLDO6_ON_VSEL oder PLDO6_SLP_VSEL; und O_ PLDO2_EN wählt PLDO6_EN oder PLDO6_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ PLDO6_VSEL wählt PLDO6_ON_VSEL oder PLDO6_SLP_VSEL; und O_ PLDO6_EN wählt PLDO6_EN oder PLDO6_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ PLDO6_VSEL wählt PLDO6_ON_VSEL oder PLDO6_SLP_VSEL; und O_ PLDO6_EN wählt PLDO6_EN oder PLDO6_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |
| 3:2 | RW | 0x0 | PLDO5_DVS_CTR_SEL PLDO5_DVS_CTR_SEL: Versorgung gesteuert durch PWRCRTL (1~3) Pin 00：ohne Wirkung: Register schreiben zur Spannungsänderung 01：gesteuert durch DVS_START1:Registerschreiben ändert Spannung nicht, außer wenn DVS_START11 schreiben 10：gesteuert durch DVS_START2:Registerschreiben ändert Spannung nicht, außer wenn DVS_START21 schreiben 11：gesteuert durch DVS_START3:Registerschreiben ändert Spannung nicht, außer wenn DVS_START31 schreiben |
| 1:0 | RW | 0x0 | PLDO5_VSEL_CTR_SEL PLDO5_VSEL_CTR_SEL: 00：ohne Wirkung 01：gesteuert durch PWRCRTL1:（PWRCRTL1 Signal steuert O_ PLD05_VSEL wählt PLDO5_ON_VSEL oder PLDO5_SLP_VSEL; und O_ PLDO5_EN wählt PLDO5_EN oder PLDO5_SLP_EN） 10：gesteuert durch PWRCRTL2:（PWRCRTL2 Signal steuert O_ PLDO5_VSEL wählt PLDO5_ON_VSEL oder PLDO5_SLP_VSEL; und O_ PLDO5_EN wählt PLDO5_EN oder PLDO5_SLP_EN） 11：gesteuert durch PWRCRTL3:（PWRCRTL3 Signal steuert O_ PLDO5_VSEL wählt PLDO5_ON_VSEL oder PLDO5_SLP_VSEL; und O_ PLDO5_EN wählt PLDO5_EN oder PLDO5_SLP_EN） Hinweis: Unabhängig vom Steuerpin schalten bei SLEEP alle O_XX_VSEL auf SLP_VSEL; entsprechend O_XX_EN. |

### 0x70 — DVS_START_CTRL

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:4 | RW | 0x0 | RESV: reserviert |
| 3 | RW | 0x0 | DVS_READ_DATA DVS_READ_DATA: Wenn DVS_START nicht mit1 beschrieben wurde:0 Lesen von XX_ON_VSEL liefert den neu geschriebenen Wert;1 den Code der tatsächlichen Spannung. |
| 2 | RW | 0x0 | DVS_START3 DVS_START3: Schreiben von1 startet synchrones DVS der dieser Gruppe zugeordneten Versorgungsregler. |
| 1 | RW | 0x0 | DVS_START2 DVS_START2: Schreiben von1 startet synchrones DVS der dieser Gruppe zugeordneten Versorgungsregler. |
| 0 | RW | 0x0 | DVS_START1 DVS_START1: Schreiben von1 startet synchrones DVS der dieser Gruppe zugeordneten Versorgungsregler. |

### 0x71 — PWRCTRL_GPIO

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | RESV: reserviert |
| 6 | RW | 0x0 | PWRCTRL3_DATA PWRCTRL3_DATA: Datenbit bei GPIO-Funktion von PWRCTRL3. |
| 5 | RW | 0x0 | PWRCTRL2 _DATA PWRCTRL2 _DATA: Datenbit bei GPIO-Funktion von PWRCTRL2. |
| 4 | RW | 0x0 | SLP1_DATA SLP1_DATA: Datenbit bei GPIO-Funktion von PWRCTRL1. |
| 3 | RW | 0x0 | RESV: reserviert |
| 2 | RW | 0x0 | PWRCTRL3_DR PWRCTRL3_DR: Als GPIO:0 Eingang,1 Ausgang. |
| 1 | RW | 0x0 | PWRCTRL2_DR PWRCTRL2_DR: Als GPIO:0 Eingang,1 Ausgang. |
| 0 | RW | 0x0 | PWRCTRL1_DR PWRCTRL1_DR: Als GPIO:0 Eingang,1 Ausgang. |

### 0x72 — SYS_CFG3

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RST_FUN RST_FUN: 00 PMU neu starten;01 alle Power-off-Resetregister zurücksetzen, ACTIVE erzwingen;1X ebenso, zusätzlich RESETB für5mS Low halten und freigeben. |
| 5 | RW | 0x0 | DEV_RST DEV_RST: Schreiben von1 setzt PMIC zurück; RST_FUN bestimmt den Modus. Quelle nennt zwei Auslöser, listet drei:DEV_RST=1; PWRCTRL aktiv und SLP_FUN=011; RESETB Low. |
| 4:2 | RW | 0x0 | RESV: reserviert |
| 1 | RW | 0x0 | SLAVE_RESTART_FUN SLAVE_RESTART_FUN: 1: Slave startet nach dem Abschalten mit500ms Zwischenpause automatisch neu;0 ohne Wirkung. |
| 0 | RW | 0x0 | DEV_OFF DEV_OFF: Schreiben von1 startet Abschalten ACTIVE→OFF oder SLEEP→OFF; in OFF wird das Bit gelöscht. |

### 0x73 — WDT_REG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:5 | RW | 0x0 | RESV: reserviert |
| 4 | RW | 0x0 | WDT_ACT WDT_ACT: 0 nur Interrupt,1 Neustart. |
| 3 | RW | 0x0 | WDT_EN WDT_EN: Watchdog:0 aus,1 ein. |
| 2:0 | RW | 0x0 | WDT_SET WDT_SET: Watchdogzeit:000=50ms;001=100ms;010=500ms;011 reserviert;100=2S;101=10s;110=1min;111=10min. Bei100~111 nach Zeitwahl WDT-Interrupt löschen, sonst Auslösung1S zu früh. |

### 0x74 — ON_SOURCE

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | ON_PWRON ON_PWRON: PWRON drücken schaltet PMU ein |
| 6 | RW | 0x0 | ON_VDC ON_VDC: DVC High schaltet PMU ein (Quellschreibweise) |
| 5 | RW | 0x0 | ON_ABNORMAL ON_ABNORMAL: ABNORMAL startet PMU neu |
| 4 | RW | 0x0 | RESTART_RESETB RESTART_RESETB: NRESPWRON Low startet PMU neu |
| 3 | RW | 0x0 | RESTART_PWRON_LP RESTART_PWRON_LP: langes PWRON startet PMU neu |
| 2 | RW | 0x0 | RESTART_ PWRCTRL RESTART_ PWRCTRL: aktiver PWRCTRL startet PMU neu |
| 1 | RW | 0x0 | RESTART_DEV_RST RESTART_DEV_RST: DEV_RST=1 und ST_FUN=00 starten PMU neu |
| 0 | RW | 0x0 | RESTART_WDT RESTART_WDT: Watchdogüberlauf startet PMU neu |

### 0x75 — OFF_SOURCE

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | OFF_ PWRCTRL OFF_ PWRCTRL: aktiver PWRCTRL schaltet PMU ab |
| 6 | RW | 0x0 | VB_SYS_OV VB_SYS_OV: SYS OV schaltet PMU ab |
| 5 | RW | 0x0 | OFF_TSD OFF_TSD: TSD schaltet PMU ab |
| 4 | RW | 0x0 | OFF_SYNC OFF_SYNC: SYNC Low schaltet PMU ab |
| 3 | RW | 0x0 | OFF_DEV_OFF OFF_DEV_OFF: I2C-Schreiben von DEV_OFF schaltet PMU ab |
| 2 | RW | 0x0 | OFF_PWRON_LP OFF_PWRON_LP: langes PWRON schaltet PMU ab |
| 1 | RW | 0x0 | OFF_ABNORMAL OFF_ABNORMAL: ABNORMAL schaltet ab |
| 0 | RW | 0x0 | OFF_VB_LO OFF_VB_LO: niedriger SYS bei VB_LO_ACT=0 schaltet PMU ab |

### 0x76 — PWRON_KEY

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | PWRON_ON_TIME PWRON_ON_TIME: 0：500mS; 1:20mS |
| 6 | RW | 0x0 | PWRON_LP_ACT PWRON_LP_ACT: Langes PWRON:0 abschalten (bei wirksamem USB erneuter Start);1 abschalten und neu starten. |
| 5:4 | RW | 0x0 | PWRON_LP_OFF_TIME PWRON_LP_OFF_TIME: PWRON-Haltedauer zum Abschalten:00=6s,01=8s,10=10s,11=12s. |
| 3:2 | RW | 0x0 | PWRON_LP_TM_SEL&lt;1:0&gt; PWRON_LP_TM_SEL&lt;1:0&gt;: Interruptzeit für langes PWRON:00=0.5S,01=1S,10=1.5S,11=2S. |
| 1:0 | RW | 0x0 | PWRON_DB_SEL&lt;1:0&gt; PWRON_DB_SEL&lt;1:0&gt;: PWRON-Entprellzeit:00=32uS,01=10mS,10=20mS,11=40mS. |

### 0x77 — INT_STS0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | VB_LO_INT VB_LO_INT: VCC1-Unterspannungsalarm-Interruptstatus. |
| 6 | RW | 0x0 | VDC_FALL_INT VDC_FALL_INT: VDC-Flankeninterrupt fallend |
| 5 | RW | 0x0 | VDC_RISE_INT VDC_RISE_INT: VDC-Flankeninterrupt steigend |
| 4 | RW | 0x0 | HOTDIE_INT HOTDIE_INT: Übertemperatur-Interruptstatus. |
| 3 | RW | 0x0 | PWRON_LP_INT PWRON_LP_INT: Interruptstatus langer PWRON-Betätigung. |
| 2 | RW | 0x0 | PWRON_INT PWRON_INT: PWRON-Interruptstatus. |
| 1 | RW | 0x0 | PWRON_RISE_INT PWRON_RISE_INT: PWRON-Flankeninterrupt steigend |
| 0 | RW | 0x0 | PWRON_FALL_INT PWRON_FALL_INT: PWRON-Flankeninterrupt fallend |

### 0x78 — INT_MSK0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | VB_LO_IM VB_LO_IM: 0: Interrupt nicht maskieren;1: maskieren VCC1-Unterspannungsalarm-Interrupt |
| 6 | RW | 0x0 | VDC_FALL_INT_IM VDC_FALL_INT_IM: 0: Interrupt nicht maskieren;1: maskieren VDC-Flankeninterrupt fallend |
| 5 | RW | 0x0 | VDC_RISE_IM VDC_RISE_IM: 0: Interrupt nicht maskieren;1: maskieren VDC-Flankeninterrupt steigend |
| 4 | RW | 0x0 | HOTDIE_IM HOTDIE_IM: 0: Interrupt nicht maskieren;1: maskieren Übertemperaturinterrupt |
| 3 | RW | 0x0 | PWRON_LP_IM PWRON_LP_IM: 0: Interrupt nicht maskieren;1: maskieren Interrupt bei langem PWRON |
| 2 | RW | 0x0 | PWRON_IM PWRON_IM: 0: Interrupt nicht maskieren;1: maskieren PWRON-Interrupt |
| 1 | RW | 0x0 | PWRON_RISE_INT_IM PWRON_RISE_INT_IM: 0: Interrupt nicht maskieren;1: maskieren PWRON-Flankeninterrupt steigend |
| 0 | RW | 0x0 | PWRON_FALL_INT_IM PWRON_FALL_INT_IM: 0: Interrupt nicht maskieren;1: maskieren PWRON-Flankeninterrupt fallend |

### 0x79 — INT_STS1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | WDT_INT WDT_INT: Watchdog-Ereignisinterrupt |
| 6 | RW | 0x0 | PWRCTRL1_GPIO_INT PWRCTRL1_GPIO_INT: PWRCTRL1 Pin GPIO-Ereignisinterrupt |
| 5 | RW | 0x0 | PWRCTRL2_GPIO_INT PWRCTRL2_GPIO_INT: PWRCTRL2 Pin GPIO-Ereignisinterrupt |
| 4 | RW | 0x0 | PWRCTRL3_GPIO_INT PWRCTRL3_GPIO_INT: PWRCTRL3 Pin GPIO-Ereignisinterrupt |
| 3 | RW | 0x0 | CRC_ERROR_INT CRC_ERROR_INT: CRC-Prüffehlerinterrupt |
| 2:0 | RW | 0x0 | RESV: reserviert |

### 0x7A — INT_MSAK1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | WDT_INT_ IM WDT_INT_ IM: 0: Interrupt nicht maskieren;1: maskieren Watchdog-Ereignisinterrupt |
| 6 | RW | 0x0 | PWRCTRL1_GPIO_ IM PWRCTRL1_GPIO_ IM: 0: Interrupt nicht maskieren;1: maskieren PWRCTRL1 Pin wirksamer GPIO-Ereignisinterrupt |
| 5 | RW | 0x0 | PWRCTRL2_GPIO_ IM PWRCTRL2_GPIO_ IM: 0: Interrupt nicht maskieren;1: maskieren PWRCTRL2 Pin wirksamer GPIO-Ereignisinterrupt |
| 4 | RW | 0x0 | PWRCTRL3_GPIO_ IM PWRCTRL3_GPIO_ IM: 0: Interrupt nicht maskieren;1: maskieren PWRCTRL3 Pin wirksamer GPIO-Ereignisinterrupt |
| 3 | RW | 0x0 | CRC_ERROR_ IM CRC_ERROR_ IM: 0: Interrupt nicht maskieren;1: maskieren CRC-Prüffehlerinterrupt |
| 2:0 | RW | 0x0 | RESV: reserviert |

### 0x7B — GPIO_INT_CONFIG

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:2 | RW | 0x0 | RESV: reserviert |
| 1 | RW | 0x0 | INT_POL INT_POL: INT Pin Polarität 0 aktiv Low,1 aktiv High |
| 0 | RW | 0x0 | INT_FC_EN INT_FC_EN: Interrupt-Watchdog freigeben 0 aus,1 ein |

### 0x7C — DATA_REG0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG0 DATA_REG0:Datenpuffer |

### 0x7D — DATA_REG1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG1 DATA_REG1:Datenpuffer |

### 0x7E — DATA_REG2

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG2 DATA_REG2:Datenpuffer |

### 0x7F — DATA_REG3

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG3 DATA_REG3:Datenpuffer |

### 0x80 — DATA_REG4

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG4 DATA_REG4:Datenpuffer |

### 0x81 — DATA_REG5

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG5 DATA_REG5:Datenpuffer |

### 0x82 — DATA_REG6

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG6 DATA_REG6:Datenpuffer |

### 0x83 — DATA_REG7

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG7 DATA_REG7:Datenpuffer |

### 0x84 — DATA_REG8

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG8 DATA_REG8:Datenpuffer |

### 0x85 — DATA_REG9

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG9 DATA_REG9:Datenpuffer |

### 0x86 — DATA_REG10

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG10 DATA_REG10:Datenpuffer |

### 0x87 — DATA_REG11

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG11 DATA_REG11:Datenpuffer |

### 0x88 — DATA_REG12

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG12 DATA_REG12:Datenpuffer |

### 0x89 — DATA_REG13

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG13 DATA_REG13:Datenpuffer |

### 0x8A — DATA_REG14

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG14 DATA_REG14:Datenpuffer |

### 0x8B — DATA_REG15

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG15 DATA_REG15:Datenpuffer |

### 0xB2 — BUCK_SEQ_REG0

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 |  |  | RESV: reserviert |
| 5:0 | RW | 0x0 | BUCK1_SEQ&lt;5:0&gt; BUCK1_SEQ&lt;5:0&gt;:BUCK1 Abschaltfolge,1MS je Schritt |

### 0xB3 — BUCK_SEQ_REG1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 |  |  | RESV: reserviert |
| 5:0 | RW | 0x0 | BUCK2_SEQ&lt;5:0&gt; BUCK2_SEQ&lt;5:0&gt;:BUCK2 Abschaltfolge,1MS je Schritt |

### 0xB4 — BUCK_SEQ_REG2

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 |  |  | RESV: reserviert |
| 5:0 | RW | 0x0 | BUCK3_SEQ&lt;5:0&gt; BUCK3_SEQ&lt;5:0&gt;:BUCK3 Abschaltfolge,1MS je Schritt |

### 0xB5 — BUCK_SEQ_REG3

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO6_SEQ&lt;5:4&gt; PLDO6_SEQ&lt;5:4&gt;:PLDO6 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | BUCK4_SEQ&lt;5:0&gt; BUCK4_SEQ&lt;5:0&gt;:BUCK4 Abschaltfolge,1MS je Schritt |

### 0xB6 — BUCK_SEQ_REG4

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO6_SEQ&lt;3:2&gt; PLDO6_SEQ&lt;3:2&gt;:PLDO6 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | BUCK5_SEQ&lt;5:0&gt; BUCK5_SEQ&lt;5:0&gt;:BUCK5 Abschaltfolge,1MS je Schritt |

### 0xB7 — BUCK_SEQ_REG5

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO6_SEQ&lt;1:0&gt; PLDO6_SEQ&lt;1:0&gt;:PLDO6 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | BUCK6_SEQ&lt;5:0&gt; BUCK6_SEQ&lt;5:0&gt;:BUCK6 Abschaltfolge,1MS je Schritt |

### 0xB8 — BUCK_SEQ_REG6

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO1_SEQ&lt;5:4&gt; PLDO1_SEQ&lt;5:4&gt;:PLDO1 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | BUCK7_SEQ&lt;5:0&gt; BUCK7_SEQ&lt;5:0&gt;:BUCK7 Abschaltfolge,1MS je Schritt |

### 0xB9 — BUCK_SEQ_REG7

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO1_SEQ&lt;3:2&gt; PLDO1_SEQ&lt;3:2&gt;:PLDO1 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | BUCK8_SEQ&lt;5:0&gt; BUCK8_SEQ&lt;5:0&gt;:BUCK8 Abschaltfolge,1MS je Schritt |

### 0xBA — BUCK_SEQ_REG8

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO1_SEQ&lt;1:0&gt; PLDO1_SEQ&lt;1:0&gt;:PLDO1 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | BUCK9_SEQ&lt;5:0&gt; BUCK9_SEQ&lt;5:0&gt;:BUCK9 Abschaltfolge,1MS je Schritt |

### 0xBB — BUCK_SEQ_REG9

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO2_SEQ&lt;5:4&gt; PLDO2_SEQ&lt;5:4&gt;:PLDO2 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | BUCK10_SEQ&lt;5:0&gt; BUCK10_SEQ&lt;5:0&gt;:BUCK10 Abschaltfolge,1MS je Schritt |

### 0xBC — BUCK_SEQ_REG10

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO2_SEQ&lt;3:2&gt; PLDO2_SEQ&lt;3:2&gt;:PLDO2 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | NLDO1_SEQ&lt;5:0&gt; NLDO1_SEQ&lt;5:0&gt;:NLDO1 Abschaltfolge,1MS je Schritt |

### 0xBD — BUCK_SEQ_REG11

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO2_SEQ&lt;1:0&gt; PLDO2_SEQ&lt;1:0&gt;:PLDO2 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | NLDO2_SEQ&lt;5:0&gt; NLDO2_SEQ&lt;5:0&gt;:NLDO2 Abschaltfolge,1MS je Schritt |

### 0xBE — BUCK_SEQ_REG12

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO3_SEQ&lt;5:4&gt; PLDO3_SEQ&lt;5:4&gt;:PLDO3 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | NLDO3_SEQ&lt;5:0&gt; NLDO3_SEQ&lt;5:0&gt;:NLDO3 Abschaltfolge,1MS je Schritt |

### 0xBF — BUCK_SEQ_REG13

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO3_SEQ&lt;3:2&gt; PLDO3_SEQ&lt;3:2&gt;:PLDO3 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | NLDO4_SEQ&lt;5:0&gt; NLDO4_SEQ&lt;5:0&gt;:NLDO4 Abschaltfolge,1MS je Schritt |

### 0xC0 — BUCK_SEQ_REG14

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO3_SEQ&lt;1:0&gt; PLDO3_SEQ&lt;1:0&gt;:PLDO3 Abschaltfolge,1MS je Schritt |
| 5:0 | RW | 0x0 | NLDO5_SEQ&lt;5:0&gt; NLDO5_SEQ&lt;5:0&gt;:NLDO5 Abschaltfolge,1MS je Schritt |

### 0xC1 — BUCK_SEQ_REG15

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV: reserviert |
| 5:0 | RW | 0x0 | PLDO4_SEQ&lt;5:0&gt; PLDO4_SEQ&lt;5:0&gt;:PLDO4 Abschaltfolge,1MS je Schritt |

### 0xC2 — BUCK_SEQ_REG16

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV: reserviert |
| 5:0 | RW | 0x0 | PLDO5_SEQ&lt;5:0&gt; PLDO5_SEQ&lt;5:0&gt;:PLDO5 Abschaltfolge,1MS je Schritt |

### 0xC3 — BUCK_SEQ_REG17

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV: reserviert |
| 5:0 | RW | 0x0 | SESET&lt;5:0&gt; SESET&lt;5:0&gt;:PLDO4 Abschaltfolge,1MS je Schritt |

### 0xDC — BACKUP_REG7

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK10_SET_SST BUCK10_SET_SST:BUCK10 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |
| 5:4 | RW | 0x0 | BUCK9_SET_SST BUCK9_SET_SST:BUCK9 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |
| 3:2 | RW | 0x0 | BUCK8_SET_SST BUCK8_SET_SST:BUCK8 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |
| 1:0 | RW | 0x0 | BUCK7_SET_SST BUCK7_SET_SST:BUCK7 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |

### 0xE6 — BACKUP_REG6

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK4_SET_SST BUCK4_SET_SST:BUCK4 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |
| 5:4 | RW | 0x0 | BUCK3_SET_SST BUCK3_SET_SST:BUCK3 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |
| 3:2 | RW | 0x0 | BUCK2_SET_SST BUCK2_SET_SST:BUCK2 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |
| 1:0 | RW | 0x0 | BUCK1_SET_SST BUCK1_SET_SST:BUCK1 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |

### 0xE7 — BACKUP_REG5

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK5_SET_SST BUCK5_SET_SST:BUCK4 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |
| 5:4 | RW | 0x0 | RESV: reserviert |
| 3:2 | RW | 0x0 | VCC14_UVSEL VCC14_UVSEL:VCC14 Eingangsschwelle wählen 0:0.6v 1:0.8v 10:1.0v 11:1.2V |
| 1:0 | RW | 0x0 | VCC13_UVSEL VCC13_UVSEL:VCC13 Eingangsschwelle wählen 0:0.6v 1:0.8v 10:1.0v 11:1.2V |

### 0xE8 — BACKUP_REG1

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK6_SET_SST BUCK6_SET_SST:BUCK4 Softstartzeit 00:400uS 01:200uS 10:100uS 11:50uS |
| 6:5 | RW | 0x0 | RESV: reserviert |
| 4 | RW | 0x0 | VBOVLOCK_DIS VBOVLOCK_DIS: VBOV nach PMIC-Einschalten verriegeln 0 ein,1 aus |
| 3 | RW | 0x0 | SYSOV_SEL SYSOV_SEL: VCCx Überspannungsschutzschwelle 0:5.8V 1:5.6V |
| 2 | RW | 0x0 | SPI_4WIRE SPI_4WIRE:SPI-Modus:0 Dreidraht,1 Vierdraht |
| 1:0 |  |  | RESV: reserviert |

### 0xE9 — BACKUP_REG2

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK_DVS_FPWM_EN BUCK_DVS_FPWM_EN: FPWM bei BUCK-DVS einschalten 1 ein,0 aus |
| 6 | RW | 0x0 | LDO_DVS_RLOAD_EN LDO_DVS_RLOAD_EN: internen Entladewiderstand bei LDO-DVS einschalten 1 ein,0 aus |
| 5 | RW | 0x0 | MISO_PAD_OE MISO_PAD_OE: MISO als Ausgang konfigurieren 1 ein,0 aus |
| 4 | RW | 0x0 | WDT_CLR_mask: Vor Ändern von WDT_CLR zwingend1 in die Maske schreiben; nach Schreiben von WDT_CLR WDT_CLR_MASK löschen. |
| 3:1 | RW | 0x0 | RESV: reserviert |
| 0 | RW | 0x0 | WDT_CLR: WDT-Auslösung verzögern 1 ein,0 aus Hinweis: Die Watchdogzeit bestimmt die Verzögerung; erneutes Schreiben von1 innerhalb dieser Zeit verschiebt die Auslösung erneut. |

### 0xEA — BACKUP_REG3

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV: reserviert |
| 5:3 | RW | 0x0 | LDO_RATE&lt;2:0&gt; LDO_RATE&lt;2:0&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack) 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; Hinweis: Beim Ändern der LDO-Spannung sind0XX-Raten deaktiviert. |
| 1 | RW | 0x0 | BUCK10_RATE&lt;2&gt; BUCK10_RATE&lt;2&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 19 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 0 | RW | 0x0 | BUCK9_RATE&lt;2&gt; BUCK9_RATE&lt;2&gt;: Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 18 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |

### 0xEB — BACKUP_REG4

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_RATE&lt;2&gt; BUCK8_RATE&lt;2&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 17 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 6 | RW | 0x0 | BUCK7_RATE&lt;2&gt; BUCK7_RATE&lt;2&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 16 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5 | RW | 0x0 | BUCK6_RATE&lt;2&gt; BUCK6_RATE&lt;2&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 15 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 4 | RW | 0x0 | BUCK5_RATE&lt;2&gt; BUCK5_RATE&lt;2&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 14 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 3 | RW | 0x0 | BUCK4_RATE&lt;2&gt; BUCK4_RATE&lt;2&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 13 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 2 | RW | 0x0 | BUCK3_RATE&lt;2&gt; BUCK3_RATE&lt;2&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 12 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 1 | RW | 0x0 | BUCK2_RATE&lt;2&gt; BUCK2_RATE&lt;2&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 11 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 0 | RW | 0x0 | BUCK1_RATE&lt;2&gt; BUCK1_RATE&lt;2&gt;:Spannungsänderungsrate nach DVS (Quelle2M clack),3 Bit, BIT&lt;1:0&gt; in 10 Register 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |

### 0xFD — BUCK_RSERVE_REG3

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV: reserviert |
| 5 | RW | 0x0 | BUCK6_EX_RES_SET BUCK6_EX_RES_SET:BUCK6 externen Feedbackwiderstand freigeben. 0 aus,1 ein |
| 4 | RW | 0x0 | BUCK5_EX_RES_SET BUCK5_EX_RES_SET:BUCK5 externen Feedbackwiderstand freigeben. 0 aus,1 ein |
| 3:2 | RW | 0x0 | RESV: reserviert |
| 1 | RW | 0x0 | BUCK2_EX_RES_SET BUCK2_EX_RES_SET:BUCK2 externen Feedbackwiderstand freigeben. 0 aus,1 ein |
| 0 | RW | 0x0 | BUCK1_EX_RES_SET BUCK1_EX_RES_SET:BUCK1 externen Feedbackwiderstand freigeben. 0 aus,1 ein |

### 0xFE — BUCK_RSERVE_REG4

| Bit | Attribut | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:1 | RW | 0x0 | RESV: reserviert |
| 0 | RW | 0x0 | BUCK9_EX_RES_SET BUCK9_EX_RES_SET:BUCK9 externen Feedbackwiderstand freigeben. 0 aus,1 ein |

## 6. Thermisches Management

### 6.1 Übersicht

Für Zuverlässigkeit und Funktion muss die absolute maximale Sperrschichttemperatur des RK806 unter 125°C bleiben. Die thermisch-mechanische Auslegung von Smartphones, Tablets, Navigationsgeräten und ähnlichen Produkten, die thermische Systemsoftware und ungünstigste Anwendungen können höhere Sperrschichttemperaturen verursachen. Thermische Simulationen auf Geräteebene mit der gemessenen Leistung des ungünstigsten Anwendungsfalls werden empfohlen.

### 6.2 Thermische Gehäuseeigenschaften

| QFN7×7-68 | Leistung / W | θJA / °C/W | θJB / °C/W | θJC / °C/W |
| --- | --- | --- | --- | --- |
| RK806 | 2 | 21.99 | 12 | 6.58 |

Testplatine:4 Lagen,114×76mm,1.6mm dick,85°C Umgebung. Volumenüberschriften der bleifreien Tabelle sind im Original beschädigt (mmcess-C / mmcess-Class / mmcess-Cl); Bereiche sind aus diesem PDF nicht feststellbar und werden nicht ergänzt.

Tabelle 6-2. Klassifizierungstemperaturen für eutektischen SnPb-Prozess (TC)

| Gehäusedicke | Volumen &lt;350 mms | Volumen ≥350 mms |
| --- | --- | --- |
| &lt;2.5 mm | 235°C | 220°C |
| ≥2.5 mm | 220°C | 220°C |

Tabelle 6-3. Klassifizierungstemperaturen für bleifreien Prozess (TC)

| Gehäusedicke | Volume mmcess-C | Volume mmcess-Class | Volume mmcess-Cl |
| --- | --- | --- | --- |
| &lt;1.6 mm | 260°C | 260°C | 260°C |
| 1.6 mm–2.5 mm | 260°C | 250°C | 245°C |
| &gt;2.5 mm | 250°C | 245°C | 245°C |

1. Der Bausteinhersteller, nicht jedoch der Leiterplattenbestücker/Anwender, darf eine maximale Gehäusespitzentemperatur TP oberhalb der in der Quelle genannten Tables 6-2 oder 6-3 zulassen. Ein höheres Tp ändert die Klassifizierungstemperatur Tc nicht.
2. Das Gehäusevolumen schließt äußere Anschlüsse wie Kugeln, Höcker, Anschlussflächen und Pins sowie nicht integrierte Kühlkörper aus.
3. Die maximale Bauteiltemperatur beim Reflow hängt von Gehäusedicke und -volumen ab. Konvektions-Reflow reduziert Temperaturgradienten zwischen Gehäusen; Unterschiede der thermischen Masse von SMD-Gehäusen können dennoch Gradienten verursachen.
4. Die Feuchteempfindlichkeitsstufen von Bauteilen für bleifreie Montage müssen anhand der bleifreien Klassifizierungstemperaturen und Profile bewertet werden, auf die die Quelle als „Tables 4.2 and 6-4“ verweist, unabhängig davon, ob die Bauteile selbst bleifrei sind. Diese Verweise sind widersprüchlich und zu prüfen.
5. SMD-Gehäuse, die nach früheren Verfahren/Kriterien von J-STD-020, JESD22-A112 (zurückgezogen) oder IPC-SM-786 (zurückgezogen) klassifiziert wurden, benötigen keine Neuklassifizierung, außer wenn eine andere Stufe oder höhere Klassifizierungsspitzen­temperatur gewünscht ist.

Tabelle 6-4. Klassifizierungs-Reflowprofile

| Profilmerkmal | Eutektische Sn-Pb-Montage | Bleifreie Montage |
| --- | --- | --- |
| Vorwärmen/Halten Minimum Tsmin | 100°C | 150°C |
| Vorwärmen/Halten Maximum Tsmax | 150°C | 200°C |
| Zeit von Tsmin bis Tsmax, ts | 60–120 s | 60–120 s |
| Mittlere Aufheizrate Tsmax–Tp | ≤3°C/s | ≤3°C/s |
| Liquidustemperatur TL | 183°C | 217°C |
| Zeit am Liquidus tL | 60–150 s | 60–150 s |
| Gehäusespitzentemperatur Tp* | Table 6-2 | Table 6-3 |
| Zeit tp** innerhalb 5°C der Klassifizierungstemperatur Tc | 20** s | 30** s |
| Mittlere Abkühlrate Tp–Tsmax | ≤6°C/s | ≤6°C/s |
| Zeit von 25°C bis zum Spitzenwert | ≤6 min | ≤8 min |

* Die Toleranz der Profilspitzentemperatur Tp ist ein Lieferantenminimum und ein Anwendermaximum.

** Die Toleranz der Zeit bei Profilspitzentemperatur Tp ist ein Lieferantenminimum und ein Anwendermaximum.

1. Alle Temperaturen beziehen sich auf die Mitte der beim Reflow nach oben gerichteten Gehäuseoberfläche (Live-Bug; die Quelle schreibt „ive-bug“). Bei anderer Orientierung, etwa Dead-Bug, muss Tp innerhalb ±2°C des Live-Bug-Tp liegen und weiterhin Tc erfüllen; andernfalls ist das Profil anzupassen. Für genaue Gehäusespitzentemperaturmessungen die Thermoelementempfehlungen in JEP140 heranziehen.
2. Diese Profile dienen der Klassifizierung/Vorbehandlung, nicht als Vorgaben für die Leiterplattenmontage. Montageprofile sind anhand des Prozesses und des Platinendesigns zu entwickeln und dürfen die in der Quelle als Table 6-4 bezeichneten Parameter nicht überschreiten. Beispiel: Bei Tc=260°C und Tp-Zeit=30 Sekunden muss der Lieferant mindestens 260°C und mindestens 30 Sekunden oberhalb 255°C erreichen; der Anwender darf 260°C und 30 Sekunden oberhalb 255°C nicht überschreiten.
3. Alle Bauteile der Prüfladung müssen die Anforderungen des Klassifizierungsprofils erfüllen.
4. SMD-Gehäuse, die nach früheren Verfahren/Kriterien von J-STD-020, JESD22-A112 (zurückgezogen) oder IPC-SM-786 (zurückgezogen) klassifiziert wurden, benötigen keine Neuklassifizierung, sofern keine Änderung der Stufe oder höhere Klassifizierungsspitzen­temperatur gewünscht ist.

{% endraw %}
