---
title: "Rockchip UFS Approved Vendor List: RK3576 Device Selection Reference"
description: "Full editable component tables, original status definitions and technical notes for ArmSoM hardware selection; board-level validation is required."
translation_key: "030-rockchip-ufs-avl"
slug: "030-rockchip-ufs-avl"
lang: "en"
date: "2026-10-15"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["Rockchip", "AVL", "ufs", "hardware"]
keywords: "Rockchip UFS Approved Vendor List: RK3576 Device Selection Reference, ArmSoM, BSP"
excerpt: "Full editable component tables, original status definitions and technical notes for ArmSoM hardware selection; board-level validation is required."
---

{% raw %}
# Rockchip UFS Approved Vendor List: RK3576 Device Selection Reference

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

This is a platform-level component-selection reference for ArmSoM projects, not a list of interchangeable parts verified on every ArmSoM board. For Sige7 (RK3588) and CM5 (RK3576), consult the exact SoC column, schematic, populated BOM, package, power rails and board revision. Board-level signal integrity and production validation remain necessary. The source does not specify one universal SDK/BSP or kernel version; match your released BSP, boot firmware and drivers, and obey the part-specific notes. No hardware tests were performed for this article; source statuses and examples are not ArmSoM measurements.

This UFS list contains an RK3576 column only. CM5 uses RK3576, but its documented onboard storage is eMMC; the list does not establish a usable UFS interface on CM5 or UFS support on RK3588 boards. Treat it as a reference for custom RK3576 hardware until the schematic and BSP support are verified.

Source: `Rockchip_UFS_Approved_Vendor_List_Ver1.04.pdf`, V1.04.

The files supplied in the Chinese and English folders are byte-identical and primarily English. All three editions use the same original figures; there are no separate Chinese-language figures. Cover/legal text and revision history are omitted. Technical footnotes are retained.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Editorial notes](/docs/rockchip-avl-ufs/EDITORIAL-NOTES.md)

## 1. How to read this list

Status symbols describe the source validation scope, not automatic approval for your board. Empty cells remain empty; do not interpret them as support. Part numbers, suffixes, quantities and platform statuses are preserved. EOL means end of life; AUTO and IT are retained as source labels, not newly certified qualifications.

| Symbol | Meaning in this document |
| --- | --- |
| √ | Fully tested, applicable and in mass production. |
| T/A | Fully tested, applicable and ready for mass production. |
| S/A | Samples passed reliability testing; platform compatibility testing is still required before mass production. |
| D/A | Applicable according to the datasheet; samples still need testing. |
| N/A | Not applicable. |

## Complete compatibility tables

Tables are separated by source page for traceability, not shortened. Scroll horizontally to see every SoC column. Repeated source entries are retained, including conflicting duplicates.

### Source page 4

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KIOXIA | THGJFGT2T85BAB5 | 512Gb TLC x 8 | 512GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGT1T45BAB8 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGT0T25BAB8 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGG9T15BAB8 | 512Gb TLC x 1 | 64GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGT1E45BAIL | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -25/85 | T/A |  |
| KIOXIA | THGJFGT2T85BAIR | 512Gb TLC x 8 | 512GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -25/85 | T/A |  |

### Source page 5

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MICRON | MTFC64GAZAOTD-AIT | 256Gb TLC x 2 | 64GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| MICRON | MTFC128GAZAOTD-AIT | 256Gb TLC x 4 | 128GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| MICRON | MTFC256GAZAOTD-AIT | 256Gb TLC x 8 | 256GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| MICRON | MTFC128GBCAVHF-WT | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| MICRON | MTFC128GBCAVTC-AAT | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| MICRON | MTFC256GBCAVTC-AAT | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| MICRON | MTFC256GBEAXHF-WT | 512Gb TLC x 4 | 256GB | 3D | 4.0 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| MICRON | MTFC128GBCAYAL-AAT | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| MICRON | MTFC256GBCAYAL-AAT | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |

### Source page 6

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SAMSUNG | KLUDG4UHGC-B0E1 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| SAMSUNG | KLUCG2U1DC-B0F1 | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| SAMSUNG | KLUDG2R1DE-B0F1 | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| SAMSUNG | KLUEG4R1DE-B0F1 | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| SAMSUNG | KLUCG4J1ZD-C0CQ | 128Gb MLC x 4 | 64GB | 2D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| SAMSUNG | KLUDG8J1ZD-C0CQ | 128Gb MLC x 8 | 128GB | 2D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| SAMSUNG | KLUDG4UHYB-B0EQ | 256Gb TLC x 4 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SAMSUNG | KLUEG8UHYB-B0EQ | 256Gb TLC 8 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SAMSUNG | KLUCG1R1JF-C0F1 | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| SAMSUNG | KLUDG2R1JF-C0F1 | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| SAMSUNG | KLUEG2N1JB-C0F1 | 1Tb TLC x 2 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| SAMSUNG | KLUFG4N1JB-C0F1 | 1Tb TLC x 4 | 512GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| SAMSUNG | KLUDG2R1VF-B0FQ | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A | AUTO |
| SAMSUNG | KLUCG1R1VF-B0FQ | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A | AUTO |
| SAMSUNG | KLUBG1R1VF-B0FQ | 512Gb TLC x 1 | 32GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A | AUTO |

### Source page 7

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WD | SDINFDQ6-256G-ZA | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -45/85 | T/A | AUTO |

### Source page 8

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| YMTC | YMUS8B4TF1D1C1 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | D/A |  |
| YMTC | YMUS9B4TF2D1C1 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| YMTC | YMUSAB4TF3D1C1 | 512Gb TLC x 8 | 512GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| YMTC | YMUS7B2TE1A2C1 | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| YMTC | YMUS8B2TE2A2C1 | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| YMTC | YMUS9B2TE3A2C1 | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| YMTC | YMUS8B5TH1A1C1 | 1Tb TLC x 1 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| YMTC | YMUS9B5TH2A1C1 | 1Tb TLC x 2 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| YMTC | YMUSAB5TH3A1C1 | 1Tb TLC x 4 | 512GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Source page 9

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BIWIN | BWU3AKC26C128G | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| BIWIN | BWU3AKC46C256G | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| BIWIN | BWU2A0526B128G | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| BIWIN | BWU2A0516B064G | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Source page 10

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FORESEE | FEUDME064G-B8A19 | 512Gb TLC x 1 | 64GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| FORESEE | FEUDME128G-B8A19 | 512Gb TLC x 2 | 128GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| FORESEE | FEUDME256G-C8H09 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 |  | -40/105 | T/A | AUTO |
| FORESEE | FEUDNN064G-C2G07 | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| FORESEE | FEUDNN128G-C2G07 | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| FORESEE | FEUDNN256G-C2G07 | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| FORESEE | FEUDNN512G-C2G07 | 512Gb TLC x 8 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Source page 11

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HOSIN | HBE3-1280CHAA | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Source page 12

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kingston | UFS256-CY14 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| Kingston | UFS128-CY14 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| Kingston | UFS256-TY7B | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| Kingston | UFS128-TY7B | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Source page 13

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PHISON | PSUF22H17-B064SS | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| PHISON | PSUF22H17-B128SS | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| PHISON | PSUF22H17-B256SS | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Source page 14

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SMI | SM671PBD-C8V | 1Tb TLC x 1 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SMI | SM671PBE-C8V | 1Tb TLC x 2 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SMI | SM671PBF-C8V | 1Tb TLC x 4 | 512GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |

### Source page 15

| Manufacturer | Part number | Device size (bits) | Byte size | Process | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperature (°C) | RK3576 | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rayson | RS80A64G4M05B | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

## Official references

[Rockchip Redmine](https://redmine.rock-chips.com/documents/50)

Some Redmine resources require an authorized account. This edition is based on the supplied version, not a claim that it is the latest release.

{% endraw %}
