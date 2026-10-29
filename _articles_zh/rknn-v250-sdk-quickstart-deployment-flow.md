---
title: "RKNN2 V2.5.0 入门（一）：部署链路、平台与 SDK 仓库"
description: "RKNN2 V2.5.0 入门（一）：部署链路、平台与 SDK 仓库 · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0 入门（一）：部署链路、平台与 SDK 仓库"
translation_key: "rknn-v250-sdk-quickstart-deployment-flow"
slug: "rknn-v250-sdk-quickstart-deployment-flow"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

适用范围：本系列为 RKNN2 V2.5.0 平台参考，原稿覆盖 RK3562、RK3566/3568/3576/3588 系列及 RV1126B。ArmSoM 同 SoC 板卡仍需匹配的 BSP、NPU 驱动和 Runtime；不能直接照搬 Rockchip EVB 的电源、USB 接口或固件。主机与驱动要求见正文；未进行 ArmSoM 硬件验证。

依据本地中英文 V2.5.0 原稿整理，保留原章节编号。中文用中文原图，英文、俄文和德文用英文原图；恢复 PDF 换行、跨页表格与代码缩进。示例输出不是 ArmSoM 实测。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 V2.5.0 入门（一）：部署链路、平台与 SDK 仓库**

[RKNN2 V2.5.0 入门（二）：硬件连接与 ADB 检查](/zh/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0 入门（三）：Toolkit、Android/Linux Runtime 与编译器](/zh/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0 入门（四）：MobileNet 转换与部署](/zh/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0 入门（五）：YOLOv5 检测与精度评估](/zh/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0 入门（六）：Docker、启动问题与文档导航](/zh/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 1. 开始之前

本指南以最短路径引导用戶完成RKNN2 SDK的首次运行,涵盖硬件连接、环境准备、模型转换、连板调试和板端部署等最小必要步骤。模型转换原理、量化配置、完整API说明和系统化故障排查不在本指南范围内,请查阅对应文档。

说明: 完整的开发流程、Toolkit接口说明、精度/性能/内存分析等,请参考《RKNN2 SDK 开发指南》文档。硬件、操作系统和版本支持范围以SDK发布包中的说明为准,本指南仅列出首次运行所需的必要信息。

### 1.1 本指南目标

完成本指南后,用戶应能够:

1. 确认开发主机、开发板和RKNPU2运行环境可用;

2. 使用RKNN-Toolkit2完成一个ONNX模型的转换;

3. 通过连板调试方式在板端运行Python Demo;

4. 编译C Demo并在板端运行;

5. 根据文档导航进入完整开发、API参考或故障排查文档。

### 1.2 软件框架与主要组件

RKNN2 SDK的开发流程主要由PC端开发套件和开发板运行环境两部分组成:

PC端开发套件: 用戶可通过RKNN-Toolkit2将ONNX、PyTorch、TensorFlow等深度学习框架训练的模型转换为RKNN格式,并通过连板调试的方式在开发板上验证模型。RKNN Model Zoo提供模型转换与部署示例。

开发板运行环境: 模型转换完成后,可在开发板上使用RKNPU2 Runtime加载和运行RKNN模型。

主要组件如下:

| 组件 | 运行位置 | 作用 |
| --- | --- | --- |
| RKNN-Toolkit2 | PC端 | 模型转换、量化、连板调试等核心功能的Python工具包 |
| RKNN Server<br>(rknn_server) | 板端 | 后台代理服务,用于接收PC传输的命令和数据,调用板端Runtime对应<br>的接口执行,并将结果返回给PC |
| RKNPU2 Runtime<br>(librknnrt.so) | 板端 | 负责加载RKNN模型,并通过NPU执行RKNN模型的推理操作 |
| RKNN Model Zoo | PC端/板<br>端 | 提供 YOLOv5、YOLOv8、MobileNet 等常用模型的转换脚本和<br>Python/C++ 示例代码 |

### 1.3 选择示例类型

本指南使用以下两个示例贯穿首次运行流程:

| 示例 | 用途 | Model Zoo目录 |
| --- | --- | --- |
| MobileNet | 图像分类示例 | examples/mobilenet |
| YOLOv5 | 目标检测示例 | examples/yolov5 |

每个模型示例提供Python和C/C++两个版本的示例代码。为方便描述,后续分别使用RKNN Python Demo和RKNN C Demo表示。不同的Demo用法存在差异,请按照各自目录下README.md中的步骤运行。

### 1.4 支持平台和版本要求

支持的平台如下:

| 类别 | 说明 |
| --- | --- |
| 硬件平台 | RK3562、RK3566系列、RK3568系列、RK3576系列、RK3588系列、RV1126B |
| 开发主机 | Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04 |
| Python版本 | 3.8(推荐版本) |
| RKNPU2驱动版本 | 建议 >= 0.9.8 |

注意: 要保证rknn_server、Runtime库(librknnrt.so)与RKNN-Toolkit2三者的版本一致,建议都安装最新的版本。若使用动态维度输入的RKNN模型,则要求rknn_server和Runtime库版本 >= 1.5.0。

### 1.5 获取SDK及配套仓库

建议新建一个目录用来存放RKNN仓库,例如新建一个名称为Projects的文件夹,并将RKNN-Toolkit2和RKNNModel Zoo仓库存放至该目录下,参考命令如下:

```text
# 新建 Projects 文件夹
mkdir Projects

# 进入该目录
cd Projects

# 下载 RKNN-Toolkit2 仓库
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# 下载 RKNN Model Zoo 仓库
git clone https://github.com/airockchip/rknn_model_zoo.git --depth 1

# 注意:
# 1.参数 --depth 1 表示只克隆最近一次 commit
# 2.如果遇到 git clone 失败的情况,也可以直接在 github 中下载压缩包到本地,然后解压至该目录
```

后续示例默认目录结构如下:

```text
Projects
├── rknn-toolkit2
│   ├── doc
│   ├── rknn-toolkit2
│   │   ├── packages
│   │   ├── docker
│   │   └── ...
│   ├── rknpu2
│   │   ├── runtime
│   │   └── ...
│   └── ...
└── rknn_model_zoo
    ├── datasets
    ├── examples
    └── ...
```

{% endraw %}
