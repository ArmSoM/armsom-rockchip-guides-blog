---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Accuracy, performance, memory and device queries"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-toolkit-api-evaluation-query"
slug: "rknn-v250-toolkit-api-evaluation-query"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Accuracy, performance, memory and device queries | Complete parameters, examples and platform constraints"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Accuracy, performance, memory and device queries | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-toolkit-api-evaluation-query/"
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

<!-- source EN p23 unit 121 -->

## 8 Accuracy, Performance, and Memory Evaluation APIs

<!-- source EN p23 unit 123 -->

### 8.1 Quantization Accuracy Analysis

<!-- source EN p23 unit 124 -->

The function of this interface is inference with quantized model and generate outputs of each layers for quantitative accuracy analysis.

<!-- source EN p23 unit 125 -->

| API | accuracy_analysis |
| --- | --- |
| Description | Inference with quantized model and generate snapshot, that is dump tensor data of each<br>layers. It will dump a snapshot of both data types include fp32 & quant for calculate<br>quantitative error.<br>Note:<br>1. This interface can only be called after build or hybrid_quantization_step2.<br>2. If target is None and the original model is quantized model (QAT model), the<br>call will fail.<br>3. The quantization method used by this interface is consistent with the setting<br>in config. |
| Parameter | inputs: the path list of image (jpg/png/bmp/npy). |
| Parameter | output_dir: output directory, all snapshot data will stored here. The default value is<br>'./snapshot'.<br>If the target is not set, the following content will be output under ‘output_dir’:<br>- Directory simulator: Save the results of each layer on simulator when the entire<br>quantitative model is fully run (The output has been converted to float32).<br>- Directory golden: Save the results of each layer on simulator when the entire floating-<br>point model is completely run down.<br>- error_analysis.txt: Record the the cosine distance (entire_error and single_error) between<br>each layer result on simulator and the floating-point model on simulator during the<br>complete calculation of the quantized model. The different of entire_error/single_error is<br>the input of each layer is come from the quantization model or floating-point model. See<br>the error_analysis.txt file for more details.<br>If the target is set, more content will output under ‘output_dir’:<br>- Directory runtime: Save the results of each layer when the entire quantitative model is<br>fully run in NPU (The output has been converted to float32).<br>- error_analysis.txt: Record the the cosine distance (entire_error) between each layer result<br>on simulator and each layer on NPU during the complete calculation of the quantized<br>model additionally. See the error_analysis.txt file for more details. |
| Parameter | target: Target hardware platform, now supports 'rv1103', 'rv1103b', 'rv1106', 'rv1106b',<br>'rv1126b', 'rk3562', 'rk3566', 'rk3568', 'rk3576' and 'rk3588'. The default value is "None".<br>If target is set, the output of each layer of NPU will be obtained, and analyze it’s accuracy. |
| Parameter | device_id: Device identity number, if multiple devices are connected to PC, this parameter<br>needs to be specified which can be obtained by calling "list_devices" interface. The default<br>value is "None ". |
| Return<br>Value | 0: success. |
| Return<br>Value | -1: failure. |

<!-- source EN p23 unit 126 -->

The sample code is as follows:

<!-- source EN p24 unit 127 -->

```python
# Accuracy analysis
ret = rknn.accuracy_analysis(inputs=['./dog_224x224.jpg'])
```

<!-- source EN p24 unit 128 -->

### 8.2 Evaluate Model Performance

<!-- source EN p24 unit 129 -->

| API | eval_perf |
| --- | --- |
| Description | Evaluate model performance.<br>Model must run on RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 /<br>RK3568 / RK3576 / RK3588 which connected to PC.If setting perf_debug to False when<br>initializing runtime environment via the interface of “init_runtime”, the performance<br>information is obtained from hardware, which only contains the total running time of<br>model. If the perf_debug is set to True, the running time of each layer will also be captured<br>in detail. |
| Parameter | is_print: Whether to print performance information. The default value is True. |
| Parameter | fix_freq: Whether to fix hardware frequency. The default value is True. |
| Return<br>Value | perf_result: Performance information (strings). |

<!-- source EN p24 unit 130 -->

The sample code is as follows:

<!-- source EN p24 unit 131 -->

```python
# Evaluate model performance
perf_detail = rknn.eval_perf()
```

<!-- source EN p24 unit 132 -->

### 8.3 Evaluating Memory Usage

<!-- source EN p24 unit 133 -->

| API | eval_memory |
| --- | --- |
| Description | Fetch memory usage when model is running on hardware platform.<br>Model must run on RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 /<br>RK3568 / RK3576 / RK3588 which connected to PC. |
| Parameter | is_print: Whether to print memory evaluation results in the canonical format. The default<br>value is True. |
| Return<br>Value | memory_detail: Detail information of memory usage. Data format is dictionary.<br>Data shows as below:<br>{<br>'weight_memory': 3698688,<br>'internal_memory': 1756160,<br>'other_memory': 484352,<br>'total_memory': 5939200,<br>}<br>- The 'weight_memory' represents the memory footprint of the weights in the model.<br>- The 'internal_memory' represents the memory usage of the internal tensor in the model.<br>- The 'other_memory' represents the memory usage of other tensor in the model.<br>- The 'total_memory' represents the memory footprint of the model, that is, the sum of the<br>weight, internal tensor and other memory. |

<!-- source EN p24 unit 134 -->

The sample code is as follows:

<!-- source EN p25 unit 135 -->

```python
# eval memory usage
memory_detail = rknn.eval_memory()
```

<!-- source EN p25 unit 136 -->

For examples/caffe/mobilenet_v2 in examples directory, the memory usage when model running on RK3588 is printed as follows:

<!-- source EN p25 unit 137 -->

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

<!-- source EN p25 unit 138 -->

### 8.4 List Devices

<!-- source EN p25 unit 139 -->

| API | list_devices |
| --- | --- |
| Description | List connected RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 /<br>RK3568 / RK3576 / RK3588.<br>Note: There are currently two device connection modes: ADB and NTB. Make sure their<br>modes are the same when connecting multiple devices. |
| Parameter | None. |
| Return<br>Value | Return adb_devices list and ntb_devices list. If there are no devices connected to PC, it will<br>return two empty list. |

<!-- source EN p25 unit 140 -->

The sample code is as follows:

<!-- source EN p25 unit 141 -->

```python
rknn.list_devices()
```

<!-- source EN p25 unit 142 -->

The devices list looks like below:

<!-- source EN p25 unit 143 -->

```text
*************************
all device(s) with adb mode:
VD46C3KM6N
*************************
```

<!-- source EN p26 unit 144 -->

## 9 SDK Version Query API

<!-- source EN p26 unit 145 -->

| API | get_sdk_version |
| --- | --- |
| Description | Get API version and driver version of referenced SDK.<br>Note: Before we use this interface, we must load model and initialize runtime first. And this<br>API can only used on RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566<br>/ RK3568 / RK3576 / RK3588. |
| Parameter | None. |
| Return<br>Value | sdk_version: API and driver version. Data type is string. |

<!-- source EN p26 unit 146 -->

The sample code is as follows:

<!-- source EN p26 unit 147 -->

```python
# Get SDK version
sdk_version = rknn.get_sdk_version()
print(sdk_version)
```

<!-- source EN p26 unit 148 -->

The SDK version looks like below:

<!-- source EN p26 unit 149 -->

```text
==============================================
RKNN VERSION:
    API: 1.5.2 (8babfea build@2023-08-25T02:31:12)
    DRV: rknn_server: 1.5.2 (8babfea build@2023-08-25T10:30:12)
    DRV: rknnrt: 1.5.3b13 (42cbca6f5@2023-10-27T10:13:21)
==============================================
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Editorial notes: Example logs still show SDK 1.5.2 and remain historical examples, not V2.5.0 measurements. The Ubuntu20.04 Python cell differs (Chinese 3.8/3.9; English 3.8/3.8, also differing for Debian11); the ARM64 section still labels Debian x64. Source values are retained; verify the actual installation package. V2.5.0 adds the C++ codegen chapter and refines quantization and memory strategies; older parameters have not replaced the new source.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
