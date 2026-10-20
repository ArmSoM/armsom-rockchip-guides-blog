---
title: "Rockchip Linux CMA: Driver Framework, Reserved Memory and Debugging"
description: "Complete CMA configuration, DTS, device-specific regions, debugfs nodes, framework diagram and boot logs."
translation_key: "083-rockchip-linux-cma"
slug: "083-rockchip-linux-cma"
lang: "en"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "CMA"]
keywords: "ArmSoM Rockchip Linux linux cma"
excerpt: "Complete CMA configuration, DTS, device-specific regions, debugfs nodes, framework diagram and boot logs."
---

{% raw %}

# Rockchip Linux CMA: Driver Framework, Reserved Memory and Debugging

## ArmSoM applicability and source

Platform reference for adapting ArmSoM, translated from Chinese V1.1.0. Source scope: RK3588 / RK3568 / RK3399 / RK3288 / RK3368 / RV1126 / PX30, Linux 4.4 / 4.19 / 5.10. No English PDF was supplied; English, Russian and German fully translate the Chinese source. German reuses the English article’s image URLs. No specific ArmSoM board, SDK/BSP or driver combination has been confirmed or hardware-tested. Check the actual SoC, board memory layout, SDK/BSP, kernel configuration and driver implementation. Code, addresses, logs and measurements are source examples, not ArmSoM test results.

[Editorial notes](/docs/rockchip-linux-cma/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

The sole framework diagram comes from Chinese PDF page 4; no English original exists.

| Source SoC | Source kernel |
| --- | --- |
| RK3588 / RK3568 / RK3399 / RK3288 / RK3368 / RV1126 / PX30 | Linux 4.4 / 4.19 / 5.10 |

<!-- Source CN PDF p.4, unit 0 -->

## 1. CMA driver framework

<!-- Source CN PDF p.4, unit 1 -->

![CMA driver framework (original Chinese PDF, page 4)](/docs/rockchip-linux-cma/assets/cn-p004-X37.png)

*CMA driver framework (original Chinese PDF, page 4)*

<!-- Source CN PDF p.4, unit 2 -->

The CMA driver has three main parts:

<!-- Source CN PDF p.4, unit 3 -->

1. `size@address`

<!-- Source CN PDF p.4, unit 4 -->

Parameters can be supplied in three ways, in the source BSP priority order `DTS > CMDLINE > DEFCONFIG`. A valid DTS node determines the final configuration; otherwise the driver checks for `cma=size@base` on the command line, then the four macro definitions mentioned in the source defconfig discussion.

<!-- Source CN PDF p.4, unit 5 -->

2. `reserved cma_areas[]`

<!-- Source CN PDF p.4, unit 6 -->

DTS can configure multiple CMA nodes; cmdline and defconfig can define only the default node. All reserved regions are stored in the global `cma_areas[]`.

<!-- Source CN PDF p.4, unit 7 -->

3. `active cma_area`

<!-- Source CN PDF p.4, unit 8 -->

Parameter parsing and memory reservation finish during kernel `setup_arch`. Activation is called through `core_initcall`, before all drivers. It mainly creates the CMA area bitmap and adds CMA pages to the buddy system.

<!-- Source CN PDF p.5, unit 9 -->

## 2. Allocating reserved memory

<!-- Source CN PDF p.5, unit 10 -->

### 2.1 Method 1: reserve 16MByte through menuconfig

<!-- Source CN PDF p.5, unit 11 -->

```text
CONFIG_DMA_CMA=y
CONFIG_CMA_SIZE_MBYTES=16
CONFIG_CMA_SIZE_SEL_MBYTES=y
```

<!-- Source CN PDF p.5, unit 12 -->

### 2.2 Method 2: the DTS reserved-memory node

<!-- Source CN PDF p.5, unit 13 -->

See `Documentation/devicetree/bindings/reserved-memory/reserved-memory.txt`.

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

## 3. Allocating device-specific memory

<!-- Source CN PDF p.5, unit 16 -->

The above methods allocate a system-shared memory region. Repeated allocations and frees by multiple devices can fragment it. Some peripherals need large contiguous CMA blocks and may malfunction if fragmentation prevents allocation. Allocate a separate region for such devices.

<!-- Source CN PDF p.6, unit 17 -->

### 3.1 Method 1: a separate region that the system can borrow

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

Assign this region to a specific device through `of_reserved_mem_device_init`.

<!-- Source CN PDF p.6, unit 20 -->

```text
#include <linux/of_reserved_mem.h>
static inline int of_reserved_mem_device_init(struct device *dev)
{
    return of_reserved_mem_device_init_by_idx(dev, dev->of_node, 0);
}
```

<!-- Source CN PDF p.6, unit 21 -->

### 3.2 Method 2: a memblock region

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

Inspect the allocation through `/sys/kernel/debug/memblock/reserved`.

<!-- Source CN PDF p.6, unit 24 -->

The displayed memblock ranges have been merged and consolidated.

<!-- Source CN PDF p.6, unit 25 -->

This allocation is not managed by kernel page management. The source says users must create a “page scale list” as needed; that term is retained pending clarification.

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

## 4. Debugging reserved memory

<!-- Source CN PDF p.7, unit 28 -->

### 4.1 CMA debug configuration switches

<!-- Source CN PDF p.7, unit 29 -->

```text
CONFIG_CMA_DEBUGFS=y #打开调试文件节点
CONFIG_CMA_DEBUG=y #打印CMA日志信息
```

Configuration notes: `CONFIG_CMA_DEBUGFS=y` creates debug nodes; `CONFIG_CMA_DEBUG=y` prints CMA logs.

<!-- Source CN PDF p.7, unit 30 -->

### 4.2 CMA debug nodes

<!-- Source CN PDF p.7, unit 31 -->

```text
console:/sys/kernel/debug/cma # ls
cma-region@8800 cma-reserved
console:/sys/kernel/debug/cma/cma-reserved # ls
alloc bitmap free order_per_bit used
base_pfn count maxchunk
```

<!-- Source CN PDF p.7, unit 32 -->

`alloc`: allocate memory from the current CMA region, in pages.

<!-- Source CN PDF p.7, unit 33 -->

`bitmap`: allocation state of each page; 1 means allocated, 0 means unallocated.

<!-- Source CN PDF p.7, unit 34 -->

`free`: release memory in the current CMA region, in pages.

<!-- Source CN PDF p.7, unit 35 -->

`order_per_bit`: the order of the number of pages represented by one bit.

<!-- Source CN PDF p.7, unit 36 -->

`used`: number of currently allocated pages.

<!-- Source CN PDF p.7, unit 37 -->

`base_pfn`: page frame number of the first page of the current CMA region.

<!-- Source CN PDF p.7, unit 38 -->

`maxchunk`: largest number of contiguous free pages in the current CMA region.

<!-- Source CN PDF p.7, unit 39 -->

## 5. Memory reservation messages during boot

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

Successful allocation of the first CMA region:

<!-- Source CN PDF p.8, unit 43 -->

```text
[ 0.000000] Reserved memory: created CMA memory pool at 0x88000000, size 24 MiB
[ 0.000000] OF: reserved mem: initialized node region@88000000, compatible id shared-dma-pool
```

<!-- Source CN PDF p.8, unit 44 -->

Successful allocation of the second CMA region (system default):

<!-- Source CN PDF p.8, unit 45 -->

```text
[ 0.000000] cma: Reserved 16 MiB at 0x9f000000
```

{% endraw %}
