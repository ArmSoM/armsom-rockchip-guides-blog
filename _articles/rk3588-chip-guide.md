---
title: "RK3588 explained: eight CPU cores, 6 TOPS NPU and high-speed expansion"
description: "RK3588 explained: eight CPU cores, 6 TOPS NPU and high-speed expansion. Specifications, integration guidance and illustrated application ideas."
excerpt: "RK3588 explained: eight CPU cores, 6 TOPS NPU and high-speed expansion. Specifications, integration guidance and illustrated application ideas."
translation_key: "rk3588-chip-guide"
slug: "rk3588-chip-guide"
lang: "en"
date: "2026-11-02"
author: "ArmSoM"
category: "production"
products: ["AIM7", "Sige7", "LM7"]
tags: ["RK3588", "AIM7", "Sige7", "LM7", "Rockchip", "ArmSoM"]
image: "/assets/rk3588/block-diagram.png"
---

RK3588 combines computing, imaging, video and fast peripherals in one platform. ArmSoM offers three starting points: Sige7 for direct application prototyping, AIM7 for a removable-module design, and LM7 for LGA integration. Start with how data enters, is processed and leaves the system, then choose the hardware.

![Original RK3588 block diagram, V1.4 page 16](/assets/rk3588/block-diagram.png)

## Compute architecture and responsibilities

| Block | Datasheet V1.4 description | Engineering role |
|---|---|---|
| CPU | 4× Cortex-A76 + 4× Cortex-A55, shared 3MB L3 | Application logic, services and pre/post-processing |
| GPU | Mali-G610 MP4, OpenGL ES 3.2, OpenCL 2.2, Vulkan 1.2 | Graphics and driver-supported compute |
| NPU | Three cores, independent or cooperating in pairs/all three; up to 6 TOPS | Converted, supported neural networks |
| Memory | Four 16-bit channels; LPDDR4/4X/5; up to 32GB address space | Multitasking, models and frame buffers |
| Expansion | PCIe 3.0 and PCIe 2.x/SATA/USB combo interfaces | Storage, peripherals and capture systems |

Graphics API versions describe the source document's capabilities; actual availability depends on the OS and driver. 6 TOPS is not model frame rate or language-model tokens/s. Record precision, input shape, operators, runtime and end-to-end measurement conditions. Do not transfer another chip's sparsity footnote to this RK3588 document.

## Not every codec is 8K60

| Codec/direction | Detailed V1.4 limit |
|---|---|
| H.265, VP9, AVS2 decode | 8K60 |
| H.264 decode | 8K30 |
| AV1 decode | 4K60 |
| H.264/H.265 encode | 8K30 |

These limits apply to specified codec configurations, not guaranteed simultaneous full-rate streams. For a video-analysis terminal, validate decoding, resizing, inference, display and storage separately, watching copies, bandwidth and sustained temperature.

## ISP pixel counts require a mode

V1.4 lists dual-ISP modes of 48M (8064×6048@15) and 32M (6528×4898@30), and a single-ISP 16M mode (4672×3504@30). Official references to 48MP, 32MP and dual 16MP must not be treated as identical operating conditions. Camera integration also needs sensor drivers, tuning, lenses and synchronisation.

An inspection prototype can follow camera → ISP → RGA preprocessing → NPU → CPU decision → display/reporting. Stabilise lighting, capture conditions and samples before model optimisation. This is a proposed pipeline, not an ArmSoM inspection benchmark.

## RK3588 versus RK3588S: start with expansion

Their central compute roles are similar, but RK3588 PCIe 3.0 and HDMI input capabilities must not be copied into RK3588S product specifications. For fast SSDs, external video capture or interface combinations, check the exact SoC, schematic and exposed ports. Available interfaces do not imply that all multiplexed functions can run together.

## Choose an ArmSoM starting point

- **Sige7:** connect display, networking and storage to validate software and peripherals.
- **AIM7:** evaluate a matching carrier for development split between module and baseboard.
- **LM7:** integrate a module into a product with custom dimensions, interfaces and manufacturing requirements.

Each needs validation against its hardware revision and image. Application code and model experience may carry over, while device trees, power, cameras and cooling still require work. These are selection proposals, not measured performance, power or customer-deployment claims.

## Series and product links

- [AIM7 as a Jetson Nano/Orin alternative: hardware review and RKNN migration](/articles/aim7-jetson-nano-orin-alternative/)
- [Sige7 and LM7: six RK3588 application paths from prototype to product](/articles/sige7-lm7-rk3588-applications/)
- [RK3588 Datasheet V1.4: download, block diagram, package and electrical guide](/articles/rk3588-datasheet-v14/)
- [ArmSoM AIM7](https://docs.armsom.org/armsom-aim7) · [Sige7](https://docs.armsom.org/armsom-sige7) · [LM7](https://docs.armsom.org/armsom-lm7)

## References

- [Rockchip RK3588](https://www.rock-chips.com/a/en/products/RK35_Series/2022/0926/1660.html)
- [ArmSoM AIM7](https://docs.armsom.org/armsom-aim7)
- [ArmSoM Sige7](https://docs.armsom.org/armsom-sige7)
- [ArmSoM LM7](https://docs.armsom.org/armsom-lm7)
- [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules)
- [RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2)
