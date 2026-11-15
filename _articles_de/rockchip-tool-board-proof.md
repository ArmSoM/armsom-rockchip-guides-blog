---
title: "BoardProofTool 1.01: Download und vollständige CPU-ID prüfen"
description: "Das Windows-Paket enthält ProofDll.dll, RKUpgrade_DLL.dll und Qt. Version 1.01 korrigiert laut Historie den Verlust des letzten CPU-ID-Bytes."
excerpt: "Das Windows-Paket enthält ProofDll.dll, RKUpgrade_DLL.dll und Qt. Version 1.01 korrigiert laut Historie den Verlust des letzten CPU-ID-Bytes."
translation_key: "rockchip-tool-board-proof"
slug: "rockchip-tool-board-proof"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "BoardProofTool"]
---

{% raw %}

![BoardProofTool](/assets/rockchip-tools/flows/board-proof-de.svg)

Das Windows-Paket enthält `ProofDll.dll`, `RKUpgrade_DLL.dll` und Qt. Version 1.01 korrigiert laut Historie den Verlust des letzten CPU-ID-Bytes. Ein vollständiges PDF zu Schutzalgorithmus oder Provisionierungsprotokoll fehlt.

## Paket vollständig lassen

Entpacken Sie sämtliche Abhängigkeiten einschließlich `platforms/qwindows.dll`. Nur die EXE zu kopieren kann einen Qt-Plattformfehler verursachen. `config.json` nennt `DLL=ProofDll.dll` und aktiviert Logging. `APP_VERSION` lautet weiterhin `v1.0`, während das Archiv 1.01 heißt; dokumentieren Sie beides.

## Identität vergleichen

Lesen Sie vor schreibender Integration die Geräte-ID gemäß Board-SDK aus. Länge, Darstellung, führende Nullen und letztes Byte müssen erhalten bleiben. Vergleichen Sie ein definiertes Muster. Eine CPU-ID ist nicht automatisch Seriennummer oder Geheimschlüssel.

Für die Integration fehlen konkrete BSP-Angaben zu Eingaben, Ausgabeformat, SoCs, Kommunikationsmodus und Erfolgskriterium. Klären Sie insbesondere, ob nur eine Host-Datei entsteht oder Gerätezustand geändert wird. Der Programmname belegt das nicht; ein allgemeiner Run-Klickablauf wird daher nicht erfunden.

Archivieren Sie Paket-Hash, DLL-Version, Board, SDK und vollständigen ID-Vergleich. Geräteprotokolle bleiben privat. Die dokumentierten Paketfakten und Vorbereitungen ersetzen keinen noch zu belegenden Schreibablauf.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## GitHub-Werkzeugverzeichnis, Versionen und SHA-256

Das passende GitHub-Verzeichnis öffnen, Host und Version wählen, Dateihash prüfen und vollständig entpacken. Die folgenden Links öffnen Repository-Verzeichnisse.

[Werkzeugverzeichnis auf GitHub öffnen](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/board-proof)

| Plattform / Version | Datei | SHA-256 |
|---|---|---|
| Windows / 1.01 | `BoardProofTool_v1.01_20240823_02.zip` | `72c732d7c91ba7742c4c36d2a549171f9289d820c3d50aad468e38cdd7806029` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- BoardProofTool_v1.01_20240823_02.zip: config.json, revision.log and executable/dependency inventory

## Verwandte Arbeitsabläufe

- [RKDevInfoWriteTool: Seriennummern und MAC-Adressen kontrolliert schreiben](/de/articles/rockchip-tool-devinfo-write/)
- [EfuseTool 1.42: eine nachvollziehbare Provisionierungsstation vorbereiten](/de/articles/rockchip-tool-efuse-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
