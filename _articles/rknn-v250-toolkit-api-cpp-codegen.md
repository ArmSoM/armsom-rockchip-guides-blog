---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Generating, building and running C++ deployment examples"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-toolkit-api-cpp-codegen"
slug: "rknn-v250-toolkit-api-cpp-codegen"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Generating, building and running C++ deployment examples | Complete parameters, examples and platform constraints"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Generating, building and running C++ deployment examples | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-toolkit-api-cpp-codegen/"
---

## Platform scope and source

This article follows the RKNN V2.5.0 vendor PDF. Only the chips and interfaces listed in the source are in scope. For an ArmSoM board, check the SoC, NPU driver, Toolkit/Runtime, SDK/BSP and kernel versions first. No ArmSoM hardware validation has been performed; source examples and measurements are not ArmSoM test results.

## Series navigation

- [Requirements and object lifecycle](/articles/rknn-v250-toolkit-api-requirements-lifecycle/)
- [Model configuration and quantization parameters](/articles/rknn-v250-toolkit-api-configuration/)
- [Loading Caffe, TensorFlow, ONNX and PyTorch](/articles/rknn-v250-toolkit-api-model-loading/)
- [Building, hybrid quantization and export](/articles/rknn-v250-toolkit-api-build-quantize-export/)
- [Runtime, operator registration and inference](/articles/rknn-v250-toolkit-api-runtime-inference/)
- [Accuracy, performance, memory and device queries](/articles/rknn-v250-toolkit-api-evaluation-query/)
- [Generating, building and running C++ deployment examples](/articles/rknn-v250-toolkit-api-cpp-codegen/)

{% raw %}

<!-- source EN p27 unit 150 -->

## 10 Generate C++ Deployment Example

<!-- source EN p27 unit 151 -->

| API | codegen |
| --- | --- |
| Description | Generates a C++ deployment example for an exported RKNN model. The example runs<br>inference through the zero-copy RKNN C API, reports performance, and can save inference<br>results as NPY files. |
| Parameter | output_path: Directory in which to generate the C++ example project. |
| Parameter | inputs: Optional list of model input file paths. The default is None. JPG, JPEG, PNG, and NPY<br>files are supported. A single string path is also accepted for a single-input model. The<br>number of files must equal the number of model inputs, and the files must be ordered in<br>model input order. The shape of each NPY array must match the corresponding original<br>model input shape; a four-dimensional NPY array uses the NCHW layout. |
| Parameter | overwrite: Whether to overwrite an existing output_path directory. The default is False. If<br>the directory exists and this value is False, the API fails. If this value is True, the existing<br>directory is removed before the project is regenerated. |
| Return<br>Value | 0: Success.<br>-1: Failure. |

<!-- source EN p27 unit 152 -->

### 10.1 Generate an Example

<!-- source EN p27 unit 153 -->

Call export_rknn before calling codegen. In the following example, the specified image is used to run the model once on the PC. The outputs are saved as golden data for device-side verification, and the default input command is written to run.sh .

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

For a multi-input model, pass a list containing one file for each model input. For example:

<!-- source EN p27 unit 156 -->

```python
ret = rknn.codegen(output_path='./rknn_app_demo',
                  inputs=['./input0.npy', './input1.npy'],
                  overwrite=True)
```

<!-- source EN p27 unit 157 -->

If inputs=None , codegen still generates a C++ project that can be used for performance testing, but it does not generate input data or golden outputs. The device program consequently does not save or compare outputs unless valid input paths are provided at run time. The dataset argument of build is not used as a substitute for the inputs argument of codegen.

<!-- source EN p28 unit 158 -->

### 10.2 Generated Files

<!-- source EN p28 unit 159 -->

After successful generation, output_path contains the following main files and directories. The data directory is generated when inputs is specified.

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

For image inputs, OpenCV reads and resizes the image during generation. The generated C++ example uses stb to read the image and performs letterbox resizing when its size does not match the model input. Because these image-processing implementations differ, the cosine similarity between a device output and its golden output may be lower than 0.9999. For model inputs that cannot use an image directly, the generation step converts the input to an FP32 NPY file.

<!-- source EN p28 unit 162 -->

### 10.3 Build and Run

<!-- source EN p28 unit 163 -->

First specify the local RKNPU2 repository. The Linux build uses a cross compiler. For RV1103/RV1103B/RV1106/RV1106B, also set GCC_COMPILER to the toolchain prefix. Set ANDROID_NDK_PATH when building for Android.

<!-- source EN p28 unit 164 -->

The Linux build script supports RV1103, RV1103B, RV1106, RV1106B, RV1126B, RK3562, RK3566, RK3568, RK3576, RK3588, and RK3588S. The Android build script supports RK3562, RK3566, RK3568, RK3576, and RK3588.

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

The resulting deployment directory is install/rknn_app_demo_Linux or install/rknn_app_demo_Android . Push the entire directory to the device and run the generated script:

<!-- source EN p28 unit 167 -->

```text
adb push ./install/rknn_app_demo_Linux /data/
adb shell
cd /data/rknn_app_demo_Linux
./run.sh
```

<!-- source EN p29 unit 168 -->

Alternatively, invoke the executable directly:

<!-- source EN p29 unit 169 -->

```text
./rknn_app_demo <model_path> [input_paths] [repeat_times]
```

<!-- source EN p29 unit 170 -->

If input_paths is omitted, the program only runs inference and reports performance; it does not save outputs.

<!-- source EN p29 unit 171 -->

For a multi-input model, join input paths with # in model input order. For example: ./data/inputs/input0.npy#./data/inputs/input1.npy .

<!-- source EN p29 unit 172 -->

repeat_times is a positive integer that sets the inference loop count. To set the loop count without specifying inputs, pass an empty string, for example: ./rknn_app_demo ./mobilenet_v2.rknn "" 100 .

<!-- source EN p29 unit 173 -->

When valid inputs are provided, all outputs are saved as FP32 NPY files in data/outputs/runtime . If a same-named reference output exists in data/outputs/golden , the program also prints the cosine similarity between the two files.

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Editorial notes: Example logs still show SDK 1.5.2 and remain historical examples, not V2.5.0 measurements. The Ubuntu20.04 Python cell differs (Chinese 3.8/3.9; English 3.8/3.8, also differing for Debian11); the ARM64 section still labels Debian x64. Source values are retained; verify the actual installation package. V2.5.0 adds the C++ codegen chapter and refines quantization and memory strategies; older parameters have not replaced the new source.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
