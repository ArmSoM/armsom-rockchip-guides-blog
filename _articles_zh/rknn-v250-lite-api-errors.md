---
title: "RKNN Toolkit Lite2 V2.5.0（五）：错误检查、Core Mask 与日志"
description: "RKNN Toolkit Lite2 V2.5.0（五）：错误检查、Core Mask 与日志 · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0（五）：错误检查、Core Mask 与日志"
translation_key: "rknn-v250-lite-api-errors"
slug: "rknn-v250-lite-api-errors"
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

[RKNN Toolkit Lite2 V2.5.0（四）：推理、设备和版本查询 API](/zh/articles/rknn-v250-lite-api-inference-queries/)

**RKNN Toolkit Lite2 V2.5.0（五）：错误检查、Core Mask 与日志**

{% raw %}

## 4. 异常与错误处理

RKNN Toolkit Lite2 Python 接口主要通过状态码、 None 返回值和运行日志反映执行状态。状态型接口应显式检查返回值,推理和查询类接口应在使用结果前检查是否为 None 。

### 4.1 模型加载和 Runtime 初始化错误

load_rknn() 和 init_runtime() 的返回值约定为:

成功: 0

失败: -1

推荐在每一步初始化后立即检查:

```text
ret = rknn_lite.load_rknn('./resnet_18.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

只有模型加载和 Runtime 初始化成功后,才应继续调用 inference() 或 get_sdk_version() 。

### 4.2 推理输入与返回值检查

调用 inference() 前应重点确认:

已成功调用 init_runtime() ;

inputs 为列表,成员为模型需要的 ndarray ;

如使用 data_type 、 data_format 或 inputs_pass_through ,其取值与实际输入保持一致;

异步模式下如需关联帧信息,可设置 get_frame_id=True ;

如开启 reuse_outputs=True ,返回数组为内部复用缓冲视图,使用后不跨调用持有,需要保留结果时先拷⻉。

inference() 在以下情况下返回 None :Runtime 未初始化、设置输入失败、模型运行失败或获取输出失败。因此建议统一进行空值检查:

```text
outputs = rknn_lite.inference(inputs=[input_data])
if outputs is None:
    print('Inference failed')
    exit(-1)
```

### 4.3 NPU Core 配置检查

源码在 Core Mask 设置逻辑处标注 core_mask 只对 RK3576 / RK3588 有效;同时,RKNNLite.NPU_CORE_0_1_2 在接口说明中标注为仅 RK3588 支持。

如果不需要手动指定 Core,建议使用默认的 RKNNLite.NPU_CORE_AUTO 。对于特定芯片和 Core 组合,应以 Runtime 的实际校验结果为准;Core Mask 设置失败时, init_runtime() 返回 -1 。

### 4.4 日志输出

初始化 RKNNLite 时可使用 verbose 和 verbose_file 输出详细日志:

```text
rknn_lite = RKNNLite(
    verbose=True,
    verbose_file='./inference.log'
)
```

当 verbose=True 时,详细日志会打印到屏幕;如果同时设置 verbose_file ,日志还会写入指定文件。

出现模型加载、Runtime 初始化或推理问题时,可结合接口返回值和详细日志定位问题。

## 5. 附录

### 5.1 参考文档

《RKNN2_SDK_开发指南》:RKNN2 软件栈、模型转换与量化、部署流程及故障排查。

《RKNN2_Toolkit_Python_API_参考》:RKNN-Toolkit2 Python API 方法、参数及返回值说明。

RKNN Toolkit2 相关文档:

https://github.com/airockchip/rknn-toolkit2/tree/master/doc

RKNN Toolkit2 项目:

https://github.com/airockchip/rknn-toolkit2

{% endraw %}
