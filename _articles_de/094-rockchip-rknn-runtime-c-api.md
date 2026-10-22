---
title: "Rockchip RKNN Runtime C API: Basis-APIs, Matmul und benutzerdefinierte Operatoren"
description: "Vollständige RKNN-C-API-Referenz V2.3.2 zu Plattformen, Build, Strukturen, Parametern, Beispielen und allen Fehlercodes einschließlich Quellwidersprüchen."
translation_key: "094-rockchip-rknn-runtime-c-api"
slug: "094-rockchip-rknn-runtime-c-api"
lang: "de"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
tags: ["ArmSoM", "Rockchip", "RKNN", "Runtime", "NPU", "C API"]
keywords: "ArmSoM Rockchip RKNN Runtime C API RK3588 RK3576"
excerpt: "Vollständige RKNN-C-API-Referenz V2.3.2 zu Plattformen, Build, Strukturen, Parametern, Beispielen und allen Fehlercodes einschließlich Quellwidersprüchen."
---

{% raw %}

# Rockchip RKNN Runtime C API: Basis-APIs, Matmul und benutzerdefinierte Operatoren

## Anwendbarkeit auf ArmSoM und Quelle

Quellen sind RK-YH-YF-413, V2.3.2: 52 chinesische und 57 englische Seiten. Chinesisch folgt dem chinesischen Original; Englisch dem englischen Original, das vollständig ins Russische und Deutsche übersetzt wurde. Die Quellen enthalten keine technischen Abbildungen oder Code-Screenshots: Alle Tabellen sind editierbar und sämtlicher Code kopierbarer Text; Abbildungen werden nicht erfunden. Genannt werden RV1103/RV1103B/RV1106/RV1106B/RV1126B, RK2118, RK3562 sowie die Serien RK3566/RK3568/RK3576/RK3588. Einzelne APIs, Abfragen und Parameter gelten jedoch nicht für alle Plattformen; die Unterstützungsmatrizen sind maßgeblich. Dies ist lediglich eine ArmSoM-Anpassungsreferenz, ohne Prüfung konkreter Boards, SDK/BSP- oder Kernel-/Treiberkombinationen. RKNPU Runtime, Modellformat und NPU-Hardware müssen zusammenpassen. Code-, Hardware- oder Leistungstests wurden nicht ausgeführt; Beispiele sind keine ArmSoM-Messwerte.

Hinweis: Die Beschreibung der DEVICE_MEM_INFO-Unterstützung widerspricht der Matrix. Auch INPUT/OUTPUT-Bezeichnungen, CPU/GPU-Aufzählungen und die Freigabereihenfolge bei Zero-Copy sind fraglich. Quellwerte bleiben erhalten; dies ist keine geprüfte, ausführbare Korrekturfassung. Vor Nutzung Hinweise und tatsächliche SDK-Header prüfen.

[EDITORIAL-NOTES](/docs/rockchip-rknn-runtime-c-api/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

<!-- source: EN PDF p6; unit 0 -->

## 1. Übersicht

<!-- source: EN PDF p6; unit 1 -->

RKNN C API stellt C-Schnittstellen für RKNPU Runtime bereit. Damit lässt sich die Rechenleistung der NPU für effiziente RKNN-Modellinferenz oder Matrixmultiplikationen nutzen. Beschrieben werden die Funktionen, Datenstrukturen und Rückgabecodes der RKNN C API.

<!-- source: EN PDF p6; unit 2 -->

## 2. Unterstützte Hardwareplattformen

<!-- source: EN PDF p6; unit 3 -->

Das Dokument gilt für folgende Hardwareplattformen:

<!-- source: EN PDF p6; unit 4 -->

RV1103

<!-- source: EN PDF p6; unit 5 -->

RV1103B

<!-- source: EN PDF p6; unit 6 -->

RV1106

<!-- source: EN PDF p6; unit 7 -->

RV1106B

<!-- source: EN PDF p6; unit 8 -->

RV1126B

<!-- source: EN PDF p6; unit 9 -->

RK2118

<!-- source: EN PDF p6; unit 10 -->

RK3562

<!-- source: EN PDF p6; unit 11 -->

RK3566-Serie

<!-- source: EN PDF p6; unit 12 -->

RK3568-Serie

<!-- source: EN PDF p6; unit 13 -->

RK3576-Serie

<!-- source: EN PDF p6; unit 14 -->

RK3588-Serie

<!-- source: EN PDF p7; unit 15 -->

## 3. RKNPU-Build-Anleitung

<!-- source: EN PDF p7; unit 16 -->

Beim Kompilieren einer Anwendung ist die Headerdatei der Schnittstellenfunktion einzubinden und die passende RKNPU-Runtime-Bibliothek für Hardwareplattform und Systemtyp zu linken. Nachfolgend werden die Headerdateien der RKNN C API und die Runtime-Bibliotheksdateien beschrieben.

<!-- source: EN PDF p7; unit 17 -->

### 3.1 Headerdateien der RKNN C API

<!-- source: EN PDF p7; unit 18 -->

Die RKNN C API gliedert sich nach Funktionen in drei Teile. Funktionen, Datenstrukturdefinitionen und Headerdateien sind wie folgt zugeordnet:

<!-- source: EN PDF p7; unit 19 -->

1\. “rknn_api.h” definiert die grundlegenden Schnittstellen und Datenstrukturen zur Bereitstellung von RKNN-Modellen.

<!-- source: EN PDF p7; unit 20 -->

2\. “rknn_matmul_api.h” definiert Schnittstellen und Datenstrukturen für Matrixmultiplikation.

<!-- source: EN PDF p7; unit 21 -->

3\. “rknn_custom_op.h” definiert Schnittstellen und Datenstrukturen benutzerdefinierter Operatoren.

<!-- source: EN PDF p7; unit 22 -->

### 3.2 RKNPU-Runtime-Bibliothek für Linux

<!-- source: EN PDF p7; unit 23 -->

1\. Für RK3562, die Serien RK3566, RK3568, RK3576, RK3588 und RV1126B ist die RKNPU-Runtime-Bibliothek librknnrt.so im Verzeichnis &lt;sdk_path&gt;/rknpu2/runtime. &lt;sdk_path&gt; ist der Pfad zum Rockchip-NPU-SDK.

<!-- source: EN PDF p7; unit 24 -->

2\. Für RV1106/RV1103/RV1106B/RV1103B ist die RKNPU-Runtime-Bibliothek librknnmrt.so im Verzeichnis &lt;sdk_path&gt;/rknpu2/runtime.

<!-- source: EN PDF p7; unit 25 -->

### 3.3 RKNPU-Runtime-Bibliothek für Android

<!-- source: EN PDF p7; unit 26 -->

Unter Android lässt sich die RKNN API auf zwei Arten aufrufen:

<!-- source: EN PDF p7; unit 27 -->

1\. Die Anwendung linkt direkt gegen librknnrt.so.

<!-- source: EN PDF p7; unit 28 -->

2\. Die Anwendung linkt gegen die unter Android mittels HIDL implementierte librknn_api_android.so.

<!-- source: EN PDF p7; unit 29 -->

Android-Geräte, die CTS/VTS bestehen müssen, benötigen die RKNN API auf Basis von Android HIDL; librknn_api_android.so enthält keine Matrixmultiplikation und keine benutzerdefinierten Operatoren. Ist CTS/VTS nicht erforderlich, wird die direkte Nutzung von librknnrt.so empfohlen, die beide Funktionen enthält. Der Aufrufweg jeder Schnittstelle ist kürzer und kann bessere Leistung bieten.

<!-- source: EN PDF p7; unit 30 -->

Der über Android HIDL implementierte RKNN-API-Code liegt im Verzeichnis vendor/rockchip/hardware/interfaces/neuralnetworks des Android-System-SDK für RK3562/RK3566/RK3568/RK3576/RK3588.

<!-- source: EN PDF p7; unit 31 -->

Nach dem Android-Systembuild werden folgende RKNPU-Bibliotheksdateien erzeugt. Für die Anwendungsentwicklung genügt das Linken gegen librknn_api_android.so:

<!-- source: EN PDF p7; unit 32 -->

```c
/vendor/lib/librknn_api_android.so
/vendor/lib/librknnhal_bridge.rockchip.so
/vendor/lib64/librknn_api_android.so
/vendor/lib64/librknnhal_bridge.rockchip.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0-adapter-helper.so
/vendor/lib64/hw/rockchip.hardware.neuralnetworks@1.0-impl.so
/vendor/bin/hw/rockchip.hardware.neuralnetworks@1.0-service
```

<!-- source: EN PDF p8; unit 33 -->

Alternativ können diese Bibliotheken mit folgendem Befehl separat neu gebaut werden:

<!-- source: EN PDF p8; unit 34 -->

```c
mmm vendor/rockchip/hardware/interfaces/neuralnetworks/ -j8
```

<!-- source: EN PDF p8; unit 35 -->

### 3.4 RKNPU-Runtime-Bibliothek für RK2118

<!-- source: EN PDF p8; unit 36 -->

Für RK2118 befindet sich die RKNPU-Runtime-Bibliothek im System-SDK des RK2118. Siehe Abschnitt “Prepare RK2118 SDK” in “Rockchip_RK2118_Quick_Start_RKNN_SDK_EN.pdf”.

<!-- source: EN PDF p9; unit 37 -->

## 4. Beschreibung der RKNN C API

<!-- source: EN PDF p9; unit 38 -->

### 4.1 C-API-Unterstützung der Hardwareplattformen

<!-- source: EN PDF p9; unit 39 -->

Aufgrund unterschiedlicher Hardwareeigenschaften unterscheiden sich die Unterstützung der RKNN-C-API-Schnittstellen und ihrer Parameter je Plattform. Tabelle 4-1 zeigt die Schnittstellenunterstützung.

<!-- source: EN PDF p9; unit 40 -->

Tabelle 4-1:

<!-- source: EN PDF p9; unit 41 -->

Tabelle 4-1: RKNN-C-API-Schnittstellenunterstützung je Hardwareplattform

<!-- source: EN PDF p9,10; unit 42,43 -->

|  | RKNN C API | RV1126B/RK3562/RK3566/<br>RK3568 | RK3576/RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B | RK2118 |
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

<!-- source: EN PDF p10; unit 44 -->

Die je Hardwareplattform unterstützten Abfrageparameter von rknn_query stehen in Tabelle 4-2:

<!-- source: EN PDF p10; unit 45 -->

Tabelle 4-2: Unterstützte rknn_query-Abfrageparameter je Hardwareplattform

<!-- source: EN PDF p10; unit 46 -->

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

<!-- source: EN PDF p10; unit 47 -->

### 4.2 Definitionen grundlegender Datenstrukturen

<!-- source: EN PDF p10; unit 48 -->

#### rknn_sdk_version

<!-- source: EN PDF p10; unit 49 -->

Die Struktur rknn_sdk_version enthält die Versionsinformationen des RKNN SDK. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p10; unit 50 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| api_version | char[] | SDK-API-Versionsinformationen. |
| drv_version | char[] | SDK-Treiberversionsinformationen. |

<!-- source: EN PDF p11; unit 51 -->

#### rknn_input_output_num

<!-- source: EN PDF p11; unit 52 -->

Die Struktur rknn_input_output_num beschreibt die Anzahl der Ein- und Ausgabetensoren. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p11; unit 53 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| n_input | uint32_t | Anzahl der Eingabetensoren. |
| n_output | uint32_t | Anzahl der Ausgabetensoren. |

<!-- source: EN PDF p11; unit 54 -->

#### rknn_input_range

<!-- source: EN PDF p11; unit 55 -->

Die Struktur rknn_input_range beschreibt die Liste unterstützter Eingabeformen: Eingabeindex, Anzahl der Formen, Datenlayout, Name und Formenliste. Die genaue Definition folgt in der Tabelle:

<!-- source: EN PDF p11; unit 56 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| index | uint32_t | Index der Eingabe. |
| shape_number | uint32_t | Anzahl der vom RKNN-Modell unterstützten Eingabeformen. |
| fmt | rknn_tensor_format | Datenlayout der entsprechenden Form. |
| name | char[] | Name der Eingabe. |
| dyn_range | uint32_t[][] | Liste der Eingabeformen: zweidimensionales Array mehrerer Formenarrays; die Form wird zuerst gespeichert. |
| n_dims | uint32_t | Anzahl gültiger Dimensionen jedes Formenarrays. |

<!-- source: EN PDF p12; unit 57 -->

#### rknn_tensor_attr

<!-- source: EN PDF p12; unit 58 -->

Die Struktur rknn_tensor_attr beschreibt die Attribute eines Modelltensors. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p12,13; unit 59,60 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| index | uint32_t | Index des Ein- oder Ausgabetensors. |
| n_dims | uint32_t | Anzahl der Tensordimensionen. |
| dims | uint32_t[] | Werte der einzelnen Dimensionen. |
| name | char[] | Tensorname. |
| n_elems | uint32_t | Anzahl der Tensordaten-Elemente. |
| size | uint32_t | Speichergröße der Tensordaten. |
| fmt | rknn_tensor_format | Tensorlayout: RKNN_TENSOR_NCHW, RKNN_TENSOR_NHWC, RKNN_TENSOR_NC1HWC2. |
| type | rknn_tensor_type | Tensordatentyp: RKNN_TENSOR_FLOAT32, RKNN_TENSOR_FLOAT16, RKNN_TENSOR_INT8, RKNN_TENSOR_UINT8, RKNN_TENSOR_INT16, RKNN_TENSOR_UINT16, RKNN_TENSOR_INT32, RKNN_TENSOR_INT64, RKNN_TENSOR_BOOL. |
| qnt_type | rknn_tensor_qnt_type | Quantisierungstyp: RKNN_TENSOR_QNT_NONE — nicht quantisiert; RKNN_TENSOR_QNT_DFP — dynamische Festkommaquantisierung; RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC — asymmetrische Quantisierung. |
| fl | int8_t | Quantisierungsparameter für RKNN_TENSOR_QNT_DFP. |
| scale | float | Quantisierungsparameter für RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC. |
| w_stride | uint32_t | Tatsächliche Pixelanzahl zum Speichern einer Bildzeile: gültige Zeilenpixel plus ungültige Füllpixel, über die die Hardware schnell zur nächsten Zeile gelangt. Einheit: Pixel. |
| size_with_stride | uint32_t | Tatsächliche Bilddatengröße in Byte, einschließlich ungültiger Füllpixel. |
| pass_through | uint8_t | 0 — nicht konvertierte Daten; 1 — konvertierte Daten. Die Konvertierung umfasst Normalisierung und Quantisierung. |
| h_stride | uint32_t | Nur bei Multi-Batch-Eingaben verwendet und vom Benutzer einstellbar, damit die NPU die Anfangsadresse jedes Batch korrekt liest. Entspricht der ursprünglichen Modelleingabehöhe plus ungültigen Füllpixeln für den schnellen Hardware-Zeilensprung. Bei 0 entspricht es der Modelleingabehöhe. Einheit: Pixel. |

<!-- source: EN PDF p13; unit 61 -->

#### rknn_perf_detail

<!-- source: EN PDF p13; unit 62 -->

Die Struktur rknn_perf_detail beschreibt detaillierte Leistungsdaten des Modells. Ihre Definition folgt in der Tabelle. Hinweis: RV1106/RV1103/RV1106B/RV1103B/RK2118 werden nicht unterstützt.

<!-- source: EN PDF p13; unit 63 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| perf_data | char* | Detaillierte Leistungsdaten: Laufzeit jeder Netzwerkschicht als Zeichenfolge. |
| data_len | uint64_t | Länge der Zeichenfolgendaten von perf_data. |

<!-- source: EN PDF p13; unit 64 -->

#### rknn_perf_run

<!-- source: EN PDF p13; unit 65 -->

Die Struktur rknn_perf_run beschreibt die gesamte Inferenzzeit des Modells. Ihre Definition folgt in der Tabelle. Hinweis: RV1106/RV1103/RV1106B/RV1103B/RK2118 werden nicht unterstützt.

<!-- source: EN PDF p13; unit 66 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| run_duration | int64_t | Gesamte Inferenzzeit des Netzwerks in Mikrosekunden, ohne das Setzen von Ein- und Ausgaben. |

<!-- source: EN PDF p14; unit 67 -->

#### rknn_mem_size

<!-- source: EN PDF p14; unit 68 -->

Die Struktur rknn_mem_size beschreibt die Speicherzuweisung bei der Modellinitialisierung. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p14; unit 69 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| total_weight_size | uint32_t | Für Netzwerkgewichte zugewiesene Speichergröße. |
| total_internal_size | uint32_t | Für interne Netzwerktensoren zugewiesene Speichergröße. |
| total_dma_allocated_size | uint64_t | Gesamter dem Netzwerk zugewiesener DMA-Speicher. |
| total_sram_size | uint32_t | Nur RK3588: für die NPU reservierte SRAM-Größe. Weitere Angaben in RK3588_NPU_SRAM_usage.md. |
| free_sram_size | uint32_t | Nur RK3588: aktuell verfügbarer SRAM. Weitere Angaben in RK3588_NPU_SRAM_usage.md. |
| reserved[12] | uint32_t | Reserviert. |

<!-- source: EN PDF p14; unit 70 -->

#### rknn_tensor_mem

<!-- source: EN PDF p14; unit 71 -->

Die Struktur rknn_tensor_mem beschreibt den Tensorspeicher. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p14; unit 72 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| virt_addr | void* | Virtuelle Adresse des Tensors. |
| phys_addr | uint64_t | Physische Adresse des Tensors. |
| fd | int32_t | Dateideskriptor des Tensors. |
| offset | int32_t | Offset von fd und virtueller Adresse. |
| size | uint32_t | Tatsächliche Tensorgröße. |
| flags | uint32_t | Flags von rknn_tensor_mem: RKNN_TENSOR_MEMORY_FALGS_ALLOC_INSIDE — Struktur intern in der Runtime erstellt; RKNN_TENSOR_MEMORY_FLAGS_FROM_FD — über fd erstellt; RKNN_TENSOR_MEMORY_FLAGS_FROM_PHYS — über eine physische Adresse erstellt. Der Benutzer muss diese Flags nicht berücksichtigen. |
| priv_data | void* | Private Daten. |

<!-- source: EN PDF p15; unit 73 -->

#### rknn_input

<!-- source: EN PDF p15; unit 74 -->

Die Struktur rknn_input repräsentiert Modelleingabedaten und dient als Parameter von rknn_inputs_set. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p15; unit 75 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| index | uint32_t | Index dieser Eingabe. |
| buf | void* | Zeiger auf den Eingabedatenpuffer. |
| size | uint32_t | Speichergröße des Eingabedatenpuffers. |
| pass_through | uint8_t | Bei 1 wird buf ohne Vorverarbeitung direkt als Modelleingabeknoten gesetzt. |
| type | rknn_tensor_type | Typ der Eingabedaten. |
| fmt | rknn_tensor_format | Format der Eingabedaten. |

<!-- source: EN PDF p15; unit 76 -->

#### rknn_output

<!-- source: EN PDF p15; unit 77 -->

Die Struktur rknn_output repräsentiert Modellausgabedaten und dient als Parameter von rknn_outputs_get. Nach dem Aufruf von rknn_outputs_get wird sie mit Daten belegt. Die Tabelle definiert alle Felder:

<!-- source: EN PDF p15; unit 78 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| want_float | uint8_t | Ob die Ausgabedaten in float zu konvertieren sind; vom Benutzer gesetzt. |
| is_prealloc | uint8_t | Ob der Ausgabedatenpuffer vorab zugewiesen ist; vom Benutzer gesetzt. |
| index | uint32_t | Index dieser Ausgabe. Die Quelle bezeichnet das Feld sowohl als vom Benutzer gesetzt als auch von der Schnittstelle zurückgegeben; der Widerspruch bleibt kenntlich. |
| buf | void* | Von der Schnittstelle zurückgegebener Zeiger auf den Ausgabedatenpuffer. |
| size | uint32_t | Von der Schnittstelle zurückgegebene Ausgabepuffergröße in Byte. |

<!-- source: EN PDF p16; unit 79 -->

#### rknn_init_extend

<!-- source: EN PDF p16; unit 80 -->

Die Struktur rknn_init_extend enthält erweiterte Informationen zur Modellinitialisierung. Im beschriebenen Stand ist sie auf RV1106/RV1103/RV1106B/RV1103B/RK2118 nicht verfügbar. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p16; unit 81 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| ctx | rknn_context | Initialisiertes rknn_context-Objekt. |
| real_model_offset | int32_t | Tatsächlicher Offset in der .rknn-Modelldatei. Nur gültig bei Initialisierung über einen Dateipfad oder Zero-Copy-Modellpuffer. |
| real_model_size | uint32_t | Tatsächliche Größe der rknn-Modelldatei. Nur gültig bei Initialisierung über einen Dateipfad oder Zero-Copy-Modellpuffer. |
| model_buffer_fd | int32_t | fd des durch die NPU zugewiesenen Modellspeichers nach Initialisierung mit RKNN_FLAG_MODEL_BUFFER_ZERO_COPY. |
| model_buffer_flags | uint32_t | Speicherflags des durch die NPU zugewiesenen Modellspeichers nach Initialisierung mit RKNN_FLAG_MODEL_BUFFER_ZERO_COPY. |
| reserved | uint8_t[] | Reservierte Daten. |

<!-- source: EN PDF p16; unit 82 -->

#### rknn_run_extend

<!-- source: EN PDF p16; unit 83 -->

Die Struktur rknn_run_extend enthält erweiterte Informationen während der Modellinferenz. Im beschriebenen Stand ist sie nicht verfügbar. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p16; unit 84 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| frame_id | uint64_t | Frameindex der aktuellen Inferenz. |
| non_block | int32_t | 0 — blockierend; 1 — nicht blockierend, wobei rknn_run sofort zurückkehrt. |
| timeout_ms | int32_t | Inferenz-Timeout in Millisekunden. |
| fence_fd | int32_t | Für nicht blockierende Inferenz; nicht verfügbar. |

<!-- source: EN PDF p16; unit 85 -->

#### rknn_output_extend

<!-- source: EN PDF p16; unit 86 -->

Die Struktur rknn_output_extend dient zum Abruf erweiterter Ausgabeinformationen. Im beschriebenen Stand ist sie nicht verfügbar. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p16; unit 87 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| frame_id | int32_t | Frameindex des Ausgabeergebnisses. |

<!-- source: EN PDF p17; unit 88 -->

#### rknn_custom_string

<!-- source: EN PDF p17; unit 89 -->

Die Struktur rknn_custom_string enthält die vom Benutzer bei der RKNN-Modellkonvertierung festgelegte Zeichenfolge. Ihre Definition folgt in der Tabelle:

<!-- source: EN PDF p17; unit 90 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| string | char[] | Benutzerdefinierte Zeichenfolge. |

<!-- source: EN PDF p18; unit 91 -->

### 4.3 Beschreibung der grundlegenden APIs

<!-- source: EN PDF p18; unit 92 -->

#### rknn_init

<!-- source: EN PDF p18; unit 93 -->

Die Initialisierungsfunktion rknn_init erstellt ein rknn_context-Objekt, lädt das RKNN-Modell und führt die durch Flags und rknn_init_extend festgelegte Initialisierung aus.

<!-- source: EN PDF p18; unit 94 -->

| API | rknn_init |
| --- | --- |
| Beschreibung | Initialisiert den rknn-Kontext. |
| Parameter | rknn_context *context: Zeiger auf das rknn_context-Objekt. |
|  | void *model: Binärdaten des RKNN-Modells oder dessen Pfad. Bei size&gt;0 Binärdaten, bei size=0 Modellpfad. |
|  | uint32_t size: Größe des als Binärdaten übergebenen Modells; 0, wenn model einen Pfad enthält. |
|  | uint32_t flag: Initialisierungsflag; für das Standardverhalten auf 0 setzen. |
|  | rknn_init_extend: erweiterte Informationen für besondere Initialisierung. Die Quelle nennt diese deaktiviert und fordert NULL, verlangt beim Teilen von Gewichten jedoch einen Zeiger auf einen anderen rknn_context für ein anderes Modell. Beide Aussagen bleiben erhalten. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p18; unit 95 -->

Beispielcode:

<!-- source: EN PDF p18; unit 96 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
```

<!-- source: EN PDF p18; unit 97 -->

Die Initialisierungsflags werden nachfolgend erläutert:

<!-- source: EN PDF p18; unit 98 -->

RKNN_FLAG_COLLECT_PERF_MASK: ermöglicht die Abfrage der Laufzeit jeder Netzwerkschicht.

<!-- source: EN PDF p18; unit 99 -->

RKNN_FLAG_MEM_ALLOC_OUTSIDE: kennzeichnet, dass der Benutzer den Speicher für Modelleingaben, Ausgaben, Gewichte und Zwischentensoren vollständig selbst zuweist. Dies hat zwei Hauptzwecke:

<!-- source: EN PDF p18; unit 100 -->

1\. Die vollständige Speicherzuweisung durch den Benutzer erleichtert die übergreifende Planung des gesamten Systemspeichers.

<!-- source: EN PDF p18; unit 101 -->

2\. Wiederverwendung von Speicher, insbesondere bei sehr knappem Speicher wie auf RV1106/RV1103/RV1106B/RV1103B/RK2118.

<!-- source: EN PDF p18; unit 102 -->

Angenommen, die Modelle A und B werden nacheinander ausgeführt. Dann lässt sich der Speicher ihrer Zwischentensoren wiederverwenden. Beispielcode:

<!-- source: EN PDF p18,19; unit 103,104 -->

```c
rknn_context ctx_a, ctx_b;

rknn_init(&ctx_a, model_path_a, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
rknn_query(ctx_a, RKNN_QUERY_MEM_SIZE, &mem_size_a, sizeof(mem_size_a));

rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
rknn_query(ctx_b, RKNN_QUERY_MEM_SIZE, &mem_size_b, sizeof(mem_size_b));
max_internal_size = MAX(mem_size_a.total_internal_size, mem_size_b.total_internal_size);
internal_mem_max = rknn_create_mem(ctx_a, max_internal_size);

internal_mem_a = rknn_create_mem_from_fd(ctx_a, internal_mem_max->fd,
    internal_mem_max->virt_addr, mem_size_a.total_internal_size, 0);
rknn_set_internal_mem(ctx_a, internal_mem_a);

internal_mem_b = rknn_create_mem_from_fd(ctx_b, internal_mem_max->fd,
    internal_mem_max->virt_addr, mem_size_b.total_internal_size, 0);
rknn_set_internal_mem(ctx_b, internal_mem_b);
```

<!-- source: EN PDF p19; unit 105 -->

RKNN_FLAG_SHARE_WEIGHT_MEM: dient zur gemeinsamen Nutzung der Gewichte eines anderen Modells. Hauptzweck ist die Nachbildung variabler Eingabelängen; ab RKNPU Runtime 1.5.0 wird diese Funktion durch dynamische Formen ersetzt. Beispielsweise haben manche Sprachmodelle variable Eingabelängen, die NPU unterstützt diese jedoch nicht unmittelbar. Daher werden mehrere RKNN-Modelle unterschiedlicher Auflösung erzeugt. Nur eines enthält vollständige Gewichte, die anderen keine. Bei Initialisierung eines Modells ohne Gewichte erlaubt dieses Flag dem aktuellen Kontext, die Gewichte des vollständigen Modells mitzunutzen. Für zwei Modelle mit Auflösung A und B gilt folgender Ablauf:

<!-- source: EN PDF p19; unit 106 -->

1\. Mit RKNN-Toolkit2 ein Modell der Auflösung A erzeugen.

<!-- source: EN PDF p19; unit 107 -->

2\. Mit RKNN-Toolkit2 ein Modell der Auflösung B ohne Gewichte erzeugen: In rknn.config() remove_weight auf True setzen. Hauptzweck ist die Verringerung der Größe von Modell B.

<!-- source: EN PDF p19; unit 108 -->

3\. Modell A auf dem Board normal initialisieren.

<!-- source: EN PDF p19; unit 109 -->

4\. Modell B mit RKNN_FLAG_SHARE_WEIGHT_MEM initialisieren.

<!-- source: EN PDF p19; unit 110 -->

5\. Die weitere Verwendung erfolgt wie gewohnt. Referenzcode für das Board:

<!-- source: EN PDF p19; unit 111 -->

```c
rknn_context ctx_a, ctx_b;
rknn_init(&ctx_a, model_path_a, 0, 0, NULL);

rknn_init_extend extend;
extend.ctx = ctx_a;
rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_SHARE_WEIGHT_MEM, &extend);
```

<!-- source: EN PDF p19; unit 112 -->

RKNN_FLAG_COLLECT_MODEL_INFO_ONLY: initialisiert einen leeren Kontext. Darin lässt sich nur rknn_query zur Abfrage der Gesamtgrößen des Gewichtsspeichers und der Zwischentensoren aufrufen; Inferenz ist nicht möglich.

<!-- source: EN PDF p19; unit 113 -->

RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE: Der Benutzer weist die Zwischentensoren des Modells zu. Dies wird häufig zur eigenen Verwaltung und Wiederverwendung des Zwischentensorspeichers mehrerer Modelle genutzt.

<!-- source: EN PDF p19; unit 114 -->

RKNN_FLAG_EXECUTE_FALLBACK_PRIOR_DEVICE_GPU: Alle von der NPU nicht unterstützten Schichten sollen bevorzugt auf der GPU laufen, ohne Garantie. Das tatsächliche Ausführungsgerät hängt von der Operatorunterstützung der Runtime ab.

<!-- source: EN PDF p19; unit 115 -->

RKNN_FLAG_ENABLE_SRAM: Zwischentensorspeicher wird nach Möglichkeit im SRAM zugewiesen.

<!-- source: EN PDF p19; unit 116 -->

RKNN_FLAG_SHARE_SRAM: Der aktuelle Kontext versucht, den SRAM-Adressraum eines anderen Kontexts mitzunutzen. Bei seiner Initialisierung muss RKNN_FLAG_ENABLE_SRAM aktiviert sein.

<!-- source: EN PDF p20; unit 117 -->

RKNN_FLAG_DISABLE_PROC_HIGH_PRIORITY: Der aktuelle Kontext verwendet die Standardprozesspriorität. Ohne dieses Flag beträgt der nice-Wert des Prozesses -19.

<!-- source: EN PDF p20; unit 118 -->

RKNN_FLAG_DISABLE_FLUSH_INPUT_MEM_CACHE: Die Runtime schreibt den Eingabetensor-Cache nicht zurück; der Benutzer muss dies vor rknn_run sicherstellen.

<!-- source: EN PDF p20; unit 119 -->

RKNN_FLAG_DISABLE_FLUSH_OUTPUT_MEM_CACHE: Die Runtime bereinigt den Ausgabetensor-Cache nicht aktiv. Direkter Benutzerzugriff auf output_mem-&gt;virt_addr kann dann Cache-Konsistenzprobleme verursachen. Vor der Nutzung von output_mem-&gt;virt_addr ist der Cache mit rknn_mem_sync(ctx, mem, RKNN_MEMORY_SYNC_FROM_DEVICE) zu aktualisieren. Das Flag wird typischerweise eingesetzt, wenn nicht die CPU, sondern etwa GPU oder RGA die NPU-Ausgabe liest.

<!-- source: EN PDF p20; unit 120 -->

RKNN_FLAG_MODEL_BUFFER_ZERO_COPY: Der an rknn_init übergebene Modellpuffer wurde durch rknn_create_mem oder rknn_create_mem2 zugewiesen. Die Runtime erstellt keine zusätzliche Pufferkopie und benötigt dadurch weniger Speicher. Der Benutzer muss den Modellspeicher bis zur Zerstörung des Kontexts gültig halten und danach freigeben. Bei der Initialisierung werden real_model_offset, real_model_size, model_buffer_fd und model_buffer_flags des Parameters rknn_init_extend von rknn_init anhand des von rknn_create_mem2 zurückgegebenen rknn_tensor_mem gesetzt.

<!-- source: EN PDF p20; unit 121 -->

RKNN_MEM_FLAG_ALLOC_NO_CONTEXT: erlaubt bei Speicherzuweisung über rknn_create_mem2 einen ctx-Wert von 0 oder NULL. So lässt sich vom NPU-Treiber zugewiesener Speicher bereits vor der Initialisierung eines Kontexts erhalten. Die zurückgegebene Speicherstruktur muss über rknn_destroy_mem freigegeben werden; dabei kann ein beliebiger Kontext übergeben werden. Beispielcode:

<!-- source: EN PDF p20; unit 122 -->

```c
 rknn_tensor_mem* model_mem = rknn_create_mem2(ctx, model_size,
RKNN_MEM_FLAG_ALLOC_NO_CONTEXT);
 memcpy(model_mem->virt_addr, model_data, model_size);
 rknn_init_extend init_ext;
 memset(&init_ext, 0, sizeof(rknn_init_extend));
 init_ext.real_model_offset = 0;
 init_ext.real_model_size = model_size;
 init_ext.model_buffer_fd = model_mem->fd;
 init_ext.model_buffer_flags = model_mem->flags;
 int ret = rknn_init(&ctx, model_mem->virt_addr, model_size, RKNN_FLAG_MODEL_BUFFER_ZERO_COPY,
&init_ext);

 // do rknn inference...

 rknn_destroy_mem(ctx, model_mem);
 rknn_destroy(ctx);
```

<!-- source: EN PDF p20; unit 123 -->

#### rknn_set_core_mask

<!-- source: EN PDF p20; unit 124 -->

Die Funktion legt die auszuführenden NPU-Kerne fest. Im beschriebenen Stand funktioniert sie nur auf RK3588 und RK3576. Bei einer Plattform mit einkerniger NPU wird ein Fehlercode zurückgegeben.

<!-- source: EN PDF p20,21; unit 125,126 -->

| API | rknn_set_core_mask |
| --- | --- |
| Beschreibung | Legt die NPU-Kerne fest. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | rknn_core_mask core_mask: Auswahl der NPU-Kerne. RKNN_NPU_CORE_AUTO — automatische Auswahl eines freien Kerns; RKNN_NPU_CORE_0 — NPU0; RKNN_NPU_CORE_1 — NPU1; RKNN_NPU_CORE_2 — NPU2; RKNN_NPU_CORE_0_1 — NPU0 und NPU1 gleichzeitig; RKNN_NPU_CORE_0_1_2 — NPU0, NPU1 und NPU2 gleichzeitig; RKNN_NPU_CORE_ALL — alle NPU-Kerne der Plattform. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p21; unit 127 -->

```c
rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

<!-- source: EN PDF p21; unit 128 -->

In den Mehrkernmodi RKNN_NPU_CORE_0_1 und RKNN_NPU_CORE_0_1_2 profitieren Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu, Prelu und LeakyRelu von besserer Beschleunigung. Andere Operatoren laufen weiter auf Core0. Die Quelle kündigt Pool und ConvTranpose für spätere Updates an; dies ist keine Bestätigung ihrer aktuellen Implementierung.

<!-- source: EN PDF p21; unit 129 -->

#### rknn_set_batch_core_num

<!-- source: EN PDF p21; unit 130 -->

rknn_set_batch_core_num legt die Anzahl der NPU-Kerne für ein Multi-Batch-RKNN-Modell fest, das in RKNN-Toolkit2 mit rknn_batch_size größer als 1 exportiert wurde. Unterstützt werden nur RK3588 und RK3576.

<!-- source: EN PDF p21; unit 131 -->

| API | rknn_set_batch_core_num |
| --- | --- |
| Beschreibung | Legt die NPU-Kernanzahl für ein Multi-Batch-RKNN-Modell fest. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | int core_num: Anzahl der auszuführenden Kerne. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p21; unit 132 -->

Beispielcode:

<!-- source: EN PDF p21; unit 133 -->

```c
rknn_context ctx;
int ret = rknn_set_batch_core_num(ctx, 2);
```

<!-- source: EN PDF p21; unit 134 -->

#### rknn_dup_context

<!-- source: EN PDF p21; unit 135 -->

rknn_dup_context erstellt einen neuen Kontext für dasselbe Modell. Dies ermöglicht die Wiederverwendung der Modellgewichte bei Ausführung desselben Modells in mehreren Threads. Auf RV1106/RV1103/RV1106B/RV1103B/RK2118 nicht verfügbar.

<!-- source: EN PDF p22; unit 136 -->

| API | rknn_dup_context |
| --- | --- |
| Beschreibung | Erstellt einen neuen Kontext desselben Modells zur Wiederverwendung der Gewichte. |
| Parameter | rknn_context *context_in: Zeiger auf ein rknn_context-Objekt. Laut Quelle wird der Eingabekontext nach dem Aufruf initialisiert. |
|  | rknn_context *context_out: Zeiger auf ein rknn_context-Ausgabeobjekt mit den zurückgegebenen Informationen über das neu erstellte Objekt. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p22; unit 137 -->

Beispielcode:

<!-- source: EN PDF p22; unit 138 -->

```c
rknn_context ctx_in;
rknn_context ctx_out;
int ret = rknn_dup_context(&ctx_in, &ctx_out);
```

<!-- source: EN PDF p22; unit 139 -->

#### rknn_destroy

<!-- source: EN PDF p22; unit 140 -->

Diese Funktion gibt rknn_context und zugehörige Ressourcen frei.

<!-- source: EN PDF p22; unit 141 -->

| API | rknn_destroy |
| --- | --- |
| Beschreibung | Zerstört rknn_context und zugehörige Ressourcen. |
| Parameter | rknn_context context: zu zerstörendes rknn_context-Objekt. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p22; unit 142 -->

Beispielcode:

<!-- source: EN PDF p22; unit 143 -->

```c
rknn_context ctx;
int ret = rknn_destroy(ctx);
```

<!-- source: EN PDF p23; unit 144 -->

#### rknn_query

<!-- source: EN PDF p23; unit 145 -->

rknn_query fragt Modell- und SDK-Informationen ab: Ein- und Ausgaben, schichtweise Laufzeiten, gesamte Inferenzzeit, SDK-Version, Speicherverbrauch, benutzerdefinierte Zeichenfolgen und weitere Informationen.

<!-- source: EN PDF p23; unit 146 -->

| API | rknn_query |
| --- | --- |
| Beschreibung | Fragt Modell- und SDK-Informationen ab. |
| Parameter | rknn_context context: rknn_contex-Objekt (Quellschreibweise). |
|  | rknn_query_cmd: Abfragebefehl. |
|  | void* info: Strukturobjekt für das Abfrageergebnis. |
|  | uint32_t size: Größe des info-Strukturobjekts. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p23; unit 147 -->

Im beschriebenen Stand unterstützt das SDK folgende Abfragebefehle:

<!-- source: EN PDF p23,24; unit 148,149 -->

| Abfragebefehl | Ergebnisstruktur | Funktion |
| --- | --- | --- |
| RKNN_QUERY_IN_OUT_NUM | rknn_input_output_num | Anzahl der Ein- und Ausgabetensoren. |
| RKNN_QUERY_INPUT_ATTR | rknn_tensor_attr | Eingabetensorattribute. |
| RKNN_QUERY_OUTPUT_ATTR | rknn_tensor_attr | Ausgabetensorattribute. |
| RKNN_QUERY_PERF_DETAIL | rknn_perf_detail | Laufzeit jeder Netzwerkschicht; nur mit über rknn_init gesetztem RKNN_FLAG_COLLECT_PERF_MASK. |
| RKNN_QUERY_PERF_RUN | rknn_perf_run | Gesamte Inferenzzeit in Mikrosekunden ohne das Setzen von Ein- und Ausgaben. |
| RKNN_QUERY_SDK_VERSION | rknn_sdk_version | SDK-Version. |
| RKNN_QUERY_MEM_SIZE | rknn_mem_size | Speichergröße der Gewichte und internen Netzwerktensoren. |
| RKNN_QUERY_CUSTOM_STRING | rknn_custom_string | Benutzerdefinierte Zeichenfolgen im RKNN-Modell. |
| RKNN_QUERY_NATIVE_INPUT_ATTR | rknn_tensor_attr | In der Zero-Copy-API: native Attribute der direkt von der NPU gelesenen Eingabe. |
| RKNN_QUERY_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | In der Zero-Copy-API: native Attribute der direkt von der NPU stammenden Ausgabe. |
| RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | rknn_tensor_attr | In der Zero-Copy-API: native Attribute der direkt von der NPU gelesenen Eingabe; gleichbedeutend mit RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | rknn_tensor_attr | In der Zero-Copy-API: native Ausgabeattribute; die Quelle bezeichnet sie anschließend als von der NPU gelesene Eingabeattribute. Gleichbedeutend mit RKNN_QUERY_NATIVE_OUTPUT_ATTR. Der Ein-/Ausgabewiderspruch bleibt erhalten. |
| RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | rknn_tensor_attr | In der Zero-Copy-API: native Attribute der direkt von der NPU gelesenen Eingabe. Die Quelle setzt den Befehl mit RKNN_QUERY_NATIVE_INPUT_ATTR gleich. |
| RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | rknn_tensor_attr | In der Zero-Copy-API: native NHWC-Ausgabetensorattribute; die Quelle bezeichnet sie anschließend als direkt von der NPU gelesene Eingabeattribute. |
| RKNN_QUERY_DEVICE_MEM_INFO | rknn_tensor_mem | Speichereigenschaften des Modellpuffers. |
| RKNN_QUERY_INPUT_DYNAMIC_RANGE | rknn_input_range | Bei dynamischen Formen: Anzahl und Liste unterstützter Eingabeformen, zugehöriges Datenlayout und Namen. |
| RKNN_QUERY_CURRENT_INPUT_ATTR | rknn_tensor_attr | Bei dynamischen Formen: Eingabeattribute der aktuellen Inferenz. |
| RKNN_QUERY_CURRENT_OUTPUT_ATTR | rknn_tensor_attr | Bei dynamischen Formen: Ausgabeattribute der aktuellen Inferenz. |
| RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | rknn_tensor_attr | Bei dynamischen Formen: native NPU-Eingabeattribute der aktuellen Inferenz. |
| RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | Bei dynamischen Formen: native NPU-Ausgabeattribute der aktuellen Inferenz. |

<!-- source: EN PDF p24; unit 150 -->

Nachfolgend wird jeder Abfragebefehl erläutert.

<!-- source: EN PDF p24; unit 151 -->

##### 1. SDK-Version abfragen

<!-- source: EN PDF p24; unit 152 -->

RKNN_QUERY_SDK_VERSION fragt die Version des RKNN SDK ab. Zunächst ist ein Objekt der Struktur rknn_sdk_version zu erstellen.

<!-- source: EN PDF p24; unit 153 -->

Beispielcode:

<!-- source: EN PDF p24; unit 154 -->

```c
rknn_sdk_version version;
ret = rknn_query(ctx, RKNN_QUERY_SDK_VERSION, &version,
         sizeof(rknn_sdk_version));
printf("sdk api version: %s\n", version.api_version);
printf("driver version: %s\n", version.drv_version);
```

<!-- source: EN PDF p24; unit 155 -->

##### 2. Anzahl der Ein- und Ausgabetensoren abfragen

<!-- source: EN PDF p24; unit 156 -->

RKNN_QUERY_IN_OUT_NUM fragt die Anzahl der Ein- und Ausgabetensoren des Modells ab. Zunächst ein Objekt der Struktur rknn_input_output_num erstellen.

<!-- source: EN PDF p24; unit 157 -->

Beispielcode:

<!-- source: EN PDF p24; unit 158 -->

```c
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num, sizeof(io_num));
printf("model input num: %d, output num: %d\n", io_num.n_input, io_num.n_output);
```

<!-- source: EN PDF p24; unit 159 -->

##### 3. Eingabetensorattribute abfragen (allgemeine API)

<!-- source: EN PDF p25; unit 160 -->

RKNN_QUERY_INPUT_ATTR fragt die Attribute des Modelleingabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source: EN PDF p25; unit 161 -->

Hinweis: Auf RV1106/RV1103/RV1106B/RV1103B/RK2118 wird der ursprüngliche Eingabetensor im nativen Format abgefragt.

<!-- source: EN PDF p25; unit 162 -->

Beispielcode:

<!-- source: EN PDF p25; unit 163 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p25; unit 164 -->

##### 4. Ausgabetensorattribute abfragen (allgemeine API)

<!-- source: EN PDF p25; unit 165 -->

RKNN_QUERY_OUTPUT_ATTR fragt die Attribute des Modellausgabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source: EN PDF p25; unit 166 -->

Beispielcode:

<!-- source: EN PDF p25; unit 167 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR, &(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p25; unit 168 -->

##### 5. Schichtweise Inferenzzeit des Modells abfragen

<!-- source: EN PDF p25; unit 169 -->

Nach rknn_run fragt RKNN_QUERY_PERF_DETAIL die schichtweise Inferenzzeit in Mikrosekunden ab. Voraussetzung ist RKNN_FLAG_COLLECT_PERF_MASK im Parameter flag von rknn_init.

<!-- source: EN PDF p25; unit 170 -->

Beispielcode:

<!-- source: EN PDF p25; unit 171 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_COLLECT_PERF_MASK, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_detail perf_detail;
ret = rknn_query(ctx, RKNN_QUERY_PERF_DETAIL, &perf_detail, sizeof(perf_detail));
```

<!-- source: EN PDF p25; unit 172 -->

##### 6. Gesamte Inferenzzeit des Modells abfragen

<!-- source: EN PDF p25; unit 173 -->

Nach rknn_run fragt RKNN_QUERY_PERF_RUN die Modellinferenzzeit in Mikrosekunden ohne das Setzen der Ein- und Ausgaben ab.

<!-- source: EN PDF p25; unit 174 -->

Beispielcode:

<!-- source: EN PDF p25; unit 175 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_run perf_run;
ret = rknn_query(ctx, RKNN_QUERY_PERF_RUN, &perf_run, sizeof(perf_run));
```

<!-- source: EN PDF p26; unit 176 -->

##### 7. Speicherzuweisung des Modells abfragen

<!-- source: EN PDF p26; unit 177 -->

Nach rknn_init kann RKNN_QUERY_MEM_SIZE bei eigener Speicherzuweisung durch den Benutzer den Gewichtsspeicher und internen Netzwerkspeicher ohne Ein- und Ausgaben abfragen. Dazu muss der Parameter flag von rknn_init RKNN_FLAG_MEM_ALLOC_OUTSIDE enthalten.

<!-- source: EN PDF p26; unit 178 -->

Beispielcode:

<!-- source: EN PDF p26; unit 179 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_MEM_ALLOC_OUTSIDE , NULL);
rknn_mem_size mem_size;
ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size, sizeof(mem_size));
```

<!-- source: EN PDF p26; unit 180 -->

##### 8. Benutzerdefinierte Modellzeichenfolge abfragen

<!-- source: EN PDF p26; unit 181 -->

Nach rknn_init ruft RKNN_QUERY_CUSTOM_STRING eine bei der RKNN-Modellerzeugung hinzugefügte benutzerdefinierte Zeichenfolge ab. Beispielsweise kann “RGB” bei der Konvertierung kennzeichnen, dass die Eingabe ein dreikanaliges RGB- statt BGR-Bild ist. Zur Laufzeit werden die Daten anhand der abgefragten Information “RGB” in ein RGB-Bild konvertiert.

<!-- source: EN PDF p26; unit 182 -->

Beispielcode:

<!-- source: EN PDF p26; unit 183 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
rknn_custom_string custom_string;
ret = rknn_query(ctx, RKNN_QUERY_CUSTOM_STRING, &custom_string, sizeof(custom_string));
```

<!-- source: EN PDF p26; unit 184 -->

##### 9. Native Eingabetensorattribute abfragen (Zero-Copy-API)

<!-- source: EN PDF p26; unit 185 -->

RKNN_QUERY_NATIVE_INPUT_ATTR, gleichbedeutend mit RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR, fragt native Attribute des Modelleingabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source: EN PDF p26; unit 186 -->

Beispielcode:

<!-- source: EN PDF p26; unit 187 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p26; unit 188 -->

##### 10. Native Ausgabetensorattribute abfragen (Zero-Copy-API)

<!-- source: EN PDF p26; unit 189 -->

RKNN_QUERY_NATIVE_OUTPUT_ATTR, gleichbedeutend mit RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR, fragt native Attribute des Modellausgabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source: EN PDF p26; unit 190 -->

Beispielcode:

<!-- source: EN PDF p27; unit 191 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p27; unit 192 -->

##### 11. Native Ausgabetensorattribute abfragen (Quellüberschrift; der folgende Text betrifft die Eingabe, Zero-Copy-API)

<!-- source: EN PDF p27; unit 193 -->

RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR fragt NHWC-Attribute des Modelleingabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source: EN PDF p27; unit 194 -->

Beispielcode:

<!-- source: EN PDF p27; unit 195 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR,
&(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p27; unit 196 -->

##### 12. Native Ausgabetensorattribute abfragen (Zero-Copy-API)

<!-- source: EN PDF p27; unit 197 -->

RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR fragt NHWC-Attribute des Modellausgabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source: EN PDF p27; unit 198 -->

Beispielcode:

<!-- source: EN PDF p27; unit 199 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p27; unit 200 -->

##### 13. Vom RKNN-Modell unterstützte dynamische Eingabeformen abfragen

<!-- source: EN PDF p27; unit 201 -->

Hinweis: RV1106/RV1103/RV1106B/RV1103B/RK2118 unterstützen diese Schnittstelle nicht.

<!-- source: EN PDF p27; unit 202 -->

Nach rknn_init mit RKNN_QUERY_INPUT_DYNAMIC_RANGE die unterstützten Eingabeformen abfragen, einschließlich Anzahl, Liste, Layout, Namen und weiterer Angaben. Zunächst ein Objekt der Struktur rknn_input_range erstellen.

<!-- source: EN PDF p27; unit 203 -->

Beispielcode:

<!-- source: EN PDF p27; unit 204 -->

```c
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input * sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++) {
  dyn_range[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE, &dyn_range[i],
sizeof(rknn_input_range));
}
```

<!-- source: EN PDF p28; unit 205 -->

##### 14. Speicherinformationen des Modellpuffers abfragen (Hinweis für RV1106/RV1103/RV1106B/RV1103B/RK2118)

<!-- source: EN PDF p28; unit 206 -->

Die Quelle erklärt diese Plattformen als nicht unterstützt; dies ist mit der Hardware-Unterstützungstabelle abzugleichen.

<!-- source: EN PDF p28; unit 207 -->

Nach rknn_init fragt RKNN_QUERY_DEVICE_MEM_INFO Attribute des intern in der Runtime erstellten Modellpuffers ab, einschließlich fd und physischer Adresse.

<!-- source: EN PDF p28; unit 208 -->

```c
rknn_tensor_mem mem_info;
memset(&mem_info, 0, sizeof(mem_info));
ret = rknn_query(ctx, RKNN_QUERY_DEVICE_MEM_INFO, &mem_info, sizeof(mem_info));
```

<!-- source: EN PDF p28; unit 209 -->

##### 15. Aktuell verwendete dynamische Eingabeform des RKNN-Modells abfragen

<!-- source: EN PDF p28; unit 210 -->

Nach rknn_set_input_shapes mit RKNN_QUERY_CURRENT_INPUT_ATTR die aktuell verwendeten Modelleingabeattribute abfragen. Zunächst die Struktur rknn_tensor_attr erstellen.

<!-- source: EN PDF p28; unit 211 -->

Hinweis: RV1106/RV1103/RV1103B/RV1106B/RK2118 unterstützen diesen Befehl nicht.

<!-- source: EN PDF p28; unit 212 -->

Beispielcode:

<!-- source: EN PDF p28; unit 213 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
  cur_input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR, &(cur_input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p28; unit 214 -->

##### 16. Aktuell verwendete dynamische Ausgabeform des RKNN-Modells abfragen

<!-- source: EN PDF p28; unit 215 -->

Nach rknn_set_input_shapes mit RKNN_QUERY_CURRENT_OUTPUT_ATTR die aktuell verwendeten Modellausgabeattribute abfragen. Zunächst die Struktur rknn_tensor_attr erstellen.

<!-- source: EN PDF p28; unit 216 -->

Hinweis: RV1106/RV1103/RV1103B/RV1106B/RK2118 unterstützen diesen Befehl nicht.

<!-- source: EN PDF p28; unit 217 -->

Beispielcode:

<!-- source: EN PDF p28; unit 218 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
  cur_output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p28; unit 219 -->

##### 17. Aktuell verwendete native dynamische Eingabeform des RKNN-Modells abfragen

<!-- source: EN PDF p28; unit 220 -->

Nach rknn_set_input_shapes mit RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR die aktuell verwendeten nativen Modelleingabeattribute abfragen. Zunächst die Struktur rknn_tensor_attr erstellen.

<!-- source: EN PDF p28; unit 221 -->

Hinweis: RV1106/RV1103/RV1103B/RV1106B/RK2118 unterstützen diesen Befehl nicht.

<!-- source: EN PDF p28; unit 222 -->

Beispielcode:

<!-- source: EN PDF p29; unit 223 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
  cur_input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p29; unit 224 -->

##### 18. Aktuell verwendete native dynamische Ausgabeform des RKNN-Modells abfragen

<!-- source: EN PDF p29; unit 225 -->

Nach rknn_set_input_shapes nennt die Quelle RKNN_QUERY_CURRENT_OUTPUT_ATTR für die aktuellen nativen Ausgabeattribute. Zunächst rknn_tensor_attr erstellen. Der Befehlsname bleibt quellengetreu; seine Zuordnung zur nativen Ausgabe ist zu prüfen.

<!-- source: EN PDF p29; unit 226 -->

Hinweis: RV1106/RV1103/RV1103B/RV1106B/RK2118 unterstützen diesen Befehl nicht.

<!-- source: EN PDF p29; unit 227 -->

Beispielcode:

<!-- source: EN PDF p29; unit 228 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
  cur_output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p30; unit 229 -->

#### rknn_inputs_set

<!-- source: EN PDF p30; unit 230 -->

rknn_inputs_set setzt die Modelleingabedaten. Mehrere Eingaben werden unterstützt, jeweils als rknn_input-Objekt. Deren Felder sind vor Übergabe an rknn_inputs_set zu setzen. Auf RV1106/RV1103/RV1103B/RV1106B/RK2118 nicht verfügbar.

<!-- source: EN PDF p30; unit 231 -->

| API | rknn_inputs_set |
| --- | --- |
| Beschreibung | Setzt die Modelleingabedaten. |
| Parameter | rknn_context context: rknn_contex-Objekt (Quellschreibweise). |
|  | uint32_t n_inputs: Anzahl der Eingaben. |
|  | rknn_input inputs[]: Array von rknn_input. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p30; unit 232 -->

Beispielcode:

<!-- source: EN PDF p30; unit 233 -->

```c
rknn_input inputs[1];
memset(inputs, 0, sizeof(inputs));
inputs[0].index = 0;
inputs[0].type = RKNN_TENSOR_UINT8;
inputs[0].size = img_width*img_height*img_channels;
inputs[0].fmt = RKNN_TENSOR_NHWC;
inputs[0].buf = in_data;
inputs[0].pass_through = 0;

ret = rknn_inputs_set(ctx, 1, inputs);
```

<!-- source: EN PDF p30; unit 234 -->

#### rknn_run

<!-- source: EN PDF p30; unit 235 -->

rknn_run führt eine Modellinferenz aus. Zuvor müssen die Eingabedaten über rknn_inputs_set oder die Zero-Copy-Schnittstelle konfiguriert werden.

<!-- source: EN PDF p30; unit 236 -->

| API | rknn_run |
| --- | --- |
| Beschreibung | Führt eine Modellinferenz aus. |
| Parameter | rknn_context context: rknn_contex-Objekt (Quellschreibweise). |
|  | rknn_run_extend* extend: für Erweiterungen reserviert; im beschriebenen Stand ungenutzt, nur NULL zulässig. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p30; unit 237 -->

Beispielcode:

<!-- source: EN PDF p30; unit 238 -->

```c
ret = rknn_run(ctx, NULL);
```

<!-- source: EN PDF p31; unit 239 -->

#### rknn_outputs_get

<!-- source: EN PDF p31; unit 240 -->

rknn_outputs_get ruft Modellausgabedaten ab. Mehrere Ausgaben werden unterstützt, jeweils als vor dem Aufruf zu erstellendes und zu initialisierendes rknn_output-Objekt. RV1106/RV1103/RV1106B/RV1103B/RK2118 werden nicht unterstützt.

<!-- source: EN PDF p31; unit 241 -->

Es gibt zwei Möglichkeiten, Puffer für Ausgabedaten bereitzustellen:

<!-- source: EN PDF p31; unit 242 -->

1\. Der Benutzer weist die Puffer selbst zu und gibt sie frei. Dann ist rknn_output.is_prealloc auf 1 zu setzen; rknn_output.buf zeigt auf den Benutzerpuffer.

<!-- source: EN PDF p31; unit 243 -->

2\. rknn weist den Speicher zu. Dann ist rknn_output.is_prealloc auf 0 zu setzen. Nach Ausführung wird rknn_output.buf mit den Ausgabedaten erstellt.

<!-- source: EN PDF p31; unit 244 -->

| API | rknn_outputs_get |
| --- | --- |
| Beschreibung | Ruft die Inferenz-Ausgabedaten ab. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | uint32_t n_outputs: Anzahl der Ausgaben. |
|  | rknn_output outputs[]: Array von rknn_output. |
|  | rknn_run_extend* extend: für Erweiterungen reserviert; derzeit ungenutzt, nur NULL zulässig. Typ quellengetreu beibehalten. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p31; unit 245 -->

Beispielcode:

<!-- source: EN PDF p31; unit 246 -->

```c
rknn_output outputs[io_num.n_output];
memset(outputs, 0, sizeof(outputs));
for (int i = 0; i < io_num.n_output; i++) {
  outputs[i].index = i;
  outputs[i].is_prealloc = 0;
  outputs[i].want_float = 1;
}
ret = rknn_outputs_get(ctx, io_num.n_output, outputs, NULL);
```

<!-- source: EN PDF p31; unit 247 -->

#### rknn_outputs_release

<!-- source: EN PDF p31; unit 248 -->

rknn_outputs_release gibt die Ressourcen des rknn_output-Objekts frei.

<!-- source: EN PDF p31; unit 249 -->

| API | rknn_outputs_release |
| --- | --- |
| Beschreibung | Gibt das rknn_output-Objekt frei. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | uint32_t n_outputs: Anzahl der Ausgaben. |
|  | rknn_output outputs[]: Array der freizugebenden rknn_output. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p31; unit 250 -->

Beispielcode:

<!-- source: EN PDF p32; unit 251 -->

```c
ret = rknn_outputs_release(ctx, io_num.n_output, outputs);
```

<!-- source: EN PDF p32; unit 252 -->

#### rknn_create_mem_from_phys

<!-- source: EN PDF p32; unit 253 -->

Zur Bereitstellung von NPU-Speicher erstellt rknn_create_mem_from_phys eine rknn_tensor_mem-Struktur und gibt deren Zeiger zurück. Physische und virtuelle Adresse, Größe und Informationen zum externen Speicher werden in die Struktur übernommen.

<!-- source: EN PDF p32; unit 254 -->

| API | rknn_create_mem_from_phys |
| --- | --- |
| Beschreibung | Erstellt rknn_tensor_mem und stellt Speicher über eine physische Adresse bereit. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | uint64_t phys_addr: physische Pufferadresse. |
|  | void *virt_addr: virtuelle Pufferadresse, Anfangsadresse des zu fd gehörenden Speichers. |
|  | uint32_t size: Puffergröße. |
| Rückgabe | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |

<!-- source: EN PDF p32; unit 255 -->

Beispielcode:

<!-- source: EN PDF p32; unit 256 -->

```c
//suppose we have got buffer information as input_phys, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_phys(ctx, input_phys, input_virt, size);
```

<!-- source: EN PDF p33; unit 257 -->

#### rknn_create_mem_from_fd

<!-- source: EN PDF p33; unit 258 -->

Zur Bereitstellung von NPU-Speicher erstellt rknn_create_mem_from_fd eine rknn_tensor_mem-Struktur und gibt deren Zeiger zurück. Dateideskriptor, logische Adresse, Größe und Informationen zum externen Speicher werden in die Struktur übernommen.

<!-- source: EN PDF p33; unit 259 -->

| API | rknn_create_mem_from_fd |
| --- | --- |
| Beschreibung / Parameter | Erstellt rknn_tensor_mem und stellt Speicher über einen Dateideskriptor bereit. |
|  | rknn_context context: rknn_context-Objekt. |
|  | int32_t fd: Dateideskriptor des Puffers. |
|  | void *virt_addr: virtuelle Pufferadresse am Beginn von fd. |
|  | uint32_t size: Puffergröße. |
|  | int32_t offset: zum Dateideskriptor und zur virtuellen Adresse gehörender Offset. |
| Rückgabe | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |

<!-- source: EN PDF p33; unit 260 -->

Beispielcode:

<!-- source: EN PDF p33; unit 261 -->

```c
//suppose we have got buffer information as input_fd, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_fd(ctx, input_fd, input_virt, size, 0);
```

<!-- source: EN PDF p33; unit 262 -->

#### rknn_create_mem

<!-- source: EN PDF p33; unit 263 -->

rknn_create_mem weist die vom Benutzer angegebene Größe direkt von der NPU nutzbaren Speichers zu und gibt eine rknn_tensor_mem-Struktur zurück.

<!-- source: EN PDF p33; unit 264 -->

| API | rknn_create_mem |
| --- | --- |
| Beschreibung | Erstellt intern in der Runtime rknn_tensor_mem und weist Speicher zu. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | uint32_t size: Puffergröße. |
| Rückgabe | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |

<!-- source: EN PDF p33; unit 265 -->

Beispielcode:

<!-- source: EN PDF p33; unit 266 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem(ctx, size);
```

<!-- source: EN PDF p34; unit 267 -->

#### rknn_create_mem2

<!-- source: EN PDF p34; unit 268 -->

rknn_create_mem2 weist direkt von der NPU nutzbaren Speicher mit benutzerdefinierter Größe und Art zu und gibt eine rknn_tensor_mem-Struktur zurück.

<!-- source: EN PDF p34; unit 269 -->

| API | rknn_create_mem2 |
| --- | --- |
| Beschreibung | Erstellt intern in der Runtime rknn_tensor_mem und weist Speicher zu. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | uint64_t size: Puffergröße. |
|  | uint64_t alloc_flags: Cachefähigkeit des zugewiesenen Speichers. RKNN_FLAG_MEMORY_CACHEABLE — cachefähig; RKNN_FLAG_MEMORY_NON_CACHEABLE — nicht cachefähig; RKNN_FLAG_MEMORY_FLAGS_DEFAULT — wie RKNN_FLAG_MEMORY_CACHEABLE. |
| Rückgabe | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |

<!-- source: EN PDF p34; unit 270 -->

Der Hauptunterschied zwischen rknn_create_mem2 und rknn_create_mem ist alloc_flags, mit dem sich die Cachefähigkeit festlegen lässt. rknn_create_mem erlaubt diese Auswahl nicht und weist standardmäßig cachefähigen Speicher zu.

<!-- source: EN PDF p34; unit 271 -->

Beispielcode:

<!-- source: EN PDF p34; unit 272 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem2(ctx, size, RKNN_FLAG_MEMORY_NON_CACHEABLE);
```

<!-- source: EN PDF p34; unit 273 -->

#### rknn_destroy_mem

<!-- source: EN PDF p34; unit 274 -->

rknn_destroy_mem zerstört die rknn_tensor_mem-Struktur. Vom Benutzer zugewiesener Speicher muss jedoch manuell freigegeben werden.

<!-- source: EN PDF p34; unit 275 -->

| API | rknn_destroy_mem |
| --- | --- |
| Beschreibung | Zerstört die rknn_tensor_mem-Struktur. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p34; unit 276 -->

Beispielcode:

<!-- source: EN PDF p34; unit 277 -->

```c
rknn_tensor_mem* input_mems [1];
int ret = rknn_destroy_mem(ctx, input_mems[0]);
```

<!-- source: EN PDF p35; unit 278 -->

#### rknn_set_weight_mem

<!-- source: EN PDF p35; unit 279 -->

Hat der Benutzer Speicher für die Netzwerkgewichte zugewiesen, kann die NPU ihn nach Initialisierung der zugehörigen rknn_tensor_mem über rknn_set_weight_mem nutzen. Der Aufruf muss vor rknn_run erfolgen.

<!-- source: EN PDF p35; unit 280 -->

| API | rknn_set_weight_mem |
| --- | --- |
| Beschreibung | Setzt rknn_tensor_mem mit Informationen zum Gewichtsspeicher. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p35; unit 281 -->

Beispielcode:

<!-- source: EN PDF p35; unit 282 -->

```c
rknn_tensor_mem* weight_mems [1];
int ret = rknn_set_weight_mem(ctx, weight_mems[0]);
```

<!-- source: EN PDF p35; unit 283 -->

#### rknn_set_internal_mem

<!-- source: EN PDF p35; unit 284 -->

Hat der Benutzer Speicher für interne Netzwerktensoren zugewiesen, kann die NPU ihn nach Initialisierung der zugehörigen rknn_tensor_mem über rknn_set_internal_mem nutzen. Der Aufruf muss vor rknn_run erfolgen.

<!-- source: EN PDF p35; unit 285 -->

| API | rknn_set_internal_mem |
| --- | --- |
| Beschreibung | Setzt rknn_tensor_mem mit Informationen zum Speicher interner Netzwerktensoren. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p35; unit 286 -->

Beispielcode:

<!-- source: EN PDF p35; unit 287 -->

```c
rknn_tensor_mem* internal_tensor_mems [1];
int ret = rknn_set_internal_mem(ctx, internal_tensor_mems[0]);
```

<!-- source: EN PDF p35; unit 288 -->

#### rknn_set_io_mem

<!-- source: EN PDF p35; unit 289 -->

Hat der Benutzer Speicher für Ein-/Ausgabetensoren zugewiesen, kann die NPU ihn nach Initialisierung der zugehörigen rknn_tensor_mem über rknn_set_io_mem nutzen. Der Aufruf muss vor rknn_run erfolgen.

<!-- source: EN PDF p35,36; unit 290,291 -->

| API | rknn_set_io_mem |
| --- | --- |
| Beschreibung | Setzt rknn_tensor_mem mit Informationen zum Speicher der Ein-/Ausgabetensoren des Netzwerks. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |
|  | rknn_tensor_attr *: Attribute des Ein- oder Ausgabetensorpuffers. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p36; unit 292 -->

Beispielcode:

<!-- source: EN PDF p36; unit 293 -->

```c
rknn_tensor_attr output_attrs[1];
rknn_tensor_mem* output_mems[1];
ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR, &(output_attrs[0]), sizeof(rknn_tensor_attr));
output_mems[0] = rknn_create_mem(ctx, output_attrs[0].size_with_stride);
rknn_set_io_mem(ctx, output_mems[0], &output_attrs[0]);
```

<!-- source: EN PDF p36; unit 294 -->

#### rknn_set_input_shape (veraltet)

<!-- source: EN PDF p36; unit 295 -->

Diese Schnittstelle ist veraltet. Eingabeformen sind mit rknn_set_input_shapes zu binden. In der aktuellen Version ist die alte Schnittstelle nicht verfügbar. Für ihre weitere Nutzung sind SDK 1.5.0 und dessen Anleitung erforderlich.

<!-- source: EN PDF p37; unit 296 -->

#### rknn_set_input_shapes

<!-- source: EN PDF p37; unit 297 -->

Bei RKNN-Modellen mit dynamischen Eingabeformen muss vor der Inferenz die aktuelle Form festgelegt werden. Übergeben werden die Eingabeanzahl und ein rknn_tensor_attr-Array mit Form und Datenlayout jeder Eingabe. In jedem rknn_tensor_attr sind index, name, dims und fmt auszufüllen; andere Felder müssen nicht gesetzt werden. Zuvor lassen sich Anzahl und Liste unterstützter dynamischer Formen über rknn_query abfragen. Die Eingabeform muss in dieser Liste enthalten sein. Die Schnittstelle ist beim ersten Lauf und bei jedem Formwechsel aufzurufen, sonst nicht erneut.

<!-- source: EN PDF p37; unit 298 -->

| API | rknn_set_input_shapes |
| --- | --- |
| Beschreibung | Setzt die aktuell verwendete Modelleingabeform. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | uint32_t n_inputs: Anzahl der Eingabetensoren. |
|  | rknn_tensor_attr *: Zeiger auf das Attributarray sämtlicher Eingabeformen. Für jede Eingabe sind index, name, dims, fmt und n_dims zu setzen; weitere Felder sind nicht erforderlich. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p37; unit 299 -->

Beispielcode:

<!-- source: EN PDF p37; unit 300 -->

```c
for (int i = 0; i < io_num.n_input; i++) {
  for (int j = 0; j < input_attrs[i].n_dims; ++j) {
    input_attrs[i].dims[j] = dyn_range[i].dyn_range[0][j];
  }
}
ret = rknn_set_input_shapes(ctx, io_num.n_input, input_attrs);
if (ret < 0) {
  fprintf(stderr, "rknn_set_input_shapes error! ret=%d\n", ret);
  return -1;
}
```

<!-- source: EN PDF p38; unit 301 -->

#### rknn_mem_sync

<!-- source: EN PDF p38; unit 302 -->

Von rknn_create_mem erzeugter Speicher ist standardmäßig cachefähig. Bei gleichzeitiger Nutzung durch CPU und NPU kann das Cacheverhalten zu inkonsistenten Daten führen. Diese Schnittstelle synchronisiert cachefähigen Speicher, damit CPU und NPU konsistente Daten sehen.

<!-- source: EN PDF p38; unit 303 -->

| API | rknn_mem_sync |
| --- | --- |
| Beschreibung | Synchronisiert CPU-Cache- und DDR-Daten. |
| Parameter | rknn_context context: rknn_context-Objekt. |
|  | rknn_tensor_mem* mem: Zeiger auf die Tensorspeicher-Informationsstruktur. |
|  | rknn_mem_sync_mode mode: Aktualisierungsmodus für CPU-Cache und DDR. RKNN_MEMORY_SYNC_TO_DEVICE — schreibt CPU-Cache-Daten in DDR zurück, üblicherweise nach CPU-Schreiben und vor NPU-Zugriff auf denselben Speicher. RKNN_MEMORY_SYNC_FROM_DEVICE — synchronisiert DDR mit dem CPU-Cache, üblicherweise nach NPU-Schreiben: invalidiert den Cache, damit die CPU beim nächsten Zugriff DDR neu liest. RKNN_MEMORY_SYNC_BIDIRECTIONAL — schreibt CPU-Cache-Daten in DDR zurück und lässt die CPU DDR neu lesen. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p38; unit 304 -->

Beispielcode:

<!-- source: EN PDF p38; unit 305 -->

```c
ret =rknn_mem_sync(ctx, &outputs[0].mem,
RKNN_MEMORY_SYNC_FROM_DEVICE);
if (ret < 0) {
  fprintf(stderr, " rknn_mem_sync error! ret=%d\n", ret);
  return -1;
}
```

<!-- source: EN PDF p39; unit 306 -->

### 4.4 Datenstrukturen der Matrixmultiplikation

<!-- source: EN PDF p39; unit 307 -->

#### rknn_matmul_info

<!-- source: EN PDF p39; unit 308 -->

rknn_matmul_info beschreibt die Spezifikation der Matrixmultiplikation: Dimensionen, Datentyp und Speicherlayout der Ein- und Ausgabematrizen. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p39,40; unit 309,310 -->

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

<!-- source: EN PDF p41; unit 311 -->

#### rknn_matmul_tensor_attr

<!-- source: EN PDF p41; unit 312 -->

rknn_matmul_tensor_attr beschreibt die Tensorattribute jeder Matrix: Name, Form, Größe und Datentyp. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p41; unit 313 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| name | char[] | Matrixname. |
| n_dims | uint32_t | Anzahl der Matrixdimensionen. |
| dims | uint32_t[] | Matrixform. |
| size | uint32_t | Matrixgröße. |
| type | rknn_tensor_type | Matrixdatentyp. |

<!-- source: EN PDF p41; unit 314 -->

#### rknn_matmul_io_attr

<!-- source: EN PDF p41; unit 315 -->

rknn_matmul_io_attr beschreibt alle Ein- und Ausgabetensoren der Matrixoperation, einschließlich der Attribute von A, B und C. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p41; unit 316 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| A | rknn_matmul_tensor_attr | Tensorattribute der Matrix A. |
| B | rknn_matmul_tensor_attr | Tensorattribute der Matrix B. |
| C | rknn_matmul_tensor_attr | Tensorattribute der Matrix C. |

<!-- source: EN PDF p41; unit 317 -->

#### rknn_quant_params

<!-- source: EN PDF p41; unit 318 -->

rknn_quant_params beschreibt die Quantisierungsparameter einer Matrix: Name sowie Zeiger und Längen der Arrays scale und zero_point. name kennzeichnet die Matrix und lässt sich aus der bei Kontextinitialisierung erhaltenen rknn_matmul_io_attr entnehmen. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p41; unit 319 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| name | char[] | Matrixname. |
| scale | float* | Zeiger auf das scale-Array der Matrix. |
| scale_len | int32_t | Länge des scale-Arrays der Matrix. |
| zp | int32_t* | Zeiger auf das zero_point-Array der Matrix. |
| zp_len | int32_t | Länge des zero_point-Arrays der Matrix. |

<!-- source: EN PDF p41; unit 320 -->

#### rknn_matmul_shape

<!-- source: EN PDF p41; unit 321 -->

rknn_matmul_shape beschreibt M, K und N einer bestimmten Matrixmultiplikationsform. Bei Initialisierung eines Kontexts mit dynamischen Formen sind die Formenanzahl und ein rknn_matmul_shape-Array sämtlicher Eingabeformen anzugeben. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p42; unit 322 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| M | int32_t | Zeilenanzahl von A. |
| K | int32_t | Spaltenanzahl von A. |
| N | int32_t | Spaltenanzahl von C. |

<!-- source: EN PDF p43; unit 323 -->

### 4.5 Matrixmultiplikations-API

<!-- source: EN PDF p43; unit 324 -->

#### rknn_matmul_create

<!-- source: EN PDF p43; unit 325 -->

Die Funktion initialisiert den Matrixmultiplikationskontext anhand der übergebenen Spezifikation und weiterer Informationen. Sie gibt Form, Größe, Datentyp und weitere Attribute der Ein- und Ausgabetensoren zurück. Der Zeiger rknn_matmul_ctx und rknn_context haben hier dieselbe Datenstruktur.

<!-- source: EN PDF p43; unit 326 -->

| API | rknn_matmul_create |
| --- | --- |
| Beschreibung | Initialisiert den Matrixmultiplikationskontext. |
| Parameter | rknn_matmul_ctx* ctx: Zeiger auf den Matrixmultiplikationskontext. |
|  | rknn_matmul_info* info: Zeiger auf die Spezifikationsstruktur der Matrixmultiplikation. |
|  | rknn_matmul_io_attr* io_attr: Zeiger auf die Attributstruktur der Ein-/Ausgabetensoren der Matrixmultiplikation. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p43; unit 327 -->

Beispielcode:

<!-- source: EN PDF p43; unit 328 -->

```c
rknn_matmul_info info;
memset(&info, 0, sizeof(rknn_matmul_info));
info.M = 4;
info.K = 64;
info.N = 32;
info.type = RKNN_INT8_MM_INT8_TO_INT32;
info.B_layout = RKNN_MM_LAYOUT_NORM;
info.AC_layout = RKNN_MM_LAYOUT_NORM;

rknn_matmul_io_attr io_attr;
memset(&io_attr, 0, sizeof(rknn_matmul_io_attr));

int ret = rknn_matmul_create(&ctx, &info, &io_attr);
if (ret < 0) {
  printf("rknn_matmul_create fail! ret=%d\n", ret);
  return -1;
}
```

<!-- source: EN PDF p43; unit 329 -->

#### rknn_matmul_set_io_mem

<!-- source: EN PDF p43; unit 330 -->

Die Funktion setzt den Ein-/Ausgabespeicher der Matrixmultiplikation. Zunächst über rknn_create_mem einen rknn_tensor_mem-Zeiger erstellen, dann gemeinsam mit dem von rknn_matmul_create erhaltenen rknn_matmul_tensor_attr-Zeiger für A, B oder C übergeben. Dadurch wird der Speicher im Operationskontext gebunden. Zuvor müssen die Daten von A und B gemäß dem in rknn_matmul_info konfigurierten Speicherlayout vorbereitet werden.

<!-- source: EN PDF p44; unit 331 -->

| API | rknn_matmul_set_io_mem |
| --- | --- |
| Beschreibung | Setzt den Ein-/Ausgabespeicher für Matrixmultiplikation. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
|  | rknn_tensor_mem* mem: Zeiger auf die Tensorspeicher-Informationsstruktur. |
|  | rknn_matmul_tensor_attr* attr: Zeiger auf die Attributstruktur der Ein-/Ausgabetensoren der Matrixmultiplikation. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p44; unit 332 -->

Beispielcode:

<!-- source: EN PDF p44; unit 333 -->

```c
// Create A
rknn_tensor_mem* A = rknn_create_mem(ctx, io_attr.A.size);
if (A == NULL) {
 printf("rknn_create_mem fail!\n");
 return -1;
}
memset(A->virt_addr, 1, A->size);
rknn_matmul_io_attr io_attr;
memset(&io_attr, 0, sizeof(rknn_matmul_io_attr));

int ret = rknn_matmul_create(&ctx, &info, &io_attr);
if (ret < 0) {
 printf("rknn_matmul_create fail! ret=%d\n", ret);
 return -1;
}
// Set A
ret = rknn_matmul_set_io_mem(ctx, A, &io_attr.A);
if (ret < 0) {
 printf("rknn_matmul_set_io_mem fail! ret=%d\n", ret);
 return -1;
}
```

<!-- source: EN PDF p45; unit 334 -->

#### rknn_matmul_set_core_mask

<!-- source: EN PDF p45; unit 335 -->

Die Funktion legt die verfügbaren NPU-Kerne für Matrixmultiplikation fest; nur RK3588 und RK3576 werden unterstützt. Zuvor den Kontext mit rknn_matmul_create initialisieren. Der Maskenwert wählt die verwendeten Kerne zur Verbesserung von Leistung und Effizienz der Matrixmultiplikation.

<!-- source: EN PDF p45; unit 336 -->

| API | rknn_matmul_set_core_mask |
| --- | --- |
| Beschreibung | Setzt die NPU-Kernmaske für Matrixmultiplikation. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
|  | rknn_core_mask core_mask: Maske verfügbarer NPU-Kerne für Matrixmultiplikation. Jedes Bit bezeichnet einen Kern: 1 bedeutet verfügbar, sonst nicht verfügbar. Details siehe Parameter von rknn_set_core_mask. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p45; unit 337 -->

Beispielcode:

<!-- source: EN PDF p45; unit 338 -->

```c
rknn_matmul_set_core_mask(ctx, RKNN_NPU_CORE_AUTO);
```

<!-- source: EN PDF p45; unit 339 -->

#### rknn_matmul_set_quant_params

<!-- source: EN PDF p45; unit 340 -->

rknn_matmul_set_quant_params setzt die Quantisierungsparameter jeder Matrix für Per-Channel oder Per-Layer. Bei Per-Channel haben scale und zp in rknn_quant_params die Länge N, bei Per-Layer die Länge 1. Die Parameter aller Matrizen sind vor rknn_matmul_run zu setzen. Ohne diesen Aufruf gilt Per-Layer mit scale=1.0 und zero_point=0.

<!-- source: EN PDF p45; unit 341 -->

| API | rknn_matmul_set_quant_params |
| --- | --- |
| Beschreibung | Setzt die Quantisierungsparameter der Matrix. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
|  | rknn_quant_params* params: Quantisierungsparameter der Matrix. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p45; unit 342 -->

Beispielcode:

<!-- source: EN PDF p46; unit 343 -->

```c
rknn_quant_params params_a;
memcpy(params_a.name, io_attr.A.name, RKNN_MAX_NAME_LEN);
params_a.scale_len = 1;
params_a.scale = (float *)malloc(params_a.scale_len * sizeof(float));
params_a.scale[0] = 0.2;
params_a.zp_len = 1;
params_a.zp = (int32_t *)malloc(params_a.zp_len * sizeof(int32_t));
params_a.zp[0] = 0;
rknn_matmul_set_quant_params(ctx, &params_a);
```

<!-- source: EN PDF p46; unit 344 -->

#### rknn_matmul_get_quant_params

<!-- source: EN PDF p46; unit 345 -->

rknn_matmul_get_quant_params wird bei rknn_matmul_type=RKNN_INT8_MM_INT8_TO_INT32 und Per-Channel-Quantisierung verwendet, um die normalisierten scale-Werte aller Kanäle von B zu erhalten. Der erhaltene Wert multipliziert mit dem ursprünglichen scale von A ergibt scale von C. Damit lässt sich scale von C näherungsweise bestimmen, wenn kein tatsächlicher Wert vorliegt.

<!-- source: EN PDF p46; unit 346 -->

| API | rknn_matmul_get_quant_params |
| --- | --- |
| Beschreibung | Ruft die Quantisierungsparameter von Matrix B ab. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
|  | rknn_quant_params* params: Quantisierungsparameter von Matrix B. |
|  | float* scale: Zeiger auf scale von Matrix B. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p46; unit 347 -->

Beispielcode:

<!-- source: EN PDF p46; unit 348 -->

```c
float b_scale;
rknn_matmul_get_quant_params(ctx, &params_b, &b_scale);
```

<!-- source: EN PDF p47; unit 349 -->

#### rknn_matmul_create_dynamic_shape

<!-- source: EN PDF p47; unit 350 -->

rknn_matmul_create_dynamic_shape erstellt einen Matrixmultiplikationskontext mit dynamischen Formen. Übergeben werden rknn_matmul_info, Formenanzahl und ein entsprechendes Array mehrerer M-, K- und N-Werte. Nach erfolgreicher Initialisierung wird ein rknn_matmul_io_attr-Array mit Form, Größe und Datentyp aller Ein- und Ausgabematrizen zurückgegeben. Im beschriebenen Stand lassen sich mehrere unterschiedliche M, K und N festlegen.

<!-- source: EN PDF p47; unit 351 -->

| API | rknn_matmul_create_dynamic_shape |
| --- | --- |
| Beschreibung | Initialisiert den Matrixmultiplikationskontext mit dynamischen Formen. |
| Parameter | rknn_matmul_ctx *ctx: Zeiger auf den Matrixmultiplikationskontext. |
|  | rknn_matmul_info* info: Zeiger auf die Spezifikationsstruktur der Matrixmultiplikation. M, K und N müssen nicht gesetzt werden. |
|  | int shape_num: Anzahl der vom Kontext unterstützten Formen. |
|  | rknn_matmul_shape dynamic_shapes[]: Array der vom Kontext unterstützten Formen. |
|  | rknn_matmul_io_attr io_attrs[]: Array der Attributstrukturen der Ein-/Ausgabetensoren der Matrixmultiplikation. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p47; unit 352 -->

Beispielcode:

<!-- source: EN PDF p47; unit 353 -->

```c
const int shape_num = 2;
rknn_matmul_shape shapes[shape_num];
for (int i = 0; i < shape_num; ++i) {
 shapes[i].M = i+1;
 shapes[i].K = 64;
 shapes[i].N = 32;
}
rknn_matmul_io_attr io_attr[shape_num];
memset(io_attr, 0, sizeof(rknn_matmul_io_attr) * shape_num);

int ret = rknn_matmul_create_dynamic_shape(&ctx, &info, shape_num, shapes, io_attr);
if (ret < 0) {
 fprintf(stderr, " rknn_matmul_create_dynamic_shape fail! ret=%d\n", ret);
 return -1;
}
```

<!-- source: EN PDF p47; unit 354 -->

#### rknn_matmul_create_dyn_shape (veraltet)

<!-- source: EN PDF p47; unit 355 -->

Diese Schnittstelle ist veraltet und durch rknn_matmul_create_dynamic_shape ersetzt.

<!-- source: EN PDF p48; unit 356 -->

#### rknn_matmul_set_dynamic_shape

<!-- source: EN PDF p48; unit 357 -->

rknn_matmul_set_dynamic_shape wählt eine bestimmte Form für die Matrixmultiplikation. Nach Erstellung des Kontexts für dynamische Formen eine der rknn_matmul_shape-Strukturen übergeben, um die Form der Operation festzulegen.

<!-- source: EN PDF p48; unit 358 -->

| API | rknn_matmul_set_dynamic_shape |
| --- | --- |
| Beschreibung | Setzt die Matrixmultiplikationsform. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
|  | rknn_matmul_shape* shape: für die Matrixmultiplikation verwendete Form. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p48; unit 359 -->

Beispielcode:

<!-- source: EN PDF p48; unit 360 -->

```c
ret = rknn_matmul_set_dynamic_shape(ctx, &shapes[0]);
if (ret != 0) {
 fprintf(stderr, "rknn_matmul_set_dynamic_shapes fail!\n");
 return -1;
}
```

<!-- source: EN PDF p49; unit 361 -->

#### rknn_B_normal_layout_to_native_layout

<!-- source: EN PDF p49; unit 362 -->

rknn_B_normal_layout_to_native_layout konvertiert die Daten von B aus dem ursprünglichen Layout (KxN) in ein leistungsoptimiertes Datenlayout.

<!-- source: EN PDF p49; unit 363 -->

| API | rknn_B_normal_layout_to_native_layout |
| --- | --- |
| Beschreibung | Konvertiert das Datenlayout von B aus der ursprünglichen in eine leistungsoptimierte Form. |
| Parameter | void* B_input: Zeiger auf die Daten von B im ursprünglichen Layout. |
|  | void* B_output: Zeiger auf die Daten von B im leistungsoptimierten Layout. |
|  | int K: Zeilenanzahl von B. |
|  | int N: Spaltenanzahl von B. |
|  | int subN: entspricht B.dims[2] in rknn_matmul_io_attr. |
|  | int subK: entspricht B.dims[3] in rknn_matmul_io_attr. |
|  | rknn_matmul_info* info: Zeiger auf die Informationsstruktur zur Matrixmultiplikation. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p49; unit 364 -->

Beispielcode:

<!-- source: EN PDF p49; unit 365 -->

```c
int32_t subN = io_attr.B.dims[2];
int32_t subK = io_attr.B.dims[3];
rknn_B_normal_layout_to_native_layout(B_Matrix, B->virt_addr, K, N, subN, subK, &info);
```

<!-- source: EN PDF p49; unit 366 -->

#### rknn_matmul_run

<!-- source: EN PDF p49; unit 367 -->

Die Funktion führt die Matrixmultiplikation aus und speichert das Ergebnis in C. Zuvor A und B vorbereiten und ihre Eingabepuffer über rknn_matmul_set_io_mem setzen. Auch der Ausgabepuffer von C wird über rknn_matmul_set_io_mem gesetzt; die Ausgabetensorattribute stammen aus rknn_matmul_create.

<!-- source: EN PDF p49; unit 368 -->

| API | rknn_matmul_run |
| --- | --- |
| Beschreibung | Führt eine Matrixmultiplikation aus. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p49; unit 369 -->

Beispielcode:

<!-- source: EN PDF p49; unit 370 -->

```c
int ret = rknn_matmul_run(ctx);
```

<!-- source: EN PDF p50; unit 371 -->

#### rknn_matmul_destroy

<!-- source: EN PDF p50; unit 372 -->

Die Funktion zerstört den Matrixmultiplikationskontext und gibt zugehörige Ressourcen frei. Nach Verwendung des durch rknn_matmul_create erstellten Zeigers ist diese Funktion zur Zerstörung aufzurufen.

<!-- source: EN PDF p50; unit 373 -->

| API | rknn_matmul_destroy |
| --- | --- |
| Beschreibung | Zerstört den Matrixmultiplikationskontext. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p50; unit 374 -->

Beispielcode:

<!-- source: EN PDF p50; unit 375 -->

```c
int ret = rknn_matmul_destroy(ctx);
```

<!-- source: EN PDF p51; unit 376 -->

### 4.6 Datenstrukturen benutzerdefinierter Operatoren

<!-- source: EN PDF p51; unit 377 -->

#### rknn_gpu_op_context

<!-- source: EN PDF p51; unit 378 -->

rknn_gpu_op_context enthält den Kontext eines auf der angegebenen GPU ausgeführten benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p51; unit 379 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| cl_context | void* | OpenCL-Objekt cl_context; bei Verwendung explizit in cl_context umwandeln. |
| cl_command_queue | void* | OpenCL-Objekt cl_command_queue; bei Verwendung explizit in cl_command_queue umwandeln. |
| cl_kernel | void* | OpenCL-Objekt cl_kernel; bei Verwendung explizit in cl_kernel umwandeln. |

<!-- source: EN PDF p51; unit 380 -->

#### rknn_custom_op_context

<!-- source: EN PDF p51; unit 381 -->

rknn_custom_op_context enthält die Kontextinformationen eines benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p51; unit 382 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| target | rknn_target_type | Ausführungsgerät benutzerdefinierter Operatoren: RKNN_TARGET_TYPE_CPU: CPU; RKNN_TARGET_TYPE_CPU: GPU. Die doppelte CPU-Konstante für GPU steht so in der Quelle und ist zu prüfen. |
| internal_ctx | rknn_custom_op_interal_context | Privater Kontext innerhalb des Operators. |
| gpu_ctx | rknn_gpu_op_context | OpenCL-Kontextinformationen des benutzerdefinierten Operators. Bei GPU-Ausführung erhält der Callback OpenCL-Objekte wie cl_context aus dieser Struktur. |
| priv_data | void* | Datenzeiger, deren Verwaltung dem Entwickler überlassen bleibt. |

<!-- source: EN PDF p52; unit 383 -->

#### rknn_custom_op_tensor

<!-- source: EN PDF p52; unit 384 -->

rknn_custom_op_tensor beschreibt den Ein-/Ausgabetensor eines benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p52; unit 385 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| attr | rknn_tensor_attr | Name, Form, Größe und weitere Tensorinformationen. |
| mem | rknn_tensor_mem | Tensorspeicheradresse, fd, Offset gültiger Daten und weitere Informationen. |

<!-- source: EN PDF p52; unit 386 -->

#### rknn_custom_op_attr

<!-- source: EN PDF p52; unit 387 -->

rknn_custom_op_attr beschreibt Parameter oder Attribute eines benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p52; unit 388 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| name | char[] | Parametername des benutzerdefinierten Operators. |
| dtype | rknn_tensor_type | Datentyp jedes Elements. |
| n_elems | uint32_t | Elementanzahl. |
| data | void* | Virtuelle Adresse des Parameterspeicherbereichs. |

<!-- source: EN PDF p53; unit 389 -->

#### rknn_custom_op

<!-- source: EN PDF p53; unit 390 -->

rknn_custom_op enthält die Registrierungsinformationen eines benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source: EN PDF p53,54; unit 391,392 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| version | uint32_t | Versionsnummer des benutzerdefinierten Operators. |
| target | rknn_target_type | Ausführungs-Backendtyp des Operators. |
| op_type | char[] | Typ des benutzerdefinierten Operators. |
| cl_kernel_name | char[] | Name der OpenCL-Kernelfunktion. |
| cl_kernel_source | char* | OpenCL-Ressource: bei cl_source_size=0 ein absoluter Dateipfad; bei cl_source_size&gt;0 eine Zeichenfolge mit Kernelfunktionscode. |
| cl_source_size | uint64_t | Ist cl_kernel_source eine Zeichenfolge, deren Länge; bei einem Dateipfad 0. |
| cl_build_options | char[] | Kompilieroptionen des OpenCL-Kernels. |
| init | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Zeiger auf den Initialisierungs-Callback des Operators. Einmal bei Registrierung aufgerufen; bei Nichtbedarf NULL zulässig. |
| prepare | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Zeiger auf den Vorverarbeitungs-Callback. Einmal während rknn_run aufgerufen; bei Nichtbedarf NULL zulässig. |
| compute | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Zeiger auf den Berechnungs-Callback des benutzerdefinierten Operators. Einmal während rknn_run aufgerufen; NULL unzulässig. |
| compute_native | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Zeiger auf den leistungsoptimierten Berechnungs-Callback. Unterschied zu compute ist das Format der Ein-/Ausgabetensoren. Noch nicht unterstützt; auf NULL setzen. |
| destroy | int (*)(rknn_custom_op_context*<br>op_ctx); | Zeiger auf den Callback zum Freigeben von Ressourcen. Einmal während rknn_destroy aufgerufen. |

<!-- source: EN PDF p55; unit 393 -->

### 4.7 API benutzerdefinierter Operatoren

<!-- source: EN PDF p55; unit 394 -->

#### rknn_register_custom_ops

<!-- source: EN PDF p55; unit 395 -->

Nach erfolgreicher Kontextinitialisierung registriert die Funktion mehrere benutzerdefinierte Operatoren: Typen, Ausführungs-Backends, OpenCL-Kernelinformationen und Callback-Zeiger. Nach erfolgreicher Registrierung ruft rknn_run während der Inferenz die vom Entwickler implementierten Callbacks auf.

<!-- source: EN PDF p55; unit 396 -->

| API | rknn_register_custom_ops |
| --- | --- |
| Beschreibung | Registriert mehrere benutzerdefinierte Operatoren im Kontext. |
| Parameter | rknn_context *context: rknn_context-Zeiger. Der Kontext muss vor dem Aufruf erfolgreich initialisiert sein. |
|  | rknn_custom_op* op: Array der Operatorinformationen; jedes Element ist ein rknn_custom_op-Strukturobjekt. |
|  | uint32_t custom_op_num: Länge des Operatorinformationsarrays. |
| Rückgabe | int: Fehlercode (siehe RKNN-Fehlercodes). |

<!-- source: EN PDF p55; unit 397 -->

Beispielcode:

<!-- source: EN PDF p55; unit 398 -->

```c
// CPU operators
rknn_custom_op user_op[2];
memset(user_op, 0, 2 * sizeof(rknn_custom_op));
strncpy(user_op[0].op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op[0].version = 1;
user_op[0].target = RKNN_TARGET_TYPE_CPU;
user_op[0].init = custom_op_init_callback;
user_op[0].compute = compute_custom_softmax_float32;
user_op[0].destroy = custom_op_destroy_callback;

strncpy(user_op[1].op_type, "ArgMax", RKNN_MAX_NAME_LEN - 1);
user_op[1].version = 1;
user_op[1].target = RKNN_TARGET_TYPE_CPU;
user_op[1].init = custom_op_init_callback;
user_op[1].compute = compute_custom_argmax_float32;
user_op[1].destroy = custom_op_destroy_callback;

ret = rknn_register_custom_ops(ctx, user_op, 2);
if (ret < 0) {
 printf("rknn_register_custom_ops fail! ret = %d\n", ret);
 return -1;
}
```

<!-- source: EN PDF p56; unit 399 -->

#### rknn_custom_op_get_op_attr

<!-- source: EN PDF p56; unit 400 -->

Die Funktion liest Parameter eines benutzerdefinierten Operators innerhalb dessen Callback aus, etwa axis bei Softmax. Übergeben werden der Feldname des Parameters und ein Zeiger auf rknn_custom_op_attr. Nach dem Aufruf steht der Wert im Feld data. Der Entwickler wandelt den Zeiger gemäß dtype der zurückgegebenen Struktur in den Anfang eines Arrays des entsprechenden C-Datentyps um und liest anhand der Elementanzahl den vollständigen Parameterwert.

<!-- source: EN PDF p56; unit 401 -->

| API | rknn_custom_op_get_op_attr |
| --- | --- |
| Beschreibung | Ruft Parameter oder Attribute eines benutzerdefinierten Operators ab. |
| Parameter | rknn_custom_op_context* op_ctx: Zeiger auf den Operatorkontext. |
|  | const char* attr_name: Feldname des Operatorparameters. |
|  | rknn_custom_op_attr* op_attr: Struktur für den Wert des Operatorparameters. |
| Rückgabe | Kein Wert. |

<!-- source: EN PDF p56; unit 402 -->

Beispielcode:

<!-- source: EN PDF p56; unit 403 -->

```c
rknn_custom_op_attr op_attr;
rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
  axis = ((int64_t*)op_attr.data)[0];
}
…
```

<!-- source: EN PDF p57; unit 404 -->

## 5. RKNN-Fehlercodes

<!-- source: EN PDF p57; unit 405 -->

Die Rückgabecodes der RKNN-API-Funktionen sind in der folgenden Tabelle definiert.

<!-- source: EN PDF p57; unit 406 -->

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
| RKNN_ERR_INCOMPATILE_OPTIMIZATION_LEVEL_VERSION<br>(-12) | Das RKNN-Modell verwendet einen Optimierungsstufenmodus, der zum aktuellen Treiber inkompatibel ist. |
| RKNN_ERR_TARGET_PLATFORM_UNMATCH (-13) | Das RKNN-Modell ist mit der aktuellen Plattform inkompatibel. |

{% endraw %}
