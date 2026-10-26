---
title: "Rockchip USB: Leitfaden für Signalqualität und Konformitätsprüfung"
description: "Rockchip USB: Leitfaden für Signalqualität und Konformitätsprüfung — V2.7.0"
excerpt: "Rockchip USB: Leitfaden für Signalqualität und Konformitätsprüfung"
translation_key: "164-rockchip-usb-sq-test"
slug: "164-rockchip-usb-sq-test"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, PHY, Linux]
---

{% raw %}

# Rockchip USB: Leitfaden für Signalqualität und Konformitätsprüfung

Plattformreferenz: Die chinesische Quelle V2.7.0 (RK-CS-YF-094) nennt Serien 29/30/31/32/33/35, PX, RV, Sofia, MCU und alle Kernelversionen; daraus folgt keine Zusage für jedes ArmSoM-Board. SoC, Controller, Port, BSP, Kernel und TRM prüfen, besonders Type-C-Versorgung/Rollen. Quellenbeispiele, keine ArmSoM-Hardwaremessungen. Nur chinesisches PDF vorhanden; alle vier Sprachen verwenden dessen Originalbilder.

Achtung: io schreibt direkt Register; Versorgungs-/Moduswechsel sind riskant, keine Hardwarebefehle ausgeführt. Quellenzweifel bleiben: Manche cat sys/... ohne führenden Slash; Host als Device bezeichnet; BER als 10e-12; Device-Text nennt 11 Zoll, Screenshot 5 Zoll; 10-cm-Grenze unklar. Tabelle 6 steht unter Device, nennt Spalten aber Host. Adressen/Konstanten nicht spekulativ geändert.

Technisches Vorwort: USB2 umfasst High/Full/Low Speed, detailliert High-Speed Signal Quality und Receiver Sensitivity. USB3 behandelt Tx Compliance ausführlich, Rx nur mit Prinzipien/Hinweisen. Rockchip-Controller sind unabhängig: Vor Befehlswahl TRM prüfen. Geräte: Agilent, Tektronix, LeCroy; jeweiliges Herstellerhandbuch beachten. USB-Testbefehle beziehen sich auf den geprüften Port.

Weitere USB2-Prüfungen: Packet Parameters, CHIRP Timing, Suspend/Resume/Reset Timing, Test J/K, SE0_NAK. Befehle sind nach Controllermodell geordnet und benötigen Softwarekenntnisse; für die Suche nach Schaltplan-Portnamen Rockchip USB SQ Tool verwenden.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. USB 2.0 Compliance Test

### 1.1 USB2-Konformitätsprüfungen

USB 2.0 Tx Signal Quality prüft Augendiagramm, Signalrate, Paketendbreite, Kreuzungsspannungsbereich (Low/Full Speed), JK-/KJ- und aufeinanderfolgenden Jitter, Monotonie (High Speed) sowie Anstiegs-/Abfallzeiten. USB 2.0 Rx Receiver Sensitivity prüft Empfindlichkeit, Squelch-Schwelle und minimales SYNC-Feld.

### 1.2 USB2-Tx-Befehle und Werkzeuge

USB 2.0 Tx SQ setzt das Test-Control-Register für Test Packet Mode. Der Controller sendet kontinuierlich ein periodisches Testmuster, dessen Signalqualität das Oszilloskop analysiert. Rockchip-Device-Ports verwenden Befehle oder Testwerkzeug, Host-Ports ausschließlich Befehle.

#### 1.2.1 USB2-Device-Tx-Befehle und Werkzeuge

USB-2.0-Device-SQ-Befehle stehen in Tabelle 1 und werden über UART oder ADB eingegeben. Tabelle 1: USB-2.0-Device-SQ-Befehle.

| Chip | DWC2_0 OTG 2.0<br>Device | DWC3_0 OTG 2.0 device | DWC3_1 OTG 2.0 device |
| --- | --- | --- | --- |
| RK1808 | N.A | io -4 0xfd00c704 0x8c000a08 | N.A |
| RK1820 | N.A | io -4 0x102500c704 0x8c000a08 | io -4 0x102400c704 0x8c000a08 |
| RK2108 | io -4 0x41300804 0x40 | N.A | N.A |
| RK2116 | io -4 0x40040804 0x40 | N.A | N.A |
| RK2118 | io -4 0x50040804 0x40 | N.A | N.A |
| RK2206 | io -4 0x43040804 0x40 | N.A | N.A |
| RK29XX<br>RK30XX<br>RK31XX | io -4 0x10180804 0x40 | N.A | N.A |
| RK3228<br>RK3229 | io -4 0x30040804 0x40 | N.A | N.A |
| RK3288<br>RK3228H<br>RK3328<br>RK3368 | io -4 0xff580804 0x40 | N.A | N.A |
| RK3308<br>RK3308B-S<br>RK3308H-S | io -4 0xff400804 0x40 | N.A | N.A |
| RK3326<br>RK3326S<br>PX30<br>PX30S | io -4 0xff300804 0x40 | N.A | N.A |
| RV1103<br>RV1106 | N.A | io -4 0xffb0c704 0x8c000a08 | N.A |
| RV1103B | N.A | io -4 0x20b0c704 0x8c000a08 | N.A |
| RV1108 | io -4 0x30180804 0x40 | N.A | N.A |
| RV1126<br>RV1109 | N.A | io -4 0xffd0c704 0x8c000a08 | N.A |
| RV1126B | N.A | io -4 0x2150c704 0x8c000a08 | N.A |
| SOFIA-3GR | io -4 0xe2100804 0x40 | N.A | N.A |
| RK3366 | io -4 0xff4c0804 0x40 | io -4 0xff50c704 0x8c000a08 | N.A |
| RK3399 | N.A | io -4 0xfe80c704 0x8c000a08 | io -4 0xfe90c704 0x8c000a08 |
| RK3506 | io -4 0xff740804 0x40 | N.A | N.A |
| RK3528 | N.A | io -4 0xfe50c704 0x8c000a08 | N.A |
| RK3538 | N.A | io -4 0xfc00c704 0x8c000a08 | N.A |
| RK3562 | N.A | io -4 0xfe50c704 0x8c000a08 | N.A |
| RK3576 | N.A | io -4 0x2300c704 0x8c000a08 | io -4 0x2340c704 0x8c000a08 |
| RK3566<br>RK3568 | N.A | io -4 0xfcc0c704 0x8c000a08 | N.A |
| RK625 | io -4 0x40180804 0x40 | N.A | N.A |
| RK3588<br>RK3588S | N.A | io -4 0xfc00c704 0x8c000a08 | io -4 0xfc40c704 0x8c000a08 |

RK3506-OTG1-Device-Befehl: `io -4 0xff780804 0x40`. Alternativ USB HSET von USB-IF verwenden: USBHSET for EHCI oder XHCI. Downloads:

- EHCI 32-Bit: https://www.usb.org/document-library/usbhset-ehci-32-bit
- EHCI 64-Bit: https://www.usb.org/document-library/usbhset-ehci-64-bit
- xHCI 32-Bit: https://www.usb.org/document-library/xhsett-x32
- xHCI 64-Bit: https://www.usb.org/document-library/xhsett-x64e (Quellen-URL)

Grundablauf:

1. Den Device-Port mit einem USB-Kabel am PC anschließen.

2. Werkzeug öffnen, Device wählen und TEST anklicken (Abbildung 1).

![Quellenabbildung — PDF p9](/docs/rockchip-usb-sq-test/assets/cn-p009-figure-01.png)

Abbildung 1. Testtyp auswählen.

3. Zielgerät und TEST PACKET wählen, dann EXECUTE (Abbildung 2). Der Controller startet Test Packet Mode und sendet periodische Pakete mit der Signalform aus Abbildung 3.

![Quellenabbildung — PDF p9](/docs/rockchip-usb-sq-test/assets/cn-p009-figure-02.png)

Abbildung 2. Gerät und Testbefehl auswählen.

![Quellenabbildung — PDF p10](/docs/rockchip-usb-sq-test/assets/cn-p010-figure-01.png)

Abbildung 3. Testsignalform.

#### 1.2.2 USB2-Host-Tx-Befehle

USB 2.0 Host SQ benötigt Befehle; kein spezielles Testwerkzeug ist vorgesehen. Befehle aus Tabellen 2–4 über ADB/UART eingeben. Tabelle 2: USB-2.0-Host-SQ-Befehle (a).

| Chip | DWC2_0 OTG Host 2.0 | DWC2_1 Host 2.0 | EHCI_0 Host 2.0 |
| --- | --- | --- | --- |
| RK1808 | N.A | N.A | io -4 0xffd80054 0x40000 |
| RK2116 | io -4 0x40040440 0x8000 | N.A | N.A |
| RK2118 | io -4 0x50040440 0x8000 | N.A | N.A |
| RK2206 | io -4 0x43040440 0x8000 | N.A | N.A |
| RK29XX<br>RK30XX<br>RK3188 | io -4 0x10180440 0x8000 | io -4 0x101c0440 0x8000 | N.A |
| RK312X | io -4 0x10180440 0x8000 | io -4 0x101c0440 0x8000 | io -4 0x101c0054 0x40000 |
| RK3228<br>RK3229 | io -4 0x30040440 0x8000 | N.A | io -4 0x30080054 0x40000 |
| RK3288 | io -4 0xff580440 0x8000 | io -4 0xff540440 0x8000 | io -4 0xff500054 0x40000 |
| RK3308<br>RK3308B-S<br>RK3308H-S | io -4 0xff400440 0x8000 | N.A | io -4 0xff440054 0x40000 |
| RK3326<br>RK3326S | io -4 0xff300440 0x8000 | N.A | N.A |
| PX30<br>PX30S | io -4 0xff300440 0x8000 | N.A | io -4 0xff340054 0x40000 |
| RK3228H<br>RK3328 | io -4 0xff580440 0x8000 | N.A | io -4 0xff5c0054 0x40000 |
| RK3366 | io -4 0xff4c0440 0x8000 | N.A | io -4 0xff480054 0x40000 |
| RK3368 | io -4 0xff580440 0x8000 | N.A | io -4 0xff500054 0x40000 |
| RV1108 | io -4 0x30180440 0x8000 | N.A | io -4 0x30140054 0x40000 |
| RV1126<br>RV1109 | N.A | N.A | io -4 0xffe00054 0x40000 |
| RV1126B | N.A | N.A | io -4 0x21480054 0x40000 |
| SOFIA-3GR | io -4 0xe2100440 0x8000 | N.A | N.A |
| RK3399 | N.A | N.A | io -4 0xfe380054 0x40000 |
| RK3506 | io -4 0xff740440 0x8000 | io -4 0xff780440 0x8000 | N.A |
| RK3528 | N.A | N.A | io -4 0xff100054 0x40000 |
| RK3538 | N.A | N.A | io -4 0xfc100054 0x40000 |
| RK3562 | N.A | N.A | io -4 0xfed00054 0x40000 |
| RK3566<br>RK3568 | N.A | N.A | io -4 0xfd800054 0x40000 |
| RK3588<br>RK3588S | N.A | N.A | io -4 0xfc800054 0x40000 |

Tabelle 3. USB-2.0-Host-SQ-Befehle (b).

| Chip | EHCI_1 Host 2.0 | EHCI_2 Host 2.0 | EHCI_HSIC Host 2.0 |
| --- | --- | --- | --- |
| RK3168<br>RK3188 | N.A | N.A | io -4 0x10240054 0x40000 |
| RK3288 | N.A | N.A | io -4 0xff5c0054 0x40000 |
| RK3228<br>RK3229 | io -4 0x300c0054 0x40000 | io -4 0x30100054 0x40000 | N.A |
| RK3368 | N.A | N.A | io -4 0xff5c0054 0x40000 |
| RK3399 | io -4 0xfe3c0054 0x40000 | N.A | io -4 0xfe340054 0x40000 |
| RK3566<br>RK3568 | io -4 0xfd880054 0x40000 | N.A | N.A |
| RK3588<br>RK3588S | io -4 0xfc880054 0x40000 | N.A | N.A |

Tabelle 4. USB-2.0-Host-SQ-Befehle (c).

| Chip | DWC3_0 OTG Host 2.0 | DWC3_1 OTG Host 2.0 |
| --- | --- | --- |
| RK1808 | io -4 0xfd000424 0x40000000 | N.A |
| RK1820 | io -4 0x1025000424 0x40000000 | io -4 0x1024000424 0x40000000 |
| RK3228H | io -4 0xff600424 0x40000000 | N.A |
| RK3366 | io -4 0xff500424 0x40000000 | N.A |
| RK3399 | io -4 0xfe800424 0x40000000 | io -4 0xfe900424 0x40000000 |
| RV1103<br>RV1106 | io -4 0xffb00424 0x40000000 | N.A |
| RV1103B | io -4 0x20b00424 0x40000000 | N.A |
| RV1126<br>RV1109 | io -4 0xffd00424 0x40000000 | N.A |
| RV1126B | io -4 0x21500424 0x40000000 | N.A |
| RK3528 | io -4 0xfe500424 0x40000000 | N.A |
| RK3538 | io -4 0xfc000424 0x40000000 | N.A |
| RK3562 | io -4 0xfe500424 0x40000000 | N.A |
| RK3566<br>RK3568 | io -4 0xfcc00424 0x40000000 | io -4 0xfd000424 0x40000000 |
| RK3576 | io -4 0x23000424 0x40000000 | io -4 0x23400424 0x40000000 |
| RK3588<br>RK3588S | io -4 0xfc000424 0x40000000 | io -4 0xfc400424 0x40000000 |

### 1.3 USB2-Tx-Aufbau

Oszilloskop mit USB-Prüfsoftware verwenden, etwa Agilent 9000/90000, Tektronix oder LeCroy. Beispiel Agilent 9000: MSO9254A mit N5416A; aktiver Differenztastkopf 113xA; E2678A-Tastkopfkopf; E2649-66401-Device- und E2649-66402-Host-Fixture; USB2-Kabel. Das Kabel muss USB2 strikt entsprechen. Unter 10 cm Near-End-Maske, über 10 cm Far-End-Maske verwenden. Zu lange Kabel oder Impedanzfehlanpassung können Near-End-Fehler verursachen.

### 1.4 USB2-Tx-Verfahren

1. Aufbau herstellen. Für Agilent siehe Agilent N5416A USB 2.0 Compliance Test Option und Agilent USB2.0 High Speed Device SQ Test. Tektronix-/LeCroy-Anleitungen auf deren offiziellen Websites beziehen. Abbildung 4 zeigt einen Agilent-USB2-Device-SQ-Aufbau.

![Quellenabbildung — PDF p14](/docs/rockchip-usb-sq-test/assets/cn-p014-figure-01.png)

Abbildung 4. Agilent-USB2-SQ-Aufbau.

2. Test Packet Mode aktivieren. Zunächst normale USB-Kommunikation prüfen. OTG Device über Fixture/Kabel mit dem PC verbinden und Erkennung prüfen, dann die beschriebenen Device-Befehle bzw. das PC-Werkzeug verwenden. Für Host hängt der Ablauf von Fixture und Oszilloskop ab; nachfolgend Agilent und Tektronix.

2.1 Agilent-Testausrüstung

Host an ein Fixture-Ende und ein High-Speed-Gerät wie einen USB-Stick an das andere anschließen (Abbildung 5), dann den Testbefehl ausführen.

![Quellenabbildung — PDF p15](/docs/rockchip-usb-sq-test/assets/cn-p015-figure-01.png)

Abbildung 5. Agilent-USB2-Fixture-Anschluss.

2.2 Tektronix: Das Fixture besitzt nur einen Hostanschluss und kann kein weiteres High-Speed-Gerät gleichzeitig aufnehmen. Fixture trennen, High-Speed-Gerät wie USB-Stick am Host anschließen und Testbefehl ausführen. Nach Moduseintritt Gerät entfernen, Fixture anschließen und testen. High Speed ist zwingend; keine Full-/Low-Speed-Maus oder -Tastatur verwenden.

3. Signal mit automatisierter USB-Software analysieren. Im Testmodus zeigt das Oszilloskop kontinuierliche periodische Test Packet Patterns (Abbildung 6). Die Software analysiert sie und erstellt den vollständigen Bericht.

![Quellenabbildung — PDF p16](/docs/rockchip-usb-sq-test/assets/cn-p016-figure-01.png)

Abbildung 6. USB2-Signalqualitätsanalyse.

### 1.5 USB2-Augendiagrammanalyse

#### 1.5.1 Standard-USB2-Augendiagramm

USB2 verwendet Near-End- und Far-End-Augenmasken. Bei High-Speed SQ gilt Near End für Kabel unter 10 cm zwischen Port und Fixture, Far End für längere. Für zuverlässige Rockchip-USB2-Qualität empfiehlt die Quelle die strengere Near-End-Maske als gemeinsame Referenz. Abbildungen 7/8 zeigen beide Standardaugen.

![Quellenabbildung — PDF p16](/docs/rockchip-usb-sq-test/assets/cn-p016-figure-02.png)

Abbildung 7. USB2-High-Speed-Near-End-Augendiagramm.

![Quellenabbildung — PDF p17](/docs/rockchip-usb-sq-test/assets/cn-p017-figure-01.png)

Abbildung 8. USB2-High-Speed-Far-End-Auge. Ein Standardauge besitzt dünne klare Spuren und eine große Öffnung. Intersymbolinterferenz verzerrt Signale, verhindert Symbolüberlagerung und verwischt bzw. schließt das Auge. Zusätzliches Rauschen verstärkt dies. Die Augenöffnung zeigt damit Verzerrung und Intersymbolinterferenz an.

#### 1.5.2 USB2-Augendiagrammprobleme

1. Kein Augentest-Trigger: Fixture-Verkabelung und USB-Softwareeinstellungen prüfen. Periodisches Muster aus Abbildung 1-3 suchen; fehlt es, ist der Testbefehl eventuell falsch oder fehlgeschlagen.

2. Starke Amplitudenverzerrung oder Einbruch deutet meist auf Bedienfehler hin. In Abbildung 9 ist die Amplitude doppelt so groß; bei Agilent fehlen gewöhnlich 50-Ohm-SMA-Abschlüsse an D+/D-. Der Einbruch in Abbildung 10 bedeutet meist, dass der Agilent-Fixture-Schalter nicht auf ON steht.

![Quellenabbildung — PDF p18](/docs/rockchip-usb-sq-test/assets/cn-p018-figure-01.png)

Abbildung 9. Augen-Amplitudenverzerrung.

![Quellenabbildung — PDF p18](/docs/rockchip-usb-sq-test/assets/cn-p018-figure-02.png)

Abbildung 10. Signaleinbruch im Auge.

3. Geschlossenes Auge: Abbildung 11 verletzt die Maske. DP/DM auf kapazitätsreiche ESD-Bauteile oder elektronische Schalter prüfen und gegebenenfalls zum Nachtesten entfernen. PHY-Treiberstärke und Flanken mit Unterstützung des USB-Treiberentwicklers softwareseitig anpassen.

![Quellenabbildung — PDF p18](/docs/rockchip-usb-sq-test/assets/cn-p018-figure-03.png)

Abbildung 11. Geschlossenes USB-Auge.

4. Verschwommenes oder stark gestreiftes Auge (Abbildung 12) deutet auf starkes Übersprechen, eventuell Impedanzfehlanpassung oder Rauschen. Zuerst kapazitätsreiche ESD-Bauteile/Schalter an DP/DM prüfen bzw. zum Test entfernen. Danach Kabelimpedanz prüfen oder Kabel ersetzen. Abschließend PCB-Leitungen, USB-24-MHz-Taktquelle und PHY-Versorgungswelligkeit prüfen.

![Quellenabbildung — PDF p19](/docs/rockchip-usb-sq-test/assets/cn-p019-figure-01.png)

Abbildung 12. Verschwommenes USB-Auge.

### 1.6 USB2 Rx Compliance Test

#### 1.6.1 Prinzip USB2 Receiver Sensitivity

USB 2.0 Electrical Compliance Test Specification 1.07 definiert EL_16 Receiver Sensitivity @ Squelch, EL_17 Receiver Sensitivity und EL_18 Minimum SYNC Field. DUT in SE0_NAK versetzen. Ein Generator simuliert Host-IN-Pakete; korrekt empfangene Pakete lösen NAK aus. IN-Amplitude variieren und NAK beobachten. EL_16 läuft von hoch nach niedrig: Antwort unter 100 mV bedeutet zu hohe Empfindlichkeit/Fehler. EL_17 läuft umgekehrt: keine stabile Antwort über 200 mV bedeutet zu geringe Empfindlichkeit/Fehler. Ursprünglich galt 150 mV, durch ECN auf 200 mV geändert. Da der Generator Host ist, sind nur Device-/HUB-Upstream-Ports prüfbar. NAK-Muster: 32-Bit-Sync (31 Nullen + eine 1), danach 8-Bit-PID 10100101.

#### 1.6.2 USB2-Rx-Befehle

Tabelle 5. USB2-Test-SE0_NAK-Befehle.

| Chip | USB 2.0 Test SE0_NAK Befehl |
| --- | --- |
| RK1808 | io -4 0xfd00c704 0x8c000a06 |
| RK1820 | io -4 0x102500c704 0x8c000a06 |
| RK2108 | io -4 0x41300804 0x30 |
| RK2116 | io -4 0x40040804 0x30 |
| RK2206 | io -4 0x43040804 0x30 |
| RK29XX<br>RK30XX<br>RK31XX | io -4 0x10180804 0x30 |
| RK3228<br>RK3229 | io -4 0x30040804 0x30 |
| RK3288<br>RK3228H<br>RK3328<br>RK3368 | io -4 0xff580804 0x30 |
| RK3308<br>RK3308B-S<br>RK3308H-S | io -4 0xff400804 0x30 |
| RK3326<br>RK3326S<br>PX30<br>PX30S | io -4 0xff300804 0x30 |
| RV1103<br>RV1106 | io -4 0xffb0c704 0x8c000a06 |
| RV1108 | io -4 0x30180804 0x30 |
| RV1126<br>RV1109 | io -4 0xffd0c704 0x8c000a06 |
| RV1126B | io -4 0x2150c704 0x8c000a06 |
| RK3399 | io -4 0xfe80c704 0x8c000a06 |
| RK3566<br>RK3568 | io -4 0xfcc0c704 0x8c000a06 |
| RK625 | io -4 0x40180804 0x30 |
| RK3588<br>RK3588S | io -4 0xfc00c704 0x8c000a06 |

#### 1.6.3 USB2-Rx-Verfahren

Standardablauf siehe Abschnitt 4.2.1 Upstream Port Receiver Sensitivity der USB 2.0 Electrical Compliance Test Specification 1.07. Beispiel mit Tektronix.

##### 1.6.3.1 USB2-Rx-Hinweise

Vor Befehlen DUT über Fixture mit PC Host verbinden, damit die Device-PHY nicht suspendiert. Test SE0_NAK über UART eingeben. Bei EL_18 beim Wechsel des Tektronix-Generators von 32- auf 12-Bit-SYNC dessen Kanalpolarität umkehren.

##### 1.6.3.2 USB2-Rx-Ablauf

1. DUT über Device-Sensitivity-Fixture mit Tektronix-Generator/Oszilloskop verbinden, siehe Abbildung 13.

![Quellenabbildung — PDF p22](/docs/rockchip-usb-sq-test/assets/cn-p022-figure-01.png)

Abbildung 13. Tektronix-USB2-Rx-Anschlüsse.

![Quellenabbildung — PDF p23](/docs/rockchip-usb-sq-test/assets/cn-p023-figure-01.png)

Abbildung 14. Tektronix-Signalgenerator.

![Quellenabbildung — PDF p23](/docs/rockchip-usb-sq-test/assets/cn-p023-figure-02.png)

Abbildung 15. USB2-Rx-Device-Sensitivity-Fixture.

2. Fixture-DIP-Schalter auf ON stellen und mit PC Host verbinden.

3. Tabellen-5-Befehl über UART eingeben, um SE0_NAK zu aktivieren.

4. Fixture-DIP-Schalter auf OFF stellen.

5. Tektronix-Testmuster einstellen und EL_16, EL_17 sowie EL_18 nacheinander prüfen.

##### 1.6.3.3 USB2-Rx-Ergebnisanalyse

Abbildung 16 zeigt die Echtzeiterfassung von Generator-IN und DUT-NAK am Oszilloskop zur Erstellung des gezeigten Berichts.

![Quellenabbildung — PDF p24](/docs/rockchip-usb-sq-test/assets/cn-p024-figure-01.png)

Abbildung 16. USB2-Rx-Signale.

![Quellenabbildung — PDF p24](/docs/rockchip-usb-sq-test/assets/cn-p024-figure-02.png)

Abbildung 17. USB2-Rx-Bericht. Bei EL_16-/EL_17-Fehlern USB2-PHY-Squelch anpassen; siehe Rockchip USB SQ Tool.

## 2. USB2 HUB SQ Test

HUB-SQ umfasst Upstream/Downstream, praktisch meist nur nutzerseitige Downstream-Ports, die hier beschrieben werden. Typische USB2-HUBs: FE1.1, FE1.1S, GL850, GL852, USX2064, HX2VL; HSIC: USB4604, GL850H. USB2 unterstützt beide Methoden, HSIC nur Methode 2. Methode 1: Hostcontroller und Befehl aus Tabellen 2–4 ermitteln und alle Downstream-Ports nach USB2-Ablauf prüfen. Befehl/Ablauf sind für alle Ports gleich. Methode 2 kompiliert und startet ein Skript: aufwendiger, aber universell für USB2 und HSIC.

1. USB_HUB_Compliance_Test_Script von https://redmine.rockchip.com.cn/documents/113 herunterladen und kompilieren.

2. linux-eye nach data kopieren, `chmod 777 linux-eye` ausführen, starten und Testbefehle nach Aufforderung eingeben:

```text
[root@hari LinuxEye]# ./linuxEye
LinuxEye - select one of the following hub for testing.
[ 0] 4-port Full-Speed hub at tier 2 of Bus 3
(VID: 0451, PID: 1446, Address: 3)
[ 1] 4-port High-Speed hub at tier 2 of Bus 1
(VID: 1A40, PID: 0101, Address: 15)
[ 2] 4-port High-Speed hub at tier 2 of Bus 1
(VID: 1A40, PID: 0101, Address: 10)
[ 3] 7-port High-Speed hub at tier 3 of Bus 1
(VID: 1A40, PID: 0201, Address: 50)
Please enter [0 ~ 3] to select a hub or 'q' to quit: 2 （表⽰共有4个HUB， 测试HUB[2]）
[ 1] is connected to Low-Speed device
[ 2] is open
[ 3] is connected to High-Speed device
[ 4] is connected to Low-Speed device
Please enter [1 ~ 4] to select a port or 'q' to quit: 2 （表⽰测试HUB的第2个port）
LinuxEye - Start testing port 2 of device 10 on bus 1
Type 'q' to stop the test: q (退出测试脚本)
[root@hari LinuxEye]#
```

## 3. USB3 Compliance Test

USB3 besitzt zwei Busse und ergänzt USB2 um SuperSpeed: 5 Gbps, ANSI-8b/10b-Kodierung, Vollduplex, Kabel bis 3 m. Abbildung 18 zeigt die Architektur.

![Quellenabbildung — PDF p26](/docs/rockchip-usb-sq-test/assets/cn-p026-figure-01.png)

Abbildung 18. USB3-Busarchitektur.

### 3.1 Zusätzliche USB3-Prüfvorgaben

Kalibrierung/Prüfung erfolgt am Compliance-Channel-Ende für den ungünstigsten Kanal: Host 3 m Kabel + 5 Zoll Leiterbahn, Device 3 m + 11 Zoll. Tx erlaubt Channel-Embedding mit Golden-S-Parametern. DJ/RJ/TJ bei laut Quelle 10e-12 BER berechnen, Pj bei 10, 20 und 33 MHz prüfen. Mit CTLE nachbearbeiten und entzerrtes Auge analysieren: 5-Gbps-Signale können nach langem Kabel/PCB geschlossen sein; Empfänger-CTLE kompensiert Hochfrequenzverlust, weshalb auch die Oszilloskopsoftware CTLE benötigt. Device-Empfängerauge: 145 mVp-p; Host: 180 mVpp.

USB3-Elektrotests umfassen Tx, Rx Tolerance Compliance sowie Kabel/Stecker.

### 3.2 USB3 Tx Compliance Test

#### 3.2.1 USB3-Tx-Anforderungen

Der Sender liefert definierte Muster. Ein Echtzeitoszilloskop misst Auge, Amplitude, Jitter, mittlere Datenrate und Flanken. USB3 mit 5 Gbps und kleinerer Amplitude benötigt über 12 GHz Bandbreite sowie niedrigen Rauschboden. Messpunkt ist das Compliance-Channel-Ende, nicht die direkte Fixture-Verbindung. Der Kanal modelliert Host: 3 m + 5 Zoll PCB; Device: 3 m + 11 Zoll. USB3 liefert S-Parameter-Modelle. Praktisch DUT direkt über Fixture anschließen und den Kanal per S-Parameter im Oszilloskop einbetten. TP1 in Abbildung 19 ist der Messpunkt.

![Quellenabbildung — PDF p27](/docs/rockchip-usb-sq-test/assets/cn-p027-figure-01.png)

Abbildung 19. USB3-Tx-Testmodell.

![Quellenabbildung — PDF p27](/docs/rockchip-usb-sq-test/assets/cn-p027-figure-02.png)

Abbildung 20. USB3-Tx-Augenanforderungen.

Editierbare Abschrift der Bildtabelle (referenzierte Hinweistexte fehlen im Bild):

| Signalmerkmal | Minimum | Nennwert | Maximum | Einheiten | Hinweisnummern |
| --- | --- | --- | --- | --- | --- |
| Augenhöhe | 100 |  | 1200 | mV | 2, 4 |
| Dj |  |  | 0.43 | UI | 1, 2, 3 |
| Rj |  |  | 0.23 | UI | 1, 2, 3, 5 |
| Tj |  |  | 0.66 | UI | 1, 2, 3 |

![Quellenabbildung — PDF p28](/docs/rockchip-usb-sq-test/assets/cn-p028-figure-01.png)

Abbildung 21. Elektrische USB3-Tx-Anforderungen.

Editierbare Abschrift der Bildtabelle (referenzierte Hinweistexte fehlen im Bild):

| Symbol | Parameter | 5.0 GT/s | Einheiten | Hinweise |
| --- | --- | --- | --- | --- |
| UI | Einheitsintervall | 199.94 (min); 200.06 (max) | ps | UI entspricht ±300 ppm Toleranz je Gerät; Periode ohne SSC-bedingte Änderungen. |
| V_TX-DIFF-PP | Differenzieller Tx-Spannungshub p-p | 0.8 (min); 1.2 (max) | V | Nennwert 1 V p-p. |
| V_TX-DIFF-PP-LOW | Differenzieller Low-Power-Tx-Spannungshub p-p | 0.4 (min); 1.2 (max) | V | Siehe 6.7.2. Keine De-Emphasis-Anforderung in diesem Modus; implementierungsabhängig. |
| V_TX-DE-RATIO | Tx-De-Emphasis | 3.0 (min); 4.0 (max) | dB | Nennwert 3.5 dB. |

#### 3.2.2 USB3-Tx-Prüfpunkte

LFPS (Near End); SSC (Near End); Tx (Near/Far End): Auge, Tj/Rj/Dj und Amplitude.

![Quellenabbildung — PDF p28](/docs/rockchip-usb-sq-test/assets/cn-p028-figure-02.png)

Abbildung 22. Agilent-USB3-Tx-Optionen.

#### 3.2.3 USB3-Tx-Testmodus

USB3 benötigt vor Tx-Signaltests Compliance Mode. Nach dem ersten LFPS-Timeout in Polling wechselt der Controller von Polling.LFPS in Compliance Mode (Abbildung 23).

![Quellenabbildung — PDF p29](/docs/rockchip-usb-sq-test/assets/cn-p029-figure-01.png)

Abbildung 23. Eintritt in USB3 Compliance Mode.

#### 3.2.4 USB3-Tx-Aufbau

Agilent empfiehlt die 90000-Serie (bis 13 GHz), U7243A-Prüfsoftware und U7242A-Fixture für USB3-Sendertests.

![Quellenabbildung — PDF p29](/docs/rockchip-usb-sq-test/assets/cn-p029-figure-02.png)

Abbildung 24. Agilent-USB3-Tx-Aufbau.

![Quellenabbildung — PDF p29](/docs/rockchip-usb-sq-test/assets/cn-p029-figure-03.png)

Abbildung 25. Agilent-USB3-Tx-Fixture U7242.

Agilent bietet N7015A für USB3.1 Gen1 Type-C (Abbildung 26) mit derselben Software wie U7242A. Für USB3/3.1-Type-C-Tests siehe Keysight N7015A-16A Type-C Test Kit.

![Quellenabbildung — PDF p30](/docs/rockchip-usb-sq-test/assets/cn-p030-figure-01.png)

Abbildung 26. Agilent-N7015A-Type-C-Fixture. Tektronix-Aufbau siehe Abbildung 27. USB-Tx auf DPO/MSO70000 automatisiert USB3-Sendermessungen: https://www.tek.com.cn/datasheet/usb3-transmitter-and-receiver-solutions-datasheet .

![Quellenabbildung — PDF p31](/docs/rockchip-usb-sq-test/assets/cn-p031-figure-01.png)

Abbildung 27. Tektronix-USB3-Tx-Anschlüsse.

#### 3.2.5 USB3-Device-Tx-Befehle

Einige Chips benötigen einen Device-Tx-Befehl für CP1. Diesen erst bei der CP1-Aufforderung des Oszilloskops eingeben; andernfalls kann der CP0/CP1-Wechsel fehlschlagen. Tabelle 6 enthält die Befehle.

| Chip | DWC3_0 OTG Host 3.0 | DWC3_1 OTG Host 3.0 |
| --- | --- | --- |
| RK1808 | io -4 0xff384008 0xc | N.A |
| RK3228H<br>RK3328 | io -4 0xff478408 0xc | N.A |

Normalerweise wechselt ein Device ohne Befehl in den Tx-Testmodus. In Tabelle 6 benötigen RK1808/RK3228H/RK3328 Befehle für manuellen CP1-Eintritt; RK3399/RK3568/RK3588 nicht.

#### 3.2.6 USB3-Device-Tx-Verfahren

Der folgende Device-Tx-Ablauf verwendet Agilent 90000 DSO91204A und U7242A-Fixture. Für Tektronix und LeCroy gelten die Herstelleranleitungen.

 3.2.6.1 USB3-Device-Tx-Hinweise

Zuerst Tabelle 6 prüfen. Nach Anschluss wechselt das Device normalerweise automatisch in Compliance Mode; nötigenfalls bei der CP1-Aufforderung den Befehl ausführen. Das Device darf keine 5 V auf VBUS liefern. VBUS über den USB-Stromanschluss des U7242A vom Oszilloskop oder PC zuführen.

 3.2.6.2 USB3-Device-Tx-Schritte

Schritt 1: Automatische Prüfsoftware konfigurieren.

![Quellenabbildung — PDF p32](/docs/rockchip-usb-sq-test/assets/cn-p032-figure-01.png)

Abbildung 28 zeigt Software V2.01. Die Oberfläche von V3.00.0001 unterscheidet sich; den Kanal wie nachfolgend konfigurieren.

![Quellenabbildung — PDF p33](/docs/rockchip-usb-sq-test/assets/cn-p033-figure-01.png)

Abbildung 29. Normal Channel bettet standardmäßig ein 3-m-Kabel- und 5-Zoll-Platinenmodell ein. Fixture direkt mit DUT verbinden. Ein reales Kabel über 10 cm kann Far End fehlschlagen lassen; None oder ein Kabel unter 10 cm verwenden.

Schritt 2: All USB3 Tests auswählen.

![Quellenabbildung — PDF p33](/docs/rockchip-usb-sq-test/assets/cn-p033-figure-02.png)

Abbildung 30. Auswahl der Prüfungen.

Schritt 3: Automate Test Pattern Change auf Auto setzen; übrige Einstellungen unverändert lassen.

![Quellenabbildung — PDF p34](/docs/rockchip-usb-sq-test/assets/cn-p034-figure-01.png)

Abbildung 31. Testkonfiguration.

Schritt 4: Oszilloskop, Fixture und Device entsprechend der Aufforderung verbinden, einschließlich 5-V-VBUS-Versorgung.

![Quellenabbildung — PDF p34](/docs/rockchip-usb-sq-test/assets/cn-p034-figure-02.png)

Abbildung 32. Device-Tx-Verbindungen.

Schritt 5: Tx-Test starten.

5.1 Hinweise zum LFPS-Test.

![Quellenabbildung — PDF p35](/docs/rockchip-usb-sq-test/assets/cn-p035-figure-01.png)

Abbildung 33. Vor dem LFPS-Test USB3-Fixture vom DUT trennen, OK klicken und erneut verbinden.

![Quellenabbildung — PDF p35](/docs/rockchip-usb-sq-test/assets/cn-p035-figure-02.png)

Abbildung 34. LFPS-Referenzsignal.

5.2 Nach LFPS die Verbindungen gemäß Aufforderung für den SSC-Test ändern.

![Quellenabbildung — PDF p36](/docs/rockchip-usb-sq-test/assets/cn-p036-figure-01.png)

Abbildung 35. SSC-Verbindungen.

5.3 Nach SSC die Verbindungen für Augen- und Jittermessungen ändern.

![Quellenabbildung — PDF p36](/docs/rockchip-usb-sq-test/assets/cn-p036-figure-02.png)

Abbildung 36. Verbindungen für Augen- und Jittermessungen.

5.4 Automatisch erzeugten Prüfbericht prüfen.

![Quellenabbildung — PDF p37](/docs/rockchip-usb-sq-test/assets/cn-p037-figure-01.png)

Abbildung 37. Prüfbericht.

![Quellenabbildung — PDF p37](/docs/rockchip-usb-sq-test/assets/cn-p037-figure-02.png)

Abbildung 38. LFPS Burst Width.

![Quellenabbildung — PDF p38](/docs/rockchip-usb-sq-test/assets/cn-p038-figure-01.png)

Abbildung 39. LFPS Repeat Time Interval.

![Quellenabbildung — PDF p38](/docs/rockchip-usb-sq-test/assets/cn-p038-figure-02.png)

Abbildung 40. Short Channel Eye.

![Quellenabbildung — PDF p39](/docs/rockchip-usb-sq-test/assets/cn-p039-figure-01.png)

Abbildung 41. Far End Eye.

#### 3.2.7 USB3-Host-Tx-Befehle

Tabelle 7. USB3-Host-Tx-Testbefehle.

| Chip | DWC3_0 OTG Host 3.0 | DWC3_1 OTG Host 3.0 | DWC3_2 Host 3.0 |
| --- | --- | --- | --- |
| RK1808 | io -4 0xff384008 0xc<br>io -4 0xfd000430 0x0a010340 | N.A | N.A |
| RK1820 | io -4 0x1025000430 0x0a010340 | N.A | N.A |
| RK3228H<br>RK3328 | io -4 0xff478408 0xc<br>io -4 0xff600430 0x0a010340 | N.A | N.A |
| RK3366 | io -4 0xff500430 0x0a010340 | N.A | N.A |
| RK3399 | io -4 0xfe800430 0x0a010340 | io -4 0xfe900430 0x0a010340 | N.A |
| RK3528 | io -4 0xfe500430 0x0a010340 | N.A | N.A |
| RK3562 | io -4 0xfe500430 0x0a010340 | N.A | N.A |
| RK3566<br>RK3568 | io -4 0xfcc00430 0x0a010340 | io -4 0xfd000430 0x0a010340 | N.A |
| RK3576 | io -4 0x23000430 0x0a010340 | io -4 0x23400430 0x0a010340 | N.A |
| RK3588<br>RK3588S | io -4 0xfc000430 0x0a010340 | io -4 0xfc400430 0x0a010340 | io -4 0xfcd00430 0x0a010340 |
| RV1126B | io -4 0x21500430 0x0a010340 | N.A | N.A |

RK1808/RK3228H/RK3328 haben zwei Befehle; der erste schreibt 0xc für manuelles CP1. Normalerweise beide zusammen ausführen. Bei CP0/CP1-Problemen zunächst nur 0x0a010340 schreiben, dann 0xc bei CP1-Aufforderung. Die io-Befehle gelten chip- und kernelübergreifend. RK3399-Linux-3.10/4.4-Type-C-Kernelknoten siehe 3.4.2.

#### 3.2.8 USB3-Host-Tx-Verfahren

Die Quelle bezeichnet den folgenden Ablauf mit Agilent 90000 DSO91204A/U7242A als Device Tx, obwohl er im Host-Abschnitt steht. Für Tektronix und LeCroy siehe Herstelleranleitungen.

 3.2.8.1 USB3-Host-Tx-Hinweise

Zuerst USB3-Datenträger anschließen, SuperSpeed im Protokoll prüfen und entfernen. Ohne diesen Schritt kann RK3399 Type-A scheitern. Vor dem Test Befehl aus Tabelle 7 ausführen. Der Host liefert 5 V VBUS; das Fixture darf nicht speisen, im Gegensatz zum Device-Test. Befehlszeitpunkt unterscheidet sich bei Type-A/Type-C.

 3.2.8.2 USB3-Host-Tx-Schritte

Schritt 1: Software wie beim Device-Test konfigurieren.

Schritt 2: Fixture und Oszilloskop verbinden, Host noch nicht anschließen.

Schritt 3: Beim LFPS-Test fordert das Oszilloskop zum Trennen des Fixtures vom Host auf.

Schritt 4: Chip-/Portbefehl in Tabelle 7 ermitteln.

Schritt 5: Bei Type-A zuerst den Befehl eingeben, dann verbinden; bei Type-C verbinden, 2–3 s auf Host warten und dann den Befehl eingeben.

Schritt 6: Fixture und Host verbinden; der Testmodus startet automatisch.

Schritt 7: Übrigen Oszilloskop-Aufforderungen bis zum Abschluss folgen.

#### 3.2.9 USB3-Tx-Compliance-Modus prüfen

Device-Tx-Abfrage: `cat /sys/kernel/debug/usb/xxxx/link_state`, xxxx durch den geprüften USB-Controllerknoten ersetzen. `Compliance` bedeutet Device Tx. Für Host Tx unter Linux 4.19 und älter xHCI PORTSC mit io lesen: Bits [8:5] sind Port Link State (PLS). PLS = 10 (dezimal) bedeutet Compliance mode (die Quelle nennt hier Device). Basisadresse ist chipabhängig, siehe TRM; Offset 0x430. RK3399 Host0 PORTSC liegt bei 0xfe800430, Host1 bei 0xfe900430. Linux 5.10 und neuer bieten einen portsc-Knoten für Host-Tx-Status:

`cat sys/kernel/debug/usb/xhci/xxxx/ports/port02/portsc`, xxxx durch den geprüften xHCI-Knoten ersetzen. `Link:Compliance mode` bedeutet Host-Tx-Testmodus.

### 3.3 USB3 Rx Compliance Test

Die elektrische USB3-Rx-Prüfung heißt Receiver Jitter Tolerance Test. Kein Testbefehl erforderlich: Nach Anschluss des Aufbaus tritt der Controller automatisch in Loopback ein und Rx beginnt. Der Aufbau ist komplex und oszilloskopabhängig; deshalb keine detaillierte Rx-Anleitung hier, siehe Oszilloskophandbuch. Beschrieben werden nur Loopback-Eintritt und Statusprüfung.

#### 3.3.1 USB3-Rx-Verfahren

Loopback-Eintritt: Während Polling.Configuration beim Link Training konfiguriert die Erkennung des Loopback-Bits im T2-Muster des Testers den USB3-PHY automatisch für Loopback (Abbildung 42).

![Quellenabbildung — PDF p42](/docs/rockchip-usb-sq-test/assets/cn-p042-figure-01.png)

Abbildung 42. USB3-Loopback-Eintritt. Receiver-Jitter-Tolerance-Testverfahren siehe Electrical Compliance Test Specification for SuperSpeed USB Rev.

1.0a, Abschnitt TD.1.5 Receiver Jitter Tolerance Test mit detaillierten Prüfschritten.

#### 3.3.2 USB3-Rx-Loopback-Modus prüfen

Device-Rx-Abfrage: `cat /sys/kernel/debug/usb/xxxx/link_state`, xxxx durch den geprüften USB-Controllerknoten ersetzen.

`Loopback` bedeutet Device Rx. Für Host Rx unter Linux 4.19 und älter xHCI PORTSC mit io lesen: Bits [8:5] PLS = 11 (dezimal) bedeuten Loopback. Basis im Chip-TRM nachsehen; Offset 0x430. RK3399 Host0 PORTSC = 0xfe800430, Host1 = 0xfe900430. Unter Linux 5.10 und neuer `cat sys/kernel/debug/usb/xhci/xxxx/ports/port02/portsc` verwenden, xxxx durch den tatsächlichen xHCI-Knoten ersetzen. `Link:Test mode` bedeutet Host Rx.

### 3.4 USB3-Compliance-Probleme und Lösungen

#### 3.4.1 Device tritt nicht in Tx ein

USB3 Device tritt normalerweise ohne Befehl in Tx ein. Andernfalls zuerst VBUS messen. Die Device-Tx-Compliance-Spezifikation verbietet die eigene 5-V-VBUS-Versorgung des Devices; diese verhindert automatischen Compliance-Eintritt. Das Fixture muss VBUS liefern: USB-Stromport per USB-Kabel mit Oszilloskop oder PC verbinden.

#### 3.4.2 RK3399-USB3-Probleme

1. RK3399-Type-A-Host tritt nicht in Tx ein: Vor dem Test gemäß Host-Tx-Hinweisen einen USB3-Datenträger einsetzen, sonst kann der Eintritt scheitern. Alternativ `snps,usb3-warm-reset-on-resume-quirk` aus DTS-Knoten `usbdrd_dwc3_0` und `usbdrd_dwc3_1` entfernen.

2. RK3399-Type-C-Host tritt nicht in Tx ein: Normalerweise genügt das Host-Tx-Verfahren. Bei Fehler VBus prüfen; permanente Versorgung kann den Eintritt verhindern. Methode 1: Softwaregesteuertes VBus, standardmäßig keine 5 V, erst nach Type-C-zu-Type-A-Kabelanschluss. Methode 2: Entsprechendes DTS `dr_mode` auf `"host"` setzen.

3. RK3399-Type-A-Host tritt nicht in Rx-Loopback ein: USB3-Datenträger einsetzen und SuperSpeed im seriellen Protokoll bestätigen, womit die USB3-Unterstützung der Firmware geprüft ist. Datenträger entfernen und Test starten. Ohne diesen Schritt kann Type-A-Loopback scheitern.

4. RK3399-Linux-3.10/4.4-USB3-Host-Tx-Verfahren.

Hinweis: Gilt nur für RK3399.

1. RK3399 Linux 3.10 / frühes Linux 4.4. Für Type-C0 normale/umgekehrte Orientierung erster/zweiter Befehl, für Type-C1 dritter/vierter:

```sh
echo test_u3 > /sys/kernel/debug/usb@fe800000/host_testmode
echo test_flip_u3 > /sys/kernel/debug/usb@fe800000/host_testmode
echo test_u3 > /sys/kernel/debug/usb@fe900000/host_testmode
echo test_flip_u3 > /sys/kernel/debug/usb@fe900000/host_testmode
```

2. RK3399 neueres Linux 4.4: Type-C0 normal/umgekehrt Befehle 1/2, Type-C1 Befehle 3/4. Letzte Abfrage prüft den Eintritt. U2: test_packet bedeutet U2-Testmodus; U3: compliance mode U3-Testmodus; U3: UNKNOWN bedeutet kein Testmodus.

```text
echo test_u3 > /sys/devices/platform/usb0/host_testmode
echo test_flip_u3 > /sys/devices/platform/usb0/host_testmode
echo test_u3 > /sys/devices/platform/usb1/host_testmode
echo test_flip_u3 > /sys/devices/platform/usb1/host_testmode
cat /sys/kernel/debug/usb3 控制器节点/host_testmode
U2: test_packet // means that U2 in test mode
U3: compliance mode // means that U3 in test mode
```

#### 3.4.3 RK1808-USB3-Probleme

1. RK1808-Type-A-USB3-Host tritt nicht in Rx-Loopback ein: Hub-Autosuspend mit folgender Softwareänderung deaktivieren.

```text
diff --git a/drivers/usb/core/usb.c b/drivers/usb/core/usb.c
index 36e5098..0b2930d 100644
--- a/drivers/usb/core/usb.c
+++ b/drivers/usb/core/usb.c
@@ -66,7 +66,7 @@ int usb_disabled(void)
 EXPORT_SYMBOL_GPL(usb_disabled);

 #ifdef CONFIG_PM
-static int usb_autosuspend_delay = 2;          /* Default delay value,
+static int usb_autosuspend_delay = -1;         /* Default delay value,
```

#### 3.4.4 RK3588-USB3-Probleme

Für RK3588-USB3-Tx/Rx-Tests unter Linux 5.10 gelten folgende Hinweise.

1. Vor Type-C0-Device-Tests Controller-Autosuspend deaktivieren:

```text
echo on > /sys/devices/platform/usbdrd3_0/fc000000.usb/power/control
```

2. Für Type-C-Host-Tests zuerst Fixture und Port verbinden, 2–3 Sekunden auf automatischen Host-Wechsel warten und dann den Host-Befehl aus Tabelle 7 eingeben.

3. Bei fehlendem automatischem Rx-Loopback `snps,dis_u3_susphy_quirk;` zur DTS-DWC3-Controllerkonfiguration hinzufügen.

4. Type-C0 Device Tx: `cat /sys/kernel/debug/usb/fc000000.usb/link_state`; `Compliance` bestätigt Testmodus.

5. Type-C0 Device Rx: `cat /sys/kernel/debug/usb/fc000000.usb/link_state`; `Loopback` bestätigt Testmodus.

6. Host Tx am Beispiel Type-C1: `cat sys/kernel/debug/usb/xhci/xhci-hcd.8.auto/ports/port02/portsc`; `Link:Compliance mode` bestätigt Host Tx.

7. Host Rx am Beispiel Type-C1: `cat sys/kernel/debug/usb/xhci/xhci-hcd.8.auto/ports/port02/portsc`; `Link:Test mode` bestätigt Host Rx.

## 4. USB3 HUB Compliance Test

Skriptanmerkungen: Das USB2-Beispiel enthält vier HUBs, wählt HUB[2], dann Port 2 und beendet mit q. Im USB3-Beispiel wählt 0 den SuperSpeed-HUB, danach 1 den port1 (2 port2 usw.); q beendet den Test. Originale Terminalausgabe und chinesische Kommentare bleiben unverändert.

USB3-HUB-Compliance umfasst Upstream- und Downstream-Ports. Praktisch werden meist nur benutzerzugängliche Downstream-Ports geprüft, die hier behandelt werden. Übliche Chips: GL352x, VL812, VL813, USB5734, RTS5411 und CYPRESS HX3. Anders als USB2-HUB-Tests verwendet Rockchip USB3 HUB ausschließlich Skripte.

1. Testskript herunterladen und kompilieren. Quelle: https://redmine.rockchip.com.cn/documents/113 , Datei USB_HUB_Compliance_Test_Script.

2. Skript ausführen: Beispiel GL3523 auf RK3399. (1) Skript per adb nach Android übertragen. (2) linux-eye-Berechtigungen ändern. (3) Für USB3-HUB-Port-Testmodus ausführen. (3.1) Geprüften HUB anhand des Kernelprotokolls identifizieren.

```text
adb push C:\Users\user\Desktop\linux-eye /data
root@rk3399:/data # chmod 777 linux-eye
```

```text
[  139.427845] usb 6-1: new SuperSpeed USB device number 2 using xhci-hcd
[  139.445641] usb 6-1: New USB device found, idVendor=05e3, idProduct=0612
[  139.445708] usb 6-1: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[  139.445738] usb 6-1: Product: USB3.0 Hub
[  139.445763] usb 6-1: Manufacturer: GenesysLogic
[  139.452409] usb 5-1: new high-speed USB device number 2 using xhci-hcd
[  139.463572] hub 6-1:1.0: USB hub found
[  139.465861] hub 6-1:1.0: 4 ports detected
[  139.589854] usb 5-1: New USB device found, idVendor=05e3, idProduct=0610
[  139.589920] usb 5-1: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[  139.589950] usb 5-1: Product: USB2.0 Hub
[  139.589975] usb 5-1: Manufacturer: GenesysLogic
[  139.607244] hub 5-1:1.0: USB hub found
[  139.609146] hub 5-1:1.0: 4 ports detected
```

(3.2) Testskript ausführen.

```text
root@rk3399:/ # ./data/linux-eye

LinuxEye - select one of the following hub for testing.

        [ 0]    4-port Super-Speed hub at tier 2 of Bus 6
                (VID: 05E3, PID: 0612, Address: 2)

        [ 1]    4-port High-Speed hub at tier 2 of Bus 5
                (VID: 05E3, PID: 0610, Address: 2)

    Please enter [0 ~ 1] to select a hub or 'q' to quit: 0 （输⼊0，表⽰测试super-speed）
                [ 1] is open
                [ 2] is open
                [ 3] is open
                [ 4] is open
    Please enter [1 ~ 4] to select a port or 'q' to quit: 1 （输⼊1，表⽰测试USB3 HUB
port1，如果测试port2，则输⼊2，以此类推）
    device file /dev/bus/usb/006/002 opened successfully
           Port (1) Status: 02A0
    LinuxEye - Start testing port 1 of device 2 on bus 6    （开始测试）
                Type 'q' to stop the test: q                （测试结束，输⼊q，退出）
```

(3.3) Für die übrigen USB3-HUB-Downstream-Ports wiederholen.

## 5. Rockchip USB SQ Tool

Rockchip USB SQ Tool ist Rockchips USB-PHY-Signalintegritäts-Debugger. Er zeigt Testbefehle an, passt PHY-Signale dynamisch an und erzeugt PHY-Treibercode aus Tuning-Ergebnissen. Siehe Rockchip_Introduction_USB_SQ_Tool_CN. Download: https://redmine.rockchip.com.cn/documents/113 .

## 6. Referenzen

1. USB 2.0 Specification

2. USB 3.1 Specification

3. Agilent N5416A USB 2.0 Compliance Test Option

4. Agilent USB2.0 High Speed Device SQ Test

5. Keysight N7015A-16A Type-C Test Kit

6. USB 2.0 Electrical Compliance Test Specification Version 1.07

7. Electrical Compliance Test Specification for SuperSpeed USB Rev. 1.0a

{% endraw %}
