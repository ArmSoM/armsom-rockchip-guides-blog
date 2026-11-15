---
title: "rk_sign_tool und sign_tool: Rockchip-Firmware signieren und prüfen"
description: "Signieren bereitet Boot-Dateien für eine Vertrauenskette vor. Das Programmieren eines Schlüsselhashes in OTP/eFuse ist ein eigener Vorgang."
excerpt: "Signieren bereitet Boot-Dateien für eine Vertrauenskette vor. Das Programmieren eines Schlüsselhashes in OTP/eFuse ist ein eigener Vorgang."
translation_key: "rockchip-tool-rk-sign-tool"
slug: "rockchip-tool-rk-sign-tool"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "rk_sign_tool and sign_tool"]
---

{% raw %}

![rk_sign_tool and sign_tool](/assets/rockchip-tools/flows/rk-sign-tool-de.svg)

Signieren bereitet Boot-Dateien für eine Vertrauenskette vor. Das Programmieren eines Schlüsselhashes in OTP/eFuse ist ein eigener Vorgang. Linux 1.42, der ältere Linux-Snapshot und macOS 1.2 haben jeweils eigene Befehle und Grenzen.

## Schlüsselidentität festlegen

Wählen Sie Chip und Schlüsselrichtlinie nach dem SDK. Private Schlüssel gehören weder ins Repository noch in Protokolle. Bewahren Sie unsignierte Eingaben, Ausgabenamen und Schlüsselkennung auf. Ein neuer Schlüssel behebt keine Update-Probleme eines bereits provisionierten Geräts.

## Originalbeispiel

Die Linux-README zeigt RK3326 mit vorhandenem Schlüsselpaar:

```text
rk_sign_tool cc --chip 3326
rk_sign_tool lk --key privateKey.pem --pubkey publicKey.pem
rk_sign_tool sl --loader loader.bin
rk_sign_tool si --img uboot.img
```

Dies bearbeitet lokale Dateien und ist kein allgemeiner RK3576-/RK3588-Ablauf. Das `sign_tool`-PDF beschreibt außerdem `sf`/`vf` für Firmware, `sl`/`vl` für Loader und `si`/`vi` für Abbilder. Prüfen Sie das Ergebnis mit einer unterstützten Verifikationsfunktion.

## Besondere Optionen

`ss --flag=0x20` aktiviert OTP-Schreiben im miniloader. `exclude_boot_sign=true` überspringt bei A/B die automatische boot-Signierung; ein eigener Schritt kann nötig sein. Bei externem Signieren müssen extract/inject-Daten und Signaturen exakt zusammengehören.

Prüfen Sie Chip, Schlüsselidentität und Boot-Kettenabdeckung. Eine korrekte Signatur mit dem falschen Schlüssel scheitert trotzdem. Padding und Format sind plattformabhängig. Vor irreversibler Provisionierung signiertes Update und Recovery prüfen. Es wurden keine Schlüssel erzeugt oder Hardwarezustände verändert.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## Download, Versionen und SHA-256

Passendes Archiv laden, Hash prüfen und den vollständigen Ordner entpacken. Linux PinDebug zuerst nach verlinkter Anleitung zusammensetzen; der angegebene Hash gehört zur vollständigen Datei.

| Host / Version | Paket |
|---|---|
| Linux / 1.42 | [rk_sign_tool_v1.42_linux.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/rk_sign_tool_v1.42_linux.zip) |
| Linux / directory snapshot | [rk_sign_tool-linux-directory-snapshot.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/rk_sign_tool-linux-directory-snapshot.zip) |
| macOS / 1.2 | [sign_tool_v1.2_mac.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/sign_tool_v1.2_mac.zip) |

**rk_sign_tool_v1.42_linux.zip — SHA-256**

```text
799a0fad6e363b141e244580479ed8434e05c070d924db8a289e277e50a7ca1d
```

**rk_sign_tool-linux-directory-snapshot.zip — SHA-256**

```text
db3cd185e5e38b886be0a162a92d3400368acfb5684744b8e91af5ef9cdeb06e
```

**sign_tool_v1.2_mac.zip — SHA-256**

```text
30ee08cb35681b735f1636bcc9215af64c4b6b5ca303a0889509be32209ea8ed
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- rk_sign_tool/readme.txt; sign_tool用户使用手册.pdf V1.0; package revision notes
- [Original-PDF: sign_tool用户使用手册.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/8528f18eea87.pdf)

## Verwandte Arbeitsabläufe

- [Vollständiger Rockchip-Secure-Boot-Leitfaden: Signierung, eFuse, OTP und Prüfung](/de/articles/105-rockchip-secure-boot/)
- [Entwicklerleitfaden für Rockchip Linux Secure Boot](/de/articles/203-rockchip-linux-secure-boot/)
- [EfuseTool 1.42: eine nachvollziehbare Provisionierungsstation vorbereiten](/de/articles/rockchip-tool-efuse-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
