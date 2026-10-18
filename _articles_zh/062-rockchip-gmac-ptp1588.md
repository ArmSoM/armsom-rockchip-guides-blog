---
title: "Rockchip GMAC PTP1588 完整指南：硬件时间戳、时钟同步与 PPS"
description: "完整保留 PTP1588 延迟与偏差公式、GMAC 时间戳寄存器、ptp4l/phc2sys/gPTP、固定与灵活 PPS、RT-Thread 及 Linux 4.19 主模式补丁。"
translation_key: "062-rockchip-gmac-ptp1588"
slug: "062-rockchip-gmac-ptp1588"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "GMAC", "PTP1588", "PPS", "RK3576", "RK3588"]
keywords: "ArmSoM Rockchip GMAC PTP1588 PPS RK3576 RK3588"
excerpt: "完整保留 PTP1588 延迟与偏差公式、GMAC 时间戳寄存器、ptp4l/phc2sys/gPTP、固定与灵活 PPS、RT-Thread 及 Linux 4.19 主模式补丁。"
---

{% raw %}

# Rockchip GMAC PTP1588 完整指南：硬件时间戳、时钟同步与 PPS

## ArmSoM 适用说明

本文介绍 Rockchip 平台以太网 GMAC 接口的 PTP1588 功能，完整依据 16 页英文 V1.0.0 PDF 整理。未提供对应中文 PDF；中文、俄文均为英文技术正文的完整翻译。三语使用英文 PDF 的全部六张原图，原图中部分中文标签及仪器界面保持原样。

本文为 ArmSoM 平台参考，不是板级验证报告。下表沿用原文列出的 SoC 和内核版本“ALL”；这是原稿适用表述，不等于已经确认所有内核、所有 ArmSoM 板卡都支持全部功能。应逐项核对板卡、以太网/PHY 接线、SDK/BSP、驱动、`clk_ptp_ref`、PPS 引脚复用和实际 PTP 时钟。第 4 章另介绍 RK2118 的 RT-Thread。未在硬件上执行命令、同步时钟或应用补丁；日志、波形及亚微秒结果均为原文示例，并非 ArmSoM 实测。

| 原文芯片 | 原文内核范围 |
| --- | --- |
| RK3588, RK3576, RK3568, RK3506, RV1126, RK2118 | ALL |

原文疑点已保留并记录：§1.3 的 IPv6 地址串、第 2 章的 `phy2sys` 名称、§2.2 的 CST/UTC 方向表述、gPTP 英文全称以及日志首个巨大 RMS 值。不能把这些信息静默视为已验证配置；具体页码及仅限提取/排版的修复见校对记录。

[校对记录](/docs/rockchip-gmac-ptp1588/EDITORIAL-NOTES.md) · [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.4, unit 0 -->

## 1. PTP1588 实现原理

<!-- Source EN PDF p.4, unit 1 -->

PTP1588 即网络测量与控制系统的精密时间协议标准，其基本作用是让分布式网络中的所有时钟与最精确的时钟同步。它定义了 PTP（Precision Time Protocol，精密时间协议），用于使标准以太网或其他支持组播的终端设备达到亚微秒级同步。IEEE PTP1588 用于要求时钟精度高于 NTP 的本地分布式系统。GMAC 控制器支持 PTP1588 v1 和 v2。

<!-- Source EN PDF p.4, unit 2 -->

常见的 PTP1588 同步流程采用延迟请求—响应机制（Delay Request-Response Mechanism）：

<!-- Source EN PDF p.4, unit 3 -->

### 1.1 延迟响应机制的报文收发流程

<!-- Source EN PDF p.4, unit 4 -->

![延迟请求—响应时序图](/docs/rockchip-gmac-ptp1588/assets/en-p04-figure1.png)

*延迟请求—响应时序图 — 英文 PDF, p.4.*

<!-- Source EN PDF p.4, unit 5 -->

1. 主设备定期向其所有节点广播 PTP 同步报文。该报文在 t1 时刻离开主设备系统；在 GMII 或 MII 以太网端口处记录报文发出的时刻 t1。
2. 从设备接收同步报文，使用自己的时间基准捕获准确的接收时刻 t2。
3. 主设备向从设备发送包含 t1 信息的 Follow_up 报文，以供后续使用。由于 Sync 报文本身无法携带其准确的离开时刻，Sync 报文的精确发送时间戳 t1 被封装到随后发出的 Follow_up 报文中，传递给从时钟。
4. 从设备向主设备发送 Delay_Req 报文，并记录报文离开 GMII 或 MII 接口的准确时刻 t3。
5. 主设备接收该报文，并捕获报文进入其系统的准确时刻 t4。
6. 主设备通过 Delay_Resp 报文将 t4 信息发送给从设备。
7. 从设备使用 t1、t2、t3、t4 这四个值，将本地时间基准同步到主设备的时间基准。

<!-- Source EN PDF p.5, unit 12 -->

### 1.2 时钟偏差与网络时延

<!-- Source EN PDF p.5, unit 13 -->

`offset`：时钟偏差，即主从时钟之间的时间差。

<!-- Source EN PDF p.5, unit 14 -->

`delay`：网络时延，即报文在网络中传输造成的延迟。

<!-- Source EN PDF p.5, unit 15 -->

从时钟可利用 t1、t2、t3、t4 四个精确时间戳，计算主从时钟偏差 `offset` 与传输时延 `delay`：

<!-- Source EN PDF p.5, unit 16 -->

![网络时延与时钟偏差公式](/docs/rockchip-gmac-ptp1588/assets/en-p05-figure1.png)

*网络时延与时钟偏差公式 — 英文 PDF, p.5.*

```text
delay  = ((t2 - t1) + (t4 - t3)) / 2
offset = ((t2 - t1) - (t4 - t3)) / 2
```

<!-- Source EN PDF p.5, unit 17 -->

从时钟获得 offset 和 delay 后，可通过修正本地时钟实现时间同步。

<!-- Source EN PDF p.5, unit 18 -->

### 1.3 PTP 报文

<!-- Source EN PDF p.5, unit 19 -->

通过 IPv4 传输的 PTP 报文

<!-- Source EN PDF p.5, unit 20 -->

IEEE 1588 v1 允许使用下列 IPv4 组播地址：

- `224.0.1.129`
- `224.0.1.130`
- `224.0.1.131`
- `224.0.1.132`

<!-- Source EN PDF p.6, unit 22 -->

IEEE 1588 v2 的 IP 组播地址：

- PTP Primary multicast address：`224.0.1.129`
- PTP Pdelay multicast address：`224.0.0.107`

通过 IPv6 传输的 PTP 帧，原文列出的十六进制地址为：

- PTP Primary multicast address：`FF0x:0:0:0:0:0:0:0:0:181`
- PTP Pdelay multicast address：`FF02:0:0:0:0:0:0:0:0:6B`

<!-- Source EN PDF p.6, unit 23 -->

通过以太网传输的 PTP 报文

<!-- Source EN PDF p.6, unit 24 -->

所有 PTP 报文均可使用以下任一组播地址：

- `01-1B-19-00-00-00`
- `01-80-C2-00-00-0E`

<!-- Source EN PDF p.6, unit 25 -->

### 1.4 GMAC PTP1588 工作原理

<!-- Source EN PDF p.6, unit 26 -->

GMAC PTP1588 的系统时间发生器使用参考时钟 `clk_ptp_ref` 更新，该时钟是捕获 \*GMII/RMII 接口收发以太网报文快照（时间戳）的时间源。

<!-- Source EN PDF p.6, unit 27 -->

系统时间包含两部分，分别存放于 `MAC_System_Time_Seconds` 和 `MAC_System_Time_Nanoseconds` 寄存器中。纳秒字段支持以下两种模式：

<!-- Source EN PDF p.6, unit 28 -->

数字翻转模式（Digital rollover mode）：纳秒字段最大值为 `0x3B9A_C9FF`，即 `(10^9-1)` 纳秒。

<!-- Source EN PDF p.6, unit 29 -->

二进制翻转模式（Binary rollover mode）：纳秒字段到达 `0x7FFF_FFFF` 后翻转并使秒字段递增，每位精度约为 `0.466 ns`。

<!-- Source EN PDF p.6, unit 30 -->

通过设置 `TSUPDT` 位更新系统时间。设置前，需要在 `MAC_System_Time_Seconds_Update` 和 `MAC_System_Time_Nanoseconds_Update` 寄存器中给出要增加或减去的指定值。

<!-- Source EN PDF p.6, unit 31 -->

如果仅直接更新系统时间，这种方法的抖动误差较大，因此硬件提供了更精确的时间更新方法。

<!-- Source EN PDF p.7, unit 32 -->

![GMAC 系统时间累加器与增量寄存器](/docs/rockchip-gmac-ptp1588/assets/en-p07-figure1.png)

*GMAC 系统时间累加器与增量寄存器 — 英文 PDF, p.7.*

<!-- Source EN PDF p.7, unit 33 -->

如上图所示，GMAC PTP1588 的系统时间修正方法是在一段时间内校正 `clk_ptp_ref` 相对主时钟的频率偏移或频率漂移（IEEE 1588-2002 中定义）。这有助于维持时间线性，避免在 PTP 同步报文间隔内使参考时间出现剧烈变化或较大抖动。累加器不断累加 addend 寄存器的内容，累加产生的进位作为系统时间计数器递增的脉冲。累加器为 32 位寄存器，可充当高精度倍频器或分频器。

<!-- Source EN PDF p.7, unit 34 -->

通常先设置默认 addend 值，例如 `0x80000000`，这样每两个 `clk_ptp_ref` 周期，32 位累加器便溢出一次。图中可见，累加器溢出时，Sub-second 寄存器增加 `incr_sub_sec` 寄存器配置的一个单位。若时钟为 100M，则 `MAC_Sub_Second_Increment` 应设置为两倍时钟周期，即 `0x14`。这适用于数字模式，二进制模式还需要转换。数字模式增长到 `0x3B9A_C9FF` 时，Second 寄存器递增 1，表示累计了 1s；二进制模式则在增长到 `0x7FFF_FFFF` 时使 Second 寄存器递增 1。

<!-- Source EN PDF p.8, unit 35 -->

执行 PTP1588 同步时，每个 `clk_ptp_ref` 周期都把 addend 寄存器的值加到累加器中。修改 addend 值会影响 Sub-second 的累加，可简单理解为修改 PTP 时钟，最终影响系统时间的变化。软件必须根据同步报文计算频率漂移，并相应更新 addend 寄存器。

<!-- Source EN PDF p.8, unit 36 -->

### 1.5 GMAC PTP1588 时间戳获取

<!-- Source EN PDF p.8, unit 37 -->

从延迟响应机制的收发流程可知，准确获取报文通过网卡发送和接收的时刻至关重要。硬件实现中，GMAC 在收发网络报文时，将当时的系统时间戳保存到指定内存中；该内存就是对应报文的发送或接收描述符，例如下面的 TX 描述符：

<!-- Source EN PDF p.8, unit 38 -->

![TX 描述符时间戳布局](/docs/rockchip-gmac-ptp1588/assets/en-p08-figure1.png)

*TX 描述符时间戳布局 — 英文 PDF, p.8.*

| 描述符字 | 位 | 含义 |
| --- | --- | --- |
| TDES0 | 31:0 | 时间戳低字 |
| TDES1 | 31:0 | 时间戳高字 |
| TDES2 | 31:0 | 保留 |
| TDES3 | 31 | OWN |
| TDES3 | 30:0 | Status[30:0] |

<!-- Source EN PDF p.8, unit 39 -->

代码片段：

<!-- Source EN PDF p.8, unit 40 -->

```c
static inline void dwmac4_get_timestamp(void *desc, u32 ats, u64 *ts)
{
    struct dma_desc *p = (struct dma_desc *)desc;
    u64 ns;
    ns = le32_to_cpu(p->des0);
    /* convert high/sec time stamp value to nanosecond */
    ns += le32_to_cpu(p->des1) * 1000000000ULL;
    *ts = ns;
}
```

<!-- Source EN PDF p.8, unit 41 -->

硬件在接收和发送时为哪些报文保存时间戳，需要在 `MAC_Timestamp_Control` 寄存器中设置。

<!-- Source EN PDF p.9, unit 42 -->

## 2. PTP1588 测试

<!-- Source EN PDF p.9, unit 43 -->

使用 ethtool 检查是否支持硬件时间戳；支持时，参数列表中应包含：

<!-- Source EN PDF p.9, unit 44 -->

- `SOF_TIMESTAMPING_RAW_HARDWARE`

<!-- Source EN PDF p.9, unit 45 -->

- `SOF_TIMESTAMPING_TX_HARDWARE`

<!-- Source EN PDF p.9, unit 46 -->

- `SOF_TIMESTAMPING_RX_HARDWARE`

<!-- Source EN PDF p.9, unit 47 -->

```text
root@linaro-alip:/# ethtool -T eth0
Time stamping parameters for eth0:
Capabilities:
        hardware-transmit (SOF_TIMESTAMPING_TX_HARDWARE)
        software-transmit (SOF_TIMESTAMPING_TX_SOFTWARE)
        hardware-receive (SOF_TIMESTAMPING_RX_HARDWARE)
        software-receive (SOF_TIMESTAMPING_RX_SOFTWARE)
        software-system-clock (SOF_TIMESTAMPING_SOFTWARE)
        hardware-raw-clock (SOF_TIMESTAMPING_RAW_HARDWARE)
PTP Hardware Clock: 0
Hardware Transmit Timestamp Modes:
        off
        on
Hardware Receive Filter Modes:
        none
        all
        ptpv1-l4-event
        ptpv1-l4-sync
        ptpv1-l4-delay-req
        ptpv2-l4-event
        ptpv2-l4-sync
        ptpv2-l4-delay-req
        ptpv2-event
        ptpv2-sync
```

<!-- Source EN PDF p.9, unit 48 -->

常用测试软件包括 Linuxptp 提供的 ptp4l、phy2sys。ptp4l 通过硬件时间戳使 PTP 硬件时钟与主时钟同步，或通过软件时间戳使系统时钟与主时钟同步；phc2sys 用于同步系统时钟和网卡硬件时钟，仅用于硬件时间戳模式。其他测试软件还包括 ptpd2 等。

<!-- Source EN PDF p.9, unit 49 -->

### 2.1 ptp4l 测试

<!-- Source EN PDF p.9, unit 50 -->

从端：

<!-- Source EN PDF p.9, unit 51 -->

```text
ptp4l -i eth0 -m -H -s
```

<!-- Source EN PDF p.9, unit 52 -->

主端：

<!-- Source EN PDF p.10, unit 53 -->

```text
ptp4l -i eth0 -m -H
```

<!-- Source EN PDF p.10, unit 54 -->

```text
ptp4l[420.071]: selected /dev/ptp0 as PTP clock
ptp4l[420.077]: port 1 (eth0): new foreign master 54e1ad.fffe.dfa454-1
ptp4l[424.077]: selected best master clock 54e1ad.fffe.dfa454
ptp4l[424.078]: port 1 (eth0): LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[425.084]: master offset -1466 s2 freq -20216 path delay 13117
ptp4l[425.084]: port 1 (eth0): UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[426.084]: master offset -6 s2 freq -19196 path delay 13117
ptp4l[427.085]: master offset 491 s2 freq -18701 path delay 13020
ptp4l[428.084]: master offset 330 s2 freq -18714 path delay 13026
ptp4l[429.084]: master offset 365 s2 freq -18580 path delay 13041
ptp4l[430.084]: master offset 116 s2 freq -18720 path delay 13050
ptp4l[431.084]: master offset 30 s2 freq -18771 path delay 13041
ptp4l[432.084]: master offset 24 s2 freq -18768 path delay 13032
ptp4l[433.084]: master offset 29 s2 freq -18756 path delay 13032
ptp4l[434.084]: master offset 39 s2 freq -18737 path delay 13032
ptp4l[435.084]: master offset -71 s2 freq -18836 path delay 13032
ptp4l[437.085]: master offset 201 s2 freq -18585 path delay 13015
ptp4l[438.085]: master offset -70 s2 freq -18796 path delay 13021
ptp4l[439.085]: master offset -30 s2 freq -18777 path delay 13041
ptp4l[440.085]: master offset 29 s2 freq -18727 path delay 13032
ptp4l[441.085]: master offset -41 s2 freq -18788 path delay 13037
ptp4l[442.085]: master offset -61 s2 freq -18820 path delay 13037
ptp4l[443.085]: master offset 54 s2 freq -18723 path delay 13007
ptp4l[444.085]: master offset -31 s2 freq -18792 path delay 13007
ptp4l[445.085]: master offset -6 s2 freq -18777 path delay 13007
ptp4l[446.085]: master offset 61 s2 freq -18711 path delay 13045
ptp4l[447.085]: master offset -89 s2 freq -18843 path delay 13045
ptp4l[448.085]: master offset 41 s2 freq -18740 path delay 13030
ptp4l[449.085]: master offset -4 s2 freq -18772 path delay 13030
ptp4l[450.085]: master offset -47 s2 freq -18817 path delay 13023
ptp4l[451.085]: master offset 5 s2 freq -18779 path delay 13026
ptp4l[452.085]: master offset 55 s2 freq -18727 path delay 13026
ptp4l[453.085]: master offset 93 s2 freq -18673 path delay 13023
ptp4l[454.085]: master offset -57 s2 freq -18795 path delay 13023
ptp4l[455.086]: master offset -32 s2 freq -18787 path delay 13023
ptp4l[456.085]: master offset 33 s2 freq -18732 path delay 13023
ptp4l[457.086]: master offset -26 s2 freq -18781 path delay 13037
ptp4l[458.086]: master offset -55 s2 freq -18817 path delay 13026
ptp4l[459.086]: master offset -5 s2 freq -18784 path delay 13026
ptp4l[460.086]: master offset -33 s2 freq -18813 path delay 13024
```

<!-- Source EN PDF p.10, unit 55 -->

`master offset` 表示主从端点的时间差，单位为纳秒（ns）。s0、s1、s2 表示 1588 协议的不同状态：s0 为未锁定，s1 为正在同步，s2 为已锁定。`freq` 是时钟频率调整量，单位为十亿分之一（ppb）；`path delay` 是主时钟同步报文的预计传输时延，单位为纳秒，可通过 E2E 或 P2P 方法测量，默认采用 E2E。

<!-- Source EN PDF p.11, unit 56 -->

### 2.2 同步系统时钟

<!-- Source EN PDF p.11, unit 57 -->

将网卡时钟与操作系统时钟同步：

<!-- Source EN PDF p.11, unit 58 -->

主时钟

<!-- Source EN PDF p.11, unit 59 -->

```text
sudo phc2sys -m -s CLOCK_REALTIME -c end0 -w &
sudo ptp4l -i end0 -m -H
```

<!-- Source EN PDF p.11, unit 60 -->

从时钟

<!-- Source EN PDF p.11, unit 61 -->

```text
phc2sys -m -s eth0 -c CLOCK_REALTIME -w --step_threshold=1 &
ptp4l -i eth0 -m -H -s
```

<!-- Source EN PDF p.11, unit 62 -->

同步前两块板卡的时间：

<!-- Source EN PDF p.11, unit 63 -->

```text
root@linaro-alip:/# date
July 8, 2024, Monday, 19:48:25 CST
root@buildroot:/# date
Thu Jan 1 00:14:02 UTC 1970
```

<!-- Source EN PDF p.11, unit 64 -->

同步后两块板卡的时间（原文称“中国标准时间 CST 比协调世界时 UTC 落后 8 个时区”，该方向表述与下面示例不一致，按原文保留并列入待核对）：

<!-- Source EN PDF p.11, unit 65 -->

```text
root@linaro-alip:/# date
July 8, 2024, Monday, 19:51:52 CST
root@buildroot:/# date
Mon Jul 8 11:51:52 UTC 2024
```

<!-- Source EN PDF p.11, unit 66 -->

### 2.3 gPTP 测试

<!-- Source EN PDF p.11, unit 67 -->

原文将 gPTP 展开为 general precise time protocol。gPTP 是 PTP 的衍生协议，也称为 802.1AS，目的是使局域网内所有节点在时间上保持同步。gPTP 基于二层（L2）传播，因此只能在局域网内传播。

<!-- Source EN PDF p.11, unit 68 -->

从端：

<!-- Source EN PDF p.11, unit 69 -->

```text
ptp4l -i eth0 -m -H -f ./gPTP.cfg --step_threshold=1 -s
```

<!-- Source EN PDF p.11, unit 70 -->

主端：

<!-- Source EN PDF p.11, unit 71 -->

```text
ptp4l -i end0 -m -H -f ./gPTP.cfg --step_threshold=1
```

<!-- Source EN PDF p.12, unit 73 -->

```text
ptp4l[196.636]: selected /dev/ptp0 as PTP clock -f gPTP.cfg --step_threshold=1 -s
ptp4l[196.670]: port 1 (eth0): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[196.671]: port 0 (/var/run/ptp4l): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[196.671]: port 0 (/var/run/ptp4lro): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[200.262]: port 1 (eth0): new foreign master 9ae370.fffe.1cb4e0-1
ptp4l[200.547]: selected local clock 568583.fffe.b70879 as best master
ptp4l[202.262]: selected best master clock 9ae370.fffe.1cb4e0
ptp4l[202.262]: port 1 (eth0): LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[202.942]: port 1 (eth0): UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[203.568]: rms 853264659523145600 max 1706529319046291712 freq -4554 +/- 1736 delay 15780 +/- 0
ptp4l[204.570]: rms 305 max 360 freq -5595 +/- 53 delay 15780 +/- 0
ptp4l[205.571]: rms 205 max 290 freq -5713 +/- 37 delay 15770 +/- 0
ptp4l[206.573]: rms 53 max 129 freq -5592 +/- 58 delay 15769 +/- 0
ptp4l[207.574]: rms 46 max 85 freq -5572 +/- 63 delay 15765 +/- 0
ptp4l[208.576]: rms 62 max 115 freq -5510 +/- 73 delay 15765 +/- 0
ptp4l[209.577]: rms 52 max 95 freq -5502 +/- 66 delay 15765 +/- 0
ptp4l[210.579]: rms 49 max 75 freq -5545 +/- 66 delay 15765 +/- 0
ptp4l[211.580]: rms 56 max 115 freq -5506 +/- 75 delay 15765 +/- 0
ptp4l[212.582]: rms 42 max 65 freq -5552 +/- 53 delay 15765 +/- 0
ptp4l[213.584]: rms 53 max 114 freq -5553 +/- 72 delay 15774 +/- 0
ptp4l[214.585]: rms 51 max 106 freq -5513 +/- 66 delay 15774 +/- 0
ptp4l[215.587]: rms 59 max 74 freq -5552 +/- 81 delay 15774 +/- 0
ptp4l[216.588]: rms 57 max 96 freq -5503 +/- 71 delay 15764 +/- 0
ptp4l[217.590]: rms 50 max 99 freq -5566 +/- 62 delay 15779 +/- 0
ptp4l[218.591]: rms 68 max 101 freq -5538 +/- 93 delay 15779 +/- 0
ptp4l[219.593]: rms 66 max 106 freq -5538 +/- 91 delay 15774 +/- 0
ptp4l[220.595]: rms 56 max 106 freq -5551 +/- 78 delay 15774 +/- 0
ptp4l[221.596]: rms 55 max 84 freq -5575 +/- 72 delay 15784 +/- 0
ptp4l[222.598]: rms 36 max 71 freq -5539 +/- 47 delay 15789 +/- 0
ptp4l[223.599]: rms 53 max 76 freq -5561 +/- 74 delay 15784 +/- 0
ptp4l[224.601]: rms 65 max 116 freq -5533 +/- 87 delay 15784 +/- 0
ptp4l[225.602]: rms 64 max 136 freq -5577 +/- 86 delay 15784 +/- 0
ptp4l[226.604]: rms 66 max 136 freq -5538 +/- 88 delay 15784 +/- 0
ptp4l[227.606]: rms 46 max 61 freq -5553 +/- 63 delay 15779 +/- 0
ptp4l[228.607]: rms 58 max 139 freq -5547 +/- 80 delay 15779 +/- 0
ptp4l[229.609]: rms 42 max 61 freq -5553 +/- 58 delay 15779 +/- 0
```

<!-- Source EN PDF p.12, unit 74 -->

这里显示偏差的均方根（RMS），以得到更平滑的表示。

<!-- Source EN PDF p.12, unit 75 -->

## 3. PPS

<!-- Source EN PDF p.12, unit 76 -->

### 3.1 固定 PPS

<!-- Source EN PDF p.12, unit 77 -->

PPS 即 Pulse-Per-Second（每秒脉冲）。默认情况下 GMAC 工作于固定 PPS 输出模式，间隔为 1 秒。可通过 `MAC_PPS_Control` 寄存器的 `PPSCTRL0` 字段改变 PPS 输出频率。 在此模式下，只要正确配置 iomux，就可以测试 PPS 脉冲输出信号。`PPSCTRL` 默认值为 `0000`，每秒输出一个脉冲，脉宽为一个 `clk_ptp_ref` 周期。

<!-- Source EN PDF p.13, unit 79 -->

![原文 PPS 残余抖动示波器截图](/docs/rockchip-gmac-ptp1588/assets/en-p13-figure1.png)

*原文 PPS 残余抖动示波器截图 — 英文 PDF, p.13.*

<!-- Source EN PDF p.13, unit 80 -->

上图是原文测试现象：两个设备通过 PTP1588 同步后，经过一段时间在示波器上观察它们的 PPS 输出信号，抖动残差时间与 ptp4l 测得的 master offset 时间差基本一致。

<!-- Source EN PDF p.13, unit 81 -->

### 3.2 二进制模式与数字模式

<!-- Source EN PDF p.13, unit 82 -->

前文已说明两种模式在系统时间更新方面的区别。PPS 输出在这两种模式下的频率和占空比也不同。其他 `PPSCTRL` 值对应的输出频率如下：

<!-- Source EN PDF p.13, unit 83 -->

| PPSCTRL | 二进制翻转模式 | 数字翻转模式 |
| --- | --- | --- |
| 0001 | 2 Hz | 1 Hz |
| 0010 | 4 Hz | 2 Hz |
| 0011 | 8 Hz | 4 Hz |
| 0100 | 16 Hz | 8 Hz |
| ... | ... | ... |
| 1111 | 32.768 KHz | 16.384 KHz |

<!-- Source EN PDF p.14, unit 89 -->

二进制翻转模式下，PPS 输出 `ptp_pps_o` 在上述频率下的占空比为 50%。

<!-- Source EN PDF p.14, unit 90 -->

数字翻转模式下，PPS 输出频率是平均值，实际时钟频率会变化，并每秒同步一次。例如：

<!-- Source EN PDF p.14, unit 91 -->

当 `PPSCTRL = 0001` 时，PPS（1 Hz）的低电平持续 537 毫秒，高电平持续 463 毫秒。

<!-- Source EN PDF p.14, unit 92 -->

当 `PPSCTRL = 0010` 时，PPS（2 Hz）的序列为：第一个时钟周期为 537 毫秒，占空比为 50%；第二个时钟周期为 463 毫秒，其中低电平 268 毫秒、高电平 195 毫秒。

<!-- Source EN PDF p.14, unit 93 -->

当 `PPSCTRL = 0011` 时，PPS（4 Hz）的序列为：前三个时钟周期均为 268 毫秒，占空比 50%；第四个时钟周期为 195 毫秒，其中低电平 134 毫秒、高电平 61 毫秒。

<!-- Source EN PDF p.14, unit 94 -->

因此，数字模式的 PPS 输出周期不均匀；如果需要均匀周期，应配置为二进制模式。

<!-- Source EN PDF p.14, unit 95 -->

注意：当 `PPSCTRL >= 1` 时，PPS 信号从低电平开始，也就是以下降沿对齐：

<!-- Source EN PDF p.14, unit 96 -->

![原文 PPS 下降沿对齐波形](/docs/rockchip-gmac-ptp1588/assets/en-p14-figure1.png)

*原文 PPS 下降沿对齐波形 — 英文 PDF, p.14.*

<!-- Source EN PDF p.15, unit 97 -->

### 3.3 灵活 PPS

<!-- Source EN PDF p.15, unit 98 -->

与按固定秒数输出脉冲的固定 PPS 相比，Flex PPS 可更灵活地配置起始时间、占空比、频率等。

<!-- Source EN PDF p.15, unit 99 -->

启用 PPS：

<!-- Source EN PDF p.15, unit 100 -->

```text
echo "0 0 0 1 1" > /sys/class/ptp/ptp0/period
```

<!-- Source EN PDF p.15, unit 101 -->

也可以设置 PPS 的起始时刻，例如 100s：

<!-- Source EN PDF p.15, unit 102 -->

```text
echo "0 100 0 1 1" > /sys/class/ptp/ptp0/period
```

<!-- Source EN PDF p.15, unit 103 -->

两设备完成时间同步后，再启动 PPS。

<!-- Source EN PDF p.15, unit 104 -->

在后台运行 ptp4l：

<!-- Source EN PDF p.15, unit 105 -->

```text
ptp4l -i eth0 -m -H &
ptp4l -i eth0 -m -H -s &
```

<!-- Source EN PDF p.15, unit 106 -->

约定在同一时刻启动 PPS，例如 200s，并分别在两台设备输入：

<!-- Source EN PDF p.15, unit 107 -->

```text
echo "0 200 0 1 1" > /sys/class/ptp/ptp0/period
```

<!-- Source EN PDF p.15, unit 108 -->

把两设备的 PPS 信号同时接入同一台示波器。当 GMAC 系统时间等于 200s 时，两路 PPS 同时开始输出。原文测得的两路抖动时间为百纳秒量级，与 ptp4l 测试数据一致；这是原文结果，并非 ArmSoM 实测。

<!-- Source EN PDF p.15, unit 109 -->

### 3.4 支持 PPS 的芯片

<!-- Source EN PDF p.15, unit 110 -->

原文说明：在支持 PTP1588 的芯片中，除 RK3568 和 RV1126 外，其他芯片当前均支持 PPS 功能。

<!-- Source EN PDF p.15, unit 111 -->

## 4. RT-Thread 下的 PTP1588 功能

<!-- Source EN PDF p.15, unit 112 -->

除 Linux 外，RT-Thread 也可支持 PTP1588 功能，例如 RK2118 使用 RT-Thread。

<!-- Source EN PDF p.16, unit 113 -->

## 5. 常见问题

<!-- Source EN PDF p.16, unit 114 -->

### 5.1 TX 超时

<!-- Source EN PDF p.16, unit 115 -->

部分版本的 ptp4l 可能出现 `timed out while polling for tx timestamp` 错误。可把 `ptp4l.conf` 中的 `tx_timestamp_timeout` 改为 `400`，再通过 `-f` 指定修改后的配置文件；也可直接使用以下命令参数：

<!-- Source EN PDF p.16, unit 116 -->

```text
--tx_timestamp_timeout=400
```

<!-- Source EN PDF p.16, unit 117 -->

### 5.2 4.19 内核不支持主模式

<!-- Source EN PDF p.16, unit 118 -->

应用以下原文补丁：

<!-- Source EN PDF p.16, unit 119 -->

```diff
diff --git a/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c b/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c
index 0511062a9e0d..1e6078a17511 100644
--- a/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c
+++ b/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c
@@ -644,7 +644,8 @@ static int stmmac_hwtstamp_set(struct net_device *dev, struct ifreq *ifr)
 			config.rx_filter = HWTSTAMP_FILTER_PTP_V2_EVENT;
 			ptp_v2 = PTP_TCR_TSVER2ENA;
 			snap_type_sel = PTP_TCR_SNAPTYPSEL_1;
-			ts_event_en = PTP_TCR_TSEVNTENA;
+			if (priv->synopsys_id < DWMAC_CORE_4_10)
+				ts_event_en = PTP_TCR_TSEVNTENA;
 			ptp_over_ipv4_udp = PTP_TCR_TSIPV4ENA;
 			ptp_over_ipv6_udp = PTP_TCR_TSIPV6ENA;
 			ptp_over_ethernet = PTP_TCR_TSIPENA;
```

{% endraw %}
