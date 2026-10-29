---
title: "RKNN2 SDK V2.5.0 · NPU multicore configuration and performance"
description: "RKNN2 SDK V2.5.0 · NPU multicore configuration and performance · Complete development guide series"
excerpt: "NPU multicore configuration and performance"
translation_key: "rknn-v250-sdk-guide-multicore"
slug: "rknn-v250-sdk-guide-multicore"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Platform reference: this article follows the Rockchip RKNN2 SDK V2.5.0 Development Guide, including only the SoCs, Linux/Android Runtime and Toolkit combinations stated by the source. Features apply under the chip, SDK, driver and kernel conditions in each section, not automatically to every ArmSoM board. Check the actual ArmSoM BSP, NPU driver, Runtime and model versions before deployment. No ArmSoM hardware validation was performed; logs, performance figures and examples belong to the source.

Sources and proofreading: Chinese follows Chinese V2.5.0 (182 pages); English, Russian and German follow English V2.5.0 (208 pages). Source-specific technical information is retained; older-version content is not presented as new-version fact. Chinese figures come from the Chinese PDF; EN/RU/DE figures come from the English PDF, including separately extracted vector flowcharts. Original section and equation numbers remain. Some source cross-references still use old chapter numbers; dynamic-shape capacity examples contain “1224+140=264”, TP_NORM support statements conflict, and names such as init()/rknn.val_perf() differ from later API descriptions. These source issues are retained and require checking against actual V2.5.0 SDK headers/API references before execution. Code and parameters remain; PDF wrapping and table continuations are repaired.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 12/22**

[1. Software stack and core concepts](/articles/rknn-v250-sdk-guide-overview/)

[2. Environment, versions and board connection](/articles/rknn-v250-sdk-guide-environment/)

[3. Development workflow and interface selection](/articles/rknn-v250-sdk-guide-workflow/)

[4. Model conversion and ONNX editing](/articles/rknn-v250-sdk-guide-conversion/)

[5. Quantization, hybrid quantization and QAT](/articles/rknn-v250-sdk-guide-quantization/)

[6. Inference, accuracy, performance and memory evaluation](/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime lifecycle, layouts and memory](/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Zero-copy interfaces and I/O constraints](/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C API deployment and code generation](/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Toolkit Lite2 Python deployment](/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API and matrix layouts](/articles/rknn-v250-sdk-guide-matmul/)

**NPU multicore configuration and performance**

[13. Dynamic-shape models and deployment](/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Multi-batch inference](/articles/rknn-v250-sdk-guide-multi-batch/)

[15. RK3588/RK3576 NPU SRAM](/articles/rknn-v250-sdk-guide-sram/)

[16. Cache coherency and sparse inference](/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Custom operators: Python and C API](/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Encrypted model deployment](/articles/rknn-v250-sdk-guide-encryption/)

[19. Accuracy troubleshooting](/articles/rknn-v250-sdk-guide-accuracy/)

[20. Performance analysis and network optimization](/articles/rknn-v250-sdk-guide-performance/)

[21. Memory analysis, sharing and reuse](/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, error handling and references](/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.1.2 NPU Multi-Core Configuration

RK3588 provides stronger computing power through its 3-core NPU, and RK3576 through its 2- core NPU. This section describes in detail the configuration method of the multi-core NPU to improve the inference efficiency of models.

Note: Multi-core operation is suitable for networks with large per-layer computation workloads. For small networks the improvement is limited, and performance may even degrade due to switching between single-core and multi-core modes (this switching requires CPU intervention).

#### 4.1.2.1 MULTI-CORE OPERATION CONFIGURATION METHOD

If you use Python as the application development language, you can set the NPU core for the model to run on through the " core_mask " parameter in the init_runtime() interface of RKNN-Toolkit2 or RKNN-Toolkit Lite2. The detailed description of this parameter is as follows:

Table 4-6 init_runtime interface core_mask parameter description

| Parameter | Description |
| --- | --- |
| core_mask | This parameter is used to set the NPU core for the model to run on. The available values and the corresponding descriptions are as follows: NPU_CORE_AUTO: automatic scheduling mode; the model automatically runs on the currently idle NPU core in single-core mode. NPU_CORE_0: the model runs on NPU Core0. NPU_CORE_1: the model runs on NPU Core1. NPU_CORE_2: the model runs on NPU Core2. NPU_CORE_0_1: the model runs on NPU Core0 and NPU Core1 at the same time. NPU_CORE_0_1_2: the model runs on NPU Core0, Core1 and Core2 at the same time. NPU_CORE_ALL: the number of NPU cores is automatically configured according to the platform. The default value is NPU_CORE_AUTO. Note: When setting this parameter on RKNN-Toolkit Lite2, RKNNLite must be prefixed to the value, for example RKNNLite.NPU_CORE_AUTO; when setting this parameter on RKNN- Toolkit2, RKNN must be prefixed to the value, for example RKNN.NPU_CORE_AUTO. |

To set the NPU core with RKNN-Toolkit2, the reference code is as follows:

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

To set the NPU core with RKNN-Toolkit Lite2, the reference code is as follows:

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

If you use C/C++ as the application development language, you can call the rknn_set_core_mask() interface to set the NPU core for the model to run on. The detailed description of the core_mask parameter of this interface is as follows:

Table 4-7 rknn_set_core_mask interface core_mask parameter description

| Parameter | Description |
| --- | --- |
| core_mask | This parameter is used to set the NPU core for the model to run on. The available values and the corresponding descriptions are as follows: RKNN_NPU_CORE_AUTO: automatic scheduling mode; the model automatically runs on the currently idle NPU core in single-core mode. RKNN_NPU_CORE_0: the model runs on NPU Core0. RKNN_NPU_CORE_1: the model runs on NPU Core1. RKNN_NPU_CORE_2: the model runs on NPU Core2. RKNN_NPU_CORE_0_1: the model runs on NPU Core0 and NPU Core1 at the same time. RKNN_NPU_CORE_0_1_2: the model runs on NPU Core0, Core1 and Core2 at the same time. RKNN_NPU_CORE_ALL: the number of NPU cores is automatically configured according to the platform. |

To set the NPU core for the model to run on with the C/C++ API, the reference code is as follows:

```text
// C++
// rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

#### 4.1.2.2 CHECK MULTI-CORE RUNNING STATUS

This section describes in detail the effect when the RKNN model runs in multi-core mode.

If you use RKNN-Toolkit2 connected to a development board for model inference, you need to set the perf_debug parameter to True when calling the rknn.init_runtime() interface, and then call the rknn.eval_perf() interface to print the running information of each layer. The reference code is as follows:

```text
#Python
# Init runtime environment
ret = rknn.init_runtime(target='rk3588', device_id='29d5dd97766a5c27',
perf_debug=True)
if ret != 0:
    print('Init runtime environment failed!')
    exit(ret)

# Eval performance
rknn.eval_perf()
```

If model inference is performed directly on the board, you need to set RKNN_LOG_LEVEL to 4 or above before running the application, and the running information of each layer of the model will be printed. The setting method is as follows:

```text
# Python
# When using the Python interface provided by RKNN-Toolkit Lite2, simply set verbose to True when creating the RKNNLite object
rknnlite = RKNNLite(verbose=True)

# When using the C/C++ interface, the following environment variable must be set before running the binary program
export RKNN_LOG_LEVEL=4
```

Taking the lenet model as an example, after the above settings, the terminal will print a log similar to the following (for the convenience of display, fields such as InputShape, OutputShape, DDR Cycles, NPU Cycles, Total Cycles, Time(us), MacUsage(%), Task Number, Lut Number, RW(kb), FullName have been removed):

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

The "WorkLoad(0/1/2)-ImproveTherical" column in the running information of each layer of the model is printed only on multi-core NPUs. It records how the tasks of each layer of the model are allocated on the NPU cores and the theoretical performance improvement. For example, "50.0%/50.0%/0.0% - Up:50.0%" means that the computation of this layer is allocated with Core0 responsible for 50% and Core1 responsible for 50%; compared with single-core operation, the performance of this layer can theoretically be improved by 50%. If the performance of a certain layer has not improved, such as "100.0%/0.0%/0.0% - Up:0.0%", the following situations may exist:

The workload of this layer is too small, smaller than the granularity of NPU multi-core task allocation, so this layer runs on a single core;

This type of operator does not implement multi-core task segmentation in the NPU driver, and it will be supported in subsequent versions. The operators that currently support multi-core task segmentation include: Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu, PRelu, LeakyRelu.

#### 4.1.2.3 MULTI-CORE PERFORMANCE IMPROVEMENT TIPS

You can try the following methods to get higher multi-core running performance:

Set CPU/DDR/NPU frequency to the highest

Bind the application to the CPU big core

Bind the NPU interrupt to the corresponding CPU big core above

The fixed frequency commands corresponding to different firmware are different, please refer to Chapter 5.2.1.1.

Take binding the application to the CPU4 core as an example. For the last two points mentioned above, you can refer to the following script:

```text
interrupts=$(cat /proc/interrupts | grep npu)
interrupts_array=($interrupts)

irq1=$(echo ${interrupts_array[0]} | awk -F ':' '{print $1}')
irq2=$(echo ${interrupts_array[14]} | awk -F ':' '{print $1}')
irq3=$(echo ${interrupts_array[28]} | awk -F ':' '{print $1}')

for irq in $irq1 $irq2 $irq3; do
 echo 4 > /proc/irq/$irq/smp_affinity_list
done

taskset 10 ./rknn_benchmark lenet.rknn "" 10 3 # The taskset mask value corresponding to CPU4 is 0x10
```

The above script will perform the following operations:

Execute the cat /proc/interrupts | grep npu command and parse out three interrupt numbers (remove colons)

Use a loop to set the smp_affinity_list of each interrupt number to 4 (the corresponding ID of CPU4 is 4)

Finally execute the taskset 10 ./rknn_benchmark lenet.rknn "" 10 3 command. The taskset parameter corresponding to CPU4 is 10 (For specific usage of taskset, please refer to: https://man7.org/linux/man-pages/man1/taskset.1.html)

Through the above operation, the NPU interrupt and the application "rknn_benchmark" will run on CPU4, which can eliminate the core switching overhead of NPU interrupt processing.

{% endraw %}
