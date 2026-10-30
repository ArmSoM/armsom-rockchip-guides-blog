---
title: "Rockchip Android libhwjpeg：JPEG 硬件编解码接口"
description: "JPEG 硬件接口、同步异步解码、dmaBuffer 生命周期与完整原稿示例。"
excerpt: "JPEG 硬件接口、同步异步解码、dmaBuffer 生命周期与完整原稿示例。"
translation_key: "269-rockchip-android-libhwjpeg"
slug: "269-rockchip-android-libhwjpeg"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

## 适用范围与来源

本文完整整理中文 RK-SM-YF-E10 V1.0.0《Rockchip Android Libhwjpeg Interface》，作为平台参考。原稿列出 Linux 4.19、5.10，并称“适配所有芯片”；这是原稿表述，不代表所有 ArmSoM 板卡已经验证。使用前需确认 Android BSP 包含匹配的 MPP/libhwjpeg 实现和头文件。本文未进行 ArmSoM 硬件验证，也未执行示例。没有对应英文 PDF，原稿没有技术配图。

| 原稿芯片范围 | 内核版本 |
| --- | --- |
| 适配所有芯片（原文表述，需核对 BSP） | Linux-4.19、Linux-5.10 |

## 1 概述

libhwjpeg 库封装了 Rockchip 平台 MPP（Media Process Platform）库的 JPEG 编解码逻辑，提供 JPEG 硬件编解码能力。`MpiJpegEncoder` 封装硬编码接口，`MpiJpegDecoder` 封装硬解码接口，用于图片或 MJPEG 码流解码。主要目录：

- `inc`：libhwjpeg 头文件。
- `src`：libhwjpeg 实现代码。
- `test`：libhwjpeg 测试实例。

工程使用 `bp` 文件组织，可在 Android SDK 环境下直接编译使用。

## 2 MpiJpegDecoder

`MpiJpegDecoder` 封装平台 JPEG 硬解码，支持输入 JPG 图片及 MJPEG 码流，提供同步和异步两种解码方式。

```cpp
decodePacket(char* data, size_t size, OutputFrame_t *frameOut);
decodeFile(const char *inputFile, const char *outputFile);
```

`decodePacket` 和 `decodeFile` 为同步解码方式，使用简单，会阻塞等待解码输出。`OutputFrame_t` 封装输出帧宽、高、物理地址、虚拟地址等信息。

```cpp
sendpacket(char* data, size_t size);
getoutframe(OutputFrame_t *frameOut);
```

`sendpacket` 与 `getoutframe` 配合实现异步解码。应用端开启两个线程：一路通过 `sendpacket` 送入数据，另一路通过 `getoutframe` 异步获取输出。

### 解码注意事项

1. 默认输出 RAW NV12 数据。
2. 硬解码输出的 YUV 默认经过对齐。送显前需要根据 buffer 的虚宽、虚高裁剪出真实图像，否则可能出现绿边。libhwjpeg 可通过下方属性启用内部自裁剪。
3. `OutFrame` buffer 是解码输出 dmaBuffer 的封装，会在解码库内部循环使用。解码显示完成后使用 `deinitOutputFrame` 释放。
4. 默认使用内部申请的 buffer 轮转池，也允许外部传递 dmaBuffer fd，通过 `decodePacket` 参数中的 `OutputFrame_t->outputPhyAddr` 带入。

```sh
setprop hwjpeg_dec_debug 0x10
```

### 解码示例

```cpp
MpiJpegDecoder decoder;
MpiJpegDecoder::OutputFrame_t frameOut;

memset(&frameOut, 0, sizeof(frameOut));

err = decoder.prepareDecoder();
if (!err) {
    ALOGE("failed to prepare JPEG decoder");
    goto cleanUp;
}

err = decoder.decodePacket(data, size, &frameOut);
if (!err) {
    ALOGE("failed to decode packet");
    goto cleanUp;
}

/* TODO - Get diaplay for the frameOut.
 * - frame address: frameOut.MemVirAddr
 * - frame size: frameOut.OutputSize */

/* output buffer count within limits, so release frame buffer if one
frame has been display successfully. */
decoder.deinitOutputFrame(&frameOut);

decoder.flushBuffer();
```

## 3 MpiJpegEncoder

`MpiJpegEncoder` 封装平台 JPEG 硬编码，主要接口如下。

```cpp
encodeFrame(char *data, OutputPacket_t *packetOut);
encodeFile(const char *inputFile, const char *outputFile);
```

`encodeFrame` 和 `encodeFile` 为同步阻塞编码方式。`OutputPacket_t` 封装编码输出，包含输出数据的内存地址信息。

```cpp
encode(EncInInfo *inInfo, EncOutInfo *outInfo);
```

`encode` 接口是为 cameraHal 设计的编码方式，接收调用方传入的输入、输出 dmaBuffer fd，输出 JPEG 包含编码缩略图、APP1 EXIF 头等信息。

`OutputPacket_t` 的 buffer 在编码库内部循环使用，编码处理完成后使用 `deinitOutputPacket` 释放。

### 编码示例

```cpp
MpiJpegEncoder encoder;
MpiJpegEncoder::OutputPacket_t pktOut;

memset(&pktOut, 0, sizeof(pktOut));

err = encoder.prepareEncoder();
if (!err) {
    ALOGE("failed to prepare JPEG encoder");
    goto cleanUp;
}

err = encoder.updateEncodeCfg(
    720 /*width*/, 1080 /*height*/, MpiJpegEncoder::INPUT_FMT_YUV420SP);
if (!err) {
    ALOGE("failed to update encode config");
    goto cleanUp;
}

err = encoder.encodeFrame(data, &pktOut);
if (!err) {
    ALOGE("failed to encode packet");
    goto cleanUp;
}

/* TODO - Get diaplay for the PacketOut.
 * - Pakcet address: pktOut.data
 * - Pakcet size: pktOut.size */

/* output buffer count within limits, so release frame buffer if one
frame has been display successful. */
encoder.deinitOutputPacket(&pktOut);

encoder.flushBuffer();
```

## 原文待核对项

两段示例保留原稿的 `if (!err)` 和 `goto cleanUp`；摘录没有说明返回值约定，也没有定义清理标签。它们是原稿片段，不是可独立编译的完整程序。代码注释中的 `diaplay`、`Pakcet` 拼写保持原样。通过 `OutputFrame_t->outputPhyAddr` 传入 fd 的语义需结合实际 SDK 头文件核对，不能只按字段名推断。

官方参考：[Rockchip MPP](https://github.com/rockchip-linux/mpp)、[ArmSoM 文档](https://docs.armsom.org/)。

{% endraw %}
