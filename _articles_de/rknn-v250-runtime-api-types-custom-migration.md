---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Operatortypen und Migration veralteter APIs"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-types-custom-migration"
slug: "rknn-v250-runtime-api-types-custom-migration"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Operatortypen und Migration veralteter APIs | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Operatortypen und Migration veralteter APIs | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-types-custom-migration/"
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

<!-- source EN p43 unit 467 -->

### 6.4. Strukturen benutzerdefinierter Operatoren

<!-- source EN p43 unit 468 -->

### rknn_gpu_op_context

<!-- source EN p43 unit 469 -->

rknn_gpu_op_context enthält den Kontext eines auf der angegebenen GPU ausgeführten benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p43 unit 470 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| cl_context | void* | OpenCL-Objekt cl_context; bei Verwendung explizit in cl_context umwandeln. |
| cl_command_queue | void* | OpenCL-Objekt cl_command_queue; bei Verwendung explizit in cl_command_queue umwandeln. |
| cl_kernel | void* | OpenCL-Objekt cl_kernel; bei Verwendung explizit in cl_kernel umwandeln. |

<!-- source EN p43 unit 471 -->

### rknn_custom_op_context

<!-- source EN p43 unit 472 -->

rknn_custom_op_context enthält die Kontextinformationen eines benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p43 unit 473 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| target | rknn_target_type | Ausführungsgerät benutzerdefinierter Operatoren: RKNN_TARGET_TYPE_CPU: CPU; RKNN_TARGET_TYPE_CPU: GPU. Die doppelte CPU-Konstante für GPU steht so in der Quelle und ist zu prüfen. |
| internal_ctx | rknn_custom_op_interal_context | Privater Kontext innerhalb des Operators. |
| gpu_ctx | rknn_gpu_op_context | OpenCL-Kontextinformationen des benutzerdefinierten Operators. Bei GPU-Ausführung erhält der Callback OpenCL-Objekte wie cl_context aus dieser Struktur. |
| priv_data | void* | Datenzeiger, deren Verwaltung dem Entwickler überlassen bleibt. |

<!-- source EN p43 unit 474 -->

### rknn_custom_op_tensor

<!-- source EN p43 unit 475 -->

rknn_custom_op_tensor beschreibt den Ein-/Ausgabetensor eines benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p43 unit 476 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| attr | rknn_tensor_attr | Name, Form, Größe und weitere Tensorinformationen. |
| mem | rknn_tensor_mem | Tensorspeicheradresse, fd, Offset gültiger Daten und weitere Informationen. |

<!-- source EN p43 unit 477 -->

### rknn_custom_op_attr

<!-- source EN p43 unit 478 -->

rknn_custom_op_attr beschreibt Parameter oder Attribute eines benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p43 unit 479 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| name | char[] | Parametername des benutzerdefinierten Operators. |
| dtype | rknn_tensor_type | Datentyp jedes Elements. |
| n_elems | uint32_t | Elementanzahl. |
| data | void* | Virtuelle Adresse des Parameterspeicherbereichs. |

<!-- source EN p43 unit 480 -->

### rknn_custom_op

<!-- source EN p43 unit 481 -->

rknn_custom_op enthält die Registrierungsinformationen eines benutzerdefinierten Operators. Die Strukturdefinition folgt in der Tabelle:

<!-- source EN p43 unit 482 -->

| Feld | Typ | Bedeutung |
| --- | --- | --- |
| version | uint32_t | Versionsnummer des benutzerdefinierten Operators. |
| target | rknn_target_type | Ausführungs-Backendtyp des Operators. |
| op_type | char[] | Typ des benutzerdefinierten Operators. |
| cl_kernel_name | char[] | Name der OpenCL-Kernelfunktion. |
| cl_kernel_source | char* | OpenCL-Ressource: bei cl_source_size=0 ein absoluter Dateipfad; bei cl_source_size>0 eine Zeichenfolge mit Kernelfunktionscode. |
| cl_source_size | uint64_t | Ist cl_kernel_source eine Zeichenfolge, deren Länge; bei einem Dateipfad 0. |
| cl_build_options | char[] | Kompilieroptionen des OpenCL-Kernels. |
| init | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Zeiger auf den Initialisierungs-Callback des Operators. Einmal bei Registrierung aufgerufen; bei Nichtbedarf NULL zulässig. |
| prepare | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Zeiger auf den Vorverarbeitungs-Callback. Einmal während rknn_run aufgerufen; bei Nichtbedarf NULL zulässig. |
| compute | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Zeiger auf den Berechnungs-Callback des benutzerdefinierten Operators. Einmal während rknn_run aufgerufen; NULL unzulässig. |
| compute_native | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Zeiger auf den leistungsoptimierten Berechnungs-Callback. Unterschied zu compute ist das Format der Ein-/Ausgabetensoren. Noch nicht unterstützt; auf NULL setzen. |
| destroy | int (*)(rknn_custom_op_context*<br>op_ctx); | Zeiger auf den Callback zum Freigeben von Ressourcen. Einmal während rknn_destroy aufgerufen. |

<!-- source EN p45 unit 484 -->

## 7. API-Änderungen, veraltete Schnittstellen und Migration

<!-- source EN p45 unit 485 -->

Versionsbezogene Ergänzungen, Änderungen und Abkündigungen stehen in der Versionshistorie des Originalhandbuchs.

<!-- source EN p45 unit 486 -->

In V2.5.0 sind folgende Schnittstellen veraltet. Die angegebenen Ersatzschnittstellen verwenden:

<!-- source EN p45 unit 487 -->

| Veraltete Schnittstelle | Ersatzschnittstelle |
| --- | --- |
| rknn_set_input_shape | rknn_set_input_shapes |
| rknn_matmul_create_dyn_shape | rknn_matmul_create_dynamic_shape |

<!-- source EN p45 unit 488 -->

Details: rknn_set_input_shape (veraltet) in 5.3 „Inferenz ausführen“ und rknn_matmul_create_dyn_shape (veraltet) in 5.5 „Matrixmultiplikation“.

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
