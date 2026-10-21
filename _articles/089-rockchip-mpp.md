---
title: "Rockchip MPP Development Reference: Media Framework, Codec APIs, Memory and Debugging"
description: "Complete MPP V1.4.2 reference covering the framework, MPI, memory management, decoding, encoding, parameter tables, demos, builds and FAQ with original figures and code."
translation_key: "089-rockchip-mpp"
slug: "089-rockchip-mpp"
lang: "en"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "MPP", "MPI", "codec", "Linux"]
keywords: "ArmSoM Rockchip MPP MPI H.264 H.265"
excerpt: "Complete MPP V1.4.2 reference covering the framework, MPI, memory management, decoding, encoding, parameter tables, demos, builds and FAQ with original figures and code."
---

{% raw %}

# Rockchip MPP Development Reference: Media Framework, Codec APIs, Memory and Debugging

## ArmSoM applicability and source

This is a Rockchip platform reference, not an ArmSoM test report. The source is the MPP development guide V1.4.2: 53 Chinese pages and 57 English pages. Chinese follows the Chinese source; English follows the English source, fully translated into Russian and German. Chinese uses Chinese original figures; English, Russian and German use English original figures. The source SoC list, Android/Linux environments and feature scope are retained below, but no SDK/BSP and kernel combination is specified for a particular ArmSoM board. Verify codec hardware, kernel drivers, MPP version, format support and build environment. All logs, speeds, frame rates and memory figures are source examples; no code was executed and no hardware tests were performed.

Editorial caution: This preserves source examples, not a verified runnable correction. The source contains conflicting platform/format lists, suspicious enum punctuation and parameter descriptions; review the editorial notes and the actual SDK before copying commands or configuration.

[EDITORIAL-NOTES](/docs/rockchip-mpp/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)


<!-- source: EN PDF p6; unit 0 -->

## 1\. Introduction to MPP

<!-- source: EN PDF p6; unit 1 -->

### 1.1 Overview

<!-- source: EN PDF p6; unit 2 -->

Media Process Platform (MPP) provided by Rockchip is a general media processing software platform for Rockchip chip series. For applications the MPP platform shields the complex lower-level processing related to chips. Its purpose is to shield the differences between different chips and provide a unified media process interface (MPI) to users. The functions provided by MPP include:

<!-- source: EN PDF p6; unit 3 -->

video decoding

<!-- source: EN PDF p6; unit 4 -->

H.265/H.264/H.263/AV1/VP9/VP8/AVS2/AVS/AVS+ /MPEG-4/MPEG-2/MPEG-1/VC1/MJPEG

<!-- source: EN PDF p6; unit 5 -->

video encoding

<!-- source: EN PDF p6; unit 6 -->

H.265/H.264/VP8/MJPEG

<!-- source: EN PDF p6; unit 7 -->

video processing

<!-- source: EN PDF p6; unit 8 -->

Video copy, zoom, color space conversion, Field video de-interleaving (Deinterlace)

<!-- source: EN PDF p6; unit 9 -->

### 1.2 System framework

<!-- source: EN PDF p6; unit 10 -->

The hierarchical diagram of MPP platform in system architecture is shown below:

<!-- source: EN PDF p7; unit 11 -->

![Original technical figure, English PDF page 7](/docs/rockchip-mpp/assets/en-p007-figure-01.png)

<!-- source: EN PDF p7; unit 12 -->

Figure 1 MPP system framework

<!-- source: EN PDF p7; unit 13 -->

Hardware layer

<!-- source: EN PDF p7; unit 14 -->

Hardware layer is the hardware accelerator module of video encoding and decoding based on Rockchip platform, including vdpu, vepu, rkvdec, rkvenc and other different type hardware accelerators with different functions.

<!-- source: EN PDF p7; unit 15 -->

Kernel driver layer

<!-- source: EN PDF p7; unit 16 -->

Linux kernel codec hardware driver contains device driver and related MMU, memory, clock, power management module. The supported platforms are mainly Linux kernel version 3.10, 4.4, 4.19, 5.10 and 6.1. MPP libraries depend on kernel drivers.

<!-- source: EN PDF p7; unit 17 -->

MPP layer

<!-- source: EN PDF p7; unit 18 -->

Userspace MPP layer shields the differences between different operating systems and different chip platforms, and provides a unified MPI interface for upper users. MPP layer includes MPI module, OSAL module, HAL module, Video Decoder / Video Encoder and Video Processing module.

<!-- source: EN PDF p7; unit 19 -->

Operating system layer

<!-- source: EN PDF p7; unit 20 -->

MPP userspace operating platforms, Linux distributions such as Android and Debian

<!-- source: EN PDF p7; unit 21 -->

Application layer

<!-- source: EN PDF p7; unit 22 -->

MPP layer can adapt to various middleware by MPI, such as OpenMax, ffmpeg and gstreamer, or directly be called by the upper application of customers.

<!-- source: EN PDF p8; unit 23 -->

### 1.3 Supported platform

<!-- source: EN PDF p8; unit 24 -->

#### 1.3.1 Software platform

<!-- source: EN PDF p8; unit 25 -->

MPP supports running on different versions of Android platforms and pure Linux platforms.

<!-- source: EN PDF p8; unit 26 -->

It supports Rockchip 3.10, 4.4, 4.19 and 5.10 Linux kernels with vcodec_service device driver and corresponding DTS configuration as requirement.

<!-- source: EN PDF p8; unit 27 -->

#### 1.3.2 Hardware platform

<!-- source: EN PDF p8; unit 28 -->

Support different series of Rockchip mainstream chip platforms:

<!-- source: EN PDF p8; unit 29 -->

RK3288 series,RK3368 series,RK3399 series,RK3588 series

<!-- source: EN PDF p8; unit 30 -->

RK30xx series,RK312x series,RK322x series,RK332x series

<!-- source: EN PDF p8; unit 31 -->

RV1109/ RV1126 series(Note: RV1107/RV1108 will gradually not support anymore)

<!-- source: EN PDF p8; unit 32 -->

### 1.4 Supported function

<!-- source: EN PDF p8; unit 33 -->

There are a lot of great differences when MPP encoding and decoding function is running on the different chip platforms. Please refer to the Multimedia Benchmark of the corresponding chip.

<!-- source: EN PDF p8; unit 34 -->

### 1.5 Attentions

<!-- source: EN PDF p8; unit 35 -->

If you want to quickly understand MPP usage and demo please go to Chapter 4 MPP demo instruction.

<!-- source: EN PDF p8; unit 36 -->

If you want to compile and use MPP code quickly, please go to Chapter 5 compilation and use MPP library For detail MPP design and design principle, please refer to readme.txt in the MPP code root directory, txt documents in doc directory and annotations of header files.

<!-- source: EN PDF p8; unit 37 -->

## 2\. Interface design instruction

<!-- source: EN PDF p8; unit 38 -->

This chapter describes the data structure that directly exposed to users in the process of using MPP and the usage instruction of the data structures.

<!-- source: EN PDF p8; unit 39 -->

Because video encoding, decoding and video processing process need to deal with a large number of data interaction, including bitstream data, image data and memory data and also deal with the cross-relationship between upper application and kernel driver MPP designed MPI interface for interaction with the upper layer. This chapter explains the data structure used in MPI interface and design principle.

<!-- source: EN PDF p9; unit 40 -->

### 2.1 Interface structure overview

<!-- source: EN PDF p9; unit 41 -->

The following figure shows the main data structures used by the MPI interface:

<!-- source: EN PDF p9; unit 42 -->

![Original technical figure, English PDF page 9](/docs/rockchip-mpp/assets/en-p009-figure-01.png)

<!-- source: EN PDF p9; unit 43 -->

Figure 2 Data structure used in MPI interface

<!-- source: EN PDF p9; unit 44 -->

MppMem is the encapsulation of malloc memory in library C.

<!-- source: EN PDF p9; unit 45 -->

MppBuffer is the encapsulation of dmabuf memory for hardware.

<!-- source: EN PDF p9; unit 46 -->

MppPacket is a one-dimensional buffer encapsulation, which can be generated from MppMem and MapBuffer. It is mainly used to represent bitstream data.

<!-- source: EN PDF p9; unit 47 -->

MppFrame is a two-dimensional frame data encapsulation, which can be generated from MppMem and MapBuffer. It is mainly used to represent image data.

<!-- source: EN PDF p9; unit 48 -->

Using MppPacket and MapFrame the general video encoding and decoding can be accomplished simply and effectively.

<!-- source: EN PDF p9; unit 49 -->

Taking video decoding for example, bitstream at input side assigns the address and size to MppPacket. Input through the put_packet interface, and then get the input image MppFrame through the get_frame interface at the output side. It completes the simplest video decoding process.

<!-- source: EN PDF p10; unit 50 -->

![Original technical figure, English PDF page 10](/docs/rockchip-mpp/assets/en-p010-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
Input thread:

Allocate input stream memory;
Initialize MppPacket pkt;

While (!EOF) {
    Read file to pkt;
    Setup pkt valid length;
    Setup pkt EOS flag;

RESEND_PKT:
    ret = decode_put_packet(pkt);
    IF (ret == NOT_OK)
        Wait and goto RESEND_PKT;
}
Deinitialize pkt;
Release input stream memory;

Output thread:

MppFrame frm;

While (!EOS) {
    ret = decode_get_frame(&frm);
    IF (ret == OK && frm != NULL) {
        Write frm to file or display frm;
        Read EOS flag from frm;
        Release frm;
    }
}
```

<!-- source: EN PDF p10; unit 51 -->

Figure 3 Use simple interface to realize video decoding

<!-- source: EN PDF p10; unit 52 -->

MppMeta and MPTask are advanced combination interfaces for input and output tasks which can support complex usage modes such as specified input and output modes. It is occasionally used.

<!-- source: EN PDF p10; unit 53 -->

Note: The above interface data structures are all referenced using void*handle in order to facilitate extension and forward compatibility. The members mentioned in this paragraph are accessed through interfaces such as mpp_xxx_set/get_xxx.

<!-- source: EN PDF p10; unit 54 -->

### 2.2 Memory structure(MppBuffer)

<!-- source: EN PDF p10; unit 55 -->

MppBuffer is mainly used to describe memory blocks for hardware. It provides functions such as memory block allocate and release, reference counter increase and decrease. So far ion/drm allocators are supported. Several important parameters are listed as follows:

<!-- source: EN PDF p10; unit 56 -->

| Parameter name | Parameter type | Description |
| --- | --- | --- |
| ptr | void * | Represents virtual address of memory block. |
| size | size_t | Represents size of memory block. |
| fd | int | Represents userspace file handler of memory block. |

<!-- source: EN PDF p10; unit 57 -->

In decoding process the decoded picture buffer usually needs to be recycled in a fixed buffer pool. To achieve this behavior MPP defines MppBufferGroup based on MppBuffer. There are two ways to use them as follows:

<!-- source: EN PDF p11; unit 58 -->

![Original technical figure, English PDF page 11](/docs/rockchip-mpp/assets/en-p011-figure-01.png)

<!-- source: EN PDF p11; unit 59 -->

Figure 4 Normal usage of MppBuffer

<!-- source: EN PDF p11; unit 60 -->

The procedure pseudo code is shown as follows:

<!-- source: EN PDF p11; unit 61 -->

![Original technical figure, English PDF page 11](/docs/rockchip-mpp/assets/en-p011-figure-02.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
MppBuffer normal usage

MppBufferGroup group = NULL;

// Acquire buffer pool and limit buffer size and buffer count
mpp_buffer_group_get_internal(&group, type);
mpp_buffer_group_limit_config(group, size, count);

// Configure buffer pool to decoder, let decoder get buffer from
// buffer pool to decode.
mpi->control(dec, MPP_DEC_SET_EXT_BUF_GROUP, group);

// Start decoding process
while (!end_of_decoding) {
    {   // MPP decoder behave is within brackets.
        // MPP decoder uses buffer data.
        MppBuffer buffer_in_mpp_decoder;
        // Decoder get buffer from buffer pool internally.
        mpp_buffer_get(group, &buffer_in_mpp_decoder);
        // Decode image data to buffer.
        ...
    }
    mpi->decode_get_frame(&frame);
    // Output MppBuffer to external user
    MppBuffer buffer_of_user = mpp_frame_get_buffer(frame);
    // Process to image pixel data
    ......
    // User release reference of MppBuffer and MppFrame
    mpp_buffer_put(buffer_of_user);
    mpp_frame_deinit(frame);
}

// Release buffer pool
mpp_buffer_group_put(group);
```

<!-- source: EN PDF p12; unit 62 -->

This method can implement decoder zero-copy output in decoding process (the output frame of decoder is the same as the reference frame used in decoder). But it is not easy to implement zero-copy display (the output frame of decoder may not be displayed directly on the display side). At the same time users are required to know the memory space requirement of the decoder.

<!-- source: EN PDF p12; unit 63 -->

Another way to use MppBufferGroup is to use it as a buffer manager only to manage external imported buffers. Its usage is shown as follows:

<!-- source: EN PDF p12; unit 64 -->

![Original technical figure, English PDF page 12](/docs/rockchip-mpp/assets/en-p012-figure-01.png)

<!-- source: EN PDF p12; unit 65 -->

Figure 5 Usage of MppBuffer External Import

<!-- source: EN PDF p12; unit 66 -->

The procedure pseudo code is shown as follows:

<!-- source: EN PDF p13; unit 67 -->

![Original technical figure, English PDF page 13](/docs/rockchip-mpp/assets/en-p013-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
MppBuffer usage of import external buffer (Zero-copy display)

MppBufferGroup group = NULL;
MppBufferInfo info[16];

// Acquire the buffer pool.
mpp_buffer_group_get_external(&group, type);

// import extern buffer to the buffer pool
mpp_buffer_commit(group, &info[0]);
mpp_buffer_commit(group, &info[1]);
...
...

// Configure buffer pool to decoder let decoder get buffer to
// decode from buffer pool
mpi->control(dec, MPP_DEC_SET_EXT_BUF_GROUP, group);

// Start decoding procedural.
while (!end_of_decoding) {
    {   // MPP decoder behave is within brackets.
        // MPP decoder uses buffer data.
        MppBuffer buffer_in_mpp_decoder;
        // Decoder get buffer from buffer pool internally.
        mpp_buffer_get(group, &buffer_in_mpp_decoder);
        // Decode image data to buffer.
        ...
    }
    mpi->decode_get_frame(&frame);
    // Output MppBuffer to external user
    MppBuffer buffer_of_user = mpp_frame_get_buffer(frame);
    // Process to image pixel data
    ......
    // User release reference of MppBuffer and MppFrame
    mpp_buffer_put(buffer_of_user);
    mpp_frame_deinit(frame);
}

// Release buffer pool
mpp_buffer_group_put(group);
```

<!-- source: EN PDF p13; unit 68 -->

This procedure can enable decoder to use external buffer, adapt to middleware such as OpenMax/ffmpeg/ gstreamer, easy to adapt to user upper application. It's also easy to implement zero-copy display.

<!-- source: EN PDF p13; unit 69 -->

### 2.3 Bitstream structure(MppPacket)

<!-- source: EN PDF p13; unit 70 -->

MppPacket is mainly used to describe the related information of one-dimensional bitstream data, especially the location and length of valid data. Several important parameters of MppPacket are listed below:

<!-- source: EN PDF p14; unit 71 -->

| Parameter name | Parameter type | Description |
| --- | --- | --- |
| data | void * | Represents start address of the buffer space. |
| size | size_t | Represents size of the buffer space. |
| pos | void * | Represents start address of valid data in the buffer space. |
| length | size_t | Represents length of valid data in the buffer space.<br>If the length changes to 0 after the decode_put_packet<br>call the packet stream is consumed. |

<!-- source: EN PDF p14; unit 72 -->

Their relationship is shown below:

<!-- source: EN PDF p14; unit 73 -->

![Original technical figure, English PDF page 14](/docs/rockchip-mpp/assets/en-p014-figure-01.png)

<!-- source: EN PDF p14; unit 74 -->

Figure 6 Important parameter description of MppPacket

<!-- source: EN PDF p14; unit 75 -->

The other configuration parameters of MppPacket are listed as follows:

<!-- source: EN PDF p14; unit 76 -->

| Parameter name | Parameter type | Description |
| --- | --- | --- |
| pts | RK_U64 | Represents display time stamp(Present Time Stamp) |
| dts | RK_U64 | Represents decoding time stamp(Decoding Time Stamp) |
| eos | RK_U32 | Represents end of stream flag(End Of Stream) |
| buffer | MppBuffer | Represents MppBuffer associated with MppPacket |
| flag | RK_U32 | Represents the flag bits used within MPP, including the<br>following flag:<br>#define MPP_PACKET_FLAG_EOS (0x00000001)<br>#define MPP_PACKET_FLAG_EXTRA_DATA (0x00000002)<br>#define MPP_PACKET_FLAG_INTERNAL (0x00000004)<br>#define MPP_PACKET_FLAG_INTRA (0x00000008) |

<!-- source: EN PDF p14; unit 77 -->

MppPacket, as a structure describing one-dimensional memory, needs to be initialized using allocated memory or MppBuffer memory. There are several situations when releasing MppPacket:

<!-- source: EN PDF p14; unit 78 -->

If the external malloc address is configured to MppPacket,the memory will not be released. As shown in the following example.

<!-- source: EN PDF p15; unit 79 -->

![Original technical figure, English PDF page 15](/docs/rockchip-mpp/assets/en-p015-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
void *data = malloc(size);
MppPacket pkt = NULL;

mpp_packet_init(&pkt, data, size);
mpp_packet_deinit(&pkt); // <<-- NOT release data

free(data);
```

<!-- source: EN PDF p15; unit 80 -->

If the MppPacket is generated by copy_init, the memory allocated during the copying process will be released after the copy is completed. As shown in the following example.

<!-- source: EN PDF p15; unit 81 -->

![Original technical figure, English PDF page 15](/docs/rockchip-mpp/assets/en-p015-figure-02.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
void *data = malloc(size);
MppPacket pkt = NULL;
MppPacket pkt_copy = NULL;

mpp_packet_init(&pkt, data, size);
mpp_packet_copy_init(&pkt_copy, pkt);

mpp_packet_deinit(&pkt); // <<-- NOT release data
mpp_packet_deinit(&pkt_copy); // <<-- release allocated memory

free(data);
```

<!-- source: EN PDF p15; unit 82 -->

If MppPacket is generated from MppBuffer, MppBuffer is referenced at the time of MppPacket creation and dereferenced at the time of MppPacket releasing.

<!-- source: EN PDF p15; unit 83 -->

![Original technical figure, English PDF page 15](/docs/rockchip-mpp/assets/en-p015-figure-03.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
MppBuffer buffer;
MppPacket pkt = NULL;

mpp_buffer_get(NULL, &buffer, size);

mpp_packet_init_with_buffer(&pkt, buffer); // <<-- Auto increase reference

mpp_packet_deinit(&pkt); // <<-- Auto decrease reference
mpp_buffer_put(buffer);
```

<!-- source: EN PDF p15; unit 84 -->

### 2.4 Image structure(MppFrame)

<!-- source: EN PDF p15; unit 85 -->

MppFrame is mainly used to define the related information of two-dimensional image buffer, the location and length of valid data. Several important parameters of the MppFrame are listed below:

<!-- source: EN PDF p16; unit 86 -->

| Parameter name | Parameter type | Description |
| --- | --- | --- |
| width | RK_U32 | Represents the number of pixels in horizontal direction,<br>in units of pixels. |
| height | RK_U32 | Represents the number of pixels in vertical direction,<br>in units of pixels. |
| hor_stride | RK_U32 | Represents the distance between two adjacent rows<br>in vertical direction, in units of bytes. |
| ver_stride | RK_U32 | Represents the number of row spacing between<br>image components, in units of 1. |

<!-- source: EN PDF p16; unit 87 -->

![Original technical figure, English PDF page 16](/docs/rockchip-mpp/assets/en-p016-figure-01.png)

<!-- source: EN PDF p16; unit 88 -->

Figure 7 Important parameter description of MppFrame

<!-- source: EN PDF p16; unit 89 -->

The other configuration parameters of MppFrame are listed below:

<!-- source: EN PDF p17; unit 90 -->

| Parameter<br>name | Parameter<br>type | Description |
| --- | --- | --- |
| mode | RK_U32 | Represents image data frame field properties: |
| pts | RK_U64 | Represents display time stamp of image<br>(Present Time Stamp) |
| dts | RK_U64 | Represents Image decoding time stamp<br>(Decoding Time Stamp) |
| eos | RK_U32 | Represents the end stream flag of image<br>(End Of Stream) |
| errinfo | RK_U32 | Represents the image error flag, whether<br>there is decoding error in the image. |
| discard | RK_U32 | Represents the discarding mark of the image. If the<br>reference relation of image decoding does not satisfy the<br>requirement the frame image will be marked as needing to<br>be discarded and not to be displayed. |
| buf_size | size_t | Represents the size of the buffer that the image needs to<br>allocate, which is related to the format of the image and the<br>format of the decoded data. |
| info_change | RK_U32 | If true it represents that the current MppFrame is a<br>descriptive structure for marking changes in bitstream<br>information, indicating changes on width, height, stride or<br>the image format. Possible reasons for info_change are:<br>1. Change of image sequence width and height.<br>2. Image sequence format changes, for example 8 bit to 10<br>bit.<br>Once info_change is generated the memory pool used by<br>the decoder needs to be reallocated. |

<!-- source: EN PDF p17; unit 91 -->

![Original technical figure, English PDF page 17](/docs/rockchip-mpp/assets/en-p017-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
/*
 * bit definition for mode flag in MppFrame
 */
/* progressive frame */
#define MPP_FRAME_FLAG_FRAME          (0x00000000)
/* top field only */
#define MPP_FRAME_FLAG_TOP_FIELD      (0x00000001)
/* bottom field only */
#define MPP_FRAME_FLAG_BOT_FIELD      (0x00000002)
/* paired field */
#define MPP_FRAME_FLAG_PAIRED_FIELD   (MPP_FRAME_FLAG_TOP_FIELD|MPP_FRAME_FLAG_BOT_FIELD)
/* paired field with field order of top first */
#define MPP_FRAME_FLAG_TOP_FIRST      (0x00000004)
/* paired field with field order of bottom first */
#define MPP_FRAME_FLAG_BOT_FIRST      (0x00000008)
/* paired field with unknown field order (MBAFF) */
#define MPP_FRAME_FLAG_DEINTERLACED    (MPP_FRAME_FLAG_TOP_FIRST|MPP_FRAME_FLAG_BOT_FIRST)
#define MPP_FRAME_FLAG_FIELD_ORDER_MASK (0x0000000C)
// for multi-view stream
#define MPP_FRAME_FLAG_VIEW_ID_MASK   (0x000000f0)
```

<!-- source: EN PDF p18; unit 92 -->

| Parameter<br>name | Parameter<br>type | Description |
| --- | --- | --- |
| fmt | MppFrameFormat | Represents image color space format and memory<br>arrangement: |
| color_range | MppFrameColorRange | Represents the color space range of image data:<br>YUV full range:0 ~ 255(8bit)<br>YUV limit range:16 ~ 235(8bit) |
| buffer | MppBuffer | Represents the MppBuffer corresponding to the MppFrame. |

<!-- source: EN PDF p18; unit 93 -->

![Original technical figure, English PDF page 18](/docs/rockchip-mpp/assets/en-p018-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
typedef enum {
    MPP_FMT_YUV420SP       = MPP_FRAME_FMT_YUV,       /* YYYY... UV... (NV12)    */
    /*
     * A rockchip specific pixel format, without gap between pixel against
     * the P010_10LE/P010_10BE
     */
    MPP_FMT_YUV420SP_10BIT,
    MPP_FMT_YUV422SP,                                 /* YYYY... UVUV... (NV24)  */
    MPP_FMT_YUV422SP_10BIT,                            ///< Not part of ABI
    MPP_FMT_YUV420P,                                  /* YYYY... U...V... (I420) */
    MPP_FMT_YUV420SP_VU,                               /* YYYY... VUVUVU... (NV21) */
    MPP_FMT_YUV422P,                                  /* YYYY... UU...VV... (422P) */
    MPP_FMT_YUV422SP_VU,                               /* YYYY... VUVUVU... (NV42) */
    MPP_FMT_YUV422_YUYV,                               /* YUYVYUYV... (YUY2)      */
    MPP_FMT_YUV422_UYVY,                               /* UYVYUYVY... (UYVY)      */
    MPP_FMT_YUV400SP,                                  /* YYYY...                 */
    MPP_FMT_YUV440SP,                                  /* YYYY... UVUV...         */
    MPP_FMT_YUV411SP,                                  /* YYYY... UV...           */
    MPP_FMT_YUV444SP,                                  /* YYYY... UVUVUVUV...     */
    MPP_FMT_YUV_BUTT,
    MPP_FMT_RGB565        = MPP_FRAME_FMT_RGB,         /* 16-bit RGB              */
    MPP_FMT_BGR565,                                    /* 16-bit RGB              */
    MPP_FMT_RGB555,                                    /* 15-bit RGB              */
    MPP_FMT_BGR555,                                    /* 15-bit RGB              */
    MPP_FMT_RGB444,                                    /* 12-bit RGB              */
    MPP_FMT_BGR444,                                    /* 12-bit RGB              */
    MPP_FMT_RGB888,                                    /* 24-bit RGB              */
    MPP_FMT_BGR888,                                    /* 24-bit RGB              */
    MPP_FMT_RGB101010,                                 /* 30-bit RGB              */
    MPP_FMT_BGR101010,                                 /* 30-bit RGB              */
    MPP_FMT_ARGB8888,                                  /* 32-bit RGB              */
    MPP_FMT_ABGR8888,                                  /* 32-bit RGB              */
    MPP_FMT_RGB_BUTT,
    /* similar to I420, but Pixels are grouped in macroblocks of 8x4 size */
    MPP_FMT_YUV420_8Z4    = MPP_FRAME_FMT_COMPLEX,
    /* The end of these formats have a complex layout */
    MPP_FMT_COMPLEX_BUTT,
    MPP_FMT_BUTT         = MPP_FMT_COMPLEX_BUTT,
} ? end MppFrameFormat ? MppFrameFormat;
```

<!-- source: EN PDF p18; unit 94 -->

![Original technical figure, English PDF page 18](/docs/rockchip-mpp/assets/en-p018-figure-02.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
/*
 * MPEG vs JPEG YUV range.
 */
typedef enum {
    MPP_FRAME_RANGE_UNSPECIFIED = 0,
    MPP_FRAME_RANGE_MPEG        = 1,    ///< the normal 219*2^(n-8) "MPEG" YUV ranges
    MPP_FRAME_RANGE_JPEG        = 2,    ///< the normal     2^n-1   "JPEG" YUV ranges
    MPP_FRAME_RANGE_NB,                ///< Not part of ABI
} MppFrameColorRange;
```

<!-- source: EN PDF p18; unit 95 -->

For the decoder the MppFrame is its output information structure. The decoded information (including pixel data, pts, error information and other related information) of the bitstream needs to be brought to the caller within MppFrame structure. The PTS / DTS and EOS flags in the MppFrame are inherited from the corresponding input MppPacket.

<!-- source: EN PDF p18; unit 96 -->

Meanwhile once the resolution of input stream is changed the info_change flag in MppFrame will be set and info_change event will be notified to user who is required to modify the buffer pool.

<!-- source: EN PDF p18; unit 97 -->

### 2.5 Advanced task structure (MppTask)

<!-- source: EN PDF p18; unit 98 -->

When the interface between MppPacket and MppFrame cannot fulfill user's requirements it is necessary to use MppTask as a data container to fulfill more complex input and output requirements. MppTask needs to be used in conjunction with poll/dequeuer/enqueue interface. Compared with simple process interfaces such as put_packet/get_frame, MppTask has complex process and low efficiency which is the cost of fulfilling complex requirements.

<!-- source: EN PDF p19; unit 99 -->

![Original technical figure, English PDF page 19](/docs/rockchip-mpp/assets/en-p019-figure-01.png)

<!-- source: EN PDF p19; unit 100 -->

Figure 8 Use MppTask for input and output

<!-- source: EN PDF p19; unit 101 -->

MppTask is a structure which can be extended by keyword value (MppMetaKey) and support complex high- level requirements by extending the supported data types. Different keyword data in MppTask can be accessed using mpp_task_meta_set/get_xxx series interface.

<!-- source: EN PDF p19; unit 102 -->

![Original technical figure, English PDF page 19](/docs/rockchip-mpp/assets/en-p019-figure-02.png)

<!-- source: EN PDF p19; unit 103 -->

Figure 9 Data Types and Keyword Types Supported by MppTask

<!-- source: EN PDF p19; unit 104 -->

In practical usage we need to get MppTask from the input port of MPP by dequeue interface. Configure data to MppTask through mpp_task_meta_set_xxx series interface, and then enqueue to MPP instance for processing. The output port workflow of MPP is similar. But need to replace the serial interfaces of mpp_task_meta_set_xxx with the serial interfaces of mpp_task_meta_get_xxx to obtain data from MppTask.

<!-- source: EN PDF p19; unit 105 -->

At present the practical encoder interface and MJPEG decoding interface are implemented with MppTask.

<!-- source: EN PDF p20; unit 106 -->

### 2.6 Instance context structure(MppCtx)

<!-- source: EN PDF p20; unit 107 -->

MppCtx is the MPP instance context handle provided to user as decoder or encoder. Users can create MppCtx instance and MppApi structure by mpp_create function, initialize type of encoding or decoding and format by mpp_init function, and then access context by decode_xxx/encode_xx or poll/dequeuer/enqueue function. Finally destroy it by mpp_destroy function at the end of use.

<!-- source: EN PDF p20; unit 108 -->

![Original technical figure, English PDF page 20](/docs/rockchip-mpp/assets/en-p020-figure-01.png)

<!-- source: EN PDF p20; unit 109 -->

Figure 10 MppCtx usage process

<!-- source: EN PDF p20; unit 110 -->

### 2.7 API structure MppApi(MPI)

<!-- source: EN PDF p20; unit 111 -->

The MppApi structure encapsulates the API of MPP. User implements the video codec function by using the function pointer provided in the MppApi structure. The structure is shown below:

<!-- source: EN PDF p21; unit 112 -->

| Parameter<br>name | Parameter<br>type | Description |
| --- | --- | --- |
| size | RK_U32 | MppApi structure size |
| version | RK_U32 | MppApi structure version |
| decode | Function<br>pointer | MPP_RET (*decode)(MppCtx ctx, MppPacket packet, MppFrame<br>*frame)<br>Video decoding interface, input and output at the same time,<br>used alone.<br>ctx:MPP instance context.<br>packet:Input bitstream<br>frame:output image<br>return value:0 is normal and non-zero is error code. |
| decode_put_packet | Function<br>pointer | MPP_RET (*decode_put_packet)(MppCtx ctx, MppPacket packet)<br>Video decoding input interface, used in conjunction with<br>decode_get_frame.<br>ctx :MPP instance context.<br>packet :Input bitstream<br>return value :0 is normal, indicating that the stream has been<br>processed by MPP; non-zero is an error, and the stream has not<br>been processed, so the stream needs to be resented. |
| decode_get_frame | Function<br>pointer | MPP_RET (*decode_get_frame)(MppCtx ctx, MppFrame *frame)<br>Video decoding output interface, used in conjunction with<br>decode_put_packet.<br>ctx :MPP instance context.<br>frame :output image<br>return value :0 is normal, indicating that the acquisition of<br>output process is normal, we need to determine whether there<br>is a value of the frame pointer; non-zero is error code. |
| encode | Function<br>pointer | MPP_RET (*encode)(MppCtx ctx, MppFrame frame, MppPacket<br>*packet)<br>Video encoding interface, input and output at the same time,<br>used separately.<br>ctx :MPP instance context.<br>frame :input image<br>packet :output bitstream<br>return value:0 is normal, non-zero is error code. |
| encode_put_frame | Function<br>pointer | MPP_RET (*encode_put_frame)(MppCtx ctx, MppFrame frame)<br>Video encoding input interface, used in conjunction with<br>encode_get_packet.<br>ctx :MPP instance context.<br>frame :input image<br>return value :0 is normal and non-zero is error code. |

<!-- source: EN PDF p22; unit 113 -->

| Parameter<br>name | Parameter<br>type | Description |
| --- | --- | --- |
| encode_get_packet | Function<br>pointer | MPP_RET (*encode_get_packet)(MppCtx ctx, MppPacket *packet)<br>Video encoding output interface, used in conjunction with<br>encode_put_frame.<br>ctx :MPP instance context.<br>packet :output bitstream<br>return value :0 is normal, non-zero is error code. |
| poll | Function<br>pointer | MPP_RET (*poll)(MppCtx ctx, MppPortType type, MppPollType<br>timeout) Port query interface, used to query whether the port<br>has data available for dequeue.<br>ctx :MPP instance context.<br>type :Port types are divided into input port and output port.<br>timeout :Query timeout parameter, -1 is blocking query, 0 is non-<br>blocking query, and positive value is milliseconds of timeout.<br>return value :0 is normal, data can be retrieved, non-zero is<br>error code. |
| dequeue | Function<br>pointer | MPP_RET (*dequeue)(MppCtx ctx, MppPortType type, MppTask<br>*task) The port dequeue interface is used to dequeue the<br>MppTask structure from the port.<br>ctx :MPP instance context.<br>type :Port types are divided into input port and output port.<br>task :MppTask<br>return value :0 is normal, non-zero is error code. |
| enqueue | Function<br>pointer | MPP_RET (*enqueue)( MppCtx ctx, MppPortType type, MppTask<br>task) The port enqueue interface is used to feed the port into<br>the MppTask structure.<br>ctx :MPP instance context.<br>type :Port types are divided into input port and output port.<br>task :MppTask<br>return value:0 is normal, non-zero is error code. |
| reset | Function<br>pointer | MPP_RET (*reset)(MppCtx ctx) The reset interface is used to<br>reset the internal state of MppCtx and set to available initialized<br>state.<br>NOTE: the reset interface is a blocked synchronous interface.<br>ctx :MPP instance context.<br>return value :0 is normal, non-zero is error code. |

<!-- source: EN PDF p23; unit 114 -->

| Parameter<br>name | Parameter<br>type | Description |
| --- | --- | --- |
| control | Function<br>pointer | MPP_RET (*control)(MppCtx ctx, MpiCmd cmd, MppParam<br>param) Control interface, an interface for additional control<br>operations to MPP instances.<br>ctx :MPP instance context.<br>cmd :Mpi command id, representing different types of control<br>commands.<br>param :The Mpi command parameter represents the additional<br>parameter of the control command.<br>return value :0 is normal, non-zero is error code. |

<!-- source: EN PDF p23; unit 115 -->

## 3\. MPI interface instructions

<!-- source: EN PDF p23; unit 116 -->

This chapter describes the specific process for user to use MPI interface and some considerations on use. MPI (Media Process Interface) is the interface provided by MPP for user. It provides hardware encoding and decoding functions, as well as some necessary related functions. MPI is provided to users through function pointer in C structure. Users can use MPP context structure MppCtx and MPI interface structure MppApi to implement decoder and encoder function.

<!-- source: EN PDF p23; unit 117 -->

![Original technical figure, English PDF page 23](/docs/rockchip-mpp/assets/en-p023-figure-01.png)

<!-- source: EN PDF p23; unit 118 -->

Figure 11 MPI interface range range

<!-- source: EN PDF p24; unit 119 -->

As shown in the figure above mpp_create, mpp_init and mpp_destroy are the interfaces of operating MppCtx. The mpp_create interface also obtains the MPI interface structure MppApi. The real encoding and decoding process is achieved by calling the function pointer in the MppApi structure, that is, the part in the red box in the figure above. Function calls in red boxes are divided into codec process interface put/get_packet/frame and related control and reset interfaces. The description of the codec interface is shown below, and then some key points in the work of the codec are explained.

<!-- source: EN PDF p24; unit 120 -->

### 3.1 Decoder data flow interface

<!-- source: EN PDF p24; unit 121 -->

The decoder interface provides the user with the function of input stream and output image. The interface functions are decode_put_packet function, decode_get_frame function and decode function in MppApi structure. This set of functions provides the simplest decoding support.

<!-- source: EN PDF p24; unit 122 -->

#### 3.1.1 decode_put_packet

<!-- source: EN PDF p24; unit 123 -->

| Interface definition | MPP_RET decode_put_packet(MppCtx ctx, MppPacket packet) |
| --- | --- |
| Input parameter | ctx:MPP Decoder instance,packet:Bit stream data to be input |
| Return parameter | Runtime error code |
| Function | Input stream data packet to MPP decoder instance ctx. |

<!-- source: EN PDF p24; unit 124 -->

##### 3.1.1.1 The Form of Input Bit Stream

<!-- source: EN PDF p24; unit 125 -->

The input of MPP is raw stream without encapsulated information. There are two forms of raw stream input:

<!-- source: EN PDF p24; unit 126 -->

1\. Whole frame data

<!-- source: EN PDF p24; unit 127 -->

The input data has been segmented by frame, that is, each packet of MppPacket data input to decode_put_packet function already contains one and only one complete frame. In this case, MPP can directly process the stream by package, which is the default operation of MPP.

<!-- source: EN PDF p24; unit 128 -->

2\. Broken frame data

<!-- source: EN PDF p24; unit 129 -->

The input data is segmented by length, and then it cannot judge whether a package of MppPacket data is only one complete frame or not. MPP needs frame segmenting operation internally. MPP can also support this broken frame data. But it needs to set the need_split flag through the MPP_DEC_SET_PARSER_SPLIT_MODE command of the control interface before mpp_init.

<!-- source: EN PDF p24; unit 130 -->

![Original technical figure, English PDF page 24](/docs/rockchip-mpp/assets/en-p024-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
// NOTE: decoder split mode need to be set before init
RK_U32 need_split = 1;
mpi_cmd = MPP_DEC_SET_PARSER_SPLIT_MODE;
param = &need_split;
ret = mpi->control(ctx, mpi_cmd, param);
if (MPP_OK != ret) {
    mpp_err("mpi->control failed\n");
    goto MPP_TEST_OUT;
}
```

<!-- source: EN PDF p25; unit 131 -->

In this way the MppPacket with broken frame data that input by decode_put_packet will be segmented frame by frame inside MPP and processed in the same way of whole frame data.

<!-- source: EN PDF p25; unit 132 -->

If these two situations are mixed up there will be some bitstream decoding error generated.

<!-- source: EN PDF p25; unit 133 -->

Whole frame data process is more efficient, but it needs to be parsed and frame segmented before input. Broken frame data process is simple to use, but its efficiency will be affected.

<!-- source: EN PDF p25; unit 134 -->

In the mpi_dec_test test case the default mode is broken frame mode. In Rockchip Android SDK the whole frame mode is used. Users can choose according to their application scenarios and platform conditions.

<!-- source: EN PDF p25; unit 135 -->

##### 3.1.1.2 Consumption of input bit stream

<!-- source: EN PDF p25; unit 136 -->

The valid data length of input MppPacket is “length”. After input decode_put_packet, if the input stream is consumed successfully, the function return value is zero (MPP_OK), and the length of MppPacket is cleared to zero. If the input stream has not been processed a non-zero error code is returned, and the length of MppPacket remains unchanged.

<!-- source: EN PDF p25; unit 137 -->

##### 3.1.1.3 Working mode of function call

<!-- source: EN PDF p25; unit 138 -->

The decode_put_packet function is to input the raw bitstream to MPP instance, but in some cases the MPP instance cannot receive more data. At this time decode_put_packet works in non-blocking mode and it will return error code directly. User gets the returned error codes and waits for a certain time, and then resends the stream data to avoid extra overhead.

<!-- source: EN PDF p25; unit 139 -->

##### 3.1.1.4 The number of maximum buffered packets

<!-- source: EN PDF p25; unit 140 -->

By default the MPP instance can receive four input stream packets in the processing queue. If input stream is sent too fast an error code will be reported and user will be required to wait a moment and resent the stream..

<!-- source: EN PDF p25; unit 141 -->

#### 3.1.2 decode_get_frame

<!-- source: EN PDF p25; unit 142 -->

| Interface definition | MPP_RET decode_get_frame(MppCtx ctx, MppFrame *frame) |
| --- | --- |
| Input parameter | ctx :MPP Decoder instance<br>frame :A pointer to obtain MppFrame instances. |
| Return parameter | Runtime error code |
| function | Get frame description information of decoded frame from MPP decoder<br>instance ctx. |

<!-- source: EN PDF p25; unit 143 -->

The image decoded by MPP is described by the structure of MppFrame. Also the structure of MppFrame is the channel for MPP decoder instance to output information. The error information of image and the info change are also output with MppFrame structure.

<!-- source: EN PDF p26; unit 144 -->

Error information of output image

<!-- source: EN PDF p26; unit 145 -->

The error information of the image is errinfo, which indicates whether there is an error in the process of decoding this image. If errInfo is not zero it means that an error occurred on decoding the corresponding bitstream. The image contains error can be discarded.

<!-- source: EN PDF p26; unit 146 -->

Space requirement on decoding image

<!-- source: EN PDF p26; unit 147 -->

When decoding image the decoder needs to obtain memory for the pixel data of output image. User is required to provide buffer with proper size to decoder. The space size requirement will be calculated in MPP decoder according to different chip platform and different video format. The calculated memory space requirement will be provided to user through the member variable buf_size of MppFrame. Users need to allocate memory according to the buf_size value to meet the requirement of decoder.

<!-- source: EN PDF p26; unit 148 -->

Change of output image information (Info change)

<!-- source: EN PDF p26; unit 149 -->

When the information such as the width, height, format, and pixel bit depth of the bitstream is changed decoder will report to user. User is required to update the memory pool used by decoder by update new memory buffer to the decoder. This involves decoding memory allocation and usage procedure, which are described in 3..2 Image Memory Allocation and Interactive Mode.

<!-- source: EN PDF p26; unit 150 -->

#### 3.1.3 decode

<!-- source: EN PDF p26; unit 151 -->

The decode function is a combination of decode_put_packet and decode_get_frame data, providing user with a composite call of two functions. Its internal logic is:

<!-- source: EN PDF p26; unit 152 -->

1\. Try to acquire an output image;

<!-- source: EN PDF p26; unit 153 -->

2\. If the output image is successfully acquired, function will return;

<!-- source: EN PDF p26; unit 154 -->

3\. If the bitstream has been successfully sent, function will return;

<!-- source: EN PDF p26; unit 155 -->

4\. Send the input bitstream;

<!-- source: EN PDF p26; unit 156 -->

5\. Check the bitstream is sent successfully or not and loops back to step 1;

<!-- source: EN PDF p26; unit 157 -->

In user view, the decode function firstly try to acquire a decoded image. If the decoded image is obtained, the decoded image is preferentially returned to the caller. If there is no decoded image can be output the bitstream is sent, and then try again to get the decoded image and exit.

<!-- source: EN PDF p26; unit 158 -->

### 3.2 Decoder control interface

<!-- source: EN PDF p26; unit 159 -->

#### 3.2.1 control

<!-- source: EN PDF p26; unit 160 -->

The MpiCmd enumeration type defined in rk_mpi_cmd.h defines the control interface command word.The decoder and decoding process commands are shown as follows:

<!-- source: EN PDF p27; unit 161 -->

![Original technical figure, English PDF page 27](/docs/rockchip-mpp/assets/en-p027-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
MPP_DEC_CMD_BASE                 = CMD_MODULE_CODEC | CMD_CTX_ID_DEC,
MPP_DEC_SET_FRAME_INFO,          /* vpu api legacy control for buffer slot dimension init */
MPP_DEC_SET_EXT_BUF_GROUP,       /* IMPORTANT: set external buffer group to mpp decoder */
MPP_DEC_SET_INFO_CHANGE_READY,
MPP_DEC_SET_PRESENT_TIME_ORDER,  /* use input time order for output */
MPP_DEC_SET_PARSER_SPLIT_MODE,   /* Need to setup before init */
MPP_DEC_SET_PARSER_FAST_MODE,    /* Need to setup before init */
MPP_DEC_GET_STREAM_COUNT,
MPP_DEC_GET_VPUMEM_USED_COUNT,
MPP_DEC_SET_VC1_EXTRA_DATA,
MPP_DEC_SET_OUTPUT_FORMAT,
MPP_DEC_SET_DISABLE_ERROR,       /* When set it will disable sw/hw error (H.264 / H.265) */
MPP_DEC_SET_IMMEDIATE_OUT,
MPP_DEC_CMD_END,
```

<!-- source: EN PDF p27; unit 162 -->

MPP_DEC_SET_FRAME_INFO

<!-- source: EN PDF p27; unit 163 -->

The command parameter is MppFrame, which is used to configure the default width and height information of the decoder. The returned MppFrame structure will bring out the image buffer size to be allocated from the decoder. This command is called usually right after mpp_init and before decode_put_packet.

<!-- source: EN PDF p27; unit 164 -->

MPP_DEC_SET_EXT_BUF_GROUP

<!-- source: EN PDF p27; unit 165 -->

The command parameter is MppBufferGroup, which is used to configure the MppBufferGroup as buffer pool to decoder. This command is called at different position depending on image memory allocation mode.

<!-- source: EN PDF p27; unit 166 -->

MPP_DEC_SET_INFO_CHANGE_READY

<!-- source: EN PDF p27; unit 167 -->

There is no command parameter for this command. It is used to mark decoder's MppBufferGroup has completed the reset processing of the Info change operation, and decoder can continue decoding. This command is called at different position depending on image memory allocation mode.

<!-- source: EN PDF p27; unit 168 -->

MPP_DEC_SET_PRESENT_TIME_ORDER

<!-- source: EN PDF p27; unit 169 -->

The command parameter is RK_U32*, which is used to process special bitstream timestamp case.

<!-- source: EN PDF p27; unit 170 -->

MPP_DEC_SET_PARSER_SPLIT_MODE

<!-- source: EN PDF p27; unit 171 -->

The command parameter is RK_U32*, which is used to enable the protocol parser in the MPP to process internal frame segmentation. The default bitstream input mode is whole frame mode and assume the input is frame segmented. This command is called before mpp_init.

<!-- source: EN PDF p27; unit 172 -->

MPP_DEC_SET_PARSER_FAST_MODE

<!-- source: EN PDF p27; unit 173 -->

The command parameter is RK_U32*, which is used to enable fast frame parsing in MPP and improve the parallelism of decoder hardware and software. However, the side-effect is some influence on error stream flag so it is disabled by default. This command is called before mpp_init.

<!-- source: EN PDF p27; unit 174 -->

MPP_DEC_GET_STREAM_COUT

<!-- source: EN PDF p27; unit 175 -->

The command parameter is RK_U32*. It is called by external applications to obtain the number of bitstream packets that have not been processed. It is a historical legacy interface.

<!-- source: EN PDF p27; unit 176 -->

MPP_DEC_GET_VPUMEM_USED_COUT

<!-- source: EN PDF p27; unit 177 -->

The command parameter is RK_U32*. It is called by external applications to obtain the number of MppBuffer used by MPP. It is a historical legacy interface.

<!-- source: EN PDF p27; unit 178 -->

MPP_DEC_SET_VC1_EXTRA_DATA

<!-- source: EN PDF p27; unit 179 -->

Not yet implemented. It is a historical legacy interface.

<!-- source: EN PDF p27; unit 180 -->

MPP_DEC_SET_OUTPUT_FORMAT

<!-- source: EN PDF p28; unit 181 -->

The command parameter is MppFrameFormat. It is called by external applications to configure the output image format of the JPEG decoder. It is not used by default.

<!-- source: EN PDF p28; unit 182 -->

MPP_DEC_SET_DISABLE_ERROR

<!-- source: EN PDF p28; unit 183 -->

The command parameter is RK_U32*. It is used to disable error handling of the MPP decoder. Once enabled, MPP decoding ignores the error flag of the stream, outputs all decodable images, and does not mark any errinfo in the output MppFrame structure. This command is called before decode_put_packet.

<!-- source: EN PDF p28; unit 184 -->

MPP_DEC_SET_IMMEDIATE_OUT

<!-- source: EN PDF p28; unit 185 -->

The command parameter is RK_U32*. It is used to enable the immediate output mode of H.264 decoder. Once enabled the H.264 decoder ignores the frame sequence discontinuity caused by frame dropping or picture order count, just outputs the current decoded image immediately. This command is called before decode_put_packet.

<!-- source: EN PDF p28; unit 186 -->

MPP_DEC_SET_ENABLE_FAST_PLAY

<!-- source: EN PDF p28; unit 187 -->

The command parameter is FastPlayMode*. It is used to enable the fast play of H.264, without waiting for dpb full to output the frame. If the current frame is decoded after the I frame but displayed before the I frame, frame loss may occur. The command is called before decode_put_packet.

<!-- source: EN PDF p28; unit 188 -->

#### 3.2.2 reset

<!-- source: EN PDF p28; unit 189 -->

The reset interface is used to restore the decoder to the state after normal initialization.

<!-- source: EN PDF p28; unit 190 -->

When the user sends the last packet of MppPacket code stream, and puts the EOS mark into the decoder, the decoder will enter the EOS state after processing the last packet of data, and will no longer receive and process the code stream. Only after resetting can it continue to receive the new code stream.

<!-- source: EN PDF p28; unit 191 -->

### 3.3 Key points on decoder usage

<!-- source: EN PDF p28; unit 192 -->

In the process of using decoder some important notices need to be paid attention to:

<!-- source: EN PDF p28; unit 193 -->

#### 3.3.1 Decoder single/multithread usage

<!-- source: EN PDF p28; unit 194 -->

The MPI interface of MPP decoder is thread-safe and can be used in multi-thread environment. The single- thread mode is shown in mpi_dec_test demo, and the multi-threaded mode is shown in mpi_dec_mt_test demo.

<!-- source: EN PDF p29; unit 195 -->

![Original technical figure, English PDF page 29](/docs/rockchip-mpp/assets/en-p029-figure-01.png)

<!-- source: EN PDF p29; unit 196 -->

![Original technical figure, English PDF page 29](/docs/rockchip-mpp/assets/en-p029-figure-02.png)

<!-- source: EN PDF p29; unit 197 -->

Figure 12 Decoder single/multithread usage

<!-- source: EN PDF p29; unit 198 -->

#### 3.3.2 Image memory allocation and user interaction mode

<!-- source: EN PDF p29; unit 199 -->

When decoder decodes image it needs to obtain memory space to write pixel data. When decoding is completed, the memory space needs to be handed over to user, and released back to decoder after user completes his usage. And all the Memory space will be released when the decoder is closed. In this procedure mode zero-copy interaction can be achieved between the decoder and the user. The MPP decoder supports three memory allocation and user interaction mode:

<!-- source: EN PDF p29; unit 200 -->

##### 3.3.2.1 Mode 1: Pure internal allocation mode

<!-- source: EN PDF p29; unit 201 -->

The image memory is allocated from the MPP decoder directly. The user obtains the decoder output image and releases it directly after use.

<!-- source: EN PDF p30; unit 202 -->

![Original technical figure, English PDF page 30](/docs/rockchip-mpp/assets/en-p030-figure-01.png)

<!-- source: EN PDF p30; unit 203 -->

Figure 13 Schematic diagram of pure internal allocation mode

<!-- source: EN PDF p30; unit 204 -->

In this way the user does not need to call the MPP_DEC_SET_EXT_BUF_GROUP command of the decoder control interface, and only needs to directly call the MPP_DEC_SET_INFO_CHANGE_READY command of

<!-- source: EN PDF p30; unit 205 -->

the control interface when the decoder reports the info change. The decoder will automatically allocate memory internally and the user needs to release the acquired data of each frame direct I.

<!-- source: EN PDF p30; unit 206 -->

![Original technical figure, English PDF page 30](/docs/rockchip-mpp/assets/en-p030-figure-02.png)

<!-- source: EN PDF p30; unit 207 -->

Figure 14 Code flow of decoder image memory pure internal allocation mode

<!-- source: EN PDF p30; unit 208 -->

Advantage:

<!-- source: EN PDF p30; unit 209 -->

Procedure is simple. A demo can be setup quickly to evaluate the decoder performance. Disadvantage:

<!-- source: EN PDF p30; unit 210 -->

1\. Memory is allocated internally from the decoder. If the memory has not been released when the decoder is destroyed, there may be a memory leak or crash.

<!-- source: EN PDF p30; unit 211 -->

2\. Unable to control the memory usage of the decoder. The decoder can use the memory without restrictions. If the bitstream is input quickly and the user does not release the decoded image memory in time, the decoder will quickly consume all available memory.

<!-- source: EN PDF p30; unit 212 -->

3\. To achieve zero-copy display is difficult, because the memory is allocated from the inner decoder, and the user's display system may be not compatible.

<!-- source: EN PDF p30; unit 213 -->

##### 3.3.2.2 Mode 2: Semi-internal allocation mode

<!-- source: EN PDF p30; unit 214 -->

This mode is the default mode used by the mpi_dec_test demo. The user needs to create an MppBufferGroup according to the buf_size of the MppFrame returned by the get_frame, and configure it to the decoder through the MPP_DEC_SET_EXT_BUF_GROUP of the control interface. Users can limit the memory usage of the decoder through the mpp_buffer_group_limit_config interface.

<!-- source: EN PDF p31; unit 215 -->

![Original technical figure, English PDF page 31](/docs/rockchip-mpp/assets/en-p031-figure-01.png)

<!-- source: EN PDF p31; unit 216 -->

Figure 15 Semi-internal allocation mode decoder work flow

<!-- source: EN PDF p31; unit 217 -->

Advantage:

<!-- source: EN PDF p31; unit 218 -->

Procedure is simple, approachable, can do some limitation on the memory usage. Disadvantage:

<!-- source: EN PDF p31; unit 219 -->

1\. The limitation of memory space is not accurate. The usage of memory is not fixed at 100% and will fluctuate.

<!-- source: EN PDF p31; unit 220 -->

2\. It is also difficult to achieve zero copy display

<!-- source: EN PDF p31; unit 221 -->

##### 3.3.2.3 Mode 3: Pure external allocation mode

<!-- source: EN PDF p31; unit 222 -->

In this mode decoder imports the memory file handle of the external allocator (usually dmabuf/ion/drm) from the user by creating an empty external mode MppBufferGroup. On the Android platform, Mediaserver obtains the display memory from SurfaceFlinger through gralloc, commits the file handle obtained by gralloc to MppBufferGroup, configures MppBufferGroup to the decoder through the control interface MPP_DEC_SET_EXT_BUF_GROUP command, and then the MPP decoder will recycle the memory space obtained by gralloc

<!-- source: EN PDF p31; unit 223 -->

![Original technical figure, English PDF page 31](/docs/rockchip-mpp/assets/en-p031-figure-02.png)

<!-- source: EN PDF p31; unit 224 -->

Figure 16 Schematic diagram of pure external allocation mode

<!-- source: EN PDF p32; unit 225 -->

![Original technical figure, English PDF page 32](/docs/rockchip-mpp/assets/en-p032-figure-01.png)

<!-- source: EN PDF p32; unit 226 -->

Figure 17 Pure external allocation mode decoder work flow

<!-- source: EN PDF p32; unit 227 -->

Advantage:

<!-- source: EN PDF p32; unit 228 -->

It is easy to achieve zero copy by directly using the memory from external display. Disadvantage:

<!-- source: EN PDF p32; unit 229 -->

1\. It is difficult to understand and use.

<!-- source: EN PDF p32; unit 230 -->

2\. The user program needs to be modified. Some user program work flow restricts the pure external allocation mode usage.

<!-- source: EN PDF p32; unit 231 -->

Note on use of pure external distribution mode:

<!-- source: EN PDF p32; unit 232 -->

1\. If the image memory pool is created before the decoder is created there should be an extra way to get the size of the image memory.

<!-- source: EN PDF p32; unit 233 -->

General YUV420 image memory space calculation method: Image pixel data hor_stride * ver_stride * 3 / 2 Additional information: hor_stride * ver_stride / 2

<!-- source: EN PDF p32; unit 234 -->

2\. The number of memory blocks needs to consider the requirements of both decoding and display. If the number of memory blocks is enough the decoder may get stuck.

<!-- source: EN PDF p32; unit 235 -->

H.264/H.265 protocols with more reference frames require 20+ memory blocks to guarantee decoding. Other protocols require 10+ memory blocks to ensure decoding.

<!-- source: EN PDF p32; unit 236 -->

3\. If an info change occurs during the bitstream decoding process, the existing MppBufferGroup needs to be reset. New image memory buffer should be committed, and the external display needs to be adjusted accordingly.

<!-- source: EN PDF p33; unit 237 -->

### 3.4 Encoder data flow interface

<!-- source: EN PDF p33; unit 238 -->

The encoder interface provides the user with the image input function and bitstream output functions . The interface function is the encode_put_frame function, the encode_get_packet function and the encode function in the MppApi structure. This set of functions provides simple coding support, while the control interface provides the ability to configure the encoder.

<!-- source: EN PDF p33; unit 239 -->

#### 3.4.1 encode_put_frame

<!-- source: EN PDF p33; unit 240 -->

| Interface definition | MPP_RET encode_put_frame(MppCtx ctx, MppFrame frame) |
| --- | --- |
| Input parameter | ctx:MPP decoder instance<br>,frame:Image data to be input |
| Return parameter | Running error code |
| Function | Input frame image data to the MPP encoder instance specified by ctx. |

<!-- source: EN PDF p33; unit 241 -->

##### 3.4.1.1 Function working mode

<!-- source: EN PDF p33; unit 242 -->

Since the input image of the encoder is very large in normal case, if the image copy is performed, the efficiency will be greatly reduced. Therefore, the input function of the encoder needs to wait for the encoder hardware to complete the use of the input image memory then the input function can return. The used image is returned to the caller. Based on the above considerations the encode_put_frame is a blocking function that blocks the call until the input image usage is finished. To a certain extent, the software and hardware operations cannot be paralleled and the efficiency is reduced.

<!-- source: EN PDF p33; unit 243 -->

##### 3.4.1.2 Copy and zero copy input

<!-- source: EN PDF p33; unit 244 -->

The input of the encoder does not support the space allocated by the CPU. If you need to support the address allocated by the CPU, you need to allocate MppBuffer and copy the data into it. This will greatly affect the efficiency. The encoder prefers input memory to be in form of dmabuf/ion/drm, which enables zero-copy encoding with minimal overhead.

<!-- source: EN PDF p34; unit 245 -->

#### 3.4.2 encode_get_packet

<!-- source: EN PDF p34; unit 246 -->

| Interface definition | MPP_RET encode_get_packet(MppCtx ctx, MppPacket *packet) |
| --- | --- |
| Input parameter | ctx:MPP decoder instance<br>,packet:A pointer to get an instance of MppPacket. |
| Return parameter | Runtime error mode |
| Function | The packet description information of the completed encoding is obtained<br>from the MPP encoder instance specified by ctx. |

<!-- source: EN PDF p34; unit 247 -->

##### 3.4.2.1 Header information and image data

<!-- source: EN PDF p34; unit 248 -->

Taking the H.264 encoder as an example, the output data of the encoder is divided into two parts: header information bitstream (sps/pps) and image data bitstream (I/P slice). The header information needs to be obtained by the MPP_ENC_GET_EXTRA_INFO command of the control interface, and the image data is obtained through the encode_get_packet interface. The timing of the header information acquisition is after the SET_RC_CFG/SET_PREP_CFG/SET_CODEC_CFG parameter configuration command of the control interface is completed. When the parameter configuration command is called, the encoder will update each parameter. After the update is completed, the latest header information can be obtained by calling

<!-- source: EN PDF p34; unit 249 -->

MPP_ENC_GET_EXTRA_INFO

<!-- source: EN PDF p34; unit 250 -->

##### 3.4.2.2 H.264 encoder output stream format

<!-- source: EN PDF p34; unit 251 -->

At present, the hardware fixed output stream with the start code of 00 00 00 01, so the encode_get_packet function gets the code stream with the start code of 00 00 00 01. If you need to remove the start code, you can copy it start with the address after the start code.

<!-- source: EN PDF p34; unit 252 -->

##### 3.4.2.3 Zero copy of code stream data

<!-- source: EN PDF p34; unit 253 -->

Since there is no way to configure the output buffer when using the encode_put_frame and encode_get_packet interfaces, a copy will be made when using encode_get_packet. In general the output stream of the encoder is not large comparing to the input image, and the copy of the bitstream data is acceptable. If you need to use a zero-copy interface, you need to use the enqueue/dequeue interface and the MppTask structure.

<!-- source: EN PDF p34; unit 254 -->

#### 3.4.3 encode

<!-- source: EN PDF p34; unit 255 -->

Not yet implemented

<!-- source: EN PDF p35; unit 256 -->

### 3.5 Encoder control interface

<!-- source: EN PDF p35; unit 257 -->

Encoders and decoders are different and require users to configure certain parameters. The encoder requires the user to configure the encoder configuration information through the control interface before encoding.

<!-- source: EN PDF p35; unit 258 -->

#### 3.5.1 Control and MppEncCfg

<!-- source: EN PDF p35; unit 259 -->

MPP recommends using the encapsulated MppEncCfg structure to configure encoder information through the MPP_ENC_SET_CFG/MPP_ENC_GET_CFG command of the control interface.

<!-- source: EN PDF p35; unit 260 -->

Due to the configurable options and parameters of the encoder, the use of fixed structures is prone to frequent changes in the interface structure, resulting in the inability to ensure binary compatibility of the interface, complicated version management, and greatly increased maintenance.

<!-- source: EN PDF p35; unit 261 -->

To alleviate this problem, MppEncCfg uses (void *) as the type, and uses &lt;string-value&gt; for key map configuration. The function interface is divided into s32/u32/s64/u64/ptr/st, and the corresponding interface functions are divided into set and get two groups, as follows:

<!-- source: EN PDF p35; unit 262 -->

```text
MPP_RET mpp_enc_cfg_set_s32(MppEncCfg cfg, const char *name, RK_S32 val);
MPP_RET mpp_enc_cfg_set_u32(MppEncCfg cfg, const char *name, RK_U32 val);
MPP_RET mpp_enc_cfg_set_s64(MppEncCfg cfg, const char *name, RK_S64 val);
MPP_RET mpp_enc_cfg_set_u64(MppEncCfg cfg, const char *name, RK_U64 val);
MPP_RET mpp_enc_cfg_set_ptr(MppEncCfg cfg, const char *name, void *val);
MPP_RET mpp_enc_cfg_set_st(MppEncCfg cfg, const char *name, void *val);

MPP_RET mpp_enc_cfg_get_s32(MppEncCfg cfg, const char *name, RK_S32 *val);
MPP_RET mpp_enc_cfg_get_u32(MppEncCfg cfg, const char *name, RK_U32 *val);
MPP_RET mpp_enc_cfg_get_s64(MppEncCfg cfg, const char *name, RK_S64 *val);
MPP_RET mpp_enc_cfg_get_u64(MppEncCfg cfg, const char *name, RK_U64 *val);
MPP_RET mpp_enc_cfg_get_ptr(MppEncCfg cfg, const char *name, void **val);
MPP_RET mpp_enc_cfg_get_st(MppEncCfg cfg, const char *name, void *val);
```

<!-- source: EN PDF p35; unit 263 -->

The character string is generally defined by [type:parameter]. The supported character strings and parameter types are as follows:

<!-- source: EN PDF p36; unit 264 -->

| Parameter string | Interface | Actual type | Description |
| --- | --- | --- | --- |
| rc:mode | S32 | MppEncRcMode | Indicates the bit rate control mode, currently<br>supports CBR and VBR:<br>CBR is Constant Bit Rate,fixed bit rate mode.In fixed<br>bit rate mode, the target bit rate plays a decisive<br>role.<br>VBR is Variable Bit Rate, variable bit rate mode.In<br>variable bit rate mode, the maximum and minimum<br>bit rates play a decisive role.<br>FIX_QP is a fixed QP mode, used for debugging and<br>performance evaluation. |
| rc:bps_target | S32 | RK_S32 | Indicates the target code rate in CBR mode. |
| rc:bps_max | S32 | RK_S32 | Indicates the highest bit rate in VBR mode. |
| rc:bps_min | S32 | RK_S32 | Indicates the lowest bit rate in VBR mode. |
| rc:fps_in_flex | S32 | RK_S32 | Flag bit indicating whether the input frame rate is<br>variable. The default is 0.<br>0 means that the input frame rate is fixed, and the<br>frame rate calculation method is<br>fps_in_num/fps_in_denom, which can indicate the<br>fractional frame rate.<br>1 means that the input frame rate is variable. In the<br>case of a variable frame rate, the frame rate is not<br>fixed, and the corresponding code rate calculation<br>and allocation rules become calculated according to<br>actual time. |
| rc:fps_in_flex | S32 | RK_S32 | Flag bit indicating whether the input frame rate is<br>variable. The default is 0.<br>0 means that the input frame rate is fixed, and the<br>frame rate calculation method is<br>fps_in_num/fps_in_denom, which can indicate the<br>fractional frame rate.<br>1 means that the input frame rate is variable. In the<br>case of a variable frame rate, the frame rate is not<br>fixed, and the corresponding code rate calculation<br>and allocation rules become calculated according to<br>actual time. |
| rc:fps_in_num | S32 | RK_S32 | Indicates the numerator part of the input frame rate<br>score value, for example, 0 means the default 30fps. |
| rc:fps_in_denom | S32 | RK_S32 | Indicates the denominator part of the input frame<br>rate fraction value. If 0 is 1 |

<!-- source: EN PDF p36; unit 265 -->

![Original technical figure, English PDF page 36](/docs/rockchip-mpp/assets/en-p036-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
typedef enum MppEncRcMode_e {
    MPP_ENC_RC_MODE_VBR,
    MPP_ENC_RC_MODE_CBR,
    MPP_ENC_RC_MODE_FIXQP,
    MPP_ENC_RC_MODE_AVBR,
    MPP_ENC_RC_MODE_BUTT
} MppEncRcMode;
```

<!-- source: EN PDF p37; unit 266 -->

| Parameter string | Interface | Actual type | Description |
| --- | --- | --- | --- |
| rc:fps_out_flex | S32 | RK_S32 | Flag indicating whether the output frame rate is<br>variable. The default is 0.<br>0 means that the output frame rate is fixed, and the<br>frame rate calculation method is<br>fps_out_num/fps_out_denom, which can indicate<br>the fractional frame rate.<br>1 means that the output frame rate is variable. In<br>the case of variable frame rate, the frame rate is not<br>fixed, and the corresponding code stream output<br>time is calculated according to the actual time. |
| rc:fps_out_num | S32 | RK_S32 | Indicates the numerator part of the output frame<br>rate score, such as 0 means the default 30fps. |
| rc:fps_out_denom | S32 | RK_S32 | Indicates the denominator part of the output frame<br>rate score value. If 0 is 1 |
| rc:gop |  | RK_S32 | Indicates Group Of Picture, that is, the interval<br>between two I frames, the meaning is as follows.<br>0-indicates that there is only one I frame, other<br>frames are P frames<br>1-means all I frames<br>2-means the sequence is I P I P I P...<br>3-means the sequence is I P P I P P I P P...<br>In general, gop is selected as an integer multiple of<br>the input frame rate. |
| rc:max_reenc_times | U32 | RK_U32 | The maximum recoding times of a frame of image. |
| prep:width | S32 | RK_S32 | Indicates the number of pixels in the horizontal<br>direction of the input image, in units of pixels. |
| prep:height | S32 | RK_S32 | Indicates the number of pixels in the vertical<br>direction of the input image, in units of pixels. |
| prep:hor_stride | S32 | RK_S32 | Indicates the distance between two adjacent lines in<br>the vertical direction of the input image, in bytes. |
| prep:ver_stride | S32 | RK_S32 | Indicates the number of lines between input image<br>components, and the unit is 1. |

<!-- source: EN PDF p38; unit 267 -->

| Parameter string | Interface | Actual type | Description |
| --- | --- | --- | --- |
| prep:format | S32 | MppFrameFormat | Represents the input image color space format and<br>memory layout. |
| prep:color | S32 | MppFrameColorSpace | Represents the color space range of input image<br>data. |
| prep:range | S32 | MppFrameColorRange | Indicates whether the input image is full range or<br>limit range |
| prep:rotation | S32 | MppEncRotationCfg | Represents the input image rotation attribute, the<br>default is 0, no rotation. |
| prep:mirroring | S32 | RK_S32 | Indicates the mirroring attribute of the input image,<br>the default is no mirroring. |

<!-- source: EN PDF p38; unit 268 -->

![Original technical figure, English PDF page 38](/docs/rockchip-mpp/assets/en-p038-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
typedef enum {
    MPP_FMT_YUV420SP       = (MPP_FRAME_FMT_YUV + 0),  /* YYYY... UV... (NV12)       */
    /*
     * A rockchip specific pixel format, without gap between pixel against
     * the P010_10LE/P010_10BE
     */
    MPP_FMT_YUV420SP_10BIT = (MPP_FRAME_FMT_YUV + 1),
    MPP_FMT_YUV422SP       = (MPP_FRAME_FMT_YUV + 2),  /* YYYY... UVUV... (NV16)     */
    MPP_FMT_YUV422SP_10BIT = (MPP_FRAME_FMT_YUV + 3),  ///< Not part of ABI
    MPP_FMT_YUV420P        = (MPP_FRAME_FMT_YUV + 4),  /* YYYY... U...V... (I420)    */
    MPP_FMT_YUV420SP_VU    = (MPP_FRAME_FMT_YUV + 5),  /* YYYY... VUVUVU... (NV21)   */
    MPP_FMT_YUV422P        = (MPP_FRAME_FMT_YUV + 6),  /* YYYY... UUU...VVV... (422P) */
    MPP_FMT_YUV422SP_VU    = (MPP_FRAME_FMT_YUV + 7),  /* YYYY... VUVUVU... (NV61)   */
    MPP_FMT_YUV422_YUYV    = (MPP_FRAME_FMT_YUV + 8),  /* YUYVYUYV... (YUY2)        */
    MPP_FMT_YUV422_UYVY    = (MPP_FRAME_FMT_YUV + 9),  /* UYVYUYVY... (UYVY)        */
    MPP_FMT_YUV422_YVYU    = (MPP_FRAME_FMT_YUV + 10), /* YVYUYVYU... (YVYU)        */
    MPP_FMT_YUV422_VYUY    = (MPP_FRAME_FMT_YUV + 11), /* VYUYVYUY... (VYUY)        */
    MPP_FMT_YUV400         = (MPP_FRAME_FMT_YUV + 12), /* YYYY...                   */
    MPP_FMT_YUV440SP       = (MPP_FRAME_FMT_YUV + 13), /* YYYY... UVUV...           */
    MPP_FMT_YUV411SP       = (MPP_FRAME_FMT_YUV + 14), /* YYYY... UV...             */
    MPP_FMT_YUV444SP       = (MPP_FRAME_FMT_YUV + 15), /* YYYY... UVUVUVUV...       */
    MPP_FMT_YUV444P        = (MPP_FRAME_FMT_YUV + 16), /* YYYY... UUUU... VVVV...   */
    MPP_FMT_YUV_BUTT,

    MPP_FMT_RGB565         = (MPP_FRAME_FMT_RGB + 0),  /* 16-bit RGB */
    MPP_FMT_BGR565         = (MPP_FRAME_FMT_RGB + 1),  /* 16-bit RGB */
    MPP_FMT_RGB555         = (MPP_FRAME_FMT_RGB + 2),  /* 15-bit RGB */
    MPP_FMT_BGR555         = (MPP_FRAME_FMT_RGB + 3),  /* 15-bit RGB */
    MPP_FMT_RGB444         = (MPP_FRAME_FMT_RGB + 4),  /* 12-bit RGB */
    MPP_FMT_BGR444         = (MPP_FRAME_FMT_RGB + 5),  /* 12-bit RGB */
    MPP_FMT_RGB888         = (MPP_FRAME_FMT_RGB + 6),  /* 24-bit RGB */
    MPP_FMT_BGR888         = (MPP_FRAME_FMT_RGB + 7),  /* 24-bit RGB */
    MPP_FMT_RGB101010      = (MPP_FRAME_FMT_RGB + 8),  /* 30-bit RGB */
    MPP_FMT_BGR101010      = (MPP_FRAME_FMT_RGB + 9),  /* 30-bit RGB */
    MPP_FMT_ARGB8888       = (MPP_FRAME_FMT_RGB + 10), /* 32-bit RGB */
    MPP_FMT_ABGR8888       = (MPP_FRAME_FMT_RGB + 11), /* 32-bit RGB */
    MPP_FMT_BGRA8888       = (MPP_FRAME_FMT_RGB + 12), /* 32-bit RGB */
    MPP_FMT_RGBA8888       = (MPP_FRAME_FMT_RGB + 13), /* 32-bit RGB */
    MPP_FMT_RGB_BUTT,

    MPP_FMT_BUTT,
} MppFrameFormat;
```

<!-- source: EN PDF p38; unit 269 -->

![Original technical figure, English PDF page 38](/docs/rockchip-mpp/assets/en-p038-figure-02.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
/*
 * MPEG vs JPEG YUV range.
 */
typedef enum {
    MPP_FRAME_RANGE_UNSPECIFIED = 0,
    MPP_FRAME_RANGE_MPEG        = 1,    ///< the normal 219*2^(n-8) "MPEG" YUV ranges
    MPP_FRAME_RANGE_JPEG        = 2,    ///< the normal     2^n-1   "JPEG" YUV ranges
    MPP_FRAME_RANGE_NB,                ///< Not part of ABI
} MppFrameColorRange;
```

<!-- source: EN PDF p38; unit 270 -->

![Original technical figure, English PDF page 38](/docs/rockchip-mpp/assets/en-p038-figure-03.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
/*
 * input frame rotation parameter
 * 0 - disable rotation
 * 1 - 90 degree
 * 2 - 180 degree
 * 3 - 270 degree
 */
typedef enum MppEncRotationCfg_t {
    MPP_ENC_ROT_0,
    MPP_ENC_ROT_90,
    MPP_ENC_ROT_180,
    MPP_ENC_ROT_270,
    MPP_ENC_ROT_BUTT
} MppEncRotationCfg;
```

<!-- source: EN PDF p38; unit 271 -->

![Original technical figure, English PDF page 38](/docs/rockchip-mpp/assets/en-p038-figure-04.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
/*
 * input frame mirroring parameter
 * 0 - disable mirroring
 * 1 - horizontal mirroring
 * 2 - vertical mirroring
 */
```

<!-- source: EN PDF p39; unit 272 -->

| Parameter string | Interface | Actual type | Description |
| --- | --- | --- | --- |
| codec:type | S32 | MppCodingType | Indicates the protocol type corresponding to<br>MppEncCodecCfg, which needs to be consistent<br>with the parameters of the MppCtx initialization<br>function mpp_init. |
| h264:stream_type | S32 | RK_S32 | Indicates the type of input H.264 stream format,<br>and the default is 0.<br>0-indicates Annex B format, that is, the start code of<br>00 00 00 01 is added.<br>1-indicates a format without a start code.<br>At present, the internal fixed format is Annex B<br>format |
| h264:profile | S32 | RK_S32 | The profile_idc parameter in SPS:<br>66-indicates Baseline profile.<br>77-indicates Main profile.<br>100-indicates High profile. |
| h264:level | S32 | RK_S32 | Indicates the level_idc parameter in SPS, where 10<br>represents level 1.0:10/11/12/13 – qcif@15fps /<br>cif@7.5fps / cif@15fps / cif@30fps<br>20/21/22 – cif@30fps / half-D1@25fps / D1@12.5fps<br>30/31/32 – D1@25fps / 720p@30fps / 720p@60fps<br>40/41/42 – 1080p@30fps / 1080p@30fps /<br>1080p@60fps<br>50/51/52 – 4K@30fps / 4K@30fps / 4K@60fps<br>The general configuration is level 4.1 to meet the<br>requirements. |
| h264:cabac_en | S32 | RK_S32 | Represents the entropy encoding format used by<br>the encoder:<br>0 – CAVLC,Adaptive variable length coding.<br>1 – CABAC, Adaptive arithmetic coding. |
| h264:cabac_idc | S32 | RK_S32 | The cabac_init_idc in the protocol syntax is valid<br>when cabac_en is 1, and the valid value is 0~2. |
| h264:trans8x8 | S32 | RK_S32 | Indicates the 8x8 conversion enable flag in the<br>protocol syntax. |

<!-- source: EN PDF p39; unit 273 -->

![Original technical figure, English PDF page 39](/docs/rockchip-mpp/assets/en-p039-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
typedef enum {
    MPP_VIDEO_CodingUnused,                 /**< Value when coding is N/A */
    MPP_VIDEO_CodingAutoDetect,             /**< Autodetection of coding type */
    MPP_VIDEO_CodingMPEG2,                  /**< AKA: H.262 */
    MPP_VIDEO_CodingH263,                   /**< H.263 */
    MPP_VIDEO_CodingMPEG4,                  /**< MPEG-4 */
    MPP_VIDEO_CodingWMV,                    /**< Windows Media Video (WMV1,WMV2,WMV3)*/
    MPP_VIDEO_CodingRV,                     /**< all versions of Real Video */
    MPP_VIDEO_CodingAVC,                    /**< H.264/AVC */
    MPP_VIDEO_CodingMJPEG,                  /**< Motion JPEG */
    MPP_VIDEO_CodingVP8,                    /**< VP8 */
    MPP_VIDEO_CodingVP9,                    /**< VP9 */
    MPP_VIDEO_CodingVC1 = 0x01000000,       /**< Windows Media Video (WMV1,WMV2,WMV3)*/
    MPP_VIDEO_CodingFLV1,                   /**< Sorenson H.263 */
    MPP_VIDEO_CodingDIVX3,                  /**< DIVX3 */
    MPP_VIDEO_CodingVP6,
    MPP_VIDEO_CodingHEVC,                   /**< H.265/HEVC */
    MPP_VIDEO_CodingAVSPLUS,                /**< AVS+ */
    MPP_VIDEO_CodingAVS,                    /**< AVS profile=0x20 */
    MPP_VIDEO_CodingAVS2,                   /**< AVS2 */
    MPP_VIDEO_CodingAV1,                    /**< av1 */
    MPP_VIDEO_CodingKhronosExtensions = 0x6F000000, /**< Reserved region for introducing Khronos Standard Extensions */
    MPP_VIDEO_CodingVendorStartUnused = 0x7F000000, /**< Reserved region for introducing Vendor Extensions */
    MPP_VIDEO_CodingMax = 0x7FFFFFFF
} MppCodingType;
```

<!-- source: EN PDF p39; unit 274 -->

![Original technical figure, English PDF page 39](/docs/rockchip-mpp/assets/en-p039-figure-02.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
typedef enum h264_profile_t {
    H264_PROFILE_FREXT_CAVLC444 = 44,  //!< YUV 4:4:4/14 "CAVLC 4:4:4"
    H264_PROFILE_BASELINE      = 66,  //!< YUV 4:2:0/8 "Baseline"
    H264_PROFILE_MAIN          = 77,  //!< YUV 4:2:0/8 "Main"
    H264_PROFILE_EXTENDED      = 88,  //!< YUV 4:2:0/8 "Extended"
    H264_PROFILE_HIGH          = 100, //!< YUV 4:2:0/8 "High"
    H264_PROFILE_HIGH10        = 110, //!< YUV 4:2:0/10 "High 10"
    H264_PROFILE_HIGH422       = 122, //!< YUV 4:2:2/10 "High 4:2:2"
    H264_PROFILE_HIGH444       = 244, //!< YUV 4:4:4/14 "High 4:4:4"
    H264_PROFILE_MVC_HIGH      = 118, //!< YUV 4:2:0/8 "Multiview High"
    H264_PROFILE_STEREO_HIGH   = 128  //!< YUV 4:2:0/8 "Stereo High"
} H264Profile;
```

<!-- source: EN PDF p40; unit 275 -->

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
|  | Parameter string | Interface | Actual type | Description |  |
|  | h264:const_intra | S32 | RK_S32 | 0-to close, fixed close in Baseline/Main profile. |  |
|  | h264:scaling_list | S32 | RK_S32 | 1-to enable, selectable to enable in High profile. |  |
|  | h264:cb_qp_offset | S32 | RK_S32 | It indicates the constrained_intra_pred_mode mode<br>enable flag in the protocol syntax. |  |
|  | h264:cr_qp_offset | S32 | RK_S32 | 0-is off, 1-is on. |  |
|  | h264:dblk_disable | S32 | RK_S32 | Represents the scaling_list_matrix mode in the<br>protocol syntax |  |
|  | h264:dblk_alpha | S32 | RK_S32 | 0-flat matrix, 1-default matrix. |  |
|  | h264:dblk_beta | S32 | RK_S32 | Indicates the deblock_offset_beta value in the<br>protocol syntax. |  |
|  | h264:qp_init | S32 | RK_S32 | The valid range is [-6, 6]. |  |
|  | h264:qp_max | S32 | RK_S32 | Indicates the initial QP value. Do not configure it<br>under normal circumstances. |  |
|  | h264:qp_min | S32 | RK_S32 | Indicates the maximum QP value, do not configure<br>it under normal circumstances. |  |
|  | h264:qp_max_i | S32 | RK_S32 | Indicates the minimum QP value, do not configure it<br>under normal circumstances. |  |
|  | h264:qp_min_i | S32 | RK_S32 | Indicates the maximum I frame QP value. Do not<br>configure it under normal circumstances. |  |
|  | h264:qp_step | S32 | RK_S32 | Indicates the minimum I frame QP value. Do not<br>configure it under normal circumstances. |  |
|  | h265:profile | S32 | RK_S32 | Indicates the frame-level QP change amplitude<br>between two adjacent frames. |  |
|  | h265:level | S32 | RK_S32 | The profile_idc parameter in the VPS: |  |
|  | h265:scaling_list | S32 | RK_S32 | Fixed at 1, Main profile |  |
|  | h265:cb_qp_offset | S32 | RK_S32 | Represents the level_idc parameter in VPS |  |
|  | h265:cr_qp_offset | S32 | RK_S32 | Represents the scaling_list_matrix mode in the<br>protocol syntax |  |
|  | h265:dblk_disable | S32 | RK_S32 | 0-flat matrix, 1-default matrix. |  |
|  | h265:dblk_alpha | S32 | RK_S32 | Indicates the chroma_cb_qp_offset value in the<br>protocol syntax. |  |
|  | h265:dblk_beta | S32 | RK_S32 | The valid range is [-12, 12]. |  |
|  | h265:qp_init | S32 | RK_S32 | Indicates the chroma_cr_qp_offset value in the<br>protocol syntax. |  |
|  | h265:qp_max | S32 | RK_S32 | The valid range is [-12, 12]. |  |
|  | h265:qp_min | S32 | RK_S32 | Indicates the deblock_disable flag in the protocol<br>syntax, and the valid range is [0, 2]. |  |
|  |  |  |  |  |  |

<!-- source: EN PDF p41; unit 276 -->

| Parameter string | Interface | Actual type | Description |
| --- | --- | --- | --- |
| h265:qp_max_i | S32 | RK_S32 | 0 – deblocking is enabled. |
| h265:qp_min_i | S32 | RK_S32 | Indicates the minimum I frame QP value. Do not<br>configure it under normal circumstances. |
| h265:qp_step | S32 | RK_S32 | Indicates the frame-level QP change amplitude<br>between two adjacent frames. |
| h265:qp_delta_ip | S32 | RK_S32 | Indicates the QP difference between the I frame and<br>the previous P frame. |
| jpeg: quant | S32 | RK_S32 | Indicates the quantization parameter level used by<br>the JPEG encoder. The encoder has a total of 11<br>levels of quantization coefficient tables, from 0 to<br>10, and the image quality is from poor to good. |
| split:mode | U32 | MppEncSplitMode | Represents the slice split mode of H.264/H.265<br>protocol<br>0– no split.<br>1– BY_BYTE divides the slice according to the slice<br>size.<br>2– BY_CTU divides the slice according to the number<br>of macroblocks or CTUs. |
| split:arg | U32 | RK_U32 | Slice cutting parameters:<br>In BY_BYTE mode, the parameter indicates the<br>maximum size of each slice.<br>In BY_CTU mode, the parameter indicates the<br>number of macroblocks or CTUs contained in each<br>slice. |

<!-- source: EN PDF p41; unit 277 -->

![Original technical figure, English PDF page 41](/docs/rockchip-mpp/assets/en-p041-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
typedef enum MppEncSplitMode_e {
    MPP_ENC_SPLIT_NONE,
    MPP_ENC_SPLIT_BY_BYTE,
    MPP_ENC_SPLIT_BY_CTU,
} MppEncSplitMode;
```

<!-- source: EN PDF p41; unit 278 -->

Other strings and parameters will be expanded later.

<!-- source: EN PDF p41; unit 279 -->

#### 3.5.2 Control other commands

<!-- source: EN PDF p41; unit 280 -->

The MpiCmd enumeration type defined in the rk_mpi_cmd.h file defines the control interface command word, where the commands related to the encoder and encoding process are as follows:

<!-- source: EN PDF p42; unit 281 -->

![Original technical figure, English PDF page 42](/docs/rockchip-mpp/assets/en-p042-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
MPP_ENC_CMD_BASE              = CMD_MODULE_CODEC | CMD_CTX_ID_ENC,
/* basic encoder setup control */
MPP_ENC_SET_CFG,              /* set MppEncCfg structure */
MPP_ENC_GET_CFG,              /* get MppEncCfg structure */
MPP_ENC_SET_PREP_CFG,         /* deprecated set MppEncPrepCfg structure, use MPP_ENC_SET_CFG instead */
MPP_ENC_GET_PREP_CFG,         /* deprecated get MppEncPrepCfg structure, use MPP_ENC_GET_CFG instead */
MPP_ENC_SET_RC_CFG,           /* deprecated set MppEncRcCfg structure, use MPP_ENC_SET_CFG instead */
MPP_ENC_GET_RC_CFG,           /* deprecated get MppEncRcCfg structure, use MPP_ENC_GET_CFG instead */
MPP_ENC_SET_CODEC_CFG,        /* deprecated set MppEncCodecCfg structure, use MPP_ENC_SET_CFG instead */
MPP_ENC_GET_CODEC_CFG,        /* deprecated get MppEncCodecCfg structure, use MPP_ENC_GET_CFG instead */
/* runtime encoder setup control */
MPP_ENC_SET_IDR_FRAME,        /* next frame will be encoded as intra frame */
MPP_ENC_SET_OSD_LEGACY_0,     /* deprecated */
MPP_ENC_SET_OSD_LEGACY_1,     /* deprecated */
MPP_ENC_SET_OSD_LEGACY_2,     /* deprecated */
MPP_ENC_GET_HDR_SYNC,         /* get vps / sps / pps which has better sync behavior parameter is MppPacket */
MPP_ENC_GET_EXTRA_INFO,       /* deprecated */
MPP_ENC_SET_SEI_CFG,          /* SEI: Supplement Enhancement Information, parameter is MppSeiMode */
MPP_ENC_GET_SEI_DATA,         /* SEI: Supplement Enhancement Information, parameter is MppPacket */
MPP_ENC_PRE_ALLOC_BUFF,       /* allocate buffers before encoding */
MPP_ENC_SET_QP_RANGE,         /* used for adjusting qp range, the parameter can be 1 or 2 */
MPP_ENC_SET_ROI_CFG,          /* set MppEncROICfg structure */
MPP_ENC_SET_CTU_QP,           /* for H265 Encoder,set CTU's size and QP */
```

<!-- source: EN PDF p42; unit 282 -->

The commands from MPP_ENC_CMD_BASE to MPP_ENC_CMD_END are the control interface commands of the encoder. Among them, the MPP_ENC_SET/GET_CFG configuration command has been introduced as the basic configuration command in 3.5.1. The rest of the commands are briefly described below, where the commands are related to the encoder hardware and only some hardware support.

<!-- source: EN PDF p42; unit 283 -->

At present, the encoder hardware supported by MPP is divided into vepu series and rkvenc series. The vepu series supports H.264 encoding, vp8 encoding and jpeg encoding, and is equipped in most RK chips. The rkvenc series only supports H.264 encoding, and is currently only available on the RV1109/RV1126 SoC, which supports more encoding functions than the vepu series.

<!-- source: EN PDF p42; unit 284 -->

Brief description of some CMD commands:

<!-- source: EN PDF p42; unit 285 -->

MPP_ENC_SET_PREP_CFG/ MPP_ENC_GET_PREP_CFG MPP_ENC_SET_RC_CFG/ MPP_ENC_GET_RC_CFG MPP_ENC_SET_CODEC_CFG/ MPP_ENC_GET_CODEC_CFG

<!-- source: EN PDF p42; unit 286 -->

Deprecated commands, reserved for forward compatibility, do not use.

<!-- source: EN PDF p42; unit 287 -->

MPP_ENC_SET_IDR_FRAME

<!-- source: EN PDF p42; unit 288 -->

There is no command parameter. It is used to request IDR frame to the encoder. After the encoder receives the request, it encodes the next frame to be an IDR frame. All hardware supports.

<!-- source: EN PDF p42; unit 289 -->

MPP_ENC_SET_OSD_LEGACY_0 MPP_ENC_SET_OSD_LEGACY_1 MPP_ENC_SET_OSD_LEGACY_2

<!-- source: EN PDF p42; unit 290 -->

Deprecated commands, reserved for forward compatibility, do not use.

<!-- source: EN PDF p42; unit 291 -->

MPP_ENC_GET_HDR_SYNC/ MPP_ENC_GET_EXTRA_INFO

<!-- source: EN PDF p42; unit 292 -->

The command used to obtain the stream header data separately. MPP_ENC_GET_EXTRA_INFO is an old command and is not recommended.

<!-- source: EN PDF p42; unit 293 -->

The input parameter of MPP_ENC_GET_HDR_SYNC is MppPacket, which requires external users to allocate space and encapsulate it as MppPacket and then control to the encoder. When the control interface returns, the data copy is completed and the thread is safe. The calling timing is after the basic configuration of the encoder is completed. The user needs to manually release the previously allocated The input parameter of MppPacket.MPP_ENC_GET_EXTRA_INFO is MppPacket*, and the internal MppPacket of the encoder will be obtained for access. The calling timing is after the basic configuration of the encoder is completed. It should be noted that the MppPacket obtained here is the internal space of the MPP and does not need to be released by the user.

<!-- source: EN PDF p43; unit 294 -->

In the case of multi-threading, the MppPacket obtained by the MPP_ENC_GET_EXTRA_INFO command may be modified by other controls during reading, so this command is not thread-safe and is only used for compatibility with the old vpu_api. Do not use it again.

<!-- source: EN PDF p43; unit 295 -->

MPP_ENC_SET_SEI_CFG/MPP_ENC_GET_SEI_DATA

<!-- source: EN PDF p43; unit 296 -->

Deprecated commands, reserved for forward compatibility, do not use.

<!-- source: EN PDF p43; unit 297 -->

MPP_ENC_PRE_ALLOC_BUFF/MPP_ENC_SET_QP_RANGE/MPP_ENC_SET_ROI_CFG/ MPP_ENC_SET_CTU_QP

<!-- source: EN PDF p43; unit 298 -->

Deprecated commands, reserved for forward compatibility, do not use.

<!-- source: EN PDF p43; unit 299 -->

MPP_ENC_GET_RC_API_ALL

<!-- source: EN PDF p43; unit 300 -->

Get the API information of the rate control strategy currently supported by MPP, enter the RcApiQueryAll* pointer, and fill in the structure content when returning.

<!-- source: EN PDF p43; unit 301 -->

MPP_ENC_GET_RC_API_BY_TYPE

<!-- source: EN PDF p43; unit 302 -->

Obtain the API information of all the rate control strategies of the specified MppCodingType type, enter the RcApiQueryType* pointer and specify MppCodingType, and the structure content will be filled in when returned.

<!-- source: EN PDF p43; unit 303 -->

MPP_ENC_SET_RC_API_CFG

<!-- source: EN PDF p43; unit 304 -->

Register the external rate control strategy API, and enter the RcImplApi* pointer. The function pointer in this structure defines the behavior of the rate control strategy plug-in. The rate control strategy after registration can be queried and activated.

<!-- source: EN PDF p43; unit 305 -->

MPP_ENC_GET_RC_API_CURRENT

<!-- source: EN PDF p43; unit 306 -->

Return the API information of the currently used rate control strategy, enter the RcApiBrief* pointer, and the content of the structure will be filled in when returning.

<!-- source: EN PDF p43; unit 307 -->

MPP_ENC_SET_RC_API_CURRENT

<!-- source: EN PDF p43; unit 308 -->

Activate the rate control strategy API of the specified name, enter the RcApiBrief* pointer, the encoder will search the rate control strategy API of the specified string name in RcApiBrief and activate it as the current rate control strategy.

<!-- source: EN PDF p43; unit 309 -->

MPP_ENC_SET_HEADER_MODE/MPP_ENC_GET_HEADER_MODE

<!-- source: EN PDF p43; unit 310 -->

Configure and obtain the SEI debugging information output method of the H.264/H.265 encoder. The debugging switch will be replaced by environment variables in the future. Do not use

<!-- source: EN PDF p43; unit 311 -->

MPP_ENC_SET_SPLIT/ MPP_ENC_GET_SPLIT

<!-- source: EN PDF p43; unit 312 -->

Configure and obtain slice split configuration information of H.264/H265 encoder, which has been replaced by split:mode and split:arg in MppEncCfg, do not use.

<!-- source: EN PDF p43; unit 313 -->

MPP_ENC_SET_REF_CFG

<!-- source: EN PDF p43; unit 314 -->

Configure the advanced reference frame mode of the encoder. By default, no configuration is required. It is used when the long-term reference frame and short-term reference frame reference relationship modes need to be configured. It is used to configure a special reference relationship mode. It is advanced interface to be more documented.

<!-- source: EN PDF p43; unit 315 -->

MPP_ENC_SET_OSD_PLT_CFG

<!-- source: EN PDF p44; unit 316 -->

The command parameter is MppEncOSDPlt, which is used to configure the OSD palette of the rkvenc series hardware. Used to configure the OSD palette of rkvenc series hardware, the command parameter is MppEncOSDPlt.It is usually configured only once at the beginning of the encoding, and the full encoding process uses a uniform palette. Only the RV1109/RV1126 series supports.

<!-- source: EN PDF p44; unit 317 -->

MPP_ENC_GET_OSD_PLT_CFG

<!-- source: EN PDF p44; unit 318 -->

used to separately obtain the code stream header data. Among them, MPP_ENC_GET_EXTRA_INFO is an old command and is not recommended for use.

<!-- source: EN PDF p44; unit 319 -->

MPP_ENC_SET_OSD_DATA_CFG

<!-- source: EN PDF p44; unit 320 -->

The command parameter is MppEncOSDData, which is used to configure the OSD data of the rkvenc series hardware.Used to configure OSD data of rkvenc series hardware, the command parameter is MppEncOSDData.It needs to be configured every frame, and needs to be reconfigured after each frame is encoded.This command is replaced by KEY_OSD_DATA in MppMeta with MppFrame and is no longer used.

<!-- source: EN PDF p44; unit 321 -->

### 3.6 Key points on encoder usage

<!-- source: EN PDF p44; unit 322 -->

#### 3.6.1 Width and height of input image and stride

<!-- source: EN PDF p44; unit 323 -->

The width and height configuration of the input image of the encoder needs to be consistent with the arrangement of the image data in the memory. Taking the 1920x1080 size YUV420 image coding as an example, referring to the description of the important parameters of Figure 7 MppFrame, it is assumed that there are two cases as follows:

<!-- source: EN PDF p44; unit 324 -->

![Original technical figure, English PDF page 44](/docs/rockchip-mpp/assets/en-p044-figure-01.png)

<!-- source: EN PDF p45; unit 325 -->

![Original technical figure, English PDF page 45](/docs/rockchip-mpp/assets/en-p045-figure-01.png)

<!-- source: EN PDF p45; unit 326 -->

Figure 18 Encoder input frame memory arrangement

<!-- source: EN PDF p45; unit 327 -->

Left case: the width of the luminance component is 1920, the height is 1080, the luminance data and the chrominance data are not directly connected, there are 8 blank lines in the middle.

<!-- source: EN PDF p45; unit 328 -->

In this case, the horizontal stride is 1920 and the vertical stride is 1088. The application needs to allocate space and write data in the size of 1920*1088*3\/2. Use the configuration of width 1920, height 1080, horizontal stride 1920, and vertical stride 1088. That is, the encoding can be performed normally.

<!-- source: EN PDF p45; unit 329 -->

Right case: The width of the luminance component is 1920 and the height is 1080. The luminance data and the chrominance data are directly connected, and there is no blank line in the middle.

<!-- source: EN PDF p45; unit 330 -->

In this case, the horizontal stride is 1920 and the vertical stride is 1080, but because the encoder accesses the data to 16 alignment, the chroma part will be read when reading the lower edge data of the brightness, and the lower edge of the chroma will be read. The data will be read out of the chroma data, and the user needs to provide extra space. The space here is 1920*1080*3\/2+1920*4 padding to ensure that the encoder does not access unallocated space.

<!-- source: EN PDF p45; unit 331 -->

#### 3.6.2 Encoder control information input method and expansion

<!-- source: EN PDF p45; unit 332 -->

There are two ways to input encoder control information:

<!-- source: EN PDF p45; unit 333 -->

One is global control information, such as code rate configuration, width and height configuration, etc., which affects the entire encoder and encoding process; the other is temporary control information, such as OSD configuration information per frame, user data information, etc., only Acts on the single frame encoding process.

<!-- source: EN PDF p45; unit 334 -->

The first type of control information is mainly configured through the control interface, and the second type of control information is mainly configured through the MppMeta interface carried by the MppFrame.

<!-- source: EN PDF p45; unit 335 -->

Future expansion of control information will follow these two rules.

<!-- source: EN PDF p46; unit 336 -->

#### 3.6.3 Encoder input and output process

<!-- source: EN PDF p46; unit 337 -->

At present, the encoder's default input interface only supports blocking calls, and the output interface supports non-blocking and blocking calls. The default is non-blocking calls. There may be a failure to obtain data. You need to pay attention to it in use.

<!-- source: EN PDF p46; unit 338 -->

#### 3.6.4 Plug-in custom rate control strategy mechanism

<!-- source: EN PDF p46; unit 339 -->

MPP supports users to define their own rate control strategy. The rate control strategy interface RcImplApi defines several hook functions on the encoding processing flow, which are used to insert user-defined processing methods in designated links. For specific usage, please refer to the default H.264/H.265 code control strategy implementation (default_h264e/default_h265e structure).

<!-- source: EN PDF p46; unit 340 -->

The code control plug-in mechanism is reserved in the MPP, and the interface and process are not stable. It is foreseeable that there will be many adjustments in the future. It is only recommended to users who have the ability to read and understand the code and continue to maintain and update this mechanism. The general users do not Recommended for use.

<!-- source: EN PDF p46; unit 341 -->

## 4\. MPP demo description

<!-- source: EN PDF p46; unit 342 -->

The demo program of MPP changes quickly. The following descriptions are for reference only. The actual operation results shall subject to practice. The operating environment of Demo is based on the Android 32bit platform.

<!-- source: EN PDF p46; unit 343 -->

### 4.1 Decoder demo

<!-- source: EN PDF p46; unit 344 -->

The decoder demo is the mpi_dec_test series programs including the single-threaded mpi_dec_test using the decode_put_packet and decode_get_frame interfaces, the multi-threaded mpi_dec_mt_test, and the multi- instance mpi_dec_multi_test.

<!-- source: EN PDF p46; unit 345 -->

The following is an example of using mpi_dec_test on the Android platform as an example. First run mpi_dec_test directly, help document can be printed in the log, as shown below:

<!-- source: EN PDF p47; unit 346 -->

![Original technical figure, English PDF page 47](/docs/rockchip-mpp/assets/en-p047-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
--------- beginning of main
08-16 05:00:51.320  2150  2150 I mpi_dec_utils: usage: mpi_dec_test [options]
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -i    input_file   input bitstream file
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -o    output_file  output decoded frame file
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -w    width        the width of input bitstream
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -h    height       the height of input bitstream
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -t    type         input stream coding type
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -f    format       output frame format type
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -n    frame_number max output frame number
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -s    instance_nb  number of instances
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -v    trace option q - quiet f - show fps
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -slt  slt file     slt verify data file
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -help help         show help
08-16 05:00:51.321  2150  2150 I mpi      : mpp coding type support list:
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: mpeg2         id 2
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: mpeg4         id 4
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: h.263         id 3
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: h.264/AVC     id 7
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: h.265/HEVC    id 16777220
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: vp8           id 9
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: VP9           id 10
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: avs+          id 16777221
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: avs2          id 16777223
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: jpeg          id 8
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: av1           id 16777224
08-16 05:00:51.321  2150  2150 I mpi      : type: enc id 1 coding: h.264/AVC     id 7
08-16 05:00:51.322  2150  2150 I mpi      : type: enc id 1 coding: jpeg          id 8
08-16 05:00:51.322  2150  2150 I mpi      : type: enc id 1 coding: h265          id 16777220
08-16 05:00:51.322  2150  2150 I mpi      : type: enc id 1 coding: vp8           id 9
```

<!-- source: EN PDF p47; unit 347 -->

The help document can be divided into two parts: command parameter descriptions of mpi_dec_test and the description of supported coding type of the input bitstream file.

<!-- source: EN PDF p47; unit 348 -->

The command parameter descriptions as follows.

<!-- source: EN PDF p47; unit 349 -->

| command parameter | descriptions |
| --- | --- |
| -i | input bitstream file |
| -o | output decoded frame file |
| -w | width of input bitstream, in pixels |
| -h | height of input bitstream, in pixels |
| -t | input bitstream coding type |
| -f | output frame format type, NV12 by default |
| -n | max output frame number. If input bitstream is too long,<br>only the first n frames can be decoded. |
| -s | number of instances, 1 by default |
| -v | trace option: q - quiet; f - show fps |
| -slt | slt verify data file corresponding to output decoded frame |
| -help | show help |

<!-- source: EN PDF p48; unit 350 -->

In the command parameters of mpi_dec_test, input file (i), coding type (t) is mandatory parameter. Other parameters such as output file (o), image width (w) image height (h), decoded frame number (n), etc. are optional parameters with less effect.

<!-- source: EN PDF p48; unit 351 -->

In the command parameter of mpi_dec_test, slt verify data file converts the output frame data into the corresponding cyclic redundancy check code (see utils/utils.c). The size of the slt file is often only a few kB. In the slt test of the chip, the comparison of the output frame file is converted to the comparison of the slt file, which can significantly shorten the test cycle.

<!-- source: EN PDF p48; unit 352 -->

The following print shows the encoding format supported by the MPP library. It supports MPEG2/4, H.263/4/5, and VP8/9 decoding. The number after the id is the parameter value after the -t item corresponding to the format. The parameter values are derived from the definition of OMX. The format parameter values of HEVC and AVS are quite different from other format parameter values, so you need to pay attention.

<!-- source: EN PDF p48; unit 353 -->

Take 30 frames of ocrean.h264 under /data/ as an example to introduce the demo and output. The command is:

<!-- source: EN PDF p48; unit 354 -->

```text
mpi_dec_test -t 7 -i /data/ocrean.h264 -n 30
```

<!-- source: EN PDF p48; unit 355 -->

where -t 7 indicates H.264 code stream, -i indicates input file, and -n 30 indicates decoding 30 frames. If everything is normal, the following result will be obtained:

<!-- source: EN PDF p48; unit 356 -->

![Original technical figure, English PDF page 48](/docs/rockchip-mpp/assets/en-p048-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
08-17 11:58:03.511  2801  2801 I mpi_dec_utils: input file /data/ocrean.h264 size 38052414
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: cmd parse result:
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: input  file name: /data/ocrean.h264
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: output file name:
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: width      :    0
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: height     :    0
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: type       :    7
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: max frames :   30
08-17 11:58:03.512  2801  2801 I mpi_dec_test: mpi_dec_test start
08-17 11:58:03.512  2801  2801 I mpp_info: mpp version: 6cc173d1 author: Ding Wei    2022-08-29 [hal_avsd]: Fix crash on avsd ref err path
08-17 11:58:03.512  2801  2801 I mpi_dec_test: 0xf1c40730 mpi_dec_test decoder test start w 0 h 0 type 7
08-17 11:58:03.538  2801  2805 I mpi_dec_test: 0xf1c40730 decode_get_frame get info changed found
08-17 11:58:03.538  2801  2805 I mpi_dec_test: 0xf1c40730 decoder require buffer w:h [1920:1088] stride [1920:1088] buf_size 4177920
08-17 11:58:03.538  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 0
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 1
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 2
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 3
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 4
08-17 11:58:03.586  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 5
08-17 11:58:03.601  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 6
08-17 11:58:03.608  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 7
08-17 11:58:03.616  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 8
08-17 11:58:03.624  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 9
08-17 11:58:03.640  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 10
08-17 11:58:03.647  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 11
08-17 11:58:03.655  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 12
08-17 11:58:03.664  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 13
08-17 11:58:03.673  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 14
08-17 11:58:03.681  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 15
08-17 11:58:03.689  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 16
08-17 11:58:03.698  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 17
08-17 11:58:03.698  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 18
08-17 11:58:03.706  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 19
08-17 11:58:03.713  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 20
08-17 11:58:03.726  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 21
08-17 11:58:03.726  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 22
08-17 11:58:03.734  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 23
08-17 11:58:03.742  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 24
08-17 11:58:03.749  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 25
08-17 11:58:03.756  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 26
08-17 11:58:03.764  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 27
08-17 11:58:03.771  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 28
08-17 11:58:03.778  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 29
08-17 11:58:03.778  2801  2801 I mpi_dec_test: decode 30 frames time 263 ms delay 69 ms fps 113.99
08-17 11:58:03.781  2801  2801 I mpi_dec_test: test success max memory 19.92 MB
```

<!-- source: EN PDF p48; unit 357 -->

The printed information contains the version information of the MPP library:

<!-- source: EN PDF p48; unit 358 -->

```text
I mpp_info: mpp version: 6cc173d1 author: Ding Wei 2022-08-29 [hal_avsd]: Fix crash on avsd
ref err path
```

<!-- source: EN PDF p49; unit 359 -->

```text
I mpi_dec_test: 0xeebc01c0 decode_get_frame get info changed found
```

<!-- source: EN PDF p49; unit 360 -->

The mpi_dec_test printing indicates that the MPP decoder has reported an info change event.

<!-- source: EN PDF p49; unit 361 -->

```text
I mpi_dec_test: 0xeebc01c0 decoder require buffer w:h [1920:1080] stride [1920:1088]
buf_size 4177920
```

<!-- source: EN PDF p49; unit 362 -->

The mpi_dec_test printing indicates that the image memory condition requested by the MPP decoder.

<!-- source: EN PDF p49; unit 363 -->

```text
I mpi_dec_test: 0xf1c40730 decode get frame 0
```

<!-- source: EN PDF p49; unit 364 -->

The mpi_dec_test printing indicates that the decoder is decoding and outputting images normally.

<!-- source: EN PDF p49; unit 365 -->

```text
I mpi_dec_test: decode 30 frames time 263ms delay 69ms fps 113.99
```

<!-- source: EN PDF p49; unit 366 -->

The mpi_dec_test printing indicates that the decoder uses 263ms to decode 30 frames, first frame delays 69ms, fps is 113.99.

<!-- source: EN PDF p49; unit 367 -->

```text
I mpi_dec_test: test success max memory 19.92 MB
```

<!-- source: EN PDF p49; unit 368 -->

The mpi_dec_test printing indicates that max memory of decoding is 19.92 MB.

<!-- source: EN PDF p49; unit 369 -->

See the test/mpi_dec_test.c for detailed decoder demo source code.

<!-- source: EN PDF p49; unit 370 -->

### 4.2 Encoder demo

<!-- source: EN PDF p49; unit 371 -->

The encoder demo is the mpi_enc_test series programs, including single-threaded mpi_enc_test and multi- instance mpi_enc_multi_test.

<!-- source: EN PDF p49; unit 372 -->

Take mpi_enc_test on the Android platform as an example. First run mpi_enc_test directly, output is shown below:

<!-- source: EN PDF p50; unit 373 -->

![Original technical figure, English PDF page 50](/docs/rockchip-mpp/assets/en-p050-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: usage: mpi_enc_test [options]
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -i       input_file    input frame file
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -o       output_file   output encoded bitstream file
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -w       width         the width of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -h       height        the height of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -hstride hor_stride    the horizontal stride of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -vstride ver_stride    the vertical stride of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -f       format        the format of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -t       type          output stream coding type
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -tsrc    source type   input file source coding type
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -n       max frame number max encoding frame number
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -g       gop reference mode gop_mode:gop_len:vi_len
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -rc      rate control mode set rc_mode
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -bps     bps target:min:max set target/min/max bps and rc_mode
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -fps     in/output fps set input and output frame rate
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -q       quality control set qp_init/min/max/min_i/max_i
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -s       instance_nb   number of instances
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -v       trace option  q - quiet f - show fps
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -l       loop count    looping times for each frame
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -ini     ini file      encoder extra ini config file
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -slt     slt file      slt verify data file
08-16 10:41:16.339  2526  2526 I mpi      : mpp coding type support list:
08-16 10:41:16.339  2526  2526 I mpi      : type: dec id 0 coding: mpeg2         id 2
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: mpeg4         id 4
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: h.263         id 3
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: h.264/AVC     id 7
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: h.265/HEVC    id 16777220
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: vp8           id 9
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: VP9           id 10
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: avs+          id 16777221
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: avs2          id 16777223
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: jpeg          id 8
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: av1           id 16777224
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: h.264/AVC     id 7
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: jpeg          id 8
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: h265          id 16777220
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: vp8           id 9
08-16 10:41:16.340  2526  2526 I mpi      : mpp color support list:
08-16 10:41:16.340  2526  2526 I mpi      : color: id 0     0x00000 YUV420SP,         NV12
08-16 10:41:16.340  2526  2526 I mpi      : color: id 1     0x00001 YUV420SP-10bit
08-16 10:41:16.340  2526  2526 I mpi      : color: id 2     0x00002 YUV422SP,         NV24
08-16 10:41:16.340  2526  2526 I mpi      : color: id 3     0x00003 YUV422SP-10bit
08-16 10:41:16.340  2526  2526 I mpi      : color: id 4     0x00004 YUV420P,          I420
08-16 10:41:16.340  2526  2526 I mpi      : color: id 5     0x00005 YUV420SP,         NV21
08-16 10:41:16.340  2526  2526 I mpi      : color: id 6     0x00006 YUV422P,          422P
08-16 10:41:16.340  2526  2526 I mpi      : color: id 7     0x00007 YUV422SP,         NV42
08-16 10:41:16.340  2526  2526 I mpi      : color: id 8     0x00008 YUV422-YUYV,      YUY2
08-16 10:41:16.340  2526  2526 I mpi      : color: id 10    0x0000a YUV422-UYVY,      UYVY
08-16 10:41:16.340  2526  2526 I mpi      : color: id 12    0x0000c YUV400-Y8,        Y800
08-16 10:41:16.340  2526  2526 I mpi      : color: id 15    0x0000f YUV444SP
08-16 10:41:16.340  2526  2526 I mpi      : color: id 16    0x00010 YUV444P
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65536 0x10000 RGB565
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65537 0x10001 BGR565
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65538 0x10002 RGB555
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65539 0x10003 BGR555
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65542 0x10006 RGB888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65543 0x10007 BGR888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65546 0x1000a ARGB8888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65547 0x1000b ABGR8888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65548 0x1000c BGRA8888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65549 0x1000d RGBA8888
```

<!-- source: EN PDF p50; unit 374 -->

The help document can be divided into three parts:

<!-- source: EN PDF p50; unit 375 -->

(1) mpi_enc_test command parameter descriptions;

<!-- source: EN PDF p50; unit 376 -->

(2) the coding type description of the output encoded bitstream file;

<!-- source: EN PDF p50; unit 377 -->

(3) the format description of the input picture.

<!-- source: EN PDF p50; unit 378 -->

The command parameter descriptions as follows.

<!-- source: EN PDF p51; unit 379 -->

| command parameter | descriptions |
| --- | --- |
| -i | input frame file |
| -o | output encoded bitstream |
| -w | width of input bitstream, in pixels |
| -h | height of input bitstream, in pixels |
| -hstride | the horizontal stride of input picture, in byte |
| -vstride | the vertical stride of input picture, in 1 |
| -f | the format of input picture, NV12 by default |
| -t | output stream coding type |
| -tsrc | input file source coding type, only used in the codec performance test<br>(see mpi_rc2_test.c) |
| -n | max encoding frame number. If input bitstream is too long, only the first n<br>frames can be decoded. |
| -g | gop reference mode |
| -rc | set rc_mode, 0:vbr 1:cbr 2:fixqp 3:avbr |
| -bps | set bit rate |
| -fps | set input and output frame rate, 30 by default. This command parameter<br>only describes the proportional relationship between the input frame rate<br>and the output frame rate, which is to related to the real frame rate. |
| -qc | set quality control |
| -s | number of instances, 1 by default |
| -v | trace option: q - quiet; f - show fps |
| -ini | encoder extra ini config file(not yet in effect) |
| -slt | slt verify data file corresponding to output encoded bitstream |

<!-- source: EN PDF p51; unit 380 -->

mpi_enc_test command parameters, image width (w), image height (h), and coding type (t) are mandatory configuration parameters, while other parameters such as input file (i), output file (o), encoding frame number (n), and the format of input picture(f) are optional parameters. If no input file is specified, mpi_enc_test will generate a default color bar image for encoding.

<!-- source: EN PDF p51; unit 381 -->

mpi_enc_test command parameters provide diversified bit rate control schemes, allowing users to control the bit rate of the output stream through bit rate control mode and bit rate constraint parameter. The bit rate control mode is divided into variable bit rate mode (VBR), fixed bit rate mode (CBR), QP-adjusted bit rate mode (FIXQP), and adaptive bit rate mode (AVBR), with the default mode being VBR; the bit rate constraint parameter provides reference for configuring bit rate boundaries within MPP.

<!-- source: EN PDF p52; unit 382 -->

The format for input/output frame rate control (fps) in mpi_enc_test command parameters is:

<!-- source: EN PDF p52; unit 383 -->

```text
-fps fps_in_num:fps_in_den:fps_in_flex/fps_out_num:fps_out_den:fps_out_flex
```

<!-- source: EN PDF p52; unit 384 -->

where in/out represents input/output, num represents the numerator, den represents the denominator, and flex being 0 indicates fixed frame rate and 1 indicates variable frame rate. The default num and den for input and output are 30 and 1, respectively, indicating a default input/output frame rate of 30. This command parameter only indicates the proportional relationship between input frame rate and output frame rate, and is independent of the actual frame rate.

<!-- source: EN PDF p52; unit 385 -->

In mpi_enc_test command parameters, quality control only takes effect when the output stream format is H.264, H.265, VP8, or JPEG. The command format is:

<!-- source: EN PDF p52; unit 386 -->

```text
-qc qp_init/min/max/min_i/max_i
```

<!-- source: EN PDF p52; unit 387 -->

where qp represents quality parameters, init represents the initial value, min represents the minimum value, max represents the maximum value; the suffix i indicates the maximum value of I frames if unspecified, representing B and P frames.

<!-- source: EN PDF p52; unit 388 -->

In mpi_enc_test command parameters, if the logging option (v) is set to q, MPP daily logging will be disabled; if set to f, the average frame rate and current frame rate will be printed once every second.

<!-- source: EN PDF p52; unit 389 -->

Image color space formats are divided into YUV and RGB. MPP supports multiple formats (f), with different parameter values corresponding to different layouts; it is worth noting that there are significant differences between YUV and RGB format parameter values.

<!-- source: EN PDF p52; unit 390 -->

Taking encoding of ocrean.yuv under the directory /data with 30 frames as an example, the corresponding demo and output are described. The running command is:

<!-- source: EN PDF p52; unit 391 -->

```text
mpi_enc_test -w 1920 -h 1080 -t 7 -i /data/ocrean.yuv -o /data/out.h264 -n 30
```

<!-- source: EN PDF p52; unit 392 -->

If everything is normal, the following result will be obtained:

<!-- source: EN PDF p53; unit 393 -->

![Original technical figure, English PDF page 53](/docs/rockchip-mpp/assets/en-p053-figure-01.png)

Copyable transcription of the figure code/log (source text retained; not a claim of executable readiness):

```text
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: cmd parse result:
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: input  file name: /data/ocrean.yuv
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: output file name: /data/out.h264
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: width     : 1920
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: height    : 1080
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: format    :    0
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: type      :    7
08-17 11:54:12.842  2790  2791 I mpi_enc_test: mpi_enc_test start
08-17 11:54:12.844  2790  2791 I mpp_info: mpp version: 6cc173d1 author: Ding Wei    2022-08-29 [hal_avsd]: Fix crash on avsd ref err path
08-17 11:54:12.844  2790  2791 I mpi_enc_test: 0xe9a806d0 encoder test start w 1920 h 1080 type 7
08-17 11:54:12.846  2790  2792 I mpp_enc : MPP_ENC_SET_RC_CFG bps 7776000 [486000 : 8262000] fps [30:30] gop 60
08-17 11:54:12.846  2790  2792 I h264e_api_v2: MPP_ENC_SET_PREP_CFG w:h [1920:1080] stride [1920:1080]
08-17 11:54:12.846  2790  2792 I mpp_enc : send header for set cfg change input/format/color
08-17 11:54:12.846  2790  2792 I mpp_enc : mode vbr bps [486000:7776000:8262000] fps fix [30/1] -> fix [30/1] gop i [60] v [0]
08-17 11:54:12.867  2790  2791 I mpi_enc_test: chn 0 encoded frame 0  size 218616 qp 11
08-17 11:54:12.878  2790  2791 I mpi_enc_test: chn 0 encoded frame 1  size 53379  qp 16
08-17 11:54:12.889  2790  2791 I mpi_enc_test: chn 0 encoded frame 2  size 44736  qp 18
08-17 11:54:12.899  2790  2791 I mpi_enc_test: chn 0 encoded frame 3  size 46086  qp 19
08-17 11:54:12.910  2790  2791 I mpi_enc_test: chn 0 encoded frame 4  size 49246  qp 19
08-17 11:54:12.921  2790  2791 I mpi_enc_test: chn 0 encoded frame 5  size 44351  qp 21
08-17 11:54:12.932  2790  2791 I mpi_enc_test: chn 0 encoded frame 6  size 45968  qp 21
08-17 11:54:12.945  2790  2791 I mpi_enc_test: chn 0 encoded frame 7  size 39819  qp 22
08-17 11:54:12.956  2790  2791 I mpi_enc_test: chn 0 encoded frame 8  size 40786  qp 22
08-17 11:54:12.968  2790  2791 I mpi_enc_test: chn 0 encoded frame 9  size 29039  qp 22
08-17 11:54:12.993  2790  2791 I mpi_enc_test: chn 0 encoded frame 10 size 30438  qp 23
08-17 11:54:13.017  2790  2791 I mpi_enc_test: chn 0 encoded frame 11 size 38220  qp 23
08-17 11:54:13.042  2790  2791 I mpi_enc_test: chn 0 encoded frame 12 size 35324  qp 24
08-17 11:54:13.068  2790  2791 I mpi_enc_test: chn 0 encoded frame 13 size 36299  qp 24
08-17 11:54:13.093  2790  2791 I mpi_enc_test: chn 0 encoded frame 14 size 36672  qp 24
08-17 11:54:13.120  2790  2791 I mpi_enc_test: chn 0 encoded frame 15 size 36288  qp 25
08-17 11:54:13.147  2790  2791 I mpi_enc_test: chn 0 encoded frame 16 size 30886  qp 26
08-17 11:54:13.173  2790  2791 I mpi_enc_test: chn 0 encoded frame 17 size 31390  qp 25
08-17 11:54:13.199  2790  2791 I mpi_enc_test: chn 0 encoded frame 18 size 32035  qp 26
08-17 11:54:13.223  2790  2791 I mpi_enc_test: chn 0 encoded frame 19 size 30808  qp 26
08-17 11:54:13.248  2790  2791 I mpi_enc_test: chn 0 encoded frame 20 size 32234  qp 26
08-17 11:54:13.272  2790  2791 I mpi_enc_test: chn 0 encoded frame 21 size 31154  qp 26
08-17 11:54:13.297  2790  2791 I mpi_enc_test: chn 0 encoded frame 22 size 30745  qp 26
08-17 11:54:13.323  2790  2791 I mpi_enc_test: chn 0 encoded frame 23 size 32082  qp 26
08-17 11:54:13.349  2790  2791 I mpi_enc_test: chn 0 encoded frame 24 size 31948  qp 26
08-17 11:54:13.374  2790  2791 I mpi_enc_test: chn 0 encoded frame 25 size 27847  qp 27
08-17 11:54:13.400  2790  2791 I mpi_enc_test: chn 0 encoded frame 26 size 31434  qp 27
08-17 11:54:13.427  2790  2791 I mpi_enc_test: chn 0 encoded frame 27 size 31533  qp 27
08-17 11:54:13.453  2790  2791 I mpi_enc_test: chn 0 encoded frame 28 size 31289  qp 27
08-17 11:54:13.478  2790  2791 I mpi_enc_test: chn 0 encoded frame 29 size 32659  qp 27
08-17 11:54:13.480  2790  2790 I mpi_enc_test: chn 0 encode 30 frames time 628 ms delay 4 ms fps 47.72 bps 10265048
08-17 11:54:13.481  2790  2790 I mpi_enc_test: mpi_enc_test average frame rate 47.72
```

<!-- source: EN PDF p53; unit 394 -->

Log introduction related to the decoder demo have been omitted.

<!-- source: EN PDF p53; unit 395 -->

```text
I mpp_enc: MPP_ENC_SET_RC_CFG bps 7776000 [486000:8262000] fps [30:30] gop 60
```

<!-- source: EN PDF p53; unit 396 -->

Default bitrate control parameters for the encoder, with a target bitrate of 7.8 Mbps, a lower reference bitrate of 0.5 Mbps, and an upper reference bitrate of 8.3 Mbps. The default input and output frame rate is 30, and the default GOP size is 60.

<!-- source: EN PDF p53; unit 397 -->

```text
I mpi_enc_test: chn 0 encoded frame 0 size 218616 qp 11
```

<!-- source: EN PDF p53; unit 398 -->

The mpi_enc_test printing indicates that the encoder is encoding normally. The size of the output single-frame bitstream is 0.2 M, and the quality parameter is 11.

<!-- source: EN PDF p53; unit 399 -->

```text
I mpi_enc_test: chn 0 encode 30 frames time 628 ms delay 4 ms fps 47.72 bps 10265048
```

<!-- source: EN PDF p53; unit 400 -->

The mpi_enc_test printing indicates that the encoder encoded 30 frames within 628 ms, with a delay of 4 ms for the first frame. The frame rate is 47.72 fps, and the bitrate is 10.2 Mbps.

<!-- source: EN PDF p53; unit 401 -->

```text
I mpi_enc_test: mpi_enc_test average frame rate 47.72
```

<!-- source: EN PDF p53; unit 402 -->

The mpi_enc_test printing indicates that the average frame rate of the encoder is 47.72 fps.

<!-- source: EN PDF p53; unit 403 -->

The encoder's control parameters can also be configured through environment variables. In the Android environment, the command for configuring environment variables is:

<!-- source: EN PDF p54; unit 404 -->

```text
setprop <control parameter> value
```

<!-- source: EN PDF p54; unit 405 -->

In the Linux environment, the command for configuring environment variables is:

<!-- source: EN PDF p54; unit 406 -->

```text
export <control parameter>=value
```

<!-- source: EN PDF p54; unit 407 -->

The corresponding descriptions are as follows:

<!-- source: EN PDF p55; unit 408 -->

| Control<br>Parameter | Type | Description |
| --- | --- | --- |
| constraint_set | RK_U32 | Only effective for H.264 bitstream, corresponding to the<br>constraint_set0_flag to constraint_set5_flag in the syntax. The forced<br>flag force_flag and forced constraint parameter constraint_force are<br>stored in the format: &#124; 00 &#124; force_flag &#124; 00 &#124; constraint_force &#124; Only<br>the lower 6 bits are valid, corresponding to constraint_set5_flag to<br>constraint_set0_flag. When force_flag is 1, the corresponding<br>constraint_set is configured to the encoder. |
| split_mode | RK_U32 | Encoder split mode. 0: No split. 1: divides the slice according to the<br>slice size. 2: divides the slice according to the number of macroblocks<br>or CTUs. |
| split_arg | RK_U32 | split_arg takes effect only when encoder split_mode is enabled. When<br>by byte, this parameter is the byte limit for each slice; when by CTU,<br>this parameter is the CTU limit for each slice. |
| split_out | RK_U32 | Split output mode, effective only when encoder splitting mode is<br>enabled. 1: Low delay output mode; 2:Segment information output<br>mode. Under low delay output mode, the encoder outputs each slice<br>with low delay; under segment information output mode, the encoder<br>encapsulates segment information for each slice. |
| sei_mode | RK_U32 | SEI write mode. 0: No SEI write; 1: Sequence write mode; 2: Frame<br>write mode. Under sequence write mode, there is only one SEI for each<br>GOP; under frame write mode, SEI will also be added before each<br>frame if SEI information changes. |
| gop_mode | RK_U32 | gop reference mode. If the environment variable gop_mode is not<br>configured, it will be configured according to the command parameter;<br>otherwise, it will be configured according to the environment variable. |
| osd_enable | RK_U32 | Enable OSD palette. |
| osd_mode | RK_U32 | OSD palette mode, effective only after enabling OSD palette. 0: Default<br>configuration; 1: User-defined configuration. |
| roi_enable | RK_U32 | Enable ROI testing and use the platform's default roi_type<br>configuration. |
| roi_type | RK_U32 | Forced configuration of roi_type. |
| user_data_enable | RK_U32 | Enable user data. |

<!-- source: EN PDF p55; unit 409 -->

The specific code of the encoder demo can be found in test/mpi_enc_test.c, but the current encoder demo uses the enqueue/dequeue interface mode, which will be modified later.

<!-- source: EN PDF p56; unit 410 -->

### 4.3 Utilities

<!-- source: EN PDF p56; unit 411 -->

MPP provides some tool programs for unit testing, which can test the hardware and software platform and the MPP library itself.

<!-- source: EN PDF p56; unit 412 -->

mpp_info_test

<!-- source: EN PDF p56; unit 413 -->

Used to read and print the version information of the MPP library. When feeding back the problem, you can attach the printed information.

<!-- source: EN PDF p56; unit 414 -->

mpp_buffer_test

<!-- source: EN PDF p56; unit 415 -->

Used to test whether kernel memory allocator is normal or not.

<!-- source: EN PDF p56; unit 416 -->

mpp_mem_test

<!-- source: EN PDF p56; unit 417 -->

Used to test whether memory allocator of the C library is normal or not.

<!-- source: EN PDF p56; unit 418 -->

mpp_runtime_test

<!-- source: EN PDF p56; unit 419 -->

Used to test whether some hardware and software running environment is normal.

<!-- source: EN PDF p56; unit 420 -->

mpp_platform_test

<!-- source: EN PDF p56; unit 421 -->

Used to read and test whether the chip platform information is normal.

<!-- source: EN PDF p56; unit 422 -->

## 5\. MPP library compiling and use

<!-- source: EN PDF p56; unit 423 -->

### 5.1 Download source code

<!-- source: EN PDF p56; unit 424 -->

The MPP source code is released at the official address: https://github.com/rockchip-linux/mpp

<!-- source: EN PDF p56; unit 425 -->

The release branch is the release branch, the development branch is the develop branch, and the default is the development branch.

<!-- source: EN PDF p56; unit 426 -->

The command of download: git clone https://github.com/rockchip-linux/mpp.git

<!-- source: EN PDF p56; unit 427 -->

### 5.2 Compiling

<!-- source: EN PDF p56; unit 428 -->

The MPP source code compilation script is cmake. It depends on the version above 2.8.12. It is recommended to use the 3.x version. cmake-3.28 version verification passed. Using the high version of the cmake tool may generate more warnings.

<!-- source: EN PDF p57; unit 429 -->

#### 5.2.1 Android platform cross-compiling

<!-- source: EN PDF p57; unit 430 -->

Compiling the Android library requires the ndk environment, and the default script is compiled using android- ndk-r16b. Both android-ndk-r16b and android-ndk-r25c are verified. The former applies to sdks below android 14, and the latter applies to sdks above android 14.

<!-- source: EN PDF p57; unit 431 -->

Take the r16b ndk for example:

<!-- source: EN PDF p57; unit 432 -->

The download path for r16b ndk can be found in the build/android/ndk_links.md file in the source directory.

<!-- source: EN PDF p57; unit 433 -->

Unzip the downloaded ndk to /home/pub/ndk/android-ndk-r16b, or manually modify the ANDROID_NDK variable path of the env_setup.sh script in the build/android/ directory.

<!-- source: EN PDF p57; unit 434 -->

Go to the build/android/arm/ directory, run the make-Android.bash script to generate the Makefile for compilation, and run make –j16 to compile.

<!-- source: EN PDF p57; unit 435 -->

#### 5.2.2 Unix/Linux platform compiling

<!-- source: EN PDF p57; unit 436 -->

First configure the toolchain in the arm.linux.cross.cmake file in the build/linux/arm/ directory, then run the make-Makefiles.bash script to generate the Makefile via cmake, and finally run make –j16 to compile.

<!-- source: EN PDF p57; unit 437 -->

MPP also supports compiling directly on Debian running on the development board.

<!-- source: EN PDF p57; unit 438 -->

## 6\. Frequently Asked Questions

<!-- source: EN PDF p57; unit 439 -->

Q: Aarch64 compile error, the error is undefined reference to `system_property_get`.

<!-- source: EN PDF p57; unit 440 -->

A: This is a problem with google 64bit ndk. Some symbol definitions are missing from libc.so. For the problem, see:

<!-- source: EN PDF p57; unit 441 -->

[http://stackoverflow.com/questions/28413530/api-to-get-android-system-properties-is-removed-in-arm64-platforms](http://stackoverflow.com/questions/28413530/api-to-get-android-system-properties-is-removed-in-arm64-platforms)

<!-- source: EN PDF p57; unit 442 -->

Solution: MPP has put the corresponding libc.so into the build/android/aarch64/fix/ directory, copy the library to the path_to_ndk/platforms/android-21/arch-arm64/usr/lib/ path. You just need recompiling.

<!-- source: EN PDF p57; unit 443 -->

Q: When running, the following kernel log will be printed, is there a problem?

<!-- source: EN PDF p57; unit 444 -->

vpu_service_ioctl:1844: error: unknow vpu service ioctl cmd 40086c01

<!-- source: EN PDF p57; unit 445 -->

A: No problem, mpp has some dependencies on the kernel driver, the kernel driver has different versions of the interface, mpp will make multiple attempts. If it fails, it will try another interface. This print is printed when the attempt fails and will only be printed once. This print can be ignored.

<!-- source: EN PDF p57; unit 446 -->

Q: How to analyze the problem of abnormal MPP operation?

<!-- source: EN PDF p57; unit 447 -->

A: First analyze the error log. If there is a log that fails to open the kernel device, you need to analyze whether the hardware device configuration file of the video codec of the kernel platform is available, and then submit the problem to redmine. After analyzing the operating environment problem, analyze the MPP operation Internal issue.

{% endraw %}
