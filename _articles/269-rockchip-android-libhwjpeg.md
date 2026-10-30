---
title: "Rockchip Android libhwjpeg: JPEG encoding and decoding"
description: "JPEG hardware APIs, synchronous and asynchronous decoding, dmaBuffer ownership and complete source examples."
excerpt: "JPEG hardware APIs, synchronous and asynchronous decoding, dmaBuffer ownership and complete source examples."
translation_key: "269-rockchip-android-libhwjpeg"
slug: "269-rockchip-android-libhwjpeg"
lang: "en"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

## Applicability and source

This platform reference preserves RK-SM-YF-E10 V1.0.0, the Chinese Rockchip Android Libhwjpeg Interface document. The source lists Linux 4.19 and 5.10 and says “all chips”; that wording is a source claim, not confirmation for every ArmSoM board. Confirm that your Android BSP includes the matching MPP/libhwjpeg implementation and headers. No ArmSoM hardware or code execution was tested for this article. No English PDF or technical figures were supplied.

| Source chip scope | Kernel versions |
| --- | --- |
| All chips (source wording; verify BSP applicability) | Linux-4.19, Linux-5.10 |

## 1 Overview

The libhwjpeg library supports hardware JPEG encoding and decoding on Rockchip platforms by wrapping the JPEG logic in MPP (Media Process Platform). `MpiJpegEncoder` wraps hardware encoding; `MpiJpegDecoder` wraps hardware decoding of images or MJPEG streams. The project directories are:

- `inc`: libhwjpeg headers.
- `src`: implementation.
- `test`: test examples.

The project uses `bp` build files and can be built directly in the Android SDK environment.

## 2 MpiJpegDecoder

`MpiJpegDecoder` wraps the platform JPEG hardware decoder and accepts JPG images or MJPEG streams, with synchronous and asynchronous decoding.

```cpp
decodePacket(char* data, size_t size, OutputFrame_t *frameOut);
decodeFile(const char *inputFile, const char *outputFile);
```

`decodePacket` and `decodeFile` are synchronous: they block until decoded output is available. `OutputFrame_t` wraps the output frame, including width, height, physical address and virtual address.

```cpp
sendpacket(char* data, size_t size);
getoutframe(OutputFrame_t *frameOut);
```

`sendpacket` and `getoutframe` cooperate for asynchronous decoding. Start two application threads: one sends input through `sendpacket`, while the other retrieves output asynchronously through `getoutframe`.

### Decoder notes

1. The default output is RAW NV12.
2. Hardware-decoded YUV output is aligned by default. Before display, crop the actual image using the buffer’s virtual width and height; otherwise green borders may appear. libhwjpeg provides internal cropping through the property below.
3. `OutFrame` buffers wrap output dmaBuffers and are reused internally. After displaying a decoded frame, release it with `deinitOutputFrame`.
4. Output normally uses an internally allocated rotating buffer pool. An external dmaBuffer fd is also accepted through `OutputFrame_t->outputPhyAddr` in the `decodePacket` arguments.

```sh
setprop hwjpeg_dec_debug 0x10
```

### Decoder example

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

`MpiJpegEncoder` wraps JPEG hardware encoding. Its principal interfaces follow.

```cpp
encodeFrame(char *data, OutputPacket_t *packetOut);
encodeFile(const char *inputFile, const char *outputFile);
```

`encodeFrame` and `encodeFile` encode synchronously and block. `OutputPacket_t` wraps the encoded output and its memory-address information.

```cpp
encode(EncInInfo *inInfo, EncOutInfo *outInfo);
```

The `encode` interface is designed for cameraHal. It accepts input and output dmaBuffer fds supplied by the caller. Its output JPEG contains an encoded thumbnail, an APP1 EXIF header and related information.

`OutputPacket_t` buffers are reused internally. After encoding is complete, release the output with `deinitOutputPacket`.

### Encoder example

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

## Source issues to verify

Both examples preserve the source’s `if (!err)` tests and `goto cleanUp`, even though the return-value convention and cleanup label are not defined in the excerpt. They are source excerpts, not complete standalone programs. The `diaplay` and `Pakcet` comment typos are retained. Verify the use of `OutputFrame_t->outputPhyAddr` to carry an fd against the actual SDK header; do not infer field semantics solely from its name.

Official reference: [Rockchip MPP](https://github.com/rockchip-linux/mpp), [ArmSoM documentation](https://docs.armsom.org/).

{% endraw %}
