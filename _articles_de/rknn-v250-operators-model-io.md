---
title: "RKNN2 V2.5.0 · Modell-I/O, Ausrichtung und Faltungsgrenzen"
description: "RKNN2 V2.5.0 · Modell-I/O, Ausrichtung und Faltungsgrenzen · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
excerpt: "RKNN2 V2.5.0 · Modell-I/O, Ausrichtung und Faltungsgrenzen · Vollständige Operatorparameter und Grenzen nach der Quelle V2.5.0."
translation_key: "rknn-v250-operators-model-io"
slug: "rknn-v250-operators-model-io"
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

Quellseiten: CN 368–374; EN 378–384.

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

[RKNN2 V2.5.0 · Unterstützung und Grenzen der CPU-Operatoren](/de/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · Unterstützung und Grenzen der GPU-Operatoren](/de/articles/rknn-v250-operators-gpu/)

**RKNN2 V2.5.0 · Modell-I/O, Ausrichtung und Faltungsgrenzen**

</details>

{% raw %}

## Beschränkungen für Modelleingaben und -ausgaben

## Beschränkungen der Modelleingaben

1. Diese Ausrichtungsbeschränkungen gelten nur für Zero-Copy-APIs, nicht für gewöhnliche APIs.

2. Die Ausrichtung der Eingangsbreite lässt sich über w\_stride der Zero-Copy-API abfragen. Hinweis: w\_stride kann nicht geändert werden.

3. Nur die Eingangsbreite (width) hat abhängig von channel Ausrichtungsanforderungen; sonst bestehen keine Einschränkungen.

4. Werden mean und scale nicht benötigt, mean und scale auf 0 beziehungsweise 1 setzen.

5. Bei channel&gt;4 verwenden mean/scale einheitlich den ersten Wert, also mean\[0\] und scale\[0\].

6. Bei einer ersten Schicht mit Gleitkommatyp entfällt die quant-Operation.

7. RV1106/RV1103/RV1103B unterstützen keine CPU-Operationen mean/scale/quant.

8. Einzelheiten zur Verwendung stehen in Rockchip\_RKNPU\_User\_Guide\_RKNN\_SDK.

## RK3566/RK3568

![Modelleingabegrenzen aus dem Original-PDF](/assets/images/rknn-v250/operators/en/p378-figure-01.png)

Editierbare Übertragung des Originals (verbundene Zellen aufgelöst):

| Plattform | Präzision der ersten Schicht | Eingabedimensionen | Konfigurierter Eingabetyp der ersten Schicht | mean/scale/quant-Backend | width-Ausrichtung (Elemente), channel=1,3,4 | width-Ausrichtung (Elemente), channel≠1,3,4 | width-Grenzen, channel=1,3,4 | width-Grenzen, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3566/RK3568 | int8 | 4 | uint8 | NPU | 8 | 1 | A | Uneingeschränkt |
| RK3566/RK3568 | int8 | 4 | int8 | NPU | 8 | 1 | A | Uneingeschränkt |
| RK3566/RK3568 | int8 | 4 | float16 | CPU | 8 | 1 | A | Uneingeschränkt |
| RK3566/RK3568 | int8 | 4 | Andere Typen (Eingabeausrichtung kann abweichen) | CPU | 8 | 1 | A | Uneingeschränkt |
| RK3566/RK3568 | float16 | 4 | uint8 | CPU | 4 | 1 | B | Uneingeschränkt |
| RK3566/RK3568 | float16 | 4 | int8 | CPU | 4 | 1 | B | Uneingeschränkt |
| RK3566/RK3568 | float16 | 4 | float16 | CPU | 4 | 1 | B | Uneingeschränkt |
| RK3566/RK3568 | float16 | 4 | Andere Typen (Eingabeausrichtung kann abweichen) | CPU | 4 | 1 | B | Uneingeschränkt |
| RK3566/RK3568 | Uneingeschränkt | Nicht 4-dimensional | Uneingeschränkt | CPU | 1 | 1 | Uneingeschränkt | Uneingeschränkt |

Für jeden Faltungstyp müssen width/kernel_h/kernel_w beide folgenden Bedingungen erfüllen. N muss eine ganze Zahl von 1 bis 7 sein; Faltungen außerhalb dieses Bereichs werden nicht unterstützt. Die N-Berechnung folgt. Die Abbildung verwendet dilation_kernel_h/w statt dilated_kernel_h/w im letzten Kapitel; die Schreibweise der Abbildung bleibt erhalten.

| Bedingung | Formel |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt; 1024 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |

| Bedingung | Formel |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt; 1024 \* N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |
| B / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| B / ConvTranspose/Deconvolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |

## RK3588

![Modelleingabegrenzen aus dem Original-PDF](/assets/images/rknn-v250/operators/en/p379-figure-01.png)

Editierbare Übertragung des Originals (verbundene Zellen aufgelöst):

| Plattform | Präzision der ersten Schicht | Eingabedimensionen | Konfigurierter Eingabetyp der ersten Schicht | mean/scale/quant-Backend | width-Ausrichtung (Elemente), channel=1,3,4 | width-Ausrichtung (Elemente), channel≠1,3,4 | width-Grenzen, channel=1,3,4 | width-Grenzen, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3588 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Uneingeschränkt |
| RK3588 | int8 | 4 | int8 | NPU | 16 | 1 | A | Uneingeschränkt |
| RK3588 | int8 | 4 | float16 | CPU | 16 | 1 | A | Uneingeschränkt |
| RK3588 | int8 | 4 | Andere Typen (Eingabeausrichtung kann abweichen) | CPU | 16 | 1 | A | Uneingeschränkt |
| RK3588 | float16 | 4 | uint8 | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3588 | float16 | 4 | int8 | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3588 | float16 | 4 | float16 | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3588 | float16 | 4 | Andere Typen (Eingabeausrichtung kann abweichen) | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3588 | Uneingeschränkt | Nicht 4-dimensional | Uneingeschränkt | CPU | 1 | 1 | Uneingeschränkt | Uneingeschränkt |

Für jeden Faltungstyp müssen width/kernel_h/kernel_w beide folgenden Bedingungen erfüllen. N muss eine ganze Zahl von 1 bis 7 sein; Faltungen außerhalb dieses Bereichs werden nicht unterstützt. Die N-Berechnung folgt. Die Abbildung verwendet dilation_kernel_h/w statt dilated_kernel_h/w im letzten Kapitel; die Schreibweise der Abbildung bleibt erhalten.

| Bedingung | Formel |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 8192 |
| A / Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |
| A / Depthwise Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048), 3) |
| A / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |

| Bedingung | Formel |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt;= 1024 \* N |
| B (2) | width &lt;= 8192 |
| B / Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |
| B / Depthwise Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048), 3) |
| B / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |

## RV1103/RV1106

![Modelleingabegrenzen aus dem Original-PDF](/assets/images/rknn-v250/operators/en/p379-figure-02.png)

Editierbare Übertragung des Originals (verbundene Zellen aufgelöst):

| Plattform | Präzision der ersten Schicht | Eingabedimensionen | Konfigurierter Eingabetyp der ersten Schicht | mean/scale/quant-Backend | width-Ausrichtung (Elemente), channel=1,3,4 | width-Ausrichtung (Elemente), channel≠1,3,4 | width-Grenzen, channel=1,3,4 | width-Grenzen, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RV1103/RV1106 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Uneingeschränkt |

Für jeden Faltungstyp müssen width/kernel_h/kernel_w beide folgenden Bedingungen erfüllen. N muss eine ganze Zahl von 1 bis 7 sein; Faltungen außerhalb dieses Bereichs werden nicht unterstützt. Die N-Berechnung folgt. Die Abbildung verwendet dilation_kernel_h/w statt dilated_kernel_h/w im letzten Kapitel; die Schreibweise der Abbildung bleibt erhalten.

| Bedingung | Formel |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

> Der Originalkopf verweist auf Anmerkung 9; die vorliegenden Eingabehinweise enthalten nur 1–8. Anmerkung 9 wurde nicht gefunden und wird nicht erfunden.

## RK3562

![Modelleingabegrenzen aus dem Original-PDF](/assets/images/rknn-v250/operators/en/p380-figure-01.png)

Editierbare Übertragung des Originals (verbundene Zellen aufgelöst):

| Plattform | Präzision der ersten Schicht | Eingabedimensionen | Konfigurierter Eingabetyp der ersten Schicht | mean/scale/quant-Backend | width-Ausrichtung (Elemente), channel=1,3,4 | width-Ausrichtung (Elemente), channel≠1,3,4 | width-Grenzen, channel=1,3,4 | width-Grenzen, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3562 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Uneingeschränkt |
| RK3562 | int8 | 4 | int8 | NPU | 16 | 1 | A | Uneingeschränkt |
| RK3562 | int8 | 4 | float16 | CPU | 16 | 1 | A | Uneingeschränkt |
| RK3562 | int8 | 4 | Andere Typen (Eingabeausrichtung kann abweichen) | CPU | 16 | 1 | A | Uneingeschränkt |
| RK3562 | float16 | 4 | uint8 | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3562 | float16 | 4 | int8 | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3562 | float16 | 4 | float16 | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3562 | float16 | 4 | Andere Typen (Eingabeausrichtung kann abweichen) | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3562 | Uneingeschränkt | Nicht 4-dimensional | Uneingeschränkt | CPU | 1 | 1 | Uneingeschränkt | Uneingeschränkt |

Für jeden Faltungstyp müssen width/kernel_h/kernel_w beide folgenden Bedingungen erfüllen. N muss eine ganze Zahl von 1 bis 7 sein; Faltungen außerhalb dieses Bereichs werden nicht unterstützt. Die N-Berechnung folgt. Die Abbildung verwendet dilation_kernel_h/w statt dilated_kernel_h/w im letzten Kapitel; die Schreibweise der Abbildung bleibt erhalten.

| Bedingung | Formel |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

| Bedingung | Formel |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| B / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| B / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

## RK3576/RV1126B

![Modelleingabegrenzen aus dem Original-PDF](/assets/images/rknn-v250/operators/en/p380-figure-02.png)

Editierbare Übertragung des Originals (verbundene Zellen aufgelöst):

| Plattform | Präzision der ersten Schicht | Eingabedimensionen | Konfigurierter Eingabetyp der ersten Schicht | mean/scale/quant-Backend | width-Ausrichtung (Elemente), channel=1,3,4 | width-Ausrichtung (Elemente), channel≠1,3,4 | width-Grenzen, channel=1,3,4 | width-Grenzen, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3576/RV1126B | int8 | 4 | uint8 | NPU | 16 | 1 | A | Uneingeschränkt |
| RK3576/RV1126B | int8 | 4 | int8 | NPU | 16 | 1 | A | Uneingeschränkt |
| RK3576/RV1126B | int8 | 4 | float16 | CPU | 16 | 1 | A | Uneingeschränkt |
| RK3576/RV1126B | int8 | 4 | Andere Typen (Eingabeausrichtung kann abweichen) | CPU | 16 | 1 | A | Uneingeschränkt |
| RK3576/RV1126B | float16 | 4 | uint8 | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3576/RV1126B | float16 | 4 | int8 | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3576/RV1126B | float16 | 4 | float16 | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3576/RV1126B | float16 | 4 | Andere Typen (Eingabeausrichtung kann abweichen) | CPU | 8 | 1 | B | Uneingeschränkt |
| RK3576/RV1126B | Uneingeschränkt | Nicht 4-dimensional | Uneingeschränkt | CPU | 1 | 1 | Uneingeschränkt | Uneingeschränkt |

Für jeden Faltungstyp müssen width/kernel_h/kernel_w beide folgenden Bedingungen erfüllen. N muss eine ganze Zahl von 1 bis 7 sein; Faltungen außerhalb dieses Bereichs werden nicht unterstützt. Die N-Berechnung folgt. Die Abbildung verwendet dilation_kernel_h/w statt dilated_kernel_h/w im letzten Kapitel; die Schreibweise der Abbildung bleibt erhalten.

| Bedingung | Formel |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

| Bedingung | Formel |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| B / Depthwise Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048), 3) |
| B / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

## RK2118

![Modelleingabegrenzen aus dem Original-PDF](/assets/images/rknn-v250/operators/en/p381-figure-01.png)

Editierbare Übertragung des Originals (verbundene Zellen aufgelöst):

| Plattform | Präzision der ersten Schicht | Eingabedimensionen | Konfigurierter Eingabetyp der ersten Schicht | mean/scale/quant-Backend | width-Ausrichtung (Elemente), channel=1,3,4 | width-Ausrichtung (Elemente), channel≠1,3,4 | width-Grenzen, channel=1,3,4 | width-Grenzen, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK2118 | float16 | 4 | float16 | CPU | 4 | 1 | A | Uneingeschränkt |
| RK2118 | float16 | Nicht 4-dimensional | float16 | CPU | 1 | 1 | A | Uneingeschränkt |

Für jeden Faltungstyp müssen width/kernel_h/kernel_w beide folgenden Bedingungen erfüllen. N muss eine ganze Zahl von 1 bis 7 sein; Faltungen außerhalb dieses Bereichs werden nicht unterstützt. Die N-Berechnung folgt. Die Abbildung verwendet dilation_kernel_h/w statt dilated_kernel_h/w im letzten Kapitel; die Schreibweise der Abbildung bleibt erhalten.

| Bedingung | Formel |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

## RV1103B

![Modelleingabegrenzen aus dem Original-PDF](/assets/images/rknn-v250/operators/en/p381-figure-02.png)

Editierbare Übertragung des Originals (verbundene Zellen aufgelöst):

| Plattform | Präzision der ersten Schicht | Eingabedimensionen | Konfigurierter Eingabetyp der ersten Schicht | mean/scale/quant-Backend | width-Ausrichtung (Elemente), channel=1,3,4 | width-Ausrichtung (Elemente), channel≠1,3,4 | width-Grenzen, channel=1,3,4 | width-Grenzen, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RV1103B/RV1106B | int8 | 4 | uint8 | NPU | 8 | 1 | A | Uneingeschränkt |
| RV1103B/RV1106B | int8 | 4 | int8 | NPU | 8 | 1 | A | Uneingeschränkt |

Für jeden Faltungstyp müssen width/kernel_h/kernel_w beide folgenden Bedingungen erfüllen. N muss eine ganze Zahl von 1 bis 7 sein; Faltungen außerhalb dieses Bereichs werden nicht unterstützt. Die N-Berechnung folgt. Die Abbildung verwendet dilation_kernel_h/w statt dilated_kernel_h/w im letzten Kapitel; die Schreibweise der Abbildung bleibt erhalten.

| Bedingung | Formel |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

> Der Originalkopf verweist auf Anmerkung 9; die vorliegenden Eingabehinweise enthalten nur 1–8. Anmerkung 9 wurde nicht gefunden und wird nicht erfunden.

## Beschränkungen der Modellausgaben

1. Für einen NHWC-Ausgabetensor ist Ausrichtung erforderlich, wenn die NPU die Ausgabekonvertierung ausführt; bei CPU-Implementierung besteht keine Ausrichtungsanforderung.

2. Die Ausgabepräzision int8/float16 bezeichnet den ursprünglichen Ausgabedatentyp der letzten Modellschicht.

3. Bei NCHW-Ausgabe auf der NPU über eine Zero-Copy-Schnittstelle richtet sich die allokierte Ausgabespeichergröße size nach dem abgefragten size-Wert.

4. Bei NC1HWC2-Ausgabe richtet sich die allokierte Ausgabespeichergröße size nach dem abgefragten size-Wert.

## RK3566/RK3568

| Plattform | Ausgabepräzision | Ausgabedimensionen | Ausgabe-Layout | Channel-Ausrichtung | H\*W-Ausrichtung |
|---|---|---|---|---|---|
| RK3566/RK3568 | int8 | 4 | NCHW | Keine | Keine |
| RK3566/RK3568 | int8 | 4 | NHWC | Ausrichtung an 8 | Keine |
| RK3566/RK3568 | int8 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 16; andere Operatoren: an 8 | Ausrichtung an 4 |
| RK3566/RK3568 | int8 | 4 | UNDEFINE | Keine | Keine |
| RK3566/RK3568 | float16 | 4 | NCHW | Keine | Keine |
| RK3566/RK3568 | float16 | 4 | NHWC | Ausrichtung an 4 | Keine |
| RK3566/RK3568 | float16 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 8; andere Operatoren: an 4 | Ausrichtung an 4 |
| RK3566/RK3568 | float16 | 4 | UNDEFINE | Keine | Keine |
| RK3566/RK3568 | Uneingeschränkt | Nicht 4D | UNDEFINE | Keine | Keine |

## RK3588

| Plattform | Ausgabepräzision | Ausgabedimensionen | Ausgabe-Layout | Channel-Ausrichtung | H\*W-Ausrichtung |
|---|---|---|---|---|---|
| RK3588 | int8 | 4 | NCHW | Keine | Keine |
| RK3588 | int8 | 4 | NHWC | Ausrichtung an 16 | Keine |
| RK3588 | int8 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 32; andere Operatoren: an 16 | Ausrichtung an 4 |
| RK3588 | int8 | 4 | UNDEFINE | Keine | Keine |
| RK3588 | float16 | 4 | NCHW | Keine | Keine |
| RK3588 | float16 | 4 | NHWC | Ausrichtung an 8 | Keine |
| RK3588 | float16 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 16; andere Operatoren: an 8 | Ausrichtung an 4 |
| RK3588 | float16 | 4 | UNDEFINE | Keine | Keine |
| RK3588 | Uneingeschränkt | Nicht 4D | UNDEFINE | Keine | Keine |

## RV1103/RV1106

| Plattform | Ausgabepräzision | Ausgabedimensionen | Ausgabe-Layout | Channel-Ausrichtung | H\*W-Ausrichtung |
|---|---|---|---|---|---|
| RV1103/RV1106 | int8 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 32; andere Operatoren: an 16 | Ausrichtung an 4 |
| RV1103/RV1106 | int8 | 4 | NHWC | Keine | Keine |

## RK3562

| Plattform | Ausgabepräzision | Ausgabedimensionen | Ausgabe-Layout | Channel-Ausrichtung | H\*W-Ausrichtung |
|---|---|---|---|---|---|
| RK3562 | int8 | 4 | NCHW | Keine | Keine |
| RK3562 | int8 | 4 | NHWC | Keine | Keine |
| RK3562 | int8 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 32; andere Operatoren: an 16 | Ausrichtung an 4 |
| RK3562 | int8 | 4 | UNDEFINE | Keine | Keine |
| RK3562 | float16 | 4 | NCHW | Keine | Keine |
| RK3562 | float16 | 4 | NHWC | Keine | Keine |
| RK3562 | float16 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 16; andere Operatoren: an 8 | Ausrichtung an 4 |
| RK3562 | float16 | 4 | UNDEFINE | Keine | Keine |
| RK3562 | Uneingeschränkt | Nicht 4D | UNDEFINE | Keine | Keine |

## RK3576/RV1126B

| Plattform | Ausgabepräzision | Ausgabedimensionen | Ausgabe-Layout | Channel-Ausrichtung | H\*W-Ausrichtung |
|---|---|---|---|---|---|
| RK3576/RV1126B | int8 | 4 | NCHW | Keine | Keine |
| RK3576/RV1126B | int8 | 4 | NHWC | Keine | Keine |
| RK3576/RV1126B | int8 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 32; andere Operatoren: an 16 | Ausrichtung an 4 |
| RK3576/RV1126B | int8 | 4 | UNDEFINE | Keine | Keine |
| RK3576/RV1126B | float16 | 4 | NCHW | Keine | Keine |
| RK3576/RV1126B | float16 | 4 | NHWC | Keine | Keine |
| RK3576/RV1126B | float16 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 16; andere Operatoren: an 8 | Ausrichtung an 4 |
| RK3576/RV1126B | float16 | 4 | UNDEFINE | Keine | Keine |
| RK3576/RV1126B | Uneingeschränkt | Nicht 4D | UNDEFINE | Keine | Keine |

## RK2118

| Plattform | Ausgabepräzision | Ausgabedimensionen | Ausgabe-Layout | Channel-Ausrichtung | H\*W-Ausrichtung |
|---|---|---|---|---|---|
| RK2118 | float16 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 8; andere Operatoren: an 4 | Ausrichtung an 4 |
| RK2118 | float16 | 4 | NHWC | Keine | Keine |
| RK2118 | float16 | Nicht 4D | UNDEFINE | Keine | Keine |

## RV1103B/RV1106B

| Plattform | Ausgabepräzision | Ausgabedimensionen | Ausgabe-Layout | Channel-Ausrichtung | H\*W-Ausrichtung |
|---|---|---|---|---|---|
| RV1103B/RV1106B | int8 | 4 | NC1HWC2 | Letzte Schicht Faltung: Ausrichtung an 8; andere Operatoren: an 8 | Ausrichtung an 4 |
| RV1103B/RV1106B | int8 | 4 | NHWC | Keine | Keine |

## Besondere Hinweise

## dilated\_kernel\_h

dilated\_kernel\_h = kernel\_h \* dilations\_h - dilations\_h + 1

## dilated\_kernel\_w

dilated\_kernel\_w = kernel\_w \* dilations\_w - dilations\_w + 1

{% endraw %}
