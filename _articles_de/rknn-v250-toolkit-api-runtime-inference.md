---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Laufzeit, Operatorregistrierung und Inferenz"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-toolkit-api-runtime-inference"
slug: "rknn-v250-toolkit-api-runtime-inference"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Laufzeit, Operatorregistrierung und Inferenz | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Laufzeit, Operatorregistrierung und Inferenz | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-toolkit-api-runtime-inference/"
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

<!-- source EN p19 unit 97 -->

## 7 Laufzeitinitialisierung und Inferenz

<!-- source EN p19 unit 98 -->

### 7.1 RKNN-Modell laden

<!-- source EN p19 unit 99 -->

| API | load_rknn |
| --- | --- |
| Beschreibung | RKNN-Modell laden.<br>Danach entfallen Modellkonfiguration, Laden des ursprünglichen Modells und Erstellen des RKNN-Modells. Das geladene Modell kann nur mit angeschlossener NPU-Hardware für Inferenz oder Leistungsmessdaten verwendet werden, nicht für Simulator oder Genauigkeitsanalyse. |
| Parameter | path: Pfad zur RKNN-Modelldatei. |
| Rückgabewert | 0: Laden erfolgreich. |
| Rückgabewert | -1: Laden fehlgeschlagen. |

<!-- source EN p19 unit 100 -->

Beispielcode:

<!-- source EN p19 unit 101 -->

```python
# Load the mobilenet_v1 RKNN model in the current path
ret = rknn.load_rknn(path='./mobilenet_v1.rknn')
```

<!-- source EN p19 unit 102 -->

### 7.2 Laufzeitumgebung initialisieren

<!-- source EN p19 unit 103 -->

Vor Inferenz oder Leistungsbewertung die Laufzeitumgebung initialisieren. Diese Schnittstelle legt deren Typ fest: Hardwareplattform oder Softwaresimulator.

<!-- source EN p19 unit 104 -->

| API | init_runtime |
| --- | --- |
| Beschreibung | Laufzeitumgebung initialisieren. |
| Parameter | target: Ziel-Hardwareplattform. Unterstützt werden 'rv1103', 'rv1103b', 'rv1106', 'rv1106b', 'rv1126b', 'rk3562', 'rk3566', 'rk3568', 'rk3576' und 'rk3588'. Standardwert: "None"; das Modell läuft damit im Simulator.<br>Hinweis: Bei target = None muss zuerst build oder hybrid_quantization aufgerufen werden. |
| Parameter | device_id: Gerätekennung. Wenn mehrere Geräte am PC angeschlossen sind, muss dieser Parameter angegeben werden. Er lässt sich über list_devices ermitteln. Standardwert: None. |
| Parameter | perf_debug: Debug-Modus für die Leistungsbewertung. Damit lässt sich die Laufzeit jedes Layers ermitteln; andernfalls wird nur die Gesamtlaufzeit des Modells ausgegeben. Standardwert: False. |
| Parameter | eval_mem: Aktiviert den Speicherbewertungsmodus. Bei True kann anschließend eval_memory aufgerufen werden, um den Speicherverbrauch während der Modellausführung zu ermitteln. Standardwert: False. |
| Parameter | async_mode: Gibt an, ob der asynchrone Modus verwendet werden soll. Standardwert: False.<br>inference umfasst das Setzen des Eingabebildes, die Modellausführung und das Abholen des Ergebnisses. Im asynchronen Modus erfolgt das Setzen der aktuellen Eingabe gleichzeitig mit der Inferenz des vorherigen Frames. Mit Ausnahme des ersten Frames lässt sich dadurch die Eingabevorbereitung jedes weiteren Frames überlappen, was die Leistung verbessert. Das jeweils zurückgegebene Ergebnis gehört zum vorherigen Frame. (Noch nicht unterstützt.) |
| Parameter | core_mask: Legt die NPU-Kerne zur Laufzeit fest. Unterstützt werden RK3588 / RK3576 mit folgenden Konfigurationen:<br>RKNN.NPU_CORE_AUTO: automatische Planung; das Modell läuft auf einem aktuell freien NPU-Kern.<br>RKNN.NPU_CORE_0: Ausführung auf NPU0.<br>RKNN.NPU_CORE_1: Ausführung auf NPU1.<br>RKNN.NPU_CORE_2: Ausführung auf NPU2.<br>RKNN.NPU_CORE_0_1: gleichzeitige Ausführung auf NPU0 und NPU1.<br>RKNN.NPU_CORE_0_1_2: gleichzeitige Ausführung auf NPU0, NPU1 und NPU2.<br>RKNN.NPU_CORE_ALL: Die Anzahl verwendeter NPU-Kerne hängt von der Plattform ab.<br>Standardwert: "RKNN.NPU_CORE_AUTO".<br>Hinweis: RK3576 besitzt nur 2 Kerne; NPU_CORE_2 und NPU_CORE_0_1_2 dürfen daher nicht gesetzt werden. |
| Parameter | fallback_prior_device: Bevorzugtes Ausweichgerät für eine von der NPU nicht unterstützte OP. Unterstützt werden 'gpu' und 'cpu'; 'gpu' gilt nur für Plattformen mit GPU-Hardware. Standardwert: 'cpu'. |
| Rückgabewert | 0: Laufzeitumgebung erfolgreich initialisiert. |
| Rückgabewert | -1: Initialisierung der Laufzeitumgebung fehlgeschlagen. |

<!-- source EN p20 unit 106 -->

Beispielcode:

<!-- source EN p20 unit 107 -->

```python
# Initialize the runtime environment
ret = rknn.init_runtime(target='rk3566')
```

<!-- source EN p20 unit 108 -->

### 7.3 Benutzerdefinierten Operator registrieren

<!-- source EN p20 unit 109 -->

Diese Schnittstelle registriert einen benutzerdefinierten Operator.

<!-- source EN p20 unit 110 -->

| API | reg_custom_op |
| --- | --- |
| Beschreibung | Benutzerdefinierten Operator registrieren; nur für ONNX-Modelle unterstützt. |
| Parameter | custom_op: Benutzerdefinierte Operatorklasse für einen neuen OP außerhalb der ONNX-OP-Spezifikation. op_type des neuen OP sollte mit 'cst' beginnen; die Funktionen shape_infer und compute müssen vom Benutzer implementiert werden.<br>Hinweis: Die Klasse custom_op dient nur der Modellkonvertierung und Erzeugung von RKNN-Modellen mit benutzerdefinierten Operatoren. Für die Bereitstellung auf dem Gerät ist zusätzlich Kapitel 5.5 des 'RKNN SDK User Guide' zu beachten. |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source EN p21 unit 111 -->

Beispielcode:

<!-- source EN p21 unit 112 -->

```python
import numpy as np
from rknn.api.custom_op import get_node_attr
class cstSoftmax:
    op_type = 'cstSoftmax'
    def shape_infer(self, node, in_shapes, in_dtypes):
        out_shapes = in_shapes.copy()
        out_dtypes = in_dtypes.copy()
        return out_shapes, out_dtypes
    def compute(self, node, inputs):
        x = inputs[0]
        axis = get_node_attr(node, 'axis')
        x_max = np.max(x, axis=axis, keepdims=True)
        tmp = np.exp(x - x_max)
        s = np.sum(tmp, axis=axis, keepdims=True)
        outputs = [tmp / s]
        return outputs

ret = rknn.reg_custom_op(cstSoftmax)
```

<!-- source EN p21 unit 113 -->

### 7.4 Inferenz mit dem RKNN-Modell

<!-- source EN p21 unit 114 -->

Diese Schnittstelle startet die RKNN-Modellinferenz und liefert deren Ergebnis.

<!-- source EN p21 unit 115 -->

| API | inference |
| --- | --- |
| Beschreibung | Mit dem Modell und den angegebenen Eingaben eine Inferenz durchführen und das Ergebnis abrufen.<br>Wenn bei der Initialisierung target auf Rockchip NPU gesetzt wurde, erfolgt die Inferenz auf der angegebenen Hardwareplattform. Ohne target wird der Simulator verwendet. |
| Parameter | inputs: Liste der zu inferierenden Eingaben. Der Objekttyp ist ndarray. |
| Parameter | data_format: Liste der Eingabedatenlayouts: "nchw" oder "nhwc"; nur bei 4-dimensionalen Eingaben wirksam. Standardwert: None; alle Eingaben verwenden dann "nhwc". |
| Parameter | inputs_pass_through: pass_through-Flag. Standardwert: None; für alle Eingaben ist pass_through damit deaktiviert.<br>Ohne pass_through zieht das Werkzeug vor der Übergabe an den NPU-Treiber den Mittelwert ab, dividiert durch die Varianz usw.; mit pass_through entfallen diese Operationen.<br>Der Parameter ist eine Liste. Soll beispielsweise input0 direkt durchgereicht werden, input1 jedoch nicht, lautet der Wert [1, 0]. |
| Rückgabewert | results: Inferenzergebnis als ndarray-Liste. |

<!-- source EN p21 unit 116 -->

Beispielcode:

<!-- source EN p21 unit 117 -->

Für ein Klassifikationsmodell wie mobilenet_v1 folgt dieser Code; der vollständige Code wird in der Quelle unter example/tfilte/mobilenet_v1 angegeben. Die Schreibweise tfilte bleibt als Quellangabe erhalten.

<!-- source EN p21 unit 118 -->

```python
# Preform inference for a picture with a model and get a top-5 result
outputs = rknn.inference(inputs=[img])
show_outputs(outputs)
```

<!-- source EN p22 unit 119 -->

Beispielergebnis für top-5:

<!-- source EN p22 unit 120 -->

```text
-----TOP 5-----
[ 156] score:0.928223 class:"Shih-Tzu"
[ 155] score:0.063171 class:"Pekinese, Pekingese, Peke"
[ 205] score:0.004299 class:"Lhasa, Lhasa apso"
[ 284] score:0.003096 class:"Persian cat"
[ 285] score:0.000171 class:"Siamese cat, Siamese"
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Redaktionelle Hinweise: Protokolle mit SDK 1.5.2 bleiben historische Beispiele, keine V2.5.0-Messungen. Die Python-Zelle für Ubuntu20.04 unterscheidet sich: chinesisch 3.8/3.9, englisch 3.8/3.8; ebenso für Debian11; im ARM64-Abschnitt ist Debian weiterhin als x64 bezeichnet. Quellwerte bleiben erhalten; tatsächliches Installationspaket prüfen. V2.5.0 ergänzt C++ codegen und präzisiert Quantisierung und Speicherstrategien; alte Parameter ersetzen nicht die neue Quelle.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
