---
title: "RK3588 Vsync 完整调整指南：VOP、DSC、DSI 与 eDP VRR"
description: "完整保留 RK3588 Vsync 时序、VFP/HFP/dclk 方案、120/60fps 示例及 DPCD/EDID VRR 限制。"
translation_key: "054-rockchip-vsync-adjust"
slug: "054-rockchip-vsync-adjust"
lang: "zh"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["RK3588", "Vsync", "VRR", "DSI", "eDP", "DSC"]
keywords: "ArmSoM Rockchip RK3588 Vsync VRR DSI eDP"
excerpt: "完整保留 RK3588 Vsync 时序、VFP/HFP/dclk 方案、120/60fps 示例及 DPCD/EDID VRR 限制。"
---

{% raw %}

# RK3588 Vsync 完整调整指南：VOP、DSC、DSI 与 eDP VRR

本文为 Rockchip RK3588 平台参考，原文适用 Linux kernel 5.10。用于 ArmSoM 项目前须核对具体板卡 SoC、显示接口实际引出、Panel/桥接芯片的 VRR 能力及 SDK/BSP 补丁，不据此宣称所有 ArmSoM 板卡支持。本文未进行 ArmSoM 硬件验证；日志、波形、照片及测试描述均来自原稿。

来源：Rockchip_RK3588_Developer_Guide_Vsync_Adjust_CN.pdf，V1.2.0，11 页。仅有中文原稿，三语均使用中文 PDF 原图；英文、俄文为完整正文翻译，图注与 alt 已本地化，图内原始文字保留。

[校对记录](/docs/rockchip-vsync-adjust/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1.   扫描时序说明

要输出一帧图像到屏幕时，一般有扫描时序如下图：

![扫描时序与有效显示区域](/docs/rockchip-vsync-adjust/assets/cn-p4-1.png)

*扫描时序与有效显示区域*

每一行包括 hsync, hback porch, hactive, hfront porch, 每一帧包括 vsync, vback porch, vactive,vfront porch。

定义 htotal 如下：

```text
htotal = hsync + hbackporch + hactive + hfrontporch
```

定义 vtotal 如下：

```text
vtotal = vsync + vbackporch + vactive + vfrontporch
```

对于一个 pixel clock 为 pixel_clk, 刷新率为 fps 的扫描时序输出，要满足如下公式：

```text
pixel_clk = htotal * vtotal * fps
```

从扫描时序图看，一个 Vysnc 周期即为 1/fps,  要调整 Vysnc 周期，即调整 fps，可以通过修改 pixelclock ，htotal， vtotal 来实现。对一个固定的分辨率，

hactive 和 vactive 是不变，htotal 中只能调整 hbank(hsync + hback porch + hfront porch), vtotal 中只能调整 vbank(vsync + vback porck + vfront porch)，

在调整 hbank 的方案中，目前遇到的屏基本都是调整 HFP(hfront porch), 在调整 vbank 的方案中，目前遇到的屏基本都是调整 VFP(vfront porch)。pixel clock 的调整，在 RK3588 中对应 dclk rate 的调整。

后续讨论调整 Vsync 周期，只讨论调整 VFP, HFP 或 dclk rate 这几种方案。

## 2.   显示通路说明

RK3588 的显示通路如下图：

![RK3588 显示通路与可选 DSC](/docs/rockchip-vsync-adjust/assets/cn-p5-1.png)

*RK3588 显示通路与可选 DSC*

支持 HDMI, DSI, DP, eDP 等接口输出，其中，HDMI，DSI 接口输出时，可能使用 DSC，在评估 DSI 和HDMI 接口调整 Vsync 周期时，需要分别考虑使能 DSC 和不使能 DSC 的两种场景。

## 3.   VOP 调整说明

在 RK3588 的 VOP 中， 通过寄存器配置可以调整 VFP， HFP 或 dclk rate，其中调整 VFP 可以配置成立即生效或者帧生效，调整 HFP 只能是帧生效， 调整 dclk rate 只能是帧生效。

通过调整 dclk rate 改变 Vysnc 周期，有如下限制：

1\. 只有 VP0 和 VP2 支持切换 dclk 源来改变 Vsync 周期；

2\. VP0 可以在 dclk0 和 dclk1 之间切换 dclk 源，VP2 可以在 dclk2 和 dclk1 之前切换 dclk 源。

![VP0/VP2 的 dclk 源切换](/docs/rockchip-vsync-adjust/assets/cn-p5-2.png)

*VP0/VP2 的 dclk 源切换*

以 DSI 挂 VP2 通路实现 120/60fps 动态变频为例，其分辨率信息如下：

```text
console:/ # cat /sys/kernel/debug/dri/0/summary
Video Port0: DISABLED
Video Port1: DISABLED

Video Port2: ACTIVE
   Connector: DSI-1
      bus_format[1018]: RGB101010_1X30
      overlay_mode[0] output_mode[f] color_space[0], eotf:0
   Display mode: 3024x2016p120
      clk[1187744] real_clk[1187744] type[48] flag[a]
      H: 3024 4416 4432 4532
      V: 2016 2042 2044 2184
   Variable refresh rate info:
      Min refresh rate: 60
      Max refresh rate: 120
      Current refresh rate: 60

      Type: DCLK
      Current pixel clock:593872
   Cluster1-win0: ACTIVE
      win_id: 2
      format: AB24 little-endian (0x34324241)[AFBC] SDR[0] color_space[0]
glb_alpha[0xff]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]
      zpos: 0
      src: pos[0, 0] rect[3024 x 2016]
      dst: pos[0, 0] rect[3024 x 2016]
      buf[0]: addr: 0x00000000ef7b9000 pitch: 12096 offset: 0
Video Port3: DISABLED
```

120/60fps 变频场景下，将dclk1 和 dclk2 同时挂在 v0pll(dclk1和dclk2为2倍频关系，可以满足精准分频同时保证父pll稳定不发生变化), 时钟关系如下关系如下：

```text
cat /sys/kernel/debug/clk/clk_summary

...

   pll_v0pll          1  1  0 1187743988 0 0  50000
     v0pll            2  2  0 1187743988 0 0  50000
       dclk_vop2_src  1  2  0  296935997 0 0  50000
         dclk_vop2    1  2  0  296935997 0 0  50000
       dclk_vop1_src  1  2  0  148467999 0 0  50000
         dclk_vop1    1  2  0  148467999 0 0  50000
...
```

## 4.   DSC 模块调整说明

DSC 模块支持调整 VFP 和 HFP，并且都只能配置成立即生效。DSC 模式也支持 VOP 通过调整 dclk 后送进来的 timing。

## 5.   DSI 接口调整说明

DSI 的寄存器其配置都是立即生效的，无论配置 VFP，HFP 都是立即生效。DSI 有两种工作模式，Manual 和 Auto-Calculation。在 Auto-Calculation 模式下，DSI 控制器会被配置为从 IPI 和 PPI 接口提取所有必要的信息和时序参数，以满足视频模式中的帧时序要求，允许 IPI 帧动态变化，同时控制器适应输出帧的变化，所以 DSI 在 Auto-Calculattion 模式下可以根据收到的 VOP timing 自动调整 phy 上的输出，不需要配置 DSI 的寄存器。在不同模式下，对调整方式的支持存在差异。

### 5.1   VFP 调整说明

DSI 接口可以通过调整 VFP  来改变 Vsync 的周期。

在 Manual 模式下， Vsync 中断到来时，同时改变 VOP、DSC(如果有使能 DSC)、 DSI 的 VFP 寄存器，并立即起效，就可以改变当前帧的 VFP。由于 DSI 寄存器的限制， VFP 最大只能设置到 1023。

如果为了获取更大的 VFP ，可以只调整VOP、DSC(如果有用到 DSC 压缩)的 VFP 寄存器，不过不改动DSI 的 VFP 寄存器会影响 VFP 的发包配置，会出现下图情形：

![不调整 DSI VFP 时缺少同步包的原文波形](/docs/rockchip-vsync-adjust/assets/cn-p7-1.png)

*不调整 DSI VFP 时缺少同步包的原文波形*

即缺少同步包，如果屏端不接受这种波形，则可能出现显示异常，不建议不配置 DSI 的 VFP。

在 Auto-Calculation 模式下，只需在 Vsync 中断到来时，同时改变 VOP、DSC(如果有使能 DSC)，并立即起效。DSI 的 VFP 同样只能到 1023。

### 5.2   HFP 调整说明

通过配置 DSC HFP 寄存器实现动态帧率存在的⻛险：

DSC 时序相关寄存器是立即生效，与 VOP 按帧生效机制不同，在帧尾改变 DSC 的配置寄存器，会破坏当前帧的时序，帧时间上带来误差，而 DSC video mode 模式需要保证 VOP 和 DSC 的扫描时序尽可能一致，否则 DSC 内部的 Buffer 会溢出。

如下是当 DSC 出错后，在 MIPI DPHY 上异常波形体现（无数据下发）：

![DSC 出错时 MIPI DPHY 无数据下发](/docs/rockchip-vsync-adjust/assets/cn-p8-1.png)

*DSC 出错时 MIPI DPHY 无数据下发*

在 Manual 模式下，RK3588 的 DSI 接口目前不支持通过调整 HFP 改变 Vsync。原文作者的本地测试（非 ArmSoM 实测） DSC 模式下调整 HFP 会显示异常，如下：

![原文 DSC 模式 HFP 调整显示异常照片](/docs/rockchip-vsync-adjust/assets/cn-p8-2.png)

*原文 DSC 模式 HFP 调整显示异常照片*

在 Auto-Calculation 模式下，不 使能DSC 时，调整 HFP 时只需要调整 VOP 的 HFP，DSI 可以支持这种调整方式。使能 DSC 时，由于需要同时调整 VOP 和 DSC 的寄存器，无法保证 HFP 的调整会在同一行起效，不支持调整 HFP。

### 5.3   dclk rate 调整说明

在 Manual 模式下，不支持 VOP 调整 dclk rate 来改变 Vsync 周期。

在 Auto-Calculation 模式下，无论是否使能 DSC，都支持使用 dclk rate 调整 Vsync 周期， DSI 控制器自动调整输出。

以如下红框 A/B 两组 120/60 帧 timing 作为变帧说明：

![120/60fps 两组时序，红框为 10 bit 3.75x A/B](/docs/rockchip-vsync-adjust/assets/cn-p9-1.png)

*120/60fps 两组时序，红框为 10 bit 3.75x A/B*

| 参数 | 单位 | 10 bit 3x A | 10 bit 3x B | 10 bit 3.75x A | 10 bit 3.75x B |
| --- | --- | --- | --- | --- | --- |
| Timing | 120(FPP)+60(Finger) | A | B | A | B |
| Frame-Rate | Hz | 120 | 60 | 120 | 60 |
| VSA | Line | 2 | 2 | 2 | 2 |
| VBP | Line | 140 | 140 | 140 | 140 |
| Vadr | Line | 2016 | 2016 | 2016 | 2016 |
| VFP | Line | 26 | 26 | 26 | 26 |
| HAS | Pixel | 10 | 10 | 10 | 10 |
| HBP | Pixel | 20 | 306 | 38 | 332 |
| Hadr | Pixel | 3024 | 3024 | 3024 | 3024 |
| HFP | Pixel | 30 | 308 | 38 | 334 |
| MIPI speed | Mbps | 1108 | 1108 | 928 | 928 |
| Interface | MIPI | Dphy 2port 8lane+DSC | Dphy 2port 8lane+DSC | Dphy 2port 8lane+DSC | Dphy 2port 8lane+DSC |

#### 5.3.1   dclk rate 调整的变帧细节

如下图，红色信号表示屏端 IC 内部解析到 HSYNC 资讯，dclk 变帧调整为帧生效，在变帧瞬间，屏端统计上一帧的26行 VFP后，预计收到 VSYNC，并且预期 VSYNC 到 DATA 会有 140+2 个 VBP+VSA，屏端IC 会取 VSYNC 后的头4 line 平均宽度跟变帧时间作为变帧切换判断。

![原文 60→120fps 波形；绿字依次标示内部 HSYNC、一次 toggle 为一个 hsync、前帧 26 行、距 DATA 142 行及每 4 行平均线宽](/docs/rockchip-vsync-adjust/assets/cn-p9-2.png)

*原文 60→120fps 波形；绿字依次标示内部 HSYNC、一次 toggle 为一个 hsync、前帧 26 行、距 DATA 142 行及每 4 行平均线宽*

#### 5.3.2   120帧转60帧

![120→60fps：实际外频切换点与内部 IC 判断切换点](/docs/rockchip-vsync-adjust/assets/cn-p10-1.png)

*120→60fps：实际外频切换点与内部 IC 判断切换点*

#### 5.3.3   60帧转120帧

![60→120fps：实际外频切换点与内部 IC 判断切换点](/docs/rockchip-vsync-adjust/assets/cn-p10-2.png)

*60→120fps：实际外频切换点与内部 IC 判断切换点*

## 6.   eDP/DP 接口调整说明

eDP 和 DP 接口对 VRR 的支持，除了控制器本身需要支持，还需要 DPCD/EDID 相关描述支持，eDP/DP 对 VRR 的支持，也称之为 Adpative-Sync。

### 6.1   DPCD VRR 支持说明

MSA 数据包中包含 timing 信息用于 Sink 端重建视频流的时序。MSA 数据包中的这些 timing 是为静态时序的视频流设计的。如果视频流的时序是动态变化的，Sink 端不能使用 MSA 中的 timing 信息。Source 端通过读取DOWN_STREAM_PORT_COUNT 寄存器中的 MSA_TIMING_PAR_IGNORED 位(DPCD Address 00006h, bit6) 来确认 Sink 端是否支持是否无缝切换 timing (即 VRR)。如果支持并且

Source 端需要使用此功能，Source 端需要向DOWNSPREAD_CTRL  寄存器的MSA_TIMING_PAR_IGNORE_EN位(DPCD Address 00107h, bit7), Sink 端忽略如下的 MSA 参数。（原句缺少具体写入动作及值，保留疑点，不补猜。）

![可忽略的 MSA 时序参数原表](/docs/rockchip-vsync-adjust/assets/cn-p11-1.png)

*可忽略的 MSA 时序参数原表*

| HTotal[15:0] | HStart[15:0] | HSyncPolarity (HSP) | HSyncWidth[14:0] (HSW) |
| --- | --- | --- | --- |
| VTotal[15:0] | VStart[15:0] | VSyncPolarity (VSP) | VSyncWidth[14:0] (VSW) |

### 6.2   EDID VRR 支持说明

在 EDID  有定义一个 Descriptor 描述对 VRR 的支持, 即  Display Range Limit Descriptor， 如下：

![Display Range Limits 描述符原表摘图，原稿底部未完整显示后续字节](/docs/rockchip-vsync-adjust/assets/cn-p11-2.png)

*Display Range Limits 描述符原表摘图，原稿底部未完整显示后续字节*

| Byte | Value / bits | 说明 |
| --- | --- | --- |
| 0, 1 | (00 00)h | 表示此 18 字节描述符为 Display Descriptor。 |
| 2 | 00h | 保留：用作 Display Descriptor 时置 00h。 |
| 3 | FDh | Display Range Limits Descriptor 标记。 |
| 4 | bits 7 6 5 4 3 2 1 0 | 显示范围偏移标志。 |
| 4 | 0000 --00 | 垂直频率偏移为零。 |
| 4 | 0000 --10 | 最大垂直频率 +255 Hz；最小值无偏移。 |
| 4 | 0000 --11 | 最大、最小垂直频率均 +255 Hz。 |
| 4 | 0000 00-- | 水平频率偏移为零。 |
| 4 | 0000 10-- | 最大水平频率 +255 kHz；最小值无偏移。 |
| 4 | 0000 11-- | 最大、最小水平频率均 +255 kHz。 |
| 4 | 01h, 04h → 07h, 09h, 0Dh, 10h → FFh | 保留，不使用。原图 0Dh 与 10h 间缺少分隔符，按原值记录。 |
| 5 | 01h → FFh | 最小垂直频率（隔行时为场频） |
| 5 | Byte 4, bits 1, 0 ≠ 11 | 整数二进制编码，范围 1 Hz ~ 255 Hz |
| 5 | Byte 4, bits 1, 0 = 11 | 整数二进制编码，范围 256 Hz ~ 510 Hz |
| 5 | 00h | 保留，不使用。 |
| 6 | 01h → FFh | 最大垂直频率（隔行时为场频） |
| 6 | Byte 4, bits 1 ≠ 1 | 整数二进制编码，范围 1 Hz ~ 255 Hz |
| 6 | Byte 4, bits 1 = 1 | 整数二进制编码，范围 256 Hz ~ 510 Hz |
| 6 | Note | 最小频率必须小于或等于最大频率。 |
| 6 | 00h | 保留，不使用。 |
| 7 | 01h → FFh | 最小水平频率 |
| 7 | Byte 4, bits 3, 2 ≠ 11 | 整数二进制编码，范围 1 kHz ~ 255 kHz |
| 7 | Byte 4, bits 3, 2 = 11 | 整数二进制编码，范围 256 kHz ~ 510 kHz |
| 7 | 00h | 保留，不使用。 |
| 8 | 01h → FFh | 最大水平频率 |
| 8 | Byte 4, bits 3 ≠ 1 | 整数二进制编码，范围 1 kHz ~ 255 kHz |
| 8 | Byte 4, bits 3 = 1 | 整数二进制编码，范围 256 kHz ~ 510 kHz |
| 8 | Note | 最小频率必须小于或等于最大频率。 |
| 8 | 00h | 保留，不使用。 |

这个 Descriptor 描述了 VRR 支持的范围。

需要注意的是， EDID 中定义的 timing 都是 vblank 和 hblank 最小的。比如从 EDID 获取 VRR 支持范围为 30 ~ 100 Hz, 那么，对于一个帧率为 60Hz 的 timing，

支持的 VRR 访问为 30 ~ 60Hz， 对于一个 24 Hz 的 timing， 则不支持 VRR。为了获取 VRR 规定范围内的更低的帧率，需要拓展 vbank。

### 6.3   eDP  接口 VRR 调整说明

eDP 接口支持通过调整 VFP 调整 Vsync。调整 VFP 时，只需要调整 VOP 的 VFP即可，eDP 需要再 dts中配置属性analogix,force-stream-valid，即可以自动根据 VOP 送出的 timing 进行调整。

eDP 接的屏有可能不支持 EDID, 这种情况 VRR 的支持范围需要从 dts 中定义。

{% endraw %}
