---
title: "RKNN auf RV1103/RV1106, Teil 1: Ablauf, Plattformen und Repositorys"
description: "RKNN auf RV1103/RV1106, Teil 1: Ablauf, Plattformen und Repositorys · RKNN2 V2.5.0"
excerpt: "RKNN auf RV1103/RV1106, Teil 1: Ablauf, Plattformen und Repositorys"
translation_key: "rknn-v250-rv1106-deployment-flow"
slug: "rknn-v250-rv1106-deployment-flow"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RV1103", "RV1106", "Mini Runtime"]
---

Plattformreferenz zum RKNN2-V2.5.0-Einstieg für RV1103/RV1103B/RV1106/RV1106B mit passendem Board-SDK, RKNPU2-Treiber und librknnmrt.so. Ein entsprechendes ArmSoM-Board ist nicht bestätigt. Das Linux-5.10.160-Protokoll und Inferenzausgaben sind Quellenbeispiele, keine ArmSoM-Hardwaretests. Versorgung, Anschlüsse und Treiber mit dem tatsächlichen Board-BSP abgleichen.

Quelle: lokale chinesische und englische V2.5.0-PDFs. Chinesisch verwendet chinesischen Text und Abbildungen, Englisch, Russisch und Deutsch die englische Quelle. Alle technischen Kapitel, Befehle und Tabellen bleiben erhalten; PDF-Zeilenumbrüche und Verzeichniseinrückungen wurden wiederhergestellt. Ein alter Treiber im Beispielprotokoll ist nicht die empfohlene Version; die Empfehlung steht im Text. Downloads und pip-Installationen ohne Versionsbindung mit dem SDK abgleichen.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN auf RV1103/RV1106, Teil 1: Ablauf, Plattformen und Repositorys**

[RKNN auf RV1103/RV1106, Teil 2: Hardwareanschluss und Geräteprüfung](/de/articles/rknn-v250-rv1106-hardware/)

[RKNN auf RV1103/RV1106, Teil 3: Host-Umgebung und Mini Runtime](/de/articles/rknn-v250-rv1106-host-runtime/)

[RKNN auf RV1103/RV1106, Teil 4: YOLOv5, Python und C-Bereitstellung](/de/articles/rknn-v250-rv1106-yolov5/)

[RKNN auf RV1103/RV1106, Teil 5: Docker, Startprobleme und Referenzen](/de/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 1. Vor dem Start

Dieser Leitfaden beschreibt den kürzesten Weg zum ersten RKNN-SDK-Lauf auf RV1103/RV1103B/RV1106/RV1106B: Hardwareanschluss, Umgebungsprüfungen, Modellkonvertierung, Board-Debugging und C/C++-Bereitstellung auf dem Board.

Den vollständigen Entwicklungsablauf, Modellkonvertierung und Quantisierung, Umgebungsinstallation und systematische Fehlerbehebung beschreibt RKNN2_SDK_Development_Guide. Python-APIs von RKNN-Toolkit2 stehen in RKNN2_Toolkit_Python_API_Reference, diejenigen von RKNN-Toolkit-Lite2 in RKNN2_Toolkit_Lite_Python_API_Reference. Boardseitige C-APIs und Schnittstellen von RKNPU2 Mini Runtime (librknnmrt.so) beschreibt RKNN2_Runtime_C_API_Reference.

### 1.1 Ziele dieses Leitfadens

Nach Abschluss sollten Sie Folgendes durchführen können:

1. Prüfen, ob Entwicklungsrechner und Board korrekt verbunden sind.

2. Die RKNN-Toolkit2-Entwicklungsumgebung installieren und überprüfen.

3. RKNPU2 Mini Runtime (librknnmrt.so) und rknn_server auf dem Board prüfen oder aktualisieren.

4. Das YOLOv5-Modell über RKNN Model Zoo herunterladen und in RKNN konvertieren.

5. Eine Board-Inferenz mit RKNN Python Demo ausführen.

6. RKNN C Demo auf dem Board kompilieren und ausführen sowie die Ausgabe prüfen.

### 1.2 Bereitstellungsablauf des RKNN SDK

Der erste Lauf auf RV1103/RV1103B/RV1106/RV1106B umfasst vor allem die Entwicklungswerkzeuge auf dem Computer und die Laufzeitumgebung auf dem Board.

| Komponente | Ort | Beschreibung |
| --- | --- | --- |
| RKNN-Toolkit2 | Computer | Konvertiert Ausgangsmodelle wie ONNX in RKNN und unterstützt Debugging mit angeschlossenem Board |
| RKNN Model Zoo | Computer | Beispiele für Modellkonvertierung, Python-Demos und C/C++-Demos |
| rknn_server | Entwicklungsboard | Verarbeitet Inferenzanfragen des Computers über USB |
| RKNPU2 Mini Runtime (librknnmrt.so) | Entwicklungsboard | Lädt RKNN-Modelle und ruft die NPU zur Inferenz auf |

Unterschiede zwischen RKNPU2 Mini Runtime und RKNPU2 Runtime:

| Merkmal | RKNPU2 Mini Runtime | RKNPU2 Runtime |
| --- | --- | --- |
| Laufzeitbibliothek | librknnmrt.so | librknnrt.so |
| Ausrichtung | Reduzierte Runtime für ressourcenbeschränkte Plattformen wie RV1103/RV1103B/RV1106/RV1106B | Standard-RKNPU2-Runtime |
| Gültigkeit für diesen Leitfaden | Anwendbar: Alle folgenden Verweise auf die Board-Laufzeitbibliothek bezeichnen librknnmrt.so | Für diese Beispiele nicht anwendbar. librknnmrt.so nicht durch librknnrt.so ersetzen |

Im weiteren Leitfaden bezeichnet RKNPU2 Mini Runtime ausdrücklich die boardseitige librknnmrt.so. Außer in diesem Vergleich wird für diese Bibliothek nicht die allgemeine Bezeichnung RKNPU2 Runtime verwendet, um Verwechslungen mit librknnrt.so zu vermeiden.

Empfohlener Ablauf für den ersten Lauf:

1. Das Board anschließen und prüfen, ob es in adb devices erscheint.

2. RKNN-Toolkit2 installieren und den Import prüfen.

3. RKNPU2-Treiber, Mini Runtime und rknn_server prüfen.

4. Das YOLOv5-Beispielmodell herunterladen und in RKNN konvertieren.

5. Zunächst RKNN Python Demo starten, um die Modellkonvertierung und den Board-Debugging-Pfad zu überprüfen.

6. RKNN C Demo kompilieren, übertragen und ausführen, um die Bereitstellung auf dem Board zu prüfen.

### 1.3 Unterstützte Plattformen und Versionsanforderungen

Dieser Leitfaden unterstützt folgende Plattformen:

| Plattform | Unterstützung |
| --- | --- |
| RV1103 | Unterstützt |
| RV1103B | Unterstützt |
| RV1106 | Unterstützt |
| RV1106B | Unterstützt |

Die Host-Beispiele basieren auf Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04. Für RKNN-Toolkit2 wird Python 3.8 empfohlen.

Hinweis: Für RV1103/RV1106 erzeugte RKNN-Modelle sind nicht mit RV1103B/RV1106B austauschbar. Bei der Konvertierung den zur tatsächlichen Platine passenden Plattformparameter wählen.

### 1.4 Beispieltyp auswählen

Für den gesamten ersten Lauf wird das YOLOv5-Beispiel aus RKNN Model Zoo verwendet.

| Beispiel | Zweck | Model-Zoo-Verzeichnis |
| --- | --- | --- |
| YOLOv5 Python Demo | Modellkonvertierung und Überprüfung der Inferenz mit angeschlossenem Board | examples/yolov5/python |
| YOLOv5 C Demo | C/C++-Kompilierung und Überprüfung der Bereitstellung auf dem Board | examples/yolov5/cpp |

Python Demo und C Demo verwenden dasselbe YOLOv5-ONNX-Modell und dasselbe konvertierte RKNN-Modell. Download und Konvertierung sind daher nur einmal erforderlich.

### 1.5 SDK und zugehörige Repositories beziehen

Ein eigenes Verzeichnis für RKNN-Repositories wird empfohlen, beispielsweise Projects. RKNN-Toolkit2 und RKNN Model Zoo dort ablegen.

```text
# Create the Projects folder
mkdir Projects

# Switch to this directory
cd Projects

# Download the RKNN-Toolkit2 repository
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# Download the RKNN Model Zoo repository
git clone https://github.com/airockchip/rknn_model_zoo.git --depth 1
```

Hinweis: --depth 1 klont nur den neuesten Commit. Falls git clone fehlschlägt, kann das Archiv direkt von GitHub heruntergeladen und in dieses Verzeichnis entpackt werden.

Standardverzeichnisstruktur der folgenden Beispiele:

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
