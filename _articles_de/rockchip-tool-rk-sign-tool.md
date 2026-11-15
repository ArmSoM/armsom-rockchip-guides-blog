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

## sign_tool V1.0: Signieren, Prüfen und externes Signieren

Dieser Abschnitt überträgt das vollständige mitgelieferte Signierhandbuch. Beispiele verwenden `sign_tool`, ohne identische Optionen aller `rk_sign_tool`-Versionen zu behaupten. Signieren ist vom OTP/eFuse-Programmieren zu unterscheiden. Flag `0x20` aktiviert ausdrücklich OTP-Schreiben durch den miniloader und muss zum konkreten Secure-Boot-Konzept passen.

| SoC | Digest | Signature | Padding |
|---|---|---|---|
| 3229, 3228h, 3368, 3228, 3288, 3399, 3328 | SHA256 | RSA2048 | NOPADD |
| 3588, 3566, 3568, 3308, 3326, px30, 1808, 3228P, 1109, 1126, 2206 | SHA256 | RSA2048 | PSSPADD |

### 1. Vorbereitung

RSA2048-Schlüsselpaar mit `--bits=2048` oder dem Quellenstandard erzeugen. Chip auswählen und privaten/öffentlichen Schlüssel laden. Die Auswahl wird gespeichert und muss bei unveränderter Konfiguration nicht wiederholt werden. `1126` und Dateinamen sind Beispiele.

```text
sign_tool kk --bits=2048
sign_tool kk
sign_tool cc --chip=1126
sign_tool.exe lk --key private_key.pem --pubkey public_key.pem
```

Optionale Signierflags und Zwischenablageverzeichnis folgen. Das Verzeichnis dient auch als Eingabe beim externen Signieren. Die beiden `kk`-Befehle sind Alternativen, keine Aufforderung zur zweimaligen Schlüsselerzeugung.

```text
sign_tool ss --flag=0x20
sign_tool ss --out .\data_out
```

### 2. Fünf Objekttypen signieren und prüfen

Ein vollständiges Update-Abbild wird entpackt, seine loader/uboot/boot/trust-Komponenten signiert und neu gepackt; dies dauert länger. Bei A/B darf das Werkzeug boot nicht signieren: `exclude_boot_sign=true` in `setting.ini` setzen. Loader-Signierung fügt Sicherheitsstrukturen beim Entpacken/Packen ein. IDBlock entsteht durch mkimage und enthält Boot-Strukturen, DDR-Initialisierung und Boot-Code. DDR-Testkonfigurationen und uboot/trust/boot-Abbilder haben eigene Befehle.

```text
sign_tool sf --firmware update.img
sign_tool vf --firmware update.img

sign_tool sl --loader miniloader.bin
sign_tool vl --loader miniloader.bin

sign_tool sb --idb 1126_idblock.bin
sign_tool vb --idb 1126_idblock.bin

sign_tool sd --cfg 1126_ddr_test.cfg
sign_tool vd --cfg 1126_ddr_test.cfg

sign_tool si --img uboot.img
sign_tool vi --img uboot.img
```

### 3.1 Zu signierende Daten extrahieren

Für die Extraktion genügt der öffentliche Schlüssel. Extract und Ausgabeverzeichnis setzen und dann einen Signiervorgang aus Abschnitt 2 ausführen; das Beispiel verwendet update.img.

```text
sign_tool ss --extract
sign_tool ss --out wait_sign_dir
sign_tool sf --firmware update.img
```

### 3.2 Extern signieren

Alle Dateien privat signieren und die Ergebnisse unter den ursprünglichen Namen nach `wait_sign_dir` zurücklegen. Das PSS-Beispiel ist mit unveränderten Argumenten zu einer Befehlszeile zusammengeführt. Für NOPADD einen nullgefüllten 256-Byte-Puffer anlegen, den SHA256-Digest in die letzten 32 Bytes kopieren und den zweiten Befehl ausführen. Algorithmus gemäß Chiptabelle wählen.

```text
openssl pkeyutl -sign -in to_sign.bin -inkey privatekey.pem -out signed.bin -pkeyopt digest:sha256 -pkeyopt rsa_padding_mode:pss -pkeyopt rsa_pss_saltlen:-1

openssl rsautl -sign -in to_sign.bin -inkey privatekey.pem -raw -out signed.bin
```

### 3.3 Signaturen einsetzen

```text
sign_tool ss --inject
sign_tool sf --firmware update.img
```

Das Werkzeug liest die Signaturen aus dem zuvor eingestellten Verzeichnis und setzt sie an den passenden Stellen ein. Anschließend mit dem entsprechenden `v*`-Befehl prüfen. Für diesen Beitrag wurden weder Signierung noch OTP-Programmierung oder Geräte-Flashen ausgeführt.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## GitHub-Werkzeugverzeichnis, Versionen und SHA-256

Das passende GitHub-Verzeichnis öffnen, Host und Version wählen, Dateihash prüfen und vollständig entpacken. Die folgenden Links öffnen Repository-Verzeichnisse.

[Werkzeugverzeichnis auf GitHub öffnen](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/rk-sign-tool)

| Plattform / Version | Datei | SHA-256 |
|---|---|---|
| Linux / 1.42 | `rk_sign_tool_v1.42_linux.zip` | `799a0fad6e363b141e244580479ed8434e05c070d924db8a289e277e50a7ca1d` |
| Linux / directory snapshot | `rk_sign_tool-linux-directory-snapshot.zip` | `db3cd185e5e38b886be0a162a92d3400368acfb5684744b8e91af5ef9cdeb06e` |
| macOS / 1.2 | `sign_tool_v1.2_mac.zip` | `30ee08cb35681b735f1636bcc9215af64c4b6b5ca303a0889509be32209ea8ed` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- sign_tool用户使用手册.pdf

## Verwandte Arbeitsabläufe

- [Vollständiger Rockchip-Secure-Boot-Leitfaden: Signierung, eFuse, OTP und Prüfung](/de/articles/105-rockchip-secure-boot/)
- [Entwicklerleitfaden für Rockchip Linux Secure Boot](/de/articles/203-rockchip-linux-secure-boot/)
- [EfuseTool 1.42: eine nachvollziehbare Provisionierungsstation vorbereiten](/de/articles/rockchip-tool-efuse-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
