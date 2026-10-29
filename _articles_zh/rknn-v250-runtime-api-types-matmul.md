---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 矩阵乘法数据结构"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-types-matmul"
slug: "rknn-v250-runtime-api-types-matmul"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 矩阵乘法数据结构 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 矩阵乘法数据结构 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-types-matmul/"
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

<!-- source CN p39 unit 429 -->

### 6.3. 矩阵乘法结构体

<!-- source CN p39 unit 430 -->

### rknn_matmul_info

<!-- source CN p39 unit 431 -->

rknn_matmul_info表示用于执行矩阵乘法的规格信息,它包含了矩阵乘法的规模、输入和输出矩阵的数据类型和内存排布。结构体的定义如下表所示:

<!-- source CN p39 unit 432 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| M | int32_t | A矩阵的行数 |
| K | int32_t | A矩阵的列数 |
| N | int32_t | B矩阵的列数 |
| type | rknn_matmul_type | 输入输出矩阵的数据类型:<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32:表示矩阵A和B是float16类型,矩阵C是<br>float类型; RKNN_INT8_MM_INT8_TO_INT32:表示矩阵A和B是int8类型,矩阵C是int32<br>类型; RKNN_INT8_MM_INT8_TO_INT8:表示矩阵A、B和C是int8类型;<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT16:表示矩阵A、B和C是float16类型;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT32:表示矩阵A是float16类型,矩阵B是int8类<br>型,矩阵C是float类型;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT16:表示矩阵A是float16类型,矩阵B是int8类<br>型,矩阵C是float16类型;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT32:表示矩阵A是float16类型,矩阵B是int4类<br>型,矩阵C是float类型;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT16:表示矩阵A是float16类型,矩阵B是int4类<br>型,矩阵C是float16类型;<br>RKNN_INT8_MM_INT8_TO_FLOAT32:表示矩阵A和B是int8类型,矩阵C是float类型;<br>RKNN_INT4_MM_INT4_TO_INT16:表示矩阵A和B是int4类型,矩阵C是int16类型;<br>RKNN_INT8_MM_INT4_TO_INT32:表示矩阵A是int8类型,B是int4类型,矩阵C是int32<br>类型 |
| B_layout | int16_t | 矩阵B的数据排列方式。<br>RKNN_MM_LAYOUT_NORM:表示矩阵B按照原始形状排列 ,即KxN的形状排列;<br>RKNN_MM_LAYOUT_NATIVE:表示矩阵B按照高性能形状排列;<br>RKNN_MM_LAYOUT_TP_NORM:表示矩阵B按照Transpose后的形状排列,即NxK的形状<br>排列 |
| B_quant_type | int16_t | 矩阵B的量化方式类型。<br>RKNN_QUANT_TYPE_PER_LAYER_SYM:表示矩阵B按照Per-Layer方式对称量化;<br>RKNN_QUANT_TYPE_PER_LAYER_ASYM:表示矩阵B按照Per-Layer方式非对称量化;<br>RKNN_QUANT_TYPE_PER_CHANNEL_SYM:表示矩阵B按照Per-Channel方式对称量化;<br>RKNN_QUANT_TYPE_PER_CHANNEL_ASYM:表示矩阵B按照Per-Channel方式非对称量<br>化;<br>RKNN_QUANT_TYPE_PER_GROUP_SYM:表示矩阵B按照Per-Group方式对称量化;<br>RKNN_QUANT_TYPE_PER_GROUP_ASYM:表示矩阵B按照Per-Group方式非对称量化 |
| AC_layout | int16_t | 矩阵A和C的数据排列方式。<br>RKNN_MM_LAYOUT_NORM:表示矩阵A和C按照原始形状排列;<br>RKNN_MM_LAYOUT_NATIVE:表示矩阵A和C按照高性能形状排列 |
| AC_quant_type | int16_t | 矩阵A和C的量化方式类型。<br>RKNN_QUANT_TYPE_PER_LAYER_SYM:表示矩阵A和C按照Per-Layer方式对称量化;<br>RKNN_QUANT_TYPE_PER_LAYER_ASYM:表示矩阵A和C按照Per-Layer方式非对称量化 |
| iommu_domain_id | int32_t | 矩阵上下文所在的IOMMU地址空间域的索引。IOMMU地址空间与上下文一一对应,每个IOMMU<br>地址空间大小为4GB。该参数主要用于矩阵A、B和C的参数规格较大,某个域内NPU分配的内存<br>超过4GB以后需切换另一个域时使用。 |
| group_size | int16_t | 一个组的元素数量,仅分组量化开启后生效。 |
| reserved | int8_t[] | 预留字段 |

<!-- source CN p40 unit 433 -->

### rknn_matmul_tensor_attr

<!-- source CN p40 unit 434 -->

rknn_matmul_tensor_attr表示每个矩阵tensor的属性,它包含了矩阵的名字、形状、大小和数据类型。结构体的定义如下表所示:

<!-- source CN p40 unit 435 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| name | char[] | 矩阵的名字 |
| n_dims | uint32_t | 矩阵的维度个数 |
| dims | uint32_t[] | 矩阵的形状 |
| size | uint32_t | 矩阵的大小,以字节为单位 |
| type | rknn_tensor_type | 矩阵的数据类型 |

<!-- source CN p40 unit 436 -->

### rknn_matmul_io_attr

<!-- source CN p40 unit 437 -->

rknn_matmul_io_attr表示矩阵所有输入和输出tensor的属性,它包含了矩阵A、B和C的属性。结构体的定义如下表所示:

<!-- source CN p40 unit 438 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| A | rknn_matmul_tensor_attr | 矩阵A的tensor属性 |
| B | rknn_matmul_tensor_attr | 矩阵B的tensor属性 |
| C | rknn_matmul_tensor_attr | 矩阵C的tensor属性 |

<!-- source CN p40 unit 439 -->

### rknn_quant_params

<!-- source CN p40 unit 440 -->

rknn_quant_params表示矩阵的量化参数,包括name以及scale和zero_point数组的指针和⻓度,name用来标识矩阵的名称,它可以从初始化矩阵上下文时得到的rknn_matmul_io_attr结构体中获取。结构体定义如下表所示:

<!-- source CN p40 unit 441 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| name | char[] | 矩阵的名字 |
| scale | float* | 矩阵的scale数组指针 |
| scale_len | int32_t | 矩阵的scale数组⻓度 |
| zp | int32_t* | 矩阵的zero_point数组指针 |
| zp_len | int32_t | 矩阵的zero_point数组⻓度 |

<!-- source CN p40 unit 442 -->

### rknn_matmul_shape

<!-- source CN p40 unit 443 -->

rknn_matmul_shape表示某个特定shape的矩阵乘法的M、K和N,在初始化动态shape的矩阵乘法上下文时,需要提供shape的数量,并使用rknn_matmul_shape结构体数组表示所有的输入的shape。结构体定义如下表所示:

<!-- source CN p40 unit 444 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| M | int32_t | 矩阵A的行数 |
| K | int32_t | 矩阵A的列数 |
| N | int32_t | 矩阵B的列数 |

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
