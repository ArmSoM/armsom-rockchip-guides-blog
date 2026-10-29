---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Tensor memory allocation and synchronization"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-tensor-memory"
slug: "rknn-v250-runtime-api-tensor-memory"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Tensor memory allocation and synchronization | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Tensor memory allocation and synchronization | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-tensor-memory/"
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

<!-- source EN p25 unit 279 -->

### 5.4. Tensor and Memory

<!-- source EN p25 unit 280 -->

Tensor memory allocation, release, synchronization and user-defined memory setting.

<!-- source EN p25 unit 281 -->

### rknn_create_mem_from_phys

<!-- source EN p25 unit 282 -->

When the user wants to allocate memory for NPU, the rknn_create_mem_from_phys function can create a rknn_tensor_mem structure and return its pointer. This function will pass the physical address, virtual address and size, and the information related to the external memory to the rknn_tensor_mem structure.

<!-- source EN p25 unit 283 -->

| API | rknn_create_mem_from_phys |
| --- | --- |
| Description | Create rknn_tensor_mem structure and allocate memory through physical address. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | uint64_t phys_addr: The physical address of buffer. |
| Parameter | void *virt_addr: The virtual address of buffer, it is the start address of the memory corresponding to fd. |
| Parameter | uint32_t size: The size of buffer. |
| Return | rknn_tensor_mem*: The tensor memory information structure pointer. |

<!-- source EN p25 unit 284 -->

Sample Code:

<!-- source EN p25 unit 285 -->

```c
//suppose we have got buffer information as input_phys, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_phys(ctx, input_phys, input_virt, size);
```

<!-- source EN p25 unit 286 -->

### rknn_create_mem_from_fd

<!-- source EN p25 unit 287 -->

When the user wants to allocate the memory for NPU, the rknn_create_mem_from_fd creates a rknn_tensor_mem structure and return its pointer. This function filled with the file descriptor, logical address and size, and the information related to the external memory will be assigned to the rknn_tensor_mem structure.

<!-- source EN p26 unit 288 -->

| API | rknn_create_mem_from_fd |
| --- | --- |
| Description | Create rknn_tensor_mem structure and allocate memory through file descriptor. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | int32_t fd: The file descriptor of buffer. |
| Parameter | void *virt_addr: The virtual address of buffer, which indicates the beginning of fd. |
| Parameter | uint32_t size: The size of buffer. |
| Parameter | int32_t offset: The offset corresponding for file descriptor and virtual address. |
| Return | rknn_tensor_mem*: The tensor memory information structure pointer. |

<!-- tensor-memory-source-difference:start -->

**Source difference:** The Chinese PDF, page 25, writes this parameter as `void virt_addr` and places `*` at the end of its description; the English PDF, page 26, writes `void *virt_addr`. The table retains the corresponding source wording. This is a source type-notation discrepancy, not a validated API declaration; check the actual V2.5.0 SDK header before use.

<!-- tensor-memory-source-difference:end -->

<!-- source EN p26 unit 289 -->

Sample Code:

<!-- source EN p26 unit 290 -->

```c
//suppose we have got buffer information as input_fd, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_fd(ctx, input_fd, input_virt, size, 0);
```

<!-- source EN p26 unit 291 -->

### rknn_create_mem

<!-- source EN p26 unit 292 -->

When the user wants to allocate memory which can be used directly in the NPU, the rknn_create_mem function can allocate the memory size specified by the user and return a rknn_tensor_mem structure.

<!-- source EN p26 unit 293 -->

| API | rknn_create_mem |
| --- | --- |
| Description | Create rknn_tensor_mem structure internally and allocate memory during runtime. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | uint32_t size: The size of buffer. |
| Return | rknn_tensor_mem*: The tensor memory information structure pointer. |

<!-- source EN p26 unit 294 -->

Sample Code:

<!-- source EN p26 unit 295 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem(ctx, size);
```

<!-- source EN p26 unit 296 -->

rknn_create_mem2

<!-- source EN p26 unit 297 -->

When the user wants to allocate memory which can be used directly in the NPU, the rknn_create_mem2 function can allocate the memory size and memory type specified by the user and return a rknn_tensor_mem structure.

<!-- source EN p26 unit 298 -->

| API | rknn_create_mem2 |
| --- | --- |
| Description | Create rknn_tensor_mem structure internally and allocate memory during runtime. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | uint64_t size: The size of buffer. |
| Parameter | uint64_t alloc_flags: Controls whether the allocated memory is cacheable. RKNN_FLAG_MEMORY_CACHEABLE:<br>Create cacheable memory. RKNN_FLAG_MEMORY_NON_CACHEABLE: Create non-cacheable memory.<br>RKNN_FLAG_MEMORY_FLAGS_DEFAULT:same with RKNN_FLAG_MEMORY_CACHEABLE<br>RKNN_FLAG_MEMORY_TRY_ALLOC_SRAM:Try to allocate memory in SRAM if possible; if SRAM is not enough,<br>allocate the remaining memory in DRAM. |
| Return | rknn_tensor_mem*: The tensor memory information structure pointer. |

<!-- source EN p26 unit 299 -->

The main difference between rknn_create_mem2 and rknn_create_mem is that rknn_create_mem2 brings an alloc_flags, which can specify whether the allocated memory is cacheable, while rknn_create_mem cannot be specified, and the default is cacheable.

<!-- source EN p26 unit 300 -->

Sample Code:

<!-- source EN p27 unit 301 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem2(ctx, size, RKNN_FLAG_MEMORY_NON_CACHEABLE);
```

<!-- source EN p27 unit 302 -->

### rknn_destroy_mem

<!-- source EN p27 unit 303 -->

The rknn_destroy_mem function destroys the rknn_tensor_mem structure. However, the memory allocated by the user needs to be released manually.

<!-- source EN p27 unit 304 -->

| API | rknn_destroy_mem |
| --- | --- |
| Description | Destroy rknn_tensor_mem structure. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | rknn_tensor_mem*: The tensor memory information structure pointer. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p27 unit 305 -->

Sample Code:

<!-- source EN p27 unit 306 -->

```c
rknn_tensor_mem* input_mems [1];
int ret = rknn_destroy_mem(ctx, input_mems[0]);
```

<!-- source EN p27 unit 307 -->

### rknn_set_weight_mem

<!-- source EN p27 unit 308 -->

If the user has allocated memory for the network weights, after initializing the corresponding rknn_tensor_mem structure, the NPU can use the memory through the rknn_set_weight_mem function. This function must be called before calling rknn_run.

<!-- source EN p27 unit 309 -->

| API | rknn_set_weight_mem |
| --- | --- |
| Description | Set up the rknn_tensor_mem structure containing weights memory information. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | rknn_tensor_mem*: The tensor memory information structure pointer. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p27 unit 310 -->

Sample Code:

<!-- source EN p27 unit 311 -->

```c
rknn_tensor_mem* weight_mems [1];
int ret = rknn_set_weight_mem(ctx, weight_mems[0]);
```

<!-- source EN p27 unit 312 -->

### rknn_set_internal_mem

<!-- source EN p27 unit 313 -->

If the user has allocated memory for the internal tensor in network, after initializing the corresponding rknn_tensor_mem structure, the NPU can use the memory through the rknn_set_internal_mem function. This function must be called before calling rknn_run.

<!-- source EN p27 unit 314 -->

| API | rknn_set_internal_mem |
| --- | --- |
| Description | Set up the rknn_tensor_mem structure containing internal tensor memory information in network. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | rknn_tensor_mem*: The pointer to the tensor memory information structure. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p27 unit 315 -->

Sample Code:

<!-- source EN p27 unit 316 -->

```c
rknn_tensor_mem* internal_tensor_mems [1];
int ret = rknn_set_internal_mem(ctx, internal_tensor_mems[0]);
```

<!-- source EN p28 unit 317 -->

### rknn_set_io_mem

<!-- source EN p28 unit 318 -->

If the user has allocated memory for the input/output tensor in the network, after initializing the corresponding rknn_tensor_mem structure, the NPU can use the memory through the rknn_set_io_mem function. This function must be called before calling rknn_run. This interface belongs to the zero-copy API. The input/output tensor memory can be allocated by the runtime (via rknn_create_mem) or externally (via rknn_create_mem_from_fd/rknn_create_mem_from_phys). Similar to rknn_init, rknn_set_io_mem only needs to be called once at the beginning, after which rknn_run can be called repeatedly.

<!-- source EN p28 unit 319 -->

| API | rknn_set_io_mem |
| --- | --- |
| Description | Set up the rknn_tensor_mem structure containing input/output tensor memory information in network. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | rknn_tensor_mem*: The pointer to the tensor memory information structure . |
| Parameter | rknn_tensor_attr *: The attribute of input or output tensor buffer. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p28 unit 320 -->

Usage notes:

<!-- source EN p28 unit 321 -->

1. The rknn_tensor_attr passed in should be obtained by the rknn_query interface. For the zero-copy API, input/output attributes should be queried with RKNN_QUERY_NATIVE_INPUT_ATTR/RKNN_QUERY_NATIVE_OUTPUT_ATTR (not RKNN_QUERY_INPUT_ATTR/RKNN_QUERY_OUTPUT_ATTR) to obtain the layout and type that are most efficient for the NPU hardware.

<!-- source EN p28 unit 322 -->

2. When creating input/output memory, if the queried layout and type do not need to be modified, allocate the memory size directly by size_with_stride; if the layout and type are modified, allocate by the modified size (for example, when the output data type is changed from int8 to float32, the size must be changed to four times the original size, i.e. n_elems * sizeof(float)).

<!-- source EN p28 unit 323 -->

3. The input data must be arranged according to the queried or modified layout. For example, when the input layout is NHWC, arrange it as NHWC; when pass_through=1, the width may need to be aligned by w_stride.

<!-- source EN p28 unit 324 -->

4. After inference, read the output memory information from the rknn_tensor_mem structure; for externally allocated memory, the cache must also be flushed via the interface associated with the allocated memory type.

<!-- source EN p28 unit 325 -->

Sample Code:

<!-- source EN p29 unit 326 -->

```c
// Zero-copy API: query native attributes -> modify type/layout -> allocate memory -> set input/output memory
rknn_tensor_attr input_attrs[1], output_attrs[1];
rknn_tensor_mem* input_mems[1];
rknn_tensor_mem* output_mems[1];

memset(input_attrs, 0, sizeof(input_attrs));
input_attrs[0].index = 0;
rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[0]), sizeof(rknn_tensor_attr));
// The default input type is int8 (normalize and quantize need to be computed outside);
// if uint8 is set, normalize and quantize will be fused into the NPU
input_attrs[0].type = RKNN_TENSOR_UINT8;
// The default fmt is NHWC, and the NPU only supports NHWC input in zero-copy mode
input_attrs[0].fmt = RKNN_TENSOR_NHWC;
input_mems[0] = rknn_create_mem(ctx, input_attrs[0].size_with_stride);
// Copy input data to input_mems[0]->virt_addr ...

memset(output_attrs, 0, sizeof(output_attrs));
output_attrs[0].index = 0;
rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR, &(output_attrs[0]), sizeof(rknn_tensor_attr));
// The default output type depends on the model; float32 is required here to compute top5
output_attrs[0].type = RKNN_TENSOR_FLOAT32;
output_mems[0] = rknn_create_mem(ctx, output_attrs[0].n_elems * sizeof(float));

// Set input/output memory
ret = rknn_set_io_mem(ctx, input_mems[0], &input_attrs[0]);
ret = rknn_set_io_mem(ctx, output_mems[0], &output_attrs[0]);

// Run inference
ret = rknn_run(ctx, NULL);
// Read the output result from output_mems[0]->virt_addr ...
```

<!-- source EN p29 unit 327 -->

### rknn_mem_sync

<!-- source EN p29 unit 328 -->

The memory created by the rknn_create_mem function has the cacheable flag by default. For the memory created with the cacheable flag, when it is used by the CPU and NPU at the same time, the cache behavior will cause data consistency problems. This interface is used to synchronize a memory created with the cacheable flag to ensure that the data accessed by the CPU and NPU in this memory is consistent.

<!-- source EN p29 unit 329 -->

| API | rknn_mem_sync |
| --- | --- |
| Description | Synchronize CPU cache and DDR data. |
| Parameter | rknn_context context: rknn_context object. |
| Parameter | rknn_tensor_mem* mem: tensor memory information structure pointer. |
| Parameter | rknn_mem_sync_mode mode: Indicates the mode for refreshing CPU cache and DDR data.<br>RKNN_MEMORY_SYNC_TO_DEVICE: Indicates that the CPU cache data is synchronized to the DDR. This mode<br>is usually used to write the data in the cache back to the DDR before the NPU accesses the same memory after<br>the CPU writes to the memory.<br>RKNN_MEMORY_SYNC_FROM_DEVICE: Indicates that DDR data is synchronized to the CPU cache. It is usually<br>used after the NPU writes to the memory. Use this mode to make the cache data invalid the next time the CPU<br>accesses the same memory, and the CPU re-reads the data from the DDR.<br>RKNN_MEMORY_SYNC_BIDIRECTIONAL: Indicates that the CPU cache data is synchronized to the DDR and<br>the CPU re-reads the data from the DDR. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p29 unit 330 -->

Sample Code:

<!-- source EN p29 unit 331 -->

```c
ret =rknn_mem_sync(ctx, &outputs[0].mem,
RKNN_MEMORY_SYNC_FROM_DEVICE);
if (ret < 0) {
   fprintf(stderr, " rknn_mem_sync error! ret=%d\n", ret);
   return -1;
}
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
