---
title: "RKNN auf RV1103/RV1106, Teil 4: YOLOv5, Python und C-Bereitstellung"
description: "RKNN auf RV1103/RV1106, Teil 4: YOLOv5, Python und C-Bereitstellung · RKNN2 V2.5.0"
excerpt: "RKNN auf RV1103/RV1106, Teil 4: YOLOv5, Python und C-Bereitstellung"
translation_key: "rknn-v250-rv1106-yolov5"
slug: "rknn-v250-rv1106-yolov5"
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

[RKNN auf RV1103/RV1106, Teil 1: Ablauf, Plattformen und Repositorys](/de/articles/rknn-v250-rv1106-deployment-flow/)

[RKNN auf RV1103/RV1106, Teil 2: Hardwareanschluss und Geräteprüfung](/de/articles/rknn-v250-rv1106-hardware/)

[RKNN auf RV1103/RV1106, Teil 3: Host-Umgebung und Mini Runtime](/de/articles/rknn-v250-rv1106-host-runtime/)

**RKNN auf RV1103/RV1106, Teil 4: YOLOv5, Python und C-Bereitstellung**

[RKNN auf RV1103/RV1106, Teil 5: Docker, Startprobleme und Referenzen](/de/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 4. Erstes allgemeines Modell ausführen

Am Beispiel RV1106 und YOLOv5 werden Modellbeschaffung, RKNN-Konvertierung, Python-Board-Inferenz und C/C++-Bereitstellung durchgeführt.

Hinweis: Parameter und Verwendung unterscheiden sich möglicherweise zwischen Model-Zoo-Beispielen. Die README.md im jeweiligen Beispielverzeichnis beachten.

### 4.1 Beispiel und Modell beziehen

RKNN Model Zoo enthält Beispielcode für verbreitete Modelle. Projektstruktur:

```text
rknn_model_zoo
├── 3rdparty # Third-party libraries
├── datasets # Datasets
├── examples # Example code
├── utils # Common utilities, such as file operations and drawing
├── build-android.sh # Build script for Android development boards
├── build-linux.sh # Build script for Linux development boards
└── ...
```

Am Beispiel YOLOv5:

```text
rknn_model_zoo
├── examples
│   └── yolov5
│       ├── cpp # C/C++ example code
│       ├── model # Models, test images, and other files
│       ├── python # Model conversion script and Python example code
│       └── README.md
└── ...
```

In model wechseln und download_model.sh zum Herunterladen des YOLOv5-ONNX-Modells ausführen:

```text
cd Projects/rknn_model_zoo/examples/yolov5/model

# Download the yolov5 ONNX model
# Example download result: model/yolov5s_relu.onnx
./download_model.sh
```

### 4.2 Modell konvertieren

Im Python-Beispielverzeichnis von YOLOv5 das ONNX-Modell mit convert.py in RKNN konvertieren:

```text
cd Projects/rknn_model_zoo/examples/yolov5/python

# Usage: python convert.py model_path [rv1103|rv1103b|rv1106|rv1106b] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rv1106 i8 ../model/yolov5s_relu.rknn
```

RKNN-Modelle für RV1103/RV1106 sind nicht mit RV1103B/RV1106B austauschbar. Bei einem anderen Board den Plattformparameter entsprechend ändern.

### 4.3 RKNN Python Demo ausführen

RKNN Python Demo führt das konvertierte YOLOv5-RKNN-Modell über Board-Debugging auf dem Board aus:

```text
cd Projects/rknn_model_zoo/examples/yolov5/python

# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform} --img_show
# --img_show displays the result image
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rv1106 --img_show
```

Um zunächst das ursprüngliche ONNX-Modell auf dem Computer auszuführen:

```text
python yolov5.py --model_path ../model/yolov5s_relu.onnx --img_show
```

Standardeingabebild ist model/bus.jpg. Das Ergebnis der Quelle ist unten dargestellt:

![Abbildung der englischen Quelle · PDF 22](/assets/images/rknn-v250/rv1106/en/p022-figure-01.png)

*Abbildung der englischen Quelle · PDF 22*

Abbildung 4-1. Ausgabebild von RKNN Python Demo

Eine erfolgreiche Python-Demo-Inferenz bestätigt den grundlegenden Pfad aus Modellkonvertierung, ADB-Verbindung, rknn_server und boardseitiger Mini Runtime.

### 4.4 RKNN C Demo kompilieren und bereitstellen

Python Demo und C Demo verwenden dasselbe konvertierte RKNN-Modell; Abschnitte 4.1 und 4.2 müssen nicht wiederholt werden.

Für RKNN C Demo den C/C++-Quellcode kompilieren und anschließend Programm, Modell, Testbild und benötigte Bibliotheken auf das Board übertragen.

#### 4.4.1 Kompilierung

Als Beispiel dient RV1106 mit Linux und armhf. RV1103/RV1103B sind ebenfalls Linux-Boards.

Vor dem Start von build-linux.sh den lokalen GCC-Cross-Compilerpfad angeben. Folgende Zeile an den Anfang von build-linux.sh setzen:

```text
GCC_COMPILER=Projects/arm-rockchip831-linux-uclibcgnueabihf/bin/arm-rockchip831-linux-uclibcgnueabihf
```

Anschließend kompilieren:

```text
cd Projects/rknn_model_zoo

# Usage: ./build-linux.sh -t <target> -a <arch> -d <build_demo_name> [-b <build_type>] [-m]
# -t : target (rv1103/rv1106); rv1103b/rv1106b and rv1103/rv1106 can share code other than models
# -a : arch (aarch64/armhf)
# -d : demo name, corresponding to a subdirectory under examples, such as yolov5 or mobilenet
# -b : build_type(Debug/Release)
# -m : enable address sanitizer; build_type must be set to Debug
./build-linux.sh -t rv1106 -a armhf -d yolov5
```

#### 4.4.2 Dateien auf das Board übertragen

Nach dem Build entsteht unter rknn_model_zoo ein install-Verzeichnis mit Programm, Bibliotheken, Modell und Testbild. Beispielstruktur:

```text
install
└── rv1106_linux_armhf
    └── rknn_yolov5_demo
        ├── lib
        ├── model
        └── rknn_yolov5_demo
```

Das gesamte Demo-Verzeichnis auf das Board übertragen:

```text
cd Projects/rknn_model_zoo

# For different models and platforms, select the corresponding path under install
adb push install/rv1106_linux_armhf/rknn_yolov5_demo /data/
```

### 4.5 Auf dem Board ausführen und Ausgabe prüfen

Auf das Board wechseln und das Programm ausführen:

```text
adb shell

cd /data/rknn_yolov5_demo/

# Set the dependency library environment
export LD_LIBRARY_PATH=/data/rknn_yolov5_demo/lib

# Usage: ./rknn_yolov5_demo <model_path> <input_path>
./rknn_yolov5_demo model/yolov5s_relu.rknn model/bus.jpg
```

Standardmäßig wird das Ausgabebild als rknn_yolov5_demo/out.png gespeichert. Das Ergebnis mit folgendem Befehl vom Computer aus abrufen:

```text
adb pull /data/rknn_yolov5_demo/out.png .
```

Ausgabebild der Quelle:

![Abbildung der englischen Quelle · PDF 25](/assets/images/rknn-v250/rv1106/en/p025-figure-01.png)

*Abbildung der englischen Quelle · PDF 25*

Abbildung 4-2. Ausgabebild von RKNN C Demo

Wenn out.png erzeugt und erfolgreich abgerufen wird, ist die erste Prüfung von C/C++-Build, Dateibereitstellung, Mini-Runtime-Laden und Board-Inferenz abgeschlossen.

### 4.6 Datensatzbasierte Genauigkeitsbewertung (optional)

rknn_model_zoo/datasets enthält Datensätze zur Genauigkeitsbewertung. Für YOLOv5 zunächst den COCO-Validierungsdatensatz herunterladen.

```text
cd Projects/rknn_model_zoo/datasets/COCO

# Download the val2017 dataset
python download_eval_dataset.py
```

pycocotools installieren und Bewertungsmodus sowie Datensatzpfad mit --coco_map_test und --img_folder angeben:

```text
pip install pycocotools

cd Projects/rknn_model_zoo/examples/yolov5/python

python yolov5.py \
    --model_path ../model/yolov5s_relu.rknn \
    --target rv1106 \
    --img_folder ../../../datasets/COCO/val2017 \
    --coco_map_test
```

{% endraw %}
