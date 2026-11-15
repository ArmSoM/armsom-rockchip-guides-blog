---
title: "DriverAssitant 5.13: Rockusb- und ADB-Treiber unter Windows"
description: "DriverAssitant installiert und entfernt Rockchip-USB-Treiber. Das Werkzeug bereitet den Host vor; es schreibt selbst keine Firmware."
excerpt: "DriverAssitant installiert und entfernt Rockchip-USB-Treiber. Das Werkzeug bereitet den Host vor; es schreibt selbst keine Firmware."
translation_key: "rockchip-tool-driver-assistant"
slug: "rockchip-tool-driver-assistant"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "DriverAssitant"]
---

{% raw %}

![DriverAssitant](/assets/rockchip-tools/flows/driver-assistant-de.svg)

DriverAssitant installiert und entfernt Rockchip-USB-Treiber. Das Werkzeug bereitet den Host vor; es schreibt selbst keine Firmware. Eine falsche Treiberzuordnung verhindert die Kommunikation mit RKDevTool.

## Paket und Plattform prüfen

Lassen Sie die Treiberordner beim Installationsprogramm. Die README empfiehlt, beim Versionswechsel zuerst den alten Treiber zu deinstallieren. Für die Installation sind passende Administratorrechte erforderlich; deaktivieren Sie keine Schutzfunktionen, um einen inkompatiblen Treiber zu erzwingen.

Die historische README nennt Windows XP, 7, 8 und 10 mit 32-/64-Bit-Varianten. Das bestätigt weder Windows 11 noch Windows on Arm. Prüfen Sie Architektur und Signatur der tatsächlich enthaltenen Treiber.

## Ablauf

1. Notieren Sie vorher Anbieter und Namen des vorhandenen Treibers im Geräte-Manager.
2. Entfernen Sie beim Austausch den alten Rockchip-Treiber gemäß Paketanleitung und installieren Sie den neuen.
3. Verbinden Sie zunächst ein Board am vorgesehenen Datenanschluss. Rockusb benötigt Loader oder Maskrom.
4. Prüfen Sie USB-Fehler im Geräte-Manager und anschließend die Erkennung in RKDevTool oder mit `upgrade_tool ld`.
5. ADB benötigt ein gestartetes System mit aktiviertem und autorisiertem ADB. Der Rockusb-Treiber ergänzt keinen ADB-Dienst in der Firmware.

## Fehler eingrenzen

Ein reines Ladekabel, der falsche Anschluss, unzureichende Versorgung oder der falsche Boot-Modus können ebenfalls die Ursache sein. Erkennt Windows das Gerät, die Anwendung aber nicht, prüfen Sie Treiberbindung und Werkzeugversion. ADB-Autorisierung betrifft das laufende System; Maskrom betrifft den Boot-Pfad.

Dokumentieren Sie Paketversion, Windows-Build und Architektur, USB-Controller, Board-Modus und Treibernamen. Prüfen Sie ein Board, bevor Sie mehrere über einen Hub verbinden. Während der Artikelvorbereitung wurde kein Treiber installiert.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## Download, Versionen und SHA-256

Passendes Archiv laden, Hash prüfen und den vollständigen Ordner entpacken. Linux PinDebug zuerst nach verlinkter Anleitung zusammensetzen; der angegebene Hash gehört zur vollständigen Datei.

| Host / Version | Paket |
|---|---|
| Windows / 5.13 | [DriverAssitant_v5.13.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/driver-assistant/DriverAssitant_v5.13.zip) |

**DriverAssitant_v5.13.zip — SHA-256**

```text
b2cabce5ab23551d8649c1201ef741fd73c8326044b78edac5439f013f034ff9
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- DriverAssitant_v5.13.zip: Readme and packaged driver directories

## Verwandte Arbeitsabläufe

- [RKDevTool: Download, Loader, Partitionen und update.img](/de/articles/rockchip-tool-rkdevtool/)
- [upgrade_tool: Rockchip-Firmware per Kommandozeile schreiben](/de/articles/rockchip-tool-upgrade-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
