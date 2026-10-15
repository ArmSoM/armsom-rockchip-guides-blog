---
title: "Rockchip Linux Wi-Fi 与蓝牙：完整芯片及模组支持列表"
description: "面向 ArmSoM 硬件选型的完整可编辑器件表、原始验证状态及技术注释；明确板级适配和验证前提。"
translation_key: "029-rockchip-wifi-bt-support"
slug: "029-rockchip-wifi-bt-support"
lang: "zh"
date: "2026-10-15"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: ["Sige7", "CM5"]
tags: ["Rockchip", "AVL", "wifi-bt", "hardware"]
keywords: "Rockchip Linux Wi-Fi 与蓝牙：完整芯片及模组支持列表, ArmSoM, BSP"
excerpt: "面向 ArmSoM 硬件选型的完整可编辑器件表、原始验证状态及技术注释；明确板级适配和验证前提。"
---

{% raw %}
# Rockchip Linux Wi-Fi 与蓝牙：完整芯片及模组支持列表

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

本文是 ArmSoM 项目的平台级器件选型参考，不是所有板卡通用、已验证可直接替换的物料表。Sige7（RK3588）、CM5（RK3576）等项目需逐项核对对应 SoC 列、原理图、实际 BOM、封装、电源和板卡版本，完成板级信号完整性及量产验证。原文未指定统一适用的 SDK/BSP 或内核版本，需匹配实际发行 BSP、启动固件与驱动，并遵循料号对应的技术注释。本次没有硬件测试，原文状态与示例不代表 ArmSoM 实测。

Sige7 官方说明列出 AP6275P，但不表示本清单所有模组均在 Sige7 验证。需匹配 SDIO/PCIe/USB、BT UART/PCM、固件、驱动、天线设计和具体 BSP。SS、ST、DS 的验证依据不同。

来源: `Rockchip_Support_List_Linux_WiFi_BT_Ver2.0_20250619.pdf`, V2.0.

提供的中英文目录同名文件字节一致，内容主要为英文。三语使用同一套原图，没有独立中文原图。已移除封面声明及修订记录，保留技术脚注。

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [校对记录](/docs/rockchip-avl-wifi-bt/EDITORIAL-NOTES.md)

## 1. 阅读说明

状态符号描述原文验证范围，不代表你的板卡自动通过验证。空白保持为空，不能理解为支持。料号、后缀、数量及平台状态按原文保留。EOL 表示生命周期结束；AUTO、IT 保留为原文标签，不代表本次新增认证。

- 其他 AP/Realtek 型号的支持，请参考 Wi-Fi/BT 开发文档中的移植章节。

- 其他厂商芯片或模组需要联系对应厂商协助移植驱动，也可参考 Wi-Fi/BT 开发文档。

- 开发指南与支持列表下载入口：https://redmine.rock-chips.com/documents/52 。

- BT 表示 Bluetooth；ac 表示 Wi-Fi 5，ax 表示 Wi-Fi 6。

- State 表示 RK 平台的验证状态或支持方式：SS = SDK 支持；ST = 样品已测试；DS = 数据手册支持。DS 不代表已完成详细的平台验证。

- Antenna 指 Wi-Fi 天线。部分模组使用独立的单根 BT 天线，即 Wi-Fi 为 2T2R，而 Bluetooth 独立为 1T1R；选型与硬件设计时需注意。

## 完整兼容性表格

表格按原始页码分组以便追溯，没有缩减平台列；可横向滚动查看全部 SoC。原文重复条目保留，包括状态不一致的重复项。

### 原文第 1 页

| 厂商 | Wi-Fi 芯片／模组 | Wi-Fi 接口 | Wi-Fi 代际 | IEEE 802.11 标准 | 最高数据速率 | 低功耗 MCU | 2.4GHz 频段 | 5.0GHz 频段 | 6.0GHz 频段 | 天线 | BT 标准 | BT 接口 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rockchip | RK960 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.3 | UART/PCM | SS |  |
| Rockchip | RK962 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | 5.3 | UART/PCM | SS |  |
| Rockchip | RK915 | SDIO | Wi-Fi 4 | 802.11b/g/n | 65Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Synaptics （芯片） | SYN43756E | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.4 | UART/PCM | DS |  |
| Synaptics （芯片） | SYN43711 | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.4 | UART/PCM | DS |  |
| Synaptics （芯片） | SYN43752 | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.4 | UART/PCM | DS |  |
| Synaptics （芯片） | SYN43598 | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Synaptics （芯片） | SYN43456 | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Synaptics （芯片） | SYN43436 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Synaptics （芯片） | BCM430132 | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Realtek （芯片） | RTL8852C | PCIe/USB | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/USB/PC M | DS |  |
| Realtek （芯片） | RTL8852B | SDIO/PCIe/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/USB/PC M | DS |  |
| Realtek （芯片） | RTL8832BU | USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | × | × | DS |  |
| Realtek （芯片） | RTL8851B | SDIO/PCIe/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/USB/PC M | DS |  |
| Realtek （芯片） | RTL8822C | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5 | UART/USB/PC M | SS |  |
| Realtek （芯片） | RTL8822E | SDIO/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | SS |  |
| Realtek （芯片） | RTL8821C | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 4.2 | UART/USB/PC M | DS |  |
| Realtek （芯片） | RTL8812CU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | × | × | DS | EFEM |
| Realtek （芯片） | RTL8812EU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | × | × | DS |  |
| Realtek （芯片） | RTL8811CU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Realtek （芯片） | RTL8192E | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 300Mbps |  | √ | × | × | 2T2R | × | × | DS | EFEM |

### 原文第 2 页

| 厂商 | Wi-Fi 芯片／模组 | Wi-Fi 接口 | Wi-Fi 代际 | IEEE 802.11 标准 | 最高数据速率 | 低功耗 MCU | 2.4GHz 频段 | 5.0GHz 频段 | 6.0GHz 频段 | 天线 | BT 标准 | BT 接口 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Realtek （芯片） | RTL8192F | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 300Mbps |  | √ | × | × | 2T2R | × | × | DS |  |
| Realtek （芯片） | RTL8733B | SDIO/USB | Wi-Fi 4 | 802.11 a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Realtek （芯片） | RTL8723D | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | 4.2 | UART/USB/PC M | SS |  |
| Realtek （芯片） | RTL8731B | SDIO/USB | Wi-Fi 4 | 802.11 a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Realtek （芯片） | RTL8189FTV | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Realtek （芯片） | RTL8189ES/EM | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| Realtek （芯片） | RTL8188FTV | USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Realtek （芯片） | RTL8761BTV | × | × | × | × |  | × | × | × | × | 5.0 | UART | ST |  |
| Realtek （芯片） | RTL8188EUS-VH | USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS | EFEM |
| Infineon （芯片） | CYW55572 | SDIO/PCIe | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.4 | UART/PCM | DS |  |
| Infineon （芯片） | CYW55513 | SDIO/SPI | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.4 | UART/PCM | DS |  |
| Infineon （芯片） | CYW54591 | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.4 | UART/PCM | DS |  |
| Infineon （芯片） | CYW43455 | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | ST |  |
| Infineon （芯片） | CYW4373 | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Infineon （芯片） | CYW43438 | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| Infineon （芯片） | CYW43012 | SDIO/SPI | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Infineon （芯片） | CYW43439 | SDIO | Wi-Fi 4 | 802.11 b/g/n | 65Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| AIC （芯片） | AIC8800D80 | SDIO/PCIe/USB | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| AIC （芯片） | AIC8800D | SDIO/USB | Wi-Fi 6 | 802.11b/g/n/ax | 286.80Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| SeekWave （芯片） | EA6621Q | SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | ST |  |
| Unisoc （芯片） | UWE5621DS | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| iComm （芯片） | SSV6155P | USB | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| iComm （芯片） | SV6158 | SDIO | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| iComm （芯片） | SV6256 | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| AltoBeam （芯片） | ATBM603x | SDIO/USB | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | ST |  |
| AltoBeam （芯片） | ATBM6441 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | × | × | ST |  |
| AltoBeam （芯片） | ATBM6461 | SDIO | Wi-Fi 6 | 803.11b/g/n/ax | 286.8Mbps | √ | √ | × | × | 1T1R | 5.0 | × | ST |  |
| Hisilicon （芯片） | Hi3861L | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | × | × | SS |  |
| Hisilicon （芯片） | Hi3853 | SDIO | Wi-Fi 6 | 802.11b/g/n/ax | 150Mbps | √ | √ | × | × | 1T1R | 5.3 | × | ST |  |
| Ampak （模组） | AP6275 (SYN43752) | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | SS |  |
| Ampak （模组） | AP6611 （SYN43711） | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | ST |  |
| Ampak （模组） | AP6281 (SYN4381) | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| Ampak （模组） | AP6276 (SYN43756E） | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | ST |  |
| Ampak （模组） | AP6398S (SYN43598) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | SS |  |
| Ampak （模组） | AP6256 (SYN43456) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | SS |  |
| Ampak （模组） | AP6203BM (BCM430132) | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | ST |  |
| Ampak （模组） | AP6212 （BCM43438） | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.4 | UART/PCM | SS |  |

### 原文第 3 页

| 厂商 | Wi-Fi 芯片／模组 | Wi-Fi 接口 | Wi-Fi 代际 | IEEE 802.11 标准 | 最高数据速率 | 低功耗 MCU | 2.4GHz 频段 | 5.0GHz 频段 | 6.0GHz 频段 | 天线 | BT 标准 | BT 接口 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ITON （模组） | BW3752-50BX (SYN43752) | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | ST |  |
| ITON （模组） | BW756E-50B2 (SYN43756E) | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | ST |  |
| ITON （模组） | BW3598-50BX (SYN43598) | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 867Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | ST |  |
| ITON （模组） | BW3456-44B1 (SYN43456) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| ITON （模组） | BW0132-44B1 (BCM430132) | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| ITON （模组） | BW436S-44B1 (SYN43436) | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| AzureWave （模组） | AW-XM606 (CYW55513) | SDIO/SPI | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave （模组） | AW-XM650 (CYW55512) | SDIO/SPI | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave （模组） | AW-XM643 (CYW55573) | SDIO/PCIE | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | DS |  |
| AzureWave （模组） | AW-XM612 (CYW55572) | SDIO/PCIE | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | ST |  |
| AzureWave （模组） | AW-XM632 (CYW55571) | SDIO/PCIE | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave （模组） | AW-CM467 (CYW4373) | SDIO/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM/U SB | DS |  |
| AzureWave （模组） | AW-CM572 (CYW54591) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.1 | UART/PCM | DS |  |
| AzureWave （模组） | AW-CM256SM (CYW43455) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave （模组） | AW-AM497 (CYW43012) | SDIO | Wi-Fi 4 | 802.11 b/g/n/ac friendly | 78Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| AzureWave （模组） | AW-NM372SM (CYW43438) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.1 | UART/PCM | DS |  |
| AzureWave （模组） | AW-NM512 (CYW43439) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel （模组） | FCS866R (RTL8852BS-CG) | SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Quectel （模组） | FCE863R (RTL8852BE-VR-CG) | PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Quectel （模组） | FCU760K/FCS960K (AIC8800D80) | USB/SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Quectel （模组） | FCS961K (AIC8800DC) | SDIO | Wi-Fi 6 | 802.11 b/ g/ n/ ax | 286Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel （模组） | FC80A (CYW54591) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.1 | UART/PCM | DS |  |
| Quectel （模组） | FCS850R (RTL8822CS-VS-CG) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| Quectel （模组） | FCS851U (UWE5621) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| Quectel （模组） | FCS950R (RTL8821CS-CG) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 4.2 | UART/PCM | DS |  |
| Quectel （模组） | FC905A (CYW43455) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | DS |  |
| Quectel （模组） | FCS940R (RTL8723DS-CG) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | 5.0 | UART/PCM | DS |  |

### 原文第 4 页

| 厂商 | Wi-Fi 芯片／模组 | Wi-Fi 接口 | Wi-Fi 代际 | IEEE 802.11 标准 | 最高数据速率 | 低功耗 MCU | 2.4GHz 频段 | 5.0GHz 频段 | 6.0GHz 频段 | 天线 | BT 标准 | BT 接口 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Quectel （模组） | FC908A (CYW43438) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.1 | UART/PCM | ST |  |
| Quectel （模组） | FCS945R (RTL8733BS-CG) | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel （模组） | FCU741R (RTL8731BU-CG) | USB | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Quectel （模组） | FC30R (RTL8189EM-VI-CG) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| CVTE （模组） | SKI.WB800DS2.1 (AIC8800D) | SDIO/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 286Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| CVTE （模组） | SKI.WB800D80S.1 (AIC8800D80) | SDIO/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | ST |  |
| Murata （模组） | SP-ZZ1ZC-C (CYW88459) | PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.1 | UART/PCM | ST | 车规 |
| nFore （模组） | NF3205PQ | PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | DS | 车规 |

## 官方资料

[Rockchip Redmine](https://redmine.rock-chips.com/documents/52)

部分 Redmine 资料可能需要授权账号。本版以提供的文档版本为准，不宣称它是最新发行版。

{% endraw %}
