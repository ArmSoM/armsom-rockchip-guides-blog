---
title: "Rockchip MIPI DSI2 完整开发指南：面板、DSC、协议与信号调试"
description: "完整整理 RK3576/RK3588 MIPI DSI2 配置、D/C-PHY、DSC/PPS、单双通道、协议波形、FAQ、驱动补丁及信号参数。"
translation_key: "050-rockchip-mipi-dsi2"
slug: "050-rockchip-mipi-dsi2"
lang: "zh"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["Rockchip", "RK3576", "RK3588", "MIPI DSI2"]
excerpt: "完整整理 RK3576/RK3588 MIPI DSI2 配置、D/C-PHY、DSC/PPS、单双通道、协议波形、FAQ、驱动补丁及信号参数。"
---

{% raw %}

# Rockchip MIPI DSI2 完整开发指南：面板、DSC、协议与信号调试

本文以 74 页中文 V2.3.0 原稿为共同基准，完整翻译英文和俄文；没有对应英文 PDF，三个语言版本均使用中文 PDF 原图，图内文字保持原样。属于 ArmSoM 平台参考，原文范围为 RK3576 Kernel 6.1、RK3588 Kernel 5.10/6.1；具体板卡、SDK/BSP、面板、电源时序及接口布线须先核对，未进行板级硬件验证，不宣称所有 ArmSoM 板卡均支持。

示例、波形与测量数据来自原厂文档，不是 ArmSoM 实测。写寄存器、调整 PHY 电压/时序和应用补丁可能使显示或系统异常；本次未执行任何硬件命令。代码、注释、命令与参数保留原文，源文矛盾不擅自更正。

[校对记录](/docs/rockchip-mipi-dsi2/EDITORIAL-NOTES.md) · [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.6, block 0 -->

## 1. Introduction

<!-- Source CN PDF p.6, block 1 -->

DSI-2 是 MIPI 联盟定义的一组通信协议的一部分， DWC-MIPI-DSI2 是一个实现 MIPI-DSI2 规范中定义的所有协议功能的数字核控制器，可以兼容 D-PHY 和 C-PHY 的物理接口，支持两路的 Display Stream Compression (DSC) 数据传输。

<!-- Source CN PDF p.6, block 2 -->

![原文技术图 — PDF 6](/docs/rockchip-mipi-dsi2/assets/cn-p06-figure1.png)

<!-- Source CN PDF p.6, block 3 -->

## 2. MIPI-DSI2 Features

<!-- Source CN PDF p.6, block 4 -->

1\. MIPI® Alliance Specification for Display Serial Interface 2 (DSI-2) Version 1.1

<!-- Source CN PDF p.6, block 5 -->

2\. MIPI® Alliance Specification for Display Command Set (DCS) Version 1.4

<!-- Source CN PDF p.6, block 6 -->

3\. MIPI® Alliance Specification for D-PHY v2.0

<!-- Source CN PDF p.6, block 7 -->

4\. MIPI® Alliance Specification for C-PHY v1.1

<!-- Source CN PDF p.6, block 8 -->

5\. Four data lanes on D-PHY and three data trios on C-PHY

<!-- Source CN PDF p.6, block 9 -->

6\. Bidirectional communication and escape mode through data lane 0

<!-- Source CN PDF p.6, block 10 -->

7\. Continuous and non-continuous clock modes on D-PHY and non-continuous clock mode on C-PHY

<!-- Source CN PDF p.6, block 11 -->

8\. End of Transmission packet (EoTp)

<!-- Source CN PDF p.6, block 12 -->

9\. Scrambling

<!-- Source CN PDF p.6, block 13 -->

10\. VESA DSC 1.1/1.2a

<!-- Source CN PDF p.6, block 14 -->

11\. Up to 4.5 Gbps per lane in D-PHY

<!-- Source CN PDF p.6, block 15 -->

12\. Up to 2.0 Gsps per trio in C-PHY

<!-- Source CN PDF p.7, block 16 -->

## 3. RK3576 与 RK3588 DSI 接口差别

<!-- Source CN PDF p.7, block 17 -->

| 功能 | RK3576 | RK3588 |
|---|---|---|
| Dual channel | Not support | Support |
| Max resolution | 2560x1600@60Hz | 4096x2304@60Hz |
| data lanes | 1/2/4 lanes | 1/2/4/8 lanes |
| Max lane rate | D-PHY: 2.5Gbps/lane<br>C-PHY: 1.7Gsps/lane | D-PHY: 4.5Gbps/lane<br>C-PHY: 2.0Gsps/lane |
| Color Format | RGB | RGB |
| Max Color Depth | 10 bit | 10 bit |
| DSC | Not support | Support VESA DSC 1.1/1.2a |
| C-PHY | Support | Support |

<!-- Source CN PDF p.7, block 18 -->

## 4. MIPI DSI-2 Host 与 MIPI DSI Host 的差别

<!-- Source CN PDF p.7, block 19 -->

MIPI DSI-2 除了可以兼容 MIPI DSI 的所有协议功能外, 还增加支持 MIPI C-PHY.

<!-- Source CN PDF p.7, block 20 -->

![原文技术图 — PDF 7](/docs/rockchip-mipi-dsi2/assets/cn-p07-figure1.png)

原图可编辑转录：

| DSI | D-PHY 1.01 | D-PHY 1.1 | D-PHY 1.2 | D-PHY 2.0 | C-PHY 1.0 |
|---|---|---|---|---|---|
| DSI 1.0 | Yes | Yes | Yes | Yes | No |
| DSI 1.1 | Yes | Yes | Yes | Yes | No |
| DSI 1.2 | Yes | Yes | Yes | Yes | No |
| DSI 1.3 | Yes | Yes | Yes | Yes | No |
| DSI-2 1.0 | Yes | Yes | Yes | Yes | Yes |

<!-- Source CN PDF p.7, block 21 -->

## 5. MIPI DPHY 差别

<!-- Source CN PDF p.7, block 22 -->

RK3588 平台 MIPI DPHY 不同以往平台 MIPI DPHY 版本, 其带宽最高可以到 4.5 Gbps.

<!-- Source CN PDF p.8, block 23 -->

![原文技术图 — PDF 8](/docs/rockchip-mipi-dsi2/assets/cn-p08-figure1.png)

<!-- Source CN PDF p.8, block 24 -->

## 6. 应用领域

<!-- Source CN PDF p.8, block 25 -->

MIPI DSI基于差分信号传输，可以降低引脚数量和硬件设计复杂度，并保持良好的硬件兼容性。另外，基于MIPI DSI协议的IP还具备低功耗、低EMI的特性。

<!-- Source CN PDF p.8, block 26 -->

其应用领域如下图：

<!-- Source CN PDF p.8, block 27 -->

![原文技术图 — PDF 8](/docs/rockchip-mipi-dsi2/assets/cn-p08-figure2.png)

<!-- Source CN PDF p.8, block 28 -->

## 7. 驱动代码说明：

<!-- Source CN PDF p.8, block 29 -->

### 7.1 uboot

<!-- Source CN PDF p.8, block 30 -->

#### 7.1.1 驱动位置

<!-- Source CN PDF p.9, block 31 -->

```text
drivers/video/drm/dw_mipi_dsi2.c
drivers/video/drm/samsung_mipi_dcphy.c
```

<!-- Source CN PDF p.9, block 32 -->

#### 7.1.2 驱动配置

<!-- Source CN PDF p.9, block 33 -->

```text
CONFIG_DRM_ROCKCHIP_DW_MIPI_DSI2=y
CONFIG_DRM_ROCKCHIP_SAMSUNG_MIPI_DCPHY=y
```

<!-- Source CN PDF p.9, block 34 -->

### 7.2 kernel

<!-- Source CN PDF p.9, block 35 -->

#### 7.2.1 驱动位置

<!-- Source CN PDF p.9, block 36 -->

```text
MIPI DSI-2 host controller:
drivers/gpu/drm/rockchip/dw-mipi-dsi2-rockchip.c
MIPI DCPHY:
drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
```

<!-- Source CN PDF p.9, block 37 -->

#### 7.2.2 驱动配置

<!-- Source CN PDF p.9, block 38 -->

```text
cONFIG_ROCKCHIP_DW_MIPI_DSI=y
CONFIG_PHY_ROCKCHIP_SAMSUNG_DCPHY=y
```

<!-- Source CN PDF p.9, block 39 -->

#### 7.2.3 参考设备树

<!-- Source CN PDF p.9, block 40 -->

DTS 路径：

<!-- Source CN PDF p.9, block 41 -->

```text
arch/arm64/boot/dts/rockchip/rk3588-evb.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb2-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb3-lp5.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb4-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb2-lp5.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb4-lp4x.dtsi
```

<!-- Source CN PDF p.9, block 42 -->

dts 配置用例场景说明：

<!-- Source CN PDF p.10, block 43 -->

```text
rk3588-evb1: dsi0->dphy->1080p_panel && dsi1->dphy->1080p_panel;
rk3588-evb2: dsi1->dphy->1080p_panel;
rk3588-evb3: dsi0->dphy->1080p_panel && dsi1->cphy->cphy_panel;
rk3588-evb4: dsi0->dphy->1080p_panel;
rk3588s-evb1: dsi0->dphy->1080p_panel && dsi1->dphy->cmd_no_dsc_panel;
rk3588s-evb2: dsi0->cphy->cphy_panel & dsi1->dphy->1080p_panel;
rk3588s-evb4: dsi0->dphy->1080p_panel && dsi1->dphy->cmd_dsc_panel;
```

<!-- Source CN PDF p.10, block 44 -->

## 8. DSI 控制器和屏端配置

<!-- Source CN PDF p.10, block 45 -->

### 8.1 DTS 配置

<!-- Source CN PDF p.10, block 46 -->

```text
&dsi0 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
};
&dsi0_panel {
    status = "okay";
    compatible = "simple-panel-dsi";
    reg = <0>;
    power-supply = <&vcc3v3_lcd_n>;
    backlight = <&backlight>;
    reset-gpios = <&gpio2 RK_PB4 GPIO_ACTIVE_LOW>;
    reset-delay-ms = <10>;
    enable-delay-ms = <10>;
    prepare-delay-ms = <10>;
    unprepare-delay-ms = <10>;
    disable-delay-ms = <60>;
    dsi,flags = <(MIPI_DSI_MODE_VIDEO | MIPI_DSI_MODE_VIDEO_BURST |
        MIPI_DSI_MODE_LPM | MIPI_DSI_MODE_EOT_PACKET)>;
    dsi,format = <MIPI_DSI_FMT_RGB888>;
    dsi,lanes = <4>;
    //phy-c-option;
    //compressed-data;
    //slice-width = <720>;
    //slice-height = <65>;
    //version-major = <1>;
    //version-minor = <1>;
    panel-init-sequence = [
        ...
        05 78 01 11
        05 00 01 29
    ];
    panel-exit-sequence = [
        05 00 01 28
        05 00 01 10
    ];
    disp_timings0: display-timings {
        native-mode = <&dsi0_timing0>;
        dsi0_timing0: timing0 {
            clock-frequency = <132000000>;
            hactive = <1080>;
            vactive = <1920>;
            hfront-porch = <15>;
            hsync-len = <4>;
            hback-porch = <30>;
            vfront-porch = <15>;
            vsync-len = <2>;
            vback-porch = <15>;
            hsync-active = <0>;
            vsync-active = <0>;
            de-active = <0>;
            pixelclk-active = <0>;
        };
    };
};
```

<!-- Source CN PDF p.11, block 48 -->

### 8.2 配置说明

<!-- Source CN PDF p.11, block 49 -->

#### 8.2.1 通用配置

<!-- Source CN PDF p.11, block 50 -->

| Property | Description | Value |
|---|---|---|
| rockchip,lane-rate | 选择手动指定 mipi 通<br>道速率 | 单位可以支持:<br>D-PHY: Mbps/lane 或 Kbps/lane<br>C-PHY: Msps/lane 或 Ksps/lane<br>比如指定800Mbps：rockchip,lane-rate = &lt;800&gt;; 或者<br>rockchip,lane-rate = &lt;800000&gt;; |
| auto-calculation | 使能 Auto-Calculation<br>工作模式 | 布尔类型 string |
| disable-hold-mode | 不配置 TE 也能刷帧 | 布尔类型 string |
| support-psr | 使能 PSR 功能 | 布尔类型 string |
| compatible | compatible | simple-panel-dsi |
| power-supply | 屏端供电 [option] | 相关regulator引用 |
| backlight | 背光 | 背光引用 |
| enable-gpios | 屏使能GPIO [option] | GPIO引用描述 |
| reset-gpios | 屏复位GPIO | GPIO引用描述 |
| reset-delay-ms | panel sequence<br>delay | 参考 panel spec |
| enable-delay-ms | panel sequence<br>delay | 参考 panel spec |
| prepare-delay-ms | panel sequence<br>delay | 参考 panel spec |
| unprepare-delay-ms | panel sequence<br>delay | 参考 panel spec |
| disable-delay-ms | panel sequence<br>delay | 参考 panel spec |
| dsi,flags | DSI2 工作模式 | cmd mode:<br>MIPI_DSI_MODE_LPM \|<br>MIPI_DSI_MODE_EOT_PACKET |
| dsi,flags | DSI2 工作模式 | video mode:<br>MIPI_DSI_MODE_VIDEO \|<br>MIPI_DSI_MODE_VIDEO_BURST \|<br>MIPI_DSI_MODE_LPM \|<br>MIPI_DSI_MODE_EOT_PACKET |
| dsi,format | 像素数据格式 | MIPI_DSI_FMT_RGB888 |
| dsi,format | 像素数据格式 | MIPI_DSI_FMT_RGB666 |
| dsi,format | 像素数据格式 | MIPI_DSI_FMT_RGB666_PACKED |
| dsi,format | 像素数据格式 | MIPI_DSI_FMT_RGB565 |
| dsi,lanes | mipi data 通道数 | 1/2/3 trios [cphy] |
| dsi,lanes | mipi data 通道数 | 6 trios [cphy 双通道] |
| dsi,lanes | mipi data 通道数 | 1/2/3/4 lanes [dphy] |
| dsi,lanes | mipi data 通道数 | 8 lanes [dphy 双通道] |
| phy-c-option | C-PHY panel [option] | 布尔类型string |
| compressed-data | 带DSC panel [option] | 布尔类型string |
| slice-width | 定义dsc slice宽<br>[option] | 参照panel spec |
| slice-height | 定义dsc slice高<br>[option] | 参照panel spec |
| version-major | 定义dsc版本 [option] | 参照panel spec |
| version-minor | 定义dsc版本 [option] | 参照panel spec |
| panel-init-sequence | 屏上电初始化序列 | [hex]<br>data_type delay_ms payload_lenth payload |
| panel-exit-sequence | 屏下电初始化序列 | [hex]<br>data_type delay_ms payload_lenth payload |
| display-timing | panel timing | 参考panel spec |

<!-- Source CN PDF p.13, block 53 -->

#### 8.2.2 display Timing

<!-- Source CN PDF p.13, block 54 -->

![原文技术图 — PDF 13](/docs/rockchip-mipi-dsi2/assets/cn-p13-figure1.png)

<!-- Source CN PDF p.13, block 55 -->

#### 8.2.3 dsi,flags

<!-- Source CN PDF p.13, block 56 -->

##### 8.2.3.1 CLK Type

<!-- Source CN PDF p.13, block 57 -->

在 MIPI DSI 协议的 5.6.1 时钟要求章节介绍：所有DSI发射器和接收器都应在时钟通道上支持连续时钟行为，并且可以选择性地支持非连续时钟行为，所以显示应用中时钟通道工作在连续模式还是非连续模式取决于显示外设的需求。

<!-- Source CN PDF p.13, block 58 -->

默认情况， MIPI DPHY 的时钟通道工作在连续模式，是 DSI 显示系统中主从都支持的时钟行为，另外如果 DSI 外设需要依赖主机端的时钟工作时，则时钟通道必须工作在连续模式，如下图：

<!-- Source CN PDF p.14, block 59 -->

![原文技术图 — PDF 14](/docs/rockchip-mipi-dsi2/assets/cn-p14-figure1.png)

<!-- Source CN PDF p.14, block 60 -->

当系统需要考虑节省功耗时，尤其是在传输期间，可以配置成非连续时钟模式，可以避免在不需要数据传输时浪费电力，把 MIPI_DSI_CLOCK_NON_CONTINUOUS 追加到 dsi,flags 时，MIPI DPHY 的时钟通道将会配置成非连续模式，如下图：

<!-- Source CN PDF p.14, block 61 -->

![原文技术图 — PDF 14](/docs/rockchip-mipi-dsi2/assets/cn-p14-figure2.png)

<!-- Source CN PDF p.14, block 62 -->

##### 8.2.3.2 Eotp

<!-- Source CN PDF p.14, block 63 -->

Eotp 在 DSI 规范版本 V1.0 以及更早版本是不支持的，只有符合 DSI V1.0 之后的较新规范版本的设备必须支持 Eotp的生成和检测，RK3588/RK3576 DSI 版本是 V2.0，为了确保与早期设备的互操作性，主机应该能够启用和禁用生成和检测手段。总而言之，是否启用 Eotp 取决于屏端是否支持。

<!-- Source CN PDF p.14, block 64 -->

Eotp 是一个短包用于指示数据链路上高速传输的结束。Eotp 主要作用是增强系统高速传输通信的稳健性，出于这个目的，DSI 不需要在 LP 模式发送 Eotp。

<!-- Source CN PDF p.15, block 65 -->

Eotp 不同于其他 DSI 包，它有固定的格式：

<!-- Source CN PDF p.15, block 66 -->

```text
Data Type = DI [5:0] = 0b001000
Virtual Channel = DI [7:6] = 0b00
Payload Data [15:0] = 0x0F0F
ECC [7:0] = 0x01
```

<!-- Source CN PDF p.15, block 67 -->

将 MIPI_DSI_MODE_EOT_PACKET 追加到 dsi,flags 属性可以开关 Soc MIPI DSI TX 在高速模式发送 Eotp。如下是在 HSDT 模式下捕获 Eotp 波形：

<!-- Source CN PDF p.15, block 68 -->

![原文技术图 — PDF 15](/docs/rockchip-mipi-dsi2/assets/cn-p15-figure1.png)

<!-- Source CN PDF p.15, block 69 -->

##### 8.2.3.3 BLANK_HS_EN

<!-- Source CN PDF p.15, block 70 -->

在数据通道，一般存在一行会有两个 LP11 消隐, 如下图：

<!-- Source CN PDF p.15, block 71 -->

![原文技术图 — PDF 15](/docs/rockchip-mipi-dsi2/assets/cn-p15-figure2.png)

<!-- Source CN PDF p.16, block 72 -->

但往往有些显示模组或者外接 MIPI 转接芯片，不支持在 Hblank阶段有两个 LP-11, 可以将 BLK_HFP_HS_EN 或BLK_HBP_HS_EN 追加到 dsi,flags 属性，使HFP 或 HBP 以高速的形式存在。

<!-- Source CN PDF p.16, block 73 -->

![原文技术图 — PDF 16](/docs/rockchip-mipi-dsi2/assets/cn-p16-figure1.png)

<!-- Source CN PDF p.16, block 74 -->

#### 8.2.4 屏上电时序

<!-- Source CN PDF p.16, block 75 -->

![原文技术图 — PDF 16](/docs/rockchip-mipi-dsi2/assets/cn-p16-figure2.png)

<!-- Source CN PDF p.17, block 76 -->

#### 8.2.5 屏下电时序

<!-- Source CN PDF p.17, block 77 -->

![原文技术图 — PDF 17](/docs/rockchip-mipi-dsi2/assets/cn-p17-figure1.png)

<!-- Source CN PDF p.17, block 78 -->

#### 8.2.6 初始化序列常见数据类型

<!-- Source CN PDF p.17, block 79 -->

| data type | description | packet size |
|---|---|---|
| 0x03 | Generic Short WRITE, no parameters | short |
| 0x13 | Generic Short WRITE, 1 parameters | short |
| 0x23 | Generic Short WRITE, 2 parameters | short |
| 0x29 | Generic long WRITE, | long |
| 0x05 | DCS Short WRITE, no parameters | short |
| 0x15 | DCS Short WRITE, 1 parameters | short |
| 0x07 | DCS Short WRITE, 1 parameters, DSC EN | short |
| 0x0a | DCS long WRITE, PPS, 128 bytes | long |

<!-- Source CN PDF p.18, block 80 -->

## 9. Timing for DSI video mode

<!-- Source CN PDF p.18, block 81 -->

![原文技术图 — PDF 18](/docs/rockchip-mipi-dsi2/assets/cn-p18-figure1.png)

<!-- Source CN PDF p.18, block 82 -->

## 10. Bandwidth

<!-- Source CN PDF p.18, block 83 -->

MIPI DSI 驱动中会自动按如下公式根据不同的工作模式进行带宽的计算，当然在调试过程中也许对计算的结果想做些微调可以通过 DTS dsi 节点下 rockchip,lane-rate 属性进行指定，单位可以是 Kbps/Mbps(D-PHY) 或 Ksps/Msps (C-PHY)。如下带宽计算用例中可以发现，4K@60 的分辨率对于 RK3588 MIPI DSI DPHY 不需要 DSC 也完全可以支持，但 CPHY 会稍微超出本身最大带宽。

<!-- Source CN PDF p.19, block 84 -->

![原文技术图 — PDF 19](/docs/rockchip-mipi-dsi2/assets/cn-p19-figure1.png)

原图可编辑转录：

| Parameter | Value |
|---|---|
| Resolution | 3840x2160 |
| hact / hfp / hsync / hbp | 3840 / 176 / 88 / 296 |
| vact / vfp / vsync / vbp | 2160 / 8 / 10 / 72 |
| bpp / lanes | 24 / 4 |

```text
Htotal = hact + hfp + hsync + hbp = 4400
Vtotal = vact + vfp + vsync + vbp = 2250
Pixel-CLK = Htotal * Vtotal * framerate = 4400 * 2250 * 60
D-PHY Video Burst: BW = Htotal * Vtotal * framerate * BPP * 10 / lanes / 9
= 4400 * 2250 * 60 * 24 * 10 / 4 / 9 = 3.96 Gbps
D-PHY Non Burst Sync Pulse/Event: BW = Htotal * Vtotal * framerate * BPP / lanes
= 4400 * 2250 * 60 * 24 / 4 = 3.57 Gbps
C-PHY Video Burst: BW = Htotal * Vtotal * framerate * BPP * 10 / lanes / 9 / 2.28
= 4450 * 2250 * 60 * 24 * 10 / 3 / 9 / 2.28 = 2.32 Gbps
C-PHY Non Burst Sync Pulse/Event: BW = Htotal * Vtotal * framerate * BPP / lanes / 2.28
= 4450 * 2250 * 60 * 24 / 3 / 2.28 = 2.11 Gbps
```

原图 C-PHY 代入值写为 4450，与前面的 Htotal=4400 不同；原图结果单位写 Gbps，正文 C-PHY 使用 Gsps。两处均保留，不作为实测或更正后的计算结论。

<!-- Source CN PDF p.19, block 85 -->

## 11. DSC

<!-- Source CN PDF p.19, block 86 -->

DSC 是 Display Stream Compression 缩写，如下是一个完整的 DSC 系统框图，整个系统为实时工作，未压缩的原始视频像素数据按光栅扫描顺序实时进入编码器并输出比特流，通过显示链路实时传输到解码器，解码器将接收的比特流解码为原始的视频像素数据并送到显示模块显示。从编码器解码输出的图像和输入到编码器前的图像数据信息格式是一样的。RK3588 具有两个 DSC 编码器，可以有效将高分辨率画质内容以低带宽、低延时传输，从而实现MIPI DSI可以点更高分辨率的画面。

<!-- Source CN PDF p.19, block 87 -->

![原文技术图 — PDF 19](/docs/rockchip-mipi-dsi2/assets/cn-p19-figure2.png)

<!-- Source CN PDF p.19, block 88 -->

### 11.1 Slice

<!-- Source CN PDF p.19, block 89 -->

DSC为加速编码过程，并减少经过压缩失真，DSC导入界面（slice），将每一帧的画面加以切割，切割出的截面同时进行编码。DSC可支持的截面数有1、2、4、8个，甚至更多的截面数。需要注意的是单位为slice/line，line是指画面成形时以raster-scan顺序为一行的像素。除不同截面数外，DSC也可以使用不同长宽的截面。如下图右上及右下两张图片，同样都是一行4个截面，但右上的图切割为长条形截面，右下的图则切割成较窄的长方形截面。要使用哪一种长宽的截面取决于Source Device及Sink Device DSC支持的截面数以及DSC压缩或解压缩率。RK3588 DSC0 最多支持 8 slices，DSC1 最多支持 2 slices。

<!-- Source CN PDF p.20, block 90 -->

![原文技术图 — PDF 20](/docs/rockchip-mipi-dsi2/assets/cn-p20-figure1.png)

<!-- Source CN PDF p.20, block 91 -->

当实际显示方案中需要确认RK3588 DSC 是否能否支持某款什么分辨率具有多少Slices DSC时，参考如下公式：

<!-- Source CN PDF p.20, block 92 -->

```text
DSC_8K: active_slice_num * slice_width <= 960 * 8
DSC_4K: active_slice_num * slice_width <= 2048 * 2
```

<!-- Source CN PDF p.20, block 93 -->

### 11.2 DSC Encode

<!-- Source CN PDF p.20, block 94 -->

在影像数据压缩之前，图像将由Source Device和Sink Device共同协商都能支持的slice数量进行网格均等切割，以3840x2160为例，假如Source Device和Sink Device DSC都能支持8slices，可以在水平方向均等切割4份，垂直方向均等切割2份，假如DSC encoder有4个独立并行处理影像数据压缩的core组成，这该图的左边切割的8个slice可以分成4组同时并行进行压缩，有效将4k画质内容以低带宽、低延时进行传输。

<!-- Source CN PDF p.20, block 95 -->

![原文技术图 — PDF 20](/docs/rockchip-mipi-dsi2/assets/cn-p20-figure2.png)

<!-- Source CN PDF p.21, block 96 -->

### 11.3 DSC Bandwidth

<!-- Source CN PDF p.21, block 97 -->

以4Kp60的分辨率为例子，启用DSC前后 MIPI D/C-PHY 带宽变化如下，使能DSC后，链路带宽可以降到原始带宽数据的三分一到二分之一。

<!-- Source CN PDF p.21, block 98 -->

![原文技术图 — PDF 21](/docs/rockchip-mipi-dsi2/assets/cn-p21-figure1.png)

原图可编辑转录：

| 3840x2160 / 60Hz | 24 bits RGB | DSC 8 bits RGB |
|---|---|---|
| D-PHY Video Burst | 3.96 x 4 Gbps | 1.32 x 4 Gbps |
| C-PHY Video Burst | 2.32 x 3 Gsps | 0.774 x 3 Gsps |

<!-- Source CN PDF p.21, block 99 -->

下图为RK3588 MIPI DSI 驱动 1440x3120p60 4lanes with DSC 显示模组时，分别测量以原始带宽和原始带宽的三分之一的信号波形。

<!-- Source CN PDF p.21, block 100 -->

![原文技术图 — PDF 21](/docs/rockchip-mipi-dsi2/assets/cn-p21-figure2.png)

<!-- Source CN PDF p.21, block 101 -->

### 11.4 PPS

<!-- Source CN PDF p.21, block 102 -->

PPS 一共有128 bytes 长度，如下表会描述一些 DSC 系统需要的重要信息：

<!-- Source CN PDF p.21, block 103 -->

1\. DSC 版本；

<!-- Source CN PDF p.21, block 104 -->

2\. DSC 压缩编码前的 BPC;

<!-- Source CN PDF p.21, block 105 -->

3\. DSC 压缩编码后的 BPP;

<!-- Source CN PDF p.21, block 106 -->

4\. DSC 压缩编码前输入原始图像的宽高；

<!-- Source CN PDF p.21, block 107 -->

5\. DSC 压缩编码的 Slice 宽高。

<!-- Source CN PDF p.22, block 108 -->

![原文技术图 — PDF 22](/docs/rockchip-mipi-dsi2/assets/cn-p22-figure1.png)

原图可编辑转录：

PPS 示例：1600 × 2560，slice 40。以下转录原图完整可见的字段和 PA1–PA31；原图未给出的后续 PPS 字节不补猜。

| Field | Dec | Hex |
| --- | --- | --- |
| force_reg_dsc_version_major[3:0] | 1 | 1 |
| force_reg_dsc_version_minor[3:0] | 1 | 1 |
| force_reg_pps_identifier[7:0] | 0 | 00 |
| force_reg_bits_per_component[3:0] | 8 | 8 |
| force_reg_linebuf_depth[3:0] | 9 | 9 |
| force_reg_block_pred_enable | 1 | 1 |
| force_reg_convert_rgb | 1 | 1 |
| force_reg_simple_422 | 0 | 0 |
| force_reg_vbr_enable | 0 | 0 |
| force_reg_bits_per_pixel[9:0] | 128 | 80 |
| force_reg_pic_height[15:0] | 2560 | 0A00 |
| force_reg_pic_width[15:0] | 1600 | 0640 |
| force_reg_slice_height[15:0] | 40 | 28 |
| force_reg_slice_width[15:0] | 1600 | 0640 |
| force_reg_chunk_size[15:0] | 1600 | 0640 |
| force_reg_initial_xmit_delay[9:0] | 512 | 0200 |
| force_reg_initial_dec_delay[15:0] | 1057 | 0421 |
| force_reg_initial_scale_value[5:0] | 32 | 0020 |
| force_reg_scale_inc_interval[15:0] | 1488 | 05D0 |
| force_reg_scale_dec_interval[11:0] | 22 | 0016 |
| force_reg_first_line_bpg_offset[4:0] | 12 | 0C |
| force_reg_nfl_bpg_offset[15:0] | 631 | 0277 |
| force_reg_slice_bpg_offset[15:0] | 218 | 00DA |
| force_reg_initial_offset[15:0] | 6144 | 1800 |
| force_reg_final_offset[15:0] | 4320 | 10E0 |
| force_reg_flatness_min_qp[4:0] | 3 | 03 |
| force_reg_flatness_max_qp[4:0] | 12 | 0C |

| PA | Hex | PPS |
| --- | --- | --- |
| PA1 | 11 | PPS1 |
| PA2 | 00 | PPS2 |
| PA3 | 00 | PPS3 |
| PA4 | 89 | PPS4 |
| PA5 | 30 | PPS5 |
| PA6 | 80 | PPS6 |
| PA7 | 0A | PPS7 |
| PA8 | 00 | PPS8 |
| PA9 | 06 | PPS9 |
| PA10 | 40 | PPS10 |
| PA11 | 00 | PPS11 |
| PA12 | 28 | PPS12 |
| PA13 | 06 | PPS13 |
| PA14 | 40 | PPS14 |
| PA15 | 06 | PPS15 |
| PA16 | 40 | PPS16 |
| PA17 | 02 | PPS17 |
| PA18 | 00 | PPS18 |
| PA19 | 04 | PPS19 |
| PA20 | 21 | PPS20 |
| PA21 | 00 | PPS21 |
| PA22 | 20 | PPS22 |
| PA23 | 05 | PPS23 |
| PA24 | D0 | PPS24 |
| PA25 | 00 | PPS25 |
| PA26 | 16 | PPS26 |
| PA27 | 00 | PPS27 |
| PA28 | 0C | PPS28 |
| PA29 | 02 | PPS29 |
| PA30 | 77 | PPS30 |
| PA31 | 00 | PPS31 |

<!-- Source CN PDF p.22, block 109 -->

### 11.5 实例

<!-- Source CN PDF p.22, block 110 -->

#### 11.5.1 何时启用 DSC

<!-- Source CN PDF p.22, block 111 -->

在具体项目 MIPI DSI 相关的显示方案中何时可以启用 DSC。以下面客户提供的一组显示模组参数为例说明启用 DSC条件：

<!-- Source CN PDF p.22, block 112 -->

1\. 该模组为一个 DPHY 4 data lanes 接口，最大速率为1Gbps/lane；

<!-- Source CN PDF p.22, block 113 -->

2\. 该模组为 Video Burst mode, 原始带宽： 1.866Gbps 24 bits RGB 60帧；

<!-- Source CN PDF p.22, block 114 -->

3\. 该模组支持 DSC 1 Slice

<!-- Source CN PDF p.22, block 115 -->

4\. 该模组目标速率：676Mbps/lane

<!-- Source CN PDF p.23, block 116 -->

![原文技术图 — PDF 23](/docs/rockchip-mipi-dsi2/assets/cn-p23-figure1.png)

原图可编辑转录：

| Parameter | Value |
|---|---|
| Frame Rate | 60 Hz |
| Pixel Clock | 84.5 MHz |
| MIPI Lane | 1 port * 4 Lane |
| MIPI Speed | 676 M sps |
| HSW / HBP / HACT / HFP | 20 / 40 / 1600 / 118 |
| VSW / VBP / VACT / VFP | 4 / 18 / 2560 / 60 |

<!-- Source CN PDF p.23, block 117 -->

#### 11.5.2 双通道MIPI 如何启用 DSC

<!-- Source CN PDF p.23, block 118 -->

如下图为客户方案中点一款带DSC功能 2560x2560p120 双 mipi 显示模组，其实现的显示链路框图如下。

<!-- Source CN PDF p.23, block 119 -->

![原文技术图 — PDF 23](/docs/rockchip-mipi-dsi2/assets/cn-p23-figure2.png)

<!-- Source CN PDF p.24, block 120 -->

## 12. Display Route

<!-- Source CN PDF p.24, block 121 -->

![原文技术图 — PDF 24](/docs/rockchip-mipi-dsi2/assets/cn-p24-figure1.png)

<!-- Source CN PDF p.24, block 122 -->

### 12.1 MIPI with DSC

<!-- Source CN PDF p.24, block 123 -->

![原文技术图 — PDF 24](/docs/rockchip-mipi-dsi2/assets/cn-p24-figure2.png)

<!-- Source CN PDF p.25, block 124 -->

### 12.2 MIPI with DSC Bypass

<!-- Source CN PDF p.25, block 125 -->

![原文技术图 — PDF 25](/docs/rockchip-mipi-dsi2/assets/cn-p25-figure1.png)

<!-- Source CN PDF p.25, block 126 -->

### 12.3 DTS 配置

<!-- Source CN PDF p.25, block 127 -->

如 DSI0 挂载在 VP3:

<!-- Source CN PDF p.25, block 128 -->

```text
&dsi0_in_vp2 {
    status = "disabled";
};
&dsi0_in_vp3 {
    status = "okay";
};
```

<!-- Source CN PDF p.25, block 129 -->

如 DSI1 挂载 VP2:

<!-- Source CN PDF p.25, block 130 -->

```text
&dsi1_in_vp2 {
    status = "okay";
};
&dsi1_in_vp3 {
    status = "disabled";
};
```

<!-- Source CN PDF p.26, block 131 -->

## 13. 开机LOGO

<!-- Source CN PDF p.26, block 132 -->

### 13.1 route_dsi0

<!-- Source CN PDF p.26, block 133 -->

例如 vp3->dsi0 或 vp3->dsc0->dsi0:

<!-- Source CN PDF p.26, block 134 -->

```text
&route_dsi0 {
    status = "okay";
    connect = <&vp3_out_dsi0>;
};
```

<!-- Source CN PDF p.26, block 135 -->

### 13.2 route_dsi1

<!-- Source CN PDF p.26, block 136 -->

例如 vp2->dsi1 或 vp2->dsc1->dsi1:

<!-- Source CN PDF p.26, block 137 -->

```text
&route_dsi1 {
    status = "okay";
    connect = <&vp2_out_dsi1>;
};
```

<!-- Source CN PDF p.26, block 138 -->

### 13.3 route_dsi0 && route_dsi1

<!-- Source CN PDF p.26, block 139 -->

例如 （vp3->dsi0 或 vp3->dsc0->dsi0） && （vp2->dsi1 或 vp2->dsc1->dsi1）:

<!-- Source CN PDF p.26, block 140 -->

```text
&route_dsi0 {
    status = "okay";
    connect = <&vp3_out_dsi0>;
};
&route_dsi1 {
    status = "okay";
    connect = <&vp2_out_dsi1>;
};
```

<!-- Source CN PDF p.26, block 141 -->

## 14. DSI HOST

<!-- Source CN PDF p.26, block 142 -->

DSI 可以配置成 Manual/Auto-Calculation 模式，驱动默认时配置成 Manual 模式，用户可以选择配置成 Auto-Calculation 模式，该模式有如下特点：

<!-- Source CN PDF p.26, block 143 -->

主机被配置为从lPl和PPl接口自动提取所有必要的信息和时序参数，以满足视频模式中的帧时序要求。Auto-Calculation 模式具有以下优点：

<!-- Source CN PDF p.27, block 144 -->

无需用户配置一组寄存器

<!-- Source CN PDF p.27, block 145 -->

简化了配置流程，且控制器不易出现不期望的行为

<!-- Source CN PDF p.27, block 146 -->

允许IPI帧动态变化，同时控制器适应输出帧的变化

<!-- Source CN PDF p.27, block 147 -->

ports以下实例中 ports 是用来 Dispaly Interface 和 panel 之间进行关联。详细配置说明参阅如下文档:

<!-- Source CN PDF p.27, block 148 -->

```text
Documentation/devicetree/bindings/graph.txt
```

<!-- Source CN PDF p.27, block 149 -->

### 14.1 单 DSI

<!-- Source CN PDF p.27, block 150 -->

![原文技术图 — PDF 27](/docs/rockchip-mipi-dsi2/assets/cn-p27-figure1.png)

<!-- Source CN PDF p.27, block 151 -->

#### 14.1.1 DSI0

<!-- Source CN PDF p.27, block 152 -->

```text
&dsi0 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi0_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi: endpoint {
                    remote-endpoint = <&dsi_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi>;
            };
        };
    };
};
&mipi_dcphy0 {
    status = "okay";
};
```

<!-- Source CN PDF p.28, block 154 -->

#### 14.1.2 DSI1

<!-- Source CN PDF p.28, block 155 -->

```text
&dsi1 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi1_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi1: endpoint {
                    remote-endpoint = <&dsi1_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi1_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi1>;
            };
        };
    };
};
&mipi_dcphy1 {
    status = "okay";
};
```

<!-- Source CN PDF p.29, block 157 -->

### 14.2 双通道 DSI

<!-- Source CN PDF p.29, block 158 -->

MODE1:

<!-- Source CN PDF p.29, block 159 -->

![原文技术图 — PDF 29](/docs/rockchip-mipi-dsi2/assets/cn-p29-figure1.png)

<!-- Source CN PDF p.29, block 160 -->

MODE2:

<!-- Source CN PDF p.29, block 161 -->

![原文技术图 — PDF 29](/docs/rockchip-mipi-dsi2/assets/cn-p29-figure2.png)

<!-- Source CN PDF p.29, block 162 -->

双通道配置注意原文标红的属性：`rockchip,dual-channel = <&dsi1>`；`dsi,lanes = `<8>`;` 用于 DPHY 屏，CPHY 屏值改成 6。完整 DTS 示例见下文。

<!-- Source CN PDF p.29, block 163 -->

```text
&dsi0 {
    status = "okay";
    rockchip,dual-channel = <&dsi1>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi0_panel {
        status = "okay";
        compatible = "simple-panel-dsi";
        dsi,lanes = <8>;
        ...
        display-timings {
            native-mode = <&timing0>;
            timing0: timing0 {
                clock-frequency = <260000000>;
                hactive = <1440>;
                vactive = <2560>;
                hfront-porch = <150>;
                hsync-len = <30>;
                hback-porch = <60>;
                vfront-porch = <8>;
                vsync-len = <4>;
                vback-porch = <4>;
                hsync-active = <0>;
                vsync-active = <0>;
                de-active = <0>;
                pixelclk-active = <0>;
            };
        };
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi0: endpoint {
                    remote-endpoint = <&dsi0_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi0_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi0>;
            };
        };
    };
};
&dsi1 {
    status = "okay";
};
&mipi_dcphy0 {
    status = "okay";
};
&mipi_dcphy1 {
    status = "okay";
};
```

<!-- Source CN PDF p.31, block 167 -->

### 14.3 Dual-link DSI

<!-- Source CN PDF p.31, block 168 -->

![原文技术图 — PDF 31](/docs/rockchip-mipi-dsi2/assets/cn-p31-figure1.png)

<!-- Source CN PDF p.31, block 169 -->

```text
&dsi0 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi0_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi: endpoint {
                    remote-endpoint = <&dsi_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi>;
            };
        };
    };
};
&dsi1 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi1_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi1: endpoint {
                    remote-endpoint = <&dsi1_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi1_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi1>;
            };
        };
    };
};
&mipi_dcphy0 {
    status = "okay";
};
&mipi_dcphy1 {
    status = "okay";
};
```

<!-- Source CN PDF p.33, block 173 -->

### 14.4 DSI 应用场景

<!-- Source CN PDF p.33, block 174 -->

#### 14.4.1 DSI + SerDer 方案

<!-- Source CN PDF p.33, block 175 -->

![原文技术图 — PDF 33](/docs/rockchip-mipi-dsi2/assets/cn-p33-figure1.png)

<!-- Source CN PDF p.33, block 176 -->

#### 14.4.2 多屏屏接方案

<!-- Source CN PDF p.33, block 177 -->

![原文技术图 — PDF 33](/docs/rockchip-mipi-dsi2/assets/cn-p33-figure2.png)

<!-- Source CN PDF p.34, block 178 -->

## 15. DC-PHY

<!-- Source CN PDF p.34, block 179 -->

实际应用配置中默认是配置成D-PHY，通过屏端配置介绍可知，通过下面可以配置成 C-PHY:

<!-- Source CN PDF p.34, block 180 -->

```text
dsi0_panel: panel@0 {
    ...
    phy-c-option;
    ...
};
```

<!-- Source CN PDF p.34, block 181 -->

### 15.1 D-PHY

<!-- Source CN PDF p.34, block 182 -->

![原文技术图 — PDF 34](/docs/rockchip-mipi-dsi2/assets/cn-p34-figure1.png)

<!-- Source CN PDF p.34, block 183 -->

1\. Up to 4.5 Gbps per lane in D-PHY；

<!-- Source CN PDF p.34, block 184 -->

2\. 一个D-PHY port 最多4lanes，每个lane由两条差分线组成；

<!-- Source CN PDF p.34, block 185 -->

3\. D指的是罗⻢数字500 or "D", D-PHY在推出初期时，数据最大速率为1G(DDR)，时钟对应的速率则为500MHz，而现在的D-PHY速率已经不止这些，D也就没有什么含义。

<!-- Source CN PDF p.35, block 186 -->

### 15.2 C-PHY

<!-- Source CN PDF p.35, block 187 -->

![原文技术图 — PDF 35](/docs/rockchip-mipi-dsi2/assets/cn-p35-figure1.png)

<!-- Source CN PDF p.35, block 188 -->

1\. Up to 2.0 Gsps per trio in C-PHY；

<!-- Source CN PDF p.35, block 189 -->

2\. 一个C-PHY port 最多3lanes，每个lane由 tree-wire-trios 组成；

<!-- Source CN PDF p.35, block 190 -->

3\. C-PHY没有单独的时钟通道，它的时钟隐藏在通信的时序中；

<!-- Source CN PDF p.35, block 191 -->

4\. C指的是Channel-limited, 通道被限制到3，C-PHY总共3条lanes，每条lane使用3线传输模式。

<!-- Source CN PDF p.35, block 192 -->

## 16. 动态变帧

<!-- Source CN PDF p.35, block 193 -->

MIPI DSI 可以实现动态帧率切换，比如 120fps `<->` 60fps 之间动态无感切换，更多细节参阅《Rockchip_RK3588_Developer_Guide_Vsync_Adjust_CN》相关文档。

<!-- Source CN PDF p.35, block 194 -->

![原文技术图 — PDF 35](/docs/rockchip-mipi-dsi2/assets/cn-p35-figure2.png)

<!-- Source CN PDF p.36, block 195 -->

## 17. PSR

<!-- Source CN PDF p.36, block 196 -->

当 MIPI DSI 工作在 COMMAND 模式，屏端内置 GRAM，可以在显示系统刷静态帧的时候选择关闭主控的 DSI输出以减少功耗，屏端持续从 GRAM 刷静态帧，当新一帧有任何显示内容变化时，主控端必须使能并往屏的 GRAM 中刷新帧以更新显示。

<!-- Source CN PDF p.36, block 197 -->

![原文技术图 — PDF 36](/docs/rockchip-mipi-dsi2/assets/cn-p36-figure1.png)

<!-- Source CN PDF p.36, block 198 -->

## 18. 协议分析

<!-- Source CN PDF p.36, block 199 -->

### 18.1 DSI Layer Definitions

<!-- Source CN PDF p.36, block 200 -->

![原文技术图 — PDF 36](/docs/rockchip-mipi-dsi2/assets/cn-p36-figure2.png)

<!-- Source CN PDF p.37, block 201 -->

### 18.2 D Option

<!-- Source CN PDF p.37, block 202 -->

#### 18.2.1 Lane states and line levels

<!-- Source CN PDF p.37, block 203 -->

![原文技术图 — PDF 37](/docs/rockchip-mipi-dsi2/assets/cn-p37-figure1.png)

<!-- Source CN PDF p.37, block 204 -->

下表罗列在 DPHY Lane 正常操作中可能出现的所有通道状态。

<!-- Source CN PDF p.37, block 205 -->

![原文技术图 — PDF 37](/docs/rockchip-mipi-dsi2/assets/cn-p37-figure2.png)

原图可编辑转录：

| State | Dp-Line | Dn-Line | HS Burst | LP Control | LP Escape |
|---|---|---|---|---|---|
| HS-0 | HS Low | HS High | Differential-0 | N/A (1) | N/A (1) |
| HS-1 | HS High | HS Low | Differential-1 | N/A (1) | N/A (1) |
| LP-00 | LP Low | LP Low | N/A | Bridge | Space |
| LP-01 | LP Low | LP High | N/A | HS-Rqst | Mark-0 |
| LP-10 | LP High | LP Low | N/A | LP-Rqst | Mark-1 |
| LP-11 | LP High | LP High | N/A | Stop | N/A (2) |

(1) 高速传输期间低功耗接收器观察到 LP-00。(2) Escape 模式出现 LP-11 时，线路回到 Stop 状态（Control Mode LP-11）。

<!-- Source CN PDF p.38, block 206 -->

#### 18.2.2 Global Operation Flow Diagram

<!-- Source CN PDF p.38, block 207 -->

![原文技术图 — PDF 38](/docs/rockchip-mipi-dsi2/assets/cn-p38-figure1.png)

<!-- Source CN PDF p.38, block 208 -->

DSI 数据通道可以驱动到如下三种模式：

<!-- Source CN PDF p.38, block 209 -->

1\. Escape Mode (只有 Dp0/Dn0 会操作在该模式)；

<!-- Source CN PDF p.38, block 210 -->

2\. Bus Turnaround Request (只有 Dp0/Dn0 会操作在该模式);

<!-- Source CN PDF p.38, block 211 -->

3\. High-Speed Data Transmission。

<!-- Source CN PDF p.38, block 212 -->

这三种模式和它们进入对应模式的序列定义如下：

<!-- Source CN PDF p.38, block 213 -->

![原文技术图 — PDF 38](/docs/rockchip-mipi-dsi2/assets/cn-p38-figure2.png)

原图可编辑转录：

| Mode | Entry | Exit |
|---|---|---|
| Escape Mode | LP-11 → LP-10 → LP-00 → LP-01 → LP-00 | LP-00 → LP-10 → LP-11 (Mark-1) |
| High-Speed Data Transmission | LP-11 → LP-01 → LP-00 → HS-0 | (HS-0 or HS-1) → LP-11 |
| Bus Turnaround Request | LP-11 → LP-10 → LP-00 → LP-10 → LP-00 | Hi-Z |

<!-- Source CN PDF p.38, block 214 -->

##### 18.2.2.1 Escape Modes

<!-- Source CN PDF p.38, block 215 -->

当数据通道处于 LP 模式，数据通道0用于 Escape Mode, 数据通道应通过 LP-11->LP-10->LP-00->LP-01->LP-00 进入Escape Mode，通过 LP-00->LP-10->LP-11 退出 Escape Mode.

<!-- Source CN PDF p.39, block 216 -->

![原文技术图 — PDF 39](/docs/rockchip-mipi-dsi2/assets/cn-p39-figure1.png)

<!-- Source CN PDF p.39, block 217 -->

###### 18.2.2.1.1 Escape Commands

<!-- Source CN PDF p.39, block 218 -->

一旦数据通道进入 Escape 模式， 发送器应该发送 8-bit Escape Comands 指示请求行为，Escape Comands 如下：

<!-- Source CN PDF p.39, block 219 -->

![原文技术图 — PDF 39](/docs/rockchip-mipi-dsi2/assets/cn-p39-figure2.png)

原图可编辑转录：

| Escape command | Type | First → last bit transmitted | Dn | D0 |
|---|---|---|---|---|
| Low-Power Data Transmission | Mode | 1110 0001 b | - | X |
| Ultra-Low Power Mode | Mode | 0001 1110 b | X | X |
| Undefined-1 (1) | Mode | 1001 1111 b | - | - |
| Undefined-2 (1) | Mode | 1101 1110 b | - | - |
| Remote Application Reset | Trigger | 0110 0010 b | - | X |
| Acknowledge | Trigger | 0010 0001 b | - | X |
| Unknown-5 (1) | Trigger | 1010 0000 b | - | - |

(1) 显示模组未实现此 Escape 命令支持。n=1；X=支持；-=不支持。

<!-- Source CN PDF p.39, block 220 -->

###### 18.2.2.1.2 LPDT

<!-- Source CN PDF p.39, block 221 -->

当数据通道进入 Escape 模式且向显示模块发送 Low-Power Data Transmission(LPDT) 序列，Soc 的 MIPI DSI TX 可以通过 LPDT 模式向显示模块发送数据, 一般就是通过这种方式向 MIPI 显示模块下载初始化序列。

<!-- Source CN PDF p.40, block 222 -->

![原文技术图 — PDF 40](/docs/rockchip-mipi-dsi2/assets/cn-p40-figure1.png)

<!-- Source CN PDF p.40, block 223 -->

通过示波器捕获 LPDT 波形如下：

<!-- Source CN PDF p.40, block 224 -->

![原文技术图 — PDF 40](/docs/rockchip-mipi-dsi2/assets/cn-p40-figure2.png)

<!-- Source CN PDF p.41, block 225 -->

###### 18.2.2.1.3 ULPS

<!-- Source CN PDF p.41, block 226 -->

![原文技术图 — PDF 41](/docs/rockchip-mipi-dsi2/assets/cn-p41-figure1.png)

<!-- Source CN PDF p.41, block 227 -->

##### 18.2.2.2 HSDT

<!-- Source CN PDF p.41, block 228 -->

当 DPHY 的时钟通道在高速时钟模式时，显示模块可以进入高速数据传输模式，所有的数据通道同时进入高速数据传输模式，但可以不同时退出高速模式。数据通道通过如下序列进入高速模式：

<!-- Source CN PDF p.41, block 229 -->

LP-11 -> LP-01 -> LP-00 -> HS-0 -> SoT(0001_1101).

<!-- Source CN PDF p.41, block 230 -->

```text
1. Start: LP-11
2. HS-Request: LP-01
3. HS-Settle: LP-00 -> HS-0 (RX: Lane Termination Enable)
4. Rx Synchronization: SoT(0001_1101)
5. End: High-Speed Data Transmission (HSDT) - Ready to receive High-Speed Data Load
```

<!-- Source CN PDF p.41, block 231 -->

数据通道退出高速数据传输模式流程：在最后一个有效负载数据之后立即切换差分状态位并保持该状态一段时间 Ths-trail。

<!-- Source CN PDF p.41, block 232 -->

![原文技术图 — PDF 41](/docs/rockchip-mipi-dsi2/assets/cn-p41-figure2.png)

<!-- Source CN PDF p.41, block 233 -->

通过示波器捕获 HSDT 波形如下：

<!-- Source CN PDF p.42, block 234 -->

![原文技术图 — PDF 42](/docs/rockchip-mipi-dsi2/assets/cn-p42-figure1.png)

<!-- Source CN PDF p.42, block 235 -->

##### 18.2.2.3 BTA

<!-- Source CN PDF p.42, block 236 -->

当需要从显示模块获取信息时，Soc DPHY 的第一数据通道可以通过执行总线翻转步骤。操作步骤如下：

<!-- Source CN PDF p.42, block 237 -->

![原文技术图 — PDF 42](/docs/rockchip-mipi-dsi2/assets/cn-p42-figure2.png)

原图可编辑转录：

BTA 步骤：MCU 从 LP-11 开始；请求序列 LP-11 → LP-10 → LP-00 → LP-10 → LP-00；MCU 等待模组接管 D0P/N 并停止驱动（High-Z）；模组再以 LP-00 → LP-10 → LP-11 进入 Stop。

<!-- Source CN PDF p.42, block 238 -->

通过示波器在 HSDT 时向显示模块回读并捕获 BTA 波形如下：

<!-- Source CN PDF p.43, block 239 -->

![原文技术图 — PDF 43](/docs/rockchip-mipi-dsi2/assets/cn-p43-figure1.png)

<!-- Source CN PDF p.43, block 240 -->

#### 18.2.3 Endian Policy

<!-- Source CN PDF p.43, block 241 -->

无论是在 LP 和 HS 数据传输模式，数据都是以长包和短包形式打包并传输给显示模块。

<!-- Source CN PDF p.43, block 242 -->

##### 18.2.3.1 SPa

<!-- Source CN PDF p.43, block 243 -->

![原文技术图 — PDF 43](/docs/rockchip-mipi-dsi2/assets/cn-p43-figure2.png)

<!-- Source CN PDF p.43, block 244 -->

Example:

<!-- Source CN PDF p.43, block 245 -->

![原文技术图 — PDF 43](/docs/rockchip-mipi-dsi2/assets/cn-p43-figure3.png)

<!-- Source CN PDF p.44, block 246 -->

###### 18.2.3.1.1 LPDT-SPa

<!-- Source CN PDF p.44, block 247 -->

通过示波器在 LPDT 时向显示模块发送如上 SPa 并捕获波形如下：

<!-- Source CN PDF p.44, block 248 -->

![原文技术图 — PDF 44](/docs/rockchip-mipi-dsi2/assets/cn-p44-figure1.png)

<!-- Source CN PDF p.44, block 249 -->

###### 18.2.3.1.2 HSDT-SPa

<!-- Source CN PDF p.44, block 250 -->

通过示波器在 HSDT 时向显示模块发送如上 SPa 并捕获波形如下：

<!-- Source CN PDF p.44, block 251 -->

![原文技术图 — PDF 44](/docs/rockchip-mipi-dsi2/assets/cn-p44-figure2.png)

<!-- Source CN PDF p.45, block 252 -->

##### 18.2.3.2 LPa

<!-- Source CN PDF p.45, block 253 -->

![原文技术图 — PDF 45](/docs/rockchip-mipi-dsi2/assets/cn-p45-figure1.png)

<!-- Source CN PDF p.45, block 254 -->

Example:

<!-- Source CN PDF p.45, block 255 -->

![原文技术图 — PDF 45](/docs/rockchip-mipi-dsi2/assets/cn-p45-figure2.png)

<!-- Source CN PDF p.46, block 256 -->

###### 18.2.3.2.1 LPDT-LPa

<!-- Source CN PDF p.46, block 257 -->

通过示波器在 LPDT 时向显示模块发送如上 LPa 并捕获波形如下：

<!-- Source CN PDF p.46, block 258 -->

![原文技术图 — PDF 46](/docs/rockchip-mipi-dsi2/assets/cn-p46-figure1.png)

<!-- Source CN PDF p.46, block 259 -->

###### 18.2.3.2.2 HSDT-LPa

<!-- Source CN PDF p.46, block 260 -->

通过示波器在 HSDT 时向显示模块发送如上 LPa 并捕获波形如下：

<!-- Source CN PDF p.46, block 261 -->

![原文技术图 — PDF 46](/docs/rockchip-mipi-dsi2/assets/cn-p46-figure2.png)

<!-- Source CN PDF p.46, block 262 -->

##### 18.2.3.3 DI

<!-- Source CN PDF p.46, block 263 -->

如上 SPa 和 LPa 中都有一个 Data Identification (DI), 一个包是长短包就是由 DI 决定，DI 是包头的一部分，由两个部分组成：

<!-- Source CN PDF p.47, block 264 -->

![原文技术图 — PDF 47](/docs/rockchip-mipi-dsi2/assets/cn-p47-figure1.png)

原图可编辑转录：

| DI field | Bits | Width |
|---|---|---|
| VC (Virtual Channel) | DI[7:6] | 2 |
| DT (Data Type) | DI[5:0] | 6 |

<!-- Source CN PDF p.47, block 265 -->

MIPI 协议中目前定义的绝大部分数据类型如下：

<!-- Source CN PDF p.48, block 266 -->

![原文技术图 — PDF 48](/docs/rockchip-mipi-dsi2/assets/cn-p48-figure1.png)

原图可编辑转录：

| 数据类型 (hex) | 二进制 | 说明 | 包类型 |
| --- | --- | --- | --- |
| 0x01 | 00 0001 | 同步事件：V Sync 开始 | 短包 |
| 0x11 | 01 0001 | 同步事件：V Sync 结束 | 短包 |
| 0x21 | 10 0001 | 同步事件：H Sync 开始 | 短包 |
| 0x31 | 11 0001 | 同步事件：H Sync 结束 | 短包 |
| 0x07 | 00 0111 | 压缩模式命令 | 短包 |
| 0x08 | 00 1000 | 传输结束包 EoTp | 短包 |
| 0x02 | 00 0010 | 关闭颜色模式 CM | 短包 |
| 0x12 | 01 0010 | 开启颜色模式 CM | 短包 |
| 0x22 | 10 0010 | 关闭外设命令 | 短包 |
| 0x32 | 11 0010 | 开启外设命令 | 短包 |
| 0x03 | 00 0011 | 通用短写，无参数 | 短包 |
| 0x13 | 01 0011 | 通用短写，1 参数 | 短包 |
| 0x23 | 10 0011 | 通用短写，2 参数 | 短包 |
| 0x04 | 00 0100 | 通用读，无参数 | 短包 |
| 0x14 | 01 0100 | 通用读，1 参数 | 短包 |
| 0x24 | 10 0100 | 通用读，2 参数 | 短包 |
| 0x05 | 00 0101 | DCS 短写，无参数 | 短包 |
| 0x15 | 01 0101 | DCS 短写，1 参数 | 短包 |
| 0x06 | 00 0110 | DCS 读，无参数 | 短包 |
| 0x16 | 01 0110 | 执行队列 | 短包 |
| 0x37 | 11 0111 | 设置最大返回包大小 | 短包 |
| 0x27 | 10 0111 | 加扰模式命令 | 短包 |
| 0x09 | 00 1001 | 空包，无数据 | 长包 |
| 0x19 | 01 1001 | 消隐包，无数据 | 长包 |
| 0x29 | 10 1001 | 通用长写 | 长包 |
| 0x39 | 11 1001 | DCS 长写/write_LUT 命令包 | 长包 |
| 0x0A | 00 1010 | 图像参数集 PPS | 长包 |
| 0x0B | 00 1011 | 压缩像素流 | 长包 |
| 0x0C | 00 1100 | 松散打包像素流，20-bit YCbCr，4:2:2 格式 | 长包 |

<!-- Source CN PDF p.49, block 267 -->

#### 18.2.4 Video Mode Interface Timing

<!-- Source CN PDF p.49, block 268 -->

##### 18.2.4.1 Vertical Display Timing (Video mode)

<!-- Source CN PDF p.49, block 269 -->

![原文技术图 — PDF 49](/docs/rockchip-mipi-dsi2/assets/cn-p49-figure1.png)

<!-- Source CN PDF p.49, block 270 -->

##### 18.2.4.2 Horizontal Display Timing (Video mode)

<!-- Source CN PDF p.49, block 271 -->

![原文技术图 — PDF 49](/docs/rockchip-mipi-dsi2/assets/cn-p49-figure2.png)

<!-- Source CN PDF p.50, block 272 -->

##### 18.2.4.3 Non-Burst Mode with Sync Pulses

<!-- Source CN PDF p.50, block 273 -->

![原文技术图 — PDF 50](/docs/rockchip-mipi-dsi2/assets/cn-p50-figure1.png)

<!-- Source CN PDF p.50, block 274 -->

通过示波器捕获 Non Burst Sync Pulse 波形如下：

<!-- Source CN PDF p.50, block 275 -->

![原文技术图 — PDF 50](/docs/rockchip-mipi-dsi2/assets/cn-p50-figure2.png)

<!-- Source CN PDF p.51, block 276 -->

##### 18.2.4.4 Burst Mode

<!-- Source CN PDF p.51, block 277 -->

![原文技术图 — PDF 51](/docs/rockchip-mipi-dsi2/assets/cn-p51-figure1.png)

<!-- Source CN PDF p.51, block 278 -->

通过示波器捕获 Video Burst 波形如下：

<!-- Source CN PDF p.51, block 279 -->

![原文技术图 — PDF 51](/docs/rockchip-mipi-dsi2/assets/cn-p51-figure2.png)

<!-- Source CN PDF p.52, block 280 -->

## 19. 常见问题

<!-- Source CN PDF p.52, block 281 -->

### 19.1 查看VOP timing 和 Connector 信息

<!-- Source CN PDF p.52, block 282 -->

```text
console:/ # cat /d/dri/0/summary
Video Port0: DISABLED
Video Port1: DISABLED
Video Port2: DISABLED
Video Port3: ACTIVE
    Connector: DSI-2
        bus_format[100a]: RGB888_1X24
        overlay_mode[0] output_mode[0] color_space[0]
    Display mode: 1080x1920p60
        clk[132000] real_clk[132000] type[48] flag[a]
        H: 1080 1095 1099 1129
        V: 1920 1935 1937 1952
    Cluster3-win0: ACTIVE
        win_id: 6
        format: AB24 little-endian (0x34324241) SDR[0] color_space[0] glb_alpha[0xff]
        rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
        csc: y2r[0] r2y[0] csc mode[0]
        zpos: 0
        src: pos[0, 0] rect[1080 x 1920]
        dst: pos[0, 0] rect[1080 x 1920]
        buf[0]: addr: 0x000000000376e000 pitch: 4352 offset: 0
```

<!-- Source CN PDF p.52, block 283 -->

### 19.2 查看 DSI2 相关 clk tree

<!-- Source CN PDF p.52, block 284 -->

当mipi工作在非DSC模式，mipi接口的速率是每个时钟周期4个pixel，相关时钟要满足如下关系：

<!-- Source CN PDF p.52, block 285 -->

video_timing_pixel_rate / 4 = mipi_pixel_clock × K = dclk_out × K= dclk_core

<!-- Source CN PDF p.52, block 286 -->

当mipi工作在DSC模式，相关时钟要满足如下关系：

<!-- Source CN PDF p.52, block 287 -->

mipi_pixel_clock = cds_clk / 2

<!-- Source CN PDF p.52, block 288 -->

注意! 默认K = 1, 当mipi配置为双通道显示模式，K = 2。

<!-- Source CN PDF p.52, block 289 -->

```text
console:/ # cat /d/clk/clk_summary | grep vop
    clk_vop_pmu 0 0 0 24000000 0 0 50000
          dclk_vop3 1 2 0 33000000 0 0 50000
          dclk_vop1_src 0 1 0 594000000 0 0 50000
             dclk_vop1 0 1 0 594000000 0 0 50000
          dclk_vop0_src 0 1 0 594000000 0 0 50000
             dclk_vop0 0 1 0 594000000 0 0 50000
             aclk_vop_low_root 1 1 0 396000000 0 0 50000
             hclk_vop_root 2 4 0 198000000 0 0 50000
                hclk_vop 1 3 0 198000000 0 0 50000
          aclk_vop_root 1 1 0 500000000 0 0 50000
             aclk_vop_doby 0 0 0 500000000 0 0 50000
             aclk_vop_sub_src 1 1 0 500000000 0 0 50000
                aclk_vop 1 4 0 500000000 0 0 50000
             pclk_vop_root 3 5 0 100000000 0 0 50000
          dclk_vop2_src 1 1 0 148500000 0 0 50000
             dclk_vop2 1 2 0 148500000 0 0 50000
console:/ # cat /d/clk/clk_summary | grep dsi
                pclk_dsihost1 1 2 0 100000000 0 0 50000
                pclk_dsihost0 1 2 0 100000000 0 0 50000
    clk_dsihost1 1 2 0 351000000 0 0 50000
    clk_dsihost0 1 2 0 351000000 0 0 50000
console:/ # cat /d/clk/clk_summary | grep mipi
          mipi1_clk_src 0 0 0 33000000 0 0 50000
             mipi1_pixclk 0 0 0 33000000 0 0 50000
          mipi0_clk_src 0 0 0 148500000 0 0 50000
             mipi0_pixclk 0 0 0 148500000 0 0 50000
    clk_usbdpphy_mipidcpphy_ref 5 5 0 24000000 0 0 50000
    clk_mipi_camaraout_m4 0 0 0 24000000 0 0 50000
    clk_mipi_camaraout_m3 0 0 0 24000000 0 0 50000
    clk_mipi_camaraout_m2 0 0 0 24000000 0 0 50000
    clk_mipi_camaraout_m0 0 0 0 24000000 0 0 50000
          clk_mipi_camaraout_m1 0 0 0 37125000 0 0 50000
                pclk_mipi_dcphy1 1 1 0 100000000 0 0 50000
                pclk_mipi_dcphy0 1 1 0 100000000 0 0 50000
console:/ #
```

<!-- Source CN PDF p.53, block 291 -->

### 19.3 如何查看指定 DSI lane 速率

<!-- Source CN PDF p.53, block 292 -->

DSI lane 速率的指定有两种，一种是驱动自动计算:

<!-- Source CN PDF p.53, block 293 -->

```text
dmesg | grep dsi
[ 77.369812] dw-mipi-dsi2 fde20000.dsi: [drm:dw_mipi_dsi2_encoder_enable] final DSI-Link
bandwidth: 879 x 4 Mbps
```

<!-- Source CN PDF p.53, block 294 -->

一种是通过如下属性手动指定:

<!-- Source CN PDF p.53, block 295 -->

```text
&dsi0 {
    ...
    rockchip,lane-rate = <1000>;
    ...
}
```

<!-- Source CN PDF p.54, block 296 -->

### 19.4 MIPI DSI2 HOST 没有自己color bar 功能，通过如下命令可以让VOP2 投显 color bar

<!-- Source CN PDF p.54, block 297 -->

根据显示路由选择对应的命令:

<!-- Source CN PDF p.54, block 298 -->

#### 19.4.1 RK3588

<!-- Source CN PDF p.54, block 299 -->

```text
vp0:
io -4 0xfdd90c08 0x1 && io -4 0xfdd90000 0xffffffff
vp1:
io -4 0xfdd90d08 0x1 && io -4 0xfdd90000 0xffffffff
vp2:
io -4 0xfdd90e08 0x1 && io -4 0xfdd90000 0xffffffff
vp3:
io -4 0xfdd90f08 0x1 && io -4 0xfdd90000 0xffffffff
```

<!-- Source CN PDF p.54, block 300 -->

#### 19.4.2 RK3576

<!-- Source CN PDF p.54, block 301 -->

```text
vp0:
io -4 0x27d00c08 0x1 && io -4 0x27d00000 0xffffffff
vp1:
io -4 0x27d00d08 0x1 && io -4 0x27d00000 0xffffffff
vp2:
io -4 0x27d00e08 0x1 && io -4 0x27d00000 0xffffffff
```

<!-- Source CN PDF p.54, block 302 -->

### 19.5 如何判断显示异常的时候，MIPI DSI2 和 panel 是否通信正常

<!-- Source CN PDF p.54, block 303 -->

uboot:

<!-- Source CN PDF p.54, block 304 -->

```text
--- a/drivers/video/drm/rockchip_panel.c
+++ b/drivers/video/drm/rockchip_panel.c
@@ -260,6 +260,7 @@ static void panel_simple_prepare(struct rockchip_panel *panel)
    struct rockchip_panel_priv *priv = dev_get_priv(panel->dev);
    struct mipi_dsi_device *dsi = dev_get_parent_platdata(panel->dev);
    int ret;
+ u8 mode;
    if (priv->prepared)
        return;
@@ -285,6 +286,8 @@ static void panel_simple_prepare(struct rockchip_panel *panel)
    if (plat->delay.init)
        mdelay(plat->delay.init);
+ mipi_dsi_dcs_get_power_mode(dsi, &mode);
+ printf("===>mode: 0x%x\n", mode);
    if (plat->on_cmds) {
        if (priv->cmd_type == CMD_TYPE_SPI)
            ret = rockchip_panel_send_spi_cmds(panel->state,
@@ -298,6 +301,8 @@ static void panel_simple_prepare(struct rockchip_panel *panel)
            printf("failed to send on cmds: %d\n", ret);
    }
+ mipi_dsi_dcs_get_power_mode(dsi, &mode);
+ printf("===>mode: 0x%x\n", mode);
    priv->prepared = true;
 }
```

<!-- Source CN PDF p.55, block 306 -->

kernel

<!-- Source CN PDF p.55, block 307 -->

```text
--- a/drivers/gpu/drm/panel/panel-simple.c
+++ b/drivers/gpu/drm/panel/panel-simple.c
@@ -506,6 +506,7 @@ static int panel_simple_prepare(struct drm_panel *panel)
    unsigned int delay;
    int err;
    int hpd_asserted;
+ u8 mode;
    if (p->prepared)
        return 0;
@@ -554,6 +555,8 @@ static int panel_simple_prepare(struct drm_panel *panel)
        }
    }
+ mipi_dsi_dcs_get_power_mode(p->dsi, &mode);
+ printk("===>mode: 0x%x\n", mode);
    if (p->desc->init_seq)
        if (p->dsi)
            panel_simple_xfer_dsi_cmd_seq(p, p->desc->init_seq);
@@ -561,6 +564,9 @@ static int panel_simple_prepare(struct drm_panel *panel)
    if (p->desc->delay.init)
        msleep(p->desc->delay.init);
+ mipi_dsi_dcs_get_power_mode(p->dsi, &mode);
+ printk("===>mode: 0x%x\n", mode);
+
    p->prepared = true;
    return 0;
```

<!-- Source CN PDF p.55, block 308 -->

通信正常会有如下打印,否者排查屏端时序确保屏是否就绪：

<!-- Source CN PDF p.56, block 309 -->

```text
===> mode: 0x8
===> mode: 0x9c
```

<!-- Source CN PDF p.56, block 310 -->

#### 19.5.1 get_power_mode 两种回读波形

<!-- Source CN PDF p.56, block 311 -->

##### 19.5.1.1 屏端正常返回0x08(未下发0x11、0x29)波形如下

<!-- Source CN PDF p.56, block 312 -->

![原文技术图 — PDF 56](/docs/rockchip-mipi-dsi2/assets/cn-p56-figure1.png)

<!-- Source CN PDF p.57, block 313 -->

##### 19.5.1.2 屏端正常返回0x9c(已下发0x11、0x29)波形如下

<!-- Source CN PDF p.57, block 314 -->

![原文技术图 — PDF 57](/docs/rockchip-mipi-dsi2/assets/cn-p57-figure1.png)

<!-- Source CN PDF p.57, block 315 -->

### 19.6 drm 驱动没有bind起来

<!-- Source CN PDF p.57, block 316 -->

通过如下命令，查看是否是某个组件 bound 异常，比如 DP 的 PHY 没有使能会导致 DP bound 异常:

<!-- Source CN PDF p.57, block 317 -->

```text
/sys/kernel/debug/device_component/display-subsystem <
master name status
-------------------------------------------------------------
display-subsystem bound
device name status
-------------------------------------------------------------
fdd90000.vop bound
fde20000.dsi bound
fde30000.dsi bound
fde50000.dp bound
```

<!-- Source CN PDF p.57, block 318 -->

### 19.7 backlight驱动probe失败

<!-- Source CN PDF p.57, block 319 -->

```text
console:/ # dmesg | grep backlight
[ 3.164274] pwm-backlight: probe of backlight failed with error -16
```

<!-- Source CN PDF p.58, block 320 -->

### 19.8 Command Mode 显示模组如何配置 TE

<!-- Source CN PDF p.58, block 321 -->

为防止图像显示撕裂，显示控制器刷帧的频率应该和显示模组从GRAM中刷图的频率保持一致。RK3588 和 RK3576只支持显示模组将TE信号外部反馈的方式。

<!-- Source CN PDF p.58, block 322 -->

#### 19.8.1 硬件 TE

<!-- Source CN PDF p.58, block 323 -->

MIPI DSI 有专⻔的 PIN 可以复用成 te。

<!-- Source CN PDF p.58, block 324 -->

```text
&dsi0 {
    ...
    /* 显示模组TE信号连接到MIPI_TE0 */
    pinctrl-names = "default";
    pinctrl-0 = <&mipi_te0>;
    ...
};
&dsi1 {
    ...
    /* 显示模组TE信号连接到MIPI_TE1，only RK3588 support dsi1 */
    pinctrl-names = "default";
    pinctrl-0 = <&mipi_te1>;
    ...
};
```

<!-- Source CN PDF p.58, block 325 -->

#### 19.8.2 软件 TE

<!-- Source CN PDF p.58, block 326 -->

有时候硬件 TE 会被复用成其他功能，所以可以利用其他空闲 GPIO 作为输入来向显示系统通知 TE 中断。

<!-- Source CN PDF p.58, block 327 -->

```text
&dsi0 {
    status = "okay";
    te-gpios = <&gpio0 RK_PC4 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&lcd_te_gpio>;
};
```

<!-- Source CN PDF p.58, block 328 -->

下图捕获MIPI DSI发送数据信号场频和显示模组TE信号频率一致波形：

<!-- Source CN PDF p.59, block 329 -->

![原文技术图 — PDF 59](/docs/rockchip-mipi-dsi2/assets/cn-p59-figure1.png)

<!-- Source CN PDF p.59, block 330 -->

### 19.9 双通道MIPI切换主从顺序

<!-- Source CN PDF p.59, block 331 -->

如果硬件设计将双通道的两个MIPI Ports接反了，可以通过如下配置进行软件纠正：

<!-- Source CN PDF p.59, block 332 -->

```text
&dsi0 {
    ...
    rockchip,data-swap;
    rockchip,dual-channel = <&dsi1>;
    ...
};
&dsi1 {
    status = "okay";
};
```

<!-- Source CN PDF p.59, block 333 -->

### 19.10 调试节点

<!-- Source CN PDF p.59, block 334 -->

在MIPI DSI信号测试过程中需要对信号进行调整，如下是相关调试节点路径：

<!-- Source CN PDF p.59, block 335 -->

```text
dcphy0：
cd /sys/devices/platform/feda0000.phy/
dcphy1：
cd /sys/devices/platform/fedb0000.phy/
```

<!-- Source CN PDF p.60, block 336 -->

#### 19.10.1 Patch

<!-- Source CN PDF p.60, block 337 -->

```diff
diff --git a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
index cd6b615228d9..26bb1d030d08 100644
--- a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
@@ -219,6 +219,25 @@
 #define RX_S0D3_DESKEW_CON4 (0xF50)
 #define RX_S0D3_ADI_STAT0 (0XFEC)
 #define MIPI_DCPHY_MAX_REGISGER RX_S0D3_ADI_STAT0
+#define REG_400M_MASK GENMASK(6, 4)
+#define REG_400M(x) UPDATE(x, 6, 4)
+#define REG_645M_MASK GENMASK(2, 0)
+#define REG_645M(x) UPDATE(x, 2, 0)
+
+#define BIAS_CON4 0x0010
+#define I_MUX_SEL_MASK GENMASK(6, 5)
+#define I_MUX_SEL(x) UPDATE(x, 6, 5)
+#define CAP_PEAKING_MASK GENMASK(14, 8)
+#define RES_UP_MASK GENMASK(7, 4)
+#define RES_UP(x) UPDATE(x, 7, 4)
+#define RES_DN_MASK GENMASK(3, 0)
+#define RES_DN(x) UPDATE(x, 3, 0)
+#define T_HS_ZERO_MASK GENMASK(15, 8)
+#define T_HS_PREPARE_MASK GENMASK(7, 0)
+#define T_HS_EXIT_MASK GENMASK(15, 8)
+#define T_HS_TRAIL_MASK GENMASK(7, 0)
+#define T_TA_GET_MASK GENMASK(7, 4)
+#define T_TA_GO_MASK GENMASK(3, 0)
 struct samsung_mipi_dphy_timing {
    unsigned int max_lane_mbps;
@@ -1780,10 +1799,10 @@ static struct v4l2_subdev *get_remote_sensor(struct v4l2_subdev *sd);
 static int samsung_mipi_dcphy_power_on(struct phy *phy)
 {
    struct samsung_mipi_dcphy *samsung = phy_get_drvdata(phy);
- enum phy_mode mode = phy_get_mode(phy);
    int on = 0;
    struct v4l2_subdev *sensor_sd = NULL;
+ samsung->mode = phy_get_mode(phy);
    pm_runtime_get_sync(samsung->dev);
    reset_control_assert(samsung->apb_rst);
    udelay(1);
@@ -1801,7 +1820,7 @@ static int samsung_mipi_dcphy_power_on(struct phy *phy)
                     RKMODULE_SET_QUICK_STREAM, &on);
    }
- switch (mode) {
+ switch (samsung->mode) {
    case PHY_MODE_MIPI_DPHY:
        samsung_mipi_dphy_power_on(samsung);
        break;
@@ -2381,6 +2400,467 @@ static const struct regmap_config samsung_mipi_dcphy_regmap_config = {
    .max_register = MIPI_DCPHY_MAX_REGISGER,
 };
+static ssize_t
+reg_645m_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, BIAS_CON2, &val);
+ level = (val & REG_645M_MASK) >> 4;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+reg_645m_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 7)
+ val = 7;
+
+ regmap_update_bits(samsung->regmap, BIAS_CON2, REG_645M_MASK, REG_645M(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(reg_645m);
+
+static ssize_t
+reg_400m_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, BIAS_CON2, &val);
+ level = (val & REG_400M_MASK) >> 4;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+reg_400m_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 7)
+ val = 7;
+
+ regmap_update_bits(samsung->regmap, BIAS_CON2, REG_400M_MASK, REG_400M(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(reg_400m);
+
+static ssize_t
+cap_peaking_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, COMBO_MD0_ANA_CON0, &val);
+ level = (val & CAP_PEAKING_MASK) >> 12;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+cap_peaking_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 7)
+ val = 7;
+
+ regmap_update_bits(samsung->regmap, DPHY_MC_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+
+ return count;
+}
+static DEVICE_ATTR_RW(cap_peaking);
+
+static ssize_t
+res_up_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, COMBO_MD0_ANA_CON0, &val);
+ level = (val & RES_UP_MASK) >> 4;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+res_up_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 15)
+ val = 15;
+
+ regmap_update_bits(samsung->regmap, DPHY_MC_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD0_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD1_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD2_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, DPHY_MD3_ANA_CON0, RES_UP_MASK, RES_UP(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(res_up);
+
+static ssize_t
+res_dn_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, COMBO_MD0_ANA_CON0, &val);
+ level = (val & RES_DN_MASK);
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+res_dn_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 15)
+ val = 15;
+
+ regmap_update_bits(samsung->regmap, DPHY_MC_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD0_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD1_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD2_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, DPHY_MD3_ANA_CON0, RES_DN_MASK, RES_DN(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(res_dn);
+
+static ssize_t
+output_voltage_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, BIAS_CON4, &val);
+ level = (val & I_MUX_SEL_MASK) >> 5;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+output_voltage_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 3)
+ val = 3;
+
+ regmap_update_bits(samsung->regmap, BIAS_CON4,
+ I_MUX_SEL_MASK, I_MUX_SEL(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(output_voltage);
+
+static ssize_t
+hs_exit_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_exit;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON2, &val);
+ hs_exit = (val & GENMASK(15, 8)) >> 8;
+
+ return sprintf(buf, "%d\n", hs_exit);
+
+}
+
+static ssize_t hs_exit_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_exit;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_exit = T_HS_EXIT(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_exit);
+
+static ssize_t
+hs_trail_or_post_3_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_trail;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON2, &val);
+ hs_trail = val & GENMASK(7, 0);
+
+ return sprintf(buf, "%d\n", hs_trail);
+
+}
+
+static ssize_t hs_trail_or_post_3_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_trail;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_trail = T_HS_TRAIL(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_trail_or_post_3);
+
+static ssize_t
+hs_zero_or_prebegin_3_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_zero;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON1, &val);
+ hs_zero = (val & GENMASK(15, 8)) >> 8;
+
+ return sprintf(buf, "%d\n", hs_zero);
+
+}
+
+static ssize_t hs_zero_or_prebegin_3_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_zero;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_zero = T_HS_ZERO(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_zero_or_prebegin_3);
+
+static ssize_t
+hs_prepare_or_prepare_3_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_prepare;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON1, &val);
+ hs_prepare = val & GENMASK(7, 0);
+
+ return sprintf(buf, "%d\n", hs_prepare);
+}
+
+static ssize_t hs_prepare_or_prepare_3_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_prepare;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_prepare = T_HS_PREPARE(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_prepare_or_prepare_3);
+
+static ssize_t
+lpx_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int lpx;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON0, &val);
+ lpx = (val & GENMASK(11, 4)) >> 4;
+
+ return sprintf(buf, "%d\n", lpx);
+
+}
+
+static ssize_t lpx_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long lpx = 0;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ lpx |= T_LPX(val);
+ /* T_LP_EXIT_SKEW/T_LP_ENTRY_SKEW unconfig */
+ regmap_write(samsung->regmap, COMBO_MD0_TIME_CON0, lpx);
+ regmap_write(samsung->regmap, COMBO_MD1_TIME_CON0, lpx);
+ regmap_write(samsung->regmap, COMBO_MD2_TIME_CON0, lpx);
+
+ if (!samsung->c_option) {
+ regmap_write(samsung->regmap, DPHY_MC_TIME_CON0, lpx);
+ regmap_write(samsung->regmap, DPHY_MD3_TIME_CON0, lpx);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(lpx);
+
+static struct attribute *samsung_mipi_dcphy_cts_attrs[] = {
+ &dev_attr_lpx.attr,
+ &dev_attr_hs_prepare_or_prepare_3.attr,
+ &dev_attr_hs_zero_or_prebegin_3.attr,
+ &dev_attr_hs_trail_or_post_3.attr,
+ &dev_attr_hs_exit.attr,
+ &dev_attr_output_voltage.attr,
+ &dev_attr_res_up.attr,
+ &dev_attr_res_dn.attr,
+ &dev_attr_cap_peaking.attr,
+ &dev_attr_reg_400m.attr,
+ &dev_attr_reg_645m.attr,
+ NULL
+};
+
+static const struct attribute_group samsung_mipi_dcphy_cts_attr_group = {
+ .attrs = samsung_mipi_dcphy_cts_attrs,
+};
+
+static int samsung_mipi_dcphy_cts_sysfs_add(struct samsung_mipi_dcphy *samsung)
+{
+ struct device *dev = samsung->dev;
+ int ret;
+
+ ret = sysfs_create_group(&dev->kobj, &samsung_mipi_dcphy_cts_attr_group);
+ if (ret) {
+ dev_err(dev, "failed to register sysfs. err: %d\n", ret);
+ return ret;
+ };
+
+ return 0;
+}
+
+
 static int samsung_mipi_dcphy_probe(struct platform_device *pdev)
 {
    struct device *dev = &pdev->dev;
@@ -2474,6 +2954,7 @@ static int samsung_mipi_dcphy_probe(struct platform_device *pdev)
    samsung->stream_off = samsung_dcphy_rx_stream_off;
    mutex_init(&samsung->mutex);
    pm_runtime_enable(dev);
+ samsung_mipi_dcphy_cts_sysfs_add(samsung);
    return 0;
 }
diff --git a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h
index b5e827d7cfc1..a53356c0eed6 100644
--- a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h
+++ b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h
@@ -48,6 +48,7 @@ struct samsung_mipi_dcphy {
    struct clk *pclk;
    struct regmap *regmap;
    struct regmap *grf_regmap;
+ int mode;
    struct reset_control *m_phy_rst;
    struct reset_control *s_phy_rst;
    struct reset_control *apb_rst;
```

<!-- Source CN PDF p.70, block 357 -->

#### 19.10.2 驱动强度

<!-- Source CN PDF p.70, block 358 -->

##### 19.10.2.1 Output Voltage(400mV/200mV/530mV) selction pin

<!-- Source CN PDF p.70, block 359 -->

```text
echo level > output_voltage
```

<!-- Source CN PDF p.70, block 360 -->

驱动默认如下配置：

<!-- Source CN PDF p.70, block 361 -->

1\. D-PHY: 2'b00

<!-- Source CN PDF p.70, block 362 -->

2\. C-PHY: 2'b10

<!-- Source CN PDF p.70, block 363 -->

level 参考如下：

<!-- Source CN PDF p.70, block 364 -->

1\. 2b'00 : 400mV

<!-- Source CN PDF p.70, block 365 -->

2\. 2b'01 : 200mV

<!-- Source CN PDF p.70, block 366 -->

3\. 2b'10 : 530mV

<!-- Source CN PDF p.70, block 367 -->

4\. 2b'11 : 530mV

<!-- Source CN PDF p.70, block 368 -->

##### 19.10.2.2 LP 共模电压

<!-- Source CN PDF p.70, block 369 -->

```text
echo level > reg_645m
```

<!-- Source CN PDF p.70, block 370 -->

level 参考如下：

<!-- Source CN PDF p.70, block 371 -->

Reference voltage-645mV for LP Function control pin

<!-- Source CN PDF p.71, block 372 -->

1\. 3'b000: 605mV

<!-- Source CN PDF p.71, block 373 -->

2\. 3'b001: 625mV

<!-- Source CN PDF p.71, block 374 -->

3\. 3'b010: 635mV

<!-- Source CN PDF p.71, block 375 -->

4\. 3'b011: 645mV

<!-- Source CN PDF p.71, block 376 -->

5\. 3'b100: 655mV

<!-- Source CN PDF p.71, block 377 -->

6\. 3'b101: 665mV

<!-- Source CN PDF p.71, block 378 -->

7\. 3'b110: 685mV

<!-- Source CN PDF p.71, block 379 -->

8\. 3'b111: 725mV

<!-- Source CN PDF p.71, block 380 -->

##### 19.10.2.3 HS 共模电压

<!-- Source CN PDF p.71, block 381 -->

```text
echo level > reg_400m
```

<!-- Source CN PDF p.71, block 382 -->

level 参考如下：

<!-- Source CN PDF p.71, block 383 -->

1\. 3'b000: 380mV / 230mV

<!-- Source CN PDF p.71, block 384 -->

2\. 3'b001: 390mV / 220mV

<!-- Source CN PDF p.71, block 385 -->

3\. 3'b010: 400mV / 210mV

<!-- Source CN PDF p.71, block 386 -->

4\. 3'b011: 410mV / 200mV

<!-- Source CN PDF p.71, block 387 -->

5\. 3'b100: 420mV / 190mV

<!-- Source CN PDF p.71, block 388 -->

6\. 3'b101: 430mV / 180mV

<!-- Source CN PDF p.71, block 389 -->

7\. 3'b110: 440mV / 170mV

<!-- Source CN PDF p.71, block 390 -->

8\. 3'b111: 450mV / 160mV

<!-- Source CN PDF p.71, block 391 -->

##### 19.10.2.4 HS 差模电压

<!-- Source CN PDF p.71, block 392 -->

高速差模电压由如下可配置阻值的上拉、下拉电阻共同决定：

<!-- Source CN PDF p.71, block 393 -->

其中VREG 对应共模电压（REG_400M寄存器配置域）

<!-- Source CN PDF p.71, block 394 -->

###### 19.10.2.4.1 High-Speed Driver Up Resistor Control

<!-- Source CN PDF p.71, block 395 -->

```text
echo level > res_up
```

<!-- Source CN PDF p.71, block 396 -->

level参考如下：

<!-- Source CN PDF p.71, block 397 -->

1\. 4'b0000: 43 ohm

<!-- Source CN PDF p.71, block 398 -->

2\. 4'b0001: 46 ohm

<!-- Source CN PDF p.71, block 399 -->

3\. 4'b0010: 49 ohm

<!-- Source CN PDF p.71, block 400 -->

4\. 4'b0011: 52 ohm

<!-- Source CN PDF p.72, block 401 -->

5\. 4'b0100: 56 ohm

<!-- Source CN PDF p.72, block 402 -->

6\. 4'b0101: 60 ohm

<!-- Source CN PDF p.72, block 403 -->

7\. 4'b0110: 66 ohm

<!-- Source CN PDF p.72, block 404 -->

8\. 4'b0111: 73 ohm

<!-- Source CN PDF p.72, block 405 -->

9\. 4'b1000: 30 ohm

<!-- Source CN PDF p.72, block 406 -->

10\. 4'b1001: 31.2 ohm

<!-- Source CN PDF p.72, block 407 -->

11\. 4'b1010: 32.5 ohm

<!-- Source CN PDF p.72, block 408 -->

12\. 4'b1011: 34 ohm

<!-- Source CN PDF p.72, block 409 -->

13\. 4'b1100: 35.5 ohm

<!-- Source CN PDF p.72, block 410 -->

14\. 4'b1101: 37 ohm

<!-- Source CN PDF p.72, block 411 -->

15\. 4'b1110: 39 ohm

<!-- Source CN PDF p.72, block 412 -->

16\. 4'b1111: 41 ohm

<!-- Source CN PDF p.72, block 413 -->

###### 19.10.2.4.2 High-Speed Driver Down Resistor Control

<!-- Source CN PDF p.72, block 414 -->

```text
echo level > res_dn
```

<!-- Source CN PDF p.72, block 415 -->

level 参考如下：

<!-- Source CN PDF p.72, block 416 -->

1\. 4'b0000: 43 ohm

<!-- Source CN PDF p.72, block 417 -->

2\. 4'b0001: 46 ohm

<!-- Source CN PDF p.72, block 418 -->

3\. 4'b0010: 49 ohm

<!-- Source CN PDF p.72, block 419 -->

4\. 4'b0011: 52 ohm

<!-- Source CN PDF p.72, block 420 -->

5\. 4'b0100: 56 ohm

<!-- Source CN PDF p.72, block 421 -->

6\. 4'b0101: 60 ohm

<!-- Source CN PDF p.72, block 422 -->

7\. 4'b0110: 66 ohm

<!-- Source CN PDF p.72, block 423 -->

8\. 4'b0111: 73 ohm

<!-- Source CN PDF p.72, block 424 -->

9\. 4'b1000: 30 ohm

<!-- Source CN PDF p.72, block 425 -->

10\. 4'b1001: 31.2 ohm

<!-- Source CN PDF p.72, block 426 -->

11\. 4'b1010: 32.5 ohm

<!-- Source CN PDF p.72, block 427 -->

12\. 4'b1011: 34 ohm

<!-- Source CN PDF p.72, block 428 -->

13\. 4'b1100: 35.5 ohm

<!-- Source CN PDF p.72, block 429 -->

14\. 4'b1101: 37 ohm

<!-- Source CN PDF p.72, block 430 -->

15\. 4'b1110: 39 ohm

<!-- Source CN PDF p.72, block 431 -->

16\. 4'b1111: 41 ohm

<!-- Source CN PDF p.73, block 432 -->

##### 19.10.2.5 cap peaking

<!-- Source CN PDF p.73, block 433 -->

![原文技术图 — PDF 73](/docs/rockchip-mipi-dsi2/assets/cn-p73-figure1.png)

原图可编辑转录：

相关寄存器：`M%_COMBO_MD#_ANA_CON0`，offset `0x0708`，范围 `[31:0]`，D-PHY 默认 `0x0000_7333`，C-PHY 默认 `0x0000_1188`。

| Field | Range | Access Tag | RTL Tag | D-PHY | C-PHY |
| --- | --- | --- | --- | --- | --- |
| RESERVED0 | [31:16] | RWi | RWi | 0x0 | 0x0 |
| RESERVED1 | [15] | R/W |  | 0x0 | 0x0 |
| EDGE_CON | [14:12] | R/W |  | 0x7 | 0x1 |
| RESERVED2 | [11:10] | R/W |  | 0x0 | 0x0 |
| EDGE_CON_DIR | [9] | R/W |  | 0x1 | 0x0 |
| EDGE_CON_EN | [8] | R/W |  | 0x1 | 0x1 |
| RES_UP | [7:4] | R/W |  | 0x3 | 0x8 |
| RES_DN | [3:0] | R/W |  | 0x3 | 0x8 |

原图注：所有 `M%_COMBO_MD#_ANA_CON0`、`M%_DPHY_MD#_ANA_CON0` 和 `M%_DPHY_MC_ANA_CON0` 应设置相同值。左图为 cap-peaking 概念图，展示电流、EL 强度、时间、峰化效应及载流子扫出效应。

<!-- Source CN PDF p.73, block 434 -->

![原文技术图 — PDF 73](/docs/rockchip-mipi-dsi2/assets/cn-p73-figure2.png)

原图可编辑转录：

| Field | Value | 含义 |
| --- | --- | --- |
| EDGE_CON | 3'b111 | 高强度 cap-peaking |
| EDGE_CON | 3'b011 | 中强度 cap-peaking |
| EDGE_CON | 3'b001 | 低强度 cap-peaking |
| EDGE_CON | 3'b000 | 关闭，与 EDGE_CON_EN/EDGE_CON_DIR 无关 |
| EDGE_CON_DIR | 1'b0 | D-PHY 后向（更慢转换）；C-PHY 前向（更快转换） |
| EDGE_CON_DIR | 1'b1 | D-PHY 前向（更快转换）；C-PHY 后向（更慢转换） |
| EDGE_CON_EN | 1'b0 | 禁用 |
| EDGE_CON_EN | 1'b1 | 使能 |

`EDGE_CON` 为 thermometer 编码。`RES_UP` 和 `RES_DN` 分别控制高速驱动上拉/下拉电阻，同一编码对应相同阻值。下表忠实保留图内数值，与正文部分档位的 43/46/49/52/56/60/66 ohm 不同，不静默统一。

| RES_UP / RES_DN | ohm | 默认值 |
| --- | --- | --- |
| 4'b0000 | 42 |  |
| 4'b0001 | 44 |  |
| 4'b0010 | 46 |  |
| 4'b0011 | 49 | D-PHY |
| 4'b0100 | 52 |  |
| 4'b0101 | 58 |  |
| 4'b0110 | 64 |  |
| 4'b0111 | 73 |  |
| 4'b1000 | 30 | C-PHY |
| 4'b1001 | 31.2 |  |
| 4'b1010 | 32.5 |  |
| 4'b1011 | 34 |  |
| 4'b1100 | 35.5 |  |
| 4'b1101 | 37 |  |
| 4'b1110 | 39 |  |
| 4'b1111 | 41 |  |

<!-- Source CN PDF p.73, block 435 -->

```text
echo level > cap_peaking
level: 0~7
```

<!-- Source CN PDF p.73, block 436 -->

#### 19.10.3 信号timing

<!-- Source CN PDF p.73, block 437 -->

如下图中信号红色框中的信号参数都是可以调整的。

<!-- Source CN PDF p.73, block 438 -->

![原文技术图 — PDF 73](/docs/rockchip-mipi-dsi2/assets/cn-p73-figure3.png)

<!-- Source CN PDF p.74, block 439 -->

![原文技术图 — PDF 74](/docs/rockchip-mipi-dsi2/assets/cn-p74-figure1.png)

<!-- Source CN PDF p.74, block 440 -->

如下信号调整count值可以在回读基础上做调整修改，比如Tlpx:

<!-- Source CN PDF p.74, block 441 -->

```text
cat lpx
```

<!-- Source CN PDF p.74, block 442 -->

##### 19.10.3.1 Tlpx

<!-- Source CN PDF p.74, block 443 -->

```text
echo count > lpx
```

<!-- Source CN PDF p.74, block 444 -->

##### 19.10.3.2 Ths_prepare_or_prepare_3

<!-- Source CN PDF p.74, block 445 -->

```text
echo count > hs_prepare_or_prepare_3
```

<!-- Source CN PDF p.74, block 446 -->

##### 19.10.3.3 Ths_zero_or_prebegin_3

<!-- Source CN PDF p.74, block 447 -->

```text
echo count > hs_zero_or_prebegin_3
```

<!-- Source CN PDF p.74, block 448 -->

##### 19.10.3.4 Ths_trail_or_post_3

<!-- Source CN PDF p.74, block 449 -->

```text
echo count > hs_trail_or_post_3
```

<!-- Source CN PDF p.74, block 450 -->

##### 19.10.3.5 Ths_exit

<!-- Source CN PDF p.74, block 451 -->

```text
echo count > hs_exit
```

{% endraw %}

