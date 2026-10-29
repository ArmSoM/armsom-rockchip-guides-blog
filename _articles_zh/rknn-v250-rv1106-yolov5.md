---
title: "RV1103/RV1106 RKNN 入门（四）：YOLOv5 转换、Python 和 C 部署"
description: "RV1103/RV1106 RKNN 入门（四）：YOLOv5 转换、Python 和 C 部署 · RKNN2 V2.5.0"
excerpt: "RV1103/RV1106 RKNN 入门（四）：YOLOv5 转换、Python 和 C 部署"
translation_key: "rknn-v250-rv1106-yolov5"
slug: "rknn-v250-rv1106-yolov5"
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

**RV1103/RV1106 RKNN 入门（四）：YOLOv5 转换、Python 和 C 部署**

[RV1103/RV1106 RKNN 入门（五）：Docker、启动问题与后续文档](/zh/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 4. 运行第一个通用模型

本章以 RV1106 平台和 YOLOv5 为例,完成模型获取、RKNN 模型转换、Python 连板推理和 C/C++ 板端部署。

说明: 不同 Model Zoo 示例的参数和用法可能存在差异,请以对应示例目录下的 README.md 为准。

### 4.1 获取示例和模型

RKNN Model Zoo 提供常用模型的示例代码,工程目录结构如下:

```text
rknn_model_zoo
├── 3rdparty # 第三方库
├── datasets # 数据集
├── examples # 示例代码
├── utils # 常用方法,如文件操作、画图等
├── build-android.sh # Android 开发板编译脚本
├── build-linux.sh # Linux 开发板编译脚本
└── ...
```

以 YOLOv5 为例:

```text
rknn_model_zoo
├── examples
│   └── yolov5
│       ├── cpp # C/C++ 版本示例代码
│       ├── model # 模型、测试图片等文件
│       ├── python # 模型转换脚本和 Python 版本示例代码
│       └── README.md
└── ...
```

进入 model 目录并运行 download_model.sh ,下载 YOLOv5 ONNX 模型:

```text
cd Projects/rknn_model_zoo/examples/yolov5/model

# 下载 yolov5 ONNX 模型
# 示例下载结果:model/yolov5s_relu.onnx
./download_model.sh
```

### 4.2 转换模型

进入 YOLOv5 Python 示例目录,使用 convert.py 将 ONNX 模型转换为 RKNN 模型:

```text
cd Projects/rknn_model_zoo/examples/yolov5/python

# 用法:python convert.py model_path [rv1103|rv1103b|rv1106|rv1106b] [i8/fp] [output_path]
python convert.py ../model/yolov5s_relu.onnx rv1106 i8 ../model/yolov5s_relu.rknn
```

注意: RV1103、RV1106 与 RV1103B、RV1106B 生成的模型不能共用。使用其他开发板时,需要修改命令中的平台参数。

### 4.3 运行 RKNN Python Demo

RKNN Python Demo 可通过连板调试方式在板端运行转换后的 YOLOv5 RKNN 模型:

```text
cd Projects/rknn_model_zoo/examples/yolov5/python

# 用法:python yolov5.py --model_path {rknn_model} --target {target_platform} --img_show
# --img_show 用于显示结果图片
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rv1106 --img_show
```

如果需要先在计算机端运行原始 ONNX 模型,可执行:

```text
python yolov5.py --model_path ../model/yolov5s_relu.onnx --img_show
```

默认输入图片为 model/bus.jpg ,输出结果如下:

![中文原稿配图 · PDF 21](/assets/images/rknn-v250/rv1106/cn/p021-figure-01.png)

*中文原稿配图 · PDF 21*

图4-1 RKNN Python Demo 输出图片

如果 Python Demo 能正常完成推理,说明模型转换、ADB 连接、 rknn_server 和板端 Mini Runtime 的基本链路已经跑通。

### 4.4 编译并部署 RKNN C Demo

Python Demo 和 C Demo 使用同一份已转换的 RKNN 模型,因此无需重复执行 4.1 和 4.2。

完整运行 RKNN C Demo,需要将 C/C++ 源代码编译为可执行文件,再将可执行文件、模型、测试图片和依赖库推送到板端。

#### 4.4.1 编译

以 Linux 系统、armhf 架构的 RV1106 为例。RV1103/RV1103B 同样为 Linux 系统开发板。

在运行 build-linux.sh 前,需要指定本地 GCC 交叉编译器路径。在 build-linux.sh 脚本开头加入:

```text
GCC_COMPILER=Projects/arm-rockchip831-linux-uclibcgnueabihf/bin/arm-rockchip831-linux-uclibcgnueabihf
```

然后执行编译:

```text
cd Projects/rknn_model_zoo

# 用法:./build-linux.sh -t <target> -a <arch> -d <build_demo_name> [-b <build_type>] [-m]
# -t : target (rv1103/rv1106),rv1103b、rv1106b 和 rv1103、rv1106 除模型外其他代码可共用
# -a : arch (aarch64/armhf)
# -d : demo name,对应 examples 目录下子文件夹名称,如 yolov5、mobilenet
# -b : build_type(Debug/Release)
# -m : enable address sanitizer,build_type 需设置为 Debug
./build-linux.sh -t rv1106 -a armhf -d yolov5
```

#### 4.4.2 推送文件到板端

编译完成后,会在 rknn_model_zoo 目录下生成 install 文件夹,其中包含可执行文件、依赖库、模型和测试图片。参考目录结构:

```text
install
└── rv1106_linux_armhf
    └── rknn_yolov5_demo
        ├── lib
        ├── model
        └── rknn_yolov5_demo
```

将整个 Demo 目录推送到板端:

```text
cd Projects/rknn_model_zoo

# 使用不同模型和平台时,请在 install 目录下选择对应路径
adb push install/rv1106_linux_armhf/rknn_yolov5_demo /data/
```

### 4.5 板端运行并验证输出

进入板端并运行可执行文件:

```text
adb shell

cd /data/rknn_yolov5_demo/

# 设置依赖库环境
export LD_LIBRARY_PATH=/data/rknn_yolov5_demo/lib

# 用法:./rknn_yolov5_demo <model_path> <input_path>
./rknn_yolov5_demo model/yolov5s_relu.rknn model/bus.jpg
```

默认输出图片保存为 rknn_yolov5_demo/out.png 。在计算机端执行以下命令拉取结果:

```text
adb pull /data/rknn_yolov5_demo/out.png .
```

输出图片如下:

![中文原稿配图 · PDF 24](/assets/images/rknn-v250/rv1106/cn/p024-figure-01.png)

*中文原稿配图 · PDF 24*

图4-2 RKNN C Demo 输出图片

如果能够正常生成并拉取 out.png ,说明 C/C++ 编译、文件部署、Mini Runtime 加载和板端推理链路已经完成首次验证。

### 4.6 数据集精度评估(可选)

rknn_model_zoo/datasets 目录用于存放精度评估数据集。对于 YOLOv5,需要先下载 COCO 验证集。

```text
cd Projects/rknn_model_zoo/datasets/COCO

# 下载 val2017 数据集
python download_eval_dataset.py
```

进行数据集精度评估时,需要安装 pycocotools ,并通过 --coco_map_test 和 --img_folder 指定评估方式及数据集路径:

```text
pip install pycocotools

cd Projects/rknn_model_zoo/examples/yolov5/python

python yolov5.py \
    --model_path ../model/yolov5s_relu.rknn \
    --target rv1106 \
    --img_folder ../../../datasets/COCO/val2017 \
    --coco_map_test
```

{% endraw %}
