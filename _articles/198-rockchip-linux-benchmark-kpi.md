---
title: "Rockchip Linux Benchmark KPI"
description: "Rockchip Linux Benchmark KPI — RK3588/RK3576/RK3562/RK3568/RK3566/RK3399/RK3326/RK3288, V1.3.0"
excerpt: "Rockchip Linux Benchmark KPI"
translation_key: "198-rockchip-linux-benchmark-kpi"
slug: "198-rockchip-linux-benchmark-kpi"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK3588", "RK3576", "Linux", "Benchmark"]
---

{% raw %}

# Rockchip Linux Benchmark KPI

ArmSoM platform reference based on Chinese and English RK-CS-YF-375 V1.3.0. All technical content and benchmark data for eight chips are retained for comparison during further development. These are Rockchip EVB results, not ArmSoM measurements or guarantees for other boards. For an ArmSoM board, verify SoC, memory, storage, SDK/BSP, kernel, cooling and display configuration. No hardware validation was performed.

## 1. Test environment

The table specifies hardware and software, including ARM chip, CPU core count, memory capacity and storage configuration. G/M notation for frequency and capacity is preserved from the source rather than silently converted.

| Chip | Rockchip EVB board | Operating system | SDK tag | Hardware configuration |
| --- | --- | --- | --- | --- |
| RK3588 | rk3588_evb1_lp4_v10 | Buildroot | linux-5.10-gen-rkr4 | CPU: eight cores, big 2.3G / little 1.8G; DDR: 2112M, 8G; GPU: 1G; FLASH: 32G eMMC |
| RK3576 | rk3576_evb1_v10 | Buildroot | linux-6.1-stan-rkr4 | CPU: eight cores, big 2.2G / little 2.0G; DDR: 2112M, 4G; GPU: 950MHz; NPU: 900MHz; FLASH: 256G UFS |
| RK3562 | rk3562_evb2_ddr4_v10 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4-core A53, 2016M; DDR: 1332M, 2G; GPU: 900M; NPU: 1000MHz; FLASH: 256G eMMC |
| RK3568 | rk3568_evb1_ddr4_v10 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4-core A55, 1992M; DDR: 1560M, 2G; GPU: 800M; NPU: 900MHz; FLASH: 32G eMMC |
| RK3566 | rk3566_evb2_lp4x_v10 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4-core A55, 1.8G; DDR: 1056M, 2G; GPU: 800M; NPU: 900MHz; FLASH: 16G eMMC |
| RK3399 | rk3399_evb_ind_lpddr4 | Buildroot | linux-5.10-gen-rkr4 | CPU: six cores, big 2xA72 at 1.8G, little 4XA53 at 1.4G; DDR: 856M, 4G; GPU: 800M; FLASH: 16G eMMC |
| RK3326 | rk3326_evb_lp3_v12 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4-core A35, 1.3G; DDR: 666M, 2G; GPU: 520M; FLASH: 8G eMMC |
| RK3288 | rk3288_evb_rk808 | Buildroot | linux-5.10-gen-rkr4 | CPU: 4-core A17, 1.6G; DDR: 528M, 2G; GPU: 600M; FLASH: 8G eMMC |

## 2. Testing methods

Document the test methods, tools and settings for each item in enough detail to reproduce the tests. The source sets system performance mode with the command below. It changes governors, is not read-only, and was not executed for this article.

```sh
echo performance | tee $(find /sys/ -name *governor) /dev/null || true
```

### 2.1 Glmark2 testing

Execute the following command:

```sh
/rockchip-test/gpu/gpu_test.sh
```

### 2.2 UnixBench testing

Execute the following command:

```sh
/opt/unixbench/Run
```

## 3. Test results

### 3.1 Buildroot system

#### 3.1.1 Glmark2

glmark2 benchmarks OpenGL 2.0 and ES 2.0. Normal, off-screen and full-screen scores follow.

| Item | RK3588 | RK3576 | RK3562 | RK3568 | RK3566 | RK3399 | RK3326 | RK3288 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Normal Screen (800x600) | 4851 | 1713 | 676 | 560 | 485 | 812 | 369 | 57 |
| Off Screen | 3550 | 1864 | 644 | 596 | 531 | 687 | 419 | 604 |
| Full Screen | 2780 | 788 | 287 | 240 | 224 | 183 | 253 | 52 |
| GPU Type | Valhall-G610 | Mali-G52 | Mali-G52 | Mali-G52 | Mali-G52 | Mali-T864 | Mali-G31 | Mali-T764 |
| Screen resolution | 1080x1920 | 1080x1920 | 1080x1920 | 1080x1920 | 1080x1920 | 1536x2048 | 720x1280 | 1536x2048 |

#### 3.1.2 UnixBench

UnixBench provides basic performance indicators for Unix-like systems. Reference values follow. The source does not give units for each row; the values are not silently relabeled with one common throughput unit.

System performance with a single task:

| Item | RK3399 | RK3288 | RK3326 | RK3566 | RK3568 | RK3562 | RK3576 | RK3588 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dhrystone 2 using register variables | 19191210.4 | 10626086.6 | 5704897.1 | 12332588.0 | 13176039.3 | 10821835.3 | 22932325.5 | 34493007.3 |
| Double-Precision Whetstone | 3303.5 | 1718.9 | 1565.2 | 2965.9 | 3164.5 | 2464.3 | 4103.7 | 6665.4 |
| Execl Throughput | 2730.8 | 1538.1 | 787.9 | 1483.6 | 1703.0 | 1815.3 | 2678.3 | 5695.8 |
| File Copy 1024 bufsize 2000 maxblocks | 263262.3 | 163001.5 | 125333.2 | 166135.4 | 175490.6 | 247437.6 | 432878.6 | 832875.7 |
| File Copy 256 bufsize 500 maxblocks | 98335.8 | 50635.1 | 37871.9 | 48956.5 | 51574.7 | 74740.7 | 145359.2 | 253871.4 |
| File Copy 4096 bufsize 8000 maxblocks | 677993.2 | 384632.9 | 321189.7 | 440209.9 | 461129.3 | 610768.8 | 1098724.6 | 1831983.9 |
| Pipe Throughput | 775302.3 | 357578.5 | 300305.5 | 521804.1 | 557997.0 | 619105.4 | 779828.1 | 1644863.6 |
| Pipe-based Context Switching | 87345.3 | 54247.5 | 37434.5 | 51766.2 | 53873.8 | 61437.0 | 105369.5 | 217180.2 |
| Process Creation | 4274.2 | 3512.1 | 2086.0 | 3782.4 | 4041.7 | 5113.1 | 4232.7 | 5272.1 |
| Shell Scripts (1 concurrent) | 2944.0 | 2973.3 | 1474.2 | 2352.0 | 2817.2 | 2301.5 | 2598.5 | 3254.2 |
| Shell Scripts (8 concurrent) | 832.4 | 703.2 | 431.7 | 567.3 | 675.6 | 647.6 | 976.8 | 2092.6 |
| System Call Overhead | 721899.8 | 624614.1 | 568868.6 | 783414.7 | 836985.7 | 838824.4 | 621437.6 | 1322359.7 |
| System Benchmarks Index Score | 654.7 | 421.7 | 290.6 | 456.9 | 497.3 | 533.3 | 761.6 | 1342.5 |

System performance with multiple tasks:

| Item | RK3399 | RK3288 | RK3326 | RK3566 | RK3568 | RK3562 | RK3576 | RK3588 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dhrystone 2 using register variables | 61892645.4 | 41527276.3 | 22821903.2 | 47931915.4 | 51737187.8 | 42342893.2 | 133846256.4 | 182453805.7 |
| Double-Precision Whetstone | 13192.2 | 6870.1 | 6265.7 | 11545.6 | 12431.5 | 9699.1 | 27875.6 | 38815.5 |
| Execl Throughput | 6638.9 | 4127.0 | 2449.4 | 3272.1 | 3951.1 | 4359.4 | 10082.5 | 23542.0 |
| File Copy 1024 bufsize 2000 maxblocks | 253903.6 | 265838.2 | 194293.5 | 236042.5 | 246968.0 | 436766.8 | 756330.5 | 681901.0 |
| File Copy 256 bufsize 500 maxblocks | 74647.0 | 74156.4 | 54107.4 | 65182.9 | 67873.4 | 117806.2 | 225876.4 | 189411.0 |
| File Copy 4096 bufsize 8000 maxblocks | 715699.5 | 709343.4 | 565091.8 | 639035.4 | 700693.2 | 1285002.9 | 1999953.4 | 1873825.2 |
| Pipe Throughput | 3159789.0 | 1323176.0 | 1191104.7 | 2031168.7 | 2191846.5 | 2427332.4 | 5664856.1 | 8951711.8 |
| Pipe-based Context Switching | 298324.6 | 134686.9 | 154652.2 | 202912.5 | 212649.7 | 306251.1 | 707269.5 | 1148297.7 |
| Process Creation | 11834.7 | 7412.8 | 5183.1 | 7036.5 | 7932.7 | 10979.8 | 17803.4 | 44316.5 |
| Shell Scripts (1 concurrent) | 7420.0 | 5710.9 | 3587.9 | 4613.8 | 5473.0 | 5027.4 | 9575.2 | 24379.9 |
| Shell Scripts (8 concurrent) | 952.5 | 744.6 | 477.4 | 593.1 | 707.7 | 688.4 | 1279.3 | 3455.2 |
| System Call Overhead | 2514699.7 | 2392234.7 | 2206337.3 | 2815382.8 | 3028273.6 | 3152888.0 | 3589591.2 | 3030469.3 |
| System Benchmarks Index Score | 1402.8 | 989.5 | 746.4 | 1039.1 | 1146.5 | 1365.4 | 2715.3 | 4036.2 |

## Source reconciliation

Both sources are V1.3.0. The eight hardware configurations and every results cell agree; pagination differs and the environment table is joined across pages. GPU source spellings such as `Valhall-G610` are retained, not corrected from assumptions. Neither source contains technical figures; all tables are editable. Test variability, repeat counts and confidence intervals are not specified and are not invented.

Official references: [Rockchip](https://www.rock-chips.com/); [ArmSoM documentation](https://docs.armsom.org/).

{% endraw %}
