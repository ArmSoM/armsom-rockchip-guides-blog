---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Statuscodes, Tensoren, Speicher und Erweiterungstypen"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-types-common"
slug: "rknn-v250-runtime-api-types-common"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Statuscodes, Tensoren, Speicher und Erweiterungstypen | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Statuscodes, Tensoren, Speicher und Erweiterungstypen | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-types-common/"
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

<!-- source EN p36 unit 399 -->

## 6. Typreferenz

<!-- source EN p36 unit 400 -->

### 6.1. Statuscodes

<!-- source EN p36 unit 401 -->

Die Rückgabecodes der RKNN-API-Funktionen sind in der folgenden Tabelle definiert.

<!-- source EN p36 unit 402 -->

| Fehlercode | Meldung |
| --- | --- |
| RKNN_SUCC(0) | Erfolgreiche Ausführung. |
| RKNN_ERR_FAIL (-1) | Ausführungsfehler. |
| RKNN_ERR_TIMEOUT (-2) | Ausführungs-Timeout. |
| RKNN_ERR_DEVICE_UNAVAILABLE (-3) | NPU-Gerät nicht verfügbar. |
| RKNN_ERR_MALLOC_FAIL (-4) | Speicherzuweisung fehlgeschlagen. |
| RKNN_ERR_PARAM_INVALID (-5) | Parameterfehler. |
| RKNN_ERR_MODEL_INVALID (-6) | Ungültiges RKNN-Modell. |
| RKNN_ERR_CTX_INVALID (-7) | Ungültiger rknn_context. |
| RKNN_ERR_INPUT_INVALID (-8) | Ungültiges rknn_input-Objekt. |
| RKNN_ERR_OUTPUT_INVALID (-9) | Ungültiges rknn_output-Objekt. |
| RKNN_ERR_DEVICE_UNMATCH (-10) | Versionen stimmen nicht überein. |
| RKNN_ERR_INCOMPATILE_PRE_COMPILE_MODEL (-11) | Dieses RKNN-Modell verwendet pre_compile, ist jedoch mit dem aktuellen Treiber inkompatibel. |
| RKNN_ERR_INCOMPATILE_OPTIMIZATION_LEVEL_VERSION<br>(-12) | Das RKNN-Modell verwendet einen Optimierungsstufenmodus, der zum aktuellen Treiber inkompatibel ist. |
| RKNN_ERR_TARGET_PLATFORM_UNMATCH (-13) | Das RKNN-Modell ist mit der aktuellen Plattform inkompatibel. |
| RKNN_ERR_KEY_INVALID (-14) | Der Entschlüsselungsschlüssel-Umschlag ist ungültig oder nicht lesbar. |
| RKNN_ERR_DECRYPT_FAILED (-15) | Entschlüsselung von Modell oder Schlüssel-Umschlag fehlgeschlagen. |
| RKNN_ERR_SOC_BIND_FAILED (-16) | Die aktuelle SoC entspricht keiner gebundenen Plattform (SoC-Bindung fehlgeschlagen). |

<!-- source EN p36 unit 403 -->

### 6.2. Allgemeine Strukturen

<!-- source EN p36 unit 404 -->

### rknn_sdk_version

<!-- source EN p36 unit 405 -->

Die Struktur rknn_sdk_version enthält die Versionsinformationen des RKNN SDK. Ihre Definition folgt in der Tabelle:

<!-- source EN p36 unit 406 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| api_version | char[] | SDK-API-Versionsinformationen. |
| drv_version | char[] | SDK-Treiberversionsinformationen. |

<!-- source EN p36 unit 407 -->

### rknn_input_output_num

<!-- source EN p36 unit 408 -->

Die Struktur rknn_input_output_num beschreibt die Anzahl der Ein- und Ausgabetensoren. Ihre Definition folgt in der Tabelle:

<!-- source EN p36 unit 409 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| n_input | uint32_t | Anzahl der Eingabetensoren. |
| n_output | uint32_t | Anzahl der Ausgabetensoren. |

<!-- source EN p36 unit 410 -->

### rknn_input_range

<!-- source EN p37 unit 411 -->

Die Struktur rknn_input_range beschreibt die Liste unterstützter Eingabeformen: Eingabeindex, Anzahl der Formen, Datenlayout, Name und Formenliste. Die genaue Definition folgt in der Tabelle:

<!-- source EN p37 unit 412 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| index | uint32_t | Index der Eingabe. |
| shape_number | uint32_t | Anzahl der vom RKNN-Modell unterstützten Eingabeformen. |
| fmt | rknn_tensor_format | Datenlayout der entsprechenden Form. |
| name | char[] | Name der Eingabe. |
| dyn_range | uint32_t[][] | Liste der Eingabeformen: zweidimensionales Array mehrerer Formenarrays; die Form wird zuerst gespeichert. |
| n_dims | uint32_t | Anzahl gültiger Dimensionen jedes Formenarrays. |

<!-- source EN p37 unit 413 -->

### rknn_tensor_attr

<!-- source EN p37 unit 414 -->

Die Struktur rknn_tensor_attr beschreibt die Attribute eines Modelltensors. Ihre Definition folgt in der Tabelle:

<!-- source EN p37 unit 415 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| index | uint32_t | Index des Ein- oder Ausgabetensors. |
| n_dims | uint32_t | Anzahl der Tensordimensionen. |
| dims | uint32_t[] | Werte der einzelnen Dimensionen. |
| name | char[] | Tensorname. |
| n_elems | uint32_t | Anzahl der Tensordaten-Elemente. |
| size | uint32_t | Speichergröße der Tensordaten. |
| fmt | rknn_tensor_format | Tensorlayout: RKNN_TENSOR_NCHW, RKNN_TENSOR_NHWC, RKNN_TENSOR_NC1HWC2. |
| type | rknn_tensor_type | Tensordatentypen: RKNN_TENSOR_FLOAT32,<br>RKNN_TENSOR_FLOAT16, RKNN_TENSOR_INT8, RKNN_TENSOR_UINT8,<br>RKNN_TENSOR_INT16, RKNN_TENSOR_UINT16, RKNN_TENSOR_INT32,<br>RKNN_TENSOR_UINT32, RKNN_TENSOR_INT64, RKNN_TENSOR_BOOL,<br>RKNN_TENSOR_INT4, RKNN_TENSOR_BFLOAT16 |
| qnt_type | rknn_tensor_qnt_type | Quantisierungstyp: RKNN_TENSOR_QNT_NONE — nicht quantisiert; RKNN_TENSOR_QNT_DFP — dynamische Festkommaquantisierung; RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC — asymmetrische Quantisierung. |
| fl | int8_t | Quantisierungsparameter für RKNN_TENSOR_QNT_DFP. |
| zp | int32_t | Nullpunkt der Quantisierung RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC. |
| scale | float | Quantisierungsparameter für RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC. |
| w_stride | uint32_t | Tatsächliche Pixelanzahl zum Speichern einer Bildzeile: gültige Zeilenpixel plus ungültige Füllpixel, über die die Hardware schnell zur nächsten Zeile gelangt. Einheit: Pixel. |
| size_with_stride | uint32_t | Tatsächliche Bilddatengröße in Byte, einschließlich ungültiger Füllpixel. |
| pass_through | uint8_t | 0 — nicht konvertierte Daten; 1 — konvertierte Daten. Die Konvertierung umfasst Normalisierung und Quantisierung. |
| h_stride | uint32_t | Nur bei Multi-Batch-Eingaben verwendet und vom Benutzer einstellbar, damit die NPU die Anfangsadresse jedes Batch korrekt liest. Entspricht der ursprünglichen Modelleingabehöhe plus ungültigen Füllpixeln für den schnellen Hardware-Zeilensprung. Bei 0 entspricht es der Modelleingabehöhe. Einheit: Pixel. |

<!-- source EN p37 unit 416 -->

### rknn_perf_detail

<!-- source EN p38 unit 417 -->

Die Struktur rknn_perf_detail beschreibt detaillierte Leistungsdaten des Modells. Ihre Definition folgt in der Tabelle. Hinweis: RV1106/RV1103/RV1106B/RV1103B/RK2118 werden nicht unterstützt.

<!-- source EN p38 unit 418 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| perf_data | char* | Detaillierte Leistungsdaten: Laufzeit jeder Netzwerkschicht als Zeichenfolge. |
| data_len | uint64_t | Länge der Zeichenfolgendaten von perf_data. |

<!-- source EN p38 unit 419 -->

### rknn_perf_run

<!-- source EN p38 unit 420 -->

Die Struktur rknn_perf_run beschreibt die gesamte Inferenzzeit des Modells. Ihre Definition folgt in der Tabelle. Hinweis: RV1106/RV1103/RV1106B/RV1103B/RK2118 werden nicht unterstützt.

<!-- source EN p38 unit 421 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| run_duration | int64_t | Gesamte Inferenzzeit des Netzwerks in Mikrosekunden, ohne das Setzen von Ein- und Ausgaben. |

<!-- source EN p38 unit 422 -->

### rknn_mem_size

<!-- source EN p38 unit 423 -->

Die Struktur rknn_mem_size beschreibt die Speicherzuweisung bei der Modellinitialisierung. Ihre Definition folgt in der Tabelle:

<!-- source EN p38 unit 424 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| total_weight_size | uint32_t | Für Netzwerkgewichte zugewiesene Speichergröße. |
| total_internal_size | uint32_t | Für interne Netzwerktensoren zugewiesene Speichergröße. |
| total_dma_allocated_size | uint64_t | Gesamter dem Netzwerk zugewiesener DMA-Speicher. |
| total_sram_size | uint32_t | Nur RK3588: für die NPU reservierte SRAM-Größe. Details: RK3588_NPU_SRAM_usage.md. |
| free_sram_size | uint32_t | Nur RK3588: aktuell verfügbarer SRAM. Details: RK3588_NPU_SRAM_usage.md. |
| reserved[10] | uint32_t | Reserviert. |

<!-- source EN p38 unit 425 -->

### rknn_tensor_mem

<!-- source EN p38 unit 426 -->

Die Struktur rknn_tensor_mem beschreibt den Tensorspeicher. Ihre Definition folgt in der Tabelle:

<!-- source EN p38 unit 427 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| virt_addr | void* | Virtuelle Adresse des Tensors. |
| phys_addr | uint64_t | Physische Adresse des Tensors. |
| fd | int32_t | Dateideskriptor des Tensors. |
| offset | int32_t | Offset von fd und virtueller Adresse. |
| size | uint32_t | Tatsächliche Tensorgröße. |
| flags | uint32_t | Flags von rknn_tensor_mem:<br>RKNN_TENSOR_MEMORY_FLAGS_ALLOC_INSIDE: Struktur intern von der Laufzeit erstellt;<br>RKNN_TENSOR_MEMORY_FLAGS_FROM_FD: aus fd erstellt;<br>RKNN_TENSOR_MEMORY_FLAGS_FROM_PHYS: aus physischer Adresse erstellt. Benutzer müssen diese Flags nicht berücksichtigen. |
| priv_data | void* | Private Daten. |

### rknn_input

<!-- source EN p38 unit 428 -->

Die Struktur rknn_input repräsentiert Modelleingabedaten und dient als Parameter von rknn_inputs_set. Ihre Definition folgt in der Tabelle:

<!-- source EN p38 unit 429 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| index | uint32_t | Index dieser Eingabe. |
| buf | void* | Zeiger auf den Eingabedatenpuffer. |
| size | uint32_t | Speichergröße des Eingabedatenpuffers. |
| pass_through | uint8_t | Bei 1 wird buf ohne Vorverarbeitung direkt als Modelleingabeknoten gesetzt. |
| type | rknn_tensor_type | Typ der Eingabedaten. |
| fmt | rknn_tensor_format | Format der Eingabedaten. |

<!-- source EN p39 unit 431 -->

### rknn_output

<!-- source EN p39 unit 432 -->

Die Struktur rknn_output repräsentiert Modellausgabedaten und dient als Parameter von rknn_outputs_get. Nach dem Aufruf von rknn_outputs_get wird sie mit Daten belegt. Die Tabelle definiert alle Felder:

<!-- source EN p39 unit 433 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| want_float | uint8_t | Ob die Ausgabedaten in float zu konvertieren sind; vom Benutzer gesetzt. |
| is_prealloc | uint8_t | Ob der Ausgabedatenpuffer vorab zugewiesen ist; vom Benutzer gesetzt. |
| index | uint32_t | Index dieser Ausgabe. Die Quelle bezeichnet das Feld sowohl als vom Benutzer gesetzt als auch von der Schnittstelle zurückgegeben; der Widerspruch bleibt kenntlich. |
| buf | void* | Von der Schnittstelle zurückgegebener Zeiger auf den Ausgabedatenpuffer. |
| size | uint32_t | Von der Schnittstelle zurückgegebene Ausgabepuffergröße in Byte. |

<!-- source EN p39 unit 434 -->

### rknn_decrypt_key_mem

<!-- source EN p39 unit 435 -->

rknn_decrypt_key_mem übergibt als Hilfsstruktur den Schlüssel-Umschlag eines verschlüsselten Modells über user_key in rknn_init_extend an rknn_init. Definition:

<!-- source EN p39 unit 436 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| key_data | void* | Zeiger auf den Speicher des RKKE-Schlüssel-Umschlags. |
| key_size | uint32_t | Länge des Schlüssel-Umschlags in Byte. |

<!-- source EN p39 unit 437 -->

### rknn_init_extend

<!-- source EN p39 unit 438 -->

rknn_init_extend enthält erweiterte Informationen zur Modellinitialisierung. Definition:

<!-- source EN p39 unit 439 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| ctx | rknn_context | Initialisiertes rknn_context-Objekt. |
| real_model_offset | int32_t | Tatsächlicher Offset in der .rknn-Modelldatei. Nur gültig bei Initialisierung über einen Dateipfad oder Zero-Copy-Modellpuffer. |
| real_model_size | uint32_t | Tatsächliche Größe der rknn-Modelldatei. Nur gültig bei Initialisierung über einen Dateipfad oder Zero-Copy-Modellpuffer. |
| model_buffer_fd | int32_t | fd des durch die NPU zugewiesenen Modellspeichers nach Initialisierung mit RKNN_FLAG_MODEL_BUFFER_ZERO_COPY. |
| model_buffer_flags | uint32_t | Speicherflags des durch die NPU zugewiesenen Modellspeichers nach Initialisierung mit RKNN_FLAG_MODEL_BUFFER_ZERO_COPY. |
| user_key | rknn_decrypt_key_mem* | Zeiger auf den Benutzerschlüssel (rknn_decrypt_key_mem*) zum Laden RKCE-verschlüsselter Modelle. Für unverschlüsselte Modelle NULL setzen. |
| reserved | uint8_t[] | Reservierte Daten. |

<!-- source EN p39 unit 440 -->

### rknn_run_extend

<!-- source EN p39 unit 441 -->

Die Struktur rknn_run_extend enthält erweiterte Informationen während der Modellinferenz. Im beschriebenen Stand ist sie nicht verfügbar. Ihre Definition folgt in der Tabelle:

<!-- source EN p40 unit 442 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| frame_id | uint64_t | Frameindex der aktuellen Inferenz. |
| non_block | int32_t | 0 — blockierend; 1 — nicht blockierend, wobei rknn_run sofort zurückkehrt. |
| timeout_ms | int32_t | Inferenz-Timeout in Millisekunden. |
| fence_fd | int32_t | Für nicht blockierende Inferenz; nicht verfügbar. |

<!-- source EN p40 unit 443 -->

### rknn_output_extend

<!-- source EN p40 unit 444 -->

Die Struktur rknn_output_extend dient zum Abruf erweiterter Ausgabeinformationen. Im beschriebenen Stand ist sie nicht verfügbar. Ihre Definition folgt in der Tabelle:

<!-- source EN p40 unit 445 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| frame_id | uint64_t | Frameindex des Ausgabeergebnisses. |

<!-- source EN p40 unit 446 -->

### rknn_custom_string

<!-- source EN p40 unit 447 -->

Die Struktur rknn_custom_string enthält die vom Benutzer bei der RKNN-Modellkonvertierung festgelegte Zeichenfolge. Ihre Definition folgt in der Tabelle:

<!-- source EN p40 unit 448 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| string | char[] | Benutzerdefinierte Zeichenfolge. |

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
