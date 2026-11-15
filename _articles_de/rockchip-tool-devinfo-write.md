---
title: "RKDevInfoWriteTool: Seriennummern und MAC-Adressen kontrolliert schreiben"
description: "RKDevInfoWriteTool enthält Felder für SN, Wi-Fi, LAN, Bluetooth und Sicherheitsdaten. Ein sichtbares Feld belegt keine Board-Unterstützung."
excerpt: "RKDevInfoWriteTool enthält Felder für SN, Wi-Fi, LAN, Bluetooth und Sicherheitsdaten. Ein sichtbares Feld belegt keine Board-Unterstützung."
translation_key: "rockchip-tool-devinfo-write"
slug: "rockchip-tool-devinfo-write"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "RKDevInfoWriteTool"]
---

{% raw %}

![RKDevInfoWriteTool](/assets/rockchip-tools/flows/devinfo-write-de.svg)

RKDevInfoWriteTool enthält Felder für SN, Wi-Fi, LAN, Bluetooth und Sicherheitsdaten. Ein sichtbares Feld belegt keine Board-Unterstützung. Identitätsvergabe und Sicherheitsprovisionierung gehören in getrennte Abläufe.

## Bereinigtes Paket

Alte Protokolle, gespeicherte Konfiguration und `DEVNAME.bin` wurden entfernt; Programmdateien bleiben unverändert. Erstellen Sie eine neue Stationskonfiguration. Ressourcen bestätigen Read, Write, Single, Loader, Test und Reboot; ein vollständiges PDF fehlt. Das Speicherverhalten muss der BSP belegen.

## Vergabe dokumentieren

Definieren Sie Verantwortlichkeit, erlaubte Nummernbereiche und Duplikatprüfung. Verwenden Sie für das Produkt zulässige MAC-Zuteilungen. Kundendaten und Vergabelisten bleiben privat; Beispielwerte dürfen nicht für eine Serie wiederverwendet werden.

Prüfen Sie Board und Firmware, aktivieren Sie nur benötigte unterstützte Felder und testen Sie ein einzelnes Muster vor der Automatisierung. Lesen Sie Werte zurück, soweit unterstützt, und prüfen Sie sie über OS/API sowie nach einem Neustart.

## Fehler behandeln

Protokollieren Sie verbrauchte IDs, Status und Rückleseergebnis. Nach Timeout zuerst klären, ob geschrieben wurde. `ForceWrite`, Löschen, RPMB und Sperroptionen sind keine Standardlösung für SN-Fehler; dafür gelten eigene Verfahren. Kundendaten und Lizenzschlüssel sind nicht im Download enthalten.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## Download, Versionen und SHA-256

Passendes Archiv laden, Hash prüfen und den vollständigen Ordner entpacken. Linux PinDebug zuerst nach verlinkter Anleitung zusammensetzen; der angegebene Hash gehört zur vollständigen Datei.

| Host / Version | Paket |
|---|---|
| Windows / 1.3.7 | [RKDevInfoWriteTool-v1.3.7-clean.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/devinfo-write/RKDevInfoWriteTool-v1.3.7-clean.zip) |

**RKDevInfoWriteTool-v1.3.7-clean.zip — SHA-256**

```text
66a3a94142470356adc8c7e3a2b9ba2deee60fd3bb7bcbba9c196c2534eb6f3a
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- RKDevInfoWriteTool-v1.3.7.zip: English.ini, configuration UI resources and packaging inventory

## Verwandte Arbeitsabläufe

- [HDCP Key Writer: autorisierte Schlüssel verpacken und provisionieren](/de/articles/rockchip-tool-hdcp-key-writer/)
- [RKPCBATool 1.2.1: Linux-Boardtests und manuelle Prüfungen konfigurieren](/de/articles/rockchip-tool-pcba-tool/)
- [EfuseTool 1.42: eine nachvollziehbare Provisionierungsstation vorbereiten](/de/articles/rockchip-tool-efuse-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
