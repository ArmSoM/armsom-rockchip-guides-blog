---
title: "RKNN2 SDK V2.5.0 · RK3588/RK3576 NPU SRAM"
description: "RKNN2 SDK V2.5.0 · RK3588/RK3576 NPU SRAM · Complete development guide series"
excerpt: "RK3588/RK3576 NPU SRAM"
translation_key: "rknn-v250-sdk-guide-sram"
slug: "rknn-v250-sdk-guide-sram"
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

**RKNN2 SDK V2.5.0 · 15/22**

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

[12. NPU multicore configuration and performance](/articles/rknn-v250-sdk-guide-multicore/)

[13. Dynamic-shape models and deployment](/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Multi-batch inference](/articles/rknn-v250-sdk-guide-multi-batch/)

**RK3588/RK3576 NPU SRAM**

[16. Cache coherency and sparse inference](/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Custom operators: Python and C API](/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Encrypted model deployment](/articles/rknn-v250-sdk-guide-encryption/)

[19. Accuracy troubleshooting](/articles/rknn-v250-sdk-guide-accuracy/)

[20. Performance analysis and network optimization](/articles/rknn-v250-sdk-guide-performance/)

[21. Memory analysis, sharing and reuse](/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, error handling and references](/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.1.5 RK3588/RK3576 NPU SRAM

RK3588 SOC contains 1MB of SRAM internally, of which 956KB can be used by various IPs on the SOC. It supports designated allocation for RKNPU.

RK3576 SOC contains 512KB of SRAM internally, of which 480KB can be used by various IPs on the SOC. It supports designated allocation for RKNPU.

SRAM can help RKNPU applications reduce DDR bandwidth pressure, but it may have a certain impact on inference time.

#### 4.1.5.1 RKNPU ENVIRONMENTAL REQUIREMENTS

##### 4.1.5.1.1 Kernel Environment Requirements

RKNPU driver version&gt;=0.8.0

Kernel config needs to enable CONFIG_ROCKCHIP_RKNPU_SRAM=y

The Android system config path is as follows:

```text
<path-to-your-kernel>/arch/arm64/configs/rockchip_defconfig
```

The Linux system config path is as follows:

```text
<path-to-your-kernel>/arch/arm64/configs/rockchip_linux_defconfig
```

The corresponding DTS of the kernel needs to be allocated to RKNPU from the system SRAM.

Allocate the required size of SRAM from the system to RKNPU. The maximum size that can be allocated to RK3588 is 956KB, and the maximum size that can be allocated to RK3576 is 480KB, and the size needs to be 4K aligned.

Note: SRAM may have been allocated to other IPs in the default system, such as the codec module. The SRAM areas allocated to each IP cannot overlap, otherwise there will be data confusion caused by simultaneous reading and writing.

The following is an example of allocating 956KB to RK3588 and 480KB to RK3576 for RKNPU

RK3588:

```text
syssram: sram@ff001000 {
  compatible = "mmio-sram";
  reg = <0x0 0xff001000 0x0 0xef000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0xff001000 0xef000>;
  /* Allocate RKNPU SRAM /
  / start address and size should be 4k algin */
  rknpu_sram: rknpu_sram@0 {
    reg = <0x0 0xef000>; // 956KB
  };
};
```

Mount the allocated SRAM to the RKNPU node and modify the dtsi file as shown below:

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
rknpu: npu@fdab0000 {
  compatible = "rockchip,rk3588-rknpu";
  /* ... /
  / Add reference RKNPU sram */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

RK3576:

```text
sram: sram@3ff88000 {
  compatible = "mmio-sram";
  reg = <0x0 0x3ff88000 0x0 0x78000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0x3ff88000 0x78000>;
  /* Allocate RKNPU SRAM /
  / start address and size should be 4k algin */
  rknpu_sram: rknpu-sram@0 {
      reg = <0x0 0x78000>; // 480KB
  };
};
```

Mount the allocated SRAM to the RKNPU node and modify the dtsi file as shown below:

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3576.dtsi
rknpu: npu@27700000 {
  compatible = "rockchip,rk3576-rknpu";
  /* ... /
  / Add reference RKNPU sram */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

##### 4.1.5.1.2 RKNN SDK Version Requirments

RKNPU Runtime library (librknnrt.so) version &gt;=1.6.0

#### 4.1.5.2 USAGE

Specify RKNN_FLAG_ENABLE_SRAM in the flags parameter of the rknn_init() interface to enable SRAM in this context.

For example:

```text
ret = rknn_init(&ctx, rknn_model, size, RKNN_FLAG_ENABLE_SRAM, NULL);
```

When RKNN_FLAG_ENABLE_SRAM is set, as much memory as possible will be allocated from the system's available SRAM as the model's Internal Tensor memory.

Note:

When SRAM is occupied by a certain rknn context, other rknn contexts do not support reusing the SRAM of this segment. The RKNN_FLAG_SHARE_SRAM function in rknn_api.h has not yet been implemented.

When a certain rknn context does not occupy all the SRAM, the remaining SRAM can be used by other rknn contexts.

#### 4.1.5.3 DEBUG

##### 4.1.5.3.1 Query SRAM Enable

Check whether SRAM is enabled through the boot kernel log, which contains the address range and size information of the SRAM specified for the RKNPU, as shown below:

```text
rk3588_s:/ # dmesg | grep rknpu -i
RKNPU fdab0000.npu: RKNPU: sram region: [0x00000000ff001000, 0x00000000ff0f0000), sram size: 0xef000
```

##### 4.1.5.3.2 Query SRAM Usage

SRAM usage can be queried through nodes

The following is a bit chart of unused SRAM, each point represents 4K size

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
# Unit is Byte
```

The following is a bit chart after using 512KB SRAM

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
# Unit is Byte
```

##### 4.1.5.3.3 Query SRAM Size Through RKNN API

Query SRAM size information through the RKNN_QUERY_MEM_SIZE interface of rknn_query()

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

Among total_sram_size indicates the total size of SRAM allocated by the system to RKNPU, unit is Byte.

free_sram_size indicates the size of SRAM that can be used by the remaining RKNPU, unit is Byte

##### 4.1.5.3.4 Query Model SRAM Occupancy

In the RKNPU device environment, set the following environment variables before running the RKNN application to print the SRAM usage prediction:

```text
export RKNN_LOG_LEVEL=3
```

Layer occupancy of Internal allocated SRAM, as shown in the following log:

```text
---------------------------------------------------------------------------
Total allocated Internal SRAM Size: 524288, Addr: [0xff3e0000, 0xff460000)
---------------------------------------------------------------------------
---------------------------------------------------------------------+---------
-------------------------+-----------
ID User Tensor DataType OrigShape NativeShape |
[Start End) Size | SramHit
---------------------------------------------------------------------+---------
-------------------------+-----------
1 ConvRelu input0 INT8 (1,3,224,224) (1,1,224,224,3) |
0xff3b0000 0xff3d4c00 0x00024c00 | \
2 ConvRelu output2 INT8 (1,32,112,112) (1,2,112,112,16) |
0xff404c00 0xff466c00 0x00062000 | 0x0005b400
3 ConvRelu output4 INT8 (1,32,112,112) (1,4,112,112,16) |
0xff466c00 0xff52ac00 0x000c4000 | 0x00000000
4 ConvRelu output6 INT8 (1,64,112,112) (1,4,112,112,16) |
0xff52ac00*0xff5eec00 0x000c4000 | 0x00000000
5 ConvRelu output8 INT8 (1,64,56,56) (1,4,56,56,16) |
0xff3e0000 0xff411000 0x00031000 | 0x00031000
6 ConvRelu output10 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff411000 0xff473000 0x00062000 | 0x0004f000
7 ConvRelu output12 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff473000 0xff4d5000 0x00062000 | 0x00000000
8 ConvRelu output14 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff3e0000 0xff442000 0x00062000 | 0x00062000
9 ConvRelu output16 INT8 (1,128,28,28) (1,8,28,28,16) |
0xff442000 0xff45a800 0x00018800 | 0x00018800
10 ConvRelu output18 INT8 (1,256,28,28) (1,16,28,28,16) |
0xff3e0000 0xff411000 0x00031000 | 0x00031000
11 ConvRelu output20 INT8 (1,256,28,28) (1,16,28,28,16) |
0xff411000 0xff442000 0x00031000 | 0x00031000
12 ConvRelu output22 INT8 (1,256,28,28) (1,16,28,28,16) |
0xff3e0000 0xff411000 0x00031000 | 0x00031000
13 ConvRelu output24 INT8 (1,256,14,14) (1,16,14,14,16) |
0xff411000 0xff41d400 0x0000c400 | 0x0000c400
14 ConvRelu output26 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
15 ConvRelu output28 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
16 ConvRelu output30 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
17 ConvRelu output32 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
18 ConvRelu output34 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
19 ConvRelu output36 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
20 ConvRelu output38 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
21 ConvRelu output40 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
22 ConvRelu output42 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
23 ConvRelu output44 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
24 ConvRelu output46 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
25 ConvRelu output48 INT8 (1,512,7,7) (1,33,7,7,16) |
0xff3f8800 0xff3ff000 0x00006800 | 0x00006800
26 ConvRelu output50 INT8 (1,1024,7,7) (1,67,7,7,16) |
0xff3e0000 0xff3ed000 0x0000d000 | 0x0000d000
27 ConvRelu output52 INT8 (1,1024,7,7) (1,67,7,7,16) |
0xff3ed000 0xff3fa000 0x0000d000 | 0x0000d000
28 AveragePool output54 INT8 (1,1024,7,7) (1,67,7,7,16) |
0xff3e0000 0xff3ed000 0x0000d000 | 0x0000d000
29 Conv output55 INT8 (1,1024,1,1) (1,64,1,1,16) |
0xff3ed000 0xff3ed400 0x00000400 | 0x00000400
30 Softmax output56 INT8 (1,1000,1,1) (1,64,1,1,16) |
0xff3e0000 0xff3e0400 0x00000400 | 0x00000400
31 OutputOperator output57 FLOAT (1,1000,1,1) (1,1000,1,1) |
0xff3ae000 0xff3aefa0 0x00000fa0 | \
---------------------------------------------------------------------+---------
-------------------------+-----------
----------------------------------------
Total Weight Memory Size: 4260864
Total Internal Memory Size: 2157568
Predict Internal Memory RW Amount: 11068320
Predict Weight Memory RW Amount: 4260832
Predict SRAM Hit RW Amount: 6688768
----------------------------------------
```

The SRAM Hit in the text chart above is the SRAM size occupied by the current layer tensor, which means that compared with not turning on SRAM, the amount of DDR read and write data corresponding to size will be saved.

Predict SRAM Hit RW Amount is the read and write prediction of the entire model SRAM, indicating the amount of DDR read and write data that can be saved in each frame compared with SRAM not turned on.

Note: Linux environment logs are redirected to the terminal, and Android environment logs are redirected to logcat.

{% endraw %}
