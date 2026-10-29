---
title: "RKNN2 SDK V2.5.0 · 开发环境、版本与连板准备"
description: "RKNN2 SDK V2.5.0 · 开发环境、版本与连板准备 · 完整开发指南系列"
excerpt: "开发环境、版本与连板准备"
translation_key: "rknn-v250-sdk-guide-environment"
slug: "rknn-v250-sdk-guide-environment"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

平台参考：本文来自 Rockchip RKNN2 SDK V2.5.0 开发指南，涵盖源文明确列出的 SoC、Linux/Android Runtime 和对应 Toolkit。具体功能仅适用于各节列出的芯片、SDK、驱动和内核条件，不能据此推定所有 ArmSoM 板卡支持。部署前需核对实际 ArmSoM 板卡的 BSP、NPU 驱动、Runtime 与模型版本。本篇未进行 ArmSoM 硬件验证；日志、性能数字和示例均来自原稿。

来源与校对：中文遵循中文 V2.5.0（182 页），英文、俄文和德文遵循英文 V2.5.0（208 页）；保留各稿技术信息，不将旧版内容补充为新版事实。中文配图取自中文 PDF，英俄德配图取自英文 PDF，含独立提取的矢量流程图。保留原章节和公式编号。原稿部分交叉引用仍指向旧章号，动态 Shape 容量示例写作“1224+140=264”等、TP_NORM 支持说明有矛盾、init()/rknn.val_perf() 等名称与后文 API 不一致；原始信息保留，执行前以实际 V2.5.0 SDK 头文件及 API 手册核对。各部分均保留代码和参数，提取造成的跨页换行与表格续行已整理。

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 2/22**

[1. 软件栈与核心概念](/zh/articles/rknn-v250-sdk-guide-overview/)

**开发环境、版本与连板准备**

[3. 开发流程与接口选择](/zh/articles/rknn-v250-sdk-guide-workflow/)

[4. 模型转换与 ONNX 编辑](/zh/articles/rknn-v250-sdk-guide-conversion/)

[5. 量化、混合量化与 QAT](/zh/articles/rknn-v250-sdk-guide-quantization/)

[6. 推理、精度、性能与内存评估](/zh/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime 生命周期、布局与内存](/zh/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. 零拷贝接口与输入输出约束](/zh/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C API 部署与代码生成](/zh/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Toolkit Lite2 Python 部署](/zh/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API 与矩阵布局](/zh/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU 多核配置与性能](/zh/articles/rknn-v250-sdk-guide-multicore/)

[13. 动态 Shape 模型与部署](/zh/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. 多 Batch 推理](/zh/articles/rknn-v250-sdk-guide-multi-batch/)

[15. RK3588/RK3576 NPU SRAM](/zh/articles/rknn-v250-sdk-guide-sram/)

[16. 缓存一致性与稀疏化推理](/zh/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. 自定义算子：Python 与 C API](/zh/articles/rknn-v250-sdk-guide-custom-operators/)

[18. 模型加密部署](/zh/articles/rknn-v250-sdk-guide-encryption/)

[19. 精度问题诊断](/zh/articles/rknn-v250-sdk-guide-accuracy/)

[20. 性能分析与网络优化](/zh/articles/rknn-v250-sdk-guide-performance/)

[21. 内存分析、共享与复用](/zh/articles/rknn-v250-sdk-guide-memory/)

[22. 常见问题、错误处理与参考资源](/zh/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

## 1.2 版本与开发环境

RKNN-Toolkit2总共有支持两种不同的版本,一种是x86版本,另外一种是ARM64版本。两个版本的安装教程都一样,除了ARM64版本不支持docker安装。除此之外,ARM64版本仅支持转换模型时使用onnx和pytorch框架下的模型,其他框架的模型暂时不支持。

目前RKNN-Toolkit2的2个版本所支持深度学习框架的差异:

| 深度学习框架 | x86版本 | ARM64版本 |
| --- | --- | --- |
| Caffe | ✔ | ✗ |
| TensorFlow | ✔ | ✗ |
| TF Lite | ✔ | ✗ |
| ONNX | ✔ | ✔ |
| DarkNet | ✔ | ✗ |
| PyTorch | ✔ | ✔ |

两者所依赖的工具差异:

| 依赖工具 | x86版本 | ARM64版本 |
| --- | --- | --- |
| adb | ✔ | ✗ |
| rknn_server | ✔ | ✗ |
| rknn runtime | ✔ | ✔ |

两个版本使用差异:

主要差异在于调试功能包含精度分析,连板调试,内存和性能分析部分,ARM64版本直接在Linux系统的板端安装之后,只需直接使用上述对应功能,不需要启动rknn_server,只需保证板端上的 /usr/lib64 有对应的 librknnrt.so ,即可调用调试功能。由于ARM64版本不支持adb,所以所有调试功能都仅能在当前板端使用。x86版本需要更新并启动rknn_server,并且支持adb功能连接其他设备所以需保证adb正常使用状态下才能使用调试功能。

除此之外,x86版本和ARM64版本可能会存在性能差异,特别是在精度分析上或者使用大量图片做量化的情况下。

注:RK2118开发环境准备请参考《01_RKNN2_RK2118_快速入⻔_V2.5.0》。

### 1.2.1 RKNN-Toolkit2安装

本章节提供两种RKNN-Toolkit2安装方式,通过Docker方式安装和通过pip方式安装,用戶可自行选择任意一种方式进行安装。

#### 1.2.1.1 通过DOCKER方式安装

##### 1.2.1.1.1 安装Docker工具

已安装Docker工具的用戶可跳过此步骤,未安装的用戶请根据官方手册进行安装。Docker官方安装手册链接:https://docs.docker.com/install/linux/docker-ce/ubuntu/。

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

正确运行结果展示:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
```

##### 1.2.1.1.2 镜像准备

本节介绍两种RKNN-Toolkit2镜像环境准备方式,可任选一种方式进行操作。

**1. 通过Dockerfile创建镜像环境**

在RKNN-Toolkit2工程中docker/docker_file文件夹下,提供了构建RKNN-Toolkit2开发环境的Dockerfile文件,用戶通过Docker命令创建镜像,如下所示。

```text
# 注：以下 xx 和 x.x.x 代表版本号，请根据实际数值进行替换
cd docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. 加载已打包所有开发环境的Docker镜像**

下载对应版本的RKNN-Toolkit2工程文件,解压后在docker/docker_image文件夹下获取已打包所有开发环境的Docker镜像。

网盘下载链接:https://console.zbox.filez.com/l/I00fc3。提取码:rknn

执行以下命令加载对应Python版本的镜像文件。

```text
# 注：x.x.x 代表 RKNN-Toolkit2 的版本号，cpxx 代表的是 Python 的版本号
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

##### 1.2.1.1.3 查询镜像信息

创建或加载镜像成功后,查看Docker的镜像信息。

```text
docker images
```

相应的RKNN-Toolkit2镜像信息显示。

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

##### 1.2.1.1.4 运行镜像

执行以下命令运行Docker镜像,运行后将进入镜像的bash环境。

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb rknn-toolkit2:x.x.x-cpxx /bin/bash
```

将文件夹examples代码映射进Docker环境可通过附加“-v &lt;host src folder&gt;:&lt;image dst folder&gt;”参数。

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb -v /your/rknn-toolkit2-x.x.x/examples:/examples rknn-
toolkit2:x.x.x-cpxx /bin/bash
```

##### 1.2.1.1.5 运行Demo

```text
cd examples/onnx/yolov5
python test.py
```

脚本运行成功后结果如下。

```text
class score xmin, ymin, xmax, ymax
-------------------------------------------------
person 0.884 [ 208, 244, 286, 506]
person 0.868 [ 478, 236, 559, 528]
person 0.825 [ 110, 238, 230, 534]
person 0.339 [ 79, 353, 122, 516]
bus 0.705 [ 92, 128, 554, 467]
```

#### 1.2.1.2 通过PIP方式安装

##### 1.2.1.2.1 安装Python环境

若已安装Python环境,则可省略此步骤。

```text
sudo apt-get update
sudo apt-get install python3 python3-dev python3-pip
sudo apt-get install libxslt1-dev zlib1g zlib1g-dev libglib2.0-0 libsm6 libgl1-mesa-glx libprotobuf-dev gcc
```

若想安装RKNN-Toolkit2工具在本地环境(非Conda虚拟环境)中,请在安装好Python环境后跳至步骤

1.2.1.2.4。

##### 1.2.1.2.2 安装Miniforge工具

如果系统中同时有多个版本的Python环境,建议使用Miniforge管理Python环境。

检查是否安装Miniforge和版本信息,若已安装则可省略此小节步骤。

```text
conda -V
# 提示 conda: command not found 则表示未安装miniforge conda
# 提示 例如版本 conda 23.9.0
```

下载Miniforge安装包

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

安装Miniforge

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

ARM64版本:

下载Miniforge安装包arm64版本

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh
```

安装Miniforge arm64

```text
chmod 777 Miniforge3-Linux-aarch64.sh
bash Miniforge3-Linux-aarch64.sh
```

##### 1.2.1.2.3 创建RKNN-Toolkit2 Conda环境

进入Conda base环境

```text
source ~/miniforge3/bin/activate # Miniforge 安装的目录

(base) xxx@xxx-pc:~$
```

创建一个名为RKNN-Toolkit2且Python版本为3.8(建议版本)的Conda环境

```text
conda create -n RKNN-Toolkit2 python=3.8
```

进入RKNN-Toolkit2 Conda环境

```text
conda activate RKNN-Toolkit2
(RKNN-Toolkit2) xxx@xxx-pc:~$
```

##### 1.2.1.2.4 安装 RKNN-Toolkit2

激活 RKNN-Toolkit2 Conda 环境后,可通过 pip 源或者本地 wheel 包这两种方式安装 RKNN-Toolkit2: - 通过 pip 源安装

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# 如果已安装 RKNN-Toolkit2，可通过以下命令升级 RKNN-Toolkit2
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

通过本地 wheel 包安装

```text
# 请根据不同的 python 版本及处理器架构，选择不同的 requirements 文件:
# 其中 cpxx 是 python 版本号
pip install -r packages/x86_64/requirements_cpxx.txt
# pip install -r packages/arm64/arm64_requirements_cpxx.txt

# 安装 RKNN-Toolkit2
# 请根据不同的 python 版本及处理器架构，选择不同的 wheel 安装包文件：
# 其中 x.x.x 是 RKNN-Toolkit2 版本号，cpxx 是 python 版本号
pip install packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

若执行以下命令没有报错,则安装成功。

```text
$ python3
>>> from rknn.api import RKNN
```

### 1.2.2 设备端NPU环境准备

#### 1.2.2.1 NPU驱动版本确认

查询命令:

```text
dmesg | grep -i rknpu
或
cat /sys/kernel/debug/rknpu/version
或
cat /sys/kernel/debug/rknpu/driver_version
或
cat /proc/debug/rknpu/driver_version
```

查询结果:

```text
RKNPU driver: vX.X.X
```

X.X.X表示版本号,例如0.9.2。

Rockchip的固件均自带RKNPU驱动。若以上命令均查询不到NPU驱动版本,则可能为第三方固件未安装RKNPU驱动,需要打开kernel config文件的“CONFIG_ROCKCHIP_RKNPU=y”选项,重新编译内核驱动并烧录。建议RKNPU驱动版本&gt;=0.9.2。

#### 1.2.2.2 NPU连板环境确认

RKNN-Toolkit2的连板调试功能依赖板端的RKNN Server程序,该程序是一个运行在开发板上的后台代理服务,用于接收PC通过USB传输过来的命令和数据,然后调用相应的运行时接口,并返回相应结果给PC。所以在做连板调试前需要确认开发板是否已启动RKNN Server程序。

注:ARM64版本不需要通过连板调试,可跳过

检查方法:通过ADB工具进入开发板终端,查询是否有RKNN Server进程。

```text
adb shell
ps | grep rknn_server
```

查询结果:

```text
702 root 1192 S grep rknn_server
```

若查询到RKNN Server进程ID,则说明RKNN Server启动正常。若没有查询到RKNN Server进程ID,则执行以下命令手动启动RKNN Server后再进行查询。

Android系统手动启动RKNN Server:

```text
su
setenforce 0
nohup /vendor/bin/rknn_server >/dev/null&
```

RK356X/ RK3576 / RK3588 / RV1126B 的Linux系统手动启动RKNN Server:

```text
nohup /usr/bin/rknn_server >/dev/null&
```

RV1103 / RV1103B / RV1106 / RV1106B的Linux系统手动启动RKNN Server:

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

正常情况下Rockchip固件均已集成RKNN Server程序并添加到自启动脚本中,若无自启动或无相关脚本用于手动启动,请参考下一章节手动安装或更新RKNN Server。

#### 1.2.2.3 RKNN SERVER安装和更新

RKNN-Toolkit2 的连板调试功能要求板端已安装 RKNPU2 环境,并且启动 RKNN Server 服务。以下是RKNPU2 环境中的2个基本概念:

1. RKNN Server:一个运行在开发板上的后台代理服务,用于接收PC通过 USB 传输过来的数据,然后执行板端 Runtime 对应的接口,并返回结果给 PC。

2. RKNPU2 Runtime 库

librknnrt.so: 是用于 RK3562 / RK3566 / RK3568 / RK3576 / RK3588 / RV1126B 板端的 Runtime库。

librknnmrt.so: 是用于 RV1103 / RV1103B / RV1106 / RV1106B板端的 Runtime 库。

如果板端没有安装 RKNN Server,Runtime 库不存在,或者 RKNN Server 和 Runtime 库的版本不一致,都需要重新安装或更新。

注意:

1. 若使用动态维度输入的 RKNN 模型,则要求 RKNN Server 和 RKNPU2 Runtime 库版本 &gt;= 1.5.0。

2. 若使用大于2GB的模型,要求rknn_server版本&gt;=2.0.0b0。

3. 在RV1103 / RV1103B / RV1106 / RV1106B等小内存平台上,建议rknn_server版本&gt;=2.1.0。

4. 要保证 RKNN Server 、Runtime 库版本、RKNN-Toolkit2 版本一致,建议都安装最新的版本。

5. RK2118中的RKNN Server并不是用来做RKNN-Toolkit2的连板调试功能,而是用于DSP与MCU进行交互的服务。

6. ARM64版本无需依赖RKNN Server,所以不用启动和更新,但是调试功能依赖板端的RKNPU2 Runtime库,确保板端有这个库并更新到最新版

##### 1.2.2.3.1 RK356X / RK3576 / RK3588 / RV1126B 平台

1. Android系统

查询RKNN Server服务和 librknnrt.so 库版本,若版本号不一致请更新至同一版本。

```text
# 查询rknn_server版本
strings /vendor/bin/rknn_server | grep -i "rknn_server version"
# 显示rknn_server版本为X.X.X
# rknn_server version: X.X.X

# 查询librknnrt.so库版本
# 64位系统
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"
# 32位系统
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
# 显示librknnrt库版本为X.X.X
# librknnrt version: X.X.X
```

更新RKNN Server服务和librknnrt.so库。

```text
adb root
adb remount

# 64位系统：
adb push runtime/Android/rknn_server/arm64/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64

# 32位系统：
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib

# 重启RKNN Server服务：
adb shell
su
chmod +x /vendor/bin/rknn_server
nohup /vendor/bin/rknn_server >/dev/null&
sync
reboot
```

2. Linux系统

查询RKNN Server服务和 librknnrt.so 库版本,若不一致请更新至同一版本。

```text
# 查询rknn_server版本
strings /usr/bin/rknn_server | grep -i "rknn_server version"
# 显示rknn_server版本为X.X.X
# rknn_server version: X.X.X

# 查询librknnrt.so库版本
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
# 显示librknnrt库版本为X.X.X
# librknnrt version: X.X.X
```

更新RKNN Server服务和librknnrt.so库。

64位系统:

```text
adb push runtime/Linux/rknn_server/aarch64/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib64
```

32位系统:

```text
adb push runtime/Linux/rknn_server/armhf/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
```

重启RKNN Server服务:

```text
adb shell
chmod +x /usr/bin/rknn_server
nohup /usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

##### 1.2.2.3.2 RV1103 / RV1103B / RV1106 / RV1106B平台

查询RKNN Server和librknnmrt.so库版本,若不一致请更新至同一版本。

```text
# 查询rknn_server版本
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"
# 显示rknn_server版本为X.X.X
# rknn_server version: X.X.X

# 查询librknnmrt.so库版本
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
# 显示librknnmrt库版本为X.X.X
# librknnmrt version: X.X.X
```

更新RKNN Server服务和librknnmrt.so库。RV1103 / RV1103B 与RV1106 / RV1106B使用同一份RKNNServer服务和librknnmrt.so库。

```text
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/* /oem/usr/bin
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib

# 重启RKNN Server服务：
adb shell
chmod +x /oem/usr/bin/rknn_server
nohup /oem/usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

#### 1.2.2.4 查看RKNN SERVER详细日志

##### 1.2.2.4.1 Android系统

进入开发板终端,设置日志等级。

```text
adb shell
su
setenforce 0
setprop persist.vendor.rknn.server.log.level 5
```

关闭当前RKNN Server服务进程。

```text
kill -9 `pgrep rknn_server`
```

若没有自动重启RKNN Server服务,可以手动启动,查看详细日志。

```text
nohup /vendor/bin/rknn_server >/dev/null&
logcat
```

##### 1.2.2.4.2 Linux系统

进入开发板终端,设置日志等级。

```text
adb shell
export RKNN_SERVER_LOGLEVEL=5
```

重启RKNN Server服务可查看详细日志。

针对RK356X / RK3576 / RK3588 / RV1126B 平台,执行下列命令。

```text
nohup /usr/bin/rknn_server >/dev/null&
```

针对RV1103 / RV1103B / RV1106 / RV1106B平台,执行下列命令。

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

### 1.2.3 环境验证

环境部署完成后,建议按以下方法验证各组件是否就绪:

**1. 验证 RKNN-Toolkit2 安装**

```text
# 进入 Python 交互模式,导入 RKNN 类
python
>>> from rknn.api import RKNN
# 无报错即表示安装成功
```

**2. 验证设备连接**

```text
# 在 PC 端查询 adb 连接的设备
adb devices
# 能列出设备 ID 即连接正常
```

注:ARM64 版本的 Toolkit2 不支持 adb,调试功能仅在板端本地使用,无需验证此项。

**3. 验证板端环境**

检查 NPU 驱动版本、RKNN Server 进程状态和 Runtime 库是否就绪,检查与安装更新方法见 1.2.2 设备端NPU环境准备。

**4. 查询组件版本**

排查问题时可查询各组件的版本信息,查询方法如下:

```text
# 查询 RKNN-Toolkit2 版本
pip list | grep rknn-toolkit2

# 查询板端 rknn_server 版本(路径以 1.2.2 为准)
strings /usr/bin/rknn_server | grep -i "rknn_server version"

# 查询板端 Runtime 库版本(RK356X / RK3576 / RK3588 / RV1126B 平台,路径以 1.2.2 为准)
strings /usr/lib64/librknnrt.so | grep -i "librknnrt version"

# 查询板端 Runtime 库版本(RV1103 / RV1103B / RV1106 / RV1106B 平台)
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
```

说明:RKNN 模型文件中记录了转换时使用的 Toolkit2 版本,排查板端运行异常时可对比模型转换版本与板端 Runtime 库版本是否一致。

{% endraw %}
