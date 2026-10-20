---
title: "Rockchip ISP30 Tuning: vollständige RK3588-Referenz zur Bildqualität"
description: "Vollständige V1.2.0-Plattformreferenz zu Kalibrierung, AEC, NR, SHARP, MERGE, DRC, Dehaze, DPCC, Gamma, Debayer und GIC."
translation_key: "080-rockchip-isp30-tuning"
slug: "080-rockchip-isp30-tuning"
lang: "de"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "RK3588", "ISP30", "Camera", "IQ", "HDR"]
keywords: "ArmSoM Rockchip RK3588 ISP30 ISP3.0 AEC HDR tuning"
excerpt: "Vollständige V1.2.0-Plattformreferenz zu Kalibrierung, AEC, NR, SHARP, MERGE, DRC, Dehaze, DPCC, Gamma, Debayer und GIC."
---

{% raw %}

# Rockchip ISP30 Tuning: vollständige RK3588-Referenz zur Bildqualität

## Anwendbarkeit auf ArmSoM und Quellenumfang

Dies ist eine Rockchip-Plattformreferenz, kein ArmSoM-Hardwaretestbericht. Die einzige bereitgestellte Quelle ist Rockchip_Tuning_Guide_ISP30_EN_v1.2.0.pdf, V1.2.0, Dokument RK-SM-YF-611 mit 160 Seiten. Ihre Produkttabelle nennt RK3588 / ISP3.0. Es liegt keine chinesische Quelle vor: Chinesisch und Russisch übersetzen diese englische Quelle vollständig. Auch diese deutsche Fassung übersetzt den vollständigen englischen Artikel und übernimmt dessen Bildadressen. Alle Fassungen bewahren die Originalabbildungen, die teilweise bereits chinesische Beschriftungen enthalten. Die Quelle nennt keine Kernelversion. Vor einer Anpassung sind die konkrete ArmSoM-Platine, RK3588-SDK/BSP, Sensor- und Objektivtreiber, AIQ-/IQ-Werkzeugversionen und Kalibrierung zu prüfen. Platinenspezifische Kompatibilität und Bildqualität wurden nicht an Hardware validiert. Sämtliche Beispielwerte und Vergleiche stammen aus der Quelle und sind keine ArmSoM-Messungen.

> Quellenwidersprüche und unvollständige Formeln bleiben erhalten und sind in den redaktionellen Hinweisen dokumentiert. Sie werden nicht stillschweigend in validierte Anleitungen umgewandelt. Die ursprünglichen Kapitel- und Abbildungsnummern bleiben auch bei Dopplungen oder Unstimmigkeiten erhalten.

[Redaktionelle Hinweise](/docs/rockchip-isp30-tuning/EDITORIAL-NOTES.md) · [ArmSoM](https://docs.armsom.org/)

### Ursprünglicher Produktumfang (PDF-Seite 2)

| Chip | ISP-Version |
| --- | --- |
| RK3588 | ISP3.0 |

<!-- source: EN PDF p9; unit 0 -->

## 1 Zusammenhang der IQ-Abstimmungsdokumente

<!-- source: EN PDF p9; unit 1 -->

Für die Verwendung dieses Dokuments sind die folgenden Dokumente relevant:

<!-- source: EN PDF p9; unit 2 -->

Rockchip_Development_Guide_ISP30_: beschreibt die Benutzerschnittstelle und ihre zugehörigen Strukturen.

<!-- source: EN PDF p9; unit 3 -->

Rockchip_IQ_Tools_Guide_ISP30_: ausführliche Bedienungsanleitung für RK IQ Tools.

<!-- source: EN PDF p9; unit 4 -->

Rockchip_Color_Optimization_Guide_ISP30: ausführliche Beschreibung der Farbabstimmung.

<!-- source: EN PDF p9; unit 5 -->

Kapitel 1 erläutert die Zusammenhänge der beim ISP-Tuning verwendeten Dokumente. Kapitel 2 bietet einen ISP-Systemüberblick mit Funktionsblockbild und Modulvorstellung. Kapitel 3 beschreibt die Arbeitsschritte und Vorsichtsmaßnahmen des gesamten Bildabstimmungsprozesses. Ab Kapitel 4 werden die Abstimmungsverfahren der einzelnen Untermodule erläutert.

<!-- source: EN PDF p9; unit 6 -->

## 2 Überblick über das ISP-System

<!-- source: EN PDF p9; unit 7 -->

### 1.   2.1 Funktionsübersicht

<!-- source: EN PDF p9; unit 8 -->

ISP30 unterstützt die Verarbeitung üblicher Sensorbilddaten: automatische Weißabgleichs- und Belichtungsfunktionen, Demosaicing, Defektpixel- und Objektivabschattungskorrektur sowie fortgeschrittene Verfahren wie HDR, Entnebelung und Entrauschung.

<!-- source: EN PDF p10; unit 9 -->

### 2.   2.2 ISP-Funktionsblockbild

<!-- source: EN PDF p10; unit 10 -->

![Originalabbildung aus dem englischen PDF, Seite 10](/docs/rockchip-isp30-tuning/assets/en-p010-X345.jpg)

<!-- source: EN PDF p10; unit 11 -->

Abbildung 2-1 ISP30-Funktionsblockbild

<!-- source: EN PDF p11; unit 12 -->

#### 2.1   2.3 Vorstellung der einzelnen Module

<!-- source: EN PDF p11; unit 13 -->

| Modulname | Beschreibung |
| --- | --- |
| FPN | Korrigiert das CIS-Eingangsbild anhand des im Quelltext genannten schwarzen Referenzframes beziehungsweise der schwarzen Referenzzeile, um Festmusterrauschen zu entfernen. |
| BLC | CIS-bezogene Schwarzpegelkorrektur. |
| Degamma | Korrektur der CIS-Nichtlinearität. |
| DPCC | Erkennung und Korrektur statischer und dynamischer Defektpixel. |
| SPC | Korrektur verdeckter Pixel für Phasenfokussierung. |
| Dgain | Digitale lineare Verstärkung. |
| WB Gain | Korrekturverstärkung des Weißabgleichs. |
| MERGE | Zusammenführung von 3 Frames für hohen Dynamikumfang. |
| Raw 3DNR &amp;<br>Raw 2DNR | Kombinierte zeitliche und räumliche Entrauschung im RAW-Bereich. |
| DRC | Dynamikbereichskompression. |
| GIC | Korrigiert das Ungleichgewicht zwischen Gr- und Gb-Kanal und verbessert die Bildqualität bestimmter Szenen. |
| LSC | Objektivabschattungskorrektur. |
| CAC | Korrigiert die vom Objektiv verursachte axiale chromatische Aberration (violette Farbsäume). |
| AE Stats | Liefert Belichtungsstatistiken, anhand derer die Software den CIS zur automatischen Belichtung anpasst. |
| AF | Statistik zur Bewertung der Bildschärfe als Grundlage der Autofokusfunktion. |
| AWB | Liefert globale und regionale Statistiken für den softwareseitigen automatischen Weißabgleich. |
| Debayer | Wandelt ein Bayer-RAW-Bild in ein RGB-Bild um. |
| CCM | Lineare Farbraumkorrektur mittels standardmäßiger 3X3-Matrix und Vektorversatz. |
| Gamma | Helligkeitsanpassung anhand der Gammakurve in den drei Kanälen R\G\B. |
| Dehaze &amp;<br>Enhance | Leistungsfähige Entnebelung zur Verbesserung von Kontrast und Klarheit bei Dunst. |

<!-- source: EN PDF p12; unit 14 -->

| Modulname | Beschreibung |
| --- | --- |
| CSM | Wandelt (R, G, B) durch standardmäßige 3X3-Matrix und Vektorversatz in (Y, U, V) um und liefert nach Chroma-Unterabtastung YUV422 an das nachfolgende Modul. |
| LDCH | Korrigiert die Objektivverzeichnung in vertikaler Richtung laut Quelle. |
| 3D-LUT | Eine 3Dlut der Größe 9x9x9 ermöglicht komplexe Farbanpassungen, etwa von Helligkeit und Sättigung. |
| Sharp | Schärfung im YUV-Bereich zur Verbesserung der Bildklarheit. |
| YNR | Räumliche Entrauschung der Helligkeit. |
| UVNR | Separate Entfernung von Farbrauschen. |
| CGC | YUV-Farbraumumwandlung. |
| CMSK | Bildmosaik- und Verdeckungsfunktion. |
| FBC | Datenkompression. |
| SCL | Bildskalierung. |

<!-- source: EN PDF p12; unit 15 -->

## 3 Gesamtüberblick der Bildqualitätsabstimmung

<!-- source: EN PDF p12; unit 16 -->

Die beiden Hauptanwendungsbereiche sind IPC-Sicherheitskameras und Verbraucherprodukte. IPC umfasst linearen und HDR-Modus; Verbraucherprodukte umfassen insbesondere Sport-DV, Fahrzeugrekorder und Aufnahmeprodukte. Aufgrund besonderer Anforderungen der Überwachungsbranche gewichten IPC-Anwendungen die Bildqualität anders als Verbraucherprodukte.

<!-- source: EN PDF p12; unit 17 -->

### 1.   3.1 Überblick der Bildabstimmung für IPC-Anwendungen

<!-- source: EN PDF p12; unit 18 -->

IPC verwendet typischerweise linearen oder HDR-Modus. Im linearen Modus stehen angemessene Helligkeit, genaue Farbwiedergabe sowie allgemeine Klarheit, Schärfe und Transparenz im Mittelpunkt. Bei HDR sind außerdem ein sinnvoller Gesamtdynamikumfang, nicht ausgefressene helle Bereiche und erkennbare Schattendetails wichtig; Farbwiedergabe, Klarheit, Schärfe und Transparenz sollen möglichst gut bleiben. Im Folgenden werden die Abstimmungsschritte beider Modi und Vorsichtsmaßnahmen für einzelne ISP-Algorithmen erläutert.

<!-- source: EN PDF p13; unit 19 -->

#### 1.1   3.1.1 Bildqualitätsabstimmung im linearen Modus

<!-- source: EN PDF p13; unit 20 -->

Der gesamte Ablauf der linearen Bildabstimmung für IPC-Anwendungen ist in Abbildung 3-1 dargestellt.

<!-- source: EN PDF p13; unit 21 -->

![Originalabbildung aus dem englischen PDF, Seite 13](/docs/rockchip-isp30-tuning/assets/en-p013-X356.png)

<!-- source: EN PDF p13; unit 22 -->

Abbildung 3-1 Ablauf der linearen Bildabstimmung für IPC-Anwendungen

<!-- source: EN PDF p13; unit 23 -->

2\. Vor der Bildqualitätsabstimmung sind insbesondere folgende Arbeiten erforderlich:

<!-- source: EN PDF p13; unit 24 -->

1\. Sensoranbindung: Gemäß Produktdefinition die CSI-Konfiguration des Sensors einschließlich Bildrate, Auflösung, HDR-Modus und AE-Modus festlegen. Die Initialisierungsregistersequenzen jedes Modus aus dem Sensordatenblatt beziehungsweise den Hersteller-FAE-Unterlagen ermitteln und an die MIPI-Konfiguration der RK-Plattform anpassen.

<!-- source: EN PDF p13; unit 25 -->

<!-- source: EN PDF p13; unit 26 -->

Abschlusskriterium: Der Pfad des angebundenen Modus funktioniert, die grundlegende AE-Funktion arbeitet normal und RAW-Aufnahmen sind möglich; siehe Rockchip_Driver_Guide_ISP2x.

<!-- source: EN PDF p13; unit 27 -->

2\. Modulkalibrierung: Dazu gehören Schwarzpegel-, RawNR/YUV-NR/3DNR-, statische Defektpixel-, Objektivabschattungs-, AWB-, CCM- und Objektivverzeichnungskalibrierung. Dabei den in Abbildung 3-2 gezeigten Ablauf strikt einhalten.

<!-- source: EN PDF p13; unit 28 -->

<!-- source: EN PDF p13; unit 29 -->

![Originalabbildung aus dem englischen PDF, Seite 13](/docs/rockchip-isp30-tuning/assets/en-p013-X357.png)

<!-- source: EN PDF p14; unit 30 -->

Abbildung 3-2 Ablauf der Modulkalibrierung

<!-- source: EN PDF p14; unit 31 -->

Einzelheiten zur Modulkalibrierung stehen in den Modulbeschreibungen von Kapitel 4; für AWB und CCM siehe Rockchip_Color_Optimization_Guide_ISP30.

<!-- source: EN PDF p14; unit 32 -->

3\. Gemeinsame ISP-Modulabstimmung: Nach Sensoranbindung und Sensor-/Objektivkalibrierung folgt die gemeinsame Abstimmung. Für lineare Bildqualität werden mehrere ISO-/Beleuchtungsstufen optimiert; Starlight-Sensoren benötigen üblicherweise bis ISO 204800. BayerNR, Demosaic, Sharpen, YUVNR, 3DNR, Dehaze und Enhance werden ISO-abhängig gekoppelt. Neben den offenliegenden Mipi-Schnittstellenparametern der Algorithmen ändern sich auch Standardparameter mit der ISO-Kopplung.

<!-- source: EN PDF p14; unit 33 -->

<!-- source: EN PDF p14; unit 34 -->

Die lineare Abstimmung umfasst statische Laborszenen und reale Außenszenen. Im Labor werden üblicherweise die ISO-Bedingungen simuliert und Helligkeit, Farbe, Transparenz, Klarheit und Rauschen bei jeder Beleuchtungsstärke sinnvoll eingestellt. Anschließend sind reale IPC-Szenarien feinabzustimmen: Verkehrskreuzungen bei Tag und Nacht, schwach beleuchtete Außenszenen bei Nacht, detailreiche Außenszenen bei Sonne und Bewölkung sowie detailreiche Abendszenen bei Sonnenuntergang. Abbildung 3-3 zeigt die Reihenfolge.

<!-- source: EN PDF p14; unit 35 -->

![Originalabbildung aus dem englischen PDF, Seite 14](/docs/rockchip-isp30-tuning/assets/en-p014-X361.png)

<!-- source: EN PDF p14; unit 36 -->

Abbildung 3-3 Szenenfolge für die lineare Bildabstimmung

<!-- source: EN PDF p14; unit 37 -->

Abbildung 3-4 zeigt den grundlegenden Ablauf der Abstimmung der relevanten Bildqualitätsdimensionen im linearen ISP-Modus.

<!-- source: EN PDF p15; unit 38 -->

![Originalabbildung aus dem englischen PDF, Seite 15](/docs/rockchip-isp30-tuning/assets/en-p015-X364.png)

<!-- source: EN PDF p15; unit 39 -->

Abbildung 3-4 Ablauf der Abstimmung der Bildqualitätsdimensionen

<!-- source: EN PDF p15; unit 40 -->

Helligkeitsdimension:

<!-- source: EN PDF p15; unit 41 -->

Für die Helligkeit ist hauptsächlich AE abzustimmen: Zielwert, AE Route, Gewichtstabelle sowie Konvergenzgeschwindigkeit und Gleichmäßigkeit. Voraussetzungen sind korrekte Schwarzpegelkalibrierung, abgeschlossene Shading-Kalibrierung, korrektes AWB und CCM sowie vorgegebene Gamma-Parametersätze für die verschiedenen Modi.

<!-- source: EN PDF p15; unit 42 -->

Schritt 1: Zunächst die AE-Gewichtstabelle festlegen. Sie bestimmt den für die Belichtung relevanten Bildbereich und hängt von den Anwendungsanforderungen ab. Bei IPC liegt das Hauptmotiv meist in der Bildmitte; deshalb wird dort ein höheres Gewicht als am Rand empfohlen. Abbildung 3-5 zeigt ein Beispiel.

<!-- source: EN PDF p15; unit 43 -->

![Originalabbildung aus dem englischen PDF, Seite 15](/docs/rockchip-isp30-tuning/assets/en-p015-X365.png)

Editierbare Übertragung des Quellscreenshots: AecGridWeight, GridWeightMode: NightGridWeight.

| 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- |
| 0 | 2 | 5 | 2 | 0 |
| 2 | 7 | 10 | 7 | 2 |
| 3 | 10 | 14 | 10 | 3 |
| 2 | 7 | 10 | 7 | 2 |
| 0 | 5 | 8 | 5 | 0 |

<!-- source: EN PDF p15; unit 44 -->

Abbildung 3-5 AE-Gewichtstabelle

<!-- source: EN PDF p16; unit 45 -->

Schritt 2: Anschließend AE Route festlegen, also die Aufteilung der Belichtung auf Belichtungszeit und Verstärkung. Für schnell bewegte Objekte Verstärkung bevorzugen und die Belichtungszeit begrenzen. Für Kennzeichenaufnahmen am Tag wird beispielsweise meist auf 2~4ms begrenzt und die Belichtung vorrangig über Verstärkung geregelt. Bei nächtlichen Schwachlichtszenen dagegen die Belichtungszeit angemessen bevorzugen, um das Bildrauschen auszubalancieren.

<!-- source: EN PDF p16; unit 46 -->

Schritt 3: Nach Gewichtstabelle und AE Route den AE-Zielwert für verschiedene Belichtungen einstellen. In statischen Laborszenen darf der hellste mittlere Bereich nicht deutlich überbelichtet sein. In Abbildung 3-6 dürfen die mittlere Texturkarte und die keramische Kaffeetasse nicht überbelichten; Helligkeit von Dead-Leaves-Muster und Rose an den Ecken soll angemessen sein. Betroffen sind vor allem SetPoint, DynamicSetpoint und die Wahl des AE-Gegenlichtmodus.

<!-- source: EN PDF p16; unit 47 -->

![Originalabbildung aus dem englischen PDF, Seite 16](/docs/rockchip-isp30-tuning/assets/en-p016-X368.png)

<!-- source: EN PDF p16; unit 48 -->

Abbildung 3-6 Statische Beispielszenenanordnung

<!-- source: EN PDF p16; unit 49 -->

Schritt 4: Abschließend AE-Konvergenzgeschwindigkeit und Gleichmäßigkeit gegeneinander abwägen. Unter Vermeidung von AE-Schwingungen kann die Konvergenz beschleunigt werden, insbesondere für Fahrzeugrekorder und Sport-DV mit starken Szenenwechseln. Geschwindigkeit und Stabilität lassen sich üblicherweise durch Ein-/Ausschalten der Beleuchtung einer statischen Laborszene prüfen.

<!-- source: EN PDF p16; unit 50 -->

Einzelne AE-Parameter werden im AE-Modulkapitel beschrieben. Auch LSC beeinflusst die Bildhelligkeit. Deshalb wird ISO-abhängige LSC-Abschwächung empfohlen, damit bei etwas geringerer Beleuchtung das Rauschen in den vignettierten Bildbereichen nicht zunimmt.

<!-- source: EN PDF p16; unit 51 -->

----Come to an end

<!-- source: EN PDF p17; unit 52 -->

Farbdimension:

<!-- source: EN PDF p17; unit 53 -->

Nach sinnvoller AE-Einstellung folgen die Farbparameter, hauptsächlich AWB und CCM. Voraussetzungen: genaue Schwarzpegelkorrektur, abgeschlossene LSC-Kalibrierung und sinnvoll abgestimmte AE-Parameter.

<!-- source: EN PDF p17; unit 54 -->

Schritt 1: In der Laborlichtbox RAW-Aufnahmen von sieben Gruppen der 24-Farbtafel unter verschiedenen Farbtemperaturen (D75, D65, D50, TL84, CWF, A, HZ) aufnehmen. Daraus statische AWB-Weißabgleichskoeffizienten und einen Weißpunkt-Bedingungsbereich erzeugen. Siehe Abschnitt 4 von Kapitel 4 in Rockchip_IQ_Tools_Guide_ISP30.

<!-- source: EN PDF p17; unit 55 -->

Schritt 2: Mit den RAW-Aufnahmen der AWB-Kalibrierung im Werkzeug die CCM-Matrix für die Sättigung der jeweiligen Lichtquelle erzeugen.

<!-- source: EN PDF p17; unit 56 -->

Zuvor die verwendete Gammakurve bestätigen; üblich ist Gamma 2.2. Bei besonderen Anforderungen zuerst die entsprechende Gammakurve eintragen. Die Bedienoberfläche ist nachstehend gezeigt.

<!-- source: EN PDF p17; unit 57 -->

![Originalabbildung aus dem englischen PDF, Seite 17](/docs/rockchip-isp30-tuning/assets/en-p017-X371.png)

<!-- source: EN PDF p17; unit 58 -->

Abbildung 3-7 CCM-Kalibrieroberfläche

<!-- source: EN PDF p17; unit 59 -->

Schritt 3: Nach den ersten beiden Schritten die 24-Farbtafel unter jeder Lichtquelle in der Standardlichtbox aufnehmen und ihre Farbkennwerte mit imatest prüfen. Werden die Anforderungen erfüllt, können die kalibrierten AWB-Parameter und CCM-Matrizen vorläufig als geeignet gelten.

<!-- source: EN PDF p17; unit 60 -->

Schritt 4: AWB und CCM benötigen zusätzlich umfangreiche Tests und Abstimmung in realen Szenen: Auflicht, Gegenlicht, Bewölkung, Sonnenuntergang, Nacht und Mischlicht. Bei ungenauer Wiedergabe grauer Flächen AWB anpassen; bei Farbstichen, Übersättigung oder blassen Einzelfarben vorzugsweise CCM. Für Mischlicht die AWB-Szenenerkennung anpassen; bei unzutreffenden Hauttönen CCM oder 3Dlut abstimmen.

<!-- source: EN PDF p17; unit 61 -->

Zur konkreten Abstimmung von AWB und CCM siehe Rockchip_Color_Optimization_Guide_ISP30.

<!-- source: EN PDF p17; unit 62 -->

----Come to an end

<!-- source: EN PDF p18; unit 63 -->

Kontrastdimension

<!-- source: EN PDF p18; unit 64 -->

Nach Helligkeit und Farbe folgt die Kontrastoptimierung. Hauptmodule sind Gamma, Dehaze und Enhance. Üblicherweise steht die szenenabhängige Gamma-Abstimmung im Vordergrund; Dehaze und Enhance ergänzen sie.

<!-- source: EN PDF p18; unit 65 -->

Voraussetzungen: korrekte Schwarzpegelkorrektur, abgeschlossene LSC-Kalibrierung, sinnvolle AE-Belichtung sowie sinnvoll kalibrierte AWB-/CCM-Parameter.

<!-- source: EN PDF p18; unit 66 -->

Schritt 1: Gamma als Grundlage des Bildkontrasts abstimmen. In einer statischen realen Szene dürfen weder die Hauttontafel in der Bildmitte noch helle und dunkle Strukturen der räumlichen Pflanzen am Rand verloren gehen; der visuelle Kontrasteindruck soll gut sein. Siehe Abbildung.

<!-- source: EN PDF p18; unit 67 -->

![Originalabbildung aus dem englischen PDF, Seite 18](/docs/rockchip-isp30-tuning/assets/en-p018-X374.png)

<!-- source: EN PDF p18; unit 68 -->

Abbildung 3-8 Von der Gammakurve beeinflusster Bereich einer statischen Szene

<!-- source: EN PDF p18; unit 69 -->

Schritt 2: Wenn nach Gamma-Abstimmung höhere Kontrastanforderungen bestehen, Dehaze oder Enhance ergänzen; siehe Abschnitte 4.21 „Dehaze“ und 4.22 „Enhance“. Schritt 3: Danach den Gesamtkontrast objektiv prüfen: Grautafel unter D65 aufnehmen, visuell mehr als 18 Graustufen erkennen und mit imatest prüfen, ob 14steps erreicht werden. Die abweichenden Abschnittsverweise der Quelle bleiben erhalten.

<!-- source: EN PDF p19; unit 70 -->

![Originalabbildung aus dem englischen PDF, Seite 19](/docs/rockchip-isp30-tuning/assets/en-p019-X377.png)

<!-- source: EN PDF p19; unit 71 -->

Abbildung 3-9 Grautafel unter D65 in der Laborlichtbox und imatest-Analyseergebnisse

<!-- source: EN PDF p19; unit 72 -->

<!-- source: EN PDF p19; unit 73 -->

Schritt 4: In realen statischen Szenen Gamma, Dehaze, Enhance und weitere Parameter an Anwendung und Beleuchtung anpassen, um ausgewogenen Kontrast zu erhalten. Normales und schwaches Licht erfordern unterschiedliche Abstimmungsstile. Im Nachtmodus senkt Gamma beispielsweise dunkle Bereiche etwas ab, um deren Rauschen zu entlasten.

<!-- source: EN PDF p19; unit 74 -->

----Come to an end

<!-- source: EN PDF p19; unit 75 -->

Klarheits- und Rauschdimension

<!-- source: EN PDF p19; unit 76 -->

Klarheit und Rauschen müssen gegeneinander abgewogen werden. Mit der Beleuchtung ändert sich das Rauschen; bei schwachem Licht stört es das Bild stärker. Dann wird etwas Klarheit geopfert. Deshalb sind beide Parametergruppen je ISO-Szene zu steuern.

<!-- source: EN PDF p19; unit 77 -->

Zunächst vorzugsweise die Klarheit abstimmen und Details vor der Entrauschung sichtbar schärfen. Bei Abstimmung in der tatsächlichen Streaming-Umgebung die Encodierungsbitrate hoch und die 3DNR-Stufe minimal setzen; die Details des unbewegten Bilds müssen geschärft sein. Erst bei ausreichender Klarheit die Entrauschung so abstimmen, dass beide Ziele im Gleichgewicht sind.

<!-- source: EN PDF p19; unit 78 -->

Voraussetzungen für Schärfe und Rauschen: korrekte Schwarzpegelkorrektur, abgeschlossene LSC-Kalibrierung, sinnvolle AE-Belichtung, sinnvolles AWB/CCM sowie passende Gamma-/Dehaze-/Enhance-Einstellungen.

<!-- source: EN PDF p19; unit 79 -->

Beteiligte Module sind insbesondere Bayer NR, Demosaic, DPCC, YNR, UVNR, 3DNR, Sharpen und Edgefilter.

<!-- source: EN PDF p19; unit 80 -->

Schritt 1: Demosaic ist die erste Stufe für grundlegende Texturdetails. Vor dessen Abstimmung müssen Schwarzpegel, RawNR sowie AWB/CCM korrekt beziehungsweise sinnvoll kalibriert sein.

<!-- source: EN PDF p20; unit 81 -->

Zunächst Demosaic anhand der Auflösungstafel in der Laborlichtbox unter D65 bei ISO50 abstimmen, bis die objektiven Auflösungskennwerte stimmen. Zugleich prüfen, ob die hochfrequenten Strukturen des Sternmusters der statischen Szene bei ISO50 interpoliert werden; iterativ anpassen. Andere ISO-Stufen ebenso abstimmen und Hochfrequenzrauschen, Interpolationsrauschen und Klarheit ausbalancieren. Die Quelle beschreibt Abbildung 3-10 hier als Tafel unter D50, während die Bildunterschrift D65 nennt. Der rote Rahmen bezeichnet das 4:3-Sichtfeld, der blaue den mittleren Interessenbereich. Siehe Abschnitt 4.4 „Demosaic“; die ursprüngliche Verweisnummer bleibt erhalten.

<!-- source: EN PDF p20; unit 82 -->

![Originalabbildung aus dem englischen PDF, Seite 20](/docs/rockchip-isp30-tuning/assets/en-p020-X380.png)

<!-- source: EN PDF p20; unit 83 -->

Abbildung 3-10 Auflösungstafel in der Laborlichtbox unter D65

<!-- source: EN PDF p20; unit 84 -->

Schritt 2: Nach sinnvoller Demosaic-Abstimmung folgen BayerNR, YNR, UVNR, 3DNR, Sharpen und DPCC.

<!-- source: EN PDF p20; unit 85 -->

Vor Bayer NR korrekte Schwarzpegel- und sinnvolle RawNR-/AWB-/CCM-Kalibrierung bestätigen.

<!-- source: EN PDF p20; unit 86 -->

Bayer NR als vorgeschaltete Rauschverarbeitung nicht zu stark einstellen, sonst geht Bildklarheit verloren. Die Quelle verweist für Einzelheiten auf Abschnitt 4.5 „Bayer NR“.

<!-- source: EN PDF p20; unit 87 -->

Schritt 3: YNNR und UVNR abstimmen. YNR steuert hoch-, nieder- und mittelfrequentes Rauschen unabhängig. UVNR entfernt Farbrauschen; seine Stärke beeinflusst die Klarheit nicht, kann bei Übertreibung jedoch Farbverfälschungen verursachen. Die Quelle verweist auf Abschnitt 4.6 „YNNR und UVNR“.

<!-- source: EN PDF p20; unit 88 -->

Schritt 4: Mit Sharpen und Edgefilter Texturdetails und Kantenschärfe angemessen einstellen. Vor 3DNR müssen im statischen Laborbild beispielsweise Ranken, Grünalgen, Bär und Hanfseil sowie starke Kanten des mittleren Kreis-Sternmusters geschärft sein. Siehe Abbildung. Die Quelle verweist auf Abschnitt 4.7 „sharpen and edgefilter“.

<!-- source: EN PDF p21; unit 89 -->

![Originalabbildung aus dem englischen PDF, Seite 21](/docs/rockchip-isp30-tuning/assets/en-p021-X383.png)

<!-- source: EN PDF p21; unit 90 -->

Abbildung 3-11 Bei ISO50 zu beachtende geschärfte Texturen der statischen Szene

<!-- source: EN PDF p21; unit 91 -->

Schritt 5: Die Stärke der dynamischen Defektpixelentfernung durch DPCC vor allem bei etwas schwächerer Beleuchtung prüfen. Bei gutem Licht wird eine schwache DPCC-Stufe empfohlen. Die Quelle verweist auf Abschnitt 4.8 „DPCC“.

<!-- source: EN PDF p21; unit 92 -->

Schritt 6: 3DNR ist entscheidend für das Gleichgewicht zwischen Rauschen und Schärfe. Abzustimmen sind insbesondere DEC, REC und NR. Das Modul zerlegt Rauschen in Frequenzbänder, entfernt sie separat und führt sie wieder zusammen. Bewegte Objektkanten, Nachzieheffekte und Gesamtrauschen müssen gemeinsam bewertet werden. Im roten Rahmen der folgenden Abbildung sind Nachziehen der Person und Gesamtrauschen auszubalancieren. Die Quelle verweist auf Abschnitt 4.9 „3DNR“.

<!-- source: EN PDF p21; unit 93 -->

![Originalabbildung aus dem englischen PDF, Seite 21](/docs/rockchip-isp30-tuning/assets/en-p021-X384.png)

<!-- source: EN PDF p21; unit 94 -->

3-12 Prüfpunkte für 3DNR

<!-- source: EN PDF p22; unit 95 -->

Schritt 7: Abschließend bei jeder ISO-Stufe umfassend prüfen und gegebenenfalls feinabstimmen, bis Klarheit und Rauschen insgesamt ausgeglichen sind.

<!-- source: EN PDF p22; unit 96 -->

----Come to an end

<!-- source: EN PDF p22; unit 97 -->

#### 1.2   3.1.2 Bildqualitätsabstimmung im HDR-Modus

<!-- source: EN PDF p22; unit 98 -->

HDR-Bildqualität umfasst Dynamikumfang, Helligkeit, Klarheit und Rauschen, Transparenz, Farbwiedergabe und Bewegungsnachziehen. Helligkeit betrifft vor allem AE und LSC; Dynamikumfang hauptsächlich das Belichtungsverhältnis. Für Schärfe und Rauschen sind Bayer NR, Demosaic, DPCC, YNR, UVNR, 3DNR, Sharpen und Edgefilter relevant. Transparenz beeinflussen Gamma, Dehaze und Enhance. Farbe betrifft AWB, CCM und 3DLUT. Bewegungsnachziehen hängt von HDR-Parametern und Belichtungsverhältnis ab. Typisch sind Gesichtserfassung bei Gegenlicht und Kennzeichenerfassung bei starkem Licht. Abbildung 3-13 zeigt die Architektur.

<!-- source: EN PDF p22; unit 99 -->

![Originalabbildung aus dem englischen PDF, Seite 22](/docs/rockchip-isp30-tuning/assets/en-p022-X387.png)

<!-- source: EN PDF p22; unit 100 -->

3-13 Architektur der HDR-Bildabstimmung

<!-- source: EN PDF p22; unit 101 -->

Vor HDR-Abstimmung Sensor anbinden und Objektivmodul kalibrieren; Sensoranbindung wie in 3.1.1. Für AWB, Shading und Bayer NR können Parameter der linearen Kalibrierung als Referenz dienen. Bei HCG/LCG-HDR-Sensoren Bayer NR, YUV NR und 3DNR für die jeweiligen Modi kalibrieren. CCM liegt hinter HDR TMO; TMO zerstört die Linearität der Daten. Daher CCM bei HDR passend anpassen:

<!-- source: EN PDF p22; unit 102 -->

1\. Sättigungskalibrierwert etwa 80%~90%;

<!-- source: EN PDF p22; unit 103 -->

2\. Auffällige Einzelfarben mit 3D lut feinabstimmen.

<!-- source: EN PDF p23; unit 104 -->

3\. Die durch TMO stark angehobene Helligkeit angemessen reduzieren, um die Farbwiedergabe weniger zu beeinflussen. Bei unzureichender Helligkeit Gamma gemeinsam mit HDR TMO abstimmen.

<!-- source: EN PDF p23; unit 105 -->

<!-- source: EN PDF p23; unit 106 -->

Nach Sensorintegration und Sensor-/Objektivkalibrierung die einzelnen HDR-Bildqualitätsdimensionen optimieren.

<!-- source: EN PDF p23; unit 107 -->

Abstimmung zur Aufhellung von Gesichtern in HDR-Gegenlichtszenen

<!-- source: EN PDF p23; unit 108 -->

1\. Helligkeitsdimension:

<!-- source: EN PDF p23; unit 109 -->

HDR-Helligkeit bezeichnet hier vor allem sinnvolle AE-Belichtung. AE besitzt HDR-AE- und lineare AE-Untersteuerungen. HDR AE passt insbesondere das Belichtungsverhältnis und damit die Belichtungszeiten langer und kurzer Frames an. Für Gewichtstabelle, AE Route, Zielwert, Konvergenzgeschwindigkeit und Gleichmäßigkeit siehe die Helligkeitsdimension in 3.1.1.

<!-- source: EN PDF p23; unit 110 -->

Das HDR-AE-Belichtungsverhältnis bestimmt den Dynamikumfang. Deshalb muss es sich an unterschiedliche Szenendynamik anpassen. Im automatischen Verhältnis-Modus berechnet HDR AE anhand des Szenenhistogramms den Dynamikumfang und ein passendes Verhältnis. Angemessen ist es, wenn helle Details nicht überbelichten und die Helligkeit des langen Frames sinnvoll ist. HDR AE verwendet die Langframe-Belichtung als Referenz und bestimmt daraus per Verhältnis die Kurzframe-Belichtung.

<!-- source: EN PDF p23; unit 111 -->

Im HDR-Modus werden für helle Bereiche bevorzugt kurze, für dunkle Bereiche lange Frames verwendet. Bei Gegenlicht liegt das Gesicht im dunklen Bereich. Zur Aufhellung:

<!-- source: EN PDF p23; unit 112 -->

1\. Mit Gewichtstabelle, AE Route und Langframe-Zielwert die Helligkeit des langen Frames erhöhen.

<!-- source: EN PDF p23; unit 113 -->

<!-- source: EN PDF p23; unit 114 -->

2\. Mit HDR-TMO-Parametern einschließlich DetailsLowLight die Schatten aufhellen.

<!-- source: EN PDF p23; unit 115 -->

<!-- source: EN PDF p23; unit 116 -->

3\. Das maximale Belichtungsverhältnis begrenzen, um den Dynamikumfang zu steuern; dadurch werden dunkle Bereiche in gewissem Maß leicht heller.

<!-- source: EN PDF p23; unit 117 -->

<!-- source: EN PDF p23; unit 118 -->

![Originalabbildung aus dem englischen PDF, Seite 23](/docs/rockchip-isp30-tuning/assets/en-p023-X392.png)

<!-- source: EN PDF p23; unit 119 -->

3-14 Dunkle Bereiche im langen Frame

<!-- source: EN PDF p24; unit 120 -->

1\. Bewegungsnachziehen im Zusammenführungsbereich:

<!-- source: EN PDF p24; unit 121 -->

Der HDR-Zusammenführungsbereich enthält Anteile langer und kurzer Frames. Zeitliche Belichtungsunterschiede und Motivbewegung verursachen prinzipiell Nachziehen. Dafür das HDR-Hauptmodul und das HDR-AE-Belichtungsverhältnis abstimmen. Je größer das Verhältnis, desto wahrscheinlicher Nachzieheffekte im Zusammenführungsbereich.

<!-- source: EN PDF p24; unit 122 -->

1\. Szenendynamikumfang und Bewegungsnachziehen berücksichtigen und das HDR-AE-Verhältnis angemessen abstimmen.

<!-- source: EN PDF p24; unit 123 -->

<!-- source: EN PDF p24; unit 124 -->

2\. Bei gleichem Verhältnis durch Anpassung der Kurzframe-Belichtungszeit den Belichtungsversatz zwischen langen und kurzen Frames und damit das Nachziehen verringern.

<!-- source: EN PDF p24; unit 125 -->

<!-- source: EN PDF p24; unit 126 -->

3\. Mit OECurve_XXX und MDCurve_XXX im HDR-MERGE-Modul die Wahrscheinlichkeit einer bewegungsbedingten falschen Kurzframe-Verwendung im Zusammenführungsbereich und damit das Nachziehen senken.

<!-- source: EN PDF p24; unit 127 -->

<!-- source: EN PDF p24; unit 128 -->

![Originalabbildung aus dem englischen PDF, Seite 24](/docs/rockchip-isp30-tuning/assets/en-p024-X396.png)

<!-- source: EN PDF p24; unit 129 -->

3-15 Bewegungsnachziehen im HDR-Zusammenführungsbereich

<!-- source: EN PDF p24; unit 130 -->

Szenendynamikumfang:

<!-- source: EN PDF p24; unit 131 -->

Den HDR-Dynamikumfang beeinflussen AE-Belichtungsverhältnis, HDR DRC und Gamma. Voraussetzungen zur DRC-Abstimmung: korrekter Schwarzpegel, abgeschlossene Shading-Kalibrierung, sinnvoll abgestimmtes AE, abgeschlossenes AWB/CCM und voreingestelltes Gamma.

<!-- source: EN PDF p24; unit 132 -->

Wie in Abbildung 3-14 eine ähnliche Szene in einer separaten Box aufbauen, ein Luxmeter einsetzen und beidseitig regelbare LED-Aufheller im Winkel von 45 Grad anordnen. So lassen sich Szenen unterschiedlicher Dynamik simulieren.

<!-- source: EN PDF p25; unit 133 -->

![Originalabbildung aus dem englischen PDF, Seite 25](/docs/rockchip-isp30-tuning/assets/en-p025-X399.png)

<!-- source: EN PDF p25; unit 134 -->

3-14 Szene zur Dynamikumfangsabstimmung

<!-- source: EN PDF p25; unit 135 -->

Farbdimension:

<!-- source: EN PDF p25; unit 136 -->

Die Farbabstimmung des linearen Modus verwenden. Durch Tonemap unterscheidet sich die HDR-Farbe etwas vom linearen Modus; nach der Kalibrierung die Sättigung situationsabhängig angemessen reduzieren.

<!-- source: EN PDF p25; unit 137 -->

Kontrastdimension:

<!-- source: EN PDF p25; unit 138 -->

Siehe Kontrastabstimmung im linearen Modus.

<!-- source: EN PDF p25; unit 139 -->

Klarheits- und Rauschdimension:

<!-- source: EN PDF p25; unit 140 -->

Siehe Schärfe- und Rauschabstimmung im linearen Modus.

<!-- source: EN PDF p25; unit 141 -->

## 4 Modulvorstellung

<!-- source: EN PDF p25; unit 142 -->

Dieses Kapitel erläutert Modulfunktionen und Parameter. Die Parameter liegen als XML-Dateien in der Firmware; einige können mit Abstimmwerkzeugen angepasst werden. Für die Beschreibung gilt:

<!-- source: EN PDF p25; unit 143 -->

" " : Kennzeichnet einen Parameter in Zeichenkettenform.

<!-- source: EN PDF p25; unit 144 -->

xxx/yyy: Das Element yyy der XML-Datei ist ein untergeordnetes Element von xxx.

<!-- source: EN PDF p26; unit 145 -->

### 1.   4.1 AEC

<!-- source: EN PDF p26; unit 146 -->

#### 1.1   4.1.1 Funktionsbeschreibung

<!-- source: EN PDF p26; unit 147 -->

AE besteht hauptsächlich aus Messstatistik und AE-Steueralgorithmus. Die Messstatistik liefert Helligkeitsdaten in Form von Histogrammen und blockweisen Helligkeitsmittelwerten: gewichtetes 256-Segment-Histogramm und R/G/B/Y-Mittelwerte auf RAW-Basis sowie gewichtetes 32-Segment-Histogramm und blockweise R/G/B/Y-Mittelwerte auf RGB-Basis vor Gamma.

<!-- source: EN PDF p26; unit 148 -->

Der AE-Steueralgorithmus vergleicht die eingehenden Helligkeitsstatistiken mit der Zielhelligkeit, berechnet eine neue Belichtung und weist dem Sensor automatisch Belichtungszeit, Verstärkung und Objektivblendenwert für passende Bildhelligkeit zu.

<!-- source: EN PDF p26; unit 149 -->

<!-- source: EN PDF p26; unit 150 -->

![Originalabbildung aus dem englischen PDF, Seite 26](/docs/rockchip-isp30-tuning/assets/en-p026-X403.png)

<!-- source: EN PDF p26; unit 151 -->

Abbildung 4-1 Aufbau des AEC-Moduls

<!-- source: EN PDF p26; unit 152 -->

#### 1.2   4.1.2 Wichtige Parameter

<!-- source: EN PDF p26; unit 153 -->

Die AEC-Parameter gliedern sich funktional grob in gemeinsame Funktionssteuerung, lineare Belichtungsabstimmung und HDR-Belichtungsabstimmung. Zusätzlich werden die belichtungsbezogenen SensorInfo- und Systemparameter vorgestellt; ihre Funktionen stehen in den jeweiligen Modulbeschreibungen.

<!-- source: EN PDF p26; unit 154 -->

<!-- source: EN PDF p27; unit 155 -->

##### 1.2.1   4.1.2.1 Gemeinsame AEC-Funktionssteuerparameter

<!-- source: EN PDF p27; unit 156 -->

| Parametername | Parametertyp | Kurzbeschreibung |
| --- | --- | --- |
| Enable | Abstimmparameter | Benutzer-Abstimmparameter |
| AecRunInterval | Abstimmparameter | Benutzer-Abstimmparameter |
| AecOpType | Abstimmparameter | Benutzer-Abstimmparameter |
| HistStatsMode | Abstimmparameter | Benutzer-Abstimmparameter; gewöhnlich Standardwert verwenden. |
| RawStatsMode | Abstimmparameter | Benutzer-Abstimmparameter; gewöhnlich Standardwert verwenden. |
| YrangeMode | Abstimmparameter | Benutzer-Abstimmparameter; gewöhnlich Standardwert verwenden. |
| AecSpeed | Abstimmparameter | Benutzer-Abstimmparameter |
| AecDelayFrmNum | Abstimmparameter | Benutzer-Abstimmparameter |
| AecFrameRateMode | Abstimmparameter | Benutzer-Abstimmparameter |
| AecAntiFlicker | Abstimmparameter | Benutzer-Abstimmparameter |
| AecGridWeight | Abstimmparameter | Benutzer-Abstimmparameter |
| AecManualCtrl | Abstimmparameter | Benutzer-Abstimmparameter |

<!-- source: EN PDF p27; unit 157 -->

###### 1.2.1.1   Enable

<!-- source: EN PDF p27; unit 158 -->

【Beschreibung】

<!-- source: EN PDF p27; unit 159 -->

AEC-Modulschalter: 0 aus, 1 ein.

<!-- source: EN PDF p27; unit 160 -->

【Hinweise】

<!-- source: EN PDF p27; unit 161 -->

Bei Enable = 0 wird der AEC-Algorithmus ausgeschaltet. Die Belichtung bleibt auf dem Wert vor dem Ausschalten.

<!-- source: EN PDF p27; unit 162 -->

###### 1.2.1.2   AecRunInterval

<!-- source: EN PDF p27; unit 163 -->

【Beschreibung】

<!-- source: EN PDF p27; unit 164 -->

Ausführungsintervall des AE-Algorithmus, Bereich [0,255], Standard 0. Bei 0 AE für jeden Frame ausführen; bei 1 laut Quelle alle 1 Frames, und so weiter. Die uneindeutige Intervallformulierung bleibt erhalten.

<!-- source: EN PDF p27; unit 165 -->

Nicht zu groß einstellen, sonst kann AE langsam und ungleichmäßig reagieren.

<!-- source: EN PDF p28; unit 166 -->

###### 1.2.1.3   AecOpType

<!-- source: EN PDF p28; unit 167 -->

【Beschreibung】

<!-- source: EN PDF p28; unit 168 -->

Belichtungsmodus: automatisch (RK_AIQ_OP_MODE_AUTO) oder manuell (RK_AIQ_OP_MODE_MANUAL).

<!-- source: EN PDF p28; unit 169 -->

Für manuelle Belichtung zugleich den manuellen Wert über AecManualCtrl einstellen.

<!-- source: EN PDF p28; unit 170 -->

Die AecManualCtrl-Parameter werden weiter unten erläutert.

<!-- source: EN PDF p28; unit 171 -->

###### 1.2.1.4   HistStatsMode

<!-- source: EN PDF p28; unit 172 -->

【Beschreibung】

<!-- source: EN PDF p28; unit 173 -->

Histogrammstatistikmodus des AEC-Moduls: fünf Modi CAM_HISTV2_MODE_Y/R/G/B/RGB, Standard Y.

<!-- source: EN PDF p28; unit 174 -->

###### 1.2.1.5   RawStatsMode

<!-- source: EN PDF p28; unit 175 -->

【Beschreibung】

<!-- source: EN PDF p28; unit 176 -->

Helligkeitsstatistikmodus des AEC-Moduls: vier Modi CAM_RAWSTATSV2_MODE_Y/R/G/B, Standard Y.

<!-- source: EN PDF p28; unit 177 -->

###### 1.2.1.6   YrangeMode

<!-- source: EN PDF p28; unit 178 -->

【Beschreibung】

<!-- source: EN PDF p28; unit 179 -->

Y-Kanalbereich des Aec-Moduls: CAM_YRANGEV2_MODE_FULL/LIMITED, Standard FULL.

<!-- source: EN PDF p28; unit 180 -->

Nur wirksam, wenn RawStatsMode im Y-Modus arbeitet.

<!-- source: EN PDF p28; unit 181 -->

###### 1.2.1.7   AecGridWeight

<!-- source: EN PDF p28; unit 182 -->

【Beschreibung】

<!-- source: EN PDF p28; unit 183 -->

Statistikgewicht jedes Unterfensters des Hauptfensters; insgesamt 15x15 Parameter.

<!-- source: EN PDF p28; unit 184 -->

【Hinweise】

<!-- source: EN PDF p28; unit 185 -->

Die RK3588-Hardware unterstützt 5X5- und 15X15-Gewichtungen. Die Abstimmdatei verwendet einheitlich 15X15; der Algorithmus komprimiert oder erweitert die Gewichte entsprechend der tatsächlichen Hardwarekonfiguration.

<!-- source: EN PDF p29; unit 186 -->

###### 1.2.1.8   AecWinScale

<!-- source: EN PDF p29; unit 187 -->

【Beschreibung】

<!-- source: EN PDF p29; unit 188 -->

Parameter für das Größenverhältnis des AE-Hardwarestatistikfensters.

<!-- source: EN PDF p29; unit 189 -->

【Felder】

<!-- source: EN PDF p29; unit 190 -->

| Feldname | Beschreibung |
| --- | --- |
| InputRaw | Größenverhältnisse des RAW-basierten AE-Hardwarestatistikfensters: 4 Parameter [h_off,v_off,h_size,v_size], jeweils Bereich [0,1]. |
| TmoRaw | Größenverhältnisse des RAW-basierten AE-Hardwarestatistikfensters nach TMO: 4 Parameter [h_off, v_off, h_size, v_size], jeweils Bereich [0,1]. |
| Yuv | Größenverhältnisse des YUV-basierten AE-Hardwarestatistikfensters: 4 Parameter [h_off,v_off,h_size,v_size], jeweils Bereich [0,1]. |

<!-- source: EN PDF p29; unit 191 -->

【Hinweise】

<!-- source: EN PDF p29; unit 192 -->

Die Fenstergrößenverhältnisse beziehen sich auf die Sensorauflösung; Skalenparameterbereich [0,1]. h_off und v_off sind horizontaler und vertikaler Versatz der linken oberen Fensterecke relativ zum lichtempfindlichen Sensorbereich. h_size und v_size sind horizontale und vertikale Fensterabmessungen.

<!-- source: EN PDF p29; unit 193 -->

Mit Sensorauflösung res beträgt der tatsächliche Hardwarefensterversatz [res x h_off, res x v_off]; die tatsächliche Größe beträgt [res x h_size, res x v_size].

<!-- source: EN PDF p29; unit 194 -->

Versatz plus Größe darf jeweils 1 nicht überschreiten: h_off + h_size &lt;=1, v_off + v_size &lt;=1.

<!-- source: EN PDF p29; unit 195 -->

###### 1.2.1.9   AecManualCtrl

<!-- source: EN PDF p29; unit 196 -->

【Beschreibung】

<!-- source: EN PDF p29; unit 197 -->

Manuelle Belichtungsparameter, nach Modus in LinearAE und HdrAE gegliedert.

<!-- source: EN PDF p29; unit 198 -->

【Felder】

<!-- source: EN PDF p30; unit 199 -->

| Feldname | Beschreibung |
| --- | --- |
| ManualTimeEn | Manuelle Belichtungszeit aktivieren, Standard 1. |
| ManualGainEn | Laut Quelle manuelle Belichtungszeit aktivieren, Standard 1. Die abweichende Beschreibung zum Gain-Feld bleibt erhalten. |
| ManualIspDgainEn | Manuelle digitale ISP-Verstärkung aktivieren, Standard 1. |
| TimeValue | Manuelle Belichtungszeit in s; durch den Sensor begrenzt. |
| GainValue | Manuelle Sensorverstärkung als tatsächlicher Faktor in 1x; durch den Sensor begrenzt. |
| IspDGainValue | Manuelle digitale ISP-Verstärkung als tatsächlicher Faktor in 1x; durch den ISP begrenzt. |

<!-- source: EN PDF p30; unit 200 -->

【Hinweise】

<!-- source: EN PDF p30; unit 201 -->

Dieses Modul wirkt nur bei AeOptype = MANUAL. Sind ManualTimeEn, ManualGainEn und ManualIspDgainEn sämtlich 1, liegt manueller Modus vor. Ist mindestens einer davon nicht aktiviert, liegt halbautomatischer Modus vor. Sind alle drei 0, entspricht dies automatischem Modus und das System meldet einen Fehlerhinweis.

<!-- source: EN PDF p30; unit 202 -->

Im manuellen/halbmanuellen Modus werden Belichtungszeit und Verstärkung durch die Maximal-/Minimalwerte des automatischen Modus begrenzt. Bei Überschreitung wird dessen entsprechender Grenzwert verwendet.

<!-- source: EN PDF p30; unit 203 -->

RK3588 unterstützt derzeit keine digitale ISP-Verstärkung; ManualIspDgainEn und IspDGainValue sind daher unwirksam.

<!-- source: EN PDF p30; unit 204 -->

###### 1.2.1.10   AecSpeed

<!-- source: EN PDF p30; unit 205 -->

【Beschreibung】

<!-- source: EN PDF p30; unit 206 -->

Geschwindigkeitseigenschaften der automatischen Belichtungsanpassung.

<!-- source: EN PDF p30; unit 207 -->

【Felder】

<!-- source: EN PDF p31; unit 208 -->

| Feldname | Beschreibung |
| --- | --- |
| DyDampEn | Dynamische Anpassungsgeschwindigkeit: ein passt sie der Szenenhelligkeit an; aus verwendet feste Werte DampOver/DampUnder/DampDark2Bright/DampBright2Dark. |
| SmoothEn | Glättungsschalter: ein aktiviert Belichtungsglättung; aus deaktiviert sie zur Beschleunigung der Belichtungsanpassung. |
| DampOver | Bei stabiler Umgebung Anpassungsgeschwindigkeit, wenn die Bildhelligkeit über dem Ziel liegt; Bereich [0,1]. |
| DampUnder | Bei stabiler Umgebung Anpassungsgeschwindigkeit, wenn die Bildhelligkeit unter dem Ziel liegt; Bereich [0,1]. |
| DampDark2Bright | Geschwindigkeit bei abruptem Wechsel von dunkel zu hell; Bereich [0,1]. |
| DampBright2Dark | Geschwindigkeit bei abruptem Wechsel von hell zu dunkel; Bereich [0,1]. |

<!-- source: EN PDF p31; unit 209 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p31; unit 210 -->

Dämpfungskoeffizient der automatischen Belichtungsanpassung. Die Quelle beschreibt die Gewichtung zweimal als aktuellen Belichtungswert; maßgeblich bleibt ihre Formel: endgültige Belichtung = aktuelle Belichtung x DampCoef + neue Belichtung x (1 - DampCoef ).

<!-- source: EN PDF p31; unit 211 -->

Je größer der AE-Dämpfungsfaktor, desto langsamer die Belichtungsanpassung, und umgekehrt. Für einen gleichmäßigen Ablauf wird der Bereich [0.4, 0.7] empfohlen.

<!-- source: EN PDF p31; unit 212 -->

Bei abruptem Helligkeitswechsel DampDark2Bright/DampBright2Dark als Dämpfung für dunkel→hell beziehungsweise hell→dunkel verwenden. Bei stabiler Umgebungshelligkeit während der AE-Konvergenz DampOver/DampUnder verwenden. Empfohlen: DampDark2Bright/DampBright2Dark kleiner als DampOver/DampUnder; DampDark2Bright kleiner als DampBright2Dark; DampOver kleiner als DampUnder.

<!-- source: EN PDF p31; unit 213 -->

###### 1.2.1.11   AecDelayFrmNum

<!-- source: EN PDF p31; unit 214 -->

【Beschreibung】

<!-- source: EN PDF p31; unit 215 -->

Auslöseverzögerung der automatischen Belichtung.

<!-- source: EN PDF p31; unit 216 -->

【Felder】

<!-- source: EN PDF p32; unit 217 -->

| Feldname | Beschreibung |
| --- | --- |
| BlackDelay | AE-Auslöseverzögerung: liegt die Bildhelligkeit länger als BlackDelay Frames unter dem Zielwert, beginnt AE mit der Anpassung. |
| WhiteDelay | AE-Auslöseverzögerung: liegt die Bildhelligkeit länger als WhiteDelay Frames über dem Zielwert, beginnt AE mit der Anpassung. |

<!-- source: EN PDF p32; unit 218 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p32; unit 219 -->

BlackDelay/WhiteDelay nicht zu groß wählen, sonst reagiert der AE-Auslöser zu langsam.

<!-- source: EN PDF p32; unit 220 -->

###### 1.2.1.12   AecFrameRateMode

<!-- source: EN PDF p32; unit 221 -->

【Beschreibung】

<!-- source: EN PDF p32; unit 222 -->

Bildratenmodus der automatischen Belichtung: feste Bildrate oder automatische Bildratenabsenkung.

<!-- source: EN PDF p32; unit 223 -->

【Felder】

<!-- source: EN PDF p32; unit 224 -->

| Feldname | Beschreibung |
| --- | --- |
| isFpsFix | Feste Bildrate: Standard 0 verwendet automatische Bildrate; 1 verwendet feste Bildrate. |
| FpsValue | Nur bei fester Bildrate wirksam. Standard 0 verwendet die Treiberstandardbildrate, sonst die eingestellte Bildrate. |

<!-- source: EN PDF p32; unit 225 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p32; unit 226 -->

Für feste Bildrate isFpsFix aktivieren. Bei FpsValue = 0 gilt die Standardbildrate des Treibers, sonst die eingestellte Bildrate. Die maximale Belichtungszeit wird gemeinsam durch Bildrate und den AecRoute-Maximalwert bestimmt. Überschreitet AecRoute die Grenze der festen Bildrate, korrigiert der Algorithmus die maximale Belichtungszeit.

<!-- source: EN PDF p32; unit 227 -->

Für automatische Bildratenabsenkung isFpsFix auf 0 setzen; FpsValue ist dann unwirksam. Die minimale Bildrate bestimmen die maximale AecRoute-Belichtungszeit und CISMinFps in SensorInfo. Überschreitet AecRoute die durch CISMinFps erlaubte maximale Zeit, korrigiert der Algorithmus sie intern. Nach Belichtungszerlegung wird bei längerer Zeit als für die Treiberstandardbildrate zulässig vblank geändert, um die Bildrate zu senken und die Belichtungszeit zu erhöhen. Ist die Zeit kleiner oder gleich der für die Treiberstandardbildrate zulässigen Zeit, gilt diese Standardbildrate. Die konkrete Absenkung hängt von AecRoute ab: dort eine Verstärkungsschwelle setzen; bei Überschreitung wird die Absenkung ausgelöst.

<!-- source: EN PDF p33; unit 228 -->

###### 1.2.1.13   AecAntiFlicker

<!-- source: EN PDF p33; unit 229 -->

【Beschreibung】

<!-- source: EN PDF p33; unit 230 -->

Unterdrückung netzfrequenzbedingten Flimmerns bei automatischer Belichtung.

<!-- source: EN PDF p33; unit 231 -->

【Felder】

<!-- source: EN PDF p33; unit 232 -->

| Feldname | Beschreibung |
| --- | --- |
| enable | Netzfrequenz-Flimmerunterdrückung: bei 1 ein, sonst aus. |
| Frequency | Netzfrequenz wählen: AECV2_FLICKER_FREQUENCY_50HZ oder AECV2_FLICKER_FREQUENCY_60HZ. |
| Mode | Zwei Flimmerunterdrückungsmodi: AECV2_ANTIFLICKER_NORMAL_MODE und AECV2_ANTIFLICKER_AUTO_MODE. Der jeweilige Modus passt die Belichtungszeit zur Flimmerunterdrückung an. |

<!-- source: EN PDF p33; unit 233 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p33; unit 234 -->

Bei enable = 0 ist die Flimmerunterdrückung ausgeschaltet.

<!-- source: EN PDF p33; unit 235 -->

NORMAL-Modus: minimale Belichtungszeit und Anpassungsschritt fest auf 1/120 s (60Hz) oder 1/100 s (50Hz). Dadurch kann bei großer Helligkeit Überbelichtung entstehen. Unter künstlicher Beleuchtung lässt sich die Belichtungszeit der Lichtquellenfrequenz anpassen und Flimmern verhindern.

<!-- source: EN PDF p33; unit 236 -->

AUTO-Modus: Helligkeitsabhängige Belichtungszeit bis zur minimalen Sensorbelichtungszeit. Anders als NORMAL kann dies Überbelichtung in hellen Umgebungen unterdrücken, dort versagt jedoch die Flimmerunterdrückung.

<!-- source: EN PDF p33; unit 237 -->

Netzfrequenzflimmern lässt sich nicht unter allen Bedingungen vollständig beseitigen. Den Modus nach Szene und Produkt wählen. Der in der Quelle „NOMRAL“ geschriebene NORMAL-Modus unterdrückt Flimmern vollständig, kann bei hellem Licht aber überbelichten und Bildinformationen verlieren. AUTO vermeidet Überbelichtung, kann bei hellem Licht jedoch flimmern. Empfohlen werden 30fps (60HZ) oder 25fps (50HZ).

<!-- source: EN PDF p33; unit 238 -->

###### 1.2.1.14   AecEnvLvCalib

<!-- source: EN PDF p33; unit 239 -->

【Beschreibung】

<!-- source: EN PDF p33; unit 240 -->

Kalibrierparameter der Umgebungshelligkeit.

<!-- source: EN PDF p33; unit 241 -->

【Felder】

<!-- source: EN PDF p34; unit 242 -->

| Feldname | Beschreibung |
| --- | --- |
| CalibFNumber | Relative Referenzblende zur Umgebungshelligkeitskalibrierung; objektivabhängig. |
| CurveCoeff | Koeffizient der Umgebungshelligkeits-Kalibrierkurve |

<!-- source: EN PDF p34; unit 243 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p34; unit 244 -->

Der Parameter ist vorläufig unwirksam; die Kalibrierung der Umgebungshelligkeit steht derzeit nicht zur Verfügung.

<!-- source: EN PDF p34; unit 245 -->

##### 1.2.2   4.1.2.2 AEC-Parameter zur linearen Belichtungsabstimmung

<!-- source: EN PDF p34; unit 246 -->

| Parametername | Parametertyp | Kurzbeschreibung |
| --- | --- | --- |
| RawStatsEn | Abstimmparameter | Benutzer-Abstimmparameter; gewöhnlich Standardwert verwenden. |
| EvBias | Abstimmparameter | Benutzer-Abstimmparameter |
| ToleranceIn/Out | Abstimmparameter | Benutzer-Abstimmparameter |
| StrategyMode | Abstimmparameter | Benutzer-Abstimmparameter |
| Route | Abstimmparameter | Benutzer-Abstimmparameter |
| InitExp | Abstimmparameter | Benutzer-Abstimmparameter |
| DySetpoint | Abstimmparameter | Benutzer-Abstimmparameter |
| BackLightCtrl | Abstimmparameter | Benutzer-Abstimmparameter |
| OverExpCtrl | Abstimmparameter | Benutzer-Abstimmparameter |

<!-- source: EN PDF p34; unit 247 -->

###### 1.2.2.1   RawStatsEn

<!-- source: EN PDF p34; unit 248 -->

【Beschreibung】

<!-- source: EN PDF p34; unit 249 -->

Die lineare Belichtung kann RAW- oder RGB-Helligkeitsstatistiken verwenden, abhängig von der Anwendung. Standard ist die RAW-Statistik, also Wert 1.

<!-- source: EN PDF p34; unit 250 -->

RawStatsEn = 0: Belichtungsberechnung anhand der RGB-Statistik vor Gamma.

<!-- source: EN PDF p34; unit 251 -->

RawStatsEn = 1: Belichtungsberechnung anhand der RAW-Statistik nach Schwarzpegelabzug und Multiplikation mit der Weißabgleichsverstärkung.

<!-- source: EN PDF p34; unit 252 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p34; unit 253 -->

RK3588 unterstützt für lineare Belichtung nur RAW-Statistiken. Der Parameter kann daher nur 1 sein; 0 ist unwirksam.

<!-- source: EN PDF p35; unit 254 -->

###### 1.2.2.2   ToleranceIn/Out

<!-- source: EN PDF p35; unit 255 -->

【Beschreibung】

<!-- source: EN PDF p35; unit 256 -->

Helligkeitstoleranz bei automatischer Belichtungsanpassung, Einheit %, Bereich [0,100].

<!-- source: EN PDF p35; unit 257 -->

Bei konvergiertem AE soll die Bildhelligkeit B im Bereich [tatsächlich wirksame Zielhelligkeit X(1-tolerance/100), tatsächlich wirksame Zielhelligkeit X(1+Tolerance/100)] liegen.

<!-- source: EN PDF p35; unit 258 -->

ToleranceIn bezeichnet die Toleranz bei nicht konvergierter, ToleranceOut bei konvergierter Belichtung. ToleranceIn &lt; ToleranceOut wird empfohlen, um überempfindliche Reaktionen zu vermeiden und die Belichtung zu stabilisieren.

<!-- source: EN PDF p35; unit 259 -->

###### 1.2.2.3   EvBias

<!-- source: EN PDF p35; unit 260 -->

【Beschreibung】

<!-- source: EN PDF p35; unit 261 -->

Prozentuale Belichtungsabweichung bei automatischer Anpassung, Einheit %, Bereich [-200, +200].

<!-- source: EN PDF p35; unit 262 -->

Passt in besonderen Szenen die feste/dynamische Zielhelligkeit (SetPoint/NightSetPoint) an. Die tatsächlich wirksame Zielhelligkeit beträgt (SetPoint/ NightSetPoint)*[1+abs(EvBias)/100]^[EvBias/abs(EvBias)]. Die Quellformel bleibt unverändert, einschließlich des nicht gesondert erläuterten Falls EvBias=0, bei dem der Exponent einen Nullnenner enthält.

<!-- source: EN PDF p35; unit 263 -->

Bei EvBias=100 verdoppelt sich die Helligkeit gegenüber dem Standard; bei EvBias=-100 beträgt sie 1/2 des Standardwerts.

<!-- source: EN PDF p35; unit 264 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p35; unit 265 -->

Ein großer toleranceIn/Out-Wert beeinflusst sowohl die AE-Reaktionsgeschwindigkeit als auch die Wirkung von EvBias. Liegt der Anpassungsschritt von EvBias unter toleranceIn/Out, kann die Helligkeitsanpassung unwirksam bleiben.

<!-- source: EN PDF p35; unit 266 -->

###### 1.2.2.4   StrategyMode

<!-- source: EN PDF p35; unit 267 -->

【Beschreibung】

<!-- source: EN PDF p35; unit 268 -->

Automatische Belichtungsstrategie: Spitzlichtpriorität oder Schwachlichtpriorität.

<!-- source: EN PDF p35; unit 269 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p35; unit 270 -->

Dieser Parameter ist derzeit unwirksam.

<!-- source: EN PDF p35; unit 271 -->

###### 1.2.2.5   Route

<!-- source: EN PDF p35; unit 272 -->

【Beschreibung】

<!-- source: EN PDF p35; unit 273 -->

Strategieeigenschaften der Belichtungszerlegung. Die vom AE-Algorithmus berechnete Belichtung wird entlang der eingestellten Route verteilt. Je Anwendung kann die Route Belichtungszeitpriorität (Verschlusspriorität), Verstärkungspriorität oder Blendenpriorität verwenden.

<!-- source: EN PDF p35; unit 274 -->

【Felder】

<!-- source: EN PDF p36; unit 275 -->

LinearAE

<!-- source: EN PDF p36; unit 276 -->

| Feldname | Beschreibung |
| --- | --- |
| TimeDot | Belichtungszeitknoten in Sekunden |
| GainDot | Sensorverstärkungsknoten mit tatsächlichem Faktor in 1x |
| IspgainDot | ISO-Digitalverstärkungsknoten laut Quelle, tatsächlicher Faktor in 1x |
| PIrisDot | Äquivalenter Blendenverstärkungsknoten mit tatsächlichem Faktor in 1x |

<!-- source: EN PDF p36; unit 277 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p36; unit 278 -->

![Originalabbildung aus dem englischen PDF, Seite 36](/docs/rockchip-isp30-tuning/assets/en-p036-X449.png)

<!-- source: EN PDF p36; unit 279 -->

Abbildung 4-2 Belichtungszerlegung

<!-- source: EN PDF p36; unit 280 -->

Die Anzahl der Kurvenknoten ist nicht begrenzt. Mindestens 6 Knoten werden empfohlen, damit die Übergänge der Belichtungszerlegung gleichmäßig bleiben.

<!-- source: EN PDF p36; unit 281 -->

Die Belichtung eines Knotens ist das Produkt der Komponenten Belichtungszeit, Sensorverstärkung, digitaler ISP-Verstärkung und äquivalenter Blendenverstärkung. Die Knotenbelichtung muss monoton steigen: der nächste Knoten muss größer als der vorherige sein. Die Quelle nennt den ersten Knoten als Minimum und den zweiten als Maximum; dieser Widerspruch zur beliebigen Knotenzahl bleibt dokumentiert.

<!-- source: EN PDF p36; unit 282 -->

Die Belichtungszeitkomponente ist in Sekunden angegeben; minimal darf 0 eingetragen werden. Der Code korrigiert die tatsächliche Mindestzeit anhand der Sensorgrenze.

<!-- source: EN PDF p36; unit 283 -->

Die Blendenkomponente unterstützt nur P-Iris, nicht DC-Iris. Die äquivalente P-Iris-Verstärkung wirkt nur bei aktivierter Airis-Automatik; sonst bleibt die Blende auf dem Standardwert. Ihre Berechnung steht im AecIrisCtrl-Modul.

<!-- source: EN PDF p36; unit 284 -->

Die konfigurierte Zerlegungsroute ist noch nicht die endgültige Route. Endgültige Maximal-/Minimalwerte werden sowohl durch die Knoten als auch durch manuell konfigurierte Komponentengrenzen bestimmt. Zunächst unveränderte Knotengrenzen verwenden, sofern sie innerhalb der Sensor-/ISP-Grenzen liegen; andernfalls auf diese Hardwaregrenzen begrenzen (erste Korrektur). Sind manuell konfigurierte Maximal-/Minimalwerte 0, gilt diese erste Korrektur. Sind sie ungleich 0 und innerhalb der Hardwaregrenzen, die Route ein zweites Mal auf den manuell gesetzten Bereich begrenzen. Überschreiten die manuellen Werte die Sensor-/ISP-Grenzen, gilt für die betreffende Komponente das Ergebnis der ersten Korrektur. Zwischen benachbarten Knoten soll bei steigender Belichtung nur eine Komponente zunehmen, alle übrigen bleiben fest. Die zunehmende Komponente bestimmt die Priorität dieses Routenabschnitts: beispielsweise steigende Verstärkung bei sonst festen Komponenten bedeutet Verstärkungspriorität.

<!-- source: EN PDF p37; unit 285 -->

<!-- source: EN PDF p37; unit 286 -->

RK3588 unterstützt keine digitale ISP-Verstärkung; IspgainDot ist daher unwirksam.

<!-- source: EN PDF p37; unit 287 -->

###### 1.2.2.6   InitExp

<!-- source: EN PDF p37; unit 288 -->

【Beschreibung】

<!-- source: EN PDF p37; unit 289 -->

Anfangswerte des linearen Belichtungsmodus.

<!-- source: EN PDF p37; unit 290 -->

【Felder】

<!-- source: EN PDF p37; unit 291 -->

| Feldname | Beschreibung |
| --- | --- |
| InitTimeValue | Anfängliche Belichtungszeit in Sekunden |
| InitGainValue | Anfängliche Sensorverstärkung als tatsächlicher Faktor in 1x |
| InitIspDGainValue | Anfängliche digitale ISP-Verstärkung als tatsächlicher Faktor in 1x |
| InitPIrisGainValue | Anfängliche äquivalente P-Blendenverstärkung als tatsächlicher Faktor in 1x |
| InitDCIrisDutyValue | Anfänglicher DC-Blenden-Tastgrad, Bereich [0,100] |

<!-- source: EN PDF p37; unit 292 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p37; unit 293 -->

Sind keine anfänglichen automatischen Belichtungswerte gesetzt (alle Werte 0), gelten die Systemstandardwerte.

<!-- source: EN PDF p37; unit 294 -->

AE-Anfangswerte sind durch die Maximal-/Minimalwerte der Zerlegungskurve begrenzt. Über- beziehungsweise unterschreiten sie diese Grenzen, werden sie durch den entsprechenden Grenzwert ersetzt.

<!-- source: EN PDF p37; unit 295 -->

Anfängliche äquivalente P-Blendenverstärkung; nur bei P-Iris wirksam. Standard ist die äquivalente Verstärkung der größten unterstützten Blendenöffnung. Siehe IrisCtrl für die Bedeutung der äquivalenten Verstärkung.

<!-- source: EN PDF p37; unit 296 -->

Anfänglicher DC-Blenden-Tastgrad; nur bei DC-Iris wirksam. Standard ist MaxPwmValue, wodurch DC-Iris die Blende mit maximaler Geschwindigkeit öffnet. Tastgrad und MaxPwmValue werden in IrisCtrl erläutert.

<!-- source: EN PDF p37; unit 297 -->

RK3588 unterstützt keine digitale ISP-Verstärkung; InitIspDGainValue ist daher unwirksam.

<!-- source: EN PDF p38; unit 298 -->

###### 1.2.2.7   DySetpoint

<!-- source: EN PDF p38; unit 299 -->

【Beschreibung】

<!-- source: EN PDF p38; unit 300 -->

Dynamische Zielhelligkeit einstellen.

<!-- source: EN PDF p38; unit 301 -->

【Felder】

<!-- source: EN PDF p38; unit 302 -->

| Feldname | Beschreibung |
| --- | --- |
| ExpLevel | Dynamischer Belichtungsknoten mit aktuellem Belichtungswert. Knotenzahl unbegrenzt; mindestens 6 werden für gleichmäßige Übergänge empfohlen. |
| DySetpoint | Je größer der Belichtungsknotenwert, desto kleiner der Zielhelligkeitsknotenwert. Beide entsprechen einander eins zu eins. Knotenzahl unbegrenzt; mindestens 6 für gleichmäßige Übergänge empfohlen. |

<!-- source: EN PDF p38; unit 303 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p38; unit 304 -->

ExpLevel ist die aktuelle Belichtung, also (Curgain * Curtime).

<!-- source: EN PDF p38; unit 305 -->

Für einen festen Zielwert sämtliche DySetpoint-Knoten auf denselben Wert setzen.

<!-- source: EN PDF p38; unit 306 -->

DySetpoint möglichst gleichmäßig mit ExpLevel ändern, um Flimmern zu vermeiden.

<!-- source: EN PDF p38; unit 307 -->

###### 1.2.2.8   BackLightCtrl

<!-- source: EN PDF p38; unit 308 -->

【Beschreibung】

<!-- source: EN PDF p38; unit 309 -->

Gegenlichtkompensation hebt dunkle Bildbereiche bei Gegenlicht an, damit ihre Details sichtbar werden.

<!-- source: EN PDF p38; unit 310 -->

【Felder】

<!-- source: EN PDF p39; unit 311 -->

| Feldname | Beschreibung |
| --- | --- |
| Enable | Modulfreigabe: 1 ein, 0 aus. |
| MeasArea | Dunkelbereichserkennung mit 6 Modi: AECV2_MEASURE_AREA_AUTO/UP/BOTTOM/LEFT/RIGHT/CENTER. |
| LumaDistTh | Toleranz des Regionenwachstums |
| OEROILowTh | Minimale Helligkeit des überbelichteten Bereichs zur Abgrenzung von nicht überbelichteten Bereichen. |
| LvHighTh | Obere Umgebungshelligkeitsschwelle |
| LvLowTh | Untere Umgebungshelligkeitsschwelle |
| ExpLevel | Dynamische Belichtungsknoten, aktuelle Belichtung gain*time (Zeit in s). Knotenzahl unbegrenzt; mindestens 6 für gleichmäßige Übergänge empfohlen. |
| NonOEPdfHighTh | Anteilsschwelle nicht überbelichteter Flächen (0~1). Knotenzahl unbegrenzt; mindestens 6 empfohlen. Anzahl und Werte müssen ExpLevel eins zu eins entsprechen. |
| LowLightPdfTh | Dunkelbereichsanteilsschwelle (0~1). Knotenzahl unbegrenzt; mindestens 6 empfohlen. Anzahl und Werte müssen ExpLevel eins zu eins entsprechen. |
| TargetLLLuma | Dynamische Dunkelbereichszielwerte mit unbegrenzter Knotenzahl; mindestens 6 empfohlen. Anzahl und Werte entsprechen ExpLevel eins zu eins; mit steigendem ExpLevel abnehmend. |

<!-- source: EN PDF p39; unit 312 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p39; unit 313 -->

Zunächst den dunklen Gegenlichtbereich (Interessenbereich) bestimmen und dann durch höhere Belichtung aufhellen. MeasArea wählt aus sechs Modi: AUTO erkennt automatisch; UP, BOTTOM, LEFT, RIGHT und CENTER legen den dunklen Bereich manuell fest.

<!-- source: EN PDF p39; unit 314 -->

Bei MeasArea = AUTO werden dunkle Bereiche anhand der Unterfenster-Helligkeitsverteilung und Gegenlichtwahrscheinlichkeit gesucht. Letztere besteht vor allem aus Umgebungshelligkeitsfaktor Lv_fac, Dunkelbereichsanteil DarkPdf_fac und Kontrastfaktor Contrast_fac. Die zugehörigen Parameter folgen.

<!-- source: EN PDF p39; unit 315 -->

Umgebungshelligkeit Lv=meanluma/exp/1000 (exp=gain*time, Einheit:s).

<!-- source: EN PDF p40; unit 316 -->

LvHighTh: obere Umgebungshelligkeitsschwelle. Größere Werte erschweren, kleinere erleichtern das Auslösen der Gegenlichtkompensation. Sie trennt Innen- und Außenhelligkeit. Die Quelle empfiehlt unvollständig „LvHighTh=setpoint/“; kein Nenner wird ergänzt. Nur bei MeasArea = AUTO wirksam.

<!-- source: EN PDF p40; unit 317 -->

LvLowTh: untere Umgebungshelligkeitsschwelle. Größere Werte erschweren das Auslösen der Gegenlichtkompensation, kleinere erleichtern es. Sie trennt helle und dunkle Innenräume. Die Quelle empfiehlt auch hier unvollständig „LvHighTh=setpoint/“, obwohl der Absatz LvLowTh beschreibt. Nur bei MeasArea = AUTO wirksam.

<!-- source: EN PDF p40; unit 318 -->

Diese beiden Helligkeitsschwellen bestimmen den Umgebungshelligkeitsfaktor. LowLightPdfTh bestimmt den Dunkelbereichsanteilfaktor. Ein zu großer Anteil löst Gegenlichtkompensation leicht aus und kann Innenräume zu hell machen. Bei heller Umgebung wird ein Dunkelanteil innerhalb 20% empfohlen; mit sinkender Umgebungshelligkeit steigt dieser Anteil. Nur bei MeasArea = AUTO wirksam.

<!-- source: EN PDF p40; unit 319 -->

![Originalabbildung aus dem englischen PDF, Seite 40](/docs/rockchip-isp30-tuning/assets/en-p040-X461.png)

<!-- source: EN PDF p40; unit 320 -->

Abbildung 4-3 Gegenlichtbereich MeasArea

<!-- source: EN PDF p40; unit 321 -->

UP, BOTTOM, LEFT, RIGHT oder CENTER wählen den manuellen Modus. Liegt die Helligkeit des festgelegten Bereichs unter dessen Dunkelbereichszielwert, wird die Belichtung erhöht. Liegt sie darüber, gilt der Bereich nicht als dunkel beziehungsweise die Szene nicht als Gegenlicht; dann bestimmt die globale Helligkeit die Belichtungsänderung. Gegenlichtkompensation wirkt hier also nur unterhalb des Dunkelbereichszielwerts.

<!-- source: EN PDF p40; unit 322 -->

TargetLLLuma ist der Helligkeitszielwert des dunklen Bereichs. Er soll 50% des globalen Zielwerts nicht überschreiten; empfohlen sind 40%~50%, sonst kann die Gegenlichtszene zu hell werden. Der Parameter wirkt bei jedem MeasArea-Wert.

<!-- source: EN PDF p40; unit 323 -->

###### 1.2.2.9   OverExpCtrl

<!-- source: EN PDF p40; unit 324 -->

【Beschreibung】

<!-- source: EN PDF p40; unit 325 -->

Spitzlichtunterdrückung reduziert die Belichtung und damit die Überbelichtung des Bilds.

<!-- source: EN PDF p40; unit 326 -->

【Felder】

<!-- source: EN PDF p41; unit 327 -->

| Feldname | Beschreibung |
| --- | --- |
| Enable | Modulfreigabe: 1 ein, 0 aus. |
| HighLightTh | Helligkeitsschwelle heller Bereiche, Bereich [0,255]. |
| LowLightTh | Helligkeitsschwelle dunkler Bereiche, Bereich [0,255]. |
| MaxWeight | Maximales Gewicht |
| OEPdf | Überbelichtungsanteil, Bereich [0,1], von klein nach groß. Knotenzahl unbegrenzt; mindestens 6 für gleichmäßige Übergänge empfohlen. |
| HighLightWeight | Gewicht heller Bereiche, entsprechend den Überbelichtungsanteilsknoten; maximal durch MaxWeight begrenzt. Knotenzahl unbegrenzt, mindestens 6 für gleichmäßige Übergänge empfohlen. |
| LowLightWeight | Gewicht dunkler Bereiche, entsprechend den Überbelichtungsanteilsknoten; maximal durch MaxWeight begrenzt. Knotenzahl unbegrenzt, mindestens 6 für gleichmäßige Übergänge empfohlen. |

<!-- source: EN PDF p41; unit 328 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p41; unit 329 -->

HighLightTh trennt den Spitzlichtbereich oberhalb seiner Schwelle und verwendet dort HighLightWeight. LowLightTh trennt dunkle Bereiche unterhalb seiner Schwelle und verwendet LowLightWeight. Zwischen beiden Schwellen wird das Gewicht aus LowLightWeight und HighLightWeight interpoliert.

<!-- source: EN PDF p41; unit 330 -->

Größeres HighLightWeight verstärkt die Spitzlichtunterdrückung; größeres LowLightWeight schwächt sie. Empfohlen werden HighLightWeight im Bereich 1~4 und LowLightWeight im Bereich 0.7~1.

<!-- source: EN PDF p41; unit 331 -->

Spitzlichtunterdrückung in jeder Szene mit überbelichteten Flächen kann das Gesamtbild zu dunkel machen. HighLightWeight deshalb nicht zu groß wählen und mit steigendem Überbelichtungsanteil reduzieren, um übermäßige Unterdrückung und zu geringe Gesamthelligkeit zu vermeiden.

<!-- source: EN PDF p41; unit 332 -->

Bei aktivierter Spitzlichtunterdrückung zugleich lineares TMO aktivieren, damit dunkle Bereiche nicht zu dunkel werden.

<!-- source: EN PDF p42; unit 333 -->

##### 1.2.3   4.1.2.3 AEC-Parameter zur HDR-Belichtungsabstimmung

<!-- source: EN PDF p42; unit 334 -->

| Parametername | Parametertyp | Kurzbeschreibung |
| --- | --- | --- |
| ToleranceIn/Out | Abstimmparameter | Benutzer-Abstimmparameter |
| StrategyMode | Abstimmparameter | Benutzer-Abstimmparameter |
| EvBias | Abstimmparameter | Benutzer-Abstimmparameter |
| ExpRatioCtrl | Abstimmparameter | Benutzer-Abstimmparameter |
| Route | Abstimmparameter | Benutzer-Abstimmparameter |
| InitExp | Abstimmparameter | Benutzer-Abstimmparameter |
| LongFrmMode | Abstimmparameter | Benutzer-Abstimmparameter |
| LframeCtrl | Abstimmparameter | Benutzer-Abstimmparameter |
| MframeCtrl | Abstimmparameter | Benutzer-Abstimmparameter |
| SframeCtrl | Abstimmparameter | Benutzer-Abstimmparameter |

<!-- source: EN PDF p42; unit 335 -->

###### 1.2.3.1   ToleranceIn/Out

<!-- source: EN PDF p42; unit 336 -->

【Beschreibung】

<!-- source: EN PDF p42; unit 337 -->

Bildhelligkeitstoleranz, Einheit %, Bereich [0,100].

<!-- source: EN PDF p42; unit 338 -->

Bei konvergiertem AE soll die Bildhelligkeit B im Bereich [tatsächlich wirksame Zielhelligkeit X(1-tolerance/100), tatsächlich wirksame Zielhelligkeit X(1+Tolerance/100)] liegen.

<!-- source: EN PDF p42; unit 339 -->

ToleranceIn bezeichnet die Toleranz bei nicht konvergierter, ToleranceOut bei konvergierter Belichtung. ToleranceIn &lt; ToleranceOut wird empfohlen, um überempfindliche Reaktionen zu vermeiden und die Belichtung zu stabilisieren.

<!-- source: EN PDF p42; unit 340 -->

###### 1.2.3.2   StrategyMode

<!-- source: EN PDF p42; unit 341 -->

【Beschreibung】

<!-- source: EN PDF p42; unit 342 -->

Automatische Belichtungsstrategie: Spitzlicht- oder Schwachlichtpriorität.

<!-- source: EN PDF p42; unit 343 -->

【Felder】

<!-- source: EN PDF p42; unit 344 -->

Spitzlichtpriorität: AECV2_STRATEGY_MODE_HIGHLIGHT_PRIOR

<!-- source: EN PDF p42; unit 345 -->

Schwachlichtpriorität: AECV2_STRATEGY_MODE_LOWLIGHT_PRIOR

<!-- source: EN PDF p42; unit 346 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p42; unit 347 -->

Das Verhalten hängt vom Belichtungsverhältnismodus ab; siehe ExpRatioCtrl.

<!-- source: EN PDF p43; unit 348 -->

###### 1.2.3.3   EvBias

<!-- source: EN PDF p43; unit 349 -->

【Beschreibung】

<!-- source: EN PDF p43; unit 350 -->

Prozentuale Belichtungsabweichung bei automatischer Anpassung, Einheit %, Bereich [-200, +200]. Passt die Zielhelligkeit für besondere Szenen an. Tatsächlich wirksame Zielhelligkeit = Zielwert X [1+abs(EvBias)/100]^[EvBias/abs(EvBias)]. Die Quellformel bleibt unverändert.

<!-- source: EN PDF p43; unit 351 -->

Bei EvBias=100 verdoppelt sich die Zielhelligkeit gegenüber dem Standard; bei EvBias=-100 beträgt sie 1/2 des Standardwerts.

<!-- source: EN PDF p43; unit 352 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p43; unit 353 -->

Ein großer toleranceIn/Out-Wert beeinflusst sowohl die AE-Reaktionsgeschwindigkeit als auch die Wirkung von EvBias. Liegt der Anpassungsschritt von EvBias unter toleranceIn/Out, kann die Helligkeitsanpassung unwirksam bleiben.

<!-- source: EN PDF p43; unit 354 -->

###### 1.2.3.4   InitExp

<!-- source: EN PDF p43; unit 355 -->

【Beschreibung】

<!-- source: EN PDF p43; unit 356 -->

Anfangswerte des HDR-Belichtungsmodus einstellen.

<!-- source: EN PDF p43; unit 357 -->

【Felder】

<!-- source: EN PDF p43; unit 358 -->

| Feldname | Beschreibung |
| --- | --- |
| InitTimeValue | Anfängliche Belichtungszeit in Sekunden |
| InitGainValue | Anfängliche Sensorverstärkung als tatsächlicher Faktor in 1x |
| InitIspDGainValue | Anfängliche digitale ISP-Verstärkung als tatsächlicher Faktor in 1x |
| InitPIrisGainValue | Anfängliche äquivalente P-Blendenverstärkung als tatsächlicher Faktor in 1x |
| InitDCIrisDutyValue | Anfänglicher DC-Blenden-Tastgrad, Bereich [0,100] |

<!-- source: EN PDF p43; unit 359 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p43; unit 360 -->

Sind keine anfänglichen automatischen Belichtungswerte gesetzt (alle Werte 0), gelten die Systemstandardwerte.

<!-- source: EN PDF p43; unit 361 -->

AE-Anfangswerte sind durch die Maximal-/Minimalwerte der Zerlegungskurve begrenzt. Über- beziehungsweise unterschreiten sie diese Grenzen, werden sie durch den entsprechenden Grenzwert ersetzt.

<!-- source: EN PDF p43; unit 362 -->

Einige Sensoren benötigen besondere HDR-Anfangswerte. Beispielsweise muss die anfängliche Kurzframe-Belichtung bei os04a10 unter 0.005s liegen.

<!-- source: EN PDF p43; unit 363 -->

Anfängliche äquivalente P-Blendenverstärkung; nur für P-Iris wirksam. Standard ist die äquivalente Verstärkung der größten unterstützten Blendenöffnung. Siehe AecIrisCtrl für deren Bedeutung.

<!-- source: EN PDF p44; unit 364 -->

Anfänglicher DC-Blenden-Tastgrad; nur bei DC-Iris wirksam. Standard ist MaxPwmValue, wodurch DC-Iris die Blende mit maximaler Geschwindigkeit öffnet. Tastgrad und MaxPwmValue werden in AecIrisCtrl erläutert.

<!-- source: EN PDF p44; unit 365 -->

RK3588 unterstützt keine digitale ISP-Verstärkung; InitIspDGainValue ist daher unwirksam.

<!-- source: EN PDF p44; unit 366 -->

###### 1.2.3.5   Route

<!-- source: EN PDF p44; unit 367 -->

【Beschreibung】

<!-- source: EN PDF p44; unit 368 -->

Strategieeigenschaften der Belichtungszerlegung. Die vom AE-Algorithmus berechnete Belichtung wird entlang der eingestellten Route verteilt. Je Anwendung kann die Route Belichtungszeitpriorität (Verschlusspriorität), Verstärkungspriorität oder Blendenpriorität verwenden.

<!-- source: EN PDF p44; unit 369 -->

【Felder】

<!-- source: EN PDF p44; unit 370 -->

| Feldname | Beschreibung |
| --- | --- |
| Frm0/1/2TimeDot | Belichtungszeitknoten in Sekunden. Bei HDR mit 2 Frames nur Frm0/1TimeDot, bei 3 Frames Frm0/1/2TimeDot wirksam. Die Quelle nennt FRM0~3 als Reihenfolge von kurzer zu langer Belichtung. |
| Frm0/1/2GainDot | Sensorverstärkungsknoten als tatsächlicher Faktor in 1x. Bei HDR mit 2 Frames Frm0/1GainDot, bei 3 Frames Frm0/1/2GainDot wirksam. Die Quelle nennt FRM0~3 als Reihenfolge von kurzer zu langer Belichtung. |
| Frm0/1/2IspDGainDot | Digitale ISP-Verstärkungsknoten als tatsächlicher Faktor in 1x. Bei HDR mit 2 Frames Frm0/1IspDGainDot, bei 3 Frames Frm0/1/2IspDGainDot wirksam. Die Quelle nennt FRM0~3 als Reihenfolge von kurzer zu langer Belichtung. |
| PIrisDot | Äquivalenter Blendenverstärkungsknoten mit tatsächlichem Faktor in 1x. |

<!-- source: EN PDF p44; unit 371 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p44; unit 372 -->

![Originalabbildung aus dem englischen PDF, Seite 44](/docs/rockchip-isp30-tuning/assets/en-p044-X449.png)

<!-- source: EN PDF p44; unit 373 -->

Abbildung 4-2 Belichtungszerlegung

<!-- source: EN PDF p44; unit 374 -->

Die Anzahl der Belichtungszerlegungsknoten ist nicht begrenzt. Für gleichmäßige Übergänge werden mindestens 6 Knoten empfohlen.

<!-- source: EN PDF p45; unit 375 -->

Bei HDR mit 2 Frames Frm0/1TimeDot, Frm0/1GainDot und Frm0/1IspDGainDot für kurze und lange Frames setzen. Bei 3 Frames entsprechen Frm0/1/2TimeDot, Frm0/1/2GainDot und Frm0/1/2IspDGainDot kurzen, mittleren und langen Frames. Die Sensorbelichtungszeiten sinnvoll aufteilen: ihre Summe darf die durch die Bildrate erlaubte maximale Belichtungszeit nicht überschreiten!

<!-- source: EN PDF p45; unit 376 -->

Die Belichtung eines Knotens ist das Produkt der Komponenten Belichtungszeit, Sensorverstärkung, digitaler ISP-Verstärkung und äquivalenter Blendenverstärkung. Die Knotenbelichtung muss monoton steigen: der nächste Knoten muss größer als der vorherige sein. Die Quelle nennt den ersten Knoten als Minimum und den zweiten als Maximum; dieser Widerspruch zur beliebigen Knotenzahl bleibt dokumentiert.

<!-- source: EN PDF p45; unit 377 -->

Die Belichtungszeitkomponente ist in Sekunden angegeben; minimal darf 0 eingetragen werden. Der Code korrigiert die tatsächliche Mindestzeit anhand der Sensorgrenze.

<!-- source: EN PDF p45; unit 378 -->

Die Blendenkomponente unterstützt nur P-Iris, nicht DC-Iris. Die äquivalente P-Iris-Verstärkung wirkt nur bei aktivierter Airis-Automatik; sonst bleibt die Blende auf dem Standardwert. Ihre Berechnung steht im AecIrisCtrl-Modul.

<!-- source: EN PDF p45; unit 379 -->

Die konfigurierte Zerlegungsroute ist noch nicht endgültig. Die wirksamen Maximal-/Minimalwerte hängen sowohl von Knoten als auch manuellen Komponentengrenzen ab. Zuerst Knotengrenzen unverändert lassen, soweit sie innerhalb der Sensor-/ISP-Grenzen liegen; andernfalls auf diese Grenzen begrenzen (erste Korrektur). Bei manuell konfigurierten Werten von 0 gilt diese erste Korrektur. Bei Werten ungleich 0 innerhalb der Hardwaregrenzen erfolgt eine zweite Korrektur auf den manuell gesetzten Bereich. Überschreiten manuelle Werte die Hardwaregrenzen, gilt für die betreffende Komponente das erste Korrekturergebnis.

<!-- source: EN PDF p45; unit 380 -->

Zwischen benachbarten Knoten soll bei steigender Belichtung nur eine Komponente zunehmen, die übrigen bleiben fest. Die zunehmende Komponente bestimmt die Verteilungsstrategie: steigende Verstärkung bei sonst festen Komponenten bedeutet Verstärkungspriorität.

<!-- source: EN PDF p45; unit 381 -->

RK3588 unterstützt derzeit keine digitale ISP-Verstärkung; Frm0/1/2ispDGainDot sind unwirksam.

<!-- source: EN PDF p45; unit 382 -->

###### 1.2.3.6   ExpRatioCtrl

<!-- source: EN PDF p45; unit 383 -->

【Beschreibung】

<!-- source: EN PDF p45; unit 384 -->

Steuermodul des HdrAE-Belichtungsverhältnisses.

<!-- source: EN PDF p45; unit 385 -->

【Felder】

<!-- source: EN PDF p46; unit 386 -->

| Feldname | Beschreibung |
| --- | --- |
| ExpRatioType | Belichtungsverhältnismodus; nur bei HDR-Mehrframe-Zusammenführung wirksam. AUTO berechnet das Lang-/Kurzframe-Verhältnis szenenabhängig, FIX verwendet ein festes Verhältnis. |
| RatioExpDot | Belichtungsknoten zur dynamischen Vorgabe des festen oder maximalen Verhältnisses; eins zu eins zugeordnet. Knotenzahl unbegrenzt, mindestens 6 für gleichmäßige Übergänge empfohlen. |
| M2SRatioFix | Festes Mittel-/Kurzframe-Verhältnis bei ExpRatioType = FIX, bei AUTO unwirksam. Werte entsprechen RatioExpDot eins zu eins. Gleiche Knotenzahl erforderlich; unbegrenzt, mindestens 6 empfohlen. |
| L2MRatioFix | Festes Lang-/Mittelframe-Verhältnis bei ExpRatioType = FIX; bei AUTO und 2-Frame-HDR unwirksam, bei 3 Frames wirksam. Entspricht RatioExpDot eins zu eins. Gleiche Knotenzahl erforderlich; unbegrenzt, mindestens 6 empfohlen. |
| M2SRatioMax | Dynamisches maximales Mittel-/Kurzframe-Verhältnis bei ExpRatioType = AUTO, bei FIX unwirksam. Entspricht RatioExpDot eins zu eins. Gleiche Knotenzahl erforderlich; unbegrenzt, mindestens 6 empfohlen. |
| L2MRatioMax | Dynamisches maximales Lang-/Mittelframe-Verhältnis bei ExpRatioType = AUTO; bei FIX und 2-Frame-HDR unwirksam, bei 3 Frames wirksam. Entspricht RatioExpDot eins zu eins. Gleiche Knotenzahl erforderlich; unbegrenzt, mindestens 6 empfohlen. |

<!-- source: EN PDF p46; unit 387 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p46; unit 388 -->

Bei ExpRatioType = AUTO wird das Verhältnis automatisch bestimmt. Bei 2 Frames begrenzt M2SratioMax das maximale Verhältnis langer zu kurzen Frames; bei 3 Frames begrenzt M2SratioMax das Verhältnis mittlerer zu kurzen und L2MratioMax das Verhältnis langer zu mittleren Frames. Ein gesondertes Minimum ist nicht begrenzt, darf aber nicht unter 1 liegen. Bei ExpRatioType = FIX gilt ein festes Verhältnis: bei 2 Frames M2SRatioFix für lang/kurz, bei 3 Frames M2SRatioFix für mittel/kurz und L2MratioFix für lang/mittel.

<!-- source: EN PDF p46; unit 389 -->

Bei automatischem Verhältnis und 2-Frame-HDR bestimmt StrategyMode die Priorität, wenn das berechnete Verhältnis M2SratioMax überschreitet. HIGHLIGHT_PRIOR sichert die Kurzframe-Belichtung: Langframe-Belichtung = Kurzframe-Belichtung * M2SratioMax. LOWLIGHT_PRIOR sichert die Langframe-Belichtung: Kurzframe-Belichtung = Langframe-Belichtung/M2SratioMax. Bei 3 Frames gilt entsprechend Vorrang für kürzere beziehungsweise längere Frames; die Quelle schreibt hier auch LOWLIGHT _PRIOR. Bei festem Verhältnis und 2 Frames berechnet HIGHLIGHT_PRIOR den langen Frame aus dem kurzen: Lang = Kurz * M2SRatioFix; LOWLIGHT_PRIOR berechnet den kurzen aus dem langen: Kurz = Lang / M2SRatioFix. Entsprechend bei 3 Frames; die Quelle nennt dies im letzten Satz „3 fps HDR mode“.

<!-- source: EN PDF p47; unit 390 -->

<!-- source: EN PDF p47; unit 391 -->

###### 1.2.3.7   LongFrmMode

<!-- source: EN PDF p47; unit 392 -->

【Beschreibung】

<!-- source: EN PDF p47; unit 393 -->

HdrAE-Funktionssteuerung des Langframe-Modus.

<!-- source: EN PDF p47; unit 394 -->

【Felder】

<!-- source: EN PDF p47; unit 395 -->

| Feldname | Beschreibung |
| --- | --- |
| Mode | Langframe-Modi: NORMAL, AUTO_LONGFRAME, LONGFRAME. NORMAL: AE und HDR-Zusammenführung arbeiten mit manuellem/automatischem Verhältnis. AUTO_LONGFRAME: oberhalb der Belichtungsschwelle nähert sich die Langframe-Zeit dem erlaubten Maximum für 1 Frame; nur lange Frames werden ausgegeben. LONGFRAME: AE minimiert die Kurzframe-Zeit und nähert die Langframe-Zeit dem Maximum für 1 Frame; nur lange Frames werden ausgegeben. |
| SfrmMinLine | Minimale Kurzframe-Belichtungszeilen im Langframe-/automatischen Langframe-Modus. Sensorbeschränkungen können hier ein Erreichen des gewöhnlichen Sensorminimums verhindern; daher separat einstellen. |
| LfrmModeExpTh | Im automatischen Langframe-Modus bei Langframe-Belichtung über LfrmModeExpTh in Langframe-Modus wechseln. |

<!-- source: EN PDF p47; unit 396 -->

###### 1.2.3.8   LframeCtrl

<!-- source: EN PDF p47; unit 397 -->

【Beschreibung】

<!-- source: EN PDF p47; unit 398 -->

Abstimmparameter langer Frames. Bei 2-Frame-HdrAE muss der lange Frame sowohl normalen Dynamikumfang als auch Gegenlicht abdecken. Daher gelten zwei Helligkeitsbedingungen: globaler Zielwert und Dunkelbereichszielwert. Neben globaler Helligkeit innerhalb ihrer Toleranz muss die Dunkelbereichshelligkeit mindestens den Dunkelbereichszielwert erreichen.

<!-- source: EN PDF p47; unit 399 -->

【Felder】

<!-- source: EN PDF p48; unit 400 -->

| Feldname | Beschreibung |
| --- | --- |
| OEROILowTh | Minimale Helligkeit des überbelichteten Bereichs zur Abgrenzung von nicht überbelichteten Bereichen. |
| LvHighTh | Obere Umgebungshelligkeitsschwelle |
| LvLowTh | Untere Umgebungshelligkeitsschwelle |
| LExpLevel | Knotenzahl unbegrenzt, mindestens 6 für gleichmäßige Übergänge empfohlen. ExpLevel =gain*time (Zeit in s). |
| LSetPoint | Anzahl und Werte der Knoten müssen LExpLevel eins zu eins entsprechen. |
| NonOEPdfHighTh | Anteilsschwelle nicht überbelichteter Flächen (0~1); Anzahl und Werte der Knoten müssen LExpLevel eins zu eins entsprechen. |
| LowLightPdfTh | Anzahl und Werte der Knoten müssen LExpLevel eins zu eins entsprechen und mit steigendem ExpLevel zunehmen. |
| TargetLLLuma | Dynamische Dunkelbereichsziele des langen Frames; Anzahl und Werte entsprechen LExpLevel eins zu eins und nehmen mit steigendem ExpLevel ab. |

<!-- source: EN PDF p48; unit 401 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p48; unit 402 -->

Umgebungshelligkeit Lv=meanluma/exp/1000 (exp=gain*time, Einheit:s).

<!-- source: EN PDF p48; unit 403 -->

LvHighTh: obere Umgebungshelligkeitsschwelle. Größere Werte erschweren, kleinere erleichtern Gegenlichtkompensation. Sie trennt Innen- und Außenhelligkeit. Die Quelle empfiehlt unvollständig „LvHighTh=setpoint/“; kein Nenner wird ergänzt.

<!-- source: EN PDF p48; unit 404 -->

LvLowTh: untere Umgebungshelligkeitsschwelle. Größere Werte erschweren, kleinere erleichtern Gegenlichtkompensation. Sie trennt helle und dunkle Innenräume. Die Quelle empfiehlt auch hier unvollständig „LvHighTh=setpoint/“; weder Feldname noch fehlender Nenner werden stillschweigend korrigiert.

<!-- source: EN PDF p48; unit 405 -->

Die obere und untere Umgebungshelligkeitsschwelle bestimmen den Umgebungshelligkeitsfaktor.

<!-- source: EN PDF p48; unit 406 -->

LowLightPdfTh bestimmt den Dunkelbereichsanteilfaktor. Ein zu großer Anteil löst Gegenlichtkompensation leicht aus und kann Innenräume zu hell machen. Bei heller Umgebung wird ein Dunkelanteil innerhalb 20% empfohlen; mit sinkender Umgebungshelligkeit steigt dieser Anteil.

<!-- source: EN PDF p48; unit 407 -->

Der Dunkelbereichszielwert soll 50% des globalen Zielwerts nicht überschreiten; empfohlen sind 40%~50%, sonst kann das Gegenlichtbild zu hell werden.

<!-- source: EN PDF p49; unit 408 -->

###### 1.2.3.9   MframeCtrl

<!-- source: EN PDF p49; unit 409 -->

【Beschreibung】

<!-- source: EN PDF p49; unit 410 -->

Abstimmparameter mittlerer Frames; nur bei 3-Frame-HDR wirksam.

<!-- source: EN PDF p49; unit 411 -->

【Felder】

<!-- source: EN PDF p49; unit 412 -->

| Feldname | Beschreibung |
| --- | --- |
| MExpLevel | Dynamische Belichtungsknoten mittlerer Frames. Knotenzahl unbegrenzt, mindestens 6 für gleichmäßige Übergänge empfohlen. ExpLevel = gain*time (Zeit in s). |
| MSetPoint | Globale Zielhelligkeit des dynamischen mittleren Frames. Anzahl und Werte entsprechen MExpLevel eins zu eins. Mit steigender Belichtung sinkt der Zielwert. |

<!-- source: EN PDF p49; unit 413 -->

###### 1.2.3.10   SframeCtrl

<!-- source: EN PDF p49; unit 414 -->

【Beschreibung】

<!-- source: EN PDF p49; unit 415 -->

Abstimmparameter kurzer Frames.

<!-- source: EN PDF p49; unit 416 -->

【Felder】

<!-- source: EN PDF p49; unit 417 -->

| Feldname | Beschreibung |
| --- | --- |
| SExpLevel | Dynamische maximale Belichtungsknoten kurzer Frames. Knotenzahl unbegrenzt, mindestens 6 für gleichmäßige Übergänge empfohlen. ExpLevel = gain*time (Zeit in s). |
| SSetPoint | Globale mittlere Zielhelligkeit dynamischer kurzer Frames; Anzahl entsprechend dem Zielwert und Werte laut Quelle eins zu eins zu MExpLevel. Die Zielhelligkeit heller Bereiche desselben Intervalls muss höher als die entsprechende globale Zielhelligkeit sein. Der MExpLevel-Verweis bleibt unverändert. |
| TargetHLLuma | Mittlerer Zielwert der Spitzlichtbereiche dynamischer kurzer Frames; Anzahl und Werte laut Quelle eins zu eins zu MExpLevel. Der Quellverweis bleibt unverändert. |
| HLLumaTolerance | Zielhelligkeitstoleranz kurzer Spitzlicht-Frames in %. |
| HLROIExpandEn | Erweiterung der Kurzframe-Spitzlichtbereiche: 1 ignoriert kleine Spitzlichtflächen und senkt die Empfindlichkeit; 0 unterdrückt die Helligkeit aller Spitzlichtbereiche und erhöht die Empfindlichkeit. |

<!-- source: EN PDF p50; unit 418 -->

##### 1.2.4   4.1.2.4 AEC-Parameter zur Blendenabstimmung

<!-- source: EN PDF p50; unit 419 -->

IrisCtrl

<!-- source: EN PDF p50; unit 420 -->

【Beschreibung】

<!-- source: EN PDF p50; unit 421 -->

Blendensteuerparameter

<!-- source: EN PDF p50; unit 422 -->

【Felder】

<!-- source: EN PDF p50; unit 423 -->

| Feldname | Beschreibung |
| --- | --- |
| Enable | Automatische Blendensteuerung aktivieren |
| IrisType | Blendentyp: P (P-iris) oder DC (DC-iris). |
| ManualEn | Manuelle Blende aktivieren |
| InitAttr | Blendenanfangsparameter |
| DCIrisAttr | DC-Blendensteuerparameter |

<!-- source: EN PDF p50; unit 424 -->

ManualAttr

<!-- source: EN PDF p50; unit 425 -->

| Feldname | Beschreibung |
| --- | --- |
| PIrisGainValue | Manuelle äquivalente P-Blendenverstärkung als tatsächlicher Faktor in 1x; durch das P-Blendengerät begrenzt, Bereich [1,1024]. |
| DCIrisHoldValue | Manueller DC-Blenden-HoldValue; geräteabhängig, Bereich [0,100]. |

<!-- source: EN PDF p50; unit 426 -->

InitAttr

<!-- source: EN PDF p50; unit 427 -->

| Feldname | Beschreibung |
| --- | --- |
| PIrisGainValue | Anfängliche äquivalente P-Blendenverstärkung als tatsächlicher Faktor in 1x; durch das P-Blendengerät begrenzt, Bereich [1,1024]. |
| DCIrisHoldValue | DC-Blenden-HoldValue; geräteabhängig, Bereich [0,100]. |

<!-- source: EN PDF p50; unit 428 -->

PIrisAttr

<!-- source: EN PDF p51; unit 429 -->

| Feldname | Beschreibung |
| --- | --- |
| TotalStep | Gesamtschrittzahl des P-Iris-Schrittmotors; objektivabhängig. |
| EffcStep | Nutzbare Schrittzahl des P-Iris-Schrittmotors; objektivabhängig. |
| ZeroIsMax | Zuordnung von step0 zur größten Blendenöffnung; objektivabhängig. 0: step0 bedeutet kleinste Öffnung; 1: step0 bedeutet größte Öffnung. |
| StepTable | Zuordnungstabelle zwischen P-Iris-Schrittmotorposition und äquivalenter Blendenverstärkung; objektivabhängig. |

<!-- source: EN PDF p51; unit 430 -->

DCIrisAttr

<!-- source: EN PDF p52; unit 431 -->

| Feldname | Beschreibung |
| --- | --- |
| Kp | Proportionalfaktor zur Begrenzung abrupter Änderungen der Blendenöffnungs-/Schließgeschwindigkeit. Größere Werte verlangsamen diese Änderungen. Zu groß führt zu vorzeitigem Bremsen und langer Regelzeit; zu klein zu verspätetem Bremsen und Überschwingen. Einstellung abhängig von DC-Iris-Objektiv und Schaltung. Empfohlen 0.5, Bereich [0,1]. |
| Ki | Integralkoeffizient der Öffnungs-/Schließgeschwindigkeit. Die Quelle schreibt hier „the larger the aperture“; ob ein größerer Ki-Wert gemeint ist, bleibt zu prüfen. Zu groß verursacht leicht Überschwingen und Schwingungen; zu klein kann bei langsamer Blendenregelung und abrupten Helligkeitsänderungen ebenfalls Schwingungen verursachen. Empfohlen 0.2, Bereich [0,1]. |
| Kd | Differentialkoeffizient der Öffnungs-/Schließgeschwindigkeit. Größere Werte erhöhen die Geschwindigkeit. Empfohlen 0.3, Bereich [0,1]. |
| MinPwmDuty | Minimaler PWM-Tastgrad in %, abhängig von DC-Iris-Objektiv und Schaltung. Kleinere Werte schließen schneller, können aber Schwingungen verursachen. Bereich [0,100], Standard 0. |
| MaxPwmDuty | Maximaler PWM-Tastgrad in %, abhängig von Objektiv und Schaltung. Größere Werte öffnen schneller; zu kleine können die Regelung vor Erreichen der größten Öffnung beenden. Bereich [0,100], Standard 100. |
| OpenPwmDuty | PWM-Öffnungsschwelle: oberhalb, nicht einschließlich OpenPwmDuty öffnet die Blende. Objektivabhängig, Einheit %, Bereich [0,100]. |
| ClosePwmDuty | PWM-Schließschwelle: unterhalb, nicht einschließlich ClosePwmDuty schließt die Blende. Objektivabhängig, Einheit %, Bereich [0,100]. |

<!-- source: EN PDF p52; unit 432 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p52; unit 433 -->

Bei ausgeschalteter automatischer Blende öffnet DC-iris standardmäßig maximal; P-iris fährt die Motorposition der größten Öffnung an. Zum Ändern PIrisGainValue und DCIrisHoldValue in InitAttr anpassen.

<!-- source: EN PDF p52; unit 434 -->

ManualIrisEn aktiviert die manuelle Blendensteuerung. Bei IrisType = P-Blende wirkt nur PirisGainValue; bei DC-Blende nur DCIrisHoldValue.

<!-- source: EN PDF p52; unit 435 -->

DCIrisHoldValue setzt im manuellen Modus den Motor-PWM-Tastgrad direkt, Bereich [0,100]. Innerhalb ClosePwmDuty bis OpenPwmDuty bleibt die DC-Blende unverändert. Oberhalb OpenPwmDuty öffnet sie; größere Werte erhöhen die Öffnungsgeschwindigkeit. Unterhalb ClosePwmDuty schließt sie; kleinere Werte erhöhen die Schließgeschwindigkeit.

<!-- source: EN PDF p53; unit 436 -->

Grundlegender Steuerablauf des automatischen Airis-Algorithmus:

<!-- source: EN PDF p53; unit 437 -->

Bei DC-iris regelt Airis die Blende anhand der Abweichung zwischen aktueller und Zielhelligkeit. Ist die minimale Belichtung erreicht und liegt die Helligkeit über dem Ziel-Toleranzbereich, wird AE verlassen; Belichtungszeit und Verstärkung werden festgehalten und AIRIS übernimmt. Ist die Bildhelligkeit stabil und der DC-iris-PWM-Tastgrad größer als OpenPwmDuty, gilt die größte Öffnung als erreicht. Airis beendet die Blendensteuerung und übergibt an AE.

<!-- source: EN PDF p53; unit 438 -->

P-iris wird über AecRoute gesteuert. Die Blendenöffnung wird in äquivalente Verstärkung umgerechnet und in der Belichtungszerlegung berücksichtigt.

<!-- source: EN PDF p53; unit 439 -->

StepTable ordnet P-Iris-Motorpositionen äquivalenten Blendenverstärkungen zu, gewöhnlich anhand der Herstellerzuordnung zwischen Motorposition und Blendenöffnung. Da AecRoute die Öffnung als äquivalente Verstärkung verarbeitet, muss die P-Iris-Steuerung gute Linearität besitzen. Bereich [1,1024]: F1.0 entspricht 1024, F1.4 entspricht 512 und entsprechend F32.0 entspricht 1. Die jeder Motorposition zugeordnete Öffnung in äquivalente Verstärkung umrechnen und in Reihenfolge step0, step1 ... stepN in StepTable eintragen.

<!-- source: EN PDF p53; unit 440 -->

TotalStep ist die objektivabhängige Gesamtschrittzahl des P-Iris-Motors. EffcStep ist die nutzbare, gewöhnlich kleinere Schrittzahl. Nahe der geschlossenen Endlage ist die äquivalente Verstärkung stärker fehlerbehaftet und die Regelung neigt zu Schwingungen; deshalb diese Positionen üblicherweise nicht verwenden.

<!-- source: EN PDF p53; unit 441 -->

Tabelle 4-1 ordnet P-Iris-Motorpositionen Blendenflächen und äquivalente Verstärkungen zu und dient als StepTable-Beispiel. Spalten 1–2 und 4–5 stammen von einem Objektivhersteller. Das Objektiv besitzt insgesamt 81 Schritte; step0 ist die größte Öffnung mit Nennblende 1.4. Diese entspricht Verstärkung 512, also hat step0 den Wert 512. Beispiel step3: Fläche 195.869; äquivalente Verstärkung = 512* (195.869/201.062)=499 (gerundet). Andere Positionen analog berechnen. Die Quelle verweist anschließend auf „Table 1-1“: Nahe der geschlossenen Endlage sind die Flächen sehr klein, teils um Tausende gegenüber dem Maximum verschieden, und Verstärkungsfehler groß. Solche Positionen deshalb zur Vermeidung von Belichtungsschwingungen nicht verwenden. Die Werte in Positionsreihenfolge step0, step1 ... stepN in StepTable eintragen.

<!-- source: EN PDF p53; unit 442 -->

OpenPwmDuty und ClosePwmDuty müssen am jeweiligen DC-Iris-Objektiv gemessen werden. Die Quelle beschreibt Öffnen oberhalb OpenPwmDuty und zunächst Schließen unterhalb OpenPwmDuty; zugleich beschreibt sie den stabilen HoldValue-Bereich von einschließlich ClosePwmDuty bis einschließlich OpenPwmDuty. Dieser widersprüchliche Schließgrenzwert bleibt dokumentiert, statt ihn still zu ersetzen. Manche Objektive besitzen nur eine Schwelle: darüber öffnen, darunter schließen, genau darauf halten. Dann ClosePwmDuty = OpenPwmDuty = HoldValue setzen.

<!-- source: EN PDF p54; unit 443 -->

<!-- source: EN PDF p54; unit 444 -->

Tabelle 4-1 Zuordnung von P-Iris-Motorposition, Blendenfläche und äquivalenter Verstärkung

<!-- source: EN PDF p55; unit 445 -->

| Schritt | Blendenfläche<br>(mm2) | Äquivalente<br>Verstärkung | Schritt | Blendenfläche<br>(mm2) | Äquivalente<br>Verstärkung |
| --- | --- | --- | --- | --- | --- |
| 0 | 201.062 | 512 | 41 | 56.653 | 144 |
| 1 | 200.759 | 511 | 42 | 53.438 | 136 |
| 2 | 198.583 | 506 | 43 | 50.282 | 128 |
| 3 | 195.869 | 499 | 44 | 47.188 | 120 |
| 4 | 192.879 | 491 | 45 | 44.159 | 112 |
| 5 | 189.677 | 483 | 46 | 41.197 | 105 |
| 6 | 186.293 | 474 | 47 | 38.307 | 98 |
| 7 | 182.744 | 465 | 48 | 35.49 | 90 |
| 8 | 179.035 | 456 | 49 | 32.751 | 83 |
| 9 | 175.271 | 446 | 50 | 30.093 | 77 |
| 10 | 171.484 | 437 | 51 | 27.519 | 70 |
| 11 | 167.681 | 427 | 52 | 25.034 | 64 |
| 12 | 163.865 | 417 | 53 | 22.642 | 58 |
| 13 | 160.036 | 408 | 54 | 20.347 | 52 |
| 14 | 156.198 | 398 | 55 | 18.154 | 46 |
| 15 | 152.351 | 388 | 56 | 16.068 | 41 |
| 16 | 148.499 | 378 | 57 | 14.096 | 36 |
| 17 | 144.642 | 368 | 58 | 12.245 | 31 |
| 18 | 140.783 | 359 | 59 | 10.522 | 27 |
| 19 | 136.925 | 349 | 60 | 8.935 | 23 |
| 20 | 133.069 | 339 | 61 | 7.484 | 19 |
| 21 | 129.217 | 329 | 62 | 6.169 | 16 |
| 22 | 125.371 | 319 | 63 | 4.987 | 13 |
| 23 | 121.535 | 309 | 64 | 3.936 | 10 |
| 24 | 117.709 | 300 | 65 | 3.014 | 8 |
| 25 | 113.897 | 290 | 66 | 2.22 | 6 |
| 26 | 110.1 | 280 | 67 | 1.55 | 4 |
| 27 | 106.321 | 271 | 68 | 1.003 | 3 |
| 28 | 102.562 | 261 | 69 | 0.577 | 1 |

<!-- source: EN PDF p56; unit 446 -->

| Schritt | Blendenfläche<br>(mm2) | Äquivalente<br>Verstärkung | Schritt | Blendenfläche<br>(mm2) | Äquivalente<br>Verstärkung |
| --- | --- | --- | --- | --- | --- |
| 29 | 98.826 | 252 | 70 | 0.268 | 1 |
| 30 | 95.115 | 242 | 71 | 0.075 | 0 |
| 31 | 91.431 | 233 | 72 | geschlossen | 0 |
| 32 | 87.777 | 224 | 73 | geschlossen | 0 |
| 33 | 84.156 | 214 | 74 | geschlossen | 0 |
| 34 | 80.569 | 205 | 75 | geschlossen | 0 |
| 35 | 77.02 | 196 | 76 | geschlossen | 0 |
| 36 | 73.51 | 187 | 77 | geschlossen | 0 |
| 37 | 70.043 | 178 | 78 | geschlossen | 0 |
| 38 | 66.621 | 170 | 79 | geschlossen | 0 |
| 39 | 63.247 | 161 | 80 | geschlossen | 0 |
| 40 | 59.923 | 153 |  |  |  |

<!-- source: EN PDF p56; unit 447 -->

##### 1.2.5   4.1.2.5 Parameter des AEC-Synchronitätstests

<!-- source: EN PDF p56; unit 448 -->

SyncTest

<!-- source: EN PDF p56; unit 449 -->

【Beschreibung】

<!-- source: EN PDF p56; unit 450 -->

Der Synchronitätstest für Belichtung und Statistik setzt zyklisch N Gruppen verschiedener Belichtungswerte in vorgegebenen Frameabständen. Damit prüfen, ob Belichtungszeit, Sensorverstärkung und Wirksamkeitsframe der DCG-Umschaltung korrekt sind. Er kann auch die Belichtungslinearität prüfen und dadurch die Registerumrechnungsformeln und zugehörigen Zeit-/Verstärkungsparameter bestätigen.

<!-- source: EN PDF p56; unit 451 -->

【Felder】

<!-- source: EN PDF p56; unit 452 -->

| Feldname | Beschreibung |
| --- | --- |
| Enable | Synchronitätstest für Belichtung und Statistik aktivieren |
| IntervalFrm | Frameabstand zwischen Belichtungswechseln |
| AlterExp | Belichtungswechselparameter |

<!-- source: EN PDF p56; unit 453 -->

AlterExp

<!-- source: EN PDF p56; unit 454 -->

Je Modus gibt es zwei Parametersätze: LinearAE und HdrAE.

<!-- source: EN PDF p57; unit 455 -->

| Feldname | Beschreibung |
| --- | --- |
| TimeValue | Belichtungszeitwert |
| GainValue | Belichtungsverstärkungswert |
| IspDgainValue | Digitale ISP-Verstärkung |
| DcgMode | DCG-Moduswert |
| PIrisGainValue | Äquivalente P-Iris-Verstärkung |

<!-- source: EN PDF p57; unit 456 -->

##### 1.2.6   4.1.2.5 sensorinfo-Parameter

<!-- source: EN PDF p57; unit 457 -->

| Parametername | Parametertyp | Kurzbeschreibung |
| --- | --- | --- |
| Gain2Reg | CIS-Treiberparameter | CIS-Datenblatt maßgeblich; keine Abstimmparameter. |
| Time2Reg | CIS-Treiberparameter | Nach CIS-Datenblatt; kein Abstimmparameter. Gewöhnlich Standardwert unverändert lassen. |
| CISGainSet | CIS-Treiberparameter | CIS-Datenblatt maßgeblich; keine Abstimmparameter. |
| CISTimeSet | CIS-Treiberparameter | CIS-Datenblatt maßgeblich; keine Abstimmparameter. |
| CISHdrSet | CIS-Treiberparameter | CIS-Datenblatt maßgeblich; keine Abstimmparameter. |
| CISDcgSet | CIS-Treiberparameter | CIS-Datenblatt maßgeblich; keine Abstimmparameter. |
| CISExpUpdate | CIS-Treiberparameter | CIS-Datenblatt maßgeblich; keine Abstimmparameter. |
| CISMinFps | CIS-Treiberparameter | Gewöhnlich Standardwert; für niedrigere Bildrate anpassbar. |
| CISFlip | Abstimmparameter | Benutzer-Abstimmparameter: Flip und Spiegelung entsprechend der Produktanwendung. |

<!-- source: EN PDF p57; unit 458 -->

sensorinfo wird von Treiberentwicklern oder Abstimmungspersonal ausgefüllt und liefert belichtungsbezogene CIS-Informationen für die Abstimmung. Vorher die Übereinstimmung mit dem Sensordatenblatt bestätigen; andernfalls drohen Belichtungsflimmern oder fehlerhafte HDR-Ergebnisse.

<!-- source: EN PDF p58; unit 459 -->

###### 1.2.6.1   Gain2Reg

<!-- source: EN PDF p58; unit 460 -->

【Beschreibung】

<!-- source: EN PDF p58; unit 461 -->

Konfiguration der Umrechnung von Sensorverstärkung in Registerwerte. Herstellerabhängig ist die Formel linear (einschließlich abschnittsweise linear und invers proportional) oder nichtlinear. Nichtlinear betrifft vor allem Hersteller wie Sony; derzeit wird nur die Verstärkungsumrechnung im dB-Modus unterstützt.

<!-- source: EN PDF p58; unit 462 -->

【Felder】

<!-- source: EN PDF p58; unit 463 -->

| Feldname | Beschreibung |
| --- | --- |
| GainMode | Verstärkungsumrechnungsmodus: EXPGAIN_MODE_NONLINEAR_DB nichtlinear, EXPGAIN_MODE_LINEAR linear. |
| GainRange | Lineare Verstärkungsumrechnung mit abschnittsweiser Linearität; wirksam bei GainMode = EXPGAIN_MODE_LINEAR. |

<!-- source: EN PDF p58; unit 464 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p58; unit 465 -->

Sensorverstärkung in der Registerformel bedeutet Gesamtverstärkung = again*dgain. Unterscheiden sich die Umrechnungen von again und dgain, ist abschnittsweise Konfiguration möglich; die Größen entsprechend dem gezeigten Beispiel anpassen.

<!-- source: EN PDF p58; unit 466 -->

Die lineare Umrechnung der Sensorverstärkung in Registerwerte besteht aus 3 Koeffizienten (M0, C0, C1):

<!-- source: EN PDF p58; unit 467 -->

Umrechnungsformel für den Treiber: reg = (gain^M0)*C1 - C0+ 0.5

<!-- source: EN PDF p58; unit 468 -->

Zuordnung der XML-Parameter:

<!-- source: EN PDF p58; unit 469 -->

Erste Spalte: Beginn des Verstärkungsintervalls; zweite: Ende; dritte: C1; vierte: C0;

<!-- source: EN PDF p58; unit 470 -->

<!-- source: EN PDF p58; unit 471 -->

fünfte: M0; sechste: Registerwert des Intervallbeginns; siebte: Registerwert des Intervallendes.

<!-- source: EN PDF p58; unit 472 -->

<!-- source: EN PDF p58; unit 473 -->

Bei GainMode = EXPGAIN_MODE_NONLINEAR_DB die nichtlineare Sensorverstärkungsumrechnung verwenden; derzeit wird nur dB unterstützt. Formel: reg = 20xlog10(gain)x10/3. Sie muss nicht eingetragen werden; der Algorithmus verwendet sie standardmäßig.

<!-- source: EN PDF p58; unit 474 -->

Bei Sensoren mit DCG und linearer Umrechnung die LCG-Verstärkungsformel in GainRange eintragen.

<!-- source: EN PDF p58; unit 475 -->

【Beispiel】

<!-- source: EN PDF p58; unit 476 -->

s5kgm1sp

<!-- source: EN PDF p58; unit 477 -->

s5kgm1sp verwendet unterschiedliche Analog- und Digitalverstärkungsformeln, siehe Abbildungen 4-3 und 4-4. Der Analogregisterwert ist 32-mal, der Digitalregisterwert 256-mal die jeweilige Verstärkung.

<!-- source: EN PDF p59; unit 478 -->

![Originalabbildung aus dem englischen PDF, Seite 59](/docs/rockchip-isp30-tuning/assets/en-p059-X517.png)

Analogverstärkung: `gain = x / 0x20`. Beim S5KGM1ST03 gilt sie global, nicht je Kanal. `gain = x / 32`; unterstützt bis X16.

<!-- source: EN PDF p59; unit 479 -->

Abbildung 4-3 Beispiel der Analogverstärkungs-Registerumrechnung

<!-- source: EN PDF p59; unit 480 -->

![Originalabbildung aus dem englischen PDF, Seite 59](/docs/rockchip-isp30-tuning/assets/en-p059-X518.png)

Die grobe SMIA-Verstärkungsregisterschnittstelle unterstützt Bruchteile in Einheiten von 1/256. Vier Parameter steuern die vier Bayer-Kanäle separat. Bei Anwendung digitaler Verstärkung die entstehenden LSB(s) mit Nullen auffüllen. Tabelle 15: Beispiele digitaler Verstärkung.

| Verstärkungswert | Registerwert api_rw_digital_gain_code_XXX |
| --- | --- |
| X1 | 0x0100 |
| X2 | 0x0200 |
| X3 | 0x0300 |
| X8 | 0x0800 |
| X16 | 0x1000 |

<!-- source: EN PDF p59; unit 481 -->

Abbildung 4-4 Beispiel der Digitalverstärkungs-Registerumrechnung

<!-- source: EN PDF p59; unit 482 -->

s5kgm1sp unterstützt maximal 16X analog und 16X digital; Gesamtverstärkung = again*dgain. Bei Total gain &lt;=16X wirkt again, dgain=1X. Bei Total gain &gt; 16X bleibt again = 16X und dgain wirkt. Deshalb die Umrechnung getrennt für Gesamtverstärkung [1,16] und [16,256] konfigurieren:

<!-- source: EN PDF p59; unit 483 -->

[1.0000 16.0000 32.0000 0.0000 1.0000 32.0000 512.0000 16.0000 256.0000 16.0000 -512.0000 1.0000 768.0000 4608.0000 ]

<!-- source: EN PDF p59; unit 484 -->

Im Gesamtverstärkungsintervall [16,256] bleibt analog 16X (a_reg=16x32=512). Digital gilt d_reg = dgain x 256. Daraus reg=a_reg+d_reg = 512 + Total gain /16 x 256 = 512 + Total gain x 16; also M0=1, C0=-512, C1=16. Den von der Anwendung ausgegebenen Gesamtverstärkungsregisterwert reg wie folgt aufteilen:

<!-- source: EN PDF p59; unit 485 -->

```c
  if(reg <= 0x200){
      a_reg = reg;
      d_reg = 0x0100;
  }else{
      a_reg = 0x200;
      d_reg = reg-0x200;
  }
```

<!-- source: EN PDF p59; unit 486 -->

###### 1.2.6.2   Time2Reg

<!-- source: EN PDF p59; unit 487 -->

【Beschreibung】

<!-- source: EN PDF p59; unit 488 -->

Die Umrechnung der Sensorbelichtungszeit in Register-Belichtungszeilen besteht aus vier Koeffizienten (C0, C1, C2, C3).

<!-- source: EN PDF p59; unit 489 -->

Formel: line = C0*VTS + C1 + C2 * (time * pclk / HTS + C3). XML-Reihenfolge: C0, C1, C2, C3. Umgekehrt ergibt sich die Belichtungszeit:

<!-- source: EN PDF p60; unit 490 -->

Time = ((line - C0 x vts - C1) / C2 - C3)*hts/pclk

<!-- source: EN PDF p60; unit 491 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p60; unit 492 -->

Standardkoeffizienten: 0, 0, 1, 0.5. Die resultierende Belichtungszeilenzahl steigt in Schritten von 1 Zeile. Normalerweise nicht ändern.

<!-- source: EN PDF p60; unit 493 -->

###### 1.2.6.3   CISGainSet

<!-- source: EN PDF p60; unit 494 -->

【Beschreibung】

<!-- source: EN PDF p60; unit 495 -->

CIS-bezogene Verstärkungseinstellungen

<!-- source: EN PDF p60; unit 496 -->

【Felder】

<!-- source: EN PDF p60; unit 497 -->

| Feldname | Beschreibung |
| --- | --- |
| CISAgainRange | Minimale/maximale Sensor-Analog-/LCG-Verstärkung; Minimum mindestens 1. Bei Dual Conversion Gain ist dies der unterstützte LCG-Bereich. Wird digitale Verstärkung zur Präzisionsergänzung verwendet, kann dies den Gesamtverstärkungsbereich angeben. |
| CISExtraAgainRange | Minimale/maximale Sensor-Analogverstärkung im HCG-Modus, Minimum mindestens 1. Bei Dual Conversion Gain ist dies der HCG-Bereich. Üblicherweise CISAgainRange * dcg_ratio; Ausnahmen wie ov2718 nach Herstellerdatenblatt. Ohne Dual Conversion Gain unwirksam; zur Referenz Minimum und Maximum jeweils 1 eintragen. |
| CISDgainRange | Unterstützter digitaler Sensorverstärkungsbereich, mindestens 1. Wird Digitalverstärkung zur Präzisionsergänzung verwendet, 1 eintragen. |
| CISIspDgainRange | Digitaler ISP-Verstärkungsbereich, Minimum mindestens 1. Die Quelle nennt hier 356x als derzeit ohne ISP-Digitalverstärkung; Minimum und Maximum jeweils 1 eintragen. Die abweichende Plattformnennung bleibt erhalten. |
| CISHdrGainIndSetEn | Unabhängige Verstärkungen mehrerer HDR-Frames: 0 gemeinsame Verstärkung, etwa GC2093; 1 unabhängig einstellbar. Nur für HDR STAGGER, nicht HDR DCG wirksam. |

<!-- source: EN PDF p61; unit 498 -->

###### 1.2.6.4   CISTimeSet

<!-- source: EN PDF p61; unit 499 -->

【Beschreibung】

<!-- source: EN PDF p61; unit 500 -->

CIS-Belichtungszeiteinstellungen gliedern sich in Linear und HDR; HDR wiederum in Konfigurationen für 2 oder 3 Frames.

<!-- source: EN PDF p61; unit 501 -->

【Felder】

<!-- source: EN PDF p62; unit 502 -->

| Feldname | Beschreibung |
| --- | --- |
| CISLinTimeRegMaxFac | Im linearen Modus Beziehung zwischen maximalen Belichtungszeilen und VTS mit (C0, C1). Die umgebrochene Quellformel lautet MaxTimeLine = C0*vts – C1; konkrete Koeffizienten nach Datenblatt. |
| CISHdrTimeRegSumFac | Im HDR-Modus Beziehung der Summe maximaler Mehrframe-Belichtungszeiten zu VTS mit (C0, C1). Quelle: MaxTimeLineSum = C0vts – C1; das fehlende Multiplikationszeichen wird nicht als validierte Formel ergänzt. Koeffizienten nach Datenblatt. |
| CISTimeRegMin | Ganzzahliges Minimum der Sensorbelichtungszeilen (Registerwert) im linearen/HDR-Modus. |
| CISTimeRegOdevity | Parität der Belichtungszeilen im linearen/HDR-Modus: Line = C0*x+C1. Keine Begrenzung: C0=1 C1=0; ungerade: C0=2 C1=1; gerade: C0=2 C1=0; ganzzahliges Vielfaches von N: C0=N C1=0. |
| CISTimeRegUnEqualEn | Gleichheit der Belichtungszeilen je HDR-Frame (S/M/L): En=0 erlaubt gleiche Zeiten; En=1 erlaubt sie nicht. |
| CISTimeRegMax | Maximal erlaubte ganzzahlige HDR-Sensorbelichtungszeilen (Registerwert). 3 Elemente: bei HDR2 die ersten 2 für kurz/lang, bei HDR3 alle für kurz/mittel/lang. Üblicherweise keine Einzelgrenze; dann 0 eintragen (die Quelle schreibt 0**). Bei ungleich 0 gilt der Parameter. Beispiel IMX307: Kurzframe maximal 222 Zeilen, Langframe unbegrenzt; [222 0 0]. |

<!-- source: EN PDF p63; unit 503 -->

###### 1.2.6.5   CISTimeSet

<!-- source: EN PDF p63; unit 504 -->

【Beschreibung】

<!-- source: EN PDF p63; unit 505 -->

CIS-Belichtungszeiteinstellungen gliedern sich in Linear und HDR; HDR wiederum in Konfigurationen für 2 oder 3 Frames.

<!-- source: EN PDF p63; unit 506 -->

【Felder】

<!-- source: EN PDF p64; unit 507 -->

| Feldname | Beschreibung |
| --- | --- |
| CISLinTimeRegMaxFac | Im linearen Modus Beziehung zwischen maximalen Belichtungszeilen und VTS mit (C0, C1). Die umgebrochene Quellformel lautet MaxTimeLine = C0*vts – C1; konkrete Koeffizienten nach Datenblatt. |
| CISHdrTimeRegSumFac | Im HDR-Modus Beziehung der Summe maximaler Mehrframe-Belichtungszeiten zu VTS mit (C0, C1). Quelle: MaxTimeLineSum = C0vts – C1; das fehlende Multiplikationszeichen wird nicht als validierte Formel ergänzt. Koeffizienten nach Datenblatt. |
| CISTimeRegMin | Ganzzahliges Minimum der Sensorbelichtungszeilen (Registerwert) im linearen/HDR-Modus. |
| CISTimeRegOdevity | Parität der Belichtungszeilen im linearen/HDR-Modus: Line = C0*x+C1. Keine Begrenzung: C0=1 C1=0; ungerade: C0=2 C1=1; gerade: C0=2 C1=0; ganzzahliges Vielfaches von N: C0=N C1=0. |
| CISTimeRegUnEqualEn | Gleichheit der Belichtungszeilen je HDR-Frame (S/M/L): En=0 erlaubt gleiche Zeiten; En=1 erlaubt sie nicht. |
| CISTimeRegMax | Maximal erlaubte ganzzahlige HDR-Sensorbelichtungszeilen (Registerwert). 3 Elemente: bei HDR2 die ersten 2 für kurz/lang, bei HDR3 alle für kurz/mittel/lang. Üblicherweise keine Einzelgrenze; dann 0 eintragen (die Quelle schreibt 0**). Bei ungleich 0 gilt der Parameter. Beispiel IMX307: Kurzframe maximal 222 Zeilen, Langframe unbegrenzt; [222 0 0]. |

<!-- source: EN PDF p65; unit 508 -->

###### 1.2.6.6   CISHdrSet

<!-- source: EN PDF p65; unit 509 -->

【Beschreibung】

<!-- source: EN PDF p65; unit 510 -->

Einstellungen des HDR-Modus

<!-- source: EN PDF p65; unit 511 -->

【Felder】

<!-- source: EN PDF p65; unit 512 -->

| Feldname | Beschreibung |
| --- | --- |
| Enable | HDR-Freigabe: 0 nicht unterstützt, 1 unterstützt. |
| Support_mode | Vier HDR-Frame-Modi: MODE_2_LINE/MODE_3_LINE, MODE_2_FRAME/MODE_3_FRAME. |
| Line_mode | HDR-Line_mode unterstützt derzeit DCG und STAGGER. DOL entspricht STAGGER und wird einheitlich als STAGGER bezeichnet. |

<!-- source: EN PDF p65; unit 513 -->

###### 1.2.6.7   CISDcgSet

<!-- source: EN PDF p65; unit 514 -->

【Beschreibung】

<!-- source: EN PDF p65; unit 515 -->

Parameter der Dual-Conversion-Gain-Funktion für linearen und HDR-Modus. Das Modul steuert DCG-Umschaltung und setzt einen Sensor voraus, der diese Konfiguration unterstützt. Schaltet der Sensor DCG intern selbst um, muss das Modul ausgeschaltet sein.

<!-- source: EN PDF p65; unit 516 -->

【Felder】

<!-- source: EN PDF p65; unit 517 -->

| Feldname | Beschreibung |
| --- | --- |
| Support_en | Dual Conversion Gain unterstützen: 1 Modulparameter wirksam, 0 Funktion nicht unterstützt. |
| dcg_optype | Umschaltmodus: RK_AIQ_OP_MODE_AUTO schaltet LCG/HCG schwellenabhängig; RK_AIQ_OP_MODE_MANUAL schaltet nicht automatisch, sondern verwendet dcgmode_init. |
| dcgmode_init | Anfänglicher Dual-Conversion-Gain-Modus je Frame |
| dcg_ratio | Conversion-Gain-Wert |
| sync_switch | Synchrone Umschaltung, nur bei HDR: 1 alle Frames synchron gemäß langem Frame; 0 unabhängig. |
| gain_ctrl | Dual Conversion Gain anhand der Belichtungsverstärkung umschalten. lcg2hcg_th: LCG→HCG-Schwelle; hcg2lcg_th: HCG→LCG-Schwelle. |

<!-- source: EN PDF p65; unit 518 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p66; unit 519 -->

Dieses Modul steuert DCG-Umschaltung und setzt einen Sensor voraus, der die Umschaltkonfiguration unterstützt. Schaltet der Sensor intern selbst um, das Modul ausschalten.

<!-- source: EN PDF p66; unit 520 -->

Bei HDR-DCG bleibt der kurze Frame LCG und der lange HCG. Daher dcg_optype auf MANUAL setzen: bei 2 Frames dcgmode_init = [0 1 0], bei 3 Frames dcgmode_init = [0 0 1].

<!-- source: EN PDF p66; unit 521 -->

Unterstützt der Sensor kein Dual Conversion Gain, dcg_ratio auf 1 setzen.

<!-- source: EN PDF p66; unit 522 -->

###### 1.2.6.8   CISExpUpdate

<!-- source: EN PDF p66; unit 523 -->

【Beschreibung】

<!-- source: EN PDF p66; unit 524 -->

Parameter des Wirksamkeitszeitpunkts der Belichtung; gewöhnlich aus dem Sensordatenblatt. Da normale und HDR-Modi unterschiedliche Wirksamkeitsframes haben können, je Modus separat eintragen.

<!-- source: EN PDF p66; unit 525 -->

【Felder】

<!-- source: EN PDF p66; unit 526 -->

| Feldname | Beschreibung |
| --- | --- |
| time_update | Wirksamkeitsframe der Sensorbelichtungszeit |
| gain_update | Wirksamkeitsframe der Sensorverstärkung |
| dcg_update | Wirksamkeitsframe des Dual-Conversion-Gain-Modus |

<!-- source: EN PDF p66; unit 527 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p66; unit 528 -->

Diese Werte müssen dem Sensordatenblatt entsprechen und dürfen nicht beliebig gesetzt werden. Falsche Werte können beim Belichtungswechsel Flimmern verursachen.

<!-- source: EN PDF p66; unit 529 -->

Das Sensordatenblatt nennt gewöhnlich die Wirksamkeitsframes von Belichtungszeit und Verstärkung. Werden beide in Frame n geschrieben und wirken in n+2, gilt time_delay = 2 und gain_delay = 2, entsprechend für andere Verzögerungen.

<!-- source: EN PDF p66; unit 530 -->

Bei manchen Sensoren werden Zeit und Verstärkung in unterschiedlichen Frames wirksam. Falsche Parameter können beide während der Anpassung desynchronisieren und Flimmern verursachen.

<!-- source: EN PDF p66; unit 531 -->

###### 1.2.6.9   CISMinFps

<!-- source: EN PDF p66; unit 532 -->

【Beschreibung】

<!-- source: EN PDF p66; unit 533 -->

Minimal erlaubte Bildrate bei automatischer Bildratenabsenkung; verhindert zu niedrige Bildrate und störendes Nachziehen bei Schwachlicht.

<!-- source: EN PDF p66; unit 534 -->

###### 1.2.6.10   CISFlip

<!-- source: EN PDF p66; unit 535 -->

【Beschreibung】

<!-- source: EN PDF p66; unit 536 -->

Ausrichtung des Sensorausgabebilds steuern.

<!-- source: EN PDF p67; unit 537 -->

Bit 0: Spiegelungssteuerung.

<!-- source: EN PDF p67; unit 538 -->

Bit 1: vertikale Umkehrung (Flip).

<!-- source: EN PDF p67; unit 539 -->

##### 1.2.7   4.1.2.5 moduleinfo-Parameter

<!-- source: EN PDF p67; unit 540 -->

【Beschreibung】

<!-- source: EN PDF p67; unit 541 -->

Modulinformationen, gewöhnlich aus dem Moduldatenblatt.

<!-- source: EN PDF p67; unit 542 -->

【Felder】

<!-- source: EN PDF p67; unit 543 -->

| Feldname | Beschreibung |
| --- | --- |
| FNumber | Relative Objektivblende des Moduls; objektivabhängig, nicht abzustimmen. |
| EFL | Brennweite des Modulobjektivs; objektivabhängig, nicht abzustimmen. |
| LensTavg | Objektivtransmission; objektivabhängig, nicht abzustimmen. |
| IRCutTavg | IRCut-Transmission; objektivabhängig, nicht abzustimmen. |

<!-- source: EN PDF p67; unit 544 -->

【Vorsichtsmaßnahmen】

<!-- source: EN PDF p67; unit 545 -->

Diese Parameter sind derzeit unwirksam.

<!-- source: EN PDF p67; unit 546 -->

#### 1.3   4.1.3 Abstimmungsschritte

<!-- source: EN PDF p67; unit 547 -->

AEC-Abstimmung umfasst Zielhelligkeit, Belichtungszerlegungsroute, Gewichte und Konvergenzgeschwindigkeit. Vor ISP-Abstimmung korrekte Sensortreiberfunktion und CIS-Belichtungsparameter bestätigen, um falsche Belichtung zu vermeiden.

<!-- source: EN PDF p67; unit 548 -->

Vor AEC außerdem Kalibrierung und Funktion von BLC, AWB, LSC und CCM sicherstellen; Gamma kann Standardkurven verwenden.

<!-- source: EN PDF p67; unit 549 -->

###### 1.3.0.1   Schritt 1: Sensorbelichtungsparameter einstellen

<!-- source: EN PDF p67; unit 550 -->

Wie in 4.1.2 beschrieben müssen SensorInfo-Parameter vor der Abstimmung stimmen, sonst drohen falsche Belichtung und Flimmern. Sie stammen aus dem Originalsensordatenblatt und benötigen sorgfältige Prüfung durch Abstimmungs- und Treiberverantwortliche. Danach SyncTest aktivieren. Durch zyklische N Gruppen verschiedener Belichtungswerte lassen sich Belichtungszeit, Verstärkung und DCG-Wirksamkeitsframes sowie Belichtungslinearität prüfen und dadurch Registerumrechnung und zugehörige Parameter bestätigen.

<!-- source: EN PDF p67; unit 551 -->

Wurden die Parameter bereits vor der Kalibrierung bestätigt, kann dieser Schritt entfallen.

<!-- source: EN PDF p68; unit 552 -->

###### 1.3.0.2   Schritt 2: AE-Gewichte einstellen

<!-- source: EN PDF p68; unit 553 -->

AEC erfasst Histogramme und blockweise Helligkeit. Das Bild wird gleichmäßig in NXN Blöcke mit individuellen Gewichten aufgeteilt. Interessenbereiche erhalten höhere Gewichte; deshalb hängt die Tabelle von der Anwendung ab. Bei IPC liegt das Hauptmotiv meist in der Mitte: Mitte höher, Umgebung niedriger gewichten. Bei CVR liegt es meist im mittleren/unteren Straßenbereich: dort höhere, im oberen Himmelsbereich niedrigere Gewichte verwenden.

<!-- source: EN PDF p68; unit 554 -->

![Originalabbildung aus dem englischen PDF, Seite 68](/docs/rockchip-isp30-tuning/assets/en-p068-X550.png)

Editierbare Übertragung des ursprünglichen 15×15-AecGridWeight-Beispiels (225 Werte).

```xml
<AecGridWeight index="1" type="double" size="[15 15]">
  [0 1 1 1 1 1 1 1 1 1 1 1 1 1 0
   1 2 2 2 2 2 2 2 2 2 2 2 2 2 1
   1 2 5 5 5 5 5 5 5 5 5 5 5 2 1
   1 2 5 8 8 8 8 8 8 8 8 8 5 2 1
   1 2 5 8 10 10 10 10 10 10 10 8 5 2 1
   1 2 5 8 10 13 13 13 13 13 10 8 5 2 1
   1 2 5 8 10 13 15 15 15 13 10 8 5 2 1
   1 2 5 8 10 13 15 15 15 13 10 8 5 2 1
   1 2 5 8 10 13 15 15 15 13 10 8 5 2 1
   1 2 5 8 10 13 13 13 13 13 10 8 5 2 1
   1 2 5 8 10 10 10 10 10 10 10 8 5 2 1
   1 2 5 8 8 8 8 8 8 8 8 8 5 2 1
   1 2 5 5 5 5 5 5 5 5 5 5 5 2 1
   1 2 2 2 2 2 2 2 2 2 2 2 2 2 1
   0 1 1 1 1 1 1 1 1 1 1 1 1 1 0]
</AecGridWeight>
```

<!-- source: EN PDF p68; unit 555 -->

Abbildung 4-5 AEC-Gewichte

<!-- source: EN PDF p68; unit 556 -->

Manche Chips unterstützen mehr Helligkeitsblöcke. Zur einfacheren Abstimmung verwendet die Datei einheitlich 15X15 Gewichte; der Algorithmus erweitert sie entsprechend der tatsächlichen Blockzahl.

<!-- source: EN PDF p68; unit 557 -->

###### 1.3.0.3   Schritt 3: AE-Belichtungszerlegung einstellen

<!-- source: EN PDF p68; unit 558 -->

Die berechnete Belichtung muss auf Sensorbelichtungszeit, Sensorverstärkung, digitale ISP-Verstärkung und Blende zerlegt werden. Die Komponenten werden den jeweiligen Modulen zugewiesen und erzeugen gemeinsam die gewünschte Helligkeit. AecRoute steuert die Zerlegung; siehe 4.1.2. Verschiedene Szenen benötigen verschiedene Routen: tagsüber meist Zeit begrenzen und Verstärkung bevorzugen, um Bewegungsnachziehen zu vermeiden; nachts zuerst Zeit, dann Verstärkung erhöhen, um Signal-Rausch-Verhältnis und Nachthelligkeit zu verbessern.

<!-- source: EN PDF p68; unit 559 -->

###### 1.3.0.4   Schritt 4: AE-Zielhelligkeit einstellen

<!-- source: EN PDF p68; unit 560 -->

Im linearen Modus wird dynamische Zielhelligkeit für unterschiedliche Szenen empfohlen. Betroffen sind DySetpoint, ToleranceIn/ToleranceOut, BackLightCtrl und OverExpCtrl; siehe 4.1.2. In statischen Innenraumszenen soll das Bild passen und keine großflächige Überbelichtung zeigen. Beim Wechsel von hell zu dunkel soll die Helligkeit gleichmäßig übergehen.

<!-- source: EN PDF p69; unit 561 -->

<!-- source: EN PDF p69; unit 562 -->

Bei HDR hängen die Abstimmungsschritte von Verhältnis-Modus und StrategyMode ab. Die Zielhelligkeit im Parameterbereich des entsprechenden Frames anpassen: LSetPoint und TargetLLLuma sind globales beziehungsweise Dunkelbereichsziel des langen Frames; MSetPoint ist globales Ziel des mittleren; SSetPoint und TargetHLLuma sind globales beziehungsweise Spitzlichtziel des kurzen Frames. Siehe 4.1.2.

<!-- source: EN PDF p69; unit 563 -->

###### 1.3.0.5   Schritt 5: AE-Konvergenz und Reaktion einstellen

<!-- source: EN PDF p69; unit 564 -->

AE-Konvergenz- und Reaktionsgeschwindigkeit bestimmen Reaktionszeit, Konvergenz und Gleichmäßigkeit. Betroffen sind AecRunInterval, AecSpeed und AecDelayFrmNum; siehe 4.1.2. In statischen Innenraumszenen durch Lichtschalten abrupte Wechsel und Konvergenz prüfen. Schnellere Konvergenz kann bei langsamen Helligkeitsänderungen ungleichmäßige Übergänge oder Überschwingen verursachen; entsprechend abwägen.

<!-- source: EN PDF p69; unit 565 -->

### 2.   4.2 Rauschunterdrückung und Schärfung

<!-- source: EN PDF p69; unit 566 -->

Die ISP-Rauschunterdrückung besteht aus vier Modulen: Bayernr 2D, Bayernr 3D, YNR und CNR.

<!-- source: EN PDF p69; unit 567 -->

Die ISP-Schärfung besteht aus dem SHARP-Modul.

<!-- source: EN PDF p69; unit 568 -->

![Originalabbildung aus dem englischen PDF, S. 69](/docs/rockchip-isp30-tuning/assets/en-p069-X556.png)

<!-- source: EN PDF p69; unit 569 -->

Blockdiagramm der NR-Pipeline

<!-- source: EN PDF p69; unit 570 -->

Die Rauschabstimmung sollte in Reihenfolge der Pipeline erfolgen. Berücksichtigen Sie bei jedem Modul die Wechselwirkungen mit vorherigen und nachfolgenden Stufen sowie deren Gesamtwirkung.

<!-- source: EN PDF p69; unit 571 -->

Prüfen Sie bei der Abstimmung die Wirkung jedes einzelnen Schritts, um dessen Beitrag zur Rauschunterdrückung zu verstehen.

<!-- source: EN PDF p69; unit 572 -->

Zur Beurteilung von Bayernr2D vergleichen Sie das ungefilterte Original mit einer Variante, in der ausschließlich Bayernr2D aktiviert ist.

<!-- source: EN PDF p69; unit 573 -->

Zur Beurteilung von YNR vergleichen Sie die Bayernr3D-Ausgabe mit einem Bild nach YNR bei deaktiviertem SHARP.

<!-- source: EN PDF p69; unit 574 -->

Gehen Sie für die weiteren Stufen entsprechend vor.

<!-- source: EN PDF p70; unit 575 -->

Die RV1106-Pipeline unterscheidet sich von RK3588 wie folgt:

<!-- source: EN PDF p70; unit 576 -->

1: Bayer3DNR liegt vor Bayer2DNR.

<!-- source: EN PDF p70; unit 577 -->

2: BayE3D Gain von Bayer3DNR steuert unterschiedliche Bayer2DNR-Rauschunterdrückungsstärken für bewegte und stationäre Bereiche.

<!-- source: EN PDF p70; unit 578 -->

3: YNR, CNR und SHARP verwenden anhand des Local-Gain-Moduls unterschiedliche Stärken für bewegte und stationäre Bereiche.

<!-- source: EN PDF p70; unit 579 -->

#### 2.1   4.2.1 Bayer2dnr

<!-- source: EN PDF p70; unit 580 -->

##### 2.1.1   4.2.1.1 Funktionsbeschreibung

<!-- source: EN PDF p70; unit 581 -->

Bayernr 2D dient hauptsächlich der räumlichen Rauschunterdrückung von RAW-Daten. Das Modul erkennt den HDR-Modus und passt die Stärke so an, dass lange und kurze HDR-Frames gleichzeitig entrauscht werden.

<!-- source: EN PDF p70; unit 582 -->

Für die Abstimmung muss die Rauschvarianz der RAW-Daten kalibriert werden, um die entsprechenden Kalibrierdaten zu erhalten.

<!-- source: EN PDF p70; unit 583 -->

Auf Grundlage dieser Daten bildet das Modul ein Rauschmodell, das den tatsächlichen Rauscheigenschaften besser entspricht.

<!-- source: EN PDF p70; unit 584 -->

Es werden getrennte Rauschkalibrierungen und Parameter für hohen und niedrigen Signal-Rausch-Abstand unterstützt.

<!-- source: EN PDF p70; unit 585 -->

Beispielsweise verwendet ein CIS mit Dual Conversion Gain (DCG) High Conversion Gain (HCG) für hohen Signal-Rausch-Abstand und Low Conversion Gain für niedrigen Signal-Rausch-Abstand; die Quelle bezeichnet auch Letzteres hier als HCG.

<!-- source: EN PDF p70; unit 586 -->

![Originalabbildung aus dem englischen PDF, S. 70](/docs/rockchip-isp30-tuning/assets/en-p070-X561.png)

<!-- source: EN PDF p70; unit 587 -->

Bayernr2D-Blockdiagramm

<!-- source: EN PDF p71; unit 588 -->

##### 2.1.2   4.2.1.2 Wichtige Parameter

<!-- source: EN PDF p71; unit 589 -->

| Parameter-<br>name | Parameter-<br>typ | Kurzbeschreibung |
| --- | --- | --- |
| enable | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| SNR_Mode | Modus-<br>parameter | DCG-Modus für hohen bzw. niedrigen Signal-Rausch-Abstand |
| Sensor_Mode | Modus-<br>parameter | DCG-Modus des Sensors |
| ISO | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| lumapoint | Kalibrier-<br>daten | Vom Kalibrierwerkzeug erzeugt |
| sigma | Kalibrier-<br>daten | Vom Kalibrierwerkzeug erzeugt |
| gauss_guide | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| filter_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| edgesofts | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| ratio | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| weight | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| pix_diff | Abstimmungs-<br>parameter | Selten angepasst; derzeit nicht in der Werkzeugoberfläche verfügbar,<br>für eine spätere Version vorgesehen |
| diff_thld | Abstimmungs-<br>parameter | Selten angepasst; derzeit nicht in der Werkzeugoberfläche verfügbar,<br>für eine spätere Version vorgesehen |

<!-- source: EN PDF p71; unit 590 -->

###### 2.1.2.1   enable:

<!-- source: EN PDF p71; unit 591 -->

【Beschreibung】

<!-- source: EN PDF p71; unit 592 -->

Unterschiedlichen Pixelhelligkeiten entsprechen unterschiedliche Punkte der Rausch-Sigma-Kurve. Insgesamt gibt es 16 Punkte.

<!-- source: EN PDF p72; unit 593 -->

###### 2.1.2.2   SNR_Mode

<!-- source: EN PDF p72; unit 594 -->

【Beschreibung】

<!-- source: EN PDF p72; unit 595 -->

LCG und HCG entsprechen unterschiedlichen Rauschmodi.

<!-- source: EN PDF p72; unit 596 -->

HSNR entspricht HCG, LSNR entspricht LCG.

<!-- source: EN PDF p72; unit 597 -->

###### 2.1.2.3   Sensor_Mode

<!-- source: EN PDF p72; unit 598 -->

【Beschreibung】

<!-- source: EN PDF p72; unit 599 -->

Vom Sensor unterstützte HCG- und LCG-Modi. Ohne DCG-Unterstützung werden standardmäßig die LCG-Parameter verwendet.

<!-- source: EN PDF p72; unit 600 -->

###### 2.1.2.4   ISO

<!-- source: EN PDF p72; unit 601 -->

【Beschreibung】

<!-- source: EN PDF p72; unit 602 -->

Unterschiedliche ISO-Stufen verwenden unterschiedliche Abstimmungsparameter. Derzeit werden 13 Stufen unterstützt.

<!-- source: EN PDF p72; unit 603 -->

###### 2.1.2.5   filter_strength

<!-- source: EN PDF p72; unit 604 -->

【Beschreibung】

<!-- source: EN PDF p72; unit 605 -->

Rauschunterdrückungsstärke. Wertebereich [0, 16]; größere Werte bewirken stärkere Rauschunterdrückung.

<!-- source: EN PDF p72; unit 606 -->

###### 2.1.2.6   gauss_guide

<!-- source: EN PDF p72; unit 607 -->

【Beschreibung】

<!-- source: EN PDF p72; unit 608 -->

Aktiviert die gaußsche Führung: 1 ein, 0 aus.

<!-- source: EN PDF p72; unit 609 -->

###### 2.1.2.7   lumapoint/sigma

<!-- source: EN PDF p72; unit 610 -->

【Beschreibung】

<!-- source: EN PDF p72; unit 611 -->

Kalibrierdaten: Unterschiedliche Pixelhelligkeiten entsprechen unterschiedlichen Punkten der Rausch-Sigma-Kurve. Insgesamt 16 Punkte.

<!-- source: EN PDF p72; unit 612 -->

LumaPoint bildet die Pixelhelligkeit auf der Abszisse ab; Wertebereich [0, 65535].

<!-- source: EN PDF p72; unit 613 -->

sigma bildet die Rauschwertkurve auf der Ordinate ab; Wertebereich [0, 65535].

<!-- source: EN PDF p73; unit 614 -->

###### 2.1.2.8   edgesofts

<!-- source: EN PDF p73; unit 615 -->

【Beschreibung】

<!-- source: EN PDF p73; unit 616 -->

Beeinflusst die räumlichen Gewichte. Wertebereich [1, 16], Standardwert 1.

<!-- source: EN PDF p73; unit 617 -->

###### 2.1.2.9   ratio

<!-- source: EN PDF p73; unit 618 -->

【Beschreibung】

<!-- source: EN PDF p73; unit 619 -->

Gewicht des weichen Schwellenwerts. Wertebereich [0, 1.0]; kleinere Werte verstärken die Rauschunterdrückung.

<!-- source: EN PDF p73; unit 620 -->

Wertebereich [0, 1], Standardwert 0.01.

<!-- source: EN PDF p73; unit 621 -->

###### 2.1.2.10   weight

<!-- source: EN PDF p73; unit 622 -->

【Beschreibung】

<!-- source: EN PDF p73; unit 623 -->

Je größer das Gewicht des Filterausgangs, desto stärker die Rauschunterdrückung.

<!-- source: EN PDF p73; unit 624 -->

Wertebereich [0, 1], Standardwert 0.5.

<!-- source: EN PDF p73; unit 625 -->

###### 2.1.2.11   pix_diff

<!-- source: EN PDF p73; unit 626 -->

【Beschreibung】

<!-- source: EN PDF p73; unit 627 -->

Dieser Parameter wird selten angepasst und ist derzeit nicht in der Werkzeugoberfläche verfügbar. Die Freigabe ist für später vorgesehen.

<!-- source: EN PDF p73; unit 628 -->

Pixeldifferenzschwelle eines 5x5-Fensters für die bilaterale Filterung; Standardwert 0x3fff.

<!-- source: EN PDF p73; unit 629 -->

###### 2.1.2.12   diff_thld

<!-- source: EN PDF p73; unit 630 -->

【Beschreibung】

<!-- source: EN PDF p73; unit 631 -->

Dieser Parameter wird selten angepasst und ist derzeit nicht in der Werkzeugoberfläche verfügbar. Die Freigabe ist für später vorgesehen.

<!-- source: EN PDF p73; unit 632 -->

Schwelle der quadrierten Differenz bei der Berechnung euklidischer Abstände für die bilaterale Filterung; Standardwert 0x3ff.

<!-- source: EN PDF p74; unit 633 -->

##### 2.1.3   4.2.1.3 Abstimmungsschritte

<!-- source: EN PDF p74; unit 634 -->

Deaktivieren Sie während der Abstimmung Bayernr3D, YNR, CNR und SHARP.

<!-- source: EN PDF p74; unit 635 -->

Bayernr2D unterdrückt hochfrequentes Rauschen und beeinflusst dadurch Details und Rauschstruktur. Bei hoher Stärke wird das Rauschen niederfrequenter, und Details nehmen ab.

<!-- source: EN PDF p74; unit 636 -->

Stimmen Sie die Bayernr2D-Stärke so ab, dass Rauschunterdrückung und Detailverlust ausgewogen sind.

<!-- source: EN PDF p74; unit 637 -->

Bei niedriger ISO ist insgesamt weniger Rauschunterdrückung erforderlich; verwenden Sie kleinere filter_strength- und weight-Werte.

<!-- source: EN PDF p74; unit 638 -->

Bei hoher ISO wird eine schrittweise Erhöhung von filter_strength und weight empfohlen.

<!-- source: EN PDF p74; unit 639 -->

#### 2.2   4.2.2 BayerTnr

<!-- source: EN PDF p74; unit 640 -->

##### 2.2.1   4.2.2.1 Funktionsbeschreibung

<!-- source: EN PDF p74; unit 641 -->

Dieses Modul führt zeitliche Rauschunterdrückung und weiche Schwellwertfilterung im RAW-Bereich aus.

<!-- source: EN PDF p74; unit 642 -->

Aktuelles Frame und IIR-Frame werden in nieder- und hochfrequente Ebenen zerlegt, die getrennt verarbeitet und entrauscht werden.

<!-- source: EN PDF p74; unit 643 -->

Die Abstimmung verwendet dieselben Kalibrierdaten wie Bayernr 2D.

<!-- source: EN PDF p74; unit 644 -->

Auf Grundlage dieser Daten bildet das Modul ein Rauschmodell, das den tatsächlichen Rauscheigenschaften besser entspricht.

<!-- source: EN PDF p74; unit 645 -->

Für hohen und niedrigen Signal-Rausch-Abstand werden getrennte Kalibrierungen und Parameter unterstützt.

<!-- source: EN PDF p74; unit 646 -->

Bei einem CIS mit Dual Conversion Gain (DCG) entspricht High Conversion Gain (HCG) dem Modus mit hohem Signal-Rausch-Abstand und Low Conversion Gain dem Modus mit niedrigem Signal-Rausch-Abstand; die Quelle bezeichnet auch Letzteres hier als HCG.

<!-- source: EN PDF p74; unit 647 -->

![Originalabbildung aus dem englischen PDF, S. 74](/docs/rockchip-isp30-tuning/assets/en-p074-X586.png)

<!-- source: EN PDF p74; unit 648 -->

Bayernr3D-Blockdiagramm

<!-- source: EN PDF p75; unit 649 -->

##### 2.2.2   4.2.2.2 Wichtige Parameter

<!-- source: EN PDF p75; unit 650 -->

| Parametername | Parameter-<br>typ | Kurzbeschreibung |
| --- | --- | --- |
| Enable | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| SNR_Mode | Modus-<br>parameter | DCG-Modus für hohen bzw. niedrigen<br>Signal-Rausch-Abstand |
| sensor_Mode | Modus-<br>parameter | DCG-Modus des Sensors |
| iso | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| thumbds | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| lo_enable | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hi_enable | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| lo_med_en、lo_gsbay_en、<br>lo_gslum_en | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| hi_med_en、hi_gslum_en | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| hi_wgt_comp | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| clipwgt | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| global_pk_en | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| global_pksq | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| hidif_th | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| lo_filter_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hi_filter_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| softwgt | Abstimmungs-<br>parameter | Häufig angepasster Parameter |

<!-- source: EN PDF p76; unit 651 -->

| Parametername | Parameter-<br>typ | Kurzbeschreibung |
| --- | --- | --- |
| lumapoint / sigm | Kalibrier-<br>daten | Vom Kalibrierwerkzeug erzeugt |
| lumapoint2 / lo_sigma | Kalibrier-<br>daten | Vom Kalibrierwerkzeug erzeugt |
| lumapoint2 / hi_sigma | Kalibrier-<br>daten | Vom Kalibrierwerkzeug erzeugt |

<!-- source: EN PDF p76; unit 652 -->

###### 2.2.2.1   Enable:

<!-- source: EN PDF p76; unit 653 -->

【Beschreibung】

<!-- source: EN PDF p76; unit 654 -->

Aktivierung von Bayernr3D: 0 aus, 1 ein.

<!-- source: EN PDF p76; unit 655 -->

###### 2.2.2.2   SNR_Mode

<!-- source: EN PDF p76; unit 656 -->

【Beschreibung】

<!-- source: EN PDF p76; unit 657 -->

LCG und HCG entsprechen unterschiedlichen Rauschmodi. HSNR entspricht HCG, LSNR entspricht LCG.

<!-- source: EN PDF p76; unit 658 -->

###### 2.2.2.3   sensor_Mode

<!-- source: EN PDF p76; unit 659 -->

【Beschreibung】

<!-- source: EN PDF p76; unit 660 -->

Unterstützt der Sensor kein DCG, werden standardmäßig die LCG-Parameter verwendet.

<!-- source: EN PDF p76; unit 661 -->

###### 2.2.2.4   ISO

<!-- source: EN PDF p76; unit 662 -->

【Beschreibung】

<!-- source: EN PDF p76; unit 663 -->

Unterschiedliche ISO-Stufen verwenden unterschiedliche Abstimmungsparameter. Derzeit werden 13 Stufen unterstützt.

<!-- source: EN PDF p76; unit 664 -->

###### 2.2.2.5   thumbds

<!-- source: EN PDF p76; unit 665 -->

【Beschreibung】

<!-- source: EN PDF p76; unit 666 -->

Unterabtastungsfaktor. Keine Abstimmung erforderlich; Standardwert 8.

<!-- source: EN PDF p76; unit 667 -->

###### 2.2.2.6   lo_enable

<!-- source: EN PDF p76; unit 668 -->

【Beschreibung】

<!-- source: EN PDF p76; unit 669 -->

Aktivierung der niederfrequenten Bewegungserkennung: 1 ein, 0 aus. Standardmäßig aktiviert.

<!-- source: EN PDF p77; unit 670 -->

###### 2.2.2.7   hi_enable

<!-- source: EN PDF p77; unit 671 -->

【Beschreibung】

<!-- source: EN PDF p77; unit 672 -->

Aktivierung der hochfrequenten Bewegungserkennung: 1 ein, 0 aus. Standardmäßig aktiviert.

<!-- source: EN PDF p77; unit 673 -->

###### 2.2.2.8   lo_med_en、lo_gsbay_en、lo_gslum_en

<!-- source: EN PDF p77; unit 674 -->

【Beschreibung】

<!-- source: EN PDF p77; unit 675 -->

Schalter interner niederfrequenter Teilmodule: 1 ein, 0 aus. Standardmäßig aktiviert.

<!-- source: EN PDF p77; unit 676 -->

###### 2.2.2.9   hi_med_en、hi_gslum_en

<!-- source: EN PDF p77; unit 677 -->

【Beschreibung】

<!-- source: EN PDF p77; unit 678 -->

Schalter interner hochfrequenter Teilmodule: 1 ein, 0 aus. Standardmäßig aktiviert.

<!-- source: EN PDF p77; unit 679 -->

###### 2.2.2.10   hi_wgt_comp

<!-- source: EN PDF p77; unit 680 -->

【Beschreibung】

<!-- source: EN PDF p77; unit 681 -->

Proportionalfaktor zur Kompensation des Überlagerungsgewichts; nur bei aktivierter Hochfrequenzverarbeitung wirksam.

<!-- source: EN PDF p77; unit 682 -->

Standardwert 0.16, Wertebereich [0.0, 1.0].

<!-- source: EN PDF p77; unit 683 -->

###### 2.2.2.11   clipwgt

<!-- source: EN PDF p77; unit 684 -->

【Beschreibung】

<!-- source: EN PDF p77; unit 685 -->

Grenzwert des Bildüberlagerungsgewichts.

<!-- source: EN PDF p77; unit 686 -->

Standardwert 0.03215, Wertebereich 0.0 bis 1.0.

<!-- source: EN PDF p77; unit 687 -->

###### 2.2.2.12   global_pk_en

<!-- source: EN PDF p77; unit 688 -->

【Beschreibung】

<!-- source: EN PDF p77; unit 689 -->

Verwendet globales PK für die zeitliche Rauschunterdrückung: 1 ja, 0 nein.

<!-- source: EN PDF p77; unit 690 -->

Derzeit ist nur 0 zulässig.

<!-- source: EN PDF p77; unit 691 -->

###### 2.2.2.13   global_pksq

<!-- source: EN PDF p77; unit 692 -->

【Beschreibung】

<!-- source: EN PDF p77; unit 693 -->

Quadrat des globalen pk; wird bei global_pk_en = 1 verwendet.

<!-- source: EN PDF p77; unit 694 -->

Standardwert 1024, Wertebereich [0, 268435455].

<!-- source: EN PDF p78; unit 695 -->

###### 2.2.2.14   hidif_th

<!-- source: EN PDF p78; unit 696 -->

【Beschreibung】

<!-- source: EN PDF p78; unit 697 -->

Schwelle der hochfrequenten Differenz.

<!-- source: EN PDF p78; unit 698 -->

Standardwert 32767, Wertebereich 0 bis 65535.

<!-- source: EN PDF p78; unit 699 -->

###### 2.2.2.15   lo_filter_strength

<!-- source: EN PDF p78; unit 700 -->

【Beschreibung】

<!-- source: EN PDF p78; unit 701 -->

Stärke der hochfrequenten Bewegungserkennung. Beeinflusst letztlich Hi Sigma und damit die zeitliche Rauschunterdrückung.

<!-- source: EN PDF p78; unit 702 -->

Standardwert 1, Wertebereich [0.0, 16.0].

<!-- source: EN PDF p78; unit 703 -->

###### 2.2.2.16   hi_filter_strength

<!-- source: EN PDF p78; unit 704 -->

【Beschreibung】

<!-- source: EN PDF p78; unit 705 -->

Stärke der hochfrequenten Bewegungserkennung. Beeinflusst letztlich Hi Sigma und damit die zeitliche Rauschunterdrückung.

<!-- source: EN PDF p78; unit 706 -->

Standardwert 1, Wertebereich [0.0, 16.0].

<!-- source: EN PDF p78; unit 707 -->

###### 2.2.2.17   softwgt

<!-- source: EN PDF p78; unit 708 -->

【Beschreibung】

<!-- source: EN PDF p78; unit 709 -->

Gewicht des weichen Schwellenwerts. Größere Werte bewahren mehr Rauschen.

<!-- source: EN PDF p78; unit 710 -->

Wertebereich 0.0 bis 1.0, Standardwert 0.

<!-- source: EN PDF p78; unit 711 -->

###### 2.2.2.18   lumapoint / sigma

<!-- source: EN PDF p78; unit 712 -->

【Beschreibung】

<!-- source: EN PDF p78; unit 713 -->

Rauschkurvenwerte für unterschiedliche Pixelhelligkeiten; insgesamt 16 Punkte.

<!-- source: EN PDF p78; unit 714 -->

LumaPoint entspricht der Pixelhelligkeit; Wertebereich [0, 65535].

<!-- source: EN PDF p78; unit 715 -->

sigma entspricht dem Rauschkurvenwert; Wertebereich [0, 65535].

<!-- source: EN PDF p78; unit 716 -->

###### 2.2.2.19   lumapoint2 / lo_sigma

<!-- source: EN PDF p78; unit 717 -->

【Beschreibung】

<!-- source: EN PDF p78; unit 718 -->

Rauschkurvenwerte für unterschiedliche Pixelhelligkeiten; insgesamt 16 Punkte.

<!-- source: EN PDF p78; unit 719 -->

lumapoint2 entspricht der Pixelhelligkeit; Wertebereich [0, 65535].

<!-- source: EN PDF p78; unit 720 -->

lo_sigma entspricht dem Rauschkurvenwert; Wertebereich [0, 65535].

<!-- source: EN PDF p79; unit 721 -->

###### 2.2.2.20   lumapoint2 / hi_sigma

<!-- source: EN PDF p79; unit 722 -->

【Beschreibung】

<!-- source: EN PDF p79; unit 723 -->

Rauschkurvenwerte für unterschiedliche Pixelhelligkeiten; insgesamt 16 Punkte.

<!-- source: EN PDF p79; unit 724 -->

lumapoint2 entspricht der Pixelhelligkeit; Wertebereich [0, 65535].

<!-- source: EN PDF p79; unit 725 -->

hi_sigma entspricht dem Rauschkurvenwert; Wertebereich [0, 65535].

<!-- source: EN PDF p79; unit 726 -->

##### 2.2.3   4.2.2.3 Abstimmungsschritte

<!-- source: EN PDF p79; unit 727 -->

Deaktivieren Sie bayernr2d, ynr, cnr und sharp.

<!-- source: EN PDF p79; unit 728 -->

Passen Sie filter_strength, lo_clipwgt und hi_clipwgt an, um Rauschunterdrückung und Nachzieheffekte auszubalancieren.

<!-- source: EN PDF p79; unit 729 -->

Normale zeitliche Mehrbildüberlagerung verändert die Rauschstruktur nicht.

<!-- source: EN PDF p79; unit 730 -->

Bayernr3D führt nach der Überlagerung jedoch zusätzlich eine weiche Schwellwertfilterung aus, die die Rauschstruktur beeinflusst.

<!-- source: EN PDF p79; unit 731 -->

Je stärker diese Filterung, desto niederfrequenter werden die Rauschpartikel.

<!-- source: EN PDF p79; unit 732 -->

##### 2.2.4   4.2.2.3 Abstimmungsschritte

<!-- source: EN PDF p79; unit 733 -->

Aktivieren Sie bei der Abstimmung bayernr3d und deaktivieren Sie ynr, cnr, sharp und weitere Module.

<!-- source: EN PDF p79; unit 734 -->

Bayernr2D unterdrückt hochfrequentes Rauschen und beeinflusst Details und Rauschstruktur. Hohe Stärke erzeugt niederfrequenteres Rauschen und weniger Details.

<!-- source: EN PDF p79; unit 735 -->

Stimmen Sie Bayernr2D so ab, dass Rauschunterdrückung und Detailverlust ausgewogen sind.

<!-- source: EN PDF p79; unit 736 -->

Bei niedriger ISO ist insgesamt weniger Rauschunterdrückung erforderlich; verwenden Sie kleinere filter_strength- und weight-Werte.

<!-- source: EN PDF p79; unit 737 -->

Bei hoher ISO wird eine schrittweise Erhöhung von filter_strength und weight empfohlen.

<!-- source: EN PDF p79; unit 738 -->

Passen Sie die gain_adj-Zuordnung anhand des GAIN-Werts bewegter Bereiche an, um dort die Rauschunterdrückung zu erhöhen.

<!-- source: EN PDF p79; unit 739 -->

#### 2.3   4.2.3 YNR

<!-- source: EN PDF p79; unit 740 -->

##### 2.3.1   4.2.3.1 Funktionsbeschreibung

<!-- source: EN PDF p79; unit 741 -->

Dieses Modul verarbeitet das Helligkeitssignal im YUV-Bereich. Es verwendet ein unterabgetastetes Bild des vorherigen Frames und das aktuelle Frame für bilaterale Rauschunterdrückung, weiche Schwellwertfilterung, Kantenfilterung und weitere Schritte.

<!-- source: EN PDF p79; unit 742 -->

YNR nutzt die vom GAIN-Modul erfasste lokale Rauschstärke, um verschiedene Bildbereiche unterschiedlich zu entrauschen.

<!-- source: EN PDF p80; unit 743 -->

Außerdem variiert YNR die Stärke radial vom Bildzentrum nach außen, um durch LSC verstärktes Rauschen in den Ecken zu behandeln.

<!-- source: EN PDF p80; unit 744 -->

Auf Grundlage der Kalibrierdaten bildet das Modul ein Rauschmodell, das den tatsächlichen Rauscheigenschaften besser entspricht.

<!-- source: EN PDF p80; unit 745 -->

Für hohen und niedrigen Signal-Rausch-Abstand werden getrennte Kalibrierungen und Parameter unterstützt.

<!-- source: EN PDF p80; unit 746 -->

Bei einem CIS mit Dual Conversion Gain (DCG) entspricht High Conversion Gain (HCG) dem Modus mit hohem Signal-Rausch-Abstand und Low Conversion Gain dem Modus mit niedrigem Signal-Rausch-Abstand; die Quelle bezeichnet auch Letzteres hier als HCG.

<!-- source: EN PDF p80; unit 747 -->

![Originalabbildung aus dem englischen PDF, S. 80](/docs/rockchip-isp30-tuning/assets/en-p080-X629.png)

<!-- source: EN PDF p80; unit 748 -->

Abbildung 4-2-3-1: YNR-Funktionsblockdiagramm

#### 4.2.3.2 Wichtige Parameter

<!-- source: EN PDF p81; unit 749 -->

| Parametername | Parameter-<br>typ | Kurzbeschreibung |
| --- | --- | --- |
| Enable | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| SNR_Mode | Modus-<br>parameter | DCG-Modus für hohen bzw. niedrigen<br>Signal-Rausch-Abstand |
| Sensor_Mode | Modus-<br>parameter | DCG-Modus des Sensors |
| iso | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| ynr_bft3x3_bypass | Abstimmungs-<br>parameter | Selten angepasst; Schalter eines internen Moduls |
| ynr_lbft5x5_bypass | Abstimmungs-<br>parameter | Selten angepasst; Schalter eines internen Moduls |
| ynr_lgft3x3_bypass | Abstimmungs-<br>parameter | Selten angepasst; Schalter eines internen Moduls |
| ynr_flt1x1_bypass | Abstimmungs-<br>parameter | Selten angepasst; Schalter eines internen Moduls |
| ynr_sft5x5_bypass | Abstimmungs-<br>parameter | Selten angepasst; Schalter eines internen Moduls |
| ynr_global_gain_alpha | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| ynr_global_gain | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| ynr_adjust_thres | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| ynr_adjust_scale | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| rnr_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| low_bf | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| low_thred_adj | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| low_peak_supress | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| low_edge_adj_thresh | Abstimmungs-<br>parameter | Häufig angepasster Parameter |

<!-- source: EN PDF p82; unit 750 -->

| Parametername | Parameter-<br>typ | Kurzbeschreibung |
| --- | --- | --- |
| low_lbf_weight_thresh | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| low_center_weight | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| low_dist_adj | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| low_weight | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| low_filt_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| low_bi_weight | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| base_filter_weight | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| high_thred_adj | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| high_weight | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| high_direction_weight | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| hi_min_adj | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hi_edge_thed | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| sigma_curve | Kalibrier-<br>daten | Vom Kalibrierwerkzeug erzeugt |
| ynr_ci | Kalibrier-<br>daten | Vom Kalibrierwerkzeug erzeugt |

<!-- source: EN PDF p82; unit 751 -->

###### 2.3.1.1   Enable:

<!-- source: EN PDF p82; unit 752 -->

【Beschreibung】

<!-- source: EN PDF p82; unit 753 -->

Aktivierung des YNR-Moduls: 1 ein, 0 aus.

<!-- source: EN PDF p83; unit 754 -->

###### 2.3.1.2   SNR_Mode

<!-- source: EN PDF p83; unit 755 -->

【Beschreibung】

<!-- source: EN PDF p83; unit 756 -->

LCG und HCG entsprechen unterschiedlichen Rauschmodi.

<!-- source: EN PDF p83; unit 757 -->

HSNR entspricht HCG, LSNR entspricht LCG.

<!-- source: EN PDF p83; unit 758 -->

###### 2.3.1.3   Sensor_Mode

<!-- source: EN PDF p83; unit 759 -->

【Beschreibung】

<!-- source: EN PDF p83; unit 760 -->

Vom Sensor unterstützte HCG- und LCG-Modi. Ohne DCG-Unterstützung werden standardmäßig die LCG-Parameter verwendet.

<!-- source: EN PDF p83; unit 761 -->

###### 2.3.1.4   ISO

<!-- source: EN PDF p83; unit 762 -->

【Beschreibung】

<!-- source: EN PDF p83; unit 763 -->

Unterschiedliche ISO-Stufen verwenden unterschiedliche Abstimmungsparameter. Derzeit werden 13 Stufen unterstützt.

<!-- source: EN PDF p83; unit 764 -->

###### 2.3.1.5   ynr_bft3x3_bypass,ynr_lbft5x5_bypass,ynr_lgft3x3_bypass,ynr_flt1x1_bypass， ynr_sft5x5_bypass

<!-- source: EN PDF p83; unit 765 -->

【Beschreibung】

<!-- source: EN PDF p83; unit 766 -->

Bypass-Schalter der Teilmodule: 0 aktiviert die Funktion, 1 umgeht sie.

<!-- source: EN PDF p83; unit 767 -->

Normalerweise werden alle Teilmodule aktiviert und diese Werte auf 0 gesetzt.

<!-- source: EN PDF p83; unit 768 -->

###### 2.3.1.6   ynr_global_gain_alpha/ynr_global_gain

<!-- source: EN PDF p83; unit 769 -->

【Beschreibung】

<!-- source: EN PDF p83; unit 770 -->

Konfiguration der interpolierten YNR-Stärke zwischen lokalem und globalem Modus.

<!-- source: EN PDF p83; unit 771 -->

Üblicherweise werden die Standardwerte ohne weitere Anpassung verwendet; dabei wird vollständig mit lokalem Gain gearbeitet.

<!-- source: EN PDF p83; unit 772 -->

Formel: Gain = (global_gain_alphaglobal_gain+(8-global_gain_alpha)local_gain)&gt;&gt;3

<!-- source: EN PDF p83; unit 773 -->

Global-Gain-Alpha: Wertebereich [0.0 1.0], Standardwert 0.

<!-- source: EN PDF p83; unit 774 -->

Global Gain: Wertebereich [0.0 64.0], Standardwert 1.

<!-- source: EN PDF p84; unit 775 -->

###### 2.3.1.7   ynr_adjust_thresh /ynr_adjust_scale

<!-- source: EN PDF p84; unit 776 -->

【Beschreibung】

<!-- source: EN PDF p84; unit 777 -->

Steuert die Rauschunterdrückungsstärke für Rauschen oberhalb von ynr_adjust_thresh.

<!-- source: EN PDF p84; unit 778 -->

Der Ansatz geht von stärkerem Rauschen in bewegten Bereichen aus. Eine geeignete Schwelle erhöht dort die YNR-Rauschunterdrückung.

<!-- source: EN PDF p84; unit 779 -->

ynr_adjust_thresh: Wertebereich [0.0, 1.0], Standardwert 1.

<!-- source: EN PDF p84; unit 780 -->

ynr_adjust_scale: Wertebereich [0, 16.0], Standardwert 1.

<!-- source: EN PDF p84; unit 781 -->

###### 2.3.1.8   rnr_strength

<!-- source: EN PDF p84; unit 782 -->

【Beschreibung】

<!-- source: EN PDF p84; unit 783 -->

Legt vom Bildzentrum aus entlang des Radius r unterschiedliche Rauschunterdrückungsstärken fest.

<!-- source: EN PDF p84; unit 784 -->

Dient hauptsächlich zur Behandlung des durch LSC beeinflussten Rauschens.

<!-- source: EN PDF p84; unit 785 -->

Wertebereich [0, 16.0], Standardwert 1.

<!-- source: EN PDF p84; unit 786 -->

###### 2.3.1.9   low_bf

<!-- source: EN PDF p84; unit 787 -->

【Beschreibung】

<!-- source: EN PDF p84; unit 788 -->

Stärkeparameter der bilateralen Filterung.

<!-- source: EN PDF p84; unit 789 -->

Die erste Zeile steuert die ursprüngliche 3x3-Bilateralfilterung. Größere Werte verstärken die Rauschunterdrückung.

<!-- source: EN PDF p84; unit 790 -->

Wertebereich [0.01, 32], Standardwert 1.

<!-- source: EN PDF p84; unit 791 -->

Die zweite Zeile steuert die 5x5-Bilateralfilterung des vorherigen Frames. Größere Werte verstärken die Rauschunterdrückung.

<!-- source: EN PDF p84; unit 792 -->

Wertebereich [0.01, 32], Standardwert 1.

<!-- source: EN PDF p84; unit 793 -->

###### 2.3.1.10   low_thred_adj

<!-- source: EN PDF p84; unit 794 -->

【Beschreibung】

<!-- source: EN PDF p84; unit 795 -->

Ein größerer niederfrequenter weicher Schwellenwert verstärkt die niederfrequente Rauschunterdrückung.

<!-- source: EN PDF p84; unit 796 -->

Wertebereich [0, 31], Standardwert 0.5.

<!-- source: EN PDF p85; unit 797 -->

###### 2.3.1.11   low_peak_supress

<!-- source: EN PDF p85; unit 798 -->

【Beschreibung】

<!-- source: EN PDF p85; unit 799 -->

Steuert die Entfernung isolierter Rauschpunkte. Kleinere Werte bewirken stärkere Rauschunterdrückung.

<!-- source: EN PDF p85; unit 800 -->

Wertebereich [0, 1], Standardwert 0.5.

<!-- source: EN PDF p85; unit 801 -->

###### 2.3.1.12   low_edge_adj_thresh

<!-- source: EN PDF p85; unit 802 -->

【Beschreibung】

<!-- source: EN PDF p85; unit 803 -->

Schwelle des Anpassungsfaktors für die Kantenerkennung im verkleinerten Bild. Begrenzt dessen maximalen Wert.

<!-- source: EN PDF p85; unit 804 -->

Kleinere Werte verstärken die Rauschunterdrückung und machen das Bild unschärfer. Ganzzahliger Wertebereich [0, 1023], Standardwert 7.

<!-- source: EN PDF p85; unit 805 -->

###### 2.3.1.13   low_lbf_weight_thresh

<!-- source: EN PDF p85; unit 806 -->

【Beschreibung】

<!-- source: EN PDF p85; unit 807 -->

Begrenzt das Gewicht der 5x5-Bilateralfilterung. Höhere Werte schwächen die niederfrequente Rauschunterdrückung.

<!-- source: EN PDF p85; unit 808 -->

Wertebereich [0.0, 1.0], Standardwert 0.25.

<!-- source: EN PDF p85; unit 809 -->

###### 2.3.1.14   low_center_weight

<!-- source: EN PDF p85; unit 810 -->

【Beschreibung】

<!-- source: EN PDF p85; unit 811 -->

Gewicht des Mittelpunktes bei der 5x5-Bilateralfilterung. Kleinere Werte verstärken die Rauschunterdrückung.

<!-- source: EN PDF p85; unit 812 -->

Wertebereich [0,1], Standardwert 0.5.

<!-- source: EN PDF p85; unit 813 -->

###### 2.3.1.15   low_dist_adj

<!-- source: EN PDF p85; unit 814 -->

【Beschreibung】

<!-- source: EN PDF p85; unit 815 -->

Anpassungsfaktor des Distanzgewichts im Bilateralfilter. Kleinere Werte verstärken die Rauschunterdrückung.

<!-- source: EN PDF p85; unit 816 -->

Wertebereich [0, 127.0], Standardwert 8.0.

<!-- source: EN PDF p86; unit 817 -->

###### 2.3.1.16   low_weight

<!-- source: EN PDF p86; unit 818 -->

【Beschreibung】

<!-- source: EN PDF p86; unit 819 -->

Gewicht des niederfrequent entrauschten Ergebnisses. Größere Werte verstärken die niederfrequente Rauschunterdrückung.

<!-- source: EN PDF p86; unit 820 -->

Wertebereich [0, 1], Standardwert 0.5.

<!-- source: EN PDF p86; unit 821 -->

###### 2.3.1.17   low_filt_strength

<!-- source: EN PDF p86; unit 822 -->

【Beschreibung】

<!-- source: EN PDF p86; unit 823 -->

Die erste Zeile enthält das Filterkerngewicht für die gaußsche Filterung des Originalbildes.

<!-- source: EN PDF p86; unit 824 -->

Wertebereich [0,1.0], Standardwert 0.7.

<!-- source: EN PDF p86; unit 825 -->

Die zweite Zeile enthält das Filterkerngewicht für die gaußsche Filterung des Ergebnisses der Bilateralfilterung.

<!-- source: EN PDF p86; unit 826 -->

Wertebereich [0,1.0], Standardwert 0.85.

<!-- source: EN PDF p86; unit 827 -->

###### 2.3.1.18   low_bi_weight

<!-- source: EN PDF p86; unit 828 -->

【Beschreibung】

<!-- source: EN PDF p86; unit 829 -->

Gewicht der ersten Bilateralfilterung innerhalb der weichen Schwellwertverarbeitung. Höhere Werte verstärken die Rauschunterdrückung.

<!-- source: EN PDF p86; unit 830 -->

Wertebereich [0, 1], Standardwert 0.3.

<!-- source: EN PDF p86; unit 831 -->

###### 2.3.1.19   base_filter_weight

<!-- source: EN PDF p86; unit 832 -->

【Beschreibung】

<!-- source: EN PDF p86; unit 833 -->

Koeffizient des Richtungsfilters. Üblicherweise ist keine Anpassung erforderlich.

<!-- source: EN PDF p86; unit 834 -->

###### 2.3.1.20   high_thred_adj

<!-- source: EN PDF p86; unit 835 -->

【Beschreibung】

<!-- source: EN PDF p86; unit 836 -->

Höhere Werte verstärken die hochfrequente Rauschunterdrückung.

<!-- source: EN PDF p86; unit 837 -->

Wertebereich 0 bis 31.0, Standardwert 1.0.

<!-- source: EN PDF p87; unit 838 -->

###### 2.3.1.21   high_weight

<!-- source: EN PDF p87; unit 839 -->

【Beschreibung】

<!-- source: EN PDF p87; unit 840 -->

Gewicht der hochfrequenten Rauschunterdrückung. Der Wert bezeichnet den Anteil hochfrequenter Komponenten, der erhalten bleibt.

<!-- source: EN PDF p87; unit 841 -->

Kleinere Werte verstärken die Rauschunterdrückung. Standardwert 0.78.

<!-- source: EN PDF p87; unit 842 -->

###### 2.3.1.22   high_direction_weight

<!-- source: EN PDF p87; unit 843 -->

【Beschreibung】

<!-- source: EN PDF p87; unit 844 -->

Gewichte der einzelnen Richtungen. Ein höheres Gewicht einer Richtung bedeutet stärkere Rauschunterdrückung entlang dieser Richtung.

<!-- source: EN PDF p87; unit 845 -->

<!-- source: EN PDF p87; unit 846 -->

###### 2.3.1.23   hi_min_adj

<!-- source: EN PDF p87; unit 847 -->

【Beschreibung】

<!-- source: EN PDF p87; unit 848 -->

Verhältnis aller Varianzwerte abzüglich des kleinsten Varianzwerts. Je größer der Wert, desto schärfer die Kanten.

<!-- source: EN PDF p87; unit 849 -->

Wertebereich: 0.0 bis 1.0; Standardwert: 0.9.

<!-- source: EN PDF p87; unit 850 -->

###### 2.3.1.24   hi_edge_thed

<!-- source: EN PDF p87; unit 851 -->

【Beschreibung】

<!-- source: EN PDF p87; unit 852 -->

Je kleiner der Schwellenwert, desto stärker die hochfrequente Rauschunterdrückung.

<!-- source: EN PDF p87; unit 853 -->

Ganzzahl im Bereich 0 bis 255; Standardwert: 100.

<!-- source: EN PDF p87; unit 854 -->

###### 2.3.1.25   sigma_curve

<!-- source: EN PDF p87; unit 855 -->

【Beschreibung】

<!-- source: EN PDF p87; unit 856 -->

Rausch-Sigma-Kurve.

<!-- source: EN PDF p88; unit 857 -->

###### 2.3.1.26   ynr_ci

<!-- source: EN PDF p88; unit 858 -->

【Beschreibung】

<!-- source: EN PDF p88; unit 859 -->

Einflussfaktor für das Rausch-Sigma. Je höher der Wert, desto größer das Rausch-Sigma und desto stärker die Rauschunterdrückung.

<!-- source: EN PDF p88; unit 860 -->

Die erste Zeile beeinflusst das niederfrequente Sigma.

<!-- source: EN PDF p88; unit 861 -->

Die zweite Zeile beeinflusst das hochfrequente Sigma.

<!-- source: EN PDF p88; unit 862 -->

###### 2.3.1.27   hi_center_weight

<!-- source: EN PDF p88; unit 863 -->

【Beschreibung】

<!-- source: EN PDF p88; unit 864 -->

Je höher das Gewicht des hochfrequenten Mittelpunkts, desto schwächer die Rauschunterdrückung.

<!-- source: EN PDF p88; unit 865 -->

Wertebereich: [0, 1]; Standardwert: 0.8.

<!-- source: EN PDF p88; unit 866 -->

##### 2.3.2   4.2.3.3 Abstimmungsschritte

<!-- source: EN PDF p88; unit 867 -->

Das SHARP-Modul deaktivieren.

<!-- source: EN PDF p88; unit 868 -->

Die niederfrequenten Entrauschungsparameter wie Lob, Lothred Adi, Lowitt, Lobivet usw. anpassen.

<!-- source: EN PDF p88; unit 869 -->

Die hochfrequenten Entrauschungsparameter wie Hewitt und Hesley Adi anpassen.

<!-- source: EN PDF p88; unit 870 -->

An_Strent anpassen, um die Rauschintensität in den Ecken einzustellen.

<!-- source: EN PDF p88; unit 871 -->

Ian Adjast Sresh und Ian Adjast Skelle anpassen, um das Rauschen im bewegten Bereich einzustellen.

<!-- source: EN PDF p88; unit 872 -->

Rauschunterdrückung und Detailverlust insgesamt gegeneinander abwägen. Je stärker die Entrauschung, desto niederfrequenter wird das verbleibende Rauschen.

<!-- source: EN PDF p88; unit 873 -->

#### 2.4   4.2.4 CNR

<!-- source: EN PDF p88; unit 874 -->

##### 2.4.1   4.2.4.1 Funktionsbeschreibung

<!-- source: EN PDF p88; unit 875 -->

Dieses Modul dient hauptsächlich der Farbrauschunterdrückung für UV-Daten. Sein Algorithmus ähnelt dem UVNR-Modul von RK ISP2X.

<!-- source: EN PDF p88; unit 876 -->

Das Bild wird hauptsächlich auf verschiedenen Skalen heruntergerechnet und schließlich wieder auf die Größe des Originalbilds hochgerechnet.

<!-- source: EN PDF p88; unit 877 -->

Bei der Abwärts- und Aufwärtsskalierung jeder Stufe wird eine Medianfilterung ausgeführt. Anschließend werden die UV-Daten bilateral gefiltert und das Farbrauschen an Kanten anhand des y-Gradienten verarbeitet. Schließlich wird das Ergebnis mit dem nicht entrauschten Bild interpoliert.

<!-- source: EN PDF p88; unit 878 -->

Es unterstützt separate Schärfungsparametereinstellungen für ein hohes und ein niedriges Signal-Rausch-Verhältnis.

<!-- source: EN PDF p89; unit 879 -->

Beispielsweise entspricht bei einem CIS mit Dual Conversion Gain (DCG) der High Conversion Gain (HCG) dem Modus mit hohem Signal-Rausch-Verhältnis und der Low Conversion Gain dem Modus mit niedrigem Signal-Rausch-Verhältnis; die Quelle bezeichnet auch Letzteres hier als HCG.

<!-- source: EN PDF p89; unit 880 -->

![Originalabbildung aus dem englischen PDF, S. 89](/docs/rockchip-isp30-tuning/assets/en-p089-X680.png)

<!-- source: EN PDF p89; unit 881 -->

Abb. 4-2-3-1 Funktionsblockdiagramm von CNR

<!-- source: EN PDF p90; unit 882 -->

##### 2.4.2   4.2.4.2 Wichtige Parameter

<!-- source: EN PDF p90; unit 883 -->

| Parametername | Parameter-<br>typ | Kurzbeschreibung |
| --- | --- | --- |
| Enable | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| SNR_Mode | Modus-<br>parameter | DCG-Modus entspricht dem Modus mit hohem bzw.<br>niedrigem Signal-Rausch-Verhältnis |
| Sensor_Mode | Modus-<br>parameter | DCG-Modus des Sensors |
| iso | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hf_bypass | Abstimmungs-<br>parameter | Selten angepasst; Schalter eines internen<br>Moduls |
| lf_bypass | Abstimmungs-<br>parameter | Selten angepasst; Schalter eines internen<br>Moduls |
| global_gain | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| global_gain_alpha | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| global_gain_scale | Abstimmungs-<br>parameter | Selten angepasster Parameter |
| gain_adj_strength_ratio | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| color_sat_adj | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| color_sat_adj_alpha | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hf_spikes_reducion_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hf_denoise_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hf_color_sat | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hf_denoise_alpha | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hf_bf_wgt_clip | Abstimmungs-<br>parameter | Häufig angepasster Parameter |

<!-- source: EN PDF p91; unit 884 -->

| Parametername | Parameter-<br>typ | Kurzbeschreibung |
| --- | --- | --- |
| thumb_spikes_reducion_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| thumb_denoise_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| thumb_color_sat | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| lf_denoise_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| lf_color_sat | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| lf_denoise_alpha | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| kernel_5x5 | Abstimmungs-<br>parameter | Selten angepasster Parameter |

<!-- source: EN PDF p91; unit 885 -->

###### 2.4.2.1   Enable

<!-- source: EN PDF p91; unit 886 -->

【Beschreibung】

<!-- source: EN PDF p91; unit 887 -->

Aktivierungsschalter des Moduls. 1: Modul eingeschaltet; 0: Modul ausgeschaltet.

<!-- source: EN PDF p91; unit 888 -->

###### 2.4.2.2   SNR_Mode

<!-- source: EN PDF p91; unit 889 -->

【Beschreibung】

<!-- source: EN PDF p91; unit 890 -->

LCG und HCG entsprechen unterschiedlichen Rauschmodi. HSNR entspricht HCG, LSNR entspricht dem LCG-Modus.

<!-- source: EN PDF p91; unit 891 -->

###### 2.4.2.3   Sensor_Mode

<!-- source: EN PDF p91; unit 892 -->

【Beschreibung】

<!-- source: EN PDF p91; unit 893 -->

Vom Sensor unterstützte HCG- und LCG-Modi. Wird der DCG-Modus nicht unterstützt, werden standardmäßig die LCG-Parameter verwendet.

<!-- source: EN PDF p92; unit 894 -->

###### 2.4.2.4   ISO

<!-- source: EN PDF p92; unit 895 -->

【Beschreibung】

<!-- source: EN PDF p92; unit 896 -->

Unterschiedliche ISO-Stufen entsprechen unterschiedlichen Abstimmungsparametern. Derzeit werden nur 13 Stufen unterstützt.

<!-- source: EN PDF p92; unit 897 -->

###### 2.4.2.5   hf_bypass

<!-- source: EN PDF p92; unit 898 -->

【Beschreibung】

<!-- source: EN PDF p92; unit 899 -->

Umgehung der hochfrequenten Rauschunterdrückung. 0: keine Umgehung; 1: Umgehung.

<!-- source: EN PDF p92; unit 900 -->

###### 2.4.2.6   lf_bypass

<!-- source: EN PDF p92; unit 901 -->

【Beschreibung】

<!-- source: EN PDF p92; unit 902 -->

Umgehung der niederfrequenten Rauschunterdrückung. 0: keine Umgehung; 1: Umgehung.

<!-- source: EN PDF p92; unit 903 -->

###### 2.4.2.7   global_gain/global_gain_alpha

<!-- source: EN PDF p92; unit 904 -->

【Beschreibung】

<!-- source: EN PDF p92; unit 905 -->

Konfiguration der Interpolationsstärke zwischen lokalem und globalem Modus der CNR-Entrauschung.

<!-- source: EN PDF p92; unit 906 -->

In der Regel wird der Standardwert verwendet; ohne zusätzliche Konfiguration wird die lokale Verstärkung verwendet.

<!-- source: EN PDF p92; unit 907 -->

Formel: Gain=(global_gain_alphaglobal_gain+(8-global_gain_alpha)local_gain)&gt;&gt;3

<!-- source: EN PDF p92; unit 908 -->

Wertebereich von global gain alpha: [0.0 1.0]; Standardwert: 0.

<!-- source: EN PDF p92; unit 909 -->

Wertebereich von global gain: 0.0 bis 64.0; Standardwert: 1.

<!-- source: EN PDF p92; unit 910 -->

###### 2.4.2.8   local_gain_scale

<!-- source: EN PDF p92; unit 911 -->

【Beschreibung】

<!-- source: EN PDF p92; unit 912 -->

Verstärkt die CNR-Entrauschungsstärke. In der Regel wird der Standardwert verwendet; dieser Parameter lässt sich nicht leicht abstimmen.

<!-- source: EN PDF p92; unit 913 -->

Wertebereich: 0 bis 128; Standardwert: 1.

<!-- source: EN PDF p93; unit 914 -->

###### 2.4.2.9   gain_adj_strength_ratio

<!-- source: EN PDF p93; unit 915 -->

【Beschreibung】

<!-- source: EN PDF p93; unit 916 -->

Die Filterstärke anhand des lokalen Verstärkungswerts anpassen. Je niedriger der Wert, desto stärker die Rauschunterdrückung.

<!-- source: EN PDF p93; unit 917 -->

Wertebereich: [1, 255]; Standardwert: 255.

<!-- source: EN PDF p93; unit 918 -->

###### 2.4.2.10   color_sat_adj

<!-- source: EN PDF p93; unit 919 -->

【Beschreibung】

<!-- source: EN PDF p93; unit 920 -->

UV-Verhältnis der anhand des Gradienten angepassten bilateralen Filterung, 1~255. Je kleiner der Wert, desto besser wird Farbrauschen unterdrückt.

<!-- source: EN PDF p93; unit 921 -->

Zulässige Werte: [1, 255]. Standardwert: 40.

<!-- source: EN PDF p93; unit 922 -->

###### 2.4.2.11   color_sat_adj_alpha

<!-- source: EN PDF p93; unit 923 -->

【Beschreibung】

<!-- source: EN PDF p93; unit 924 -->

Anpassungsverhältnis von color_sat_adj. Je höher der Wert, desto besser wird Farbrauschen unterdrückt.

<!-- source: EN PDF p93; unit 925 -->

Wertebereich: 0 bis 1.0. Standardwert: 0.8.

<!-- source: EN PDF p93; unit 926 -->

###### 2.4.2.12   hf_spikes_reducion_strength

<!-- source: EN PDF p93; unit 927 -->

【Beschreibung】

<!-- source: EN PDF p93; unit 928 -->

Stärke des hochfrequenten Medianfilters. Je höher der Wert, desto stärker die Medianfilterung.

<!-- source: EN PDF p93; unit 929 -->

Wertebereich: 0 bis 1.0. Standardwert: 0.5.

<!-- source: EN PDF p93; unit 930 -->

###### 2.4.2.13   hf_denoise_strength

<!-- source: EN PDF p93; unit 931 -->

【Beschreibung】

<!-- source: EN PDF p93; unit 932 -->

Stärke des hochfrequenten bilateralen Filters. Je höher der Wert, desto besser wird Farbrauschen unterdrückt.

<!-- source: EN PDF p93; unit 933 -->

Wertebereich: [1, 1023]. Standardwert: 10.

<!-- source: EN PDF p94; unit 934 -->

###### 2.4.2.14   hf_color_sat

<!-- source: EN PDF p94; unit 935 -->

【Beschreibung】

<!-- source: EN PDF p94; unit 936 -->

UV-Skalierungsfaktor für die hochfrequente bilaterale Filterung. Je niedriger der Wert, desto stärker sinkt die Farbsättigung.

<!-- source: EN PDF p94; unit 937 -->

Wertebereich: 0.0 bis 7.9. Standardwert: 1.5.

<!-- source: EN PDF p94; unit 938 -->

###### 2.4.2.15   hf_denoise_alpha

<!-- source: EN PDF p94; unit 939 -->

【Beschreibung】

<!-- source: EN PDF p94; unit 940 -->

Gewicht des Mittelpunkts des hochfrequenten bilateralen Filters.

<!-- source: EN PDF p94; unit 941 -->

Zulässige Werte: 0.0 bis 1.0. Standardwert: 0.

<!-- source: EN PDF p94; unit 942 -->

###### 2.4.2.16   hf_bf_wgt_clip

<!-- source: EN PDF p94; unit 943 -->

【Beschreibung】

<!-- source: EN PDF p94; unit 944 -->

Minimale Entrauschung bei hohen Frequenzen. Je höher der Wert, desto stärker die Entrauschung.

<!-- source: EN PDF p94; unit 945 -->

Wertebereich: 0 bis 255. Standardwert: 0.

<!-- source: EN PDF p94; unit 946 -->

###### 2.4.2.17   thumb_spikes_reducion_strength

<!-- source: EN PDF p94; unit 947 -->

【Beschreibung】

<!-- source: EN PDF p94; unit 948 -->

Stärke des Medianfilters für das Vorschaubild. Je höher der Wert, desto stärker die Medianfilterung.

<!-- source: EN PDF p94; unit 949 -->

Zulässige Werte: 0.0 bis 1.0. Standardwert: 0.5.

<!-- source: EN PDF p94; unit 950 -->

###### 2.4.2.18   thumb_denoise_strength

<!-- source: EN PDF p94; unit 951 -->

【Beschreibung】

<!-- source: EN PDF p94; unit 952 -->

Stärke des bilateralen Filters für das Vorschaubild. Je höher der Wert, desto besser wird Farbrauschen unterdrückt.

<!-- source: EN PDF p94; unit 953 -->

Wertebereich: [1, 1023]. Standardwert: 8.

<!-- source: EN PDF p95; unit 954 -->

###### 2.4.2.19   thumb_color_sat

<!-- source: EN PDF p95; unit 955 -->

【Beschreibung】

<!-- source: EN PDF p95; unit 956 -->

UV-Skalierungsfaktor der bilateralen Filterung des Vorschaubilds; die Quelle beschreibt eine stärkere Abnahme der Farbsättigung, ohne hier die Änderungsrichtung des Parameters anzugeben.

<!-- source: EN PDF p95; unit 957 -->

Wertebereich: 0.0 bis 7.9. Standardwert: 4.

<!-- source: EN PDF p95; unit 958 -->

###### 2.4.2.20   lf_denoise_strength

<!-- source: EN PDF p95; unit 959 -->

【Beschreibung】

<!-- source: EN PDF p95; unit 960 -->

Stärke der niederfrequenten bilateralen Filterung. Je höher der Wert, desto besser wird Farbrauschen unterdrückt.

<!-- source: EN PDF p95; unit 961 -->

Wertebereich: [1, 1023]. Standardwert: 8.

<!-- source: EN PDF p95; unit 962 -->

###### 2.4.2.21   lf_color_sat

<!-- source: EN PDF p95; unit 963 -->

【Beschreibung】

<!-- source: EN PDF p95; unit 964 -->

UV-Verhältnis der niederfrequenten bilateralen Filterung. Je niedriger der Wert, desto stärker sinkt die Farbsättigung.

<!-- source: EN PDF p95; unit 965 -->

Wertebereich: 0.0 bis 7.9. Standardwert: 4.

<!-- source: EN PDF p95; unit 966 -->

###### 2.4.2.22   lf_denoise_alpha

<!-- source: EN PDF p95; unit 967 -->

【Beschreibung】

<!-- source: EN PDF p95; unit 968 -->

Gewicht des Mittelpunkts des niederfrequenten bilateralen Filters.

<!-- source: EN PDF p95; unit 969 -->

Zulässige Werte: 0.0 bis 1.0. Standardwert: 0.5.

<!-- source: EN PDF p95; unit 970 -->

###### 2.4.2.23   kernel_5x5

<!-- source: EN PDF p95; unit 971 -->

【Beschreibung】

<!-- source: EN PDF p95; unit 972 -->

5x5-Kern des bilateralen Filters.

<!-- source: EN PDF p96; unit 973 -->

##### 2.4.3   4.2.4.3 Abstimmungsschritte

<!-- source: EN PDF p96; unit 974 -->

Das SHARP-Modul deaktivieren.

<!-- source: EN PDF p96; unit 975 -->

Parameter wie denoise_strength, denoise_alpha und color_sat jeder Stufe anpassen.

<!-- source: EN PDF p96; unit 976 -->

Die Unterdrückung hoch- und niederfrequenten Farbrauschens steuern und dabei Beeinträchtigungen wie Farbflecken und verringerte Sättigung abwägen.

<!-- source: EN PDF p96; unit 977 -->

#### 2.5   4.2.5 SHARP

<!-- source: EN PDF p96; unit 978 -->

##### 2.5.1   4.2.5.1 Funktionsbeschreibung

<!-- source: EN PDF p96; unit 979 -->

Das Sharpen-Modul erhöht die Bildschärfe. Sein Algorithmus ähnelt dem von rk isp2x.

<!-- source: EN PDF p96; unit 980 -->

Es extrahiert hauptsächlich hochfrequente Daten und führt anschließend Vorfilterung, Schärfeverstärkung und Rauschunterdrückung aus. Schließlich wird das Ergebnis durch Interpolation mit dem ungeschärften Originalbild überlagert.

<!-- source: EN PDF p96; unit 981 -->

Es unterstützt separate Schärfungsparametereinstellungen für Rauschmodi mit hohem und niedrigem Signal-Rausch-Verhältnis.

<!-- source: EN PDF p96; unit 982 -->

Beispielsweise entspricht bei einem CIS mit Dual Conversion Gain (DCG) der High Conversion Gain (HCG) dem Modus mit hohem Signal-Rausch-Verhältnis und der Low Conversion Gain dem Modus mit niedrigem Signal-Rausch-Verhältnis; die Quelle bezeichnet auch Letzteres hier als HCG.

<!-- source: EN PDF p96; unit 983 -->

![Originalabbildung aus dem englischen PDF, S. 96](/docs/rockchip-isp30-tuning/assets/en-p096-X720.png)

<!-- source: EN PDF p96; unit 984 -->

Abbildung 4-2-5-1 Blockdiagramm der SHARP-Funktionen

<!-- source: EN PDF p97; unit 985 -->

##### 2.5.2   4.2.5.2 Wichtige Parameter

<!-- source: EN PDF p97; unit 986 -->

| Parametername | Parameter-<br>typ | Kurzbeschreibung |
| --- | --- | --- |
| Enable | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| SNR_Mode | Modus-<br>parameter | DCG-Modus entspricht dem Modus mit hohem bzw.<br>niedrigem Signal-Rausch-Verhältnis |
| Sensor_Mode | Modus-<br>parameter | DCG-Modus des Sensors |
| iso | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| pbf_gain | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| pbf_add | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| pbf_ratio | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| gaus_ratio | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| sharp_ratio | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| bf_gain | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| bf_add | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| luma_point / luma_sigma | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| luma_point / hf_clip | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| luma_point /<br>local_sharp_strength | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| prefilter_coeff | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| GaussianFilter_coeff | Abstimmungs-<br>parameter | Häufig angepasster Parameter |
| hfBilateralFilter_coeff | Abstimmungs-<br>parameter | Häufig angepasster Parameter |

<!-- source: EN PDF p98; unit 987 -->

###### 2.5.2.1   Enable:

<!-- source: EN PDF p98; unit 988 -->

【Beschreibung】

<!-- source: EN PDF p98; unit 989 -->

Aktivierungsschalter des Sharp-Moduls.

<!-- source: EN PDF p98; unit 990 -->

1: Modul eingeschaltet; 0: Modul ausgeschaltet.

<!-- source: EN PDF p98; unit 991 -->

###### 2.5.2.2   SNR_Mode

<!-- source: EN PDF p98; unit 992 -->

【Beschreibung】

<!-- source: EN PDF p98; unit 993 -->

LCG und HCG entsprechen unterschiedlichen Rauschmodi. HSNR entspricht HCG, LSNR entspricht dem LCG-Modus.

<!-- source: EN PDF p98; unit 994 -->

###### 2.5.2.3   Sensor_Mode

<!-- source: EN PDF p98; unit 995 -->

【Beschreibung】

<!-- source: EN PDF p98; unit 996 -->

Vom Sensor unterstützte HCG- und LCG-Modi. Wird der DCG-Modus nicht unterstützt, werden standardmäßig die LCG-Parameter verwendet.

<!-- source: EN PDF p98; unit 997 -->

###### 2.5.2.4   ISO

<!-- source: EN PDF p98; unit 998 -->

【Beschreibung】

<!-- source: EN PDF p98; unit 999 -->

Unterschiedliche ISO-Stufen entsprechen unterschiedlichen Abstimmungsparametern. Derzeit werden nur 13 Stufen unterstützt.

<!-- source: EN PDF p98; unit 1000 -->

###### 2.5.2.5   pbf_gain

<!-- source: EN PDF p98; unit 1001 -->

【Beschreibung】

<!-- source: EN PDF p98; unit 1002 -->

Multiplikationsverhältnis für das Sigma der Vorfilterung. Je größer der Wert, desto stärker die Filterung und desto geringer das Rauschen und die Detailmenge.

<!-- source: EN PDF p98; unit 1003 -->

Wertebereich: [0.0, 2.0]; Standardwert: 1.0.

<!-- source: EN PDF p98; unit 1004 -->

###### 2.5.2.6   pbf_add

<!-- source: EN PDF p98; unit 1005 -->

【Beschreibung】

<!-- source: EN PDF p98; unit 1006 -->

Additiver Offset für das Sigma der Vorfilterung. Je größer der Wert, desto stärker die Filterung und desto geringer das Rauschen und die Detailmenge.

<!-- source: EN PDF p99; unit 1007 -->

Wertebereich: [0, 1023]; Standardwert: 0.

<!-- source: EN PDF p99; unit 1008 -->

###### 2.5.2.7   pbf_ratio

<!-- source: EN PDF p99; unit 1009 -->

【Beschreibung】

<!-- source: EN PDF p99; unit 1010 -->

Fusionsgewicht der Vorfilterung. Je größer der Wert, desto stärker die Filterung und desto geringer das Rauschen und die Detailmenge.

<!-- source: EN PDF p99; unit 1011 -->

Wertebereich: [0.0, 1.0]; Standardwert: 0.5.

<!-- source: EN PDF p99; unit 1012 -->

###### 2.5.2.8   gaus_ratio

<!-- source: EN PDF p99; unit 1013 -->

【Beschreibung】

<!-- source: EN PDF p99; unit 1014 -->

Das Führungsbild für die hochfrequente bilaterale Filterung entsteht durch Fusion des gaußgefilterten Bilds mit dem Originalbild.

<!-- source: EN PDF p99; unit 1015 -->

Je größer der Wert, desto größer das Führungsgewicht des gaußschen bilateralen Filters.

<!-- source: EN PDF p99; unit 1016 -->

Wertebereich: [0.0, 1.0]; Standardwert: 0.

<!-- source: EN PDF p99; unit 1017 -->

###### 2.5.2.9   sharp_ratio

<!-- source: EN PDF p99; unit 1018 -->

【Beschreibung】

<!-- source: EN PDF p99; unit 1019 -->

Schärfungsstärke. Je höher der Wert, desto stärker die Schärfung.

<!-- source: EN PDF p99; unit 1020 -->

Wertebereich: [0.0, 32]; Standardwert: 6.

<!-- source: EN PDF p99; unit 1021 -->

###### 2.5.2.10   bf_gain

<!-- source: EN PDF p99; unit 1022 -->

【Beschreibung】

<!-- source: EN PDF p99; unit 1023 -->

Multiplikationsverhältnis für das Sigma der hochfrequenten bilateralen Filterung. Je größer der Wert, desto stärker die Filterung und desto geringer das Rauschen und die Detailmenge.

<!-- source: EN PDF p99; unit 1024 -->

Wertebereich: [0.0, 2.0]; Standardwert: 1.0.

<!-- source: EN PDF p99; unit 1025 -->

###### 2.5.2.11   bf_add

<!-- source: EN PDF p99; unit 1026 -->

【Beschreibung】

<!-- source: EN PDF p99; unit 1027 -->

Additiver Offset für das Sigma der hochfrequenten bilateralen Filterung. Je größer der Wert, desto stärker die Filterung und desto geringer das Rauschen und die Detailmenge.

<!-- source: EN PDF p100; unit 1028 -->

Wertebereich: [0, 1023]; Standardwert: 0.

<!-- source: EN PDF p100; unit 1029 -->

###### 2.5.2.12   bf_ratio

<!-- source: EN PDF p100; unit 1030 -->

【Beschreibung】

<!-- source: EN PDF p100; unit 1031 -->

Fusionsgewicht des hochfrequenten bilateralen Filters. Je größer der Wert, desto stärker die Filterung und desto geringer das Rauschen und die Detailmenge.

<!-- source: EN PDF p100; unit 1032 -->

Wertebereich: [0.0, 1.0]; Standardwert: 0.5.

<!-- source: EN PDF p100; unit 1033 -->

###### 2.5.2.13   luma_point / luma_sigma

<!-- source: EN PDF p100; unit 1034 -->

【Beschreibung】

<!-- source: EN PDF p100; unit 1035 -->

Unterschiedlichen Pixelhelligkeiten entsprechen unterschiedliche Rausch-SIGMA-Kurven.

<!-- source: EN PDF p100; unit 1036 -->

luma_point ist der Helligkeitswert der Kurve, Wertebereich [0, 1023].

<!-- source: EN PDF p100; unit 1037 -->

luma_sigma ist der Rauschintensitätswert, Wertebereich [0, 1023].

<!-- source: EN PDF p100; unit 1038 -->

###### 2.5.2.14   luma_point / hf_clip

<!-- source: EN PDF p100; unit 1039 -->

【Beschreibung】

<!-- source: EN PDF p100; unit 1040 -->

Begrenzungsbereich der hochfrequenten Werte bei unterschiedlichen Pixelhelligkeiten.

<!-- source: EN PDF p100; unit 1041 -->

Je höher der Wert, desto größer die maximal zulässige Schärfungsstärke.

<!-- source: EN PDF p100; unit 1042 -->

Wertebereich: [0, 1023]. Standardwert: 256.

<!-- source: EN PDF p100; unit 1043 -->

###### 2.5.2.15   luma_point / local_sharp_strength

<!-- source: EN PDF p100; unit 1044 -->

【Beschreibung】

<!-- source: EN PDF p100; unit 1045 -->

Berechnet das Verhältnis beziehungsweise die Überlagerungsgewichte hoher Frequenzen für unterschiedliche Pixelhelligkeiten.

<!-- source: EN PDF p100; unit 1046 -->

Je höher der Wert, desto größer der zur Überlagerung zugelassene Hochfrequenzanteil und desto schärfer das Bild.

<!-- source: EN PDF p101; unit 1047 -->

###### 2.5.2.16   prefilter_coeff:

<!-- source: EN PDF p101; unit 1048 -->

【Beschreibung】

<!-- source: EN PDF p101; unit 1049 -->

Operatoren der Vorfilterung.

<!-- source: EN PDF p101; unit 1050 -->

###### 2.5.2.17   GaussianFilter_coeff

<!-- source: EN PDF p101; unit 1051 -->

【Beschreibung】

<!-- source: EN PDF p101; unit 1052 -->

Operatoren des Gaußfilters.

<!-- source: EN PDF p101; unit 1053 -->

###### 2.5.2.18   hfBilateralFilter_coeff

<!-- source: EN PDF p101; unit 1054 -->

【Beschreibung】

<!-- source: EN PDF p101; unit 1055 -->

Operator der hochfrequenten bilateralen Filterung.

<!-- source: EN PDF p101; unit 1056 -->

##### 2.5.3   4.2.5.3 Abstimmungsschritte

<!-- source: EN PDF p101; unit 1057 -->

sharp_ratio, local_sharp_strength und hf_clip anpassen, um die Stärke der hochfrequenten Kantenverstärkung zu steuern.

<!-- source: EN PDF p101; unit 1058 -->

Die Parameter gaus_ratio, pbf_ratio, pbf_gain, pbf_add, bf_ratio, bf_gain und bf_add anpassen, um durch Schärfung verursachtes Rauschen zu reduzieren und Rauschen gegen scharfe Details abzuwägen.

<!-- source: EN PDF p101; unit 1059 -->

Das Sharp-Modul kann Details verstärken und gleichzeitig Rauschen unterdrücken, führt letztlich jedoch unvermeidlich zu einer Zunahme des Gesamtrauschens.

<!-- source: EN PDF p101; unit 1060 -->

### 3.   4.3 MERGE

<!-- source: EN PDF p101; unit 1061 -->

#### 3.1   4.3.1 Funktionsbeschreibung

<!-- source: EN PDF p101; unit 1062 -->

Mit diesem Modul lässt sich der Anteil langer, mittlerer und kurzer Bilder bei der Zusammenführung einstellen. Der Anteil eines Bildes ergibt sich aus dem Produkt seines Überbelichtungsgewichts und seines Bewegungsgewichts. Das Überbelichtungsgewicht wird durch die Überbelichtungskurve, das Bewegungsgewicht durch die Bewegungskurve bestimmt.

<!-- source: EN PDF p101; unit 1063 -->

Als Referenzbild für die Zusammenführung kann ein langes oder kurzes Bild gewählt werden; dies entspricht dem Langbild- bzw. Kurzbildmodus.

<!-- source: EN PDF p102; unit 1064 -->

Die Überbelichtungskurve wird durch OECurve_smooth und OECurve_offset bestimmt. Im Zwei-Bild-Modus wird Überbelichtung zwischen langem und kurzem Bild beurteilt, im Drei-Bild-Modus zwischen langem und mittlerem Bild.

<!-- source: EN PDF p102; unit 1065 -->

Im Langbildmodus gibt es Bewegungskurven zwischen langem und mittlerem Bild (LM_smooth und LM_offset) sowie zwischen mittlerem und kurzem Bild (MS_smooth und MS_offset). Im Zwei-Bild-Modus wirken nur die Kurven zwischen mittlerem und kurzem Bild. Im Kurzbildmodus wird die Kurve durch Coef, ms_thd0 und lm_thd0 bestimmt.

<!-- source: EN PDF p102; unit 1066 -->

![Originalabbildung aus dem englischen PDF, Seite 102](/docs/rockchip-isp30-tuning/assets/en-p102-X759.png)

<!-- source: EN PDF p102; unit 1067 -->

MERGE-Blockdiagramm

<!-- source: EN PDF p102; unit 1068 -->

#### 3.2   4.3.2 Wichtige Parameter

<!-- source: EN PDF p102; unit 1069 -->

##### 3.2.1   4.3.2.1 BaseFrm

<!-- source: EN PDF p102; unit 1070 -->

【Beschreibung】

<!-- source: EN PDF p102; unit 1071 -->

Auswahl des Referenzbildes für die Zusammenführung.

<!-- source: EN PDF p102; unit 1072 -->

【Mitglieder】

<!-- source: EN PDF p102; unit 1073 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| BASEFRAME_LONG | Lange Bilder dienen als Referenz. |
| BASEFRAME_SHORT | Kurze Bilder dienen als Referenz. |

<!-- source: EN PDF p102; unit 1074 -->

【Hinweise】

<!-- source: EN PDF p102; unit 1075 -->

Mit BASEFRAME_LONG und BASEFRAME_SHORT ist die Helligkeit nach der Zusammenführung im Wesentlichen gleich. Der Hauptunterschied: BASEFRAME_SHORT verbessert Bewegungsschlieren, BASEFRAME_LONG das Rauschverhalten.

<!-- source: EN PDF p103; unit 1076 -->

Im Modus BASEFRAME_LONG wirken die Parameter in LongFrmModeData, im Modus BASEFRAME_SHORT diejenigen in ShortFrmModeData.

<!-- source: EN PDF p103; unit 1077 -->

##### 3.2.2   4.3.2.2 ByPassThr

<!-- source: EN PDF p103; unit 1078 -->

【Beschreibung】

<!-- source: EN PDF p103; unit 1079 -->

Bypass-Schwelle dieses Moduls, Wertebereich [0,1]. Ist der prozentuale Unterschied zwischen der aktuellen Umgebungshelligkeit und der des vorherigen Bildes kleiner als ByPassThr, werden die Modulparameter nicht aktualisiert.

<!-- source: EN PDF p103; unit 1080 -->

【Mitglieder】

<!-- source: EN PDF p103; unit 1081 -->

【Hinweise】

<!-- source: EN PDF p103; unit 1082 -->

Während der Abstimmung mit dem Werkzeug den Wert auf 0 setzen, da die Abstimmung sonst möglicherweise unwirksam bleibt.

<!-- source: EN PDF p103; unit 1083 -->

##### 3.2.3   4.3.2.3 LongFrmModeData

<!-- source: EN PDF p103; unit 1084 -->

【Beschreibung】

<!-- source: EN PDF p103; unit 1085 -->

MERGE-Parameter im Langbildmodus.

<!-- source: EN PDF p103; unit 1086 -->

【Mitglieder】

<!-- source: EN PDF p103; unit 1087 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| OECurve | Parameter der Überbelichtungskurve |
| MDCurve | Parameter der Bewegungskurve |
| OECurve_damp | Glättungskoeffizient für Änderungen der Überbelichtungskurve: Anteil der Parameter des aktuellen Bildes. Wertebereich [0,1], Standardwert 0.9. |
| MDCurveLM_damp | Glättungskoeffizient für Änderungen der Bewegungskurve zwischen langem und mittlerem Bild: Anteil der Parameter des aktuellen Bildes. Wertebereich [0,1], Standardwert 0.9. Im Modus HDR x2 unwirksam. |
| MDCurveMS_damp | Glättungskoeffizient für Änderungen der Bewegungskurve zwischen mittlerem und kurzem Bild: Anteil der Parameter des aktuellen Bildes. Wertebereich [0,1], Standardwert 0.9. |

<!-- source: EN PDF p103; unit 1088 -->

【Hinweise】

<!-- source: EN PDF p103; unit 1089 -->

###### 3.2.3.1   4.3.2.3.1 EnableEachChn

<!-- source: EN PDF p103; unit 1090 -->

【Beschreibung】

<!-- source: EN PDF p103; unit 1091 -->

Schalter zur einkanaligen Überbelichtungserkennung. 0: aus, 1: ein.

<!-- source: EN PDF p103; unit 1092 -->

【Mitglieder】

<!-- source: EN PDF p104; unit 1093 -->

【Hinweise】

<!-- source: EN PDF p104; unit 1094 -->

Bei einem überbelichteten einfarbigen Bildbereich wird die Aktivierung empfohlen, wenn nach der Zusammenführung starkes Rauschen in diesem Bereich auftritt.

<!-- source: EN PDF p104; unit 1095 -->

###### 3.2.3.2   4.3.2.3.2 OECurve

<!-- source: EN PDF p104; unit 1096 -->

【Beschreibung】

<!-- source: EN PDF p104; unit 1097 -->

Parameter der Überbelichtungskurve im Langbildmodus.

<!-- source: EN PDF p104; unit 1098 -->

【Mitglieder】

<!-- source: EN PDF p104; unit 1099 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| EnvLv | Parameter der Überbelichtungskurve |
| EnvLv_len | Länge des EnvLv-Arrays |
| Smooth | Steigung der Überbelichtungskurve. Wertebereich [0,1], Standardwert 0.4, Genauigkeit 0.01. |
| Smooth_len | Länge des Smooth-Arrays |
| Offset | Versatz der Überbelichtungskurve. Wertebereich [108,280], Standardwert 210, Genauigkeit 0.1. |
| Offset_len | Länge des Offset-Arrays |

<!-- source: EN PDF p104; unit 1100 -->

【Hinweise】

<!-- source: EN PDF p104; unit 1101 -->

###### 3.2.3.3   4.3.2.3.3 MDCurve

<!-- source: EN PDF p104; unit 1102 -->

【Beschreibung】

<!-- source: EN PDF p104; unit 1103 -->

Parameter der Bewegungskurve im Langbildmodus.

<!-- source: EN PDF p104; unit 1104 -->

【Mitglieder】

<!-- source: EN PDF p105; unit 1105 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| MoveCoef | Bewegungsgrad des Bildes, Wertebereich [0,1]. 0 bedeutet vollständigen Stillstand, 1 vollständige Bewegung. |
| MoveCoef_len | Länge des MoveBeef-Arrays (Schreibweise der Vorlage). |
| LM_smooth | Steigung der Bewegungskurve zwischen langem und mittlerem Bild. Wertebereich [0,1], Standardwert 0.4. Im Modus HDR x2 unwirksam. |
| LM_smooth_len | Länge des LM_smooth-Arrays |
| LM_offset | Versatz der Bewegungskurve zwischen langem und mittlerem Bild. Wertebereich [0.26,1], Standardwert 0.38. Im Modus HDR x2 unwirksam. |
| LM_offset_len | Länge des LM_offset-Arrays |
| MS_smooth | Steigung der Bewegungskurve zwischen mittlerem und kurzem Bild. Wertebereich [0,1], Standardwert 0.4. |
| MS_smooth_len | Länge des MS_smooth-Arrays |
| MS_offset | Versatz der Bewegungskurve zwischen mittlerem und kurzem Bild. Wertebereich [0.26,1], Standardwert 0.38. |
| MS_offset_len | Länge des MS_offset-Arrays |

<!-- source: EN PDF p105; unit 1106 -->

【Hinweise】

<!-- source: EN PDF p105; unit 1107 -->

MoveCoef: Da derzeit keine Szenenerkennung erfolgt, lässt sich das Bewegungsausmaß nicht ermitteln. In der tatsächlichen Verwendung ist MoveComeEf gleich 1 (Schreibweise der Vorlage).

<!-- source: EN PDF p105; unit 1108 -->

##### 3.2.4   4.3.2.4 ShortFrmModeData

<!-- source: EN PDF p105; unit 1109 -->

【Beschreibung】

<!-- source: EN PDF p105; unit 1110 -->

MERGE-Parameter im Kurzbildmodus.

<!-- source: EN PDF p105; unit 1111 -->

【Mitglieder】

<!-- source: EN PDF p105; unit 1112 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| OECurve | Parameter der Überbelichtungskurve |
| MDCurve | Parameter der Bewegungskurve |
| OECurve_damp | Glättungskoeffizient für Änderungen der Überbelichtungskurve: Anteil der Parameter des aktuellen Bildes. Wertebereich [0,1], Standardwert 0.9. |
| MDCurve_damp | Glättungskoeffizient für Änderungen der Bewegungskurve: Anteil der Parameter des aktuellen Bildes. Wertebereich [0,1], Standardwert 0.9. |

<!-- source: EN PDF p105; unit 1113 -->

【Hinweise】

<!-- source: EN PDF p106; unit 1114 -->

###### 3.2.4.1   4.3.2.4.1 OECurve

<!-- source: EN PDF p106; unit 1115 -->

【Beschreibung】

<!-- source: EN PDF p106; unit 1116 -->

Parameter der Überbelichtungskurve im Langbildmodus.

<!-- source: EN PDF p106; unit 1117 -->

【Mitglieder】

<!-- source: EN PDF p106; unit 1118 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| EnvLv | Parameter der Überbelichtungskurve |
| EnvLv_len | Länge des EnvLv-Arrays |
| Smooth | Steigung der Überbelichtungskurve. Wertebereich [0,1], Standardwert 0.4, Genauigkeit 0.01. |
| Smooth_len | Länge des Smooth-Arrays |
| Offset | Versatz der Überbelichtungskurve. Wertebereich [108,280], Standardwert 210, Genauigkeit 0.1. |
| Offset_len | Länge des Offset-Arrays |

<!-- source: EN PDF p106; unit 1119 -->

【Hinweise】

<!-- source: EN PDF p106; unit 1120 -->

###### 3.2.4.2   4.3.2.4.2 MDCurve

<!-- source: EN PDF p106; unit 1121 -->

【Beschreibung】

<!-- source: EN PDF p106; unit 1122 -->

Parameter der Überbelichtungskurve im Langbildmodus.

<!-- source: EN PDF p106; unit 1123 -->

【Mitglieder】

<!-- source: EN PDF p106; unit 1124 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| MoveCoef | Bewegungsgrad des Bildes, Wertebereich [0,1]. 0 bedeutet vollständigen Stillstand, 1 vollständige Bewegung. |
| MoveCoef_len | Länge des MoveBeef-Arrays (Schreibweise der Vorlage). |
| Coef | Standardwert 0.05, Genauigkeit 0.0001. |
| Coef_len | Länge des Coef-Arrays |
| ms_thd0 | Steuerkoeffizient für kurze und mittlere Bilder. Wertebereich [0,1], Standardwert 0.0, Genauigkeit 0.1. |
| ms_thd0_len | Länge des ms_thd0-Arrays |
| lm_thd0 | Steuerkoeffizient für lange und mittlere Bilder; auf 0.0 einstellbar, Genauigkeit 0.1. Im Modus HDR x2 unwirksam. |
| lm_thd0_len | Länge des lm_thd0-Arrays |

<!-- source: EN PDF p107; unit 1125 -->

【Hinweise】

<!-- source: EN PDF p107; unit 1126 -->

#### 3.3   4.3.3 Abstimmungsschritte

<!-- source: EN PDF p107; unit 1127 -->

Die MERGE-Abstimmung umfasst hauptsächlich zwei Teile: Überbelichtungs- und Bewegungskurve.

<!-- source: EN PDF p107; unit 1128 -->

##### 3.3.1   4.3.3.1 Abstimmung der Überbelichtungskurve

<!-- source: EN PDF p107; unit 1129 -->

【Beschreibung】

<!-- source: EN PDF p107; unit 1130 -->

Die Überbelichtungskurve OECurve wird durch OECurve_smooth und OECurve_offset bestimmt, wie unten dargestellt. Gleichzeitig werden für unterschiedliche Envlv unterschiedliche Überbelichtungskurven eingestellt.

<!-- source: EN PDF p107; unit 1131 -->

![Originalabbildung aus dem englischen PDF, Seite 107](/docs/rockchip-isp30-tuning/assets/en-p107-X781.png)

<!-- source: EN PDF p107; unit 1132 -->

Schematische Darstellung von OECurve

<!-- source: EN PDF p107; unit 1133 -->

【Mitglieder】

<!-- source: EN PDF p107; unit 1134 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| Smooth | Steigung der Überbelichtungskurve |
| Offset | Steigung der Überbelichtungskurve (Bezeichnung der Vorlage) |

<!-- source: EN PDF p108; unit 1135 -->

【Hinweise】

<!-- source: EN PDF p108; unit 1136 -->

1\.Smooth：

<!-- source: EN PDF p108; unit 1137 -->

Im Bild beschreibt dieser Wert die Glättung der Übergangsbereiche zwischen langen und kurzen Bildern. Je kleiner der Wert, desto sanfter der Übergang zwischen überbelichteten und nicht überbelichteten Bereichen und desto größer der Übergangsbereich. Umgekehrt wird der Übergang abrupter, sein Bereich jedoch kleiner. In der folgenden Abbildung steht die rote Kurve für 0, die grüne für 0.4 und die blaue für 1.

<!-- source: EN PDF p108; unit 1138 -->

![Originalabbildung aus dem englischen PDF, Seite 108](/docs/rockchip-isp30-tuning/assets/en-p108-X786.png)

<!-- source: EN PDF p108; unit 1139 -->

Schematische Darstellung von OECurve_smooth

<!-- source: EN PDF p108; unit 1140 -->

2\.Offset：

<!-- source: EN PDF p108; unit 1141 -->

Im Bild bezeichnet dieser Wert den Beginn der Verwendung kurzer Bilder bei Überbelichtung. Je kleiner der Wert, desto stärker werden kurze Bilder bis zum maximalen Gewicht verwendet.

<!-- source: EN PDF p108; unit 1142 -->

Besondere Werte: Bei 108 sind sämtliche Werte der Überbelichtungskurve 1023; kurze Bilder erhalten dann das maximale Gewicht, dargestellt durch die gelbe Kurve. Bei 128 können kurze Bilder ab einer Helligkeit von 128 verwendet werden, dargestellt durch die blaue Kurve. Bei 215 beginnt ihre mögliche Verwendung ab Helligkeit 215; bei Erreichen von 256 beträgt ihr Gewicht genau 1023, dargestellt durch die grüne Kurve. Bei 280 ist die gesamte Überbelichtungskurve 0 und MERGE verwendet keine kurzen Bilder, dargestellt durch die rote Kurve:

<!-- source: EN PDF p109; unit 1143 -->

![Originalabbildung aus dem englischen PDF, Seite 109](/docs/rockchip-isp30-tuning/assets/en-p109-X789.png)

<!-- source: EN PDF p109; unit 1144 -->

Schematische Darstellung von OECurve_offset

<!-- source: EN PDF p109; unit 1145 -->

##### 3.3.2   4.3.3.2 Abstimmung der Bewegungskurve im Langbildmodus

<!-- source: EN PDF p109; unit 1146 -->

【Beschreibung】

<!-- source: EN PDF p109; unit 1147 -->

Die tatsächliche Bewegungskurve im Langbildmodus wird durch die Parametersätze MS_smooth/MS_offset und LM_smooth/LM_offset bestimmt und ist nachfolgend dargestellt.

<!-- source: EN PDF p110; unit 1148 -->

![Originalabbildung aus dem englischen PDF, Seite 110](/docs/rockchip-isp30-tuning/assets/en-p110-X793.png)

<!-- source: EN PDF p110; unit 1149 -->

Schematische Darstellung von MDCurve

<!-- source: EN PDF p110; unit 1150 -->

Bei Bewegung im Bild muss das Gewicht verringert werden, damit weniger kurze Bilder verwendet und dadurch bewegungsbedingte Geisterbilder reduziert werden. Für unterschiedliche MoveCoef werden unterschiedliche Bewegungskurven eingestellt.

<!-- source: EN PDF p110; unit 1151 -->

【Mitglieder】

<!-- source: EN PDF p110; unit 1152 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| MS_smooth | Steigung der Bewegungskurve |
| MS_offset | Steigung der Bewegungskurve (Bezeichnung der Vorlage) |

<!-- source: EN PDF p110; unit 1153 -->

【Hinweise】

<!-- source: EN PDF p110; unit 1154 -->

1\.MS_smooth：

<!-- source: EN PDF p110; unit 1155 -->

Dieser Wert beschreibt die Glättung des Übergangsbereichs zwischen kurzen und mittleren Bildern. Je kleiner der Wert, desto sanfter der Übergang zwischen überbelichteten und nicht überbelichteten Bereichen und desto größer der Übergangsbereich. Umgekehrt wird er abrupter, aber kleiner. In der folgenden Abbildung steht die grüne Kurve für 0, die rote für 0.4 und die blaue für 1.

<!-- source: EN PDF p111; unit 1156 -->

![Originalabbildung aus dem englischen PDF, Seite 111](/docs/rockchip-isp30-tuning/assets/en-p111-X796.png)

<!-- source: EN PDF p111; unit 1157 -->

Schematische Darstellung von MDCurve_smooth

<!-- source: EN PDF p111; unit 1158 -->

2\.MS_offset：

<!-- source: EN PDF p111; unit 1159 -->

Im Bild bezeichnet dieser Wert den Beginn der Verwendung kurzer Bilder bei Überbelichtung. Je kleiner der Wert, desto stärker werden kurze Bilder bis zum maximalen Gewicht verwendet. Die grüne Kurve steht für 0, die blaue für 0.38 und die rote für 1.

<!-- source: EN PDF p112; unit 1160 -->

![Originalabbildung aus dem englischen PDF, Seite 112](/docs/rockchip-isp30-tuning/assets/en-p112-X799.png)

<!-- source: EN PDF p112; unit 1161 -->

Schematische Darstellung von MDCurve_offset

<!-- source: EN PDF p112; unit 1162 -->

##### 3.3.3   4.3.3.2 Abstimmung der Bewegungskurve im Kurzbildmodus

<!-- source: EN PDF p112; unit 1163 -->

【Beschreibung】

<!-- source: EN PDF p112; unit 1164 -->

Die tatsächliche Bewegungskurve im Kurzbildmodus wird durch Coef, ms_thd0 und lm_thd0 bestimmt und ist nachfolgend dargestellt.

<!-- source: EN PDF p113; unit 1165 -->

![Originalabbildung aus dem englischen PDF, Seite 113](/docs/rockchip-isp30-tuning/assets/en-p113-X793.png)

<!-- source: EN PDF p113; unit 1166 -->

Schematische Darstellung von MDCurve

<!-- source: EN PDF p113; unit 1167 -->

Bei Bewegung im Bild muss das Gewicht verringert werden, damit weniger kurze Bilder verwendet und dadurch bewegungsbedingte Geisterbilder reduziert werden. Für unterschiedliche MoveCoef werden unterschiedliche Bewegungskurven eingestellt.

<!-- source: EN PDF p113; unit 1168 -->

【Mitglieder】

<!-- source: EN PDF p113; unit 1169 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| Coef | Steuerkoeffizient, Wertebereich [0,1], Standardwert 0.05, Genauigkeit 0.0001. |
| ms_thd0 | Steuerkoeffizient für mittlere und kurze Bilder. Wertebereich [0,1], Standardwert 0.0, Genauigkeit 0.1. |
| lm_thd0 | Steuerkoeffizient für lange und mittlere Bilder. Wertebereich [0,1], Standardwert 0.0, Genauigkeit 0.1. |

<!-- source: EN PDF p113; unit 1170 -->

【Hinweise】

<!-- source: EN PDF p114; unit 1171 -->

### 4.   4.4 DRC

<!-- source: EN PDF p114; unit 1172 -->

#### 4.1   4.4.1 Funktionsbeschreibung

<!-- source: EN PDF p114; unit 1173 -->

Der Dynamikumfang bezeichnet das Helligkeitsverhältnis zwischen den hellsten und dunkelsten Objekten einer Szene. Ein größerer Dynamikumfang bedeutet normalerweise mehr Helligkeitsabstufungen.

<!-- source: EN PDF p114; unit 1174 -->

| Kategorie | Dynamikumfang |
| --- | --- |
| Reale Szene | &gt;= 180 dB |
| Wahrnehmung des menschlichen Sehsystems | Etwa 100 dB |
| Pixel eines herkömmlichen Bildsensors | Etwa 60 dB |

<!-- source: EN PDF p114; unit 1175 -->

Bei der Aufnahme einer Szene mit hohem Dynamikumfang durch einen herkömmlichen Bildsensor gehen entweder durch Überbelichtung Details verloren oder dunkle Bereiche sind unterbelichtet und ihre Details schwer erkennbar. Zur Aufzeichnung solcher Szenen werden Sensoren mit größerem Dynamikumfang oder die Zusammenführung mehrerer Belichtungen benötigt. Gängige Anzeigegeräte haben ebenfalls einen begrenzten Dynamikumfang und können ein solches Bild nicht direkt darstellen. Das DRC-Modul komprimiert deshalb den Dynamikumfang, damit die Betrachtung der realen Szene und die Betrachtung auf dem Anzeigegerät denselben visuellen Eindruck ermöglichen.

<!-- source: EN PDF p114; unit 1176 -->

#### 4.2   4.4.2 Wichtige Parameter

<!-- source: EN PDF p114; unit 1177 -->

##### 4.2.1   4.4.2.1 Enable

<!-- source: EN PDF p114; unit 1178 -->

【Beschreibung】

<!-- source: EN PDF p114; unit 1179 -->

Schalterfunktion: 0: aus, 1: ein.

<!-- source: EN PDF p114; unit 1180 -->

【Mitglieder】

<!-- source: EN PDF p114; unit 1181 -->

【Hinweise】

<!-- source: EN PDF p114; unit 1182 -->

Dieser Schalter wirkt nur im linearen Modus. Im HDR-Modus ist er unwirksam, da das Modul dort zwangsweise eingeschaltet ist.

<!-- source: EN PDF p114; unit 1183 -->

##### 4.2.2   4.4.2.2 DrcGain

<!-- source: EN PDF p114; unit 1184 -->

【Beschreibung】

<!-- source: EN PDF p114; unit 1185 -->

Das Modul DrcGain passt die Helligkeit der RAW-Eingangsdaten an, entweder global oder lokal.

<!-- source: EN PDF p114; unit 1186 -->

【Mitglieder】

<!-- source: EN PDF p115; unit 1187 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| EnvLv | Umgebungshelligkeit, Wertebereich [0,1]. 0: vollständig schwarz, 1: maximale Helligkeit. |
| EnvLv_len | Länge des EnvLv-Arrays |
| DrcGain | Verstärkung des DRC-Moduls, Wertebereich [1,8]. |
| DrcGain_len | Länge des DrcGain-Arrays |
| Alpha | Wertebereich [0,1]. |
| Alpha_len | Länge des Alpha-Arrays |
| Clip | Die Vorlage nennt den Wertebereich unvollständig als „0,64 to“. |
| Clip_len | Länge des Clip-Arrays |

<!-- source: EN PDF p115; unit 1188 -->

【Hinweise】

<!-- source: EN PDF p115; unit 1189 -->

##### 4.2.3   4.4.2.3 HiLight

<!-- source: EN PDF p115; unit 1190 -->

Das Modul HiLight ermöglicht Anpassungen der hellen Bereiche der RAW-Ausgabe.

<!-- source: EN PDF p115; unit 1191 -->

【Mitglieder】

<!-- source: EN PDF p115; unit 1192 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| EnvLv | Umgebungshelligkeit, Wertebereich [0,1]. 0: vollständig schwarz, 1: maximale Helligkeit. |
| EnvLv_len | Länge des EnvLv-Arrays |
| Strength | Detailgrad heller Bereiche, Wertebereich [0,1]. |
| Strength_len | Länge des Strength-Arrays |

<!-- source: EN PDF p115; unit 1193 -->

【Hinweise】

<!-- source: EN PDF p115; unit 1194 -->

##### 4.2.4   4.4.2.4 LocalSetting

<!-- source: EN PDF p115; unit 1195 -->

【Beschreibung】

<!-- source: EN PDF p115; unit 1196 -->

Das Modul LocalSetting ermöglicht die Einstellung der lokalen Parameter.

<!-- source: EN PDF p115; unit 1197 -->

###### 4.2.4.1   4.4.2.4.1 LocalData

<!-- source: EN PDF p115; unit 1198 -->

【Beschreibung】

<!-- source: EN PDF p115; unit 1199 -->

LocalData dient hauptsächlich zur Einstellung des lokalen Gewichts und des Kontrasts.

<!-- source: EN PDF p115; unit 1200 -->

【Mitglieder】

<!-- source: EN PDF p116; unit 1201 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| EnvLv | Umgebungshelligkeit, Wertebereich [0,1]. 0: vollständig schwarz, 1: maximale Helligkeit. |
| EnvLv_len | Länge des EnvLv-Arrays |
| LocalWeit | Lokaler Anteil, Wertebereich 0,1. 0: global, 1: vollständig lokal. Standardwert 0. |
| LocalWeit_len | Länge des LocalWeit-Arrays |
| LocalAutoEnable | Schalter für automatisches LocalWeit. Wertebereich [0,1], Standardwert 1, Genauigkeit 1. |
| LocalAutoEnable_len | Länge des LocalAutoEnable-Arrays. |
| LocalAutoWeit | Automatischer LocalWeit-Wert, Wertebereich 0,1, Standardwert 0.4, Genauigkeit 0.01. |
| LocalAutoWeit_len | Länge des LocalAutoWeit-Arrays |
| GlobalContrast | Globaler Kontrast, Wertebereich 0,1, Standardwert 0, Genauigkeit 0.01. |
| GlobalContrast_len | Länge des GlobalContrast-Arrays |
| LoLitContrast | Kontrast dunkler Bereiche, Wertebereich 0,1, Standardwert 0, Genauigkeit 0.01. |
| LoLitContrast_len | Länge des LoLitContrast-Arrays |

<!-- source: EN PDF p116; unit 1202 -->

【Hinweise】

<!-- source: EN PDF p116; unit 1203 -->

Bei aktiviertem LocalAutoEnable wirkt LocalAutoWeit, nicht LocalWeit.

<!-- source: EN PDF p116; unit 1204 -->

###### 4.2.4.2   4.4.2.4.3 curPixWeit

<!-- source: EN PDF p116; unit 1205 -->

【Beschreibung】

<!-- source: EN PDF p116; unit 1206 -->

Bilaterales Gewicht des aktuellen Punkts, Wertebereich [0,1], Standardwert 0.37, Genauigkeit 0.001.

<!-- source: EN PDF p116; unit 1207 -->

【Mitglieder】

<!-- source: EN PDF p116; unit 1208 -->

【Hinweise】

<!-- source: EN PDF p116; unit 1209 -->

###### 4.2.4.3   4.4.2.4.4 preFrameWeit

<!-- source: EN PDF p116; unit 1210 -->

【Beschreibung】

<!-- source: EN PDF p116; unit 1211 -->

Bilaterales Gewicht des aktuellen Bildes, Wertebereich [0,1], Standardwert 0.8, Genauigkeit 0.001.

<!-- source: EN PDF p116; unit 1212 -->

【Mitglieder】

<!-- source: EN PDF p116; unit 1213 -->

【Hinweise】

<!-- source: EN PDF p117; unit 1214 -->

###### 4.2.4.4   4.4.2.4.5 Range_force_sgm

<!-- source: EN PDF p117; unit 1215 -->

【Beschreibung】

<!-- source: EN PDF p117; unit 1216 -->

Kehrwert des Sigma im Wertebereich des bilateralen Filters. Wertebereich [0,1], Standardwert 0, Genauigkeit 0.0001.

<!-- source: EN PDF p117; unit 1217 -->

【Mitglieder】

<!-- source: EN PDF p117; unit 1218 -->

【Hinweise】

<!-- source: EN PDF p117; unit 1219 -->

Ist Range_force_sgm ungleich null, sind Range_sgm_cur und Range_sgm_pre unwirksam.

<!-- source: EN PDF p117; unit 1220 -->

###### 4.2.4.5   4.4.2.4.6 Range_sgm_cur

<!-- source: EN PDF p117; unit 1221 -->

【Beschreibung】

<!-- source: EN PDF p117; unit 1222 -->

Kehrwert des räumlichen Sigma des bilateralen Filters für das aktuelle Bild. Wertebereich [0,1], Standardwert 0.2, Genauigkeit 0.0001.

<!-- source: EN PDF p117; unit 1223 -->

【Mitglieder】

<!-- source: EN PDF p117; unit 1224 -->

【Hinweise】

<!-- source: EN PDF p117; unit 1225 -->

###### 4.2.4.6   4.4.2.4.7 Range_sgm_pre

<!-- source: EN PDF p117; unit 1226 -->

【Beschreibung】

<!-- source: EN PDF p117; unit 1227 -->

Kehrwert des räumlichen Sigma des bilateralen Filters für das vorherige Bild. Wertebereich [0,1], Standardwert 0.2, Genauigkeit 0.0001.

<!-- source: EN PDF p117; unit 1228 -->

【Mitglieder】

<!-- source: EN PDF p117; unit 1229 -->

【Hinweise】

<!-- source: EN PDF p117; unit 1230 -->

###### 4.2.4.7   4.4.2.4.8 Space_sgm_cur

<!-- source: EN PDF p117; unit 1231 -->

【Beschreibung】

<!-- source: EN PDF p117; unit 1232 -->

Kehrwert des Sigma im Wertebereich des bilateralen Filters für das aktuelle Bild. Wertebereich [0,4095], Standardwert 4068, Genauigkeit 1.

<!-- source: EN PDF p117; unit 1233 -->

【Mitglieder】

<!-- source: EN PDF p117; unit 1234 -->

【Hinweise】

<!-- source: EN PDF p118; unit 1235 -->

###### 4.2.4.8   4.4.2.4.9 Space_sgm_pre

<!-- source: EN PDF p118; unit 1236 -->

【Beschreibung】

<!-- source: EN PDF p118; unit 1237 -->

Kehrwert des Sigma im Wertebereich des bilateralen Filters für das vorherige Bild. Wertebereich [0,4095], Standardwert 3068, Genauigkeit 1.

<!-- source: EN PDF p118; unit 1238 -->

【Mitglieder】

<!-- source: EN PDF p118; unit 1239 -->

【Hinweise】

<!-- source: EN PDF p118; unit 1240 -->

##### 4.2.5   4.4.2.5 CompressSetting

<!-- source: EN PDF p118; unit 1241 -->

【Beschreibung】

<!-- source: EN PDF p118; unit 1242 -->

Das Modul CompressSetting ermöglicht die Anpassung der Kompressionskurve.

<!-- source: EN PDF p118; unit 1243 -->

【Mitglieder】

<!-- source: EN PDF p118; unit 1244 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| Mode | Auswahlmodus für die eingegebene Kurventabelle |

<!-- source: EN PDF p118; unit 1245 -->

【Hinweise】

<!-- source: EN PDF p118; unit 1246 -->

Standardmäßig wird der Modus AUTO verwendet.

<!-- source: EN PDF p118; unit 1247 -->

##### 4.2.6   4.4.2.6 Scale_y

<!-- source: EN PDF p118; unit 1248 -->

【Beschreibung】

<!-- source: EN PDF p118; unit 1249 -->

Skalierungstabelle zur Korrektur der Verstärkung, Wertebereich [0,2048].

<!-- source: EN PDF p118; unit 1250 -->

【Mitglieder】

<!-- source: EN PDF p118; unit 1251 -->

【Hinweise】

<!-- source: EN PDF p118; unit 1252 -->

##### 4.2.7   4.4.2.7 ByPassThr

<!-- source: EN PDF p118; unit 1253 -->

【Beschreibung】

<!-- source: EN PDF p118; unit 1254 -->

Bypass-Schwelle dieses Moduls, Wertebereich [0,1]. Ist der prozentuale Unterschied zwischen der aktuellen Umgebungshelligkeit und der des vorherigen Bildes kleiner als ByPassThr, werden die Modulparameter nicht aktualisiert.

<!-- source: EN PDF p118; unit 1255 -->

【Mitglieder】

<!-- source: EN PDF p118; unit 1256 -->

【Hinweise】

<!-- source: EN PDF p118; unit 1257 -->

Während der Abstimmung mit dem Werkzeug den Wert auf 0 setzen, da die Abstimmung sonst möglicherweise unwirksam bleibt.

<!-- source: EN PDF p119; unit 1258 -->

##### 4.2.8   4.4.2.8 Edge_Weit

<!-- source: EN PDF p119; unit 1259 -->

【Beschreibung】

<!-- source: EN PDF p119; unit 1260 -->

Skalierungswert der Kantenreaktion, Wertebereich [0,1], Standardwert 0.02, Genauigkeit 0.01. Dient zur Reduktion von Artefakten an kontrastreichen Kanten.

<!-- source: EN PDF p119; unit 1261 -->

【Mitglieder】

<!-- source: EN PDF p119; unit 1262 -->

【Hinweise】

<!-- source: EN PDF p119; unit 1263 -->

##### 4.2.9   4.4.2.9 OutPutLongFrame

<!-- source: EN PDF p119; unit 1264 -->

【Beschreibung】

<!-- source: EN PDF p119; unit 1265 -->

Nur lange Bilder ausgeben. 0: aus, 1: ein.

<!-- source: EN PDF p119; unit 1266 -->

【Mitglieder】

<!-- source: EN PDF p119; unit 1267 -->

【Hinweise】

<!-- source: EN PDF p119; unit 1268 -->

Dieser Parameter wird nur während der Debugging-Phase verwendet.

<!-- source: EN PDF p119; unit 1269 -->

##### 4.2.10   4.4.2.10 IIR_frame

<!-- source: EN PDF p119; unit 1270 -->

【Beschreibung】

<!-- source: EN PDF p119; unit 1271 -->

Bildanzahl des IIR-Filters. Wertebereich [1,1000], Standardwert 2, Genauigkeit 1.

<!-- source: EN PDF p119; unit 1272 -->

【Mitglieder】

<!-- source: EN PDF p119; unit 1273 -->

【Hinweise】

<!-- source: EN PDF p119; unit 1274 -->

Dieser Parameter ist im linearen Modus unwirksam.

<!-- source: EN PDF p119; unit 1275 -->

##### 4.2.11   4.4.2.11 Tolerance

<!-- source: EN PDF p119; unit 1276 -->

【Beschreibung】

<!-- source: EN PDF p119; unit 1277 -->

Toleranz der mit EnvLv veränderlichen Parameter DrcGain, Alpha, Clip, Strength, LocalWeit, GlobalContrast und LoLitContrast. Wertebereich [0,1].

<!-- source: EN PDF p119; unit 1278 -->

【Mitglieder】

<!-- source: EN PDF p119; unit 1279 -->

【Hinweise】

<!-- source: EN PDF p119; unit 1280 -->

##### 4.2.12   4.4.2.12 damp

<!-- source: EN PDF p119; unit 1281 -->

【Beschreibung】

<!-- source: EN PDF p120; unit 1282 -->

Glättungskoeffizient der mit EnvLv veränderlichen Parameter DrcGain, Alpha, Clip, Strength, LocalWeit, GlobalContrast und LoLitContrast. Er bezeichnet den Anteil der Parameter des aktuellen Bildes. Wertebereich [0,1], Standardwert 0.9.

<!-- source: EN PDF p120; unit 1283 -->

【Mitglieder】

<!-- source: EN PDF p120; unit 1284 -->

【Hinweise】

<!-- source: EN PDF p120; unit 1285 -->

#### 4.3   4.4.3 Abstimmungsschritte

<!-- source: EN PDF p120; unit 1286 -->

##### 4.3.1   4.4.3.1 DrcGain-Abstimmung

<!-- source: EN PDF p120; unit 1287 -->

【Beschreibung】

<!-- source: EN PDF p120; unit 1288 -->

Das Modul DrcGain passt die Helligkeit der RAW-Eingangsdaten an, entweder global oder lokal.

<!-- source: EN PDF p120; unit 1289 -->

【Mitglieder】

<!-- source: EN PDF p120; unit 1290 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| DrcGain | Verstärkung des DRC-Blocks, Wertebereich [1,8]. |
| Alpha | Wertebereich: [0,1]. |
| Clip | Wertebereich: [0,64]. |

<!-- source: EN PDF p120; unit 1291 -->

【Hinweise】

<!-- source: EN PDF p120; unit 1292 -->

Die DrcGain-Kurve wird aus den drei Parametern DrcGain, Alpha und Clip gebildet. Ihr ungefährer Verlauf ist nachfolgend dargestellt:

<!-- source: EN PDF p121; unit 1293 -->

![Originalabbildung aus dem englischen PDF, Seite 121](/docs/rockchip-isp30-tuning/assets/en-p121-X844.png)

<!-- source: EN PDF p121; unit 1294 -->

Die waagerechte Achse zeigt die Pixelhelligkeit von 0~4096, die senkrechte Achse den Verstärkungsfaktor für Pixel der jeweiligen Helligkeit.

<!-- source: EN PDF p121; unit 1295 -->

DrcGain：

<!-- source: EN PDF p121; unit 1296 -->

DrcGain bestimmt den maximalen Verstärkungsfaktor, der zwei Bedingungen unterliegt:

![DRC-Bedingungen](/docs/rockchip-isp30-tuning/assets/en-p121-vector-drc-constraints.png)

`1 <= DrcGain <= 8`

`AERatio * DrcGain <= 256`

<!-- source: EN PDF p121; unit 1297 -->

Aus den beiden Bedingungen folgt, dass das tatsächliche DrcGain kleiner als 8x ist. Wird während der Abstimmung DrcGain auf 8x gesetzt, sein Produkt mit AERatio überschreitet aber 256x, wird DrcGain intern begrenzt, sodass das Produkt kleiner als 256x bleibt.

<!-- source: EN PDF p121; unit 1298 -->

Bei der praktischen Abstimmung kann zusätzliches DrcGain bei gleicher Helligkeit den Versatzfehler zwischen langen und kurzen Bildern verringern. Die Vorlage enthält dazu die widersprüchliche Einschränkung „except for sensors other than DCG mode“. Da DrcGain digital arbeitet, erhöht eine Anhebung das Rauschen, solange der Sensor noch analoge Verstärkung verwendet. Im digitalen Verstärkungsmodus des Sensors führt höheres DrcGain dagegen zu keinem wesentlichen Unterschied des Rauschpegels.

<!-- source: EN PDF p121; unit 1299 -->

Die folgende Abbildung zeigt den ungefähren Verlauf bei DrcGain = 1x (rot) und 8x (blau):

<!-- source: EN PDF p122; unit 1300 -->

![Originalabbildung aus dem englischen PDF, Seite 122](/docs/rockchip-isp30-tuning/assets/en-p122-X847.png)

<!-- source: EN PDF p122; unit 1301 -->

Alpha：

<!-- source: EN PDF p122; unit 1302 -->

Alpha bestimmt die Steigung der DrcGain-Kurve. Die folgende Abbildung vergleicht Alpha = 0 (rot) und 0.9 (blau):

<!-- source: EN PDF p123; unit 1303 -->

![Originalabbildung aus dem englischen PDF, Seite 123](/docs/rockchip-isp30-tuning/assets/en-p123-X850.png)

<!-- source: EN PDF p123; unit 1304 -->

Je kleiner Alpha, desto stärker nähert sich die DrcGain-Kurve einer horizontalen Geraden. Alle Helligkeiten werden dann gleich verstärkt, was beispielsweise zu unzureichendem Kontrast oder verstärktem Rauschen in dunklen Bereichen führen kann.

<!-- source: EN PDF p123; unit 1305 -->

<!-- source: EN PDF p123; unit 1306 -->

Clip：

<!-- source: EN PDF p124; unit 1307 -->

![Originalabbildung aus dem englischen PDF, Seite 124](/docs/rockchip-isp30-tuning/assets/en-p124-X853.png)

<!-- source: EN PDF p124; unit 1308 -->

##### 4.3.2   4.4.3.2 HiLight-Abstimmung

<!-- source: EN PDF p124; unit 1309 -->

【Beschreibung】

<!-- source: EN PDF p124; unit 1310 -->

Das Modul HiLight ermöglicht die Anpassung der Details in hellen Bereichen der RAW-Ausgabe.

<!-- source: EN PDF p124; unit 1311 -->

【Mitglieder】

<!-- source: EN PDF p124; unit 1312 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| Strength | Detailgrad heller Bereiche, Wertebereich [0,1]. |

<!-- source: EN PDF p124; unit 1313 -->

【Hinweise】

<!-- source: EN PDF p124; unit 1314 -->

Je größer Stength, desto mehr Details bleiben bei der Kompression heller Bereiche erhalten; zugleich steigt die Wahrscheinlichkeit von Halos an deren Grenzen. Links ist Strength = 0, rechts Strength = 1 dargestellt:

<!-- source: EN PDF p125; unit 1315 -->

![Originalabbildung aus dem englischen PDF, Seite 125](/docs/rockchip-isp30-tuning/assets/en-p125-X857.png)

<!-- source: EN PDF p125; unit 1316 -->

![Originalabbildung aus dem englischen PDF, Seite 125](/docs/rockchip-isp30-tuning/assets/en-p125-X858.png)

<!-- source: EN PDF p125; unit 1317 -->

##### 4.3.3   4.4.3.3 LocalSetting-Abstimmung

<!-- source: EN PDF p125; unit 1318 -->

【Beschreibung】

<!-- source: EN PDF p125; unit 1319 -->

LocalSetting passt die lokalen Parameter an. Sämtliche Parameter dieses Moduls sind unwirksam, wenn LocalAutoEnable=0 und LocalWeit=0 oder LocalAutoEnable=1 und LocalAutoWeit=0 gilt.

<!-- source: EN PDF p125; unit 1320 -->

###### 4.3.3.1   4.4.3.3.1 LocalData-Abstimmung

<!-- source: EN PDF p125; unit 1321 -->

【Beschreibung】

<!-- source: EN PDF p125; unit 1322 -->

LocalTMOData stellt hauptsächlich das LocalTMO-Gewicht, den globalen Kontrast und den Kontrast dunkler Bereiche ein.

<!-- source: EN PDF p125; unit 1323 -->

【Mitglieder】

<!-- source: EN PDF p126; unit 1324 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| LocalWeit | Gewicht des lokalen TMO, Wertebereich [0,1]. 0: globales TMO, 1: vollständig lokales TMO. |
| LocalAutoEnable | Schalter für automatisches LocalWeit, Wertebereich [0,1], Standardwert 1, Genauigkeit 1. |
| LocalAutoWeit | Automatischer LocalWeit-Wert, Wertebereich [0,1], Standardwert 0.4, Genauigkeit 0.01. |
| GlobalContrast | Globaler Kontrast, Wertebereich [0,1], Standardwert 0, Genauigkeit 0.01. |
| LoLitContrast | Kontrast dunkler Bereiche, Wertebereich [0,1], Standardwert 0, Genauigkeit 0.01. |

<!-- source: EN PDF p126; unit 1325 -->

【Hinweise】

<!-- source: EN PDF p126; unit 1326 -->

DRC arbeitet global, wenn LocalAutoEnable = 0 und LocalWeit = 0 oder LocalAutoEnable = 1 und LocalAutoWeit=0 gilt. Wenn LocalAutoEnable=0 und LocalWeit &gt; 0 oder LocalAutoEnable=1 und LocalAutoWeit&gt;0 gilt … [Der Satz endet hier in der Vorlage.]

<!-- source: EN PDF p126; unit 1327 -->

GlobalContrast: Je größer der Wert, desto stärker der Gesamtkontrast, ausgenommen dunkle Bereiche. Links ist GlobalContrast = 0, rechts GlobalContrast = 1 dargestellt.

<!-- source: EN PDF p126; unit 1328 -->

![Originalabbildung aus dem englischen PDF, Seite 126](/docs/rockchip-isp30-tuning/assets/en-p126-X863.png)

<!-- source: EN PDF p126; unit 1329 -->

![Originalabbildung aus dem englischen PDF, Seite 126](/docs/rockchip-isp30-tuning/assets/en-p126-X864.png)

<!-- source: EN PDF p126; unit 1330 -->

LoLitContrast: Je größer der Wert, desto stärker der Kontrast dunkler Bereiche. Links ist LoLitContrast = 0, rechts LoLitContrast = 1 dargestellt.

<!-- source: EN PDF p127; unit 1331 -->

![Originalabbildung aus dem englischen PDF, Seite 127](/docs/rockchip-isp30-tuning/assets/en-p127-X867.png)

<!-- source: EN PDF p127; unit 1332 -->

![Originalabbildung aus dem englischen PDF, Seite 127](/docs/rockchip-isp30-tuning/assets/en-p127-X868.png)

<!-- source: EN PDF p127; unit 1333 -->

##### 4.3.4   4.4.3.4 Edge_Weit-Abstimmung

<!-- source: EN PDF p127; unit 1334 -->

【Beschreibung】

<!-- source: EN PDF p127; unit 1335 -->

Durch Änderung dieses Wertes lassen sich Artefakte an kontrastreichen Kanten verringern.

<!-- source: EN PDF p127; unit 1336 -->

【Mitglieder】

<!-- source: EN PDF p127; unit 1337 -->

【Hinweise】

<!-- source: EN PDF p128; unit 1338 -->

![Originalabbildung aus dem englischen PDF, Seite 128](/docs/rockchip-isp30-tuning/assets/en-p128-X872.png)

<!-- source: EN PDF p128; unit 1339 -->

![Originalabbildung aus dem englischen PDF, Seite 128](/docs/rockchip-isp30-tuning/assets/en-p128-X873.png)

<!-- source: EN PDF p128; unit 1340 -->

### 5.   4.5 Dehaze und Enhance

<!-- source: EN PDF p128; unit 1341 -->

#### 5.1   4.5.1 Funktionsbeschreibung

<!-- source: EN PDF p128; unit 1342 -->

Bei schlechtem Wetter, etwa Nebel oder Dunst, vermindert atmosphärische Streuung die Qualität aufgenommener Bilder erheblich. Die Farben wirken grauweiß, der Kontrast sinkt und Objektmerkmale sind schwer erkennbar. Bildentnebelung wird benötigt, um diese Effekte zu korrigieren oder das Bild für eine bessere visuelle Wirkung zu verbessern.

<!-- source: EN PDF p128; unit 1343 -->

Dieses Modul umfasst Dehaze, Enhance und Hist. Dehaze wird hauptsächlich bei starkem Nebel oder Dunst verwendet, Enhance und Hist meist zur Kontrastverbesserung. Die Vorlage formuliert die Beziehung von Dehaze und Enhance widersprüchlich: Beide könnten „nur gleichzeitig“ aktiviert werden, bei gleichzeitiger Aktivierung wirke aber nur das „Add“-Modul. Hist kann zusammen mit anderen Modulen aktiviert werden. Die widersprüchliche Aktivierungsregel ist anhand der Implementierung zu prüfen.

<!-- source: EN PDF p128; unit 1344 -->

! [] (Resources/Dehaze Block Diagram .png) [Nicht aufgelöster Ressourcenverweis der Vorlage.]

<!-- source: EN PDF p129; unit 1345 -->

![Originalabbildung aus dem englischen PDF, Seite 129](/docs/rockchip-isp30-tuning/assets/en-p129-X878.png)

<!-- source: EN PDF p129; unit 1346 -->

Blockdiagramm des Dehaze-Moduls

<!-- source: EN PDF p129; unit 1347 -->

#### 5.2   4.5.2 Wichtige Parameter

<!-- source: EN PDF p129; unit 1348 -->

##### 5.2.1   4.7.2.1 Enable

<!-- source: EN PDF p129; unit 1349 -->

【Beschreibung】

<!-- source: EN PDF p129; unit 1350 -->

Schalterfunktion für Dehaze &amp; Enhanced

<!-- source: EN PDF p129; unit 1351 -->

0: aus

<!-- source: EN PDF p129; unit 1352 -->

1: ein

<!-- source: EN PDF p129; unit 1353 -->

【Mitglieder】

<!-- source: EN PDF p129; unit 1354 -->

【Hinweise】

<!-- source: EN PDF p129; unit 1355 -->

##### 5.2.2   4.5.2.2 cfg_alpha

<!-- source: EN PDF p129; unit 1356 -->

【Beschreibung】

<!-- source: EN PDF p129; unit 1357 -->

Anteil der Softwarekonfiguration, Wertebereich [0,1], Standardwert 1, Genauigkeit 0.01.

<!-- source: EN PDF p129; unit 1358 -->

0: ausschließlich adaptive Parameter verwenden

<!-- source: EN PDF p129; unit 1359 -->

1: ausschließlich Software-Konfigurationsparameter verwenden. Adaptive und softwarekonfigurierte Parameter können über diesen Anteil gemischt werden.

<!-- source: EN PDF p129; unit 1360 -->

【Mitglieder】

<!-- source: EN PDF p129; unit 1361 -->

【Hinweise】

<!-- source: EN PDF p129; unit 1362 -->

Bei 0 sind cfg_wt, cfg_air und cfg_tmax in Dehaze sowie cfg_gratio in Hist unwirksam. Bei 1 werden die Dehaze-Parameter vollständig durch cfg_wt, cfg_air und cfg_tmax, die Hist-Parameter vollständig durch cfg_gratio bestimmt.

<!-- source: EN PDF p129; unit 1363 -->

##### 5.2.3   4.5.2.3 ByPassThr

<!-- source: EN PDF p129; unit 1364 -->

【Beschreibung】

<!-- source: EN PDF p130; unit 1365 -->

Bypass-Schwelle dieses Moduls, Wertebereich [0,1]. Ist der prozentuale Unterschied zwischen der aktuellen Umgebungshelligkeit und der des vorherigen Bildes kleiner als ByPassThr, werden die Modulparameter nicht aktualisiert.

<!-- source: EN PDF p130; unit 1366 -->

【Mitglieder】

<!-- source: EN PDF p130; unit 1367 -->

【Hinweise】

<!-- source: EN PDF p130; unit 1368 -->

Während der Abstimmung mit dem Werkzeug den Wert auf 0 setzen, da die Abstimmung sonst möglicherweise unwirksam bleibt.

<!-- source: EN PDF p130; unit 1369 -->

##### 5.2.4   4.5.2.4 Dehaze_Setting

<!-- source: EN PDF p130; unit 1370 -->

【Beschreibung】

<!-- source: EN PDF p130; unit 1371 -->

Dieses Modul ermöglicht die Einstellung der Entnebelungsparameter.

<!-- source: EN PDF p130; unit 1372 -->

【Mitglieder】

<!-- source: EN PDF p130; unit 1373 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| en | Schalterfunktion |
| air_lc_en | Schalter zur Verwendung von Airlight Base als untere Begrenzung |
| stab_fnum | Maximalwert für die Stabilisierung über Bilder |
| sigma | IIR-gesteuertes Sigma |
| wt_sigma | Bildübergreifender WT-Filterkoeffizient |
| air_sigma | Bildübergreifender Air-Filterkoeffizient |
| tmax_sigma | Bildübergreifender tmax-Filterkoeffizient |
| pre_wet | IIR-Filterfaktor der Referenzdaten |
| DehazeData | Dehaze-Abstimmparameter |

<!-- source: EN PDF p131; unit 1374 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| EnvLv | Umgebungshelligkeit |
| EnvLv_len | Länge des EnvLv-Arrays |
| dc_min_th | Adaptiver WT-Statistikbereich, Wertebereich [16, 120], Standardwert 64. |
| dc_min_th_len | Länge des dc_min_th-Arrays |
| dc_max_th | Adaptiver WT-Statistikbereich für hoch belichtete Bereiche, Wertebereich [170, 255], Standardwert 192. |
| dc_max_th_len | Länge des dc_max_th-Arrays |
| yhist_th | Statistikbereich hoch belichteter Bereiche der Y-Komponente, Wertebereich [170, 255], Standardwert 249. |
| yhist_th_len | Länge des yhist_th-Arrays |
| yblk_th | Schwelle des Anteils der Y-Komponenten-Blöcke, Wertebereich 0.002, 0.01, Standardwert 0.002. |
| yblk_th_len | Länge des yblk_th-Arrays |
| dark_th | Adaptive WT-Schwelle des Minimalwerts eines Y-Komponenten-Blocks, Wertebereich [230, 250], Standardwert 250. |
| dark_th_len | Länge des dark_th-Arrays |
| bright_min | Untere adaptive Air-Schwelle, Wertebereich 160 bis 200, Standardwert 180. |
| bright_min_len | Länge des bright_min-Arrays |
| bright_max | Obere adaptive Air-Schwelle, Wertebereich 210 bis 250, Standardwert 240. |
| bright_max_len | Länge des bright_max-Arrays |
| wt_max | Maximalwert der WT-Adaption, Bereich 0.75, 0.9, Standardwert 0.9. |
| wt_max_len | Länge des wt_max-Arrays |
| air_min | Minimalwert der Air-Adaption, Wertebereich 200 bis 220, Standardwert 200. |
| air_min_len | Länge des air_min-Arrays |
| air_max | Maximalwert der Air-Adaption, Wertebereich 230 bis 250, Standardwert 250. |
| air_max_len | Länge des air_max-Arrays |
| tmax_base | Standardwert von tmax: 125. Zugehörige Konfiguration: 200 (131), 210 (125), 220 (119), 230 (114), 240 (109), 250 (105), sowie 131-105. |

<!-- source: EN PDF p132; unit 1375 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| tmax_base_len | Länge des tmax_base-Arrays |
| tmax_off | Adaptiver Festwert von tmax, Wertebereich [0.1, 0.5], Standardwert 0.1. |
| tmax_off_len | Länge des tmax_off-Arrays |
| tmax_max | Maximalwert von tmax, Bereich 0.1, 0.5, Standardwert 0.5. |
| tmax_max_len | Länge des tmax_max-Arrays |
| cfg_wt | Softwarekonfiguriertes wt, Stärke der Bildentnebelung. Wertebereich [0, 1], Standardwert 0.8. |
| cfg_wt_len | Länge des cfg_wt-Arrays |
| cfg_air | Softwarekonfiguriertes air, Koeffizient des atmosphärischen Lichts. Wertebereich [0, 255], Standardwert 210. |
| cfg_air_len | Länge des cfg_air-Arrays |
| cfg_tmax | Softwarekonfiguriertes tmax, maximale Entnebelung. Wertebereich 0, 1, Standardwert 0.2. |
| cfg_tmax_len | Länge des cfg_tmax-Arrays |
| bf_weight | Kombinationsgewicht der beiden bilateralen Filter, Wertebereich [0, 1], Standardwert 0.5. |
| bf_weight_len | Länge des bf_weight-Arrays |
| dc_weitcur | Gewicht des Dunkelkanalanteils, Wertebereich [0, 1]. Der Standardwert fehlt in der Vorlage. |
| dc_weitcur_len | Länge des dc_weitcur-Arrays |
| range_sigma | Sigma im Wertebereich des bilateralen Filters, Wertebereich [0, 1], Standardwert 0.4. |
| range_sigma_len | Länge des range_sigma-Arrays |
| space_sigma_pre | Räumliches Sigma des bilateralen Filters bei Verwendung von IIR-Daten als Referenz, Wertebereich [0, 1], Standardwert 0.4. |
| space_sigma_pre_len | Länge des space_sigma_pre-Arrays |
| space_sigma_cur | Räumliches Sigma des bilateralen Filters bei Verwendung aktueller Daten als Referenz, Wertebereich [0, 1], Standardwert 0.8. |
| space_sigma_cur_len | Länge des space_sigma_cur-Arrays |

<!-- source: EN PDF p132; unit 1376 -->

【Hinweise】

<!-- source: EN PDF p132; unit 1377 -->

stab_fnum: Die Dehaze-Parameter erreichen ausgehend von 0 schrittweise einen stabilen Wert. sw_dhaze_stab_fnum ist die softwareseitig festgelegte Bildanzahl bis zur Stabilisierung. Üblicherweise sind 10 Bilder angemessen. Der Parameter kann höchstens 31 betragen; innerhalb von bis zu 1s wird dann ein stabiler Zustand erreicht;

<!-- source: EN PDF p133; unit 1378 -->

##### 5.2.5   4.5.2.5 Enhance_Setting

<!-- source: EN PDF p133; unit 1379 -->

【Beschreibung】

<!-- source: EN PDF p133; unit 1380 -->

Dieses Modul ermöglicht die Einstellung des Bildkontrasts.

<!-- source: EN PDF p133; unit 1381 -->

【Mitglieder】

<!-- source: EN PDF p133; unit 1382 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| en | Schalter der Enhance-Funktion |
| enhance_curve | Niederfrequenzkurve |
| EnhanceData | Enhance-Abstimmparameter |

<!-- source: EN PDF p133; unit 1383 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| EnvLv | Umgebungshelligkeit |
| EnvLv_len | Länge des Arrays der Umgebungshelligkeit |
| enhance_value | Allgemeine Kontraststärke, Wertebereich [0, 16], empfohlener Bereich [1, 2]. |
| enhance_value_len | Länge des enhance_value-Arrays |
| enhance_chroma | Verstärkungsparameter der Chromatizität, Wertebereich [0, 16], empfohlener Bereich [1, 2]. |
| enhance_chroma_len | Länge des enhance_chroma-Arrays |

<!-- source: EN PDF p133; unit 1384 -->

【Hinweise】

<!-- source: EN PDF p133; unit 1385 -->

enhance_value: Je größer der Wert, desto stärker der Kontrast.

<!-- source: EN PDF p133; unit 1386 -->

enhance_chroma: Je größer der Wert, desto höher die Sättigung.

<!-- source: EN PDF p133; unit 1387 -->

##### 5.2.6   4.5.2.6 Hist_Setting

<!-- source: EN PDF p133; unit 1388 -->

【Beschreibung】

<!-- source: EN PDF p133; unit 1389 -->

Dieses Modul passt den Bildkontrast an. Es wird normalerweise verwendet, wenn der Kontrast nach der Entnebelung noch nicht ausreicht.

<!-- source: EN PDF p133; unit 1390 -->

【Mitglieder】

<!-- source: EN PDF p134; unit 1391 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| en | Schalter der Hist-Funktion |
| hist_para_en | Steuerschalter der Histogrammstreckung |
| HistData | Hist-Abstimmparameter |

<!-- source: EN PDF p134; unit 1392 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| EnvLv | Umgebungshelligkeit |
| EnvLv_len | Länge des EnvLv-Arrays |
| hist_gratio | Faktor der Histogrammstreckung bzw. Steuerkoeffizient des Histogrammausgleichs, Wertebereich [0, 32]. |
| hist_gratio_len | Länge des hist_gratio-Arrays |
| hist_th_off | Statistikschwelle des Histogramms, Wertebereich 0 bis 255, Standardwert 64. |
| hist_th_off_len | Länge des hist_th_off-Arrays |
| hist_k | Verstärkungsfaktor der adaptiven Histogrammschwelle, Wertebereich 0 bis 7, Standardwert 2. |
| hist_k_len | Länge des hist_k-Arrays |
| hist_min | Minimalwert der Statistikschwelle des Histogramms, Wertebereich [0,2], Standardwert 0.016. |
| hist_min_len | Länge des hist_min-Arrays |
| hist_scale | Steuerkoeffizient des Histogrammausgleichs, Wertebereich [0, 32]. |
| hist_scale_len | Länge des hist_scale-Arrays |
| cfg_gratio | Softwarekonfigurierter Faktor der Histogrammstreckung bzw. Steuerkoeffizient des Histogrammausgleichs, Wertebereich [0, 32). |
| cfg_gratio_len | Länge des cfg_gratio-Arrays |

<!-- source: EN PDF p134; unit 1393 -->

【Hinweise】

<!-- source: EN PDF p134; unit 1394 -->

hist_para_en: Bei 1 wirkt hist_scale, nicht aber hist_gratio. Bei 0 wirkt umgekehrt hist_gratio, nicht hist_scale.

<!-- source: EN PDF p134; unit 1395 -->

hist_gratio: Je größer der Wert, desto stärker wird das Histogramm gestreckt und desto höher die Gesamthelligkeit des Bildes.

<!-- source: EN PDF p134; unit 1396 -->

hist_th_off: Je größer der Wert, desto größer der Statistikwert des Histogramms und desto höher die Gesamthelligkeit des Bildes.

<!-- source: EN PDF p134; unit 1397 -->

hist_k: Je größer der Wert, desto größer der Statistikwert des Histogramms und desto höher die Gesamthelligkeit des Bildes.

<!-- source: EN PDF p135; unit 1398 -->

hist_min: Je größer der Wert, desto größer der Statistikwert des Histogramms und desto höher die Gesamthelligkeit des Bildes.

<!-- source: EN PDF p135; unit 1399 -->

#### 5.3   4.5.3 Abstimmungsschritte

<!-- source: EN PDF p135; unit 1400 -->

Die Dehaze-Abstimmung umfasst hauptsächlich drei Teile: Dehaze, Enhanced und Hist.

<!-- source: EN PDF p135; unit 1401 -->

##### 5.3.1   4.5.3.1 Dehaze-Abstimmung

<!-- source: EN PDF p135; unit 1402 -->

【Beschreibung】

<!-- source: EN PDF p135; unit 1403 -->

Zur Einstellung der Entnebelungsstärke werden die folgenden drei Parameter empfohlen. Sie variieren mit ISO. Während der Abstimmung muss cfg_alpha auf 1 gesetzt sein.

<!-- source: EN PDF p135; unit 1404 -->

【Mitglieder】

<!-- source: EN PDF p135; unit 1405 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| cfg_wt | Softwarekonfiguriertes wt, Stärke der Bildentnebelung |
| cfg_air | Softwarekonfiguriertes air, Koeffizient des atmosphärischen Lichtschleiers |
| cfg_tmax | Softwarekonfiguriertes tmax, maximale Entnebelung |

<!-- source: EN PDF p135; unit 1406 -->

【Hinweise】

<!-- source: EN PDF p135; unit 1407 -->

1\.cfg_wt: Je größer der Wert, desto stärker die Entnebelung. wt sollte möglichst 0.9 nicht überschreiten, da größere Werte in den meisten Fällen unnatürliche Ergebnisse liefern, außer bei sehr starkem Nebel. Die folgende Abbildung zeigt von links nach rechts Dehaze_en= 0, Dehaze_en = 1 mit cfg_wt= 0.4 und Dehaze_en = 1 mit cfg_wt= 0.8.

<!-- source: EN PDF p135; unit 1408 -->

![Originalabbildung aus dem englischen PDF, Seite 135](/docs/rockchip-isp30-tuning/assets/en-p135-X898.png)

<!-- source: EN PDF p135; unit 1409 -->

Vergleich von cfg_wt

<!-- source: EN PDF p135; unit 1410 -->

2\.cfg_air: Steuert ebenfalls die Entnebelungsstärke und beeinflusst dabei die Wirkung in überbelichteten Bildbereichen. Wird zusammen mit sw_dhaz_cfg_wt verwendet.

<!-- source: EN PDF p135; unit 1411 -->

Beim folgenden Eingangsbild wirkt die Entnebelung am Übergang zum Himmel mit größerem cfg_air natürlicher. Bei cfg_air = 250 treten keine unerwünschten Zwischenabstufungen auf. Bei der AIR-Abstimmung ist vor allem zu prüfen, ob Himmel oder überbelichtete Bereiche im Bild liegen. Dann AIR erhöhen, um Abstufungen oder Detailverlust zu vermeiden. Von links nach rechts: Dehaze_en= 0, Dehaze_en= 1 mit cfg_air= 200, Dehaze_en= 1 mit cfg_air= 250.

<!-- source: EN PDF p136; unit 1412 -->

![Originalabbildung aus dem englischen PDF, Seite 136](/docs/rockchip-isp30-tuning/assets/en-p136-X903.png)

<!-- source: EN PDF p136; unit 1413 -->

Vergleich von cfg_air

<!-- source: EN PDF p136; unit 1414 -->

3\.cfg_tmax: Je kleiner der Wert, desto stärker die Entnebelung in Tiefenrichtung; je größer der Wert, desto schwächer.

<!-- source: EN PDF p136; unit 1415 -->

Bei cfg_tmax = 0.1 wird Nebel in Tiefenrichtung relativ gründlich entfernt und einige Details werden sichtbar. Bei cfg_tmax = 0.5 ist die Wirkung wesentlich schwächer. Nebel in Tiefenrichtung sollte nicht maximal entfernt werden, da zu starke Entfernung die Tiefenstaffelung des Bildes zerstört. Üblicherweise ist 0.2 geeignet. Von links nach rechts: Dehaze_en= 0, Dehaze_en= 1 mit cfg_tmax= 0.1, Dehaze_en= 1 mit cfg_tmax= 0.5.

<!-- source: EN PDF p136; unit 1416 -->

![Originalabbildung aus dem englischen PDF, Seite 136](/docs/rockchip-isp30-tuning/assets/en-p136-X904.png)

<!-- source: EN PDF p136; unit 1417 -->

Vergleich von cfg_tmax

<!-- source: EN PDF p136; unit 1418 -->

##### 5.3.2   4.5.3.2 Enhanced-Abstimmung

<!-- source: EN PDF p136; unit 1419 -->

【Beschreibung】

<!-- source: EN PDF p136; unit 1420 -->

Die allgemeine Kontrastverbesserung wird über enhance_value eingestellt. enhance_value variiert mit ISO.

<!-- source: EN PDF p136; unit 1421 -->

【Mitglieder】

<!-- source: EN PDF p136; unit 1422 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enhance_value | Allgemeine Kontraststärke |
| enhance_chroma | Verstärkungsparameter der Chromatizität |
| enh_curve | Niederfrequenzkurve |

<!-- source: EN PDF p136; unit 1423 -->

【Hinweise】

<!-- source: EN PDF p136; unit 1424 -->

1\.enhance_value: Je größer der Wert, desto stärker der Kontrast. Von links nach rechts: Enhance_en = 0, Enhance_en = 1 mit enhance_value = 1.5.

<!-- source: EN PDF p137; unit 1425 -->

![Originalabbildung aus dem englischen PDF, Seite 137](/docs/rockchip-isp30-tuning/assets/en-p137-X908.png)

<!-- source: EN PDF p137; unit 1426 -->

Vergleich von enhance_value

<!-- source: EN PDF p137; unit 1427 -->

2\.enhance_chroma: Je größer der Wert, desto höher die Sättigung. Von links nach rechts: Enhance_en = 0, Enhance_en = 1 mit enhance_chroma = 1.5.

<!-- source: EN PDF p137; unit 1428 -->

![Originalabbildung aus dem englischen PDF, Seite 137](/docs/rockchip-isp30-tuning/assets/en-p137-X909.png)

<!-- source: EN PDF p137; unit 1429 -->

Vergleich von enhance_chroma

<!-- source: EN PDF p137; unit 1430 -->

3\.enh_curve: Durch Absenken des Parameters für dunkle Bereiche lassen sich deren Helligkeit und Kontrast verbessern.

<!-- source: EN PDF p137; unit 1431 -->

##### 5.3.3   4.5.3.3 Hist-Abstimmung

<!-- source: EN PDF p137; unit 1432 -->

【Beschreibung】

<!-- source: EN PDF p137; unit 1433 -->

Zur Einstellung des Histogrammausgleichs Hist werden laut Vorlage die folgenden zwei Parameter empfohlen. Sie variieren mit ISO. Während der Abstimmung muss cfg_alpha auf 1 gesetzt sein.

<!-- source: EN PDF p137; unit 1434 -->

【Mitglieder】

<!-- source: EN PDF p137; unit 1435 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| cfg_gratio | Softwarekonfigurierter Faktor der Histogrammstreckung bzw. Steuerfaktor des Histogrammausgleichs |

<!-- source: EN PDF p137; unit 1436 -->

【Hinweise】

<!-- source: EN PDF p137; unit 1437 -->

cfg_gratio: Hängt mit WT zusammen. Je größer WT und Gratio, desto größer GT; je kleiner GRATIO, desto kleiner GT. Zu große Parameterwerte wirken unnatürlich, färben das Gesamtbild blau und führen erneut zu Detailverlust. gratio ist ein Koeffizient der Histogrammstreckung, dessen Größe von wt abhängt. Bei größerem wt muss gratio entsprechend angepasst werden, bei kleinerem wt ebenfalls kleiner sein. Ein kleines wt darf nicht mit einem verhältnismäßig großen gratio kombiniert werden. Von links nach rechts: Hist_en = 0, Hist_en = 1 mit cfg_gratio = 0.768, Hist_en = 1 mit cfg_gratio= 2.

<!-- source: EN PDF p138; unit 1438 -->

![Originalabbildung aus dem englischen PDF, Seite 138](/docs/rockchip-isp30-tuning/assets/en-p138-X913.png)

<!-- source: EN PDF p138; unit 1439 -->

Vergleich von cfg_gratio

<!-- source: EN PDF p138; unit 1440 -->

### 6.   4.6 DPCC

<!-- source: EN PDF p138; unit 1441 -->

#### 6.1   4.6.1 Funktionsbeschreibung

<!-- source: EN PDF p138; unit 1442 -->

Das DPCC-Modul umfasst ISP DPCC und Sensor DPCC.

<!-- source: EN PDF p138; unit 1443 -->

![Originalabbildung aus dem englischen PDF, Seite 138](/docs/rockchip-isp30-tuning/assets/en-p138-X914.png)

<!-- source: EN PDF p138; unit 1444 -->

##### 6.1.1   4.6.1.1 ISP DPCC

<!-- source: EN PDF p138; unit 1445 -->

Das ISP-DPCC-Hardwaremodul bietet sechs Algorithmen zur Erkennung und anschließenden Korrektur defekter Pixel: RK, LC, PG, RND, RG und RO. Jeder Algorithmus besitzt einen eigenen Schalter und einstellbare Schwellen. Sie erkennen helle, dunkle und dynamisch defekte Pixel, unterscheiden sich jedoch in ihrer Eignung für die jeweiligen Defekttypen. RO und PG wirken besser bei einzelnen hellen oder dunklen Defekten; RK, RG und RND bei mehreren defekten Pixeln.

<!-- source: EN PDF p138; unit 1446 -->

Aus den sechs Algorithmen können mehrere aktiviert und zu einem Erkennungsschema kombiniert werden. Erst wenn alle im Schema aktivierten Algorithmen einen Pixel als defekt bewerten, gilt er für dieses Schema als defekt. Werden beispielsweise RK, LC, PG und RND verwendet, müssen die Bedingungen aller vier erfüllt sein. Nachfolgend ein Schema mit allen sechs Algorithmen:

<!-- source: EN PDF p139; unit 1447 -->

<!-- source: EN PDF p139; unit 1448 -->

![Originalabbildung aus dem englischen PDF, Seite 139](/docs/rockchip-isp30-tuning/assets/en-p139-X921.png)

<!-- source: EN PDF p139; unit 1449 -->

Das ISP-DPCC-Modul unterstützt bis zu drei konfigurierbare Erkennungsschemata (Set1~3) sowie ein Schema (fix_set) mit fester Algorithmuskombination, das nur ein- oder ausgeschaltet werden kann. Insgesamt sind dies vier Schemata. Sobald irgendein aktiviertes Schema einen Pixel als defekt bewertet, führt das DPCC-Modul die Defektkorrektur aus.

<!-- source: EN PDF p139; unit 1450 -->

![Originalabbildung aus dem englischen PDF, Seite 139](/docs/rockchip-isp30-tuning/assets/en-p139-X923.png)

<!-- source: EN PDF p139; unit 1451 -->

###### 6.1.1.1   4.6.1.1.1 Expert_mode

<!-- source: EN PDF p139; unit 1452 -->

Im Expert_mode kann die ISP-DPCC-Hardware direkt konfiguriert werden. Dies betrifft hauptsächlich die vier Erkennungsschemata fix_set, set1, set2 und set3.

<!-- source: EN PDF p139; unit 1453 -->

<!-- source: EN PDF p139; unit 1454 -->

###### 6.1.1.2   4.6.1.1.2 Fast_mode

<!-- source: EN PDF p139; unit 1455 -->

Fast_mode ist ein von RK anhand der Fähigkeiten der einzelnen ISP-DPCC-Erkennungsalgorithmen abstrahierter Betriebsmodus zur Unterscheidung von Defekttypen. Er umfasst hauptsächlich:

<!-- source: EN PDF p139; unit 1456 -->

Single_level: Besonders wirksam für einzelne isolierte Defektpixel. Nur Set1 wird aktiviert; darin sind sechs Erkennungsalgorithmen eingeschaltet. Mit steigendem Level sinkt die Zahl der verwendeten Algorithmen, die Schwellen ändern sich und die Defektkorrektur wird stärker;

<!-- source: EN PDF p140; unit 1457 -->

Double_level: Wirksam für zwei benachbarte Defektpixel, etwa einen 1x2- oder 2x1-Cluster. Nur Set2 wird aktiviert. Die Vorlage spricht von vier Algorithmen, nennt aber RK, LC, PG, RND und RO. Mit steigendem Level ändern sich die Schwellen und die Defektkorrektur wird stärker;

<!-- source: EN PDF p140; unit 1458 -->

Triple_leve: Besonders wirksam für Cluster aus drei oder mehr Defektpixeln in einer Nachbarschaft. Set3 und fix_set werden aktiviert. Set3 verwendet die vier Algorithmen RK, PG, RND und RO. Mit steigendem Level ändern sich die Schwellen und die Defektkorrektur wird stärker.

<!-- source: EN PDF p140; unit 1459 -->

Da die drei Modi unterschiedliche Hardware-Erkennungsschemata verwenden, können sie gleichzeitig aktiviert werden. Triple_level verstärkt jedoch Double_level und Single_level; Double_level verstärkt Single_level.

<!-- source: EN PDF p140; unit 1460 -->

![Originalabbildung aus dem englischen PDF, Seite 140](/docs/rockchip-isp30-tuning/assets/en-p140-X929.png)

<!-- source: EN PDF p140; unit 1461 -->

##### 6.1.2   4.6.1.2 Sensor DPCC

<!-- source: EN PDF p140; unit 1462 -->

Sensor DPCC ist die sensorinterne Defektpixelkorrektur. Unterstützt die Sensortreiberimplementierung dies, kann AIQ das sensorseitige DPCC-Modul über die zugehörigen Parameter der JSON-Parameterdatei steuern.

<!-- source: EN PDF p140; unit 1463 -->

<!-- source: EN PDF p140; unit 1464 -->

#### 6.2   4.6.2 Wichtige Parameter

<!-- source: EN PDF p140; unit 1465 -->

##### 6.2.1   4.6.2.1 Enable

<!-- source: EN PDF p140; unit 1466 -->

【Beschreibung】

<!-- source: EN PDF p140; unit 1467 -->

DPCC-Schalterfunktion

<!-- source: EN PDF p140; unit 1468 -->

0: aus

<!-- source: EN PDF p140; unit 1469 -->

1: ein

<!-- source: EN PDF p140; unit 1470 -->

【Mitglieder】

<!-- source: EN PDF p140; unit 1471 -->

【Hinweise】

<!-- source: EN PDF p141; unit 1472 -->

##### 6.2.2   4.6.2.2 Fast_mode

<!-- source: EN PDF p141; unit 1473 -->

【Beschreibung】

<!-- source: EN PDF p141; unit 1474 -->

Hier werden die Parameter des Fast_mode eingestellt.

<!-- source: EN PDF p141; unit 1475 -->

【Mitglieder】

<!-- source: EN PDF p141; unit 1476 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| Fast_mode_enable | Fast_mode-Schalter, 0: aus, 1: ein. |
| ISO | ISO der Umgebung |
| Single_enable | Schalter zur Korrektur einzelner Defektpixel, 0: aus, 1: ein. |
| Single_level | Korrekturstärke für einzelne Defektpixel, Wertebereich [0, 10]. |
| Double_enable | Schalter zur Korrektur doppelter Defektpixel, 0: aus, 1: ein. |
| Double_level | Korrekturstärke für doppelte Defektpixel, Wertebereich [0, 10]. |
| Triple_enable | Schalter zur Korrektur mehrerer Defektpixel, 0: aus, 1: ein. |
| Triple_level | Korrekturstärke für mehrere Defektpixel, Wertebereich [0, 10]. |

<!-- source: EN PDF p141; unit 1477 -->

【Hinweise】

<!-- source: EN PDF p141; unit 1478 -->

Fast_mode_enable: Bei 0 ist Fast_mode aus und Expert_mode ein; bei 1 ist Fast_mode ein und Expert_mode aus.

<!-- source: EN PDF p141; unit 1479 -->

Doppelte und mehrfache Defektpixel bezeichnen mehrere aneinander angrenzende defekte Pixel.

<!-- source: EN PDF p141; unit 1480 -->

Korrekturstärke: 0 bedeutet keine Behandlung. 1~10 bezeichnen unterschiedliche Stärken; je größer der Wert, desto stärker die Korrektur.

<!-- source: EN PDF p141; unit 1481 -->

Wird mit Fast_mode die gewünschte Korrekturstärke nicht erreicht, Expert_mode verwenden.

<!-- source: EN PDF p141; unit 1482 -->

##### 6.2.3   4.6.2.3 Expert_mode

<!-- source: EN PDF p141; unit 1483 -->

【Beschreibung】

<!-- source: EN PDF p141; unit 1484 -->

Hier werden die Parameter des Expert_mode eingestellt.

<!-- source: EN PDF p141; unit 1485 -->

【Mitglieder】

<!-- source: EN PDF p142; unit 1486 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| stage1_Enable | Standardwert 1 |
| grayscale_mode | Schwarzweißmodus, 0: aus, 1: ein. |
| rk_out_sel | Auswahl von ro_lim im RK-Defektpixelalgorithmus: 0:ro_lim1,1:ro_lim2,2:ro_lim3 |
| dpcc_out_sel | Defektpixel-Korrekturmodus, 0: Medianmodus, 1: RK-Modus. |
| stage1_rb_3x3 | Standardwert: 0 |
| stage1_g_3x3 | Standardwert: 0 |
| stage1_inc_rb_center | Den zu korrigierenden Pixel bei der Median-Korrektur des Rot-/Blaukanals einbeziehen? 0: nein, 1: ja. Standardwert 1. |
| stage1_inc_g_center | Den zu korrigierenden Pixel bei der Median-Korrektur des Grünkanals einbeziehen? 0: nein, 1: ja. Standardwert 1. |
| set | Bedingungen des Erkennungsschemas |

<!-- source: EN PDF p142; unit 1487 -->

【Hinweise】

<!-- source: EN PDF p142; unit 1488 -->

grayscale_mode: Bei einem Farbsensor auf 0, bei einem Schwarzweißsensor auf 1 setzen.

<!-- source: EN PDF p142; unit 1489 -->

###### 6.2.3.1   4.6.2.3.1 SetEnable

<!-- source: EN PDF p142; unit 1490 -->

【Beschreibung】

<!-- source: EN PDF p142; unit 1491 -->

Schalter der vier Schemata im Expert_mode.

<!-- source: EN PDF p142; unit 1492 -->

【Mitglieder】

<!-- source: EN PDF p142; unit 1493 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| ISO | ISO der Umgebung |
| stage1_use_fix_set | Schalter der integrierten Defektpixelbedingung, 0: aus, 1: ein. |
| stage1_use_set3 | Schalter der dritten Defektpixelbedingung in set_cell, 0: aus, 1: ein. |
| stage1_use_set2 | Schalter der zweiten Defektpixelbedingung in set_cell, 0: aus, 1: ein. |
| stage1_use_set1 | Schalter der ersten Defektpixelbedingung in set_cell, 0: aus, 1: ein. |

<!-- source: EN PDF p142; unit 1494 -->

【Hinweise】

<!-- source: EN PDF p142; unit 1495 -->

###### 6.2.3.2   4.6.2.3.2 set

<!-- source: EN PDF p142; unit 1496 -->

【Beschreibung】

<!-- source: EN PDF p142; unit 1497 -->

Hier lassen sich die Schwellen der Defektpixelbedingungen einstellen. Dazu gehören hauptsächlich die sechs Bedingungen RK, LC, PG, RND, RG und RO, die logisch UND-verknüpft sind.

<!-- source: EN PDF p143; unit 1498 -->

![Originalabbildung aus dem englischen PDF, Seite 143](/docs/rockchip-isp30-tuning/assets/en-p143-X944.png)

<!-- source: EN PDF p143; unit 1499 -->

Blockdiagramm von set_cell

<!-- source: EN PDF p143; unit 1500 -->

【Mitglieder】

<!-- source: EN PDF p143; unit 1501 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK | RK-Defektpixelalgorithmus |
| LC | LC-Defektpixelalgorithmus |
| PG | PG-Defektpixelalgorithmus |
| RNG | RND-Defektpixelalgorithmus |
| RG | RG-Defektpixelalgorithmus |
| RO | RO-Defektpixelalgorithmus |

<!-- source: EN PDF p143; unit 1502 -->

【Hinweise】

<!-- source: EN PDF p143; unit 1503 -->

###### 6.2.3.2.1 4.6.2.3.2.1 RK

<!-- source: EN PDF p143; unit 1504 -->

【Beschreibung】

<!-- source: EN PDF p143; unit 1505 -->

Hier werden die Parameter des RK-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p143; unit 1506 -->

【Mitglieder】

<!-- source: EN PDF p143; unit 1507 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RK_red_blue_enable | RK-Defektpixelalgorithmus Rot-/Blaukanal Schalter, 0: aus, 1: ein |
| RK_green_enable | RK-Defektpixelalgorithmus Grünkanal Schalter, 0: aus, 1: ein |
| rb_sw_mindis | RK-Defektpixelalgorithmus Rot-/Blaukanal Schwelle 1, Wertebereich [0,255] |
| g_sw_mindis | Schwelle 1 des Grünkanals im RK-Defektpixelalgorithmus, Wertebereich [0,255]. |
| sw_dis_scale_min | RK-Defektpixelalgorithmus Schwelle 2, Wertebereich [0,63] |
| sw_dis_scale_max | RK-Defektpixelalgorithmus Schwelle 3, Wertebereich [0,63] |

<!-- source: EN PDF p144; unit 1508 -->

【Hinweise】

<!-- source: EN PDF p144; unit 1509 -->

###### 6.2.3.2.2 4.6.2.3.2.2 LC

<!-- source: EN PDF p144; unit 1510 -->

【Beschreibung】

<!-- source: EN PDF p144; unit 1511 -->

Hier werden die Parameter des LC-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p144; unit 1512 -->

【Mitglieder】

<!-- source: EN PDF p144; unit 1513 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| LC_red_blue_enable | LC-Defektpixelalgorithmus Rot-/Blaukanal Schalter, 0: aus, 1: ein |
| LC_green_enable | LC-Defektpixelalgorithmus Grünkanal Schalter, 0: aus, 1: ein |
| rb_line_thr | LC-Defektpixelalgorithmus Rot-/Blaukanal Schwelle, Wertebereich [0,255], Standardwert 16 |
| g_line_thr | LC-Defektpixelalgorithmus Grünkanal Schwelle, Wertebereich [0,255], Standardwert 12 |
| rb_line_mad_fac | LC-Defektpixelalgorithmus Rot-/Blaukanal Koeffizient, Wertebereich [0,63], Standardwert 34 |
| g_line_mad_fac | Grünkanal-Koeffizient des LC-Defektpixelalgorithmus, Wertebereich [0,63], Standardwert 16. |

<!-- source: EN PDF p144; unit 1514 -->

【Hinweise】

<!-- source: EN PDF p144; unit 1515 -->

###### 6.2.3.2.3 4.6.2.3.2.3 PG

<!-- source: EN PDF p144; unit 1516 -->

【Beschreibung】

<!-- source: EN PDF p144; unit 1517 -->

Hier werden die Parameter des PG-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p144; unit 1518 -->

【Mitglieder】

<!-- source: EN PDF p144; unit 1519 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| PG_red_blue_enable | PG-Defektpixelalgorithmus Rot-/Blaukanal Schalter, 0: aus, 1: ein |
| PG_green_enable | PG-Defektpixelalgorithmus Grünkanal Schalter, 0: aus, 1: ein |
| rb_pg_fac | PG-Defektpixelalgorithmus Rot-/Blaukanal Koeffizient, Wertebereich [0,63], Standardwert 4 |
| g_pg_fac | PG-Defektpixelalgorithmus Grünkanal Koeffizient, Wertebereich [0,63], Standardwert 3 |

<!-- source: EN PDF p144; unit 1520 -->

【Hinweise】

<!-- source: EN PDF p144; unit 1521 -->

###### 6.2.3.2.4 4.6.2.3.2.4 RND

<!-- source: EN PDF p144; unit 1522 -->

【Beschreibung】

<!-- source: EN PDF p144; unit 1523 -->

Hier werden die Parameter des RND-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p145; unit 1524 -->

【Mitglieder】

<!-- source: EN PDF p145; unit 1525 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RND_red_blue_enable | RND-Defektpixelalgorithmus Rot-/Blaukanal Schalter, 0: aus, 1: ein |
| RND_green_enable | RND-Defektpixelalgorithmus Grünkanal Schalter, 0: aus, 1: ein |
| rb_rnd_thr | RND-Defektpixelalgorithmus Rot-/Blaukanal Schwelle, Wertebereich [0,255], Standardwert 8 |
| g_rnd_thr | Grünkanal-Schwelle des RND-Defektpixelalgorithmus, Wertebereich [0,255], Standardwert 8. |
| rb_rnd_offs | RND-Defektpixelalgorithmus Rot-/Blaukanal Versatz, Wertebereich [0,3], Standardwert 3 |
| g_rnd_offs | Grünkanal-Versatz des RND-Defektpixelalgorithmus, Wertebereich [0,3], Standardwert 3. |

<!-- source: EN PDF p145; unit 1526 -->

【Hinweise】

<!-- source: EN PDF p145; unit 1527 -->

###### 6.2.3.2.5 4.6.2.3.2.5 RG

<!-- source: EN PDF p145; unit 1528 -->

【Beschreibung】

<!-- source: EN PDF p145; unit 1529 -->

Hier werden die Parameter des RG-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p145; unit 1530 -->

【Mitglieder】

<!-- source: EN PDF p145; unit 1531 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RG_red_blue_enable | RG-Defektpixelalgorithmus Rot-/Blaukanal Schalter, 0: aus, 1: ein |
| RG_green_enable | RG-Defektpixelalgorithmus Grünkanal Schalter, 0: aus, 1: ein |
| rb_rg_fac | RG-Defektpixelalgorithmus Rot-/Blaukanal Koeffizient, Wertebereich [0,63], Standardwert 8 |
| g_rg_fac | Grünkanal-Koeffizient des RG-Defektpixelalgorithmus, Wertebereich [0,63], Standardwert 8. |

<!-- source: EN PDF p145; unit 1532 -->

【Hinweise】

<!-- source: EN PDF p145; unit 1533 -->

###### 6.2.3.2.6 4.6.2.3.2.6 RO

<!-- source: EN PDF p145; unit 1534 -->

【Beschreibung】

<!-- source: EN PDF p145; unit 1535 -->

Hier werden die Parameter des RO-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p145; unit 1536 -->

【Mitglieder】

<!-- source: EN PDF p146; unit 1537 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| RO_red_blue_enable | RO-Defektpixelalgorithmus Rot-/Blaukanal Schalter, 0: aus, 1: ein |
| RO_green_enable | RO-Defektpixelalgorithmus Grünkanal Schalter, 0: aus, 1: ein |
| rb_ro_lim | RO-Defektpixelalgorithmus Rot-/Blaukanal Schwelle, Wertebereich [0,3], Standardwert 1 |
| g_ro_lim | RO-Defektpixelalgorithmus Grünkanal Schwelle, Wertebereich [0,3], Standardwert 1 |

<!-- source: EN PDF p146; unit 1538 -->

【Hinweise】

<!-- source: EN PDF p146; unit 1539 -->

##### 6.2.4   4.6.2.5 sensor_dpcc

<!-- source: EN PDF p146; unit 1540 -->

【Beschreibung】

<!-- source: EN PDF p146; unit 1541 -->

Hier lässt sich die Stärke der sensorinternen Defektpixelkorrektur einstellen.

<!-- source: EN PDF p146; unit 1542 -->

【Mitglieder】

<!-- source: EN PDF p146; unit 1543 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| sensor_dpcc_auto_en | Schalter für Sensor DPCC, 0: aus, 1: ein. |
| max_level | Maximale Defektpixel-Korrekturstärke |
| ISO | ISO der Umgebung |
| level_single | Korrekturstärke für einzelne Defektpixel |
| level_multiple | Korrekturstärke für mehrere Defektpixel |

<!-- source: EN PDF p146; unit 1544 -->

【Hinweise】

<!-- source: EN PDF p146; unit 1545 -->

#### 6.3   4.6.3 Abstimmungsschritte

<!-- source: EN PDF p146; unit 1546 -->

Die DPCC-Abstimmung umfasst Fast_mode, Expert_mode und sensor_dpcc. Fast_mode und Expert_mode schließen sich gegenseitig aus; maßgeblich ist Fast_mode_enable in Fast_mode. Bei 0 ist Fast_mode aus und Expert_mode ein, bei 1 Fast_mode ein und Expert_mode aus.

<!-- source: EN PDF p146; unit 1547 -->

In der Praxis zuerst Fast_mode zur Defektpixelkorrektur verwenden. Reicht dessen Korrekturstärke nicht aus, auf Expert_mode wechseln.

<!-- source: EN PDF p147; unit 1548 -->

##### 6.3.1   4.6.3.1 Fast_mode-Abstimmung

<!-- source: EN PDF p147; unit 1549 -->

【Beschreibung】

<!-- source: EN PDF p147; unit 1550 -->

Im Fast_mode werden einzelne Defektpixel hauptsächlich über Single_level korrigiert, zwei benachbarte über Double_level und mehr als drei benachbarte über Triple_level.

<!-- source: EN PDF p147; unit 1551 -->

Die drei Funktionen sind grundsätzlich unabhängig; Triple_level erhöht jedoch die Stärke von Double_level, und Double_level erhöht die Stärke von Single_level.

<!-- source: EN PDF p147; unit 1552 -->

【Mitglieder】

<!-- source: EN PDF p147; unit 1553 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| Fast_mode_enable | Fast_mode-Schalter, 0: aus, 1: ein. |
| Single_level | Korrekturstärke für einzelne Defektpixel, Wertebereich [0, 10]. |
| Double_level | Korrekturstärke für doppelte Defektpixel, Wertebereich [0, 10]. |
| Triple_level | Korrekturstärke für mehrere Defektpixel, Wertebereich [0, 10]. |

<!-- source: EN PDF p147; unit 1554 -->

【Hinweise】

<!-- source: EN PDF p147; unit 1555 -->

Korrekturstärke: 0 bedeutet keine Behandlung. 1~10 bezeichnen unterschiedliche Stärken; je größer der Wert, desto stärker die Korrektur.

<!-- source: EN PDF p147; unit 1556 -->

Bei aktiviertem Defektpixelmodus darf die zugehörige Korrekturstärke nicht 0 sein. Beispielsweise darf Single_level bei aktiviertem Single_enable nicht 0 sein.

<!-- source: EN PDF p147; unit 1557 -->

##### 6.3.2   4.6.3.2 Expert_mode-Abstimmung

<!-- source: EN PDF p147; unit 1558 -->

【Beschreibung】

<!-- source: EN PDF p147; unit 1559 -->

Expert_mode korrigiert Defektpixel hauptsächlich über stage1_use_fix_set, stage1_use_set1, stage1_use_set2, stage1_use_set3 und set_cell.

<!-- source: EN PDF p147; unit 1560 -->

stage1_use_fix_set, stage1_use_set1, stage1_use_set2 und stage1_use_set3 sind vier voneinander unabhängige Erkennungsmethoden. Sind alle vier aktiv, genügt es, wenn eine davon einen Pixel als defekt erkennt.

<!-- source: EN PDF p147; unit 1561 -->

Die Bedingungen von stage1_use_fix_set sind in der Hardware festgelegt. Die Bedingungen von stage1_use_set1, stage1_use_set2 und stage1_use_set3 entsprechen cell1, cell2 bzw. cell3 in set_cell.

<!-- source: EN PDF p147; unit 1562 -->

set_cell enthält die sechs Algorithmen RK, LC, PG, RND, RG und RO. Sie sind UND-verknüpft: Sind alle sechs aktiviert, muss der untersuchte Pixel alle sechs Bedingungen erfüllen, um als defekt zu gelten.

<!-- source: EN PDF p147; unit 1563 -->

【Mitglieder】

<!-- source: EN PDF p148; unit 1564 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| stage1_use_fix_set | Schalter der integrierten Defektpixelbedingung, 0: aus, 1: ein. |
| stage1_use_set1 | Schalter der ersten Defektpixelbedingung in set_cell, 0: aus, 1: ein. |
| stage1_use_set3 | Schalter der dritten Defektpixelbedingung in set_cell, 0: aus, 1: ein. |
| set_cell | Bedingung zur Defektpixelerkennung |

<!-- source: EN PDF p148; unit 1565 -->

【Hinweise】

<!-- source: EN PDF p148; unit 1566 -->

Die sechs Algorithmen RK, LC, PG, RND, RG und RO prüfen Defekte getrennt für Grün sowie Rot/Blau. Empfohlen wird, beide Kanalgruppen synchron ein- und auszuschalten.

<!-- source: EN PDF p148; unit 1567 -->

Die sechs Algorithmen lassen sich unabhängig ein- und ausschalten. Wegen ihrer UND-Verknüpfung sinkt mit wachsender Zahl aktivierter Algorithmen die Wahrscheinlichkeit einer Defekteinstufung. Werden jedoch nur wenige aktiviert, kann Rauschen zu „Kantenzittern“ führen: An festen Bildkanten erscheinen Wellenlinien, die sich von Bild zu Bild ändern. Daher sollten in der Praxis mindestens drei Algorithmen je Set aktiviert sein.

<!-- source: EN PDF p148; unit 1568 -->

###### 6.3.2.1   4.6.3.2.1 RK

<!-- source: EN PDF p148; unit 1569 -->

【Beschreibung】

<!-- source: EN PDF p148; unit 1570 -->

Hier werden die Parameter des RK-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p148; unit 1571 -->

【Mitglieder】

<!-- source: EN PDF p148; unit 1572 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | RK-Defektpixelalgorithmus Schalter, 0: aus, 1: ein |
| ro_lim | RK-Defektpixelalgorithmus Versatz, Wertebereich [0,3] |
| sw_mindis | RK-Defektpixelalgorithmus Schwelle 1, Wertebereich [0,255] |
| sw_dis_scale_min | RK-Defektpixelalgorithmus Schwelle 2, Wertebereich [0,63] |
| sw_dis_scale_max | RK-Defektpixelalgorithmus Schwelle 3, Wertebereich [0,63] |

<!-- source: EN PDF p148; unit 1573 -->

【Hinweise】

<!-- source: EN PDF p148; unit 1574 -->

ro_lim: Je größer der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p148; unit 1575 -->

sw_mindis: Je kleiner der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p148; unit 1576 -->

sw_dis_scale_max: Je kleiner der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p148; unit 1577 -->

sw_dis_scale_max: Je kleiner der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p149; unit 1578 -->

###### 6.3.2.2   4.6.3.2.2 LC

<!-- source: EN PDF p149; unit 1579 -->

【Beschreibung】

<!-- source: EN PDF p149; unit 1580 -->

Hier werden die Parameter des LC-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p149; unit 1581 -->

【Mitglieder】

<!-- source: EN PDF p149; unit 1582 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | LC-Defektpixelalgorithmus Schalter, 0: aus, 1: ein |
| line_thr | LC-Defektpixelalgorithmus Kanal Schwelle, Wertebereich [0,255], Standardwert 12 |
| line_mad_fac | LC-Defektpixelalgorithmus Kanal Koeffizient, Wertebereich [0,63], Standardwert 16 |

<!-- source: EN PDF p149; unit 1583 -->

【Hinweise】

<!-- source: EN PDF p149; unit 1584 -->

line_thr: Je kleiner der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p149; unit 1585 -->

line_mad_fac: Je kleiner der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p149; unit 1586 -->

###### 6.3.2.3   4.6.3.2.3 PG

<!-- source: EN PDF p149; unit 1587 -->

【Beschreibung】

<!-- source: EN PDF p149; unit 1588 -->

Hier werden die Parameter des PG-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p149; unit 1589 -->

【Mitglieder】

<!-- source: EN PDF p149; unit 1590 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | PG-Defektpixelalgorithmus Schalter, 0: aus, 1: ein |
| pg_fac | PG-Defektpixelalgorithmus Kanal Koeffizient, Wertebereich [0,63], Standardwert 3 |

<!-- source: EN PDF p149; unit 1591 -->

【Hinweise】

<!-- source: EN PDF p149; unit 1592 -->

pg_fac: Je kleiner der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p149; unit 1593 -->

###### 6.3.2.4   4.6.3.2.4 RND

<!-- source: EN PDF p149; unit 1594 -->

【Beschreibung】

<!-- source: EN PDF p149; unit 1595 -->

Hier werden die Parameter des RND-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p149; unit 1596 -->

【Mitglieder】

<!-- source: EN PDF p150; unit 1597 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | RND-Defektpixelalgorithmus Schalter, 0: aus, 1: ein |
| rnd_thr | RND-Defektpixelalgorithmus Kanal Schwelle, Wertebereich [0,255], Standardwert 8 |
| rnd_offs | RND-Defektpixelalgorithmus Kanal Versatz, Wertebereich [0,3], Standardwert 3 |

<!-- source: EN PDF p150; unit 1598 -->

【Hinweise】

<!-- source: EN PDF p150; unit 1599 -->

rnd_thr: Je kleiner der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p150; unit 1600 -->

rnd_offs: Je kleiner der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p150; unit 1601 -->

###### 6.3.2.5   4.6.3.2.5 RG

<!-- source: EN PDF p150; unit 1602 -->

【Beschreibung】

<!-- source: EN PDF p150; unit 1603 -->

Hier werden die Parameter des RG-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p150; unit 1604 -->

【Mitglieder】

<!-- source: EN PDF p150; unit 1605 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | RG-Defektpixelalgorithmus Schalter, 0: aus, 1: ein |
| rg_fac | RG-Defektpixelalgorithmus Kanal Koeffizient, Wertebereich [0,63], Standardwert 8 |

<!-- source: EN PDF p150; unit 1606 -->

【Hinweise】

<!-- source: EN PDF p150; unit 1607 -->

rg_fac: Je kleiner der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p150; unit 1608 -->

###### 6.3.2.6   4.6.3.2.6 RO

<!-- source: EN PDF p150; unit 1609 -->

【Beschreibung】

<!-- source: EN PDF p150; unit 1610 -->

Hier werden die Parameter des RO-Algorithmus zur Defektpixelerkennung eingestellt.

<!-- source: EN PDF p150; unit 1611 -->

【Mitglieder】

<!-- source: EN PDF p150; unit 1612 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| enable | RO-Defektpixelalgorithmus Kanal Schalter, 0: aus, 1: ein |
| ro_lim | RO-Defektpixelalgorithmus Kanal Schwelle, Wertebereich [0,3], Standardwert 1 |

<!-- source: EN PDF p150; unit 1613 -->

【Hinweise】

<!-- source: EN PDF p151; unit 1614 -->

ro_lim: Je größer der Wert, desto eher wird ein Pixel als defekt erkannt.

<!-- source: EN PDF p151; unit 1615 -->

##### 6.3.3   4.6.3.3 sensor_dpcc-Abstimmung

<!-- source: EN PDF p151; unit 1616 -->

【Beschreibung】

<!-- source: EN PDF p151; unit 1617 -->

sensor_dpcc steuert die sensorseitige Defektpixelkorrektur hauptsächlich über max_level, level_single und level_multiple. Voraussetzung sind eine entsprechende Funktion im Sensor selbst und eine abgeschlossene Treiberkonfiguration.

<!-- source: EN PDF p151; unit 1618 -->

【Mitglieder】

<!-- source: EN PDF p151; unit 1619 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| max_level | Maximale Defektpixel-Korrekturstärke |
| level_single | Korrekturstärke für einzelne Defektpixel |
| level_multiple | Korrekturstärke für mehrere Defektpixel |

<!-- source: EN PDF p151; unit 1620 -->

【Hinweise】

<!-- source: EN PDF p151; unit 1621 -->

max_level legt die maximale Korrekturstärke des Sensors fest und dient hauptsächlich zur feineren Unterteilung der einzelnen Korrekturstufen.

<!-- source: EN PDF p151; unit 1622 -->

Die Stärke von level_single und level_multiple darf max_level nicht überschreiten.

<!-- source: EN PDF p151; unit 1623 -->

### 7.   4.7 Gamma

<!-- source: EN PDF p151; unit 1624 -->

#### 7.1   4.7.1 Funktionsbeschreibung

<!-- source: EN PDF p151; unit 1625 -->

Dieses Modul stellt die drei Gammakurven curve_normal, curve_hdr und curve_night ein.

<!-- source: EN PDF p151; unit 1626 -->

<!-- source: EN PDF p151; unit 1627 -->

![Originalabbildung aus dem englischen PDF, Seite 151](/docs/rockchip-isp30-tuning/assets/en-p151-X977.png)

<!-- source: EN PDF p151; unit 1628 -->

GAMMA-Blockdiagramm

<!-- source: EN PDF p152; unit 1629 -->

#### 7.2   4.7.2 Wichtige Parameter

<!-- source: EN PDF p152; unit 1630 -->

##### 7.2.1   4.7.2.1 Gamma_en

<!-- source: EN PDF p152; unit 1631 -->

【Beschreibung】

<!-- source: EN PDF p152; unit 1632 -->

Gamma-Schalterfunktion

<!-- source: EN PDF p152; unit 1633 -->

0: aus

<!-- source: EN PDF p152; unit 1634 -->

1: ein

<!-- source: EN PDF p152; unit 1635 -->

【Mitglieder】

<!-- source: EN PDF p152; unit 1636 -->

【Hinweise】

<!-- source: EN PDF p152; unit 1637 -->

##### 7.2.2   4.7.2.2 Gamma_out_offset

<!-- source: EN PDF p152; unit 1638 -->

【Beschreibung】

<!-- source: EN PDF p152; unit 1639 -->

Korrektur der Gammakurve, Wertebereich [-2048, 2048], Standardwert 0.

<!-- source: EN PDF p152; unit 1640 -->

【Mitglieder】

<!-- source: EN PDF p152; unit 1641 -->

【Hinweise】

<!-- source: EN PDF p152; unit 1642 -->

Die tatsächlich verwendete Gammakurve ist Gamma_curve-Gamma_out_offset.

<!-- source: EN PDF p152; unit 1643 -->

##### 7.2.3   4.7.2.3 Gamma_curve

<!-- source: EN PDF p152; unit 1644 -->

【Beschreibung】

<!-- source: EN PDF p152; unit 1645 -->

Y-Achsen-Werte der Gammakurve mit 49 Punkten, Wertebereich [0,4095].

<!-- source: EN PDF p152; unit 1646 -->

【Mitglieder】

<!-- source: EN PDF p152; unit 1647 -->

【Hinweise】

<!-- source: EN PDF p152; unit 1648 -->

Die X-Achsen-Stützstellen der Gammakurve sind auf 49 Punkte festgelegt:

<!-- source: EN PDF p152; unit 1649 -->

```c
  int X_isp30[49] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32,
  40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640,
  768, 896, 1024, 1280, 1536, 1792, 2048, 2304, 2560, 2816, 3072, 3328, 3584, 3840,
  4095};
```

<!-- source: EN PDF p152; unit 1650 -->

#### 7.3   4.7.3 Abstimmungsschritte

<!-- source: EN PDF p153; unit 1651 -->

### 8.   4.8 Debayer

<!-- source: EN PDF p153; unit 1652 -->

#### 8.1   4.8.1 Funktionsbeschreibung

<!-- source: EN PDF p153; unit 1653 -->

Die meisten Farbkameras verwenden einen einzigen Sensor zur Bilderfassung. Seine Oberfläche ist mit einem CFA (Color Filter Array, Farbfiltermatrix) bedeckt, sodass jeder Pixel nur eine der drei Grundfarben R, G oder B erfasst. Da pro Pixel nur eine Farbkomponente bekannt ist, müssen die zwei fehlenden Komponenten aus den bekannten Farbinformationen interpoliert werden, um ein Farbbild zu erhalten. Dieser Vorgang heißt Demosaicing (Debayer oder Demosaic). Das Modul unterstützt die vier Muster RGGB, BGGR, GRBG und gbrg, jedoch keinen RGBIR-Modus.

<!-- source: EN PDF p153; unit 1654 -->

![Originalabbildung aus dem englischen PDF, Seite 153](/docs/rockchip-isp30-tuning/assets/en-p153-X991.png)

<!-- source: EN PDF p153; unit 1655 -->

Abb. 4-10-1: Schematische Darstellung der Debayer-Funktion

<!-- source: EN PDF p153; unit 1656 -->

#### 8.2   4.8.2 Wichtige Parameter

<!-- source: EN PDF p153; unit 1657 -->

##### 8.2.1   Enable

<!-- source: EN PDF p153; unit 1658 -->

【Beschreibung】

<!-- source: EN PDF p153; unit 1659 -->

Aktivierungsbit des Debayer-Moduls, 0: aus, 1: ein.

<!-- source: EN PDF p153; unit 1660 -->

##### 8.2.2   debayer_filter1

<!-- source: EN PDF p153; unit 1661 -->

【Beschreibung】

<!-- source: EN PDF p153; unit 1662 -->

Niederfrequenz-Gradientenfilter, Wertebereich [-8,7].

<!-- source: EN PDF p154; unit 1663 -->

##### 8.2.3   debayer_filter2

<!-- source: EN PDF p154; unit 1664 -->

【Beschreibung】

<!-- source: EN PDF p154; unit 1665 -->

Hochfrequenz-Gradientenfilter, Wertebereich [-8,7].

<!-- source: EN PDF p154; unit 1666 -->

##### 8.2.4   debayer_gain_offset

<!-- source: EN PDF p154; unit 1667 -->

【Beschreibung】

<!-- source: EN PDF p154; unit 1668 -->

Gradientenversatz bei der Berechnung des Schärfungsgewichts im G-Kanal-Interpolationskoeffizienten, Wertebereich [0,15].

<!-- source: EN PDF p154; unit 1669 -->

##### 8.2.5   ISO

<!-- source: EN PDF p154; unit 1670 -->

【Beschreibung】

<!-- source: EN PDF p154; unit 1671 -->

ISO-Wert der aktuellen Datei, Wertebereich [50,2048].

<!-- source: EN PDF p154; unit 1672 -->

##### 8.2.6   sharp_strength

<!-- source: EN PDF p154; unit 1673 -->

【Beschreibung】

<!-- source: EN PDF p154; unit 1674 -->

Maximalwert des Schärfungsgewichts der G-Kanal-Interpolation, Wertebereich [0,4].

<!-- source: EN PDF p154; unit 1675 -->

##### 8.2.7   debayer_hf_offset

<!-- source: EN PDF p154; unit 1676 -->

【Beschreibung】

<!-- source: EN PDF p154; unit 1677 -->

Versatz bei der Gradientenberechnung, Wertebereich [0,4095].

<!-- source: EN PDF p154; unit 1678 -->

##### 8.2.8   debayer_offset

<!-- source: EN PDF p154; unit 1679 -->

【Beschreibung】

<!-- source: EN PDF p154; unit 1680 -->

Versatz der G-Kanal-Begrenzung, Wertebereich [0,15]. Je größer der Wert, desto größer der Begrenzungsbereich.

<!-- source: EN PDF p154; unit 1681 -->

##### 8.2.9   debayer_clip_en

<!-- source: EN PDF p154; unit 1682 -->

【Beschreibung】

<!-- source: EN PDF p154; unit 1683 -->

Schalter der Begrenzung bei der G-Kanal-Interpolation, 0: aus, 1: ein.

<!-- source: EN PDF p155; unit 1684 -->

##### 8.2.10   debayer_filter_g_en

<!-- source: EN PDF p155; unit 1685 -->

【Beschreibung】

<!-- source: EN PDF p155; unit 1686 -->

Schalter der Filterung des G-Kanal-Interpolationsergebnisses, 0: aus, 1: ein.

<!-- source: EN PDF p155; unit 1687 -->

##### 8.2.11   debayer_filter_c_en

<!-- source: EN PDF p155; unit 1688 -->

【Beschreibung】

<!-- source: EN PDF p155; unit 1689 -->

Schalter des Farbdifferenzfilters, 0: aus, 1: ein.

<!-- source: EN PDF p155; unit 1690 -->

##### 8.2.12   debayer_thed0

<!-- source: EN PDF p155; unit 1691 -->

【Beschreibung】

<!-- source: EN PDF p155; unit 1692 -->

Je größer der Wert, desto geringer die Wahrscheinlichkeit, das Hochfrequenzgewicht auszuwählen. Wertebereich [0,16].

<!-- source: EN PDF p155; unit 1693 -->

##### 8.2.13   debayer_thed1

<!-- source: EN PDF p155; unit 1694 -->

【Beschreibung】

<!-- source: EN PDF p155; unit 1695 -->

Je größer der Wert, desto geringer die Wahrscheinlichkeit, das Niederfrequenzgewicht auszuwählen. Wertebereich [0,16].

<!-- source: EN PDF p155; unit 1696 -->

##### 8.2.14   debayer_dist_scale

<!-- source: EN PDF p155; unit 1697 -->

【Beschreibung】

<!-- source: EN PDF p155; unit 1698 -->

Je größer der Wert, desto geringer die Wahrscheinlichkeit, das Hochfrequenzgewicht auszuwählen. Wertebereich [0,16]. debayer_hf_offset [Angehängter Bezeichner der Vorlage.]

<!-- source: EN PDF p155; unit 1699 -->

##### 8.2.15   debayer_cnr_strength

<!-- source: EN PDF p155; unit 1700 -->

【Beschreibung】

<!-- source: EN PDF p155; unit 1701 -->

Begrenzungsstärke bei der Farbdifferenzfilterung, Wertebereich [0,9].

<!-- source: EN PDF p155; unit 1702 -->

##### 8.2.16   debayer_shift_num

<!-- source: EN PDF p155; unit 1703 -->

【Beschreibung】

<!-- source: EN PDF p155; unit 1704 -->

Je kleiner der Wert, desto größer der Begrenzungsbereich der Farbdifferenz. Wertebereich [0,4].

<!-- source: EN PDF p156; unit 1705 -->

#### 8.3   4.8.3 Begriffserklärungen

<!-- source: EN PDF p156; unit 1706 -->

| Abkürzung | Beschreibung |
| --- | --- |
| CFA | Color Filter Array, Farbfiltermatrix |
| Demosaicing („Go Mosaic“ in der Vorlage) | Debayer oder Demosaic: Umwandlung von Bayer-RGB mit einer Farbkomponente je Pixel in RGB mit drei Farbkomponenten. |
| Filter | Satz von Filterparametern zur Entfernung unerwünschter Signale aus dem digitalen Bild |
| Farbdifferenzbild | Die Vorlage beschreibt das interpolierte G-Kanal-Bild als dem ursprünglichen RAW-Bild unterlegen. |

<!-- source: EN PDF p156; unit 1707 -->

### 9.   4.10 GIC

<!-- source: EN PDF p156; unit 1708 -->

#### 9.1   4.10.1 Funktionsbeschreibung

<!-- source: EN PDF p156; unit 1709 -->

Dieses Modul ermöglicht die Einstellung der GIC-Parameter. Die wesentlichen Parameter sind in GIC_ISO in zwei Gruppen aufgeteilt: GIC-Parameter und Rauschparameter. Die Rauschparameter werden durch Kalibrierung ermittelt; die GIC-Parameter stellen die GIC-Stärke ein.

<!-- source: EN PDF p156; unit 1710 -->

#### 9.2   4.10.2 Wichtige Parameter

<!-- source: EN PDF p156; unit 1711 -->

##### 9.2.1   4.10.2.1 enable

<!-- source: EN PDF p156; unit 1712 -->

【Beschreibung】

<!-- source: EN PDF p156; unit 1713 -->

GIC-Schalterfunktion

<!-- source: EN PDF p156; unit 1714 -->

0: aus

<!-- source: EN PDF p156; unit 1715 -->

1: ein

<!-- source: EN PDF p156; unit 1716 -->

【Mitglieder】

<!-- source: EN PDF p156; unit 1717 -->

【Hinweise】

<!-- source: EN PDF p156; unit 1718 -->

##### 9.2.2   4.10.2.3 gr_ration

<!-- source: EN PDF p156; unit 1719 -->

【Beschreibung】

<!-- source: EN PDF p156; unit 1720 -->

Parameter zur Bestimmung der gr- und GB-Kompensationswerte, Wertebereich [0,3], Standardwert 0.

<!-- source: EN PDF p156; unit 1721 -->

【Mitglieder】

<!-- source: EN PDF p156; unit 1722 -->

【Hinweise】

<!-- source: EN PDF p157; unit 1723 -->

##### 9.2.3   4.10.2.5 SettingV21

<!-- source: EN PDF p157; unit 1724 -->

【Beschreibung】

<!-- source: EN PDF p157; unit 1725 -->

Die entsprechenden Parameter anhand von ISO interpolieren.

<!-- source: EN PDF p157; unit 1726 -->

【Mitglieder】

<!-- source: EN PDF p158; unit 1727 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| iso | ISO der Umgebung |
| min_busy_thre | Erkennungsfähigkeit für strukturreiche Bereiche, Wertebereich [0, 1023], Standardwert 160. |
| min_grad_thr1 | Schwelle 1 für die Anzahl kantenfreier Bereiche, Steuerwert der GIC-Stärke. Wertebereich [0, 1023], Standardwert 32. |
| min_grad_thr2 | Schwelle 2 für die Anzahl kantenfreier Bereiche, Steuerwert der GIC-Stärke. Wertebereich [0, 1023], Standardwert 32. |
| k_grad1 | Reaktionsschwelle 1 für Kanten (horizontaler und vertikaler Gradient), Wertebereich [0, 15], Standardwert 5. |
| k_grad2 | Reaktionsschwelle 2 für Kanten (horizontaler und vertikaler Gradient), Wertebereich [0, 15], Standardwert 1. |
| gb_thre | Skalierungsfaktor, Wertebereich [0, 15], Standardwert 7. |
| maxCorV | Begrenzung des maximalen GB-Kompensationswerts an Kanten, Wertebereich [0, 1023], Standardwert 40. |
| maxCorVboth | Begrenzung des maximalen GB-Kompensationswerts in flachen, kantenfreien Bereichen, Wertebereich [0, 1023], Standardwert 8. |
| dark_thre | Schwelle 1 für dunkle Bereiche, Wertebereich [0, 2047], Standardwert 120. |
| dark_threHi | Schwelle 2 für dunkle Bereiche, Wertebereich [0, 2047], Standardwert 240. |
| k_grad1_dark | Kantenschwelle 1 für dunkle Bildbereiche (horizontaler und vertikaler Gradient), Wertebereich [0, 15], Standardwert 6. |
| k_grad2_dark | Kantenreaktionsschwelle 2 für dunkle Bildbereiche (horizontaler und vertikaler Gradient), Wertebereich [0, 15], Standardwert 1. |
| min_grad_thr_dark1 | Schwelle 1 für die Anzahl kantenfreier Bereiche im dunklen Bildteil, Wertebereich [0, 1023], Standardwert 64. |
| min_grad_thr_dark2 | Schwelle 2 für die Anzahl kantenfreier Bereiche im dunklen Bildteil, Wertebereich [0, 1023], Standardwert 32. |
| noiseCurve_0 | Rauschkurvenparameter 1 |
| noiseCurve_1 | Rauschkurvenparameter 2 |
| globalStrength | Globale Einstellung der Stärke des GB-Kompensationswerts, Wertebereich [0, 2], Standardwert 1. |
| NoiseScale | Aus der Rauschkurve die Standardabweichung des Rauschens am aktuellen Punkt bestimmen. noise_std *noise_scale legt den maximalen GB-Kompensationswert fest. |

<!-- source: EN PDF p159; unit 1728 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| NoiseBase | Schwelle zur Unterdrückung der Anpassung an Bildkanten. Das Ergebnis aus erstem und zweitem Gradienten plus noise_offset berechnen. Gilt bereits in einer Richtung gradx &gt; 2*grady, wird eine Kante angenommen und keine Anpassung durchgeführt. |
| diff_clip | Den maximalen GB-Kompensationswert begrenzen |

<!-- source: EN PDF p159; unit 1729 -->

【Hinweise】

<!-- source: EN PDF p159; unit 1730 -->

#### 9.3   4.10.3 Abstimmungsschritte

<!-- source: EN PDF p159; unit 1731 -->

Bei der GIC-Abstimmung werden hauptsächlich die GIC-bezogenen Parameter in GIC_ISO angepasst.

<!-- source: EN PDF p159; unit 1732 -->

##### 9.3.1   4.10.3.1 GIC_ISO-Abstimmung

<!-- source: EN PDF p159; unit 1733 -->

| Mitgliedsname | Beschreibung |
| --- | --- |
| min_busy_thre | Erkennungsfähigkeit für strukturreiche Bereiche, Wertebereich [16, 120], Standardwert 64. |
| min_grad_thr1 | Schwelle 1 für die Anzahl kantenfreier Bereiche, Steuerwert der GIC-Stärke |
| min_grad_thr2 | Schwelle 2 für die Anzahl kantenfreier Bereiche, Steuerwert der GIC-Stärke |
| k_grad1 | Reaktionsschwelle 1 für Kanten (horizontaler und vertikaler Gradient) |
| k_grad2 | Reaktionsschwelle 2 für Kanten (horizontaler und vertikaler Gradient) |
| gb_thre | Skalierungsfaktor |
| maxCorV | Maximalen GB-Kompensationswert an Kanten begrenzen |
| maxCorVboth | Maximalen GB-Kompensationswert in flachen, kantenfreien Bereichen begrenzen |
| dark_thre | Schwelle 1 für dunkle Bereiche festlegen |
| dark_threHi | Schwelle 2 für dunkle Bereiche festlegen |
| k_grad1_dark | Reaktionsschwelle 1 für Kanten im dunklen Bildteil (horizontaler und vertikaler Gradient) |
| k_grad2_dark | Reaktionsschwelle 2 für Kanten im dunklen Bildteil (horizontaler und vertikaler Gradient) |
| min_grad_thr_dark1 | Schwelle 1 für die Anzahl kantenfreier Bereiche im dunklen Bildteil |
| min_grad_thr_dark2 | Schwelle 2 für die Anzahl kantenfreier Bereiche im dunklen Bildteil |

<!-- source: EN PDF p159; unit 1734 -->

min_busy_thre: Korrigiert hauptsächlich die Erkennung strukturreicher dunkler Bereiche, etwa unregelmäßiger kontrastreicher Strukturen wie Schrift. Dunkle Bereiche werden dabei mit einer Schwelle versehen. Je größer der Wert, desto mehr BUSY-Bereiche werden im dunklen Bildteil erkannt, und umgekehrt. Für BUS-Bereiche führt GIC keine Verarbeitung aus. Mehr erkannte BUSY-Bereiche erhalten daher gewisse Kantendetails, verursachen bei Fehlklassifizierung jedoch verbleibende GIC-Artefakte.

<!-- source: EN PDF p160; unit 1735 -->

min_grad_thr1, min_grad_thr2: Beeinflussen unmittelbar die Anzahl kantenfreier Bereiche. Je mehr solche Bereiche erkannt werden, desto stärker die GIC-Wirkung und die Bildglättung und desto weniger Details bleiben erhalten. Bei weniger kantenfreien Bereichen können typische GIC-Strukturen zurückbleiben, etwa horizontale und vertikale Hell-Dunkel-Streifen oder falsche Kanten. Je höher der Wert, desto eher wird bei der Richtungsentscheidung ein flacher, kantenfreier Bereich angenommen. Diese Parameter steuern die GIC-Stärke.

<!-- source: EN PDF p160; unit 1736 -->

min_grad_thr_dark1, min_grad_thr_dark2: Wirkung und Abstimmung entsprechen min_grad_thr1 und min_grad_thr2. Üblicherweise werden größere Werte als bei min_grad_thr gewählt.

<!-- source: EN PDF p160; unit 1737 -->

k_grad1, k_grad2: Stellen die Reaktion auf Kanten, also horizontale und vertikale Gradienten, ein. Je größer der Wert, desto höher die Schwelle zur Kantenerkennung; schwache Kanten werden dann als flache Bereiche eingestuft. Kleinere Werte erhöhen die Anzahl erkannter Kanten.

<!-- source: EN PDF p160; unit 1738 -->

k_grad1_dark, k_grad2_dark: Wirkung und Abstimmung entsprechen k_grad1 und k_grad2. Üblicherweise werden größere Werte als bei k_grad gewählt, um die Kantenreaktion im dunklen Bildteil zu verringern.

<!-- source: EN PDF p160; unit 1739 -->

gb_thre: Ein Skalierungsfaktor, keine absolute Entscheidungsschwelle. Je größer er ist, desto kleiner der zulässige GB-Kompensationswert, und umgekehrt. Der Wert hängt stark von Sensor und Objektiv ab.

<!-- source: EN PDF p160; unit 1740 -->

maxCorV: Für den GB-Kompensationswert wird eine obere Grenze angenommen. Überschreitet das berechnete Ergebnis diese Schwelle, gilt es als Berechnungsfehler. Zur Verringerung dessen Auswirkungen wird der GB-Kompensationswert nach unten begrenzt.

<!-- source: EN PDF p160; unit 1741 -->

maxCorVboth: Gleicher Zweck wie maxCorV.

<!-- source: EN PDF p160; unit 1742 -->

dark_thre: Untere Grenze zwischen dunklen und normalen Bildbereichen.

<!-- source: EN PDF p160; unit 1743 -->

dark_threHi: Obere Grenze zwischen dunklen und normalen Bildbereichen.

{% endraw %}
