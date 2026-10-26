---
title: "Rockchip USB 信号完整性与一致性测试完整指南"
description: "Rockchip USB 信号完整性与一致性测试完整指南 — V2.7.0"
excerpt: "Rockchip USB 信号完整性与一致性测试完整指南"
translation_key: "164-rockchip-usb-sq-test"
slug: "164-rockchip-usb-sq-test"
lang: "zh"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, PHY, Linux]
---

{% raw %}

# Rockchip USB 信号完整性与一致性测试完整指南

平台参考：本文整理中文原稿 V2.7.0（RK-CS-YF-094）。原稿列举29/30/31/32/33/35、PX、RV、Sofia、MCU系列及所有内核版本；这不是所有 ArmSoM 板卡的支持承诺。实际板卡必须核对SoC、控制器、接口、BSP、内核及TRM，尤其Type-C供电/角色。本文为原稿示例，无ArmSoM硬件实测。只有中文PDF，四语均保留中文原图。

注意：io命令直接写寄存器，切换模式/供电有风险，本次未执行任何硬件命令。原稿疑点保留：部分cat sys/...缺首斜线；Host章节误称Device；BER写10e-12；Device channel正文11英寸与截图5英寸不一致；10cm边界未明确。表6在Device章节却使用Host列名。原始地址和常量未猜改。

技术前言：USB2部分覆盖High/Full/Low Speed，重点详细介绍High Speed的Signal Quality和Receiver Sensitivity；USB3部分详细介绍Tx Compliance，Rx仅原理和测试注意事项。Rockchip控制器彼此独立，先查TRM再选择命令。支持Agilent、Tektronix、LeCroy仪器；不同设备操作见厂家手册。文中所有USB测试命令均在USB测试端口进行。

其他USB2项目包含 Packet Parameters、CHIRP Timing、Suspend/Resume/Reset Timing、Test J/K、SE0_NAK。本文命令按控制器型号说明，要求一定软件基础；希望直接按原理图接口名称查命令时使用Rockchip USB SQ Tool。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. USB 2.0 Compliance Test

### 1.1 USB 2.0 一致性测试内容

USB 2.0 Tx Signal Quality 测试内容眼图测试信号速率包尾宽度交叉电压范围(用于低速和全速)JK 抖动、KJ 抖动连续抖动单调性测试(用于高速)上升下降时间USB 2.0 Rx Receiver Sensitivity 测试内容接收灵敏度噪声阈值最小 SYNC Field

### 1.2 USB 2.0 Tx 测试命令和测试工具

USB 2.0 Tx SQ 的测试原理是,设置 USB 控制器的 Test Control 寄存器,使 USB 控制器进入 Test Packet Mode,USB 控制器就会持续产生并发送周期性的 Test Pattern。USB 示波器通过检测 Test Pattern 的波形来分析 USB 的信号完整性。对于 Rockchip 平台的 USB 2.0 Device 和 USB 2.0 Host 接口,设置 USB 控制器进入 Test Packet Mode 的方法有所不同:USB 2.0 Device,可以使用测试命令或者测试工具设置 USB 控制器进入 Test Packet ModeUSB 2.0 Host,只能使用测试命令设置 USB 控制器进入 Test Packet Mode

#### 1.2.1 USB 2.0 Device Tx 测试命令和测试工具

USB 2.0 Device SQ 测试命令测试命令如下表 1 所示,可以通过串口或者 ADB 执行命令。表 1 USB 2.0 Device SQ 测试命令

| 芯片名称 | DWC2_0 OTG 2.0<br>Device | DWC3_0 OTG 2.0 device | DWC3_1 OTG 2.0 device |
| --- | --- | --- | --- |
| RK1808 | N.A | io -4 0xfd00c704 0x8c000a08 | N.A |
| RK1820 | N.A | io -4 0x102500c704 0x8c000a08 | io -4 0x102400c704 0x8c000a08 |
| RK2108 | io -4 0x41300804 0x40 | N.A | N.A |
| RK2116 | io -4 0x40040804 0x40 | N.A | N.A |
| RK2118 | io -4 0x50040804 0x40 | N.A | N.A |
| RK2206 | io -4 0x43040804 0x40 | N.A | N.A |
| RK29XX<br>RK30XX<br>RK31XX | io -4 0x10180804 0x40 | N.A | N.A |
| RK3228<br>RK3229 | io -4 0x30040804 0x40 | N.A | N.A |
| RK3288<br>RK3228H<br>RK3328<br>RK3368 | io -4 0xff580804 0x40 | N.A | N.A |
| RK3308<br>RK3308B-S<br>RK3308H-S | io -4 0xff400804 0x40 | N.A | N.A |
| RK3326<br>RK3326S<br>PX30<br>PX30S | io -4 0xff300804 0x40 | N.A | N.A |
| RV1103<br>RV1106 | N.A | io -4 0xffb0c704 0x8c000a08 | N.A |
| RV1103B | N.A | io -4 0x20b0c704 0x8c000a08 | N.A |
| RV1108 | io -4 0x30180804 0x40 | N.A | N.A |
| RV1126<br>RV1109 | N.A | io -4 0xffd0c704 0x8c000a08 | N.A |
| RV1126B | N.A | io -4 0x2150c704 0x8c000a08 | N.A |
| SOFIA-3GR | io -4 0xe2100804 0x40 | N.A | N.A |
| RK3366 | io -4 0xff4c0804 0x40 | io -4 0xff50c704 0x8c000a08 | N.A |
| RK3399 | N.A | io -4 0xfe80c704 0x8c000a08 | io -4 0xfe90c704 0x8c000a08 |
| RK3506 | io -4 0xff740804 0x40 | N.A | N.A |
| RK3528 | N.A | io -4 0xfe50c704 0x8c000a08 | N.A |
| RK3538 | N.A | io -4 0xfc00c704 0x8c000a08 | N.A |
| RK3562 | N.A | io -4 0xfe50c704 0x8c000a08 | N.A |
| RK3576 | N.A | io -4 0x2300c704 0x8c000a08 | io -4 0x2340c704 0x8c000a08 |
| RK3566<br>RK3568 | N.A | io -4 0xfcc0c704 0x8c000a08 | N.A |
| RK625 | io -4 0x40180804 0x40 | N.A | N.A |
| RK3588<br>RK3588S | N.A | io -4 0xfc00c704 0x8c000a08 | io -4 0xfc40c704 0x8c000a08 |

Note:RK3506 OTG1 Device 测试命令:io -4 0xff780804 0x40USB 2.0 Device 测试工具Rockchip 平台的 USB 2.0 Device SQ 测试,除了可以使用上述的测试命令外,还可以使用 USB-IF 官方组织提供的USB HSET 测试工具,下载工具 "USBHSET for EHCI" 或者 "USBHSET for XHCI"。下载地址如下:USB 2.0 HOST (EHCI):32 bit: https://www.usb.org/document-library/usbhset-ehci-32-bit64 bit: https://www.usb.org/document-library/usbhset-ehci-64-bitUSB 3.0 HOST (xHCI):32 bit: https://www.usb.org/document-library/xhsett-x3264 bit: https://www.usb.org/document-library/xhsett-x64e测试工具的简单使用步骤如下:

1. 将待测试的 USB device 口通过 USB 线连接到 PC

2. 打开测试工具,选择“Device”,然后点击“TEST”按钮,如下图 1 所示

![原稿配图 — PDF p9](/docs/rockchip-usb-sq-test/assets/cn-p009-figure-01.png)

图 1 选择测试类型

3. 如图 2 所示,选择要测试的设备和测试命令”TEST PACKET”,然后点击“EXECUTE”按钮所示,执行完上述操作后,USB 控制器就会自动进入 Test Packet Mode,并连续发送周期性的测试包,测试波形如图 3 所示:

![原稿配图 — PDF p9](/docs/rockchip-usb-sq-test/assets/cn-p009-figure-02.png)

图 2 选择测试设备和测试命令

![原稿配图 — PDF p10](/docs/rockchip-usb-sq-test/assets/cn-p010-figure-01.png)

图 3 测试波形

#### 1.2.2 USB 2.0 Host Tx 测试命令

USB 2.0 Host SQ 测试,只能使用测试命令,没有专⻔的测试工具。测试命令如表 2,表 3,表 4 所示,测试命令可以通过 ADB 或者串口执行。表 2 USB 2.0 Host SQ 测试命令(a)

| 芯片名称 | DWC2_0 OTG Host 2.0 | DWC2_1 Host 2.0 | EHCI_0 Host 2.0 |
| --- | --- | --- | --- |
| RK1808 | N.A | N.A | io -4 0xffd80054 0x40000 |
| RK2116 | io -4 0x40040440 0x8000 | N.A | N.A |
| RK2118 | io -4 0x50040440 0x8000 | N.A | N.A |
| RK2206 | io -4 0x43040440 0x8000 | N.A | N.A |
| RK29XX<br>RK30XX<br>RK3188 | io -4 0x10180440 0x8000 | io -4 0x101c0440 0x8000 | N.A |
| RK312X | io -4 0x10180440 0x8000 | io -4 0x101c0440 0x8000 | io -4 0x101c0054 0x40000 |
| RK3228<br>RK3229 | io -4 0x30040440 0x8000 | N.A | io -4 0x30080054 0x40000 |
| RK3288 | io -4 0xff580440 0x8000 | io -4 0xff540440 0x8000 | io -4 0xff500054 0x40000 |
| RK3308<br>RK3308B-S<br>RK3308H-S | io -4 0xff400440 0x8000 | N.A | io -4 0xff440054 0x40000 |
| RK3326<br>RK3326S | io -4 0xff300440 0x8000 | N.A | N.A |
| PX30<br>PX30S | io -4 0xff300440 0x8000 | N.A | io -4 0xff340054 0x40000 |
| RK3228H<br>RK3328 | io -4 0xff580440 0x8000 | N.A | io -4 0xff5c0054 0x40000 |
| RK3366 | io -4 0xff4c0440 0x8000 | N.A | io -4 0xff480054 0x40000 |
| RK3368 | io -4 0xff580440 0x8000 | N.A | io -4 0xff500054 0x40000 |
| RV1108 | io -4 0x30180440 0x8000 | N.A | io -4 0x30140054 0x40000 |
| RV1126<br>RV1109 | N.A | N.A | io -4 0xffe00054 0x40000 |
| RV1126B | N.A | N.A | io -4 0x21480054 0x40000 |
| SOFIA-3GR | io -4 0xe2100440 0x8000 | N.A | N.A |
| RK3399 | N.A | N.A | io -4 0xfe380054 0x40000 |
| RK3506 | io -4 0xff740440 0x8000 | io -4 0xff780440 0x8000 | N.A |
| RK3528 | N.A | N.A | io -4 0xff100054 0x40000 |
| RK3538 | N.A | N.A | io -4 0xfc100054 0x40000 |
| RK3562 | N.A | N.A | io -4 0xfed00054 0x40000 |
| RK3566<br>RK3568 | N.A | N.A | io -4 0xfd800054 0x40000 |
| RK3588<br>RK3588S | N.A | N.A | io -4 0xfc800054 0x40000 |

表 3 USB 2.0 Host SQ 测试命令(b)

| 芯片名称 | EHCI_1 Host 2.0 | EHCI_2 Host 2.0 | EHCI_HSIC Host 2.0 |
| --- | --- | --- | --- |
| RK3168<br>RK3188 | N.A | N.A | io -4 0x10240054 0x40000 |
| RK3288 | N.A | N.A | io -4 0xff5c0054 0x40000 |
| RK3228<br>RK3229 | io -4 0x300c0054 0x40000 | io -4 0x30100054 0x40000 | N.A |
| RK3368 | N.A | N.A | io -4 0xff5c0054 0x40000 |
| RK3399 | io -4 0xfe3c0054 0x40000 | N.A | io -4 0xfe340054 0x40000 |
| RK3566<br>RK3568 | io -4 0xfd880054 0x40000 | N.A | N.A |
| RK3588<br>RK3588S | io -4 0xfc880054 0x40000 | N.A | N.A |

表 4 USB 2.0 Host SQ 测试命令(c)

| 芯片名称 | DWC3_0 OTG Host 2.0 | DWC3_1 OTG Host 2.0 |
| --- | --- | --- |
| RK1808 | io -4 0xfd000424 0x40000000 | N.A |
| RK1820 | io -4 0x1025000424 0x40000000 | io -4 0x1024000424 0x40000000 |
| RK3228H | io -4 0xff600424 0x40000000 | N.A |
| RK3366 | io -4 0xff500424 0x40000000 | N.A |
| RK3399 | io -4 0xfe800424 0x40000000 | io -4 0xfe900424 0x40000000 |
| RV1103<br>RV1106 | io -4 0xffb00424 0x40000000 | N.A |
| RV1103B | io -4 0x20b00424 0x40000000 | N.A |
| RV1126<br>RV1109 | io -4 0xffd00424 0x40000000 | N.A |
| RV1126B | io -4 0x21500424 0x40000000 | N.A |
| RK3528 | io -4 0xfe500424 0x40000000 | N.A |
| RK3538 | io -4 0xfc000424 0x40000000 | N.A |
| RK3562 | io -4 0xfe500424 0x40000000 | N.A |
| RK3566<br>RK3568 | io -4 0xfcc00424 0x40000000 | io -4 0xfd000424 0x40000000 |
| RK3576 | io -4 0x23000424 0x40000000 | io -4 0x23400424 0x40000000 |
| RK3588<br>RK3588S | io -4 0xfc000424 0x40000000 | io -4 0xfc400424 0x40000000 |

### 1.3 USB 2.0 Tx 测试环境

测试 USB 2.0 SQ,需要使用已安装 USB 专业测试软件的示波器,比如 Agilent 9000 系列示波器(或 90000 系列)、Tektronix、LeCroy 系列的示波器。本文档主要介绍 Agilent 9000 系列示波器的 USB 2.0 测试环境,需要的工具如下:MSO9254A 示波器,安装 USB 2.0 测试软件 N5416A113xA 差分有源探头E2678A 差分探头前端E2649-66401 device 夹具和 E2649-66402 host 夹具USB 2.0 cableUSB 2.0 cable 的线材需要严格符合 USB 2.0 Spec 的规定,如果 USB cable 的线⻓小于 10cm,则眼图测试时,应采用 Near End 模板,如果线⻓大于 10cm,则眼图测试应采用 Far End 模板。近端(Near End)测试时,如果使用太⻓的 USB 线缆或者 USB 线缆的阻抗匹配不好,可能导致眼图测试指标不通过。

### 1.4 USB 2.0 Tx 测试步骤

1. 搭建测试环境如果使用的是 Agilent 的测试套件,测试环境的搭建和示波器的设置方法,请参考如下的文档:《Agilent N5416A USB 2.0 Compliance Test Option》《Agilent USB2.0 High Speed Device SQ Test》如果使用的是 Tektronix 或 LeCroy 的测试套件,请到 Tektronix 和 LeCroy 的官网上搜索测试说明文档。以 Agilent 示波器测试 USB2.0 Device SQ 为例,搭建好的测试环境如图 4 所示:

![原稿配图 — PDF p14](/docs/rockchip-usb-sq-test/assets/cn-p014-figure-01.png)

图 4 Agilent USB 2.0 SQ 测试环境

2. 设置 USB 进入测试模式[Test Packet Mode]设置 USB 控制器进入 Test Mode 前,需要先确认 USB 已经可以正常通信。如果是测试 USB 2.0 OTG Device 接口,要保证待测试的 USB 口已经通过测试夹具和线缆连接到 PC,并且 PC 可以正常识别到 USB 设备。然后,再参考章节 “USB 2.0 Device 测试命令和测试工具” 提到的 PC 端测试工具或者测试命令,设置 USB 控制器进入测试模式。如果测试 USB 2.0 Host 接口,不同的示波器和测试夹具,设置 USB 控制器进入测试模式的方法有所不同,下面分别对使用 Agilent 测试套件和使用 Tektronix 测试套件的设置方法做简要说明:

2.1 Agilent 测试套件

先将待测的 Host 口连接到测试夹具的测试接口一端,然后将高速设备(如 U 盘)连接到夹具的另一端接口,如下图5,再执行测试命令,设置 USB 进测试模式。

![原稿配图 — PDF p15](/docs/rockchip-usb-sq-test/assets/cn-p015-figure-01.png)

图 5 Agilent USB 2.0 SQ 测试夹具连接方法

2.2 Tektronix 测试套件如果使用 Tektronix 的测试夹具,由于测试夹具上只有一个接口用于连接待测的 HOST 口,无法再连接其他高速设备,所以,先断开待测的 Host 接口与测试夹具连接,然后将高速 USB 设备(如 U 盘)插到待测试的 HOST 口,再执行测试命令,等测试命令发送完成后,USB 控制器就会自动进入测试模式,然后再拔出高速 USB 设备,将测试夹具连接到待测试的 Host 接口,开始测试。Note:测试USB 2.0 Host 接口,必须在Host 口上接一个高速USB 设备(如U 盘),不能接鼠标、键盘等全速或者低速的USB 设备。

3. USB 自动化测试软件分析波形在 USB 控制器成功进入测试模式后,会产生并发送持续的 Test Packet Pattern,可以从示波器观察到周期性的测试波形,如图 6 所示。示波器的 USB 自动化测试软件,会自动对测试波形进行分析,并生成完成的测试报告。

![原稿配图 — PDF p16](/docs/rockchip-usb-sq-test/assets/cn-p016-figure-01.png)

图 6 USB 2.0 信号质量分析界面

### 1.5 USB 2.0 眼图分析

#### 1.5.1 USB 2.0 标准眼图分析

USB 2.0 眼图模板有两种不同的标准:近端(Near End)和远端(Far End)。在 High Speed Signal Quality 测试中,若待测 USB 的端口直接通过小于 10cm 的线缆与测试夹具相连,则采用 Near End 眼图模板。若待测的 USB 端口通过大于 10cm 的线缆与测试夹具相连,则采用 Far End 眼图模板。在 Rockchip 平台的 USB 2.0 眼图测试中,为保证 USB 2.0 信号质量的可靠性,建议统一采用更为严格的 Near End 眼图模块作为参考标准。图 7 和图 8 分别是使用 Near End 和 Far End 眼图模板的标准 USB 眼图。

![原稿配图 — PDF p16](/docs/rockchip-usb-sq-test/assets/cn-p016-figure-02.png)

图 7 USB 2.0 High-speed Near End SQ Eye Diagram

![原稿配图 — PDF p17](/docs/rockchip-usb-sq-test/assets/cn-p017-figure-01.png)

图 8 USB 2.0 High-speed Far End SQ Eye Diagram从图 1-7 和图 1-8 中,可以看出,标准的 USB 2.0 眼图呈现为一个迹线又细又清晰的“眼睛”,“眼”张开得很大。当有码间串扰时,波形失真,码元不完全重合,眼图的迹线就会不清晰,引起“眼”部分闭合。若再加上噪声的影响,则使眼图的线条变得模糊,“眼”开启得小了,因此,“眼”张开的大小表示了失真的程度,反映了码间串扰的强弱。

#### 1.5.2 USB 2.0 眼图测试问题分析

1. 示波器无法检测到眼图测试的触发信号首先,检查测试夹具是否连接正确,以及示波器的 USB 测试软件是否设置正确。从示波器上观察是否有检测到如图 1-3 的周期性测试波形,如果没有图 1-3 的周期性测试波形,可能是测试命令没有执行成功或者测试命令有误

2. 测试的眼图严重失真测试的眼图严重失真,比如幅度失真、信号塌陷,一般是因为测试的操作方法有误。如图 9 所示,USB 眼图的信号幅度比标准的大一倍,如果使用的是 Agilent 测试套件,一般是因为测试夹具的D+和 D-没有挂上 50 欧的终端 SMA 电阻。如图 10 所示,USB 眼图的信号中间有明显的塌陷,如果使用的是 Agilent 测试套件,一般是因为没有将测试夹具的开关切到 ON 档。

![原稿配图 — PDF p18](/docs/rockchip-usb-sq-test/assets/cn-p018-figure-01.png)

图 9 USB 眼图幅度失真

![原稿配图 — PDF p18](/docs/rockchip-usb-sq-test/assets/cn-p018-figure-02.png)

图 10 USB 眼图信号塌陷失真

3. USB 眼图没有张开如图 11 所示,USB 眼图没有张开,会压到 USB 眼图的测试模板。检查 USB 的 DP 和 DM 线上是否连接了内部电容较大的 ESD 或者电子开关,如果有,可以去掉这些器件再测试通过软件调整 USB PHY 的驱动强度和上升沿、下降沿,请联系负责 USB 驱动的工程师协助调试。

![原稿配图 — PDF p18](/docs/rockchip-usb-sq-test/assets/cn-p018-figure-03.png)

图 11 USB 眼图没有张开

4. USB 眼图模糊甚至布满血丝如图 12 所示,USB 眼图的轮廓线条模糊,说明 USB 的串扰十分严重,还可能存在阻抗不匹配、噪声干扰的问题。首先,检查 USB 的 DP 和 DM 线上是否连接了内部电容较大的 ESD 或者电子开关,如果有,可以去掉这些器件再测试。然后,检查测试使用的 USB 线缆是否存在阻抗不匹配的问题,或者换条 USB 线缆重新测试。最后,检查 USB 的 PCB 走线、USB 的 24MHz 时钟源、USB PHY 的供电电源纹波。

![原稿配图 — PDF p19](/docs/rockchip-usb-sq-test/assets/cn-p019-figure-01.png)

图 12 USB 眼图模糊

### 1.6 USB 2.0 Rx Compliance Test

#### 1.6.1 USB 2.0 Receiver Sensitivity 测试原理

根据测试规范《USB 2.0 Electrical Compliance Test Specification Version 1.07》,USB 2.0 Rx 的测试项目包括如下三项:EL_16 Receiver Sensitivity Test @ SquelchEL_17 Receiver Sensitivity TestEL_18 Receiver Sensitivity Test - Minimum SYNC Field测试原理:设置待测设备(DUT)进入 SE0_NAK 测试模式, 信号发生器模拟 USB HOST 发送 IN packet 请求给 DUT,如果DUT Rx 能正常接收到 IN packet,则 DUT 会反馈 NAK packet。通过改变信号发生器输出的 IN packet 波形的幅值,并检测 DUT 是否有 NAK 反馈,即可测出 DUT 的接收灵敏度。EL_16 从高幅值往低幅值扫,如果信号发生器低于 100mv,DUT还有反馈说明接收太灵敏,fail。EL_17 从低幅值往高幅值扫,如果信号发生器高于 200mv,DUT还未有稳定的反馈说明接收太迟钝,fail。Note:EL_17 的指标,USB Spec 最早规定是150mv,后面ECN 更改为200mv根据测试规范,信号发生器模拟USB HOST 的行为,所以DUT 只能是Device 或者HUB Upstream port,HOST不支持接收灵敏度测试NAK packet的码型是固定的:32bit sync 包头(31bit “0” + 1bit“1”)+ 8bit (10100101)NAK PID 编码

#### 1.6.2 USB 2.0 Rx 测试命令

表 5 USB 2.0 Test SE0_NAK 命令

| 芯片名称 | USB 2.0 Test SE0_NAK 命令 |
| --- | --- |
| RK1808 | io -4 0xfd00c704 0x8c000a06 |
| RK1820 | io -4 0x102500c704 0x8c000a06 |
| RK2108 | io -4 0x41300804 0x30 |
| RK2116 | io -4 0x40040804 0x30 |
| RK2206 | io -4 0x43040804 0x30 |
| RK29XX<br>RK30XX<br>RK31XX | io -4 0x10180804 0x30 |
| RK3228<br>RK3229 | io -4 0x30040804 0x30 |
| RK3288<br>RK3228H<br>RK3328<br>RK3368 | io -4 0xff580804 0x30 |
| RK3308<br>RK3308B-S<br>RK3308H-S | io -4 0xff400804 0x30 |
| RK3326<br>RK3326S<br>PX30<br>PX30S | io -4 0xff300804 0x30 |
| RV1103<br>RV1106 | io -4 0xffb0c704 0x8c000a06 |
| RV1108 | io -4 0x30180804 0x30 |
| RV1126<br>RV1109 | io -4 0xffd0c704 0x8c000a06 |
| RV1126B | io -4 0x2150c704 0x8c000a06 |
| RK3399 | io -4 0xfe80c704 0x8c000a06 |
| RK3566<br>RK3568 | io -4 0xfcc0c704 0x8c000a06 |
| RK625 | io -4 0x40180804 0x30 |
| RK3588<br>RK3588S | io -4 0xfc00c704 0x8c000a06 |

#### 1.6.3 USB 2.0 Rx 测试方法

USB 2.0 Rx 标准测试方法,请参考测试规范《USB 2.0 Electrical Compliance Test Specification Version 1.07》中Section 4.2.1 Upstream Port Receiver Sensitivity 的描述。本文档以 Tektronix 测试环境,进行说明。

##### 1.6.3.1 USB 2.0 Rx 测试注意事项

测试时,需要先将 DUT 通过测试夹具连接到 PC Host,避免 USB Device PHY 进入 suspend mode 而影响测试,再输入测试命令;测试时,需要通过串口输入 Test SE0_NAK 命令,让 DUT USB 控制器进入Test_SE0_NAK mode;测试 EL_18 Receiver Sensitivity Test - Minimum SYNC Field 过程中,当 Tektronix 的信号发生器在切换32bit SYNC 为 12 bit SYNC 时,需要对调信号发生器的通道极性。

##### 1.6.3.2 USB 2.0 Rx 测试步骤

1. 按照下图 13 所示,将 DUT 通过 Device Sensitivity 夹具与 Tektronix 的信号发生器、示波器连接起来。

![原稿配图 — PDF p22](/docs/rockchip-usb-sq-test/assets/cn-p022-figure-01.png)

图 13 Tektronix USB 2.0 Rx 测试连接

![原稿配图 — PDF p23](/docs/rockchip-usb-sq-test/assets/cn-p023-figure-01.png)

图 14 Tektronix 信号发生器

![原稿配图 — PDF p23](/docs/rockchip-usb-sq-test/assets/cn-p023-figure-02.png)

图 15 USB2.0 Rx Device Sensitivity 夹具

2. 将 USB 2.0 Rx Device Sensitivity 夹具的拨码开关切换到 ON,然后连接测试夹具与 PC Host 接口

3. 查表 5 USB 2.0 Test SE0_NAK 命令,并通过串口输入命令,使 DUT 进入 SE0_NAK mode

4. 将 USB 2.0 Rx Device Sensitivity 夹具的拨码开关切换到 OFF

5. 设置 Tektronix 信号发生器输出测试码型,按照测试流程依次完成 EL_16/EL_17/EL_18 测试项

##### 1.6.3.3 USB 2.0 Rx 测试结果分析

如下图 16 所示,Tektronix 示波器实时采样并测试信号发生器发出的 IN packet 波形以及 DUT 反馈的 NAK packet波形,最后生成图所示的测试报告。

![原稿配图 — PDF p24](/docs/rockchip-usb-sq-test/assets/cn-p024-figure-01.png)

图 16 USB 2.0 Rx 测试信号

![原稿配图 — PDF p24](/docs/rockchip-usb-sq-test/assets/cn-p024-figure-02.png)

图 17 USB 2.0 Rx 测试报告当发现测试结果 EL_16/EL_17 fail 时,可以尝试通过调整 USB 2.0 PHY 的 Squelch 参数来解决。具体方法请参考章节Rockchip USB SQ Tool。

## 2. USB 2.0 HUB SQ Test

USB 2.0 HUB 的 SQ test 包括了 upstream ports 和 downstream ports,但实际应用中,我们一般只需测试提供给用戶使用的 downstream ports。因此,本文档只提供了测试 USB2.0 HUB downstream ports 的 SQ 测试方法。常⻅的 USB 2.0 HUB 芯片型号主要有:FE1.1、FE1.1S、GL850、GL852、USX2064、HX2VL 等。常⻅的 HSIC HUB型号主要有:USB4604、GL850H。对于 USB 2.0 HUB,Rockchip 平台有两种测试方法,详⻅下面的方法 1-命令测试和方法 2-脚本测试,对于HSIC HUB,只能使用方法 2-脚本测试。方法 1-命令测试该测试方法使用的测试命令与 “USB 2.0 Host 测试命令” 一样,测试步骤如下:确定 HUB 连接的 USB HOST 控制器,然后查表 2,表 3,表 4,找到 HOST 控制器对应的测试命令参考 “USB 2.0 测试步骤”,完成 HUB 的所有 downstream ports 的 SQ 测试Note:不同的HUB downstream ports,测试命令和测试方法都是一样的。方法 2-脚本测试相比方法 1-命令测试,方法 2-脚本测试比较复杂,需要编译和运行脚本,但更具有通用性,可以测试所有类型的HUB,包括 USB 2.0 HUB 和 HSIC HUB。

1. 下载并编译测试脚本脚本源码下载地址:https://redmine.rockchip.com.cn/documents/113文件:USB_HUB_Compliance_Test_Script

2. 执行测试脚本将编译生成的可执行文件 linux-eye 拷⻉到系统的 data 目录下,并 执行命令chmod 777 linux-eye执行测试脚本 linux-eye,然后,根据脚本的提示,输入测试命令,参考如下:

```text
[root@hari LinuxEye]# ./linuxEye
LinuxEye - select one of the following hub for testing.
[ 0] 4-port Full-Speed hub at tier 2 of Bus 3
(VID: 0451, PID: 1446, Address: 3)
[ 1] 4-port High-Speed hub at tier 2 of Bus 1
(VID: 1A40, PID: 0101, Address: 15)
[ 2] 4-port High-Speed hub at tier 2 of Bus 1
(VID: 1A40, PID: 0101, Address: 10)
[ 3] 7-port High-Speed hub at tier 3 of Bus 1
(VID: 1A40, PID: 0201, Address: 50)
Please enter [0 ~ 3] to select a hub or 'q' to quit: 2 （表⽰共有4个HUB， 测试HUB[2]）
[ 1] is connected to Low-Speed device
[ 2] is open
[ 3] is connected to High-Speed device
[ 4] is connected to Low-Speed device
Please enter [1 ~ 4] to select a port or 'q' to quit: 2 （表⽰测试HUB的第2个port）
LinuxEye - Start testing port 2 of device 10 on bus 1
Type 'q' to stop the test: q (退出测试脚本)
[root@hari LinuxEye]#
```

## 3. USB 3.0 Compliance Test

USB 3.0 是双总线架构,在 USB 2.0 的基础上增加了超高速(Super Speed)总线部分。超高速总线的信号速率达到5Gbps, 采用 ANSI 8b/10b 编码,全双工方式工作,最大支持的电缆⻓度达 3 米。如下图 18 是典型的 USB3.0 的总线架构。

![原稿配图 — PDF p26](/docs/rockchip-usb-sq-test/assets/cn-p026-figure-01.png)

图 18 USB 3.0 总线架构

### 3.1 USB 3.0 新增测试规范

一致性校准和测试在一致性通道末端进行一致性通道用来表征测试 TX 和 RX 时最差的互连通道情况Host:3 米电缆+5 英寸的走线Device:3 米电缆+11 英寸走线TX 测试允许使用通道嵌入,选择⻩金 S 参数做嵌入测试需要计算基于 10e-12 误码率的 DJ,RJ 和 TJ增加了 10MHz,20MHz 和 33MHz 一致性 Pj 测试频点后处理需要使用 CTLE 均衡器,在均衡器后观察和分析眼图及其参数。由于 5Gbps 的信号经过⻓电缆和 PCB传输以后有可能眼图就张不开了,所以 USB 3.0 的芯片接收端内部会提供 CTLE(连续时间线性均衡)功能以补偿高频损耗。所以测试时示波器的测试软件也要能支持 CTLE 才能得到真实的结果。Device 接收端眼图幅度校准标准为 145mVp-pHost 接收端眼图幅度标准为 180mVpp

USB 3.0 的电气性能测试分为发送信号测试(Tx)、接收容限测试(Rx Tolerance Compliance Test)以及电缆/连接器的测试。

### 3.2 USB 3.0 Tx Compliance Test

#### 3.2.1 USB 3.0 Tx 测试要求

在进行发送端测试时,要求测试对象发出特定的测试码型,实时示波器对该码型进行眼图分析,测量信号的幅度、抖动、平均数据率及上升∕下降时间。USB3.0 针对超高速部分的信号测试与以前 USB2.0 的测试方法有较大的不同。首先,由于 USB3.0 SuperSpeed 的信号速率达到 5Gbps,同时信号的幅度更小,因此测试中需要12GHz 以上带宽的示波器,同时要示波器的底噪声更低才能保证准确的测量。其次, USB 3.0 发送端测试,不是用夹具直接连接 DUT,其定义的被测点是“一致性通道 ( Compliance Channel)” 的末端。一致性通道模拟 PCB 走线和电缆对信号的影响。对于 HOST 的测试,它模拟的是 3m ⻓电缆+5 英寸 PCB 走线的影响;对于 Device 的测试,它模拟的是 3m ⻓电缆+11 英寸 PCB 走线的影响。USB3.0 的测试规范里会以 S 参数文件的形式提供一致性通道的模型。在真正测试时是用测试夹具直接连接 DUT,然后用示波器的 S 参数嵌入的方式加入通道影响。如图 19 Tx 测试模型,TP1 为示波器的测试点。

![原稿配图 — PDF p27](/docs/rockchip-usb-sq-test/assets/cn-p027-figure-01.png)

图 19 USB 3.0 Tx 测试模型

![原稿配图 — PDF p27](/docs/rockchip-usb-sq-test/assets/cn-p027-figure-02.png)

图 20 USB 3.0 Tx 测试眼图要求

原图表格可编辑转录（原图未提供注释编号的正文）：

| 信号特性 | 最小 | 标称 | 最大 | 单位 | 注释编号 |
| --- | --- | --- | --- | --- | --- |
| 眼高 | 100 |  | 1200 | mV | 2, 4 |
| Dj |  |  | 0.43 | UI | 1, 2, 3 |
| Rj |  |  | 0.23 | UI | 1, 2, 3, 5 |
| Tj |  |  | 0.66 | UI | 1, 2, 3 |

![原稿配图 — PDF p28](/docs/rockchip-usb-sq-test/assets/cn-p028-figure-01.png)

图 21 USB 3.0 Tx 测试电气参数要求

原图表格可编辑转录（原图未提供注释编号的正文）：

| 符号 | 参数 | 5.0 GT/s | 单位 | 说明 |
| --- | --- | --- | --- | --- |
| UI | 单位间隔 | 199.94 (min); 200.06 (max) | ps | 每设备容差±300 ppm；周期不包含SSC引起的变化。 |
| V_TX-DIFF-PP | 差分峰峰值Tx电压摆幅 | 0.8 (min); 1.2 (max) | V | 标称1 V p-p。 |
| V_TX-DIFF-PP-LOW | 低功耗差分峰峰值Tx电压摆幅 | 0.4 (min); 1.2 (max) | V | 参见6.7.2。本模式无去加重要求；是否去加重由实现决定。 |
| V_TX-DE-RATIO | Tx去加重 | 3.0 (min); 4.0 (max) | dB | 标称3.5 dB。 |

#### 3.2.2 USB 3.0 Tx 测试项目

LFPS(近端)SSC(近端)Tx(近端/远端):眼图;Tj, Rj, Dj;幅度;

![原稿配图 — PDF p28](/docs/rockchip-usb-sq-test/assets/cn-p028-figure-02.png)

图 22 Agilent USB 3.0 Tx 测试选项

#### 3.2.3 USB 3.0 Tx 测试模式

根据 USB 3.0 spec 规定,USB 3.0 控制器要先进入测试模式(Compliance Mode),才能开始 USB 3.0 Tx 的信号完整性测试。如图 23 所示,在 Polling 阶段的第一个 LFPS timeout后,控制器就会从 Polling.LFPS 退出到 ComplianceMode。

![原稿配图 — PDF p29](/docs/rockchip-usb-sq-test/assets/cn-p029-figure-01.png)

图 23 USB 3.0 进入 Compliance Mode 的流程

#### 3.2.4 USB 3.0 Tx 测试环境

Agilent USB 3.0 Tx 测试套件对于 USB 3.0 Tx 信号的测试,Agilent 推荐使用 90000 系列示波器(提供高达 13GHz 的带宽), 配上自动的一致性测试软件 U7243A 和测试夹具 U7242A 来完成 USB 3.0 规范要求的发送端测试和验证。

![原稿配图 — PDF p29](/docs/rockchip-usb-sq-test/assets/cn-p029-figure-02.png)

图 24 Agilent USB 3.0 Tx 测试环境

![原稿配图 — PDF p29](/docs/rockchip-usb-sq-test/assets/cn-p029-figure-03.png)

图 25 Agilent USB 3.0 Tx 测试夹具 U7242

此外,Agilent 还提供了 USB 3.1 Gen1 Type-C 测试夹具 N7015A,如下图 26,用于测试 USB 3.0/3.1 Type-C 接口的信号完整性,测试软件与 U7242A 夹具一样。Type-C 测试夹具的具体使用方法,请参考文档《Keysight N7015A-16A Type-C Test Kit》。

![原稿配图 — PDF p30](/docs/rockchip-usb-sq-test/assets/cn-p030-figure-01.png)

图 26 Agilent USB 3.0 Type-C 测试夹具 N7015ATektronix USB 3.0 Tx 测试套件Tektronix 的 Tx 测试连接示意图如图 27 所示,Tektronix USB 3.0 发射机测量(选项 USB-Tx)适用于DPO/MSO70000 系列示波器,提供了自动 USB 3.0 发射机解决方案。具体测试方案请参考:https://www.tek.com.cn/datasheet/usb3-transmitter-and-receiver-solutions-datasheet

![原稿配图 — PDF p31](/docs/rockchip-usb-sq-test/assets/cn-p031-figure-01.png)

图 27 Tektronix USB 3.0 Tx 测试示意图

#### 3.2.5 USB 3.0 Device Tx 测试命令

如下芯片在测试 USB 3.0 Device Tx 时,需要输入测试命令,作用是为了触发 CP1 test pattern。并且,要严格按照测试步骤的要求,在示波器弹出测试 CP1 test pattern 时,再输入 Device 测试命令。否则,可能会导致 CP0 testpattern 或 CP1 test pattern 测试异常。表 6 USB 3.0 Device Tx 测试命令

| 芯片名称 | DWC3_0 OTG Host 3.0 | DWC3_1 OTG Host 3.0 |
| --- | --- | --- |
| RK1808 | io -4 0xff384008 0xc | N.A |
| RK3228H<br>RK3328 | io -4 0xff478408 0xc | N.A |

Note:正常情况下,USB 3.0 Device 不需要输入测试命令,就可以自动进入Tx 测试模式。表6 所列出的RK1808/RK3228H/RK3328 测试命令,目的是为了手动触发CP1 test pattern。其他芯片,如RK3399/RK3568/RK3588,不需要执行Device Tx 测试命令。

#### 3.2.6 USB 3.0 Device Tx 测试方法

本文档主要说明使用 Agilent 90000 系列示波器(型号:DSO91204A 和测试夹具 U7242A)的 USB 3.0 Device Tx 测试方法。如果使用的是 Tektronix 或者 LeCroy 的示波器,请自行搜索 Tektronix 和 LeCroy 官方发布的测试指南。

 3.2.6.1 USB 3.0 Device Tx 测试注意事项

测试 USB 3.0 Device Tx 时,请先查表 6,确认是否需要输入测试命令。如果不用输入测试命令,则只要按照示波器测试软件提示的测试步骤操作,将待测试的 Device USB 口连接到测试夹具,USB 3.0 控制器就会自动进入 Compliance mode。如果需要输入测试命令,则先按照示波器测试软件提示的测试步骤操作,将待测试的 Device USB 口连接到测试夹具,USB 3.0 控制器就会自动进入 Compliance mode。然后,在示波器弹出测试 CP1 test pattern 时,再输入 Device 测试命令。测试 USB 3.0 Device Tx 时,VBus 5V 不能自供电,否则会导致 USB 3.0 控制器无法进入 Compliancemode。VBus 的供电需要由测试夹具 U7242A 提供,可以通过 USB 线将测试夹具的 USB 供电口与示波器或者 PC 的USB 口连接,实现 VBus 5V 的供电。

 3.2.6.2 USB 3.0 Device Tx 测试步骤

1. 自动化测试软件设置

![原稿配图 — PDF p32](/docs/rockchip-usb-sq-test/assets/cn-p032-figure-01.png)

图 28 USB 3.0 Device Tx 测试软件设置界面Note:使用的测试软件版本为V2.01,如果使用更新的测试版本(如V3.00.0001),软件设置方法会有所不同Channel Setting 的设置方法如下图所示:

![原稿配图 — PDF p33](/docs/rockchip-usb-sq-test/assets/cn-p033-figure-01.png)

图 29 USB 3.0 Device Tx 测试软件中 Channel 的设置方法Channel Settings 默认选择 Normal Channel,即嵌入 S 参数,来模拟 3m ⻓ usb cable + 5’’PCB 走线的影响。因此,要求测试时,用测试夹具直接连接待测试设备(DUT)。如果测试使用的 usb cable 太⻓(大于 10 cm),可能导致 Far End 测试项 fail,建议 Channel Settings 选择 None,或者使用小于 10cm 的短线测试。

2. 选择测试项目勾选 All USB3 Tests,可选择全部 USB 3.0 Tx 一致性测试项目。

![原稿配图 — PDF p33](/docs/rockchip-usb-sq-test/assets/cn-p033-figure-02.png)

图 30 USB 3.0 Device Tx 测试项的设置

3. 配置测试条件将 Automate Test Pattern Change 设置为 Auto,其余使用默认配置即可。

![原稿配图 — PDF p34](/docs/rockchip-usb-sq-test/assets/cn-p034-figure-01.png)

图 31 USB 3.0 Device Tx 测试条件设置

4. 连接示波器、夹具和待测 USB 设备按照示波器的提示进行连接,如下图所示。VBus 5V 供电也要连接。

![原稿配图 — PDF p34](/docs/rockchip-usb-sq-test/assets/cn-p034-figure-02.png)

图 32 USB 3.0 Device Tx 测试连接示意图

5. 开始 Tx 测试

5.1. 测试过程中,自动化软件提示测试 LFPS 的操作方法

![原稿配图 — PDF p35](/docs/rockchip-usb-sq-test/assets/cn-p035-figure-01.png)

图 33 LFPS 测试界面Note:进行LFPS 测试前,要先断开USB3.0 夹具和被测件,然后点击“OK”,再重新连接到夹具。

![原稿配图 — PDF p35](/docs/rockchip-usb-sq-test/assets/cn-p035-figure-02.png)

图 34 USB 3.0 Device Tx LFPS 参考波形

5.2. LFPS 测试完成后,开始 SSC 测试,自动化软件提示更改示波器、夹具和被测件的连接

![原稿配图 — PDF p36](/docs/rockchip-usb-sq-test/assets/cn-p036-figure-01.png)

图 35 USB 3.0 Device Tx SSC 测试

5.3. SSC 测试完成后, 开始眼图/抖动测试,自动化软件提示更改示波器、夹具和被测件的连接。

![原稿配图 — PDF p36](/docs/rockchip-usb-sq-test/assets/cn-p036-figure-02.png)

图 36 USB 3.0 Device Tx 眼图及抖动测试

5.4. 测试完成,自动生成测试报告,查看测试报告

![原稿配图 — PDF p37](/docs/rockchip-usb-sq-test/assets/cn-p037-figure-01.png)

图 37 USB 3.0 Device Tx 测试报告

![原稿配图 — PDF p37](/docs/rockchip-usb-sq-test/assets/cn-p037-figure-02.png)

图 38 USB 3.0 Device Tx LFPS Burst Width

![原稿配图 — PDF p38](/docs/rockchip-usb-sq-test/assets/cn-p038-figure-01.png)

图 39 USB 3.0 Device Tx LFPS Repeat Time Interval

![原稿配图 — PDF p38](/docs/rockchip-usb-sq-test/assets/cn-p038-figure-02.png)

图 40 USB 3.0 Device Tx Short Channel Eye Diagram

![原稿配图 — PDF p39](/docs/rockchip-usb-sq-test/assets/cn-p039-figure-01.png)

图 41 USB 3.0 Device Tx Far End Eye Diagram

#### 3.2.7 USB 3.0 Host Tx 测试命令

表 7 USB 3.0 Host Tx 测试命令

| 芯片名称 | DWC3_0 OTG Host 3.0 | DWC3_1 OTG Host 3.0 | DWC3_2 Host 3.0 |
| --- | --- | --- | --- |
| RK1808 | io -4 0xff384008 0xc<br>io -4 0xfd000430 0x0a010340 | N.A | N.A |
| RK1820 | io -4 0x1025000430 0x0a010340 | N.A | N.A |
| RK3228H<br>RK3328 | io -4 0xff478408 0xc<br>io -4 0xff600430 0x0a010340 | N.A | N.A |
| RK3366 | io -4 0xff500430 0x0a010340 | N.A | N.A |
| RK3399 | io -4 0xfe800430 0x0a010340 | io -4 0xfe900430 0x0a010340 | N.A |
| RK3528 | io -4 0xfe500430 0x0a010340 | N.A | N.A |
| RK3562 | io -4 0xfe500430 0x0a010340 | N.A | N.A |
| RK3566<br>RK3568 | io -4 0xfcc00430 0x0a010340 | io -4 0xfd000430 0x0a010340 | N.A |
| RK3576 | io -4 0x23000430 0x0a010340 | io -4 0x23400430 0x0a010340 | N.A |
| RK3588<br>RK3588S | io -4 0xfc000430 0x0a010340 | io -4 0xfc400430 0x0a010340 | io -4 0xfcd00430 0x0a010340 |
| RV1126B | io -4 0x21500430 0x0a010340 | N.A | N.A |

Note:RK1808/RK3228H/RK3328 需要执行两条测试命令,其中第一个命令(即写”0xc“)是为了手动触发CP1 testpattern。一般情况下,测试时,两条命令可以同时输入,但如果出现CP0 或CP1 test pattern 切换异常时,请先不要执行第一个命令(即写”0xc“),首先,在开始测试前,输入写值“0x0a010340” 的命令,然后,在测试过程中,等待示波器弹出CP1 pattern 测试的提示窗口时,再输入写值“0xc” 的命令。io 命令适用于所有芯片和内核版本Linux-3.10/4.4 内核版本还支持通过写内核设备节点的方式,测试RK3399 Type-C USB,具体方法请参考章节[RK3399 USB 3.0 测试问题](#342-rk3399-usb-30-测试问题)

#### 3.2.8 USB 3.0 Host Tx 测试方法

本文档主要说明使用 Agilent 90000 系列示波器(型号:DSO91204A 和测试夹具 U7242A)的 USB 3.0 Device Tx 测试方法。如果使用的是 Tektronix 或者 LeCroy 的示波器,请自行搜索 Tektronix 和 LeCroy 官方发布的测试指南。

 3.2.8.1 USB 3.0 Host Tx 测试注意事项

测试 USB 3.0 接口前,建议先使用支持 USB 3.0 的外设(如:USB 3.0 Disk)插入待测试的 USB 3.0 接口,并通过测试平台的调试串口查询 USB 3.0 外设的枚举信息,如果串口打印的枚举信息包含“SuperSpeed”,则说明待测的 USB 接口可以正常支持 USB 3.0 功能, 然后再拔出 USB3.0 Disk,开始测试 。如果缺少该步骤,RK3399 Type-A USB 3.0 可能无法进入测试模式;开始测试前,需要先根据待测芯片平台和 USB 接口,查表 7 的测试命令,并输入相应的测试命令,再开始测试,才能触发 USB 3.0 控制器进入 Host Tx 测试模式;待测试的 USB 接口的 VBUS 需要对外输出 5v 供电,而测试夹具 U7242A 则不需要 5V 供电(这与 Device Tx 测试恰好相反);测试流程中,Type-A 接口和 Type-C 接口输入测试命令的时序有所不同,具体请参考下面的测试步骤描述;

 3.2.8.2 USB 3.0 Host Tx 测试步骤

1. 设置自动化测试软件。USB 3.0 Host Tx 测试过程中,示波器的自动化测试软件的设置与 USB 3.0 Device Tx 类似,所以自动化测试软件的设置请参考USB 3.0 Device Tx 测试步骤中的说明,这里不再赘述;

2. 先将测试夹具的一端连接到示波器,测试夹具的另外一端暂时不要连接到待测设备的 USB 3.0 Host 接口;

3. 设置示波器进入 USB 3.0 的 LFPS 测试项,示波器会提示断开测试夹具与待测的 USB 3.0 Host 接口的连接;

4. 根据待测芯片平台和 USB 接口,查表 7 USB 3.0 Host Tx 测试命令;

5. 如果测试的 USB 接口为 Type-A,则先输入步骤 4 的测试命令,再连接测试夹具与待测的 USB 3.0 接口;如果测试的 USB 接口为 Type-C,则先连接 Type-C 测试夹具与待测的 USB 3.0 接口,等 USB 驱动软件自动切换到 Host mode (等待 2~3 秒),再输入步骤 4 的测试命令;

6. 连接测试夹具与待测试的 USB 3.0 Host port,则 USB 3.0 控制器会自动进入测试模式;

7. 根据示波器的操作提示,完成所有的测试项;

#### 3.2.9 USB 3.0 Tx Compliance mode 查询

Device Tx Compliance mode 查询方法cat /sys/kernel/debug/usb/xxxx/link_state ("xxxx" 表示待测试的 usb 控制器的节点名称,根据实测平台填写)返回值为:Compliance,表示已进入 Device Tx 测试模式Host Tx Compliance mode 查询方法(1) Linux-4.19 及更早的内核版本通过 io 命令读 USB 3.0 xHCI 控制器的寄存器 PORTSC,bit[8:5] Port Link State (PLS) ,如果 PORTSC.PLS =10(十进制),则表示 Device 已经处于 Compliance mode。不同芯片,PORTSC 寄存器的基地址可能不同,请查芯片的 TRM,寄存器的偏移地址固定为 0x430。比如,RK3399 USB 3.0 Host0 的 PORTSC 寄存器地址为 0xfe800430 , USB 3.0 Host1 的 PORTSC 寄存器地址为 0xfe900430。(2) Linux-5.10 及更新的内核版本Linux-5.10 及更新的内核版本提供了portsc节点,可以更加方便直观地查询 Host Tx Compliance mode 的状

态,节点路径如下:cat sys/kernel/debug/usb/xhci/xxxx/ports/port02/portsc ("xxxx" 表示待测试的 xHCI 控制器的节点名称,根据实测平台填写)返回值为:Link:Compliance mode,表示已进入 Host Tx 测试模式

### 3.3 USB 3.0 Rx Compliance Test

USB 3.0 Rx 的电气性能测试,我们称之为接收抖动容限测试(Receiver Jitter Tolerance Test),测试过程中,不需要输入任何的测试命令,只要搭建好测试环境,USB 3.0 控制器在连接到测试仪器后,会自动进入Loopback mode,开始进行 Rx 测试。由于 USB 3.0 Rx 测试环境搭建比较复杂,并且不同示波器,测试步骤有所不同,所以本文档没有提供 Rx 的详细测试方法,请参考测试示波器的操作说明。本文档只简单说明进入 Loopback mode 的原理,以及确认进入 Loopback mode 的方法。

#### 3.3.1 USB 3.0 Rx 测试方法

进入 Loopback mode 的流程USB 3.0 控制器在 link training 的 Polling.Configuration 阶段,如果检测到测试仪器发送的 T2 pattern 中Loopback bit 位,就会自动配置 USB 3.0 PHY 进入 Loopback mode。如下图 42 所示。

![原稿配图 — PDF p42](/docs/rockchip-usb-sq-test/assets/cn-p042-figure-01.png)

图 42 USB 3.0 进入 Loopback mode 的流程Receiver Jitter Tolerance Test接收抖动容忍度测试的方法,请参考文档 Electrical Compliance Test Specification for SuperSpeed USB Rev.

1.0aTD.1.5 Receiver Jitter Tolerance Test 章节详细说明了接收抖动容忍度的测试步骤。

#### 3.3.2 USB 3.0 Rx Loopback mode 查询

Device Rx Loopback mode 查询方法cat /sys/kernel/debug/usb/xxxx/link_state ("xxxx" 表示待测试的 usb 控制器的节点名称,根据实测平台填写)

返回值为:Loopback,表示已进入 Device Rx 测试模式Host Rx Loopback mode 查询方法(1) Linux-4.19 及更早的内核版本通过 io 命令读 USB 3.0 xHCI 控制器的寄存器 PORTSC,bit[8:5] Port Link State (PLS) ,如果 PORTSC.PLS =11(十进制),则表示已经处于 Loopback mode。不同芯片,PORTSC 寄存器的基地址可能不同,请查芯片的TRM,寄存器的偏移地址固定为 0x430。比如,RK3399 USB 3.0 Host0 的 PORTSC 寄存器地址为 0xfe800430 , USB 3.0 Host1 的 PORTSC 寄存器地址为 0xfe900430。(2) Linux-5.10 及更新的内核版本Linux-5.10 及更新的内核版本提供了portsc节点,可以更加方便直观地查询 Host Rx Loopback mode 的状态,节点路径如下:cat sys/kernel/debug/usb/xhci/xxxx/ports/port02/portsc ("xxxx" 表示待测试的 xHCI 控制器的节点名称,根据实测平台填写)返回值为:Link:Test mode,表示已进入 Host Rx 测试模式

### 3.4 USB 3.0 Compliance Test 常⻅问题及解决方法

#### 3.4.1 USB 3.0 Device Tx 无法进入测试模式的问题

正常情况下,USB 3.0 Device 不需要输入测试命令,就可以自动进入 Tx 测试模式。如果无法进入测试模式,建议先测试 VBUS 的电压。按照 USB 3.0 Device Tx Compliance test 的规范,USB 3.0 Device 的 VBUS 5V 不能自供电,否则会导致 USB 3.0 控制器无法自动进入 Compliance mode。VBUS 的供电必须由测试夹具提供,可以通过 USB 线将测试夹具的 USB 供电口与示波器或者 PC 的 USB 口连接,实现 VBUS 5V 的供电。

#### 3.4.2 RK3399 USB 3.0 测试问题

1. RK3399 Type-A USB 3.0 Host 无法进入 Tx 测试模式测试 RK3399 Type-A USB 3.0 Host 时,需要增加一个步骤,即在测试前,先将 USB 3.0 Disk 插入待测试的USB 3.0 接口,详细操作⻅USB 3.0 Host Tx 测试方法 —— USB 3.0 Host Tx 测试注意事项,否则,Type-AUSB 3.0 可能无法进入测试模式。除了上述方法,还可以通过修改软件解决。具体方法是,删除 DTS 中 usbdrd_dwc3_0 和 usbdrd_dwc3_1 节点的如下属性:snps,usb3-warm-reset-on-resume-quirk

2. RK3399 Type-C USB 3.0 Host 无法进入 Tx 测试模式正常情况,RK3399 Type-C USB 3.0 Host 只要参考USB 3.0 Host Tx 测试方法,就可以进入 Tx 测试模式。如果无法进入 Tx 测试模式,建议先测试 VBus 的电压,如果 VBus 为常供电,可能会导致无法进入 Tx 测试模式。有两种解决方法:方法 1:将 VBus 供电配置为软件可控的方式,也即默认不输出 5V,当插入 Type-C 转 Type-A 线时,才输出5V;方法 2:将 DTS 对应的 dr_mode 属性配置为"host";

3. RK3399 Type-A USB 3.0 Host 无法进入 Rx Loopback mode如果是测试 Type-A USB3.0 接口,建议再开始测试前,先将 USB 3.0 Disk 插入待测试的 USB 3.0 接口,并通过串口 log 确认可以识别为“SuperSpeed”,表示测试固件可以正常支持 USB3.0,然后拔出 USB 3.0 Disk,开始测试。如果缺少该步骤,RK3399 Type-A USB3.0 可能无法进入 Loopback mode。

4. RK3399 平台 Linux-3.10/4.4 内核的 USB 3.0 Host Tx 测试方法

注:仅适用于 RK3399 芯片

1. RK3399 Linux-3.10/早期Linux-4.4：以下依次为Type-C0正面、反面，Type-C1正面、反面。

```sh
echo test_u3 > /sys/kernel/debug/usb@fe800000/host_testmode
echo test_flip_u3 > /sys/kernel/debug/usb@fe800000/host_testmode
echo test_u3 > /sys/kernel/debug/usb@fe900000/host_testmode
echo test_flip_u3 > /sys/kernel/debug/usb@fe900000/host_testmode
```

2. RK3399新版Linux-4.4：以下依次为Type-C0正面、反面，Type-C1正面、反面，再查询状态。U2: test_packet表示U2测试模式；U3: compliance mode表示U3测试模式；U3: UNKNOWN表示未进入。

```text
echo test_u3 > /sys/devices/platform/usb0/host_testmode
echo test_flip_u3 > /sys/devices/platform/usb0/host_testmode
echo test_u3 > /sys/devices/platform/usb1/host_testmode
echo test_flip_u3 > /sys/devices/platform/usb1/host_testmode
cat /sys/kernel/debug/usb3 控制器节点/host_testmode
U2: test_packet // means that U2 in test mode
U3: compliance mode // means that U3 in test mode
```

#### 3.4.3 RK1808 USB 3.0 测试问题

1. RK1808 Type-A USB 3.0 Host 无法进入 Rx Loopback mode通过修改软件,disable hub autosuspend 功能,修改参考如下:

```text
diff --git a/drivers/usb/core/usb.c b/drivers/usb/core/usb.c
index 36e5098..0b2930d 100644
--- a/drivers/usb/core/usb.c
+++ b/drivers/usb/core/usb.c
@@ -66,7 +66,7 @@ int usb_disabled(void)
 EXPORT_SYMBOL_GPL(usb_disabled);

 #ifdef CONFIG_PM
-static int usb_autosuspend_delay = 2;          /* Default delay value,
+static int usb_autosuspend_delay = -1;         /* Default delay value,
```

#### 3.4.4 RK3588 USB 3.0 测试问题

RK3588 USB 3.0 的 Tx/Rx 测试,基于 Linux-5.10 内核,注意点如下:

1. Type-C0 USB3 Device测试前，先关闭控制器autosuspend。

```text
echo on > /sys/devices/platform/usbdrd3_0/fc000000.usb/power/control
```

2. 测试 Type-C 接口的 USB 3.0 Host mode 时,需要先连接 Type-C 测试夹具与待测的 USB 3.0 接口,等 USB 驱动软件自动切换到 Host mode (等待 2~3 秒),,再输入表 7 的 Host 测试命令。

3. 测试 USB 3.0 Rx 功能时,如果无法自动进入 loopback mode,需要修改 DTS 的 DWC3 控制器配置,增加snps,dis_u3_susphy_quirk;

4. 确认 Type-C0 USB 3.0 Device mode Tx 进入测试模式的方法cat /sys/kernel/debug/usb/fc000000.usb/link_state返回值为:Compliance,表示已进入 Device Tx 测试模式

5. 确认 Type-C0 USB 3.0 Device mode Rx 进入测试模式的方法cat /sys/kernel/debug/usb/fc000000.usb/link_state返回值为:Loopback,表示已进入 Device Rx 测试模式

6. 确认 USB 3.0 Host mode Tx 进入测试模式的方法以 Type-C1 USB 3.0 Host 为例:cat sys/kernel/debug/usb/xhci/xhci-hcd.8.auto/ports/port02/portsc返回值为:Link:Compliance mode,表示已进入 Host Tx 测试模式

7. 确认 USB 3.0 Host mode Rx 进入测试模式的方法以 Type-C1 USB 3.0 Host 为例:cat sys/kernel/debug/usb/xhci/xhci-hcd.8.auto/ports/port02/portsc返回值为:Link:Test mode,表示已进入 Host Rx 测试模式

## 4. USB 3.0 HUB Compliance Test

脚本注释本地化：USB2示例共有4个HUB，选择HUB[2]并选择端口2，q退出。USB3示例选择0表示SuperSpeed HUB，选择1表示port1，port2则输入2，依次类推；q结束测试。原始终端输出及中文注释保留不改。

USB3.0 HUB 的 Compliance test 包括了 upstream ports 和 downstream ports,但实际应用中,我们一般只需测试提供给用戶使用的 downstream ports。因此,本文档只提供了测试 USB3.0 HUB downstream ports 的Compliance test 测试方法。常⻅的 USB3.0 HUB 芯片型号主要有:GL352x 系列、VL812、VL813、USB5734、RTS5411、CYPRESS HX3 系列等。与 USB2.0 HUB 的测试方法不同,Rockchip 平台的 USB3.0 HUB Compliance Test 只能使用脚本测试方法。

1. 下载并编译测试脚本:脚本源码下载地址:https://redmine.rockchip.com.cn/documents/113文件:USB_HUB_Compliance_Test_Script

2. 以RK3399测试GL3523为例：(1) adb push脚本至Android；(2) 修改linux-eye权限；(3) 执行脚本使USB3 HUB port进入测试模式；(3.1) 按kernel log确定HUB信息。

```text
adb push C:\Users\user\Desktop\linux-eye /data
root@rk3399:/data # chmod 777 linux-eye
```

```text
[  139.427845] usb 6-1: new SuperSpeed USB device number 2 using xhci-hcd
[  139.445641] usb 6-1: New USB device found, idVendor=05e3, idProduct=0612
[  139.445708] usb 6-1: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[  139.445738] usb 6-1: Product: USB3.0 Hub
[  139.445763] usb 6-1: Manufacturer: GenesysLogic
[  139.452409] usb 5-1: new high-speed USB device number 2 using xhci-hcd
[  139.463572] hub 6-1:1.0: USB hub found
[  139.465861] hub 6-1:1.0: 4 ports detected
[  139.589854] usb 5-1: New USB device found, idVendor=05e3, idProduct=0610
[  139.589920] usb 5-1: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[  139.589950] usb 5-1: Product: USB2.0 Hub
[  139.589975] usb 5-1: Manufacturer: GenesysLogic
[  139.607244] hub 5-1:1.0: USB hub found
[  139.609146] hub 5-1:1.0: 4 ports detected
```

(3.2) 执行测试脚本

```text
root@rk3399:/ # ./data/linux-eye

LinuxEye - select one of the following hub for testing.

        [ 0]    4-port Super-Speed hub at tier 2 of Bus 6
                (VID: 05E3, PID: 0612, Address: 2)

        [ 1]    4-port High-Speed hub at tier 2 of Bus 5
                (VID: 05E3, PID: 0610, Address: 2)

    Please enter [0 ~ 1] to select a hub or 'q' to quit: 0 （输⼊0，表⽰测试super-speed）
                [ 1] is open
                [ 2] is open
                [ 3] is open
                [ 4] is open
    Please enter [1 ~ 4] to select a port or 'q' to quit: 1 （输⼊1，表⽰测试USB3 HUB
port1，如果测试port2，则输⼊2，以此类推）
    device file /dev/bus/usb/006/002 opened successfully
           Port (1) Status: 02A0
    LinuxEye - Start testing port 1 of device 2 on bus 6    （开始测试）
                Type 'q' to stop the test: q                （测试结束，输⼊q，退出）
```

(3.3) 重复上述步骤,测试其他 USB3.0 HUB downstream ports

## 5. Rockchip USB SQ Tool

Rockchip USB SQ Tool 是 Rockchip 自研的 USB PHY 信号完整性调试工具,可以支持 USB 信号测试命令的查询和USB PHY 信号的动态调整,还可以根据 PHY Tuning 的结果,自动生成对应的 PHY 驱动代码。关于 USB SQ Tool 的详细说明,请参考文档 《Rockchip_Introduction_USB_SQ_Tool_CN》。USB SQ Tool 下载地址:https://redmine.rockchip.com.cn/documents/113

## 6. 参考文档

1. 《USB 2.0 Specification》

2. 《USB 3.1 Specification》

3. 《Agilent N5416A USB 2.0 Compliance Test Option》

4. 《Agilent USB2.0 High Speed Device SQ Test》》

5. 《Keysight N7015A-16A Type-C Test Kit》

6. 《USB 2.0 Electrical Compliance Test Specification Version 1.07》

7. 《Electrical Compliance Test Specification for SuperSpeed USB Rev. 1.0a》

{% endraw %}
