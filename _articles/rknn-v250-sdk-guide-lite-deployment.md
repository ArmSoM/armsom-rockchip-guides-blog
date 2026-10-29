---
title: "RKNN2 SDK V2.5.0 · Toolkit Lite2 Python deployment"
description: "RKNN2 SDK V2.5.0 · Toolkit Lite2 Python deployment · Complete development guide series"
excerpt: "Toolkit Lite2 Python deployment"
translation_key: "rknn-v250-sdk-guide-lite-deployment"
slug: "rknn-v250-sdk-guide-lite-deployment"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Platform reference: this article follows the Rockchip RKNN2 SDK V2.5.0 Development Guide, including only the SoCs, Linux/Android Runtime and Toolkit combinations stated by the source. Features apply under the chip, SDK, driver and kernel conditions in each section, not automatically to every ArmSoM board. Check the actual ArmSoM BSP, NPU driver, Runtime and model versions before deployment. No ArmSoM hardware validation was performed; logs, performance figures and examples belong to the source.

Sources and proofreading: Chinese follows Chinese V2.5.0 (182 pages); English, Russian and German follow English V2.5.0 (208 pages). Source-specific technical information is retained; older-version content is not presented as new-version fact. Chinese figures come from the Chinese PDF; EN/RU/DE figures come from the English PDF, including separately extracted vector flowcharts. Original section and equation numbers remain. Some source cross-references still use old chapter numbers; dynamic-shape capacity examples contain “1224+140=264”, TP_NORM support statements conflict, and names such as init()/rknn.val_perf() differ from later API descriptions. These source issues are retained and require checking against actual V2.5.0 SDK headers/API references before execution. Code and parameters remain; PDF wrapping and table continuations are repaired.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 10/22**

[1. Software stack and core concepts](/articles/rknn-v250-sdk-guide-overview/)

[2. Environment, versions and board connection](/articles/rknn-v250-sdk-guide-environment/)

[3. Development workflow and interface selection](/articles/rknn-v250-sdk-guide-workflow/)

[4. Model conversion and ONNX editing](/articles/rknn-v250-sdk-guide-conversion/)

[5. Quantization, hybrid quantization and QAT](/articles/rknn-v250-sdk-guide-quantization/)

[6. Inference, accuracy, performance and memory evaluation](/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime lifecycle, layouts and memory](/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Zero-copy interfaces and I/O constraints](/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C API deployment and code generation](/articles/rknn-v250-sdk-guide-c-deployment/)

**Toolkit Lite2 Python deployment**

[11. Matmul API and matrix layouts](/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU multicore configuration and performance](/articles/rknn-v250-sdk-guide-multicore/)

[13. Dynamic-shape models and deployment](/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Multi-batch inference](/articles/rknn-v250-sdk-guide-multi-batch/)

[15. RK3588/RK3576 NPU SRAM](/articles/rknn-v250-sdk-guide-sram/)

[16. Cache coherency and sparse inference](/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Custom operators: Python and C API](/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Encrypted model deployment](/articles/rknn-v250-sdk-guide-encryption/)

[19. Accuracy troubleshooting](/articles/rknn-v250-sdk-guide-accuracy/)

[20. Performance analysis and network optimization](/articles/rknn-v250-sdk-guide-performance/)

[21. Memory analysis, sharing and reuse](/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, error handling and references](/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

## 3.3 Toolkit Lite Python Deployment

RKNN-Toolkit Lite2 provides users with a Python interface for board-side model inference, making it convenient for users to use Python language for AI application development.

Note: Before using RKNN-Toolkit Lite2 to develop AI applications, you need to convert the models exported by each deep learning framework into RKNN models through RKNN-Toolkit2. Please refer to Chapter 2.1 for detailed model conversion methods.

### 3.3.1 Runtime Environment and Installation

RKNN-Toolkit Lite2 runs on the development board. The supported hardware platforms, operating systems, Python versions, and dependent libraries depend on the RKNN-Toolkit Lite2 release package of the corresponding version. For the specific support scope, refer to the "Applicable Versions and Platforms" chapter in 《04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0》.

RKNN-Toolkit Lite2 is installed through a Python Wheel package. The SDK provides installation packages for the corresponding platforms and Python versions, located in the rknn-toolkit- lite2/packages directory. You can select the corresponding Wheel according to the Python version of the development board and complete the installation with pip3 install . For example:

```text
pip3 install rknn_toolkit_lite2-x.y.z-cpxx-cpxx-linux_aarch64.whl
```

Before installation, make sure the development board is already equipped with Python, pip, and the related dependency environment. For complete installation steps and dependency instructions, refer to the "Installation and Environment Deployment" chapter in 《04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0》.

### 3.3.2 Basic Deployment Process

RKNN-Toolkit Lite2 uses the RKNNLite object as the main entry of the Python API. The typical on-board deployment process is as follows:

```text
Create RKNNLite object
      ↓
  load_rknn()
      ↓
 init_runtime()
      ↓
Prepare input and complete pre-processing
      ↓
  inference()
      ↓
  Process inference results
      ↓
  release()
```

The main corresponding interfaces include:

RKNNLite() : create an RKNN-Toolkit Lite2 object;

load_rknn() : load the RKNN model;

init_runtime() : initialize the Runtime environment;

inference() : feed input data and run model inference;

release() : release the RKNNLite object and related resources.

Before calling inference() , the application needs to complete data reading and pre-processing according to the model input requirements; after the inference is completed, post-processing such as classification or detection is performed according to the model type.

### 3.3.3 Main Function Interfaces

In addition to the basic model deployment process, RKNN-Toolkit Lite2 provides interfaces for querying runtime information and supported platforms. Common interfaces are as follows:

| Interface | Function |
| --- | --- |
| RKNNLite() | Create an RKNNLite object, with configurable logging |
| load_rknn() | Load an RKNN model |
| init_runtime() | Initialize the Runtime environment required for model inference |
| inference() | Run model inference and return the results |
| get_sdk_version() | Query the versions of the Runtime, driver, and model |
| list_support_target_platform() | Query the target chip platforms supported by the RKNN model |
| release() | Release runtime resources |

init_runtime() can configure the NPU core working mode according to the supported platform; inference() accepts model inputs as a list of ndarray objects and allows specifying the data layout as needed. For parameter values, usage restrictions, and return value conventions, refer to the interface descriptions in 《04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0》.

### 3.3.4 Reference Example

The following is a basic inference example of RKNN-Toolkit Lite2, showing the complete calling process of creating the RKNNLite object, loading the RKNN model, initializing the Runtime, running inference, and releasing resources. In the example, input_data represents the input data that has already been pre-processed according to the model requirements.

```text
rknn_lite = RKNNLite(verbose=True)

# 1. Load RKNN model
ret = rknn_lite.load_rknn('./model.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

# 2. Initialize Runtime
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_AUTO)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)

# 3. Run inference
outputs = rknn_lite.inference(inputs=[input_data])

# 4. Post-process outputs according to the model type
# ...

# 5. Release resources
rknn_lite.release()
```

The SDK's examples/inference_with_lite directory also provides a complete image classification example based on ResNet18. After deploying the example, the RKNN model, and the test data to a development board with RKNN-Toolkit Lite2 installed, you can enter the example directory and run:

```text
cd examples/inference_with_lite
python3 test.py
```

This example covers input pre-processing, model inference, and Top-5 classification result processing, and can be used as a reference for actual application development. For the parameters, return values, and usage restrictions of interfaces such as RKNNLite , load_rknn() , init_runtime() , inference() , and release() , refer to 《04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0》.

{% endraw %}
