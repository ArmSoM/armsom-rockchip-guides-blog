---
title: "RKNN2 V2.5.0 quickstart 4: MobileNet conversion and deployment"
description: "RKNN2 V2.5.0 quickstart 4: MobileNet conversion and deployment · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0 quickstart 4: MobileNet conversion and deployment"
translation_key: "rknn-v250-sdk-quickstart-mobilenet"
slug: "rknn-v250-sdk-quickstart-mobilenet"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Scope: RKNN2 V2.5.0 platform reference covering RK3562, the RK3566/3568/3576/3588 series and RV1126B. An ArmSoM board with the same SoC still needs a matching BSP, NPU driver and Runtime; do not copy Rockchip EVB power, USB or firmware assumptions directly. Host and driver requirements are listed below. No ArmSoM hardware validation was performed.

Adapted from the local Chinese and English V2.5.0 sources, retaining section numbers. Chinese uses Chinese figures; English, Russian and German use English-source figures. PDF wraps, continued tables and code indentation are restored. Example outputs are not ArmSoM tests.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN2 V2.5.0 quickstart 1: deployment flow, platforms and SDK repositories](/articles/rknn-v250-sdk-quickstart-deployment-flow/)

[RKNN2 V2.5.0 quickstart 2: hardware connection and ADB checks](/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0 quickstart 3: Toolkit, Android/Linux Runtime and compilers](/articles/rknn-v250-sdk-quickstart-environment/)

**RKNN2 V2.5.0 quickstart 4: MobileNet conversion and deployment**

[RKNN2 V2.5.0 quickstart 5: YOLOv5 detection and accuracy evaluation](/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0 quickstart 6: Docker, startup issues and references](/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 4. Run Example Models

This chapter uses two examples, MobileNet (image classification) and YOLOv5 (object detection), to demonstrate a minimal closed loop of "get the model -> convert -> run on board -> compile and deploy -> run on board -> check the results". For the complete model conversion configuration, quantization methods, accuracy/performance/memory evaluation, and API calling sequence, please refer to the RKNN2 SDK Development Guide document.

### 4.1 Run the Image Classification Example

This section takes the MobileNet model as an example to introduce the conversion, on-board running, and board deployment of the image classification model. The example is located in the examples/mobilenet directory.

#### 4.1.1 Convert the Model

Switch to the rknn_model_zoo/examples/mobilenet/model directory and run the download_model.sh script to download the MobileNet ONNX model:

```text
# Switch to the rknn_model_zoo/examples/mobilenet/model directory
cd Projects/rknn_model_zoo/examples/mobilenet/model

# Download the mobilenetv2-12.onnx model
./download_model.sh
```

Switch to the rknn_model_zoo/examples/mobilenet/python directory and run the mobilenet.py script. This script converts the ONNX model to the RKNN model:

```text
# Switch to the rknn_model_zoo/examples/mobilenet/python directory
cd Projects/rknn_model_zoo/examples/mobilenet/python

# Usage: python mobilenet.py --model <onnx_model> --target <TARGET_PLATFORM> [--dtype <i8/fp>]
# Note: Here, the example is for the rk3588 platform. If using a different board, modify the platform type in the command accordingly
python mobilenet.py --model ../model/mobilenetv2-12.onnx --target rk3588
```

Where --dtype defaults to i8 (8-bit quantization) if omitted, and fp means no quantization. After the conversion, this command runs inference directly on the PC simulator without connecting the development board. The converted model is saved as examples/mobilenet/model/mobilenet_v2.rknn by default.

#### 4.1.2 Run the RKNN Python Demo

Simulator inference: Without the --npu_device_test parameter, inference runs on the PC simulator. The command is the same as in Section 4.1.1, which is suitable for quick verification without a board.

On-board running: Append the --npu_device_test parameter to run inference on the board via on-board debugging:

```text
python mobilenet.py --model ../model/mobilenetv2-12.onnx --target rk3588 --npu_device_test
```

After the successful execution of the script, the TOP5 classification results will be output as follows:

```text
-----TOP 5-----
[494] score=0.990035 class=n03017168 chime, bell, gong
[469] score=0.003907 class=n02939185 caldron, cauldron
[653] score=0.001089 class=n03764736 milk can
[747] score=0.000945 class=n04023962 punching bag, punch bag, punching ball,
punchball
[442] score=0.000712 class=n02825657 bell cote, bell cot
```

The value in square brackets is the class index, score is the confidence score, and class is the class name.

#### 4.1.3 Run the RKNN C Demo

To run an RKNN C Demo, you need to first compile the C/C++ source code into an executable file, then push it to the board, and finally run it on the board. Before compiling, install the compilation tools first (see Section 3.4): configure ANDROID_NDK_PATH at the beginning of the build-android.sh script for Android boards, or GCC_COMPILER at the beginning of the build-linux.sh script for Linux boards. For the parameters of the build scripts, refer to the README.md in each example directory.

**1. Compilation**

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

**2. Push Files to the Board**

After compilation, the executable file is located in the rknn_mobilenet_demo folder under the install directory:

```text
# Board running on the Android system
adb root
adb push install/rk3588_android_arm64-v8a/rknn_mobilenet_demo /data/

# Board running on the Linux system
adb push install/rk3588_linux_aarch64/rknn_mobilenet_demo /userdata/
```

**3. Run the Demo on the Board**

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

The output is in the same TOP5 format as in Section 4.1.2.

{% endraw %}
