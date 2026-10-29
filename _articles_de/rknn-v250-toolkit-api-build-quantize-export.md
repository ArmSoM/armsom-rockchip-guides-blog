---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Aufbau, hybride Quantisierung und Export"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-toolkit-api-build-quantize-export"
slug: "rknn-v250-toolkit-api-build-quantize-export"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Aufbau, hybride Quantisierung und Export | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Aufbau, hybride Quantisierung und Export | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-toolkit-api-build-quantize-export/"
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

<!-- source EN p15 unit 75 -->

## 5 APIs für Modellaufbau und Quantisierung

<!-- source EN p15 unit 76 -->

### 5.1 RKNN-Modell aufbauen

<!-- source EN p15 unit 77 -->

| API | build |
| --- | --- |
| Beschreibung | Aus dem importierten Modell das entsprechende RKNN-Modell erstellen. |
| Parameter | do_quantization: Gibt an, ob das Modell quantisiert werden soll. Standardwert: True. |
| Parameter | dataset: Eingabedatensatz zur Kalibrierung der Quantisierungsparameter. Unterstützt wird eine Textdatei, in der Pfade zu Kalibrierungsbildern (jpg oder png) oder npy-Dateien stehen. Pro Zeile ein Pfad, beispielsweise:<br>a.jpg<br>b.jpg<br>oder<br>a.npy<br>b.npy<br>Bei mehreren Eingaben werden die zugehörigen Dateien durch Leerzeichen getrennt, etwa:<br>a.jpg a2.jpg<br>b.jpg b2.jpg<br>oder<br>a.npy a2.npy<br>b.npy b2.npy<br>Hinweis: Im Allgemeinen sollten die Quantisierungsbilder dem späteren Vorhersageszenario entsprechen. |
| Parameter | rknn_batch_size: Passt die Batch-Größe der Eingabe an. Standardwert: None.<br>Bei Werten größer als 1 kann die NPU mehrere Eingabebilder oder Datensätze in einem Inferenzlauf verarbeiten. Beispielsweise hat MobileNet ursprünglich die Eingabeform [1, 224, 224, 3] und Ausgabeform [1, 1001]. Bei rknn_batch_size = 4 werden daraus [4, 224, 224, 3] und [4, 1001].<br>Hinweise:<br>1. rknn_batch_size verbessert die Leistung (Kernauslastung) nur auf NPU-Mehrkernplattformen. Der Wert sollte daher der Anzahl der NPU-Kerne entsprechen.<br>2. Eine Änderung von rknn_batch_size verändert die Eingabe- und Ausgabeformen. Die Eingaben für inference müssen die richtige Größe besitzen; auch die zurückgegebenen Ausgaben sind in der Nachverarbeitung entsprechend zu behandeln. |
| Parameter | auto_hybrid: Aktiviert die automatische gemischte Quantisierung zur Anpassung der Genauigkeit oder Behandlung von Überläufen. Standardwert: False, also keine Anpassung. Während der Modellquantisierung wandelt auto_hybrid Operationen, deren Kosinusabstand und euklidischer Abstand unter den festgelegten Schwellenwerten liegen, in FP16-Berechnungen um (derzeit nur bei 'w8a8'-Quantisierung unterstützt). Wird das Modell nicht quantisiert, wandelt auto_hybrid Operationen außerhalb des FP16-Wertebereichs in INT16-Berechnungen um.<br>Hinweis:<br>1. Die Schwellenwerte lassen sich über auto_hybrid_cos_thresh und auto_hybrid_euc_thresh der Schnittstelle config festlegen. |
| Rückgabewert | 0: Erstellung erfolgreich. |
| Rückgabewert | -1: Erstellung fehlgeschlagen. |

<!-- source EN p16 unit 78 -->

Beispielcode:

<!-- source EN p16 unit 79 -->

```python
# Build and quantize RKNN model
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
```

<!-- source EN p16 unit 80 -->

### 5.2 Hybride Quantisierung

<!-- source EN p16 unit 81 -->

#### 5.2.1 hybrid_quantization_step1

<!-- source EN p16 unit 82 -->

In der ersten Phase der hybriden Quantisierung wird hybrid_quantization_step1 aufgerufen. Die Schnittstelle erzeugt die temporäre Modelldatei (.model), die Datendatei (.data) und die Quantisierungskonfiguration (.quantization.cfg). Schnittstellendetails:

<!-- source EN p16 unit 83 -->

| API | hybrid_quantization_step1 |
| --- | --- |
| Beschreibung | Aus dem geladenen ursprünglichen Modell werden entsprechende temporäre Modelldateien, Datendateien und Quantisierungskonfigurationen erzeugt. |
| Parameter | dataset: Siehe 5.1 „RKNN-Modell aufbauen“. |
| Parameter | rknn_batch_size: Siehe 5.1 „RKNN-Modell aufbauen“. |
| Parameter | proposal: Erzeugt Konfigurationsvorschläge für gemischte Quantisierung. Standardwert: False. |
| Parameter | proposal_dataset_size: Größe des für proposal verwendeten Datensatzes. Standardwert: 1. Da proposal zeitaufwendig ist, beträgt die voreingestellte Größe 1. |
| Parameter | custom_hybrid: Teilgraphen für hybride Quantisierung anhand mehrerer benutzerdefinierter Ein-/Ausgabenamenpaare wählen. Format [[input0_name, output0_name], [input1_name, output1_name], ...]. Standard None.<br>Hinweis: Namen anhand der temporären Modelldatei (.model) wählen. |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source EN p16 unit 84 -->

Beispielcode:

<!-- source EN p16 unit 85 -->

```python
# Call hybrid_quantization_step1 to generate quantization config
ret = rknn.hybrid_quantization_step1(dataset='./dataset.txt')
```

<!-- source EN p16 unit 86 -->

#### 5.2.2 hybrid_quantization_step2

<!-- source EN p16 unit 87 -->

Zur Erzeugung des gemischt quantisierten RKNN-Modells wird hybrid_quantization_step2 aufgerufen. Schnittstellendetails:

<!-- source EN p16 unit 88 -->

| API | hybrid_quantization_step2 |
| --- | --- |
| Beschreibung | Nimmt die temporäre Modelldatei, Datendatei, Quantisierungskonfiguration und den Kalibrierdatensatz entgegen und erzeugt daraus ein gemischt quantisiertes RKNN-Modell. |
| Parameter | model_input: Pfad zur von hybrid_quantization_step1 erzeugten temporären Modelldatei (.model). |
| Parameter | data_input: Pfad zur von hybrid_quantization_step1 erzeugten Modelldatendatei (.data). |
| Parameter | model_quantization_cfg: Pfad zur von hybrid_quantization_step1 erzeugten geänderten Quantisierungskonfigurationsdatei (.quantization.cfg). |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source EN p17 unit 90 -->

Beispielcode:

<!-- source EN p17 unit 91 -->

```python
# Call hybrid_quantization_step2 to generate hybrid quantized RKNN model
ret = rknn.hybrid_quantization_step2(
               model_input='./ssd_mobilenet_v2.model',
               data_input='./ssd_mobilenet_v2.data',
               model_quantization_cfg='./ssd_mobilenet_v2.quantization.cfg')
```

<!-- source EN p18 unit 92 -->

## 6 RKNN-Modell exportieren

<!-- source EN p18 unit 93 -->

Das über build erstellte RKNN-Modell kann zur Bereitstellung in einer Datei gespeichert werden.

<!-- source EN p18 unit 94 -->

| API | export_rknn |
| --- | --- |
| Beschreibung | RKNN-Modell in der angegebenen Datei speichern (Endung ".rknn"). |
| Parameter | export_path: Pfad zur erzeugten RKNN-Modelldatei. |
| Rückgabewert | 0: Export erfolgreich. |
| Rückgabewert | -1: Export fehlgeschlagen. |

<!-- source EN p18 unit 95 -->

Beispielcode:

<!-- source EN p18 unit 96 -->

```python
# save the built RKNN model as a mobilenet_v1.rknn file in the current path
ret = rknn.export_rknn(export_path='./mobilenet_v1.rknn')
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Redaktionelle Hinweise: Protokolle mit SDK 1.5.2 bleiben historische Beispiele, keine V2.5.0-Messungen. Die Python-Zelle für Ubuntu20.04 unterscheidet sich: chinesisch 3.8/3.9, englisch 3.8/3.8; ebenso für Debian11; im ARM64-Abschnitt ist Debian weiterhin als x64 bezeichnet. Quellwerte bleiben erhalten; tatsächliches Installationspaket prüfen. V2.5.0 ergänzt C++ codegen und präzisiert Quantisierung und Speicherstrategien; alte Parameter ersetzen nicht die neue Quelle.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
