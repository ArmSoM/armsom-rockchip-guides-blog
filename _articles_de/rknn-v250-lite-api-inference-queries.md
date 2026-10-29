---
title: "RKNN Toolkit Lite2 V2.5.0, Teil 4: Inferenz-, Geräte- und Versions-APIs"
description: "RKNN Toolkit Lite2 V2.5.0, Teil 4: Inferenz-, Geräte- und Versions-APIs · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, Teil 4: Inferenz-, Geräte- und Versions-APIs"
translation_key: "rknn-v250-lite-api-inference-queries"
slug: "rknn-v250-lite-api-inference-queries"
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

[RKNN Toolkit Lite2 V2.5.0, Teil 2: Lebenszyklus, Eingaben und Ausgabewiederverwendung](/de/articles/rknn-v250-lite-api-programming-model/)

[RKNN Toolkit Lite2 V2.5.0, Teil 3: Modellladen, Verschlüsselung und Runtime-Initialisierung](/de/articles/rknn-v250-lite-api-loading-runtime/)

**RKNN Toolkit Lite2 V2.5.0, Teil 4: Inferenz-, Geräte- und Versions-APIs**

[RKNN Toolkit Lite2 V2.5.0, Teil 5: Fehlerprüfung, Core Mask und Protokolle](/de/articles/rknn-v250-lite-api-errors/)

{% raw %}

### 3.3 Modellinferenz

inference

| API | inference |
| --- | --- |
| Funktion | Inferenz auf den angegebenen Eingaben ausführen und Ausgaben liefern. |
| Parameter | inputs: Eingabedaten als list mit ndarray-Elementen. |
|  | data_type: Eingabedatentyp, Standard None. Genannt werden int8, uint8, int16, float16 und float32. |
|  | data_format: Eingabelayout, Standard None. Unterstützt "nhwc" und "nchw". |
|  | inputs_pass_through: Liste der Pass-Through-Flags; 0 / 1 bedeutet aus / ein. Standard None. |
|  | get_frame_id: Frame-ID abrufen. Standard False; hauptsächlich für asynchronen Modus. |
|  | reuse_outputs: interne Ausgabepuffer wiederverwenden, Standard False. Bei True werden Pufferansichten für lange Schleifen geliefert; die nächste Inferenz überschreibt die Ergebnisse. |
| Rückgabe | Normalerweise Liste von Ausgabe-ndarray; bei get_frame_id=True wird die Frame-ID angehängt. None bei nicht initialisierter Runtime oder Ausnahme während der Inferenz. |

Beispiel:

```text
outputs = rknn_lite.inference(inputs=[img])
if outputs is None:
    print('Inference failed')
else:
    show_top5(outputs)
```

Zur Verringerung von Speicherallokationen in langen Schleifen die Ausgabewiederverwendung aktivieren:

```text
for frame in frames:
    outputs = rknn_lite.inference(
        inputs=[frame],
        reuse_outputs=True
    )
    show_top5(outputs) # consume immediately; results are overwritten
                              # by the next inference
```

Referenzausgabe:

```text
-----TOP 5-----
[812]: 0.999442994594574
[404]: 0.0004096269840374589
[657]: 3.284541890025139e-05
[833]: 2.6112385967280716e-05
[895]: 1.8509887013351545e-05
```

Verwendungshinweise:

init_runtime() muss zuvor erfolgreich abgeschlossen sein; andernfalls liefert die API None.

inputs, data_type, data_format und inputs_pass_through werden an die Runtime-Eingabelogik übergeben.

Ausnahmen beim Setzen der Eingaben, Ausführen des Modells oder Abrufen der Ausgaben führen zu None.

Bei get_frame_id=False kommt die normale Ausgabeliste zurück. Bei True wird die Runtime-Frame-ID hinten angehängt.

Standardmäßig gilt reuse_outputs=False: Arrays besitzen ihren Speicher und bleiben zwischen Aufrufen gültig. True nur gezielt zur Verringerung von Allokationen aktivieren: Dann sind Arrays Ansichten interner Puffer und werden durch die nächste Inferenz überschrieben. Aufzubewahrende Ergebnisse zuvor kopieren.

Nach erfolgreicher Inferenz die zum Modelltyp passende Nachverarbeitung ausführen.

### 3.4 Geräte-, Versions- und Plattformabfragen

list_devices

| API | list_devices |
| --- | --- |
| Funktion | Über ADB und NTB erreichbare Geräte auflisten und Listen ausgeben. |
| Parameter | Keine |
| Rückgabe | (adb_devices, ntb_devices): zwei list-Objekte. Auch in NTB vorkommende Geräte werden aus der zurückgegebenen ADB-Liste entfernt. |

Beispiel:

```text
adb_devices, ntb_devices = rknn_lite.list_devices()
```

get_sdk_version

| API | get_sdk_version |
| --- | --- |
| Funktion | SDK-Versionsinformationen abrufen. |
| Parameter | Keine |
| Rückgabe | Normalerweise sdk_version-Zeichenkette; None bei nicht initialisierter Runtime oder fehlgeschlagener Abfrage. |

Die Runtime muss zuvor erfolgreich initialisiert sein. Da init_runtime() ein Modell benötigt, lautet die Standardreihenfolge load_rknn() → init_runtime() → get_sdk_version().

Beispiel:

```text
sdk_version = rknn_lite.get_sdk_version()
if sdk_version is None:
    print('Get SDK version failed')
```

Beispiel der Rückgabeinformationen:

```text
I RKNN: [10:47:23.097] RKNN Runtime Information:
librknnrt version: 1.2.0b1
(a47985372@2021-12-06T10:20:14)

I RKNN: [10:47:23.097] RKNN Driver Information:
version: 0.6.2

I RKNN: [10:47:23.098] RKNN Model Information:
version: 1,
toolkit version: 1.1.2
(compiler version: 1.1.2b13
(1e5726f57@2021-11-29T14:13:55)),
target: RKNPU v2,
target platform: rk3588,
framework name: PyTorch,
framework layout: NCHW
```

list_support_target_platform

| API | list_support_target_platform |
| --- | --- |
| Funktion | Plattformen eines RKNN-Modells abfragen oder derzeit unterstützte Plattformen auflisten. |
| Parameter | rknn_model: Modellpfad, Standard None. Bei None wird direkt die Abfragefunktion für unterstützte Plattformen aufgerufen. |
| Rückgabe | Normalerweise support_target als dict. None, wenn ein ausdrücklich angegebener Modellpfad nicht existiert. |

Beispiel:

```text
support_target = rknn_lite.list_support_target_platform(
    rknn_model='mobilenet_v1.rknn'
)
if support_target is None:
    print('Query target platform failed')
```

Beispielergebnis:

```text
**************************************************
Target platforms filled in RKNN model: ['RK3588']
Target platforms supported by this RKNN model: ['RK3588']
**************************************************
```

Verwendungshinweise:

Bei rknn_model=None wird die Dateiexistenz nicht geprüft; die zugrunde liegende Plattformabfrage wird direkt aufgerufen.

Existiert der ausdrücklich angegebene Modellpfad nicht, protokolliert die API einen Fehler und liefert None.

{% endraw %}
