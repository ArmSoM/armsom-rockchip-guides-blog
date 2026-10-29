---
title: "RKNN2 V2.5.0 入门（五）：YOLOv5 检测与精度评估"
description: "RKNN2 V2.5.0 入门（五）：YOLOv5 检测与精度评估 · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0 入门（五）：YOLOv5 检测与精度评估"
translation_key: "rknn-v250-sdk-quickstart-yolov5"
slug: "rknn-v250-sdk-quickstart-yolov5"
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

**RKNN2 V2.5.0 入门（五）：YOLOv5 检测与精度评估**

[RKNN2 V2.5.0 入门（六）：Docker、启动问题与文档导航](/zh/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

### 4.2 运行目标检测示例

本节以YOLOv5模型为例,介绍目标检测模型的转换、连板运行、板端部署和精度评估,示例位于examples/yolov5 目录。

#### 4.2.1 转换模型

进入 rknn_model_zoo/examples/yolov5/model 目录,运行download_model.sh脚本,该脚本将下载一个可用的YOLOv5 ONNX模型,并存放在当前model目录下,参考命令如下:

```text
# 进入 rknn_model_zoo/examples/yolov5/model 目录
cd Projects/rknn_model_zoo/examples/yolov5/model

# 运行 download_model.sh 脚本,下载 yolov5 onnx 模型
# 例如,下载好的 onnx 模型存放路径为 model/yolov5s_relu.onnx
./download_model.sh
```

进入 rknn_model_zoo/examples/yolov5/python 目录,运行convert.py脚本,该脚本将原始的ONNX模型转成RKNN模型,参考命令如下:

```text
# 进入 rknn_model_zoo/examples/yolov5/python 目录
cd Projects/rknn_model_zoo/examples/yolov5/python

# 运行 convert.py 脚本,将原始的 ONNX 模型转成 RKNN 模型
# 用法: python convert.py model_path [rk3566|rk3588|rk3562] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rk3588 i8 ../model/yolov5s_relu.rknn
```

其中, i8 表示启用8位量化。转换完成后,模型目录中会生成对应的 .rknn 模型文件。

#### 4.2.2 运行RKNN Python Demo

RKNN Python Demo通过连板调试的方式在板端运行YOLOv5模型。进入rknn_model_zoo/examples/yolov5/python 目录,运行yolov5.py脚本:

```text
# 运行 yolov5.py 脚本,在板端运行 yolov5 模型
# 用法: python yolov5.py --model_path {rknn_model} --target {target_platform} --img_show

# 其中,如果带上 --img_show 参数,则会显示结果图片
# 注:这里以 rk3588 平台为例,如果是其他开发板,则需要修改命令中的平台类型
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588 --img_show

# 如果想先在计算机端运行原始的 onnx 模型,可以参考以下命令
# 用法: python yolov5.py --model_path {onnx_model} --img_show
python yolov5.py --model_path ../model/yolov5s_relu.onnx --img_show
```

脚本运行成功后输出信息如下,其中,class字段代表预测的类别,score为得分,(xmin, ymin)是检测框的左上⻆坐标,(xmax, ymax)是检测框的右下⻆坐标。

```text
# class @ (xmin, ymin, xmax, ymax)score
person @ (209 244 286 506) 0.884
person @ (478 238 559 526) 0.868
person @ (110 238 230 534) 0.825
bus @ (94 129 553 468) 0.705
person @ (79 354 122 516) 0.339
```

默认输入图片是 model/bus.jpg ,结果图片如下所示:

![中文原稿配图 · PDF 25](/assets/images/rknn-v250/sdkquick/cn/p025-figure-01.png)

*中文原稿配图 · PDF 25*

图4-1 RKNN Python Demo 可视化结果

#### 4.2.3 运行RKNN C Demo

完整运行一个RKNN C Demo,需要先将C/C++源代码编译成可执行文件,然后推送到板端,最后在板端运行。编译前需先安装编译工具(见3.4节):板端为Android系统时在build-android.sh脚本开头配置ANDROID_NDK_PATH,板端为Linux系统时在build-linux.sh脚本开头配置GCC_COMPILER。编译脚本的参数说明见各示例目录下的README.md。

**1. 编译**

```text
# 板端为 Android 系统
# 注:在 build-android.sh 脚本开头配置 ANDROID_NDK_PATH
cd Projects/rknn_model_zoo
./build-android.sh -t rk3588 -a arm64-v8a -d yolov5

# 板端为 Linux 系统
# 注:在 build-linux.sh 脚本开头配置 GCC_COMPILER
cd Projects/rknn_model_zoo
./build-linux.sh -t rk3588 -a aarch64 -d yolov5
```

**2. 推送文件到板端**

编译完成后,可执行文件位于 install 目录下的 rknn_yolov5_demo 文件夹:

```text
# 板端为 Android 系统
adb root
adb push install/rk3588_android_arm64-v8a/rknn_yolov5_demo /data/

# 板端为 Linux 系统
adb push install/rk3588_linux_aarch64/rknn_yolov5_demo /userdata/
```

**3. 板端运行Demo**

```text
# 进入板端
adb shell

# 进入 rknn_yolov5_demo 目录
# Android 系统为 /data/rknn_yolov5_demo,Linux 系统为 /userdata/rknn_yolov5_demo
cd /userdata/rknn_yolov5_demo

# 设置依赖库环境
export LD_LIBRARY_PATH=./lib

# 运行可执行文件
# 用法: ./rknn_yolov5_demo <model_path> <input_path>
./rknn_yolov5_demo model/yolov5s_relu.rknn model/bus.jpg
```

默认情况下,输出图片保存路径为 rknn_yolov5_demo/out.png ,可以通过adb工具从板端拉取到本地查看,在本地计算机的终端中,执行以下命令:

```text
# 拉取到本地当前目录
adb pull /userdata/rknn_yolov5_demo/out.png .
```

输出结果图片如下所示:

![中文原稿配图 · PDF 27](/assets/images/rknn-v250/sdkquick/cn/p027-figure-01.png)

*中文原稿配图 · PDF 27*

图4-2 RKNN C Demo 可视化结果

首次运行只需确认Demo正常结束并生成 out.png 。实际检测结果会随模型版本、输入图片及运行环境变化。

#### 4.2.4 数据集精度评估(可选)

rknn_model_zoo/datasets 目录存放数据集,用于精度评估,需要先下载评估数据集并保存至该目录。例如,对于YOLOv5模型,需要下载COCO数据集。进入 rknn_model_zoo/datasets/COCO 目录,运行download_eval_dataset.py脚本,该脚本将下载val2017数据集,并存放在当前COCO目录下,参考命令如下:

```text
# 进入 rknn_model_zoo/datasets/COCO 目录
cd Projects/rknn_model_zoo/datasets/COCO

# 运行 download_eval_dataset.py 脚本,下载 COCO 数据集
python download_eval_dataset.py
```

进行数据集精度评估时,需要指定 --coco_map_test 参数,并指定评估数据集路径 --img_folder ,参考命令如下:

```text
# 请先安装 pycocotools
pip install pycocotools

# 进入 rknn_model_zoo/examples/yolov5/python 目录
cd Projects/rknn_model_zoo/examples/yolov5/python

# 运行 yolov5.py 脚本
python yolov5.py \
    --model_path ../model/yolov5s_relu.rknn \
    --target rk3588 \
    --img_folder ../../../datasets/COCO/val2017 \
    --coco_map_test
```

说明: 模型级精度分析(逐层对比量化模型与浮点模型的推理差异)请使用RKNN-Toolkit2的rknn.accuracy_analysis() 接口,详细说明参考《RKNN2 SDK 开发指南》文档中的"模型精度分析"章节。

{% endraw %}
