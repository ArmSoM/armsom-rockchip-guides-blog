---
title: "RKNN-Toolkit2 API Reference: Configuration, Conversion, Quantization and Inference"
description: "Complete V2.3.2 reference for framework dependencies, all Toolkit2 API parameters, hybrid quantization, accuracy/performance/memory evaluation and custom operators."
translation_key: "093-rockchip-rknn-toolkit2-api"
slug: "093-rockchip-rknn-toolkit2-api"
lang: "en"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []
tags: ["Rockchip", "RKNN", "Toolkit2", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip RKNN Toolkit2 Python API quantization"
excerpt: "Complete V2.3.2 reference for framework dependencies, all Toolkit2 API parameters, hybrid quantization, accuracy/performance/memory evaluation and custom operators."
---

{% raw %}

# RKNN-Toolkit2 API Reference: Configuration, Conversion, Quantization and Inference

## ArmSoM applicability and source

This is a Rockchip platform reference, not an ArmSoM test report. Sources: RK-YH-YF-412, V2.3.2, 22 Chinese and 25 English pages. Chinese follows the Chinese source; English follows the English source, fully translated into Russian and German. Neither PDF contains technical figures; all content is editable text, tables and code, without invented English images. The source covers RV1103/RV1103B/RV1106/RV1106B/RV1126B, RK2118, RK3562 and RK3566/3568/3576/3588 series, but specifies no SDK/BSP or kernel combination for a concrete ArmSoM board. Check NPU driver, Toolkit2/Runtime/Server versions, host OS/architecture, Python, framework and model format. Do not generalize x64 capabilities to ARM64. Version, top-5, memory and SDK outputs are source examples, not ArmSoM tests. V2.3.2 is the source snapshot, not a claim about the latest release.

> Editorial note: same-version sources still differ. For Ubuntu20.04 the Chinese Python cell is 3.8/3.9, but English says 3.8/3.8; the ARM64 section labels Debian entries x64. Source values are retained without guessing compatibility. See editorial notes for all caveats; API/code examples are not ArmSoM-validated adaptations.

[EDITORIAL-NOTES](/docs/rockchip-rknn-toolkit2-api/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)


<!-- source: EN PDF p4; unit 0 -->

## 1 Requirement

<!-- source: EN PDF p4; unit 1 -->

### 1.1 Applicable chip model

<!-- source: EN PDF p4; unit 2 -->

RV1103

<!-- source: EN PDF p4; unit 3 -->

RV1103B

<!-- source: EN PDF p4; unit 4 -->

RV1106

<!-- source: EN PDF p4; unit 5 -->

RV1106B

<!-- source: EN PDF p4; unit 6 -->

RV1126B

<!-- source: EN PDF p4; unit 7 -->

RK2118

<!-- source: EN PDF p4; unit 8 -->

RK3562

<!-- source: EN PDF p4; unit 9 -->

RK3566 series

<!-- source: EN PDF p4; unit 10 -->

RK3568 series

<!-- source: EN PDF p4; unit 11 -->

RK3576 series

<!-- source: EN PDF p4; unit 12 -->

RK3588 series

<!-- source: EN PDF p4; unit 13 -->

Note: RK3566 / RK3568 / RK3576 / RK3588 are collectively referred to as RK3566 series / RK3568 series / RK3576 series / RK3588 series in the following text.

<!-- source: EN PDF p4; unit 14 -->

### 1.2 Requirements Dependencies

<!-- source: EN PDF p4; unit 15 -->

It is recommended to meet the following requirements in the operating system environment:

<!-- source: EN PDF p4; unit 16 -->

| Operating system<br>version | Ubuntu18.04<br>(x64) | Ubuntu20.04<br>(x64) | Ubuntu22.04<br>(x64) | Ubuntu24.04<br>(x64) |
| --- | --- | --- | --- | --- |
| Python version | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 | 3.12 |

<!-- source: EN PDF p4; unit 17 -->

For ARM64:

<!-- source: EN PDF p4; unit 18 -->

| Operating system version | Debian10 (x64) | Debian11 (x64) | Debian12 (x64) |
| --- | --- | --- | --- |
| Python version | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 / 3.12 |

<!-- source: EN PDF p4; unit 19 -->

Note:

<!-- source: EN PDF p4; unit 20 -->

1\. For more detail about python library dependencies, see doc/requirements*.txt

<!-- source: EN PDF p4; unit 21 -->

2\. This document mainly uses Ubuntu 20.04 / Python3.8 as an example.

<!-- source: EN PDF p4; unit 22 -->

### 1.3 Supported Deep Learning Framework

<!-- source: EN PDF p4; unit 23 -->

The deep learning frameworks supported by RKNN-Toolkit2 include Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet and PyTorch.

<!-- source: EN PDF p4; unit 24 -->

The corresponding relationship between RKNN-Toolkit2 and the version of each deep learning framework is as follows:

<!-- source: EN PDF p5; unit 25 -->

| RKNN-Toolkit2 | Caffe | TensorFlow | TF Lite | ONNX | DarkNet | PyTorch |
| --- | --- | --- | --- | --- | --- | --- |
| 1.4.0<br>1.4.2<br>1.5.0<br>1.5.2 | 1.0 | 1.12.0<br>~2.8.0 | Schema<br>version=3 | 1.7.0<br>~1.10.0 | Commit ID:<br>810d7f7 | 1.6.0<br>~1.10.1 |
| 1.6.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema<br>version=3 | 1.7.0<br>~1.14.0 | Commit ID:<br>810d7f7 | 1.6.0<br>~1.13.1 |
| 2.0.0<br>2.1.0<br>2.2.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema<br>version=3 | 1.7.0<br>~1.14.1 | Commit ID:<br>810d7f7 | 1.10.1<br>~2.1.0 |
| 2.3.0<br>2.3.2 | 1.0 | 1.12.0<br>~2.14.0 | Schema<br>version=3 | 1.7.0<br>~1.17.0 | Commit ID:<br>810d7f7 | 1.10.1<br>~2.4.0 |

<!-- source: EN PDF p5; unit 26 -->

Note:

<!-- source: EN PDF p5; unit 27 -->

1\. Due to the compatibility of TensorFlow versions, the pb files exported by versions before TensorFlow 1.12.0 are also supported in theory.. For more information about the compatibility of different TensorFlow versions, please refer to official documentation: [https://www.tensorflow.org/guide/versions](https://www.tensorflow.org/guide/versions)

<!-- source: EN PDF p5; unit 28 -->

2\. Since the schemas of different versions of TFLite are incompatible with each other, TFLite model exported from a different schema compared to the schema version RKNN-Toolkit2 relies may cause loading failure.

<!-- source: EN PDF p5; unit 29 -->

3\. The Caffe protocols used by RKNN-Toolkit2 is the protocol based on the official modification of berkeley. The protocol based on berkeley's official modification comes from: [https://github.com/BVLC/caffe/tree/master/src/caffe/proto](https://github.com/BVLC/caffe/tree/master/src/caffe/proto) and the commit ID is 828dd10. RKNN-Toolkit2 adds some OPs on this basis.

<!-- source: EN PDF p5; unit 30 -->

4\. For the relationship between ONNX release versions and opset versions and IR versions, please refer to the onnxruntime official website: [https://github.com/microsoft/onnxruntime/blob/v1.10.0/docs/Versioning.md](https://github.com/microsoft/onnxruntime/blob/v1.10.0/docs/Versioning.md)

<!-- source: EN PDF p5; unit 31 -->

5\. The official Github link of DarkNet: [https://github.com/pjreddie/darknet.](https://github.com/pjreddie/darknet.) RKNN-Toolkit2’s current conversion rules are based on the latest submission of the master branch (commit number: 810d7f7).

<!-- source: EN PDF p5; unit 32 -->

6\. When loading the PyTorch model (torchscript model), it is recommended using the same version of PyTorch to export model and convert model to RKNN model. Inconsistency may result in failure when transferring to the RKNN model.

<!-- source: EN PDF p5; unit 33 -->

7\. ARM64 only supports the PyTorch and ONNX. Other framework is not supported at the moment.

<!-- source: EN PDF p6; unit 34 -->

## 2 RKNN-Toolkit2 API description

<!-- source: EN PDF p6; unit 35 -->

### 2.1 RKNN initialization and release

<!-- source: EN PDF p6; unit 36 -->

The initialization/release function group consists of API interfaces to initialize and release the RKNN object as needed. The RKNN() must be called before using all the API interfaces of RKNN-Toolkit2, and call the release() method to release the object when task finished.

<!-- source: EN PDF p6; unit 37 -->

When the RKNN object is initing, the users can set verbose and verbose_file parameters, used to print detailed log information of model loading, building and so on. The data type of verbose parameter is bool. If the value of this parameter is set to True, the RKNN-Toolkit2 will print detailed log information. The data type of verbose_file is string. If the value of this parameter is set to a file path, the detailed log information will be written to this file (the verbose also need be set to True).

<!-- source: EN PDF p6; unit 38 -->

The sample code is as follows:

<!-- source: EN PDF p6; unit 39 -->

```text
# Print the detailed log information.
rknn = RKNN(verbose=True)

…

rknn.release()
```

<!-- source: EN PDF p6; unit 40 -->

### 2.2 Model configuration

<!-- source: EN PDF p6; unit 41 -->

Before the RKNN model is built, the model needs to be configured first through the config interface.

<!-- source: EN PDF p6; unit 42 -->

| API | config |
| --- | --- |
| Description | Set model convert parameters. |
| Parameter | mean_values: The mean values of the input. The parameter format is a list. The list contains<br>one or more mean sublists. The multi-input model corresponds to multiple sublists. The length<br>of each sublist is consistent with the number of channels of the input. For example, if the<br>parameter is [[128,128,128]], it means an input subtract 128 from the values of the three<br>channels.<br>The default value is None, means all means is zero. |
| Parameter | std_values: The normalized value of the input. The parameter format is a list. The list<br>contains one or more normalized value sublists. The multi-input model corresponds to<br>multiple sublists. The length of each sublist is consistent with the number of channels of the<br>input. For example, if the parameter is [[128,128,128]], it means the value of the three<br>channels of an input minus the average value and then divide by 128.<br>The default value is None, means all stds is one. |
| Parameter | quant_img_RGB2BGR: Indicates whether the RGB2BGR operation needs to be done first<br>when loading the quantized image. If there are multiple inputs, the corresponding parameters<br>for each input is split with ‘,’, such as [True, True, False]. The default value is False.<br>This configuration is generally used on the Caffe model. Most of the Caffe model training will<br>perform RGB2BGR conversion on the dataset image firstly. At this time, the configuration<br>needs to be set to True.<br>In addition, this configuration is only valid for the quantized image format of jpg/png/bmp.<br>This configuration is ignored when the npy format is read. Therefore, when the model input is<br>BGR, npy also needs to be in BGR format.<br>This configuration is only used to read the quantize image in the quantization stage<br>(build interface) or in quantitative accuracy analysis (accuracy_analysis interface), and<br>will not be recorded in the final RKNN model. Therefore, if the input of the model is<br>BGR, you need to ensure that the imported image data is also in BGR format before<br>calling the inference of the toolkit or the run function of the C-API. |
| Parameter | quantized_dtype: Quantization type, the quantization types currently supported are "w8a8",<br>"w4a16", "w8a16", "w4a8", "w16a16i" and "w16a16i_dfp". The default value is "w8a8".<br>- w8a8: The weight is 8bit asymmetric quantitative accuracy, and the activation value is 8bit<br>asymmetric quantitative accuracy. (RK2118 not supported)<br>- w4a16: The weight is 4bit asymmetric quantitative accuracy, the activation value is 16bit<br>floating point accuracy. (Only RK3576/RV1126B supported)<br>- w8a16: The weight is 8bit asymmetric quantitative accuracy, the activation value is 16bit<br>floating point accuracy. (Only RK3562 supported)<br>- w4a8: The weight is 4bit asymmetric quantitative accuracy, the activation value is 8bit<br>asymmetric quantitative accuracy. (Not supported yet)<br>- w16a16i: The weight is 16bit asymmetric quantitative accuracy, the activation value is 16bit<br>asymmetric quantitative accuracy. (Only RV1103/RV1106 supported)<br>- w16a16i_dfp: The weight is 16bit dynamic fixed-point quantitative accuracy, and the<br>activation value is 16bit dynamic fixed-point quantitative accuracy. (Only RV1103/RV1106<br>supported) |
| Parameter | quantized_algorithm: The quantization algorithm used when calcaulating the quantization<br>parameters of each layer. Currently support: normal, mmse, kl_divergence and gdq. The<br>default value is normal.<br>The characteristic of normal quantization algorithm is fast. The recommended quantization<br>data is generally about 20-100 pieces. with more data, the accuracy may not be further<br>improved.<br>The mmse quantization algorithm is slower due to the violent iteration method, but usually<br>has higher accuracy than normal. The recommended quantization data is generally about 20-<br>50 pieces. Users can also increase or decrease the amount of data appropriately according to<br>the length of the quantization time.<br>The kl_divergence quantization algorithm will take more time than normal, but will be much<br>less than mmse. In some scenarios(when the feature distribution is uneven), better<br>improvement effects can be obtained by “kl_divergence”. the recommended quantization data<br>is generally about 20-100 pieces.<br>The gdq quantization algorithm is only valid at w4a16 and w8a16, which can effectively<br>improve the weight accuracy of the w4a16 and w8a16. the recommended quantization data is<br>more than 200 pieces. |
| Parameter | quantized_method: Currently support layer, channel or group{SIZE}. The default value is<br>channel.<br>- layer: each weight has only one set of quantization parameters.<br>- channel: each channel of weight has its own set of quantization parameters. usually the<br>channel will be more accurate than the layer.<br>- group{SIZE}: On the basis of 'channel', the weight of each output channel is subdivided into<br>multiple groups according to {SIZE} on the input channel. each group has a set of<br>quantization parameters. Usually, group{SIZE} will be more accurate than channel. {SIZE} is<br>the multiple value of 32 between 32 and 256, such as 'group32' or 'group128'. group{SIZE} is<br>currently only valid when quantized_dtype = w4a16. |
| Parameter | float_dtype: Used to specify the data type of floating in the non-quantized case, the data types<br>currently supported are float16. The default value is float16. |
| Parameter | optimization_level: Model optimization level. The default value is 3.<br>By modifying the model optimization level, you can turn off some or all of the optimization<br>rules used in the model conversion process. The default value of this parameter is 3, and all<br>optimization options are turned on. When the value is 2 or 1, turn off some optimization<br>options that may affect the accuracy of some models. Turn off all optimization options when<br>the value is 0. |
| Parameter | target_platform: Specify which target chip platform the RKNN model is based on. 'rv1103',<br>'rv1103b', 'rv1106', 'rv1106b', 'rv1126b', 'rk2118', 'rk3562', 'rk3566', 'rk3568', 'rk3576' and<br>'rk3588' are currently supported. The default value is None. |
| Parameter | custom_string: Add custom string information to RKNN model, then can query the<br>information at runtime. The default value is None. |
| Parameter | remove_weight: Remove the weights to generate a RKNN slave model that can share weights<br>with the full weighted RKNN model to reduce memory consumption. The default value is<br>False. |
| Parameter | compress_weight: Compress the weights of the model, which can reduce the size of RKNN<br>model. The default value is False. |
| Parameter | single_core_mode: Whether to generate only single-core model, which can reduce the size<br>and memory consumption of the RKNN model. The default value is False. Only valid for<br>RK3588 / RK3576. The default value is False. |
| Parameter | model_pruning: Pruning the model that can reduce the size and calculation of the<br>transformed RKNN model for models with sparse weights. The default value is False. |
| Parameter | op_target: Used to specify the target of each operation (NPU/CPU/GPU etc.), the format is<br>{'op0_output_name':'cpu', 'op1_output_name':'cpu', ...}, or through op_type, the format is<br>{'op_type':'cpu‘, 'op0_output_name':'cpu'....}, also supporting mix use of these two, e.g.,<br>{'op_type':'cpu‘, 'op0_output_name':'cpu'....}. The default value is None.<br>'op0_output_name' and 'op1_output_name' are the output tensor names of the corresponding<br>OP, which can be obtained from the returned results of the accuracy_analysis feature. 'cpu' and<br>'npu' indicate that the execution target of the OP corresponding to this tensor is CPU or NPU.<br>The currently available options are: 'cpu' / 'npu' / 'gpu' / 'auto', and 'auto' is for automatically<br>selecting the execution target.<br>Through op_type, it is obtained from returned results of the accuracy_analysis feature. This<br>can set up the execution target of all OP with this op_type within this model, e.g., {'Add':'cpu',<br>'Expand':'cpu',....}. |
| Parameter | dynamic_input: Simulate the function of dynamic input according to multiple sets of input<br>shapes specified by the user. the format is [[input0_shapeA, input1_shapeA, ...],<br>[input0_shapeB, input1_shapeB, ...], ...].<br>The default value is None, experimental.<br>For example, the input shape of the original model is [1,3,224,224] or [1,3,height,width] or<br>[1,3,-1,-1], but the model for deploy needs to support 3 input shapes: [1,3,224,224],<br>[1,3,192,192] and [1,3,160,160], you can set dynamic_input=[[[1,3,224,224]], [[1,3,192,192]],<br>[[1,3,160,160]]]. When converting to the RKNN model for inference, the input data<br>corresponding to the shape needs to be passed in.<br>Note:<br>1. This function can only be enabled when the original model itself supports dynamic<br>input, otherwise an error will be reported.<br>2. If the original model input shape itself is dynamic, only the dynamic axes can set<br>different values. |
| Parameter | quantize_weight: When 'do_quantization' of rknn.build is False, reduce the size of the rknn<br>model by quantizing some weights.<br>The default value is False. |
| Parameter | remove_reshape: Remove possible 'Reshape' in model inputs and outputs to improve model<br>runtime performance. default is False.<br>Note: Enabling this configuration may modify the shape of the input or output nodes of<br>the model. You need to pay attention to warning printing during the conversion process,<br>and you also need to consider the impact of input and output shape changes when<br>deploying. |
| Parameter | sparse_infer: Sparse inference on already sparsified models to improve performance. Only<br>valid for RK3576/RV1126B. default is False. |
| Parameter | enable_flash_attention: Whether to enable Flash Attention. default is False.<br>Note: FlashAttention is Based on https://arxiv.org/abs/2307.08691, acceleration and reduced<br>bandwidth usage can be achieved through cache in-loop implementation. However, this may<br>result in an increase in model size. Please choose whether to enable this feature based on the<br>specific scenario and model. For more details, please see the 'exSDPAttention' description in<br>'RKNN Compiler Support Operator List'. |
| Parameter | auto_hybrid_cos_thresh： The threshold for cosine distance in automatic hybrid<br>quantization during model quantization. The default value is 0.98. |
| Parameter | auto_hybrid_euc_thresh： The threshold for euclidean distance in automatic hybrid<br>quantization during model quantization. The default value is None, meaning it is not enabled. |
| Return<br>Value | None. |

<!-- source: EN PDF p10; unit 47 -->

The sample code is as follows:

<!-- source: EN PDF p10; unit 48 -->

```text
# model config
rknn.config(mean_values=[[103.94, 116.78, 123.68]],
     std_values=[[58.82, 58.82, 58.82]],
     quant_img_RGB2BGR=True,
     target_platform='rk3566')
```

<!-- source: EN PDF p10; unit 49 -->

### 2.3 Loading model

<!-- source: EN PDF p10; unit 50 -->

RKNN-Toolkit2 currently supports load non-RKNN models of Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet, PyTorch. There are different calling interfaces when loading models, the loading interfaces are described in detail below.

<!-- source: EN PDF p10; unit 51 -->

#### 2.3.1 Loading Caffe model

<!-- source: EN PDF p10; unit 52 -->

| API | load_caffe |
| --- | --- |
| Description | Load Caffe model. (Unavailable in ARM64) |
| Parameter | model: The path of Caffe model structure file (suffixed with ".prototxt" ). |
| Parameter | blobs: The path of Caffe model binary data file (suffixed with ".caffemodel"). |
| Parameter | input_name: When the Caffe model has multiple inputs, you can specify the order of the<br>input layer names through this parameter, such as ['input1','input2','input3'],note that the name<br>needs to be consistent with the model input name；The default value is None, means the<br>sequence is automatically given by the Caffe model file (file suffix with .prototxt). |
| Return<br>Value | 0: Import successfully. |
| Return<br>Value | -1: Import failed. |

<!-- source: EN PDF p11; unit 54 -->

The sample code is as follows:

<!-- source: EN PDF p11; unit 55 -->

```text
# Load the mobilenet_v2 Caffe model in the current path
ret = rknn.load_caffe(model='./mobilenet_v2.prototxt',
          blobs='./mobilenet_v2.caffemodel')
```

<!-- source: EN PDF p11; unit 56 -->

#### 2.3.2 Loading TensorFlow model

<!-- source: EN PDF p11; unit 57 -->

| API | load_tensorflow |
| --- | --- |
| Description | Load TensorFlow model. (Unavailable in ARM64) |
| Parameter | tf_pb: The path of TensorFlow model file (suffixed with ".pb"). |
| Parameter | inputs: The input node (operand name) of model, input with multiple nodes is supported now.<br>All the input node string are placed in a list. |
| Parameter | input_size_list: The shapes of input node, all the input shape are placed in a list. As in the<br>example of ssd_mobilenet_v1 model, the input_size_list parameter should be set to<br>[[1,300,300,3]]. |
| Parameter | outputs: The output node (operand name) of model, output with multiple nodes is supported<br>now. All the output nodes are placed in a list. |
| Parameter | input_is_nchw: Whether the input layout of the model is already NCHW. The default value is<br>False, means the default input layout is NHWC. |
| Return<br>value | 0: Import successfully. |
| Return<br>value | -1: Import failed. |

<!-- source: EN PDF p11; unit 58 -->

The sample code is as follows:

<!-- source: EN PDF p11; unit 59 -->

```text
# Load ssd_mobilenet_v1_coco_2017_11_17 TF model in the current path
ret = rknn.load_tensorflow(tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
            inputs=['Preprocessor/sub'],
            outputs=['concat', 'concat_1'],
            input_size_list=[[300, 300, 3]])
```

<!-- source: EN PDF p12; unit 60 -->

#### 2.3.3 Loading TensorFlow Lite model

<!-- source: EN PDF p12; unit 61 -->

| API | load_tflite |
| --- | --- |
| Description | Load TensorFlow Lite model. (Unavailable in ARM64) |
| Parameter | model: The path of TensorFlow Lite model file (suffixed with ".tflite"). |
| Parameter | input_is_nchw: Whether the input layout of the model is already NCHW. The default value<br>is False, that is, the default input layout is NHWC. |
| Return<br>Value | 0: Import successfully. |
| Return<br>Value | -1: Import failed. |

<!-- source: EN PDF p12; unit 62 -->

The sample code is as follows:

<!-- source: EN PDF p12; unit 63 -->

```text
# Load the mobilenet_v1 TF-Lite model in the current path
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

<!-- source: EN PDF p12; unit 64 -->

#### 2.3.4 Loading ONNX model

<!-- source: EN PDF p12; unit 65 -->

| API | load_onnx |
| --- | --- |
| Description | Load ONNX model. |
| Parameter | model: The path of ONNX model file (suffixed with ".onnx"). |
| Parameter | inputs: The input node (operand name) of model, input with multiple nodes is supported now.<br>All the input node string are placed in a list. The default value is None, means get from<br>model. |
| Parameter | input_size_list: The shapes of input node, all the input shape are placed in a list. If inputs set,<br>the input_size_list should be set also. defualt is None. |
| Parameter | input_initial_val: Set the initial value of the model input, the format is ndarray list. The<br>default value is None.<br>Mainly used to fix some input as constant, For the input that does not need to be fix as a<br>constant, it can be set to None, such as [None, np.array([1])]. |
| Parameter | outputs: The output node (operand name) of model, output with multiple nodes is supported<br>now. All the output nodes are placed in a list. The default value is None, means get from<br>model. |
| Return<br>Value | 0: Import successfully. |
| Return<br>Value | -1: Import failed. |

<!-- source: EN PDF p12; unit 66 -->

The sample code is as follows:

<!-- source: EN PDF p13; unit 67 -->

```text
# Load the arcface onnx model in the current path
ret = rknn.load_onnx(model='./arcface.onnx')
```

<!-- source: EN PDF p13; unit 68 -->

#### 2.3.5 Loading DarkNet model

<!-- source: EN PDF p13; unit 69 -->

| API | load_darknet |
| --- | --- |
| Description | Load DarkNet model. (Unavailable in ARM64) |
| Parameter | model: The path of DarkNet model structure file (suffixed with ".cfg"). |
| Parameter | weight: The path of weight file (suffixed with ".weight"). |
| Return Value | 0: Import successfully. |
| Return Value | -1: Import failed. |

<!-- source: EN PDF p13; unit 70 -->

The sample code is as follows:

<!-- source: EN PDF p13; unit 71 -->

```text
# Load the yolov3-tiny DarkNet model in the current path
ret = rknn.load_darknet(model='./yolov3-tiny.cfg',
           weight= './yolov3.weights')
```

<!-- source: EN PDF p13; unit 72 -->

#### 2.3.6 Loading PyTorch model

<!-- source: EN PDF p13; unit 73 -->

| API | load_pytorch |
| --- | --- |
| Description | Load PyTorch model.<br>Support the Quantization Aware Training (QAT) model, but need update torch version to<br>'1.9.0' or higher. |
| Parameter | model: The path of PyTorch model structure file (suffixed with ".pt"), and need a model in<br>the torchscript format. |
| Parameter | input_size_list: The shapes of input node, all the input shape are placed in a list. |
| Return<br>Value | 0: Import successfully. |
| Return<br>Value | -1: Import failed. |

<!-- source: EN PDF p13; unit 74 -->

The sample code is as follows:

<!-- source: EN PDF p13; unit 75 -->

```text
# Load the PyTorch model resnet18 in the current path
ret = rknn.load_pytorch(model='./resnet18.pt',
           input_size_list=[[1,3,224,224]])
```

<!-- source: EN PDF p14; unit 76 -->

### 2.4 Building RKNN model

<!-- source: EN PDF p14; unit 77 -->

| API | build |
| --- | --- |
| Description | Build corresponding RKNN model according to imported model. |
| Parameter | do_quantization: Whether to quantize the model. The default value is True. |
| Parameter | dataset: A input dataset for rectifying quantization parameters. Currently supports text file<br>format, the user can place the path of picture( jpg or png ) or npy file which is used for<br>rectification. A file path for each line. Such as:<br>a.jpg<br>b.jpg<br>or<br>a.npy<br>b.npy<br>If there are multiple inputs, the corresponding files are divided by space. Such as:<br>a.jpg a2.jpg<br>b.jpg b2.jpg<br>or<br>a.npy a2.npy<br>b.npy b2.npy<br>Note:<br>It is generally recommended to select the quantization image which is consistent with the<br>prediction scene. |
| Parameter | rknn_batch_size: Use to adjust batch size of input. default is None.<br>If greater than 1, NPU can inference multiple frames of input image or input data in one<br>inference. For example, original input of MobileNet is [1, 224, 224, 3], output shape is [1,<br>1001]. When rknn_batch_size is set to 4, the input shape of MobileNet becomes [4, 224, 224,<br>3], output shape becomes [4, 1001].<br>Note:<br>1. rknn_batch_size can improve performance (increase core utilization) only on NPU multi-<br>core platforms, so the value of rknn_batch_size is recommended to match the number of NPU<br>cores.<br>2. After the rknn_batch_size is modified, the shape of input and output will be modified. So<br>the inputs of inference should be set to correct size. It`s also needed to process the returned<br>outputs on post processing. |
| Parameter | auto_hybrid: Whether to enable automatic hybrid quantization to adjust accuracy or<br>overflow. The default value is False, which means no adjustment is performed. When the<br>model is being quantized, enabling auto_hybrid will convert operations with cosine distance<br>and euclidean distance below the specified thresholds to FP16 computation (currently only<br>supported for 'w8a8' quantization). When the model is not quantized, enabling auto_hybrid<br>will convert operations that exceed the FP16 value range to INT16 computation.<br>Note:<br>1. The thresholds for cosine distance and euclidean distance can be configured through using<br>auto_hybrid_cos_thresh and auto_hybrid_euc_thresh in the config interface. |
| Return<br>value | 0: Build successfully. |
| Return<br>value | -1: Build failed. |

<!-- source: EN PDF p15; unit 79 -->

The sample code is as follows:

<!-- source: EN PDF p15; unit 80 -->

```text
# Build and quantize RKNN model
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
```

<!-- source: EN PDF p15; unit 81 -->

### 2.5 Export RKNN model

<!-- source: EN PDF p15; unit 82 -->

The RKNN model built by ‘build’ interface can be saved as a file, it can used to model deployment.

<!-- source: EN PDF p15; unit 83 -->

| API | export_rknn |
| --- | --- |
| Description | Save RKNN model in the specified file (suffixed with ".rknn"). |
| Parameter | export_path: The path of generated RKNN model file. |
| Return Value | 0: Export successfully. |
| Return Value | -1: Export failed. |

<!-- source: EN PDF p15; unit 84 -->

The sample code is as follows:

<!-- source: EN PDF p15; unit 85 -->

```text
# save the built RKNN model as a mobilenet_v1.rknn file in the current path
ret = rknn.export_rknn(export_path='./mobilenet_v1.rknn')
```

<!-- source: EN PDF p15; unit 86 -->

### 2.6 Loading RKNN model

<!-- source: EN PDF p15; unit 87 -->

| API | load_rknn |
| --- | --- |
| Description | Load RKNN model.<br>After loading the RKNN model, there is no need to perform the steps of model configuration,<br>loading model and building RKNN model. And the loaded model is limited to connecting to<br>the NPU hardware for inference or performance data acquisition. It can not be used for<br>simulator or accuracy analysis. |
| Parameter | path: The path of RKNN model file. |
| Return<br>Value | 0: Load successfully. |
| Return<br>Value | -1: Load failed. |

<!-- source: EN PDF p15; unit 88 -->

The sample code is as follows:

<!-- source: EN PDF p16; unit 89 -->

```text
# Load the mobilenet_v1 RKNN model in the current path
ret = rknn.load_rknn(path='./mobilenet_v1.rknn')
```

<!-- source: EN PDF p16; unit 90 -->

### 2.7 Initialize the runtime environment

<!-- source: EN PDF p16; unit 91 -->

Before inference or performance evaluation, the runtime environment must be initialized. This interface determines the type of runtime (hardware platform or software simulator).

<!-- source: EN PDF p16; unit 92 -->

| API | init_runtime |
| --- | --- |
| Description | Initialize the runtime environment. |
| Parameter | target: Target hardware platform, now supports 'rv1103', 'rv1103b', 'rv1106', 'rv1106b',<br>'rv1126b', 'rk3562', 'rk3566', 'rk3568', 'rk3576' and 'rk3588'. The default value is "None",<br>means model runs on simulator.<br>Note: When target is set to None, the build or hybrid_quantization interface needs to be called<br>first. |
| Parameter | device_id: Device identity number, if multiple devices are connected to PC, this parameter<br>needs to be specified which can be obtained by calling "list_devices" interface. The default<br>value is None. |
| Parameter | perf_debug: Debug mode option for performance evaluation. In debug mode, the running<br>time of each layer can be obtained, otherwise, only the total running time of model can be<br>given. The default value is False. |
| Parameter | eval_mem: Whether enter memory evaluation mode. If set True, the eval_memory interface<br>can be called later to fetch memory usage of model running. The default value is False. |
| Parameter | async_mode: Whether to use asynchronous mode. The default value is False.<br>When calling the inference interface, it involves setting the input picture, model running, and<br>fetching the inference result. If the asynchronous mode is enabled, setting the input of the<br>current frame will be performed simultaneously with the inference of the previous frame, so in<br>addition to the first frame, each subsequent frame can hide the setting input time, thereby<br>improving performance. In asynchronous mode, the inference result returned each time is the<br>previous frame. (Not Supported yet) |
| Parameter | core_mask: Sets the NPU cores at runtime. The supported platform is RK3588 / RK3576, and<br>the supported configurations are as follows:<br>RKNN.NPU_CORE_AUTO: Indicates the automatic scheduling model, which automatically<br>runs on the currently idle NPU core.<br>RKNN.NPU_CORE_0: Indicates running on the NPU0 core. RKNN.NPU_CORE_1:<br>Indicates running on the NPU1 core.<br>RKNN.NPU_CORE_2: Indicates running on the NPU2 core.<br>RKNN.NPU_CORE_0_1: Indicates running on NPU0 and NPU1 cores at the same time.<br>RKNN.NPU_CORE_0_1_2: Indicates running on NPU0, NPU1, NPU2 cores at the same<br>time.<br>RKNN.NPU_CORE_ALL: Indicates running on the number of NPU cores depending on the<br>platform.<br>The default value is "RKNN.NPU_CORE_AUTO".<br>Note: RK3576 has only 2 cores, so NPU_CORE_2 and NPU_CORE_0_1_2 cannot be set. |
| Parameter | fallback_prior_device: set fallback prior device when OP is not supported by NPU. currently<br>support: 'gpu' or 'cpu', 'gpu' is only valid for platform which has gpu hardware. The default<br>value is 'cpu'. |
| Return<br>Value | 0: Initialize the runtime environment successfully. |
| Return<br>Value | -1: Initialize the runtime environment failed. |

<!-- source: EN PDF p17; unit 94 -->

The sample code is as follows:

<!-- source: EN PDF p17; unit 95 -->

```text
# Initialize the runtime environment
ret = rknn.init_runtime(target='rk3566')
```

<!-- source: EN PDF p17; unit 96 -->

### 2.8 Inference with RKNN model

<!-- source: EN PDF p17; unit 97 -->

This interface kicks off the RKNN model inference and get the result of inference.

<!-- source: EN PDF p17; unit 98 -->

| API | inference |
| --- | --- |
| Description | Use the model to perform inference with specified input and get the inference result.<br>If the target is set to Rockchip NPU when initializing the runtime environment, the inference<br>of model is performed on the specified hardware platform. If the target is not set, the inference<br>of model is performed on the simulator. |
| Parameter | inputs: Inputs list to be inferred, The object type is ndarray. |
| Parameter | data_format: The layout list of input data. "nchw" or "nhwc" , only valid for 4-dims input.<br>The default value is None, means all inputs layout is "nhwc". |
| Parameter | inputs_pass_through: The pass_through flag. The default value is None, means all input is<br>not pass through.<br>In non-pass_through mode, the tool will reduce the mean, divide the variance, etc. before the<br>input is passed to the NPU driver; in pass_through mode, these operations will not be<br>performed.<br>The value of this parameter is an list. For example, to pass input0 and not input1, the value of<br>this parameter is [1, 0]. |
| Return<br>Value | results: The result of inference, the object type is ndarray list. |

<!-- source: EN PDF p18; unit 100 -->

The sample code is as follows:

<!-- source: EN PDF p18; unit 101 -->

For classification model, such as mobilenet_v1, the code is as follows (refer to example/tfilte/mobilenet_v1 for the complete code):

<!-- source: EN PDF p18; unit 102 -->

```text
# Preform inference for a picture with a model and get a top-5 result
outputs = rknn.inference(inputs=[img])
show_outputs(outputs)
```

<!-- source: EN PDF p18; unit 103 -->

The result of top-5 is as follows:

<!-- source: EN PDF p18; unit 104 -->

```text
-----TOP 5-----
[ 156] score:0.928223 class:"Shih-Tzu"
[ 155] score:0.063171 class:"Pekinese, Pekingese, Peke"
[ 205] score:0.004299 class:"Lhasa, Lhasa apso"
[ 284] score:0.003096 class:"Persian cat"
[ 285] score:0.000171 class:"Siamese cat, Siamese"
```

<!-- source: EN PDF p18; unit 105 -->

### 2.9 Evaluate model performance

<!-- source: EN PDF p18; unit 106 -->

| API | eval_perf |
| --- | --- |
| Description | Evaluate model performance.<br>Model must run on RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566<br>/ RK3568 / RK3576 / RK3588 which connected to PC.If setting perf_debug to False when<br>initializing runtime environment via the interface of “init_runtime”, the performance<br>information is obtained from hardware, which only contains the total running time of model.<br>If the perf_debug is set to True, the running time of each layer will also be captured in detail. |
| Parameter | is_print: Whether to print performance information. The default value is True. |
| Parameter | fix_freq: Whether to fix hardware frequency. The default value is True. |
| Return<br>Value | perf_result: Performance information (strings). |

<!-- source: EN PDF p18; unit 107 -->

The sample code is as follows:

<!-- source: EN PDF p19; unit 108 -->

```text
# Evaluate model performance
perf_detail = rknn.eval_perf()
```

<!-- source: EN PDF p19; unit 109 -->

### 2.10 Evaluating memory usage

<!-- source: EN PDF p19; unit 110 -->

| API | eval_memory |
| --- | --- |
| Description | Fetch memory usage when model is running on hardware platform.<br>Model must run on RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566<br>/ RK3568 / RK3576 / RK3588 which connected to PC. |
| Parameter | is_print: Whether to print memory evaluation results in the canonical format. The default<br>value is True. |
| Return<br>Value | memory_detail: Detail information of memory usage. Data format is dictionary.<br>Data shows as below:<br>{<br>'weight_memory': 3698688,<br>'internal_memory': 1756160,<br>'other_memory': 484352,<br>'total_memory': 5939200,<br>}<br>- The 'weight_memory' represents the memory footprint of the weights in the model.<br>- The 'internal_memory' represents the memory usage of the internal tensor in the model.<br>- The 'other_memory' represents the memory usage of other tensor in the model.<br>- The 'total_memory' represents the memory footprint of the model, that is, the sum of the<br>weight, internal tensor and other memory. |

<!-- source: EN PDF p19; unit 111 -->

The sample code is as follows:

<!-- source: EN PDF p19; unit 112 -->

```text
# eval memory usage
memory_detail = rknn.eval_memory()
```

<!-- source: EN PDF p19; unit 113 -->

For examples/caffe/mobilenet_v2 in examples directory, the memory usage when model running on RK3588 is printed as follows:

<!-- source: EN PDF p19; unit 114 -->

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

<!-- source: EN PDF p20; unit 115 -->

### 2.11 Get SDK version

<!-- source: EN PDF p20; unit 116 -->

| API | get_sdk_version |
| --- | --- |
| Description | Get API version and driver version of referenced SDK.<br>Note: Before we use this interface, we must load model and initialize runtime first. And this<br>API can only used on RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 /<br>RK3566 / RK3568 / RK3576 / RK3588. |
| Parameter | None. |
| Return<br>Value | sdk_version: API and driver version. Data type is string. |

<!-- source: EN PDF p20; unit 117 -->

The sample code is as follows:

<!-- source: EN PDF p20; unit 118 -->

```text
# Get SDK version
sdk_version = rknn.get_sdk_version()
print(sdk_version)
```

<!-- source: EN PDF p20; unit 119 -->

The SDK version looks like below:

<!-- source: EN PDF p20; unit 120 -->

```text
==============================================
RKNN VERSION:
  API: 1.5.2 (8babfea build@2023-08-25T02:31:12)
  DRV: rknn_server: 1.5.2 (8babfea build@2023-08-25T10:30:12)
  DRV: rknnrt: 1.5.3b13 (42cbca6f5@2023-10-27T10:13:21)
==============================================
```

<!-- source: EN PDF p20; unit 121 -->

### 2.12 Hybrid Quantization

<!-- source: EN PDF p20; unit 122 -->

#### 2.12.1 hybrid_quantization_step1

<!-- source: EN PDF p20; unit 123 -->

When using the hybrid quantization function, the main interface called in the first phase is hybrid_quantization_step1, which is used to generate the temporary model file (&lt;model_name&gt;.model), the data file (&lt;model_name&gt;.data), and the quantization configuration file (&lt;model_name&gt;.quantization.cfg). Interface details are as follows:

<!-- source: EN PDF p20; unit 124 -->

| API | hybrid_quantization_step1 |
| --- | --- |
| Description | Corresponding temporary model files, data files, and quantization profiles are generated<br>according to the loaded original model. |
| Parameter | dataset: See 2.4 Building RKNN model. |
| Parameter | rknn_batch_size: See 2.4 Building RKNN model. |
| Parameter | proposal: Generate hybrid quantization config suggestions. The default value is False. |
| Parameter | proposal_dataset_size: The size of dataset used for proposal. The default value is 1. Because<br>the proposal function is time-consuming, so the default size is 1. |
| Parameter | custom_hybrid: Select the hybrid quantization subgraph according to multiple sets of input<br>names and output names specified by the user. The format is [[input0_name, output0_name],<br>[input1_name, output1_name], …]. The default value is None.<br>Note: Input names and output names should be chosen based on the temporary model<br>file(&lt;model_name&gt;.model). |
| Return<br>Value | 0: success. |
| Return<br>Value | -1: failure. |

<!-- source: EN PDF p21; unit 126 -->

The sample code is as follows:

<!-- source: EN PDF p21; unit 127 -->

```text
# Call hybrid_quantization_step1 to generate quantization config
ret = rknn.hybrid_quantization_step1(dataset='./dataset.txt')
```

<!-- source: EN PDF p21; unit 128 -->

#### 2.12.2 hybrid_quantization_step2

<!-- source: EN PDF p21; unit 129 -->

When using the hybrid quantization function, the primary interface for generating a hybrid quantized RKNN model phase call is hybrid_quantization_step2. The interface details are as follows:

<!-- source: EN PDF p21; unit 130 -->

| API | hybrid_quantization_step2 |
| --- | --- |
| Description | The temporary model file, the data file, the quantization profile, and the correction data set are<br>received as inputs, and the hybrid quantized RKNN model is generated. |
| Parameter | model_input: The temporary model file (&lt;model_name&gt;.model) path generated in the<br>hybrid_quantization_step1. |
| Parameter | data_input: The model data file (&lt;model_name&gt;.data) path generated in the<br>hybrid_quantization_step1. |
| Parameter | model_quantization_cfg: Path to the modified model quantization configuration file<br>(&lt;model_name&gt;.quantization.cfg) generated by hybrid_quantization_step1. |
| Return<br>Value | 0: success. |
| Return<br>Value | -1: failure. |

<!-- source: EN PDF p21; unit 131 -->

The sample code is as follows:

<!-- source: EN PDF p21; unit 132 -->

```text
# Call hybrid_quantization_step2 to generate hybrid quantized RKNN model
ret = rknn.hybrid_quantization_step2(
       model_input='./ssd_mobilenet_v2.model',
       data_input='./ssd_mobilenet_v2.data',
       model_quantization_cfg='./ssd_mobilenet_v2.quantization.cfg')
```

<!-- source: EN PDF p22; unit 133 -->

### 2.13 Quantitative accuracy analysis

<!-- source: EN PDF p22; unit 134 -->

The function of this interface is inference with quantized model and generate outputs of each layers for quantitative accuracy analysis.

<!-- source: EN PDF p22; unit 135 -->

| API | accuracy_analysis |
| --- | --- |
| Description | Inference with quantized model and generate snapshot, that is dump tensor data of each layers.<br>It will dump a snapshot of both data types include fp32 & quant for calculate quantitative<br>error.<br>Note:<br>1. This interface can only be called after build or hybrid_quantization_step2.<br>2. If target is None and the original model is quantized model (QAT model), the call will<br>fail.<br>3. The quantization method used by this interface is consistent with the setting in config. |
| Parameter | inputs: the path list of image (jpg/png/bmp/npy). |
| Parameter | output_dir: output directory, all snapshot data will stored here. The default value is<br>'./snapshot'.<br>If the target is not set, the following content will be output under ‘output_dir’:<br>- Directory simulator: Save the results of each layer on simulator when the entire quantitative<br>model is fully run (The output has been converted to float32).<br>- Directory golden: Save the results of each layer on simulator when the entire floating-point<br>model is completely run down.<br>- error_analysis.txt: Record the the cosine distance (entire_error and single_error) between<br>each layer result on simulator and the floating-point model on simulator during the complete<br>calculation of the quantized model. The different of entire_error/single_error is the input of<br>each layer is come from the quantization model or floating-point model. See the<br>error_analysis.txt file for more details.<br>If the target is set, more content will output under ‘output_dir’:<br>- Directory runtime: Save the results of each layer when the entire quantitative model is fully<br>run in NPU (The output has been converted to float32).<br>- error_analysis.txt: Record the the cosine distance (entire_error) between each layer result on<br>simulator and each layer on NPU during the complete calculation of the quantized model<br>additionally. See the error_analysis.txt file for more details. |
| Parameter | target: Target hardware platform, now supports 'rv1103', 'rv1103b', 'rv1106', 'rv1106b',<br>'rv1126b', 'rk3562', 'rk3566', 'rk3568', 'rk3576' and 'rk3588'. The default value is "None".<br>If target is set, the output of each layer of NPU will be obtained, and analyze it’s accuracy. |
| Parameter | device_id: Device identity number, if multiple devices are connected to PC, this parameter<br>needs to be specified which can be obtained by calling "list_devices" interface. The default<br>value is "None ". |
| Return<br>Value | 0: success. |
| Return<br>Value | -1: failure. |

<!-- source: EN PDF p23; unit 136 -->

The sample code is as follows:

<!-- source: EN PDF p23; unit 137 -->

```text
# Accuracy analysis
ret = rknn.accuracy_analysis(inputs=['./dog_224x224.jpg'])
```

<!-- source: EN PDF p23; unit 138 -->

### 2.14 List Devices

<!-- source: EN PDF p23; unit 139 -->

| API | list_devices |
| --- | --- |
| Description | List connected RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 /<br>RK3568 / RK3576 / RK3588.<br>Note: There are currently two device connection modes: ADB and NTB. Make sure their<br>modes are the same when connecting multiple devices. |
| Parameter | None. |
| Return<br>Value | Return adb_devices list and ntb_devices list. If there are no devices connected to PC, it will<br>return two empty list. |

<!-- source: EN PDF p23; unit 140 -->

The sample code is as follows:

<!-- source: EN PDF p23; unit 141 -->

```text
rknn.list_devices()
```

<!-- source: EN PDF p23; unit 142 -->

The devices list looks like below:

<!-- source: EN PDF p23; unit 143 -->

```text
*************************
all device(s) with adb mode:
VD46C3KM6N
*************************
```

<!-- source: EN PDF p23; unit 144 -->

### 2.15 Export encrypted RKNN model

<!-- source: EN PDF p23; unit 145 -->

The function of this interface is to encrypt the ordinary RKNN model and obtain the encrypted model.

<!-- source: EN PDF p23; unit 146 -->

| API | export_encrypted_rknn_model |
| --- | --- |
| Description | The common RKNN model is encrypted according to the encryption level specified by the<br>user.<br>Note: RV1103/RV1103B/RV1106/RV1106B/RK2118 is not supported yet. |
| Parameter | input_model: The path of the RKNN model to be encrypted. |
| Parameter | output_model: Save path of encrypted model. The default value is None, means the<br>{original_model_name}.crypt.rknn will be the save path of encrypted model. |
| Parameter | crypt_level: Crypt level, currently, support level 1, 2 or 3. The default value is 1.<br>The higher the level, the higher the security and the more time-consuming decryption; on the<br>contrary, the lower the security, the faster the decryption. |
| Return<br>Value | 0: Success. |
| Return<br>Value | -1: Failure. |

<!-- source: EN PDF p24; unit 148 -->

The sample code is as follows:

<!-- source: EN PDF p24; unit 149 -->

```text
ret = rknn.export_encrypted_rknn_model('test.rknn')
```

<!-- source: EN PDF p24; unit 150 -->

### 2.16 Register custom operator

<!-- source: EN PDF p24; unit 151 -->

The function of this interface is to register a custom operator.

<!-- source: EN PDF p24; unit 152 -->

| API | reg_custom_op |
| --- | --- |
| Description | Register custom operator, only supported for ONNX model. |
| Parameter | custom_op: Custom operator class. For the user needs to customize a new OP, which is not<br>within the ONNX OP specification. The op_type of this new OP is recommended to start with<br>'cst', and the ‘shape_infer’ and ‘compute’ functions need to be implemented by user.<br>Note: The custom_op operator class is only used for model conversion and generation of<br>RKNN models with custom operators. When deploying on the device side, you also need to<br>refer to Chapter 5.5 of the "RKNN SDK User Guide". |
| Return<br>Value | 0: Success. |
| Return<br>Value | -1: Failure. |

<!-- source: EN PDF p24; unit 153 -->

The sample code is as follows:

<!-- source: EN PDF p24; unit 154 -->

```text
import numpy as np
from rknn.api.custom_op import get_node_attr
class cstSoftmax:
  op_type = 'cstSoftmax'
  def shape_infer(self, node, in_shapes, in_dtypes):
    out_shapes = in_shapes.copy()
    out_dtypes = in_dtypes.copy()
    return out_shapes, out_dtypes
  def compute(self, node, inputs):
    x = inputs[0]
    axis = get_node_attr(node, 'axis')
    x_max = np.max(x, axis=axis, keepdims=True)
    tmp = np.exp(x - x_max)
    s = np.sum(tmp, axis=axis, keepdims=True)
    outputs = [tmp / s]
    return outputs

ret = rknn.reg_custom_op(cstSoftmax)
```

<!-- source: EN PDF p25; unit 155 -->

### 2.17 Generate C++ deployment example

<!-- source: EN PDF p25; unit 156 -->

| API | codegen |
| --- | --- |
| Description | Generate C++ deployment example |
| Parameter | output_path: The output folder directory, the user can configure the directory name |
| Parameter | inputs: Fills in the path list of model input. It is allowed to leave it blank. The valid file<br>format is jpg/png/npy. When npy files are used as input, the dimension information of npy<br>data should be consistent with the dimension information of the model input |
| Parameter | overwrite: When overwrite is set to True, the files in the directory specified by output_path<br>will be overwritten. The default value is False |
| Return<br>Value | 0: Success. |
| Return<br>Value | -1: Failure. |

<!-- source: EN PDF p25; unit 157 -->

The sample code is as follows:

<!-- source: EN PDF p25; unit 158 -->

```text
ret = rknn.codegen(output_path='./rknn_app_demo',
        inputs=['./mobilenet_v2/dog_224x224.jpg'],
        overwrite=True)
```

{% endraw %}
