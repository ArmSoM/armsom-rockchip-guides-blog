---
title: "RKNN2 V2.5.0, Teil 5: YOLOv5-Erkennung und Genauigkeitsbewertung"
description: "RKNN2 V2.5.0, Teil 5: YOLOv5-Erkennung und Genauigkeitsbewertung · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, Teil 5: YOLOv5-Erkennung und Genauigkeitsbewertung"
translation_key: "rknn-v250-sdk-quickstart-yolov5"
slug: "rknn-v250-sdk-quickstart-yolov5"
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

[RKNN2 V2.5.0, Teil 1: Bereitstellung, Plattformen und SDK-Repositorys](/de/articles/rknn-v250-sdk-quickstart-deployment-flow/)

[RKNN2 V2.5.0, Teil 2: Hardwareanschluss und ADB-Prüfung](/de/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0, Teil 3: Toolkit, Android/Linux-Runtime und Compiler](/de/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0, Teil 4: MobileNet konvertieren und bereitstellen](/de/articles/rknn-v250-sdk-quickstart-mobilenet/)

**RKNN2 V2.5.0, Teil 5: YOLOv5-Erkennung und Genauigkeitsbewertung**

[RKNN2 V2.5.0, Teil 6: Docker, Startprobleme und Referenzen](/de/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

### 4.2 Objekterkennungsbeispiel ausführen

YOLOv5 zeigt Konvertierung, Ausführung mit angeschlossenem Board, Bereitstellung und Genauigkeitsbewertung eines Objektdetektors. Das Beispiel liegt in examples/yolov5.

#### 4.2.1 Modell konvertieren

In rknn_model_zoo/examples/yolov5/model download_model.sh ausführen. Das Skript lädt ein verfügbares YOLOv5-ONNX-Modell in das aktuelle model-Verzeichnis. Befehle:

```text
# Switch to the rknn_model_zoo/examples/yolov5/model directory
cd Projects/rknn_model_zoo/examples/yolov5/model

# Run the download_model.sh script to download the yolov5 ONNX model
# For example, the downloaded ONNX model is stored at model/yolov5s_relu.onnx
./download_model.sh
```

Nach rknn_model_zoo/examples/yolov5/python wechseln und convert.py ausführen. Das Skript konvertiert das ursprüngliche ONNX-Modell in ein RKNN-Modell. Beispielbefehle:

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the convert.py script to convert the original ONNX model to RKNN format
# Usage: python convert.py model_path [rk3566|rk3588|rk3562] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5s_relu.rknn
```

i8 aktiviert hier die 8-Bit-Quantisierung. Nach der Konvertierung entsteht im Modellverzeichnis die entsprechende .rknn-Datei.

#### 4.2.2 RKNN Python Demo ausführen

Die RKNN Python Demo führt YOLOv5 über das Debugging mit angeschlossenem Board aus. In rknn_model_zoo/examples/yolov5/python yolov5.py starten:

```text
# Run the yolov5.py script to run the yolov5 model on the board
# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform} --img_show

# If the --img_show parameter is included, the result image will be displayed
# Note: Here, the example is for the rk3588 platform. If using a different board, modify the platform type in the command accordingly
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588 --img_show

# If you want to run the original onnx model on the computer first, you can use the following command
# Usage: python yolov5.py --model_path {onnx_model} --img_show
python yolov5.py --model_path ../model/yolov5s_relu.onnx --img_show
```

Nach erfolgreicher Skriptausführung erscheint folgende Ausgabe. class bezeichnet die vorhergesagte Kategorie, score den Konfidenzwert; (xmin, ymin) sind die Koordinaten der linken oberen, (xmax, ymax) der rechten unteren Ecke des Erkennungsrahmens.

```text
# class @ (xmin, ymin, xmax, ymax) score
person @ (209 244 286 506) 0.884
person @ (478 238 559 526) 0.868
person @ (110 238 230 534) 0.825
bus @ (94 129 553 468) 0.705
person @ (79 354 122 516) 0.339
```

Das Standard-Eingabebild ist model/bus.jpg. Das Ergebnisbild folgt:

![Abbildung der englischen Quelle · PDF 27](/assets/images/rknn-v250/sdkquick/en/p027-figure-01.png)

*Abbildung der englischen Quelle · PDF 27*

Abb. 4-1 Visualisiertes Ergebnis der RKNN Python Demo

#### 4.2.3 RKNN C Demo ausführen

Zuerst C/C++-Quellcode zu einer ausführbaren Datei kompilieren, auf das Board übertragen und dort starten. Zuvor die Werkzeuge aus Abschnitt 3.4 installieren: Für Android ANDROID_NDK_PATH am Anfang von build-android.sh setzen, für Linux GCC_COMPILER am Anfang von build-linux.sh. Build-Parameter stehen in der README.md des jeweiligen Beispiels.

1. Kompilierung

```text
# Board running on the Android system
# Note: configure ANDROID_NDK_PATH at the beginning of the build-android.sh script
cd Projects/rknn_model_zoo
./build-android.sh -t rk3588 -a arm64-v8a -d yolov5

# Board running on the Linux system
# Note: configure GCC_COMPILER at the beginning of the build-linux.sh script
cd Projects/rknn_model_zoo
./build-linux.sh -t rk3588 -a aarch64 -d yolov5
```

2. Dateien auf das Board übertragen

Nach der Kompilierung liegt die ausführbare Datei im Ordner rknn_yolov5_demo unter install:

```text
# Board running on the Android system
adb root
adb push install/rk3588_android_arm64-v8a/rknn_yolov5_demo /data/

# Board running on the Linux system
adb push install/rk3588_linux_aarch64/rknn_yolov5_demo /userdata/
```

3. Demo auf dem Board ausführen

```text
# Switch to the board
adb shell

# Switch to the rknn_yolov5_demo directory
# /data/rknn_yolov5_demo for Android, /userdata/rknn_yolov5_demo for Linux
cd /userdata/rknn_yolov5_demo

# Set the library dependency environment
export LD_LIBRARY_PATH=./lib

# Run the executable file
# Usage: ./rknn_yolov5_demo <model_path> <input_path>
./rknn_yolov5_demo model/yolov5s_relu.rknn model/bus.jpg
```

Das Ausgabebild wird standardmäßig unter rknn_yolov5_demo/out.png gespeichert. Mit adb vom Board auf den Computer übertragen. Dazu im lokalen Computerterminal folgenden Befehl ausführen:

```text
# Pull to the local current directory
adb pull /userdata/rknn_yolov5_demo/out.png .
```

Ausgabebild:

![Abbildung der englischen Quelle · PDF 29](/assets/images/rknn-v250/sdkquick/en/p029-figure-01.png)

*Abbildung der englischen Quelle · PDF 29*

Abb. 4-2 Visualisiertes Ergebnis der RKNN C Demo

Beim ersten Lauf genügt es, den normalen Abschluss der Demo und die Erzeugung von out.png zu prüfen. Die tatsächlichen Erkennungen hängen von Modellversion, Eingabebild und Laufzeitumgebung ab.

#### 4.2.4 Genauigkeit am Datensatz bewerten (optional)

rknn_model_zoo/datasets enthält Datensätze zur Genauigkeitsbewertung. Den benötigten Datensatz zuerst herunterladen und dort speichern. Für YOLOv5 wird COCO benötigt: In rknn_model_zoo/datasets/COCO download_eval_dataset.py ausführen. Das Skript lädt val2017 in das aktuelle COCO-Verzeichnis. Befehle:

```text
# Switch to the rknn_model_zoo/datasets/COCO directory
cd Projects/rknn_model_zoo/datasets/COCO

# Run the download_eval_dataset.py script to download the COCO dataset
python download_eval_dataset.py
```

Für die Datensatzbewertung --coco_map_test und den Datensatzpfad --img_folder angeben. Befehle:

```text
# Please install pycocotools first
pip install pycocotools

# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd Projects/rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script
python yolov5.py \
    --model_path ../model/yolov5s_relu.rknn \
    --target rk3588 \
    --img_folder ../../../datasets/COCO/val2017 \
    --coco_map_test
```

Hinweis: Für den schichtweisen Vergleich der Inferenzergebnisse des quantisierten Modells mit dem Gleitkommamodell rknn.accuracy_analysis() aus RKNN-Toolkit2 verwenden. Siehe „Model Accuracy Analysis“ im RKNN2 SDK Development Guide.

{% endraw %}
