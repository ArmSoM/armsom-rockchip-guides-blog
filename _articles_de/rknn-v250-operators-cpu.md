---
title: "RKNN2 V2.5.0 · Unterstützung und Grenzen der CPU-Operatoren"
description: "RKNN2 V2.5.0 · Unterstützung und Grenzen der CPU-Operatoren · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
excerpt: "RKNN2 V2.5.0 · Unterstützung und Grenzen der CPU-Operatoren · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
translation_key: "rknn-v250-operators-cpu"
slug: "rknn-v250-operators-cpu"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RKNN2"]
---

Diese Plattformreferenz für RKNN2 V2.5.0 unterstützt ArmSoM-Entwickler bei der Modellauswahl und -anpassung. Sie bestätigt keine Unterstützung auf allen ArmSoM-Platinen: SoC, tatsächliche Toolkit2-, Runtime-, NPU-Treiber- und BSP-Versionen müssen geprüft werden. Die Quelle nennt keine einheitliche Linux-Kernel-Version. Es wurden keine ArmSoM-Hardwaretests durchgeführt.

Quelle: die bereitgestellte chinesische und englische RKNN2 Supported Operators and Constraints Reference V2.5.0 mit 374 bzw. 384 Seiten. Chinesisch folgt der chinesischen Ausgabe; Englisch, Russisch und Deutsch folgen der englischen. Plattformgrenzen bleiben getrennt. Das englische PDF enthält chinesische I/O-Abbildungen und Ausgabetabellen; zusätzlich werden editierbare lokalisierte Tabellen bereitgestellt. Schreibweisen wie ConvTranpose und ursprüngliche LSTM/GRU-Gleichungen bleiben erhalten; die Formeln stellen keine Korrekturen der SDK-Implementierung dar.

Quellseiten: CN 353–366; EN 363–376.

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

[RKNN2 V2.5.0 · RV1103B/RV1106B：Rekurrente Netze, Arithmetik und Pooling](/de/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Formen, Slicing und Transposition](/de/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Aktivierungen, Normalisierung und Erweiterungen](/de/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

**RKNN2 V2.5.0 · Unterstützung und Grenzen der CPU-Operatoren**

[RKNN2 V2.5.0 · Unterstützung und Grenzen der GPU-Operatoren](/de/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · Modell-I/O, Ausrichtung und Faltungsgrenzen](/de/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Spezifikationen der CPU-Operatoren

## Hinweis:

- RK2118 unterstützt keine CPU-Operatoren.
- RV1106/RV1103/RV1106B/RV1103B unterstützen nur einen Teil der nachfolgend aufgeführten CPU-Operatoren.
    - Concat, DataConvert, Div, exLayerNorm, Exp, Gather, ReduceL2, ReduceMax, Reshape, ScatterND,Softmax,Pow

## Add

- Beschreibung: Addition.
- Einschränkungen: keine.

## AveragePool

- Beschreibung: Average-Pooling.
- Einschränkungen: keine.

## ArgMin

- Beschreibung: Index des Minimalwerts.
- Einschränkungen: keine.

## ArgMax

- Beschreibung: Index des Maximalwerts.
- Einschränkungen: keine.

## BatchNormalization

- Beschreibung: Batch-Normalisierung.
- Einschränkungen: keine.

## Cast

- Beschreibung: Datentypkonvertierung.
- Spezifikationsgrenzen: SRC unterstützt float32/bool/int8/float16/int32/int64; DST unterstützt float32/int8/int32/float16.

## Clip

- Beschreibung: Aktivierungsschicht mit Wertebegrenzung.
- Einschränkungen: keine.

## Concat

- Beschreibung: Verkettung.
- Einschränkungen: axis unterstützt nur {0,1,2,3}.

## Faltung

- Beschreibung: Faltung.
- Einschränkungen: keine.

## ConvTranspose/Deconvolution

- Beschreibung: transponierte Faltung.
- Einschränkungen: keine.

## ConvTransposePad

- Beschreibung: kombinierter OP.
- Einschränkungen: keine.

## Cos

- Beschreibung: Kosinusfunktion.
- Einschränkungen: keine.

## DataConvert

- Beschreibung: Datentypkonvertierung.
- Einschränkungen: nur Typkonvertierung bool/int8/float unterstützt.

## DepthToSpace

- Beschreibung: Umwandlung zwischen Kanal- und Raumdimensionen.
- Einschränkungen: keine.

## Div

- Beschreibung: Division.
- Einschränkungen: keine.

## Equal

- Beschreibung: Gleichheit.
- Einschränkungen: keine.

## Exp

- Beschreibung: Exponentialfunktion.
- Einschränkungen: keine.

## Flatten

- Beschreibung: Abflachen.
- Einschränkungen: keine.

## Gather

- Beschreibung: Gather-Operation.
- Einschränkungen: keine.

## Greater

- Beschreibung: größer als.
- Einschränkungen: keine.

## GreaterOrEqual

- Beschreibung: größer oder gleich.
- Einschränkungen: keine.

## GRU

- Beschreibung: Gated Recurrent Unit.
- Einschränkungen: keine.

## exGRU

- Beschreibung: Gated Recurrent Unit.
- Einschränkungen: keine.
    - Hinweis: ONNX-Erweiterungsoperator.

## exHardSwish

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: keine.
    - Hinweis: ONNX-Erweiterungsoperator.

## InstanceNormalization

- Beschreibung: Instanznormalisierung.
- Einschränkungen: keine.

## exLayerNorm

- Beschreibung: Schichtstandardisierung.
- Einschränkungen: keine.
    - Hinweis: ONNX-Erweiterungsoperator.

## Less

- Beschreibung: kleiner als.
- Einschränkungen: keine.

## LessOrEqual

- Beschreibung: kleiner oder gleich.
- Einschränkungen: keine.

## LogSoftmax

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: batchsize unterstützt nur 1.

## LpNormalization

- Beschreibung: Lp-Normalisierung.
- Einschränkungen: keine.

## exLRN

- Beschreibung: lokale Antwortnormalisierung.
- Einschränkungen: keine.
    - Hinweis: ONNX-Erweiterungsoperator.

## MatMul

- Beschreibung: mehrdimensionale Matrixmultiplikation.
- Einschränkungen: keine (vierdimensional x vierdimensional und vierdimensional x dreidimensional werden unterstützt).

## Max

- Beschreibung: Maximalwert.
- Einschränkungen: keine.

## MaxPool

- Beschreibung: Max-Pooling.
- Einschränkungen: keine.

## MaxRoiPool

- Beschreibung: regionales Max-Pooling.
- Einschränkungen: keine.

## MaxUnpool

- Beschreibung: inverses Max-Pooling.
- Einschränkungen: keine.

## exMish

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: keine.
    - Hinweis: ONNX-Erweiterungsoperator.

## Min

- Beschreibung: Minimalwert.
- Einschränkungen: keine.

## Mul

- Beschreibung: Multiplikation.
- Einschränkungen: keine.

## Pad

- Beschreibung: Padding.
- Einschränkungen: keine.

## Pow

- Beschreibung: Potenzierung.
- Einschränkungen: keine.

## exProposal

- Beschreibung: Region Proposal Network.
- Einschränkungen: batchsize unterstützt nur 1.
    - Hinweis: ONNX-Erweiterungsoperator.

## ReduceMax

- Beschreibung: berechnet Max entlang angegebener Dimensionen.
- Einschränkungen: Ausgabe mit höchstens 4 Dimensionen.

## ReduceMean

- Beschreibung: berechnet Mean entlang angegebener Dimensionen.
- Einschränkungen: Ausgabe mit höchstens 4 Dimensionen.

## ReduceSum

- Beschreibung: berechnet Sum entlang angegebener Dimensionen.
- Einschränkungen: Ausgabe mit höchstens 4 Dimensionen.

## ReduceMin

- Beschreibung: berechnet Min entlang angegebener Dimensionen.
- Einschränkungen: Ausgabe mit höchstens 4 Dimensionen.

## Reorg

- Beschreibung: Datenumordnung.
- Einschränkungen: keine.

## Reshape

- Beschreibung: Änderung der Datenform.
- Einschränkungen: keine.

## Resize

- Beschreibung: skaliert Daten in Breite und Höhe.
- Einschränkungen: unterstützte Interpolationsmethoden bilinear;nearest2d.

## ReverseSequence

- Beschreibung: Umkehrung der Sequenz.
- Einschränkungen: keine.

## exRMSNorm

- Beschreibung: RMS-Normalisierung.
- Einschränkungen: keine.
    - Hinweis: ONNX-Erweiterungsoperator.

## RoiAlign

- Beschreibung: Pooling mit Bereichsausrichtung.
- Einschränkungen: nur AvgPoolMode unterstützt; batchsize nur 1.

## ScatterND

- Beschreibung: N-dimensional indizierter Datenzugriff.
- Einschränkungen: keine.

## Sin

- Beschreibung: Sinusfunktion.
- Einschränkungen: keine.

## Slice

- Beschreibung: Slicing.
- Einschränkungen: batchsize unterstützt nur 1.

## Softmax

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: batchsize unterstützt nur 1.
    - Hinweis: entspricht ONNX OPSET11.

## exSoftmax13

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: batchsize unterstützt nur 1.
    - Hinweis: ONNX-Erweiterungsoperator entsprechend ONNX OPSET13.

## SpaceToDetph

- Beschreibung: wandelt Raumdimensionen in die Kanaldimension um.
- Einschränkungen: keine.

## Split

- Beschreibung: Datenaufteilung.
- Einschränkungen: keine.

## Sqrt

- Beschreibung: Quadratwurzel.
- Einschränkungen: keine.

## Squeeze

- Beschreibung: Entfernen von Datendimensionen der Größe eins.
- Einschränkungen: keine.

## Sub

- Beschreibung: Subtraktion.
- Einschränkungen: keine.

## Tanh

- Beschreibung: hyperbolischer Tangens.
- Einschränkungen: keine.

## Tile

- Beschreibung: Datenerweiterung durch Kopieren.
- Einschränkungen: batchsize nur 1; Broadcasting nicht unterstützt.

## Transpose

- Beschreibung: Transposition.
- Einschränkungen: keine.

## Upsample

- Beschreibung: Upsampling.
- Einschränkungen: unterstützte Interpolationsmethoden bilinear;nearest2d.

## Not

- Beschreibung: elementweises logisches NICHT.
- Einschränkungen: keine.

## where

- Beschreibung: Datenauswahl anhand einer Maske.
- Einschränkungen: keine.

## Erf

- Beschreibung: Fehlerfunktion.
- Einschränkungen: keine.

## Floor

- Beschreibung: Abrundungsfunktion.
- Einschränkungen: keine.

## Mod

- Beschreibung: Modulo-Funktion.
- Einschränkungen: keine.

## exMeanVarianceNormalization

- Beschreibung: Mittelwert-Varianz-Normalisierung.
- Einschränkungen: keine.

## And

- Beschreibung: UND-Funktion.
- Einschränkungen: keine.

## GatherElements

- Beschreibung: Sammeln von Elementen.
- Einschränkungen: keine.

## Log

- Beschreibung: Log-Funktion.
- Einschränkungen: keine.

## exDataConvert

- Beschreibung: Präzisionskonvertierung.
- Einschränkungen: keine.

## SpaceToDepth

- Beschreibung: Dimensionstransformation.
- Einschränkungen: keine.

## SoftmaxMask

- Beschreibung: Aktivierungsfunktion mit Fusion von where und softmax.
- Einschränkungen: keine.

## TransposeReshape

- Beschreibung: kombinierter OP.
- Einschränkungen: keine.

## ReshapeTranspose

- Beschreibung: kombinierter OP.
- Einschränkungen: keine.

## ReduceL2

- Beschreibung: L2-Norm entlang einer Achse.
- Einschränkungen: keine.

## LayerNormalization

- Beschreibung: Schichtstandardisierung.
- Einschränkungen: keine.

## PassThrough

- Beschreibung: direkte Verbindung.
- Einschränkungen: keine.

## Expand

- Beschreibung: Replikation oder Erweiterung von Tensordaten.
- Einschränkungen: keine.

## Sigmoid

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: keine.

## Tanh

- Beschreibung: trigonometrische Funktion.
- Einschränkungen: keine.

## Cos

- Beschreibung: trigonometrische Funktion.
- Einschränkungen: keine.

## Sin

- Beschreibung: trigonometrische Funktion.
- Einschränkungen: keine.

## exSwish

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: keine.

## exGlu

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: keine.

## exGelu

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: keine.

## exWindow

- Beschreibung: exWindow basiert auf den Operationen window\_partition und window\_reverse von Swin-Transformer.
- Einschränkungen: keine.

## exNorm

- Beschreibung: Bei mode='pixel' verwendet exNorm PixelNorm zur Normalisierung. Ohne mode verwendet exNorm standardmäßig LayerNorm.
- Einschränkungen: keine.

## Round

- Beschreibung: Datensättigung.
- Einschränkungen: keine.

## TopK

- Beschreibung: Abruf der K höchstplatzierten Werte.
- Einschränkungen: keine.

## exSwooshR

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: keine.

## exSwooshL

- Beschreibung: Aktivierungsfunktion.
- Einschränkungen: keine.

## OneHot

- Beschreibung: One-Hot-Kodierung.
- Einschränkungen: keine.

## Cumsum

- Beschreibung: Kumulative Summe entlang der angegebenen Dimension.
- Einschränkungen: keine.
{% endraw %}
