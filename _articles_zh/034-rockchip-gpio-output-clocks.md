---
title: "Rockchip GPIO 输出时钟：引脚映射、DTS 与测试"
description: "Rockchip GPIO 输出时钟的 pinmux、支持频率、DTS 配置及按 SoC 区分的测试参考。"
translation_key: "034-rockchip-gpio-output-clocks"
slug: "034-rockchip-gpio-output-clocks"
lang: "zh"
date: "2026-10-15"
author: "ArmSoM 编辑部 · Rockchip 原厂资料"
category: "hardware"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["Rockchip", "GPIO", "输出时钟", "pinmux", "DTS"]
keywords: "ArmSoM Rockchip 瑞芯微 GPIO 输出时钟 pinmux RK3588 RK3576"
excerpt: "按 SoC 整理 GPIO 输出时钟的引脚映射、DTS 写法与安全验证步骤。"
---

# Rockchip GPIO 输出时钟：引脚映射、DTS 与测试

本文依据《Rockchip Gpio Output Clocks》V1.4.0（2025-04-16）整理，不是 ArmSoM 实测报告。原文覆盖 RK3399、RK1808、RK3328、RK3308、RV1126、PX30、RK3566/3568、RK3588、RK3528、RK3576、RK2118、RV1126B/RV1126B-P。操作前必须确认板卡原理图、连接器走线、IO 电压域、引脚占用、发布 BSP 与目标 SoC TRM；本文没有声称 ArmSoM 板卡已经通过波形、信号完整性或外设兼容性验证。

英文原文件共 29 页，未含可独立提取的技术配图。封面法律/联系信息、读者对象与修订记录已移除。[校对记录](/docs/rockchip-gpio-output-clocks/EDITORIAL-NOTES.md)。

## 1. 使用条件

SoC 可从特定 IO 输出内部时钟以替代外部晶振、降低外围电路成本，但必须同时满足：该 IO 的 IOMUX 支持时钟功能；已配置正确的时钟源和频率；IO 驱动能力与板级链路能得到可接受波形。原文指出，替代 24 MHz 晶振时，直接旁路 SoC 晶振的 24 MHz 信号质量最好；PLL 分频信号质量略差，应按外设参考时钟规范验证。

## 2. 引脚与频率映射

| SoC | 时钟 | GPIO | 原文支持频率 |
|---|---|---|---|
| RK3288/RK3328/PX30/RK3308/RV1108/RV1126/RK3368/RK3399 | `SCLK_TESTOUT` 或对应变体 | 分别为 GPIO0_C1、GPIO1_A6、GPIO1_D6/GPIO0_B5、GPIO0_A4、GPIO0_A6、GPIO1_A4、GPIO0_B0、GPIO2_D1/GPIO0_B0 | 24 MHz、32 kHz |
| RK3566/8 | `CLK_WIFI` | GPIO0_A0 | 24 MHz |
| RK3566/8 | `CLK_MAC0_OUT` / `CLK_MAC1_OUT` | GPIO2_C1 / GPIO3_B0 或 GPIO4_B3 | 24/25/50/125 MHz |
| RK3566/8 | `CLK_CIF_OUT` / `CLK_CAM0_OUT` | GPIO4_C0 / GPIO4_A7 | 24/27/37.125 MHz |
| RK3588 | `REFCLKOUT` / `CLK_GMAC_50M` / `REFCLK25M_ETH0/1` | GPIO0_A0 / GPIO4_C3 / GPIO4_B0、GPIO3_A6 | 24 MHz / 50、125 MHz / 25、50 MHz |
| RK3588 | `CLK_MIPI_CAMARAOUT_M0..M4`、`CLK_CIF_OUT` | GPIO4_B1、GPIO1_B6/B7/D6/D7、GPIO4_B4 | 24/27/37.125 MHz |
| RK3528 | `CLK_REFOUT` / `CLK_DEEPSLOW` / `CLK_TESTOUT` | GPIO0_A1/GPIO3_C3；GPIO3_C3/GPIO1_C3；GPIO2_A5 | 24 MHz / 32 kHz / 按实际配置 |
| RK3576 | `REF_CLK0/1/2_OUT` | GPIO0_A0/B4/B5 | 12/24/27/37.125 MHz |
| RK3576 | `ETH_CLK0/1_25M_OUT` | GPIO3_A4/GPIO2_D7；GPIO2_D6/GPIO1_D5 | 25/27/50/125 MHz |
| RK3576 | `VI_CIF_CLKOUT`、`CAM_CLK0/1/2_OUT`、`UFS_REFCLK` | GPIO3_A2；对应 M0/M1 引脚；GPIO4_D1 | 24/27/37.125；24/25/26/27/37.125/50；24/26 MHz |
| RK2118 | `REF_CLK0/1_OUT`、`ETH_CLK_25M_OUT`、`OSC_CLK_OUT`、`CLK_32K` | GPIO3_B1/GPIO0_A3、GPIO0_A2、GPIO0_B3、GPIO0_A4 | 24/24.576/40/49.152/50；25/50 MHz；晶振旁路；32 kHz |
| RV1126B/P | SAI MCLK、CAM、VI、ETH、32K、REFOUT | 见目标 SoC pinctrl | 12.288/24/24.576/49.152 MHz；或 24/25/26/27/37.125/50 MHz |

同一个物理 pad 可能出现在多个选择中，实际只能由 pinmux、封装与板级走线选择其中一个功能，不能同时开启。

## 3. DTS 基本写法

```dts
pinctrl-names = "default";
pinctrl-0 = <&test_clkout>;
assigned-clocks = <&cru SCLK_TESTOUT>;
assigned-clock-parents = <&xin24m>;
assigned-clock-rates = <24000000>;
clocks = <&cru SCLK_TESTOUT>;
clock-names = "soc_24M";
```

实际 ID 会按 SoC 改为 `SCLK_TEST_OUT`、`SCLK_TESTCLKOUT1/2`、`CLK_WIFI`、`CLK_CIFOUT_OUT` 或相机/以太网输出。pinctrl 组也必须取目标板的定义。RK3528 特别说明：`CLK_TESTOUT` 当前只保留给内部自测；`CLK_REFOUT` 固定 24 MHz、只能开关；`CLK_DEEPSLOW` 固定 32 kHz、不能开关或改频率，因此只需配置 pinctrl。

## 4. 运行时测试范例

以下均为原文的 SoC 专用范例，只能在开发镜像、确认节点和 pinmux 后使用：

```sh
# RK3399：24 MHz testout1，经 GPIO2_D1 输出
echo 24000000 > /sys/kernel/debug/clk/clk_testout1_pll_src/clk_rate
echo 24000000 > /sys/kernel/debug/clk/clk_testout1/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_testout1/clk_enable_count
io -4 0xff77e004 0x000c0008

# RK3566/8：MAC0 25 MHz
echo 25000000 > /sys/kernel/debug/clk/clk_mac0_out/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_mac0_out/clk_enable_count
io -4 0xfdc60048 0x00070003

# RK3588：GMAC 50 MHz
echo 50000000 > /sys/kernel/debug/clk/clk_gmac_50m/clk_rate
echo 1 > /sys/kernel/debug/clk/clk_gmac_50m/clk_prepare_enable
io -4 0xfd5f8090 0xf0001000

# RK3576：GMAC0 50 MHz 参考输出
echo 50000000 > /sys/kernel/debug/clk/refclko25m_gmac0_out/clk_rate
echo 1 > /sys/kernel/debug/clk/refclko25m_gmac0_out/clk_prepare_enable
io -4 0x26044064 0x000f0003
```

RK3288、RK3328、PX30、RK3308、RV110X、RV1126、RK3368、RK3528、RK2118 与 RV1126B/P 的完整 `io -4` 序列只适用于各自 CRU/GRF 和写掩码，不能跨 SoC 复制。原文软件实现需要同时增加 binding ID、父时钟数组、`GATE`/`MUX`/`COMPOSITE` 分支并在 DTS 引用。

## 5. 验证清单

1. 确认引脚已物理引出，未被启动、调试或存储功能占用，且 IO 电压域匹配。
2. 确认 pinctrl 选择的是时钟功能，不是同名 GPIO 功能。
3. 在 `clk_summary` 核对 parent、频率和 enable 状态。
4. 在外设端测频率、占空比、幅度和启动过程，不能只在 SoC 侧测量。
5. 对以太网、音频等敏感外设完成时钟锁定、负载、挂起/恢复测试。
