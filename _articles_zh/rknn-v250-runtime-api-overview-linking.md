---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 平台支持、头文件与编译链接"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-overview-linking"
slug: "rknn-v250-runtime-api-overview-linking"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 平台支持、头文件与编译链接 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 平台支持、头文件与编译链接 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-overview-linking/"
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

<!-- source CN p7 unit 0 -->

## 1. 参考手册说明

<!-- source CN p7 unit 1 -->

RKNN C API是RKNPU Runtime(运行时库)的C语言接口。通过使用RKNN C API,开发者可以利用NPU的计算能力完成高效的RKNN模型推理或矩阵乘法计算任务。本文对RKNN C API的各个函数、数据结构以及返回码定义进行说明。

<!-- source CN p7 unit 2 -->

### 1.1 适用版本

<!-- source CN p7 unit 3 -->

本文档对应RKNPU Runtime发布版本 V2.5.0(⻅修订记录)。本文档描述的接口以 V2.5.0 版本为准。

<!-- source CN p7 unit 4 -->

### 1.2 支持平台

<!-- source CN p7 unit 5 -->

本文档适用如下硬件平台:

<!-- source CN p7 unit 6 -->

RV1103

<!-- source CN p7 unit 7 -->

RV1103B

<!-- source CN p7 unit 8 -->

RV1106

<!-- source CN p7 unit 9 -->

RV1106B

<!-- source CN p7 unit 10 -->

RV1126B

<!-- source CN p7 unit 11 -->

RK2118

<!-- source CN p7 unit 12 -->

RK3562

<!-- source CN p7 unit 13 -->

RK3566系列

<!-- source CN p7 unit 14 -->

RK3568系列

<!-- source CN p7 unit 15 -->

RK3576系列

<!-- source CN p7 unit 16 -->

RK3588系列

<!-- source CN p7 unit 17 -->

### 1.3 头文件和运行时库

<!-- source CN p7 unit 18 -->

根据不同的功能特点,RKNN C API的接口分为三个部分,各个部分函数、数据结构定义和头文件对应关系如下:

<!-- source CN p7 unit 19 -->

1. “rknn_api.h”定义部署RKNN模型的基础接口和数据结构。

<!-- source CN p7 unit 20 -->

2. “rknn_matmul_api.h”定义矩阵乘法接口和数据结构。

<!-- source CN p7 unit 21 -->

3. “rknn_custom_op.h”定义用戶自定义算子接口和数据结构。

<!-- source CN p8 unit 22 -->

## 2. 编译和链接

<!-- source CN p8 unit 23 -->

开发者编译应用时要包含接口函数所在的头文件,并且根据使用的硬件平台和系统类型,链接相应RKNPU运行时库。以下对RKNN CAPI头文件和运行时库文件进行说明。

<!-- source CN p8 unit 24 -->

### 2.1 Linux

<!-- source CN p8 unit 25 -->

1. 对于RK3562、RK3566系列、RK3568系列、RK3576系列、RK3588系列、RV1126B硬件平台,RKNPU运行时库文件为`&lt;sdk_path&gt;`/rknpu2/runtime目录下的librknnrt.so,其中`&lt;sdk_path&gt;`是瑞芯微NPU软件开发包的路径。

<!-- source CN p8 unit 26 -->

2. 对于RV1106、RV1103、RV1106B、RV1103B硬件平台,RKNPU运行时库文件为`&lt;sdk_path&gt;`/rknpu2/runtime目录下的librknnmrt.so。

<!-- source CN p8 unit 27 -->

### 2.2 Android

<!-- source CN p8 unit 28 -->

Android平台有两种方式来调用RKNN C API:

<!-- source CN p8 unit 29 -->

1. 应用直接链接librknnrt.so。

<!-- source CN p8 unit 30 -->

2. 应用链接Android平台HIDL实现的librknn_api_android.so。

<!-- source CN p8 unit 31 -->

对于需要通过CTS/VTS测试的Android设备需要使用基于Android平台HIDL实现的RKNN API(librknn_api_android.so不包含矩阵乘法和自定义算子功能)。如果不需要通过CTS/VTS测试的设备建议直接使用librknnrt.so(包含矩阵乘法和自定义算子功能),对各个接口调用流程的链路更短,可以提供更好的性能。

<!-- source CN p8 unit 32 -->

对于使用Android HIDL实现的RKNN API的代码位于RK3562/RK3566/RK3568/RK3576/RK3588 Android系统SDK的vendor/rockchip/hardware/interfaces/neuralnetworks目录下。当完成Android系统编译后,将会生成RKNPU相关的一系列库文件(对于应用开发只需要链接使用librknn_api_android.so即可),如下所示:

<!-- source CN p8 unit 33 -->

```text
/vendor/lib/librknn_api_android.so
/vendor/lib/librknnhal_bridge.rockchip.so
/vendor/lib64/librknn_api_android.so
/vendor/lib64/librknnhal_bridge.rockchip.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0-adapter-helper.so
/vendor/lib64/hw/rockchip.hardware.neuralnetworks@1.0-impl.so
/vendor/bin/hw/rockchip.hardware.neuralnetworks@1.0-service
```

<!-- source CN p8 unit 34 -->

也可以使用如下命令单独重新编译生成以上的库文件:

<!-- source CN p8 unit 35 -->

```c
mmm vendor/rockchip/hardware/interfaces/neuralnetworks/ -j8
```

<!-- source CN p8 unit 36 -->

### 2.3 RK2118平台

<!-- source CN p8 unit 37 -->

对于RK2118硬件平台,RKNPU运行时库文件位于RK2118的系统SDK中,如何获取请参考《RKNN2_RK2118_快速入⻔.pdf》的"准备RK2118 SDK"章节。

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
