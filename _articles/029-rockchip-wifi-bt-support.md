---
title: "Rockchip Linux Wi-Fi and Bluetooth: Complete Chip and Module Support List"
description: "Full editable component tables, original status definitions and technical notes for ArmSoM hardware selection; board-level validation is required."
translation_key: "029-rockchip-wifi-bt-support"
slug: "029-rockchip-wifi-bt-support"
lang: "en"
date: "2026-10-15"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: ["Sige7", "CM5"]
tags: ["Rockchip", "AVL", "wifi-bt", "hardware"]
keywords: "Rockchip Linux Wi-Fi and Bluetooth: Complete Chip and Module Support List, ArmSoM, BSP"
excerpt: "Full editable component tables, original status definitions and technical notes for ArmSoM hardware selection; board-level validation is required."
---

{% raw %}
# Rockchip Linux Wi-Fi and Bluetooth: Complete Chip and Module Support List

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

This is a platform-level component-selection reference for ArmSoM projects, not a list of interchangeable parts verified on every ArmSoM board. For Sige7 (RK3588) and CM5 (RK3576), consult the exact SoC column, schematic, populated BOM, package, power rails and board revision. Board-level signal integrity and production validation remain necessary. The source does not specify one universal SDK/BSP or kernel version; match your released BSP, boot firmware and drivers, and obey the part-specific notes. No hardware tests were performed for this article; source statuses and examples are not ArmSoM measurements.

The official Sige7 description lists AP6275P. That does not validate every module in this list on Sige7. Match SDIO/PCIe/USB, BT UART/PCM, firmware, driver, antenna design and the exact BSP. SS, ST and DS are different levels of evidence.

Source: `Rockchip_Support_List_Linux_WiFi_BT_Ver2.0_20250619.pdf`, V2.0.

The files supplied in the Chinese and English folders are byte-identical and primarily English. All three editions use the same original figures; there are no separate Chinese-language figures. Cover/legal text and revision history are omitted. Technical footnotes are retained.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Editorial notes](/docs/rockchip-avl-wifi-bt/EDITORIAL-NOTES.md)

## 1. How to read this list

Status symbols describe the source validation scope, not automatic approval for your board. Empty cells remain empty; do not interpret them as support. Part numbers, suffixes, quantities and platform statuses are preserved. EOL means end of life; AUTO and IT are retained as source labels, not newly certified qualifications.

- For other AP/Realtek models, refer to the porting section of the Wi-Fi/BT development documentation.

- For chips or modules from other manufacturers, contact their manufacturer for driver-porting assistance; the Wi-Fi/BT development documentation also describes porting.

- The development guide and support list are available from https://redmine.rock-chips.com/documents/52 .

- BT means Bluetooth; ac denotes Wi-Fi 5 and ax denotes Wi-Fi 6.

- State describes verification status or support mode on the RK platform: SS = SDK Support; ST = Sample Tested; DS = Datasheet Support. DS is not a claim of detailed platform validation.

- Antenna refers to Wi-Fi antennas. Some modules use a separate single BT antenna: Wi-Fi may be 2T2R while Bluetooth is independently 1T1R. Account for this during selection and hardware design.

## Complete compatibility tables

Tables are separated by source page for traceability, not shortened. Scroll horizontally to see every SoC column. Repeated source entries are retained, including conflicting duplicates.

### Source page 1

| Vendor | Wi-Fi chip / module | Wi-Fi interface | Wi-Fi generation | IEEE 802.11 standard | Maximum data rate | Low-power MCU | 2.4GHz band | 5.0GHz band | 6.0GHz band | Antenna | BT standard | BT interface | State | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rockchip | RK960 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.3 | UART/PCM | SS |  |
| Rockchip | RK962 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | 5.3 | UART/PCM | SS |  |
| Rockchip | RK915 | SDIO | Wi-Fi 4 | 802.11b/g/n | 65Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Synaptics (IC) | SYN43756E | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.4 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43711 | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.4 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43752 | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.4 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43598 | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43456 | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43436 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Synaptics (IC) | BCM430132 | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Realtek (IC) | RTL8852C | PCIe/USB | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/USB/PC M | DS |  |
| Realtek (IC) | RTL8852B | SDIO/PCIe/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/USB/PC M | DS |  |
| Realtek (IC) | RTL8832BU | USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | × | × | DS |  |
| Realtek (IC) | RTL8851B | SDIO/PCIe/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/USB/PC M | DS |  |
| Realtek (IC) | RTL8822C | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5 | UART/USB/PC M | SS |  |
| Realtek (IC) | RTL8822E | SDIO/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | SS |  |
| Realtek (IC) | RTL8821C | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 4.2 | UART/USB/PC M | DS |  |
| Realtek (IC) | RTL8812CU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | × | × | DS | EFEM |
| Realtek (IC) | RTL8812EU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | × | × | DS |  |
| Realtek (IC) | RTL8811CU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Realtek (IC) | RTL8192E | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 300Mbps |  | √ | × | × | 2T2R | × | × | DS | EFEM |

### Source page 2

| Vendor | Wi-Fi chip / module | Wi-Fi interface | Wi-Fi generation | IEEE 802.11 standard | Maximum data rate | Low-power MCU | 2.4GHz band | 5.0GHz band | 6.0GHz band | Antenna | BT standard | BT interface | State | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Realtek (IC) | RTL8192F | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 300Mbps |  | √ | × | × | 2T2R | × | × | DS |  |
| Realtek (IC) | RTL8733B | SDIO/USB | Wi-Fi 4 | 802.11 a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Realtek (IC) | RTL8723D | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | 4.2 | UART/USB/PC M | SS |  |
| Realtek (IC) | RTL8731B | SDIO/USB | Wi-Fi 4 | 802.11 a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Realtek (IC) | RTL8189FTV | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Realtek (IC) | RTL8189ES/EM | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| Realtek (IC) | RTL8188FTV | USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Realtek (IC) | RTL8761BTV | × | × | × | × |  | × | × | × | × | 5.0 | UART | ST |  |
| Realtek (IC) | RTL8188EUS-VH | USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS | EFEM |
| Infineon (IC) | CYW55572 | SDIO/PCIe | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.4 | UART/PCM | DS |  |
| Infineon (IC) | CYW55513 | SDIO/SPI | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.4 | UART/PCM | DS |  |
| Infineon (IC) | CYW54591 | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.4 | UART/PCM | DS |  |
| Infineon (IC) | CYW43455 | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | ST |  |
| Infineon (IC) | CYW4373 | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Infineon (IC) | CYW43438 | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| Infineon (IC) | CYW43012 | SDIO/SPI | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Infineon (IC) | CYW43439 | SDIO | Wi-Fi 4 | 802.11 b/g/n | 65Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| AIC (IC) | AIC8800D80 | SDIO/PCIe/USB | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| AIC (IC) | AIC8800D | SDIO/USB | Wi-Fi 6 | 802.11b/g/n/ax | 286.80Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| SeekWave (IC) | EA6621Q | SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | ST |  |
| Unisoc (IC) | UWE5621DS | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| iComm (IC) | SSV6155P | USB | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| iComm (IC) | SV6158 | SDIO | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| iComm (IC) | SV6256 | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| AltoBeam (IC) | ATBM603x | SDIO/USB | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | ST |  |
| AltoBeam (IC) | ATBM6441 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | × | × | ST |  |
| AltoBeam (IC) | ATBM6461 | SDIO | Wi-Fi 6 | 803.11b/g/n/ax | 286.8Mbps | √ | √ | × | × | 1T1R | 5.0 | × | ST |  |
| Hisilicon (IC) | Hi3861L | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | × | × | SS |  |
| Hisilicon (IC) | Hi3853 | SDIO | Wi-Fi 6 | 802.11b/g/n/ax | 150Mbps | √ | √ | × | × | 1T1R | 5.3 | × | ST |  |
| Ampak (Module) | AP6275 (SYN43752) | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | SS |  |
| Ampak (Module) | AP6611 （SYN43711） | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | ST |  |
| Ampak (Module) | AP6281 (SYN4381) | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| Ampak (Module) | AP6276 (SYN43756E） | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | ST |  |
| Ampak (Module) | AP6398S (SYN43598) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | SS |  |
| Ampak (Module) | AP6256 (SYN43456) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | SS |  |
| Ampak (Module) | AP6203BM (BCM430132) | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | ST |  |
| Ampak (Module) | AP6212 （BCM43438） | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.4 | UART/PCM | SS |  |

### Source page 3

| Vendor | Wi-Fi chip / module | Wi-Fi interface | Wi-Fi generation | IEEE 802.11 standard | Maximum data rate | Low-power MCU | 2.4GHz band | 5.0GHz band | 6.0GHz band | Antenna | BT standard | BT interface | State | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ITON (Module) | BW3752-50BX (SYN43752) | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | ST |  |
| ITON (Module) | BW756E-50B2 (SYN43756E) | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | ST |  |
| ITON (Module) | BW3598-50BX (SYN43598) | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 867Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | ST |  |
| ITON (Module) | BW3456-44B1 (SYN43456) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| ITON (Module) | BW0132-44B1 (BCM430132) | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| ITON (Module) | BW436S-44B1 (SYN43436) | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| AzureWave (Module) | AW-XM606 (CYW55513) | SDIO/SPI | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-XM650 (CYW55512) | SDIO/SPI | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-XM643 (CYW55573) | SDIO/PCIE | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-XM612 (CYW55572) | SDIO/PCIE | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | ST |  |
| AzureWave (Module) | AW-XM632 (CYW55571) | SDIO/PCIE | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-CM467 (CYW4373) | SDIO/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM/U SB | DS |  |
| AzureWave (Module) | AW-CM572 (CYW54591) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.1 | UART/PCM | DS |  |
| AzureWave (Module) | AW-CM256SM (CYW43455) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-AM497 (CYW43012) | SDIO | Wi-Fi 4 | 802.11 b/g/n/ac friendly | 78Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| AzureWave (Module) | AW-NM372SM (CYW43438) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.1 | UART/PCM | DS |  |
| AzureWave (Module) | AW-NM512 (CYW43439) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FCS866R (RTL8852BS-CG) | SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FCE863R (RTL8852BE-VR-CG) | PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FCU760K/FCS960K (AIC8800D80) | USB/SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Quectel (Module) | FCS961K (AIC8800DC) | SDIO | Wi-Fi 6 | 802.11 b/ g/ n/ ax | 286Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FC80A (CYW54591) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.1 | UART/PCM | DS |  |
| Quectel (Module) | FCS850R (RTL8822CS-VS-CG) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| Quectel (Module) | FCS851U (UWE5621) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| Quectel (Module) | FCS950R (RTL8821CS-CG) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 4.2 | UART/PCM | DS |  |
| Quectel (Module) | FC905A (CYW43455) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | DS |  |
| Quectel (Module) | FCS940R (RTL8723DS-CG) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | 5.0 | UART/PCM | DS |  |

### Source page 4

| Vendor | Wi-Fi chip / module | Wi-Fi interface | Wi-Fi generation | IEEE 802.11 standard | Maximum data rate | Low-power MCU | 2.4GHz band | 5.0GHz band | 6.0GHz band | Antenna | BT standard | BT interface | State | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Quectel (Module) | FC908A (CYW43438) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.1 | UART/PCM | ST |  |
| Quectel (Module) | FCS945R (RTL8733BS-CG) | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FCU741R (RTL8731BU-CG) | USB | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Quectel (Module) | FC30R (RTL8189EM-VI-CG) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| CVTE (Module) | SKI.WB800DS2.1 (AIC8800D) | SDIO/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 286Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| CVTE (Module) | SKI.WB800D80S.1 (AIC8800D80) | SDIO/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | ST |  |
| Murata (Module) | SP-ZZ1ZC-C (CYW88459) | PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.1 | UART/PCM | ST | AutoMotive |
| nFore (Module) | NF3205PQ | PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | DS | AutoMotive |

## Official references

[Rockchip Redmine](https://redmine.rock-chips.com/documents/52)

Some Redmine resources require an authorized account. This edition is based on the supplied version, not a claim that it is the latest release.

{% endraw %}
