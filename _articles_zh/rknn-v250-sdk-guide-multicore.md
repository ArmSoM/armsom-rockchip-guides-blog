---
title: "RKNN2 SDK V2.5.0 · NPU 多核配置与性能"
description: "RKNN2 SDK V2.5.0 · NPU 多核配置与性能 · 完整开发指南系列"
excerpt: "NPU 多核配置与性能"
translation_key: "rknn-v250-sdk-guide-multicore"
slug: "rknn-v250-sdk-guide-multicore"
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

**RKNN2 SDK V2.5.0 · 12/22**

[1. 软件栈与核心概念](/zh/articles/rknn-v250-sdk-guide-overview/)

[2. 开发环境、版本与连板准备](/zh/articles/rknn-v250-sdk-guide-environment/)

[3. 开发流程与接口选择](/zh/articles/rknn-v250-sdk-guide-workflow/)

[4. 模型转换与 ONNX 编辑](/zh/articles/rknn-v250-sdk-guide-conversion/)

[5. 量化、混合量化与 QAT](/zh/articles/rknn-v250-sdk-guide-quantization/)

[6. 推理、精度、性能与内存评估](/zh/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime 生命周期、布局与内存](/zh/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. 零拷贝接口与输入输出约束](/zh/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C API 部署与代码生成](/zh/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Toolkit Lite2 Python 部署](/zh/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API 与矩阵布局](/zh/articles/rknn-v250-sdk-guide-matmul/)

**NPU 多核配置与性能**

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

### 4.1.2 NPU多核

RK3588通过3核NPU,RK3576通过2核NPU提供更强的算力。本章节将详细介绍多核NPU的配置方法,以提高模型的推理效率。

注:多核运行适用于网络层计算量较大的网络,对小网络提升幅度较小,甚至可能因为单核多核的切换(该切换需CPU介入)而导致性能下降。

#### 4.1.2.1 多核运行配置方法

如果使用Python作为应用程序开发语言,可以通过RKNN-Toolkit2或RKNN-Toolkit Lite2 init_runtime()接口中的 “ core_mask ” 参数设置模型运行的 NPU 核心。该参数的详细说明如下表:

表4-6 init_runtime接口core_mask参数说明

| 参数 | 详细说明 |
| --- | --- |
| core_mask | 该参数用于设置模型运行的NPU核心。可选值和相应说明如下: NPU_CORE_AUTO: 自动调度模式,模型将以单核模式自动运行在当前空闲的NPU核上。 NPU_CORE_0: 模型运行在NPU Core0上。 NPU_CORE_1: 模型运行在NPU Core1上。 NPU_CORE_2: 模型运行在NPU Core2上。 NPU_CORE_0_1: 模型同时运行在NPU Core0和NPU Core1上。 NPU_CORE_0_1_2: 模型同时运行在NPU Core0,Core1和Core2上。 NPU_CORE_ALL: 根据平台自动配置NPU核心数量。 默认值为 NPU_CORE_AUTO。 注:在RKNN-Toolkit Lite2上设置该参数时,值的前面要加上RKNNLite,例如 RKNNLite.NPU_CORE_AUTO;如果在 RKNN-Toolkit2 上设置该参数时,值的前面要加上RKNN,例如 RKNN.NPU_CORE_AUTO。 |

RKNN-Toolkit2设置NPU核心,参考代码如下:

```text
## Python
......
# Init runtime environment
print('--> Init runtime environment')
ret = rknn.init_runtime(target='rk3588', core_mask=RKNN.NPU_CORE_0)
if ret != 0:
  print('Init runtime environment failed!')
  exit(ret)
```

RKNN-Toolkit Lite2设置NPU核心,参考代码如下:

```text
## Python
......
# Init runtime environment
print('--> Init runtime environment')
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_0)
if ret != 0:
  print('Init runtime environment failed')
  exit(ret)
print('done')
```

如果使用 C/C++ 作为应用程序开发语言,可以调用rknn_set_core_mask()接口设置模型运行的NPU核心。该接口core_mask参数的详细说明如下表:

表4-7 rknn_set_core_mask接口core_mask参数说明

| 参数 | 详细说明 |
| --- | --- |
| core_mask | 该参数用于设置模型运行的NPU核心。可选值和相应说明如下: RKNN_NPU_CORE_AUTO: 自动调度模式,模型将以单核模式自动运行在当前空闲的NPU核上。 RKNN_NPU_CORE_0: 模型运行在NPU Core0上。 RKNN_NPU_CORE_1: 模型运行在NPU Core1上。 RKNN_NPU_CORE_2: 模型运行在NPU Core2上。 RKNN_NPU_CORE_0_1: 模型同时运行在NPU Core0和NPU Core1上。 RKNN_NPU_CORE_0_1_2: 模型同时运行在NPU Core0,Core1和Core2上。 RKNN_NPU_CORE_ALL: 根据平台自动配置NPU核心数量。 |

使用C/C++ API设置模型运行NPU核心,参考代码如下:

```text
// C++
// rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

#### 4.1.2.2 查看多核运行效果

本章节将详细说明RKNN模型以多核模式运行时的效果。

如果使用RKNN-Toolkit2连接开发板进行模型推理,需要在调用 rknn.init_runtime() 接口时将perf_debug 参数设置成 True ,接着调用 rknn.eval_perf() 接口,即可打印每层的运行信息。参考代码如下:

```text
#Python
# Init runtime environment
ret = rknn.init_runtime(target='rk3588', device_id='29d5dd97766a5c27', perf_debug=True)
if ret != 0:
  print('Init runtime environment failed!')
  exit(ret)

# Eval performance
rknn.eval_perf()
```

如果是直接在板端进行模型推理,需要在运行应用前将RKNN_LOG_LEVEL设成4或以上,此时将打印模型每层的运行信息。设置方法如下:

```text
# Python
# 使用RKNN-Toolkit Lite2提供的Python接口，只需在创建RKNNLite对象时将verbose设成True即可
rknnlite = RKNNLite(verbose=True)

# 使用C/C++接口，则需要在运行二进制程序前设置如下环境变量
export RKNN_LOG_LEVEL=4
```

以lenet模型为例,通过上述设置后,终端将打印类似如下日志(为方便展示,删除了InputShape,OutputShape, DDR Cycles, NPU Cycles, Total Cycles, Time(us), MacUsage(%), Task Number, LutNumber, RW(kb), FullName等字段):

```text
ID OpType DataType Target WorkLoad(0/1/2)-ImproveTherical
1 InputOperator UINT8 CPU 100.0%/0.0%/0.0% - Up:0.0%
2 Conv UINT8 NPU 50.0%/50.0%/0.0% - Up:50.0%
3 MaxPool INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
4 Conv INT8 NPU 50.0%/50.0%/0.0% - Up:50.0%
5 MaxPool INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
6 ConvRelu INT8 NPU 48.1%/51.9%/0.0% - Up:48.1%
7 Conv INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
8 Softmax INT8 CPU 0.0%/0.0%/0.0% - Up:0.0%
9 OutputOperator FLOAT16 CPU 0.0%/0.0%/0.0% - Up:0.0%
Total Operator Elapsed Time(us): 591
Total Memory RW Amount(MB): 0
```

模型每层运行信息中的"WorkLoad(0/1/2)-ImproveTherical"一列只在多核NPU上会打印,记录了模型每一层的任务在NPU核心上是如何分配以及其理论性能提升情况。例如"50.0%/50.0%/0.0% - Up:50.0%"代表该层的计算量以Core0负责50%,Core1负责50%进行分配,该层的性能相比单核运行,理论能提升50%。如果某一层的性能没有提升,例如"100.0%/0.0%/0.0% - Up:0.0%",可能存在以下几种情况:

该层的负载太小,小于NPU多核任务分配的粒度,因此该层运行在单核上;

该类算子在NPU驱动中未实现多核任务切分,待后续版本支持。现有已支持多核任务切分的算子有:Conv,DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu, PRelu,LeakyRelu。

#### 4.1.2.3 多核性能提升技巧

可以尝试如下方法,以得到较高的多核运行性能:

将CPU/DDR/NPU频率定到最高

将应用绑定至CPU大核

将NPU中断绑定至应用所对应的CPU大核

不同固件对应的定频命令有所区别,请参考5.2.1.1 环境条件与配置检查章节。

以将应用绑定到CPU4大核心为例,上面提到的后两点可以参考如下脚本:

```text
interrupts=$(cat /proc/interrupts | grep npu)
interrupts_array=($interrupts)

irq1=$(echo ${interrupts_array[0]} | awk -F ':' '{print $1}')
irq2=$(echo ${interrupts_array[14]} | awk -F ':' '{print $1}')
irq3=$(echo ${interrupts_array[28]} | awk -F ':' '{print $1}')

for irq in $irq1 $irq2 $irq3; do
 echo 4 > /proc/irq/$irq/smp_affinity_list
done

taskset 10 ./rknn_benchmark lenet.rknn "" 10 3 ## CPU4对应的 taskset 掩码值为 0x10
```

上述脚本会执行如下操作:

执行 cat /proc/interrupts | grep npu 命令并解析出三个中断号(去除冒号)

使用循环将每个中断号的 smp_affinity_list 设置为4(CPU4对应的ID为4)

最后执行t askset 10 ./rknn_benchmark lenet.rknn "" 10 3 命令,CPU4对应的 taskset参数为10(有关 taskset 的具体用法,请参考:https://man7.org/linux/man-pages/man1/taskset.1.html)

通过上述操作,NPU中断以及应用程序" rknn_benchmark "都将在CPU4上运行,这样可以消除NPU中断处理的核心切换开销。

{% endraw %}
