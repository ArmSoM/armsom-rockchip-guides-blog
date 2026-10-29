---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Strukturen zur Matrixmultiplikation"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-types-matmul"
slug: "rknn-v250-runtime-api-types-matmul"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Strukturen zur Matrixmultiplikation | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Strukturen zur Matrixmultiplikation | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-types-matmul/"
---

## Plattform und Quelle

Dieser Artikel basiert auf dem RKNN-V2.5.0-PDF des Herstellers und gilt nur für die dort genannten Chips und Schnittstellen. Bei ArmSoM-Boards zuerst SoC, NPU-Treiber, Toolkit/Runtime, SDK/BSP und Kernelversion prüfen. Eine ArmSoM-Hardwareprüfung wurde nicht durchgeführt; Beispiele und Messwerte stammen aus der Quelle, nicht aus ArmSoM-Tests.

## Seriennavigation

- [Plattformen, Header und Linken](/de/articles/rknn-v250-runtime-api-overview-linking/)
- [Speicherbesitz und allgemeine/Zero-Copy-Abläufe](/de/articles/rknn-v250-runtime-api-conventions-zero-copy/)
- [Gerät, Kontext und Initialisierungsflags](/de/articles/rknn-v250-runtime-api-device-context/)
- [Modell-, Tensor- und dynamische Formabfragen](/de/articles/rknn-v250-runtime-api-query/)
- [Eingabe, Ausführung, Ausgabe und dynamische Formen](/de/articles/rknn-v250-runtime-api-inference/)
- [Tensorspeicher zuweisen und synchronisieren](/de/articles/rknn-v250-runtime-api-tensor-memory/)
- [Matrixmultiplikations-APIs und dynamische Formen](/de/articles/rknn-v250-runtime-api-matmul/)
- [Benutzerdefinierte Operatoren registrieren und abfragen](/de/articles/rknn-v250-runtime-api-custom-operators/)
- [Statuscodes, Tensoren, Speicher und Erweiterungstypen](/de/articles/rknn-v250-runtime-api-types-common/)
- [Strukturen zur Matrixmultiplikation](/de/articles/rknn-v250-runtime-api-types-matmul/)
- [Operatortypen und Migration veralteter APIs](/de/articles/rknn-v250-runtime-api-types-custom-migration/)

{% raw %}

<!-- source EN p40 unit 449 -->

### 6.3. Strukturen zur Matrixmultiplikation

<!-- source EN p40 unit 450 -->

### rknn_matmul_info

<!-- source EN p40 unit 451 -->

rknn_matmul_info beschreibt die Spezifikation der Matrixmultiplikation: Dimensionen, Datentyp und Speicherlayout der Ein- und Ausgabematrizen. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p40 unit 452 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| M | int32_t | Zeilenanzahl von A. |
| K | int32_t | Spaltenanzahl von A. |
| N | int32_t | Spaltenanzahl von B. |
| type | rknn_matmul_type | Datentypen der Ein- und Ausgabematrizen:<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32: A/B — float16, C — float;<br>RKNN_INT8_MM_INT8_TO_INT32: A/B — int8, C — int32;<br>RKNN_INT8_MM_INT8_TO_INT8: A/B/C — int8;<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT16: A/B/C — float16;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT32: A — float16, B — int8, C — float;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT16: A — float16, B — int8, C — float16;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT32: A — float16, B — int4, C — float;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT16: A — float16, B — int4, C — float16;<br>RKNN_INT8_MM_INT8_TO_FLOAT32: A/B — int8, C — float;<br>RKNN_INT4_MM_INT4_TO_INT16: A/B — int4, C — int16;<br>RKNN_INT8_MM_INT4_TO_INT32: A — int8, B — int4, C — int32. |
| B_layout | int16_t | Speicherlayout von B. 0 bezeichnet [K,N]. RKNN_MM_LAYOUT_NORM — ursprüngliche Form KxN; RKNN_MM_LAYOUT_NATIVE — leistungsoptimiertes Layout; RKNN_MM_LAYOUT_TP_NORM — transponierte Form NxK. |
| B_quant_type | int16_t | Quantisierung von B: RKNN_QUANT_TYPE_PER_LAYER_SYM — symmetrisch pro Schicht; RKNN_QUANT_TYPE_PER_LAYER_ASYM — asymmetrisch pro Schicht; RKNN_QUANT_TYPE_PER_CHANNEL_SYM — symmetrisch pro Kanal; RKNN_QUANT_TYPE_PER_CHANNEL_ASYM — asymmetrisch pro Kanal; RKNN_QUANT_TYPE_PER_GROUP_SYM — symmetrisch pro Gruppe; RKNN_QUANT_TYPE_PER_GROUP_ASYM — asymmetrisch pro Gruppe. |
| AC_layout | int16_t | Datenlayout von A und C: RKNN_MM_LAYOUT_NORM — ursprüngliche Formen; RKNN_MM_LAYOUT_NATIVE — leistungsoptimierte Formen. |
| AC_quant_type | int16_t | Quantisierung von A und C: RKNN_QUANT_TYPE_PER_LAYER_SYM — symmetrisch pro Schicht; RKNN_QUANT_TYPE_PER_LAYER_ASYM — asymmetrisch pro Schicht. |
| iommu_domain_id | int32_t | Index der IOMMU-Adressraumdomäne des Matrixkontexts. Adressraum und Kontext sind einander eindeutig zugeordnet; jeder Adressraum umfasst 4 GB. Der Parameter wird hauptsächlich für große A/B/C verwendet, wenn nach mehr als 4 GB NPU-Speicherzuweisung in einer Domäne ein Wechsel in eine andere nötig ist. |
| group_size | int16_t | Elementanzahl je Gruppe; nur bei aktivierter Gruppenquantisierung wirksam. |
| reserved | int8_t[] | Reserviertes Feld. |

<!-- source EN p42 unit 455 -->

### rknn_matmul_tensor_attr

<!-- source EN p42 unit 456 -->

rknn_matmul_tensor_attr beschreibt die Tensorattribute jeder Matrix: Name, Form, Größe und Datentyp. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p42 unit 457 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| name | char[] | Matrixname. |
| n_dims | uint32_t | Anzahl der Matrixdimensionen. |
| dims | uint32_t[] | Matrixform. |
| size | uint32_t | Matrixgröße. |
| type | rknn_tensor_type | Matrixdatentyp. |

<!-- source EN p42 unit 458 -->

### rknn_matmul_io_attr

<!-- source EN p42 unit 459 -->

rknn_matmul_io_attr beschreibt alle Ein- und Ausgabetensoren der Matrixoperation, einschließlich der Attribute von A, B und C. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p42 unit 460 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| A | rknn_matmul_tensor_attr | Tensorattribute der Matrix A. |
| B | rknn_matmul_tensor_attr | Tensorattribute der Matrix B. |
| C | rknn_matmul_tensor_attr | Tensorattribute der Matrix C. |

<!-- source EN p42 unit 461 -->

### rknn_quant_params

<!-- source EN p42 unit 462 -->

rknn_quant_params beschreibt die Quantisierungsparameter einer Matrix: Name sowie Zeiger und Längen der Arrays scale und zero_point. name kennzeichnet die Matrix und lässt sich aus der bei Kontextinitialisierung erhaltenen rknn_matmul_io_attr entnehmen. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p42 unit 463 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| name | char[] | Matrixname. |
| scale | float* | Zeiger auf das scale-Array der Matrix. |
| scale_len | int32_t | Länge des scale-Arrays der Matrix. |
| zp | int32_t* | Zeiger auf das zero_point-Array der Matrix. |
| zp_len | int32_t | Länge des zero_point-Arrays der Matrix. |

<!-- source EN p42 unit 464 -->

### rknn_matmul_shape

<!-- source EN p42 unit 465 -->

rknn_matmul_shape beschreibt M, K und N einer bestimmten Matrixmultiplikationsform. Bei Initialisierung eines Kontexts mit dynamischen Formen sind die Formenanzahl und ein rknn_matmul_shape-Array sämtlicher Eingabeformen anzugeben. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p42 unit 466 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| M | int32_t | Zeilenanzahl von A. |
| K | int32_t | Spaltenanzahl von A. |
| N | int32_t | Spaltenanzahl von C. |

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
