---
title: "RK2118 NPU 入门（五）：Docker、常见问题与参考文档"
description: "RK2118 NPU 入门（五）：Docker、常见问题与参考文档 · RKNN2 V2.5.0"
excerpt: "RK2118 NPU 入门（五）：Docker、常见问题与参考文档"
translation_key: "rknn-v250-rk2118-docker-faq"
slug: "rknn-v250-rk2118-docker-faq"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

平台参考：适用于 RK_EVB1_RK2118G_V20（RK2118）及其匹配的 RT-Thread SDK。尚未确认对应 ArmSoM 板卡，不可直接套用于其他 SoC；本文不指定已验证的 BSP 或 Linux 内核，也没有进行 ArmSoM 硬件实测。

来源：本地 RKNN2 RK2118 快速入门中英文 V2.5.0，保留原章节编号。中文沿用中文正文，英俄德沿用英文正文；已修复 PDF 自动换行造成的文件名、URL、注释和命令断裂。原文第 5.3 节将 RT-Thread 下载指向第 3.1 节，实际下载步骤位于第 3.3.1 节，两处关系在此注明。原文 Docker 命令挂载到 /rt-thread，后续给出相对路径 rt-thread/...；执行前应确认容器当前目录，本文未静默改写。示例日志、45ms 和参考输出来自原稿，不是 ArmSoM 实测。安装命令中的 latest/未固定版本安装不保证获得 V2.5.0，应与实际 SDK 核对。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**RK2118 入门系列 · 5/5**

[RK2118 NPU 入门（一）：开发板、连接与串口](/zh/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU 入门（二）：主机环境与 Toolkit2 安装](/zh/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU 入门（三）：RT-Thread 与 DSP 固件编译](/zh/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU 入门（四）：模型转换、U 盘输入与推理结果](/zh/articles/rknn-v250-rk2118-model-demo/)

**RK2118 NPU 入门（五）：Docker、常见问题与参考文档**

<!-- rk2118-series:end -->

{% raw %}

## 5. Docker 中进行 RKNN模型转换(可选)

如果需要在 Docker 环境中运行 RKNN Python Demo,可以参考本章中的内容准备开发环境。

请特别注意,这里提供了一个包含 RKNN-Toolkit2 环境的 Docker 镜像,允许用戶在其中直接运行 RKNNPython Demo 而无需担心环境安装问题。但是,该 Docker 镜像中只包含纯净的 RKNN-Toolkit2 环境,仅适用于运行 RKNN Python Demo。

此章内容分为三个部分:

- 安装 Docker

- 在 Docker 中安装 RKNN-Toolkit2 环境

- RKNN 模型转换

### 5.1 安装 Docker

如果已安装 Docker ,可跳过此步骤。如果没有安装,请根据官方手册进行安装。

Docker 安装官方手册链接:https://docs.docker.com/install/linux/docker-ce/ubuntu/

注意事项:需要将用戶添加到 docker 用戶组。

```text
# 创建docker用戶组
sudo groupadd docker
# 把当前用戶加入docker用戶组
sudo usermod -aG docker $USER
# 更新激活docker用戶组
newgrp docker

# 验证不需要sudo执行docker命令
docker run hello-world
```

成功安装的参考输出信息如下:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

### 5.2 在 Docker 中安装 RKNN-Toolkit2 环境

#### 5.2.1 准备 RKNN-Toolkit2 镜像

本节介绍两种创建 RKNN-Toolkit2 镜像环境的方式,可任选一种方式进行创建。

**1. 通过 Dockerfile 创建 RKNN Toolkit2 镜像**

在 RKNN-Toolkit2 工程中 docker/docker_file 文件夹下,提供了构建 RKNN-Toolkit2 开发环境的Dockerfile 文件,用戶通过 docker build命令创建镜像,如下所示:

```text
# 注:以下 xx 和 x.x.x 代表版本号,请根据实际数值进行替换
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx

docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. 通过加载已打包的 Docker 镜像文件创建 RKNN Toolkit2 镜像**

通过如下链接下载对应版本的 RKNN-Toolkit2 工程文件,解压后在 docker/docker_image 文件夹下提供了已打包所有开发环境的 Docker 镜像。

Docker 镜像文件网盘下载链接:https://console.zbox.filez.com/l/I00fc3 (提取码:rknn)

执行以下命令加载对应 Python 版本的镜像文件。

```text
# 注:x.x.x 代表 RKNN-Toolkit2 的版本号,cpxx 代表的是 Python 的版本
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

#### 5.2.2 查询镜像信息

创建或加载镜像成功后,可以通过以下命令查看 docker 的镜像信息。

```text
docker images
```

相应的 RKNN-Toolkit2 镜像信息显示如下:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 RKNN 模型转换

- 映射文件,并运行容器

请参考第3.1章节在本地下载好 RT-Thread 工程,然后将其映射进容器中,并通过 docker run 命令运行容器。运行后将进入容器的 bash 环境。参考命令如下:

```text
# 使用 docker run 命令创建并运行 RKNN Toolkit2 容器
# 并通过附加 -v <host src folder>:<image dst folder> 参数,将本地文件映射进容器中
docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v /Projects/rt-thread:/rt-thread \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

- 模型转换

进入rt-thread/components/rknpu/examples/rknn_benchmark/res 目录转换模型,参考命令如下:

```text
cd rt-thread/components/rknpu/examples/rknn_benchmark/res
python convert.py
```

## 6. 常见问题

### 6.1 命令 adb devices 查看不到设备

目前,RK2118不支持通过adb调试,因此没有adb设备

### 6.2 rknn_demo_server 服务的作用

RK2118中的rknn_demo_server并不是用来做RKNN-Toolkit2 的连板调试功能,而是用于DSP与MCU进行交互的服务。

## 7. 参考文档

- 有关RKNN-Toolkit2和RKNPU2更详细的用法和接口说明,请参考《RKNN2_SDK_开发指南.pdf》

- RK2118的相关文档请参考《Rockchip_Developer_Guide_RK2118_CN.pdf》

说明:未在本指南中给出固定文件名的配套文档,请以当前SDK发布包中的实际文档名称为准。

{% endraw %}
