---
title: "RKNN2 V2.5.0 · RK3588：Formen, Slicing und Transposition"
description: "RKNN2 V2.5.0 · RK3588：Formen, Slicing und Transposition · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
excerpt: "RKNN2 V2.5.0 · RK3588：Formen, Slicing und Transposition · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
translation_key: "rknn-v250-operators-rk3588-shape-indexing"
slug: "rknn-v250-operators-rk3588-shape-indexing"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RK3588"]
---

Diese Plattformreferenz für RKNN2 V2.5.0 unterstützt ArmSoM-Entwickler bei der Modellauswahl und -anpassung. Sie bestätigt keine Unterstützung auf allen ArmSoM-Platinen: SoC, tatsächliche Toolkit2-, Runtime-, NPU-Treiber- und BSP-Versionen müssen geprüft werden. Die Quelle nennt keine einheitliche Linux-Kernel-Version. Es wurden keine ArmSoM-Hardwaretests durchgeführt.

Quelle: die bereitgestellte chinesische und englische RKNN2 Supported Operators and Constraints Reference V2.5.0 mit 374 bzw. 384 Seiten. Chinesisch folgt der chinesischen Ausgabe; Englisch, Russisch und Deutsch folgen der englischen. Plattformgrenzen bleiben getrennt. Das englische PDF enthält chinesische I/O-Abbildungen und Ausgabetabellen; zusätzlich werden editierbare lokalisierte Tabellen bereitgestellt. Schreibweisen wie ConvTranpose und ursprüngliche LSTM/GRU-Gleichungen bleiben erhalten; die Formeln stellen keine Korrekturen der SDK-Implementierung dar.

Quellseiten: CN 97–110; EN 100–113.

[Rockchip RKNN2](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<details markdown="1">
<summary>Operatorreferenz-Serie</summary>

[RKNN2 V2.5.0 · RK3566/RK3568：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk3566-rk3568-convolution/)

[RKNN2 V2.5.0 · RK3566/RK3568：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk3566-rk3568-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3566/RK3568：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rk3566-rk3568-shape-indexing/)

[RKNN2 V2.5.0 · RK3566/RK3568：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rk3566-rk3568-activations-extensions/)

[RKNN2 V2.5.0 · RK3588：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk3588-convolution/)

[RKNN2 V2.5.0 · RK3588：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk3588-recurrent-pooling/)

**RKNN2 V2.5.0 · RK3588：Formen, Slicing und Transposition**

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

[RKNN2 V2.5.0 · RV1103B/RV1106B：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · Unterstützung und Grenzen der CPU-Operatoren](/de/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · Unterstützung und Grenzen der GPU-Operatoren](/de/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · Modell-I/O, Ausrichtung und Faltungsgrenzen](/de/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Relu

Setzt negative Eingabetensorwerte auf null; positive Werte bleiben unverändert.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Keine

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Clip/ReLU6

Begrenzt Eingabetensorwerte auf \[0,6\].

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Keine

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## PRelu

Skaliert negative Eingabetensorwerte mit einem lernbaren Parameter; positive Werte bleiben unverändert.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer/per-channel
    - Broadcasting-Unterstützung
        - Keine

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer/per-channel

### Attribute

- slope: PRelu-Koeffizient.
    - Nur ein einzelner Skalar oder Koeffizienten entlang der C-Dimension werden unterstützt.

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## LeakyRelu

Skaliert negative Eingabetensorwerte mit einem festen Faktor; positive Werte bleiben unverändert.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
    - Broadcasting-Unterstützung
        - Keine

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Reshape

Liefert einen Tensor der angegebenen Form ohne Änderung der Eingabedaten oder Elementanzahl.

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

- shape:int
    - Legt die Form des Ausgabetensors fest.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Resize

Ändert die Größe des Eingabetensors. Im Allgemeinen wird jeder Ausgabewert als gewichteter Mittelwert einer Nachbarschaft (Abtastpositionen) im Eingabetensor berechnet.

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
- roi(optional):T2
    - Derzeit nicht unterstützt.
- scales(optional):T2
    - Array der Skalierungsfaktoren je Dimension.
- sizes(optional):T3
    - Zielgröße des Ausgabetensors.

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)

### Attribute

- antialias:int (Standardwert 0)
    - Die Einstellung wird derzeit nicht unterstützt.
- axes:int\[\]
    - Die Einstellung wird derzeit nicht unterstützt.
- coordinate\_transformation\_mode:strings (Standardwert ”half\_pixel”)
    - Derzeit werden nur half\_pixel, pytorch\_half\_pixel und align\_corners unterstützt.
- cubic\_coeff\_a: float (Standardwert -0.75)
    - Die Einstellung wird derzeit nicht unterstützt.
- exclude\_outside:int (Standardwert 0)
    - Die Einstellung wird derzeit nicht unterstützt.
- extrapolation\_value:float (Standardwert 0)
    - Die Einstellung wird derzeit nicht unterstützt.
- keep\_aspect\_ratio\_policy:strings (Standardwert ”stretch”)
    - Die Einstellung wird derzeit nicht unterstützt.
- mode:strings (Standardwert ”nearest”)
    - Derzeit sind nur nearest und linear konfigurierbar.
- nearest\_mode:strings (Standardwert ”round\_prefer\_floor”)
    - Die Einstellung wird derzeit nicht unterstützt. Hinweis zur Unterstützung: Derzeit ist nur ganzzahlige Skalierung in Breiten- und Höhenrichtung mit einem Faktor von 2–8 unterstützt. Eine Eingabe (1,c,1,1) lässt sich auf (1,c,h,w) vergrößern.
- Zusammenarbeit mehrerer Kerne: nicht unterstützt.

## Slice

Erzeugt einen Ausschnitt des aktuellen Vektors nach den Regeln von NumPy-Slicing.

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

- starts:int(Tensor)
    - Startposition des Ausschnitts: uneingeschränkt.
- ends:int(Tensor)
    - Endposition des Ausschnitts: uneingeschränkt.
- axes:int(Tensor)
    - Auswahl der Slice-Achsen: beliebige Achsen 0~3, auch mehrere gleichzeitig.
- steps:int(Tensor)
    - Legt die Schrittweite entlang der jeweiligen Slice-Achse fest.
    - Bei height\*width==1&amp;&amp;channel%subc==0&amp;&amp;starts\[1\]%subc==0&amp;&amp;ends\[1\]%subc==0&amp;&amp;steps\[1\]&lt;=subc darf steps von 1 abweichen. Andernfalls läuft SliceOP nur bei steps==\[1,1,1,1\] auf der NPU.

## Softmax

Dieser Operator berechnet normalisierte Exponentialwerte der Eingabe:

Softmax(input, axis) = exp(input − max(input, axis)) / Σ\_axis exp(input − max(input, axis))

Das Attribut “axis” legt die Dimension der Softmax-Berechnung fest. Der Ausgabetensor besitzt dieselbe Form und enthält die Softmax-Werte der entsprechenden Eingaben.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
        - Es gelten die Spezifikationsgrenzen von transpose.

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Attribute

- axis:int
    - softmax-Achse:1,3, entsprechend channel und width.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## exSoftmax13

Dieser Operator berechnet normalisierte Exponentialwerte der Eingabe:

exSoftmax13(input, axis) = exp(input − max(input, axis)) / Σ\_axis exp(input − max(input, axis))

Das Attribut “axis” legt die Dimension der Softmax-Berechnung fest. Der Ausgabetensor besitzt dieselbe Form und enthält die Softmax-Werte der entsprechenden Eingaben.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
        - Es gelten die Spezifikationsgrenzen von transpose.

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Attribute

- axis:int64
    - softmax-Achse:1,3, entsprechend channel und width.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## exSoftmaxMask

Dieser Operator berechnet normalisierte Exponentialwerte der Eingabe:

```text
input(x, mask_t, mask_value) =
    x + (mask_t - 1) * inf       if mask_value = 0
    x + mask_t * (-inf)          elif mask_value = 1
```

```text
exSoftmaxMask(input, axis) = exp(input - max(input, axis)) / Σ_axis(exp(input - max(input, axis)))
```

Das Attribut “axis” legt die Dimension der Softmax-Berechnung fest. Der Ausgabetensor besitzt dieselbe Form und enthält die Softmax-Werte der entsprechenden Eingaben.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
        - Es gelten die Spezifikationsgrenzen von transpose.
- mask(optional):T1
    - shape:\[1,channel,height,width\]
        - channel∈(0,8192\]
        - width: bei axis=1 ohne Einschränkung; bei axis=3/-1 width∈(0,8192\].

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Attribute

- axis:int64
    - softmax-Achse:1,3, entsprechend channel und width.
- mask\_value:int64
    - Zu maskierende Werte:0,1.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Split

Teilt den Vektor entlang axis in num\_outputs Vektoren; split legt deren Größen entlang axis fest.

### Eingaben

- input\_tensor:T
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Ausgaben

- output:T
    - Ein oder mehrere Ausgabektoren, bestimmt durch num\_outputs.
    - shape: durch die Aufteilung bestimmt.
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T:int8(Tensor),float16(Tensor)

### Attribute

- axis:int
    - axis∈{0,1,2,3}
- num\_outputs:int
- split:int(Tensor)

## Sub

- Führt elementweise binäre Subtraktion (C=A-B) mit multidirektionalem Broadcasting im NumPy-Stil aus.

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

- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: nicht unterstützt.

## Tile

Erzeugt durch Wiederholung des gegebenen Tensors einen Tensor, wie NumPy tile, jedoch ohne Broadcasting.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
- repeats:T2
    - shape:\[batch,channel,height,width\]

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: nicht unterstützt.

## Transpose

Transponiert den Eingabetensor.

### Eingaben

- X:T1
    - shape:\[n1,c1,h1,w1\]
        - Detaillierte Einschränkungen stehen in der Attributliste.
    - Quantisierungsunterstützung
        - per-layer

### Ausgaben

- Y:T1,T2
    - shape:\[n2,c2,h2,w2\]
        - Detaillierte Einschränkungen stehen in der Attributliste.
    - Quantisierungsunterstützung
        - per-layer

### Attribute

- perm, Reihenfolge der transponierten Achsen: Einschränkungen für unterschiedliche perm folgen (p=8192,q=2048).
    - perm=\[0,1,2,3\]
        - Uneingeschränkt
    - perm=\[0,1,3,2\]
        - T1:h1%16=0,h1w1&lt;16p,h1w1&lt;2q
        - T2:h1%8=0,h1w1&lt;8p,h1w1&lt;2q
    - perm=\[0,2,3,1\]
        - T1:c1&lt;8192,h1w1%8=0,w1c1&lt;p\*16
        - T2:c1&lt;8192,h1w1%8=0,w1c1&lt;p\*8
    - perm=\[0,2,1,3\]
        - T1:h1%16=0,h1w1&lt;16p,h1w1&lt;2q,c1\*w1&lt;p
        - T2:h1%8=0,h1w1&lt;8p,h1w1&lt;2q,c1\*w1&lt;p
    - perm=\[0,3,1,2\]
        - T1,T2:h1w1&lt;p,w1&lt;8192,h1c1&lt;p
    - perm=\[0,3,2,1\]
        - T1:h1%16=0,h1w1&lt;16p,h1w1&lt;2q,c1&lt;p\*16
        - T2:h1%8=0,h1w1&lt;8p,h1w1&lt;2q,c1&lt;p\*8
    - perm=\[1,0,2,3\]
        - T1:h1w1&lt;16p,n1&lt;8192,h1\*w1&lt;p
        - T2:h1w1&lt;8p,n1&lt;8192,h1\*w1&lt;p
    - perm=\[1,0,3,2\]
        - T1:h1%16=0,c1h1w1&lt;16p,h1w1&lt;2\*q
        - T2:h1%8=0,c1h1w1&lt;8p,h1w1&lt;2\*q
    - perm=\[1,2,0,3\]
        - T1:n1w1&lt;p16,c1h1w1&lt;p,w1%16=0
        - T2:n1w1&lt;p8,c1h1w1p,w1%8=0
    - perm=\[1,2,3,0\]
        - T1:h1w1&lt;p,n1&lt;p16,c1h1w1&lt;p16,n1w1&lt;p\*16
        - T2:h1w1&lt;p,n1&lt;p8,c1h1w1&lt;p8,n1w1&lt;p\*8
    - perm=\[1,3,0,2\]
        - T1:c1w1&lt;8192,n1h1&lt;p,w1%16=0
        - T2:c1w1&lt;8192,n1h1&lt;p,w1%8=0
    - perm=\[1,3,2,0\]
        - T1:c1h1w1&lt;p,n1\*h1&lt;p,w1&lt;8192,w1%16=0
        - T2:c1h1w1&lt;p,n1\*h1&lt;p,w1&lt;8192,w1%8=0
    - perm=\[2,1,0,3\]
        - T1,T2:c1&lt;8192,c1h1w1&lt;p,n1\*w1&lt;p
    - perm=\[2,1,3,0\]
        - T1:c1h1w1&lt;p,n1w1&lt;p16,c1&lt;8192,n1\*w1%4=0
        - T2:c1h1w1&lt;p,n1w1&lt;p8,c1&lt;8192,n1\*w1%4=0
    - perm=\[2,0,3,1\]
        - T1,T2:c1&lt;8192,c1h1w1&lt;p
    - perm=\[2,0,1,3\]
        - T1:n1c1h1w1&lt;p,h1w1%16=0
        - T2:n1c1h1w1&lt;p,h1w1%8=0
    - perm=\[2,3,1,0\]
        - T1:c1h1w1&lt;p,n1c1&lt;p,h1w1&lt;8192,h1\*w1%16=0
        - T2:c1h1w1&lt;p,n1c1&lt;p,h1w1&lt;8192,h1\*w1%8=0
    - perm=\[2,3,0,1\]
        - T1,T2:h1w1&lt;8192,n1c1&lt;p
    - perm=\[3,0,2,1\]
        - T1:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1\*w1%16=0
        - T2:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1\*w1%8=0
    - perm=\[3,0,1,2\]
        - T1:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1h1w1%16=0
        - T2:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1h1w1%8=0
    - perm=\[3,2,0,1\]
        - T1,T2:h1w1&lt;p,n1c1&lt;8192,n1c1w1&lt;p
    - perm=\[3,2,1,0\]
        - T1:c1h1w1&lt;p,h1w1&lt;8192,2h1w1&lt;q,n1c1&lt;p\*16,h1%16=0
        - T2:c1h1w1&lt;p,h1w1&lt;8192,2h1w1&lt;q,n1c1&lt;p\*8,h1%8=0
    - perm=\[3,1,0,2\]
        - T1,T2:h1w1&lt;p,c1w1&lt;8192,n1\*h1&lt;p
    - perm=\[3,1,2,0\]
        - T1,T2:h1w1&lt;p,n1c1&lt;8192,n1h1&lt;p,n1c1\*w1&lt;p

### Datentypbeschränkungen

- T1:int8(Tensor)
- T2:int16(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.
{% endraw %}
