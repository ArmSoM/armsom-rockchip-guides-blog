---
title: "Rockchip RKNN Software Stack: Toolkit2, Runtime, Platforms and v2.3.2 Reference"
description: "Complete README PDF technical reference: RKNN architecture, platform list, downloads, Python compatibility notes, LLM link and v2.3.2 changes, with the original figure."
translation_key: "090-rockchip-rknn-software-stack"
slug: "090-rockchip-rknn-software-stack"
lang: "en"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []
tags: ["Rockchip", "RKNN", "RK3588", "RK3576", "NPU", "Toolkit2"]
keywords: "ArmSoM Rockchip RKNN Toolkit2 Runtime RK3588 RK3576 NPU"
excerpt: "Complete README PDF technical reference: RKNN architecture, platform list, downloads, Python compatibility notes, LLM link and v2.3.2 changes, with the original figure."
---

{% raw %}

# Rockchip RKNN Software Stack: Toolkit2, Runtime, Platforms and v2.3.2 Reference

## ArmSoM applicability and source

This is a Rockchip platform reference, not an ArmSoM test report. The source lists platforms including RK3588 and RK3576 but specifies no board, SDK/BSP or kernel version. Verify the matching NPU driver, Runtime, Toolkit, operating system and model support before adapting it to a particular ArmSoM board; a matching SoC name alone does not prove compatibility. README.pdf in the Chinese and English directories is byte-identical and its body is English. Chinese, Russian and German fully translate that same content. Chinese uses the figure from the Chinese-directory PDF (whose labels are English); English, Russian and German use the corresponding English-directory original. There is no document version number; v2.3.2 identifies the software snapshot, not a claim about the latest release. No hardware or model-performance validation was performed.

[Editorial notes](/docs/rockchip-rknn-software-stack/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

## 1. Description

The RKNN software stack helps users deploy AI models to Rockchip chips quickly. Its overall framework follows.

![Original RKNN software-stack diagram, PDF page 1](/docs/rockchip-rknn-software-stack/assets/en-p001-framework.png)

To use RKNPU, first run RKNN-Toolkit2 on a computer to convert the trained model to RKNN format, then perform inference on the development board using the RKNN C API or Python API.

- **RKNN-Toolkit2** is a software development kit for model conversion, inference and performance evaluation on PCs and Rockchip NPU platforms.
- **RKNN-Toolkit-Lite2** provides Python programming interfaces for Rockchip NPU platforms, helping deploy RKNN models and accelerate AI application implementation.
- **RKNN Runtime** provides C/C++ programming interfaces for Rockchip NPU platforms, helping deploy RKNN models and accelerate AI application implementation.
- **RKNPU kernel driver** interacts with NPU hardware. It is open source and can be found in Rockchip kernel code.

## 2. Supported platforms in the source

- RK3588 Series
- RK3576 Series
- RK3566/RK3568 Series
- RK3562 Series
- RV1103/RV1106
- RV1103B/RV1106B
- RV1126B
- RK2118

For RK1808/RV1109/RV1126/RK3399Pro, the source instead refers readers to the following projects. Do not conflate them with the Toolkit2 platform list above:

- [rknn-toolkit](https://github.com/airockchip/rknn-toolkit)
- [rknpu](https://github.com/airockchip/rknpu)
- [RK3399Pro_npu](https://github.com/airockchip/RK3399Pro_npu)

## 3. Download

All packages, Docker images, examples, documentation and platform-tools can also be obtained from [RKNPU2_SDK](https://console.zbox.filez.com/l/I00fc3); the source lists fetch code `rknn`. More examples are available in [rknn_model_zoo](https://github.com/airockchip/rknn_model_zoo). These are source-document download references; no software was downloaded or executed during this work.

## 4. Notes and Python versions

RKNN-Toolkit2 is not compatible with [RKNN-Toolkit](https://github.com/airockchip/rknn-toolkit). The source lists the following Python versions:

- Python 3.6
- Python 3.7
- Python 3.8
- Python 3.9
- Python 3.10
- Python 3.11
- Python 3.12

The source says “Latest version: v2.3.2”. This records the PDF snapshot, not the currently latest release, and does not assert that every package supports every Python version listed above.

## 5. RKNN LLM

For LLM (Large Language Model) deployment, the source introduces an SDK named RKNN-LLM; see [rknn-llm](https://github.com/airockchip/rknn-llm). The original link and naming are retained rather than silently replaced with another product name.

## 6. Technical changes in v2.3.2

- Support for the RV1126B platform.
- Improved einsum and Norm operation support.
- Added automatic mixed precision functionality.
- Enhanced graph optimization capabilities.

For older releases, the source refers to `CHANGELOG`. Its PDF hyperlink targets an internal local file, not a public page. The filename is retained without publishing a clickable internal path; consult the CHANGELOG supplied with the SDK in use.

{% endraw %}
