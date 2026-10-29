---
title: "Rockchip RGA IM2D API: hardware capabilities, interfaces and examples"
description: "Rockchip RGA IM2D API: hardware capabilities, interfaces and examples — V2.2.7."
translation_key: "129-rockchip-rga-im2d-api"
slug: "129-rockchip-rga-im2d-api"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []
tags: [ArmSoM, Rockchip, RGA, IM2D, librga]
excerpt: "Rockchip RGA IM2D API: hardware capabilities, interfaces and examples — V2.2.7."
---

{% raw %}

Complete technical chapters of Rockchip RGA IM2D API V2.2.7 (82 Chinese and 79 English pages). This ArmSoM platform reference requires checking the board SoC RGA version, SDK/BSP, matching librga/kernel driver and memory/format constraints. Universal support on ArmSoM boards is not implied. No single kernel version is specified; Chapter 2 gives driver compatibility. No ArmSoM hardware validation was performed. Performance values are vendor theoretical references; examples and logs are not ArmSoM measurements.

> Source issues retained: impyramind/impyramid and imfilp/imflip spelling differences; imcvtcolorTask prose says translation; §5.3.12 states default IM_ALPHA_BLEND_DST whereas §3.15 defaults to SRC_OVER; the OSD table maps internal/external guidance to EXTERNAL/INTERNAL, apparently opposite to the names. Original bule, RK_FORMA_A8, RK1103B and RK1108 spellings require SDK verification. The hardware table is clipped at the right: visible RGA3 text 3 (by pa… is retained without guessing its suffix.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip librga](https://github.com/airockchip/librga)

## 1. Overview

RGA (Raster Graphic Acceleration Unit) is an independent 2D hardware accelerator for common operations such as point/line drawing, image scaling, rotation, bitBlt and alpha blending.

### 1.1 Design specifications

| Version | Codename | Chip | Source min | Source max | Destination min | Destination max | Function | Pixels/Cycle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RGA1 | Pagani | RK3066 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/2~8 scale<br>Alpha blend<br>Color key<br>Color fill<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1 | Jaguar<br>Plus | RK3188 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/2~8 scale<br>Alpha blend<br>Color key<br>Color fill<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1 | Beetles | RK2926/2928 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/2~8 scale<br>Alpha blend<br>Color key<br>Color fill<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1 | Beetles<br>Plus | RK3026/3028 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/2~8 scale<br>Alpha blend<br>Color key<br>Color fill<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1_plus | Audi | RK3128 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/2~8 scale<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>IOMMU(32bit) | 1 |
| RGA1_plus | Granite | Sofia 3gr | 2x2 | 8192x8192 | 2x2 | 2048x2048 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/2~8 scale<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>IOMMU(32bit) | 1 |
| RGA2 | Lincoln | RK3288/3288w | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP<br>IOMMU(32bit) | 2 |
| RGA2 | Capricorn | RK3190 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite0 | Maybach | RK3368 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/8~8 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite0 | BMW | RK3366 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/8~8 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP<br>IOMMU(32bit) | 2 |

| Version | Codename | Chip | Source min | Source max | Destination min | Destination max | Function | Pixels/Cycle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RGA2-<br>Lite1 | Benz | RK3228 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/8~8 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite1 | Infiniti | RK3228H | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/8~8 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite1 | Gemini | RK3326 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/8~8 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite1 | Lion | RK1808 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/8~8 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite2 | Libra | RK3506 | 2x2 | 1280x8192 | 2x2 | 1280x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>Guassion blur<br>alpha-8bit | 2 |
| RGA2-<br>Lite3 | Pather | RK1103B | 2x2 | 2880x8192 | 2x2 | 2880x8192 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear)<br>scale-down(bi-linear/average)<br>Color fill | 2 |
| RGA2-<br>Enhance | Mclaren | RK3399 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP(NA for<br>RV1108/RV1109/RK3566)<br>NN quantize(NA for<br>RK3399/RV1108)<br>osd (only<br>RV1106/RV1103/RK3562/RK3528)<br>mosaic(only<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562is<br>40bit,NA for RV1106/1103) | 2 |
| RGA2-<br>Enhance | Mercury | RK1108 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP(NA for<br>RV1108/RV1109/RK3566)<br>NN quantize(NA for<br>RK3399/RV1108)<br>osd (only<br>RV1106/RV1103/RK3562/RK3528)<br>mosaic(only<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562is<br>40bit,NA for RV1106/1103) | 2 |
| RGA2-<br>Enhance | Puma | RV1126/RV1109 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP(NA for<br>RV1108/RV1109/RK3566)<br>NN quantize(NA for<br>RK3399/RV1108)<br>osd (only<br>RV1106/RV1103/RK3562/RK3528)<br>mosaic(only<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562is<br>40bit,NA for RV1106/1103) | 2 |
| RGA2-<br>Enhance | skylarkV2 | RK3566/RK3568 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP(NA for<br>RV1108/RV1109/RK3566)<br>NN quantize(NA for<br>RK3399/RV1108)<br>osd (only<br>RV1106/RV1103/RK3562/RK3528)<br>mosaic(only<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562is<br>40bit,NA for RV1106/1103) | 2 |
| RGA2-<br>Enhance | Orion | RK3588 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP(NA for<br>RV1108/RV1109/RK3566)<br>NN quantize(NA for<br>RK3399/RV1108)<br>osd (only<br>RV1106/RV1103/RK3562/RK3528)<br>mosaic(only<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562is<br>40bit,NA for RV1106/1103) | 2 |
| RGA2-<br>Enhance | Otter | RV1106/1103 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP(NA for<br>RV1108/RV1109/RK3566)<br>NN quantize(NA for<br>RK3399/RV1108)<br>osd (only<br>RV1106/RV1103/RK3562/RK3528)<br>mosaic(only<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562is<br>40bit,NA for RV1106/1103) | 2 |
| RGA2-<br>Enhance | Bull | RK3528 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP(NA for<br>RV1108/RV1109/RK3566)<br>NN quantize(NA for<br>RK3399/RV1108)<br>osd (only<br>RV1106/RV1103/RK3562/RK3528)<br>mosaic(only<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562is<br>40bit,NA for RV1106/1103) | 2 |
| RGA2-<br>Enhance | Snipe | RK3562 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP(NA for<br>RV1108/RV1109/RK3566)<br>NN quantize(NA for<br>RK3399/RV1108)<br>osd (only<br>RV1106/RV1103/RK3562/RK3528)<br>mosaic(only<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562is<br>40bit,NA for RV1106/1103) | 2 |

| Version | Codename | Chip | Source min | Source max | Destination min | Destination max | Function | Pixels/Cycle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RGA2-Pro | Heron | RK3576 | 2x2 | 8192x8192 | 2x2 | 8192x8192 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(bi-linear/average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP<br>osd<br>mosaic(only RK3576)<br>ARGB5551 alpha bit map<br>rkfbc64x4 input(only RK3576)<br>afbc32x8 input(split mode, only<br>RK3576)<br>tile4x4(RV1126B only input)<br>IOMMU(40bit) | 2 |
| RGA2-Pro | Swan | RV1126B | 2x2 | 8192x8192 | 2x2 | 8192x8192 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/16~16 scale<br>scale-up(bi-linear/bi-cubic)<br>scale-down(bi-linear/average)<br>Alpha blend<br>Color key<br>Color fill<br>Color palette<br>ROP<br>osd<br>mosaic(only RK3576)<br>ARGB5551 alpha bit map<br>rkfbc64x4 input(only RK3576)<br>afbc32x8 input(split mode, only<br>RK3576)<br>tile4x4(RV1126B only input)<br>IOMMU(40bit) | 2 |
| RGA3 | Orion | RK3588 | 68x2 | 8176x8176 | 68x2 | 8128x8128 | 90/180/270 Rotate<br>X/Y Mirror<br>Crop<br>1/8~8 scale<br>scale-up(bi-cubic)<br>scale-down(average)<br>Alpha blend<br>Color key<br>afbc16x16<br>IOMMU(40bit) | 3 (by pa…; 2 (scale) |

Note:

1) Pixels processed per clock cycle are theoretical values. Actual performance depends on bandwidth, hardware frequency and other factors; the table is for reference only.

2) In addition to minimum input-resolution limits, x, y, width and height of the actual operation rectangle on each channel must all be at least 2.

3) RGA addressability is related to IOMMU address width. For example, RGA with a 32-bit IOMMU can address physical memory only in the 0–4G range.

### 1.2 Supported image formats

Pixel-format conversion: BT.601/BT.709/BT.2020 (BT.2020 only on RGA3). Dither operation.

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA1 | Pagani | RK3066 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1<br>RK_FORMAT_BPP2<br>RK_FORMAT_BPP4<br>RK_FORMAT_BPP8 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP (only for<br>Blur/sharpness)<br>RK_FORMAT_YCrCb_420_SP (only for<br>Blur/sharpness)<br>RK_FORMAT_YCbCr_422_SP (only for<br>Blur/sharpness)<br>RK_FORMAT_YCrCb_422_SP (only for<br>Blur/sharpness)<br>RK_FORMAT_YCbCr_420_P (only for<br>Blur/sharpness)<br>RK_FORMAT_YCrCb_420_P (only for<br>Blur/sharpness)<br>RK_FORMAT_YCbCr_422_P (only for<br>Blur/sharpness)<br>RK_FORMAT_YCrCb_422_P (only for<br>Blur/sharpness) |
|  | Jaguar<br>Plus | RK3188 |  |  |
|  | Beetles | RK2926/2928 |  |  |
|  | Beetles<br>Plus | RK3026/3028 |  |  |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA1_plus | Audi | RK3128 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1<br>RK_FORMAT_BPP2<br>RK_FORMAT_BPP4<br>RK_FORMAT_BPP8 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP (only for<br>normal Bitblt without alpha)<br>RK_FORMAT_YCrCb_420_SP (only for<br>normal Bitblt without alpha)<br>RK_FORMAT_YCbCr_422_SP (only for<br>normal Bitblt without alpha)<br>RK_FORMAT_YCrCb_422_SP (only for<br>normal Bitblt without alpha)<br>RK_FORMAT_YCbCr_420_P (only for<br>normal Bitblt without alpha)<br>RK_FORMAT_YCrCb_420_P (only for<br>normal Bitblt without alpha)<br>RK_FORMAT_YCbCr_422_P (only for<br>normal Bitblt without alpha)<br>RK_FORMAT_YCrCb_422_P (only for<br>normal Bitblt without alpha) |
|  | Granite | Sofia 3gr |  |  |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA2 | Lincoln | RK3288/3288w | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1 (only for color<br>palette)<br>RK_FORMAT_BPP2 (only for color<br>palette)<br>RK_FORMAT_BPP4 (only for color<br>palette)<br>RK_FORMAT_BPP8 (only for color<br>palette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P |
|  | Capricorn | RK3190 |  |  |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA2-Lite0 | Maybach | RK3368 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1 (only for color<br>palette)<br>RK_FORMAT_BPP2 (only for color<br>palette)<br>RK_FORMAT_BPP4 (only for color<br>palette)<br>RK_FORMAT_BPP8 (only for color<br>palette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P |
|  | BMW | RK3366 |  |  |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA2-Lite1 | Benz | RK3228 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGBA_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_BPP1 (only for color<br>palette)<br>RK_FORMAT_BPP2 (only for color<br>palette)<br>RK_FORMAT_BPP4 (only for color<br>palette)<br>RK_FORMAT_BPP8 (only for color<br>palette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P |
|  | Infiniti | RK3228H |  |  |
|  | Gemini | RK3326 |  |  |
|  | Lion | RK1808 |  |  |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA2-Lite2 | Libra | RK3506 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_A8<br>RK_FORMAT_BPP1 (only for color<br>palette)<br>RK_FORMAT_BPP2 (only for color<br>palette)<br>RK_FORMAT_BPP4 (only for color<br>palette)<br>RK_FORMAT_BPP8 (only for color<br>palette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4 |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA2-Lite2 | Pather | RV1103B | RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400 | RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400 |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA2-<br>Enhance | Mclaren | RK3399 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_BPP1 (only for color<br>palette)<br>RK_FORMAT_BPP2 (only for color<br>palette)<br>RK_FORMAT_BPP4 (only for color<br>palette)<br>RK_FORMAT_BPP8 (only for color<br>palette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422 |
|  | Mercury | RK1108 |  |  |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
|  | Puma | RV1126/<br>RV1109 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_BPP1 (only for color<br>palette)<br>RK_FORMAT_BPP2 (only for color<br>palette)<br>RK_FORMAT_BPP4 (only for color<br>palette)<br>RK_FORMAT_BPP8 (only for color<br>palette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4 |
|  | skylarkV2 | RK3566/RK3568 |  |  |
|  | Orion | RK3588 |  |  |
|  |  |  |  |  |
|  | Otter | RV1106/1103 |  |  |
|  | Bull | RK3528 |  |  |
|  | Snipe | RK3562 |  |  |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA2-Pro | Heron | RK3576 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_444_SP<br>RK_FORMAT_YCrCb_444_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMA_A8 (only src for alpha<br>blend)<br>RK_FORMAT_BPP1 (only for color<br>palette)<br>RK_FORMAT_BPP2 (only for color<br>palette)<br>RK_FORMAT_BPP4 (only for color<br>palette)<br>RK_FORMAT_BPP8 (only for color<br>palette) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_444_SP<br>RK_FORMAT_YCrCb_444_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4 (only RK3576)<br>RK_FORMAT_Y8 (only RK3576) |
|  | Swan | RV1126B |  |  |

| Version | Codename | Chip | Input Data Format | Output Data Format |
| --- | --- | --- | --- | --- |
| RGA3 | Orion | RK3588 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B |

Note:

1) RK_FORMAT_YCbCr_400 uses only the Y channel of YUV, commonly for 256 (2^8) gray levels. Because it is a YUV format, check the color-space setting during RGB/YUV conversion. For a complete 256-level grayscale image, configure full range during conversion.

2) RK_FORMAT_Y4 uses only the Y channel of YUV and dithers it to 4 bits, commonly for 16 (2^4) gray levels. The same color-space precautions as RK_FORMAT_YCbCr_400 apply. RK_FORMAT_Y8 is similar to RK_FORMAT_Y4 and likewise has only 4 valid bits: the upper four bits carry valid data, while the lower four bits are invalid.

### 1.3 Image-format alignment

| Version | Byte_stride | Format | Alignment |
| --- | --- | --- | --- |
| RGA1<br>RGA1-Plus | 4 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888 | No alignment requirement for width stride. |
|  |  | RK_FORMAT_RGBA_4444<br>RK_FORMAT_BGRA_4444<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_RGBA_5551<br>RK_FORMAT_BGRA_5551<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565 | width stride must be aligned to 2. |
|  |  | RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888 | width stride must be aligned to 4. |
|  |  | RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P | width stride must be aligned to 4; x_offset, y_offset, width, height, height stride must be aligned to 2. |

| RGA2<br>RGA2-Lite0<br>RGA2-Lite1<br>RGA2-Lite2<br>RGA2-Lite3<br>RGA2-<br>Enhance<br>RGA2-Pro | 4 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888 | No alignment requirement for width stride. |
| --- | --- | --- | --- |
|  |  | RK_FORMAT_RGBA_4444<br>RK_FORMAT_BGRA_4444<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_RGBA_5551<br>RK_FORMAT_BGRA_5551<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565 | width stride must be aligned to 2. |
|  |  | RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YUYV_420<br>RK_FORMAT_YVYU_420<br>RK_FORMAT_UYVY_420<br>RK_FORMAT_VYUY_420 | width stride must be aligned to 2; x_offset, y_offset, width, height, height stride must be aligned to 2. |
|  |  | RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_A8 | width stride must be aligned to 4. |
|  |  | RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_444_SP<br>RK_FORMAT_YCrCb_444_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4<br>RK_FORMAT_Y8 | width stride must be aligned to 4; x_offset, y_offset, width, height, height stride must be aligned to 2. |
|  |  | RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B | width stride must be aligned to 16; x_offset, y_offset must be aligned to 64; width, height, height stride must be aligned to 2. |

| RGA3 | 16 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888 | width stride must be aligned to 4. |
| --- | --- | --- | --- |
|  |  | RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565 | width stride must be aligned to 8. |
|  |  | RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422 | width stride must be aligned to 8; x_offset, y_offset, width, height, height stride must be aligned to 2. |
|  |  | RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888 | width stride must be aligned to 16. |
|  |  | RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP | width stride must be aligned to 16; x_offset, y_offset, width, height, height stride must be aligned to 2. |
|  |  | RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B | width stride must be aligned to 64; x_offset, y_offset must be aligned to 4; width, height, height stride must be aligned to 2. |
|  |  | FBC mode | In addition to the format alignment above: width stride, height stride must be aligned to 16. |
|  |  | TILE8*8 mode | In addition to the format alignment above: width, height must be aligned to 8; input channel width stride, height stride must be aligned to 16. |

Note:

1) Alignment formula: lcm(bpp, byte_stride * 8) / pixel_stride.

2) When a platform contains multiple hardware versions, librga enforces the strictest alignment requirements to ensure hardware utilization.

## 2. Versions

The RGA support library librga.so updates its version according to rules that distinguish new features, compatibility changes and fixes. Several version-query methods help developers determine whether the current library suits their environment. Detailed changes and differences are in CHANGLOG.md at the source-tree root.

### 2.1 librga API version

#### 2.1.1 Version format and increment rules

##### 2.1.1.1 Version format

```text
major.minor.revision_[build]
```

Example:

1.0.0_[0]

##### 2.1.1.2 Increment rules

| Name | Rule |
| --- | --- |
| major | Major version: backward-incompatible releases. |
| minor | Minor version: backward-compatible functional API additions. |
| revision | Revision: backward-compatible functional additions or critical bug fixes. |
| build | Build version: backward-compatible bug fixes. |

#### 2.1.2 Querying the version

##### 2.1.2.1 Query using strings

Example for 64-bit Android R:

```text
:/# strings vendor/lib64/librga.so |grep rga_api |grep version
rga_api version 1.0.0_[0]
```

##### 2.1.2.2 Log output

The version is logged the first time each process calls an RGA API.

```text
rockchiprga: rga_api version 1.0.0_[0]
```

##### 2.1.2.3 API query

The following API queries the code version, build version and RGA hardware version. See the application-interface section for usage details.

```text
querystring(RGA_VERSION);
```

String format:

```text
RGA_api version : v1.0.0_[0]
RGA version : RGA_2_Enhance
```

##### 2.1.2.4 Property query

Property queries are supported only on Android and take effect only after a process has called RGA, setting the property.

```text
:/# getprop |grep rga
[vendor.rga_api.version]: [1.0.0_[0]]
```

### 2.2 Driver version

librga accesses RGA hardware through the driver. Ensure that the driver version is supported by the librga version in use.

#### 2.2.1 Version format and increment rules

##### 2.2.1.1 Version format

```text
<driver_name>: v major.minor.revision
```

Examples:

```text
RGA2 Device Driver: v2.1.0
RGA multicore Device Driver: v1.2.23
```

##### 2.2.1.2 Increment rules

| Name | Rule |
| --- | --- |
| major | Major version: backward-incompatible releases. |
| minor | Minor version: backward-compatible functional API additions. |
| revision | Revision: backward-compatible functional additions or critical bug fixes. |

#### 2.2.2 Querying the version

##### 2.2.2.1 Boot-log query

After boot, query RGA driver initialization logs with the following command. Some early drivers do not print a version, so this method works only with some driver versions.

```text
dmesg |grep rga
```

Example:

```text
[ 2.382393] rga3_core0 fdb60000.rga: Adding to iommu group 2
[ 2.382651] rga: rga3_core0, irq = 33, match scheduler
[ 2.383058] rga: rga3_core0 hardware loaded successfully, hw_version:3.0.76831.
[ 2.383121] rga: rga3_core0 probe successfully
[ 2.383687] rga3_core1 fdb70000.rga: Adding to iommu group 3
[ 2.383917] rga: rga3_core1, irq = 34, match scheduler
[ 2.384313] rga: rga3_core1 hardware loaded successfully, hw_version:3.0.76831.
[ 2.384412] rga: rga3_core1 probe successfully
[ 2.384893] rga: rga2, irq = 35, match scheduler
[ 2.385238] rga: rga2 hardware loaded successfully, hw_version:3.2.63318.
[ 2.385257] rga: rga2 probe successfully
[ 2.385455] rga_iommu: IOMMU binding successfully, default mapping core[0x1]
[ 2.385586] rga: Module initialized. v1.2.23
```

Here v1.2.23 is the driver version.

##### 2.2.2.2 Debug-node query

The version can be queried through driver debug nodes. If the nodes below are absent, the running driver does not support this query. For a kernel built with the normally enabled CONFIG_ROCKCHIP_RGA_DEBUG_FS option:

```text
cat /sys/kernel/debug/rkrga/driver_version
```

For a kernel with ROCKCHIP_RGA_PROC_FS enabled:

```text
cat /proc/rkrga/driver_version
```

```text
cat /sys/kernel/debug/rkrga/driver_version
RGA multicore Device Driver: v1.2.23
```

RGA multicore Device Driver identifies the driver name, and v1.2.23 identifies version 1.2.23: the currently running RGA multicore Device Driver (usually called multi_rga driver).

```text
cat /sys/kernel/debug/rkrga/driver_version
RGA2 Device Driver: v2.1.0
```

RGA2 Device Driver identifies the driver name, and v2.1.0 identifies version 2.1.0: the currently running RGA2 Device Driver (usually called rga2 driver).

### 2.3 Version relationships

Before using RGA, verify that the runtime environment is compatible. The table below lists common librga/driver version relationships.

| librga version | Corresponding driver | Hardware support |
| --- | --- | --- |
| No version number | Driver in the corresponding SDK | RGA1、RGA2 |
| 1.0.0 ~ 1.3.2 | RGA Device Driver(kernel - 4.4 or later)<br>RGA2 Device Driver(unversioned or v2.1.0) | RGA1、RGA2 |
| &gt; 1.4.0 | RGA multicore Device Driver(v1.2.0 or later) | RGA2、RGA3 |
| &gt; 1.9.0 | RGA Device Driver(kernel-4.4 or later)<br>RGA2 Device Driver(unversioned and v2.1.0)<br>RGA multicore Device Driver(v1.2.0 or later) | RGA1、RGA2、RGA3 |

## 3. Application interfaces

The RGA support library is librga.so. It configures image-buffer structure struct rga_info to perform 2D operations. Common operations are wrapped in a friendlier API. Features: interface definitions follow common OpenCV/MATLAB 2D APIs to reduce learning effort; RGA query reports hardware version, maximum input/output resolutions and supported formats to address compatibility differences; before processing, wrapbuffer_T fills struct rga_buffer_t with input/output buffer information such as resolution and format; improcess performs compound operations selected by predefined usage flags; operations that cannot be completed in one pass can be grouped into an RGA image job and submitted together for sequential driver execution.

### 3.1 Overview

This library provides the following APIs. Asynchronous mode is supported only by the C++ implementation.

- `querystring`: Query hardware version and supported features of the current SoC RGA and return a string.
- `imcheckHeader`: Check differences between the current header and librga versions.
- `importbuffer_T`: Import external memory (dma_fd, virtual or physical address) into the RGA driver for fast hardware access to physically contiguous or noncontiguous memory.
- `releasebuffer_handle`: Remove driver references and mappings for external buffers.
- `wrapbuffer_handle`: Quickly wrap an image buffer in rga_buffer_t.
- `imbeginJob`: Create an RGA image-processing job.
- `imendJob`: Submit and execute an RGA job.
- `imcancelJob`: Cancel and delete an RGA job.
- `imcopy`: Invoke RGA for fast image copying.
- `imcopyTask`: Add fast image copying to an RGA image job.
- `imresize`: Invoke RGA for fast image scaling.
- `imresizeTask`: Add fast image scaling to an RGA image job.
- `impyramind`: Invoke RGA for fast image-pyramid processing (source spelling).
- `imcrop`: Invoke RGA for fast image cropping.
- `imcropTask`: Add fast image cropping to an RGA image job.
- `imtranslate`: Invoke RGA for fast image translation.
- `imtranslateTask`: Add fast image translation to an RGA image job.
- `imcvtcolor`: Invoke RGA for fast image-format conversion.
- `imcvtcolorTask`: Add fast image-format conversion to an RGA image job.
- `imrotate`: Invoke RGA for fast image rotation.
- `imrotateTask`: Add fast image rotation to an RGA image job.
- `imflip`: Invoke RGA for fast image mirroring.
- `imflipTask`: Add fast image mirroring to an RGA image job.
- `imblend`: Invoke RGA for fast two-channel composition.
- `imblendTask`: Add fast two-channel composition to an RGA image job.
- `imcomposite`: Invoke RGA for fast three-channel composition.
- `imcompositeTask`: Add fast three-channel composition to an RGA image job.

- `imcolorkey`: Invoke RGA for fast color-key processing.
- `imcolorkeyTask`: Add fast color-key processing to an RGA image job.
- `imosd`: Invoke RGA for fast OSD text overlay.
- `imosdTask`: Add fast OSD text overlay to an RGA image job.
- `imquantize`: Invoke RGA for fast NN preprocessing (quantization).
- `imquantizeTask`: Add fast NN preprocessing (quantization) to an RGA image job.
- `imrop`: Invoke RGA for fast raster operations.
- `imropTask`: Add fast raster operations to an RGA image job.
- `imfill`: Invoke RGA for fast image filling.
- `imfillTask`: Add fast image filling to an RGA image job.
- `imfillArray`: Invoke RGA for fast multiple image fills.
- `imfillTaskArray`: Add fast multiple image fills to an RGA image job.
- `imrectangle`: Invoke RGA for fast uniform rectangular borders.
- `imrectangleTask`: Add fast uniform rectangular borders to an RGA image job.
- `imrectangleArray`: Invoke RGA for fast multiple uniform rectangular borders.
- `imrectangleTaskArray`: Add fast multiple uniform rectangular borders to an RGA image job.
- `immakeBorder`: Invoke RGA for fast rectangular borders.
- `immosaic`: Invoke RGA for fast mosaic masking.
- `immosaicTask`: Add fast mosaic masking to an RGA image job.
- `immosaicArray`: Invoke RGA for fast mosaic masking.
- `immosaicTaskArray`: Add fast mosaic masking to an RGA image job.
- `improcess`: Invoke RGA for fast combined image processing.
- `improcessTask`: Add fast combined image processing to an RGA image job.
- `imcheck`: Check parameter validity and hardware support.
- `imsync`: Synchronize completion in asynchronous mode.
- `imconfig`: Add default settings to the current thread context.

API support in different environments follows:

| Item | API | Supported languages | Supported systems | librga | RGA2<br>driver | Multi_RGA<br>driver |
| --- | --- | --- | --- | --- | --- | --- |
| common<br>API | querystring | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | imcheckHeader | C++ | Android / Linux<br>/ QNX / RT-<br>thread | ≥1.9.0 | / | / |
|  | imcheck | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imStrError | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | imsync | C++/C | Android / Linux | ≥1.6.0 | × | √ |
|  | imconfig | C++/C | Android / Linux | ≥1.6.0 | × | √ |
| buffer API | importbuffer_virtualaddr | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | importbuffer_physicaladdr | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | importbuffer_fd | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | releasebuffer_handle | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | wrapbuffer_handle | C++/C | Android / Linux | ≥1.7.2 | / | / |
|  | wrapbuffer_virtualaddr | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | wrapbuffer_physicaladdr | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | wrapbuffer_fd | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |

| Item | API | Supported languages | Supported systems | librga | RGA2<br>driver | Multi_RGA<br>driver |
| --- | --- | --- | --- | --- | --- | --- |
|  | imcopy | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imresize | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | impyramind | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcrop | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imtranslate | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcvtcolor | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imrotate | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imflip | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imblend | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcomposite | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcolorkey | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imosd | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | ≥1.8.0 | × | √ |
|  | imquantize | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imrop | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imfill | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imfillArray | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | imrectangle | C++/C | Android / Linux | ≥1.9.0 | × | √ |

| Item | API | Supported languages | Supported systems | librga | RGA2<br>driver | Multi_RGA<br>driver |
| --- | --- | --- | --- | --- | --- | --- |
|  | imrectangleArray | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | immakeBorder | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | immosaic | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | ≥1.8.0 | × | √ |
|  | immosaicArray | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | improcess | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
| task<br>process API | imbeginJob | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imendJob | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcancelJob | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcopyTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imresizeTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcropTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imtranslateTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcvtcolorTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imrotateTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imflipTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imblendTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcompositeTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcolorkeyTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imosdTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imquantizeTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imropTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imfillTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imfillTaskArray | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imrectangleTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imrectangleTaskArray | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | immosaicTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | immosaicTaskArray | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | immosaicTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | improcessTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |

| Item | API | Supported languages | Supported systems | librga | RGA2<br>driver | Multi_RGA<br>driver |
| --- | --- | --- | --- | --- | --- | --- |
| expand API | importbuffer_GraphicBuffer | C++ | Android | √ | / | / |
|  | importbuffer_GraphicBuffer_handle | C++ | Android | √ | / | / |
|  | importbuffer_AHardwareBuffer | C++ | Android | √ | / | / |
|  | wrapbuffer_GraphicBuffer | C++ | Android | √ | / | / |
|  | wrapbuffer_handle(GraphicBuffer<br>handle) | C++ | Android | √ | / | / |
|  | wrapbuffer_AHardwareBuffer | C++ | Android | √ | / | / |

Legend: √ supported; × unsupported; / not applicable.

### 3.2 Query RGA version and support

#### 3.2.1 querystring

```text
const char* querystring(int name);
```

Query basic RGA information and support for resolutions and formats.

| Parameters | Description |
| --- | --- |
| name | RGA_VENDOR - vendor information<br>RGA_VERSION - version information<br>RGA_MAX_INPUT - maximum supported input resolution<br>RGA_MAX_OUTPUT - maximum supported output resolution<br>RGA_BYTE_STRIDE - supported stride alignment<br>RGA_SCALE_LIMIT - supported scaling factors<br>RGA_INPUT_FORMAT - supported input formats<br>RGA_OUTPUT_FORMAT - supported output formats<br>RGA_EXPECTED - expected performance<br>RGA_ALL - output all information |

Returns a string describing RGA properties.

### 3.3 Header-version validation

#### 3.3.1 imcheckHeader

```text
IM_API IM_STATUS imcheckHeader(im_api_version_t header_version = RGA_CURRENT_API_HEADER_VERSION);
```

Check differences between the header version in use and the librga version.

| Parameters | Description |
| --- | --- |
| header_version | Header version; normally use RGA_CURRENT_API_HEADER_VERSION. |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.4 Image-buffer preprocessing

#### 3.4.1 importbuffer_T

For external memory processed by RGA, importbuffer_T maps the buffer physical-address information into the RGA driver and obtains the corresponding address information, enabling stable and fast subsequent RGA calls.

| Parameters(T) | Data Type | Description |
| --- | --- | --- |
| virtual address | void * | Virtual image-buffer address |
| physical address | uint64_t | Contiguous physical image-buffer address |
| fd | int | DMA image-buffer file descriptor |
| GraphicBuffer<br>handle | buffer_handle_t | Image-buffer handle containing address, file descriptor, resolution and format |
| GraphicBuffer | GraphicBuffer | android graphic buffer |
| AHardwareBuffer | AHardwareBuffer | chunks of memory that can be accessed by various hardware components in the<br>system. https://developer.android.com/ndk/reference/group/a-hardware-buffer |

RGA performance varies by buffer type: physical address &gt; fd &gt; virtual address. Using fd is generally recommended.

```text
IM_API rga_buffer_handle_t importbuffer_fd(int fd, int size);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, int size);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, int size);
```

| Parameter | Description |
| --- | --- |
| fd/va/pa | [required] external buffer |
| size | [required] memory size |

```text
IM_API rga_buffer_handle_t importbuffer_fd(int fd, int width, int height, int format);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, int width, int height, int format);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, int width, int height, int format);
```

| Parameter | Description |
| --- | --- |
| fd/va/pa | [required] external buffer |
| width | [required] pixel width stride of the image buffer |
| height | [required] pixel height stride of the image buffer |
| format | [required] pixel format of the image buffer |

```text
IM_API rga_buffer_handle_t importbuffer_fd(int fd, im_handle_param_t *param);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, im_handle_param_t *param);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, im_handle_param_t *param);
```

| Parameter | Description |
| --- | --- |
| fd/va/pa | [required] external buffer |
| param | [required] configure buffer parameters |

```text
IM_API rga_buffer_handle_t importbuffer_GraphicBuffer_handle(buffer_handle_t hnd);
IM_API rga_buffer_handle_t importbuffer_GraphicBuffer(sp<GraphicBuffer> buf);
IM_API rga_buffer_handle_t importbuffer_AHardwareBuffer(AHardwareBuffer *buf);
```

| Parameter | Description |
| --- | --- |
| hnd/buf | [required] external buffer |

Returns an rga_buffer_handle_t memory handle.

#### 3.4.2 releasebuffer_handle

After RGA has finished using external memory, call releasebuffer_handle with its handle to remove the mapping/binding between the buffer and the RGA driver and release the corresponding driver resources.

```text
IM_API IM_STATUS releasebuffer_handle(rga_buffer_handle_t handle);
```

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.4.3 wrapbuffer_handle

IM2D input-source and output-destination image parameters support several types and describe memory, format, width and height. Before an image operation, call wrapbuffer_handle to convert these parameters into the common rga_buffer_t structure passed to the user API.

```text
rga_buffer_t wrapbuffer_handle(rga_buffer_handle_t handle,
                               int width,
                               int height,
                               int format,
                               int wstride = width,
                               int hstride = height);
```

| Parameter | Description |
| --- | --- |
| handle | [required] RGA buffer handle |
| width | [required] pixel width of the image that needs to be processed |
| height | [required] pixel height of the image that needs to be processed |
| format | [required] pixel format |
| wtride | [optional] pixel width stride of the image |
| hstride | [optional] pixel width stride of the image |

Returns rga_buffer_t describing the image.

### 3.5 Create an image job

#### 3.5.1 imbeginJob

```text
IM_API im_job_handle_t imbeginJob(uint64_t flags = 0);
```

Create an RGA image-processing job and return its handle. job_handle can add/remove RGA image operations and submit/execute the job.

| Parameter | Description |
| --- | --- |
| flags | [optional] job flags |

Returns an im_job_handle_t job handle.

### 3.6 Submit an image job

#### 3.6.1 imendJob

```text
IM_API IM_STATUS imendJob(im_job_handle_t job_handle,
                          int sync_mode = IM_SYNC,
                          int acquire_fence_fd = 0,
                          int *release_fence_fd = NULL);
```

Submit and execute a created RGA image-processing job. Resources of the completed job are automatically deleted when it finishes.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| sync_mode | [optional] wait until operation complete |
| acquire_fence_fd | [optional] Used in async mode, run the job after waiting foracquire_fence signal |
| release_fence_fd | [optional] Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.7 Cancel an image job

#### 3.7.1 imcancelJob

```text
IM_API IM_STATUS imcancelJob(im_job_handle_t job_handle);
```

Cancel and delete a created RGA image-processing job.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.8 Image copying

#### 3.8.1 imcopy

```text
IM_STATUS imcopy(const rga_buffer_t src,
                 rga_buffer_t dst,
                 int sync = 1,
                 int *release_fence_fd = NULL);
```

Perform a single fast image copy from the src-channel buffer to the dst-channel buffer.

| Parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.8.2 imcopyTask

```text
IM_API IM_STATUS imcopyTask(im_job_handle_t job_handle,
                            const rga_buffer_t src,
                            rga_buffer_t dst);
```

Use job_handle to add an operation for image copying to the specified job. Usage is the same as imcopy.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.9 Scaling and image pyramids

#### 3.9.1 imresize

```text
IM_STATUS imresize(const rga_buffer_t src,
                   rga_buffer_t dst,
                   double fx = 0,
                   double fy = 0,
                   int interpolation = INTER_LINEAR,
                   int sync = 1,
                   int *release_fence_fd = NULL);
```

Select dst to describe the target image dimensions, or set scaling factors fx/fy for the desired ratio. If both dst and fx/fy are configured, the dimensions calculated from fx/fy take precedence.

Only RGA1/RGA1 plus support configuring interpolation; for other hardware consult the corresponding TRM for the scaling algorithm. When using fx/fy, formats with dimension-alignment constraints, such as YUV, are forcibly rounded down to the required alignment, which may change the intended scaling result.

| Parameters | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image; it has the size dsize (when it is non-zero) or the size computed from src.size(), fx,<br>and fy; the type of dst is the same as of src. |
| fx | [optional] scale factor along the horizontal axis; when it equals 0, it is computed as:<br>fx = (double) dst.width / src.width |
| fy | [optional] scale factor along the vertical axis; when it equals 0, it is computed as:<br>fy = (double) dst.height / src.height |
| interpolation | [optional] interpolation method:<br>INTER_NEAREST - a nearest-neighbor interpolation<br>INTER_LINEAR - a bilinear interpolation (used by default)<br>INTER_CUBIC - a bicubic interpolation over 4x4 pixel neighborhood |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.9.2 impyramid

```text
IM_STATUS impyramid (const rga_buffer_t src,
                     rga_buffer_t dst，
                     IM_SCALE direction)
```

Pyramid scaling: according to direction, scale both width and height by 1/2 or by 2.

| Parameters | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image; |
| direction | [required] scale mode<br>IM_UP_SCALE —— up scale<br>IM_DOWN_SCALE —— down scale |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.9.3 imresizeTask

```text
IM_API IM_STATUS imresizeTask(im_job_handle_t job_handle,
                              const rga_buffer_t src,
                              rga_buffer_t dst,
                              double fx = 0,
                              double fy = 0,
                              int interpolation = 0);
```

Use job_handle to add an operation for image scaling to the specified job. Usage is the same as imresize.

| Parameters | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image; it has the size dsize (when it is non-zero) or the size computed from src.size(), fx,<br>and fy; the type of dst is the same as of src. |
| fx | [optional] scale factor along the horizontal axis; when it equals 0, it is computed as:<br>fx = (double) dst.width / src.width |
| fy | [optional] scale factor along the vertical axis; when it equals 0, it is computed as:<br>fy = (double) dst.height / src.height |
| interpolation | [optional] interpolation method:<br>INTER_NEAREST - a nearest-neighbor interpolation<br>INTER_LINEAR - a bilinear interpolation (used by default)<br>INTER_CUBIC - a bicubic interpolation over 4x4 pixel neighborhood |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.10 Image cropping

#### 3.10.1 imcrop

```text
IM_STATUS imcrop(const rga_buffer_t src,
                 rga_buffer_t dst,
                 im_rect rect,
                 int sync = 1,
                 int *release_fence_fd = NULL);
```

Crop the image to the specified Rect region and size.

| Parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| rect | [required] crop region<br>x - upper-left x coordinate<br>y - upper-left y coordinate<br>width - region width<br>height - region height |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.10.2 imcropTask

```text
IM_API IM_STATUS imcropTask(im_job_handle_t job_handle,
                            const rga_buffer_t src,
                            rga_buffer_t dst,
                            im_rect rect);
```

Use job_handle to add an operation for image cropping to the specified job. Usage is the same as imcrop.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| rect | [required] crop region<br>x - upper-left x coordinate<br>y - upper-left y coordinate<br>width - region width<br>height - region height |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.11 Image translation

#### 3.11.1 imtranslate

```text
IM_STATUS imtranslate(const rga_buffer_t src,
                      rga_buffer_t dst,
                      int x,
                      int y,
                      int sync = 1,
                      int *release_fence_fd = NULL);
```

Translate the image to coordinates (x, y). src and dst must have the same width and height; portions outside the bounds are clipped.

| Parameter | Description |
| --- | --- |
| src | [required]input image |
| dst | [required] output image |
| x | [required] horizontal translation |
| y | [required] vertical translation |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.11.2 imtranslateTask

```text
IM_API IM_STATUS imtranslateTask(im_job_handle_t job_handle,
                                 const rga_buffer_t src,
                                 rga_buffer_t dst,
                                 int x,
                                 int y);
```

Use job_handle to add an operation for image translation to the specified job. Usage is the same as imtranslate.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required]input image |
| dst | [required] output image |
| x | [required] horizontal translation |
| y | [required] vertical translation |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.12 Image-format conversion

#### 3.12.1 imcvtcolor

```text
IM_STATUS imcvtcolor(rga_buffer_t src,
                     rga_buffer_t dst,
                     int sfmt,
                     int dfmt,
                     int mode = IM_COLOR_SPACE_DEFAULT,
                     int sync = 1,
                     int *release_fence_fd = NULL);
```

Convert image format. Supported formats vary by SoC; see the format-support section. Set formats through rga_buffer_t or configure source/destination separately with sfmt/dfmt. For YUV/RGB color-space conversion, mode selects the color space; the default is BT.601 limited range.

| parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| sfmt | [optional] source image format |
| dfmt | [optional] destination image format |
| Mode | [optional] color space mode:<br>IM_YUV_TO_RGB_BT601_LIMIT<br>IM_YUV_TO_RGB_BT601_FULL<br>IM_YUV_TO_RGB_BT709_LIMIT<br>IM_RGB_TO_YUV_BT601_LIMIT<br>IM_RGB_TO_YUV_BT601_FULL<br>IM_RGB_TO_YUV_BT709_LIMIT |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.12.2 imcvtcolorTask

```text
IM_API IM_STATUS imcvtcolorTask(im_job_handle_t job_handle,
                                rga_buffer_t src,
                                rga_buffer_t dst,
                                int sfmt,
                                int dfmt,
                                int mode = IM_COLOR_SPACE_DEFAULT);
```

Use job_handle to add an operation for image translation (source wording) to the specified job. Usage is the same as imcvtcolor.

| parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| sfmt | [optional] source image format |
| dfmt | [optional] destination image format |
| Mode | [optional] color space mode:<br>IM_YUV_TO_RGB_BT601_LIMIT<br>IM_YUV_TO_RGB_BT601_FULL<br>IM_YUV_TO_RGB_BT709_LIMIT<br>IM_RGB_TO_YUV_BT601_LIMIT<br>IM_RGB_TO_YUV_BT601_FULL<br>IM_RGB_TO_YUV_BT709_LIMIT |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.13 Image rotation

#### 3.13.1 imrotate

```text
IM_STATUS imrotate(const rga_buffer_t src,
                   rga_buffer_t dst,
                   int rotation,
                   int sync = 1,
                   int *release_fence_fd = NULL);
```

Rotate images by 90, 180 or 270 degrees.

| Parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| rotation | [required] rotation angle:<br>IM_HAL_TRANSFORM_ROT_90<br>IM_HAL_TRANSFORM_ROT_180<br>IM_HAL_TRANSFORM_ROT_270 |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.13.2 imrotateTask

```text
IM_API IM_STATUS imrotateTask(im_job_handle_t job_handle,
                              const rga_buffer_t src,
                              rga_buffer_t dst,
                              int rotation);
```

Use job_handle to add an operation for image rotation to the specified job. Usage is the same as imrotate.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| rotation | [required] rotation angle:<br>IM_HAL_TRANSFORM_ROT_90<br>IM_HAL_TRANSFORM_ROT_180<br>IM_HAL_TRANSFORM_ROT_270 |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.14 Image mirroring

#### 3.14.1 imfilp

```text
IM_STATUS imflip (const rga_buffer_t src,
                  rga_buffer_t dst,
                  int mode,
                  int sync = 1,
                  int *release_fence_fd = NULL);
```

Mirror images horizontally or vertically.

| Parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| mode | [required] flip mode:<br>IM_HAL_TRANSFORM_FLIP_H_V<br>IM_HAL_TRANSFORM_FLIP_H<br>IM_HAL_TRANSFORM_FLIP_V |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.14.2 imflipTask

```text
IM_API IM_STATUS imflipTask(im_job_handle_t job_handle,
                            const rga_buffer_t src,
                            rga_buffer_t dst,
                            int mode);
```

Use job_handle to add an operation for image mirroring to the specified job. Usage is the same as imflip.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| mode | [required] flip mode:<br>IM_HAL_TRANSFORM_FLIP_H_V<br>IM_HAL_TRANSFORM_FLIP_H<br>IM_HAL_TRANSFORM_FLIP_V |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.15 Image composition

#### 3.15.1 imblend/imcomposite

```text
IM_STATUS imblend(const rga_buffer_t fg_image,
                  rga_buffer_t bg_image,
                  int mode = IM_ALPHA_BLEND_SRC_OVER,
                  int sync = 1,
                  int *release_fence_fd = NULL);
```

RGA two-channel composition uses A+B -&gt; B. Blend the foreground (srcA) and background (dst) with the configured alpha-blending model and write the result to dst. The default model is src-over when no model is configured.

```text
IM_STATUS imcomposite(const rga_buffer_t fg_image,
                      const rga_buffer_t bg_image,
                      rga_buffer_t output_image,
                      int mode = IM_ALPHA_BLEND_SRC_OVER,
                      int sync = 1,
                      int *release_fence_fd = NULL);
```

RGA three-channel composition uses A+B -&gt; C. Alpha-blend foreground srcA with background srcB according to the configured model and write the result to dst. The default model is src-over. In both composition modes, mode selects the Porter-Duff model. Definitions:

- S: source/foreground image.
- D: destination/background image.
- R: result.
- c: RGB color components of RGBA. Porter-Duff colors are premultiplied: original color multiplied by alpha. If not already premultiplied, perform Xc = Xc * Xa.
- a: alpha/transparency component of RGBA.
- f: factor applied to color or alpha.

The core formulas calculate result color as source color × source factor + destination color × destination factor, and result alpha analogously. RGA supports the following models:

```text
Rc = Sc * Sf + Dc * Df;
Ra = Sa * Sf + Da * Df;

SRC:
Sf = 1, Df = 0;
[Rc,Ra] = [Sc,Sa];
DST:
Sf = 0, Df = 1;
[Rc,Ra] = [Dc,Da];
SRC_OVER:
Sf = 1, Df = (1 - Sa);
[Rc,Ra] = [ Sc + (1 - Sa) * Dc, Sa + (1 - Sa) * Da ];
DST_OVER:
Sf = (1 - Da), Df = 1;
```

```text
[Rc,Ra] = [ Sc * (1 - Da) + Dc, Sa * (1 - Da) + Da ] ;
```

Composition between YUV images is unsupported. The dst image of imblend and srcB image of imcomposite cannot use YUV.

| Parameter | Description |
| --- | --- |
| fg_image | [required] foreground image |
| bg_image | [required] background image, when A+B-&gt;B it is also the output destination image. |
| output_image | [required] output destination image. |
| mode | [optional] blending mode:<br>IM_ALPHA_BLEND_SRC —— SRC mode<br>IM_ALPHA_BLEND_DST —— DST mode<br>IM_ALPHA_BLEND_SRC_OVER —— SRC OVER mode<br>IM_ALPHA_BLEND_DST_OVER —— DST OVER mode<br>IM_ALPHA_BLEND_PRE_MUL —— Enable premultiplication: OR this flag with the other mode flags before assigning mode. |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.15.2 imblendTask/imcompositeTask

```text
IM_API IM_STATUS imblendTask(im_job_handle_t job_handle,
                             const rga_buffer_t fg_image,
                             rga_buffer_t bg_image,
                             int mode = IM_ALPHA_BLEND_SRC_OVER);
```

Use job_handle to add A+B -&gt; B composition to the specified job. Usage is the same as imblend; the default blending mode is src-over.

```text
IM_API IM_STATUS imcompositeTask(im_job_handle_t job_handle,
                                 const rga_buffer_t fg_image,
                                 const rga_buffer_t bg_image,
                                 rga_buffer_t output_image,
                                 int mode = IM_ALPHA_BLEND_SRC_OVER);
```

Use job_handle to add A+B -&gt; C composition to the specified job. Usage is the same as imcomposite; the default blending mode is src-over. Note: composition between YUV images is unsupported. The dst image of imblend and the srcB image of imcomposite cannot use YUV.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| fg_image | [required] foreground image |
| bg_image | [required] background image, when A+B-&gt;B it is also the output destination image. |
| output_image | [required] output destination image. |
| mode | [optional] blending mode:<br>IM_ALPHA_BLEND_SRC —— SRC mode<br>IM_ALPHA_BLEND_DST —— DST mode<br>IM_ALPHA_BLEND_SRC_OVER —— SRC OVER mode<br>IM_ALPHA_BLEND_DST_OVER —— DST OVER mode<br>IM_ALPHA_BLEND_PRE_MUL —— Enable premultiplication: OR this flag with the other mode flags before assigning mode. |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.16 Color Key

#### 3.16.1 imcolorkey

```text
IM_STATUS imcolorkey(const rga_buffer_t src,
                     rga_buffer_t dst,
                     im_colorkey_range range,
                     int mode = IM_ALPHA_COLORKEY_NORMAL,
                     int sync = 1,
                     int *release_fence_fd = NULL);
```

Color Key preprocesses the source image by clearing the alpha component of pixels satisfying the color-key condition, which specifies nontransparent color values, then alpha-blends the preprocessed source with the destination. Color-key filtering is applied only to the configured color range in src and the result is overlaid on dst. IM_ALPHA_COLORKEY_NORMAL clears alpha for pixels inside the range; IM_ALPHA_COLORKEY_INVERTED does the reverse. The default is IM_ALPHA_COLORKEY_NORMAL.

| Parameters | Range | Description |
| --- | --- | --- |
| max | 0x0 ~ 0xFFFFFFFF | Maximum color value to remove/key, in ABGR order |
| min | 0x0 ~ 0xFFFFFFFF | Minimum color value to remove/key, in ABGR order |

| parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| range | [required] Target color range<br>typedef struct im_colorkey_range {<br>int max;<br>int min;<br>} im_colorkey_value; |
| Mode | [required] Color Key mode:<br>IM_ALPHA_COLORKEY_NORMAL<br>IM_ALPHA_COLORKEY_INVERTED |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.16.2 imcolorkeyTask

```text
IM_API IM_STATUS imcolorkeyTask(im_job_handle_t job_handle,
                                const rga_buffer_t fg_image,
                                rga_buffer_t bg_image,
                                im_colorkey_range range,
                                int mode = IM_ALPHA_COLORKEY_NORMAL);
```

Use job_handle to add Color Key processing to the job. Usage matches imcolorkey; the default mode is IM_ALPHA_COLORKEY_NORMAL.

| Parameters | Range | Description |
| --- | --- | --- |
| max | 0x0 ~ 0xFFFFFFFF | Maximum color value to remove/key, in ABGR order |
| min | 0x0 ~ 0xFFFFFFFF | Minimum color value to remove/key, in ABGR order |

| parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| range | [required] Target color range<br>typedef struct im_colorkey_range {<br>int max;<br>int min;<br>} im_colorkey_value; |
| Mode | [required] Color Key mode:<br>IM_ALPHA_COLORKEY_NORMAL<br>IM_ALPHA_COLORKEY_INVERTED |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.17 OSD text overlay

#### 3.17.1 imosd

```text
IM_API IM_STATUS imosd(const rga_buffer_t osd,
                       const rga_buffer_t bg_image,
                       const im_rect osd_rect,
                       im_osd_t *osd_config,
                       int sync = 1,
                       int *release_fence_fd = NULL);
```

OSD (On-Screen Display) overlays text on video images and supports text luminance statistics and automatic color inversion.

| parameter | Description |
| --- | --- |
| OSD | [required] osd block image |
| bg_image | [required] output image |
| osd_rect | [required] image region to OSD |
| osd_config | [required] OSD function config |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.17.2 imosdTask

```text
IM_API IM_STATUS imosdTask(im_job_handle_t job_handle,
                           const rga_buffer_t osd,
                           const rga_buffer_t bg_image,
                           const im_rect osd_rect,
                           im_osd_t *osd_config);
```

Use job_handle to add OSD processing to the specified job. Usage is the same as imosd.

| parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| OSD | [required] osd block image |
| dst | [required] output image |
| osd_rect | [required] image region to OSD |
| osd_config | [required] OSD function config |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.18 NN preprocessing (quantization)

#### 3.18.1 imquantize

```text
IM_STATUS imquantize(const rga_buffer_t src,
                     rga_buffer_t dst,
                     rga_nn_t nn_info,
                     int sync = 1,
                     int *release_fence_fd = NULL);
```

Currently supported only on RV1126 / RV1109. NN preprocessing allows offset and scale to be configured independently for the three RGB channels. Formula:

```text
dst = 【(src + offset) * scale 】
```

Parameter ranges:

| Parameters | Range | Description |
| --- | --- | --- |
| scale | 0 ~ 3.99 | 10 bits: the high 2 bits are the integer part; the low 8 bits are fractional. |
| offset | -255 ~ 255 | 9 bits: the high bit is the sign; the low bits encode an offset of 0–255. |

| parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| nn_info | [required] rga_nn_t configures offset and scale separately for each RGB channel<br>typedef struct rga_nn {<br>int nn_flag;<br>int scale_r;<br>int scale_g;<br>int scale_b;<br>int offset_r;<br>int offset_g;<br>int offset_b;<br>} rga_nn_t; |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.18.2 imquantizeTask

```text
IM_API IM_STATUS imquantizeTask(im_job_handle_t job_handle,
                                const rga_buffer_t src,
                                rga_buffer_t dst,
                                im_nn_t nn_info);
```

Use job_handle to add image quantization to the specified job. Usage is the same as imquantize.

| parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| nn_info | [required] rga_nn_t configures offset and scale separately for each RGB channel<br>typedef struct rga_nn {<br>int nn_flag;<br>int scale_r;<br>int scale_g;<br>int scale_b;<br>int offset_r;<br>int offset_g;<br>int offset_b;<br>} rga_nn_t; |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.19 Image raster operations (ROP)

#### 3.19.1 imrop

```text
IM_STATUS imrop(const rga_buffer_t src,
                rga_buffer_t dst,
                int rop_code,
                int sync = 1,
                int *release_fence_fd = NULL);
```

Perform a ROP operation on two images.

| parameter | Description |
| --- | --- |
| src | [required] input image |
| dst | [required] output image |
| rop_code | [required] rop code mode<br>IM_ROP_AND : dst = dst AND src;<br>IM_ROP_OR : dst = dst OR src<br>IM_ROP_NOT_DST : dst = NOT dst<br>IM_ROP_NOT_SRC : dst = NOT src<br>IM_ROP_XOR : dst = dst XOR src<br>IM_ROP_NOT_XOR : dst = NOT (dst XOR src) |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.19.2 imropTask

```text
IM_API IM_STATUS imropTask(im_job_handle_t job_handle,
                           const rga_buffer_t src,
                           rga_buffer_t dst,
                           int rop_code);
```

Use job_handle to add image ROP processing to the specified job. Usage is the same as imrop.

| parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input image |
| dst | [required] output image |
| rop_code | [required] rop code mode<br>IM_ROP_AND : dst = dst AND src;<br>IM_ROP_OR : dst = dst OR src<br>IM_ROP_NOT_DST : dst = NOT dst<br>IM_ROP_NOT_SRC : dst = NOT src<br>IM_ROP_XOR : dst = dst XOR src<br>IM_ROP_NOT_XOR : dst = NOT (dst XOR src) |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.20 Color filling and border drawing

#### 3.20.1 imfill

```text
IM_STATUS imfill(rga_buffer_t dst,
                 im_rect rect,
                 int color,
                 int sync = 1,
                 int *release_fence_fd = NULL);
```

Fill the specified rect region with a color. The color parameter specifies RGBA, with A, B, G, R from high to low bits; for example, red: color = 0x000000ff. The rect width and height must each be at least 2.

| Parameter | Description |
| --- | --- |
| dst | [required] target image |
| rect | [required] image region to fill specified color<br>width and height of rect must be greater than or equal to 2 |
| color | [required] fill with color |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.20.2 imfillArray

```text
IM_API IM_STATUS imfillArray(rga_buffer_t dst,
                             im_rect *rect_array,
                             int array_size,
                             uint32_t color,
                             int sync = 1,
                             int *release_fence_fd = NULL);
```

Fill multiple image regions with a color one by one. The color parameter specifies RGBA, with A, B, G, R from high to low bits; for example, red: color = 0x000000ff. The rect width and height must each be at least 2.

| Parameter | Description |
| --- | --- |
| dst | [required] target image |
| rect_array | [required] image region array_ptr to fill specified color<br>width and height of rect must be greater than or equal to 2 |
| array_size | [required] size of region arrays. |
| color | [required] fill with color |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.20.3 imfillTask

```text
IM_API IM_STATUS imfillTask(im_job_handle_t job_handle,
                            rga_buffer_t dst,
                            im_rect rect,
                            uint32_t color);
```

Use job_handle to add image filling to the job. Usage matches imfill. The rect width and height must each be at least 2.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| dst | [required] target image |
| rect | [required] image region to fill specified color<br>width and height of rect must be greater than or equal to 2 |
| color | [required] fill with color |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.20.4 imfillTaskArray

```text
IM_API IM_STATUS imfillTaskArray(im_job_handle_t job_handle,
                                 rga_buffer_t dst,
                                 im_rect *rect_array,
                                 int array_size,
                                 uint32_t color);
```

Use job_handle to add color filling of multiple regions to the job. Usage matches imfillArray. The rect width and height must each be at least 2.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| dst | [required] target image |
| rect_array | [required] image region array_ptr to fill specified color<br>width and height of rect must be greater than or equal to 2 |
| array_size | [required] size of region arrays. |
| color | [required] fill with color |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.20.5 imrectangle

```text
IM_API IM_STATUS imrectangle(rga_buffer_t dst,
                             im_rect rect,
                             uint32_t color,
                             int thickness,
                             int sync = 1,
                             int *release_fence_fd = NULL);
```

Draw a border of thickness around rect, which specifies the outer boundary, using color. A negative thickness fills a solid rectangle. The color parameter specifies RGBA, with A, B, G, R from high to low bits; for example, red: color = 0x000000ff. The rect width and height must each be at least 2.

| Parameter | Description |
| --- | --- |
| dst | [required] target image |
| rect | [required] image region to fill specified color<br>width and height of rect must be greater than or equal to 2 |
| color | [required] fill with color |
| thickness | [required] Thickness of lines that make up the rectangle.<br>Negative values, like -1, mean that the function has to draw a filled rectangle. |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.20.6 imrectangleArray

```text
IM_API IM_STATUS imrectangleArray(rga_buffer_t dst,
                                  im_rect *rect_array,
                                  int array_size,
                                  uint32_t color,
                                  int thickness,
                                  int sync = 1,
                                  int *release_fence_fd = NULL);
```

Draw borders of thickness around multiple rect regions, which specify the outer boundaries, using color, one by one. A negative thickness fills solid rectangles. The color parameter specifies RGBA, with A, B, G, R from high to low bits; for example, red: color = 0x000000ff. The rect width and height must each be at least 2.

| Parameter | Description |
| --- | --- |
| dst | [required] target image |
| rect_array | [required] image region array_ptr to fill specified color<br>width and height of rect must be greater than or equal to 2 |
| array_size | [required] size of region arrays. |
| color | [required] fill with color |
| thickness | [required] Thickness of lines that make up the rectangle.<br>Negative values, like -1, mean that the function has to draw a filled rectangle. |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.20.7 imrectangleTask

```text
IM_API IM_STATUS imrectangleTask(im_job_handle_t job_handle,
                                 rga_buffer_t dst,
                                 im_rect rect,
                                 uint32_t color,
                                 int thickness);
```

Use job_handle to add rectangular image borders to the job. Usage matches imrectangle. The rect width and height must each be at least 2.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| dst | [required] target image |
| rect | [required] image region to fill specified color<br>width and height of rect must be greater than or equal to 2 |
| color | [required] fill with color |
| thickness | [required] Thickness of lines that make up the rectangle.<br>Negative values, like -1, mean that the function has to draw a filled rectangle. |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.20.8 imrectangleTaskArray

```text
IM_API IM_STATUS imrectangleTaskArray(im_job_handle_t job_handle,
                                      rga_buffer_t dst,
                                      im_rect *rect_array,
                                      int array_size,
                                      uint32_t color,
                                      int thickness);
```

Use job_handle to add multiple rectangular image borders to the job. Usage matches imrectangleArray. The rect width and height must each be at least 2.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| dst | [required] target image |
| rect_array | [required] image region array_ptr to fill specified color<br>width and height of rect must be greater than or equal to 2 |
| array_size | [required] size of region arrays. |
| color | [required] fill with color |
| thickness | [required] Thickness of lines that make up the rectangle.<br>Negative values, like -1, mean that the function has to draw a filled rectangle. |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.20.9 immakeBorder

```text
IM_API IM_STATUS immakeBorder(rga_buffer_t src,
                              rga_buffer_t dst,
                              int top,
                              int bottom,
                              int left,
                              int right,
                              int border_type,
                              int value = 0,
                              int sync = 1,
                              int acquir_fence_fd = -1,
                              int *release_fence_fd = NULL);
```

Add borders of top/bottom/left/right pixels to the input image and write the result to the destination buffer. Each of top/bottom/left/right must be at least 2.

| Parameter | Description |
| --- | --- |
| src | [required] input source image |
| dst | [required] output target image |
| top | [required] number of top pixels |
| bottom | [required] number of bottom pixels |
| left | [required] number of left pixels |
| right | [required] number of right pixels |
| border_type | [required] Border type<br>IM_BORDER_CONSTANT // iiiiii abcdefgh iiiiiii with some specified value 'i'<br>IM_BORDER_REFLECT //fedcba abcdefgh hgfedcb<br>IM_BORDER_WRAP //cdefgh abcdefgh abcdefg |
| value | [optional] the pixel value at which the border is filled |
| sync | [optional] wait until operation complete |
| acquire_fence_fd | [required] used in async mode, run the job after waiting foracquire_fence signal |
| release_fence_fd | [required] used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.21 Image mosaic

#### 3.21.1 immosaic

```text
IM_API IM_STATUS immosaic(const rga_buffer_t image,
                          im_rect rect,
                          int mosaic_mode,
                          int sync = 1,
                          int *release_fence_fd = NULL);
```

Apply mosaic masking to the specified image region.

| Parameter | Description |
| --- | --- |
| image | [required] target image |
| rect | [required] image region to mosaic |
| mosaic_mode | [required] set mosaic mode<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.21.2 immosaicArray

```text
IM_API IM_STATUS immosaicArray(const rga_buffer_t image,
                               im_rect *rect_array,
                               int array_size,
                               int mosaic_mode,
                               int sync = 1,
                               int *release_fence_fd = NULL);
```

Apply mosaic masking to multiple image regions one by one.

| Parameter | Description |
| --- | --- |
| image | [required] target image |
| rect_array | [required] image region array_ptr to mosaic |
| array_size | [required] size of region arrays. |
| mosaic_mode | [required] set mosaic mode<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |
| sync | [optional] wait until operation complete |
| release_fence_fd | [optional]Used in async mode, as a parameter of imsync() |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.21.3 immosaicTask

```text
IM_API IM_STATUS immosaicTask(im_job_handle_t job_handle,
                              const rga_buffer_t image,
                              im_rect rect,
                              int mosaic_mode);
```

Use job_handle to add mosaic masking to the specified job. Usage is the same as immosaic.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| image | [required] target image |
| rect | [required] image region to mosaic |
| mosaic_mode | [required] set mosaic mode<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.21.4 immosaicTaskArray

```text
IM_API IM_STATUS immosaicTaskArray(im_job_handle_t job_handle,
                                   const rga_buffer_t image,
                                   im_rect *rect_array,
                                   int array_size,
                                   int mosaic_mode);
```

Use job_handle to add mosaic masking of multiple image regions to the specified job. Usage is the same as immosaicArray.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| image | [required] target image |
| rect_array | [required] image region array_ptr to mosaic |
| array_size | [required] size of region arrays. |
| mosaic_mode | [required] set mosaic mode<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.22 Image processing

#### 3.22.1 improcess

```text
IM_STATUS improcess(rga_buffer_t src,
                    rga_buffer_t dst,
                    rga_buffer_t pat,
                    im_rect srect,
                    im_rect drect,
                    im_rect prect,
                    int acquire_fence_fd,
                    int *release_fence_fd,
                    im_opt_t *opt,
                    int usage);
```

RGA combined image-operation function. Other APIs are implemented on top of this API; improcess supports more complex combinations. Configure image operations through usage, defined as follows:

```text
typedef enum {
    /* Rotation */
    IM_HAL_TRANSFORM_ROT_90     = 1 << 0,
    IM_HAL_TRANSFORM_ROT_180    = 1 << 1,
    IM_HAL_TRANSFORM_ROT_270    = 1 << 2,
    IM_HAL_TRANSFORM_FLIP_H     = 1 << 3,
    IM_HAL_TRANSFORM_FLIP_V     = 1 << 4,
    IM_HAL_TRANSFORM_FLIP_H_V   = 1 << 5,
    IM_HAL_TRANSFORM_MASK       = 0x3f,
    /*
     * Blend
     * Additional blend usage, can be used with both source and target configs.
     * If none of the below is set, the default "SRC over DST" is applied.
     */
    IM_ALPHA_BLEND_SRC_OVER     = 1 << 6,     /* Default, Porter-Duff "SRC over DST" */
    IM_ALPHA_BLEND_SRC          = 1 << 7,     /* Porter-Duff "SRC" */
    IM_ALPHA_BLEND_DST          = 1 << 8,     /* Porter-Duff "DST" */
    IM_ALPHA_BLEND_SRC_IN       = 1 << 9,     /* Porter-Duff "SRC in DST" */
    IM_ALPHA_BLEND_DST_IN       = 1 << 10,    /* Porter-Duff "DST in SRC" */
    IM_ALPHA_BLEND_SRC_OUT      = 1 << 11,    /* Porter-Duff "SRC out DST" */
    IM_ALPHA_BLEND_DST_OUT      = 1 << 12,    /* Porter-Duff "DST out SRC" */
    IM_ALPHA_BLEND_DST_OVER     = 1 << 13,    /* Porter-Duff "DST over SRC" */
    IM_ALPHA_BLEND_SRC_ATOP     = 1 << 14,    /* Porter-Duff "SRC ATOP" */
    IM_ALPHA_BLEND_DST_ATOP     = 1 << 15,    /* Porter-Duff "DST ATOP" */
    IM_ALPHA_BLEND_XOR          = 1 << 16,    /* Xor */
    IM_ALPHA_BLEND_MASK         = 0x1ffc0,

    IM_ALPHA_COLORKEY_NORMAL    = 1 << 17,
    IM_ALPHA_COLORKEY_INVERTED  = 1 << 18,
    IM_ALPHA_COLORKEY_MASK      = 0x60000,

    IM_SYNC                     = 1 << 19,
    IM_ASYNC                    = 1 << 26,
    IM_CROP                     = 1 << 20,    /* Unused */
    IM_COLOR_FILL               = 1 << 21,
    IM_COLOR_PALETTE            = 1 << 22,
    IM_NN_QUANTIZE              = 1 << 23,
    IM_ROP                      = 1 << 24,
    IM_ALPHA_BLEND_PRE_MUL      = 1 << 25,
} IM_USAGE;
```

| Parameter | Description |
| --- | --- |
| src | [required] input imageA |
| dst | [required] output image |
| pat | [required] input imageB |
| srect | [required] src crop region |
| drect | [required] dst crop region |
| prect | [required] pat crop region |
| acquire_fence_fd | [required] Used in async mode, run the job after waiting foracquire_fence signal |
| release_fence_fd | [required] Used in async mode, as a parameter of imsync() |
| opt | [required] operation options<br>typedef struct im_opt {<br>int color;<br>im_colorkey_range colorkey_range;<br>im_nn_t nn;<br>int rop_code;<br>int priority;<br>int core;<br>} im_opt_t; |
| usage | [required] image operation usage |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

#### 3.22.2 improcessTask

```text
IM_API IM_STATUS improcessTask(im_job_handle_t job_handle,
                               rga_buffer_t src,
                               rga_buffer_t dst,
                               rga_buffer_t pat,
                               im_rect srect,
                               im_rect drect,
                               im_rect prect,
                               im_opt_t *opt_ptr,
                               int usage);
```

Use job_handle to add combined image processing to the specified job. Usage is the same as improcess.

| Parameter | Description |
| --- | --- |
| job_handle | [required] job handle |
| src | [required] input imageA |
| dst | [required] output image |
| pat | [required] input imageB |
| srect | [required] src crop region |
| drect | [required] dst crop region |
| prect | [required] pat crop region |
| acquire_fence_fd | [required] Used in async mode, run the job after waiting foracquire_fence signal |
| release_fence_fd | [required] Used in async mode, as a parameter of imsync() |
| opt | [required] operation options<br>typedef struct im_opt {<br>int color;<br>im_colorkey_range colorkey_range;<br>im_nn_t nn;<br>int rop_code;<br>int priority;<br>int core;<br>} im_opt_t; |
| usage | [required] image operation usage |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.23 Parameter validation

#### 3.23.1 imcheck

```text
IM_API IM_STATUS imcheck(const rga_buffer_t src, const rga_buffer_t dst,
                         const im_rect src_rect, const im_rect dst_rect,
                         const int mode_usage);
IM_API IM_STATUS imcheck_composite(const rga_buffer_t src, const rga_buffer_t dst, const rga_buffer_t pat,
                                   const im_rect src_rect, const im_rect dst_rect, const im_rect pat_rect,
                                   const int mode_usage);
```

After configuring RGA job parameters, use this interface to check parameter validity and support on the current hardware.

Use this interface only during development and debugging to avoid performance loss from repeated checks.

| Parameter | Description |
| --- | --- |
| src | [required] input imageA |
| dst | [required] output image |
| pat | [optional] input imageB |
| srect | [required] src crop region |
| drect | [required] dst crop region |
| prect | [optional] pat crop region |
| usage | [optional] image operation usage |

Returns IM_STATUS_NOERROR on success, otherwise a negative error code.

### 3.24 Synchronization

#### 3.24.1 imsync

```text
IM_STATUS imsync(int fence_fd);
```

In asynchronous mode, call this interface with the returned release_fence_fd to wait for completion. Setting sync to 0 in other APIs enables asynchronous calls, analogous to OpenGL glFlush. Calling imsync afterward provides the effect of glFinish.

| Parameter | Description |
| --- | --- |
| fence_fd | [required] fence_fd to wait |

Returns IM_STATUS_SUCCESS on success, otherwise a negative error code.

### 3.25 Thread-context configuration

#### 3.25.1 imconfig

```text
IM_STATUS  imconfig(IM_CONFIG_NAME name, uint64_t value);
```

Configure the current thread context using different configuration names. This context supplies the thread defaults and has lower priority than interface arguments. If the call does not configure a parameter, its context default is used; otherwise the interface argument takes precedence for that call.

| parameter | Description |
| --- | --- |
| name | [required] context config name:<br>IM_CONFIG_SCHEDULER_CORE —— select the task-processing core<br>IM_CONFIG_PRIORITY —— task priority<br>IM_CHECK_CONFIG —— enable validation |
| value | [required] config value<br>IM_CONFIG_SCHEDULER_CORE :<br>IM_SCHEDULER_RGA3_CORE0<br>IM_SCHEDULER_RGA3_CORE1<br>IM_SCHEDULER_RGA2_CORE0<br>IM_SCHEDULER_RGA3_DEFAULT<br>IM_SCHEDULER_RGA2_DEFAULT<br>IM_CONFIG_PRIORITY:<br>0 ~ 6<br>IM_CHECK_CONFIG:<br>TRUE<br>FALSE |

priority and core are highly privileged settings. Incorrect use can crash or deadlock the system. Use them only for development/debugging; configuring them in production is strongly discouraged. Returns IM_STATUS_SUCCESS on success; otherwise a negative error code.

## 4. Data structures

This chapter details the data structures used by the application interfaces.

### 4.1 Overview

| Data structure | Description |
| --- | --- |
| rga_buffer_t | Image-buffer information |
| im_rect | Actual image-operation region |
| im_opt_t | Image-operation options |
| im_job_handle_t | RGA job handle |
| rga_buffer_handle_t | RGA-driver image-buffer handle |
| im_handle_param_t | Properties of the image buffer to import |
| im_context_t | Current thread default context |
| im_nn_t | NN preprocessing parameters |
| im_colorkey_range | Color-key range |

### 4.2 Detailed descriptions

#### 4.2.1 rga_buffer_t

Image-buffer information for one channel.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct {
    void* vir_addr;                     /* virtual address */
    void* phy_addr;                     /* physical address */
    int fd;                             /* shared fd */
    rga_buffer_handle_t handle;         /* buffer handle */

    int width;                          /* width */
    int height;                         /* height */
    int wstride;                        /* wstride */
    int hstride;                        /* hstride */
    int format;                         /* format */

    int color_space_mode;               /* color_space_mode */
    int global_alpha;                   /* global_alpha */
    int rd_mode;
} rga_buffer_t;
```

| Member parameter | Description |
| --- | --- |
| vir_addr | Virtual image-buffer address. |
| phy_addr | Contiguous physical image-buffer address. |
| fd | DMA image-buffer file descriptor. |
| handle | Memory handle of the image buffer imported into RGA. |
| width | Actual operation-region width, in pixels. |
| height | Actual operation-region height, in pixels. |
| wstride | Image width stride, in pixels. |
| hstride | Image height stride, in pixels. |
| format | Image format. |
| color_space_mode | Image color space. |
| global_alpha | Global alpha. |
| rd_mode | Current channel read mode. |

Notes: choose only one of vir_addr, phy_addr, fd or handle to describe the image buffer. If several are assigned, only one is selected by the default priority: handle &gt; phy_addr &gt; fd &gt; vir_addr.

#### 4.2.2 im_rect

Actual operation region for one channel.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct {
    int x;        /* upper-left x */
    int y;        /* upper-left y */
    int width;    /* width */
    int height;   /* height */
} im_rect;
```

| Member parameter | Description |
| --- | --- |
| x | Actual operation-region starting x coordinate, in pixels. |
| y | Actual operation-region starting y coordinate, in pixels. |
| width | Actual operation-region width, in pixels. |
| height | Actual operation-region height, in pixels. |

The operation region must not exceed the image size: (x + width) &lt;= wstride and (y + height) &lt;= hstride.

#### 4.2.3 im_opt_t

Image-operation options for the current task.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_opt {
    im_api_version_t version DEFAULT_INITIALIZER(RGA_CURRENT_API_HEADER_VERSION);
    int color;                          /* color, used by color fill */
    im_colorkey_range colorkey_range;   /* range value of color key */
    im_nn_t nn;
    int rop_code;
    int priority;
    int core;
    int mosaic_mode;
    im_osd_t osd_config;
    im_intr_config_t intr_config;
    char reserve[128];
} im_opt_t;
```

| Member parameter | Description |
| --- | --- |
| version | Current header version |
| color | Image fill color. |
| colorkey_range | Color-key range configuration. |
| nn | NN preprocessing (quantization). |
| rop_code | ROP opcode configuration. |
| priority | Current task priority. |
| core | Hardware core for the current task. |
| mosaic_mode | Mosaic mode. |
| osd_config | OSD text-overlay inversion/statistics configuration. |
| intr_config | Early-interrupt mode. |
| reserve | Reserved. |

priority and core are highly privileged settings. Incorrect use can crash or deadlock the system. Use them only for development/debugging; configuring them in production is strongly discouraged.

#### 4.2.4 im_job_handle_t

RGA job handle identifying the currently configured job.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef uint32_t im_job_handle_t;
```

If configuration fails, release the current job handle with imcancelJob to avoid memory leaks.

#### 4.2.5 rga_buffer_handle_t

RGA-driver image-buffer handle.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef int rga_buffer_handle_t;
```

After using the memory, release it with releasebuffer_handle to avoid memory leaks.

#### 4.2.6 im_handle_param_t

Description parameters of the image buffer to import.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_handle_param {
    uint32_t width;
    uint32_t height;
    uint32_t format;
} im_handle_param_t;
```

| Member parameter | Description |
| --- | --- |
| width_stride | Horizontal stride of the imported buffer, in pixels. |
| height_stride | Vertical stride of the imported buffer, in pixels. |
| format | Format of the image buffer to import. |

This structure describes the allocated buffer size. If the actual allocation is smaller than the configured size, importbuffer_T fails.

#### 4.2.7 im_nn_t

Parameters of NN preprocessing (quantization).

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_nn {
    int scale_r;                /* scaling factor on R channal */
    int scale_g;                /* scaling factor on G channal */
    int scale_b;                /* scaling factor on B channal */
    int offset_r;               /* offset on R channal */
    int offset_g;               /* offset on G channal */
    int offset_b;               /* offset on B channal */
} im_nn_t;
```

| Member parameter | Description |
| --- | --- |
| scale_r | red channel scale factor. |
| scale_g | green channel scale factor. |
| scale_b | blue channel scale factor. |
| offset_r | red channel offset. |
| offset_g | green channel offset. |
| offset_b | blue channel offset. |

Notes: none.

#### 4.2.8 im_colorkey_range

Color-key range.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct {
    int max;                    /* The Maximum value of the color key */
    int min;                    /* The minimum value of the color key */
} im_colorkey_range;
```

| Member parameter | Description |
| --- | --- |
| max | Maximum color-key value. |
| min | Minimum color-key value. |

Notes: none.

#### 4.2.9 im_osd_block_t

OSD text-block description configuration.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd_block {
    int width_mode;                 // normal or different
                                    //   IM_OSD_BLOCK_MODE_NORMAL
                                    //   IM_OSD_BLOCK_MODE_DIFFERENT
    union {
        int width;                  // normal_mode block width
        int width_index;            // different_mode block width index in RAM
    };

    int block_count;                // block count

    int background_config;          // background config is bright or dark
                                    //   IM_OSD_BACKGROUND_DEFAULT_BRIGHT
                                    //   IM_OSD_BACKGROUND_DEFAULT_DARK

    int direction;                  // osd block direction
                                    //   IM_OSD_MODE_HORIZONTAL
                                    //   IM_OSD_MODE_VERTICAL

    int color_mode;                 // using src1 color or config color
                                    //   IM_OSD_COLOR_PIXEL
                                    //   IM_OSD_COLOR_EXTERNAL
    im_color_t normal_color;        // config color: normal
    im_color_t invert_color;        // config color: invert
} im_osd_block_t;
```

| Member parameter | Description |
| --- | --- |
| width_mode | Block-width mode:<br>Equal widths: IM_OSD_BLOCK_MODE_NORMAL.<br>Unequal widths: IM_OSD_BLOCK_MODE_DIFFERENT. |
| width/width_index | width: used in equal-width block mode; gives the current task OSD block width.<br>width_index: used in unequal-width block mode; indexes the width configuration table currently used in internal RAM. |
| block_count | Number of text blocks |
| background_config | Text-background brightness:<br>Black text on white: IM_OSD_BACKGROUND_DEFAULT_BRIGHT.<br>White text on black: IM_OSD_BACKGROUND_DEFAULT_DARK. |
| direction | OSD direction:<br>Vertical: IM_OSD_MODE_VERTICAL.<br>Horizontal: IM_OSD_MODE_HORIZONTAL. |
| color_mode | OSD block-color mode:<br>Pixel color: IM_OSD_COLOR_PIXEL.<br>External color: IM_OSD_COLOR_EXTERNAL. |
| normal_color | Externally specified text-block color in normal (noninverted) state. |
| invert_color | Externally specified text-block color when inverted. |

Notes: none.

#### 4.2.10 im_osd_invert_factor_t

OSD color-inversion formula configuration.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd_invert_factor {
    uint8_t alpha_max;
    uint8_t alpha_min;
    uint8_t yg_max;
    uint8_t yg_min;
    uint8_t crb_max;
    uint8_t crb_min;
} im_osd_invert_factor_t;
```

Formula: `MAX(channel_min_factor, channel_max_factor - channel_value)`. Notes: none.

#### 4.2.11 im_osd_invert_t

OSD color-inversion configuration.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd_invert {
    int invert_channel;         // invert channel config:
                                //   IM_OSD_INVERT_CHANNEL_NONE
                                //   IM_OSD_INVERT_CHANNEL_Y_G
                                //   IM_OSD_INVERT_CHANNEL_C_RB
                                //   IM_OSD_INVERT_CHANNEL_ALPHA
                                //   IM_OSD_INVERT_CHANNEL_COLOR
                                //   IM_OSD_INVERT_CHANNEL_BOTH
    int flags_mode;             // use external or inertnal RAM invert flags
                                //   IM_OSD_FLAGS_EXTERNAL
                                //   IM_OSD_FLAGS_INTERNAL
    int flags_index;            // flags index when using internal RAM invert flags

    uint64_t invert_flags;      // external invert flags
    uint64_t current_flags;     // current flags

    int invert_mode;            // invert use swap or factor
                                //   IM_OSD_INVERT_USE_FACTOR
                                //   IM_OSD_INVERT_USE_SWAP
    im_osd_invert_factor_t factor;

    int threash;
} im_osd_invert_t;
```

| Member parameter | Description |
| --- | --- |
| invert_channel | Inverted channels:<br>None by default: IM_OSD_INVERT_CHANNEL_NONE.<br>Y/G: IM_OSD_INVERT_CHANNEL_Y_G.<br>C(UV)/RB: IM_OSD_INVERT_CHANNEL_C_RB.<br>Alpha: IM_OSD_INVERT_CHANNEL_ALPHA.<br>Color: IM_OSD_INVERT_CHANNEL_COLOR, i.e. (IM_OSD_INVERT_CHANNEL_Y_G &#124; IM_OSD_INVERT_CHANNEL_C_RB).<br>All: IM_OSD_INVERT_CHANNEL_BOTH, i.e. (IM_OSD_INVERT_CHANNEL_COLOR &#124; IM_OSD_INVERT_CHANNEL_ALPHA). |
| flags_mode | Inversion guidance mode (source assignments):<br>Internal guidance: IM_OSD_FLAGS_EXTERNAL, using inversion flags collected in internal RAM.<br>External guidance: IM_OSD_FLAGS_INTERNAL, using externally provided guidance. |
| flags_index | Index of the inversion-guidance flag table currently used in internal RAM. |
| invert_flags | 64-bit externally supplied inversion configuration table. |
| current_flags | 64-bit inversion configuration table collected by the current task; read after task completion. |
| invert_mode | Inversion mode:<br>Custom formula: IM_OSD_INVERT_USE_FACTOR.<br>Default formula: IM_OSD_INVERT_USE_SWAP; swap U and V for YUV, or R and B for RGB. |
| factor | Color-inversion formula. |
| threash | Inversion threshold. |

Notes: none.

#### 4.2.12 im_osd_bpp2_t

OSD BPP2-to-RGB format mapping configuration.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd_bpp2 {
    uint8_t  ac_swap;       // ac swap flag
                            // 0: CA
                            // 1: AC
    uint8_t  endian_swap;   // rgba2bpp endian swap
                            // 0: Big endian
                            // 1: Little endian
    im_color_t color0;
    im_color_t color1;
} im_osd_bpp2_t;
```

| Member parameter | Description |
| --- | --- |
| ac_swap | AC layout mode. |
| endian_swap | Endianness configuration. |
| color0 | Mapped color for color = 0. |
| color1 | Mapped color for color = 1. |

Notes: none.

#### 4.2.13 im_osd_t

OSD function configuration.

Path: `im2d_api/im2d_type.h`. Definition:

```text
typedef struct im_osd {

  int osd_mode;                 // osd mode: statistics or auto_invert
  im_osd_block_t block_parm;    // osd block info config
  im_osd_invert_t invert_config;
  im_osd_bpp2_t bpp2_info;
} im_osd_t;
```

| Member parameter | Description |
| --- | --- |
| osd_mode | OSD mode:<br>Statistics: IM_OSD_MODE_STATISTICS.<br>Inversion: IM_OSD_MODE_AUTO_INVERT. |
| block_parm | OSD block parameters. |
| invert_config | Color-inversion configuration. |
| bpp2_info | bpp2-rgb format configuration. |

Notes: none.

## 5. Test cases and debugging

Running the demo and examining its source code helps developers quickly understand and use the interfaces described above.

### 5.1 Test files

Prepare the test input/output binary files in advance. Default RGBA8888 source images in /sample/sample_file can be used directly. Store source images under /data/ on Android devices or /usr/data on Linux devices. File naming rules:

```text
in%dw%d-h%d-%s.bin
out%dw%d-h%d-%s.bin

⽰例：
1280×720 RGBA8888的输⼊图像： in0w1280-h720-rgba8888.bin
1280×720 RGBA8888的输出图像： out0w1280-h720-rgba8888.bin
```

Parameter meanings: input files use in and output files use out. The first %d is the file index, normally 0, distinguishing files with identical format and dimensions. The second %d is width, normally virtual width; the third is height, normally virtual height. The fourth %s is the format name. Common predefined test formats follow; other format strings are listed in rgaUtils.cpp.

| format(Android) | format(Linux) | name |
| --- | --- | --- |
| HAL_PIXEL_FORMAT_RGB_565 | RK_FORMAT_RGB_565 | "rgb565" |
| HAL_PIXEL_FORMAT_RGB_888 | RK_FORMAT_RGB_888 | "rgb888" |
| HAL_PIXEL_FORMAT_RGBA_8888 | RK_FORMAT_RGBA_8888 | "rgba8888" |
| HAL_PIXEL_FORMAT_RGBX_8888 | RK_FORMAT_RGBX_8888 | "rgbx8888" |
| HAL_PIXEL_FORMAT_BGRA_8888 | RK_FORMAT_BGRA_8888 | "bgra8888" |
| HAL_PIXEL_FORMAT_YCrCb_420_SP | RK_FORMAT_YCrCb_420_SP | "crcb420sp" |
| HAL_PIXEL_FORMAT_YCrCb_NV12 | RK_FORMAT_YCbCr_420_SP | "nv12" |
| HAL_PIXEL_FORMAT_YCrCb_NV12_VIDEO | / | "nv12" |
| HAL_PIXEL_FORMAT_YCrCb_NV12_10 | RK_FORMAT_YCbCr_420_SP_10B | "nv12_10" |

The default input is 1280x720 RGBA8888. Prepare in0w1280-h720-rgba8888.bin under /data or /usr/data. Composition additionally requires in1w1280-h720-rgba8888.bin in the same directory.

### 5.2 Debugging

The demo prints the following logs (image-copy example). Android log:

```text
# rgaImDemo --copy

librga:RGA_GET_VERSION:3.02,3.020000                    //RGA版本
ctx=0x7ba35c1520,ctx->rgaFd=3                           //RGA上下⽂
Start selecting mode
im2d copy ..                                            //RGA运⾏模式
GraphicBuffer check ok
GraphicBuffer check ok
lock buffer ok
open file ok                                            //src⽂件的状态，如果/data/⽬录下没有对应⽂件这⾥会报错
unlock buffer ok
lock buffer ok
unlock buffer ok
copying .... successfully                               //标志运⾏成功
open /data/out0w1280-h720-rgba8888.bin and write ok     //输出⽂件名以及⽬录
```

Linux log:

```text
# rgaImDemo --copy

librga:RGA_GET_VERSION:3.02,3.020000                    //RGA版本
ctx=0x2b070,ctx->rgaFd=3                                //RGA上下⽂
Rga built version:version:1.00
Start selecting mode
im2d copy ..                                            //RGA运⾏模式
open file                                               //src⽂件的状态，如果/usr/data/⽬录下没有对应⽂件这⾥会报错
copying .... Run successfully                           //标志运⾏成功
open /usr/data/out0w1280-h720-rgba8888.bin and write ok //输出⽂件名以及⽬录
```

For more detailed RGA logs on Android, enable RGA configuration logging using vendor.rga.log (sys.rga.log on Android 8 and earlier):

```text
setprop vendor.rga.log 1        打开RGA log打印
logcat -s librga                开启并过滤log打印
setprop vendor.rga.log 0        关闭RGA log打印
```

On Linux, set __DEBUG to 1 in core/NormalRgaContext.h and rebuild.

```text
#ifdef LINUX

-#define __DEBUG 0
+#define __DEBUG 1
```

Typical logs follow. They may be uploaded to RedMine for analysis by the relevant RK engineers. Android log:

```text
D librga  : <<<<-------- print rgaLog -------->>>>
D librga  : src->hnd = 0x0 , dst->hnd = 0x0
D librga  : srcFd = 11 , phyAddr = 0x0 , virAddr = 0x0
D librga  : dstFd = 15 , phyAddr = 0x0 , virAddr = 0x0
D librga  : srcBuf = 0x0 , dstBuf = 0x0
D librga  : blend = 0 , perpixelAlpha = 1
D librga  : scaleMode = 0 , stretch = 0;
D librga  : rgaVersion = 3.020000  , ditherEn =0
D librga  : srcMmuFlag = 1 , dstMmuFlag = 1 , rotateMode = 0
D librga  : <<<<-------- rgaReg -------->>>>
D librga  : render_mode=0 rotate_mode=0
D librga  : src:[b,0,e1000],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
D librga  : dst:[f,0,e1000],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
D librga  : pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0
D librga  : ROP:[0,0,0],LUT[0]
D librga  : color:[0,0,0,0,0]
D librga  : MMU:[1,0,80000521]
D librga  : mode[0,0,0,0]
```

Linux log:

```text
render_mode=0 rotate_mode=0
src:[0,a681a008,a68fb008],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
dst:[0,a6495008,a6576008],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0
ROP:[0,0,0],LUT[0]
color:[0,0,0,0,0]
MMU:[1,0,80000521]
mode[0,0,0,0,0]
gr_color_x [0, 0, 0]
gr_color_x [0, 0, 0]
```

### 5.3 Test cases

Tests are under sample/im2d_api_demo in the librga source tree. Developers can modify the demo configuration as needed; use defaults for the first run. Build procedures differ by platform: Android supports the mm command, while Linux generates the test executable in the same directory when building librga.so with CMake. Transfer the compiled executable to the device with adb, grant execute permission, run it and inspect the logs. Check that the output file matches expectations.

#### 5.3.1 Allocate image buffers

The demo provides Graphicbuffer and AHardwareBuffer buffers for RGA composition, selected by the USE_AHARDWAREBUFFER macro.

```text
⽬录：librga/samples/im2d_api_demo/Android.mk
（line +15）

ifeq (1,$(strip $(shell expr $(PLATFORM_SDK_VERSION) \> 25)))
/*USE_AHARDWAREBUFFER为1则使⽤AHardwareBuffer，为0使⽤Graphicbuffer*/
LOCAL_CFLAGS += -DUSE_AHARDWAREBUFFER=1
endif
```

##### 5.3.1.1 Graphicbuffer

Three functions mainly initialize Graphicbuffer, fill/clear it and populate rga_buffer_t.

```text
/*传⼊src/dst的宽、⾼、图像格式，初始化Graphicbuffer*/
src_buf = GraphicBuffer_Init(SRC_WIDTH, SRC_HEIGHT, SRC_FORMAT);
dst_buf = GraphicBuffer_Init(DST_WIDTH, DST_HEIGHT, DST_FORMAT);

/*通过枚举值FILL_BUFF/EMPTY_BUFF，执⾏填充/清空Graphicbuffer*/
GraphicBuffer_Fill(src_buf, FILL_BUFF, 0);
if(MODE == MODE_BLEND)
    GraphicBuffer_Fill(dst_buf, FILL_BUFF, 1);
else
    GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);

/*填充rga_buffer_t结构体:src、dst*/
src = wrapbuffer_GraphicBuffer(src_buf);
dst = wrapbuffer_GraphicBuffer(dst_buf);
```

##### 5.3.1.2 AHardwareBuffer

Three functions mainly initialize AHardwareBuffer, fill/clear it and populate rga_buffer_t.

```text
/*传⼊src/dst的宽、⾼、图像格式，初始化AHardwareBuffer*/
AHardwareBuffer_Init(SRC_WIDTH, SRC_HEIGHT, SRC_FORMAT, &src_buf);
AHardwareBuffer_Init(DST_WIDTH, DST_HEIGHT, DST_FORMAT, &dst_buf);

/*通过枚举值FILL_BUFF/EMPTY_BUFF，执⾏填充/清空AHardwareBuffer*/
AHardwareBuffer_Fill(&src_buf, FILL_BUFF, 0);
if(MODE == MODE_BLEND)
    AHardwareBuffer_Fill(&dst_buf, FILL_BUFF, 1);
else
    AHardwareBuffer_Fill(&dst_buf, EMPTY_BUFF, 1);

/*填充rga_buffer_t结构体:src、dst*/
src = wrapbuffer_AHardwareBuffer(src_buf);
dst = wrapbuffer_AHardwareBuffer(dst_buf);
```

#### 5.3.2 Display help

Use the following command to obtain test help.

```text
rgaImDemo -h
rgaImDemo --help
rgaImDemo
```

After successful execution, use the demo according to the displayed help:

```text
rk3399_Android10:/ # rgaImDemo
librga:RGA_GET_VERSION:3.02,3.020000
ctx=0x7864d7c520,ctx->rgaFd=3

=============================================================================================
   usage: rgaImDemo [--help/-h] [--while/-w=(time)] [--querystring/--querystring=<options>]
                    [--copy] [--resize=<up/down>] [--crop] [--rotate=90/180/270]
                    [--flip=H/V] [--translate] [--blend] [--cvtcolor]
                    [--fill=blue/green/red]
         --help/-h     Call help
         --while/w     Set the loop mode. Users can set the number of cycles by themselves.
         --querystring You can print the version or support information corresponding to the current version
of RGA according to the options.
                       If there is no input options, all versions and support information of the current
version of RGA will be printed.
                       <options>:
                       vendor           Print vendor information.
                       version          Print RGA version, and librga/im2d_api version.
                       maxinput         Print max input resolution.
                       maxoutput        Print max output resolution.
                       scalelimit       Print scale limit.
                       inputformat      Print supported input formats.
                       outputformat     Print supported output formats.
                       expected         Print expected performance.
                       all              Print all information.
         --copy        Copy the image by RGA.The default is 720p to 720p.
         --resize      resize the image by RGA.You can choose to up(720p->1080p) or down(720p->480p).
         --crop        Crop the image by RGA.By default, a picture of 300*300 size is cropped from (100,100).
         --rotate      Rotate the image by RGA.You can choose to rotate 90/180/270 degrees.

         --flip        Flip the image by RGA.You can choice of horizontal flip or vertical flip.
         --translate   Translate the image by RGA.Default translation (300,300).
         --blend       Blend the image by RGA.Default, Porter-Duff 'SRC over DST'.
         --cvtcolor    Modify the image format and color space by RGA.The default is RGBA8888 to NV12.
         --fill        Fill the image by RGA to blue, green, red, when you set the option to the corresponding
color.
=============================================================================================
```

All argument parsing is in /librga/demo/im2d_api_demo/args.cpp.

#### 5.3.3 Run the demo repeatedly

Use the following command to run the demo repeatedly. The loop command must precede all arguments. The iteration count is an int; the default interval is 200ms.

```text
rgaImDemo -w6 --copy
rgaImDemo --while=6 --copy
```

#### 5.3.4 Query RGA version and support

Use the following command to query version and support information:

```text
rgaImDemo --querystring
rgaImDemo --querystring=<options>
```

This command accepts options; omission defaults to =all. Available options:

```text
options：
    =vendor             打印⼚商信息
    =version            打印版本信息
    =maxinput           打印⽀持的最⼤输⼊分辨率
    =maxoutput          打印⽀持的最⼤输出分辨率
    =scalelimit         打印⽀持的缩放倍数
    =inputformat        打印⽀持的输⼊格式
    =outputformat       打印⽀持的输出格式
    =expected           打印预期性能
    =all                打印所有信息
```

##### 5.3.4.1 Code analysis

The arguments passed to main() select the information printed.

```text
/*将main()传参转化为QUERYSTRING_INFO枚举值*/
IM_INFO = (QUERYSTRING_INFO)parm_data[MODE_QUERYSTRING];
/*打印querystring()返回的字符串，即所需要的信息*/
printf("\n%s\n", querystring(IM_INFO));
```

#### 5.3.5 Image scaling

Use the following command to test image scaling.

```text
rgaImDemo --resize=up
rgaImDemo --resize=down
```

This function requires an option. Available options:

```text
options：
    =up                 图像分辨率放⼤⾄1920x1080
    =down               图像分辨率缩⼩⾄720x480
```

##### 5.3.5.1 Code analysis

The up/down argument to main() selects enlargement or reduction. Reinitialize and clear the buffer for the selected case, populate rga_buffer_t, then pass the final src and dst image descriptors to imresize().

```text
switch(parm_data[MODE_RESIZE])
{
    /*放⼤图像*/
    case IM_UP_SCALE :
        /*重新初始化Graphicbuffer为分辨率1920x1080对应⼤⼩*/
        dst_buf = GraphicBuffer_Init(1920, 1080, DST_FORMAT);
        /*清空buffer*/
        GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);
        /*重新填充存储dst数据的rga_buffer_t结构体*/
        dst = wrapbuffer_GraphicBuffer(dst_buf);
        break;

    case IM_DOWN_SCALE :
        /*重新初始化Graphicbuffer为分辨率1920x1080对应⼤⼩*/
        dst_buf = GraphicBuffer_Init(720, 480, DST_FORMAT);
        /*清空buffer*/
        GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);
        /*重新填充存储dst数据的rga_buffer_t结构体*/
        dst = wrapbuffer_GraphicBuffer(dst_buf);
        break;
}
/*将rga_buffer_t格式的结构体src、dst传⼊imresize()*/
STATUS = imresize(src, dst);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("resizing .... %s\n", imStrError(STATUS));
```

#### 5.3.6 Image cropping

Use the following command to test image cropping.

```text
rgaImDemo --crop
```

No options are available. By default, crop the region LT(100,100), RT(400,100), LB(100,400), RB(400,400).

##### 5.3.6.1 Code analysis

Assign the crop dimensions in the im_rect describing the src rectangle, then pass the rga_buffer_t structures holding src and dst to imcrop().

```text
/*这⾥通过x、y确定裁剪顶点的坐标，width、height确定裁剪区域⼤⼩*/
src_rect.x      = 100;
src_rect.y      = 100;
src_rect.width  = 300;
src_rect.height = 300;

/*将im_rect格式的结构体src_rect与rga_buffer_t格式的结构体src、dst传⼊imcrop()*/
STATUS = imcrop(src, dst, src_rect);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("cropping .... %s\n", imStrError(STATUS));
```

#### 5.3.7 Image rotation

Use the following command to test image rotation.

```text
rgaImDemo --rotate=90
rgaImDemo --rotate=180
rgaImDemo --rotate=270
```

This function requires an option. Available options:

```text
options：
    =90                 图像旋转90° ，输出图像分辨率宽⾼交换
    =180                图像旋转180°，输出图像分辨率不变
    =270                图像旋转270°，输出图像分辨率宽⾼交换
```

##### 5.3.7.1 Code analysis

The main() argument 90/180/270 selects the rotation angle. Convert it to an IM_USAGE enumeration value and pass it together with the src and dst rga_buffer_t structures to imrotate().

```text
/*将main()传参转化为IM_USAGE枚举值*/
ROTATE = (IM_USAGE)parm_data[MODE_ROTATE];

/*将标识旋转⻆度的IM_USAGE枚举值与rga_buffer_t格式的结构体src、dst⼀同传⼊imrotate()*/
STATUS = imrotate(src, dst, ROTATE);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("rotating .... %s\n", imStrError(STATUS));
```

#### 5.3.8 Image mirroring

Use the following command to test image mirroring.

```text
rgaImDemo --flip=H
rgaImDemo --flip=V
```

This function requires an option. Available options:

```text
options：
    =H                  图像⽔平镜像翻转
    =V                  图像垂直镜像翻转
```

##### 5.3.8.1 Code analysis

The main() argument H/V selects the mirror direction. Convert it to an IM_USAGE enumeration value and pass it together with the src and dst rga_buffer_t structures to imflip().

```text
/*将main()传参转化为IM_USAGE枚举值*/
FLIP = (IM_USAGE)parm_data[MODE_FLIP];

/*将标识镜像反转⽅向的IM_USAGE枚举值与rga_buffer_t格式的结构体src、dst⼀同传⼊imflip()*/
STATUS = imflip(src, dst, FLIP);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("flipping .... %s\n", imStrError(STATUS));
```

#### 5.3.9 Color filling

Use the following command to test color filling.

```text
rgaImDemo --fill=blue
rgaImDemo --fill=green
rgaImDemo --fill=red
```

An option is required. The default filled region is LT(100,100), RT(400,100), LB(100,400), RB(400,400). Available options:

```text
options：
    =blue               图像颜⾊填充为蓝⾊
    =green              图像颜⾊填充为绿⾊
    =red                图像颜⾊填充为红⾊
```

##### 5.3.9.1 Code analysis

The main() argument (bule/green/red, source spelling) selects the fill color. Set the fill dimensions in the im_rect describing dst, convert the argument to the hexadecimal color value, and pass it with the dst rga_buffer_t structure to imfill().

```text
/*将main()传参转化为对应颜⾊的16进制数*/
COLOR = parm_data[MODE_FILL];

/*这⾥通过x、y确定裁剪顶点的坐标，width、height确定填充颜⾊区域⼤⼩*/
dst_rect.x      = 100;
dst_rect.y      = 100;
dst_rect.width  = 300;
dst_rect.height = 300;

/*将im_rect格式的结构体dst_rect、对应颜⾊的16进制数与rga_buffer_t格式的结构体src、dst⼀同传⼊imfill()*/
STATUS = imfill(dst, dst_rect, COLOR);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("filling .... %s\n", imStrError(STATUS));
```

#### 5.3.10 Image translation

Use the following command to test image translation.

```text
rgaImDemo --translate
```

No options are available. The default top-left vertex is translated to (300,300): 300 pixels right and 300 pixels down.

##### 5.3.10.1 Code analysis

Set the translation offsets in the im_rect describing the src rectangle and pass the src and dst rga_buffer_t structures to imtranslate().

```text
/*这⾥通过x、y确定平移后图像的顶点的坐标*/
src_rect.x = 300;
src_rect.y = 300;

/*将im_rect格式的结构体src_rect与rga_buffer_t格式的结构体src、dst⼀同传⼊imtranslate()*/
STATUS = imtranslate(src, dst, src_rect.x, src_rect.y);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("translating .... %s\n", imStrError(STATUS));
```

#### 5.3.11 Image copying

Use the following command to test image copying.

```text
rgaImDemo --copy
```

No options are available. By default, copy a 1280x720 RGBA8888 image.

##### 5.3.11.1 Code analysis

Pass the rga_buffer_t structures holding src and dst image data to imcopy().

```text
/*rga_buffer_t格式的结构体src、dst传⼊imcopy()*/
STATUS = imcopy(src, dst);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("copying .... %s\n", imStrError(STATUS));
```

#### 5.3.12 Image composition

Use the following command to test image composition.

```text
rgaImDemo --blend
```

No options are available. The source states that the default composition mode is IM_ALPHA_BLEND_DST.

##### 5.3.12.1 Code analysis

Pass the rga_buffer_t structures holding src and dst image data to imblend().

```text
/*rga_buffer_t格式的结构体src、dst传⼊imblend()*/
STATUS = imblend(src, dst);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("blending .... %s\n", imStrError(STATUS));
```

#### 5.3.13 Image-format conversion

Use the following command to test image-format conversion.

```text
rgaImDemo --cvtcolor
```

No options are available. By default, convert a 1280x720 image from RGBA8888 to NV12.

##### 5.3.13.1 Code analysis

Set the required formats in the format members of rga_buffer_t, then pass the src and dst image structures to imcvtcolor().

```text
/*将转换前后的格式赋值给对应的rga_buffer_t结构体的成员变量format*/
src.format = HAL_PIXEL_FORMAT_RGBA_8888;
dst.format = HAL_PIXEL_FORMAT_YCrCb_NV12;

/*将需要转换的格式与rga_buffer_t格式的结构体src、dst⼀同传⼊imcvtcolor()*/
STATUS = imcvtcolor(src, dst, src.format, dst.format);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("cvtcolor .... %s\n", imStrError(STATUS));
```

## Source comparison: English original also labeled V2.2.7

The following English-source definitions differ from the Chinese source and are retained for traceability, not for mixing with earlier code. Verify against actual SDK headers, librga and driver versions. The English source omits the five OSD structures in Chinese §§4.2.9–4.2.13 and extended im_opt_t fields; these are fully included above.

§3.20.1 imfill: English uses buf, default color 0x00000000 and no release_fence_fd; Chinese uses dst, requires color and adds release_fence_fd.

```text
IM_STATUS imfill(rga_buffer_t buf,
                 im_rect rect,
                 int color = 0x00000000,
                 int sync = 1);
```

§4.2.3 im_opt_t: the shorter English structure omits Chinese fields version, mosaic_mode, osd_config, intr_config and reserve.

```text
typedef struct im_opt {
    int color;                          /* color, used by color fill */
    im_colorkey_range colorkey_range;   /* range value of color key */
    im_nn_t nn;
    int rop_code;

    int priority;
    int core;
} im_opt_t;
```

§4.2.6 im_handle_param_t: English uses rga_memory_parm and width_stride/height_stride; Chinese uses im_handle_param and width/height. English parameter descriptions likewise use width_stride/height_stride. Do not assume ABI equivalence.

```text
typedef struct rga_memory_parm im_handle_param_t;

struct rga_memory_parm {
    uint32_t width_stride;
    uint32_t height_stride;
    uint32_t format;
};
```

§3.8.1 imcopy: the English original has an extra closing parenthesis after sync = 1. The original is retained below as an issue; the earlier text uses the Chinese signature.

```text
IM_STATUS imcopy(const rga_buffer_t src,
                 rga_buffer_t dst,
                 int sync = 1),
                 int *release_fence_fd = NULL);
```

§3.15.1 imblend: English srcA/dst correspond to Chinese fg_image/bg_image; parameter names differ.

```text
IM_STATUS imblend(const rga_buffer_t srcA,
                  rga_buffer_t dst,
                  int mode = IM_ALPHA_BLEND_SRC_OVER,
                  int sync = 1,
                  int *release_fence_fd = NULL);
```

§3.15.1 imcomposite: English srcA/srcB/dst correspond to Chinese fg_image/bg_image/output_image.

```text
IM_STATUS imcomposite(const rga_buffer_t srcA,
                      const rga_buffer_t srcB,
                      rga_buffer_t dst,
                      int mode = IM_ALPHA_BLEND_SRC_OVER,
                      int sync = 1,
                      int *release_fence_fd = NULL);
```

{% endraw %}
