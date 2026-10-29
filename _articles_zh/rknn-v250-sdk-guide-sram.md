---
title: "RKNN2 SDK V2.5.0 · RK3588/RK3576 NPU SRAM"
description: "RKNN2 SDK V2.5.0 · RK3588/RK3576 NPU SRAM · 完整开发指南系列"
excerpt: "RK3588/RK3576 NPU SRAM"
translation_key: "rknn-v250-sdk-guide-sram"
slug: "rknn-v250-sdk-guide-sram"
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

**RKNN2 SDK V2.5.0 · 15/22**

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

[12. NPU 多核配置与性能](/zh/articles/rknn-v250-sdk-guide-multicore/)

[13. 动态 Shape 模型与部署](/zh/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. 多 Batch 推理](/zh/articles/rknn-v250-sdk-guide-multi-batch/)

**RK3588/RK3576 NPU SRAM**

[16. 缓存一致性与稀疏化推理](/zh/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. 自定义算子：Python 与 C API](/zh/articles/rknn-v250-sdk-guide-custom-operators/)

[18. 模型加密部署](/zh/articles/rknn-v250-sdk-guide-encryption/)

[19. 精度问题诊断](/zh/articles/rknn-v250-sdk-guide-accuracy/)

[20. 性能分析与网络优化](/zh/articles/rknn-v250-sdk-guide-performance/)

[21. 内存分析、共享与复用](/zh/articles/rknn-v250-sdk-guide-memory/)

[22. 常见问题、错误处理与参考资源](/zh/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.1.5 RK3588/RK3576 NPU SRAM使用说明

RK3588 SOC内部含有1MB的SRAM,其中有956KB可供给SOC上各个IP所使用。

RK3576 SOC内部含有512KB的SRAM,其中有480KB可供给SOC上各个IP所使用。

SRAM可以帮助RKNPU应用减轻DDR带宽压力,但对推理耗时可能有一定影响。

#### 4.1.5.1 板端环境要求

##### 4.1.5.1.1 内核环境要求

RKNPU驱动版本&gt;=0.9.2

内核config需要开启 CONFIG_ROCKCHIP_RKNPU_SRAM=y

Android系统config路径如下:

```text
  <path-to-your-kernel>/arch/arm64/configs/rockchip_defconfig
```

Linux系统config路径如下:

```text
  <path-to-your-kernel>/arch/arm64/configs/rockchip_linux_defconfig
```

内核相应DTS需要从系统SRAM中分配给RKNPU使用

从系统分配需求大小的SRAM给RKNPU,RK3588最大可分配956KB,RK3576最大可分配480KB,且大小需要4K对齐。

注意:默认系统中可能已为其他IP分配SRAM,比如编解码模块,各IP分配的SRAM区域不能重叠,否则会存在同时读写出现数据错乱现象。

如下为RK3588分配956KB和RK3576分配480KB给RKNPU的例子

RK3588示例:

```text
syssram: sram@ff001000 {
  compatible = "mmio-sram";
  reg = <0x0 0xff001000 0x0 0xef000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0xff001000 0xef000>;
  /* 分配RKNPU SRAM / / start address and size should be 4k algin */
  rknpu_sram: rknpu_sram@0 {
    reg = <0x0 0xef000>; // 956KB
  };
};
```

把分配的SRAM挂到RKNPU节点,修改如下所示的dtsi文件:

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
rknpu: npu@fdab0000 {
  compatible = "rockchip,rk3588-rknpu";
  /* ... / / 增加RKNPU sram的引用 */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

RK3576 示例:

```text
sram: sram@3ff88000 {
  compatible = "mmio-sram";
  reg = <0x0 0x3ff88000 0x0 0x78000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0x3ff88000 0x78000>;
  /* 分配RKNPU SRAM / / start address and size should be 4k algin */
  rknpu_sram: rknpu-sram@0 {
      reg = <0x0 0x78000>; // 480KB
  };
};
```

把分配的SRAM挂到RKNPU节点,修改如下所示的dtsi文件:

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3576.dtsi
rknpu: npu@27700000 {
  compatible = "rockchip,rk3576-rknpu";
  /* ... / / 增加RKNPU sram的引用 */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

##### 4.1.5.1.2 RKNN SDK版本要求

RKNPU Runtime库(librknnrt.so)版本&gt;=1.6.0

#### 4.1.5.2 使用方法

在 rknn_init() 接口的flags参数指定 RKNN_FLAG_ENABLE_SRAM 即可在该 context 中开启SRAM。

例如:

```text
ret = rknn_init(&ctx, rknn_model, size, RKNN_FLAG_ENABLE_SRAM, NULL);
```

当设置 RKNN_FLAG_ENABLE_SRAM 时,将从系统可用的SRAM中分配尽可能多的内存做为模型的InternalTensor内存。

注意:

|  | rknn_context |
| --- | --- |
| rknn_api.h |  |

当某个 rknn_context 未占用全部的SRAM时,剩余的SRAM可以给其他的 rknn_context 使用。

#### 4.1.5.3 调试方法

##### 4.1.5.3.1 SRAM是否启用查询

通过开机内核日志查看SRAM是否启用,包含为RKNPU指定SRAM的地址范围和大小信息,如下所示:

```text
rk3588_s:/ # dmesg | grep rknpu -i
RKNPU fdab0000.npu: RKNPU: sram region: [0x00000000ff001000, 0x00000000ff0f0000), sram size: 0xef000
```

##### 4.1.5.3.2 SRAM使用情况查询

可通过节点查询SRAM的使用情况

如下为未使用SRAM的位图表,每个点表示4K大小

```text
rk3588_s:/ # cat /sys/kernel/debug/rknpu/mm
SRAM bitmap: "*" - used, "." - free (1bit = 4KB)
[000] [................................]
[001] [................................]
[002] [................................]
[003] [................................]
[004] [................................]
[005] [................................]
[006] [................................]
[007] [...............]
SRAM total size: 978944, used: 0, free: 978944
# 单位为Byte
```

如下为分配使用512KB后的SRAM位图表

```text
rk3588_s:/ # cat /sys/kernel/debug/rknpu/mm
SRAM bitmap: "*" - used, "." - free (1bit = 4KB)
[000] [********************************]
[001] [********************************]
[002] [********************************]
[003] [********************************]
[004] [................................]
[005] [................................]
[006] [................................]
[007] [...............]
SRAM total size: 978944, used: 524288, free: 454656
# 单位为Byte
```

##### 4.1.5.3.3 通过RKNN API查询SRAM大小

通过 rknn_query() 的 RKNN_QUERY_MEM_SIZE 接口查询SRAM大小信息

```text
typedef struct _rknn_mem_size {
  uint32_t total_weight_size;
  uint32_t total_internal_size;
  uint64_t total_dma_allocated_size;
  uint32_t total_sram_size;
  uint32_t free_sram_size;
  uint32_t reserved[10];
} rknn_mem_size;
```

其中, total_sram_size 表示:系统给RKNPU分配的SRAM总大小,单位是Byte。

free_sram_size 表示:剩余RKNPU能使用的SRAM大小,单位是Byte。

##### 4.1.5.3.4 查看模型SRAM的占用情况

板端环境中,RKNN应用运行前设置如下环境变量,可打印SRAM使用预测情况:

```text
export RKNN_LOG_LEVEL=3
```

Internal分配SRAM的逐层占用情况,如下日志所示:

```text
---------------------------------------------------------------------------
Total allocated Internal SRAM Size: 524288, Addr: [0xff3e0000, 0xff460000)
---------------------------------------------------------------------------
---------------------------------------------------------------------+--------------
--------------------+-----------
ID User Tensor DataType OrigShape NativeShape | [Start
End) Size | SramHit
---------------------------------------------------------------------+--------------
--------------------+-----------
1 ConvRelu input0 INT8 (1,3,224,224) (1,1,224,224,3) | 0xff3b0000
0xff3d4c00 0x00024c00 | \
2 ConvRelu output2 INT8 (1,32,112,112) (1,2,112,112,16) | 0xff404c00
0xff466c00 0x00062000 | 0x0005b400
3 ConvRelu output4 INT8 (1,32,112,112) (1,4,112,112,16) | 0xff466c00
0xff52ac00 0x000c4000 | 0x00000000
4 ConvRelu output6 INT8 (1,64,112,112) (1,4,112,112,16) |
0xff52ac00*0xff5eec00 0x000c4000 | 0x00000000
5 ConvRelu output8 INT8 (1,64,56,56) (1,4,56,56,16) | 0xff3e0000
0xff411000 0x00031000 | 0x00031000
6 ConvRelu output10 INT8 (1,128,56,56) (1,8,56,56,16) | 0xff411000
0xff473000 0x00062000 | 0x0004f000
7 ConvRelu output12 INT8 (1,128,56,56) (1,8,56,56,16) | 0xff473000
0xff4d5000 0x00062000 | 0x00000000
8 ConvRelu output14 INT8 (1,128,56,56) (1,8,56,56,16) | 0xff3e0000
0xff442000 0x00062000 | 0x00062000
9 ConvRelu output16 INT8 (1,128,28,28) (1,8,28,28,16) | 0xff442000
0xff45a800 0x00018800 | 0x00018800
10 ConvRelu output18 INT8 (1,256,28,28) (1,16,28,28,16) | 0xff3e0000
0xff411000 0x00031000 | 0x00031000
11 ConvRelu output20 INT8 (1,256,28,28) (1,16,28,28,16) | 0xff411000
0xff442000 0x00031000 | 0x00031000
12 ConvRelu output22 INT8 (1,256,28,28) (1,16,28,28,16) | 0xff3e0000
0xff411000 0x00031000 | 0x00031000
13 ConvRelu output24 INT8 (1,256,14,14) (1,16,14,14,16) | 0xff411000
0xff41d400 0x0000c400 | 0x0000c400
14 ConvRelu output26 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000
0xff3f8800 0x00018800 | 0x00018800
15 ConvRelu output28 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800
0xff411000 0x00018800 | 0x00018800
16 ConvRelu output30 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000
0xff3f8800 0x00018800 | 0x00018800
17 ConvRelu output32 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800
0xff411000 0x00018800 | 0x00018800
18 ConvRelu output34 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000
0xff3f8800 0x00018800 | 0x00018800
19 ConvRelu output36 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800
0xff411000 0x00018800 | 0x00018800
20 ConvRelu output38 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000
0xff3f8800 0x00018800 | 0x00018800
21 ConvRelu output40 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800
0xff411000 0x00018800 | 0x00018800
22 ConvRelu output42 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000
0xff3f8800 0x00018800 | 0x00018800
23 ConvRelu output44 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3f8800
0xff411000 0x00018800 | 0x00018800
24 ConvRelu output46 INT8 (1,512,14,14) (1,32,14,14,16) | 0xff3e0000
0xff3f8800 0x00018800 | 0x00018800
25 ConvRelu output48 INT8 (1,512,7,7) (1,33,7,7,16) | 0xff3f8800
0xff3ff000 0x00006800 | 0x00006800
26 ConvRelu output50 INT8 (1,1024,7,7) (1,67,7,7,16) | 0xff3e0000
0xff3ed000 0x0000d000 | 0x0000d000
27 ConvRelu output52 INT8 (1,1024,7,7) (1,67,7,7,16) | 0xff3ed000
0xff3fa000 0x0000d000 | 0x0000d000
28 AveragePool output54 INT8 (1,1024,7,7) (1,67,7,7,16) | 0xff3e0000
0xff3ed000 0x0000d000 | 0x0000d000
29 Conv output55 INT8 (1,1024,1,1) (1,64,1,1,16) | 0xff3ed000
0xff3ed400 0x00000400 | 0x00000400
30 Softmax output56 INT8 (1,1000,1,1) (1,64,1,1,16) | 0xff3e0000
0xff3e0400 0x00000400 | 0x00000400
31 OutputOperator output57 FLOAT (1,1000,1,1) (1,1000,1,1) | 0xff3ae000
0xff3aefa0 0x00000fa0 | \
---------------------------------------------------------------------+--------------
--------------------+-----------
----------------------------------------
Total Weight Memory Size: 4260864
Total Internal Memory Size: 2157568
Predict Internal Memory RW Amount: 11068320
Predict Weight Memory RW Amount: 4260832
Predict SRAM Hit RW Amount: 6688768
----------------------------------------
```

其中上面文本图表中的SRAM Hit为当前层Tensor所占用的SRAM大小,表示与未开启SRAM对比,会节省对应大小的DDR读写数据量。

Predict SRAM Hit RW Amount为整个模型SRAM的读写预测情况,表示与未开启SRAM对比,每帧可节省的DDR读写数据量。

注意:Linux环境日志重定向到终端,Android环境日志重定向到logcat。

{% endraw %}
