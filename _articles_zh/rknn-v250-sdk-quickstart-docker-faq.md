---
title: "RKNN2 V2.5.0 入门（六）：Docker、启动问题与文档导航"
description: "RKNN2 V2.5.0 入门（六）：Docker、启动问题与文档导航 · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0 入门（六）：Docker、启动问题与文档导航"
translation_key: "rknn-v250-sdk-quickstart-docker-faq"
slug: "rknn-v250-sdk-quickstart-docker-faq"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

适用范围：本系列为 RKNN2 V2.5.0 平台参考，原稿覆盖 RK3562、RK3566/3568/3576/3588 系列及 RV1126B。ArmSoM 同 SoC 板卡仍需匹配的 BSP、NPU 驱动和 Runtime；不能直接照搬 Rockchip EVB 的电源、USB 接口或固件。主机与驱动要求见正文；未进行 ArmSoM 硬件验证。

依据本地中英文 V2.5.0 原稿整理，保留原章节编号。中文用中文原图，英文、俄文和德文用英文原图；恢复 PDF 换行、跨页表格与代码缩进。示例输出不是 ArmSoM 实测。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN2 V2.5.0 入门（一）：部署链路、平台与 SDK 仓库](/zh/articles/rknn-v250-sdk-quickstart-deployment-flow/)

[RKNN2 V2.5.0 入门（二）：硬件连接与 ADB 检查](/zh/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0 入门（三）：Toolkit、Android/Linux Runtime 与编译器](/zh/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0 入门（四）：MobileNet 转换与部署](/zh/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0 入门（五）：YOLOv5 检测与精度评估](/zh/articles/rknn-v250-sdk-quickstart-yolov5/)

**RKNN2 V2.5.0 入门（六）：Docker、启动问题与文档导航**

{% raw %}

## 5. Docker 中运行 RKNN Python Demo

(可选)

如果需要在Docker环境中运行RKNN Python Demo,可以参考本章中的内容准备开发环境。

请特别注意,这里提供了一个包含RKNN-Toolkit2环境的Docker镜像,允许用戶在其中直接运行RKNNPython Demo而无需担心环境安装问题。但是,该Docker镜像中只包含纯净的RKNN-Toolkit2环境,仅适用于运行RKNN Python Demo。

### 5.1 安装Docker

如果已安装Docker,可跳过此步骤。如果没有安装,请根据官方手册进行安装。

Docker安装官方手册链接:https://docs.docker.com/install/linux/docker-ce/ubuntu/

注意事项:需要将用戶添加到docker用戶组。

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

### 5.2 准备RKNN-Toolkit2镜像

本节介绍两种创建RKNN-Toolkit2镜像环境的方式,可任选一种方式进行创建。

**1. 通过Dockerfile创建RKNN-Toolkit2镜像**

在RKNN-Toolkit2工程中 docker/docker_file 文件夹下,提供了构建RKNN-Toolkit2开发环境的Dockerfile文件,用戶通过docker build命令创建镜像,如下所示:

```text
# 注:以下 xx 和 x.x.x 代表版本号,请根据实际数值进行替换
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. 通过加载已打包的Docker镜像文件创建RKNN-Toolkit2镜像**

通过如下链接下载对应版本的RKNN-Toolkit2工程文件,解压后在 docker/docker_image 文件夹下提供了已打包所有开发环境的Docker镜像。

Docker镜像文件网盘下载链接:https://console.zbox.filez.com/l/I00fc3 (提取码:rknn)

执行以下命令加载对应Python版本的镜像文件。

```text
# 注:x.x.x 代表 RKNN-Toolkit2 的版本号,cpxx 代表的是 Python 的版本
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

创建或加载镜像成功后,可以通过以下命令查看docker的镜像信息。

```text
docker images
```

相应的RKNN-Toolkit2镜像信息显示如下:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 Docker中运行RKNN Python Demo

注意: 请确保板端已经安装RKNPU2环境,如果没有,请参考3.3章节中的内容进行安装。

**1. 映射文件,并运行容器**

请参考1.5章节在本地下载好RKNN Model Zoo工程,然后将其映射进容器中,并通过docker run命令运行容器。运行后将进入容器的bash环境。参考命令如下:

```text
# 使用 docker run 命令创建并运行 RKNN Toolkit2 容器
# 并通过附加 -v <host src folder>:<image dst folder> 参数,将本地文件映射进容器中
docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v /Projects/rknn_model_zoo:/rknn_model_zoo \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

**2. 在容器中准备模型并转换**

进入容器后,按照4.2.1章节的步骤,在容器内完成YOLOv5模型的下载和转换。

**3. 在容器中运行RKNN Python Demo**

按照4.2.2章节的步骤运行RKNN Python Demo,参考命令如下:

```text
# 进入 rknn_model_zoo/examples/yolov5/python 目录
cd rknn_model_zoo/examples/yolov5/python

# 运行 yolov5.py 脚本,在板端运行 yolov5 模型
# 用法: python yolov5.py --model_path {rknn_model} --target {target_platform}
# 注:这里以 rk3588 平台为例,如果是其他开发板,则需要修改命令中的平台类型
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588
```

注意: 当使用USB连接开发板时,请确保本地计算机和Docker容器中同时只开启一个adb server服务。如果需要在Docker容器中连接开发板,请在计算机的终端中执行命令 adb kill-server 终止本地计算机上的adb server服务。

## 6. 常见启动问题与下一步

本章收录首次运行过程中可能遇到的问题及排查方法。完整的FAQ、模型转换问题、精度问题、性能问题和内存问题请参考《RKNN2 SDK 开发指南》文档第10章"常见问题"。

### 6.1 adb devices查看不到设备

如果 adb devices 没有设备,可以尝试以下方式来解决此问题:

1. 检查连线是否正确、重新插拔数据线、换计算机另一个USB端口来连接数据线、更换数据线。

2. 当使用USB连接开发板时,请确保本地计算机和Docker容器中同时只开启一个adb server服务。例如,如果需要在Docker容器中连接开发板,请在计算机的终端中执行命令 adb kill-server 终止本地计算机上的adb server服务。

3. 出现以下错误时,表示系统中未安装adb。需要执行安装命令 sudo apt install adb 安装adb。

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

### 6.2 手动启动rknn_server服务

RKNN-Toolkit2的连板调试功能要求板端已安装RKNPU2环境,并且启动rknn_server服务。

但有些开发板系统没有开机自启动rknn_server服务,这导致在运行RKNN Python Demo时会遇到如 Einit_runtime: The rknn_server on the concected device is abnormal. 的报错信息。此时请参考3.3.2章节中的相关内容手动启动rknn_server服务。

### 6.3 后续文档导航

完成首次运行后,请根据任务进入对应的主文档,避免在快速入门中继续查找完整API或高级配置。

| 需要继续了解的内容 | 主文档/入口 |
| --- | --- |
| RKNN-Toolkit2完整安装、模型转换、量化配置 | 《RKNN2 SDK 开发指南》 |
| Toolkit方法、参数和返回值(Python API) | 《RKNN2 SDK 开发指南》 |
| Runtime C API说明 | 《RKNN2 Runtime C API参考》 |
| 工具安装/NPU环境/模型转换/模型评估常见问题 | 《RKNN2 SDK 开发指南》 |
| 模型精度分析(accuracy_analysis) | 《RKNN2 SDK 开发指南》 |
| Docker方式安装RKNN-Toolkit2 | 《RKNN2 SDK 开发指南》 |
| RKNN Model Zoo各模型示例用法 | rknn_model_zoo/examples/&lt;模型名&gt;/README.md |

{% endraw %}
