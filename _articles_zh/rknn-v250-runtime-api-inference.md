---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 输入、执行、输出与动态形状设置"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-inference"
slug: "rknn-v250-runtime-api-inference"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 输入、执行、输出与动态形状设置 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 输入、执行、输出与动态形状设置 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-inference/"
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

<!-- source CN p22 unit 226 -->

### 5.3. 推理执行

<!-- source CN p22 unit 227 -->

设置输入、执行推理、获取输出及动态形状设置。

<!-- source CN p22 unit 228 -->

### rknn_inputs_set

<!-- source CN p22 unit 229 -->

通过rknn_inputs_set函数可以设置模型的输入数据。该函数能够支持多个输入,其中每个输入是rknn_input结构体对象,在传入之前用戶需要设置该对象,注:RV1106/RV1103/RV1106B/RV1103B/RK2118不支持该接口。

<!-- source CN p22 unit 230 -->

| API | rknn_inputs_set |
| --- | --- |
| 功能 | 设置模型输入数据。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | uint32_t n_inputs:输入数据个数。 |
| 参数 | rknn_input inputs[]:输入数据数组,数组每个元素是rknn_input结构体对象。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p22 unit 231 -->

示例代码如下:

<!-- source CN p23 unit 232 -->

```c
rknn_input inputs[1];
memset(inputs, 0, sizeof(inputs));
inputs[0].index = 0;
inputs[0].type = RKNN_TENSOR_UINT8;
inputs[0].size = img_width*img_height*img_channels;
inputs[0].fmt = RKNN_TENSOR_NHWC;
inputs[0].buf = in_data;
inputs[0].pass_through = 0;

ret = rknn_inputs_set(ctx, 1, inputs);
```

<!-- source CN p23 unit 233 -->

### rknn_run

<!-- source CN p23 unit 234 -->

rknn_run函数将执行一次模型推理,调用之前需要先通过rknn_inputs_set函数或者零拷贝的接口设置输入数据。

<!-- source CN p23 unit 235 -->

| API | rknn_run |
| --- | --- |
| 功能 | 执行一次模型推理。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | rknn_run_extend* extend:保留扩展,当前没有使用,传入NULL即可。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p23 unit 236 -->

示例代码如下:

<!-- source CN p23 unit 237 -->

```c
ret = rknn_run(ctx, NULL);
```

<!-- source CN p23 unit 238 -->

### rknn_outputs_get

<!-- source CN p23 unit 239 -->

rknn_outputs_get函数可以获取模型推理的输出数据。该函数能够一次获取多个输出数据。其中每个输出是rknn_output结构体对象,在函数调用之前需要依次创建并设置每个rknn_output对象。

<!-- source CN p23 unit 240 -->

对于输出数据的buffer存放可以采用两种方式:一种是用戶自行申请和释放,此时rknn_output对象的is_prealloc需要设置为1,并且将buf指针指向用戶申请的buffer;另一种是由rknn来进行分配,此时rknn_output对象的is_prealloc设置为0即可,函数执行之后buf将指向输出数据。注:RV1106/RV1103/RV1106B/RV1103B/RK2118不支持该接口

<!-- source CN p23 unit 241 -->

| API | rknn_outputs_get |
| --- | --- |
| 功能 | 获取模型推理输出。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | uint32_t n_outputs:输出数据个数。 |
| 参数 | rknn_output outputs[]:输出数据的数组,其中数组每个元素为rknn_output结构体对象,代表模型的一个输出。 |
| 参数 | rknn_output_extend* extend:保留扩展,当前没有使用,传入NULL即可。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p23 unit 242 -->

示例代码如下:

<!-- source CN p23 unit 243 -->

```c
rknn_output outputs[io_num.n_output];
memset(outputs, 0, sizeof(outputs));
for (int i = 0; i < io_num.n_output; i++) {
   outputs[i].index = i;
   outputs[i].is_prealloc = 0;
   outputs[i].want_float = 1;
}
ret = rknn_outputs_get(ctx, io_num.n_output, outputs, NULL);
```

<!-- source CN p23 unit 244 -->

### rknn_outputs_release

<!-- source CN p23 unit 245 -->

rknn_outputs_release函数将释放rknn_outputs_get函数得到的输出的相关资源。

<!-- source CN p24 unit 246 -->

| API | rknn_outputs_release |
| --- | --- |
| 功能 | 释放rknn_output对象。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | uint32_t n_outputs:输出数据个数。 |
| 参数 | rknn_output outputs[]:要销毁的rknn_output数组。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p24 unit 247 -->

示例代码如下:

<!-- source CN p24 unit 248 -->

```c
ret = rknn_outputs_release(ctx, io_num.n_output, outputs);
```

<!-- source CN p24 unit 249 -->

rknn_set_input_shape(deprecated)

<!-- source CN p24 unit 250 -->

该接口已经废弃,请使用rknn_set_input_shapes接口绑定输入形状。当前版本不可用,如要继续使用该接口,请使用1.5.0版本SDK并参考1.5.0版本的使用指南文档。

<!-- source CN p24 unit 251 -->

### rknn_set_input_shapes

<!-- source CN p24 unit 252 -->

对于动态形状输入RKNN模型,在推理前必须指定当前使用的输入形状。该接口传入输入个数和rknn_tensor_attr数组,包含了每个输入形状和对应的数据布局信息,将每个rknn_tensor_attr结构体对象的索引、名称、形状(dims)和内存布局信息(fmt)必须填充,rknn_tensor_attr结构体其他成员无需设置。在使用该接口前,可先通过rknn_query函数查询RKNN模型支持的输入形状数量和动态形状列表,要求输入数据的形状在模型支持的输入形状列表中。初次运行或每次切换新的输入形状,需要调用该接口设置新的形状,否则,不需要重复调用该接口。

<!-- source CN p24 unit 253 -->

| API | rknn_set_input_shapes |
| --- | --- |
| 功能 | 设置模型当前使用的输入形状。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | uint32_t n_inputs:输入Tensor的数量。 |
| 参数 | rknn_tensor_attr *: 输入tensor的属性数组指针,传递所有输入的形状信息,用戶需要设置每个输入属性结构体中的index、<br>name、dims、fmt、n_dims成员,其他成员无需设置。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p24 unit 254 -->

示例代码如下:

<!-- source CN p24 unit 255 -->

```c
for (int i = 0; i < io_num.n_input; i++) {
   for (int j = 0; j < input_attrs[i].n_dims; ++j) {
//使用第一个动态输入形状
      input_attrs[i].dims[j] = dyn_range[i].dyn_range[0][j];
   }
}
ret = rknn_set_input_shapes(ctx, io_num.n_input, input_attrs);
if (ret < 0) {
   fprintf(stderr, "rknn_set_input_shapes error! ret=%d\n", ret);
   return -1;
}
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
