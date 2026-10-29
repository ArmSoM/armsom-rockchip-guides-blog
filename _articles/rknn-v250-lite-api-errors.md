---
title: "RKNN Toolkit Lite2 V2.5.0, part 5: error checks, Core Mask and logging"
description: "RKNN Toolkit Lite2 V2.5.0, part 5: error checks, Core Mask and logging · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, part 5: error checks, Core Mask and logging"
translation_key: "rknn-v250-lite-api-errors"
slug: "rknn-v250-lite-api-errors"
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

[RKNN Toolkit Lite2 V2.5.0, part 1: installation, ResNet18 and return conventions](/articles/rknn-v250-lite-api-installation/)

[RKNN Toolkit Lite2 V2.5.0, part 2: lifecycle, input layout and output reuse](/articles/rknn-v250-lite-api-programming-model/)

[RKNN Toolkit Lite2 V2.5.0, part 3: model loading, encryption and Runtime initialization](/articles/rknn-v250-lite-api-loading-runtime/)

[RKNN Toolkit Lite2 V2.5.0, part 4: inference, device and version query APIs](/articles/rknn-v250-lite-api-inference-queries/)

**RKNN Toolkit Lite2 V2.5.0, part 5: error checks, Core Mask and logging**

{% raw %}

## 4. Error Handling

The RKNN Toolkit Lite2 Python APIs mainly report execution status through status codes, None return values, and Runtime logs. Status-returning APIs should be checked explicitly, and inference and query APIs should be checked for None before their results are used.

### 4.1 Model Loading and Runtime Initialization Errors

load_rknn() and init_runtime() use the following return values:

Success: 0

Failure: -1

Check each initialization step immediately:

```text
ret = rknn_lite.load_rknn('./resnet_18.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

Only continue with inference() or get_sdk_version() after model loading and Runtime initialization succeed.

### 4.2 Inference Input and Return-Value Checks

Before calling inference() , check that:

init_runtime() has completed successfully;

inputs is a list whose members are the ndarray objects required by the model;

if data_type , data_format , or inputs_pass_through is used, the value matches the actual input;

in asynchronous mode, set get_frame_id=True if frame association is required;

if reuse_outputs=True is enabled, the returned arrays are views of the internal reusable buffers and must not be held across calls; copy them first if the results need to be retained.

inference() returns None if the Runtime is not initialized, setting inputs fails, model execution fails, or output retrieval fails. Therefore, use a consistent null-value check:

```text
outputs = rknn_lite.inference(inputs=[input_data])
if outputs is None:
    print('Inference failed')
    exit(-1)
```

### 4.3 NPU Core Configuration Checks

The source code notes that core_mask is valid only for RK3576 / RK3588. The interface description also marks RKNNLite.NPU_CORE_0_1_2 as supported only on RK3588.

If manual Core selection is not required, use the default RKNNLite.NPU_CORE_AUTO . For a specific chip and Core combination, follow Runtime validation. If Core Mask setup fails, init_runtime() returns -1 .

### 4.4 Logging

Use verbose and verbose_file when initializing RKNNLite to obtain detailed logs:

```text
rknn_lite = RKNNLite(
    verbose=True,
    verbose_file='./inference.log'
)
```

When verbose=True , detailed logs are printed to the screen. If verbose_file is also specified, the logs are written to the specified file as well.

When model loading, Runtime initialization, or inference fails, use the API return value together with the detailed logs to locate the problem.

## 5. Appendix

### 5.1 Reference Documents

RKNN2 SDK Development Guide: RKNN2 software stack, model conversion and quantization, deployment flow, and troubleshooting.

RKNN2 Toolkit Python API Reference: RKNN-Toolkit2 Python API methods, parameters, and return values.

RKNN Toolkit2 documentation:

https://github.com/airockchip/rknn-toolkit2/tree/master/doc

RKNN Toolkit2 project:

https://github.com/airockchip/rknn-toolkit2

{% endraw %}
