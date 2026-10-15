---
title: "Rockchip CAN FD：DTS、SocketCAN、BRS 与 TDC 指南"
description: "完整的 Rockchip CAN FD 参考：RK3576 驱动、设备树、SocketCAN FD、故障排查、位时序和环路延迟 TDC 设置。"
translation_key: "032-rockchip-can-fd"
slug: "032-rockchip-can-fd"
lang: "zh"
date: "2026-10-15"
author: "ArmSoM 编辑部 · Rockchip 源文档"
category: "linux"
products: ["Sige5", "CM5", "AIM5"]
tags: ["CAN FD", "SocketCAN", "RK3576", "BRS", "TDC"]
keywords: "ArmSoM Rockchip CAN FD RK3576 SocketCAN BRS TDC"
excerpt: "依据 Rockchip CAN FD 开发文档 V1.3.0 整理的 RK3576 CAN FD 驱动、DTS、SocketCAN、BRS 与 TDC 参考。"
---

{% raw %}
# Rockchip CAN FD：DTS、SocketCAN、BRS 与 TDC 指南

本文是源文档支持的 RK3576/RK3506/RV1126B 平台参考。对 ArmSoM 而言可能适用于 Sige5、CM5、AIM5（RK3576），但不表示板级 CAN FD 已引出或可用。请核对原理图、收发器、引脚复用、终端、时钟和已发布 6.1 BSP；本文未进行 ArmSoM 硬件实测。

技术基准为《Rockchip CAN FD 开发文档》RK-KF-YF-162，V1.3.0，2025-04-08。中文源为 9 页，英文源为 11 页，差异仅为英文将修订记录单列一页；技术章节对应。两份源均没有独立技术图片。已移除封面/法律声明、读者对象和修订记录。[校对记录](/docs/rockchip-can-fd/EDITORIAL-NOTES.md)。

## 1. CAN FD 驱动

### 1.1 驱动文件与 DTS

```text
drivers/net/can/rockchip/rk3576_canfd.c
```

```dts
interrupts = <GIC_SPI 121 IRQ_TYPE_LEVEL_HIGH>;
clocks = <&cru CLK_CAN0>, <&cru HCLK_CAN0>;
clock-names = "baudclk", "apb_pclk";
resets = <&cru SRST_CAN0>, <&cru SRST_H_CAN0>;
reset-names = "can", "can-apb";
&can0 { assigned-clocks = <&cru CLK_CAN0>; assigned-clock-rates = <200000000>; pinctrl-names = "default"; pinctrl-0 = <&can0m0_pins>; status = "okay"; };
```

转换完成产生中断；时钟属性用于驱动时钟开关，reset 属性用于每次复位总线。CAN-H/CAN-L IOMUX 配置为 CAN 功能。

```dts
&can0 { rockchip,rx-max-data = <4>; };
&can0 { rockchip,auto-retx-cnt = <100>; };
&can0 { dmas = <&dmac0 20>; dma-names = "rx"; };
```

经典 CAN 用 `<4>` 时 RX byte 支持 8、RX FIFO 为 64；CAN FD 用 `<18>` 时 RX byte 支持 64、FIFO 为 14 帧。未配置时 TX 无限重试，`1` 到 `0xffff` 限制重试次数。RX DMA 可选，删除两项 DMA 属性即可关闭。

### 1.2 内核与测试工具

```text
+CONFIG_CAN=y
+CONFIG_CANFD_RK3576=y
BR2_PACKAGE_CAN_UTILS=y
BR2_PACKAGE_IPROUTE2=y
```

`canutils` 含 `canconfig`、`candump`、`canecho`、`cansend`、`cansequence`。必须使用完整 `iproute2`，不要使用 BusyBox `ip`。

### 1.3 配置、发送与接收

```sh
ifconfig -a
ip link set can0 down
ip link set can0 type can bitrate 1000000 dbitrate 3000000 fd on
ip -details link show can0
ip link set can0 up
cansend can0 123##1DEADBEEF
cansend can0 00000123##1DEADBEEF
candump can0 &
```

`bitrate` 是仲裁段（示例 1 Mbit/s），`dbitrate` 是数据段（示例 3 Mbit/s）。

### 1.4 常用 CAN/CAN FD 命令

```sh
ip link set can0 down
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on
ip -details -statistics link show can0
ip link set can0 up
echo 4096 > /sys/class/net/can0/tx_queue_len
candump can0 &
cangen can0 -g 1 -e -I i -L i -D r
cangen can0 -g 1 -I i -L i -D r
cangen can0 -g 1 -R -I i -L i -D r
cangen can0 -g 1 -e -R -I i -L i -D r
cangen can0 -g 1 -e -f -I i -L i -D i
cangen can0 -g 1 -e -f -I r -L i -D r
cangen can0 -g 1 -f -I i -L i -D i
cangen can0 -g 1 -f -I r -L i -D r
cangen can0 -g 1 -e -f -b -I i -L i -D i
cangen can0 -g 1 -e -f -b -I r -L i -D r
cangen can0 -g 1 -f -b -I i -L i -D i
cangen can0 -g 1 -f -b -I r -L i -D r
```

以上依次包含经典 CAN 的扩展/标准/远程帧，CAN FD 无 BRS 的扩展与标准帧，以及 CAN FD BRS 的扩展与标准帧。

## 2. 故障排查

```sh
ip link set can0 down
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on loopback on
ip -details -statistics link show can0
ip link set can0 up
echo 4096 > /sys/class/net/can0/tx_queue_len
candump can0 &
```

回环下能收发说明控制器正常，再检查 IOMUX、硬件连接、120 欧姆终端和收发器。概率性异常时使用 `ip -details -statistics link show can0` 检查实际位速率，并使全网采样点一致。

## 3. 位速率和采样点

```c
/* Use CiA recommended sample points */
if (bt->sample_point) sample_point_nominal = bt->sample_point;
else if (bt->bitrate > 800000) sample_point_nominal = 750;
else if (bt->bitrate > 500000) sample_point_nominal = 800;
else sample_point_nominal = 875;
```

```text
BitRate = clk_can / (2 *(brq + 1) / ((tseg2 + 1) + (tseg1 + 1) + 1)
Sample = (1 + (tseg1 + 1)) / (1 + (tseg1 + 1) + (tseg2 + 1))
```

`brq`、`tseg1`、`tseg2` 见目标 CAN `BITTIMING` 寄存器，必须结合目标 TRM/BSP 确认字段限制。

## 4. 变速与 TDC

高于 5 Mbit/s 时可能不稳定，先测环路延迟：

```sh
io -4 0x2ac00108 0x80
cansend 001#aaaaaaaa
io -4 0x2ac00110
```

`0x2ac00110` 的读回值即环路延迟。随后：

```sh
io -4 0x2ac00108 0x19
```

令 `tdc_offset` 为延迟的一半并启用 `tdc_enable`，查阅目标 TRM CANFD `RKCAN_FD_TDC` 寄存器，最终将值写入 `rk3576_canfd_set_bittiming()` 的 `tdc` 配置。变速 CAN FD 网络的采样点必须一致，否则可能发生 BRS 位接收异常。

```sh
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on
```
{% endraw %}
