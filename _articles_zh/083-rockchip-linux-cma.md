---
title: "Rockchip Linux CMA：驱动框架、内存预留与调试"
description: "完整保留 CMA 配置、DTS、独占内存、debugfs 节点、框架图与跨页启动日志。"
translation_key: "083-rockchip-linux-cma"
slug: "083-rockchip-linux-cma"
lang: "zh"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "CMA"]
keywords: "ArmSoM Rockchip Linux linux cma"
excerpt: "完整保留 CMA 配置、DTS、独占内存、debugfs 节点、框架图与跨页启动日志。"
---

{% raw %}

# Rockchip Linux CMA：驱动框架、内存预留与调试

## ArmSoM 适用说明与来源

本文是 ArmSoM 适配前的平台参考，来源为中文 V1.1.0。原文范围：RK3588 / RK3568 / RK3399 / RK3288 / RK3368 / RV1126 / PX30，Linux 4.4 / 4.19 / 5.10。没有英文 PDF；英文、俄文、德文均完整译自中文，德文复用英文文章的同一配图。尚未核实具体 ArmSoM 板卡、SDK/BSP 或驱动组合，未进行硬件验证。请核对实际 SoC、板卡内存布局、SDK/BSP、内核配置和驱动实现。代码、地址、日志及数据是原文示例，不是 ArmSoM 实测。

[校对记录](/docs/rockchip-linux-cma/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

唯一框架图来自中文原稿第 4 页；没有英文原图。

| 原文芯片 | 原文内核 |
| --- | --- |
| RK3588 / RK3568 / RK3399 / RK3288 / RK3368 / RV1126 / PX30 | Linux 4.4 / 4.19 / 5.10 |

<!-- Source CN PDF p.4, unit 0 -->

## 1. CMA驱动框架

<!-- Source CN PDF p.4, unit 1 -->

![CMA 驱动框架（中文 PDF 第 4 页原图）](/docs/rockchip-linux-cma/assets/cn-p004-X37.png)

*CMA 驱动框架（中文 PDF 第 4 页原图）*

<!-- Source CN PDF p.4, unit 2 -->

CMA主要有3部分驱动：

<!-- Source CN PDF p.4, unit 3 -->

1. `size@address`

<!-- Source CN PDF p.4, unit 4 -->

有三种方法可以传参，优先顺序是DTS > CMDLINE > DEFCONFIG，即如果dts有合法的节点，会以dts节点配置为最终参数，否则看cmdline是否有cma=size@base，最后才看defconfig是否有如上4个宏定义。

<!-- Source CN PDF p.4, unit 5 -->

2. `reserved` cma_areas[]

<!-- Source CN PDF p.4, unit 6 -->

通过dts可以配置多个cma节点，通过cmdline和defconfig只能定义default节点。所有reserved的内存会在全局的cma_areas[]存储。

<!-- Source CN PDF p.4, unit 7 -->

3. `active` cma_area

<!-- Source CN PDF p.4, unit 8 -->

解析参数、预留内存都在内核setup_arch阶段完成，active是core_initcall调用，保证在所有driver之前完成；active主要完成cma area的bitmap创建、cma pages加入buddy system。

<!-- Source CN PDF p.5, unit 9 -->

## 2. 内存预留的分配方法

<!-- Source CN PDF p.5, unit 10 -->

### 2.1 分配方法一: 通过menuconfig预留16MByte

<!-- Source CN PDF p.5, unit 11 -->

```text
CONFIG_DMA_CMA=y
CONFIG_CMA_SIZE_MBYTES=16
CONFIG_CMA_SIZE_SEL_MBYTES=y
```

<!-- Source CN PDF p.5, unit 12 -->

### 2.2 分配方法二: 通过dts的reserved-memory节点

<!-- Source CN PDF p.5, unit 13 -->

参考Documentation/devicetree/bindings/reserved-memory/reserved-memory.txt技术文档

<!-- Source CN PDF p.5, unit 14 -->

```text
reserved-memory {
    #address-cells = <1>;
    #size-cells = <1>;
    ranges;

    /* global autoconfigured region for contiguous allocations */
    linux,cma {
        compatible = "shared-dma-pool";
        reusable;
        size = <0x1000000>;
        alignment = <0x2000>;
        linux,cma-default;
    };
};
```

<!-- Source CN PDF p.5, unit 15 -->

## 3. 内存独占的分配方法

<!-- Source CN PDF p.5, unit 16 -->

上述方法分配到的是系统共享内存块，在多设备多次进行申请释放后，会有碎片化问题。有些外设需要较大的CMA内存块，碎片化会引起外设工作异常，为此需要给设备单独分配内存块

<!-- Source CN PDF p.6, unit 17 -->

### 3.1 分配方法一: 分配的内存块独立存在, 会被系统借用

<!-- Source CN PDF p.6, unit 18 -->

```text
reserved-memory {
    #address-cells = <1>;
    #size-cells = <1>;
    ranges;

    cma_region: region@88000000 {
        compatible = "shared-dma-pool";
        reusable;
        reg = <0x88000000 0x1800000>;
    };
};
```

<!-- Source CN PDF p.6, unit 19 -->

该方法分配的内存块，可以通过of_reserved_mem_device_init给指定设备用

<!-- Source CN PDF p.6, unit 20 -->

```text
#include <linux/of_reserved_mem.h>
static inline int of_reserved_mem_device_init(struct device *dev)
{
    return of_reserved_mem_device_init_by_idx(dev, dev->of_node, 0);
}
```

<!-- Source CN PDF p.6, unit 21 -->

### 3.2 分配方法二: 分配的内存块memblock

<!-- Source CN PDF p.6, unit 22 -->

```text
reserved-memory {
    #address-cells = <1>;
    #size-cells = <1>;
    ranges;

    display_reserved: framebuffer@78000000 {
        reg = <0x78000000 0x800000>;
    };
};
```

<!-- Source CN PDF p.6, unit 23 -->

可以通过/sys/kernel/debug/memblock/reserved节点查看分配结果

<!-- Source CN PDF p.6, unit 24 -->

节点展示的memblock范围是经过合并整理的

<!-- Source CN PDF p.6, unit 25 -->

该方法分配的内存块是没有内核页管理，使用者根据自身需要，去创建page scale list

<!-- Source CN PDF p.6, unit 26 -->

```text
console:/sys/kernel/debug/cma # cat /sys/kernel/debug/memblock/reserved
    0: 0x60004000..0x60007fff
    1: 0x60100000..0x61404a07
    2: 0x62e00000..0x62eeffff
    3: 0x68300000..0x6830d07f
...
```

<!-- Source CN PDF p.7, unit 27 -->

## 4. 内存预留调试方法

<!-- Source CN PDF p.7, unit 28 -->

### 4.1 CMA调试宏开关

<!-- Source CN PDF p.7, unit 29 -->

```text
CONFIG_CMA_DEBUGFS=y #打开调试文件节点
CONFIG_CMA_DEBUG=y #打印CMA日志信息
```

配置说明：`CONFIG_CMA_DEBUGFS=y` 创建调试节点；`CONFIG_CMA_DEBUG=y` 打印 CMA 日志。

<!-- Source CN PDF p.7, unit 30 -->

### 4.2 CMA调试节点

<!-- Source CN PDF p.7, unit 31 -->

```text
console:/sys/kernel/debug/cma # ls
cma-region@8800 cma-reserved
console:/sys/kernel/debug/cma/cma-reserved # ls
alloc bitmap free order_per_bit used
base_pfn count maxchunk
```

<!-- Source CN PDF p.7, unit 32 -->

alloc：用于从当前CMA块分配内存，单位：页

<!-- Source CN PDF p.7, unit 33 -->

bitmap：标记当前CMA块各个页是否被分配，1表示已被申请，0表示未被申请

<!-- Source CN PDF p.7, unit 34 -->

free：用于当前CMA块释放内存，单位：页

<!-- Source CN PDF p.7, unit 35 -->

order_per_bit：表示一个BIT所代表的页的阶数

<!-- Source CN PDF p.7, unit 36 -->

used：当前被申请的页的个数，单位：页

<!-- Source CN PDF p.7, unit 37 -->

base_pfn：当前CMA块首个页的页帧数

<!-- Source CN PDF p.7, unit 38 -->

maxchunk：当前CMA块最大连续空闲页的数量，单位：页

<!-- Source CN PDF p.7, unit 39 -->

## 5. 开机过程内存预留信息

<!-- Source CN PDF p.7, unit 40 -->

```text
[ 0.000000] Booting Linux on physical CPU 0xf00
[ 0.000000] CPU: ARMv7 Processor [410fc075] revision 5 (ARMv7), cr=10c5387d
[ 0.000000] CPU: div instructions available: patching division code
[ 0.000000] CPU: PIPT / VIPT nonaliasing data cache, VIPT aliasing instruction cache
[ 0.000000] OF: fdt: Machine model: Rockchip RK3126 bnd-d708 board
[ 0.000000] earlycon: uart8250 at MMIO32 0x20068000 (options '')
[ 0.000000] bootconsole [uart8250] enabled
[ 0.000000] Memory policy: Data cache writealloc
[ 0.000000] Reserved memory: created CMA memory pool at 0x88000000, size 24 MiB
[ 0.000000] OF: reserved mem: initialized node region@88000000, compatible id shared-dma-pool
[ 0.000000] cma: Reserved 16 MiB at 0x9f000000
[ 0.000000] On node 0 totalpages: 258560
[ 0.000000] Normal zone: 1728 pages used for memmap
[ 0.000000] Normal zone: 0 pages reserved
[ 0.000000] Normal zone: 193024 pages, LIFO batch:63
[ 0.000000] HighMem zone: 65536 pages, LIFO batch:15
[ 0.000000] psci: probing for conduit method from DT.
[ 0.000000] psci: PSCIv65535.65535 detected in firmware.
[ 0.000000] psci: Using standard PSCI v0.2 function IDs
[ 0.000000] psci: MIGRATE_INFO_TYPE not supported.
[ 0.000000] psci: SMC Calling Convention v1.0
[ 0.000000] percpu: Embedded 17 pages/cpu s38924 r8192 d22516 u69632
[ 0.000000] pcpu-alloc: s38924 r8192 d22516 u69632 alloc=17*4096
[ 0.000000] pcpu-alloc: [0] 0 [0] 1 [0] 2 [0] 3
[ 0.000000] Built 1 zonelists, mobility grouping on. Total pages: 256832
[ 0.000000] Dentry cache hash table entries: 131072 (order: 7, 524288 bytes)
[ 0.000000] Inode-cache hash table entries: 65536 (order: 6, 262144 bytes)
[ 0.000000] mem auto-init: stack:off, heap alloc:off, heap free:off
[ 0.000000] Memory: 960940K/1034240K available (11264K kernel code, 985K rwdata, 3180K rodata, 1024K init, 2104K bss, 32340K reserved, 40960K cma-reserved, 245024K highmem)
...
```

<!-- Source CN PDF p.8, unit 42 -->

第一块CMA分配成功信息

<!-- Source CN PDF p.8, unit 43 -->

```text
[ 0.000000] Reserved memory: created CMA memory pool at 0x88000000, size 24 MiB
[ 0.000000] OF: reserved mem: initialized node region@88000000, compatible id shared-dma-pool
```

<!-- Source CN PDF p.8, unit 44 -->

第二块CMA分配成功信息（系统默认）

<!-- Source CN PDF p.8, unit 45 -->

```text
[ 0.000000] cma: Reserved 16 MiB at 0x9f000000
```

{% endraw %}
