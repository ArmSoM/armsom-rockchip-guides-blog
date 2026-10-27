---
title: "Rockchip RK860: Reglerdatenblatt und Registerreferenz"
description: "Rockchip RK860: Reglerdatenblatt und Registerreferenz — Rev 1.6"
excerpt: "Rockchip RK860: Reglerdatenblatt und Registerreferenz"
translation_key: "220-rockchip-rk860-datasheet"
slug: "220-rockchip-rk860-datasheet"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: [ArmSoM, Rockchip, RK860, PMIC]
---

{% raw %}

# Rockchip RK860: Datenblatt, Register und thermische Auslegung

Plattformreferenz für ArmSoM. Dieses Datenblatt beschreibt den RK860 und behauptet nicht, dass jede ArmSoM-Platine diesen Baustein verwendet. Vor der Anwendung sind die genaue Variante RK860-0/1/2/3, der Schaltplan, die Versorgungstopologie, die I2C-Adresse und der BSP-Treiber zu prüfen. Das Datenblatt nennt keine bestimmte SoC-, SDK/BSP- oder Kernel-Version. Die Kennlinien sind Herstellerbeispiele und keine ArmSoM-Messungen; eine Hardwareprüfung wurde nicht durchgeführt.

Quelle: `Rockchip_RK860_Datasheet_V1.6-20221117.pdf`, Rev 1.6, 20 PDF-Seiten. Es liegt nur ein englisches Original vor. Alle vier Sprachfassungen verwenden daher dessen englische Originalabbildungen; chinesische Originalabbildungen liegen nicht vor. Der technische Hauptteil umfasst Kapitel 1–7 (PDF-Seiten 6–20). Widersprüche der Quelle werden am Ende ausdrücklich dokumentiert.

## 1. Einführung

### 1.1 Übersicht

Der RK860 ist ein hocheffizienter synchroner DC/DC-Abwärtsregler mit 2.4MHz Schaltfrequenz, 2.7V–5.5V Eingangsspannung und bis zu 7A Ausgangsstrom. Haupt- und Synchronschalter besitzen ein niedriges RDS(ON), um Leitungsverluste zu minimieren. Über I2C wird die Ausgangsspannung von 0.7125V bis 1.5V in 12.5mV-Schritten oder von 0.5V bis 1.5V in 6.25mV-Schritten eingestellt. Das platzsparende, flache Gehäuse ist WLCSP 1.65mm × 2.05mm-20.

### 1.2 Merkmale

- Eingang: 2.7V–5.5V.
- 2.4MHz Schaltfrequenz reduziert den Aufwand externer Bauteile.
- Typischer Ruhestrom: 70uA bei VIN=3.8V und Temp=25°C.
- PFET/NFET-Widerstand: Die Merkmalliste der Quelle nennt **24mohm/16ohm @ VIN=3.8V**, die elektrische Tabelle dagegen 24mΩ/16mΩ. Dieser Einheitenwiderspruch darf nicht durch eine Annahme aufgelöst werden.
- Programmierbarer Ausgang: 0.7125V–1.5V / 12.5mV je Schritt oder 0.5V–1.5V / 6.25mV je Schritt.
- 7A kontinuierlicher Ausgangsstrom.
- Geeignet für eine 0.24uH-Induktivität und zwei keramische 22uF-Ausgangskondensatoren.
- Hiccup-Schutz bei hartem Kurzschluss.
- Integrierte zyklusweise OCP sowie VIN-OVP/UVLO/DIE-TSD.
- RoHS-konform und halogenfrei.
- Kompaktes WLCSP-Gehäuse 1.65 × 2.05-20.

### 1.3 Typische Anwendungsschaltungen

![Abbildung 1-1. Allgemeine Anwendung (englisches Original).](/docs/rockchip-rk860-datasheet/images/p06-general.png)

Abbildung 1-1. Allgemeine Anwendung (englisches Original).

![Abbildung 1-2. Sonderfall mit C1≥1uF, AP/CAP und Leiterbahnführung (englisches Original).](/docs/rockchip-rk860-datasheet/images/p07-special.png)

Abbildung 1-2. Sonderfall mit C1≥1uF, AP/CAP und Leiterbahnführung (englisches Original).

### 1.4 Anschlussanordnung

![Abbildung 1-3. Anschlussanordnung, Draufsicht (englisches Original).](/docs/rockchip-rk860-datasheet/images/p07-pins.png)

Abbildung 1-3. Anschlussanordnung, Draufsicht (englisches Original).

### 1.5 Anschlussbelegung

| Nummer | Name | Funktion | I/O |
| --- | --- | --- | --- |
| D1,D2,E1,E2 | VIN | Versorgungseingang. Mindestens zwei keramische 10uF-Kondensatoren zur Eingangsfilterung möglichst dicht zwischen VIN und GND anschließen. | Versorgung |
| D3,D4,E3,E4 | LX | Schaltknoten; mit dem Schaltknoten der Induktivität verbinden. | Ausgang |
| B2,B3,C1,C2,C3,C4 | GND | Leistungsmasse. | Masse |
| B4 | AGND | Analogmasse. |  |
| A1 | VSEL | Low: VSEL0 legt VOUT fest. High: VSEL1 legt VOUT fest. | Eingang |
| A2 | EN | Freigabe, aktiv High; nicht offen lassen. | Eingang |
| A3 | SCL | I2C-Taktleitung. | Eingang |
| B1 | SDA | Bidirektionale I2C-Daten, Open Drain (Quellschreibweise: „Open darin“). | I/O |
| A4 | VOUT | Ausgangsmessung; am Ausgangskondensator anschließen. | Ausgang |

## 2. Elektrische Eigenschaften

Hinweis 1: Überschreiten der absoluten Grenzwerte kann den Baustein dauerhaft beschädigen. Es handelt sich ausschließlich um Belastungsgrenzen; eine Funktion außerhalb der Betriebsbedingungen wird nicht zugesichert. Längere Einwirkung absoluter Grenzbedingungen kann die Zuverlässigkeit beeinträchtigen.

Hinweis 2: Außerhalb der empfohlenen Betriebsbedingungen ist die Funktion nicht garantiert.

### 2.1 Absolute Grenzwerte (Hinweis 1)

| Parameter | Wert | Einheit |
| --- | --- | --- |
| Spannung am VIN-Pin | 6.0 | V |
| Spannungen anderer Pins | VIN+0.6 | V |
| Dauerverlustleistung PD @ TA=25°C, WCSP4*5-20 | 0.5 | W |
| Sperrschichttemperatur TJ | -40~150 | °C |
| Anschlusstemperatur, Löten 10 Sekunden, TSOLDER | 260 | °C |
| Lagertemperatur TS | -65~150 | °C |
| ESD HBM | 2000 | V |
| ESD CDM | 1000 | V |

### 2.2 Empfohlene Betriebsbedingungen (Hinweis 2)

| Parameter | Symbol | Wert | Einheit |
| --- | --- | --- | --- |
| Eingangsversorgungsspannung | VIN | 2.7~5.5 | V |
| Ausgangsspannung | VOUT | 0.5~1.5 | V |
| Induktivität | L | 0.22~0.47 | uH |
| Eingangskapazität | CIN | >10 | uF |
| Ausgangskapazität | COUT | 44~88 | uF |
| Sperrschichttemperatur | Tj | -40~125 | °C |
| Umgebungstemperatur | Ta | -40~85 | °C |

### 2.3 Elektrische Kennwerte

Sofern nicht anders angegeben: typische Anwendungsschaltung, VIN=3.8V, VOUT=1.0V, L=0.24uH, COUT=22uF*2, TA=25°C. Leere Zellen entsprechen der Quelle und bedeuten nicht null.

| Parameter | Symbol | Bedingung | Min. | Typ. | Max. | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| VIN-UVLO-Schwelle | VIN_UVLO | Vin steigend |  | 2.55 | 2.65 | V |
| VIN-UVLO-Hysterese | VIN_UVLO_HYS | Vin fallend |  | 150 |  | mV |
| VIN-OVP-Schwelle | VIN_OV | Vin steigend |  | 6 |  | V |
| VIN-OVP-Hysterese | VIN_OV_HYS | Vin fallend |  | 200 |  | mV |
| Ruhestrom | Iq | Kein Schalten, vfb=105%Vref |  | 70 |  | uA |
| Abschaltstrom | Isd | EN=L |  | 0.1 |  | uA |
| Strom bei Softwareabschaltung | Isd_soft | EN=H, BUCK_EN=L |  | 25 |  | uA |
| Interne Softstart-Zeit | Tss | Vout=1.0V, von der steigenden BUCK_EN-Flanke bis Vout>92% |  | 260 |  | uS |
| Oszillatorfrequenz | Fclk | PWM / FPWM | 2.2 | 2.4 | 2.6 | MHz |
| Entladewiderstand | Rdisc | EN=L/BUCK_EN=0 |  | 150 |  | Ω |
| High-Eingangsschwelle EN/VSEL | VIH |  | 1.1 |  |  | V |
| Low-Eingangsschwelle EN/VSEL (Quelle gruppiert unter High-Schwelle) | VIL |  |  |  | 0.4 | V |
| High-Eingangsschwelle SDA/SCL | VIH |  | 1.26 |  |  | V |
| Low-Eingangsschwelle SDA/SCL (Quelle gruppiert unter High-Schwelle) | VIL |  |  |  | 0.54 | V |
| Vout-Genauigkeit, Ausgangsspannungsfehler | VREG1 | Erzwungenes PWM, VOUT=1.0V | -0.6 |  | +0.6 | % |
| Vout-Genauigkeit, Ausgangsspannungsfehler | VREG2 | Auto PFM, VOUT=1.0V | -1.5 |  | 1.5 | % |
| PMOS RDS(ON) | RDS(ON)P | VIN → LX, VIN=3.8V |  | 24 |  | mΩ |
| NMOS RDS(ON) | RDS(ON)N | LX → GND, VIN=3.8V |  | 16 |  | mΩ |
| Maximaler PMOS-Strom | Ipeak |  | 8.5 |  |  | A |
| Maximaler NMOS-Strom | Ivalley |  | 7.0 |  |  | A |
| Thermische Abschalttemperatur | TSD | Ansteigende Schwelle |  | 150 |  | °C |
| Thermische Abschalthysterese | TSD_HYS |  |  | 25 |  | °C |

## 3. Chipvarianten

| DIE-ID | I2C-ADDR (7 Bit) | Vout-Bereich / V | Standard-Vout / V | STEP / mV | DIE_ID |
| --- | --- | --- | --- | --- | --- |
| RK860-0 | 40H | 0.7125-1.5 | 1.0 | 12.5 | 0X8 |
| RK860-1 | 41H | 0.7125-1.5 | 1.0 | 12.5 | 0X8 |
| RK860-2 | 42H | 0.5-1.5 | 0.8 | 6.25 | 0XA |
| RK860-3 | 43H | 0.5-1.5 | 0.8 | 6.25 | 0XA |

## 4. Registerbeschreibung

### VSEL0_A — 0x00

| Bit | Zugriff | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x1 | BUCK_EN0: Softwarefreigabe für BUCK. 1: ein; 0: aus. Bei externem EN=Low ist der Regler aus; bei EN=High ist BUCK_EN maßgebend. |
| 6 | RW | 0x0 | MODE0: 0 erlaubt Auto-PFM bei kleiner Last; 1 erzwingt PWM. |
| 5:0 | RW | 0x17 | NSEL0: 12.5mV je Schritt, nur DIE_ID=0X8.<br>000000=0.7125V;<br>000001=0.7250V;<br>000010=0.7375V;<br>......<br>010111=1.0000V;<br>......<br>111111=1.5V; |

### VSEL1_A — 0x01

| Bit | Zugriff | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x1 | BUCK_EN1: Softwarefreigabe für BUCK-LOOP. 1: ein; 0: aus. Bei externem EN=Low ist der Regler aus; bei EN=High ist BUCK_EN maßgebend. |
| 6 | RW | 0x0 | MODE1: 0 erlaubt Auto-PFM bei kleiner Last; 1 erzwingt PWM. |
| 5:0 | RW | 0x17 | NSEL1: 12.5mV je Schritt, nur DIE_ID=0X8.<br>000000=0.7125V;<br>000001=0.7250V;<br>000010=0.7375V;<br>......<br>010111=1.0000V;<br>......<br>111111=1.5V; |

### Control_Register — 0x02

| Bit | Zugriff | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | RW | 0x1 | Output Discharge: 0 deaktiviert den Entladewiderstand; 1 aktiviert ihn. |
| 6:4 | RW | 0x0 | Slew Rate: Geschwindigkeit positiver Spannungsübergänge.<br>000 = 10mV/0.15us<br>001 = 10mV/0.3us<br>010 = 10mV/0.6us<br>011 = 10mV/1.2us<br>100 = 10mV/2.4us<br>101 = 10mV/4.8us<br>110 = 10mV/9.6us<br>111 = 10mV/19.2us |
| 3:0 | RW | 0x0 | Liest immer 0 zurück. RESET: Schreiben von 1 setzt alle Register auf Standardwerte zurück. Die Quelle benennt innerhalb 3:0 kein einzelnes RESET-Bit; vor dem Schreiben die Implementierung prüfen. |

### ID1 Register — 0x03

| Bit | Zugriff | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:5 | R | 0x4 | VENDOR: Herstellerkennung Rockchip. |
| 4 | R | 0x0 | Reserviert; liest immer 0. |
| 3:0 | R | 0x8/0xA | DIE_ID: 0x8 bedeutet 0.7125V–1.5V bei 12.5mV je Schritt; 0xA bedeutet 0.5V–1.5V bei 6.25mV je Schritt. |

### ID2 Register — 0x04

| Bit | Zugriff | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:4 | R | 0x0 | Reserviert; liest immer 0. |
| 3:0 | R | NA | NA |

### PGOOD Register — 0x05

| Bit | Zugriff | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7 | R | 0x0 | PGOOD: 1 bedeutet Regler freigegeben und Softstart abgeschlossen (Vout>92% des Sollwerts); 0 bedeutet fehlerhaftes Vout. |
| 6 | R | 0x0 | TSD: thermische Reglerabschaltung. 1: Tdie>150°C; 0: Tdie<125°C. |
| 5 | R | 0x0 | IOVP: Abschaltzustand bei Eingangsüberspannung. 1: VIN>6V; 0: VIN<5.8V. |
| 4 | R | 0x0 | UVLO: Eingang-Unterspannungssperre. 1: VIN<2.4V; 0: VIN>2.55V. |
| 3:0 | R | 0x0 | Reserviert. |

### VSEL0_B Register — 0x06

| Bit | Zugriff | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | R/W | 0x30 | NSEL0: ausgewählt bei VSEL=L; nur DIE_ID=0XA.<br>00,000,000 = 0.5V<br>00,000,001 = 0.50625V<br>00,000,010 = 0.51250V<br>......<br>00,110,000 = 0.8V<br>......<br>10,100,000 = 1.5V<br>&gt;10,100,000 = 1.5V |

### VSEL1_B Register — 0x07

| Bit | Zugriff | Reset | Beschreibung |
| --- | --- | --- | --- |
| 7:0 | R/W | 0x30 | NSEL1: ausgewählt bei VSEL=H; nur DIE_ID=0XA.<br>00,000,000 = 0.5V<br>00,000,001 = 0.50625V<br>00,000,010 = 0.51250V<br>......<br>00,110,000 = 0.8V<br>......<br>10,100,000 = 1.5V<br>&gt;10,100,000 = 1.5V |

## 5. Typische Leistungskennlinien

Alle folgenden Kennlinien sind Quellenbeispiele und keine ArmSoM-Messungen. Bei der Interpretation sind die angegebenen Betriebsbedingungen zu beachten.

![Wirkungsgrad über Laststrom: Vin=3.3V, 4.2V, 5.0V (englisches Original).](/docs/rockchip-rk860-datasheet/images/p14-efficiency.png)

Wirkungsgrad über Laststrom: Vin=3.3V, 4.2V, 5.0V (englisches Original).

![Restwelligkeit über Laststrom: Vin=3.8V (englisches Original).](/docs/rockchip-rk860-datasheet/images/p14-ripple.png)

Restwelligkeit über Laststrom: Vin=3.8V (englisches Original).

![Abschalten über Freigabe: Vin=3.8V, Vout=0.8V, Iout=7A (englisches Original).](/docs/rockchip-rk860-datasheet/images/p14-shutdown.png)

Abschalten über Freigabe: Vin=3.8V, Vout=0.8V, Iout=7A (englisches Original).

![Start über Freigabe: Vin=3.8V, Vout=0.8V, Iout=7A (englisches Original).](/docs/rockchip-rk860-datasheet/images/p14-startup.png)

Start über Freigabe: Vin=3.8V, Vout=0.8V, Iout=7A (englisches Original).

![Lastsprung: Vin=3.8V, Vout=0.8V, Iout=0.05~3A, 1A/uS (englisches Original).](/docs/rockchip-rk860-datasheet/images/p14-transient1.png)

Lastsprung: Vin=3.8V, Vout=0.8V, Iout=0.05~3A, 1A/uS (englisches Original).

![Lastsprung: Vin=3.8V, Vout=0.8V, Iout=0.1~7A, 1A/uS (englisches Original).](/docs/rockchip-rk860-datasheet/images/p14-transient2.png)

Lastsprung: Vin=3.8V, Vout=0.8V, Iout=0.1~7A, 1A/uS (englisches Original).

![Kurzschlussschutz: Vin=3.8V, Vout=0.8V, Iout=7A~Kurzschluss (englisches Original).](/docs/rockchip-rk860-datasheet/images/p15-short1.png)

Kurzschlussschutz: Vin=3.8V, Vout=0.8V, Iout=7A~Kurzschluss (englisches Original).

![Kurzschlussschutz: Vin=3.8V, Vout=0.8V, Iout=Kurzschluss~7A (englisches Original).](/docs/rockchip-rk860-datasheet/images/p15-short2.png)

Kurzschlussschutz: Vin=3.8V, Vout=0.8V, Iout=Kurzschluss~7A (englisches Original).

## 6. Gehäuseinformationen

### 6.1 Bestellinformationen

| Baustein | Markierung | RoHS | Gehäuse | Menge |
| --- | --- | --- | --- | --- |
| RK860-0 | D0 | Konform | WLCSP20 (pitch 0.4mm) | 5000 Stück/Gurt |
| RK860-1 | D1 | Konform | WLCSP20 (pitch 0.4mm) | 5000 Stück/Gurt |
| RK860-2 | D2 | Konform | WLCSP20 (pitch 0.4mm) | 5000 Stück/Gurt |
| RK860-3 | D3 | Konform | WLCSP20 (pitch 0.4mm) | 5000 Stück/Gurt |

### 6.2 Oberseitenmarkierung

![Oberseitenmarkierung (englisches Original). DX: Bausteinmarkierung; YY: Datumscode; M: Gehäusecode; XXXXX: Chipchargennummer, gegebenenfalls Buchstaben; erster Pin ist markiert. Die Zeichnung ordnet DA/DB/DC/DD den Varianten RK860-0/1/2/3 zu, die Bestelltabelle dagegen D0/D1/D2/D3. Beim Lieferanten prüfen.](/docs/rockchip-rk860-datasheet/images/p16-mark.png)

Oberseitenmarkierung (englisches Original). DX: Bausteinmarkierung; YY: Datumscode; M: Gehäusecode; XXXXX: Chipchargennummer, gegebenenfalls Buchstaben; erster Pin ist markiert. Die Zeichnung ordnet DA/DB/DC/DD den Varianten RK860-0/1/2/3 zu, die Bestelltabelle dagegen D0/D1/D2/D3. Beim Lieferanten prüfen.

### 6.3 Abmessungen

![Abbildung 6-1. WLCSP20, Raster 0.4mm; alle Maße in mm (englisches Original).](/docs/rockchip-rk860-datasheet/images/p16-dimension.png)

Abbildung 6-1. WLCSP20, Raster 0.4mm; alle Maße in mm (englisches Original).

- Die Koplanarität gilt für Anschlüsse, Eckanschlüsse und das Chip-Befestigungspad.
- Maß φb gilt für den metallisierten Anschluss und wird 0.15mm bis 0.30mm von dessen Spitze entfernt gemessen. Falls am anderen Ende eine optionale Rundung vorhanden ist, φb nicht im Rundungsbereich messen.
- Für das Leiterplattenlayout wird für φb ein Maß von 0.15mm empfohlen.

### 6.4 Layoutempfehlungen

Die Leiterbahnführung beeinflusst die Bausteinleistung unmittelbar.

- CIN ausreichend nahe an den Pins platzieren, um Eingangsstörungen zu minimieren.
- Die mit SW verbundene Kupferfläche minimieren, um Schaltstörungen zu reduzieren.
- Die Rückführungsleitung von COUT zu VOUT nicht neben SW führen, um Störeinkopplung zu minimieren.
- Die GND-Kupferfläche für Wärmeabfuhr und Abschirmung maximieren. Geeignete Durchkontaktierungen unter dem Massepad verbessern den Stromkreis.
- GND-Pads von CIN, COUT und Chip auf derselben Seite oder ausreichend nahe anordnen.
- Bei langer Rückführung verlangt der Originaltext Abbildung 6-2: C1 nahe COUT platzieren und VOUT vom Kondensator CAP aus anschließen. Das Sonderfall-Layout ist im Haupttext tatsächlich als Abbildung 6-4 bezeichnet; diese Nummerierungsabweichung beachten.

![Abbildung 6-3. Allgemeines Leiterplattenlayout (englisches Original).](/docs/rockchip-rk860-datasheet/images/p17-layout1.png)

Abbildung 6-3. Allgemeines Leiterplattenlayout (englisches Original).

![Abbildung 6-4. Leiterplattenlayout für Sonderfälle (englisches Original).](/docs/rockchip-rk860-datasheet/images/p17-layout2.png)

Abbildung 6-4. Leiterplattenlayout für Sonderfälle (englisches Original).

## 7. Thermisches Management

### 7.1 Übersicht

Für Zuverlässigkeit und Funktion muss die absolute maximale Sperrschichttemperatur des RK860 unter 150°C bleiben. Die thermisch-mechanische Auslegung von Smartphones, Tablets, Navigationsgeräten und ähnlichen Produkten, die thermische Systemsoftware und ungünstigste Anwendungen können höhere Sperrschichttemperaturen verursachen. Thermische Simulationen auf Geräteebene mit der gemessenen Leistung des ungünstigsten Anwendungsfalls werden empfohlen.

### 7.2 Thermische Gehäuseeigenschaften

Der einleitende Quelltext nennt die folgende Tabelle „Table 1-1“; ihre tatsächliche Beschriftung lautet Table 7-1.

| Tabelle 7-1: WLCSP20-Gehäuse | PD @ TA=25°C, WCSP4*5-20 / W | θJA, Zweilagenplatine, Sperrschicht–Umgebung / °C/W | θJC, Zweilagenplatine, Sperrschicht–Bauteil / °C/W |
| --- | --- | --- | --- |
| RK860 | 0.5 | 64.44 | 17.76 |

Tabelle 7-2. Klassifizierungstemperaturen für eutektischen SnPb-Prozess (TC)

| Gehäusedicke | Volumen <350 mm³ | Volumen ≥350 mm³ |
| --- | --- | --- |
| <2.5 mm | 235°C | 220°C |
| ≥2.5 mm | 220°C | 220°C |

Tabelle 7-3. Klassifizierungstemperaturen für bleifreien Prozess (TC)

| Gehäusedicke | Volumen <350 mm³ | Volumen 350–2000 mm³ | Volumen >2000 mm³ |
| --- | --- | --- | --- |
| <1.6 mm | 260°C | 260°C | 260°C |
| 1.6 mm–2.5 mm | 260°C | 250°C | 245°C |
| >2.5 mm | 250°C | 245°C | 245°C |

1. Der Bausteinhersteller, nicht jedoch der Leiterplattenbestücker/Anwender, darf eine maximale Gehäusespitzentemperatur TP oberhalb der in der Quelle genannten „Tables 1-2 or 1-3“ zulassen (tatsächlich dargestellt sind 7-2 und 7-3). Ein höheres Tp ändert die Klassifizierungstemperatur Tc nicht.
2. Das Gehäusevolumen schließt äußere Anschlüsse wie Kugeln, Höcker, Anschlussflächen und Pins sowie nicht integrierte Kühlkörper aus.
3. Die maximale Bauteiltemperatur beim Reflow hängt von Gehäusedicke und -volumen ab. Konvektions-Reflow reduziert Temperaturgradienten zwischen Gehäusen; Unterschiede der thermischen Masse von SMD-Gehäusen können dennoch Gradienten verursachen.
4. Die Feuchteempfindlichkeitsstufen von Bauteilen für bleifreie Montage müssen anhand der bleifreien Klassifizierungstemperaturen und Profile bewertet werden, auf die die Quelle als „Tables 4.2 and 1-4“ verweist, unabhängig davon, ob die Bauteile selbst bleifrei sind. Diese Verweise sind widersprüchlich und zu prüfen.
5. SMD-Gehäuse, die nach früheren Verfahren/Kriterien von J-STD-020, JESD22-A112 (zurückgezogen) oder IPC-SM-786 (zurückgezogen) klassifiziert wurden, benötigen keine Neuklassifizierung, außer wenn eine andere Stufe oder höhere Klassifizierungsspitzen­temperatur gewünscht ist.

Tabelle 7-4. Klassifizierungs-Reflowprofile

| Profilmerkmal | Eutektische Sn-Pb-Montage | Bleifreie Montage |
| --- | --- | --- |
| Vorwärmen/Halten Minimum Tsmin | 100°C | 150°C |
| Vorwärmen/Halten Maximum Tsmax | 150°C | 200°C |
| Zeit von Tsmin bis Tsmax, ts | 60–120 s | 60–120 s |
| Mittlere Aufheizrate Tsmax–Tp | ≤3°C/s | ≤3°C/s |
| Liquidustemperatur TL | 183°C | 217°C |
| Zeit am Liquidus tL | 60–150 s | 60–150 s |
| Gehäusespitzentemperatur Tp* | Quelle: Table 1-2 (tatsächlich 7-2) | Quelle: Table 1-3 (tatsächlich 7-3) |
| Zeit tp** innerhalb 5°C der Klassifizierungstemperatur Tc | 20** s | 30** s |
| Mittlere Abkühlrate Tp–Tsmax | ≤6°C/s | ≤6°C/s |
| Zeit von 25°C bis zum Spitzenwert | ≤6 min | ≤8 min |

* Die Toleranz der Profilspitzentemperatur Tp ist ein Lieferantenminimum und ein Anwendermaximum.

** Die Toleranz der Zeit bei Profilspitzentemperatur Tp ist ein Lieferantenminimum und ein Anwendermaximum.

1. Alle Temperaturen beziehen sich auf die Mitte der beim Reflow nach oben gerichteten Gehäuseoberfläche (Live-Bug; die Quelle schreibt „ive-bug“). Bei anderer Orientierung, etwa Dead-Bug, muss Tp innerhalb ±2°C des Live-Bug-Tp liegen und weiterhin Tc erfüllen; andernfalls ist das Profil anzupassen. Für genaue Gehäusespitzentemperaturmessungen die Thermoelementempfehlungen in JEP140 heranziehen.
2. Diese Profile dienen der Klassifizierung/Vorbehandlung, nicht als Vorgaben für die Leiterplattenmontage. Montageprofile sind anhand des Prozesses und des Platinendesigns zu entwickeln und dürfen die in der Quelle als „Table 1-4“ bezeichneten Parameter (tatsächlich Tabelle 7-4) nicht überschreiten. Beispiel: Bei Tc=260°C und Tp-Zeit=30 Sekunden muss der Lieferant mindestens 260°C und mindestens 30 Sekunden oberhalb 255°C erreichen; der Anwender darf 260°C und 30 Sekunden oberhalb 255°C nicht überschreiten.
3. Alle Bauteile der Prüfladung müssen die Anforderungen des Klassifizierungsprofils erfüllen.
4. SMD-Gehäuse, die nach früheren Verfahren/Kriterien von J-STD-020, JESD22-A112 (zurückgezogen) oder IPC-SM-786 (zurückgezogen) klassifiziert wurden, benötigen keine Neuklassifizierung, sofern keine Änderung der Stufe oder höhere Klassifizierungsspitzen­temperatur gewünscht ist.

![Klassifizierungsprofil (Quellbeschriftung: „Figure 5-1“, englisches Original).](/docs/rockchip-rk860-datasheet/images/p20-reflow.png)

Klassifizierungsprofil (Quellbeschriftung: „Figure 5-1“, englisches Original).

## Quellenwidersprüche und Prüfgrenzen

- PDF-Seite 6: PFET/NFET-Einheiten widersprechen Seite 10; beide Formen bleiben oben erhalten.
- Seiten 6 und 16: Nennmaße 1.65 × 2.05 weichen von der Maßzeichnung 1.61±0.025 × 2.01±0.025 ab; maßgebliche Zeichnung prüfen.
- Seiten 7–8 fordern mindestens zwei 10uF-Eingangskondensatoren, Seite 9 nennt CIN>10uF. Beide Aussagen bleiben erhalten und werden nicht stillschweigend gleichgesetzt.
- Seite 12: RESET besitzt innerhalb 3:0 keine eindeutige Bitzuweisung.
- Seite 16: Bestellmarkierungen D0–D3 und Zeichnungsmarkierungen DA–DD unterscheiden sich.
- Querverweise in Kapiteln 6–7 sind inkonsistent: Abbildungen 6-2/6-4 sowie Tabellen 1-1/1-2/1-3/1-4/4.2 gegenüber den Tabellen in Kapitel 7.
- Ipeak/Ivalley heißen Maximalströme, ihre Werte stehen jedoch in der MIN-Spalte der Originaltabelle; diese Zuordnung bleibt erhalten.
- Registeradressen, Reset-Werte, Zahlenlimits und Variantenzuordnungen wurden nicht geändert. Eine Kompatibilität konkreter ArmSoM-Platinen oder Messergebnisse wurden nicht abgeleitet.

## Offizielle Referenzen

- [ArmSoM-Platinendokumentation](https://docs.armsom.org/)
- [Offizielle Rockchip-Website](https://www.rock-chips.com/)

{% endraw %}
