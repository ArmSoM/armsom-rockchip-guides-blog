---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Speicherbesitz und allgemeine/Zero-Copy-Abläufe"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-conventions-zero-copy"
slug: "rknn-v250-runtime-api-conventions-zero-copy"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Speicherbesitz und allgemeine/Zero-Copy-Abläufe | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Speicherbesitz und allgemeine/Zero-Copy-Abläufe | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-conventions-zero-copy/"
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

<!-- source EN p8 unit 38 -->

## 3. Allgemeine Konventionen der C-API

<!-- source EN p8 unit 39 -->

### 3.1 Plattformunterschiede

<!-- source EN p8 unit 40 -->

Aufgrund unterschiedlicher Hardwareeigenschaften unterscheiden sich unterstützte RKNN-C-APIs und Parameter je nach Plattform. Tabelle 3-1 zeigt die Unterstützung:

<!-- source EN p8 unit 41 -->

Tabelle 3-1. Unterstützung der RKNN-C-API je Hardwareplattform

<!-- source EN p8 unit 42 -->

|  | RKNN C API | RV1126B/RK3562/RK3566/<br>RK3568 | RK3576/ RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B | RK2118 |
| --- | --- | --- | --- | --- | --- |
| 1 | rknn_init | √ | √ | √ | √ |
| 2 | rknn_set_core_mask | × | √ | × | × |
| 3 | rknn_dup_context | √ | √ | × | × |
| 4 | rknn_destroy | √ | √ | √ | √ |
| 5 | rknn_query | √ | √ | √ | √ |
| 6 | rknn_inputs_set | √ | √ | × | × |
| 7 | rknn_run | √ | √ | √ | √ |
| 8 | rknn_wait | × | × | × | × |
| 9 | rknn_outputs_get | √ | √ | × | × |
| 10 | rknn_outputs_release | √ | √ | × | × |
| 11 | rknn_create_mem_from_mb_blk | × | × | × | × |
| 12 | rknn_create_mem_from_phys | √ | √ | √ | √ |
| 13 | rknn_create_mem_from_fd | √ | √ | √ | × |
| 14 | rknn_create_mem | √ | √ | √ | √ |
| 15 | rknn_destroy_mem | √ | √ | √ | √ |
| 16 | rknn_set_weight_mem | √ | √ | √ | √ |
| 17 | rknn_set_internal_mem | √ | √ | √ | √ |
| 18 | rknn_set_io_mem | √ | √ | √ | √ |
| 19 | rknn_set_input_shapes | √ | √ | × | × |
| 20 | rknn_mem_sync | √ | √ | √ | √ |
| 21 | rknn_matmul_create | √ | √ | × | × |
| 22 | rknn_matmul_set_io_mem | √ | √ | × | × |
| 23 | rknn_matmul_set_core_mask | × | √ | × | × |
| 24 | rknn_matmul_run | √ | √ | × | × |
| 25 | rknn_matmul_destroy | √ | √ | × | × |
| 26 | rknn_register_custom_ops | √ | √ | × | × |
| 27 | rknn_custom_op_get_op_attr | √ | √ | × | × |
| 28 | rknn_set_batch_core_num | × | √ | × | × |
| 29 | rknn_matmul_set_quant_params | √ | √ | × | × |
| 30 | rknn_matmul_get_quant_params | √ | √ | × | × |
| 31 | rknn_matmul_create_dynamic_shape | √ | √ | × | × |
| 32 | rknn_matmul_set_dynamic_shape | √ | √ | × | × |
| 33 | rknn_B_normal_layout_to_native_layout | √ | √ | × | × |
| 34 | rknn_create_mem2 | √ | √ | √ | √ |

<!-- source EN p9 unit 43 -->

Tabelle 3-2 zeigt die je Hardwareplattform unterstützten Abfrageparameter von rknn_query:

<!-- source EN p9 unit 44 -->

Tabelle 3-2. Unterstützte rknn_query-Parameter je Plattform

<!-- source EN p9 unit 45 -->

|  | rknn_query-Parameter | RV1126B/RK3562/RK3566/<br>RK3568 | RK3576/ RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B/RK2118 |
| --- | --- | --- | --- | --- |
| 1 | RKNN_QUERY_IN_OUT_NUM | √ | √ | √ |
| 2 | RKNN_QUERY_INPUT_ATTR | √ | √ | √ |
| 3 | RKNN_QUERY_OUTPUT_ATTR | √ | √ | √ |
| 4 | RKNN_QUERY_PERF_DETAIL | √ | √ | × |
| 5 | RKNN_QUERY_PERF_RUN | √ | √ | × |
| 6 | RKNN_QUERY_SDK_VERSION | √ | √ | √ |
| 7 | RKNN_QUERY_MEM_SIZE | √ | √ | √ |
| 8 | RKNN_QUERY_CUSTOM_STRING | √ | √ | √ |
| 9 | RKNN_QUERY_NATIVE_INPUT_ATTR | √ | √ | √ |
| 10 | RKNN_QUERY_NATIVE_OUTPUT_ATTR | √ | √ | √ |
| 11 | RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | √ | √ | √ |
| 12 | RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | √ | √ | √ |
| 13 | RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | √ | √ | √ |
| 14 | RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | √ | √ | √ |
| 15 | RKNN_QUERY_INPUT_DYNAMIC_RANGE | √ | √ | × |
| 16 | RKNN_QUERY_DEVICE_MEM_INFO | × | × | √ |
| 17 | RKNN_QUERY_CURRENT_INPUT_ATTR | √ | √ | × |
| 18 | RKNN_QUERY_CURRENT_OUTPUT_ATTR | √ | √ | × |
| 19 | RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | √ | √ | × |
| 20 | RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | √ | √ | × |

<!-- source EN p9 unit 46 -->

### 3.2 Speicherbesitz

<!-- source EN p9 unit 47 -->

API-Speicher: Der durch rknn_create_mem zugewiesene Tensorspeicher gehört dem Aufrufer und muss nach Gebrauch mit rknn_destroy_mem freigegeben werden. Doppelte Freigaben vermeiden.

<!-- source EN p9 unit 48 -->

Benutzerspeicher: An rknn_set_weight_mem, rknn_set_internal_mem und rknn_set_io_mem übergebener Speicher bleibt Eigentum des Aufrufers, der ihn nach Gebrauch freigeben muss.

<!-- source EN p9 unit 49 -->

Externe Speicher-Wrapper: rknn_create_mem_from_fd, rknn_create_mem_from_phys und rknn_create_mem_from_mb_blk binden bereits zugewiesenen Speicher (Dateideskriptor, physische Adresse oder mb_blk) für Zero-Copy an RKNN. Das umhüllende Objekt rknn_tensor_mem muss ebenfalls mit rknn_destroy_mem freigegeben werden.

<!-- source EN p9 unit 50 -->

### 3.3 Gültigkeit der Ein- und Ausgabedaten

<!-- source EN p9 unit 51 -->

Das Array inputs und die über buf in rknn_inputs_set referenzierten Eingabedaten müssen während des Aufrufs gültig bleiben.

<!-- source EN p9 unit 52 -->

Das Array outputs für rknn_outputs_get muss der Benutzer vorab erstellen und index setzen. Bei is_prealloc=1 wird buf vom Benutzer vorab zugewiesen und muss während des Aufrufs gültig bleiben. Bei is_prealloc=0 weist die Schnittstelle buf zu; der Speicher bleibt bis rknn_outputs_release gültig. Danach ist der Zeiger buf ungültig und darf nicht weiterverwendet werden.

<!-- source EN p9 unit 53 -->

Der mit rknn_set_io_mem gesetzte Ein-/Ausgabetensorspeicher muss während des Aufrufs gültig sein und vor rknn_run gesetzt werden.

<!-- source EN p9 unit 54 -->

### 3.4 Rückgabewerte und Fehlerbehandlung

<!-- source EN p10 unit 55 -->

Die meisten Schnittstellen liefern einen int-Statuscode: 0 bedeutet Erfolg, negative Werte Fehler. Einige liefern Zeiger (rknn_create_mem, rknn_create_mem_from_fd, rknn_create_mem_from_phys, rknn_create_mem_from_mb_blk) beziehungsweise NULL bei Fehlern.

<!-- source EN p10 unit 56 -->

Vollständige Definitionen siehe 6.1 „Statuscodes“.

<!-- source EN p10 unit 57 -->

Rückgabewert jedes Aufrufs prüfen und Fehler anhand des Statuscodes eingrenzen: RKNN_ERR_DEVICE_UNMATCH bezeichnet eine Versionsabweichung, RKNN_ERR_CTX_INVALID einen ungültigen Kontext.

<!-- source EN p10 unit 58 -->

### 3.5 Allgemeine API und Zero-Copy-API

<!-- source EN p10 unit 59 -->

Bei der Inferenz durchlaufen Rohdaten Eingabeverarbeitung, Modellausführung auf der NPU und Ausgabeverarbeitung. Abhängig von Eingabeformat und Quantisierung gibt es die allgemeine API und die Zero-Copy-API. Ihre wichtigsten Unterschiede bei Verwendung und Aufrufablauf:

<!-- source EN p10 unit 60 -->

Allgemeine API: einfache Inferenzschnittstellen rknn_inputs_set/rknn_outputs_get/rknn_outputs_release. Bei jedem neuen Frame werden extern zugewiesene Daten in den Eingabespeicher der NPU-Laufzeit kopiert. Normalisierung, Quantisierung, Layoutumwandlung und Dequantisierung erfolgen hauptsächlich auf der CPU, die Modellinferenz auf der NPU.

<!-- source EN p10 unit 61 -->

Zero-Copy-API: Speicher mit rknn_create_mem/rknn_create_mem_from_fd/rknn_create_mem_from_phys erzeugen oder einbinden und mit rknn_set_io_mem setzen. Direkte Nutzung vorher von der NPU-Laufzeit oder etwa DRM zugewiesenen Speichers verringert Kopien und Bandbreitenbedarf und verbessert die Leistung. Normalisierung, Quantisierung und Inferenz laufen auf der NPU.

<!-- source EN p10 unit 62 -->

Schnittstellenwahl: Bei ausschließlich virtueller Eingabeadresse ist nur die allgemeine API verwendbar; bei physischer Adresse oder fd die Zero-Copy-API. Beide APIs dürfen nicht gemischt werden.

<!-- source EN p10 unit 63 -->

Aufrufablauf der allgemeinen API (Abbildung 3-1):

<!-- source EN p10 unit 64 -->

1. Modell mit rknn_init() initialisieren;

<!-- source EN p10 unit 65 -->

2. Ein-/Ausgabeattribute mit rknn_query() abfragen;

<!-- source EN p10 unit 66 -->

3. Eingabe vorverarbeiten;

<!-- source EN p10 unit 67 -->

4. Eingabedaten mit rknn_inputs_set() setzen;

<!-- source EN p10 unit 68 -->

5. Inferenz mit rknn_run() ausführen;

<!-- source EN p10 unit 69 -->

6. Inferenzergebnisse mit rknn_outputs_get() abrufen;

<!-- source EN p10 unit 70 -->

7. Ausgabe nachverarbeiten;

<!-- source EN p10 unit 71 -->

8. Ausgabespeicher mit rknn_outputs_release() freigeben;

<!-- source EN p10 unit 72 -->

9. RKNN mit rknn_destroy() auflösen.

<!-- source EN p11 unit 73 -->

![Abbildung aus dem Original-PDF — 11](/assets/images/rknn-v250/apis/runtime/en/p011-figure-01.png)

<!-- source EN p11 unit 74 -->

Abbildung 3-1. Aufrufablauf der allgemeinen API

<!-- source EN p11 unit 75 -->

Zero-Copy-Aufrufablauf (Beispiel mit intern von der Laufzeit zugewiesenem Ein-/Ausgabespeicher, Abbildung 3-2):

<!-- source EN p11 unit 76 -->

1. Modell mit rknn_init() initialisieren;

<!-- source EN p11 unit 77 -->

2. Native Ein-/Ausgabeattribute mit rknn_query() abfragen (RKNN_QUERY_NATIVE_INPUT_ATTR/RKNN_QUERY_NATIVE_OUTPUT_ATTR);

<!-- source EN p11 unit 78 -->

3. Eingabe optional vorverarbeiten;

<!-- source EN p11 unit 79 -->

4. Ein-/Ausgabeobjekte rknn_tensor_mem mit rknn_create_mem() erzeugen (bei externem Speicher rknn_create_mem_from_fd()/rknn_create_mem_from_phys() verwenden);

<!-- source EN p11 unit 80 -->

5. Ein-/Ausgabespeicher mit rknn_set_io_mem() setzen;

<!-- source EN p11 unit 81 -->

6. Inferenz mit rknn_run() ausführen;

<!-- source EN p11 unit 82 -->

7. Ausgabespeicherinformationen aus rknn_tensor_mem lesen und nachverarbeiten;

<!-- source EN p11 unit 83 -->

8. Ein-/Ausgabespeicher mit rknn_destroy_mem() freigeben;

<!-- source EN p11 unit 84 -->

9. RKNN mit rknn_destroy() auflösen.

<!-- source EN p12 unit 85 -->

![Abbildung aus dem Original-PDF — 12](/assets/images/rknn-v250/apis/runtime/en/p012-figure-01.png)

<!-- source EN p12 unit 86 -->

Abbildung 3-2. Zero-Copy-Aufrufablauf mit intern zugewiesenem Ein-/Ausgabespeicher

<!-- source EN p12 unit 87 -->

Details zu rknn_set_io_mem() siehe 5.4 „Tensoren und Speicher“.

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
