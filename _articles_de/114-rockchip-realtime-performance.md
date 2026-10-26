---
title: "Rockchip Echtzeit-Linux: vollständiger PREEMPT_RT- und Xenomai-Testbericht"
description: "Rockchip Echtzeit-Linux: vollständiger PREEMPT_RT- und Xenomai-Testbericht — RK3568, RK3562, RK3588, RK3576, RK3506; V1.2.0."
translation_key: "114-rockchip-realtime-performance"
slug: "114-rockchip-realtime-performance"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, PREEMPT_RT, Xenomai]
excerpt: "Rockchip Echtzeit-Linux: vollständiger PREEMPT_RT- und Xenomai-Testbericht — RK3568, RK3562, RK3588, RK3576, RK3506; V1.2.0."
---

{% raw %}

Quelle RK-KF-YF-491 V1.2.0 enthält Messungen verschiedener RT-Linux-Implementierungen. Steigende Echtzeitanforderungen können Standard-Linux überfordern; PREEMPT_RT-Patches oder Xenomai können Verbesserungen ermöglichen. Sämtliche Herstellerkonfigurationen, Befehle, Protokolle und Testdauern bleiben erhalten; dies sind keine ArmSoM-Messungen. Das Vorwort nennt RK3568 kernel-4.19, RK3562/RK3588 kernel-5.10 und RK3576/RK3506 kernel-6.1, die RK3568-Testtabelle jedoch kernel-5.10. Dieser Quellenwiderspruch bleibt zu prüfen. SoC, SDK/BSP, RT-Patches, BL31, Takte und Lastbedingungen des konkreten ArmSoM-Boards prüfen; die Ergebnisse garantieren keine harte Echtzeitgrenze.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. Einführung in Echtzeit-Linux

Standard-Linux soll ein vollständiges, stabiles Open-Source-Betriebssystem bereitstellen, mittlere Antwortzeiten verkürzen, den Durchsatz erhöhen und Gesamtfunktionalität sowie durchschnittliche Leistung optimieren. Harte Echtzeit wird daher nicht gewährleistet. Linux-basierte harte Echtzeitlösungen lassen sich in zwei Gruppen einteilen. Direkte Kerneländerungen greifen relativ geringfügig statt umfassend ein und machen Linux unter der GPL zu einem vollständig präemptiven Echtzeitsystem. Nachteilig ist, dass unvorhersehbare Aktivitäten nicht echtzeitfähiger Prozesse die Echtzeitausführung weiterhin beeinflussen können und dies schwer auszuschließen ist. Ein Vertreter ist RT-patch (Real Preemption Patch). Beim Dual-Kernel-Ansatz existiert zusätzlich ein Echtzeitkernel im Kernelraum; Standard-Linux wird darauf als gewöhnlicher Prozess eingeplant. Damit lassen sich harte Echtzeit und neue Scheduling-Strategien einfach umsetzen. Beispiele sind RT-Linux, RTAI (Real-Time Application Interface) und Xenomai; dieser Ansatz bietet bessere Echtzeiteigenschaften.

## 2. Echtzeit-Leistungstests

### 2.1 RK3568

| Konfiguration | Beschreibung |
| --- | --- |
| CPU | 4xA55,1314 MHz(PVTPLL@0.9V@len=0x43) |
| CACHE | L1-32K,L2-0K,L3-512K |
| DDR | DDR4,1560M |
| OS | BUILDROOT,kernel-5.10 |
| BL31 | rk3568_bl31_rt_v1.03.elf(optimize RT latency) |

#### 2.1.1 Test ohne Last

##### 2.1.1.1 PREEMPT_RT Patch

```text
rk3568_t:/ # cyclictest -c 0 -m -a -t 4 -p 99
Apolicy: fifo: loadavg: 0.59 0.56 0.98 2/245 2084

T: 0 ( 1976) P:99 I:1000 C:84680446 Min:      0 Act:    0 Avg:    0 Max:      21
T: 1 ( 1977) P:99 I:1500 C:56453626 Min:      0 Act:    0 Avg:    0 Max:      17
T: 2 ( 1978) P:99 I:2000 C:42340216 Min:      0 Act:    0 Avg:    0 Max:      22
T: 3 ( 1979) P:99 I:2500 C:33872169 Min:      0 Act:    1 Avg:    1 Max:      18
```

Testdauer laut Quelle: 24 Stunden.

##### 2.1.1.2 Xenomai Cobalt Mode

```text
rk3568_t:/ # /data/cyclictest -c 0 -m -n -t 4 -p 99
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 0.29 0.18 0.12 1/1107 4216

T: 0 ( 4021) P:99 I:1000 C:12501264 Min:      1 Act:    8 Avg:    7 Max:      68
T: 1 ( 4022) P:99 I:1500 C:8334176 Min:      2 Act:    8 Avg:    7 Max:      70
T: 2 ( 4023) P:99 I:2000 C:6250631 Min:      2 Act:    9 Avg:    8 Max:      66
T: 3 ( 4024) P:99 I:2500 C:5000505 Min:      2 Act:    6 Avg:    7 Max:      58
```

Testdauer laut Quelle: 3 Stunden.

#### 2.1.2 Stresstest1

stress-ng -c 4 --io 2 --vm 1 --vm-bytes 4M --timeout 1000000s

##### 2.1.2.1 PREEMPT_RT Patch

```text
rk3568_t:/ # cyclictest -c 0 -m -a -t 4 -p 99
Apolicy: fifo: loadavg: 10.72 10.57 10.54 10/264 3892

T: 0 ( 2023) P:99 I:1000 C:76581100 Min:      0 Act:    2 Avg:    3 Max:      74
T: 1 ( 2024) P:99 I:1500 C:51054043 Min:      0 Act:    2 Avg:    3 Max:      64
T: 2 ( 2025) P:99 I:2000 C:38290514 Min:      0 Act:    4 Avg:    4 Max:      44
T: 3 ( 2026) P:99 I:2500 C:30632399 Min:      0 Act:    2 Avg:    4 Max:      61
```

Testdauer laut Quelle: 24 Stunden.

##### 2.1.2.2 Xenomai Cobalt Mode

```text
rk3568_t:/ # /data/cyclictest -c 0 -m -n -t 4 -p 99
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 7.65 7.80 7.75 8/1118 3998

T: 0 ( 3492) P:99 I:1000 C:21069118 Min:      2 Act:    4 Avg:   13 Max:      85
T: 1 ( 3493) P:99 I:1500 C:14046070 Min:      2 Act:   13 Avg:   15 Max:      76
T: 2 ( 3494) P:99 I:2000 C:10534550 Min:      2 Act:    6 Avg:   16 Max:      70
T: 3 ( 3495) P:99 I:2500 C:8427637 Min:      2 Act:   15 Avg:   15 Max:      96
```

Testdauer laut Quelle: 5 Stunden.

#### 2.1.3 Stresstest2

stress-ng -c 4 --io 2 --vm 1 --vm-bytes 4M --timeout 1000000s + Spiel Fishing Joy

##### 2.1.3.1 PREEMPT_RT Patch

```text
rk3568_t:/ # cyclictest -c 0 -m -a -t 4 -p 99
policy: fifo: loadavg: 11.92 12.59 12.59 9/1196 3372

T: 0 ( 1389) P:99 I:1000 C:252044459 Min:     0 Act:    6 Avg:    4 Max:     101
T: 1 ( 1390) P:99 I:1500 C:168029630 Min:     0 Act:    3 Avg:    4 Max:      93
T: 2 ( 1391) P:99 I:2000 C:126022214 Min:     0 Act:    1 Avg:    4 Max:     121
T: 3 ( 1392) P:99 I:2500 C:100817765 Min:     0 Act:    6 Avg:    4 Max:     104
```

Testdauer laut Quelle: 24 Stunden.

##### 2.1.3.2 Xenomai Cobalt Mode

```text
rk3568_t:/ # /data/cyclictest -c 0 -m -n -t 4 -p 99
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 10.21 10.06 9.99 10/1193 3177

T: 0 ( 2062) P:99 I:1000 C:41956558 Min:      2 Act:   34 Avg:   20 Max:     112
T: 1 ( 2063) P:99 I:1500 C:27971036 Min:      2 Act:   29 Avg:   20 Max:     128
T: 2 ( 2064) P:99 I:2000 C:20978270 Min:      2 Act:   30 Avg:   18 Max:      82
T: 3 ( 2065) P:99 I:2500 C:16782616 Min:      2 Act:   28 Avg:   18 Max:     105
```

Testdauer laut Quelle: 12 Stunden.

### 2.2 RK3562

| Konfiguration | Beschreibung |
| --- | --- |
| CPU | 4xA53,2016MHz |
| CACHE | L1-32K,L2-512K |
| DDR | LP4X,1320M |
| OS | BUILDROOT,kernel-5.10 |

#### 2.2.1 Test ohne Last

##### 2.2.1.1 PREEMPT_RT Patch

```text
root@rk3562-buildroot:/# cyclictest -c 0 -m -n -t 4 -p 99
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 1.00 1.26 1.31 1/202 1344

T: 0 ( 1152) P:99 I:1000 C:51905271 Min:      4 Act:    6 Avg:    6 Max:      46
T: 1 ( 1153) P:99 I:1500 C:34603508 Min:      4 Act:    6 Avg:    6 Max:      55
T: 2 ( 1154) P:99 I:2000 C:25952627 Min:      4 Act:    6 Avg:    6 Max:      28
T: 3 ( 1155) P:99 I:2500 C:20762098 Min:      4 Act:    6 Avg:    6 Max:      55
```

Testdauer laut Quelle: 14 Stunden.

##### 2.2.1.2 Xenomai Cobalt Mode

```text
root@rk3562-buildroot:/# cyclictest -c 0 -m -n -t 4 -p 99
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 0.02 0.02 0.00 1/152 2459

T: 0 ( 2377) P:99 I:1000 C:14773911 Min:      2 Act:    4 Avg:    4 Max:      31
T: 1 ( 2378) P:99 I:1500 C:9849274 Min:      2 Act:    4 Avg:    4 Max:      28
T: 2 ( 2379) P:99 I:2000 C:7386955 Min:      2 Act:    4 Avg:    4 Max:      18
T: 3 ( 2380) P:99 I:2500 C:5909564 Min:      2 Act:    4 Avg:    4 Max:      32
```

Testdauer laut Quelle: 4 Stunden.

#### 2.2.2 Stresstest

stress -c 4 --io 2 --vm 1 --vm-bytes 256M --timeout 1000000s

##### 2.2.2.1 PREEMPT_RT Patch

```text
root@rk3562-buildroot:/# cyclictest -c 0 -m -n -t 4 -p 99
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 9.42 8.33 8.61 9/220 1477

T: 0 ( 1472) P:99 I:1000 C:7971377 Min:      4 Act:    8 Avg:   10 Max:      69
T: 1 ( 1473) P:99 I:1500 C:5314247 Min:      5 Act:   16 Avg:   12 Max:      72
T: 2 ( 1474) P:99 I:2000 C:3985679 Min:      5 Act:   10 Avg:   10 Max:      63
T: 3 ( 1475) P:99 I:2500 C:3188543 Min:      5 Act:   12 Avg:   12 Max:      76
```

Testdauer laut Quelle: 2 Stunden.

##### 2.2.2.2 Xenomai Cobalt Mode

```text
root@rk3562-buildroot:/# cyclictest -c 0 -m -n -t 4 -p 99
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 7.93 7.92 7.92 9/165 2370

T: 0 ( 2266) P:99 I:1000 C:6493284 Min:      2 Act:   11 Avg:    9 Max:      69
T: 1 ( 2267) P:99 I:1500 C:4328849 Min:      2 Act:   12 Avg:   10 Max:      72
T: 2 ( 2268) P:99 I:2000 C:3246637 Min:      2 Act:   11 Avg:    9 Max:      40
T: 3 ( 2269) P:99 I:2500 C:2597305 Min:      2 Act:   13 Avg:    9 Max:      73
```

Testdauer laut Quelle: 2 Stunden.

### 2.3 RK3588

| Konfiguration | Beschreibung |
| --- | --- |
| CPU | 4xA76(big),2.2GHz,4xA55(little),1.8GHz |
| CACHE | A76:L1-64K,L2-512K<br>A55:L1-32K,L2-128K |
| DDR | LP4X,2112M |
| OS | BUILDROOT,kernel-5.10 |

#### 2.3.1 Test ohne Last

##### 2.3.1.1 PREEMPT_RT Patch

```text
root@rk3588:/# cyclictest -c 0 -m -t 8 -p 99
# /dev/cpu_dma_latency set to 0us

policy: fifo: loadavg: 2.71 3.24 3.29 1/322 3955
T: 0 ( 3406) P:99 I:1000 C:6766462 Min:      3 Act:    4 Avg:    4 Max:      11
T: 1 ( 3407) P:99 I:1500 C:4510976 Min:      4 Act:    4 Avg:    4 Max:      13
T: 2 ( 3408) P:99 I:2000 C:3383228 Min:      4 Act:    4 Avg:    4 Max:      13
T: 3 ( 3409) P:99 I:2500 C:2706579 Min:      4 Act:    4 Avg:    4 Max:      13
T: 4 ( 3410) P:99 I:3000 C:2255481 Min:      1 Act:    1 Avg:    1 Max:       8
T: 5 ( 3411) P:99 I:3500 C:1933267 Min:      1 Act:    1 Avg:    1 Max:       7
T: 6 ( 3412) P:99 I:4000 C:1691609 Min:      1 Act:    1 Avg:    1 Max:       8
T: 7 ( 3413) P:99 I:4500 C:1503652 Min:      1 Act:    1 Avg:    1 Max:       8
```

Testdauer laut Quelle: 2 Stunden.

##### 2.3.1.2 Xenomai Cobalt Mode

```text
root@rk3588:/# cyclictest -c 0 -m -n -t 8 -p 99
# /dev/cpu_dma_latency set to 0us

policy: fifo: loadavg: 0.63 0.60 0.55 1/206 1336
T: 0 ( 1163) P:99 I:1000 C:43237018 Min:      1 Act:    2 Avg:    2 Max:       6
T: 1 ( 1164) P:99 I:1500 C:28824678 Min:      1 Act:    2 Avg:    2 Max:       6
T: 2 ( 1165) P:99 I:2000 C:21618508 Min:      1 Act:    2 Avg:    2 Max:       6
T: 3 ( 1166) P:99 I:2500 C:17294807 Min:      1 Act:    2 Avg:    2 Max:       6
T: 4 ( 1167) P:99 I:3000 C:14412339 Min:      1 Act:    2 Avg:    2 Max:       6
T: 5 ( 1168) P:99 I:3500 C:12353433 Min:      1 Act:    2 Avg:    2 Max:       6
T: 6 ( 1169) P:99 I:4000 C:10809254 Min:      1 Act:    2 Avg:    2 Max:       6
T: 7 ( 1170) P:99 I:4500 C:9608226 Min:       1 Act:    2 Avg:    2 Max:       6
```

Testdauer laut Quelle: 12 Stunden.

#### 2.3.2 Stresstest

stress-ng -c 8 --io 2 --vm 1 --vm-bytes 1024M --timeout 1000000s

##### 2.3.2.1 PREEMPT_RT Patch

```text
root@rk3588:/# cyclictest -c 0 -m -t 8 -p 99
# /dev/cpu_dma_latency set to 0us

policy: fifo: loadavg: 15.20 15.28 15.29 11/345 10678
T: 0 ( 6379) P:99 I:1000 C:6473077 Min:      3 Act:   13 Avg:    7 Max:      28
T: 1 ( 6380) P:99 I:1500 C:4315388 Min:      4 Act:    7 Avg:    7 Max:      24
T: 2 ( 6381) P:99 I:2000 C:3236536 Min:      3 Act:    4 Avg:    6 Max:      24
T: 3 ( 6382) P:99 I:2500 C:2589231 Min:      4 Act:    8 Avg:    7 Max:      30
T: 4 ( 6383) P:99 I:3000 C:2157683 Min:      1 Act:    1 Avg:    2 Max:      16
T: 5 ( 6384) P:99 I:3500 C:1849443 Min:      1 Act:    2 Avg:    2 Max:      15
T: 6 ( 6385) P:99 I:4000 C:1618261 Min:      1 Act:    2 Avg:    2 Max:      16
T: 7 ( 6386) P:99 I:4500 C:1438455 Min:      1 Act:    2 Avg:    2 Max:      15
```

Testdauer laut Quelle: 2 Stunden.

##### 2.3.2.2 Xenomai Cobalt Mode

```text
root@rk3588:/# cyclictest -c 0 -m -n -t 8 -p 99
# /dev/cpu_dma_latency set to 0us

policy: fifo: loadavg: 12.82 12.81 12.81 11/225 1490
T: 0 ( 1179) P:99 I:1000 C:12797171 Min:      1 Act:    4 Avg:    4 Max:      19
T: 1 ( 1180) P:99 I:1500 C:8531447 Min:      1 Act:    4 Avg:    3 Max:      16
T: 2 ( 1181) P:99 I:2000 C:6398585 Min:      1 Act:    4 Avg:    4 Max:      25
T: 3 ( 1182) P:99 I:2500 C:5118868 Min:      1 Act:    3 Avg:    5 Max:      28
T: 4 ( 1183) P:99 I:3000 C:4265723 Min:      1 Act:    5 Avg:    4 Max:      17
T: 5 ( 1184) P:99 I:3500 C:3656334 Min:      1 Act:    4 Avg:    5 Max:      18
T: 6 ( 1185) P:99 I:4000 C:3199292 Min:      2 Act:    4 Avg:    5 Max:      17
T: 7 ( 1186) P:99 I:4500 C:2843815 Min:      1 Act:    5 Avg:    5 Max:      19
```

Testdauer laut Quelle: 4 Stunden.

### 2.4 RK3576

| Konfiguration | Beschreibung |
| --- | --- |
| CPU | 4xA72(big):2.3GHz,4xA53(little):2.2GHz |
| CACHE | A72:L1-I-48K,L1-D-32K,L2-1M<br>A53:L1-I-32K,L1-D-32K,L2-512K |
| DDR | LP4X,2112M |
| OS | BUILDROOT,kernel-6.1 |

#### 2.4.1 Test ohne Last

##### 2.4.1.1 PREEMPT_RT Patch

```text
root@rk3576-buildroot:/# cyclictest -c0 -m -t -p99 -D8H
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 3.50 3.32 3.17 1/309 3491

T: 0 ( 2675) P:99 I:1000 C:28799996 Min:      2 Act:    3 Avg:    3 Max:      34
T: 1 ( 2676) P:99 I:1500 C:19199994 Min:      2 Act:    3 Avg:    3 Max:      25
T: 2 ( 2677) P:99 I:2000 C:14399993 Min:      2 Act:    3 Avg:    3 Max:      27
T: 3 ( 2678) P:99 I:2500 C:11519993 Min:      2 Act:    3 Avg:    3 Max:      28
T: 4 ( 2679) P:99 I:3000 C:9599993 Min:      2 Act:    2 Avg:    2 Max:      17
T: 5 ( 2680) P:99 I:3500 C:8228564 Min:      2 Act:    2 Avg:    2 Max:      19
T: 6 ( 2681) P:99 I:4000 C:7199993 Min:      2 Act:    2 Avg:    2 Max:      16
T: 7 ( 2682) P:99 I:4500 C:6399993 Min:      2 Act:    2 Avg:    2 Max:      16
```

Testdauer laut Quelle: 8 Stunden.

##### 2.4.1.2 Xenomai Cobalt Mode

```text
root@rk3576:/# ./usr/demo/cyclictest -c 0 -m -n -t 8 -p 99 -D 2H
# /dev/cpu_dma_latency set to 0us

policy: fifo: loadavg: 0.54 0.54 0.54 1/207 1104
T: 0 ( 1557) P:99 I:1000 C:7199995 Min:      1 Act:    2 Avg:    2 Max:      12
T: 1 ( 1558) P:99 I:1500 C:4799996 Min:      1 Act:    2 Avg:    2 Max:       8
T: 2 ( 1559) P:99 I:2000 C:3599997 Min:      1 Act:    2 Avg:    2 Max:      14
T: 3 ( 1560) P:99 I:2500 C:2879998 Min:      1 Act:    2 Avg:    2 Max:       9
T: 4 ( 1561) P:99 I:3000 C:2399998 Min:      1 Act:    2 Avg:    2 Max:      13
T: 5 ( 1562) P:99 I:3500 C:2057141 Min:      1 Act:    2 Avg:    2 Max:       9
T: 6 ( 1563) P:99 I:4000 C:1799998 Min:      1 Act:    2 Avg:    2 Max:       7
T: 7 ( 1564) P:99 I:4500 C:1599998 Min:      1 Act:    2 Avg:    2 Max:       8
```

Testdauer laut Quelle: 2 Stunden.

#### 2.4.2 Stresstest

stress-ng -c8 --io 8 --cpu-load 100 -vm 4 --vm-bytes 512M --timeout 10000000s

##### 2.4.2.1 PREEMPT_RT Patch

```text
root@rk3576-buildroot:/# cyclictest -c0 -m -t -p99 -D8H
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 24.41 23.87 23.55 17/341 2533
T: 0 ( 1425) P:99 I:1000 C:28799993 Min:      3 Act:    6 Avg:    9 Max:      44
T: 1 ( 1426) P:99 I:1500 C:19199994 Min:      3 Act:    7 Avg:    9 Max:      36
T: 2 ( 1427) P:99 I:2000 C:14399992 Min:      3 Act:    7 Avg:    8 Max:      35
T: 3 ( 1428) P:99 I:2500 C:11519992 Min:      3 Act:   11 Avg:   10 Max:      39
T: 4 ( 1429) P:99 I:3000 C:9599985 Min:      2 Act:   10 Avg:    8 Max:      41
T: 5 ( 1430) P:99 I:3500 C:8228558 Min:      2 Act:   12 Avg:    7 Max:      35
T: 6 ( 1431) P:99 I:4000 C:7199986 Min:      2 Act:    8 Avg:    9 Max:      48
T: 7 ( 1432) P:99 I:4500 C:6399988 Min:      2 Act:    6 Avg:    7 Max:      38
```

Testdauer laut Quelle: 8 Stunden.

##### 2.4.2.2 Xenomai Cobalt Mode

```text
root@rk3576:/# ./usr/demo/cyclictest -c0 -m -n -t -p99 -D 2H
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 21.61 21.60 21.64 20/241 1759

T: 0 ( 1653) P:99 I:1000 C:7199993 Min:      2 Act:    7 Avg:    7 Max:      43
T: 1 ( 1654) P:99 I:1500 C:4799991 Min:      2 Act:   11 Avg:    6 Max:      40
T: 2 ( 1655) P:99 I:2000 C:3599991 Min:      2 Act:    5 Avg:    6 Max:      43
T: 3 ( 1656) P:99 I:2500 C:2879986 Min:      2 Act:   16 Avg:    6 Max:      39
T: 4 ( 1657) P:99 I:3000 C:2399988 Min:      2 Act:    7 Avg:    7 Max:      42
T: 5 ( 1658) P:99 I:3500 C:2057132 Min:      2 Act:   12 Avg:    6 Max:      45
T: 6 ( 1659) P:99 I:4000 C:1799991 Min:      2 Act:    7 Avg:    8 Max:      44
T: 7 ( 1660) P:99 I:4500 C:1599991 Min:      2 Act:   16 Avg:    8 Max:      47
```

Testdauer laut Quelle: 2 Stunden.

### 2.5 RK3506

| Konfiguration | Beschreibung |
| --- | --- |
| CPU | 3xA7,1512MHz |
| CACHE | L1-16K,L2-128K |
| DDR | DDR3,800M |
| OS | BUILDROOT,kernel-6.1 |

#### 2.5.1 Test ohne Last

##### 2.5.1.1 PREEMPT_RT Patch

```text
root@rk3506-buildroot:/# cyclictest -m -a -p 99 -t 3 -i 1000 -D 2h
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 1.72 1.60 1.48 2/127 4000

T: 0 (  502) P:99 I:1000 C:7199993 Min:      0 Act:    0 Avg:    1 Max:      14
T: 1 (  503) P:99 I:1500 C:4799988 Min:      0 Act:    1 Avg:    1 Max:      19
T: 2 (  504) P:99 I:2000 C:3599985 Min:      0 Act:    2 Avg:    1 Max:      26
```

Testdauer laut Quelle: 2 Stunden.

##### 2.5.1.2 Xenomai Cobalt Mode

```text
root@rk3506-buildroot:/# cyclictest -m -a -p 99 -t 3 -i 1000 -D 2h
WARN: stat /dev/cpu_dma_latency failed: No such file or directory
policy: fifo: loadavg: 0.56 0.31 0.21 1/95 2088

T: 0 ( 2356) P:99 I:1000 C:7199998 Min:      4 Act:    4 Avg:    7 Max:      46
T: 1 ( 2357) P:99 I:1500 C:4799998 Min:      4 Act:   12 Avg:    7 Max:      46
T: 2 ( 2358) P:99 I:2000 C:3599997 Min:      3 Act:    5 Avg:    9 Max:      55
```

Testdauer laut Quelle: 2 Stunden.

#### 2.5.2 Stresstest

stress-ng -c 3 --io 2 --vm 1 --vm-bytes 4M --timeout 1000000s

##### 2.5.2.1 PREEMPT_RT Patch

```text
root@rk3506-buildroot:/# cyclictest -m -a -p 99 -t 3 -i 1000 -D 2h
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 8.49 7.88 7.76 7/137 1083

T: 0 ( 1537) P:99 I:1000 C:7199996 Min:      0 Act:    5 Avg:    4 Max:      71
T: 1 ( 1538) P:99 I:1500 C:4799976 Min:      0 Act:    5 Avg:    4 Max:     115
T: 2 ( 1540) P:99 I:2000 C:3599957 Min:      0 Act:    4 Avg:    4 Max:     129
```

Testdauer laut Quelle: 2 Stunden.

##### 2.5.2.2 Xenomai Cobalt Mode

```text
root@rk3506-buildroot:/# cyclictest -m -a -p 99 -t 3 -i 1000 -D 2h
WARN: stat /dev/cpu_dma_latency failed: No such file or directory
policy: fifo: loadavg: 6.87 6.82 6.72 7/104 1531

T: 0 ( 1919) P:99 I:1000 C:7199991 Min:      4 Act:   20 Avg:   26 Max:     124
T: 1 ( 1920) P:99 I:1500 C:4799993 Min:      4 Act:   21 Avg:   28 Max:     155
T: 2 ( 1921) P:99 I:2000 C:3599987 Min:      5 Act:   16 Avg:   28 Max:     133
```

Testdauer laut Quelle: 2 Stunden.

#### 2.5.3 Test mit isoliertem Kern

CPU1 isolieren und die beiden anderen Kerne belasten: stress-ng -c 3 --io 2 --vm 1 --vm-bytes 4M --timeout 1000000s

##### 2.5.3.1 PREEMPT_RT Patch

```text
root@rk3506-buildroot:/# cyclictest -m -a 1 -p 99 -t 1 -i 1000 --mainaffinity=0 -D 2h
# /dev/cpu_dma_latency set to 0us
policy: fifo: loadavg: 7.19 7.17 7.22 7/137 648

T: 0 ( 1117) P:99 I:1000 C:7199996 Min:      0 Act:    2 Avg:    3 Max:      62
```

Testdauer laut Quelle: 2 Stunden.

##### 2.5.3.2 Xenomai Cobalt Mode

```text
root@rk3506-buildroot:/# cyclictest -m -a 1 -p 99 -t 1 -i 1000 -D 2h
WARN: stat /dev/cpu_dma_latency failed: No such file or directory
policy: fifo: loadavg: 6.53 6.52 6.57 8/101 1115

T: 0 ( 1503) P:99 I:1000 C:7199992 Min:      4 Act:   15 Avg:   16 Max:      68
```

Testdauer laut Quelle: 2 Stunden.

{% endraw %}
