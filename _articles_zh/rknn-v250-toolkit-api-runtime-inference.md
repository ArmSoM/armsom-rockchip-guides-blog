---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — 运行时、算子注册与推理"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-toolkit-api-runtime-inference"
slug: "rknn-v250-toolkit-api-runtime-inference"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — 运行时、算子注册与推理 | 完整参数、代码与平台限制参考"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — 运行时、算子注册与推理 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-toolkit-api-runtime-inference/"
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

<!-- source CN p17 unit 92 -->

## 7 运行时初始化与推理接口

<!-- source CN p17 unit 93 -->

### 7.1 加载RKNN模型

<!-- source CN p17 unit 94 -->

| API | load_rknn |
| --- | --- |
| 描述 | 加载RKNN模型。<br>加载完RKNN模型后,不需要再进行模型配置、模型加载和构建RKNN模型的步骤。并且加载后的模型仅限<br>于连接NPU硬件进行推理或获取性能数据等,不能用于模拟器或精度分析等。 |
| 参数 | path:RKNN模型文件路径。 |
| 返回值 | 0:加载成功。 |
| 返回值 | -1:加载失败。 |

<!-- source CN p17 unit 95 -->

举例如下:

<!-- source CN p17 unit 96 -->

```python
# 从当前路径加载mobilenet_v1.rknn模型
ret = rknn.load_rknn(path='./mobilenet_v1.rknn')
```

<!-- source CN p17 unit 97 -->

### 7.2 初始化运行时环境

<!-- source CN p17 unit 98 -->

在模型推理或性能评估之前,必须先初始化运行时环境,明确模型的运行平台(具体的目标硬件平台或软件模拟器)。

<!-- source CN p17 unit 99 -->

| API | init_runtime |
| --- | --- |
| 描述 | 初始化运行时环境。 |
| 参数 | target:目标硬件平台,支持“rv1103”、“rv1103b”、“rv1106”、“rv1106b”、“rv1126b”、<br>“rk3562”、“rk3566”、“rk3568”、“rk3576”和“rk3588”。默认值为None,即在PC使用工具时,模型<br>在模拟器上运行。 注:target设为None时,需要先调用build或hybrid_quantization接口才可让模型在模<br>拟器上运行。 |
| 参数 | device_id:设备编号,如果PC连接多台设备时,需要指定该参数,设备编号可以通过“list_devices”接<br>口查看。默认值为None。 |
| 参数 | perf_debug:进行性能评估时是否开启debug模式。在debug模式下,可以获取到每一层的运行时间,<br>否则只能获取模型运行的总时间。默认值为False。 |
| 参数 | eval_mem:是否进入内存评估模式。进入内存评估模式后,可以调用eval_memory接口获取模型运行时<br>的内存使用情况。默认值为False。 |
| 参数 | async_mode:是否使用异步模式。默认值为False。<br>调用推理接口时,涉及设置输入图片、模型推理、获取推理结果三个阶段。如果开启了异步模式,设置当前<br>帧的输入将与推理上一帧同时进行,所以除第一帧外,之后的每一帧都可以隐藏设置输入的时间,从而提升<br>性能。在异步模式下,每次返回的推理结果都是上一帧的。(目前版本该参数暂不支持) |
| 参数 | core_mask:设置运行时的NPU核心。支持的平台为RK3588 / RK3576,支持的配置如下:<br>RKNN.NPU_CORE_AUTO:表示自动调度模型,自动运行在当前空闲的NPU核上。<br>RKNN.NPU_CORE_0:表示运行在NPU0核心上。<br>RKNN.NPU_CORE_1:表示运行在NPU1核心上。<br>RKNN.NPU_CORE_2:表示运行在NPU2核心上。<br>RKNN.NPU_CORE_0_1:表示同时运行在NPU0、NPU1核心上。<br>RKNN.NPU_CORE_0_1_2:表示同时运行在NPU0、NPU1、NPU2核心上。<br>RKNN.NPU_CORE_ALL:表示根据平台自动配置NPU核心数量。<br>默认值为RKNN.NPU_CORE_AUTO。<br>注:RK3576只有2个核心,因此不能设置NPU_CORE_2和NPU_CORE_0_1_2。 |
| 参数 | fallback_prior_device:设置当OP超出NPU规格时fallback的优先级,当前支持“cpu”或“gpu”,<br>“gpu”只有在存在GPU硬件的平台上有效。默认值是“cpu”。 |
| 返回值 | 0:初始化运行时环境成功。 |
| 返回值 | -1:初始化运行时环境失败。 |

<!-- source CN p18 unit 101 -->

举例如下:

<!-- source CN p18 unit 102 -->

```python
# 初始化运行时环境
ret = rknn.init_runtime(target='rk3566')
```

<!-- source CN p18 unit 103 -->

### 7.3 注册自定义算子

<!-- source CN p18 unit 104 -->

该接口的功能是注册一个自定义算子。

<!-- source CN p18 unit 105 -->

| API | reg_custom_op |
| --- | --- |
| 描述 | 注册用戶提供的自定义算子类。目前只支持ONNX模型。 |
| 参数 | custom_op:用戶自定义的算子类。用于用戶需要自定义一个不存在于ONNX算子规范内的新算子。该算<br>子的op_type推荐以“cst”字符开头,并且其算子类的shape_infer和compute函数需要用戶自己实现。<br>注:custom_op算子类仅用于模型转换并生成带有自定义算子的RKNN模型,在设备端进行部署时还需要参<br>考《RKNN SDK User Guide》的5.5章节。 |
| 返回值 | 0:成功。 |
| 返回值 | -1:失败。 |

<!-- source CN p18 unit 106 -->

举例如下:

<!-- source CN p19 unit 107 -->

```python
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

<!-- source CN p19 unit 108 -->

### 7.4 模型推理

<!-- source CN p19 unit 109 -->

在进行模型推理前,必须先构建或加载一个RKNN模型。

<!-- source CN p19 unit 110 -->

| API | inference |
| --- | --- |
| 描述 | 对当前模型进行推理,并返回推理结果。<br>如果初始化运行环境时有设置target为Rockchip NPU设备,得到的是模型在硬件平台上的推理结果。如果<br>没有设置target,得到的则是模型在模拟器上的推理结果。 |
| 参数 | inputs:待推理的输入列表,格式为ndarray。 |
| 参数 | data_format:输入数据的layout列表,“nchw”或“nhwc”,只对4维的输入有效。默认值为None,表<br>示所有输入的layout都为NHWC。 |
| 参数 | inputs_pass_through:输入的透传列表。默认值为None,表示所有输入都不透传。<br>非透传模式下,在将输入传给NPU驱动之前,工具会对输入进行减均值、除方差等操作;而透传模式下,不<br>会做这些操作,而是直接将输入传给NPU。<br>该参数的值是一个列表,比如要透传input0,不透传input1,则该参数的值为[1, 0]。 |
| 返回值 | results:推理结果,类型是ndarray list。 |

<!-- source CN p19 unit 111 -->

举例如下:

<!-- source CN p19 unit 112 -->

对于分类模型,如mobilenet_v1,代码如下(完整代码参考example/tflite/mobilent_v1):

<!-- source CN p19 unit 113 -->

```python
# 使用模型对图片进行推理,得到TOP5结果
outputs = rknn.inference(inputs=[img])
show_outputs(outputs)
```

<!-- source CN p19 unit 114 -->

输出的TOP5结果如下:

<!-- source CN p20 unit 115 -->

```text
-----TOP 5-----
[ 156] score:0.928223 class:"Shih-Tzu"
[ 155] score:0.063171 class:"Pekinese, Pekingese, Peke"
[ 205] score:0.004299 class:"Lhasa, Lhasa apso"
[ 284] score:0.003096 class:"Persian cat"
[ 285] score:0.000171 class:"Siamese cat, Siamese"
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

校对提示：原文日志示例仍显示 SDK 1.5.2，按历史示例保留，不作为 V2.5.0 实测结果。中英文环境表对 Ubuntu20.04 的 Python 列写法不同（中文 3.8/3.9、英文 3.8/3.8，Debian11 也存在相同差异），ARM64 段的 Debian 表头仍写 x64，均保留来源并提醒按实际安装包核对。V2.5.0 已新增 C++ codegen 章节并细化量化与内存策略；未用旧版参数替换新版。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
