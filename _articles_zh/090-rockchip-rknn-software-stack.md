---
title: "Rockchip RKNN 软件栈：Toolkit2、Runtime、平台支持与 v2.3.2 参考"
description: "完整整理 RKNN README PDF 的软件架构、平台列表、下载、Python 兼容提示、LLM 入口和 v2.3.2 技术变化，保留原图。"
translation_key: "090-rockchip-rknn-software-stack"
slug: "090-rockchip-rknn-software-stack"
lang: "zh"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []
tags: ["Rockchip", "RKNN", "RK3588", "RK3576", "NPU", "Toolkit2"]
keywords: "ArmSoM Rockchip RKNN Toolkit2 Runtime RK3588 RK3576 NPU"
excerpt: "完整整理 RKNN README PDF 的软件架构、平台列表、下载、Python 兼容提示、LLM 入口和 v2.3.2 技术变化，保留原图。"
---

{% raw %}

# Rockchip RKNN 软件栈：Toolkit2、Runtime、平台支持与 v2.3.2 参考

## ArmSoM 适用说明与来源

这是 Rockchip 平台参考，不是 ArmSoM 实测。原稿列出 RK3588、RK3576 等平台，但未指定板卡、SDK/BSP 或内核版本；接入具体 ArmSoM 板卡前，需确认匹配的 NPU 驱动、Runtime、Toolkit、操作系统与模型支持，不能仅凭 SoC 名称保证兼容。中英文目录中的 README.pdf 哈希完全一致，实际正文都是英文；中文、俄文、德文完整译自同一内容。中文使用中文目录稿原图（其标签也是英文），英文/俄文/德文使用英文目录稿同一原图。原稿无文档版本号，本文以其 v2.3.2 软件快照标识，不作当前最新版本承诺。未进行硬件/模型性能验证。

[校对记录](/docs/rockchip-rknn-software-stack/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

## 1. 软件栈说明

RKNN 软件栈可帮助用户快速将 AI 模型部署到 Rockchip 芯片。整体框架如下。

![RKNN 软件栈原始框图，源 PDF 第 1 页](/docs/rockchip-rknn-software-stack/assets/cn-p001-framework.png)

使用 RKNPU 时，先在计算机运行 RKNN-Toolkit2，将已训练模型转换为 RKNN 格式，再在开发板上通过 RKNN C API 或 Python API 推理。

- **RKNN-Toolkit2**：用于在 PC 和 Rockchip NPU 平台进行模型转换、推理和性能评估的软件开发套件。
- **RKNN-Toolkit-Lite2**：提供 Rockchip NPU 平台的 Python 编程接口，帮助部署 RKNN 模型、加快 AI 应用落地。
- **RKNN Runtime**：提供 Rockchip NPU 平台的 C/C++ 编程接口，帮助部署 RKNN 模型、加快 AI 应用落地。
- **RKNPU kernel driver**：负责与 NPU 硬件交互，已开源，可在 Rockchip 内核代码中查找。

## 2. 支持平台（原稿列表）

- RK3588 系列
- RK3576 系列
- RK3566/RK3568 系列
- RK3562 系列
- RV1103/RV1106
- RV1103B/RV1106B
- RV1126B
- RK2118

对于 RK1808/RV1109/RV1126/RK3399Pro，原稿要求参考以下项目，不与上面的 Toolkit2 平台列表混同：

- [rknn-toolkit](https://github.com/airockchip/rknn-toolkit)
- [rknpu](https://github.com/airockchip/rknpu)
- [RK3399Pro_npu](https://github.com/airockchip/RK3399Pro_npu)

## 3. 下载

可通过 [RKNPU2_SDK](https://console.zbox.filez.com/l/I00fc3) 下载全部软件包、Docker 镜像、示例、文档与 platform-tools；原稿提取码为 `rknn`。更多示例见 [rknn_model_zoo](https://github.com/airockchip/rknn_model_zoo)。这是源文的下载入口，未在本次下载或执行其中软件。

## 4. 注意事项与 Python 版本

RKNN-Toolkit2 与 [RKNN-Toolkit](https://github.com/airockchip/rknn-toolkit) 不兼容。原稿列出的 Python 版本为：

- Python 3.6
- Python 3.7
- Python 3.8
- Python 3.9
- Python 3.10
- Python 3.11
- Python 3.12

原稿写“Latest version: v2.3.2”。这里只记录该 PDF 的版本快照，不表示当前最新版本，也不表示每个安装包均支持上述全部 Python 版本。

## 5. RKNN LLM

若需部署 LLM（Large Language Model，大语言模型），原稿介绍了名为 RKNN-LLM 的 SDK；详见 [rknn-llm](https://github.com/airockchip/rknn-llm)。保留原链接名称，不将它擅自改成其他产品名。

## 6. v2.3.2 技术变更

- 支持 RV1126B 平台。
- 改善 einsum 和 Norm 运算支持。
- 增加自动混合精度功能。
- 增强图优化能力。

原稿要求旧版本详情参见 `CHANGELOG`。PDF 中该链接指向内部本地文件，不能作为公开网页使用；这里保留文件名，未把内网路径发布为可点击链接。具体历史应核对所用 SDK 随附的 CHANGELOG。

{% endraw %}
