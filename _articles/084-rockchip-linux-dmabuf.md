---
title: "Rockchip Linux DMA-BUF: Memory Leaks, IOVA and Peak Usage Debugging"
description: "Full RK3588 Linux 5.10 DMA-BUF debug macros, procfs and source video playback memory and peak examples."
translation_key: "084-rockchip-linux-dmabuf"
slug: "084-rockchip-linux-dmabuf"
lang: "en"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "DMA-BUF"]
keywords: "ArmSoM Rockchip Linux linux dmabuf"
excerpt: "Full RK3588 Linux 5.10 DMA-BUF debug macros, procfs and source video playback memory and peak examples."
---

{% raw %}

# Rockchip Linux DMA-BUF: Memory Leaks, IOVA and Peak Usage Debugging

## ArmSoM applicability and source

Platform reference for adapting ArmSoM, translated from Chinese V1.0.0. Source scope: RK3588, Linux 5.10. No English PDF was supplied; English, Russian and German fully translate the Chinese source. German reuses the English article’s image URLs. No specific ArmSoM board, SDK/BSP or driver combination has been confirmed or hardware-tested. Check the actual SoC, board memory layout, SDK/BSP, kernel configuration and driver implementation. Code, addresses, logs and measurements are source examples, not ArmSoM test results.

[Editorial notes](/docs/rockchip-linux-dmabuf/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

This source describes DMA-BUF debugging for memory leaks, data-flow errors and memory mapping failures. The source has no technical figures; none are invented.

| Source SoC | Source kernel |
| --- | --- |
| RK3588 | Linux 5.10 |

<!-- Source CN PDF p.4, unit 0 -->

## 1. Introduction

<!-- Source CN PDF p.4, unit 1 -->

DMABUF is a buffer structure for sharing memory between multimedia devices. Devices can share memory across processes through a DMABUF file descriptor, using zero-copy to improve performance and asynchronous access to reduce coupling between modules.

<!-- Source CN PDF p.4, unit 2 -->

## 2. Linux changes for DMABUF debugging

<!-- Source CN PDF p.4, unit 3 -->

### 2.1 DMABUF_DEBUG

<!-- Source CN PDF p.4, unit 4 -->

The source BSP supports DMABUF debug from Linux-5.10. Enable it in `arch/arm64/configs/rockchip_defconfig`:

<!-- Source CN PDF p.4, unit 5 -->

```text
CONFIG_DMABUF_DEBUG=y
```

<!-- Source CN PDF p.4, unit 6 -->

With this macro enabled, each DMABUF receives a default name formed from pid+taskname, limited to 16 characters. Example:

<!-- Source CN PDF p.4, unit 7 -->

```text
416-allocator@4.
```

<!-- Source CN PDF p.4, unit 8 -->

### 2.2 DMABUF_PROCFS

<!-- Source CN PDF p.4, unit 9 -->

The source BSP supports DMABUF procfs from Linux-5.10. Enable it in `arch/arm64/configs/rockchip_defconfig`:

<!-- Source CN PDF p.4, unit 10 -->

```text
CONFIG_RK_DMABUF_PROCFS=y
```

<!-- Source CN PDF p.4, unit 11 -->

This creates an `rk_dmabuf` child node under `/proc/`, with the following debug nodes. The comments below are retained from the Chinese source:

<!-- Source CN PDF p.4, unit 12 -->

```text
dev # 显示所有DMABUF已经attach的device
sgt # 显示所有DMABUF的ScatterListTable，显示其IOVA
size # 显示所有DMABUF的total size
peak # 显示所有DMABUF的total size的峰值
```

Node meanings: dev lists attached devices; sgt shows ScatterListTable and IOVA; size reports total size; peak reports its maximum.

<!-- Source CN PDF p.4, unit 13 -->

### 2.3 DMABUF_DEBUG_ADVANCED

<!-- Source CN PDF p.4, unit 14 -->

This DMABUF procfs subfeature obtains the physical addresses of DMABUF memory. Enable it in `arch/arm64/configs/rockchip_defconfig`:

<!-- Source CN PDF p.4, unit 15 -->

```text
CONFIG_DMABUF_DEBUG_ADVANCED=y
```

<!-- Source CN PDF p.5, unit 16 -->

With this macro enabled, all DMABUFs are attached/mapped through a fake device to obtain their sgt. This assists `/proc/rk_dmabuf_sgt` in displaying all DMABUF IOVAs. The path is retained literally from the source; verify it against the running BSP.

<!-- Source CN PDF p.5, unit 17 -->

## 3. Questions and answers

<!-- Source CN PDF p.5, unit 18 -->

### 3.1 RK3588 video playback: DMABUF memory leak?

<!-- Source CN PDF p.5, unit 19 -->

Enable the debug macros and inspect memory on entering the main screen:

<!-- Source CN PDF p.5, unit 20 -->

```text
console:/ # cat /proc/rk_dmabuf/size
Total: 65552 KiB
```

<!-- Source CN PDF p.5, unit 21 -->

Play a video, exit playback, clear the playback history and return to the main screen:

<!-- Source CN PDF p.5, unit 22 -->

```text
console:/ # cat /proc/rk_dmabuf/size
Total: 83948 KiB
```

<!-- Source CN PDF p.5, unit 23 -->

### 3.2 Peak DMABUF memory during RK3588 video playback?

<!-- Source CN PDF p.5, unit 24 -->

Use the mpp debug node to inspect the total DMABUF memory used for video playback:

<!-- Source CN PDF p.5, unit 25 -->

```text
console:/ # cat /proc/mpp_service/sessions-summary
fdc38100.rkvdec-core Total: 699760 KiB
```

<!-- Source CN PDF p.5, unit 26 -->

Use the DMABUF debug node to inspect peak memory:

<!-- Source CN PDF p.5, unit 27 -->

```text
console:/ # cat /proc/rk_dmabuf/peak
Peak: 1544 MiB
```

<!-- Source CN PDF p.5, unit 28 -->

Reset the peak to zero and observe again:

<!-- Source CN PDF p.5, unit 29 -->

```text
console:/ # echo 0 > /proc/rk_dmabuf/peak
```

{% endraw %}
