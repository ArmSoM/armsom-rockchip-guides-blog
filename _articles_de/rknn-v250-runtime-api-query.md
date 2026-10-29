---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Modell-, Tensor- und dynamische Formabfragen"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-runtime-api-query"
slug: "rknn-v250-runtime-api-query"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Modell-, Tensor- und dynamische Formabfragen | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN Runtime C API V2.5.0 — Modell-, Tensor- und dynamische Formabfragen | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-runtime-api-query/"
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

<!-- source EN p17 unit 151 -->

### 5.2. Abfragen

<!-- source EN p17 unit 152 -->

Modellattribute, SDK-Version, Speicherbedarf und weitere Informationen abfragen.

<!-- source EN p17 unit 153 -->

### rknn_query

<!-- source EN p17 unit 154 -->

rknn_query fragt Modell- und SDK-Informationen ab: Ein- und Ausgaben, schichtweise Laufzeiten, gesamte Inferenzzeit, SDK-Version, Speicherverbrauch, benutzerdefinierte Zeichenfolgen und weitere Informationen.

<!-- source EN p17 unit 155 -->

| API | rknn_query |
| --- | --- |
| Beschreibung | Fragt Modell- und SDK-Informationen ab. |
| Parameter | rknn_context context: rknn_contex-Objekt (Quellschreibweise). |
| Parameter | rknn_query_cmd: Abfragebefehl. |
| Parameter | void* info: Strukturobjekt für das Abfrageergebnis. |
| Parameter | uint32_t size: Größe des info-Strukturobjekts. |
| Rückgabe | int: Fehlercode (siehe Statuscodes). |

<!-- source EN p17 unit 156 -->

Im beschriebenen Stand unterstützt das SDK folgende Abfragebefehle:

<!-- source EN p17 unit 157 -->

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

<!-- source EN p18 unit 158 -->

<!-- source EN p18 unit 159 -->

| Abfragebefehl | Ergebnisstruktur | Funktion |
| --- | --- | --- |
| RKNN_QUERY_NATIVE_INPUT_ATTR | rknn_tensor_attr | Bei Zero-Copy native Eingabetensorattribute abfragen, die die NPU unmittelbar liest. |
| RKNN_QUERY_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | Bei Zero-Copy native Ausgabetensorattribute unmittelbar von der NPU abfragen. |
| RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | rknn_tensor_attr | Bei Zero-Copy native Eingabetensorattribute abfragen. Entspricht RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | rknn_tensor_attr | Bei Zero-Copy native Ausgabetensorattribute abfragen; das Original bezeichnet diese als von der NPU gelesene Eingabeattribute. Entspricht RKNN_QUERY_NATIVE_OUTPUT_ATTR. |
| RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | rknn_tensor_attr | Bei Zero-Copy native Eingabetensorattribute abfragen. Laut Original identisch mit RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | rknn_tensor_attr | Bei Zero-Copy native NHWC-Ausgabeattribute abfragen; das Original bezeichnet sie als von der NPU gelesene Eingabeattribute. |
| RKNN_QUERY_DEVICE_MEM_INFO | rknn_tensor_mem | Speicherattribute des Modellpuffers abfragen. |
| RKNN_QUERY_INPUT_DYNAMIC_RANGE | rknn_input_range | Für dynamische Modelle Anzahl und Liste der Formen, Datenlayout und zugehörige Eingabenamen abfragen. |
| RKNN_QUERY_CURRENT_INPUT_ATTR | rknn_tensor_attr | Aktuelle Eingabeattribute einer dynamischen Modellinferenz abfragen. |
| RKNN_QUERY_CURRENT_OUTPUT_ATTR | rknn_tensor_attr | Aktuelle Ausgabeattribute einer dynamischen Modellinferenz abfragen. |
| RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | rknn_tensor_attr | Aktuelle native NPU-Eingabeattribute einer dynamischen Modellinferenz abfragen. |
| RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | Aktuelle native NPU-Ausgabeattribute einer dynamischen Modellinferenz abfragen. |

<!-- source EN p18 unit 171 -->

Nachfolgend wird jeder Abfragebefehl erläutert.

<!-- source EN p18 unit 172 -->

#### 1. SDK-Version abfragen

<!-- source EN p18 unit 173 -->

RKNN_QUERY_SDK_VERSION fragt die Version des RKNN SDK ab. Zunächst ist ein Objekt der Struktur rknn_sdk_version zu erstellen.

<!-- source EN p18 unit 174 -->

Codebeispiel:

<!-- source EN p18 unit 175 -->

```c
rknn_sdk_version version;
ret = rknn_query(ctx, RKNN_QUERY_SDK_VERSION, &version,
             sizeof(rknn_sdk_version));
printf("sdk api version: %s\n", version.api_version);
printf("driver version: %s\n", version.drv_version);
```

<!-- source EN p18 unit 176 -->

#### 2. Anzahl der Ein- und Ausgabetensoren abfragen

<!-- source EN p19 unit 177 -->

RKNN_QUERY_IN_OUT_NUM fragt die Anzahl der Ein- und Ausgabetensoren des Modells ab. Zunächst ein Objekt der Struktur rknn_input_output_num erstellen.

<!-- source EN p19 unit 178 -->

Codebeispiel:

<!-- source EN p19 unit 179 -->

```c
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num, sizeof(io_num));
printf("model input num: %d, output num: %d\n", io_num.n_input, io_num.n_output);
```

<!-- source EN p19 unit 180 -->

#### 3. Eingabetensorattribute abfragen (allgemeine API)

<!-- source EN p19 unit 181 -->

RKNN_QUERY_INPUT_ATTR fragt Eingabetensorattribute ab. Zuerst rknn_tensor_attr erzeugen. Hinweis: Auf RV1106/RV1103/RV1106B/RV1103B/RK2118 wird der ursprünglich nativ eingegebene Tensor abgefragt.

<!-- source EN p19 unit 182 -->

Codebeispiel:

<!-- source EN p19 unit 183 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p19 unit 184 -->

#### 4. Ausgabetensorattribute abfragen (allgemeine API)

<!-- source EN p19 unit 185 -->

RKNN_QUERY_OUTPUT_ATTR fragt die Attribute des Modellausgabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source EN p19 unit 186 -->

Codebeispiel:

<!-- source EN p19 unit 187 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR, &(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p19 unit 188 -->

#### 5. Schichtweise Inferenzzeit des Modells abfragen

<!-- source EN p19 unit 189 -->

Nach rknn_run fragt RKNN_QUERY_PERF_DETAIL die schichtweise Inferenzzeit in Mikrosekunden ab. Voraussetzung ist RKNN_FLAG_COLLECT_PERF_MASK im Parameter flag von rknn_init.

<!-- source EN p19 unit 190 -->

Codebeispiel:

<!-- source EN p19 unit 191 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_COLLECT_PERF_MASK, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_detail perf_detail;
ret = rknn_query(ctx, RKNN_QUERY_PERF_DETAIL, &perf_detail, sizeof(perf_detail));
```

<!-- source EN p19 unit 192 -->

#### 6. Gesamte Inferenzzeit des Modells abfragen

<!-- source EN p19 unit 193 -->

Nach rknn_run fragt RKNN_QUERY_PERF_RUN die Modellinferenzzeit in Mikrosekunden ohne das Setzen der Ein- und Ausgaben ab.

<!-- source EN p19 unit 194 -->

Codebeispiel:

<!-- source EN p20 unit 195 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_run perf_run;
ret = rknn_query(ctx, RKNN_QUERY_PERF_RUN, &perf_run, sizeof(perf_run));
```

<!-- source EN p20 unit 196 -->

#### 7. Speicherzuweisung des Modells abfragen

<!-- source EN p20 unit 197 -->

Nach rknn_init kann RKNN_QUERY_MEM_SIZE bei eigener Speicherzuweisung durch den Benutzer den Gewichtsspeicher und internen Netzwerkspeicher ohne Ein- und Ausgaben abfragen. Dazu muss der Parameter flag von rknn_init RKNN_FLAG_MEM_ALLOC_OUTSIDE enthalten.

<!-- source EN p20 unit 198 -->

Codebeispiel:

<!-- source EN p20 unit 199 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_MEM_ALLOC_OUTSIDE , NULL);
rknn_mem_size mem_size;
ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size, sizeof(mem_size));
```

<!-- source EN p20 unit 200 -->

#### 8. Benutzerdefinierte Modellzeichenfolge abfragen

<!-- source EN p20 unit 201 -->

Nach rknn_init ruft RKNN_QUERY_CUSTOM_STRING eine bei der RKNN-Modellerzeugung hinzugefügte benutzerdefinierte Zeichenfolge ab. Beispielsweise kann “RGB” bei der Konvertierung kennzeichnen, dass die Eingabe ein dreikanaliges RGB- statt BGR-Bild ist. Zur Laufzeit werden die Daten anhand der abgefragten Information “RGB” in ein RGB-Bild konvertiert.

<!-- source EN p20 unit 202 -->

Codebeispiel:

<!-- source EN p20 unit 203 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
rknn_custom_string custom_string;
ret = rknn_query(ctx, RKNN_QUERY_CUSTOM_STRING, &custom_string, sizeof(custom_string));
```

<!-- source EN p20 unit 204 -->

#### 9. Native Eingabetensorattribute abfragen (Zero-Copy-API)

<!-- source EN p20 unit 205 -->

RKNN_QUERY_NATIVE_INPUT_ATTR, gleichbedeutend mit RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR, fragt native Attribute des Modelleingabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source EN p20 unit 206 -->

Codebeispiel:

<!-- source EN p20 unit 207 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source EN p20 unit 208 -->

#### 9. Native Ausgabeattribute abfragen (Zero-Copy-API)

<!-- source EN p20 unit 209 -->

RKNN_QUERY_NATIVE_OUTPUT_ATTR, gleichbedeutend mit RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR, fragt native Attribute des Modellausgabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source EN p20 unit 210 -->

Codebeispiel:

<!-- source EN p21 unit 211 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p21 unit 212 -->

#### 10. Native Eingabeattribute abfragen (Zero-Copy-API)

<!-- source EN p21 unit 213 -->

RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR fragt NHWC-Attribute des Modelleingabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source EN p21 unit 214 -->

Codebeispiel:

<!-- source EN p21 unit 215 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR,
&(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p21 unit 216 -->

#### 11. Native Ausgabetensorattribute abfragen (Quellüberschrift; der folgende Text betrifft die Eingabe, Zero-Copy-API)

<!-- source EN p21 unit 217 -->

RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR fragt NHWC-Attribute des Modellausgabetensors ab. Zunächst ein Objekt der Struktur rknn_tensor_attr erstellen.

<!-- source EN p21 unit 218 -->

Codebeispiel:

<!-- source EN p21 unit 219 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p21 unit 220 -->

#### 12. Modellpufferspeicher abfragen (Hinweis: RV1106/RV1103/RV1106B/RV1103B/RK2118 unterstützen diese Schnittstelle)

<!-- source EN p21 unit 222 -->

Nach rknn_init fragt RKNN_QUERY_DEVICE_MEM_INFO Attribute des intern in der Runtime erstellten Modellpuffers ab, einschließlich fd und physischer Adresse.

<!-- source EN p21 unit 223 -->

```c
rknn_tensor_mem mem_info;
memset(&mem_info, 0, sizeof(mem_info));
ret = rknn_query(ctx, RKNN_QUERY_DEVICE_MEM_INFO, &mem_info, sizeof(mem_info));
```

<!-- source EN p21 unit 224 -->

#### 13. Vom RKNN-Modell unterstützte dynamische Eingabeformen abfragen

<!-- source EN p21 unit 225 -->

Hinweis: RV1106/RV1103/RV1106B/RV1103B/RK2118 unterstützen diese Schnittstelle nicht.

<!-- source EN p21 unit 226 -->

Nach rknn_init mit RKNN_QUERY_INPUT_DYNAMIC_RANGE die unterstützten Eingabeformen abfragen, einschließlich Anzahl, Liste, Layout, Namen und weiterer Angaben. Zunächst ein Objekt der Struktur rknn_input_range erstellen.

<!-- source EN p21 unit 227 -->

Beispielcode:

<!-- source EN p22 unit 228 -->

```c
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input * sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   dyn_range[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE, &dyn_range[i],
sizeof(rknn_input_range));
}
```

<!-- source EN p22 unit 229 -->

#### 14. Aktuelle dynamische Form der Eingabe des RKNN-Modells abfragen

<!-- source EN p22 unit 230 -->

Nach rknn_set_input_shapes mit RKNN_QUERY_CURRENT_INPUT_ATTR die aktuellen Attribute der Eingabe abfragen. Zuerst rknn_tensor_attr erzeugen. RV1106/RV1103/RV1103B/RV1106B/RK2118 unterstützen diesen Befehl nicht.

<!-- source EN p22 unit 231 -->

Beispielcode:

<!-- source EN p22 unit 232 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   cur_input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR, &(cur_input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source EN p22 unit 233 -->

#### 15. Aktuelle dynamische Form der Ausgabe des RKNN-Modells abfragen

<!-- source EN p22 unit 234 -->

Nach rknn_set_input_shapes mit RKNN_QUERY_CURRENT_OUTPUT_ATTR die aktuellen Attribute der Ausgabe abfragen. Zuerst rknn_tensor_attr erzeugen. RV1106/RV1103/RV1103B/RV1106B/RK2118 unterstützen diesen Befehl nicht.

<!-- source EN p22 unit 235 -->

Beispielcode:

<!-- source EN p22 unit 236 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
   cur_output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source EN p22 unit 237 -->

#### 16. Aktuelle dynamische Form der nativen Eingabe des RKNN-Modells abfragen

<!-- source EN p22 unit 238 -->

Nach rknn_set_input_shapes mit RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR die aktuellen Attribute der nativen Eingabe abfragen. Zuerst rknn_tensor_attr erzeugen. RV1106/RV1103/RV1103B/RV1106B/RK2118 unterstützen diesen Befehl nicht.

<!-- source EN p22 unit 239 -->

Beispielcode:

<!-- source EN p22 unit 240 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   cur_input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p22 unit 241 -->

#### 17. Aktuelle dynamische Form der nativen Ausgabe des RKNN-Modells abfragen

<!-- source EN p22 unit 242 -->

Nach rknn_set_input_shapes mit RKNN_QUERY_CURRENT_OUTPUT_ATTR die aktuellen Attribute der nativen Ausgabe abfragen. Zuerst rknn_tensor_attr erzeugen. RV1106/RV1103/RV1103B/RV1106B/RK2118 unterstützen diesen Befehl nicht.

<!-- source EN p22 unit 243 -->

Beispielcode:

<!-- source EN p23 unit 244 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
   cur_output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Hinweise zur Quelle: Kapitelnummern und Beispielausgaben bleiben erhalten; ältere SDK-Versionen in Protokollen sind nicht die aktuelle Dokumentversion. Die Runtime-Quelle springt von Kapitel 3 zu 5 und wiederholt Abfragenummern. Die rknn_init-Tabelle bezeichnet extend als deaktiviert, spätere Typen beschreiben jedoch user_key und gemeinsame Gewichte. Der Text zur nativen dynamischen Ausgabe nennt RKNN_QUERY_CURRENT_OUTPUT_ATTR, das Beispiel RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Einige native NHWC/NC1HWC2-Beschreibungen verwechseln Ein- und Ausgabe. Mit tatsächlichen V2.5.0-Headern und Ziel-SDK abgleichen; das Verhalten wurde nicht getestet. Der RK2118-Verweis heißt im Original RKNN3_RK2118_Quick_Start.pdf, im aktuellen Verzeichnis liegt eine RKNN2-Kurzanleitung.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
