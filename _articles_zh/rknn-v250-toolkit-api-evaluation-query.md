---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — 精度、性能、内存与设备查询"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-toolkit-api-evaluation-query"
slug: "rknn-v250-toolkit-api-evaluation-query"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — 精度、性能、内存与设备查询 | 完整参数、代码与平台限制参考"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — 精度、性能、内存与设备查询 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-toolkit-api-evaluation-query/"
---

## 平台参考与来源

本文依据 RKNN V2.5.0 原厂 PDF 整理。适用于原文列出的芯片和接口；ArmSoM 板卡须先核对 SoC、NPU 驱动、Toolkit/Runtime、SDK/BSP 和内核版本。尚未进行 ArmSoM 硬件验证，原文示例及测量值不是 ArmSoM 实测。

## 系列导航

- [环境、依赖与对象生命周期](/zh/articles/rknn-v250-toolkit-api-requirements-lifecycle/)
- [模型配置与量化参数](/zh/articles/rknn-v250-toolkit-api-configuration/)
- [加载 Caffe、TensorFlow、ONNX 与 PyTorch](/zh/articles/rknn-v250-toolkit-api-model-loading/)
- [构建、混合量化与导出](/zh/articles/rknn-v250-toolkit-api-build-quantize-export/)
- [运行时、算子注册与推理](/zh/articles/rknn-v250-toolkit-api-runtime-inference/)
- [精度、性能、内存与设备查询](/zh/articles/rknn-v250-toolkit-api-evaluation-query/)
- [生成、编译与运行 C++ 部署示例](/zh/articles/rknn-v250-toolkit-api-cpp-codegen/)

{% raw %}

<!-- source CN p21 unit 116 -->

## 8 精度、性能和内存评估接口

<!-- source CN p21 unit 117 -->

### 8.1 量化精度分析

<!-- source CN p21 unit 118 -->

该接口的功能是进行浮点、量化推理并产生每层的数据,并进行量化精度分析。

<!-- source CN p21 unit 119 -->

| API | accuracy_analysis |
| --- | --- |
| 描述 | 推理并产生快照,也就是dump出每一层的tensor数据。会dump出包括fp32和quant两种数据类型的快<br>照,用于计算量化误差。<br>注:<br>1. 该接口只能在 build 或 hybrid_quantization_step2 之后调用。<br>2. 如未指定target,并且原始模型应该为已量化的模型(QAT模型),则会调用失败。<br>3. 该接口使用的量化方式与config中指定的一致。 |
| 参数 | inputs:图像(jpg / png / bmp / npy等)路径 list。 |
| 参数 | output_dir:输出目录,所有快照都保存在该目录。默认值为'./snapshot'。<br>如果没有设置target,在output_dir下会输出:<br>- simulator目录:保存整个量化模型在simulator上完整运行时每一层的结果(已转成float32);<br>- golden目录:保存整个浮点模型在simulator上完整跑下来时每一层的结果;<br>- error_analysis.txt:记录simulator上量化模型逐层运行时每一层的结果与golden浮点模型逐层运行时每<br>一层的结果的余弦距离(entire_error cosine),以及量化模型取上一层的浮点结果作为输入时,输出与浮<br>点模型的余弦距离(single_error cosine),更详细的信息请查看error_analysis.txt文件。<br>如果有设置target,则在output_dir里还会多输出:<br>- runtime目录:保存整个量化模型在NPU上完整运行时每一层的结果(已转成float32)。<br>- error_analysis.txt:在上述记录的内容的基础上,还会记录量化模型在simulator上逐层运行时每一层的<br>结果与NPU上逐层运行时每一层的结果的余弦距离(entire_error cosine)等信息,更详细的信息请查看<br>error_analysis.txt文件。 |
| 参数 | target:目标硬件平台,支持“rv1103”、“rv1103b”、“rv1106”、“rv1106b”、“rv1126b”、<br>“rk3562”、“rk3566”、“rk3568”、“rk3576”和“rk3588”,默认为None。<br>如果设置了target,则会获取NPU运行时每一层的结果,并进行精度的分析。 |
| 参数 | device_id:设备编号,如果PC连接多台设备时,需要指定该参数,设备编号可以通过“list_devices”接<br>口查看。默认值为None。 |
| 返回值 | 0:成功。 |
| 返回值 | -1:失败。 |

<!-- source CN p21 unit 120 -->

举例如下:

<!-- source CN p21 unit 121 -->

```python
# Accuracy analysis
ret = rknn.accuracy_analysis(inputs=['./dog_224x224.jpg'])
```

<!-- source CN p21 unit 122 -->

### 8.2 评估模型性能

<!-- source CN p21 unit 123 -->

| API | eval_perf |
| --- | --- |
| 描述 | 评估模型性能。<br>模型必须运行在与PC连接的RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566<br>/ RK3568 / RK3576 / RK3588上。如果调用“init_runtime”的接口来初始化运行环境时设置<br>perf_debug为False,则获得的是模型在硬件上运行的总时间;如果设置perf_debug为True,除了返回总<br>时间外,还将返回每一层的耗时情况。 |
| 参数 | is_print:是否打印性能信息,默认值为True。 |
| 参数 | fix_freq:是否固定硬件设备的频率,默认值为True。 |
| 返回值 | perf_result:性能信息(字符串)。 |

<!-- source CN p22 unit 125 -->

举例如下:

<!-- source CN p22 unit 126 -->

```python
# 对模型性能进行评估
perf_detail = rknn.eval_perf()
```

<!-- source CN p22 unit 127 -->

### 8.3 获取内存使用情况

<!-- source CN p22 unit 128 -->

| API | eval_memory |
| --- | --- |
| 描述 | 获取模型在硬件平台运行时的内存使用情况。<br>模型必须运行在与PC连接的RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566<br>/ RK3568 / RK3576 / RK3588上。 |
| 参数 | is_print:是否以规范格式打印内存使用情况,默认值为True。 |
| 返回值 | memory_detail:内存使用情况,类型为字典。 内存使用情况按照下面的格式封装在字典中:<br>{<br>'weight_memory': 3698688,<br>'internal_memory': 1756160,<br>'other_memory': 484352,<br>'total_memory': 5939200,<br>}<br>- 'weight_memory' 字段表示运行时模型权重的内存占用。<br>- 'internal_memory' 字段表示运行时模型中间tensor内存占用。<br>- 'other_memory' 字段表示运行时其他的内存占用。<br>- 'total_model_allocation' 表示运行时的总内存占用,即权重、中间tensor和其他的内存占用之和。 |

<!-- source CN p22 unit 129 -->

举例如下:

<!-- source CN p22 unit 130 -->

```python
# 对模型内存使用情况进行评估
memory_detail = rknn.eval_memory()
```

<!-- source CN p22 unit 131 -->

如examples/caffe/mobilenet_v2,它在RK3588上运行时内存占用情况如下:

<!-- source CN p22 unit 132 -->

```text
======================================================
           Memory Profile Info Dump
======================================================
NPU model memory detail(bytes):
    Weight Memory: 3.53 MiB
    Internal Tensor Memory: 1.67 MiB
    Other Memory: 473.00 KiB
    Total Memory: 5.66 MiB

INFO: When evaluating memory usage, we need consider
the size of model, current model size is: 4.09 MiB
======================================================
```

<!-- source CN p23 unit 133 -->

### 8.4 获取设备列表

<!-- source CN p23 unit 134 -->

| API | list_devices |
| --- | --- |
| 描述 | 列出已连接的RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 /<br>RK3576 / RK3588。<br>注:目前设备连接模式有两种:ADB和NTB。多设备连接时请确保他们的模式都是一样的。 |
| 参数 | 无。 |
| 返回值 | 返回adb_devices列表和ntb_devices列表,如果设备为空,则返回空列表。 |

<!-- source CN p23 unit 135 -->

举例如下:

<!-- source CN p23 unit 136 -->

```python
rknn.list_devices()
```

<!-- source CN p23 unit 137 -->

返回的设备列表信息如下:

<!-- source CN p23 unit 138 -->

```text
*************************
all device(s) with adb mode:
VD46C3KM6N
*************************
```

<!-- source CN p23 unit 139 -->

注:使用多设备时,需要保证它们的连接模式都是一致的,否则会引起冲突,导致设备连接失败。

<!-- source CN p24 unit 140 -->

## 9 SDK版本查询接口

<!-- source CN p24 unit 141 -->

| API | get_sdk_version |
| --- | --- |
| 描述 | 获取SDK API和驱动的版本号。<br>注:使用该接口前必须完成模型加载和初始化运行环境,且该接口只能在硬件平台RV1103 / RV1103B /<br>RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588上使<br>用。 |
| 参数 | 无。 |
| 返回值 | sdk_version:API和驱动版本信息,类型为字符串。 |

<!-- source CN p24 unit 142 -->

举例如下:

<!-- source CN p24 unit 143 -->

```python
# 获取SDK版本信息
sdk_version = rknn.get_sdk_version()
print(sdk_version)
```

<!-- source CN p24 unit 144 -->

返回的SDK信息类似如下:

<!-- source CN p24 unit 145 -->

```text
==============================================
RKNN VERSION:
    API: 1.5.2 (8babfea build@2023-08-25T02:31:12)
    DRV: rknn_server: 1.5.2 (8babfea build@2023-08-25T10:30:12)
    DRV: rknnrt: 1.5.3b13 (42cbca6f5@2023-10-27T10:13:21)
==============================================
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

校对提示：原文日志示例仍显示 SDK 1.5.2，按历史示例保留，不作为 V2.5.0 实测结果。中英文环境表对 Ubuntu20.04 的 Python 列写法不同（中文 3.8/3.9、英文 3.8/3.8，Debian11 也存在相同差异），ARM64 段的 Debian 表头仍写 x64，均保留来源并提醒按实际安装包核对。V2.5.0 已新增 C++ codegen 章节并细化量化与内存策略；未用旧版参数替换新版。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
