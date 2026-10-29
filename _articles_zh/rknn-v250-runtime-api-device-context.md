---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 设备、上下文与初始化标志"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-device-context"
slug: "rknn-v250-runtime-api-device-context"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 设备、上下文与初始化标志 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 设备、上下文与初始化标志 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-device-context/"
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

<!-- source CN p14 unit 88 -->

## 5. 函数参考

<!-- source CN p14 unit 89 -->

API 函数

<!-- source CN p14 unit 90 -->

RKNN C API 按功能归类如下:

<!-- source CN p14 unit 91 -->

| 分类 | 说明 |
| --- | --- |
| 5.1. 设备与上下文 | 运行时上下文的初始化与销毁、NPU核心配置。 |
| 5.2. 查询 | 查询模型属性、SDK版本、内存占用等信息。 |
| 5.3. 推理执行 | 设置输入、执行推理、获取输出及动态形状设置。 |
| 5.4. 张量和内存 | tensor 内存分配、释放、同步及用戶自定义内存设置。 |
| 5.5. 矩阵乘法 | 矩阵乘法上下文的创建、内存设置、量化参数及运行。 |
| 5.6. 自定义算子 | 自定义算子注册与算子属性获取。 |

<!-- source CN p14 unit 92 -->

### 5.1. 设备与上下文

<!-- source CN p14 unit 93 -->

运行时上下文的初始化与销毁、NPU核心配置。

<!-- source CN p14 unit 94 -->

### rknn_init

<!-- source CN p14 unit 95 -->

rknn_init初始化函数功能为创建rknn_context对象、加载RKNN模型以及根据flag和rknn_init_extend结构体执行特定的初始化行为。

<!-- source CN p14 unit 96 -->

| API | rknn_init |
| --- | --- |
| 功能 | 初始化rknn上下文。 |
| 参数 | rknn_context *context:rknn_context指针。 |
| 参数 | void *model:RKNN模型的二进制数据或者RKNN模型路径。当参数size大于0时,model表示二进制数据;当参数size等于0时,<br>model表示RKNN模型路径。 |
| 参数 | uint32_t size:当model是二进制数据,表示模型大小,当model是路径,则设置为0。 |
| 参数 | uint32_t flag:初始化标志,默认初始化行为需要设置为0。 |
| 参数 | rknn_init_extend:特定初始化时的扩展信息。没有使用,传入NULL即可。如果需要共享模型weight内存,则需要传入另个模型<br>rknn_context指针。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p14 unit 97 -->

示例代码如下:

<!-- source CN p14 unit 98 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
```

<!-- source CN p14 unit 99 -->

各个初始化标志说明如下:

<!-- source CN p14 unit 100 -->

RKNN_FLAG_COLLECT_PERF_MASK:用于运行时查询网络各层时间;

<!-- source CN p14 unit 101 -->

RKNN_FLAG_MEM_ALLOC_OUTSIDE:用于表示模型输入、输出、权重、中间tensor内存全部由用戶分配,它主要有两方面的作用:

<!-- source CN p14 unit 102 -->

1. 所有内存均是用戶自行分配,便于对整个系统内存进行统筹安排。

<!-- source CN p14 unit 103 -->

2. 用于内存复用,特别是针对RV1103/RV1106/RV1103B/RV1106B/RK2118这种内存极为紧张的情况。

<!-- source CN p14 unit 104 -->

假设有模型A、B 两个模型,这两个模型在设计上串行运行的,那么这两个模型的中间tensor的内存就可以复用。示例代码如下:

<!-- source CN p15 unit 105 -->

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

<!-- source CN p15 unit 106 -->

RKNN_FLAG_SHARE_WEIGHT_MEM:用于共享另一个模型的weight权重。主要用于模拟不定⻓度模型输入(RKNPU运行时库版本大于等于1.5.0后该功能被动态shape功能替代)。比如对于某些语音模型,输入⻓度不定,但由于NPU无法支持不定⻓输入,因此需要生成几个不同分辨率的RKNN模,其中,只有一个RKNN模型的保留完整权重,其他RKNN模型不带权重。在初始化不带权重RKNN模型时,使用该标志能让当前上下文共享完整RKNN模型的权重。假设需要分辨率A、B两个模型,则使用流程如下:

<!-- source CN p15 unit 107 -->

1. 使用RKNN-Toolkit2生成分辨率A的模型。

<!-- source CN p15 unit 108 -->

2. 使用RKNN-Toolkit2生成不带权重的分辨率B的模型,rknn.config()中,remove_weight要设置成True,主要目的是减少模型B的大小。

<!-- source CN p15 unit 109 -->

3. 在板子上,正常初始化模型A。

<!-- source CN p15 unit 110 -->

4. 通过RKNN_FLAG_SHARE_WEIGHT_MEM的flags初始化模型B。

<!-- source CN p15 unit 111 -->

5. 其他按照原来的方式使用。板端参考代码如下:

<!-- source CN p15 unit 112 -->

```c
rknn_context ctx_a, ctx_b;
rknn_init(&ctx_a, model_path_a, 0, 0, NULL);

rknn_init_extend extend;
extend.ctx = ctx_a;
rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_SHARE_WEIGHT_MEM, &extend);
```

<!-- source CN p15 unit 113 -->

RKNN_FLAG_COLLECT_MODEL_INFO_ONLY:用于初始化一个空上下文,仅用于调用rknn_query接口查询模型weight内存总大小和中间tensor总大小,无法进行推理;

<!-- source CN p15 unit 114 -->

RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE: 表示模型中间tensor由用戶分配,常用于用戶自行管理和复用多个模型之间的中间tensor内存;

<!-- source CN p15 unit 115 -->

RKNN_FLAG_EXECUTE_FALLBACK_PRIOR_DEVICE_GPU: 表示所有NPU不支持的层优先选择运行在GPU上,但并不保证运行在GPU上,实际运行的后端设备取决于运行时对该算子的支持情况;

<!-- source CN p15 unit 116 -->

RKNN_FLAG_ENABLE_SRAM: 表示中间tensor内存尽可能分配在SRAM上;

<!-- source CN p15 unit 117 -->

RKNN_FLAG_SHARE_SRAM: 用于当前上下文尝试共享另一个上下文的SRAM内存地址空间,要求当前上下文初始化时必须同时启用RKNN_FLAG_ENABLE_SRAM标志;

<!-- source CN p15 unit 118 -->

RKNN_FLAG_DISABLE_PROC_HIGH_PRIORITY: 表示当前上下文使用默认进程优先级。不设置该标志,进程nice值是-19;

<!-- source CN p15 unit 119 -->

RKNN_FLAG_DISABLE_FLUSH_INPUT_MEM_CACHE: 设置该标志后,runtime内部不主动刷新输入tensor缓存,用戶必须确保输入tensor在调用 rknn_run 之前已刷新缓存。主要用于当输入数据没有CPU访问时,减少runtime内部刷cache的耗时。

<!-- source CN p15 unit 120 -->

RKNN_FLAG_DISABLE_FLUSH_OUTPUT_MEM_CACHE: 设置该标志后,runtime不主动清除输出tensor缓存。此时用戶不能直接访问output_mem->virt_addr,这会导致缓存一致性问题。 如果用戶想使用output_mem->virt_addr,必须使用rknn_mem_sync (ctx, mem, RKNN_MEMORY_SYNC_FROM_DEVICE) 来刷新缓存。该标志一般在NPU的输出数据不被CPU访问时使用,比如输出数据由 GPU 或 RGA 访问以减少刷新缓存所需的时间。

<!-- source CN p15 unit 121 -->

RKNN_FLAG_MODEL_BUFFER_ZERO_COPY:表示rknn_init接口的传入的模型buffer是rknn_create_mem或者rknn_create_mem2接口分配的内存,runtime内部不需要拷贝一次模型buffer,减少运行时的内存占用,但需要用戶保证上下文销毁前模型内存有效,并且在销毁上下文后释放该内存。初始化上下文时,rknn_init接口的rknn_init_extend参数,其成员

<!-- source CN p16 unit 122 -->

real_model_offset、real_model_size、model_buffer_fd和model_buffer_flags根据rknn_create_mem2接口返回的rknn_tensor_mem设置。

<!-- source CN p16 unit 123 -->

RKNN_MEM_FLAG_ALLOC_NO_CONTEXT:在使用rknn_create_mem2接口分配内存时,设置该标志后,允许ctx参数是0或者NULL。从而用戶在未初始化任何一个上下文之前就能获取NPU驱动分配的内存,返回的内存结构体需使用rknn_destroy_mem接口释放,释放的接口可使用任意一个上下文作为参数。示例代码如下:

<!-- source CN p16 unit 124 -->

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

<!-- source CN p16 unit 125 -->

### rknn_set_core_mask

<!-- source CN p16 unit 126 -->

rknn_set_core_mask函数指定工作的NPU核心,该函数仅支持RK3576/RK3588平台,在单核NPU架构的平台上设置会返回错误。

<!-- source CN p16 unit 127 -->

| API | rknn_set_core_mask |
| --- | --- |
| 功能 | 设置运行的NPU核心。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | rknn_core_mask core_mask:NPU核心的枚举类型,目前有如下方式配置:<br>RKNN_NPU_CORE_AUTO:表示自动调度模型,自动运行在当前空闲的NPU核上;<br>RKNN_NPU_CORE_0:表示运行在NPU0核上;<br>RKNN_NPU_CORE_1:表示运行在NPU1核上;<br>RKNN_NPU_CORE_2:表示运行在NPU2核上;<br>RKNN_NPU_CORE_0_1:表示同时工作在NPU0、NPU1核上;<br>RKNN_NPU_CORE_0_1_2:表示同时工作在NPU0、NPU1、NPU2核上;<br>RKNN_NPU_CORE_ALL:表示工作在所有的NPU核心上 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p16 unit 128 -->

示例代码如下:

<!-- source CN p16 unit 129 -->

```c
rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

<!-- source CN p16 unit 130 -->

在RKNN_NPU_CORE_0_1及RKNN_NPU_CORE_0_1_2模式下,目前以下OP能获得更好的加速:Conv、DepthwiseConvolution、Add、Concat、Relu、Clip、Relu6、ThresholdedRelu、PRelu、LeakyRelu,其余类型OP将fallback至单核Core0中运行,部分类型OP(如Pool类、ConvTranspose等)将在后续更新版本中支持。

<!-- source CN p16 unit 131 -->

### rknn_set_batch_core_num

<!-- source CN p16 unit 132 -->

rknn_set_batch_core_num函数指定多batch RKNN模型(RKNN-Toolkit2转换时设置rknn_batch_size大于1导出的模型)的NPU核心数量,该函数仅支持RK3588/RK3576平台。

<!-- source CN p16 unit 133 -->

| API | rknn_set_batch_core_num |
| --- | --- |
| 功能 | 设置多batch RKNN模型运行的NPU核心数量。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | int core_num:指定运行的核心数量。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p17 unit 134 -->

示例代码如下:

<!-- source CN p17 unit 135 -->

```c
rknn_context ctx;
int ret = rknn_set_batch_core_num(ctx, 2);
```

<!-- source CN p17 unit 136 -->

### rknn_dup_context

<!-- source CN p17 unit 137 -->

rknn_dup_context生成一个指向同一个模型的新context,可用于多线程执行相同模型时的权重复用。RV1106/RV1103/RV1106B/RV1103B/RK2118平台暂不支持 。

<!-- source CN p17 unit 138 -->

| API | rknn_dup_context |
| --- | --- |
| 功能 | 生成同一个模型的两个ctx,复用模型的权重信息。 |
| 参数 | rknn_context * context_in:rknn_context指针。初始化后的rknn_context对象。 |
| 参数 | rknn_context * context_out:rknn_context指针。生成新的rknn_context对象。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p17 unit 139 -->

示例代码如下:

<!-- source CN p17 unit 140 -->

```c
rknn_context ctx_in;
rknn_context ctx_out;
int ret = rknn_dup_context(&ctx_in, &ctx_out);
```

<!-- source CN p17 unit 141 -->

### rknn_destroy

<!-- source CN p17 unit 142 -->

rknn_destroy函数将释放传入的rknn_context及其相关资源。

<!-- source CN p17 unit 143 -->

| API | rknn_destroy |
| --- | --- |
| 功能 | 销毁rknn_context对象及其相关资源。 |
| 参数 | rknn_context context:要销毁的rknn_context对象。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p17 unit 144 -->

示例代码如下:

<!-- source CN p17 unit 145 -->

```c
rknn_context ctx;
int ret = rknn_destroy(ctx);
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
