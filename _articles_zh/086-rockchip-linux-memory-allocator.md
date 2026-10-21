---
title: "Rockchip Linux 内存分配器：DMA-HEAP、DRM-GEM、VB2 与 RV1106 调试"
description: "完整整理 V1.0.0 技术正文、分配接口、缓存一致性和 rk-dma-heap-info 输出，适用于原稿 RK3588/RV1106 Linux 5.10 平台参考。"
translation_key: "086-rockchip-linux-memory-allocator"
slug: "086-rockchip-linux-memory-allocator"
lang: "zh"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Rockchip", "Linux", "DMA-HEAP", "DMABUF", "RV1106", "RK3588"]
keywords: "ArmSoM Rockchip Linux memory allocator DMA-HEAP DRM-GEM VB2 RV1106"
excerpt: "完整整理 V1.0.0 技术正文、分配接口、缓存一致性和 rk-dma-heap-info 输出，适用于原稿 RK3588/RV1106 Linux 5.10 平台参考。"
---

{% raw %}

# Rockchip Linux 内存分配器：DMA-HEAP、DRM-GEM、VB2 与 RV1106 调试

## ArmSoM 适用说明与来源

原稿产品表仅列 RK3588、RV1106 / Linux 5.10；第 4 章 RK-DMA-HEAP 专属于 RV1106，不因同为 Linux 5.10 就适用于 RK3588。本文是 Rockchip 平台参考，不能据此宣称所有 ArmSoM 板卡可用。实际需核对具体板卡 SoC、SDK/BSP、内核驱动、heap 配置、设备节点和外设 DMA/IOMMU 能力；本次未进行硬件验证。仅有中文 V1.0.0（RK-KF-YF-469，10 页），英文、俄文、德文完整据此翻译。原稿无技术配图；没有虚构英文原图。完整日志、重复设备行与原始地址保留，均非 ArmSoM 实测。

[校对记录](/docs/rockchip-linux-memory-allocator/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

## 技术概述与产品版本

本文介绍 Rockchip Linux 5.10 平台内存分配器相关技术。Linux 5.10 新增 DMA-HEAP 内存分配器，代码位于 `drivers/dma-buf/heaps/`，专用于分配 DMABUF 类型的内存；对用户空间通过 ioctl 返回 dmabuf 的索引（fd）。

| 芯片名称 | 内核版本 |
| --- | --- |
| RK3588, RV1106 | Linux-5.10 |

## 1. 分配器一：DMA-HEAP

分配器驱动代码位于 `drivers/dma-buf/heaps/` 目录。

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

一个 heap driver 表示一种内存类型的分配器，支持模块化编译。Linux 提供两种典型驱动：system-heap、cma-heap。

### 1.1 system-heap

system-heap 默认支持 CPU cache，CPU 访问所分配内存时使用缓存，访问速度快，但 device 和 CPU 之间必须通过软件维护数据一致性。该驱动派生出不支持 CPU cache 的 system-uncached-heap。

system-heap 默认支持 defer-free，即延迟释放内存；内存页缓存非空时分配速度快。内存页缓存依赖 mm shrinker 适当地回收。

system-heap 通过 `add_dma_heap()` 向 dma-heap 增加分配器，取得唯一索引，并在 `/dev/dma_heap/` 下创建设备，例如 `/dev/dma_heap/system-heap` 和 `/dev/dma_heap/system-uncached-heap`。

### 1.2 cma-heap

cma-heap 默认支持 CPU cache，CPU 访问所分配内存时使用缓存、速度快，但 device 和 CPU 之间必须通过软件保持一致性。

cma-heap 通过 `cma_alloc` 分配内存页；CMA 内存区域由 CMA 驱动确定，详见 [Linux CMA 参考](/zh/articles/083-rockchip-linux-cma/)。所得内存物理地址连续，适合没有 IOMMU 的外设直接访问。

## 2. 分配器二：DRM-GEM

分配器驱动代码位于 `drivers/gpu/drm/rockchip/`。

## 3. 分配器三：VB2-MEMOPS

分配器驱动代码位于 `drivers/media/common/videobuf2/`。

## 4. RV1106 专用分配器：RK-DMA-HEAP

RK-DMA-HEAP 是基于 DMA-HEAP、专用于 RV1106 的 DMABUF 分配器。其与 DMA-HEAP 的主要差异如下。

| Linux 功能 | Linux API | 返回值 |
| --- | --- | --- |
| 分配 DMABUF | `rk_dma_heap_buffer_alloc` | `struct dma_buf *` |
| 分配 PAGE 数组 | `rk_dma_heap_alloc_contig_pages` | `struct page *` |
| 支持 debug list | | |

> DMA-HEAP 是 DMABUF 分配器；RK-DMA-HEAP 既支持分配 DMABUF，也支持分配普通页数组。

### 4.1 rk-dma-heap-info

RK-DMA-HEAP 调试节点为 `/proc/rk_dma_heap/rk-dma-heap-info`，读取后输出如下。下列为原稿完整输出，不是本次 ArmSoM 测试结果。

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

通常可用 `Alloc` 过滤分配信息：

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

格式：`Alloc by ([dmabuf name]) [0xaaaaaaaa-0xbbbbbbbb] 0xzzzzzzzz (dd KiB)`

1. `[dmabuf name]`：默认取驱动中分配内存的线程名；各模块指定的字符串可覆盖默认值。例如 vmpi 是 rockit 中调用 rk-dma-heap 的线程名。
2. `[0xaaaaaaaa-0xbbbbbbbb]`：内存区域的起始、结束物理地址。
3. `0xzzzzzzzz`：内存区间大小的十六进制值。
4. `dd KiB`：内存区间大小转为 KiB 后的十进制值。

{% endraw %}
