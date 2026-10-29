---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Building, hybrid quantization and export"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-toolkit-api-build-quantize-export"
slug: "rknn-v250-toolkit-api-build-quantize-export"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Building, hybrid quantization and export | Complete parameters, examples and platform constraints"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Building, hybrid quantization and export | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-toolkit-api-build-quantize-export/"
---

## Platform scope and source

This article follows the RKNN V2.5.0 vendor PDF. Only the chips and interfaces listed in the source are in scope. For an ArmSoM board, check the SoC, NPU driver, Toolkit/Runtime, SDK/BSP and kernel versions first. No ArmSoM hardware validation has been performed; source examples and measurements are not ArmSoM test results.

## Series navigation

- [Requirements and object lifecycle](/articles/rknn-v250-toolkit-api-requirements-lifecycle/)
- [Model configuration and quantization parameters](/articles/rknn-v250-toolkit-api-configuration/)
- [Loading Caffe, TensorFlow, ONNX and PyTorch](/articles/rknn-v250-toolkit-api-model-loading/)
- [Building, hybrid quantization and export](/articles/rknn-v250-toolkit-api-build-quantize-export/)
- [Runtime, operator registration and inference](/articles/rknn-v250-toolkit-api-runtime-inference/)
- [Accuracy, performance, memory and device queries](/articles/rknn-v250-toolkit-api-evaluation-query/)
- [Generating, building and running C++ deployment examples](/articles/rknn-v250-toolkit-api-cpp-codegen/)

{% raw %}

<!-- source EN p15 unit 75 -->

## 5 Model Building and Quantization APIs

<!-- source EN p15 unit 76 -->

### 5.1 Building RKNN Model

<!-- source EN p15 unit 77 -->

| API | build |
| --- | --- |
| Description | Build corresponding RKNN model according to imported model. |
| Parameter | do_quantization: Whether to quantize the model. The default value is True. |
| Parameter | dataset: A input dataset for rectifying quantization parameters. Currently supports text<br>file format, the user can place the path of picture( jpg or png ) or npy file which is used for<br>rectification. A file path for each line. Such as:<br>a.jpg<br>b.jpg<br>or<br>a.npy<br>b.npy<br>If there are multiple inputs, the corresponding files are divided by space. Such as:<br>a.jpg a2.jpg<br>b.jpg b2.jpg<br>or<br>a.npy a2.npy<br>b.npy b2.npy<br>Note:<br>It is generally recommended to select the quantization image which is consistent with the<br>prediction scene. |
| Parameter | rknn_batch_size: Use to adjust batch size of input. default is None.<br>If greater than 1, NPU can inference multiple frames of input image or input data in one<br>inference. For example, original input of MobileNet is [1, 224, 224, 3], output shape is [1,<br>1001]. When rknn_batch_size is set to 4, the input shape of MobileNet becomes [4, 224,<br>224, 3], output shape becomes [4, 1001].<br>Note:<br>1. rknn_batch_size can improve performance (increase core utilization) only on NPU multi-<br>core platforms, so the value of rknn_batch_size is recommended to match the number of<br>NPU cores.<br>2. After the rknn_batch_size is modified, the shape of input and output will be modified. So<br>the inputs of inference should be set to correct size. It`s also needed to process the<br>returned outputs on post processing. |
| Parameter | auto_hybrid: Whether to enable automatic hybrid quantization to adjust accuracy or<br>overflow. The default value is False, which means no adjustment is performed. When the<br>model is being quantized, enabling auto_hybrid will convert operations with cosine distance<br>and euclidean distance below the specified thresholds to FP16 computation (currently only<br>supported for 'w8a8' quantization). When the model is not quantized, enabling auto_hybrid<br>will convert operations that exceed the FP16 value range to INT16 computation.<br>Note:<br>1. The thresholds for cosine distance and euclidean distance can be configured through<br>using auto_hybrid_cos_thresh and auto_hybrid_euc_thresh in the config interface. |
| Return<br>value | 0: Build successfully. |
| Return<br>value | -1: Build failed. |

<!-- source EN p16 unit 78 -->

The sample code is as follows:

<!-- source EN p16 unit 79 -->

```python
# Build and quantize RKNN model
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
```

<!-- source EN p16 unit 80 -->

### 5.2 Hybrid Quantization

<!-- source EN p16 unit 81 -->

#### 5.2.1 hybrid_quantization_step1

<!-- source EN p16 unit 82 -->

When using the hybrid quantization function, the main interface called in the first phase is hybrid_quantization_step1, which is used to generate the temporary model file (.model), the data file (.data), and the quantization configuration file (.quantization.cfg). Interface details are as follows:

<!-- source EN p16 unit 83 -->

| API | hybrid_quantization_step1 |
| --- | --- |
| Description | Corresponding temporary model files, data files, and quantization profiles are generated<br>according to the loaded original model. |
| Parameter | dataset: See 5.1 Building RKNN Model. |
| Parameter | rknn_batch_size: See 5.1 Building RKNN Model. |
| Parameter | proposal: Generate hybrid quantization config suggestions. The default value is False. |
| Parameter | proposal_dataset_size: The size of dataset used for proposal. The default value is 1.<br>Because the proposal function is time-consuming, so the default size is 1. |
| Parameter | custom_hybrid: Select the hybrid quantization subgraph according to multiple sets of<br>input names and output names specified by the user. The format is [[input0_name,<br>output0_name], [input1_name, output1_name], ...]. The default value is None.<br>Note: Input names and output names should be chosen based on the temporary model<br>file(.model). |
| Return<br>Value | 0: success. |
| Return<br>Value | -1: failure. |

<!-- source EN p16 unit 84 -->

The sample code is as follows:

<!-- source EN p16 unit 85 -->

```python
# Call hybrid_quantization_step1 to generate quantization config
ret = rknn.hybrid_quantization_step1(dataset='./dataset.txt')
```

<!-- source EN p16 unit 86 -->

#### 5.2.2 hybrid_quantization_step2

<!-- source EN p16 unit 87 -->

When using the hybrid quantization function, the primary interface for generating a hybrid quantized RKNN model phase call is hybrid_quantization_step2. The interface details are as follows:

<!-- source EN p16 unit 88 -->

| API | hybrid_quantization_step2 |
| --- | --- |
| Description | The temporary model file, the data file, the quantization profile, and the correction data<br>set are received as inputs, and the hybrid quantized RKNN model is generated. |
| Parameter | model_input: The temporary model file (.model) path generated in the<br>hybrid_quantization_step1. |
| Parameter | data_input: The model data file (.data) path generated in the hybrid_quantization_step1. |
| Parameter | model_quantization_cfg: Path to the modified model quantization configuration file<br>(.quantization.cfg) generated by hybrid_quantization_step1. |
| Return<br>Value | 0: success. |
| Return<br>Value | -1: failure. |

<!-- source EN p17 unit 90 -->

The sample code is as follows:

<!-- source EN p17 unit 91 -->

```python
# Call hybrid_quantization_step2 to generate hybrid quantized RKNN model
ret = rknn.hybrid_quantization_step2(
               model_input='./ssd_mobilenet_v2.model',
               data_input='./ssd_mobilenet_v2.data',
               model_quantization_cfg='./ssd_mobilenet_v2.quantization.cfg')
```

<!-- source EN p18 unit 92 -->

## 6 Export RKNN Model

<!-- source EN p18 unit 93 -->

The RKNN model built by ‘build’ interface can be saved as a file, it can used to model deployment.

<!-- source EN p18 unit 94 -->

| API | export_rknn |
| --- | --- |
| Description | Save RKNN model in the specified file (suffixed with ".rknn"). |
| Parameter | export_path: The path of generated RKNN model file. |
| Return Value | 0: Export successfully. |
| Return Value | -1: Export failed. |

<!-- source EN p18 unit 95 -->

The sample code is as follows:

<!-- source EN p18 unit 96 -->

```python
# save the built RKNN model as a mobilenet_v1.rknn file in the current path
ret = rknn.export_rknn(export_path='./mobilenet_v1.rknn')
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Editorial notes: Example logs still show SDK 1.5.2 and remain historical examples, not V2.5.0 measurements. The Ubuntu20.04 Python cell differs (Chinese 3.8/3.9; English 3.8/3.8, also differing for Debian11); the ARM64 section still labels Debian x64. Source values are retained; verify the actual installation package. V2.5.0 adds the C++ codegen chapter and refines quantization and memory strategies; older parameters have not replaced the new source.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
