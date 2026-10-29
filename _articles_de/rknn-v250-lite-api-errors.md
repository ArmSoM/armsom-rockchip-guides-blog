---
title: "RKNN Toolkit Lite2 V2.5.0, Teil 5: Fehlerprüfung, Core Mask und Protokolle"
description: "RKNN Toolkit Lite2 V2.5.0, Teil 5: Fehlerprüfung, Core Mask und Protokolle · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, Teil 5: Fehlerprüfung, Core Mask und Protokolle"
translation_key: "rknn-v250-lite-api-errors"
slug: "rknn-v250-lite-api-errors"
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

[RKNN Toolkit Lite2 V2.5.0, Teil 4: Inferenz-, Geräte- und Versions-APIs](/de/articles/rknn-v250-lite-api-inference-queries/)

**RKNN Toolkit Lite2 V2.5.0, Teil 5: Fehlerprüfung, Core Mask und Protokolle**

{% raw %}

## 4. Fehlerbehandlung

Die Python-APIs von RKNN Toolkit Lite2 melden Zustände über Statuscodes, None und Runtime-Protokolle. Statuscodes ausdrücklich und Inferenz-/Abfrageergebnisse vor Nutzung auf None prüfen.

### 4.1 Fehler beim Modellladen und Initialisieren der Runtime

load_rknn() und init_runtime() liefern:

Erfolg: 0

Fehler: -1

Jeden Initialisierungsschritt sofort prüfen:

```text
ret = rknn_lite.load_rknn('./resnet_18.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

Erst nach erfolgreichem Laden und Initialisieren mit inference() oder get_sdk_version() fortfahren.

### 4.2 Inferenzeingaben und Rückgabewerte prüfen

Vor inference() prüfen:

init_runtime() wurde erfolgreich abgeschlossen;

inputs ist eine Liste der vom Modell benötigten ndarray-Objekte;

verwendete data_type, data_format und inputs_pass_through passen zu den tatsächlichen Eingaben;

bei benötigter Frame-Zuordnung im asynchronen Modus ist get_frame_id=True gesetzt;

bei reuse_outputs=True sind Arrays Ansichten interner wiederverwendbarer Puffer und dürfen nicht über Aufrufe hinweg behalten werden; benötigte Ergebnisse zuerst kopieren.

inference() liefert None bei nicht initialisierter Runtime oder Fehlern beim Setzen der Eingaben, Modellausführung oder Abrufen der Ausgaben. Einheitlich auf fehlende Ergebnisse prüfen:

```text
outputs = rknn_lite.inference(inputs=[input_data])
if outputs is None:
    print('Inference failed')
    exit(-1)
```

### 4.3 NPU-Core-Konfiguration prüfen

Der Quellcode beschränkt core_mask auf RK3576 / RK3588. Die Schnittstellenbeschreibung kennzeichnet RKNNLite.NPU_CORE_0_1_2 zusätzlich als nur auf RK3588 unterstützt.

Ohne manuelle Core-Auswahl RKNNLite.NPU_CORE_AUTO verwenden. Konkrete Kombinationen unterliegen der Runtime-Prüfung. Bei fehlgeschlagener Core-Mask-Einstellung liefert init_runtime() -1.

### 4.4 Protokollierung

Für ausführliche Protokolle verbose und verbose_file bei der RKNNLite-Initialisierung verwenden:

```text
rknn_lite = RKNNLite(
    verbose=True,
    verbose_file='./inference.log'
)
```

Bei verbose=True erscheinen ausführliche Protokolle auf dem Bildschirm. Ist zusätzlich verbose_file gesetzt, werden sie auch in die angegebene Datei geschrieben.

Bei Lade-, Initialisierungs- oder Inferenzfehlern API-Rückgabewert und ausführliche Protokolle gemeinsam zur Diagnose verwenden.

## 5. Anhang

### 5.1 Referenzdokumente

RKNN2 SDK Development Guide: RKNN2-Softwarestack, Konvertierung und Quantisierung, Bereitstellung und Fehlerbehebung.

RKNN2 Toolkit Python API Reference: Python-API-Methoden, Parameter und Rückgabewerte von RKNN-Toolkit2.

RKNN-Toolkit2-Dokumentation:

https://github.com/airockchip/rknn-toolkit2/tree/master/doc

RKNN-Toolkit2-Projekt:

https://github.com/airockchip/rknn-toolkit2

{% endraw %}
