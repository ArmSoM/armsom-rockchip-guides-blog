---
title: "RKNN2 V2.5.0 · RV1103B/RV1106B：Rekurrente Netze, Arithmetik und Pooling"
description: "RKNN2 V2.5.0 · RV1103B/RV1106B：Rekurrente Netze, Arithmetik und Pooling · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
excerpt: "RKNN2 V2.5.0 · RV1103B/RV1106B：Rekurrente Netze, Arithmetik und Pooling · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
translation_key: "rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling"
slug: "rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RV1103B/RV1106B"]
---

Diese Plattformreferenz für RKNN2 V2.5.0 unterstützt ArmSoM-Entwickler bei der Modellauswahl und -anpassung. Sie bestätigt keine Unterstützung auf allen ArmSoM-Platinen: SoC, tatsächliche Toolkit2-, Runtime-, NPU-Treiber- und BSP-Versionen müssen geprüft werden. Die Quelle nennt keine einheitliche Linux-Kernel-Version. Es wurden keine ArmSoM-Hardwaretests durchgeführt.

Quelle: die bereitgestellte chinesische und englische RKNN2 Supported Operators and Constraints Reference V2.5.0 mit 374 bzw. 384 Seiten. Chinesisch folgt der chinesischen Ausgabe; Englisch, Russisch und Deutsch folgen der englischen. Plattformgrenzen bleiben getrennt. Das englische PDF enthält chinesische I/O-Abbildungen und Ausgabetabellen; zusätzlich werden editierbare lokalisierte Tabellen bereitgestellt. Schreibweisen wie ConvTranpose und ursprüngliche LSTM/GRU-Gleichungen bleiben erhalten; die Formeln stellen keine Korrekturen der SDK-Implementierung dar.

Quellseiten: CN 324–331; EN 334–341.

[Rockchip RKNN2](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<details markdown="1">
<summary>Operatorreferenz-Serie</summary>

[RKNN2 V2.5.0 · RK3566/RK3568：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk3566-rk3568-convolution/)

[RKNN2 V2.5.0 · RK3566/RK3568：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk3566-rk3568-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3566/RK3568：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rk3566-rk3568-shape-indexing/)

[RKNN2 V2.5.0 · RK3566/RK3568：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rk3566-rk3568-activations-extensions/)

[RKNN2 V2.5.0 · RK3588：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk3588-convolution/)

[RKNN2 V2.5.0 · RK3588：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk3588-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3588：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rk3588-shape-indexing/)

[RKNN2 V2.5.0 · RK3588：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rk3588-activations-extensions/)

[RKNN2 V2.5.0 · RK3562：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk3562-convolution/)

[RKNN2 V2.5.0 · RK3562：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk3562-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3562：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rk3562-shape-indexing/)

[RKNN2 V2.5.0 · RK3562：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rk3562-activations-extensions/)

[RKNN2 V2.5.0 · RV1103/RV1106：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rv1103-rv1106-convolution/)

[RKNN2 V2.5.0 · RV1103/RV1106：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rv1103-rv1106-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103/RV1106：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rv1103-rv1106-shape-indexing/)

[RKNN2 V2.5.0 · RV1103/RV1106：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rv1103-rv1106-activations-extensions/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk3576-rv1126b-convolution/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk3576-rv1126b-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rk3576-rv1126b-shape-indexing/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rk3576-rv1126b-activations-extensions/)

[RKNN2 V2.5.0 · RK2118：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk2118-convolution/)

[RKNN2 V2.5.0 · RK2118：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk2118-recurrent-pooling/)

[RKNN2 V2.5.0 · RK2118：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rk2118-shape-indexing/)

[RKNN2 V2.5.0 · RK2118：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rk2118-activations-extensions/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rv1103b-rv1106b-convolution/)

**RKNN2 V2.5.0 · RV1103B/RV1106B：Rekurrente Netze, Arithmetik und Pooling**

[RKNN2 V2.5.0 · RV1103B/RV1106B：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · Unterstützung und Grenzen der CPU-Operatoren](/de/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · Unterstützung und Grenzen der GPU-Operatoren](/de/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · Modell-I/O, Ausrichtung und Faltungsgrenzen](/de/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Div

Führt elementweise binäre Division (C=A/B) mit multidirektionalem Broadcasting nach NumPy-Art aus.

### Eingaben

- A:T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - \[b,c,1,1\]
        - \[scalar\]
- B:T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - \[b,c,1,1\]
        - \[scalar\]

### Ausgaben

- C:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:float16(Tensor)
- T2:float(constTensor)

## Expand

Erweitert den Eingabetensor anhand von shape und Broadcasting-Regeln, ähnlich numpy.array(input) \*numpy.ones(shape): Dimensionen werden rechtsbündig ausgerichtet; korrespondierende Dimensionen müssen gleich sein oder eine davon muss 1 sein.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
- shape:T2
    - shape:\[batch,channel,height,width\]

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor)
- T2:int64(Tensor)

Broadcasting-Einschränkungen

- \[b,c,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,1,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,c,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,1,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,c,1,1\]-&gt;\[b,c,h,w\],h∈\[1,8192\],w ∈\[1,8192\]

## Max

Berechnet das elementweise Maximum der Eingabetensoren.

### Eingaben

- A:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Broadcasting entlang beliebiger Dimensionen wird unterstützt.
        - Broadcasting-Einschränkungen wie beim Operator Expand.
- B:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Broadcasting entlang beliebiger Dimensionen wird unterstützt.
        - Broadcasting-Einschränkungen wie beim Operator Expand.

### Ausgaben

- C:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer/per-channel

### Datentypbeschränkungen

- T1:int8(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Mul

Führt elementweise binäre Multiplikation (C=A\*B) mit multidirektionalem Broadcasting nach NumPy-Art aus.

### Eingaben

- A:T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Broadcasting entlang beliebiger Dimensionen wird unterstützt.
        - Broadcasting-Einschränkungen wie beim Operator Expand.
- B:T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Broadcasting entlang beliebiger Dimensionen wird unterstützt.
        - Broadcasting-Einschränkungen wie beim Operator Expand.

### Ausgaben

- C:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor)
- T2:float(constTensor)

## MulRelu

Fusionierte Berechnung von Mul und Relu,C=Relu(A\*B).

### Eingaben

- Wie bei Mul.

### Ausgaben

- Wie bei Mul.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: unterstützt.

## Pad

Erzeugt aus Datentensor (data), Tensor der Auffüllwerte an Achsenanfang und -ende (pads), Modus (mode) und konstantem Wert (constant\_value) einen aufgefüllten Tensor (output).

### Eingaben

- data:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
- pads:T2
    - shape : \[batch\_begin, channel\_begin, height\_begin, width\_begin, batch\_end, channel\_end,height\_end,width\_end\]
- constant\_value(optional):T3
    - shape:\[1\]
    - Quantisierungsunterstützung
        - per-layer

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)

### Attribute

- mode:string (Standardwert constant)
    - Unterstützte Modi: constant,reflect.
        - constant: uneingeschränkt.
        - reflectchannel∈(0,8192\],height∈(0,8192\],width∈(0,8176\]

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## MaxPool

MaxPool verarbeitet Eingabetensor X und wendet Max-Pooling anhand von Kernelgröße, Schrittweite und pad-Längen an. Für durch den Kernel bestimmte Teilmengen wird das Maximum berechnet und in den herunterabgetasteten Ausgabetensor Y zur weiteren Verarbeitung übernommen. Die räumliche Ausgabeform hängt von explizitem Padding (pads) oder automatischem Padding (auto\_pad) ab. Hier wird ausschließlich explizites Padding verwendet.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,7\]
        - width∈(0,7\]

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]

### Attribute

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - Padding-Modus: nur NOTSET unterstützt.
- ceil\_mode:int64
    - Berechnung der Ausgabe-shape mit ceil oder floor: nicht unterstützt.
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad, ob pad-Werte in die Berechnung eingehen:1.
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]

### Datentypbeschränkungen

- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## GlobalMaxPool

GlobalMaxPool wendet Max-Pooling auf die Werte jedes Kanals von Eingabetensor X an. Dies entspricht MaxPool mit kernel\_shape gleich den räumlichen Dimensionen von input.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,7\]
        - width∈(0,7\]

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]

### Attribute

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - Padding-Modus: nur NOTSET unterstützt.
- ceil\_mode:int64
    - Berechnung der Ausgabe-shape mit ceil oder floor: nicht unterstützt.
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad, ob pad-Werte in die Berechnung eingehen:1.
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]

### Datentypbeschränkungen

- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## AveragePool

- Nicht unterstützt (vom Werkzeug in eine Faltung umgewandelt).

## GlobalAveragePool

- Nicht unterstützt (vom Werkzeug in eine Faltung umgewandelt).
{% endraw %}
