---
title: "Rockchip PLL 展频：EMI、SSMOD 与 SSCG 指南"
description: "Rockchip PLL 展频时钟配置参考：参数、寄存器示例、U-Boot/内核修改、抖动和稳定性边界。"
translation_key: "035-rockchip-pll-spread-spectrum"
slug: "035-rockchip-pll-spread-spectrum"
lang: "zh"
date: "2026-10-15"
author: "ArmSoM 编辑部 · Rockchip 源文档"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["PLL", "SSCG", "SSMOD", "EMI", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip PLL 展频 SSCG SSMOD EMI RK3588 RK3576"
excerpt: "Rockchip PLL 展频时钟的参数、寄存器和风险完整参考。"
---

{% raw %}
# Rockchip PLL 展频：EMI、SSMOD 与 SSCG 指南

本文是源文档的平台级参考，不是 ArmSoM 验证报告。它可作为采用受支持 SoC 的板卡适配入口，包括 Sige7/AIM7（RK3588）与 Sige5/CM5/AIM5（RK3576）；写寄存器前必须核对准确 CRU 寄存器表、PLL 父时钟树、下游使用者以及已发布 boot firmware/kernel。未进行 ArmSoM EMI、抖动、稳定性或认证实测。

技术基准为《Rockchip PLL Frequency Spreading Function Detailed Explanation》V1.8.0，2025-04-16。中文 13 页、英文 12 页，页数差异来自英文单列修订记录。中文第 6–7 页、英文第 5–6 页含对应原图。已移除封面/法律声明、读者对象和修订记录。[校对记录](/docs/rockchip-pll-ssmod-clock/EDITORIAL-NOTES.md)。

## 1. 展频概念

时钟边沿通常是系统最高频信号，也是 EMI 常见来源。SSCG/SSG 通过调制时钟频率，将原本集中在窄频段的能量分散，从而降低基频和奇次谐波峰值。同步的数据、地址和控制信号也会随时钟调制，所以它是系统级方案。

![原图：SSG 工作原理](/docs/rockchip-pll-ssmod-clock/assets/Rockchip_Developer_Guide_Pll_Ssmod_Clock_CN-p6-X194.png)

- **调制速率**：输出频率在设定范围内变化的速度；应远低于源时钟以避免建立/保持时间问题，并高于 20 Hz–20 kHz 可听频段。源文建议通常选择 30–120 kHz。
- **调制深度**：输出频率偏离源频率的百分比；深度越大通常 EMI 峰值越低，但必须不超过系统容许范围。

![原图：不同调制深度的 EMI 峰值对比](/docs/rockchip-pll-ssmod-clock/assets/Rockchip_Developer_Guide_Pll_Ssmod_Clock_CN-p7-X203.png)

## 2. PLL 参数配置

### 2.1 通用 PLL（RK3588 以外）

1. 设置 `dsmpd = 0`，使 PLL 进入小数模式；没有小数模式的 PLL 不支持展频。
2. 设置 `ssmod_reset = 0`、`ssmod_disable_sscg = 0`、`ssmod_bp = 0`。
3. 设置 `ssmod_spread = n`，`n = 0…0x1f`，表示 `0.n%` 振幅。
4. 设置 `ssmod_divval = n`，`n = 0…0xf`。

```text
展频速率（Hz）= 24000000 / refdiv / 128 / n
```

`refdiv` 是 PLL 参数，源文通常取 1，仍须查目标 TRM。只有 RK3399 需要外部向量表：`ssmod_sel_ext_wave = 1`、`ssmod_ext_maxaddr = 0xff`。

### 2.2 RK3588 PLL

设置 `sscg_en = 1` 开启 dithered mode（0 关闭）；`mrr = 0…63` 配置振幅，`MR = mfr*mrr/m/32`；`mfr = 0…255` 配置速率，`MF = Fin/p/mfr/32`。`sel_pf`：0 为 down spread、1 为 up spread、1x 为 center spread；源文基于抖动通常建议 center spread。

## 3. 寄存器示例

以下是原文命令，不是通用安全配方；地址、PLL 目标与位编码均与 SoC 绑定。

```sh
# RK3399 GPLL
io -4 0xff760094 0x00010001
io -4 0xff760090 0x1f000100
io -4 0xff760090 0x00f000f0
io -4 0xff760094 0xff00ff00
io -4 0xff76008c 0x00080000
io -4 0xff760090 0x00070000

# RK356X GPLL
io -4 0xfdd2004c 0x1f000800
io -4 0xfdd2004c 0x00f00060
io -4 0xfdd20044 0x10000000
io -4 0xfdd2004c 0x00070000

# RK3588 GPLL
io -4 0xfd7c01cc 0x00ff000c
io -4 0xfd7c01cc 0x3f000500
io -4 0xfd7c01cc 0xc0008000
io -4 0xfd7c01d0 0x00010001

# RK3576 GPLL
io -4 0x272001cc 0x00ff000c
io -4 0x272001cc 0x3f000500
io -4 0x272001cc 0xc0008000
io -4 0x272001d0 0x00010001
```

源文还给出 RK3328、PX30、RK3308、RV1126、RK1808、RK3528、RK3562、RK2118、RV1103B、RK3506、RV1126B/RV1126B-P 对应的一般 PLL 示例，遵循“振幅、速率、小数模式、启用”的顺序，但必须使用目标 TRM 的完整地址和值。RK3036、RK312X、RK322X、RK3188、RK3288、RK3368 不支持该功能。建议展频速率 30 kHz；没有通用振幅值，必须实验室测量并以 EMI 认证为准。

## 4. 固化配置

参数确定后尽早配置。原文给出 RK3399 在 U-Boot `drivers/clk/rockchip/clk_rk3399.c` 与内核 `drivers/clk/rockchip/clk-rk3399.c` 的写入实例。若对 DDR/DPLL 展频，应在 LOADER 中处理；在其他位置处理 DDR 时钟可能引起系统不稳定或崩溃。

```c
writel(0x1f001f00, &priv->cru->dpll_con[4]);
writel(0x00f00060, &priv->cru->dpll_con[4]);
writel(0x7f002700, &priv->cru->dpll_con[5]);
writel(0x00080000, &priv->cru->dpll_con[3]);
writel(0x00070000, &priv->cru->dpll_con[4]);
writel(0x00010001, &priv->cru->dpll_con[5]);
```

## 5. 工程边界与验证

以太网、CAN 等对时钟精度敏感的应用不适合随意展频。展频会引入抖动，可能造成建立/保持时间问题、误码率升高或 PLL 丢锁；原文估计附加周期抖动小于约 0.05%，但这不是板级保证。启用 PLL SSC 会影响该 PLL 下的所有自时钟；如 eMMC、SDIO 共用 PLL 而 EMI 需求不同，必须共同验证。DDR、USB、SDIO、I2C、SPI、I2S、USB3.0、PCIe、eDP 可能有各自 SSC 规范。仅在确有需要时开启，以满足 EMI 的最小深度为原则；USB2.0 等可能在开启后频率测试失败，实际结果必须逐项目进行稳定性与兼容性测试。
{% endraw %}
