---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Matrixmultiplikations-APIs und dynamische Formen"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-matmul"
slug: "rknn-v250-runtime-api-matmul"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Matrixmultiplikations-APIs und dynamische Formen | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Matrixmultiplikations-APIs und dynamische Formen | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-matmul/"
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

<!-- source EN p30 unit 332 -->

### 5.5. Matrixmultiplikation

<!-- source EN p30 unit 333 -->

Matrixmultiplikationskontext erstellen, Speicher und Quantisierungsparameter setzen, ausführen.

<!-- source EN p30 unit 334 -->

### rknn_matmul_create

<!-- source EN p30 unit 335 -->

Die Funktion initialisiert den Matrixmultiplikationskontext anhand der übergebenen Spezifikation und weiterer Informationen. Sie gibt Form, Größe, Datentyp und weitere Attribute der Ein- und Ausgabetensoren zurück. Der Zeiger rknn_matmul_ctx und rknn_context haben hier dieselbe Datenstruktur.

<!-- source EN p30 unit 336 -->

| API | rknn_matmul_create |
| --- | --- |
| Beschreibung | Initialisiert den Matrixmultiplikationskontext. |
| Parameter | rknn_matmul_ctx* ctx: Zeiger auf den Matrixmultiplikationskontext. |
| Parameter | rknn_matmul_info* info: Zeiger auf die Spezifikationsstruktur der Matrixmultiplikation. |
| Parameter | rknn_matmul_io_attr* io_attr: Zeiger auf die Attributstruktur der Ein-/Ausgabetensoren der Matrixmultiplikation. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p30 unit 337 -->

Codebeispiel:

<!-- source EN p30 unit 338 -->

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

<!-- source EN p30 unit 339 -->

### rknn_matmul_set_io_mem

<!-- source EN p30 unit 340 -->

Die Funktion setzt den Ein-/Ausgabespeicher der Matrixmultiplikation. Zunächst über rknn_create_mem einen rknn_tensor_mem-Zeiger erstellen, dann gemeinsam mit dem von rknn_matmul_create erhaltenen rknn_matmul_tensor_attr-Zeiger für A, B oder C übergeben. Dadurch wird der Speicher im Operationskontext gebunden. Zuvor müssen die Daten von A und B gemäß dem in rknn_matmul_info konfigurierten Speicherlayout vorbereitet werden.

<!-- source EN p30 unit 341 -->

| API | rknn_matmul_set_io_mem |
| --- | --- |
| Beschreibung | Setzt den Ein-/Ausgabespeicher für Matrixmultiplikation. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
| Parameter | rknn_tensor_mem* mem: Zeiger auf die Tensorspeicher-Informationsstruktur. |
| Parameter | rknn_matmul_tensor_attr* attr: Zeiger auf die Attributstruktur der Ein-/Ausgabetensoren der Matrixmultiplikation. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p30 unit 342 -->

Codebeispiel:

<!-- source EN p31 unit 343 -->

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

<!-- source EN p31 unit 344 -->

### rknn_matmul_set_core_mask

<!-- source EN p31 unit 345 -->

Die Funktion legt die verfügbaren NPU-Kerne für Matrixmultiplikation fest; nur RK3588 und RK3576 werden unterstützt. Zuvor den Kontext mit rknn_matmul_create initialisieren. Der Maskenwert wählt die verwendeten Kerne zur Verbesserung von Leistung und Effizienz der Matrixmultiplikation.

<!-- source EN p31 unit 346 -->

| API | rknn_matmul_set_core_mask |
| --- | --- |
| Beschreibung | Setzt die NPU-Kernmaske für Matrixmultiplikation. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
| Parameter | rknn_core_mask core_mask: Maske verfügbarer NPU-Kerne für Matrixmultiplikation. Jedes Bit bezeichnet einen Kern: 1 bedeutet verfügbar, sonst nicht verfügbar. Details siehe Parameter von rknn_set_core_mask. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p31 unit 347 -->

Codebeispiel:

<!-- source EN p31 unit 348 -->

```c
rknn_matmul_set_core_mask(ctx, RKNN_NPU_CORE_AUTO);
```

<!-- source EN p31 unit 349 -->

### rknn_matmul_set_quant_params

<!-- source EN p31 unit 350 -->

rknn_matmul_set_quant_params setzt die Quantisierungsparameter jeder Matrix für Per-Channel oder Per-Layer. Bei Per-Channel haben scale und zp in rknn_quant_params die Länge N, bei Per-Layer die Länge 1. Die Parameter aller Matrizen sind vor rknn_matmul_run zu setzen. Ohne diesen Aufruf gilt Per-Layer mit scale=1.0 und zero_point=0.

<!-- source EN p31 unit 351 -->

| API | rknn_matmul_set_quant_params |
| --- | --- |
| Beschreibung | Setzt die Quantisierungsparameter der Matrix. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
| Parameter | rknn_quant_params* params: Quantisierungsparameter der Matrix. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p31 unit 352 -->

Codebeispiel:

<!-- source EN p32 unit 353 -->

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

<!-- source EN p32 unit 354 -->

### rknn_matmul_get_quant_params

<!-- source EN p32 unit 355 -->

rknn_matmul_get_quant_params wird bei rknn_matmul_type=RKNN_INT8_MM_INT8_TO_INT32 und Per-Channel-Quantisierung verwendet, um die normalisierten scale-Werte aller Kanäle von B zu erhalten. Der erhaltene Wert multipliziert mit dem ursprünglichen scale von A ergibt scale von C. Damit lässt sich scale von C näherungsweise bestimmen, wenn kein tatsächlicher Wert vorliegt.

<!-- source EN p32 unit 356 -->

| API | rknn_matmul_get_quant_params |
| --- | --- |
| Beschreibung | Ruft die Quantisierungsparameter von Matrix B ab. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
| Parameter | rknn_quant_params* params: Quantisierungsparameter von Matrix B. |
| Parameter | float* scale: Zeiger auf scale von Matrix B. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p32 unit 357 -->

Codebeispiel:

<!-- source EN p32 unit 358 -->

```c
float b_scale;
rknn_matmul_get_quant_params(ctx, &params_b, &b_scale);
```

<!-- source EN p32 unit 359 -->

rknn_matmul_create_dyn_shape (veraltet)

<!-- source EN p32 unit 360 -->

Diese Schnittstelle ist veraltet und durch rknn_matmul_create_dynamic_shape ersetzt.

<!-- source EN p32 unit 361 -->

### rknn_matmul_create_dynamic_shape

<!-- source EN p32 unit 362 -->

rknn_matmul_create_dynamic_shape erstellt einen Matrixmultiplikationskontext mit dynamischen Formen. Übergeben werden rknn_matmul_info, Formenanzahl und ein entsprechendes Array mehrerer M-, K- und N-Werte. Nach erfolgreicher Initialisierung wird ein rknn_matmul_io_attr-Array mit Form, Größe und Datentyp aller Ein- und Ausgabematrizen zurückgegeben. Im beschriebenen Stand lassen sich mehrere unterschiedliche M, K und N festlegen.

<!-- source EN p32 unit 363 -->

| API | rknn_matmul_create_dynamic_shape |
| --- | --- |
| Beschreibung | Initialisiert den Matrixmultiplikationskontext mit dynamischen Formen. |
| Parameter | rknn_matmul_ctx *ctx: Zeiger auf den Matrixmultiplikationskontext. |
| Parameter | rknn_matmul_info* info: Zeiger auf die Spezifikationsstruktur der Matrixmultiplikation. M, K und N müssen nicht gesetzt werden. |
| Parameter | int shape_num: Anzahl der vom Kontext unterstützten Formen. |
| Parameter | rknn_matmul_shape dynamic_shapes[]: Array der vom Kontext unterstützten Formen. |
| Parameter | rknn_matmul_io_attr io_attrs[]: Array der Attributstrukturen der Ein-/Ausgabetensoren der Matrixmultiplikation. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p32 unit 364 -->

Codebeispiel:

<!-- source EN p33 unit 365 -->

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

<!-- source EN p33 unit 366 -->

### rknn_matmul_set_dynamic_shape

<!-- source EN p33 unit 367 -->

rknn_matmul_set_dynamic_shape wählt eine bestimmte Form für die Matrixmultiplikation. Nach Erstellung des Kontexts für dynamische Formen eine der rknn_matmul_shape-Strukturen übergeben, um die Form der Operation festzulegen.

<!-- source EN p33 unit 368 -->

| API | rknn_matmul_set_dynamic_shape |
| --- | --- |
| Beschreibung | Setzt die Matrixmultiplikationsform. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
| Parameter | rknn_matmul_shape* shape: für die Matrixmultiplikation verwendete Form. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p33 unit 369 -->

Codebeispiel:

<!-- source EN p33 unit 370 -->

```c
ret = rknn_matmul_set_dynamic_shape(ctx, &shapes[0]);
if (ret != 0) {
  fprintf(stderr, "rknn_matmul_set_dynamic_shapes fail!\n");
  return -1;
}
```

<!-- source EN p33 unit 371 -->

rknn_B_normal_layout_to_native_layout

<!-- source EN p33 unit 372 -->

rknn_B_normal_layout_to_native_layout konvertiert die Daten von B aus dem ursprünglichen Layout (KxN) in ein leistungsoptimiertes Datenlayout.

<!-- source EN p33 unit 373 -->

| API | rknn_B_normal_layout_to_native_layout |
| --- | --- |
| Beschreibung | Konvertiert das Datenlayout von B aus der ursprünglichen in eine leistungsoptimierte Form. |
| Parameter | void* B_input: Zeiger auf die Daten von B im ursprünglichen Layout. |
| Parameter | void* B_output: Zeiger auf die Daten von B im leistungsoptimierten Layout. |
| Parameter | int K: Zeilenanzahl von B. |
| Parameter | int N: Spaltenanzahl von B. |
| Parameter | int subN: entspricht B.dims[2] in rknn_matmul_io_attr. |
| Parameter | int subK: entspricht B.dims[3] in rknn_matmul_io_attr. |
| Parameter | rknn_matmul_info* info: Zeiger auf die Informationsstruktur zur Matrixmultiplikation. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p33 unit 374 -->

Codebeispiel:

<!-- source EN p34 unit 375 -->

```c
int32_t subN = io_attr.B.dims[2];
int32_t subK = io_attr.B.dims[3];
rknn_B_normal_layout_to_native_layout(B_Matrix, B->virt_addr, K, N, subN, subK, &info);
```

<!-- source EN p34 unit 376 -->

### rknn_matmul_run

<!-- source EN p34 unit 377 -->

Die Funktion führt die Matrixmultiplikation aus und speichert das Ergebnis in C. Zuvor A und B vorbereiten und ihre Eingabepuffer über rknn_matmul_set_io_mem setzen. Auch der Ausgabepuffer von C wird über rknn_matmul_set_io_mem gesetzt; die Ausgabetensorattribute stammen aus rknn_matmul_create.

<!-- source EN p34 unit 378 -->

| API | rknn_matmul_run |
| --- | --- |
| Beschreibung | Führt eine Matrixmultiplikation aus. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p34 unit 379 -->

Codebeispiel:

<!-- source EN p34 unit 380 -->

```c
int ret = rknn_matmul_run(ctx);
```

<!-- source EN p34 unit 381 -->

### rknn_matmul_destroy

<!-- source EN p34 unit 382 -->

Die Funktion zerstört den Matrixmultiplikationskontext und gibt zugehörige Ressourcen frei. Nach Verwendung des durch rknn_matmul_create erstellten Zeigers ist diese Funktion zur Zerstörung aufzurufen.

<!-- source EN p34 unit 383 -->

| API | rknn_matmul_destroy |
| --- | --- |
| Beschreibung | Zerstört den Matrixmultiplikationskontext. |
| Parameter | rknn_matmul_ctx ctx: Matrixmultiplikationskontext. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p34 unit 384 -->

Codebeispiel:

<!-- source EN p34 unit 385 -->

```c
int ret = rknn_matmul_destroy(ctx);
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
