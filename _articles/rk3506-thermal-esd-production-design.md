---
title: "RK3506 thermal, ESD and production review"
description: "RK3506 thermal, ESD and production review. Circuit constraints, source parameters and validation for the actual board revision."
excerpt: "Circuit constraints, source parameters and validation for the actual board revision."
translation_key: "rk3506-thermal-esd-production-design"
slug: "rk3506-thermal-esd-production-design"
lang: "en"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["CM1", "Forge1"]
tags: ["RK3506", "hardware design", "ArmSoM"]
image: "/assets/localized/figures/en/f9cb32cffa6eda5d5014.png"
---

# RK3506 thermal, ESD and production review

Based on RK3506 Hardware Design Guide V1.0 (2024-09), covering G2 and B/J. Verify package, memory, rails and pins by variant and CM1/Forge1 interfaces against board documentation. This is an engineering topic article, not a complete page-by-page translation. Values are source references, not ArmSoM hardware measurements. Validate the actual SDK/BSP, kernel and firmware.

**RK3506 Hardware Design Guide_V1.0_20240904_CN.pdf** · §3.1–3.2; §4–7

## Thermal data has a test-board boundary

Source thermal resistance is a simulation reference for a specified package, PCB and environment, not an ArmSoM board measurement. Board area, copper, airflow, neighboring power devices and heatsinks change temperature; a single θJA cannot determine cooling needs. Record maximum ambient, enclosure, real workload, frequency and thermal policy, then measure both die temperature and critical component surfaces. Software throttling, emergency shutdown and normal-operation cooling are different safeguards and do not replace one another.

## ESD needs a discharge path, not just a component

Place protection near connectors and discharge entry points with a short, continuous return to ground. Ground connectors and shields reliably; keep sensitive clocks, reset and audio away from noise and board edges. Do not increase filter capacitance for EMI at the expense of high-speed integrity. Recheck signal quality after changes to TVS devices, common-mode chokes or connectors. System acceptance should include hot-plug, recovery after ESD and sustained workload, recording resets, audio noise and communication errors.

## Track cumulative moisture exposure

The guide specifies MSL3 with 168 hours cumulative floor life at ≤30°C/60%RH. The clock does not restart each time a lot returns to the line. Sealed-storage reference is ≤40°C, <90%RH and 12 months. If exposure limits are exceeded or the humidity indicator is abnormal, choose rebake conditions for package thickness, excess exposure and temperature. Both guides contain a suspect “≤300°C” entry for MSL1; never use it as a storage setting. Qualify the reflow profile for solder paste, board thermal mass and package process, retaining measured profiles and lot records.

## Source rebake reference

| Temperature | Floor-life overrun >72h | Floor-life overrun ≤72h |
| --- | --- | --- |
| 125°C +10/-0°C | 9h | 7h |
| 90°C +8/-0°C | 33h | 23h |
| 40°C +5/-0°C | 13d | 9d |

Only for the source conditions: MSL3, package body thickness ≤1.4mm. Times are the stated minimums, with low-temperature baking preferred. Check tray and component temperature limits. Do not infer a procedure for another package or an assembled board.

## Source figures and review pages

Only Chinese originals are available in this batch. All four languages use the same source images, retaining figure context; image labels are not translated. Prose is editable. Page numbers are physical PDF pages.

[![RK3506 thermal, ESD and production review · PDF 91](/assets/localized/figures/en/f9cb32cffa6eda5d5014.png)](/assets/localized/figures/en/f9cb32cffa6eda5d5014.png)

PDF 91

[![RK3506 thermal, ESD and production review · PDF 95](/assets/localized/figures/en/4fdc1df707e8c66ab30f.png)](/assets/localized/figures/en/4fdc1df707e8c66ab30f.png)

PDF 95

[![RK3506 thermal, ESD and production review · PDF 135](/assets/localized/figures/en/32bcc0952615d0f8dc3b.png)](/assets/localized/figures/en/32bcc0952615d0f8dc3b.png)

PDF 135

[![RK3506 thermal, ESD and production review · PDF 143](/assets/localized/figures/en/92caea8d636655afc35f.png)](/assets/localized/figures/en/92caea8d636655afc35f.png)

PDF 143

[![RK3506 thermal, ESD and production review · PDF 145](/assets/localized/figures/en/afc977d9f13f0b903195.png)](/assets/localized/figures/en/afc977d9f13f0b903195.png)

PDF 145

[![RK3506 thermal, ESD and production review · PDF 146](/assets/localized/figures/en/bf5fcdd97ec3c2caa3f0.png)](/assets/localized/figures/en/bf5fcdd97ec3c2caa3f0.png)

PDF 146

## ArmSoM products and documentation

- [ArmSoM CM1](https://www.armsom.org/product-page/cm1) · [CM1 Docs](https://docs.armsom.org/armsom-cm1)
- [ArmSoM Forge1](https://www.armsom.org/armsom-forge1) · [Forge1 Docs](https://docs.armsom.org/armsom-forge1)

## Continue reading

- [Series contents](/articles/rk3506-hardware-design-series/)
- [RK3506 minimum system: clocks, reset and recovery](/articles/rk3506-clock-boot-reset-design/)
- [RK3506 power domains: G2, B/J and carrier boundaries](/articles/rk3506-power-domains-design/)
- [RK3506 DDR, eMMC and FSPI: circuits and routing](/articles/rk3506-ddr-storage-hardware-design/)
- [RK3506 display, USB and RM_IO allocation](/articles/rk3506-display-usb-io-design/)
- [RK3506 audio design: SAI, PDM, ASRC and DSM](/articles/rk3506-audio-hardware-design/)
- [RK3506 industrial interfaces: RMII, FlexBus, DSMC and controls](/articles/rk3506-industrial-bus-hardware-design/)
