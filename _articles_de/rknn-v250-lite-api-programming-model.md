---
title: "RKNN Toolkit Lite2 V2.5.0, Teil 2: Lebenszyklus, Eingaben und Ausgabewiederverwendung"
description: "RKNN Toolkit Lite2 V2.5.0, Teil 2: Lebenszyklus, Eingaben und Ausgabewiederverwendung · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, Teil 2: Lebenszyklus, Eingaben und Ausgabewiederverwendung"
translation_key: "rknn-v250-lite-api-programming-model"
slug: "rknn-v250-lite-api-programming-model"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Plattformreferenz für RKNN Toolkit Lite2 V2.5.0, Debian 10/11/12 aarch64 und die genannten SoCs. Auf ArmSoM SoC, Architektur, Python-Wheel, BSP-NPU-Treiber und Runtime abgleichen. Keine Hardwaretests durchgeführt. Der Verschlüsselungsabschnitt nennt mehr Plattformen als die Lite2-Installationstabelle; beide Listen bleiben erhalten, ohne daraus zusätzliche Lite2-Geräteunterstützung abzuleiten.

Nach den lokalen chinesischen und englischen V2.5.0-Quellen mit ursprünglicher Abschnittsnummerierung. Chinesisch verwendet chinesische Abbildungen, die übrigen Sprachen die der englischen Quelle. PDF-Umbrüche, fortgesetzte Tabellen und Codeeinrückungen wurden wiederhergestellt. Beispielausgaben sind keine ArmSoM-Tests.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN Toolkit Lite2 V2.5.0, Teil 1: Installation, ResNet18 und Rückgabewerte](/de/articles/rknn-v250-lite-api-installation/)

**RKNN Toolkit Lite2 V2.5.0, Teil 2: Lebenszyklus, Eingaben und Ausgabewiederverwendung**

[RKNN Toolkit Lite2 V2.5.0, Teil 3: Modellladen, Verschlüsselung und Runtime-Initialisierung](/de/articles/rknn-v250-lite-api-loading-runtime/)

[RKNN Toolkit Lite2 V2.5.0, Teil 4: Inferenz-, Geräte- und Versions-APIs](/de/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0, Teil 5: Fehlerprüfung, Core Mask und Protokolle](/de/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 2. RKNNLite-Programmiermodell

RKNNLite ist der zentrale Python-Einstieg in RKNN Toolkit Lite2. Anwendungen laden darüber Modelle, initialisieren die Runtime, führen Inferenz aus, fragen Versionen ab und geben Ressourcen frei.

RKNN Toolkit Lite2 ist für die Bereitstellung auf Geräten gedacht. Zunächst wird das Framework-Modell mit RKNN Toolkit2 in RKNN konvertiert; anschließend verwendet die Geräteanwendung RKNNLite() → load_rknn() → init_runtime() → inference() → release().

Das Verständnis des Zusammenhangs zwischen RKNN-Modell, Runtime, Eingabedaten und NPU-Core-Konfiguration erleichtert die Verwendung der APIs in Kapitel 3.

### 2.1 Objektlebenszyklus

Typischer Lebenszyklus von RKNN Toolkit Lite2:

```text
Create RKNNLite object
    ↓
load_rknn()
    ↓
init_runtime()
    ↓
Prepare and preprocess input data
    ↓
inference()
    ↓
Post-process inference results
    ↓
release()
```

Dabei gilt:

RKNNLite() erzeugt ein RKNNLite-Objekt; verbose und verbose_file aktivieren ausführliche Protokolle;

load_rknn() lädt das RKNN-Modell vom angegebenen Pfad;

init_runtime() initialisiert die Runtime-Umgebung für die Modellausführung;

inference() verarbeitet vorbereitete Eingaben und liefert die Ausgaben;

release() gibt die Ressourcen des RKNNLite-Objekts frei.

init_runtime() prüft, ob ein Modell mit load_rknn() geladen wurde; inference() prüft die Runtime-Initialisierung. Die normale Reihenfolge lautet load_rknn() → init_runtime() → inference().

Typischer Anwendungsaufbau:

```text
rknn_lite = RKNNLite(verbose=True)

ret = rknn_lite.load_rknn('./model.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)

outputs = rknn_lite.inference(inputs=[input_data])

# Post-process outputs according to the model type.
# ...

rknn_lite.release()
```

Vor inference() die Eingaben vorverarbeiten und data_format anhand der Eingabedimensionen und tatsächlichen Datenanordnung setzen. Danach benötigen die Ausgaben normalerweise Nachverarbeitung für die Anwendungslogik.

### 2.2 Zusammenhang zwischen Modell, Runtime und Inferenz

Die Bereitstellung umfasst folgende Schritte:

Konvertierung: RKNN Toolkit2 konvertiert ein Deep-Learning-Framework-Modell in RKNN;

Laden: load_rknn() lädt das Modell in das RKNNLite-Objekt;

Initialisierung: init_runtime() initialisiert die Runtime;

Inferenz: inference() liefert die Modellergebnisse.

RKNN Toolkit2 und RKNN Toolkit Lite2 bedienen unterschiedliche Phasen:

| Phase | Werkzeug / API | Zweck |
| --- | --- | --- |
| Modellkonvertierung | RKNN Toolkit2 | Deep-Learning-Framework-Modell in RKNN konvertieren |
| Modellladen | load_rknn() | RKNN-Modell für die Ausführung auf dem Gerät laden |
| Runtime-Initialisierung | init_runtime() | Laufzeitumgebung initialisieren |
| Modellausführung | inference() | Inferenz ausführen und Ausgaben liefern |
| Ressourcenfreigabe | release() | RKNNLite-Ressourcen nach Verwendung freigeben |

Neben der Inferenz bietet RKNN Toolkit Lite2 Versions- und Plattformabfragen:

```text
load_rknn()
    ↓
init_runtime()
    ↓
get_sdk_version()
```

get_sdk_version() darf erst nach erfolgreicher Runtime-Initialisierung aufgerufen werden; andernfalls liefert es None. Da init_runtime() ein geladenes Modell benötigt, bleibt die normale Reihenfolge load_rknn(), init_runtime(), dann get_sdk_version().

list_support_target_platform() fragt die Chipplattformen ab, auf denen ein angegebenes RKNN-Modell laufen kann. rknn_model übergibt den Modellpfad. Ohne Pfad druckt die API die derzeit von RKNN Toolkit Lite2 unterstützten Plattformen nach Kategorien.

### 2.3 Eingabedaten, Datenlayout und Ausgaben

Aktuelle inference()-Signatur:

```text
inference(
    inputs,
    data_type=None,
    data_format=None,
    inputs_pass_through=None,
    get_frame_id=False,
    reuse_outputs=False
)
```

inputs ist die Modelleingabeliste. Die übrigen Parameter steuern Datentyp, Layout, Pass Through, Frame-ID-Verhalten im asynchronen Modus und Wiederverwendung des Ausgabespeichers.

#### 2.3.1 inputs

inputs übergibt die Modelleingaben als list, deren Elemente jeweils ndarray sind. Beispiel:

```text
outputs = rknn_lite.inference(inputs=[img])
```

Für ein Modell mit mehreren Eingaben:

```text
outputs = rknn_lite.inference(
    inputs=[input0, input1]
)
```

Vor dem Inferenzaufruf muss die Anwendung die erforderliche Vorverarbeitung abschließen.

#### 2.3.2 data_type und data_format

data_type bestimmt den Eingabedatentyp. Die aktuelle Schnittstelle nennt int8, uint8, int16, float16 und float32. Standardwert: None.

data_format bestimmt das Eingabelayout: unterstützt sind "nhwc" und "nchw", Standardwert None. Der Parameter geht direkt an die Eingabelogik der Runtime; die Anwendung muss ihn an das tatsächliche Pufferlayout anpassen.

#### 2.3.3 inputs_pass_through

inputs_pass_through setzt Pass Through je Eingabe als Liste mit 0 / 1 (aus / ein), passend zu den Modelleingaben. Standardwert: None.

#### 2.3.4 get_frame_id

get_frame_id ist standardmäßig False: Die API liefert die Ausgabe-ndarray-Liste. Bei True wird die Runtime-Frame-ID hinten angehängt. Das dient hauptsächlich der Zuordnung von Eingabe- und Ausgabeframes im asynchronen Modus.

#### 2.3.5 reuse_outputs

reuse_outputs steuert die Wiederverwendung des Speichers der Ausgabearrays. Standardwert False; diese optionale Optimierung verändert das Standardverhalten nicht.

Bei False (Standard) besitzt jedes Ausgabe-ndarray eigenen Speicher und bleibt über mehrere Aufrufe gültig, entsprechend dem bisherigen API-Vertrag. Die Anwendung darf Ergebnisse sicher aufbewahren.

Bei True liefert die API Ansichten interner wiederverwendbarer Zwischenpuffer ohne große Speicherallokation pro Aufruf. Geeignet für lange Schleifen, in denen die Ausgaben vor der nächsten Inferenz vollständig verarbeitet werden. Achtung: Der nächste inference()- oder get_outputs()-Aufruf überschreibt die Arrays. Zu behaltende Ergebnisse zuvor kopieren, etwa mit np.array(output).

#### 2.3.6 Inferenzausgaben und Fehlerrückgabe

Normalerweise liefert inference() eine Liste von Ausgabe-ndarray-Objekten:

```text
Input ndarray list
        ↓
    inference()
        ↓
Output ndarray list
        ↓
Application post-processing
```

Ist die Runtime nicht initialisiert oder tritt beim Setzen der Eingaben, Ausführen des Modells oder Abrufen der Ausgaben eine Ausnahme auf, wird None geliefert. Das Ergebnis vor der Nachverarbeitung prüfen.

### 2.4 NPU-Core-Konfiguration

init_runtime() konfiguriert den NPU-Core-Modus mit core_mask. Standardwert: RKNNLite.NPU_CORE_AUTO.

RKNNLite definiert derzeit folgende Core-Mask-Konstanten:

| core_mask | Wert | Beschreibung |
| --- | --- | --- |
| RKNNLite.NPU_CORE_AUTO | 0 | Automatischer Modus, Standardwert |
| RKNNLite.NPU_CORE_0 | 1 | Core 0 |
| RKNNLite.NPU_CORE_1 | 2 | Core 1 |
| RKNNLite.NPU_CORE_2 | 4 | Core 2 |
| RKNNLite.NPU_CORE_0_1 | 3 | Kombination Core 0/1 |
| RKNNLite.NPU_CORE_0_1_2 | 7 | Kombination Core 0/1/2; laut aktueller Schnittstellenbeschreibung nur auf RK3588 unterstützt |
| RKNNLite.NPU_CORE_ALL | 0xffff | Alle NPU-Cores |

Der Quellcode vermerkt core_mask als nur für RK3576 / RK3588 gültig. Tatsächlich unterstützte Core-Kombinationen hängen vom Chip und der Runtime-Prüfung ab. Ohne manuelle Auswahl RKNNLite.NPU_CORE_AUTO verwenden.

Typische Initialisierung:

```text
ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

### 2.5 Abfrage-APIs und Ressourcenfreigabe

Neben Inferenz bietet RKNN Toolkit Lite2 Geräteauflistung, SDK-Versionsabfrage, Modellplattformabfrage und Ressourcenfreigabe. Diese APIs haben unterschiedliche Voraussetzungen.

SDK-Version abfragen

get_sdk_version() ermittelt:

Runtime-Version;

Treiberversion;

Versionsinformationen des RKNN-Modells.

Aufrufreihenfolge:

```text
load_rknn()
    ↓
init_runtime()
    ↓
get_sdk_version()
```

Beispiel:

```text
sdk_version = rknn_lite.get_sdk_version()
```

Die Runtime muss zuvor erfolgreich initialisiert sein; andernfalls wird None zurückgegeben.

Unterstützte Modellplattformen abfragen

list_support_target_platform() fragt die Chipplattformen für ein bestimmtes RKNN-Modell ab:

```text
rknn_lite.list_support_target_platform(
    rknn_model='mobilenet_v1.rknn'
)
```

Bei rknn_model=None wird das Argument direkt an die Abfragefunktion gegeben, die die derzeitigen Plattformen von RKNN Toolkit Lite2 auflistet. Existiert ein ausdrücklich angegebener Modellpfad nicht, einschließlich einer leeren Zeichenkette, liefert die API None.

Ressourcen freigeben

Nach Abschluss der Arbeit mit dem RKNNLite-Objekt aufrufen:

```text
rknn_lite.release()
```

Im vollständigen Ablauf folgt die Freigabe nach Inferenz und zugehörigen Abfragen:

```text
RKNNLite()
    ↓
load_rknn()
    ↓
init_runtime()
    ↓
inference() / get_sdk_version()
    ↓
release()
```

release() ist der letzte Schritt im RKNNLite-Lebenszyklus. Ressourcen nach abgeschlossener Modellausführung auf dem Objekt zeitnah freigeben.

{% endraw %}
