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

PinDebug verbindet die geplante Pinbelegung mit aktuellen Board-Registern. Damit lässt sich etwa ein noch als GPIO konfigurierter Schnittstellenpin finden. Handbuchversion ist V1.1, die Pakete tragen Linux 1.11 und Windows 1.18.

## Offline beginnen

Öffnen Sie zuerst ein Projekt für den richtigen SoC. Das Handbuch nennt RK3588, RK3566/3568, RV1126/1109, RV1106/1103 und RK3528; daraus folgt keine RK3576- oder allgemeine ArmSoM-Unterstützung. Pin- und IOMUX-Ansichten erleichtern unterschiedliche Suchaufgaben. Per Rechtsklick lässt sich ein I/O-Befehl zur Prüfung anzeigen.

## Laufendes Board auslesen

Verwenden Sie einen passenden BSP mit benötigtem ADB-/Debug-Zugriff. Lesen Sie die IOMUX-Register und vergleichen Sie sie mit Schaltplan und DTS. Sichern Sie Ausgangswerte. Ein Doppelklick kann bei bestehender Verbindung schreiben und ist dann keine reine Offline-Ansicht.

## GPIO-Werte verstehen

`ddr` bezeichnet hier GPIO-Richtung, nicht Arbeitsspeicher; `dr` die Ausgangsdaten und `ext_port` den beobachteten Pegel. Hinzu kommen Pull-Konfiguration, Treiberstärke und `vsel`. Prüfen Sie vor elektrischen Änderungen Spannungsdomänen und externe Schaltung.

## Dauerhaft korrigieren

Übertragen Sie die ermittelte Konfiguration in pinctrl/DTS oder den BSP-Treiber. Laufzeitregister können nach Neustart verschwinden oder vom Treiber überschrieben werden. Exportieren Sie gegebenenfalls die GPIO-Tabelle und prüfen Sie Kaltstart, Suspend/Resume und Peripherie.

Das Linux-Archiv muss aus zwei Teilen zusammengesetzt werden. Ohne englisches Original bleiben chinesische Abbildungen erhalten. Es wurden keine Register geschrieben oder Spannungen verändert.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## Download, Versionen und SHA-256

Passendes Archiv laden, Hash prüfen und den vollständigen Ordner entpacken. Linux PinDebug zuerst nach verlinkter Anleitung zusammensetzen; der angegebene Hash gehört zur vollständigen Datei.

| Host / Version | Paket |
|---|---|
| Linux / 1.11 | [pin_debug_tool_v1.11_for_linux.tar.gz](https://github.com/ArmSoM/rockchip-tools/blob/main/downloads/pin-debug/README.md) |
| Windows / 1.18 | [pin_debug_tool_v1.18_20250322_win.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/pin-debug/pin_debug_tool_v1.18_20250322_win.zip) |

**pin_debug_tool_v1.11_for_linux.tar.gz — SHA-256**

```text
16cb25b8fc2533e8f730a790c7486ab5042baa964b3bdb95a161ddce143c4a34
```

**pin_debug_tool_v1.18_20250322_win.zip — SHA-256**

```text
88c550ee9a578eaa451a9b8a05b3d088247dc63dd9bd426b832191994dc6a7d5
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- PinDebug_UserManual.pdf V1.1; Linux 1.11 and Windows 1.18 packages
- [Original-PDF: PinDebug_UserManual.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/1cae2e2c0777.pdf)

Abbildungen stammen aus den angegebenen PDFs. Existiert nur eine chinesische Vorlage, bleiben deren Oberflächentexte erhalten; Bildunterschriften sind übersetzt. Es sind historische Beispiele, keine ArmSoM-Testergebnisse.

![Abbildung aus dem Originalhandbuch · PinDebug](/assets/rockchip-tools/pin-debug/zh-p02-01.png)

PinDebug_UserManual.pdf · p. 2

![Abbildung aus dem Originalhandbuch · PinDebug](/assets/rockchip-tools/pin-debug/zh-p02-02.png)

PinDebug_UserManual.pdf · p. 2

![Abbildung aus dem Originalhandbuch · PinDebug](/assets/rockchip-tools/pin-debug/zh-p03-01.png)

PinDebug_UserManual.pdf · p. 3

## Verwandte Arbeitsabläufe

- [Rockchip Linux Pinctrl: vollständiger Leitfaden zu GPIO, IOMUX, Treiberstärke und DTS](/de/articles/116-rockchip-linux-pinctrl/)
- [USB SQ Tool 1.5: vom Augendiagramm zur USB-PHY-Konfiguration](/de/articles/rockchip-tool-usb-sq-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
