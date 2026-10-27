---
title: "Rockchip RK3588 EVB7 User Guide"
description: "Rockchip RK3588 EVB7 User Guide — V1.0"
excerpt: "Rockchip RK3588 EVB7 User Guide"
translation_key: "222-rockchip-rk3588-evb7-user-guide"
slug: "222-rockchip-rk3588-evb7-user-guide"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: [ArmSoM, Rockchip, RK3588, EVB7]
---

{% raw %}

# Rockchip RK3588 EVB7 User Guide

Complete technical text from the V1.0 Chinese source (2023-06-20, 44 pages) and English source (2023-06-29, 43 pages), retaining the product version, glossary and all four chapters. Legal, audience, revision and contents pages are omitted. This describes the specified Rockchip EVB7, not ArmSoM product specifications or a current support commitment. No flashing, wiring or hardware testing was performed. Firmware upgrades may overwrite data: back up and verify firmware and board versions first. Never hot-plug the display or expansion board; observe the final chapter’s ESD and power precautions.

Source differences and issues: Chinese function summary and 3.8 specify one SATA port; English summary and both function tables say two. Source values are retained for checking against the actual board. The Chinese display specification is 1920×1080, English 1080×1920. Chinese has an extra 4.1 subheading. English figure 3-10/3-11/3-14 captions UART/VGA/RS484 are corrected to SATA/DP/RS485 using Chinese and the photographs; Aggreko housing is read as acrylic from Chinese. Chinese-only dual 4-lane DPHY / dual 3-Trio CPHY summary and the connector models in 2.4 are added. Table 3-1 says CDPHY in Chinese, DPHY in English; signal values match and are preserved. TBD denotes an unspecified source value, not an editorial placeholder. Original diagrams and interfaces contain English/Chinese labels, not fully localized artwork.

<!-- source:en p3 unit:0 -->

This guide mainly introduces the basic functions and hardware features, multi-function hardware configuration, and software debugging operation methods of RK3588 EVB7. It aims to help debuggers use RK3588 EVB7 be faster and more accurately, and be familiar with RK3588 chip development and application solutions.

<!-- source:en p3 unit:1 -->

Product version The product versions corresponding to this document are as follows:

<!-- source:en p3 unit:2 -->

| Product name | Product version |
| --- | --- |
| <code>RK3588 EVB7</code> | <code>RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428</code> |

<!-- source:en p5 unit:3 -->

Acronyms used in this document:

<!-- source:en p5 unit:4 -->

| Abbreviation | English meaning | Chinese meaning |
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
| <code>RGB</code> | Red,Green,Blue;RGB color mode is a color<br>standard in industry | 红绿蓝,RGB 色彩模式, 是工业界的一<br>种颜色标准 |
| <code>VGA</code> | Video Graphics Array | 电脑显示视频图像标准接口 |
| <code>ADB</code> | Android Debug Bridge | 安卓调试桥 |
| <code>IR</code> | Infrared Radiation | 红外线 |
| <code>SPDIF</code> | Sony/Philips Digital Interface | 索尼/飞利浦数字音频接口 |
| <code>RTC</code> | Real-time clock | 实时时钟 |
| <code>RGMII</code> | Reduced Gigabit Media Independent Interface | 精简吉比特介质独立接口 |
| <code>WIFI</code> | Wireless Fidelity | 无线保真 |
| <code>CIF</code> | Camera Interface | 摄像头接口 |

<!-- source:en p11 unit:6 -->

## 1 System Introduction

<!-- source:en p11 unit:7 -->

### 1.1 RK3588 Introduction

<!-- source:en p11 unit:8 -->

RK3588 is a high-performance, low-power application processor chip. It integrates 4 Cortex-A76, 4 Cortex-A55 and independent NEON coprocessor. Suitable for ARM PC, edge computing, personal mobile Internet devices and other multimedia products. RK3588 has built-in a variety of powerful embedded hardware engines, providing excellent performance for high-end applications. It supports 8K@60fps H.265 and VP9 decoder, 8k@30fps H.264 decoder and 4K@60fps AV1 decoder; it also supports 8K@30fps H.264 and H.265 encoder, high quality JPEG encoder/decoder, dedicated image pre-processor and post-processor. RK3588 has a built-in 3D GPU that is fully compatible with OpenGL ES1.1/2.0/3.2, OpenCL 2.2 and Vulkan 1.2. The special 2D hardware engine with MMU will maximize the display performance and provide a smooth operating experience. RK3588 introduces a new generation of ISP with the largest 48M pixels completely based on hardware. It implements many algorithm accelerators, such as HDR, 3A, LSC, 3DNR, 2DNR, sharpening, defogging, fisheye correction, gamma correction, etc. The NPU embedded in RK3588 supports INT4/INT8/INT16/FP16 mixed operation, and the computing power is up to 6TOP. In addition, with its strong compatibility, network models based on a series of frameworks such as TensorFlow/MXNet/PyTorch/Caffe can be easily converted. RK3588 has high-performance 4-channel external memory interfaces (LPDDR4/LPDDR4X/LPDDR5), which can support systems with high memory bandwidth requirements, and also provides a complete set of peripheral interfaces to flexibly support various Class application.

<!-- source:en p12 unit:10 -->

### 1.2 RK3588 Chip Block Diagram

<!-- source:en p12 unit:11 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p012-figure-01.png)

<!-- source:en p12 unit:12 -->

Figure 1-1 RK3588 Chip Block Diagram

<!-- source:en p12 unit:13 -->

### 1.3 System Framework

<!-- source:en p12 unit:14 -->

#### 1.3.1 System Block Diagram

<!-- source:en p12 unit:15 -->

The RK3588 EVB7 system uses the RK3588 chip with the RK806-1 single PMIC power supply scheme. The storage uses a combination of LPDDR4X and eMMC. It supports various external interfaces such as 2xHDMI TX, 1xDP OUT, 1xHDMI RX, 2xMIPI TX, SATA, PCIe30x4, TYPEC, 2xRJ45, etc. The system supports a stable and feasible solution for mass production.The detailed system block diagram is as follows:

<!-- source:en p13 unit:17 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p013-system-block.png)

<!-- source:en p13 unit:18 -->

Figure 1-2 RK3588 EVB7 System Block Diagram

<!-- source:en p13 unit:19 -->

#### 1.3.2 Function Summary

<!-- source:en p13 unit:20 -->

RK3588 EVB7 includes the following functions:

<!-- source:en p13 unit:21 -->

- DC Power: DC 12V adapter power supply interface

<!-- source:en p13 unit:22 -->

- TYPEC: One complete TYPEC interface, compatible with system firmware upgrade channel and DP1.4 output interface

<!-- source:en p13 unit:23 -->

- USB2.0 HOST1: one-way USB2.0 standard-A interface, can connect to mouse, U disk, USB HUB and other equipment

<!-- source:en p13 unit:24 -->

- USB2.0 OTG: one-way USB2.0 standard-A interface supports OTG, can connect to PC, mouse, U disk, USB HUB and other equipment

<!-- source:en p13 unit:25 -->

- USB3.0 HOST: one-way USB3.0 standard-A interface, can connect to mouse, U disk, USB HUB and other equipment

- MIPI DCPHY RX (Chinese-source addition): two 4-lane MIPI DPHY inputs or two 3-Trio MIPI CPHY inputs through an 80-pin connector.

<!-- source:en p13 unit:26 -->

- MIPI DPHY RX: Support two 4lane or four 2lane MIPI signal input, connected via 80pin connector. It supports camera function through ext-board RK_EVB_RK3588_EXTBOARD1_IMX415_V11_20211027

<!-- source:en p13 unit:27 -->

- HDMI2.1 OUT: Two HDMI2.1 OUT standard-A interfaces, a single channel can support up to 8K@60Hz output

<!-- source:en p13 unit:28 -->

- DP OUT: one DP OUT standard-A interface, a single channel can support up to 4K@60Hz output

<!-- source:en p13 unit:29 -->

- HDMI2.0 IN: one HMI IN standard-A interface, support up to 4K@60Hz video input

<!-- source:en p14 unit:31 -->

- MIPI DPHY0/1 TX: Support two 4lane MIPI signal output, access via FPC line

<!-- source:en p14 unit:32 -->

- Wi-Fi (2T2R MIMO): Wi-Fi model is AP6398, external SMA antenna, support wireless Internet function

<!-- source:en p14 unit:33 -->

- Ethernet: Support two channels RJ45 ports 10/100/1000M Ethernet;

<!-- source:en p14 unit:34 -->

- Audio Interface: Support speaker, earphone output sound, single MIC recording

<!-- source:en p14 unit:35 -->

- SATA3.0 Interface: Two 7pin SATA interface

<!-- source:en p14 unit:36 -->

- PCIe3.0 Interface: One standard PCIex4 interface, used to expand PCIe devices

<!-- source:en p14 unit:37 -->

- TF Card: supports TF card expansion, support SD3.0, MMC ver4.51

<!-- source:en p14 unit:38 -->

- UART Debug: User debugging to view the LOG information; support TYPEC and MINI USB interface;

<!-- source:en p14 unit:39 -->

- JTAG: JTAG debug interface of system;

<!-- source:en p14 unit:40 -->

- System Key: Include Reset, MASKROM, PWRON, V+/Recover, V-, MENU, ESC button;

<!-- source:en p14 unit:41 -->

- SPDIF: Support digital audio interface;

<!-- source:en p14 unit:42 -->

- RTC: Using HYM8563TS chip, can be powered by development board or button battery (CR1220-3V)

<!-- source:en p14 unit:43 -->

#### 1.3.3 Functional Interface

<!-- source:en p14 unit:44 -->

Table 1-1 PCB Functional Interface Introduction Table

<!-- source:en p14 unit:45 -->

| Function | usable or not |
| --- | --- |
| LPDDR4x (total capacity 8GB) | <code>YES</code> |
| eMMC (total capacity 32GB) | <code>YES</code> |
| DC 12V Input | <code>YES</code> |
| TYPEC | <code>YES</code> |
| USB3.0 OTG (x1 Port) | <code>YES</code> |
| USB2.0 Host (x1 Port) | <code>YES</code> |
| USB2.0 OTG (x1 Port) | <code>YES</code> |
| MIPI D/CPHY RX | <code>YES</code> |
| MIPI DPHY RX | <code>YES</code> |
| HDMI2.0 RX | <code>YES</code> |
| HDMI2.1 OUT (2 Port) | <code>YES</code> |
| MIPI DPHY DSI TX1 (2x4lane) | <code>YES</code> |
| DP OUT | <code>YES</code> |
| BT&amp;Wi-Fi (2x2 Wifi&amp;BT5.0) | <code>YES</code> |
| 1000 Mbps Ethernet port 10M/100M/1000M (2 Port) | <code>YES</code> |
| Audio (SPK、MIC、Earphone) | <code>YES</code> |
| SATA3.0 Interface (2 Port) | <code>YES</code> |
| PCIe3.0 Interface (4Lane) | <code>YES</code> |
| UART Debug (TPYEC/MINI USB) | <code>YES</code> |
| JTAG Interface | <code>YES</code> |
| System Key | <code>YES</code> |
| Maskrom Key | <code>YES</code> |

<!-- source:en p15 unit:48 -->

#### 1.3.4 Function Module Layout

<!-- source:en p15 unit:49 -->

EVB7 functional interface distribution diagram:

<!-- source:en p15 unit:50 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p015-figure-01.png)

<!-- source:en p15 unit:51 -->

Figure 1-3 EVB7 Functional Interface Distribution Diagram (front)

<!-- source:en p16 unit:53 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p016-figure-01.png)

<!-- source:en p16 unit:54 -->

Figure 1-4 EVB7 Functional Interface Distribution Diagram (back)

<!-- source:en p16 unit:55 -->

### 1.4 Module

<!-- source:en p16 unit:56 -->

The RK3588 EVB7 kit includes the following items:

<!-- source:en p16 unit:57 -->

- RK3588 EVB7

<!-- source:en p16 unit:58 -->

- Power adapter, default specification: input 100V AC~240V AC, 50Hz; output 12V DC, 3A

<!-- source:en p16 unit:59 -->

- Display, specification: MIPI; size: 5.5 inches/vertical screen; resolution: 1080*1920

<!-- source:en p16 unit:60 -->

- One 2.4G/5G dual-band SMA male connector antennas

<!-- source:en p16 unit:61 -->

- IMX415 monocular camera module (EVB_RK3588_EXTBOARD1_IMX415_V11_20211027)

<!-- source:en p16 unit:62 -->

### 1.5 Power on and off and Standby

<!-- source:en p16 unit:63 -->

The EVB7 power on, power off and standby methods are introduced as follows:

<!-- source:en p16 unit:64 -->

- Power on: Use DC 12V power supply, turn on the main power switch; wait to enter the Android interface, it means that the default firmware has been successfully started.

<!-- source:en p16 unit:65 -->

- Power off: Press and hold the power button for 6 seconds to shut down the system.

<!-- source:en p16 unit:66 -->

- Standby: Press the power button, the system will enter the first-level standby state. When there is no USB OTG connection, and there is no other operation (such as key operation), and the software does not have a Wake_Lock source. After about 3s, it will switch from the first-level standby to the second-level standby state. Standby mode can be exited through the Power button.

<!-- source:en p17 unit:68 -->

### 1.6 Firmware Upgrade

<!-- source:en p17 unit:69 -->

#### 1.6.1 USB Driver Installation

<!-- source:en p17 unit:70 -->

The driver needs to be installed before the EVB driver is upgraded. The following describes the driver installation process under Windows system. Find DriverAssitant_v5.1.1 in the provided tool folder, and click DriverInstall.exe to pop up the following interface. Click "Install Driver" and wait for the prompt to install the driver successfully. If the old driver has been installed, please click "Uninstall Driver " and reinstall the driver.

<!-- source:en p17 unit:71 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p017-figure-01.png)

<!-- source:en p17 unit:72 -->

Figure 1-5 Schematic Diagram of Successful Driver Installation

<!-- source:en p17 unit:73 -->

#### 1.6.2 Firmware Upgrade Method

<!-- source:en p17 unit:74 -->

There are two ways to upgrade RK3588 EVB7 firmware:

<!-- source:en p17 unit:75 -->

- Enter Loader upgrade mode: Before the system is powered on, SARADC_IN1 needs to be kept low, and the system will enter the Loader state. Specific steps are as follows:

<!-- source:en p17 unit:76 -->

1) Connect the TYPEC port to the PC, press and hold the V+/REC button on the mainboard.

<!-- source:en p17 unit:77 -->

2) EVB is powered by 12V. If it has been powered on, press the reset button.

<!-- source:en p17 unit:78 -->

3) After the programming tool shows that “a Loader device is found”, release the V+/REC button. In the red rectangular area of the tool, right-click and choose "Import Configuration", then find the firmware path, and select the config file

<!-- source:en p17 unit:79 -->

4) The programming tool corresponds to selecting Loader, Parameter, Uboot and other files.

<!-- source:en p17 unit:80 -->

5) Click Execute to enter the upgrade state. The right side of the tool is the progress display bar, which displays the download progress and verification status.

<!-- source:en p18 unit:82 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p018-figure-01.png)

<!-- source:en p18 unit:83 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p018-figure-02.png)

<!-- source:en p18 unit:84 -->

Figure 1-6 Schematic Diagram of Entering Loader Programming Mode

<!-- source:en p18 unit:85 -->

- Enter MASKROM upgrade mode: Before the system is powered on, SARADC_IN0 is low and enters the MASKROM state. Specific steps are as follows:

<!-- source:en p18 unit:86 -->

1) Connect the TYPEC port to the PC, press and hold the MASKROM button on the board.

<!-- source:en p18 unit:87 -->

2) EVB is powered by 12V. If it has been powered on, press the reset button.

<!-- source:en p18 unit:88 -->

3) After the programming tool shows that “a MASKROM device is found”, release the MASKROM button. In the red rectangular area of the tool, right-click and choose "Import Configuration", then find the firmware path, and select the config.cfg file

<!-- source:en p18 unit:89 -->

4) The programming tool correspondingly selects Loader, Parameter, Uboot and other files.

<!-- source:en p18 unit:90 -->

5) Click Execute to enter the upgrade state. The right side of the tool is the progress display bar, which displays the download progress and verification status.

<!-- source:en p19 unit:92 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p019-figure-01.png)

<!-- source:en p19 unit:93 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p019-figure-02.png)

<!-- source:en p19 unit:94 -->

Figure 1-7 Schematic Diagram of Entering MASKROM Programming Mode

<!-- source:en p19 unit:95 -->

### 1.7 Serial Debugging

<!-- source:en p19 unit:96 -->

#### 1.7.1 Serial Port Tool

<!-- source:en p19 unit:97 -->

Connect the MINI USB Debug debugging interface of the development board to the computer, and get the current port COM number in the device manager of the PC end.

<!-- source:en p20 unit:99 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p020-figure-01.png)

<!-- source:en p20 unit:100 -->

Figure 1-8 Get the Current Port COM Number

<!-- source:en p20 unit:101 -->

Open the serial port tool, under the "Quick Connect" interface, first select the serial port, then select the corresponding serial port number, change the baud rate to 1.5M (RK3588 supports 1.5M baud rate by default), and close the flow control at Serial, Finally, click the "Open" button to enter the serial port debugging interface.

<!-- source:en p21 unit:103 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p021-figure-01.png)

<!-- source:en p21 unit:104 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p021-figure-02.png)

<!-- source:en p21 unit:105 -->

Figure 1-9 Serial Port Tool Configuration Interface

<!-- source:en p22 unit:107 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p022-figure-01.png)

<!-- source:en p22 unit:108 -->

Figure 1-10 Serial Port Tool Debug Interface

<!-- source:en p22 unit:109 -->

#### 1.7.2 ADB Debug

<!-- source:en p22 unit:110 -->

1) Ensure that the driver is installed successfully, and the PC is connected to the TYPE_C port on the same side as the power supply of the development board;

<!-- source:en p22 unit:111 -->

2) Power on the development board and boot into the system;

<!-- source:en p22 unit:112 -->

3) Open the adb tool on the PC side;

<!-- source:en p22 unit:113 -->

4) Type "adb shell" to enter adb debugging.

<!-- source:en p22 unit:114 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p022-figure-02.png)

<!-- source:en p22 unit:115 -->

Figure 1-11 ADB Connection is Normal

<!-- source:en p23 unit:116 -->

## 2 Hardware Introduction

<!-- source:en p23 unit:117 -->

### 2.1 The Pictures

<!-- source:en p23 unit:118 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p023-figure-01.png)

<!-- source:en p23 unit:119 -->

Figure 2-1 RK3588 EVB7 Picture

<!-- source:en p24 unit:120 -->

### 2.2 Power Block Diagram

<!-- source:en p24 unit:121 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p024-figure-01.png)

<!-- source:en p24 unit:122 -->

Figure 2-2 RK3588 EVB7 Block Diagram

<!-- source:en p24 unit:123 -->

### 2.3 I2C Address

<!-- source:en p24 unit:124 -->

The development board reserves a wealth of peripheral interfaces. The user debugging I2C peripherals will involve I2C channel multiplexing. Table 2-1 shows the I2C address and level values corresponding to the existing development board devices. Table 2-1 Correspondence Table of Peripheral Address and IO Level Value Mounted on I2C Channel

<!-- source:en p24 unit:125 -->

| I2C channel | Device | I2C address | Power domain |
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

<!-- source:en p24 unit:126 -->

Note: When using the expansion board, make sure that the I2C address on the board does not conflict with the I2C address on the development board.

<!-- source:en p25 unit:127 -->

### 2.4 Extension Connector Information

<!-- source:en p25 unit:128 -->

In actual use, the user may make an expansion board. The model of the development board connector is as follows: U4600 and U4700 are vertical double-row 80PIN card sockets with 0.3mm pins and 0.8mm spacing. The dimensions are as follows:

Chinese-source connector models: board 61082-081402LF; mating expansion-board connector 61083-081402LF.

<!-- source:en p25 unit:129 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p025-figure-01.png)

<!-- source:en p25 unit:130 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p025-figure-02.png)

<!-- source:en p26 unit:131 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p026-figure-01.png)

<!-- source:en p26 unit:132 -->

Figure 2-3 Pitch 0.8mm Vertical Double Row 80 PIN PCB Package

<!-- source:en p26 unit:133 -->

### 2.5 Reference Diagram

<!-- source:en p26 unit:134 -->

The reference diagram and PCB design information corresponding to the EVB7 are as follows:

<!-- source:en p26 unit:135 -->

- Reference diagram: RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428RZF.DSN

<!-- source:en p26 unit:136 -->

- PCB design: RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428YWQ_final.brd

<!-- source:en p27 unit:137 -->

## 3 Module Brief

<!-- source:en p27 unit:138 -->

### 3.1 Power Input

<!-- source:en p27 unit:139 -->

The power adapter inputs 12V/3A power, after passing the front-end buck converter power supply, the system power VCC4V0_SYS is obtained, and then the system voltage is provided to the PMIC power management chip, and different voltages are output for system use. Power adapter input port, front-end Buck converter and PMIC chip:

<!-- source:en p27 unit:140 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p027-figure-01.png)

<!-- source:en p27 unit:141 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p027-figure-02.png)

<!-- source:en p27 unit:142 -->

Figure 3-1 DC12V Input, Front-end Buck Converter and PMIC Chip

<!-- source:en p28 unit:143 -->

### 3.2 Memory

<!-- source:en p28 unit:144 -->

- eMMC: The storage type on the development board is eMMC FLASH, and the default capacity is 32GB;:

<!-- source:en p28 unit:145 -->

- DDR: The development board DDR adopts two pieces of 4GB LPDDR4x, with a total capacity of 8GB.

<!-- source:en p28 unit:146 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p028-figure-01.png)

<!-- source:en p28 unit:147 -->

Figure 3-2 Location of LPDDR4x

<!-- source:en p28 unit:148 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p028-figure-02.png)

<!-- source:en p28 unit:149 -->

Figure 3-3 Location of eMMC The key position of EVB into MASKROM programming:

<!-- source:en p28 unit:150 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p028-figure-03.png)

<!-- source:en p28 unit:151 -->

Figure 3-4 Key Position of EVB into MASKROM Programming

<!-- source:en p29 unit:152 -->

### 3.3 RTC Circuit

<!-- source:en p29 unit:153 -->

The RTC circuit adopts the HYM8563TS chip, which can be powered by the development board or its own button battery (not included by default, need to purchase a CR1220-3V button battery by user), to ensure that it can continue to provide accurate time even when the board is powered off, and communicate with master through the I2C signal.

<!-- source:en p29 unit:154 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p029-figure-01.png)

<!-- source:en p29 unit:155 -->

Figure 3-5 RTC Circuit

<!-- source:en p29 unit:156 -->

### 3.4 Key Input

<!-- source:en p29 unit:157 -->

The development board uses SARADC_IN1 as the RECOVER detection port, supports 12-bit resolution, and can enter the LOADER programming mode through the V+/REC button. In addition, the board also has a RESET button, which is convenient to reset and restart the machine through hardware; and other commonly used several Buttons: V+, V-, ESC, MENU, PWRON. The key positions are as follows:

<!-- source:en p29 unit:158 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p029-figure-02.png)

<!-- source:en p29 unit:159 -->

Figure 3-6 Key Position

<!-- source:en p30 unit:160 -->

### 3.5 SATA Power Socket

<!-- source:en p30 unit:161 -->

The SATA device power supply ports used by the development board output 12V/5V respectively.

<!-- source:en p30 unit:162 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p030-figure-01.png)

<!-- source:en p30 unit:163 -->

Figure 3-7 SATA Power 12V/5V Output

<!-- source:en p30 unit:164 -->

### 3.6 PCIe Socket

<!-- source:en p30 unit:165 -->

The development board uses a standard PCIe3.0 connector, which can be connected to an external PCIe card for communication.

<!-- source:en p30 unit:166 -->

- Working mode: End Point(EP) &Root Complex(RC).

<!-- source:en p30 unit:167 -->

- The link supports 4 lane data interfaces.

<!-- source:en p30 unit:168 -->

- The 100MHz clock is provided by the external clock chip AU5426.

<!-- source:en p30 unit:169 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p030-figure-02.png)

<!-- source:en p30 unit:170 -->

Figure 3-8 PCIex4 Socket

<!-- source:en p30 unit:171 -->

### 3.7 Ethernet Port

<!-- source:en p30 unit:172 -->

The development board supports two RJ45 ports, which can provide dual Gigabit Ethernet connection function.

<!-- source:en p31 unit:173 -->

The internal integrated Gigabit Ethernet MAC and PCIe2.0 are respectively used to connect with the external PHY chip. The PHY model is RTL8211F-CG/RTL8111HS. The characteristics are as follows:

<!-- source:en p31 unit:174 -->

- Compatible with IEEE802.3 standard, support full-duplex and half-duplex operation, support cross detection and self-adaptation.

<!-- source:en p31 unit:175 -->

- Support 10/100/1000M data rate.

<!-- source:en p31 unit:176 -->

- The interface adopts the combination of RJ45 interface with isolation transformer and indicator light.

<!-- source:en p31 unit:177 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p031-figure-01.png)

<!-- source:en p31 unit:178 -->

Figure 3-9 Gigabit Network Interface

<!-- source:en p31 unit:179 -->

### 3.8 SATA Interface

<!-- source:en p31 unit:180 -->

The development board provides one 7P SATA ports.

<!-- source:en p31 unit:181 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p031-figure-02.png)

<!-- source:en p31 unit:182 -->

Figure 3-10 SATA Interface

<!-- source:en p31 unit:183 -->

### 3.9 DP Output

<!-- source:en p31 unit:184 -->

The development board supports DP interface video output, up to 4K@60 video output.

<!-- source:en p32 unit:185 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p032-figure-01.png)

<!-- source:en p32 unit:186 -->

Figure 3-11 DP Video Output Interface

<!-- source:en p32 unit:187 -->

### 3.10 BT/WIFI Interface

<!-- source:en p32 unit:188 -->

The WIFI+BT module on the board adopts AMPAK AP6398S, and the characteristics are as follows:

<!-- source:en p32 unit:189 -->

- Support 2x2WIFI (2.4G and 5G, 802.11 a/b/g/n/ac), BT5.0 function, and 2 external SMA interface antennas.

<!-- source:en p32 unit:190 -->

- BT data adopts UART communication mode.

<!-- source:en p32 unit:191 -->

- BT voice is connected to the master I2S interface.

<!-- source:en p32 unit:192 -->

- WIFI data adopts SDIO interface. RK3588 EVB7 is equipped with one 2.4GHz/5GHz dual-mode antennas.

<!-- source:en p32 unit:193 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p032-figure-02.png)

<!-- source:en p32 unit:194 -->

Figure 3-12 BT/WIFI Antenna Interface

<!-- source:en p33 unit:195 -->

### 3.11 Debug Interface

<!-- source:en p33 unit:196 -->

The development board has a built-in USB-to-UART chip, which supports a MINI USB debugging interface.

<!-- source:en p33 unit:197 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p033-figure-01.png)

<!-- source:en p33 unit:198 -->

Figure 3-13 Debug Interface

<!-- source:en p33 unit:199 -->

### 3.12 RS485&RS232

<!-- source:en p33 unit:200 -->

The EVB board has reserved one RS485 and one RS232 interface.

<!-- source:en p33 unit:201 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p033-figure-02.png)

<!-- source:en p33 unit:202 -->

Figure 3-14 RS485 socket

<!-- source:en p34 unit:203 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p034-figure-01.png)

<!-- source:en p34 unit:204 -->

Figure 3-15 RS232 socket

<!-- source:en p34 unit:205 -->

### 3.13 MIPI D/CPHY Input Interface

<!-- source:en p34 unit:206 -->

The MIPI D/CPHY input interface adopts a vertical 80pin socket (61082-081402LF, see section 2.4 for specifications) with a pitch of 0.8mm, and supports dual MIPI D/CPHY interface input. It can support two-way 4Lane DPHY module input or two-way 3trio CPHY module input. MIPI DPHY/CPHY supports up to 4.5Gbps/Lane and 5.7Gbps/Trio respectively. The socket model for this 80pin socket is 61083-081402LF. Please refer to Chapter 2.4 for the package size specification. Expansion boards can be made as required.

<!-- source:en p34 unit:208 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p034-figure-02.png)

<!-- source:en p34 unit:209 -->

Figure 3-16 MIPI D/CPHY RX Input Interface

<!-- source:en p35 unit:210 -->

The MIPI D/CPHY_RX interface signal sequence is as follows: Table 3-1 MIPID/CPHY_RX Signal Definition Table

<!-- source:en p35 unit:211 -->

| Pin | DPHY (single) | DPHY (dual) | Pin |
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

<!-- source:en p36 unit:212 -->

### 3.14 MIPI DPHY Input Interface

<!-- source:en p36 unit:213 -->

The MIPI DPHY input interface adopts a vertical 80pin socket with a pitch of 0.8mm (61082-081402LF, see section 2.4 for specifications). It can support two 4Lane MIPI DPHY module inputs or four 2Lane MIPI DPHY signal inputs. MIPI DPHY supports up to 2.5Gbps/Lane respectively. Together with MIPI D/CPHY, it can form a maximum of 6 module inputs. The socket model for this 80pin socket is 61083-081402LF. Please refer to Chapter 2.4 for the package size specification.

<!-- source:en p36 unit:214 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p036-figure-01.png)

<!-- source:en p36 unit:215 -->

Figure 3-17 MIPI DPHY Video Input Interface Table 3-2 MIPI DPHY_RX Signal Definition Table

<!-- source:en p36 unit:216 -->

| Pin | DPHY (single) | DPHY (dual) | Pin |
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

<!-- source:en p37 unit:217 -->

### 3.15 TYPEC Interface

<!-- source:en p37 unit:218 -->

The development board supports a complete TYPEC interface and supports the following functions:

<!-- source:en p37 unit:219 -->

- TYPEC0_USB20_OTG in this interface can be used to download firmware

<!-- source:en p37 unit:220 -->

- Support TYPEC function

<!-- source:en p37 unit:221 -->

- Support DP1.4 output

<!-- source:en p38 unit:222 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p038-figure-01.png)

<!-- source:en p38 unit:223 -->

Figure 3-18 TYPEC Interface

<!-- source:en p38 unit:224 -->

### 3.16 USB3.0 Interface

<!-- source:en p38 unit:225 -->

The development board supports one USB3.0 OTG interface; the interface is a standard A port, which is convenient for developers to access USB3.0 U disk and other USB3.0 devices.

<!-- source:en p38 unit:226 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p038-figure-02.png)

<!-- source:en p38 unit:227 -->

Figure 3-19 USB3.0 OTG Interface

<!-- source:en p38 unit:228 -->

### 3.17 USB2.0 OTG/Host Interface

<!-- source:en p38 unit:229 -->

The development board supports one USB2.0 HOST and one USB2.0 OTG, support the connection of USB devices, such as mouse, U disk, and Bluetooth.

<!-- source:en p39 unit:230 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p039-figure-01.png)

<!-- source:en p39 unit:231 -->

Figure 3-20 USB2.0 Interface

<!-- source:en p39 unit:232 -->

### 3.18 HDMI Output Interface

<!-- source:en p39 unit:233 -->

The development board supports two HDMI standard A output interfaces, up to HDMI2.1, and up to 8K@60fps video output.

<!-- source:en p39 unit:234 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p039-figure-02.png)

<!-- source:en p39 unit:235 -->

Figure 3-21 HDMI TX Interface

<!-- source:en p39 unit:236 -->

### 3.19 HDMI Input Interface

<!-- source:en p39 unit:237 -->

The development board supports one HDMI input interface, supports HDMI2.0 video input, up to 4K60fps video input.

<!-- source:en p40 unit:238 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p040-figure-01.png)

<!-- source:en p40 unit:239 -->

Figure 3-22 HDMI RX Interface

<!-- source:en p40 unit:240 -->

### 3.20 Fan Power Connector

<!-- source:en p40 unit:241 -->

The development board reserves a fan interface, supports 12V/5V fans, and supports adjustable speed. The development board equip with a 12V fan. The interface line sequence from left to right is GND, 12V, SENSOR, CONTROL.

<!-- source:en p40 unit:242 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p040-figure-02.png)

<!-- source:en p40 unit:243 -->

Figure 3-23 Fan Power Interface

<!-- source:en p40 unit:244 -->

### 3.21 Sensor Module Expansion

<!-- source:en p40 unit:245 -->

The development board is equipped with an IMX415 module, which can support up to 800W pixels.

<!-- source:en p40 unit:246 -->

- Support automatic white balance, 3D noise reduction, HDR;

<!-- source:en p40 unit:247 -->

- Support RAW10/RAW12 data output;

<!-- source:en p40 unit:248 -->

- Integrated IRCUT switching circuit, which can control the sensor module day and night mode;

<!-- source:en p40 unit:249 -->

- One set of 24pin MIPI interface is reserved on the module, which can be extended to stereo vision application as needed.

<!-- source:en p41 unit:250 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p041-figure-01.png)

<!-- source:en p41 unit:251 -->

Figure 3-24 IMX415 Module Board The IMX415 module expansion interface signal sequence is as follows: Table 3-3 IMX415 Module Expansion Interface Signal Definition Table

<!-- source:en p41 unit:252 -->

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

<!-- source:en p42 unit:253 -->

### 3.22 Speaker Interface

<!-- source:en p42 unit:254 -->

The development board reserves 2 speaker ports, and two general speakers are pre-installed in the acrylic housing.

<!-- source:en p42 unit:255 -->

![RK3588 EVB7](/docs/rockchip-rk3588-evb7/assets/en-p042-figure-01.png)

<!-- source:en p42 unit:256 -->

Figure 3-25 SPK Socket

<!-- source:en p43 unit:257 -->

## 4 Precautions

<!-- source:en p43 unit:258 -->

RK3588 EVB7 is suitable for laboratory or engineering environment, please read the following precautions before operation:

<!-- source:en p43 unit:259 -->

- Under no circumstances can the screen interface and expansion board be hot-swapped.

<!-- source:en p43 unit:260 -->

- Before unpacking and installing the development board, take necessary anti-static measures to avoid electrostatic discharge (ESD) damage to the development board hardware.

<!-- source:en p43 unit:261 -->

- When holding the development board, please hold the edge of the development board, and do not touch the exposed metal parts of the development board, so as to avoid damage to the components of the development board caused by static electricity.

<!-- source:en p43 unit:262 -->

- Please place the development board on a dry surface to keep them away from heat sources, electromagnetic interference sources and radiation sources, electromagnetic radiation sensitive equipment (such as medical equipment), etc.

{% endraw %}
