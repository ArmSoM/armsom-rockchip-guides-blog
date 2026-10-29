---
title: "RV1103/RV1106 RKNN 入门（三）：主机环境与 Mini Runtime"
description: "RV1103/RV1106 RKNN 入门（三）：主机环境与 Mini Runtime · RKNN2 V2.5.0"
excerpt: "RV1103/RV1106 RKNN 入门（三）：主机环境与 Mini Runtime"
translation_key: "rknn-v250-rv1106-host-runtime"
slug: "rknn-v250-rv1106-host-runtime"
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

**RV1103/RV1106 RKNN 入门（三）：主机环境与 Mini Runtime**

[RV1103/RV1106 RKNN 入门（四）：YOLOv5 转换、Python 和 C 部署](/zh/articles/rknn-v250-rv1106-yolov5/)

[RV1103/RV1106 RKNN 入门（五）：Docker、启动问题与后续文档](/zh/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 3. 主机端和板端环境准备

本章完成首次运行需要的 RKNN-Toolkit2、RKNPU2 和编译工具准备。后续主流程以计算机中直接安装环境为例;如需使用 Docker,可参考第 5 章。

### 3.1 安装 RKNN-Toolkit2

#### 3.1.1 安装 Python 环境

如果系统中没有安装 Python 3.8(建议版本),或者同时存在多个 Python 环境,建议使用 Miniforge 创建独立的 Python 3.8 环境。

步骤 1:安装 Miniforge

首先检查系统是否已经安装 Miniforge;若已安装,可跳过本步骤。

```text
conda -V
# 参考输出:conda 23.3.1,表示 Miniforge conda 版本为 23.3.1
# 如果提示 conda: command not found,则表示未安装 Miniforge
```

如果未安装 Miniforge,可下载安装包:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

然后执行:

```text
chmod +x Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

步骤 2:创建 Python 环境

进入 Miniforge base 环境:

```text
source ~/miniforge3/bin/activate
# 成功后,命令行提示符会变成以下形式:
# (base) xxx@xxx:~$
```

创建名为 toolkit2 的 Python 3.8 环境:

```text
conda create -n toolkit2 python=3.8
```

激活 toolkit2 环境:

```text
conda activate toolkit2
# 成功后,命令行提示符会变成以下形式:
# (toolkit2) xxx@xxx:~$
```

说明: 后续 Python 相关命令默认在 toolkit2 环境中执行。

#### 3.1.2 安装 RKNN-Toolkit2

激活 toolkit2 环境后,可通过 pip 源或本地 wheel 包安装 RKNN-Toolkit2。

方式 1:通过 pip 源安装

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# 如果已安装 RKNN-Toolkit2,可通过以下命令升级
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

方式 2:通过本地 wheel 包安装

```text
# 进入 rknn-toolkit2 目录
cd Projects/rknn-toolkit2/rknn-toolkit2

# 根据 Python 版本及处理器架构选择 requirements 文件
# cpxx 为 Python 版本号
pip install -r packages/x86_64/requirements_cpxx.txt
# pip install -r packages/arm64/arm64_requirements_cpxx.txt

# 安装 RKNN-Toolkit2
# x.x.x 为 RKNN-Toolkit2 版本号,cpxx 为 Python 版本号
pip install packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

### 3.2 检查 Toolkit 安装结果

保持 toolkit2 环境处于激活状态,先进入 Python 交互模式:

```text
python
```

然后导入 RKNN 类:

```text
from rknn.api import RKNN
```

若导入过程没有报错,表示最基本的 RKNN-Toolkit2 安装检查通过。

如果安装失败,请查阅《RKNN2_SDK_开发指南》中 RKNN-Toolkit2 安装与故障排查相关章节。

### 3.3 安装或检查板端 RKNPU2 环境

为便于描述,后续文档使用“板端”表示开发板端。

RKNN-Toolkit2 的连板调试功能要求板端已安装 RKNPU2 环境并启动 rknn_server 。其中:

| 组件 | 作用 |
| --- | --- |
| RKNN Server(rknn_server) | 运行在开发板上的后台代理服务,处理计算机通过 USB 发送的数据,并调用板<br>端 Mini Runtime 完成推理 |
| RKNPU2 Mini Runtime<br>(librknnmrt.so) | 在系统中加载 RKNN 模型并调用 NPU 执行推理 |

#### 3.3.1 检查 RKNPU2 驱动版本

在板端执行以下命令查询 RKNPU2 驱动版本:

```text
dmesg | grep -i rknpu
```

如下图所示,示例中的 RKNPU2 驱动版本为 0.8.5:

![中文原稿配图 · PDF 15](/assets/images/rknn-v250/rv1106/cn/p015-figure-01.png)

*中文原稿配图 · PDF 15*

图3-1 RKNPU2 驱动版本信息

Rockchip 开发板官方固件均自带 RKNPU2 驱动。若以上命令查询不到 NPU 驱动版本,则可能使用了未集成NPU 驱动的第三方固件。如果有固件源码,可以在 kernel config 中将 CONFIG_ROCKCHIP_RKNPU 设置为y ,重新编译内核驱动并烧录。

建议: RKNPU2 驱动版本 >= 0.9.2。

#### 3.3.2 检查 RKNPU2 Mini Runtime 和 Server

如果板端没有安装 RKNN Server 和 Mini Runtime 库,或两者版本不一致,需要重新安装 RKNPU2 环境。

注意:

1. 如果使用动态维度输入的 RKNN 模型,RKNN Server 和 Mini Runtime 库版本需要 >= 1.5.0;

2. rknn_server 、Mini Runtime 库和 RKNN-Toolkit2 的版本应保持一致,建议安装同一套最新版本。

步骤 1:检查 rknn_server 是否可启动

```text
# 进入板端
adb shell

# 启动 rknn_server
restart_rknn.sh
```

如果出现类似以下输出,表示 rknn_server 启动成功:

```text
start rknn server, version: x.x.x
```

步骤 2:检查 Server 和 Mini Runtime 版本

```text
# 查询 rknn_server 版本
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"

# 查询 librknnmrt.so 版本
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
```

参考输出:

```text
rknn_server version: x.x.x
librknnmrt version: x.x.x
```

#### 3.3.3 安装或更新 RKNPU2 环境

如果已经安装版本一致的 RKNPU2 环境,可跳过本节。

进入 rknpu2 目录,使用 ADB 将对应的 rknn_server 和 librknnmrt.so 推送至板端,然后启动rknn_server :

```text
# 进入 rknpu2 目录
cd Projects/rknn-toolkit2/rknpu2

# 推送 rknn_server 到板端
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/* /oem/usr/bin

# 推送 librknnmrt.so
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib

# 进入板端
adb shell

# 赋予可执行权限
chmod +x /oem/usr/bin/rknn_server
chmod +x /oem/usr/bin/start_rknn.sh
chmod +x /oem/usr/bin/restart_rknn.sh

# 重启 rknn_server 服务
restart_rknn.sh
```

### 3.4 安装编译工具

#### 3.4.1 安装 CMake

在计算机终端中执行:

```text
# 更新包列表
sudo apt update

# 安装 cmake
sudo apt install cmake
```

#### 3.4.2 安装编译器

##### 3.4.2.1 确认开发板系统架构

在计算机端执行:

```text
adb shell uname -a
```

参考输出如下,其中 armv7l 表示基于 ARMv7 架构,属于 armhf 架构。该架构类型将在后续编译 RKNN CDemo 时使用。

```text
Linux Rockchip 5.10.160 #1 Tue Oct 24 18:52:11 CST 2023 armv7l GNU/Linux
```

##### 3.4.2.2 安装 GCC 交叉编译器

GCC 下载地址:https://console.zbox.filez.com/l/c1cKaR(提取码: rknn )。

下载后解压软件包。建议将 GCC 软件包解压到 Projects 目录:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── arm-rockchip831-linux-uclibcgnueabihf
```

后续示例使用的 GCC 编译器路径为:

```text
Projects/arm-rockchip831-linux-uclibcgnueabihf/bin/arm-rockchip831-linux-uclibcgnueabihf
```

### 3.5 运行环境预检查

开始模型转换前,建议完成以下检查:

| 检查项 | 命令或位置 | 预期结果 |
| --- | --- | --- |
| Toolkit | 按第 3.2 节进入 Python 并执行 from rknn.api import RKNN | 无报错 |
| Model Zoo | Projects/rknn_model_zoo/examples/yolov5 | 示例目录存在 |
| ADB | adb devices | 开发板状态为 device |
| RKNPU2 驱动 | adb shell "dmesg &#124; grep -i rknpu" | 能查询到 RKNPU2 驱动信<br>息 |
| RKNN Server | adb shell restart_rknn.sh | 能正常启动<br>rknn_server |
| Mini Runtime 版<br>本 | 查询 rknn_server 和 librknnmrt.so 版本 | 版本一致 |
| CMake | cmake --version | 能正常输出版本信息 |
| GCC | 检查 Projects/arm-rockchip831-linux-uclibcgnueabihf | 交叉编译器目录存在 |

上述检查通过后,再继续运行第一个模型。

{% endraw %}
