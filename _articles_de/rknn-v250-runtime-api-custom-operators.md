---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Benutzerdefinierte Operatoren registrieren und abfragen"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-custom-operators"
slug: "rknn-v250-runtime-api-custom-operators"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Benutzerdefinierte Operatoren registrieren und abfragen | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Benutzerdefinierte Operatoren registrieren und abfragen | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-custom-operators/"
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

<!-- source EN p34 unit 386 -->

### 5.6. Benutzerdefinierte Operatoren

<!-- source EN p34 unit 387 -->

Benutzerdefinierte Operatoren registrieren und Operatorattribute abrufen.

<!-- source EN p34 unit 388 -->

### rknn_register_custom_ops

<!-- source EN p34 unit 389 -->

Nach erfolgreicher Kontextinitialisierung registriert die Funktion mehrere benutzerdefinierte Operatoren: Typen, Ausführungs-Backends, OpenCL-Kernelinformationen und Callback-Zeiger. Nach erfolgreicher Registrierung ruft rknn_run während der Inferenz die vom Entwickler implementierten Callbacks auf.

<!-- source EN p34 unit 390 -->

| API | rknn_register_custom_ops |
| --- | --- |
| Beschreibung | Registriert mehrere benutzerdefinierte Operatoren im Kontext. |
| Parameter | rknn_context *context: rknn_context-Zeiger. Der Kontext muss vor dem Aufruf erfolgreich initialisiert sein. |
| Parameter | rknn_custom_op* op: Array der Operatorinformationen; jedes Element ist ein rknn_custom_op-Strukturobjekt. |
| Parameter | uint32_t custom_op_num: Länge des Operatorinformationsarrays. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p35 unit 392 -->

Codebeispiel:

<!-- source EN p35 unit 393 -->

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

<!-- source EN p35 unit 394 -->

### rknn_custom_op_get_op_attr

<!-- source EN p35 unit 395 -->

Die Funktion liest Parameter eines benutzerdefinierten Operators innerhalb dessen Callback aus, etwa axis bei Softmax. Übergeben werden der Feldname des Parameters und ein Zeiger auf rknn_custom_op_attr. Nach dem Aufruf steht der Wert im Feld data. Der Entwickler wandelt den Zeiger gemäß dtype der zurückgegebenen Struktur in den Anfang eines Arrays des entsprechenden C-Datentyps um und liest anhand der Elementanzahl den vollständigen Parameterwert.

<!-- source EN p35 unit 396 -->

| API | rknn_custom_op_get_op_attr |
| --- | --- |
| Beschreibung | Ruft Parameter oder Attribute eines benutzerdefinierten Operators ab. |
| Parameter | rknn_custom_op_context* op_ctx: Zeiger auf den Operatorkontext. |
| Parameter | const char* attr_name: Feldname des Operatorparameters. |
| Parameter | rknn_custom_op_attr* op_attr: Struktur für den Wert des Operatorparameters. |
| Rückgabe | Kein Wert. |

<!-- source EN p35 unit 397 -->

Codebeispiel:

<!-- source EN p35 unit 398 -->

```c
rknn_custom_op_attr op_attr;
rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
   axis = ((int64_t*)op_attr.data)[0];
}
...
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
