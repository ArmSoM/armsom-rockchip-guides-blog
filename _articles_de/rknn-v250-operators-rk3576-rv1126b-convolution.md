---
title: "RKNN2 V2.5.0 · RK3576/RV1126B：Grundlagen und Faltungen"
description: "RKNN2 V2.5.0 · RK3576/RV1126B：Grundlagen und Faltungen · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
excerpt: "RKNN2 V2.5.0 · RK3576/RV1126B：Grundlagen und Faltungen · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
translation_key: "rknn-v250-operators-rk3576-rv1126b-convolution"
slug: "rknn-v250-operators-rk3576-rv1126b-convolution"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RK3576/RV1126B"]
---

Diese Plattformreferenz für RKNN2 V2.5.0 unterstützt ArmSoM-Entwickler bei der Modellauswahl und -anpassung. Sie bestätigt keine Unterstützung auf allen ArmSoM-Platinen: SoC, tatsächliche Toolkit2-, Runtime-, NPU-Treiber- und BSP-Versionen müssen geprüft werden. Die Quelle nennt keine einheitliche Linux-Kernel-Version. Es wurden keine ArmSoM-Hardwaretests durchgeführt.

Quelle: die bereitgestellte chinesische und englische RKNN2 Supported Operators and Constraints Reference V2.5.0 mit 374 bzw. 384 Seiten. Chinesisch folgt der chinesischen Ausgabe; Englisch, Russisch und Deutsch folgen der englischen. Plattformgrenzen bleiben getrennt. Das englische PDF enthält chinesische I/O-Abbildungen und Ausgabetabellen; zusätzlich werden editierbare lokalisierte Tabellen bereitgestellt. Schreibweisen wie ConvTranpose und ursprüngliche LSTM/GRU-Gleichungen bleiben erhalten; die Formeln stellen keine Korrekturen der SDK-Implementierung dar.

Quellseiten: CN 220–230; EN 227–237.

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

**RKNN2 V2.5.0 · RK3576/RV1126B：Grundlagen und Faltungen**

[RKNN2 V2.5.0 · RK3576/RV1126B：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk3576-rv1126b-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rk3576-rv1126b-shape-indexing/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rk3576-rv1126b-activations-extensions/)

[RKNN2 V2.5.0 · RK2118：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk2118-convolution/)

[RKNN2 V2.5.0 · RK2118：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk2118-recurrent-pooling/)

[RKNN2 V2.5.0 · RK2118：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rk2118-shape-indexing/)

[RKNN2 V2.5.0 · RK2118：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rk2118-activations-extensions/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rv1103b-rv1106b-convolution/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · Unterstützung und Grenzen der CPU-Operatoren](/de/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · Unterstützung und Grenzen der GPU-Operatoren](/de/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · Modell-I/O, Ausrichtung und Faltungsgrenzen](/de/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## RK3576/RV1126B

## Add

Führt elementweise binäre Addition (C=A+B) mit multidirektionalem Broadcasting nach NumPy-Art aus.

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

- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## AddRelu

Fusionierte Berechnung von Add und Relu, C=Relu(A+B).

### Eingaben

- Wie bei Add.

### Ausgaben

- Wie bei Add.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## BatchNormalization

Führt Batch-Normalisierung des Eingabetensors gemäß https://arxiv.org/abs/1502.03167 aus.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Attribute

- epsilon: float (Standardwert = 1e-5)
    - Reeller Wert, der beim Teilen durch die Standardabweichung eine Division durch 0 verhindert.
    - epsilon∈(0,∞\]
- momentum:float
    - Parameter des gleitenden Mittelwerts beim Training.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Concat

Verknüpft eine Folge von Vektoren entlang axis zu einem Vektor. Alle Dimensionen außer axis müssen übereinstimmen.

### Eingaben

- input\_tensor:T
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Ausgaben

- output:T
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T:int8(Tensor),float16(Tensor)

### Attribute

- axisint64
    - axis∈{0,1,2,3}

## Faltung

Faltung

### Eingaben

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: bei dilated\_kernel\_h&gt;1 gilt width&lt;16383. Zusätzliche Grenzen für die Eingangsbreite der ersten Schicht stehen in der Beschreibung der Modelleingaben.
    - Quantisierungsunterstützung
        - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,31\]
        - kernel\_w∈\[1,31\]
    - Quantisierungsunterstützung
        - per-layer
        - per-channel

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Attribute

- strides:int(strides\_h,strides\_w)
    - stride\_h∈\[1,7\]
    - stride\_w∈\[1,7\]
- pads:int(pads\_top,pads\_left,pads\_bottom,pads\_right)
    - pads\_top∈\[0,15\]
    - pads\_left∈\[0,15\]
    - pads\_bottom∈\[0,15\]
    - pads\_right∈\[0,15\]
- group:int
- dilations:int(dilations\_h,dilations\_w)
    - dilations\_h∈\[1,31\]
    - dilations\_w∈\[1,31\]

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## Depthwise Convolution

Tiefenseparierbare Faltung

### Eingaben

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: bei dilated\_kernel\_h&gt;1 gilt width&lt;16383. Zusätzliche Grenzen für die Eingangsbreite der ersten Schicht stehen in der Beschreibung der Modelleingaben.
    - Quantisierungsunterstützung
        - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,8\]
        - kernel\_w∈\[1,8\]
    - Quantisierungsunterstützung
        - per-layer
        - per-channel

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Attribute

- strides:int(strides\_h,strides\_w)
    - stride\_h∈\[1,7\]
    - stride\_w∈\[1,7\]
- pads:int(pads\_top,pads\_left,pads\_bottom,pads\_right)
    - pads\_top∈\[0,15\]
    - pads\_left∈\[0,15\]
    - pads\_bottom∈\[0,15\]
    - pads\_right∈\[0,15\]
- group:int
- dilations:int(dilations\_h,dilations\_w)
    - dilations\_h∈\[1,32\]
    - dilations\_w∈\[1,32\]

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionRelu

Fusionierte Berechnung von Convolution und Relu, Output=Relu(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionClip

Fusionierte Berechnung von Convolution und Clip, Output=Clip(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionPRelu/LeakyRelu

Fusionierte Berechnung von Convolution und PRelu/LeakyRelu, Output = PRelu(Conv(Input)) oder Output = LeakyRelu(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionAdd

Fusionierte Berechnung von Convolution und Add, Output=Add(Conv(Input0),Input1). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionSigmoid

Fusionierte Berechnung von Convolution und Sigmoid, Output=Sigmoid(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionTanh

Fusionierte Berechnung von Convolution und Tanh, Output=Tanh(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionSoftplus

Fusionierte Berechnung von Convolution und Softplus, Output=Softplus(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionHardSigmoid

Fusionierte Berechnung von Convolution und HardSigmoid, Output=HardSigmoid(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionHardSwish

Fusionierte Berechnung von Convolution und HardSwish, Output=HardSwish(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionElu

Fusionierte Berechnung von Convolution und Elu, Output=Elu(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionSwish

Fusionierte Berechnung von Convolution und Swish, Output=Swish(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionMish

Fusionierte Berechnung von Convolution und Mish, Output=Mish(Conv(Input)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvolutionAddRelu

Fusionierte Berechnung von Convolution und Add und Relu, Output=Relu(Add(Conv(Input0),Input1)). Beschreibung und Spezifikationsgrenzen entsprechen Convolution.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.

## ConvTranspose

Transponierte Faltung

### Eingaben

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: bei dilated\_kernel\_h&gt;1 gilt width&lt;16383. Zusätzliche Grenzen für die Eingangsbreite der ersten Schicht stehen in der Beschreibung der Modelleingaben.
    - Quantisierungsunterstützung
        - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,31\]
        - kernel\_w∈\[1,31\]
    - Quantisierungsunterstützung
        - per-layer
        - per-channel

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Attribute

- strides:int(strides\_h,strides\_w)
    - stride\_h∈\[1,8\]
    - stride\_w∈\[1,8\]
- pads:int(pads\_top,pads\_left,pads\_bottom,pads\_right). Beim Festlegen von pad werden folgende Fälle nicht unterstützt: kernel\_hdilations\_h-dilations\_h-pads\_top&lt;0; kernel\_wdilations\_w-dilations\_w-pads\_left&lt;0; stride\_h(height-1)-pads\_top+1&lt;output\_h; stride\_w(width-1)-pads\_left+1&lt;output\_w.
    - pads\_top∈\[0,15\]
    - pads\_left∈\[0,15\]
    - pads\_bottom∈\[0,15\]
    - pads\_right∈\[0,15\]
- group:int
    - group: nur 1 wird unterstützt; num\_output ist genau dann unterstützt, wenn num\_input=num\_output.
- dilations:int(dilations\_h,dilations\_w)
    - dilations\_h∈\[1,32\]
    - dilations\_w∈\[1,32\]
    - Bei dilation ungleich (1,1) wird nur kernel=(1,1) unterstützt.

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## ConvTranposeRelu

Fusionierte Berechnung von ConvTranspose und Relu, Output=Relu(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeClip

Fusionierte Berechnung von ConvTranspose und Clip, Output=Clip(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposePRelu/LeakyRelu

Fusionierte Berechnung von ConvTranspose und PRelu/LeakyRelu, Output=PRelu(ConvTranspose(Input)) oder Output= LeakyRelu(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeAdd

Fusionierte Berechnung von ConvTranspose und Add, Output=Add(ConvTranspose(Input0),Input1). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeSigmoid

Fusionierte Berechnung von ConvTranspose und Sigmoid, Output=Sigmoid(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeTanh

Fusionierte Berechnung von ConvTranspose und Tanh, Output=Tanh(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeSoftplus

Fusionierte Berechnung von ConvTranspose und Softplus, Output=Softplus(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeHardSigmoid

Fusionierte Berechnung von ConvTranspose und HardSigmoid, Output=HardSigmoid(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeHardSwish

Fusionierte Berechnung von ConvTranspose und HardSwish, Output=HardSwish(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeElu

Fusionierte Berechnung von ConvTranspose und Elu, Output=Elu(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeSwish

Fusionierte Berechnung von ConvTranspose und Swish, Output=Swish(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

## ConvTranposeMish

Fusionierte Berechnung von ConvTranspose und Mish, Output=Mish(ConvTranspose(Input)). Beschreibung und Spezifikationsgrenzen entsprechen ConvTranspose.

{% endraw %}
