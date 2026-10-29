---
title: "RV1103/RV1106 RKNN quickstart 1: deployment flow, platforms and repositories"
description: "RV1103/RV1106 RKNN quickstart 1: deployment flow, platforms and repositories · RKNN2 V2.5.0"
excerpt: "RV1103/RV1106 RKNN quickstart 1: deployment flow, platforms and repositories"
translation_key: "rknn-v250-rv1106-deployment-flow"
slug: "rknn-v250-rv1106-deployment-flow"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RV1103", "RV1106", "Mini Runtime"]
---

Platform reference for the RKNN2 V2.5.0 RV1103/RV1103B/RV1106/RV1106B quickstart, using the matching board SDK, RKNPU2 driver and librknnmrt.so. No corresponding ArmSoM board has been confirmed. The source Linux 5.10.160 log and inference outputs are examples, not ArmSoM hardware tests. Check power, connections and drivers against the actual board BSP.

Source: local Chinese and English V2.5.0 PDFs. Chinese uses the Chinese text and figures; English, Russian and German use the English source. All technical chapters, commands and tables are retained; PDF line wraps and directory-tree indentation are restored. An older driver in a sample log is not the recommended version; see the source recommendation below. Check unpinned downloads and pip installations against the actual SDK.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RV1103/RV1106 RKNN quickstart 1: deployment flow, platforms and repositories**

[RV1103/RV1106 RKNN quickstart 2: hardware connections and device checks](/articles/rknn-v250-rv1106-hardware/)

[RV1103/RV1106 RKNN quickstart 3: host environment and Mini Runtime](/articles/rknn-v250-rv1106-host-runtime/)

[RV1103/RV1106 RKNN quickstart 4: YOLOv5 conversion, Python and C deployment](/articles/rknn-v250-rv1106-yolov5/)

[RV1103/RV1106 RKNN quickstart 5: Docker, first-run issues and references](/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 1. Before You Begin

This guide provides the shortest path to complete the first RKNN SDK run on RV1103/RV1103B/RV1106/RV1106B, including hardware connection, environment checks, model conversion, on-board debugging, and C/C++ deployment on the board.

Note: For the complete development flow, model conversion and quantization, environment installation, and systematic troubleshooting, refer to RKNN2_SDK_Development_Guide. For RKNN-Toolkit2 Python APIs, refer to RKNN2_Toolkit_Python_API_Reference. For RKNN-Toolkit- Lite2 Python APIs, refer to RKNN2_Toolkit_Lite_Python_API_Reference. For board-side C APIs and RKNPU2 Mini Runtime ( librknnmrt.so ) related interfaces, refer to RKNN2_Runtime_C_API_Reference.

### 1.1 Goals of This Guide

After completing this guide, you should be able to:

1. Confirm that the development host and development board are connected correctly.

2. Install and verify the RKNN-Toolkit2 development environment.

3. Check or update the board-side RKNPU2 Mini Runtime ( librknnmrt.so ) and rknn_server .

4. Use RKNN Model Zoo to download the YOLOv5 model and convert it to an RKNN model.

5. Complete one on-board inference using the RKNN Python Demo.

6. Compile and run the RKNN C Demo on the board and verify the output.

### 1.2 Understand the RKNN SDK Deployment Flow

The first run on RV1103/RV1103B/RV1106/RV1106B mainly involves development tools on the computer and the runtime environment on the development board.

| Component | Location | Description |
| --- | --- | --- |
| RKNN-Toolkit2 | Computer | Converts original models such as ONNX models to RKNN<br>models and supports on-board debugging |
| RKNN Model Zoo | Computer | Provides model conversion examples, Python Demos,<br>and C/C++ Demos |
| rknn_server | Development<br>board | Handles on-board inference requests sent by the<br>computer through USB |
| RKNPU2 Mini Runtime<br>(librknnmrt.so) | Development<br>board | Loads RKNN models and invokes the NPU to perform<br>inference |

The differences between RKNPU2 Mini Runtime and RKNPU2 Runtime are as follows:

| Item | RKNPU2 Mini Runtime | RKNPU2 Runtime |
| --- | --- | --- |
| Runtime<br>library | librknnmrt.so | librknnrt.so |
| Positioning | A streamlined Runtime for resource-constrained<br>platforms such as<br>RV1103/RV1103B/RV1106/RV1106B | Standard RKNPU2 Runtime |
| Applicability to<br>this guide | Applicable. All board-side runtime references<br>later in this guide refer to librknnmrt.so. | Not applicable to the<br>examples in this guide. Do not<br>replace librknnmrt.so with<br>librknnrt.so. |

Note: In the remainder of this guide, RKNPU2 Mini Runtime refers specifically to the board-side librknnmrt.so . Except for this section, which distinguishes the two Runtime variants, this guide does not use the generic term "RKNPU2 Runtime" for the board-side runtime library, to avoid confusion with librknnrt.so .

The recommended first-run path is:

1. Connect the development board and confirm that it is visible in adb devices .

2. Install RKNN-Toolkit2 and complete the import check.

3. Check the RKNPU2 driver, Mini Runtime, and rknn_server .

4. Download the YOLOv5 example model and convert it to RKNN format.

5. Run the RKNN Python Demo first to verify model conversion and the on-board debugging path.

6. Compile, push, and run the RKNN C Demo to complete board-side deployment verification.

### 1.3 Supported Platforms and Version Requirements

This guide supports the following platforms:

| Platform | Support |
| --- | --- |
| RV1103 | Supported |
| RV1103B | Supported |
| RV1106 | Supported |
| RV1106B | Supported |

The development host examples are based on Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04. Python 3.8 is recommended for the RKNN-Toolkit2 environment.

Note: RKNN models generated for RV1103/RV1106 cannot be shared with RV1103B/RV1106B. Select the correct platform parameter according to the actual development board during model conversion.

### 1.4 Select the Example Type

This guide uses the YOLOv5 example in RKNN Model Zoo throughout the first-run flow.

| Example | Purpose | Model Zoo Directory |
| --- | --- | --- |
| YOLOv5 Python<br>Demo | Model conversion and on-board inference verification | examples/yolov5/python |
| YOLOv5 C Demo | C/C++ compilation and board-side deployment<br>verification | examples/yolov5/cpp |

The Python Demo and C Demo use the same YOLOv5 ONNX model and the same converted RKNN model, so the model only needs to be downloaded and converted once.

### 1.5 Obtain the SDK and Related Repositories

It is recommended to create a dedicated directory for RKNN-related repositories. For example, create a folder named Projects and place RKNN-Toolkit2 and RKNN Model Zoo in this directory.

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

Note: --depth 1 means that only the latest commit is cloned. If git clone fails, you can also download the compressed package directly from GitHub and extract it into this directory.

The default directory structure used in the following examples is:

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
