---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — 环境、依赖与对象生命周期"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-toolkit-api-requirements-lifecycle"
slug: "rknn-v250-toolkit-api-requirements-lifecycle"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — 环境、依赖与对象生命周期 | 完整参数、代码与平台限制参考"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — 环境、依赖与对象生命周期 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-toolkit-api-requirements-lifecycle/"
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

<!-- source CN p5 unit 0 -->

## 1 环境说明

<!-- source CN p5 unit 1 -->

### 1.1 支持芯片

<!-- source CN p5 unit 2 -->

RKNN-Toolkit2当前版本所支持芯片的型号如下:

<!-- source CN p5 unit 3 -->

RV1103

<!-- source CN p5 unit 4 -->

RV1103B

<!-- source CN p5 unit 5 -->

RV1106

<!-- source CN p5 unit 6 -->

RV1106B

<!-- source CN p5 unit 7 -->

RV1126B

<!-- source CN p5 unit 8 -->

RK2118

<!-- source CN p5 unit 9 -->

RK3562

<!-- source CN p5 unit 10 -->

RK3566系列

<!-- source CN p5 unit 11 -->

RK3568系列

<!-- source CN p5 unit 12 -->

RK3576系列

<!-- source CN p5 unit 13 -->

RK3588系列

<!-- source CN p5 unit 14 -->

注:后文用RK3566 / RK3568 / RK3576 / RK3588分别统称RK3566系列 / RK3568系列 / RK3576系列 /RK3588系列。

<!-- source CN p5 unit 15 -->

### 1.2 系统依赖说明

<!-- source CN p5 unit 16 -->

使用RKNN-Toolkit2时需要满足以下运行环境要求:

<!-- source CN p5 unit 17 -->

| 操作系统版本 | Ubuntu18.04(x64) | Ubuntu20.04(x64) | Ubuntu22.04(x64) | Ubuntu24.04(x64) |
| --- | --- | --- | --- | --- |
| Python版本 | 3.6 / 3.7 | 3.8 / 3.9 | 3.10 / 3.11 | 3.12 |

<!-- source CN p5 unit 18 -->

ARM64版本运行环境要求:

<!-- source CN p5 unit 19 -->

| 操作系统版本 | Debian10(x64) | Debian11(x64) | Debian12(x64) |
| --- | --- | --- | --- |
| Python版本 | 3.6 / 3.7 | 3.8 / 3.9 | 3.10 / 3.11 / 3.12 |

<!-- source CN p5 unit 20 -->

注: 1. 具体python库依赖详⻅doc/requirements*.txt 2. 本文档主要以Ubuntu 20.04 / Python3.8为例进行说明

<!-- source CN p5 unit 21 -->

### 1.3 适用的深度学习框架

<!-- source CN p5 unit 22 -->

RKNN-Toolkit2支持的深度学习框架包括Caffe、TensorFlow、TensorFlow Lite、ONNX、DarkNet和PyTorch。

<!-- source CN p5 unit 23 -->

它和各深度学习框架的版本对应关系如下:

<!-- source CN p6 unit 24 -->

| RKNN-Toolkit2 | Caffe | TensorFlow | TF Lite | ONNX | DarkNet | PyTorch |
| --- | --- | --- | --- | --- | --- | --- |
| 1.4.0<br>1.4.2<br>1.5.0<br>1.5.2 | 1.0 | 1.12.0<br>~2.8.0 | Schema<br>version=3 | 1.7.0<br>~1.10.0 | Commit ID:<br>810d7f7 | 1.6.0<br>~1.10.1 |
| 1.6.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema<br>version=3 | 1.7.0<br>~1.14.0 | Commit ID:<br>810d7f7 | 1.6.0<br>~1.13.1 |
| 2.0.0<br>2.1.0<br>2.2.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema<br>version=3 | 1.7.0<br>~1.14.1 | Commit ID:<br>810d7f7 | 1.10.1<br>~2.1.0 |
| 2.3.0<br>~2.5.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema<br>version=3 | 1.7.0<br>~1.17.0 | Commit ID:<br>810d7f7 | 1.10.1<br>~2.4.0 |

<!-- source CN p6 unit 25 -->

注:

<!-- source CN p6 unit 26 -->

1. 由于TensorFlow版本兼容特性,TensorFlow 1.12.0之前版本的导出的pb文件,理论上也是支持的。关于TensorFlow版本兼容性的更多信息,可以参考官方资料:https://www.tensorflow.org/guide/versions?hl=zh-cn

<!-- source CN p6 unit 27 -->

2. 因为TFLite不同版本的schema之间是互不兼容的,所以构建TFLite模型时使用与RKNN-Toolkit2不同版本的schema可能导致加载失败。

<!-- source CN p6 unit 28 -->

3. RKNN-Toolkit2使用的Caffe protocol是基于berkeley官方修改的protocol:https://github.com/BVLC/caffe/tree/master/src/caffe/proto,commit值为828dd10,RKNN-Toolkit2在此基础上新增了一些OP。

<!-- source CN p6 unit 29 -->

4. ONNX release version和opset version、IR version之间的关系参考onnxruntime官网说明:https://github.com/microsoft/onnxruntime/blob/v1.6.0/docs/Versioning.md

<!-- source CN p6 unit 30 -->

5. DarkNet官方Github链接:https://github.com/pjreddie/darknet。RKNN-Toolkit2现在的转换规则是基于master分支的最新提交(commit值:810d7f7)制定的。

<!-- source CN p6 unit 31 -->

6. 加载PyTorch模型(torchscript模型)时,推荐使用相同版本的PyTorch导出模型并转为RKNN模型,前后版本不一致时有可能会导致转RKNN模型失败。

<!-- source CN p6 unit 32 -->

7. ARM64版本仅支持PyTorch和ONNX框架,其他框架暂时不支持。

<!-- source CN p7 unit 33 -->

## 2 RKNN 对象与资源生命周期

<!-- source CN p7 unit 34 -->

在使用RKNN-Toolkit2的所有API接口时,都需要先调用RKNN()方法初始化RKNN对象,不再使用该对象时通过调用该对象的release()方法进行释放。

<!-- source CN p7 unit 35 -->

初始化RKNN对象时,可以设置verbose和verbose_file参数,以打印详细的日志信息。其中verbose参数指定是否要打印详细日志信息;如果设置了verbose_file参数,且verbose参数值为True,日志信息还将写到该参数指定的文件中。

<!-- source CN p7 unit 36 -->

举例如下:

<!-- source CN p7 unit 37 -->

```python
# 打印详细的日志信息
rknn = RKNN(verbose=True)

...

rknn.release()
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

校对提示：原文日志示例仍显示 SDK 1.5.2，按历史示例保留，不作为 V2.5.0 实测结果。中英文环境表对 Ubuntu20.04 的 Python 列写法不同（中文 3.8/3.9、英文 3.8/3.8，Debian11 也存在相同差异），ARM64 段的 Debian 表头仍写 x64，均保留来源并提醒按实际安装包核对。V2.5.0 已新增 C++ codegen 章节并细化量化与内存策略；未用旧版参数替换新版。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
