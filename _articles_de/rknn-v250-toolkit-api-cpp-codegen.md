---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — C++-Bereitstellungsbeispiele erzeugen, bauen und ausführen"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-toolkit-api-cpp-codegen"
slug: "rknn-v250-toolkit-api-cpp-codegen"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — C++-Bereitstellungsbeispiele erzeugen, bauen und ausführen | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — C++-Bereitstellungsbeispiele erzeugen, bauen und ausführen | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-toolkit-api-cpp-codegen/"
---

## Plattform und Quelle

Dieser Artikel basiert auf dem RKNN-V2.5.0-PDF des Herstellers und gilt nur für die dort genannten Chips und Schnittstellen. Bei ArmSoM-Boards zuerst SoC, NPU-Treiber, Toolkit/Runtime, SDK/BSP und Kernelversion prüfen. Eine ArmSoM-Hardwareprüfung wurde nicht durchgeführt; Beispiele und Messwerte stammen aus der Quelle, nicht aus ArmSoM-Tests.

## Seriennavigation

- [Umgebung und Objektlebenszyklus](/de/articles/rknn-v250-toolkit-api-requirements-lifecycle/)
- [Modellkonfiguration und Quantisierungsparameter](/de/articles/rknn-v250-toolkit-api-configuration/)
- [Caffe, TensorFlow, ONNX und PyTorch laden](/de/articles/rknn-v250-toolkit-api-model-loading/)
- [Aufbau, hybride Quantisierung und Export](/de/articles/rknn-v250-toolkit-api-build-quantize-export/)
- [Laufzeit, Operatorregistrierung und Inferenz](/de/articles/rknn-v250-toolkit-api-runtime-inference/)
- [Genauigkeit, Leistung, Speicher und Geräteabfragen](/de/articles/rknn-v250-toolkit-api-evaluation-query/)
- [C++-Bereitstellungsbeispiele erzeugen, bauen und ausführen](/de/articles/rknn-v250-toolkit-api-cpp-codegen/)

{% raw %}

<!-- source EN p27 unit 150 -->

## 10 C++-Bereitstellungsbeispiel erzeugen

<!-- source EN p27 unit 151 -->

| API | codegen |
| --- | --- |
| Beschreibung | Erzeugt ein C++-Bereitstellungsbeispiel für ein exportiertes RKNN-Modell. Das Beispiel nutzt die Zero-Copy-RKNN-C-API, meldet die Leistung und kann Inferenzergebnisse als NPY speichern. |
| Parameter | output_path: Verzeichnis für das zu erzeugende C++-Beispielprojekt. |
| Parameter | inputs: Optionale Liste der Eingabedateipfade, Standard None. JPG, JPEG, PNG und NPY werden unterstützt. Bei einem Modelleingang ist auch ein einzelner Pfadstring zulässig. Anzahl und Reihenfolge der Dateien müssen den Modelleingängen entsprechen. Jede NPY-Arrayform muss zur entsprechenden ursprünglichen Modelleingabe passen; vierdimensionale NPY-Arrays verwenden NCHW. |
| Parameter | overwrite: Vorhandenes Verzeichnis output_path überschreiben. Standard False: Bei vorhandenem Verzeichnis schlägt die API fehl. Bei True wird das vorhandene Verzeichnis vor der erneuten Projekterzeugung entfernt. |
| Rückgabewert | 0: Erfolg.<br>-1: Fehler. |

<!-- source EN p27 unit 152 -->

### 10.1 Beispiel erzeugen

<!-- source EN p27 unit 153 -->

Vor codegen muss export_rknn aufgerufen werden. Im Beispiel wird das Modell auf dem PC einmal mit dem angegebenen Bild ausgeführt. Die Ausgaben werden als Referenzdaten für die Geräteprüfung gespeichert; der Standardaufruf mit Eingabe wird in run.sh geschrieben.

<!-- source EN p27 unit 154 -->

```python
# Export the RKNN model before generating the C++ deployment example.
ret = rknn.export_rknn('./mobilenet_v2.rknn')
if ret != 0:
    print('Export RKNN model failed!')
    exit(ret)

ret = rknn.codegen(output_path='./rknn_app_demo',
                  inputs=['./mobilenet_v2/dog_224x224.jpg'],
                  overwrite=True)
if ret != 0:
    print('Generate C++ demo failed!')
    exit(ret)
```

<!-- source EN p27 unit 155 -->

Bei mehreren Modelleingängen eine Liste mit jeweils einer Datei pro Eingang übergeben. Beispiel:

<!-- source EN p27 unit 156 -->

```python
ret = rknn.codegen(output_path='./rknn_app_demo',
                  inputs=['./input0.npy', './input1.npy'],
                  overwrite=True)
```

<!-- source EN p27 unit 157 -->

Bei inputs=None erzeugt codegen ein C++-Projekt für Leistungstests, jedoch keine Eingabedaten oder Referenzausgaben. Das Geräteprogramm speichert oder vergleicht daher nur bei gültigen Eingabepfaden zur Laufzeit Ausgaben. Das Argument dataset von build ersetzt nicht das Argument inputs von codegen.

<!-- source EN p28 unit 158 -->

### 10.2 Erzeugte Dateien

<!-- source EN p28 unit 159 -->

Nach erfolgreicher Erzeugung enthält output_path die folgenden Hauptdateien und Verzeichnisse. Das Verzeichnis data wird bei angegebenem inputs erzeugt.

<!-- source EN p28 unit 160 -->

```text
rknn_app_demo/
├── CMakeLists.txt
├── README.md / README_EN.md
├── build_linux.sh / build_android.sh
├── run.sh
├── src/ # RKNN C API inference example
├── libs/ # NPY, image resize, layout, and data type utilities
└── data/
    ├── inputs/ # Inputs prepared by codegen
    └── outputs/golden/ # FP32 reference outputs generated by the Python API
```

<!-- source EN p28 unit 161 -->

Bei der Erzeugung liest OpenCV das Bild und skaliert es. Das C++-Beispiel verwendet stb und bei abweichender Größe Letterbox-Skalierung. Wegen dieser unterschiedlichen Bildverarbeitung kann die Kosinusähnlichkeit zwischen Geräte- und Referenzausgabe unter 0.9999 liegen. Eingaben, die kein Bild direkt verwenden können, werden bei der Erzeugung in FP32-NPY-Dateien umgewandelt.

<!-- source EN p28 unit 162 -->

### 10.3 Bauen und ausführen

<!-- source EN p28 unit 163 -->

Zuerst das lokale RKNPU2-Repository angeben. Linux verwendet einen Cross-Compiler. Für RV1103/RV1103B/RV1106/RV1106B auch GCC_COMPILER auf das Toolchain-Präfix setzen. Für Android ANDROID_NDK_PATH setzen.

<!-- source EN p28 unit 164 -->

Das Linux-Buildskript unterstützt RV1103, RV1103B, RV1106, RV1106B, RV1126B, RK3562, RK3566, RK3568, RK3576, RK3588 und RK3588S. Das Android-Buildskript unterstützt RK3562, RK3566, RK3568, RK3576 und RK3588.

<!-- source EN p28 unit 165 -->

```text
cd ./rknn_app_demo
export RKNPU2=/path/to/rknpu2

# Linux; replace rk3562 with the actual target platform.
./build_linux.sh rk3562

# Android
export ANDROID_NDK_PATH=/path/to/android-ndk
./build_android.sh rk3562
```

<!-- source EN p28 unit 166 -->

Das Bereitstellungsverzeichnis lautet install/rknn_app_demo_Linux oder install/rknn_app_demo_Android. Das gesamte Verzeichnis auf das Gerät übertragen und das erzeugte Skript ausführen:

<!-- source EN p28 unit 167 -->

```text
adb push ./install/rknn_app_demo_Linux /data/
adb shell
cd /data/rknn_app_demo_Linux
./run.sh
```

<!-- source EN p29 unit 168 -->

Alternativ die ausführbare Datei direkt aufrufen:

<!-- source EN p29 unit 169 -->

```text
./rknn_app_demo <model_path> [input_paths] [repeat_times]
```

<!-- source EN p29 unit 170 -->

Ohne input_paths führt das Programm nur Inferenz und Leistungsmessung durch und speichert keine Ausgaben.

<!-- source EN p29 unit 171 -->

Bei mehreren Eingängen die Pfade mit # in Modelleingangsreihenfolge verbinden, zum Beispiel: ./data/inputs/input0.npy#./data/inputs/input1.npy .

<!-- source EN p29 unit 172 -->

repeat_times ist eine positive ganze Zahl für die Anzahl der Inferenzdurchläufe. Ohne Eingaben einen leeren String übergeben, beispielsweise: ./rknn_app_demo ./mobilenet_v2.rknn "" 100 .

<!-- source EN p29 unit 173 -->

Bei gültigen Eingaben werden alle Ausgaben als FP32 NPY in data/outputs/runtime gespeichert. Existiert eine gleichnamige Referenz in data/outputs/golden, gibt das Programm auch die Kosinusähnlichkeit beider Dateien aus.

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Redaktionelle Hinweise: Protokolle mit SDK 1.5.2 bleiben historische Beispiele, keine V2.5.0-Messungen. Die Python-Zelle für Ubuntu20.04 unterscheidet sich: chinesisch 3.8/3.9, englisch 3.8/3.8; ebenso für Debian11; im ARM64-Abschnitt ist Debian weiterhin als x64 bezeichnet. Quellwerte bleiben erhalten; tatsächliches Installationspaket prüfen. V2.5.0 ergänzt C++ codegen und präzisiert Quantisierung und Speicherstrategien; alte Parameter ersetzen nicht die neue Quelle.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
