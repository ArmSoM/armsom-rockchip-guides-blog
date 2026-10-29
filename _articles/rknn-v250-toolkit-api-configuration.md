---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Model configuration and quantization parameters"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-toolkit-api-configuration"
slug: "rknn-v250-toolkit-api-configuration"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Model configuration and quantization parameters | Complete parameters, examples and platform constraints"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Model configuration and quantization parameters | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-toolkit-api-configuration/"
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

<!-- source EN p8 unit 39 -->

## 3 Model Configuration API

<!-- source EN p8 unit 40 -->

Before the RKNN model is built, the model needs to be configured first through the config interface.

<!-- source EN p8 unit 41 -->

| API | config |
| --- | --- |
| Description | Set model convert parameters. |
| Parameter | mean_values: The mean values of the input. The parameter format is a list. The list<br>contains one or more mean sublists. The multi-input model corresponds to multiple<br>sublists. The length of each sublist is consistent with the number of channels of the input.<br>For example, if the parameter is [[128,128,128]], it means an input subtract 128 from the<br>values of the three channels.<br>The default value is None, means all means is zero. |
| Parameter | std_values: The normalized value of the input. The parameter format is a list. The list<br>contains one or more normalized value sublists. The multi-input model corresponds to<br>multiple sublists. The length of each sublist is consistent with the number of channels of<br>the input. For example, if the parameter is [[128,128,128]], it means the value of the three<br>channels of an input minus the average value and then divide by 128.<br>The default value is None, means all stds is one. |
| Parameter | quant_img_RGB2BGR: Indicates whether the RGB2BGR operation needs to be done first<br>when loading the quantized image. If there are multiple inputs, the corresponding<br>parameters for each input is split with ‘,’, such as [True, True, False]. The default value is<br>False.<br>This configuration is generally used on the Caffe model. Most of the Caffe model training<br>will perform RGB2BGR conversion on the dataset image firstly. At this time, the<br>configuration needs to be set to True.<br>In addition, this configuration is only valid for the quantized image format of jpg/png/bmp.<br>This configuration is ignored when the npy format is read. Therefore, when the model input<br>is BGR, npy also needs to be in BGR format.<br>This configuration is only used to read the quantize image in the quantization<br>stage (build interface) or in quantitative accuracy analysis (accuracy_analysis<br>interface), and will not be recorded in the final RKNN model. Therefore, if the<br>input of the model is BGR, you need to ensure that the imported image data is<br>also in BGR format before calling the inference of the toolkit or the run function<br>of the C-API. |
| Parameter | quantized_dtype: Quantization type. The currently supported types are "w8a8", "w4a16",<br>"w8a16", and "w16a16i_dfp". The default value is "w8a8".<br>- w8a8: The weight is 8bit asymmetric quantitative accuracy, and the activation value is<br>8bit asymmetric quantitative accuracy. (RK2118 not supported)<br>- w4a16: The weight is 4bit symmetric quantitative accuracy, the activation value is 16bit<br>floating point accuracy. Supported operations include convolutions with 'group=1' and<br>constant weights, as well as MatMul operators with constant inputs (which the tool<br>automatically converts to equivalent 1x1 convolutions); other operators are not supported.<br>(Only RK3576/RV1126B supported)<br>- w8a16: The weight is 8bit asymmetric quantitative accuracy, the activation value is<br>16bit floating point accuracy. (Only RK3562 supported)<br>- w16a16i_dfp: The weight is 16bit dynamic fixed-point quantitative accuracy, and the<br>activation value is 16bit dynamic fixed-point quantitative accuracy. (Only<br>RV1103/RV1106 supported) |
| Parameter | quantized_algorithm: The quantization algorithm used when calcaulating the<br>quantization parameters of each layer. Currently support: normal, mmse, kl_divergence<br>and gdq. The default value is normal.<br>The characteristic of normal quantization algorithm is fast. The recommended<br>quantization data is generally about 20-100 pieces. with more data, the accuracy may not<br>be further improved.<br>The mmse quantization algorithm is slower due to the violent iteration method, but usually<br>has higher accuracy than normal. The recommended quantization data is generally about<br>20-50 pieces. Users can also increase or decrease the amount of data appropriately<br>according to the length of the quantization time.<br>The kl_divergence quantization algorithm will take more time than normal, but will be<br>much less than mmse. In some scenarios(when the feature distribution is uneven), better<br>improvement effects can be obtained by “kl_divergence”. the recommended quantization<br>data is generally about 20-100 pieces.<br>The gdq quantization algorithm is only valid at w4a16 and w8a16, which can effectively<br>improve the weight accuracy of the w4a16 and w8a16. the recommended quantization<br>data is more than 200 pieces. |
| Parameter | quantized_method: Currently support layer, channel or group{SIZE}. The default value is<br>channel.<br>- layer: each weight has only one set of quantization parameters.<br>- channel: each channel of weight has its own set of quantization parameters. usually the<br>channel will be more accurate than the layer.<br>- group{SIZE}: On the basis of 'channel', the weight of each output channel is subdivided<br>into multiple groups according to {SIZE} on the input channel. each group has a set of<br>quantization parameters. Usually, group{SIZE} will be more accurate than channel. {SIZE}<br>is the multiple value of 32 between 32 and 256, such as 'group32' or 'group128'.<br>group{SIZE} is currently only valid when quantized_dtype = w4a16. |
| Parameter | float_dtype: Used to specify the data type of floating in the non-quantized case, the data<br>types currently supported are float16. The default value is float16. |
| Parameter | optimization_level: Model optimization level. The default value is 3.<br>By modifying the model optimization level, you can turn off some or all of the optimization<br>rules used in the model conversion process. The default value of this parameter is 3, and<br>all optimization options are turned on. When the value is 2 or 1, turn off some optimization<br>options that may affect the accuracy of some models. Turn off all optimization options<br>when the value is 0. |
| Parameter | target_platform: Specify which target chip platform the RKNN model is based on.<br>'rv1103', 'rv1103b', 'rv1106', 'rv1106b', 'rv1126b', 'rk2118', 'rk3562', 'rk3566', 'rk3568',<br>'rk3576' and 'rk3588' are currently supported. The function signature defaults to None, but<br>None is not a valid configuration value; this parameter must be set when calling config. |
| Parameter | custom_string: Add custom string information to RKNN model, then can query the<br>information at runtime. The default value is None. |
| Parameter | remove_weight: Remove the weights to generate a RKNN slave model that can share<br>weights with the full weighted RKNN model to reduce memory consumption. The default<br>value is False. |
| Parameter | compress_weight: Compress the weights of the model, which can reduce the size of<br>RKNN model. The default value is False. |
| Parameter | single_core_mode: Whether to generate only single-core model, which can reduce the<br>size and memory consumption of the RKNN model. The default value is False. Only valid for<br>RK3588 / RK3576. The default value is False. |
| Parameter | model_pruning: Pruning the model that can reduce the size and calculation of the<br>transformed RKNN model for models with sparse weights. The default value is False. |
| Parameter | op_target: Used to specify the target of each operation (NPU/CPU/GPU etc.), the format is<br>{'op0_output_name':'cpu', 'op1_output_name':'cpu', ...}, or through op_type, the format is<br>{'op_type':'cpu‘, 'op0_output_name':'cpu'....}, also supporting mix use of these two, e.g.,<br>{'op_type':'cpu‘, 'op0_output_name':'cpu'....}. The default value is None.<br>'op0_output_name' and 'op1_output_name' are the output tensor names of the<br>corresponding OP, which can be obtained from the returned results of the<br>accuracy_analysis feature. 'cpu' and 'npu' indicate that the execution target of the OP<br>corresponding to this tensor is CPU or NPU. The currently available options are: 'cpu' / 'npu'<br>/ 'gpu' / 'auto', and 'auto' is for automatically selecting the execution target.<br>Through op_type, it is obtained from returned results of the accuracy_analysis feature. This<br>can set up the execution target of all OP with this op_type within this model, e.g.,<br>{'Add':'cpu', 'Expand':'cpu',....}. |
| Parameter | dynamic_input: Simulate the function of dynamic input according to multiple sets of input<br>shapes specified by the user. the format is [[input0_shapeA, input1_shapeA, ...],<br>[input0_shapeB, input1_shapeB, ...], ...].<br>The default value is None, experimental.<br>For example, the input shape of the original model is [1,3,224,224] or [1,3,height,width] or<br>[1,3,-1,-1], but the model for deploy needs to support 3 input shapes: [1,3,224,224],<br>[1,3,192,192] and [1,3,160,160], you can set dynamic_input=[[[1,3,224,224]],<br>[[1,3,192,192]], [[1,3,160,160]]]. When converting to the RKNN model for inference, the<br>input data corresponding to the shape needs to be passed in.<br>Note:<br>1. This function can only be enabled when the original model itself supports<br>dynamic input, otherwise an error will be reported.<br>2. If the original model input shape itself is dynamic, only the dynamic axes can<br>set different values. |
| Parameter | quantize_weight: When 'do_quantization' of rknn.build is False, reduce the size of the<br>rknn model by quantizing some weights.<br>The default value is False. |
| Parameter | remove_reshape: Remove possible 'Reshape' in model inputs and outputs to improve<br>model runtime performance. default is False.<br>Note: Enabling this configuration may modify the shape of the input or output<br>nodes of the model. You need to pay attention to warning printing during the<br>conversion process, and you also need to consider the impact of input and<br>output shape changes when deploying. |
| Parameter | sparse_infer: Sparse inference on already sparsified models to improve performance.<br>Only valid for RK3576/RV1126B. default is False. |
| Parameter | enable_flash_attention: Whether to enable Flash Attention. default is False.<br>Note: FlashAttention is Based on https://arxiv.org/abs/2307.08691, acceleration and<br>reduced bandwidth usage can be achieved through cache in-loop implementation.<br>However, this may result in an increase in model size. Please choose whether to enable this<br>feature based on the specific scenario and model. For more details, please see the<br>'exSDPAttention' description in 'RKNN Compiler Support Operator List'. |
| Parameter | auto_hybrid_cos_thresh: The threshold for cosine distance in automatic hybrid<br>quantization during model quantization. The default value is 0.98. |
| Parameter | auto_hybrid_euc_thresh: The threshold for euclidean distance in automatic hybrid<br>quantization during model quantization. The default value is None, meaning it is not<br>enabled. |
| Parameter | memory_plan_strategy: Specifies the internal memory allocation scheme during RKNN<br>model compilation, affecting the memory usage of the final model during inference.<br>Options include “BestFit”, "GreedyBySize", "GreedyByLifetime", and "SlowPeakGrowth".<br>Default as "BestFit".<br>BestFit - All tasks are sorted by their start time. If the start time matches, the task with<br>the largest memory footprint is prioritized. Then, the task memory addresses are allocated<br>one by one. Among the allocated memory addresses, the task finds the closest free<br>memory block to the current task.<br>GreedyBySize - All tasks are sorted by the required memory size. If the memory size is<br>the same, the one with the earlier start time takes priority. Allocate one by one, and find<br>the free memory with the closest size to the current task in the allocated memory address.<br>GreedyByLifetime - All tasks are sorted by their start time. When the start time is the<br>same, the one with larger memory is given priority. Collect the end address of each<br>allocated memory as a candidate (including the 0 address in addition), find the candidate<br>address with the longest life cycle and no conflict in the low bit, and traverse it in a loop<br>until the allocation is completed.<br>SlowPeakGrowth - All tasks are sorted by start time. When the start time is the same,<br>the one with larger memory is given priority. Collect the end address of each allocated<br>memory as a candidate (including the 0 address in addition), find the task that minimizes<br>the peak memory growth and the candidate address with no conflict in the low bit, and<br>traverse it in a loop until the allocation is completed. |
| Parameter | compute_order: Specifies the topological order of the graph during RKNN inference. This<br>parameter affects the internal memory usage of some models during inference, especially<br>models with multi-branch structures. Options include "WidthFirst" and "DepthFirst". Default<br>as "WidthFirst". |
| Return<br>Value | 0: Configuration succeeded.<br>Raises ValueError if the configuration is invalid. |

<!-- source EN p11 unit 45 -->

The sample code is as follows:

<!-- source EN p11 unit 46 -->

```python
# model config
rknn.config(mean_values=[[103.94, 116.78, 123.68]],
           std_values=[[58.82, 58.82, 58.82]],
           quant_img_RGB2BGR=True,
           target_platform='rk3566')
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Editorial notes: Example logs still show SDK 1.5.2 and remain historical examples, not V2.5.0 measurements. The Ubuntu20.04 Python cell differs (Chinese 3.8/3.9; English 3.8/3.8, also differing for Debian11); the ARM64 section still labels Debian x64. Source values are retained; verify the actual installation package. V2.5.0 adds the C++ codegen chapter and refines quantization and memory strategies; older parameters have not replaced the new source.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
