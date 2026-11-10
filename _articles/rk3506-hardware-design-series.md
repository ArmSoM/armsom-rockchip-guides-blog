---
title: "RK3506 hardware design series"
description: "RK3506 hardware design series. Circuit constraints, source parameters and validation for the actual board revision."
excerpt: "Circuit constraints, source parameters and validation for the actual board revision."
translation_key: "rk3506-hardware-design-series"
slug: "rk3506-hardware-design-series"
lang: "en"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["CM1", "Forge1"]
tags: ["RK3506", "hardware design", "ArmSoM"]
image: "/assets/rk3506-hardware-series/rk3506-cn-p20.png"
---

# RK3506 hardware design series

Based on RK3506 Hardware Design Guide V1.0 (2024-09), covering G2 and B/J. Verify package, memory, rails and pins by variant and CM1/Forge1 interfaces against board documentation. This is an engineering topic article, not a complete page-by-page translation. Values are source references, not ArmSoM hardware measurements. Validate the actual SDK/BSP, kernel and firmware.

## Read by design stage

- [RK3506 minimum system: clocks, reset and recovery](/articles/rk3506-clock-boot-reset-design/) · §2.1.1–2.1.5; §2.3.2; §3.3.1
- [RK3506 power domains: G2, B/J and carrier boundaries](/articles/rk3506-power-domains-design/) · §1.2; §2.1.9; §2.2; §3.3.2
- [RK3506 DDR, eMMC and FSPI: circuits and routing](/articles/rk3506-ddr-storage-hardware-design/) · §2.1.6–2.1.8; §3.3.9–3.3.12
- [RK3506 display, USB and RM_IO allocation](/articles/rk3506-display-usb-io-design/) · §2.3.4–2.3.6; §3.3.3–3.3.4; §3.3.11
- [RK3506 audio design: SAI, PDM, ASRC and DSM](/articles/rk3506-audio-hardware-design/) · §2.3.7; §3.3.13
- [RK3506 industrial interfaces: RMII, FlexBus, DSMC and controls](/articles/rk3506-industrial-bus-hardware-design/) · §2.3.8–2.3.17; §3.3.5–3.3.7
- [RK3506 thermal, ESD and production review](/articles/rk3506-thermal-esd-production-design/) · §3.1–3.2; §4–7

## ArmSoM products and documentation

- [ArmSoM CM1](https://www.armsom.org/product-page/cm1) · [CM1 Docs](https://docs.armsom.org/armsom-cm1)
- [ArmSoM Forge1](https://www.armsom.org/armsom-forge1) · [Forge1 Docs](https://docs.armsom.org/armsom-forge1)
