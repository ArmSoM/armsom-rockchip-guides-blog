---
title: "Rockchip Linux Memory Allocators: DMA-HEAP, DRM-GEM, VB2 and RV1106 Debugging"
description: "Complete V1.0.0 reference for allocator APIs, cache coherency and rk-dma-heap-info output on the source RK3588/RV1106 Linux 5.10 platforms."
translation_key: "086-rockchip-linux-memory-allocator"
slug: "086-rockchip-linux-memory-allocator"
lang: "en"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Rockchip", "Linux", "DMA-HEAP", "DMABUF", "RV1106", "RK3588"]
keywords: "ArmSoM Rockchip Linux memory allocator DMA-HEAP DRM-GEM VB2 RV1106"
excerpt: "Complete V1.0.0 reference for allocator APIs, cache coherency and rk-dma-heap-info output on the source RK3588/RV1106 Linux 5.10 platforms."
---

{% raw %}

# Rockchip Linux Memory Allocators: DMA-HEAP, DRM-GEM, VB2 and RV1106 Debugging

## ArmSoM applicability and source

The source product table lists only RK3588 and RV1106 / Linux 5.10. Chapter 4 RK-DMA-HEAP is specific to RV1106, not automatically available on RK3588 merely because both use Linux 5.10. This is a Rockchip platform reference, not a claim of support on every ArmSoM board. Verify the exact board SoC, SDK/BSP, kernel drivers, heap configuration, device nodes and peripheral DMA/IOMMU capabilities. No hardware validation was performed. Only the Chinese V1.0.0 source (RK-KF-YF-469, 10 pages) was supplied; English, Russian and German fully translate it. The source has no technical figures, and no English originals are invented. Complete logs, duplicate device entries and source addresses are preserved; they are not ArmSoM measurements.

[Editorial notes](/docs/rockchip-linux-memory-allocator/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

## Technical overview and product versions

This guide introduces memory allocators on the Rockchip Linux 5.10 platform. Linux 5.10 adds the DMA-HEAP allocator under `drivers/dma-buf/heaps/`, specifically for allocating DMABUF memory; an ioctl returns its file descriptor (fd) to userspace.

| Chip | Kernel version |
| --- | --- |
| RK3588, RV1106 | Linux-5.10 |

## 1. Allocator one: DMA-HEAP

The allocator drivers are under `drivers/dma-buf/heaps/`.

```text
drivers/dma-buf/heaps/
├── cma_heap.c 物理地址连续内存分配器驱动
├── deferred-free-helper.c 内存延迟释放驱动
├── deferred-free-helper.h
├── Kconfig
├── Makefile
├── page_pool.c 内存⻚缓存驱动
├── page_pool.h
└── system_heap.c 物理地址不连续虚拟地址连续内存分配器驱动
```

File descriptions from the source: `cma_heap.c` allocates physically contiguous memory; `deferred-free-helper.c` handles deferred freeing; `page_pool.c` provides the page cache; `system_heap.c` allocates physically non-contiguous but virtually contiguous memory.

A heap driver represents an allocator for one memory type and supports module builds. Linux provides two typical drivers: system-heap and cma-heap.

### 1.1 system-heap

system-heap enables CPU caching by default. CPU access is cached and fast, but software must maintain data coherency between the device and CPU. The driver also provides system-uncached-heap without CPU caching.

system-heap supports defer-free by default, delaying memory release. Allocation is fast while its page cache is nonempty; mm shrinker reclaims this cache as appropriate.

system-heap uses `add_dma_heap()` to add an allocator to dma-heap, obtain a unique index and create devices under `/dev/dma_heap/`, such as `/dev/dma_heap/system-heap` and `/dev/dma_heap/system-uncached-heap`.

### 1.2 cma-heap

cma-heap enables CPU caching by default. CPU access is cached and fast, but software must maintain coherency between device and CPU.

cma-heap allocates pages with `cma_alloc`. The CMA driver determines the region; see the [Linux CMA reference](/articles/083-rockchip-linux-cma/). Allocated memory is physically contiguous and suitable for direct access by peripherals without an IOMMU.

## 2. Allocator two: DRM-GEM

The allocator driver is under `drivers/gpu/drm/rockchip/`.

## 3. Allocator three: VB2-MEMOPS

The allocator driver is under `drivers/media/common/videobuf2/`.

## 4. RV1106-specific allocator: RK-DMA-HEAP

RK-DMA-HEAP is an RV1106-specific DMABUF allocator based on DMA-HEAP. Its main differences from DMA-HEAP follow.

| Linux operation | Linux API | RETURN |
| --- | --- | --- |
| Allocate DMABUF | `rk_dma_heap_buffer_alloc` | `struct dma_buf *` |
| Allocate PAGE array | `rk_dma_heap_alloc_contig_pages` | `struct page *` |
| Supports debug list | | |

> DMA-HEAP allocates DMABUF objects; RK-DMA-HEAP supports both DMABUF allocation and ordinary page-array allocation.

### 4.1 rk-dma-heap-info

The RK-DMA-HEAP debug node is `/proc/rk_dma_heap/rk-dma-heap-info`. Reading it produces the following complete source-document example, not an ArmSoM test result.

```text
# cat /proc/rk_dma_heap/rk-dma-heap-info
dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5656
      Alloc by (vmpi ) [0x03e1b000-0x03e33fff] 0x00019000 (100 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5655
      Alloc by (vmpi ) [0x03e02000-0x03e1afff] 0x00019000 (100 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5654
      Alloc by (vmpi ) [0x03d96000-0x03e01fff] 0x0006c000 (432 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5653
      Alloc by (vmpi ) [0x03d86000-0x03d95fff] 0x00010000 (64 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5652
      Alloc by (vmpi ) [0x03d76000-0x03d85fff] 0x00010000 (64 KiB)
            Attached Devices:
            ffa50000.rkvenc
            ffa50000.rkvenc
Total 2 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5637
      Alloc by (vmpi ) [0x03c76000-0x03d75fff] 0x00100000 (1024 KiB)
            Attached Devices:
            ffa50000.rkvenc
            ffa50000.rkvenc
Total 2 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5636
      Alloc by (vmpi ) [0x03c74000-0x03c75fff] 0x00002000 (8 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5635
      Alloc by (vmpi ) [0x03c72000-0x03c73fff] 0x00002000 (8 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5626
      Alloc by (vmpi ) [0x03c40000-0x03c71fff] 0x00032000 (200 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5625
      Alloc by (vmpi ) [0x03c3f000-0x03c3ffff] 0x00001000 (4 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5624
      Alloc by (vmpi ) [0x03c37000-0x03c3efff] 0x00008000 (32 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached
dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5623
      Alloc by (vmpi ) [0x03c36000-0x03c36fff] 0x00001000 (4 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5622
      Alloc by (vmpi ) [0x03c2e000-0x03c35fff] 0x00008000 (32 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5621
      Alloc by (vmpi ) [0x03b64000-0x03c2dfff] 0x000ca000 (808 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5610
      Alloc by (vmpi ) [0x03acf000-0x03b63fff] 0x00095000 (596 KiB)
            Attached Devices:
            ffa00000.rkisp
            ffa50000.rkvenc
            ffa00000.rkisp
            ffa00000.rkisp
            ffa00000.rkisp
Total 5 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5609
      Alloc by (vmpi ) [0x03ac0000-0x03acefff] 0x0000f000 (60 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5608
      Alloc by (vmpi ) [0x03ab1000-0x03abffff] 0x0000f000 (60 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5607
      Alloc by (vmpi ) [0x038ef000-0x03ab0fff] 0x001c2000 (1800 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5606
      Alloc by (vmpi ) [0x038ed000-0x038eefff] 0x00002000 (8 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5605
      Alloc by (vmpi ) [0x038b3000-0x038ecfff] 0x0003a000 (232 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5604
      Alloc by (vmpi ) [0x038b1000-0x038b2fff] 0x00002000 (8 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5603
      Alloc by (vmpi ) [0x03877000-0x038b0fff] 0x0003a000 (232 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5602
      Alloc by (vmpi ) [0x0324e000-0x03876fff] 0x00629000 (6308 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5586
      Alloc by (ff660000.npu ) [0x0308c000-0x030f7fff] 0x0006c000 (432 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5585
      Alloc by (ff660000.npu ) [0x03087000-0x0308bfff] 0x00005000 (20 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5584
      Alloc by (ff660000.npu ) [0x03082000-0x03086fff] 0x00005000 (20 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5583
      Alloc by (ff660000.npu ) [0x0307d000-0x03081fff] 0x00005000 (20 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5582
      Alloc by (ff660000.npu ) [0x0306b000-0x0307cfff] 0x00012000 (72 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5581
      Alloc by (ff660000.npu ) [0x03059000-0x0306afff] 0x00012000 (72 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5580
      Alloc by (ff660000.npu ) [0x03047000-0x03058fff] 0x00012000 (72 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5579
      Alloc by (ff660000.npu ) [0x02e5f000-0x03046fff] 0x001e8000 (1952 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5328
      Alloc by (vmpi ) [0x02800000-0x02802fff] 0x00003000 (12 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02803000-0x02813fff] 0x00011000 (68 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02814000-0x02824fff] 0x00011000 (68 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02825000-0x02825fff] 0x00001000 (4 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02826000-0x02826fff] 0x00001000 (4 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02827000-0x02dddfff] 0x005b7000 (5852 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02dde000-0x02e4efff] 0x00071000 (452 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (rkisp-vir0 ) [0x02e4f000-0x02e52fff] 0x00004000 (16 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (rkisp-vir0 ) [0x02e53000-0x02e56fff] 0x00004000 (16 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (rkisp-vir0 ) [0x02e57000-0x02e5afff] 0x00004000 (16 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (rkisp-vir0 ) [0x02e5b000-0x02e5efff] 0x00004000 (16 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x030f8000-0x03249fff] 0x00152000 (1352 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x0324a000-0x0324dfff] 0x00004000 (16 KiB)

Total : 0x1634000 (22736 KiB)
```

Allocation information can generally be filtered with `Alloc`:

```text
# cat /proc/rk_dma_heap/rk-dma-heap-info |grep Alloc
            Alloc by (vmpi ) [0x03e1b000-0x03e33fff] 0x00019000 (100 KiB)
            Alloc by (vmpi ) [0x03e02000-0x03e1afff] 0x00019000 (100 KiB)
            Alloc by (vmpi ) [0x03d96000-0x03e01fff] 0x0006c000 (432 KiB)
            Alloc by (vmpi ) [0x03d86000-0x03d95fff] 0x00010000 (64 KiB)
            Alloc by (vmpi ) [0x03d76000-0x03d85fff] 0x00010000 (64 KiB)
            Alloc by (vmpi ) [0x03c76000-0x03d75fff] 0x00100000 (1024 KiB)
            Alloc by (vmpi ) [0x03c74000-0x03c75fff] 0x00002000 (8 KiB)
            Alloc by (vmpi ) [0x03c72000-0x03c73fff] 0x00002000 (8 KiB)
            Alloc by (vmpi ) [0x03c40000-0x03c71fff] 0x00032000 (200 KiB)
            Alloc by (vmpi ) [0x03c3f000-0x03c3ffff] 0x00001000 (4 KiB)
            Alloc by (vmpi ) [0x03c37000-0x03c3efff] 0x00008000 (32 KiB)
            Alloc by (vmpi ) [0x03c36000-0x03c36fff] 0x00001000 (4 KiB)
            Alloc by (vmpi ) [0x03c2e000-0x03c35fff] 0x00008000 (32 KiB)
            Alloc by (vmpi ) [0x03b64000-0x03c2dfff] 0x000ca000 (808 KiB)
            Alloc by (vmpi ) [0x03acf000-0x03b63fff] 0x00095000 (596 KiB)
            Alloc by (vmpi ) [0x03ac0000-0x03acefff] 0x0000f000 (60 KiB)
            Alloc by (vmpi ) [0x03ab1000-0x03abffff] 0x0000f000 (60 KiB)
            Alloc by (vmpi ) [0x038ef000-0x03ab0fff] 0x001c2000 (1800 KiB)
            Alloc by (vmpi ) [0x038ed000-0x038eefff] 0x00002000 (8 KiB)
            Alloc by (vmpi ) [0x038b3000-0x038ecfff] 0x0003a000 (232 KiB)
            Alloc by (vmpi ) [0x038b1000-0x038b2fff] 0x00002000 (8 KiB)
            Alloc by (vmpi ) [0x03877000-0x038b0fff] 0x0003a000 (232 KiB)
            Alloc by (vmpi ) [0x0324e000-0x03876fff] 0x00629000 (6308 KiB)
            Alloc by (ff660000.npu ) [0x0308c000-0x030f7fff] 0x0006c000 (432 KiB)
            Alloc by (ff660000.npu ) [0x03087000-0x0308bfff] 0x00005000 (20 KiB)
            Alloc by (ff660000.npu ) [0x03082000-0x03086fff] 0x00005000 (20 KiB)
            Alloc by (ff660000.npu ) [0x0307d000-0x03081fff] 0x00005000 (20 KiB)
            Alloc by (ff660000.npu ) [0x0306b000-0x0307cfff] 0x00012000 (72 KiB)
            Alloc by (ff660000.npu ) [0x03059000-0x0306afff] 0x00012000 (72 KiB)
            Alloc by (ff660000.npu ) [0x03047000-0x03058fff] 0x00012000 (72 KiB)
            Alloc by (ff660000.npu ) [0x02e5f000-0x03046fff] 0x001e8000 (1952 KiB)
            Alloc by (vmpi ) [0x02800000-0x02802fff] 0x00003000 (12 KiB)
            Alloc by (ffa00000.rkisp ) [0x02803000-0x02813fff] 0x00011000 (68 KiB)
            Alloc by (ffa00000.rkisp ) [0x02814000-0x02824fff] 0x00011000 (68 KiB)
            Alloc by (ffa00000.rkisp ) [0x02825000-0x02825fff] 0x00001000 (4 KiB)
            Alloc by (ffa00000.rkisp ) [0x02826000-0x02826fff] 0x00001000 (4 KiB)
            Alloc by (ffa00000.rkisp ) [0x02827000-0x02dddfff] 0x005b7000 (5852 KiB)
            Alloc by (ffa00000.rkisp ) [0x02dde000-0x02e4efff] 0x00071000 (452 KiB)
            Alloc by (rkisp-vir0 ) [0x02e4f000-0x02e52fff] 0x00004000 (16 KiB)
            Alloc by (rkisp-vir0 ) [0x02e53000-0x02e56fff] 0x00004000 (16 KiB)
            Alloc by (rkisp-vir0 ) [0x02e57000-0x02e5afff] 0x00004000 (16 KiB)
            Alloc by (rkisp-vir0 ) [0x02e5b000-0x02e5efff] 0x00004000 (16 KiB)
            Alloc by (ffa00000.rkisp ) [0x030f8000-0x03249fff] 0x00152000 (1352 KiB)
            Alloc by (ffa00000.rkisp ) [0x0324a000-0x0324dfff] 0x00004000 (16 KiB)
```

Format: `Alloc by ([dmabuf name]) [0xaaaaaaaa-0xbbbbbbbb] 0xzzzzzzzz (dd KiB)`

1. `[dmabuf name]`: defaults to the allocating driver thread name; a module-specific string can override it. For example, vmpi is the rockit thread calling rk-dma-heap.
2. `[0xaaaaaaaa-0xbbbbbbbb]`: starting and ending physical addresses of the region.
3. `0xzzzzzzzz`: hexadecimal region size.
4. `dd KiB`: decimal size converted to KiB.

{% endraw %}
