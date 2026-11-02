---
title: "RK3588S edge AI and multimedia: planning a product with CM7S or Sige7S"
description: "Plan vision, display and embedded applications with RK3588S acceleration, model deployment and measurable acceptance criteria."
excerpt: "Plan vision, display and embedded applications with RK3588S acceleration, model deployment and measurable acceptance criteria."
translation_key: "rk3588s-edge-ai-multimedia"
slug: "rk3588s-edge-ai-multimedia"
lang: "en"
date: "2026-11-01"
author: "ArmSoM"
category: "ai"
products: ["CM7S", "Sige7S"]
tags: ["RK3588S", "CM7S", "Sige7S", "ArmSoM", "Rockchip"]
image: "/assets/rk3588s/block-diagram.png"
---

An effective RK3588S design assigns work to the appropriate hardware engines and avoids unnecessary data copies. CM7S and Sige7S provide starting points for this approach. The following are proposed application paths, not verified customer deployments or benchmark results.

## Local vision analysis

A typical pipeline is camera or stream input → capture/decode → resize and format conversion → NPU inference → post-processing → display or result upload. The CPU handles business logic, supported video goes through hardware codecs, compatible image transformations can use RGA, and converted supported models run on the NPU.

![RK3588S hardware blocks](/assets/rk3588s/block-diagram.png)

Prototype on Sige7S with a validated input device. Consider a CM7S carrier when sensor choice, isolation or enclosure requirements demand custom hardware. Successful capture alone is insufficient: exposure, white balance, lens distortion and IQ tuning affect inference quality.

## Interactive displays and multimedia terminals

Integrated graphics, decoding and display processing make RK3588S worth evaluating for information terminals and local video applications. An 8K decoder specification does not mean every browser, player and connector outputs 8K. Format support, acceleration paths, cables and displays must all match.

Test real content, including bit depth, codec, subtitles and UI composition. When AI runs concurrently, measure memory pressure, temperature and end-to-end latency rather than one engine's peak throughput.

## Integration into a dedicated device

CM7S can place RK3588S compute on a custom carrier with application-specific connectors and communication interfaces. System-level CAN or RS485 connections also require transceivers, protection and sometimes isolation. An internal controller is not a finished fieldbus port.

## Software and acceptance criteria

Rockchip's RKNN-Toolkit2 repository provides conversion and deployment tooling. The older RKNN-Toolkit is incompatible with Toolkit2. Evaluate RKNN-LLM separately for language models. Check operators and examples in the selected release; framework support alone does not prove support for an arbitrary model.

| Stage | Record |
|---|---|
| Conversion | Tool version, model hash, input shape, calibration dataset |
| Accuracy | Before/after results on the same validation set |
| Deployment | Board revision, image, kernel, driver and runtime |
| Performance | End-to-end latency, throughput, CPU load, temperature and power |
| Reliability | Long runs, power recovery, invalid inputs and storage endurance |

Begin with a reproducible example, then introduce your model and data. ArmSoM documentation and this blog's RKNN materials help establish the development path. Measure frame rate, power and accuracy on the target product before making performance claims.


## Further reading and product resources

- [RK3588S explained: eight CPU cores, a 6 TOPS NPU and ArmSoM platforms](/articles/rk3588s-chip-guide/)
- [CM7S or Sige7S? Choosing an RK3588S development platform](/articles/cm7s-sige7s-rk3588s-selection/)
- [RK3588S Datasheet V1.3: download, block diagram and hardware reading guide](/articles/rk3588s-datasheet-v13/)

### Products and development resources

- [CM7S](https://www.armsom.org/cm7s) · [CM7S Docs](https://docs.armsom.org/armsom-cm7s)
- [Sige7S](https://www.armsom.org/sige7s) · [Sige7S Docs](https://docs.armsom.org/armsom-sige7s)
- [Rockchip RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [RKNN-LLM](https://github.com/airockchip/rknn-llm)

- [RKNN-Toolkit2 V2.5.0: YOLOv5](/articles/rknn-v250-sdk-quickstart-yolov5/)
- [Rockchip MPP](/articles/089-rockchip-mpp/)
- [RGA IM2D API](/articles/129-rockchip-rga-im2d-api/)
