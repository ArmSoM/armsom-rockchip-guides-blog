---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Gerät, Kontext und Initialisierungsflags"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-device-context"
slug: "rknn-v250-runtime-api-device-context"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Gerät, Kontext und Initialisierungsflags | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Gerät, Kontext und Initialisierungsflags | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-device-context/"
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

<!-- source EN p13 unit 88 -->

## 5. Funktionsreferenz

<!-- source EN p13 unit 89 -->

API-Funktionen

<!-- source EN p13 unit 90 -->

Funktionale Einteilung der RKNN-C-API:

<!-- source EN p13 unit 91 -->

| Kategorie | Beschreibung |
| --- | --- |
| 5.1. Gerät und Kontext | Laufzeitkontext initialisieren und auflösen; NPU-Kerne konfigurieren. |
| 5.2. Abfragen | Modellattribute, SDK-Version, Speicherbedarf und weitere Informationen abfragen. |
| 5.3. Inferenz ausführen | Eingaben setzen, Inferenz ausführen, Ausgaben abrufen und dynamische Formen einstellen. |
| 5.4. Tensoren und Speicher | Tensorspeicher zuweisen, freigeben, synchronisieren und benutzerdefinierten Speicher setzen. |
| 5.5. Matrixmultiplikation | Matrixmultiplikationskontext erstellen, Speicher und Quantisierungsparameter setzen, ausführen. |
| 5.6. Benutzerdefinierte Operatoren | Benutzerdefinierte Operatoren registrieren und Operatorattribute abrufen. |

<!-- source EN p13 unit 92 -->

### 5.1. Gerät und Kontext

<!-- source EN p13 unit 93 -->

Laufzeitkontext initialisieren und auflösen; NPU-Kerne konfigurieren.

<!-- source EN p13 unit 94 -->

### rknn_init

<!-- source EN p13 unit 95 -->

Die Initialisierungsfunktion rknn_init erstellt ein rknn_context-Objekt, lädt das RKNN-Modell und führt die durch Flags und rknn_init_extend festgelegte Initialisierung aus.

<!-- source EN p13 unit 96 -->

| API | rknn_init |
| --- | --- |
| Beschreibung | Initialisiert den rknn-Kontext. |
| Parameter | rknn_context *context: Zeiger auf das rknn_context-Objekt. |
| Parameter | void *model: Binärdaten des RKNN-Modells oder dessen Pfad. Bei size>0 Binärdaten, bei size=0 Modellpfad. |
| Parameter | uint32_t size: Größe des als Binärdaten übergebenen Modells; 0, wenn model einen Pfad enthält. |
| Parameter | uint32_t flag: Initialisierungsflag; für das Standardverhalten auf 0 setzen. |
| Parameter | rknn_init_extend: erweiterte Informationen für besondere Initialisierung. Die Quelle nennt diese deaktiviert und fordert NULL, verlangt beim Teilen von Gewichten jedoch einen Zeiger auf einen anderen rknn_context für ein anderes Modell. Beide Aussagen bleiben erhalten. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p13 unit 97 -->

Codebeispiel:

<!-- source EN p13 unit 98 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
```

<!-- source EN p13 unit 99 -->

Die Initialisierungsflags werden nachfolgend erläutert:

<!-- source EN p13 unit 100 -->

RKNN_FLAG_PRIOR_HIGH: Hohe Kontextpriorität setzen.

<!-- source EN p13 unit 101 -->

RKNN_FLAG_PRIOR_MEDIUM: Mittlere Kontextpriorität setzen.

<!-- source EN p13 unit 102 -->

RKNN_FLAG_PRIOR_LOW: Niedrige Kontextpriorität setzen.

<!-- source EN p13 unit 103 -->

RKNN_FLAG_ASYNC_MASK: Asynchroner Modus. rknn_outputs_get liefert ohne langes Blockieren das Ergebnis des vorherigen Frames; dies kann die Bildrate bei einem Thread erhöhen, liefert aber nicht das aktuelle Frame-Ergebnis. Bei mehreren Threads ist dieser Modus nicht erforderlich.

<!-- source EN p13 unit 104 -->

RKNN_FLAG_COLLECT_PERF_MASK: ermöglicht die Abfrage der Laufzeit jeder Netzwerkschicht.

<!-- source EN p14 unit 105 -->

RKNN_FLAG_MEM_ALLOC_OUTSIDE: kennzeichnet, dass der Benutzer den Speicher für Modelleingaben, Ausgaben, Gewichte und Zwischentensoren vollständig selbst zuweist. Dies hat zwei Hauptzwecke:

<!-- source EN p14 unit 106 -->

1) Der Benutzer weist den gesamten Speicher zu, was die systemweite Speicherplanung erleichtert.

<!-- source EN p14 unit 107 -->

2) Zur Wiederverwendung von Speicher, besonders bei sehr knappem Speicher auf RV1106/RV1103/RV1106B/RV1103B/RK2118.

<!-- source EN p14 unit 108 -->

Angenommen, die Modelle A und B werden nacheinander ausgeführt. Dann lässt sich der Speicher ihrer Zwischentensoren wiederverwenden. Beispielcode:

<!-- source EN p14 unit 109 -->

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

<!-- source EN p14 unit 110 -->

RKNN_FLAG_SHARE_WEIGHT_MEM: dient zur gemeinsamen Nutzung der Gewichte eines anderen Modells. Hauptzweck ist die Nachbildung variabler Eingabelängen; ab RKNPU Runtime 1.5.0 wird diese Funktion durch dynamische Formen ersetzt. Beispielsweise haben manche Sprachmodelle variable Eingabelängen, die NPU unterstützt diese jedoch nicht unmittelbar. Daher werden mehrere RKNN-Modelle unterschiedlicher Auflösung erzeugt. Nur eines enthält vollständige Gewichte, die anderen keine. Bei Initialisierung eines Modells ohne Gewichte erlaubt dieses Flag dem aktuellen Kontext, die Gewichte des vollständigen Modells mitzunutzen. Für zwei Modelle mit Auflösung A und B gilt folgender Ablauf:

<!-- source EN p14 unit 111 -->

1) Mit RKNN-Toolkit2 ein Modell mit Auflösung A erzeugen.

<!-- source EN p14 unit 112 -->

2) Ein Modell mit Auflösung B ohne Gewichte erzeugen: remove_weight in rknn.config() auf True setzen, um Modell B zu verkleinern.

<!-- source EN p14 unit 113 -->

3) Modell A auf dem Board normal initialisieren.

<!-- source EN p14 unit 114 -->

4) Modell B mit RKNN_FLAG_SHARE_WEIGHT_MEM initialisieren.

<!-- source EN p14 unit 115 -->

5) Weitere Schritte unverändert ausführen. Board-Codebeispiel:

<!-- source EN p14 unit 116 -->

```c
rknn_context ctx_a, ctx_b;
rknn_init(&ctx_a, model_path_a, 0, 0, NULL);

rknn_init_extend extend;
extend.ctx = ctx_a;
rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_SHARE_WEIGHT_MEM, &extend);
```

<!-- source EN p14 unit 117 -->

RKNN_FLAG_FENCE_IN_OUTSIDE: Fence-fd von außen übergeben.

<!-- source EN p14 unit 118 -->

RKNN_FLAG_FENCE_OUT_OUTSIDE: Internen Fence-fd abrufen.

<!-- source EN p14 unit 119 -->

RKNN_FLAG_COLLECT_MODEL_INFO_ONLY: initialisiert einen leeren Kontext. Darin lässt sich nur rknn_query zur Abfrage der Gesamtgrößen des Gewichtsspeichers und der Zwischentensoren aufrufen; Inferenz ist nicht möglich.

<!-- source EN p14 unit 120 -->

RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE: Der Benutzer weist die Zwischentensoren des Modells zu. Dies wird häufig zur eigenen Verwaltung und Wiederverwendung des Zwischentensorspeichers mehrerer Modelle genutzt.

<!-- source EN p15 unit 121 -->

RKNN_FLAG_EXECUTE_FALLBACK_PRIOR_DEVICE_GPU: Alle von der NPU nicht unterstützten Schichten sollen bevorzugt auf der GPU laufen, ohne Garantie. Das tatsächliche Ausführungsgerät hängt von der Operatorunterstützung der Runtime ab.

<!-- source EN p15 unit 122 -->

RKNN_FLAG_ENABLE_SRAM: Zwischentensorspeicher wird nach Möglichkeit im SRAM zugewiesen.

<!-- source EN p15 unit 123 -->

RKNN_FLAG_SHARE_SRAM: Der aktuelle Kontext versucht, den SRAM-Adressraum eines anderen Kontexts mitzunutzen. Bei seiner Initialisierung muss RKNN_FLAG_ENABLE_SRAM aktiviert sein.

<!-- source EN p15 unit 124 -->

RKNN_FLAG_DISABLE_PROC_HIGH_PRIORITY: Der aktuelle Kontext verwendet die Standardprozesspriorität. Ohne dieses Flag beträgt der nice-Wert des Prozesses -19.

<!-- source EN p15 unit 125 -->

RKNN_FLAG_DISABLE_FLUSH_INPUT_MEM_CACHE: Die Runtime schreibt den Eingabetensor-Cache nicht zurück; der Benutzer muss dies vor rknn_run sicherstellen.

<!-- source EN p15 unit 126 -->

RKNN_FLAG_DISABLE_FLUSH_OUTPUT_MEM_CACHE: Die Runtime bereinigt den Ausgabetensor-Cache nicht aktiv. Direkter Benutzerzugriff auf output_mem->virt_addr kann dann Cache-Konsistenzprobleme verursachen. Vor der Nutzung von output_mem->virt_addr ist der Cache mit rknn_mem_sync(ctx, mem, RKNN_MEMORY_SYNC_FROM_DEVICE) zu aktualisieren. Das Flag wird typischerweise eingesetzt, wenn nicht die CPU, sondern etwa GPU oder RGA die NPU-Ausgabe liest.

<!-- source EN p15 unit 127 -->

RKNN_FLAG_MODEL_BUFFER_ZERO_COPY: Der an rknn_init übergebene Modellpuffer wurde durch rknn_create_mem oder rknn_create_mem2 zugewiesen. Die Runtime erstellt keine zusätzliche Pufferkopie und benötigt dadurch weniger Speicher. Der Benutzer muss den Modellspeicher bis zur Zerstörung des Kontexts gültig halten und danach freigeben. Bei der Initialisierung werden real_model_offset, real_model_size, model_buffer_fd und model_buffer_flags des Parameters rknn_init_extend von rknn_init anhand des von rknn_create_mem2 zurückgegebenen rknn_tensor_mem gesetzt.

<!-- source EN p15 unit 128 -->

RKNN_MEM_FLAG_ALLOC_NO_CONTEXT: erlaubt bei Speicherzuweisung über rknn_create_mem2 einen ctx-Wert von 0 oder NULL. So lässt sich vom NPU-Treiber zugewiesener Speicher bereits vor der Initialisierung eines Kontexts erhalten. Die zurückgegebene Speicherstruktur muss über rknn_destroy_mem freigegeben werden; dabei kann ein beliebiger Kontext übergeben werden. Beispielcode:

<!-- source EN p15 unit 129 -->

```c
  rknn_tensor_mem* model_mem = rknn_create_mem2(ctx, model_size, RKNN_MEM_FLAG_ALLOC_NO_CONTEXT);
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

<!-- source EN p15 unit 130 -->

### rknn_set_core_mask

<!-- source EN p15 unit 131 -->

Die Funktion legt die auszuführenden NPU-Kerne fest. Im beschriebenen Stand funktioniert sie nur auf RK3588 und RK3576. Bei einer Plattform mit einkerniger NPU wird ein Fehlercode zurückgegeben.

<!-- source EN p15 unit 132 -->

| API | rknn_set_core_mask |
| --- | --- |
| Beschreibung | Legt die NPU-Kerne fest. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | rknn_core_mask core_mask: Auswahl der NPU-Kerne. RKNN_NPU_CORE_AUTO — automatische Auswahl eines freien Kerns; RKNN_NPU_CORE_0 — NPU0; RKNN_NPU_CORE_1 — NPU1; RKNN_NPU_CORE_2 — NPU2; RKNN_NPU_CORE_0_1 — NPU0 und NPU1 gleichzeitig; RKNN_NPU_CORE_0_1_2 — NPU0, NPU1 und NPU2 gleichzeitig; RKNN_NPU_CORE_ALL — alle NPU-Kerne der Plattform. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p16 unit 134 -->

```c
rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

<!-- source EN p16 unit 135 -->

In den Mehrkernmodi RKNN_NPU_CORE_0_1 und RKNN_NPU_CORE_0_1_2 profitieren Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu, Prelu und LeakyRelu von besserer Beschleunigung. Andere Operatoren laufen weiter auf Core0. Die Quelle kündigt Pool und ConvTranpose für spätere Updates an; dies ist keine Bestätigung ihrer aktuellen Implementierung.

<!-- source EN p16 unit 136 -->

### rknn_set_batch_core_num

<!-- source EN p16 unit 137 -->

rknn_set_batch_core_num legt die Anzahl der NPU-Kerne für ein Multi-Batch-RKNN-Modell fest, das in RKNN-Toolkit2 mit rknn_batch_size größer als 1 exportiert wurde. Unterstützt werden nur RK3588 und RK3576.

<!-- source EN p16 unit 138 -->

| API | rknn_set_batch_core_num |
| --- | --- |
| Beschreibung | Legt die NPU-Kernanzahl für ein Multi-Batch-RKNN-Modell fest. |
| Parameter | rknn_context context: rknn_context-Objekt. |
| Parameter | int core_num: Anzahl der auszuführenden Kerne. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p16 unit 139 -->

Codebeispiel:

<!-- source EN p16 unit 140 -->

```c
rknn_context ctx;
int ret = rknn_set_batch_core_num(ctx, 2);
```

<!-- source EN p16 unit 141 -->

### rknn_dup_context

<!-- source EN p16 unit 142 -->

rknn_dup_context erstellt einen neuen Kontext für dasselbe Modell. Dies ermöglicht die Wiederverwendung der Modellgewichte bei Ausführung desselben Modells in mehreren Threads. Auf RV1106/RV1103/RV1106B/RV1103B/RK2118 nicht verfügbar.

<!-- source EN p16 unit 143 -->

| API | rknn_dup_context |
| --- | --- |
| Beschreibung | Erstellt einen neuen Kontext desselben Modells zur Wiederverwendung der Gewichte. |
| Parameter | rknn_context *context_in: Zeiger auf ein rknn_context-Objekt. Laut Quelle wird der Eingabekontext nach dem Aufruf initialisiert. |
| Parameter | rknn_context *context_out: Zeiger auf ein rknn_context-Ausgabeobjekt mit den zurückgegebenen Informationen über das neu erstellte Objekt. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p16 unit 144 -->

Codebeispiel:

<!-- source EN p17 unit 145 -->

```c
rknn_context ctx_in;
rknn_context ctx_out;
int ret = rknn_dup_context(&ctx_in, &ctx_out);
```

<!-- source EN p17 unit 146 -->

### rknn_destroy

<!-- source EN p17 unit 147 -->

Diese Funktion gibt rknn_context und zugehörige Ressourcen frei.

<!-- source EN p17 unit 148 -->

| API | rknn_destroy |
| --- | --- |
| Beschreibung | Zerstört rknn_context und zugehörige Ressourcen. |
| Parameter | rknn_context context: zu zerstörendes rknn_context-Objekt. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p17 unit 149 -->

Codebeispiel:

<!-- source EN p17 unit 150 -->

```c
rknn_context ctx;
int ret = rknn_destroy(ctx);
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
