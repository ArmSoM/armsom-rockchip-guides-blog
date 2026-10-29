---
title: "RV1103/RV1106 RKNN 入门（五）：Docker、启动问题与后续文档"
description: "RV1103/RV1106 RKNN 入门（五）：Docker、启动问题与后续文档 · RKNN2 V2.5.0"
excerpt: "RV1103/RV1106 RKNN 入门（五）：Docker、启动问题与后续文档"
translation_key: "rknn-v250-rv1106-docker-faq"
slug: "rknn-v250-rv1106-docker-faq"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RV1103", "RV1106", "Mini Runtime"]
---

平台参考：本系列对应 RKNN2 V2.5.0 的 RV1103/RV1103B/RV1106/RV1106B 入门资料，使用匹配的板级 SDK、RKNPU2 驱动及 librknnmrt.so。尚未确认对应 ArmSoM 板卡；原稿 Linux 5.10.160 日志和推理输出仅为示例，不是 ArmSoM 硬件验证。请按实际板卡 BSP 核对供电、接口及驱动。

来源：本地中英文 V2.5.0 PDF。中文正文与图片取自中文稿，英文、俄文和德文取自英文稿。保留全部技术章节、命令和表格；仅恢复 PDF 造成的换行与目录树缩进。示例旧驱动日志不代表推荐版本；原文推荐版本见正文。未锁定版本的下载和 pip 安装应与实际 SDK 配套核对。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RV1103/RV1106 RKNN 入门（一）：部署链路、平台与仓库](/zh/articles/rknn-v250-rv1106-deployment-flow/)

[RV1103/RV1106 RKNN 入门（二）：硬件连接与设备检查](/zh/articles/rknn-v250-rv1106-hardware/)

[RV1103/RV1106 RKNN 入门（三）：主机环境与 Mini Runtime](/zh/articles/rknn-v250-rv1106-host-runtime/)

[RV1103/RV1106 RKNN 入门（四）：YOLOv5 转换、Python 和 C 部署](/zh/articles/rknn-v250-rv1106-yolov5/)

**RV1103/RV1106 RKNN 入门（五）：Docker、启动问题与后续文档**

{% raw %}

## 5. Docker 中运行 RKNN Python Demo

(可选)

如果不希望直接在计算机中安装 RKNN-Toolkit2 环境,可以使用包含 RKNN-Toolkit2 环境的 Docker 镜像运行 RKNN Python Demo。

注意: 本章 Docker 镜像只包含 RKNN-Toolkit2 环境,主要用于运行 RKNN Python Demo。板端仍需按照第 3.3 节准备 RKNPU2 环境。

### 5.1 安装 Docker

如果已经安装 Docker,可跳过本节。未安装时,请参考 Docker 官方安装手册:https://docs.docker.com/install/linux/docker-ce/ubuntu/。

安装完成后,需要将当前用戶加入 docker 用戶组:

```text
# 创建 docker 用戶组
sudo groupadd docker

# 把当前用戶加入 docker 用戶组
sudo usermod -aG docker $USER

# 更新激活 docker 用戶组
newgrp docker

# 验证无需 sudo 即可执行 docker 命令
docker run hello-world
```

成功时会看到类似以下输出:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

### 5.2 准备 RKNN-Toolkit2 Docker 镜像

可以通过 Dockerfile 构建镜像,也可以加载已经打包的 Docker 镜像文件。

#### 5.2.1 通过 Dockerfile 构建镜像

RKNN-Toolkit2 工程的 docker/docker_file 目录提供 Dockerfile:

```text
# xx 和 x.x.x 代表版本号,请按实际值替换
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx

docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

#### 5.2.2 加载已打包镜像

Docker 镜像文件下载地址:https://console.zbox.filez.com/l/I00fc3(提取码: rknn )。

执行:

```text
# x.x.x 为 RKNN-Toolkit2 版本号,cpxx 为 Python 版本

docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

#### 5.2.3 检查镜像

```text
docker images
```

参考输出:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 在容器中运行 RKNN Python Demo

首先按照第 1.5 节在本地准备 RKNN Model Zoo,然后将目录和 USB 设备映射到容器中:

```text
# -v <host src folder>:<image dst folder> 用于映射本地目录

docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v "$HOME/Projects/rknn_model_zoo:/rknn_model_zoo" \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

进入容器后,准备模型:

```text
cd /rknn_model_zoo/examples/yolov5/model
./download_model.sh
```

转换模型:

```text
cd /rknn_model_zoo/examples/yolov5/python
python convert.py ../model/yolov5s_relu.onnx rv1106 i8 ../model/yolov5s_relu.rknn
```

运行 RKNN Python Demo:

```text
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rv1106
```

脚本运行成功后,输出信息示例如下。其中 class 表示预测类别, score 为得分, (xmin, ymin) 为检测框左上⻆坐标, (xmax, ymax) 为右下⻆坐标。

```text
# class @ (xmin, ymin, xmax, ymax)score
person @ (209 243 286 510) 0.880
person @ (479 238 560 527) 0.871
person @ (109 238 231 534) 0.840
bus @ (91 129 555 464) 0.692
```

## 6. 常见启动问题与下一步

本章只覆盖首次运行中最常见的连接、Server 和内存问题。更多工具安装、模型转换及系统化故障排查,请参考《RKNN2_SDK_开发指南》;接口相关问题请根据使用方式参考《RKNN2_Toolkit_Python_API_参考》《RKNN2_Toolkit_Lite_Python_API_参考》或《RKNN2_Runtime_C_API_参考》。

### 6.1 设备无法识别

如果执行 adb devices 看不到设备,可以依次检查:

1. 检查连线是否正确,重新插拔数据线;

2. 更换计算机 USB 端口;

3. 更换数据线;

4. 使用 USB 连接开发板时,确保本地计算机和 Docker 容器中同时只运行一个 ADB Server。如果需要在Docker 容器中连接开发板,可先在本地计算机执行:

```text
adb kill-server
```

如果出现以下错误,表示系统中未安装 ADB:

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

执行以下命令安装:

```text
sudo apt install adb
```

### 6.2 rknn_server 未正常启动

RKNN-Toolkit2 的连板调试功能要求板端已安装 RKNPU2 环境,并且 rknn_server 正常运行。部分开发板系统不会开机自动启动 rknn_server ,此时运行 RKNN Python Demo 可能出现:

```text
E init_runtime: The rknn_server on the concected device is abnormal.
```

可手动启动:

```text
adb shell
restart_rknn.sh
```

如果仍然异常,请返回 3.3.2 检查 RKNPU2 Mini Runtime 和 Server 检查组件和版本。

### 6.3 内存不足导致模型加载失败

RV1103/RV1103B/RV1106/RV1106B 开发板内存较小。如果板端已经运行 rkipc 进程,可能导致模型加载失败并出现:

```text
E init_runtime: Exception: RKNN init failed. error code: RKNN_ERR_MODEL_INVALID
```

可以进入板端结束 rkipc 进程:

```text
adb shell

# 查看当前运行的进程,找到 rkipc 对应的 PID
top

# 结束 rkipc 进程
kill -9 PID
```

### 6.4 后续文档导航

完成首次运行后,请根据后续开发任务进入对应的主文档,避免在快速入门中继续查找完整开发流程、API 说明或高级配置。

| 检索需求 / 学习目标 | 推荐参考文档 |
| --- | --- |
| RK3588 等平台:RKNN2 SDK 首次环境搭建、模型转换与部署验证 | 《RKNN2_SDK_快速入门》 |
| RK2118 平台:RKNN2 SDK 首次环境搭建、模型转换与部署验证 | 《RKNN2_RK2118_快速入门》 |
| 全流程开发:RKNN2 软件栈架构、模型转换与量化、精度/性能分析、完<br>整部署及故障排查 | 《RKNN2_SDK_开发指南》 |
| PC 端模型转换与分析:RKNN-Toolkit2 Python API 方法、参数及返回<br>值说明 | 《RKNN2_Toolkit_Python_API_参考》 |
| 板端 Python 轻量部署:RKNN-Toolkit-Lite2 Python API 方法、参数<br>及返回值说明 | 《RKNN2_Toolkit_Lite_Python_API_参<br>考》 |
| 板端 C/C++ 部署:板端 C API、结构体、枚举、错误码及 Mini<br>Runtime 相关接口 | 《RKNN2_Runtime_C_API_参考》 |
| 模型兼容性评估:RKNN 算子支持列表及其约束条件 | 《RKNN2_算子支持与约束参考》 |

说明: 本文档面向 RV1103/RV1103B/RV1106/RV1106B,板端运行库统一使用 RKNPU2 MiniRuntime( librknnmrt.so )。《RKNN2_Runtime_C_API_参考》为 Runtime C API 的文档名称,阅读时应结合当前平台及 SDK 版本使用对应接口。

{% endraw %}
