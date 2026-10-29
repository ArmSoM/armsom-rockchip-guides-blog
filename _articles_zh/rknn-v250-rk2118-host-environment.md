---
title: "RK2118 NPU 入门（二）：主机环境与 Toolkit2 安装"
description: "RK2118 NPU 入门（二）：主机环境与 Toolkit2 安装 · RKNN2 V2.5.0"
excerpt: "RK2118 NPU 入门（二）：主机环境与 Toolkit2 安装"
translation_key: "rknn-v250-rk2118-host-environment"
slug: "rknn-v250-rk2118-host-environment"
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

**RK2118 入门系列 · 2/5**

[RK2118 NPU 入门（一）：开发板、连接与串口](/zh/articles/rknn-v250-rk2118-hardware/)

**RK2118 NPU 入门（二）：主机环境与 Toolkit2 安装**

[RK2118 NPU 入门（三）：RT-Thread 与 DSP 固件编译](/zh/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU 入门（四）：模型转换、U 盘输入与推理结果](/zh/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU 入门（五）：Docker、常见问题与参考文档](/zh/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 3. 准备开发环境

本章介绍如何在计算机中直接安装开发环境,后续的示例程序运行过程也将以直接安装为例说明。如果需要在Docker 环境中运行示例程序,可以参考第5章中的内容准备开发环境。

本章分为三个部分:

- 下载 RKNN 相关仓库

- 安装RKNN-Toolkit2 环境

- 准备RK2118 SDK

### 3.1 下载 RKNN 相关仓库

建议新建一个目录用来存放 RKNN 仓库,例如新建一个名称为 Projects 的文件夹,并将 RKNN-Toolkit2仓库存放至该目录下,参考命令如下:

```text
# 新建 Projects 文件夹
mkdir Projects

# 进入该目录
cd Projects

# 下载 RKNN-Toolkit2 仓库
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1
# 注意:
# 1.参数 --depth 1 表示只克隆最近一次 commit
# 2.如果遇到 git clone 失败的情况,也可以直接在 github 中下载压缩包到本地,然后解压至该目录
```

整体目录结构如下:

```text
Projects
├── rknn-toolkit2
│ ├── doc
│ ├── rknn-toolkit2
│ │ ├── packages
│ │ ├── docker
│ │ └── ...
│ ├── rknpu2
│ │ ├── runtime
│ │ └── ...
│ └── ...
```

### 3.2 安装 RKNN-Toolkit2 环境

#### 3.2.1 安装 Python

如果系统中没有安装 Python 3.8(建议版本),或者同时有多个版本的 Python 环境,建议使用 miniforge 创建新的 Python 3.8 环境。

##### 3.2.1.1 安装 miniforge

在计算机的终端窗口中执行以下命令,检查是否安装 miniforge,若已安装则可省略此节步骤。

```text
conda -V
# 参考输出信息:conda 24.3.0 ,表示 conda 版本为 24.3.0
# 如果提示 conda: command not found,则表示未安装 miniforge
```

如果没有安装 miniforge,可以通过下面的链接下载 miniforge 安装包:

```text
https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

然后通过以下命令安装 miniforge:

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

##### 3.2.1.2 使用 miniforge 创建 Python 环境

在计算机的终端窗口中,执行以下命令进入 Conda base 环境:

```text
source /opt/miniforge3/bin/activate # miniforge3 安装的目录
# 成功后,命令行提示符会变成以下形式:
# (base) xxx@xxx:~$
```

通过以下命令创建名称为 toolkit2 的 Python 3.8 环境:

```text
conda create -n toolkit2 python=3.8
```

激活 toolkit2 环境,后续将在此环境中安装 RKNN-Toolkit2:

```text
conda activate toolkit2
# 成功后,命令行提示符会变成以下形式:
# (toolkit2) xxx@xxx:~$
```

#### 3.2.2 安装 RKNN-Toolkit2

激活 toolkit2 环境后,可通过 pip 源或者本地 wheel 包这两种方式安装 RKNN-Toolkit2:

- 通过 pip 源安装

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# 如果已安装 RKNN-Toolkit2,可通过以下命令升级 RKNN-Toolkit2
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

- 通过本地 wheel 包安装

```text
# 进入 rknn-toolkit2 目录
cd Projects/rknn-toolkit2/rknn-toolkit2

# 请根据不同的 python 版本及处理器架构,选择不同的 requirements 文件:
# 其中 cpxx 是 python 版本号
pip install -r packages/x86_64/requirements_cpxx.txt
# pip install -r packages/arm64/arm64_requirements_cpxx.txt

# 安装 RKNN-Toolkit2
# 请根据不同的 python 版本及处理器架构,选择不同的 wheel 安装包文件:
# 其中 x.x.x 是 RKNN-Toolkit2 版本号,cpxx 是 python 版本号
pip install packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

#### 3.2.3 验证是否安装成功

执行以下命令,若没有报错,则代表 RKNN-Toolkit2 环境安装成功。

```text
# 进入 Python 交互模式
python

# 导入 RKNN 类
from rknn.api import RKNN
```

如果安装失败,请查阅 《RKNN2_SDK_开发指南.pdf》文档中的第 5.4.2 章节 “工具安装问题”,其中详细介绍了 RKNN-Toolkit2 环境安装失败的解决方法。

{% endraw %}
