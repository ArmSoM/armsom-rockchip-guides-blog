---
title: "DDR Bandwidth Tool: Speicherverkehr auf Rockchip auswerten"
description: "Der DDR-Probe erfasst Controller-Zähler bei Video-, AI- oder Display-Lasten. Er ist kein Speicherstabilitätstest; MB/s ist keine direkte Bewertung der Anwendungsgeschwindigkeit."
excerpt: "Der DDR-Probe erfasst Controller-Zähler bei Video-, AI- oder Display-Lasten. Er ist kein Speicherstabilitätstest; MB/s ist keine direkte Bewertung der Anwendungsgeschwindigkeit."
translation_key: "rockchip-tool-ddr-bandwidth"
slug: "rockchip-tool-ddr-bandwidth"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "DDR Bandwidth Tool"]
---

{% raw %}

![DDR Bandwidth Tool](/assets/rockchip-tools/flows/ddr-bandwidth-de.svg)

Der DDR-Probe erfasst Controller-Zähler bei Video-, AI- oder Display-Lasten. Er ist kein Speicherstabilitätstest; MB/s ist keine direkte Bewertung der Anwendungsgeschwindigkeit.

## Vorbereitung

Wählen Sie die 32- oder 64-Bit-Datei für das Zielboard und beginnen Sie mit der Hilfe:

```text
./rk-msch-probe-for-user-64bit -h
```

`-c chip_name` wählt die Plattform, `-d msecs` das Intervall und `-f freq` die Frequenz in MHz. Der allgemeine Handbuchname unterscheidet sich vom Paketnamen. Prüfen Sie SoC und BSP.

## Frequenz festlegen

Das Handbuch verlangt, während der Messung `dmc_ondemand` zu vermeiden, und zeigt:

```text
echo userspace > /sys/class/devfreq/dmc/governor
echo 780000000 > /sys/class/devfreq/dmc/userspace/set_freq
```

`780000000` ist ein Beispiel in Hz und kein allgemeiner Sollwert. Verwenden Sie nur einen unterstützten OPP und sichern Sie die bisherigen Einstellungen zur Wiederherstellung. `-f` erwartet dagegen MHz. Bei “DDR monitor time gets error” muss die Messung verworfen werden.

## Werte verstehen

`ALL` fasst Kanäle zusammen, `CHx` bezeichnet einen Kanal. `LOAD`, `RD`, `WR` zeigen Gesamt-, Lese- und Schreibverkehr samt Auslastung. `ACT(access : active)` beschreibt Zugriffe je Aktivierung und damit Lokalität. `PRE` wird laut Quelle aus Aktivierungen abgeleitet und nicht unabhängig gezählt. Stromsparfelder sind Zeitanteile.

Vergleichen Sie Leerlauf und dieselbe Last bei gleichen DDR-Einstellungen und Messzeiten. Dokumentieren Sie SoC, Speicher, Kernel, governor, Frequenz und Intervall. Fehlendes `/dev/mem` kann auf deaktiviertes `CONFIG_DEVMEM` hinweisen; verwenden Sie einen abgestimmten Debug-Kernel. Für diesen Artikel wurden keine ArmSoM-Bandbreitenmessungen durchgeführt.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## Download, Versionen und SHA-256

Passendes Archiv laden, Hash prüfen und den vollständigen Ordner entpacken. Linux PinDebug zuerst nach verlinkter Anleitung zusammensetzen; der angegebene Hash gehört zur vollständigen Datei.

| Host / Version | Paket |
|---|---|
| Linux target / manual 1.4.1 | [ddr-bandwidth-linux-directory-snapshot.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/ddr-bandwidth/ddr-bandwidth-linux-directory-snapshot.zip) |

**ddr-bandwidth-linux-directory-snapshot.zip — SHA-256**

```text
198ec5ad23aedee97518936fb4c2810f3d92c415269fad56788e833811af612d
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- Rockchip_Introduction_DDR_Bandwidth_Tool_CN.pdf V1.4.1, pp.3–6; packaged 32/64-bit probes
- [Original-PDF: Rockchip_Introduction_DDR_Bandwidth_Tool_CN.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/35fc41c5ec2e.pdf)

## Verwandte Arbeitsabläufe

- [Rockchip DDR-Entwicklerleitfaden: Frequenz, Kapazität, Validierung, Augendiagramme und ECC](/de/articles/037-rockchip-ddr/)
- [DDR_UserTool 1.41: passende DDR-Testkonfigurationen auswählen](/de/articles/rockchip-tool-ddr-user-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
