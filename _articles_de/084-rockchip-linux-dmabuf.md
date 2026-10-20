---
title: "Rockchip Linux DMA-BUF: Speicherlecks, IOVA und Spitzenbelegung untersuchen"
description: "Alle DMA-BUF-Debugmakros für RK3588 Linux 5.10, procfs sowie Quellbeispiele zur Speicher- und Spitzenbelegung bei Videowiedergabe."
translation_key: "084-rockchip-linux-dmabuf"
slug: "084-rockchip-linux-dmabuf"
lang: "de"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "DMA-BUF"]
keywords: "ArmSoM Rockchip Linux linux dmabuf"
excerpt: "Alle DMA-BUF-Debugmakros für RK3588 Linux 5.10, procfs sowie Quellbeispiele zur Speicher- und Spitzenbelegung bei Videowiedergabe."
---

{% raw %}

# Rockchip Linux DMA-BUF: Speicherlecks, IOVA und Spitzenbelegung untersuchen

## ArmSoM-Anwendbarkeit und Quelle

Plattformreferenz zur Anpassung an ArmSoM, übersetzt aus der chinesischen Fassung V1.0.0. Geltungsbereich der Quelle: RK3588, Linux 5.10. Ein englisches PDF liegt nicht vor; Englisch, Russisch und Deutsch sind vollständig aus dem Chinesischen übersetzt. Die deutsche Fassung verwendet dieselben Bild-URLs wie die englische. Bestimmte ArmSoM-Boards, SDK/BSP- oder Treiberkombinationen wurden weder bestätigt noch an Hardware geprüft. SoC, Speicheraufteilung des Boards, SDK/BSP, Kernelkonfiguration und Treiberimplementierung prüfen. Code, Adressen, Protokolle und Messwerte sind Quellbeispiele, keine ArmSoM-Testergebnisse.

[Redaktionelle Prüfnotizen](/docs/rockchip-linux-dmabuf/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

Die Quelle beschreibt die DMA-BUF-Diagnose bei Speicherlecks, Datenflussfehlern und fehlgeschlagenen Speicherabbildungen. Sie enthält keine technischen Abbildungen; es werden keine erfunden.

| SoC der Quelle | Kernel der Quelle |
| --- | --- |
| RK3588 | Linux 5.10 |

<!-- Source CN PDF p.4, unit 0 -->

## 1. Einführung

<!-- Source CN PDF p.4, unit 1 -->

DMABUF ist eine Pufferstruktur für gemeinsam genutzten Speicher zwischen Multimediageräten. Über den Dateideskriptor eines DMABUF können Geräte Speicher prozessübergreifend teilen. Zero-Copy steigert die Leistung, asynchroner Zugriff verringert die Kopplung der Module.

<!-- Source CN PDF p.4, unit 2 -->

## 2. Linux-Anpassungen zur DMABUF-Diagnose

<!-- Source CN PDF p.4, unit 3 -->

### 2.1 DMABUF_DEBUG

<!-- Source CN PDF p.4, unit 4 -->

Im beschriebenen BSP ist DMABUF debug ab Linux-5.10 verfügbar. In `arch/arm64/configs/rockchip_defconfig` aktivieren:

<!-- Source CN PDF p.4, unit 5 -->

```text
CONFIG_DMABUF_DEBUG=y
```

<!-- Source CN PDF p.4, unit 6 -->

Mit diesem Makro erhält jeder DMABUF standardmäßig einen Namen aus pid+taskname mit 16 Zeichen. Beispiel:

<!-- Source CN PDF p.4, unit 7 -->

```text
416-allocator@4.
```

<!-- Source CN PDF p.4, unit 8 -->

### 2.2 DMABUF_PROCFS

<!-- Source CN PDF p.4, unit 9 -->

Im beschriebenen BSP ist DMABUF procfs ab Linux-5.10 verfügbar. In `arch/arm64/configs/rockchip_defconfig` aktivieren:

<!-- Source CN PDF p.4, unit 10 -->

```text
CONFIG_RK_DMABUF_PROCFS=y
```

<!-- Source CN PDF p.4, unit 11 -->

Die Option erstellt unter `/proc/` den Unterknoten `rk_dmabuf` mit folgenden Diagnoseknoten. Die Kommentare im Block bleiben aus der chinesischen Quelle erhalten:

<!-- Source CN PDF p.4, unit 12 -->

```text
dev # 显示所有DMABUF已经attach的device
sgt # 显示所有DMABUF的ScatterListTable，显示其IOVA
size # 显示所有DMABUF的total size
peak # 显示所有DMABUF的total size的峰值
```

Bedeutung der Knoten: dev zeigt angehängte Geräte, sgt die ScatterListTable und IOVA, size die Gesamtgröße und peak deren Höchstwert.

<!-- Source CN PDF p.4, unit 13 -->

### 2.3 DMABUF_DEBUG_ADVANCED

<!-- Source CN PDF p.4, unit 14 -->

Diese Unterfunktion von DMABUF procfs ermittelt die physischen Speicheradressen der DMABUFs. In `arch/arm64/configs/rockchip_defconfig` aktivieren:

<!-- Source CN PDF p.4, unit 15 -->

```text
CONFIG_DMABUF_DEBUG_ADVANCED=y
```

<!-- Source CN PDF p.5, unit 16 -->

Mit dieser Option werden alle DMABUFs über ein Fake-Gerät angehängt und gemappt, um ihre sgt zu erhalten. Damit soll `/proc/rk_dmabuf_sgt` sämtliche IOVAs anzeigen. Der Pfad ist wörtlich aus der Quelle übernommen; im verwendeten BSP prüfen.

<!-- Source CN PDF p.5, unit 17 -->

## 3. Fragen und Antworten

<!-- Source CN PDF p.5, unit 18 -->

### 3.1 DMABUF-Speicherleck bei der Videowiedergabe auf RK3588?

<!-- Source CN PDF p.5, unit 19 -->

Debugmakros aktivieren und beim Aufrufen des Hauptbildschirms den Speicher prüfen:

<!-- Source CN PDF p.5, unit 20 -->

```text
console:/ # cat /proc/rk_dmabuf/size
Total: 65552 KiB
```

<!-- Source CN PDF p.5, unit 21 -->

Video abspielen, Wiedergabe beenden, Verlauf löschen und zum Hauptbildschirm zurückkehren:

<!-- Source CN PDF p.5, unit 22 -->

```text
console:/ # cat /proc/rk_dmabuf/size
Total: 83948 KiB
```

<!-- Source CN PDF p.5, unit 23 -->

### 3.2 Maximale DMABUF-Speicherbelegung bei der Videowiedergabe auf RK3588?

<!-- Source CN PDF p.5, unit 24 -->

Über den mpp-Debugknoten die gesamte DMABUF-Speicherbelegung der Videowiedergabe prüfen:

<!-- Source CN PDF p.5, unit 25 -->

```text
console:/ # cat /proc/mpp_service/sessions-summary
fdc38100.rkvdec-core Total: 699760 KiB
```

<!-- Source CN PDF p.5, unit 26 -->

Den Spitzenwert über den DMABUF-Debugknoten prüfen:

<!-- Source CN PDF p.5, unit 27 -->

```text
console:/ # cat /proc/rk_dmabuf/peak
Peak: 1544 MiB
```

<!-- Source CN PDF p.5, unit 28 -->

Den Spitzenwert auf null zurücksetzen und erneut beobachten:

<!-- Source CN PDF p.5, unit 29 -->

```text
console:/ # echo 0 > /proc/rk_dmabuf/peak
```

{% endraw %}
