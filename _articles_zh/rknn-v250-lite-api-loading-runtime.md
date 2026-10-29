---
title: "RKNN Toolkit Lite2 V2.5.0（三）：模型加载、加密与 Runtime 初始化"
description: "RKNN Toolkit Lite2 V2.5.0（三）：模型加载、加密与 Runtime 初始化 · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0（三）：模型加载、加密与 Runtime 初始化"
translation_key: "rknn-v250-lite-api-loading-runtime"
slug: "rknn-v250-lite-api-loading-runtime"
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

**RKNN Toolkit Lite2 V2.5.0（三）：模型加载、加密与 Runtime 初始化**

[RKNN Toolkit Lite2 V2.5.0（四）：推理、设备和版本查询 API](/zh/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0（五）：错误检查、Core Mask 与日志](/zh/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 3. RKNNLite 类

RKNNLite 是 RKNN Toolkit Lite2 的主要 Python 类,提供对象初始化、RKNN 模型加载、设备枚举、Runtime 初始化、模型推理、SDK 版本查询、模型支持平台查询和资源释放等功能。

### 3.1 对象初始化和释放

init

| API | RKNNLite(...) |
| --- | --- |
| 功能 | 初始化 RKNNLite 对象。可通过参数控制详细日志的屏幕输出和文件输出。 |
| 参数 | verbose:指定是否在屏幕打印详细日志信息。 |
|  | verbose_file:指定日志文件路径;当设置该参数且 verbose=True 时,日志同时写入指定文件。 |
| 返回值 | RKNNLite 对象。 |

示例:

```text
# 将详细日志输出到屏幕,并写入 inference.log
rknn_lite = RKNNLite(
    verbose=True,
    verbose_file='./inference.log'
)

# 只在屏幕打印详细日志
rknn_lite = RKNNLite(verbose=True)
```

release

| API | release |
| --- | --- |
| 功能 | 使用完成后释放 RKNNLite 对象占用的资源。 |
| 参数 | 无 |
| 返回值 | None。 |

示例:

```text
rknn_lite.release()
```

使用说明:

在 RKNNLite 对象使用结束后调用 release() 。

应保证模型推理和相关查询操作完成后再释放对象。

### 3.2 模型加载与 Runtime 初始化

load_rknn

| API | load_rknn |
| --- | --- |
| 功能 | 加载 RKNN 模型。 |
| 参数 | path:RKNN 模型文件路径。 |
|  | key_path:(可选)加密模型的密钥信封文件路径。加载 RKCE 加密模型时必须传入,明文模型可省略。 |
| 返回值 | 成功:0;失败:-1。 |

示例(明文模型):

```text
# 从当前目录加载 resnet_18.rknn 模型
ret = rknn_lite.load_rknn('./resnet_18.rknn')
```

示例(加密模型):

```text
# 加载加密模型及其密钥信封
ret = rknn_lite.load_rknn(
    './encrypted_model.rknn',
    key_path='./encrypted_model_key.bin'
)
```

使用说明:

load_rknn() 应在 init_runtime() 前调用。

模型文件应为已通过 RKNN Toolkit2 转换得到的 RKNN 模型。

加密模型说明:

RKNN Toolkit Lite2 支持加载加密后的 RKNN 模型。加密模型采用混合加密方案(AES-256-CTR + RSA-OAEP):模型文件头部写入 RKCE 标识,模型主体使用 AES-CTR 加密;AES 密钥通过 RSA-OAEP 封装为密钥信封(RKKE 格式),与加密模型一起部署到设备端。

加载加密模型时,通过 key_path 参数传入密钥信封文件,运行时在 rknn_init() 内部自动检测 RKCE标识并透明完成解密。解密完成后,后续推理流程与明文模型完全一致。

加密模型在 PC/服务器端使用 RKNN Toolkit2 提供的加密工具生成(需要 RK 公钥rk_public_key.pem ),加密后得到两个配套文件:

| 文件 | 说明 |
| --- | --- |
| xxx.rknn | 加密后的 RKNN 模型(RKCE 标识 + AES-CTR 加密主体) |
| xxx_key.bin | RSA-OAEP 加密的密钥信封(与加密模型配套部署) |

加密模型支持的平台包括 RK3562、RK3566系列、RK3568系列、RK3576系列、RK3588系列、RV1126B、RV1103B系列、RV1106B系列。

注意事项:

加密模型与密钥信封必须配套使用,两者缺一不可。

密钥信封包含模型解密所需的密钥材料,应妥善保管,避免泄露。

加密方案及加密工具的更多细节,请参考《RKNN2_SDK_开发指南》中的“模型加密”相关章节。

init_runtime

| API | init_runtime |
| --- | --- |
| 功能 | 初始化运行时环境。模型推理前必须调用该接口。 |
| 参数 | target:目标平台,默认值为 None。在 aarch64 设备端使用本机 NPU 时通常保持为 None。 |
|  | device_id:设备 ID,默认值为 None。仅在当前运行环境明确支持设备选择时使用。 |
|  | async_mode:是否启用异步模式,默认值为 False。 |
|  | core_mask:NPU Core 工作模式,默认值为 RKNNLite.NPU_CORE_AUTO。 |
| 返回值 | 成功返回 0;前置条件不满足或 Runtime 初始化失败时返回 -1。 |

core_mask 可使用 RKNNLite 类中定义的以下常量:

| core_mask | 值 | 说明 |
| --- | --- | --- |
| RKNNLite.NPU_CORE_AUTO | 0 | 自动模式,默认值。 |
| RKNNLite.NPU_CORE_0 | 1 | Core 0 模式。 |
| RKNNLite.NPU_CORE_1 | 2 | Core 1 模式。 |
| RKNNLite.NPU_CORE_2 | 4 | Core 2 模式。 |
| RKNNLite.NPU_CORE_0_1 | 3 | Core 0/1 组合模式。 |
| RKNNLite.NPU_CORE_0_1_2 | 7 | Core 0/1/2 组合模式;当前接口说明标注为仅 RK3588 支持。 |
| RKNNLite.NPU_CORE_ALL | 0xffff | 所有 NPU Core。 |

源码在 Core Mask 设置逻辑处标注 core_mask 只对 RK3576 / RK3588 有效。

示例:

```text
ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

使用说明:

必须先调用 load_rknn() 加载模型;未加载模型时接口直接返回 -1 。

如果对象上已经存在 Runtime,重新初始化前会先释放旧 Runtime。

Runtime 创建、模型图构建、Core Mask 设置或版本检查过程中发生异常时,接口返回 -1 。

init_runtime() 成功后才能调用 inference() ; get_sdk_version() 同样要求 Runtime 已初始化。

{% endraw %}
