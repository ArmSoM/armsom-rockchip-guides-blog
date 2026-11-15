---
title: "Linux SecurityAVB: Schlüssel, Boot-Signaturen und Versionsgrenzen"
description: "Dieses AVB-Paket beschreibt einen älteren Ansatz mit Zertifikaten und permanenten Attributen."
excerpt: "Dieses AVB-Paket beschreibt einen älteren Ansatz mit Zertifikaten und permanenten Attributen."
translation_key: "rockchip-tool-linux-avb"
slug: "rockchip-tool-linux-avb"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "Linux SecurityAVB"]
---

{% raw %}

![Linux SecurityAVB](/assets/rockchip-tools/flows/linux-avb-de.svg)

Dieses AVB-Paket beschreibt einen älteren Ansatz mit Zertifikaten und permanenten Attributen. Es dient der Pflege des entsprechenden BSPs und ersetzt nicht automatisch moderne Verified-Boot-Implementierungen.

## Skriptschnittstelle prüfen

Beginnen Sie mit Quelltext und Hilfe:

```text
./avb_user_tool.sh -h
```

`-n` erwartet eine 16-Byte-Produktkennung und erzeugt Schlüssel, löscht jedoch zuvor einen vorhandenen Ordner `avb_keys`. Nicht in einem Verzeichnis mit benötigten Schlüsseln ausführen. `-f` bereitet Attribute mit dem Secure-Boot-Schlüssel vor, `-s` signiert boot/recovery, `-d` programmiert permanente Attribute und `-l`/`-u` sperrt/entsperrt das Gerät.

## Eingaben isolieren

Das ausgelieferte Paket enthält den ursprünglichen Beispielschlüsselordner nicht. Erzeugen und schützen Sie projektspezifische Schlüssel. PRK, PIK, PSK, PUK, Zertifikate und Produktkennung müssen zusammenpassen. Prüfen Sie Python-/OpenSSL-Kompatibilität des historischen Skripts.

Die Partitionsgröße muss auf 4096 Byte ausgerichtet sein und AVB-Metadaten aufnehmen; die Fehlermeldung nennt 68K Reserve. Prüfen Sie die Berechnung, statt Abbilder für eine erfolgreiche Signatur abzuschneiden. Authentisierung ist keine Dateisystemverschlüsselung.

V2.2.5 beschreibt eine 4M-security-Partition und ältere OP-TEE-Verfahren. Neuere Dokumentation gehört zu anderen SDKs. Vor dauerhafter Provisionierung Fehlerpfad, signierte Updates und Recovery testen. Produktionsschlüssel und Hardwaretests sind nicht Bestandteil dieses Beitrags.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## Download, Versionen und SHA-256

Passendes Archiv laden, Hash prüfen und den vollständigen Ordner entpacken. Linux PinDebug zuerst nach verlinkter Anleitung zusammensetzen; der angegebene Hash gehört zur vollständigen Datei.

| Host / Version | Paket |
|---|---|
| Linux / manual 2.2.5 | [linux-security-avb-without-keys.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/linux-avb/linux-security-avb-without-keys.zip) |

**linux-security-avb-without-keys.zip — SHA-256**

```text
fc7eae22caeadd51d85723b65451c70e88475a2c9ba7e7f5394ca1314688d17d
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- Rockchip_User_Manual_Linux_AVB_EN.pdf V2.2.5; avb_user_tool.sh
- [Original-PDF: Rockchip_User_Manual_Linux_AVB_EN.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/50f19e52844b.pdf)

## Verwandte Arbeitsabläufe

- [Entwicklerleitfaden für Rockchip Linux Secure Boot](/de/articles/203-rockchip-linux-secure-boot/)
- [Rockchip U-Boot Nextdev: Boot, Treiber, SPL/TPL, FIT und Sicherheitsprüfung](/de/articles/157-rockchip-uboot-nextdev/)
- [rk_sign_tool und sign_tool: Rockchip-Firmware signieren und prüfen](/de/articles/rockchip-tool-rk-sign-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
