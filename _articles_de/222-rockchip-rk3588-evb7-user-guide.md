---
title: "Rockchip RK3588 EVB7 Benutzerhandbuch"
description: "Rockchip RK3588 EVB7 Benutzerhandbuch — V1.0"
excerpt: "Rockchip RK3588 EVB7 Benutzerhandbuch"
translation_key: "222-rockchip-rk3588-evb7-user-guide"
slug: "222-rockchip-rk3588-evb7-user-guide"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: [ArmSoM, Rockchip, RK3588, EVB7]
---

{% raw %}

# Rockchip RK3588 EVB7 Benutzerhandbuch

Vollständiger technischer Text auf Grundlage von V1.0 Chinesisch (2023-06-20, 44 Seiten) und Englisch (2023-06-29, 43 Seiten). Produktversion, Glossar und alle vier Kapitel bleiben erhalten; Rechts-, Zielgruppen-, Revisions- und Inhaltsverzeichnisseiten entfallen. Beschrieben wird das konkrete Rockchip EVB7, nicht eine ArmSoM-Produktspezifikation oder aktuelle Supportzusage. Es wurden keine Flash-, Verdrahtungs- oder Hardwaretests durchgeführt. Firmwareupdates können Daten überschreiben: vorher sichern und Firmware sowie Boardversion prüfen. Display und Erweiterungsboard niemals im Betrieb stecken; ESD- und Versorgungshinweise im letzten Kapitel beachten.

Quellunterschiede und Hinweise: Die chinesische Funktionsübersicht und 3.8 nennen einen SATA-Port; die englische Übersicht und beide Funktionstabellen nennen zwei. Quellwerte bleiben zur Prüfung am tatsächlichen Board erhalten. Chinesisch nennt 1920×1080, Englisch 1080×1920 als Displayauflösung. Chinesisch enthält zusätzlich Untertitel 4.1. Die englischen Bildtitel 3-10/3-11/3-14 UART/VGA/RS484 werden anhand Chinesisch und Fotos zu SATA/DP/RS485 berichtigt; Aggreko-Gehäuse wird gemäß Chinesisch als Acrylgehäuse verstanden. Die chinesischen Angaben zu zwei DPHY-Eingängen mit je vier Lanes / zwei CPHY-Eingängen mit je drei Trios sowie die Steckverbindermodelle aus 2.4 werden ergänzt. Tabelle 3-1 heißt chinesisch CDPHY, englisch DPHY; Signalwerte stimmen überein und bleiben erhalten. TBD bezeichnet unbestimmte Quellwerte, keine redaktionellen Platzhalter. Originalbilder enthalten englische/chinesische Beschriftungen und werden nicht als lokalisierte Grafik ausgegeben.

<!-- source:en p3 unit:0 -->

Dieses Handbuch beschreibt die Grundfunktionen und Hardwaremerkmale des RK3588 EVB7, die Konfiguration multifunktionaler Hardware und Verfahren zur Softwarefehlersuche. Es erleichtert die schnelle, präzise Nutzung des RK3588 EVB7 sowie die Entwicklung von Anwendungen auf Basis des RK3588.

<!-- source:en p3 unit:1 -->

Produktversion. Dieses Dokument gilt für folgende Produktversionen:

<!-- source:en p3 unit:2 -->

| Produktname | Produktversion |
| --- | --- |
| <code>RK3588 EVB7</code> | <code>RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428</code> |

<!-- source:en p5 unit:3 -->

In diesem Dokument verwendete Abkürzungen:

<!-- source:en p5 unit:4 -->

| Abkürzung | Bedeutung des englischen Begriffs | Bedeutung des chinesischen Begriffs |
| --- | --- | --- |
| <code>CPU</code> | Zentrale Verarbeitungseinheit | Zentrale Verarbeitungseinheit |
| <code>NPU</code> | Neuronaler Netzwerkprozessor | Neuronaler Netzwerkprozessor |
| <code>VPU</code> | Videoprozessor | Videoprozessor |
| <code>DDR</code> | Doppelte Datenrate | Synchroner dynamischer Speicher mit doppelter Datenrate |
| <code>eMMC</code> | Eingebettete Multimedia-Speicherkarte | Eingebettete Multimedia-Speicherkarte |
| <code>eDP</code> | Eingebetteter DisplayPort | Eingebettete digitale Audio-/Videoschnittstelle |
| <code>HDMI</code> | Multimediaschnittstelle für hohe Auflösung | Multimediaschnittstelle für hohe Auflösung |
| <code>I2C</code> | Inter-IC-Bus | Inter-IC-Bus mit zwei Leitungen für serielle Kommunikation |
| <code>I2S</code> | Inter-IC-Audiobus | Inter-IC-Audiobus |
| <code>PMIC</code> | Stromversorgungsmanagement-IC | Stromversorgungsmanagement-IC |
| <code>LDO</code> | Linearregler mit geringem Spannungsabfall | Linearregler mit geringem Spannungsabfall |
| <code>DCDC</code> | Gleichspannungswandlung | Gleichspannungswandlung |
| <code>CAN</code> | Controller-Netzwerk | Controller-Netzwerk |
| <code>SARADC</code> | Analog-Digital-Wandler mit sukzessiver Approximation | Analog-Digital-Wandler mit sukzessiver Approximation |
| <code>UART</code> | Universeller asynchroner Empfänger/Sender | Universeller asynchroner Empfänger/Sender |
| <code>JTAG</code> | Gemeinsame Arbeitsgruppe für Testverfahren | Gemeinsame Arbeitsgruppe für Testverfahren |
| <code>PWM</code> | Pulsweitenmodulation | Pulsweitenmodulation |
| <code>MIPI</code> | Prozessorschnittstelle der Mobilgeräteindustrie | Prozessorschnittstelle der Mobilgeräteindustrie |
| <code>LVDS</code> | Niederspannungs-Differenzsignalübertragung | Niederspannungs-Differenzsignalübertragung |
| <code>PMIC</code> | Stromversorgungsmanagement-IC | Stromversorgungsmanagement-IC |
| <code>PMU</code> | Stromversorgungsmanagement-Einheit | Stromversorgungsmanagement-Einheit |
| <code>RK/Rockchip</code> | Rockchip Electronics Co., Ltd. | Rockchip Electronics Co., Ltd. |
| <code>USB</code> | Universeller serieller Bus | Universeller serieller Bus |
| <code>SATA</code> | Serielle Schnittstelle zum Anschluss von Laufwerken | Serielle Schnittstelle zum Anschluss von Laufwerken |
| <code>PCIe</code> | Hochgeschwindigkeitsverbindung für Peripheriekomponenten | Hochgeschwindigkeitsverbindung für Peripheriekomponenten |
| <code>RGB</code> | Rot, Grün, Blau; RGB ist ein industrieller Farbstandard | Rot, Grün, Blau; RGB ist ein industrieller Farbstandard |
| <code>VGA</code> | Video-Grafik-Array | Standardschnittstelle für die Computervideoausgabe |
| <code>ADB</code> | Android-Debugging-Brücke | Android-Debugging-Brücke |
| <code>IR</code> | Infrarotstrahlung | Infrarotstrahlung |
| <code>SPDIF</code> | Digitalschnittstelle von Sony/Philips | Digitale Audioschnittstelle von Sony/Philips |
| <code>RTC</code> | Echtzeituhr | Echtzeituhr |
| <code>RGMII</code> | Reduzierte medienunabhängige Gigabit-Schnittstelle | Reduzierte medienunabhängige Gigabit-Schnittstelle |
| <code>WIFI</code> | Drahtlose Übertragung hoher Wiedergabetreue | Drahtlose Übertragung hoher Wiedergabetreue |
| <code>CIF</code> | Kameraschnittstelle | Kameraschnittstelle |

<!-- source:en p11 unit:6 -->

## 1 Systemübersicht

<!-- source:en p11 unit:7 -->

### 1.1 RK3588 im Überblick

<!-- source:en p11 unit:8 -->

Der RK3588 ist ein leistungsfähiger, stromsparender Anwendungsprozessor mit 4 Cortex-A76-Kernen, 4 Cortex-A55-Kernen und einem unabhängigen NEON-Coprozessor. Er eignet sich für ARM-PCs, Edge-Computing, persönliche mobile Internetgeräte und weitere Multimedia-Produkte. Integrierte Hardwarebeschleuniger unterstützen anspruchsvolle Anwendungen. Der Chip decodiert H.265 und VP9 mit bis zu 8K@60fps, H.264 mit 8K@30fps und AV1 mit 4K@60fps. Er unterstützt außerdem H.264/H.265-Encoding mit 8K@30fps, hochwertiges JPEG-Encoding/Decoding sowie dedizierte Bildvor- und -nachverarbeitung. Die integrierte 3D-GPU ist mit OpenGL ES1.1/2.0/3.2, OpenCL 2.2 und Vulkan 1.2 kompatibel. Eine spezielle 2D-Hardwareeinheit mit MMU steigert die Anzeigeleistung und ermöglicht eine flüssige Bedienung. Der vollständig hardwarebasierte ISP der neuen Generation verarbeitet bis zu 48 Millionen Pixel und beschleunigt HDR, 3A, LSC, 3DNR, 2DNR, Schärfung, Entnebelung, Fischaugen- und Gammakorrektur. Die NPU unterstützt gemischte INT4/INT8/INT16/FP16-Operationen mit bis zu 6TOP. Modelle aus TensorFlow/MXNet/PyTorch/Caffe lassen sich dank der breiten Kompatibilität konvertieren. Die leistungsfähige 4-Kanal-Speicherschnittstelle für LPDDR4/LPDDR4X/LPDDR5 unterstützt Systeme mit hohem Bandbreitenbedarf; zahlreiche Peripherieschnittstellen ermöglichen vielfältige Anwendungen.

<!-- source:en p12 unit:10 -->

### 1.2 Blockschaltbild des RK3588

<!-- source:en p12 unit:11 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p012-figure-01.png)

<!-- source:en p12 unit:12 -->

Abbildung 1-1. Blockschaltbild des RK3588

<!-- source:en p12 unit:13 -->

### 1.3 Systemaufbau

<!-- source:en p12 unit:14 -->

#### 1.3.1 Systemblockschaltbild

<!-- source:en p12 unit:15 -->

Das RK3588-EVB7-System verwendet RK3588 mit einem einzelnen RK806-1-PMIC. Der Speicher kombiniert LPDDR4X und eMMC. Unterstützt werden 2xHDMI TX, 1xDP OUT, 1xHDMI RX, 2xMIPI TX, SATA, PCIe30x4, TYPEC, 2xRJ45 und weitere Schnittstellen. Das System bildet eine stabile, serienfertigungstaugliche Lösung. Nachfolgend das detaillierte Blockdiagramm:

<!-- source:en p13 unit:17 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p013-system-block.png)

<!-- source:en p13 unit:18 -->

Abbildung 1-2. Systemblockschaltbild des RK3588 EVB7

<!-- source:en p13 unit:19 -->

#### 1.3.2 Funktionsübersicht

<!-- source:en p13 unit:20 -->

Der RK3588 EVB7 bietet folgende Funktionen:

<!-- source:en p13 unit:21 -->

- DC Power: Versorgungseingang für einen 12-V-Gleichspannungsadapter

<!-- source:en p13 unit:22 -->

- TYPEC: eine vollständige TYPEC-Schnittstelle, zugleich Kanal zur Firmwareaktualisierung und DP1.4-Ausgang

<!-- source:en p13 unit:23 -->

- USB2.0 HOST1: ein USB2.0-standard-A-Anschluss für Maus, USB-Stick, USB-Hub und weitere Geräte

<!-- source:en p13 unit:24 -->

- USB2.0 OTG: ein USB2.0-standard-A-Anschluss mit OTG für PC, Maus, USB-Stick, USB-Hub und weitere Geräte

<!-- source:en p13 unit:25 -->

- USB3.0 HOST: ein USB3.0-standard-A-Anschluss für Maus, USB-Stick, USB-Hub und weitere Geräte

- MIPI DCPHY RX (Ergänzung aus Chinesisch): zwei MIPI-DPHY-Eingänge mit je vier Lanes oder zwei MIPI-CPHY-Eingänge mit je drei Trios über einen 80-poligen Steckverbinder.

<!-- source:en p13 unit:26 -->

- MIPI DPHY RX: zwei MIPI-Eingänge mit je vier Lanes oder vier Eingänge mit je zwei Lanes über einen 80-poligen Steckverbinder. Das Erweiterungsboard RK_EVB_RK3588_EXTBOARD1_IMX415_V11_20211027 ermöglicht Foto- und Videoaufnahmen

<!-- source:en p13 unit:27 -->

- HDMI2.1 OUT: zwei HDMI2.1-OUT-standard-A-Anschlüsse, jeweils bis 8K@60Hz

<!-- source:en p13 unit:28 -->

- DP OUT: ein DP-OUT-standard-A-Anschluss, bis 4K@60Hz

<!-- source:en p13 unit:29 -->

- HDMI2.0 IN: ein HMI-IN-standard-A-Anschluss, Videoeingang bis 4K@60Hz

<!-- source:en p14 unit:31 -->

- MIPI DPHY0/1 TX: zwei MIPI-Ausgänge mit je vier Lanes über FPC-Kabel

<!-- source:en p14 unit:32 -->

- Wi-Fi (2T2R MIMO): AP6398-Modul mit externer SMA-Antenne für drahtlosen Internetzugang

<!-- source:en p14 unit:33 -->

- Ethernet: zwei RJ45-Ports für 10/100/1000M-Ethernet.

<!-- source:en p14 unit:34 -->

- Audio: Lautsprecher- und Kopfhörerausgang sowie Aufnahme über ein einzelnes Mikrofon.

<!-- source:en p14 unit:35 -->

- SATA3.0: zwei 7-polige SATA-Anschlüsse.

<!-- source:en p14 unit:36 -->

- PCIe3.0: ein standardmäßiger PCIex4-Steckplatz für PCIe-Erweiterungen

<!-- source:en p14 unit:37 -->

- TF Card: Erweiterung über TF-Karte, Unterstützung für SD3.0 und MMC ver4.51

<!-- source:en p14 unit:38 -->

- UART Debug: Debugging und LOG-Ausgabe über TYPEC oder MINI USB.

<!-- source:en p14 unit:39 -->

- JTAG: Debug-Schnittstelle des Systems.

<!-- source:en p14 unit:40 -->

- Systemtasten: Reset, MASKROM, PWRON, V+/Recover, V-, MENU, ESC.

<!-- source:en p14 unit:41 -->

- SPDIF: digitale Audioschnittstelle.

<!-- source:en p14 unit:42 -->

- RTC: HYM8563TS mit Versorgung durch die Platine oder eine CR1220-3V-Knopfzelle.

<!-- source:en p14 unit:43 -->

#### 1.3.3 Funktionsschnittstellen

<!-- source:en p14 unit:44 -->

Tabelle 1-1. Funktionsschnittstellen der Leiterplatte

<!-- source:en p14 unit:45 -->

| Funktion | Verfügbar |
| --- | --- |
| LPDDR4x (Gesamtkapazität 8 GB) | <code>Ja</code> |
| eMMC (Gesamtkapazität 32 GB) | <code>Ja</code> |
| 12-V-Gleichspannungseingang | <code>Ja</code> |
| TYPEC | <code>Ja</code> |
| USB3.0 OTG (1 Port) | <code>Ja</code> |
| USB2.0 Host (1 Port) | <code>Ja</code> |
| USB2.0 OTG (1 Port) | <code>Ja</code> |
| MIPI D/CPHY RX | <code>Ja</code> |
| MIPI DPHY RX | <code>Ja</code> |
| HDMI2.0 RX | <code>Ja</code> |
| HDMI2.1 OUT (2 Ports) | <code>Ja</code> |
| MIPI DPHY DSI TX1 (2x4 Lanes) | <code>Ja</code> |
| DP OUT | <code>Ja</code> |
| BT und Wi-Fi (2x2 Wi-Fi und BT5.0) | <code>Ja</code> |
| Gigabit-Ethernet 10M/100M/1000M (2 Ports) | <code>Ja</code> |
| Audio (Lautsprecher, Mikrofon, Kopfhörer) | <code>Ja</code> |
| SATA3.0 (2 Ports) | <code>Ja</code> |
| PCIe3.0 (4 Lanes) | <code>Ja</code> |
| UART-Debugging (TPYEC/MINI USB) | <code>Ja</code> |
| JTAG-Schnittstelle | <code>Ja</code> |
| Systemtasten | <code>Ja</code> |
| Maskrom-Taste | <code>Ja</code> |

<!-- source:en p15 unit:48 -->

#### 1.3.4 Anordnung der Funktionsmodule

<!-- source:en p15 unit:49 -->

Anordnung der EVB7-Schnittstellen:

<!-- source:en p15 unit:50 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p015-figure-01.png)

<!-- source:en p15 unit:51 -->

Abbildung 1-3. EVB7-Schnittstellen auf der Vorderseite

<!-- source:en p16 unit:53 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p016-figure-01.png)

<!-- source:en p16 unit:54 -->

Abbildung 1-4. EVB7-Schnittstellen auf der Rückseite

<!-- source:en p16 unit:55 -->

### 1.4 Lieferumfang

<!-- source:en p16 unit:56 -->

Zum RK3588-EVB7-Kit gehören:

<!-- source:en p16 unit:57 -->

- RK3588 EVB7.

<!-- source:en p16 unit:58 -->

- Netzteil: Eingang 100V AC~240V AC, 50Hz; Ausgang 12V DC, 3A.

<!-- source:en p16 unit:59 -->

- MIPI-Display, 5.5 Zoll im Hochformat, Auflösung 1080*1920.

<!-- source:en p16 unit:60 -->

- Eine 2.4G/5G-Dualband-Antenne mit SMA-Stecker.

<!-- source:en p16 unit:61 -->

- Monokulares IMX415-Kameramodul (EVB_RK3588_EXTBOARD1_IMX415_V11_20211027)

<!-- source:en p16 unit:62 -->

### 1.5 Ein-/Ausschalten und Standby

<!-- source:en p16 unit:63 -->

Ein-/Ausschalten und Standby des EVB7:

<!-- source:en p16 unit:64 -->

- Einschalten: DC 12V anschließen und den Hauptschalter einschalten. Sobald die Android-Oberfläche erscheint, wurde die Standardfirmware erfolgreich gestartet.

<!-- source:en p16 unit:65 -->

- Ausschalten: die Einschalttaste 6 Sekunden gedrückt halten.

<!-- source:en p16 unit:66 -->

- Standby: Mit der Einschalttaste wechselt das System in die erste Standby-Stufe. Wenn keine USB-OTG-Verbindung, keine weitere Bedienung (etwa Tastendrücke) und keine softwareseitige Wake_Lock-Quelle vorliegen, folgt nach etwa 3s die zweite Stufe. Mit der Power-Taste lässt sich Standby wieder verlassen.

<!-- source:en p17 unit:68 -->

### 1.6 Firmware-Update

<!-- source:en p17 unit:69 -->

#### 1.6.1 Installation des USB-Treibers

<!-- source:en p17 unit:70 -->

Vor der Aktualisierung muss der Treiber installiert werden. Nachfolgend die Installation unter Windows: Im Werkzeugordner DriverAssitant_v5.1.1 suchen und DriverInstall.exe starten. Auf „Install Driver“ klicken und die Erfolgsmeldung abwarten. Ist ein alter Treiber installiert, „Uninstall Driver“ wählen und anschließend neu installieren.

<!-- source:en p17 unit:71 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p017-figure-01.png)

<!-- source:en p17 unit:72 -->

Abbildung 1-5. Erfolgreiche Treiberinstallation

<!-- source:en p17 unit:73 -->

#### 1.6.2 Verfahren zum Firmware-Update

<!-- source:en p17 unit:74 -->

Für den RK3588 EVB7 stehen zwei Update-Verfahren zur Verfügung:

<!-- source:en p17 unit:75 -->

- Loader-Modus: Vor dem Einschalten SARADC_IN1 auf Low halten, damit das System in den Loader-Modus wechselt. Vorgehen:

<!-- source:en p17 unit:76 -->

1) TYPEC mit dem PC verbinden und V+/REC auf der Hauptplatine gedrückt halten.

<!-- source:en p17 unit:77 -->

2) EVB mit 12 V versorgen. Falls bereits eingeschaltet, die Reset-Taste drücken.

<!-- source:en p17 unit:78 -->

3) Sobald das Werkzeug ein Loader-Gerät meldet, V+/REC loslassen. Im rot markierten Bereich rechtsklicken, „Import Configuration“ wählen, den Firmware-Pfad öffnen und die config-Datei auswählen.

<!-- source:en p17 unit:79 -->

4) Die passenden Dateien für Loader, Parameter, Uboot und weitere Komponenten auswählen.

<!-- source:en p17 unit:80 -->

5) Mit Execute das Update starten. Rechts werden Downloadfortschritt und Prüfstatus angezeigt.

<!-- source:en p18 unit:82 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p018-figure-01.png)

<!-- source:en p18 unit:83 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p018-figure-02.png)

<!-- source:en p18 unit:84 -->

Abbildung 1-6. Wechsel in den Loader-Programmiermodus

<!-- source:en p18 unit:85 -->

- MASKROM-Aktualisierungsmodus: Vor dem Einschalten muss SARADC_IN0 Low sein. Vorgehensweise:

<!-- source:en p18 unit:86 -->

1) TYPEC mit dem PC verbinden und die MASKROM-Taste auf der Platine gedrückt halten.

<!-- source:en p18 unit:87 -->

2) EVB mit 12 V versorgen. Falls bereits eingeschaltet, die Reset-Taste drücken.

<!-- source:en p18 unit:88 -->

3) Sobald ein MASKROM-Gerät erkannt wurde, MASKROM loslassen. Im rot markierten Bereich rechtsklicken, „Import Configuration“ wählen und im Firmware-Verzeichnis config.cfg auswählen.

<!-- source:en p18 unit:89 -->

4) Die passenden Dateien für Loader, Parameter, Uboot und weitere Komponenten auswählen.

<!-- source:en p18 unit:90 -->

5) Mit Execute das Update starten. Rechts werden Downloadfortschritt und Prüfstatus angezeigt.

<!-- source:en p19 unit:92 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p019-figure-01.png)

<!-- source:en p19 unit:93 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p019-figure-02.png)

<!-- source:en p19 unit:94 -->

Abbildung 1-7. Wechsel in den MASKROM-Programmiermodus

<!-- source:en p19 unit:95 -->

### 1.7 Debugging über die serielle Schnittstelle

<!-- source:en p19 unit:96 -->

#### 1.7.1 Serielles Terminal

<!-- source:en p19 unit:97 -->

Den MINI-USB-Debug-Anschluss des Boards mit dem PC verbinden. Im Windows-Geräte-Manager die aktuelle COM-Portnummer feststellen.

<!-- source:en p20 unit:99 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p020-figure-01.png)

<!-- source:en p20 unit:100 -->

Abbildung 1-8. Ermitteln der COM-Portnummer

<!-- source:en p20 unit:101 -->

Im Terminal „Quick Connect“ öffnen, die serielle Schnittstelle und die passende Portnummer wählen. Die Baudrate auf 1.5M setzen (Standard des RK3588), unter Serial die Flusssteuerung deaktivieren und mit „Open“ die Debug-Verbindung öffnen.

<!-- source:en p21 unit:103 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p021-figure-01.png)

<!-- source:en p21 unit:104 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p021-figure-02.png)

<!-- source:en p21 unit:105 -->

Abbildung 1-9. Konfiguration des seriellen Terminals

<!-- source:en p22 unit:107 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p022-figure-01.png)

<!-- source:en p22 unit:108 -->

Abbildung 1-10. Serielle Debug-Ausgabe

<!-- source:en p22 unit:109 -->

#### 1.7.2 ADB-Debugging

<!-- source:en p22 unit:110 -->

1) Die erfolgreiche Treiberinstallation prüfen und den PC mit TYPE_C auf der Seite des Stromanschlusses verbinden.

<!-- source:en p22 unit:111 -->

2) Die Platine einschalten und das System starten.

<!-- source:en p22 unit:112 -->

3) Das adb-Werkzeug auf dem PC öffnen.

<!-- source:en p22 unit:113 -->

4) Mit `adb shell` die Debug-Shell öffnen.

<!-- source:en p22 unit:114 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p022-figure-02.png)

<!-- source:en p22 unit:115 -->

Abbildung 1-11. Erfolgreiche ADB-Verbindung

<!-- source:en p23 unit:116 -->

## 2 Hardwarebeschreibung

<!-- source:en p23 unit:117 -->

### 2.1 Platinenansicht

<!-- source:en p23 unit:118 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p023-figure-01.png)

<!-- source:en p23 unit:119 -->

Abbildung 2-1. Ansicht des RK3588 EVB7

<!-- source:en p24 unit:120 -->

### 2.2 Stromversorgungs-Blockschaltbild

<!-- source:en p24 unit:121 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p024-figure-01.png)

<!-- source:en p24 unit:122 -->

Abbildung 2-2. Blockschaltbild des RK3588 EVB7

<!-- source:en p24 unit:123 -->

### 2.3 I2C-Adressen

<!-- source:en p24 unit:124 -->

Die Platine stellt zahlreiche Peripherieschnittstellen bereit. Beim Debuggen von I2C-Geräten muss die Mehrfachbelegung der I2C-Kanäle berücksichtigt werden. Tabelle 2-1 enthält die Adressen und Signalpegel der vorhandenen Geräte.<br><br>Tabelle 2-1. Peripherieadressen und IO-Pegel der I2C-Kanäle

<!-- source:en p24 unit:125 -->

| I2C-Kanal | Gerät | I2C-Adresse | Versorgungsdomäne |
| --- | --- | --- | --- |
| <code>I2C0_M2</code> | <code>RK860-2/RK860-3</code> | <code>0x42/0x43</code> | <code>3.3V</code> |
| <code>I2C1_M2</code> | <code>RK860-2</code> | <code>0x42</code> | <code>3.3V</code> |
| <code>I2C2_M4</code> | <code>MIPI DCPHY0/DCPHY1</code> | <code>TBD</code> | <code>1.8V</code> |
| <code>I2C3_M0</code> | <code>MIPI CSI0/MIPI CSI1</code> | <code>TBD</code> | <code>1.8V</code> |
| <code>I2C4_M1</code> | <code>STK3311-A/ICM-42607</code> | <code>TBD</code> | <code>1.8V</code> |
| <code>I2C5_M0</code> | <code>Touchpanel</code> | <code>TBD</code> | <code>3.3V</code> |
| <code>I2C6_M0</code> | <code>HYM8563TS</code> | <code>0xA3</code> | <code>3.3V</code> |
| <code>I2C7_M0</code> | <code>ES8388</code> | <code>0x10</code> | <code>1.8V</code> |
| <code>HDMITX0_I2C</code> | <code>HDMI_TX0</code> | <code>TBD</code> | <code>3.3V</code> |
| <code>HDMITX1_I2C</code> | <code>HDMI_TX1</code> | <code>TBD</code> | <code>3.3V</code> |
| <code>HDMIRX_I2C</code> | <code>HDMI_RX</code> | <code>TBD</code> | <code>3.3V</code> |

<!-- source:en p24 unit:126 -->

Hinweis: Die I2C-Adressen einer Erweiterungsplatine dürfen nicht mit denen der Hauptplatine kollidieren.

<!-- source:en p25 unit:127 -->

### 2.4 Erweiterungssteckverbinder

<!-- source:en p25 unit:128 -->

Bei Bedarf kann eine eigene Erweiterungsplatine entwickelt werden. U4600 und U4700 sind vertikale, zweireihige 80-polige Steckverbinder mit 0.3mm breiten Kontakten und 0.8mm Raster. Die folgenden Zeichnungen zeigen die Abmessungen.

Steckverbindermodelle aus der chinesischen Quelle: Board 61082-081402LF; Gegenstecker des Erweiterungsboards 61083-081402LF.

<!-- source:en p25 unit:129 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p025-figure-01.png)

<!-- source:en p25 unit:130 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p025-figure-02.png)

<!-- source:en p26 unit:131 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p026-figure-01.png)

<!-- source:en p26 unit:132 -->

Abbildung 2-3. Leiterplatten-Footprint des vertikalen zweireihigen 80-poligen Steckverbinders mit 0.8mm Raster

<!-- source:en p26 unit:133 -->

### 2.5 Referenzunterlagen

<!-- source:en p26 unit:134 -->

Schaltplan und Leiterplattenprojekt des EVB7:

<!-- source:en p26 unit:135 -->

- Schaltplan: RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428RZF.DSN

<!-- source:en p26 unit:136 -->

- Leiterplattenentwurf: RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428YWQ_final.brd

<!-- source:en p27 unit:137 -->

## 3 Modulbeschreibung

<!-- source:en p27 unit:138 -->

### 3.1 Stromversorgungseingang

<!-- source:en p27 unit:139 -->

Das Netzteil liefert 12 V/3 A. Ein vorgeschalteter Abwärtswandler erzeugt VCC4V0_SYS für den PMIC, der die verschiedenen Systemspannungen bereitstellt. Netzteileingang, Abwärtswandler und PMIC sind nachfolgend dargestellt:

<!-- source:en p27 unit:140 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p027-figure-01.png)

<!-- source:en p27 unit:141 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p027-figure-02.png)

<!-- source:en p27 unit:142 -->

Abbildung 3-1. DC12V-Eingang, vorgeschalteter Buck-Wandler und PMIC

<!-- source:en p28 unit:143 -->

### 3.2 Speicher

<!-- source:en p28 unit:144 -->

- eMMC: Auf der Platine ist eMMC FLASH mit standardmäßig 32GB vorgesehen.

<!-- source:en p28 unit:145 -->

- DDR: zwei LPDDR4x-Bausteine mit je 4GB, insgesamt 8GB.

<!-- source:en p28 unit:146 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p028-figure-01.png)

<!-- source:en p28 unit:147 -->

Abbildung 3-2. Position der LPDDR4x-Bausteine

<!-- source:en p28 unit:148 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p028-figure-02.png)

<!-- source:en p28 unit:149 -->

Abbildung 3-3. Position von eMMC. Position der Taste für den MASKROM-Programmiermodus des EVB:

<!-- source:en p28 unit:150 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p028-figure-03.png)

<!-- source:en p28 unit:151 -->

Abbildung 3-4. Taste für den MASKROM-Programmiermodus

<!-- source:en p29 unit:152 -->

### 3.3 RTC-Schaltung

<!-- source:en p29 unit:153 -->

Die RTC-Schaltung verwendet HYM8563TS mit Versorgung vom Board oder einer eigenen Knopfzelle. Diese gehört standardmäßig nicht zum Lieferumfang; eine CR1220-3V ist separat zu erwerben. Die Uhr hält auch ohne Boardversorgung die Zeit und kommuniziert über I2C mit dem Prozessor.

<!-- source:en p29 unit:154 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p029-figure-01.png)

<!-- source:en p29 unit:155 -->

Abbildung 3-5. RTC-Schaltung

<!-- source:en p29 unit:156 -->

### 3.4 Tasteneingänge

<!-- source:en p29 unit:157 -->

SARADC_IN1 dient als RECOVER-Erkennung mit 12-Bit-Auflösung. Über V+/REC lässt sich der LOADER-Programmiermodus starten. RESET ermöglicht einen Hardware-Reset und Neustart. Weitere Tasten sind V+, V-, ESC, MENU und PWRON. Ihre Positionen sind unten dargestellt.

<!-- source:en p29 unit:158 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p029-figure-02.png)

<!-- source:en p29 unit:159 -->

Abbildung 3-6. Positionen der Tasten

<!-- source:en p30 unit:160 -->

### 3.5 SATA-Stromanschluss

<!-- source:en p30 unit:161 -->

Die Stromanschlüsse für SATA-Geräte liefern 12V beziehungsweise 5V.

<!-- source:en p30 unit:162 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p030-figure-01.png)

<!-- source:en p30 unit:163 -->

Abbildung 3-7. SATA-Stromausgänge 12V/5V

<!-- source:en p30 unit:164 -->

### 3.6 PCIe-Steckverbinder

<!-- source:en p30 unit:165 -->

Der Standard-PCIe3.0-Steckverbinder ermöglicht die Kommunikation mit einer externen PCIe-Karte.

<!-- source:en p30 unit:166 -->

- Betriebsarten: End Point (EP) und Root Complex (RC).

<!-- source:en p30 unit:167 -->

- Die Verbindung unterstützt 4 Daten-Lanes.

<!-- source:en p30 unit:168 -->

- Der externe Taktbaustein AU5426 liefert 100 MHz.

<!-- source:en p30 unit:169 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p030-figure-02.png)

<!-- source:en p30 unit:170 -->

Abbildung 3-8. PCIex4-Steckverbinder

<!-- source:en p30 unit:171 -->

### 3.7 Ethernet-Ports

<!-- source:en p30 unit:172 -->

Das Board besitzt zwei RJ45-Anschlüsse für zwei Gigabit-Ethernet-Verbindungen.

<!-- source:en p31 unit:173 -->

Zur Anbindung der externen PHYs dienen der integrierte Gigabit-Ethernet-MAC beziehungsweise PCIe2.0. Die PHY-Modelle sind RTL8211F-CG/RTL8111HS. Eigenschaften:

<!-- source:en p31 unit:174 -->

- IEEE802.3-kompatibel; Voll- und Halbduplex sowie automatische Erkennung und Anpassung der Kreuzverbindung.

<!-- source:en p31 unit:175 -->

- Datenraten 10/100/1000M.

<!-- source:en p31 unit:176 -->

- RJ45 mit integriertem Übertrager zur galvanischen Trennung und Statusanzeige.

<!-- source:en p31 unit:177 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p031-figure-01.png)

<!-- source:en p31 unit:178 -->

Abbildung 3-9. Gigabit-Netzwerkschnittstellen

<!-- source:en p31 unit:179 -->

### 3.8 SATA-Schnittstellen

<!-- source:en p31 unit:180 -->

Das Board stellt einen 7-poligen SATA-Anschluss bereit.

<!-- source:en p31 unit:181 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p031-figure-02.png)

<!-- source:en p31 unit:182 -->

Abbildung 3-10. SATA-Schnittstelle

<!-- source:en p31 unit:183 -->

### 3.9 DP-Ausgang

<!-- source:en p31 unit:184 -->

Das Board unterstützt Videoausgabe über DP bis 4K@60.

<!-- source:en p32 unit:185 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p032-figure-01.png)

<!-- source:en p32 unit:186 -->

Abbildung 3-11. DP-Videoausgang

<!-- source:en p32 unit:187 -->

### 3.10 BT/WIFI-Schnittstelle

<!-- source:en p32 unit:188 -->

Das Board verwendet das kombinierte Wi-Fi-/BT-Modul AMPAK AP6398S mit folgenden Eigenschaften:

<!-- source:en p32 unit:189 -->

- 2x2WIFI (2.4G und 5G, 802.11 a/b/g/n/ac), BT5.0 und zwei externe SMA-Antennen.

<!-- source:en p32 unit:190 -->

- BT-Daten werden über UART übertragen.

<!-- source:en p32 unit:191 -->

- BT-Audio ist mit der I2S-Schnittstelle des Hauptprozessors verbunden.

<!-- source:en p32 unit:192 -->

- Wi-Fi-Daten werden über SDIO übertragen. Das RK3588 EVB7 wird mit einer Dualbandantenne für 2,4/5 GHz ausgestattet.

<!-- source:en p32 unit:193 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p032-figure-02.png)

<!-- source:en p32 unit:194 -->

Abbildung 3-12. BT/WIFI-Antennenanschlüsse

<!-- source:en p33 unit:195 -->

### 3.11 Debug-Schnittstellen

<!-- source:en p33 unit:196 -->

Das Board besitzt einen USB-UART-Wandler mit MINI-USB-Debugschnittstelle.

<!-- source:en p33 unit:197 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p033-figure-01.png)

<!-- source:en p33 unit:198 -->

Abbildung 3-13. Debug-Schnittstellen

<!-- source:en p33 unit:199 -->

### 3.12 RS485 und RS232

<!-- source:en p33 unit:200 -->

Das EVB sieht jeweils eine RS485- und eine RS232-Schnittstelle vor.

<!-- source:en p33 unit:201 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p033-figure-02.png)

<!-- source:en p33 unit:202 -->

Abbildung 3-14. RS485-Steckverbinder

<!-- source:en p34 unit:203 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p034-figure-01.png)

<!-- source:en p34 unit:204 -->

Abbildung 3-15. RS232-Steckverbinder

<!-- source:en p34 unit:205 -->

### 3.13 MIPI-D/CPHY-Eingang

<!-- source:en p34 unit:206 -->

Der MIPI-D/CPHY-Eingang verwendet den vertikalen 80-poligen Steckverbinder 61082-081402LF mit 0,8 mm Raster (siehe 2.4). Er unterstützt zwei MIPI-D/CPHY-Eingänge: zwei DPHY-Module mit je vier Lanes oder zwei CPHY-Module mit je drei Trios. Maximal sind 4,5 Gbit/s je DPHY-Lane beziehungsweise 5,7 Gbit/s je CPHY-Trio möglich. Der Gegenstecker ist 61083-081402LF; Gehäusemaße stehen in 2.4. Erweiterungsboards können bedarfsgerecht entwickelt werden.

<!-- source:en p34 unit:208 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p034-figure-02.png)

<!-- source:en p34 unit:209 -->

Abbildung 3-16. MIPI-D/CPHY-RX-Eingang

<!-- source:en p35 unit:210 -->

Pinbelegung von MIPI D/CPHY_RX: Tabelle 3-1. MIPID/CPHY_RX-Signaldefinitionen

<!-- source:en p35 unit:211 -->

| Pin | DPHY (einzeln) | DPHY (doppelt) | Pin |
| --- | --- | --- | --- |
| <code>1</code> | <code>GND</code> | <code>GND</code> | <code>2</code> |
| <code>3</code> | <code>MIPI_DPHY1_RX_D0N/MIPI_CPHY1_RX_TRIO0_A</code> | <code>MIPI_DPHY0_RX_D0N/MIPI_CPHY0_RX_TRIO0_A</code> | <code>4</code> |
| <code>5</code> | <code>MIPI_DPHY1_RX_D0P/MIPI_CPHY1_RX_TRIO0_B</code> | <code>MIPI_DPHY0_RX_D0P/MIPI_CPHY0_RX_TRIO0_B</code> | <code>6</code> |
| <code>7</code> | <code>GND</code> | <code>GND</code> | <code>8</code> |
| <code>9</code> | <code>MIPI_DPHY1_RX_D1N/MIPI_CPHY1_RX_TRIO0_C</code> | <code>MIPI_DPHY0_RX_D1N/MIPI_CPHY0_RX_TRIO0_C</code> | <code>10</code> |
| <code>11</code> | <code>MIPI_DPHY1_RX_D1P/MIPI_CPHY1_RX_TRIO1_A</code> | <code>MIPI_DPHY0_RX_D1P/MIPI_CPHY0_RX_TRIO1_A</code> | <code>12</code> |
| <code>13</code> | <code>GND</code> | <code>GND</code> | <code>14</code> |
| <code>15</code> | <code>MIPI_DPHY1_RX_CLKN/MIPI_CPHY1_RX_TRIO1_B</code> | <code>MIPI_DPHY0_RX_CLKN/MIPI_CPHY0_RX_TRIO1_B</code> | <code>16</code> |
| <code>17</code> | <code>MIPI_DPHY1_RX_CLKP/MIPI_CPHY1_RX_TRIO1_C</code> | <code>MIPI_DPHY0_RX_CLKP/MIPI_CPHY0_RX_TRIO1_C</code> | <code>18</code> |
| <code>19</code> | <code>GND</code> | <code>GND</code> | <code>20</code> |
| <code>21</code> | <code>MIPI_DPHY1_RX_D2N/MIPI_CPHY1_RX_TRIO2_A</code> | <code>MIPI_DPHY0_RX_D2N/MIPI_CPHY0_RX_TRIO2_A</code> | <code>22</code> |
| <code>23</code> | <code>MIPI_DPHY1_RX_D2P/MIPI_CPHY1_RX_TRIO2_B</code> | <code>MIPI_DPHY0_RX_D2P/MIPI_CPHY0_RX_TRIO2_B</code> | <code>24</code> |
| <code>25</code> | <code>GND</code> | <code>GND</code> | <code>26</code> |
| <code>27</code> | <code>MIPI_DPHY1_RX_D3N/MIPI_CPHY1_RX_TRIO2_C</code> | <code>MIPI_DPHY0_RX_D3N/MIPI_CPHY0_RX_TRIO2_C</code> | <code>28</code> |
| <code>29</code> | <code>MIPI_DPHY1_RX_D3P/NO_USE</code> | <code>MIPI_DPHY0_RX_D3P/NO_USE</code> | <code>30</code> |
| <code>31</code> | <code>GND</code> | <code>GND</code> | <code>32</code> |
| <code>33</code> | <code>NC</code> | <code>NC</code> | <code>34</code> |
| <code>35</code> | <code>NC</code> | <code>NC</code> | <code>36</code> |
| <code>37</code> | <code>GND</code> | <code>GND</code> | <code>38</code> |
| <code>39</code> | <code>MIPI_CAM1_CLKOUT</code> | <code>MIPI_CAM2_CLKOUT</code> | <code>40</code> |
| <code>41</code> | <code>NC</code> | <code>NC</code> | <code>42</code> |
| <code>43</code> | <code>GND</code> | <code>GND</code> | <code>44</code> |
| <code>45</code> | <code>I2C2_SDA_M4_MIPI</code> | <code>I2C2_SDA_M4_MIPI</code> | <code>46</code> |
| <code>47</code> | <code>I2C2_SCL_M4_MIPI</code> | <code>I2C2_SCL_M4_MIPI</code> | <code>48</code> |
| <code>49</code> | <code>NC</code> | <code>NC</code> | <code>50</code> |
| <code>51</code> | <code>MIPI_CAM1_PDN_L</code> | <code>MIPI_CAM2_PDN_L</code> | <code>52</code> |
| <code>53</code> | <code>NC</code> | <code>NC</code> | <code>54</code> |
| <code>55</code> | <code>NC</code> | <code>NC</code> | <code>56</code> |
| <code>57</code> | <code>MIPI_DPHY_FSYNC</code> | <code>MIPI_DPHY_FSYNC</code> | <code>58</code> |
| <code>59</code> | <code>MIPI_DPHY_HSYNC/PWM15_M2</code> | <code>MIPI_DPHY_HSYNC</code> | <code>60</code> |
| <code>61</code> | <code>VCC_1V8_S3</code> | <code>VCC_3V3_S3</code> | <code>62</code> |
| <code>63</code> | <code>NC</code> | <code>NC</code> | <code>64</code> |
| <code>65</code> | <code>MIPI_CAM1_PWREN_H</code> | <code>MIPI_CAM2_PWREN_H</code> | <code>66</code> |
| <code>67</code> | <code>IRC_AIN</code> | <code>NC</code> | <code>68</code> |
| <code>69</code> | <code>IRC_BIN</code> | <code>NC</code> | <code>70</code> |
| <code>71</code> | <code>NC</code> | <code>NC</code> | <code>72</code> |
| <code>73</code> | <code>NC</code> | <code>NC</code> | <code>74</code> |
| <code>75</code> | <code>GND</code> | <code>GND</code> | <code>76</code> |
| <code>77</code> | <code>VCC_5V0</code> | <code>GND</code> | <code>78</code> |
| <code>79</code> | <code>VCC_5V0</code> | <code>VCC12V_DCIN</code> | <code>80</code> |

<!-- source:en p36 unit:212 -->

### 3.14 MIPI-DPHY-Eingang

<!-- source:en p36 unit:213 -->

Der MIPI-DPHY-Eingang verwendet den vertikalen 80-poligen Steckverbinder 61082-081402LF mit 0,8 mm Raster (siehe 2.4). Er unterstützt zwei MIPI-DPHY-Module mit je vier Lanes oder vier MIPI-DPHY-Eingänge mit je zwei Lanes, bis 2,5 Gbit/s je Lane. Zusammen mit MIPI D/CPHY sind bis zu sechs Moduleingänge möglich. Der Gegenstecker ist 61083-081402LF; Gehäusemaße stehen in 2.4.

<!-- source:en p36 unit:214 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p036-figure-01.png)

<!-- source:en p36 unit:215 -->

Abbildung 3-17. MIPI-DPHY-Videoeingang. Tabelle 3-2. MIPI-DPHY_RX-Signaldefinitionen

<!-- source:en p36 unit:216 -->

| Pin | DPHY (einzeln) | DPHY (doppelt) | Pin |
| --- | --- | --- | --- |
| <code>1</code> | <code>GND</code> | <code>GND</code> | <code>2</code> |
| <code>3</code> | <code>MIPI_CSI0_RX_D0N</code> | <code>MIPI_CSI1_RX_D0N</code> | <code>4</code> |
| <code>5</code> | <code>MIPI_CSI0_RX_D0P</code> | <code>MIPI_CSI1_RX_D0P</code> | <code>6</code> |
| <code>7</code> | <code>GND</code> | <code>GND</code> | <code>8</code> |
| <code>9</code> | <code>MIPI_CSI0_RX_D1N</code> | <code>MIPI_CSI1_RX_D1N</code> | <code>10</code> |
| <code>11</code> | <code>MIPI_CSI0_RX_D1P</code> | <code>MIPI_CSI1_RX_D1P</code> | <code>12</code> |
| <code>13</code> | <code>GND</code> | <code>GND</code> | <code>14</code> |
| <code>15</code> | <code>MIPI_CSI0_RX_CLK0N</code> | <code>MIPI_CSI1_RX_CLK0N</code> | <code>16</code> |
| <code>17</code> | <code>MIPI_CSI0_RX_CLK0P</code> | <code>MIPI_CSI1_RX_CLK0P</code> | <code>18</code> |
| <code>19</code> | <code>GND</code> | <code>GND</code> | <code>20</code> |
| <code>21</code> | <code>MIPI_CSI0_RX_D2N</code> | <code>MIPI_CSI1_RX_D2N</code> | <code>22</code> |
| <code>23</code> | <code>MIPI_CSI0_RX_D2P</code> | <code>MIPI_CSI1_RX_D2P</code> | <code>24</code> |
| <code>25</code> | <code>GND</code> | <code>GND</code> | <code>26</code> |
| <code>27</code> | <code>MIPI_CSI0_RX_D3N</code> | <code>MIPI_CSI1_RX_D3N</code> | <code>28</code> |
| <code>29</code> | <code>MIPI_CSI0_RX_D3P</code> | <code>MIPI_CSI1_RX_D3P</code> | <code>30</code> |
| <code>31</code> | <code>GND</code> | <code>GND</code> | <code>32</code> |
| <code>33</code> | <code>MIPI_CSI0_RX_CLK1N</code> | <code>MIPI_CSI1_RX_CLK1N</code> | <code>34</code> |
| <code>35</code> | <code>MIPI_CSI0_RX_CLK1P</code> | <code>MIPI_CSI1_RX_CLK1P</code> | <code>36</code> |
| <code>37</code> | <code>GND</code> | <code>GND</code> | <code>38</code> |
| <code>39</code> | <code>MIPI_CAM3_CLKOUT</code> | <code>MIPI_CAM4_CLKOUT</code> | <code>40</code> |
| <code>41</code> | <code>NC</code> | <code>NC</code> | <code>42</code> |
| <code>43</code> | <code>GND</code> | <code>GND</code> | <code>44</code> |
| <code>45</code> | <code>I2C3_SDA_M0_MIPI</code> | <code>I2C3_SDA_M0_MIPI</code> | <code>46</code> |
| <code>47</code> | <code>I2C3_SCL_M0_MIPI</code> | <code>I2C3_SCL_M0_MIPI</code> | <code>48</code> |
| <code>49</code> | <code>NC</code> | <code>NC</code> | <code>50</code> |
| <code>51</code> | <code>MIPI_CAM3_PDN_L</code> | <code>MIPI_CAM5_PDN_L</code> | <code>52</code> |
| <code>53</code> | <code>NC</code> | <code>NC</code> | <code>54</code> |
| <code>55</code> | <code>MIPI_CAM4_PDN_L</code> | <code>MIPI_CAM6_PDN_L</code> | <code>56</code> |
| <code>57</code> | <code>MIPI_DPHY_FSYNC</code> | <code>MIPI_DPHY_FSYNC</code> | <code>58</code> |
| <code>59</code> | <code>MIPI_DPHY_HSYNC/PWM15_M2</code> | <code>MIPI_DPHY_HSYNC</code> | <code>60</code> |
| <code>61</code> | <code>VCC_1V8_S3</code> | <code>VCC_3V3_S3</code> | <code>62</code> |
| <code>63</code> | <code>NC</code> | <code>NC</code> | <code>64</code> |
| <code>65</code> | <code>MIPI_CAM3/4_PWREN_H</code> | <code>MIPI_CAM5/6_PWREN_H</code> | <code>66</code> |
| <code>67</code> | <code>IRC_AIN</code> | <code>NC</code> | <code>68</code> |
| <code>69</code> | <code>IRC_BIN</code> | <code>NC</code> | <code>70</code> |
| <code>71</code> | <code>NC</code> | <code>NC</code> | <code>72</code> |
| <code>73</code> | <code>NC</code> | <code>NC</code> | <code>74</code> |
| <code>75</code> | <code>GND</code> | <code>GND</code> | <code>76</code> |
| <code>77</code> | <code>VCC_5V0</code> | <code>GND</code> | <code>78</code> |
| <code>79</code> | <code>VCC_5V0</code> | <code>VCC12V_DCIN</code> | <code>80</code> |

<!-- source:en p37 unit:217 -->

### 3.15 TYPEC-Schnittstelle

<!-- source:en p37 unit:218 -->

Eine vollständige TYPEC-Schnittstelle unterstützt:

<!-- source:en p37 unit:219 -->

- Firmware-Download über TYPEC0_USB20_OTG.

<!-- source:en p37 unit:220 -->

- TYPEC-Funktionalität.

<!-- source:en p37 unit:221 -->

- DP1.4-Ausgabe.

<!-- source:en p38 unit:222 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p038-figure-01.png)

<!-- source:en p38 unit:223 -->

Abbildung 3-18. TYPEC-Schnittstelle

<!-- source:en p38 unit:224 -->

### 3.16 USB3.0-Schnittstelle

<!-- source:en p38 unit:225 -->

Die Platine stellt einen USB3.0-OTG-Port als Standard-A-Anschluss für USB3.0-Sticks und andere USB3.0-Geräte bereit.

<!-- source:en p38 unit:226 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p038-figure-02.png)

<!-- source:en p38 unit:227 -->

Abbildung 3-19. USB3.0-OTG-Schnittstelle

<!-- source:en p38 unit:228 -->

### 3.17 USB2.0-OTG/Host-Schnittstelle

<!-- source:en p38 unit:229 -->

Das Board unterstützt einen USB2.0-HOST- und einen USB2.0-OTG-Anschluss für USB-Geräte wie Maus, USB-Stick und Bluetooth.

<!-- source:en p39 unit:230 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p039-figure-01.png)

<!-- source:en p39 unit:231 -->

Abbildung 3-20. USB2.0-Schnittstelle

<!-- source:en p39 unit:232 -->

### 3.18 HDMI-Ausgänge

<!-- source:en p39 unit:233 -->

Zwei HDMI-Standard-A-Ausgänge unterstützen HDMI2.1 und Video bis 8K@60fps.

<!-- source:en p39 unit:234 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p039-figure-02.png)

<!-- source:en p39 unit:235 -->

Abbildung 3-21. HDMI-TX-Schnittstellen

<!-- source:en p39 unit:236 -->

### 3.19 HDMI-Eingang

<!-- source:en p39 unit:237 -->

Das Board besitzt einen HDMI2.0-Videoeingang bis 4K60fps.

<!-- source:en p40 unit:238 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p040-figure-01.png)

<!-- source:en p40 unit:239 -->

Abbildung 3-22. HDMI-RX-Schnittstelle

<!-- source:en p40 unit:240 -->

### 3.20 Lüfteranschluss

<!-- source:en p40 unit:241 -->

Das Board sieht einen Lüfteranschluss für 12-V-/5-V-Lüfter mit Drehzahlregelung vor. Mitgeliefert wird ein 12-V-Lüfter. Pinfolge von links nach rechts: GND, 12V, SENSOR, CONTROL.

<!-- source:en p40 unit:242 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p040-figure-02.png)

<!-- source:en p40 unit:243 -->

Abbildung 3-23. Lüfter-Stromanschluss

<!-- source:en p40 unit:244 -->

### 3.21 Erweiterung des Sensormoduls

<!-- source:en p40 unit:245 -->

Die Platine ist mit einem IMX415-Modul für bis zu 8 Millionen Pixel ausgestattet (chinesisches Original: 800万; englischer Text: 800W).

<!-- source:en p40 unit:246 -->

- Automatischer Weißabgleich, 3D-Rauschunterdrückung und HDR.

<!-- source:en p40 unit:247 -->

- RAW10/RAW12-Datenausgabe.

<!-- source:en p40 unit:248 -->

- Integrierte IRCUT-Umschaltung für Tag-/Nachtbetrieb des Sensors.

<!-- source:en p40 unit:249 -->

- Eine vorgesehene 24-polige MIPI-Schnittstelle ermöglicht bei Bedarf eine Erweiterung für Stereo-Vision.

<!-- source:en p41 unit:250 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p041-figure-01.png)

<!-- source:en p41 unit:251 -->

Abbildung 3-24. IMX415-Modulplatine<br><br>Die folgende Tabelle zeigt die Signale des Erweiterungsanschlusses.<br><br>Tabelle 3-3. Erweiterungssignale des IMX415-Moduls

<!-- source:en p41 unit:252 -->

| Pin | DPHY |
| --- | --- |
| <code>1</code> | <code>GND</code> |
| <code>2</code> | <code>GND</code> |
| <code>3</code> | <code>NC</code> |
| <code>4</code> | <code>MIPI_DCPHY1_RX_RST_L</code> |
| <code>5</code> | <code>I2C5_SDA_M0_MIPI</code> |
| <code>6</code> | <code>I2C5_SCL_M0_MIPI</code> |
| <code>7</code> | <code>GND</code> |
| <code>8</code> | <code>GND</code> |
| <code>9</code> | <code>MIPI_DPHY1_RX_D0N</code> |
| <code>10</code> | <code>MIPI_DPHY1_RX_D0P</code> |
| <code>11</code> | <code>MIPI_DPHY1_RX_D1N</code> |
| <code>12</code> | <code>MIPI_DPHY1_RX_D1P</code> |
| <code>13</code> | <code>MIPI_DPHY1_RX_D2N</code> |
| <code>14</code> | <code>MIPI_DPHY1_RX_D2P</code> |
| <code>15</code> | <code>MIPI_DPHY1_RX_D3N</code> |
| <code>16</code> | <code>MIPI_DPHY1_RX_D3P</code> |
| <code>17</code> | <code>GND</code> |
| <code>18</code> | <code>MIPI_DPHY1_RX_CLKN</code> |
| <code>19</code> | <code>MIPI_DPHY1_RX_CLKP</code> |
| <code>20</code> | <code>GND</code> |
| <code>21</code> | <code>MIPI_CAM2_CLKOUT</code> |
| <code>22</code> | <code>VCC_3V3_O</code> |
| <code>23</code> | <code>VCC_3V3_D</code> |
| <code>24</code> | <code>VCC_3V3_A</code> |

<!-- source:en p42 unit:253 -->

### 3.22 Lautsprecheranschlüsse

<!-- source:en p42 unit:254 -->

Das Board sieht zwei Lautsprecheranschlüsse vor; zwei Standardlautsprecher sind im Acrylgehäuse vormontiert.

<!-- source:en p42 unit:255 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p042-figure-01.png)

<!-- source:en p42 unit:256 -->

Abbildung 3-25. SPK-Anschluss

<!-- source:en p43 unit:257 -->

## 4 Vorsichtsmaßnahmen

<!-- source:en p43 unit:258 -->

Der RK3588 EVB7 ist für Labor- und Entwicklungsumgebungen vorgesehen. Vor dem Betrieb sind folgende Hinweise zu beachten:

<!-- source:en p43 unit:259 -->

- Displayanschluss und Erweiterungsplatine dürfen unter keinen Umständen im laufenden Betrieb ein- oder ausgesteckt werden.

<!-- source:en p43 unit:260 -->

- Vor dem Auspacken und Installieren geeignete ESD-Schutzmaßnahmen ergreifen, um Schäden durch elektrostatische Entladung zu verhindern.

<!-- source:en p43 unit:261 -->

- Die Platine an den Kanten halten und freiliegende Metallteile nicht berühren, damit Bauteile nicht durch statische Elektrizität beschädigt werden.

<!-- source:en p43 unit:262 -->

- Die Platine auf einer trockenen Oberfläche betreiben und von Wärmequellen, elektromagnetischen Stör- und Strahlungsquellen sowie strahlungsempfindlichen Geräten, etwa medizinischen Geräten, fernhalten.

{% endraw %}
