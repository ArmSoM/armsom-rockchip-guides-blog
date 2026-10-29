---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 自定义算子结构与废弃 API 迁移"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-types-custom-migration"
slug: "rknn-v250-runtime-api-types-custom-migration"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 自定义算子结构与废弃 API 迁移 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 自定义算子结构与废弃 API 迁移 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-types-custom-migration/"
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

<!-- source CN p40 unit 445 -->

### 6.4. 自定义算子结构体

<!-- source CN p40 unit 446 -->

### rknn_gpu_op_context

<!-- source CN p40 unit 447 -->

rknn_gpu_op_context表示指定GPU运行的自定义算子的上下文信息。结构体的定义如下表所示:

<!-- source CN p40 unit 448 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| cl_context | void* | OpenCL的cl_context对象,使用时请强制类型转换成cl_context。 |
| cl_command_queue | void* | OpenCL的cl_command_queue对象,使用时请强制类型转换成cl_command_queue。 |
| cl_kernel | void* | OpenCL的cl_kernel对象,使用时请强制类型转换成cl_kernel。 |

<!-- source CN p41 unit 449 -->

### rknn_custom_op_context

<!-- source CN p41 unit 450 -->

rknn_custom_op_context表示自定义算子的上下文信息。结构体的定义如下表所示:

<!-- source CN p41 unit 451 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| target | rknn_target_type | 执行自定义算子的后端设备:<br>RKNN_TARGET_TYPE_CPU: CPU<br>RKNN_TARGET_TYPE_CPU: GPU |
| internal_ctx | rknn_custom_op_interal_context | 算子内部的私有上下文。 |
| gpu_ctx | rknn_gpu_op_context | 包含自定义算子的OpenCL上下文信息,当执行后端设备是GPU时,在回调函数中从该结<br>构体获取OpenCL的cl_context等对象。 |
| priv_data | void* | 留给开发者管理的数据指针。 |

<!-- source CN p41 unit 452 -->

### rknn_custom_op_tensor

<!-- source CN p41 unit 453 -->

rknn_custom_op_tensor表示自定义算子的输入/输出的tensor信息。结构体的定义如下表所示:

<!-- source CN p41 unit 454 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| attr | rknn_tensor_attr | 包含tensor的名称、形状、大小等信息。 |
| mem | rknn_tensor_mem | 包含tensor的内存地址、fd、有效数据偏移等信息。 |

<!-- source CN p41 unit 455 -->

### rknn_custom_op_attr

<!-- source CN p41 unit 456 -->

rknn_custom_op_attr表示自定义算子的参数或属性信息。结构体的定义如下表所示:

<!-- source CN p41 unit 457 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| name | char[] | 自定义算子的参数名。 |
| dtype | rknn_tensor_type | 每个元素的数据类型。 |
| n_elems | uint32_t | 元素数量。 |
| data | void* | 参数数据内存段的虚拟地址。 |

<!-- source CN p41 unit 458 -->

### rknn_custom_op

<!-- source CN p41 unit 459 -->

rknn_custom_op表示自定义算子的注册信息。结构体的定义如下表所示:

<!-- source CN p41 unit 460 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| version | uint32_t | 自定义算子版本号。 |
| target | rknn_target_type | 自定义算子执行后端类型。 |
| op_type | char[] | 自定义算子类型。 |
| cl_kernel_name | char[] | OpenCL的kernel函数名。 |
| cl_kernel_source | char* | OpenCL的资源名称。当cl_source_size等于0时,<br>表示文件绝对路径;当cl_source_size大于0时,<br>表示kernel函数代码的字符串。 |
| cl_source_size | uint64_t | 当cl_kernel_source是字符串,表示字符串⻓度;<br>当cl_kernel_source是文件路径,则设置为0。 |
| cl_build_options | char[] | OpenCL kernel的编译选项。 |
| init | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t n_inputs,<br>rknn_custom_op_tensor* outputs, uint32_t n_outputs); | 自定义算子初始化回调函数指针。在注册时,调用<br>一次。不需要时可以设置为NULL。 |
| prepare | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t n_inputs,<br>rknn_custom_op_tensor* outputs, uint32_t n_outputs); | 预处理回调函数指针。在rknn_run时调用一次。不<br>需要时可以设置为NULL。 |
| compute | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t n_inputs,<br>rknn_custom_op_tensor* outputs, uint32_t n_outputs); | 自定义算子功能的回调函数指针。在rknn_run时调<br>用一次。不能设置为NULL。 |
| compute_native | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t n_inputs,<br>rknn_custom_op_tensor* outputs, uint32_t n_outputs); | 高性能计算的回调函数指针,它与compute回调函<br>数区别是输入和输出的tensor的格式存在差异。暂<br>不支持,目前设置为NULL。 |
| destroy | int (*)(rknn_custom_op_context* op_ctx); | 销毁资源的回调函数指针。在rknn_destroy时调用<br>一次。 |

<!-- source CN p43 unit 462 -->

## 7. API变更、废弃和迁移

<!-- source CN p43 unit 463 -->

RKNN C API 各版本的接口新增、修改与废弃情况⻅本手册前言中的「修订记录」表。

<!-- source CN p43 unit 464 -->

当前版本(V2.5.0)存在如下已废弃接口,请使用其替代接口:

<!-- source CN p43 unit 465 -->

| 已废弃接口 | 替代接口 |
| --- | --- |
| rknn_set_input_shape | rknn_set_input_shapes |
| rknn_matmul_create_dyn_shape | rknn_matmul_create_dynamic_shape |

<!-- source CN p43 unit 466 -->

以上废弃接口的详细说明⻅ 5.3 推理执行 中的 rknn_set_input_shape(deprecated) 与 5.5 矩阵乘法 中的rknn_matmul_create_dyn_shape(deprecated)。

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
