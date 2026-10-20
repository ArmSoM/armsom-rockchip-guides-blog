---
title: "Rockchip IQ Tools: Vollständiger Leitfaden für Aufnahme, Kalibrierung und ISP-Abstimmung"
description: "Alle technischen Kapitel aus V1.0.1: RKISP Tuner, Raw/YUV, BLC/LSC/AWB/CCM/NR/FEC, Gamma und Offline-Simulation."
translation_key: "081-rockchip-iq-tools"
slug: "081-rockchip-iq-tools"
lang: "de"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["ArmSoM", "Rockchip", "IQ Tools", "RKISP", "Camera"]
keywords: "ArmSoM Rockchip RK356x RK3588 RV1106 ISP IQ Tools"
excerpt: "Alle technischen Kapitel aus V1.0.1: RKISP Tuner, Raw/YUV, BLC/LSC/AWB/CCM/NR/FEC, Gamma und Offline-Simulation."
---

{% raw %}

# Rockchip IQ Tools: Vollständiger Leitfaden für Aufnahme, Kalibrierung und ISP-Abstimmung

## ArmSoM-Anwendbarkeit und Quelle

Plattformreferenz zur Anpassung an ArmSoM auf Basis der einzigen bereitgestellten Quelle Rockchip_IQ_Tools_Guide_EN_v1.0.1.pdf (RK-SM-YF-609, 81 Seiten). Ein chinesisches PDF liegt nicht vor; Chinesisch, Russisch und Deutsch sind vollständig aus dem Englischen übersetzt. Alle Fassungen behalten die englischen Originalabbildungen; Deutsch verwendet genau dieselben Bild-URLs wie Englisch. Abschnitt 1.2 nennt RK356x/RKISP21, RK3588/RKISP30 und RV1106/RKISP32 mit Linux/Android, jedoch keine Kernelversion. ArmSoM-Board, SoC, SDK/BSP, Kernel, Sensor-/Objektivtreiber, ToolServer, Tuner und IQ-Vorlagen müssen zusammenpassen. Boardanpassung und Bildqualität wurden nicht an Hardware geprüft. Zeiten, Verstärkungen, Vergleiche und Parameter sind Quellbeispiele, keine ArmSoM-Messwerte.

Quellbeispiele enthalten Neustarts, Rechteänderungen und `setenforce 0`, das den SELinux-Schutz reduziert. Sie bleiben zur Vollständigkeit erhalten, wurden nicht ausgeführt und dürfen nicht ungeprüft auf Produktivsysteme angewendet werden.

[Redaktionelle Prüfnotizen](/docs/rockchip-iq-tools/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip AIQ](https://github.com/rockchip-toybrick/camera_engine_rkaiq)

<!-- Source EN PDF p.1, unit 0 -->

Dieser Leitfaden erläutert RKISP2 Tuner und den ISP-Abstimmungsprozess. Er erleichtert den Einstieg und dient als Referenz für die IQ-Abstimmung.

<!-- Source EN PDF p.4, unit 1 -->

## 1 Einführung

<!-- Source EN PDF p.4, unit 2 -->

### 1.1 Überblick

<!-- Source EN PDF p.4, unit 3 -->

RKISP Tuner (nachfolgend Tuner) stellt Werkzeuge zur Abstimmung der ISP-Parameter bereit. Alle ISP-Module lassen sich kalibrieren und abstimmen. Mit Capture Tool werden Raw-Bilder aufgenommen, mit Calibration Tool die Basismodule kalibriert und anschließend über Tuner die ISP-Parameter am verbundenen Gerät online angepasst.

<!-- Source EN PDF p.4, unit 4 -->

### 1.2 Zugehörige Versionen

<!-- Source EN PDF p.4, unit 5 -->

| Chip | Systeme | ISP-Version |
| --- | --- | --- |
| RK356x | Linux/Android | RKISP21 |
| RK3588 | Linux/Android | RKISP30 |
| RV1106 | Linux/Android | RKISP32 |

<!-- Source EN PDF p.4, unit 6 -->

ISP21, ISP30 und ISP32 verbessern die Kompatibilität deutlich. ToolServer und RKISP Tuner müssen zueinander passende Versionen haben. Weichen die Parameter der Werkzeugoberfläche von den Parameterdateien auf dem Gerät ab, soll die Parametervorlage mit Unterstützung der Rockchip-Entwickler aktualisiert werden.

<!-- Source EN PDF p.4, unit 7 -->

### 1.3 Umgebung vorbereiten

<!-- Source EN PDF p.4, unit 8 -->

##### Anforderungen an den Computer

<!-- Source EN PDF p.4, unit 9 -->

1. Der Tuner-PC benötigt x64 Windows 7 oder eine neuere 64-Bit-Windows-Version.

<!-- Source EN PDF p.4, unit 10 -->

2. Vor dem Start muss die 64-Bit-Version MCR_R2016a (9.0.1) installiert sein; laut Quelle wird nur diese Version unterstützt. Download: https://ww2.mathworks.cn/products/compiler/matlab-runtime

<!-- Source EN PDF p.4, unit 11 -->

##### Anforderungen an das Gerät

<!-- Source EN PDF p.4, unit 12 -->

1. Ein Netzwerkadapter muss die Verbindung mit dem lokalen Netz über Kabel, WLAN oder ein anderes Verfahren ermöglichen.

<!-- Source EN PDF p.4, unit 13 -->

2. Geräte ohne Netzwerkadapter sollten RNDIS unterstützen. Das Gerät wird dann als USB-Netzwerkadapter erkannt und über USB mit dem PC verbunden.

<!-- Source EN PDF p.5, unit 14 -->

### 1.4 Installation und Konfiguration

<!-- Source EN PDF p.5, unit 15 -->

RKISP2.x Tuner muss nicht installiert werden. Das Archiv in ein beliebiges Verzeichnis entpacken und direkt verwenden; Pfade mit chinesischen Zeichen vermeiden.

<!-- Source EN PDF p.5, unit 16 -->

Die Quelle verweist für die Vorinstallation von MCR_R2016a auf Abschnitt 3. Die Schritte folgen unten; die Umgebungsanforderungen stehen tatsächlich in 1.3. Diese abweichende Querverweisung bleibt dokumentiert.

<!-- Source EN PDF p.5, unit 17 -->

1. MCR_R2016a_x64.exe öffnen und das Entpacken abwarten.

<!-- Source EN PDF p.5, unit 18 -->

![Technische Abbildung aus dem englischen PDF, Seite 5](/docs/rockchip-iq-tools/assets/en-p005-figure-01.png)

<!-- Source EN PDF p.5, unit 19 -->

Abbildung 1-4-1

<!-- Source EN PDF p.5, unit 20 -->

2. Next wählen, den Bedingungen zustimmen und anschließend Next sowie Install anklicken.

<!-- Source EN PDF p.5, unit 21 -->

![Technische Abbildung aus dem englischen PDF, Seite 5](/docs/rockchip-iq-tools/assets/en-p005-figure-02.png)

<!-- Source EN PDF p.5, unit 22 -->

Abbildung 1-4-2

<!-- Source EN PDF p.6, unit 23 -->

3. Den Abschluss der Installation abwarten.

<!-- Source EN PDF p.6, unit 24 -->

![Technische Abbildung aus dem englischen PDF, Seite 6](/docs/rockchip-iq-tools/assets/en-p006-figure-01.png)

<!-- Source EN PDF p.6, unit 25 -->

Abbildung 1-4-3

<!-- Source EN PDF p.6, unit 26 -->

4. Installation abgeschlossen.

<!-- Source EN PDF p.6, unit 27 -->

![Technische Abbildung aus dem englischen PDF, Seite 6](/docs/rockchip-iq-tools/assets/en-p006-figure-02.png)

<!-- Source EN PDF p.6, unit 28 -->

Abbildung 1-4-4

<!-- Source EN PDF p.7, unit 29 -->

## 2 Funktionsübersicht

<!-- Source EN PDF p.7, unit 30 -->

### 2.1 Überblick

<!-- Source EN PDF p.7, unit 31 -->

Bei der Abstimmung den nachfolgend gezeigten Ablauf einhalten:

<!-- Source EN PDF p.7, unit 32 -->

![Technische Abbildung aus dem englischen PDF, Seite 7](/docs/rockchip-iq-tools/assets/en-p007-figure-01.png)

<!-- Source EN PDF p.7, unit 33 -->

Abbildung 2-1-1

<!-- Source EN PDF p.7, unit 34 -->

In der Vorbereitung wird im Werkzeug eine IQ-Basisdatei im .json-Format mit allen einstellbaren ISP-Parametern erzeugt. Nach der Abstimmung die entsprechende Datei in Firmware oder Gerät ersetzen und die Kameraanwendung neu starten, um das endgültige Bild zu prüfen.

<!-- Source EN PDF p.7, unit 35 -->

Raw-Aufnahme, Online-Abstimmung und Parameteraustausch laufen über Netzwerkprotokolle. PC und Gerät müssen deshalb im selben lokalen Netz verbunden sein.

<!-- Source EN PDF p.7, unit 36 -->

Die Kalibrierung folgt diesem Ablauf:

<!-- Source EN PDF p.7, unit 37 -->

![Technische Abbildung aus dem englischen PDF, Seite 7](/docs/rockchip-iq-tools/assets/en-p007-figure-02.png)

<!-- Source EN PDF p.7, unit 38 -->

Abbildung 2-1-2

<!-- Source EN PDF p.7, unit 39 -->

Da manche Kalibrierungen Ergebnisse vorangehender Module voraussetzen, muss die Reihenfolge eingehalten werden. Nach jedem Modul prüfen, ob das Ergebnis korrekt ist.

<!-- Source EN PDF p.8, unit 40 -->

### 2.2 Sensorkonfiguration

<!-- Source EN PDF p.8, unit 41 -->

![Technische Abbildung aus dem englischen PDF, Seite 8](/docs/rockchip-iq-tools/assets/en-p008-figure-01.png)

<!-- Source EN PDF p.8, unit 42 -->

Abbildung 2-2-1

<!-- Source EN PDF p.8, unit 43 -->

Die Sensoroberfläche in Abbildung 2-2-1 besteht aus zwei Bereichen:

<!-- Source EN PDF p.8, unit 44 -->

1. Parameterbereich: Beschreibungen stehen unter sensorinfo parameters in Abschnitt 4.1.2.5 von Rockchip_Tuning_Guide_ISP21/30/32. Die Werte anhand des Sensordatenblatts eingeben; gegebenenfalls einen Treiberentwickler hinzuziehen.

<!-- Source EN PDF p.8, unit 45 -->

2. Menüleiste: Import aus SensorList.ini und Export dorthin.

<!-- Source EN PDF p.9, unit 46 -->

### 2.3 RKISP Capture Tool

<!-- Source EN PDF p.9, unit 47 -->

![Technische Abbildung aus dem englischen PDF, Seite 9](/docs/rockchip-iq-tools/assets/en-p009-figure-01.png)

<!-- Source EN PDF p.9, unit 48 -->

Abbildung 2-3-1

<!-- Source EN PDF p.9, unit 49 -->

Die Hauptoberfläche von RKISP Capture Tool in Abbildung 2-3-1 hat drei Bereiche:

<!-- Source EN PDF p.9, unit 50 -->

1. Geräteverbindung: Netzwerkparameter konfigurieren, Betriebsart wechseln und die Verbindung prüfen.

<!-- Source EN PDF p.9, unit 51 -->

2. Aufnahmeeinstellungen bestehen aus Raw Capture und Online Capture. Raw Capture nimmt Raw-Bilder offline auf und umfasst Kamera- und Belichtungssteuerung. Die Kamerakonfiguration enthält Sensorbelichtungsparameter, Module/Light-Namen, Auflösung und Gain/Exposure-Bereiche. Die Belichtungssteuerung unterstützt manuelle und automatische Belichtung sowie die besondere Aufnahme für NR-Kalibrierung. Manuell lässt sich eine Schrittweite zum Durchlaufen mehrerer Belichtungskombinationen einstellen; die Automatik sucht bis zur gewünschten Zielhelligkeit. YNR Capture erzeugt Raw-Aufnahmen für die YNR-Kalibrierung, siehe 4.6.1. Online Capture nimmt raw und yuv aus einem laufenden Stream auf.

<!-- Source EN PDF p.9, unit 52 -->

3. Raw-Vorschau und Statistik: aufgenommene Raw-Bilder in Graustufen, Histogramm und ROI-Helligkeit.

<!-- Source EN PDF p.10, unit 53 -->

### 2.4 RKISP Calibration Tool

<!-- Source EN PDF p.10, unit 54 -->

Für den gewählten Chip und die Version (Abbildung 2-4-1) wird das passende RKISP Calibration Tool geladen (2-4-2). Auch die importierte IQ-Datei muss zu Chip und Version passen.

<!-- Source EN PDF p.10, unit 55 -->

![Technische Abbildung aus dem englischen PDF, Seite 10](/docs/rockchip-iq-tools/assets/en-p010-figure-01.png)

<!-- Source EN PDF p.10, unit 56 -->

Abbildung 2-4-1

<!-- Source EN PDF p.10, unit 57 -->

![Technische Abbildung aus dem englischen PDF, Seite 10](/docs/rockchip-iq-tools/assets/en-p010-figure-02.png)

<!-- Source EN PDF p.10, unit 58 -->

Abbildung 2-4-2

<!-- Source EN PDF p.10, unit 59 -->

Die Oberfläche von RKISP Calibration Tool (2-4-2) enthält BLC für Schwarzwertkorrektur, LSC für Objektivabschattung, CCM für die Farbkorrekturmatrix und AWB für automatischen Weißabgleich.

<!-- Source EN PDF p.11, unit 60 -->

GIC gleicht die Grünkanäle ab und wird im Bayer-NR-Modul kalibriert. Bayer NR umfasst Raw-Rauschminderung mit Bayer 2DNR und Bayer 3DNR. YNR reduziert Rauschen im Y-Kanal; FEC dient zur Fisheye-Kalibrierung.

<!-- Source EN PDF p.11, unit 61 -->

### 2.5 RKRAW Tool

<!-- Source EN PDF p.11, unit 62 -->

![Technische Abbildung aus dem englischen PDF, Seite 11](/docs/rockchip-iq-tools/assets/en-p011-figure-01.png)

<!-- Source EN PDF p.11, unit 63 -->

Abbildung 2-5-1

<!-- Source EN PDF p.11, unit 64 -->

RKRAW Tool (2-5-1) zeigt jpg/bmp/png, raw, RKRawV1 und RKRawV2 an. Die Quelle spricht von vier Bereichen, führt jedoch fünf Punkte auf; alle bleiben erhalten:

<!-- Source EN PDF p.11, unit 65 -->

1. Dateisystem: Pfad der anzuzeigenden Bilder wählen.

<!-- Source EN PDF p.11, unit 66 -->

2. Anzeigefenster: Rechtsklick wechselt GRAY/RGB und Normal/Hdr Short/Mid/Long; Letzteres ist nur bei RKRawV2 verfügbar, siehe 2-5-2. Mit Ctrl und Mausrad zoomen.

<!-- Source EN PDF p.11, unit 67 -->

3. Histogramm: Statistik des Graukanals.

<!-- Source EN PDF p.11, unit 68 -->

4. RKRawV2-Informationen: Raw-Format, Belichtungsparameter und weitere Angaben.

<!-- Source EN PDF p.11, unit 69 -->

5. Compare: Mit Ctrl mehr als zwei Bilder gleichzeitig auswählen und compare anklicken, siehe 2-5-3.

<!-- Source EN PDF p.12, unit 70 -->

![Technische Abbildung aus dem englischen PDF, Seite 12](/docs/rockchip-iq-tools/assets/en-p012-figure-01.png)

<!-- Source EN PDF p.12, unit 71 -->

Abbildung 2-5-2

<!-- Source EN PDF p.12, unit 72 -->

![Technische Abbildung aus dem englischen PDF, Seite 12](/docs/rockchip-iq-tools/assets/en-p012-figure-02.png)

<!-- Source EN PDF p.12, unit 73 -->

Abbildung 2-5-3

<!-- Source EN PDF p.13, unit 74 -->

### 2.6 RKISP 3D-LUT Tools

<!-- Source EN PDF p.13, unit 75 -->

![Technische Abbildung aus dem englischen PDF, Seite 13](/docs/rockchip-iq-tools/assets/en-p013-figure-01.png)

<!-- Source EN PDF p.13, unit 76 -->

Abbildung 2-6-1

<!-- Source EN PDF p.13, unit 77 -->

RKISP 3D-LutTool (2-6-1): links der LUT-Bereich, rechts die Vorschau.

<!-- Source EN PDF p.13, unit 78 -->

1. File: Bilder importieren, IQ-Parameter und LUT Info importieren beziehungsweise speichern. Load Image unterstützt jpg/bmp/png/nv12; das Bild erscheint rechts in Preview (2-6-2). Load IQ File importiert IQ-Parameter mit Auswahl von Szene und Lut3D-Tabelle (2-6-3).

<!-- Source EN PDF p.13, unit 79 -->

![Technische Abbildung aus dem englischen PDF, Seite 13](/docs/rockchip-iq-tools/assets/en-p013-figure-02.png)

<!-- Source EN PDF p.13, unit 80 -->

Abbildung 2-6-2

<!-- Source EN PDF p.14, unit 81 -->

![Technische Abbildung aus dem englischen PDF, Seite 14](/docs/rockchip-iq-tools/assets/en-p014-figure-01.png)

<!-- Source EN PDF p.14, unit 82 -->

![Technische Abbildung aus dem englischen PDF, Seite 14](/docs/rockchip-iq-tools/assets/en-p014-figure-02.png)

<!-- Source EN PDF p.14, unit 83 -->

Abbildung 2-6-3

<!-- Source EN PDF p.14, unit 84 -->

Save IQ File überschreibt eine vorhandene Tabelle in der IQ-Datei oder erstellt eine neue (2-6-4).

<!-- Source EN PDF p.14, unit 85 -->

![Technische Abbildung aus dem englischen PDF, Seite 14](/docs/rockchip-iq-tools/assets/en-p014-figure-03.png)

<!-- Source EN PDF p.14, unit 86 -->

Abbildung 2-6-4

<!-- Source EN PDF p.14, unit 87 -->

2. Farbsuche: Beim Bewegen der Maus über das Bild wird die zugehörige Farbe links in der LUT markiert (2-6-5). Linksklick fixiert sie. Adjust Sat, Adjust Hue oder direktes Ziehen ändern die Farbe. AB-, Sat-, Hue- und RGB-Werte vor und nach der Änderung sowie Farbänderungen in LUT/Preview werden angezeigt.

<!-- Source EN PDF p.15, unit 88 -->

![Technische Abbildung aus dem englischen PDF, Seite 15](/docs/rockchip-iq-tools/assets/en-p015-figure-01.png)

<!-- Source EN PDF p.15, unit 89 -->

Abbildung 2-6-5

<!-- Source EN PDF p.15, unit 90 -->

3. Adjust Sat: Der Schieberegler verändert die markierte Farbe zusammen mit benachbarten Farben (2-6-6(a)). Soll nur sie geändert werden, andere Farben mit Rechtsklick sperren; der Punkt wird zum Quadrat und bleibt fest. Adjust Sat verändert dann nur die markierte Farbe (2-6-6(b)).

<!-- Source EN PDF p.15, unit 91 -->

![Technische Abbildung aus dem englischen PDF, Seite 15](/docs/rockchip-iq-tools/assets/en-p015-figure-02.png)

<!-- Source EN PDF p.15, unit 92 -->

(a)

<!-- Source EN PDF p.16, unit 93 -->

![Technische Abbildung aus dem englischen PDF, Seite 16](/docs/rockchip-iq-tools/assets/en-p016-figure-01.png)

<!-- Source EN PDF p.16, unit 94 -->

(b)

<!-- Source EN PDF p.16, unit 95 -->

Abbildung 2-6-6

<!-- Source EN PDF p.16, unit 96 -->

4. After & Before: Bild vor und nach der Anpassung ansehen.

<!-- Source EN PDF p.16, unit 97 -->

5. Reset LUT: LUT-Standardwerte wiederherstellen.

<!-- Source EN PDF p.16, unit 98 -->

6. Image: links/rechts drehen, vertikal/horizontal spiegeln und das angepasste Bild speichern (2-6-7).

<!-- Source EN PDF p.16, unit 99 -->

![Technische Abbildung aus dem englischen PDF, Seite 16](/docs/rockchip-iq-tools/assets/en-p016-figure-02.png)

<!-- Source EN PDF p.16, unit 100 -->

Abbildung 2-6-7

<!-- Source EN PDF p.16, unit 101 -->

7. Options: LUT-Anzeige einstellen, Größe der Markierungspunkte und Linienbreite ändern (2-6-8).

<!-- Source EN PDF p.16, unit 102 -->

![Technische Abbildung aus dem englischen PDF, Seite 16](/docs/rockchip-iq-tools/assets/en-p016-figure-03.png)

<!-- Source EN PDF p.16, unit 103 -->

Abbildung 2-6-8

<!-- Source EN PDF p.17, unit 104 -->

### 2.7 RKISP 3A Analyzer Tool

<!-- Source EN PDF p.17, unit 105 -->

![Technische Abbildung aus dem englischen PDF, Seite 17](/docs/rockchip-iq-tools/assets/en-p017-figure-01.png)

<!-- Source EN PDF p.17, unit 106 -->

Abbildung 2-7-1

<!-- Source EN PDF p.17, unit 107 -->

Mit Connect zu rkaiq_tool_server verbinden und RKISP 3AAnalyzerTool öffnen (2-7-1). URL anpassen und Open für die Vorschau aktivieren. Diese Version unterstützt Statistiken der Module AE und AWB.

<!-- Source EN PDF p.17, unit 108 -->

TimerSet: Intervall der Datenerfassung einstellen.

<!-- Source EN PDF p.17, unit 109 -->

Reverse color: Farbe der Daten in der Vorschau ändern.

<!-- Source EN PDF p.17, unit 110 -->

AE öffnet das Modul mit dynamischem Histogramm in AE Statistics. Die Vorschau wird in 15 * 15 Felder geteilt; jedes zeigt den 12bit-Statistikwert des zugehörigen Blocks. Channel wechselt den Kanal, HDR unterstützt L/M/S-Frame-Statistiken (2-7-2).

<!-- Source EN PDF p.18, unit 111 -->

![Technische Abbildung aus dem englischen PDF, Seite 18](/docs/rockchip-iq-tools/assets/en-p018-figure-01.png)

<!-- Source EN PDF p.18, unit 112 -->

Abbildung 2-7-2

<!-- Source EN PDF p.18, unit 113 -->

AWB gibt den aktuellen Status dynamisch in AWB Statistics aus. Die Vorschau wird in 15 * 15 Felder geteilt, die jeweils Weißpunktanzahl und WBGains des Blocks anzeigen (2-7-3).

<!-- Source EN PDF p.18, unit 114 -->

![Technische Abbildung aus dem englischen PDF, Seite 18](/docs/rockchip-iq-tools/assets/en-p018-figure-02.png)

<!-- Source EN PDF p.18, unit 115 -->

Abbildung 2-7-3

<!-- Source EN PDF p.19, unit 116 -->

## 3 Schnellstart

<!-- Source EN PDF p.19, unit 117 -->

### 3.1 Vorbereitungen

<!-- Source EN PDF p.19, unit 118 -->

Ein großer Teil der ISP-Abstimmung findet auf dem Gerät statt. Dort überträgt ein Dienst Daten zwischen Tuner und AIQ und übernimmt Raw-Aufnahmen sowie weitere Aufgaben. Vor Beginn Dienst und zugehörige Dateien auf das Gerät übertragen und ausführen. Im Folgenden die Vorbereitung für Android und Linux:

<!-- Source EN PDF p.19, unit 119 -->

1. LAN-Verbindung herstellen.

<!-- Source EN PDF p.19, unit 120 -->

2. rkaiq_tool_server starten und die Umgebung konfigurieren. Befehle und Dateien lassen sich per TFTP, serieller Schnittstelle, ADB oder anderen Werkzeugen übertragen; das Beispiel verwendet ADB.

<!-- Source EN PDF p.19, unit 121 -->

#### 3.1.1 Android

<!-- Source EN PDF p.19, unit 122 -->

##### 3.1.1.1 RK356X & RK3588

<!-- Source EN PDF p.19, unit 123 -->

Für Geräte mit kabelgebundenem Netzwerk:

<!-- Source EN PDF p.19, unit 124 -->

1. Gerät per Netzwerkkabel mit dem Router verbinden.

<!-- Source EN PDF p.19, unit 125 -->

2. Geräte-IP mit ifconfig ermitteln.

<!-- Source EN PDF p.19, unit 126 -->

3. PC über Kabel oder WLAN mit demselben Router verbinden.

<!-- Source EN PDF p.19, unit 127 -->

4. PC-IP prüfen und mit ping an der PC- oder Gerätekommandozeile die Verbindung testen.

<!-- Source EN PDF p.19, unit 128 -->

Für Geräte ohne kabelgebundenes Netzwerk, etwa Tablets:

<!-- Source EN PDF p.19, unit 129 -->

1. PC und EVB per USB-Kabel am selben Anschluss wie ADB verbinden.

<!-- Source EN PDF p.19, unit 130 -->

2. Einschalten und das System starten.

<!-- Source EN PDF p.19, unit 131 -->

3. Settings öffnen.

<!-- Source EN PDF p.19, unit 132 -->

4. Network&internet aufrufen.

<!-- Source EN PDF p.19, unit 133 -->

5. Hotspot&tethering aufrufen.

<!-- Source EN PDF p.19, unit 134 -->

6. USB tethering aktivieren.

<!-- Source EN PDF p.19, unit 135 -->

7. Mit adb shell die Geräteshell öffnen.

<!-- Source EN PDF p.19, unit 136 -->

8. IP-Adresse mit ifconfig usb0 anzeigen.

<!-- Source EN PDF p.19, unit 137 -->

9. Die Netzwerkverbindung mit ping auf PC oder Gerät prüfen.

<!-- Source EN PDF p.20, unit 138 -->

Vorgehen zum Starten von rkaiq_tool_server. Liegen Dienst und Abhängigkeiten bereits in den entsprechenden Geräteverzeichnissen, genügt der direkte Start von rkaiq_tool_server.

<!-- Source EN PDF p.20, unit 139 -->

1. rkaiq_tool_server und rkaiq_3A_server im SDK kompilieren.

<!-- Source EN PDF p.20, unit 140 -->

2. SDK-Pfad: external/rkaiq_tool_server. Die Firmware muss eine user-debug-Version sein.

<!-- Source EN PDF p.20, unit 141 -->

3. android.hardware.camera.provider@2.4-service.rc nach /vendor/etc/init/ auf dem Board übertragen.

<!-- Source EN PDF p.20, unit 142 -->

4. In /vendor/etc/init/ mit chmod 644 android.hardware.camera.provider@2.4-service.rc die Rechte ändern.

<!-- Source EN PDF p.20, unit 143 -->

5. rkaiq_tool_server und rkaiq_3A_server nach /vendor/bin/ übertragen.

<!-- Source EN PDF p.20, unit 144 -->

6. In /vendor/bin/ chmod 755 rkaiq_tool_server ausführen; für rkaiq_3A_server entsprechend vorgehen.

<!-- Source EN PDF p.20, unit 145 -->

7. Den Cache mit sync synchronisieren.

<!-- Source EN PDF p.20, unit 146 -->

8. Gerät neu starten.

<!-- Source EN PDF p.20, unit 147 -->

9. setenforce 0 ausführen.

<!-- Source EN PDF p.20, unit 148 -->

10. Kamera-APK öffnen.

<!-- Source EN PDF p.20, unit 149 -->

11. rkaiq_tool_server starten.

<!-- Source EN PDF p.20, unit 150 -->

ADB-Beispiel:

<!-- Source EN PDF p.20, unit 151 -->

```sh
#The following commands are run in cmd on the PC side
adb root
adb remount
adb push android.hardware.camera.provider@2.4-service.rc /vendor/etc/init/
adb push rkaiq_tool_server /vendor/bin/
adb shell

# The following commands are executed in adb shell terminal
chmod 644 /vendor/etc/init/android.hardware.camera.provider@2.4-service.rc
chmod 755 /vendor/bin/rkaiq_tool_server
sync
reboot

# After restart, enter adb shell again
# disable SELinux
setenforce 0
# Manually run the camera apk first
# Then run tool server
/vendor/bin/rkaiq_tool_server &
```

<!-- Source EN PDF p.20, unit 152 -->

Beispiel mit mehreren Kameras:

<!-- Source EN PDF p.20, unit 153 -->

```sh
#If there are 2 sensors in the device and you need to switch to another sensor for tuning, run tool server as follows:
/vendor/bin/rkaiq_tool_server -d 1 &
```

<!-- Source EN PDF p.21, unit 154 -->

Nach dem Übertragen der mit New erzeugten IQ-Anfangsparameter die Kameraanwendung wie folgt zurücksetzen und ToolServer neu starten. Bei Abstürzen, Hängern, fehlgeschlagener Online-Abstimmung oder fehlender Vorschau ebenfalls diese Neuverbindung versuchen.

<!-- Source EN PDF p.21, unit 155 -->

```sh
source /vendor/etc/camera/reset_camera.sh
# run camera apk
/vendor/bin/rkaiq_tool_server &
```

<!-- Source EN PDF p.21, unit 156 -->

#### 3.1.2 Linux

<!-- Source EN PDF p.21, unit 157 -->

##### 3.1.2.1 RK356X & RK3588 & RV1106

<!-- Source EN PDF p.21, unit 158 -->

Für Geräte mit kabelgebundenem Netzwerk:

<!-- Source EN PDF p.21, unit 159 -->

1. Gerät per Netzwerkkabel mit dem Router verbinden.

<!-- Source EN PDF p.21, unit 160 -->

2. Geräte-IP mit ifconfig ermitteln.

<!-- Source EN PDF p.21, unit 161 -->

3. PC über Kabel oder WLAN mit demselben Router verbinden.

<!-- Source EN PDF p.21, unit 162 -->

4. PC-IP prüfen und mit ping an der PC- oder Gerätekommandozeile die Verbindung testen.

<!-- Source EN PDF p.21, unit 163 -->

Für Geräte ohne kabelgebundenes Netzwerk:

<!-- Source EN PDF p.21, unit 164 -->

1. Den RNDIS-Dienst starten.

<!-- Source EN PDF p.21, unit 165 -->

2. Geräte-IP mit ifconfig ermitteln.

<!-- Source EN PDF p.21, unit 166 -->

3. Die Netzwerkverbindung mit ping auf PC oder Gerät prüfen.

<!-- Source EN PDF p.21, unit 167 -->

Vorgehen zum Starten von rkaiq_tool_server. Liegen Dienst und Abhängigkeiten bereits in den entsprechenden Geräteverzeichnissen, genügt der direkte Start von rkaiq_tool_server.

<!-- Source EN PDF p.21, unit 168 -->

1. rkaiq_tool_server und librkmedia.so im SDK kompilieren.

<!-- Source EN PDF p.21, unit 169 -->

2. librkmedia.so nach /data/ auf dem Board übertragen.

<!-- Source EN PDF p.21, unit 170 -->

3. In /data/ chmod 777 librkmedia.so ausführen.

<!-- Source EN PDF p.21, unit 171 -->

4. rkaiq_tool_server nach /data/ auf dem Board übertragen.

<!-- Source EN PDF p.21, unit 172 -->

5. In /data/ chmod 777 rkaiq_tool_server ausführen.

<!-- Source EN PDF p.21, unit 173 -->

6. Den Cache mit sync synchronisieren.

<!-- Source EN PDF p.21, unit 174 -->

7. Gerät neu starten.

<!-- Source EN PDF p.21, unit 175 -->

8. Kameraanwendung starten.

<!-- Source EN PDF p.21, unit 176 -->

9. rkaiq_tool_server starten.

<!-- Source EN PDF p.22, unit 177 -->

ADB-Beispiel:

<!-- Source EN PDF p.22, unit 178 -->

```sh
#The following commands are run in cmd on the PC side
adb root
adb remount
adb push librkmedia.so /data/
adb push rkaiq_tool_server /data/
adb shell

# The following commands are executed in adb shell
chmod 777 /data/rkaiq_tool_server
sync
reboot

# After restart, enter adb shell again
# Run the camera app first
/data/rkaiq_tool_server &
```

<!-- Source EN PDF p.22, unit 179 -->

### 3.2 ToolServer-Parameter

<!-- Source EN PDF p.22, unit 180 -->

Parameter und Konfiguration von rkaiq_tool_server:

<!-- Source EN PDF p.22, unit 181 -->

`-d`: Sensor über Gerätenummer 0/1/2 auswählen, Standard 0. `media-ctl -p -d /dev/mediaX` (X=0/1/2/3...) zeigt die Topologie mit Sensornamen. Bei `m01_b_ov8858 2-0036` entspricht m01 dem Schema mNN mit zweistelligem Sensorindex NN. Daher `-d 1` verwenden; eine führende Null ist nicht erforderlich.

<!-- Source EN PDF p.22, unit 182 -->

`-s`: Videoknoten für YUV-Aufnahmen. Standardmäßig wird iqtool gesucht; mainPath oder selfPath können manuell angegeben werden.

<!-- Source EN PDF p.22, unit 183 -->

`-r`: RTSP-Schalter, 0 aus, 1 ein, Standard 0. Nach Aktivierung kann Start RTSP in CaptureTool verwendet werden.

<!-- Source EN PDF p.22, unit 184 -->

`-i`: IQ-Dateipfad; bei Pfadänderungen mit anpassen. Bei `-r` 0 kann er ignoriert werden.

<!-- Source EN PDF p.22, unit 185 -->

`-w/-h`: Ausgabeauflösung der RTSP-Vorschau, ausgehend von der ISP-Ausgabe skaliert; Standard 1920/1080.

<!-- Source EN PDF p.22, unit 186 -->

`-n`: Pufferanzahl für fortlaufende Online-Raw-Aufnahmen, Standard 4. Für viele aufeinanderfolgende Raw-Bilder sollte der Wert erhöht werden.

<!-- Source EN PDF p.22, unit 187 -->

`-f`: Sendebildrate der Offline-Frame-Funktion; die Quelle nennt als Standard 10 frames.

<!-- Source EN PDF p.23, unit 188 -->

### 3.3 Plattform und IP-Adresse einstellen

<!-- Source EN PDF p.23, unit 189 -->

1. RKISP Tuner öffnen; das Anfangskonfigurationsfenster zeigt Abbildung 3-3-1.

<!-- Source EN PDF p.23, unit 190 -->

![Technische Abbildung aus dem englischen PDF, Seite 23](/docs/rockchip-iq-tools/assets/en-p023-figure-01.png)

<!-- Source EN PDF p.23, unit 191 -->

Abbildung 3-3-1

<!-- Source EN PDF p.23, unit 192 -->

2. Chip auswählen und die zuvor ermittelte IP eingeben. Standardport ist 5543; ohne besondere Anforderungen nicht ändern. rkaiq_tool_server muss korrekt laufen. Connect to rkaiq_tool_server anklicken. Für die Vorschau mit Fremdwerkzeugen verweist die Quelle auf Punkt 3 in Abschnitt 3.7.

<!-- Source EN PDF p.23, unit 193 -->

3. OK anklicken; die Abstimmungsoberfläche des gewählten Chips und der Version zeigt 3-3-2.

<!-- Source EN PDF p.23, unit 194 -->

![Technische Abbildung aus dem englischen PDF, Seite 23](/docs/rockchip-iq-tools/assets/en-p023-figure-02.png)

<!-- Source EN PDF p.23, unit 195 -->

Abbildung 3-3-2

<!-- Source EN PDF p.24, unit 196 -->

### 3.4 Neue Sensorkonfiguration und IQ-Datei erstellen

<!-- Source EN PDF p.24, unit 197 -->

1. File → New wählen.

<!-- Source EN PDF p.24, unit 198 -->

![Technische Abbildung aus dem englischen PDF, Seite 24](/docs/rockchip-iq-tools/assets/en-p024-figure-01.png)

<!-- Source EN PDF p.24, unit 199 -->

Abbildung 3-4-1

<!-- Source EN PDF p.24, unit 200 -->

![Technische Abbildung aus dem englischen PDF, Seite 24](/docs/rockchip-iq-tools/assets/en-p024-figure-02.png)

<!-- Source EN PDF p.24, unit 201 -->

Abbildung 3-4-2

<!-- Source EN PDF p.24, unit 202 -->

2. New rechts neben der Sensorliste öffnet Sensor Information.

<!-- Source EN PDF p.24, unit 203 -->

![Technische Abbildung aus dem englischen PDF, Seite 24](/docs/rockchip-iq-tools/assets/en-p024-figure-03.png)

<!-- Source EN PDF p.24, unit 204 -->

Abbildung 3-4-3

<!-- Source EN PDF p.25, unit 205 -->

3. Sensor Information ausfüllen und File → Export To Sensor List wählen.

<!-- Source EN PDF p.25, unit 206 -->

![Technische Abbildung aus dem englischen PDF, Seite 25](/docs/rockchip-iq-tools/assets/en-p025-figure-01.png)

<!-- Source EN PDF p.25, unit 207 -->

Abbildung 3-4-4

<!-- Source EN PDF p.25, unit 208 -->

4. Sensornamen eingeben und die Konfiguration mit OK speichern.

<!-- Source EN PDF p.25, unit 209 -->

![Technische Abbildung aus dem englischen PDF, Seite 25](/docs/rockchip-iq-tools/assets/en-p025-figure-02.png)

<!-- Source EN PDF p.25, unit 210 -->

Abbildung 3-4-5

<!-- Source EN PDF p.25, unit 211 -->

5. Konfigurationsseite schließen. Im Fenster Generated New IQ File erscheint der neue Sensor in der Liste.

<!-- Source EN PDF p.25, unit 212 -->

![Technische Abbildung aus dem englischen PDF, Seite 25](/docs/rockchip-iq-tools/assets/en-p025-figure-03.png)

<!-- Source EN PDF p.25, unit 213 -->

Abbildung 3-4-6

<!-- Source EN PDF p.25, unit 214 -->

6. Sensor auswählen und mit Generate IQ File die IQ-Datei erzeugen.

<!-- Source EN PDF p.25, unit 215 -->

### 3.5 Parameter laden, speichern und Szene auswählen

<!-- Source EN PDF p.25, unit 216 -->

1. File → Open... wählen und die IQ-Datei auswählen.

<!-- Source EN PDF p.25, unit 217 -->

![Technische Abbildung aus dem englischen PDF, Seite 25](/docs/rockchip-iq-tools/assets/en-p025-figure-04.png)

<!-- Source EN PDF p.25, unit 218 -->

Abbildung 3-5-1

<!-- Source EN PDF p.26, unit 219 -->

2. Scene Selection zeigt die Szenengruppen der IQ-Datei. Gewünschte Szene auswählen und OK anklicken.

<!-- Source EN PDF p.26, unit 220 -->

![Technische Abbildung aus dem englischen PDF, Seite 26](/docs/rockchip-iq-tools/assets/en-p026-figure-01.png)

<!-- Source EN PDF p.26, unit 221 -->

Abbildung 3-5-2

<!-- Source EN PDF p.26, unit 222 -->

3. IQ-Datei und UI-Vorlage werden verglichen; Abweichungen erscheinen in Different Member List. Links unter Missing stehen in IQ fehlende Parameter. Rechts unter Existed stehen IQ-Parameter, die in der UI-Vorlage entfernt oder umbenannt wurden.

<!-- Source EN PDF p.26, unit 223 -->

![Technische Abbildung aus dem englischen PDF, Seite 26](/docs/rockchip-iq-tools/assets/en-p026-figure-02.png)

<!-- Source EN PDF p.26, unit 224 -->

Abbildung 3-5-3

<!-- Source EN PDF p.27, unit 225 -->

4. File → Save As... (3-5-4, 3-5-5) speichert die Parameter in der in Schritt 2 gewählten oder einer neuen Szene. Nur ausgewählte Module lassen sich speichern; rechts werden die geänderten Parameter angezeigt.

<!-- Source EN PDF p.27, unit 226 -->

![Technische Abbildung aus dem englischen PDF, Seite 27](/docs/rockchip-iq-tools/assets/en-p027-figure-01.png)

<!-- Source EN PDF p.27, unit 227 -->

Abbildung 3-5-4

<!-- Source EN PDF p.27, unit 228 -->

![Technische Abbildung aus dem englischen PDF, Seite 27](/docs/rockchip-iq-tools/assets/en-p027-figure-02.png)

<!-- Source EN PDF p.27, unit 229 -->

Abbildung 3-5-5

<!-- Source EN PDF p.27, unit 230 -->

### 3.6 Sensorinformationen bearbeiten

<!-- Source EN PDF p.27, unit 231 -->

1. IQ-Parameterdatei wie im vorherigen Abschnitt laden.

<!-- Source EN PDF p.27, unit 232 -->

2. Tuning → Edit Sensor Information öffnet die Sensor-Info-Konfiguration.

<!-- Source EN PDF p.27, unit 233 -->

![Technische Abbildung aus dem englischen PDF, Seite 27](/docs/rockchip-iq-tools/assets/en-p027-figure-03.png)

<!-- Source EN PDF p.27, unit 234 -->

Abbildung 3-6-1

<!-- Source EN PDF p.28, unit 235 -->

![Technische Abbildung aus dem englischen PDF, Seite 28](/docs/rockchip-iq-tools/assets/en-p028-figure-01.png)

<!-- Source EN PDF p.28, unit 236 -->

Abbildung 3-6-2

<!-- Source EN PDF p.28, unit 237 -->

3. File → Import From Sensor List wählen.

<!-- Source EN PDF p.28, unit 238 -->

![Technische Abbildung aus dem englischen PDF, Seite 28](/docs/rockchip-iq-tools/assets/en-p028-figure-02.png)

<!-- Source EN PDF p.28, unit 239 -->

Abbildung 3-6-3

<!-- Source EN PDF p.28, unit 240 -->

4. Sensor wie nachfolgend gezeigt auswählen.

<!-- Source EN PDF p.28, unit 241 -->

![Technische Abbildung aus dem englischen PDF, Seite 28](/docs/rockchip-iq-tools/assets/en-p028-figure-03.png)

<!-- Source EN PDF p.28, unit 242 -->

Abbildung 3-6-4

<!-- Source EN PDF p.29, unit 243 -->

5. Mit OK die Konfigurationsparameter importieren.

<!-- Source EN PDF p.29, unit 244 -->

6. Sensor Information schließen.

<!-- Source EN PDF p.29, unit 245 -->

7. Fehlt der Sensorname in der Liste, anhand des Sensordatenblatts eine neue Konfiguration in Sensor Information erstellen.

<!-- Source EN PDF p.29, unit 246 -->

### 3.7 Raw- und YUV-Bilder aufnehmen

<!-- Source EN PDF p.29, unit 247 -->

#### 3.7.1 Raw-Bilder offline aufnehmen

<!-- Source EN PDF p.29, unit 248 -->

1. Tools → RK Capture Tool wählen.

<!-- Source EN PDF p.29, unit 249 -->

![Technische Abbildung aus dem englischen PDF, Seite 29](/docs/rockchip-iq-tools/assets/en-p029-figure-01.png)

<!-- Source EN PDF p.29, unit 250 -->

Abbildung 3-7-1-1

<!-- Source EN PDF p.29, unit 251 -->

2. Geräte-IP prüfen und Device Status anklicken. Ist Tuner korrekt mit rkaiq_tool_server verbunden, erscheint Device is Ready.

<!-- Source EN PDF p.29, unit 252 -->

![Technische Abbildung aus dem englischen PDF, Seite 29](/docs/rockchip-iq-tools/assets/en-p029-figure-02.png)

<!-- Source EN PDF p.29, unit 253 -->

Abbildung 3-7-1-2

<!-- Source EN PDF p.29, unit 254 -->

3. Start RTSP Streaming aktiviert Kamera und RTSP-Videostream optional.

<!-- Source EN PDF p.30, unit 255 -->

1) Android: Nach Start RTSP Streaming lässt sich `rtsp://192.168.10.104:1234/v` mit einem Fremdplayer öffnen. Die Kamera-APK auf dem Gerät wird dabei getrennt. Für deren Nutzung zuerst Stop RTSP Streaming und dann Switch To Tuning Mode wählen.

<!-- Source EN PDF p.30, unit 256 -->

2) Linux: Andere laufende Kameraanwendungen auf dem Board beenden und danach ToolServer starten. Nach Start RTSP Streaming `rtsp://192.168.10.104/live/0` mit einem Fremdplayer öffnen.

<!-- Source EN PDF p.30, unit 257 -->

4. Namen des abzustimmenden Sensors auswählen.

<!-- Source EN PDF p.30, unit 258 -->

![Technische Abbildung aus dem englischen PDF, Seite 30](/docs/rockchip-iq-tools/assets/en-p030-figure-01.png)

<!-- Source EN PDF p.30, unit 259 -->

Abbildung 3-7-1-3

<!-- Source EN PDF p.30, unit 260 -->

5. Passende Auflösung, Lichtquelle und Modulnamen zur Unterscheidung auswählen.

<!-- Source EN PDF p.30, unit 261 -->

6. Gain, Exposure Time, Anzahl und weitere Parameter einstellen.

<!-- Source EN PDF p.30, unit 262 -->

7. Start Manual Capture anklicken.

<!-- Source EN PDF p.30, unit 263 -->

8. Die Raw-Aufnahme erscheint rechts in Raw Preview & Statistics.

<!-- Source EN PDF p.30, unit 264 -->

9. Dort stehen auch Histogramm, maximale/minimale/mittlere Helligkeit, globaler wb gain und weitere Daten.

<!-- Source EN PDF p.30, unit 265 -->

10. Raw-Bilder werden standardmäßig unter `./raw_capture/module name/` gespeichert.

<!-- Source EN PDF p.31, unit 266 -->

![Technische Abbildung aus dem englischen PDF, Seite 31](/docs/rockchip-iq-tools/assets/en-p031-figure-01.png)

<!-- Source EN PDF p.31, unit 267 -->

Abbildung 3-7-1-4: einzelne Raw-Aufnahme mit Gain=5x ExpTime=0.01s

<!-- Source EN PDF p.31, unit 268 -->

#### 3.7.2 YUV-Bilder online aufnehmen

<!-- Source EN PDF p.31, unit 269 -->

1. Kameraanwendung öffnen und die Gerätevorschau prüfen.

<!-- Source EN PDF p.31, unit 270 -->

2. ToolServer starten, IP im Werkzeug eingeben und verbinden.

<!-- Source EN PDF p.31, unit 271 -->

3. Online Capture wählen und Sensor Name als Präfix des YUV-Dateinamens eingeben.

<!-- Source EN PDF p.31, unit 272 -->

4. Für aufeinanderfolgende Aufnahmen die Anzahl in Frame Num einstellen.

<!-- Source EN PDF p.31, unit 273 -->

5. Capture YUV anklicken. Das Bild wird angezeigt und unter `raw_capture/yuv/` gespeichert (3-7-2-1).

<!-- Source EN PDF p.31, unit 274 -->

![Technische Abbildung aus dem englischen PDF, Seite 31](/docs/rockchip-iq-tools/assets/en-p031-figure-02.png)

<!-- Source EN PDF p.31, unit 275 -->

Abbildung 3-7-2-1

<!-- Source EN PDF p.32, unit 276 -->

#### 3.7.3 Raw-Bilder online aufnehmen

<!-- Source EN PDF p.32, unit 277 -->

1. Kameraanwendung öffnen und die Gerätevorschau prüfen.

<!-- Source EN PDF p.32, unit 278 -->

2. ToolServer starten, IP im Werkzeug eingeben und verbinden.

<!-- Source EN PDF p.32, unit 279 -->

3. Online Capture wählen und Sensor Name als Präfix des Raw-Dateinamens eingeben.

<!-- Source EN PDF p.32, unit 280 -->

4. Für aufeinanderfolgende Aufnahmen die Anzahl in Frame Num einstellen.

<!-- Source EN PDF p.32, unit 281 -->

5. Capture Raw anklicken. Das Bild erscheint in der Vorschau und wird unter `raw_capture/` gespeichert (3-7-3-1).

<!-- Source EN PDF p.32, unit 282 -->

![Technische Abbildung aus dem englischen PDF, Seite 32](/docs/rockchip-iq-tools/assets/en-p032-figure-01.png)

<!-- Source EN PDF p.32, unit 283 -->

Abbildung 3-7-3-1

<!-- Source EN PDF p.32, unit 284 -->

Maximale Anzahl aufeinanderfolgender Online-Raw-Aufnahmen

<!-- Source EN PDF p.32, unit 285 -->

Die maximale Frameanzahl hängt von den angeforderten Puffern ab und wird über `-n` in ToolServer eingestellt. Mehr Puffer erlauben mehr aufeinanderfolgende Aufnahmen. Sind weniger Puffer als Frames vorhanden, können Frames verloren gehen. Die zulässige Anzahl hängt außerdem von den Kernelpuffern und dem verfügbaren Speicher ab. Ein Kernelbeispiel folgt.

<!-- Source EN PDF p.33, unit 286 -->

![Technische Abbildung aus dem englischen PDF, Seite 33](/docs/rockchip-iq-tools/assets/en-p033-figure-01.png)

Das Patchbild ist nachfolgend vollständig abgeschrieben und bleibt zum Vergleich erhalten. Es handelt sich um ein Quellfragment, nicht um einen für beliebige Kernel geprüften Patch.

```diff
diff --git a/include/media/videobuf2-core.h b/include/media/videobuf2-core.h
index 3f4f171..ee359c5 100644
--- a/include/media/videobuf2-core.h
+++ b/include/media/videobuf2-core.h
@@ -19,7 +19,7 @@
 #include <linux/bitops.h>
 #include <media/media-request.h>

-#define VB2_MAX_FRAME (64)
+#define VB2_MAX_FRAME (128)
 #define VB2_MAX_PLANES (8)

 /**
diff --git a/include/uapi/linux/videodev2.h b/include/uapi/linux/videodev2.h
index d900af7..592fccc 100644
--- a/include/uapi/linux/videodev2.h
+++ b/include/uapi/linux/videodev2.h
@@ -70,7 +70,7 @@
 /*
  * Common stuff for both V4L1 and V4L2
  * Moved from videodev.h
  */
-#define VIDEO_MAX_FRAME        64
+#define VIDEO_MAX_FRAME        128
 #define VIDEO_MAX_PLANES       8
```

<!-- Source EN PDF p.34, unit 287 -->

## 4 Kalibrierung erläutert

<!-- Source EN PDF p.34, unit 288 -->

Die Kalibrierung jedes Moduls umfasst drei Schritte:

<!-- Source EN PDF p.34, unit 289 -->

1. Aufnahme: Raw-Bilder der Kalibriertafel oder Szene mit für das Modul geeigneter Belichtung aufnehmen.

<!-- Source EN PDF p.34, unit 290 -->

2. Berechnung: Raw-Bilder importieren und Kalibrierparameter berechnen. Einzelne Module erlauben bei Bedarf eine Feinabstimmung.

<!-- Source EN PDF p.34, unit 291 -->

3. Bestätigung und Speicherung: Parameter anhand der Kriterien des jeweiligen Moduls prüfen.

<!-- Source EN PDF p.34, unit 292 -->

### 4.1 Raw-Bilder aufnehmen

<!-- Source EN PDF p.34, unit 293 -->

Die Quelle verweist auf 3.6; dort steht jedoch die Sensorbearbeitung, während die Aufnahme in 3.7 beschrieben wird. Die abweichende Verweisung ist dokumentiert.

<!-- Source EN PDF p.34, unit 294 -->

### 4.2 BLC-Kalibrierung

<!-- Source EN PDF p.34, unit 295 -->

#### 4.2.1 Grundlagen

<!-- Source EN PDF p.34, unit 296 -->

Aufgrund des Black Level liefert der Sensor auch ohne äußeres Licht eine Spannung, die vom Ausgangssignal abzuziehen ist. Dafür sind unbelichtete Pixel reserviert. Ihre Werte liefern den Optical Black Level in Echtzeit: `Raw = Sensor Input - Optical Black Level`.

<!-- Source EN PDF p.34, unit 297 -->

Mit Blick auf das Signal-Rausch-Verhältnis wird üblicherweise ein grundlegender Pedestal berücksichtigt: `Raw = Sensor Input - Optical Black Level - Pedestal`.

<!-- Source EN PDF p.34, unit 298 -->

Je nach Sensorkonfiguration lässt sich der endgültige BLC-Korrekturwert aus RAW-Aufnahmen einer vollständig dunklen Szene bestimmen.

<!-- Source EN PDF p.34, unit 299 -->

Der Korrekturwert hängt hauptsächlich von Gain und Temperature ab und muss für verschiedene ISO-Werte separat kalibriert werden. BLC ist ein Offset, den andere Module bei der Kalibrierung abziehen müssen, um korrekte Parameter zu erhalten.

<!-- Source EN PDF p.34, unit 300 -->

RV1106: Um bei Bayer2D/Bayer3D mehr dunkle Bildinformationen zu erhalten, ergänzt BLC die Sensor-OB-Konfiguration, also den genannten Pedestal. Einige Hersteller erlauben die Einstellung in der Treibersequenz, andere verwenden feste Werte. Diese lassen sich

<!-- Source EN PDF p.35, unit 301 -->

im Datenblatt oder Treibercode nachschlagen. Ist der Wert schwer festzustellen, kann der Referenzwert aus 4.2.4 oder der bei Gain=1x berechnete mittlere BLC-Wert jedes Kanals verwendet werden.

<!-- Source EN PDF p.35, unit 302 -->

#### 4.2.2 Anforderungen an Raw-Bilder

<!-- Source EN PDF p.35, unit 303 -->

1. Objektiv bei der Aufnahme lichtdicht abdecken.

<!-- Source EN PDF p.35, unit 304 -->

2. Gain=1x, 2x, 4x, 8x, 16x...Max durchlaufen; unterstützt der Treiber maximal 40x, gilt Max=32.

<!-- Source EN PDF p.35, unit 305 -->

3. Die Belichtungszeit beeinflusst die BLC-Kalibrierung nicht und kann einheitlich 10ms betragen.

<!-- Source EN PDF p.35, unit 306 -->

#### 4.2.3 Raw-Bilder aufnehmen

<!-- Source EN PDF p.35, unit 307 -->

1. RK Capture Tool gemäß 3.1/3.2 öffnen und verbinden. Lichtquelle unknow (kein Licht), Modul BLC wählen.

<!-- Source EN PDF p.35, unit 308 -->

2. Gerät oder Modul in eine dunkle Umgebung stellen und das Objektiv mit schwarzem Tuch oder Deckel dicht verschließen.

<!-- Source EN PDF p.35, unit 309 -->

3. In Manual Exposure Step und 2^n aktivieren. Gemäß Gain Range Gain Begin=1.0, Gain End=Max und ExpTime=0.010 setzen.

<!-- Source EN PDF p.35, unit 310 -->

4. Start Manual Capture nimmt Raw-Bilder in Schritten von Zweierpotenzen auf.

<!-- Source EN PDF p.35, unit 311 -->

5. Raw-Bilder erscheinen rechts; mit der Auswahlliste das gewünschte Bild wählen.

<!-- Source EN PDF p.35, unit 312 -->

![Technische Abbildung aus dem englischen PDF, Seite 35](/docs/rockchip-iq-tools/assets/en-p035-figure-01.png)

<!-- Source EN PDF p.35, unit 313 -->

Abbildung 4-2-3-1

<!-- Source EN PDF p.36, unit 314 -->

#### 4.2.4 Kalibrierablauf

<!-- Source EN PDF p.36, unit 315 -->

![Technische Abbildung aus dem englischen PDF, Seite 36](/docs/rockchip-iq-tools/assets/en-p036-figure-01.png)

<!-- Source EN PDF p.36, unit 316 -->

Abbildung 4-2-4-1: BLC-Kalibrierergebnisse

<!-- Source EN PDF p.36, unit 317 -->

1. In Calibration Tool links oben Edit Options öffnen und Raw-Abmessungen, Bittiefe und Bayer-Reihenfolge eingeben.

<!-- Source EN PDF p.36, unit 318 -->

2. Auf der BLC-Seite Load Raw Files wählen und den Raw-Ordner auswählen.

<!-- Source EN PDF p.36, unit 319 -->

3. Importierte Raw-Bilder erscheinen in der rechten Liste.

<!-- Source EN PDF p.36, unit 320 -->

4. Calibrate starten. Bei RV1106 muss für die Linear-Kalibrierung zuerst Sensor OB eingegeben werden. Übliche Referenzwerte:

<!-- Source EN PDF p.36, unit 321 -->

| Hersteller | OB-Referenzwert |
| --- | --- |
| GalaxyCore(gc) | 256 |
| OmniVision(ov/os) | 256 |
| Samsung(s5k) | 256 |
| SmartSens(sc) | 256 |
| Sony(imx) | In der Treibersequenz konfigurierbar; Datenblatt und Treibercode sind maßgeblich. |

<!-- Source EN PDF p.36, unit 322 -->

5. Die berechnete Black Level Curve erscheint im oberen Diagramm.

<!-- Source EN PDF p.36, unit 323 -->

6. Die BLC-Werte stehen in der Tabelle; Save anklicken.

Hinweise:

<!-- Source EN PDF p.36, unit 324 -->

1. Auf einfallendes Licht von Betriebs- und Statusanzeigen achten.

<!-- Source EN PDF p.36, unit 325 -->

2. Ein falscher BLC-Wert beeinflusst alle nachfolgenden Module. Vor deren Kalibrierung die BLC-Ergebnisse prüfen.

<!-- Source EN PDF p.37, unit 326 -->

### 4.3 LSC-Kalibrierung

<!-- Source EN PDF p.37, unit 327 -->

#### 4.3.1 Grundlagen

<!-- Source EN PDF p.37, unit 328 -->

Luma Shading entsteht durch die optischen Eigenschaften des Objektivs. Als konvexe Linse betrachtet, bündelt sein Zentrum Licht stärker als die Ränder; der Sensor empfängt deshalb in der Mitte mehr Licht als in den Ecken. Für eine verzerrungsfreie Kamera folgt der Beleuchtungsabfall dieser Formel:

<!-- Source EN PDF p.37, unit 329 -->

![Technische Abbildung aus dem englischen PDF, Seite 37](/docs/rockchip-iq-tools/assets/en-p037-figure-01.png)

<!-- Source EN PDF p.37, unit 330 -->

`cos^4(theta)`

<!-- Source EN PDF p.37, unit 331 -->

#### 4.3.2 Anforderungen an Raw-Bilder

<!-- Source EN PDF p.37, unit 332 -->

1. Diffusor vor das Objektiv setzen oder DNP-Lichtkasten, Ulbrichtkugel beziehungsweise vergleichbare Ausrüstung verwenden.

<!-- Source EN PDF p.37, unit 333 -->

2. Im Lichtkasten mit Normlicht aufnehmen; empfohlen sind HZ, A, CWF, TL84, D50, D65 und D75.

<!-- Source EN PDF p.37, unit 334 -->

3. Gegen Flimmern von Wechsellicht die Belichtungszeit auf ein ganzzahliges Vielfaches von 10ms setzen.

<!-- Source EN PDF p.37, unit 335 -->

4. Die maximale Raw-Helligkeit liegt bei etwa 200 (8bit); die minimale muss deutlich über dem zuvor kalibrierten Schwarzwert liegen.

<!-- Source EN PDF p.37, unit 336 -->

5. Empfohlen wird der nachfolgend gezeigte Diffusor.

<!-- Source EN PDF p.37, unit 337 -->

![Technische Abbildung aus dem englischen PDF, Seite 37](/docs/rockchip-iq-tools/assets/en-p037-figure-02.png)

<!-- Source EN PDF p.37, unit 338 -->

Abbildung 4-3-2-1: Opaldiffusor

<!-- Source EN PDF p.37, unit 339 -->

#### 4.3.3 Raw-Bilder aufnehmen

<!-- Source EN PDF p.37, unit 340 -->

1. RK Capture Tool gemäß 3.1/3.2 öffnen, verbinden und LSC als Modul wählen.

<!-- Source EN PDF p.37, unit 341 -->

2. Modul im Lichtkasten mit HZ-Licht betreiben und den Diffusor nah vor das Objektiv setzen.

<!-- Source EN PDF p.38, unit 342 -->

3. HZ wählen, in Auto Exposure Search Exposure by Max Luma (8bit) und Anti Flicker (50hz) aktivieren. Rechts die maximale Zielhelligkeit auf 200±10% und Frame Number = 1 setzen.

<!-- Source EN PDF p.38, unit 343 -->

4. Start Auto Capture wählen. Das Werkzeug sucht automatisch eine Belichtung bis zur vorgegebenen Maximalhelligkeit.

<!-- Source EN PDF p.38, unit 344 -->

5. Lichtquelle auf A und ihren Namen auf A ändern. Schritt 4 für sämtliche Lichtquellen wiederholen.

<!-- Source EN PDF p.38, unit 345 -->

![Technische Abbildung aus dem englischen PDF, Seite 38](/docs/rockchip-iq-tools/assets/en-p038-figure-01.png)

<!-- Source EN PDF p.38, unit 346 -->

Abbildung 4-3-3-1

<!-- Source EN PDF p.38, unit 347 -->

#### 4.3.4 Kalibrierablauf

<!-- Source EN PDF p.38, unit 348 -->

1. In Calibration Tool links oben Edit Options öffnen und Raw-Größe, Bittiefe und Bayer-Reihenfolge eingeben.

<!-- Source EN PDF p.38, unit 349 -->

2. LSC auswählen und mit Load Raw Files alle Raw-Bilder importieren.

<!-- Source EN PDF p.38, unit 350 -->

3. Die importierten Bilder erscheinen im oberen Fenster.

<!-- Source EN PDF p.38, unit 351 -->

4. Light Fall off auf 100% setzen.

<!-- Source EN PDF p.38, unit 352 -->

5. Calibrate starten.

<!-- Source EN PDF p.38, unit 353 -->

6. Nach der Kalibrierung auf der Ergebnisseite die Raw-Bilder aller Lichtquellen prüfen.

<!-- Source EN PDF p.38, unit 354 -->

7. Save anklicken.

<!-- Source EN PDF p.38, unit 355 -->

8. Light Fall off auf 70% ändern und Schritte 5–7 wiederholen.

<!-- Source EN PDF p.39, unit 356 -->

![Technische Abbildung aus dem englischen PDF, Seite 39](/docs/rockchip-iq-tools/assets/en-p039-figure-01.png)

<!-- Source EN PDF p.39, unit 357 -->

Abbildung 4-3-4-1

<!-- Source EN PDF p.39, unit 358 -->

![Technische Abbildung aus dem englischen PDF, Seite 39](/docs/rockchip-iq-tools/assets/en-p039-figure-02.png)

<!-- Source EN PDF p.39, unit 359 -->

Abbildung 4-3-4-2

<!-- Source EN PDF p.39, unit 360 -->

Bei zu hellem oder zu dunklem Licht findet das Werkzeug eventuell keine passende Belichtung. Mögliche Abhilfen:

<!-- Source EN PDF p.39, unit 361 -->

1. Helligkeit der Lichtquelle anpassen.

<!-- Source EN PDF p.39, unit 362 -->

2. ND-Filter verwenden.

<!-- Source EN PDF p.40, unit 363 -->

3. Objektivausrichtung ändern.

<!-- Source EN PDF p.40, unit 364 -->

4. Gain Range oder Exp Range anpassen.

<!-- Source EN PDF p.40, unit 365 -->

5. Maximale Helligkeit oder Schwellwert der automatischen Belichtung ändern.

<!-- Source EN PDF p.40, unit 366 -->

6. Manuell belichten; als Mindestbedingung muss die minimale Helligkeit deutlich über dem zuvor kalibrierten Schwarzwert liegen.

<!-- Source EN PDF p.40, unit 367 -->

### 4.4 AWB-Kalibrierung

<!-- Source EN PDF p.40, unit 368 -->

#### 4.4.1 Einführung

<!-- Source EN PDF p.40, unit 369 -->

Kalibriert werden die Raw-Weißpunktbedingungen in XY, UV und YUV, die Parameter des einfachen Farbalgorithmus sowie Weißabgleichsverstärkungen unter Normlicht.

<!-- Source EN PDF p.40, unit 370 -->

#### 4.4.2 Anforderungen an Raw-Bilder

<!-- Source EN PDF p.40, unit 371 -->

Vorbereitung der Raw-Aufnahme:

<!-- Source EN PDF p.40, unit 372 -->

1. Ausrüstung: X-Rite 24 ColorChecker und Lichtkasten mit D75, D65, D50, TL84, CWF, A, HZ.

<!-- Source EN PDF p.40, unit 373 -->

2. Belichtung so einstellen, dass der Maximalwert des hellsten weißen Felds bei [150-240] liegt, innerhalb dessen möglichst hell. Wird dasselbe Raw-Bild für CCM verwendet, sollte es dunkler sein.

<!-- Source EN PDF p.40, unit 374 -->

3. ColorChecker belegt mehr als 1/9 des Bildes.

Raw-Aufnahmeverfahren:

<!-- Source EN PDF p.40, unit 375 -->

1. RK Capture Tool gemäß 3.1/3.2 öffnen, verbinden und CCM_AWB wählen.

<!-- Source EN PDF p.40, unit 376 -->

2. Gerät und ColorChecker im Lichtkasten so ausrichten, dass die Tafel möglichst groß in der Bildmitte liegt. Gerät nicht bewegen.

<!-- Source EN PDF p.40, unit 377 -->

3. Lichtkasten einschalten und HZ wählen.

<!-- Source EN PDF p.40, unit 378 -->

4. HZ wählen, in Auto Exposure Search Exposure By Max Luma (8bit) und Anti Flicker (50hz) aktivieren. Maximale Zielhelligkeit 200±10%, Frame Number = 1. Falls bei 1x Gain und ganzzahligen Vielfachen von 10ms kein Raw-Bild entsteht, Anti-Flicker (50hz) deaktivieren und erneut versuchen.

<!-- Source EN PDF p.41, unit 379 -->

![Technische Abbildung aus dem englischen PDF, Seite 41](/docs/rockchip-iq-tools/assets/en-p041-figure-01.png)

<!-- Source EN PDF p.41, unit 380 -->

Abbildung 4-4-2-1

<!-- Source EN PDF p.41, unit 381 -->

5. Start Auto Capture sucht automatisch eine passende Belichtung bis zur vorgegebenen Maximalhelligkeit.

<!-- Source EN PDF p.41, unit 382 -->

6. Lichtquelle und Namen auf A ändern und die vorherigen Schritte für alle Lichtquellen wiederholen.

<!-- Source EN PDF p.41, unit 383 -->

Beispiele der Kalibrier-Raw-Bilder nach dem Demosaicing:

<!-- Source EN PDF p.41, unit 384 -->

![Technische Abbildung aus dem englischen PDF, Seite 41](/docs/rockchip-iq-tools/assets/en-p041-figure-02.png)

<!-- Source EN PDF p.41, unit 385 -->

Abbildung 4-4-2-2

<!-- Source EN PDF p.42, unit 386 -->

#### 4.4.3 Kalibrierwerkzeug

<!-- Source EN PDF p.42, unit 387 -->

1. Weißpunktbedingungen im UV- und XY-Raum sowie TH im YUV-Raum einstellen.

<!-- Source EN PDF p.42, unit 388 -->

![Technische Abbildung aus dem englischen PDF, Seite 42](/docs/rockchip-iq-tools/assets/en-p042-figure-01.png)

<!-- Source EN PDF p.42, unit 389 -->

Abbildung 4-4-3-1

<!-- Source EN PDF p.42, unit 390 -->

![Technische Abbildung aus dem englischen PDF, Seite 42](/docs/rockchip-iq-tools/assets/en-p042-figure-02.png)

<!-- Source EN PDF p.42, unit 391 -->

Abbildung 4-4-3-2

<!-- Source EN PDF p.42, unit 392 -->

2. Weißpunktbedingungen in UV und XY anpassen:

<!-- Source EN PDF p.42, unit 393 -->

a) Vier Ecken des Weißpunktbereichs einer Lichtquelle im Koordinatensystem ziehen, um Lage und Größe zu ändern.

<!-- Source EN PDF p.42, unit 394 -->

b) In freien Koordinatenbereichen ziehen, um den Anzeigebereich zu ändern.

<!-- Source EN PDF p.42, unit 395 -->

c) Mit dem Mausrad den Maßstab ändern.

<!-- Source EN PDF p.42, unit 396 -->

d) Exclude WPC Range legt Nichtweißpunktbereiche und zusätzliche Lichtquellen-Weißpunktbereiche fest.

<!-- Source EN PDF p.42, unit 397 -->

3. AWB Simulation erkennt Weißpunkte im Originalbild, berechnet WB Gain und Weißpunktanzahl und bildet ausgewählte Pixel auf UV und XY ab, um die Bedingungen zu prüfen.

<!-- Source EN PDF p.43, unit 398 -->

![Technische Abbildung aus dem englischen PDF, Seite 43](/docs/rockchip-iq-tools/assets/en-p043-figure-01.png)

<!-- Source EN PDF p.43, unit 399 -->

Abbildung 4-4-3-3

<!-- Source EN PDF p.44, unit 400 -->

a) Nach dem Raw-Import mit LoadImage erscheinen Weißpunktinformationen. Unterschiedliche Lichtquellen haben unterschiedliche Farben. Die Anzahl im mittleren und großen Rahmen sowie aufsummierte RGain-/BGain-Werte erscheinen in WP Number, RGain und BGain.

<!-- Source EN PDF p.44, unit 401 -->

![Technische Abbildung aus dem englischen PDF, Seite 44](/docs/rockchip-iq-tools/assets/en-p044-figure-01.png)

<!-- Source EN PDF p.44, unit 402 -->

Abbildung 4-4-3-4

<!-- Source EN PDF p.45, unit 403 -->

b) Ein Klick ins Bild (schwarzer Pfeil) bildet den Punkt als schwarzes Quadrat in UV und XY ab. So lässt sich prüfen, ob er im Weißpunktbereich liegt. Angezeigt werden R G B U V X Y RGain BGain im roten Rahmen sowie u, th und die Abweichung vom Standardweißpunkt nach Zuordnung zu den Lichtquellen im YUV-Raum, in den drei grünen Spalten.

<!-- Source EN PDF p.45, unit 404 -->

![Technische Abbildung aus dem englischen PDF, Seite 45](/docs/rockchip-iq-tools/assets/en-p045-figure-01.png)

<!-- Source EN PDF p.45, unit 405 -->

Abbildung 4-4-3-5

<!-- Source EN PDF p.45, unit 406 -->

![Technische Abbildung aus dem englischen PDF, Seite 45](/docs/rockchip-iq-tools/assets/en-p045-figure-02.png)

<!-- Source EN PDF p.45, unit 407 -->

Abbildung 4-4-3-6

<!-- Source EN PDF p.46, unit 408 -->

#### 4.4.4 Kalibrierablauf

<!-- Source EN PDF p.46, unit 409 -->

1. In Calibration Tool → Edit Options Raw-Abmessungen, sensor bpp und Bayer-Reihenfolge eingeben.

<!-- Source EN PDF p.46, unit 410 -->

2. BLC und LSC müssen vor AWB abgeschlossen sein.

<!-- Source EN PDF p.46, unit 411 -->

3. Mit Load Raw Files Raw-Bilder der sieben empfohlenen Lichtquellen A, CWF, D50, D65, D75, HZ und TL84 importieren.

<!-- Source EN PDF p.46, unit 412 -->

4. Find Chart öffnet die Farbfeldsuche. Spiegelverkehrte Bilder lassen sich rechts mit Flip horizontal oder vertikal spiegeln.

<!-- Source EN PDF p.46, unit 413 -->

![Technische Abbildung aus dem englischen PDF, Seite 46](/docs/rockchip-iq-tools/assets/en-p046-figure-01.png)

<!-- Source EN PDF p.46, unit 414 -->

Abbildung 4-4-4-1

<!-- Source EN PDF p.46, unit 415 -->

a) Die roten Rahmenmittelpunkte oben links/rechts und unten links/rechts ziehen, bis die Statistikbereiche möglichst mittig in jedem Farbfeld liegen (4-4-4-1).

<!-- Source EN PDF p.46, unit 416 -->

b) FindChart erkennt die Farbfelder aller Lichtquellen (4-4-4-2).

<!-- Source EN PDF p.47, unit 417 -->

![Technische Abbildung aus dem englischen PDF, Seite 47](/docs/rockchip-iq-tools/assets/en-p047-figure-01.png)

<!-- Source EN PDF p.47, unit 418 -->

Abbildung 4-4-4-2

<!-- Source EN PDF p.47, unit 419 -->

c) Andere Lichtquellen auswählen und die Erkennung prüfen. 4-4-4-4 zeigt ein korrektes, 4-4-4-3 ein falsch positioniertes Ergebnis. Bei Fehlern in Mode Find Current Chart wählen und a)/b) nur für diese Quelle wiederholen.

<!-- Source EN PDF p.47, unit 420 -->

![Technische Abbildung aus dem englischen PDF, Seite 47](/docs/rockchip-iq-tools/assets/en-p047-figure-02.png)

<!-- Source EN PDF p.47, unit 421 -->

Abbildung 4-4-4-3

<!-- Source EN PDF p.48, unit 422 -->

![Technische Abbildung aus dem englischen PDF, Seite 48](/docs/rockchip-iq-tools/assets/en-p048-figure-01.png)

<!-- Source EN PDF p.48, unit 423 -->

Abbildung 4-4-4-4

<!-- Source EN PDF p.48, unit 424 -->

d) Mit save die Erkennung abschließen.

<!-- Source EN PDF p.48, unit 425 -->

5. Calibrate benötigt laut Quelle etwa 30s und liefert anfängliche Weißpunktbedingungen und weitere Parameter. Die farbigen Punkte in UV/XY zeigen die ColorChecker-Feldwerte der Lichtquellen, die Rechtecke deren Weißpunktbedingungen.

<!-- Source EN PDF p.48, unit 426 -->

![Technische Abbildung aus dem englischen PDF, Seite 48](/docs/rockchip-iq-tools/assets/en-p048-figure-02.png)

<!-- Source EN PDF p.48, unit 427 -->

Abbildung 4-4-4-5

<!-- Source EN PDF p.49, unit 428 -->

![Technische Abbildung aus dem englischen PDF, Seite 49](/docs/rockchip-iq-tools/assets/en-p049-figure-01.png)

<!-- Source EN PDF p.49, unit 429 -->

Abbildung 4-4-4-6

<!-- Source EN PDF p.49, unit 430 -->

6. In AWB Simulation nacheinander Raw-Bilder von A, CWF, D50, D65, D75, HZ und TL84 importieren und die Weißpunkterkennung prüfen.

<!-- Source EN PDF p.49, unit 431 -->

7. Rahmen in UV/XY oder TH in YUV anpassen, um die Weißpunkterkennung aller Lichtquellen zu verbessern.

<!-- Source EN PDF p.49, unit 432 -->

8. Save und danach Run Simulator in AWB Simulation wählen, um die Weißpunkterkennung der importierten Lichtquellenbilder anzusehen.

<!-- Source EN PDF p.49, unit 433 -->

9. Schritte 6–8 wiederholen, bis die Erkennung aller Lichtquellen plausibel ist.

<!-- Source EN PDF p.50, unit 434 -->

Hinweise:

<!-- Source EN PDF p.50, unit 435 -->

1. Weißpunkte der Felder 19, 20, 21 und 22 möglichst innerhalb, Nichtweißpunkte außerhalb des Rahmens halten.

<!-- Source EN PDF p.50, unit 436 -->

2. Die mittleren Rahmen aller Lichtquellen entlang des Schwarzkörperorts müssen in x-Richtung lückenlos sein. Fehlerbeispiel: kleine Abstände zwischen großen, aber große Abstände zwischen mittleren Rahmen.

<!-- Source EN PDF p.50, unit 437 -->

![Technische Abbildung aus dem englischen PDF, Seite 50](/docs/rockchip-iq-tools/assets/en-p050-figure-01.png)

<!-- Source EN PDF p.50, unit 438 -->

Korrektes Beispiel:

<!-- Source EN PDF p.50, unit 439 -->

![Technische Abbildung aus dem englischen PDF, Seite 50](/docs/rockchip-iq-tools/assets/en-p050-figure-02.png)

<!-- Source EN PDF p.50, unit 440 -->

3. In Y-Richtung des XY-Raums können A/HZ etwas kleiner und D50/D65 etwas größer sein.

<!-- Source EN PDF p.50, unit 441 -->

4. CWF und TL84 mit sehr ähnlicher Farbtemperatur lassen sich in Y-Richtung benachbart anordnen.

<!-- Source EN PDF p.50, unit 442 -->

5. Im UV-Raum dürfen zwischen den Lichtquellen keine Lücken liegen.

<!-- Source EN PDF p.50, unit 443 -->

6. Lichtquellenbereiche dürfen sich überlappen, jedoch nicht gleichzeitig in XY und UV.

<!-- Source EN PDF p.50, unit 444 -->

7. Beim Ausschließen von Nichtweißpunkten UV anhand der XY-Verteilung anpassen.

<!-- Source EN PDF p.51, unit 445 -->

Beispielsweise liegt das markierte siebte D75-Feld im HZ-Bereich und wird fälschlich als Weißpunkt erkannt.

<!-- Source EN PDF p.51, unit 446 -->

![Technische Abbildung aus dem englischen PDF, Seite 51](/docs/rockchip-iq-tools/assets/en-p051-figure-01.png)

<!-- Source EN PDF p.51, unit 447 -->

Nach der Anpassung gehört das siebte D75-Feld in xy und uv nicht mehr zur gleichen Lichtquelle und wird nicht als Weißpunkt erkannt.

<!-- Source EN PDF p.51, unit 448 -->

![Technische Abbildung aus dem englischen PDF, Seite 51](/docs/rockchip-iq-tools/assets/en-p051-figure-02.png)

<!-- Source EN PDF p.51, unit 449 -->

8. Liegt ein Nichtweißpunkt in den Weißpunktbereichen von XY und UV, kann er durch Senken von TH oder Vergrößern des Nichtweißpunktbereichs ausgeschlossen werden.

<!-- Source EN PDF p.51, unit 450 -->

9. Wird ein Punkt trotz Lage im XY-/UV-Weißpunktbereich nicht erkannt, kann er außerhalb des Helligkeitsbereichs, innerhalb eines Nichtweißpunktbereichs oder unter TH und damit außerhalb des YUV-Weißpunktintervalls liegen.

<!-- Source EN PDF p.52, unit 451 -->

#### 4.4.5 Beispiele der AWB-Kalibrierergebnisse

<!-- Source EN PDF p.52, unit 452 -->

Endgültige Weißpunktbedingungen:

<!-- Source EN PDF p.52, unit 453 -->

![Technische Abbildung aus dem englischen PDF, Seite 52](/docs/rockchip-iq-tools/assets/en-p052-figure-01.png)

<!-- Source EN PDF p.52, unit 454 -->

Abbildung 4-4-5-1

<!-- Source EN PDF p.52, unit 455 -->

Weißpunkterkennung der einzelnen Lichtquellen:

<!-- Source EN PDF p.52, unit 456 -->

![Technische Abbildung aus dem englischen PDF, Seite 52](/docs/rockchip-iq-tools/assets/en-p052-figure-02.png)

<!-- Source EN PDF p.53, unit 457 -->

Abbildung 4-4-5-1 A

<!-- Source EN PDF p.53, unit 458 -->

![Technische Abbildung aus dem englischen PDF, Seite 53](/docs/rockchip-iq-tools/assets/en-p053-figure-01.png)

<!-- Source EN PDF p.53, unit 459 -->

Abbildung 4-4-5-2 CWF

<!-- Source EN PDF p.53, unit 460 -->

![Technische Abbildung aus dem englischen PDF, Seite 53](/docs/rockchip-iq-tools/assets/en-p053-figure-02.png)

<!-- Source EN PDF p.54, unit 461 -->

Abbildung 4-4-5-3 D50

<!-- Source EN PDF p.54, unit 462 -->

![Technische Abbildung aus dem englischen PDF, Seite 54](/docs/rockchip-iq-tools/assets/en-p054-figure-01.png)

<!-- Source EN PDF p.54, unit 463 -->

Abbildung 4-4-5-4 D65

<!-- Source EN PDF p.54, unit 464 -->

![Technische Abbildung aus dem englischen PDF, Seite 54](/docs/rockchip-iq-tools/assets/en-p054-figure-02.png)

<!-- Source EN PDF p.55, unit 465 -->

Abbildung 4-4-5-5 D75

<!-- Source EN PDF p.55, unit 466 -->

![Technische Abbildung aus dem englischen PDF, Seite 55](/docs/rockchip-iq-tools/assets/en-p055-figure-01.png)

<!-- Source EN PDF p.55, unit 467 -->

Abbildung 4-4-5-6 HZ

<!-- Source EN PDF p.55, unit 468 -->

![Technische Abbildung aus dem englischen PDF, Seite 55](/docs/rockchip-iq-tools/assets/en-p055-figure-02.png)

<!-- Source EN PDF p.55, unit 469 -->

Abbildung 4-4-5-7 TL84

<!-- Source EN PDF p.56, unit 470 -->

### 4.5 CCM-Kalibrierung

<!-- Source EN PDF p.56, unit 471 -->

#### 4.5.1 Anforderungen an Raw-Bilder

<!-- Source EN PDF p.56, unit 472 -->

Raw-Anforderungen siehe 4.4; CCM kann AWB-Raw-Bilder verwenden. Da Gamma das CCM-Ergebnis beeinflusst, muss CCM nach einer Gamma-Änderung eventuell erneut angepasst werden. Siehe

<!-- Source EN PDF p.56, unit 473 -->

4.5.2, Punkt 12.

<!-- Source EN PDF p.56, unit 474 -->

#### 4.5.2 CCM-Kalibrierablauf

<!-- Source EN PDF p.56, unit 475 -->

1. In Calibration Tool CCM wählen und mit Load Raw Files alle Raw-Bilder importieren. Sie erscheinen in der Liste.

<!-- Source EN PDF p.56, unit 476 -->

![Technische Abbildung aus dem englischen PDF, Seite 56](/docs/rockchip-iq-tools/assets/en-p056-figure-01.png)

<!-- Source EN PDF p.56, unit 477 -->

Abbildung 4-5-2-1

<!-- Source EN PDF p.57, unit 478 -->

2. Find Chart öffnet die Farbfeldsuche.

<!-- Source EN PDF p.57, unit 479 -->

![Technische Abbildung aus dem englischen PDF, Seite 57](/docs/rockchip-iq-tools/assets/en-p057-figure-01.png)

<!-- Source EN PDF p.57, unit 480 -->

Abbildung 4-5-2-2

<!-- Source EN PDF p.57, unit 481 -->

3. Rote Rahmenmittelpunkte an den vier Ecken ziehen, sodass die Abtastbereiche mittig in jedem Farbfeld liegen.

<!-- Source EN PDF p.57, unit 482 -->

4. Find Chart ermittelt die Farbfeldwerte und markiert die Statistikbereiche grün.

<!-- Source EN PDF p.57, unit 483 -->

5. Für jede Lichtquelle der Liste die Statistikbereiche prüfen.

<!-- Source EN PDF p.57, unit 484 -->

![Technische Abbildung aus dem englischen PDF, Seite 57](/docs/rockchip-iq-tools/assets/en-p057-figure-02.png)

<!-- Source EN PDF p.57, unit 485 -->

Abbildung 4-5-2-3

<!-- Source EN PDF p.57, unit 486 -->

6. Nach der Suche mit Save speichern und schließen.

<!-- Source EN PDF p.57, unit 487 -->

7. Sättigung auf 100% setzen, siehe 4-5-2-4.

<!-- Source EN PDF p.58, unit 488 -->

![Technische Abbildung aus dem englischen PDF, Seite 58](/docs/rockchip-iq-tools/assets/en-p058-figure-01.png)

<!-- Source EN PDF p.58, unit 489 -->

Abbildung 4-5-2-4

<!-- Source EN PDF p.58, unit 490 -->

8. Calibrate starten; laut Quelle dauert dies etwa 20s.

<!-- Source EN PDF p.58, unit 491 -->

9. Nach Abschluss erscheinen die Berechnungsergebnisse auf der Ergebnisseite.

<!-- Source EN PDF p.58, unit 492 -->

10. Save anklicken.

<!-- Source EN PDF p.58, unit 493 -->

11. Sättigung auf 74% ändern und 8–10 wiederholen.

<!-- Source EN PDF p.58, unit 494 -->

![Technische Abbildung aus dem englischen PDF, Seite 58](/docs/rockchip-iq-tools/assets/en-p058-figure-02.png)

<!-- Source EN PDF p.58, unit 495 -->

Abbildung 4-5-2-5

<!-- Source EN PDF p.58, unit 496 -->

12. Ein zu großes ΔE kann von zu hellen Raw-Bildern kommen. Im ColorChecker rechts in 4-5-2-5 per Rechtsklick Save Current wählen und das gespeicherte Bild auf überbelichtete Felder oder gesättigte Kanäle prüfen. Die CCM-Kalibrierung nach Anwendung der Gamma-Kurve kann Farbfelder sättigen.

<!-- Source EN PDF p.58, unit 497 -->

a) Bei Überbelichtung oder Sättigung die Belichtung reduzieren, die Tafel dieser Lichtquelle neu aufnehmen und erneut kalibrieren.

<!-- Source EN PDF p.58, unit 498 -->

b) Bei normaler Farbfeldhelligkeit kommen fehlerhafte BLC-/LSC-Parameter, Lichteinfall am Objektiv durch Infrarotlicht oder ähnliche Ursachen infrage.

<!-- Source EN PDF p.58, unit 499 -->

13. Konkrete Abstimmungsverfahren stehen in Rockchip_Color_Optimization_Guide.

<!-- Source EN PDF p.59, unit 500 -->

### 4.6 NR-Kalibrierung

<!-- Source EN PDF p.59, unit 501 -->

#### 4.6.1 Anforderungen an Raw-Bilder

<!-- Source EN PDF p.59, unit 502 -->

Raw-Aufnahmen für das NR-Modul:

<!-- Source EN PDF p.59, unit 503 -->

1. Im Normlichtkasten aufnehmen, vorzugsweise mit dimmbarer Gleichstromlichtquelle.

<!-- Source EN PDF p.59, unit 504 -->

2. Die Graustufen-Verlaufstafel aus 4-6-1-1 ist erforderlich.

<!-- Source EN PDF p.59, unit 505 -->

![Technische Abbildung aus dem englischen PDF, Seite 59](/docs/rockchip-iq-tools/assets/en-p059-figure-01.png)

<!-- Source EN PDF p.59, unit 506 -->

Abbildung 4-6-1-1

<!-- Source EN PDF p.59, unit 507 -->

3. Gain=1x, 2x, 4x, 8x, 16x...Max durchlaufen; bei unterstütztem Maximum 40x gilt Max=32.

<!-- Source EN PDF p.59, unit 508 -->

4. Pro Gain vier Raw-Bilder aufnehmen: helles Mehrbild, helles Einzelbild, dunkles Mehrbild und dunkles Einzelbild.

<!-- Source EN PDF p.59, unit 509 -->

5. Helle und dunkle Aufnahmebedingungen werden durch Belichtungszeit oder Lichthelligkeit eingestellt. Mehrbild- und Einzelbilddaten erzeugt das Werkzeug.

<!-- Source EN PDF p.59, unit 510 -->

6. Alle folgenden Helligkeitswerte sind 8-bit-Werte.

<!-- Source EN PDF p.59, unit 511 -->

7. Dunkle Aufnahmen: Das hellste Feld in 4-6-1-1 erreicht 30, damit Feldgrenzen sichtbar sind; bei Bedarf etwas erhöhen. Das dunkelste Feld erreicht Black-Level, was üblicherweise erfüllt ist, wenn das hellste gerade 30 erreicht.

<!-- Source EN PDF p.59, unit 512 -->

8. Helle Aufnahmen: Das hellste Feld erreicht 255, das dunkelste üblicherweise etwa 60–70.

<!-- Source EN PDF p.59, unit 513 -->

9. YNR Capture in RK Capture Tool sucht anhand der eingestellten Helligkeiten des dunkelsten und hellsten Felds automatisch passende Belichtungskombinationen.

<!-- Source EN PDF p.59, unit 514 -->

#### 4.6.2 Raw-Bilder aufnehmen

<!-- Source EN PDF p.59, unit 515 -->

1. RK Capture Tool gemäß 3.1/3.2 öffnen und das Gerät verbinden.

<!-- Source EN PDF p.59, unit 516 -->

2. Gerät oder Modul in den Lichtkasten stellen und die Verlaufstafel daran befestigen.

<!-- Source EN PDF p.59, unit 517 -->

3. Gerät so ausrichten, dass die Verlaufstafel mittig liegt und das Bild möglichst ausfüllt.

<!-- Source EN PDF p.60, unit 518 -->

4. Lichtkasten einschalten und TL84 oder CWF wählen.

<!-- Source EN PDF p.60, unit 519 -->

5. Lichtquellenname auf TL84 oder CWF und Modulname auf NR_Normal setzen.

<!-- Source EN PDF p.60, unit 520 -->

6. Bei einem Sensor mit Gain=1-24 werden 1x, 2x, 4x, 8x und 16x aufgenommen.

<!-- Source EN PDF p.60, unit 521 -->

7. YNR Capture wählen und zunächst ein Raw-Bild aufnehmen. Rechts in der Vorschau per Rechtsklick Draw ROI wählen und nacheinander hellstes und dunkelstes Feld markieren, nachfolgend Weiß- und Schwarzfeld. Doppelklick zeichnet das Rechteck neu. Bild und Rechtecke fixieren und NR aufnehmen, siehe

<!-- Source EN PDF p.60, unit 522 -->

Abbildung 4-6-2-1.

<!-- Source EN PDF p.60, unit 523 -->

![Technische Abbildung aus dem englischen PDF, Seite 60](/docs/rockchip-iq-tools/assets/en-p060-figure-01.png)

<!-- Source EN PDF p.60, unit 524 -->

Abbildung 4-6-2-1

<!-- Source EN PDF p.60, unit 525 -->

8. Dunkles Raw-Bild: Lichtkasten etwa 800lux, Gain Range 1.0 - 1.0, Exp Range unverändert. Multi-Frame und Low-Light aktivieren. In YNR Capture die Feldschwellen eintragen, FrameNumber=32. Black Block Mean Luma ist das Schwarzziel, zunächst BLC(8bit)+1; White Block Mean Luma ist das Weißziel, zunächst

<!-- Source EN PDF p.60, unit 526 -->

30.

<!-- Source EN PDF p.60, unit 527 -->

![Technische Abbildung aus dem englischen PDF, Seite 60](/docs/rockchip-iq-tools/assets/en-p060-figure-02.png)

<!-- Source EN PDF p.60, unit 528 -->

Abbildung 4-6-2-2

<!-- Source EN PDF p.61, unit 529 -->

a) Start YNR Capture starten. Das Protokoll zeigt die Mittelwerte beider Rechtecke und die Belichtung. meanValue[0]: aktueller Schwarzwert; meanValue[1]: aktueller Weißwert; blackTarget: eingetragener Black Block Mean Luma; whiteTarget: eingetragener White Block Mean Luma.

<!-- Source EN PDF p.61, unit 530 -->

b) Verhindert der Schwellwert die Aufnahme (4-6-2-3), das Protokoll prüfen. Die Quelle beschreibt unklar einen „meanValue[0], bei dem meanValue[1] gerade größer als whiteTarget ist“, der als Black Block Mean Luma einzutragen sei; gegen Rauschen könne meanValue[0] etwas erhöht werden (4-6-2-4). Diese mehrdeutige Vergleichsangabe bleibt als Prüfpunkt dokumentiert, ohne eine vermutete Korrektur.

<!-- Source EN PDF p.61, unit 531 -->

![Technische Abbildung aus dem englischen PDF, Seite 61](/docs/rockchip-iq-tools/assets/en-p061-figure-01.png)

<!-- Source EN PDF p.61, unit 532 -->

Abbildung 4-6-2-3

<!-- Source EN PDF p.61, unit 533 -->

![Technische Abbildung aus dem englischen PDF, Seite 61](/docs/rockchip-iq-tools/assets/en-p061-figure-02.png)

<!-- Source EN PDF p.61, unit 534 -->

Abbildung 4-6-2-4

<!-- Source EN PDF p.62, unit 535 -->

c) Nach Ermitteln passender Schwellen Start YNR Capture erneut starten. Es entstehen Raw-Bilder mit den Suffixen Multiple und Single (4-6-2-5).

<!-- Source EN PDF p.62, unit 536 -->

![Technische Abbildung aus dem englischen PDF, Seite 62](/docs/rockchip-iq-tools/assets/en-p062-figure-01.png)

<!-- Source EN PDF p.62, unit 537 -->

Abbildung 4-6-2-5

<!-- Source EN PDF p.62, unit 538 -->

9. Helles Raw-Bild: Lichtkasten etwa 800lux, Gain Range 1.0 - 1.0, Exp Range unverändert. Multi-Frame und High-Light aktivieren. In YNR Capture Black Block Mean Luma zunächst 60, White Block Mean Luma fest 255 und FrameNumber=32 setzen.

<!-- Source EN PDF p.63, unit 539 -->

![Technische Abbildung aus dem englischen PDF, Seite 63](/docs/rockchip-iq-tools/assets/en-p063-figure-01.png)

<!-- Source EN PDF p.63, unit 540 -->

Abbildung 4-6-2-6

<!-- Source EN PDF p.63, unit 541 -->

a) Nach Start YNR Capture protokolliert jede Belichtungsänderung ROI-Mittelwert, Belichtung und Gain. meanValue[0] ist das dunkelste, meanValue[1] das hellste Feld; blackTarget und whiteTarget entsprechen den eingetragenen Black Block Mean Luma beziehungsweise White Block Mean Luma.

<!-- Source EN PDF p.63, unit 542 -->

b) Erreicht das hellste Feld trotz maximaler Belichtung und Verstärkung keine 255 (4-6-2-7), die Lichtkastenhelligkeit manuell ändern und Start YNR Capture erneut ausführen. Bei erfüllten Bedingungen entstehen Multiple-/Single-Raw-Bilder (4-6-2-8).

<!-- Source EN PDF p.63, unit 543 -->

![Technische Abbildung aus dem englischen PDF, Seite 63](/docs/rockchip-iq-tools/assets/en-p063-figure-02.png)

<!-- Source EN PDF p.63, unit 544 -->

Abbildung 4-6-2-7

<!-- Source EN PDF p.64, unit 545 -->

![Technische Abbildung aus dem englischen PDF, Seite 64](/docs/rockchip-iq-tools/assets/en-p064-figure-01.png)

<!-- Source EN PDF p.64, unit 546 -->

Abbildung 4-6-2-8

<!-- Source EN PDF p.64, unit 547 -->

10. Gain Range auf 2x ändern und 8/9 für sämtliche Gain-Stufen wiederholen.

<!-- Source EN PDF p.64, unit 548 -->

11. Mit steigendem Gain beeinflusst Rauschen die Schwarzschwelle stärker. Sie kann anhand des Protokolls leicht angepasst werden.

<!-- Source EN PDF p.65, unit 549 -->

#### 4.6.3 Kalibrierablauf

<!-- Source EN PDF p.65, unit 550 -->

GIC & BayerNR und YNR & MFNR verwenden denselben Raw-Bildsatz:

<!-- Source EN PDF p.65, unit 551 -->

1. In Calibration Tool links oben Edit Options öffnen und Raw-Größe, Bittiefe und Bayer-Reihenfolge eingeben.

<!-- Source EN PDF p.65, unit 552 -->

2. Auf GIC & Bayer NR mit Load Raw Files alle Raw-Bilder importieren. Sie erscheinen unten in der Liste.

<!-- Source EN PDF p.65, unit 553 -->

3. Mit Find ROI die Verlaufstafel markieren (4-6-3-1). Das Rechteck muss innerhalb des Farbfelds liegen.

<!-- Source EN PDF p.65, unit 554 -->

![Technische Abbildung aus dem englischen PDF, Seite 65](/docs/rockchip-iq-tools/assets/en-p065-figure-01.png)

<!-- Source EN PDF p.65, unit 555 -->

Abbildung 4-6-3-1

<!-- Source EN PDF p.65, unit 556 -->

4. Calibrate starten.

<!-- Source EN PDF p.65, unit 557 -->

5. Die BayerNR-Rauschkurve erscheint nach Abschluss rechts (4-6-3-2).

<!-- Source EN PDF p.65, unit 558 -->

![Technische Abbildung aus dem englischen PDF, Seite 65](/docs/rockchip-iq-tools/assets/en-p065-figure-02.png)

<!-- Source EN PDF p.65, unit 559 -->

Abbildung 4-6-3-2

<!-- Source EN PDF p.66, unit 560 -->

6. Save anklicken.

<!-- Source EN PDF p.66, unit 561 -->

7. Auf YNR&MFNR mit Load Raw Files alle Raw-Bilder importieren; sie erscheinen unten.

<!-- Source EN PDF p.66, unit 562 -->

8. Calculate YUV verarbeitet Raw-Bilder mit dem Simulator zu YUV.

<!-- Source EN PDF p.66, unit 563 -->

9. Calibrate starten. Vorher YNRCurve Print aktivieren, um Parameter und Abtastpunkte jedes iso zu speichern.

<!-- Source EN PDF p.66, unit 564 -->

10. Die YNR-Rauschkurve erscheint rechts (4-6-3-3).

<!-- Source EN PDF p.66, unit 565 -->

11. Save anklicken.

<!-- Source EN PDF p.66, unit 566 -->

![Technische Abbildung aus dem englischen PDF, Seite 66](/docs/rockchip-iq-tools/assets/en-p066-figure-01.png)

<!-- Source EN PDF p.66, unit 567 -->

Abbildung 4-6-3-3

<!-- Source EN PDF p.66, unit 568 -->

Weicht die Rauschkurve stark von 4-6-3-3 ab, können helle oder dunkle Aufnahmen falsch belichtet sein. Fehler links betreffen die dunklen, rechts die hellen Aufnahmen. Zu hohe oder niedrige Farbtemperaturen können Calculate YUV verfälschen. Reicht die minimale Lichtkastenhelligkeit nicht aus, kann eine lichtdämpfende Folie helfen.

<!-- Source EN PDF p.67, unit 569 -->

### 4.7 FEC/LDCH

<!-- Source EN PDF p.67, unit 570 -->

FEC/LDCH benötigt eine map table mit x/y-Bildkoordinaten nach dem Downsampling. Für ihre Ermittlung werden Objektivparameter, ein Satz Schachbrettaufnahmen und das Kalibrierwerkzeug benötigt.

<!-- Source EN PDF p.67, unit 571 -->

#### 4.7.1 Anforderungen an Kalibrierbilder

<!-- Source EN PDF p.67, unit 572 -->

Die Schachbrettgröße ist variabel; unterstützt werden jpg, bmp und png. Verfahren 1: ein Schachbrett pro Bild, höhere Präzision, empfohlen. Verfahren 2: n Schachbretter je Bild, zur bequemeren Kalibrierung n=4.

<!-- Source EN PDF p.67, unit 573 -->

1. Vorbereitung

(1) Eine standardisierte Kalibriertafel verwenden. Beim Selbstdruck auf reale Abmessungen und eine plane Fläche achten, möglichst auf einer ebenen Platte befestigen. Unterschiedliche horizontale und vertikale Feldanzahlen erleichtern die Richtungserkennung.

(2) Bei mäßiger Beleuchtung müssen alle Blickwinkel scharf und frei von Reflexionen oder Unschärfe sein. Während des gesamten Ablaufs Blende und Brennweite unverändert lassen, damit Lichteinfall und Brennweite konstant bleiben.

<!-- Source EN PDF p.67, unit 574 -->

2. Aufnahmeregeln

(1) Das Schachbrett sollte etwa 1/4 bis 1/8 des Sichtfelds belegen.

(2) Alle Aufnahmen zusammen müssen das Sichtfeld abdecken, üblicherweise etwa 15 Bilder. Zu wenige verschlechtern die Parameter. Je Position 3–4 Bilder erleichtern Auswahl und Ersatz ungeeigneter Aufnahmen.

(3) Die Tafel gleichmäßig über Bereiche und Ecken verteilen; die Quelle verweist auf 2-1. Am Sichtfeldrand möglichst nahe heranrücken, aber nicht aus dem Bild geraten lassen.

(4) Unterschiedliche Neigungen aufnehmen, nicht nur parallel zur Objektivebene.

<!-- Source EN PDF p.68, unit 575 -->

3. Aufnahmebeispiele

<!-- Source EN PDF p.68, unit 576 -->

Zwei Verfahren: (1) empfohlenes Verfahren 1 mit vier Bildern, deren Schachbrett oben links/rechts und unten links/rechts liegt; die Reihenfolge ist beliebig.

<!-- Source EN PDF p.68, unit 577 -->

![Technische Abbildung aus dem englischen PDF, Seite 68](/docs/rockchip-iq-tools/assets/en-p068-figure-01.png)

<!-- Source EN PDF p.68, unit 578 -->

![Technische Abbildung aus dem englischen PDF, Seite 68](/docs/rockchip-iq-tools/assets/en-p068-figure-02.png)

<!-- Source EN PDF p.68, unit 579 -->

![Technische Abbildung aus dem englischen PDF, Seite 68](/docs/rockchip-iq-tools/assets/en-p068-figure-03.png)

<!-- Source EN PDF p.69, unit 580 -->

![Technische Abbildung aus dem englischen PDF, Seite 69](/docs/rockchip-iq-tools/assets/en-p069-figure-01.png)

<!-- Source EN PDF p.69, unit 581 -->

Abbildung 4-7-1-1

<!-- Source EN PDF p.69, unit 582 -->

(2) Verfahren 2: ein Bild mit Schachbrettern in allen vier Ecken.

<!-- Source EN PDF p.69, unit 583 -->

![Technische Abbildung aus dem englischen PDF, Seite 69](/docs/rockchip-iq-tools/assets/en-p069-figure-02.png)

<!-- Source EN PDF p.69, unit 584 -->

Abbildung 4-7-1-2

<!-- Source EN PDF p.70, unit 585 -->

#### 4.7.2 Kalibrierablauf

<!-- Source EN PDF p.70, unit 586 -->

![Technische Abbildung aus dem englischen PDF, Seite 70](/docs/rockchip-iq-tools/assets/en-p070-figure-01.png)

<!-- Source EN PDF p.70, unit 587 -->

Abbildung 4-7-2-1

<!-- Source EN PDF p.70, unit 588 -->

1. In Raw Options die Auflösung einstellen; Bit und Bayer Pattern können ignoriert werden.

<!-- Source EN PDF p.70, unit 589 -->

2. Kalibrierbildordner importieren; jpg, bmp und png werden unterstützt.

<!-- Source EN PDF p.70, unit 590 -->

3. Kalibrierparameter anpassen.

<!-- Source EN PDF p.70, unit 591 -->

a) Square Size: reale Feldgröße, üblicherweise 30mm oder 25mm.

<!-- Source EN PDF p.70, unit 592 -->

b) Horizontal/Vertical: Anzahl innerer Eckpunkte in horizontaler beziehungsweise vertikaler Richtung.

<!-- Source EN PDF p.70, unit 593 -->

c) Check Board Number: Schachbrettanzahl je Bild, 1 oder 4.

<!-- Source EN PDF p.70, unit 594 -->

d) Level: 256 Korrekturstufen. Bei Level = 0 hat die Tabelle keine Korrekturwirkung, Ausgabe gleich Eingabe. Level = 255 ist die maximal erreichbare LDCH-Korrektur.

<!-- Source EN PDF p.70, unit 595 -->

e) Correct Direction für FEC: i. Nur Correct X korrigiert horizontal, ähnlich LDCH. ii. Nur Correct Y korrigiert vertikal. iii. Correct X und Correct Y korrigieren beide Richtungen.

<!-- Source EN PDF p.70, unit 596 -->

4. Calibrate starten.

<!-- Source EN PDF p.70, unit 597 -->

5. Ergebnisse speichern.

<!-- Source EN PDF p.71, unit 598 -->

Ecken und innere Ecken zeigt 4-7-2-2. Bei 12 horizontalen und 9 vertikalen Feldern gibt es horizontal 13 Eckpunkte und 11 innere Eckpunkte. Daher Horizontal = 11 und Vertical = 8.

<!-- Source EN PDF p.71, unit 599 -->

![Technische Abbildung aus dem englischen PDF, Seite 71](/docs/rockchip-iq-tools/assets/en-p071-figure-01.png)

<!-- Source EN PDF p.71, unit 600 -->

Abbildung 4-7-2-2: Eckpunkte und innere Eckpunkte

<!-- Source EN PDF p.71, unit 601 -->

Eckpunkte umfassen rote und grüne, innere Eckpunkte nur rote Markierungen.

<!-- Source EN PDF p.71, unit 602 -->

Hinweise:

<!-- Source EN PDF p.71, unit 603 -->

1. Neben Calibration Tool muss ein Ordner result vorhanden sein; gegebenenfalls anlegen.

<!-- Source EN PDF p.71, unit 604 -->

2. Der äußerste Schachbrettring wird mitberechnet. Seine schwarzen und weißen Felder dürfen bei der Aufnahme nicht vollständig durch die Vorschau verdeckt werden.

<!-- Source EN PDF p.71, unit 605 -->

3. Horizontale Eckpunktanzahl: horizontale Anzahl schwarzer/weißer Felder minus 1.

<!-- Source EN PDF p.71, unit 606 -->

4. Vertikale Eckpunktanzahl: vertikale Anzahl schwarzer/weißer Felder minus 1.

<!-- Source EN PDF p.71, unit 607 -->

5. FEC korrigiert standardmäßig beide Richtungen; bei der Kalibrierung kann die Richtung gewählt werden.

<!-- Source EN PDF p.71, unit 608 -->

6. Den Bildordner möglichst nach Sensorname + Objektivname/Brennweite + Auflösung benennen. Das Werkzeug erzeugt unter diesem Namen den Kalibrierdateiordner.

<!-- Source EN PDF p.72, unit 609 -->

#### 4.7.3 Beispiele der Kalibrierergebnisse

<!-- Source EN PDF p.72, unit 610 -->

1. Fehlgeschlagene Kalibrierungen entstehen meist durch unscharfe Schachbretter mit ungenauen oder unvollständigen Eckpunkten. Alle Bilder prüfen; mindestens 3 müssen vollständig erkannt sein.

<!-- Source EN PDF p.72, unit 611 -->

2. Bei Erfolg erscheint 4-7-3-1. Im log links stehen von oben nach unten sechs Parameter: Kamerazentrum cx, cy und Verzerrungsparameter a0, a2, a3, a4.

<!-- Source EN PDF p.72, unit 612 -->

3. Unter result die Eckpunkterkennung jedes Bilds prüfen. Ungeeignete Bilder löschen und erneut kalibrieren. FEC-/LDCH-Abbildungstabellen liegen im zugehörigen Unterordner von result.

<!-- Source EN PDF p.72, unit 613 -->

![Technische Abbildung aus dem englischen PDF, Seite 72](/docs/rockchip-iq-tools/assets/en-p072-figure-01.png)

<!-- Source EN PDF p.72, unit 614 -->

Abbildung 4-7-3-1

<!-- Source EN PDF p.73, unit 615 -->

## 5 Online-Abstimmung

<!-- Source EN PDF p.73, unit 616 -->

### 5.1 Abstimmungsoberfläche

<!-- Source EN PDF p.73, unit 617 -->

![Technische Abbildung aus dem englischen PDF, Seite 73](/docs/rockchip-iq-tools/assets/en-p073-figure-01.png)

<!-- Source EN PDF p.73, unit 618 -->

Abbildung 5-1-1: Hauptoberfläche von RKISP Tuner v2

<!-- Source EN PDF p.73, unit 619 -->

5-1-1 zeigt den typischen Zustand nach Laden der Oberfläche und Importieren der IQ-Parameter. Die Markierungen bedeuten:

<!-- Source EN PDF p.73, unit 620 -->

1. Modulbaum: normal: day oben bezeichnet die beim IQ-Laden gewählte Szene; normal ist die Haupt-, day die Unterszene.

<!-- Source EN PDF p.73, unit 621 -->

2. ISP-Module: Eine Szene kann mehrere Module mit mehreren Seiten enthalten.

<!-- Source EN PDF p.73, unit 622 -->

3. Abstimmungsseite: Ein Modulknoten kann mehrere Seiten mit mehreren Abstimmungseinheiten enthalten.

<!-- Source EN PDF p.73, unit 623 -->

4. Abstimmungseinheit: etwa InitExp mit 5 numerischen Mitgliedsparametern.

<!-- Source EN PDF p.73, unit 624 -->

5. Lese-/Schreibschaltflächen der Einheit greifen online auf alle ihre Parameter zu.

<!-- Source EN PDF p.74, unit 625 -->

6. Automatisches Schreiben: Bei Verbindung mit rkaiq_tool_server wird jede Parameteränderung automatisch an das Gerät gesendet und wirksam.

<!-- Source EN PDF p.74, unit 626 -->

7. Lese-/Schreibschaltflächen für die gesamte Seite oder das Modul.

<!-- Source EN PDF p.74, unit 627 -->

8. Undo/Redo macht die letzte Änderung rückgängig. Bei aktiviertem AutoWrite wird auch das Gerät synchronisiert.

<!-- Source EN PDF p.74, unit 628 -->

9. Suche: Seite eines Parameters anhand eines Schlüsselworts finden.

<!-- Source EN PDF p.74, unit 629 -->

### 5.2 Plattform- und Netzwerkkonfiguration

<!-- Source EN PDF p.74, unit 630 -->

Beim ersten Start oder über Project → Network and Platform Settings das Plattform-/Netzwerkfenster öffnen.

<!-- Source EN PDF p.74, unit 631 -->

![Technische Abbildung aus dem englischen PDF, Seite 74](/docs/rockchip-iq-tools/assets/en-p074-figure-01.png)

<!-- Source EN PDF p.74, unit 632 -->

Abbildung 5-2-1

<!-- Source EN PDF p.74, unit 633 -->

1. Platform Setting lädt je Chip andere Oberflächenkonfigurationen. Die Zuordnung steht in config/config.ini.

<!-- Source EN PDF p.74, unit 634 -->

2. Network Config stellt die Geräteadresse ein. Standardport 5543 nur bei besonderem Bedarf ändern.

<!-- Source EN PDF p.74, unit 635 -->

Connect versucht die Verbindung zu rkaiq_tool_server auf dem Gerät; der Dienst muss korrekt laufen.

<!-- Source EN PDF p.75, unit 636 -->

### 5.3 Register und Algorithmusparameter

<!-- Source EN PDF p.75, unit 637 -->

Jede Abstimmungseinheit enthält Register- oder Algorithmusparameter. Je nach Form und Wertebereich gibt es vier typische Bedienelemente:

<!-- Source EN PDF p.75, unit 638 -->

1. Zahlen: Ganzzahl oder Gleitkommawert mit Wertebereich. Direkt eingeben, Pfeiltasten oder den rechten Schieberegler verwenden.

<!-- Source EN PDF p.75, unit 639 -->

![Technische Abbildung aus dem englischen PDF, Seite 75](/docs/rockchip-iq-tools/assets/en-p075-figure-01.png)

<!-- Source EN PDF p.75, unit 640 -->

Abbildung 5-3-1

<!-- Source EN PDF p.75, unit 641 -->

2. Boolean: 0/1 für Funktionsschalter; Enable = 1, Disable = 0.

<!-- Source EN PDF p.75, unit 642 -->

![Technische Abbildung aus dem englischen PDF, Seite 75](/docs/rockchip-iq-tools/assets/en-p075-figure-02.png)

<!-- Source EN PDF p.75, unit 643 -->

Abbildung 5-3-2

<!-- Source EN PDF p.75, unit 644 -->

3. Liste: vordefinierte Optionen für Modi, ISO, Day/Night und LCG/HCG.

<!-- Source EN PDF p.75, unit 645 -->

![Technische Abbildung aus dem englischen PDF, Seite 75](/docs/rockchip-iq-tools/assets/en-p075-figure-03.png)

<!-- Source EN PDF p.75, unit 646 -->

Abbildung 5-3-3

<!-- Source EN PDF p.75, unit 647 -->

4. Tabelle: NxM-Matrix aus Ganzzahl- oder Gleitkommaelementen, geöffnet mit Show data oder Enter Array Table.

<!-- Source EN PDF p.75, unit 648 -->

![Technische Abbildung aus dem englischen PDF, Seite 75](/docs/rockchip-iq-tools/assets/en-p075-figure-04.png)

<!-- Source EN PDF p.75, unit 649 -->

Abbildung 5-3-4

<!-- Source EN PDF p.76, unit 650 -->

### 5.4 Gamma-Parameter online abstimmen

<!-- Source EN PDF p.76, unit 651 -->

#### 5.4.1 Visuelle Gamma-Abstimmung

<!-- Source EN PDF p.76, unit 652 -->

1. Auf GammaTuningPara für Gamma_Curve Edit Curve wählen, um die visuelle Abstimmung zu öffnen (5-4-1-1).

<!-- Source EN PDF p.76, unit 653 -->

![Technische Abbildung aus dem englischen PDF, Seite 76](/docs/rockchip-iq-tools/assets/en-p076-figure-01.png)

<!-- Source EN PDF p.76, unit 654 -->

Abbildung 5-4-1-1: Gamma-Oberfläche

<!-- Source EN PDF p.76, unit 655 -->

2. Funktionen der visuellen Oberfläche in 5-4-1-2:

<!-- Source EN PDF p.76, unit 656 -->

1) Kurvenbereich: Rote Punkte ziehen. Bei AutoWrite wird jede Änderung sofort auf das Board geschrieben.

<!-- Source EN PDF p.76, unit 657 -->

2) Curve Coeff erzeugt Gamma-Kurven anhand von Koeffizienten. Eine Änderung erzeugt automatisch eine neue Kurve und kann die manuell angepasste überschreiben.

<!-- Source EN PDF p.76, unit 658 -->

3. Position Control: Beim Zeigen auf einen Punkt aktualisieren sich X und Y. Y lässt sich manuell setzen.

<!-- Source EN PDF p.76, unit 659 -->

4. Control Point Number: Anzahl der Kontrollpunkte, wahlweise 49, 45, 24 oder 13.

<!-- Source EN PDF p.76, unit 660 -->

5. Axis Range ändert den Maßstab von X und Y, besonders für dicht liegende Punkte im dunklen Bereich.

<!-- Source EN PDF p.76, unit 661 -->

6. Export/Import speichert Gamma-Kurven in Dateien oder liest sie daraus.

<!-- Source EN PDF p.77, unit 662 -->

![Technische Abbildung aus dem englischen PDF, Seite 77](/docs/rockchip-iq-tools/assets/en-p077-figure-01.png)

<!-- Source EN PDF p.77, unit 663 -->

Abbildung 5-4-1-2: visuelles Gamma-Abstimmungsfenster

<!-- Source EN PDF p.77, unit 664 -->

#### 5.4.2 Gamma-Kurve abstimmen

<!-- Source EN PDF p.77, unit 665 -->

Blau zeigt die ursprüngliche, Rot die aktuelle Kurve. Über einem roten Punkt erscheint ein Auf-/Ab-Pfeil. Beim vertikalen Ziehen folgt die rote Kurve der Punktposition (5-4-2-1).

<!-- Source EN PDF p.77, unit 666 -->

![Technische Abbildung aus dem englischen PDF, Seite 77](/docs/rockchip-iq-tools/assets/en-p077-figure-02.png)

<!-- Source EN PDF p.77, unit 667 -->

Abbildung 5-4-2-1: Kurve nach Ziehen des Punkts

<!-- Source EN PDF p.78, unit 668 -->

Gamma Coeff in Curve Coeff auf 1.5 setzen und Enter drücken. Daraus entsteht eine neue Kurve (5-4-2-2).

<!-- Source EN PDF p.78, unit 669 -->

![Technische Abbildung aus dem englischen PDF, Seite 78](/docs/rockchip-iq-tools/assets/en-p078-figure-01.png)

<!-- Source EN PDF p.78, unit 670 -->

Abbildung 5-4-2-2: Kurve anhand von Koeffizienten

<!-- Source EN PDF p.79, unit 671 -->

## 6 Weitere Funktionen

<!-- Source EN PDF p.79, unit 672 -->

### 6.1 IQ-Datei importieren

<!-- Source EN PDF p.79, unit 673 -->

File Transfer → Send File To Device wählen, IQ-Datei und Speicherpfad auf dem Gerät angeben und Send anklicken. Nach der Übertragung liegt die Datei im Zielpfad (6-1-1).

<!-- Source EN PDF p.79, unit 674 -->

![Technische Abbildung aus dem englischen PDF, Seite 79](/docs/rockchip-iq-tools/assets/en-p079-figure-01.png)

<!-- Source EN PDF p.79, unit 675 -->

Abbildung 6-1-1: Übertragungspfad festlegen

<!-- Source EN PDF p.79, unit 676 -->

![Technische Abbildung aus dem englischen PDF, Seite 79](/docs/rockchip-iq-tools/assets/en-p079-figure-02.png)

<!-- Source EN PDF p.79, unit 677 -->

Abbildung 6-1-2: Datei erfolgreich übertragen

<!-- Source EN PDF p.79, unit 678 -->

### 6.2 Offline-Raw-Simulation

<!-- Source EN PDF p.79, unit 679 -->

Diese Funktion überträgt Raw-Bilder zurück auf das Board und verarbeitet sie mit dem ISP.

<!-- Source EN PDF p.79, unit 680 -->

1. File → Send RAW Image To Device öffnet die Konfiguration.

<!-- Source EN PDF p.80, unit 681 -->

![Technische Abbildung aus dem englischen PDF, Seite 80](/docs/rockchip-iq-tools/assets/en-p080-figure-01.png)

<!-- Source EN PDF p.80, unit 682 -->

Abbildung 6-2-1: Raw-Konfigurationsseite öffnen

<!-- Source EN PDF p.80, unit 683 -->

2. Mit Add Raw-Dateien laden.

<!-- Source EN PDF p.80, unit 684 -->

![Technische Abbildung aus dem englischen PDF, Seite 80](/docs/rockchip-iq-tools/assets/en-p080-figure-02.png)

<!-- Source EN PDF p.80, unit 685 -->

Abbildung 6-2-2: Raw-Bilder laden

<!-- Source EN PDF p.80, unit 686 -->

Nur .rkraw mit internen Daten compact+align256 wird unterstützt. Andere Formate lassen sich mit RKRAW Tool stapelweise konvertieren. Bei Raw-Aufnahmen außerdem RKRawV2 in config.ini auf 1 setzen. Die Quelle verweist für Online-Raw auf 3.7.2; tatsächlich steht Raw in 3.7.3. Die Abweichung ist dokumentiert.

<!-- Source EN PDF p.81, unit 687 -->

3. Send überträgt Raw zum Gerät und erzeugt eine Konfigurationsdatei unter /tmp.

<!-- Source EN PDF p.81, unit 688 -->

![Technische Abbildung aus dem englischen PDF, Seite 81](/docs/rockchip-iq-tools/assets/en-p081-figure-01.png)

<!-- Source EN PDF p.81, unit 689 -->

Abbildung 6-2-3: Raw zum Gerät senden

<!-- Source EN PDF p.81, unit 690 -->

5. Fenster offen lassen und die Kameraanwendung neu starten. Nach Erkennen der Konfigurationsdatei wechselt das Gerät in die Offline-Simulation. Schritt 4 fehlt in der Quelle; die ursprüngliche Nummerierung ist mit Hinweis erhalten.

<!-- Source EN PDF p.81, unit 691 -->

6. Run startet die Simulation.

<!-- Source EN PDF p.81, unit 692 -->

7. Raw-Bilder werden nacheinander zum ISP gesendet. Verarbeitete Bilder erscheinen in der Kameravorschau. Online-Parameterlesen/-schreiben und YUV-Aufnahmen bleiben möglich.

<!-- Source EN PDF p.81, unit 693 -->

8. Zum Wechseln der Raw-Dateien:

<!-- Source EN PDF p.81, unit 694 -->

1) Stop pausiert die Offline-Simulation.

<!-- Source EN PDF p.81, unit 695 -->

2) Mit Add Raw-Dateien laden.

<!-- Source EN PDF p.81, unit 696 -->

3) Mit Send Raw-Dateien senden.

<!-- Source EN PDF p.81, unit 697 -->

4) Run startet die Offline-Simulation.

{% endraw %}
