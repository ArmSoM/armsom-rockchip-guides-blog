---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Tensorspeicher zuweisen und synchronisieren"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-tensor-memory"
slug: "rknn-v250-runtime-api-tensor-memory"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Tensorspeicher zuweisen und synchronisieren | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Tensorspeicher zuweisen und synchronisieren | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-tensor-memory/"
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

<!-- source EN p25 unit 279 -->

### 5.4. Tensoren und Speicher

<!-- source EN p25 unit 280 -->

Tensorspeicher zuweisen, freigeben, synchronisieren und benutzerdefinierten Speicher setzen.

<!-- source EN p25 unit 281 -->

### rknn_create_mem_from_phys

<!-- source EN p25 unit 282 -->

Zur Bereitstellung von NPU-Speicher erstellt rknn_create_mem_from_phys eine rknn_tensor_mem-Struktur und gibt deren Zeiger zurück. Physische und virtuelle Adresse, Größe und Informationen zum externen Speicher werden in die Struktur übernommen.

<!-- source EN p25 unit 283 -->

| API | rknn_create_mem_from_phys |
| --- | --- |
| Beschreibung | Erstellt rknn_tensor_mem und stellt Speicher über eine physische Adresse bereit. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | uint64_t phys_addr: physische Pufferadresse. |
| Parameter | void *virt_addr: virtuelle Pufferadresse, Anfangsadresse des zu fd gehörenden Speichers. |
| Parameter | uint32_t size: Puffergröße. |
| Rückgabe | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |

<!-- source EN p25 unit 284 -->

Codebeispiel:

<!-- source EN p25 unit 285 -->

```c
//suppose we have got buffer information as input_phys, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_phys(ctx, input_phys, input_virt, size);
```

<!-- source EN p25 unit 286 -->

### rknn_create_mem_from_fd

<!-- source EN p25 unit 287 -->

Zur Bereitstellung von NPU-Speicher erstellt rknn_create_mem_from_fd eine rknn_tensor_mem-Struktur und gibt deren Zeiger zurück. Dateideskriptor, logische Adresse, Größe und Informationen zum externen Speicher werden in die Struktur übernommen.

<!-- source EN p26 unit 288 -->

| API | rknn_create_mem_from_fd |
| --- | --- |
| Beschreibung | Erstellt rknn_tensor_mem und stellt Speicher über einen Dateideskriptor bereit. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | int32_t fd: Dateideskriptor des Puffers. |
| Parameter | void *virt_addr: virtuelle Pufferadresse am Beginn von fd. |
| Parameter | uint32_t size: Puffergröße. |
| Parameter | int32_t offset: zum Dateideskriptor und zur virtuellen Adresse gehörender Offset. |
| Rückgabe | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |

<!-- tensor-memory-source-difference:start -->

**Abweichung der Quellen:** Das chinesische PDF auf Seite 25 schreibt den Parameter als `void virt_addr` und setzt `*` ans Ende der Beschreibung; das englische PDF auf Seite 26 verwendet `void *virt_addr`. Die Tabelle bewahrt die jeweilige Quellfassung. Dies ist eine abweichende Typnotation der Quelle, keine validierte API-Deklaration; vor Verwendung mit der Header-Deklaration des tatsächlichen SDK V2.5.0 abgleichen.

<!-- tensor-memory-source-difference:end -->

<!-- source EN p26 unit 289 -->

Codebeispiel:

<!-- source EN p26 unit 290 -->

```c
//suppose we have got buffer information as input_fd, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_fd(ctx, input_fd, input_virt, size, 0);
```

<!-- source EN p26 unit 291 -->

### rknn_create_mem

<!-- source EN p26 unit 292 -->

rknn_create_mem weist die vom Benutzer angegebene Größe direkt von der NPU nutzbaren Speichers zu und gibt eine rknn_tensor_mem-Struktur zurück.

<!-- source EN p26 unit 293 -->

| API | rknn_create_mem |
| --- | --- |
| Beschreibung | Erstellt intern in der Runtime rknn_tensor_mem und weist Speicher zu. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | uint32_t size: Puffergröße. |
| Rückgabe | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |

<!-- source EN p26 unit 294 -->

Codebeispiel:

<!-- source EN p26 unit 295 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem(ctx, size);
```

<!-- source EN p26 unit 296 -->

rknn_create_mem2

<!-- source EN p26 unit 297 -->

rknn_create_mem2 weist direkt von der NPU nutzbaren Speicher mit benutzerdefinierter Größe und Art zu und gibt eine rknn_tensor_mem-Struktur zurück.

<!-- source EN p26 unit 298 -->

| API | rknn_create_mem2 |
| --- | --- |
| Beschreibung | Erstellt intern in der Runtime rknn_tensor_mem und weist Speicher zu. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | uint64_t size: Puffergröße. |
| Parameter | uint64_t alloc_flags: Steuert die Cache-Nutzung. RKNN_FLAG_MEMORY_CACHEABLE: cachefähiger Speicher; RKNN_FLAG_MEMORY_NON_CACHEABLE: nicht cachefähiger Speicher.<br>RKNN_FLAG_MEMORY_FLAGS_DEFAULT entspricht RKNN_FLAG_MEMORY_CACHEABLE.<br>RKNN_FLAG_MEMORY_TRY_ALLOC_SRAM: möglichst SRAM zuweisen; bei zu wenig SRAM den verbleibenden Anteil in DRAM zuweisen. |
| Rückgabe | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |

<!-- source EN p26 unit 299 -->

Der Hauptunterschied zwischen rknn_create_mem2 und rknn_create_mem ist alloc_flags, mit dem sich die Cachefähigkeit festlegen lässt. rknn_create_mem erlaubt diese Auswahl nicht und weist standardmäßig cachefähigen Speicher zu.

<!-- source EN p26 unit 300 -->

Codebeispiel:

<!-- source EN p27 unit 301 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem2(ctx, size, RKNN_FLAG_MEMORY_NON_CACHEABLE);
```

<!-- source EN p27 unit 302 -->

### rknn_destroy_mem

<!-- source EN p27 unit 303 -->

rknn_destroy_mem zerstört die rknn_tensor_mem-Struktur. Vom Benutzer zugewiesener Speicher muss jedoch manuell freigegeben werden.

<!-- source EN p27 unit 304 -->

| API | rknn_destroy_mem |
| --- | --- |
| Beschreibung | Zerstört die rknn_tensor_mem-Struktur. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p27 unit 305 -->

Codebeispiel:

<!-- source EN p27 unit 306 -->

```c
rknn_tensor_mem* input_mems [1];
int ret = rknn_destroy_mem(ctx, input_mems[0]);
```

<!-- source EN p27 unit 307 -->

### rknn_set_weight_mem

<!-- source EN p27 unit 308 -->

Hat der Benutzer Speicher für die Netzwerkgewichte zugewiesen, kann die NPU ihn nach Initialisierung der zugehörigen rknn_tensor_mem über rknn_set_weight_mem nutzen. Der Aufruf muss vor rknn_run erfolgen.

<!-- source EN p27 unit 309 -->

| API | rknn_set_weight_mem |
| --- | --- |
| Beschreibung | Setzt rknn_tensor_mem mit Informationen zum Gewichtsspeicher. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p27 unit 310 -->

Codebeispiel:

<!-- source EN p27 unit 311 -->

```c
rknn_tensor_mem* weight_mems [1];
int ret = rknn_set_weight_mem(ctx, weight_mems[0]);
```

<!-- source EN p27 unit 312 -->

### rknn_set_internal_mem

<!-- source EN p27 unit 313 -->

Hat der Benutzer Speicher für interne Netzwerktensoren zugewiesen, kann die NPU ihn nach Initialisierung der zugehörigen rknn_tensor_mem über rknn_set_internal_mem nutzen. Der Aufruf muss vor rknn_run erfolgen.

<!-- source EN p27 unit 314 -->

| API | rknn_set_internal_mem |
| --- | --- |
| Beschreibung | Setzt rknn_tensor_mem mit Informationen zum Speicher interner Netzwerktensoren. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p27 unit 315 -->

Codebeispiel:

<!-- source EN p27 unit 316 -->

```c
rknn_tensor_mem* internal_tensor_mems [1];
int ret = rknn_set_internal_mem(ctx, internal_tensor_mems[0]);
```

<!-- source EN p28 unit 317 -->

### rknn_set_io_mem

<!-- source EN p28 unit 318 -->

Nach Zuweisung des Ein-/Ausgabetensorspeichers und Initialisierung von rknn_tensor_mem stellt rknn_set_io_mem ihn der NPU bereit. Die Zero-Copy-Schnittstelle muss vor rknn_run aufgerufen werden. Speicher kann intern über rknn_create_mem oder extern über rknn_create_mem_from_fd/rknn_create_mem_from_phys entstehen. Wie rknn_init genügt ein anfänglicher Aufruf von rknn_set_io_mem, anschließend kann rknn_run wiederholt werden.

<!-- source EN p28 unit 319 -->

| API | rknn_set_io_mem |
| --- | --- |
| Beschreibung | Setzt rknn_tensor_mem mit Informationen zum Speicher der Ein-/Ausgabetensoren des Netzwerks. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | rknn_tensor_mem*: Zeiger auf die Tensorspeicher-Informationsstruktur. |
| Parameter | rknn_tensor_attr *: Attribute des Ein- oder Ausgabetensorpuffers. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p28 unit 320 -->

Anwendungshinweise:

<!-- source EN p28 unit 321 -->

1. rknn_tensor_attr über rknn_query ermitteln. Bei Zero-Copy RKNN_QUERY_NATIVE_INPUT_ATTR/RKNN_QUERY_NATIVE_OUTPUT_ATTR statt RKNN_QUERY_INPUT_ATTR/RKNN_QUERY_OUTPUT_ATTR verwenden, um das effizienteste NPU-Layout und den Datentyp zu erhalten.

<!-- source EN p28 unit 322 -->

2. Bei unverändertem Typ und Layout nach size_with_stride zuweisen. Nach Änderungen die neue Größe verwenden: Eine Ausgabeumstellung von int8 auf float32 erfordert beispielsweise die vierfache Größe, n_elems * sizeof(float).

<!-- source EN p28 unit 323 -->

3. Eingabedaten entsprechend dem abgefragten oder geänderten Layout anordnen, etwa NHWC. Bei pass_through=1 kann eine Breitenausrichtung nach w_stride erforderlich sein.

<!-- source EN p28 unit 324 -->

4. Nach der Inferenz Ausgabespeicherinformationen aus rknn_tensor_mem lesen. Bei externem Speicher außerdem den Cache über die zum Speichertyp gehörige Schnittstelle leeren.

<!-- source EN p28 unit 325 -->

Codebeispiel:

<!-- source EN p29 unit 326 -->

```c
// Zero-copy API: query native attributes -> modify type/layout -> allocate memory -> set input/output memory
rknn_tensor_attr input_attrs[1], output_attrs[1];
rknn_tensor_mem* input_mems[1];
rknn_tensor_mem* output_mems[1];

memset(input_attrs, 0, sizeof(input_attrs));
input_attrs[0].index = 0;
rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[0]), sizeof(rknn_tensor_attr));
// The default input type is int8 (normalize and quantize need to be computed outside);
// if uint8 is set, normalize and quantize will be fused into the NPU
input_attrs[0].type = RKNN_TENSOR_UINT8;
// The default fmt is NHWC, and the NPU only supports NHWC input in zero-copy mode
input_attrs[0].fmt = RKNN_TENSOR_NHWC;
input_mems[0] = rknn_create_mem(ctx, input_attrs[0].size_with_stride);
// Copy input data to input_mems[0]->virt_addr ...

memset(output_attrs, 0, sizeof(output_attrs));
output_attrs[0].index = 0;
rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR, &(output_attrs[0]), sizeof(rknn_tensor_attr));
// The default output type depends on the model; float32 is required here to compute top5
output_attrs[0].type = RKNN_TENSOR_FLOAT32;
output_mems[0] = rknn_create_mem(ctx, output_attrs[0].n_elems * sizeof(float));

// Set input/output memory
ret = rknn_set_io_mem(ctx, input_mems[0], &input_attrs[0]);
ret = rknn_set_io_mem(ctx, output_mems[0], &output_attrs[0]);

// Run inference
ret = rknn_run(ctx, NULL);
// Read the output result from output_mems[0]->virt_addr ...
```

<!-- source EN p29 unit 327 -->

### rknn_mem_sync

<!-- source EN p29 unit 328 -->

Von rknn_create_mem erzeugter Speicher ist standardmäßig cachefähig. Bei gleichzeitiger Nutzung durch CPU und NPU kann das Cacheverhalten zu inkonsistenten Daten führen. Diese Schnittstelle synchronisiert cachefähigen Speicher, damit CPU und NPU konsistente Daten sehen.

<!-- source EN p29 unit 329 -->

| API | rknn_mem_sync |
| --- | --- |
| Beschreibung | Synchronisiert CPU-Cache- und DDR-Daten. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | rknn_tensor_mem* mem: Zeiger auf die Tensorspeicher-Informationsstruktur. |
| Parameter | rknn_mem_sync_mode mode: Aktualisierungsmodus für CPU-Cache und DDR. RKNN_MEMORY_SYNC_TO_DEVICE — schreibt CPU-Cache-Daten in DDR zurück, üblicherweise nach CPU-Schreiben und vor NPU-Zugriff auf denselben Speicher. RKNN_MEMORY_SYNC_FROM_DEVICE — synchronisiert DDR mit dem CPU-Cache, üblicherweise nach NPU-Schreiben: invalidiert den Cache, damit die CPU beim nächsten Zugriff DDR neu liest. RKNN_MEMORY_SYNC_BIDIRECTIONAL — schreibt CPU-Cache-Daten in DDR zurück und lässt die CPU DDR neu lesen. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p29 unit 330 -->

Codebeispiel:

<!-- source EN p29 unit 331 -->

```c
ret =rknn_mem_sync(ctx, &outputs[0].mem,
RKNN_MEMORY_SYNC_FROM_DEVICE);
if (ret < 0) {
   fprintf(stderr, " rknn_mem_sync error! ret=%d\n", ret);
   return -1;
}
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
