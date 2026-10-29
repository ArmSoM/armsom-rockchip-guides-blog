---
title: "Rockchip RKNN Runtime C API: Complete Reference for Base APIs, Matmul and Custom Operators"
description: "Complete RKNN C API V2.3.2 reference covering platform support, compilation, structures, parameters, examples and all error codes, with source inconsistencies documented."
translation_key: "094-rockchip-rknn-runtime-c-api"
slug: "094-rockchip-rknn-runtime-c-api"
lang: "en"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []
tags: ["ArmSoM", "Rockchip", "RKNN", "Runtime", "NPU", "C API"]
keywords: "ArmSoM Rockchip RKNN Runtime C API RK3588 RK3576"
excerpt: "Complete RKNN C API V2.3.2 reference covering platform support, compilation, structures, parameters, examples and all error codes, with source inconsistencies documented."
---

{% raw %}

# Rockchip RKNN Runtime C API: Complete Reference for Base APIs, Matmul and Custom Operators

## ArmSoM applicability and source

Sources are RK-YH-YF-413, V2.3.2: 52 Chinese pages and 57 English pages. Chinese follows the Chinese original; English follows the English original, fully translated into Russian and German. Neither source contains technical illustrations or code screenshots: all technical tables are editable and all code is copyable text; no figures are invented. The source scope includes RV1103/RV1103B/RV1106/RV1106B/RV1126B, RK2118, RK3562 and the RK3566/RK3568/RK3576/RK3588 series, but individual APIs, queries and parameters are not supported on every platform; consult each support matrix. This is an ArmSoM platform-adaptation reference only. No specific board, SDK/BSP, kernel/driver combination has been verified; match RKNPU Runtime, model format and target NPU hardware. No code, hardware or performance tests were run; source examples are not ArmSoM measurements.

Editorial caution: DEVICE_MEM_INFO support prose conflicts with its matrix. Some INPUT/OUTPUT names, CPU/GPU enums and the zero-copy destruction order are also questionable. Source values are retained; this is not a verified runnable correction. Check the editorial notes and actual SDK headers before using examples.

[EDITORIAL-NOTES](/docs/rockchip-rknn-runtime-c-api/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

<!-- source: EN PDF p6; unit 0 -->

## 1. Overview

<!-- source: EN PDF p6; unit 1 -->

RKNN C API is the C language interfaces for RKNPU Runtime (runtime library). By using the RKNN C API, developers can use the computing power of the NPU to perform efficient RKNN model inference or matrix multiplication calculation tasks. This article explains each function, data structure and return code definition of RKNN C API.

<!-- source: EN PDF p6; unit 2 -->

## 2. Supported Hardware Platforms

<!-- source: EN PDF p6; unit 3 -->

This document applies to the following hardware platforms:

<!-- source: EN PDF p6; unit 4 -->

RV1103

<!-- source: EN PDF p6; unit 5 -->

RV1103B

<!-- source: EN PDF p6; unit 6 -->

RV1106

<!-- source: EN PDF p6; unit 7 -->

RV1106B

<!-- source: EN PDF p6; unit 8 -->

RV1126B

<!-- source: EN PDF p6; unit 9 -->

RK2118

<!-- source: EN PDF p6; unit 10 -->

RK3562

<!-- source: EN PDF p6; unit 11 -->

RK3566 series

<!-- source: EN PDF p6; unit 12 -->

RK3568 series

<!-- source: EN PDF p6; unit 13 -->

RK3576 series

<!-- source: EN PDF p6; unit 14 -->

RK3588 series

<!-- source: EN PDF p7; unit 15 -->

## 3. RKNPU compilation instructions

<!-- source: EN PDF p7; unit 16 -->

When developers compile applications, they must include the header file where the interface function is located, and link to the corresponding RKNPU runtime library according to the hardware platform and system type used. The following describes the RKNN C API header files and runtime library files.

<!-- source: EN PDF p7; unit 17 -->

### 3.1 RKNN C API header files

<!-- source: EN PDF p7; unit 18 -->

According to different functional characteristics, the interface of RKNN C API can be divided into three parts. The corresponding relationships between the functions, data structure definitions and header files of each part are as follows:

<!-- source: EN PDF p7; unit 19 -->

1\. “rknn_api.h” defines the basic interface and data structure for deploying the RKNN model.

<!-- source: EN PDF p7; unit 20 -->

2\. “rknn_matmul_api.h” defines the matrix multiplication interface and data structure.

<!-- source: EN PDF p7; unit 21 -->

3\. “rknn_custom_op.h” defines custom operator interface and data structure.

<!-- source: EN PDF p7; unit 22 -->

### 3.2 RKNPU Runtime Library For Linux

<!-- source: EN PDF p7; unit 23 -->

1\. For the RK3562 , RK3566 series, RK3568 series, RK3576 series, RK3588 series and RV1126B hardware platforms, the RKNPU runtime library file is librknnrt.so in the &lt;sdk_path&gt;/rknpu2/runtime directory, where &lt;sdk_path&gt; is the path to the Rockchip NPU software development kit.

<!-- source: EN PDF p7; unit 24 -->

2\. For RV1106/RV1103/RV1106B/RV1103B hardware platforms, the RKNPU runtime library file is librknnmrt.so in the &lt;sdk_path&gt;/rknpu2/runtime directory.

<!-- source: EN PDF p7; unit 25 -->

### 3.3 RKNPU Runtime Library For Android

<!-- source: EN PDF p7; unit 26 -->

There are two ways to call the RKNN API on the Android platform:

<!-- source: EN PDF p7; unit 27 -->

1\. The application can link librknnrt.so directly.

<!-- source: EN PDF p7; unit 28 -->

2\. Application link to librknn_api_android.so implemented by HIDL on Android platform.

<!-- source: EN PDF p7; unit 29 -->

Android devices that need to pass the CTS/VTS test need to use the RKNN API implemented based on the Android platform HIDL (librknn_api_android.so does not include matrix multiplication and custom operator functions). If the device does not need to pass the CTS/VTS test, it is recommended to use librknnrt.so directly (including matrix multiplication and custom operator functions). The link to each interface call process is shorter and can provide better performance.

<!-- source: EN PDF p7; unit 30 -->

The code for the RKNN API implemented using Android HIDL is located in the vendor/rockchip/hardware/interfaces/neuralnetworks directory of the

<!-- source: EN PDF p7; unit 31 -->

RK3562/RK3566/RK3568/RK3576/RK3588 Android system SDK. After the Android system is compiled, a series of library files related to RKNPU will be generated (for application development, you only need to link and use librknn_api_android.so), as shown below:

<!-- source: EN PDF p7; unit 32 -->

```c
/vendor/lib/librknn_api_android.so
/vendor/lib/librknnhal_bridge.rockchip.so
/vendor/lib64/librknn_api_android.so
/vendor/lib64/librknnhal_bridge.rockchip.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0-adapter-helper.so
/vendor/lib64/hw/rockchip.hardware.neuralnetworks@1.0-impl.so
/vendor/bin/hw/rockchip.hardware.neuralnetworks@1.0-service
```

<!-- source: EN PDF p8; unit 33 -->

Alternatively, user can use the following command to recompile and generate the above library separately.

<!-- source: EN PDF p8; unit 34 -->

```c
mmm vendor/rockchip/hardware/interfaces/neuralnetworks/ -j8
```

<!-- source: EN PDF p8; unit 35 -->

### 3.4 RKNPU Runtime Library For RK2118

<!-- source: EN PDF p8; unit 36 -->

For the RK2118 hardware platform, the RKNPU runtime library file is located in the system SDK of the RK2118, please refer to the section "Prepare RK2118 SDK" in "Rockchip_RK2118_Quick_Start_RKNN_SDK_EN.pdf".

<!-- source: EN PDF p9; unit 37 -->

## 4. RKNN C API Description

<!-- source: EN PDF p9; unit 38 -->

### 4.1 C API support of each hardware platform

<!-- source: EN PDF p9; unit 39 -->

Due to the different hardware characteristics of different chip platforms, the RKNN C API interface and interface parameter support are also different. The RKNN C API interface support of each hardware platform is shown in

<!-- source: EN PDF p9; unit 40 -->

Table 4-1:

<!-- source: EN PDF p9; unit 41 -->

Table 4-1 RKNN C API interface support for each hardware platform

<!-- source: EN PDF p9,10; unit 42,43 -->

|  | RKNN C API | RV1126B/RK3562/RK3566/<br>RK3568 | RK3576/RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B | RK2118 |
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

<!-- source: EN PDF p10; unit 44 -->

The query parameters supported by each hardware platform using the rknn_query function are shown in Table 4- 2:

<!-- source: EN PDF p10; unit 45 -->

Table 4-2 Query parameters supported by the rknn_query function on each hardware platform

<!-- source: EN PDF p10; unit 46 -->

|  | rknn_query params | RV1126B/RK3562/RK3566/<br>RK3568 | RK3576/ RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B/RK2118 |
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

<!-- source: EN PDF p10; unit 47 -->

### 4.2 Definition of Basic Data Structcture

<!-- source: EN PDF p10; unit 48 -->

#### rknn_sdk_version

<!-- source: EN PDF p10; unit 49 -->

The structure rknn_sdk_version is used to indicate the version information of the RKNN SDK. The following table shows the definition:

<!-- source: EN PDF p10; unit 50 -->

| Field | Type | Meaning |
| --- | --- | --- |
| api_version | char[] | SDK API version information. |
| drv_version | char[] | SDK driver version information. |

<!-- source: EN PDF p11; unit 51 -->

#### rknn_input_output_num

<!-- source: EN PDF p11; unit 52 -->

The structure rknn_input_output_num represents the number of input and output Tensor，The following table shows the definition:

<!-- source: EN PDF p11; unit 53 -->

| Field | Type | Meaning |
| --- | --- | --- |
| n_input | uint32_t | The number of input tensor. |
| n_output | uint32_t | The number of output tensor. |

<!-- source: EN PDF p11; unit 54 -->

#### rknn_input_range

<!-- source: EN PDF p11; unit 55 -->

The structure rknn_input_range represents an input support shape list information. It contains the input index, the number of supported shapes, data layout format, name and shape list. The definition of the specific structure is shown in the following table:

<!-- source: EN PDF p11; unit 56 -->

| Field | Type | Meaning |
| --- | --- | --- |
| index | uint32_t | The index position of the input. |
| shape_number | uint32_t | The number of input shapes supported by the RKNN model. |
| fmt | rknn_tensor_format | The data layout format corresponding to the shape. |
| name | char[] | The name of the input. |
| dyn_range | uint32_t[][] | The input shape list, which is a two-dimensional array<br>containing multiple shape arrays, and the shape is stored first. |
| n_dims | uint32_t | The number of valid dimensions for each shape array. |

<!-- source: EN PDF p12; unit 57 -->

#### rknn_tensor_attr

<!-- source: EN PDF p12; unit 58 -->

The structure rknn_tensor_attr represents the attribute of the model's Tensor. The following table shows the definition:

<!-- source: EN PDF p12,13; unit 59,60 -->

| Field | Type | Meaning |
| --- | --- | --- |
| index | uint32_t | Indicates the index position of the input and output Tensor. |
| n_dims | uint32_t | The number of Tensor dimensions. |
| dims | uint32_t[] | Values for each dimension. |
| name | char[] | Tensor name. |
| n_elems | uint32_t | The number of Tensor data elements. |
| size | uint32_t | The memory size of Tensor data. |
| fmt | rknn_tensor_format | The format of Tensor dimension, has the following format:<br>RKNN_TENSOR_NCHW, RKNN_TENSOR_NHWC,<br>RKNN_TENSOR_NC1HWC2 |
| type | rknn_tensor_type | Tensor data type, has the following data types:<br>RKNN_TENSOR_FLOAT32,<br>RKNN_TENSOR_FLOAT16, RKNN_TENSOR_INT8,<br>RKNN_TENSOR_UINT8, RKNN_TENSOR_INT16,<br>RKNN_TENSOR_UINT16, RKNN_TENSOR_INT32,<br>RKNN_TENSOR_INT64, RKNN_TENSOR_BOOL |
| qnt_type | rknn_tensor_qnt_type | Tensor Quantization Type, has the following types of<br>quantization:<br>RKNN_TENSOR_QNT_NONE: Not quantized;<br>RKNN_TENSOR_QNT_DFP: Dynamic fixed point<br>quantization;<br>RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC:<br>Asymmetric quantification. |
| fl | int8_t | RKNN_TENSOR_QNT_DFP: quantization parameter. |
| scale | float | RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC:<br>quantization parameter. |
| w_stride | uint32_t | The number of pixels that actually store one line of image data,<br>which is equal to the number of valid data pixels in one row +<br>the number of invalid pixels that are filled in for the hardware<br>to quickly jump to the next line (unit: per pixel) . |
| size_with_stride | uint32_t | The actual byte size of image data (including the byte size of<br>filled invalid pixels). |
| pass_through | uint8_t | 0: means unconverted data. 1: means converted data, Note:<br>Conversion includes normalization and quantization. |
| h_stride | uint32_t | This is only used in the context of multi-batch input and can be<br>set by users. The purpose of this is to allow NPU to read out<br>beginning of memory address for every batch correctly. It is<br>equivalent of original model input height + the number of<br>invalid pixels that are filled in for the hardware to quickly jump<br>to the next line . If its value is 0, it is the same as model input<br>height (unit: per pixel) . |

<!-- source: EN PDF p13; unit 61 -->

#### rknn_perf_detail

<!-- source: EN PDF p13; unit 62 -->

The structure rknn_perf_detail represents the performance details of the model. The definition of the structure is shown in the following table: (Note: RV1106/RV1103/RV1106B/RV1103B/RK2118 unsupported)

<!-- source: EN PDF p13; unit 63 -->

| Field | Type | Meaning |
| --- | --- | --- |
| perf_data | char* | The performance details contain the running time of each layer of the network<br>stored in string type. |
| data_len | uint64_t | The data length of string type of perf_data. |

<!-- source: EN PDF p13; unit 64 -->

#### rknn_perf_run

<!-- source: EN PDF p13; unit 65 -->

The structure rknn_perf_run represents the total inference time of the model. The definition of the structure is shown in the following table: (Note: RV1106/RV1103/RV1106B/RV1103B/RK2118 unsupported)

<!-- source: EN PDF p13; unit 66 -->

| Field | Type | Meaning |
| --- | --- | --- |
| run_duration | int64_t | The total inference time of the network (not including setting input/output) in<br>microseconds. |

<!-- source: EN PDF p14; unit 67 -->

#### rknn_mem_size

<!-- source: EN PDF p14; unit 68 -->

The structure rknn_mem_size represents the memory allocation when the model is initialized. The definition of the structure is shown in the following table:

<!-- source: EN PDF p14; unit 69 -->

| Field | Type | Meaning |
| --- | --- | --- |
| total_weight_size | uint32_t | The memory size allocated for weights of the network. |
| total_internal_size | uint32_t | The memory size allocated for internal tensor of the network. |
| total_dma_allocated_size | uint64_t | All dma memory size allocated for the network. |
| total_sram_size | uint32_t | Only for RK3588, memory size of SRAM reserved for NPU<br>(Referring to the &lt;&lt;RK3588_NPU_SRAM_usage.md&gt;&gt; for<br>more details) . |
| free_sram_size | uint32_t | Only for RK3588, the current available SRAM (Referring to the<br>&lt;&lt;RK3588_NPU_SRAM_usage.md&gt;&gt; for more details) . |
| reserved[12] | uint32_t | Reserve. |

<!-- source: EN PDF p14; unit 70 -->

#### rknn_tensor_mem

<!-- source: EN PDF p14; unit 71 -->

The structure rknn_tensor_mem represents the tensor memory information. The definition of the structure is shown in the following table:

<!-- source: EN PDF p14; unit 72 -->

| Field | Type | Meaning |
| --- | --- | --- |
| virt_addr | void* | The virtual address of tensor. |
| phys_addr | uint64_t | The physical address of tensor. |
| fd | int32_t | The file descriptor of tensor. |
| offset | int32_t | The offset of fd and virtual address. |
| size | uint32_t | The actual size of tensor. |
| flags | uint32_t | rknn_tensor_mem has the following type of flags:<br>RKNN_TENSOR_MEMORY_FALGS_ALLOC_INSIDE: indicates that the<br>rknn_tensor_mem structure is created during runtime;<br>RKNN_TENSOR_MEMORY_FLAGS_FROM_FD: It represents the<br>rknn_tensor_mem created by fd;<br>RKNN_TENSOR_MEMORY_FLAGS_FROM_PHYS: It represents<br>rknn_tensor_mem created by physical address; The user does not need to pay<br>attention to the flags. |
| priv_data | void* | private data. |

<!-- source: EN PDF p15; unit 73 -->

#### rknn_input

<!-- source: EN PDF p15; unit 74 -->

The structure rknn_input represents a data input to the model, used as a parameter to the rknn_inputs_set function. The following table shows the definition:

<!-- source: EN PDF p15; unit 75 -->

| Field | Type | Meaning |
| --- | --- | --- |
| index | uint32_t | The index position of this input. |
| buf | void* | The pointer of the input data buffer. |
| size | uint32_t | The memory size of the input data buffer. |
| pass_through | uint8_t | When set to 1, buf will be directly set to the input node of the<br>model without any pre-processing. |
| type | rknn_tensor_type | The type of input data. |
| fmt | rknn_tensor_format | The format of input data. |

<!-- source: EN PDF p15; unit 76 -->

#### rknn_output

<!-- source: EN PDF p15; unit 77 -->

The structure rknn_output represents a data output of the model, used as a parameter to the rknn_outputs_get function. This structure will be assigned with data after calling rknn_outputs_get. The following table shows the definition of each member of rknn_output:

<!-- source: EN PDF p15; unit 78 -->

| Field | Type | Meaning |
| --- | --- | --- |
| want_float | uint8_t | Indicates whether the output data needs to be converted to float type, this field<br>is set by the user. |
| is_prealloc | uint8_t | Indicates whether the buffer that stores the output data is pre-allocated, this<br>field is set by the user. |
| index | uint32_t | The index position of this output, this field is set by the user, this field is<br>returned by the interface. |
| buf | void* | The pointer pointing to the output data buffer, this field is returned by the<br>interface. |
| size | uint32_t | Output data buffer size in byte, this field is returned by the interface. |

<!-- source: EN PDF p16; unit 79 -->

#### rknn_init_extend

<!-- source: EN PDF p16; unit 80 -->

The structure rknn_init_extend represents the extended information when the model is initialized. It is not available currently on RV1106/RV1103/RV1106B/RV1103B/RK2118. The definition of the structure is shown in the following table:

<!-- source: EN PDF p16; unit 81 -->

| Field | Type | Meaning |
| --- | --- | --- |
| ctx | rknn_context | The initialized rknn_context object. |
| real_model_offset | int32_t | The real offset that is in .rknn model file. Only valid when using<br>file path as initialized parameter or zero-copy model buffer. |
| real_model_size | uint32_t | The real size of rknn model file. Only valid when using file path<br>as initialized parameter or zero-copy model buffer. |
| model_buffer_fd | int32_t | The fd represented by the model memory allocated by the NPU<br>after initialization with the<br>RKNN_FLAG_MODEL_BUFFER_ZERO_COPY flag. |
| model_buffer_flags | uint32_t | The memory flag represented by the model memory allocated by<br>the NPU after initialization with the<br>RKNN_FLAG_MODEL_BUFFER_ZERO_COPY flag. |
| reserved | uint8_t[] | The reserved data. |

<!-- source: EN PDF p16; unit 82 -->

#### rknn_run_extend

<!-- source: EN PDF p16; unit 83 -->

The structure rknn_run_extend represents the extended information during model inference. It is not available currently. The definition of the structure is shown in the following table:

<!-- source: EN PDF p16; unit 84 -->

| Field | Type | Meaning |
| --- | --- | --- |
| frame_id | uint64_t | The index of frame of current inference. |
| non_block | int32_t | 0 means blocking mode, 1 means non-blocking mode, non-blocking mode<br>means that the rknn_run call returns immediately. |
| timeout_ms | int32_t | The timeout of inference in milliseconds. |
| fence_fd | int32_t | For the non-blocking inference (Not Available) . |

<!-- source: EN PDF p16; unit 85 -->

#### rknn_output_extend

<!-- source: EN PDF p16; unit 86 -->

The structure rknn_output_extend means to obtain the extended information of the output. It is not available currently. The definition of the structure is shown in the following table:

<!-- source: EN PDF p16; unit 87 -->

| Field | Type | Meaning |
| --- | --- | --- |
| frame_id | int32_t | The frame index of the output result. |

<!-- source: EN PDF p17; unit 88 -->

#### rknn_custom_string

<!-- source: EN PDF p17; unit 89 -->

The structure rknn_custom_string represents the custom string set by the user when converting the RKNN model. The definition of the structure is shown in the following table:

<!-- source: EN PDF p17; unit 90 -->

| Field | Type | Meaning |
| --- | --- | --- |
| string | char[] | User-defined string. |

<!-- source: EN PDF p18; unit 91 -->

### 4.3 Description of Basic API

<!-- source: EN PDF p18; unit 92 -->

#### rknn_init

<!-- source: EN PDF p18; unit 93 -->

The function of the rknn_init initialization function is to create a rknn_context object, load the RKNN model, and perform specific initialization behaviors based on the flag and rknn_init_extend structures.

<!-- source: EN PDF p18; unit 94 -->

| API | rknn_init |
| --- | --- |
| Description | Initialize rknn context. |
| Parameters | rknn_context *context: The pointer of rknn_context object. |
|  | void *model: Binary data for the RKNN model or the path of RKNN model. When the<br>parameter size is greater than 0, model represents binary data; when the parameter size is<br>equal to 0, model represents the RKNN model path. |
|  | uint32_t size: When model is stored in binary data, it indicates the size of the model. The<br>size is 0 when model is given as the path. |
|  | uint32_t flag: Initialization flag, the default initialization behavior needs to be set to 0. |
|  | rknn_init_extend: The extended information during specific initialization. It is disabled at<br>the moment, which indicates this must be passed by the NULL. If using share weight， it<br>should pass the pointer of another rknn_context pointing to another model. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p18; unit 95 -->

Sample Code:

<!-- source: EN PDF p18; unit 96 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
```

<!-- source: EN PDF p18; unit 97 -->

Each initialization flag is explained as follows:

<!-- source: EN PDF p18; unit 98 -->

RKNN_FLAG_COLLECT_PERF_MASK: used to query the time of each layer of the network at runtime;

<!-- source: EN PDF p18; unit 99 -->

RKNN_FLAG_MEM_ALLOC_OUTSIDE: used to indicate that model input, output, weight, and intermediate tensor memory are all allocated by the user. It mainly has two functions:

<!-- source: EN PDF p18; unit 100 -->

1\. All memory is allocated by the user, which facilitates the overall arrangement of the entire system memory.

<!-- source: EN PDF p18; unit 101 -->

2\. Used for memory reuse, especially for situations like RV1106/RV1103/RV1106B/RV1103B/RK2118 where memory is extremely tight.

<!-- source: EN PDF p18; unit 102 -->

Assume that there are two models, model A and model B. These two models are designed to run in series, so the memory of the intermediate tensors of the two models can be reused. The sample code is as follows:

<!-- source: EN PDF p18,19; unit 103,104 -->

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

<!-- source: EN PDF p19; unit 105 -->

RKNN_FLAG_SHARE_WEIGHT_MEM: Weight used to share another model's weight. Mainly used to simulate variable length model input (this function is replaced by the dynamic shape function after the RKNPU runtime library version is greater than or equal to 1.5.0). For example, for some speech models, the input length is variable, but because the NPU cannot support variable-length input, it is necessary to generate several RKNN models with different resolutions. Among them, only one RKNN model retains complete weights, and the other RKNN models do not have weights. When initializing an unweighted RKNN model, using this flag allows the current context to share the weights of the complete RKNN model. Assuming that two models with resolutions A and B are required, the usage process is as follows:

<!-- source: EN PDF p19; unit 106 -->

1\. Use RKNN-Toolkit2 to generate a model with resolution A.

<!-- source: EN PDF p19; unit 107 -->

2\. Use RKNN-Toolkit2 to generate a model with resolution B without weight. In rknn.config(), remove_weight should be set to True. The main purpose is to reduce the size of model B.

<!-- source: EN PDF p19; unit 108 -->

3\. On the board, initialize model A normally.

<!-- source: EN PDF p19; unit 109 -->

4\. Initialize model B through the flags of RKNN_FLAG_SHARE_WEIGHT_MEM.

<!-- source: EN PDF p19; unit 110 -->

5\. Others should be used in the original way. The board reference code is as follows:

<!-- source: EN PDF p19; unit 111 -->

```c
rknn_context ctx_a, ctx_b;
rknn_init(&ctx_a, model_path_a, 0, 0, NULL);

rknn_init_extend extend;
extend.ctx = ctx_a;
rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_SHARE_WEIGHT_MEM, &extend);
```

<!-- source: EN PDF p19; unit 112 -->

RKNN_FLAG_COLLECT_MODEL_INFO_ONLY: used to initialize an empty context. It can only call the rknn_query interface to query the total size of the model weight memory and the total size of the intermediate tensor, but cannot perform inference;

<!-- source: EN PDF p19; unit 113 -->

RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE: Indicates that the intermediate tensor of the model is allocated by the user. It is often used by the user to manage and reuse the intermediate tensor memory between multiple models;

<!-- source: EN PDF p19; unit 114 -->

RKNN_FLAG_EXECUTE_FALLBACK_PRIOR_DEVICE_GPU: Indicates that all layers not supported by the NPU are preferred to run on the GPU, but it is not guaranteed to run on the GPU. The actual running back-end device depends on the runtime support for the operator;

<!-- source: EN PDF p19; unit 115 -->

RKNN_FLAG_ENABLE_SRAM: Indicates that the intermediate tensor memory is allocated on SRAM as much as possible;

<!-- source: EN PDF p19; unit 116 -->

RKNN_FLAG_SHARE_SRAM: used for the current context to try to share the SRAM memory address space of another context. It is required that the RKNN_FLAG_ENABLE_SRAM flag must be enabled when the current context is initialized;

<!-- source: EN PDF p20; unit 117 -->

RKNN_FLAG_DISABLE_PROC_HIGH_PRIORITY: Indicates that the current context uses the default process priority. If this flag is not set, the nice value of the process is -19;

<!-- source: EN PDF p20; unit 118 -->

RKNN_FLAG_DISABLE_FLUSH_INPUT_MEM_CACHE: The runtime does not flush input tensor cache, the user must ensure that the input tensor has flushed the cache before calling rknn_run.

<!-- source: EN PDF p20; unit 119 -->

RKNN_FLAG_DISABLE_FLUSH_OUTPUT_MEM_CACHE: The runtime does not actively clear the output tensor cache. In this case, direct access to output_mem-&gt;virt_addr by the user can lead to cache consistency issues. If the user intends to use output_mem-&gt;virt_addr, it is necessary to utilize rknn_mem_sync(ctx, mem, RKNN_MEMORY_SYNC_FROM_DEVICE) to refresh the cache. This flag is typically used when the output data from the NPU is not accessed by the CPU, such as when the output data is accessed by the GPU or RGA.

<!-- source: EN PDF p20; unit 120 -->

RKNN_FLAG_MODEL_BUFFER_ZERO_COPY: It means that the incoming model buffer of the rknn_init interface is the memory allocated by the rknn_create_mem or rknn_create_mem2 interface, and the model buffer does not need to be copied once inside the runtime to reduce the memory occupation of the runtime, but the user needs to ensure that the model memory is valid before the context is destroyed. And free that memory after destroying the context. When you initialize a context, rknn_init the rknn_init_extend parameters of the interface, whose members real_model_offset, real_model_size, model_buffer_fd, and model_buffer_flags rknn_tensor_mem returned based on the rknn_create_mem2 interface.

<!-- source: EN PDF p20; unit 121 -->

RKNN_MEM_FLAG_ALLOC_NO_CONTEXT: When allocating memory using rknn_create_mem2 interfaces, after setting this flag, the ctx parameter is allowed to be 0 or NULL. Thus, the user can obtain the memory allocated by the NPU driver before initializing any of the contexts, and the returned memory structure needs to be released using the rknn_destroy_mem interface, and the released interface can use any context as a parameter. Example code such as:

<!-- source: EN PDF p20; unit 122 -->

```c
 rknn_tensor_mem* model_mem = rknn_create_mem2(ctx, model_size,
RKNN_MEM_FLAG_ALLOC_NO_CONTEXT);
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

<!-- source: EN PDF p20; unit 123 -->

#### rknn_set_core_mask

<!-- source: EN PDF p20; unit 124 -->

This function sets the specific cores running inside the NPU. For now, it only works at the RK3588 and RK3576. It will return the error code if it is set on platform with a single-core NPU architecture.

<!-- source: EN PDF p20,21; unit 125,126 -->

| API | rknn_set_core_mask |
| --- | --- |
| Description | Set the cores for the NPU. |
| Parameters | rknn_context context: The object of rknn context. |
|  | rknn_core_mask core_mask: The specification of NPU core setting. It has the following<br>choices:<br>RKNN_NPU_CORE_AUTO : Referring to automatic mode, meaning that it will select the<br>idle core inside the NPU;<br>RKNN_NPU_CORE_0 : Running on the NPU0 core;<br>RKNN_NPU_CORE_1: Runing on the NPU1 core;<br>RKNN_NPU_CORE_2: Runing on the NPU2 core;<br>RKNN_NPU_CORE_0_1: Running on both NPU0 and NPU1 core simultaneously;<br>RKNN_NPU_CORE_0_1_2: Running on both NPU0, NPU1 and NPU2 simultaneously.<br>RKNN_NPU_CORE_ALL: Running on all of NPU cores depending on the platform; |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p21; unit 127 -->

```c
rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

<!-- source: EN PDF p21; unit 128 -->

For multi-cores mode (when enabling RKNN_NPU_CORE_0_1 and RKNN_NPU_CORE_0_1_2), the following ops have better acceleration : Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu. Prelu, LeakyRelu. Other type of op will fallback to Core0 to continue running. In the future update, some ops like Pool or ConvTranpose will be supported.

<!-- source: EN PDF p21; unit 129 -->

#### rknn_set_batch_core_num

<!-- source: EN PDF p21; unit 130 -->

The rknn_set_batch_core_num function specifies the number of NPU cores of the multi-batch RKNN model (the model exported by setting rknn_batch_size greater than 1 during RKNN-Toolkit2 conversion). This function only supports the RK3588 and RK3576 platform.

<!-- source: EN PDF p21; unit 131 -->

| API | rknn_set_batch_core_num |
| --- | --- |
| Description | Set the number of NPU cores for multi-batch RKNN model running. |
| Parameters | rknn_context context: The object of rknn context. |
|  | int core_num: Specifies the number of cores to run. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p21; unit 132 -->

Sample Code:

<!-- source: EN PDF p21; unit 133 -->

```c
rknn_context ctx;
int ret = rknn_set_batch_core_num(ctx, 2);
```

<!-- source: EN PDF p21; unit 134 -->

#### rknn_dup_context

<!-- source: EN PDF p21; unit 135 -->

The rknn_dup_context creates a new context object referring to the same model. The new context is useful in the condition where the weight of the model need to be reused during executing the same model on the multi-thread (Unavailable for RV1106/RV1103/RV1106B/RV1103B/RK2118) .

<!-- source: EN PDF p22; unit 136 -->

| API | rknn_dup_context |
| --- | --- |
| Description | Creates a new context for the same model, to reuse the weight of the model. |
| Parameters | rknn_context *context_in: The pointer of rknn_context object. After the function is called,<br>the obejct of the input context will be initialized. |
|  | rknn_context *context_out: The pointer of a rknn_context output object where information<br>about this new created object is returned. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p22; unit 137 -->

Sample Code:

<!-- source: EN PDF p22; unit 138 -->

```c
rknn_context ctx_in;
rknn_context ctx_out;
int ret = rknn_dup_context(&ctx_in, &ctx_out);
```

<!-- source: EN PDF p22; unit 139 -->

#### rknn_destroy

<!-- source: EN PDF p22; unit 140 -->

This function is used to release the rknn_context and its related resources.

<!-- source: EN PDF p22; unit 141 -->

| API | rknn_destroy |
| --- | --- |
| Description | Destroy the rknn_context object and its related resources. |
| Parameters | rknn_context context: The rknn_context object that is going to be destroyed. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p22; unit 142 -->

Sample Code:

<!-- source: EN PDF p22; unit 143 -->

```c
rknn_context ctx;
int ret = rknn_destroy(ctx);
```

<!-- source: EN PDF p23; unit 144 -->

#### rknn_query

<!-- source: EN PDF p23; unit 145 -->

The rknn_query function can query the information of models and SDK, including model input and output information, layer-by-layer running time, total model inference time, SDK version, memory usage information, user-defined strings and other information.

<!-- source: EN PDF p23; unit 146 -->

| API | rknn_query |
| --- | --- |
| Description | Query the information about the model and the SDK. |
| Parameters | rknn_context context: The object of rknn_contex. |
|  | rknn_query_cmd : The query command. |
|  | void* info: The structure object that stores the result of the query. |
|  | uint32_t size: The size of the info structure object. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p23; unit 147 -->

Currently, the SDK supports following query commands:

<!-- source: EN PDF p23,24; unit 148,149 -->

| Query command | Return result<br>structure | Function |
| --- | --- | --- |
| RKNN_QUERY_IN_OUT_NUM | rknn_input_output_num | Query the number of input and output Tensors. |
| RKNN_QUERY_INPUT_ATTR | rknn_tensor_attr | Query the input Tensor attribute. |
| RKNN_QUERY_OUTPUT_ATTR | rknn_tensor_attr | Query the output Tensor attribute. |
| RKNN_QUERY_PERF_DETAIL | rknn_perf_detail | Query the running time of each layer of the network. It<br>only works when the flag of<br>RKNN_FLAG_COLLECT_PERF_MASK is set via<br>using the rknn_init. |
| RKNN_QUERY_PERF_RUN | rknn_perf_run | Query the total time of inference (excluding time in<br>setting input/output) in microseconds . |
| RKNN_QUERY_SDK_VERSION | rknn_sdk_version | Query the SDK version. |
| RKNN_QUERY_MEM_SIZE | rknn_mem_size | Query the memory size allocated for the weights and<br>internal tensors in the network. |
| RKNN_QUERY_CUSTOM_STRING | rknn_custom_string | Query the user-defined strings in the RKNN model. |
| RKNN_QUERY_NATIVE_INPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the<br>native input Tensor attribute, which is the model input<br>attribute directly read by the NPU. |
| RKNN_QUERY_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, query the native<br>output Tensor attribute, which is the model output<br>attribute directly from the NPU. |
| RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the<br>native input Tensor attribute, which is the model input<br>attribute directly read by the NPU.it is same with<br>RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the<br>native output Tensor attribute, which is the model input<br>attribute directly read by the NPU.it is same with<br>RKNN_QUERY_NATIVE_OUTPUT_ATTR. |
| RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the<br>native input Tensor attribute, which is the model input<br>attribute directly read by the NPU.it is same with<br>RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the<br>native output NHWC Tensor attribute, which is the<br>model input attribute directly read by the NPU. |
| RKNN_QUERY_DEVICE_MEM_INFO | rknn_tensor_mem | Query the memory properties of the model buffer. |
| RKNN_QUERY_INPUT_DYNAMIC_RANGE | rknn_input_range | When using the RKNN model that supports dynamic<br>shapes, query the model to support input information<br>such as the number of shapes, list, data layout and name<br>corresponding to the shape. |
| RKNN_QUERY_CURRENT_INPUT_ATTR | rknn_tensor_attr | When using the RKNN model that supports dynamic<br>shapes, query the input attributes used by the model for<br>current inference. |
| RKNN_QUERY_CURRENT_OUTPUT_ATTR | rknn_tensor_attr | When using the RKNN model that supports dynamic<br>shapes, query the output attributes used by the model for<br>current inference. |
| RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | rknn_tensor_attr | When using the RKNN model that supports dynamic<br>shapes, query the NPU native input attributes used by the<br>model's current inference. |
| RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | When using the RKNN model that supports dynamic<br>shapes, query the NPU native output attributes used by<br>the model's current inference. |

<!-- source: EN PDF p24; unit 150 -->

Next we will explain each query command in detail.

<!-- source: EN PDF p24; unit 151 -->

##### 1. Query the SDK version

<!-- source: EN PDF p24; unit 152 -->

The RKNN_QUERY_SDK_VERSION command can be used to query the version information of the RKNN SDK. You need to create the rknn_sdk_version structure object first.

<!-- source: EN PDF p24; unit 153 -->

Sample Code:

<!-- source: EN PDF p24; unit 154 -->

```c
rknn_sdk_version version;
ret = rknn_query(ctx, RKNN_QUERY_SDK_VERSION, &version,
         sizeof(rknn_sdk_version));
printf("sdk api version: %s\n", version.api_version);
printf("driver version: %s\n", version.drv_version);
```

<!-- source: EN PDF p24; unit 155 -->

##### 2. Query the number of input and output Tensor

<!-- source: EN PDF p24; unit 156 -->

The RKNN_QUERY_IN_OUT_NUM command can be used to query the number of model input and output Tensor. You need to create the rknn_input_output_num structure object first.

<!-- source: EN PDF p24; unit 157 -->

Sample Code:

<!-- source: EN PDF p24; unit 158 -->

```c
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num, sizeof(io_num));
printf("model input num: %d, output num: %d\n", io_num.n_input, io_num.n_output);
```

<!-- source: EN PDF p24; unit 159 -->

##### 3. Query input Tensor attribute (for general API interface)

<!-- source: EN PDF p25; unit 160 -->

The RKNN_QUERY_INPUT_ATTR command can be used to query the attribute of the model input Tensor. You need to create the rknn_tensor_attr structure object first (Note: the tensor queried by

<!-- source: EN PDF p25; unit 161 -->

RV1106/RV1103/RV1106B/RV1103B/RK2118 is the tensor originally entered as native) .

<!-- source: EN PDF p25; unit 162 -->

Sample Code:

<!-- source: EN PDF p25; unit 163 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p25; unit 164 -->

##### 4. Query output Tensor attribute (for general API interface)

<!-- source: EN PDF p25; unit 165 -->

The RKNN_QUERY_OUTPUT_ATTR command can be used to query the attribute of the model output Tensor. You need to create the rknn_tensor_attr structure object first.

<!-- source: EN PDF p25; unit 166 -->

Sample Code:

<!-- source: EN PDF p25; unit 167 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR, &(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p25; unit 168 -->

##### 5. Query layer-by-layer inference time of model

<!-- source: EN PDF p25; unit 169 -->

After the rknn_run interface is called, the RKNN_QUERY_PERF_DETAIL command can be used to query the layer-by-layer inference time in microseconds. The premise of using this command is that the flag parameter of the rknn_init interface needs to include the RKNN_FLAG_COLLECT_PERF_MASK flag.

<!-- source: EN PDF p25; unit 170 -->

Sample Code:

<!-- source: EN PDF p25; unit 171 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_COLLECT_PERF_MASK, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_detail perf_detail;
ret = rknn_query(ctx, RKNN_QUERY_PERF_DETAIL, &perf_detail, sizeof(perf_detail));
```

<!-- source: EN PDF p25; unit 172 -->

##### 6. Query total inference time of model

<!-- source: EN PDF p25; unit 173 -->

After the rknn_run interface is called, the RKNN_QUERY_PERF_RUN command can be used to query the inference time of the model (not including setting input/output) in microseconds.

<!-- source: EN PDF p25; unit 174 -->

Sample Code:

<!-- source: EN PDF p25; unit 175 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_run perf_run;
ret = rknn_query(ctx, RKNN_QUERY_PERF_RUN, &perf_run, sizeof(perf_run));
```

<!-- source: EN PDF p26; unit 176 -->

##### 7. Query the memory allocation of the model

<!-- source: EN PDF p26; unit 177 -->

After the rknn_init interface is called, when the user needs to allocate memory for network by themself, the RKNN_QUERY_MEM_SIZE command can be used to query the weights of the model and the internal memory (excluding input and output) in the network. The requirement of using this command is that the flag parameter of the rknn_init interface needs to enable the RKNN_FLAG_MEM_ALLOC_OUTSIDE flag.

<!-- source: EN PDF p26; unit 178 -->

Sample Code:

<!-- source: EN PDF p26; unit 179 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_MEM_ALLOC_OUTSIDE , NULL);
rknn_mem_size mem_size;
ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size, sizeof(mem_size));
```

<!-- source: EN PDF p26; unit 180 -->

##### 8. Query User-defined string in the model

<!-- source: EN PDF p26; unit 181 -->

After the rknn_init interface is called, if the user has added custom strings when generating the RKNN model, the RKNN_QUERY_CUSTOM_STRING command can be used to retrieve user-defined strings. For example, when converting the RKNN model, the user fills in the custom characters of "RGB" to identify that the RKNN model input is a three-channel image in RGB format instead of a three-channel image in BGR format. At runtime, the data is converted into an RGB image based on the queried "RGB" information.

<!-- source: EN PDF p26; unit 182 -->

Sample Code:

<!-- source: EN PDF p26; unit 183 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
rknn_custom_string custom_string;
ret = rknn_query(ctx, RKNN_QUERY_CUSTOM_STRING, &custom_string, sizeof(custom_string));
```

<!-- source: EN PDF p26; unit 184 -->

##### 9. Query native input tensor attribute (for zero-copy API interface)

<!-- source: EN PDF p26; unit 185 -->

The RKNN_QUERY_NATIVE_INPUT_ATTR command(the same to RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR) can be used to query the native attribute of the model input Tensor. User need to create the rknn_tensor_attr structure object first.

<!-- source: EN PDF p26; unit 186 -->

Sample Code:

<!-- source: EN PDF p26; unit 187 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p26; unit 188 -->

##### 10. Query native output tensor attribute (for zero-copy API interface)

<!-- source: EN PDF p26; unit 189 -->

The RKNN_QUERY_NATIVE_OUTPUT_ATTR command(the same to RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR) can be used to query the native attribute of the model output Tensor. User need to create the rknn_tensor_attr structure object first.

<!-- source: EN PDF p26; unit 190 -->

Sample Code:

<!-- source: EN PDF p27; unit 191 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p27; unit 192 -->

##### 11. Query native output tensor attribute (for zero-copy API interface)

<!-- source: EN PDF p27; unit 193 -->

The RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR command can be used to query the NHWC attribute of the model input Tensor. User need to create the rknn_tensor_attr structure object first.

<!-- source: EN PDF p27; unit 194 -->

Sample Code:

<!-- source: EN PDF p27; unit 195 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR,
&(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p27; unit 196 -->

##### 12. Query native output tensor attribute (for zero-copy API interface)

<!-- source: EN PDF p27; unit 197 -->

The RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR command can be used to query the NHWC attribute of the model output Tensor. User need to create the rknn_tensor_attr structure object first.

<!-- source: EN PDF p27; unit 198 -->

Sample Code:

<!-- source: EN PDF p27; unit 199 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p27,27; unit 200,201 -->

##### 13. Query the dynamic input shape information supported by the RKNN model (Note: RV1106/RV1103/RV1106B/RV1103B/RK2118 does not support this interface)

<!-- source: EN PDF p27; unit 202 -->

After the rknn_init interface is called, pass in the RKNN_QUERY_INPUT_DYNAMIC_RANGE command to query the input shape information supported by the model, including the number of input shapes, the list of input shapes, the layout and name of the input shapes, and other information. The rknn_input_range structure object needs to be created first.

<!-- source: EN PDF p27; unit 203 -->

The sample code is as follows:

<!-- source: EN PDF p27; unit 204 -->

```c
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input * sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++) {
  dyn_range[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE, &dyn_range[i],
sizeof(rknn_input_range));
}
```

<!-- source: EN PDF p28,28; unit 205,206 -->

##### 14. Query the memory information of model buffer(Note: RV1106/RV1103/RV1106B/RV1103B/RK2118 does not support this interface)

<!-- source: EN PDF p28; unit 207 -->

After the rknn_init interface is called, the RKNN_QUERY_DEVICE_MEM_INFO command can query the attributes of the model buffer created inside the runtime, including fd and physical address.

<!-- source: EN PDF p28; unit 208 -->

```c
rknn_tensor_mem mem_info;
memset(&mem_info, 0, sizeof(mem_info));
ret = rknn_query(ctx, RKNN_QUERY_DEVICE_MEM_INFO, &mem_info, sizeof(mem_info));
```

<!-- source: EN PDF p28; unit 209 -->

##### 15. Query the input dynamic shape currently used by the RKNN model

<!-- source: EN PDF p28; unit 210 -->

After the rknn_set_input_shapes interface is called, pass in the RKNN_QUERY_CURRENT_INPUT_ATTR command to query the input attribute information currently used by the model. The rknn_tensor_attr structure needs to be created first (Note:

<!-- source: EN PDF p28; unit 211 -->

RV1106/RV1103/RV1103B/RV1106B/RK2118 does not support this command).

<!-- source: EN PDF p28; unit 212 -->

The sample code is as follows:

<!-- source: EN PDF p28; unit 213 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
  cur_input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR, &(cur_input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p28; unit 214 -->

##### 16. Query the output dynamic shape currently used by the RKNN model

<!-- source: EN PDF p28; unit 215 -->

After the rknn_set_input_shapes interface is called, pass in the RKNN_QUERY_CURRENT_OUTPUT_ATTR command to query the output attribute information currently used by the model. The rknn_tensor_attr structure needs to be created first (Note:

<!-- source: EN PDF p28; unit 216 -->

RV1106/RV1103/RV1103B/RV1106B/RK2118 does not support this command).

<!-- source: EN PDF p28; unit 217 -->

The sample code is as follows:

<!-- source: EN PDF p28; unit 218 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
  cur_output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p28; unit 219 -->

##### 17. Query the native input dynamic shape currently used by the RKNN model

<!-- source: EN PDF p28; unit 220 -->

After the rknn_set_input_shapes interface is called, pass in the RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR command to query the native input attribute information currently used by the model. The rknn_tensor_attr structure needs to be created first (Note:

<!-- source: EN PDF p28; unit 221 -->

RV1106/RV1103/RV1103B/RV1106B/RK2118 does not support this command).

<!-- source: EN PDF p28; unit 222 -->

The sample code is as follows:

<!-- source: EN PDF p29; unit 223 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
  cur_input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p29; unit 224 -->

##### 18. Query the native output dynamic shape currently used by the RKNN model

<!-- source: EN PDF p29; unit 225 -->

After the rknn_set_input_shapes interface is called, pass in the RKNN_QUERY_CURRENT_OUTPUT_ATTR command to query the native output attribute information currently used by the model. The rknn_tensor_attr structure needs to be created first (Note:

<!-- source: EN PDF p29; unit 226 -->

RV1106/RV1103/RV1103B/RV1106B/RK2118 does not support this command).

<!-- source: EN PDF p29; unit 227 -->

The sample code is as follows:

<!-- source: EN PDF p29; unit 228 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
  cur_output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p30; unit 229 -->

#### rknn_inputs_set

<!-- source: EN PDF p30; unit 230 -->

The input data of the model can be set by the rknn_inputs_set function. This function can support multiple inputs, each of which is a rknn_input structure object. The user needs to set these object field before passing in rknn_inputs_set function (Note: unavailable on RV1106/RV1103/RV1103B/RV1106B/RK2118).

<!-- source: EN PDF p30; unit 231 -->

| API | rknn_inputs_set |
| --- | --- |
| Description | Set the model input data. |
| Parameter | rknn_context context: The object of rknn_contex. |
|  | uint32_t n_inputs: Number of inputs. |
|  | rknn_input inputs[]: Array of rknn_input. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p30; unit 232 -->

Sample Code:

<!-- source: EN PDF p30; unit 233 -->

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

<!-- source: EN PDF p30; unit 234 -->

#### rknn_run

<!-- source: EN PDF p30; unit 235 -->

The rknn_run function will perform a model inference. The input data need to be configured by the rknn_inputs_set function or zero-copy interface before rknn_run is called.

<!-- source: EN PDF p30; unit 236 -->

| API | rknn_run |
| --- | --- |
| Description | Perform a model inference. |
| Parameter | rknn_context context: The object of rknn_contex. |
|  | rknn_run_extend* extend: Reserved for extension. It is not used currently and accepted<br>NULL only. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p30; unit 237 -->

Sample Code:

<!-- source: EN PDF p30; unit 238 -->

```c
ret = rknn_run(ctx, NULL);
```

<!-- source: EN PDF p31; unit 239 -->

#### rknn_outputs_get

<!-- source: EN PDF p31; unit 240 -->

The rknn_outputs_get function can get the output data from the model. This function can get multiple output data, each of which is a rknn_output structure object that needs to be created and initialized in turn before the function is called (Note: RV1106/RV1103/RV1106B/RV1103B/RK2118 unsupported) .

<!-- source: EN PDF p31; unit 241 -->

There are two ways to store buffers for output data:

<!-- source: EN PDF p31; unit 242 -->

1\. The user allocate and release buffers themselves. In this case, the rknn_output.is_prealloc needs to be set to 1, and the rknn_output.buf points to users’ allocated buffer.

<!-- source: EN PDF p31; unit 243 -->

2\. The other is allocated by rknn. At this time, the rknn_output .is_prealloc needs to be set to 0. After the function is executed, rknn_output.buf will be created and store the output data.

<!-- source: EN PDF p31; unit 244 -->

| API | rknn_outputs_get |
| --- | --- |
| Description | Get model inference output data. |
| Parameter | rknn_context context: The object of rknn_context. |
|  | uint32_t n_outputs: Number of output. |
|  | rknn_output outputs[]: Array of rknn_output. |
|  | rknn_run_extend* extend: Reserved for extension, currently not used yet. Accepting NULL<br>only. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p31; unit 245 -->

Sample Code:

<!-- source: EN PDF p31; unit 246 -->

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

<!-- source: EN PDF p31; unit 247 -->

#### rknn_outputs_release

<!-- source: EN PDF p31; unit 248 -->

The rknn_outputs_release function will release the relevant resources of the rknn_output object.

<!-- source: EN PDF p31; unit 249 -->

| API | rknn_outputs_release |
| --- | --- |
| Description | Release the rknn_output object. |
| Parameter | rknn_context context: rknn_context object. |
|  | uint32_t n_outputs: Number of output. |
|  | rknn_output outputs[]: The array of rknn_output to be released. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p31; unit 250 -->

Sample Code:

<!-- source: EN PDF p32; unit 251 -->

```c
ret = rknn_outputs_release(ctx, io_num.n_output, outputs);
```

<!-- source: EN PDF p32; unit 252 -->

#### rknn_create_mem_from_phys

<!-- source: EN PDF p32; unit 253 -->

When the user wants to allocate memory for NPU, the rknn_create_mem_from_phys function can create a rknn_tensor_mem structure and return its pointer. This function will pass the physical address, virtual address and size, and the information related to the external memory to the rknn_tensor_mem structure.

<!-- source: EN PDF p32; unit 254 -->

| API | rknn_create_mem_from_phys |
| --- | --- |
| Description | Create rknn_tensor_mem structure and allocate memory through physical address. |
| Parameter | rknn_context context: rknn_context object. |
|  | uint64_t phys_addr: The physical address of buffer. |
|  | void *virt_addr: The virtual address of buffer, it is the start address of the memory<br>corresponding to fd. |
|  | uint32_t size: The size of buffer. |
| Return | rknn_tensor_mem*: The tensor memory information structure pointer. |

<!-- source: EN PDF p32; unit 255 -->

Sample Code:

<!-- source: EN PDF p32; unit 256 -->

```c
//suppose we have got buffer information as input_phys, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_phys(ctx, input_phys, input_virt, size);
```

<!-- source: EN PDF p33; unit 257 -->

#### rknn_create_mem_from_fd

<!-- source: EN PDF p33; unit 258 -->

When the user wants to allocate the memory for NPU, the rknn_create_mem_from_fd creates a rknn_tensor_mem structure and return its pointer. This function filled with the file descriptor, logical address and size, and the information related to the external memory will be assigned to the rknn_tensor_mem structure.

<!-- source: EN PDF p33; unit 259 -->

| API | rknn_create_mem_from_fd |
| --- | --- |
| Description<br>Parameter | Create rknn_tensor_mem structure and allocate memory through file descriptor. |
|  | rknn_context context: rknn_context object. |
|  | int32_t fd: The file descriptor of buffer. |
|  | void *virt_addr: The virtual address of buffer, which indicates the beginning of<br>fd. |
|  | uint32_t size: The size of buffer. |
|  | int32_t offset: The offset corresponding for file descriptor and virtual address. |
| Return | rknn_tensor_mem*: The tensor memory information structure pointer. |

<!-- source: EN PDF p33; unit 260 -->

Sample Code:

<!-- source: EN PDF p33; unit 261 -->

```c
//suppose we have got buffer information as input_fd, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_fd(ctx, input_fd, input_virt, size, 0);
```

<!-- source: EN PDF p33; unit 262 -->

#### rknn_create_mem

<!-- source: EN PDF p33; unit 263 -->

When the user wants to allocate memory which can be used directly in the NPU, the rknn_create_mem function can allocate the memory size specified by the user and return a rknn_tensor_mem structure.

<!-- source: EN PDF p33; unit 264 -->

| API | rknn_create_mem |
| --- | --- |
| Description | Create rknn_tensor_mem structure internally and allocate memory during runtime. |
| Parameter | rknn_context context: rknn_context object. |
|  | uint32_t size: The size of buffer. |
| Return | rknn_tensor_mem*: The tensor memory information structure pointer. |

<!-- source: EN PDF p33; unit 265 -->

Sample Code:

<!-- source: EN PDF p33; unit 266 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem(ctx, size);
```

<!-- source: EN PDF p34; unit 267 -->

#### rknn_create_mem2

<!-- source: EN PDF p34; unit 268 -->

When the user wants to allocate memory which can be used directly in the NPU, the rknn_create_mem2 function can allocate the memory size and memory type specified by the user and return a rknn_tensor_mem structure.

<!-- source: EN PDF p34; unit 269 -->

| API | rknn_create_mem2 |
| --- | --- |
| Description | Create rknn_tensor_mem structure internally and allocate memory during runtime. |
| Parameter | rknn_context context: rknn_context object. |
|  | uint64_t size: The size of buffer. |
|  | uint64_t alloc_flags: Controls whether the allocated memory is cacheable.<br>RKNN_FLAG_MEMORY_CACHEABLE：Create cacheable memory.<br>RKNN_FLAG_MEMORY_NON_CACHEABLE: Create non-cacheable memory.<br>RKNN_FLAG_MEMORY_FLAGS_DEFAULT：same with<br>RKNN_FLAG_MEMORY_CACHEABLE |
| Return | rknn_tensor_mem*: The tensor memory information structure pointer. |

<!-- source: EN PDF p34; unit 270 -->

The main difference between rknn_create_mem2 and rknn_create_mem is that rknn_create_mem2 brings an alloc_flags, which can specify whether the allocated memory is cacheable, while rknn_create_mem cannot be specified, and the default is cacheable.

<!-- source: EN PDF p34; unit 271 -->

Sample Code:

<!-- source: EN PDF p34; unit 272 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem2(ctx, size, RKNN_FLAG_MEMORY_NON_CACHEABLE);
```

<!-- source: EN PDF p34; unit 273 -->

#### rknn_destroy_mem

<!-- source: EN PDF p34; unit 274 -->

The rknn_destroy_mem function destroys the rknn_tensor_mem structure. However, the memory allocated by the user needs to be released manually.

<!-- source: EN PDF p34; unit 275 -->

| API | rknn_destroy_mem |
| --- | --- |
| Description | Destroy rknn_tensor_mem structure. |
| Parameter | rknn_context context: rknn_context object. |
|  | rknn_tensor_mem*: The tensor memory information structure pointer. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p34; unit 276 -->

Sample Code:

<!-- source: EN PDF p34; unit 277 -->

```c
rknn_tensor_mem* input_mems [1];
int ret = rknn_destroy_mem(ctx, input_mems[0]);
```

<!-- source: EN PDF p35; unit 278 -->

#### rknn_set_weight_mem

<!-- source: EN PDF p35; unit 279 -->

If the user has allocated memory for the network weights, after initializing the corresponding rknn_tensor_mem structure, the NPU can use the memory through the rknn_set_weight_mem function. This function must be called before calling rknn_run.

<!-- source: EN PDF p35; unit 280 -->

| API | rknn_set_weight_mem |
| --- | --- |
| Description | Set up the rknn_tensor_mem structure containing weights memory information. |
| Parameter | rknn_context context: rknn_context object. |
|  | rknn_tensor_mem*: The tensor memory information structure pointer. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p35; unit 281 -->

Sample Code:

<!-- source: EN PDF p35; unit 282 -->

```c
rknn_tensor_mem* weight_mems [1];
int ret = rknn_set_weight_mem(ctx, weight_mems[0]);
```

<!-- source: EN PDF p35; unit 283 -->

#### rknn_set_internal_mem

<!-- source: EN PDF p35; unit 284 -->

If the user has allocated memory for the internal tensor in network, after initializing the corresponding rknn_tensor_mem structure, the NPU can use the memory through the rknn_set_internal_mem function. This function must be called before calling rknn_run.

<!-- source: EN PDF p35; unit 285 -->

| API | rknn_set_internal_mem |
| --- | --- |
| Description | Set up the rknn_tensor_mem structure containing internal tensor memory information in<br>network. |
| Parameter | rknn_context context: rknn_context object. |
|  | rknn_tensor_mem*: The pointer to the tensor memory information structure. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p35; unit 286 -->

Sample Code:

<!-- source: EN PDF p35; unit 287 -->

```c
rknn_tensor_mem* internal_tensor_mems [1];
int ret = rknn_set_internal_mem(ctx, internal_tensor_mems[0]);
```

<!-- source: EN PDF p35; unit 288 -->

#### rknn_set_io_mem

<!-- source: EN PDF p35; unit 289 -->

If the user has allocated memory for the input/output tensor in network, after initializing the corresponding rknn_tensor_mem structure, the NPU can use the memory through the rknn_set_io_mem function. This function must be called before calling rknn_run.

<!-- source: EN PDF p35,36; unit 290,291 -->

| API | rknn_set_io_mem |
| --- | --- |
| Description | Set up the rknn_tensor_mem structure containing input/output tensor memory information<br>in network. |
| Parameter | rknn_context context: rknn_context object. |
|  | rknn_tensor_mem*: The pointer to the tensor memory information structure . |
|  | rknn_tensor_attr *: The attribute of input or output tensor buffer. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p36; unit 292 -->

Sample Code:

<!-- source: EN PDF p36; unit 293 -->

```c
rknn_tensor_attr output_attrs[1];
rknn_tensor_mem* output_mems[1];
ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR, &(output_attrs[0]), sizeof(rknn_tensor_attr));
output_mems[0] = rknn_create_mem(ctx, output_attrs[0].size_with_stride);
rknn_set_io_mem(ctx, output_mems[0], &output_attrs[0]);
```

<!-- source: EN PDF p36; unit 294 -->

#### rknn_set_input_shape（deprecated）

<!-- source: EN PDF p36; unit 295 -->

This interface has been deprecated. Please use the rknn_set_input_shapes interface to bind input shapes. The current version is unavailable. If you want to continue using this interface, please use version 1.5.0 SDK and refer to the usage guide document of version 1.5.0.

<!-- source: EN PDF p37; unit 296 -->

#### rknn_set_input_shapes

<!-- source: EN PDF p37; unit 297 -->

For dynamic shape input RKNN models, the currently used input shape must be specified before inference. The interface passes in the number of inputs and the rknn_tensor_attr array, which contains each input shape and corresponding data layout information. The index, name, shape (dims) and memory layout information (fmt) of each rknn_tensor_attr structure object must be filled. Other members of the rknn_tensor_attr structure do not need to be set. Before using this interface, you can use the rknn_query function to query the number of input shapes and the list of dynamic shapes supported by the RKNN model, and the shape of the input data is required to be in the list of input shapes supported by the model. When running for the first time or switching a new input shape every time, you need to call this interface to set a new shape, otherwise, you don’t need to call this interface repeatedly.

<!-- source: EN PDF p37; unit 298 -->

| API | rknn_set_input_shapes |
| --- | --- |
| Description | Set the input shape currently used by the model. |
| Parameter | rknn_context context: rknn_context object. |
|  | uint32_t n_inputs: The number of input tensors。 |
|  | rknn_tensor_attr *: The attribute array pointer of tensor to pass all the input shape<br>information. The user needs to set the index, name, dims, fmt, and n_dims members of each<br>input attribute structure, and other members do not need to be set. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p37; unit 299 -->

Sample Code:

<!-- source: EN PDF p37; unit 300 -->

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

<!-- source: EN PDF p38; unit 301 -->

#### rknn_mem_sync

<!-- source: EN PDF p38; unit 302 -->

The memory created by the rknn_create_mem function has the cacheable flag by default. For the memory created with the cacheable flag, when it is used by the CPU and NPU at the same time, the cache behavior will cause data consistency problems. This interface is used to synchronize a memory created with the cacheable flag to ensure that the data accessed by the CPU and NPU in this memory is consistent.

<!-- source: EN PDF p38; unit 303 -->

| API | rknn_mem_sync |
| --- | --- |
| Description | Synchronize CPU cache and DDR data. |
| Parameter | rknn_context context: rknn_context object. |
|  | rknn_tensor_mem* mem: tensor memory information structure pointer. |
|  | rknn_mem_sync_mode mode: Indicates the mode for refreshing CPU cache and DDR data.<br>RKNN_MEMORY_SYNC_TO_DEVICE: Indicates that the CPU cache data is<br>synchronized to the DDR. This mode is usually used to write the data in the cache back to<br>the DDR before the NPU accesses the same memory after the CPU writes to the memory.<br>RKNN_MEMORY_SYNC_FROM_DEVICE: Indicates that DDR data is synchronized<br>to the CPU cache. It is usually used after the NPU writes to the memory. Use this mode to<br>make the cache data invalid the next time the CPU accesses the same memory, and the CPU<br>re-reads the data from the DDR.<br>RKNN_MEMORY_SYNC_BIDIRECTIONAL: Indicates that the CPU cache data is<br>synchronized to the DDR and the CPU re-reads the data from the DDR. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p38; unit 304 -->

Sample Code:

<!-- source: EN PDF p38; unit 305 -->

```c
ret =rknn_mem_sync(ctx, &outputs[0].mem,
RKNN_MEMORY_SYNC_FROM_DEVICE);
if (ret < 0) {
  fprintf(stderr, " rknn_mem_sync error! ret=%d\n", ret);
  return -1;
}
```

<!-- source: EN PDF p39; unit 306 -->

### 4.4 Definition of Matrix Multiplication Data Structure

<!-- source: EN PDF p39; unit 307 -->

#### rknn_matmul_info

<!-- source: EN PDF p39; unit 308 -->

rknn_matmul_info indicates the specification information for performing matrix multiplication, which includes the size of matrix multiplication, data type and memory arrangement of input and output matrices. The definition of the structure is shown in the following table:

<!-- source: EN PDF p39,40; unit 309,310 -->

| Field | Type | Meaning |
| --- | --- | --- |
| M | int32_t | The number of rows of the A matrix. |
| K | int32_t | The number of columns of the A matrix. |
| N | int32_t | The number of columns of the B matrix. |
| type | rknn_matmul_type | Data type of input and output matrices:<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32: Indicates<br>that matrices A and B are of type float16, and matrix C is of type<br>float;<br>RKNN_INT8_MM_INT8_TO_INT32: Indicates that matrices A<br>and B are of type int8, and matrix C is of type int32;<br>RKNN_INT8_MM_INT8_TO_INT8: Indicates that matrices A<br>and B are of type int8, and matrix C is of type int8;<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT16：:<br>Indicates that matrices A and B are of type float16, and matrix C<br>is of type float16;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT32: Indicates that<br>matrix A is of type float16, matrix B is type int8, and matrix C is<br>type float;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT16: Indicates that<br>matrix A is of type float16, matrix B is type int8, and matrix C is<br>type float16;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT32: Indicates that<br>matrix A is of type float16, matrix B is type int4, and matrix C is<br>type float;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT16: Indicates that<br>matrix A is of type float16, matrix B is type int4, and matrix C is<br>type float16;<br>RKNN_INT8_MM_INT8_TO_FLOAT32: Indicates that<br>matrices A and B are of type int8, and matrix C is of type float;<br>RKNN_INT4_MM_INT4_TO_INT16: Indicates that matrices A<br>and B are of type int4, and matrix C is of type int16;<br>RKNN_INT8_MM_INT4_TO_INT32: Indicates that matrix A<br>is of type int8, matrix B is type int4, and matrix C is type int32; |
| B_layout | int16_t | The memory layout of the B matrix. 0: Indicates [K,N] shape<br>arrangement.<br>RKNN_MM_LAYOUT_NORM: Indicates that matrix B is<br>arranged according to the original shape, i.e. the shape of KxN;<br>RKNN_MM_LAYOUT_NATIVE: Indicates that matrix B is<br>arranged in a high-performance shape<br>RKNN_MM_LAYOUT_TP_NORM: Matrix B is arranged<br>according to the shape after Transpose, i.e., the shape row of NxK |
| B_quant_type | int16_t | Specifies the type of quantization method for matrix B.<br>RKNN_QUANT_TYPE_PER_LAYER_SYM: Matrix B is<br>symmetrically quantized according to the Per-Layer method;<br>RKNN_QUANT_TYPE_PER_LAYER_ASYM: Matrix B is<br>asymmetrically quantized according to the Per-Layer method;<br>RKNN_QUANT_TYPE_PER_CHANNEL_SYM: Matrix B is<br>symmetrically quantized according to the Per-Channel method ;<br>RKNN_QUANT_TYPE_PER_CHANNEL_ASYM: indicates<br>that matrix B is asymmetrically quantized in the Per-Channel<br>mode;<br>RKNN_QUANT_TYPE_PER_GROUP_SYM: indicates that<br>matrix B is symmetrically quantized in the Per-Group mode;<br>RKNN_QUANT_TYPE_PER_GROUP_ASYM: Matrix B is<br>asymmetrically quantified according to the Per-Group method |
| AC_layout | int16_t | Specifies how the data is arranged for Matrix A and Matrix C.<br>RKNN_MM_LAYOUT_NORM: Indicates that matrices A and<br>C are arranged in their original shapes;<br>RKNN_MM_LAYOUT_NATIVE: Represents matrices A and C<br>arranged in high-performance shapes |
| AC_quant_type | int16_t | Specifies the quantization type of matrices A and C.<br>RKNN_QUANT_TYPE_PER_LAYER_SYM: Represents the<br>symmetrical quantization of matrices A and C in a Per-Layer<br>method;<br>RKNN_QUANT_TYPE_PER_LAYER_ASYM: Represents the<br>asymmetric quantization of matrices A and C in the Per-Layer<br>method |
| iommu_domain_id | int32_t | The index of the IOMMU address space domain where the matrix<br>context resides. The IOMMU address space corresponds to the<br>context one-to-one, and the size of each IOMMU address space is<br>4 GB. This parameter is mainly used when the parameters of<br>matrices A, B, and C are large and need to be switched to another<br>domain after the NPU allocated more than 4 GB of memory in<br>one domain. |
| group_size | int16_t | The number of elements in a group takes effect only when group<br>quantization is enabled. |
| reserved | int8_t[] | Reservation field. |

<!-- source: EN PDF p41; unit 311 -->

#### rknn_matmul_tensor_attr

<!-- source: EN PDF p41; unit 312 -->

rknn_matmul_tensor_attr represents the attribute of each matrix tensor, which includes the name, shape, size and data type of the matrix. The definition of the structure is shown in the following table:

<!-- source: EN PDF p41; unit 313 -->

| Field | Type | Meaning |
| --- | --- | --- |
| name | char[] | The name of the matrix. |
| n_dims | uint32_t | The number of dimensions of the matrix. |
| dims | uint32_t[] | The shape of the matrix. |
| size | uint32_t | the size of the matrix. |
| type | rknn_tensor_type | The data type of matrix |

<!-- source: EN PDF p41; unit 314 -->

#### rknn_matmul_io_attr

<!-- source: EN PDF p41; unit 315 -->

rknn_matmul_io_attr represents the attributes of all input and output tensors of the matrix, which includes the attributes of matrices A, B, and C. The definition of the structure is shown in the following table:

<!-- source: EN PDF p41; unit 316 -->

| Field | Type | Meaning |
| --- | --- | --- |
| A | rknn_matmul_tensor_attr | The tensor attribute of matrix A. |
| B | rknn_matmul_tensor_attr | The tensor attribute of matrix B. |
| C | rknn_matmul_tensor_attr | The tensor attribute of matrix C. |

<!-- source: EN PDF p41; unit 317 -->

#### rknn_quant_params

<!-- source: EN PDF p41; unit 318 -->

rknn_quant_params represents the quantization parameters of the matrix, including name and the pointers and lengths of the scale and zero_point arrays. name is used to identify the name of the matrix, which can be obtained from the rknn_matmul_io_attr structure obtained when initializing the matrix context. The structure definition is shown in the following table:

<!-- source: EN PDF p41; unit 319 -->

| Field | Type | Meaning |
| --- | --- | --- |
| name | char[] | The name of the matrix. |
| scale | float* | The scale array pointer of matrix. |
| scale_len | int32_t | The scale array length of the matrix |
| zp | int32_t* | The zero_point array pointer of matrix |
| zp_len | int32_t | The zero_point array length of matrix |

<!-- source: EN PDF p41; unit 320 -->

#### rknn_matmul_shape

<!-- source: EN PDF p41; unit 321 -->

rknn_matmul_shape represents the M, K and N of matrix multiplication of a specific shape. When initializing the matrix multiplication context of a dynamic shape, you need to provide the number of shapes and use the rknn_matmul_shape structure array to represent all input shapes. The structure definition is shown in the following table:

<!-- source: EN PDF p42; unit 322 -->

| Field | Type | Meaning |
| --- | --- | --- |
| M | int32_t | The number of rows of the A matrix. |
| K | int32_t | The number of columns of matrix A. |
| N | int32_t | The number of columns of matrix C. |

<!-- source: EN PDF p43; unit 323 -->

### 4.5 Description of Matrix Multiplication API

<!-- source: EN PDF p43; unit 324 -->

#### rknn_matmul_create

<!-- source: EN PDF p43; unit 325 -->

The function of this function is to complete the initialization of the matrix multiplication context based on the incoming matrix multiplication specification and other information, and return the shape, size, data type and other information of the input and output tensor. Here, the rknn_matmul_ctx pointer and rknn_context are the same data structure.

<!-- source: EN PDF p43; unit 326 -->

| API | rknn_matmul_create |
| --- | --- |
| Description | Initializes the matrix multiplication context. |
| Parameters | rknn_matmul_ctx* ctx: Matrix multiplication context pointer. |
|  | rknn_matmul_info* info: Pointer to the specification information structure of matrix<br>multiplication. |
|  | rknn_matmul_io_attr* io_attr: Pointer to the matrix multiplication input and output tensor<br>attribute structure. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p43; unit 327 -->

Sample Code:

<!-- source: EN PDF p43; unit 328 -->

```c
rknn_matmul_info info;
memset(&info, 0, sizeof(rknn_matmul_info));
info.M = 4;
info.K = 64;
info.N = 32;
info.type = RKNN_INT8_MM_INT8_TO_INT32;
info.B_layout = RKNN_MM_LAYOUT_NORM;
info.AC_layout = RKNN_MM_LAYOUT_NORM;

rknn_matmul_io_attr io_attr;
memset(&io_attr, 0, sizeof(rknn_matmul_io_attr));

int ret = rknn_matmul_create(&ctx, &info, &io_attr);
if (ret < 0) {
  printf("rknn_matmul_create fail! ret=%d\n", ret);
  return -1;
}
```

<!-- source: EN PDF p43; unit 329 -->

#### rknn_matmul_set_io_mem

<!-- source: EN PDF p43; unit 330 -->

This function is used to set the input/output memory for the matrix multiplication operation. Before calling this function, first use the rknn_tensor_mem structure pointer created by the rknn_create_mem interface, and then pass it into the function with the rknn_matmul_tensor_attr structure pointer of the matrix A, B or C returned by the rknn_matmul_create function, and set the input and output memory to the matrix multiplication in context. Before calling this function, the data of matrix A and matrix B should be prepared according to the memory arrangement configured in rknn_matmul_info.

<!-- source: EN PDF p44; unit 331 -->

| API | rknn_matmul_set_io_mem |
| --- | --- |
| Description | Sets the input/output memory for matrix multiplication. |
| Parameters | rknn_matmul_ctx ctx: Matrix multiplication context. |
|  | rknn_tensor_mem* mem: Pointer to tensor memory information structure. |
|  | rknn_matmul_tensor_attr* attr: Pointer to matrix multiplication input and output tensor<br>attribute structure. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p44; unit 332 -->

Sample Code:

<!-- source: EN PDF p44; unit 333 -->

```c
// Create A
rknn_tensor_mem* A = rknn_create_mem(ctx, io_attr.A.size);
if (A == NULL) {
 printf("rknn_create_mem fail!\n");
 return -1;
}
memset(A->virt_addr, 1, A->size);
rknn_matmul_io_attr io_attr;
memset(&io_attr, 0, sizeof(rknn_matmul_io_attr));

int ret = rknn_matmul_create(&ctx, &info, &io_attr);
if (ret < 0) {
 printf("rknn_matmul_create fail! ret=%d\n", ret);
 return -1;
}
// Set A
ret = rknn_matmul_set_io_mem(ctx, A, &io_attr.A);
if (ret < 0) {
 printf("rknn_matmul_set_io_mem fail! ret=%d\n", ret);
 return -1;
}
```

<!-- source: EN PDF p45; unit 334 -->

#### rknn_matmul_set_core_mask

<!-- source: EN PDF p45; unit 335 -->

This function is used to set the available NPU cores for matrix multiplication (only RK3588 and RK3576 platform is supported). Before calling this function, you need to initialize the matrix multiplication context through the rknn_matmul_create function. The mask value that can be set by this function specifies the cores that need to be used to improve the performance and efficiency of matrix multiplication operations.

<!-- source: EN PDF p45; unit 336 -->

| API | rknn_matmul_set_core_mask |
| --- | --- |
| Description | Sets the NPU core mask for matrix multiply operations. |
| Parameters | rknn_matmul_ctx ctx: Matrix multiplication context. |
|  | rknn_core_mask core_mask: The NPU core mask value of the matrix multiplication<br>operation, which is used to specify the available NPU cores. Each bit of the mask represents<br>a core. If the corresponding bit is 1, it means that the core is available; otherwise, it means<br>that the core is unavailable (see rknn_set_core_mask API parameters for detailed mask<br>description). |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p45; unit 337 -->

Sample Code:

<!-- source: EN PDF p45; unit 338 -->

```c
rknn_matmul_set_core_mask(ctx, RKNN_NPU_CORE_AUTO);
```

<!-- source: EN PDF p45; unit 339 -->

#### rknn_matmul_set_quant_params

<!-- source: EN PDF p45; unit 340 -->

rknn_matmul_set_quant_params is used to set the quantization parameters of each matrix, and supports two methods of quantization parameter settings: Per-Channel quantization and Per-Layer quantization. When using Per-Channel quantization, the length of the scale and zp arrays in rknn_quant_params is equal to N. When using Per-Layer quantization, the scale and zp arrays in rknn_quant_params have length 1. Call this interface before rknn_matmul_run to set the quantization parameters of all matrices. If this interface is not called, the default quantization method is Per-Layer quantization, scale=1.0, zero_point=0.

<!-- source: EN PDF p45; unit 341 -->

| API | rknn_matmul_set_quant_params |
| --- | --- |
| Description | Set the quantization parameters of the matrix. |
| Parameters | rknn_matmul_ctx ctx: matrix multiplication context. |
|  | rknn_quant_params* params: quantization parameter information of the matrix. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p45; unit 342 -->

Sample Code:

<!-- source: EN PDF p46; unit 343 -->

```c
rknn_quant_params params_a;
memcpy(params_a.name, io_attr.A.name, RKNN_MAX_NAME_LEN);
params_a.scale_len = 1;
params_a.scale = (float *)malloc(params_a.scale_len * sizeof(float));
params_a.scale[0] = 0.2;
params_a.zp_len = 1;
params_a.zp = (int32_t *)malloc(params_a.zp_len * sizeof(int32_t));
params_a.zp[0] = 0;
rknn_matmul_set_quant_params(ctx, &params_a);
```

<!-- source: EN PDF p46; unit 344 -->

#### rknn_matmul_get_quant_params

<!-- source: EN PDF p46; unit 345 -->

rknn_matmul_get_quant_params is used when the rknn_matmul_type type is equal to RKNN_INT8_MM_INT8_TO_INT32 and the Per-Channel quantization mode is used to obtain the scale values of all channels of matrix B after scale normalization. The obtained scale value is multiplied by the original scale value of A to obtain the scale value of C. It can be used to approximately calculate the scale of C when the matrix C does not have a real scale.

<!-- source: EN PDF p46; unit 346 -->

| API | rknn_matmul_get_quant_params |
| --- | --- |
| Description | Get the quantization parameters of matrix B. |
| Parameters | rknn_matmul_ctx ctx: matrix multiplication context. |
|  | rknn_quant_params* params: quantization parameter information of matrix B. |
|  | float* scale: scale pointer of matrix B. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p46; unit 347 -->

Sample Code:

<!-- source: EN PDF p46; unit 348 -->

```c
float b_scale;
rknn_matmul_get_quant_params(ctx, &params_b, &b_scale);
```

<!-- source: EN PDF p47; unit 349 -->

#### rknn_matmul_create_dynamic_shape

<!-- source: EN PDF p47; unit 350 -->

rknn_matmul_create_dynamic_shape is used to create a dynamic shape matrix multiplication context. This interface needs to pass in the rknn_matmul_info structure, the number of shapes and the corresponding shape array. The shape array will record multiple M, K and N values. After successful initialization, you will get the array of rknn_matmul_io_attr, which contains the shape, size and data type of all input and output matrices. Currently, it only supports setting multiple different M, K and N.

<!-- source: EN PDF p47; unit 351 -->

| API | rknn_matmul_create_dynamic_shape |
| --- | --- |
| Description | Initialize the context for dynamic shape matrix multiplication. |
| Parameters | rknn_matmul_ctx *ctx: matrix multiplication context pointer. |
|  | rknn_matmul_info* info: matrix multiplication specification information structure pointer.<br>Among them, M, K and N do not need to be set. |
|  | int shape_num: The number of shapes supported by the matrix context. |
|  | rknn_matmul_shape dynamic_shapes[]: Shape array supported by matrix context. |
|  | rknn_matmul_io_attr io_attrs[]: matrix multiplication input and output tensor attribute<br>structure array. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p47; unit 352 -->

Sample Code:

<!-- source: EN PDF p47; unit 353 -->

```c
const int shape_num = 2;
rknn_matmul_shape shapes[shape_num];
for (int i = 0; i < shape_num; ++i) {
 shapes[i].M = i+1;
 shapes[i].K = 64;
 shapes[i].N = 32;
}
rknn_matmul_io_attr io_attr[shape_num];
memset(io_attr, 0, sizeof(rknn_matmul_io_attr) * shape_num);

int ret = rknn_matmul_create_dynamic_shape(&ctx, &info, shape_num, shapes, io_attr);
if (ret < 0) {
 fprintf(stderr, " rknn_matmul_create_dynamic_shape fail! ret=%d\n", ret);
 return -1;
}
```

<!-- source: EN PDF p47; unit 354 -->

#### rknn_matmul_create_dyn_shape(deprecated)

<!-- source: EN PDF p47; unit 355 -->

This interface has been deprecated and the rknn_matmul_create_dynamic_shape interface has been used instead.

<!-- source: EN PDF p48; unit 356 -->

#### rknn_matmul_set_dynamic_shape

<!-- source: EN PDF p48; unit 357 -->

rknn_matmul_set_dynamic_shape is used to specify a certain shape used in matrix multiplication. After creating the matrix multiplication context of the dynamic shape, select one of the rknn_matmul_shape structures as the input parameter, and call this interface to set the shape used for the operation.

<!-- source: EN PDF p48; unit 358 -->

| API | rknn_matmul_set_dynamic_shape |
| --- | --- |
| Description | Set matrix multiplication shape. |
| Parameters | rknn_matmul_ctx ctx: matrix multiplication context. |
|  | rknn_matmul_shape* shape: Specifies the shape used for matrix multiplication. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p48; unit 359 -->

Sample Code:

<!-- source: EN PDF p48; unit 360 -->

```c
ret = rknn_matmul_set_dynamic_shape(ctx, &shapes[0]);
if (ret != 0) {
 fprintf(stderr, "rknn_matmul_set_dynamic_shapes fail!\n");
 return -1;
}
```

<!-- source: EN PDF p49; unit 361 -->

#### rknn_B_normal_layout_to_native_layout

<!-- source: EN PDF p49; unit 362 -->

rknn_B_normal_layout_to_native_layout is used to convert data arranged in the original shape of matrix B (KxN) into data arranged in a high-performance data arrangement.

<!-- source: EN PDF p49; unit 363 -->

| API | rknn_B_normal_layout_to_native_layout |
| --- | --- |
| Description | Convert the data arrangement of matrix B from the original shape to a high-performance<br>shape. |
| Parameters | void* B_input: Matrix B data pointer of original shape. |
|  | void* B_output: High-performance shape matrix B data pointer. |
|  | int K: The number of rows of matrix B. |
|  | int N: The number of columns of matrix B. |
|  | int subN: equal to B.dims[2] in the rknn_matmul_io_attr structure. |
|  | int subK: equal to B.dims[3] in the rknn_matmul_io_attr structure. |
|  | rknn_matmul_info* info: The information struct pointer for matrix multiplication. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p49; unit 364 -->

Sample Code:

<!-- source: EN PDF p49; unit 365 -->

```c
int32_t subN = io_attr.B.dims[2];
int32_t subK = io_attr.B.dims[3];
rknn_B_normal_layout_to_native_layout(B_Matrix, B->virt_addr, K, N, subN, subK, &info);
```

<!-- source: EN PDF p49; unit 366 -->

#### rknn_matmul_run

<!-- source: EN PDF p49; unit 367 -->

This function is used to run a matrix multiplication operation and save the result in the output matrix C. Before calling this function, the input matrices A and B need to prepare data first, and set them to the input buffer through the rknn_matmul_set_io_mem function. The output matrix C needs to be set to the output buffer through the rknn_matmul_set_io_mem function, and the tensor attribute of the output matrix is obtained through the rknn_matmul_create function.

<!-- source: EN PDF p49; unit 368 -->

| API | rknn_matmul_run |
| --- | --- |
| Description | Perform a matrix multiplication operation. |
| Parameters | rknn_matmul_ctx ctx: Matrix multiplication context. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p49; unit 369 -->

Sample Code:

<!-- source: EN PDF p49; unit 370 -->

```c
int ret = rknn_matmul_run(ctx);
```

<!-- source: EN PDF p50; unit 371 -->

#### rknn_matmul_destroy

<!-- source: EN PDF p50; unit 372 -->

This function is used to destroy the matrix multiplication operation context and release related resources. After using the matrix multiplication pointer created by the rknn_matmul_create function, you need to call this function to destroy it.

<!-- source: EN PDF p50; unit 373 -->

| API | rknn_matmul_destroy |
| --- | --- |
| Description | Destroys the matrix multiply operation context. |
| Parameters | rknn_matmul_ctx ctx: Matrix multiplication context. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p50; unit 374 -->

Sample Code:

<!-- source: EN PDF p50; unit 375 -->

```c
int ret = rknn_matmul_destroy(ctx);
```

<!-- source: EN PDF p51; unit 376 -->

### 4.6 Definition of Custom Operator Data Structure

<!-- source: EN PDF p51; unit 377 -->

#### rknn_gpu_op_context

<!-- source: EN PDF p51; unit 378 -->

rknn_gpu_op_context represents the context information of the custom operator run by the specified GPU. The definition of the structure is shown in the following table:

<!-- source: EN PDF p51; unit 379 -->

| Field | Type | Meaning |
| --- | --- | --- |
| cl_context | void* | OpenCL's cl_context object, please force type conversion to cl_context<br>when using it. |
| cl_command_queue | void* | OpenCL's cl_command_queue object, please force type conversion to<br>cl_command_queue when using it. |
| cl_kernel | void* | OpenCL's cl_kernel object, please force type conversion to cl_kernel<br>when using it. |

<!-- source: EN PDF p51; unit 380 -->

#### rknn_custom_op_context

<!-- source: EN PDF p51; unit 381 -->

rknn_custom_op_context represents the context information of the custom operator. The definition of the structure is shown in the following table:

<!-- source: EN PDF p51; unit 382 -->

| Field | Type | Meaning |
| --- | --- | --- |
| target | rknn_target_type | Backend device that executes custom operators:<br>RKNN_TARGET_TYPE_CPU: CPU<br>RKNN_TARGET_TYPE_CPU: GPU |
| internal_ctx | rknn_custom_op_interal_context | Private context inside the operator. |
| gpu_ctx | rknn_gpu_op_context | Contains the OpenCL context information of the<br>custom operator. When the execution backend device<br>is a GPU, OpenCL objects such as cl_context are<br>obtained from this structure in the callback function. |
| priv_data | void* | Data pointers left to developers to manage. |

<!-- source: EN PDF p52; unit 383 -->

#### rknn_custom_op_tensor

<!-- source: EN PDF p52; unit 384 -->

rknn_custom_op_tensor represents the input/output tensor information of the custom operator. The definition of the structure is shown in the following table:

<!-- source: EN PDF p52; unit 385 -->

| Field | Type | Meaning |
| --- | --- | --- |
| attr | rknn_tensor_attr | Contains the name, shape, size and other information of the tensor. |
| mem | rknn_tensor_mem | Contains tensor's memory address, fd, valid data offset and other<br>information. |

<!-- source: EN PDF p52; unit 386 -->

#### rknn_custom_op_attr

<!-- source: EN PDF p52; unit 387 -->

rknn_custom_op_attr represents the parameters or attribute information of the custom operator. The definition of the structure is shown in the following table:

<!-- source: EN PDF p52; unit 388 -->

| Field | Type | Meaning |
| --- | --- | --- |
| name | char[] | The parameter name of the custom operator. |
| dtype | rknn_tensor_type | The data type of each element. |
| n_elems | uint32_t | Number of elements. |
| data | void* | The virtual address of the parameter data memory segment. |

<!-- source: EN PDF p53; unit 389 -->

#### rknn_custom_op

<!-- source: EN PDF p53; unit 390 -->

rknn_custom_op represents the registration information of the custom operator. The definition of the structure is shown in the following table:

<!-- source: EN PDF p53,54; unit 391,392 -->

| Field | Type | Meaning |
| --- | --- | --- |
| version | uint32_t | Custom operator version number. |
| target | rknn_target_type | Custom operator execution backend<br>type. |
| op_type | char[] | Custom operator type. |
| cl_kernel_name | char[] | OpenCL kernel function name. |
| cl_kernel_source | char* | OpenCL resource name. When<br>cl_source_size is equal to 0, it<br>represents the absolute path of the file;<br>when cl_source_size is greater than 0,<br>it represents the string of kernel<br>function code. |
| cl_source_size | uint64_t | When cl_kernel_source is a string, it<br>indicates the length of the string; when<br>cl_kernel_source is a file path, it is set<br>to 0. |
| cl_build_options | char[] | Compilation options for the OpenCL<br>kernel. |
| init | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Custom operator initialization callback<br>function pointer. Called once during<br>registration. It can be set to NULL<br>when not needed. |
| prepare | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Preprocessing callback function<br>pointer. Called once during rknn_run.<br>It can be set to NULL when not<br>needed. |
| compute | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | The callback function pointer of the<br>custom operator function. Called once<br>during rknn_run. Cannot be set to<br>NULL. |
| compute_native | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | High-performance computing callback<br>function pointer. The difference<br>between it and the compute callback<br>function is the format of the input and<br>output tensor. Not supported yet,<br>currently set to NULL. |
| destroy | int (*)(rknn_custom_op_context*<br>op_ctx); | The callback function pointer for<br>destroying resources. Called once<br>during rknn_destroy. |

<!-- source: EN PDF p55; unit 393 -->

### 4.7 Description of Custom Operator API

<!-- source: EN PDF p55; unit 394 -->

#### rknn_register_custom_ops

<!-- source: EN PDF p55; unit 395 -->

After the context is successfully initialized, this function is used to register several custom operator information in the context, including custom operator types, running backend types, OpenCL kernel information, and callback function pointers. After successful registration, during the inference phase, the rknn_run interface will call the callback function implemented by the developer.

<!-- source: EN PDF p55; unit 396 -->

| API | rknn_register_custom_ops |
| --- | --- |
| Description | Register several custom operators into the context. |
| Parameters | rknn_context *context: the rknn_context pointer. Before the function is called, the context<br>must have been successfully initialized. |
|  | rknn_custom_op* op: the custom operator information array, each element of the array is a<br>rknn_custom_op structure object. |
|  | uint32_t custom_op_num: custom operator information array length. |
| Return | int: Error code (See RKNN Error Code). |

<!-- source: EN PDF p55; unit 397 -->

Sample Code:

<!-- source: EN PDF p55; unit 398 -->

```c
// CPU operators
rknn_custom_op user_op[2];
memset(user_op, 0, 2 * sizeof(rknn_custom_op));
strncpy(user_op[0].op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op[0].version = 1;
user_op[0].target = RKNN_TARGET_TYPE_CPU;
user_op[0].init = custom_op_init_callback;
user_op[0].compute = compute_custom_softmax_float32;
user_op[0].destroy = custom_op_destroy_callback;

strncpy(user_op[1].op_type, "ArgMax", RKNN_MAX_NAME_LEN - 1);
user_op[1].version = 1;
user_op[1].target = RKNN_TARGET_TYPE_CPU;
user_op[1].init = custom_op_init_callback;
user_op[1].compute = compute_custom_argmax_float32;
user_op[1].destroy = custom_op_destroy_callback;

ret = rknn_register_custom_ops(ctx, user_op, 2);
if (ret < 0) {
 printf("rknn_register_custom_ops fail! ret = %d\n", ret);
 return -1;
}
```

<!-- source: EN PDF p56; unit 399 -->

#### rknn_custom_op_get_op_attr

<!-- source: EN PDF p56; unit 400 -->

This function is used to obtain the parameter information of the custom operator in the callback function of the custom operator, such as the axis parameter of the Softmax operator. It passes in the field name of the custom operator parameter and a rknn_custom_op_attr structure pointer. After calling this interface, the parameter value will be stored in the data member in the rknn_custom_op_attr structure. The developer forces the pointer according to the dtype member in the returned structure. Convert it into the first address of the array of a specific data type in C language, and then read out the complete parameter value according to the number of elements.

<!-- source: EN PDF p56; unit 401 -->

| API | rknn_custom_op_get_op_attr |
| --- | --- |
| Description | Get the parameters or properties of a custom operator. |
| Parameters | rknn_custom_op_context* op_ctx: custom operator context pointer. |
|  | const char* attr_name: field name of custom operator parameter. |
|  | rknn_custom_op_attr* op_attr: a structure representing the custom operator parameter<br>value. |
| Return | No value. |

<!-- source: EN PDF p56; unit 402 -->

Sample Code:

<!-- source: EN PDF p56; unit 403 -->

```c
rknn_custom_op_attr op_attr;
rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
  axis = ((int64_t*)op_attr.data)[0];
}
…
```

<!-- source: EN PDF p57; unit 404 -->

## 5. RKNN Error Code

<!-- source: EN PDF p57; unit 405 -->

The return code of the RKNN API function is defined as shown in the following table.

<!-- source: EN PDF p57; unit 406 -->

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
| RKNN_ERR_INCOMPATILE_OPTIMIZATION_LEVEL_VERSION<br>(-12) | This RKNN model use<br>optimization level mode, but<br>not compatible with current<br>driver. |
| RKNN_ERR_TARGET_PLATFORM_UNMATCH (-13) | This RKNN model doesn’t<br>compatible with current<br>platform. |

{% endraw %}
