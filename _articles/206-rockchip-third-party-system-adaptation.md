---
title: "Rockchip Third-Party System Adaptation Guide"
description: "Rockchip Third-Party System Adaptation Guide — V1.0.2"
excerpt: "Rockchip Third-Party System Adaptation Guide"
translation_key: "206-rockchip-third-party-system-adaptation"
slug: "206-rockchip-third-party-system-adaptation"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, Debian]
---

{% raw %}

# Rockchip Third-Party System Adaptation Guide

ArmSoM platform reference, RK-KF-YF-917 V1.0.2, Chinese/English 9/10 pages. Source scope: RK3568/Linux 4.19 and RK3588/Linux 5.10, mainly Debian-like userspace libraries and services. This does not guarantee installation on every ArmSoM board. Verify the actual SoC, SDK/BSP, kernel, architecture, package ABI, GPU, camera and wireless module. Commands are source examples, not executed on ArmSoM hardware.

Both sources are V1.0.2; all eight chapters, both tables and every example are retained. No technical figures occur. §4.1 says opengl while the table and §4.6 say opengles; this contradiction is preserved, not presented as a current support matrix. The §5.5 uri/file/quotes/display sink command is an incomplete source example. In §6.2 English has `/tmp /0.yuv` with a space, versus Chinese `/tmp/0.yuv`. Source spellings are retained and flagged; verify actual syntax and nodes before use.

## 1. Hardware Adaptation Required on RK Platform

GPU: Graphics Processing Unit, it is also known as display core, vision processor, mainly used to accelerate geometric transformations and light processing, cubic mapping and vertex blending, texture compression and bump mapping, dual-texture quad-pixel 256-bit rendering engine, etc. At present, the GPU hardware of RK platform has been integrated into the SOC. RGA: 2D graphics accelerator, used to accelerate the rotation, cropping, scaling and other operations of 2D graphics. At present, the RGA hardware of RK platform has been integrated into the SOC. VPU: Video Processing Unit, used to accelerate video codec, supports multiple formats. At present, the VPU hardware of RK platform has been integrated into the SOC. ISP: The key function of ISP is to do post-processing on the signal output from front-end image sensor. At present, the ISP hardware of RK platform has been integrated into the SOC. NPU: The embedded Neural-Network Processing Unit, adopts the "data-driven parallel computing" architecture, and it is especially good at processing massive multimedia data such as video and images. The NPU processor is specially designed for the artificial intelligence of the Internet of Things, which is used to accelerate the operation of the neural network and solve the problem of low efficiency of traditional chips in the operation of the neural network. At present, the NPU hardware of RK platform has been integrated into the SOC. Wi-Fi/BT: A short distance communication module adapted to the development board.

## 2. Software Adaptation on RK platform

| Source Code Path | Description |
| --- | --- |
| SDK/external/libmali | User mode function interfaces for hardware gpu<br>which is currently provided by RK platform, mainly<br>opengles general interface, the current mainstream<br>debian-like display frameworks include xserver and<br>wayland, the software interface used by APPs that<br>adapted to the system should make corresponding<br>changes. |
| SDK/external/xserver | Currently, RK platform has a patch for xserver<br>hardware acceleration. If your displays framework<br>using xserver, please refer to the patch adaptation of<br>this repository. |
| SDK/external/linux-rga | User mode function interface for hardware RGA<br>currently provided by RK platform. |
| SDK/external/mpp | User mode function interface for hardware VPU<br>currently provided by RK platform. |
| SDK/external/rknpu2 | User mode function interface for hardware NPU<br>currently provided by RK platform. |
| SDK/external/camera_engine_rkaiq | User mode function interface for hardware ISP user<br>mode currently provided by RK platform. |
| SDK/external/drm-cursor | User mode function interface for hardware mouse<br>layer currently provided by RK platform. |

## 3. Special Notes of Software Development Adaptation

When adapting software, debian-like systems may have many version dependencies. If the installation of the following packages fails, you need to re-arrange the source code to your target device for compilation. Compile command:

```text
cd 'Source code directory'
sudo apt build-dep .
sudo DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d  -us
```

## 4. Display Services Adaptation

### 4.1 overview

The display service on a debian-like system consists of the following parts: Display application + graphics display framework + graphics display interface + processing graphics display hardware Currently, the mainstream display applications include x11, gnome,kde, xfce4,sdl2 and so on. The graphic display framework mainly includes wayland, xserver and gbm. For rockchip, currently, only opengl are supported by graphics display interfaces. Naturally, the hardware processing graphics display is GPU. The following lists the combination of several display frameworks: (Pay attention to the writing time of this document, For details, please refer to their official websites)

| Display<br>application | Supported graphical display<br>framework | Supported graphical display<br>interfaces |
| --- | --- | --- |
| x11 | xserver | opengles/gbm |
| gnome | xserver/wayland | opengles/gbm |
| kde | xserver/wayland | opengles/gbm |
| xfce4 | xserver | opengles/gbm |
| sdl2 | xserver/wayland | opengles/gbm |

According to the table above, when adapting a debian system, it is important to know the front end (i.e. what the display application is), and then to know whether the graphics framework uses xserver or wayland to make appropriate adaptations.

### 4.2 GPU Adaptation

Firstly, check the display framework used in your system, xserver or wayland(currently only these two frameworks are supported) and then install SDK/debian/packages/"ARCH"/libmali/libmali-***.deb For example, if the system uses x11 on the rk3588 platform, and the GPU model used on the rk3588 platform is valhall-g610-g6p0, then you should install:

```text
SDK/debian/packages/arm64/libmali/libmali-valhall-g610-g6p0-x11_1.9-1_arm64.deb
```

### 4.3 RGA Adaptation

Installation package:

```text
SDK/debian/packages/'ARCH'/rga/*.deb
```

### 4.4 drm-cursor Adaptation

Installation package:

```text
SDK/debian/packages/arm64/libdrm-cursor/*.deb
```

### 4.5 xserver Adaptation

Because there are many versions of xserver, you have to check the version of xserver used in your system first, and then porting to your version of xserver based on our source code patch, and then rebuild. Generated patch:

```text
cd 'source directory'

git format-patch e4f4521ca
```

The following is the compiled installation package of version 1.20.11:

```text
SDK/debian/packages/'ARCH'/xserver/xserver-common_1.20.11-1_all.deb

SDK/debian/packages/'ARCH'/xserver/xserver-xorg-core_1.20.11-1_'ARCH'.deb

SDK/debian/packages/'ARCH'/xserver/xserver-xorg-legacy_1.20.11-1_'ARCH'.deb
```

xserver also needs a boot script to do some initialization operations. If it is a debian-like system, you can try to copy the boot script into the system. If not, please refer to the script to configure it yourself:

```text
SDK/debian/overlay/etc/X11
```

### 4.6 How to Verify If the Adaptation Is Successful

Display service acceleration uses the standard interface of opengles. If your system uses opengl, please porting it to opengles. If the adaptation is successful, when rendering the screen or dragging the window, check the platform-related gpu node, there will be changes in gpu utilization , such as RK3588 platform:

```text
cat /sys/devices/platform/fb000000.gpu/utilisation
```

Note: The gpu nodes of different platforms are different.

## 5. Codec Service Adaptation

### 5.1 overview

The codec service consists of the following parts: Upper layer multimedia framework software + middle layer mpp + hardware codec The upper codec frameworks commonly used in the open source community include gstreamer, etc. gstreamer is used as an example to demonstrate in the following. The middle layer mpp library serves as the middle layer of common third-party software (such as gstreamer) and hardware codecs.

### 5.2 mpp Adaptation

Installation package:

```text
SDK/debian/packages/'ARCH'/mpp/*.deb
```

Note: For permission settings of some nodes, please refer to

```text
SDK/debian/overlay/etc/udev/rules.d/99-rockchip-permissions.rules
```

To verify whether mpp is configured successfully:

```text
# mpi_enc_test -w 1920 -h 1080 -t 7 -o /tmp/test.h264
# mpi_dec_test -w 1920 -h 1080 -t 7 -i /tmp/test.h264
```

### 5.3 Multimedia Software Adaptation

There are many multimedia frameworks for customers. It is recommended that customers' player can directly call the interface of mpp to adapt the video codec. Please refer to the interface document of mpp "Rockchip_Developer_Guide_MPP_CN.pdf" for details.

### 5.4 GStreamer Adaptation

A precompiled package for gst-base is currently adapted by RK platform.:

```text
SDK/debian/packages/'ARCH'/gst-plugins-base1.0/*.deb
SDK/debian/packages/'ARCH'/gst-plugins-bad1.0/*.deb
SDK/debian/packages/'ARCH'/gst-plugins-good1.0/*.deb
```

RK platform also supports GStreamer general multimedia framework. You need to install the official GStreamer components in advance (you can also install the gst-base precompiled package mentioned above, if your system version is compatible), and then install the gst-rockchip plugin:

```text
SDK/debian/packages/'ARCH'/gst-rkmpp/*.deb
```

### 5.5 How to Verify If the Adaptation Is Successful

```text
sudo GST_DEBUG=2 gst-launch-1.0 playbin uri=file 'absolute video path' video-sink=“show sink” audio-sink=fakesink
```

If there is tips for mpp called, it means that the hardware decoding is adapted successfully.

## 6. Camera Service Adaptation

### 6.1 camera_engine_rkaiq Adaptation

Installation package:

```text
SDK/debian/packages/'ARCH'/rkaiq/camera_engine_rkaiq_'ARCH'.deb
```

### 6.2 How to Verify If the Adaptation Is Successful

Check whether images capture is successful by the v4l2 command, and check whether the captured image is correct: (Note: The nodes, formats, resolutions, etc. of different cameras on different platforms may be different, please change the command according to the actual situation)

```text
v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-skip=3 --stream-to=/tmp /0.yuv --stream-count=1 --stream-poll
```

## 7. NPU Service Adaptation

### 7.1 rknn_runtime Adaptation

The rknn_runtime is mainly a user mode library, just copy it to the your file system.

```text
SDK/external/rknpu2/Linux/librknn_api/'ARCH'/librknn_api.so

SDK/external/rknpu2/Linux/librknn_api/'ARCH'/librknnrt.so
```

### 7.2 rknn_server Adaptation

rknn_server is mainly a service used for on-board communication when the rknntool2 tool is used on the PC. If the model is trained on the PC, converted to rknn and imported on the board, in this case , the service is not required.

```text
SDK/external/rknpu2/Linux/rknn_server/'ARCH'/usr/bin/*
```

### 7.3 rknn Demo

Please refer to:

```text
SDK/external/rknpu2/examples
```

## 8. Wi-Fi/BT Service Adaptation

Please refer to "Rockchip_Developer_Guide_Linux_WIFI_BT_CN.pdf" For details. There are precompiled packages in the SDK:

```text
SDK\debian\packages\'ARCH'\rkwifibt\*.deb
```

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
