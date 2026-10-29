---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Runtime, operator registration and inference"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-toolkit-api-runtime-inference"
slug: "rknn-v250-toolkit-api-runtime-inference"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Runtime, operator registration and inference | Complete parameters, examples and platform constraints"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Runtime, operator registration and inference | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-toolkit-api-runtime-inference/"
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

<!-- source EN p19 unit 97 -->

## 7 Runtime Initialization and Inference APIs

<!-- source EN p19 unit 98 -->

### 7.1 Loading RKNN Model

<!-- source EN p19 unit 99 -->

| API | load_rknn |
| --- | --- |
| Description | Load RKNN model.<br>After loading the RKNN model, there is no need to perform the steps of model<br>configuration, loading model and building RKNN model. And the loaded model is limited to<br>connecting to the NPU hardware for inference or performance data acquisition. It can not<br>be used for simulator or accuracy analysis. |
| Parameter | path: The path of RKNN model file. |
| Return<br>Value | 0: Load successfully. |
| Return<br>Value | -1: Load failed. |

<!-- source EN p19 unit 100 -->

The sample code is as follows:

<!-- source EN p19 unit 101 -->

```python
# Load the mobilenet_v1 RKNN model in the current path
ret = rknn.load_rknn(path='./mobilenet_v1.rknn')
```

<!-- source EN p19 unit 102 -->

### 7.2 Initialize Runtime Environment

<!-- source EN p19 unit 103 -->

Before inference or performance evaluation, the runtime environment must be initialized. This interface determines the type of runtime (hardware platform or software simulator).

<!-- source EN p19 unit 104 -->

| API | init_runtime |
| --- | --- |
| Description | Initialize the runtime environment. |
| Parameter | target: Target hardware platform, now supports 'rv1103', 'rv1103b', 'rv1106', 'rv1106b',<br>'rv1126b', 'rk3562', 'rk3566', 'rk3568', 'rk3576' and 'rk3588'. The default value is "None",<br>means model runs on simulator.<br>Note: When target is set to None, the build or hybrid_quantization interface needs to be<br>called first. |
| Parameter | device_id: Device identity number, if multiple devices are connected to PC, this parameter<br>needs to be specified which can be obtained by calling "list_devices" interface. The<br>default value is None. |
| Parameter | perf_debug: Debug mode option for performance evaluation. In debug mode, the running<br>time of each layer can be obtained, otherwise, only the total running time of model can be<br>given. The default value is False. |
| Parameter | eval_mem: Whether enter memory evaluation mode. If set True, the eval_memory<br>interface can be called later to fetch memory usage of model running. The default value is<br>False. |
| Parameter | async_mode: Whether to use asynchronous mode. The default value is False.<br>When calling the inference interface, it involves setting the input picture, model running,<br>and fetching the inference result. If the asynchronous mode is enabled, setting the input of<br>the current frame will be performed simultaneously with the inference of the previous<br>frame, so in addition to the first frame, each subsequent frame can hide the setting input<br>time, thereby improving performance. In asynchronous mode, the inference result returned<br>each time is the previous frame. (Not Supported yet) |
| Parameter | core_mask: Sets the NPU cores at runtime. The supported platform is RK3588 / RK3576,<br>and the supported configurations are as follows:<br>RKNN.NPU_CORE_AUTO: Indicates the automatic scheduling model, which automatically<br>runs on the currently idle NPU core.<br>RKNN.NPU_CORE_0: Indicates running on the NPU0 core. RKNN.NPU_CORE_1: Indicates<br>running on the NPU1 core.<br>RKNN.NPU_CORE_2: Indicates running on the NPU2 core.<br>RKNN.NPU_CORE_0_1: Indicates running on NPU0 and NPU1 cores at the same time.<br>RKNN.NPU_CORE_0_1_2: Indicates running on NPU0, NPU1, NPU2 cores at the same time.<br>RKNN.NPU_CORE_ALL: Indicates running on the number of NPU cores depending on the<br>platform.<br>The default value is "RKNN.NPU_CORE_AUTO".<br>Note: RK3576 has only 2 cores, so NPU_CORE_2 and NPU_CORE_0_1_2 cannot be set. |
| Parameter | fallback_prior_device: set fallback prior device when OP is not supported by NPU.<br>currently support: 'gpu' or 'cpu', 'gpu' is only valid for platform which has gpu hardware.<br>The default value is 'cpu'. |
| Return<br>Value | 0: Initialize the runtime environment successfully. |
| Return<br>Value | -1: Initialize the runtime environment failed. |

<!-- source EN p20 unit 106 -->

The sample code is as follows:

<!-- source EN p20 unit 107 -->

```python
# Initialize the runtime environment
ret = rknn.init_runtime(target='rk3566')
```

<!-- source EN p20 unit 108 -->

### 7.3 Register Custom Operator

<!-- source EN p20 unit 109 -->

The function of this interface is to register a custom operator.

<!-- source EN p20 unit 110 -->

| API | reg_custom_op |
| --- | --- |
| Description | Register custom operator, only supported for ONNX model. |
| Parameter | custom_op: Custom operator class. For the user needs to customize a new OP, which is<br>not within the ONNX OP specification. The op_type of this new OP is recommended to start<br>with 'cst', and the ‘shape_infer’ and ‘compute’ functions need to be implemented by user.<br>Note: The custom_op operator class is only used for model conversion and generation of<br>RKNN models with custom operators. When deploying on the device side, you also need to<br>refer to Chapter 5.5 of the "RKNN SDK User Guide". |
| Return<br>Value | 0: Success. |
| Return<br>Value | -1: Failure. |

<!-- source EN p21 unit 111 -->

The sample code is as follows:

<!-- source EN p21 unit 112 -->

```python
import numpy as np
from rknn.api.custom_op import get_node_attr
class cstSoftmax:
    op_type = 'cstSoftmax'
    def shape_infer(self, node, in_shapes, in_dtypes):
        out_shapes = in_shapes.copy()
        out_dtypes = in_dtypes.copy()
        return out_shapes, out_dtypes
    def compute(self, node, inputs):
        x = inputs[0]
        axis = get_node_attr(node, 'axis')
        x_max = np.max(x, axis=axis, keepdims=True)
        tmp = np.exp(x - x_max)
        s = np.sum(tmp, axis=axis, keepdims=True)
        outputs = [tmp / s]
        return outputs

ret = rknn.reg_custom_op(cstSoftmax)
```

<!-- source EN p21 unit 113 -->

### 7.4 Inference with RKNN Model

<!-- source EN p21 unit 114 -->

This interface kicks off the RKNN model inference and get the result of inference.

<!-- source EN p21 unit 115 -->

| API | inference |
| --- | --- |
| Description | Use the model to perform inference with specified input and get the inference result.<br>If the target is set to Rockchip NPU when initializing the runtime environment, the<br>inference of model is performed on the specified hardware platform. If the target is not set,<br>the inference of model is performed on the simulator. |
| Parameter | inputs: Inputs list to be inferred, The object type is ndarray. |
| Parameter | data_format: The layout list of input data. "nchw" or "nhwc" , only valid for 4-dims input.<br>The default value is None, means all inputs layout is "nhwc". |
| Parameter | inputs_pass_through: The pass_through flag. The default value is None, means all input<br>is not pass through.<br>In non-pass_through mode, the tool will reduce the mean, divide the variance, etc. before<br>the input is passed to the NPU driver; in pass_through mode, these operations will not be<br>performed.<br>The value of this parameter is an list. For example, to pass input0 and not input1, the<br>value of this parameter is [1, 0]. |
| Return<br>Value | results: The result of inference, the object type is ndarray list. |

<!-- source EN p21 unit 116 -->

The sample code is as follows:

<!-- source EN p21 unit 117 -->

For classification model, such as mobilenet_v1, the code is as follows (refer to example/tfilte/mobilenet_v1 for the complete code):

<!-- source EN p21 unit 118 -->

```python
# Preform inference for a picture with a model and get a top-5 result
outputs = rknn.inference(inputs=[img])
show_outputs(outputs)
```

<!-- source EN p22 unit 119 -->

The result of top-5 is as follows:

<!-- source EN p22 unit 120 -->

```text
-----TOP 5-----
[ 156] score:0.928223 class:"Shih-Tzu"
[ 155] score:0.063171 class:"Pekinese, Pekingese, Peke"
[ 205] score:0.004299 class:"Lhasa, Lhasa apso"
[ 284] score:0.003096 class:"Persian cat"
[ 285] score:0.000171 class:"Siamese cat, Siamese"
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Editorial notes: Example logs still show SDK 1.5.2 and remain historical examples, not V2.5.0 measurements. The Ubuntu20.04 Python cell differs (Chinese 3.8/3.9; English 3.8/3.8, also differing for Debian11); the ARM64 section still labels Debian x64. Source values are retained; verify the actual installation package. V2.5.0 adds the C++ codegen chapter and refines quantization and memory strategies; older parameters have not replaced the new source.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
