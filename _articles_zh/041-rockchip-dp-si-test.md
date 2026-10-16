---
title: "Rockchip DP 信号测试：RK3576/RK3588 USBDP PHY 寄存器与调优"
description: "完整整理 DP PHY 幅值、均衡、转换速率、SSC 与 AUX 调整以及驱动配置，保留原始寄存器表和待核对问题。"
translation_key: "041-rockchip-dp-si-test"
slug: "041-rockchip-dp-si-test"
lang: "zh"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: ["Sige5", "Sige7"]
tags: ["Rockchip", "DisplayPort", "RK3576", "RK3588", "USBDP PHY"]
keywords: "ArmSoM Rockchip 瑞芯微 RK3576 RK3588 DP PHY SSC AUX 信号测试"
excerpt: "完整整理 DP PHY 幅值、均衡、转换速率、SSC 与 AUX 调整以及驱动配置，保留原始寄存器表和待核对问题。"
---

# Rockchip DP 信号测试：RK3576/RK3588 USBDP PHY 寄存器与调优

本文依据《Rockchip DP 信号测试指南》V1.0.0（RK-KF-YF-C13）完整整理。原稿适用 RK3576/RK3588、Linux 5.10/6.1 的 Rockchip BSP。ArmSoM [Sige5](https://docs.armsom.org/armsom-sige5) 和 [Sige7](https://docs.armsom.org/armsom-sige7) 的官方资料分别确认使用 RK3576、RK3588；本文仍是平台参考，使用前须核对具体板卡走线、PHY 实例、DP/Type-C 接口、SDK/BSP 提交、内核及驱动版本。未进行 ArmSoM 硬件验证。

仅提供中文 PDF，共 13 页；英文和俄文据中文全文翻译。原稿没有独立技术配图，所有寄存器表均恢复为可编辑表格，没有虚构英文原图。已去除指定封面声明、联系信息、读者对象及修订记录，保留技术版本和全部正文。

**先核对，再操作：** 下列 `io -4` 是原文直接写硬件寄存器的示例，不是适用于所有板卡的一键配置。原稿含缺少空格的命令、位宽/偏移/表头矛盾，本文保留可追溯原文，不应直接复制执行这些有疑点的行。先阅读文末校对说明并对照 TRM/BSP 核实。

## 1. DP PHY 简介

RK3576 和 RK3588 的 DP PHY 是 DP 与 USB 共用的 USBDP PHY。本文介绍它作为 DP 使用时的信号指标调整方法。各 PHY 基地址如下；配置寄存器时，地址为对应 PHY 基地址加寄存器偏移。

<!-- Source PDF page 4 -->

| USBDP PHY | USBDP PHY 基地址 |
|---|---|
| RK3588 USBDP PHY0 | 0xfed88000 |
| RK3588 USBDP PHY1 | 0xfed98000 |
| RK3576 USBDP PHY | 0x2b018000 |

## 2. DP 信号调优

原文 IO 命令以 RK3588 PHY0 的 Lane0 为例。调整其它 Lane 需更改偏移；调整 RK3588 PHY1 或 RK3576 PHY 需更改基地址（原文此处写作 RK3756，见校对说明）。一个寄存器通常复用多个功能；组合调整前先读取原值，再根据待调整位做或操作后写回，否则会覆盖先前的设置。

### 2.1 DP 幅值控制

#### 2.1.1 DP TX driver main-tap level

调节电压时，原文建议优先调整此寄存器。寄存器偏移如下，bit5 为使能位，默认值为 `0x0f`。

```text
lane0: 0x0810[5:0]
lane1: 0x1010[5:0]
lane2: 0x1810[5:0]
lane3: 0x2010[5:0]
```

调整范围和命令如下，仅用于 Lane0；例如 Lane1 地址为 `0xfed89010`（`0xfed88810 + 0x800`）。

<!-- Source PDF page 5 -->

| 幅值 | 命令 [ reg offset 0x0810, bit 5:0] |
|---|---|
| 4'b1010 : 1200mv (max) | io -4 0xfed88810 0x2a |
| 4'b1001: | io -4 0xfed88810 0x29 |
| 4'b1000: | io -4 0xfed888100x28 |
| 4'b0111: | io -4 0xfed88810 0x27 |
| 4'b0110 : | io -4 0xfed88810 0x26 |
| 4'b0101: | io -4 0xfed88810 0x25 |
| 4'b0100: | io -4 0xfed88810 0x24 |
| 4'b0011: | io -4 0xfed88810 0x23 |
| 4'b0010 : | io -4 0xfed88810 0x22 |
| 4'b0001: | io -4 0xfed88810 0x21 |
| 4'b0000: 400mv (min) | io -4 0xfed88810 0x20 |

#### 2.1.2 DP TX PMOS 电流控制

调压无法满足要求时，再调整电流寄存器。使能位为 bit[1:0]，默认值为 `{0x1, 0xe7}`。下表列出调整范围。

```text
lane0: enable: 0x0818[1:0]; control: 0x081c[7:5]={3'b000 ~ 3'b111}
lane1: enable: 0x1018[1:0]; control: 0x101c[7:5]
lane2: enable: 0x1818[1:0]; control: 0x181c[7:5]
lane3: enable: 0x2018[1:0]; control: 0x201c[7:5]
```

<!-- Source PDF page 6 -->

| 幅值 | 命令 [ reg offset 0x081c, bit 7:5] |
|---|---|
| 3'b111: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0xe5 |
| 3'b110: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0xc5 |
| 3'b101: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0xa5 |
| 3'b100: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x85 |
| 3'b011 : | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x65 |
| 3'b010 : | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x45 |
| 4'b001: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x25 |
| 4'b000: | io -4 0xfed88818 0x03<br>io -4 0xfed8881c 0x05 |

### 2.2 DP 均衡

#### 2.2.1 DP TX 去加重

寄存器偏移如下；bit4 为使能位，默认值 `0x0`，即 0 dB。调整级别及原文建议见表。

```text
lane0: 0x0814[4:0]
lane1: 0x1014[4:0]
lane2: 0x1814[4:0]
lane3: 0x2014[4:0]
```

<!-- Source PDF page 6 -->

| 级别 | 命令 [ reg offset 0x0814, bit 4:0] |
|---|---|
| 5'b10000: 0 dB | io -4 0xfed88814 0x10 |
| 5'b11011: -5 dB (原文建议用于超过 5 Gbps) | io -4 0xfed88814 0x1b |
| 5'b10101: -2.8 dB (原文建议用于超过 10 Gbps) | io -4 0xfed88814 0x15 |
| 5'b11001: -6.9 dB (原文不建议使用) | io -4 0xfed88814 0x19 |

#### 2.2.2 DP TX 预冲电平

bit6 为使能位，默认值 `0x0`。此寄存器与 TX PMOS 电流控制共用。下表命令用于 Lane0；其它 Lane 需更改偏移，例如 Lane1 地址 `0xfed89018`（`0xfed88818 + 0x800`）。

```text
lane0: 0x0818[6:2]
lane1: 0x1018[6:2]
lane2: 0x1818[6:2]
lane3: 0x2018[6:2]
```

<!-- Source PDF page 7 -->

| 级别 | 命令 [ reg offset 0x0818, bit 6:2] |
|---|---|
| 5'b1000000: 0 dB (默认, 原文建议用于超过 5 Gbps) | io -4 0xfed88818 0x40 |
| 5'b1011000: -1.6 dB (原文建议用于超过 10 Gbps) | io -4 0xfed88818 0x58 |
| 5'b11001: -6.9 dB (原文不建议使用) | io -4 0xfed88818 0x64 |

### 2.3 DP TX 转换速率

#### 2.3.1 加快转换速率

默认值为 `{0xe7, 0x60}`。下列为使能和驱动强度的寄存器偏移。

```text
lane0: enable: 0x081c[1:0]={2'b11}; strength: 0x0820[5:3]={3'b111 ~ 3'b000}
lane1: enable: 0x101c[1:0]; strength: 0x1020[5:3]
lane2: enable: 0x181c[1:0]; strength: 0x1820[5:3]
lane3: enable: 0x201c[1:0]; strength: 0x2020[5:3]
```

以下调整范围和 IO 命令用于 Lane0，其它 Lane 需更改偏移，例如 Lane1 地址为 `0xfed8901c`（`0xfed8881c + 0x800`）。

<!-- Source PDF page 8 -->

| 幅值 | 命令 [ reg offset 0x081c, bit 7:5] |
|---|---|
| 3'b111: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x78 |
| 3'b110: | io -4 0xfed8881c 0xe7<br>io -4 0xfed888200x70 |
| 3'b101: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x68 |
| 3'b100: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x60 |
| 3'b011 : | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x58 |
| 3'b010 : | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x50 |
| 4'b001: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x48 |
| 4'b000: | io -4 0xfed8881c 0xe7<br>io -4 0xfed88820 0x40 |

#### 2.3.2 减慢转换速率

默认值为 `{0xe7, 0x60}`。下列为使能和驱动强度的寄存器偏移。

```text
lane0: enable: 0x081c[1:0]={2'b10}; strength: 0x0820[5:3]={3'b111 ~ 3'b000}
lane1: enable: 0x101c[1:0]; strength: 0x1020[5:3]
lane2: enable: 0x181c[1:0]; strength: 0x1820[5:3]
lane3: enable: 0x201c[1:0]; strength: 0x2020[5:3]
```

以下调整范围和 IO 命令用于 Lane0，其它 Lane 需更改偏移，例如 Lane1 地址为 `0xfed8901c`（`0xfed8881c + 0x800`）。

注意：此寄存器与 TX PMOS 电流控制共用。

<!-- Source PDF page 9 -->

| 幅值 | 命令 [ reg offset 0x081c, bit 7:5] |
|---|---|
| 3'b111: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x78 |
| 3'b110: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x70 |
| 3'b101: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x68 |
| 3'b100: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x60 |
| 3'b011 : | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x58 |
| 3'b010 : | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x50 |
| 4'b001: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x48 |
| 4'b000: | io -4 0xfed8881c 0xe6<br>io -4 0xfed88820 0x40 |

### 2.4 DP TX SSC 控制

#### 2.4.1 PLL SSC 调制偏差

默认值为 `0x19`；各速率的调整偏移和范围如下。

```text
RBR: 0x03F0[5:0]
HBR: 0x03F4[5:0]
HBR2: 0x03F8[5:0]
HBR3: 0x03FC[5:0]
```

<!-- Source PDF page 9 -->

| 级别 | 命令 [ reg offset 0x03F0, bit5:0] |
|---|---|
| 6'b000000: | io -4 0xfed883f0 0x00 |
| 6'b000001: | io -4 0xfed883f0 0x01 |
| ... | ... |
| 4'b111110: | io -4 0xfed883f0 0x3e |
| 4'b111111: | io -4 0xfed883f0 0x3f |

#### 2.4.2 PLL SSC 调制频率

默认值为 `0x0f`，HBR3 默认值为 `0x3c`。HBR3 需要左移两位。原文偏移列表与命令表不同，下面均按原文保留，使用前务必核对。

```text
RBR: 0x0404[4:0]
HBR: 0x0408[4:0]
HBR2: 0x040c[4:0]
HBR3: 0x0410[6:2] (default=0x3c)
```

<!-- Source PDF page 10 -->

| 级别 | 命令 [ reg offset 0x0400, bit4:0] |
|---|---|
| 5'b00000: | io -4 0xfed88400 0x00 (HBR3：io -4 0xfed88410 0x00) |
| 5'b00001: | io -4 0xfed88400 0x01 (HBR3：io -4 0xfed88410 0x04) |
| ... | ... |
| 5'b11110: | io -4 0xfed88400 0x1e (HBR3：io -4 0xfed88410 0x38) |
| 5'b11111: | io -4 0xfed88400 0x1f (HBR3：io -4 0xfed88410 0x3c) |

### 2.5 DP TX AUX 幅值控制

默认值为 `0x36`，调整范围如下。

```text
aux swing: 0x0024[6:3]
```

<!-- Source PDF page 11 -->

| 级别 | 命令 [ reg offset 0x0024, bit6:3] (bit[2:0] = 0x6(默认)) |
|---|---|
| 4'b0000: 0 mVpp | io -4 0xfed88024 0x06 |
| 4'b0001: | io -4 0xfed88024 0x0e |
| 4'b0010: | io -4 0xfed88024 0x16 |
| 4'b0011: | io -4 0xfed88024 0x1e |
| 4'b0100: | io -4 0xfed88024 0x26 |
| 4'b0101: | io -4 0xfed88024 0x2e |
| 4'b0110: | io -4 0xfed88024 0x36 |
| 4'b0111: 390 mVpp | io -4 0xfed88024 0x3e |
| 4'b1000: | io -4 0xfed88024 0x46 |
| 4'b1001: | io -4 0xfed88024 0x4e |
| 4'b1010: | io -4 0xfed88024 0x56 |
| 4'b1011: | io -4 0xfed88024 0x5e |
| 4'b1100: | io -4 0xfed88024 0x66 |
| 4'b1101: | io -4 0xfed88024 0x6e |
| 4'b1110: | io -4 0xfed88024 0x76 |
| 4'b1111: 880 mVpp | io -4 0xfed88024 0x7e |

## 3. 代码参数配置调整

Kernel 驱动路径：`drivers/phy/rockchip/phy-rockchip-usbdp.c`。U-Boot 驱动路径：`drivers/phy/phy-rockchip-usbdp.c`。swing 和 pre-emphasis 的调整寄存器定义如下。

```text
struct dp_tx_drv_ctrl {
    u32 trsv_reg0204;
    u32 trsv_reg0205;
    u32 trsv_reg0206;
    u32 trsv_reg0207;
};
```

各 Lane 的配置寄存器偏移如下。原文最后两个表头均为 `trsv_reg0206`，保留并在校对记录注明。

<!-- Source PDF page 12 -->

|  | trsv_reg0204 | trsv_reg0205 | trsv_reg0206 | trsv_reg0206 |
|---|---|---|---|---|
| lane0 | 0x0810 | 0x0814 | 0x0818 | 0x081C |
| lane1 | 0x1010 | 0x1014 | 0x1018 | 0x101C |
| lane2 | 0x1810 | 0x1814 | 0x1818 | 0x181C |
| lane3 | 0x2010 | 0x2014 | 0x2018 | 0x201C |

DP link rate 有 RBR、HBR、HBR2、HBR3 四个等级，分别使用以下 swing 和 pre-emphasis 配置数组。标准 DP 接口输出时：

<!-- Source PDF page 12 -->

|  | RK3576 配置 | RK3588 配置 |
|---|---|---|
| RBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr |
| HBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr |
| HBR2 | rk3588_dp_tx_drv_ctrl_hbr2 | rk3588_dp_tx_drv_ctrl_hbr2 |
| HBR3 | rk3588_dp_tx_drv_ctrl_hbr3 | rk3588_dp_tx_drv_ctrl_hbr3 |

Type-C 接口输出时：

<!-- Source PDF page 12 -->

|  | RK3576 配置 | RK3588 配置 |
|---|---|---|
| RBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec |
| HBR | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec | rk3588_dp_tx_drv_ctrl_rbr_hbr_typec |
| HBR2 | rk3588_dp_tx_drv_ctrl_hbr2 | rk3588_dp_tx_drv_ctrl_hbr2 |
| HBR3 | rk3588_dp_tx_drv_ctrl_hbr3 | rk3588_dp_tx_drv_ctrl_hbr3 |

上述数组均为 4×4，保存不同 swing 和 pre-emphasis 等级组合的寄存器配置。SSC 的代码配置位置如下：

```text
static const struct reg_sequence rk3588_udphy_24m_refclk_cfg[] = {
    ......
    {0x03f0, 0x0a}, {0x03f4, 0x07},
    {0x03f8, 0x07}, {0x03fc, 0x0c},
    {0x0404, 0x12}, {0x0408, 0x1a},
    {0x040c, 0x1a}, {0x0410, 0x3f},
    ......
};
```

AUX 幅值的代码配置位置如下：

```text
static const struct reg_sequence rk3588_udphy_init_sequence[] = {
    ......
    {0x0024, 0x6e},
};
```

## 校对与使用限制

原稿 §2 写作 `RK3756`，与其余 RK3576 描述不同。表中的 `4'b001`、`4'b111110`、`5'b1000000` 等位宽写法，以及预冲级别与寄存器值的对应，均按原文保留待核对。转换速率表头写 `0x081c, bit 7:5`，正文实际列出 `0x0820[5:3]`；SSC 调制频率正文 RBR 偏移为 `0x0404`，命令却使用 `0xfed88400`，HBR3 高端值与两位左移说明也有疑点。不要据此自行猜改。

图像核对确认，原稿第 5 页 `io -4 0xfed888100x28`、第 8 页 `io -4 0xfed888200x70` 本身就缺少参数分隔空格，不是此次提取造成。表中保留原样，不作为可直接执行的命令。寄存器写入可能影响正在使用的 DP/USB 功能；需在可恢复的测试环境中核对掩码、共享位及驱动状态。[详细校对记录](/docs/rockchip-dp-si-test/EDITORIAL-NOTES.md)。
