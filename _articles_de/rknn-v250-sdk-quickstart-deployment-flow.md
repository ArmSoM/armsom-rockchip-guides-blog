---
title: "RKNN2 V2.5.0, Teil 1: Bereitstellung, Plattformen und SDK-Repositorys"
description: "RKNN2 V2.5.0, Teil 1: Bereitstellung, Plattformen und SDK-Repositorys · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, Teil 1: Bereitstellung, Plattformen und SDK-Repositorys"
translation_key: "rknn-v250-sdk-quickstart-deployment-flow"
slug: "rknn-v250-sdk-quickstart-deployment-flow"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Geltungsbereich: RKNN2-V2.5.0-Plattformreferenz für RK3562, die Serien RK3566/3568/3576/3588 und RV1126B. Auch ein ArmSoM-Board mit demselben SoC benötigt passende BSP-, NPU-Treiber- und Runtime-Versionen. Versorgung, USB und Firmware des Rockchip-EVB nicht ungeprüft übernehmen. Host- und Treiberanforderungen stehen im Text. Keine ArmSoM-Hardwarevalidierung durchgeführt.

Nach den lokalen chinesischen und englischen V2.5.0-Quellen mit ursprünglicher Abschnittsnummerierung. Chinesisch verwendet chinesische Abbildungen, die übrigen Sprachen die der englischen Quelle. PDF-Umbrüche, fortgesetzte Tabellen und Codeeinrückungen wurden wiederhergestellt. Beispielausgaben sind keine ArmSoM-Tests.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 V2.5.0, Teil 1: Bereitstellung, Plattformen und SDK-Repositorys**

[RKNN2 V2.5.0, Teil 2: Hardwareanschluss und ADB-Prüfung](/de/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0, Teil 3: Toolkit, Android/Linux-Runtime und Compiler](/de/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0, Teil 4: MobileNet konvertieren und bereitstellen](/de/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0, Teil 5: YOLOv5-Erkennung und Genauigkeitsbewertung](/de/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0, Teil 6: Docker, Startprobleme und Referenzen](/de/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 1. Vor dem Start

Dieser Leitfaden führt auf dem kürzesten Weg zum ersten Lauf des RKNN2 SDK: Hardwareanschluss, Umgebungsvorbereitung, Modellkonvertierung, Debugging mit angeschlossenem Board und Bereitstellung auf dem Board. Prinzipien der Modellkonvertierung, Quantisierungskonfiguration, vollständige API-Referenz und systematische Fehlerbehebung werden in den entsprechenden Dokumenten behandelt.

Hinweis: Den vollständigen Entwicklungsablauf, Toolkit-Schnittstellen sowie Genauigkeits-, Leistungs- und Speicheranalysen beschreibt der RKNN2 SDK Development Guide. Unterstützte Hardware, Betriebssysteme und Versionsbereiche richten sich nach dem SDK-Release-Paket. Hier stehen nur die für den ersten Lauf nötigen Angaben.

### 1.1 Ziele des Leitfadens

Nach Abschluss sollten Sie Folgendes durchführen können:

1. Verfügbarkeit von Host, Entwicklungsboard und RKNPU2-Laufzeitumgebung prüfen;

2. Ein ONNX-Modell mit RKNN-Toolkit2 konvertieren;

3. Die Python-Demo über das Debugging mit angeschlossenem Board ausführen;

4. Die C-Demo kompilieren und auf dem Board ausführen;

5. Bei Bedarf die vollständigen Entwicklungs-, API- oder Fehlerbehebungsdokumente aufrufen.

### 1.2 Softwarearchitektur und zentrale Komponenten

Der RKNN2-SDK-Entwicklungsablauf besteht hauptsächlich aus zwei Teilen: dem PC-Entwicklungskit und der Laufzeitumgebung auf dem Board:

PC-Entwicklungskit: RKNN-Toolkit2 konvertiert mit Deep-Learning-Werkzeugen wie ONNX, PyTorch und TensorFlow trainierte Modelle in das RKNN-Format und prüft sie durch Debugging mit angeschlossenem Board. RKNN Model Zoo bietet Beispiele zur Modellkonvertierung und Bereitstellung.

Board-Laufzeitumgebung: Nach der Konvertierung lädt und betreibt die RKNPU2 Runtime auf dem Board die RKNN-Modelle.

Die zentralen Komponenten sind:

| Komponente | Ausführungsort | Beschreibung |
| --- | --- | --- |
| RKNN-Toolkit2 | PC | Python-Werkzeuge für Modellkonvertierung, Quantisierung, Debugging mit angeschlossenem Board und weitere Kernfunktionen |
| RKNN Server (rknn_server) | Board | Hintergrund-Proxy-Dienst: empfängt PC-Befehle und Daten, ruft passende Runtime-Schnittstellen auf dem Board auf und liefert Ergebnisse an den PC zurück |
| RKNPU2 Runtime (librknnrt.so) | Board | Lädt RKNN-Modelle und führt deren Inferenz auf der NPU aus |
| RKNN Model Zoo | PC / Board | Konvertierungsskripte und Python/C++-Beispiele für verbreitete Modelle wie YOLOv5, YOLOv8 und MobileNet |

### 1.3 Beispiel auswählen

Dieser Leitfaden verwendet für den ersten Durchlauf die folgenden zwei Beispiele:

| Beispiel | Zweck | Model-Zoo-Verzeichnis |
| --- | --- | --- |
| MobileNet | Bildklassifikation | examples/mobilenet |
| YOLOv5 | Objekterkennung | examples/yolov5 |

Jedes Modellbeispiel enthält Python- und C/C++-Code. Im Folgenden heißen sie RKNN Python Demo und RKNN C Demo. Die Bedienung kann sich unterscheiden; folgen Sie jeweils der README.md im Beispielverzeichnis.

### 1.4 Unterstützte Plattformen und Versionsanforderungen

Folgende Plattformen werden unterstützt:

| Kategorie | Beschreibung |
| --- | --- |
| Hardwareplattformen | RK3562, Serien RK3566, RK3568, RK3576, RK3588, RV1126B |
| Host-Computer | Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04 |
| Python-Version | 3.8 (empfohlen) |
| RKNPU2-Treiberversion | >= 0.9.8 empfohlen |

Hinweis: Die Versionen von rknn_server, der Runtime-Bibliothek (librknnrt.so) und RKNN-Toolkit2 müssen zusammenpassen. Die neuesten Versionen werden empfohlen. Für RKNN-Modelle mit dynamischen Eingabedimensionen müssen rknn_server und Runtime die Version >= 1.5.0 haben.

### 1.5 SDK und zugehörige Repositorys beziehen

Ein eigenes Verzeichnis für die RKNN-Repositorys anlegen, etwa Projects, und dort RKNN-Toolkit2 und RKNN Model Zoo ablegen. Befehle:

```text
# Create the 'Projects' folder
mkdir Projects

# Switch to this directory
cd Projects

# Download the RKNN-Toolkit2 repository
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# Download the RKNN Model Zoo repository
git clone https://github.com/airockchip/rknn_model_zoo.git --depth 1

# Notice:
# 1. Parameter --depth 1 means to clone only the latest commit
# 2. If the 'git clone' command fails, you can also download the compressed file directly from GitHub and unzip it locally in this directory.
```

Die folgenden Beispiele verwenden standardmäßig diese Verzeichnisstruktur:

```text
Projects
├── rknn-toolkit2
│   ├── doc
│   ├── rknn-toolkit2
│   │   ├── packages
│   │   ├── docker
│   │   └── ...
│   ├── rknpu2
│   │   ├── runtime
│   │   └── ...
│   └── ...
└── rknn_model_zoo
    ├── datasets
    ├── examples
    └── ...
```

{% endraw %}
