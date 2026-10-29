---
title: "RKNN2 V2.5.0, Teil 4: MobileNet konvertieren und bereitstellen"
description: "RKNN2 V2.5.0, Teil 4: MobileNet konvertieren und bereitstellen · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, Teil 4: MobileNet konvertieren und bereitstellen"
translation_key: "rknn-v250-sdk-quickstart-mobilenet"
slug: "rknn-v250-sdk-quickstart-mobilenet"
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

**RKNN2 V2.5.0, Teil 4: MobileNet konvertieren und bereitstellen**

[RKNN2 V2.5.0, Teil 5: YOLOv5-Erkennung und Genauigkeitsbewertung](/de/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0, Teil 6: Docker, Startprobleme und Referenzen](/de/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 4. Beispielmodelle ausführen

MobileNet (Bildklassifikation) und YOLOv5 (Objekterkennung) zeigen einen minimalen vollständigen Ablauf: Modell beziehen → konvertieren → mit angeschlossenem Board ausführen → kompilieren und bereitstellen → auf dem Board ausführen → Ergebnisse prüfen. Vollständige Konvertierungskonfiguration, Quantisierungsmethoden, Genauigkeits-/Leistungs-/Speicherbewertung und API-Aufrufreihenfolge stehen im RKNN2 SDK Development Guide.

### 4.1 Bildklassifikationsbeispiel ausführen

MobileNet dient als Beispiel für Konvertierung, Ausführung mit angeschlossenem Board und Bereitstellung eines Klassifikationsmodells. Das Beispiel liegt in examples/mobilenet.

#### 4.1.1 Modell konvertieren

In rknn_model_zoo/examples/mobilenet/model download_model.sh ausführen, um das MobileNet-ONNX-Modell herunterzuladen:

```text
# Switch to the rknn_model_zoo/examples/mobilenet/model directory
cd Projects/rknn_model_zoo/examples/mobilenet/model

# Download the mobilenetv2-12.onnx model
./download_model.sh
```

In rknn_model_zoo/examples/mobilenet/python mobilenet.py ausführen. Das Skript konvertiert ONNX in RKNN:

```text
# Switch to the rknn_model_zoo/examples/mobilenet/python directory
cd Projects/rknn_model_zoo/examples/mobilenet/python

# Usage: python mobilenet.py --model <onnx_model> --target <TARGET_PLATFORM> [--dtype <i8/fp>]
# Note: Here, the example is for the rk3588 platform. If using a different board, modify the platform type in the command accordingly
python mobilenet.py --model ../model/mobilenetv2-12.onnx --target rk3588
```

Ohne --dtype gilt i8 (8-Bit-Quantisierung); fp bedeutet keine Quantisierung. Nach der Konvertierung führt der Befehl die Inferenz im PC-Simulator ohne angeschlossenes Board aus. Das Modell wird standardmäßig als examples/mobilenet/model/mobilenet_v2.rknn gespeichert.

#### 4.1.2 RKNN Python Demo ausführen

Simulatorinferenz: Ohne --npu_device_test läuft die Inferenz im PC-Simulator. Der Befehl entspricht Abschnitt 4.1.1 und eignet sich zur schnellen Prüfung ohne Board.

Ausführung auf dem Board: --npu_device_test ergänzen, um die Inferenz über das Debugging mit angeschlossenem Board auszuführen:

```text
python mobilenet.py --model ../model/mobilenetv2-12.onnx --target rk3588 --npu_device_test
```

Nach erfolgreicher Ausführung erscheinen die TOP5-Klassifikationsergebnisse:

```text
-----TOP 5-----
[494] score=0.990035 class=n03017168 chime, bell, gong
[469] score=0.003907 class=n02939185 caldron, cauldron
[653] score=0.001089 class=n03764736 milk can
[747] score=0.000945 class=n04023962 punching bag, punch bag, punching ball,
punchball
[442] score=0.000712 class=n02825657 bell cote, bell cot
```

Der Wert in eckigen Klammern ist der Klassenindex, score der Konfidenzwert und class der Klassenname.

#### 4.1.3 RKNN C Demo ausführen

Zuerst C/C++-Quellcode zu einer ausführbaren Datei kompilieren, auf das Board übertragen und dort starten. Zuvor die Werkzeuge aus Abschnitt 3.4 installieren: Für Android ANDROID_NDK_PATH am Anfang von build-android.sh setzen, für Linux GCC_COMPILER am Anfang von build-linux.sh. Build-Parameter stehen in der README.md des jeweiligen Beispiels.

1. Kompilierung

```text
# Board running on the Android system
# Note: configure ANDROID_NDK_PATH at the beginning of the build-android.sh script
cd Projects/rknn_model_zoo
./build-android.sh -t rk3588 -a arm64-v8a -d mobilenet

# Board running on the Linux system
# Note: configure GCC_COMPILER at the beginning of the build-linux.sh script
cd Projects/rknn_model_zoo
./build-linux.sh -t rk3588 -a aarch64 -d mobilenet
```

2. Dateien auf das Board übertragen

Nach der Kompilierung liegt die ausführbare Datei im Ordner rknn_mobilenet_demo unter install:

```text
# Board running on the Android system
adb root
adb push install/rk3588_android_arm64-v8a/rknn_mobilenet_demo /data/

# Board running on the Linux system
adb push install/rk3588_linux_aarch64/rknn_mobilenet_demo /userdata/
```

3. Demo auf dem Board ausführen

```text
# Switch to the board
adb shell

# Switch to the rknn_mobilenet_demo directory
# /data/rknn_mobilenet_demo for Android, /userdata/rknn_mobilenet_demo for Linux
cd /userdata/rknn_mobilenet_demo

# Set the library dependency environment
export LD_LIBRARY_PATH=./lib

# Run the executable file
# Usage: ./rknn_mobilenet_demo <model_path> <input_path>
./rknn_mobilenet_demo model/mobilenet_v2.rknn model/bell.jpg
```

Die Ausgabe hat dasselbe TOP5-Format wie in Abschnitt 4.1.2.

{% endraw %}
