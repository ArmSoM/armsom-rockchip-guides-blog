---
title: "Rockchip CAN FD: DTS, SocketCAN, BRS and TDC Guide"
description: "Complete Rockchip CAN FD guide: RK3576 driver, device tree, SocketCAN FD commands, troubleshooting, bit timing and loop-delay TDC setup."
translation_key: "032-rockchip-can-fd"
slug: "032-rockchip-can-fd"
lang: "en"
date: "2026-10-15"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: ["Sige5", "CM5", "AIM5"]
tags: ["CAN FD", "SocketCAN", "RK3576", "BRS", "TDC"]
keywords: "ArmSoM Rockchip CAN FD RK3576 SocketCAN BRS TDC"
excerpt: "RK3576 CAN FD driver, DTS, SocketCAN, BRS and TDC reference from Rockchip CAN FD Developer Guide V1.3.0."
---

{% raw %}
# Rockchip CAN FD: DTS, SocketCAN, BRS and TDC Guide

This is a platform reference for the source-supported RK3576/RK3506/RV1126B family. On ArmSoM it may be relevant to Sige5, CM5 and AIM5 (RK3576), but that does not establish a board-level CAN FD interface. Confirm schematic, transceiver, pinmux, termination, clock and the released 6.1 BSP. No ArmSoM hardware test was performed.

Source baseline: *Rockchip CAN FD Developer Guide*, RK-KF-YF-162, V1.3.0, 2025-04-08. Chinese source has 9 pages and English source 11 pages because its revision history occupies a separate page; technical content is aligned. Both contain no independent technical figures. Cover/legal material, intended audience and revision history are omitted. [Editorial notes](/docs/rockchip-can-fd/EDITORIAL-NOTES.md).

## 1. CAN FD driver

### 1.1 Driver file and DTS

```text
drivers/net/can/rockchip/rk3576_canfd.c
```

```dts
interrupts = <GIC_SPI 121 IRQ_TYPE_LEVEL_HIGH>;
clocks = <&cru CLK_CAN0>, <&cru HCLK_CAN0>;
clock-names = "baudclk", "apb_pclk";
resets = <&cru SRST_CAN0>, <&cru SRST_H_CAN0>;
reset-names = "can", "can-apb";

&can0 {
    assigned-clocks = <&cru CLK_CAN0>;
    assigned-clock-rates = <200000000>;
    pinctrl-names = "default";
    pinctrl-0 = <&can0m0_pins>;
    status = "okay";
};
```

The interrupt follows conversion completion. Clock properties switch clocks and reset properties reset the bus. Configure CAN-H/CAN-L IOMUX for CAN function.

```dts
&can0 { rockchip,rx-max-data = <4>; };
&can0 { rockchip,auto-retx-cnt = <100>; };
&can0 {
    dmas = <&dmac0 20>;
    dma-names = "rx";
};
```

For classic CAN frames, `<4>` permits RX byte support of 8 and gives 64 RX FIFO entries. CAN FD frames can use `<18>` (RX byte support 64) and give 14 FIFO frames. When omitted, TX retries are unlimited; `1` to `0xffff` limits retries. RX DMA is optional; remove both DMA properties to disable it.

### 1.2 Kernel and test tools

```text
+CONFIG_CAN=y
+CONFIG_CANFD_RK3576=y
BR2_PACKAGE_CAN_UTILS=y
BR2_PACKAGE_IPROUTE2=y
```

`canutils` contains `canconfig`, `candump`, `canecho`, `cansend`, and `cansequence`; use full `iproute2`, not BusyBox `ip`.

### 1.3 Configure, send and receive

```sh
ifconfig -a
ip link set can0 down
ip link set can0 type can bitrate 1000000 dbitrate 3000000 fd on
ip -details link show can0
ip link set can0 up

# CAN FD standard and extended data frames
cansend can0 123##1DEADBEEF
cansend can0 00000123##1DEADBEEF
candump can0 &
```

The first rate is the arbitration segment (1 Mbit/s here); `dbitrate` is the data segment (3 Mbit/s here).

### 1.4 Common CAN/CAN FD commands

```sh
ip link set can0 down
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on
ip -details -statistics link show can0
ip link set can0 up
echo 4096 > /sys/class/net/can0/tx_queue_len
candump can0 &

# Classic CAN: extended, standard, remote-standard, remote-extended
cangen can0 -g 1 -e -I i -L i -D r
cangen can0 -g 1 -I i -L i -D r
cangen can0 -g 1 -R -I i -L i -D r
cangen can0 -g 1 -e -R -I i -L i -D r

# CAN FD without bitrate switching: extended then standard
cangen can0 -g 1 -e -f -I i -L i -D i
cangen can0 -g 1 -e -f -I r -L i -D r
cangen can0 -g 1 -f -I i -L i -D i
cangen can0 -g 1 -f -I r -L i -D r

# CAN FD BRS: extended then standard
cangen can0 -g 1 -e -f -b -I i -L i -D i
cangen can0 -g 1 -e -f -b -I r -L i -D r
cangen can0 -g 1 -f -b -I i -L i -D i
cangen can0 -g 1 -f -b -I r -L i -D r
```

## 2. Troubleshooting

### 2.1 Cannot send or receive

```sh
ip link set can0 down
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on loopback on
ip -details -statistics link show can0
ip link set can0 up
echo 4096 > /sys/class/net/can0/tx_queue_len
candump can0 &
```

If loopback allows `candump` to receive a sent frame, inspect IOMUX, wiring, 120-ohm termination and transceiver. For intermittent failures, use `ip -details -statistics link show can0` to verify actual rate and keep sample points consistent throughout the network.

## 3. Bit rate and sampling point

```c
/* Use CiA recommended sample points */
if (bt->sample_point) {
    sample_point_nominal = bt->sample_point;
} else {
    if (bt->bitrate > 800000)
        sample_point_nominal = 750;
    else if (bt->bitrate > 500000)
        sample_point_nominal = 800;
    else
        sample_point_nominal = 875;
}
```

```text
BitRate = clk_can / (2 *(brq + 1) / ((tseg2 + 1) + (tseg1 + 1) + 1)
Sample = (1 + (tseg1 + 1)) / (1 + (tseg1 + 1) + (tseg2 + 1))
```

`brq`, `tseg1`, and `tseg2` are in the target CAN `BITTIMING` register. Verify all field limits in the matching TRM/BSP.

## 4. Speed variation and TDC

The source warns that rates above 5 Mbit/s may become unstable. Measure loop delay before configuring TDC:

```sh
io -4 0x2ac00108 0x80
cansend 001#aaaaaaaa
io -4 0x2ac00110
```

The value read from `0x2ac00110` is the loop delay. Then configure TDC:

```sh
io -4 0x2ac00108 0x19
```

Set `tdc_offset` to half the measured loop delay and enable `tdc_enable`. Refer to the target TRM CANFD `RKCAN_FD_TDC` register, then implement the final value in `tdc` configuration in `rk3576_canfd_set_bittiming()`. Keep sampling points consistent on a variable-speed CAN FD network or BRS-bit reception can fail.

```sh
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on
```
{% endraw %}
