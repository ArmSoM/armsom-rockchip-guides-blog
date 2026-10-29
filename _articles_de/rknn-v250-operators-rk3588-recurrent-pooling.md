---
title: "RKNN2 V2.5.0 · RK3588：Rekurrente Netze, Arithmetik und Pooling"
description: "RKNN2 V2.5.0 · RK3588：Rekurrente Netze, Arithmetik und Pooling · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
excerpt: "RKNN2 V2.5.0 · RK3588：Rekurrente Netze, Arithmetik und Pooling · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
translation_key: "rknn-v250-operators-rk3588-recurrent-pooling"
slug: "rknn-v250-operators-rk3588-recurrent-pooling"
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

Quellseiten: CN 79–97; EN 82–100.

[Rockchip RKNN2](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<details markdown="1">
<summary>Operatorreferenz-Serie</summary>

[RKNN2 V2.5.0 · RK3566/RK3568：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk3566-rk3568-convolution/)

[RKNN2 V2.5.0 · RK3566/RK3568：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rk3566-rk3568-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3566/RK3568：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rk3566-rk3568-shape-indexing/)

[RKNN2 V2.5.0 · RK3566/RK3568：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rk3566-rk3568-activations-extensions/)

[RKNN2 V2.5.0 · RK3588：Grundlagen und Faltungen](/de/articles/rknn-v250-operators-rk3588-convolution/)

**RKNN2 V2.5.0 · RK3588：Rekurrente Netze, Arithmetik und Pooling**

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

[RKNN2 V2.5.0 · RV1103B/RV1106B：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

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

- T1:float16(Tensor)
- T2:float(constTensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: nicht unterstützt.

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

- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)

Broadcasting-Einschränkungen

- \[b,c,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,1,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,c,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,1,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,c,1,1\]-&gt;\[b,c,h,w\],h∈\[1,8192\],w ∈\[1,8192\]

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: nicht unterstützt.

## GRU

Gated Recurrent Unit (GRU). Erweiterungen und Varianten von GRU heißen exGRU-Operatoren. Mit (extern) markierte Parameter gelten ausschließlich für exGRU. Berechnungsformeln: 

```text
Equations(Default:f=Sigmoid,g=Tanh):
r_t = f(x_t · W_r + h_{t−1} · R_r + Wb_r + Rb_r)
z_t = f(x_t · W_z + h_{t−1} · R_z + Wb_z + Rb_z)
h_t = g(x_t · W_h + (r_t ⊙ h_{t−1}) · R_h + Rb_h + Wb_h), (WRB=0)
h_t = g(x_t · W_h + r_t ⊙ (h_{t−1} · R_h + Rb_h)) + Wb_h, (WRB=1)
H_t = (1 − z_t) ⊙ h_t + z_t ⊙ h_{t−1}
```

### Eingaben

- X:T1
    - shape:\[seq\_length,batch\_size,input\_size\]
        - seqlength∈(0,8192\]
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - inputsize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer
- W:T1
    - shape:\[num\_directions,4\*hidden\_size,input\_size\]
        - inputsize∈(0,8192\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Quantisierungsunterstützung
        - per-layer
        - per-channel
- R:T1
    - shape:\[num\_directions,4\*hidden\_size,hidden\_size\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Quantisierungsunterstützung
        - per-layer
        - per-channel
- B:T2
    - shape:\[num\_directions,8\*hidden\_size\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Quantisierungsunterstützung
        - per-layer
        - per-channel
- sequence\_lens:T3(optional)
    - shape:\[batch\_size\]
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
- initial\_h:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - hiddensize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer

### Ausgaben

- Y:T1
    - shape:\[seq\_length,num\_directions,batch\_size,hidden\_size\]
        - seqlength∈(0,8192\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - hiddensize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer
- Y\_h:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - hiddensize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer

### Attribute

- linear\_before\_reset:int
    - Auswahl der LBR-Variante:1(T) oder 0(F).
- direction(extern):string
    - Legt die Berechnungsrichtung von GRU fest.
    - forward: GRU in Vorwärtsrichtung.
    - reverse: GRU in Rückwärtsrichtung.
    - bidirectional: GRU in beiden Richtungen.
- sequence\_size(extern):int
    - Legt seqsize der GRU-Eingabe fest; uneingeschränkt, Ausrichtung auf 4 empfohlen.
- hidden\_size(extern):int
    - hiddensize der GRU-Einheit; uneingeschränkt, Ausrichtung auf 8 empfohlen.
- input\_layout(extern):int
    - Legt ein Layout fest, das der Bedeutung der zugehörigen Eingabe-shape entspricht.
    - Das angegebene layout und die tatsächlichen Parameter des Operators müssen eingetragen werden: batch\_size, sequence\_size, hidden\_size.
    - snc: Eingabe-shape dieses Layouts ist \[seqs,batches,input\_size\].
    - (sn)c: Eingabe-shape dieses Layouts ist \[seqs\*batches,input\_size,1,1\].
- output\_layout(extern):int
    - Legt ein Layout fest, das der Bedeutung der zugehörigen Ausgabe-shape entspricht.
    - Das angegebene layout und die tatsächlichen Parameter des Operators müssen eingetragen werden: batch\_size, sequence\_size, hidden\_size, directions.
    - sbnc: Ausgabe-shape dieses Layouts ist \[seqs,directions,batches,hidden\_size\].
    - (sn)c: Ausgabe-shape dieses Layouts ist \[seqsbatches,directionsinput\_size,1,1\].

### Datentypbeschränkungen

- T1:float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Gather

Wählt anhand von Indices Einträge aus X entlang der angegebenen axis aus und verknüpft sie.

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
- Indices:T2
    - Indizes der zu sammelnden Elemente; rank =1.

### Ausgaben

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)
- T2:int(Tensor)

### Attribute

- axis:int(Tensor)
    - axis∈{0,1,2,3}
    - Legt die durch Indices adressierte Eingabedimension fest.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Hardmax

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
        - axis=1, height∗width&lt;16384;
        - axis=3/-1, channel∗height&lt;16384; außerdem gelten die Spezifikationsgrenzen von transpose.

### Ausgaben

- output:T1
    - shape:\[batch,channel,height,width\]

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)

### Attribute

- axis:int
    - Achse für hardmax: 1,3/-1, also die Richtungen channel und width.

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## LSTM

Long Short-Term Memory (LSTM). Erweiterungen und Varianten von LSTM heißen exLSTM-Operatoren. Mit (extern) markierte Parameter gelten ausschließlich für exLSTM. Berechnungsformeln: 

```text
Equations(Default:f=Sigmoid,g=Tanh,h=Tanh):
i_t = f(x_t · W_i + h_{t−1} · R_i + Wb_i + Rb_i)
f_t = f(x_t · W_f + h_{t−1} · R_f + Wb_f + Rb_f)
c_t = f(x_t · W_c + h_{t−1} · R_c + Wb_c + Rb_c)
o_t = f(x_t · W_o + h_{t−1} · R_o + Wb_o + Rb_o)
C_t = f_t ⊙ C_{t−1} + i_t ⊙ c_t
h_t = o_t ⊙ h(C_t)
```

### Eingaben

- X:T1
    - shape:\[seq\_length,batch\_size,input\_size\]
        - seqlength∈(0,8192\]
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - inputsize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer
- W:T1
    - shape:\[num\_directions,4\*hidden\_size,input\_size\]
        - inputsize∈(0,8192\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Quantisierungsunterstützung
        - per-layer
        - per-channel
- R:T1
    - shape:\[num\_directions,4\*hidden\_size,hidden\_size\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Quantisierungsunterstützung
        - per-layer
        - per-channel
- B:T2,T3
    - shape:\[num\_directions,8\*hidden\_size\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Quantisierungsunterstützung
        - per-layer
        - per-channel
- sequence\_lens:T4,T5(optional)
    - shape:\[batch\_size\]
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
- initial\_h:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - hiddensize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer
- initial\_c:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - hiddensize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer

### Ausgaben

- Y:T1
    - shape:\[seq\_length,num\_directions,batch\_size,hidden\_size\]
        - seqlength∈(0,8192\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - hiddensize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer
- Y\_h:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - hiddensize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer
- Y\_c:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; Werte größer als 1 müssen Vielfache von 4 sein.
        - hiddensize∈(0,8192\]
    - Quantisierungsunterstützung
        - per-layer

### Attribute

- direction(extern):string
    - Legt die Berechnungsrichtung von LSTM fest.
    - forward: LSTM in Vorwärtsrichtung.
    - reverse: LSTM in Rückwärtsrichtung.
    - bidirectional: LSTM in beiden Richtungen.
- sequence\_size(extern):int
    - Legt seqsize der LSTM-Eingabe fest; uneingeschränkt, Ausrichtung auf 4 empfohlen.
- hidden\_size(extern):int
    - hiddensize der LSTM-Einheit; uneingeschränkt, Ausrichtung auf 8 empfohlen.
- proj\_size(extern):int
    - proj\_size bei projection; projsize∈\[0,hiddensize\].
    - Derzeit auf 0 beschränkt; projection wird noch nicht unterstützt.
- input\_forget(extern):int
    - Auswahl der cifg-Variante:1(T) oder 0(F). Derzeit auf 0 beschränkt, also noch nicht unterstützt.
- has\_projection(extern):int
    - projection-Variante:1(T) oder 0(F). Derzeit auf 0 beschränkt, also noch nicht unterstützt.
- input\_layout(extern):int
    - Legt ein Layout fest, das der Bedeutung der zugehörigen Eingabe-shape entspricht.
    - Das angegebene layout und die tatsächlichen Parameter des Operators müssen eingetragen werden: batch\_size, sequence\_size, hidden\_size.
    - snc: Eingabe-shape dieses Layouts ist \[seqs,batches,input\_size\].
    - (sn)c: Eingabe-shape dieses Layouts ist \[seqs\*batches,input\_size,1,1\].
- output\_layout(extern):int
    - Legt ein Layout fest, das der Bedeutung der zugehörigen Ausgabe-shape entspricht.
    - Das angegebene layout und die tatsächlichen Parameter des Operators müssen eingetragen werden: batch\_size, sequence\_size, hidden\_size, directions.
    - sbnc: Ausgabe-shape dieses Layouts ist \[seqs,directions,batches,hidden\_size\].
    - (sn)c: Ausgabe-shape dieses Layouts ist \[seqsbatches,directionsinput\_size,1,1\].

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int32(Tensor)
- T4:float(Scalar)
- T5:int(Scalar)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

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

- T1:int8(Tensor),float16(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.

## Min

Berechnet das elementweise Minimum der Eingabetensoren.

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

- T1:int8(Tensor),float16(Tensor)

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

- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: unterstützt.

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
    - shape : \[batch\_begin, channel\_begin, height\_begin, width\_begin, batch\_end, channel\_end,height\_end, width\_end\]
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

- T1:int8(Tensor),float16(Tensor)
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
        - height∈(0,8192\]
        - width∈(0,8192\]

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
- storage\_order:int64
    - Bevorzugte Speicherreihenfolge:0.

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)
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

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## AveragePool

AveragePool verarbeitet Eingabetensor X und wendet Average-Pooling anhand von Kernelgröße, Schrittweite und pad-Längen an. Alle Werte der durch den Kernel bestimmten Teilmengen werden gemittelt und in den herunterabgetasteten Ausgabetensor Y zur weiteren Verarbeitung übernommen. Die räumliche Ausgabeform hängt von explizitem Padding (pads) oder automatischem Padding (auto\_pad) ab. Hier wird ausschließlich explizites Padding verwendet.

### Eingaben

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,8192\]
        - width∈(0,8192\]

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

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## GlobalAveragePool

GlobalAveragePool mittelt die Werte jedes Kanals von Eingabetensor X. Dies entspricht AveragePool mit kernel\_shape gleich den räumlichen Dimensionen des Eingabetensors.

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

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## Pow

Potenzierung Z = X^Y: Aus Eingabedaten (Tensor) und Exponenten wird ein Ausgabetensor erzeugt.

### Eingaben

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer
- Y:T2
    - shape:\[1\]
        - Derzeit werden nur 0, 1, 2, 3, 0.5, -0.5 unterstützt.

### Ausgaben

- Z:T1
    - shape:\[batch,channel,height,width\]
    - Quantisierungsunterstützung
        - per-layer

### Datentypbeschränkungen

- T1:int8(Tensor),float16(Tensor)
- T2:int8(Tensor),int32(Tensor),int64(Tensor),float16(Tensor),float(Tensor)

### Weitere Unterstützung

- Zusammenarbeit mehrerer Kerne: noch nicht unterstützt.
{% endraw %}
