---
title: "PinDebug: IOMUX, GPIO und Spannungsdomänen auf Rockchip prüfen"
description: "PinDebug verbindet die geplante Pinbelegung mit aktuellen Board-Registern. Damit lässt sich etwa ein noch als GPIO konfigurierter Schnittstellenpin finden."
excerpt: "PinDebug verbindet die geplante Pinbelegung mit aktuellen Board-Registern. Damit lässt sich etwa ein noch als GPIO konfigurierter Schnittstellenpin finden."
translation_key: "rockchip-tool-pin-debug"
slug: "rockchip-tool-pin-debug"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "PinDebug"]
---

{% raw %}

![PinDebug](/assets/rockchip-tools/flows/pin-debug-de.svg)

## Vollständiger PinDebug-V1.1-Ablauf

Das Handbuch nennt RK3588, RK3566, RK3568, RV1126, RV1109, RV1106, RV1103 und RK3528. PinDebug liest IOMUX und konfiguriert Pin-Eigenschaften; Windows 1.18 und Linux 1.11 können andere Oberflächen haben. Es folgen die Quellabschnitte 1.1–1.11 mit chinesischen Originalabbildungen.

### 1.1 Projekt öffnen

Vor jedem Vorgang den SoC wählen. Die Pin-Seite zeigt Multiplexfunktionen nach Pin/GPIO: Function-Suche, Rechtsklick zum Ausgeben des Einstellbefehls, Doppelklick bei verbundenem Gerät zum direkten Anwenden. Pin- und IO-Nummern sind sortierbar. IOmux gruppiert die steuerbaren Signale nach Modul.

### 1.2 Gerät verbinden

Die Kommunikation erfolgt über ADB. Projekt öffnen, ADB am Gerät aktivieren, den Rechner verbinden und das Verbindungssymbol anklicken.

### 1.3 IOMUX lesen

Alle IOMUX-Register lesen, um Pin und IOmux zu aktualisieren. Offline-Definitionen ersetzen keine tatsächlichen Gerätewerte.

### 1.4 IOMUX ändern

Aktivieren eines Funktions-IO in IOmux wählt diese Funktion; Deaktivieren wählt GPIO. Bei Konflikten lässt sich die Änderung abbrechen oder bestätigen.

### 1.5 Pull- und Treiberstärke

Einen aktivierten Funktions-IO markieren und per Rechtsklick Pull-Einstellung und Treiberstärke lesen oder ändern. Die Vorlage zeigt EMMC_CLKOUT; vor Änderungen die Nutzung durch den Speichercontroller prüfen.

### 1.6 GPIO-Daten lesen und ändern

Das Beispiel verwendet GPIO1C3. Das GPIO-Häkchen zeigt den GPIO-Modus; Richtung stammt aus GPIO `ddr`, Ausgangspegel aus `dr`, IO-Spannung aus PMU `vsel`, Portpegel aus `ext_port`. `ddr` ist hier ein Richtungsregister, kein DDR-Speicher.

### 1.7 Regulator-Daten lesen

Das Werkzeug liest den regulator-summary-Knoten per `cat` und wertet alle Domains aus. Das Handbuch nennt keinen vollständigen Knotenpfad.

### 1.8 Spannungsdomänen-Auswahl lesen

Das Spannungswahlregister wird als Domain-Liste dargestellt. Abschnitt 1.8 schreibt `vesl`, Abschnitt 1.6 `vsel`; diese Abweichung bleibt dokumentiert. Ein Auswahlwert ist keine gemessene Spannung.

### 1.9 IOmux prüfen

Ausgewählte IOs je Modul ausgeben, um bei mehreren Modi die tatsächlich aktive Gruppe zu bestimmen.

### 1.10 GPIO-Konfiguration exportieren

Nach dem Öffnen eines Projekts die GPIO-Konfiguration als Excel-Tabelle exportieren. Den SoC festhalten und statische Definitionen von gelesenen Gerätewerten unterscheiden.

### 1.11 GPIO-Befehle offline nachschlagen

Bei geöffnetem Projekt lassen sich IOMUX-, Pull-, Treiberstärke- und Schmitt-Trigger-Befehle ohne Gerät nachschlagen. `help` zeigt die Syntax; die Vorlage demonstriert `gpio0a0`. Erzeugte Befehle bestätigen keine Eignung für die Trägerbeschaltung.

### Aus dem Screenshot übertragene Offline-Suchsyntax

Im Suchfeld des Werkzeugs eingeben, nicht in einer Shell. Reguläre Ausdrücke werden unterstützt. Export- und Suchbeispiele zeigen unterschiedliche Registeradressen; nicht zu einer Boardkonfiguration vermischen.

```text
gpio [mux|pull|ds|smt|ddr|dr]
gpio0a0
gpio0a0 mux
gpio0a0 pull
gpio0a0 ds
gpio0a0 smt
gpio0a0 ddr
gpio0a0 dr
gpio0a0 ddr|dr
```

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## GitHub-Werkzeugverzeichnis, Versionen und SHA-256

Das passende GitHub-Verzeichnis öffnen, Host und Version wählen, Dateihash prüfen und vollständig entpacken. Die folgenden Links öffnen Repository-Verzeichnisse.

[Werkzeugverzeichnis auf GitHub öffnen](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/pin-debug)

| Plattform / Version | Datei | SHA-256 |
|---|---|---|
| Linux / 1.11 | `pin_debug_tool_v1.11_for_linux.tar.gz` | `16cb25b8fc2533e8f730a790c7486ab5042baa964b3bdb95a161ddce143c4a34` |
| Windows / 1.18 | `pin_debug_tool_v1.18_20250322_win.zip` | `88c550ee9a578eaa451a9b8a05b3d088247dc63dd9bd426b832191994dc6a7d5` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- PinDebug_UserManual.pdf

### Originaloberflächen und Diagramme des Handbuchs

Oberflächen behalten ihre Quellsprache. Englische Originale werden verwendet, soweit vorhanden; zusätzliche Ansichten ohne englische Vorlage bleiben chinesisch. Werte sind Handbuchbeispiele, keine aktuellen Boardmessungen.

![Originalabbildung des Handbuchs: pin-debug · p. 2 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p02-f01.png)

PinDebug_UserManual.pdf · p. 2

![Originalabbildung des Handbuchs: pin-debug · p. 2 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p02-f02.png)

PinDebug_UserManual.pdf · p. 2

![Originalabbildung des Handbuchs: pin-debug · p. 3 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f01.png)

PinDebug_UserManual.pdf · p. 3

![Originalabbildung des Handbuchs: pin-debug · p. 3 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f02.png)

PinDebug_UserManual.pdf · p. 3

![Originalabbildung des Handbuchs: pin-debug · p. 3 · 3](/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f03.png)

PinDebug_UserManual.pdf · p. 3

![Originalabbildung des Handbuchs: pin-debug · p. 4 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p04-f01.png)

PinDebug_UserManual.pdf · p. 4

![Originalabbildung des Handbuchs: pin-debug · p. 4 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p04-f02.png)

PinDebug_UserManual.pdf · p. 4

![Originalabbildung des Handbuchs: pin-debug · p. 5 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f01.png)

PinDebug_UserManual.pdf · p. 5

![Originalabbildung des Handbuchs: pin-debug · p. 5 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f02.png)

PinDebug_UserManual.pdf · p. 5

![Originalabbildung des Handbuchs: pin-debug · p. 5 · 3](/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f03.png)

PinDebug_UserManual.pdf · p. 5

![Originalabbildung des Handbuchs: pin-debug · p. 6 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f01.png)

PinDebug_UserManual.pdf · p. 6

![Originalabbildung des Handbuchs: pin-debug · p. 6 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f02.png)

PinDebug_UserManual.pdf · p. 6

![Originalabbildung des Handbuchs: pin-debug · p. 6 · 3](/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f03.png)

PinDebug_UserManual.pdf · p. 6

![Originalabbildung des Handbuchs: pin-debug · p. 7 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f01.png)

PinDebug_UserManual.pdf · p. 7

![Originalabbildung des Handbuchs: pin-debug · p. 7 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f02.png)

PinDebug_UserManual.pdf · p. 7

![Originalabbildung des Handbuchs: pin-debug · p. 7 · 3](/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f03.png)

PinDebug_UserManual.pdf · p. 7

![Originalabbildung des Handbuchs: pin-debug · p. 7 · 4](/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f04.png)

PinDebug_UserManual.pdf · p. 7

![Originalabbildung des Handbuchs: pin-debug · p. 8 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p08-f01.png)

PinDebug_UserManual.pdf · p. 8

![Originalabbildung des Handbuchs: pin-debug · p. 8 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p08-f02.png)

PinDebug_UserManual.pdf · p. 8

![Originalabbildung des Handbuchs: pin-debug · p. 9 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p09-f01.png)

PinDebug_UserManual.pdf · p. 9

![Originalabbildung des Handbuchs: pin-debug · p. 9 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p09-f02.png)

PinDebug_UserManual.pdf · p. 9

## Verwandte Arbeitsabläufe

- [Rockchip Linux Pinctrl: vollständiger Leitfaden zu GPIO, IOMUX, Treiberstärke und DTS](/de/articles/116-rockchip-linux-pinctrl/)
- [USB SQ Tool 1.5: vom Augendiagramm zur USB-PHY-Konfiguration](/de/articles/rockchip-tool-usb-sq-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
