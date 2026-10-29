---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Device, context and initialization flags"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-device-context"
slug: "rknn-v250-runtime-api-device-context"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Device, context and initialization flags | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Device, context and initialization flags | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-device-context/"
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

<!-- source EN p13 unit 88 -->

## 5. Function Reference

<!-- source EN p13 unit 89 -->

API Functions

<!-- source EN p13 unit 90 -->

The RKNN C API is classified by function as follows:

<!-- source EN p13 unit 91 -->

| Category | Description |
| --- | --- |
| 5.1. Device and Context | Runtime context initialization and destruction, NPU core configuration. |
| 5.2. Query | Query model attributes, SDK version, memory usage and other information. |
| 5.3. Inference Execution | Set input, execute inference, get output and dynamic shape setting. |
| 5.4. Tensor and Memory | Tensor memory allocation, release, synchronization and user-defined memory setting. |
| 5.5. Matrix Multiplication | Matrix multiplication context creation, memory setting, quantization parameters and execution. |
| 5.6. Custom Operators | Custom operator registration and operator attribute retrieval. |

<!-- source EN p13 unit 92 -->

### 5.1. Device and Context

<!-- source EN p13 unit 93 -->

Runtime context initialization and destruction, NPU core configuration.

<!-- source EN p13 unit 94 -->

### rknn_init

<!-- source EN p13 unit 95 -->

The function of the rknn_init initialization function is to create a rknn_context object, load the RKNN model, and perform specific initialization behaviors based on the flag and rknn_init_extend structures.

<!-- source EN p13 unit 96 -->

| API | rknn_init |
| --- | --- |
| Description | Initialize rknn context. |
| Parameters | rknn_context *context: The pointer of rknn_context object. |
| Parameters | void *model: Binary data for the RKNN model or the path of RKNN model. When the parameter size is greater<br>than 0, model represents binary data; when the parameter size is equal to 0, model represents the RKNN model<br>path. |
| Parameters | uint32_t size: When model is stored in binary data, it indicates the size of the model. The size is 0 when model is<br>given as the path. |
| Parameters | uint32_t flag: Initialization flag, the default initialization behavior needs to be set to 0. |
| Parameters | rknn_init_extend: The extended information during specific initialization. It is disabled at the moment, which<br>indicates this must be passed by the NULL. If using share weight, it should pass the pointer of another<br>rknn_context pointing to another model. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p13 unit 97 -->

Sample Code:

<!-- source EN p13 unit 98 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
```

<!-- source EN p13 unit 99 -->

Each initialization flag is explained as follows:

<!-- source EN p13 unit 100 -->

RKNN_FLAG_PRIOR_HIGH: Set high priority context.

<!-- source EN p13 unit 101 -->

RKNN_FLAG_PRIOR_MEDIUM: Set medium priority context.

<!-- source EN p13 unit 102 -->

RKNN_FLAG_PRIOR_LOW: Set low priority context.

<!-- source EN p13 unit 103 -->

RKNN_FLAG_ASYNC_MASK: Asynchronous mode. When enabled, rknn_outputs_get will not block for too long because it directly retrieves the result of the previous frame, which can increase the frame rate in single-threaded mode, at the cost of rknn_outputs_get not retrieving the result of the current frame. In multi-threaded mode, you do not need to enable this mode.

<!-- source EN p13 unit 104 -->

RKNN_FLAG_COLLECT_PERF_MASK: used to query the time of each layer of the network at runtime;

<!-- source EN p14 unit 105 -->

RKNN_FLAG_MEM_ALLOC_OUTSIDE: used to indicate that model input, output, weight, and intermediate tensor memory are all allocated by the user. It mainly has two functions:

<!-- source EN p14 unit 106 -->

1) All memory is allocated by the user, which facilitates the overall arrangement of the entire system memory.

<!-- source EN p14 unit 107 -->

2) Used for memory reuse, especially for situations like RV1106/RV1103/RV1106B/RV1103B/RK2118 where memory is extremely tight.

<!-- source EN p14 unit 108 -->

Assume that there are two models, model A and model B. These two models are designed to run in series, so the memory of the intermediate tensors of the two models can be reused. The sample code is as follows:

<!-- source EN p14 unit 109 -->

```c
rknn_context ctx_a, ctx_b;

rknn_init(&ctx_a, model_path_a, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
rknn_query(ctx_a, RKNN_QUERY_MEM_SIZE, &mem_size_a, sizeof(mem_size_a));

rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
rknn_query(ctx_b, RKNN_QUERY_MEM_SIZE, &mem_size_b, sizeof(mem_size_b));

max_internal_size = MAX(mem_size_a.total_internal_size, mem_size_b.total_internal_size);
internal_mem_max = rknn_create_mem(ctx_a, max_internal_size);

internal_mem_a = rknn_create_mem_from_fd(ctx_a, internal_mem_max->fd,
      internal_mem_max->virt_addr, mem_size_a.total_internal_size, 0);
rknn_set_internal_mem(ctx_a, internal_mem_a);

internal_mem_b = rknn_create_mem_from_fd(ctx_b, internal_mem_max->fd,
      internal_mem_max->virt_addr, mem_size_b.total_internal_size, 0);
rknn_set_internal_mem(ctx_b, internal_mem_b);
```

<!-- source EN p14 unit 110 -->

RKNN_FLAG_SHARE_WEIGHT_MEM: Weight used to share another model's weight. Mainly used to simulate variable length model input (this function is replaced by the dynamic shape function after the RKNPU runtime library version is greater than or equal to 1.5.0). For example, for some speech models, the input length is variable, but because the NPU cannot support variable-length input, it is necessary to generate several RKNN models with different resolutions. Among them, only one RKNN model retains complete weights, and the other RKNN models do not have weights. When initializing an unweighted RKNN model, using this flag allows the current context to share the weights of the complete RKNN model. Assuming that two models with resolutions A and B are required, the usage process is as follows:

<!-- source EN p14 unit 111 -->

1) Use RKNN-Toolkit2 to generate a model with resolution A.

<!-- source EN p14 unit 112 -->

2) Use RKNN-Toolkit2 to generate a model with resolution B without weight. In rknn.config(), remove_weight should be set to True. The main purpose is to reduce the size of model B.

<!-- source EN p14 unit 113 -->

3) On the board, initialize model A normally.

<!-- source EN p14 unit 114 -->

4) Initialize model B through the flags of RKNN_FLAG_SHARE_WEIGHT_MEM.

<!-- source EN p14 unit 115 -->

5) Others should be used in the original way. The board reference code is as follows:

<!-- source EN p14 unit 116 -->

```c
rknn_context ctx_a, ctx_b;
rknn_init(&ctx_a, model_path_a, 0, 0, NULL);

rknn_init_extend extend;
extend.ctx = ctx_a;
rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_SHARE_WEIGHT_MEM, &extend);
```

<!-- source EN p14 unit 117 -->

RKNN_FLAG_FENCE_IN_OUTSIDE: Send fence fd from outside.

<!-- source EN p14 unit 118 -->

RKNN_FLAG_FENCE_OUT_OUTSIDE: Get fence fd from inside.

<!-- source EN p14 unit 119 -->

RKNN_FLAG_COLLECT_MODEL_INFO_ONLY: used to initialize an empty context. It can only call the rknn_query interface to query the total size of the model weight memory and the total size of the intermediate tensor, but cannot perform inference;

<!-- source EN p14 unit 120 -->

RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE: Indicates that the intermediate tensor of the model is allocated by the user. It is often used by the user to manage and reuse the intermediate tensor memory between multiple models;

<!-- source EN p15 unit 121 -->

RKNN_FLAG_EXECUTE_FALLBACK_PRIOR_DEVICE_GPU: Indicates that all layers not supported by the NPU are preferred to run on the GPU, but it is not guaranteed to run on the GPU. The actual running back-end device depends on the runtime support for the operator;

<!-- source EN p15 unit 122 -->

RKNN_FLAG_ENABLE_SRAM: Indicates that the intermediate tensor memory is allocated on SRAM as much as possible;

<!-- source EN p15 unit 123 -->

RKNN_FLAG_SHARE_SRAM: used for the current context to try to share the SRAM memory address space of another context. It is required that the RKNN_FLAG_ENABLE_SRAM flag must be enabled when the current context is initialized;

<!-- source EN p15 unit 124 -->

RKNN_FLAG_DISABLE_PROC_HIGH_PRIORITY: Indicates that the current context uses the default process priority. If this flag is not set, the nice value of the process is -19;

<!-- source EN p15 unit 125 -->

RKNN_FLAG_DISABLE_FLUSH_INPUT_MEM_CACHE: The runtime does not flush input tensor cache, the user must ensure that the input tensor has flushed the cache before calling rknn_run.

<!-- source EN p15 unit 126 -->

RKNN_FLAG_DISABLE_FLUSH_OUTPUT_MEM_CACHE: The runtime does not actively clear the output tensor cache. In this case, direct access to output_mem->virt_addr by the user can lead to cache consistency issues. If the user intends to use output_mem->virt_addr, it is necessary to utilize rknn_mem_sync(ctx, mem, RKNN_MEMORY_SYNC_FROM_DEVICE) to refresh the cache. This flag is typically used when the output data from the NPU is not accessed by the CPU, such as when the output data is accessed by the GPU or RGA.

<!-- source EN p15 unit 127 -->

RKNN_FLAG_MODEL_BUFFER_ZERO_COPY: It means that the incoming model buffer of the rknn_init interface is the memory allocated by the rknn_create_mem or rknn_create_mem2 interface, and the model buffer does not need to be copied once inside the runtime to reduce the memory occupation of the runtime, but the user needs to ensure that the model memory is valid before the context is destroyed. And free that memory after destroying the context. When you initialize a context, rknn_init the rknn_init_extend parameters of the interface, whose members real_model_offset, real_model_size, model_buffer_fd, and model_buffer_flags rknn_tensor_mem returned based on the rknn_create_mem2 interface.

<!-- source EN p15 unit 128 -->

RKNN_MEM_FLAG_ALLOC_NO_CONTEXT: When allocating memory using rknn_create_mem2 interfaces, after setting this flag, the ctx parameter is allowed to be 0 or NULL. Thus, the user can obtain the memory allocated by the NPU driver before initializing any of the contexts, and the returned memory structure needs to be released using the rknn_destroy_mem interface, and the released interface can use any context as a parameter. Example code such as:

<!-- source EN p15 unit 129 -->

```c
  rknn_tensor_mem* model_mem = rknn_create_mem2(ctx, model_size, RKNN_MEM_FLAG_ALLOC_NO_CONTEXT);
  memcpy(model_mem->virt_addr, model_data, model_size);
  rknn_init_extend init_ext;
  memset(&init_ext, 0, sizeof(rknn_init_extend));
  init_ext.real_model_offset = 0;
  init_ext.real_model_size = model_size;
  init_ext.model_buffer_fd = model_mem->fd;
  init_ext.model_buffer_flags = model_mem->flags;
  int ret = rknn_init(&ctx, model_mem->virt_addr, model_size, RKNN_FLAG_MODEL_BUFFER_ZERO_COPY,
&init_ext);

  // do rknn inference...

  rknn_destroy_mem(ctx, model_mem);
  rknn_destroy(ctx);
```

<!-- source EN p15 unit 130 -->

### rknn_set_core_mask

<!-- source EN p15 unit 131 -->

This function sets the specific cores running inside the NPU. For now, it only works at the RK3588 and RK3576. It will return the error code if it is set on platform with a single-core NPU architecture.

<!-- source EN p15 unit 132 -->

| API | rknn_set_core_mask |
| --- | --- |
| Description | Set the cores for the NPU. |
| Parameters | rknn_context context: The object of rknn context. |
| Parameters | rknn_core_mask core_mask: The specification of NPU core setting. It has the following choices:<br>RKNN_NPU_CORE_AUTO : Referring to automatic mode, meaning that it will select the idle core inside the NPU;<br>RKNN_NPU_CORE_0 : Running on the NPU0 core;<br>RKNN_NPU_CORE_1: Runing on the NPU1 core;<br>RKNN_NPU_CORE_2: Runing on the NPU2 core;<br>RKNN_NPU_CORE_0_1: Running on both NPU0 and NPU1 core simultaneously;<br>RKNN_NPU_CORE_0_1_2: Running on both NPU0, NPU1 and NPU2 simultaneously.<br>RKNN_NPU_CORE_ALL: Running on all of NPU cores depending on the platform; |
| Return | int: Error code (See Status Codes). |

<!-- source EN p16 unit 134 -->

```c
rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

<!-- source EN p16 unit 135 -->

For multi-cores mode (when enabling RKNN_NPU_CORE_0_1 and RKNN_NPU_CORE_0_1_2), the following ops have better acceleration : Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu. Prelu, LeakyRelu. Other type of op will fallback to Core0 to continue running. In the future update, some ops like Pool or ConvTranpose will be supported.

<!-- source EN p16 unit 136 -->

### rknn_set_batch_core_num

<!-- source EN p16 unit 137 -->

The rknn_set_batch_core_num function specifies the number of NPU cores of the multi-batch RKNN model (the model exported by setting rknn_batch_size greater than 1 during RKNN-Toolkit2 conversion). This function only supports the RK3588 and RK3576 platform.

<!-- source EN p16 unit 138 -->

| API | rknn_set_batch_core_num |
| --- | --- |
| Description | Set the number of NPU cores for multi-batch RKNN model running. |
| Parameters | rknn_context context: The object of rknn context. |
| Parameters | int core_num: Specifies the number of cores to run. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p16 unit 139 -->

Sample Code:

<!-- source EN p16 unit 140 -->

```c
rknn_context ctx;
int ret = rknn_set_batch_core_num(ctx, 2);
```

<!-- source EN p16 unit 141 -->

### rknn_dup_context

<!-- source EN p16 unit 142 -->

The rknn_dup_context creates a new context object referring to the same model. The new context is useful in the condition where the weight of the model need to be reused during executing the same model on the multi-thread (Unavailable for RV1106/RV1103/RV1106B/RV1103B/RK2118) .

<!-- source EN p16 unit 143 -->

| API | rknn_dup_context |
| --- | --- |
| Description | Creates a new context for the same model, to reuse the weight of the model. |
| Parameters | rknn_context *context_in: The pointer of rknn_context object. After the function is called, the obejct of the input<br>context will be initialized. |
| Parameters | rknn_context *context_out: The pointer of a rknn_context output object where information about this new<br>created object is returned. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p16 unit 144 -->

Sample Code:

<!-- source EN p17 unit 145 -->

```c
rknn_context ctx_in;
rknn_context ctx_out;
int ret = rknn_dup_context(&ctx_in, &ctx_out);
```

<!-- source EN p17 unit 146 -->

### rknn_destroy

<!-- source EN p17 unit 147 -->

This function is used to release the rknn_context and its related resources.

<!-- source EN p17 unit 148 -->

| API | rknn_destroy |
| --- | --- |
| Description | Destroy the rknn_context object and its related resources. |
| Parameters | rknn_context context: The rknn_context object that is going to be destroyed. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p17 unit 149 -->

Sample Code:

<!-- source EN p17 unit 150 -->

```c
rknn_context ctx;
int ret = rknn_destroy(ctx);
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
