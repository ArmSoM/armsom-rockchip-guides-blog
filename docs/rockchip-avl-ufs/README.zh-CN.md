# Rockchip UFS 认可器件清单：RK3576 选型参考

本文是 ArmSoM 项目的平台级器件选型参考，不是所有板卡通用、已验证可直接替换的物料表。Sige7（RK3588）、CM5（RK3576）等项目需逐项核对对应 SoC 列、原理图、实际 BOM、封装、电源和板卡版本，完成板级信号完整性及量产验证。原文未指定统一适用的 SDK/BSP 或内核版本，需匹配实际发行 BSP、启动固件与驱动，并遵循料号对应的技术注释。本次没有硬件测试，原文状态与示例不代表 ArmSoM 实测。

本 UFS 清单仅有 RK3576 平台列。CM5 使用 RK3576，但官方板载存储说明为 eMMC；此表不能证明 CM5 已引出可用 UFS 接口，也不证明 RK3588 板卡支持这些 UFS 器件。仅作为定制 RK3576 硬件参考，需先核实原理图和 BSP 支持。

来源: `Rockchip_UFS_Approved_Vendor_List_Ver1.04.pdf`, V1.04.

提供的中英文目录同名文件字节一致，内容主要为英文。三语使用同一套原图，没有独立中文原图。已移除封面声明及修订记录，保留技术脚注。

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [校对记录](/docs/rockchip-avl-ufs/EDITORIAL-NOTES.md)

## 1. 阅读说明

状态符号描述原文验证范围，不代表你的板卡自动通过验证。空白保持为空，不能理解为支持。料号、后缀、数量及平台状态按原文保留。EOL 表示生命周期结束；AUTO、IT 保留为原文标签，不代表本次新增认证。

| 符号 | 本文档中的含义 |
| --- | --- |
| √ | 已完成充分测试，适用且已量产。 |
| T/A | 已完成充分测试，适用且具备量产条件。 |
| S/A | 样品通过可靠性测试；量产前仍需平台兼容性测试。 |
| D/A | 按数据手册判断适用，仍需样品测试。 |
| N/A | 不适用。 |

## 完整兼容性表格

表格按原始页码分组以便追溯，没有缩减平台列；可横向滚动查看全部 SoC。原文重复条目保留，包括状态不一致的重复项。

### 原文第 4 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KIOXIA | THGJFGT2T85BAB5 | 512Gb TLC x 8 | 512GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGT1T45BAB8 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGT0T25BAB8 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGG9T15BAB8 | 512Gb TLC x 1 | 64GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGT1E45BAIL | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -25/85 | T/A |  |
| KIOXIA | THGJFGT2T85BAIR | 512Gb TLC x 8 | 512GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -25/85 | T/A |  |

### 原文第 5 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
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

### 原文第 6 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
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

### 原文第 7 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WD | SDINFDQ6-256G-ZA | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -45/85 | T/A | AUTO |

### 原文第 8 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
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

### 原文第 9 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BIWIN | BWU3AKC26C128G | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| BIWIN | BWU3AKC46C256G | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| BIWIN | BWU2A0526B128G | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| BIWIN | BWU2A0516B064G | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### 原文第 10 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FORESEE | FEUDME064G-B8A19 | 512Gb TLC x 1 | 64GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| FORESEE | FEUDME128G-B8A19 | 512Gb TLC x 2 | 128GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| FORESEE | FEUDME256G-C8H09 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 |  | -40/105 | T/A | AUTO |
| FORESEE | FEUDNN064G-C2G07 | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| FORESEE | FEUDNN128G-C2G07 | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| FORESEE | FEUDNN256G-C2G07 | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| FORESEE | FEUDNN512G-C2G07 | 512Gb TLC x 8 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### 原文第 11 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HOSIN | HBE3-1280CHAA | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### 原文第 12 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kingston | UFS256-CY14 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| Kingston | UFS128-CY14 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| Kingston | UFS256-TY7B | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| Kingston | UFS128-TY7B | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### 原文第 13 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PHISON | PSUF22H17-B064SS | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| PHISON | PSUF22H17-B128SS | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| PHISON | PSUF22H17-B256SS | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### 原文第 14 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SMI | SM671PBD-C8V | 1Tb TLC x 1 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SMI | SM671PBE-C8V | 1Tb TLC x 2 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SMI | SM671PBF-C8V | 1Tb TLC x 4 | 512GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |

### 原文第 15 页

| 厂商 | 料号 | 器件容量（bits） | 字节容量 | 工艺 | 版本 | VCC （V） | VCCQ （V） | VCCQ2 （V） | 温度（°C） | RK3576 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rayson | RS80A64G4M05B | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

## 官方资料

[Rockchip Redmine](https://redmine.rock-chips.com/documents/50)

部分 Redmine 资料可能需要授权账号。本版以提供的文档版本为准，不宣称它是最新发行版。
