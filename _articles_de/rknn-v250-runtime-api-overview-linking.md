---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Plattformen, Header und Linken"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-overview-linking"
slug: "rknn-v250-runtime-api-overview-linking"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Plattformen, Header und Linken | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Plattformen, Header und Linken | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-overview-linking/"
---

## Plattform und Quelle

Dieser Artikel basiert auf dem RKNN-V2.5.0-PDF des Herstellers und gilt nur für die dort genannten Chips und Schnittstellen. Bei ArmSoM-Boards zuerst SoC, NPU-Treiber, Toolkit/Runtime, SDK/BSP und Kernelversion prüfen. Eine ArmSoM-Hardwareprüfung wurde nicht durchgeführt; Beispiele und Messwerte stammen aus der Quelle, nicht aus ArmSoM-Tests.

## Seriennavigation

- [Plattformen, Header und Linken](/de/articles/rknn-v250-runtime-api-overview-linking/)
- [Speicherbesitz und allgemeine/Zero-Copy-Abläufe](/de/articles/rknn-v250-runtime-api-conventions-zero-copy/)
- [Gerät, Kontext und Initialisierungsflags](/de/articles/rknn-v250-runtime-api-device-context/)
- [Modell-, Tensor- und dynamische Formabfragen](/de/articles/rknn-v250-runtime-api-query/)
- [Eingabe, Ausführung, Ausgabe und dynamische Formen](/de/articles/rknn-v250-runtime-api-inference/)
- [Tensorspeicher zuweisen und synchronisieren](/de/articles/rknn-v250-runtime-api-tensor-memory/)
- [Matrixmultiplikations-APIs und dynamische Formen](/de/articles/rknn-v250-runtime-api-matmul/)
- [Benutzerdefinierte Operatoren registrieren und abfragen](/de/articles/rknn-v250-runtime-api-custom-operators/)
- [Statuscodes, Tensoren, Speicher und Erweiterungstypen](/de/articles/rknn-v250-runtime-api-types-common/)
- [Strukturen zur Matrixmultiplikation](/de/articles/rknn-v250-runtime-api-types-matmul/)
- [Operatortypen und Migration veralteter APIs](/de/articles/rknn-v250-runtime-api-types-custom-migration/)

{% raw %}

<!-- source EN p6 unit 0 -->

## 1. Überblick

<!-- source EN p6 unit 1 -->

RKNN C API stellt C-Schnittstellen für RKNPU Runtime bereit. Damit lässt sich die Rechenleistung der NPU für effiziente RKNN-Modellinferenz oder Matrixmultiplikationen nutzen. Beschrieben werden die Funktionen, Datenstrukturen und Rückgabecodes der RKNN C API.

<!-- source EN p6 unit 2 -->

### 1.1 Gültige Version

<!-- source EN p6 unit 3 -->

Dieses Dokument gilt für RKNPU Runtime V2.5.0 (siehe Versionshistorie im Original-PDF). Die beschriebenen Schnittstellen basieren auf V2.5.0.

<!-- source EN p6 unit 4 -->

### 1.2 Unterstützte Plattformen

<!-- source EN p6 unit 5 -->

Das Dokument gilt für folgende Hardwareplattformen:

<!-- source EN p6 unit 6 -->

RV1103

<!-- source EN p6 unit 7 -->

RV1103B

<!-- source EN p6 unit 8 -->

RV1106

<!-- source EN p6 unit 9 -->

RV1106B

<!-- source EN p6 unit 10 -->

RV1126B

<!-- source EN p6 unit 11 -->

RK2118

<!-- source EN p6 unit 12 -->

RK3562

<!-- source EN p6 unit 13 -->

RK3566-Serie

<!-- source EN p6 unit 14 -->

RK3568-Serie

<!-- source EN p6 unit 15 -->

RK3576-Serie

<!-- source EN p6 unit 16 -->

RK3588-Serie

<!-- source EN p6 unit 17 -->

### 1.3 Header und Laufzeitbibliothek

<!-- source EN p6 unit 18 -->

Die RKNN C API gliedert sich nach Funktionen in drei Teile. Funktionen, Datenstrukturdefinitionen und Headerdateien sind wie folgt zugeordnet:

<!-- source EN p6 unit 19 -->

1. “rknn_api.h” definiert die grundlegenden Schnittstellen und Datenstrukturen zur Bereitstellung von RKNN-Modellen.

<!-- source EN p6 unit 20 -->

2. “rknn_matmul_api.h” definiert Schnittstellen und Datenstrukturen für Matrixmultiplikation.

<!-- source EN p6 unit 21 -->

3. “rknn_custom_op.h” definiert Schnittstellen und Datenstrukturen benutzerdefinierter Operatoren.

<!-- source EN p7 unit 22 -->

## 2. Kompilieren und Linken

<!-- source EN p7 unit 23 -->

Beim Kompilieren einer Anwendung ist die Headerdatei der Schnittstellenfunktion einzubinden und die passende RKNPU-Runtime-Bibliothek für Hardwareplattform und Systemtyp zu linken. Nachfolgend werden die Headerdateien der RKNN C API und die Runtime-Bibliotheksdateien beschrieben.

<!-- source EN p7 unit 24 -->

### 2.1 Linux

<!-- source EN p7 unit 25 -->

1. Für RK3562, die Serien RK3566/RK3568/RK3576/RK3588 und RV1126B heißt die RKNPU-Laufzeitbibliothek librknnrt.so und liegt in `&lt;sdk_path&gt;/rknpu2/runtime`. `&lt;sdk_path&gt;` bezeichnet das Rockchip-NPU-SDK.

<!-- source EN p7 unit 26 -->

2. Für RV1106/RV1103/RV1106B/RV1103B ist die RKNPU-Laufzeitbibliothek librknnmrt.so in `&lt;sdk_path&gt;/rknpu2/runtime`.

<!-- source EN p7 unit 27 -->

### 2.2 Android

<!-- source EN p7 unit 28 -->

Unter Android lässt sich die RKNN API auf zwei Arten aufrufen:

<!-- source EN p7 unit 29 -->

1) Die Anwendung kann direkt mit librknnrt.so gelinkt werden.

<!-- source EN p7 unit 30 -->

2) Unter Android kann die Anwendung mit der HIDL-Implementierung librknn_api_android.so gelinkt werden.

<!-- source EN p7 unit 31 -->

Android-Geräte, die CTS/VTS bestehen müssen, benötigen die RKNN API auf Basis von Android HIDL; librknn_api_android.so enthält keine Matrixmultiplikation und keine benutzerdefinierten Operatoren. Ist CTS/VTS nicht erforderlich, wird die direkte Nutzung von librknnrt.so empfohlen, die beide Funktionen enthält. Der Aufrufweg jeder Schnittstelle ist kürzer und kann bessere Leistung bieten.

<!-- source EN p7 unit 32 -->

Der Quellcode der Android-HIDL-RKNN-API liegt im Verzeichnis vendor/rockchip/hardware/interfaces/neuralnetworks des Android-System-SDK für RK3562/RK3566/RK3568/RK3576/RK3588. Beim System-Build entstehen mehrere RKNPU-Bibliotheken; Anwendungen müssen nur librknn_api_android.so linken und verwenden, wie unten gezeigt:

<!-- source EN p7 unit 33 -->

```text
/vendor/lib/librknn_api_android.so
/vendor/lib/librknnhal_bridge.rockchip.so
/vendor/lib64/librknn_api_android.so
/vendor/lib64/librknnhal_bridge.rockchip.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0-adapter-helper.so
/vendor/lib64/hw/rockchip.hardware.neuralnetworks@1.0-impl.so
/vendor/bin/hw/rockchip.hardware.neuralnetworks@1.0-service
```

<!-- source EN p7 unit 34 -->

Alternativ können diese Bibliotheken mit folgendem Befehl separat neu gebaut werden:

<!-- source EN p7 unit 35 -->

```c
mmm vendor/rockchip/hardware/interfaces/neuralnetworks/ -j8
```

<!-- source EN p7 unit 36 -->

### 2.3 RK2118-Plattform

<!-- source EN p7 unit 37 -->

Für RK2118 liegt die RKNPU-Laufzeitbibliothek im RK2118-System-SDK. Siehe „Prepare RK2118 SDK“ in „RKNN3_RK2118_Quick_Start.pdf“.

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
