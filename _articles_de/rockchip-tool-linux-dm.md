---
title: "Linux SecurityDM: dm-verity und verschlüsselte Rootfs-Abbilder"
description: "Linux SecurityDM 1.01 enthält das historische mkdm.sh, Konfiguration, Boot-Image-Werkzeuge und ein verschachteltes Ramdisk-Archiv. dmv, fde, fde-s und ramdisk erfüllen unterschiedliche Integritäts-, Verschlüsselungs- und Verpackungsaufgaben."
excerpt: "Linux SecurityDM 1.01 enthält das historische mkdm.sh, Konfiguration, Boot-Image-Werkzeuge und ein verschachteltes Ramdisk-Archiv. dmv, fde, fde-s und ramdisk erfüllen unterschiedliche Integritäts-, Verschlüsselungs- und Verpackungsaufgaben."
translation_key: "rockchip-tool-linux-dm"
slug: "rockchip-tool-linux-dm"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "Linux SecurityDM"]
---

{% raw %}

![Linux SecurityDM](/assets/rockchip-tools/flows/linux-dm-de.svg)

Linux SecurityDM 1.01 enthält das historische `mkdm.sh`, Konfiguration, Boot-Image-Werkzeuge und ein verschachteltes Ramdisk-Archiv. `dmv`, `fde`, `fde-s` und `ramdisk` erfüllen unterschiedliche Integritäts-, Verschlüsselungs- und Verpackungsaufgaben.

## Schnittstelle prüfen

Lesen Sie vor echten Abbildern Skript, Ramdisk-Inhalt und Hilfe:

```text
./mkdm.sh --help
```

`-d` bezeichnet die Root-Partition, `-s` ein schreibgeschütztes Systemabbild, `-k` Kernel, `-r` resource, `-c` Konfiguration und `-m` Modus. Lange Optionen betreffen Pfade, Dateisystem und Größe. Verwenden Sie Werte des passenden BSPs.

Sichern Sie Rootfs, Kernel und resource. Entscheiden Sie zwischen Integritätsprüfung und Verschlüsselung. `dmv` erwartet ein schreibgeschütztes Dateisystem; verschlüsselte Abläufe dürfen nicht ungeprüft komprimierte Eingaben verwenden.

Das Skript kann privilegierte Mount-, Loop- und `dmsetup`-Operationen ausführen und Schlüsselparameter ausgeben. Verwenden Sie einen kontrollierten Build-Host, Testwerte und bereinigte Protokolle.

## Boot-Abhängigkeiten testen

Kernel, Ramdisk/init, Mapping und Rootfs müssen übereinstimmen. Testen Sie normalen Start, beschädigte Daten, Wiederherstellung und Updates zunächst ohne Produktionsmaterial. Ein erzeugtes Abbild beweist keine aktivierte Board-Sicherheit. Archivieren Sie alle Eingaben und Hashes.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## GitHub-Werkzeugverzeichnis, Versionen und SHA-256

Das passende GitHub-Verzeichnis öffnen, Host und Version wählen, Dateihash prüfen und vollständig entpacken. Die folgenden Links öffnen Repository-Verzeichnisse.

[Werkzeugverzeichnis auf GitHub öffnen](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/linux-dm)

| Plattform / Version | Datei | SHA-256 |
|---|---|---|
| Linux / 1.01 | `Linux_SecurityDM_v1_01.tar.gz` | `2db8bc9618a326f624e5bc519f95ac00ec33df6db47ba82ab446367fa4de5912` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- Linux_SecurityDM_v1_01.tar.gz: mkdm.sh, configuration and nested ramdisk archive

## Verwandte Arbeitsabläufe

- [Linux SecurityAVB: Schlüssel, Boot-Signaturen und Versionsgrenzen](/de/articles/rockchip-tool-linux-avb/)
- [Entwicklerleitfaden für Rockchip Linux Secure Boot](/de/articles/203-rockchip-linux-secure-boot/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
