---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Loading Caffe, TensorFlow, ONNX and PyTorch"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-toolkit-api-model-loading"
slug: "rknn-v250-toolkit-api-model-loading"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Loading Caffe, TensorFlow, ONNX and PyTorch | Complete parameters, examples and platform constraints"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Loading Caffe, TensorFlow, ONNX and PyTorch | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-toolkit-api-model-loading/"
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

<!-- source EN p12 unit 47 -->

## 4 Model Loading APIs

<!-- source EN p12 unit 48 -->

RKNN-Toolkit2 currently supports load non-RKNN models of Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet, PyTorch. There are different calling interfaces when loading models, the loading interfaces are described in detail below.

<!-- source EN p12 unit 49 -->

### 4.1 Loading Caffe model

<!-- source EN p12 unit 50 -->

| API | load_caffe |
| --- | --- |
| Description | Load Caffe model. (Unavailable in ARM64) |
| Parameter | model: The path of Caffe model structure file (suffixed with ".prototxt" ). |
| Parameter | blobs: The path of Caffe model binary data file (suffixed with ".caffemodel"). |
| Parameter | input_name: When the Caffe model has multiple inputs, you can specify the order of the<br>input layer names through this parameter, such as ['input1','input2','input3'],note that the<br>name needs to be consistent with the model input name;The default value is None,<br>means the sequence is automatically given by the Caffe model file (file suffix with<br>.prototxt). |
| Return<br>Value | 0: Import successfully. |
| Return<br>Value | -1: Import failed. |

<!-- source EN p12 unit 51 -->

The sample code is as follows:

<!-- source EN p12 unit 52 -->

```python
# Load the mobilenet_v2 Caffe model in the current path
ret = rknn.load_caffe(model='./mobilenet_v2.prototxt',
                     blobs='./mobilenet_v2.caffemodel')
```

<!-- source EN p12 unit 53 -->

### 4.2 Loading TensorFlow model

<!-- source EN p12 unit 54 -->

| API | load_tensorflow |
| --- | --- |
| Description | Load TensorFlow model. (Unavailable in ARM64) |
| Parameter | tf_pb: The path of TensorFlow model file (suffixed with ".pb"). |
| Parameter | inputs: The input node (operand name) of model, input with multiple nodes is supported<br>now. All the input node string are placed in a list. |
| Parameter | input_size_list: The shapes of input node, all the input shape are placed in a list. As in the<br>example of ssd_mobilenet_v1 model, the input_size_list parameter should be set to<br>[[1,300,300,3]]. |
| Parameter | outputs: The output node (operand name) of model, output with multiple nodes is<br>supported now. All the output nodes are placed in a list. |
| Parameter | input_is_nchw: Whether the input layout of the model is already NCHW. The default value<br>is False, means the default input layout is NHWC. |
| Return<br>value | 0: Import successfully. |
| Return<br>value | -1: Import failed. |

<!-- source EN p13 unit 56 -->

The sample code is as follows:

<!-- source EN p13 unit 57 -->

```python
# Load ssd_mobilenet_v1_coco_2017_11_17 TF model in the current path
ret = rknn.load_tensorflow(tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
                         inputs=['Preprocessor/sub'],
                         outputs=['concat', 'concat_1'],
                         input_size_list=[[300, 300, 3]])
```

<!-- source EN p13 unit 58 -->

### 4.3 Loading TensorFlow Lite model

<!-- source EN p13 unit 59 -->

| API | load_tflite |
| --- | --- |
| Description | Load TensorFlow Lite model. (Unavailable in ARM64) |
| Parameter | model: The path of TensorFlow Lite model file (suffixed with ".tflite"). |
| Parameter | input_is_nchw: Whether the input layout of the model is already NCHW. The default value<br>is False, that is, the default input layout is NHWC. |
| Return<br>Value | 0: Import successfully. |
| Return<br>Value | -1: Import failed. |

<!-- source EN p13 unit 60 -->

The sample code is as follows:

<!-- source EN p13 unit 61 -->

```python
# Load the mobilenet_v1 TF-Lite model in the current path
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

<!-- source EN p13 unit 62 -->

### 4.4 Loading ONNX model

<!-- source EN p13 unit 63 -->

| API | load_onnx |
| --- | --- |
| Description | Load ONNX model. |
| Parameter | model: The path of ONNX model file (suffixed with ".onnx"). |
| Parameter | inputs: The input node (operand name) of model, input with multiple nodes is supported<br>now. All the input node string are placed in a list. The default value is None, means get<br>from model. |
| Parameter | input_size_list: The shapes of input node, all the input shape are placed in a list. If inputs<br>set, the input_size_list should be set also. defualt is None. |
| Parameter | input_initial_val: Set the initial value of the model input, the format is ndarray list. The<br>default value is None.<br>Mainly used to fix some input as constant, For the input that does not need to be fix as a<br>constant, it can be set to None, such as [None, np.array([1])]. |
| Parameter | outputs: The output node (operand name) of model, output with multiple nodes is<br>supported now. All the output nodes are placed in a list. The default value is None, means<br>get from model. |
| Return<br>Value | 0: Import successfully. |
| Return<br>Value | -1: Import failed. |

<!-- source EN p14 unit 65 -->

The sample code is as follows:

<!-- source EN p14 unit 66 -->

```python
# Load the arcface onnx model in the current path
ret = rknn.load_onnx(model='./arcface.onnx')
```

<!-- source EN p14 unit 67 -->

### 4.5 Loading DarkNet model

<!-- source EN p14 unit 68 -->

| API | load_darknet |
| --- | --- |
| Description | Load DarkNet model. (Unavailable in ARM64) |
| Parameter | model: The path of DarkNet model structure file (suffixed with ".cfg"). |
| Parameter | weight: The path of weight file (suffixed with ".weight"). |
| Return Value | 0: Import successfully. |
| Return Value | -1: Import failed. |

<!-- source EN p14 unit 69 -->

The sample code is as follows:

<!-- source EN p14 unit 70 -->

```python
# Load the yolov3-tiny DarkNet model in the current path
ret = rknn.load_darknet(model='./yolov3-tiny.cfg',
                       weight= './yolov3.weights')
```

<!-- source EN p14 unit 71 -->

### 4.6 Loading PyTorch model

<!-- source EN p14 unit 72 -->

| API | load_pytorch |
| --- | --- |
| Description | Load PyTorch model.<br>Support the Quantization Aware Training (QAT) model, but need update torch version to<br>'1.9.0' or higher. |
| Parameter | model: The path of PyTorch model structure file (suffixed with ".pt"), and need a model in<br>the torchscript format. |
| Parameter | input_size_list: The shapes of input node, all the input shape are placed in a list. |
| Return<br>Value | 0: Import successfully. |
| Return<br>Value | -1: Import failed. |

<!-- source EN p14 unit 73 -->

The sample code is as follows:

<!-- source EN p14 unit 74 -->

```python
# Load the PyTorch model resnet18 in the current path
ret = rknn.load_pytorch(model='./resnet18.pt',
                       input_size_list=[[1,3,224,224]])
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Editorial notes: Example logs still show SDK 1.5.2 and remain historical examples, not V2.5.0 measurements. The Ubuntu20.04 Python cell differs (Chinese 3.8/3.9; English 3.8/3.8, also differing for Debian11); the ARM64 section still labels Debian x64. Source values are retained; verify the actual installation package. V2.5.0 adds the C++ codegen chapter and refines quantization and memory strategies; older parameters have not replaced the new source.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
