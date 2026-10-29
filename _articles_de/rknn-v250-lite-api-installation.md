---
title: "RKNN Toolkit Lite2 V2.5.0, Teil 1: Installation, ResNet18 und Rückgabewerte"
description: "RKNN Toolkit Lite2 V2.5.0, Teil 1: Installation, ResNet18 und Rückgabewerte · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, Teil 1: Installation, ResNet18 und Rückgabewerte"
translation_key: "rknn-v250-lite-api-installation"
slug: "rknn-v250-lite-api-installation"
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

**RKNN Toolkit Lite2 V2.5.0, Teil 1: Installation, ResNet18 und Rückgabewerte**

[RKNN Toolkit Lite2 V2.5.0, Teil 2: Lebenszyklus, Eingaben und Ausgabewiederverwendung](/de/articles/rknn-v250-lite-api-programming-model/)

[RKNN Toolkit Lite2 V2.5.0, Teil 3: Modellladen, Verschlüsselung und Runtime-Initialisierung](/de/articles/rknn-v250-lite-api-loading-runtime/)

[RKNN Toolkit Lite2 V2.5.0, Teil 4: Inferenz-, Geräte- und Versions-APIs](/de/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0, Teil 5: Fehlerprüfung, Core Mask und Protokolle](/de/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 1. Überblick über die API-Referenz

Dieses Handbuch beschreibt die Python-APIs von RKNN Toolkit Lite2: das RKNNLite-Objekt, Umgebungsanforderungen, Modellladen, Runtime-Initialisierung, Inferenz sowie Abfragen der SDK-Version und unterstützter Plattformen.

RKNN Toolkit Lite2 stellt RKNN-Modelle auf Rockchip-NPU-Plattformen bereit. Die Modellkonvertierung erfolgt mit RKNN Toolkit2 und ist nicht Gegenstand dieses Handbuchs.

### 1.1 Gültige Version und Plattformen

Dieses Dokument gilt für RKNN Toolkit Lite2 V2.5.0.

Derzeitiger Unterstützungsumfang:

| Merkmal | Unterstützter Bereich |
| --- | --- |
| RKNN-Toolkit-Lite2-Version | V2.5.0 |
| Hardwareplattformen | RK3562, Serien RK3566, RK3568, RK3576, RK3588 |
| Betriebssystem | Debian 10 / 11 / 12 (aarch64) |
| Python | 3.8 / 3.9 / 3.10 / 3.11 / 3.12 |
| Python-Abhängigkeiten | numpy, ruamel.yaml, psutil |

### 1.2 Installation und Umgebungseinrichtung

RKNN Toolkit Lite2 lässt sich mit pip3 install installieren.

Falls python3 oder pip3 fehlen, zunächst die benötigten Basispakete installieren:

```text
sudo apt-get update
sudo apt-get install -y python3 python3-dev python3-pip gcc
```

Manche Abhängigkeiten kompilieren bei der Installation Quellcode. Deshalb python3-dev und gcc mitinstallieren, um Build-Fehler zu vermeiden.

Die Beispiele verwenden außerdem opencv-python und numpy:

```text
sudo apt-get install -y python3-opencv
sudo apt-get install -y python3-numpy
```

Hinweise:

1. RKNN Toolkit Lite2 selbst benötigt opencv-python nicht; die Beispiele verwenden es jedoch zur Bildverarbeitung.

2. Die direkte numpy-Installation mit pip3 kann unter Debian-10-Firmware fehlschlagen. Die oben gezeigte Installation über Systempakete wird empfohlen.

Die Plattformpakete von RKNN Toolkit Lite2 liegen im SDK-Verzeichnis packages. Dort das Wheel passend zur Python-Version installieren:

```text
# Python 3.8
pip3 install rknn_toolkit_lite2-2.x.0-cp38-cp38-linux_aarch64.whl

# Python 3.9
pip3 install rknn_toolkit_lite2-2.x.0-cp39-cp39-linux_aarch64.whl

# Python 3.10
pip3 install rknn_toolkit_lite2-2.x.0-cp310-cp310-linux_aarch64.whl

# Python 3.11
pip3 install rknn_toolkit_lite2-2.x.0-cp311-cp311-linux_aarch64.whl

# Python 3.12
pip3 install rknn_toolkit_lite2-2.x.0-cp312-cp312-linux_aarch64.whl
```

### 1.3 Grundlegender Ablauf

Vor dem Einsatz von RKNN Toolkit Lite2 die aus Deep-Learning-Frameworks exportierten Modelle mit RKNN Toolkit2 in RKNN-Modelle konvertieren.

Grundlegender Ablauf:

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

RKNNLite() erzeugt das Python-Objekt von RKNN Toolkit Lite2;

load_rknn() lädt ein RKNN-Modell;

init_runtime() initialisiert die Runtime-Umgebung;

inference() führt die Modellinferenz aus;

release() gibt nach der Verwendung die Ressourcen des RKNNLite-Objekts frei.

Vor inference() die Eingabedaten vorbereiten und vorverarbeiten, danach data_format und weitere Parameter gemäß den tatsächlichen Eingaben konfigurieren. Nach der Inferenz benötigen die Ausgaben normalerweise Nachverarbeitung für die Anwendungsfunktionen.

### 1.4 Beispielprogramm

Das SDK enthält unter examples ein resnet18-Beispiel. Es lädt ResNet18, führt Inferenz aus und gibt die Top-5-Klassifikationsergebnisse des Testbilds aus.

Ausführung:

1. Ein Board mit installiertem RKNN Toolkit Lite2 vorbereiten.

2. Das Beispiel auf das Board kopieren.

3. In examples/resnet18 wechseln und ausführen:

```text
python3 test.py
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

### 1.5 API-Rückgabekonventionen

Die aktuelle RKNNLite-Python-Implementierung verwendet für die wichtigsten APIs folgende Rückgabekonventionen:

| API | Normale Rückgabe | Fehler / Sonderfall |
| --- | --- | --- |
| load_rknn() | 0 | -1 |
| list_devices() | (adb_devices, ntb_devices), beide Elemente sind list-Objekte | Keine gesonderte Fehlerrückgabe definiert |
| init_runtime() | 0 | -1 bei Fehlern in Parameterprüfung, Modellladen, Runtime-Erstellung oder Initialisierung |
| inference() | list von Ausgabe-ndarray; bei get_frame_id=True wird die Frame-ID angehängt | None bei nicht initialisierter Runtime oder Fehlern in Eingaben, Ausführung oder Ausgabeabruf |
| get_sdk_version() | SDK-Versionszeichenkette | None bei nicht initialisierter Runtime oder fehlgeschlagener Abfrage |
| list_support_target_platform() | dict der Plattformabfragefunktion | None, wenn der angegebene RKNN-Modellpfad nicht existiert |
| release() | None | None |

Rückgabewerte von Status-APIs ausdrücklich prüfen. Beispiel:

```text
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_AUTO)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

Bei inference(), get_sdk_version() und list_support_target_platform() auch auf None prüfen, damit bei fehlenden Voraussetzungen oder internen Fehlern keine ungültigen Ergebnisse verarbeitet werden.

{% endraw %}
