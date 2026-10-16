---
title: "Rockchip BT.656 / BT.1120 TX：时序、引脚映射与 Linux 显示配置"
description: "完整覆盖逐行与隔行时序、EAV/SAV、平台支持、硬件连接、DTS 和 DRM 驱动配置，以及全部 12 项常见问题。"
translation_key: "039-rockchip-bt656-bt1120"
slug: "039-rockchip-bt656-bt1120"
lang: "zh"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Rockchip", "BT.656", "BT.1120", "DRM", "display"]
keywords: "ArmSoM Rockchip BT656 BT1120 TX DTS Linux DRM RK3588 RK3576"
excerpt: "完整覆盖逐行与隔行时序、EAV/SAV、平台支持、硬件连接、DTS 和 DRM 驱动配置，以及全部 12 项常见问题。"
---

# Rockchip BT.656 / BT.1120 TX：时序、引脚映射与 Linux 显示配置

本文完整整理《Rockchip BT.656 TX 和 BT.1120 TX 开发指南》V2.2.0（RK-YH-YF-178）。仅提供中文 PDF，英文和俄文均由中文完整翻译；全部 6 张技术原图来自中文 PDF，图中原有英文并不表示另有英文 PDF。表格恢复为可编辑文本，图片中的表格也保留原图并提供可复制数据。

这是 Rockchip BSP 平台参考，不是所有 ArmSoM 板卡均支持的承诺。原文产品版本表如下；RK3576 出现在功能表和硬件章节，却未列入此内核版本表，不能据此补填内核版本。ArmSoM [Sige5](https://docs.armsom.org/armsom-sige5)（RK3576）和 [Sige7](https://docs.armsom.org/armsom-sige7)（RK3588）仅可在核对实际引脚引出、载板、电源、接收端、SDK/BSP 和内核驱动后参考使用。尚未在 ArmSoM 硬件上验证。所有示例是原文示例。

| 芯片名称 | 内核版本 |
|---|---|
| RV1109/RV1126 | Linux kernel 4.19 及以上内核 |
| RV1103/RV1106 | Linux kernel 5.10 及以上内核 |
| RK356X | Linux kernel 4.19 及以上内核 |
| RK3588 | Linux kernel 5.10 及以上内核 |
| RK3562 | Linux kernel 5.10 及以上内核 |
| RK3506 | Linux kernel 6.1 及以上内核 |
| RV1126B | Linux kernel 6.1 及以上内核 |

## 1. 基础概念

BT.656、BT.1120 分别定义 SDTV、HDTV 接口协议，在消隐期传输 EAV、SAV 定位基准码作为嵌入式同步信号，数据格式为 YCbCr 4:2:2。它们也可能被称作视频信号或 YUV 信号。原文所述 RK 平台的图像数据和定位基准码位深均为 8 bit。详细协议请参考《Rec. ITU-R BT.1120》和《Rec. ITU-R BT.656》。

### 1.1 P 制逐行扫描时序

![逐行扫描：一帧内的有效视频、消隐区及 EAV/SAV 位置](/docs/rockchip-bt656-bt1120/assets/cn-p04-figure1.png)

### 1.2 I 制隔行扫描时序

![隔行扫描：两场的有效视频、消隐区及定位码](/docs/rockchip-bt656-bt1120/assets/cn-p05-figure1.png)

### 1.3 定位基准码

前三个 word 固定为 `0xFF, 0x00, 0x00`，第四个 word 取决于扫描位置。Bit9 固定为 1；Bit8(F) 中 F=0 表示偶场、F=1 表示奇场；Bit7(V) 中 V=0 表示该行含有效视频、V=1 表示无有效视频；Bit6(H) 中 H=0 表示 SAV、H=1 表示 EAV。Bit[5,2]（P3,P2,P1,P0）根据 F/V/H 计算。Bit[1,0] 固定为 0；RK 平台为 8 bit，可视为没有最后两位。

```text
Bit5 = V XOR H
Bit4 = F XOR H
Bit3 = F XOR V
Bit2 = F XOR V XOR H
```

![定位码的位分配与逐行、隔行模式定义](/docs/rockchip-bt656-bt1120/assets/cn-p06-figure1.png)

| 字 | 9 (MSB) | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 (LSB) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 4 | 1 | F | V | H | P3 | P2 | P1 | P0 | 0 | 0 |

原图补充：隔行/分段帧系统第 2 场/段 F=1，第 1 场/段 F=0；场/段消隐时 V=1，其它位置 V=0。逐行系统 F=0，帧消隐时 V=1，其它位置 V=0。两者均为 EAV 时 H=1、SAV 时 H=0。各 (F,V,H) 对应的保护位如下。

![SAV/EAV 的保护位表](/docs/rockchip-bt656-bt1120/assets/cn-p07-figure1.png)

| Bit9 | F | V | H | P3 | P2 | P1 | P0 | Bit1 | Bit0 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 0 | 1 | 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 0 |

结合这些定义，各消隐期的定位基准码如下：

| EAV | CODE | SAV | CODE |
|---|---|---|---|
| 1 | 0XFF 0X00 0X00 0X9D | 0 | 0XFF 0X00 0X00 0X80 |
| 3 | 0XFF 0X00 0X00 0XB6 | 2 | 0XFF 0X00 0X00 0XAB |
| 5 | 0XFF 0X00 0X00 0XDA | 4 | 0XFF 0X00 0X00 0XC7 |
| 7 | 0XFF 0X00 0X00 0XF1 | 6 | 0XFF 0X00 0X00 0XEC |

## 2. RK 平台支持情况

| SOC 平台 | 是否支持 BT.656 | 是否支持 BT.1120 | 隔行或者逐行 |
|---|---|---|---|
| RV1109/RV1126 | N | Y | 只支持逐行扫描 |
| RV1103 | Y | N | 支持逐行和隔行扫描 |
| RV1106 | Y | Y | 支持逐行和隔行扫描 |
| RK3566/RK3568 | Y | Y | 支持逐行和隔行扫描 |
| RK3588 | Y | Y | 支持逐行和隔行扫描 |
| RK3562 | Y | Y | 支持逐行和隔行扫描 |
| RK3576 | Y | Y | 支持逐行和隔行扫描 |
| RK3506 | Y | Y | 支持逐行和隔行扫描 |
| RV1126B | Y | Y | 支持逐行和隔行扫描 |

## 3. 硬件连接

### 3.1 RV1109/RV1126/RV1103/RV1106/RK3566/RK3568/RK3588

支持以下三种连接方式。根据硬件连接，在 DTS 或转换芯片驱动中设置对应 `bus_format`。

![BT.656 与两种 BT.1120 硬件连接和 bus_format](/docs/rockchip-bt656-bt1120/assets/cn-p08-figure1.png)

| 接口 | 时钟 | D15 | D14 | D13 | D12 | D11 | D10 | D9 | D8 | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | bus_format |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BT.656 | 时钟 | - | - | - | - | - | - | - | - | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | MEDIA_BUS_FMT_UYVY8_2X8 |
| BT.1120 (1) | 时钟 | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | MEDIA_BUS_FMT_YUYV8_1X16 |
| BT.1120 (2) | 时钟 | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | MEDIA_BUS_FMT_UYVY8_1X16 |

### 3.2 RK3562/RK3576/RK3506/RV1126B

BT.656 同时向 m0 和 m1 两组引脚输出图像数据，可按应用需求配置单显或双屏同显。

| 组件名称 | 引脚名称 | BT1120 | BT656 |
|---|---|---|---|
| 总线格式 | × | MEDIA_BUS_FMT_YUYV8_1X16/ MEDIA_BUS_FMT_UYVY8_1x16 | MEDIA_BUS_FMT_UYVY8_2X8 |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) |
| R7_D23 | VO_LCDC_D23 | √ | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | × | × |
| R1_D17 | VO_LCDC_D17 | × | × |
| R0_D16 | VO_LCDC_D16 | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | × | × |
| G0_D8 | VO_LCDC_D8 | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | × | × |
| B1_D1 | VO_LCDC_D1 | × | × |
| B0_D0 | VO_LCDC_D0 | × | × |

### 3.3 RV1126B-P

为兼容早期 RV1126 硬件连接，RV1126B-P 引入 data map，可选择不同引脚输出数据。完整定义位于 `include/dt-bindings/display/rockchip_vop.h`：

```text
 /* { 8'd0, BT1120[15:0] } */
 #define ROCKCHIP_BT1120_DATA_MAP_DATA_PADLO 0
 /* { BT1120[15:0], 8'd0 }*/

 #define ROCKCHIP_BT1120_DATA_MAP_DATA_PADHI 1
 /*
  * { BT1120[15:11], 3'd0, BT1120[10:5], 2'd0, BT1120[4:0], 3'b0 }
  * That is:
  *   LCDC_D23 -> BT1120_D15
  *   LCDC_D22 -> BT1120_D14
  *   LCDC_D21 -> BT1120_D13
  *   LCDC_D20 -> BT1120_D12
  *   LCDC_D19 -> BT1120_D11
  *   LCDC_D18 -> N/A
  *   LCDC_D17 -> N/A
  *   LCDC_D16 -> N/A

  *   LCDC_D15 -> BT1120_D10
  *   LCDC_D14 -> BT1120_D9
  *   LCDC_D13 -> BT1120_D8
  *   LCDC_D12 -> BT1120_D7
  *   LCDC_D11 -> BT1120_D6
  *   LCDC_D10 -> BT1120_D5
  *   LCDC_D9 -> N/A
  *   LCDC_D8 -> N/A
  *   LCDC_D7 -> BT1120_D4
  *   LCDC_D6 -> BT1120_D3
  *   LCDC_D5 -> BT1120_D2
  *   LCDC_D4 -> BT1120_D1
  *   LCDC_D3 -> BT1120_D0

  *   LCDC_D2 -> N/A
  *   LCDC_D1 -> N/A
  *   LCDC_D0 -> N/A
  */
 #define ROCKCHIP_BT1120_DATA_MAP_DATA_WITH_DUMMY_0 3
 /* { 16'd0, BT656[7:0] }*/
 #define ROCKCHIP_BT656_DATA_MAP_PADLO 0
 /* { 8'd0, BT656[7:0], 8'd0 }*/
 #define ROCKCHIP_BT656_DATA_MAP_DUMMY_HI_LO 1
 /* { BT656[7:0], 16'd0 }*/
 #define ROCKCHIP_BT656_DATA_MAP_PADHI 2
 /*

  * { BT656[7:3], 3'd0, BT656[2:0], BT656[7:5], 2'd0, BT656[4:0], 3'd0 }
  * That is:
  *   LCDC_D23 -> BT656_D7_M1
  *   LCDC_D22 -> BT656_D6_M1
  *   LCDC_D21 -> BT656_D5_M1
  *   LCDC_D20 -> BT656_D4_M1
  *   LCDC_D19 -> BT656_D3_M1
  *   LCDC_D18 -> N/A
  *   LCDC_D17 -> N/A
  *   LCDC_D16 -> N/A
  *   LCDC_D15 -> BT656_D2_M1
  *   LCDC_D14 -> BT656_D1_M1
  *   LCDC_D13 -> BT656_D0_M1
  *   LCDC_D12 -> BT656_D7_M0
  *   LCDC_D11 -> BT656_D6_M0
  *   LCDC_D10 -> BT656_D5_M0

  *   LCDC_D9 -> N/A
  *   LCDC_D8 -> N/A
  *   LCDC_D7 -> BT656_D4_M0
  *   LCDC_D6 -> BT656_D3_M0
  *   LCDC_D5 -> BT656_D2_M0
  *   LCDC_D4 -> BT656_D1_M0
  *   LCDC_D3 -> BT656_D0_M0
  *   LCDC_D2 -> N/A
  *   LCDC_D1 -> N/A
  *   LCDC_D0 -> N/A
  */
 #define ROCKCHIP_BT656_DATA_MAP_DATA_WITH_DUMMY_0 3
```

RV1126B 默认连接分别对应 `ROCKCHIP_BT1120_DATA_MAP_DATA_WITH_DUMMY_0` 和 `ROCKCHIP_BT656_DATA_MAP_DATA_WITH_DUMMY_0`，如下表。

| 组件名称 | 引脚名称 | BT1120 | BT656 |
|---|---|---|---|
| 总线格式 | × | MEDIA_BUS_FMT_YUYV8_1X16/ MEDIA_BUS_FMT_UYVY8_1x16 | MEDIA_BUS_FMT_UYVY8_2X8 |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) |
| R7_D23 | VO_LCDC_D23 | √ | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | × | × |
| R1_D17 | VO_LCDC_D17 | × | × |
| R0_D16 | VO_LCDC_D16 | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | × | × |
| G0_D8 | VO_LCDC_D8 | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | × | × |
| B1_D1 | VO_LCDC_D1 | × | × |
| B0_D0 | VO_LCDC_D0 | × | × |

RV1126B-P 为保持与早期 RV1126 一致，BT.1120 默认使用 `ROCKCHIP_BT1120_DATA_MAP_DATA_PADLO`，BT.656 默认使用 `ROCKCHIP_BT656_DATA_MAP_PADLO`，连接如下。

![RV1126B-P 默认连接方式](/docs/rockchip-bt656-bt1120/assets/cn-p12-figure1.png)

| 接口 | 时钟 | D15 | D14 | D13 | D12 | D11 | D10 | D9 | D8 | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | bus_format |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BT.656 | 时钟 | - | - | - | - | - | - | - | - | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | MEDIA_BUS_FMT_UYVY8_2X8 |
| BT.1120 (1) | 时钟 | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | MEDIA_BUS_FMT_YUYV8_1X16 |
| BT.1120 (2) | 时钟 | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | MEDIA_BUS_FMT_UYVY8_1X16 |

通常两款平台的默认连接已经定义，无需额外设置；确需修改时可在 DTS 设置。下面示例让 RV1126B 使用早期 RV1126 连接方式，RV1126B-P 默认已经如此配置。

```text
 &rgb {
    /*
    * RV1126 compatible pin output mode 0.

    *
    * BT1120: ROCKCHIP_BT1120_DATA_MAP_DATA_PADLO
    * BT656: ROCKCHIP_BT656_DATA_MAP_PADLO
    */
    rockchip,data-map-mode = <0>;
 };
```

## 4. 软件配置

### 4.1 打开 BT.656/BT.1120

(1) 接收设备在发送端不需要软件驱动，即无需注册 DRM connector 时，在 DTS 的 panel 节点中配置：

```text
 panel {
    ……

    bus-format = MEDIA_BUS_FMT_YUYV8_1X16; //or
 MEDIA_BUS_FMT_YUYV8_1X16/MEDIA_BUS_FMT_UYVY8_1X16
    ……
 }
```

(2) 需要发送端软件驱动，即需要注册 DRM connector 时，既可参考上述 DTS 配置，也可在 connector 驱动的 `drm_connector_helper_funcs -> get_modes` 中设置。参考 `drivers/gpu/drm/bridge/sii902x.c`：

```text
 static int sii902x_get_modes(struct drm_connector *connector)
 {
    u32 bus_format = MEDIA_BUS_FMT_YUYV8_1X16;//depend on hardware

    ……
    drm_display_info_set_bus_formats(&connector->display_info, &bus_format, 1);
    ……
 }
```

按以上任一方法配置 `bus_format` 后，VOP 驱动使能 BT.656/BT.1120，并配置相应引脚映射。

### 4.2 时序配置

时序有三种配置方式。第一种是在 DTS 中配置：对于固定分辨率产品，在 DTS panel 节点中设置时序。逐行示例：

```text
 timing_1080p: timing-1080p {
    clock-frequency = <148500000>;

    hactive = <1920>;
    vactive = <1080>;
    hback-porch = <100>;
    hfront-porch = <200>;
    vback-porch = <10>;
    vfront-porch = <10>;
    hsync-len = <20>;
    vsync-len = <20>;
    hsync-active = <0>;
    vsync-active = <0>;
    de-active = <0>;
    pixelclk-active = <0>;
 };
```

隔行示例：

```text
 timing_ntsc: timing-ntsc {
    clock-frequency = <13500000>;
    hactive = <720>;

    vactive = <480>;
    hback-porch = <43>;
    hfront-porch = <33>;
    vback-porch = <36>;
    vfront-porch = <3>;
    hsync-len = <62>;
    vsync-len = <6>;
    hsync-active = <0>;
    vsync-active = <0>;
    de-active = <0>;
    pixelclk-active = <0>;
    interlaced;

    doubleclk; //only NTSC(480i60) mode and PAL(576i50) mode need this property
 };
```

第二种是读取 EDID：显示设备支持多个分辨率且提供 EDID 时，可参考 sii902x 驱动，通过 DDC/I2C 读取 EDID 得到支持的分辨率。

```text
 //dts
 &i2c3 {
    clock-frequency = <400000>;
    status = "okay";

    sii9022: sii9022@39 {
       compatible = "sil,sii9022";
       reg = <0x39>;
       pinctrl-names = "default";
       ……
       ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
            reg = <0>;
            sii9022_in_rgb: endpoint {
               remote-endpoint = <&rgb_out_sii9022>;

            };
          };
       };
    };
 };

 &rgb {
    status = "okay";
    ……
    ports {
       port@1 {
          reg = <1>;
          #address-cells = <1>;

          #size-cells = <0>;

          rgb_out_sii9022: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&sii9022_in_rgb>;
          };
       };
    };
 };

 //drivers/gpu/drm/bridge/sii902x.c
 static int sii902x_probe(struct i2c_client *client, const struct i2c_device_id *id)

 {
    ……
    i2c_set_clientdata(client, sii902x);
    sii902x->i2cmux =
    i2c_mux_alloc(client->adapter, dev, 1, 0, I2C_MUX_GATE, sii902x_i2c_bypass_select,
 sii902x_i2c_bypass_deselect);
    if (!sii902x->i2cmux)
       return -ENOMEM;
    sii902x->i2cmux->priv = sii902x;
    return i2c_mux_add_adapter(sii902x->i2cmux, 0, 0, 0);
    ……
 }
 static int sii902x_get_modes(struct drm_connector *connector)
 {
    struct sii902x *sii902x = connector_to_sii902x(connector);


    edid = drm_get_edid(connector, sii902x->i2cmux->adapter[0]);
    drm_connector_update_edid_property(connector, edid);
    if (edid) {
       if (drm_detect_hdmi_monitor(edid))
          output_mode = SII902X_SYS_CTRL_OUTPUT_HDMI;
       num = drm_add_edid_modes(connector, edid);
       kfree(edid);
    }
 }
```

第三种是在 connector 驱动中预设分辨率：用于调试便利，或无 I2C/DDC 通道却需多个分辨率的情况，可参考 sii902x.c：

```text
 static int sii902x_get_modes(struct drm_connector *connector)
 {

    struct sii902x *sii902x = connector_to_sii902x(connector);

    ……
    for (i = 0; i < ARRAY_SIZE(sii902x_default_modes); i++) {
       const struct drm_display_mode *ptr = &sii902x_default_modes[i];

       mode = drm_mode_duplicate(connector->dev, ptr);
       if (mode) {
          if (!i)
            mode->type = DRM_MODE_TYPE_PREFERRED;
          drm_mode_probed_add(connector, mode);
          ret++;
       }

    }
    ……
 }
```

## 5. 常见问题

### 5.1 Full range 还是 Limited range？

输出为 Limited range，有效图像数据为 `[16, 235]`；只有定位基准码才可能出现 `0xFF, 0x00`。

### 5.2 如何确认已配置为 BT.656/BT.1120？

运行 `cat /sys/kernel/debug/dri/0/summary`，查看 VOP/VP 下的 `bus_format`，与第 3 节表格对照。原文输出示例：

```text
 cat /sys/kernel/debug/dri/0/summary
    Video Port0: ACTIVE

    ……
    bus_format[2025]: YUV8_1X24
    ……
```

### 5.3 信号是否标准？

原文答复为是，设计基于《Rec. ITU-R BT.656》和《Rec. ITU-R BT.1120》。这不是本文开展的独立一致性测试；还需注意 §5.12 所述消隐数据差异。

### 5.4 单沿还是双沿触发？

单沿触发。默认时钟上升沿位于数据中间；若接收端需要下降沿位于数据中间，将 DTS 的 `pixelclk-active` 设为 `1`。

### 5.5 DTS 参考文件

```text
BT.656: arch/arm64/boot/dts/rockchip/rk3568-evb6-ddr3-v10-rk630-bt656-to-cvbs.dts
BT.1120: arch/arm64/boot/dts/rockchip/rk3568-evb2-lp4x-v10-bt1120-to-hdmi.dts
```

### 5.6 如何驱动第三方转换芯片？

若转换芯片无需单独配置寄存器、上电即可使用，只需在 DTS panel 节点中配置 GPIO 和电源，确保供电正常，无需额外驱动；`rockchip_rgb.c` 会注册 DRM encoder 和 connector。

若转换芯片需要寄存器配置，除正确配置 DTS GPIO、电源外，还需编写转换芯片驱动。`rockchip_rgb.c` 注册 encoder，转换芯片驱动注册 connector，两者通过 DRM bridge 连接；参考 `drivers/gpu/drm/bridge/sii902x.c`。

### 5.7 RK628 的 BT.1120 如何使用？

原文指向《Rockchip_DRM_RK628_Porting_Guide_CN》。

### 5.8 与 Camera BT.656/BT.1120 的关系

本文介绍并行输出接口 BT.656 TX/BT.1120 TX；Camera 对应并行输入接口 BT.656 RX/BT.1120 RX。两者协议一致，RX 开发资料需通过原厂技术支持或 ISP 部门获取，不属于本文 TX 指南。

### 5.9 与 VOP 的关系

BT.656/BT.1120 是带嵌入式同步的并行输出接口。VOP 合成多个图层（多块 buffer），再通过这些接口输出。

### 5.10 与 RGB 的关系

BT.656/BT.1120 使用嵌入式同步；RGB 使用独立的 HSYNC/VSYNC/DEN 同步信号。它们是独立显示接口，显示通路没有直接关系，但可能复用 IO。

### 5.11 HSYNC/VSYNC/DEN 是否引出？

- RV1126/RV1109/RK3562/RK3576：均引出，Data 比同步信号晚 1 个 clock cycle。
- RV1126B：均引出；BT.1120 的 Data 与同步信号同步，BT.656 的 Data 晚 2 个 clock cycle。
- RK3566/RK3568/RK3588：均未引出。
- RV1103/RV1106/RK3506：均引出，Data 与同步信号同步。

### 5.12 消隐期数据

RV1126/RK3566/RK3568/RK3588：BT.656 消隐数据为 `0x80 0x10 0x80 0x10`；BT.1120 的 Y/UV 通道均为 `0x80 0x10 0x80 0x10`。原文明确指出此 BT.1120 消隐数据与协议有所不同，敏感的接收端可能显示异常。

其它平台：BT.656 消隐数据为 `0x80 0x10 0x80 0x10`；BT.1120 的 Y 通道为 `0x80`，UV 通道为 `0x10`。以上按原文保留，不自行交换 Y/UV 的值。

## 校对说明

原稿表格中的 `MEDIA_BUS_FMT_UYVY8_1x16` 小写 x、DTS panel 示例中的重复宏名，以及 §5.2 的 `YUV8_1X24` 输出示例均保留原样，使用时需对照实际内核绑定和驱动。§5.12 的 Y/UV 数值、§1.3 的场编号描述也不能擅改。[完整校对记录](/docs/rockchip-bt656-bt1120/EDITORIAL-NOTES.md)。
