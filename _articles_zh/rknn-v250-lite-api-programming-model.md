---
title: "RKNN Toolkit Lite2 V2.5.0（二）：生命周期、输入布局与输出复用"
description: "RKNN Toolkit Lite2 V2.5.0（二）：生命周期、输入布局与输出复用 · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0（二）：生命周期、输入布局与输出复用"
translation_key: "rknn-v250-lite-api-programming-model"
slug: "rknn-v250-lite-api-programming-model"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

平台参考：对应 RKNN Toolkit Lite2 V2.5.0、Debian 10/11/12 aarch64 及原稿列出的 SoC。用于 ArmSoM 板卡时，须确认 SoC、系统架构、Python wheel、BSP 中 NPU 驱动和 Runtime 兼容；未进行硬件实测。原稿加密章节的平台范围比 Lite2 安装支持表更广，保留两处原文，不据此扩展 Lite2 板端支持范围。

依据本地中英文 V2.5.0 原稿整理，保留原章节编号。中文用中文原图，英文、俄文和德文用英文原图；恢复 PDF 换行、跨页表格与代码缩进。示例输出不是 ArmSoM 实测。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN Toolkit Lite2 V2.5.0（一）：安装、ResNet18 与返回约定](/zh/articles/rknn-v250-lite-api-installation/)

**RKNN Toolkit Lite2 V2.5.0（二）：生命周期、输入布局与输出复用**

[RKNN Toolkit Lite2 V2.5.0（三）：模型加载、加密与 Runtime 初始化](/zh/articles/rknn-v250-lite-api-loading-runtime/)

[RKNN Toolkit Lite2 V2.5.0（四）：推理、设备和版本查询 API](/zh/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0（五）：错误检查、Core Mask 与日志](/zh/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 2. RKNNLite 编程模型

RKNNLite 是 RKNN Toolkit Lite2 的 Python 主入口。应用通过该对象完成 RKNN 模型加载、Runtime 初始化、模型推理、版本信息查询以及资源释放。

RKNN Toolkit Lite2 面向设备侧模型部署。使用前,需要先通过 RKNN Toolkit2 将各深度学习框架导出的模型转换为 RKNN 模型;设备侧应用再按照 RKNNLite() → load_rknn() → init_runtime() →inference() → release() 的顺序完成模型运行。

理解模型、Runtime、输入数据和 NPU Core 配置之间的关系,有助于正确使用第 3 章中的接口。

### 2.1 对象生命周期

RKNN Toolkit Lite2 的基本使用流程如下:

```text
创建 RKNNLite 对象
    ↓
load_rknn()
    ↓
init_runtime()
    ↓
准备输入数据并完成预处理
    ↓
inference()
    ↓
处理推理结果
    ↓
release()
```

其中:

RKNNLite() :创建 RKNNLite 对象,可通过 verbose 和 verbose_file 配置详细日志;

load_rknn() :加载指定路径的 RKNN 模型;

init_runtime() :初始化模型运行所需的 Runtime 环境;

inference() :对准备好的输入数据执行推理,并返回输出结果;

release() :RKNNLite 对象使用完成后释放相关资源。

init_runtime() 会检查模型是否已通过 load_rknn() 加载; inference() 会检查 Runtime 是否已初始化。因此,正常调用顺序应为 load_rknn() → init_runtime() → inference() 。

推荐按照以下方式组织应用代码:

```text
rknn_lite = RKNNLite(verbose=True)

ret = rknn_lite.load_rknn('./model.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)

outputs = rknn_lite.inference(inputs=[input_data])

# 根据模型类型处理 outputs
# ...

rknn_lite.release()
```

对于输入数据,调用 inference() 前需要完成相应预处理,并根据输入维度和实际数据排列方式设置data_format 。推理完成后,通常还需要对输出结果进行后处理,以完成上层应用功能。

### 2.2 模型、Runtime 和推理的关系

在 RKNN Toolkit Lite2 中,可以将模型部署过程理解为以下层次:

模型转换阶段:使用 RKNN Toolkit2 将深度学习框架模型转换为 RKNN 模型;

模型加载阶段:通过 load_rknn() 将 RKNN 模型 加载到 RKNNLite 对象;

运行时初始化阶段:通过 init_runtime() 初始化 Runtime 环境;

推理执行阶段:通过 inference() 获取 推理结果。

RKNN Toolkit2 和 RKNN Toolkit Lite2 分别承担不同阶段的工作:

| 阶段 | 工具 / 接口 | 作用 |
| --- | --- | --- |
| 模型转换 | RKNN Toolkit2 | 将深度学习框架导出的模型转换为 RKNN 模型 |
| 模型加载 | load_rknn() | 加载设备侧要运行的 RKNN 模型 |
| Runtime 初始化 | init_runtime() | 初始化运行时环境 |
| 模型执行 | inference() | 对输入数据执行推理并返回结果 |
| 资源释放 | release() | 使用完成后释放 RKNNLite 对象资源 |

除推理接口外,RKNN Toolkit Lite2 还提供版本和平台查询接口:

```text
load_rknn()
    ↓
init_runtime()
    ↓
get_sdk_version()
```

get_sdk_version() 只有在 Runtime 已成功初始化后才能调用;Runtime 未初始化时接口返回 None 。由于 init_runtime() 本身要求模型已加载,因此正常流程仍是先 load_rknn() ,再init_runtime() ,最后调用 get_sdk_version() 。

list_support_target_platform() 用于查询给定 RKNN 模型可运行的芯片平台。该接口通过rknn_model 参数接收 RKNN 模型路径;如果不指定模型路径,则按类别打印 RKNN Toolkit Lite2 当前支持的芯片平台。

### 2.3 输入数据、数据布局和输出

inference() 的当前接口签名为:

```text
inference(
    inputs,
    data_type=None,
    data_format=None,
    inputs_pass_through=None,
    get_frame_id=False,
    reuse_outputs=False
)
```

其中 inputs 为输入数据列表,其他参数用于补充输入类型、数据布局、Pass Through 配置、异步模式下的Frame ID 获取行为以及输出内存复用配置。

#### 2.3.1 inputs

inputs 用于传入模型输入数据,类型为 list ,列表成员为 ndarray 。典型调用方式如下:

```text
outputs = rknn_lite.inference(inputs=[img])
```

多输入模型同样通过列表传入:

```text
outputs = rknn_lite.inference(
    inputs=[input0, input1]
)
```

应用应在调用推理接口前完成各输入所需的预处理。

#### 2.3.2 data_type 和 data_format

data_type 用于指定输入数据类型。当前接口说明中列出的类型包括: int8 、 uint8 、 int16 、float16 和 float32 ;默认参数值为 None 。

data_format 用于指定输入数据布局,当前支持 "nhwc" 和 "nchw" ;默认参数值为 None 。该参数会原样传递给 Runtime 的输入设置逻辑,应用应保证其取值与实际输入 Buffer 的排列方式一致。

#### 2.3.3 inputs_pass_through

inputs_pass_through 用于为各输入设置 Pass Through 标志。接口说明中约定使用 0 / 1 表示关闭 /开启,并以列表形式对应各输入;默认值为 None 。

#### 2.3.4 get_frame_id

get_frame_id 默认为 False 。为 False 时,接口直接返回输出 ndarray 列表;为 True 时,接口会在输出列表末尾追加 Runtime 返回的 Frame ID,主要用于异步模式下需要关联输入/输出帧的场景。

#### 2.3.5 reuse_outputs

reuse_outputs 用于控制输出数组的内存复用方式,默认值为 False ,该参数为可选优化项,不会改变默认行为。

为 False (默认)时, inference() 返回的输出 ndarray 各自拥有独立内存,跨多次调用保持有效,符合历史 API 契约,应用可安全持有返回结果。

为 True 时,接口直接返回内部可复用缓冲(staging buffer)的视图,每次调用不再产生大块内存分配,适用于对内存分配敏感、且输出在下次推理前已被消费完毕的长时推理循环场景。注意:此时返回的数组在下次调用 inference() 或 get_outputs() 时会被覆盖,如需保留结果,应在下次调用前拷⻉(如np.array(output) )。

#### 2.3.6 推理输出与失败返回

正常情况下, inference() 返回输出 ndarray 列表:

```text
输入 ndarray 列表
        ↓
    inference()
        ↓
输出 ndarray 列表
        ↓
    业务后处理
```

如果 Runtime 尚未初始化,或设置输入、执行模型、获取输出任一步骤发生异常,接口返回 None 。因此业务代码建议先检查返回值,再进入后处理逻辑。

### 2.4 NPU Core 配置

init_runtime() 通过 core_mask 参数配置 NPU Core 工作模式,默认值为RKNNLite.NPU_CORE_AUTO 。

RKNNLite 当前定义的 Core Mask 常量如下:

| core_mask | 值 | 说明 |
| --- | --- | --- |
| RKNNLite.NPU_CORE_AUTO | 0 | 自动模式,默认值。 |
| RKNNLite.NPU_CORE_0 | 1 | Core 0 模式。 |
| RKNNLite.NPU_CORE_1 | 2 | Core 1 模式。 |
| RKNNLite.NPU_CORE_2 | 4 | Core 2 模式。 |
| RKNNLite.NPU_CORE_0_1 | 3 | Core 0/1 组合模式。 |
| RKNNLite.NPU_CORE_0_1_2 | 7 | Core 0/1/2 组合模式;当前接口说明标注为仅 RK3588 支持。 |
| RKNNLite.NPU_CORE_ALL | 0xffff | 所有 NPU Core。 |

源码在设置 Core Mask 的位置标注该参数只对 RK3576 / RK3588 有效。不同芯片实际支持的 Core 组合可能不同,应以对应 Runtime 的校验结果为准;如果不需要手动指定 Core,使用默认的RKNNLite.NPU_CORE_AUTO 。

典型初始化方式如下:

```text
ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

### 2.5 查询接口和资源释放

RKNN Toolkit Lite2 除模型推理外,还提供设备枚举、SDK 版本查询和模型支持平台查询接口。不同接口的调用条件不同。

SDK 版本查询

get_sdk_version() 用于获取以下信息:

Runtime 版本;

驱动版本;

RKNN 模型版本信息。

其调用关系为:

```text
load_rknn()
    ↓
init_runtime()
    ↓
get_sdk_version()
```

示例:

```text
sdk_version = rknn_lite.get_sdk_version()
```

使用该接口前必须先成功完成 Runtime 初始化;否则接口返回 None 。

模型支持平台查询

list_support_target_platform() 用于查询给定 RKNN 模型可运行的芯片平台:

```text
rknn_lite.list_support_target_platform(
    rknn_model='mobilenet_v1.rknn'
)
```

如果 rknn_model=None ,接口将参数直接交给平台查询函数,由其列出当前支持的平台;如果显式指定的模型路径不存在(包括空字符串路径),接口返回 None 。

资源释放

RKNNLite 对象使用完成后,应调用:

```text
rknn_lite.release()
```

从完整部署流程看,资源释放位于模型推理和相关查询操作之后:

```text
RKNNLite()
    ↓
load_rknn()
    ↓
init_runtime()
    ↓
inference() / get_sdk_version()
    ↓
release()
```

release() 是 RKNNLite 对象生命周期的结束步骤。完成该对象上的模型运行操作后,应及时释放相关资源。

{% endraw %}
