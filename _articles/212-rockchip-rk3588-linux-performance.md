---
title: "Rockchip RK3588 Linux Performance Test Report"
description: "Rockchip RK3588 Linux Performance Test Report — V1.0.0; RK3588 EVB1"
excerpt: "Rockchip RK3588 Linux Performance Test Report"
translation_key: "212-rockchip-rk3588-linux-performance"
slug: "212-rockchip-rk3588-linux-performance"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, RK3588, Linux, Benchmark]
---

{% raw %}

# Rockchip RK3588 Linux Performance Test Report

ArmSoM platform reference preserving the complete technical content of Rockchip source V1.0.0 (RK-CS-YF-922). The source test platform is RK3588-EVB1-LP4-V10 with board configuration `BoardConfig-rk3588-evb1-lp4-v10.mk`, not an ArmSoM board. Every score below is a historical source measurement, not an ArmSoM test or a guarantee for other boards. Match the actual board, SDK/BSP, kernel, cooling, power and memory separately. The source does not specify its kernel or SDK version; no hardware validation has been performed.

The source provides RK3588 baseline measurements from general Linux performance tools to help verify chip performance, diagnose performance problems and assess expected performance. Tools include SPEC 2006, Unixbench, Glmark2 and Stream. Only the source in the Chinese directory is supplied; there is no paired English PDF. English, Russian and German are complete translations of that source. It contains no technical figures; all data tables are editable.

## 1. Test environment configuration

### 1.1 Hardware environment

| Configuration | Description |
| --- | --- |
| Motherboard | RK3588-EVB1-LP4-V10 |
| CPU | RK3588; 4xA76-Based@2.4GHz; 4xA55@1.8GHz |
| GPU | RK3588; 4 core Mali-G610 1000MHz |
| RAM | 8G LPDDR4X 2112MHz 16bit*4Channel |
| ROM | eMMC HS400 32GB |
| OS | debian11 |

### 1.2 Software environment

For performance testing, set the CPU and GPU to performance mode. These are source commands; the wrapped GPU redirection path has been restored to one command. Verify the actual BSP nodes before use; these paths are not assumed to exist on every board.

```sh
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor

echo performance > /sys/devices/platform/fb000000.gpu/devfreq/fb000000.gpu/governor
```

After setting the mode, read the current CPU and GPU frequencies as follows:

```sh
cat /sys/devices/system/cpu/cpufreq/policy0/cpuinfo_cur_freq
cat /sys/devices/system/cpu/cpufreq/policy4/cpuinfo_cur_freq
cat /sys/devices/system/cpu/cpufreq/policy6/cpuinfo_cur_freq

cat /sys/devices/platform/fb000000.gpu/devfreq/fb000000.gpu/cur_freq
```

## 2. Test suites

### 2.1 SPEC 2006

Tests CPU integer and floating-point performance. Tool version: SPEC 2006 V1.01. Source results follow.

| Test | Score |
| --- | --- |
| Single core integer base | 25.5 |
| Single core floating point base | 29.9 |
| Multi-core (8 cores) integer base | 86.9 |
| Multi-core (8 cores) floating point base | 84.6 |

### 2.2 Unixbench

Tests system calls, reads/writes, processes, graphics, 2D, 3D, pipes, arithmetic, the C library and other system benchmarks. The source writes the version as `Unixbenc V5.1.3` (missing h); that spelling is retained for traceability.

| Test | Score |
| --- | --- |
| Single core | 1273.7 |
| Multi-core (8 cores) | 3662.2 |

### 2.3 Glmark2

Tests GPU OpenGL 2.0 and ES 2.0 performance. Tool version: glmark2 2021.02.

#### X11

| Test | Score |
| --- | --- |
| `glmark2-es2 --off-screen` | 3639 |
| `glmark2-es2` | 1376 |
| `glmark2-es2 --fullscreen` | 622 |

#### Wayland

| Test | Score |
| --- | --- |
| `glmark2-es2-wayland --off-screen` | 3680 |
| `glmark2-es2-wayland` | 2670 |
| `glmark2-es2-wayland --fullscreen` | 1258 |

### 2.4 Stream

Tests memory Copy, Scale, Add and Triad performance. Tool version: `stream1.0 V5.10`, retaining the source notation.

| Test | Single thread (MB/s) | Multiple threads (MB/s) |
| --- | --- | --- |
| Copy | 17912.8 | 20481.3 |
| Scale | 17982.8 | 20473.4 |
| Add | 17079.8 | 18205.1 |
| Triad | 17021.3 | 18126.3 |

## Adaptation and source notes

The source omits complete SPEC invocation parameters, cooling conditions and Stream compiler options; it is insufficient to reproduce every test. Package versions and scores are preserved as historical records.

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
