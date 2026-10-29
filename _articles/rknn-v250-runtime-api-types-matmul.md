---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Matrix multiplication structures"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-types-matmul"
slug: "rknn-v250-runtime-api-types-matmul"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Matrix multiplication structures | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Matrix multiplication structures | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-types-matmul/"
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

<!-- source EN p40 unit 449 -->

### 6.3. Matrix Multiplication Structures

<!-- source EN p40 unit 450 -->

### rknn_matmul_info

<!-- source EN p40 unit 451 -->

rknn_matmul_info indicates the specification information for performing matrix multiplication, which includes the size of matrix multiplication, data type and memory arrangement of input and output matrices. The definition of the structure is shown in the following table:

<!-- source EN p40 unit 452 -->

| Field | Type | Meaning |
| --- | --- | --- |
| M | int32_t | The number of rows of the A matrix. |
| K | int32_t | The number of columns of the A matrix. |
| N | int32_t | The number of columns of the B matrix. |
| type | rknn_matmul_type | Data type of input and output matrices:<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32: Indicates that matrices A and B are<br>of type float16, and matrix C is of type float;<br>RKNN_INT8_MM_INT8_TO_INT32: Indicates that matrices A and B are of type int8,<br>and matrix C is of type int32;<br>RKNN_INT8_MM_INT8_TO_INT8: Indicates that matrices A and B are of type int8,<br>and matrix C is of type int8;<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT16:: Indicates that matrices A and B<br>are of type float16, and matrix C is of type float16;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT32: Indicates that matrix A is of type float16,<br>matrix B is type int8, and matrix C is type float;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT16: Indicates that matrix A is of type float16,<br>matrix B is type int8, and matrix C is type float16;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT32: Indicates that matrix A is of type float16,<br>matrix B is type int4, and matrix C is type float;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT16: Indicates that matrix A is of type float16,<br>matrix B is type int4, and matrix C is type float16;<br>RKNN_INT8_MM_INT8_TO_FLOAT32: Indicates that matrices A and B are of type<br>int8, and matrix C is of type float;<br>RKNN_INT4_MM_INT4_TO_INT16: Indicates that matrices A and B are of type int4,<br>and matrix C is of type int16;<br>RKNN_INT8_MM_INT4_TO_INT32: Indicates that matrix A is of type int8, matrix B is<br>type int4, and matrix C is type int32; |
| B_layout | int16_t | The memory layout of the B matrix. 0: Indicates [K,N] shape arrangement.<br>RKNN_MM_LAYOUT_NORM: Indicates that matrix B is arranged according to the<br>original shape, i.e. the shape of KxN;<br>RKNN_MM_LAYOUT_NATIVE: Indicates that matrix B is arranged in a high-<br>performance shape<br>RKNN_MM_LAYOUT_TP_NORM: Matrix B is arranged according to the shape after<br>Transpose, i.e., the shape row of NxK |
| B_quant_type | int16_t | Specifies the type of quantization method for matrix B.<br>RKNN_QUANT_TYPE_PER_LAYER_SYM: Matrix B is symmetrically quantized<br>according to the Per-Layer method;<br>RKNN_QUANT_TYPE_PER_LAYER_ASYM: Matrix B is asymmetrically quantized<br>according to the Per-Layer method;<br>RKNN_QUANT_TYPE_PER_CHANNEL_SYM: Matrix B is symmetrically quantized<br>according to the Per-Channel method ;<br>RKNN_QUANT_TYPE_PER_CHANNEL_ASYM: indicates that matrix B is<br>asymmetrically quantized in the Per-Channel mode;<br>RKNN_QUANT_TYPE_PER_GROUP_SYM: indicates that matrix B is symmetrically<br>quantized in the Per-Group mode;<br>RKNN_QUANT_TYPE_PER_GROUP_ASYM: Matrix B is asymmetrically quantified<br>according to the Per-Group method |
| AC_layout | int16_t | Specifies how the data is arranged for Matrix A and Matrix C.<br>RKNN_MM_LAYOUT_NORM: Indicates that matrices A and C are arranged in their<br>original shapes;<br>RKNN_MM_LAYOUT_NATIVE: Represents matrices A and C arranged in high-<br>performance shapes |
| AC_quant_type | int16_t | Specifies the quantization type of matrices A and C.<br>RKNN_QUANT_TYPE_PER_LAYER_SYM: Represents the symmetrical quantization<br>of matrices A and C in a Per-Layer method;<br>RKNN_QUANT_TYPE_PER_LAYER_ASYM: Represents the asymmetric quantization<br>of matrices A and C in the Per-Layer method |
| iommu_domain_id | int32_t | The index of the IOMMU address space domain where the matrix context resides. The<br>IOMMU address space corresponds to the context one-to-one, and the size of each<br>IOMMU address space is 4 GB. This parameter is mainly used when the parameters of<br>matrices A, B, and C are large and need to be switched to another domain after the<br>NPU allocated more than 4 GB of memory in one domain. |
| group_size | int16_t | The number of elements in a group takes effect only when group quantization is<br>enabled. |
| reserved | int8_t[] | Reservation field. |

<!-- source EN p42 unit 455 -->

### rknn_matmul_tensor_attr

<!-- source EN p42 unit 456 -->

rknn_matmul_tensor_attr represents the attribute of each matrix tensor, which includes the name, shape, size and data type of the matrix. The definition of the structure is shown in the following table:

<!-- source EN p42 unit 457 -->

| Field | Type | Meaning |
| --- | --- | --- |
| name | char[] | The name of the matrix. |
| n_dims | uint32_t | The number of dimensions of the matrix. |
| dims | uint32_t[] | The shape of the matrix. |
| size | uint32_t | the size of the matrix. |
| type | rknn_tensor_type | The data type of matrix |

<!-- source EN p42 unit 458 -->

### rknn_matmul_io_attr

<!-- source EN p42 unit 459 -->

rknn_matmul_io_attr represents the attributes of all input and output tensors of the matrix, which includes the attributes of matrices A, B, and C. The definition of the structure is shown in the following table:

<!-- source EN p42 unit 460 -->

| Field | Type | Meaning |
| --- | --- | --- |
| A | rknn_matmul_tensor_attr | The tensor attribute of matrix A. |
| B | rknn_matmul_tensor_attr | The tensor attribute of matrix B. |
| C | rknn_matmul_tensor_attr | The tensor attribute of matrix C. |

<!-- source EN p42 unit 461 -->

### rknn_quant_params

<!-- source EN p42 unit 462 -->

rknn_quant_params represents the quantization parameters of the matrix, including name and the pointers and lengths of the scale and zero_point arrays. name is used to identify the name of the matrix, which can be obtained from the rknn_matmul_io_attr structure obtained when initializing the matrix context. The structure definition is shown in the following table:

<!-- source EN p42 unit 463 -->

| Field | Type | Meaning |
| --- | --- | --- |
| name | char[] | The name of the matrix. |
| scale | float* | The scale array pointer of matrix. |
| scale_len | int32_t | The scale array length of the matrix |
| zp | int32_t* | The zero_point array pointer of matrix |
| zp_len | int32_t | The zero_point array length of matrix |

<!-- source EN p42 unit 464 -->

### rknn_matmul_shape

<!-- source EN p42 unit 465 -->

rknn_matmul_shape represents the M, K and N of matrix multiplication of a specific shape. When initializing the matrix multiplication context of a dynamic shape, you need to provide the number of shapes and use the rknn_matmul_shape structure array to represent all input shapes. The structure definition is shown in the following table:

<!-- source EN p42 unit 466 -->

| Field | Type | Meaning |
| --- | --- | --- |
| M | int32_t | The number of rows of the A matrix. |
| K | int32_t | The number of columns of matrix A. |
| N | int32_t | The number of columns of matrix C. |

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
