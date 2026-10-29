---
title: "RKNN2 SDK V2.5.0 · Toolkit Lite2 Python 部署"
description: "RKNN2 SDK V2.5.0 · Toolkit Lite2 Python 部署 · 完整开发指南系列"
excerpt: "Toolkit Lite2 Python 部署"
translation_key: "rknn-v250-sdk-guide-lite-deployment"
slug: "rknn-v250-sdk-guide-lite-deployment"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

平台参考：本文来自 Rockchip RKNN2 SDK V2.5.0 开发指南，涵盖源文明确列出的 SoC、Linux/Android Runtime 和对应 Toolkit。具体功能仅适用于各节列出的芯片、SDK、驱动和内核条件，不能据此推定所有 ArmSoM 板卡支持。部署前需核对实际 ArmSoM 板卡的 BSP、NPU 驱动、Runtime 与模型版本。本篇未进行 ArmSoM 硬件验证；日志、性能数字和示例均来自原稿。

来源与校对：中文遵循中文 V2.5.0（182 页），英文、俄文和德文遵循英文 V2.5.0（208 页）；保留各稿技术信息，不将旧版内容补充为新版事实。中文配图取自中文 PDF，英俄德配图取自英文 PDF，含独立提取的矢量流程图。保留原章节和公式编号。原稿部分交叉引用仍指向旧章号，动态 Shape 容量示例写作“1224+140=264”等、TP_NORM 支持说明有矛盾、init()/rknn.val_perf() 等名称与后文 API 不一致；原始信息保留，执行前以实际 V2.5.0 SDK 头文件及 API 手册核对。各部分均保留代码和参数，提取造成的跨页换行与表格续行已整理。

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 10/22**

[1. 软件栈与核心概念](/zh/articles/rknn-v250-sdk-guide-overview/)

[2. 开发环境、版本与连板准备](/zh/articles/rknn-v250-sdk-guide-environment/)

[3. 开发流程与接口选择](/zh/articles/rknn-v250-sdk-guide-workflow/)

[4. 模型转换与 ONNX 编辑](/zh/articles/rknn-v250-sdk-guide-conversion/)

[5. 量化、混合量化与 QAT](/zh/articles/rknn-v250-sdk-guide-quantization/)

[6. 推理、精度、性能与内存评估](/zh/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime 生命周期、布局与内存](/zh/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. 零拷贝接口与输入输出约束](/zh/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C API 部署与代码生成](/zh/articles/rknn-v250-sdk-guide-c-deployment/)

**Toolkit Lite2 Python 部署**

[11. Matmul API 与矩阵布局](/zh/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU 多核配置与性能](/zh/articles/rknn-v250-sdk-guide-multicore/)

[13. 动态 Shape 模型与部署](/zh/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. 多 Batch 推理](/zh/articles/rknn-v250-sdk-guide-multi-batch/)

[15. RK3588/RK3576 NPU SRAM](/zh/articles/rknn-v250-sdk-guide-sram/)

[16. 缓存一致性与稀疏化推理](/zh/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. 自定义算子：Python 与 C API](/zh/articles/rknn-v250-sdk-guide-custom-operators/)

[18. 模型加密部署](/zh/articles/rknn-v250-sdk-guide-encryption/)

[19. 精度问题诊断](/zh/articles/rknn-v250-sdk-guide-accuracy/)

[20. 性能分析与网络优化](/zh/articles/rknn-v250-sdk-guide-performance/)

[21. 内存分析、共享与复用](/zh/articles/rknn-v250-sdk-guide-memory/)

[22. 常见问题、错误处理与参考资源](/zh/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

## 3.3 Toolkit Lite Python部署

RKNN-Toolkit Lite2 为 Rockchip NPU 平台提供板端 Python 编程接口,主要用于在设备端加载和运行RKNN 模型,适合使用 Python 进行模型验证、算法调试和 AI 应用开发。

在使用 RKNN-Toolkit Lite2 前,需要先通过 RKNN-Toolkit2 将各深度学习框架导出的模型转换为 RKNN 模型。模型转换方法请参考 2.1 通用模型转换。RKNN-Toolkit Lite2 的接口定义、参数说明和返回值等详细内容,请参考《04_RKNN2_Toolkit_Lite_Python_API_参考_V2.5.0》文档。

### 3.3.1 运行环境与安装

RKNN-Toolkit Lite2 运行在开发板端,支持的硬件平台、操作系统、Python 版本及依赖库与对应版本的RKNN-Toolkit Lite2 发布包相关,具体支持范围以《04_RKNN2_Toolkit_Lite_Python_API_参考_V2.5.0》中的“适用版本和平台”章节为准。

RKNN-Toolkit Lite2 通过 Python Wheel 包安装。SDK 中提供对应平台和 Python 版本的安装包,位于rknn-toolkit-lite2/packages 目录下,可根据开发板 Python 版本选择对应的 Wheel,并使用 pip3install 完成安装。例如:

```text
pip3 install rknn_toolkit_lite2-x.y.z-cpxx-cpxx-linux_aarch64.whl
```

安装前需确保开发板已具备 Python、pip 以及相关依赖环境。完整安装步骤和依赖说明请参考《04_RKNN2_Toolkit_Lite_Python_API_参考_V2.5.0》中的“安装与环境部署”章节。

### 3.3.2 基本部署流程

RKNN-Toolkit Lite2 以 RKNNLite 对象作为 Python API 的主要入口。典型的板端部署流程如下:

```text
创建 RKNNLite 对象
      ↓
  load_rknn()
      ↓
 init_runtime()
      ↓
准备输入并完成预处理
      ↓
  inference()
      ↓
  处理推理结果
      ↓
  release()
```

对应的主要接口包括:

RKNNLite() :创建 RKNN-Toolkit Lite2 对象;

load_rknn() :加载 RKNN 模型;

init_runtime() :初始化 Runtime 运行环境;

inference() :输入数据并执行模型推理;

release() :释放 RKNNLite 对象及相关资源。

调用 inference() 前,应用需要根据模型输入要求完成数据读取和预处理;推理完成后,再根据模型类型完成分类、检测等后处理。

### 3.3.3 主要功能接口

除基本模型部署流程外,RKNN-Toolkit Lite2 还提供运行信息和模型平台查询等接口。常用接口如下:

| 接口 | 功能 |
| --- | --- |
| RKNNLite() | 创建 RKNNLite 对象,并可配置运行日志 |
| load_rknn() | 加载 RKNN 模型 |
| init_runtime() | 初始化模型运行所需的 Runtime 环境 |
| inference() | 执行模型推理并返回结果 |
| get_sdk_version() | 查询 Runtime、驱动及模型相关版本信息 |
| list_support_target_platform() | 查询 RKNN 模型支持的目标芯片平台 |
| release() | 释放运行资源 |

其中, init_runtime() 可根据支持的平台配置 NPU Core 工作模式; inference() 支持以 ndarray列表形式传入模型输入,并可根据输入情况指定数据排列方式。具体参数取值、使用限制及返回值约定请参考《04_RKNN2_Toolkit_Lite_Python_API_参考_V2.5.0》中的接口说明。

### 3.3.4 参考示例

下面给出 RKNN-Toolkit Lite2 的基本推理示例,展示从创建 RKNNLite 对象、加载 RKNN 模型、初始化Runtime、执行推理到释放资源的完整调用流程。示例中的 input_data 表示已经按照模型要求完成预处理的输入数据。

```text
rknn_lite = RKNNLite(verbose=True)

# 1. 加载 RKNN 模型
ret = rknn_lite.load_rknn('./model.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

# 2. 初始化 Runtime
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_AUTO)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)

# 3. 执行推理
outputs = rknn_lite.inference(inputs=[input_data])

# 4. 根据模型类型对 outputs 进行后处理
# ...

# 5. 释放资源
rknn_lite.release()
```

SDK 的 examples/inference_with_lite 目录还提供了基于 ResNet18 的完整图像分类示例。将示例、RKNN 模型和测试数据部署到已安装 RKNN-Toolkit Lite2 的开发板后,可进入示例目录运行:

```text
cd examples/inference_with_lite
python3 test.py
```

该示例包含输入预处理、模型推理和 Top-5 分类结果处理,可作为实际应用开发的参考。关于 RKNNLite 、load_rknn() 、 init_runtime() 、 inference() 、 release() 等接口的参数、返回值及使用限制,请参考《04_RKNN2_Toolkit_Lite_Python_API_参考_V2.5.0》。

{% endraw %}
