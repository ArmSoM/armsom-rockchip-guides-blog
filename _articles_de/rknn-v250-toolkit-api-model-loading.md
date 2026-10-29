---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Caffe, TensorFlow, ONNX und PyTorch laden"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-toolkit-api-model-loading"
slug: "rknn-v250-toolkit-api-model-loading"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Caffe, TensorFlow, ONNX und PyTorch laden | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Caffe, TensorFlow, ONNX und PyTorch laden | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-toolkit-api-model-loading/"
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

<!-- source EN p12 unit 47 -->

## 4 Laden von Modellen 

<!-- source EN p12 unit 48 -->

RKNN-Toolkit2 unterstützt das Laden noch nicht in RKNN umgewandelter Modelle aus Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet und PyTorch. Je Format bestehen unterschiedliche, nachfolgend beschriebene Schnittstellen.

<!-- source EN p12 unit 49 -->

### 4.1 Laden von Modellen Caffe

<!-- source EN p12 unit 50 -->

| API | load_caffe |
| --- | --- |
| Beschreibung | Caffe-Modell laden. (Unter ARM64 nicht verfügbar.) |
| Parameter | model: Pfad zur Caffe-Modellstrukturdatei (Endung ".prototxt"). |
| Parameter | blobs: Pfad zur binären Caffe-Modelldatei (Endung ".caffemodel"). |
| Parameter | input_name: Bei mehreren Eingaben des Caffe-Modells kann hier die Reihenfolge der Eingabeschichtnamen festgelegt werden, beispielsweise ['input1','input2','input3']. Die Namen müssen mit den Modelleingaben übereinstimmen. Standardwert: None; die Reihenfolge wird dann automatisch aus der Caffe-Modelldatei mit Endung .prototxt übernommen. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source EN p12 unit 51 -->

Beispielcode:

<!-- source EN p12 unit 52 -->

```python
# Load the mobilenet_v2 Caffe model in the current path
ret = rknn.load_caffe(model='./mobilenet_v2.prototxt',
                     blobs='./mobilenet_v2.caffemodel')
```

<!-- source EN p12 unit 53 -->

### 4.2 Laden von Modellen TensorFlow

<!-- source EN p12 unit 54 -->

| API | load_tensorflow |
| --- | --- |
| Beschreibung | TensorFlow-Modell laden. (Unter ARM64 nicht verfügbar.) |
| Parameter | tf_pb: Pfad zur TensorFlow-Modelldatei (Endung ".pb"). |
| Parameter | inputs: Eingabeknoten des Modells (Operandennamen); mehrere Knoten werden unterstützt. Alle Zeichenfolgen der Eingabeknoten werden in einer Liste abgelegt. |
| Parameter | input_size_list: Formen der Eingabeknoten, gemeinsam in einer Liste. Für das Modell ssd_mobilenet_v1 muss input_size_list beispielsweise auf [[1,300,300,3]] gesetzt werden. |
| Parameter | outputs: Ausgabeknoten des Modells (Operandennamen); mehrere Knoten werden unterstützt. Alle Ausgabeknoten werden in einer Liste abgelegt. |
| Parameter | input_is_nchw: Gibt an, ob die Modelleingabe bereits im NCHW-Layout vorliegt. Standardwert: False; das Standardlayout ist damit NHWC. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source EN p13 unit 56 -->

Beispielcode:

<!-- source EN p13 unit 57 -->

```python
# Load ssd_mobilenet_v1_coco_2017_11_17 TF model in the current path
ret = rknn.load_tensorflow(tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
                         inputs=['Preprocessor/sub'],
                         outputs=['concat', 'concat_1'],
                         input_size_list=[[300, 300, 3]])
```

<!-- source EN p13 unit 58 -->

### 4.3 Laden von Modellen TensorFlow Lite

<!-- source EN p13 unit 59 -->

| API | load_tflite |
| --- | --- |
| Beschreibung | TensorFlow-Lite-Modell laden. (Unter ARM64 nicht verfügbar.) |
| Parameter | model: Pfad zur TensorFlow-Lite-Modelldatei (Endung ".tflite"). |
| Parameter | input_is_nchw: Gibt an, ob die Modelleingabe bereits im NCHW-Layout vorliegt. Standardwert: False; das Standardlayout ist damit NHWC. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source EN p13 unit 60 -->

Beispielcode:

<!-- source EN p13 unit 61 -->

```python
# Load the mobilenet_v1 TF-Lite model in the current path
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

<!-- source EN p13 unit 62 -->

### 4.4 Laden von Modellen ONNX

<!-- source EN p13 unit 63 -->

| API | load_onnx |
| --- | --- |
| Beschreibung | ONNX-Modell laden. |
| Parameter | model: Pfad zur ONNX-Modelldatei (Endung ".onnx"). |
| Parameter | inputs: Eingabeknoten des Modells (Operandennamen); mehrere Knoten werden unterstützt. Alle Zeichenfolgen der Eingabeknoten werden in einer Liste abgelegt. Standardwert: None; die Knoten werden aus dem Modell übernommen. |
| Parameter | input_size_list: Formen der Eingabeknoten, gemeinsam in einer Liste. Wenn inputs gesetzt wird, muss auch input_size_list gesetzt werden. Standardwert: None. |
| Parameter | input_initial_val: Anfangswerte der Modelleingaben als ndarray-Liste. Standardwert: None.<br>Hauptsächlich dazu gedacht, einige Eingaben als Konstanten festzulegen. Eingaben, die nicht konstant sein sollen, können auf None gesetzt werden, etwa [None, np.array([1])]. |
| Parameter | outputs: Ausgabeknoten des Modells (Operandennamen); mehrere Knoten werden unterstützt. Alle Ausgabeknoten werden in einer Liste abgelegt. Standardwert: None; sie werden aus dem Modell übernommen. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source EN p14 unit 65 -->

Beispielcode:

<!-- source EN p14 unit 66 -->

```python
# Load the arcface onnx model in the current path
ret = rknn.load_onnx(model='./arcface.onnx')
```

<!-- source EN p14 unit 67 -->

### 4.5 Laden von Modellen DarkNet

<!-- source EN p14 unit 68 -->

| API | load_darknet |
| --- | --- |
| Beschreibung | DarkNet-Modell laden. (Unter ARM64 nicht verfügbar.) |
| Parameter | model: Pfad zur DarkNet-Modellstrukturdatei (Endung ".cfg"). |
| Parameter | weight: Pfad zur Gewichtsdatei (Endung ".weight"). |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source EN p14 unit 69 -->

Beispielcode:

<!-- source EN p14 unit 70 -->

```python
# Load the yolov3-tiny DarkNet model in the current path
ret = rknn.load_darknet(model='./yolov3-tiny.cfg',
                       weight= './yolov3.weights')
```

<!-- source EN p14 unit 71 -->

### 4.6 Laden von Modellen PyTorch

<!-- source EN p14 unit 72 -->

| API | load_pytorch |
| --- | --- |
| Beschreibung | PyTorch-Modell laden.<br>Modelle mit quantisierungsbewusstem Training (Quantization Aware Training, QAT) werden unterstützt; dafür muss torch auf Version '1.9.0' oder höher aktualisiert werden. |
| Parameter | model: Pfad zur PyTorch-Modellstrukturdatei (Endung ".pt"); erforderlich ist ein Modell im torchscript-Format. |
| Parameter | input_size_list: Formen der Eingabeknoten, gemeinsam in einer Liste. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source EN p14 unit 73 -->

Beispielcode:

<!-- source EN p14 unit 74 -->

```python
# Load the PyTorch model resnet18 in the current path
ret = rknn.load_pytorch(model='./resnet18.pt',
                       input_size_list=[[1,3,224,224]])
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Redaktionelle Hinweise: Protokolle mit SDK 1.5.2 bleiben historische Beispiele, keine V2.5.0-Messungen. Die Python-Zelle für Ubuntu20.04 unterscheidet sich: chinesisch 3.8/3.9, englisch 3.8/3.8; ebenso für Debian11; im ARM64-Abschnitt ist Debian weiterhin als x64 bezeichnet. Quellwerte bleiben erhalten; tatsächliches Installationspaket prüfen. V2.5.0 ergänzt C++ codegen und präzisiert Quantisierung und Speicherstrategien; alte Parameter ersetzen nicht die neue Quelle.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
