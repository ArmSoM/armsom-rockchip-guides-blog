---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Umgebung und Objektlebenszyklus"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-toolkit-api-requirements-lifecycle"
slug: "rknn-v250-toolkit-api-requirements-lifecycle"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Umgebung und Objektlebenszyklus | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Umgebung und Objektlebenszyklus | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-toolkit-api-requirements-lifecycle/"
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

<!-- source EN p5 unit 0 -->

## 1 Anforderungen

<!-- source EN p5 unit 1 -->

### 1.1 Unterstützte Chipmodelle

<!-- source EN p5 unit 2 -->

RV1103

<!-- source EN p5 unit 3 -->

RV1103B

<!-- source EN p5 unit 4 -->

RV1106

<!-- source EN p5 unit 5 -->

RV1106B

<!-- source EN p5 unit 6 -->

RV1126B

<!-- source EN p5 unit 7 -->

RK2118

<!-- source EN p5 unit 8 -->

RK3562

<!-- source EN p5 unit 9 -->

RK3566-Serie

<!-- source EN p5 unit 10 -->

RK3568-Serie

<!-- source EN p5 unit 11 -->

RK3576-Serie

<!-- source EN p5 unit 12 -->

RK3588-Serie

<!-- source EN p5 unit 13 -->

Hinweis: RK3566 / RK3568 / RK3576 / RK3588 bezeichnen im Folgenden jeweils die entsprechenden RK3566-/RK3568-/RK3576-/RK3588-Serien.

<!-- source EN p5 unit 14 -->

### 1.2 Anforderungen an Umgebung und Abhängigkeiten

<!-- source EN p5 unit 15 -->

Für die Betriebssystemumgebung werden folgende Anforderungen empfohlen:

<!-- source EN p5 unit 16 -->

| Betriebssystemversion | Ubuntu18.04<br>(x64) | Ubuntu20.04<br>(x64) | Ubuntu22.04<br>(x64) | Ubuntu24.04<br>(x64) |
| --- | --- | --- | --- | --- |
| Python-Version | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 | 3.12 |

<!-- source EN p5 unit 17 -->

Für ARM64:

<!-- source EN p5 unit 18 -->

| Betriebssystemversion | Debian10 (x64) | Debian11 (x64) | Debian12 (x64) |
| --- | --- | --- | --- |
| Python-Version | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 / 3.12 |

<!-- source EN p5 unit 19 -->

Hinweise:

<!-- source EN p5 unit 20 -->

1. Detaillierte Python-Bibliotheksabhängigkeiten stehen in doc/requirements*.txt.

<!-- source EN p5 unit 21 -->

2. Die Dokumentbeispiele verwenden hauptsächlich Ubuntu 20.04 / Python3.8.

<!-- source EN p5 unit 22 -->

### 1.3 Unterstützte Deep-Learning-Frameworks

<!-- source EN p5 unit 23 -->

RKNN-Toolkit2 unterstützt Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet und PyTorch.

<!-- source EN p5 unit 24 -->

Die Zuordnung zwischen RKNN-Toolkit2 und den Framework-Versionen ist nachfolgend aufgeführt:

<!-- source EN p6 unit 25 -->

| RKNN-Toolkit2 | Caffe | TensorFlow | TF Lite | ONNX | DarkNet | PyTorch |
| --- | --- | --- | --- | --- | --- | --- |
| 1.4.0<br>1.4.2<br>1.5.0<br>1.5.2 | 1.0 | 1.12.0<br>~2.8.0 | Schema-<br>Version=3 | 1.7.0<br>~1.10.0 | Commit-ID:<br>810d7f7 | 1.6.0<br>~1.10.1 |
| 1.6.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema-<br>Version=3 | 1.7.0<br>~1.14.0 | Commit-ID:<br>810d7f7 | 1.6.0<br>~1.13.1 |
| 2.0.0<br>2.1.0<br>2.2.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema-<br>Version=3 | 1.7.0<br>~1.14.1 | Commit-ID:<br>810d7f7 | 1.10.1<br>~2.1.0 |
| 2.3.0<br>~2.5.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema-<br>Version=3 | 1.7.0<br>~1.17.0 | Commit-ID:<br>810d7f7 | 1.10.1<br>~2.4.0 |

<!-- source EN p6 unit 26 -->

Hinweise:

<!-- source EN p6 unit 27 -->

1. Aufgrund der TensorFlow-Versionskompatibilität werden theoretisch auch pb-Dateien unterstützt, die vor TensorFlow 1.12.0 exportiert wurden. Einzelheiten zur Kompatibilität verschiedener Versionen stehen in der offiziellen Dokumentation: https://www.tensorflow.org/guide/versions

<!-- source EN p6 unit 28 -->

2. Die Schemas verschiedener TFLite-Versionen sind nicht miteinander kompatibel. Unterscheidet sich das Schema eines exportierten TFLite-Modells von der durch RKNN-Toolkit2 verwendeten Schemaversion, kann das Laden fehlschlagen.

<!-- source EN p6 unit 29 -->

3. Das Caffe-Protokoll von RKNN-Toolkit2 basiert mit Änderungen auf dem offiziellen Berkeley-Protokoll. Quelle: https://github.com/BVLC/caffe/tree/master/src/caffe/proto, Commit 828dd10. RKNN-Toolkit2 ergänzt darauf aufbauend einige Operatoren.

<!-- source EN p6 unit 30 -->

4. Die Zuordnung zwischen ONNX-Releases, opset- und IR-Versionen ist in der onnxruntime-Dokumentation beschrieben: https://github.com/microsoft/onnxruntime/blob/v1.10.0/docs/Versioning.md

<!-- source EN p6 unit 31 -->

5. Offizielles DarkNet-Repository: https://github.com/pjreddie/darknet. Die Konvertierungsregeln des Dokumentstands beruhen auf dessen letztem master-Commit 810d7f7; dies ist keine Aussage über den heutigen HEAD.

<!-- source EN p6 unit 32 -->

6. Beim Laden eines PyTorch-Modells (torchscript) wird dieselbe PyTorch-Version für Modellexport und RKNN-Konvertierung empfohlen. Unterschiedliche Versionen können zum Konvertierungsfehler führen.

<!-- source EN p6 unit 33 -->

7. Die ARM64-Version unterstützt laut Dokumentstand nur PyTorch und ONNX; andere Frameworks werden dort nicht unterstützt.

<!-- source EN p7 unit 34 -->

## 2 RKNN-Objekt und Ressourcenlebenszyklus

<!-- source EN p7 unit 35 -->

Diese Funktionsgruppe initialisiert das RKNN-Objekt und gibt es frei. Vor der Verwendung sämtlicher RKNN-Toolkit2-APIs RKNN() aufrufen; nach Abschluss der Aufgabe das Objekt mit release() freigeben.

<!-- source EN p7 unit 36 -->

Bei der Initialisierung steuern verbose und verbose_file die ausführliche Protokollierung etwa beim Laden und Erstellen von Modellen. verbose hat den Typ bool: True aktiviert detaillierte Ausgaben von RKNN-Toolkit2. verbose_file ist eine Zeichenfolge; enthält sie einen Dateipfad, wird das Protokoll dort gespeichert. Auch dafür muss verbose auf True stehen.

<!-- source EN p7 unit 37 -->

Beispielcode:

<!-- source EN p7 unit 38 -->

```python
# Print the detailed log information.
rknn = RKNN(verbose=True)

...

rknn.release()
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Redaktionelle Hinweise: Protokolle mit SDK 1.5.2 bleiben historische Beispiele, keine V2.5.0-Messungen. Die Python-Zelle für Ubuntu20.04 unterscheidet sich: chinesisch 3.8/3.9, englisch 3.8/3.8; ebenso für Debian11; im ARM64-Abschnitt ist Debian weiterhin als x64 bezeichnet. Quellwerte bleiben erhalten; tatsächliches Installationspaket prüfen. V2.5.0 ergänzt C++ codegen und präzisiert Quantisierung und Speicherstrategien; alte Parameter ersetzen nicht die neue Quelle.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
