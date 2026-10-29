---
title: "RKNN Toolkit Lite2 V2.5.0（一）：安装、ResNet18 与返回约定"
description: "RKNN Toolkit Lite2 V2.5.0（一）：安装、ResNet18 与返回约定 · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0（一）：安装、ResNet18 与返回约定"
translation_key: "rknn-v250-lite-api-installation"
slug: "rknn-v250-lite-api-installation"
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

**RKNN Toolkit Lite2 V2.5.0（一）：安装、ResNet18 与返回约定**

[RKNN Toolkit Lite2 V2.5.0（二）：生命周期、输入布局与输出复用](/zh/articles/rknn-v250-lite-api-programming-model/)

[RKNN Toolkit Lite2 V2.5.0（三）：模型加载、加密与 Runtime 初始化](/zh/articles/rknn-v250-lite-api-loading-runtime/)

[RKNN Toolkit Lite2 V2.5.0（四）：推理、设备和版本查询 API](/zh/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0（五）：错误检查、Core Mask 与日志](/zh/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 1. API 参考说明

本手册用于说明 RKNN Toolkit Lite2 的 Python API。内容以 RKNNLite 对象为主体,重点整理环境要求、模型加载、Runtime 初始化、模型推理、SDK 版本查询和模型支持平台查询等接口。

RKNN Toolkit Lite2 主要用于 RKNN 模型在 Rockchip NPU 上的部署。模型转换由 RKNN Toolkit2 完成,本手册不展开模型转换流程。

### 1.1 适用版本和平台

本文档对应 RKNN Toolkit Lite2 V2.5.0。

当前支持范围如下:

| 项目 | 支持范围 |
| --- | --- |
| RKNN Toolkit Lite2 版本 | V2.5.0 |
| 硬件平台 | RK3562、RK3566系列、RK3568系列、RK3576系列、RK3588系列 |
| 操作系统 | Debian 10 / 11 / 12(aarch64) |
| Python | 3.8 / 3.9 / 3.10 / 3.11 / 3.12 |
| Python 库依赖 | numpy、ruamel.yaml、psutil |

### 1.2 安装与环境部署

RKNN Toolkit Lite2 支持通过 pip3 install 安装。

如果系统中没有安装 python3 、 pip3 等程序,可先安装基础依赖:

```text
sudo apt-get update
sudo apt-get install -y python3 python3-dev python3-pip gcc
```

部分依赖模块安装时需要编译源码,因此同时安装 python3-dev 和 gcc ,可避免后续依赖编译失败。

示例中还会使用 opencv-python 和 numpy :

```text
sudo apt-get install -y python3-opencv
sudo apt-get install -y python3-numpy
```

注:

1. RKNN Toolkit Lite2 本身并不依赖 opencv-python ,但示例需要使用该模块处理图像。

2. 在 Debian 10 固件上直接通过 pip3 安装 numpy 可能失败,建议使用上述系统包安装方式。

RKNN Toolkit Lite2 各平台安装包位于 SDK 的 packages 文件夹中。进入该目录后,根据 Python 版本安装对应 Wheel:

```text
# Python 3.8
pip3 install rknn_toolkit_lite2-2.x.0-cp38-cp38-linux_aarch64.whl

# Python 3.9
pip3 install rknn_toolkit_lite2-2.x.0-cp39-cp39-linux_aarch64.whl

# Python 3.10
pip3 install rknn_toolkit_lite2-2.x.0-cp310-cp310-linux_aarch64.whl

# Python 3.11
pip3 install rknn_toolkit_lite2-2.x.0-cp311-cp311-linux_aarch64.whl

# Python 3.12
pip3 install rknn_toolkit_lite2-2.x.0-cp312-cp312-linux_aarch64.whl
```

### 1.3 基本使用流程

在使用 RKNN Toolkit Lite2 之前,需要先通过 RKNN Toolkit2 将各深度学习框架导出的模型转换为 RKNN 模型。

RKNN Toolkit Lite2 的基本调用流程如下:

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

其中:

RKNNLite() :创建 RKNN Toolkit Lite2 Python 对象;

load_rknn() :加载 RKNN 模型;

init_runtime() :初始化 Runtime 运行环境;

inference() :对输入数据执行模型推理;

release() :使用结束后释放 RKNNLite 对象所占用的资源。

调用 inference() 前,需要准备输入数据并完成相应预处理,再根据实际输入信息设置 data_format 等参数。推理完成后,通常还需要对输出结果进行后处理,以完成上层应用功能。

### 1.4 示例程序

SDK 的 examples 目录提供 resnet18 示例。该示例加载 resnet18 模型并进行推理,输出测试图片的Top-5 分类结果。

运行步骤如下:

1. 准备一块已经安装 RKNN Toolkit Lite2 的开发板;

2. 将示例推送到开发板;

3. 进入 examples/resnet18 目录并运行:

```text
python3 test.py
```

参考运行结果:

```text
-----TOP 5-----
[812]: 0.999442994594574
[404]: 0.0004096269840374589
[657]: 3.284541890025139e-05
[833]: 2.6112385967280716e-05
[895]: 1.8509887013351545e-05
```

### 1.5 API 返回约定

根据 RKNNLite 当前 Python 实现,各主要 API 的返回形式如下:

| 接口 | 正常返回 | 失败或特殊返回 |
| --- | --- | --- |
| load_rknn() | 0 | -1 |
| list_devices() | (adb_devices, ntb_devices),两项均为<br>list | 未单独定义失败返回值 |
| init_runtime() | 0 | 参数、模型加载、Runtime 创建或初<br>始化失败时返回 -1 |
| inference() | list,成员为输出 ndarray;<br>get_frame_id=True 时会在返回列表末尾追加<br>Frame ID | Runtime 未初始化或设置输入、运<br>行、获取输出失败时返回 None |
| get_sdk_version() | SDK 版本信息字符串 | Runtime 未初始化或查询失败时返回<br>None |
| list_support_target_platform() | dict,由平台查询函数返回 | 指定的 RKNN 模型路径不存在时返回<br>None |
| release() | None | None |

对于返回状态码的接口,应显式检查返回值。例如:

```text
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_AUTO)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

对于 inference() 、 get_sdk_version() 和 list_support_target_platform() ,建议同时检查是否返回 None ,避免在前置条件不满足或内部执行失败时继续处理无效结果。

{% endraw %}
