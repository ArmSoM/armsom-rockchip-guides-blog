---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Platforms, headers and linking"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-overview-linking"
slug: "rknn-v250-runtime-api-overview-linking"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Platforms, headers and linking | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Platforms, headers and linking | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-overview-linking/"
---

## Platform scope and source

This article follows the RKNN V2.5.0 vendor PDF. Only the chips and interfaces listed in the source are in scope. For an ArmSoM board, check the SoC, NPU driver, Toolkit/Runtime, SDK/BSP and kernel versions first. No ArmSoM hardware validation has been performed; source examples and measurements are not ArmSoM test results.

## Series navigation

- [Platforms, headers and linking](/articles/rknn-v250-runtime-api-overview-linking/)
- [Memory ownership and general/zero-copy flows](/articles/rknn-v250-runtime-api-conventions-zero-copy/)
- [Device, context and initialization flags](/articles/rknn-v250-runtime-api-device-context/)
- [Model, tensor and dynamic shape queries](/articles/rknn-v250-runtime-api-query/)
- [Input, execution, output and dynamic shapes](/articles/rknn-v250-runtime-api-inference/)
- [Tensor memory allocation and synchronization](/articles/rknn-v250-runtime-api-tensor-memory/)
- [Matrix multiplication APIs and dynamic shapes](/articles/rknn-v250-runtime-api-matmul/)
- [Custom operator registration and attributes](/articles/rknn-v250-runtime-api-custom-operators/)
- [Status codes, tensors, memory and extension types](/articles/rknn-v250-runtime-api-types-common/)
- [Matrix multiplication structures](/articles/rknn-v250-runtime-api-types-matmul/)
- [Custom operator types and deprecated API migration](/articles/rknn-v250-runtime-api-types-custom-migration/)

{% raw %}

<!-- source EN p6 unit 0 -->

## 1. Reference Manual Overview

<!-- source EN p6 unit 1 -->

RKNN C API is the C language interfaces for RKNPU Runtime (runtime library). By using the RKNN C API, developers can use the computing power of the NPU to perform efficient RKNN model inference or matrix multiplication calculation tasks. This article explains each function, data structure and return code definition of RKNN C API.

<!-- source EN p6 unit 2 -->

### 1.1 Applicable Version

<!-- source EN p6 unit 3 -->

This document corresponds to RKNPU Runtime release version V2.5.0 (see Revision History). The interfaces described in this document are based on V2.5.0.

<!-- source EN p6 unit 4 -->

### 1.2 Supported Platforms

<!-- source EN p6 unit 5 -->

This document applies to the following hardware platforms:

<!-- source EN p6 unit 6 -->

RV1103

<!-- source EN p6 unit 7 -->

RV1103B

<!-- source EN p6 unit 8 -->

RV1106

<!-- source EN p6 unit 9 -->

RV1106B

<!-- source EN p6 unit 10 -->

RV1126B

<!-- source EN p6 unit 11 -->

RK2118

<!-- source EN p6 unit 12 -->

RK3562

<!-- source EN p6 unit 13 -->

RK3566 series

<!-- source EN p6 unit 14 -->

RK3568 series

<!-- source EN p6 unit 15 -->

RK3576 series

<!-- source EN p6 unit 16 -->

RK3588 series

<!-- source EN p6 unit 17 -->

### 1.3 Header Files and Runtime Library

<!-- source EN p6 unit 18 -->

According to different functional characteristics, the interface of RKNN C API can be divided into three parts. The corresponding relationships between the functions, data structure definitions and header files of each part are as follows:

<!-- source EN p6 unit 19 -->

1. “rknn_api.h” defines the basic interface and data structure for deploying the RKNN model.

<!-- source EN p6 unit 20 -->

2. “rknn_matmul_api.h” defines the matrix multiplication interface and data structure.

<!-- source EN p6 unit 21 -->

3. “rknn_custom_op.h” defines custom operator interface and data structure.

<!-- source EN p7 unit 22 -->

## 2. Compilation and Linking

<!-- source EN p7 unit 23 -->

When developers compile applications, they must include the header file where the interface function is located, and link to the corresponding RKNPU runtime library according to the hardware platform and system type used. The following describes the RKNN C API header files and runtime library files.

<!-- source EN p7 unit 24 -->

### 2.1 Linux

<!-- source EN p7 unit 25 -->

1. For the RK3562 , RK3566 series, RK3568 series, RK3576 series, RK3588 series and RV1126B hardware platforms, the RKNPU runtime library file is librknnrt.so in the `&lt;sdk_path&gt;`/rknpu2/runtime directory, where `&lt;sdk_path&gt;` is the path to the Rockchip NPU software development kit.

<!-- source EN p7 unit 26 -->

2. For RV1106/RV1103/RV1106B/RV1103B hardware platforms, the RKNPU runtime library file is librknnmrt.so in the `&lt;sdk_path&gt;`/rknpu2/runtime directory.

<!-- source EN p7 unit 27 -->

### 2.2 Android

<!-- source EN p7 unit 28 -->

There are two ways to call the RKNN API on the Android platform:

<!-- source EN p7 unit 29 -->

1) The application can link librknnrt.so directly.

<!-- source EN p7 unit 30 -->

2) Application link to librknn_api_android.so implemented by HIDL on Android platform.

<!-- source EN p7 unit 31 -->

Android devices that need to pass the CTS/VTS test need to use the RKNN API implemented based on the Android platform HIDL (librknn_api_android.so does not include matrix multiplication and custom operator functions). If the device does not need to pass the CTS/VTS test, it is recommended to use librknnrt.so directly (including matrix multiplication and custom operator functions). The link to each interface call process is shorter and can provide better performance.

<!-- source EN p7 unit 32 -->

The code for the RKNN API implemented using Android HIDL is located in the vendor/rockchip/hardware/interfaces/neuralnetworks directory of the RK3562/RK3566/RK3568/RK3576/RK3588 Android system SDK. After the Android system is compiled, a series of library files related to RKNPU will be generated (for application development, you only need to link and use librknn_api_android.so), as shown below:

<!-- source EN p7 unit 33 -->

```text
/vendor/lib/librknn_api_android.so
/vendor/lib/librknnhal_bridge.rockchip.so
/vendor/lib64/librknn_api_android.so
/vendor/lib64/librknnhal_bridge.rockchip.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0-adapter-helper.so
/vendor/lib64/hw/rockchip.hardware.neuralnetworks@1.0-impl.so
/vendor/bin/hw/rockchip.hardware.neuralnetworks@1.0-service
```

<!-- source EN p7 unit 34 -->

Alternatively, user can use the following command to recompile and generate the above library separately.

<!-- source EN p7 unit 35 -->

```c
mmm vendor/rockchip/hardware/interfaces/neuralnetworks/ -j8
```

<!-- source EN p7 unit 36 -->

### 2.3 RK2118 Platform

<!-- source EN p7 unit 37 -->

For the RK2118 hardware platform, the RKNPU runtime library file is located in the system SDK of the RK2118, please refer to the section "Prepare RK2118 SDK" in "RKNN3_RK2118_Quick_Start.pdf".

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
