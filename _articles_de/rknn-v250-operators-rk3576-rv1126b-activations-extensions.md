---
title: "RKNN2 V2.5.0 · RK3576/RV1126B：Aktivierungen, Normalisierung und Erweiterungen"
description: "RKNN2 V2.5.0 · RK3576/RV1126B：Aktivierungen, Normalisierung und Erweiterungen · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
excerpt: "RKNN2 V2.5.0 · RK3576/RV1126B：Aktivierungen, Normalisierung und Erweiterungen · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
translation_key: "rknn-v250-operators-rk3576-rv1126b-activations-extensions"
slug: "rknn-v250-operators-rk3576-rv1126b-activations-extensions"
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

Quellseiten: CN 263–278; EN 271–286.

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

**RKNN2 V2.5.0 · RK3576/RV1126B：Aktivierungen, Normalisierung und Erweiterungen**

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

## Sigmoid

Die Funktion y=1/(1+exp(-x)) wird elementweise auf den Eingabetensor angewendet, um den Ausgabetensor zu erzeugen.

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

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Tanh

Berechnet den hyperbolischen Tangens jedes Eingabetensorelements.

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Softplus

Wendet Softplus elementweise an, y=ln(exp(x)+1).

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## HardSigmoid

Die Funktion y=max(0,min(1,alpha\*x+beta)) wird elementweise auf den Eingabetensor angewendet, um den Ausgabetensor zu erzeugen, wobei alpha=1/6, beta=0.5.

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

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## HardSwish

Die Funktion y = x \* max(0, min(1, alpha \* x + beta)) = x \* HardSigmoid(x) wird elementweise auf den Eingabetensor angewendet, um den Ausgabetensor zu erzeugen, wobei alpha=1/6, beta=0.5.

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Elu

Die Funktion f(x)=alpha\*(exp(x)-1.) for x&lt;0; f(x)=x for x&gt;=0 wird elementweise auf den Eingabetensor angewendet, um den Ausgabetensor zu erzeugen, wobei alpha=1.

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

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## exSwish

Wendet die Sigmoid Linear Unit elementweise an. Swish heißt auch SiLU: y=x\*sigmoid(x).

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## exMish

Die Funktion mish(x)=xtanh(softplus(x))=xtanh(ln(1+e^{x})) wird elementweise auf den Eingabetensor angewendet, um den Ausgabetensor zu erzeugen.

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

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## exGelu

Die Funktion y = x\*Φ(x) wird elementweise auf den Eingabetensor angewendet, um den Ausgabetensor zu erzeugen. Wird für Φ(x) tanh gewählt, gilt: y = 0.5\*x\*(1+Tanh(sqrt(2/π)\*(x+0.044715\*x^3))).

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

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Sin

Berechnet Sin elementweise für den angegebenen Eingabetensor.

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Datentypbeschränkungen

- T1:float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Cos

Berechnet Cos elementweise für den angegebenen Eingabetensor.

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Datentypbeschränkungen

- T1:float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Where

Wählt Werte aus x\_tensor oder y\_tensor anhand von mask\_tensor: Bei True wird der entsprechende x\_tensor-Wert gewählt, sonst der y\_tensor-Wert.

### Eingaben

- mask\_tensor:T1
    - shape:\[batch,channel,height,width\]
    - Broadcasting-Unterstützung
        - Broadcasting entlang beliebiger Dimensionen wird unterstützt.
    - Broadcasting-Einschränkungen
        - Broadcasting-Einschränkungen wie beim Operator Expand.
- x\_tensor:T2
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Broadcasting entlang beliebiger Dimensionen wird unterstützt.
    - Broadcasting-Einschränkungen
        - Broadcasting-Einschränkungen wie beim Operator Expand.
- y\_tensor:T2
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Broadcasting entlang beliebiger Dimensionen wird unterstützt.
    - Broadcasting-Einschränkungen
        - Broadcasting-Einschränkungen wie beim Operator Expand.

### Ausgaben

- output:T2
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:bool(Tensor)
- T2:int8(Tensor),float16(Tensor)

## exConvStreaming

Zur Latenzsenkung in Sprachmodellen wird die ursprüngliche Faltungseingabe in zeitliche Segmente aufgeteilt. Jedes Segment wird separat gefaltet; die Ergebnisse werden für nachfolgende Frames zwischengespeichert und ermöglichen Streaming-Audioverarbeitung.

### Eingaben

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: derzeit wird width=1 unterstützt.
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
    - dilations\_h∈\[1,32\]
    - dilations\_w∈\[1,32\]

### Datentypbeschränkungen

- T1:float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## exConvStreamingPRelu/LeakyRelu

Fusionierte Berechnung von exConvStreaming und PRelu/LeakyRelu, Output = PRelu(exConvStreaming(Input)) oder Output= LeakyRelu(exConvStreaming(Input)). Beschreibung und Spezifikationsgrenzen entsprechen exConvStreaming.

## exGlu

Gated-Linear-Unit-Funktion: a ist die erste Hälfte der Eingabematrix, b die zweite Hälfte: GLU(a,b)=a⊗σ(b).

### Eingaben

- Input:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung: per-layer

### Ausgaben

- Output:T1
    - shape:\[batch,channel/2,height,width\]
    - Quantisierungsunterstützung: per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Attribute

- axis:int(Standardwert=1)
    - Dimension, entlang der die Eingabe geteilt wird.
    - Einschränkung: nur 1 unterstützt.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## exMatMul

Matrixmultiplikation

```text
Y = A·B + C    if c_type = "add"
Y = A·B * C    if c_type = "mul"
```

### Eingaben

- A:T1
    - shape:\[b,k,1,n\]
        - k ∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer
- B:T1
    - shape:\[b,k,1,m\]
    - Quantisierungsunterstützung
        - per-layer
- C(optional):T1,T2
    - shape:\[b,n,1,m\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Broadcasting entlang beliebiger Dimensionen wird unterstützt.
        - Broadcasting-Einschränkungen wie beim Operator Expand.

### Ausgaben

- Y:T1
    - shape:\[b,n,1,m\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)

### Attribute

- c\_type:strings(Standardwert “add”)
    - add oder mul legt fest, ob C addiert oder multipliziert wird.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: nicht unterstützt.

## exNorm

Führt verschiedene Normalisierungsoperationen auf den Eingabedaten aus. Unterstützt werden drei Typen: LayerNormalization, RMSNormalization und MeanVarianceNormalization:

```text
LayerNorm(x) = ((x - μ) / sqrt(σ^2 + ε)) * W + B
```

```text
RMSNorm(x) = (x / sqrt(RMS^2 + ε)) * W + B
```

```text
MeanVarianceNorm(x) = ((x - μ) / sqrt(Variance + ε)) * W + B
```

Dabei ist x der Eingabevektor. µ und σ2 sind Mittelwert und Varianz des Eingabevektors:

```text
μ = (1/H) * Σ[i=1..H](x_i)
```

```text
σ^2 = (1/H) * Σ[i=1..H]((x_i - μ)^2)
```

RMS ist der quadratische Mittelwert des Eingabevektors:

```text
RMS = sqrt((1/H) * Σ[i=1..H](x_i^2))
```

Variance ist die äquivalente Varianz des Eingabevektors:

```text
Variance = (1/H) * Σ[i=1..H](x_i^2) - μ^2
```

ϵ ist ein kleiner Wert zur Vermeidung einer Division durch null. W und B sind optionale Parameter.

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
- W(optional):T1
    - shape:\[batch,channel,height,width\]
- B(optional):T1
    - shape:\[batch,channel,height,width\]

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]

### Datentypbeschränkungen

- T1:float16(Tensor)

### Attribute

- epsilon: float (Standardwert 1e-05)
    - epsilon-Wert zur Vermeidung einer Division durch 0.
- mode:string
    - Drei Normalization-Modi sind wählbar: layer, rms und mean\_var.
- axes:int64\[\](Standardwert \[1\])
    - Normalisierungsachsen: derzeit nur \[1\] und \[1,2,3\] unterstützt.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## exSDPAttention

Berechnet skalierte Skalarprodukt-Aufmerksamkeit (SDPA) zwischen query, key und value.

### Eingaben

- query:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer
- key:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
- value:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer
- mask(optional):T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Standardmäßig wird Broadcasting entlang beliebiger Dimensionen unterstützt.
        - Bei aktiviertem FA werden nur \[b,c,1,1\],\[1,c,1,1\] und \[1,c,h,w\] unterstützt.
- scale(optional):T3

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: auf RK3576 unterstützt / auf RV1126B nicht unterstützt.
- FlashAttentionV2(FA): unterstützt.
    - Basiert auf https://arxiv.org/abs/2307.08691. Innere Schleifen im Cache beschleunigen die Ausführung und reduzieren die Bandbreitennutzung, vergrößern aber das Modell. Je nach Szenario und Modell über die Aktivierung entscheiden.
    - RKNPU-Treiberversion&gt;=0.9.7
    - Version der RKNPU-Runtime-Bibliothek (librknnrt.so)&gt;=2.1.0
    - Unterstützter Datentyp:float16.

## exWindow

exWindow stammt von window\_partition und window\_reverse aus swin\_transformer. In der Originalarbeit werden Eingabemerkmale in nicht überlappende Fenster der Größe window\_size×window\_size aufgeteilt. Ein- und Ausgabemerkmale müssen eine 4-dimensionale shape haben und in Höhe und Breite aufgeteilt werden. Die PyTorch-Implementierung folgt:

```python
def window_partition(x, window_size):
    """
    Args:
        x: (B, C, H, W)
        window_size (int): window size
    Returns:
        windows: (B, C, num_windows * num_windows, window_size * window_size)
    """
    B, C, H, W = x.shape
    x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
    windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size * window_size)
    return windows

def window_reverse(windows, window_size, H, W):
    """
    Args:
        windows: (B, C, num_windows * num_windows, window_size * window_size)
        window_size (int): Window size
        H (int): Height of image
        W (int): Width of image
    Returns:
        x: (B, C, H, W)
    """
    B, C, _, _ = windows.shape
    x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
    x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
    return x
```

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Attribute

- mode:string
    - Unterstützte Modi:partition,reverse,partition\_num\_first.
        - partition: siehe Implementierung von window\_partition.
        - reverse: siehe Implementierung von window\_reverse.
        - partition\_num\_first unterscheidet sich von partition dadurch, dass H,W nach num\_windows aufgeteilt werden; partition teilt H,W dagegen nach window\_sizes auf.
- window\_sizes:listofints
    - 2-dimensionaler Vektor der Fenstergröße, der Höhe und Breite jedes Fensters festlegt. Auf dieser Größe beruhen Aufmerksamkeitsberechnung und Merkmalsextraktion innerhalb des Fensters.
- num\_windows:listofints
    - 2-dimensionaler Vektor der Fensteranzahl; legt fest, in wie viele Fenster Höhe und Breite der Eingabemerkmale geteilt werden.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.
{% endraw %}
