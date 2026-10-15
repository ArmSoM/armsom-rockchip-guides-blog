---
title: "Rockchip CAN：驱动、设备树与 SocketCAN 完整指南"
description: "完整的 Rockchip CAN 参考：驱动选择、DTS 属性、内核配置、SocketCAN 命令、故障排查和位时序公式。"
translation_key: "031-rockchip-can"
slug: "031-rockchip-can"
lang: "zh"
date: "2026-10-15"
author: "ArmSoM 编辑部 · Rockchip 源文档"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["CAN", "SocketCAN", "设备树", "Rockchip", "RK3576"]
keywords: "ArmSoM Rockchip CAN SocketCAN RK3576 RK3588 设备树"
excerpt: "依据 Rockchip CAN 开发文档 V1.3.0 整理的驱动、设备树、SocketCAN 测试和位时序参考。"
---

{% raw %}
# Rockchip CAN：驱动、设备树与 SocketCAN 完整指南

本文是平台参考，不表示每块 ArmSoM 板卡都引出 CAN 接口或已配备可用的收发器。Sige7/AIM7 使用 RK3588，Sige5/CM5/AIM5 使用 RK3576；请以实际原理图、引脚复用、收发器电源/待机线和已发布 BSP 为准。源文档列出 RK3588 的内核为 5.10、RK3576 为 6.1，未认证某个特定 ArmSoM 镜像。本文没有进行 ArmSoM 硬件实测。

技术基准为《Rockchip CAN 开发文档》RK-KF-YF-C44，V1.3.0，2025-10-09。提供的中英文文件均为 9 页，且没有独立技术图片，因此没有图片可提取。已按要求移除封面/法律声明、读者对象和修订记录。[校对记录](/docs/rockchip-can/EDITORIAL-NOTES.md)。

## 1. CAN 驱动

### 1.1 驱动文件

| SoC | 驱动文件 |
| --- | --- |
| RV1126/RV1109 | `drivers/net/can/rockchip/rockchip_can.c` |
| RK3568/RK3588 | `drivers/net/can/rockchip/rk3568_can.c` |
| RK3562 | `drivers/net/can/rockchip/rk3562_can.c` |
| RK3576/RK3506/RV1126B | `drivers/net/can/rockchip/rk3576_can.c` |

### 1.2 DTS 节点配置

```dts
interrupts = <GIC_SPI 100 IRQ_TYPE_LEVEL_HIGH>;
assigned-clocks = <&cru CLK_CAN>;
assigned-clock-rates = <200000000>;
clocks = <&cru CLK_CAN>, <&cru PCLK_CAN>;
clock-names = "baudclk", "apb_pclk";
&can { pinctrl-names = "default"; pinctrl-0 = <&canm0_pins>; status = "okay"; };
```

转换完成会产生中断。源文档建议 1 Mbit/s 时将 CAN 时钟设为 300 MHz 以提高稳定性；低于 1 Mbit/s 时 200 MHz 即可。尽量选择目标速率的偶数倍以得到精确分频。兼容字符串依次为：RV1126/RV1109 的 `"rockchip,can-1.0"`，RK3568 的 `"rockchip,rk3568-can-2.0"`，RK3588 的 `"rockchip,can-2.0"`，RK3562 的 `"rockchip,rk3562-can"`，RK3576/RK3506 的 `"rockchip,rk3576-can"`，RV1126B 的 `"rockchip,rv1126b-can"`。

```dts
&can0 { rockchip,rx-max-data = <4>; };
&can0 { rockchip,auto-retx-cnt = <100>; };
&can0 { dmas = <&dmac0 20>; dma-names = "rx"; };
```

经典 CAN 可使用 `<4>`（RX byte 支持 8，RX FIFO 深度 64）；CAN FD 帧可使用 `<18>`（RX byte 支持 64，FIFO 深度 14）。省略 `auto-retx-cnt` 时无限重发；`1` 至 `0xffff` 在到达阈值后停止。RX DMA 是可选项，删除两项 DMA 属性即可禁用；RV1126B 支持 DMA。CAN-H/CAN-L IOMUX 必须配置为 CAN 功能。

### 1.3 内核配置

在 **Networking support → CAN bus subsystem support → CAN Device Drivers → Platform CAN drivers with Netlink support** 中启用驱动：

```text
CONFIG_CAN_RK3562=y
CONFIG_CAN_RK3576=y
```

依赖项是 `NET=y && CAN=y && CAN_DEV=y && ARCH_ROCKCHIP=y`。

## 2. 通信测试工具

`canutils` 包含 `canconfig`（接口参数）、`candump`（接收/十六进制输出）、`canecho`（回发接收数据）、`cansend`（发送）和 `cansequence`（递增数据收发校验）。必须使用完整的 `iproute2` `ip`，BusyBox 的 `ip` 不支持 CAN。Buildroot 启用：

```text
BR2_PACKAGE_CAN_UTILS=y
BR2_PACKAGE_IPROUTE2=y
```

## 3. 常用命令接口

```sh
ifconfig -a
ip link set can0 down
ip link set can0 type can bitrate 500000
ip -details -statistics link show can0
ip link set can0 up
cansend can0 123#DEADBEEF
cansend can0 123#R
cansend can0 00000123#12345678
cansend can0 00000123#R
candump can0
```

以上依次包括：枚举设备；停止、配置 500 kbit/s、查看并启动；发送标准数据帧、标准远程帧、扩展数据帧、扩展远程帧；接收。

## 4. 常见问题排查

### 4.1 无法收发

启动 CAN 后，按实际 DTS 中启用的 CAN 基地址进行回环测试：

```sh
io -4 0xfe580000 0x8415
```

回环下 `cansend` 后 `candump` 能接收，说明控制器正常；随后检查 IOMUX、硬件连接、120 欧姆终端电阻和收发器。

### 4.2 概率性不能收发

```sh
ip -details -statistics link show can0
```

检查实际位速率是否精确，必要时调整输入时钟；同一网络的采样点应保持一致。

## 5. 位速率和采样点计算

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

`brq`、`tseg1`、`tseg2` 位于 CAN TRM 的 `BITTIMING` 寄存器。修改 BSP 前，请以目标 SoC TRM 和对应内核确认公式及字段范围。
{% endraw %}
