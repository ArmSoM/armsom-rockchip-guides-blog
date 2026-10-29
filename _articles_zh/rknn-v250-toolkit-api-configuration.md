---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — 模型配置与量化参数"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-toolkit-api-configuration"
slug: "rknn-v250-toolkit-api-configuration"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — 模型配置与量化参数 | 完整参数、代码与平台限制参考"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — 模型配置与量化参数 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-toolkit-api-configuration/"
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

<!-- source CN p8 unit 38 -->

## 3 模型配置接口

<!-- source CN p8 unit 39 -->

在构建RKNN模型之前,需要先对模型进行通道均值、量化图片RGB2BGR转换、量化类型等的配置,这些操作可以通过config接口进行配置。

<!-- source CN p8 unit 40 -->

| API | config |
| --- | --- |
| 描述 | 设置模型转换参数。 |
| 参数 | mean_values:输入的均值。参数格式是一个列表,列表中包含一个或多个均值子列表,多输入模型对应<br>多个子列表,每个子列表的⻓度与该输入的通道数一致,例如[[128,128,128]],表示一个输入的三个通道<br>的值减去128。<br>默认值为None,表示所有的mean值为0。 |
| 参数 | std_values:输入的归一化值。参数格式是一个列表,列表中包含一个或多个归一化值子列表,多输入模<br>型对应多个子列表,每个子列表的⻓度与该输入的通道数一致,例如[[128,128,128]],表示设置一个输入<br>的三个通道的值减去均值后再除以128。<br>默认值为None,表示所有的std值为1。 |
| 参数 | quant_img_RGB2BGR:表示在加载量化图像时是否需要先做RGB2BGR的操作。如果有多个输入,则<br>用列表包含起来,如[True, True, False]。默认值为False。<br>该配置一般用在Caffe的模型上,Caffe模型训练时大多会先对数据集图像进行RGB2BGR转换,此时需将该<br>配置设为True。<br>另外,该配置只对量化图像格式为jpg/png/bmp有效,npy格式读取时会忽略该配置,因此当模型输入为<br>BGR时,npy也需要为BGR格式。<br>该配置仅用于在量化阶段(build接口)读取量化图像或量化精度分析(accuracy_analysis接口),并不<br>会保存在最终的RKNN模型中,因此如果模型的输入为BGR,则在调用toolkit2的inference或C-API的<br>run函数之前,需要保证传入的图像数据也为BGR格式。 |
| 参数 | quantized_dtype:量化类型,目前支持的量化类型有w8a8、w4a16、w8a16和w16a16i_dfp。默认<br>值为w8a8。<br>- w8a8:权重为8bit非对称量化精度,激活值为8bit非对称量化精度。(RK2118不支持)<br>- w4a16:权重为4bit对称量化精度,激活值为16bit浮点精度。支持group=1且权重为常量的卷积、带常<br>量输入的MatMul算子(工具将自动转为等效的1x1卷积),不支持其他算子。(仅RK3576/RV1126B支<br>持)<br>- w8a16:权重为8bit非对称量化精度,激活值为16bit浮点精度。(仅RK3562支持)<br>- w16a16i_dfp:权重为16bit动态定点量化精度,激活值为16bit动态定点量化精度。(仅<br>RV1103/RV1106支持) |
| 参数 | quantized_algorithm:计算每一层的量化参数时采用的量化算法,目前支持的量化算法有:normal,<br>mmse,kl_divergence及gdq。默认值为normal。<br>normal量化算法的特点是速度较快,推荐量化数据集量一般为20-100张左右,更多的数据集量下精度未必<br>会有进一步提升。<br>mmse量化算法由于采用暴力迭代的方式,速度较慢,但通常会比normal具有更高的精度,推荐量化数据<br>集量一般为20-50张左右,用戶也可以根据量化时间⻓短对量化数据集量进行适当增减。<br>kl_divergence量化算法所用时间会比normal多一些,但比mmse会少很多,在某些场景下(feature分<br>布不均匀时)可以得到较好的改善效果,推荐量化数据集量一般为20-100张左右。<br>gdq量化算法只在w4a16和w8a16下有效,能有效的提高w4a16和w8a16的权重量化精度,推荐量化数据<br>集量为200张以上。 |
| 参数 | quantized_method:目前支持layer,channel或者group{SIZE}。默认值为channel。<br>- layer:每层的weight只有一套量化参数;<br>- channel:每层的weight的每个输出通道都有一套量化参数,通常情况下channel会比layer精度更高。<br>- group{SIZE}:在channel的基础上,每个输出通道的weight在输入通道上又按{SIZE}细分为多个小<br>组,每个小组有各自的一套量化参数,通常情况下group{SIZE}会比channel精度更高。{SIZE}是32到<br>256之间的32的倍数值,如group32或group128。目前group{SIZE}只在quantized_dtype为w4a16下<br>有效。 |
| 参数 | float_dtype:用于指定非量化情况下的浮点的数据类型,目前支持的数据类型有float16。默认值为<br>float16。 |
| 参数 | optimization_level:模型优化等级。默认值为3。<br>通过修改模型优化等级,可以关掉部分或全部模型转换过程中使用到的优化规则。该参数的默认值为3,打<br>开所有优化选项。值为2或1时关闭一部分可能会对部分模型精度产生影响的优化选项,值为0时关闭所有优<br>化选项。 |
| 参数 | target_platform:指定RKNN模型是基于哪个目标芯片平台生成的。目前支持“rv1103”、<br>“rv1103b”、“rv1106”、“rv1106b”、“rv1126b”、“rk2118”、“rk3562”、“rk3566”、“rk3568”、<br>“rk3576”和“rk3588”。该参数对大小写不敏感。函数签名中的默认值为None,但None不是有效配置值,<br>调用config时必须设置该参数。 |
| 参数 | custom_string:添加自定义字符串信息到RKNN模型,可以在runtime时通过query查询到该信息,方<br>便部署时根据不同的RKNN模型做特殊的处理。默认值为None。 |
| 参数 | remove_weight:去除conv等权重以生成一个RKNN的从模型,该从模型可以与带完整权重的RKNN模<br>型共享权重以减少内存消耗。默认值为False。 |
| 参数 | compress_weight:压缩模型权重,可以减小RKNN模型的大小。默认值为False。 |
| 参数 | single_core_mode:是否仅生成单核模型,可以减小RKNN模型的大小和内存消耗。默认值为False。目<br>前仅对RK3588 / RK3576生效。默认值为False。 |
| 参数 | model_pruning:对模型进行无损剪枝。对于权重稀疏的模型,可以减小转换后RKNN模型的大小和计算<br>量。默认值为False。 |
| 参数 | op_target:用于指定OP的具体执行目标(可以设置运行在NPU/CPU/GPU等),通过输出tensor名的方<br>式,{'op0_output_name':'cpu', 'op1_output_name':'npu', ...}, 或者通过指定op_type的方式,<br>{'op_type':'cpu'....}, 同时还可以支持混合使用,{'op_type':'cpu‘, 'op0_output_name':'cpu'....} 。<br>默认值为None。<br>其中,'op0_output_name'和'op1_output_name'为对应OP的输出tensor名,可以通过精度分析<br>(accuracy_analysis)功能的返回结果中获取。'cpu'和'npu'则表示该tensor对应的OP的执行目标是CPU<br>或NPU,目前可选的选项有:'cpu' / 'npu' / 'gpu' / 'auto',其中,'auto'是自动选择执行目标。指定<br>op_type的方式,同样需要通过精度分析返回结果中获取,可以将模型内所有该op_type的执行目标设置到<br>CPU或NPU,例如,{'Add':'cpu', 'Expand':'cpu',....}。 |
| 参数 | dynamic_input:用于根据用戶指定的多组输入shape,来模拟动态输入的功能。格式为<br>[[input0_shapeA, input1_shapeA, ...], [input0_shapeB, input1_shapeB, ...], ...]。<br>默认值为None,实验性功能。<br>假设原始模型只有一个输入,shape为[1,3,224,224],或者原始模型的输入shape本身就是动态的,如<br>shape为[1,3,height,width]或[1,3,-1,-1],但部署的时候,需要该模型支持3种不同的输入shape,如<br>[1,3,224,224], [1,3,192,192]和[1,3,160,160],此时可以设置dynamic_input=[[[1,3,224,224]],<br>[[1,3,192,192]], [[1,3,160,160]]],转换成RKNN模型后进行推理时,需传入对应shape的输入数据。<br>注:<br>1. 需要原始模型本身支持动态输入才可开启此功能,否则会报错。<br>2. 如果原始模型输入shape本身就是动态的,则只有动态的轴可以设置不同的值。 |
| 参数 | quantize_weight:在build接口的do_quantization为False情况下, 通过对一些权重进行量化以减小<br>rknn模型的大小。<br>默认值为False。 |
| 参数 | remove_reshape:删除模型的输入和输出中可能存在的Reshape的OP,以提高模型运行时性能(因为<br>目前很多平台的Reshape是跑在cpu上,相对较慢)。<br>默认为 False。<br>注:开启后可能会修改模型的输入或输出节点的shape,需要留意观察转换过程中的warning打印,并在<br>部署时也需要考虑输入和输出shape变化的影响。 |
| 参数 | sparse_infer:在已经稀疏化过的模型上进行稀疏化推理,以提高推理性能。 目前仅对<br>RK3576/RV1126B生效。默认为 False。 |
| 参数 | enable_flash_attention:是否启用Flash Attention。默认为 False。<br>注:FlashAttention是基于 https://arxiv.org/abs/2307.08691 实现, 通过高速缓存内循环实现加速以及<br>减少宽带使用,但是会导致模型增大,请根据具体场景和模型选择是否开启使用。更多详情请查看“RKNN<br>Compiler Support Operator List”的exSDPAttention说明。 |
| 参数 | auto_hybrid_cos_thresh:模型量化时开启自动混合量化中余弦距离的阈值。默认为 0.98。 |
| 参数 | auto_hybrid_euc_thresh:模型量化时开启自动混合量化中欧式距离的阈值。默认为 None,即默认不<br>启用。 |
| 参数 | memory_plan_strategy:指定编译 rknn 模型过程中 Internal 内存的分配方案,影响最终模型上板推<br>理的内存占用。可选项为 BestFit、GreedyBySize、GreedyByLifetime、SlowPeakGrowth。默认为<br>BestFit<br>BestFit - 所有任务根据起始时间排序,起始时间一致时,内存大者优先。随后依次分配任务内存地址,<br>在已分配内存的地址中,为当前任务寻找大小最接近的一块空闲内存进行分配。<br>GreedyBySize - 所有任务根据所需内存大小排序,内存大小一致时,起始时间前者优先。随后依次分配<br>任务内存地址,在已分配内存的地址中,为当前任务寻找大小最接近的一块空闲内存进行分配。<br>GreedyByLifetime - 所有任务根据起始时间排序,起始时间一致时,内存大者优先。搜集每一个已分配<br>内存的终止地址作为候选(额外包含0地址),寻找生命周期最⻓任务和低位无冲突的候选地址进行分配,循环<br>遍历直到分配完成<br>SlowPeakGrowth - 所有任务根据起始时间排序,起始时间一致时,内存大者优先。搜集每一个已分配<br>内存的终止地址作为候选(额外包含0地址),寻找使内存峰值增⻓最小的任务和低位无冲突的候选地址进行分<br>配,循环遍历直到分配完成 |
| 参数 | compute_order:指定 rknn 推理时图的执行拓扑顺序,部分模型推理时的 Internal 内存占用会受此参<br>数影响,尤其是带有多分支结构的模型。可选项为 WidthFirst、DepthFirst。默认为 WidthFirst。 |
| 返回值 | 0:配置成功。<br>配置无效时抛出ValueError。 |

<!-- source CN p10 unit 43 -->

举例如下:

<!-- source CN p10 unit 44 -->

```python
# model config
rknn.config(mean_values=[[103.94, 116.78, 123.68]],
           std_values=[[58.82, 58.82, 58.82]],
           quant_img_RGB2BGR=True,
           target_platform='rk3566')
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

校对提示：原文日志示例仍显示 SDK 1.5.2，按历史示例保留，不作为 V2.5.0 实测结果。中英文环境表对 Ubuntu20.04 的 Python 列写法不同（中文 3.8/3.9、英文 3.8/3.8，Debian11 也存在相同差异），ARM64 段的 Debian 表头仍写 x64，均保留来源并提醒按实际安装包核对。V2.5.0 已新增 C++ codegen 章节并细化量化与内存策略；未用旧版参数替换新版。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
