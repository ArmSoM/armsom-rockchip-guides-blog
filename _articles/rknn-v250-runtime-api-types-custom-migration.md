---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Custom operator types and deprecated API migration"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-types-custom-migration"
slug: "rknn-v250-runtime-api-types-custom-migration"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Custom operator types and deprecated API migration | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Custom operator types and deprecated API migration | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-types-custom-migration/"
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

<!-- source EN p43 unit 467 -->

### 6.4. Custom Operator Structures

<!-- source EN p43 unit 468 -->

### rknn_gpu_op_context

<!-- source EN p43 unit 469 -->

rknn_gpu_op_context represents the context information of the custom operator run by the specified GPU. The definition of the structure is shown in the following table:

<!-- source EN p43 unit 470 -->

| Field | Type | Meaning |
| --- | --- | --- |
| cl_context | void* | OpenCL's cl_context object, please force type conversion to cl_context when using it. |
| cl_command_queue | void* | OpenCL's cl_command_queue object, please force type conversion to cl_command_queue<br>when using it. |
| cl_kernel | void* | OpenCL's cl_kernel object, please force type conversion to cl_kernel when using it. |

<!-- source EN p43 unit 471 -->

### rknn_custom_op_context

<!-- source EN p43 unit 472 -->

rknn_custom_op_context represents the context information of the custom operator. The definition of the structure is shown in the following table:

<!-- source EN p43 unit 473 -->

| Field | Type | Meaning |
| --- | --- | --- |
| target | rknn_target_type | Backend device that executes custom operators:<br>RKNN_TARGET_TYPE_CPU: CPU<br>RKNN_TARGET_TYPE_CPU: GPU |
| internal_ctx | rknn_custom_op_interal_context | Private context inside the operator. |
| gpu_ctx | rknn_gpu_op_context | Contains the OpenCL context information of the custom operator. When the<br>execution backend device is a GPU, OpenCL objects such as cl_context are<br>obtained from this structure in the callback function. |
| priv_data | void* | Data pointers left to developers to manage. |

<!-- source EN p43 unit 474 -->

### rknn_custom_op_tensor

<!-- source EN p43 unit 475 -->

rknn_custom_op_tensor represents the input/output tensor information of the custom operator. The definition of the structure is shown in the following table:

<!-- source EN p43 unit 476 -->

| Field | Type | Meaning |
| --- | --- | --- |
| attr | rknn_tensor_attr | Contains the name, shape, size and other information of the tensor. |
| mem | rknn_tensor_mem | Contains tensor's memory address, fd, valid data offset and other information. |

<!-- source EN p43 unit 477 -->

### rknn_custom_op_attr

<!-- source EN p43 unit 478 -->

rknn_custom_op_attr represents the parameters or attribute information of the custom operator. The definition of the structure is shown in the following table:

<!-- source EN p43 unit 479 -->

| Field | Type | Meaning |
| --- | --- | --- |
| name | char[] | The parameter name of the custom operator. |
| dtype | rknn_tensor_type | The data type of each element. |
| n_elems | uint32_t | Number of elements. |
| data | void* | The virtual address of the parameter data memory segment. |

<!-- source EN p43 unit 480 -->

### rknn_custom_op

<!-- source EN p43 unit 481 -->

rknn_custom_op represents the registration information of the custom operator. The definition of the structure is shown in the following table:

<!-- source EN p43 unit 482 -->

| Field | Type | Meaning |
| --- | --- | --- |
| version | uint32_t | Custom operator version number. |
| target | rknn_target_type | Custom operator execution backend type. |
| op_type | char[] | Custom operator type. |
| cl_kernel_name | char[] | OpenCL kernel function name. |
| cl_kernel_source | char* | OpenCL resource name. When cl_source_size is equal<br>to 0, it represents the absolute path of the file; when<br>cl_source_size is greater than 0, it represents the<br>string of kernel function code. |
| cl_source_size | uint64_t | When cl_kernel_source is a string, it indicates the<br>length of the string; when cl_kernel_source is a file<br>path, it is set to 0. |
| cl_build_options | char[] | Compilation options for the OpenCL kernel. |
| init | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t n_inputs,<br>rknn_custom_op_tensor* outputs, uint32_t<br>n_outputs); | Custom operator initialization callback function<br>pointer. Called once during registration. It can be set<br>to NULL when not needed. |
| prepare | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t n_inputs,<br>rknn_custom_op_tensor* outputs, uint32_t<br>n_outputs); | Preprocessing callback function pointer. Called once<br>during rknn_run. It can be set to NULL when not<br>needed. |
| compute | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t n_inputs,<br>rknn_custom_op_tensor* outputs, uint32_t<br>n_outputs); | The callback function pointer of the custom operator<br>function. Called once during rknn_run. Cannot be set<br>to NULL. |
| compute_native | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t n_inputs,<br>rknn_custom_op_tensor* outputs, uint32_t<br>n_outputs); | High-performance computing callback function<br>pointer. The difference between it and the compute<br>callback function is the format of the input and output<br>tensor. Not supported yet, currently set to NULL. |
| destroy | int (*)(rknn_custom_op_context* op_ctx); | The callback function pointer for destroying resources.<br>Called once during rknn_destroy. |

<!-- source EN p45 unit 484 -->

## 7. API Changes, Deprecation and Migration

<!-- source EN p45 unit 485 -->

The interface additions, modifications and deprecations of each RKNN C API version are described in the "Revision History" table in the preface of this manual.

<!-- source EN p45 unit 486 -->

The current version (V2.5.0) contains the following deprecated interfaces. Please use their replacement interfaces:

<!-- source EN p45 unit 487 -->

| Deprecated interface | Replacement interface |
| --- | --- |
| rknn_set_input_shape | rknn_set_input_shapes |
| rknn_matmul_create_dyn_shape | rknn_matmul_create_dynamic_shape |

<!-- source EN p45 unit 488 -->

For details of the deprecated interfaces above, see rknn_set_input_shape (deprecated) in 5.3 Inference Execution and rknn_matmul_create_dyn_shape (deprecated) in 5.5 Matrix Multiplication.

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
