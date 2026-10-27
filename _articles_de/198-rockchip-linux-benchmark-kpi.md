---
title: "Rockchip Linux Benchmark: Leistungskennzahlen"
description: "Rockchip Linux Benchmark: Leistungskennzahlen — RK3588/RK3576/RK3562/RK3568/RK3566/RK3399/RK3326/RK3288, V1.3.0"
excerpt: "Rockchip Linux Benchmark: Leistungskennzahlen"
translation_key: "198-rockchip-linux-benchmark-kpi"
slug: "198-rockchip-linux-benchmark-kpi"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK3588", "RK3576", "Linux", "Benchmark"]
---

{% raw %}

# Rockchip Linux Benchmark: Leistungskennzahlen

Plattformreferenz für ArmSoM auf Grundlage der chinesischen und englischen Fassung RK-CS-YF-375 V1.3.0. Alle technischen Inhalte und Messwerte für acht Chips sind als Vergleich bei der Weiterentwicklung erhalten. Es handelt sich um Rockchip-EVB-Ergebnisse, nicht um ArmSoM-Messungen oder Leistungszusagen für andere Platinen. SoC, Speicher, Massenspeicher, SDK/BSP, Kernel, Kühlung und Display der konkreten ArmSoM-Platine prüfen. Es erfolgte keine Hardwarevalidierung.

## 1. Testumgebung

Die Tabelle nennt Hardware und Software einschließlich ARM-Chip, CPU-Kernzahl, Speicherkapazität und Massenspeicherkonfiguration. Die Schreibweise G/M für Frequenzen und Kapazitäten bleibt ohne stillschweigende Umrechnung erhalten.

| Chip | Rockchip-EVB-Platine | Betriebssystem | SDK-Tag | Hardwarekonfiguration |
| --- | --- | --- | --- | --- |
| RK3588 | rk3588_evb1_lp4_v10 | Buildroot | linux-5.10-gen-rkr4 | CPU: acht Kerne, große 2.3G / kleine 1.8G; DDR: 2112M, 8G; GPU: 1G; FLASH: 32G eMMC |
| RK3576 | rk3576_evb1_v10 | Buildroot | linux-6.1-stan-rkr4 | CPU: acht Kerne, große 2.2G / kleine 2.0G; DDR: 2112M, 4G; GPU: 950MHz; NPU: 900MHz; FLASH: 256G UFS |
| RK3562 | rk3562_evb2_ddr4_v10 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4 Kerne A53, 2016M; DDR: 1332M, 2G; GPU: 900M; NPU: 1000MHz; FLASH: 256G eMMC |
| RK3568 | rk3568_evb1_ddr4_v10 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4 Kerne A55, 1992M; DDR: 1560M, 2G; GPU: 800M; NPU: 900MHz; FLASH: 32G eMMC |
| RK3566 | rk3566_evb2_lp4x_v10 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4 Kerne A55, 1.8G; DDR: 1056M, 2G; GPU: 800M; NPU: 900MHz; FLASH: 16G eMMC |
| RK3399 | rk3399_evb_ind_lpddr4 | Buildroot | linux-5.10-gen-rkr4 | CPU: sechs Kerne, große 2xA72 mit 1.8G, kleine 4XA53 mit 1.4G; DDR: 856M, 4G; GPU: 800M; FLASH: 16G eMMC |
| RK3326 | rk3326_evb_lp3_v12 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4 Kerne A35, 1.3G; DDR: 666M, 2G; GPU: 520M; FLASH: 8G eMMC |
| RK3288 | rk3288_evb_rk808 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4 Kerne A17, 1.6G; DDR: 528M, 2G; GPU: 600M; FLASH: 8G eMMC |

## 2. Testmethoden

Testmethoden, Werkzeuge und Einstellungen jedes Tests zur Reproduzierbarkeit ausführlich dokumentieren. Die Quelle stellt mit folgendem Befehl den Leistungsmodus ein. Er verändert Governor, ist nicht schreibgeschützt und wurde für diesen Artikel nicht ausgeführt.

```sh
echo performance | tee $(find /sys/ -name *governor) /dev/null || true
```

### 2.1 Glmark2-Test

Folgenden Befehl ausführen:

```sh
/rockchip-test/gpu/gpu_test.sh
```

### 2.2 UnixBench-Test

Folgenden Befehl ausführen:

```sh
/opt/unixbench/Run
```

## 3. Testergebnisse

### 3.1 Buildroot-System

#### 3.1.1 Glmark2

glmark2 ist ein Benchmark für OpenGL 2.0 und ES 2.0. Es folgen Werte für Normal-, Offscreen- und Vollbildmodus.

| Merkmal | RK3588 | RK3576 | RK3562 | RK3568 | RK3566 | RK3399 | RK3326 | RK3288 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Normales Fenster (800x600) | 4851 | 1713 | 676 | 560 | 485 | 812 | 369 | 57 |
| Offscreen | 3550 | 1864 | 644 | 596 | 531 | 687 | 419 | 604 |
| Vollbild | 2780 | 788 | 287 | 240 | 224 | 183 | 253 | 52 |
| GPU-Typ | Valhall-G610 | Mali-G52 | Mali-G52 | Mali-G52 | Mali-G52 | Mali-T864 | Mali-G31 | Mali-T764 |
| Bildschirmauflösung | 1080x1920 | 1080x1920 | 1080x1920 | 1080x1920 | 1080x1920 | 1536x2048 | 720x1280 | 1536x2048 |

#### 3.1.2 UnixBench

UnixBench liefert grundlegende Leistungskennzahlen Unix-artiger Systeme. Es folgen Referenzwerte. Die Quelle nennt keine Einheiten pro Zeile; deshalb wird nicht allen Werten stillschweigend dieselbe Durchsatzeinheit zugewiesen.

Systemleistung bei einer einzelnen Aufgabe:

| Merkmal | RK3399 | RK3288 | RK3326 | RK3566 | RK3568 | RK3562 | RK3576 | RK3588 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dhrystone 2 mit Registervariablen | 19191210.4 | 10626086.6 | 5704897.1 | 12332588.0 | 13176039.3 | 10821835.3 | 22932325.5 | 34493007.3 |
| Whetstone mit doppelter Genauigkeit | 3303.5 | 1718.9 | 1565.2 | 2965.9 | 3164.5 | 2464.3 | 4103.7 | 6665.4 |
| Execl-Durchsatz | 2730.8 | 1538.1 | 787.9 | 1483.6 | 1703.0 | 1815.3 | 2678.3 | 5695.8 |
| Dateikopie: bufsize 1024, maxblocks 2000 | 263262.3 | 163001.5 | 125333.2 | 166135.4 | 175490.6 | 247437.6 | 432878.6 | 832875.7 |
| Dateikopie: bufsize 256, maxblocks 500 | 98335.8 | 50635.1 | 37871.9 | 48956.5 | 51574.7 | 74740.7 | 145359.2 | 253871.4 |
| Dateikopie: bufsize 4096, maxblocks 8000 | 677993.2 | 384632.9 | 321189.7 | 440209.9 | 461129.3 | 610768.8 | 1098724.6 | 1831983.9 |
| Pipe-Durchsatz | 775302.3 | 357578.5 | 300305.5 | 521804.1 | 557997.0 | 619105.4 | 779828.1 | 1644863.6 |
| Pipe-basierter Kontextwechsel | 87345.3 | 54247.5 | 37434.5 | 51766.2 | 53873.8 | 61437.0 | 105369.5 | 217180.2 |
| Prozesserzeugung | 4274.2 | 3512.1 | 2086.0 | 3782.4 | 4041.7 | 5113.1 | 4232.7 | 5272.1 |
| Shell-Skripte (1 gleichzeitig) | 2944.0 | 2973.3 | 1474.2 | 2352.0 | 2817.2 | 2301.5 | 2598.5 | 3254.2 |
| Shell-Skripte (8 gleichzeitig) | 832.4 | 703.2 | 431.7 | 567.3 | 675.6 | 647.6 | 976.8 | 2092.6 |
| Systemaufruf-Overhead | 721899.8 | 624614.1 | 568868.6 | 783414.7 | 836985.7 | 838824.4 | 621437.6 | 1322359.7 |
| System-Benchmark-Indexwert | 654.7 | 421.7 | 290.6 | 456.9 | 497.3 | 533.3 | 761.6 | 1342.5 |

Systemleistung bei mehreren Aufgaben:

| Merkmal | RK3399 | RK3288 | RK3326 | RK3566 | RK3568 | RK3562 | RK3576 | RK3588 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dhrystone 2 mit Registervariablen | 61892645.4 | 41527276.3 | 22821903.2 | 47931915.4 | 51737187.8 | 42342893.2 | 133846256.4 | 182453805.7 |
| Whetstone mit doppelter Genauigkeit | 13192.2 | 6870.1 | 6265.7 | 11545.6 | 12431.5 | 9699.1 | 27875.6 | 38815.5 |
| Execl-Durchsatz | 6638.9 | 4127.0 | 2449.4 | 3272.1 | 3951.1 | 4359.4 | 10082.5 | 23542.0 |
| Dateikopie: bufsize 1024, maxblocks 2000 | 253903.6 | 265838.2 | 194293.5 | 236042.5 | 246968.0 | 436766.8 | 756330.5 | 681901.0 |
| Dateikopie: bufsize 256, maxblocks 500 | 74647.0 | 74156.4 | 54107.4 | 65182.9 | 67873.4 | 117806.2 | 225876.4 | 189411.0 |
| Dateikopie: bufsize 4096, maxblocks 8000 | 715699.5 | 709343.4 | 565091.8 | 639035.4 | 700693.2 | 1285002.9 | 1999953.4 | 1873825.2 |
| Pipe-Durchsatz | 3159789.0 | 1323176.0 | 1191104.7 | 2031168.7 | 2191846.5 | 2427332.4 | 5664856.1 | 8951711.8 |
| Pipe-basierter Kontextwechsel | 298324.6 | 134686.9 | 154652.2 | 202912.5 | 212649.7 | 306251.1 | 707269.5 | 1148297.7 |
| Prozesserzeugung | 11834.7 | 7412.8 | 5183.1 | 7036.5 | 7932.7 | 10979.8 | 17803.4 | 44316.5 |
| Shell-Skripte (1 gleichzeitig) | 7420.0 | 5710.9 | 3587.9 | 4613.8 | 5473.0 | 5027.4 | 9575.2 | 24379.9 |
| Shell-Skripte (8 gleichzeitig) | 952.5 | 744.6 | 477.4 | 593.1 | 707.7 | 688.4 | 1279.3 | 3455.2 |
| Systemaufruf-Overhead | 2514699.7 | 2392234.7 | 2206337.3 | 2815382.8 | 3028273.6 | 3152888.0 | 3589591.2 | 3030469.3 |
| System-Benchmark-Indexwert | 1402.8 | 989.5 | 746.4 | 1039.1 | 1146.5 | 1365.4 | 2715.3 | 4036.2 |

## Quellenabgleich

Beide Quellen sind V1.3.0. Die acht Hardwarekonfigurationen und sämtliche Ergebniszellen stimmen überein; die Seiteneinteilung weicht ab, die Umgebungstabelle ist zusammengeführt. GPU-Schreibweisen wie `Valhall-G610` bleiben ohne mutmaßliche Korrektur erhalten. Beide Quellen enthalten keine technischen Abbildungen; alle Tabellen sind editierbar. Streuung, Wiederholungszahl und Konfidenzintervalle fehlen in der Quelle und werden nicht erfunden.

Offizielle Referenzen: [Rockchip](https://www.rock-chips.com/); [ArmSoM-Dokumentation](https://docs.armsom.org/).

{% endraw %}
