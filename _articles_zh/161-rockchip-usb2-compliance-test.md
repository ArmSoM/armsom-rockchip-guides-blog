---
title: "Rockchip USB 2.0 一致性测试：功能、电气、互通与认证"
description: "Rockchip USB 2.0 一致性测试：功能、电气、互通与认证 — V1.0.0"
excerpt: "Rockchip USB 2.0 一致性测试：功能、电气、互通与认证"
translation_key: "161-rockchip-usb2-compliance-test"
slug: "161-rockchip-usb2-compliance-test"
lang: "zh"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, Compliance]
---

{% raw %}

# Rockchip USB 2.0 一致性测试：功能、电气、互通与认证

ArmSoM 平台参考。来源为 RK-CS-YF-129 V1.0.0 中文原稿（2020年技术背景）。原稿范围为全部 Rockchip 芯片（29/30/31/32/33/PX/RV系列及MCU）和全部内核，但具体 ArmSoM 板卡、USB拓扑、BSP及实验室要求仍须独立核实；本次没有硬件测试或认证。无英文PDF，无独立技术配图，原跨页表恢复为可编辑表格。以下认证流程、工具条件和供应商名单均为历史原稿说明，不宣称是当前政策。

原稿疑点：表中 Host FS 行对应 Low-speed，Host LS 行对应 Full-speed，名称与要求相反；Device 两项包间隔均写 EL_22。原样保留，执行前按适用规范确认，不静默纠正。

[ArmSoM Docs](https://docs.armsom.org/)

## 1. USB 2.0 功能特性测试

USB 2.0 功能性测试主要检查产品功能是否完整。USB-IF 提供 USB20CV（USB 2.0 Command Verifier），评估高速、全速、低速设备是否符合设备框架（第9章）、集线器设备类（第11章）、HID 类和 OTG 规范，也包括大容量存储类和视频类测试规范。原稿要求所有 USB 外设和集线器通过设备框架测试才能获得认证。

USB20CV 仅支持 Windows；原稿要求 Windows 7 或更高版本，主机须支持 EHCI。下载：

- [USB20CV 32-bit Windows](https://usb.org/document-library/usb20cv-x32-bit)
- [USB20CV 64-bit Windows](https://usb.org/document-library/usb20cv-x64-bit)

## 2. USB 2.0 电气特性测试

电气特性测试主要检查信号。USB 2.0 电气测试规范定义产品测试标准[2][3]；原稿要求所有 USB 产品通过电气测试才能获得 USB-IF 认证。须覆盖高速、全速、低速信号。

- 低速/全速：《USB-IF Full and Low Speed Electrical and Interoperability Compliance Test Procedure》。
- 高速：《USB 2.0 Electrical Compliance Test Specification》。

原稿列出的 USB-IF 认可示波器供应商为 Keysight、Rohde & Schwarz、Tektronix、Teledyne LeCroy。根据规范建议执行表1各项。

表1：USB 2.0 电气特性主要测试项。

| 测试项 | 测试要求 |
| --- | --- |
| Device HS Signal Quality Test | 参考文献[2]<br>EL_2 EL_4 EL_5 Data Eye and Mask Test<br>EL_6 Device Rise Time<br>EL_6 Device Fall Time<br>EL_7 Device Non-Monotonic Edge Test |
| Device HS Packet Parameters | 参考文献[2]<br>EL_21 Sync Field Length Test<br>EL_25 EOP Length Test<br>EL_22 Measure Interpacket Gap Between Second and Third Packets<br>EL_22 Measure Interpacket Gap Between First and Second Packets |
| Device HS Device CHIRP Timing | 参考文献[2]<br>EL_28 Measure Device CHIRP-K Latency<br>EL_29 Measure Device CHIRP-K Duration<br>EL_31 Hi-Speed Terminations Enable and D+ Disconnect Time |
| Device HS Suspend/Resume/Reset Timing | 参考文献[2]<br>EL_38 EL_39 Suspend Timing Response<br>EL_40 Resume Timing Response<br>EL_27 Device CHIRP Response to Reset from Hi-Speed<br>EL_28 Device CHIRP Response to Reset from Suspend |
| Device HS Test J/K, SE0_NAK | 参考文献[2]<br>EL_8 J Test<br>EL_8 K Test<br>EL_9 SE0_NAK Test |
| Device HS Receiver Sensitivity | 参考文献[2]<br>EL_18 Receiver sensitivity Test - Minimum SYNC Field<br>EL_17 Receiver sensitivity Test<br>EL_16 Receiver sensitivity Test @ Squelch |
| Host HS Signal Quality | 参考文献[2]<br>EL_6 Rise Time<br>EL_6 Fall Time<br>EL_3 Data Eye and Mask Test<br>EL_7 Non-Monotonic Edge Test |
| Host HS Packet Parameters | 参考文献[2]<br>EL_21 Sync Field Length Test<br>EL_25 EOP Length Test<br>EL_23 Inter-packet Gap Between First 2 Packets Test<br>EL_22 Inter-packet Gap Between 2nd and 3rd Packet Test<br>EL_55 SOF EOP Width Test |
| Host HS Disconnect Detect | 参考文献[2]<br>EL_37 Disconnect Detect Test At 525mV Threshold<br>EL_36 Disconnect Detect Test At 625mV Threshold |
| Host HS CHIRP Timing | 参考文献[2]<br>EL_33 CHIRP Timing Response<br>EL_34 CHIRP K Width<br>EL_34 CHIRP J Width<br>EL_35 SOF Timing Response |
| Host HS Suspend/Resume Timing | 参考文献[2]<br>EL_39 Suspend Timing Response<br>EL_41 Resume Timing Response |
| Host HS Test J/K, SE0_NAK | 参考文献[2]<br>EL_8 J Test<br>EL_8 K Test<br>EL_9 SE0_NAK Test |
| Host LS/FS Inrush Current Test | 参考文献[3]<br>B.4 Inrush Current Testing |
| Host FS Signal Quality Test | 参考文献[3]<br>B.3.3.1 Low-speed Downstream Signal Quality Test |
| Host LS Signal Quality Test | 参考文献[3]<br>B.3.3.2 Full-speed Downstream Signal Quality Test |

表1主要测试高速信号质量。原稿提供基于 Windows 的 HSETT（High-Speed Electrical Test Tool）及以下下载链接，工具说明为 HSET Documentation version 0.41 for EHCI and xHCI。

- [EHSETT 32-bit](https://usb.org/document-library/usbhset-ehci-32-bit)
- [EHSETT 64-bit](https://usb.org/document-library/usbhset-ehci-64-bit)
- [XHSETT 32-bit](https://usb.org/document-library/xhsett-x32)
- [XHSETT 64-bit](https://usb.org/document-library/xhsett-x64)
- [HSET Documentation version 0.41 for EHCI and xHCI](https://usb.org/document-library/hset-documentation-version-041-ehci-and-xhci)

注意：Device/Host HS Signal Quality 测试须将待测设备设为 Test Packet Mode 才能产生正确测试信号。Rockchip 控制器可通过测试命令或 HSETT 工具设置，具体限制为：

- USB 2.0 Device：测试命令或工具均可进入 Test Packet Mode。
- USB 2.0 Host：只能使用测试命令进入 Test Packet Mode。

命令见《Rockchip_Developer_Guide_USB_SQ_Test_CN》“USB 2.0 测试命令和测试工具”章节。

## 3. USB 2.0 互通特性测试

互通测试检查 USB 设备与不同操作系统及硬件控制器的兼容性。可使用“Gold Tree”设备测试与不同主机互操作，例如 EHCI 主机上是否能成功枚举。原稿称当时 USB-IF 未强制要求 USB 2.0 互通测试，因此未展开；进一步方法见《xHCI Interoperability Test Procedures For Peripherals, Hubs and Hosts Version》。

- [xHCI Interoperability Test Procedures](https://usb.org/document-library/xhci-interoperability-test-procedures-peripherals-hubs-and-hosts-version)

## 4. USB 2.0 认证

USB 2.0 认证指产品通过 USB-IF 规定测试并获准使用 USB 标志。原稿列出两种测试渠道：USB-IF 赞助的兼容性测试大会，或 USB-IF 认可的独立实验室（https://www.usb.org/labs）。原稿说明通过后获得 TESTING ID（TID），可在 USB-IF 网站查到设备信息，并获得标志使用资格。

原稿的一般流程：

1. 申请 USB-IF 会员并获取 Vendor ID（VID）。
2. 准备 USB 兼容性测试清单。
3. 送授权独立实验室测试。
4. 获得合格报告及证书。
5. 使用相应 USB 标志。

原稿提示 Rockchip 为 USB-IF 会员，VID 为 0x2207，SDK 默认也为 0x2207，但只供开发调试，不能授权开发者用于产品认证。原稿要求开发者独立申请会员以获取唯一 Vendor ID；这段是2020年原文流程，不代替当前 USB-IF 授权条款。

## 5. 参考文献

1. [USB 2.0 Testing Information](https://usb.org/usb2)

2. [USB 2.0 Electrical Compliance Test Specification](https://usb.org/document-library/usb-20-electrical-compliance-test-specification-version-107)

3. [USB-IF Full and Low Speed Electrical and Interoperability Compliance Test Procedure](https://usb.org/document-library/usb-if-full-and-low-speed-electrical-and-interoperability-compliance-test)

4. [HSET Documentation version 0.41 for EHCI and xHCI](https://usb.org/document-library/hset-documentation-version-041-ehci-and-xhci)

5. `Rockchip_Developer_Guide_USB_SQ_Test_CN`

{% endraw %}
