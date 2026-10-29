---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — 生成、编译与运行 C++ 部署示例"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-toolkit-api-cpp-codegen"
slug: "rknn-v250-toolkit-api-cpp-codegen"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — 生成、编译与运行 C++ 部署示例 | 完整参数、代码与平台限制参考"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — 生成、编译与运行 C++ 部署示例 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-toolkit-api-cpp-codegen/"
---

## 平台参考与来源

本文依据 RKNN V2.5.0 原厂 PDF 整理。适用于原文列出的芯片和接口；ArmSoM 板卡须先核对 SoC、NPU 驱动、Toolkit/Runtime、SDK/BSP 和内核版本。尚未进行 ArmSoM 硬件验证，原文示例及测量值不是 ArmSoM 实测。

## 系列导航

- [环境、依赖与对象生命周期](/zh/articles/rknn-v250-toolkit-api-requirements-lifecycle/)
- [模型配置与量化参数](/zh/articles/rknn-v250-toolkit-api-configuration/)
- [加载 Caffe、TensorFlow、ONNX 与 PyTorch](/zh/articles/rknn-v250-toolkit-api-model-loading/)
- [构建、混合量化与导出](/zh/articles/rknn-v250-toolkit-api-build-quantize-export/)
- [运行时、算子注册与推理](/zh/articles/rknn-v250-toolkit-api-runtime-inference/)
- [精度、性能、内存与设备查询](/zh/articles/rknn-v250-toolkit-api-evaluation-query/)
- [生成、编译与运行 C++ 部署示例](/zh/articles/rknn-v250-toolkit-api-cpp-codegen/)

{% raw %}

<!-- source CN p25 unit 146 -->

## 10 C++部署示例生成接口

<!-- source CN p25 unit 147 -->

| API | codegen |
| --- | --- |
| 描述 | 根据已导出的RKNN模型生成C++部署示例,编译后可在板端运行。示例使用RKNN C API零拷贝接口执行<br>推理,可输出性能数据,并可将推理结果保存为NPY文件。 |
| 参数 | output_path:生成的C++示例工程目录。 |
| 参数 | inputs:可选的模型输入文件路径列表,默认值为None。支持JPG、JPEG、PNG和NPY文件;单输入模型<br>也可传入一个字符串路径。文件数量必须与模型输入数量相同,并按模型输入顺序排列。NPY数据的shape<br>应与原始模型的对应输入shape一致,四维NPY数据按NCHW排布。 |
| 参数 | overwrite:是否覆盖已存在的output_path目录,默认值为False。当目录已存在且该值为False时,接<br>口返回失败;设为True时,原目录会被删除后重新生成。 |
| 返回值 | 0:成功。<br>-1:失败。 |

<!-- source CN p25 unit 148 -->

### 10.1 生成示例

<!-- source CN p25 unit 149 -->

调用codegen前必须先调用export_rknn。下面的例子会使用指定图片在PC端执行一次模型推理,将推理结果作为板端校验所需的golden数据,并生成 run.sh 中的默认输入命令。

<!-- source CN p25 unit 150 -->

```python
# 先导出RKNN模型,再生成C++部署示例
ret = rknn.export_rknn('./mobilenet_v2.rknn')
if ret != 0:
    print('Export RKNN model failed!')
    exit(ret)

ret = rknn.codegen(output_path='./rknn_app_demo',
                  inputs=['./mobilenet_v2/dog_224x224.jpg'],
                  overwrite=True)
if ret != 0:
    print('Generate C++ demo failed!')
    exit(ret)
```

<!-- source CN p25 unit 151 -->

多输入模型需要传入与模型输入数量相同的列表,例如:

<!-- source CN p25 unit 152 -->

```python
ret = rknn.codegen(output_path='./rknn_app_demo',
                  inputs=['./input0.npy', './input1.npy'],
                  overwrite=True)
```

<!-- source CN p25 unit 153 -->

如果 inputs=None ,仍会生成可用于性能测试的C++工程,但不会生成输入数据和golden输出,板端运行时也不会保存或比对输出。 build 接口的 dataset 参数不会代替这里的 inputs 参数。

<!-- source CN p25 unit 154 -->

### 10.2 生成内容

<!-- source CN p25 unit 155 -->

生成成功后,output_path目录的主要内容如下。其中 data 目录在指定 inputs 时生成。

<!-- source CN p26 unit 156 -->

```text
rknn_app_demo/
├── CMakeLists.txt
├── README.md / README_EN.md
├── build_linux.sh / build_android.sh
├── run.sh
├── src/ # RKNN C API推理示例
├── libs/ # NPY、图像缩放和布局/类型转换辅助代码
└── data/
    ├── inputs/ # codegen处理后的输入文件
    └── outputs/golden/ # PC端Python API生成的FP32参考输出
```

<!-- source CN p26 unit 157 -->

输入为图片时,生成阶段使用OpenCV读取和缩放图片;生成的C++示例使用stb读取图片,并在尺寸不匹配时进行letterbox resize。两者的图像处理实现不同,因此板端输出与golden输出的余弦相似度可能低于

<!-- source CN p26 unit 158 -->

0.9999。对于不适合直接使用图片的模型输入,生成阶段会将输入转换为FP32 NPY文件。

<!-- source CN p26 unit 159 -->

### 10.3 编译和运行

<!-- source CN p26 unit 160 -->

首先指定本地RKNPU2仓库路径。Linux版使用交叉编译器;RV1103/RV1103B/RV1106/RV1106B还需通过GCC_COMPILER 指定工具链前缀。Android版需要设置 ANDROID_NDK_PATH 。

<!-- source CN p26 unit 161 -->

Linux编译脚本支持RV1103、RV1103B、RV1106、RV1106B、RV1126B、RK3562、RK3566、RK3568、RK3576、RK3588和RK3588S;Android编译脚本支持RK3562、RK3566、RK3568、RK3576和RK3588。

<!-- source CN p26 unit 162 -->

```text
cd ./rknn_app_demo
export RKNPU2=/path/to/rknpu2

# Linux;将rk3562替换为实际目标平台
./build_linux.sh rk3562

# Android
export ANDROID_NDK_PATH=/path/to/android-ndk
./build_android.sh rk3562
```

<!-- source CN p26 unit 163 -->

编译产物分别位于 install/rknn_app_demo_Linux 或 install/rknn_app_demo_Android 。将整个目录推送到板端后,可执行自动生成的脚本:

<!-- source CN p26 unit 164 -->

```text
adb push ./install/rknn_app_demo_Linux /data/
adb shell
cd /data/rknn_app_demo_Linux
./run.sh
```

<!-- source CN p26 unit 165 -->

也可直接运行可执行文件,命令格式为:

<!-- source CN p26 unit 166 -->

```text
./rknn_app_demo <model_path> [input_paths] [repeat_times]
```

<!-- source CN p26 unit 167 -->

不指定 input_paths 时,只执行推理和性能统计,不保存输出。

<!-- source CN p26 unit 168 -->

多输入路径使用 # 连接,顺序必须与模型输入顺序一致,例如 ./data/inputs/input0.npy#./data/inputs/input1.npy 。

<!-- source CN p27 unit 169 -->

repeat_times 为正整数,用于设置推理循环次数。如果仅需设置循环次数,可将 input_paths 设为空字符串,例如 ./rknn_app_demo ./mobilenet_v2.rknn "" 100 。

<!-- source CN p27 unit 170 -->

指定有效输入时,所有输出会以FP32 NPY格式保存到 data/outputs/runtime 。如果data/outputs/golden 中存在同名参考输出,程序还会打印两者的余弦相似度。

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

校对提示：原文日志示例仍显示 SDK 1.5.2，按历史示例保留，不作为 V2.5.0 实测结果。中英文环境表对 Ubuntu20.04 的 Python 列写法不同（中文 3.8/3.9、英文 3.8/3.8，Debian11 也存在相同差异），ARM64 段的 Debian 表头仍写 x64，均保留来源并提醒按实际安装包核对。V2.5.0 已新增 C++ codegen 章节并细化量化与内存策略；未用旧版参数替换新版。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
