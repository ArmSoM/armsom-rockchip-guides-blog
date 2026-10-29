---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — 加载 Caffe、TensorFlow、ONNX 与 PyTorch"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-toolkit-api-model-loading"
slug: "rknn-v250-toolkit-api-model-loading"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — 加载 Caffe、TensorFlow、ONNX 与 PyTorch | 完整参数、代码与平台限制参考"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — 加载 Caffe、TensorFlow、ONNX 与 PyTorch | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-toolkit-api-model-loading/"
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

<!-- source CN p11 unit 45 -->

## 4 模型加载接口

<!-- source CN p11 unit 46 -->

RKNN-Toolkit2目前支持Caffe、TensorFlow、TensorFlow Lite、ONNX、DarkNet、PyTorch等模型的加载转换,这些模型在加载时需调用对应的接口,以下为这些接口的详细说明。

<!-- source CN p11 unit 47 -->

### 4.1 Caffe模型加载接口

<!-- source CN p11 unit 48 -->

| API | load_caffe |
| --- | --- |
| 描述 | 加载Caffe模型。(ARM64版本暂不支持该接口) |
| 参数 | model:Caffe模型文件(.prototxt后缀文件)路径。 |
| 参数 | blobs:Caffe模型的二进制数据文件(.caffemodel后缀文件)路径。 |
| 参数 | input_name:Caffe模型存在多输入时,可以通过该参数指定输入层名的顺序,形如<br>['input1','input2','input3'],注意名字需要与模型输入名一致;默认值为None,表示按Caffe模型文件<br>(.prototxt后缀文件)自动给定。 |
| 返回值 | 0:导入成功。 |
| 返回值 | -1:导入失败。 |

<!-- source CN p11 unit 49 -->

举例如下:

<!-- source CN p11 unit 50 -->

```python
# 从当前路径加载mobilenet_v2模型
ret = rknn.load_caffe(model='./mobilenet_v2.prototxt',
                     blobs='./mobilenet_v2.caffemodel')
```

<!-- source CN p11 unit 51 -->

### 4.2 TensorFlow模型加载接口

<!-- source CN p11 unit 52 -->

| API | load_tensorflow |
| --- | --- |
| 描述 | 加载TensorFlow模型。(ARM64版本暂不支持该接口) |
| 参数 | tf_pb:TensorFlow模型文件(.pb后缀)路径。 |
| 参数 | inputs:模型的输入节点(tensor名),支持多个输入节点。所有输入节点名放在一个列表中。 |
| 参数 | input_size_list:每个输入节点对应的shape,所有输入shape放在一个列表中。如示例中的<br>ssd_mobilenet_v1模型,其输入节点对应的输入shape是[[1, 300, 300, 3]]。 |
| 参数 | outputs:模型的输出节点(tensor名),支持多个输出节点。所有输出节点名放在一个列表中。 |
| 参数 | input_is_nchw:模型的输入的layout是否已经是NCHW。默认值为False,表示默认输入layout为<br>NHWC。 |
| 返回值 | 0:导入成功。 |
| 返回值 | -1:导入失败。 |

<!-- source CN p11 unit 53 -->

举例如下:

<!-- source CN p12 unit 54 -->

```python
# 从当前目录加载ssd_mobilenet_v1_coco_2017_11_17模型
ret = rknn.load_tensorflow(tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
                         inputs=['Preprocessor/sub'],
                         outputs=['concat', 'concat_1'],
                         input_size_list=[[300, 300, 3]])
```

<!-- source CN p12 unit 55 -->

### 4.3 TensorFlow Lite模型加载接口

<!-- source CN p12 unit 56 -->

| API | load_tflite |
| --- | --- |
| 描述 | 加载TensorFlow Lite模型。(ARM64版本暂不支持该接口) |
| 参数 | model:TensorFlow Lite模型文件(.tflite后缀)路径。 |
| 参数 | input_is_nchw:模型的输入的layout是否已经是NCHW。默认值为False,即默认输入layout为<br>NHWC。 |
| 返回值 | 0:导入成功。 |
| 返回值 | -1:导入失败。 |

<!-- source CN p12 unit 57 -->

举例如下:

<!-- source CN p12 unit 58 -->

```python
# 从当前目录加载mobilenet_v1模型
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

<!-- source CN p12 unit 59 -->

### 4.4 ONNX模型加载

<!-- source CN p12 unit 60 -->

| API | load_onnx |
| --- | --- |
| 描述 | 加载ONNX模型。 |
| 参数 | model:ONNX模型文件(.onnx后缀)路径。 |
| 参数 | inputs:模型输入节点(tensor名),支持多个输入节点,所有输入节点名放在一个列表中。默认值为<br>None,表示从模型里获取。 |
| 参数 | input_size_list:每个输入节点对应的shape,所有输入shape放在一个列表中。如inputs有设置,则<br>input_size_list也需要被设置。默认值为None。 |
| 参数 | input_initial_val:设置模型输入的初始值,格式为ndarray的列表。默认值为None。 主要用于将某些<br>输入固化为常量,对于不需要固化为常量的输入可以设为None,如[None, np.array([1])]。 |
| 参数 | outputs:模型的输出节点(tensor名),支持多个输出节点,所有输出节点名放在一个列表中。默认值为<br>None,表示从模型里获取。 |
| 返回值 | 0:导入成功。 |
| 返回值 | -1:导入失败。 |

<!-- source CN p12 unit 61 -->

举例如下:

<!-- source CN p12 unit 62 -->

```python
# 从当前目录加载arcface模型
ret = rknn.load_onnx(model='./arcface.onnx')
```

<!-- source CN p12 unit 63 -->

### 4.5 DarkNet模型加载接口

<!-- source CN p13 unit 64 -->

| API | load_darknet |
| --- | --- |
| 描述 | 加载DarkNet模型。(ARM64版本暂不支持该接口) |
| 参数 | model:DarkNet模型文件(.cfg后缀)路径。 |
| 参数 | weight:权重文件(.weights后缀)路径。 |
| 返回值 | 0:导入成功。 |
| 返回值 | -1:导入失败。 |

<!-- source CN p13 unit 65 -->

举例如下:

<!-- source CN p13 unit 66 -->

```python
# 从当前目录加载yolov3-tiny模型
ret = rknn.load_darknet(model='./yolov3-tiny.cfg',
                       weight='./yolov3.weights')
```

<!-- source CN p13 unit 67 -->

### 4.6 PyTorch模型加载接口

<!-- source CN p13 unit 68 -->

| API | load_pytorch |
| --- | --- |
| 描述 | 加载PyTorch模型。 支持量化感知训练(QAT)模型,但需要将torch版本更新至1.9.0以上。 |
| 参数 | model:PyTorch模型文件(.pt后缀)路径,而且需要是torchscript格式的模型。 |
| 参数 | input_size_list:每个输入节点对应的shape,所有输入shape放在一个列表中。 |
| 返回值 | 0:导入成功。 |
| 返回值 | -1:导入失败。 |

<!-- source CN p13 unit 69 -->

举例如下:

<!-- source CN p13 unit 70 -->

```python
# 从当前目录加载resnet18模型
ret = rknn.load_pytorch(model='./resnet18.pt',
                       input_size_list=[[1,3,224,224]])
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

校对提示：原文日志示例仍显示 SDK 1.5.2，按历史示例保留，不作为 V2.5.0 实测结果。中英文环境表对 Ubuntu20.04 的 Python 列写法不同（中文 3.8/3.9、英文 3.8/3.8，Debian11 也存在相同差异），ARM64 段的 Debian 表头仍写 x64，均保留来源并提醒按实际安装包核对。V2.5.0 已新增 C++ codegen 章节并细化量化与内存策略；未用旧版参数替换新版。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
