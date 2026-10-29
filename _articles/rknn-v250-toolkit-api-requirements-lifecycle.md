---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Requirements and object lifecycle"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-toolkit-api-requirements-lifecycle"
slug: "rknn-v250-toolkit-api-requirements-lifecycle"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Requirements and object lifecycle | Complete parameters, examples and platform constraints"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Requirements and object lifecycle | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-toolkit-api-requirements-lifecycle/"
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

<!-- source EN p5 unit 0 -->

## 1 Requirement

<!-- source EN p5 unit 1 -->

### 1.1 Applicable chip model

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

RK3566 series

<!-- source EN p5 unit 10 -->

RK3568 series

<!-- source EN p5 unit 11 -->

RK3576 series

<!-- source EN p5 unit 12 -->

RK3588 series

<!-- source EN p5 unit 13 -->

Note: RK3566 / RK3568 / RK3576 / RK3588 are collectively referred to as RK3566 series / RK3568 series / RK3576 series / RK3588 series in the following text.

<!-- source EN p5 unit 14 -->

### 1.2 Requirements Dependencies

<!-- source EN p5 unit 15 -->

It is recommended to meet the following requirements in the operating system environment:

<!-- source EN p5 unit 16 -->

| Operating<br>system<br>version | Ubuntu18.04(x64) | Ubuntu20.04(x64) | Ubuntu22.04(x64) | Ubuntu24.04(x64) |
| --- | --- | --- | --- | --- |
| Python<br>version | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 | 3.12 |

<!-- source EN p5 unit 17 -->

For ARM64:

<!-- source EN p5 unit 18 -->

| Operating system version | Debian10(x64) | Debian11(x64) | Debian12(x64) |
| --- | --- | --- | --- |
| Python version | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 / 3.12 |

<!-- source EN p5 unit 19 -->

Note:

<!-- source EN p5 unit 20 -->

1. For more detail about python library dependencies, see doc/requirements*.txt

<!-- source EN p5 unit 21 -->

2. This document mainly uses Ubuntu 20.04 / Python3.8 as an example.

<!-- source EN p5 unit 22 -->

### 1.3 Supported Deep Learning Framework

<!-- source EN p5 unit 23 -->

The deep learning frameworks supported by RKNN-Toolkit2 include Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet and PyTorch.

<!-- source EN p5 unit 24 -->

The corresponding relationship between RKNN-Toolkit2 and the version of each deep learning framework is as follows:

<!-- source EN p6 unit 25 -->

| RKNN-Toolkit2 | Caffe | TensorFlow | TF Lite | ONNX | DarkNet | PyTorch |
| --- | --- | --- | --- | --- | --- | --- |
| 1.4.0<br>1.4.2<br>1.5.0<br>1.5.2 | 1.0 | 1.12.0<br>~2.8.0 | Schema<br>version=3 | 1.7.0<br>~1.10.0 | Commit ID:<br>810d7f7 | 1.6.0<br>~1.10.1 |
| 1.6.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema<br>version=3 | 1.7.0<br>~1.14.0 | Commit ID:<br>810d7f7 | 1.6.0<br>~1.13.1 |
| 2.0.0<br>2.1.0<br>2.2.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema<br>version=3 | 1.7.0<br>~1.14.1 | Commit ID:<br>810d7f7 | 1.10.1<br>~2.1.0 |
| 2.3.0<br>~2.5.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema<br>version=3 | 1.7.0<br>~1.17.0 | Commit ID:<br>810d7f7 | 1.10.1<br>~2.4.0 |

<!-- source EN p6 unit 26 -->

Note:

<!-- source EN p6 unit 27 -->

1. Due to the compatibility of TensorFlow versions, the pb files exported by versions before TensorFlow 1.12.0 are also supported in theory.. For more information about the compatibility of different TensorFlow versions, please refer to official documentation: https://www.tensorflow.org/guide/versions

<!-- source EN p6 unit 28 -->

2. Since the schemas of different versions of TFLite are incompatible with each other, TFLite model exported from a different schema compared to the schema version RKNN-Toolkit2 relies may cause loading failure.

<!-- source EN p6 unit 29 -->

3. The Caffe protocols used by RKNN-Toolkit2 is the protocol based on the official modification of berkeley. The protocol based on berkeley's official modification comes from: https://github.com/BVLC/caffe/tree/master/src/caffe/proto and the commit ID is 828dd10. RKNN-Toolkit2 adds some OPs on this basis.

<!-- source EN p6 unit 30 -->

4. For the relationship between ONNX release versions and opset versions and IR versions, please refer to the onnxruntime official website: https://github.com/microsoft/onnxruntime/blob/v1.10.0/docs/Versioning.md

<!-- source EN p6 unit 31 -->

5. The official Github link of DarkNet: https://github.com/pjreddie/darknet. RKNN-Toolkit2’s current conversion rules are based on the latest submission of the master branch (commit number: 810d7f7).

<!-- source EN p6 unit 32 -->

6. When loading the PyTorch model (torchscript model), it is recommended using the same version of PyTorch to export model and convert model to RKNN model. Inconsistency may result in failure when transferring to the RKNN model.

<!-- source EN p6 unit 33 -->

7. ARM64 only supports the PyTorch and ONNX. Other framework is not supported at the moment.

<!-- source EN p7 unit 34 -->

## 2 RKNN Object and Resource Lifecycle

<!-- source EN p7 unit 35 -->

The initialization/release function group consists of API interfaces to initialize and release the RKNN object as needed. The RKNN() must be called before using all the API interfaces of RKNN- Toolkit2, and call the release() method to release the object when task finished.

<!-- source EN p7 unit 36 -->

When the RKNN object is initing, the users can set verbose and verbose_file parameters, used to print detailed log information of model loading, building and so on. The data type of verbose parameter is bool. If the value of this parameter is set to True, the RKNN-Toolkit2 will print detailed log information. The data type of verbose_file is string. If the value of this parameter is set to a file path, the detailed log information will be written to this file (the verbose also need be set to True).

<!-- source EN p7 unit 37 -->

The sample code is as follows:

<!-- source EN p7 unit 38 -->

```python
# Print the detailed log information.
rknn = RKNN(verbose=True)

...

rknn.release()
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Editorial notes: Example logs still show SDK 1.5.2 and remain historical examples, not V2.5.0 measurements. The Ubuntu20.04 Python cell differs (Chinese 3.8/3.9; English 3.8/3.8, also differing for Debian11); the ARM64 section still labels Debian x64. Source values are retained; verify the actual installation package. V2.5.0 adds the C++ codegen chapter and refines quantization and memory strategies; older parameters have not replaced the new source.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
