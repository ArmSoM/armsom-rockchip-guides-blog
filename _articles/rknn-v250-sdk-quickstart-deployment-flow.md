---
title: "RKNN2 V2.5.0 quickstart 1: deployment flow, platforms and SDK repositories"
description: "RKNN2 V2.5.0 quickstart 1: deployment flow, platforms and SDK repositories · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0 quickstart 1: deployment flow, platforms and SDK repositories"
translation_key: "rknn-v250-sdk-quickstart-deployment-flow"
slug: "rknn-v250-sdk-quickstart-deployment-flow"
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

**RKNN2 V2.5.0 quickstart 1: deployment flow, platforms and SDK repositories**

[RKNN2 V2.5.0 quickstart 2: hardware connection and ADB checks](/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0 quickstart 3: Toolkit, Android/Linux Runtime and compilers](/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0 quickstart 4: MobileNet conversion and deployment](/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0 quickstart 5: YOLOv5 detection and accuracy evaluation](/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0 quickstart 6: Docker, startup issues and references](/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 1. Before You Start

This guide uses the shortest path to walk you through the first run of the RKNN2 SDK, covering hardware connection, environment preparation, model conversion, on-board debugging, and board deployment. Model conversion principles, quantization configuration, the complete API reference, and systematic troubleshooting are beyond the scope of this guide. Please refer to the corresponding documents.

Note: For the complete development workflow, Toolkit interface descriptions, accuracy/performance/memory analysis, etc., please refer to the RKNN2 SDK Development Guide. The supported hardware, operating systems, and version ranges are subject to the SDK release package. This guide only lists the necessary information for the first run.

### 1.1 Guide Objectives

After completing this guide, you should be able to:

1. Confirm that the host computer, development board, and RKNPU2 runtime environment are available;

2. Use RKNN-Toolkit2 to convert an ONNX model;

3. Run the Python Demo on the board via on-board debugging;

4. Compile the C Demo and run it on the board;

5. Navigate to the complete development, API reference, or troubleshooting documents as needed.

### 1.2 Software Framework and Key Components

The RKNN2 SDK development workflow mainly consists of two parts: the PC-side development kit and the development board runtime environment:

PC-side development kit: You can use RKNN-Toolkit2 to convert models trained with deep learning frameworks such as ONNX, PyTorch, and TensorFlow into RKNN format, and verify the models on the development board via on-board debugging. RKNN Model Zoo provides model conversion and deployment examples.

Development board runtime environment: After model conversion, you can use the RKNPU2 Runtime on the development board to load and run RKNN models.

The key components are as follows:

| Component | Running<br>Location | Description |
| --- | --- | --- |
| RKNN-Toolkit2 | PC side | Python toolkit for model conversion, quantization, on-board<br>debugging, and other core features |
| RKNN Server<br>(rknn_server) | Board side | Background proxy service that receives commands and data<br>transmitted from the PC, calls the corresponding board-side Runtime<br>interfaces to execute them, and returns the results to the PC |
| RKNPU2 Runtime<br>(librknnrt.so) | Board side | Loads RKNN models and performs inference of RKNN models on the<br>NPU |
| RKNN Model Zoo | PC side /<br>board side | Provides conversion scripts and Python/C++ example code for<br>common models such as YOLOv5, YOLOv8, and MobileNet |

### 1.3 Select the Example

This guide uses the following two examples throughout the first-run workflow:

| Example | Purpose | Model Zoo directory |
| --- | --- | --- |
| MobileNet | Image classification example | examples/mobilenet |
| YOLOv5 | Object detection example | examples/yolov5 |

Each model example provides both Python and C/C++ versions of the sample code. For convenience, they are referred to as the RKNN Python Demo and the RKNN C Demo in the rest of this document. Different Demos may differ in usage. Please follow the steps in the README.md in each directory.

### 1.4 Supported Platforms and Version Requirements

The supported platforms are as follows:

| Category | Description |
| --- | --- |
| Hardware platforms | RK3562, RK3566 series, RK3568 series, RK3576 series, RK3588 series, RV1126B |
| Host computer | Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04 |
| Python version | 3.8 (recommended) |
| RKNPU2 driver version | >= 0.9.8 recommended |

Note: Ensure that the versions of rknn_server, the Runtime library (librknnrt.so), and RKNN-Toolkit2 are consistent. It is recommended to install the latest versions. If you use an RKNN model with dynamic input dimensions, the versions of rknn_server and the Runtime library must be >= 1.5.0.

### 1.5 Obtain the SDK and Companion Repositories

It is recommended to create a new directory to store the RKNN repositories. For example, create a folder named Projects and place the RKNN-Toolkit2 and RKNN Model Zoo repositories in that directory. Refer to the following commands:

```text
# Create the 'Projects' folder
mkdir Projects

# Switch to this directory
cd Projects

# Download the RKNN-Toolkit2 repository
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# Download the RKNN Model Zoo repository
git clone https://github.com/airockchip/rknn_model_zoo.git --depth 1

# Notice:
# 1. Parameter --depth 1 means to clone only the latest commit
# 2. If the 'git clone' command fails, you can also download the compressed file directly from GitHub and unzip it locally in this directory.
```

The default directory structure used in the following examples:

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
