---
title: "RV1103/RV1106 RKNN 入门（一）：部署链路、平台与仓库"
description: "RV1103/RV1106 RKNN 入门（一）：部署链路、平台与仓库 · RKNN2 V2.5.0"
excerpt: "RV1103/RV1106 RKNN 入门（一）：部署链路、平台与仓库"
translation_key: "rknn-v250-rv1106-deployment-flow"
slug: "rknn-v250-rv1106-deployment-flow"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RV1103", "RV1106", "Mini Runtime"]
---

平台参考：本系列对应 RKNN2 V2.5.0 的 RV1103/RV1103B/RV1106/RV1106B 入门资料，使用匹配的板级 SDK、RKNPU2 驱动及 librknnmrt.so。尚未确认对应 ArmSoM 板卡；原稿 Linux 5.10.160 日志和推理输出仅为示例，不是 ArmSoM 硬件验证。请按实际板卡 BSP 核对供电、接口及驱动。

来源：本地中英文 V2.5.0 PDF。中文正文与图片取自中文稿，英文、俄文和德文取自英文稿。保留全部技术章节、命令和表格；仅恢复 PDF 造成的换行与目录树缩进。示例旧驱动日志不代表推荐版本；原文推荐版本见正文。未锁定版本的下载和 pip 安装应与实际 SDK 配套核对。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RV1103/RV1106 RKNN 入门（一）：部署链路、平台与仓库**

[RV1103/RV1106 RKNN 入门（二）：硬件连接与设备检查](/zh/articles/rknn-v250-rv1106-hardware/)

[RV1103/RV1106 RKNN 入门（三）：主机环境与 Mini Runtime](/zh/articles/rknn-v250-rv1106-host-runtime/)

[RV1103/RV1106 RKNN 入门（四）：YOLOv5 转换、Python 和 C 部署](/zh/articles/rknn-v250-rv1106-yolov5/)

[RV1103/RV1106 RKNN 入门（五）：Docker、启动问题与后续文档](/zh/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 1. 开始之前

本指南以最短路径引导用戶完成 RV1103/RV1103B/RV1106/RV1106B 上 RKNN SDK 的首次运行,涵盖硬件连接、环境检查、模型转换、连板推理和 C/C++ 板端部署等必要步骤。

说明: 完整开发流程、模型转换与量化、环境安装及系统化故障排查,请参考《RKNN2_SDK_开发指南》;RKNN-Toolkit2 Python 接口请参考《RKNN2_Toolkit_Python_API_参考》;RKNN-Toolkit-Lite2Python 接口请参考《RKNN2_Toolkit_Lite_Python_API_参考》;板端 C API 及 RKNPU2 Mini Runtime( librknnmrt.so )相关接口请参考《RKNN2_Runtime_C_API_参考》。

### 1.1 本指南目标

完成本指南后,用戶应能够:

1. 确认开发主机与开发板连接正常;

2. 安装并验证 RKNN-Toolkit2 开发环境;

3. 检查或更新板端 RKNPU2 Mini Runtime( librknnmrt.so )和 rknn_server ;

4. 使用 RKNN Model Zoo 完成 YOLOv5 模型下载与 RKNN 模型转换;

5. 通过 RKNN Python Demo 完成一次连板推理;

6. 编译并在板端运行 RKNN C Demo,验证输出结果。

### 1.2 了解 RKNN SDK 部署链路

RV1103/RV1103B/RV1106/RV1106B 的首次运行主要涉及计算机端开发工具和开发板端运行环境。

| 组件 | 所在位置 | 作用 |
| --- | --- | --- |
| RKNN-Toolkit2 | 计算机端 | 将 ONNX 等原始模型转换为 RKNN 模型,并支持连板调<br>试 |
| RKNN Model Zoo | 计算机端 | 提供模型转换、Python Demo 和 C/C++ Demo 示例 |
| rknn_server | 开发板端 | 处理计算机通过 USB 发送的连板推理请求 |
| RKNPU2 Mini Runtime<br>(librknnmrt.so) | 开发板端 | 加载 RKNN 模型并调用 NPU 执行推理 |

RKNPU2 Mini Runtime 与 RKNPU2 Runtime 的区别如下:

| 对比项 | RKNPU2 Mini Runtime | RKNPU2 Runtime |
| --- | --- | --- |
| 运行库 | librknnmrt.so | librknnrt.so |
| 定位 | 面向 RV1103/RV1103B/RV1106/RV1106B 等资源受限平<br>台的裁剪版 Runtime | RKNPU2 标准 Runtime |
| 本文适用<br>性 | 适用,本文后续板端运行库均指 librknnmrt.so | 不适用于本文示例,不应使用<br>librknnrt.so 替换<br>librknnmrt.so |

注意: 本文后续统一使用 RKNPU2 Mini Runtime 表示板端 librknnmrt.so 。除本节用于说明两种Runtime 的区别外,不再使用“RKNPU2 Runtime”泛称板端运行库,以避免与 librknnrt.so 混淆。

首次运行的推荐路径为:

1. 连接开发板并确认 adb devices 可识别设备;

2. 安装 RKNN-Toolkit2 并完成导入检查;

3. 检查 RKNPU2 驱动、Mini Runtime 和 rknn_server ;

4. 下载 YOLOv5 示例模型并转换为 RKNN 格式;

5. 先运行 RKNN Python Demo 验证转换和连板链路;

6. 再编译、推送并运行 RKNN C Demo,完成板端部署验证。

### 1.3 支持平台和版本要求

本指南支持以下平台:

| 平台 | 说明 |
| --- | --- |
| RV1103 | 支持 |
| RV1103B | 支持 |
| RV1106 | 支持 |
| RV1106B | 支持 |

开发主机示例基于 Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04。RKNN-Toolkit2 环境推荐使用 Python

3.8。

注意: RV1103、RV1106 与 RV1103B、RV1106B 生成的 RKNN 模型不能共用。模型转换时应根据实际开发板选择正确的平台参数。

### 1.4 选择示例类型

本指南使用 RKNN Model Zoo 中的 YOLOv5 示例贯穿首次运行流程。

| 示例 | 用途 | Model Zoo 目录 |
| --- | --- | --- |
| YOLOv5 Python Demo | 模型转换与连板推理验证 | examples/yolov5/python |
| YOLOv5 C Demo | C/C++ 编译与板端部署验证 | examples/yolov5/cpp |

Python Demo 和 C Demo 共用同一份 YOLOv5 ONNX 模型及转换后的 RKNN 模型,因此只需要完成一次模型下载和转换。

### 1.5 获取 SDK 及配套仓库

建议创建专门目录存放 RKNN 相关仓库,例如创建名为 Projects 的文件夹,并将 RKNN-Toolkit2 和RKNN Model Zoo 存放在该目录下。

```text
# 新建 Projects 文件夹
mkdir Projects

# 进入该目录
cd Projects

# 下载 RKNN-Toolkit2 仓库
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# 下载 RKNN Model Zoo 仓库
git clone https://github.com/airockchip/rknn_model_zoo.git --depth 1
```

说明: --depth 1 表示只克隆最近一次 commit。如果 git clone 失败,也可以直接在 GitHub 中下载压缩包并解压到该目录。

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
