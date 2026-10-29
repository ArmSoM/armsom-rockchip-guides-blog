---
title: "RKNN2 V2.5.0 入门（四）：MobileNet 转换与部署"
description: "RKNN2 V2.5.0 入门（四）：MobileNet 转换与部署 · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0 入门（四）：MobileNet 转换与部署"
translation_key: "rknn-v250-sdk-quickstart-mobilenet"
slug: "rknn-v250-sdk-quickstart-mobilenet"
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

**RKNN2 V2.5.0 入门（四）：MobileNet 转换与部署**

[RKNN2 V2.5.0 入门（五）：YOLOv5 检测与精度评估](/zh/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0 入门（六）：Docker、启动问题与文档导航](/zh/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 4. 运行示例模型

本章以MobileNet(图像分类)和YOLOv5(目标检测)两个示例,演示"获取模型 -> 转换 -> 连板运行 -> 编译部署 -> 板端运行 -> 检查结果"的最小闭环。完整的模型转换配置、量化方法、精度/耗时/内存评估和API调用顺序请参考《RKNN2 SDK 开发指南》文档。

### 4.1 运行图像分类示例

本节以MobileNet模型为例,介绍图像分类模型的转换、连板运行和板端部署,示例位于examples/mobilenet 目录。

#### 4.1.1 转换模型

进入 rknn_model_zoo/examples/mobilenet/model 目录,运行download_model.sh脚本下载MobileNet ONNX模型:

```text
# 进入 rknn_model_zoo/examples/mobilenet/model 目录
cd Projects/rknn_model_zoo/examples/mobilenet/model

# 下载 mobilenetv2-12.onnx 模型
./download_model.sh
```

进入 rknn_model_zoo/examples/mobilenet/python 目录,运行mobilenet.py脚本,该脚本将ONNX模型转成RKNN模型:

```text
# 进入 rknn_model_zoo/examples/mobilenet/python 目录
cd Projects/rknn_model_zoo/examples/mobilenet/python

# 用法: python mobilenet.py --model <onnx_model> --target <TARGET_PLATFORM> [--dtype <i8/fp>]
# 注:这里以 rk3588 平台为例,如果是其他开发板,则需要修改命令中的平台类型
python mobilenet.py --model ../model/mobilenetv2-12.onnx --target rk3588
```

其中, --dtype 省略时默认为 i8 (8位量化), fp 表示不量化。该命令在转换完成后会直接在PC模拟器上进行推理,无需连接开发板;转换后的模型默认保存为examples/mobilenet/model/mobilenet_v2.rknn 。

#### 4.1.2 运行RKNN Python Demo

模拟器推理: 不加 --npu_device_test 参数即可在PC模拟器上推理,命令同4.1.1节,适用于无板环境下的快速验证。

连板运行: 追加 --npu_device_test 参数,通过连板调试的方式在板端推理:

```text
python mobilenet.py --model ../model/mobilenetv2-12.onnx --target rk3588 --npu_device_test
```

脚本运行成功后输出图像分类的TOP5结果,格式如下:

```text
-----TOP 5-----
[494] score=0.990035 class=n03017168 chime, bell, gong
[469] score=0.003907 class=n02939185 caldron, cauldron
[653] score=0.001089 class=n03764736 milk can
[747] score=0.000945 class=n04023962 punching bag, punch bag, punching ball,
punchball
[442] score=0.000712 class=n02825657 bell cote, bell cot
```

其中,方括号内为类别索引,score为置信度,class为类别名称。

#### 4.1.3 运行RKNN C Demo

完整运行一个RKNN C Demo,需要先将C/C++源代码编译成可执行文件,然后推送到板端,最后在板端运行。编译前需先安装编译工具(见3.4节):板端为Android系统时在build-android.sh脚本开头配置ANDROID_NDK_PATH,板端为Linux系统时在build-linux.sh脚本开头配置GCC_COMPILER。编译脚本的参数说明见各示例目录下的README.md。

**1. 编译**

```text
# 板端为 Android 系统
# 注:在 build-android.sh 脚本开头配置 ANDROID_NDK_PATH
cd Projects/rknn_model_zoo
./build-android.sh -t rk3588 -a arm64-v8a -d mobilenet

# 板端为 Linux 系统
# 注:在 build-linux.sh 脚本开头配置 GCC_COMPILER
cd Projects/rknn_model_zoo
./build-linux.sh -t rk3588 -a aarch64 -d mobilenet
```

**2. 推送文件到板端**

编译完成后,可执行文件位于 install 目录下的 rknn_mobilenet_demo 文件夹:

```text
# 板端为 Android 系统
adb root
adb push install/rk3588_android_arm64-v8a/rknn_mobilenet_demo /data/

# 板端为 Linux 系统
adb push install/rk3588_linux_aarch64/rknn_mobilenet_demo /userdata/
```

**3. 板端运行Demo**

```text
# 进入板端
adb shell

# 进入 rknn_mobilenet_demo 目录
# Android 系统为 /data/rknn_mobilenet_demo,Linux 系统为 /userdata/rknn_mobilenet_demo
cd /userdata/rknn_mobilenet_demo

# 设置依赖库环境
export LD_LIBRARY_PATH=./lib

# 运行可执行文件
# 用法: ./rknn_mobilenet_demo <model_path> <input_path>
./rknn_mobilenet_demo model/mobilenet_v2.rknn model/bell.jpg
```

输出结果同4.1.2节的TOP5格式。

{% endraw %}
