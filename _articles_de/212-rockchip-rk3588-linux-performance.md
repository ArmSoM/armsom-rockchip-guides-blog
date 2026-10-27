---
title: "Rockchip RK3588: Linux-Leistungstestbericht"
description: "Rockchip RK3588: Linux-Leistungstestbericht — V1.0.0; RK3588 EVB1"
excerpt: "Rockchip RK3588: Linux-Leistungstestbericht"
translation_key: "212-rockchip-rk3588-linux-performance"
slug: "212-rockchip-rk3588-linux-performance"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, RK3588, Linux, Benchmark]
---

{% raw %}

# Rockchip RK3588: Linux-Leistungstestbericht

ArmSoM-Plattformreferenz mit dem vollständigen technischen Inhalt der Rockchip-Quelle V1.0.0 (RK-CS-YF-922). Die ursprüngliche Testplattform ist RK3588-EVB1-LP4-V10 mit der Board-Konfiguration `BoardConfig-rk3588-evb1-lp4-v10.mk`, keine ArmSoM-Platine. Sämtliche Werte sind historische Quellmessungen, keine ArmSoM-Tests und keine Zusicherung für andere Platinen. Platine, SDK/BSP, Kernel, Kühlung, Stromversorgung und Speicher separat abgleichen. Kernel- und SDK-Version fehlen in der Quelle; es erfolgte keine Hardwareprüfung.

Die Quelle liefert RK3588-Referenzmessungen allgemeiner Linux-Leistungswerkzeuge zur Prüfung der Chip-Leistung, Untersuchung von Leistungsproblemen und Bewertung erwarteter Ergebnisse. Verwendet werden SPEC 2006, Unixbench, Glmark2 und Stream. Es liegt nur die Quelle aus dem chinesischen Verzeichnis vor, kein zugehöriges englisches PDF. Englisch, Russisch und Deutsch sind vollständige Übersetzungen dieser Quelle. Sie enthält keine technischen Abbildungen; alle Datentabellen sind editierbar.

## 1. Testumgebung

### 1.1 Hardwareumgebung

| Konfiguration | Beschreibung |
| --- | --- |
| Motherboard | RK3588-EVB1-LP4-V10 |
| CPU | RK3588; 4xA76-Based@2.4GHz; 4xA55@1.8GHz |
| GPU | RK3588; 4 core Mali-G610 1000MHz |
| RAM | 8G LPDDR4X 2112MHz 16bit*4Channel |
| ROM | eMMC HS400 32GB |
| OS | debian11 |

### 1.2 Softwareumgebung

Für Leistungstests CPU und GPU in den Performance-Modus schalten. Die folgenden Befehle stammen aus der Quelle; der umgebrochene GPU-Umleitungspfad wurde wieder zu einem Befehl verbunden. Vor der Nutzung die tatsächlichen BSP-Knoten prüfen; die Pfade sind nicht auf jeder Platine vorhanden.

```sh
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor

echo performance > /sys/devices/platform/fb000000.gpu/devfreq/fb000000.gpu/governor
```

Anschließend lassen sich die aktuellen CPU- und GPU-Taktfrequenzen wie folgt lesen:

```sh
cat /sys/devices/system/cpu/cpufreq/policy0/cpuinfo_cur_freq
cat /sys/devices/system/cpu/cpufreq/policy4/cpuinfo_cur_freq
cat /sys/devices/system/cpu/cpufreq/policy6/cpuinfo_cur_freq

cat /sys/devices/platform/fb000000.gpu/devfreq/fb000000.gpu/cur_freq
```

## 2. Testprogramme

### 2.1 SPEC 2006

Prüft die CPU-Leistung bei Ganzzahl- und Gleitkommaoperationen. Werkzeugversion: SPEC 2006 V1.01. Es folgen die Quellmesswerte.

| Test | Ergebnis |
| --- | --- |
| Ein Kern Ganzzahl base | 25.5 |
| Ein Kern Gleitkomma base | 29.9 |
| Mehrkern (8 Kerne) Ganzzahl base | 86.9 |
| Mehrkern (8 Kerne) Gleitkomma base | 84.6 |

### 2.2 Unixbench

Prüft Systemaufrufe, Lesen/Schreiben, Prozesse, Grafik, 2D, 3D, Pipes, Rechenoperationen, C-Bibliothek und weitere System-Benchmarks. Die Quelle schreibt `Unixbenc V5.1.3` (ohne h); diese Schreibweise bleibt nachvollziehbar erhalten.

| Test | Ergebnis |
| --- | --- |
| Ein Kern | 1273.7 |
| Mehrkern (8 Kerne) | 3662.2 |

### 2.3 Glmark2

Prüft die GPU-Leistung für OpenGL 2.0 und ES 2.0. Werkzeugversion: glmark2 2021.02.

#### X11

| Test | Ergebnis |
| --- | --- |
| `glmark2-es2 --off-screen` | 3639 |
| `glmark2-es2` | 1376 |
| `glmark2-es2 --fullscreen` | 622 |

#### Wayland

| Test | Ergebnis |
| --- | --- |
| `glmark2-es2-wayland --off-screen` | 3680 |
| `glmark2-es2-wayland` | 2670 |
| `glmark2-es2-wayland --fullscreen` | 1258 |

### 2.4 Stream

Prüft die Speicheroperationen Copy, Scale, Add und Triad. Werkzeugversion: `stream1.0 V5.10`; Quellschreibweise beibehalten.

| Test | Ein Thread (MB/s) | Mehrere Threads (MB/s) |
| --- | --- | --- |
| Copy | 17912.8 | 20481.3 |
| Scale | 17982.8 | 20473.4 |
| Add | 17079.8 | 18205.1 |
| Triad | 17021.3 | 18126.3 |

## Anpassungs- und Quellenhinweise

Die Quelle nennt weder vollständige SPEC-Aufrufparameter noch Kühlbedingungen oder Stream-Compileroptionen. Damit lassen sich nicht sämtliche Tests reproduzieren. Paketversionen und Ergebnisse bleiben als historische Angaben erhalten.

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
