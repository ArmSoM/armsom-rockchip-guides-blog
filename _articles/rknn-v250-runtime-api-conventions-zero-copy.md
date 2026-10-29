---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Memory ownership and general/zero-copy flows"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-conventions-zero-copy"
slug: "rknn-v250-runtime-api-conventions-zero-copy"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Memory ownership and general/zero-copy flows | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Memory ownership and general/zero-copy flows | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-conventions-zero-copy/"
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

<!-- source EN p8 unit 38 -->

## 3. C API Common Conventions

<!-- source EN p8 unit 39 -->

### 3.1 Platform Differences

<!-- source EN p8 unit 40 -->

Due to the different hardware characteristics of different chip platforms, the RKNN C API interface and interface parameter support are also different. The RKNN C API interface support of each hardware platform is shown in Table 3-1:

<!-- source EN p8 unit 41 -->

Table 3-1 RKNN C API interface support for each hardware platform

<!-- source EN p8 unit 42 -->

|  | RKNN C API | RV1126B/RK3562/<br>RK3566/RK3568 | RK3576/RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B | RK2118 |
| --- | --- | --- | --- | --- | --- |
| 1 | rknn_init | √ | √ | √ | √ |
| 2 | rknn_set_core_mask | × | √ | × | × |
| 3 | rknn_dup_context | √ | √ | × | × |
| 4 | rknn_destroy | √ | √ | √ | √ |
| 5 | rknn_query | √ | √ | √ | √ |
| 6 | rknn_inputs_set | √ | √ | × | × |
| 7 | rknn_run | √ | √ | √ | √ |
| 8 | rknn_wait | × | × | × | × |
| 9 | rknn_outputs_get | √ | √ | × | × |
| 10 | rknn_outputs_release | √ | √ | × | × |
| 11 | rknn_create_mem_from_mb_blk | × | × | × | × |
| 12 | rknn_create_mem_from_phys | √ | √ | √ | √ |
| 13 | rknn_create_mem_from_fd | √ | √ | √ | × |
| 14 | rknn_create_mem | √ | √ | √ | √ |
| 15 | rknn_destroy_mem | √ | √ | √ | √ |
| 16 | rknn_set_weight_mem | √ | √ | √ | √ |
| 17 | rknn_set_internal_mem | √ | √ | √ | √ |
| 18 | rknn_set_io_mem | √ | √ | √ | √ |
| 19 | rknn_set_input_shapes | √ | √ | × | × |
| 20 | rknn_mem_sync | √ | √ | √ | √ |
| 21 | rknn_matmul_create | √ | √ | × | × |
| 22 | rknn_matmul_set_io_mem | √ | √ | × | × |
| 23 | rknn_matmul_set_core_mask | × | √ | × | × |
| 24 | rknn_matmul_run | √ | √ | × | × |
| 25 | rknn_matmul_destroy | √ | √ | × | × |
| 26 | rknn_register_custom_ops | √ | √ | × | × |
| 27 | rknn_custom_op_get_op_attr | √ | √ | × | × |
| 28 | rknn_set_batch_core_num | × | √ | × | × |
| 29 | rknn_matmul_set_quant_params | √ | √ | × | × |
| 30 | rknn_matmul_get_quant_params | √ | √ | × | × |
| 31 | rknn_matmul_create_dynamic_shape | √ | √ | × | × |
| 32 | rknn_matmul_set_dynamic_shape | √ | √ | × | × |
| 33 | rknn_B_normal_layout_to_native_layout | √ | √ | × | × |
| 34 | rknn_create_mem2 | √ | √ | √ | √ |

<!-- source EN p9 unit 43 -->

The query parameters supported by each hardware platform using the rknn_query function are shown in Table 3-2:

<!-- source EN p9 unit 44 -->

Table 3-2 Query parameters supported by the rknn_query function on each hardware platform

<!-- source EN p9 unit 45 -->

|  | rknn_query params | RV1126B/RK3562/<br>RK3566/RK3568 | RK3576/<br>RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B/RK2118 |
| --- | --- | --- | --- | --- |
| 1 | RKNN_QUERY_IN_OUT_NUM | √ | √ | √ |
| 2 | RKNN_QUERY_INPUT_ATTR | √ | √ | √ |
| 3 | RKNN_QUERY_OUTPUT_ATTR | √ | √ | √ |
| 4 | RKNN_QUERY_PERF_DETAIL | √ | √ | × |
| 5 | RKNN_QUERY_PERF_RUN | √ | √ | × |
| 6 | RKNN_QUERY_SDK_VERSION | √ | √ | √ |
| 7 | RKNN_QUERY_MEM_SIZE | √ | √ | √ |
| 8 | RKNN_QUERY_CUSTOM_STRING | √ | √ | √ |
| 9 | RKNN_QUERY_NATIVE_INPUT_ATTR | √ | √ | √ |
| 10 | RKNN_QUERY_NATIVE_OUTPUT_ATTR | √ | √ | √ |
| 11 | RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | √ | √ | √ |
| 12 | RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | √ | √ | √ |
| 13 | RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | √ | √ | √ |
| 14 | RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | √ | √ | √ |
| 15 | RKNN_QUERY_INPUT_DYNAMIC_RANGE | √ | √ | × |
| 16 | RKNN_QUERY_DEVICE_MEM_INFO | × | × | √ |
| 17 | RKNN_QUERY_CURRENT_INPUT_ATTR | √ | √ | × |
| 18 | RKNN_QUERY_CURRENT_OUTPUT_ATTR | √ | √ | × |
| 19 | RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | √ | √ | × |
| 20 | RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | √ | √ | × |

<!-- source EN p9 unit 46 -->

### 3.2 Memory Ownership

<!-- source EN p9 unit 47 -->

Memory allocated by the API: The tensor memory allocated via rknn_create_mem is owned by the caller and must be released by calling rknn_destroy_mem when no longer used. Avoid double release.

<!-- source EN p9 unit 48 -->

User-allocated memory: The user-allocated memory accepted by rknn_set_weight_mem, rknn_set_internal_mem, and rknn_set_io_mem remains owned by the caller and must be released by the caller after use.

<!-- source EN p9 unit 49 -->

External memory wrappers: rknn_create_mem_from_fd, rknn_create_mem_from_phys, and rknn_create_mem_from_mb_blk associate already-allocated memory (represented by a file descriptor, physical address, or mb_blk) with the RKNN framework for zero-copy. The wrapped rknn_tensor_mem object must still be released via rknn_destroy_mem.

<!-- source EN p9 unit 50 -->

### 3.3 Input and Output Data Validity

<!-- source EN p9 unit 51 -->

The inputs array and the input data pointed to by buf of rknn_inputs_set must remain valid during the call.

<!-- source EN p9 unit 52 -->

The outputs array of rknn_outputs_get must be created by the user in advance with index set; when is_prealloc is 1, buf is pre-allocated by the user and must remain valid during the call; when is_prealloc is 0, buf is allocated by the interface and must remain valid until released by rknn_outputs_release. After release, the buf pointer becomes invalid and must no longer be used.

<!-- source EN p9 unit 53 -->

The input/output tensor memory set via rknn_set_io_mem must remain valid during the call and must be set before calling rknn_run.

<!-- source EN p9 unit 54 -->

### 3.4 Return Values and Error Handling

<!-- source EN p10 unit 55 -->

Most interfaces return an int status code: 0 indicates success and a negative value indicates an error. A few interfaces return pointers (such as rknn_create_mem, rknn_create_mem_from_fd, rknn_create_mem_from_phys, rknn_create_mem_from_mb_blk) and return NULL on failure.

<!-- source EN p10 unit 56 -->

For the complete status code definitions, see 6.1 Status Codes.

<!-- source EN p10 unit 57 -->

The caller should check the return value of every call and, when handling errors, locate the problem based on the status code (for example, RKNN_ERR_DEVICE_UNMATCH indicates a version mismatch, and RKNN_ERR_CTX_INVALID indicates an invalid context).

<!-- source EN p10 unit 58 -->

### 3.5 General API and Zero-copy API

<!-- source EN p10 unit 59 -->

When inferring an RKNN model, the raw data goes through three main flows: input processing, NPU running the model, and output processing. Depending on the model input format and quantization method, there are two processing flows inside the interface: the general API and the zero-copy API. The main differences between them in usage and call flow are as follows:

<!-- source EN p10 unit 60 -->

General API: Provides a simple and easy-to-use set of inference interfaces (rknn_inputs_set/rknn_outputs_get/rknn_outputs_release). Every time frame data is updated, the data allocated by the external module must be copied into the NPU runtime's input memory. Normalization, quantization, data layout conversion and dequantization are mainly performed on the CPU, while model inference runs on the NPU.

<!-- source EN p10 unit 61 -->

Zero-copy API: Creates or wraps memory via interfaces such as rknn_create_mem/rknn_create_mem_from_fd/rknn_create_mem_from_phys, then sets the input/output memory via rknn_set_io_mem. It directly uses pre-allocated memory (created by the NPU runtime or by another external framework such as DRM), reducing memory copies, delivering better performance and lower bandwidth. Normalization, quantization and model inference all run on the NPU.

<!-- source EN p10 unit 62 -->

Interface selection: When the user input data only has a virtual address, only the general API can be used; when the input data has a physical address or fd, the zero-copy API is used. The general API and the zero-copy API cannot be mixed.

<!-- source EN p10 unit 63 -->

General API call flow (as shown in Figure 3-1):

<!-- source EN p10 unit 64 -->

1. Call rknn_init() to initialize the model;

<!-- source EN p10 unit 65 -->

2. Call rknn_query() to query the input/output attributes of the model;

<!-- source EN p10 unit 66 -->

3. Preprocess the input;

<!-- source EN p10 unit 67 -->

4. Call rknn_inputs_set() to set the input data;

<!-- source EN p10 unit 68 -->

5. Call rknn_run() to perform model inference;

<!-- source EN p10 unit 69 -->

6. Call rknn_outputs_get() to get the inference result data;

<!-- source EN p10 unit 70 -->

7. Postprocess the output;

<!-- source EN p10 unit 71 -->

8. Call rknn_outputs_release() to release the output data memory;

<!-- source EN p10 unit 72 -->

9. Call rknn_destroy() to destroy RKNN.

<!-- source EN p11 unit 73 -->

![Figure from the source PDF — 11](/assets/images/rknn-v250/apis/runtime/en/p011-figure-01.png)

<!-- source EN p11 unit 74 -->

Figure 3-1 General API call flow

<!-- source EN p11 unit 75 -->

Zero-copy API call flow (taking input/output memory allocated by the runtime as an example, as shown in Figure 3-2):

<!-- source EN p11 unit 76 -->

1. Call rknn_init() to initialize the model;

<!-- source EN p11 unit 77 -->

2. Call rknn_query() to query the native input/output attributes of the model (RKNN_QUERY_NATIVE_INPUT_ATTR/RKNN_QUERY_NATIVE_OUTPUT_ATTR);

<!-- source EN p11 unit 78 -->

3. Preprocess the input (optional);

<!-- source EN p11 unit 79 -->

4. Call rknn_create_mem() to create the input/output rknn_tensor_mem structures (use rknn_create_mem_from_fd()/rknn_create_mem_from_phys() for externally allocated memory);

<!-- source EN p11 unit 80 -->

5. Call rknn_set_io_mem() to set the input/output memory;

<!-- source EN p11 unit 81 -->

6. Call rknn_run() to perform model inference;

<!-- source EN p11 unit 82 -->

7. Read the output memory information from the rknn_tensor_mem structure and postprocess;

<!-- source EN p11 unit 83 -->

8. Call rknn_destroy_mem() to release the input/output memory;

<!-- source EN p11 unit 84 -->

9. Call rknn_destroy() to destroy RKNN.

<!-- source EN p12 unit 85 -->

![Figure from the source PDF — 12](/assets/images/rknn-v250/apis/runtime/en/p012-figure-01.png)

<!-- source EN p12 unit 86 -->

Figure 3-2 Zero-copy API call flow (input/output allocated internally)

<!-- source EN p12 unit 87 -->

For the detailed usage of rknn_set_io_mem(), see rknn_set_io_mem in 5.4 Tensor and Memory.

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
