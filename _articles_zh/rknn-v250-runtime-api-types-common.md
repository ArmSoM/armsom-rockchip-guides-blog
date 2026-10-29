---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 状态码、张量、内存与扩展结构"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-types-common"
slug: "rknn-v250-runtime-api-types-common"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 状态码、张量、内存与扩展结构 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 状态码、张量、内存与扩展结构 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-types-common/"
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

<!-- source CN p35 unit 378 -->

## 6. 类型参考

<!-- source CN p35 unit 379 -->

### 6.1. 状态码

<!-- source CN p35 unit 380 -->

RKNN API函数的返回值错误码定义如下表所示:

<!-- source CN p35 unit 381 -->

| 错误码 | 错误详情 |
| --- | --- |
| RKNN_SUCC(0) | 执行成功。 |
| RKNN_ERR_FAIL(-1) | 执行出错。 |
| RKNN_ERR_TIMEOUT(-2) | 执行超时。 |
| RKNN_ERR_DEVICE_UNAVAILABLE(-3) | NPU设备不可用。 |
| RKNN_ERR_MALLOC_FAIL(-4) | 内存分配失败。 |
| RKNN_ERR_PARAM_INVALID(-5) | 传入参数错误。 |
| RKNN_ERR_MODEL_INVALID(-6) | 传入的RKNN模型无效。 |
| RKNN_ERR_CTX_INVALID(-7) | 传入的rknn_context无效。 |
| RKNN_ERR_INPUT_INVALID(-8) | 传入的rknn_input对象无效。 |
| RKNN_ERR_OUTPUT_INVALID(-9) | 传入的rknn_output对象无效。 |
| RKNN_ERR_DEVICE_UNMATCH(-10) | 版本不匹配。 |
| RKNN_ERR_INCOMPATILE_PRE_COMPILE_MODEL(-11) | RKNN模型使用了预编译模式,但与当前驱动不兼容。 |
| RKNN_ERR_INCOMPATILE_OPTIMIZATION_LEVEL_VERSION(-12) | RKNN模型设置了优化等级的选项,但是和当前驱动不兼容。 |
| RKNN_ERR_TARGET_PLATFORM_UNMATCH(-13) | RKNN模型和当前平台不兼容。 |
| RKNN_ERR_KEY_INVALID(-14) | 密钥信封无效或无法解析。 |
| RKNN_ERR_DECRYPT_FAILED(-15) | 模型或密钥信封解密失败。 |
| RKNN_ERR_SOC_BIND_FAILED(-16) | 当前SoC平台不在绑定的平台列表内(SoC绑定校验失败)。 |

<!-- source CN p35 unit 382 -->

### 6.2. 通用结构体

<!-- source CN p35 unit 383 -->

### rknn_sdk_version

<!-- source CN p35 unit 384 -->

结构体rknn_sdk_version用来表示RKNN SDK的版本信息,结构体的定义如下:

<!-- source CN p35 unit 385 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| api_version | char[] | SDK的版本信息。 |
| drv_version | char[] | SDK所基于的驱动版本信息。 |

<!-- source CN p35 unit 386 -->

### rknn_input_output_num

<!-- source CN p35 unit 387 -->

结构体rknn_input_output_num表示输入输出tensor个数,其结构体成员变量如下表所示:

<!-- source CN p35 unit 388 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| n_input | uint32_t | 输入tensor个数。 |
| n_output | uint32_t | 输出tensor个数。 |

<!-- source CN p35 unit 389 -->

### rknn_input_range

<!-- source CN p35 unit 390 -->

结构体rknn_input_range表示一个输入的支持形状列表信息。它包含了输入的索引、支持的形状个数、数据布局格式、名称以及形状列表,具体的结构体的定义如下表所示:

<!-- source CN p35 unit 391 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| index | uint32_t | 表示该形状对应输入的索引位置。 |
| shape_number | uint32_t | 表示RKNN模型支持的输入形状个数。 |
| fmt | rknn_tensor_format | 表示形状对应的数据布局格式。 |
| name | char[] | 表示输入的名称。 |
| dyn_range | uint32_t[][] | 表示输入形状列表,它是包含多个形状数组的二维数组,形状优先存储。 |
| n_dims | uint32_t | 表示每个形状数组的有效维度个数。 |

<!-- source CN p36 unit 393 -->

### rknn_tensor_attr

<!-- source CN p36 unit 394 -->

结构体rknn_tensor_attr表示模型的tensor的属性,结构体的定义如下表所示:

<!-- source CN p36 unit 395 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| index | uint32_t | 表示输入输出tensor的索引位置。 |
| n_dims | uint32_t | Tensor维度个数。 |
| dims | uint32_t[] | Tensor形状。 |
| name | char[] | Tensor名称。 |
| n_elems | uint32_t | Tensor数据元素个数。 |
| size | uint32_t | Tensor数据所占内存大小。 |
| fmt | rknn_tensor_format | Tensor维度的格式,有以下格式: RKNN_TENSOR_NCHW, RKNN_TENSOR_NHWC,<br>RKNN_TENSOR_NC1HWC2, RKNN_TENSOR_UNDEFINED |
| type | rknn_tensor_type | Tensor数据类型,有以下数据类型: RKNN_TENSOR_FLOAT32,<br>RKNN_TENSOR_FLOAT16, RKNN_TENSOR_INT8, RKNN_TENSOR_UINT8,<br>RKNN_TENSOR_INT16, RKNN_TENSOR_UINT16, RKNN_TENSOR_INT32,<br>RKNN_TENSOR_UINT32, RKNN_TENSOR_INT64, RKNN_TENSOR_BOOL,<br>RKNN_TENSOR_INT4, RKNN_TENSOR_BFLOAT16 |
| qnt_type | rknn_tensor_qnt_type | Tensor量化类型,有以下的量化类型: RKNN_TENSOR_QNT_NONE:未量化;<br>RKNN_TENSOR_QNT_DFP:动态定点量化;<br>RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC:非对称量化。 |
| fl | int8_t | RKNN_TENSOR_QNT_DFP量化类型的参数。 |
| zp | int32_t | RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC量化类型的零点。 |
| scale | float | RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC量化类型的参数。 |
| w_stride | uint32_t | 实际存储一行图像数据的像素数目,等于一行的有效数据像素数目 + 为硬件快速跨越到下一行而<br>补⻬的一些无效像素数目,单位是像素。 |
| size_with_stride | uint32_t | 实际存储图像数据所占的存储空间的大小(包括了补⻬的无效像素的存储空间大小)。 |
| pass_through | uint8_t | 0表示未转换的数据,1表示转换后的数据,转换包括归一化和量化。 |
| h_stride | uint32_t | 仅用于多batch输入场景,且该值由用戶设置。目的是NPU正确地读取每batch数据的起始地址,<br>它等于原始模型的输入高度+跨越下一列而补⻬的无效像素数目。如果设置成0,表示与原始模型<br>输入高度一致,单位是像素。 |

<!-- source CN p36 unit 396 -->

### rknn_perf_detail

<!-- source CN p36 unit 397 -->

结构体rknn_perf_detail表示模型的性能详情,结构体的定义如下表所示(RV1106/RV1106B/RV1103/RV1103B/RK2118暂不支持):

<!-- source CN p36 unit 398 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| perf_data | char* | 性能详情包含网络每层运行时间,能够直接打印出来查看。 |
| data_len | uint64_t | 存放性能详情的字符串数组的⻓度。 |

<!-- source CN p36 unit 399 -->

### rknn_perf_run

<!-- source CN p37 unit 400 -->

结构体rknn_perf_run表示模型的总体性能,结构体的定义如下表所示(RV1106/RV1106B/RV1103/RV1103B/RK2118暂不支持):

<!-- source CN p37 unit 401 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| run_duration | int64_t | 网络总体运行(不包含设置输入/输出)时间,单位是微秒。 |

<!-- source CN p37 unit 402 -->

### rknn_mem_size

<!-- source CN p37 unit 403 -->

结构体rknn_mem_size表示初始化模型时的内存分配情况,结构体的定义如下表所示:

<!-- source CN p37 unit 404 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| total_weight_size | uint32_t | 模型的权重占用的内存大小。 |
| total_internal_size | uint32_t | 模型的中间tensor占用的内存大小。 |
| total_dma_allocated_size | uint64_t | 模型申请的所有dma内存之和。 |
| total_sram_size | uint32_t | 只针对RK3588有效,为NPU预留的系统SRAM大小(具体使用方式参考<br>《RK3588_NPU_SRAM_usage.md》 )。 |
| free_sram_size | uint32_t | 只针对RK3588有效,当前可用的空闲SRAM大小(具体使用方式参考<br>《RK3588_NPU_SRAM_usage.md》)。 |
| reserved[10] | uint32_t | 预留。 |

<!-- source CN p37 unit 405 -->

### rknn_tensor_mem

<!-- source CN p37 unit 406 -->

结构体rknn_tensor_mem表示tensor的内存信息。结构体的定义如下表所示:

<!-- source CN p37 unit 407 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| virt_addr | void* | 该tensor的虚拟地址。 |
| phys_addr | uint64_t | 该tensor的物理地址。 |
| fd | int32_t | 该tensor的文件描述符。 |
| offset | int32_t | 相较于文件描述符和虚拟地址的偏移量。 |
| size | uint32_t | 该tensor占用的内存大小。 |
| flags | uint32_t | rknn_tensor_mem的标志位,有以下标志:<br>RKNN_TENSOR_MEMORY_FLAGS_ALLOC_INSIDE: 表明rknn_tensor_mem结构体由运行时创建;<br>RKNN_TENSOR_MEMORY_FLAGS_FROM_FD: 表明rknn_tensor_mem结构体由fd构造;<br>RKNN_TENSOR_MEMORY_FLAGS_FROM_PHYS: 表明rknn_tensor_mem结构体由物理地址构造; 用戶<br>不用关注该标志。 |
| priv_data | void* | 内存的私有数据。 |

<!-- source CN p37 unit 408 -->

### rknn_input

<!-- source CN p37 unit 409 -->

结构体rknn_input表示模型的一个数据输入,用来作为参数传入给rknn_inputs_set函数。结构体的定义如下表所示:

<!-- source CN p37 unit 410 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| index | uint32_t | 该输入的索引位置。 |
| buf | void* | 输入数据的指针。 |
| size | uint32_t | 输入数据所占内存大小。 |
| pass_through | uint8_t | 设置为1时会将buf存放的输入数据直接设置给模型的输入节点,不做任何预处理。 |
| type | rknn_tensor_type | 输入数据的类型。 |
| fmt | rknn_tensor_format | 输入数据的格式。 |

<!-- source CN p37 unit 411 -->

### rknn_output

<!-- source CN p37 unit 412 -->

结构体rknn_output表示模型的一个数据输出,用来作为参数传入给rknn_outputs_get函数,在函数执行后,结构体对象将会被赋值。结构体的定义如下表所示:

<!-- source CN p38 unit 413 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| want_float | uint8_t | 标识是否需要将输出数据转为float类型输出,该字段由用戶设置。 |
| is_prealloc | uint8_t | 标识存放输出数据是否是预分配,该字段由用戶设置。 |
| index | uint32_t | 该输出的索引位置,该字段由用戶设置。 |
| buf | void* | 输出数据的指针,该字段由接口返回。 |
| size | uint32_t | 输出数据所占内存大小,该字段由接口返回。 |

<!-- source CN p38 unit 414 -->

### rknn_decrypt_key_mem

<!-- source CN p38 unit 415 -->

结构体rknn_decrypt_key_mem用于将加密模型的密钥信封(key envelope)传递给rknn_init,通过rknn_init_extend的user_key成员传入。结构体的定义如下表所示:

<!-- source CN p38 unit 416 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| key_data | void* | 指向RKKE密钥信封内存的指针。 |
| key_size | uint32_t | 密钥信封的字节⻓度。 |

<!-- source CN p38 unit 417 -->

### rknn_init_extend

<!-- source CN p38 unit 418 -->

结构体rknn_init_extend表示初始化模型时的扩展信息。结构体的定义如下表所示:

<!-- source CN p38 unit 419 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| ctx | rknn_context | 已初始化的rknn_context对象。 |
| real_model_offset | int32_t | 真正rknn模型在文件中的偏移,只有以文件路径为参数或零拷贝模型内存初始化时才生<br>效。 |
| real_model_size | uint32_t | 真正rknn模型在文件中的大小,只有以文件路径为参数或零拷贝模型内存初始化时才生<br>效。 |
| model_buffer_fd | int32_t | 使用RKNN_FLAG_MODEL_BUFFER_ZERO_COPY标志初始化后,NPU分配的模型内存<br>代表的fd。 |
| model_buffer_flags | uint32_t | 使用RKNN_FLAG_MODEL_BUFFER_ZERO_COPY标志初始化后,NPU分配的模型内存<br>代表的内存标志。 |
| user_key | rknn_decrypt_key_mem* | 用戶提供的加密密钥指针(rknn_decrypt_key_mem*)。用于加载RKCE加密模型,加载<br>明文模型时设置为NULL即可。 |
| reserved | uint8_t[] | 预留数据位。 |

<!-- source CN p38 unit 420 -->

### rknn_run_extend

<!-- source CN p38 unit 421 -->

结构体rknn_run_extend表示模型推理时的扩展信息,目前暂不支持使用。结构体的定义如下表所示:

<!-- source CN p38 unit 422 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| frame_id | uint64_t | 表示当前推理的帧序号。 |
| non_block | int32_t | 0表示阻塞模式,1表示非阻塞模式,非阻塞即rknn_run调用直接返回。 |
| timeout_ms | int32_t | 推理超时的上限,单位毫秒。 |
| fence_fd | int32_t | 用于非阻塞执行推理,暂不支持。 |

<!-- source CN p38 unit 423 -->

### rknn_output_extend

<!-- source CN p38 unit 424 -->

结构体rknn_output_extend表示获取输出的扩展信息,目前暂不支持使用。结构体的定义如下表所示:

<!-- source CN p38 unit 425 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| frame_id | uint64_t | 输出结果的帧序号。 |

<!-- source CN p38 unit 426 -->

### rknn_custom_string

<!-- source CN p39 unit 427 -->

结构体rknn_custom_string表示转换RKNN模型时,用戶设置的自定义字符串,结构体的定义如下表所示:

<!-- source CN p39 unit 428 -->

| 成员变量 | 数据类型 | 含义 |
| --- | --- | --- |
| string | char[] | 用戶自定义字符串。 |

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
