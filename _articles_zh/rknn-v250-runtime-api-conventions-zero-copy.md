---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 内存所有权与通用、零拷贝流程"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-conventions-zero-copy"
slug: "rknn-v250-runtime-api-conventions-zero-copy"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 内存所有权与通用、零拷贝流程 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 内存所有权与通用、零拷贝流程 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-conventions-zero-copy/"
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

<!-- source CN p9 unit 38 -->

## 3. C API公共约定

<!-- source CN p9 unit 39 -->

### 3.1 平台差异

<!-- source CN p9 unit 40 -->

由于不同的芯片平台的硬件特性不同,RKNN C API的接口以及接口参数的支持情况也不同。各个硬件平台的RKNN C API接口支持情况如表3-1所示:

<!-- source CN p9 unit 41 -->

表3-1 各个硬件平台的RKNN C API接口支持情况

<!-- source CN p9 unit 42 -->

|  | RKNN C API | RV1126B/RK3562/<br>RK3566/RK3568 | RK3588/RK3576 | RV1106/RV1103/<br>RV1103B/RV1106B | RK2118 |
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

<!-- source CN p9 unit 43 -->

各个硬件平台使用rknn_query函数支持的查询参数如表3-2所示:

<!-- source CN p10 unit 44 -->

表3-2 各个硬件平台rknn_query函数支持的查询参数

<!-- source CN p10 unit 45 -->

|  | rknn_query参数 | RV1126B/RK3562/<br>RK3566/RK3568 | RK3576/<br>RK3588 | RV1106/RV1106B/<br>RV1103/RV1103B/RK2118 |
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

<!-- source CN p10 unit 46 -->

### 3.2 内存所有权

<!-- source CN p10 unit 47 -->

API分配的内存: 通过 rknn_create_mem 分配的 tensor 内存由调用方所有,必须在不再使用时调用rknn_destroy_mem 释放,避免重复释放。

<!-- source CN p10 unit 48 -->

用戶分配的内存: rknn_set_weight_mem、rknn_set_internal_mem、rknn_set_io_mem 接受的用戶分配内存仍由调用方所有,使用完毕后由调用方自行释放。

<!-- source CN p10 unit 49 -->

外部内存封装: rknn_create_mem_from_fd、rknn_create_mem_from_phys、rknn_create_mem_from_mb_blk 将已分配的内存(通过文件描述符、物理地址或 mb_blk 表示)与RKNN框架关联,实现零拷贝,封装出的 rknn_tensor_mem 对象仍需通过 rknn_destroy_mem 释放封装对象。

<!-- source CN p10 unit 50 -->

### 3.3 输入输出数据有效期

<!-- source CN p10 unit 51 -->

rknn_inputs_set 的 inputs 数组及其 buf 指向的输入数据必须在调用期间保持有效。

<!-- source CN p10 unit 52 -->

rknn_outputs_get 的 outputs 数组需由用戶提前创建并设置 index;当 is_prealloc 为 1 时,buf 由用戶预分配并在调用期间保持有效;当 is_prealloc 为 0 时,buf 由接口分配,需在调用 rknn_outputs_release 释放前保持有效,释放后 buf 指针失效,不应再使用。

<!-- source CN p10 unit 53 -->

rknn_set_io_mem 设置的输入/输出 tensor 内存需在调用期间保持有效,且需在调用 rknn_run 前完成设置。

<!-- source CN p10 unit 54 -->

### 3.4 返回值和错误处理

<!-- source CN p10 unit 55 -->

大多数接口返回 int 状态码:0 表示成功,负值表示错误。个别接口返回指针(如 rknn_create_mem、rknn_create_mem_from_fd、rknn_create_mem_from_phys、rknn_create_mem_from_mb_blk),失败时返回NULL。

<!-- source CN p10 unit 56 -->

完整状态码定义⻅ 6.1 状态码。

<!-- source CN p11 unit 57 -->

调用方应检查每次调用的返回值,错误处理时根据状态码定位问题(如 RKNN_ERR_DEVICE_UNMATCH 表示版本不匹配、RKNN_ERR_CTX_INVALID 表示上下文无效等)。

<!-- source CN p11 unit 58 -->

### 3.5 通用API与零拷贝API

<!-- source CN p11 unit 59 -->

推理RKNN模型时,原始数据需要经过输入处理、NPU运行模型、输出处理三大流程。根据不同模型输入格式和量化方式,接口内部存在通用API和零拷贝API两种处理流程,二者在使用方式和调用流程上的主要区别如下:

<!-- source CN p11 unit 60 -->

通用API: 提供一套简洁易用的推理接口(rknn_inputs_set/rknn_outputs_get/rknn_outputs_release)。每次更新帧数据时,需要将外部模块分配的数据拷贝到NPU运行时的输入内存,数据的归一化、量化、数据排布格式转换、反量化等主要在CPU上运行,模型推理在NPU上运行。

<!-- source CN p11 unit 61 -->

零拷贝API: 使用 rknn_create_mem/rknn_create_mem_from_fd/rknn_create_mem_from_phys 等接口创建或封装内存,再通过 rknn_set_io_mem 设置输入/输出内存,直接使用预先分配的内存(NPU运行时创建的或外部其他框架如DRM创建的),减少内存拷贝、性能更优、带宽更少。归一化、量化和模型推理都会在NPU上运行。

<!-- source CN p11 unit 62 -->

接口选择: 当用戶输入数据只有虚拟地址时,只能使用通用API;当输入数据有物理地址或fd时,使用零拷贝API。通用API和零拷贝API不能混合调用。

<!-- source CN p11 unit 63 -->

通用API调用流程(如图3-1所示):

<!-- source CN p11 unit 64 -->

1. 调用rknn_init()接口初始化模型;

<!-- source CN p11 unit 65 -->

2. 调用rknn_query()接口查询模型的输入输出属性;

<!-- source CN p11 unit 66 -->

3. 对输入进行前处理;

<!-- source CN p11 unit 67 -->

4. 调用rknn_inputs_set()接口设置输入数据;

<!-- source CN p11 unit 68 -->

5. 调用rknn_run()接口进行模型推理;

<!-- source CN p11 unit 69 -->

6. 调用rknn_outputs_get()接口获取推理结果数据;

<!-- source CN p11 unit 70 -->

7. 对输出进行后处理;

<!-- source CN p11 unit 71 -->

8. 调用rknn_outputs_release()接口释放输出数据内存;

<!-- source CN p11 unit 72 -->

9. 调用rknn_destroy()接口销毁RKNN。

<!-- source CN p12 unit 73 -->

![配图来自原始 PDF — 12](/assets/images/rknn-v250/apis/runtime/cn/p012-figure-01.png)

<!-- source CN p12 unit 74 -->

图3-1 通用API调用流程

<!-- source CN p12 unit 75 -->

零拷贝API调用流程(以输入/输出内存由运行时分配为例,如图3-2所示):

<!-- source CN p12 unit 76 -->

1. 调用rknn_init()接口初始化模型;

<!-- source CN p12 unit 77 -->

2. 调用rknn_query()接口查询模型的原生输入/输出属性(RKNN_QUERY_NATIVE_INPUT_ATTR/RKNN_QUERY_NATIVE_OUTPUT_ATTR);

<!-- source CN p12 unit 78 -->

3. 对输入进行前处理(可选);

<!-- source CN p12 unit 79 -->

4. 调用rknn_create_mem()接口创建输入/输出rknn_tensor_mem结构体(外部分配时使用rknn_create_mem_from_fd()/rknn_create_mem_from_phys());

<!-- source CN p12 unit 80 -->

5. 调用rknn_set_io_mem()接口设置输入/输出内存;

<!-- source CN p12 unit 81 -->

6. 调用rknn_run()接口进行模型推理;

<!-- source CN p12 unit 82 -->

7. 从rknn_tensor_mem结构体读取输出内存信息,进行后处理;

<!-- source CN p12 unit 83 -->

8. 调用rknn_destroy_mem()接口释放输入/输出内存;

<!-- source CN p12 unit 84 -->

9. 调用rknn_destroy()接口销毁RKNN。

<!-- source CN p13 unit 85 -->

![配图来自原始 PDF — 13](/assets/images/rknn-v250/apis/runtime/cn/p013-figure-01.png)

<!-- source CN p13 unit 86 -->

图3-2 零拷贝API调用流程(输入/输出内部分配)

<!-- source CN p13 unit 87 -->

其中rknn_set_io_mem()接口的详细用法⻅ 5.4 张量和内存 中的 rknn_set_io_mem。

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
