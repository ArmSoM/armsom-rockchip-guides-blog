---
title: "Rockchip USB SQ Tool: USB2.0-/USB3.1-PHY-Abstimmung und Codeintegration"
description: "Rockchip USB SQ Tool: USB2.0-/USB3.1-PHY-Abstimmung und Codeintegration — V1.8.0"
excerpt: "Rockchip USB SQ Tool: USB2.0-/USB3.1-PHY-Abstimmung und Codeintegration"
translation_key: "165-rockchip-usb-sq-tool"
slug: "165-rockchip-usb-sq-tool"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, PHY, Linux, Signal]
---

{% raw %}

# Rockchip USB SQ Tool: USB2.0-/USB3.1-PHY-Abstimmung und Codeintegration

ArmSoM-Plattformreferenz nach dem chinesischen RK-SM-YF-195 V1.8.0. Genannt werden Linux 4.4/4.19/5.10/6.1 und RT-Thread; Chip-/Portunterstützung siehe unten. Konkrete ArmSoM-Platine, BSP und PHY-Treiber prüfen; keine allgemeine Unterstützung aller Platinen. Kein englisches PDF vorhanden; vollständige EN/RU/DE-Übersetzungen verwenden alle 13 chinesischen Quellabbildungen. Laut Quelle sind PHY-Handbücher nicht öffentlich und TRMs enthalten keine detaillierten PHY-Register. Das Werkzeug vereinfacht die Fehlersuche mit Konformitätstest-/Tuningbefehlen und erzeugtem PHY-Treiber-Referenzcode. Keine Abstimmung oder Hardwaretests ausgeführt.

Quellenhinweise: §3.13 RK3562 endet mit `]` statt `}`; im Original bestätigt, unverändert erhalten, nicht direkt kompilierbar. Auslassungsbeispiele in §3.25/3.26 sind keine vollständigen Patches. Die USB3.1-Liste in §2.1 lässt RK3588S aus, Tabelle 2 nennt es; beides bleibt erhalten, Unterstützung prüfen. TXPREEMPPLUSE bleibt wie in der Quelle. Chinesischer Bildtext wurde nicht neu gezeichnet. Größere Werte sind nicht automatisch besser.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip USB SQ Tool](https://redmine.rock-chips.com/documents/113)

## 1. Rockchip-USB-PHY-Signalabstimmung

USB-Signalprobleme lassen sich durch bessere Hardware oder softwareseitiges Abstimmen der PHY-Register behandeln. In beiden Fällen zuerst das Augendiagramm messen und den Bericht zur Analyse verwenden. Rockchip USB SQ Tool unterstützt bei fehlgeschlagenen Augentests, Enumerationsfehlern durch Signalqualität oder PHY-Versorgungsdifferenzen, unerwarteten Trennungen und nicht erkanntem Abziehen. Die Probleme hängen stark von Hardware ab: schlechte/lange Kabel und hohe Leiterbahn-/Kabelimpedanz. Zuerst Hardware verbessern; Softwaretuning erst erwägen, wenn dies nicht möglich ist.

## 2. Oberfläche von Rockchip USB SQ Tool

### 2.1 Hauptfenster

USB-2.0-Tuning unterstützt RK1808, RK1820, RK2116, RK2118, RK3036, RK312X, RK3228, RK3288, RK3308, RK3308B-S, RK3326, RK3326S, RK3328, RK3399, RK3506, RK3528, RK3562, RK3566, RK3568, RK3576, RK3588, RK3588S, RV1103, RV1103B, RV1106, RV1109, RV1126, RV1126B, RV1126B-P, PX30 und PX30S. RK3328 unterstützt derzeit nur USB2.0 OTG/HOST, nicht die USB3.0-U2PHY. USB-3.1-Tuning unterstützt RK1808, RK1820, RK3399, RK3528, RK3562, RK3566, RK3568, RK3576, RK3588 und RV1126B; weitere Plattformen sollen nach Entwicklung/Validierung folgen. Nur Windows wird unterstützt. Quellendownload: https://redmine.rock-chips.com/documents/113 . Rockchip USB SQ Tool.exe öffnen; die Plattformauswahl (Abbildung 1) erscheint. Eine Plattformschaltfläche öffnet deren Tuningfenster.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p006-figure-01.png)

Abbildung 1. Hauptfenster. Einige Plattformen verwenden dieselbe PHY-Oberfläche; daher steht ein Beispiel für die Gruppe. Tabellen 1 und 2 ordnen USB2.0-/USB3.1-Plattformen den Beispielen zu.

Tabelle 1. USB2.0-PHY-Oberflächenbeispiele.

| Plattform | PHY-Tuning-Beispieloberfläche |
| --- | --- |
| RK1808 | RK1808 USB2.0 Tuning Oberfläche |
| RK3036、RK312X、RK3228、RK3308、RK3326、RK3328 、RK3399、PX30 | RK3399 USB2.0 Tuning Oberfläche |
| RK1820、RK3308B-S、RK3326S、RK3506、RK3528、RK3562、RK3566、 RK3568、RV1126B、RV1126B-P、PX30S | RK3568 USB2.0 Tuning Oberfläche |
| RK3576、RK3588、RK3588S | RK3588 USB2.0 Tuning Oberfläche |
| RK2116、RK2118、RV1103、RV1103B、RV1106 | RV1106 USB2.0 Tuning Oberfläche |
| RV1109、RV1126 | RV1109 USB2.0 Tuning Oberfläche |

Tabelle 2. USB3.1-PHY-Oberflächenbeispiele.

| Plattform | PHY-Tuning-Beispieloberfläche |
| --- | --- |
| RK1808 | RK1808 USB3.1 Tuning Oberfläche |
| RK1820 | RK1820 USB3.1 Tuning Oberfläche |
| RK3399 | RK3399 USB3.1 Tuning Oberfläche |
| RK3528、RK3562、RK3566、RK3568、RV1126B | RK3528 USB3.1 Tuning Oberfläche |
| RK3576、RK3588、RK3588S | RK3588 USB3.1 Tuning Oberfläche |

Die Reihenfolge im Werkzeug einhalten. Erst zum nächsten Schritt wechseln, wenn vorherige Schritte nicht helfen oder die Anforderungen nicht erfüllen; Schritte mit geringer Wirkung können entfallen. Signalabstimmung ist riskant: nicht blind ändern. Möglichst das Augendiagramm beobachten und moderat abstimmen; bei erfüllten Anforderungen aufhören. Größere Werte sind nicht automatisch besser. Das Risiko ist selbst zu beurteilen.

### 2.2 RK1808 USB2.0 Tuning Oberfläche

RK1808-USB2.0 verwendet dieselben Parameter wie RK3568. Seine PHY-Register besitzen jedoch write_enable-Bits in den oberen 16 Bits; Anfangswerte müssen daher nicht gelesen werden. Parameterbeschreibungen stehen im RK3568-USB2.0-Abschnitt.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p008-figure-01.png)

Abbildung 2.  RK1808 USB2.0 PHY Tuning-Oberfläche

### 2.3 RK3399 USB2.0 Tuning Oberfläche

RK3399 USB2.0 unterstützt TYPE-C0, TYPE-C1, HOST0 und HOST1. Vorgehen:

1. Testschnittstelle links in Feld 1 wählen; rechts wird automatisch der SQ-Testbefehl erzeugt.

2. Parameter in rotem Feld 2 wählen. Pre-emphasize wird per Kontrollkästchen gewählt, andere Parameter über Bedienelemente wie Feld 4: Eingabe oder Auf-/Ab-Tasten. Bereich und Beschreibung stehen bei jedem Parameter.

3. Parameter wählen und Bestätigen in Feld 3 drücken. Daneben entstehen io-Befehle; Code Output in Feld 5 erzeugt Referenzcode.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p009-figure-01.png)

Abbildung 3.  RK3399 USB2.0 PHY Tuning-OberflächeRK3399 USB2.0 Signalparameter. 

Tabelle 3.  RK3399 USB2.0 Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| Pre-emphasize | HS-Tx-Pre-emphasis einstellen |
| Slew Rate | Slew Rate des HS-Tx-Auges einstellen |
| Compensation Voltage | HS-Tx-Spannungskalibrierung; Erhöhung vergrößert die Augenhöhe |
| Compensation Current | HS-Tx-Stromkalibrierung; Erhöhung vergrößert die Augenhöhe |
| Pre-emphasize Strength | HS-Tx-Pre-emphasis-Stärke einstellen |
| Bypass ODT &amp; Driver Strength | Automatische Widerstandseinstellung im Kompensationskreis umgehen, um die Augenhöhe zu ändern |
| Squelch | HS-Rx-Rauschschwelle einstellen |
| HOST Disconnect Detection | HS-Trennschwelle einstellen; nur HOST |

### 2.4 RK3568 USB2.0 Tuning Oberfläche

RK3568 USB2.0 unterstützt OTG, HOST1, HOST2 und HOST3. Vorgehen:

1. Testschnittstelle links in Feld 1 wählen; rechts wird automatisch der SQ-Testbefehl erzeugt.

2. RK3568-USB2.0-PHY-Register besitzen keine write_enable-Bits in den oberen 16 Bits. Zum Schutz anderer Bits den Anfangswert mit Feld 2 lesen und rechts in das Anfangswertfeld eintragen.

3. Parameter in Feld 3 wählen. Pre-emphasize per Kontrollkästchen, andere Werte über Elemente wie Feld 5 mit Eingabe oder Auf-/Ab-Tasten einstellen. Bereich und Beschreibung werden angezeigt.

4. Bestätigen in Feld 4 anklicken. Daneben entstehen io-Befehle, in Code Output (Feld 6) Referenzcode. Wichtig: Das Anfangswertfeld enthält Vorgaben. Ohne manuelle Ersetzung beeinflussen diese eventuell das Ergebnis. Vor dem Test immer den aktuellen Registerwert lesen und eintragen.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p011-figure-01.png)

Abbildung 4. RK3568-USB2.0-PHY-Oberfläche. Vier Kategorien: SQ, Rauschschwelle, Trennschwelle und B_Sessionvalid. SQ verändert Pre-emphasis, Augenhöhe, Slew Rate und Treiberstärke. Tabelle 4 zeigt die Parameter.

| Parameter | Beschreibung |
| --- | --- |
| Pre-emphasize | HS-Tx-Pre-emphasis einstellen |
| HS Eye Height | HS-Tx-Augenhöhe einstellen |
| HS ODT Value | 45Ω-ODT-Widerstand einstellen. Höherer Eingabewert senkt den Widerstand, erhöht die Augenhöhe und beschleunigt FS/LS-Slew-Rate |
| Slew Rate | HS-Augen-Slew-Rate einstellen; geringe Wirkung |
| Squelch | HS-Rx-Rauschschwelle einstellen |
| HOST Disconnect Detection | Trennschwelle einstellen; nur HOST |
| B_Session Valid | VBUS-DET-Schwelle einstellen; nur Device |

RK3568-USB2.0-Rauschschwelle: Lange, schlechte oder hochohmige Kabel können die High-Speed-Enumeration verhindern. Die PHY-Schwelle beträgt meist 150mV. Dämpfung kann gültige Signale darunter senken, sodass sie als Rauschen gelten. Mit Squelch die Schwelle moderat reduzieren, typischerweise auf 125mV oder 112.5mV.

RK3568-Trennschwelle: Host Disconnect Detection verwenden. Typische Rockchip-Host-Anschlusslogs:

```text
[ 1204.092638] usb 1-1: new high-speed USB device number 3 using ehci-platform
[ 1204.280373] usb 1-1: New USB device found, idVendor=058f, idProduct=6387, bcdDevice= 1.04
[ 1204.280449] usb 1-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[ 1204.280476] usb 1-1: Product: Mass Storage
[ 1204.280498] usb 1-1: SerialNumber: FA45A19C
```

Typisches Rockchip-Host-Trennungslog:

```text
[ 985.341233] usb 1-1: USB disconnect, device number 2
```

1) Abziehen eines USB2.0-Geräts wird nicht erkannt. Erscheint kein Trennungslog, folgende Schritte versuchen:

1. EOP-Pre-emphasis aktivieren; im SDK standardmäßig aus, siehe Abbildung 5.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p013-figure-01.png)

Abbildung 5. EOP-Pre-emphasis aktivieren.

2. Host-Trennschwelle reduzieren. Manche Chips bieten kein EOP-Tuning: Schritt 1 gemäß Oberfläche überspringen. Sonst Schritt 2 zusätzlich erst ausführen, wenn Schritt 1 nicht deutlich hilft. Zu starke Absenkung kann unbeabsichtigte Trennungen im Normalbetrieb verursachen; Risiko beachten.

2) Unerwartete USB2.0-Trennung im Betrieb: Host-Trennschwelle erhöhen versuchen. Nicht jede Trennung liegt daran; häufig sind Gerät oder Hardwareumgebung verantwortlich. Nicht blind abstimmen. EOP ist im SDK bereits aus; kein zusätzlicher Schreibzugriff nötig. Zu hohe Schwellen verhindern die Abzieherkennung.

RK356X-B_Sessionvalid betrifft PCs, die ein USB Device (ADB/MTP) nicht erkennen oder anschließend verlieren. Spannungsschwelle senken versuchen: Standard 3'b000; Quellenempfehlung 3'b111 (7) oder 3'b101 (5).

Drei wesentliche Hardwareursachen: zu niedrige VBUS-Spannung (unter 4.7V oft problematisch); hohe USB_AVDD1V0-Welligkeit oder Erhöhung auf 1.2V, wodurch Bvalid nicht erkannt wird; hohe Logic-Spannungswelligkeit mit Controllerstörung.

### 2.5 RK3588 USB2.0 Tuning Oberfläche

RK3588 USB2.0 unterstützt TYPE-C0, TYPE-C1, USB2.0 HOST0 und USB2.0 HOST1. Schritte:

1. Testschnittstelle links in Feld 1 wählen; rechts wird automatisch der SQ-Testbefehl erzeugt.

2. Parameter in Feld 2 eingeben oder mit Auf-/Ab-Tasten wählen. Bereich und Beschreibung sind angegeben.

3. Parameter wählen und Bestätigen in Feld 2 drücken. Daneben entstehen io-Befehle; Code Output in Feld 3 erzeugt Referenzcode.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p014-figure-01.png)

Abbildung 6.  RK3588 USB2.0 PHY Tuning-OberflächeRK3588 USB2.0  Signalparameter. 

Tabelle 5.  RK3588 USB2.0  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| TXRISE | HS-Tx-Slew-Rate für Anstiegs-/Abfallzeit einstellen |
| TXPREEMPAMP | HS-Tx-Pre-emphasis-Strom einstellen |
| TXPREEMPPLUSE | Tastverhältnis des Pre-emphasis-Stroms; nur bei aktivem TXPREEMPAMP TUNE wirksam |
| TXHSXV | HS-Tx-DP/DM-Kreuzungsspannung; keine deutliche Änderung |
| TXVREF | HS-Tx-Gleichspannung; deutliche Änderung der Augenamplitude |
| TXRES | HS-Tx-Impedanz; verändert Amplitude und Anstiegs-/Abfallzeit |
| TXFSLS | FS/LS-Tx-Impedanz; verändert Amplitude, Anstiegs-/Abfallzeit, Kreuzungsspannung und Tastverhältnis |
| HOST DISCONNECT DETECTION | Trennschwelle einstellen; nur HOST |

### 2.6 RV1106 USB2.0 Tuning Oberfläche

RV1106 USB2.0 unterstützt Pre-emphasis samt Stärke, ODT, Augenhöhe, Rausch-, Bvalid- und Trennschwellen. RV1103/RV1103B besitzen keinen VBUS-DET-Gehäusepin und daher kein Bvalid-Tuning; andere Optionen entsprechen RV1106.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p016-figure-01.png)

Abbildung 7.  RV1106 USB2.0 PHY Tuning-Oberfläche

Tabelle 6.  RV1106 USB2.0  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| Pre-emphasize | HS-Tx-Pre-emphasis; standardmäßig aktiv |
| Pre-emphasize Strength | HS-Tx-Pre-emphasis-Stärke; Register nur bei aktivem Pre-emphasis wirksam |
| HS ODT Value | 45Ω-ODT-Widerstand: Höherer Wert senkt Widerstand und erhöht Augenhöhe ohne Einfluss auf FS/LS-Slew-Rate |
| Eye Height | HS-Tx-Augenhöhe. Stufe 4:470mV erfordert zugleich Logic-Spannung &gt; 850mV |
| Squelch | HS-Rx-Rauschschwelle einstellen |
| BValid | VBUS-DET-Schwelle einstellen; nur Device |
| HOST Disconnect Detection | Trennschwelle einstellen; nur HOST |

### 2.7 RV1109 USB2.0 Tuning Oberfläche

RV1109 USB2.0 bietet Slew Rate, Augenhöhe, Rausch- und Trennschwelle. RV1126 verwendet dieselben Optionen.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p017-figure-01.png)

Abbildung 8.  RV1109 USB2.0 PHY Tuning-Oberfläche



Tabelle 7.  RV1109 USB2.0  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| Slew Rate | Slew Rate des HS-Tx-Auges einstellen |
| Eye Height | HS-Tx-Augenhöhe einstellen |
| Squelch | HS-Rx-Rauschschwelle einstellen |
| HOST Disconnect Detection | Trennschwelle einstellen; nur HOST |

### 2.8 RK1808 USB3.1 Tuning Oberfläche

RK1808 USB3.1 unterstützt Tx-Treiberspannung, Tx-Hub und Tx-Pre-emphasis-Stärke.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p018-figure-01.png)

Abbildung 9.  RK1808 USB3.1 PHY Tuning-Oberfläche

Tabelle 8.  RK1808 USB3.1  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| TX driver voltage | Tx-Ausgangsgleichtaktspannung der TXP/TXN-Differenzsignale einstellen |
| TX driver swing | Tx-Treiberhub einstellen |
| TX driver pre-emphasis strength | Tx-Treiber-Pre-emphasis-Stärke einstellen |

### 2.9 RK1820 USB3.1 Tuning Oberfläche

RK1820 USB3.1 bietet Full Txswing and Txmargin, Low Swing and Txmargin, Tx De-emphasis und Boost Level. Schritte:

1. RK1820 USB3.1 unterstützt PHY-ID-Konfiguration. Register mit dem Befehl in Feld 1 lesen und Wert eingeben; andernfalls erscheint ein Fehler.

2. start in Feld 2 drücken; dadurch werden die Bestätigen-Schaltflächen aktiv.

3. Parameter wählen und Bestätigen in Feld 3 drücken. Daneben entstehen io-Befehle; Code Output in Feld Code Output erzeugt Referenzcode.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p019-figure-01.png)

### 2.10 RK3399 USB3.1 Tuning Oberfläche

RK3399 USB3.1 unterstützt OTG0 und OTG1. Schritte:

1. Testschnittstelle links in Feld 1 wählen; rechts wird automatisch der SQ-Testbefehl erzeugt.

2. RK3399 USB3.1 erkennt beide Type-C-Ausrichtungen. Bei korrekt angeschlossenem Kabel das Orientierungsregister mit Feld 2 lesen und eintragen; andernfalls erscheint ein Fehler.

3. start in Feld 3 drücken. Die Schnittstellenwahl in Feld 1 wird gesperrt, Bestätigen in Feld 5 aktiviert.

4. RK3399-USB3.1-PHY-Register besitzen keine write_enable-Bits in den oberen 16 Bits. Zum Schutz anderer Bits den Anfangswert mit Feld 4 lesen und rechts in das Anfangswertfeld eintragen.

5. Parameter wählen und Bestätigen in Feld 5 drücken. Daneben entstehen io-Befehle; Code Output in Feld 6 erzeugt Referenzcode.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p020-figure-01.png)

Abbildung 10.  RK3399 USB3.1 PHY Tuning-OberflächeRK3399 USB3.1  Signalparameter. 

Tabelle 9.  RK3399 USB3.1  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| BOOST LEVEL | Tx-Boost-Pegel einstellen |

### 2.11 RK3528 USB3.1 Tuning Oberfläche

RK3528 USB3.1 bietet Full Txswing and Txmargin, Low Swing and Txmargin, Tx De-emphasis und Boost Level. RK3562 und RK3568 verwenden dieselben Optionen.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p021-figure-01.png)

Abbildung 11.  RK3528 USB3.1 PHY Tuning-Oberfläche

Tabelle 10.  RK3528 USB3.1  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| Full Txswing and TXmargin | Full-Swing/Txmargin: TX_SWING und TX_MARGIN[2:0] steuern gemeinsam die Tx-Ausgangsamplitude |
| Low swing and Txmargin | Low-Swing/Txmargin: gleiche Funktion wie Full Tx swing, andere Stufen |
| TX De-emphasis | De-emphasis-Pegel des Senders konfigurieren |
| Boost Level | Tx-Boost-Pegel einstellen |

### 2.12 RK3588 USB3.1 Tuning Oberfläche

RK3588 USB3.1 umfasst USB3-OTG0 (USB3&amp;Dp CombPhy0), USB3-OTG1 (USB3&amp;Dp CombPhy1) und USB3-HOST2 (USB3&amp;PCIE&amp;SATA CombPhy). Schritte:

1. Testschnittstelle links in Feld 1 wählen; rechts wird automatisch der SQ-Testbefehl erzeugt.

2. Bei USB3-OTG0/1 das CombPhy0/1-Orientierungsregister über Feld 2 lesen und eintragen. Der Wert muss 0xCx oder 0x3x entsprechen. Schlägt das Lesen fehl (meist Type-C), Kabel am Testport anschließen, um CombPhy0/1 zu aktivieren, dann erneut lesen.

3. Bei USB3-HOST2 Feld 2 überspringen und START in Feld 3 drücken.

4. Nach START werden bei USB3-OTG0/1 die linken Bestätigen-Tasten in Feld 5 aktiv und die rechten HOST2-Tasten in Feld 6 inaktiv; bei HOST2 umgekehrt.

5. RK3588-USB3.1-PHY-Register besitzen keine write_enable-Bits in den oberen 16 Bits. Zum Schutz anderer Bits den Anfangswert mit Feld 4 lesen und rechts in das Anfangswertfeld eintragen.

6. Parameter wählen und Bestätigen in Feld 5 drücken. Daneben entstehen io-Befehle; Code Output in Feld 7 erzeugt Referenzcode.

![Oberfläche aus chinesischer Quelle](/docs/rockchip-usb-sq-tool/assets/cn-p023-figure-01.png)

Abbildung 12.  RK3588 USB3.0 PHY Tuning-OberflächeRK3588 USB3.1 Signalparameter. 

Tabelle 11.  RK3588 USB3.1  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| TX Driver main-tap level(USB3-OTG) | SS-Tx-Spannung einstellen |
| TX Pmos current control(USB3-OTG) | SS-Tx-Strom; erst verwenden, wenn Spannungsabstimmung nicht genügt |
| TX De-emphasis(USB3-OTG) | SS-Tx-De-emphasis einstellen |
| TX Slew Rate(USB3-OTG) | SS-Tx-Slew-Rate einstellen |
| Full Txswing and TXmargin(USB3-HOST) | Full-Swing/Txmargin: TX_SWING und TX_MARGIN[2:0] steuern gemeinsam die Tx-Ausgangsamplitude |
| Low swing and Txmargin(USB3-HOST) | Low-Swing/Txmargin: gleiche Funktion wie Full Tx swing, andere Stufen |
| TX De-emphasis(USB3- HOST) | De-emphasis-Pegel des Senders konfigurieren |

## 3. Generierter USB-PHY-Tuningcode

### 3.1 RK1808 USB2.0 PHY

RK1808 USB2.0-Tuningcode in `rk1808_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk1808_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 3.2 RK1820 USB2.0 PHY

RK1820 USB2.0-Tuningcode in `HAL_USB_HsPhyInit()` in `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c` einfügen.

```text
HAL_Status HAL_USB_HsPhyInit(uint8_t id)
{
    ...
#elif defined(SOC_RK1820)
    /* OTG/Host PHY Tuning Code */
#elif defined(XXXX)
    ...
}
```

### 3.3 RK2116 USB2.0 PHY

RK2116 USB2.0-Tuningcode in `HAL_USB_HsPhyInit()` in `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c` einfügen.

```text
HAL_Status HAL_USB_HsPhyInit(uint8_t id)
{
    ...
#elif defined(RKMCU_RK2116)
    /* OTG PHY Tuning Code */
#elif defined(XXXX)
    ...
}
```

### 3.4 RK2118 USB2.0 PHY

RK2118 USB2.0-Tuningcode in `HAL_USB_HsPhyInit()` in `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c` einfügen.

```text
HAL_Status HAL_USB_HsPhyInit(uint8_t id)
{
    ...
#elif defined(RKMCU_RK2118)
    /* OTG PHY Tuning Code */
#elif defined(XXXX)
    ...
}
```

### 3.5 RK3036/RK312X USB2.0 PHY

RK3036 unterstützt derzeit nur Kernel 3.10. Code in `usb20otg_hw_init()` in `kernel/drivers/usb/dwc_otg_310/usbdev_rk3036.c` einfügen.

```text
static void usb20otg_hw_init(void) {
    .../* OTG/Host PHY Tuning Code */
}
```

RK312X-Tuningcode in `rk312x_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk312x_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 3.6 RK3228 USB2.0 PHY

RK3228-Tuningcode in `rk3228_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk3228_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 3.7 RK3288 USB2.0 PHY

RK3288 besitzt zwei PHY-Treiberversionen. Kernel Version 4.4 für Kernel bis 4.4 wählen, 4.19 für 4.19 und neuer. Nur das Codeformat ändert sich, nicht die io-Befehle. Bei 4.19 am Ende von `rk3288_usb_phy_probe_init()` in `kernel/drivers/phy/rockchip/phy-rockchip-usb.c` einfügen. Für die drei Ports vor jedem Codefragment den Registeroffset prüfen. OTG-Code:

```text
if (rk_phy->reg_offset == 0x320) {
    ... /* OTG PHY Tuning Code */
}
```

HOST1-Code:

```text
if (rk_phy->reg_offset == 0x334) {
    ... /* HOST1 PHY Tuning Code */
}
```

HOST2-Code:

```text
if (rk_phy->reg_offset == 0x348) {
    ... /* HOST2 PHY Tuning Code */
}
```

RK3288-Kernel-4.4-Treiber: `kernel/drivers/usb/dwc_otg_310/usbdev_rk32.c`. OTG am Ende von `usb20otg_hw_init()`, HOST1 von `rk_ehci_hw_init()`, HOST2 von `usb20host_hw_init()` einfügen.

### 3.8 RK3308B_S/RK3308 USB2.0 PHY

Für RK3308B_S am Ende des `soc_is_rk3308bs()`-Zweigs von `rk3308_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
if (soc_is_rk3308bs()) {
    ... /* OTG/HOST PHY Tuning Code */
}
```

Für RK3308 am Ende des else-Zweigs von `rk3308_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
if (soc_is_rk3308bs()) {
    ...
} else {
    .../* OTG/HOST PHY Tuning Code */
}
```

### 3.9 RK3326S/PX30S/RK3326/PX30/RK3328 USB2.0 PHY

Für RK3326S/PX30S am Ende des `soc_is_px30s()`-Zweigs von `rk3328_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
if (soc_is_px30s()) {
    .../* OTG/HOST PHY Tuning Code */
}
```

Für RK3326/PX30/RK3328 am Ende des else-Zweigs von `rk3328_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
if (soc_is_px30s()) {
    ...
} else {
    .../* OTG/HOST PHY Tuning Code */
}
```

### 3.10 RK3399 USB2.0 PHY

RK3399-USB2.0-Tuning vor `if (!of_property_read_bool(node, "rockchip,u2phy-tuning"))` in `rk3399_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen. TYPE-C0/HOST0 teilen PHY 0xe450, TYPE-C1/HOST1 PHY 0xe460. Vor dem Code die Registeradresse prüfen, um die vier Ports zu unterscheiden.

```text
if (rphy->phy_cfg->reg == 0xe450) {
    .../* TYPE-C0/HOST0 PHY Tuning Code */
} else {
    ... /* TYPE-C1/HOST1 PHY Tuning Code */
}
if (!of_property_read_bool(node, "rockchip,u2phy-tuning"))
    return ret;
```

### 3.11 RK3506 USB2.0 PHY

RK3506 USB2.0-Tuningcode in `rk3506_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk3506_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
}
```

### 3.12 RK3528 USB2.0 PHY

RK3528 USB2.0-Tuningcode in `rk3528_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk3528_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
}
```

### 3.13 RK3562 USB2.0 PHY

RK3562 USB2.0-Tuningcode in `rk3562_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk3562_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
]
```

### 3.14 RK3568/RK3566 USB2.0 PHY

RK3568/RK3566 teilen Code am Ende von `rk3568_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. RK3568-OTG/HOST1 teilen Basis 0xfe8a0000, HOST2/HOST3 0xfe8b0000. Basisadresse vor dem Code prüfen. OTG/HOST1:

```text
if (rphy->phy_cfg->reg == 0xfe8a0000) {
    ... /* OTG/Host1 PHY Tuning Code */
}
```

HOST2/HOST3-Code:

```text
if (rphy->phy_cfg->reg == 0xfe8b0000) {
    ... /* Host2/Host3 PHY Tuning Code */
}
```

### 3.15 RK3576 USB2.0 PHY

RK3576-USB2.0-Tuning in `rk3576_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen. OTG0/OTG1 werden über `rphy->phy_cfg->reg` unterschieden:

```text
static int rk3576_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
        unsigned int reg;
        int ret = 0;

        if (rphy->phy_cfg->reg == 0x0) {
            .../* OTG0 PHY Tuning Code */
        } else if (rphy->phy_cfg->reg == 0x2000) {
            .../* OTG1 PHY Tuning Code */
        }
        return ret;
}
```

### 3.16 RK3588 USB2.0 PHY

RK3588-USB2.0-Tuning in `rk3588_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen. TYPE-C0, TYPE-C1, HOST0 und HOST1 anhand `rphy->phy_cfg->reg` unterscheiden:

```text
if (rphy->phy_cfg->reg == 0x0000) {
    .../* TYPE-C0 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0x4000) {
    .../* TYPE-C1 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0x8000) {
    .../* HOST0 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0xc000) {
    .../* HOST1 PHY Tuning Code */
}
```

### 3.17 RV1103/RV1106 USB2.0 PHY

RV1103/RV1106-Tuningcode in `rv1106_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rv1106_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG PHY Tuning Code */
}
```

### 3.18 RV1103B USB2.0 PHY

RV1103B-Tuningcode in `rv1103b_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rv1103b_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG PHY Tuning Code */
}
```

### 3.19 RV1109/RV1126 USB2.0 PHY

RV1109/RV1126-Tuningcode in `rv1126_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-usb2.c` einfügen.

```text
static int rv1126_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    if (rphy->phy_cfg->reg == 0xff4c0000) {
        .../* OTG PHY Tuning Code */
    }
    if (rphy->phy_cfg->reg == 0xff4c8000) {
        .../* HOST PHY Tuning Code */
    }
}
```

### 3.20 RV1126B/RV1126B-P USB2.0 PHY

RV1126B/RV1126B-P-Tuningcode in `rv1126b_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rv1126b_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/HOST PHY Tuning Code */
}
```

### 3.21 RK1808 USB3.1 PHY

RK1808 USB3.1-Tuningcode in `rk1808_combphy_cfg` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-combphy.c` einfügen.

```text
static int rk1808_combphy_cfg(struct rockchip_combphy_priv *priv)
{
    ...
    if (priv->phy_type == PHY_TYPE_PCIE) {
        ...
    } else if (priv->phy_type == PHY_TYPE_USB3) {
        ...
        /*
         * Tuning Tx:
         * offset 0x21b8 bit[7:4]: lane 0 TX driver swing
         * tuning bits with weight, "1111" represents the
         * largest swing and "0000" the smallest.
         */
        reg = readl(priv->mmio + 0x21b8);
        reg = (reg & ~0xf0) | 0xe0;
        writel(reg, priv->mmio + 0x21b8);

        .../* USB3.1 PHY Tuning Code */

        ...
    } else {
        dev_err(priv->dev, "failed to cfg incompatible PHY type\n");
        return -EINVAL;
    }
    return 0;
}
```

### 3.22 RK1820 USB3.1 PHY

RK1820 USB3.1-Tuningcode in `HAL_USB_SsPhyInit()` in `bsp/rockchip/common/hal/lib/hal/src/hal_usb_phy.c` einfügen.

```text
HAL_Status HAL_USB_SsPhyInit(uint8_t id)
{
    ...
    switch (id) {
    case 0:
#ifdef COMB_PIPE_PHY0_BASE
    /* OTG PHY Tuning Code */
#endif
        break;
    case 1:
#ifdef COMB_PIPE_PHY1_BASE
    /* OTG PHY Tuning Code */
#endif
        break;
    default:
        break;
    }
    ...
}
```

### 3.23 RK3399 USB3.1 PHY

RK3399 USB3.1-Tuningcode in `tcphy_tx_usb3_cfg_lane()` in `kernel/drivers/phy/phy-rockchip-typec.c` einfügen.

```text
static void tcphy_tx_usb3_cfg_lane(struct rockchip_typec_phy *tcphy, u32 lane)
{
    .../* OTG0/OTG1 PHY Tuning Code */
}
```

### 3.24 RK3528/RK3562/RK3566/RK3568 USB3.1 PHY

RK3528-, RK3562- und RK3568-USB3.1-Code gehört in die jeweilige combphy_cfg-Funktion in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`. RK3528-Einfügepunkt in `rk3528_combphy_cfg`:

```text
case PHY_TYPE_USB3:
    ...
    /* Enable adaptive CTLE for USB3.0 Rx */
    val = readl(priv->mmio + 0x200);
    val &= ~GENMASK(17, 17);
    val |= 0x01;
    writel(val, priv->mmio + 0x200);
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

RK3562-Einfügepunkt in `rk3562_combphy_cfg`:

```text
case PHY_TYPE_USB3:
    /* Set SSC downward spread spectrum */
    val = readl(priv->mmio + (0x1f << 2));
    val &= ~GENMASK(5, 4);
    val |= 0x01 << 4;
    writel(val, priv->mmio + 0x7c);
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

RK3566 und RK3568 teilen Code; an dieser Stelle in `rk3568_combphy_cfg` einfügen:

```text
case PHY_TYPE_USB3:
    ...
    /* Set PLL KVCO to min and set PLL charge pump current to max */
    writel(0xf0, priv->mmio + (0xa << 2));
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
```

### 3.25 RK3576 USB3.1 PHY

RK3576-USB3-OTG0-Tuning am Ende von `udphy_init()` in `kernel/drivers/phy/rockchip/phy-rockchip-usbdp.c` einfügen.

```text
ret = udphy_status_check(udphy);
if (ret)
    goto assert_phy;
    .../* USB3-OTG0 PHY Tuning Code */
return 0;
```

RK3576-USB3-OTG1-Tuning am Ende von `rk3576_combphy_cfg()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c` einfügen.

```text
case PHY_TYPE_USB3:
    /* Set Rx squelch input filler bandwidth */
    writel(0x0d, priv->mmio + (0x14 << 2));
    ...
    .../* USB3-OTG1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

### 3.26 RK3588 USB3.1 PHY

RK3588-USB3-OTG und USB3-HOST haben unterschiedliche Einfügepunkte. USB3-OTG besitzt noch keine dedizierte Tuningschnittstelle wie USB2.0; daher am Ende von `rk3588_udphy_init()` in `kernel/drivers/phy/rockchip/phy-rockchip-usbdp.c` einfügen.

```text
ret = rk3588_udphy_status_check(udphy);
if (ret)
    goto assert_phy;
    .../* USB3-OTG PHY Tuning Code */
return 0;
```

RK3588-USB3-HOST-Tuning in `rk3588_combphy_cfg()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c` einfügen.

```text
case PHY_TYPE_USB3:
    /* Set SSC downward spread spectrum */
    val = readl(priv->mmio + (0x1f << 2));
    val &= ~GENMASK(5, 4);
    val |= 0x01 << 4;
    ...
    .../* USB3-HOST PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

### 3.27 RV1126B USB3.1 PHY

RV1126B USB3.1-Tuningcode in `rv1126b_combphy_cfg()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c` einfügen.

```text
case PHY_TYPE_USB3:
    /* Set Rx squelch input filler bandwidth */
    writel(0x0e, priv->mmio + (0x14 << 2));
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    rockchip_combphy_param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    rockchip_combphy_param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    rockchip_combphy_param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    rockchip_combphy_param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

{% endraw %}
