---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Eingabe, Ausführung, Ausgabe und dynamische Formen"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-inference"
slug: "rknn-v250-runtime-api-inference"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Eingabe, Ausführung, Ausgabe und dynamische Formen | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Eingabe, Ausführung, Ausgabe und dynamische Formen | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-inference/"
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

<!-- source EN p23 unit 245 -->

### 5.3. Inferenz ausführen

<!-- source EN p23 unit 246 -->

Eingaben setzen, Inferenz ausführen, Ausgaben abrufen und dynamische Formen einstellen.

<!-- source EN p23 unit 247 -->

### rknn_inputs_set

<!-- source EN p23 unit 248 -->

rknn_inputs_set setzt die Modelleingabedaten. Mehrere Eingaben werden unterstützt, jeweils als rknn_input-Objekt. Deren Felder sind vor Übergabe an rknn_inputs_set zu setzen. Auf RV1106/RV1103/RV1103B/RV1106B/RK2118 nicht verfügbar.

<!-- source EN p23 unit 249 -->

| API | rknn_inputs_set |
| --- | --- |
| Beschreibung | Setzt die Modelleingabedaten. |
| Parameter | rknn_context context: rknn_contex-Objekt (Quellschreibweise). |
| Parameter | uint32_t n_inputs: Anzahl der Eingaben. |
| Parameter | rknn_input inputs[]: Array von rknn_input. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p23 unit 250 -->

Codebeispiel:

<!-- source EN p23 unit 251 -->

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

<!-- source EN p23 unit 252 -->

### rknn_run

<!-- source EN p23 unit 253 -->

rknn_run führt eine Modellinferenz aus. Zuvor müssen die Eingabedaten über rknn_inputs_set oder die Zero-Copy-Schnittstelle konfiguriert werden.

<!-- source EN p23 unit 254 -->

| API | rknn_run |
| --- | --- |
| Beschreibung | Führt eine Modellinferenz aus. |
| Parameter | rknn_context context: rknn_contex-Objekt (Quellschreibweise). |
| Parameter | rknn_run_extend* extend: für Erweiterungen reserviert; im beschriebenen Stand ungenutzt, nur NULL zulässig. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p23 unit 255 -->

Codebeispiel:

<!-- source EN p23 unit 256 -->

```c
ret = rknn_run(ctx, NULL);
```

<!-- source EN p23 unit 257 -->

### rknn_outputs_get

<!-- source EN p23 unit 258 -->

rknn_outputs_get ruft Modellausgaben ab. Mehrere Ausgaben sind möglich; jede ist ein rknn_output-Objekt, das vor dem Aufruf erzeugt und initialisiert werden muss. RV1106/RV1103/RV1106B/RV1103B/RK2118 werden nicht unterstützt.

<!-- source EN p24 unit 260 -->

Es gibt zwei Möglichkeiten, Puffer für Ausgabedaten bereitzustellen:

<!-- source EN p24 unit 261 -->

1. Der Benutzer weist die Puffer selbst zu und gibt sie frei. Dann ist rknn_output.is_prealloc auf 1 zu setzen; rknn_output.buf zeigt auf den Benutzerpuffer.

<!-- source EN p24 unit 262 -->

2. rknn weist den Speicher zu. Dann ist rknn_output.is_prealloc auf 0 zu setzen. Nach Ausführung wird rknn_output.buf mit den Ausgabedaten erstellt.

<!-- source EN p24 unit 263 -->

| API | rknn_outputs_get |
| --- | --- |
| Beschreibung | Ruft die Inferenz-Ausgabedaten ab. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | uint32_t n_outputs: Anzahl der Ausgaben. |
| Parameter | rknn_output outputs[]: Array von rknn_output. |
| Parameter | rknn_run_extend* extend: für Erweiterungen reserviert; derzeit ungenutzt, nur NULL zulässig. Typ quellengetreu beibehalten. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p24 unit 264 -->

Codebeispiel:

<!-- source EN p24 unit 265 -->

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

<!-- source EN p24 unit 266 -->

### rknn_outputs_release

<!-- source EN p24 unit 267 -->

rknn_outputs_release gibt die Ressourcen des rknn_output-Objekts frei.

<!-- source EN p24 unit 268 -->

| API | rknn_outputs_release |
| --- | --- |
| Beschreibung | Gibt das rknn_output-Objekt frei. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | uint32_t n_outputs: Anzahl der Ausgaben. |
| Parameter | rknn_output outputs[]: Array der freizugebenden rknn_output. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p24 unit 269 -->

Codebeispiel:

<!-- source EN p24 unit 270 -->

```c
ret = rknn_outputs_release(ctx, io_num.n_output, outputs);
```

<!-- source EN p24 unit 271 -->

rknn_set_input_shape (veraltet)

<!-- source EN p24 unit 272 -->

Diese Schnittstelle ist veraltet. Eingabeformen sind mit rknn_set_input_shapes zu binden. In der aktuellen Version ist die alte Schnittstelle nicht verfügbar. Für ihre weitere Nutzung sind SDK 1.5.0 und dessen Anleitung erforderlich.

<!-- source EN p24 unit 273 -->

### rknn_set_input_shapes

<!-- source EN p24 unit 274 -->

Bei dynamischen RKNN-Eingabeformen muss die aktuelle Form vor der Inferenz gesetzt werden. Übergeben werden Eingabeanzahl und rknn_tensor_attr-Array mit Form und Layout. index, name, dims und fmt jedes Elements ausfüllen; andere Felder sind nicht erforderlich. Zuvor können mit rknn_query die Anzahl und die Liste unterstützter dynamischer Formen abgefragt werden. Die Eingabeform muss in dieser Liste enthalten sein. Beim ersten Lauf und jedem Formwechsel ist ein Aufruf erforderlich; ansonsten muss er nicht wiederholt werden.

<!-- source EN p25 unit 276 -->

| API | rknn_set_input_shapes |
| --- | --- |
| Beschreibung | Setzt die aktuell verwendete Modelleingabeform. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | uint32_t n_inputs: Anzahl der Eingabetensoren. |
| Parameter | rknn_tensor_attr *: Zeiger auf das Attributarray sämtlicher Eingabeformen. Für jede Eingabe sind index, name, dims, fmt und n_dims zu setzen; weitere Felder sind nicht erforderlich. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p25 unit 277 -->

Codebeispiel:

<!-- source EN p25 unit 278 -->

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

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
