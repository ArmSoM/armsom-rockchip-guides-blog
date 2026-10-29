---
title: "RKNN Toolkit Lite2 V2.5.0（四）：推理、设备和版本查询 API"
description: "RKNN Toolkit Lite2 V2.5.0（四）：推理、设备和版本查询 API · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0（四）：推理、设备和版本查询 API"
translation_key: "rknn-v250-lite-api-inference-queries"
slug: "rknn-v250-lite-api-inference-queries"
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

[RKNN Toolkit Lite2 V2.5.0（二）：生命周期、输入布局与输出复用](/zh/articles/rknn-v250-lite-api-programming-model/)

[RKNN Toolkit Lite2 V2.5.0（三）：模型加载、加密与 Runtime 初始化](/zh/articles/rknn-v250-lite-api-loading-runtime/)

**RKNN Toolkit Lite2 V2.5.0（四）：推理、设备和版本查询 API**

[RKNN Toolkit Lite2 V2.5.0（五）：错误检查、Core Mask 与日志](/zh/articles/rknn-v250-lite-api-errors/)

{% raw %}

### 3.3 模型推理

inference

| API | inference |
| --- | --- |
| 功能 | 对指定输入执行模型推理,并返回输出结果。 |
| 参数 | inputs:输入数据,类型为 list,成员为 ndarray。 |
|  | data_type:输入数据类型,默认值为 None;接口说明列出的类型包括 int8、uint8、int16、<br>float16、float32。 |
|  | data_format:输入数据布局,默认值为 None;当前支持 "nhwc" 和 "nchw"。 |
|  | inputs_pass_through:各输入的 Pass Through 标志列表,元素使用 0 / 1 表示关闭 / 开启,默<br>认值为 None。 |
|  | get_frame_id:是否获取 Frame ID,默认值为 False;主要用于异步模式。 |
|  | reuse_outputs:是否复用内部输出缓冲,默认值为 False;为 True 时返回内部复用缓冲的视图,<br>适用于长时推理循环场景,但下次推理会覆盖返回结果。 |
| 返回值 | 正常返回输出 ndarray 列表;get_frame_id=True 时在列表末尾追加 Frame ID。Runtime 未初始<br>化或推理过程中发生异常时返回 None。 |

示例:

```text
outputs = rknn_lite.inference(inputs=[img])
if outputs is None:
    print('Inference failed')
else:
    show_top5(outputs)
```

长时推理循环中如需降低内存分配,可开启输出复用:

```text
for frame in frames:
    outputs = rknn_lite.inference(
        inputs=[frame],
        reuse_outputs=True
    )
    show_top5(outputs) # 用完即弃,结果在下次推理前消费完毕
```

参考输出:

```text
-----TOP 5-----
[812]: 0.999442994594574
[404]: 0.0004096269840374589
[657]: 3.284541890025139e-05
[833]: 2.6112385967280716e-05
[895]: 1.8509887013351545e-05
```

使用说明:

调用前必须先成功执行 init_runtime() ;否则返回 None 。

inputs 、 data_type 、 data_format 和 inputs_pass_through 会传递给 Runtime 的输入设置逻辑。

设置输入、执行模型或获取输出过程中发生异常时,接口返回 None 。

当 get_frame_id=False 时返回普通输出列表;当 get_frame_id=True 时,在输出列表末尾追加运行返回的 Frame ID。

reuse_outputs 默认为 False ,返回数组拥有独立内存,跨调用有效;仅在明确需要降低内存分配时开启 reuse_outputs=True ,此时返回的是内部复用缓冲视图,会被下次推理覆盖,需保留结果时应先拷⻉。

推理成功后,再根据模型类型执行相应后处理。

### 3.4 设备、版本和平台查询

list_devices

| API | list_devices |
| --- | --- |
| 功能 | 枚举当前可通过 ADB 和 NTB 访问的设备,并打印设备列表。 |
| 参数 | 无 |
| 返回值 | (adb_devices, ntb_devices):两个 list。同时出现在 NTB 列表中的设备会从 ADB 返回列表中<br>移除。 |

示例:

```text
adb_devices, ntb_devices = rknn_lite.list_devices()
```

get_sdk_version

| API | get_sdk_version |
| --- | --- |
| 功能 | 获取 SDK 版本信息。 |
| 参数 | 无 |
| 返回值 | 正常返回 sdk_version 字符串;Runtime 未初始化或查询失败时返回 None。 |

调用该接口前必须先成功完成 Runtime 初始化。 init_runtime() 又要求模型已加载,因此标准顺序为load_rknn() → init_runtime() → get_sdk_version() 。

示例:

```text
sdk_version = rknn_lite.get_sdk_version()
if sdk_version is None:
    print('Get SDK version failed')
```

参考返回信息:

```text
I RKNN: [10:47:23.097] RKNN Runtime Information:
librknnrt version: 1.2.0b1
(a47985372@2021-12-06T10:20:14)

I RKNN: [10:47:23.097] RKNN Driver Information:
version: 0.6.2

I RKNN: [10:47:23.098] RKNN Model Information:
version: 1,
toolkit version: 1.1.2
(compiler version: 1.1.2b13
(1e5726f57@2021-11-29T14:13:55)),
target: RKNPU v2,
target platform: rk3588,
framework name: PyTorch,
framework layout: NCHW
```

list_support_target_platform

| API | list_support_target_platform |
| --- | --- |
| 功能 | 查询给定 RKNN 模型可运行的芯片平台,或列出当前支持的平台。 |
| 参数 | rknn_model:RKNN 模型路径,默认值为 None。为 None 时直接调用平台查询函数列出当前支持的<br>平台。 |
| 返回值 | 正常返回 support_target,类型为 dict;显式指定的模型路径不存在时返回 None。 |

示例:

```text
support_target = rknn_lite.list_support_target_platform(
    rknn_model='mobilenet_v1.rknn'
)
if support_target is None:
    print('Query target platform failed')
```

参考结果:

```text
**************************************************
Target platforms filled in RKNN model: ['RK3588']
Target platforms supported by this RKNN model: ['RK3588']
**************************************************
```

使用说明:

rknn_model=None 时不会触发文件存在性检查,而是直接调用底层平台查询函数。

当显式指定的模型路径不存在时,接口记录错误并返回 None 。

{% endraw %}
