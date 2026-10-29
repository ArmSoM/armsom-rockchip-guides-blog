---
title: "RK2118 NPU 入门（四）：模型转换、U 盘输入与推理结果"
description: "RK2118 NPU 入门（四）：模型转换、U 盘输入与推理结果 · RKNN2 V2.5.0"
excerpt: "RK2118 NPU 入门（四）：模型转换、U 盘输入与推理结果"
translation_key: "rknn-v250-rk2118-model-demo"
slug: "rknn-v250-rk2118-model-demo"
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

**RK2118 入门系列 · 4/5**

[RK2118 NPU 入门（一）：开发板、连接与串口](/zh/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU 入门（二）：主机环境与 Toolkit2 安装](/zh/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU 入门（三）：RT-Thread 与 DSP 固件编译](/zh/articles/rknn-v250-rk2118-firmware/)

**RK2118 NPU 入门（四）：模型转换、U 盘输入与推理结果**

[RK2118 NPU 入门（五）：Docker、常见问题与参考文档](/zh/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 4. 运行示例程序

本章将介绍如何快速在开发板上运行示例程序,内容分为三个部分:

- RKNN SDK介绍

- RKNN 模型转换

- RKNN C Demo 使用方法

### 4.1 RKNN SDK 介绍

RK2118 的 NPU 推理由 HIFI4 DSP0 完成,CPU0 不直接操作 NPU 硬件。相关代码分为三个部分:

```text
components/hifi4/samples/rk2118/npu_demo/ # DSP0 固件工程
| #(menuconfig: HIFI4 Project → npu Demo)
└── npu_demo_dsp0/
    └── src/rknn_api_test.c # DSP 侧测试主程序,开机自动运行
components/hifi4/rtt/rknn_dsp_comm/ # CPU0 侧服务(rknn_demo_server)
                                        # 与 DSP 握手,为 DSP 提供文件读写
components/hifi4/rtt/dsp_fw/npu_demo/ # 打包用 DSP 固件
                                        #(dsp0.bin,由 DSP 工程构建自动更新)
```

运行时的数据流如下:

1. 系统启动后,CPU0 将 DSP0 固件加载至 DSP0 并运行, rknn_demo_server 在 CPU0 侧就绪;

2. DSP0 上的 rknn_api_test.c 通过 IPC 与 CPU0 握手,随后请求读取 U 盘中的模型文件( check.rknn );

3. DSP0 调用 rknn_init/rknn_run 等 API 在 NPU 上完成推理;

4. 推理输出经 CPU0 写回 U 盘,供与 PC 端 golden 数据比对。

CPU0 侧应用不直接调用 rknn API;测试逻辑全部位于 DSP0 固件内,修改测试逻辑需要重新编译 DSP 固件并打包(见 3.3.3 节)。

### 4.2 模型转换

下面以 MobileNetV1为例,介绍如何转换RKNN 模型。

进入 rt-thread/components/rknpu/examples/rknn_benchmark/res 目录,运行 convert.py 脚本,该脚本将原始的pb模型转成 RKNN 模型,参考命令如下:

```text
cd rt-thread/components/rknpu/examples/rknn_benchmark/res
python convert.py
```

运行成功将生成mobilenetv1.rknn及dog.npy。dog.npy为模型输入文件。

说明: 在后面的准备U盘文件需要把mobilenetv1.rknn更名为check.rknn,dog.npy更名为input_0.npy

### 4.3 NPU Demo 使用方法

下面以 npu_demo 为例,介绍 DSP 版 NPU Demo 的使用方法。

#### 4.3.1 运行方式

固件烧录完成后,DSP0 会在系统启动时自动运行 npu_demo,无需手动执行任何命令。日志通过串口观察,均带 [DSP0 INFO] 前缀。

#### 4.3.2 准备 U 盘文件

准备一个 FAT32 格式的 U 盘,按以下目录结构放入文件后插入板子的 "USB 2.0 HOST" 口,系统会自动挂载到 /udisk :

```text
/udisk
└── golden/
    ├── check.rknn # 模型文件("4.2 模型转换"的转换产物)
    └── t0/
        └── <输入张量名>.npy # 每个模型输入对应一个文件
```

输入文件要求:

- 格式为标准 numpy .npy ,数据类型为 float32,数据部分字节数必须等于该输入的元素个数 × 4(固件内有强校验,不符会报 Input %d size mismatch );

- 文件名为模型输入张量名,并将张量名中的 / 、 : 、 . 全部替换为 _ ,例如张量名 input:0 对应文件 input_0.npy ;

- 具体文件名以第一次运行时串口日志中的 load file: /udisk/golden/t0/xxx.npy 打印为准;

- 输入 npy 由 RKNN-Toolkit2 侧导出(golden 数据)。

#### 4.3.3 查看运行结果

结果分两处:

1. 串口日志:打印模型输入输出信息、每轮 NPU 耗时、输出张量的 min/max 及首尾各 16 个元素,并以rknn api test done 表示整个测试正常结束;

2. U 盘回写:完整输出以 float32 写回 /udisk/golden/t0_`<输出张量名>`.npy (命名规则同上),可直接用 numpy 读取,与 PC 端 golden 输出逐元素比对。

原稿 MobileNetV1 实测日志参考（节选，非 ArmSoM 测试）：

```text
[DSP0 INFO] Read model file success: model_buffer = 0xA016CE80, model_size=...
[DSP0 INFO] index=0, name=input:0, n_dims=4, dims=[1, 224, 224, 3], ...
[DSP0 INFO] fmt=NHWC, w_stride=224, size_with_stride=301056, type=FP16
[DSP0 INFO] load file: /udisk/golden/t0/input_0.npy
[DSP0 INFO] Input 0 size check passed: 602112 bytes
[DSP0 INFO] NPU wait 0: Elapse Time = 45ms.
[DSP0 INFO] [0] MobilenetV1/Logits/SpatialSqueeze:0:
[DSP0 INFO] min = -8.1718752, max = 19.21875
```

说明:

- 更换模型时只需替换 U 盘中的 check.rknn 和 t0/ 下的输入 npy,无需重新编译固件;

- 修改测试逻辑(如推理次数 loop_count 、dump 开关等)才需要重新编译 DSP 固件并打包(见 3.3.3 节)。

{% endraw %}
