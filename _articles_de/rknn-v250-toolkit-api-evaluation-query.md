---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Genauigkeit, Leistung, Speicher und Geräteabfragen"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-toolkit-api-evaluation-query"
slug: "rknn-v250-toolkit-api-evaluation-query"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Genauigkeit, Leistung, Speicher und Geräteabfragen | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Genauigkeit, Leistung, Speicher und Geräteabfragen | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-toolkit-api-evaluation-query/"
---

## Plattform und Quelle

Dieser Artikel basiert auf dem RKNN-V2.5.0-PDF des Herstellers und gilt nur für die dort genannten Chips und Schnittstellen. Bei ArmSoM-Boards zuerst SoC, NPU-Treiber, Toolkit/Runtime, SDK/BSP und Kernelversion prüfen. Eine ArmSoM-Hardwareprüfung wurde nicht durchgeführt; Beispiele und Messwerte stammen aus der Quelle, nicht aus ArmSoM-Tests.

## Seriennavigation

- [Umgebung und Objektlebenszyklus](/de/articles/rknn-v250-toolkit-api-requirements-lifecycle/)
- [Modellkonfiguration und Quantisierungsparameter](/de/articles/rknn-v250-toolkit-api-configuration/)
- [Caffe, TensorFlow, ONNX und PyTorch laden](/de/articles/rknn-v250-toolkit-api-model-loading/)
- [Aufbau, hybride Quantisierung und Export](/de/articles/rknn-v250-toolkit-api-build-quantize-export/)
- [Laufzeit, Operatorregistrierung und Inferenz](/de/articles/rknn-v250-toolkit-api-runtime-inference/)
- [Genauigkeit, Leistung, Speicher und Geräteabfragen](/de/articles/rknn-v250-toolkit-api-evaluation-query/)
- [C++-Bereitstellungsbeispiele erzeugen, bauen und ausführen](/de/articles/rknn-v250-toolkit-api-cpp-codegen/)

{% raw %}

<!-- source EN p23 unit 121 -->

## 8 Genauigkeit, Leistung und Speicher bewerten APIs

<!-- source EN p23 unit 123 -->

### 8.1 Quantisierungsgenauigkeit analysieren

<!-- source EN p23 unit 124 -->

Diese Schnittstelle führt die Inferenz mit dem quantisierten Modell aus und erzeugt die Ausgaben jeder Schicht zur Analyse der Quantisierungsgenauigkeit.

<!-- source EN p23 unit 125 -->

| API | accuracy_analysis |
| --- | --- |
| Beschreibung | Mit dem quantisierten Modell eine Inferenz durchführen und einen Snapshot erzeugen, also die Tensordaten jedes Layers ausgeben. Zur Berechnung des Quantisierungsfehlers werden Snapshots beider Datentypen fp32 und quant ausgegeben.<br>Hinweise:<br>1. Die Schnittstelle darf erst nach build oder hybrid_quantization_step2 aufgerufen werden.<br>2. Ist target None und das ursprüngliche Modell bereits quantisiert (QAT-Modell), schlägt der Aufruf fehl.<br>3. Das Quantisierungsverfahren entspricht der Einstellung in config. |
| Parameter | inputs: Liste der Bildpfade (jpg/png/bmp/npy). |
| Parameter | output_dir: Ausgabeverzeichnis für sämtliche Snapshot-Daten. Standardwert: './snapshot'.<br>Ohne target werden in output_dir folgende Inhalte erzeugt:<br>- Verzeichnis simulator: Ergebnisse jedes Layers im Simulator bei vollständiger Ausführung des quantisierten Modells (die Ausgabe wurde in float32 konvertiert).<br>- Verzeichnis golden: Ergebnisse jedes Layers im Simulator bei vollständiger Ausführung des Gleitkommamodells.<br>- error_analysis.txt: Kosinusabstand (entire_error und single_error) zwischen den Layer-Ergebnissen des quantisierten Modells im Simulator und dem Gleitkommamodell im Simulator während der vollständigen Berechnung des quantisierten Modells. entire_error/single_error unterscheiden sich darin, ob die Eingabe des jeweiligen Layers aus dem quantisierten Modell oder dem Gleitkommamodell stammt. Weitere Details stehen in error_analysis.txt.<br>Mit target werden zusätzliche Inhalte in output_dir erzeugt:<br>- Verzeichnis runtime: Ergebnisse jedes Layers bei vollständiger Ausführung des quantisierten Modells auf der NPU (die Ausgabe wurde in float32 konvertiert).<br>- error_analysis.txt: zusätzlich der Kosinusabstand (entire_error) zwischen den Layer-Ergebnissen im Simulator und auf der NPU während der vollständigen Berechnung des quantisierten Modells. Weitere Details stehen in error_analysis.txt. |
| Parameter | target: Ziel-Hardwareplattform. Unterstützt werden 'rv1103', 'rv1103b', 'rv1106', 'rv1106b', 'rv1126b', 'rk3562', 'rk3566', 'rk3568', 'rk3576' und 'rk3588'. Standardwert: "None".<br>Bei gesetztem target werden die Ausgaben jedes NPU-Layers ermittelt und auf Genauigkeit analysiert. |
| Parameter | device_id: Gerätekennung. Bei mehreren am PC angeschlossenen Geräten muss sie angegeben werden; der Wert wird über list_devices ermittelt. Standardwert: "None ". |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source EN p23 unit 126 -->

Beispielcode:

<!-- source EN p24 unit 127 -->

```python
# Accuracy analysis
ret = rknn.accuracy_analysis(inputs=['./dog_224x224.jpg'])
```

<!-- source EN p24 unit 128 -->

### 8.2 Modellleistung bewerten

<!-- source EN p24 unit 129 -->

| API | eval_perf |
| --- | --- |
| Beschreibung | Modellleistung bewerten.<br>Das Modell muss auf einem mit dem PC verbundenen RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588 laufen. Ist perf_debug bei init_runtime False, enthalten die von der Hardware ermittelten Leistungsdaten nur die Gesamtlaufzeit. Bei perf_debug = True werden zusätzlich die Laufzeiten der einzelnen Layer detailliert erfasst. |
| Parameter | is_print: Gibt an, ob Leistungsdaten ausgegeben werden. Standardwert: True. |
| Parameter | fix_freq: Gibt an, ob die Hardwarefrequenz festgehalten wird. Standardwert: True. |
| Rückgabewert | perf_result: Leistungsinformationen (Zeichenfolgen). |

<!-- source EN p24 unit 130 -->

Beispielcode:

<!-- source EN p24 unit 131 -->

```python
# Evaluate model performance
perf_detail = rknn.eval_perf()
```

<!-- source EN p24 unit 132 -->

### 8.3 Speicherbedarf bewerten

<!-- source EN p24 unit 133 -->

| API | eval_memory |
| --- | --- |
| Beschreibung | Speicherverbrauch bei der Modellausführung auf der Hardwareplattform ermitteln.<br>Das Modell muss auf einem mit dem PC verbundenen RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588 laufen. |
| Parameter | is_print: Gibt an, ob die Speicherbewertung im Standardformat ausgegeben wird. Standardwert: True. |
| Rückgabewert | memory_detail: Detaillierte Speicherverbrauchsdaten als Dictionary.<br>Beispiel:<br>{<br>'weight_memory': 3698688,<br>'internal_memory': 1756160,<br>'other_memory': 484352,<br>'total_memory': 5939200,<br>}<br>- 'weight_memory' bezeichnet den Speicherbedarf der Modellgewichte.<br>- 'internal_memory' bezeichnet den Speicherverbrauch der internen Tensoren.<br>- 'other_memory' bezeichnet den Speicherverbrauch anderer Tensoren.<br>- 'total_memory' bezeichnet den gesamten Modellspeicherbedarf, also die Summe aus Gewichten, internen Tensoren und sonstigem Speicher. |

<!-- source EN p24 unit 134 -->

Beispielcode:

<!-- source EN p25 unit 135 -->

```python
# eval memory usage
memory_detail = rknn.eval_memory()
```

<!-- source EN p25 unit 136 -->

Für das Beispiel examples/caffe/mobilenet_v2 zeigt die Quelle folgende Speicherbelegung auf RK3588. Dies sind Originalwerte, keine ArmSoM-Messungen.

<!-- source EN p25 unit 137 -->

```text
======================================================
           Memory Profile Info Dump
======================================================
NPU model memory detail(bytes):
    Weight Memory: 3.53 MiB
    Internal Tensor Memory: 1.67 MiB
    Other Memory: 473.00 KiB
    Total Memory: 5.66 MiB

INFO: When evaluating memory usage, we need consider
the size of model, current model size is: 4.09 MiB
======================================================
```

<!-- source EN p25 unit 138 -->

### 8.4 Geräte auflisten

<!-- source EN p25 unit 139 -->

| API | list_devices |
| --- | --- |
| Beschreibung | Angeschlossene RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588 auflisten.<br>Hinweis: Es gibt zwei Geräteverbindungsmodi, ADB und NTB. Bei mehreren Geräten müssen die Modi übereinstimmen. |
| Parameter | None. |
| Rückgabewert | Gibt die Listen adb_devices und ntb_devices zurück. Wenn keine Geräte am PC angeschlossen sind, werden zwei leere Listen zurückgegeben. |

<!-- source EN p25 unit 140 -->

Beispielcode:

<!-- source EN p25 unit 141 -->

```python
rknn.list_devices()
```

<!-- source EN p25 unit 142 -->

Beispielgeräteliste:

<!-- source EN p25 unit 143 -->

```text
*************************
all device(s) with adb mode:
VD46C3KM6N
*************************
```

<!-- source EN p26 unit 144 -->

## 9 API zur SDK-Versionsabfrage

<!-- source EN p26 unit 145 -->

| API | get_sdk_version |
| --- | --- |
| Beschreibung | API- und Treiberversion des verwendeten SDK abrufen.<br>Hinweis: Vorher müssen das Modell geladen und die Laufzeitumgebung initialisiert werden. Die API ist nur auf RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588 nutzbar. |
| Parameter | None. |
| Rückgabewert | sdk_version: API- und Treiberversion. Datentyp: Zeichenfolge. |

<!-- source EN p26 unit 146 -->

Beispielcode:

<!-- source EN p26 unit 147 -->

```python
# Get SDK version
sdk_version = rknn.get_sdk_version()
print(sdk_version)
```

<!-- source EN p26 unit 148 -->

Beispielausgabe der SDK-Version:

<!-- source EN p26 unit 149 -->

```text
==============================================
RKNN VERSION:
    API: 1.5.2 (8babfea build@2023-08-25T02:31:12)
    DRV: rknn_server: 1.5.2 (8babfea build@2023-08-25T10:30:12)
    DRV: rknnrt: 1.5.3b13 (42cbca6f5@2023-10-27T10:13:21)
==============================================
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Redaktionelle Hinweise: Protokolle mit SDK 1.5.2 bleiben historische Beispiele, keine V2.5.0-Messungen. Die Python-Zelle für Ubuntu20.04 unterscheidet sich: chinesisch 3.8/3.9, englisch 3.8/3.8; ebenso für Debian11; im ARM64-Abschnitt ist Debian weiterhin als x64 bezeichnet. Quellwerte bleiben erhalten; tatsächliches Installationspaket prüfen. V2.5.0 ergänzt C++ codegen und präzisiert Quantisierung und Speicherstrategien; alte Parameter ersetzen nicht die neue Quelle.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
