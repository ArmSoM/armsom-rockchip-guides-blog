---
title: "RKNN2 SDK V2.5.0 · 零拷贝接口与输入输出约束"
description: "RKNN2 SDK V2.5.0 · 零拷贝接口与输入输出约束 · 完整开发指南系列"
excerpt: "零拷贝接口与输入输出约束"
translation_key: "rknn-v250-sdk-guide-zero-copy"
slug: "rknn-v250-sdk-guide-zero-copy"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

平台参考：本文来自 Rockchip RKNN2 SDK V2.5.0 开发指南，涵盖源文明确列出的 SoC、Linux/Android Runtime 和对应 Toolkit。具体功能仅适用于各节列出的芯片、SDK、驱动和内核条件，不能据此推定所有 ArmSoM 板卡支持。部署前需核对实际 ArmSoM 板卡的 BSP、NPU 驱动、Runtime 与模型版本。本篇未进行 ArmSoM 硬件验证；日志、性能数字和示例均来自原稿。

来源与校对：中文遵循中文 V2.5.0（182 页），英文、俄文和德文遵循英文 V2.5.0（208 页）；保留各稿技术信息，不将旧版内容补充为新版事实。中文配图取自中文 PDF，英俄德配图取自英文 PDF，含独立提取的矢量流程图。保留原章节和公式编号。原稿部分交叉引用仍指向旧章号，动态 Shape 容量示例写作“1224+140=264”等、TP_NORM 支持说明有矛盾、init()/rknn.val_perf() 等名称与后文 API 不一致；原始信息保留，执行前以实际 V2.5.0 SDK 头文件及 API 手册核对。各部分均保留代码和参数，提取造成的跨页换行与表格续行已整理。

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 8/22**

[1. 软件栈与核心概念](/zh/articles/rknn-v250-sdk-guide-overview/)

[2. 开发环境、版本与连板准备](/zh/articles/rknn-v250-sdk-guide-environment/)

[3. 开发流程与接口选择](/zh/articles/rknn-v250-sdk-guide-workflow/)

[4. 模型转换与 ONNX 编辑](/zh/articles/rknn-v250-sdk-guide-conversion/)

[5. 量化、混合量化与 QAT](/zh/articles/rknn-v250-sdk-guide-quantization/)

[6. 推理、精度、性能与内存评估](/zh/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime 生命周期、布局与内存](/zh/articles/rknn-v250-sdk-guide-runtime-basics/)

**零拷贝接口与输入输出约束**

[9. C API 部署与代码生成](/zh/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Toolkit Lite2 Python 部署](/zh/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API 与矩阵布局](/zh/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU 多核配置与性能](/zh/articles/rknn-v250-sdk-guide-multicore/)

[13. 动态 Shape 模型与部署](/zh/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. 多 Batch 推理](/zh/articles/rknn-v250-sdk-guide-multi-batch/)

[15. RK3588/RK3576 NPU SRAM](/zh/articles/rknn-v250-sdk-guide-sram/)

[16. 缓存一致性与稀疏化推理](/zh/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. 自定义算子：Python 与 C API](/zh/articles/rknn-v250-sdk-guide-custom-operators/)

[18. 模型加密部署](/zh/articles/rknn-v250-sdk-guide-encryption/)

[19. 精度问题诊断](/zh/articles/rknn-v250-sdk-guide-accuracy/)

[20. 性能分析与网络优化](/zh/articles/rknn-v250-sdk-guide-performance/)

[21. 内存分析、共享与复用](/zh/articles/rknn-v250-sdk-guide-memory/)

[22. 常见问题、错误处理与参考资源](/zh/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 3.1.6 RKNN Runtime零拷贝调用

#### 3.1.6.1 零拷贝介绍

目前在RK3562 / RK3566 / RK3568 / RK3576 / RK3588 / RV1126B上有两组API可以使用,分别是通用API接口和零拷贝流程的API接口,RV1103系列/RV1106系列支持零拷贝流程的API接口。零拷贝示例代码可以参考rknpu2工程下的examples/rknn_zero_copy目录,有关rknpu2的详细内容和代码库请访问链接:https://github.com/airockchip/rknn-toolkit2/tree/master/rknpu2。

在推理RKNN模型时,原始数据要经过输入处理、NPU运行模型、输出处理三大流程。目前根据不同模型输入格式和量化方式,接口内部会存在通用API和零拷贝API两种处理流程,如图3-5和图3-6所示,两组API的主要区别在于,通用接口每次更新帧数据,需要将外部模块分配的数据拷贝到NPU运行时的输入内存,而零拷贝流程的接口会直接使用预先分配的内存(包括NPU运行时创建的或外部其他框架创建的,比如DRM框架),减少了内存拷贝的花销,性能更优,带宽更少。当用戶输入数据只有虚拟地址时,只能使用通用API接口;当用戶输入数据有物理地址或fd时,两组接口都可以使用。通用API和零拷贝API不能混合调用。

![原稿技术配图 ](/assets/images/rknn-v250/sdk-guide/cn/p061-vector-683.png)

图3-5 通用API的数据处理流程

![原稿技术配图 ](/assets/images/rknn-v250/sdk-guide/cn/p062-vector-686.png)

图3-6 零拷贝API数据处理流程

1.通用API

通用API的流程如图3-5所示。对于数据的归一化、量化、数据排布格式转换、反量化在CPU上运行(在符合零拷贝输入要求的情况下,归一化和量化会运行在NPU上,但输入数据仍需要用CPU拷贝到模型的输入buffer上),模型本身的推理在NPU上运行。

2.零拷贝API

零拷贝API的流程如图3-6所示。优化了通用API的数据处理流程,零拷贝API归一化、量化和模型推理都会在NPU上运行,NPU输出的数据排布格式和反量化过程在CPU或者NPU上运行。零拷贝API对于输入数据流程的处理效率会比通用API高。

零拷贝场景的使用条件如下表所示:

表3-2 零拷贝输入要求

| 输入维度 | RV1103B / RV1106B / RK3566 / RK3568 | RK3562 / RK3576 / RK3588 / RV1103 / RV1106 / RV1126B |
| --- | --- | --- |
| 4维,通道数是1、 3、4 | 宽8字节对齐 | 宽16字节对齐 |
| 非4维 | 总大小8字节对齐 | 总大小16字节对齐 |

#### 3.1.6.2 C API零拷贝整体流程

零拷贝API接口使用 rknn_tensor_memory 结构体,需要在推理前创建并设置该结构体,并在推理后读取该结构体中的内存信息。根据用戶是否需要自行分配模型的模块内存(输入/输出/权重/中间结果)和内存表示方式(文件描述符/物理地址等)差异,有下列三种典型的零拷贝调用流程,如图3-7至图3-9所示,红色部分表示专为零拷贝加入的接口和数据结构,斜体表示接口调用之间传递的数据结构。

输入/输出内存由运行时分配

![图3-7 零拷贝 API接口调用流程(输入/输出内部分配) ](/assets/images/rknn-v250/sdk-guide/cn/p063-figure-01.png)

图3-7 零拷贝 API接口调用流程(输入/输出内部分配)

如图3-7所示,输入/输出内存由运行时分配调用的是 rknn_create_mem() 接口创建rknn_tensor_memory 结构体, rknn_set_io_mem() 设置输入输出 rknn_tensor_memory 结构体。

rknn_create_mem() 接口创建的输入/输出内存信息结构体包含了文件描述符成员和物理地址,RGA的接口使用到NPU分配的内存信息, preprocess_rga() 表示RGA的接口, stream_fd表示RGA的接口输入源的内存数据, postprocess_cpu() 表示后处理的CPU实现。

输入/输出内存由外部分配

![原稿技术配图 ](/assets/images/rknn-v250/sdk-guide/cn/p064-vector-706.png)

图3-8 零拷贝API接口调用流程(输入/输出外部分配)

如图3-8所示,输入/输出内存由外部分配调用的是rknn_create_mem_from_fd() / rknn_create_mem_from_phys() 接口创建 rknn_tensor_memory结构体, rknn_set_io_mem() 设置输入输出 rknn_tensor_memory 结构体。 flush_cache 表示用戶需要调用与分配的内存类型关联的接口来刷新输出缓存。

输入/输出/权重/中间结果内存由外部分配

![原稿技术配图 ](/assets/images/rknn-v250/sdk-guide/cn/p065-vector-723.png)

图3-9 零拷贝 API接口调用流程(输入/输出/权重/中间结果外部分配)

如图3-9所示,输入/输出/权重/中间结果内存由外部分配调用的是rknn_create_mem_from_fd() / rknn_create_mem_from_phys() 接口创建 rknn_tensor_memory结构体, rknn_set_io_mem() 设置输入输出 rknn_tensor_memory 结构体,rknn_set_weight_mem() / rknn_set_internal_mem() 设置权重/中间结果 rknn_tensor_memory结构体。

#### 3.1.6.3 C API零拷贝的用法

以图3-7零拷贝API接口调用流程(输入/输出内部分配)为例,用法如下:

rknn_query()

输入:

用RKNN_QUERY_NATIVE_INPUT_ATTR查询相关的属性(注意,不是RKNN_QUERY_INPUT_ATTR). 当查询出来的fmt(或者称为layout)不同时,需要提前处理的方式也不一样。该方式查询出来的是输入硬件效率最优的layout和type。

rknn_query() 输入的情况如下:

a. 当layout为 RKNN_TENSOR_NCHW 时,这种情况一般输入是4维,并且数据类型为bool或者int64,当传数据给NPU时,也需要按照NCHW格式排列给NPU。

b. 当layout为 RKNN_TENSOR_NHWC 时,这种情况一般输入是4维,并且数据类型为float32/float16/int8/uint8,同时,输入通道数是1、3、4。当传数据给NPU时,也需要按照 NHWC 格式排列给NPU。需要注意的是当 pass_through=1 时,width可能需要做stride对齐,具体取决于查询出来的w_stride 的值。

c. 当layout为 RKNN_TENSOR_NC1HWC2 时,这种情况一般输入是4维,并且数据类型为float16/int8,同时,输入通道数不是1、3、4。当 pass_through=0 时,输入数据按照 NHWC 格式排列,接口内部会进行 NHWC到 NC1HWC2 的 CPU 转换; 当 pass_through=1 时,输入数据按照 NC1HWC2 格式排列, 用戶外部需转换好。

d. 当layout为 RKNN_TENSOR_UNDEFINED 时,这种情况一般输入不是4维,当传数据给NPU时,需要按照ONNX模型输入格式传给NPU。NPU不做任何的mean/std处理以及layout转换。

如果用戶需要的输入配置不同于查询接口获取的 rknn_tensor_attr 结构体,可以对 rknn_tensor_attr结构体进行对应修改,目前支持的可修改的输入数据类型如表3-3所示.特别注意:如果查询的数据类型是uint8,用戶想传入float32类型,则 rknn_tensor_attr 结构体的size要修改成原size的四倍,同时其中的数据类型要修改成 RKNN_TENSOR_FLOAT32 。用该方式修改后硬件效率就不是最优了,接口内部会调用CPU进行数据类型转换。

表3-3 输入可修改的输入数据类型表

| 用户设置类型 / 模型查询类型 | bool | int8 | float16 | int16 | int32 | Int64 |
| --- | --- | --- | --- | --- | --- | --- |
| bool | Y |  |  |  |  |  |
| int8 |  | Y |  |  |  |  |
| uint8 |  | Y | Y |  |  |  |
| float32 |  | Y | Y |  |  |  |
| float16 |  |  | Y |  |  |  |
| int16 |  |  |  | Y |  |  |
| int32 |  |  |  |  | Y |  |
| Int64 |  |  |  |  |  | Y |

输出:

用RKNN_QUERY_NATIVE_OUTPUT_ATTR查询相关的属性(注意,不是RKNN_QUERY_OUTPUT_ATTR). 当查询出来的fmt(或者称为layout)不同时,需要后处理的方式也不一样。该方式查询出来的是输出硬件效率最优的layout和type。

当输出是4维且用戶需要 NHWC layout的四维输出时, 可以用 RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR 查询相关的属性。该方式可以直接获得NHWC layout的输出。

rknn_query() 输出的情况如下:

a. 当layout为 RKNN_TENSOR_NC1HWC2 时,这种情况一般输出是4维,并且数据类型为float16/int8。当用戶需要 NCHW layout时,外部需进行 NC1HWC2 到 NCHW 的layout 转换。

b. 当layout为 RKNN_TENSOR_UNDEFINED 时,这种情况一般输出非4维,并且数据类型为float16/int8。用戶外部无需进行layout转换。

c. 当layout为 RKNN_TENSOR_NCHW 时,这种情况一般输出是4维, 并且数据类型为float16/int8。用戶外部无需进行layout转换。

d. 当layout为 RKNN_TENSOR_NHWC 时,这种情况一般输出是4维, 并且数据类型为float16/int8。这种情况一般是用戶调用 RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR 接口查询出来的layout。

如果用戶需要的输出配置不同于查询接口获取的 rknn_tensor_attr 结构体,可以对 rknn_tensor_attr结构体进行对应修改,可修改的配置信息如表3-5,表3-4所示,特别注意:如果查询输出的数据类型是int8,用戶想获取成float32类型输出,则 rknn_tensor_attr 结构体的size要修改成原size的四倍,同时其中的数据类型要修改成 RKNN_TENSOR_FLOAT32 。用该方式修改后硬件效率就不是最优了,接口内部会调用CPU进行数据类型转换。

表3-5 输出可修改的输入数据类型表

| 用户设置类型 / 模型查询类型 | bool | int8 | float16 | int16 | int32 | Int64 |
| --- | --- | --- | --- | --- | --- | --- |
| bool | Y |  |  |  |  |  |
| int8 |  | Y |  |  |  |  |
| uint8 |  |  |  |  |  |  |
| float32 |  | Y | Y |  |  |  |
| float16 |  |  | Y |  |  |  |
| int16 |  |  |  | Y |  |  |
| int32 |  |  |  |  | Y |  |
| Int64 |  |  |  |  |  | Y |

表3-4 输出可修改的layout类型表

| 用户设置 layout / 模型查询 layout | NC1HWC2 | NCHW | NHWC | UNDEFINE |
| --- | --- | --- | --- | --- |
| NC1HWC2 | Y |  |  |  |
| NCHW | Y | Y |  |  |
| NHWC |  |  | Y |  |
| UNDEFINE |  |  |  | Y |

RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B支持的零拷贝接口NPU输出配置如表3-6所示,RV1106/RV1106B/RV1103/RV1103B支持零拷贝接口NPU输出配置如表3-7所示。

表3-6 RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B零拷贝接口NPU支持的输出配置

| 模型类型 | 输出数据类型 | 输出维度 | 可支持output layout |
| --- | --- | --- | --- |
| int8模型 | int8/float16/float32 | 4维 | NCHW/NC1HWC2/NHWC |
| int8模型 | int8/float16/float32 | 非4维 | UNDEFINE |
| float16模型 | float16/float32 | 4维 | NCHW/NC1HWC2/NHWC |
| float16模型 | float16/float32 | 非4维 | UNDEFINE |

表3-7 RV1103/RV1103B/RV1106/RV1106B零拷贝接口NPU支持的输出配置

| 模型类型 | 输出数据类型 | 输出维度 | 可支持output layout |
| --- | --- | --- | --- |
| int8 模型 | int8/float16 | 4维 | NCHW/NC1HWC2/NHWC |
| int8 模型 | int8/float16 | 非4维 | UNDEFINE |

rknn_create_mem

零拷贝API接口使用 rknn_tensor_memory 结构体,需要在推理前创建并设置该结构体,并在推理后读取该结构体中的内存信息。当无需对 RKNN_QUERY_NATIVE_INPUT_ATTR ,RKNN_QUERY_NATIVE_OUTPUT_ATTR 查询出来的layout和type进行修改时,直接采用默认配置的size_with_stride 创建内存大小。若修改了相应的layout和type,则需按照相应的size 创建内存大小.(例如输出的数据类型是int8,用戶想获取成float32类型输出,size要修改成原size的四倍)。

rknn_set_io_mem

rknn_set_io_mem() 用于设置包含模型输入/输出内存信息的 rknn_tensor_mem 结构体,和rknn_init() 类似,只要在最开始调用一次,后面反复执行 rknn_run() 即可。

{% endraw %}
