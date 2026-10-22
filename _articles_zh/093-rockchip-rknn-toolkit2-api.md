---
title: "RKNN-Toolkit2 API 完整参考：模型配置、转换、量化与推理"
description: "完整整理 V2.3.2 的框架/版本依赖、全部 Toolkit2 API 参数、混合量化、精度/性能/内存评估及自定义算子示例。"
translation_key: "093-rockchip-rknn-toolkit2-api"
slug: "093-rockchip-rknn-toolkit2-api"
lang: "zh"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
tags: ["Rockchip", "RKNN", "Toolkit2", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip RKNN Toolkit2 Python API quantization"
excerpt: "完整整理 V2.3.2 的框架/版本依赖、全部 Toolkit2 API 参数、混合量化、精度/性能/内存评估及自定义算子示例。"
---

{% raw %}

# RKNN-Toolkit2 API 完整参考：模型配置、转换、量化与推理

## ArmSoM 适用范围与来源

本文是 Rockchip 平台技术参考，不是 ArmSoM 实测报告。来源为 RK-YH-YF-412、V2.3.2，中文22页、英文25页。中文按中文原稿；英文按英文原稿；俄文和德文完整译自英文。两稿无技术图片，全部内容为可编辑正文、表格和代码，不凭空增加英文图。原文覆盖 RV1103/RV1103B/RV1106/RV1106B/RV1126B、RK2118、RK3562、RK3566/3568/3576/3588系列；并未给出具体 ArmSoM 板卡的 SDK/BSP 和内核组合。适配时需核对 NPU 驱动、Toolkit2/Runtime/Server 版本、主机系统/架构、Python、框架与模型格式；ARM64的限制不能从x64版本泛化。版本、top-5、内存及SDK输出是原稿示例，不是 ArmSoM 测试。V2.3.2是来源快照，不宣称当前最新版。

> 校对提示：同版本中英稿仍有差异。Ubuntu20.04的Python列中文为3.8/3.9、英文为3.8/3.8；ARM64表标题下却标注Debian(x64)。各源值保留，不擅自认定支持关系。完整疑点见校对记录；代码/API参数不当作已在ArmSoM验证的适配方案。

[EDITORIAL-NOTES](/docs/rockchip-rknn-toolkit2-api/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)


<!-- source: CN PDF p4; unit 0 -->

## 1 要求

<!-- source: CN PDF p4; unit 1 -->

### 1.1 适用芯片

<!-- source: CN PDF p4; unit 2 -->

RKNN-Toolkit2当前版本所支持芯片的型号如下：

<!-- source: CN PDF p4; unit 3 -->

RV1103

<!-- source: CN PDF p4; unit 4 -->

RV1103B

<!-- source: CN PDF p4; unit 5 -->

RV1106

<!-- source: CN PDF p4; unit 6 -->

RV1106B

<!-- source: CN PDF p4; unit 7 -->

RV1126B

<!-- source: CN PDF p4; unit 8 -->

RK2118

<!-- source: CN PDF p4; unit 9 -->

RK3562

<!-- source: CN PDF p4; unit 10 -->

RK3566系列

<!-- source: CN PDF p4; unit 11 -->

RK3568系列

<!-- source: CN PDF p4; unit 12 -->

RK3576系列

<!-- source: CN PDF p4; unit 13 -->

RK3588系列

<!-- source: CN PDF p4; unit 14 -->

注：后文用RK3566 / RK3568 / RK3576 / RK3588分别统称RK3566系列 / RK3568系列 / RK3576系列 / RK3588系列。

<!-- source: CN PDF p4; unit 15 -->

### 1.2 系统依赖说明

<!-- source: CN PDF p4; unit 16 -->

使用RKNN-Toolkit2时需要满足以下运行环境要求：

<!-- source: CN PDF p4; unit 17 -->

| 操作系统<br>版本 | Ubuntu18.04<br>（x64） | Ubuntu20.04<br>（x64） | Ubuntu22.04<br>（x64） | Ubuntu24.04<br>（x64） |
| --- | --- | --- | --- | --- |
| Python版本 | 3.6 / 3.7 | 3.8 / 3.9 | 3.10 / 3.11 | 3.12 |

<!-- source: CN PDF p4; unit 18 -->

ARM64版本运行环境要求：

<!-- source: CN PDF p4; unit 19 -->

| 操作系统版本 | Debian10（x64) | Debian11（x64) | Debian12（x64) |
| --- | --- | --- | --- |
| Python版本 | 3.6 / 3.7 | 3.8 / 3.9 | 3.10 / 3.11 / 3.12 |

<!-- source: CN PDF p4; unit 20 -->

注：

<!-- source: CN PDF p4; unit 21 -->

1\. 具体python库依赖详见doc/requirements*.txt

<!-- source: CN PDF p4; unit 22 -->

2\. 本文档主要以Ubuntu 20.04 / Python3.8为例进行说明

<!-- source: CN PDF p5; unit 23 -->

### 1.3 适用的深度学习框架

<!-- source: CN PDF p5; unit 24 -->

RKNN-Toolkit2支持的深度学习框架包括Caffe、TensorFlow、TensorFlow Lite、ONNX、DarkNet和PyTorch。

<!-- source: CN PDF p5; unit 25 -->

它和各深度学习框架的版本对应关系如下：

<!-- source: CN PDF p5; unit 26 -->

| RKNN-Toolkit2 | Caffe | TensorFlow | TF Lite | ONNX | DarkNet | PyTorch |
| --- | --- | --- | --- | --- | --- | --- |
| 1.4.0<br>1.4.2<br>1.5.0<br>1.5.2 | 1.0 | 1.12.0~<br>2.8.0 | Schema<br>version=3 | 1.7.0~<br>1.10.0 | Commit ID:<br>810d7f7 | 1.6.0~<br>1.10.1 |
| 1.6.0 | 1.0 | 1.12.0~<br>2.14.0 | Schema<br>version=3 | 1.7.0~<br>1.14.0 | Commit ID:<br>810d7f7 | 1.6.0~<br>1.13.1 |
| 2.0.0<br>2.1.0<br>2.2.0 | 1.0 | 1.12.0~<br>2.14.0 | Schema<br>version=3 | 1.7.0~<br>1.14.1 | Commit ID:<br>810d7f7 | 1.10.1~<br>2.1.0 |
| 2.3.0<br>2.3.2 | 1.0 | 1.12.0~<br>2.14.0 | Schema<br>version=3 | 1.7.0~<br>1.17.0 | Commit ID:<br>810d7f7 | 1.10.1~<br>2.4.0 |

<!-- source: CN PDF p5; unit 27 -->

注：

<!-- source: CN PDF p5; unit 28 -->

1\. 由于TensorFlow版本兼容特性，TensorFlow 1.12.0之前版本的导出的pb文件，理论上也是支持的。关于TensorFlow版本兼容性的更多信息，可以参考官方资料：[https://www.tensorflow.org/guide/versions?hl=zh-cn](https://www.tensorflow.org/guide/versions?hl=zh-cn)

<!-- source: CN PDF p5; unit 29 -->

2\. 因为TFLite不同版本的schema之间是互不兼容的，所以构建TFLite模型时使用与RKNN-Toolkit2不同版本的schema可能导致加载失败。

<!-- source: CN PDF p5; unit 30 -->

3\. RKNN-Toolkit2使用的Caffe protocol是基于berkeley官方修改的protocol：[https://github.com/BVLC/caffe/tree/master/src/caffe/proto，commit值为828dd10，RKNN-Toolkit2在此基础上新增了一些OP。](https://github.com/BVLC/caffe/tree/master/src/caffe/proto，commit值为828dd10，RKNN-Toolkit2在此基础上新增了一些OP。)

<!-- source: CN PDF p5; unit 31 -->

4\. ONNX release version和opset version、IR version之间的关系参考onnxruntime官网说明：[https://github.com/microsoft/onnxruntime/blob/v1.6.0/docs/Versioning.md](https://github.com/microsoft/onnxruntime/blob/v1.6.0/docs/Versioning.md)

<!-- source: CN PDF p5; unit 32 -->

5\. DarkNet官方Github链接：[https://github.com/pjreddie/darknet。RKNN-Toolkit2现在的转换规则是基于master分支的最新提交（commit值：810d7f7）制定的。](https://github.com/pjreddie/darknet。RKNN-Toolkit2现在的转换规则是基于master分支的最新提交（commit值：810d7f7）制定的。)

<!-- source: CN PDF p5; unit 33 -->

6\. 加载PyTorch模型（torchscript模型）时，推荐使用相同版本的PyTorch导出模型并转为RKNN模型，前后版本不一致时有可能会导致转RKNN模型失败。

<!-- source: CN PDF p5; unit 34 -->

7\. ARM64版本仅支持PyTorch和ONNX框架，其他框架暂时不支持。

<!-- source: CN PDF p6; unit 35 -->

## 2 API详细说明

<!-- source: CN PDF p6; unit 36 -->

### 2.1 RKNN初始化及释放

<!-- source: CN PDF p6; unit 37 -->

在使用RKNN-Toolkit2的所有API接口时，都需要先调用RKNN()方法初始化RKNN对象，不再使用该对象时通过调用该对象的release()方法进行释放。

<!-- source: CN PDF p6; unit 38 -->

初始化RKNN对象时，可以设置verbose和verbose_file参数，以打印详细的日志信息。其中verbose参数指定是否要打印详细日志信息；如果设置了verbose_file参数，且verbose参数值为True，日志信息还将写到该参数指定的文件中。

<!-- source: CN PDF p6; unit 39 -->

举例如下：

<!-- source: CN PDF p6; unit 40 -->

```text
# 打印详细的日志信息
rknn = RKNN(verbose=True)

…

rknn.release()
```

<!-- source: CN PDF p6; unit 41 -->

### 2.2 模型配置

<!-- source: CN PDF p6; unit 42 -->

在构建RKNN模型之前，需要先对模型进行通道均值、量化图片RGB2BGR转换、量化类型等的配置，这些操作可以通过config接口进行配置。

<!-- source: CN PDF p6; unit 43 -->

| API | config |
| --- | --- |
| 描述 | 设置模型转换参数。 |
| 参数 | mean_values：输入的均值。参数格式是一个列表，列表中包含一个或多个均值子列表，多<br>输入模型对应多个子列表，每个子列表的长度与该输入的通道数一致，例如[[128,128,128]]，<br>表示一个输入的三个通道的值减去128。<br>默认值为None，表示所有的mean值为0。 |
| 参数 | std_values：输入的归一化值。参数格式是一个列表，列表中包含一个或多个归一化值子列<br>表，多输入模型对应多个子列表，每个子列表的长度与该输入的通道数一致，例如<br>[[128,128,128]]，表示设置一个输入的三个通道的值减去均值后再除以128。<br>默认值为None，表示所有的std值为1。 |
| 参数 | quant_img_RGB2BGR：表示在加载量化图像时是否需要先做RGB2BGR的操作。如果有多<br>个输入，则用列表包含起来，如[True, True, False]。默认值为False。<br>该配置一般用在Caffe的模型上，Caffe模型训练时大多会先对数据集图像进行RGB2BGR转<br>换，此时需将该配置设为True。<br>另外，该配置只对量化图像格式为jpg/png/bmp有效，npy格式读取时会忽略该配置，因此当<br>模型输入为BGR时，npy也需要为BGR格式。<br>该配置仅用于在量化阶段（build接口）读取量化图像或量化精度分析（accuracy_analysis接<br>口），并不会保存在最终的RKNN模型中，因此如果模型的输入为BGR，则在调用toolkit2<br>的inference或C-API的run函数之前，需要保证传入的图像数据也为BGR格式。 |
| 参数 | quantized_dtype：量化类型，目前支持的量化类型有w8a8、w4a16、w8a16、w4a8、w16a16i<br>和w16a16i_dfp。默认值为w8a8。<br>- w8a8：权重为8bit非对称量化精度，激活值为8bit非对称量化精度。（RK2118不支持）<br>- w4a16：权重为4bit非对称量化精度，激活值为16bit浮点精度。（仅RK3576/RV1126B支<br>持）<br>- w8a16：权重为8bit非对称量化精度，激活值为16bit浮点精度。（仅RK3562支持）<br>- w4a8：权重为4bit非对称量化精度，激活值为8bit非对称量化精度。（暂不支持）<br>- w16a16i：权重为16bit非对称量化精度，激活值为16bit非对称量化精度。（仅<br>RV1103/RV1106支持）<br>- w16a16i_dfp：权重为16bit动态定点量化精度，激活值为16bit动态定点量化精度。（仅<br>RV1103/RV1106支持） |
| 参数 | quantized_algorithm：计算每一层的量化参数时采用的量化算法，目前支持的量化算法有：<br>normal，mmse，kl_divergence及gdq。默认值为normal。<br>normal量化算法的特点是速度较快，推荐量化数据集量一般为20-100张左右，更多的数据集<br>量下精度未必会有进一步提升。<br>mmse量化算法由于采用暴力迭代的方式，速度较慢，但通常会比normal具有更高的精度，推<br>荐量化数据集量一般为20-50张左右，用户也可以根据量化时间长短对量化数据集量进行适当<br>增减。<br>kl_divergence量化算法所用时间会比normal多一些，但比mmse会少很多，在某些场景下<br>（feature分布不均匀时）可以得到较好的改善效果，推荐量化数据集量一般为20-100张左<br>右。<br>gdq量化算法只在w4a16和w8a16下有效，能有效的提高w4a16和w8a16的权重量化精度，推荐<br>量化数据集量为200张以上。 |
| 参数 | quantized_method：目前支持layer，channel或者group{SIZE}。默认值为channel。<br>- layer：每层的weight只有一套量化参数；<br>- channel：每层的weight的每个输出通道都有一套量化参数，通常情况下channel会比layer精<br>度更高。<br>- group{SIZE}：在channel的基础上，每个输出通道的weight在输入通道上又按{SIZE}细分为<br>多个小组，每个小组有各自的一套量化参数，通常情况下group{SIZE}会比channel精度更<br>高。{SIZE}是32到256之间的32的倍数值，如group32或group128。目前group{SIZE}只在<br>quantized_dtype为w4a16下有效。 |
| 参数 | float_dtype：用于指定非量化情况下的浮点的数据类型，目前支持的数据类型有float16。默<br>认值为float16。 |
| 参数 | optimization_level：模型优化等级。默认值为3。<br>通过修改模型优化等级，可以关掉部分或全部模型转换过程中使用到的优化规则。该参数的<br>默认值为3，打开所有优化选项。值为2或1时关闭一部分可能会对部分模型精度产生影响的<br>优化选项，值为0时关闭所有优化选项。 |
| 参数 | target_platform：指定RKNN模型是基于哪个目标芯片平台生成的。目前支持“rv1103”、<br>“rv1103b”、“rv1106”、“rv1106b”、“rv1126b”、“rk2118”、“rk3562”、“rk3566”、“rk3568”、<br>“rk3576”和“rk3588”。该参数对大小写不敏感。默认值为None。 |
| 参数 | custom_string：添加自定义字符串信息到RKNN模型，可以在runtime时通过query查询到该信<br>息，方便部署时根据不同的RKNN模型做特殊的处理。默认值为None。 |
| 参数 | remove_weight：去除conv等权重以生成一个RKNN的从模型，该从模型可以与带完整权重的<br>RKNN模型共享权重以减少内存消耗。默认值为False。 |
| 参数 | compress_weight：压缩模型权重，可以减小RKNN模型的大小。默认值为False。 |
| 参数 | single_core_mode：是否仅生成单核模型，可以减小RKNN模型的大小和内存消耗。默认值<br>为False。目前仅对RK3588 / RK3576生效。默认值为False。 |
| 参数 | model_pruning：对模型进行无损剪枝。对于权重稀疏的模型，可以减小转换后RKNN模型<br>的大小和计算量。默认值为False。 |
| 参数 | op_target：用于指定OP的具体执行目标（可以设置运行在NPU/CPU/GPU等），通过输出<br>tensor名的方式，{'op0_output_name':'cpu', 'op1_output_name':'npu', ...}， 或者通过指定op_type<br>的方式，{'op_type':'cpu'....}， 同时还可以支持混合使用，{'op_type':'cpu‘,<br>'op0_output_name':'cpu'....} 。默认值为None。<br>其中，'op0_output_name'和'op1_output_name'为对应OP的输出tensor名，可以通过精度分析<br>（accuracy_analysis）功能的返回结果中获取。'cpu'和'npu'则表示该tensor对应的OP的执行目<br>标是CPU或NPU，目前可选的选项有：'cpu' / 'npu' / 'gpu' / 'auto'，其中，'auto'是自动选择执行<br>目标。指定op_type的方式，同样需要通过精度分析返回结果中获取，可以将模型内所有该<br>op_type的执行目标设置到CPU或NPU，例如，{'Add':'cpu', 'Expand':'cpu',....}。 |
| 参数 | dynamic_input：用于根据用户指定的多组输入shape，来模拟动态输入的功能。格式为<br>[[input0_shapeA, input1_shapeA, ...], [input0_shapeB, input1_shapeB, ...], ...]。<br>默认值为None，实验性功能。<br>假设原始模型只有一个输入，shape为[1,3,224,224]，或者原始模型的输入shape本身就是动态<br>的，如shape为[1,3,height,width]或[1,3,-1,-1]，但部署的时候，需要该模型支持3种不同的输入<br>shape，如[1,3,224,224], [1,3,192,192]和[1,3,160,160]，此时可以设置dynamic_input=<br>[[[1,3,224,224]], [[1,3,192,192]], [[1,3,160,160]]]，转换成RKNN模型后进行推理时，需传入对<br>应shape的输入数据。<br>注：<br>1. 需要原始模型本身支持动态输入才可开启此功能，否则会报错。<br>2. 如果原始模型输入shape本身就是动态的，则只有动态的轴可以设置不同的值。 |
| 参数 | quantize_weight：在build接口的do_quantization为False情况下, 通过对一些权重进行量化以减<br>小rknn模型的大小。<br>默认值为False。 |
| 参数 | remove_reshape：删除模型的输入和输出中可能存在的Reshape的OP，以提高模型运行时性<br>能（因为目前很多平台的Reshape是跑在cpu上，相对较慢）。<br>默认为 False。<br>注：开启后可能会修改模型的输入或输出节点的shape，需要留意观察转换过程中的warning<br>打印，并在部署时也需要考虑输入和输出shape变化的影响。 |
| 参数 | sparse_infer：在已经稀疏化过的模型上进行稀疏化推理，以提高推理性能。 目前仅对<br>RK3576/RV1126B生效。默认为 False。 |
| 参数 | enable_flash_attention：是否启用Flash Attention。默认为 False。<br>注：FlashAttention是基于 https://arxiv.org/abs/2307.08691 实现, 通过高速缓存内循环实现加速<br>以及减少宽带使用，但是会导致模型增大，请根据具体场景和模型选择是否开启使用。更多<br>详情请查看“RKNN Compiler Support Operator List”的exSDPAttention说明。 |
| 参数 | auto_hybrid_cos_thresh：模型量化时开启自动混合量化中余弦距离的阈值。默认为 0.98。 |
| 参数 | auto_hybrid_euc_thresh：模型量化时开启自动混合量化中欧式距离的阈值。默认为 None，<br>即默认不启用。 |
| 返回<br>值 | 无。 |

<!-- source: CN PDF p9; unit 47 -->

举例如下：

<!-- source: CN PDF p9; unit 48 -->

```text
# model config
rknn.config(mean_values=[[103.94, 116.78, 123.68]],
     std_values=[[58.82, 58.82, 58.82]],
     quant_img_RGB2BGR=True,
     target_platform='rk3566')
```

<!-- source: CN PDF p9; unit 49 -->

### 2.3 模型加载

<!-- source: CN PDF p9; unit 50 -->

RKNN-Toolkit2目前支持Caffe、TensorFlow、TensorFlow Lite、ONNX、DarkNet、PyTorch等模型的加载转换，这些模型在加载时需调用对应的接口，以下为这些接口的详细说明。

<!-- source: CN PDF p9; unit 51 -->

#### 2.3.1 Caffe模型加载接口

<!-- source: CN PDF p9; unit 52 -->

| API | load_caffe |
| --- | --- |
| 描述 | 加载Caffe模型。（ARM64版本暂不支持该接口） |
| 参数 | model：Caffe模型文件（.prototxt后缀文件）路径。 |
| 参数 | blobs：Caffe模型的二进制数据文件（.caffemodel后缀文件）路径。 |
| 参数 | input_name：Caffe模型存在多输入时，可以通过该参数指定输入层名的顺序，形如<br>['input1','input2','input3']，注意名字需要与模型输入名一致；默认值为None，表示按Caffe模<br>型文件（.prototxt后缀文件）自动给定。 |
| 返回<br>值 | 0：导入成功。 |
| 返回<br>值 | -1：导入失败。 |

<!-- source: CN PDF p9; unit 53 -->

举例如下：

<!-- source: CN PDF p10; unit 54 -->

```text
# 从当前路径加载mobilenet_v2模型
ret = rknn.load_caffe(model='./mobilenet_v2.prototxt',
          blobs='./mobilenet_v2.caffemodel')
```

<!-- source: CN PDF p10; unit 55 -->

#### 2.3.2 TensorFlow模型加载接口

<!-- source: CN PDF p10; unit 56 -->

| API | load_tensorflow |
| --- | --- |
| 描述 | 加载TensorFlow模型。（ARM64版本暂不支持该接口） |
| 参数 | tf_pb：TensorFlow模型文件（.pb后缀）路径。 |
| 参数 | inputs：模型的输入节点（tensor名），支持多个输入节点。所有输入节点名放在一个列表<br>中。 |
| 参数 | input_size_list：每个输入节点对应的shape，所有输入shape放在一个列表中。如示例中的<br>ssd_mobilenet_v1模型，其输入节点对应的输入shape是[[1, 300, 300, 3]]。 |
| 参数 | outputs：模型的输出节点（tensor名），支持多个输出节点。所有输出节点名放在一个列表<br>中。 |
| 参数 | input_is_nchw：模型的输入的layout是否已经是NCHW。默认值为False，表示默认输入<br>layout为NHWC。 |
| 返回<br>值 | 0：导入成功。 |
| 返回<br>值 | -1：导入失败。 |

<!-- source: CN PDF p10; unit 57 -->

举例如下：

<!-- source: CN PDF p10; unit 58 -->

```text
# 从当前目录加载ssd_mobilenet_v1_coco_2017_11_17模型
ret = rknn.load_tensorflow(tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
            inputs=['Preprocessor/sub'],
            outputs=['concat', 'concat_1'],
            input_size_list=[[300, 300, 3]])
```

<!-- source: CN PDF p10; unit 59 -->

#### 2.3.3 TensorFlow Lite模型加载接口

<!-- source: CN PDF p10; unit 60 -->

| API | load_tflite |
| --- | --- |
| 描述 | 加载TensorFlow Lite模型。（ARM64版本暂不支持该接口） |
| 参数 | model：TensorFlow Lite模型文件（.tflite后缀）路径。 |
| 参数 | input_is_nchw：模型的输入的layout是否已经是NCHW。默认值为False，即默认输入layout<br>为NHWC。 |
| 返回<br>值 | 0：导入成功。 |
| 返回<br>值 | -1：导入失败。 |

<!-- source: CN PDF p11; unit 61 -->

举例如下：

<!-- source: CN PDF p11; unit 62 -->

```text
# 从当前目录加载mobilenet_v1模型
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

<!-- source: CN PDF p11; unit 63 -->

#### 2.3.4 ONNX模型加载

<!-- source: CN PDF p11; unit 64 -->

| API | load_onnx |
| --- | --- |
| 描述 | 加载ONNX模型。 |
| 参数 | model：ONNX模型文件（.onnx后缀）路径。 |
| 参数 | inputs：模型输入节点（tensor名），支持多个输入节点，所有输入节点名放在一个列表中。<br>默认值为None，表示从模型里获取。 |
| 参数 | input_size_list：每个输入节点对应的shape，所有输入shape放在一个列表中。如inputs有设<br>置，则input_size_list也需要被设置。默认值为None。 |
| 参数 | input_initial_val：设置模型输入的初始值，格式为ndarray的列表。默认值为None。 主要用<br>于将某些输入固化为常量，对于不需要固化为常量的输入可以设为None，如[None,<br>np.array([1])]。 |
| 参数 | outputs：模型的输出节点（tensor名），支持多个输出节点，所有输出节点名放在一个列表<br>中。默认值为None，表示从模型里获取。 |
| 返回<br>值 | 0：导入成功。 |
| 返回<br>值 | -1：导入失败。 |

<!-- source: CN PDF p11; unit 65 -->

举例如下：

<!-- source: CN PDF p11; unit 66 -->

```text
# 从当前目录加载arcface模型
ret = rknn.load_onnx(model='./arcface.onnx')
```

<!-- source: CN PDF p11; unit 67 -->

#### 2.3.5 DarkNet模型加载接口

<!-- source: CN PDF p11; unit 68 -->

| API | load_darknet |
| --- | --- |
| 描述 | 加载DarkNet模型。（ARM64版本暂不支持该接口） |
| 参数 | model：DarkNet模型文件（.cfg后缀）路径。 |
| 参数 | weight：权重文件（.weights后缀）路径。 |
| 返回值 | 0：导入成功。 |
| 返回值 | -1：导入失败。 |

<!-- source: CN PDF p11; unit 69 -->

举例如下：

<!-- source: CN PDF p12; unit 70 -->

```text
# 从当前目录加载yolov3-tiny模型
ret = rknn.load_darknet(model='./yolov3-tiny.cfg',
           weight='./yolov3.weights')
```

<!-- source: CN PDF p12; unit 71 -->

#### 2.3.6 PyTorch模型加载接口

<!-- source: CN PDF p12; unit 72 -->

| API | load_pytorch |
| --- | --- |
| 描述 | 加载PyTorch模型。 支持量化感知训练（QAT）模型，但需要将torch版本更新至1.9.0以上。 |
| 参数 | model：PyTorch模型文件（.pt后缀）路径，而且需要是torchscript格式的模型。 |
| 参数 | input_size_list：每个输入节点对应的shape，所有输入shape放在一个列表中。 |
| 返回值 | 0：导入成功。 |
| 返回值 | -1：导入失败。 |

<!-- source: CN PDF p12; unit 73 -->

举例如下：

<!-- source: CN PDF p12; unit 74 -->

```text
# 从当前目录加载resnet18模型
ret = rknn.load_pytorch(model='./resnet18.pt',
           input_size_list=[[1,3,224,224]])
```

<!-- source: CN PDF p12; unit 75 -->

### 2.4 构建RKNN模型

<!-- source: CN PDF p12; unit 76 -->

| API | build |
| --- | --- |
| 描述 | 构建RKNN模型。 |
| 参数 | do_quantization：是否对模型进行量化。默认值为True。 |
| 参数 | dataset：用于量化校正的数据集。目前支持文本文件格式，用户可以把用于校正的图片<br>（jpg或png格式）或npy文件路径放到一个.txt文件中。文本文件里每一行一条路径信息。<br>如：<br>a.jpg<br>b.jpg<br>或<br>a.npy<br>b.npy<br>如有多个输入，则每个输入对应的文件用空格隔开，如：<br>a.jpg a2.jpg<br>b.jpg b2.jpg<br>或<br>a.npy a2.npy<br>b.npy b2.npy<br>注：量化图片建议选择与预测场景较吻合的图片。 |
| 参数 | rknn_batch_size：模型的输入Batch参数调整。默认值为None，表示不进行调整。 如果大于<br>1，则可以在一次推理中同时推理多帧输入图像或输入数据，如MobileNet模型的原始input维<br>度为[1, 224, 224, 3]，output维度为[1, 1001]，当rknn_batch_size设为4时，input的维度变为[4,<br>224, 224, 3]，output维度变为[4, 1001]。<br>注：<br>1. rknn_batch_size只有在NPU多核的平台上可以提高性能（提升核心利用率），因此<br>rknn_batch_size的值建议与核心数匹配。<br>2. rknn_batch_size修改后，模型的input/output的shape都会被修改，使用inference推理模型时<br>需要设置相应的input的大小，后处理时，也需要对返回的outputs进行处理。 |
| 参数 | auto_hybrid：是否开启自动混合量化调整精度或溢出。默认值为False，表示不进行调整。<br>当模型经行量化时，开启自动混合量化会将低于指定阈值的余弦距离/欧式距离的op转为fp16<br>计算(目前仅在w8a8量化下支持);当模型未进行量化时，开启自动混合量化会将超出fp16数值<br>范围的op转为int16计算。<br>注：<br>1. 余弦距离和欧式距离的阈值可通过config接口中的 auto_hybrid_cos_thresh和<br>auto_hybrid_euc_thresh设置。 |
| 返回<br>值 | 0：构建成功。 |
| 返回<br>值 | -1：构建失败。 |

<!-- source: CN PDF p13; unit 78 -->

举例如下：

<!-- source: CN PDF p13; unit 79 -->

```text
# 构建RKNN模型，并且做量化
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
```

<!-- source: CN PDF p13; unit 80 -->

### 2.5 导出RKNN模型

<!-- source: CN PDF p13; unit 81 -->

通过本工具构建的RKNN模型通过该接口可以导出存储为RKNN模型文件，用于模型部署。

<!-- source: CN PDF p13; unit 82 -->

| API | export_rknn |
| --- | --- |
| 描述 | 将RKNN模型保存到指定文件中（.rknn后缀）。 |
| 参数 | export_path：导出模型文件的路径。 |
| 返回值 | 0：导出成功。 |
| 返回值 | -1：导出失败。 |

<!-- source: CN PDF p13; unit 83 -->

举例如下：

<!-- source: CN PDF p13; unit 84 -->

```text
# 将构建好的RKNN模型保存到当前路径的mobilenet_v1.rknn文件中
ret = rknn.export_rknn(export_path='./mobilenet_v1.rknn')
```

<!-- source: CN PDF p14; unit 85 -->

### 2.6 加载RKNN模型

<!-- source: CN PDF p14; unit 86 -->

| API | load_rknn |
| --- | --- |
| 描述 | 加载RKNN模型。<br>加载完RKNN模型后，不需要再进行模型配置、模型加载和构建RKNN模型的步骤。并且加<br>载后的模型仅限于连接NPU硬件进行推理或获取性能数据等，不能用于模拟器或精度分析<br>等。 |
| 参数 | path：RKNN模型文件路径。 |
| 返回<br>值 | 0：加载成功。 |
| 返回<br>值 | -1：加载失败。 |

<!-- source: CN PDF p14; unit 87 -->

举例如下：

<!-- source: CN PDF p14; unit 88 -->

```text
# 从当前路径加载mobilenet_v1.rknn模型
ret = rknn.load_rknn(path='./mobilenet_v1.rknn')
```

<!-- source: CN PDF p14; unit 89 -->

### 2.7 初始化运行时环境

<!-- source: CN PDF p14; unit 90 -->

在模型推理或性能评估之前，必须先初始化运行时环境，明确模型的运行平台（具体的目标硬件平台或软件模拟器）。

<!-- source: CN PDF p14; unit 91 -->

| API | init_runtime |
| --- | --- |
| 描述 | 初始化运行时环境。 |
| 参数 | target：目标硬件平台，支持“rv1103”、“rv1103b”、“rv1106”、“rv1106b”、“rv1126b”、<br>“rk3562”、“rk3566”、“rk3568”、“rk3576”和“rk3588”。默认值为None，即在PC使用工具时，<br>模型在模拟器上运行。 注：target设为None时，需要先调用build或hybrid_quantization接口才<br>可让模型在模拟器上运行。 |
| 参数 | device_id：设备编号，如果PC连接多台设备时，需要指定该参数，设备编号可以通过<br>“list_devices”接口查看。默认值为None。 |
| 参数 | perf_debug：进行性能评估时是否开启debug模式。在debug模式下，可以获取到每一层的运<br>行时间，否则只能获取模型运行的总时间。默认值为False。 |
| 参数 | eval_mem：是否进入内存评估模式。进入内存评估模式后，可以调用eval_memory接口获取<br>模型运行时的内存使用情况。默认值为False。 |
| 参数 | async_mode：是否使用异步模式。默认值为False。<br>调用推理接口时，涉及设置输入图片、模型推理、获取推理结果三个阶段。如果开启了异步<br>模式，设置当前帧的输入将与推理上一帧同时进行，所以除第一帧外，之后的每一帧都可以<br>隐藏设置输入的时间，从而提升性能。在异步模式下，每次返回的推理结果都是上一帧的。<br>（目前版本该参数暂不支持） |
| 参数 | core_mask：设置运行时的NPU核心。支持的平台为RK3588 / RK3576，支持的配置如下：<br>RKNN.NPU_CORE_AUTO：表示自动调度模型，自动运行在当前空闲的NPU核上。<br>RKNN.NPU_CORE_0：表示运行在NPU0核心上。<br>RKNN.NPU_CORE_1：表示运行在NPU1核心上。<br>RKNN.NPU_CORE_2：表示运行在NPU2核心上。<br>RKNN.NPU_CORE_0_1：表示同时运行在NPU0、NPU1核心上。<br>RKNN.NPU_CORE_0_1_2：表示同时运行在NPU0、NPU1、NPU2核心上。<br>RKNN.NPU_CORE_ALL：表示根据平台自动配置NPU核心数量。<br>默认值为RKNN.NPU_CORE_AUTO。<br>注：RK3576只有2个核心，因此不能设置NPU_CORE_2和NPU_CORE_0_1_2。 |
| 参数 | fallback_prior_device：设置当OP超出NPU规格时fallback的优先级，当前支持“cpu”或<br>“gpu”，“gpu”只有在存在GPU硬件的平台上有效。默认值是“cpu”。 |
| 返回<br>值 | 0：初始化运行时环境成功。 |
| 返回<br>值 | -1：初始化运行时环境失败。 |

<!-- source: CN PDF p15; unit 93 -->

举例如下：

<!-- source: CN PDF p15; unit 94 -->

```text
# 初始化运行时环境
ret = rknn.init_runtime(target='rk3566')
```

<!-- source: CN PDF p15; unit 95 -->

### 2.8 模型推理

<!-- source: CN PDF p15; unit 96 -->

在进行模型推理前，必须先构建或加载一个RKNN模型。

<!-- source: CN PDF p15; unit 97 -->

| API | inference |
| --- | --- |
| 描述 | 对当前模型进行推理，并返回推理结果。<br>如果初始化运行环境时有设置target为Rockchip NPU设备，得到的是模型在硬件平台上的推<br>理结果。如果没有设置target，得到的则是模型在模拟器上的推理结果。 |
| 参数 | inputs：待推理的输入列表，格式为ndarray。 |
| 参数 | data_format：输入数据的layout列表，“nchw”或“nhwc”，只对4维的输入有效。默认值为<br>None，表示所有输入的layout都为NHWC。 |
| 参数 | inputs_pass_through：输入的透传列表。默认值为None，表示所有输入都不透传。<br>非透传模式下，在将输入传给NPU驱动之前，工具会对输入进行减均值、除方差等操作；而<br>透传模式下，不会做这些操作，而是直接将输入传给NPU。<br>该参数的值是一个列表，比如要透传input0，不透传input1，则该参数的值为[1, 0]。 |
| 返回<br>值 | results：推理结果，类型是ndarray list。 |

<!-- source: CN PDF p15; unit 98 -->

举例如下：

<!-- source: CN PDF p16; unit 99 -->

对于分类模型，如mobilenet_v1，代码如下（完整代码参考example/tflite/mobilent_v1）：

<!-- source: CN PDF p16; unit 100 -->

```text
# 使用模型对图片进行推理，得到TOP5结果
outputs = rknn.inference(inputs=[img])
show_outputs(outputs)
```

<!-- source: CN PDF p16; unit 101 -->

输出的TOP5结果如下：

<!-- source: CN PDF p16; unit 102 -->

```text
-----TOP 5-----
[ 156] score:0.928223 class:"Shih-Tzu"
[ 155] score:0.063171 class:"Pekinese, Pekingese, Peke"
[ 205] score:0.004299 class:"Lhasa, Lhasa apso"
[ 284] score:0.003096 class:"Persian cat"
[ 285] score:0.000171 class:"Siamese cat, Siamese"
```

<!-- source: CN PDF p16; unit 103 -->

### 2.9 评估模型性能

<!-- source: CN PDF p16; unit 104 -->

| API | eval_perf |
| --- | --- |
| 描述 | 评估模型性能。<br>模型必须运行在与PC连接的RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 /<br>RK3566 / RK3568 / RK3576 / RK3588上。如果调用“init_runtime”的接口来初始化运行环境时<br>设置perf_debug为False，则获得的是模型在硬件上运行的总时间；如果设置perf_debug为<br>True，除了返回总时间外，还将返回每一层的耗时情况。 |
| 参数 | is_print：是否打印性能信息，默认值为True。 |
| 参数 | fix_freq：是否固定硬件设备的频率，默认值为True。 |
| 返回<br>值 | perf_result：性能信息（字符串）。 |

<!-- source: CN PDF p16; unit 105 -->

举例如下：

<!-- source: CN PDF p16; unit 106 -->

```text
# 对模型性能进行评估
perf_detail = rknn.eval_perf()
```

<!-- source: CN PDF p16; unit 107 -->

### 2.10 获取内存使用情况

<!-- source: CN PDF p16; unit 108 -->

| API | eval_memory |
| --- | --- |
| 描述 | 获取模型在硬件平台运行时的内存使用情况。<br>模型必须运行在与PC连接的RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 /<br>RK3566 / RK3568 / RK3576 / RK3588上。 |
| 参数 | is_print：是否以规范格式打印内存使用情况，默认值为True。 |
| 返回<br>值 | memory_detail：内存使用情况，类型为字典。 内存使用情况按照下面的格式封装在字典<br>中：<br>{<br>'weight_memory': 3698688,<br>'internal_memory': 1756160,<br>'other_memory': 484352,<br>'total_memory': 5939200,<br>}<br>- 'weight_memory' 字段表示运行时模型权重的内存占用。<br>- 'internal_memory' 字段表示运行时模型中间tensor内存占用。<br>- 'other_memory' 字段表示运行时其他的内存占用。<br>- 'total_model_allocation' 表示运行时的总内存占用，即权重、中间tensor和其他的内存占用之<br>和。 |

<!-- source: CN PDF p17; unit 110 -->

举例如下：

<!-- source: CN PDF p17; unit 111 -->

```text
# 对模型内存使用情况进行评估
memory_detail = rknn.eval_memory()
```

<!-- source: CN PDF p17; unit 112 -->

如examples/caffe/mobilenet_v2，它在RK3588上运行时内存占用情况如下：

<!-- source: CN PDF p17; unit 113 -->

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

<!-- source: CN PDF p17; unit 114 -->

### 2.11 查询SDK版本

<!-- source: CN PDF p17; unit 115 -->

| API | get_sdk_version |
| --- | --- |
| 描述 | 获取SDK API和驱动的版本号。<br>注：使用该接口前必须完成模型加载和初始化运行环境，且该接口只能在硬件平台RV1103 /<br>RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588<br>上使用。 |
| 参数 | 无。 |
| 返回<br>值 | sdk_version：API和驱动版本信息，类型为字符串。 |

<!-- source: CN PDF p18; unit 116 -->

举例如下：

<!-- source: CN PDF p18; unit 117 -->

```text
# 获取SDK版本信息
sdk_version = rknn.get_sdk_version()
print(sdk_version)
```

<!-- source: CN PDF p18; unit 118 -->

返回的SDK信息类似如下：

<!-- source: CN PDF p18; unit 119 -->

```text
==============================================
RKNN VERSION:
  API: 1.5.2 (8babfea build@2023-08-25T02:31:12)
  DRV: rknn_server: 1.5.2 (8babfea build@2023-08-25T10:30:12)
  DRV: rknnrt: 1.5.3b13 (42cbca6f5@2023-10-27T10:13:21)
==============================================
```

<!-- source: CN PDF p18; unit 120 -->

### 2.12 混合量化

<!-- source: CN PDF p18; unit 121 -->

#### 2.12.1 hybrid_quantization_step1

<!-- source: CN PDF p18; unit 122 -->

使用混合量化功能时，第一阶段调用的主要接口是hybrid_quantization_step1，用于生成临时模型文件（&lt;model_name&gt;.model）、数据文件（&lt;model_name&gt;.data）和量化配置文件（&lt;model_name&gt;.quantization.cfg）。接口详情如下：

<!-- source: CN PDF p18; unit 123 -->

| API | hybrid_quantization_step1 |
| --- | --- |
| 描述 | 根据加载的原始模型，生成对应的临时模型文件、配置文件和量化配置文件。 |
| 参数 | dataset：见2.4 构建RKNN模型的dataset说明。 |
| 参数 | rknn_batch_size：见2.4 构建RKNN模型的rknn_batch_size说明。 |
| 参数 | proposal：产生混合量化的配置建议值。 默认值为False。 |
| 参数 | proposal_dataset_size：proposal使用的dataset的张数。默认值为1。 因为proposal功能比较耗<br>时，所以默认只使用1张，也就是dataset里的第一张。 |
| 参数 | custom_hybrid：用于根据用户指定的多组输入和输出名，选取混合量化对应子图。格式为<br>[[input0_name, output0_name], [input1_name, output1_name], …]。默认值为None。<br>注：输入和输出名应根据生成的临时模型文件(&lt;model_name&gt;.model)来选择。 |
| 返回<br>值 | 0：成功。 |
| 返回<br>值 | -1：失败。 |

<!-- source: CN PDF p18; unit 124 -->

举例如下：

<!-- source: CN PDF p18; unit 125 -->

```text
# 调用hybrid_quantization_step1 产生量化配置文件
ret = rknn.hybrid_quantization_step1(dataset='./dataset.txt')
```

<!-- source: CN PDF p19; unit 126 -->

#### 2.12.2 hybrid_quantization_step2

<!-- source: CN PDF p19; unit 127 -->

用于使用混合量化功能时生成RKNN模型，接口详情如下：

<!-- source: CN PDF p19; unit 128 -->

| API | hybrid_quantization_step2 |
| --- | --- |
| 描述 | 接收临时模型文件、配置文件、量化配置文件和校正数据集作为输入，生成混合量化后的<br>RKNN模型。 |
| 参数 | model_input：hybrid_quantization_step1生成的临时模型文件（&lt;model_name&gt;.model）路<br>径。 |
| 参数 | data_input：hybrid_quantization_step1生成的数据文件（&lt;model_name&gt;.data）路径。 |
| 参数 | model_quantization_cfg：hybrid_quantization_step1生成并经过修改后的模型量化配置文件<br>（&lt;model_name&gt;.quantization.cfg）路径。 |
| 返回<br>值 | 0：成功。 |
| 返回<br>值 | -1：失败。 |

<!-- source: CN PDF p19; unit 129 -->

举例如下：

<!-- source: CN PDF p19; unit 130 -->

```text
# Call hybrid_quantization_step2 to generate hybrid quantized RKNN model
ret = rknn.hybrid_quantization_step2(
       model_input='./ssd_mobilenet_v2.model',
       data_input='./ssd_mobilenet_v2.data',
       model_quantization_cfg='./ssd_mobilenet_v2.quantization.cfg')
```

<!-- source: CN PDF p19; unit 131 -->

### 2.13 量化精度分析

<!-- source: CN PDF p19; unit 132 -->

该接口的功能是进行浮点、量化推理并产生每层的数据，并进行量化精度分析。

<!-- source: CN PDF p19; unit 133 -->

| API | accuracy_analysis |
| --- | --- |
| 描述 | 推理并产生快照，也就是dump出每一层的tensor数据。会dump出包括fp32和quant两种数据类<br>型的快照，用于计算量化误差。<br>注：<br>1. 该接口只能在 build 或 hybrid_quantization_step2 之后调用。<br>2. 如未指定target，并且原始模型应该为已量化的模型（QAT模型），则会调用失败。<br>3. 该接口使用的量化方式与config中指定的一致。 |
| 参数 | inputs：图像（jpg / png / bmp / npy等）路径 list。 |
| 参数 | output_dir：输出目录，所有快照都保存在该目录。默认值为'./snapshot'。<br>如果没有设置target，在output_dir下会输出：<br>- simulator目录：保存整个量化模型在simulator上完整运行时每一层的结果（已转成<br>float32）；<br>- golden目录：保存整个浮点模型在simulator上完整跑下来时每一层的结果;<br>- error_analysis.txt：记录simulator上量化模型逐层运行时每一层的结果与golden浮点模型逐层<br>运行时每一层的结果的余弦距离（entire_error cosine），以及量化模型取上一层的浮点结果<br>作为输入时，输出与浮点模型的余弦距离（single_error cosine），更详细的信息请查看<br>error_analysis.txt文件。<br>如果有设置target，则在output_dir里还会多输出：<br>- runtime目录：保存整个量化模型在NPU上完整运行时每一层的结果（已转成float32）。<br>- error_analysis.txt：在上述记录的内容的基础上，还会记录量化模型在simulator上逐层运行<br>时每一层的结果与NPU上逐层运行时每一层的结果的余弦距离（entire_error cosine）等信<br>息，更详细的信息请查看error_analysis.txt文件。 |
| 参数 | target：目标硬件平台，支持“rv1103”、“rv1103b”、“rv1106”、“rv1106b”、“rv1126b”、<br>“rk3562”、“rk3566”、“rk3568”、“rk3576”和“rk3588”，默认为None。<br>如果设置了target，则会获取NPU运行时每一层的结果，并进行精度的分析。 |
| 参数 | device_id：设备编号，如果PC连接多台设备时，需要指定该参数，设备编号可以通过<br>“list_devices”接口查看。默认值为None。 |
| 返回<br>值 | 0：成功。 |
| 返回<br>值 | -1：失败。 |

<!-- source: CN PDF p20; unit 135 -->

举例如下：

<!-- source: CN PDF p20; unit 136 -->

```text
# Accuracy analysis
ret = rknn.accuracy_analysis(inputs=['./dog_224x224.jpg'])
```

<!-- source: CN PDF p20; unit 137 -->

### 2.14 获取设备列表

<!-- source: CN PDF p20; unit 138 -->

| API | list_devices |
| --- | --- |
| 描述 | 列出已连接的RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 /<br>RK3568 / RK3576 / RK3588。<br>注：目前设备连接模式有两种：ADB和NTB。多设备连接时请确保他们的模式都是一样<br>的。 |
| 参数 | 无。 |
| 返回<br>值 | 返回adb_devices列表和ntb_devices列表，如果设备为空，则返回空列表。 |

<!-- source: CN PDF p20; unit 139 -->

举例如下：

<!-- source: CN PDF p21; unit 140 -->

```text
rknn.list_devices()
```

<!-- source: CN PDF p21; unit 141 -->

返回的设备列表信息如下：

<!-- source: CN PDF p21; unit 142 -->

```text
*************************
all device(s) with adb mode:
VD46C3KM6N
*************************
```

<!-- source: CN PDF p21; unit 143 -->

注：使用多设备时，需要保证它们的连接模式都是一致的，否则会引起冲突，导致设备连接失败。

<!-- source: CN PDF p21; unit 144 -->

### 2.15 导出加密模型

<!-- source: CN PDF p21; unit 145 -->

该接口的功能是将普通的RKNN模型进行加密，得到加密后的模型。

<!-- source: CN PDF p21; unit 146 -->

| API | export_encrypted_rknn_model |
| --- | --- |
| 描述 | 根据用户指定的加密等级对普通的RKNN模型进行加密。<br>注：RV1103/RV1103B/RV1106/RV1106B/RK2118平台暂不支持。 |
| 参数 | input_model：待加密的RKNN模型路径。 |
| 参数 | output_model：模型加密后的保存路径。默认值为None，表示使用<br>{original_model_name}.crypt.rknn作为加密后的模型名字。 |
| 参数 | crypt_level：加密等级，有1，2和3三个等级。默认值为1。<br>等级越高，安全性越高，解密越耗时；反之，安全性越低，解密越快。数据类型为整型， |
| 返回<br>值 | 0：成功。 |
| 返回<br>值 | -1：失败。 |

<!-- source: CN PDF p21; unit 147 -->

举例如下：

<!-- source: CN PDF p21; unit 148 -->

```text
ret = rknn.export_encrypted_rknn_model('test.rknn')
```

<!-- source: CN PDF p21; unit 149 -->

### 2.16 注册自定义算子

<!-- source: CN PDF p21; unit 150 -->

该接口的功能是注册一个自定义算子。

<!-- source: CN PDF p21; unit 151 -->

| API | reg_custom_op |
| --- | --- |
| 描述 | 注册用户提供的自定义算子类。目前只支持ONNX模型。 |
| 参数 | custom_op：用户自定义的算子类。用于用户需要自定义一个不存在于ONNX算子规范内的<br>新算子。该算子的op_type推荐以“cst”字符开头，并且其算子类的shape_infer和compute函数<br>需要用户自己实现。<br>注：custom_op算子类仅用于模型转换并生成带有自定义算子的RKNN模型，在设备端进行<br>部署时还需要参考《RKNN SDK User Guide》的5.5章节。 |
| 返回<br>值 | 0：成功。 |
| 返回<br>值 | -1：失败。 |

<!-- source: CN PDF p22; unit 153 -->

举例如下：

<!-- source: CN PDF p22; unit 154 -->

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

<!-- source: CN PDF p22; unit 155 -->

### 2.17 生成C++部署示例

<!-- source: CN PDF p22; unit 156 -->

| API | codegen |
| --- | --- |
| 描述 | 自动生成C++的部署示例。 |
| 参数 | output_path：输出文件夹目录，用户可配置目录名称。 |
| 参数 | inputs：填写模型输入的路径列表，允许不填。有效文件格式为jpg/png/npy，以npy文件为输<br>入时，npy数据的维度信息应与模型输入的维度信息保持一致。 |
| 参数 | overwrite：设为True时，会覆盖output_path指定目录下的文件。默认值为alse。 |
| 返回<br>值 | 0：成功。 |
| 返回<br>值 | -1：失败。 |

<!-- source: CN PDF p22; unit 157 -->

举例如下：

<!-- source: CN PDF p22; unit 158 -->

```text
ret = rknn.codegen(output_path='./rknn_app_demo',
        inputs=['./mobilenet_v2/dog_224x224.jpg'],
        overwrite=True)
```

{% endraw %}
