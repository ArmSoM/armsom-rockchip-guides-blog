---
title: "Rockchip ISP30-Farboptimierung: Vollständiger Leitfaden für AWB, CCM und 3DLUT"
description: "Vollständige Farbreferenz für ISP30 V3.0.2: Weißpunkterkennung und AWB-Strategie, Kalibrierung und Protokolle, CCM-Matrizen und Farbdifferenzen sowie 3DLUT-Werkzeuge und Beispiele."
translation_key: "076-rockchip-isp30-color-optimization"
slug: "076-rockchip-isp30-color-optimization"
lang: "de"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "AWB", "CCM", "3DLUT"]
keywords: "ArmSoM Rockchip ISP30 AWB CCM 3DLUT"
excerpt: "Vollständige Farbreferenz für ISP30 V3.0.2: Weißpunkterkennung und AWB-Strategie, Kalibrierung und Protokolle, CCM-Matrizen und Farbdifferenzen sowie 3DLUT-Werkzeuge und Beispiele."
---

{% raw %}

# Rockchip ISP30-Farboptimierung: Vollständiger Leitfaden für AWB, CCM und 3DLUT

Dieser Artikel bewahrt den vollständigen technischen Hauptteil (PDF S. 9–84) der 84-seitigen englischen Quelle V3.0.2. Es wurde keine chinesische Quelle bereitgestellt. Die chinesische, russische und deutsche Fassung sind vollständige Übersetzungen dieses Hauptteils. Alle Sprachfassungen verwenden dieselben separat extrahierten Originalabbildungen aus dem englischen PDF, einschließlich der darin vorhandenen chinesischen Oberflächenbeschriftungen. Die bei der Extraktion ausgelassenen Vektorgleichungen auf S. 64 wurden ebenfalls wiederhergestellt; Gleichungen, Tabellen und Code sind editierbar. Bereits in der Quelle abgeschnittene Protokollanfänge/-enden sowie nicht dargestellte Bildreferenzen wurden nicht erfunden.

Dies ist eine ArmSoM-Plattformreferenz ohne Hardwarevalidierung. Prüfen Sie das konkrete Board, den SoC, ISP, Sensor, SDK/BSP, AIQ, IQ Tool und Kernel. Die Produkttabelle auf S. 2 nennt RK3566/RK3568 bei leerem Kernelfeld; S. 9 nennt ISP30/RK3588, während S. 77 RK1109 erwähnt. Diese widersprüchlichen Geltungsbereiche werden dokumentiert, nicht auf alle ArmSoM-Boards verallgemeinert. Ergebnisse aus Quellbeispielen sind keine ArmSoM-Messungen. Es wurden weder Code noch Kamerakonfigurationen oder IQ-Aktualisierungen ausgeführt.

Beibehaltene technische Versionsangaben: V2.0.0 wechselt IQ von XML zu JSON und unterstützt AIQ V2.0x60.0/IQ Tool V2.0.2; V2.0.1 passt ISP21/RK356X an; V3.0.0 passt ISP30/RK3588 an; V3.0.1 entfernt die manuelle CCM-/3DLUT-JSON-Konfiguration und erlaubt nur den automatischen Online-Modus; die AWB-Simulation von V3.0.2 zielt auf IQ Tool V2.1.0. XML-Beispiele, Aussagen über noch nicht unterstützte Funktionen und abweichende ISP-Bezüge im Hauptteil bleiben zur Quelle zurückverfolgbar.

| SoC | Kernel (Quelle S. 2) |
|---|---|
| RK3566 / RK3568 | In der Quelle leer; nicht angegeben |

[Redaktionsnotizen](/docs/rockchip-isp30-color-optimization/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.9, block 0 -->

## 1 Übersicht

<!-- Source EN PDF p.9, block 1 -->

Zu den farbbezogenen Anpassungsmodulen von ISP30 gehören automatischer Weißabgleich (AWB), Farbkorrektur (CC) und dreidimensionale Nachschlagetabelle (3DLUT).

<!-- Source EN PDF p.9, block 2 -->

Die CCM- und 3DLUT-Module von ISP21 (RK3566/RK3568) unterscheiden sich nicht von denen von ISP20 (RV1126/RV1109). Bei der AWB-Abstimmung sind jedoch folgende Unterschiede zu beachten:

<!-- Source EN PDF p.9, block 3 -->

(1) ISP21 unterstützt keine Konfiguration mehrerer Unterfenster mit Multiwindow.

<!-- Source EN PDF p.9, block 4 -->

(2) Der 3dyuv-Algorithmus wurde aktualisiert.

<!-- Source EN PDF p.9, block 5 -->

(3) Das zusätzliche Erkennungsfenster unterstützt nur das Abziehen von Weißpunkten und kann nicht als zusätzliche Punktlichtquelle verwendet werden.

<!-- Source EN PDF p.9, block 6 -->

(4) Eine Funktion zur unterschiedlichen Gewichtung von Weißpunkten bei unterschiedlicher Helligkeit wurde ergänzt.

<!-- Source EN PDF p.9, block 7 -->

(5) Eine Blockgewichtungsfunktion wurde ergänzt.

<!-- Source EN PDF p.9, block 8 -->

(6) Im xy-Bereich sind pro Lichtquelle zwei Fenstergrößen konfiguriert, eine weniger als bei ISP20.

<!-- Source EN PDF p.9, block 9 -->

Die CCM- und 3DLUT-Module von ISP30 (RK3588) unterscheiden sich nicht von denen von ISP21 (RK3566/RK3568); für 3DLUT wurden jedoch Werkzeuge ergänzt (siehe Modulbeschreibung zu 3DLUT). Bei der AWB-Abstimmung sind folgende Unterschiede zu beachten:

<!-- Source EN PDF p.9, block 10 -->

(1) Das zusätzliche Erkennungsfenster unterstützt das Abziehen von Weißpunkten und kann auch als zusätzliche Punktlichtquelle verwendet werden.

<!-- Source EN PDF p.9, block 11 -->

(2) Das Werkzeug bietet eine aktualisierte Abstimmung der YUV-Schwellenwerte (siehe Beispiel 2).

<!-- Source EN PDF p.9, block 12 -->

## 2 AWB

<!-- Source EN PDF p.9, block 13 -->

### 2.1 Funktionsbeschreibung

<!-- Source EN PDF p.9, block 14 -->

Der automatische Weißabgleich berechnet selbstständig WB-Gains für die Kanäle R, G und B und multipliziert sie mit den RGB-Kanälen. So wird durch Umgebungslicht verfärbtes Weiß wieder zu reinem Weiß, damit die Kamerafarben unter verschiedenen Lichtbedingungen den tatsächlichen Objektfarben entsprechen. Enthält die Szene einen Weißpunkt, werden die WB-Gains anhand des automatisch erkannten Weißpunkts berechnet. Ohne Weißpunkt werden sie durch die einfache Farbmethode ermittelt. Das Farbadaptationsmodul passt das Korrekturziel so an, dass das weißabgeglichene Bild möglichst der menschlichen Wahrnehmung entspricht. Das Farbtonanpassungsmodul verändert den Gesamtfarbton nach persönlicher Präferenz. Der automatische Weißabgleich besteht aus Hardwarestatistik und Softwarestrategien, wie im AWB-Ablaufdiagramm dargestellt.

<!-- Source EN PDF p.10, block 15 -->

![Abbildung aus der englischen Quelle, PDF S. 10, Nr. 15](/docs/rockchip-isp30-color-optimization/assets/en-p10-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 10, Nr. 15.*

<!-- Source EN PDF p.10, block 16 -->

Abbildung: AWB-Ablauf

<!-- Source EN PDF p.10, block 17 -->

### 2.2 Wichtige Parameter

<!-- Source EN PDF p.10, block 18 -->

Die ISP21-Parameter befinden sich im Knoten wb_v21 der IQ-JSON-Datei.

<!-- Source EN PDF p.10, block 19 -->

#### 2.2.1 Weißabgleich aktivieren und Weißabgleichmodus auswählen

<!-- Source EN PDF p.10, block 20 -->

Im Knoten control:

<!-- Source EN PDF p.11, block 21 -->

| Name | Beschreibung |
|---|---|
| bypass | Wert 0 oder 1. 0 aktiviert die Weißabgleichkorrektur; der verwendete Weißabgleich-Gain wird durch mode bestimmt. 1 deaktiviert die Weißabgleichkorrektur. |
| mode | Wert CALIB_WB_MODE_AUTO oder CALIB_WB_MODE_MANUAL. CALIB_WB_MODE_MANUAL verwendet den manuellen Weißabgleich-Gain. CALIB_WB_MODE_AUTO berechnet den Weißabgleich-Gain mit dem automatischen Weißabgleichalgorithmus. |

<!-- Source EN PDF p.11, block 22 -->

#### 2.2.2 Parameter für manuellen Weißabgleich

<!-- Source EN PDF p.11, block 23 -->

Im Knoten manualPara:

<!-- Source EN PDF p.11, block 24 -->

| Name | Beschreibung |
|---|---|
| mode | Wert CALIB_MWB_MODE_CCT, CALIB_MWB_MODE_WBGAIN oder CALIB_MWB_MODE_SCENE |
| cfg.wbgain | Wertebereich [0.5-3.9]. Bei mode == CALIB_MWB_MODE_WBGAIN wird dieser Parameter für den manuellen Weißabgleich verwendet. |
| cfg.scene | Wert CALIB_WB_SCENE_INCANDESCENT (für Lichtquelle A), CALIB_WB_SCENE_FLUORESCENT (für CWF), CALIB_WB_SCENE_WARM_FLUORESCENT (für U30), CALIB_WB_SCENE_DAYLIGHT (für D65), CALIB_WB_SCENE_CLOUDY_DAYLIGHT (für D50), CALIB_WB_SCENE_TWILIGHT (für HZ) oder CALIB_WB_SCENE_SHADE (für D75). Bei mode == CALIB_MWB_MODE_SCENE wird dieser Parameter für den manuellen Weißabgleich verwendet. |
| cfg.cct | CCT-Wertebereich [0-10000]. CCRI-Wertebereich [-2,2]; CCRI = 0 entspricht näherungsweise einer Lichtquelle auf dem Planckschen Kurvenzug im Chromatizitätsdiagramm. Bei mode == CALIB_MWB_MODE_CCT wird dieser Parameter für den manuellen Weißabgleich verwendet. |

<!-- Source EN PDF p.11, block 25 -->

Einige Konfigurationsbeispiele:

<!-- Source EN PDF p.12, block 26 -->

```text
Auto White Balance + White Balance Correction Enabled (recommended)
control.bypass = 0;
control.mode = CALIB_WB_MODE_AUTO;
White balance correction is not enabled
control.wbBypass = 1;
Manual white balance + white balance correction enabled
control.wbBypass = 0;
control.mode = CALIB_WB_MODE_MANUAL;
manualPara.mode = CALIB_MWB_MODE_WBGAIN;
manualPara.cfg.wbgain = [1,1,1,1];
```

<!-- Source EN PDF p.12, block 27 -->

#### 2.2.3 Parameter für automatischen Weißabgleich

<!-- Source EN PDF p.12, block 28 -->

Die folgenden Parameter gelten für den automatischen Weißabgleich. Sie befinden sich in den Knoten autoPara (dessen Elemente sich zwischen ISP20 und ISP21 unterscheiden) und autoExtPara (dessen Elemente bei beiden identisch sind). Die nachfolgend beschriebenen Parameter sind Elemente dieser beiden Strukturen.

<!-- Source EN PDF p.12, block 29 -->

#### 2.2.4 hdrPara

<!-- Source EN PDF p.12, block 30 -->

Entspricht der Struktur autoPara.hdrPara. Bei HDR-Sensoren kann eines der langen, mittleren oder kurzen Frames für die Weißabgleichstatistik ausgewählt werden. Der automatische Modus wird empfohlen.

<!-- Source EN PDF p.12, block 31 -->

| Name | Beschreibung |
|---|---|
| frameChooseMode | Werte CALIB_AWB_INPUT_RAW_FIXED, CALIB_AWB_INPUT_RAW_AUTO, CALIB_AWB_INPUT_BAYERNR und CALIB_AWB_INPUT_DRC. CALIB_AWB_INPUT_RAW_FIXED wählt fest das lange oder kurze RAW-Frame gemäß frameChoose. CALIB_AWB_INPUT_RAW_AUTO wählt lange oder kurze RAW-Frames automatisch für die Weißabgleichstatistik. CALIB_AWB_INPUT_BAYERNR wählt die Ausgabe des Moduls bayer2dnr. CALIB_AWB_INPUT_DRC wählt die Ausgabe des DRC-Moduls. |
| frameChoose | Gültig im HDR-Modus bei frameChooseMode = CALIB_AWB_INPUT_RAW_FIXED. Bei Zwei-Frame-HDR ist der Wert 0 oder 1: 0 wählt kurze Frames (raw_in_short), 1 lange Frames (raw_in_long-) für die Weißabgleichstatistik. |

<!-- Source EN PDF p.12, block 32 -->

#### 2.2.5 limitRange

<!-- Source EN PDF p.12, block 33 -->

(1) Entspricht der JSON-Struktur autoPara.limitRange und legt den Pixelwertebereich für die Weißpunktstatistik fest. Punkte außerhalb dieses Bereichs werden nicht gezählt. Um mehr Weißpunkte zu erfassen, erweitern Sie den Wertebereich. Für höhere Genauigkeit begrenzen Sie ihn so, dass die gezählten Punkte weder zu dunkel noch zu hell sind. Unterschiedliche Bereiche für unterschiedliche Umgebungshelligkeiten werden unterstützt; der tatsächlich verwendete Bereich entsteht durch lineare Interpolation dieser Konfigurationen.

<!-- Source EN PDF p.13, block 34 -->

| Name | Beschreibung |
|---|---|
| lumaValue | Wertebereich der Umgebungshelligkeit: 0-255000 |
| maxR | Rechte Grenze des R-Kanal-Wertebereichs; empfohlen: 255 - Schwarzpegel - 3; Maximum: 255 |
| minR | Linke Grenze des R-Kanal-Wertebereichs; empfohlen: 3; Minimum: 0 |
| maxG | Rechte Grenze des G-Kanal-Wertebereichs; empfohlen: 255 - Schwarzpegel - 3; Maximum: 255 |
| minG | Linke Grenze des G-Kanal-Wertebereichs; empfohlen: 3; Minimum: 0 |
| maxB | Rechte Grenze des B-Kanal-Wertebereichs; empfohlen: 255 - Schwarzpegel - 3; Maximum: 255 |
| minB | Linke Grenze des B-Kanal-Wertebereichs; empfohlen: 3; Minimum: 0 |
| maxY | Rechte Grenze des Y-Kanal-Wertebereichs; empfohlen: 255 - Schwarzpegel - 3; Maximum: 255 |
| minY | Linke Grenze des Y-Kanal-Wertebereichs; empfohlen: 3; Minimum: 0 |

<!-- Source EN PDF p.13, block 35 -->

#### 2.2.6 mainWindow

<!-- Source EN PDF p.13, block 36 -->

Die Konfiguration des AWB-Statistik-Hauptfensters entspricht der JSON-Struktur autoPara.mainWindow. Empfohlen wird die automatische Konfiguration. Für besondere Anwendungen, beispielsweise starke Farbabschattung am Rand eines Weitwinkelobjektivs, kann die Hauptfenstergröße angepasst werden, um den Einfluss auf die AWB-Statistik zu reduzieren.

<!-- Source EN PDF p.13, block 37 -->

| Name | Beschreibung |
|---|---|
| mode | Wert CALIB_AWB_WINDOW_CFG_FIXED oder CALIB_AWB_WINDOW_CFG_AUTO. CALIB_AWB_WINDOW_CFG_AUTO konfiguriert das Hauptstatistikfenster automatisch auf die RAW-Größe und ist die empfohlene Einstellung. CALIB_AWB_WINDOW_CFG_FIXED erlaubt eine benutzerdefinierte Statistikfenstergröße. |
| window | Bei mode = 1 wird window=[h_offset,v_offset,h_size,v_size] aktiviert. h bezeichnet die horizontale, v die vertikale Richtung. h_offset, v_offset, h_size und v_size liegen im Bereich 0-1. [0, 0, 1, 1] verwendet das gesamte Fenster, also die RAW-Größe. |

<!-- Source EN PDF p.14, block 38 -->

#### 2.2.7 downScaleMode

<!-- Source EN PDF p.14, block 39 -->

Entspricht dem JSON-Element autoPara.downScaleMode.

<!-- Source EN PDF p.14, block 40 -->

| Name | Beschreibung |
|---|---|
| downScaleMode | Wert CALIB_AWB_DS_4X4 oder CALIB_AWB_DS_8X8. CALIB_AWB_DS_4X4 verwendet 4x4-Unterabtastung der RAW-Daten als Eingang des AWB-Statistikmoduls; die horizontalen und vertikalen Faktoren ds_w und ds_h sind jeweils 4. CALIB_AWB_DS_8X8 verwendet 8x8-Unterabtastung; ds_w und ds_h sind jeweils 8. Dies ist die Standardeinstellung. |

<!-- Source EN PDF p.14, block 41 -->

#### 2.2.8 lscBypassEnable

<!-- Source EN PDF p.14, block 42 -->

Entspricht dem JSON-Element autoPara.lscBypassEnable.

<!-- Source EN PDF p.14, block 43 -->

| Name | Beschreibung |
|---|---|
| lscBypassEnable | Wert 0 oder 1. 0 deaktiviert die Objektivabschattungskorrektur (LSC) im Weißabgleich-Statistikpfad, 1 aktiviert sie. Das LSC-Modul im ISP-Hauptpfad bleibt unbeeinflusst. |

<!-- Source EN PDF p.14, block 44 -->

#### 2.2.9 blkStatisticsEnable

<!-- Source EN PDF p.14, block 45 -->

Entspricht dem JSON-Element autoPara.blkStatisticsEnable.

<!-- Source EN PDF p.14, block 46 -->

| Name | Beschreibung |
|---|---|
| blkStatisticsEnable | Wert 0 oder 1. 0 deaktiviert die 15x15-Blockstatistik des Weißabgleichs; 1 aktiviert sie. |

<!-- Source EN PDF p.14, block 47 -->

#### 2.2.10 blkMeasureMode

<!-- Source EN PDF p.14, block 48 -->

Entspricht dem JSON-Element autoPara.blkMeasureMode.

<!-- Source EN PDF p.15, block 49 -->

| Name | Beschreibung |
|---|---|
| blkMeasureMode | Wert CALIB_AWB_BLK_STAT_MODE_ALL_V201 oder CALIB_AWB_BLK_STAT_MODE_REALWP_V201. CALIB_AWB_BLK_STAT_MODE_ALL_V201 summiert alle Punkte innerhalb der 15x15-Statistikblöcke und ist der Standardwert. CALIB_AWB_BLK_STAT_MODE_REALWP_V201 summiert nur die Weißpunkte innerhalb dieser Blöcke. |

<!-- Source EN PDF p.15, block 50 -->

#### 2.2.11 Hardwareablauf der Weißpunkterkennung

<!-- Source EN PDF p.15, block 51 -->

![Abbildung aus der englischen Quelle, PDF S. 15, Nr. 51](/docs/rockchip-isp30-color-optimization/assets/en-p15-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 15, Nr. 51.*

<!-- Source EN PDF p.15, block 52 -->

Abbildung: AWB-Weißpunkterkennung

<!-- Source EN PDF p.15, block 53 -->

Wie im Ablaufdiagramm dargestellt, wird anhand von drei Farbräumen bestimmt, ob ein Punkt ein Weißpunkt ist.

<!-- Source EN PDF p.16, block 54 -->

| Name | Beschreibung |
|---|---|
| uvDetectionEnable | Wert 0 oder 1. 0 deaktiviert das Herausfiltern von Nicht-Weißpunkten im UV-Bereich. 1 aktiviert diese Filterung und wählt Weißpunkte anhand der Weißpunktbedingungen im UV-Bereich aus. |
| xyDetectionEnable | Wert 0 oder 1. 0 deaktiviert das Herausfiltern von Nicht-Weißpunkten im XY-Bereich. 1 aktiviert diese Filterung und wählt Weißpunkte anhand der Weißpunktbedingungen im XY-Bereich aus. |
| yuvDetectionEnable | Wert 0 oder 1. 0 deaktiviert das Herausfiltern von Nicht-Weißpunkten im YUV-Bereich. 1 aktiviert diese Filterung und wählt Weißpunkte anhand der Weißpunktbedingungen im YUV-Bereich aus. |

<!-- Source EN PDF p.16, block 55 -->

Die drei Parameter gehören zum Knoten autoPara. Sind alle auf 0 gesetzt, gelten sämtliche Punkte innerhalb des Statistikfensters mit passender Helligkeit als Weißpunkte. Dies kann verwendet werden, wenn keine Zeit für eine Kalibrierung bleibt und zunächst nur ein grober Eindruck des automatischen Weißabgleichs gewünscht ist.

<!-- Source EN PDF p.16, block 56 -->

##### 2.2.11.1 RGB2XY

<!-- Source EN PDF p.16, block 57 -->

Die Transformationsparameter vom RGB- in den XY-Bereich werden vom Kalibrierwerkzeug automatisch erzeugt und entsprechen der JSON-Struktur autoPara.rgb2TcsPara.

<!-- Source EN PDF p.16, block 58 -->

| Name | Beschreibung |
|---|---|
| pseudoLumWeight | Richtet die Weißpunkte unterschiedlicher Lichtquellen möglichst auf einer Geraden aus. Vom Kalibrierwerkzeug erzeugt; Wertebereich 0~1. Eine manuelle Änderung wird nicht empfohlen. |
| rotationMat | Rotationsmatrix, sodass die x-Achse die Änderung der Schwarzkörper-Farbtemperatur und die y-Achse die Farbabweichung von Lichtquellen bei gleicher Farbtemperatur beschreibt. Vom Kalibrierwerkzeug erzeugt; Wertebereich [-3.99, 3.99]. Eine manuelle Änderung wird nicht empfohlen. |

<!-- Source EN PDF p.16, block 59 -->

##### 2.2.11.2 Weißpunkterkennung im XY-Bereich

<!-- Source EN PDF p.16, block 60 -->

![Abbildung aus der englischen Quelle, PDF S. 16, Nr. 60](/docs/rockchip-isp30-color-optimization/assets/en-p16-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 16, Nr. 60.*

<!-- Source EN PDF p.16, block 61 -->

Abbildung: Weißpunktbereich im XY-Farbraum

<!-- Source EN PDF p.17, block 62 -->

Der Weißpunktbereich im XY-Farbraum ist oben dargestellt. Punkte innerhalb des Rechtecks gelten als Weißpunkte. Es gibt zwei Größen von Weißpunktbereichen, in der Abbildung durch [x0,x1,y0,y1] beschrieben. Die Bereiche werden im Kalibrierwerkzeug manuell angepasst und entsprechen der Struktur autoPara.lightSources.xyRegion in JSON.

<!-- Source EN PDF p.17, block 64 -->

| Name | Beschreibung |
|---|---|
| normal | Weißpunktbereich des mittleren Fensters; Wertebereich [-8,7.99] |
| big | Weißpunktbereich des großen Fensters; Wertebereich [-8,7.99] |

<!-- Source EN PDF p.17, block 65 -->

##### 2.2.11.3 Weißpunkterkennung im UV-Bereich

<!-- Source EN PDF p.17, block 66 -->

![Abbildung aus der englischen Quelle, PDF S. 17, Nr. 66](/docs/rockchip-isp30-color-optimization/assets/en-p17-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 17, Nr. 66.*

<!-- Source EN PDF p.17, block 67 -->

Abbildung: Weißpunktbereich im UV-Farbraum

<!-- Source EN PDF p.17, block 68 -->

Der Weißpunktbereich im UV-Farbraum ist oben dargestellt. Die Weißpunkte innerhalb des Vierecks entsprechen der JSON-Struktur autoPara.lightSources.uvRegion.

<!-- Source EN PDF p.17, block 69 -->

| Name | Beschreibung |
|---|---|
| u | Die U-Koordinaten der Weißpunktbedingung im UV-Bereich bilden einen geschlossenen Polygonzug, beispielsweise [u0,u1 u2,u3,u0]. Wertebereich [0,255]; der Nachkommaanteil darf nur 0 oder 0.5 sein. Der Weißpunktbereich wird manuell angepasst und erzeugt. |
| v | Die V-Koordinaten der Weißpunktbedingung im UV-Bereich bilden einen geschlossenen Polygonzug, beispielsweise [v0, v1 v2, v3, v0]. Wertebereich [0,255]; der Nachkommaanteil darf nur 0 oder 0.5 sein. Wird im Kalibrierwerkzeug manuell angepasst und erzeugt. |

<!-- Source EN PDF p.17, block 70 -->

##### 2.2.11.4 RGB2RYUV

<!-- Source EN PDF p.17, block 71 -->

Die Transformationsparameter von RGB in den gedrehten YUV-Farbraum entsprechen der JSON-Matrix autoPara.rgb2RotationYuvMat.

<!-- Source EN PDF p.17, block 72 -->

```text
rgb2RotationYuvMat=[u0,u1,u2,uoffset
v0,v1,v2,voffset
y0,y1,y2,yoffset]
```

<!-- Source EN PDF p.18, block 75 -->

| Name | Beschreibung |
|---|---|
| u0,u1,u2,v0,v1,v2,y0,y1,y2 | Wertebereich [-1,1); automatisch vom Kalibrierwerkzeug erzeugt; Genauigkeit 1/2^9 |
| uoffset,voffset,yoffset | Wertebereich [-255,254]; automatisch vom Kalibrierwerkzeug erzeugt; Genauigkeit 1/2^4 |

<!-- Source EN PDF p.18, block 76 -->

##### 2.2.11.5 Weißpunkterkennung im RYUV-Bereich

<!-- Source EN PDF p.18, block 77 -->

Zur Weißpunkterkennung wird die Helligkeitsdifferenz zwischen dem Szenenpunkt (y0,u0,v0) und dem theoretischen Weißpunkt (y',u0,v0) berechnet: diff = \|y0-y'\|. Wenn diff <th ist, gilt der Punkt als Weißpunkt, andernfalls nicht. Für verschiedene Positionen, unterschieden anhand der u-Komponente, können unterschiedliche Schwellenwerte th festgelegt werden, wie durch die stückweise lineare Kurve dis-th dargestellt.

<!-- Source EN PDF p.18, block 78 -->

![Abbildung aus der englischen Quelle, PDF S. 18, Nr. 78](/docs/rockchip-isp30-color-optimization/assets/en-p18-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 18, Nr. 78.*

<!-- Source EN PDF p.18, block 79 -->

Im Kalibrierwerkzeug werden diff und u der Szenenpunkte (y0,u0,v0) als Referenz verwendet, um die stückweise lineare u-th-Kurve der jeweiligen Lichtquelle anzupassen. Dadurch sollen Weißpunkte korrekt geschätzt und Nicht-Weißpunkte ausgeschlossen werden; diese Funktion ist derzeit noch nicht realisiert. Die Lichtquelle wird zuvor durch die XY- und UV-Verfahren bestimmt. Daher lässt sich das YUV-Verfahren nicht allein aktivieren, sondern muss gemeinsam mit der Weißpunkterkennung im XY- oder UV-Bereich verwendet werden.

<!-- Source EN PDF p.18, block 81 -->

Entspricht der JSON-Struktur autoPara.lightSources.rtYuvRegion.

<!-- Source EN PDF p.19, block 82 -->

| Name | Beschreibung |
|---|---|
| lineVector | Parameter zur Ermittlung des theoretischen Weißpunkts (y',u0,v0) aus (y0,u0,v0). Wertebereich jeder Komponente [0,255], Genauigkeit 1/(2^4). Vom Kalibrierwerkzeug erzeugt; eine manuelle Anpassung wird nicht empfohlen. |
| disP1P2 | Parameter zur Ermittlung des theoretischen Weißpunkts (y',u0,v0) aus (y0,u0,v0). Wertebereich jeder Komponente [0,5]. Vom Kalibrierwerkzeug erzeugt; eine manuelle Anpassung wird nicht empfohlen. |
| thcurve_u | Wertebereich jeder u-Komponente der stückweise linearen u-th-Kurve [0,255], ganzzahlig. Hinweis: Die Differenz zwischen benachbarten u-Komponenten muss eine Zweierpotenz sein. |
| thcure_th | Wertebereich jeder th-Komponente der stückweise linearen u-th-Kurve [0,255], Genauigkeit 1/(2^4). Hinweis: Die u-th-Kurve muss monoton steigen. |

<!-- Source EN PDF p.19, block 83 -->

##### 2.2.11.6 Zusätzliche Nicht-Weißpunktbereiche

<!-- Source EN PDF p.19, block 84 -->

Üblicherweise gilt ein Punkt als Weißpunkt, wenn er gleichzeitig innerhalb der Weißpunktbereiche von XY, UV und YUV liegt. Einige Nicht-Weißpunkte können diese Bedingung ebenfalls erfüllen und sich sogar im Zentrum des Bereichs befinden, sodass sie schwer auszuschließen sind. In diesem Fall kann im UV- oder XY-Farbraum ein Nicht-Weißpunktbereich ergänzt werden; jeder darin liegende Punkt wird als Nicht-Weißpunkt behandelt.

<!-- Source EN PDF p.19, block 85 -->

Die maximale Anzahl der Nicht-Weißpunktbereiche beträgt 7.

<!-- Source EN PDF p.19, block 86 -->

Entspricht dem JSON-Parameter autoPara.extraWpRange.

<!-- Source EN PDF p.19, block 87 -->

![Abbildung aus der englischen Quelle, PDF S. 19, Nr. 87](/docs/rockchip-isp30-color-optimization/assets/en-p19-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 19, Nr. 87.*

<!-- Source EN PDF p.20, block 88 -->

| Name | Beschreibung |
|---|---|
| domain | Wert CALIB_AWB_EXTRA_RANGE_DOMAIN_UV oder CALIB_AWB_EXTRA_RANGE_DOMAIN_XY. CALIB_AWB_EXTRA_RANGE_DOMAIN_UV bezeichnet einen Weißpunktbereich im UV-Farbraum, CALIB_AWB_EXTRA_RANGE_DOMAIN_XY einen im XY-Farbraum. |
| mode | Wert CALIB_AWB_EXCLUDE_WP_MODE oder CALIB_AWB_EXTTRA_LIGHT_SOURCES_MODE. CALIB_AWB_EXCLUDE_WP_MODE kennzeichnet einen Nicht-Weißpunktbereich. CALIB_AWB_EXTTRA_LIGHT_SOURCES_MODE kennzeichnet den Weißpunktbereich einer zusätzlichen Lichtquelle; dieser Modus wird auf ISP21 nicht unterstützt. |
| window | Konfigurationsbereich wie oben dargestellt: [x0,x1,y0,y1]. Bei domain=0 gilt [0,511] mit 1 Nachkommabit. Bei domain=1 gilt [-8192,8191] mit 10 Nachkommabits. |

<!-- Source EN PDF p.20, block 89 -->

##### 2.2.11.7 Helligkeitsabhängige Gewichtung der Weißpunkte

<!-- Source EN PDF p.20, block 90 -->

Beim Modul lumalimit wurde beschrieben, dass der Wertebereich für eine genauere Weißpunkterkennung so angepasst werden sollte, dass die statistisch erfassten Punkte weder zu dunkel noch zu hell sind. Dieses Modul kann als Weiterentwicklung von lumalimit verstanden werden: Zu helle oder zu dunkle Weißpunkte erhalten ein geringeres Gewicht, solche im geeigneten Helligkeitsbereich ein höheres. Die Gewichte lassen sich abhängig von der Anzahl geeigneter Weißpunkte und der Umgebungshelligkeit dynamisch einstellen, wie folgt:

<!-- Source EN PDF p.20, block 91 -->

![Abbildung aus der englischen Quelle, PDF S. 20, Nr. 91](/docs/rockchip-isp30-color-optimization/assets/en-p20-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 20, Nr. 91.*

<!-- Source EN PDF p.20, block 92 -->

Die Abbildung zeigt: Bei einem großen Anteil von Weißpunkten mit geeigneter Helligkeit wird der passende Helligkeitsbereich, beispielsweise y = 80-224, stärker gewichtet. Andere dunkle oder helle Bereiche erhalten geringere Gewichte.

<!-- Source EN PDF p.20, block 93 -->

Entspricht dem JSON-Parameter autoPara.wpDiffLumaWeight.

<!-- Source EN PDF p.21, block 94 -->

| Name | Beschreibung |
|---|---|
| enable | Funktionsschalter: 0 deaktiviert, 1 aktiviert |
| wpDiffWeiEnableTh | Zur Aktivierung müssen zusätzlich die Schwellenbedingungen erfüllt sein. |
| wpDiffWeiEnableTh.wpDiffWeiNoTh | Die Weißpunktanzahl muss diese Schwelle überschreiten, bevor die Funktion aktiviert wird. Wertebereich [0,1]. |
| wpDiffWeiEnableTh.wpDiffWeiLvValueTh | Die Umgebungshelligkeit muss diese Schwelle zur Aktivierung überschreiten. Wertebereich [0-2555000]. |
| wpDiffwei_y | Helligkeitsunterteilung des Weißpunkt-Helligkeitshistogramms: neun Punkte bilden 8 Klassen. Wertebereich [0,255]. Hinweis: Eine Änderung wird nicht empfohlen; die Differenz benachbarter Komponenten muss eine Zweierpotenz sein. |
| perfectBinConf | Legt fest, welche Histogrammklassen Weißpunkte mit hoher Zuverlässigkeit enthalten, also welche Helligkeit geeignet ist. Jede Komponente entspricht einer Klasse und hat den Wert 0 oder 1: 0 geringe, 1 hohe Zuverlässigkeit. |
| wpDiffWeiLvTh | Die beiden Komponenten entsprechen den Umgebungshelligkeiten wpDiffWeiLvTh0 und wpDiffWeiLvTh1. Wertebereich [0-2555000]. |
| wpDiffWeightLvSet | Für unterschiedliche Anteile zuverlässiger Weißpunkte bei unterschiedlicher Umgebungshelligkeit können verschiedene Kurven konfiguriert werden. Die tatsächlichen Werte werden daraus linear interpoliert. |
| wpDiffWeightLvSet_len | Anzahl der Umgebungshelligkeitswerte |
| wpDiffWeightLvSet.LvValue | Umgebungshelligkeitswert |
| wpDiffWeightLvSet.ratioSet | Bei der Umgebungshelligkeit wpDiffWeightLvSet.LvValue lassen sich für unterschiedliche Anteile zuverlässiger Weißpunkte verschiedene Kurven konfigurieren. |
| wpDiffWeightLvSet.ratioSet_len | Anzahl der Einträge für zuverlässige Weißpunkte |
| wpDiffWeightLvSet.ratioSet.ratioValue | Anteil der Weißpunkte mit hoher Zuverlässigkeit |
| wpDiffWeightLvSet.ratioSet.weight | Helligkeitsgewicht bei Umgebungshelligkeit wpDiffWeightLvSet.LvValue und Anteil zuverlässiger Weißpunkte wpDiffWeightLvSet.ratioSet.ratioValue. Jede Komponente entspricht einer Klasse; Wertebereich [0,1]. |

<!-- Source EN PDF p.22, block 96 -->

##### 2.2.11.8 Blockgewichtung

<!-- Source EN PDF p.22, block 97 -->

Weißpunkte unterschiedlicher Blöcke können unterschiedliche Gewichte erhalten. Die Konfiguration richtet sich nach der konkreten Anwendung; ohne besondere Anforderungen wird die Verwendung nicht empfohlen.

<!-- Source EN PDF p.22, block 98 -->

| Name | Beschreibung |
|---|---|
| wpDiffBlkWeiEnable | Funktionsschalter: 0 deaktiviert, 1 aktiviert |
| wpDiffBlkWeight | 15*15 Blöcke; Gewicht jedes Blocks ganzzahlig im Bereich [0-63] |

<!-- Source EN PDF p.22, block 99 -->

#### 2.2.12 AWB-Strategie

<!-- Source EN PDF p.22, block 100 -->

##### 2.2.12.1 Bereichsstrategie zur Berechnung von WBGain

<!-- Source EN PDF p.22, block 101 -->

![Abbildung aus der englischen Quelle, PDF S. 22, Nr. 101](/docs/rockchip-isp30-color-optimization/assets/en-p22-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 22, Nr. 101.*

<!-- Source EN PDF p.22, block 102 -->

Abbildung: WBGain-Berechnung mit der AWB-Bereichsstrategie

<!-- Source EN PDF p.23, block 103 -->

Der Raum aus Umgebungshelligkeit und Weißpunktanzahl wird unterteilt, damit in verschiedenen Bereichen unterschiedliche Methoden zur Berechnung des Weißabgleich-Gains verwendet werden. Zur Bedeutung der Umgebungshelligkeit: Beträgt die mittlere Szenenhelligkeit bei 1x Belichtungsverstärkung und 1ms Belichtungsintegrationszeit 255 (Maximum), ist die Umgebungshelligkeit 255000. Ein höherer Wert steht für eine hellere Umgebung.

<!-- Source EN PDF p.23, block 104 -->

###### 2.2.12.1.1 (1) Parameter der Bereichsgrenzen

<!-- Source EN PDF p.23, block 105 -->

Die Parameter der Bereichsgrenzen entsprechen der JSON-Struktur autoExtPara.division.

<!-- Source EN PDF p.23, block 106 -->

| Name | Beschreibung |
|---|---|
| lumaValThLow | Umgebungshelligkeitsschwelle LV_THL1 in der Abbildung; Bereich 0-255000 |
| lumaValThLow2 | Umgebungshelligkeitsschwelle LV_THL2 in der Abbildung; Bereich 0-255000 |
| lumaValThHigh | Umgebungshelligkeitsschwelle LV_THH1 in der Abbildung; Bereich 0-255000 |
| lumaValThHigh2 | Umgebungshelligkeitsschwelle LV_THH2 in der Abbildung; Bereich 0-255000 |
| wpNumTh | Für unterschiedliche Umgebungshelligkeiten können unterschiedliche Schwellen WP_THL und WP_THH konfiguriert werden. Die tatsächliche Schwelle wird daraus linear interpoliert. |
| wpNumTh.lumaValue | Wertebereich der Umgebungshelligkeit: 0-255000 |
| wpNumTh.low | Weißpunktanzahlschwelle WP_THL in der Abbildung; Wertebereich 0-100000. Die tatsächliche Weißpunktanzahl wird mit WP_THL/100000 *totalPixe verglichen. Dabei gilt totalPixel = wight * height /ds_w/ds_h; wight und height sind Bildbreite und -höhe, ds_w und ds_h die horizontalen und vertikalen Unterabtastungsfaktoren. |
| wpNumTh.high | Weißpunktanzahlschwelle WP_THH in der Abbildung; Wertebereich 0-100000. Die tatsächliche Weißpunktanzahl wird mit WP_THH /100000 *totalPixel verglichen. |

<!-- Source EN PDF p.23, block 107 -->

###### 2.2.12.1.2 (2) WBGain-Parameter der Strategie

<!-- Source EN PDF p.23, block 108 -->

Die genannten Schwellen unterteilen den Raum aus Umgebungshelligkeit und Weißpunktanzahl. In den einzelnen Bereichen wird der Weißabgleich-Gain wie folgt berechnet:

<!-- Source EN PDF p.23, block 109 -->

① WBGain in WPType3 hängt vom statistischen Weißpunkt-Gain der jeweiligen Lichtquelle (StaGain_i), ihrem WBGain bei heller Umgebung (DayGain_i) und dem WBGain bei dunkler Umgebung (NightGain) ab. Das Gewicht von StaGain_i ist staWeigthSet, das von DayGain_i ist 100-staWeigthSet. NightGain wird mit tempWeigth gewichtet; dies wird später näher erläutert.

<!-- Source EN PDF p.23, block 110 -->

② WPType2 ist der Übergangsbereich und entsteht durch Mischung der WBGains von WPType3 und WPType1.

<!-- Source EN PDF p.24, block 111 -->

③ WBGain in WPType1:

<!-- Source EN PDF p.24, block 112 -->

Beim ersten Frame kann dies ein fester NightGain oder DayGain oder ein durch einen Einzelfarbalgorithmus berechneter WBGain sein; die Wahl hängt vom Umgebungshelligkeitsbereich ab. Andernfalls wird der gewichtete WBGain vorheriger Frames verwendet.

<!-- Source EN PDF p.24, block 113 -->

Die entsprechenden JSON-Parameter:

<!-- Source EN PDF p.24, block 114 -->

① DayGain

<!-- Source EN PDF p.24, block 115 -->

| Name | Beschreibung |
|---|---|
| defaultDayGainLow | Empfohlener WBGAIN bei besonders hellem Sonnenlicht; Wertebereich [0.5-7.9] |
| defaultDayGainHigh | Empfohlener WBGAIN bei gewöhnlichem Sonnenlicht; Wertebereich [0.5-7.9] |
| dayGainLvThSet | Bezeichnet dayGainLvThSet_THL und dayGainLvThSet_THH, die jeweils defaultDayGainLow und defaultDayGainHigh entsprechen. Für verschiedene Lichtquellen können unterschiedliche Werte im Bereich [0-255000] konfiguriert werden. |
| staWeight | Gewicht von StaGain_i bei der WBGain-Berechnung in WPType3. Für unterschiedliche Helligkeiten können unterschiedliche Gewichte festgelegt werden; dies entspricht LvMatrix in JSON. Das Gewicht von DayGain_i beträgt 100-staWeigthSet. Lichtquellen können unterschiedlich konfiguriert werden. Im Allgemeinen ist ein StaGain-Gewicht von 100 am besten. Bei rötlichem Himmel in Außenaufnahmen kann defaultDayGainLow auf den Standard-WBGain von d65 und defaultDayGainHigh auf den von d50 gesetzt werden. Eine Verringerung bzw. Anpassung von staWeigth bei der betreffenden Szenenhelligkeit kann die Darstellung verbessern. Wertebereich [0-100]. |

<!-- Source EN PDF p.24, block 116 -->

Aus Umgebungshelligkeit, dayGainLvThSet, defaultDayGainLow und defaultDayGainHigh wird DayGain_i für die verschiedenen Lichtquellen linear interpoliert. Mit den später beschriebenen Lichtquellengewichten ergibt sich daraus DayGain im Bereich WPType1.

<!-- Source EN PDF p.24, block 117 -->

② NightGain

<!-- Source EN PDF p.24, block 118 -->

| Name | Beschreibung |
|---|---|
| defaultNightGain | Der oben beschriebene NightGain: empfohlener WBGain bei geringer Umgebungshelligkeit; Wertebereich [0.5-7.9] |
| defaultNightGainWeight | Gewicht von NightGain bei der WBGain-Berechnung in WPType3. Verschiedene Helligkeiten können unterschiedliche Gewichte erhalten; dies entspricht lumaValueMatrix in JSON. Wertebereich 0-100. |

<!-- Source EN PDF p.24, block 119 -->

③ SingleColorGain (singleColorProcess)

<!-- Source EN PDF p.25, block 120 -->

Die Weißabgleichfunktion für großflächige Einzelfarben wählt anhand der Szeneninformationen Farben und WBGain aus konfigurierten Farb- und Lichtquellensammlungen aus. Mit den Standardkalibrierparametern werden derzeit Rot, Grün, Blau, Gelb und Violett erkannt. Je nach Anwendung können Farben in colorBlock ergänzt oder entfernt sowie die Lichtquellenauswahl lsUsedForEstimation angepasst werden. Das Werkzeug unterstützt diese Funktion nicht. In JSON entspricht sie autoExtPara.singleColorGain.

<!-- Source EN PDF p.25, block 121 -->

| Name | Beschreibung |
|---|---|
| enable | Funktionsschalter: 0 deaktiviert, 1 aktiviert |
| colorBlock | Vom Werkzeug erzeugte Sammlung auswählbarer Farben |
| colorBlock_len | Gesamtzahl der Farben in colorBlock |
| colorBlock.index | Farbindex zur Kennzeichnung des bei der Kalibrierung verwendeten Farbfelds. Eine Änderung beeinflusst das Bildergebnis nicht. Wertebereich 1-24. Das Kalibrierwerkzeug wählt 13, 14, 15, 16, 5 und 10. |
| colorBlock.meanC | Mittlerer Chroma-Wert der Farbe im LCH-Farbraum |
| colorBlock.meanH | Mittlerer Farbtonwert der Farbe im LCH-Farbraum |
| lsUsedForEstimation | Vom Werkzeug erzeugte Sammlung auswählbarer Lichtquellen |
| lsUsedForEstimation_len | Gesamtzahl der Lichtquellen in lsUsedForEstimation |
| lsUsedForEstimation.name | Name der Lichtquelle |
| lsUsedForEstimation.RGain | Weißabgleich-Gain des Rotkanals dieser Lichtquelle; Dezimalwert größer als 0 |
| lsUsedForEstimation.BGain | Weißabgleich-Gain des Blaukanals dieser Lichtquelle; Dezimalwert größer als 0 |
| alpha | Gewicht der H-Komponente im LCH-Farbraum. Der Standardwert kann unverändert verwendet werden; eine Anpassung ist nicht erforderlich. Wertebereich [0.0-1.0]. |

<!-- Source EN PDF p.25, block 122 -->

④ Wenn vorherige Frames bereits einen Weißabgleich-Gain besitzen, wird deren gewichteter WBGain als Weißabgleich-Gain von WpType3 verwendet.

<!-- Source EN PDF p.26, block 123 -->

| Name | Beschreibung |
|---|---|
| weightForNightGainCalc_len | Legt die Anzahl der vorherigen Frames fest, die gewichtet werden; beliebiger ganzzahliger Wert |
| weightForNightGainCalc | Gewichte für die vorherigen Frames. Position 0 entspricht dem zeitlich entferntesten Frame, die letzte Position dem neuesten. Wertebereich [0-100]. |

<!-- Source EN PDF p.26, block 124 -->

###### 2.2.12.1.3 (3) Parameter zur Berechnung der Lichtquellengewichte

<!-- Source EN PDF p.26, block 125 -->

Parameter zur Wahrscheinlichkeitsberechnung für unterschiedliche Lichtquellen in WpType3:

<!-- Source EN PDF p.26, block 126 -->

![Abbildung aus der englischen Quelle, PDF S. 26, Nr. 126](/docs/rockchip-isp30-color-optimization/assets/en-p26-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 26, Nr. 126.*

```text
Prob_i = probLV_i * probDis_i * probWP_i
```

<!-- Source EN PDF p.26, block 127 -->

![Abbildung aus der englischen Quelle, PDF S. 26, Nr. 127](/docs/rockchip-isp30-color-optimization/assets/en-p26-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 26, Nr. 127.*

```text
probDis_i
```

<!-- Source EN PDF p.26, block 128 -->

① Parameter der Abstandswahrscheinlichkeit

<!-- Source EN PDF p.26, block 129 -->

Aus dem euklidischen Abstand gain_dis zwischen dem WBGain des vorherigen Frames und dem Standard-WBGain jeder Lichtquelle wird anhand der folgenden stückweise linearen Kurve die Wahrscheinlichkeit berechnet.

<!-- Source EN PDF p.26, block 130 -->

![Abbildung aus der englischen Quelle, PDF S. 26, Nr. 130](/docs/rockchip-isp30-color-optimization/assets/en-p26-figure3.png)

*Abbildung aus der englischen Quelle, PDF S. 26, Nr. 130.*

<!-- Source EN PDF p.26, block 131 -->

Entspricht der JSON-Struktur autoExtPara.probCalcDis.

<!-- Source EN PDF p.26, block 132 -->

| Name | Beschreibung |
|---|---|
| proDis_THL | Abstandsschwelle disTHL in der Abbildung; Wertebereich [0-4] |
| proDis_THH | Abstandsschwelle disTHH in der Abbildung; Wertebereich [0-4] |

<!-- Source EN PDF p.26, block 133 -->

![Abbildung aus der englischen Quelle, PDF S. 26, Nr. 133](/docs/rockchip-isp30-color-optimization/assets/en-p26-figure4.png)

*Abbildung aus der englischen Quelle, PDF S. 26, Nr. 133.*

```text
probLV_i
```

<!-- Source EN PDF p.26, block 134 -->

② Wahrscheinlichkeitsparameter der Szenenhelligkeit

<!-- Source EN PDF p.26, block 135 -->

Die Wahrscheinlichkeit für eine Außenlichtquelle ist pout und wird anhand der Helligkeits-pout-Kurve in Abbildung 4-14 berechnet.

<!-- Source EN PDF p.26, block 136 -->

Die Wahrscheinlichkeit für eine Innenlichtquelle ist pin = 1-pout.

<!-- Source EN PDF p.26, block 137 -->

Für nicht eindeutig zuzuordnende Lichtquellen gilt beispielsweise PD50 = max(pout, pin).

<!-- Source EN PDF p.27, block 138 -->

![Abbildung aus der englischen Quelle, PDF S. 27, Nr. 138](/docs/rockchip-isp30-color-optimization/assets/en-p27-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 27, Nr. 138.*

<!-- Source EN PDF p.27, block 139 -->

Die zugehörigen JSON-Parameter lauten:

<!-- Source EN PDF p.27, block 140 -->

| Name | Beschreibung |
|---|---|
| autoExtPara.probCalcLv.outdoorLumaValThLow | Umgebungshelligkeitsschwelle outdoorTHL in der Abbildung; Wertebereich 0-255000 |
| autoExtPara.probCalcLv.outdoorLumaValThHigh | Umgebungshelligkeitsschwelle outdoorTHH in der Abbildung; Wertebereich 0-255000 |
| autoPara.lightSources.doorType | Zuordnung der Lichtquelle zu Innen- oder Außenbereich; für jede Lichtquelle separat konfigurierbar. 1: innen; 2: zwischen innen und außen; 3: außen. |

<!-- Source EN PDF p.27, block 141 -->

![Abbildung aus der englischen Quelle, PDF S. 27, Nr. 141](/docs/rockchip-isp30-color-optimization/assets/en-p27-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 27, Nr. 141.*

```text
probWP_i
```

<!-- Source EN PDF p.27, block 142 -->

③ Wahrscheinlichkeitsparameter der Weißpunktanzahl in der Szene

<!-- Source EN PDF p.27, block 143 -->

Entspricht der JSON-Struktur autoExtPara.probCalcWp.

<!-- Source EN PDF p.27, block 144 -->

| Name | Beschreibung |
|---|---|
| wpNumPercTh | Wenn die Weißpunktanzahl einer Lichtquelle kleiner als wpNumPercThtotalPixel ist und ihr Anteil an den Weißpunkten aller Lichtquellen unter wpNumPercTh2 liegt, wird ihre Weißpunktanzahl-Wahrscheinlichkeit auf 0 gesetzt. Dabei gilt laut Quelle totalPixel = wight height /ds_w/ds_h; wight und height sind Bildbreite und -höhe, ds_w und ds_h die horizontalen und vertikalen Unterabtastungsfaktoren. Wertebereich 0-1. |
| wpNumPercTh2 | Wie oben |

<!-- Source EN PDF p.28, block 145 -->

#### 2.2.13 WBGain-Anpassung der Farbadaptation

<!-- Source EN PDF p.28, block 146 -->

Die Verwendung wird derzeit nicht empfohlen. Entspricht der JSON-Struktur autoExtPara.chrAdpttAdj.

<!-- Source EN PDF p.28, block 147 -->

| Name | Beschreibung |
|---|---|
| enable | Passt das weißabgeglichene Bild möglichst an die menschliche Farbwahrnehmung an. Wert 0 deaktiviert, 1 aktiviert. |
| laCalcFactor | Faktor zur Steuerung der Farbadaptation bei unterschiedlicher Helligkeit; Standardwert 40. |
| targetGain | Beschreibt die Ziellichtquelle durch WBGain. Die Farberscheinung wird an diese Lichtquelle angepasst. Wertebereich 0-4; Standard ist der Weißabgleich-Gain von d50. |

<!-- Source EN PDF p.28, block 148 -->

#### 2.2.14 Begrenzung des WBGain-Bereichs

<!-- Source EN PDF p.28, block 149 -->

![Abbildung aus der englischen Quelle, PDF S. 28, Nr. 149](/docs/rockchip-isp30-color-optimization/assets/en-p28-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 28, Nr. 149.*

<!-- Source EN PDF p.28, block 150 -->

Begrenzt den Weißabgleich-Gain auf den oben rot umrandeten Bereich. Die Abszisse beschreibt die korrelierte Farbtemperatur, die Ordinate den Farbwiedergabeindex; beides sind Eigenschaften der Lichtquelle. Entspricht der JSON-Struktur autoExtPara.wbGainClip.

<!-- Source EN PDF p.29, block 151 -->

| Name | Beschreibung |
|---|---|
| enable | Aktiviert die Begrenzung des Farbtemperaturbereichs: 0 deaktiviert, 1 aktiviert |
| cct | CCT-Koordinaten der Stützpunkte für den umschlossenen Bereich; obere und untere Grenze verwenden dieselben CCT-Abtastkoordinaten. Wertebereich [1000-10000]. |
| cri_bound_up | Entspricht der unteren Grenze im Diagramm: cri0>=-cri_bound_up. Wertebereich -1 bis 1. |
| cri_bound_low | CRI-Komponente der oberen Bereichsgrenze im Diagramm: cri0<=cri_bound_low. Wertebereich -1 bis 1. |
| cct_len/cri_bound_up_len/cri_bound_low_len | Längen von cct, cri_bound_up bzw. cri_bound_low. Alle drei müssen gleich sein. |

<!-- Source EN PDF p.29, block 152 -->

Zusätzlich kann die minimale Farbtemperatur einer Außenlichtquelle begrenzt werden. Dies entspricht der JSON-Struktur autoExtPara.wbGainDaylightClip.

<!-- Source EN PDF p.29, block 153 -->

| Name | Beschreibung |
|---|---|
| enable | Aktiviert die Begrenzung der minimalen Außen-Farbtemperatur: 0 deaktiviert, 1 aktiviert |
| outdoor_cct_min | Minimale Außen-Farbtemperatur; keine Wertebereichsbeschränkung |

<!-- Source EN PDF p.29, block 154 -->

Wenn wbGainClip.eanble = 1 ist und die Szene (cct0, cri0) entspricht, wird cct0 bei Überschreiten der linken bzw. rechten Grenze auf deren Wert begrenzt. Wenn cri0`<-cri_bound_up gilt, wird cri0=-cri_bound_up ausgegeben. Wenn cri0 >`cri_bound_low gilt, wird cri0=cri_bound_low ausgegeben.

<!-- Source EN PDF p.29, block 155 -->

Wenn wbGainDaylightClip.enable= 1 ist und eine Außenszene vorliegt, wird bei cct0 >outdoor_cct_min der Wert cct0=outdoor_cct_min ausgegeben.

<!-- Source EN PDF p.29, block 156 -->

#### 2.2.15 WBGain-Farbtonanpassung

<!-- Source EN PDF p.29, block 157 -->

Entspricht der JSON-Struktur autoExtPara.wbGainAdjust.

<!-- Source EN PDF p.30, block 158 -->

| Name | Beschreibung |
|---|---|
| enable | Aktiviert die Farbtonanpassung: 0 deaktiviert, 1 aktiviert |
| lutAll | Für unterschiedliche Umgebungshelligkeiten können unterschiedliche Tabellen der Ausgabefarbtemperatur konfiguriert werden. |
| lutAll_len | Anzahl der Farbtemperaturtabellen |
| lutAll.lumaValue | Umgebungshelligkeit im Bereich 0 bis 255000 |
| lutAll.ct_grid_num | Anzahl der Farbtemperatur-Stützstellen der Eingabetabelle; ohne Beschränkung |
| lutAll.ct_in_range | Farbtemperaturbereich der Eingabetabelle; ohne Beschränkung |
| lutAll.cri_grid_num | Anzahl der Stützstellen für den Farbwiedergabeindex der Eingabetabelle; ohne Beschränkung |
| lutAll.cri_in_range | Bereich des Farbwiedergabeindex der Eingabetabelle; ohne Beschränkung |
| lutAll.ct_out | CT-Werte der Punkte in der folgenden Werkzeugansicht von links nach rechts, entsprechend kalten bis warmen Farbtönen bzw. kleinen bis großen CT-Werten. Wertebereich 0-255000. |
| lutAll.cri_out | CRI-Werte der Punkte in der folgenden Werkzeugansicht von unten nach oben, entsprechend violetten bis grünen Farbtönen bzw. negativen bis positiven CRI-Werten. Ohne Beschränkung. |
| lutAll.ct_in_range_len/ lutAll.cri_in_range_len/lutAll.cri_out_len/lutAll.cri_out | Anzahl der Punkte im zweidimensionalen Raster der folgenden Werkzeugansicht; entspricht lutAll.ct_grid_num*lutAll.cri_grid_num. |

<!-- Source EN PDF p.30, block 159 -->

Die aktuelle JSON-Version des Werkzeugs unterstützt diese Anpassungsfunktion nicht.

<!-- Source EN PDF p.30, block 160 -->

Ohne Farbtemperaturanpassung sieht das durch ct_out und cri_out beschriebene 2D-Raster wie folgt aus. Der durch ct_in_range und cri_in_range festgelegte rechteckige Bereich wird horizontal mit ct_grid_num und vertikal mit cri_grid_num Stützstellen abgetastet. Diese entsprechen den Punkten in der folgenden Abbildung. ct_out speichert ihre CT-Koordinaten, cri_out ihre Ordinaten.

<!-- Source EN PDF p.31, block 161 -->

![Abbildung aus der englischen Quelle, PDF S. 31, Nr. 161](/docs/rockchip-isp30-color-optimization/assets/en-p31-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 31, Nr. 161.*

<!-- Source EN PDF p.31, block 162 -->

Anpassung des gesamten Farbstils:

<!-- Source EN PDF p.31, block 163 -->

(1) Um den Farbton bei einer Farbtemperatur von 2000k wärmer zu gestalten, wählen Sie wie unten den Tabellenmodus CT Line Only. Bewegen Sie die Maus zu einem beliebigen Punkt mit cct=2000 und ziehen Sie ihn nach rechts. Nach der Anwendung werden alle Eingaben von 2000k bis 2391k auf 2391k angepasst.

<!-- Source EN PDF p.31, block 164 -->

![Abbildung aus der englischen Quelle, PDF S. 31, Nr. 164](/docs/rockchip-isp30-color-optimization/assets/en-p31-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 31, Nr. 164.*

<!-- Source EN PDF p.31, block 165 -->

(2) Um alle Farbtöne kühler zu gestalten, wählen Sie wie unten CT Line Only. Ziehen Sie die Punkte der verschiedenen CCT-Werte nach links, bis alle Farbtöne entsprechend verschoben sind.

<!-- Source EN PDF p.32, block 166 -->

![Abbildung aus der englischen Quelle, PDF S. 32, Nr. 166](/docs/rockchip-isp30-color-optimization/assets/en-p32-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 32, Nr. 166.*

<!-- Source EN PDF p.32, block 167 -->

(3) Um alle Farbtöne mit CRI = 0.5 in Richtung Violett zu verschieben, wählen Sie wie unten CRILine ONLY. Ziehen Sie einen beliebigen Punkt mit CRI=0.5 nach unten. Ziehen nach oben erzeugt dagegen einen grünlichen Farbton.

<!-- Source EN PDF p.32, block 168 -->

![Abbildung aus der englischen Quelle, PDF S. 32, Nr. 168](/docs/rockchip-isp30-color-optimization/assets/en-p32-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 32, Nr. 168.*

<!-- Source EN PDF p.32, block 169 -->

Die Wirkung der Farbtonanpassung ist nachfolgend dargestellt: In der Mitte befindet sich das Originalbild; oben, unten, links und rechts sind jeweils grünliche, violette, bläuliche und rötliche Varianten.

<!-- Source EN PDF p.33, block 170 -->

![Abbildung aus der englischen Quelle, PDF S. 33, Nr. 170](/docs/rockchip-isp30-color-optimization/assets/en-p33-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 33, Nr. 170.*

<!-- Source EN PDF p.33, block 171 -->

Mit der 2D-Tabelle lässt sich außerdem der lokale WBGain einfach verändern, ohne andere Szenen zu beeinflussen. Wählen Sie hierzu den freien Modus für Anpassungen in beliebiger Richtung und verschieben Sie die vier Eckpunkte des betreffenden Rechtecks, um den ausgegebenen WBGain anzupassen.

<!-- Source EN PDF p.33, block 172 -->

#### 2.2.16 wbGain-Offset

<!-- Source EN PDF p.33, block 173 -->

Entspricht der JSON-Struktur autoExtPara.wbGainOffset.

<!-- Source EN PDF p.33, block 174 -->

| Name | Beschreibung |
|---|---|
| enable | Aktivierungsschalter: 0 deaktiviert, 1 aktiviert |
| offset | Offset der Kanäle R GR GB B. Der zulässige Bereich ergibt sich aus der Summe von wbgain und offset: Nach der Addition muss diese im Bereich [0,4] für ISP21 bzw. [0,8] für andere Varianten liegen. |

<!-- Source EN PDF p.33, block 175 -->

#### 2.2.17 Konfiguration von Remosaic-Sensoren

<!-- Source EN PDF p.33, block 176 -->

Wenn andere Sensor-RAW-Formate durch Interpolation in Bayer-RAW umgewandelt werden, muss zunächst der WBGain angewendet werden; anschließend erfolgt keine inverse WBGain-Berechnung. Die Konfiguration zur Anpassung an den aktuellen AWB-Algorithmus entspricht der JSON-Struktur autoExtPara.remosaicCfg.

<!-- Source EN PDF p.34, block 177 -->

| Name | Beschreibung |
|---|---|
| enable | Aktivierungsschalter: 0 deaktiviert, 1 aktiviert. Für Sensoren mit Bayer-Anordnung muss diese Funktion nicht aktiviert werden. |
| sensorWbGain | Bei der Interpolation angewendeter WBGain für die Kanäle R GR GB B. Den Wertebereich entnehmen Sie der Sensordokumentation. |
| applyInvWbGainEnable | Aktiviert vor der RAW-AWB-Statistik den inversen WBGain, also die Division durch sensorWbGain. Wert 0 deaktiviert, 1 aktiviert. |

<!-- Source EN PDF p.34, block 178 -->

#### 2.2.18 Glättung von WBGain

<!-- Source EN PDF p.34, block 179 -->

Berechnet das Gewicht des Weißabgleich-Gains des vorherigen Frames (wbGainDampFactor). Durch Gewichtung des vorherigen und aktuellen WBGain werden Änderungen geglättet. Höhere dFMin- und dFMax-Werte verbessern die Stabilität, verlangsamen jedoch die Konvergenz. Kleinere Werte beschleunigen die Konvergenz, können aber WBGain-Sprünge verursachen.

<!-- Source EN PDF p.34, block 180 -->

Die Berechnungslogik lautet: Bei kleinen Änderungen der Umgebungshelligkeit bleibt wbGainDampFactor bei dFMax. Bei abrupten Änderungen nähert er sich dFMin, wodurch das aktuelle Frame stärker gewichtet wird. So folgt WBGain den Umgebungsänderungen schneller und die Konvergenz wird beschleunigt. Der konkrete Code lautet:

<!-- Source EN PDF p.34, block 181 -->

```text
if (varianceLuma > LvVarTh) {
*wbGainDampFactor -= dFStep;
}
else {
*wbGainDampFactor += dFStep;
}
if (*wbGainDampFactor < dFMin) {
*wbGainDampFactor = dFMin;
}
else if (*wbGainDampFactor > dFMax) {
*wbGainDampFactor = dFMax;
}
```

<!-- Source EN PDF p.34, block 193 -->

Entspricht der JSON-Struktur autoExtPara.dampFactor.

<!-- Source EN PDF p.35, block 194 -->

| Name | Beschreibung |
|---|---|
| dFStep | Änderungsschrittweite von wbGainDampFactor; Wertebereich 0-1 |
| dFMin | Minimalwert von wbGainDampFactor; Wertebereich 0-1 |
| dFMax | Maximalwert von wbGainDampFactor; Wertebereich 0-1 |
| LvIIRsize | Anzahl der Frames, deren Umgebungshelligkeit aufgezeichnet wird; Wertebereich 0-255 |
| LvVarTh | Varianzschwelle der Umgebungshelligkeit, anhand derer über eine Änderung von wbGainDampFactor entschieden wird; Wertebereich 0-255000 |

<!-- Source EN PDF p.35, block 195 -->

#### 2.2.19 Weitere Parameter

<!-- Source EN PDF p.35, block 196 -->

##### 2.2.19.1 tolerance

<!-- Source EN PDF p.35, block 197 -->

Steuert die Aktualisierung von WBGain. Für verschiedene Umgebungshelligkeiten lumaValue können unterschiedliche Schwellen toleranceValue konfiguriert werden. Ist die mittlere Differenz der durch die AWB-Strategie berechneten Weißabgleich-Gains aller Kanäle über mehrere Frames kleiner als diese Schwelle, wird der WBGain des vorherigen Frames verwendet. Die Frameanzahl legt weightForNightGainCalc_len fest. Entspricht der JSON-Struktur autoExtPara.tolerance.

<!-- Source EN PDF p.35, block 198 -->

| Name | Beschreibung |
|---|---|
| lumaValue | Umgebungshelligkeit; Wertebereich [0-255000]. Zur Konfiguration siehe lumaValueMatrix weiter unten. |
| toleranceValue | Schwellenwert; Wertebereich [0-1] |
| lumaValue_len/toleranceValue_len | Gleiche Länge; Anzahl der zugehörigen Konfigurationen, ohne Wertebereichsbeschränkung |

<!-- Source EN PDF p.35, block 199 -->

##### 2.2.19.2 runInterval

<!-- Source EN PDF p.35, block 200 -->

Steuert, nach wie vielen Frames der automatische Weißabgleich ausgeführt wird. Für verschiedene Umgebungshelligkeiten lumaValue können unterschiedliche Frameintervalle intervalValue konfiguriert werden. Entspricht der JSON-Struktur autoExtPara.runInterval.

<!-- Source EN PDF p.36, block 201 -->

| Name | Beschreibung |
|---|---|
| lumaValue | Umgebungshelligkeit; Wertebereich [0-255000]. Zur Konfiguration siehe lumaValueMatrix weiter unten. |
| intervalValue | Frameanzahl; Wertebereich [0-255] |
| lumaValue_len/intervalValue_len | Gleiche Länge; Anzahl der zugehörigen Konfigurationen, ohne Wertebereichsbeschränkung |

<!-- Source EN PDF p.36, block 202 -->

##### 2.2.19.3 lumaValueMatrix

<!-- Source EN PDF p.36, block 203 -->

Entspricht dem JSON-Array autoExtPara.lumaValueMatrix.

<!-- Source EN PDF p.36, block 204 -->

| Name | Beschreibung |
|---|---|
| lumaValueMatrix | Unterteilt die Umgebungshelligkeit in 15 Stufen. Der Anfangswert jeder Stufe liegt im Bereich 0-300000. |

<!-- Source EN PDF p.36, block 205 -->

##### 2.2.19.4 Beurteilung der Weißabgleichkonvergenz

<!-- Source EN PDF p.36, block 206 -->

Entspricht der JSON-Struktur autoExtPara.converged.

<!-- Source EN PDF p.36, block 207 -->

| Name | Beschreibung |
|---|---|
| varThforUnDamp | Konvergenzschwelle des Weißabgleichs. Konvergenz gilt als erreicht, wenn die mittlere Differenz der durch die AWB-Strategie berechneten Gains aller Kanäle über mehrere Frames kleiner als varThforUnDamp ist und die mittlere Differenz der geglätteten Gains kleiner als varThforDamp. Die Frameanzahl legt weightForNightGainCalc_len fest. Wertebereich 0.0-1; empfohlen 0.06. |
| varThforDamp | Bedeutung und Wertebereich wie oben; empfohlen 0.03 |

<!-- Source EN PDF p.36, block 208 -->

##### 2.2.19.5 Auswahlparameter für mittlere, große und zusätzliche Weißpunktfenster

<!-- Source EN PDF p.36, block 209 -->

Entspricht dem JSON-Knoten autoExtPara.xyRegionStableSelection.

<!-- Source EN PDF p.37, block 210 -->

| Name | Beschreibung |
|---|---|
| enable | Funktionsschalter zur Stabilisierung der Auswahl zwischen mittlerem, großem und zusätzlichem Weißpunktfenster |
| xyTypeListSize | xyRegionSize und LvVarTh stabilisieren die Fensterauswahl. Das Ergebnis mit den meisten Stimmen über xyTypeListSize Frames wird verwendet. Liegt die Varianz der Umgebungshelligkeit über LvIIRsize Frames (siehe WBGain-Glättung) unter varianceLumaTh, wird die Auswahl nicht aktualisiert: Das Fenster des vorherigen Frames bleibt für nachfolgende Frames erhalten. Wertebereich 0-1000. |
| varianceLumaTh | Siehe Beschreibung in der vorherigen Zeile; Wertebereich 0-1000 |
| wpNumTh | Konfigurationen für unterschiedliche Umgebungshelligkeiten; die tatsächlichen Schwellen werden daraus linear interpoliert. |
| wpNumTh.lumaValue | Umgebungshelligkeit; Wertebereich 0-255000 |
| wpNumTh.forBigType | Die Weißpunktanzahl wird mit forBigType/100000*totalPixel verglichen; Wertebereich 0-100000. |
| wpNumTh.forExtraType | Die tatsächliche Weißpunktanzahl wird mit forExtraType/100000*totalPixel verglichen; Wertebereich 0-100000. |

<!-- Source EN PDF p.37, block 211 -->

Bei xyRegionSize = 0 oder varianceLumaTh= 0 wird für jedes Frame die Fensterauswahl anhand der aktuellen Frameinformationen verwendet.

<!-- Source EN PDF p.37, block 212 -->

```text
if(number of white dots in the middle frame> forBigType/100000*totalPixel){
Then the white point for calculating wbgain comes from the middle box
}else{
The white point for calculating wbgain comes from the large box
if(The number of white dots in the large box<=forExtraType/100000*totalPixel && The total number of white dots in the accessory white dot box > 0){
The white point for calculating wbgain comes from the additional white point box}
}
```

<!-- Source EN PDF p.37, block 219 -->

Hinweis:

<!-- Source EN PDF p.37, block 220 -->

(1) Stammen die für WBGain verwendeten Weißpunkte aus dem zusätzlichen Weißpunktfenster, sind die Parameter im Abschnitt „Bereichsstrategie zur Berechnung von WBGain“ unwirksam.

<!-- Source EN PDF p.38, block 221 -->

### 2.3 Kalibrierung

<!-- Source EN PDF p.38, block 222 -->

#### 2.3.1 Grundlagen der AWB-Kalibrierung

<!-- Source EN PDF p.38, block 223 -->

Kalibriert werden hauptsächlich die RAW-Weißpunktbedingungen in XY, UV und YUV, die Parameter des Einzelfarbalgorithmus und die Weißabgleich-Gains unter Standardlichtquellen.

<!-- Source EN PDF p.38, block 224 -->

#### 2.3.2 Anforderungen an RAW-Aufnahmen für die AWB-Kalibrierung

<!-- Source EN PDF p.38, block 225 -->

Bereiten Sie für die RAW-Aufnahme folgende Umgebung vor:

<!-- Source EN PDF p.38, block 226 -->

① Ausrüstung: X-Rite-Farbtafel mit 24 Feldern und Lichtkasten

<!-- Source EN PDF p.38, block 227 -->

② Stellen Sie die Belichtungsparameter so ein, dass der Maximalwert des hellsten weißen Felds im Bereich [150-240] liegt; innerhalb dieses Bereichs gilt: je heller, desto besser.

<!-- Source EN PDF p.38, block 229 -->

③ Die Farbtafel muss mehr als 1/9 des Bildes einnehmen.

<!-- Source EN PDF p.38, block 230 -->

Fotografieren Sie die X-Rite-Farbtafel mit 24 Feldern nacheinander unter den Lichtquellen A, CWF, D50, D65, D75, HZ und TL84. Die schematische Darstellung nach dem Demosaicing lautet:

<!-- Source EN PDF p.38, block 231 -->

![Abbildung aus der englischen Quelle, PDF S. 38, Nr. 231](/docs/rockchip-isp30-color-optimization/assets/en-p38-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 38, Nr. 231.*

<!-- Source EN PDF p.38, block 232 -->

#### 2.3.3 Oberfläche des AWB-Kalibrierwerkzeugs

<!-- Source EN PDF p.38, block 233 -->

(1) Schematische AWB-Hauptansicht

<!-- Source EN PDF p.39, block 234 -->

![Abbildung aus der englischen Quelle, PDF S. 39, Nr. 234](/docs/rockchip-isp30-color-optimization/assets/en-p39-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 39, Nr. 234.*

<!-- Source EN PDF p.39, block 235 -->

(2) Bei der Kalibrierung werden hauptsächlich die Weißpunktgrenzen im UV- und XY-Bereich sowie die TH-Werte im YUV-Bereich angepasst.

<!-- Source EN PDF p.39, block 236 -->

![Abbildung aus der englischen Quelle, PDF S. 39, Nr. 236](/docs/rockchip-isp30-color-optimization/assets/en-p39-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 39, Nr. 236.*

<!-- Source EN PDF p.40, block 237 -->

![Abbildung aus der englischen Quelle, PDF S. 40, Nr. 237](/docs/rockchip-isp30-color-optimization/assets/en-p40-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 40, Nr. 237.*

<!-- Source EN PDF p.40, block 238 -->

Bedienung zur Anpassung der Weißpunktbereiche in UV und XY: a) Ziehen Sie die Eckpunkte der Weißpunktbedingung im Koordinatensystem, um Position und Bereich anzupassen. b) Ziehen Sie in einem leeren Bereich, um den gesamten Weißpunktbereich zu verschieben. c) Verwenden Sie das Mausrad zum Vergrößern und Verkleinern.

<!-- Source EN PDF p.40, block 239 -->

(3) Im Bereich Exclude WPC Range lassen sich Nicht-Weißpunktbereiche und Weißpunktbereiche zusätzlicher Lichtquellen ergänzen.

<!-- Source EN PDF p.40, block 240 -->

(4) Durch Klicken auf „AWB Simulaton“ in der AWB-Hauptansicht öffnet sich die folgende Ansicht. AWB Simulaton erkennt Weißpunkte in RAW-Aufnahmen und erfasst deren Gains und Anzahl.

<!-- Source EN PDF p.40, block 241 -->

![Abbildung aus der englischen Quelle, PDF S. 40, Nr. 241](/docs/rockchip-isp30-color-optimization/assets/en-p40-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 40, Nr. 241.*

<!-- Source EN PDF p.41, block 242 -->

① Nach dem Import einer RAW-Aufnahme über LoadImage werden wie unten die Weißpunktinformationen angezeigt. Weißpunkte unterschiedlicher Lichtquellen erscheinen in verschiedenen Farben. Die Weißpunktanzahlen sowie RGain und BGain für mittlere und große Fenster werden in den drei Textfeldern Detected WP Number, RGain und BGain angezeigt.

<!-- Source EN PDF p.41, block 243 -->

![Abbildung aus der englischen Quelle, PDF S. 41, Nr. 243](/docs/rockchip-isp30-color-optimization/assets/en-p41-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 41, Nr. 243.*

<!-- Source EN PDF p.41, block 244 -->

② Klicken Sie auf einen beliebigen Bildpunkt, wie unten durch den schwarzen Pfeil markiert. Der Punkt wird als kleines schwarzes Quadrat in die UV- und XY-Weißpunktansichten übertragen. So lässt sich leicht erkennen, ob er innerhalb eines Weißpunktbereichs liegt. Gleichzeitig werden R G B U V X Y RGain BGain des Punkts im roten Bereich angezeigt. Die für jede Lichtquelle abgebildeten u- und th-Werte im YUV-Bereich sowie der Abstand zum Standardweißpunkt erscheinen in den drei Spalten des grünen Bereichs.

<!-- Source EN PDF p.41, block 245 -->

![Abbildung aus der englischen Quelle, PDF S. 41, Nr. 245](/docs/rockchip-isp30-color-optimization/assets/en-p41-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 41, Nr. 245.*

<!-- Source EN PDF p.42, block 246 -->

![Abbildung aus der englischen Quelle, PDF S. 42, Nr. 246](/docs/rockchip-isp30-color-optimization/assets/en-p42-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 42, Nr. 246.*

<!-- Source EN PDF p.42, block 247 -->

#### 2.3.4 Schritte der AWB-Kalibrierung

<!-- Source EN PDF p.42, block 248 -->

(1) BLC- und LSC-Kalibrierung müssen für die AWB-Kalibrierung abgeschlossen sein.

<!-- Source EN PDF p.42, block 249 -->

(2) Importieren Sie mit Load Raw Files die RAW-Aufnahmen unter A, CWF, D50, D65, D75, HZ und TL84. Es wird empfohlen, alle sieben Lichtquellen zu kalibrieren.

<!-- Source EN PDF p.42, block 250 -->

(3) Klicken Sie auf Find Chart, um die Farbtafel zu erkennen.

<!-- Source EN PDF p.42, block 251 -->

![Abbildung aus der englischen Quelle, PDF S. 42, Nr. 251](/docs/rockchip-isp30-color-optimization/assets/en-p42-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 42, Nr. 251.*

<!-- Source EN PDF p.42, block 252 -->

① Klicken Sie nacheinander auf die Felder 1, 6, 19 und 20.

<!-- Source EN PDF p.42, block 253 -->

② FindChart erkennt die Farbfelder für alle Lichtquellen im Stapel. Die folgende Ansicht zeigt das Weißpunkterkennungsergebnis der letzten Lichtquelle.

<!-- Source EN PDF p.43, block 254 -->

![Abbildung aus der englischen Quelle, PDF S. 43, Nr. 254](/docs/rockchip-isp30-color-optimization/assets/en-p43-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 43, Nr. 254.*

<!-- Source EN PDF p.43, block 255 -->

③ Wählen Sie im Dropdown-Menü andere Lichtquellen aus und prüfen Sie die Farbfelderkennung. Im Beispiel ist nur das letzte TL84-Feld etwas nach rechts verschoben. Erkennen Sie dieses separat neu: Wählen Sie Find chart one by one und wiederholen Sie die Schritte ① und ②, bis die TL84-Felder wie unten korrekt erkannt werden.

<!-- Source EN PDF p.43, block 256 -->

![Abbildung aus der englischen Quelle, PDF S. 43, Nr. 256](/docs/rockchip-isp30-color-optimization/assets/en-p43-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 43, Nr. 256.*

<!-- Source EN PDF p.43, block 257 -->

④ Klicken Sie auf Save, um die Erkennung abzuschließen.

<!-- Source EN PDF p.43, block 258 -->

(4) Klicken Sie auf Calibrate, um die folgenden anfänglichen Weißpunktbedingungen und weiteren Parameter zu erhalten.

<!-- Source EN PDF p.44, block 259 -->

![Abbildung aus der englischen Quelle, PDF S. 44, Nr. 259](/docs/rockchip-isp30-color-optimization/assets/en-p44-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 44, Nr. 259.*

<!-- Source EN PDF p.44, block 260 -->

![Abbildung aus der englischen Quelle, PDF S. 44, Nr. 260](/docs/rockchip-isp30-color-optimization/assets/en-p44-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 44, Nr. 260.*

| Lichtquelle | U0 | U1 | U2 | U3 | U4 | U5 |
|---|---|---|---|---|---|---|
| A | 50 | 54 | 70 | 78 | 110 | 142 |
| CWF | 50 | 54 | 70 | 78 | 110 | 142 |
| D50 | 50 | 54 | 70 | 78 | 110 | 142 |
| D65 | 50 | 54 | 70 | 78 | 110 | 142 |
| D75 | 50 | 54 | 70 | 78 | 110 | 142 |
| HZ | 50 | 54 | 70 | 78 | 110 | 142 |
| TL84 | 50 | 54 | 70 | 78 | 110 | 142 |

| Lichtquelle | Th0 | Th1 | Th2 | Th3 | Th4 | Th5 |
|---|---|---|---|---|---|---|
| A | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| CWF | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D50 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D65 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D75 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| HZ | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| TL84 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |

<!-- Source EN PDF p.44, block 261 -->

(5) Klicken Sie auf AWB Simulaton und importieren Sie die RAW-Aufnahmen für A, CWF, D50, D65, D75, HZ und TL84, um die Genauigkeit der Weißpunkterkennung zu prüfen.

<!-- Source EN PDF p.44, block 262 -->

(6) Passen Sie die UV- oder XY-Fenster bzw. den YUV-Schwellenwert TH an, um die Weißpunkterkennung der Farbtafel unter jeder Lichtquelle zu verbessern.

<!-- Source EN PDF p.45, block 263 -->

(7) Klicken Sie auf Save.

<!-- Source EN PDF p.45, block 264 -->

(8) Wiederholen Sie (5) bis (7), bis die Weißpunkterkennung für jede Lichtquelle plausibel ist.

<!-- Source EN PDF p.45, block 265 -->

(9) Hinweise:

<!-- Source EN PDF p.45, block 266 -->

① Passen Sie die Grenzen so an, dass Weißpunkte innerhalb und Nicht-Weißpunkte außerhalb der Fenster liegen. Dies lässt sich im Allgemeinen nicht vollständig erreichen.

<!-- Source EN PDF p.45, block 267 -->

② Die mittleren Fenster der Lichtquellen entlang des Schwarzkörperkurvenzugs müssen in x-Richtung zusammenhängend sein. Drei Linienarten stehen für drei Fenstergrößen; die aktuelle Version enthält keine kleinen Fenster.

<!-- Source EN PDF p.45, block 268 -->

Fehlerbeispiel: Die Bereiche der großen Fenster schließen aneinander an, zwischen den mittleren Fenstern besteht jedoch eine Lücke, wie die Pfeile zeigen.

<!-- Source EN PDF p.45, block 269 -->

![Abbildung aus der englischen Quelle, PDF S. 45, Nr. 269](/docs/rockchip-isp30-color-optimization/assets/en-p45-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 45, Nr. 269.*

<!-- Source EN PDF p.45, block 270 -->

Korrektes Beispiel:

<!-- Source EN PDF p.45, block 271 -->

![Abbildung aus der englischen Quelle, PDF S. 45, Nr. 271](/docs/rockchip-isp30-color-optimization/assets/en-p45-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 45, Nr. 271.*

<!-- Source EN PDF p.45, block 272 -->

③ Für A und hz können die XY-Fenster in Y-Richtung enger gefasst werden; für d50 und d65 können sie in dieser Richtung weiter sein.

<!-- Source EN PDF p.45, block 273 -->

④ Die mittleren und großen Fenster von Lichtquellen mit ähnlicher Farbtemperatur müssen in y-Richtung zusammenhängend sein, beispielsweise CWF und TL84.

<!-- Source EN PDF p.45, block 274 -->

⑤ Die UV-Bereiche aller Lichtquellen dürfen keine Unterbrechungen aufweisen.

<!-- Source EN PDF p.45, block 275 -->

⑥ Bereiche unterschiedlicher Lichtquellen dürfen sich überlappen, jedoch nicht gleichzeitig im XY- und UV-Farbraum.

<!-- Source EN PDF p.45, block 276 -->

⑦ Unterteilen Sie den UV-Farbraum anhand des XY-Farbraums, um Nicht-Weißpunkte auszuschließen.

<!-- Source EN PDF p.45, block 277 -->

Liegt das eingekreiste siebte Farbfeld unter D75 innerhalb des hz-Bereichs, wird es als Weißpunkt erkannt.

<!-- Source EN PDF p.46, block 278 -->

![Abbildung aus der englischen Quelle, PDF S. 46, Nr. 278](/docs/rockchip-isp30-color-optimization/assets/en-p46-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 46, Nr. 278.*

<!-- Source EN PDF p.46, block 279 -->

Nach erneuter Anpassung wird das siebte Feld B unter D75 im XY- und UV-Farbraum nicht mehr derselben Lichtquelle zugeordnet und daher nicht als Weißpunkt erkannt.

<!-- Source EN PDF p.46, block 280 -->

![Abbildung aus der englischen Quelle, PDF S. 46, Nr. 280](/docs/rockchip-isp30-color-optimization/assets/en-p46-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 46, Nr. 280.*

<!-- Source EN PDF p.46, block 281 -->

⑧ Liegt ein Nicht-Weißpunkt in den XY- und UV-Weißpunktbereichen, kann er auch durch Verringerung des YUV-Schwellenwerts TH oder Erweiterung eines Nicht-Weißpunktbereichs ausgeschlossen werden.

<!-- Source EN PDF p.46, block 282 -->

⑨ Liegt ein Weißpunkt innerhalb der XY- und UV-Bereiche, wird aber dennoch nicht erkannt, kann er außerhalb des Helligkeitsbereichs oder innerhalb eines Nicht-Weißpunktbereichs liegen. Eine weitere in der Quelle genannte Ursache ist, dass er unter TH liegt und nicht zum YUV-Weißpunktbereich gehört.

<!-- Source EN PDF p.46, block 283 -->

#### 2.3.5 Überprüfung der AWB-Kalibrierparameter

<!-- Source EN PDF p.46, block 284 -->

Importieren Sie die Kalibrieraufnahmen nacheinander und führen Sie die Weißpunkterkennung aus. Priorität hat eine geringe Rate übersehener Weißpunkte; reduzieren Sie zugleich Fehlklassifikationen in angemessenem Maß.

<!-- Source EN PDF p.46, block 285 -->

Endgültige Weißpunktbedingungen:

<!-- Source EN PDF p.47, block 286 -->

![Abbildung aus der englischen Quelle, PDF S. 47, Nr. 286](/docs/rockchip-isp30-color-optimization/assets/en-p47-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 47, Nr. 286.*

<!-- Source EN PDF p.47, block 287 -->

Ergebnisse der Weißpunktprüfung:

<!-- Source EN PDF p.47, block 288 -->

Lichtquelle A

<!-- Source EN PDF p.47, block 289 -->

![Abbildung aus der englischen Quelle, PDF S. 47, Nr. 289](/docs/rockchip-isp30-color-optimization/assets/en-p47-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 47, Nr. 289.*

<!-- Source EN PDF p.47, block 290 -->

CWF:

<!-- Source EN PDF p.48, block 291 -->

![Abbildung aus der englischen Quelle, PDF S. 48, Nr. 291](/docs/rockchip-isp30-color-optimization/assets/en-p48-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 48, Nr. 291.*

<!-- Source EN PDF p.48, block 292 -->

D50

<!-- Source EN PDF p.48, block 293 -->

![Abbildung aus der englischen Quelle, PDF S. 48, Nr. 293](/docs/rockchip-isp30-color-optimization/assets/en-p48-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 48, Nr. 293.*

<!-- Source EN PDF p.48, block 294 -->

D65

<!-- Source EN PDF p.49, block 295 -->

![Abbildung aus der englischen Quelle, PDF S. 49, Nr. 295](/docs/rockchip-isp30-color-optimization/assets/en-p49-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 49, Nr. 295.*

<!-- Source EN PDF p.49, block 296 -->

D75

<!-- Source EN PDF p.49, block 297 -->

![Abbildung aus der englischen Quelle, PDF S. 49, Nr. 297](/docs/rockchip-isp30-color-optimization/assets/en-p49-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 49, Nr. 297.*

<!-- Source EN PDF p.49, block 298 -->

HZ

<!-- Source EN PDF p.50, block 299 -->

![Abbildung aus der englischen Quelle, PDF S. 50, Nr. 299](/docs/rockchip-isp30-color-optimization/assets/en-p50-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 50, Nr. 299.*

<!-- Source EN PDF p.50, block 300 -->

TL84

<!-- Source EN PDF p.50, block 301 -->

![Abbildung aus der englischen Quelle, PDF S. 50, Nr. 301](/docs/rockchip-isp30-color-optimization/assets/en-p50-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 50, Nr. 301.*

<!-- Source EN PDF p.50, block 302 -->

### 2.4 Eingrenzung häufiger Probleme

<!-- Source EN PDF p.50, block 303 -->

Zur Behebung von Weißabgleichfehlern müssen üblicherweise Protokolle und RAW-Aufnahmen erfasst werden. Nach Analyse der Ursache werden die Weißpunktbedingungen oder Strategieparameter angepasst.

<!-- Source EN PDF p.50, block 304 -->

##### 2.4.0.1 Protokolle erfassen und analysieren

<!-- Source EN PDF p.50, block 305 -->

Für das AWB-Debugging wird export persist_camera_engine_log=0x2ff4 verwendet.

<!-- Source EN PDF p.51, block 306 -->

###### 2.4.0.1.1 Auswertung von A

<!-- Source EN PDF p.51, block 307 -->

##### 2.4.0.2 AWB-Protokolle auswerten (am Beispiel serieller oder über adb ausgegebener Protokolle)

<!-- Source EN PDF p.51, block 308 -->

###### 2.4.0.2.1 (1) Steuerungs- und Modusprotokoll

<!-- Source EN PDF p.51, block 309 -->

![Abbildung aus der englischen Quelle, PDF S. 51, Nr. 309](/docs/rockchip-isp30-color-optimization/assets/en-p51-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 51, Nr. 309.*

Abschrift des lesbaren Screenshot-Texts; abgeschnittene Quellbereiche werden nicht rekonstruiert:

```text
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:1979: AwbInitV201: (enter)
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:2040: AwbInitV201: (exit)
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:2070: AwbPrepareV201: (enter)
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:2148: hdr_working_mode(0), remosaic_cfg.enable (0)
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:2149: AwbPrepareV201: (exit)
[AWB]:XCAM INFO (1782) rk_aiq_awb_itf.cpp:102: ---------------------------------------------frame_id (-1)---------------------------------------------
[AWB]:XCAM DEBUG rk_aiq_awb_algo_v201.cpp:2469: AwbReconfigV201: byPass: 0  mode( 0-manual 1-auto):1
[AWB]:XCAM INFO (1782) rk_aiq_awb_itf.cpp:250: processing awb_gain_algo (1.905082,1.000000,1.000000,1.978512)
[AWB]:XCAM INFO (1782) rk_aiq_awb_itf.cpp:102: ---------------------------------------------frame_id (0)---------------------------------------------
```

<!-- Source EN PDF p.51, block 310 -->

hdr_working_mode = 0 bezeichnet den normalen Modus; andere Werte bezeichnen den HDR-Modus.

<!-- Source EN PDF p.51, block 311 -->

byPass = 0 aktiviert die Weißabgleichkorrektur; byPass = 1 deaktiviert sie.

<!-- Source EN PDF p.51, block 312 -->

mode = 0 bezeichnet den manuellen, mode = 1 den automatischen Weißabgleich.

<!-- Source EN PDF p.51, block 313 -->

frame_id ist die Framekennung.

<!-- Source EN PDF p.51, block 314 -->

processing awb_gain_algo ist der endgültig von diesem Modul ausgegebene WBGain.

<!-- Source EN PDF p.51, block 315 -->

###### 2.4.0.2.2 (2) AWB-Protokollstufe export persist_camera_engine_log=0x2ff2 zur allgemeinen Fehlereingrenzung

<!-- Source EN PDF p.51, block 317 -->

![Abbildung aus der englischen Quelle, PDF S. 51, Nr. 317](/docs/rockchip-isp30-color-optimization/assets/en-p51-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 51, Nr. 317.*

Abschrift des lesbaren Screenshot-Texts; abgeschnittene Quellbereiche werden nicht rekonstruiert:

```text
2: ---------------------------------------------frame_id (1)---------------------------------------------
68: ***1th calculate wbgain***
52: AwbGainClip, Input CCT : 5800.018555, CRI : -0.124677
09: AwbGainClip, Output CCT : 5800.018555, CRI : -0.124677
09: AwbGainAdjust2, Input CCT : 5800.018555, CRI : -0.124677
50: AwbGainAdjust2, Output CCT : 5800.018066, CRI : -0.124677
3:
7: wbgain_s5(after damping)(rggb):(2.146030,1.000000,1.000000,2.072558), awbConverged(0) ,LVValue(6054), WPType(3),df(0.75), frameChoose(0)
0: WPNo(normal,big):(203,208),valid wp number in standard light(187), valid wp number in extra light(0),
2: select white point range type (0-normal xy range,1-big xy range, 3-extra light) : 0, runInterval(0),tolerance(0.000000)
41:
0: processing awb_gain_algo (2.146030,1.000000,1.000000,2.072558)
```

<!-- Source EN PDF p.51, block 318 -->

AwbGainClip Input und output sind die CCT- und CRI-Eingaben bzw. -Ausgaben der WBGain-Bereichsbegrenzung.

<!-- Source EN PDF p.51, block 319 -->

AwbGainAdjust2 enthält die CCT- und CRI-Eingaben bzw. -Ausgaben der Farbtonanpassung.

<!-- Source EN PDF p.51, block 320 -->

wbgain_s5 ist der geglättete WBGain und entspricht normalerweise processing awb_gain_algo. awbConverged = 0 bedeutet nicht konvergiert, 1 bedeutet konvergiert.

<!-- Source EN PDF p.51, block 321 -->

LVValue ist die Umgebungshelligkeit.

<!-- Source EN PDF p.51, block 322 -->

WPType entspricht dem Bereich innerhalb der Strategieunterteilung.

<!-- Source EN PDF p.51, block 323 -->

df ist der aktuelle Glättungskoeffizient wbGainDampFactor.

<!-- Source EN PDF p.51, block 324 -->

frameChoose = 0, 1 bzw. 2 verwendet kurze, mittlere bzw. lange Frames als Eingang der AWB-Hardwarestatistik.

<!-- Source EN PDF p.51, block 325 -->

WPNo ist die Weißpunktanzahl in den mittleren und großen Fenstern.

<!-- Source EN PDF p.51, block 326 -->

VAILD WP Number in Standard Light ist die Anzahl gültiger Weißpunkte für alle Lichtquellen.

<!-- Source EN PDF p.51, block 327 -->

Select White Point Range Type = 0 bzw. 1 bedeutet, dass die aktuelle Weißpunktstatistik auf mittleren bzw. großen Fenstern basiert.

<!-- Source EN PDF p.51, block 328 -->

runInterval gibt das Ausführungsintervall in Frames an.

<!-- Source EN PDF p.51, block 329 -->

Wenn die WBGain-Änderung unter tolerance liegt, wird WBGain nicht aktualisiert.

<!-- Source EN PDF p.52, block 330 -->

###### 2.4.0.2.3 (3) AWB-Protokollstufe export persist_camera_engine_log=0x2ff3 zur Analyse von Weißpunktbedingungen und Strategieproblemen

<!-- Source EN PDF p.52, block 332 -->

![Abbildung aus der englischen Quelle, PDF S. 52, Nr. 332](/docs/rockchip-isp30-color-optimization/assets/en-p52-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 52, Nr. 332.*

Abschrift des lesbaren Screenshot-Texts; abgeschnittene Quellbereiche werden nicht rekonstruiert:

```text
tf.cpp:102: ---------------------------------------------frame_id (91)---------------------------------------------
om1.cpp:868: ***91th calculate wbgain***
om2.cpp:352: AwbGainClip, Input CCT : 6534.665527, CRI : -0.122040
p:389: AwbGainClip wb gain clip, because current cri(-0.122040)< upper bound cri(-0.120000)
p:407: AwbGainClip, wbgain_s3 (rggb) (2.319863,1.000000,1.000000,1.746177)
om2.cpp:409: AwbGainClip, Output CCT : 6534.665527, CRI : -0.120000
om2.cpp:609: AwbGainAdjust2, Input CCT : 6534.665527, CRI : -0.120000
p:649: AwbGainAdjust2, wbgain_s4(2.319863,1.000000,1.000000,1.746177)
om2.cpp:650: AwbGainAdjust2, Output CCT : 6534.664551, CRI : -0.120000
p:847: Global CCT:6524.882812,CCRI:-0.119850,valid:1
p:860: ill:D65 prob: 0.923094, CCT:6514.593750, CCRI:-0.121243, valid:1
p:860: ill:D75 prob: 0.076906, CCT:6775.584961, CCRI:-0.131615, valid:1
p:860: ill:A prob: 0.000000, CCT:0.000000, CCRI:0.000000, valid:0
p:860: ill:CWF prob: 0.000000, CCT:4577.164551, CCRI:-0.118429, valid:1
201.cpp:43:
201.cpp:47: wbgain_s5(after damping)(rggb):(2.317371,1.000000,1.000000,1.750428), awbConverged(1) ,LVValue(1498), WPType(3),df(0.90), frameChoose(0)
201.cpp:50: WPNo(normal,big):(12374,12429),valid wp number in standard light(12282), valid wp number in extra light(0),
201.cpp:52: select white point range type (0-normal xy range,1-big xy range, 3-extra light) : 0, runInterval(0),tolerance(0.000000)
p:63: temporalDefaultGain for wbGainType3 (rggb):(1.327034,1.000000,1.000000,3.314321), weight (0.000000)
p:65: wbGainType1 (rggb):(0.000000,0.000000,0.000000,0.000000)
p:67: wbGainType3(rggb):(2.321654,1.000000,1.000000,1.747155)
p:70: wbgain_s1 (mix wbGainType1 and wbGainType3 ) :(2.321654,1.000000,1.000000,1.747155) is updated (1), weight of wbGainType3
p:108: A:
p:112:      stategy_result.gain (rggb):(0.000000,0.000000,0.000000,0.000000)
p:114:      prob_total(0.000000),prob_dis(0.056154),prob_LV(0.142857),prob_WPNO(0.000000)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(0.000000,0.000000) WPNo(0)
p:132:      type1: gain (rg,bg):(0.000000,0.000000) WPNo(0)
p:108: CWF:
p:112:      stategy_result.gain (rggb):(1.846224,1.000000,1.000000,2.610467)
p:114:      prob_total(0.000000),prob_dis(0.148655),prob_LV(0.142857),prob_WPNO(0.000000)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(1.846224,2.610467) WPNo(18)
p:132:      type1: gain (rg,bg):(1.860870,2.614064) WPNo(20)
p:108: D50:
p:112:      stategy_result.gain (rggb):(2.087728,1.000000,1.000000,2.081820)
p:114:      prob_total(0.000000),prob_dis(0.207562),prob_LV(0.142857),prob_WPNO(0.000000)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(2.087728,2.081820) WPNo(74)
p:132:      type1: gain (rg,bg):(2.092266,2.077117) WPNo(78)
p:108: D65:
p:112:      stategy_result.gain (rggb):(2.316112,1.000000,1.000000,1.755642)
p:114:      prob_total(0.923094),prob_dis(0.216764),prob_LV(0.142857),prob_WPNO(0.923058)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(2.316112,1.755642) WPNo(11337)
p:132:      type1: gain (rg,bg):(2.316112,1.755642) WPNo(11337)
p:108: D75:
p:112:      stategy_result.gain (rggb):(2.388181,1.000000,1.000000,1.645277)
p:114:      prob_total(0.076906),prob_dis(0.216654),prob_LV(0.142857),prob_WPNO(0.076942)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(2.388181,1.645277) WPNo(945)
p:132:      type1: gain (rg,bg):(2.389237,1.646780) WPNo(994)
p:108: Hz:
```

<!-- Source EN PDF p.52, block 333 -->

Von stat type0: gain bis zum endgültigen processing awb_gain_algo werden folgende Schritte durchlaufen:

<!-- Source EN PDF p.52, block 334 -->

type0: gain ==> stategy_result.gain ==> wbGainType1+wbGainType3 ==> wbgain_s1 ==> wbgain_s3 (nach AwbGainClip) ==> wbgain_s4 (AwbGainAdjust, nach Farbtonanpassung) ==> wbgain_s5 (damp, nach Glättung) ==> processing awb_gain_algo

<!-- Source EN PDF p.52, block 335 -->

①

<!-- Source EN PDF p.52, block 336 -->

![Abbildung aus der englischen Quelle, PDF S. 52, Nr. 336](/docs/rockchip-isp30-color-optimization/assets/en-p52-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 52, Nr. 336.*

Abschrift des lesbaren Screenshot-Texts; abgeschnittene Quellbereiche werden nicht rekonstruiert:

```text
: Global
: CCT:4342.158203,CCRI:0.072367

: ill:A prob: 0.372926
: CCT:3058.074463,CCRI:0.034103

: ill:D50 prob: 0.369272
: CCT:5710.621582,CCRI:0.096392

: ill:TL84 prob: 0.233994
: CCT:4246.391602,CCRI:0.107421

: ill:CWF prob: 0.014538
: CCT:4403.761719,CCRI:-0.060823
```

<!-- Source EN PDF p.52, block 337 -->

Diese Angaben beschreiben ergänzend die Farbtemperatur der Szene. Global ist die zusammengefasste Farbtemperatur; ill führt Wahrscheinlichkeiten und Farbtemperaturen der ersten an der WBGain-Berechnung beteiligten Lichtquellen auf.

<!-- Source EN PDF p.52, block 338 -->

② temporalDefaultGain for wbGainType3 und weight bezeichnen temporalDefaultGain und dessen Gewicht innerhalb von wbGainType3.

<!-- Source EN PDF p.52, block 339 -->

③ wbGainTepType1 ist der durch WpType1 berechnete WBGain.

<!-- Source EN PDF p.53, block 340 -->

④ wbGainType3 ist der durch WpType3 berechnete WBGain; wbWeightType3 ist dessen Gewicht. Das Gewicht von WpType1 beträgt 1-wbWeightType3.

<!-- Source EN PDF p.53, block 341 -->

⑤ wbgain_s1 ist die gewichtete Kombination von wbGainTepType1 und wbGainType3; weight ist das Gewicht von wbGainType3.

<!-- Source EN PDF p.53, block 342 -->

⑥ stategy_result.gain ist der WBGain für die jeweilige Lichtquelle.

<!-- Source EN PDF p.53, block 343 -->

⑦ prob_total (0.372926), prob_dis (0.151197), prob_LV (0.142857) und prob_WPNO (0.383987) kennzeichnen Gesamt-, Abstands-, Helligkeits- und Weißpunktanzahl-Wahrscheinlichkeit jeder Lichtquelle.

<!-- Source EN PDF p.53, block 344 -->

⑧ spatial gain (rggb) :(1.745900, 1.000000, 1.000000, 1.824126) bezeichnet den dayGain (Strategie-WBGain) jeder Lichtquelle. statistics gain weigth (1.000000) gibt das Gewicht des aus statistischen Weißpunkten berechneten WBGain an. Das Gewicht des Strategie-WBGain beträgt entsprechend 1 - statistics gain weigth.

<!-- Source EN PDF p.53, block 345 -->

⑨ type0: gain (rg,bg):(1.287584,2.843158) WPNo(7707) sind Weißabgleich-Gain und Weißpunktanzahl des mittleren Fensters.

<!-- Source EN PDF p.53, block 346 -->

⑩ type1: gain (rg,bg):(1.291619,2.862351) WPNo(8557) sind Weißabgleich-Gain und Weißpunktanzahl des großen Fensters.

<!-- Source EN PDF p.53, block 347 -->

#### 2.4.1 Probleme anhand des Protokolls eingrenzen

<!-- Source EN PDF p.53, block 348 -->

① Ist WPNo klein, obwohl die Szene tatsächlich Weißpunkte enthält, müssen die Weißpunktbedingungen neu angepasst werden.

<!-- Source EN PDF p.53, block 349 -->

② Prüfen Sie, ob statistics gain weigth jeder Lichtquelle 1 beträgt und ob der Strategie-Gain Einfluss nimmt.

<!-- Source EN PDF p.53, block 350 -->

③ Prüfen Sie, ob wbWeightType3 gleich 1 ist:

<!-- Source EN PDF p.53, block 351 -->

Enthält die Szene tatsächlich wenige Weißpunkte, passt wbGainType3 jedoch möglicherweise besser zur tatsächlichen Farbtemperatur, müssen WP_THL und WP_THH so angepasst werden, dass die aktuelle Szene WpType3 zugeordnet wird.

<!-- Source EN PDF p.53, block 352 -->

In anderen Fällen orientieren Sie sich bei der Anpassung an den beiden vorherigen Punkten.

<!-- Source EN PDF p.53, block 353 -->

#### 2.4.2 RAW erfassen und simulieren

<!-- Source EN PDF p.53, block 354 -->

Wenn die Weißpunktbedingungen neu angepasst werden müssen oder das Protokoll keinen Fehler erkennen lässt, erfassen Sie eine RAW-Aufnahme für die Simulation der Weißpunkterkennung und prüfen Sie die Statistiken jeder Lichtquelle.

<!-- Source EN PDF p.53, block 355 -->

##### 2.4.2.1 (1) Beispiel 1

<!-- Source EN PDF p.53, block 356 -->

Rechts ist die problematische Szene dargestellt, links das Ergebnis nach erneuter Anpassung der Weißpunktbedingungen anhand der erfassten Aufnahme.

<!-- Source EN PDF p.54, block 357 -->

![Abbildung aus der englischen Quelle, PDF S. 54, Nr. 357](/docs/rockchip-isp30-color-optimization/assets/en-p54-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 54, Nr. 357.*

<!-- Source EN PDF p.54, block 358 -->

Vorgehen:

<!-- Source EN PDF p.54, block 359 -->

① Erfassen Sie Aufnahme 1.

<!-- Source EN PDF p.54, block 360 -->

② Öffnen Sie RKISPCalibrationTool und importieren Sie die JSON-Datei.

<!-- Source EN PDF p.54, block 361 -->

③ Um die Verteilung weißer und nichtweißer Farbfelder unter den zuvor verwendeten Standardlichtquellen als Referenz zu nutzen, importieren Sie mit Load Raw Files erneut alle Kalibrieraufnahmen. Schließen Sie die Farbfelderkennung mit FindChart ab. Klicken Sie nicht auf Calibrate, sondern auf Draw WPC From IQ Param, um die Weißpunktbedingungen zu importieren und die Farbfeldverteilung anzuzeigen.

<!-- Source EN PDF p.54, block 362 -->

![Abbildung aus der englischen Quelle, PDF S. 54, Nr. 362](/docs/rockchip-isp30-color-optimization/assets/en-p54-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 54, Nr. 362.*

<!-- Source EN PDF p.54, block 363 -->

④ Importieren Sie RAW-Aufnahme 1 über Load Image in der AWB-Simulationsansicht. Bild und Weißpunkterkennungsergebnis werden gleichzeitig aktualisiert, wie unten dargestellt.

<!-- Source EN PDF p.55, block 364 -->

![Abbildung aus der englischen Quelle, PDF S. 55, Nr. 364](/docs/rockchip-isp30-color-optimization/assets/en-p55-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 55, Nr. 364.*

<!-- Source EN PDF p.55, block 365 -->

Es werden nur wenige Weißpunkte erkannt; die Aufnahme ist tatsächlich dunkel. Die unten eingekreisten grauen Bereiche sollten ebenfalls als Weißpunkte erkannt werden.

<!-- Source EN PDF p.55, block 366 -->

![Abbildung aus der englischen Quelle, PDF S. 55, Nr. 366](/docs/rockchip-isp30-color-optimization/assets/en-p55-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 55, Nr. 366.*

<!-- Source EN PDF p.55, block 367 -->

⑤ Klicken Sie auf den grauen Bereich im Bild.

<!-- Source EN PDF p.55, block 368 -->

Prüfen Sie, ob die abgebildeten Punkte innerhalb der XY- und UV-Weißpunktbereiche liegen. Falls nicht, passen Sie die Bedingungen so an, dass sie darin liegen.

<!-- Source EN PDF p.55, block 369 -->

AWB Simulaton zeigt außerdem die R-, G-, B- und Y-Werte des Punkts. Vergleichen Sie diese mit limitRange in JSON. Liegen sie außerhalb, können Sie den Bereich angemessen erweitern. Besonders dunkle oder helle Punkte werden jedoch durch Rauschen oder Kanalsättigung beeinflusst, sodass RGain und BGain von den tatsächlichen Werten abweichen. Daher ist bei der Bereichswahl ein Kompromiss erforderlich.

<!-- Source EN PDF p.55, block 370 -->

Liegt der Punkt innerhalb von limitRange sowie den XY- und UV-Weißpunktbereichen, wird aber nicht als Weißpunkt erkannt, prüfen Sie den YUV-Schwellenwert TH. Der th-Wert des Punkts wird ebenfalls in AWB Simulaton angezeigt und kann als Referenz zur Anpassung von TH dienen.

<!-- Source EN PDF p.56, block 371 -->

⑥ Klicken Sie nach der Anpassung in der AWB-Ansicht auf Save und in der AWB-Simulationsansicht auf Run Simlation, um erneut zu simulieren.

<!-- Source EN PDF p.56, block 372 -->

Nach Änderung der XY- und UV-Weißpunktbereiche ergibt sich die folgende Erkennung, wodurch der fehlerhafte Weißabgleich behoben wird.

<!-- Source EN PDF p.56, block 373 -->

![Abbildung aus der englischen Quelle, PDF S. 56, Nr. 373](/docs/rockchip-isp30-color-optimization/assets/en-p56-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 56, Nr. 373.*

<!-- Source EN PDF p.56, block 374 -->

##### 2.4.2.2 (2) Beispiel 2: Aktualisierte Oberfläche des Simulationswerkzeugs

<!-- Source EN PDF p.56, block 375 -->

###### 2.4.2.2.1 a. RAW online beziehen (noch nicht unterstützt)

<!-- Source EN PDF p.56, block 376 -->

Nach Verbindung von Werkzeug und Board kann „Get online Image“ Online-Bilder abrufen und die Simulationsergebnisse automatisch aktualisieren. Gegenüber Beispiel 1 vereinfacht dies den Abstimmungsablauf. Weitere Schritte entsprechen ④, ⑤ und ⑥ aus Beispiel 1.

<!-- Source EN PDF p.57, block 377 -->

![Abbildung aus der englischen Quelle, PDF S. 57, Nr. 377](/docs/rockchip-isp30-color-optimization/assets/en-p57-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 57, Nr. 377.*

<!-- Source EN PDF p.57, block 378 -->

Hinweis: Die online erfasste Aufnahme wird im Stammverzeichnis des Werkzeugs mit der Endung .dat2 gespeichert, beispielsweise awbinput_rgb_w2880_h1616_ds1_fr1453492.dat2. Load Image unterstützt auch den Import dieses Formats.

<!-- Source EN PDF p.57, block 379 -->

###### 2.4.2.2.2 b. Punkte in mittleren, großen, zusätzlichen und ausgeschlossenen Fenstern anzeigen

<!-- Source EN PDF p.57, block 381 -->

Die entsprechenden Schaltflächen zeigen Weißpunkte im mittleren und großen Fenster sowie Punkte im zusätzlichen und ausgeschlossenen Fenster an. ! [image-20230201154517001] (Rockchip_color_optimization_guide_isp2x_pngimage-20230201154517001.png)

<!-- Source EN PDF p.57, block 382 -->

###### 2.4.2.2.3 c. Gesamt-WBGAIN berechnen

<!-- Source EN PDF p.57, block 383 -->

! [image-20230201155238824] (Rockchip_color_optimization_guide_isp2x_pngimage-20230201155238824.png)

<!-- Source EN PDF p.57, block 384 -->

Der endgültige WBGAIN wird durch Gewichtung der Weißpunkte jeder Lichtquelle berechnet. Er unterscheidet sich vom tatsächlichen Algorithmus, da dieser weitere Strategiebestandteile enthält. Im obigen Beispiel enthält das mittlere Fenster 38125 Weißpunkte bei WBGain (1.549, 1.665), das große Fenster 38742 Weißpunkte bei WBGain (1.548, 1.666).

<!-- Source EN PDF p.57, block 385 -->

Die roten Felder können bearbeitet werden, um die Gewichtung zu beeinflussen. Nach Änderung von WP Number wird prob rechts automatisch aktualisiert; auch die entsprechenden Werte in der Zeile Statistics ändern sich.

<!-- Source EN PDF p.57, block 386 -->

###### 2.4.2.2.4 d. Offline-Simulation von BLC-LSC-WB-CCM-GAMMA

<!-- Source EN PDF p.57, block 387 -->

Diese Funktion hilft, die Wirkung unterschiedlicher WBGains für die AWB-Abstimmung zu vergleichen. Ebenso können verschiedene LSC-Lichtquellen für die LSC-Abstimmung ausprobiert und RAW-Aufnahmen auf Auffälligkeiten geprüft werden.

<!-- Source EN PDF p.58, block 388 -->

![Abbildung aus der englischen Quelle, PDF S. 58, Nr. 388](/docs/rockchip-isp30-color-optimization/assets/en-p58-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 58, Nr. 388.*

<!-- Source EN PDF p.58, block 389 -->

Klicken Sie auf Run Simulator2, um das Ergebnis von blc-lsc-wb-ccm-gamma zu erhalten. Die verwendeten BLC-, LSC-, CCM- und Gamma-Daten stammen aus JSON und werden im Protokollfenster der Kalibrieransicht ausgegeben.

<!-- Source EN PDF p.59, block 390 -->

![Abbildung aus der englischen Quelle, PDF S. 59, Nr. 390](/docs/rockchip-isp30-color-optimization/assets/en-p59-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 59, Nr. 390.*

Abschrift des lesbaren Screenshot-Texts; abgeschnittene Quellbereiche werden nicht rekonstruiert:

```text
Width: 2560
Height: 1440
Bits: 10 bit
Bayer: BGGR
->Info: Load JsonIQ normal: day
->INFO: load
sc4336_OT01_40IRC_F16.json
successfully.
->INFO(AWB): init uv/xy wpc ok.
->INFO(AWB): use D65 CCM parameter.
->INFO(AWB): ccmMatrix:1.3683,-0.3732
,0.0049
->INFO(LSC): Raw Image loaded
successfully.
->Info: Load JsonIQ normal: day
->INFO: load
sc4336_OT01_40IRC_F16.json
successfully.
->INFO(AWB): init uv/xy wpc ok.
->INFO(AWB): use TL84 CCM parameter.
->INFO(AWB): ccmMatrix:1.2447,-0.2877
,0.0429
->INFO(AWB): Raw Image loaded
successfully.
->INFO(AWB): Load
rkisp_sc4336_D75_2560_1440_10bpp_1.80x
_0.0400s_normal_normL_single_104803899
.raw successfully
->INFO(AWB): BlcValue(12bit)= 254 ,254
,254 ,254
->INFO(AWB): D75 use D50 LSC
parameter.
->INFO(AWB): R:2246 ,1970 ,1760 ,1607
->INFO(AWB): Gr:2211 ,1901 ,1702 ,1578
->INFO(AWB): Gb:2264 ,1942 ,1757 ,1626
->INFO(AWB): B:2197 ,1979 ,1747 ,1625
->INFO(AWB): D75 use A CCM parameter.
->INFO(AWB): ccmMatrix:1.2380,-0.7220
,0.4840
```

<!-- Source EN PDF p.59, block 391 -->

Der angewendete WBGain stammt aus dem mittleren Fenster. Sie können ihn direkt bearbeiten und anschließend Run Simulator2 anklicken, um das Simulationsergebnis zu aktualisieren.

<!-- Source EN PDF p.59, block 392 -->

##### 2.4.2.3 (3) Beispiel 3: Schematische Anpassung von YUV TH

<!-- Source EN PDF p.59, block 393 -->

Prüfen Sie in diesem Beispiel mit folgenden Schritten, ob übersehene Weißpunkte durch eine ungeeignete yuv-th-Konfiguration verursacht werden:

<!-- Source EN PDF p.59, block 394 -->

a. Bestimmen Sie die aktuelle Lichtquelle anhand der XY- und UV-Bereiche, in denen der Punkt liegt.

<!-- Source EN PDF p.59, block 395 -->

b. Prüfen Sie in AWB Simulator, ob der Abstand in der Zeile dieser Lichtquelle größer als TH ist. Falls ja:

<!-- Source EN PDF p.60, block 396 -->

Ermitteln Sie, welchen Spalten der YUV-Bedingung der U-Wert entspricht, und erhöhen Sie die th-Werte dieser Spalten.

<!-- Source EN PDF p.60, block 397 -->

Konkretes Vorgehen:

<!-- Source EN PDF p.60, block 398 -->

Wie unten dargestellt, wird das 22. Feld der Farbtafel nicht vollständig als weiß erkannt. Die Analyse zeigt für D65 einen Abstand größer als th: 0.3125>0.1875.

<!-- Source EN PDF p.60, block 399 -->

![Abbildung aus der englischen Quelle, PDF S. 60, Nr. 399](/docs/rockchip-isp30-color-optimization/assets/en-p60-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 60, Nr. 399.*

<!-- Source EN PDF p.60, block 400 -->

Unter D65 wird der Punkt auf u = 60 abgebildet und liegt damit zwischen u1(54) und u2(70). Die entsprechenden Schwellen th1 und th2 können wie unten angepasst werden. Das Weißpunkterkennungsergebnis zeigt die Wirkung der Änderung.

<!-- Source EN PDF p.60, block 401 -->

![Abbildung aus der englischen Quelle, PDF S. 60, Nr. 401](/docs/rockchip-isp30-color-optimization/assets/en-p60-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 60, Nr. 401.*

<!-- Source EN PDF p.60, block 402 -->

Hinweis:

<!-- Source EN PDF p.60, block 403 -->

Beim Ausschließen von Nicht-Weißpunkten über yuv th ist das Vorgehen ähnlich, allerdings wird die Schwelle verringert. Stellen Sie dabei sicher, dass echte Weißpunkte weiterhin erkannt werden.

<!-- Source EN PDF p.60, block 404 -->

#### 2.4.3 Beispiele besonderer Probleme

<!-- Source EN PDF p.60, block 405 -->

(1) In der Webcam-Anwendung wurde der Weißabgleich auf Tageslichtmodus gestellt, sodass der automatische Weißabgleich nicht aktiviert war.

<!-- Source EN PDF p.60, block 406 -->

Im Protokoll zeigt sich laut diesem Quellbeispiel mode=1 als manueller Modus.

<!-- Source EN PDF p.60, block 407 -->

![Abbildung aus der englischen Quelle, PDF S. 60, Nr. 407](/docs/rockchip-isp30-color-optimization/assets/en-p60-figure3.png)

*Abbildung aus der englischen Quelle, PDF S. 60, Nr. 407.*

Abschrift des lesbaren Screenshot-Texts; abgeschnittene Quellbereiche werden nicht rekonstruiert:

```text
[09:51:39.57935][AWB]:XCAM DEBUG rk_aiq_awb_algo_v200.cpp:2795: AwbReConfigV200: byPass: 0  mode:1
```

<!-- Source EN PDF p.60, block 408 -->

Eine Änderung des Weißabgleichmodus behebt das Problem.

<!-- Source EN PDF p.61, block 409 -->

(2) Bei der Kalibrierung waren die Weißpunkte unter HZ und A nicht konzentriert verteilt.

<!-- Source EN PDF p.61, block 410 -->

![Abbildung aus der englischen Quelle, PDF S. 61, Nr. 410](/docs/rockchip-isp30-color-optimization/assets/en-p61-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 61, Nr. 410.*

<!-- Source EN PDF p.61, block 411 -->

Das tatsächliche Ergebnis zeigt einen fehlerhaften Weißabgleich:

<!-- Source EN PDF p.61, block 412 -->

![Abbildung aus der englischen Quelle, PDF S. 61, Nr. 412](/docs/rockchip-isp30-color-optimization/assets/en-p61-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 61, Nr. 412.*

<!-- Source EN PDF p.61, block 413 -->

Spätere Tests ergaben, dass ein ungeeigneter Infrarotfilter das nahe Infrarot nicht ausreichend sperrte. Der Austausch des Filters löste das Problem.

<!-- Source EN PDF p.61, block 414 -->

(3) Die geschätzte Lichtquelle des CC-Moduls wechselte ständig hin und her und verursachte entsprechende Farbschwankungen.

<!-- Source EN PDF p.61, block 415 -->

![Abbildung aus der englischen Quelle, PDF S. 61, Nr. 415](/docs/rockchip-isp30-color-optimization/assets/en-p61-figure3.png)

*Abbildung aus der englischen Quelle, PDF S. 61, Nr. 415.*

Abschrift des lesbaren Screenshot-Texts; abgeschnittene Quellbereiche werden nicht rekonstruiert:

```text
Find result - 143 hits
Line 5698: [00:02:57.712232][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50(2)
Line 5699: [00:02:57.712232][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50(2)
Line 5809: [00:02:57.811349][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50(2)
Line 5810: [00:02:57.811349][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50(2)
Line 5920: [00:02:58.561261][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50(2)
Line 5921: [00:02:58.561261][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50(2)
Line 6031: [00:02:58.155059][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50(2)
Line 6032: [00:02:58.155059][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50(2)
Line 6142: [00:02:58.366345][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6143: [00:02:58.366345][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6253: [00:02:58.465620][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6254: [00:02:58.465620][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6364: [00:02:58.577856][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6365: [00:02:58.577856][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6475: [00:02:58.776105][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.275650,0.975244, estimation illuminant is D65(3)
Line 6476: [00:02:58.776105][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.275650,0.975244, estimation illuminant is D65(3)
Line 6586: [00:02:58.987769][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65(3)
Line 6587: [00:02:58.987769][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65(3)
Line 6697: [00:02:59.85831][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65(3)
Line 6698: [00:02:59.85831][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65(3)
Line 6808: [00:02:59.296966][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 6809: [00:02:59.296966][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 6919: [00:02:59.409406][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 6920: [00:02:59.409406][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 7030: [00:02:59.522048][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 7031: [00:02:59.522048][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 7141: [00:02:59.719781][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.285019,0.966382, estimation illuminant is D65(3)
Line 7142: [00:02:59.719781][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.285019,0.966382, estimation illuminant is D65(3)
Line 7252: [00:02:59.945211][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.287606,0.963857, estimation illuminant is D65(3)
Line 7253: [00:02:59.945211][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.287606,0.963857, estimation illuminant is D65(3)
```

<!-- Source EN PDF p.61, block 416 -->

Erhöhen Sie value im JSON-Knoten tolerance. Dann wird WBGain bei Änderungen unterhalb dieser Schwelle nicht aktualisiert, wodurch die Stabilität verbessert wird. In diesem Beispiel wird der XML-Parameter wie folgt geändert:

<!-- Source EN PDF p.62, block 417 -->

```text
<tolerance index="1" type="struct" size="[1 1]">
    <LV index="1" type="double" size="[1 4]">
        [0 64 128 256.0000 ]
    </LV>
    <value index="1" type="double" size="[1 4]">
        [0.05 0.05 0.05 0.05 ]
    </value>
</tolerance>
```

<!-- Source EN PDF p.62, block 418 -->

## 3 Grundlegende Farbanpassung mit CCM

<!-- Source EN PDF p.62, block 419 -->

### 3.1 Funktionsbeschreibung

<!-- Source EN PDF p.62, block 420 -->

Die spektrale Empfindlichkeit eines Sensors lässt sich nur schwer exakt an die menschliche Sehantwort anpassen. Eine Farbkorrekturmatrix (CCM) korrigiert daher Übersprechen und Antwortstärke der Spektralkanäle, damit die vom Frontend erfassten Farben der menschlichen Wahrnehmung entsprechen.

<!-- Source EN PDF p.62, block 421 -->

Das CCM-Kalibrierwerkzeug unterstützt die Vorkalibrierung einer 3x3-CCM (aij) mit einer 24-Felder-Farbtafel.

<!-- Source EN PDF p.62, block 422 -->

![Abbildung aus der englischen Quelle, PDF S. 62, Nr. 422](/docs/rockchip-isp30-color-optimization/assets/en-p62-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 62, Nr. 422.*

```text
[R_CC, G_CC, B_CC]^T = [[a11,a12,a13],[a21,a22,a23],[a31,a32,a33]] * [R_camera,G_camera,B_camera]^T
```

<!-- Source EN PDF p.62, block 423 -->

Mehrere CCM-Gruppen für unterschiedliche Farbtemperaturen werden unterstützt. Während des ISP-Betriebs können globale oder lokale Sättigung anhand der in den IQ-Parametern konfigurierten Gain-Stützstellen angepasst werden, wodurch sich die CCM-Matrixkoeffizienten dynamisch ändern.

<!-- Source EN PDF p.62, block 424 -->

![Abbildung aus der englischen Quelle, PDF S. 62, Nr. 424](/docs/rockchip-isp30-color-optimization/assets/en-p62-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 62, Nr. 424.*

```text
[R_CC,G_CC,B_CC]^T = alpha * scale * [[a11-1,a12,a13],[a21,a22-1,a23],[a31,a32,a33-1]] * [R_camera,G_camera,B_camera]^T + [R_camera,G_camera,B_camera]^T
```

<!-- Source EN PDF p.62, block 425 -->

### 3.2 Wichtige Parameter

<!-- Source EN PDF p.62, block 426 -->

Die ISP-Parameter befinden sich im Knoten ccm_calib der IQ-JSON-Datei. Diese JSON-Parameter wirken nur im automatischen Modus.

<!-- Source EN PDF p.62, block 427 -->

#### 3.2.1 Aktivierung und Modusauswahl

<!-- Source EN PDF p.62, block 428 -->

Im Knoten control:

<!-- Source EN PDF p.63, block 429 -->

| Parameter | Beschreibung |
|---|---|
| enable | Farbkorrekturschalter: 1 aktiviert; Wertebereich 0 oder 1 |
| wbgain_tolerance | Toleranz für Änderungen des Weißabgleich-Gains bei der Farbkorrektur. Liegt die Differenz der statistischen Gains unter dieser Schwelle, gilt die Stabilitätsbedingung als erfüllt. Wertebereich 0.0-1; empfohlen 0.3. |
| gain_tolerance | Toleranz für Änderungen des Belichtungs-Gains bei der Farbkorrektur. Liegt die Differenz der statistischen Gains unter dieser Schwelle, gilt die Stabilitätsbedingung als erfüllt. Wertebereich 0.0-1; empfohlen 0.5. |

<!-- Source EN PDF p.63, block 430 -->

#### 3.2.2 Helligkeitsabhängige Sättigungsanpassung

<!-- Source EN PDF p.63, block 431 -->

Im Knoten lumaCCM:

<!-- Source EN PDF p.63, block 432 -->

##### 3.2.2.1 Pixelhelligkeitsabhängige Sättigungsanpassung

<!-- Source EN PDF p.63, block 433 -->

Für Pixel innerhalb des angegebenen Y-Bereichs kann die Farbkorrekturstärke angepasst werden.

<!-- Source EN PDF p.63, block 434 -->

| Parameter | Beschreibung |
|---|---|
| RGB2Y_para | Koeffizienten zur Berechnung von Y aus RGB, 7-Bit-Festkommawerte; ganzzahlig im Bereich [0,128], anpassbar |
| low_bound_pos_bit | Helligkeitsschwelle der Kennlinie zwischen Pixelhelligkeit Y und Farbkorrekturstärke CC; ganzzahlig im Bereich [0,10] |
| y_alpha_curve | Farbkorrekturstärke alpha in Abhängigkeit von der Pixelhelligkeit Y. 1024 bedeutet einfache Stärke, 0 keine Korrektur. Ganzzahlig im Bereich [0, 1024]. |

<!-- Source EN PDF p.63, block 435 -->

![Abbildung aus der englischen Quelle, PDF S. 63, Nr. 435](/docs/rockchip-isp30-color-optimization/assets/en-p63-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 63, Nr. 435.*

<!-- Source EN PDF p.64, block 436 -->

Abbildung: Y-CcAlpha

<!-- Source EN PDF p.64, block 437 -->

##### 3.2.2.2 Globale Sättigungsanpassung

<!-- Source EN PDF p.64, block 438 -->

Im Knoten gain_alphaScale_curve:

<!-- Source EN PDF p.64, block 439 -->

Unterschiedliche Belichtungs-Gains entsprechen unterschiedlichen Skalierungen der Korrekturstärke, konfiguriert durch die Parameter unter gain_alphaScale_curve.

<!-- Source EN PDF p.64, block 440 -->

| Parameter | Beschreibung |
|---|---|
| gain | Belichtungs-Gain-Komponente der Gain-Skalierungs-Kurve; Dezimalwert größer als 0 |
| scale | Korrekturstärke-Komponente der Gain-Skalierungs-Kurve; Dezimalwert im Bereich [0,1] |

<!-- Source EN PDF p.64, block 441 -->

#### 3.2.3 Parameter der automatischen CCM

<!-- Source EN PDF p.64, block 442 -->

Im Knoten TuningPara:

<!-- Source EN PDF p.64, block 443 -->

| Parameter | Beschreibung |
|---|---|
| damp_enable | Schalter für die Glättung der Farbkorrekturmatrix; 1 aktiviert die Funktion, Wertebereich 0 oder 1 |

<!-- Source EN PDF p.64, block 444 -->

##### 3.2.3.1 Auswahl der CCM-Matrixberechnung

<!-- Source EN PDF p.64, block 445 -->

Das CCM-Modul bietet zwei Berechnungsmethoden: (1) Auswahl der CCM-Parameter jener Lichtquelle, deren Standard-Weißabgleich-Gain den kleinsten euklidischen Abstand zum statistischen Gain aufweist; (2) gewichtete Berechnung der CCM-Matrix mit den Abstandswahrscheinlichkeiten zwischen den Standard-Gains jeder Lichtquelle und dem statistischen Gain. Die Abstandswahrscheinlichkeit prob jeder Lichtquelle wird wie folgt berechnet:

![Vektorgleichungen der Abstandswahrscheinlichkeit aus der Quelle](/docs/rockchip-isp30-color-optimization/assets/en-p64-vector-formulas.png)

```text
dist = sqrt((Rgain-awbGain[0])^2 * wr + (Bgain-awbGain[1])^2 * wb)
prob = exp(-dist^2 / sigma^2)
```

<!-- Source EN PDF p.64, block 446 -->

Dabei sind $$Rgain, Bgain$$ die statistischen Weißabgleich-Gains, $$awbGain$$ die Standard-Gains jeder Lichtquelle, $$wr, wb$$ die Gewichte der Kanäle $$R, B$$ und $$sigma$$ die Standardabweichung von $$dist$$ über alle Lichtquellen.

<!-- Source EN PDF p.64, block 447 -->

Im Knoten illu_estim:

<!-- Source EN PDF p.64, block 448 -->

| Parameter | Beschreibung |
|---|---|
| interp_enable | Aktiviert die gewichtete CCM-Berechnung; 1 aktiviert, Wertebereich 0 oder 1 |

<!-- Source EN PDF p.65, block 449 -->

##### 3.2.3.2 Gewichtete CCM-Matrixberechnung

<!-- Source EN PDF p.65, block 450 -->

Im Knoten illu_estim:

<!-- Source EN PDF p.65, block 451 -->

| Parameter | Beschreibung |
|---|---|
| default_illu | Name der Standardlichtquelle. Bei gleichen Abstandswahrscheinlichkeiten aller Lichtquellen werden deren CCM-Parameter verwendet. |
| weightRB | Verwendetes Kanalgewicht für R(G)gain |
| prob_limit | Untere Grenze der Abstandswahrscheinlichkeit. Lichtquellen unterhalb dieses Werts nehmen nicht an der CCM-Matrixberechnung teil. |
| frame_no | Anzahl der Glättungsframes. Für die gewichtete CCM-Matrixberechnung wird die über frame_no Frames gemittelte Abstandswahrscheinlichkeit verwendet. |

<!-- Source EN PDF p.65, block 452 -->

##### 3.2.3.3 Steuerparameter der CCM-Auswahl

<!-- Source EN PDF p.65, block 453 -->

Die Parameter der passenden Lichtquelle werden anhand des Weißabgleich-Gains automatisch ausgewählt. Für eine Lichtquelle können CCMs mit unterschiedlicher Sättigung sat für verschiedene Belichtungs-Gains gain konfiguriert werden.

<!-- Source EN PDF p.65, block 454 -->

Im Knoten aCcmCof:

<!-- Source EN PDF p.65, block 455 -->

| Parameter | Beschreibung |
|---|---|
| name | Name der Lichtquelle |
| awbGain | Standard-Weißabgleich-Gain der Lichtquelle; vom Kalibrierwerkzeug erzeugt, Wert größer als 0 |
| minDist | Abstandsschwelle des Weißabgleich-Gains für die Lichtquelle; vom Kalibrierwerkzeug erzeugt und zur Abstandswahrscheinlichkeitsberechnung verwendet. Bei dist unterhalb dieses Werts wird prob der Lichtquelle auf 1 gesetzt. |
| matrixUsed | Verwendete CCM |
| gains | Belichtungs-Gain-Komponente der gains-sat-Kurve; Dezimalwert größer als 0 |
| sat | Sättigungskomponente der gains-sat-Kurve; Dezimalwert größer als 0 |

<!-- Source EN PDF p.66, block 456 -->

##### 3.2.3.4 CCM-Parameter

<!-- Source EN PDF p.66, block 457 -->

| Parameter | Beschreibung |
|---|---|
| Name | CCM-Name |
| illumination | Name der Lichtquelle |
| saturation | Zugehörige Sättigung; vom Kalibrierwerkzeug erzeugt, Wert größer oder gleich 0 |
| ccMatrix | Farbkorrekturmatrix; vom Kalibrierwerkzeug erzeugt, Dezimalwerte im Bereich [-8, 7.992] |
| ccOffsets | Offsets der RGB-Komponenten; vom Kalibrierwerkzeug erzeugt, Wertebereich [-4096, 4095] |

<!-- Source EN PDF p.66, block 458 -->

### 3.3 CCM-Kalibrierung

<!-- Source EN PDF p.66, block 459 -->

Führen Sie die CCM-Kalibrierung gemäß Rockchip_IQ_Tools_Guide_ISP2x_CN aus.

<!-- Source EN PDF p.66, block 460 -->

#### 3.3.1 RAW-Datenerfassung

<!-- Source EN PDF p.66, block 461 -->

##### 3.3.1.1 Auswahl der Kalibrierlichtquellen

<!-- Source EN PDF p.66, block 462 -->

Sieben Lichtquellen unterschiedlicher Farbtemperatur: D50, D65, D75, A, CWF, HZ und TL84.

<!-- Source EN PDF p.66, block 463 -->

##### 3.3.1.2 Aufnahmeschritte

<!-- Source EN PDF p.66, block 464 -->

Schritt 1. Platzieren Sie die Farbtafel mittig an der Rückwand des Lichtkastens und stellen Sie eine gleichmäßige Ausleuchtung von links und rechts sicher. Bei hohen Farbanforderungen können zusätzliche relevante Farbmuster, beispielsweise Hautfarbkarten, daneben platziert werden, um die Wirkung zu prüfen.

<!-- Source EN PDF p.66, block 465 -->

Schritt 2. Stellen Sie die Belichtung so ein, dass nach Anwendung von Gamma kein Farbfeld überbelichtet ist. Automatische Belichtung wird empfohlen.

<!-- Source EN PDF p.66, block 466 -->

Schritt 3. Passen Sie den Aufnahmeabstand so an, dass die Farbtafel 1/9 des Bildes einnimmt.

<!-- Source EN PDF p.66, block 467 -->

#### 3.3.2 Kalibrierung

<!-- Source EN PDF p.66, block 468 -->

##### 3.3.2.1 Schritte

<!-- Source EN PDF p.66, block 469 -->

Schritt 1. Zum Import der RAW-Daten und zur Auswahl der 24 Farbfelder siehe Abschnitt 4.5 „CCM Calibration“ in Rockchip_IQ_Tools_Guide_ISP2x_CN.

<!-- Source EN PDF p.66, block 470 -->

Schritt 2. Konfigurieren Sie die Kalibrierparameter.

<!-- Source EN PDF p.66, block 471 -->

(1) Gamma einstellen: Wählen Sie die von der Kamera verwendete Gammakurve. Unterstützt werden Normal-, HDR- und Nachtmodus sowie benutzerdefinierte Kurven.

<!-- Source EN PDF p.67, block 472 -->

(2) Feldgewichte einstellen: Konfigurieren Sie die Gewichte in der 6x4-Tabelle. Die Tabellenpositionen entsprechen den Farbfeldern.

<!-- Source EN PDF p.67, block 473 -->

(3) Klicken Sie auf „Calibrate“, um die CCM zu erzeugen. Passen Sie bei Bedarf Saturation auf der Seite Calibration manuell an, bis das korrigierte Bild oder das Farbdifferenzdiagramm unter Result den Anforderungen entspricht.

<!-- Source EN PDF p.67, block 474 -->

##### 3.3.2.2 Einführung in Farbdifferenzdiagramme

<!-- Source EN PDF p.67, block 475 -->

Anhand von Richtung und Größe der Abweichung gegenüber den Standardfarbfeldern wird analysiert, welche Komponente auffällig ist:

<!-- Source EN PDF p.67, block 476 -->

(1) Liegt das Kamerafarbfeld weiter vom Ursprung entfernt als das ideale Farbfeld, ist die Kamerasättigung höher als die ideale Sättigung.

<!-- Source EN PDF p.67, block 477 -->

(2) Liegt das Kamerafarbfeld näher am Ursprung als das ideale Farbfeld, ist die Kamerasättigung niedriger.

<!-- Source EN PDF p.67, block 478 -->

Beispielbild:

<!-- Source EN PDF p.67, block 479 -->

![Abbildung aus der englischen Quelle, PDF S. 67, Nr. 479](/docs/rockchip-isp30-color-optimization/assets/en-p67-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 67, Nr. 479.*

<!-- Source EN PDF p.67, block 480 -->

Bei Feld 15 (Rot) und Feld 14 (Grün) ist die Kamerasättigung geringer als IDEA, die Abweichung ist jedoch relativ klein.

<!-- Source EN PDF p.67, block 481 -->

Feld 13 (Blau) ist in Richtung Violett verschoben. Da auch das menschliche Auge dieses Feld möglicherweise violett wahrnimmt, ist diese Abweichung akzeptabel.

<!-- Source EN PDF p.67, block 482 -->

Im Allgemeinen sollten die Felder 13–15 keine großen Abweichungen aufweisen. Sie repräsentieren näherungsweise die drei Grundfarben, aus denen andere Farben zusammengesetzt werden können.

<!-- Source EN PDF p.67, block 483 -->

Bei Farbstichen der Felder 13–15 oder anderer besonders wichtiger Felder können deren Gewichte erhöht werden. Beachten Sie dabei die Auswirkungen auf die übrigen Felder.

<!-- Source EN PDF p.68, block 484 -->

##### 3.3.2.3 Hinweise

<!-- Source EN PDF p.68, block 485 -->

(1) Stellen Sie bei der Erkennung der 24 Farbfelder sicher, dass deren schwarze Ränder nicht ausgewählt werden.

<!-- Source EN PDF p.68, block 486 -->

(2) Nach Änderung der Gammakurve kann eine erneute CCM-Kalibrierung erforderlich sein. Stellen Sie daher möglichst zuerst Gamma ein.

<!-- Source EN PDF p.68, block 487 -->

(3) Ungeeignete Helligkeit der Kalibrieraufnahme beeinflusst die Sättigungseigenschaften der CCM: Zu helle RAW-Aufnahmen ergeben eine niedrigere, zu dunkle eine höhere CCM-Sättigung.

<!-- Source EN PDF p.68, block 488 -->

(4) Die folgenden objektiven Kennzahlen werden empfohlen, können aber je nach Projekt variieren. Sie sollten nicht das alleinige Optimierungsziel sein.

<!-- Source EN PDF p.68, block 489 -->

![Abbildung aus der englischen Quelle, PDF S. 68, Nr. 489](/docs/rockchip-isp30-color-optimization/assets/en-p68-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 68, Nr. 489.*

| Quelle / Anwendung | Kennzahl | Empfehlung der Quelle |
|---|---|---|
| D65 (außen) | Farbsättigung | 110-120% |
| D65 (außen) | Mittelwert(ΔC) | &lt;10 |
| D65 (außen) | Maximum(ΔC) | &lt;20 |
| D65 (außen) | Mittelwert(ΔE) | &lt;15 |
| TL84 (nur innen) | Farbsättigung | 110-120% |
| TL84 (nur innen) | Mittelwert(ΔC) | &lt;10 |
| TL84 (nur innen) | Maximum(ΔC) | &lt;20 |
| TL84 (nur innen) | Mittelwert(ΔE) | &lt;12 |
| Coolwhite (nur innen) | Farbsättigung | 110-125% |
| Coolwhite (nur innen) | Mittelwert(ΔC) | &lt;10 |
| Coolwhite (nur innen) | Maximum(ΔC) | &lt;20 |
| Coolwhite (nur innen) | Mittelwert(ΔE) | &lt;12 |
| A (nur innen) | Farbsättigung | 110-120% |
| A (nur innen) | Mittelwert(ΔC) | &lt;10 |
| A (nur innen) | Maximum(ΔC) | &lt;22 |
| A (nur innen) | Mittelwert(ΔE) | &lt;12 |

<!-- Source EN PDF p.68, block 490 -->

### 3.4 Farbanpassung

<!-- Source EN PDF p.68, block 491 -->

#### 3.4.1 Anpassung der gesamten Farbsättigung

<!-- Source EN PDF p.68, block 492 -->

##### 3.4.1.1 Parameter von gain_alphaScale_curve anpassen

<!-- Source EN PDF p.68, block 493 -->

scale kann im Bereich [0, 1.0] angepasst werden und beeinflusst die endgültige Farbkorrekturstärke. Ein kleinerer Wert verringert, ein größerer erhöht die Farbsättigung.

<!-- Source EN PDF p.68, block 494 -->

##### 3.4.1.2 gains-sat anpassen

<!-- Source EN PDF p.68, block 495 -->

Ein kleinerer sat-Wert verringert, ein größerer erhöht die Farbsättigung. Für unterschiedliche Lichtquellen können unterschiedliche Parameter eingestellt werden.

<!-- Source EN PDF p.68, block 496 -->

##### 3.4.1.3 CCM mit höherer Sättigung ergänzen

<!-- Source EN PDF p.68, block 497 -->

Reicht die Sättigung trotz maximaler Einstellung der beiden vorherigen Optionen nicht aus, muss eine CCM mit höherer Sättigung neu kalibriert werden. Der maximale sat-Wert in gains-sat ist anschließend auf diese erhöhte Sättigung anzupassen.

<!-- Source EN PDF p.69, block 498 -->

##### 3.4.1.4 Farbsättigung dunkler Pixel reduzieren

<!-- Source EN PDF p.69, block 499 -->

Verringern Sie Werte in y_alpha_curve, um die Farbsättigung dunkler Pixel zu reduzieren. Der letzte Wert muss 1024 bleiben, da sonst auch die Sättigung anderer Helligkeitsbereiche beeinflusst wird.

<!-- Source EN PDF p.69, block 500 -->

#### 3.4.2 Anpassung einzelner Farben

<!-- Source EN PDF p.69, block 501 -->

Entspricht die Farbdarstellung nach der globalen Sättigungsanpassung weiterhin nicht den Erwartungen, gehen Sie wie folgt vor:

<!-- Source EN PDF p.69, block 502 -->

(1) Soll die Farbe der menschlichen Wahrnehmung entsprechen, prüfen Sie zunächst den korrekten Weißabgleich.

<!-- Source EN PDF p.69, block 503 -->

(2) Soll die Farbe einer Vergleichskamera entsprechen, prüfen Sie die Übereinstimmung des Weißabgleichs.

<!-- Source EN PDF p.69, block 504 -->

(3) Prüfen Sie beim Abgleich mit einer Vergleichskamera außerdem, ob die Helligkeit ähnlich ist.

<!-- Source EN PDF p.69, block 505 -->

(4) Erst wenn der Weißabgleich korrekt bzw. konsistent und die Helligkeit ähnlich ist, die Farben aber weiterhin abweichen, passen Sie die CCM-Parameter an.

<!-- Source EN PDF p.69, block 506 -->

##### 3.4.2.1 Korrekten Weißabgleich überprüfen

<!-- Source EN PDF p.69, block 507 -->

Entscheidend ist, ob weiße Objekte einen Farbstich aufweisen.

<!-- Source EN PDF p.69, block 508 -->

Vorgehen:

<!-- Source EN PDF p.69, block 509 -->

Prüfen Sie visuell, ob weiße Objekte im Video tatsächlich weiß erscheinen.

<!-- Source EN PDF p.69, block 510 -->

Erfassen Sie ein Bild und prüfen Sie, ob sich die R-/G-/B-Komponenten weißer Flächen deutlich unterscheiden.

<!-- Source EN PDF p.69, block 511 -->

##### 3.4.2.2 Weißabgleich mit der Vergleichskamera abgleichen

<!-- Source EN PDF p.69, block 512 -->

(1) Ist der Weißabgleich der Vergleichskamera korrekt, während weiße RK-Objekte einen deutlichen Farbstich zeigen, korrigieren Sie zunächst den RK-Weißabgleich über das Weißabgleichmodul.

<!-- Source EN PDF p.69, block 513 -->

(2) Zeigt die Vergleichskamera einen deutlichen Farbstich, während RK weitgehend korrekt ist, unterscheiden Sie zwischen einem Algorithmusfehler und einer anderen Farbtonpräferenz. Bei unterschiedlicher Präferenz können Sie zuerst den Farbton über das Weißabgleichmodul angleichen oder das Vergleichsbild mit Werkzeugen wie FastStone an RK anpassen. Bei einem Algorithmusfehler der Vergleichskamera erhöhen Sie die Weißpunktanzahl in der Szene und nehmen erneut auf; alternativ gleichen Sie deren Farbton ebenfalls mit einem Werkzeug wie FastStone an RK an.

<!-- Source EN PDF p.69, block 514 -->

(3) So unterscheiden Sie, ob ein deutlicher Farbstich weißer Objekte durch einen Weißabgleichfehler oder eine andere Farbpräferenz der Vergleichskamera entsteht:

<!-- Source EN PDF p.69, block 515 -->

a. Enthält die Szene ausschließlich weiße Objekte bei geeigneter Helligkeit und bleibt der Farbstich bestehen, wurde wahrscheinlich eine Farbtonanpassung vorgenommen.

<!-- Source EN PDF p.69, block 516 -->

b. Andernfalls liegt die Ursache im Algorithmus der Vergleichskamera.

<!-- Source EN PDF p.70, block 517 -->

##### 3.4.2.3 Helligkeit an die Vergleichskamera anpassen

<!-- Source EN PDF p.70, block 518 -->

(1) Passen Sie helligkeitsbezogene Module wie AE, Gamma, Dehaze und HDR an, bis die Helligkeit ähnlich ist. Eine gewisse Differenz ist zulässig.

<!-- Source EN PDF p.70, block 519 -->

(2) Alternativ passen Sie das Vergleichsbild mit Werkzeugen wie FastStone an die RK-Helligkeit an.

<!-- Source EN PDF p.70, block 520 -->

#### 3.4.3 CCM anpassen

<!-- Source EN PDF p.70, block 521 -->

##### 3.4.3.1 CCM mit dem Werkzeug neu kalibrieren

<!-- Source EN PDF p.70, block 522 -->

Wählen Sie das Feld der 24-Felder-Farbtafel, das der gewünschten Farbe am nächsten kommt, erhöhen Sie dessen Gewicht und kalibrieren Sie die CCM erneut.

<!-- Source EN PDF p.70, block 523 -->

Beispiel:

<!-- Source EN PDF p.70, block 524 -->

Im linken Farbdifferenzdiagramm weichen die Felder 6 und 18 relativ stark ab. Setzen Sie deshalb die Gewichte der neutralen Felder 19–24 auf 0, das Gewicht von Feld 6 auf 16 und das von Feld 18 auf 8. Um Auswirkungen auf andere Farben zu begrenzen, setzen Sie außerdem die Gewichte der Grundfarbfelder 13–15 sowie des Hautfarbfelds 2 auf 8. Das Ergebnis rechts zeigt geringere Farbstiche der Felder 6 und 18.

<!-- Source EN PDF p.70, block 526 -->

![Abbildung aus der englischen Quelle, PDF S. 70, Nr. 526](/docs/rockchip-isp30-color-optimization/assets/en-p70-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 70, Nr. 526.*

<!-- Source EN PDF p.70, block 527 -->

![Abbildung aus der englischen Quelle, PDF S. 70, Nr. 527](/docs/rockchip-isp30-color-optimization/assets/en-p70-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 70, Nr. 527.*

<!-- Source EN PDF p.70, block 528 -->

##### 3.4.3.2 CCM manuell anpassen

<!-- Source EN PDF p.70, block 529 -->

###### 3.4.3.2.1 RK-RGB-Werte erfassen

<!-- Source EN PDF p.70, block 530 -->

Erfassen Sie ein Bild mit dem RK-Gerät und bestimmen Sie dessen RGB-Werte.

<!-- Source EN PDF p.70, block 531 -->

###### 3.4.3.2.2 RGB-Zielwerte bestimmen

<!-- Source EN PDF p.70, block 532 -->

(1) Mit Vergleichskamera:

<!-- Source EN PDF p.70, block 533 -->

Erfassen Sie ein Vergleichsbild und bestimmen Sie die Zielwerte. Helligkeit und Weißabgleich müssen dabei nahe an denen von RK liegen.

<!-- Source EN PDF p.71, block 534 -->

(2) Ohne Vergleichskamera:

<!-- Source EN PDF p.71, block 535 -->

Verändern Sie die betreffende Farbe einer RK-Aufnahme mit Werkzeugen wie FastStone, bis sie der gewünschten Darstellung entspricht.

<!-- Source EN PDF p.71, block 536 -->

![Abbildung aus der englischen Quelle, PDF S. 71, Nr. 536](/docs/rockchip-isp30-color-optimization/assets/en-p71-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 71, Nr. 536.*

<!-- Source EN PDF p.71, block 537 -->

![Abbildung aus der englischen Quelle, PDF S. 71, Nr. 537](/docs/rockchip-isp30-color-optimization/assets/en-p71-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 71, Nr. 537.*

<!-- Source EN PDF p.71, block 538 -->

Beispiel: Passen Sie die B-Komponente als Zielwert an. Verringern Sie den B-Kanal in FastStone um 17; das Grün rechts unten entspricht der gewünschten Farbe.

<!-- Source EN PDF p.71, block 539 -->

![Abbildung aus der englischen Quelle, PDF S. 71, Nr. 539](/docs/rockchip-isp30-color-optimization/assets/en-p71-figure3.png)

*Abbildung aus der englischen Quelle, PDF S. 71, Nr. 539.*

<!-- Source EN PDF p.71, block 540 -->

Das RK-Grün hat hier RGB 64 85 90, das Ziel RGB 65 86 69. Die CCM muss daher so angepasst werden, dass die B-Komponente kleiner wird; anschließend nähern sich die beiden Grüntöne an.

<!-- Source EN PDF p.71, block 541 -->

(3) Zielwerte der 24-Felder-Farbtafel für die menschliche Wahrnehmung:

<!-- Source EN PDF p.72, block 542 -->

![Abbildung aus der englischen Quelle, PDF S. 72, Nr. 542](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 72, Nr. 542.*

| Nr. | Farbfeld | sRGB R | G | B | CIE L* | a* | b* | Munsell-Farbton | Helligkeit / Chroma |
|---|---|---|---|---|---|---|---|---|---|
| 1 | dunkle Haut | 115 | 82 | 68 | 37.986 | 13.555 | 14.059 | 3 YR | 3.7 / 3.2 |
| 2 | helle Haut | 194 | 150 | 130 | 65.711 | 18.13 | 17.81 | 2.2 YR | 6.47 / 4.1 |
| 3 | blauer Himmel | 98 | 122 | 157 | 49.927 | -4.88 | -21.925 | 4.3 PB | 4.95 / 5.5 |
| 4 | Laub | 87 | 108 | 67 | 43.139 | -13.095 | 21.905 | 6.7 GY | 4.2 / 4.1 |
| 5 | blaue Blume | 133 | 128 | 177 | 55.112 | 8.844 | -25.399 | 9.7 PB | 5.47 / 6.7 |
| 6 | bläuliches Grün | 103 | 189 | 170 | 70.719 | -33.397 | -0.199 | 2.5 BG | 7 / 6 |
| 7 | Orange | 214 | 126 | 44 | 62.661 | 36.067 | 57.096 | 5 YR | 6 / 11 |
| 8 | violettstichiges Blau | 80 | 91 | 166 | 40.02 | 10.41 | -45.964 | 7.5 PB | 4 / 10.7 |
| 9 | mittleres Rot | 193 | 90 | 99 | 51.124 | 48.239 | 16.248 | 2.5 R | 5 / 10 |
| 10 | Violett | 94 | 60 | 108 | 30.325 | 22.976 | -21.587 | 5 P | 3 / 7 |
| 11 | Gelbgrün | 157 | 188 | 64 | 72.532 | -23.709 | 57.255 | 5 GY | 7.1 / 9.1 |
| 12 | Orangegelb | 224 | 163 | 46 | 71.941 | 19.363 | 67.857 | 10 YR | 7 / 10.5 |
| 13 | Blau | 56 | 61 | 150 | 28.778 | 14.179 | -50.297 | 7.5 PB | 2.9 / 12.7 |
| 14 | Grün | 70 | 148 | 73 | 55.261 | -38.342 | 31.37 | 0.25 G | 5.4 / 8.65 |
| 15 | Rot | 175 | 54 | 60 | 42.101 | 53.378 | 28.19 | 5 R | 4 / 12 |
| 16 | Gelb | 231 | 199 | 31 | 81.733 | 4.039 | 79.819 | 5 Y | 8 / 11.1 |
| 17 | Magenta | 187 | 86 | 149 | 51.935 | 49.986 | -14.574 | 2.5 RP | 5 / 12 |
| 18 | Cyan | 8 | 133 | 161 | 51.038 | -28.631 | -28.638 | 5 B | 5 / 8 |
| 19 | Weiß (.05*) | 243 | 243 | 242 | 96.539 | -0.425 | 1.186 | N | 9.5 / |
| 20 | Neutralgrau 8 (.23*) | 200 | 200 | 200 | 81.257 | -0.638 | -0.335 | N | 8 / |
| 21 | Neutralgrau 6.5 (.44*) | 160 | 160 | 160 | 66.766 | -0.734 | -0.504 | N | 6.5 / |
| 22 | Neutralgrau 5 (.70*) | 122 | 122 | 121 | 50.867 | -0.153 | -0.27 | N | 5 / |
| 23 | Neutralgrau 3.5 (1.05*) | 85 | 85 | 85 | 35.656 | -0.421 | -1.231 | N | 3.5 / |
| 24 | Schwarz (1.50*) | 52 | 52 | 52 | 20.461 | -0.079 | -0.973 | N | 2 / |

<!-- Source EN PDF p.72, block 543 -->

###### 3.4.3.2.3 Hinweise zur CCM-Anpassung

<!-- Source EN PDF p.72, block 544 -->

Vergleichen Sie die aktuellen RGB-Werte mit den Zielwerten und passen Sie die CCM manuell an, bis sich beide annähern.

<!-- Source EN PDF p.72, block 545 -->

(1) Randbedingungen der CCM-Anpassung

<!-- Source EN PDF p.72, block 546 -->

Die Formel der Farbkorrekturmatrix lautet:

<!-- Source EN PDF p.72, block 547 -->

![Abbildung aus der englischen Quelle, PDF S. 72, Nr. 547](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 72, Nr. 547.*

```text
[R',G',B']^T = [[a11,a12,a13],[a21,a22,a23],[a31,a32,a33]] * [R,G,B]^T
```

<!-- Source EN PDF p.72, block 548 -->

Damit der Weißabgleich erhalten bleibt, müssen die Parameter folgende Bedingungen erfüllen:

<!-- Source EN PDF p.72, block 549 -->

![Abbildung aus der englischen Quelle, PDF S. 72, Nr. 549](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure3.png)

*Abbildung aus der englischen Quelle, PDF S. 72, Nr. 549.*

```text
a_i1 + a_i2 + a_i3 = 1
```

<!-- Source EN PDF p.72, block 550 -->

Jeder Ausgangskanal wird hauptsächlich aus der Farbkomponente des entsprechenden Eingangskanals gebildet. Daher müssen folgende Bedingungen erfüllt sein:

<!-- Source EN PDF p.72, block 551 -->

![Abbildung aus der englischen Quelle, PDF S. 72, Nr. 551](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure4.png)

*Abbildung aus der englischen Quelle, PDF S. 72, Nr. 551.*

```text
a_ii >= 1
```

<!-- Source EN PDF p.72, block 552 -->

Halten Sie zugleich die Unterschiede zwischen den Hauptdiagonalelementen möglichst klein und wählen Sie die übrigen Elemente möglichst negativ.

<!-- Source EN PDF p.72, block 553 -->

![Abbildung aus der englischen Quelle, PDF S. 72, Nr. 553](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure5.png)

*Abbildung aus der englischen Quelle, PDF S. 72, Nr. 553.*

```text
a13
```

<!-- Source EN PDF p.72, block 554 -->

![Abbildung aus der englischen Quelle, PDF S. 72, Nr. 554](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure6.png)

*Abbildung aus der englischen Quelle, PDF S. 72, Nr. 554.*

```text
a31
```

<!-- Source EN PDF p.72, block 555 -->

Ist a13 positiv, wird stark gesättigtes Rot violettstichig; ist a31 positiv, wird stark gesättigtes Blau violettstichig.

<!-- Source EN PDF p.73, block 556 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 556](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 556.*

```text
a21
```

<!-- Source EN PDF p.73, block 557 -->

Ist a21 negativ, führt ein größerer Betrag zu einer kleineren korrigierten G-Komponente von Rot und damit höherer Rotsättigung. Ist a23 negativ, führt ein größerer Betrag entsprechend zu einer kleineren G-Komponente von Blau und höherer Blausättigung.

<!-- Source EN PDF p.73, block 558 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 558](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 558.*

```text
a23
```

<!-- Source EN PDF p.73, block 560 -->

(2) Übersicht häufiger Farbstiche:

<!-- Source EN PDF p.73, block 561 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 561](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure3.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 561.*

```text
a13
```

<!-- Source EN PDF p.73, block 562 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 562](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure4.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 562.*

```text
a31
```

<!-- Source EN PDF p.73, block 563 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 563](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure5.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 563.*

```text
a13
```

<!-- Source EN PDF p.73, block 564 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 564](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure6.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 564.*

```text
a31
```

<!-- Source EN PDF p.73, block 565 -->

Bei violettstichigem Blau (Rot) und positivem a13 (a31) verringern Sie die R- (B-)Komponente, indem Sie a13 (a31) von einem kleinen positiven Wert nahe null auf einen kleineren negativen Wert setzen.

<!-- Source EN PDF p.73, block 566 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 566](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure7.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 566.*

```text
a23
```

<!-- Source EN PDF p.73, block 567 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 567](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure8.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 567.*

```text
a21
```

<!-- Source EN PDF p.73, block 568 -->

Bei übersättigtem Blau (Rot) und negativem a23 (a21) erhöhen Sie G, indem Sie den Betrag von a23 (a21) verringern.

<!-- Source EN PDF p.73, block 569 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 569](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure9.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 569.*

```text
a23
```

<!-- Source EN PDF p.73, block 570 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 570](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure10.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 570.*

```text
a21
```

<!-- Source EN PDF p.73, block 572 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 572](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure11.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 572.*

```text
a13
```

<!-- Source EN PDF p.73, block 573 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 573](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure12.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 573.*

```text
a11
```

<!-- Source EN PDF p.73, block 574 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 574](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure13.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 574.*

```text
a12
```

<!-- Source EN PDF p.73, block 575 -->

Bei bläulichem Violett erhöhen Sie R durch Erhöhen von a13 und Verringern von a11 und a12. Alternativ reduzieren Sie B durch Verringern von a33 und Erhöhen von a31 und a32.

<!-- Source EN PDF p.73, block 576 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 576](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure14.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 576.*

```text
a33
```

<!-- Source EN PDF p.73, block 577 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 577](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure15.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 577.*

```text
a31
```

<!-- Source EN PDF p.73, block 578 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 578](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure16.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 578.*

```text
a32
```

<!-- Source EN PDF p.73, block 580 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 580](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure17.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 580.*

```text
a21
```

<!-- Source EN PDF p.73, block 581 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 581](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure18.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 581.*

```text
a22
```

<!-- Source EN PDF p.73, block 582 -->

Bei orangefarbenem Rot reduzieren Sie G durch Verringern von a21 und Erhöhen von a22.

<!-- Source EN PDF p.73, block 583 -->

Bei gelbgrüner Haut reduzieren Sie G und erhöhen B: a22 deutlich verringern, a23 erhöhen und a21 fein abstimmen; a31 deutlich erhöhen, a32 verringern und a33 fein abstimmen.

<!-- Source EN PDF p.73, block 584 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 584](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure19.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 584.*

```text
a22
```

<!-- Source EN PDF p.73, block 585 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 585](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure20.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 585.*

```text
a23
```

<!-- Source EN PDF p.73, block 586 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 586](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure21.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 586.*

```text
a21
```

<!-- Source EN PDF p.73, block 587 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 587](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure22.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 587.*

```text
a31
```

<!-- Source EN PDF p.73, block 588 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 588](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure23.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 588.*

```text
a32
```

<!-- Source EN PDF p.73, block 589 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 589](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure24.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 589.*

```text
a33
```

<!-- Source EN PDF p.73, block 591 -->

###### 3.4.3.2.4 Beispiele zur CCM-Anpassung

<!-- Source EN PDF p.73, block 592 -->

(1) Beispiel 1: Rot erscheint orange

<!-- Source EN PDF p.73, block 593 -->

![Abbildung aus der englischen Quelle, PDF S. 73, Nr. 593](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure25.png)

*Abbildung aus der englischen Quelle, PDF S. 73, Nr. 593.*

<!-- Source EN PDF p.73, block 594 -->

Die RGB-Anpassung in FastStone zeigt, dass eine Verringerung der G-Komponente den Orangestich verbessert. Der RGB-Zielwert der roten Kunststofffläche beträgt [212 63 79].

<!-- Source EN PDF p.74, block 595 -->

![Abbildung aus der englischen Quelle, PDF S. 74, Nr. 595](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 74, Nr. 595.*

<!-- Source EN PDF p.74, block 596 -->

Die Kunststofffläche im roten Rahmen erscheint orange, RGB = [212, 78, 80]. Gegenüber dem Ziel [212 63 79] ist die G-Komponente zu groß. Mit ausreichender Erfahrung können Sie die Zielwertermittlung in FastStone überspringen und die CCM direkt zur Verringerung von G anpassen.

<!-- Source EN PDF p.74, block 597 -->

![Abbildung aus der englischen Quelle, PDF S. 74, Nr. 597](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 74, Nr. 597.*

```text
G' = a21*R + a22*G + a23*B
```

<!-- Source EN PDF p.74, block 598 -->

,

<!-- Source EN PDF p.74, block 599 -->

![Abbildung aus der englischen Quelle, PDF S. 74, Nr. 599](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure3.png)

*Abbildung aus der englischen Quelle, PDF S. 74, Nr. 599.*

```text
[a21,a22,a23] = [-0.2854,1.1496,0.1358]
```

<!-- Source EN PDF p.74, block 600 -->

Ursprüngliche Korrekturkoeffizienten:

<!-- Source EN PDF p.74, block 601 -->

![Abbildung aus der englischen Quelle, PDF S. 74, Nr. 601](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure4.png)

*Abbildung aus der englischen Quelle, PDF S. 74, Nr. 601.*

```text
a21
```

<!-- Source EN PDF p.74, block 602 -->

Da die rote Kunststofffläche die größte R-Komponente besitzt, verringern Sie a21 und erhöhen den Betrag von a22, damit die Zeilensumme 1 bleibt.

<!-- Source EN PDF p.74, block 603 -->

![Abbildung aus der englischen Quelle, PDF S. 74, Nr. 603](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure5.png)

*Abbildung aus der englischen Quelle, PDF S. 74, Nr. 603.*

```text
a22
```

<!-- Source EN PDF p.74, block 605 -->

![Abbildung aus der englischen Quelle, PDF S. 74, Nr. 605](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure6.png)

*Abbildung aus der englischen Quelle, PDF S. 74, Nr. 605.*

```text
[a21,a22,a23] = [-0.385,1.2497,0.1358]
```

<!-- Source EN PDF p.74, block 606 -->

Angepasste Korrekturkoeffizienten:

<!-- Source EN PDF p.74, block 607 -->

![Abbildung aus der englischen Quelle, PDF S. 74, Nr. 607](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure7.png)

*Abbildung aus der englischen Quelle, PDF S. 74, Nr. 607.*

<!-- Source EN PDF p.74, block 608 -->

Rote Kunststofffläche: RGB = [208, 56, 76].

<!-- Source EN PDF p.74, block 609 -->

(2) Beispiel 2: Gelbgrüne Hautfarbe

<!-- Source EN PDF p.75, block 610 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 610](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 610.*

<!-- Source EN PDF p.75, block 611 -->

Die Hautfarbe im roten Rahmen ist gelbgrün, RGB = [216, 174, 124]. Die G-Komponente ist zu groß, die B-Komponente zu klein.

<!-- Source EN PDF p.75, block 612 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 612](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 612.*

```text
[[a21,a22,a23],[a31,a32,a33]] = [[-0.3192,1.6927,-0.3735],[0.0239,-0.5738,1.5499]]
```

<!-- Source EN PDF p.75, block 613 -->

Ursprüngliche Korrekturkoeffizienten:

<!-- Source EN PDF p.75, block 614 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 614](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure4.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 614.*

```text
a23
```

<!-- Source EN PDF p.75, block 615 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 615](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure3.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 615.*

```text
a22
```

<!-- Source EN PDF p.75, block 616 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 616](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure5.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 616.*

```text
a21
```

<!-- Source EN PDF p.75, block 617 -->

Verringern Sie wie in Beispiel 1 die G-Komponente: a22 deutlich verringern, a23 erhöhen und a21 fein abstimmen.

<!-- Source EN PDF p.75, block 618 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 618](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure6.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 618.*

<!-- Source EN PDF p.75, block 619 -->

Hautfarbe nach diesem Schritt: RGB = [212, 169, 124].

<!-- Source EN PDF p.75, block 620 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 620](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure7.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 620.*

```text
a31
```

<!-- Source EN PDF p.75, block 621 -->

Da R groß ist, erhöhen Sie a31 deutlich, um B zu vergrößern. Verringern Sie a32 und a33, damit die Zeilensumme 1 bleibt.

<!-- Source EN PDF p.75, block 622 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 622](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure8.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 622.*

```text
a32
```

<!-- Source EN PDF p.75, block 623 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 623](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure9.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 623.*

```text
a33
```

<!-- Source EN PDF p.75, block 625 -->

![Abbildung aus der englischen Quelle, PDF S. 75, Nr. 625](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure10.png)

*Abbildung aus der englischen Quelle, PDF S. 75, Nr. 625.*

<!-- Source EN PDF p.76, block 626 -->

![Abbildung aus der englischen Quelle, PDF S. 76, Nr. 626](/docs/rockchip-isp30-color-optimization/assets/en-p76-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 76, Nr. 626.*

```text
[[a21,a22,a23],[a31,a32,a33]] = [[-0.3004,1.6375,-0.3371],[0.2127,-0.7294,1.5166]]
```

<!-- Source EN PDF p.76, block 627 -->

Die angepassten Korrekturkoeffizienten sind nachfolgend dargestellt.

<!-- Source EN PDF p.76, block 628 -->

Hautfarbe an dieser Stelle: RGB = [214, 169, 146].

<!-- Source EN PDF p.76, block 629 -->

## 4 Erweiterte Farbanpassung mit 3DLUT

<!-- Source EN PDF p.76, block 630 -->

### 4.1 CCM im Vergleich zu 3DLUT

<!-- Source EN PDF p.76, block 631 -->

CCM soll Farben unter verschiedenen Lichtquellen an die menschliche Wahrnehmung angleichen. 3DLUT passt dagegen einzelne Farben an gewünschte Präferenzen an. Beide Verfahren haben folgende Vor- und Nachteile:

<!-- Source EN PDF p.76, block 632 -->

|  | CCM | 3DLUT |
|---|---|---|
| Vorteile | Natürliche Farbübergänge; erzeugt nicht leicht zusätzliches Rauschen | Farbton und Sättigung einzelner Farben lassen sich leichter anpassen; unabhängige Farben können unbeeinflusst bleiben |
| Nachteile | Eine präferenzbezogene CCM-Änderung kann auch andere, unähnliche Farben beeinflussen; die Anpassung ist schwieriger | Die derzeitige Anzahl von 9x9x9 Stützstellen ist gering, sodass leicht unnatürliche Farbübergänge entstehen. Änderungen beeinflussen die Rauschunterdrückungsstärke der Pixel und können Rauschen verursachen. |

<!-- Source EN PDF p.76, block 633 -->

Die Wahl richtet sich nach dem konkreten Projekt und der Abwägung zwischen Farbpräferenz, Übergängen und Rauschen.

<!-- Source EN PDF p.76, block 634 -->

### 4.2 Funktionsbeschreibung

<!-- Source EN PDF p.76, block 635 -->

Dreidimensionale Nachschlagetabellen (3DLUT)

<!-- Source EN PDF p.77, block 636 -->

![Abbildung aus der englischen Quelle, PDF S. 77, Nr. 636](/docs/rockchip-isp30-color-optimization/assets/en-p77-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 77, Nr. 636.*

<!-- Source EN PDF p.77, block 637 -->

Abbildung: 9x9x9-3DLUT ohne Farbänderung

<!-- Source EN PDF p.77, block 638 -->

Jede Farbe kann unabhängig auf einen anderen Wert abgebildet werden.

<!-- Source EN PDF p.77, block 639 -->

![Abbildung aus der englischen Quelle, PDF S. 77, Nr. 639](/docs/rockchip-isp30-color-optimization/assets/en-p77-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 77, Nr. 639.*

<!-- Source EN PDF p.77, block 640 -->

Abbildung: 9x9x9-3DLUT mit verstärktem Grün

<!-- Source EN PDF p.77, block 641 -->

Die 3D-LUT auf RK1109 hat die Größe 9x9x9. Nicht direkt gespeicherte Werte werden durch trilineare Interpolation ermittelt.

<!-- Source EN PDF p.78, block 642 -->

### 4.3 Wichtige Parameter

<!-- Source EN PDF p.78, block 643 -->

Die Parameter befinden sich im Knoten lut3d_calib der IQ-JSON-Datei und wirken nur im automatischen Modus.

<!-- Source EN PDF p.78, block 644 -->

#### 4.3.1 Aktivierung und Modusauswahl

<!-- Source EN PDF p.78, block 645 -->

Im Knoten Common:

<!-- Source EN PDF p.78, block 646 -->

| Parameter | Beschreibung |
|---|---|
| enable | 3DLUT-Aktivierungsschalter; 1 aktiviert, Wertebereich 0 oder 1 |
| wbgain_tolerance | Toleranz für Änderungen des Weißabgleich-Gains. Liegt die Differenz der statistischen Gains unter dieser Schwelle, gilt die 3DLUT-Stabilitätsbedingung als erfüllt. Wertebereich 0.0-1. |
| gain_tolerance | Toleranz für Änderungen des Belichtungs-Gains. Liegt die Differenz der statistischen Gains unter dieser Schwelle, gilt die 3DLUT-Stabilitätsbedingung als erfüllt. Wertebereich 0.0-1. |

<!-- Source EN PDF p.78, block 647 -->

#### 4.3.2 Parameter der automatischen 3DLUT

<!-- Source EN PDF p.78, block 648 -->

Im Knoten ALut3D:

<!-- Source EN PDF p.78, block 649 -->

| Parameter | Beschreibung |
|---|---|
| damp_en | Schalter für die 3DLUT-Glättung; 1 aktiviert die Funktion, Wertebereich 0 oder 1 |

<!-- Source EN PDF p.78, block 650 -->

##### 4.3.2.1 3DLUT-Parameter

<!-- Source EN PDF p.78, block 651 -->

| Parameter | Beschreibung |
|---|---|
| Name | 3DLUT-Name |
| awbGain | Zugehöriger Standard-Weißabgleich-Gain; vom Kalibrierwerkzeug erzeugt, größer als 0 |
| gain | Belichtungs-Gain-Komponente der gain-alpha-Kurve; Dezimalwert größer als 0 |
| alpha | 3DLUT-Stärkekomponente der gain-alpha-Kurve; Dezimalwert größer als 0 |
| look_up_table_r | Nachschlagetabelle des R-Kanals; Wertebereich [0,1023] |
| look_up_table_g | Nachschlagetabelle des G-Kanals; Wertebereich [0, 4095] |
| look_up_table_b | Nachschlagetabelle des B-Kanals; Wertebereich [0,1023] |

<!-- Source EN PDF p.79, block 652 -->

### 4.4 3DLUT-Kalibrierung und -Anpassung

<!-- Source EN PDF p.79, block 653 -->

RKISP 3D-LutTool wandelt auf Grundlage des LAB-Farbmodells das kartesische A-B-Koordinatensystem der Farbkanäle in ein Polarkoordinatensystem aus C (Sättigung) und H (Farbton) um. Unterstützte Eingabeformate sind jpg/bmp/png/yuv/nv12. Wie in Abbildung 4.4-2 beträgt die Sättigung am Ursprung O null und nimmt radial nach außen zu. Die Drehung des roten Pfeils gegen den Uhrzeigersinn verändert den Farbton. Abschnitt 2.6 „3D-LUT Tools“ in Rockchip_IQ_Tools_Guide_ISP2x_CN beschreibt Oberfläche und Bedienung.

<!-- Source EN PDF p.79, block 654 -->

![Abbildung aus der englischen Quelle, PDF S. 79, Nr. 654](/docs/rockchip-isp30-color-optimization/assets/en-p79-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 79, Nr. 654.*

<!-- Source EN PDF p.80, block 655 -->

![Abbildung aus der englischen Quelle, PDF S. 80, Nr. 655](/docs/rockchip-isp30-color-optimization/assets/en-p80-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 80, Nr. 655.*

<!-- Source EN PDF p.80, block 656 -->

Abbildung 4.4-1: Erhöhte Grünsättigung

<!-- Source EN PDF p.81, block 657 -->

![Abbildung aus der englischen Quelle, PDF S. 81, Nr. 657](/docs/rockchip-isp30-color-optimization/assets/en-p81-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 81, Nr. 657.*

<!-- Source EN PDF p.82, block 658 -->

![Abbildung aus der englischen Quelle, PDF S. 82, Nr. 658](/docs/rockchip-isp30-color-optimization/assets/en-p82-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 82, Nr. 658.*

<!-- Source EN PDF p.82, block 659 -->

Abbildung 4.4-2: Änderung des roten Farbtons

<!-- Source EN PDF p.82, block 660 -->

#### 4.4.1 Anpassungsschritte

<!-- Source EN PDF p.82, block 661 -->

1\. Erfassen Sie Bilder bei deaktivierter 3DLUT und deaktivierten nachfolgenden Modulen wie YNR/SHARP/CNR. Um zusätzliche 3DLUT-Effekte leichter zu erkennen, sollten vorzugsweise YUV-Bilder erfasst werden.

<!-- Source EN PDF p.82, block 662 -->

2\. Importieren Sie die Bilder gemäß Abschnitt 2.6 „3D-LUT Tools“ in Rockchip_IQ_Tools_Guide_ISP2x_CN.

<!-- Source EN PDF p.82, block 663 -->

3\. Bewahren Sie den Weißabgleich: Klicken Sie mit der rechten Maustaste auf den Ursprung. Wird der Punkt quadratisch, ist er erfolgreich fixiert.

<!-- Source EN PDF p.83, block 664 -->

4\. Klicken Sie auf den anzupassenden Pixel in der rechten Bildansicht. Er wird im linken Koordinatensystem markiert.

<!-- Source EN PDF p.83, block 665 -->

5\. Ziehen Sie ihn zum Zielpunkt. Achten Sie darauf, die benachbarten Punkte im Koordinatensystem für einen glatten Übergang entsprechend anzupassen.

<!-- Source EN PDF p.83, block 666 -->

6\. Wenden Sie die erzeugten 3DLUT-Parameter auf eine farbenreiche Szene an und prüfen Sie, ob die Farben den Erwartungen entsprechen.

<!-- Source EN PDF p.83, block 667 -->

##### 4.4.1.1 Hinweis

<!-- Source EN PDF p.83, block 668 -->

Nach Änderungen an Modulen vor der 3DLUT, insbesondere solchen mit Farbeinfluss, muss die 3DLUT erneut abgestimmt werden.

<!-- Source EN PDF p.83, block 669 -->

##### 4.4.1.2 Beispiel

<!-- Source EN PDF p.83, block 670 -->

Anpassung der Gesichtshautfarbe:

<!-- Source EN PDF p.83, block 671 -->

(1) Wählen Sie Grid Division (8,12,16); größere Werte erhöhen die Genauigkeit. Klicken Sie auf das Gesicht in der rechten Bildansicht, um dessen Position im linken Koordinatensystem zu markieren.

<!-- Source EN PDF p.83, block 672 -->

![Abbildung aus der englischen Quelle, PDF S. 83, Nr. 672](/docs/rockchip-isp30-color-optimization/assets/en-p83-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 83, Nr. 672.*

<!-- Source EN PDF p.83, block 673 -->

(2) Die Haut erscheint gelbgrün. Verschieben Sie den Hautfarbenanker in Richtung Rot und verringern Sie die Sättigung, wie durch die Markierungen (1) und (2) gezeigt. Die bei (3) markierten Punkte wurden zur Glättung leicht angepasst.

<!-- Source EN PDF p.84, block 674 -->

![Abbildung aus der englischen Quelle, PDF S. 84, Nr. 674](/docs/rockchip-isp30-color-optimization/assets/en-p84-figure1.png)

*Abbildung aus der englischen Quelle, PDF S. 84, Nr. 674.*

<!-- Source EN PDF p.84, block 675 -->

(3) Ergebnisvergleich:

<!-- Source EN PDF p.84, block 676 -->

![Abbildung aus der englischen Quelle, PDF S. 84, Nr. 676](/docs/rockchip-isp30-color-optimization/assets/en-p84-figure2.png)

*Abbildung aus der englischen Quelle, PDF S. 84, Nr. 676.*

{% endraw %}
