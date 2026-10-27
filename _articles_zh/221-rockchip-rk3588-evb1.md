---
title: "Rockchip RK3588 EVB1 开发板完整使用指南"
description: "Rockchip RK3588 EVB1 开发板完整使用指南 — V1.2, PMIC, MIPI, PCIe, SATA, USB, HDMI, JTAG"
excerpt: "Rockchip RK3588 EVB1 开发板完整使用指南"
translation_key: "221-rockchip-rk3588-evb1"
slug: "221-rockchip-rk3588-evb1"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM", "Rockchip", "RK3588", "EVB1", "hardware"]
---

{% raw %}

# Rockchip RK3588 EVB1 开发板完整使用指南

ArmSoM 平台参考：本文是 Rockchip RK3588 EVB1 的原厂使用指南，不是 ArmSoM 板卡操作说明。具体供电、连接器、按键、PMIC 与管脚配置仅对应原稿 EVB1；在 ArmSoM 硬件使用前必须核对 SoC、原理图和板卡版本。原稿示例涉及 Android，但没有给出统一 SDK/BSP 或内核版本；须使用与目标板匹配的固件及工具。本文未经硬件验证，原厂功能描述与截图均不代表 ArmSoM 实测。刷写可能覆盖存储数据，请先备份并核对固件。

来源：中英文《RK3588 EVB1 User Guide》V1.2。完整保留技术前言、缩略词和第 1–4 章。版本差异和未验证事项见文末。

本文档主要介绍 RK3588 EVB1 基本功能和硬件特性、多功能硬件配置、软件调试操作使用方法,旨在帮助调试人员更快、更准确地使用 RK3588 EVB1,熟悉 RK3588 芯片开发应用方案。

产品版本本文档对应的产品版本如下:

| 产品名称 | 产品版本 |
| --- | --- |
| RK3588 EVB1 | RK_EVB1_RK3588_LP4XD200P232SD10H1_V10_20210818 |

缩略语包括文档中常用词组的简称。

| 缩略词 | 英文描述 | 中文描述 |
| --- | --- | --- |
| CPU | Central Processing Unit | 中央处理器 |
| NPU | Neural Network Processing Unit | 神经网络处理器 |
| VPU | Video Processing Unit | 视频处理器 |
| DDR | Double Data Rate | 双倍速率同步动态随机存储器 |
| eMMC | Embedded Multi Media Card | 内嵌式多媒体存储卡 |
| eDP | Embedded DisplayPort | 嵌入式数码音视讯传输接口 |
| HDMI | High Definition Multimedia Interface | 高清晰度多媒体接口 |
| I2C | Inter-Integrated Circuit | 内部整合电路(两线式串行通讯总线) |
| I2S | Inter-IC Sound | 集成电路内置音频总线 |
| PMIC | Power Management IC | 电源管理芯片 |
| LDO | Low Drop Out Linear Regulator | 低压差线性稳压器 |
| DCDC | Direct Current to Direct Current | 直流电转直流电 |
| CAN | Controller Area Network | 控制器局域网络 |
| SARADC | Successive Approximation Register Analog to<br>Digital Converter | 逐次逼近寄存器型模数转换器 |
| UART | Universal Asynchronous Receiver/ Transmitter | 通用异步收发传输器 |
| JTAG | Joint Test Action Group | 联合测试行为组织 |
| PWM | Pulse Width Modulation | 脉冲宽度调制 |
| MIPI | Mobile Industry Processor Interface | 移动产业处理器接口 |
| LVDS | Low-Voltage Differential Signaling | 低电压差分信号 |
| PMIC | Power Management IC | 电源管理芯片 |
| PMU | Power Management Unit | 电源管理单元 |
| RK/Rockchip | Rockchip Electronics Co.,Ltd. | 瑞芯微电子股份有限公司 |
| USB | Universal Serial Bus | 通用串行总线 |
| SATA | Serial Advanced Technology Attachment | 串行高级技术附件 |
| PCIe | Peripheral Component Interconnect Express | 外围组件快速互连 |
| RGB | Red,Green,Blue;RGB color mode is a color<br>standard in industry | 红绿蓝,RGB色彩模式, 是工业界的一<br>种颜色标准 |
| VGA | Video Graphics Array | 电脑显示视频图像标准接口 |
| ADB | Android Debug Bridge | 安卓调试桥 |
| IR | Infrared Radiation | 红外线 |
| SPDIF | Sony/Philips Digital Interface | 索尼/飞利浦数字音频接口 |
| RTC | Real-time clock | 实时时钟 |
| RGMII | Reduced Gigabit Media Independent Interface | 精简吉比特介质独立接口 |
| WIFI | Wireless Fidelity | 无线保真 |
| CIF | Camera Interface | 摄像头接口 |

## 1 系统概述

### 1.1 RK3588 芯片概述

RK3588 是一颗高性能、低功耗的应用处理器芯片,专为 ARM PC、边缘计算、个人移动互联网设备和其它多媒体应用而设计,是由 4 个 A76 和 4 个 A55 与独立的 NEON 协处理器集成的。RK3588 内置了多种功能强大的嵌入式硬件引擎,为高端应用提供了优异的性能,支持 8K@60fps 的H.265 和 VP9 解码器、8k@30fps 的 H.264 解码器和 4K@60fps 的 AV1 解码器;还支持 8K30fps 的 H.264 和H.265 编码器,高质量的 JPEG 编码器/解码器,专门的图像预处理器和后处理器。内置 3D GPU,能够完全兼容 OpenGL ES1.1/2.0/3.2、OpenCL 2.2 和 Vulkan 1.2。带有 MMU 的特殊 2D硬件引擎将最大限度地提高显示性能,并提供流畅的操作体验。引入了新一代完全基于硬件的 48M 像素 ISP(图像信号处理器),它实现了众多算法加速器,如 HDR、3A、LSC、3DNR、2DNR、锐化、去雾、鱼眼校正、伽马校正等。内嵌的 NPU 支持 INT4/INT8/INT16/FP16 混合运算,算力高达 6TOP。此外,凭借其强大的兼容性,可以轻松转换基于 TensorFlow / MXNet/PyTorch/Caffe 等一系列框架的网络模型。RK3588 具有高性能的 4 通道外部存储器接口(LPDDR4/LPDDR4X/LPDDR5),能够支持苛刻的存储器带宽,还提供了一套完整的外设接口,以支持非常灵活的应用。

### 1.2 RK3588 芯片框图

![RK3588 EVB1 原图 — 1](/docs/rockchip-rk3588-evb1/assets/cn-p012-figure-01.png)

图 1-1 RK3588 芯片框图

### 1.3 系统框图

#### 1.3.1 系统框图

RK3588 EVB1 系统采用 RK3588 的芯片,RK806-2 双 PMIC 的供电方案;存储采用 LPDDR4X、eMMC;有 2xHDMI TX 、1xHDMI RX、MIPI TX、VGA、SATA、PCIe30x4、TYPEC、2xRJ45 等外设接口,集成了一个稳定的可量产化的方案。详细的系统框图如下:

![RK3588 EVB1 原图 — 2](/docs/rockchip-rk3588-evb1/assets/cn-p013-system-block.png)

图 1-2 RK3588 EVB1 系统框图

#### 1.3.2 功能概括

RK3588 EVB1 包含的功能如下:

- DC Power:DC 12V 适配器供电接口

- TYPEC:一路完整 TYPEC 接口,兼容系统固件升级通道以及 DP1.4 输出接口

- USB2.0 HOST0/1:两路 USB2.0standard-A 接口,可以接鼠标、U 盘、USB HUB 等设备

- MIPI DCPHY:支持两路 4lane MIPI DPHY 或者两路 3lane MIPICPHY 信号输入,通过 80pin 座子接入,可通过配套 EVB1 的 IMX415 单目小板实现拍照摄像功能

- MIPI DPHY:支持两路 4lane 或者四路 2lane MIPI 信号输入,通过 80pin 座子接入。可通过配套EVB1 附件 IMX415 单目小板实现拍照摄像功能

- HDMI2.1 OUT:两路 HDMI2.1 OUT standard-A 接口,单路最大可支持 8K@60Hz 输出

- MIPI DPHY0/1 TX:支持两路 4lane MIPI 信号输出,通过 FPC 线连接

- VGA OUT:DP 信号转 VGA 输出

- PCIeWIFI(2T2RWIFI6&BT5.0):WIFI 型号为 AP6275P/AP6275PR3,外置 SMA 天线,支持无线上网功能

- Ethernet:支持 2 路 RJ45 接口 10/100/1000M 以太网

- Audio Interface:支持喇叭、耳机输出声音、单 MIC 录音

- SATA3.0Interface:两路 7pin SATA 接口

- PCIe3.0 Interface:一路标准的 PCIex4 接口,用于扩展 PCIe 设备

- UART Debug:用户调试查看 LOG 信息使用;支持 TYPEC 以及 MINI USB 接口

- JTAG:系统 JTAG 调试接口

- System Key:包含 Reset、MASKROM、PWRON、V+/Recover、V-、MENU、ESC 按键

- SPDIF:支持数字音频接口

- RTC:采用 HYM8563TS 芯片,可由开发板或者纽扣电池(CR1220-3V)供电

#### 1.3.3 功能接口

表 1-1 PCB 功能接口介绍表

| 功能 | 是否可用 |
| --- | --- |
| LPDDR4x(总容量8GB) | YES |
| eMMC(总容量 32GB) | YES |
| SPI Flash | 默认未贴 |
| DC 12V Input | YES |
| USB3.0 OTG(x1 Port) | YES |
| USB2.0 Host(x2 Port) | YES |
| MIPI D/CPHY RX | YES |
| MIPI DPHY RX | YES |
| HDMI2.0 RX | YES |
| HDMI2.1 OUT(2 Port) | YES |
| MIPI DPHY DSI TX1(2x4lane) | YES |
| VGA OUT | YES |
| BT&PCIeWIFI(2x2 WIFI&BT5.0) | YES |
| 千兆网口 10M/100M/1000M(2 Port) | YES |
| Audio(SPK、MIC、Earphone) | YES |
| SATA3.0 Interface(2 Port) | YES |
| PCIe3.0 Interface(4Lane) | YES |
| UART Debug(TPYEC/MINI USB) | YES |
| JTAG Interface | YES |
| System Key | YES |
| Maskrom Key | YES |

#### 1.3.4 功能模块布局

RK3588 EVB1 功能接口分布图:

![RK3588 EVB1 原图 — 3](/docs/rockchip-rk3588-evb1/assets/cn-p015-figure-01.png)

图 1-3 RK3588 EVB1 功能接口分布图(正面)

![RK3588 EVB1 原图 — 4](/docs/rockchip-rk3588-evb1/assets/cn-p016-figure-01.png)

图 1-4 RK3588 EVB1 功能接口分布图(背面)

### 1.4 组件

RK3588 EVB1 套件包括以下物品:

- RK3588EVB1

- 电源适配器,默认规格:输入 100V AC~240V AC,50Hz;输出 12V DC,3A

- 显示屏,规格:MIPI;尺寸:5.5 寸/竖屏;分辨率:1920*1080

- 一根 2.4G/5G 双频 SMA 公头接口天线

- IMX415 单目镜头模组

### 1.5 开关机和待机

RK3588 EVB1 开机、关机以及待机方法介绍如下:

- 开机方法:使用 DC 12V 供电,打开电源总开关;等待进入安卓界面,表示默认固件启动成功。

- 关机方法:长按开机键 6s,系统关机。

- 待机方法:按下开机键,系统会进入一级待机状态。在没有接 USB OTG 情况下,没有其他的任何操作(比如按键操作),软件也没有 Wake_Lock 源,大约 3s 后会从一级待机转入二级待机状态。可通过 Power 按键推出待机模式

### 1.6 固件升级

#### 1.6.1 USB 驱动安装

EVB1 驱动升级前需要先安装驱动,以下介绍 Windows 系统驱动安装流程在提供的工具文件夹里面找到 DriverAssitant_v5.1.1,点击 DriverInstall.exe 文件跳出如下界面。点击“驱动安装”,等待提示安装驱动成功即可。如果已安装旧驱动,请点击“驱动卸载”,并重新安装驱动。

![RK3588 EVB1 原图 — 5](/docs/rockchip-rk3588-evb1/assets/cn-p017-figure-01.png)

图 1-5 驱动安装成功示意图

#### 1.6.2 固件升级方式

RK3588 EVB1 固件升级方式有两种:

- 进入 Loader 升级方式:系统上电前需要保持 SARADC_IN1 为低,系统将进入 Loader 状态。具体步骤如下:

1. 连接 TYPEC 口到电脑 PC 端,按住主板的 V+/REC 按键不放。

2. EVB1 供电 12V,若已经上电,按下复位按键。

3. 烧写工具显示发现一个 Loader 设备后,释放 V+/REC 按键。在工具下图矩形区域,鼠标右击“导入配置”,然后找到固件路径,选择 config 文件

4. 烧写工具对应选择 Loader、Parameter、Uboot 等文件。

5. 点击执行,即进入升级状态,工具的右侧为进度显示栏,显示下载进度与校验情况。

![RK3588 EVB1 原图 — 6](/docs/rockchip-rk3588-evb1/assets/cn-p018-figure-01.png)

![RK3588 EVB1 原图 — 7](/docs/rockchip-rk3588-evb1/assets/cn-p018-figure-02.png)

图 1-6 进入 Loader 烧写模式示意图

- 进入 MASKROM 升级方式:系统上电前 SARADC_IN0 为低,进入 MASKROM 状态。具体步骤如下:

1. 连接 TYPEC 口到电脑 PC 端,按住板子的 MASKROM 按键不放。

2. EVB1 供电 12V,若已经上电,按下复位按键。

3. 烧写工具显示发现一个 MASKROM 设备后,释放 MASKROM 按键。在工具下图矩形区域,鼠标右击“导入配置”,然后找到固件路径,选择 config.cfg 文件

4. 烧写工具对应选择 Loader、Parameter、Uboot 等文件。

5. 点击执行,即进入升级状态,工具的右侧为进度显示栏,显示下载进度与校验情况。

![RK3588 EVB1 原图 — 8](/docs/rockchip-rk3588-evb1/assets/cn-p019-figure-01.png)

![RK3588 EVB1 原图 — 9](/docs/rockchip-rk3588-evb1/assets/cn-p019-figure-02.png)

图 1-7 进入 MASKROM 烧写模式示意图

### 1.7 串口调试

#### 1.7.1 串口工具

连接开发板的 MINI USB Debug 调试接口到电脑 PC 端,在 PC 端设备管理器中得到当前端口 COM号。

![RK3588 EVB1 原图 — 10](/docs/rockchip-rk3588-evb1/assets/cn-p020-figure-01.png)

图 1-8 获取当前端口 COM 号

打开串口工具,在“快速连接”界面下,先选择串口,再选择对应的串口号,将波特率改为 1.5M(RK3588默认支持 1.5M 波特率),并且在 Serial 处关闭流控,最后点击“打开”按钮,即可进入串口调试界面。

![RK3588 EVB1 原图 — 11](/docs/rockchip-rk3588-evb1/assets/cn-p021-figure-01.png)

![RK3588 EVB1 原图 — 12](/docs/rockchip-rk3588-evb1/assets/cn-p021-figure-02.png)

图 1-9 串口工具配置界面

![RK3588 EVB1 原图 — 13](/docs/rockchip-rk3588-evb1/assets/cn-p022-figure-01.png)

图 1-10 串口工具调试界面

#### 1.7.2 ADB 调试

1. 确保驱动安装成功,PC 连接与开发板电源同侧的 TYPEC 口;

2. 开发板上电,开机进入系统;

3. 电脑 PC 端,打开 adb 工具;

4. 输入“`adb shell`”,进入 adb 调试。

![RK3588 EVB1 原图 — 14](/docs/rockchip-rk3588-evb1/assets/cn-p022-figure-02.png)

图 1-11 ADB 连接正常

## 2 硬件介绍

### 2.1 实物图

![RK3588 EVB1 原图 — 15](/docs/rockchip-rk3588-evb1/assets/cn-p023-figure-01.png)

图 2-1 RK3588 EVB1 实物图

### 2.2 电源框图

![RK3588 EVB1 原图 — 16](/docs/rockchip-rk3588-evb1/assets/cn-p024-figure-01.png)

图 2-2 RK3588 EVB1 电源框图

### 2.3 I2C 地址

开发板预留丰富的外围接口,用户调试 I2C 外设会涉及到 I2C 通道复用情况,表 2-1 为现有的开发板器件对应的 I2C 地址和电平值,避免地址冲突和电平不匹配。表 2-1 I2C 通道挂载的外设地址和 IO 电平值对应表

| I2C通道 | 设备 | I2C地址 | 电源域 |
| --- | --- | --- | --- |
| I2C0 | N/A | N/A | N/A |
| I2C1 | N/A | N/A | N/A |
| I2C2 | HYM8563TS(RTC) | 0xA3 | 1.8V |
| I2C2 | FUSB302B(TYPEC) | 0xD6 | 1.8V |
| I2C2 | RTD2166(VGA) | TBD | 1.8V |
| I2C3 | MIPI CSI0 | TBD | 1.8V |
| I2C4 | MIPI CSI1 | TBD | 1.8V |
| I2C5 | MIPI DCPHY0/1 | TBD | 1.8V |
| I2C6 | Touch Panel | TBD | 3.3V |
| I2C7 | ES8388(CODEC) | TBD | 1.8V |
| HDMITX0_I2C | HDMI TX0 | TBD | 3.3V |
| HDMITX1_I2C | HDMI TX1 | TBD | 1.8V |
| HDMIRX_I2C | HDMIRX | TBD | 1.8V |

注意 :使用扩展板时,要保证板上 I2C 地址与开发板上 I2C 地址不冲突。

### 2.4 扩展连接座信息

在实际使用过程中,用户可能会制作扩展板,开发板连接座型号如下:U4600、U4700 为引脚 0.3mm,间距 0.8mm 的立式双排 80PIN 卡座,尺寸如下:

![RK3588 EVB1 原图 — 17](/docs/rockchip-rk3588-evb1/assets/cn-p025-figure-01.png)

![RK3588 EVB1 原图 — 18](/docs/rockchip-rk3588-evb1/assets/cn-p025-figure-02.png)

![RK3588 EVB1 原图 — 19](/docs/rockchip-rk3588-evb1/assets/cn-p026-figure-01.png)

图 2-3 间距 0.8mm 立式双排 80 PIN PCB 封装

### 2.5 参考图

EVB1 对应的参考图、PCB 版本信息如下:

- 参考图:RK_EVB1_RK3588_LP4XD200P232SD10H1_V10_20210818RZF.DSN

- PCB 设计:RK_EVB1_RK3588_LP4XD200P232SD10H1_V10_20210817_final_lint.brd

## 3 模块简述

### 3.1 电源输入

电源适配器输入 12V/3A 电源,通过前端降压变换器(buck)电源后,得到系统电源 VCC5V0_SYS,然后系统电压提供给 PMIC 电源管理芯片,输出不同电压供系统使用。电源适配器输入口、前端 Buck 变换器以及 PMIC 芯片:

![RK3588 EVB1 原图 — 20](/docs/rockchip-rk3588-evb1/assets/cn-p027-figure-01.png)

![RK3588 EVB1 原图 — 21](/docs/rockchip-rk3588-evb1/assets/cn-p027-figure-02.png)

图 3-1 DC12V 输入、前端 buck 变换器以及 PMIC 芯片

### 3.2 存储器

- eMMC:开发板上存储类型为 eMMC FLASH,默认使用的容量 32GB

- SPI Flash:开发板预留 SPI 器件位置

- DDR:开发板 DDR 采用两片 4GB LPDDR4x,总容量 8GB

![RK3588 EVB1 原图 — 22](/docs/rockchip-rk3588-evb1/assets/cn-p028-figure-01.png)

图 3-2 LPDDR4x、eMMC 位置

![RK3588 EVB1 原图 — 23](/docs/rockchip-rk3588-evb1/assets/cn-p028-figure-02.png)

图 3-3 预留 SPI Flash 位置

EVB1 进 MASKROM 烧写的按键位置:

![RK3588 EVB1 原图 — 24](/docs/rockchip-rk3588-evb1/assets/cn-p029-figure-01.png)

图 3-4 进 MASKROM 烧写的按键位置

### 3.3 RTC 电路

RTC 电路采用 HYM8563TS 芯片,可由开发板或者自带纽扣电池(默认不带,需要自行购买 CR1220-3V纽扣电池)供电,保证在板子断电情况下也能继续提供准确的时间,通过 I2C 信号与主控通信。

![RK3588 EVB1 原图 — 25](/docs/rockchip-rk3588-evb1/assets/cn-p029-figure-02.png)

图 3-5 RTC 电路

### 3.4 按键输入

开发板使用 SARADC_IN1 作为进 RECOVER 检测口,支持 12 位分辨率,可以通过 V+/REC 按键,进入LOADER 烧写模式;另外板子还留了 RESET 按键,方便通过硬件复位,重启机器;以及其它常用的几个按键:V+、V-、ESC、MENU、PWRON。按键位置如下:

![RK3588 EVB1 原图 — 26](/docs/rockchip-rk3588-evb1/assets/cn-p030-figure-01.png)

图 3-6 按键位置

### 3.5 SATA 电源座子

开发板所用的 SATA 设备供电口,分别输出 12V/5V。

![RK3588 EVB1 原图 — 27](/docs/rockchip-rk3588-evb1/assets/cn-p030-figure-02.png)

图 3-7 SATA 电源 12V/5V 输出

### 3.6 PCIe 座子

开发板上使用标准 PCIe3.0 连接座,可外接 PCIe 板卡进行通信。

- 工作模式:End Point(EP) &Root Complex(RC)。

- 链路支持 4 lane 数据接口。

- 100MHz 时钟是由外挂时钟芯片 PI6C557-05BLE 提供。

![RK3588 EVB1 原图 — 28](/docs/rockchip-rk3588-evb1/assets/cn-p031-figure-01.png)

图 3-8 PCIex4 座子

### 3.7 以太网口

开发板支持两个 RJ45 接口,可提供双千兆以太网连接功能。分别采用 RK3588 内部集成的千兆以太网MAC 以及 PCIe2.0,与外部 PHY 芯片相连接,PHY 型号为 RTL8211F-CG/RTL8111HS,特性如下:

- 兼容 IEEE802.3 标准,支持全双工和半双工操作,支持交叉检测和自适应。

- 支持 10/100/1000M 数据速率。

- 接口采用带隔离变压器和指示灯的 RJ45 接口组合。

![RK3588 EVB1 原图 — 29](/docs/rockchip-rk3588-evb1/assets/cn-p032-figure-01.png)

图 3-9 千兆网络接口

### 3.8 SATA 接口

- 开发板提供 2 个 7P SATA 接口,其中 J8302 默认为预留;用到时,需要焊上 C8310-C8313 电容,C1820/C1821/C6800/C6801 电容断开不焊。

![RK3588 EVB1 原图 — 30](/docs/rockchip-rk3588-evb1/assets/cn-p032-figure-02.png)

图 3-10 SATA 接口

### 3.9 VGA 输出

开发板支持标准 VGA 接口视频输出,开发板默认贴 RTD2166 芯片。

![RK3588 EVB1 原图 — 31](/docs/rockchip-rk3588-evb1/assets/cn-p033-figure-01.png)

图 3-11 VGA 视频输出接口

### 3.10 BT/WIFI 接口

开发板上 WIFI+BT 模组采用台湾正基 AP6275P,特性如下:

- 支持 2x2WIFI(2.4G and 5G,802.11 a/b/g/n/ac)、BT5.0 功能,外置 2 个 SMA 接口天线。

- BT 数据采用 UART 通信方式。

- BT 语音连接主控 I2S 接口。

- WIFI 数据采用 PCIe 数据总线。RK3588 EVB1 默认配备一根 2.4GHz/5GHz 双模天线。

![RK3588 EVB1 原图 — 32](/docs/rockchip-rk3588-evb1/assets/cn-p034-figure-01.png)

图 3-12 BT/WIFI 天线接口

### 3.11 Debug 接口

开发板支持 TYPEC 以及 MINI USB 调试接口。

![RK3588 EVB1 原图 — 33](/docs/rockchip-rk3588-evb1/assets/cn-p034-figure-02.png)

图 3-13 Debug 接口

### 3.12 JTAG 接口

开发板预留了 2 个 JTAG 接口,下图排针预留接口为 ARM JTAG。标准 JTAG 插座支持 ARM/MCU JTAG,可通过拨码开关切换;当开关 1/2 打开、3/4 关闭支持 ARM JTAG,当开关 1/2 关闭,3/4 打开支持 MCU JTAG。

![RK3588 EVB1 原图 — 34](/docs/rockchip-rk3588-evb1/assets/cn-p035-figure-01.png)

图 3-14 JTAG 座子

![RK3588 EVB1 原图 — 35](/docs/rockchip-rk3588-evb1/assets/cn-p035-figure-02.png)

图 3-15 拨码开关

### 3.13 MIPI D/CPHY 输入接口

MIPI D/CPHY 输入接口采用间距 0.8mm 的立式 80pin 插座(型号为 61082-081402LF,规格见章节 2.4),支持双路 MIPI D/CPHY 接口输入。可以支持两路 4Lane DPHY 模组输入或者两路 3Lane CPHY 模组输入。MIPI DPHY/CPHY 最大分别支持 4.5Gbps/Lane 和 5.7Gbps/Trio。与该 80pin 插座配套座子型号为 61083-081402LF,封装尺寸规格可参考章节 2.4;客户可根据需求制作扩展板卡。

![RK3588 EVB1 原图 — 36](/docs/rockchip-rk3588-evb1/assets/cn-p036-figure-01.png)

图 3-16 MIPI D/CPHY RX 输入接口MIPID/CPHY_RX 接口信号顺序如下:表 3-1 MIPI D/CPHY_RX 信号定义表

| Pin | DPHY(单) | DPHY(双) | CPHY(单) | CPHY(双) | Pin |
| --- | --- | --- | --- | --- | --- |
| 1 | GND | GND | GND | GND | 2 |
| 3 | MIPI_DPHY0_RX_D0N | MIPI_DPHY1_RX_D0N | MIPI_CPHY0_RX_TRIO0_A | MIPI_CPHY1_RX_TRIO0_A | 4 |
| 5 | MIPI_DPHY0_RX_D0P | MIPI_DPHY1_RX_D0P | MIPI_CPHY0_RX_TRIO0_B | MIPI_CPHY1_RX_TRIO0_B | 6 |
| 7 | GND | GND | GND | GND | 8 |
| 9 | MIPI_DPHY0_RX_D1N | MIPI_DPHY1_RX_D1N | MIPI_CPHY0_RX_TRIO0_C | MIPI_CPHY1_RX_TRIO0_C | 10 |
| 11 | MIPI_DPHY0_RX_D1P | MIPI_DPHY1_RX_D1P | MIPI_CPHY0_RX_TRIO1_A | MIPI_CPHY1_RX_TRIO1_A | 12 |
| 13 | GND | GND | GND | GND | 14 |
| 15 | MIPI_DPHY0_RX_CLKN | MIPI_DPHY1_RX_CLKN | MIPI_CPHY0_RX_TRIO1_B | MIPI_CPHY1_RX_TRIO1_B | 16 |
| 17 | MIPI_DPHY0_RX_CLKP | MIPI_DPHY1_RX_CLKP | MIPI_CPHY0_RX_TRIO1_C | MIPI_CPHY1_RX_TRIO1_C | 18 |
| 19 | GND | GND | GND | GND | 20 |
| 21 | MIPI_DPHY0_RX_D2N | MIPI_DPHY1_RX_D2N | MIPI_CPHY0_RX_TRIO2_A | MIPI_CPHY1_RX_TRIO2_A | 22 |
| 23 | MIPI_DPHY0_RX_D2P | MIPI_DPHY1_RX_D2P | MIPI_CPHY0_RX_TRIO2_B | MIPI_CPHY1_RX_TRIO2_B | 24 |
| 25 | GND | GND | GND | GND | 26 |
| 27 | MIPI_DPHY0_RX_D3N | MIPI_DPHY1_RX_D3N | MIPI_CPHY0_RX_TRIO2_C | MIPI_CPHY1_RX_TRIO2_C | 28 |
| 29 | MIPI_DPHY0_RX_D3P | MIPI_DPHY1_RX_D3P | NO_USE | NO_USE | 30 |
| 31 | GND | GND | GND | GND | 32 |
| 33 | NC | NC | NC | NC | 34 |
| 35 | NC | NC | NC | NC | 36 |
| 37 | GND | GND | GND | GND | 38 |
| 39 | MIPI_CAM1_CLKOUT | MIPI_CAM2_CLKOUT | MIPI_CAM1_CLKOUT | MIPI_CAM2_CLKOUT | 40 |
| 41 | NC | NC | NC | NC | 42 |
| 43 | GND | GND | GND | GND | 44 |
| 45 | I2C5_SDA_M0_MIPI | I2C5_SDA_M0_MIPI | I2C5_SDA_M0_MIPI | I2C5_SDA_M0_MIPI | 46 |
| 47 | I2C5_SCL_M0_MIPI | I2C5_SCL_M0_MIPI | I2C5_SCL_M0_MIPI | I2C5_SCL_M0_MIPI | 48 |
| 49 | NC | NC | NC | NC | 50 |
| 51 | MIPI_DCPHY0_RX_PDN_H | MIPI_DCPHY1_RX_PDN_H | MIPI_DCPHY0_RX_PDN_H | MIPI_DCPHY1_RX_PDN_H | 52 |
| 53 | NC | NC | NC | NC | 54 |
| 55 | NC | NC | NC | NC | 56 |
| 57 | MIPI_DPHY_FSYNC | MIPI_DPHY_FSYNC | MIPI_DPHY_FSYNC | MIPI_DPHY_FSYNC | 58 |
| 59 | MIPI_DPHY_HSYNC | MIPI_DPHY_HSYNC | MIPI_DPHY_HSYNC | MIPI_DPHY_HSYNC | 60 |
| 61 | VCC_1V8_S3 | VCC_3V3_S3 | VCC_1V8_S3 | VCC_3V3_S3 | 62 |
| 63 | NC | NC | NC | NC | 64 |
| 65 | MIPI_DCPHY0_PWREN0_H | MIPI_DCPHY0_PWREN1_H | MIPI_DCPHY0_PWREN0_H | MIPI_DCPHY0_PWREN1_H | 66 |
| 67 | IRC_AIN | NC | IRC_AIN | NC | 68 |
| 69 | IRC_BIN | NC | IRC_BIN | NC | 70 |
| 71 | NC | NC | NC | NC | 72 |
| 73 | NC | NC | NC | NC | 74 |
| 75 | GND | GND | GND | GND | 76 |
| 77 | VCC5V0_SYS | GND | VCC5V0_SYS | GND | 78 |
| 79 | VCC5V0_SYS | VCC12V_DCIN | VCC5V0_SYS | VCC12V_DCIN | 80 |

### 3.14 MIPI DPHY 输入接口

MIPI DPHY 输入接口采用间距 0.8mm 的立式 80pin 插座(型号为 61082-081402LF,规格见章节 2.4)。可以支持两路 4Lane MIPI DPHY 模组输入或者四路 2Lane MIPI DPHY 信号输入。MIPI DPHY 最大分别支持2.5Gbps/Lane。与 MIPI D/CPHY 一起可以组成最大 6 路模组输入。与该 80pin 插座配套座子型号为 61083-081402LF,封装尺寸规格可参考章节 2.4;客户可根据需求制作扩展板卡。

![RK3588 EVB1 原图 — 37](/docs/rockchip-rk3588-evb1/assets/cn-p038-figure-01.png)

图 3-17 MIPI DPHY 视频输入接口

表 3-2 MIPI DPHY_RX 信号定义表

| Pin | DPHY(单) | DPHY(双) | Pin |
| --- | --- | --- | --- |
| 1 | GND | GND | 2 |
| 3 | MIPI_CSI0_RX_D0N | MIPI_CSI1_RX_D0N | 4 |
| 5 | MIPI_CSI0_RX_D0P | MIPI_CSI1_RX_D0P | 6 |
| 7 | GND | GND | 8 |
| 9 | MIPI_CSI0_RX_D1N | MIPI_CSI1_RX_D1N | 10 |
| 11 | MIPI_CSI0_RX_D1P | MIPI_CSI1_RX_D1P | 12 |
| 13 | GND | GND | 14 |
| 15 | MIPI_CSI0_RX_CLK0N | MIPI_CSI1_RX_CLK0N | 16 |
| 17 | MIPI_CSI0_RX_CLK0P | MIPI_CSI1_RX_CLK0P | 18 |
| 19 | GND | GND | 20 |
| 21 | MIPI_CSI0_RX_D2N | MIPI_CSI1_RX_D2N | 22 |
| 23 | MIPI_CSI0_RX_D2P | MIPI_CSI1_RX_D2P | 24 |
| 25 | GND | GND | 26 |
| 27 | MIPI_CSI0_RX_D3N | MIPI_CSI1_RX_D3N | 28 |
| 29 | MIPI_CSI0_RX_D3P | MIPI_CSI1_RX_D3P | 30 |
| 31 | GND | GND | 32 |
| 33 | MIPI_CSI0_RX_CLK1N | MIPI_CSI1_RX_CLK1N | 34 |
| 35 | MIPI_CSI0_RX_CLK1P | MIPI_CSI1_RX_CLK1P | 36 |
| 37 | GND | GND | 38 |
| 39 | MIPI_CAM3_CLKOUT | MIPI_CAM4_CLKOUT | 40 |
| 41 | NC | NC | 42 |
| 43 | GND | GND | 44 |
| 45 | I2C3_SDA_M0_MIPI | I2C4_SDA_M3_MIPI | 46 |
| 47 | I2C3_SCL_M0_MIPI | I2C4_SCL_M3_MIPI | 48 |
| 49 | NC | NC | 50 |
| 51 | MIPI_CSI0_PDN0_H | MIPI_CSI1_PDN0_H | 52 |
| 53 | NC | NC | 54 |
| 55 | MIPI_CSI0_PDN1_H | MIPI_CSI1_PDN1_H | 56 |
| 57 | MIPI_DPHY_FSYNC | MIPI_DPHY_FSYNC | 58 |
| 59 | MIPI_DPHY_HSYNC | MIPI_DPHY_HSYNC | 60 |
| 61 | VCC_1V8_S3 | VCC_3V3_S3 | 62 |
| 63 | NC | NC | 64 |
| 65 | MIPICSI0_PWREN_H | MIPICSI1_PWREN_H | 66 |
| 67 | IRC_AIN | NC | 68 |
| 69 | IRC_BIN | NC | 70 |
| 71 | NC | NC | 72 |
| 73 | NC | NC | 74 |
| 75 | GND | GND | 76 |
| 77 | VCC5V0_SYS | GND | 78 |
| 79 | VCC5V0_SYS | VCC12V_DCIN | 80 |

### 3.15 TYPEC 接口

开发板支持一个完整的 TYPEC 接口,支持以下功能:

- 该接口中的 TYPEC0_USB20_OTG 可用来下载固件

- 支持 TYPEC 功能

- 支持 DP1.4 输出

![RK3588 EVB1 原图 — 38](/docs/rockchip-rk3588-evb1/assets/cn-p040-figure-01.png)

图 3-18 TYPEC 接口

### 3.16 USB3.0 接口

开发板支持一路 USB3.0 OTG 接口;接口为标准的 A 口,方便开发者接入 USB3.0 U 盘以及其他 USB3.0设备

![RK3588 EVB1 原图 — 39](/docs/rockchip-rk3588-evb1/assets/cn-p040-figure-02.png)

图 3-19 USB3.0 OTG 接口

### 3.17 USB2.0 Host 接口

开发板支持两路 USB2.0;集成在双层 USB 器件上,可支持连接如鼠标、U 盘、蓝牙等 USB 设备。

![RK3588 EVB1 原图 — 40](/docs/rockchip-rk3588-evb1/assets/cn-p041-figure-01.png)

图 3-20 USB2.0 Host 接口

### 3.18 HDMI 输出接口

开发板支持两路 HDMI 标准 A 输出接口,最大支持 HDMI2.1,最大可支持 8K60 视频输出。

![RK3588 EVB1 原图 — 41](/docs/rockchip-rk3588-evb1/assets/cn-p041-figure-02.png)

图 3-21 HDMI TX 接口

### 3.19 HDMI 输入接口

开发板支持一路 HDMI 输入接口,最大可支持 HDMI2.0 视频输入。

![RK3588 EVB1 原图 — 42](/docs/rockchip-rk3588-evb1/assets/cn-p042-figure-01.png)

图 3-22 HDMI RX 接口

### 3.20 风扇电源接口

开发板预留一个风扇接口,支持 12V/5V 风扇、支持转速可调;开发板默认标配 12V 风扇。接口线序从左往右依次是 GND、12V、SENSOR、CONTROL

![RK3588 EVB1 原图 — 43](/docs/rockchip-rk3588-evb1/assets/cn-p042-figure-02.png)

图 3-23 风扇电源接口

### 3.21 Sensor 模组扩展

开发板配套一个 IMX415 模组,最大可支持到 800W 像素。

- 支持自动白平衡、3D 降噪、HDR

- 支持 RAW10/RAW12 数据输出

- 集成 IRCUT 切换电路,可控制 Sensor 模组日夜模式

- 模组上预留了 1 组 24pin MIPI 接口,可根据需要扩展为双目应用

![RK3588 EVB1 原图 — 44](/docs/rockchip-rk3588-evb1/assets/cn-p043-figure-01.png)

图 3-24 IMX415 模组小板IMX415 模组扩展接口信号顺序如下:表 3-3 IMX415 模组扩展接口信号定义表

| Pin | DPHY |
| --- | --- |
| 1 | GND |
| 2 | GND |
| 3 | NC |
| 4 | MIPI_DCPHY1_RX_RST_L |
| 5 | I2C5_SDA_M0_MIPI |
| 6 | I2C5_SCL_M0_MIPI |
| 7 | GND |
| 8 | GND |
| 9 | MIPI_DPHY1_RX_D0N |
| 10 | MIPI_DPHY1_RX_D0P |
| 11 | MIPI_DPHY1_RX_D1N |
| 12 | MIPI_DPHY1_RX_D1P |
| 13 | MIPI_DPHY1_RX_D2N |
| 14 | MIPI_DPHY1_RX_D2P |
| 15 | MIPI_DPHY1_RX_D3N |
| 16 | MIPI_DPHY1_RX_D3P |
| 17 | GND |
| 18 | MIPI_DPHY1_RX_CLKN |
| 19 | MIPI_DPHY1_RX_CLKP |
| 20 | GND |
| 21 | MIPI_CAM2_CLKOUT |
| 22 | VCC_3V3_O |
| 23 | VCC_3V3_D |
| 24 | VCC_3V3_A |

### 3.22 Speaker 接口

开发预留 2 个 Speaker 接口

![RK3588 EVB1 原图 — 45](/docs/rockchip-rk3588-evb1/assets/cn-p044-figure-01.png)

图 3-25 SPK 座子

## 4 注意事项

### 4.1 注意事项

RK3588 EVB1 适用于实验室或者工程环境,开始操作前,请先阅读以下注意事项:

- 任何情况下不可对屏幕接口及扩展板进行热插拔操作。

- 拆封开发板包装和安装前,为避免静电释放(ESD)对开发板硬件造成损伤,请采取必要防静电措施。

- 手持开发板时请拿开发板边沿,不要触碰到开发板上的外露金属部分,以免静电对开发板元器件造成损坏。

- 请将开发板放置于干燥的平面上,以保证它们远离热源、电磁干扰源与辐射源、电磁辐射敏感设备(如:医疗设备)等。

## 版本差异与待核对事项

两稿均标 V1.2；中文 45 页，英文 43 页。中文保留中文原图；英、俄、德文采用英文 PDF 原图，图内仍有中文工具界面，不伪称全部标签已英文化。原始 PDF 不修改。表格恢复为可编辑文本，两张 80pin 和一张 24pin 跨页表逐项核对：中英文所有信号单元格一致。

- 1.3.1 中文写 RK806-2 双 PMIC，英文还列 RK806-1 单 PMIC 可选方案；中文同时明确 2xHDMI TX、1xHDMI RX、MIPI TX、VGA、SATA、PCIe30x4、TYPEC、2xRJ45。不能据此假定所有 EVB1 实物都可直接替换供电方案。
- 1.3.2 中文补充配套 IMX415 单目小板拍照摄像；DPHY 为两路 4lane 或四路 2lane。英文概括误写两路 2lane，而两稿 3.14 均写四路 2Lane。CPHY 中文写 3lane/3Lane，英文写 3trio；3.13 两稿速率单位均为 5.7Gbps/Trio。以上差异保留，不混淆信号组织。
- 1.4 竖屏分辨率中文为 1920*1080，英文为 1080*1920，均保留。套件清单均写一根天线；3.10 中文末句一根、英文末句两根，同时均描述两个 SMA 接口。以实际 BOM 与套件为准。
- 2.5 中文参考文件为 `RK_EVB1_RK3588_LP4XD200P232SD10H1_V10_20210818RZF.DSN` 和 `RK_EVB1_RK3588_LP4XD200P232SD10H1_V10_20210817_final_lint.brd`；英文为 `RK_EVB1_RK3588_LP4XD200P232SD10H1_V11_20211213RZF.DSN` 和 `RK_EVB1_RK3588_LP4XD200P232SD10H1_V11_20211213_final_lint.brd`。前言产品版本仍为 V10，不能把不同板卡版本静默合并。
- 3.8 中文独有装配要求：J8302 默认预留；使用时焊接 C8310-C8313，C1820/C1821/C6800/C6801 断开不焊。仅适用于匹配原理图/BOM 的 EVB1，不是让读者直接改装 ArmSoM。英文图 3-10 错题为 UART Debug Interface，中文题为 SATA 接口。
- 原稿 I2C 地址 0xA3、0xD6 原样保留，未说明 7-bit/8-bit 编码，接入驱动前必须核对；TBD 不补造地址。前言缩略词 PMIC 重复行保留。表中 TPYEC、图中 VAG 等原稿拼写不解释为另一种接口。
- 3.21 两稿均写“800W”像素；这里不擅自将其改成经验证的精确像素规格，需按实际 IMX415 模组资料核对。文中广告性功能描述来自原稿，不代表经过本文测试。


官方参考: [Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/).

{% endraw %}
