---
title: "Rockchip-Kameramodul-OTP-Kalibrierung: AWB, LSC, PDAF, APIs und Datenformate"
description: "Vollständige Referenz V1.0.34 zur Kalibrierung und Prüfung von AWB/LSC sowie Gain Map/DCC Map mit allen APIs, sensor.ini, Beispielcode und OTP-Layouts."
translation_key: "075-rockchip-camera-otp-calibration"
slug: "075-rockchip-camera-otp-calibration"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "Camera", "OTP", "PDAF", "AWB", "LSC"]
keywords: "ArmSoM Rockchip camera OTP AWB LSC PDAF"
excerpt: "Vollständige Referenz V1.0.34 zur Kalibrierung und Prüfung von AWB/LSC sowie Gain Map/DCC Map mit allen APIs, sensor.ini, Beispielcode und OTP-Layouts."
---

{% raw %}

# Rockchip-Kameramodul-OTP-Kalibrierung: AWB, LSC, PDAF, APIs und Datenformate

Dieser Artikel bewahrt den vollständigen technischen Haupttext (PDF S. 9–47) der 47-seitigen englischen Quelle V1.0.34. Eine entsprechende chinesische PDF-Datei wurde nicht bereitgestellt. Die chinesische und russische Fassung übersetzen die englische Quelle vollständig; die drei bisherigen Artikel verwenden Originalabbildungen aus der englischen PDF-Datei, einschließlich darin bereits vorhandener chinesischer Beschriftungen. Auch diese deutsche Fassung übernimmt dieselben Originalabbildungen und übersetzt den vollständigen englischen Artikel. Code, Parameter, Bezeichner, Beispielwerte und Codekommentare bleiben im Quelltext erhalten; Fließtext und Bildunterschriften werden lokalisiert.

Die Chipsätze im Geltungsbereich der Quelle sind unten aufgeführt. Die Quelle nennt weder eine einheitliche Kernelversion noch bestimmte ArmSoM-Platinen. Dies ist eine ArmSoM-Plattformreferenz: Prüfen Sie den tatsächlichen SoC, das Modul, den Sensor, VCM/OIS, ISP, SDK/BSP, die Version der Kalibrierungs-DLL/API, die Treiber und das OTP-/EEPROM-Layout. Die Modulbeispiele der Quelle sind keine ArmSoM-Testergebnisse. Es wurden keine Hardwarevalidierung, Kalibrierung, Programmierung oder Kameraoperationen durchgeführt.

**Betriebsrisiko und Quellenhinweise:** OTP-/EEPROM-Programmierung kann irreversibel sein oder die Modulkalibrierung überschreiben. Prüfen Sie zuerst den Herstellerablauf und das Speicherlayout des Zielgeräts. Mehrere Standardwerte, Funktionsdeklarationen und Aufrufe im Anhang unterscheiden sich in der Quelle. Der Anhang ist ein Quellenbeispiel, keine Garantie für Kompilierbarkeit oder Produktionstauglichkeit. Formeln, Adressen, Bitbreiten und IDs behalten die Quellwerte bei; technische Konstanten wurden nicht stillschweigend korrigiert.

| Chipsätze im Geltungsbereich der Quelle |
|---|
| RV1109 / RV1126 / RK356X / RK3588 |

Quellenhinweise und Prüfprotokoll:
[EDITORIAL-NOTES](/docs/rockchip-camera-otp-calibration/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.9, block 0 -->

## 1 LSC- und AWB-Kalibrierungsablauf

<!-- Source EN PDF p.9, block 1 -->

### 1.1 Kalibrierungsverfahren

<!-- Source EN PDF p.9, block 2 -->

1\. Lichtumgebung und Ausrüstung

<!-- Source EN PDF p.9, block 3 -->

D50 (5000K±100K), unter Vermeidung von Störlicht aus der Umgebung.

<!-- Source EN PDF p.9, block 4 -->

Ein Homogenisator oder eine DNP-Lichtbox, die der obigen Lichtquelle entspricht. Der Homogenisator ist in der folgenden Abbildung dargestellt:

<!-- Source EN PDF p.9, block 5 -->

![Technische Abbildung aus der englischen Quelle, S. 9](/docs/rockchip-camera-otp-calibration/assets/en-p09-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 9.*

<!-- Source EN PDF p.9, block 6 -->

2\. Aufnahmeverfahren

<!-- Source EN PDF p.9, block 7 -->

1\. Wählen Sie je nach den tatsächlichen Gegebenheiten eines der folgenden beiden Verfahren:
   1. Mit Homogenisator: Platzieren Sie dessen beschichtete Seite nahe vor dem Objektiv und zum Objektiv hin ausgerichtet; halten Sie die Stirnfläche des Moduls, den Homogenisator und die Lichtquellenfläche parallel.
   2. Mit DNP-Lichtbox: Platzieren Sie das Modul 1-2cm vor der DNP-Lichtquellenfläche und halten Sie die Stirnfläche des Moduls parallel zu dieser Fläche.
 2. Deaktivieren Sie Funktionen wie mirror/flip.
 3. Wählen Sie die Belichtung so, dass die maximale Helligkeit (8bit) des G-Kanals im Bild zwischen 160~180 liegt.
 4. Nehmen Sie mit dieser Belichtung ein RAW-Bild auf und speichern Sie es.

<!-- Source EN PDF p.9, block 8 -->

3\. AWB-Kalibrierung

<!-- Source EN PDF p.9, block 9 -->

1\. Wählen Sie den mittleren Bereich des RAW-Bildes (20% der Länge und Breite jedes Kanals) und berechnen Sie die Mittelwerte der Kanäle R, Gr, Gb und B.

<!-- Source EN PDF p.9, block 10 -->

Gr_ave=Gr-Mittelwert der ROI - Schwarzpegel

<!-- Source EN PDF p.9, block 11 -->

Gb_ave=Gb-Mittelwert der ROI - Schwarzpegel

<!-- Source EN PDF p.9, block 12 -->

R_ave = Rot-Mittelwert der ROI - Schwarzpegel

<!-- Source EN PDF p.9, block 13 -->

B_ave = Blau-Mittelwert der ROI - Schwarzpegel

<!-- Source EN PDF p.9, block 14 -->

2\. Berechnen Sie R/Gb, B/Gb und Gr/Gb.

<!-- Source EN PDF p.9, block 15 -->

`R/Gb=R_ave/Gb_ave`

<!-- Source EN PDF p.9, block 16 -->

`B/Gb=B_ave/Gb_ave`

<!-- Source EN PDF p.10, block 17 -->

`Gr/Gb=Gr_ave/Gb_ave`

<!-- Source EN PDF p.10, block 18 -->

3\. Stellen Sie R/Gb, B/Gb und Gr/Gb als Festkommawerte mit 10 Bits dar: R/Gb_hex=R/Gb \* 1024

<!-- Source EN PDF p.10, block 19 -->

`B/Gb_hex=B/Gb * 1024`

<!-- Source EN PDF p.10, block 20 -->

`Gr/Gb_hex=Gr/Gb * 1024`

<!-- Source EN PDF p.10, block 21 -->

4\. LSC-Kalibrierung

<!-- Source EN PDF p.10, block 22 -->

1\. Setzen Sie den Zielwert für die Kalibrierungsberechnung auf 70%.

<!-- Source EN PDF p.10, block 23 -->

2\. Berechnen Sie die Verstärkung jedes der vier Kanäle mit 10 Bits.

<!-- Source EN PDF p.10, block 24 -->

### 1.2 Prüfkriterien

<!-- Source EN PDF p.10, block 25 -->

1\. Vor der LSC-Kalibrierung

<!-- Source EN PDF p.10, block 26 -->

1\. Y-Shading-Kriterium:

<!-- Source EN PDF p.10, block 27 -->

`ROI = 1/5 Width * 1/5Height`

<!-- Source EN PDF p.10, block 28 -->

`YShading_Corner = Y_Corner/Y_Center`

<!-- Source EN PDF p.10, block 29 -->

`30% < YShading_Corner < 55%`

<!-- Source EN PDF p.10, block 30 -->

`Ydiffer = YShading_Corner_Max - YShading_Corner_Min < 7%`

<!-- Source EN PDF p.10, block 31 -->

2\. Color-Shading-Kriterium:

<!-- Source EN PDF p.10, block 32 -->

Gleichmäßigkeit der Farbschattierung eines einzelnen Moduls: Begrenzen Sie den Unterschied zwischen jedem Block und dem mittleren Block des Moduls.

<!-- Source EN PDF p.10, block 33 -->

ROI-Raster: 1/5\*1/5. Berechnen Sie den Unterschied zwischen den 24 Blöcken und dem mittleren Block.

<!-- Source EN PDF p.10, block 34 -->

`ROI = 1/5Width * 1/5Height`

<!-- Source EN PDF p.10, block 35 -->

`|(R/G_Corner)/(R/G_Center)-1| < 15%`

<!-- Source EN PDF p.10, block 36 -->

`|(B/G_Corner)/(B/G_Center)-1| < 15%`

<!-- Source EN PDF p.10, block 37 -->

2\. LSC-Kalibrierung

<!-- Source EN PDF p.10, block 38 -->

Für das Problem einer asymmetrischen Randabschattung in den aufgenommenen RAW-Daten aufgrund der Modulpositionierung wurde der Schnittstelle lsc_otp_Calibrate der Parameter ratio zur Begrenzung des Kalibrierungsergebnisses hinzugefügt (Standard: ratio=1.5).

<!-- Source EN PDF p.10, block 39 -->

Verschiebt sich das optische Zentrum aufgrund der Modulmontage selbst, kann ratio erhöht werden, um die Bestehensquote zu verbessern.

<!-- Source EN PDF p.10, block 40 -->

3\. Nach der LSC-Kalibrierung

<!-- Source EN PDF p.10, block 41 -->

1\. Y-Shading-Kriterium:

<!-- Source EN PDF p.10, block 42 -->

`ROI = 1/5 Width * 1/5Height`

<!-- Source EN PDF p.10, block 43 -->

`YShading_Corner = Y_Corner/Y_Center`

<!-- Source EN PDF p.10, block 44 -->

`Ydiffer = YShading_Corner_Max - YShading_Corner_Min < 5%`

<!-- Source EN PDF p.10, block 45 -->

2\. Color-Shading-Kriterium:

<!-- Source EN PDF p.10, block 46 -->

Gleichmäßigkeit der Farbschattierung eines einzelnen Moduls: Begrenzen Sie den Unterschied zwischen jedem Block und dem mittleren Block des Moduls.

<!-- Source EN PDF p.10, block 47 -->

ROI-Raster: 1/5\*1/5. Berechnen Sie den Unterschied zwischen den 24 Blöcken und dem mittleren Block.

<!-- Source EN PDF p.10, block 48 -->

`ROI = 1/5Width * 1/5Height`

<!-- Source EN PDF p.10, block 49 -->

`|(R/G_Corner)/(R/G_Center)-1| < 5%`

<!-- Source EN PDF p.11, block 50 -->

`|(B/G_Corner)/(B/G_Center)-1| < 5%`

<!-- Source EN PDF p.12, block 51 -->

## 2 PDAF-Kalibrierungsablauf

<!-- Source EN PDF p.12, block 52 -->

Die PDAF-Kalibrierung besteht aus zwei Teilen: Gain-Map-Kalibrierung und DCC-Map-Kalibrierung. Der Ablauf lautet:

<!-- Source EN PDF p.12, block 53 -->

![Technische Abbildung aus der englischen Quelle, S. 12](/docs/rockchip-camera-otp-calibration/assets/en-p12-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 12.*

<!-- Source EN PDF p.12, block 54 -->

### 2.1 Vorbereitung der Kalibrierung

<!-- Source EN PDF p.12, block 55 -->

1\. Modulvorbereitung

<!-- Source EN PDF p.12, block 56 -->

(1) Prüfung auf Objektivverschmutzung

<!-- Source EN PDF p.12, block 57 -->

(2) VCM-Prüfung: Linearität, Genauigkeit und Stabilität der Linsenposition testen

<!-- Source EN PDF p.12, block 58 -->

(3) AF-Grundkorrektur:

<!-- Source EN PDF p.12, block 59 -->

Ermitteln Sie die Beziehung zwischen DAC und Fokusabstand: Kalibrieren Sie die Motorposition des Modulobjektivs bei Inf und Marco, zeichnen Sie die zugehörigen Werte DAC_inf und Dac_marco auf und bestimmen Sie DCC_LENS_BEGIN und DCC_LENS_END. Der Objektabstand, bei dem die Schärfe bei mittlerer Motorposition am größten ist, ist der DCC-Map-Kalibrierabstand a.

<!-- Source EN PDF p.12, block 60 -->

Die mittlere Motorposition ist DAC = (DAC_INF + DAC_MACRO)/2. Der entsprechende Kalibrierabstand a lässt sich aus der Schärfentiefentabelle des Objektivs bestimmen. Ermitteln Sie zuerst die Linsenverschiebungen für INF und MACRO, berechnen Sie die Mitte zwischen beiden und suchen Sie in der Tabelle die dieser Mitte nächstgelegene Linsenverschiebung. Daraus ergeben sich die mittlere Motorposition und der zugehörige Objektabstand A. Beispiel: Bei unendlichem Objektabstand beträgt die Linsenverschiebung 0. Als kürzester Objektabstand werden 10cm gewählt, mit einer Linsenverschiebung von -0.183. Die Linsenverschiebung in der mittleren Motorposition beträgt dann -0.0915. Der nächstgelegene Tabellenwert ist -0.091; der entsprechende DCC-Map-Kalibrierabstand a beträgt 0.20 Meter.

<!-- Source EN PDF p.13, block 61 -->

| Objektabstand (m) | Linsenverschiebung (mm) | Ferngrenze (m) | Nahgrenze (m) |
|---|---|---|---|
| INF | 0.000 | - | - |
| 10.0 | -0.002 | INF | 4.33 |
| 7.6 | -0.002 | 14417.449 | 3.81 |
| 5.0 | -0.004 | 14.511 | 3.02 |
| 4.0 | -0.004 | 8.406 | 2.63 |
| 3.0 | -0.006 | 4.941 | 2.15 |
| 2.0 | -0.009 | 2.71 | 1.59 |
| 1.9 | -0.009 | 2.53 | 1.52 |
| 1.8 | -0.010 | 2.35 | 1.46 |
| 1.7 | -0.010 | 2.19 | 1.39 |
| 1.6 | -0.011 | 2.02 | 1.32 |
| 1.5 | -0.012 | 1.87 | 1.25 |
| 1.4 | -0.013 | 1.71 | 1.18 |
| 1.3 | -0.014 | 1.57 | 1.11 |
| 1.2 | -0.015 | 1.42 | 1.04 |
| 1.1 | -0.016 | 1.28 | 0.96 |
| 1.0 | -0.018 | 1.15 | 0.88 |
| 0.9 | -0.020 | 1.02 | 0.81 |
| 0.8 | -0.022 | 0.89 | 0.72 |
| 0.7 | -0.025 | 0.77 | 0.64 |
| 0.6 | -0.029 | 0.65 | 0.56 |
| 0.5 | -0.035 | 0.53 | 0.47 |
| 0.45 | -0.039 | 0.478 | 0.425 |
| 0.40 | -0.044 | 0.422 | 0.380 |
| 0.35 | -0.051 | 0.366 | 0.335 |
| 0.30 | -0.059 | 0.312 | 0.289 |
| 0.25 | -0.071 | 0.258 | 0.242 |
| 0.20 | -0.091 | 0.202 | 0.192 |
| 0.15 | -0.120 | 0.153 | 0.147 |
| 0.14 | -0.129 | 0.142 | 0.138 |
| 0.13 | -0.140 | 0.132 | 0.128 |
| 0.12 | -0.152 | 0.122 | 0.118 |
| 0.11 | -0.166 | 0.111 | 0.109 |
| 0.10 | -0.183 | 0.101 | 0.099 |
| 0.09 | -0.205 | 0.091 | 0.089 |
| 0.08 | -0.232 | 0.081 | 0.079 |
| 0.07 | -0.267 | 0.071 | 0.069 |
| 0.06 | -0.315 | 0.060 | 0.060 |
| 0.05 | -0.383 | 0.050 | 0.050 |

<!-- Source EN PDF p.15, block 63 -->

| Punkt | Einzelheiten | Hinweis |
|---|---|---|
| Testtafel | Herstellerdefinition | Empfohlen werden kontrastreiche Testtafeln<br>mit mittlerer Ortsfrequenz, etwa Schachbrett-<br>oder Rautenmuster. |
| Beleuchtungsstärke<br>der Testfläche | Mehr als 400Lux | Das Bild darf nicht flimmern. |
| Abstand zwischen<br>Modul und<br>Testtafel | INF:2~5m Marco:10-20cm<br>(Einzelheiten siehe<br>Schärfentiefentabelle) | Für INF wird die Teleposition<br>mit einem Telekonverter simuliert. |
| Ausrichtung bei<br>der Modulkorrektur | Bei der INF-/MACRO-Korrektur<br>liegt die optische Achse<br>des Moduls horizontal. | Bei Open-Loop-VCM wird nur horizontal korrigiert.<br>Bei Closed-Loop-VCM kann die optische Achse<br>zur Korrektur nach oben gerichtet sein.<br>Die Richtung der Inf-/Macro-Korrektur muss gleich sein. |
| Verstärkungseinstellungen | Wie bei AWB | Die digitale Verstärkung ist fest 1;<br>analoge Verstärkung: bei traditionellem PD<br>oder 2x1OCL again auf 1x,<br>bei Dual-Photodiode-PD again auf 2x setzen. |
| Sensoreinstellungen | mirror/flip/OB und<br>Defektpixelentfernung<br>im Sensor deaktivieren |  |
| Anforderungen an<br>die Bildhelligkeit | Wie bei AWB | Bei Darstellung in voller Größe beträgt der Mittelwert<br>der hellsten 10% des G-Kanals in der mittleren<br>ROI von 1/32W*1/32H 800LSB (raw10);<br>der Mittelwert des Dual-PD-G-Kanals beträgt<br>700LSB (raw10). |
| Anzahl der Prüfmuster<br>für die Fehlerprüfung | Bereichsprüfung: Jedes Modul<br>muss genau geprüft werden;<br>mehr als 10pcs. | Schlägt der Test fehl, muss das Korrekturverfahren<br>angepasst werden, um die AF-Korrektur<br>für Fern- und Nahfokus zu präzisieren. |

<!-- Source EN PDF p.15, block 64 -->

(4) Unterstützt das Modul OIS, muss vor der LSC- und PDAF-Kalibrierung die Verwacklungskorrektur abgeschlossen werden. Bewegen Sie den Motor zur XY-Referenzposition, um die OIS-Konfiguration zu überprüfen. Dieser Schritt erzeugt homogene Feldbilder für die LSC- und PDAF-Indexierung.

<!-- Source EN PDF p.15, block 65 -->

(5) Schließen Sie Schwarzpegel- und LSC-Korrektur ab. Falls erforderlich, kann die Bildfeldwölbung korrigiert werden.

<!-- Source EN PDF p.15, block 66 -->

2. AE-Einstellungen des Moduls

<!-- Source EN PDF p.15, block 67 -->

(1) AE-Einstellung des Moduls: Die digitale Verstärkung ist fest 1. Analoge Verstärkung: Bei traditionellem PD oder 2x1OCL wird again auf 1x gesetzt; bei Dual-Photodiode-PD auf 2x, um Pixel-Blooming zu vermeiden.

<!-- Source EN PDF p.15, block 68 -->

<!-- Source EN PDF p.15, block 69 -->

(2) Belichtungszeit: Um Ladungs-Blooming bei Dual-PD und Überbelichtung normaler Pixel (regular_pixel=dual_pd_l+dual_pd_r) zu vermeiden, passen Sie die Belichtungszeit so an, dass bei Darstellung in voller Größe die Helligkeit des G-Kanals im mittleren Bereich 700 (raw10) beträgt. Bei OCL- und Metal-Shield-Typen muss die G-Kanal-Helligkeit im Zentrum 800 (raw10) betragen. Für den Sensor wird eine Belichtungszeit als ganzzahliges Vielfaches von 10ms empfohlen, um Netzfrequenzstörungen zu vermeiden.

<!-- Source EN PDF p.16, block 70 -->

### 2.2 Gain-Map-Kalibrierung

<!-- Source EN PDF p.16, block 71 -->

1. Lichtumgebung und Ausrüstung

<!-- Source EN PDF p.16, block 72 -->

D50 (5000K±100K), unter Vermeidung von Störlicht aus der Umgebung.

<!-- Source EN PDF p.16, block 73 -->

Homogenisator oder DNP-Lichtbox entsprechend der obigen Lichtquelle; Ulbricht-Kugel.

<!-- Source EN PDF p.16, block 74 -->

2. Aufnahmeverfahren

<!-- Source EN PDF p.16, block 75 -->

![Technische Abbildung aus der englischen Quelle, S. 16](/docs/rockchip-camera-otp-calibration/assets/en-p16-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 16.*

<!-- Source EN PDF p.16, block 76 -->

  1. Platzieren Sie das Modul vor der homogenen Flächenlichtquelle und halten Sie seine Stirnfläche parallel zur Lichtquellenfläche. Bei der im Versuch verwendeten Ulbricht-Kugel wird die Flächenhelligkeit beispielsweise auf 6.6 eingestellt. Platzieren Sie den Homogenisator vor dem Objektiv, damit die Flächenlichtquelle das Bild ausfüllt.
  2. Sensorverstärkung: Bei Metal-Shield- und 2x1OCL-Sensoren again und dgain auf 1x setzen. Bei Dual-PD-Sensoren again auf 2x und dgain auf 1x setzen; die Belichtungszeit auf Vielfache von 10 einstellen.
  3. Deaktivieren Sie Sensoreinstellungen wie mirro/flip/OB.
  4. Bei Darstellung in voller Größe beträgt der Mittelwert der hellsten 10% des G-Kanals in der mittleren ROI von 1/32W\*1/32H 800LSB (raw10) oder 200LSB (raw8). Der Mittelwert des Dual-PD-G-Kanals beträgt 700LSB (raw10) oder 175LSB (raw8).
  5. Schalten Sie die Kamera ein und lassen Sie sie 3 Minuten aufwärmen. Bewegen Sie den Motor in die mittlere Position und nehmen Sie 3 RAW-Bilder nacheinander auf. Prüfen Sie zuerst, ob die Anzahl defekter Pixel den zulässigen Bereich überschreitet. Ist dies der Fall, verringern Sie die Bildhelligkeit und nehmen Sie erneut auf. Wird die Defektpixelprüfung bestanden, bilden Sie die gemittelten Bilddaten.

<!-- Source EN PDF p.16, block 77 -->

3. Kalibrierung

<!-- Source EN PDF p.16, block 78 -->

Der Aufruf von pdaf_gainmap_calibration (...) erzeugt die Gain-Map-Daten und liefert deren Größe: gainmap_width\*gainmap_height \*2 Bytes, einschließlich linker und rechter Gain Map.

<!-- Source EN PDF p.16, block 79 -->

4. Verifikation

<!-- Source EN PDF p.16, block 80 -->

1\. Stellen Sie dieselbe Umgebung wie in Schritt 2 sicher und nehmen Sie ein Testbild auf. Übergeben Sie die kalibrierte Gain Map und das Testbild an pdaf_gainmap_vertification (...). Bei Rückgabe 1 ist die Verifikation erfolgreich und die kalibrierte Gain Map verwendbar. Bei Rückgabe -1 prüfen Sie, ob die Anzahl defekter Pixel den zulässigen Bereich überschreitet; verringern Sie die Bildhelligkeit und nehmen Sie erneut auf.

<!-- Source EN PDF p.16, block 81 -->

2\. Verifikationskriterien

<!-- Source EN PDF p.16, block 82 -->

Beträgt der Unterschied zwischen dem durch die Gain Map korrigierten linken und rechten PD-Pixel weniger als 5%, ist die Verifikation erfolgreich.

<!-- Source EN PDF p.17, block 83 -->

### 2.3 DCC-Map-Kalibrierung

<!-- Source EN PDF p.17, block 84 -->

DCC (defocus conversion coefficient, Defokus-Umrechnungskoeffizient) beschreibt die Beziehung zwischen Motorposition und Unterschieden des linken und rechten Bildes. Das Bild wird in Bereiche aufgeteilt, der Motor in gleichen Schritten bewegt und der PD-Wert an verschiedenen Positionen berechnet. Durch lineare Regression werden die DCC-Werte der einzelnen Bereiche bestimmt: DCCMAP.

![Formel aus der Quelle, PDF S. 17](/docs/rockchip-camera-otp-calibration/assets/en-p17-formula1.png)

`DCC = Δlensposition[dac]/Δphasedisparity[pixel]`

<!-- Source EN PDF p.17, block 85 -->

![Technische Abbildung aus der englischen Quelle, S. 17](/docs/rockchip-camera-otp-calibration/assets/en-p17-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 17.*

<!-- Source EN PDF p.17, block 86 -->

[optional]

<!-- Source EN PDF p.17, block 87 -->

Bei manchen Modulen muss PD_OFFSET kalibriert werden. Beispielsweise ergibt sich bei der Motorposition DAC_0 ein unscharfes Fokusbild; die berechnete scharfe Fokusposition lautet DAC = DAC_0 + PD \* DCC + PD_OFFSET \* DCC.

<!-- Source EN PDF p.17, block 88 -->

1. Lichtumgebung und Ausrüstung

<!-- Source EN PDF p.17, block 89 -->

D50 (5000K±100K), unter Vermeidung von Störlicht aus der Umgebung.

<!-- Source EN PDF p.17, block 90 -->

Homogenisierungsfolie oder DNP-Lichtbox entsprechend der obigen Lichtquelle, Ulbricht-Kugel und Schwarz-Weiß-Referenztafel.

<!-- Source EN PDF p.17, block 91 -->

Referenztafel: Sie besteht aus einer individuell gefertigten lichtdurchlässigen Folie mit gleichmäßig angeordneten schwarzen und weißen Streifen oder einem Rautengitter.

<!-- Source EN PDF p.17, block 92 -->

![Technische Abbildung aus der englischen Quelle, S. 17](/docs/rockchip-camera-otp-calibration/assets/en-p17-figure2.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 17.*

<!-- Source EN PDF p.18, block 93 -->

![Technische Abbildung aus der englischen Quelle, S. 18](/docs/rockchip-camera-otp-calibration/assets/en-p18-figure2.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 18.*

<!-- Source EN PDF p.18, block 94 -->

![Technische Abbildung aus der englischen Quelle, S. 18](/docs/rockchip-camera-otp-calibration/assets/en-p18-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 18.*

<!-- Source EN PDF p.18, block 95 -->

Der Kalibrierabstand a wird im Schritt zur AF-Grundkorrektur 2.1.1 bestimmt.

<!-- Source EN PDF p.18, block 96 -->

Die Breite der Referenztafel hängt vom horizontalen FOV des Objektivs und vom Kalibrierabstand a ab. Empfohlen wird:

![Formel aus der Quelle, PDF S. 18](/docs/rockchip-camera-otp-calibration/assets/en-p18-formula1.png)

`S >= a * tan(FOV * pi/360) * 2/0.9`

<!-- Source EN PDF p.18, block 97 -->

Der Kalibrierabstand wird im Schritt zur AF-Grundkorrektur 2.1.1 bestimmt.

<!-- Source EN PDF p.18, block 98 -->

Die Breite der Referenztafel hängt vom horizontalen FOV des Objektivs und vom Kalibrierabstand a ab. Empfohlen wird:

![Formel aus der Quelle, PDF S. 18](/docs/rockchip-camera-otp-calibration/assets/en-p18-formula2.png)

`λ[mm] = (u[um]/1000) * raw_width/(6 * dccmap_width)`

![Formel aus der Quelle, PDF S. 18](/docs/rockchip-camera-otp-calibration/assets/en-p18-formula3.png)

`W[mm] = (a[mm] - f[mm])/f[mm] * λ[mm]`

<!-- Source EN PDF p.18, block 99 -->

Für IMX258 wird der Koeffizient λ=0.11 empfohlen, für S5KJN1 λ=0.088~0.099.

<!-- Source EN PDF p.18, block 100 -->

Die DCC-Kalibrierung verlangt eine korrekt angefertigte und platzierte Referenztafel. Ungeeignete Streifenbreiten, Verdrehung oder Verformung beim Aufstellen sowie zu geringe Helligkeit oder Überbelichtung führen zum Scheitern der DCC-Kalibrierung. Die folgende Abbildung zeigt einige Fehlerfälle.

<!-- Source EN PDF p.18, block 101 -->

![Technische Abbildung aus der englischen Quelle, S. 18](/docs/rockchip-camera-otp-calibration/assets/en-p18-figure3.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 18.*

<!-- Source EN PDF p.18, block 102 -->

2. Aufnahmeverfahren

<!-- Source EN PDF p.19, block 103 -->

  1. Platzieren Sie die Streifenfolie vor der Ulbricht-Kugel und das Modul vor der Referenztafel ungefähr in der mittleren Fokusposition. Der Abstand wird durch die AF-Grundkorrektur in Schritt 2.1.1 bestimmt. Halten Sie die Stirnfläche parallel zur Referenztafel; vermeiden Sie Drehung, Neigung und Verwindung der Tafel. Das Muster muss bei der Aufnahme das gesamte Bild ausfüllen.
  2. Sensorverstärkung: Bei Metal-Shield- und 2x1OCL-Sensoren again und dgain auf 1x setzen; bei Dual-PD-Sensoren again auf 2x und dgain auf 1x.
  3. Deaktivieren Sie mirro/flip/OB und Defektpixelentfernung im Sensor.
  4. Belichtung: Stellen Sie sicher, dass der Mittelwert des G-Kanals im weißen Block der mittleren ROI von 1/32w\*1/32h auf der Referenztafel 800LSB (raw10) beziehungsweise 200LSB (raw8) beträgt. Der Mittelwert des Dual-PD-G-Kanals muss 700LSB (raw10) oder 175LSB (raw8) betragen, damit unzureichende Helligkeit oder Überbelichtung die DCC-Kalibrierungsgenauigkeit nicht beeinträchtigen. Bei Metal-Shield-Sensoren dürfen die nicht abgeschirmten Pixel nicht überbelichtet sein.
  5. Bewegen Sie den Motor von DCC_LENS_BEGIN bis DCC_LENS_END in Schritten von DCC_LENS_INTERVAL. Nehmen Sie nach jeder Stabilisierung des Motors drei RAW-Bilder auf und bilden Sie die gemittelten Bilddaten für jede Position. Im Versuch wurde der Code beispielsweise von 0 bis 64 in Schritten von 8 verändert; dies ergab insgesamt 9 Positionen und 27 Bilder.

<!-- Source EN PDF p.19, block 104 -->

3. Kalibrierung

<!-- Source EN PDF p.19, block 105 -->

Übergeben Sie die in Abschnitt 2.1 kalibrierte Gain Map, die Motorpositionsparameter und die gemittelten Bilddaten jeder Position an pdaf_dccmap_calibration (...), um die DCC-Map-Daten und deren Größe zu erhalten.

<!-- Source EN PDF p.19, block 106 -->

<!-- Source EN PDF p.19, block 107 -->

Die Größe beträgt dccmap _width\*dccmap _height \*2 Bytes. Bei gewählter PD_OFFSET-Kalibrierung beträgt die Wertgröße ebenfalls 2bytes; die Quelle nennt hierbei DCC_RSQ_THRESHOLD. Überschreitet die Anzahl der Blöcke, die den Linearitätsschwellenwert nicht erfüllen, einen bestimmten Wert, schlägt die Kalibrierung fehl. Prüfen Sie dann die Eingabedaten, passen Sie die Kalibrierumgebung an und nehmen Sie erneut auf.

<!-- Source EN PDF p.19, block 108 -->

4. Verifikation

<!-- Source EN PDF p.19, block 109 -->

Dieser Schritt prüft, ob die aktuell kalibrierte DCC Map korrekt ist. Der Prüfablauf ist nachfolgend dargestellt:

<!-- Source EN PDF p.19, block 110 -->

![Technische Abbildung aus der englischen Quelle, S. 19](/docs/rockchip-camera-otp-calibration/assets/en-p19-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 19.*

<!-- Source EN PDF p.19, block 111 -->

1\. Die Beleuchtungsumgebung der Prüfaufnahmen muss der DCC-Map-Kalibrierumgebung entsprechen. Die Objektivfläche ist parallel zur Referenztafel auszurichten, sodass deren Muster bei der Aufnahme das Bild vollständig ausfüllt.

<!-- Source EN PDF p.19, block 112 -->

2\. Schalten Sie die Kamera ein und lassen Sie sie 3 Minuten aufwärmen. Stellen Sie den Motor auf eine Position DAC0 mit unscharfem Bild:

![Formel aus der Quelle, PDF S. 19](/docs/rockchip-camera-otp-calibration/assets/en-p19-formula1.png)

`DAC0 ∈ (DACinf + 0.2 * abs(DACinf - DACmacro), DACinf + 0.8 * abs(DACinf - DACmacro)]`

<!-- Source EN PDF p.20, block 113 -->

Nehmen Sie nach Stabilisierung des Motors drei RAW-Bilder auf und mitteln Sie die Bilddaten. Übergeben Sie die aktuelle Motorposition DAC0, die gemittelten Bilddaten sowie die kalibrierte Gain Map und DCC Map an pdaf_dccmap_vertification(). Die Funktion berechnet aus der unscharfen Aufnahme die ideale Fokusposition DAC1.

<!-- Source EN PDF p.20, block 114 -->

3\. Bewegen Sie den Motor anschließend auf DAC1 und nehmen Sie fünf Bilder im Bereich tolerance_factor\*abs(DACinf-DACmacro)+Δ (beispielsweise Δ=2) vor und hinter DAC1 auf. tolerance_factor bezeichnet den Toleranzbereich der Verifikation; der Fehlerbereich unterscheidet sich nach Sensortyp, beispielsweise 5%, 10% oder 20%.

<!-- Source EN PDF p.20, block 115 -->

Bewegen Sie den Motor während der Verifikation von Position 1 bis Position 5. Die fünf Positionen lauten beispielsweise für tolerance_factor=10% und Δ=2:

<!-- Source EN PDF p.20, block 116 -->

4.

| Index | Position |
|---|---|
| 1 | DAC1-10% *abs(DACinf-DACmacro)-Δ |
| 2 | DAC1-10% *abs(DACinf-DACmacro) |
| 3 | DAC1 |
| 4 | DAC1+10% *abs(DACinf-DACmacro) |
| 5 | DAC1+10% *abs(DACinf-DACmacro)+Δ |

<!-- Source EN PDF p.20, block 118 -->

5\. Übergeben Sie die fünf Bilder an pdaf_calc_sharpness (...). Berechnen Sie die Schärfe im mittleren Bildbereich DCC_PERCENT_ROI_W\* DCC_PERCENT_ROI_H, beispielsweise 30%\*30%, und prüfen Sie, ob ein Maximum vorliegt. Ist dies der Fall, ist die Verifikation erfolgreich. Schlägt sie fehl, erweitern Sie den Bereich von tolerance_factor und Δ, etwa Δ von 2 auf 5, nehmen Sie erneut 5 Bilder auf und wiederholen Sie Schritt 4. Zur Schärfeberechnung sollte vorzugsweise ein Kanal mit wenigen PD-Pixeln gewählt werden.

<!-- Source EN PDF p.20, block 119 -->

![Technische Abbildung aus der englischen Quelle, S. 20](/docs/rockchip-camera-otp-calibration/assets/en-p20-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 20.*

<!-- Source EN PDF p.21, block 120 -->

## 3 Kalibrierungsverfahren

<!-- Source EN PDF p.21, block 121 -->

Zu den kalibrierten Modulen gehören AWB (automatischer Weißabgleich), LSC (Objektivabschattungskorrektur) und PDAF (Phasendetektions-Autofokus).

<!-- Source EN PDF p.21, block 122 -->

### 3.1 AWB-Kalibrierung

<!-- Source EN PDF p.21, block 123 -->

【Funktionsbeschreibung】

<!-- Source EN PDF p.21, block 124 -->

Diese Funktion berechnet R/G, B/G und Gr/Gb der ROI eines RAW-Bildes.

<!-- Source EN PDF p.21, block 125 -->

【Funktionsprototyp】

<!-- Source EN PDF p.21, block 126 -->

```text
bool awb_otp_Calibrate(uint16_t* RawAddr, int width, int height, int roiw,
                       int roih, int bits, int bayer, int blc_r, int blc_gr,
                       int blc_gb, int blc_b, uint16_t* R, uint16_t* Gr,
                       uint16_t*Gb, uint16_t* B, uint16_t* R_G, uint16_t* B_G,
                       uint16_t* Gr_Gb)
```

<!-- Source EN PDF p.21, block 127 -->

【Eingabeinformationen】

<!-- Source EN PDF p.21, block 128 -->

| Parametername | Beschreibung |
|---|---|
| RawAddr | Vom aktuellen Modul in der Fertigung aufgenommene RAW-Bilddaten |
| width | Breite des RAW-Bildes |
| height | Höhe des RAW-Bildes |
| bits | Anzahl Bits pro Pixel. 10bit=10 |
| roiw | Kehrwert des Verhältnisses von ROI-Breite zu Bildbreite |
| roih | Kehrwert des Verhältnisses von ROI-Höhe zu Bildhöhe |
| bayer | Bayer-Muster für RAW-Bilder. BGGR=0， GBRG=1，GRBG=2， RGGB=3 |
| blc_r | BLC des R-Kanals |
| blc_gr | BLC des Gr-Kanals |
| blc_gb | BLC des Gb-Kanals |
| blc_b | BLC des B-Kanals |

<!-- Source EN PDF p.21, block 129 -->

【Ausgabeinformationen】

<!-- Source EN PDF p.22, block 130 -->

| Parametername | Beschreibung |
|---|---|
| R | Mittelwert des R-Kanals in der ROI |
| Gr | Mittelwert des Gr-Kanals in der ROI |
| Gb | Mittelwert des Gb-Kanals in der ROI |
| B | Mittelwert des B-Kanals in der ROI |
| R_G | Verhältnis des R-Kanal-Mittelwerts zum Gb-Kanal-Mittelwert<br>in der ROI *1024 |
| B_G | Verhältnis des B-Kanal-Mittelwerts zum Gb-Kanal-Mittelwert<br>in der ROI *1024 |
| Gr_Gb | Verhältnis des Gr-Kanal-Mittelwerts zum Gb-Kanal-Mittelwert<br>in der ROI *1024 |

<!-- Source EN PDF p.22, block 131 -->

【Rückgabewert】

<!-- Source EN PDF p.22, block 132 -->

=0: Der Parameter ist fehlerhaft.

<!-- Source EN PDF p.22, block 133 -->

=1: Die Kalibrierung war erfolgreich.

<!-- Source EN PDF p.22, block 134 -->

### 3.2 LSC-Kalibrierung

<!-- Source EN PDF p.22, block 135 -->

#### 3.2.1 LSC-Kalibrierung

<!-- Source EN PDF p.22, block 136 -->

【Funktionsbeschreibung】

<!-- Source EN PDF p.22, block 137 -->

Diese Funktion berechnet die Verstärkung jedes Kanals des RAW-Bildes.

<!-- Source EN PDF p.22, block 138 -->

【Funktionsprototypen】

<!-- Source EN PDF p.22, block 139 -->

```text
bool lsc_otp_Calibrate(int vig,uint16_t* RawAddr, int width, int height,
                       int bits, int bayer, int blc_r, int blc_gr,
                       int blc_gb, int blc_b, float ratio, uint16_t* lsc_otp)
```

<!-- Source EN PDF p.22, block 140 -->

【Eingabeinformationen】

<!-- Source EN PDF p.23, block 141 -->

| Parametername | Beschreibung |
|---|---|
| vig | LSC-Korrekturstärke, Standard vig=70 (%) |
| RawAddr | Vom aktuellen Modul in der Fertigung aufgenommene RAW-Bilddaten |
| width | Breite des RAW-Bildes |
| height | Höhe des RAW-Bildes |
| bits | Anzahl Bits pro Pixel. 10bit=10 |
| bayer | Bayer-Muster für RAW-Bilder. BGGR=0， GBRG=1，GRBG=2， RGGB=3 |
| blc_r | BLC des R-Kanals |
| blc_gr | BLC des Gr-Kanals |
| blc_gb | BLC des Gb-Kanals |
| blc_b | BLC des B-Kanals |
| ratio | Schwellenwert zur Beurteilung der Symmetrie der Randabschattung;<br>empfohlen: ratio=1.5 |

<!-- Source EN PDF p.23, block 142 -->

【Ausgabeinformationen】

<!-- Source EN PDF p.23, block 143 -->

| Parametername | Beschreibung |
|---|---|
| lsc_otp | LSC-Verstärkung：<br>● R-Kanal-Verstärkung（17 * 17）<br>● Gr-Kanal-Verstärkung（17 * 17）<br>● Gb-Kanal-Verstärkung（17 * 17）<br>● B-Kanal-Verstärkung（17 * 17） |

<!-- Source EN PDF p.23, block 144 -->

【Rückgabewert】

<!-- Source EN PDF p.23, block 145 -->

=0: Die LSC-Kalibrierungsdaten und die Randabschattung sind fehlerhaft.

<!-- Source EN PDF p.23, block 146 -->

=1: Kalibrierung erfolgreich.

<!-- Source EN PDF p.23, block 147 -->

#### 3.2.2 LSC-Verifikation

<!-- Source EN PDF p.23, block 148 -->

【Funktionsbeschreibung】

<!-- Source EN PDF p.23, block 149 -->

Diese Funktion prüft die Ergebnisse der LSC-Kalibrierung.

<!-- Source EN PDF p.23, block 150 -->

【Funktionsprototypen】

<!-- Source EN PDF p.24, block 151 -->

```text
bool lsc_otp_verify(uint16_t *RawAddr, int width, int height, int bits,
                    int bayer, int blc_r, int blc_gr, int blc_gb,
                    int blc_b, uint16_t *lsc_otp, int Ydiffer_down,
                    int Ydiffer_up, int ColorShading_down,
                    int ColorShading_up, float *fYdiffer,
                    float *fRGCorner,float *fBGCorner)
```

<!-- Source EN PDF p.24, block 152 -->

【Eingabeinformationen】

<!-- Source EN PDF p.24, block 153 -->

| Parametername | Beschreibung |
|---|---|
| RawAddr | Vom aktuellen Modul in der Fertigung aufgenommene RAW-Bilddaten |
| width | Breite des RAW-Bildes |
| height | Höhe des RAW-Bildes |
| bits | Anzahl Bits pro Pixel. 10bit=10 |
| bayer | Bayer-Muster für RAW-Bilder. BGGR=0， GBRG=1，GRBG=2， RGGB=3 |
| blc_r | BLC des R-Kanals |
| blc_gr | BLC des Gr-Kanals |
| blc_gb | BLC des Gb-Kanals |
| blc_b | BLC des B-Kanals |
| lsc_otp | Von lsc_otp_Calibrate berechnete Ausgabe lsc_otp |
| Ydiffer_down | Untergrenze des Prüfkriteriums YShading_Corner_Max -<br>YShading_Corner_Min nach Kalibrierung, in Prozent |
| Ydiffer_up | Obergrenze des Prüfkriteriums YShading_Corner_Max -<br>YShading_Corner_Min nach Kalibrierung, in Prozent |
| ColorShading_down | Untergrenze des Prüfkriteriums nach Kalibrierung &#124;<br>(R/G_Corner)/(R/G_Center)-1&#124;、&#124;(B/G_Corner)/(B/G_Center)-1&#124;,<br>in Prozent |
| ColorShading_up | Obergrenze des Prüfkriteriums nach Kalibrierung &#124;<br>(R/G_Corner)/(R/G_Center)-1&#124;、&#124;(B/G_Corner)/(B/G_Center)-1&#124;,<br>in Prozent |

<!-- Source EN PDF p.24, block 154 -->

【Ausgabeinformationen】

<!-- Source EN PDF p.25, block 155 -->

| Parametername | Beschreibung |
|---|---|
| fYdiffer | Wert von YShading_Corner_Max - YShading_Corner_Min |
| fRGCorner | Wert jedes Blocks &#124;(R/G_Corner)/(R/G_Center)-1&#124;, insgesamt 5 x 5<br>Blöcke |
| fBGCorner | Wert jedes Blocks &#124;(B/G_Corner)/(B/G_Center)-1&#124;, insgesamt 5 x 5<br>Blöcke |

<!-- Source EN PDF p.25, block 156 -->

【Rückgabewert】

<!-- Source EN PDF p.25, block 157 -->

=0: Die Prüfkriterien nach der Kalibrierung werden nicht erfüllt; die Verifikation schlägt fehl.

<!-- Source EN PDF p.25, block 158 -->

=1: Verifikation erfolgreich.

<!-- Source EN PDF p.26, block 159 -->

### 3.3 PDAF-Kalibrierung

<!-- Source EN PDF p.26, block 160 -->

#### 3.3.1 Sensorkonfiguration abrufen

<!-- Source EN PDF p.26, block 161 -->

【Funktionsbeschreibung】

<!-- Source EN PDF p.26, block 162 -->

Konfigurieren Sie sensor.ini und lesen Sie die Informationen zum PD-Sensor aus dieser Datei.

<!-- Source EN PDF p.26, block 163 -->

【Konfigurationsinhalt】

<!-- Source EN PDF p.26, block 164 -->

[sensor config]

<!-- Source EN PDF p.27, block 165 -->

| Schlüsselwörter | Beschreibung |
|---|---|
| RAW_WIDTH | RAW-Bildbreite |
| RAW_HEIGHT | RAW-Bildhöhe |
| RAW_BITS | Bitbreite des Pixelwerts |
| RAW_BLACK_LEVEL | Schwarzpegelwert |
| RAW_BAYER_PATTERN | Bayer-Muster des RAW-Bildes. 0:BGGR，1:GBRG，2:GRBG，3:RGGB |
| SENSOR_TYPE | 0：shieldPD oder 1x2OCL 1: horizontal und vertikal (LR&TB) 2：<br>reserviert 3:reserviert |
| PD_DUAL_MODE | 0:kein Dual-PD 1:Dual-PD |
| PD_BINNING_TYPE | Kalibrierung mit Binning-PD 0:OFF 1:ON |
| MIPI_MIX_MODE | 0:Daten enthalten nur RAW- oder PD-Daten 1:Daten enthalten RAW- und<br>PD-Daten; nur wirksam bei PD_DUAL_MODE=1 |
| PD_OFFSET_X | x-Offset des PD-Blocks |
| PD_OFFSET_Y | y-Offset des PD-Blocks |
| PD_PITCH_X | x-Rasterabstand des PD-Blocks |
| PD_PITCH_Y | y-Rasterabstand des PD-Blocks |
| PD_DENSITY_X | x-Abstand eines Paars linker/rechter PD-Pixel |
| PD_DENSITY_Y | y-Abstand eines Paars linker/rechter PD-Pixel |
| PD_BLOCK_NUM_X | Gesamtzahl der PD-Blöcke in x-Richtung |
| PD_BLOCK_NUM_Y | Gesamtzahl der PD-Blöcke in y-Richtung |
| CALB_S_LEVEL | Sättigungspegel, Standard 100 |
| CALB_S_CNT | Sättigungsanzahl, Standard 10 |
| PD_POS_L | Position des linken PD-Pixels innerhalb eines PD-Blocks |
| PD_POS_R | Position des rechten PD-Pixels innerhalb eines PD-Blocks |

<!-- Source EN PDF p.27, block 166 -->

Dual-Typ

<!-- Source EN PDF p.27, block 167 -->

[sensor config]

<!-- Source EN PDF p.28, block 168 -->

| Schlüsselwörter | Beschreibung |
|---|---|
| RAW_WIDTH | RAW-Bildbreite |
| RAW_HEIGHT | RAW-Bildhöhe |
| LR_WIDTH | PD-Bildbreite |
| LR_HEIGHT | PD-Bildhöhe |
| RAW_BITS | Bitbreite des Pixelwerts |
| RAW_BLACK_LEVEL | Schwarzpegelwert |
| RAW_BAYER_PATTERN | Bayer-Muster des RAW-Bildes. 0:BGGR，1:GBRG，2:GRBG，3:RGGB |
| SENSOR_TYPE | 0：shieldPD oder 1x2OCL 1: horizontal und vertikal (LR&TB) 2:reserviert<br>3:reserviert |
| PD_DUAL_MODE | 0:kein Dual-PD 1:Dual-PD |
| PD_BINNING_TYPE | Kalibrierung mit Binning-PD 0:OFF 1:ON |
| MIPI_MIX_MODE | 0:Daten enthalten nur RAW- oder PD-Daten 1:Daten enthalten RAW- und<br>PD-Daten; nur wirksam bei PD_DUAL_MODE=1 |
| PD_OFFSET_X | x-Offset des PD-Blocks |
| PD_OFFSET_Y | y-Offset des PD-Blocks |
| PD_PITCH_X | x-Rasterabstand des PD-Blocks |
| PD_PITCH_Y | y-Rasterabstand des PD-Blocks |
| PD_DENSITY_X | x-Abstand eines Paars linker/rechter PD-Pixel |
| PD_DENSITY_Y | y-Abstand eines Paars linker/rechter PD-Pixel |
| PD_BLOCK_NUM_X | Gesamtzahl der PD-Blöcke in x-Richtung |
| PD_BLOCK_NUM_Y | Gesamtzahl der PD-Blöcke in y-Richtung |
| CALB_S_LEVEL | Sättigungspegel, Standard 100 |
| CALB_S_CNT | Sättigungsanzahl, Standard 10 |
| PD_POS_L | Position des linken PD-Pixels innerhalb eines PD-Blocks |
| PD_POS_R | Position des rechten PD-Pixels innerhalb eines PD-Blocks |

<!-- Source EN PDF p.28, block 169 -->

[Gainmap_Calib]

<!-- Source EN PDF p.29, block 170 -->

| Schlüsselwörter | Beschreibung |
|---|---|
| GAINMAP_BLKSZ_W | Breite eines Gain-Map-Blocks |
| GAINMAP_BLKSZ_H | Höhe eines Gain-Map-Blocks |
| GAIN_CALIB_INPUT_MAX | Maximaler Eingangs-RAW-Bildpegel:920(raw10) |
| GAIN_CALIB_INPUT_MIN | Minimaler Eingangs-RAW-Bildpegel:800(raw10) |
| GAIN_VERIFY_DIFF_MAX | L/R-Differenzschwelle nach Verstärkung (5%*1024) |
| CROSS_VER | Gain Map anhand anderer Bilder prüfen |

<!-- Source EN PDF p.29, block 171 -->

[DCCmap_Calib]

<!-- Source EN PDF p.29, block 172 -->

| Schlüsselwörter | Beschreibung |
|---|---|
| DCCMAP_BLKSZ_W | Breite eines DCC-Map-Blocks |
| DCCMAP_BLKSZ_H | Höhe eines DCC-Map-Blocks |
| DCC_CALIBRATE_MODE | DCC-Kalibrierungsmodus, Standard 1 |
| DCC_LENS_BEGIN | Startposition der DAC-Code-Abtastung |
| DCC_LENS_END | Endposition der DAC-Code-Abtastung |
| DCC_LENS_INTERVAL | Abtastintervall des DAC-Codes |
| DCC_RSQ_THRESHOLD | Schwellenwert der rsq-Matrix |
| DCC_BORDER_RSQ_THRESHOLD | Schwellenwert der rsq-Randmatrix |
| DCC_BAD_RSQ_NUM_RATIO | Anteil fehlerhafter rsq-Matrizen |
| DCC_CALIB_INPUT_MAX | Maximaler Eingangs-RAW-Bildpegel:640(raw10) oder 160(raw8) |
| DCC_CALIB_INPUT_MIN | Minimaler Eingangs-RAW-Bildpegel:340(raw10) oder 85(raw8) |
| DCC_CALIB_PD_RANGE | Suchradius für Pixeldisparität |
| DCC_VERIFY_CAF_DIFF_MAX | Schwellenwert (%) für den DAC-Bereich |
| DCC_VERIFY_CAF_DIFF_DET | delta(DAC) für den DAC-Bereich |
| CALIB_TARGET_PEAK_OFFSET_LOG | FV-Spitzenwertinformationen in<br>PDAFFVLog.txt speichern.1:ON,0:OFF |
| CALIB_TARGET_PEAK_OFFSET | PD-Zieloffset im FV-Spitzenwertkriterium, Standard:0 |
| DCC_PERCENT_ROI_W | ROI-Breite des Testbildes |
| DCC_PERCENT_ROI_H | ROI-Höhe des Testbildes |
| DCC_SHARPNESS_MODE | Modus der Schärfeberechnung, Standard 1 |
| DCC_SHARPNESS_CHL | Kanal der Schärfeberechnung,0:ursprüngliches<br>RAW;1:Rot,2:Grün(Standard),3:Blau,4:Demosaic |

<!-- Source EN PDF p.30, block 173 -->

[optional params]

<!-- Source EN PDF p.30, block 174 -->

| Schlüsselwörter | Beschreibung |
|---|---|
| QUALITY_VERIFY_ENABLE | Qualitätsprüfung bei der Gain-Map-Kalibrierung aktivieren |
| QUALTI_LRDiff_L_MIN | L/R-Differenzkriterien (Block1,2,3) |
| QUALTI_LRDiff_L_MAX | L/R-Differenzkriterien (Block1,2,3) |
| QUALTI_LRDiff_C_MIN | L/R-Differenzkriterien (Block4,5,6) |
| QUALTI_LRDiff_C_MAX | L/R-Differenzkriterien (Block4,5,6) |
| QUALTI_LRDiff_R_MIN | L/R-Differenzkriterien (Block7,8,9) |
| QUALTI_LRDiff_R_MAX | L/R-Differenzkriterien (Block7,8,9) |
| QUALITY_SENSITIVITY_MIN | Empfindlichkeitskriterium |

<!-- Source EN PDF p.30, block 175 -->

【Beispiel】

<!-- Source EN PDF p.30, block 176 -->

Als Beispiel dient die in der folgenden Abbildung gezeigte PD-Pixelverteilung des IMX258:

<!-- Source EN PDF p.30, block 177 -->

![Technische Abbildung aus der englischen Quelle, S. 30](/docs/rockchip-camera-otp-calibration/assets/en-p30-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF S. 30.*

<!-- Source EN PDF p.30, block 178 -->

Entsprechend den Informationen in der Abbildung lautet der Inhalt von sensor.ini:

<!-- Source EN PDF p.30, block 179 -->

```text
[sensor config]
RAW_WIDTH =4208
RAW_HEIGHT =3120
RAW_BITS =12
RAW_BLACK_LEVEL =64
RAW_BAYER_PATTERN =0
SENSOR_TYPE=0
PD_DUAL_MODE=0
PD_BINNING_TYPE=0
PD_OFFSET_X =24
PD_OFFSET_Y =24
PD_PITCH_X =32
PD_PITCH_Y =32
PD_DENSITY_X =16
PD_DENSITY_Y =16
PD_BLOCK_NUM_X =130
PD_BLOCK_NUM_Y =96
CALB_S_LEVEL=1000
CALB_S_CNT=10
PD_POS_L=
[26 29]
[42 29]
[33 48]
[49 48]; #end with a ";"
PD_POS_R=
[25 32]
[41 32]
[34 45]
[50 45]; #end with a ";"
[Gainmap_Calib]
GAINMAP_BLKSZ_W=16
GAINMAP_BLKSZ_H=16
GAIN_CALIB_INPUT_MAX=920
GAIN_CALIB_INPUT_MIN=800
GAIN_VERIFY_DIFF_MAX=5
CROSS_VER=1
[DCCmap_Calib]
DCCMAP_BLKSZ_W=32
DCCMAP_BLKSZ_H=32
DCC_CALIBRATE_MODE=1
DCC_LENS_BEGIN=0
DCC_LENS_END=64
DCC_LENS_INTERVAL=8
DCC_RSQ_THRESHOLD=0.985
DCC_BORDER_RSQ_THRESHOLD=0.97
DCC_BAD_RSQ_NUM_RATIO=0.05
DCC_CALIB_INPUT_MAX=640
DCC_CALIB_INPUT_MIN=340
DCC_VERIFY_CAF_DIFF_MAX=10
DCC_VERIFY_CAF_DIFF_DET=2
CALIB_TARGET_PEAK_OFFSET_LOG=0
CALIB_TARGET_PEAK_OFFSET=0
DCC_PERCENT_ROI_W=0.4
DCC_PERCENT_ROI_H=0.4
DCC_SHARPNESS_MODE=1
DCC_SHARPNESS_CHL=1
[optional params]
QUALITY_VERIFY_ENABLE=1
QUALTI_LRDiff_L_MIN=0.4
QUALTI_LRDiff_L_MAX=2.5
QUALTI_LRDiff_C_MIN=0.55
QUALTI_LRDiff_C_MAX=1.8
QUALTI_LRDiff_R_MIN=0.4
QUALTI_LRDiff_R_MAX=2.5
QUALITY_SENSITIVITY_MIN=0.45
```

<!-- Source EN PDF p.32, block 183 -->

【Funktionsprototypen】

<!-- Source EN PDF p.32, block 184 -->

```text
bool pdaf_initial(char* filename, sensor_cfg* psensor_cfg)
```

<!-- Source EN PDF p.32, block 185 -->

【Eingabeinformationen】

<!-- Source EN PDF p.32, block 186 -->

| Parametername | Beschreibung |
|---|---|
| filename | Vollständiger Pfad der Datei sensor.ini |

<!-- Source EN PDF p.32, block 187 -->

【Ausgabeinformationen】

<!-- Source EN PDF p.32, block 188 -->

| Parametername | Beschreibung |
|---|---|
| psensor_cfg | Zeiger auf eine Struktur mit dem Inhalt von sensor.ini |

<!-- Source EN PDF p.32, block 189 -->

【Rückgabewert】

<!-- Source EN PDF p.32, block 190 -->

=0: sensor.ini konnte nicht gelesen werden.

<!-- Source EN PDF p.32, block 191 -->

=1: sensor.ini erfolgreich gelesen.

<!-- Source EN PDF p.32, block 192 -->

#### 3.3.2 Gain-Map-Kalibrierung

<!-- Source EN PDF p.32, block 193 -->

【Funktionsbeschreibung】

<!-- Source EN PDF p.32, block 194 -->

Diese Funktion dient der Kalibrierung von PDAF-Gain-Maps.

<!-- Source EN PDF p.32, block 195 -->

【Funktionsprototypen】

<!-- Source EN PDF p.32, block 196 -->

```text
bool pdaf_gainmap_calibration(uint16_t *RawAddr, sensor_cfg* psensor_cfg,
                              uint16_t *gainmap_lut,int* gainmap_width,
                              int* gainmap_height)
```

<!-- Source EN PDF p.32, block 197 -->

【Eingabeinformationen】

<!-- Source EN PDF p.32, block 198 -->

| Parametername | Beschreibung |
|---|---|
| RawAddr | Vom aktuellen Modul in der Fertigung aufgenommene RAW-Bilddaten |
| psensor_cfg | Zeiger auf eine Struktur mit dem Inhalt von sensor.ini |

<!-- Source EN PDF p.32, block 199 -->

【Ausgabeinformationen】

<!-- Source EN PDF p.33, block 200 -->

| Parametername | Beschreibung |
|---|---|
| gainmap_lut | Kalibrierte Gain Map |
| gainmap_width | Breite der kalibrierten Gain Map |
| gainmap_height | Höhe der durch Kalibrierung ermittelten Gain Map |

<!-- Source EN PDF p.33, block 201 -->

【Rückgabewert】

<!-- Source EN PDF p.33, block 202 -->

=0: Der Parameter ist fehlerhaft.

<!-- Source EN PDF p.33, block 203 -->

=1: Kalibrierung erfolgreich.

<!-- Source EN PDF p.33, block 204 -->

#### 3.3.3 Gain-Map-Verifikation

<!-- Source EN PDF p.33, block 205 -->

【Funktionsbeschreibung】

<!-- Source EN PDF p.33, block 206 -->

Diese Funktion prüft, ob die kalibrierte Gain Map die Anforderungen erfüllt.

<!-- Source EN PDF p.33, block 207 -->

【Funktionsprototypen】

<!-- Source EN PDF p.33, block 208 -->

```text
bool pdaf_gainmap_vertification(uint16_t *RawAddr, sensor_cfg* psensor_cfg,
                                uint16_t *gainmap_lut)
```

<!-- Source EN PDF p.33, block 209 -->

【Eingabeinformationen】

<!-- Source EN PDF p.33, block 210 -->

| Parametername | Beschreibung |
|---|---|
| RawAddr | Vom aktuellen Modul in der Fertigung aufgenommene RAW-Bilddaten |
| psensor_cfg | Zeiger auf eine Struktur mit dem Inhalt von sensor.ini |
| gainmap_lut | Mit pdaf_gainmap_calibration ermittelte Gain Map |

<!-- Source EN PDF p.33, block 211 -->

【Rückgabewert】

<!-- Source EN PDF p.33, block 212 -->

=0: Die Verifikation ist fehlgeschlagen; die dafür verwendete Gain Map erfüllt die Anforderungen nicht.

<!-- Source EN PDF p.33, block 213 -->

=1: Verifikation erfolgreich.

<!-- Source EN PDF p.33, block 214 -->

#### 3.3.4 DCC-Map-Kalibrierung

<!-- Source EN PDF p.33, block 215 -->

【Funktionsbeschreibung】

<!-- Source EN PDF p.33, block 216 -->

Diese Funktion dient der Kalibrierung der PDAF-DCC-Map.

<!-- Source EN PDF p.33, block 217 -->

【Funktionsprototypen】

<!-- Source EN PDF p.33, block 218 -->

```text
bool pdaf_dccmap_calibration(uint16_t *RawAddrAll , sensor_cfg* psensor_cfg,
                             uint16_t *gainmap_lut, uint16_t *dccmap_lut,
                             int* dccmap_width,int* dccmap_height,
                             uint8_t* dccSign,wchar_t*pd_offset)
```

<!-- Source EN PDF p.34, block 219 -->

【Eingabeinformationen】

<!-- Source EN PDF p.34, block 220 -->

| Parametername | Beschreibung |
|---|---|
| RawAddrAll | Sequenz der gemittelten Bilddaten für jede Motorposition |
| psensor_cfg | Zeiger auf eine Struktur mit dem Inhalt von sensor.ini |
| gainmap_lut | Mit pdaf_gainmap_calibration ermittelte Gain Map |

<!-- Source EN PDF p.34, block 221 -->

【Ausgabeinformationen】

<!-- Source EN PDF p.34, block 222 -->

| Parametername | Beschreibung |
|---|---|
| dccmap_lut | Resultierende DCC Map |
| dccmap_width | Breite der kalibrierten DCC Map |
| dccmap_height | Höhe der kalibrierten DCC Map |
| dccSign | Richtung der durch Kalibrierung ermittelten DCC Map |
| pd_offset | Durch Kalibrierung ermittelter pd_offset |

<!-- Source EN PDF p.34, block 223 -->

【Rückgabewert】

<!-- Source EN PDF p.34, block 224 -->

=0: Kalibrierung fehlgeschlagen.

<!-- Source EN PDF p.34, block 225 -->

=1: Kalibrierung erfolgreich.

<!-- Source EN PDF p.34, block 226 -->

#### 3.3.5 DCC-Map-Verifikation

<!-- Source EN PDF p.34, block 227 -->

Prüft, ob die kalibrierte DCC Map die Anforderungen erfüllt. Dazu dienen die beiden Funktionsschnittstellen pdaf_dccmap_vertification() und pdaf_calc_sharpness().

<!-- Source EN PDF p.34, block 228 -->

【Funktionsbeschreibung】

<!-- Source EN PDF p.34, block 229 -->

Ermittelt anhand der kalibrierten DCC Map die ideale scharfe Fokusposition DAC1 des unscharfen Bildes.

<!-- Source EN PDF p.34, block 230 -->

【Funktionsprototyp】

<!-- Source EN PDF p.34, block 231 -->

```text
uint16_t pdaf_dccmap_vertification(uint16_t *RawAddr, sensor_cfg* psensor_cfg,
                                   int cur_pos_id, uint16_t *gainmap_lut,
                                   uint16_t *dccmap_lut, uint8_t dccSign, wchar_t
*pd_offset)
```

<!-- Source EN PDF p.34, block 232 -->

【Eingabeinformationen】

<!-- Source EN PDF p.35, block 233 -->

| Parametername | Beschreibung |
|---|---|
| RawAddr | Gemittelte Bilddaten der aufgenommenen unscharfen Bilder |
| psensor_cfg | Strukturzeiger auf den Inhalt von sensor.ini |
| cur_pos_id | Aktuelle Motorposition bei Aufnahme des unscharfen Bildes |
| gainmap_lut | Mit pdaf_gainmap_calibration kalibrierte Gain Map |
| dccmap_lut | Mit pdaf_dccmap_calibration kalibrierte DCC Map |
| dccSign | Mit pdaf_dccmap_calibration kalibrierter dccSign |
| pd_offset | Mit pdaf_dccmap_calibration ermittelter pd_offset |

<!-- Source EN PDF p.35, block 234 -->

【Rückgabewert】

<!-- Source EN PDF p.35, block 235 -->

Motorposition DAC1, bei der das unscharfe Bild ideal fokussiert ist.

<!-- Source EN PDF p.35, block 236 -->

【Funktionsbeschreibung】

<!-- Source EN PDF p.35, block 237 -->

Berechnet die Schärfe des mittleren Bildbereichs innerhalb von DCC_VERIFY_CAF_DIFF_MAX\*abs (DACinf- DACmacro)+DCC_VERIFY_CAF_DIFF_DET vor und hinter DAC1, um festzustellen, ob ein Maximum vorliegt.

<!-- Source EN PDF p.35, block 238 -->

【Funktionsprototyp】

<!-- Source EN PDF p.35, block 239 -->

```text
bool pdaf_calc_sharpness(uint16_t *RawAddrAll, int img_num, sensor_cfg*
psensor_cfg)
```

<!-- Source EN PDF p.35, block 240 -->

【Eingabeinformationen】

<!-- Source EN PDF p.35, block 241 -->

| Parametername | Beschreibung |
|---|---|
| RawAddrAll | Sequenz gemittelter Bilddaten innerhalb von valid_toerance*abs (DACinf-DACmacro)+2<br>vor und hinter DAC1 |
| img_num | Anzahl der in RawAddrAll enthaltenen Bilder |
| psensor_cfg | Strukturzeiger auf den Inhalt von sensor.ini |

<!-- Source EN PDF p.35, block 242 -->

【Rückgabewert】

<!-- Source EN PDF p.35, block 243 -->

=0: Kein Schärfemaximum gefunden; Verifikation fehlgeschlagen.

<!-- Source EN PDF p.35, block 244 -->

=1: Verifikation erfolgreich.

<!-- Source EN PDF p.36, block 245 -->

## 4 Anhang

<!-- Source EN PDF p.36, block 246 -->

### 4.1 Beispielcode zur OTP-Anwendung

<!-- Source EN PDF p.36, block 247 -->

```text
#include <iostream>
#include "RKOTPDLL.h"
#include <stdlib.h>
int main()
{
    int ret = 0;
    #LSC AWB Otp Calibration
    ret =lsc_awbtest();
    #Pdaf Otp Calibration
    uint16_t gainmap[30*30 * 2];
    uint16_t dccmap[20 * 20 * 2];
    uint16_t code = 0;
    int gainmap_width = 0;
    int gainmap_height = 0;
    int dccmap_width = 0;
    int dccmap_height = 0;
    uint8_t dcc_Sign = 0;
    wchar_t pd_offset=0xffff;
    int curpos = 864;
    sensor_cfg sensor_param;
    if (pdaf_initial("D:\\testdll\\testdll\\sensor_ov16A10.ini", &sensor_param))
    {
        if (gainmaptest(&sensor_param, gainmap,&gainmap_width,&gainmap_height))
        {
        if (dccmaptest(&sensor_param, gainmap, dccmap, curpos, &code,
&dccmap_width, &dccmap_height, &dcc_Sign,&pd_offset))
            {
                ret = dcc_calc_sharpness(&sensor_param);
            }
        }
    }
}
bool lsc_awbtest()
{
    int vig=70;
    int height = 1944;
    int width = 2592;
    int bits =10;#10bit
    int bayer =0;#BGGR
    int roiw =5;#1/5 width
    int roih =5;#1/5 height
    int blc[4]={ 64, 64, 64, 64};
    uint16_t lsctable[17*17*4];
    uint16_t awb[3];
    uint16_t Rave =0;
    uint16_t Grave =0;
    uint16_t Gbave =0;
    uint16_t Bave =0;
    int Ydiffer_down =0;#%
    int Ydiffer_up =5;#%
    int ColorShading_down =0;#%
    int ColorShading_up =5;#%
    float Ydiffer = 0;
    float RGconer[25];
    float BGconer[25];
    bool ret =0;
    uint16_t *Rawdata = NULL;
    Rawdata = (uint16_t*)malloc(width * height * 2);
    memset(Rawdata, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    fp = fopen("input.raw", "rb");
    if (fp == NULL)
    {
        return false;
    }
    fread(Rawdata, 1, height * width * 2, fp);
    fclose(fp);
    ret =lsc_otp_Calibrate(vig,Rawdata, width, height, bits, bayer, blc[0],
blc[1],blc[2], blc[3],lsctable);
    ret = awb_otp_Calibrate(Rawdata, width, height,roiw,roih, bits, bayer,
blc[0], blc[1],blc[2], blc[3],&Rave,&Grave,&Gbave,&Bave, &awb[0], &awb[1],
&awb[2]);
    ret = lsc_otp_verify(Rawdata, width, height, bits, bayer, blc[0], blc[1],
blc[2], blc[3], lsctable, Ydiffer_down, Ydiffer_up, ColorShading_down,
ColorShading_up, &Ydiffer, RGconer, BGconer);
    if(!ret)
    {
        return false; #The calibrated data does not meet the control standards and the verification fails.
    }
    if(Rawdata!=NULL)
    {
        free (Rawdata);
        Rawdata =NULL;
    }
    return ret;
}
int gainmaptest(sensor_cfg* psensor_cfg, uint16_t *gainmap_lut,int *
gainmap_width, int *gainmap_height)
{
    int ret = 0;
    int height = psensor_cfg->height;
    int width = psensor_cfg->width;
    uint16_t maxval = (1 << psensor_cfg->bits) - 1;
    int gainmapfilenum = 3;
    int over_exp_cnt = 0;
    if (psensor_cfg->pd_dual_mode && psensor_cfg->mipi_mix_mode)
    {
        height = psensor_cfg->height + (psensor_cfg->sensor_type+1)*psensor_cfg->pd_height;
    }
    uint16_t *ave_pixelbuf = NULL;
    ave_pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    uint16_t *sum_pixelbuf = NULL;
    sum_pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(sum_pixelbuf, 0, sizeof(uint16_t)* width * height);
    uint16_t *pixelbuf = NULL;
    pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    char prename[20] = "gainRAW";
    char endname[5] = ".raw";
    for (int i = 0; i < gainmapfilenum; i++)
    {
        char temp[20];
        char id[5];
        int idint = i + 1;
        strcpy(temp, prename);
        _itoa_s(idint, id, 10);
        strcat(temp, id);
        strcat(temp, endname);
        fp = fopen(temp, "rb");
        if (fp == NULL)
        {
            return false;
        }
        fread(pixelbuf, 1, height * width * 2, fp);
        fclose(fp);
        for (int j = 0; j < height; j++)
        {
            for (int i = 0; i < width; i++)
            {
                uint32_t tempbuf = *(pixelbuf + j*width + i);
                *(sum_pixelbuf + j*width + i) = tempbuf + *(sum_pixelbuf +
j*width + i);
                if (tempbuf >= maxval)
                    over_exp_cnt++;
            }
        }
    }
    for (int j = 0; j < height; j++)
    {
        for (int i = 0; i < width; i++)
        {
            *(ave_pixelbuf + j*width + i) = *(sum_pixelbuf + j*width + i) /
gainmapfilenum;
        }
    }
    ret = pdaf_gainmap_calibration(ave_pixelbuf, psensor_cfg, gainmap_lut,
gainmap_width,gainmap_height);
    ret = pdaf_gainmap_vertification(ave_pixelbuf, psensor_cfg, gainmap_lut);
    if(ret == -1)
        printf("gainmap image OVER exposure!!!");
    if (ave_pixelbuf!=NULL)
    {
        free(ave_pixelbuf);
        ave_pixelbuf = NULL;
    }
    if (pixelbuf != NULL)
    {
        free(pixelbuf);
        pixelbuf = NULL;
    }
    if (sum_pixelbuf != NULL)
    {
        free(sum_pixelbuf);
        sum_pixelbuf = NULL;
    }
    return ret;
}
bool dccmaptest(sensor_cfg* psensor_cfg, uint16_t *gainmap_lut, uint16_t
*dccmap_lut, int curpos , uint16_t *code, int *dccmap_width, int *dccmap_height,
uint8_t *dcc_Sign,wchar_t *pdaf_offset)
{
    int ret = 0;
    int lens_begin = 0;
    int lens_end = 64;
    int lens_interval = 8;
    int height = psensor_cfg->height;
    int width = psensor_cfg->width;
    int lensnum = (lens_end - lens_begin) / lens_interval + 1;
    if (psensor_cfg->pd_dual_mode && psensor_cfg->mipi_mix_mode)
    {
        height = psensor_cfg->height + (psensor_cfg->sensor_type +
1)*psensor_cfg->pd_height;
    }
    uint16_t *ave_pixelbuf = NULL;
    ave_pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    uint16_t *Rawdata = NULL;
    Rawdata = (uint16_t*)malloc(width * height * 2 * lensnum);
    memset(Rawdata, 0, sizeof(uint16_t)* width * height* lensnum);
    uint16_t *pixelbuf= NULL;
    pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    char prename[20] = "dccRAW";
    char endname[5] = ".raw";
    for (int a = 0;a <lensnum;a++)
    {
        char temp[20];
        char id[5] ;
        int id1 = a + 1;
        strcpy(temp,prename);
        _itoa_s(id1, id, 10);
        strcat(temp, id);
        for (int b = 0; b < 3;b++)
        {
            char name[20];
            strcpy(name, temp);
            int id2 = b + 1;
            _itoa_s(id2, id, 10);
            strcat(name, id);
            strcat(name, endname);
            fp = fopen(name, "rb");
            if (fp == NULL)
            {
                return false;
            }
            fread(pixelbuf, 1, height * width * 2, fp);
            fclose(fp);
            for (int j = 0; j < height; j++)
            {
                for (int i = 0; i < width; i++)
                {
                    uint16_t tempbuf = *(ave_pixelbuf + j*width + i);
                    *(ave_pixelbuf + j*width + i) = tempbuf + *(pixelbuf +
j*width + i) / 3;
                }
            }
        }
        memcpy(Rawdata + a*height * width, ave_pixelbuf, sizeof(uint16_t)*height
* width);
        memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    }
    ret = pdaf_dccmap_calibration(Rawdata, psensor_cfg, gainmap_lut, dccmap_lut,
dccmap_width, dccmap_height, dcc_Sign,pd_offset);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    char prename1[20] = "image";
    for (int i = 0; i < 3; i++)
    {
        char temp[20];
        char id[5];
        int idint = i + 1;
        strcpy(temp, prename1);
        _itoa_s(idint, id, 10);
        strcat(temp, id);
        strcat(temp, endname);
        fp = fopen(temp, "rb");
        if (fp == NULL)
        {
            return false;
        }
        fread(pixelbuf, 1, height * width * 2, fp);
        fclose(fp);
        for (int j = 0; j < height; j++)
        {
            for (int i = 0; i < width; i++)
            {
                uint16_t tempbuf = *(ave_pixelbuf + j*width + i);
                *(ave_pixelbuf + j*width + i) = tempbuf + *(pixelbuf + j*width +
i) / 3;
            }
        }
    }
        *code = pdaf_dccmap_vertification(ave_pixelbuf, psensor_cfg, curpos,
gainmap_lut, dccmap_lut, *dcc_Sign,pd_offset);
    if (ave_pixelbuf != NULL)
    {
        free(ave_pixelbuf);
        ave_pixelbuf = NULL;
    }
    if (pixelbuf != NULL)
    {
        free(pixelbuf);
        pixelbuf = NULL;
    }
    if (Rawdata != NULL)
    {
        free(Rawdata);
        Rawdata = NULL;
    }
    return ret;
}
bool dcc_calc_sharpness(sensor_cfg* psensor_cfg)
{
    int height = psensor_cfg->height;
    int width = psensor_cfg->width;
    int imgnum = 5;
    if (psensor_cfg->pd_dual_mode && psensor_cfg->mipi_mix_mode)
    {
        height = psensor_cfg->height + (psensor_cfg->sensor_type +
1)*psensor_cfg->pd_height;
    }
    uint16_t *Rawdata = NULL;
    Rawdata = (uint16_t*)malloc(width * height * 2 * imgnum);
    memset(Rawdata, 0, sizeof(uint16_t)* width * height* imgnum);
    uint16_t *pixelbuf = NULL;
    pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    char prename[20] = "calimage";
    char endname[5] = ".raw";
    for (int i = 0; i < imgnum; i++)
    {
        char temp[20];
        char id[5];
        int idint = i + 1;
        strcpy(temp, prename);
        _itoa_s(idint, id, 10);
        strcat(temp, id);
        strcat(temp, endname);
        fp = fopen(temp, "rb");
        if (fp == NULL)
        {
            return false;
        }
        fread(pixelbuf, 1, height * width * 2, fp);
        fclose(fp);
        memcpy(Rawdata + i*height * width, pixelbuf, sizeof(uint16_t)*height *
width);
    }
    bool ret=pdaf_calc_sharpness(Rawdata, imgnum, psensor_cfg);
    if (pixelbuf != NULL)
    {
        free(pixelbuf);
        pixelbuf = NULL;
    }
    if (Rawdata != NULL)
    {
        free(Rawdata);
        Rawdata = NULL;
    }
    return ret;
}
```

<!-- Source EN PDF p.43, block 259 -->

### 4.2 Format der paketierten Programmierdaten

<!-- Source EN PDF p.43, block 260 -->

Wie in der folgenden Tabelle dargestellt, können Benutzer je nach Bedarf bestimmte Blöcke programmieren. Die Block-ID darf dabei nicht geändert werden. Nach dem Programmieren der benötigten Blöcke muss abschließend 0xff programmiert werden:

<!-- Source EN PDF p.43, block 261 -->

| Länge (Byte) | Datenelement | Anmerkung |
|---|---|---|
| 8 | Mark | ROCKCHIP |
| 1 | ID | ID=0，Sensorinformationen |
| 4 | Size | Größe der Blockdaten |
|  | Blockdaten |  |
| 1 | ID | ID=1，AWB-Kalibrierung |
| 4 | Size | Größe der Blockdaten |
|  | Blockdaten |  |
| 1 | ID | ID=2，LSC-Kalibrierung |
| 4 | Size | Größe der Blockdaten |
|  | Blockdaten |  |
| 1 | ID | ID=3，PDAF-Kalibrierung |
| 4 | Size | Größe der Blockdaten |
|  | Blockdaten |  |
| 1 | ID | ID=4，AF Code |
| 4 | Size | Größe der Blockdaten |
|  | Blockdaten |  |
| 1 | ID | ID=5，QSC |
| 4 | Size | Größe der Blockdaten |
|  | Blockdaten |  |
| ... | ... | ... |
| 1 | 0xFF | Endekennung |

<!-- Source EN PDF p.43, block 262 -->

Die konkreten Blockinhalte folgen. Mehrbyte-Daten verwenden einheitlich Big-Endian: Das höherwertige Byte wird an der niedrigeren Adresse gespeichert, das niederwertige an der höheren:

<!-- Source EN PDF p.44, block 263 -->

| Offsetadresse | Länge (Byte) | Datenelement | Anmerkung |
|---|---|---|---|
| 0x0000 | 8 | Mark | ROCKCHIP |
| 0x0008 | 1 | ID | ID=0，Sensorinformationen |
| 0x0009 | 4 | Size | Size=35 |
| 0x000D | 2 | Version | Version der Sensorinformationen： v1.0.8=0x0108 |
| 0x000F | 1 | Supplier ID | Benutzerdefiniert |
| 0x0010 | 1 | Datum: Jahr | Beispielsweise für 2021 den Wert 21 schreiben |
| 0x0011 | 1 | Datum: Monat | Beispielsweise für Juli den Wert 7 schreiben |
| 0x0012 | 1 | Datum: Tag | Beispielsweise für den 12. den Wert 12 schreiben |
| 0x0013 | 1 | Sensor ID | Benutzerdefiniert |
| 0x0014 | 1 | Lens ID | Benutzerdefiniert |
| 0x0015 | 1 | VCM ID | Benutzerdefiniert |
| 0x0016 | 1 | Driver ID | Benutzerdefiniert |
| 0x0017 | 4 | Module ID | Benutzerdefiniert |
| 0x001B | 1 | mirror/flip | Bit[7:4]:Mirror<br>Bit[3:0]:Flip<br>ON: 1, OFF: 0 |
| 0x001C | 1 | Full Width H | Höherwertiges Byte der vollen Breite |
| 0x001D | 1 | Full Width L | Niederwertiges Byte der vollen Breite |
| 0x001E | 1 | Full Height H | Höherwertiges Byte der vollen Höhe |
| 0x001F | 1 | Full Height L | Niederwertiges Byte der vollen Höhe |
| 0x0020 | 15 | Reserved | Reserved=0xff |
| 0x002F | 1 | Checksum | Prüfsumme der Sensorinformationen<br>Sum(0x0009~0x002E) % 255+1 |

<!-- Source EN PDF p.45, block 264 -->

| Offsetadresse | Länge (Byte) | Datenelement | Anmerkung |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=1，AWB-Kalibrierung |
| 0x0001 | 4 | Size | Size=43 |
| 0x0005 | 2 | Version | AWB Version： v1.0.9=0x0109 |
| 0x0007 | 1 | R/G_H | Höherwertiges Byte des aktuellen R/G-Werts |
| 0x0008 | 1 | R/G_L | Niederwertiges Byte des aktuellen R/G-Werts |
| 0x0009 | 1 | B/G_H | Höherwertiges Byte des aktuellen B/G-Werts |
| 0x000A | 1 | B/G_L | Niederwertiges Byte des aktuellen B/G-Werts |
| 0x000B | 1 | Gr/Gb_H | Höherwertiges Byte des aktuellen Gr/Gb-Werts |
| 0x000C | 1 | Gr/Gb_L | Niederwertiges Byte des aktuellen Gr/Gb-Werts |
| 0x000D | 1 | R/G_H | Höherwertiges Byte des Golden-Referenzwerts R/G |
| 0x000E | 1 | R/G_L | Niederwertiges Byte des Golden-Referenzwerts R/G |
| 0x000F | 1 | B/G_H | Höherwertiges Byte des Golden-Referenzwerts B/G |
| 0x0010 | 1 | B/G_L | Niederwertiges Byte des Golden-Referenzwerts B/G |
| 0x0011 | 1 | Gr/Gb_H | Höherwertiges Byte des Golden-Referenzwerts Gr/Gb |
| 0x0012 | 1 | Gr/Gb_L | Niederwertiges Byte des Golden-Referenzwerts Gr/Gb |
| 0x0013 | 28 | Reserved | Reserved=0xff |
| 0x002F | 1 | Checksum | Prüfsumme der AWB-Kalibrierung<br>Sum(0x0001~0x002E) % 255+1 |

<!-- Source EN PDF p.45, block 265 -->

| Offsetadresse | Länge (Byte) | Datenelement | Anmerkung |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=2，LSC-Kalibrierung |
| 0x0001 | 4 | Size | Size=2347 |
| 0x0005 | 2 | Version | LSC Version： v1.0.b=0x010b |
| 0x0007 | 2312 | LSC-<br>Kalibrierungs-<br>daten | 17x17x4-Matrix mit Festkommaskalierung 1024, ungepackt,<br>Big-Endian; gespeicherte Kanalreihenfolge R, Gr, Gb, B |
| 0x090F | 32 | Reserved | Reserved=0xff |
| 0x092F | 1 | Checksum | Prüfsumme der LSC-Kalibrierung<br>Sum(0x0001~0x092E) % 255+1 |

<!-- Source EN PDF p.46, block 266 -->

| Offsetadresse | Länge (Byte) | Datenelement | Anmerkung |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=3，PDAF-Kalibrierung |
| 0x0001 | 4 | Size | Size=2603 |
| 0x0005 | 2 | Version | PDAF Version： v1.1.12=0x011c |
| 0x0007 | 1 | Gainmap_width | Gain-Map-Größe, ermittelt mit pdaf_gainmap_calibration() |
| 0x0008 | 1 | Gainmap_height | Gain-Map-Größe, ermittelt mit pdaf_gainmap_calibration() |
| 0x0009 | 2048 | Gainmap | Tatsächliche Größe=Gainmap_width* Gainmap_height*2,<br>Big-Endian, Standardwert: 0xff |
| 0x0809 | 1 | Checksum | Gain-Map-Prüfsumme<br>Sum(0x0007~0x00808) % 255+1 |
| 0x080A | 1 | mode value | DCC-Map-Anpassungsmodus (Standard dieser Version: 1), entsprechend<br>DCC_CALIBRATE_MODE in der PD-INI-Konfiguration |
| 0x080B | 1 | direction | dccSign, ermittelt mit pdaf_dccmap_calibration()<br>0: negativ<br>1: positiv |
| 0x080C | 1 | DCCmap_width | DCC-Map-Größe, ermittelt mit pdaf_dccmap_calibration() |
| 0x080D | 1 | DCCmap_height | DCC-Map-Größe, ermittelt mit pdaf_dccmap_calibration() |
| 0x080E | 512 | Dccmap | Tatsächliche Größe=DCCmap_width* DCCmap_height*2,<br>Big-Endian, Standardwert: 0xff |
| 0x0A0E | 1 | Checksum | DCC-Map-Prüfsumme<br>Sum(0x080A~0x0A0D) % 255+1 |
| 0x0A0F | 2 | pd_offset | flag(1)sign(1)reserve(2)integer(4)8fix_decimals(8)<br>,flag=0:Kalibrierung sign=1:positiv |
| 0x0A11 | 30 | Reserved | Reserved=0xff |
| 0x0A2F | 1 | Checksum | Prüfsumme der PDAF-Kalibrierung<br>Sum(0x0001~0x0A2E) % 255+1 |

<!-- Source EN PDF p.47, block 267 -->

| Offsetadresse | Länge (Byte) | Datenelement | Anmerkung |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=4，AF Code |
| 0x0001 | 4 | Size | Size=27 |
| 0x0005 | 2 | Version | AF Version： v1.0.9=0x0109 |
| 0x0007 | 1 | AF Infinite H | Höherwertiger Anteil des AF-Fernfokus-Codewerts |
| 0x0008 | 1 | AF Infinite L | Niederwertiger Anteil des AF-Fernfokus-Codewerts |
| 0x0009 | 1 | AF Macro H | Höherwertiger Anteil des AF-Nahfokus-Codewerts |
| 0x000A | 1 | AF Macro L | Niederwertiger Anteil des AF-Nahfokus-Codewerts |
| 0x000B | 1 | AF_Medium H | Höherwertiger Anteil des mittleren AF-Fokus-Codewerts |
| 0x000C | 1 | AF_Medium L | Niederwertiger Anteil des mittleren AF-Fokus-Codewerts |
| 0x000D | 18 | Reserved | Reserved=0xff |
| 0x001F | 1 | Checksum | AF-Code-Prüfsumme<br>Sum(0x0001~0x001E) % 255+1 |

<!-- Source EN PDF p.47, block 268 -->

| Offsetadresse | Länge (Byte) | Datenelemente | Anmerkung |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=5，QSC |
| 0x0001 | 4 | Size | Size=4107 |
| 0x0005 | 2 | Version | QSC Version： v1.0.0=0x0100 |
| 0x0007 | 2 | QSC Size | QSC-Größe, Big-Endian |
| 0x0009 | 4096 | Data | Die tatsächliche Schreibgröße der QSC-Daten richtet sich nach der<br>QSC-Größe; der Standardwert ist 0xff |
| 0x1009 | 6 | Reserved | Reserved=0xff |
| 0x100F | 1 | Checksum | QSC-Prüfsumme<br>Sum(0x0001~0x100E) % 255+1 |

{% endraw %}

