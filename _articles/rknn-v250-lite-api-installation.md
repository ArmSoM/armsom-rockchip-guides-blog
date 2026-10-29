---
title: "RKNN Toolkit Lite2 V2.5.0, part 1: installation, ResNet18 and return conventions"
description: "RKNN Toolkit Lite2 V2.5.0, part 1: installation, ResNet18 and return conventions · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, part 1: installation, ResNet18 and return conventions"
translation_key: "rknn-v250-lite-api-installation"
slug: "rknn-v250-lite-api-installation"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Platform reference for RKNN Toolkit Lite2 V2.5.0, Debian 10/11/12 aarch64 and the SoCs listed in the source. For an ArmSoM board, verify SoC, architecture, Python wheel, BSP NPU driver and Runtime compatibility. No hardware tests were performed. The source encryption section lists more platforms than the Lite2 installation table; both are retained without extending Lite2 device support by inference.

Adapted from the local Chinese and English V2.5.0 sources, retaining section numbers. Chinese uses Chinese figures; English, Russian and German use English-source figures. PDF wraps, continued tables and code indentation are restored. Example outputs are not ArmSoM tests.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN Toolkit Lite2 V2.5.0, part 1: installation, ResNet18 and return conventions**

[RKNN Toolkit Lite2 V2.5.0, part 2: lifecycle, input layout and output reuse](/articles/rknn-v250-lite-api-programming-model/)

[RKNN Toolkit Lite2 V2.5.0, part 3: model loading, encryption and Runtime initialization](/articles/rknn-v250-lite-api-loading-runtime/)

[RKNN Toolkit Lite2 V2.5.0, part 4: inference, device and version query APIs](/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0, part 5: error checks, Core Mask and logging](/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 1. API Reference Overview

This manual describes the Python APIs of RKNN Toolkit Lite2. It focuses on the RKNNLite object and covers environment requirements, model loading, Runtime initialization, model inference, SDK version query, and supported-platform query.

RKNN Toolkit Lite2 is used to deploy RKNN models on Rockchip NPU platforms. Model conversion is performed by RKNN Toolkit2 and is outside the scope of this manual.

### 1.1 Applicable Version and Platforms

This document corresponds to RKNN Toolkit Lite2 V2.5.0.

The currently supported range is:

| Item | Supported Range |
| --- | --- |
| RKNN Toolkit Lite2 version | V2.5.0 |
| Hardware platforms | RK3562, RK3566 series, RK3568 series, RK3576 series, RK3588 series |
| Operating system | Debian 10 / 11 / 12 (aarch64) |
| Python | 3.8 / 3.9 / 3.10 / 3.11 / 3.12 |
| Python dependencies | numpy, ruamel.yaml, psutil |

### 1.2 Installation and Environment Setup

RKNN Toolkit Lite2 can be installed with pip3 install .

If python3 or pip3 is not installed, install the required base packages first:

```text
sudo apt-get update
sudo apt-get install -y python3 python3-dev python3-pip gcc
```

Some dependent modules need to compile source code during installation, so python3-dev and gcc are installed together to avoid build failures.

The examples also use opencv-python and numpy :

```text
sudo apt-get install -y python3-opencv
sudo apt-get install -y python3-numpy
```

Notes:

1. RKNN Toolkit Lite2 itself does not depend on opencv-python , but the examples use it to process images.

2. Installing numpy directly with pip3 may fail on Debian 10 firmware. The system-package installation method above is recommended.

The installation packages for each RKNN Toolkit Lite2 platform are located in the SDK packages directory. Enter this directory and install the Wheel corresponding to the Python version:

```text
# Python 3.8
pip3 install rknn_toolkit_lite2-2.x.0-cp38-cp38-linux_aarch64.whl

# Python 3.9
pip3 install rknn_toolkit_lite2-2.x.0-cp39-cp39-linux_aarch64.whl

# Python 3.10
pip3 install rknn_toolkit_lite2-2.x.0-cp310-cp310-linux_aarch64.whl

# Python 3.11
pip3 install rknn_toolkit_lite2-2.x.0-cp311-cp311-linux_aarch64.whl

# Python 3.12
pip3 install rknn_toolkit_lite2-2.x.0-cp312-cp312-linux_aarch64.whl
```

### 1.3 Basic Usage Flow

Before using RKNN Toolkit Lite2, use RKNN Toolkit2 to convert models exported from deep learning frameworks into RKNN models.

The basic usage flow is:

```text
Create RKNNLite object
    ↓
load_rknn()
    ↓
init_runtime()
    ↓
Prepare and preprocess input data
    ↓
inference()
    ↓
Post-process inference results
    ↓
release()
```

Where:

RKNNLite() creates the RKNN Toolkit Lite2 Python object;

load_rknn() loads an RKNN model;

init_runtime() initializes the Runtime environment;

inference() performs model inference;

release() releases the RKNNLite object resources after use.

Before calling inference(), prepare and preprocess the input data, then configure data_format and other parameters according to the actual input information. After inference, the outputs normally require post-processing to complete the upper-layer application functionality.

### 1.4 Example Program

The SDK provides a resnet18 example in the examples directory. The example loads a ResNet18 model, runs inference, and outputs the Top-5 classification results for the test image.

Run it as follows:

1. Prepare a development board with RKNN Toolkit Lite2 installed.

2. Copy the example to the development board.

3. Enter the examples/resnet18 directory and run:

```text
python3 test.py
```

Reference output:

```text
-----TOP 5-----
[812]: 0.999442994594574
[404]: 0.0004096269840374589
[657]: 3.284541890025139e-05
[833]: 2.6112385967280716e-05
[895]: 1.8509887013351545e-05
```

### 1.5 API Return Conventions

According to the current RKNNLite Python implementation, the main APIs use the following return conventions:

| API | Normal Return | Failure / Special Return |
| --- | --- | --- |
| load_rknn() | 0 | -1 |
| list_devices() | (adb_devices, ntb_devices), where<br>both items are list objects | No separate failure return is defined |
| init_runtime() | 0 | Returns -1 if parameter validation,<br>model loading, Runtime creation, or<br>initialization fails |
| inference() | list; each item is an output ndarray. If<br>get_frame_id=True, the Frame ID is<br>appended to the end of the returned list | Returns None if the Runtime is not<br>initialized, or if setting inputs, running<br>the model, or retrieving outputs fails |
| get_sdk_version() | SDK version information string | Returns None if the Runtime is not<br>initialized or the query fails |
| list_support_target_platform() | dict returned by the platform query<br>function | Returns None if the specified RKNN<br>model path does not exist |
| release() | None | None |

For APIs that return status codes, explicitly check the return value. For example:

```text
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_AUTO)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

For inference() , get_sdk_version() , and list_support_target_platform() , also check whether the return value is None to avoid processing invalid results when prerequisites are not met or an internal operation fails.

{% endraw %}
