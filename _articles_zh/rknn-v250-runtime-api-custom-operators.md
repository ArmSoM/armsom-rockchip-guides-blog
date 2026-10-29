---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 自定义算子注册与属性"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-custom-operators"
slug: "rknn-v250-runtime-api-custom-operators"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 自定义算子注册与属性 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 自定义算子注册与属性 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-custom-operators/"
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

<!-- source CN p33 unit 366 -->

### 5.6. 自定义算子

<!-- source CN p33 unit 367 -->

自定义算子注册与算子属性获取。

<!-- source CN p33 unit 368 -->

### rknn_register_custom_ops

<!-- source CN p33 unit 369 -->

在初始化上下文成功后,该函数用于在上下文中注册若干个自定义算子的信息,包括自定义算子类型、运行后端类型、OpenCL内核信息以及回调函数指针。注册成功后,在推理阶段,rknn_run接口会调用开发者实现的回调函数。

<!-- source CN p33 unit 370 -->

| API | rknn_register_custom_ops |
| --- | --- |
| 功能 | 注册若干个自定义算子到上下文中。 |
| 参数 | rknn_context *context:rknn_context指针。函数调用之前,context必须已经初始化成功。 |
| 参数 | rknn_custom_op* op:自定义算子信息数组,数组每个元素是rknn_custom_op结构体对象。 |
| 参数 | uint32_t custom_op_num:自定义算子信息数组⻓度。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p33 unit 371 -->

示例代码如下:

<!-- source CN p34 unit 372 -->

```c
// CPU operators
rknn_custom_op user_op[2];
memset(user_op, 0, 2 * sizeof(rknn_custom_op));
strncpy(user_op[0].op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op[0].version = 1;
user_op[0].target = RKNN_TARGET_TYPE_CPU;
user_op[0].init = custom_op_init_callback;
user_op[0].compute = compute_custom_softmax_float32;
user_op[0].destroy = custom_op_destroy_callback;

strncpy(user_op[1].op_type, "ArgMax", RKNN_MAX_NAME_LEN - 1);
user_op[1].version = 1;
user_op[1].target = RKNN_TARGET_TYPE_CPU;
user_op[1].init = custom_op_init_callback;
user_op[1].compute = compute_custom_argmax_float32;
user_op[1].destroy = custom_op_destroy_callback;

ret = rknn_register_custom_ops(ctx, user_op, 2);
if (ret < 0) {
  printf("rknn_register_custom_ops fail! ret = %d\n", ret);
  return -1;
}
```

<!-- source CN p34 unit 373 -->

### rknn_custom_op_get_op_attr

<!-- source CN p34 unit 374 -->

该函数用于在自定义算子的回调函数中获取自定义算子的参数信息,例如Softmax算子的axis参数。它传入自定义算子参数的字段名称和一个rknn_custom_op_attr结构体指针,调用该接口后,参数值会存储在rknn_custom_op_attr结构体中的data成员中,开发者根据返回的结构体内dtype成员将该指针强制转换成C语言中特定数据类型的数组首地址,再按照元素数量读取出完整参数值。

<!-- source CN p34 unit 375 -->

| API | rknn_custom_op_get_op_attr |
| --- | --- |
| 功能 | 获取自定义算子的参数或属性。 |
| 参数 | rknn_custom_op_context* op_ctx:自定义算子上下文指针。 |
| 参数 | const char* attr_name:自定义算子参数的字段名称。 |
| 参数 | rknn_custom_op_attr* op_attr:表示自定义算子参数值的结构体。 |
| 返回值 | 无 |

<!-- source CN p34 unit 376 -->

示例代码如下:

<!-- source CN p34 unit 377 -->

```c
rknn_custom_op_attr op_attr;
rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
   axis = ((int64_t*)op_attr.data)[0];
}
...
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
