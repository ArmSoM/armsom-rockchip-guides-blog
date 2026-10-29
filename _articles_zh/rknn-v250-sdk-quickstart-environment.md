---
title: "RKNN2 V2.5.0 入门（三）：Toolkit、Android/Linux Runtime 与编译器"
description: "RKNN2 V2.5.0 入门（三）：Toolkit、Android/Linux Runtime 与编译器 · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0 入门（三）：Toolkit、Android/Linux Runtime 与编译器"
translation_key: "rknn-v250-sdk-quickstart-environment"
slug: "rknn-v250-sdk-quickstart-environment"
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

**RKNN2 V2.5.0 入门（三）：Toolkit、Android/Linux Runtime 与编译器**

[RKNN2 V2.5.0 入门（四）：MobileNet 转换与部署](/zh/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0 入门（五）：YOLOv5 检测与精度评估](/zh/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0 入门（六）：Docker、启动问题与文档导航](/zh/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 3. 主机端和板端环境准备

### 3.1 安装RKNN-Toolkit2

快速入门仅给出推荐的Conda + pip安装路径。Docker方式的安装请参考第 5 章。

#### 3.1.1 安装Python环境

如果系统中没有安装Python 3.8(建议版本),或者同时有多个版本的Python环境,建议使用MiniforgeConda创建新的Python 3.8环境。

步骤1:安装Miniforge Conda

在计算机的终端窗口中执行以下命令,检查是否安装Miniforge Conda,若已安装则可省略此步骤。

```text
conda -V
# 参考输出信息:conda 23.3.1 ,表示 Miniforge conda 版本为 23.3.1
# 如果提示 conda: command not found,则表示未安装 Miniforge
```

如果没有安装Miniforge Conda,可以通过下面的链接下载Miniforge Conda安装包:https://github.com/conda-forge/miniforge/releases/download/25.3.0-1/Miniforge3-25.3.0-1-Linux-x86_64.sh

然后通过以下命令安装Miniforge Conda:

```text
# 拷⻉到用戶目录
cp /path/to/Miniforge3-25.3.0-1-Linux-x86_64.sh ~

# 增加运行权限
chmod 777 Miniforge3-25.3.0-1-Linux-x86_64.sh

# 运行安装脚本
bash Miniforge3-25.3.0-1-Linux-x86_64.sh
```

步骤2:创建Python环境

安装Miniforge Conda后,在计算机的终端窗口中,执行以下命令进入Conda base环境:

```text
source ~/miniforge3/bin/activate # Miniforge 安装的目录
# 成功后,命令行提示符会变成以下形式:
# (base) xxx@xxx:~$
```

通过以下命令创建名称为toolkit2的Python 3.8环境:

```text
conda create -n toolkit2 python=3.8
```

激活toolkit2环境,后续将在此环境中安装RKNN-Toolkit2:

```text
conda activate toolkit2
# 成功后,命令行提示符会变成以下形式:
# (toolkit2) xxx@xxx:~$
```

说明: 后续Python运行命令默认在 toolkit2 环境中执行。

#### 3.1.2 安装RKNN-Toolkit2

激活toolkit2环境后,可通过pip源或者本地wheel包这两种方式安装RKNN-Toolkit2。

方式一:通过pip源安装

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# 如果已安装 RKNN-Toolkit2,可通过以下命令升级 RKNN-Toolkit2
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

方式二:通过本地wheel包安装

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

### 3.2 检查Toolkit安装结果

保持 toolkit2 环境处于激活状态,执行:

```text
python -c "from rknn.api import RKNN; print('RKNN-Toolkit2 import OK')"
```

若输出:

```text
RKNN-Toolkit2 import OK
```

表示最基本的Toolkit导入检查通过。

如果安装失败,请查阅《RKNN2 SDK 开发指南》文档中的第5.4.2章节"工具安装问题",其中详细介绍了RKNN-Toolkit2环境安装失败的解决方法。

### 3.3 安装或检查板端RKNPU2环境

板端运行Demo前,需要确认NPU驱动、rknn_server服务和Runtime库已正确安装。

#### 3.3.1 确认NPU驱动版本

可以在板端执行以下命令查询RKNPU2驱动版本:

```text
dmesg | grep -i rknpu
```

如下图所示,当前RKNPU2驱动版本为0.8.8。

![中文原稿配图 · PDF 16](/assets/images/rknn-v250/sdkquick/cn/p016-figure-01.png)

*中文原稿配图 · PDF 16*

图3-1 RKNPU2 驱动版本信息

Rockchip开发板的官方固件均自带RKNPU2驱动。若以上命令查询不到NPU驱动版本,则可能使用的是第三方固件,其中可能没有安装NPU驱动。如果有固件源码,可以在 kernel config 中将CONFIG_ROCKCHIP_RKNPU 选项的值改成y以集成NPU驱动,然后重新编译内核驱动并烧录。建议RKNPU2驱动版本 >= 0.9.8。

#### 3.3.2 检查rknn_server与Runtime库

RKNN-Toolkit2的连板调试功能要求板端已安装RKNPU2环境,并且启动rknn_server服务。如果板端没有安装rknn_server和Runtime库,或者两者的版本不一致,都需要重新安装RKNPU2环境。

通常情况下,开发板默认已经安装版本一致的RKNPU2环境,可以通过下面命令确认(如果没有安装RKNPU2环境或者版本不一致,请按照3.3.3节中的步骤来安装/更新RKNPU2环境)。

**1. 板端为Android系统**

检查RKNPU2环境是否安装:如果能够启动rknn_server服务,则代表板端已经安装RKNPU2环境。

```text
# 进入板端
adb shell

# 启动 rknn_server
su
setenforce 0
/vendor/bin/rknn_server &
```

如果出现以下输出信息,则代表启动rknn_server服务成功,即已经安装RKNPU2环境。

```text
start rknn server, version: x.x.x
```

检查版本是否一致:

```text
# 查询 rknn_server 版本
strings /vendor/bin/rknn_server | grep -i "rknn_server version"

# 查询 librknnrt.so 库版本
# 64位系统
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"
# 32位系统
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
```

如果出现以下输出信息,则代表rknn_server版本为x.x.x,librknnrt.so的版本为x.x.x。

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

**2. 板端为Linux系统**

检查RKNPU2环境是否安装:如果能够启动rknn_server服务,则代表板端已经安装RKNPU2环境。

```text
# 进入板端
adb shell

# 启动 rknn_server
restart_rknn.sh
```

如果出现以下输出信息,则代表启动rknn_server服务成功,即已经安装RKNPU2环境。

```text
start rknn server, version: x.x.x
```

检查版本是否一致:

```text
# 查询 rknn_server 版本
strings /usr/bin/rknn_server | grep -i "rknn_server version"

# 查询 librknnrt.so 库版本
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
```

如果出现以下输出信息,则代表rknn_server版本为x.x.x,librknnrt.so的版本为x.x.x。

```text
rknn_server version: x.x.x
librknnrt version: x.x.x
```

#### 3.3.3 安装/更新RKNPU2环境

不同的板端系统需要安装不同的RKNPU2环境,下面分别介绍各自的安装方法。

说明: 如果已经安装版本一致的RKNPU2环境,则本节内容可以跳过。

**1. 板端为Android系统**

进入rknpu2目录,使用adb工具将相应的rknn_server和librknnrt.so推送至板端,然后启动rknn_server,参考命令如下:

```text
# 进入 rknpu2 目录
cd Projects/rknn-toolkit2/rknpu2

# 切换到 root 用戶权限
adb root

# 挂载文件系统为可读写模式
adb remount

# 推送 rknn_server
# 注:在 64 位 Android 系统中,BOARD_ARCH 对应 arm64 目录;在 32 位系统中,对应 arm 目录。
adb push runtime/Android/rknn_server/${BOARD_ARCH}/rknn_server /vendor/bin/

# 推送 librknnrt.so
# 64位系统
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64/
# 32位系统
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib/

# 进入板端
adb shell

# 赋予可执行权限
chmod +x /vendor/bin/rknn_server

# 重启 rknn_server 服务
su
setenforce 0
/vendor/bin/rknn_server &
```

**2. 板端为Linux系统**

进入rknpu2目录,使用adb工具将相应的rknn_server和librknnrt.so推送至板端,然后启动rknn_server,参考命令如下:

```text
# 进入 rknpu2 目录
cd Projects/rknn-toolkit2/rknpu2

# 推送 rknn_server 到板端
# 注:在64位Linux系统中,BOARD_ARCH对应aarch64目录,在32位系统,对应armhf目录。
adb push runtime/Linux/rknn_server/${BOARD_ARCH}/usr/bin/* /usr/bin

# 推送 librknnrt.so
adb push runtime/Linux/librknn_api/${BOARD_ARCH}/librknnrt.so /usr/lib

# 进入板端
adb shell

# 赋予可执行权限
chmod +x /usr/bin/rknn_server
chmod +x /usr/bin/start_rknn.sh
chmod +x /usr/bin/restart_rknn.sh

# 重启 rknn_server 服务
restart_rknn.sh
```

### 3.4 安装编译工具

#### 3.4.1 安装CMake

在计算机的终端中,执行以下命令:

```text
# 更新包列表
sudo apt update

# 安装 cmake
sudo apt install cmake
```

#### 3.4.2 安装编译器

##### 3.4.2.1 确认开发板的系统类型、系统架构

为了方便描述,后续文档使用"板端"来表示开发板端。

步骤1:确认板端系统类型

在计算机的终端中,执行以下命令:

```text
adb shell getprop ro.build.version.release
```

如果输出是数字(Android系统版本号),则表示板端是Android系统:

```text
12
```

否则板端是Linux系统:

```text
/bin/sh: getprop: not_found
```

步骤2:确认板端系统架构

如果板端是Android系统,可以在计算机端执行以下命令查询系统架构:

```text
adb shell getprop ro.product.cpu.abi
```

该命令的输出信息参考如下,其中arm64-v8a表示ARM 64位架构、第八版本的ABI。

```text
arm64-v8a
```

如果板端是Linux系统,可以在计算机端执行以下命令查询系统架构:

```text
adb shell uname -a
```

该命令的参考输出信息如下,其中aarch64表示ARM 64位架构。

```text
Linux Rockchip 5.10.160 #183 SMP Tue Oct 24 18:52:11 CST 2023 aarch64 GNU/Linux
```

##### 3.4.2.2 Android系统开发板安装NDK

适用范围: 本节适用于Android系统的开发板,如果板端是Linux系统,请忽略此节。

NDK下载地址(建议下载r19c版本):https://dl.google.com/android/repository/android-ndk-r19c-linux-x86_64.zip

解压软件包

建议将NDK软件包解压到Projects的文件夹中,位置如下:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── android-ndk-r19c # 此路径在后面编译 RKNN C Demo 时会用到
```

此时,NDK编译器的路径就是 Projects/android-ndk-r19c 。

##### 3.4.2.3 Linux系统开发板安装GCC交叉编译器

适用范围: 本节适用于Linux系统的开发板,如果板端是Android系统,请忽略此节。

GCC下载地址

板端为64位系统:https://developer.arm.com/-/cdn-downloads/permalink/legacy-linaro-gnu-toolchains/6.3-2017.05/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu.tar.xz

板端为32位系统:https://developer.arm.com/-/cdn-downloads/permalink/legacy-linaro-gnu-toolchains/6.3-2017.05/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf.tar.xz

解压软件包

建议将GCC软件包解压到Projects的文件夹中。以板端为64位系统的GCC软件包为例,存放位置如下:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu # 此路径在后面编译RKNN C Demo时会用到
```

此时,GCC编译器的路径是 Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu 。

### 3.5 运行环境预检查

在开始模型转换前,建议一次完成以下检查:

```text
# Toolkit
conda activate toolkit2
python -c "from rknn.api import RKNN; print('Toolkit OK')"

# 编译工具
cmake --version

# 设备
adb devices
```

如果需要运行RKNN C Demo,还应根据板端系统确认编译器路径:

板端为Android系统:确认NDK路径(如 Projects/android-ndk-r19c );

板端为Linux系统:确认GCC编译器路径(如 Projects/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu )。

{% endraw %}
