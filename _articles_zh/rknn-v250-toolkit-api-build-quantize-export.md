---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — 构建、混合量化与导出"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-toolkit-api-build-quantize-export"
slug: "rknn-v250-toolkit-api-build-quantize-export"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — 构建、混合量化与导出 | 完整参数、代码与平台限制参考"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — 构建、混合量化与导出 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-toolkit-api-build-quantize-export/"
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

<!-- source CN p14 unit 71 -->

## 5 模型构建和量化接口

<!-- source CN p14 unit 72 -->

### 5.1 构建RKNN模型

<!-- source CN p14 unit 73 -->

| API | build |
| --- | --- |
| 描述 | 构建RKNN模型。 |
| 参数 | do_quantization:是否对模型进行量化。默认值为True。 |
| 参数 | dataset:用于量化校正的数据集。目前支持文本文件格式,用戶可以把用于校正的图片(jpg或png格式)<br>或npy文件路径放到一个.txt文件中。文本文件里每一行一条路径信息。如:<br>a.jpg<br>b.jpg<br>或<br>a.npy<br>b.npy<br>如有多个输入,则每个输入对应的文件用空格隔开,如:<br>a.jpg a2.jpg<br>b.jpg b2.jpg<br>或<br>a.npy a2.npy<br>b.npy b2.npy<br>注:量化图片建议选择与预测场景较吻合的图片。 |
| 参数 | rknn_batch_size:模型的输入Batch参数调整。默认值为None,表示不进行调整。 如果大于1,则可以<br>在一次推理中同时推理多帧输入图像或输入数据,如MobileNet模型的原始input维度为[1, 224, 224, 3],<br>output维度为[1, 1001],当rknn_batch_size设为4时,input的维度变为[4, 224, 224, 3],output维度<br>变为[4, 1001]。<br>注:<br>1. rknn_batch_size只有在NPU多核的平台上可以提高性能(提升核心利用率),因此rknn_batch_size的<br>值建议与核心数匹配。<br>2. rknn_batch_size修改后,模型的input/output的shape都会被修改,使用inference推理模型时需要设<br>置相应的input的大小,后处理时,也需要对返回的outputs进行处理。 |
| 参数 | auto_hybrid:是否开启自动混合量化调整精度或溢出。默认值为False,表示不进行调整。当模型经行量<br>化时,开启自动混合量化会将低于指定阈值的余弦距离/欧式距离的op转为fp16计算(目前仅在w8a8量化下<br>支持);当模型未进行量化时,开启自动混合量化会将超出fp16数值范围的op转为int16计算。<br>注:<br>1. 余弦距离和欧式距离的阈值可通过config接口中的 auto_hybrid_cos_thresh和<br>auto_hybrid_euc_thresh设置。 |
| 返回值 | 0:构建成功。 |
| 返回值 | -1:构建失败。 |

<!-- source CN p14 unit 74 -->

举例如下:

<!-- source CN p14 unit 75 -->

```python
# 构建RKNN模型,并且做量化
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
```

<!-- source CN p14 unit 76 -->

### 5.2 混合量化

<!-- source CN p15 unit 77 -->

#### 5.2.1 hybrid_quantization_step1

<!-- source CN p15 unit 78 -->

使用混合量化功能时,第一阶段调用的主要接口是hybrid_quantization_step1,用于生成临时模型文件(.model)、数据文件(.data)和量化配置文件(.quantization.cfg)。接口详情如下:

<!-- source CN p15 unit 79 -->

| API | hybrid_quantization_step1 |
| --- | --- |
| 描述 | 根据加载的原始模型,生成对应的临时模型文件、配置文件和量化配置文件。 |
| 参数 | dataset:⻅5.1 构建RKNN模型的dataset说明。 |
| 参数 | rknn_batch_size:⻅5.1 构建RKNN模型的rknn_batch_size说明。 |
| 参数 | proposal:产生混合量化的配置建议值。 默认值为False。 |
| 参数 | proposal_dataset_size:proposal使用的dataset的张数。默认值为1。 因为proposal功能比较耗<br>时,所以默认只使用1张,也就是dataset里的第一张。 |
| 参数 | custom_hybrid:用于根据用戶指定的多组输入和输出名,选取混合量化对应子图。格式为<br>[[input0_name, output0_name], [input1_name, output1_name], ...]。默认值为None。<br>注:输入和输出名应根据生成的临时模型文件(.model)来选择。 |
| 返回值 | 0:成功。 |
| 返回值 | -1:失败。 |

<!-- source CN p15 unit 80 -->

举例如下:

<!-- source CN p15 unit 81 -->

```python
# 调用hybrid_quantization_step1 产生量化配置文件
ret = rknn.hybrid_quantization_step1(dataset='./dataset.txt')
```

<!-- source CN p15 unit 82 -->

#### 5.2.2 hybrid_quantization_step2

<!-- source CN p15 unit 83 -->

用于使用混合量化功能时生成RKNN模型,接口详情如下:

<!-- source CN p15 unit 84 -->

| API | hybrid_quantization_step2 |
| --- | --- |
| 描述 | 接收临时模型文件、配置文件、量化配置文件和校正数据集作为输入,生成混合量化后的RKNN模型。 |
| 参数 | model_input:hybrid_quantization_step1生成的临时模型文件(.model)路径。 |
| 参数 | data_input:hybrid_quantization_step1生成的数据文件(.data)路径。 |
| 参数 | model_quantization_cfg:hybrid_quantization_step1生成并经过修改后的模型量化配置文件<br>(.quantization.cfg)路径。 |
| 返回值 | 0:成功。 |
| 返回值 | -1:失败。 |

<!-- source CN p15 unit 85 -->

举例如下:

<!-- source CN p15 unit 86 -->

```python
# Call hybrid_quantization_step2 to generate hybrid quantized RKNN model
ret = rknn.hybrid_quantization_step2(
               model_input='./ssd_mobilenet_v2.model',
               data_input='./ssd_mobilenet_v2.data',
               model_quantization_cfg='./ssd_mobilenet_v2.quantization.cfg')
```

<!-- source CN p16 unit 87 -->

## 6 RKNN模型导出接口

<!-- source CN p16 unit 88 -->

通过本工具构建的RKNN模型通过该接口可以导出存储为RKNN模型文件,用于模型部署。

<!-- source CN p16 unit 89 -->

| API | export_rknn |
| --- | --- |
| 描述 | 将RKNN模型保存到指定文件中(.rknn后缀)。 |
| 参数 | export_path:导出模型文件的路径。 |
| 返回值 | 0:导出成功。 |
| 返回值 | -1:导出失败。 |

<!-- source CN p16 unit 90 -->

举例如下:

<!-- source CN p16 unit 91 -->

```python
# 将构建好的RKNN模型保存到当前路径的mobilenet_v1.rknn文件中
ret = rknn.export_rknn(export_path='./mobilenet_v1.rknn')
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

校对提示：原文日志示例仍显示 SDK 1.5.2，按历史示例保留，不作为 V2.5.0 实测结果。中英文环境表对 Ubuntu20.04 的 Python 列写法不同（中文 3.8/3.9、英文 3.8/3.8，Debian11 也存在相同差异），ARM64 段的 Debian 表头仍写 x64，均保留来源并提醒按实际安装包核对。V2.5.0 已新增 C++ codegen 章节并细化量化与内存策略；未用旧版参数替换新版。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
