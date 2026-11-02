---
title: "用 RK3588S 做边缘 AI 与多媒体设备：CM7S、Sige7S 应用规划"
description: "从视觉分析、交互显示到专用设备，规划 RK3588S 的硬件加速链路、模型部署与验收。"
excerpt: "从视觉分析、交互显示到专用设备，规划 RK3588S 的硬件加速链路、模型部署与验收。"
translation_key: "rk3588s-edge-ai-multimedia"
slug: "rk3588s-edge-ai-multimedia"
lang: "zh"
date: "2026-11-01"
author: "ArmSoM"
category: "ai"
products: ["CM7S", "Sige7S"]
tags: ["RK3588S", "CM7S", "Sige7S", "ArmSoM", "Rockchip"]
image: "/assets/rk3588s/block-diagram.png"
---

把 RK3588S 用好，关键是把任务分配给适合的硬件单元，并减少不必要的数据复制。CM7S 和 Sige7S 可以作为这类方案的硬件起点；下面的场景是开发规划，不代表已经完成的 ArmSoM 客户案例或实测成绩。

## 场景一：本地视觉分析终端

一条典型链路是“相机或视频流 → 解码/采集 → 缩放与格式转换 → NPU 推理 → 后处理 → 显示或上传结果”。CPU 负责业务逻辑，硬件编解码器处理兼容的视频，RGA 可承担适配的图像变换，NPU 执行已转换且支持的模型。

![RK3588S 硬件模块及连接关系](/assets/rk3588s/block-diagram.png)

从 Sige7S 做原型时，先选已经验证的输入设备；需要特定传感器、隔离接口或结构时，再评估 CM7S 载板。相机能采集到图像只是第一步，曝光、白平衡、镜头畸变与 IQ 参数同样影响推理质量。

## 场景二：交互屏与多媒体终端

RK3588S 将图形、视频解码和显示控制整合在一起，适合评估交互展示、信息终端或本地视频处理设备。8K 解码规格不等于任意浏览器、播放器和显示接口都能输出 8K；还需要对应格式、硬件加速路径、线缆和显示器支持。

应按真实素材测试：分辨率、帧率、位深、编码格式、字幕与 UI 合成都会改变负载。若同时运行 AI，需观察内存带宽、温度和端到端延迟，而不只看单个模块峰值。

## 场景三：集成到专用设备

CM7S 可把 RK3588S 计算能力带入自定义载板，适合需要专用连接器、相机布局或工业通信的产品规划。CAN、RS485 等系统接口还涉及收发器、隔离与保护；不能把 SoC 内部控制器直接理解为可接现场总线的成品接口。

## 软件路线与验收方式

Rockchip 的 RKNN-Toolkit2 仓库提供模型转换和部署相关工具；旧 RKNN-Toolkit 与 Toolkit2 不兼容。大语言模型应单独评估 RKNN-LLM 路线。是否支持具体模型，应查看所用版本的算子与示例，不能仅凭“支持 PyTorch/ONNX”下结论。

| 阶段 | 应记录的内容 |
|---|---|
| 模型转换 | 工具版本、模型哈希、输入形状、量化数据集 |
| 准确率验证 | 同一测试集上的转换前后差异 |
| 设备部署 | 板卡版本、镜像、内核、驱动、runtime |
| 性能验证 | 端到端延迟、吞吐、CPU 占用、温度与功耗 |
| 稳定性 | 持续运行、断电恢复、异常输入、存储寿命 |

从一个可复现的样例开始，再替换为自己的模型与数据。ArmSoM 的产品文档和本博客 RKNN 系列可以用于建立开发路径；任何帧率、功耗和模型效果都应在目标产品上测量后再用于宣传。


## 继续阅读与产品资料

- [RK3588S 芯片详解：从八核 CPU、6 TOPS NPU 到 ArmSoM 产品落地](/zh/articles/rk3588s-chip-guide/)
- [CM7S 与 Sige7S 怎么选？两种 RK3588S 产品开发路线](/zh/articles/cm7s-sige7s-rk3588s-selection/)
- [RK3588S Datasheet V1.3：下载、框图、封装与电气参数阅读指南](/zh/articles/rk3588s-datasheet-v13/)

### 产品与开发资料

- [CM7S](https://www.armsom.org/cm7s) · [CM7S Docs](https://docs.armsom.org/armsom-cm7s)
- [Sige7S](https://www.armsom.org/sige7s) · [Sige7S Docs](https://docs.armsom.org/armsom-sige7s)
- [Rockchip RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [RKNN-LLM](https://github.com/airockchip/rknn-llm)

- [RKNN-Toolkit2 V2.5.0: YOLOv5](/zh/articles/rknn-v250-sdk-quickstart-yolov5/)
- [Rockchip MPP](/zh/articles/089-rockchip-mpp/)
- [RGA IM2D API](/zh/articles/129-rockchip-rga-im2d-api/)
