---
title: "Vollständiges Benutzerhandbuch für Rockchip RK3588 EVB1"
description: "Vollständiges Benutzerhandbuch für Rockchip RK3588 EVB1 — V1.2, PMIC, MIPI, PCIe, SATA, USB, HDMI, JTAG"
excerpt: "Vollständiges Benutzerhandbuch für Rockchip RK3588 EVB1"
translation_key: "221-rockchip-rk3588-evb1"
slug: "221-rockchip-rk3588-evb1"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM", "Rockchip", "RK3588", "EVB1", "hardware"]
---

{% raw %}

# Vollständiges Benutzerhandbuch für Rockchip RK3588 EVB1

Plattformreferenz für ArmSoM: Dies ist das Herstellerhandbuch für Rockchip RK3588 EVB1, keine Bedienungsanleitung für eine ArmSoM-Platine. Stromversorgung, Steckverbinder, Tasten, PMICs und Pinbelegung beziehen sich auf das ursprüngliche EVB1. Vor der Übertragung auf ArmSoM SoC, Schaltplan und Platinenrevision prüfen. Die Beispiele verwenden Android, nennen jedoch keine einheitliche SDK/BSP- oder Kernelversion; Firmware und Werkzeuge müssen zur Zielplatine passen. Es erfolgte keine Hardwarevalidierung. Herstellerangaben und Screenshots sind keine ArmSoM-Messungen. Flashen kann gespeicherte Daten überschreiben: vorher sichern und das Firmware-Image prüfen.

Quellen: chinesisches und englisches RK3588 EVB1 User Guide V1.2. Technisches Vorwort, Abkürzungen und Kapitel 1–4 bleiben vollständig erhalten. Unterschiede und offene Prüfungen stehen am Ende.

Dieses Handbuch beschreibt die Grundfunktionen und Hardwaremerkmale des RK3588 EVB1, die Konfiguration seiner Hardwarefunktionen sowie die Software-Debugging-Verfahren. Es erleichtert die sichere Nutzung des EVB1 und den Einstieg in Entwicklungslösungen auf Basis des RK3588.

Produktversion, auf die sich dieses Handbuch bezieht:

| Produktname | Produktversion |
| --- | --- |
| RK3588 EVB1 | RK_EVB1_RK3588_LP4XD200P232SD10H1_V10_20210818 |

Im Handbuch verwendete Abkürzungen:

| Abkürzung | Englische Langform | Beschreibung |
| --- | --- | --- |
| CPU | Central Processing Unit | Zentralprozessor |
| NPU | Neural Network Processing Unit | Neuronaler Netzwerkprozessor |
| VPU | Video Processing Unit | Videoprozessor |
| DDR | Double Data Rate | Synchroner dynamischer Speicher mit doppelter Datenrate |
| eMMC | Embedded Multi Media Card | Eingebettete Multimedia-Speicherkarte |
| eDP | Embedded DisplayPort | Eingebettete digitale Audio-/Videoschnittstelle |
| HDMI | High Definition Multimedia Interface | Hochauflösende Multimediaschnittstelle |
| I2C | Inter-Integrated Circuit | Zweidrahtige serielle Verbindung zwischen integrierten Schaltungen |
| I2S | Inter-IC Sound | Audiobus zwischen integrierten Schaltungen |
| PMIC | Power Management IC | Stromverwaltungs-IC |
| LDO | Low Drop Out Linear Regulator | Linearregler mit geringer Dropout-Spannung |
| DCDC | Direct Current to Direct Current | Gleichspannungswandlung |
| CAN | Controller Area Network | Controller-Netzwerk |
| SARADC | Successive Approximation Register Analog to<br>Digital Converter | Analog-Digital-Wandler mit sukzessiver Approximation |
| UART | Universal Asynchronous Receiver/ Transmitter | Universeller asynchroner Empfänger/Sender |
| JTAG | Joint Test Action Group | Gemeinsame Arbeitsgruppe für Testverfahren |
| PWM | Pulse Width Modulation | Pulsweitenmodulation |
| MIPI | Mobile Industry Processor Interface | Prozessorschnittstelle der Mobilgeräteindustrie |
| LVDS | Low-Voltage Differential Signaling | Niederspannungs-Differenzsignalübertragung |
| PMIC | Power Management IC | Stromverwaltungs-IC |
| PMU | Power Management Unit | Stromverwaltungseinheit |
| RK/Rockchip | Rockchip Electronics Co.,Ltd. | Rockchip Electronics Co., Ltd. |
| USB | Universal Serial Bus | Universeller serieller Bus |
| SATA | Serial Advanced Technology Attachment | Serielle Massenspeicheranbindung |
| PCIe | Peripheral Component Interconnect Express | Schnelle Verbindung von Peripheriekomponenten |
| RGB | Red,Green,Blue;RGB color mode is a color<br>standard in industry | Rot, Grün, Blau; RGB ist ein industrieller Farbstandard |
| VGA | Video Graphics Array | Standardisierte Computerschnittstelle für Videobilder |
| ADB | Android Debug Bridge | Android-Debugging-Brücke |
| IR | Infrared Radiation | Infrarotstrahlung |
| SPDIF | Sony/Philips Digital Interface | Digitale Audioschnittstelle von Sony/Philips |
| RTC | Real-time clock | Echtzeituhr |
| RGMII | Reduced Gigabit Media Independent Interface | Reduzierte medienunabhängige Gigabit-Schnittstelle |
| WIFI | Wireless Fidelity | Drahtloskommunikation (Wireless Fidelity) |
| CIF | Camera Interface | Kameraschnittstelle |

## 1 Systemübersicht

### 1.1 RK3588 im Überblick

Der RK3588 ist ein leistungsfähiger, stromsparender Anwendungsprozessor mit 4 Cortex-A76-Kernen, 4 Cortex-A55-Kernen und einem unabhängigen NEON-Coprozessor. Er eignet sich für ARM-PCs, Edge-Computing, persönliche mobile Internetgeräte und weitere Multimedia-Produkte. Integrierte Hardwarebeschleuniger unterstützen anspruchsvolle Anwendungen. Der Chip decodiert H.265 und VP9 mit bis zu 8K@60fps, H.264 mit 8K@30fps und AV1 mit 4K@60fps. Er unterstützt außerdem H.264/H.265-Encoding mit 8K@30fps, hochwertiges JPEG-Encoding/Decoding sowie dedizierte Bildvor- und -nachverarbeitung. Die integrierte 3D-GPU ist mit OpenGL ES1.1/2.0/3.2, OpenCL 2.2 und Vulkan 1.2 kompatibel. Eine spezielle 2D-Hardwareeinheit mit MMU steigert die Anzeigeleistung und ermöglicht eine flüssige Bedienung. Der vollständig hardwarebasierte ISP der neuen Generation verarbeitet bis zu 48 Millionen Pixel und beschleunigt HDR, 3A, LSC, 3DNR, 2DNR, Schärfung, Entnebelung, Fischaugen- und Gammakorrektur. Die NPU unterstützt gemischte INT4/INT8/INT16/FP16-Operationen mit bis zu 6TOP. Modelle aus TensorFlow/MXNet/PyTorch/Caffe lassen sich dank der breiten Kompatibilität konvertieren. Die leistungsfähige 4-Kanal-Speicherschnittstelle für LPDDR4/LPDDR4X/LPDDR5 unterstützt Systeme mit hohem Bandbreitenbedarf; zahlreiche Peripherieschnittstellen ermöglichen vielfältige Anwendungen.

### 1.2 Blockschaltbild des RK3588

![RK3588-EVB1-Originalabbildung — 1](/docs/rockchip-rk3588-evb1/assets/en-p012-figure-01.png)

Abbildung 1-1. Blockschaltbild des RK3588

### 1.3 Systemaufbau

#### 1.3.1 Systemblockschaltbild

Der RK3588 bildet den Kern des RK3588 EVB1. Als Stromversorgung sind zwei RK806-2-PMICs oder ein einzelner RK806-1 vorgesehen. LPDDR4X, eMMC, MIPI TX, SATA/PCIe und weitere externe Schnittstellen bilden eine stabile, serienfertigungstaugliche Lösung. Das folgende Blockschaltbild zeigt den Aufbau.

![RK3588-EVB1-Originalabbildung — 2](/docs/rockchip-rk3588-evb1/assets/en-p013-system-block.png)

Abbildung 1-2. Systemblockschaltbild des RK3588 EVB1

#### 1.3.2 Funktionsübersicht

Der RK3588 EVB1 bietet folgende Funktionen:

- DC Power: Anschluss für ein DC-12V-Netzteil.

- TYPEC: eine vollständige TYPEC-Schnittstelle für Firmware-Updates und DP1.4-Ausgabe.

- USB2.0 HOST0/1: zwei USB2.0-Standard-A-Anschlüsse für Maus, USB-Stick, USB-Hub und weitere Geräte.

- MIPI DCPHY: zwei MIPI-DPHY-Eingänge mit je 4 Lanes oder zwei MIPI-CPHY-Eingänge mit je 3 Trios über einen 80-poligen Steckverbinder.

- MIPI DPHY: zwei MIPI-Eingänge mit je 4 Lanes oder zwei Eingänge mit je 2 Lanes über einen 80-poligen Steckverbinder (Angabe der ursprünglichen Übersicht).

- HDMI2.1 OUT: zwei HDMI2.1-Standard-A-Ausgänge, jeweils bis 8K@60Hz.

- MIPI DPHY0/1 TX: zwei MIPI-Ausgänge mit je 4 Lanes über FPC-Kabel.

- VGA OUT: Umwandlung von DP in VGA (im englischen Original: VAG).

- PCIe Wi-Fi (2T2RWifi6&BT5.0): AP6275P/AP6275PR3 mit externer SMA-Antenne für drahtlosen Internetzugang.

- Ethernet: zwei RJ45-Ports für 10/100/1000M-Ethernet.

- Audio: Lautsprecher- und Kopfhörerausgang sowie Aufnahme über ein einzelnes Mikrofon.

- SATA3.0: zwei 7-polige SATA-Anschlüsse.

- PCIe3.0: ein Standard-PCIex4-Anschluss für PCIe-Erweiterungen.

- UART Debug: Debugging und LOG-Ausgabe über TYPEC oder MINI USB.

- JTAG: Debug-Schnittstelle des Systems.

- Systemtasten: Reset, MASKROM, PWRON, V+/Recover, V-, MENU, ESC.

- SPDIF: digitale Audioschnittstelle.

- RTC: HYM8563TS mit Versorgung durch die Platine oder eine CR1220-3V-Knopfzelle.

#### 1.3.3 Funktionsschnittstellen

Tabelle 1-1. Funktionsschnittstellen der Leiterplatte

| Funktion | Verfügbarkeit |
| --- | --- |
| LPDDR4x (insgesamt 8GB) | Ja |
| eMMC (insgesamt 32GB) | Ja |
| SPI Flash | Standardmäßig nicht bestückt |
| DC-12V-Eingang | Ja |
| USB3.0 OTG (1 Port) | Ja |
| USB2.0 Host (2 Ports) | Ja |
| MIPI D/CPHY RX | Ja |
| MIPI DPHY RX | Ja |
| HDMI2.0 RX | Ja |
| HDMI2.1 OUT (2 Ports) | Ja |
| MIPI DPHY DSI TX1 (2x4lane) | Ja |
| VGA OUT | Ja |
| BT&PCIe Wifi (2x2 Wifi&BT5.0) | Ja |
| 1000-Mbps-Ethernet, 10M/100M/1000M (2 Ports) | Ja |
| Audio (SPK, MIC, Kopfhörer) | Ja |
| SATA3.0 (2 Ports) | Ja |
| PCIe3.0 (4Lane) | Ja |
| UART Debug (TPYEC/MINI USB) | Ja |
| JTAG-Schnittstelle | Ja |
| Systemtasten | Ja |
| Maskrom-Taste | Ja |

#### 1.3.4 Anordnung der Funktionsmodule

Anordnung der EVB1-Schnittstellen:

![RK3588-EVB1-Originalabbildung — 3](/docs/rockchip-rk3588-evb1/assets/en-p015-figure-01.png)

Abbildung 1-3. EVB1-Schnittstellen auf der Vorderseite

![RK3588-EVB1-Originalabbildung — 4](/docs/rockchip-rk3588-evb1/assets/en-p015-figure-02.png)

Abbildung 1-4. EVB1-Schnittstellen auf der Rückseite

### 1.4 Lieferumfang

Zum RK3588-EVB1-Kit gehören:

- RK3588 EVB1.

- Netzteil: Eingang 100V AC~240V AC, 50Hz; Ausgang 12V DC, 3A.

- MIPI-Display, 5.5 Zoll im Hochformat, Auflösung 1080*1920.

- Eine 2.4G/5G-Dualband-Antenne mit SMA-Stecker.

- Ein monokulares IMX415-Kameramodul.

### 1.5 Ein-/Ausschalten und Standby

Ein-/Ausschalten und Standby des EVB1:

- Einschalten: DC 12V anschließen und den Hauptschalter einschalten. Sobald die Android-Oberfläche erscheint, wurde die Standardfirmware erfolgreich gestartet.

- Ausschalten: die Einschalttaste 6 Sekunden gedrückt halten.

- Standby: Mit der Einschalttaste wechselt das System in die erste Standby-Stufe. Wenn keine USB-OTG-Verbindung, keine weitere Bedienung (etwa Tastendrücke) und keine softwareseitige Wake_Lock-Quelle vorliegen, folgt nach etwa 3s die zweite Stufe. Mit der Power-Taste lässt sich Standby wieder verlassen.

### 1.6 Firmware-Update

#### 1.6.1 Installation des USB-Treibers

Vor dem EVB1-Update muss der Treiber installiert sein. Unter Windows im bereitgestellten Werkzeugordner DriverAssitant_v5.1.1 öffnen und DriverInstall.exe starten. Auf „Install Driver“ klicken und die Erfolgsmeldung abwarten. Ist bereits ein älterer Treiber installiert, zunächst „Uninstall Driver“ wählen und anschließend neu installieren.

![RK3588-EVB1-Originalabbildung — 5](/docs/rockchip-rk3588-evb1/assets/en-p016-figure-01.png)

Abbildung 1-5. Erfolgreiche Treiberinstallation

#### 1.6.2 Verfahren zum Firmware-Update

Für den RK3588 EVB1 stehen zwei Update-Verfahren zur Verfügung:

- Loader-Modus: Vor dem Einschalten SARADC_IN1 auf Low halten, damit das System in den Loader-Modus wechselt. Vorgehen:

1. TYPE_C mit dem Computer verbinden und V+/REC auf der Platine gedrückt halten.

2. EVB1 mit 12V versorgen. Bei bereits eingeschalteter Versorgung Reset drücken.

3. Sobald das Werkzeug ein Loader-Gerät meldet, V+/REC loslassen. Im rot markierten Bereich rechtsklicken, „Import Configuration“ wählen, den Firmware-Pfad öffnen und die config-Datei auswählen.

4. Die passenden Dateien für Loader, Parameter, Uboot und weitere Komponenten auswählen.

5. Mit Execute das Update starten. Rechts werden Downloadfortschritt und Prüfstatus angezeigt.

![RK3588-EVB1-Originalabbildung — 6](/docs/rockchip-rk3588-evb1/assets/en-p017-figure-01.png)

![RK3588-EVB1-Originalabbildung — 7](/docs/rockchip-rk3588-evb1/assets/en-p017-figure-02.png)

Abbildung 1-6. Wechsel in den Loader-Programmiermodus

- MASKROM-Update-Modus:

Liegt SARADC_IN0 vor dem Einschalten auf Low, startet das System im MASKROM-Modus. Vorgehen:

1. TYPE_C mit dem Computer verbinden und MASKROM auf der Platine gedrückt halten.

2. EVB1 mit 12V versorgen. Bei bereits eingeschalteter Versorgung Reset drücken.

3. Sobald ein MASKROM-Gerät erkannt wurde, MASKROM loslassen. Im rot markierten Bereich rechtsklicken, „Import Configuration“ wählen und im Firmware-Verzeichnis config.cfg auswählen.

4. Die passenden Dateien für Loader, Parameter, Uboot und weitere Komponenten auswählen.

5. Mit Execute das Update starten. Rechts werden Downloadfortschritt und Prüfstatus angezeigt.

![RK3588-EVB1-Originalabbildung — 8](/docs/rockchip-rk3588-evb1/assets/en-p018-figure-01.png)

![RK3588-EVB1-Originalabbildung — 9](/docs/rockchip-rk3588-evb1/assets/en-p018-figure-02.png)

Abbildung 1-7. Wechsel in den MASKROM-Programmiermodus

### 1.7 Debugging über die serielle Schnittstelle

#### 1.7.1 Serielles Terminal

Den MINI-USB-Debug-Anschluss der Platine mit dem Computer verbinden und die COM-Portnummer im Geräte-Manager ermitteln.

![RK3588-EVB1-Originalabbildung — 10](/docs/rockchip-rk3588-evb1/assets/en-p019-figure-01.png)

Abbildung 1-8. Ermitteln der COM-Portnummer

Im Terminal „Quick Connect“ öffnen, die serielle Schnittstelle und die passende Portnummer wählen. Die Baudrate auf 1.5M setzen (Standard des RK3588), unter Serial die Flusssteuerung deaktivieren und mit „Open“ die Debug-Verbindung öffnen.

![RK3588-EVB1-Originalabbildung — 11](/docs/rockchip-rk3588-evb1/assets/en-p020-figure-01.png)

![RK3588-EVB1-Originalabbildung — 12](/docs/rockchip-rk3588-evb1/assets/en-p020-figure-02.png)

Abbildung 1-9. Konfiguration des seriellen Terminals

![RK3588-EVB1-Originalabbildung — 13](/docs/rockchip-rk3588-evb1/assets/en-p021-figure-01.png)

Abbildung 1-10. Serielle Debug-Ausgabe

#### 1.7.2 ADB-Debugging

1. Die erfolgreiche Treiberinstallation prüfen und den PC mit TYPE_C auf der Seite des Stromanschlusses verbinden.

2. Die Platine einschalten und das System starten.

3. Das adb-Werkzeug auf dem PC öffnen.

4. Mit `adb shell` die Debug-Shell öffnen.

![RK3588-EVB1-Originalabbildung — 14](/docs/rockchip-rk3588-evb1/assets/en-p021-figure-02.png)

Abbildung 1-11. Erfolgreiche ADB-Verbindung

## 2 Hardwarebeschreibung

### 2.1 Platinenansicht

![RK3588-EVB1-Originalabbildung — 15](/docs/rockchip-rk3588-evb1/assets/en-p022-figure-01.png)

Abbildung 2-1. RK3588 EVB1

### 2.2 Stromversorgungs-Blockschaltbild

![RK3588-EVB1-Originalabbildung — 16](/docs/rockchip-rk3588-evb1/assets/en-p023-figure-01.png)

Abbildung 2-2. Blockschaltbild des RK3588 EVB1

### 2.3 I2C-Adressen

Die Platine stellt zahlreiche Peripherieschnittstellen bereit. Beim Debuggen von I2C-Geräten muss die Mehrfachbelegung der I2C-Kanäle berücksichtigt werden. Tabelle 2-1 enthält die Adressen und Signalpegel der vorhandenen Geräte.

Tabelle 2-1. Peripherieadressen und IO-Pegel der I2C-Kanäle

| I2C-Kanal | Gerät | I2C-Adresse | Versorgungsdomäne |
| --- | --- | --- | --- |
| I2C0 | N/A | N/A | N/A |
| I2C1 | N/A | N/A | N/A |
| I2C2 | HYM8563TS (RTC) | 0xA3 | 1.8V |
| I2C2 | FUSB302B (TYPEC) | 0xD6 | 1.8V |
| I2C2 | RTD2166(VGA) | TBD | 1.8V |
| I2C3 | MIPI CSI0 | TBD | 1.8V |
| I2C4 | MIPI CSI1 | TBD | 1.8V |
| I2C5 | MIPI DCPHY0/1 | TBD | 1.8V |
| I2C6 | Touchpanel | TBD | 3.3V |
| I2C7 | ES8388 (CODEC) | TBD | 1.8V |
| HDMITX0_I2C | HDMI TX0 | TBD | 3.3V |
| HDMITX1_I2C | HDMI TX1 | TBD | 1.8V |
| HDMIRX_I2C | HDMIRX | TBD | 1.8V |

Hinweis: Die I2C-Adressen einer Erweiterungsplatine dürfen nicht mit denen der Hauptplatine kollidieren.

### 2.4 Erweiterungssteckverbinder

Bei Bedarf kann eine eigene Erweiterungsplatine entwickelt werden. U4600 und U4700 sind vertikale, zweireihige 80-polige Steckverbinder mit 0.3mm breiten Kontakten und 0.8mm Raster. Die folgenden Zeichnungen zeigen die Abmessungen.

![RK3588-EVB1-Originalabbildung — 17](/docs/rockchip-rk3588-evb1/assets/en-p024-figure-01.png)

![RK3588-EVB1-Originalabbildung — 18](/docs/rockchip-rk3588-evb1/assets/en-p024-figure-02.png)

![RK3588-EVB1-Originalabbildung — 19](/docs/rockchip-rk3588-evb1/assets/en-p025-figure-01.png)

Abbildung 2-3. Leiterplatten-Footprint des vertikalen zweireihigen 80-poligen Steckverbinders mit 0.8mm Raster

### 2.5 Referenzunterlagen

Schaltplan und Leiterplattenprojekt des EVB1:

- Schaltplan: RK_EVB1_RK3588_LP4XD200P232SD10H1_V11_20211213RZF.DSN;

- Leiterplattenprojekt: RK_EVB1_RK3588_LP4XD200P232SD10H1_V11_20211213_final_lint.brd.

## 3 Modulbeschreibung

### 3.1 Stromversorgungseingang

Das Netzteil liefert 12V/3A. Ein vorgeschalteter Abwärtswandler erzeugt VCC5V0_SYS. Diese Spannung versorgt den PMIC, der die unterschiedlichen Systemspannungen bereitstellt. Die folgenden Bilder zeigen Netzteilanschluss, vorgeschalteten Buck-Wandler und PMIC.

![RK3588-EVB1-Originalabbildung — 20](/docs/rockchip-rk3588-evb1/assets/en-p026-figure-01.png)

![RK3588-EVB1-Originalabbildung — 21](/docs/rockchip-rk3588-evb1/assets/en-p026-figure-02.png)

Abbildung 3-1. DC12V-Eingang, vorgeschalteter Buck-Wandler und PMIC

### 3.2 Speicher

- eMMC: Auf der Platine ist eMMC FLASH mit standardmäßig 32GB vorgesehen.

- SPI Flash: Ein Bestückungsplatz für ein SPI-Bauteil ist vorgesehen.

- DDR: zwei LPDDR4x-Bausteine mit je 4GB, insgesamt 8GB.

![RK3588-EVB1-Originalabbildung — 22](/docs/rockchip-rk3588-evb1/assets/en-p027-figure-01.png)

Abbildung 3-2. Position von LPDDR4x und eMMC

![RK3588-EVB1-Originalabbildung — 23](/docs/rockchip-rk3588-evb1/assets/en-p027-figure-02.png)

Abbildung 3-3. Bestückungsplatz für SPI Flash

Position der Taste zum Starten des MASKROM-Programmiermodus:

![RK3588-EVB1-Originalabbildung — 24](/docs/rockchip-rk3588-evb1/assets/en-p027-figure-03.png)

Abbildung 3-4. EVB1-Taste für den MASKROM-Modus

### 3.3 RTC-Schaltung

Die RTC-Schaltung verwendet HYM8563TS und wird durch die Platine oder eine eigene Knopfzelle versorgt. Eine Batterie gehört nicht zum Standardlieferumfang; eine CR1220-3V-Knopfzelle muss separat beschafft werden. Damit läuft die Uhr auch bei ausgeschalteter Platine weiter. Die Kommunikation mit dem Hauptprozessor erfolgt über I2C.

![RK3588-EVB1-Originalabbildung — 25](/docs/rockchip-rk3588-evb1/assets/en-p028-figure-01.png)

Abbildung 3-5. RTC-Schaltung

### 3.4 Tasteneingänge

SARADC_IN1 dient als RECOVER-Erkennung mit 12-Bit-Auflösung. Über V+/REC lässt sich der LOADER-Programmiermodus starten. RESET ermöglicht einen Hardware-Reset und Neustart. Weitere Tasten sind V+, V-, ESC, MENU und PWRON. Ihre Positionen sind unten dargestellt.

![RK3588-EVB1-Originalabbildung — 26](/docs/rockchip-rk3588-evb1/assets/en-p028-figure-02.png)

Abbildung 3-6. Positionen der Tasten

### 3.5 SATA-Stromanschluss

Die Stromanschlüsse für SATA-Geräte liefern 12V beziehungsweise 5V.

![RK3588-EVB1-Originalabbildung — 27](/docs/rockchip-rk3588-evb1/assets/en-p029-figure-01.png)

Abbildung 3-7. SATA-Stromausgänge 12V/5V

### 3.6 PCIe-Steckverbinder

Der Standard-PCIe3.0-Steckverbinder ermöglicht die Kommunikation mit einer externen PCIe-Karte.

- Betriebsarten: End Point (EP) und Root Complex (RC).

- Die Verbindung unterstützt 4 Daten-Lanes.

- Der 100MHz-Takt wird vom externen Taktbaustein PI6C557-05BLE bereitgestellt.

![RK3588-EVB1-Originalabbildung — 28](/docs/rockchip-rk3588-evb1/assets/en-p029-figure-02.png)

Abbildung 3-8. PCIex4-Steckverbinder

### 3.7 Ethernet-Ports

Zwei RJ45-Ports ermöglichen zwei Gigabit-Ethernet-Verbindungen. Der integrierte Gigabit-Ethernet-MAC und PCIe2.0 sind jeweils mit externen RTL8211F-CG/RTL8111HS-Bausteinen verbunden (im Original beide als PHY bezeichnet). Merkmale:

- IEEE802.3-kompatibel; Voll- und Halbduplex sowie automatische Erkennung und Anpassung der Kreuzverbindung.

- Datenraten 10/100/1000M.

- RJ45 mit integriertem Übertrager zur galvanischen Trennung und Statusanzeige.

![RK3588-EVB1-Originalabbildung — 29](/docs/rockchip-rk3588-evb1/assets/en-p030-figure-01.png)

Abbildung 3-9. Gigabit-Netzwerkschnittstellen

### 3.8 SATA-Schnittstellen

Die Platine stellt zwei 7-polige SATA-Ports bereit.

![RK3588-EVB1-Originalabbildung — 30](/docs/rockchip-rk3588-evb1/assets/en-p030-figure-02.png)

Abbildung 3-10. „UART Debug Interface“ — Originalbeschriftung im SATA-Abschnitt

### 3.9 VGA-Ausgang

Ein Standard-VGA-Videoausgang wird unterstützt; der RTD2166 ist standardmäßig bestückt.

![RK3588-EVB1-Originalabbildung — 31](/docs/rockchip-rk3588-evb1/assets/en-p031-figure-01.png)

Abbildung 3-11. VGA-Videoausgang

### 3.10 BT/WIFI-Schnittstelle

Als WIFI+BT-Modul wird AMPAK AP6275P verwendet. Merkmale:

- 2x2WIFI (2.4G und 5G, 802.11 a/b/g/n/ac), BT5.0 und zwei externe SMA-Antennen.

- BT-Daten werden über UART übertragen.

- BT-Audio ist mit der I2S-Schnittstelle des Hauptprozessors verbunden.

- WIFI-Daten werden über PCIe übertragen. Der RK3588 EVB1 ist standardmäßig mit zwei 2.4GHz/5GHz-Dualband-Antennen ausgestattet.

![RK3588-EVB1-Originalabbildung — 32](/docs/rockchip-rk3588-evb1/assets/en-p031-figure-02.png)

Abbildung 3-12. BT/WIFI-Antennenanschlüsse

### 3.11 Debug-Schnittstellen

Die Platine unterstützt Debugging über TYPEC und MINI USB.

![RK3588-EVB1-Originalabbildung — 33](/docs/rockchip-rk3588-evb1/assets/en-p032-figure-01.png)

Abbildung 3-13. Debug-Schnittstellen

### 3.12 JTAG-Schnittstelle

Es sind 2 JTAG-Schnittstellen vorgesehen; die Abbildung zeigt ARM JTAG. Der Standard-JTAG-Anschluss unterstützt ARM/MCU JTAG mit Umschaltung per DIP-Schalter. Schalter 1/2 ON und 3/4 OFF wählen ARM JTAG; 1/2 OFF und 3/4 ON wählen MCU JTAG.

![RK3588-EVB1-Originalabbildung — 34](/docs/rockchip-rk3588-evb1/assets/en-p033-figure-01.png)

Abbildung 3-14. JTAG-Steckverbinder

![RK3588-EVB1-Originalabbildung — 35](/docs/rockchip-rk3588-evb1/assets/en-p033-figure-02.png)

Abbildung 3-15. DIP-Schalter

### 3.13 MIPI-D/CPHY-Eingang

Der MIPI-D/CPHY-Eingang verwendet einen vertikalen 80-poligen Steckverbinder 61082-081402LF mit 0.8mm Raster (Maße siehe 2.4). Er unterstützt zwei MIPI-D/CPHY-Eingänge: zwei DPHY-Module mit je 4 Lanes oder zwei CPHY-Module mit je 3 Trios. Die maximale Rate beträgt für DPHY/CPHY jeweils 4.5Gbps/Lane und 5.7Gbps/Trio. Der Gegensteckverbinder ist 61083-081402LF. Die Footprint-Abmessungen stehen in Abschnitt 2.4. Eigene Erweiterungsplatinen können nach Bedarf erstellt werden.

![RK3588-EVB1-Originalabbildung — 36](/docs/rockchip-rk3588-evb1/assets/en-p034-figure-01.png)

Abbildung 3-16. MIPI-D/CPHY-RX-Eingang

Die folgende Tabelle zeigt die Signalbelegung von MIPI D/CPHY_RX.

Tabelle 3-1. Signaldefinitionen von MIPI D/CPHY_RX

| Pin | DPHY (einzeln) | DPHY (dual) | CPHY (einzeln) | CPHY (dual) | Pin |
| --- | --- | --- | --- | --- | --- |
| 1 | GND | GND | GND | GND | 2 |
| 3 | MIPI_DPHY0_RX_D0N | MIPI_DPHY1_RX_D0N | MIPI_CPHY0_RX_TRIO0_A | MIPI_CPHY1_RX_TRIO0_A | 4 |
| 5 | MIPI_DPHY0_RX_D0P | MIPI_DPHY1_RX_D0P | MIPI_CPHY0_RX_TRIO0_B | MIPI_CPHY1_RX_TRIO0_B | 6 |
| 7 | GND | GND | GND | GND | 8 |
| 9 | MIPI_DPHY0_RX_D1N | MIPI_DPHY1_RX_D1N | MIPI_CPHY0_RX_TRIO0_C | MIPI_CPHY1_RX_TRIO0_C | 10 |
| 11 | MIPI_DPHY0_RX_D1P | MIPI_DPHY1_RX_D1P | MIPI_CPHY0_RX_TRIO1_A | MIPI_CPHY1_RX_TRIO1_A | 12 |
| 13 | GND | GND | GND | GND | 14 |
| 15 | MIPI_DPHY0_RX_CLKN | MIPI_DPHY1_RX_CLKN | MIPI_CPHY0_RX_TRIO1_B | MIPI_CPHY1_RX_TRIO1_B | 16 |
| 17 | MIPI_DPHY0_RX_CLKP | MIPI_DPHY1_RX_CLKP | MIPI_CPHY0_RX_TRIO1_C | MIPI_CPHY1_RX_TRIO1_C | 18 |
| 19 | GND | GND | GND | GND | 20 |
| 21 | MIPI_DPHY0_RX_D2N | MIPI_DPHY1_RX_D2N | MIPI_CPHY0_RX_TRIO2_A | MIPI_CPHY1_RX_TRIO2_A | 22 |
| 23 | MIPI_DPHY0_RX_D2P | MIPI_DPHY1_RX_D2P | MIPI_CPHY0_RX_TRIO2_B | MIPI_CPHY1_RX_TRIO2_B | 24 |
| 25 | GND | GND | GND | GND | 26 |
| 27 | MIPI_DPHY0_RX_D3N | MIPI_DPHY1_RX_D3N | MIPI_CPHY0_RX_TRIO2_C | MIPI_CPHY1_RX_TRIO2_C | 28 |
| 29 | MIPI_DPHY0_RX_D3P | MIPI_DPHY1_RX_D3P | NO_USE | NO_USE | 30 |
| 31 | GND | GND | GND | GND | 32 |
| 33 | NC | NC | NC | NC | 34 |
| 35 | NC | NC | NC | NC | 36 |
| 37 | GND | GND | GND | GND | 38 |
| 39 | MIPI_CAM1_CLKOUT | MIPI_CAM2_CLKOUT | MIPI_CAM1_CLKOUT | MIPI_CAM2_CLKOUT | 40 |
| 41 | NC | NC | NC | NC | 42 |
| 43 | GND | GND | GND | GND | 44 |
| 45 | I2C5_SDA_M0_MIPI | I2C5_SDA_M0_MIPI | I2C5_SDA_M0_MIPI | I2C5_SDA_M0_MIPI | 46 |
| 47 | I2C5_SCL_M0_MIPI | I2C5_SCL_M0_MIPI | I2C5_SCL_M0_MIPI | I2C5_SCL_M0_MIPI | 48 |
| 49 | NC | NC | NC | NC | 50 |
| 51 | MIPI_DCPHY0_RX_PDN_H | MIPI_DCPHY1_RX_PDN_H | MIPI_DCPHY0_RX_PDN_H | MIPI_DCPHY1_RX_PDN_H | 52 |
| 53 | NC | NC | NC | NC | 54 |
| 55 | NC | NC | NC | NC | 56 |
| 57 | MIPI_DPHY_FSYNC | MIPI_DPHY_FSYNC | MIPI_DPHY_FSYNC | MIPI_DPHY_FSYNC | 58 |
| 59 | MIPI_DPHY_HSYNC | MIPI_DPHY_HSYNC | MIPI_DPHY_HSYNC | MIPI_DPHY_HSYNC | 60 |
| 61 | VCC_1V8_S3 | VCC_3V3_S3 | VCC_1V8_S3 | VCC_3V3_S3 | 62 |
| 63 | NC | NC | NC | NC | 64 |
| 65 | MIPI_DCPHY0_PWREN0_H | MIPI_DCPHY0_PWREN1_H | MIPI_DCPHY0_PWREN0_H | MIPI_DCPHY0_PWREN1_H | 66 |
| 67 | IRC_AIN | NC | IRC_AIN | NC | 68 |
| 69 | IRC_BIN | NC | IRC_BIN | NC | 70 |
| 71 | NC | NC | NC | NC | 72 |
| 73 | NC | NC | NC | NC | 74 |
| 75 | GND | GND | GND | GND | 76 |
| 77 | VCC5V0_SYS | GND | VCC5V0_SYS | GND | 78 |
| 79 | VCC5V0_SYS | VCC12V_DCIN | VCC5V0_SYS | VCC12V_DCIN | 80 |

### 3.14 MIPI-DPHY-Eingang

Der MIPI-DPHY-Eingang verwendet einen vertikalen 80-poligen Steckverbinder 61082-081402LF mit 0.8mm Raster (siehe 2.4). Unterstützt werden zwei MIPI-DPHY-Module mit je 4 Lanes oder vier Eingänge mit je 2 Lanes, jeweils bis 2.5Gbps/Lane. Zusammen mit MIPI D/CPHY sind bis zu 6 Moduleingänge möglich. Der Gegensteckverbinder ist 61083-081402LF; Footprint-Maße siehe 2.4.

![RK3588-EVB1-Originalabbildung — 37](/docs/rockchip-rk3588-evb1/assets/en-p036-figure-01.png)

Abbildung 3-17. MIPI-DPHY-Videoeingang

Tabelle 3-2. Signaldefinitionen von MIPI DPHY_RX

| Pin | DPHY (einzeln) | DPHY (dual) | Pin |
| --- | --- | --- | --- |
| 1 | GND | GND | 2 |
| 3 | MIPI_CSI0_RX_D0N | MIPI_CSI1_RX_D0N | 4 |
| 5 | MIPI_CSI0_RX_D0P | MIPI_CSI1_RX_D0P | 6 |
| 7 | GND | GND | 8 |
| 9 | MIPI_CSI0_RX_D1N | MIPI_CSI1_RX_D1N | 10 |
| 11 | MIPI_CSI0_RX_D1P | MIPI_CSI1_RX_D1P | 12 |
| 13 | GND | GND | 14 |
| 15 | MIPI_CSI0_RX_CLK0N | MIPI_CSI1_RX_CLK0N | 16 |
| 17 | MIPI_CSI0_RX_CLK0P | MIPI_CSI1_RX_CLK0P | 18 |
| 19 | GND | GND | 20 |
| 21 | MIPI_CSI0_RX_D2N | MIPI_CSI1_RX_D2N | 22 |
| 23 | MIPI_CSI0_RX_D2P | MIPI_CSI1_RX_D2P | 24 |
| 25 | GND | GND | 26 |
| 27 | MIPI_CSI0_RX_D3N | MIPI_CSI1_RX_D3N | 28 |
| 29 | MIPI_CSI0_RX_D3P | MIPI_CSI1_RX_D3P | 30 |
| 31 | GND | GND | 32 |
| 33 | MIPI_CSI0_RX_CLK1N | MIPI_CSI1_RX_CLK1N | 34 |
| 35 | MIPI_CSI0_RX_CLK1P | MIPI_CSI1_RX_CLK1P | 36 |
| 37 | GND | GND | 38 |
| 39 | MIPI_CAM3_CLKOUT | MIPI_CAM4_CLKOUT | 40 |
| 41 | NC | NC | 42 |
| 43 | GND | GND | 44 |
| 45 | I2C3_SDA_M0_MIPI | I2C4_SDA_M3_MIPI | 46 |
| 47 | I2C3_SCL_M0_MIPI | I2C4_SCL_M3_MIPI | 48 |
| 49 | NC | NC | 50 |
| 51 | MIPI_CSI0_PDN0_H | MIPI_CSI1_PDN0_H | 52 |
| 53 | NC | NC | 54 |
| 55 | MIPI_CSI0_PDN1_H | MIPI_CSI1_PDN1_H | 56 |
| 57 | MIPI_DPHY_FSYNC | MIPI_DPHY_FSYNC | 58 |
| 59 | MIPI_DPHY_HSYNC | MIPI_DPHY_HSYNC | 60 |
| 61 | VCC_1V8_S3 | VCC_3V3_S3 | 62 |
| 63 | NC | NC | 64 |
| 65 | MIPICSI0_PWREN_H | MIPICSI1_PWREN_H | 66 |
| 67 | IRC_AIN | NC | 68 |
| 69 | IRC_BIN | NC | 70 |
| 71 | NC | NC | 72 |
| 73 | NC | NC | 74 |
| 75 | GND | GND | 76 |
| 77 | VCC5V0_SYS | GND | 78 |
| 79 | VCC5V0_SYS | VCC12V_DCIN | 80 |

### 3.15 TYPEC-Schnittstelle

Eine vollständige TYPEC-Schnittstelle unterstützt:

- Firmware-Download über TYPEC0_USB20_OTG.

- TYPEC-Funktionalität.

- DP1.4-Ausgabe.

![RK3588-EVB1-Originalabbildung — 38](/docs/rockchip-rk3588-evb1/assets/en-p038-figure-01.png)

Abbildung 3-18. TYPEC-Schnittstelle

### 3.16 USB3.0-Schnittstelle

Die Platine stellt einen USB3.0-OTG-Port als Standard-A-Anschluss für USB3.0-Sticks und andere USB3.0-Geräte bereit.

![RK3588-EVB1-Originalabbildung — 39](/docs/rockchip-rk3588-evb1/assets/en-p038-figure-02.png)

Abbildung 3-19. USB3.0-OTG-Schnittstelle

### 3.17 USB2.0-Host-Schnittstellen

Zwei USB2.0-Kanäle sind in einem gestapelten Doppelanschluss zusammengefasst. Unterstützt werden etwa Maus, USB-Stick, Bluetooth und weitere USB-Geräte.

![RK3588-EVB1-Originalabbildung — 40](/docs/rockchip-rk3588-evb1/assets/en-p039-figure-01.png)

Abbildung 3-20. USB2.0-Host-Schnittstellen

### 3.18 HDMI-Ausgänge

Zwei HDMI-Standard-A-Ausgänge unterstützen HDMI2.1 und Video bis 8K@60fps.

![RK3588-EVB1-Originalabbildung — 41](/docs/rockchip-rk3588-evb1/assets/en-p039-figure-02.png)

Abbildung 3-21. HDMI-TX-Schnittstellen

### 3.19 HDMI-Eingang

Ein HDMI-Eingang unterstützt HDMI2.0-Video.

![RK3588-EVB1-Originalabbildung — 42](/docs/rockchip-rk3588-evb1/assets/en-p040-figure-01.png)

Abbildung 3-22. HDMI-RX-Schnittstelle

### 3.20 Lüfteranschluss

Der Lüfteranschluss unterstützt 12V/5V-Lüfter mit Drehzahlregelung. Standardmäßig ist ein 12V-Lüfter vorgesehen. Die Signalreihenfolge von links nach rechts lautet GND, 12V, SENSOR, CONTROL.

![RK3588-EVB1-Originalabbildung — 43](/docs/rockchip-rk3588-evb1/assets/en-p040-figure-02.png)

Abbildung 3-23. Lüfter-Stromanschluss

### 3.21 Erweiterung des Sensormoduls

Die Platine besitzt ein IMX415-Modul; der Quelltext nennt bis zu „800W“ Pixel (Notation anhand der Moduldokumentation prüfen).

- Automatischer Weißabgleich, 3D-Rauschunterdrückung und HDR.

- RAW10/RAW12-Datenausgabe.

- Integrierte IRCUT-Umschaltung für Tag-/Nachtbetrieb des Sensors.

- Eine vorgesehene 24-polige MIPI-Schnittstelle ermöglicht bei Bedarf eine Erweiterung für Stereo-Vision.

![RK3588-EVB1-Originalabbildung — 44](/docs/rockchip-rk3588-evb1/assets/en-p041-figure-01.png)

Abbildung 3-24. IMX415-Modulplatine

Die folgende Tabelle zeigt die Signale des Erweiterungsanschlusses.

Tabelle 3-3. Erweiterungssignale des IMX415-Moduls

| Pin | DPHY |
| --- | --- |
| 1 | GND |
| 2 | GND |
| 3 | NC |
| 4 | MIPI_DCPHY1_RX_RST_L |
| 5 | I2C5_SDA_M0_MIPI |
| 6 | I2C5_SCL_M0_MIPI |
| 7 | GND |
| 8 | GND |
| 9 | MIPI_DPHY1_RX_D0N |
| 10 | MIPI_DPHY1_RX_D0P |
| 11 | MIPI_DPHY1_RX_D1N |
| 12 | MIPI_DPHY1_RX_D1P |
| 13 | MIPI_DPHY1_RX_D2N |
| 14 | MIPI_DPHY1_RX_D2P |
| 15 | MIPI_DPHY1_RX_D3N |
| 16 | MIPI_DPHY1_RX_D3P |
| 17 | GND |
| 18 | MIPI_DPHY1_RX_CLKN |
| 19 | MIPI_DPHY1_RX_CLKP |
| 20 | GND |
| 21 | MIPI_CAM2_CLKOUT |
| 22 | VCC_3V3_O |
| 23 | VCC_3V3_D |
| 24 | VCC_3V3_A |

### 3.22 Lautsprecheranschlüsse

Die Platine besitzt 2 Lautsprecheranschlüsse.

![RK3588-EVB1-Originalabbildung — 45](/docs/rockchip-rk3588-evb1/assets/en-p042-figure-01.png)

Abbildung 3-25. SPK-Anschluss

## 4 Vorsichtsmaßnahmen

Der RK3588 EVB1 ist für Labor- und Entwicklungsumgebungen vorgesehen. Vor dem Betrieb sind folgende Hinweise zu beachten:

- Displayanschluss und Erweiterungsplatine dürfen unter keinen Umständen im laufenden Betrieb ein- oder ausgesteckt werden.

- Vor dem Auspacken und Installieren geeignete ESD-Schutzmaßnahmen ergreifen, um Schäden durch elektrostatische Entladung zu verhindern.

- Die Platine an den Kanten halten und freiliegende Metallteile nicht berühren, damit Bauteile nicht durch statische Elektrizität beschädigt werden.

- Die Platine auf einer trockenen Oberfläche betreiben und von Wärmequellen, elektromagnetischen Stör- und Strahlungsquellen sowie strahlungsempfindlichen Geräten, etwa medizinischen Geräten, fernhalten.

## Quellenunterschiede und offene Prüfpunkte

Beide Fassungen tragen V1.2: Chinesisch 45 Seiten, Englisch 43. Chinesisch nutzt chinesische Originalabbildungen; Englisch, Russisch und Deutsch verwenden die Abbildungen des englischen PDFs. Einige Screenshots enthalten weiterhin chinesische Bedienoberflächen. Die PDFs bleiben unverändert. Tabellen sind editierbar; sämtliche Signalzellen der beiden 80-Pin-Tabellen und der 24-Pin-Tabelle stimmen überein.

- Chinesisch nennt in 1.3.1 zwei RK806-2, Englisch zusätzlich einen einzelnen RK806-1 als Option. Chinesisch führt ausdrücklich 2xHDMI TX, 1xHDMI RX, MIPI TX, VGA, SATA, PCIe30x4, TYPEC und 2xRJ45 auf. Daraus folgt keine beliebige Austauschbarkeit der Versorgungstopologien auf realen EVB1-Platinen.
- Chinesisch ergänzt in 1.3.2 Foto-/Videoaufnahme über die mitgelieferte monokulare IMX415-Tochterplatine. DPHY: zwei 4lane- oder vier 2lane-Eingänge. Die englische Übersicht nennt zwei 2lane, während beide Abschnitte 3.14 vier 2Lane nennen. CPHY heißt chinesisch 3lane/3Lane, englisch 3trio; beide Fassungen nennen in 3.13 5.7Gbps/Trio. Diese Unterschiede werden nicht stillschweigend vereinheitlicht.
- Das Hochformatdisplay wird chinesisch mit 1920*1080 und englisch mit 1080*1920 angegeben. Beide Lieferlisten nennen eine Antenne; am Ende von 3.10 steht chinesisch eine, englisch zwei, bei jeweils zwei SMA-Anschlüssen. Maßgeblich sind tatsächliche Stückliste und Lieferumfang.
- Chinesisch verweist 2.5 auf `RK_EVB1_RK3588_LP4XD200P232SD10H1_V10_20210818RZF.DSN` und `RK_EVB1_RK3588_LP4XD200P232SD10H1_V10_20210817_final_lint.brd`; Englisch auf `RK_EVB1_RK3588_LP4XD200P232SD10H1_V11_20211213RZF.DSN` und `RK_EVB1_RK3588_LP4XD200P232SD10H1_V11_20211213_final_lint.brd`. Im Vorwort steht weiterhin V10. Unterschiedliche Platinenrevisionen werden nicht unbemerkt vermischt.
- Nur chinesisch in 3.8: J8302 bleibt standardmäßig unbestückt; zur Nutzung C8310-C8313 bestücken und C1820/C1821/C6800/C6801 offen/unbestückt lassen. Das gilt ausschließlich für die passende EVB1-Schaltung/Stückliste, nicht als ungeprüfte Umbauanweisung für ArmSoM. Die englische Abbildung 3-10 heißt fälschlich UART Debug Interface; chinesisch steht SATA.
- I2C-Adressen 0xA3 und 0xD6 bleiben erhalten. Die Quelle nennt keine 7-/8-Bit-Codierung; vor Treiberverwendung prüfen. TBD-Adressen werden nicht erfunden. Die doppelte PMIC-Zeile bleibt erhalten. TPYEC und VAG in der Quelle bezeichnen keine nachgewiesenen anderen Schnittstellen.
- Beide Quellen schreiben in 3.21 „800W“ Pixel. Diese Quellnotation bleibt erhalten und wird nicht durch eine vermeintlich hardwareverifizierte Pixelzahl ersetzt. Die konkrete IMX415-Moduldokumentation prüfen. Funktionsangaben stammen vom Hersteller und sind keine hier durchgeführten Tests.


Offizielle Referenzen: [Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/).

{% endraw %}
