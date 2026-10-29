---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 张量、内存分配与同步"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-tensor-memory"
slug: "rknn-v250-runtime-api-tensor-memory"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 张量、内存分配与同步 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 张量、内存分配与同步 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-tensor-memory/"
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

<!-- source CN p24 unit 256 -->

### 5.4. 张量和内存

<!-- source CN p24 unit 257 -->

tensor 内存分配、释放、同步及用戶自定义内存设置。

<!-- source CN p24 unit 258 -->

### rknn_create_mem_from_phys

<!-- source CN p24 unit 259 -->

当用戶需要自己分配内存让NPU使用时,通过rknn_create_mem_from_phys函数可以创建一个rknn_tensor_mem结构体并得到它的指针,该函数通过传入物理地址、虚拟地址以及大小,外部内存相关的信息会赋值给rknn_tensor_mem结构体。

<!-- source CN p24 unit 260 -->

| API | rknn_create_mem_from_phys |
| --- | --- |
| 功能 | 通过物理地址创建rknn_tensor_mem结构体并分配内存。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | uint64_t phys_addr:内存的物理地址。 |
| 参数 | void *virt_addr:内存的虚拟地址。 |
| 参数 | uint32_t size:内存的大小。 |
| 返回值 | rknn_tensor_mem*: tensor内存信息结构体指针。 |

<!-- source CN p25 unit 262 -->

示例代码如下:

<!-- source CN p25 unit 263 -->

```c
//suppose we have got buffer information as input_phys, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_phys(ctx, input_phys, input_virt, size);
```

<!-- source CN p25 unit 264 -->

### rknn_create_mem_from_fd

<!-- source CN p25 unit 265 -->

当用戶要自己分配内存让NPU使用时,rknn_create_mem_from_fd函数可以创建一个rknn_tensor_mem结构体并得到它的指针,该函数通过传入文件描述符fd、偏移、虚拟地址以及大小,外部内存相关的信息会赋值给rknn_tensor_mem结构体。

<!-- source CN p25 unit 266 -->

| API | rknn_create_mem_from_fd |
| --- | --- |
| 功能 | 通过文件描述符创建rknn_tensor_mem结构体。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | int32_t fd:内存的文件描述符。 |
| 参数 | void virt_addr:内存的虚拟地址,fd对应的内存的首地址*。 |
| 参数 | uint32_t size:内存的大小。 |
| 参数 | int32_t offset:内存相对于文件描述符和虚拟地址的偏移量。 |
| 返回值 | rknn_tensor_mem*: tensor内存信息结构体指针。 |

<!-- tensor-memory-source-difference:start -->

**原稿差异说明：**中文 PDF 第 25 页将该参数写成 `void virt_addr`，星号 `*` 位于说明句末；英文 PDF 第 26 页写为 `void *virt_addr`。上表保留对应语言原稿写法。这是原稿中的类型标注差异，不是已验证的接口定义；使用时请核对实际 V2.5.0 SDK 的头文件声明。

<!-- tensor-memory-source-difference:end -->

<!-- source CN p25 unit 267 -->

示例代码如下:

<!-- source CN p25 unit 268 -->

```c
//suppose we have got buffer information as input_fd, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_fd(ctx, input_fd, input_virt, size, 0);
```

<!-- source CN p25 unit 269 -->

### rknn_create_mem

<!-- source CN p25 unit 270 -->

当用戶要NPU内部分配内存时,rknn_create_mem函数可以分配用戶指定的内存大小,并返回一个rknn_tensor_mem结构体。

<!-- source CN p25 unit 271 -->

| API | rknn_create_mem |
| --- | --- |
| 功能 | 创建rknn_tensor_mem结构体并分配内存。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | uint32_t size:内存的大小。 |
| 返回值 | rknn_tensor_mem*: tensor内存信息结构体指针。 |

<!-- source CN p25 unit 272 -->

示例代码如下:

<!-- source CN p25 unit 273 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem(ctx, size);
```

<!-- source CN p25 unit 274 -->

rknn_create_mem2

<!-- source CN p25 unit 275 -->

当用戶要NPU内部分配内存时,rknn_create_mem2函数可以分配用戶指定的内存大小及内存类型,并返回一个rknn_tensor_mem结构体。

<!-- source CN p26 unit 276 -->

| API | rknn_create_mem2 |
| --- | --- |
| 功能 | 创建rknn_tensor_mem结构体并分配内存。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | uint64_t size:内存的大小。 |
| 参数 | uint64_t alloc_flags: 控制内存是否cacheable的。 RKNN_FLAG_MEMORY_CACHEABLE:创建cacheable内存<br>RKNN_FLAG_MEMORY_NON_CACHEABLE: 创建non -cacheable内存 RKNN_FLAG_MEMORY_FLAGS_DEFAULT:同<br>RKNN_FLAG_MEMORY_CACHEABLE RKNN_FLAG_MEMORY_TRY_ALLOC_SRAM:尽可能在SRAM中分配内存,若SRAM不<br>足,剩余内存在DRAM中分配 |
| 返回值 | rknn_tensor_mem*: tensor内存信息结构体指针。 |

<!-- source CN p26 unit 277 -->

rknn_create_mem2与rknn_create_mem的主要区别是rknn_create_mem2带了一个alloc_flags,可以指定分配的内存是否cacheable的,而rknn_create_mem不能指定,默认就是cacheable。

<!-- source CN p26 unit 278 -->

示例代码如下:

<!-- source CN p26 unit 279 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem2(ctx, size, RKNN_FLAG_MEMORY_NON_CACHEABLE);
```

<!-- source CN p26 unit 280 -->

### rknn_destroy_mem

<!-- source CN p26 unit 281 -->

rknn_destroy_mem函数会销毁rknn_tensor_mem结构体,用戶分配的内存需要自行释放。

<!-- source CN p26 unit 282 -->

| API | rknn_destroy_mem |
| --- | --- |
| 功能 | 销毁rknn_tensor_mem结构体。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | rknn_tensor_mem*:tensor内存信息结构体指针。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p26 unit 283 -->

示例代码如下:

<!-- source CN p26 unit 284 -->

```c
rknn_tensor_mem* input_mems [1];
int ret = rknn_destroy_mem(ctx, input_mems[0]);
```

<!-- source CN p26 unit 285 -->

### rknn_set_weight_mem

<!-- source CN p26 unit 286 -->

如果用戶自己为网络权重分配内存,初始化相应的rknn_tensor_mem结构体后,在调用rknn_run前,通过rknn_set_weight_mem函数可以让NPU使用该内存。

<!-- source CN p26 unit 287 -->

| API | rknn_set_weight_mem |
| --- | --- |
| 功能 | 设置包含权重内存信息的rknn_tensor_mem结构体。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | rknn_tensor_mem*:权重tensor内存信息结构体指针。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p26 unit 288 -->

示例代码如下:

<!-- source CN p26 unit 289 -->

```c
rknn_tensor_mem* weight_mems [1];
int ret = rknn_set_weight_mem(ctx, weight_mems[0]);
```

<!-- source CN p26 unit 290 -->

### rknn_set_internal_mem

<!-- source CN p26 unit 291 -->

如果用戶自己为网络中间tensor分配内存,初始化相应的rknn_tensor_mem结构体后,在调用rknn_run前,通过rknn_set_internal_mem函数可以让NPU使用该内存。

<!-- source CN p27 unit 292 -->

| API | rknn_set_internal_mem |
| --- | --- |
| 功能 | 设置包含中间tensor内存信息的rknn_tensor_mem结构体。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | rknn_tensor_mem*:模型中间tensor内存信息结构体指针。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p27 unit 293 -->

示例代码如下:

<!-- source CN p27 unit 294 -->

```c
rknn_tensor_mem* internal_tensor_mems [1];
int ret = rknn_set_internal_mem(ctx, internal_tensor_mems[0]);
```

<!-- source CN p27 unit 295 -->

### rknn_set_io_mem

<!-- source CN p27 unit 296 -->

如果用户自己为网络输入/输出 tensor 分配内存，初始化相应的 rknn_tensor_mem 结构体后，在调用 rknn_run 前，通过 rknn_set_io_mem 函数可以让 NPU 使用该内存。该接口属于零拷贝 API，输入/输出 tensor 的内存可以是运行时分配的（通过 rknn_create_mem），也可以是外部分配的（通过 rknn_create_mem_from_fd / rknn_create_mem_from_phys）。与 rknn_init 类似，rknn_set_io_mem 只需在开始调用一次，之后反复调用 rknn_run 即可。

<!-- source CN p27 unit 298 -->

| API | rknn_set_io_mem |
| --- | --- |
| 功能 | 设置包含模型输入/输出内存信息的rknn_tensor_mem结构体。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | rknn_tensor_mem*:输入/输出tensor内存信息结构体指针。 |
| 参数 | rknn_tensor_attr *: 输入/输出tensor的属性。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p27 unit 299 -->

使用说明:

<!-- source CN p27 unit 300 -->

1. 传入的 rknn_tensor_attr 应使用 rknn_query 接口查询得到。零拷贝 API 的输入/输出属性应使用 RKNN_QUERY_NATIVE_INPUT_ATTR / RKNN_QUERY_NATIVE_OUTPUT_ATTR 查询（而非 RKNN_QUERY_INPUT_ATTR / RKNN_QUERY_OUTPUT_ATTR），以获得 NPU 硬件效率最优的 layout 和 type。

<!-- source CN p27 unit 302 -->

2. 创建输入/输出内存时,若无需修改查询得到的layout和type,直接按size_with_stride分配内存大小;若修改了layout和type,则需按修改后的size分配(例如输出数据类型由int8修改为float32时,size需改为原size的四倍,即n_elems *sizeof(float))。

<!-- source CN p27 unit 303 -->

3. 输入数据需按照查询或修改后的layout排列,例如输入layout为NHWC时按NHWC排列;当pass_through=1时,width可能需按w_stride做对⻬。

<!-- source CN p27 unit 304 -->

4. 推理完成后从rknn_tensor_mem结构体读取输出内存信息;外部分配的内存还需调用与分配内存类型关联的接口刷新输出缓存。

<!-- source CN p27 unit 305 -->

示例代码如下:

<!-- source CN p28 unit 306 -->

```c
// 零拷⻉API:查询原生属性 -> 修改类型/布局 -> 分配内存 -> 设置输入/输出内存
rknn_tensor_attr input_attrs[1], output_attrs[1];
rknn_tensor_mem* input_mems[1];
rknn_tensor_mem* output_mems[1];

memset(input_attrs, 0, sizeof(input_attrs));
input_attrs[0].index = 0;
rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[0]), sizeof(rknn_tensor_attr));
// 默认输入类型为 int8(归一化和量化需在外部计算);
// 设置为 uint8 时,会将归一化和量化融合到 NPU 上执行
input_attrs[0].type = RKNN_TENSOR_UINT8;
// 默认 fmt 为 NHWC,零拷⻉模式下 NPU 仅支持 NHWC 输入
input_attrs[0].fmt = RKNN_TENSOR_NHWC;
input_mems[0] = rknn_create_mem(ctx, input_attrs[0].size_with_stride);
// 将输入数据拷⻉到 input_mems[0]->virt_addr ...

memset(output_attrs, 0, sizeof(output_attrs));
output_attrs[0].index = 0;
rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR, &(output_attrs[0]), sizeof(rknn_tensor_attr));
// 默认输出类型取决于模型,这里需要 float32 用于计算 top5
output_attrs[0].type = RKNN_TENSOR_FLOAT32;
output_mems[0] = rknn_create_mem(ctx, output_attrs[0].n_elems * sizeof(float));

// 设置输入/输出内存
ret = rknn_set_io_mem(ctx, input_mems[0], &input_attrs[0]);
ret = rknn_set_io_mem(ctx, output_mems[0], &output_attrs[0]);

// 推理
ret = rknn_run(ctx, NULL);
// 从 output_mems[0]->virt_addr 读取输出结果 ...
```

<!-- source CN p28 unit 307 -->

### rknn_mem_sync

<!-- source CN p28 unit 308 -->

rknn_create_mem函数创建的内存默认是带cacheable标志的,对于带cacheable标志创建的内存,在被CPU和NPU同时使用时,由于cache行为会导致数据一致性问题。该接口用于同步一块带cacheable标志创建的内存,保证CPU和NPU访问这块内存的数据是一致的。

<!-- source CN p28 unit 309 -->

| API | rknn_mem_sync |
| --- | --- |
| 功能 | 同步CPU cache和DDR数据。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | rknn_tensor_mem* mem:tensor内存信息结构体指针。 |
| 参数 | rknn_mem_sync_mode mode: 表示刷新CPU cache和DDR数据的模式。<br>RKNN_MEMORY_SYNC_TO_DEVICE:表示CPU cache数据同步到DDR中,通常用于CPU写入内存后,NPU访问相同内存前<br>使用该模式将cache中的数据写回DDR。<br>RKNN_MEMORY_SYNC_FROM_DEVICE:表示DDR数据同步到CPU cache,通常用于NPU写入内存后,使用该模式让下次<br>CPU访问相同内存时,cache数据无效,CPU从DDR重新读取数据。<br>RKNN_MEMORY_SYNC_BIDIRECTIONAL:表示CPU cache数据同步到DDR同时令CPU 重新从DDR读取数据。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p28 unit 310 -->

示例代码如下:

<!-- source CN p28 unit 311 -->

```c
ret =rknn_mem_sync(ctx, &outputs[0].mem,
RKNN_MEMORY_SYNC_FROM_DEVICE);
if (ret < 0) {
   fprintf(stderr, " rknn_mem_sync error! ret=%d\n", ret);
   return -1;
}
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
