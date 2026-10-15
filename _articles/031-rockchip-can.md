---
title: "Rockchip CAN: Driver, Device Tree and SocketCAN Guide"
description: "Complete Rockchip CAN guide: driver selection, DTS properties, kernel configuration, SocketCAN commands, troubleshooting and bit-timing formulas."
translation_key: "031-rockchip-can"
slug: "031-rockchip-can"
lang: "en"
date: "2026-10-15"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["CAN", "SocketCAN", "Device Tree", "Rockchip", "RK3576"]
keywords: "ArmSoM Rockchip CAN SocketCAN RK3576 RK3588 device tree"
excerpt: "Driver, device tree, SocketCAN test and bit-timing reference from Rockchip CAN Developer Guide V1.3.0."
---

{% raw %}
# Rockchip CAN: Driver, Device Tree and SocketCAN Guide

This is a platform reference, not a claim that every ArmSoM board exposes a CAN connector or has a ready-to-use transceiver. Sige7/AIM7 use RK3588; Sige5/CM5/AIM5 use RK3576. Match the exact board schematic, pinmux, transceiver power/standby wiring and released BSP. The source lists kernel 5.10 for RK3588 and 6.1 for RK3576; it does not certify a particular ArmSoM image. No ArmSoM hardware test was performed.

Source baseline: *Rockchip CAN Developer Guide*, RK-KF-YF-C44, V1.3.0, 2025-10-09. The supplied Chinese and English files are both 9 pages and contain no independent technical figures; therefore no figures were extracted. Cover/legal material, intended audience and revision history are deliberately omitted. [Editorial notes](/docs/rockchip-can/EDITORIAL-NOTES.md).

## 1. CAN driver

### 1.1 Driver files

| SoC | Driver file |
| --- | --- |
| RV1126/RV1109 | `drivers/net/can/rockchip/rockchip_can.c` |
| RK3568/RK3588 | `drivers/net/can/rockchip/rk3568_can.c` |
| RK3562 | `drivers/net/can/rockchip/rk3562_can.c` |
| RK3576/RK3506/RV1126B | `drivers/net/can/rockchip/rk3576_can.c` |

### 1.2 DTS node configuration

```dts
interrupts = <GIC_SPI 100 IRQ_TYPE_LEVEL_HIGH>;

assigned-clocks = <&cru CLK_CAN>;
assigned-clock-rates = <200000000>;
clocks = <&cru CLK_CAN>, <&cru PCLK_CAN>;
clock-names = "baudclk", "apb_pclk";

&can {
    pinctrl-names = "default";
    pinctrl-0 = <&canm0_pins>;
    status = "okay";
};
```

The interrupt is generated when conversion completes. The source recommends a 300 MHz CAN clock for a 1 Mbit/s rate for better signal stability; 200 MHz is sufficient below 1 Mbit/s. Choose an even multiple of the target rate where possible so the rate can be divided accurately.

Compatibility strings are `"rockchip,can-1.0"` for RV1126/RV1109, `"rockchip,rk3568-can-2.0"` for RK3568, `"rockchip,can-2.0"` for RK3588, `"rockchip,rk3562-can"` for RK3562, `"rockchip,rk3576-can"` for RK3576/RK3506, and `"rockchip,rv1126b-can"` for RV1126B.

```dts
&can0 { rockchip,rx-max-data = <4>; };
&can0 { rockchip,auto-retx-cnt = <100>; };
&can0 {
    dmas = <&dmac0 20>;
    dma-names = "rx";
};
```

`rx-max-data = <4>` is appropriate for classic CAN (the RX byte field supports 8), yielding an RX FIFO depth of 64. For CAN FD frames, the source uses 18 (RX byte supports 64), yielding 14 FIFO frames. `auto-retx-cnt` defaults to unlimited retry when omitted; `1` through `0xffff` stops retry at the configured threshold. RX DMA is optional: remove the DMA properties to avoid it. RV1126B supports DMA. Configure the CAN-H/CAN-L IOMUX to CAN function.

### 1.3 Kernel configuration

Enable the Rockchip CAN controller from **Networking support → CAN bus subsystem support → CAN Device Drivers → Platform CAN drivers with Netlink support**. The source gives:

```text
CONFIG_CAN_RK3562=y
CONFIG_CAN_RK3576=y
```

The relevant Kconfig dependencies are `NET=y && CAN=y && CAN_DEV=y && ARCH_ROCKCHIP=y`.

## 2. CAN communication test tools

`canutils` provides `canconfig` (interface rate/mode), `candump` (receive/print hexadecimal frames), `canecho` (retransmit received frames), `cansend` (send a frame), and `cansequence` (send/check incrementing values). Use the full `iproute2` `ip` utility: BusyBox `ip` does not support CAN operations. For Buildroot, enable:

```text
BR2_PACKAGE_CAN_UTILS=y
BR2_PACKAGE_IPROUTE2=y
```

## 3. Common command interface

```sh
# List devices
ifconfig -a

# Stop, configure 500 kbit/s, inspect, then start
ip link set can0 down
ip link set can0 type can bitrate 500000
ip -details -statistics link show can0
ip link set can0 up

# Standard data / remote frames
cansend can0 123#DEADBEEF
cansend can0 123#R

# Extended data / remote frames
cansend can0 00000123#12345678
cansend can0 00000123#R

# Receive
candump can0
```

## 4. Troubleshooting

### 4.1 Cannot send or receive

Enable controller loopback after starting CAN; use the actual DTS CAN base address.

```sh
io -4 0xfe580000 0x8415
```

If `candump` receives a subsequent `cansend` frame in loopback, the controller is working. Then inspect IOMUX, physical wiring, the 120-ohm termination resistor, and the transceiver.

### 4.2 Intermittent failure

Verify the actual calculated rate, then adjust the input clock if it is inaccurate:

```sh
ip -details -statistics link show can0
```

Keep sample points consistent across the same CAN network to improve stability.

## 5. Bit rate and sampling-point calculation

The driver calculates values from input clock and requested rate. The CiA recommendation used by the source is:

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

Find `brq`, `tseg1`, and `tseg2` in the CAN `BITTIMING` register in the target SoC TRM. Confirm formulas and register field widths against the matching kernel and TRM before modifying a BSP.
{% endraw %}
