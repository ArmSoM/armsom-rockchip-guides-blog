---
title: "RK3572: 8nm, eight cores and 4 TOPS AI — ArmSoM plans a Zero-form-factor board"
description: "Rockchip RK3572 specifications and ArmSoM’s planned Raspberry Pi Zero-form-factor product, with clear limits on power figures and board compatibility."
excerpt: "Rockchip RK3572 specifications and ArmSoM’s planned Raspberry Pi Zero-form-factor product, with clear limits on power figures and board compatibility."
translation_key: "rockchip-rk3572-armsom-zero-preview"
slug: "rockchip-rk3572-armsom-zero-preview"
lang: "en"
date: "2026-10-30"
author: "ArmSoM"
category: "ai"
products: []
tags: ["ArmSoM", "Rockchip", "RK3572", "Edge AI"]
image: "/assets/rk3572/launch.jpg"
---

Compact boards make it easier to integrate computing into real devices. ArmSoM plans to use Rockchip RK3572 in a Raspberry Pi Zero-form-factor product, creating another option for space-constrained embedded projects.

**This is a product plan. This article does not announce a model name, dimensions, connectors, memory capacity, operating-system support, price or launch date.** The form-factor direction does not establish Raspberry Pi pin, enclosure, accessory or OS-image compatibility.

## RK3572: an eight-core platform for mid-range AIoT

Rockchip announced RK3572 on 8 May 2026 for consumer electronics, smart hardware and mid-range AIoT. The following covers the chip information, five advantages and application directions in the supplied official announcement PDF, including the technical illustrations. Manufacturer measurements are distinguished from ArmSoM product plans.

![Official Rockchip RK3572 announcement image, supplied PDF page 1.](/assets/rk3572/launch.jpg)

*Official Rockchip RK3572 announcement image, supplied PDF page 1.*

RK3572 uses an **8nm** process and **2× Cortex-A73 + 6× Cortex-A53** CPU cores. Its diagram divides these into a dual-A73, dual-A53 and quad-A53 cluster. The **Mali-G310 GPU** supports **Vulkan 1.4** according to the announcement text. The NPU is rated at **4 TOPS INT8**. Independent dual-display operation reaches **4K@60fps + 2K@60fps**, with video capabilities up to 8K decoding and 4K encoding.

![Official RK3572 block diagram, PDF page 2; chip interfaces do not define the final ArmSoM board connectors.](/assets/rk3572/block-diagram.jpg)

*Official RK3572 block diagram, PDF page 2; chip interfaces do not define the final ArmSoM board connectors.*

The diagram also lists an N320 MCU, LPDDR4/4X/5/5X, MIPI DSI (1×4 lanes), HDMI 2.1/eDP 1.3, 24-bit EBC, RGB/BT.1120, six SAI interfaces and SPDIF TX/RX. Encoding includes H.264/AVC and H.265/HEVC; decoding additionally lists VP9, AVS2 and AV1. The diagram says MMC4.5 while the text says MMC4.51. Both source labels are retained; confirm the applicable specification and BSP.

## Advantage 1: performance and power, with test conditions

Rockchip reports more than 100% higher performance and over 50% lower power in typical scenarios versus its previous mid-range platform, plus an AnTuTu v10 score above 310,000 on an RK3572 product. The source does not fully specify the comparison platform or benchmark configuration. These figures are neither universal workload improvements nor ArmSoM measurements.

| Manufacturer test scenario | Power |
| --- | --- |
| Second-level standby | <10mW |
| 1080P video playback | 670mW |
| 3D game, light GPU load | <1W |

**Test conditions: RK3572 tablet, 8GB LPDDR5 + 128GB UFS, display/touch panel removed, Wi-Fi/Bluetooth off.** Rockchip describes minimum-system power below 1W in most practical scenarios, low standby power and fast wake-up. A minimum system is not a complete board with cameras, wireless modules and USB peripherals, and is not a power guarantee for the planned ArmSoM product.

## Advantage 2: 4 TOPS INT8 NPU and model performance

The in-house NPU supports INT4/INT8/INT16/FP4/FP8/FP16/BF16 mixed precision and W4A16 asymmetric MAC operations. The announcement lists TensorFlow, Caffe, TFLite, PyTorch, ONNX NN, Android NN and MXNet. Individual models still require operator, quantization-accuracy and toolchain-version validation.

![Rockchip CNN performance image, PDF page 2; its values are transcribed below.](/assets/rk3572/cnn-performance.jpg)

*Rockchip CNN performance image, PDF page 2; its values are transcribed below.*

| Model | Resolution | Quantization | FPS | Latency ms | Memory |
| --- | --- | --- | --- | --- | --- |
| Resnet50-v2-7 | 224×224 | W8A8 | 109.03 | 9.172181 | 30.095 MB |
| Vit-base-patch16 | 224×224 | W4A16 | 24.47 | 40.87 | 47.5 MB |
| Yolov5s | 640×640 | W8A8 | 56.87 | 17.583708 | 14.416 MB |
| Yolov8s | 640×640 | W8A8 | 42.24 | 23.672386 | 17.966 MB |

![Rockchip LLM performance image, PDF page 3; original Model Context label and values retained.](/assets/rk3572/llm-performance.jpg)

*Rockchip LLM performance image, PDF page 3; original Model Context label and values retained.*

| Model | Model Context | TTFT (ms) | TPOT (ms) | Prefill TPS | Decode TPS |
| --- | --- | --- | --- | --- | --- |
| Qwen3-0.6B | 1024 | 190.09 | 43.03 | 673.38 | 23.24 |
| Qwen3-1.7B | 1024 | 360.57 | 111.57 | 354.99 | 8.96 |

TTFT normally means time to first token, TPOT time per subsequent token, and TPS tokens per second. The images do not fully document quantization, memory configuration, operating frequency or software versions. Their values do not guarantee application throughput, and Model Context=1024 is not evidence of a maximum chip context limit. All CNN/LLM measurements shown are Rockchip data, not ArmSoM tests.

Rockchip also lists AI-PQ picture enhancement, AI-SR super-resolution, image-based search, AI-HDR, intelligent denoising, speech recognition and AI beautification across image, video and audio applications. These examples do not mean every function ships in board firmware; SDK availability, licensing and integration must be checked.

## Advantage 3: 8K decoding, 12M ISP and multiple inputs/outputs

The announcement lists up to 8K decoding, 4K encoding, five camera inputs, a 12M ISP and independent 4K@60fps + 2K@60fps displays. Suggested uses include multi-angle capture, recording and live transmission, POS terminals and digital signage.

![Original RK3572 multimedia data path, PDF page 3, retaining camera, ISP, VOP and output labels.](/assets/rk3572/multimedia.jpg)

*Original RK3572 multimedia data path, PDF page 3, retaining camera, ISP, VOP and output labels.*

The diagram divides camera input into four MIPI CSI streams and one DVP stream. Two four-lane MIPI groups can be split into four two-lane groups. It labels ISP3.5 (12M30), VICAP, VPSS, RGA, VOP0 (4K60), VOP1 (2K60), Encoder (4K40) and Decoder (8K30). Outputs include MIPI DSI (2560×1600@60Hz), HDMI/eDP (4K@60Hz), RGB/BT.1120 (1080P@60Hz) and EBC. No complete concurrency matrix is supplied; individual maxima must not be added together.

## Advantage 4: storage, high-speed expansion and industrial interfaces

Storage interfaces include **eMMC 5.1 (HS400), dual-channel UFS 2.0, SD3.0/MMC4.51 and FSPI**. Peripheral interfaces include **PCIe 2.1, SATA 3.1, USB DRD 3.0/2.0, dual Gigabit Ethernet, SDIO 3.0, DSMC, CAN, I2C, I3C, SPI and UART**. They provide design options for data transfer, storage expansion and industrial communication. Combined PCIe/SATA labels do not prove that all interfaces operate independently at once; the ArmSoM board connector set remains unannounced.

## Advantage 5: LPDDR5/5X and flexible memory configurations

Rockchip emphasizes LPDDR5/5X for bandwidth, efficiency and sourcing flexibility. The DRAM controller supports **four ranks**. UFS 2.0, eMMC 5.1 and SDMMC 3.0 allow options including eMCP and uMCP; the diagram also lists LPDDR4/4X. The source’s long-term-supply statement is manufacturer positioning, not a guaranteed supply duration or inventory commitment here. ArmSoM capacities and storage combinations remain unannounced.

## Four application groups in the announcement

1. **Tablets and mobile terminals:** heterogeneous CPU scheduling, AI super-resolution, call denoising and offline voice for consumer tablets, portable medical devices, educational tablets and self-service terminals.
2. **AI cameras:** a 12M ISP with AI-HDR, deblurring and moiré removal for challenging lighting such as backlight and night scenes.
3. **Surveillance and NAS:** NVR examples include 4K@60fps decoding, multiple HD playback streams, face/license-plate recognition and abnormal-behavior analysis; NAS examples include image search and intelligent retrieval.
4. **Retail and digital signage:** desktop POS, signage and self-service systems combining dual displays, picture enhancement, AI super-resolution, text-to-image search, image search, visitor counting, face analysis and content-safety detection.

Rockchip names offices, education, finance, supermarkets, smart communities and smart homes as target sectors. These are platform directions, not proof that the planned ArmSoM product has implemented every function or obtained industry certification.

## What a Zero form factor means for a project

Size is only the beginning. Power-connector placement, connector orientation, mounting holes, cooling clearance and cable bend radius all influence integration. Evaluate mechanical drawings and actual pin definitions rather than relying on the Zero name.

Small vision nodes, offline voice terminals and lightweight interactive devices are possible development directions, not validated ArmSoM use cases. Define camera, audio, networking and storage requirements before choosing a model and software stack.

## What developers should validate beyond TOPS

Test operator coverage, model conversion, quantized accuracy, end-to-end latency and memory use with the intended model. Capture, preprocessing and display can become bottlenecks and should be measured alongside inference.

Confirm matching BSP, kernel, driver and inference-runtime versions. General RKNN tutorials explain a workflow; they do not replace the RK3572 support matrix or prove that an existing release supports this chip.

## Follow the ArmSoM product plan

ArmSoM plans to develop a Raspberry Pi Zero-form-factor RK3572 product. Developers can begin by documenting interface and power requirements. Final configurations will be specified in future official ArmSoM product information.

[ArmSoM website](https://www.armsom.org/) · [ArmSoM documentation](https://docs.armsom.org/)
