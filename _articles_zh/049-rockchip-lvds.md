---
title: "Rockchip LVDS：电气特性、单双通道配置与调试"
description: "完整 LVDS 技术参考，包含 JEIDA/VESA 时序、平台支持、五种显示场景、DTS 配置与电压调节。"
translation_key: "049-rockchip-lvds"
slug: "049-rockchip-lvds"
lang: "zh"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["LVDS", "JEIDA", "VESA", "RK356X", "RK3288"]
keywords: "ArmSoM Rockchip LVDS Dual LVDS JEIDA VESA DTS"
excerpt: "完整 LVDS 技术参考，包含 JEIDA/VESA 时序、平台支持、五种显示场景、DTS 配置与电压调节。"
---

{% raw %}
# Rockchip LVDS：电气特性、单双通道配置与调试

## ArmSoM 适用范围

本篇为 Rockchip 平台参考，不是 ArmSoM 硬件实测。原稿的产品版本表覆盖 RK3126、RK3128、RK3288（Linux 4.4）以及 RK3326/PX30、RK3368、RK356X（Linux 4.19 及后续版本）；支持情况表还列出 RK3562。实际适配须核对板卡是否引出 LVDS、PHY/VP 路由、目标 SDK 驱动及屏时序、电源、背光。不能据此宣称所有 ArmSoM 板卡都支持 LVDS，亦未进行硬件验证。

中文与英文 PDF 均为 V1.2.0，分别为22页和24页。中文按中文原文，英文按英文原文，俄文完整翻译英文；共享技术章节并显式记录差异。中文使用中文原图，英文、俄文使用英文原图。

[校对记录](/docs/rockchip-lvds/EDITORIAL-NOTES.md) · [ArmSoM docs](https://docs.armsom.org/)

> 原文疑点：场景表第4行将两个输出都写为 LVDS0，而后续图与配置使用 LVDS0/LVDS1；保留原表值，实际接线需核对。RK3288 的 vopl 示例末尾缺少分号，未擅自修改。

## 原文产品版本

| SoC | Linux |
| --- | --- |
| RK3126 | 4.4 |
| RK3128 | 4.4 |
| RK3288 | 4.4 |
| RK3326/PX30 | 4.19 及后续版本 |
| RK3368 | 4.19 及后续版本 |
| RK356X | 4.19 及后续版本 |

## 1. 基础概念

LVDS (Low Voltage Differential Signaling) 是一种低电压差分信号传输技术，用于在高速串行数据通信中传输信号。它广泛应用于显示、图像传输和数据通信等领域。

LVDS 是一种物理层信号传输技术，定义了电气特性和接口标准。VESA 和 JEIDA 组织则规定了 LVDS 在数据链路上的传输方式。根据传输数据量的不同以及传输顺序，又可以分为 JEIDA-18 ,  JEIDA-24 ,VESA-24 等。

对于 LVDS ，一个时钟周期可以传输7bit的数据。下面简要介绍各种常见的 LVDS 格式的时序。

1\. JEIDA-18

```text
Slot     0    1     2     3     4     5    6
       __________                _________________

Clock         \_______________________/
       ______ ______ ______ ______ ______ ______ ______
DATA0 ><__G0__><__R5__><__R4__><__R3__><__R2__><__R1__><__R0__><
DATA1 ><__B1__><__B0__><__G5__><__G4__><__G3__><__G2__><__G1__><
DATA2 ><_CTL2_><_CTL1_><_CTL0_><__B5__><__B4__><__B3__><__B2__><
```

2\. JEIDA-24

```text
Slot     0    1     2     3     4     5    6
      ___________                _________________

Clock         \_______________________/
      ______ ______ ______ ______ ______ ______ ______
DATA0 ><__G2__><__R7__><__R6__><__R5__><__R4__><__R3__><__R2__><
DATA1 ><__B3__><__B2__><__G7__><__G6__><__G5__><__G4__><__G3__><
DATA2 ><_CTL2_><_CTL1_><_CTL0_><__B7__><__B6__><__B5__><__B4__><
DATA3 ><_CTL3_><__B1__><__B0__><__G1__><__G0__><__R1__><__R0__><
```

3\. VESA-24

```text
Slot     0    1     2     3     4     5    6
      ___________                _________________
Clock         \_______________________/

       ______ ______ ______ ______ ______ ______ ______
DATA0 ><__G0__><__R5__><__R4__><__R3__><__R2__><__R1__><__R0__><
DATA1 ><__B1__><__B0__><__G5__><__G4__><__G3__><__G2__><__G1__><
DATA2 ><_CTL2_><_CTL1_><_CTL0_><__B5__><__B4__><__B3__><__B2__><
DATA3 ><_CTL3_><__B7__><__B6__><__G7__><__G6__><__R7__><__R6__><
```

其中,  CTL2 为 DE 使能信号， CTL1 为 VSYNC 场同步信号， CTL0 为 HSYNC 行同步信号。 CTL3 作为预留的额外用途信号，一般情况下可以忽略。

在 DTS 的 panel 节点中，可以通过 bus-format 属性来指定采用的 LVDS 格式，其对应关系如下：

MEDIA_BUS_FMT_RGB666_1X7X3_SPWG :  jeida-18

MEDIA_BUS_FMT_RGB888_1X7X4_JEIDA :  jeida -24

MEDIA_BUS_FMT_RGB888_1X7X4_SPWG : vesa-24

## 2. 电气特性

![原文技术图 — PDF 5](/docs/rockchip-lvds/assets/cn-p5-X48.png)

LVDS 驱动器的典型实现电路如上图所示，本质上是一个由恒流源驱动的差分放大电路。

首先考虑直流输出特性，对于理想差分放大电路，共模电压 Vcm 可以表述为以下形式：

`V_cm = (U_a + U_b) / 2`

其中，U_a 为图中 A 的直流对地电压，U_b 为图中 B 的直流对地电压。

对于理想差分放大电路，认为 U_a = U_b，即接收端的 100 Ω 电阻两端无压差，呈现出隔直流的特性。

再考虑交流输出特性，在 AB 两端产生的交流小信号 u_ab 在接收端的 100 Ω 电阻两侧产生压降，呈现出通交流的特性。

一个常见的需求是调整 LVDS 的驱动强度，以增强驱动强度为例，可以有多种实现方式，例如增大恒流源的电流，增加负载电阻等。

以上的分析均是从电路分析的角度出发，在实际的应用中，有些 LVDS PHY 提供了额外的配置完成这些操作。例如，可以通过增大差分电压 u_ab 以提高 LVDS 的驱动强度（压差越高，电流越大）。

在实际应用中，还需要考虑传输线带来的影响。优化差分线上的电容和电阻（使其变小），也可以在一定程度上增强 LVDS 的驱动强度。

## 3. 平台支持情况

| 平台 | 支持LVDS0 | 支持LVDS1 |
| --- | --- | --- |
| RK3568 | √ | √ |
| RK3567 | √ | √ |
| RK3566 | √ | × |
| RK3562 | √ | × |
| RK3368 | √ | × |
| RK3326 / PX30 | √ | × |
| RK3288 | √ | √ |
| RK3128 | √ | × |
| RK3126 | √ | × |

## 4. 应用场景梗概

根据使用场景的不同， LVDS 的用法可以归纳为下表：

| 编号 | 屏幕数量 | LVDS 接口 | Video Port 分配 | 最高分辨率 | 描述 | 参考配置 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | LVDS0 / LVDS1 | VP1 → LVDS0/1; VP2 → LVDS0/1 | 1280x800 | 单通道 LVDS 屏 | rk3567-evb2-lp4x-v10-single-channel-lvds.dts<br>rk3568-evb1-ddr4-v10-single-channel-lvds.dts |
| 2 | 1 | LVDS0 + LVDS1 | VP1 → LVDS0 + LVDS1; VP2 → LVDS0 + LVDS1 | 1920x1080 | Dual LVDS，双通道 LVDS | rk3567-evb2-lp4x-v10-dual-channel-lvds.dts |
| 3 | 2 | LVDS0 + LVDS1 | VP1 → LVDS0, VP2 → LVDS1; VP2 → LVDS0, VP1 → LVDS1 | 1280x800 每屏 | 两个 VP 分别接一个单通道 LVDS 屏 | rk3567-evb2-lp4x-v10-two-vp-two-separate-single-channel-lvds.dts<br>rk3568-evb1-ddr4-v10-two-vp-two-separate-single-channel-lvds.dts |
| 4 | 2 | LVDS0 + LVDS1 | VP1 → LVDS0, VP1 → LVDS0; VP2 → LVDS0, VP2 → LVDS0 | 1280x800 每屏 | 一个 VP 接两个单通道 LVDS 屏，各显示 VP 内容的一半 | rk3567-evb2-lp4x-v10-one-vp-two-single-channel-lvds.dts<br>rk3568-evb1-ddr4-v10-one-vp-two-single-channel-lvds.dts |
| 5 | 2 | LVDS0 + LVDS1 | VP1 → LVDS0 + LVDS1; VP2 → LVDS0 + LVDS1 | 1280x800 每屏 | 一个 VP 接两个单通道 LVDS 屏，显示完全相同内容（connector mirror） | 见本文相关章节 |

这 5 种场景的实际效果如下图所示:

![原文技术图 — PDF 9](/docs/rockchip-lvds/assets/cn-p9-X61.jpg)

对于 RK356X ， Video Port 和 LVDS 的分配关系如下图所示：

![原文技术图 — PDF 10](/docs/rockchip-lvds/assets/cn-p10-X64.jpg)

## 5. 不同场景的 LVDS 配置示例

在本章节中，将介绍不同 LVDS 的配置示例。尽管 LVDS 的输出具有多种组合，但实际上只需考虑以下两点：

是否是双通道 LVDS ，即 Dual LVDS。

实际的 LVDS 对应哪个 VP 。

对于 Dual LVDS ，需要启用两个 LVDS 节点，并在 LVDS0 节点中添加 dual-channel 属性，以表明使用的是 Dual LVDS。

```text
&lvds0 {
   status = "okay";

   dual-channel;
};
```

此外，需要确认 LVDS 对应的是哪个 VP 。对于 Dual LVDS ，LVDS0 与 LVDS1 均使用 VP1 或者均使用VP2 作为输出。其余情况则视具体场景进行配置：

```text
/*
 * 例1： 两个 VP 分别接一个单通道 LVDS 屏
 * VP1 -> LVDS0, VP2 -> LVDS1

 */
&lvds0_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "okay";
};

/*
 * 例2： 两个 VP 分别接一个单通道 LVDS 屏（顺序相反）
 * VP2 -> LVDS0, VP1 -> LVDS1
 */
&lvds0_in_vp2 {

   status = "okay";
};

&lvds1_in_vp1 {
   status = "okay";
};
```

### 5.1 单通道 LVDS 配置

在配置单通道 LVDS 时，需要确认以下参数：

屏幕的时序、输出格式、相应的 Enable 引脚以及 PWM 背光引脚

从 LVDS0 还是 LVDS1 上输出

从 VP1 还是 VP2 输出到 LVDS

对于单通道 LVDS ，在 RK356X 上， LVDS 与 VP 具有 4 种分配关系，如下图所示：

![原文技术图 — PDF 11](/docs/rockchip-lvds/assets/cn-p11-X70.png)

下面以 VP1 输出 LVDS0 为例，简要介绍 DTS 的配置过程：

1\. 设置 panel 节点，配置屏幕时序、输出格式、 Enable 及背光引脚，并将 panel 与 LVDS 节点关联

起来：

```text
panel {
   compatible = "simple-panel";
   backlight = <&backlight>;

   power-supply = <&vcc3v3_lcd0_n>;
   enable-delay-ms = <20>;
   prepare-delay-ms = <20>;
   unprepare-delay-ms = <20>;
   disable-delay-ms = <20>;
   bus-format = <MEDIA_BUS_FMT_RGB666_1X7X3_SPWG>;
   width-mm = <217>;
   height-mm = <136>;

   display-timings {
      native-mode = <&timing0>;
      timing0: timing0 {
         clock-frequency = <67000000>;

         hactive = <800>;
         vactive = <1280>;
         hback-porch = <60>;
         hfront-porch = <60>;
         vback-porch = <4>;
         vfront-porch = <2>;
         hsync-len = <8>;
         vsync-len = <8>;
         hsync-active = <0>;
         vsync-active = <0>;
         de-active = <0>;
         pixelclk-active = <0>;

      };
   };

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         panel_in_lvds0: endpoint {
           remote-endpoint = <&lvds0_out_panel>;
         };
      };
   };

};
```

2\. 启用对应的 LVDS 节点，并与 panel 节点关联起来：

```text
&lvds0 {
   status = "okay";
   ports {

      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

3\. 指定 LVDS 在哪一个 VP 上进行输出：

```text
&lvds0_in_vp1 {
   status = "okay";
 };
```

### 5.2 Dual LVDS (双通道 LVDS) 配置

本小节的配置适用于 RK356X 。

1\. 在 LVDS0 节点 lvds 中添加 dual-channel 属性，以表明使用的是 Dual LVDS。

```text
&lvds0 {
   status = "okay";
   dual-channel;


   ports {
      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

2\. 指定 Video Port 的分配方式，对于 RK356X 上的 Dual LVDS ，可以选择均在 VP1 或者 VP2 上进行

输出。下图展示了所有可能的分配方式。

![原文技术图 — PDF 14](/docs/rockchip-lvds/assets/cn-p14-X79.png)

下面的例子展示了均使用 VP1 进行输出，即图中的方式 1 ：

```text
&lvds0_in_vp1 {
   status = "okay";

};

&lvds1_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "disabled";
};
```

3\. 指定 LVDS 通道的输出顺序：

```text
panel {
   /* ... 相关屏幕参数在这里填入
      */


   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         dual-lvds-odd-pixels; /* 输出奇像素 */
         panel_in_lvds0: endpoint {
           remote-endpoint = <&lvds0_out_panel>;

         };
      };
      port@1 {
         reg = <1>;
         dual-lvds-even-pixels; /* 输出偶像素 */
         panel_in_lvds1: endpoint {
           remote-endpoint = <&lvds1_out_panel>;
         };
      };
   };
};
```

在这个示例中，LVDS0 输出 dual-lvds-odd-pixels ，即奇像素；LVDS1 输出 dual-lvds-even-pixels ，即偶像素。实际中可以按需调换二者的顺序。

### 5.3 适用于 RK3288 的 Dual LVDS (双通道 LVDS) 配置

本小节适用于 RK3288 。

1\. 在 LVDS 节点 lvds 中添加 dual-channel 属性，以表明使用的是 Dual LVDS 。

```text
&lvds {
   status = "okay";
   dual-channel;


   ports {
      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

2\. 指定 LVDS 在哪个 VOP 上进行输出，可以是 vopb 或者 vopl 。

```text
/* 在 vopb 上输出 */
&lvds_in_vopb {
   status = "okay";

};

/* 或者，在 vopl 上输出 */
&lvds_in_vopl {
   status = "okay";
}
```

3\. 指定 LVDS 通道的输出顺序。对于 RK3288 ， 可以在 lvds 节点中添加 rockchip,data-swap 属

性，以交换输出顺序：

```text
&lvds {
   rockchip,data-swap;
};
```

### 5.4 两个 VP 分别接一个独立的单通道 LVDS 屏幕配置

在这种情况下，只需按照单通道 LVDS 的配置，分别配置每一个单通道的 LVDS 即可。

对于这种情况，不要设置 dual-channel 属性，否则将被识别为 Dual LVDS

在实际使用中，需要指定好 Video Port 的分配方式。一共有 2 种可能的分配方式，如下图所示：

![原文技术图 — PDF 16](/docs/rockchip-lvds/assets/cn-p16-X85.png)

下面的 DTS 示例分别对应图中的方式 1 与 方式  ：

```text
/*
 * VP1 -> LVDS0, VP2 -> LVDS1
 */

&lvds0_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "okay";
};
/*
 * 或者，VP2 -> LVDS0, VP1 -> LVDS1

 */
&lvds0_in_vp2 {
   status = "okay";
};

&lvds1_in_vp1 {
   status = "okay";
};
```

### 5.5 一个 VP 接两个单通道 LVDS 屏配置

在这种场景下，一个 VP 接两个单通道 LVDS 屏，每个屏幕显示 VP 中的半边内容。

值得注意的是，在这种情况下，目前将其实现为 Dual LVDS 的扩展。 因此其配置方式与 Dual LVDS 类似：

1\. 在 LVDS0 节点 lvds 中添加 dual-channel 属性。

```text
&lvds0 {
   status = "okay";
   dual-channel;


   ports {
      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

2\. 指定 Video Port 的分配方式。对于 RK356X 上一个 VP 接两个单通道 LVDS 屏的场景，可以选择均

在 VP1 或者 VP2 上进行输出。其可能的分配方式如下图所示。

![原文技术图 — PDF 18](/docs/rockchip-lvds/assets/cn-p18-X92.png)

下面的例子展示了均使用 VP1 进行输出， 即图中的方式 1 ：

```text
&lvds0_in_vp1 {
   status = "okay";

};

&lvds1_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "disabled";
};
```

3\. 指定 LVDS 通道的输出顺序：

```text
panel {
   /* ... 相关屏幕参数在这里填入
      */


   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         dual-lvds-left-pixels; /* 输出左半边内容 */
         panel_in_lvds0: endpoint {
           remote-endpoint = <&lvds0_out_panel>;

         };
      };
      port@1 {
         reg = <1>;
         dual-lvds-right-pixels; /* 输出右半边内容 */
         panel_in_lvds1: endpoint {
           remote-endpoint = <&lvds1_out_panel>;
         };
      };
   };
};
```

在当前的实现中，我们额外定义了 dual-lvds-left-pixels 和 dual-lvds-right-pixels 属性用以区分输出顺序。在实际使用中可以按需更改。

### 5.6 一个 VP 接两个单通道 LVDS 屏配置 (Connector Mirror)

在这种场景下，一个 VP 接两个单通道 LVDS 屏，每个屏幕的时序参数相同，并显示完全相同的内容。

对于每个屏幕时序的配置，可以参照单通道 LVDS 进行配置。

在 Video Port 与 LVDS 的分配方式上，可以指定均从 VP1 或均从 VP2 进行输出：

![原文技术图 — PDF 19](/docs/rockchip-lvds/assets/cn-p19-X95.png)

```text
/* 均使用 VP1 进行输出 */
&lvds0_in_vp1 {
   status = "okay";

};

&lvds1_in_vp1 {
   status = "okay";
};

/* 或者，均使用 VP2 进行输出 */
&lvds0_in_vp2 {
   status = "okay";
};

&lvds1_in_vp2 {

   status = "okay";
};
```

## 6. LVDS 调试方法

借助 VOP 的 summary 节点，可以查看当前的 LVDS Connector 信息：

```text
cat /sys/kernel/debug/dri/0/summary
```

当启用了 Dual LVDS ，且驱动已经成功加载时，将显示名为 LVDS-DUAL 的 Connector 节点：

![原文技术图 — PDF 21](/docs/rockchip-lvds/assets/cn-p21-X101.jpg)

注意，对于一个VP接两个单通道LVDS屏，每个屏幕显示 VP 中的半边内容的场景，同样将显示为LVDS-DUAL。

当使用了两个单通道的 LVDS 屏幕时，可以看到不同的 LVDS Connector 节点：

![原文技术图 — PDF 21](/docs/rockchip-lvds/assets/cn-p21-X102.jpg)

此时， LVDS Connector 分配到哪个 VP 下取决于具体的配置。

## 7. 常见问题

### 7.1 LVDS1 通道无输出

首先检查 VOP summary 的输出信息，确保 LVDS1 已正确启用。若仍然无输出，尝试更新 Loader。

### 7.2 使用 Dual LVDS 输出的内容模糊/有锯齿感

可能是 LVDS0 和 LVDS1 输出接反了，可以尝试在 DTS 配置中调换 dual-lvds-odd-pixels 和 dual-lvds-even-pixels 属性的位置。

### 7.3 屏幕黑屏/白屏

检查硬件连接，检查背光引脚和 Enable 引脚的输出是否正确。

### 7.4 修改 LVDS 共模/差模电压

对于 RK356X ，修改 PHY 对应的 DTS 属性：

其中，  inno,lvds-vcom  为共模电压，  inno,lvds-vod  为差模电压。

RK356X 的共模电压一共有如下几种:

1000 mV

950 mV （默认值）

900 mV

850 mV

RK356X 的差模电压一共有如下几种:

400 mV

350 mV （默认值）

300 mV

250 mV

```text
&video_phy0 {
      inno,lvds-vcom = <1000>; /* 1000mV */
      inno,lvds-vod = <400>; /* 400mV */

};
```

{% endraw %}

