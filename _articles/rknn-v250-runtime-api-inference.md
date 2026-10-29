---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Input, execution, output and dynamic shapes"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-inference"
slug: "rknn-v250-runtime-api-inference"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Input, execution, output and dynamic shapes | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Input, execution, output and dynamic shapes | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-inference/"
---

## Platform scope and source

This article follows the RKNN V2.5.0 vendor PDF. Only the chips and interfaces listed in the source are in scope. For an ArmSoM board, check the SoC, NPU driver, Toolkit/Runtime, SDK/BSP and kernel versions first. No ArmSoM hardware validation has been performed; source examples and measurements are not ArmSoM test results.

## Series navigation

- [Platforms, headers and linking](/articles/rknn-v250-runtime-api-overview-linking/)
- [Memory ownership and general/zero-copy flows](/articles/rknn-v250-runtime-api-conventions-zero-copy/)
- [Device, context and initialization flags](/articles/rknn-v250-runtime-api-device-context/)
- [Model, tensor and dynamic shape queries](/articles/rknn-v250-runtime-api-query/)
- [Input, execution, output and dynamic shapes](/articles/rknn-v250-runtime-api-inference/)
- [Tensor memory allocation and synchronization](/articles/rknn-v250-runtime-api-tensor-memory/)
- [Matrix multiplication APIs and dynamic shapes](/articles/rknn-v250-runtime-api-matmul/)
- [Custom operator registration and attributes](/articles/rknn-v250-runtime-api-custom-operators/)
- [Status codes, tensors, memory and extension types](/articles/rknn-v250-runtime-api-types-common/)
- [Matrix multiplication structures](/articles/rknn-v250-runtime-api-types-matmul/)
- [Custom operator types and deprecated API migration](/articles/rknn-v250-runtime-api-types-custom-migration/)

{% raw %}

<!-- source EN p23 unit 245 -->

### 5.3. Inference Execution

<!-- source EN p23 unit 246 -->

Set input, execute inference, get output and dynamic shape setting.

<!-- source EN p23 unit 247 -->

### rknn_inputs_set

<!-- source EN p23 unit 248 -->

The input data of the model can be set by the rknn_inputs_set function. This function can support multiple inputs, each of which is a rknn_input structure object. The user needs to set these object field before passing in rknn_inputs_set function (Note: unavailable on RV1106/RV1103/RV1103B/RV1106B/RK2118).

<!-- source EN p23 unit 249 -->

| API | rknn_inputs_set |
| --- | --- |
| Description | Set the model input data. |
| Parameter | rknn_context context: The object of rknn_contex. |
| Parameter | uint32_t n_inputs: Number of inputs. |
| Parameter | rknn_input inputs[]: Array of rknn_input. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p23 unit 250 -->

Sample Code:

<!-- source EN p23 unit 251 -->

```c
rknn_input inputs[1];
memset(inputs, 0, sizeof(inputs));
inputs[0].index = 0;
inputs[0].type = RKNN_TENSOR_UINT8;
inputs[0].size = img_width*img_height*img_channels;
inputs[0].fmt = RKNN_TENSOR_NHWC;
inputs[0].buf = in_data;
inputs[0].pass_through = 0;

ret = rknn_inputs_set(ctx, 1, inputs);
```

<!-- source EN p23 unit 252 -->

### rknn_run

<!-- source EN p23 unit 253 -->

The rknn_run function will perform a model inference. The input data need to be configured by the rknn_inputs_set function or zero-copy interface before rknn_run is called.

<!-- source EN p23 unit 254 -->

| API | rknn_run |
| --- | --- |
| Description | Perform a model inference. |
| Parameter | rknn_context context: The object of rknn_contex. |
| Parameter | rknn_run_extend* extend: Reserved for extension. It is not used currently and accepted NULL only. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p23 unit 255 -->

Sample Code:

<!-- source EN p23 unit 256 -->

```c
ret = rknn_run(ctx, NULL);
```

<!-- source EN p23 unit 257 -->

### rknn_outputs_get

<!-- source EN p23 unit 258 -->

The rknn_outputs_get function can get the output data from the model. This function can get multiple output data, each of which is a rknn_output structure object that needs to be created and initialized in turn before the function is called (Note: RV1106/RV1103/RV1106B/RV1103B/RK2118 unsupported) .

<!-- source EN p24 unit 260 -->

There are two ways to store buffers for output data:

<!-- source EN p24 unit 261 -->

1. The user allocate and release buffers themselves. In this case, the rknn_output.is_prealloc needs to be set to 1, and the rknn_output.buf points to users’ allocated buffer.

<!-- source EN p24 unit 262 -->

2. The other is allocated by rknn. At this time, the rknn_output .is_prealloc needs to be set to 0. After the function is executed, rknn_output.buf will be created and store the output data.

<!-- source EN p24 unit 263 -->

| API | rknn_outputs_get |
| --- | --- |
| Description | Get model inference output data. |
| Parameter | rknn_context context: The object of rknn_context. |
| Parameter | uint32_t n_outputs: Number of output. |
| Parameter | rknn_output outputs[]: Array of rknn_output. |
| Parameter | rknn_run_extend* extend: Reserved for extension, currently not used yet. Accepting NULL only. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p24 unit 264 -->

Sample Code:

<!-- source EN p24 unit 265 -->

```c
rknn_output outputs[io_num.n_output];
memset(outputs, 0, sizeof(outputs));
for (int i = 0; i < io_num.n_output; i++) {
   outputs[i].index = i;
   outputs[i].is_prealloc = 0;
   outputs[i].want_float = 1;
}
ret = rknn_outputs_get(ctx, io_num.n_output, outputs, NULL);
```

<!-- source EN p24 unit 266 -->

### rknn_outputs_release

<!-- source EN p24 unit 267 -->

The rknn_outputs_release function will release the relevant resources of the rknn_output object.

<!-- source EN p24 unit 268 -->

| API | rknn_outputs_release |
| --- | --- |
| Description | Release the rknn_output object. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | uint32_t n_outputs: Number of output. |
| Parameter | rknn_output outputs[]: The array of rknn_output to be released. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p24 unit 269 -->

Sample Code:

<!-- source EN p24 unit 270 -->

```c
ret = rknn_outputs_release(ctx, io_num.n_output, outputs);
```

<!-- source EN p24 unit 271 -->

### rknn_set_input_shape (deprecated)

<!-- source EN p24 unit 272 -->

This interface has been deprecated. Please use the rknn_set_input_shapes interface to bind input shapes. The current version is unavailable. If you want to continue using this interface, please use version 1.5.0 SDK and refer to the usage guide document of version 1.5.0.

<!-- source EN p24 unit 273 -->

### rknn_set_input_shapes

<!-- source EN p24 unit 274 -->

For dynamic shape input RKNN models, the currently used input shape must be specified before inference. The interface passes in the number of inputs and the rknn_tensor_attr array, which contains each input shape and corresponding data layout information. The index, name, shape (dims) and memory layout information (fmt) of each rknn_tensor_attr structure object must be filled. Other members of the rknn_tensor_attr structure do not need to be set. Before using this interface, you can use the rknn_query function to query the number of input shapes and the list of dynamic shapes supported by the RKNN model, and the shape of the input data is required to be in the list of input shapes supported by the model. When running for the first time or switching a new input shape every time, you need to call this interface to set a new shape, otherwise, you don’t need to call this interface repeatedly.

<!-- source EN p25 unit 276 -->

| API | rknn_set_input_shapes |
| --- | --- |
| Description | Set the input shape currently used by the model. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | uint32_t n_inputs: The number of input tensors。 |
| Parameter | rknn_tensor_attr *: The attribute array pointer of tensor to pass all the input shape information. The user needs<br>to set the index, name, dims, fmt, and n_dims members of each input attribute structure, and other members do<br>not need to be set. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p25 unit 277 -->

Sample Code:

<!-- source EN p25 unit 278 -->

```c
for (int i = 0; i < io_num.n_input; i++) {
   for (int j = 0; j < input_attrs[i].n_dims; ++j) {
      input_attrs[i].dims[j] = dyn_range[i].dyn_range[0][j];
   }
}
ret = rknn_set_input_shapes(ctx, io_num.n_input, input_attrs);
if (ret < 0) {
   fprintf(stderr, "rknn_set_input_shapes error! ret=%d\n", ret);
   return -1;
}
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
