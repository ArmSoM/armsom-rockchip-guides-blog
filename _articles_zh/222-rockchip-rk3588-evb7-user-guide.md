---
title: "Rockchip RK3588 EVB7 用户使用指南"
description: "Rockchip RK3588 EVB7 用户使用指南 — V1.0"
excerpt: "Rockchip RK3588 EVB7 用户使用指南"
translation_key: "222-rockchip-rk3588-evb7-user-guide"
slug: "222-rockchip-rk3588-evb7-user-guide"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: [ArmSoM, Rockchip, RK3588, EVB7]
---

{% raw %}

# Rockchip RK3588 EVB7 用户使用指南

完整技术正文依据 V1.0 中文稿（2023-06-20，44 页）与英文稿（2023-06-29，43 页），保留产品版本、缩略语及全部四章。法律、受众、修订和目录页不重复发布。本指南描述指定 Rockchip EVB7 板卡，不等同于 ArmSoM 产品规格或当前支持承诺；没有执行烧写、接线或硬件测试。固件升级可能覆盖数据，操作前应备份并核对固件与板卡版本。屏幕及扩展板禁止热插拔，需遵守末章防静电及供电注意事项。

原稿差异与疑点：中文功能概括及 3.8 为一个 SATA，英文概括和两稿功能表为两个，原值保留待按实板确认。中文屏幕写 1920×1080，英文写 1080×1920；中文 4.1 子标题在英文省略。英文图 3-10/3-11/3-14 的 UART/VGA/RS484 按中文与照片分别更正为 SATA/DP/RS485，英文 Aggreko 外壳按中文理解为亚克力。中文概括中额外的双路 4lane DPHY / 双路 3Trio CPHY 和 2.4 连接器型号已补入外语。表 3-1 中文表头 CDPHY，英文 DPHY，信号值一致并逐项保留；TBD 是原文未定值，不是编辑占位。原图标注及部分界面为英文/中文混合，不伪称已本地化。

<!-- source:cn p3 unit:0 -->

本文档主要介绍 RK3588 EVB7 基本功能和硬件特性、多功能硬件配置、软件调试操作使用方法,旨在帮助调试人员更快、更准确地使用 RK3588 EVB7,熟悉 RK3588 芯片开发应用方案。

<!-- source:cn p3 unit:1 -->

产品版本本文档对应的产品版本如下:

<!-- source:cn p3 unit:2 -->

| 产品名称 | 产品版本 |
| --- | --- |
| <code>RK3588 EVB7</code> | <code>RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428</code> |

<!-- source:cn p5 unit:3 -->

缩略语包括文档中常用词组的简称。

<!-- source:cn p5 unit:4 -->

| 缩略词 | 英文描述 | 中文描述 |
| --- | --- | --- |
| <code>CPU</code> | Central Processing Unit | 中央处理器 |
| <code>NPU</code> | Neural Network Processing Unit | 神经网络处理器 |
| <code>VPU</code> | Video Processing Unit | 视频处理器 |
| <code>DDR</code> | Double Data Rate | 双倍速率同步动态随机存储器 |
| <code>eMMC</code> | Embedded Multi Media Card | 内嵌式多媒体存储卡 |
| <code>eDP</code> | Embedded DisplayPort | 嵌入式数码音视讯传输接口 |
| <code>HDMI</code> | High Definition Multimedia Interface | 高清晰度多媒体接口 |
| <code>I2C</code> | Inter-Integrated Circuit | 内部整合电路(两线式串行通讯总线) |
| <code>I2S</code> | Inter-IC Sound | 集成电路内置音频总线 |
| <code>PMIC</code> | Power Management IC | 电源管理芯片 |
| <code>LDO</code> | Low Drop Out Linear Regulator | 低压差线性稳压器 |
| <code>DCDC</code> | Direct Current to Direct Current | 直流电转直流电 |
| <code>CAN</code> | Controller Area Network | 控制器局域网络 |
| <code>SARADC</code> | Successive Approximation Register Analog to<br>Digital Converter | 逐次逼近寄存器型模数转换器 |
| <code>UART</code> | Universal Asynchronous Receiver/ Transmitter | 通用异步收发传输器 |
| <code>JTAG</code> | Joint Test Action Group | 联合测试行为组织 |
| <code>PWM</code> | Pulse Width Modulation | 脉冲宽度调制 |
| <code>MIPI</code> | Mobile Industry Processor Interface | 移动产业处理器接口 |
| <code>LVDS</code> | Low-Voltage Differential Signaling | 低电压差分信号 |
| <code>PMIC</code> | Power Management IC | 电源管理芯片 |
| <code>PMU</code> | Power Management Unit | 电源管理单元 |
| <code>RK/Rockchip</code> | Rockchip Electronics Co.,Ltd. | 瑞芯微电子股份有限公司 |
| <code>USB</code> | Universal Serial Bus | 通用串行总线 |
| <code>SATA</code> | Serial Advanced Technology Attachment | 串行高级技术附件 |
| <code>PCIe</code> | Peripheral Component Interconnect Express | 外围组件快速互连 |
| <code>RGB</code> | Red,Green,Blue;RGB color mode is a color<br>standard in industry | 红绿蓝,RGB色彩模式, 是工业界的一<br>种颜色标准 |
| <code>VGA</code> | Video Graphics Array | 电脑显示视频图像标准接口 |
| <code>ADB</code> | Android Debug Bridge | 安卓调试桥 |
| <code>IR</code> | Infrared Radiation | 红外线 |
| <code>SPDIF</code> | Sony/Philips Digital Interface | 索尼/飞利浦数字音频接口 |
| <code>RTC</code> | Real-time clock | 实时时钟 |
| <code>RGMII</code> | Reduced Gigabit Media Independent Interface | 精简吉比特介质独立接口 |
| <code>WIFI</code> | Wireless Fidelity | 无线保真 |
| <code>CIF</code> | Camera Interface | 摄像头接口 |

<!-- source:cn p11 unit:5 -->

## 1 系统概述

<!-- source:cn p11 unit:6 -->

### 1.1 RK3588 芯片概述

<!-- source:cn p11 unit:7 -->

RK3588 是一颗高性能、低功耗的应用处理器芯片,专为 ARM PC、边缘计算、个人移动互联网设备和其它多媒体应用而设计,是由 4 个 A76 和 4 个 A55 与独立的 NEON 协处理器集成的。RK3588 内置了多种功能强大的嵌入式硬件引擎,为高端应用提供了优异的性能,支持 8K@60fps 的H.265 和 VP9 解码器、8k@30fps 的 H.264 解码器和 4K@60fps 的 AV1 解码器;还支持 8K30fps 的 H.264 和H.265 编码器,高质量的 JPEG 编码器/解码器,专门的图像预处理器和后处理器。内置 3D GPU,能够完全兼容 OpenGL ES1.1/2.0/3.2、OpenCL 2.2 和 Vulkan 1.2。带有 MMU 的特殊 2D硬件引擎将最大限度地提高显示性能,并提供流畅的操作体验。引入了新一代完全基于硬件的 48M 像素 ISP(图像信号处理器),它实现了众多算法加速器,如 HDR、3A、LSC、3DNR、2DNR、锐化、去雾、鱼眼校正、伽马校正等。内嵌的 NPU 支持 INT4/INT8/INT16/FP16 混合运算,算力高达 6TOP。此外,凭借其强大的兼容性,可以轻松转换基于 TensorFlow / MXNet/PyTorch/Caffe 等一系列框架的网络模型。RK3588 具有高性能的 4 通道外部存储器接口(LPDDR4/LPDDR4X/LPDDR5),能够支持苛刻的存储器带宽,还提供了一套完整的外设接口,以支持非常灵活的应用。

<!-- source:cn p12 unit:8 -->

### 1.2 RK3588 芯片框图

<!-- source:cn p12 unit:9 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p012-figure-01.png)

<!-- source:cn p12 unit:10 -->

图 1-1 RK3588 芯片框图

<!-- source:cn p12 unit:11 -->

### 1.3 系统框图

<!-- source:cn p12 unit:12 -->

#### 1.3.1 系统框图

<!-- source:cn p12 unit:13 -->

RK3588 EVB7 系统采用 RK3588 的芯片配套 RK806-1 单 PMIC 供电方案,存储采用 LPDDR4X、eMMC组合;支持 2xHDMI TX 、1xDP OUT、1xHDMI RX、2xMIPI TX、SATA、PCIe30x4、TYPEC、2xRJ45 等外设接口,集成了一个稳定的可量产化的方案。详细的系统框图如下:

<!-- source:cn p13 unit:14 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p013-system-block.png)

<!-- source:cn p13 unit:15 -->

图 1-2 RK3588 EVB7 系统框图

<!-- source:cn p13 unit:16 -->

#### 1.3.2 功能概括

<!-- source:cn p13 unit:17 -->

RK3588 EVB7 包含的功能如下:

<!-- source:cn p13 unit:18 -->

- DC Power:DC 12V 适配器供电接口

<!-- source:cn p13 unit:19 -->

- TYPEC:一路完整 TYPEC 接口,兼容系统固件升级通道以及 DP1.4 输出接口

<!-- source:cn p13 unit:20 -->

- USB2.0 HOST1:一路 USB2.0 standard-A 接口,可以接鼠标、U 盘、USB HUB 等设备

<!-- source:cn p13 unit:21 -->

- USB2.0 OTG:一路 USB2.0 standard-A 接口支持 OTG 功能,可以接 PC、鼠标、U 盘、USB HUB等设备

<!-- source:cn p13 unit:22 -->

- USB3.0 HOST: 一路 USB3.0 standard-A 接口,可以接鼠标、U 盘、USB HUB 等设备

<!-- source:cn p13 unit:23 -->

- MIPI DCPHY RX:支持两路 4lane MIPI DPHY 或者两路 3Trio MIPI CPHY 信号输入,通过 80pin座子接入

<!-- source:cn p13 unit:24 -->

- MIPI DPHY RX:支持两路 4lane 或者四路 2lane MIPI 信号输入,通过 80pin 座子接入。可通过配套小板 RK_EVB_RK3588_EXTBOARD1_IMX415_V11_20211027 实现拍照摄像功能

<!-- source:cn p13 unit:25 -->

- HDMI2.1 OUT:两路 HDMI2.1 OUT standard-A 接口,单路最大可支持 8K@60Hz 输出

<!-- source:cn p13 unit:26 -->

- DP OUT:一路 DP OUT standard-A 接口,单路最大可支持 4K@60Hz 输出

<!-- source:cn p13 unit:27 -->

- HDMI2.0 IN:一路 HDMI IN standard-A 接口,最大支持 4K@60Hz 视频输入

<!-- source:cn p13 unit:28 -->

- MIPI DPHY0/1 TX:支持两路 4lane MIPI 信号输出,通过 FPC 线连接

<!-- source:cn p13 unit:29 -->

- WIFI(2T2R MIMO):WIFI 型号为 AP6398,外置 SMA 天线,支持无线上网功能

<!-- source:cn p13 unit:30 -->

- Ethernet:支持 2 路 RJ45 接口 10/100/1000M 以太网

<!-- source:cn p14 unit:31 -->

- Audio Interface:支持喇叭、耳机输出声音、单 MIC 录音

<!-- source:cn p14 unit:32 -->

- SATA3.0 Interface:一路 7pin SATA 接口

<!-- source:cn p14 unit:33 -->

- PCIe3.0 Interface:一路标准的 PCIex4 接口,用于扩展 PCIe 设备

<!-- source:cn p14 unit:34 -->

- TF Card:支持 TF 卡扩展,支持 SD3.0,MMC ver4.51

<!-- source:cn p14 unit:35 -->

- UART Debug:用户调试查看 LOG 信息使用;支持 TYPEC 以及 MINI USB 接口

<!-- source:cn p14 unit:36 -->

- JTAG:系统 JTAG 调试接口

<!-- source:cn p14 unit:37 -->

- System Key:包含 Reset、MASKROM、PWRON、V+/Recover、V-、MENU、ESC 按键

<!-- source:cn p14 unit:38 -->

- SPDIF:支持数字音频接口

<!-- source:cn p14 unit:39 -->

- RTC:采用 HYM8563TS 芯片,可由开发板或者纽扣电池(CR1220-3V)供电

<!-- source:cn p14 unit:40 -->

#### 1.3.3 功能接口

<!-- source:cn p14 unit:41 -->

表 1-1 PCB 功能接口介绍表

<!-- source:cn p14 unit:42 -->

| 功能 | 是否可用 |
| --- | --- |
| LPDDR4x(总容量8GB) | <code>YES</code> |
| eMMC(总容量 32GB) | <code>YES</code> |
| DC 12V Input | <code>YES</code> |
| TYPEC | <code>YES</code> |
| USB3.0 HOST(x1 Port) | <code>YES</code> |
| USB2.0 HOST(x1 Port) | <code>YES</code> |
| USB2.0 OTG(x1 Port) | <code>YES</code> |
| MIPI D/CPHY RX | <code>YES</code> |
| MIPI DPHY RX | <code>YES</code> |
| HDMI2.0 RX | <code>YES</code> |
| HDMI2.1 OUT(2 Port) | <code>YES</code> |
| MIPI DPHY DSI TX1(2x4lane) | <code>YES</code> |
| DP OUT | <code>YES</code> |
| BT&amp;WIFI(2x2 WIFI&amp;BT5.0) | <code>YES</code> |
| 千兆网口 10M/100M/1000M(2 Port) | <code>YES</code> |
| Audio(SPK、MIC、Earphone) | <code>YES</code> |
| SATA3.0 Interface(1 Port) | <code>YES</code> |
| PCIe3.0 Interface(4lane) | <code>YES</code> |
| UART Debug(MINI USB) | <code>YES</code> |
| JTAG Interface | <code>YES</code> |
| System Key | <code>YES</code> |
| Maskrom Key | <code>YES</code> |

<!-- source:cn p15 unit:43 -->

#### 1.3.4 功能模块布局

<!-- source:cn p15 unit:44 -->

RK3588 EVB7 功能接口分布图:

<!-- source:cn p15 unit:45 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p015-figure-01.png)

<!-- source:cn p15 unit:46 -->

图 1-3 RK3588 EVB7 功能接口分布图(正面)

<!-- source:cn p16 unit:47 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p016-figure-01.png)

<!-- source:cn p16 unit:48 -->

图 1-4 RK3588 EVB7 功能接口分布图(背面)

<!-- source:cn p16 unit:49 -->

### 1.4 组件

<!-- source:cn p16 unit:50 -->

RK3588 EVB7 套件包括以下物品:

<!-- source:cn p16 unit:51 -->

- RK3588 EVB7

<!-- source:cn p16 unit:52 -->

- 电源适配器,默认规格:输入 100V AC~240V AC,50Hz;输出 12V DC,3A

<!-- source:cn p16 unit:53 -->

- 显示屏,规格:MIPI;尺寸:5.5 寸/竖屏;分辨率:1920*1080

<!-- source:cn p16 unit:54 -->

- 一根 2.4G/5G 双频 SMA 公头接口天线

<!-- source:cn p16 unit:55 -->

- IMX415 单目镜头模组(EVB_RK3588_EXTBOARD1_IMX415_V11_20211027)

<!-- source:cn p16 unit:56 -->

### 1.5 开关机和待机

<!-- source:cn p16 unit:57 -->

RK3588 EVB7 开机、关机以及待机方法介绍如下:

<!-- source:cn p16 unit:58 -->

- 开机方法:使用 DC 12V 供电,打开电源总开关;等待进入安卓界面,表示默认固件启动成功。

<!-- source:cn p16 unit:59 -->

- 关机方法：长按开机键 6s，系统关机。

<!-- source:cn p17 unit:60 -->

- 待机方法:按下开机键,系统会进入一级待机状态。在没有接 USB OTG 情况下,没有其他的任何操作(比如按键操作),软件也没有 Wake_Lock 源,大约 3s 后会从一级待机转入二级待机状态。可通过 Power 按键退出待机模式

<!-- source:cn p17 unit:61 -->

### 1.6 固件升级

<!-- source:cn p17 unit:62 -->

#### 1.6.1 USB 驱动安装

<!-- source:cn p17 unit:63 -->

EVB 驱动升级前需要先安装驱动,以下介绍 Windows 系统驱动安装流程在提供的工具文件夹里面找到 DriverAssitant_v5.1.1,点击 DriverInstall.exe 文件跳出如下界面。点击“驱动安装”,等待提示安装驱动成功即可。如果已安装旧驱动,请点击“驱动卸载”,并重新安装驱动。

<!-- source:cn p17 unit:64 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p017-figure-01.png)

<!-- source:cn p17 unit:65 -->

图 1-5 驱动安装成功示意图

<!-- source:cn p17 unit:66 -->

#### 1.6.2 固件升级方式

<!-- source:cn p17 unit:67 -->

RK3588 EVB7 固件升级方式有两种:

<!-- source:cn p17 unit:68 -->

- 进入 Loader 升级方式:系统上电前需要保持 SARADC_IN1 为低,系统将进入 Loader 状态。具体步骤如下:

<!-- source:cn p17 unit:69 -->

1) 连接 TYPEC 口到电脑 PC 端,按住主板的 V+/REC 按键不放。

<!-- source:cn p17 unit:70 -->

2) EVB 供电 12V,若已经上电,按下复位按键。

<!-- source:cn p17 unit:71 -->

3) 烧写工具显示发现一个 Loader 设备后,释放 V+/REC 按键。在工具下图矩形区域,鼠标右击“导入配置”,然后找到固件路径,选择 config 文件

<!-- source:cn p17 unit:72 -->

4) 烧写工具对应选择 Loader、Parameter、Uboot 等文件。

<!-- source:cn p17 unit:73 -->

5) 点击执行,即进入升级状态,工具的右侧为进度显示栏,显示下载进度与校验情况。

<!-- source:cn p18 unit:74 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p018-figure-01.png)

<!-- source:cn p18 unit:75 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p018-figure-02.png)

<!-- source:cn p18 unit:76 -->

图 1-6 进入 Loader 烧写模式示意图

<!-- source:cn p18 unit:77 -->

- 进入 MASKROM 升级方式:系统上电前 SARADC_IN0 为低,进入 MASKROM 状态。具体步骤如下:

<!-- source:cn p18 unit:78 -->

1) 连接 TYPEC 口到电脑 PC 端,按住板子的 MASKROM 按键不放。

<!-- source:cn p18 unit:79 -->

2) EVB 供电 12V,若已经上电,按下复位按键。

<!-- source:cn p18 unit:80 -->

3) 烧写工具显示发现一个 MASKROM 设备后,释放 MASKROM 按键。在工具下图矩形区域,鼠标右击“导入配置”,然后找到固件路径,选择 config.cfg 文件

<!-- source:cn p18 unit:81 -->

4) 烧写工具对应选择 Loader、Parameter、Uboot 等文件。

<!-- source:cn p18 unit:82 -->

5) 点击执行,即进入升级状态,工具的右侧为进度显示栏,显示下载进度与校验情况。

<!-- source:cn p19 unit:83 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p019-figure-01.png)

<!-- source:cn p19 unit:84 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p019-figure-02.png)

<!-- source:cn p19 unit:85 -->

图 1-7 进入 MASKROM 烧写模式示意图

<!-- source:cn p19 unit:86 -->

### 1.7 串口调试

<!-- source:cn p19 unit:87 -->

#### 1.7.1 串口工具

<!-- source:cn p19 unit:88 -->

连接开发板的 MINI USB Debug 调试接口到电脑 PC 端,在 PC 端设备管理器中得到当前端口 COM号。

<!-- source:cn p20 unit:89 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p020-figure-01.png)

<!-- source:cn p20 unit:90 -->

图 1-8 获取当前端口 COM 号

<!-- source:cn p20 unit:91 -->

打开串口工具,先选择串口,再选择对应的串口号,将波特率改为 1.5M(RK3588 默认支持 1.5M 波特率),并且在 Serial 处关闭流控,最后点击“打开”按钮,即可进入串口调试界面。

<!-- source:cn p21 unit:92 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p021-figure-01.png)

<!-- source:cn p21 unit:93 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p021-figure-02.png)

<!-- source:cn p21 unit:94 -->

图 1-9 串口工具配置界面

<!-- source:cn p22 unit:95 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p022-figure-01.png)

<!-- source:cn p22 unit:96 -->

图 1-10 串口工具调试界面

<!-- source:cn p22 unit:97 -->

#### 1.7.2 ADB 调试

<!-- source:cn p22 unit:98 -->

1) 确保驱动安装成功,PC 连接开发板的 TYPEC 口;

<!-- source:cn p22 unit:99 -->

2) 开发板上电,开机进入系统;

<!-- source:cn p22 unit:100 -->

3) 电脑 PC 端,打开 adb 工具;

<!-- source:cn p22 unit:101 -->

4) 输入“adb shell”,进入 adb 调试。

<!-- source:cn p22 unit:102 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p022-figure-02.png)

<!-- source:cn p22 unit:103 -->

图 1-11 ADB 连接正常

<!-- source:cn p23 unit:104 -->

## 2 硬件介绍

<!-- source:cn p23 unit:105 -->

### 2.1 实物图

<!-- source:cn p23 unit:106 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p023-figure-01.png)

<!-- source:cn p23 unit:107 -->

图 2-1 RK3588 EVB7 实物图

<!-- source:cn p24 unit:108 -->

### 2.2 电源框图

<!-- source:cn p24 unit:109 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p024-figure-01.png)

<!-- source:cn p24 unit:110 -->

图 2-2 RK3588 EVB7 电源框图

<!-- source:cn p24 unit:111 -->

### 2.3 I2C 地址

<!-- source:cn p24 unit:112 -->

开发板预留丰富的外围接口,用户调试 I2C 外设会涉及到 I2C 通道复用情况,表 2-1 为现有的开发板器件对应的 I2C 地址和电平值,避免地址冲突和电平不匹配。表 2-1 I2C 通道挂载的外设地址和 IO 电平值对应表

<!-- source:cn p24 unit:113 -->

| I2C通道 | 设备 | I2C地址 | 电源域 |
| --- | --- | --- | --- |
| <code>I2C0_M2</code> | <code>RK860-2/RK860-3</code> | <code>0x42/0x43</code> | <code>3.3V</code> |
| <code>I2C1_M2</code> | <code>RK860-2</code> | <code>0x42</code> | <code>3.3V</code> |
| <code>I2C2_M4</code> | <code>MIPI DCPHY0/DCPHY1</code> | <code>TBD</code> | <code>1.8V</code> |
| <code>I2C3_M0</code> | <code>MIPI CSI0/MIPI CSI1</code> | <code>TBD</code> | <code>1.8V</code> |
| <code>I2C4_M1</code> | <code>STK3311-A/ICM-42607</code> | <code>TBD</code> | <code>1.8V</code> |
| <code>I2C5_M0</code> | <code>Touch Panel</code> | <code>TBD</code> | <code>3.3V</code> |
| <code>I2C6_M0</code> | <code>HYM8563TS</code> | <code>0xA3</code> | <code>3.3V</code> |
| <code>I2C7_M0</code> | <code>ES8388</code> | <code>0x10</code> | <code>1.8V</code> |
| <code>HDMITX0_I2C</code> | <code>HDMI_TX0</code> | <code>TBD</code> | <code>3.3V</code> |
| <code>HDMITX1_I2C</code> | <code>HDMI_TX1</code> | <code>TBD</code> | <code>3.3V</code> |
| <code>HDMIRX_I2C</code> | <code>HDMI_RX</code> | <code>TBD</code> | <code>3.3V</code> |

<!-- source:cn p24 unit:114 -->

注意:使用扩展板时,要保证板上 I2C 地址与开发板上 I2C 地址不冲突。

<!-- source:cn p25 unit:115 -->

### 2.4 扩展连接座信息

<!-- source:cn p25 unit:116 -->

在实际使用过程中,用户可能会制作 MIPI 扩展板,开发板连接座型号为 61082-081402LF,对应小板母头座子型号为 61083-081402LF,其尺寸信息如下:U4600、U4700 为引脚宽度 0.3mm,间距 0.8mm 的立式双排 80PIN 卡座,具体尺寸如下:

<!-- source:cn p25 unit:117 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p025-figure-01.png)

<!-- source:cn p25 unit:118 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p025-figure-02.png)

<!-- source:cn p26 unit:119 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p026-figure-01.png)

<!-- source:cn p26 unit:120 -->

图 2-3 间距 0.8mm 立式双排 80 PIN PCB 封装

<!-- source:cn p26 unit:121 -->

### 2.5 参考图

<!-- source:cn p26 unit:122 -->

EVB7 对应的参考图、PCB 版本信息如下:

<!-- source:cn p26 unit:123 -->

- 参考图:RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428RZF.DSN

<!-- source:cn p26 unit:124 -->

- PCB 设计:RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428YWQ_final.brd

<!-- source:cn p27 unit:125 -->

## 3 模块简述

<!-- source:cn p27 unit:126 -->

### 3.1 电源输入

<!-- source:cn p27 unit:127 -->

电源适配器输入 12V/3A 电源,通过前端降压变换器(buck)电源后,得到系统电源 VCC4V0_SYS,然后系统电压提供给 PMIC 电源管理芯片,输出不同电压供系统使用。电源适配器输入口、前端 Buck 变换器以及 PMIC 芯片:

<!-- source:cn p27 unit:128 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p027-figure-01.png)

<!-- source:cn p27 unit:129 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p027-figure-02.png)

<!-- source:cn p27 unit:130 -->

图 3-1 DC12V 输入、前端 buck 变换器以及 PMIC 芯片

<!-- source:cn p28 unit:131 -->

### 3.2 存储器

<!-- source:cn p28 unit:132 -->

- eMMC:开发板上存储类型为 eMMC FLASH,默认使用的容量 32GB

<!-- source:cn p28 unit:133 -->

- DDR:开发板 DDR 采用两片 4GB LPDDR4x,总容量 8GB

<!-- source:cn p28 unit:134 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p028-figure-01.png)

<!-- source:cn p28 unit:135 -->

图 3-2 LPDDR4x 位置

<!-- source:cn p28 unit:136 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p028-figure-02.png)

<!-- source:cn p28 unit:137 -->

图 3-3 EMMC 位置

<!-- source:cn p29 unit:138 -->

EVB 进 MASKROM 烧写的按键位置:

<!-- source:cn p29 unit:139 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p029-figure-01.png)

<!-- source:cn p29 unit:140 -->

图 3-4 进 MASKROM 烧写按键位置

<!-- source:cn p29 unit:141 -->

### 3.3 RTC 电路

<!-- source:cn p29 unit:142 -->

RTC 电路采用 HYM8563TS 芯片,可由开发板或者自带纽扣电池(默认不带,需要自行购买 CR1220-3V纽扣电池)供电,保证在板子断电情况下也能继续提供准确的时间,通过 I2C 信号与主控通信。

<!-- source:cn p29 unit:143 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p029-figure-02.png)

<!-- source:cn p29 unit:144 -->

图 3-5 RTC 电路

<!-- source:cn p29 unit:145 -->

### 3.4 按键输入

<!-- source:cn p29 unit:146 -->

开发板使用 SARADC_IN1 作为进 RECOVER 检测口,支持 12 位分辨率,可以通过 V+/REC 按键,进入LOADER 烧写模式;另外板子还留了 RESET 按键,方便通过硬件复位,重启机器;以及其它常用的几个按键:V+、V-、ESC、MENU、PWRON。

<!-- source:cn p30 unit:147 -->

按键位置如下:

<!-- source:cn p30 unit:148 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p030-figure-01.png)

<!-- source:cn p30 unit:149 -->

图 3-6 按键位置

<!-- source:cn p30 unit:150 -->

### 3.5 SATA 电源座子

<!-- source:cn p30 unit:151 -->

开发板所用的 SATA 设备供电口,分别输出 12V/5V。

<!-- source:cn p30 unit:152 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p030-figure-02.png)

<!-- source:cn p30 unit:153 -->

图 3-7 SATA 电源 12V/5V 输出

<!-- source:cn p30 unit:154 -->

### 3.6 PCIe 座子

<!-- source:cn p30 unit:155 -->

开发板上使用标准 PCIe3.0 连接座,可外接 PCIe 板卡进行通信。

<!-- source:cn p30 unit:156 -->

- 工作模式:End Point(EP) &Root Complex(RC)。

<!-- source:cn p30 unit:157 -->

- 链路支持 4 lane 数据接口。

<!-- source:cn p30 unit:158 -->

- 100MHz 时钟是由外挂时钟 buffer 芯片 AU5426 提供。

<!-- source:cn p31 unit:159 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p031-figure-01.png)

<!-- source:cn p31 unit:160 -->

图 3-8 PCIex4 座子

<!-- source:cn p31 unit:161 -->

### 3.7 以太网口

<!-- source:cn p31 unit:162 -->

开发板支持两个 RJ45 接口,可提供双千兆以太网连接功能。分别采用 RK3588 内部集成的千兆以太网MAC 以及 PCIe2.0,与外部 PHY 芯片相连接,PHY 型号为 RTL8211F-CG/RTL8111HS,特性如下:

<!-- source:cn p31 unit:163 -->

- 兼容 IEEE802.3 标准,支持全双工和半双工操作,支持交叉检测和自适应。

<!-- source:cn p31 unit:164 -->

- 支持 10/100/1000M 数据速率。

<!-- source:cn p31 unit:165 -->

- 接口采用带隔离变压器和指示灯的 RJ45 接口组合。

<!-- source:cn p31 unit:166 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p031-figure-02.png)

<!-- source:cn p31 unit:167 -->

图 3-9 千兆网络接口

<!-- source:cn p32 unit:168 -->

### 3.8 SATA 接口

<!-- source:cn p32 unit:169 -->

开发板提供 1 个 7P SATA 接口

<!-- source:cn p32 unit:170 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p032-figure-01.png)

<!-- source:cn p32 unit:171 -->

图 3-10 SATA 接口

<!-- source:cn p32 unit:172 -->

### 3.9 DP 输出

<!-- source:cn p32 unit:173 -->

开发板支持 DP 接口视频输出,最高支持到 4K@60 视频数据输出。

<!-- source:cn p32 unit:174 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p032-figure-02.png)

<!-- source:cn p32 unit:175 -->

图 3-11 DP 视频输出接口

<!-- source:cn p32 unit:176 -->

### 3.10 BT/WIFI 接口

<!-- source:cn p32 unit:177 -->

开发板上 WIFI+BT 模组采用正基 AP6398S,特性如下:

<!-- source:cn p32 unit:178 -->

- 支持 2x2WIFI(2.4G and 5G,802.11 a/b/g/n/ac)、BT5.0 功能,外置 2 个 SMA 接口天线。

<!-- source:cn p32 unit:179 -->

- BT 数据采用 UART 通信方式。

<!-- source:cn p33 unit:180 -->

- BT 语音连接主控 I2S 接口。

<!-- source:cn p33 unit:181 -->

- WIFI 数据采用 SDIO 接口传输。RK3588 EVB7 默认配备一根 2.4GHz/5GHz 双模天线。

<!-- source:cn p33 unit:182 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p033-figure-01.png)

<!-- source:cn p33 unit:183 -->

图 3-12 BT/WIFI 天线接口

<!-- source:cn p33 unit:184 -->

### 3.11 Debug 接口

<!-- source:cn p33 unit:185 -->

开发板板载 USB 转 UART 芯片,支持 MINI USB 调试接口。

<!-- source:cn p33 unit:186 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p033-figure-02.png)

<!-- source:cn p33 unit:187 -->

图 3-13 Debug 接口

<!-- source:cn p34 unit:188 -->

### 3.12 RS485&RS232 接口

<!-- source:cn p34 unit:189 -->

开发板分别预留了 1 个 RS485 接口和 RS232 接口。

<!-- source:cn p34 unit:190 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p034-figure-01.png)

<!-- source:cn p34 unit:191 -->

图 3-14 RS485 座子

<!-- source:cn p34 unit:192 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p034-figure-02.png)

<!-- source:cn p34 unit:193 -->

图 3-15 RS232 座子

<!-- source:cn p34 unit:194 -->

### 3.13 MIPI D/CPHY 输入接口

<!-- source:cn p34 unit:195 -->

MIPI D/CPHY 输入接口采用间距 0.8mm 的立式 80pin 插座(型号为 61082-081402LF,规格见章节 2.4),支持双路 MIPI D/CPHY 接口输入。可以支持两路 4Lane DPHY 模组输入或者两路 3Trio CPHY 模组输入。MIPI DPHY/CPHY 最大分别支持 4.5Gbps/Lane 和 5.7Gbps/Trio。与该 80pin 插座配套座子型号为 61083-081402LF,封装尺寸规格可参考章节 2.4;客户可根据需求制作扩展板卡。

<!-- source:cn p35 unit:196 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p035-figure-01.png)

<!-- source:cn p35 unit:197 -->

图 3-16 MIPI D/CPHY RX 输入接口MIPI D/CPHY_RX 接口信号顺序如下:表 3-1 MIPI D/CPHY_RX 信号定义表

<!-- source:cn p35 unit:198 -->

| Pin | CDPHY(单) | CDPHY(双) | Pin |
| --- | --- | --- | --- |
| <code>1</code> | <code>GND</code> | <code>GND</code> | <code>2</code> |
| <code>3</code> | <code>MIPI_DPHY1_RX_D0N/MIPI_CPHY1_RX_TRIO0_A</code> | <code>MIPI_DPHY0_RX_D0N/MIPI_CPHY0_RX_TRIO0_A</code> | <code>4</code> |
| <code>5</code> | <code>MIPI_DPHY1_RX_D0P/MIPI_CPHY1_RX_TRIO0_B</code> | <code>MIPI_DPHY0_RX_D0P/MIPI_CPHY0_RX_TRIO0_B</code> | <code>6</code> |
| <code>7</code> | <code>GND</code> | <code>GND</code> | <code>8</code> |
| <code>9</code> | <code>MIPI_DPHY1_RX_D1N/MIPI_CPHY1_RX_TRIO0_C</code> | <code>MIPI_DPHY0_RX_D1N/MIPI_CPHY0_RX_TRIO0_C</code> | <code>10</code> |
| <code>11</code> | <code>MIPI_DPHY1_RX_D1P/MIPI_CPHY1_RX_TRIO1_A</code> | <code>MIPI_DPHY0_RX_D1P/MIPI_CPHY0_RX_TRIO1_A</code> | <code>12</code> |
| <code>13</code> | <code>GND</code> | <code>GND</code> | <code>14</code> |
| <code>15</code> | <code>MIPI_DPHY1_RX_CLKN/MIPI_CPHY1_RX_TRIO1_B</code> | <code>MIPI_DPHY0_RX_CLKN/MIPI_CPHY0_RX_TRIO1_B</code> | <code>16</code> |
| <code>17</code> | <code>MIPI_DPHY1_RX_CLKP/MIPI_CPHY1_RX_TRIO1_C</code> | <code>MIPI_DPHY0_RX_CLKP/MIPI_CPHY0_RX_TRIO1_C</code> | <code>18</code> |
| <code>19</code> | <code>GND</code> | <code>GND</code> | <code>20</code> |
| <code>21</code> | <code>MIPI_DPHY1_RX_D2N/MIPI_CPHY1_RX_TRIO2_A</code> | <code>MIPI_DPHY0_RX_D2N/MIPI_CPHY0_RX_TRIO2_A</code> | <code>22</code> |
| <code>23</code> | <code>MIPI_DPHY1_RX_D2P/MIPI_CPHY1_RX_TRIO2_B</code> | <code>MIPI_DPHY0_RX_D2P/MIPI_CPHY0_RX_TRIO2_B</code> | <code>24</code> |
| <code>25</code> | <code>GND</code> | <code>GND</code> | <code>26</code> |
| <code>27</code> | <code>MIPI_DPHY1_RX_D3N/MIPI_CPHY1_RX_TRIO2_C</code> | <code>MIPI_DPHY0_RX_D3N/MIPI_CPHY0_RX_TRIO2_C</code> | <code>28</code> |
| <code>29</code> | <code>MIPI_DPHY1_RX_D3P/NO_USE</code> | <code>MIPI_DPHY0_RX_D3P/NO_USE</code> | <code>30</code> |
| <code>31</code> | <code>GND</code> | <code>GND</code> | <code>32</code> |
| <code>33</code> | <code>NC</code> | <code>NC</code> | <code>34</code> |
| <code>35</code> | <code>NC</code> | <code>NC</code> | <code>36</code> |
| <code>37</code> | <code>GND</code> | <code>GND</code> | <code>38</code> |
| <code>39</code> | <code>MIPI_CAM1_CLKOUT</code> | <code>MIPI_CAM2_CLKOUT</code> | <code>40</code> |
| <code>41</code> | <code>NC</code> | <code>NC</code> | <code>42</code> |
| <code>43</code> | <code>GND</code> | <code>GND</code> | <code>44</code> |
| <code>45</code> | <code>I2C2_SDA_M4_MIPI</code> | <code>I2C2_SDA_M4_MIPI</code> | <code>46</code> |
| <code>47</code> | <code>I2C2_SCL_M4_MIPI</code> | <code>I2C2_SCL_M4_MIPI</code> | <code>48</code> |
| <code>49</code> | <code>NC</code> | <code>NC</code> | <code>50</code> |
| <code>51</code> | <code>MIPI_CAM1_PDN_L</code> | <code>MIPI_CAM2_PDN_L</code> | <code>52</code> |
| <code>53</code> | <code>NC</code> | <code>NC</code> | <code>54</code> |
| <code>55</code> | <code>NC</code> | <code>NC</code> | <code>56</code> |
| <code>57</code> | <code>MIPI_DPHY_FSYNC</code> | <code>MIPI_DPHY_FSYNC</code> | <code>58</code> |
| <code>59</code> | <code>MIPI_DPHY_HSYNC/PWM15_M2</code> | <code>MIPI_DPHY_HSYNC</code> | <code>60</code> |
| <code>61</code> | <code>VCC_1V8_S3</code> | <code>VCC_3V3_S3</code> | <code>62</code> |
| <code>63</code> | <code>NC</code> | <code>NC</code> | <code>64</code> |
| <code>65</code> | <code>MIPI_CAM1_PWREN_H</code> | <code>MIPI_CAM2_PWREN_H</code> | <code>66</code> |
| <code>67</code> | <code>IRC_AIN</code> | <code>NC</code> | <code>68</code> |
| <code>69</code> | <code>IRC_BIN</code> | <code>NC</code> | <code>70</code> |
| <code>71</code> | <code>NC</code> | <code>NC</code> | <code>72</code> |
| <code>73</code> | <code>NC</code> | <code>NC</code> | <code>74</code> |
| <code>75</code> | <code>GND</code> | <code>GND</code> | <code>76</code> |
| <code>77</code> | <code>VCC_5V0</code> | <code>GND</code> | <code>78</code> |
| <code>79</code> | <code>VCC_5V0</code> | <code>VCC12V_DCIN</code> | <code>80</code> |

<!-- source:cn p36 unit:199 -->

### 3.14 MIPI DPHY 输入接口

<!-- source:cn p36 unit:200 -->

MIPI DPHY 输入接口采用间距 0.8mm 的立式 80pin 插座(型号为 61082-081402LF,规格见章节 2.4)。可以支持两路 4lane MIPI DPHY 模组输入或者四路 2lane MIPI DPHY 信号输入。MIPI DPHY 最大分别支持 2.5Gbps/Lane。与 MIPI D/CPHY 一起可以组成最大 6 路模组输入。与该 80pin 插座配套座子型号为 61083-081402LF,封装尺寸规格可参考章节 2.4;客户可根据需求制作扩展板卡。

<!-- source:cn p37 unit:202 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p037-figure-01.png)

<!-- source:cn p37 unit:203 -->

图 3-17 MIPI DPHY 视频输入接口MIPI DPHY_RX 接口信号顺序如下:表 3-2 MIPI DPHY_RX 信号定义表

<!-- source:cn p37 unit:204 -->

| Pin | DPHY(单) | DPHY(双) | Pin |
| --- | --- | --- | --- |
| <code>1</code> | <code>GND</code> | <code>GND</code> | <code>2</code> |
| <code>3</code> | <code>MIPI_CSI0_RX_D0N</code> | <code>MIPI_CSI1_RX_D0N</code> | <code>4</code> |
| <code>5</code> | <code>MIPI_CSI0_RX_D0P</code> | <code>MIPI_CSI1_RX_D0P</code> | <code>6</code> |
| <code>7</code> | <code>GND</code> | <code>GND</code> | <code>8</code> |
| <code>9</code> | <code>MIPI_CSI0_RX_D1N</code> | <code>MIPI_CSI1_RX_D1N</code> | <code>10</code> |
| <code>11</code> | <code>MIPI_CSI0_RX_D1P</code> | <code>MIPI_CSI1_RX_D1P</code> | <code>12</code> |
| <code>13</code> | <code>GND</code> | <code>GND</code> | <code>14</code> |
| <code>15</code> | <code>MIPI_CSI0_RX_CLK0N</code> | <code>MIPI_CSI1_RX_CLK0N</code> | <code>16</code> |
| <code>17</code> | <code>MIPI_CSI0_RX_CLK0P</code> | <code>MIPI_CSI1_RX_CLK0P</code> | <code>18</code> |
| <code>19</code> | <code>GND</code> | <code>GND</code> | <code>20</code> |
| <code>21</code> | <code>MIPI_CSI0_RX_D2N</code> | <code>MIPI_CSI1_RX_D2N</code> | <code>22</code> |
| <code>23</code> | <code>MIPI_CSI0_RX_D2P</code> | <code>MIPI_CSI1_RX_D2P</code> | <code>24</code> |
| <code>25</code> | <code>GND</code> | <code>GND</code> | <code>26</code> |
| <code>27</code> | <code>MIPI_CSI0_RX_D3N</code> | <code>MIPI_CSI1_RX_D3N</code> | <code>28</code> |
| <code>29</code> | <code>MIPI_CSI0_RX_D3P</code> | <code>MIPI_CSI1_RX_D3P</code> | <code>30</code> |
| <code>31</code> | <code>GND</code> | <code>GND</code> | <code>32</code> |
| <code>33</code> | <code>MIPI_CSI0_RX_CLK1N</code> | <code>MIPI_CSI1_RX_CLK1N</code> | <code>34</code> |
| <code>35</code> | <code>MIPI_CSI0_RX_CLK1P</code> | <code>MIPI_CSI1_RX_CLK1P</code> | <code>36</code> |
| <code>37</code> | <code>GND</code> | <code>GND</code> | <code>38</code> |
| <code>39</code> | <code>MIPI_CAM3_CLKOUT</code> | <code>MIPI_CAM4_CLKOUT</code> | <code>40</code> |
| <code>41</code> | <code>NC</code> | <code>NC</code> | <code>42</code> |
| <code>43</code> | <code>GND</code> | <code>GND</code> | <code>44</code> |
| <code>45</code> | <code>I2C3_SDA_M0_MIPI</code> | <code>I2C3_SDA_M0_MIPI</code> | <code>46</code> |
| <code>47</code> | <code>I2C3_SCL_M0_MIPI</code> | <code>I2C3_SCL_M0_MIPI</code> | <code>48</code> |
| <code>49</code> | <code>NC</code> | <code>NC</code> | <code>50</code> |
| <code>51</code> | <code>MIPI_CAM3_PDN_L</code> | <code>MIPI_CAM5_PDN_L</code> | <code>52</code> |
| <code>53</code> | <code>NC</code> | <code>NC</code> | <code>54</code> |
| <code>55</code> | <code>MIPI_CAM4_PDN_L</code> | <code>MIPI_CAM6_PDN_L</code> | <code>56</code> |
| <code>57</code> | <code>MIPI_DPHY_FSYNC</code> | <code>MIPI_DPHY_FSYNC</code> | <code>58</code> |
| <code>59</code> | <code>MIPI_DPHY_HSYNC/PWM15_M2</code> | <code>MIPI_DPHY_HSYNC</code> | <code>60</code> |
| <code>61</code> | <code>VCC_1V8_S3</code> | <code>VCC_3V3_S3</code> | <code>62</code> |
| <code>63</code> | <code>NC</code> | <code>NC</code> | <code>64</code> |
| <code>65</code> | <code>MIPI_CAM3/4_PWREN_H</code> | <code>MIPI_CAM5/6_PWREN_H</code> | <code>66</code> |
| <code>67</code> | <code>IRC_AIN</code> | <code>NC</code> | <code>68</code> |
| <code>69</code> | <code>IRC_BIN</code> | <code>NC</code> | <code>70</code> |
| <code>71</code> | <code>NC</code> | <code>NC</code> | <code>72</code> |
| <code>73</code> | <code>NC</code> | <code>NC</code> | <code>74</code> |
| <code>75</code> | <code>GND</code> | <code>GND</code> | <code>76</code> |
| <code>77</code> | <code>VCC_5V0</code> | <code>GND</code> | <code>78</code> |
| <code>79</code> | <code>VCC_5V0</code> | <code>VCC12V_DCIN</code> | <code>80</code> |

<!-- source:cn p38 unit:205 -->

### 3.15 TYPEC 接口

<!-- source:cn p38 unit:206 -->

开发板支持一个完整的 TYPEC 接口,支持以下功能:

<!-- source:cn p38 unit:207 -->

- 该接口中的 TYPEC0_USB20_OTG 可用来下载固件

<!-- source:cn p38 unit:208 -->

- 支持 TYPEC 功能

<!-- source:cn p38 unit:209 -->

- 支持 DP1.4 输出

<!-- source:cn p38 unit:210 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p038-figure-01.png)

<!-- source:cn p38 unit:211 -->

图 3-18 TYPEC 接口

<!-- source:cn p39 unit:212 -->

### 3.16 USB3.0 接口

<!-- source:cn p39 unit:213 -->

开发板支持一路 USB3.0 OTG 接口;接口为标准的 A 口,方便开发者接入 USB3.0 U 盘以及其他 USB3.0设备

<!-- source:cn p39 unit:214 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p039-figure-01.png)

<!-- source:cn p39 unit:215 -->

图 3-19 USB3.0 OTG 接口

<!-- source:cn p39 unit:216 -->

### 3.17 USB2.0 OTG/Host 接口

<!-- source:cn p39 unit:217 -->

开发板支持 1 路 USB2.0 HOST 和 1 路 USB2.0 OTG,支持接 U 盘、鼠标、键盘等扩展设备。

<!-- source:cn p39 unit:218 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p039-figure-02.png)

<!-- source:cn p39 unit:219 -->

图 3-20 USB2.0 Host 接口

<!-- source:cn p39 unit:220 -->

### 3.18 HDMI 输出接口

<!-- source:cn p39 unit:221 -->

开发板支持两路 HDMI 标准 A 输出接口,支持 HDMI2.1,最大可支持 8K60 视频输出。

<!-- source:cn p40 unit:222 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p040-figure-01.png)

<!-- source:cn p40 unit:223 -->

图 3-21 HDMI TX 接口

<!-- source:cn p40 unit:224 -->

### 3.19 HDMI 输入接口

<!-- source:cn p40 unit:225 -->

开发板支持一路 HDMI 输入接口,支持 HDMI2.0 视频输入,最大可支持 4K60 视频出入。

<!-- source:cn p40 unit:226 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p040-figure-02.png)

<!-- source:cn p40 unit:227 -->

图 3-22 HDMI RX 接口

<!-- source:cn p40 unit:228 -->

### 3.20 风扇电源接口

<!-- source:cn p40 unit:229 -->

开发板预留一个风扇接口,支持 12V/5V 风扇、支持转速可调;开发板默认标配 12V 风扇。接口线序从左往右依次是 GND、12V、SENSOR、CONTROL。

<!-- source:cn p41 unit:230 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p041-figure-01.png)

<!-- source:cn p41 unit:231 -->

图 3-23 风扇电源接口

<!-- source:cn p41 unit:232 -->

### 3.21 Sensor 模组扩展

<!-- source:cn p41 unit:233 -->

开发板配套一个 IMX415 模组,最大可支持到 800W 像素。

<!-- source:cn p41 unit:234 -->

- 支持自动白平衡、3D 降噪、HDR

<!-- source:cn p41 unit:235 -->

- 支持 RAW10/RAW12 数据输出

<!-- source:cn p41 unit:236 -->

- 集成 IRCUT 切换电路,可控制 Sensor 模组日夜模式

<!-- source:cn p41 unit:237 -->

- 模组上预留了 1 组 24pin MIPI 接口,可根据需要扩展为双目应用

<!-- source:cn p41 unit:238 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p041-figure-02.png)

<!-- source:cn p41 unit:239 -->

图 3-24 IMX415 模组小板

<!-- source:cn p42 unit:240 -->

IMX415 模组扩展 24pin 接口信号顺序如下:表 3-3 IMX415 模组扩展接口信号定义表

<!-- source:cn p42 unit:241 -->

| Pin | DPHY |
| --- | --- |
| <code>1</code> | <code>GND</code> |
| <code>2</code> | <code>GND</code> |
| <code>3</code> | <code>NC</code> |
| <code>4</code> | <code>MIPI_DCPHY1_RX_RST_L</code> |
| <code>5</code> | <code>I2C5_SDA_M0_MIPI</code> |
| <code>6</code> | <code>I2C5_SCL_M0_MIPI</code> |
| <code>7</code> | <code>GND</code> |
| <code>8</code> | <code>GND</code> |
| <code>9</code> | <code>MIPI_DPHY1_RX_D0N</code> |
| <code>10</code> | <code>MIPI_DPHY1_RX_D0P</code> |
| <code>11</code> | <code>MIPI_DPHY1_RX_D1N</code> |
| <code>12</code> | <code>MIPI_DPHY1_RX_D1P</code> |
| <code>13</code> | <code>MIPI_DPHY1_RX_D2N</code> |
| <code>14</code> | <code>MIPI_DPHY1_RX_D2P</code> |
| <code>15</code> | <code>MIPI_DPHY1_RX_D3N</code> |
| <code>16</code> | <code>MIPI_DPHY1_RX_D3P</code> |
| <code>17</code> | <code>GND</code> |
| <code>18</code> | <code>MIPI_DPHY1_RX_CLKN</code> |
| <code>19</code> | <code>MIPI_DPHY1_RX_CLKP</code> |
| <code>20</code> | <code>GND</code> |
| <code>21</code> | <code>MIPI_CAM2_CLKOUT</code> |
| <code>22</code> | <code>VCC_3V3_O</code> |
| <code>23</code> | <code>VCC_3V3_D</code> |
| <code>24</code> | <code>VCC_3V3_A</code> |

<!-- source:cn p43 unit:242 -->

### 3.22 Speaker 接口

<!-- source:cn p43 unit:243 -->

开发板预留 2 个 Speaker 接口,并在亚力克外壳预装了 2 个通用喇叭。

<!-- source:cn p43 unit:244 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/cn-p043-figure-01.png)

<!-- source:cn p43 unit:245 -->

图 3-25 SPK 座子

<!-- source:cn p44 unit:246 -->

## 4 注意事项

<!-- source:cn p44 unit:247 -->

### 4.1 注意事项

<!-- source:cn p44 unit:248 -->

RK3588 EVB7 适用于实验室或者工程环境,开始操作前,请先阅读以下注意事项:

<!-- source:cn p44 unit:249 -->

- 任何情况下不可对屏幕接口及扩展板进行热插拔操作。

<!-- source:cn p44 unit:250 -->

- 拆封开发板包装和安装前,为避免静电释放(ESD)对开发板硬件造成损伤,请采取必要防静电措施。

<!-- source:cn p44 unit:251 -->

- 手持开发板时请拿开发板边沿,不要触碰到开发板上的外露金属部分,以免静电对开发板元器件造成损坏。

<!-- source:cn p44 unit:252 -->

- 请将开发板放置于干燥的平面上,以保证它们远离热源、电磁干扰源与辐射源、电磁辐射敏感设备(如:医疗设备)等。

{% endraw %}
