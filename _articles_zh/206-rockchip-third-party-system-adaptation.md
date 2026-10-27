---
title: "Rockchip 第三方系统适配开发指南"
description: "Rockchip 第三方系统适配开发指南 — V1.0.2"
excerpt: "Rockchip 第三方系统适配开发指南"
translation_key: "206-rockchip-third-party-system-adaptation"
slug: "206-rockchip-third-party-system-adaptation"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, Debian]
---

{% raw %}

# Rockchip 第三方系统适配开发指南

ArmSoM平台参考，文档RK-KF-YF-917 V1.0.2，中英9/10页。原稿适用范围为RK3568/Linux 4.19、RK3588/Linux 5.10，主要讨论类Debian用户态库与服务。不是所有ArmSoM板卡的通用安装保证；须核对实际SoC、SDK/BSP、内核、架构、包ABI、GPU、摄像头和无线模块。所有命令为原稿示例，未在ArmSoM硬件上执行。

两稿均V1.0.2，完整保留8章、软件路径表、显示框架表及所有示例。无技术配图。原稿§4.1说opengl，而表格与§4.6说opengles，保留矛盾，不当作当前支持矩阵。§5.5命令中的uri/file/引号/显示sink属于原稿不完整示例；§6.2英文路径`/tmp /0.yuv`含空格，中文为`/tmp/0.yuv`。本文保留语言原稿并注明，使用前按实际程序语法和节点验证。

## 1. RK平台主要需要适配的硬件

GPU:图形处理器(英语:graphics processing unit,缩写:GPU),又称显示核心、视觉处理器,主要用于加速几何转换和光照处理、立方环境材质贴图和顶点混合、纹理压缩和凹凸映射贴图、双重纹理四像素256位渲染引擎等,目前RK平台GPU硬件已经集成到SOC中。RGA:2D图形加速器,用于加速2D图形的旋转,裁剪,缩放等操作。目前RK平台RGA硬件已经集成到SOC中。VPU:视频编解码模块,用于加速视频编解码,支持多种格式。目前RK平台VPU硬件已经集成到SOC中。ISP:ISP主要作用是对前端图像传感器输出的信号做后期处理等。目前RK平台ISP硬件已经集成到SOC中。NPU:嵌入式神经网络处理器(NPU)采用“数据驱动并行计算”的架构,特别擅⻓处理视频、图像类的海量多媒体数据。NPU处理器专⻔为物联网人工智能而设计,用于加速神经网络的运算,解决传统芯片在神经网络运算时效率低下的问题。目前RK平台NPU硬件已经集成到SOC中。Wi-Fi/BT:开发板上适配的短距通信模块。

## 2. RK平台主要适配软件介绍

| 源码位置 | 说明 |
| --- | --- |
| SDK/external/libmali | RK平台目前提供的针对硬件gpu的用戶态函数接口,主要<br>是opengles通用接口,目前主流的类Debian的显示框架<br>有xserver和wayland,对于适配系统的APP使用的软件接<br>口也要做相应的修改。 |
| SDK/external/xserver | RK平台目前对xserver硬件加速的补丁,如果您的第三方<br>系统显示框架走的是xserver,请参考这个仓库的补丁适<br>配。 |
| SDK/external/linux-rga | RK平台目前提供的针对硬件RGA的用戶态函数接口。 |
| SDK/external/mpp | RK平台目前提供的针对硬件VPU用戶态函数接口。 |
| SDK/external/rknpu2 | RK平台目前提供的针对硬件NPU用戶态函数接口。 |
| SDK/external/camera_engine_rkaiq | RK平台目前提供的针对硬件ISP用戶态函数接口。 |
| SDK/external/drm-cursor | RK平台目前提供的针对硬件鼠标层用戶态函数接口。 |

## 3. 软件开发适配特别说明

因为软件适配的时候,类debian系统可能存在许多版本依赖,如果下述的包安装失败,需要您重新部署源码到您的目标机器去编译。编译命令:

```text
cd 源码⽬录
sudo apt build-dep .
sudo DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d  -us
```

## 4. 显示服务的适配

### 4.1 概述

类debian系统上的显示服务可以由下面几个部分组成:显示应用 + 图形显示框架 + 图形显示接口 + 处理图形显示的硬件显示应用目前主流的有x11, gnome,kde, xfce4,sdl2等等,图形显示框架主要包含wayland, xserver,gbm这三种, 对于rockchip来说,图形显示接口目前只支持opengl,处理图形显示的硬件自然就是GPU。下面列举几种显示框架的组合情况:(注意本文档的写作时间,具体支持情况可以到各自的官方网站去确认)

| 显示应用 | 支持的图形显示框架 | 支持的图形显示接口 |
| --- | --- | --- |
| x11 | xserver | opengles/gbm |
| gnome | xserver/wayland | opengles/gbm |
| kde | xserver/wayland | opengles/gbm |
| xfce4 | xserver | opengles/gbm |
| sdl2 | xserver/wayland | opengles/gbm |

根据上面的表格,在适配类debian系统的时候,要先知道前端(即显示应用是什么),然后要了解图形显示框架走的是xserver还是wayland去,做针对性的适配。

### 4.2 GPU适配

先确定您系统上使用的显示框架,是xserver还是wayland,(目前只支持这两种框架) 然后安装SDK/debian/packages/"ARCH"/libmali/libmali-***.deb比如,系统在rk3588平台上使用x11,rk3588平台使用的gpu型号是valhall-g610-g6p0,那么,需要安装

```text
SDK/debian/packages/arm64/libmali/libmali-valhall-g610-g6p0-x11_1.9-1_arm64.deb
```

### 4.3 RGA适配

安装包:

```text
SDK/debian/packages/'ARCH'/rga/*.deb
```

### 4.4 drm-cursor适配

安装包:

```text
SDK/debian/packages/arm64/libdrm-cursor/*.deb
```

### 4.5 xserver适配

因为xserver版本众多,您先确定您系统版本使用的xserver版本,然后基于我们的源码补丁,移植到您版本的xserver,然后再重新编译。生成补丁:

```text
cd 源码⽬录

git format-patch e4f4521ca
```

下面是编译好的1.20.11版本的安装包:

```text
SDK/debian/packages/'ARCH'/xserver/xserver-common_1.20.11-1_all.deb

SDK/debian/packages/'ARCH'/xserver/xserver-xorg-core_1.20.11-1_'ARCH'.deb

SDK/debian/packages/'ARCH'/xserver/xserver-xorg-legacy_1.20.11-1_'ARCH'.deb
```

xserver还需要一个启动脚本做一些初始化操作,如果是类debian系统,可以尝试复制启动脚本进系统,如果不是, 请参考脚本自行配置:

```text
SDK/debian/overlay/etc/X11
```

### 4.6 如何验证是否适配成功

显示服务加速使用opengles的标准接口,如果你的系统使用opengl,请移植成opengles,如果适配成功,当渲染画面或者拖动窗口的时候,去查看平台相关的gpu节点,会有gpu利用的变化,比如RK3588平台:

```text
cat /sys/devices/platform/fb000000.gpu/utilisation
```

注意:不同平台的gpu节点是不一样的。

## 5. 编解码服务的适配

### 5.1 概述

编解码服务,由下面几个部分组成:上层的多媒体框架软件 + 中间层mpp + 硬件编解码器上层编解码框架在开源社区常用的有gstreamer等,下文中都是以gstreamer作为例子演示的, 中间层mpp库,是作为通用第三方软件(如gstreamer)和硬件编解码器的中间层。

### 5.2 mpp适配

安装包:

```text
SDK/debian/packages/'ARCH'/mpp/*.deb
```

注意:一些节点的权限设置,需要参考

```text
SDK/debian/overlay/etc/udev/rules.d/99-rockchip-permissions.rules
```

验证mpp是否配置成功:

```text
# mpi_enc_test -w 1920 -h 1080 -t 7 -o /tmp/test.h264
# mpi_dec_test -w 1920 -h 1080 -t 7 -i /tmp/test.h264
```

### 5.3 多媒体软件适配

用戶的多媒体框架有许多,这里比较推荐的是用戶的播放器直接调用mpp的接口去进行视频编解码的适配,具体请查看mpp的接口文档《Rockchip_Developer_Guide_MPP_CN.pdf》

### 5.4 gstreamer适配

RK平台目前有适配一个gst-base的预编译包:

```text
SDK/debian/packages/'ARCH'/gst-plugins-base1.0/*.deb
SDK/debian/packages/'ARCH'/gst-plugins-bad1.0/*.deb
SDK/debian/packages/'ARCH'/gst-plugins-good1.0/*.deb
```

RK平台还支持gstreamer通用多媒体框架,需要您提前安装官方gstreamer组件(也可以安装上述的gst-base的预编译包,如果您的系统版本相兼容),然后再安装gst-rockchip插件:

```text
SDK/debian/packages/'ARCH'/gst-rkmpp/*.deb
```

### 5.5 如何验证是否适配成功

```text
sudo GST_DEBUG=2 gst-launch-1.0 playbin uri=file视频绝对路径  video-sink=“显⽰sink”
audio-sink=fakesink
```

如果有mpp调用的字样,说明硬件解码成功适配。

## 6. camera服务适配

### 6.1 camera_engine_rkaiq适配

安装包:

```text
SDK/debian/packages/'ARCH'/rkaiq/camera_engine_rkaiq_'ARCH'.deb
```

### 6.2 如何验证是否适配成功

可以使用v4l2命令查看是否抓图成功,并且查看抓出来的图是否正确:(注意:不同平台不同camera的节点,格式,分辨率等可能有所不同,请根据具体情况更换命令)

```text
v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=NV12
 --stream-mmap=4  --stream-skip=3  --stream-to=/tmp/0.yuv  --stream-count=1  --
stream-poll
```

## 7. NPU服务适配

### 7.1 rknn_runtime适配

rknn_runtime主要是用戶态的库,只要拷⻉它到客戶的文件系统中即可。

```text
SDK/external/rknpu2/Linux/librknn_api/'ARCH'/librknn_api.so

SDK/external/rknpu2/Linux/librknn_api/'ARCH'/librknnrt.so
```

### 7.2 rknn_server适配

rknn_server主要是pc上使用rknntool2工具时候,要求板上通信所用的服务,如果在pc上训练好模型,转化为rknn后在导入板子上,是不需要这个服务的。

```text
SDK/external/rknpu2/Linux/rknn_server/'ARCH'/usr/bin/*
```

### 7.3 rknn demo

请参考

```text
SDK/external/rknpu2/examples
```

## 8. Wi-Fi/BT 服务适配

详情请参考 《Rockchip_Developer_Guide_Linux_WIFI_BT_CN.pdf》在SDK中有预编译包:

```text
SDK\debian\packages\'ARCH'\rkwifibt\*.deb
```

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
