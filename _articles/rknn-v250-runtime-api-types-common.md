---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Status codes, tensors, memory and extension types"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-types-common"
slug: "rknn-v250-runtime-api-types-common"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Status codes, tensors, memory and extension types | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Status codes, tensors, memory and extension types | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-types-common/"
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

<!-- source EN p36 unit 399 -->

## 6. Type Reference

<!-- source EN p36 unit 400 -->

### 6.1. Status Codes

<!-- source EN p36 unit 401 -->

The return code of the RKNN API function is defined as shown in the following table.

<!-- source EN p36 unit 402 -->

| Error Code | Message |
| --- | --- |
| RKNN_SUCC(0) | Execution is successful. |
| RKNN_ERR_FAIL (-1) | Execution error. |
| RKNN_ERR_TIMEOUT (-2) | Execution timeout. |
| RKNN_ERR_DEVICE_UNAVAILABLE (-3) | NPU device is unavailable. |
| RKNN_ERR_MALLOC_FAIL (-4) | Memory allocation is failed. |
| RKNN_ERR_PARAM_INVALID (-5) | Parameter error. |
| RKNN_ERR_MODEL_INVALID (-6) | RKNN model is invalid. |
| RKNN_ERR_CTX_INVALID (-7) | rknn_context is invalid. |
| RKNN_ERR_INPUT_INVALID (-8) | rknn_input object is invalid. |
| RKNN_ERR_OUTPUT_INVALID (-9) | rknn_output object is invalid. |
| RKNN_ERR_DEVICE_UNMATCH (-10) | Version does not match. |
| RKNN_ERR_INCOMPATILE_PRE_COMPILE_MODEL (-11) | This RKNN model use pre_compile mode, but not compatible<br>with current driver. |
| RKNN_ERR_INCOMPATILE_OPTIMIZATION_LEVEL_VERSION<br>(-12) | This RKNN model use optimization level mode, but not<br>compatible with current driver. |
| RKNN_ERR_TARGET_PLATFORM_UNMATCH (-13) | This RKNN model doesn’t compatible with current platform. |
| RKNN_ERR_KEY_INVALID (-14) | The decryption key envelope is invalid or could not be parsed. |
| RKNN_ERR_DECRYPT_FAILED (-15) | Model or key-envelope decryption failed. |
| RKNN_ERR_SOC_BIND_FAILED (-16) | Current SoC platform does not match any bound platform (SoC<br>bind failure). |

<!-- source EN p36 unit 403 -->

### 6.2. Common Structures

<!-- source EN p36 unit 404 -->

### rknn_sdk_version

<!-- source EN p36 unit 405 -->

The structure rknn_sdk_version is used to indicate the version information of the RKNN SDK. The following table shows the definition:

<!-- source EN p36 unit 406 -->

| Field | Type | Meaning |
| --- | --- | --- |
| api_version | char[] | SDK API version information. |
| drv_version | char[] | SDK driver version information. |

<!-- source EN p36 unit 407 -->

### rknn_input_output_num

<!-- source EN p36 unit 408 -->

The structure rknn_input_output_num represents the number of input and output Tensor,The following table shows the definition:

<!-- source EN p36 unit 409 -->

| Field | Type | Meaning |
| --- | --- | --- |
| n_input | uint32_t | The number of input tensor. |
| n_output | uint32_t | The number of output tensor. |

<!-- source EN p36 unit 410 -->

### rknn_input_range

<!-- source EN p37 unit 411 -->

The structure rknn_input_range represents an input support shape list information. It contains the input index, the number of supported shapes, data layout format, name and shape list. The definition of the specific structure is shown in the following table:

<!-- source EN p37 unit 412 -->

| Field | Type | Meaning |
| --- | --- | --- |
| index | uint32_t | The index position of the input. |
| shape_number | uint32_t | The number of input shapes supported by the RKNN model. |
| fmt | rknn_tensor_format | The data layout format corresponding to the shape. |
| name | char[] | The name of the input. |
| dyn_range | uint32_t[][] | The input shape list, which is a two-dimensional array containing multiple shape arrays,<br>and the shape is stored first. |
| n_dims | uint32_t | The number of valid dimensions for each shape array. |

<!-- source EN p37 unit 413 -->

### rknn_tensor_attr

<!-- source EN p37 unit 414 -->

The structure rknn_tensor_attr represents the attribute of the model's Tensor. The following table shows the definition:

<!-- source EN p37 unit 415 -->

| Field | Type | Meaning |
| --- | --- | --- |
| index | uint32_t | Indicates the index position of the input and output Tensor. |
| n_dims | uint32_t | The number of Tensor dimensions. |
| dims | uint32_t[] | Values for each dimension. |
| name | char[] | Tensor name. |
| n_elems | uint32_t | The number of Tensor data elements. |
| size | uint32_t | The memory size of Tensor data. |
| fmt | rknn_tensor_format | The format of Tensor dimension, has the following format: RKNN_TENSOR_NCHW,<br>RKNN_TENSOR_NHWC, RKNN_TENSOR_NC1HWC2 |
| type | rknn_tensor_type | Tensor data type, has the following data types: RKNN_TENSOR_FLOAT32,<br>RKNN_TENSOR_FLOAT16, RKNN_TENSOR_INT8, RKNN_TENSOR_UINT8,<br>RKNN_TENSOR_INT16, RKNN_TENSOR_UINT16, RKNN_TENSOR_INT32,<br>RKNN_TENSOR_UINT32, RKNN_TENSOR_INT64, RKNN_TENSOR_BOOL,<br>RKNN_TENSOR_INT4, RKNN_TENSOR_BFLOAT16 |
| qnt_type | rknn_tensor_qnt_type | Tensor Quantization Type, has the following types of quantization:<br>RKNN_TENSOR_QNT_NONE: Not quantized;<br>RKNN_TENSOR_QNT_DFP: Dynamic fixed point quantization;<br>RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC: Asymmetric quantification. |
| fl | int8_t | RKNN_TENSOR_QNT_DFP: quantization parameter. |
| zp | int32_t | The zero point for RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC quantization. |
| scale | float | RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC: quantization parameter. |
| w_stride | uint32_t | The number of pixels that actually store one line of image data, which is equal to the<br>number of valid data pixels in one row + the number of invalid pixels that are filled<br>in for the hardware to quickly jump to the next line (unit: per pixel) . |
| size_with_stride | uint32_t | The actual byte size of image data (including the byte size of filled invalid pixels). |
| pass_through | uint8_t | 0: means unconverted data. 1: means converted data, Note: Conversion includes<br>normalization and quantization. |
| h_stride | uint32_t | This is only used in the context of multi-batch input and can be set by users. The<br>purpose of this is to allow NPU to read out beginning of memory address for every<br>batch correctly. It is equivalent of original model input height + the number of invalid<br>pixels that are filled in for the hardware to quickly jump to the next line . If its value<br>is 0, it is the same as model input height (unit: per pixel) . |

<!-- source EN p37 unit 416 -->

### rknn_perf_detail

<!-- source EN p38 unit 417 -->

The structure rknn_perf_detail represents the performance details of the model. The definition of the structure is shown in the following table: (Note: RV1106/RV1103/RV1106B/RV1103B/RK2118 unsupported)

<!-- source EN p38 unit 418 -->

| Field | Type | Meaning |
| --- | --- | --- |
| perf_data | char* | The performance details contain the running time of each layer of the network stored in string type. |
| data_len | uint64_t | The data length of string type of perf_data. |

<!-- source EN p38 unit 419 -->

### rknn_perf_run

<!-- source EN p38 unit 420 -->

The structure rknn_perf_run represents the total inference time of the model. The definition of the structure is shown in the following table: (Note: RV1106/RV1103/RV1106B/RV1103B/RK2118 unsupported)

<!-- source EN p38 unit 421 -->

| Field | Type | Meaning |
| --- | --- | --- |
| run_duration | int64_t | The total inference time of the network (not including setting input/output) in microseconds. |

<!-- source EN p38 unit 422 -->

### rknn_mem_size

<!-- source EN p38 unit 423 -->

The structure rknn_mem_size represents the memory allocation when the model is initialized. The definition of the structure is shown in the following table:

<!-- source EN p38 unit 424 -->

| Field | Type | Meaning |
| --- | --- | --- |
| total_weight_size | uint32_t | The memory size allocated for weights of the network. |
| total_internal_size | uint32_t | The memory size allocated for internal tensor of the network. |
| total_dma_allocated_size | uint64_t | All dma memory size allocated for the network. |
| total_sram_size | uint32_t | Only for RK3588, memory size of SRAM reserved for NPU (Referring to the \&lt;\<br&gt;&lt;RK3588_NPU_SRAM_usage.md&gt;> for more details) . |
| free_sram_size | uint32_t | Only for RK3588, the current available SRAM (Referring to the \&lt;\<br&gt;&lt;RK3588_NPU_SRAM_usage.md&gt;> for more details) . |
| reserved[10] | uint32_t | Reserve. |

<!-- source EN p38 unit 425 -->

### rknn_tensor_mem

<!-- source EN p38 unit 426 -->

The structure rknn_tensor_mem represents the tensor memory information. The definition of the structure is shown in the following table:

<!-- source EN p38 unit 427 -->

| Field | Type | Meaning |
| --- | --- | --- |
| virt_addr | void* | The virtual address of tensor. |
| phys_addr | uint64_t | The physical address of tensor. |
| fd | int32_t | The file descriptor of tensor. |
| offset | int32_t | The offset of fd and virtual address. |
| size | uint32_t | The actual size of tensor. |
| flags | uint32_t | rknn_tensor_mem has the following type of flags:<br>RKNN_TENSOR_MEMORY_FLAGS_ALLOC_INSIDE: indicates that the rknn_tensor_mem structure is<br>created during runtime; RKNN_TENSOR_MEMORY_FLAGS_FROM_FD: It represents the<br>rknn_tensor_mem created by fd; RKNN_TENSOR_MEMORY_FLAGS_FROM_PHYS: It represents<br>rknn_tensor_mem created by physical address; The user does not need to pay attention to the flags. |
| priv_data | void* | private data. |

### rknn_input

<!-- source EN p38 unit 428 -->

The structure rknn_input represents a data input to the model, used as a parameter to the rknn_inputs_set function. The following table shows the definition:

<!-- source EN p38 unit 429 -->

| Field | Type | Meaning |
| --- | --- | --- |
| index | uint32_t | The index position of this input. |
| buf | void* | The pointer of the input data buffer. |
| size | uint32_t | The memory size of the input data buffer. |
| pass_through | uint8_t | When set to 1, buf will be directly set to the input node of the model without any pre-<br>processing. |
| type | rknn_tensor_type | The type of input data. |
| fmt | rknn_tensor_format | The format of input data. |

<!-- source EN p39 unit 431 -->

### rknn_output

<!-- source EN p39 unit 432 -->

The structure rknn_output represents a data output of the model, used as a parameter to the rknn_outputs_get function. This structure will be assigned with data after calling rknn_outputs_get. The following table shows the definition of each member of rknn_output:

<!-- source EN p39 unit 433 -->

| Field | Type | Meaning |
| --- | --- | --- |
| want_float | uint8_t | Indicates whether the output data needs to be converted to float type, this field is set by the user. |
| is_prealloc | uint8_t | Indicates whether the buffer that stores the output data is pre-allocated, this field is set by the user. |
| index | uint32_t | The index position of this output, this field is set by the user, this field is returned by the interface. |
| buf | void* | The pointer pointing to the output data buffer, this field is returned by the interface. |
| size | uint32_t | Output data buffer size in byte, this field is returned by the interface. |

<!-- source EN p39 unit 434 -->

### rknn_decrypt_key_mem

<!-- source EN p39 unit 435 -->

The structure rknn_decrypt_key_mem is a helper struct for passing the encrypted-model key envelope to rknn_init via the user_key member of rknn_init_extend. The definition of the structure is shown in the following table:

<!-- source EN p39 unit 436 -->

| Field | Type | Meaning |
| --- | --- | --- |
| key_data | void* | Pointer to the RKKE key-envelope memory. |
| key_size | uint32_t | Length of the key envelope in bytes. |

<!-- source EN p39 unit 437 -->

### rknn_init_extend

<!-- source EN p39 unit 438 -->

The structure rknn_init_extend represents the extended information when the model is initialized. The definition of the structure is shown in the following table:

<!-- source EN p39 unit 439 -->

| Field | Type | Meaning |
| --- | --- | --- |
| ctx | rknn_context | The initialized rknn_context object. |
| real_model_offset | int32_t | The real offset that is in .rknn model file. Only valid when using file path as<br>initialized parameter or zero-copy model buffer. |
| real_model_size | uint32_t | The real size of rknn model file. Only valid when using file path as initialized<br>parameter or zero-copy model buffer. |
| model_buffer_fd | int32_t | The fd represented by the model memory allocated by the NPU after<br>initialization with the RKNN_FLAG_MODEL_BUFFER_ZERO_COPY flag. |
| model_buffer_flags | uint32_t | The memory flag represented by the model memory allocated by the NPU<br>after initialization with the RKNN_FLAG_MODEL_BUFFER_ZERO_COPY flag. |
| user_key | rknn_decrypt_key_mem* | Pointer to user-supplied encryption key (rknn_decrypt_key_mem*). Used for<br>loading RKCE encrypted models. Set to NULL for plaintext models. |
| reserved | uint8_t[] | The reserved data. |

<!-- source EN p39 unit 440 -->

### rknn_run_extend

<!-- source EN p39 unit 441 -->

The structure rknn_run_extend represents the extended information during model inference. It is not available currently. The definition of the structure is shown in the following table:

<!-- source EN p40 unit 442 -->

| Field | Type | Meaning |
| --- | --- | --- |
| frame_id | uint64_t | The index of frame of current inference. |
| non_block | int32_t | 0 means blocking mode, 1 means non-blocking mode, non-blocking mode means that the rknn_run<br>call returns immediately. |
| timeout_ms | int32_t | The timeout of inference in milliseconds. |
| fence_fd | int32_t | For the non-blocking inference (Not Available) . |

<!-- source EN p40 unit 443 -->

### rknn_output_extend

<!-- source EN p40 unit 444 -->

The structure rknn_output_extend means to obtain the extended information of the output. It is not available currently. The definition of the structure is shown in the following table:

<!-- source EN p40 unit 445 -->

| Field | Type | Meaning |
| --- | --- | --- |
| frame_id | uint64_t | The frame index of the output result. |

<!-- source EN p40 unit 446 -->

### rknn_custom_string

<!-- source EN p40 unit 447 -->

The structure rknn_custom_string represents the custom string set by the user when converting the RKNN model. The definition of the structure is shown in the following table:

<!-- source EN p40 unit 448 -->

| Field | Type | Meaning |
| --- | --- | --- |
| string | char[] | User-defined string. |

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
