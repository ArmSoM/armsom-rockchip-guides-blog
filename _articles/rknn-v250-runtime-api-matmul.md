---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Matrix multiplication APIs and dynamic shapes"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-matmul"
slug: "rknn-v250-runtime-api-matmul"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Matrix multiplication APIs and dynamic shapes | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Matrix multiplication APIs and dynamic shapes | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-matmul/"
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

<!-- source EN p30 unit 332 -->

### 5.5. Matrix Multiplication

<!-- source EN p30 unit 333 -->

Matrix multiplication context creation, memory setting, quantization parameters and execution.

<!-- source EN p30 unit 334 -->

### rknn_matmul_create

<!-- source EN p30 unit 335 -->

The function of this function is to complete the initialization of the matrix multiplication context based on the incoming matrix multiplication specification and other information, and return the shape, size, data type and other information of the input and output tensor. Here, the rknn_matmul_ctx pointer and rknn_context are the same data structure.

<!-- source EN p30 unit 336 -->

| API | rknn_matmul_create |
| --- | --- |
| Description | Initializes the matrix multiplication context. |
| Parameters | rknn_matmul_ctx* ctx: Matrix multiplication context pointer. |
| Parameters | rknn_matmul_info* info: Pointer to the specification information structure of matrix multiplication. |
| Parameters | rknn_matmul_io_attr* io_attr: Pointer to the matrix multiplication input and output tensor attribute structure. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p30 unit 337 -->

Sample Code:

<!-- source EN p30 unit 338 -->

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

<!-- source EN p30 unit 339 -->

### rknn_matmul_set_io_mem

<!-- source EN p30 unit 340 -->

This function is used to set the input/output memory for the matrix multiplication operation. Before calling this function, first use the rknn_tensor_mem structure pointer created by the rknn_create_mem interface, and then pass it into the function with the rknn_matmul_tensor_attr structure pointer of the matrix A, B or C returned by the rknn_matmul_create function, and set the input and output memory to the matrix multiplication in context. Before calling this function, the data of matrix A and matrix B should be prepared according to the memory arrangement configured in rknn_matmul_info.

<!-- source EN p30 unit 341 -->

| API | rknn_matmul_set_io_mem |
| --- | --- |
| Description | Sets the input/output memory for matrix multiplication. |
| Parameters | rknn_matmul_ctx ctx: Matrix multiplication context. |
| Parameters | rknn_tensor_mem* mem: Pointer to tensor memory information structure. |
| Parameters | rknn_matmul_tensor_attr* attr: Pointer to matrix multiplication input and output tensor attribute structure. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p30 unit 342 -->

Sample Code:

<!-- source EN p31 unit 343 -->

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

<!-- source EN p31 unit 344 -->

### rknn_matmul_set_core_mask

<!-- source EN p31 unit 345 -->

This function is used to set the available NPU cores for matrix multiplication (only RK3588 and RK3576 platform is supported). Before calling this function, you need to initialize the matrix multiplication context through the rknn_matmul_create function. The mask value that can be set by this function specifies the cores that need to be used to improve the performance and efficiency of matrix multiplication operations.

<!-- source EN p31 unit 346 -->

| API | rknn_matmul_set_core_mask |
| --- | --- |
| Description | Sets the NPU core mask for matrix multiply operations. |
| Parameters | rknn_matmul_ctx ctx: Matrix multiplication context. |
| Parameters | rknn_core_mask core_mask: The NPU core mask value of the matrix multiplication operation, which is used to<br>specify the available NPU cores. Each bit of the mask represents a core. If the corresponding bit is 1, it means<br>that the core is available; otherwise, it means that the core is unavailable (see rknn_set_core_mask API<br>parameters for detailed mask description). |
| Return | int: Error code (See Status Codes). |

<!-- source EN p31 unit 347 -->

Sample Code:

<!-- source EN p31 unit 348 -->

```c
rknn_matmul_set_core_mask(ctx, RKNN_NPU_CORE_AUTO);
```

<!-- source EN p31 unit 349 -->

### rknn_matmul_set_quant_params

<!-- source EN p31 unit 350 -->

rknn_matmul_set_quant_params is used to set the quantization parameters of each matrix, and supports two methods of quantization parameter settings: Per-Channel quantization and Per-Layer quantization. When using Per- Channel quantization, the length of the scale and zp arrays in rknn_quant_params is equal to N. When using Per- Layer quantization, the scale and zp arrays in rknn_quant_params have length 1. Call this interface before rknn_matmul_run to set the quantization parameters of all matrices. If this interface is not called, the default quantization method is Per-Layer quantization, scale=1.0, zero_point=0.

<!-- source EN p31 unit 351 -->

| API | rknn_matmul_set_quant_params |
| --- | --- |
| Description | Set the quantization parameters of the matrix. |
| Parameters | rknn_matmul_ctx ctx: matrix multiplication context. |
| Parameters | rknn_quant_params* params: quantization parameter information of the matrix. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p31 unit 352 -->

Sample Code:

<!-- source EN p32 unit 353 -->

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

<!-- source EN p32 unit 354 -->

### rknn_matmul_get_quant_params

<!-- source EN p32 unit 355 -->

rknn_matmul_get_quant_params is used when the rknn_matmul_type type is equal to RKNN_INT8_MM_INT8_TO_INT32 and the Per-Channel quantization mode is used to obtain the scale values of all channels of matrix B after scale normalization. The obtained scale value is multiplied by the original scale value of A to obtain the scale value of C. It can be used to approximately calculate the scale of C when the matrix C does not have a real scale.

<!-- source EN p32 unit 356 -->

| API | rknn_matmul_get_quant_params |
| --- | --- |
| Description | Get the quantization parameters of matrix B. |
| Parameters | rknn_matmul_ctx ctx: matrix multiplication context. |
| Parameters | rknn_quant_params* params: quantization parameter information of matrix B. |
| Parameters | float* scale: scale pointer of matrix B. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p32 unit 357 -->

Sample Code:

<!-- source EN p32 unit 358 -->

```c
float b_scale;
rknn_matmul_get_quant_params(ctx, &params_b, &b_scale);
```

<!-- source EN p32 unit 359 -->

### rknn_matmul_create_dyn_shape (deprecated)

<!-- source EN p32 unit 360 -->

This interface has been deprecated and the rknn_matmul_create_dynamic_shape interface has been used instead.

<!-- source EN p32 unit 361 -->

### rknn_matmul_create_dynamic_shape

<!-- source EN p32 unit 362 -->

rknn_matmul_create_dynamic_shape is used to create a dynamic shape matrix multiplication context. This interface needs to pass in the rknn_matmul_info structure, the number of shapes and the corresponding shape array. The shape array will record multiple M, K and N values. After successful initialization, you will get the array of rknn_matmul_io_attr, which contains the shape, size and data type of all input and output matrices. Currently, it only supports setting multiple different M, K and N.

<!-- source EN p32 unit 363 -->

| API | rknn_matmul_create_dynamic_shape |
| --- | --- |
| Description | Initialize the context for dynamic shape matrix multiplication. |
| Parameters | rknn_matmul_ctx *ctx: matrix multiplication context pointer. |
| Parameters | rknn_matmul_info* info: matrix multiplication specification information structure pointer. Among them, M, K and<br>N do not need to be set. |
| Parameters | int shape_num: The number of shapes supported by the matrix context. |
| Parameters | rknn_matmul_shape dynamic_shapes[]: Shape array supported by matrix context. |
| Parameters | rknn_matmul_io_attr io_attrs[]: matrix multiplication input and output tensor attribute structure array. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p32 unit 364 -->

Sample Code:

<!-- source EN p33 unit 365 -->

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

<!-- source EN p33 unit 366 -->

### rknn_matmul_set_dynamic_shape

<!-- source EN p33 unit 367 -->

rknn_matmul_set_dynamic_shape is used to specify a certain shape used in matrix multiplication. After creating the matrix multiplication context of the dynamic shape, select one of the rknn_matmul_shape structures as the input parameter, and call this interface to set the shape used for the operation.

<!-- source EN p33 unit 368 -->

| API | rknn_matmul_set_dynamic_shape |
| --- | --- |
| Description | Set matrix multiplication shape. |
| Parameters | rknn_matmul_ctx ctx: matrix multiplication context. |
| Parameters | rknn_matmul_shape* shape: Specifies the shape used for matrix multiplication. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p33 unit 369 -->

Sample Code:

<!-- source EN p33 unit 370 -->

```c
ret = rknn_matmul_set_dynamic_shape(ctx, &shapes[0]);
if (ret != 0) {
  fprintf(stderr, "rknn_matmul_set_dynamic_shapes fail!\n");
  return -1;
}
```

<!-- source EN p33 unit 371 -->

rknn_B_normal_layout_to_native_layout

<!-- source EN p33 unit 372 -->

rknn_B_normal_layout_to_native_layout is used to convert data arranged in the original shape of matrix B (KxN) into data arranged in a high-performance data arrangement.

<!-- source EN p33 unit 373 -->

| API | rknn_B_normal_layout_to_native_layout |
| --- | --- |
| Description | Convert the data arrangement of matrix B from the original shape to a high-performance shape. |
| Parameters | void* B_input: Matrix B data pointer of original shape. |
| Parameters | void* B_output: High-performance shape matrix B data pointer. |
| Parameters | int K: The number of rows of matrix B. |
| Parameters | int N: The number of columns of matrix B. |
| Parameters | int subN: equal to B.dims[2] in the rknn_matmul_io_attr structure. |
| Parameters | int subK: equal to B.dims[3] in the rknn_matmul_io_attr structure. |
| Parameters | rknn_matmul_info* info: The information struct pointer for matrix multiplication. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p33 unit 374 -->

Sample Code:

<!-- source EN p34 unit 375 -->

```c
int32_t subN = io_attr.B.dims[2];
int32_t subK = io_attr.B.dims[3];
rknn_B_normal_layout_to_native_layout(B_Matrix, B->virt_addr, K, N, subN, subK, &info);
```

<!-- source EN p34 unit 376 -->

### rknn_matmul_run

<!-- source EN p34 unit 377 -->

This function is used to run a matrix multiplication operation and save the result in the output matrix C. Before calling this function, the input matrices A and B need to prepare data first, and set them to the input buffer through the rknn_matmul_set_io_mem function. The output matrix C needs to be set to the output buffer through the rknn_matmul_set_io_mem function, and the tensor attribute of the output matrix is obtained through the rknn_matmul_create function.

<!-- source EN p34 unit 378 -->

| API | rknn_matmul_run |
| --- | --- |
| Description | Perform a matrix multiplication operation. |
| Parameters | rknn_matmul_ctx ctx: Matrix multiplication context. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p34 unit 379 -->

Sample Code:

<!-- source EN p34 unit 380 -->

```c
int ret = rknn_matmul_run(ctx);
```

<!-- source EN p34 unit 381 -->

### rknn_matmul_destroy

<!-- source EN p34 unit 382 -->

This function is used to destroy the matrix multiplication operation context and release related resources. After using the matrix multiplication pointer created by the rknn_matmul_create function, you need to call this function to destroy it.

<!-- source EN p34 unit 383 -->

| API | rknn_matmul_destroy |
| --- | --- |
| Description | Destroys the matrix multiply operation context. |
| Parameters | rknn_matmul_ctx ctx: Matrix multiplication context. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p34 unit 384 -->

Sample Code:

<!-- source EN p34 unit 385 -->

```c
int ret = rknn_matmul_destroy(ctx);
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
