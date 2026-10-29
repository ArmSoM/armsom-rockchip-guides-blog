---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 矩阵乘法接口与动态形状"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-matmul"
slug: "rknn-v250-runtime-api-matmul"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 矩阵乘法接口与动态形状 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 矩阵乘法接口与动态形状 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-matmul/"
---

## 平台参考与来源

本文依据 RKNN V2.5.0 原厂 PDF 整理。适用于原文列出的芯片和接口；ArmSoM 板卡须先核对 SoC、NPU 驱动、Toolkit/Runtime、SDK/BSP 和内核版本。尚未进行 ArmSoM 硬件验证，原文示例及测量值不是 ArmSoM 实测。

## 系列导航

- [平台支持、头文件与编译链接](/zh/articles/rknn-v250-runtime-api-overview-linking/)
- [内存所有权与通用、零拷贝流程](/zh/articles/rknn-v250-runtime-api-conventions-zero-copy/)
- [设备、上下文与初始化标志](/zh/articles/rknn-v250-runtime-api-device-context/)
- [模型、张量与动态形状查询](/zh/articles/rknn-v250-runtime-api-query/)
- [输入、执行、输出与动态形状设置](/zh/articles/rknn-v250-runtime-api-inference/)
- [张量、内存分配与同步](/zh/articles/rknn-v250-runtime-api-tensor-memory/)
- [矩阵乘法接口与动态形状](/zh/articles/rknn-v250-runtime-api-matmul/)
- [自定义算子注册与属性](/zh/articles/rknn-v250-runtime-api-custom-operators/)
- [状态码、张量、内存与扩展结构](/zh/articles/rknn-v250-runtime-api-types-common/)
- [矩阵乘法数据结构](/zh/articles/rknn-v250-runtime-api-types-matmul/)
- [自定义算子结构与废弃 API 迁移](/zh/articles/rknn-v250-runtime-api-types-custom-migration/)

{% raw %}

<!-- source CN p28 unit 312 -->

### 5.5. 矩阵乘法

<!-- source CN p28 unit 313 -->

矩阵乘法上下文的创建、内存设置、量化参数及运行。

<!-- source CN p28 unit 314 -->

### rknn_matmul_create

<!-- source CN p29 unit 315 -->

该函数的功能是根据传入的矩阵乘法规格等信息,完成矩阵乘法上下文的初始化,并返回输入和输出tensor的形状、大小和数据类型等信息。

<!-- source CN p29 unit 316 -->

| API | rknn_matmul_create |
| --- | --- |
| 功能 | 初始化矩阵乘法上下文。 |
| 参数 | rknn_matmul_ctx* ctx:矩阵乘法上下文指针。 |
| 参数 | rknn_matmul_info* info:矩阵乘法的规格信息结构体指针。 |
| 参数 | rknn_matmul_io_attr* io_attr:矩阵乘法输入和输出tensor属性结构体指针。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p29 unit 317 -->

示例代码如下:

<!-- source CN p29 unit 318 -->

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

<!-- source CN p29 unit 319 -->

### rknn_matmul_set_io_mem

<!-- source CN p29 unit 320 -->

该函数用于设置矩阵乘法运算的输入/输出内存。在调用该函数前,先使用rknn_create_mem接口创建的rknn_tensor_mem结构体指针,接着将其与rknn_matmul_create函数返回的矩阵A、B或C的rknn_matmul_tensor_attr结构体指针传入该函数,把输入和输出内存设置到矩阵乘法上下文中。在调用该函数前,要根据rknn_matmul_info中配置的内存排布准备好矩阵A和矩阵B的数据。

<!-- source CN p29 unit 321 -->

| API | rknn_matmul_set_io_mem |
| --- | --- |
| 功能 | 设置矩阵乘法的输入/输出内存。 |
| 参数 | rknn_matmul_ctx ctx:矩阵乘法上下文。 |
| 参数 | rknn_tensor_mem* mem:tensor内存信息结构体指针。 |
| 参数 | rknn_matmul_tensor_attr* attr:矩阵乘法输入和输出tensor属性结构体指针。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p29 unit 322 -->

示例代码如下:

<!-- source CN p30 unit 323 -->

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

<!-- source CN p30 unit 324 -->

### rknn_matmul_set_core_mask

<!-- source CN p30 unit 325 -->

该函数用于设置矩阵乘法运算时可用的NPU核心(仅支持RK3588和RK3576平台)。在调用该函数前,需要先通过rknn_matmul_create函数初始化矩阵乘法上下文。可通过该函数设置的掩码值,指定需要使用的核心,以提高矩阵乘法运算的性能和效率。

<!-- source CN p30 unit 326 -->

| API | rknn_matmul_set_core_mask |
| --- | --- |
| 功能 | 设置矩阵乘法运算的NPU核心掩码。 |
| 参数 | rknn_matmul_ctx ctx:矩阵乘法上下文。 |
| 参数 | rknn_core_mask core_mask:矩阵乘法运算的NPU核心掩码值,用于指定可用的NPU核心。掩码的每一位代表一个核心,如果对<br>应位为1,则表示该核心可用;否则,表示该核心不可用(详细掩码说明⻅rknn_set_core_mask API参数)。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p30 unit 327 -->

示例代码如下:

<!-- source CN p30 unit 328 -->

```c
rknn_matmul_set_core_mask(ctx, RKNN_NPU_CORE_AUTO);
```

<!-- source CN p30 unit 329 -->

### rknn_matmul_set_quant_params

<!-- source CN p30 unit 330 -->

rknn_matmul_set_quant_params用于设置每个矩阵的量化参数,支持Per-Channel量化、Per-Layer量化和Per-Group量化方式的量化参数设置。当使用Per-Group量化时,rknn_quant_params中的scale和zp数组的⻓度等于N*K/group_size。当使用Per-Channel量化时,rknn_quant_params中的scale和zp数组的⻓度等于N。当使用Per-Layer量化时,rknn_quant_params中的scale和zp数组的⻓度为1。在rknn_matmul_run之前调用此接口设置所有矩阵的量化参数。如果不调用此接口,则默认量化方式为Per-Layer量化,scale=1.0,zero_point=0。

<!-- source CN p30 unit 331 -->

| API | rknn_matmul_set_quant_params |
| --- | --- |
| 功能 | 设置矩阵的量化参数。 |
| 参数 | rknn_matmul_ctx ctx:矩阵乘法上下文。 |
| 参数 | rknn_quant_params* params: 矩阵的量化参数信息。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p30 unit 332 -->

示例代码如下:

<!-- source CN p31 unit 333 -->

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

<!-- source CN p31 unit 334 -->

### rknn_matmul_get_quant_params

<!-- source CN p31 unit 335 -->

rknn_matmul_get_quant_params用于rknn_matmul_type类型等于RKNN_INT8_MM_INT8_TO_INT32并且Per-Channel量化方式时,获取矩阵B所有通道scale归一化后的scale值,获取的scale值和A的原始scale值相乘可以得到C的scale值。可以用于在矩阵C没有真实scale时,近似计算得到C的scale。

<!-- source CN p31 unit 336 -->

| API | rknn_matmul_get_quant_params |
| --- | --- |
| 功能 | 获取矩阵B的量化参数。 |
| 参数 | rknn_matmul_ctx ctx:矩阵乘法上下文。 |
| 参数 | rknn_quant_params* params: 矩阵B的量化参数信息。 |
| 参数 | float* scale: 矩阵B的scale指针。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p31 unit 337 -->

示例代码如下:

<!-- source CN p31 unit 338 -->

```c
float b_scale;
rknn_matmul_get_quant_params(ctx, &params_b, &b_scale);
```

<!-- source CN p31 unit 339 -->

rknn_matmul_create_dyn_shape(deprecated)

<!-- source CN p31 unit 340 -->

该接口已废弃,改用rknn_matmul_create_dynamic_shape接口。

<!-- source CN p31 unit 341 -->

### rknn_matmul_create_dynamic_shape

<!-- source CN p31 unit 342 -->

rknn_matmul_create_dynamic_shape用于创建动态shape矩阵乘法上下文,该接口需要传入rknn_matmul_info结构体、shape数量以及对应的shape数组,shape数组会记录多个M、K和N值。在初始化成功后,会得到rknn_matmul_io_attr的数组,数组中包含了所有的输入输出矩阵的shape、大小和数据类型等信息。目前支持设置多个不同的M,K和N。

<!-- source CN p31 unit 343 -->

| API | rknn_matmul_create_dynamic_shape |
| --- | --- |
| 功能 | 初始化动态shape矩阵乘法的上下文。 |
| 参数 | rknn_matmul_ctx *ctx:矩阵乘法上下文指针。 |
| 参数 | rknn_matmul_info* info:矩阵乘法的规格信息结构体指针。其中M、K和N不需要设置。 |
| 参数 | int shape_num:矩阵上下文支持的shape数量。 |
| 参数 | rknn_matmul_shape dynamic_shapes[]:矩阵上下文支持的shape数组。 |
| 参数 | rknn_matmul_io_attr io_attrs[]:矩阵乘法输入和输出tensor属性结构体数组。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p31 unit 344 -->

示例代码如下:

<!-- source CN p32 unit 345 -->

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

<!-- source CN p32 unit 346 -->

### rknn_matmul_set_dynamic_shape

<!-- source CN p32 unit 347 -->

rknn_matmul_set_dynamic_shape用于指定矩阵乘法使用的某一个shape。在创建动态shape的矩阵乘法上下文后,选取其中一个rknn_matmul_shape结构体作为输入参数,调用此接口设置运算使用的shape。

<!-- source CN p32 unit 348 -->

| API | rknn_matmul_set_dynamic_shape |
| --- | --- |
| 功能 | 设置矩阵乘法shape。 |
| 参数 | rknn_matmul_ctx ctx:矩阵乘法上下文。 |
| 参数 | rknn_matmul_shape* shape:指定矩阵乘法使用的shape。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p32 unit 349 -->

示例代码如下:

<!-- source CN p32 unit 350 -->

```c
ret = rknn_matmul_set_dynamic_shape(ctx, &shapes[0]);
if (ret != 0) {
  fprintf(stderr, "rknn_matmul_set_dynamic_shapes fail!\n");
  return -1;
}
```

<!-- source CN p32 unit 351 -->

rknn_B_normal_layout_to_native_layout

<!-- source CN p32 unit 352 -->

rknn_B_normal_layout_to_native_layout用于将矩阵B的原始形状排列的数据(KxN)转换为高性能数据排列方式的数据。

<!-- source CN p32 unit 353 -->

| API | rknn_B_normal_layout_to_native_layout |
| --- | --- |
| 功能 | 将矩阵B的数据排列从原始形状转换成高性能形状。 |
| 参数 | void* B_input:原始形状的矩阵B数据指针。 |
| 参数 | void* B_output:高性能形状的矩阵B数据指针。 |
| 参数 | int K:矩阵B的行数。 |
| 参数 | int N:矩阵B的列数。 |
| 参数 | int subN:等于rknn_matmul_io_attr结构体中的B.dims[2]。 |
| 参数 | int subK:等于rknn_matmul_io_attr结构体中的B.dims[3]。 |
| 参数 | rknn_matmul_info* info:矩阵乘法的规格信息结构体指针。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p32 unit 354 -->

示例代码如下:

<!-- source CN p32 unit 355 -->

```c
int32_t subN = io_attr.B.dims[2];
int32_t subK = io_attr.B.dims[3];
rknn_B_normal_layout_to_native_layout(B_Matrix, B->virt_addr, K, N, subN, subK, &info);
```

<!-- source CN p33 unit 356 -->

### rknn_matmul_run

<!-- source CN p33 unit 357 -->

该函数用于运行矩阵乘法运算,并将结果保存在输出矩阵C中。在调用该函数前,输入矩阵A和B需要先准备好数据,并通过rknn_matmul_set_io_mem函数设置到输入缓冲区。输出矩阵C需要先通过rknn_matmul_set_io_mem函数设置到输出缓冲区,而输出矩阵的tensor属性则通过rknn_matmul_create函数获取。

<!-- source CN p33 unit 358 -->

| API | rknn_matmul_run |
| --- | --- |
| 功能 | 运行矩阵乘法运算。 |
| 参数 | rknn_matmul_ctx ctx:矩阵乘法上下文。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p33 unit 359 -->

示例代码如下:

<!-- source CN p33 unit 360 -->

```c
int ret = rknn_matmul_run(ctx);
```

<!-- source CN p33 unit 361 -->

### rknn_matmul_destroy

<!-- source CN p33 unit 362 -->

该函数用于销毁矩阵乘法运算上下文,释放相关资源。在使用完rknn_matmul_create函数创建的矩阵乘法上下文指针后,需要调用该函数进行销毁。

<!-- source CN p33 unit 363 -->

| API | rknn_matmul_destroy |
| --- | --- |
| 功能 | 销毁矩阵乘法运算上下文。 |
| 参数 | rknn_matmul_ctx ctx:矩阵乘法上下文。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p33 unit 364 -->

示例代码如下:

<!-- source CN p33 unit 365 -->

```c
int ret = rknn_matmul_destroy(ctx);
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
