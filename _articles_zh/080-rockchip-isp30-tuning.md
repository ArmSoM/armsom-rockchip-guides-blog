---
title: "Rockchip ISP30 调优：RK3588 完整图像质量参考"
description: "完整 V1.2.0 平台参考，涵盖校准、AEC、降噪、锐化、HDR 合成、DRC、去雾、坏点、Gamma、Debayer 和 GIC。"
translation_key: "080-rockchip-isp30-tuning"
slug: "080-rockchip-isp30-tuning"
lang: "zh"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "RK3588", "ISP30", "Camera", "IQ", "HDR"]
keywords: "ArmSoM Rockchip RK3588 ISP30 ISP3.0 AEC HDR tuning"
excerpt: "完整 V1.2.0 平台参考，涵盖校准、AEC、降噪、锐化、HDR 合成、DRC、去雾、坏点、Gamma、Debayer 和 GIC。"
---

{% raw %}

# Rockchip ISP30 调优：RK3588 完整图像质量参考

## ArmSoM 适用说明与来源范围

本文是 Rockchip 平台参考，不是 ArmSoM 硬件实测报告。唯一输入为 Rockchip_Tuning_Guide_ISP30_EN_v1.2.0.pdf，V1.2.0，文档编号 RK-SM-YF-611，共 160 页；原适用表为 RK3588 / ISP3.0。未提供中文原稿，中文和俄文完整翻译此英文稿，三语均保留英文 PDF 的原图，其中部分原图本身含中文标签。原文没有明确内核版本；适配前须确认具体 ArmSoM 板卡、RK3588 SDK/BSP、传感器和镜头驱动、AIQ/IQ 工具版本及校准数据。尚未进行板卡兼容性或画质硬件验证。全部示例值和对比均来自原文，不是 ArmSoM 实测。

> 原文中的矛盾、缺失公式和参数拼写问题均保留并记录，不能视为已验证结论。重复或不一致的章节、图号按原稿保留。

[ 校对记录 ](/docs/rockchip-isp30-tuning/EDITORIAL-NOTES.md) · [ArmSoM](https://docs.armsom.org/)

### 原始产品范围（PDF 第 2 页）

| 芯片 | ISP 版本 |
| --- | --- |
| RK3588 | ISP3.0 |

<!-- source: EN PDF p9; unit 0 -->

## 1 IQ 调试文档关系说明

<!-- source: EN PDF p9; unit 1 -->

使用本文时还涉及以下文档：

<!-- source: EN PDF p9; unit 2 -->

Rockchip_Development_Guide_ISP30_：介绍用户接口及相应结构。

<!-- source: EN PDF p9; unit 3 -->

Rockchip_IQ_Tools_Guide_ISP30_：详细介绍 RK IQ Tools 的使用。

<!-- source: EN PDF p9; unit 4 -->

Rockchip_Color_Optimization_Guide_ISP30：详细介绍色彩调优。

<!-- source: EN PDF p9; unit 5 -->

第 1 章说明 ISP 调优相关文档的关系；第 2 章介绍 ISP 系统概况，包括功能框图及各模块；第 3 章介绍整体图像调优的操作步骤和注意事项；第 4 章起按模块介绍各子模块的调试方法。

<!-- source: EN PDF p9; unit 6 -->

## 2 ISP 系统概述

<!-- source: EN PDF p9; unit 7 -->

### 1.   2.1 功能介绍

<!-- source: EN PDF p9; unit 8 -->

ISP30 支持标准传感器图像处理，包括自动白平衡、自动曝光、Demosaic、坏点校正及镜头阴影校正等基础功能，以及 HDR、去雾、降噪等高级处理。

<!-- source: EN PDF p10; unit 9 -->

### 2.   2.2 ISP 功能框图

<!-- source: EN PDF p10; unit 10 -->

![英文 PDF 原图 10](/docs/rockchip-isp30-tuning/assets/en-p010-X345.jpg)

<!-- source: EN PDF p10; unit 11 -->

图 2-1 ISP30 功能框图

<!-- source: EN PDF p11; unit 12 -->

#### 2.1   2.3 各模块介绍

<!-- source: EN PDF p11; unit 13 -->

| 模块名称 | 说明 |
| --- | --- |
| FPN | 通过黑帧或黑行校正 CIS 输入图像以消除固定模式噪声（原文 phenotype 用词异常，待核对）。 |
| BLC | 提供 CIS 黑电平校正。 |
| Degamma | CIS 非线性校正 |
| DPCC | 检测并校正静态、动态坏点。 |
| SPC | 校正遮挡像素（相位对焦）。 |
| Dgain | 提供数字线性增益。 |
| WB Gain | 白平衡校正增益 |
| MERGE | 三帧宽动态合成。 |
| Raw 3DNR &amp; Raw 2DNR | RAW 域时空联合降噪模块 |
| DRC | 动态范围压缩 |
| GIC | 校正 Gr、Gb 两通道不平衡，改善部分场景画质。 |
| LSC | 镜头阴影校正。 |
| CAC | 校正镜头引入的轴向色差（紫边）。 |
| AE Stats | 输出自动曝光统计，软件据此调整 CIS，实现自动曝光。 |
| AF | 统计图像清晰度评价信息，支持自动对焦。 |
| AWB | 输出全局和区域统计，软件据此实现自动白平衡。 |
| Debayer | 将 Bayer RAW 转为 RGB。 |
| CCM | 通过标准 3X3 矩阵和向量偏移线性校正色彩空间。 |
| Gamma | 根据 gamma 曲线调整 R\G\B 三通道亮度。 |
| Dehaze &amp; Enhance | 提供去雾功能，改善雾霾场景视频对比度和清晰度。 |

<!-- source: EN PDF p12; unit 14 -->

| 模块名称 | 说明 |
| --- | --- |
| CSM | 通过标准 3X3 矩阵和向量偏移，将 (R, G, B) 转为 (Y, U, V)，色度下采样后输出 YUV422 给后级。 |
| LDCH | 校正镜头垂直方向畸变。 |
| 3D-LUT | 9x9x9 的 3Dlut 实现亮度、饱和度等复杂颜色调整。 |
| Sharp | 在 YUV 域锐化，提高清晰度。 |
| YNR | 亮度空间域降噪 |
| UVNR | 单独去除色噪。 |
| CGC | YUV 色彩空间转换 |
| CMSK | 提供马赛克和遮挡功能。 |
| FBC | 数据压缩 |
| SCL | 图像缩放 |

<!-- source: EN PDF p12; unit 15 -->

## 3 图像质量调优总体概述

<!-- source: EN PDF p12; unit 16 -->

主要面向 IPC 安防和消费类两类应用。IPC 安防包括线性模式和 HDR 模式；消费类主要包括运动 DV、行车记录仪和抓拍产品。监控行业的特殊需求使 IPC 与消费类应用的画质关注点不同。

<!-- source: EN PDF p12; unit 17 -->

### 1.   3.1 IPC 应用图像调优概述

<!-- source: EN PDF p12; unit 18 -->

IPC 主要有线性和 HDR 两种典型模式。线性模式关注亮度合理、色彩还原准确、整体清晰度、锐度和通透性；HDR 模式还关注合理的整体动态范围（原文亮部表述为“not exquisite”，语义待核；暗部细节可见），尽量准确的色彩还原，以及整体清晰度、锐度和通透性。以下介绍两种模式的调优步骤及 ISP 单点算法调试注意事项。

<!-- source: EN PDF p13; unit 19 -->

#### 1.1   3.1.1 线性模式画质调优

<!-- source: EN PDF p13; unit 20 -->

IPC 线性模式图像调优的整体流程如下（图 3-1）：

<!-- source: EN PDF p13; unit 21 -->

![英文 PDF 原图 13](/docs/rockchip-isp30-tuning/assets/en-p013-X356.png)

<!-- source: EN PDF p13; unit 22 -->

图 3-1 IPC 线性模式图像调优流程

<!-- source: EN PDF p13; unit 23 -->

2\. 画质调优前主要需要完成以下工作：

<!-- source: EN PDF p13; unit 24 -->

1\. 传感器对接：根据产品定义设置传感器 CSI，包括帧率、分辨率、HDR 模式、AE 模式；根据传感器手册或厂家 FAE 提供的信息确定各模式初始化寄存器序列，并适配 RK 平台 MIPI 配置。

<!-- source: EN PDF p13; unit 25 -->

<!-- source: EN PDF p13; unit 26 -->

完成标准：对接模式通路正常，AE 基本功能正常，可正常抓取 RAW；参考 Rockchip_Driver_Guide_ISP2x。

<!-- source: EN PDF p13; unit 27 -->

2\. 模组校准：包括黑电平、RawNR/YUV NR/3DNR、静态坏点、镜头阴影、AWB、CCM、镜头畸变参数等校准。必须严格按照图 3-2 流程执行。

<!-- source: EN PDF p13; unit 28 -->

<!-- source: EN PDF p13; unit 29 -->

![英文 PDF 原图 13](/docs/rockchip-isp30-tuning/assets/en-p013-X357.png)

<!-- source: EN PDF p14; unit 30 -->

图 3-2 模组校准流程

<!-- source: EN PDF p14; unit 31 -->

各模块校准详情见第 4 章；AWB 和 CCM 参见 Rockchip_Color_Optimization_Guide_ISP30。

<!-- source: EN PDF p14; unit 32 -->

3\. ISP 模块联合调优：完成传感器对接和传感器/镜头校准后进入联合调优。线性画质调优包括多组 ISO 照度下的优化；星光级传感器通常需覆盖至最高 ISO 204800。BayerNR、Demosaic、锐化、YUVNR、3DNR、Dehaze、Enhance 等算法随 ISO 联动，除开放的 Mipi 接口参数外，还有随 ISO 联动变化的默认参数（此处沿用原文 Mipi 表述）。

<!-- source: EN PDF p14; unit 33 -->

<!-- source: EN PDF p14; unit 34 -->

线性模式主要使用实验室静态场景和室外实景。通常先用实验室场景模拟各 ISO，合理调试各照度下的亮度、色彩、通透性、清晰度和噪声，再依据 IPC 应用实景微调。需覆盖交通路口昼夜、室外夜间低照度、纹理丰富的室外白天（晴天和阴天）以及室外傍晚日落等场景。图 3-3 给出场景调优顺序。

<!-- source: EN PDF p14; unit 35 -->

![英文 PDF 原图 14](/docs/rockchip-isp30-tuning/assets/en-p014-X361.png)

<!-- source: EN PDF p14; unit 36 -->

图 3-3 线性模式调优场景

<!-- source: EN PDF p14; unit 37 -->

线性模式 ISP 各画质关注维度的基本调试流程见图 3-4。

<!-- source: EN PDF p15; unit 38 -->

![英文 PDF 原图 15](/docs/rockchip-isp30-tuning/assets/en-p015-X364.png)

<!-- source: EN PDF p15; unit 39 -->

图 3-4 画质关注维度调试流程

<!-- source: EN PDF p15; unit 40 -->

亮度维度：

<!-- source: EN PDF p15; unit 41 -->

亮度主要调试 AE，包括 AE 目标值、AE Route、权重表、收敛速度和平滑性。调整前应保证黑电平校准正确、Shading 校准完成、AWB/CCM 校准正确，并为不同模式预设一组 gamma 参数等。

<!-- source: EN PDF p15; unit 42 -->

步骤 1：先确定 AE 权重表。权重表决定曝光关注区域，随应用需求而异。IPC 的主体通常位于画面中部，建议中部权重高于周围。图 3-5 给出示例。

<!-- source: EN PDF p15; unit 43 -->

![英文 PDF 原图 15](/docs/rockchip-isp30-tuning/assets/en-p015-X365.png)

原截图的可编辑转录：AecGridWeight，GridWeightMode: NightGridWeight。

| 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- |
| 0 | 2 | 5 | 2 | 0 |
| 2 | 7 | 10 | 7 | 2 |
| 3 | 10 | 14 | 10 | 3 |
| 2 | 7 | 10 | 7 | 2 |
| 0 | 5 | 8 | 5 | 0 |

<!-- source: EN PDF p15; unit 44 -->

图 3-5 AE 权重表

<!-- source: EN PDF p16; unit 45 -->

步骤 2：确定权重表后设置 AE route，即曝光时间与增益的分配方式。不同场景需不同路线：快速运动目标优先增益并限制曝光时间，如白天抓拍车牌通常限制为 2~4ms，此时优先通过增益增加曝光；夜间低照度时，为平衡噪声，应适当优先增加曝光时间。

<!-- source: EN PDF p16; unit 46 -->

步骤 3：确定权重与路线后，按不同曝光调整 AE 目标值。实验室静态场景的标准是画面中心高亮区域无明显过曝；如图 3-6，中间纹理卡、陶瓷咖啡杯不能过曝，角落枯叶图与玫瑰亮度应合理。主要涉及 SetPoint、DynamicSetpoint 及 AE 逆光模式选择。

<!-- source: EN PDF p16; unit 47 -->

![英文 PDF 原图 16](/docs/rockchip-isp30-tuning/assets/en-p016-X368.png)

<!-- source: EN PDF p16; unit 48 -->

图 3-6 静态场景示意

<!-- source: EN PDF p16; unit 49 -->

步骤 4：最后调整 AE 收敛速度和平滑性，两者需要平衡。在避免 AE 振荡的前提下可适当提高收敛速度，尤其行车记录仪、运动 DV 需适应场景剧烈变化。通常可在实验室静物场景切换灯光，测试速度与稳定性。

<!-- source: EN PDF p16; unit 50 -->

AE 具体参数见本文 AE 模块章节。注意 LSC 也影响图像亮度，建议随 ISO 联动衰减，避免照度略低时暗角区域噪声增大。

<!-- source: EN PDF p16; unit 51 -->

——本段结束

<!-- source: EN PDF p17; unit 52 -->

色彩维度：

<!-- source: EN PDF p17; unit 53 -->

合理调整 AE 后，主要调试 AWB 和 CCM 等色彩参数。准备条件为准确黑电平校正、完成 LSC 校准、合理配置 AE。

<!-- source: EN PDF p17; unit 54 -->

步骤 1：在实验室灯箱中，分别于 D75、D65、D50、TL84、CWF、A、HZ 七组色温下抓取 24 色卡 RAW，获得 AWB 静态白平衡系数并生成白点条件框。详见 Rockchip_IQ_Tools_Guide_ISP30 第 4 章第 4 节。

<!-- source: EN PDF p17; unit 55 -->

步骤 2：使用 AWB 校准的 RAW，通过工具生成对应光源饱和度下的 CCM 矩阵。

<!-- source: EN PDF p17; unit 56 -->

此前需确认所用 gamma 曲线，通常默认 gamma 2.2；有特殊要求时应先填入曲线。操作界面如下：

<!-- source: EN PDF p17; unit 57 -->

![英文 PDF 原图 17](/docs/rockchip-isp30-tuning/assets/en-p017-X371.png)

<!-- source: EN PDF p17; unit 58 -->

图 3-7 CCM 校准界面

<!-- source: EN PDF p17; unit 59 -->

步骤 3：完成前两步后，在标准灯箱各光源下拍摄 24 色卡，用 imatest 检测色彩指标。若满足要求，可初步确认校准所得 AWB 参数与 CCM 矩阵符合要求。

<!-- source: EN PDF p17; unit 60 -->

步骤 4：AWB/CCM 参数合理性还需大量实景测试与调试，包括顺光、逆光、阴天、日落、夜间及混合光源。灰块还原不准时调整 AWB；局部颜色偏色、过饱和或偏淡时优先调整 CCM。混合光源需调 AWB 场景检测参数；人物肤色还原不准时调整 CCM 或 3Dlut。

<!-- source: EN PDF p17; unit 61 -->

AWB/CCM 具体调优参见 Rockchip_Color_Optimization_Guide_ISP30。

<!-- source: EN PDF p17; unit 62 -->

——本段结束

<!-- source: EN PDF p18; unit 63 -->

对比度维度

<!-- source: EN PDF p18; unit 64 -->

亮度和色彩合理后优化对比度。主要涉及 Gamma、Dehaze、Enhance 等，通常以各场景 Gamma 调整为主，Dehaze 和 Enhance 为辅。

<!-- source: EN PDF p18; unit 65 -->

准备条件：黑电平校正正确，LSC 校准完成，AE 曝光合理，AWB/CCM 校准合理。

<!-- source: EN PDF p18; unit 66 -->

步骤 1：调整作为对比度基础的 gamma。以静态实景为例，应使中心肤色卡和边缘立体植物的明暗纹理不丢失，整体对比度观感良好，如下图。

<!-- source: EN PDF p18; unit 67 -->

![英文 PDF 原图 18](/docs/rockchip-isp30-tuning/assets/en-p018-X374.png)

<!-- source: EN PDF p18; unit 68 -->

图 3-8 静态场景中受 gamma 曲线影响的区域

<!-- source: EN PDF p18; unit 69 -->

步骤 2：Gamma 合理后，若需进一步提高对比度，可调 Dehaze 或 Enhance。原文引用第 4.21 节“Dehaze”和第 4.22 节“Enhance”（与本文实际编号不一致，保留引用待核）。

步骤 3：客观测试整体对比度。在 D65 光源下测试灰阶卡，观察是否可辨超过 18 阶，并用 imatest 检查是否达到 14steps。

<!-- source: EN PDF p19; unit 70 -->

![英文 PDF 原图 19](/docs/rockchip-isp30-tuning/assets/en-p019-X377.png)

<!-- source: EN PDF p19; unit 71 -->

图 3-9 实验室灯箱 D65 光源下的灰阶卡及 imatest 分析结果

<!-- source: EN PDF p19; unit 72 -->

<!-- source: EN PDF p19; unit 73 -->

步骤 4：在实际静态场景，按应用和照度调整 Gamma、Dehaze、Enhance，平衡各场景对比度。正常与低照度调试风格会不同，例如夜间模式适当压低 Gamma 暗部，降低暗部噪声负担。

<!-- source: EN PDF p19; unit 74 -->

——本段结束

<!-- source: EN PDF p19; unit 75 -->

清晰度与噪声维度

<!-- source: EN PDF p19; unit 76 -->

清晰度和噪声需要平衡。照度不同，噪声表现也不同；低照度通常噪声更严重、影响观感，因此适当牺牲清晰度。应按不同 ISO 场景控制相关参数。

<!-- source: EN PDF p19; unit 77 -->

建议先优先保证清晰度，降噪前展示锐化细节。实景调试时将编码码率设高、3DNR 设最低，观察静态细节是否锐化；清晰度达到要求后，再调降噪模块取得最终平衡。

<!-- source: EN PDF p19; unit 78 -->

准备条件：黑电平正确、LSC 校准完成、AE 曝光合理、AWB/CCM 合理，并已合理调整 Gamma/Dehaze/Enhance。

<!-- source: EN PDF p19; unit 79 -->

主要相关模块为 Bayer NR、Demosaic、DPCC、YNR、UVNR、3DNR、sharpen、Edgefilter 等。

<!-- source: EN PDF p19; unit 80 -->

步骤 1：Demosaic 是图像基本纹理细节的第一道关口。调试前确认黑电平准确、RawNR 校准合理、AWB/CCM 合理。

<!-- source: EN PDF p20; unit 81 -->

先在实验室灯箱 D65 光源、ISO50 下对分辨率卡调 Demosaic，使分辨率达到客观指标，同时检查静态场景星图高频纹理的插值情况，反复迭代。其他 ISO 同样调试，在高频噪声、插值噪声与清晰度之间平衡。原文此段称图 3-10 为 D50 光源下的分辨率卡，图注却写 D65，需核对；红框表示 4:3 视场，蓝框为中心关注区域。原文交叉引用第 4.4 节“Demosaic”，与实际编号不一致，保留待核。

<!-- source: EN PDF p20; unit 82 -->

![英文 PDF 原图 20](/docs/rockchip-isp30-tuning/assets/en-p020-X380.png)

<!-- source: EN PDF p20; unit 83 -->

图 3-10 实验室灯箱 D65 光源下的清晰度卡

<!-- source: EN PDF p20; unit 84 -->

步骤 2：Demosaic 合理后，重点调 BayerNR、YNR、UVNR、3DNR、Sharpen 和 DPCC。

<!-- source: EN PDF p20; unit 85 -->

调 Bayer NR 前，确认黑电平准确、RawNR 及 AWB/CCM 校准合理。

<!-- source: EN PDF p20; unit 86 -->

Bayer NR 属于前级降噪，强度不宜过大，否则损失清晰度。原文引用第 4.5 节“Bayer NR”（编号待核）。

<!-- source: EN PDF p20; unit 87 -->

步骤 3：调试 YNNR 和 UVNR（沿用原文 YNNR 拼写）。YNR 可分别控制高、中、低频噪声；UVNR 去除色噪，其强度不影响清晰度，但过强导致色彩失真。原文引用第 4.6 节“YNNR and UVNR”，编号待核。

<!-- source: EN PDF p20; unit 88 -->

步骤 4：sharpen 与 Edgefilter 主要将纹理细节和边缘锐度调至合适。实验室静态场景中，在进入 3DNR 前锐化绿藤、绿藻、熊、麻绳等细节，以及中心圆形星图等强边缘，如下图。原文引用第 4.7 节“sharpen and edgefilter”，编号待核。

<!-- source: EN PDF p21; unit 89 -->

![英文 PDF 原图 21](/docs/rockchip-isp30-tuning/assets/en-p021-X383.png)

<!-- source: EN PDF p21; unit 90 -->

图 3-11 静态场景 ISO50 下需要关注锐化的纹理

<!-- source: EN PDF p21; unit 91 -->

步骤 5：DPCC 动态坏点校正强度主要在较低照度确认；照度良好时建议较弱。原文引用第 4.8 节“DPCC”，编号待核。

<!-- source: EN PDF p21; unit 92 -->

步骤 6：3DNR 是噪声与锐度整体平衡的关键，主要调 DEC、REC、NR。模块将噪声分解至不同频段、分别去除后融合。优化时关注运动物体边缘、拖影程度及整体噪声可接受性；如下图红框人物拖影需与整体噪声平衡。原文引用第 4.9 节“3DNR”，编号待核。

<!-- source: EN PDF p21; unit 93 -->

![英文 PDF 原图 21](/docs/rockchip-isp30-tuning/assets/en-p021-X384.png)

<!-- source: EN PDF p21; unit 94 -->

3-12 3DNR 测试点示意

<!-- source: EN PDF p22; unit 95 -->

步骤 7：完成后，在各 ISO 下综合测试最终效果，必要时微调，达到整体清晰度与噪声平衡。

<!-- source: EN PDF p22; unit 96 -->

——本段结束

<!-- source: EN PDF p22; unit 97 -->

#### 1.2   3.1.2 HDR 模式画质调优

<!-- source: EN PDF p22; unit 98 -->

HDR 关注动态范围、亮度、清晰度与噪声、通透性、色彩及运动拖影。亮度主要由 AE、LSC 控制；动态范围主要取决于曝光比；清晰度与噪声涉及 Bayer NR、Demosaic、DPCC、YNR、UVNR、3DNR、sharpen、Edgefilter；通透性涉及 Gamma、Dehaze、Enhance；色彩涉及 AWB、CCM、3DLUT；运动拖影程度取决于 HDR 参数和曝光比。典型场景为逆光人脸或强光车牌采集。整体流程如图 3-13。

<!-- source: EN PDF p22; unit 99 -->

![英文 PDF 原图 22](/docs/rockchip-isp30-tuning/assets/en-p022-X387.png)

<!-- source: EN PDF p22; unit 100 -->

3-13 HDR 图像调优架构

<!-- source: EN PDF p22; unit 101 -->

HDR 调优前需对接传感器、校准镜头模组；对接参见 3.1.1。AWB、Shading、Bayer NR 等可参考线性校准参数；若传感器 HDR 使用 HCG/LCG，需针对不同模式校准 Bayer NR、YUV NR、3DNR。CCM 位于 HDR TMO 后，TMO 破坏数据线性关系，因此 HDR CCM 需适当调整：

<!-- source: EN PDF p22; unit 102 -->

1\. 饱和度校准值约为 80%~90%；

<!-- source: EN PDF p22; unit 103 -->

2\. 个别颜色突兀时，可用 3D lut 微调。

<!-- source: EN PDF p23; unit 104 -->

3\. 适当降低 TMO 对亮度的大幅提升，以减小对色彩还原的影响。亮度不足时，可用 Gamma 与 HDR TMO 联合调试。

<!-- source: EN PDF p23; unit 105 -->

<!-- source: EN PDF p23; unit 106 -->

完成传感器对接及传感器、镜头校准后，下一步优化 HDR 模式下各画质维度。

<!-- source: EN PDF p23; unit 107 -->

HDR 逆光场景提升人脸亮度调试指南

<!-- source: EN PDF p23; unit 108 -->

1\. 亮度维度：

<!-- source: EN PDF p23; unit 109 -->

HDR 亮度主要指 AE 曝光合理性，通过 AE 调整。AE 包含 HDR AE 与线性 AE；HDR AE 的主要区别是通过曝光比确定长短帧曝光时间。权重表、路线、目标值、收敛速度和平滑性等可参考 3.1.1 的亮度小节。

<!-- source: EN PDF p23; unit 110 -->

HDR AE 曝光比决定动态范围，应随场景自适应调整。自动曝光比模式依据场景直方图计算动态范围并得到合理曝光比：亮区细节不过曝、长帧亮度合理。以长帧曝光为基准，通过曝光比确定短帧曝光。

<!-- source: EN PDF p23; unit 111 -->

HDR 亮区优先短帧、暗区使用长帧。逆光人脸处于暗区，提亮步骤如下：

<!-- source: EN PDF p23; unit 112 -->

1\. 调整 AE 权重表、路线、长帧目标值等，提高长帧亮度。

<!-- source: EN PDF p23; unit 113 -->

<!-- source: EN PDF p23; unit 114 -->

2\. 调整 HDR TMO 参数（包括 DetailsLowLight）提高暗部亮度。

<!-- source: EN PDF p23; unit 115 -->

<!-- source: EN PDF p23; unit 116 -->

3\. 限制最大曝光比以控制动态范围，也能一定程度略微提升暗部亮度。

<!-- source: EN PDF p23; unit 117 -->

<!-- source: EN PDF p23; unit 118 -->

![英文 PDF 原图 23](/docs/rockchip-isp30-tuning/assets/en-p023-X392.png)

<!-- source: EN PDF p23; unit 119 -->

3-14 长帧暗区示意

<!-- source: EN PDF p24; unit 120 -->

1\. 合成区域运动拖影维度：

<!-- source: EN PDF p24; unit 121 -->

HDR 合成区分别使用长短帧信息。运动拖影原则上由长短帧曝光时间差及图像内容运动造成，应调整 HDR 模块与 HDR AE 曝光比。曝光比越大，合成区出现拖影的可能性越高。

<!-- source: EN PDF p24; unit 122 -->

1\. 综合场景动态范围与运动拖影，合理调试 HDR AE 曝光比。

<!-- source: EN PDF p24; unit 123 -->

<!-- source: EN PDF p24; unit 124 -->

2\. 相同曝光比下，通过调整短帧曝光时间，减小长短帧曝光时间延迟，从而减轻拖影。

<!-- source: EN PDF p24; unit 125 -->

<!-- source: EN PDF p24; unit 126 -->

3\. 调整 HDR MERGE 的 OECurve_XXX 和 MDCurve_XXX，降低运动导致合成区误用短帧的概率，从而减轻拖尾。

<!-- source: EN PDF p24; unit 127 -->

<!-- source: EN PDF p24; unit 128 -->

![英文 PDF 原图 24](/docs/rockchip-isp30-tuning/assets/en-p024-X396.png)

<!-- source: EN PDF p24; unit 129 -->

3-15 HDR 合成区运动拖影

<!-- source: EN PDF p24; unit 130 -->

场景动态范围维度：

<!-- source: EN PDF p24; unit 131 -->

HDR 动态范围涉及 AE 曝光比、HDR DRC 和 Gamma。调试 DRC 前需黑电平正确、Shading 校准完成、AE 合理、AWB/CCM 校准完成，并预设一组 Gamma 参数。

<!-- source: EN PDF p24; unit 132 -->

如图 3-14，在独立箱体布置类似场景，放入照度计，两侧以 45 度放置可调光 LED 补光灯，即可模拟不同动态范围。

<!-- source: EN PDF p25; unit 133 -->

![英文 PDF 原图 25](/docs/rockchip-isp30-tuning/assets/en-p025-X399.png)

<!-- source: EN PDF p25; unit 134 -->

3-14 动态范围调优场景（原稿重复图号）

<!-- source: EN PDF p25; unit 135 -->

色彩维度：

<!-- source: EN PDF p25; unit 136 -->

色彩调试参考线性模式。HDR Tonemap 使色彩与线性模式略有差异，建议校准后按实际情况适当降低饱和度。

<!-- source: EN PDF p25; unit 137 -->

对比度维度：

<!-- source: EN PDF p25; unit 138 -->

参考线性模式的对比度调试方法。

<!-- source: EN PDF p25; unit 139 -->

清晰度与噪声维度：

<!-- source: EN PDF p25; unit 140 -->

参考线性模式的清晰度与噪声调试方法。

<!-- source: EN PDF p25; unit 141 -->

## 4 模块介绍

<!-- source: EN PDF p25; unit 142 -->

本章介绍各模块功能与参数。参数以 XML 文件形式存储在固件中，部分可用调试工具调整。下文参数说明格式如下：

<!-- source: EN PDF p25; unit 143 -->

" "：表示参数为字符串。

<!-- source: EN PDF p25; unit 144 -->

xxx/yyy：表示 XML 文件中 yyy 元素是 xxx 的子元素。

<!-- source: EN PDF p26; unit 145 -->

### 1.   4.1 AEC

<!-- source: EN PDF p26; unit 146 -->

#### 1.1   4.1.1 功能说明

<!-- source: EN PDF p26; unit 147 -->

AE 主要包含测光统计模块和 AE 控制算法。测光模块为算法提供亮度统计，包括直方图和分块平均亮度。主要统计项：基于 RAW 的 256 段加权直方图、RAW 的 R/G/B/Y 均值；基于 gamma 前 RGB 的 32 段加权直方图，以及其分块 R/G/B/Y 均值。

<!-- source: EN PDF p26; unit 148 -->

AE 算法比较输入亮度统计与目标亮度，计算新曝光，再自动分配传感器曝光时间、曝光增益和镜头光圈，获得合适亮度。

<!-- source: EN PDF p26; unit 149 -->

<!-- source: EN PDF p26; unit 150 -->

![英文 PDF 原图 26](/docs/rockchip-isp30-tuning/assets/en-p026-X403.png)

<!-- source: EN PDF p26; unit 151 -->

图 4-1 AEC 模块示意

<!-- source: EN PDF p26; unit 152 -->

#### 1.2   4.1.2 关键参数

<!-- source: EN PDF p26; unit 153 -->

AEC 按功能大致分为公共控制、线性曝光调试和 HDR 曝光调试参数。本节还介绍曝光相关的 SensorInfo 与 System 参数，具体作用见各模块说明。

<!-- source: EN PDF p26; unit 154 -->

<!-- source: EN PDF p27; unit 155 -->

##### 1.2.1   4.1.2.1 AEC 公共功能控制参数

<!-- source: EN PDF p27; unit 156 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 用户调试参数 |
| AecRunInterval | 调试参数 | 用户调试参数 |
| AecOpType | 调试参数 | 用户调试参数 |
| HistStatsMode | 调试参数 | 用户调试参数，通常使用默认值。 |
| RawStatsMode | 调试参数 | 用户调试参数，通常使用默认值。 |
| YrangeMode | 调试参数 | 用户调试参数，通常使用默认值。 |
| AecSpeed | 调试参数 | 用户调试参数 |
| AecDelayFrmNum | 调试参数 | 用户调试参数 |
| AecFrameRateMode | 调试参数 | 用户调试参数 |
| AecAntiFlicker | 调试参数 | 用户调试参数 |
| AecGridWeight | 调试参数 | 用户调试参数 |
| AecManualCtrl | 调试参数 | 用户调试参数 |

<!-- source: EN PDF p27; unit 157 -->

###### 1.2.1.1   Enable

<!-- source: EN PDF p27; unit 158 -->

【说明】

<!-- source: EN PDF p27; unit 159 -->

AEC 模块开关：0 关闭；1 开启。

<!-- source: EN PDF p27; unit 160 -->

【注意】

<!-- source: EN PDF p27; unit 161 -->

Enable 为 0 时关闭 AEC 算法，曝光保持关闭前的值。

<!-- source: EN PDF p27; unit 162 -->

###### 1.2.1.2   AecRunInterval

<!-- source: EN PDF p27; unit 163 -->

【说明】

<!-- source: EN PDF p27; unit 164 -->

AE 运行间隔范围 [0,255]，默认 0。为 0 时每帧运行；为 1 时每隔 1 帧运行，以此类推。

<!-- source: EN PDF p27; unit 165 -->

不建议设得过大，否则 AE 响应可能缓慢且不平滑。

<!-- source: EN PDF p28; unit 166 -->

###### 1.2.1.3   AecOpType

<!-- source: EN PDF p28; unit 167 -->

【说明】

<!-- source: EN PDF p28; unit 168 -->

曝光模式分为自动 RK_AIQ_OP_MODE_AUTO 和手动 RK_AIQ_OP_MODE_MANUAL。

<!-- source: EN PDF p28; unit 169 -->

手动模式需配合 AecManualCtrl 设置手动曝光值。

<!-- source: EN PDF p28; unit 170 -->

AecManualCtrl 参数详见下文。

<!-- source: EN PDF p28; unit 171 -->

###### 1.2.1.4   HistStatsMode

<!-- source: EN PDF p28; unit 172 -->

【说明】

<!-- source: EN PDF p28; unit 173 -->

AEC 直方图统计有 CAM_HISTV2_MODE_Y/R/G/B/RGB 五种模式，默认 Y。

<!-- source: EN PDF p28; unit 174 -->

###### 1.2.1.5   RawStatsMode

<!-- source: EN PDF p28; unit 175 -->

【说明】

<!-- source: EN PDF p28; unit 176 -->

AEC 亮度统计有 CAM_RAWSTATSV2_MODE_Y/R/G/B 四种模式，默认 Y。

<!-- source: EN PDF p28; unit 177 -->

###### 1.2.1.6   YrangeMode

<!-- source: EN PDF p28; unit 178 -->

【说明】

<!-- source: EN PDF p28; unit 179 -->

AEC 的 Y 通道范围有 CAM_YRANGEV2_MODE_FULL/LIMITED 两种模式，默认 FULL。

<!-- source: EN PDF p28; unit 180 -->

仅当 RawStatsMode 为 Y 模式时有效。

<!-- source: EN PDF p28; unit 181 -->

###### 1.2.1.7   AecGridWeight

<!-- source: EN PDF p28; unit 182 -->

【说明】

<!-- source: EN PDF p28; unit 183 -->

主窗口各子窗口统计权重，共 15x15 个参数。

<!-- source: EN PDF p28; unit 184 -->

【注意】

<!-- source: EN PDF p28; unit 185 -->

3588 硬件支持 5X5、15X15 权重规格。调试文件统一设置 15X15，算法按实际硬件配置压缩或扩展权重。

<!-- source: EN PDF p29; unit 186 -->

###### 1.2.1.8   AecWinScale

<!-- source: EN PDF p29; unit 187 -->

【说明】

<!-- source: EN PDF p29; unit 188 -->

AE 硬件统计窗口尺寸比例配置参数。

<!-- source: EN PDF p29; unit 189 -->

【成员】

<!-- source: EN PDF p29; unit 190 -->

| 成员名称 | 说明 |
| --- | --- |
| InputRaw | 基于原始图像的 AE 硬件统计窗口比例，4 个参数 [h_off,v_off,h_size,v_size]，每项 range=[0,1]。 |
| TmoRaw | 基于 TMO 后 RAW 的 AE 硬件统计窗口比例，4 个参数 [h_off,v_off,h_size,v_size]，每项 range=[0,1]。 |
| Yuv | 基于 YUV 的 AE 硬件统计窗口比例，4 个参数 [h_off,v_off,h_size,v_size]，每项 range=[0,1]。 |

<!-- source: EN PDF p29; unit 191 -->

【注意】

<!-- source: EN PDF p29; unit 192 -->

比例以传感器分辨率为基准，范围 [0,1]。h_off、v_off 为统计窗口左上角相对感光区域的水平、垂直偏移；h_size、v_size 为窗口水平、垂直尺寸。

<!-- source: EN PDF p29; unit 193 -->

传感器分辨率记为 res，实际窗口偏移为 [res x h_off, res x v_off]，实际尺寸为 [res x h_size, res x v_size]。

<!-- source: EN PDF p29; unit 194 -->

窗口偏移与尺寸之和不能超过 1：h_off + h_size &lt;=1，v_off + v_size &lt;=1。

<!-- source: EN PDF p29; unit 195 -->

###### 1.2.1.9   AecManualCtrl

<!-- source: EN PDF p29; unit 196 -->

【说明】

<!-- source: EN PDF p29; unit 197 -->

手动曝光按模式分为 LinearAE、HdrAE 两组参数。

<!-- source: EN PDF p29; unit 198 -->

【成员】

<!-- source: EN PDF p30; unit 199 -->

| 成员名称 | 说明 |
| --- | --- |
| ManualTimeEn | 手动曝光时间使能，默认 1。 |
| ManualGainEn | 手动曝光时间使能，默认 1。 |
| ManualIspDgainEn | 手动 ISP 数字增益使能，默认 1。 |
| TimeValue | 手动曝光时间，单位 s，范围受传感器限制。 |
| GainValue | 手动传感器增益，实际增益值，单位 1x，范围受传感器限制。 |
| IspDGainValue | 手动 ISP 数字增益，实际值，单位 1x，范围受 ISP 限制。 |

<!-- source: EN PDF p30; unit 200 -->

【注意】

<!-- source: EN PDF p30; unit 201 -->

仅 AeOptype = MANUAL 时生效。ManualTimeEn、ManualGainEn、ManualIspDgainEn 全为 1 是手动；任一未使能则为半自动；三者全 0 等同自动，系统报错提醒。

<!-- source: EN PDF p30; unit 202 -->

手动/半手动曝光时间与增益受自动模式最大/最小值限制，超出时用自动模式边界值代替。

<!-- source: EN PDF p30; unit 203 -->

3588 当前不支持 ISP 数字增益，因此 ManualIspDgainEn、IspDGainValue 无效。

<!-- source: EN PDF p30; unit 204 -->

###### 1.2.1.10   AecSpeed

<!-- source: EN PDF p30; unit 205 -->

【说明】

<!-- source: EN PDF p30; unit 206 -->

自动曝光调整速度属性。

<!-- source: EN PDF p30; unit 207 -->

【成员】

<!-- source: EN PDF p31; unit 208 -->

| 成员名称 | 说明 |
| --- | --- |
| DyDampEn | 动态调速开关。开启：曝光调整速度随场景亮度动态变化；关闭：由 DampOver/DampUnder/DampDark2Bright/DampBright2Dark 固定决定。 |
| SmoothEn | 平滑开关。开启：曝光平滑；关闭：取消平滑以加快曝光调整。 |
| DampOver | 环境亮度稳定、图像亮度高于目标时的曝光调整速度，范围 [0,1]。 |
| DampUnder | 环境亮度稳定、图像亮度低于目标时的曝光调整速度，范围 [0,1]。 |
| DampDark2Bright | 环境亮度突变、由暗到亮时的曝光调整速度，范围 [0,1]。 |
| DampBright2Dark | 环境亮度突变、由亮到暗时的曝光调整速度，范围 [0,1]。 |

<!-- source: EN PDF p31; unit 209 -->

【注意事项】

<!-- source: EN PDF p31; unit 210 -->

AE 调整阻尼系数，通过当前与新曝光的权重控制速度：最终曝光值 = 当前曝光值 x DampCoef + 新曝光值 x (1 - DampCoef)。原稿前一句重复“current exposure”，此处按紧随的公式解释。

<!-- source: EN PDF p31; unit 211 -->

阻尼越大，曝光调整越慢，反之越快。为平滑调整，建议范围 [0.4, 0.7]。

<!-- source: EN PDF p31; unit 212 -->

环境亮度突变时用 DampDark2Bright/DampBright2Dark；亮度稳定、AE 收敛时用 DampOver/DampUnder。建议前者小于后者，DampDark2Bright 小于 DampBright2Dark，DampOver 小于 DampUnder。

<!-- source: EN PDF p31; unit 213 -->

###### 1.2.1.11   AecDelayFrmNum

<!-- source: EN PDF p31; unit 214 -->

【说明】

<!-- source: EN PDF p31; unit 215 -->

自动曝光触发延迟属性。

<!-- source: EN PDF p31; unit 216 -->

【成员】

<!-- source: EN PDF p32; unit 217 -->

| 成员名称 | 说明 |
| --- | --- |
| BlackDelay | 自动曝光触发延时：图像亮度低于目标并持续超过 BlackDelay 帧时，AE 开始调整。 |
| WhiteDelay | 自动曝光触发延时：图像亮度高于目标并持续超过 WhiteDelay 帧时，AE 开始调整。 |

<!-- source: EN PDF p32; unit 218 -->

【注意事项】

<!-- source: EN PDF p32; unit 219 -->

BlackDelay/WhiteDelay 不宜过大，否则 AE 触发响应过慢。

<!-- source: EN PDF p32; unit 220 -->

###### 1.2.1.12   AecFrameRateMode

<!-- source: EN PDF p32; unit 221 -->

【说明】

<!-- source: EN PDF p32; unit 222 -->

自动曝光帧率模式分固定帧率和自动降帧。

<!-- source: EN PDF p32; unit 223 -->

【成员】

<!-- source: EN PDF p32; unit 224 -->

| 成员名称 | 说明 |
| --- | --- |
| isFpsFix | 固定帧率模式：默认 0 为自动帧率，1 为固定帧率。 |
| FpsValue | 仅固定帧率模式有效；默认 0 使用驱动默认帧率，非 0 使用设定值。 |

<!-- source: EN PDF p32; unit 225 -->

【注意事项】

<!-- source: EN PDF p32; unit 226 -->

固定帧率需启用 isFpsFix。FpsValue 为 0 时使用驱动默认帧率，否则使用设定值。最大曝光时间由帧率和 AecRoute 最大曝光共同限制；AecRoute 超过固定帧率限制时由算法校正。

<!-- source: EN PDF p32; unit 227 -->

自动降帧设置 isFpsFix = 0，FpsValue 无效。最低帧率由 AecRoute 最大曝光时间和 SensorInfo 的 CISMinFps 共同决定；AecRoute 超过 CISMinFps 允许值时算法校正。曝光分解后，若时间超过默认帧率允许值，则修改 vblank 降帧、延长曝光；否则恢复驱动默认帧率。具体实现依赖 AecRoute：设置增益阈值，超过阈值触发降帧。

<!-- source: EN PDF p33; unit 228 -->

###### 1.2.1.13   AecAntiFlicker

<!-- source: EN PDF p33; unit 229 -->

【说明】

<!-- source: EN PDF p33; unit 230 -->

自动曝光工频防闪烁属性。

<!-- source: EN PDF p33; unit 231 -->

【成员】

<!-- source: EN PDF p33; unit 232 -->

| 成员名称 | 说明 |
| --- | --- |
| enable | 抗工频闪烁使能：1 开启，反之关闭。 |
| Frequency | 工频选择：AECV2_FLICKER_FREQUENCY_50HZ 或 AECV2_FLICKER_FREQUENCY_60HZ。 |
| Mode | 抗工频闪烁模式：AECV2_ANTIFLICKER_NORMAL_MODE、AECV2_ANTIFLICKER_AUTO_MODE；通过各模式调整曝光时间实现抗闪烁。 |

<!-- source: EN PDF p33; unit 233 -->

【注意事项】

<!-- source: EN PDF p33; unit 234 -->

enable 为 0 时关闭防闪烁。

<!-- source: EN PDF p33; unit 235 -->

NORMAL 模式将最小曝光及调整步长固定为 1/120 s（60Hz）或 1/100 s（50Hz），高亮环境可能过曝；照明环境中曝光匹配光源频率，可避免闪烁。

<!-- source: EN PDF p33; unit 236 -->

AUTO 模式按亮度调整，最短可达传感器最小曝光。相比 NORMAL，高亮时可抑制过曝，但此时防闪失效。

<!-- source: EN PDF p33; unit 237 -->

需按场景和产品选择模式，无法在所有条件下完全消除工频闪烁。原文 NOMRAL（拼写保留）能完全抑制闪烁，但强光可能过曝、丢失信息；AUTO 避免过曝，但强光会闪烁，建议帧率 30fps（60HZ）或 25fps（50HZ）。

<!-- source: EN PDF p33; unit 238 -->

###### 1.2.1.14   AecEnvLvCalib

<!-- source: EN PDF p33; unit 239 -->

【说明】

<!-- source: EN PDF p33; unit 240 -->

环境亮度校准参数。

<!-- source: EN PDF p33; unit 241 -->

【成员】

<!-- source: EN PDF p34; unit 242 -->

| 成员名称 | 说明 |
| --- | --- |
| CalibFNumber | 环境亮度校准参考的相对光圈，与镜头有关。 |
| CurveCoeff | 环境亮度校准曲线系数 |

<!-- source: EN PDF p34; unit 243 -->

【注意事项】

<!-- source: EN PDF p34; unit 244 -->

此参数暂时无效，环境亮度校准功能暂不可用。

<!-- source: EN PDF p34; unit 245 -->

##### 1.2.2   4.1.2.2 AEC 线性曝光调试参数

<!-- source: EN PDF p34; unit 246 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| RawStatsEn | 调试参数 | 用户调试参数，通常使用默认值。 |
| EvBias | 调试参数 | 用户调试参数 |
| ToleranceIn/Out | 调试参数 | 用户调试参数 |
| StrategyMode | 调试参数 | 用户调试参数 |
| Route | 调试参数 | 用户调试参数 |
| InitExp | 调试参数 | 用户调试参数 |
| DySetpoint | 调试参数 | 用户调试参数 |
| BackLightCtrl | 调试参数 | 用户调试参数 |
| OverExpCtrl | 调试参数 | 用户调试参数 |

<!-- source: EN PDF p34; unit 247 -->

###### 1.2.2.1   RawStatsEn

<!-- source: EN PDF p34; unit 248 -->

【说明】

<!-- source: EN PDF p34; unit 249 -->

线性曝光可选择 RAW 域或 RGB 域亮度统计，根据应用切换；默认使用 RAW 统计，即设为 1。

<!-- source: EN PDF p34; unit 250 -->

RawStatsEn = 0：使用 gamma 前 RGB 统计计算曝光。

<!-- source: EN PDF p34; unit 251 -->

RawStatsEn = 1：使用减黑电平并乘白平衡增益后的 RAW 统计计算曝光。

<!-- source: EN PDF p34; unit 252 -->

【注意事项】

<!-- source: EN PDF p34; unit 253 -->

3588 当前线性曝光仅支持 RAW 统计，因此只能设为 1，0 无效。

<!-- source: EN PDF p35; unit 254 -->

###### 1.2.2.2   ToleranceIn/Out

<!-- source: EN PDF p35; unit 255 -->

【说明】

<!-- source: EN PDF p35; unit 256 -->

自动曝光调整的亮度容差，单位 %，范围 [0,100]。

<!-- source: EN PDF p35; unit 257 -->

AE 收敛时，亮度 B 应位于 [真实有效目标亮度 X(1-tolerance/100), 真实有效目标亮度 X(1+Tolerance/100)]。

<!-- source: EN PDF p35; unit 258 -->

ToleranceIn 为未收敛时容差，ToleranceOut 为收敛后容差。建议 ToleranceIn &lt; ToleranceOut，避免对曝光变化过敏，保持稳定。

<!-- source: EN PDF p35; unit 259 -->

###### 1.2.2.3   EvBias

<!-- source: EN PDF p35; unit 260 -->

【说明】

<!-- source: EN PDF p35; unit 261 -->

自动曝光量的百分比偏移，单位 %，范围 [-200, +200]。

<!-- source: EN PDF p35; unit 262 -->

用于特殊场景调整固定/动态目标亮度 SetPoint/NightSetPoint。真实有效目标亮度为 `(SetPoint/ NightSetPoint)*[1+abs(EvBias)/100]^[EvBias/abs(EvBias)]`。

<!-- source: EN PDF p35; unit 263 -->

EvBias=100 时亮度为默认参数的两倍；EvBias=-100 时为 1/2。

<!-- source: EN PDF p35; unit 264 -->

【注意事项】

<!-- source: EN PDF p35; unit 265 -->

若 toleranceIn/Out 较大，一方面影响 AE 响应速度，另一方面影响 EvBias；EvBias 调整间隔小于 toleranceIn/Out 时，亮度调整可能不生效。

<!-- source: EN PDF p35; unit 266 -->

###### 1.2.2.4   StrategyMode

<!-- source: EN PDF p35; unit 267 -->

【说明】

<!-- source: EN PDF p35; unit 268 -->

自动曝光策略：高光优先或低照度优先。

<!-- source: EN PDF p35; unit 269 -->

【注意事项】

<!-- source: EN PDF p35; unit 270 -->

此参数当前无效。

<!-- source: EN PDF p35; unit 271 -->

###### 1.2.2.5   Route

<!-- source: EN PDF p35; unit 272 -->

【说明】

<!-- source: EN PDF p35; unit 273 -->

自动曝光分解策略，用于设置 AE 路线。算法计算的曝光按设定路线分配，可按需求设置曝光时间（快门）优先、增益优先或光圈优先。

<!-- source: EN PDF p35; unit 274 -->

【成员】

<!-- source: EN PDF p36; unit 275 -->

LinearAE

<!-- source: EN PDF p36; unit 276 -->

| 成员名称 | 说明 |
| --- | --- |
| TimeDot | 曝光时间节点，单位秒。 |
| GainDot | 传感器增益节点，实际增益，单位 1x。 |
| IspgainDot | ISO 数字增益节点，实际增益，单位 1x（原文写 ISO）。 |
| PIrisDot | 光圈等效增益节点，实际增益，单位 1x。 |

<!-- source: EN PDF p36; unit 277 -->

【注意事项】

<!-- source: EN PDF p36; unit 278 -->

![英文 PDF 原图 36](/docs/rockchip-isp30-tuning/assets/en-p036-X449.png)

<!-- source: EN PDF p36; unit 279 -->

图 4-2 曝光分解示意

<!-- source: EN PDF p36; unit 280 -->

曝光分解曲线节点数不限，建议至少 6 个，避免分解过渡不平滑。

<!-- source: EN PDF p36; unit 281 -->

节点曝光量是曝光时间、传感器增益、ISP 数字增益、光圈等效增益等分量的乘积，必须单调增加，即后节点大于前节点。原文随后写“第一节点最小，第二节点最大”，与不限节点数表述存在疑点，保留待核。

<!-- source: EN PDF p36; unit 282 -->

曝光时间单位为秒，最小允许 0；代码会按传感器限制修正实际最小曝光时间。

<!-- source: EN PDF p36; unit 283 -->

光圈分量仅支持 P-Iris，不支持 DC-Iris。P-iris 等效增益仅在启用 Airis 自动光圈时有效，否则光圈固定为默认值。计算详见 AecIrisCtrl。

<!-- source: EN PDF p36; unit 284 -->

设置的路线并非最终路线。各曝光分量最终上下限由分解节点和手动配置共同决定。第一次校正：节点上下限未超出传感器/ISP 限制则保留，超出则按硬件限制处理。手动配置值为 0 时使用第一次校正的路线；非 0 且未超硬件限制时进行第二次校正，节点范围以手动值为准；手动值超硬件限制时使用第一次校正结果。相邻节点曝光增加时，只应增加一个分量，其余固定；增加的分量决定该段分配策略，例如仅增益增加，则该段为增益优先。

<!-- source: EN PDF p37; unit 285 -->

<!-- source: EN PDF p37; unit 286 -->

3588 不支持 ISP 数字增益，因此 IspgainDot 无效。

<!-- source: EN PDF p37; unit 287 -->

###### 1.2.2.6   InitExp

<!-- source: EN PDF p37; unit 288 -->

【说明】

<!-- source: EN PDF p37; unit 289 -->

线性曝光模式初始值设置。

<!-- source: EN PDF p37; unit 290 -->

【成员】

<!-- source: EN PDF p37; unit 291 -->

| 成员名称 | 说明 |
| --- | --- |
| InitTimeValue | 初始曝光时间，单位秒。 |
| InitGainValue | 初始传感器增益，实际值，单位 1x。 |
| InitIspDGainValue | 初始 ISP 数字增益，实际值，单位 1x。 |
| InitPIrisGainValue | 初始 P 光圈等效增益，实际值，单位 1x。 |
| InitDCIrisDutyValue | 初始 DC 光圈占空比，范围 [0,100]。 |

<!-- source: EN PDF p37; unit 292 -->

【注意事项】

<!-- source: EN PDF p37; unit 293 -->

初始 AE 未设置（各值为 0）时使用系统默认值。

<!-- source: EN PDF p37; unit 294 -->

AE 初值受分解曲线上下限约束，超出时以对应边界值替代。

<!-- source: EN PDF p37; unit 295 -->

P 光圈等效增益初值仅在 P 光圈类型有效，默认对应其最大光圈的等效增益。含义见光圈调试 IrisCtrl。

<!-- source: EN PDF p37; unit 296 -->

DC 光圈占空比初值仅在 DC 类型有效，默认 MaxPwmValue，此时 DC-iris 以最大速度打开。占空比和 MaxPwmValue 含义见 IrisCtrl。

<!-- source: EN PDF p37; unit 297 -->

3588 不支持 ISP 数字增益，因此 InitIspDGainValue 无效。

<!-- source: EN PDF p38; unit 298 -->

###### 1.2.2.7   DySetpoint

<!-- source: EN PDF p38; unit 299 -->

【说明】

<!-- source: EN PDF p38; unit 300 -->

动态目标亮度设置。

<!-- source: EN PDF p38; unit 301 -->

【成员】

<!-- source: EN PDF p38; unit 302 -->

| 成员名称 | 说明 |
| --- | --- |
| ExpLevel | 动态曝光节点，值为当前曝光值，数量不限，建议至少 6 个，避免过渡不平滑（原文写 prevent ... smooth，疑似漏否定）。 |
| DySetpoint | 曝光节点越大，目标亮度节点越小，二者一一对应。节点数量不限，建议至少 6 个以避免过渡不平滑（原文疑似漏否定）。 |

<!-- source: EN PDF p38; unit 303 -->

【注意事项】

<!-- source: EN PDF p38; unit 304 -->

ExpLevel 为当前曝光值，即 Curgain * Curtime。

<!-- source: EN PDF p38; unit 305 -->

固定目标值可将 DySetpoint 所有节点设为同值。

<!-- source: EN PDF p38; unit 306 -->

DySetpoint 节点值应随 ExpLevel 平滑变化，避免闪烁。

<!-- source: EN PDF p38; unit 307 -->

###### 1.2.2.8   BackLightCtrl

<!-- source: EN PDF p38; unit 308 -->

【说明】

<!-- source: EN PDF p38; unit 309 -->

逆光补偿通过提高逆光暗区亮度恢复暗部细节。

<!-- source: EN PDF p38; unit 310 -->

【成员】

<!-- source: EN PDF p39; unit 311 -->

| 成员名称 | 说明 |
| --- | --- |
| Enable | 使能位：1 开启，0 关闭。 |
| MeasArea | 暗区检测区域，共 6 种模式：AECV2_MEASURE_AREA_AUTO/UP/BOTTOM/LEFT/RIGHT/CENTER。 |
| LumaDistTh | 区域生长容差 |
| OEROILowTh | 过曝区域最小亮度，用于区分过曝与非过曝区域。 |
| LvHighTh | 环境亮度高阈值 |
| LvLowTh | 环境亮度低阈值 |
| ExpLevel | 动态曝光节点，值为当前曝光 gain*time（time 单位 s）。数量不限，建议至少 6 个以平滑过渡（原文否定措辞异常）。 |
| NonOEPdfHighTh | 非过曝面积比例阈值 (0~1)，节点数量不限，建议至少 6 个以平滑过渡；数量与 ExpLevel 相同，值一一对应。 |
| LowLightPdfTh | 暗区比例阈值 (0~1)，节点数量不限，建议至少 6 个以平滑过渡；数量与 ExpLevel 相同，值一一对应。 |
| TargetLLLuma | 动态暗区节点数量不限，建议至少 6 个以平滑过渡；数量与 ExpLevel 相同、值一一对应，随 ExpLevel 增加而减小。 |

<!-- source: EN PDF p39; unit 312 -->

【注意事项】

<!-- source: EN PDF p39; unit 313 -->

关键是确定逆光暗区（关注区）位置，再增加曝光提亮。MeasArea 支持 AUTO、UP、BOTTOM、LEFT、RIGHT、CENTER 六种模式；AUTO 自动检测，其余为手动指定暗区位置。

<!-- source: EN PDF p39; unit 314 -->

AUTO 按子窗口亮度分布和场景逆光概率寻找暗区。逆光概率主要由环境亮度因子 Lv_fac、暗区比例因子 DarkPdf_fac、对比度因子 Contrast_fac 组成，相关参数如下。

<!-- source: EN PDF p39; unit 315 -->

环境亮度 Lv=meanluma/exp/1000，其中 exp=gain*time，单位 s。

<!-- source: EN PDF p40; unit 316 -->

LvHighTh 为环境高亮阈值，越大越不易触发逆光补偿，越小越易触发，类似区分室内外亮度的阈值。原文推荐式为 `LvHighTh=setpoint/`，分母缺失，保留待核。仅 MeasArea=AUTO 有效。

<!-- source: EN PDF p40; unit 317 -->

LvLowTh 为环境低亮阈值，越大越不易触发逆光补偿，反之更易。类似区分室内明暗环境的阈值。原文此处仍推荐 `LvHighTh=setpoint/`，名称及缺分母均保留待核。仅 AUTO 有效。

<!-- source: EN PDF p40; unit 318 -->

上述阈值用于计算环境亮度因子。LowLightPdfTh 是暗区占比阈值，影响暗区比例因子；占比不宜过大，否则容易触发补偿，使室内过亮。建议明亮环境控制在 20% 内，环境变暗时增大暗区占比。仅 AUTO 有效。

<!-- source: EN PDF p40; unit 319 -->

![英文 PDF 原图 40](/docs/rockchip-isp30-tuning/assets/en-p040-X461.png)

<!-- source: EN PDF p40; unit 320 -->

图 4-3 逆光 MeasArea 区域

<!-- source: EN PDF p40; unit 321 -->

UP/BOTTOM/LEFT/RIGHT/CENTER 为手动模式。指定区低于暗区目标亮度时增曝提亮；高于目标则认为不是暗区或非逆光场景，由全局亮度决定增减曝光。即仅指定区低于暗区目标时启用补偿。

<!-- source: EN PDF p40; unit 322 -->

TargetLLLuma 为暗区目标亮度，不宜超过全局目标的 50%，建议 40%~50%，否则逆光场景可能过亮。MeasArea 任何值均有效。

<!-- source: EN PDF p40; unit 323 -->

###### 1.2.2.9   OverExpCtrl

<!-- source: EN PDF p40; unit 324 -->

【说明】

<!-- source: EN PDF p40; unit 325 -->

强光抑制模块通过降低曝光减轻画面过曝。

<!-- source: EN PDF p40; unit 326 -->

【成员】

<!-- source: EN PDF p41; unit 327 -->

| 成员名称 | 说明 |
| --- | --- |
| Enable | 使能位：1 开启，0 关闭。 |
| HighLightTh | 高光区亮度阈值，范围 [0,255]。 |
| LowLightTh | 低亮区亮度阈值，范围 [0,255]。 |
| MaxWeight | 最大权重值 |
| OEPdf | 过曝面积比例，节点数量不限，建议至少 6 个以平滑过渡；比例从小到大，范围 [0,1]。 |
| HighLightWeight | 高光区权重，节点数量不限，建议至少 6 个以平滑过渡；对应过曝面积比例节点，最大受 MaxWeight 限制。 |
| LowLightWeight | 低亮区权重，节点数量不限，建议至少 6 个以平滑过渡；对应过曝面积比例节点，最大受 MaxWeight 限制。 |

<!-- source: EN PDF p41; unit 328 -->

【注意事项】

<!-- source: EN PDF p41; unit 329 -->

HighLightTh 为高亮阈值，其上区域权重 HighLightWeight；LowLightTh 为低亮阈值，其下区域权重 LowLightWeight；二者之间权重在 LowLightWeight 与 HighLightWeight 间插值。

<!-- source: EN PDF p41; unit 330 -->

HighLightWeight 越大，强光抑制越强；LowLightWeight 越大，抑制越弱。建议分别为 1~4、0.7~1。

<!-- source: EN PDF p41; unit 331 -->

若所有存在过曝区的场景均强烈抑制，会使许多场景整体过暗。HighLightWeight 不宜过大，建议随过曝面积比例增加而降低，避免过度压暗。

<!-- source: EN PDF p41; unit 332 -->

启用强光抑制时，建议同时启用线性 TMO，避免暗区过暗。

<!-- source: EN PDF p42; unit 333 -->

##### 1.2.3   4.1.2.3 AEC HDR 曝光调试参数

<!-- source: EN PDF p42; unit 334 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| ToleranceIn/Out | 调试参数 | 用户调试参数 |
| StrategyMode | 调试参数 | 用户调试参数 |
| EvBias | 调试参数 | 用户调试参数 |
| ExpRatioCtrl | 调试参数 | 用户调试参数 |
| Route | 调试参数 | 用户调试参数 |
| InitExp | 调试参数 | 用户调试参数 |
| LongFrmMode | 调试参数 | 用户调试参数 |
| LframeCtrl | 调试参数 | 用户调试参数 |
| MframeCtrl | 调试参数 | 用户调试参数 |
| SframeCtrl | 调试参数 | 用户调试参数 |

<!-- source: EN PDF p42; unit 335 -->

###### 1.2.3.1   ToleranceIn/Out

<!-- source: EN PDF p42; unit 336 -->

【说明】

<!-- source: EN PDF p42; unit 337 -->

画面亮度容差，单位 %，范围 [0,100]。

<!-- source: EN PDF p42; unit 338 -->

AE 收敛时，亮度 B 应位于 [真实有效目标亮度 X(1-tolerance/100), 真实有效目标亮度 X(1+Tolerance/100)]。

<!-- source: EN PDF p42; unit 339 -->

ToleranceIn 为未收敛时容差，ToleranceOut 为收敛后容差。建议 ToleranceIn &lt; ToleranceOut，避免对曝光变化过敏，保持稳定。

<!-- source: EN PDF p42; unit 340 -->

###### 1.2.3.2   StrategyMode

<!-- source: EN PDF p42; unit 341 -->

【说明】

<!-- source: EN PDF p42; unit 342 -->

自动曝光策略：高光优先或低照度优先。

<!-- source: EN PDF p42; unit 343 -->

【成员】

<!-- source: EN PDF p42; unit 344 -->

高光优先：AECV2_STRATEGY_MODE_HIGHLIGHT_PRIOR。

<!-- source: EN PDF p42; unit 345 -->

低照度优先：AECV2_STRATEGY_MODE_LOWLIGHT_PRIOR。

<!-- source: EN PDF p42; unit 346 -->

【注意事项】

<!-- source: EN PDF p42; unit 347 -->

不同曝光比模式下行为不同，参见 ExpRatioCtrl。

<!-- source: EN PDF p43; unit 348 -->

###### 1.2.3.3   EvBias

<!-- source: EN PDF p43; unit 349 -->

【说明】

<!-- source: EN PDF p43; unit 350 -->

曝光量百分比偏移，范围 [-200, +200]%，用于特殊场景调整目标亮度。真实有效目标为原目标 X [1+abs(EvBias)/100]^[EvBias/abs(EvBias)]。

<!-- source: EN PDF p43; unit 351 -->

EvBias=100 时目标为默认两倍；EvBias=-100 时为 1/2。

<!-- source: EN PDF p43; unit 352 -->

【注意事项】

<!-- source: EN PDF p43; unit 353 -->

若 toleranceIn/Out 较大，一方面影响 AE 响应速度，另一方面影响 EvBias；EvBias 调整间隔小于 toleranceIn/Out 时，亮度调整可能不生效。

<!-- source: EN PDF p43; unit 354 -->

###### 1.2.3.4   InitExp

<!-- source: EN PDF p43; unit 355 -->

【说明】

<!-- source: EN PDF p43; unit 356 -->

HDR 曝光初值设置。

<!-- source: EN PDF p43; unit 357 -->

【成员】

<!-- source: EN PDF p43; unit 358 -->

| 成员名称 | 说明 |
| --- | --- |
| InitTimeValue | 初始曝光时间，单位秒。 |
| InitGainValue | 初始传感器增益，实际值，单位 1x。 |
| InitIspDGainValue | 初始 ISP 数字增益，实际值，单位 1x。 |
| InitPIrisGainValue | 初始 P 光圈等效增益，实际值，单位 1x。 |
| InitDCIrisDutyValue | 初始 DC 光圈占空比，范围 [0,100]。 |

<!-- source: EN PDF p43; unit 359 -->

【注意事项】

<!-- source: EN PDF p43; unit 360 -->

初始 AE 未设置（各值为 0）时使用系统默认值。

<!-- source: EN PDF p43; unit 361 -->

AE 初值受分解曲线上下限约束，超出时以对应边界值替代。

<!-- source: EN PDF p43; unit 362 -->

部分传感器有特殊要求，例如 os04a10 要求短帧初始曝光小于 0.005s。

<!-- source: EN PDF p43; unit 363 -->

P 光圈等效增益初值仅 P 光圈有效，默认对应最大光圈的等效增益；含义见 AecIrisCtrl。

<!-- source: EN PDF p44; unit 364 -->

DC 光圈占空比初值仅 DC 光圈有效，默认 MaxPwmValue，使 DC-iris 以最大速度打开；占空比及 MaxPwmValue 见 AecIrisCtrl。

<!-- source: EN PDF p44; unit 365 -->

3588 不支持 ISP 数字增益，因此 InitIspDGainValue 无效。

<!-- source: EN PDF p44; unit 366 -->

###### 1.2.3.5   Route

<!-- source: EN PDF p44; unit 367 -->

【说明】

<!-- source: EN PDF p44; unit 368 -->

自动曝光分解策略，用于设置 AE 路线。算法计算的曝光按设定路线分配，可按需求设置曝光时间（快门）优先、增益优先或光圈优先。

<!-- source: EN PDF p44; unit 369 -->

【成员】

<!-- source: EN PDF p44; unit 370 -->

| 成员名称 | 说明 |
| --- | --- |
| Frm0/1/2TimeDot | 曝光时间节点，单位秒。HDR 两帧仅 Frm0/1TimeDot 有效，三帧 Frm0/1/2TimeDot 有效。原文称 FRM0~3 是曝光由短到长的帧号（数量表述待核对）。 |
| Frm0/1/2GainDot | 传感器增益节点。HDR 两帧用 Frm0/1GainDot，三帧用 Frm0/1/2GainDot；实际增益，单位 1x。原文 FRM0~3 表示曝光由短到长的帧号。 |
| Frm0/1/2IspDGainDot | ISP 数字增益节点。HDR 两帧用 Frm0/1IspDGainDot，三帧用 Frm0/1/2IspDGainDot；实际增益，单位 1x。原文 FRM0~3 表示曝光由短到长的帧号。 |
| PIrisDot | 光圈等效增益节点，实际值，单位 1x。 |

<!-- source: EN PDF p44; unit 371 -->

【注意事项】

<!-- source: EN PDF p44; unit 372 -->

![英文 PDF 原图 44](/docs/rockchip-isp30-tuning/assets/en-p044-X449.png)

<!-- source: EN PDF p44; unit 373 -->

图 4-2 曝光分解示意（原稿重复图号）

<!-- source: EN PDF p44; unit 374 -->

分解曲线节点不限，建议至少 6 个以保证平滑。

<!-- source: EN PDF p45; unit 375 -->

两帧 HDR 设置 Frm0/1TimeDot、Frm0/1GainDot、Frm0/1IspDGainDot，分别对应短、长帧；三帧设置 Frm0/1/2TimeDot、Frm0/1/2GainDot、Frm0/1/2IspDGainDot，分别对应短、中、长帧。各帧曝光时间应合理分配，总和不能超过帧率允许的最大曝光时间！

<!-- source: EN PDF p45; unit 376 -->

节点曝光量是曝光时间、传感器增益、ISP 数字增益、光圈等效增益等分量的乘积，必须单调增加，即后节点大于前节点。原文随后写“第一节点最小，第二节点最大”，与不限节点数表述存在疑点，保留待核。

<!-- source: EN PDF p45; unit 377 -->

曝光时间单位为秒，最小允许 0；代码会按传感器限制修正实际最小曝光时间。

<!-- source: EN PDF p45; unit 378 -->

光圈分量仅支持 P-Iris，不支持 DC-Iris。P-iris 等效增益仅在启用 Airis 自动光圈时有效，否则光圈固定为默认值。计算详见 AecIrisCtrl。

<!-- source: EN PDF p45; unit 379 -->

配置的路线不是最终路线。各分量实际上下限同时由分解节点和手动配置决定：节点值未超传感器/ISP 限制时保留，否则先按硬件限制校正。手动配置为 0 时采用第一次校正结果；非 0 且未超硬件限制时再次按手动范围校正；手动值超限时仍采用第一次校正结果。

<!-- source: EN PDF p45; unit 380 -->

相邻节点曝光增长时，只增加一个分量，其余固定；该分量决定此段策略，例如仅增益增加就是增益优先。

<!-- source: EN PDF p45; unit 381 -->

3588 当前不支持 ISP 数字增益，Frm0/1/2ispDGainDot 无效。

<!-- source: EN PDF p45; unit 382 -->

###### 1.2.3.6   ExpRatioCtrl

<!-- source: EN PDF p45; unit 383 -->

【说明】

<!-- source: EN PDF p45; unit 384 -->

HdrAE 曝光比控制模块。

<!-- source: EN PDF p45; unit 385 -->

【成员】

<!-- source: EN PDF p46; unit 386 -->

| 成员名称 | 说明 |
| --- | --- |
| ExpRatioType | 曝光比模式，仅 HDR 多帧合成有效。AUTO：根据场景自动计算长短帧曝光比；FIX：固定长短帧曝光比。 |
| RatioExpDot | 曝光节点，用于根据曝光量动态设置固定或最大曝光比，一一对应。数量不限，建议至少 6 个以平滑过渡。 |
| M2SRatioFix | 节点数量不限，建议至少 6 个以平滑过渡，数量与 RatioExpDot 一致。ExpRatioType = AUTO 时无效；FIX 时为中短帧曝光比，对应 RatioExpDot。 |
| L2MRatioFix | 节点数量不限，建议至少 6 个以平滑过渡，数量与 RatioExpDot 一致。AUTO 无效；FIX 时为长中帧曝光比，对应 RatioExpDot。HDR 两帧无效、三帧有效。 |
| M2SRatioMax | 节点数量不限，建议至少 6 个以平滑过渡，数量与 RatioExpDot 一致。AUTO 时为中短帧动态最大曝光比，对应 RatioExpDot；FIX 无效。 |
| L2MRatioMax | 节点数量不限，建议至少 6 个以平滑过渡，数量与 RatioExpDot 一致。AUTO 时为长中帧动态最大曝光比，对应 RatioExpDot；仅 HDR 三帧有效，两帧和 FIX 无效。 |

<!-- source: EN PDF p46; unit 387 -->

【注意事项】

<!-- source: EN PDF p46; unit 388 -->

ExpRatioType=AUTO 使用自动曝光比。两帧时长短比上限为 M2SratioMax；三帧时中短比上限为 M2SratioMax、长中比上限为 L2MratioMax。无额外最小比限制，但不得小于 1。FIX 使用固定比：两帧长短比 M2SRatioFix；三帧中短比 M2SRatioFix、长中比 L2MratioFix。

<!-- source: EN PDF p46; unit 389 -->

自动比、两帧 HDR 中，算法算出的长短比超过 M2SratioMax 时，按 StrategyMode 确定优先帧。HIGHLIGHT_PRIOR 保证短帧，长帧曝光 = 短帧曝光 * M2SratioMax；LOWLIGHT_PRIOR 保证长帧，短帧曝光 = 长帧曝光 / M2SratioMax。三帧同理：HIGHLIGHT_PRIOR 优先较短帧，LOWLIGHT_PRIOR 优先较长帧。

固定比、两帧 HDR 中，HIGHLIGHT_PRIOR 以短帧为准，长帧曝光 = 短帧曝光 * M2SRatioFix；LOWLIGHT_PRIOR 以长帧为准，短帧曝光 = 长帧曝光 / M2SRatioFix。三帧类推（原文结尾写“3 fps HDR mode”，这里说明其上下文，同时保留此疑点）。

<!-- source: EN PDF p47; unit 390 -->

<!-- source: EN PDF p47; unit 391 -->

###### 1.2.3.7   LongFrmMode

<!-- source: EN PDF p47; unit 392 -->

【说明】

<!-- source: EN PDF p47; unit 393 -->

HdrAE 长帧模式功能控制。

<!-- source: EN PDF p47; unit 394 -->

【成员】

<!-- source: EN PDF p47; unit 395 -->

| 成员名称 | 说明 |
| --- | --- |
| Mode | 长帧模式：NORMAL/AUTO_LONGFRAME/LONGFRAME。NORMAL：正常 HDR，AE 与合成模块按手动/自动曝光比工作。AUTO_LONGFRAME：曝光超过阈值时长帧时间接近单帧允许最大值，合成仅输出长帧。LONGFRAME：AE 将短帧时间设最小，长帧接近单帧最大值，合成仅输出长帧。 |
| SfrmMinLine | 长帧/自动长帧模式的短帧最小曝光行数。受传感器限制，可能无法达到传感器允许的最小行数，须单独设置。 |
| LfrmModeExpTh | 自动长帧模式中，长帧曝光超过 LfrmModeExpTh 时切换到长帧模式。 |

<!-- source: EN PDF p47; unit 396 -->

###### 1.2.3.8   LframeCtrl

<!-- source: EN PDF p47; unit 397 -->

【说明】

<!-- source: EN PDF p47; unit 398 -->

长帧参数：两帧 HdrAE 的长帧须兼顾普通动态范围和逆光，故有全局与暗区两个亮度目标。长帧全局亮度需处于全局目标容差内，同时暗区亮度应不低于暗区目标。

<!-- source: EN PDF p47; unit 399 -->

【成员】

<!-- source: EN PDF p48; unit 400 -->

| 成员名称 | 说明 |
| --- | --- |
| OEROILowTh | 过曝区最低亮度，用于区分过曝与非过曝区。 |
| LvHighTh | 环境亮度高阈值 |
| LvLowTh | 环境亮度低阈值 |
| LExpLevel | 节点数量不限，建议至少 6 个以平滑过渡。ExpLevel =gain*time（time 单位 s）。 |
| LSetPoint | 节点数量与 LExpLevel 相同，值逐一对应。 |
| NonOEPdfHighTh | 非过曝面积比例阈值 (0~1)，节点数量与 LExpLevel 一致，值一一对应。 |
| LowLightPdfTh | 节点数量与 LExpLevel 一致，值一一对应，并随 ExpLevel 增加而增加。 |
| TargetLLLuma | 动态长帧暗区节点数量与 LExpLevel 相同，值一一对应，随 ExpLevel 增加而减少。 |

<!-- source: EN PDF p48; unit 401 -->

【注意事项】

<!-- source: EN PDF p48; unit 402 -->

环境亮度 Lv=meanluma/exp/1000，exp=gain*time，单位 s。

<!-- source: EN PDF p48; unit 403 -->

LvHighTh 为环境高亮阈值，越大越难触发逆光补偿，类似室内外亮度分界。原文推荐 `LvHighTh=setpoint/` 缺分母，保留待核。

<!-- source: EN PDF p48; unit 404 -->

LvLowTh 为环境低亮阈值，越大越难触发补偿，类似室内明暗分界。原文仍写 `LvHighTh=setpoint/`，名称与缺分母均保留待核。

<!-- source: EN PDF p48; unit 405 -->

环境亮度高低阈值用于计算环境亮度因子。

<!-- source: EN PDF p48; unit 406 -->

LowLightPdfTh 为暗区比例阈值，影响暗区因子。不宜过大，否则易触发逆光补偿导致室内过亮。建议亮环境中暗区占比控制在 20% 内，随环境变暗增加。

<!-- source: EN PDF p48; unit 407 -->

暗区目标不宜超过全局目标 50%，建议为 40%~50%，否则逆光场景可能过亮。

<!-- source: EN PDF p49; unit 408 -->

###### 1.2.3.9   MframeCtrl

<!-- source: EN PDF p49; unit 409 -->

【说明】

<!-- source: EN PDF p49; unit 410 -->

中帧调试参数（仅在 HDR 三帧模式下有效）

<!-- source: EN PDF p49; unit 411 -->

【成员】

<!-- source: EN PDF p49; unit 412 -->

| 成员名称 | 说明 |
| --- | --- |
| MExpLevel | 动态中帧曝光节点，数量不限，建议至少 6 个以平滑过渡。ExpLevel = gain*time（time 单位 s）。 |
| MSetPoint | 动态中帧全局目标亮度，节点数量与 MExpLevel 一致、值一一对应；曝光越大，目标越低。 |

<!-- source: EN PDF p49; unit 413 -->

###### 1.2.3.10   SframeCtrl

<!-- source: EN PDF p49; unit 414 -->

【说明】

<!-- source: EN PDF p49; unit 415 -->

短帧调试参数

<!-- source: EN PDF p49; unit 416 -->

【成员】

<!-- source: EN PDF p49; unit 417 -->

| 成员名称 | 说明 |
| --- | --- |
| SExpLevel | 动态短帧最大曝光节点，数量不限，建议至少 6 个以平滑过渡。ExpLevel = gain*time（time 单位 s）。 |
| SSetPoint | 动态短帧全局平均目标亮度，原文要求节点与 MExpLevel 一一对应（名称待核对）。同区间高光目标亮度须高于全局目标。 |
| TargetHLLuma | 动态短帧高光区平均目标，原文要求数量和值与 MExpLevel 逐一对应。 |
| HLLumaTolerance | 短帧高光目标容差百分比，单位 %。 |
| HLROIExpandEn | 短帧高光区域扩展使能：1 忽略小高光区域、降低敏感度；0 抑制所有高光区亮度、提高敏感度。 |

<!-- source: EN PDF p50; unit 418 -->

##### 1.2.4   4.1.2.4 AEC 模块光圈调试参数

<!-- source: EN PDF p50; unit 419 -->

IrisCtrl

<!-- source: EN PDF p50; unit 420 -->

【说明】

<!-- source: EN PDF p50; unit 421 -->

光圈控制参数

<!-- source: EN PDF p50; unit 422 -->

【成员】

<!-- source: EN PDF p50; unit 423 -->

| 成员名称 | 说明 |
| --- | --- |
| Enable | 自动光圈控制使能 |
| IrisType | 光圈类型：P（P-iris）或 DC（DC-iris）。 |
| ManualEn | 手动光圈使能 |
| InitAttr | 光圈初始值参数 |
| DCIrisAttr | DC 光圈控制参数 |

<!-- source: EN PDF p50; unit 424 -->

ManualAttr

<!-- source: EN PDF p50; unit 425 -->

| 成员名称 | 说明 |
| --- | --- |
| PIrisGainValue | 手动 P 光圈等效增益，实际值、单位 1x，受光圈器件限制，范围 [1,1024]。 |
| DCIrisHoldValue | 手动 DC 光圈 HoldValue，与器件相关，范围 [0,100]。 |

<!-- source: EN PDF p50; unit 426 -->

InitAttr

<!-- source: EN PDF p50; unit 427 -->

| 成员名称 | 说明 |
| --- | --- |
| PIrisGainValue | P 光圈初始等效增益，实际值、单位 1x，受器件限制，范围 [1,1024]。 |
| DCIrisHoldValue | DC 光圈 HoldValue，与器件相关，范围 [0,100]。 |

<!-- source: EN PDF p50; unit 428 -->

PIrisAttr

<!-- source: EN PDF p51; unit 429 -->

| 成员名称 | 说明 |
| --- | --- |
| TotalStep | P-iris 步进电机总步数，取决于镜头。 |
| EffcStep | P-iris 步进电机可用步数，取决于镜头。 |
| ZeroIsMax | step0 是否对应最大光圈，取决于镜头。0：step0 对应最小光圈；1：对应最大光圈。 |
| StepTable | P-iris 电机位置到光圈等效增益的映射表，取决于镜头。 |

<!-- source: EN PDF p51; unit 430 -->

DCIrisAttr

<!-- source: EN PDF p52; unit 431 -->

| 成员名称 | 说明 |
| --- | --- |
| Kp | 限制亮度剧变时光圈开关速度的比例系数；值越大，变化越慢。过大时制动提前、调节过久；过小时制动滞后、过冲增大。合理值取决于 DC-iris 镜头及电路特性，建议 0.5，范围 [0,1]。 |
| Ki | 调节光圈开关速度的积分系数，值越大速度越快。过大易过冲振荡；过小调节缓慢，环境亮度突变时也易振荡。建议 0.2，范围 [0,1]。 |
| Kd | 调节光圈开关速度的微分系数，值越大速度越快。建议 0.3，范围 [0,1]。 |
| MinPwmDuty | 最小 PWM 占空比，单位 %，与 DC-iris 镜头和电路有关。越小关闭越快，但易振荡。范围 [0,100]，默认 0。 |
| MaxPwmDuty | 最大 PWM 占空比，单位 %，与 DC-iris 镜头和电路有关。越大打开越快；过小可能尚未最大开度就退出控制。范围 [0,100]，默认 100。 |
| OpenPwmDuty | 光圈打开的 PWM 阈值：占空比严格大于 OpenPwmDuty 时打开。与 DC-iris 镜头有关，单位 %，范围 [0,100]。 |
| ClosePwmDuty | 光圈关闭的 PWM 阈值：占空比严格小于 ClosePwmDuty 时关闭。与 DC-iris 镜头有关，单位 %，范围 [0,100]。 |

<!-- source: EN PDF p52; unit 432 -->

【注意事项】

<!-- source: EN PDF p52; unit 433 -->

关闭自动光圈功能后，DC-iris 光圈默认开至最大；P-iris 光圈默认移动到最大光圈对应的步进电机位置。若需改变上述光圈位置，可修改 InitAttr 模块中的 PIrisGainValue 和 DCIrisHoldValue。

<!-- source: EN PDF p52; unit 434 -->

ManualIrisEn：启用手动光圈控制。当 IrisType 为 P 光圈时，仅 PirisGainValue 有效；当类型为 DC 光圈时，仅 DCIrisHoldValue 有效。

<!-- source: EN PDF p52; unit 435 -->

DCIrisHoldValue：在手动模式下直接设置电机 PWM 占空比，范围为 [0,100]。手动设置 HoldValue（即 DCIrisAttr 中 ClosePwmDuty 到 OpenPwmDuty 范围内的值）时，DC 光圈保持当前大小；设定值大于 OpenPwmDuty 时，光圈打开，值越大打开速度越快；设定值小于 ClosePwmDuty 时，光圈关闭，值越小关闭速度越快。

<!-- source: EN PDF p53; unit 436 -->

自动光圈 Airis 算法的基本控制流程如下：

<!-- source: EN PDF p53; unit 437 -->

对于 DC-iris 镜头，Airis 根据当前亮度与目标亮度的偏差控制光圈大小。当曝光达到最小值且当前亮度超过目标亮度容差范围时，退出 AE 控制，固定曝光时间和曝光增益，进入 AIRIS 控制范围。若当前画面亮度稳定且 DC-iris 的 PWM 占空比大于 OpenPwmDuty，则认为光圈已达到最大，退出 Airis 光圈控制，将控制权交还 AE。

<!-- source: EN PDF p53; unit 438 -->

对于 P-iris 镜头，通过 AecRoute 模块控制光圈。将 P-iris 的光圈大小转换为等效增益，参与曝光分解计算。

<!-- source: EN PDF p53; unit 439 -->

P-iris 步进电机位置与光圈等效增益映射表 StepTable，通常根据镜头厂商提供的电机位置与光圈大小对应关系制作。P-iris 由 AE 的 AecRoute 模块控制，该模块将光圈大小转换为等效增益，因此要求 P-iris 控制具有良好线性度。等效增益范围为 [1,1024]：F1.0 对应 1024，F1.4 对应 512，以此类推，F32.0 对应 1。制表时，须将各电机位置对应的光圈转换为等效增益，填入 StepTable，并按电机位置递增顺序排列（step0、step1…stepN）。

<!-- source: EN PDF p53; unit 440 -->

TotalStep 表示 P-iris 步进电机总步数，其值取决于镜头。EffcStep 表示可用步数，通常小于 TotalStep。靠近光圈关闭端的位置，其等效增益对应值误差较大，光圈调节时容易振荡，因此通常不使用靠近关闭端的步进位置。

<!-- source: EN PDF p53; unit 441 -->

表 4-1 给出 P-iris 步进电机位置、光圈孔径面积和等效增益的对应关系，以下以该表说明 StepTable 的设置。表中第 1–2 列和第 4–5 列的步进位置与光圈面积关系由镜头厂商提供。该镜头步进电机共有 81 个调节步，step0 时光圈最大，标称最大光圈为 1.4。光圈数 1.4 对应等效增益 512，因此 step0 的等效增益为 512。以 step3 为例，光圈面积为 195.869，对应等效增益 = 512* (195.869/201.062)=499（四舍五入）；其他位置可依此计算。原文随后引用“表 1-1”：接近关闭端时，光圈面积很小，与最大面积可相差数千倍，对应等效增益误差较大，因此建议不使用靠近关闭端的位置，以免误差引起曝光振荡。将表中各位置的等效增益按步进位置递增顺序（step0、step1…stepN）填入 StepTable。

<!-- source: EN PDF p53; unit 442 -->

DC-iris 的 OpenPwmDuty 和 ClosePwmDuty 需实测，数值与镜头有关。某些镜头在 PWM 占空比大于 OpenPwmDuty 时打开光圈；原文写“小于 OpenPwmDuty 时关闭光圈”，同时又规定大于等于 ClosePwmDuty 且小于等于 OpenPwmDuty 时光圈保持当前位置，该区间内的值称为 HoldValue（上述阈值叙述存在重叠，保留待核对）。另一些镜头只有一个开关阈值：PWM 占空比高于此阈值时打开，低于此阈值时关闭，等于阈值时保持当前位置，即 HoldValue。此时可以设置 ClosePwmDuty = OpenPwmDuty = HoldValue。

<!-- source: EN PDF p54; unit 443 -->

<!-- source: EN PDF p54; unit 444 -->

表 4-1 P-iris 步进电机位置、光圈孔径及等效增益对应表

<!-- source: EN PDF p55; unit 445 -->

| 步进位置 | 光圈面积 (mm2) | 等效增益 | 步进位置 | 光圈面积 (mm2) | 等效增益 |
| --- | --- | --- | --- | --- | --- |
| 0 | 201.062 | 512 | 41 | 56.653 | 144 |
| 1 | 200.759 | 511 | 42 | 53.438 | 136 |
| 2 | 198.583 | 506 | 43 | 50.282 | 128 |
| 3 | 195.869 | 499 | 44 | 47.188 | 120 |
| 4 | 192.879 | 491 | 45 | 44.159 | 112 |
| 5 | 189.677 | 483 | 46 | 41.197 | 105 |
| 6 | 186.293 | 474 | 47 | 38.307 | 98 |
| 7 | 182.744 | 465 | 48 | 35.49 | 90 |
| 8 | 179.035 | 456 | 49 | 32.751 | 83 |
| 9 | 175.271 | 446 | 50 | 30.093 | 77 |
| 10 | 171.484 | 437 | 51 | 27.519 | 70 |
| 11 | 167.681 | 427 | 52 | 25.034 | 64 |
| 12 | 163.865 | 417 | 53 | 22.642 | 58 |
| 13 | 160.036 | 408 | 54 | 20.347 | 52 |
| 14 | 156.198 | 398 | 55 | 18.154 | 46 |
| 15 | 152.351 | 388 | 56 | 16.068 | 41 |
| 16 | 148.499 | 378 | 57 | 14.096 | 36 |
| 17 | 144.642 | 368 | 58 | 12.245 | 31 |
| 18 | 140.783 | 359 | 59 | 10.522 | 27 |
| 19 | 136.925 | 349 | 60 | 8.935 | 23 |
| 20 | 133.069 | 339 | 61 | 7.484 | 19 |
| 21 | 129.217 | 329 | 62 | 6.169 | 16 |
| 22 | 125.371 | 319 | 63 | 4.987 | 13 |
| 23 | 121.535 | 309 | 64 | 3.936 | 10 |
| 24 | 117.709 | 300 | 65 | 3.014 | 8 |
| 25 | 113.897 | 290 | 66 | 2.22 | 6 |
| 26 | 110.1 | 280 | 67 | 1.55 | 4 |
| 27 | 106.321 | 271 | 68 | 1.003 | 3 |
| 28 | 102.562 | 261 | 69 | 0.577 | 1 |

<!-- source: EN PDF p56; unit 446 -->

| 步进位置 | 光圈面积 (mm2) | 等效增益 | 步进位置 | 光圈面积 (mm2) | 等效增益 |
| --- | --- | --- | --- | --- | --- |
| 29 | 98.826 | 252 | 70 | 0.268 | 1 |
| 30 | 95.115 | 242 | 71 | 0.075 | 0 |
| 31 | 91.431 | 233 | 72 | 关闭 | 0 |
| 32 | 87.777 | 224 | 73 | 关闭 | 0 |
| 33 | 84.156 | 214 | 74 | 关闭 | 0 |
| 34 | 80.569 | 205 | 75 | 关闭 | 0 |
| 35 | 77.02 | 196 | 76 | 关闭 | 0 |
| 36 | 73.51 | 187 | 77 | 关闭 | 0 |
| 37 | 70.043 | 178 | 78 | 关闭 | 0 |
| 38 | 66.621 | 170 | 79 | 关闭 | 0 |
| 39 | 63.247 | 161 | 80 | 关闭 | 0 |
| 40 | 59.923 | 153 |  |  |  |

<!-- source: EN PDF p56; unit 447 -->

##### 1.2.5   4.1.2.5 AEC 模块同步测试参数

<!-- source: EN PDF p56; unit 448 -->

SyncTest

<!-- source: EN PDF p56; unit 449 -->

【说明】

<!-- source: EN PDF p56; unit 450 -->

曝光与统计同步测试功能支持按给定帧间隔循环设置 N 组不同曝光值。通过循环设置这些曝光，可测试传感器曝光时间、曝光增益及 DCG 切换的生效帧数是否正确，也可测试曝光线性度，从而确认曝光时间、增益的寄存器值转换公式及相关参数是否正确。

<!-- source: EN PDF p56; unit 451 -->

【成员】

<!-- source: EN PDF p56; unit 452 -->

| 成员名称 | 说明 |
| --- | --- |
| Enable | 曝光与统计同步测试使能 |
| IntervalFrm | 曝光切换间隔帧数 |
| AlterExp | 曝光切换参数 |

<!-- source: EN PDF p56; unit 453 -->

AlterExp

<!-- source: EN PDF p56; unit 454 -->

按模式分为 LinearAE 和 HdrAE 两组参数。

<!-- source: EN PDF p57; unit 455 -->

| 成员名称 | 说明 |
| --- | --- |
| TimeValue | 曝光时间值 |
| GainValue | 曝光增益值 |
| IspDgainValue | ISP 数字增益值 |
| DcgMode | DCG 模式值 |
| PIrisGainValue | P-iris 等效增益 |

<!-- source: EN PDF p57; unit 456 -->

##### 1.2.6   4.1.2.5 sensorinfo 参数

<!-- source: EN PDF p57; unit 457 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Gain2Reg | CIS 驱动参数 | 以 CIS 数据手册为准，非调试参数。 |
| Time2Reg | CIS 驱动参数 | 依据 CIS 数据手册，非调试参数，通常保持默认值无需修改。 |
| CISGainSet | CIS 驱动参数 | 以 CIS 数据手册为准，非调试参数。 |
| CISTimeSet | CIS 驱动参数 | 以 CIS 数据手册为准，非调试参数。 |
| CISHdrSet | CIS 驱动参数 | 以 CIS 数据手册为准，非调试参数。 |
| CISDcgSet | CIS 驱动参数 | 以 CIS 数据手册为准，非调试参数。 |
| CISExpUpdate | CIS 驱动参数 | 以 CIS 数据手册为准，非调试参数。 |
| CISMinFps | CIS 驱动参数 | 通常使用默认值，需要更低帧率时可修改。 |
| CISFlip | 调试参数 | 用户调试参数，按产品应用设置翻转、镜像。 |

<!-- source: EN PDF p57; unit 458 -->

sensorinfo 参数模块由驱动或调试人员填写，用于提供与曝光相关的 CIS 参数信息，便于调试。调试前须确认这些参数与传感器数据手册一致，否则可能出现曝光闪烁、HDR 效果异常等问题。

<!-- source: EN PDF p58; unit 459 -->

###### 1.2.6.1   Gain2Reg

<!-- source: EN PDF p58; unit 460 -->

【说明】

<!-- source: EN PDF p58; unit 461 -->

配置传感器增益到寄存器值的转换公式。不同厂商的公式大致分为线性（包括分段线性、反比例）与非线性。非线性主要针对 Sony 等厂商，目前仅支持 dB 模式增益转换公式。

<!-- source: EN PDF p58; unit 462 -->

【成员】

<!-- source: EN PDF p58; unit 463 -->

| 成员名称 | 说明 |
| --- | --- |
| GainMode | 增益转换公式模式：EXPGAIN_MODE_NONLINEAR_DB 非线性，EXPGAIN_MODE_LINEAR 线性。 |
| GainRange | 线性增益转换公式，支持分段线性；GainMode = EXPGAIN_MODE_LINEAR 时有效。 |

<!-- source: EN PDF p58; unit 464 -->

【注意事项】

<!-- source: EN PDF p58; unit 465 -->

转换公式中的传感器增益指总增益：total gain = again*dgain。若 again 与 dgain 的转换公式不同，可分段设置，如上图所示，并相应调整 size。

<!-- source: EN PDF p58; unit 466 -->

线性传感器增益到寄存器值的公式由 3 个系数（M0、C0、C1）构成，说明如下：

<!-- source: EN PDF p58; unit 467 -->

转换公式（设置到驱动）：reg = (gain^M0)*C1 - C0+ 0.5

<!-- source: EN PDF p58; unit 468 -->

XML 参数对应关系：

<!-- source: EN PDF p58; unit 469 -->

第 1 列：增益区间起始值；第 2 列：增益区间结束值；第 3 列：C1；第 4 列：C0。

<!-- source: EN PDF p58; unit 470 -->

<!-- source: EN PDF p58; unit 471 -->

第 5 列：M0；第 6 列：增益起始值对应的 reg；第 7 列：增益结束值对应的 reg。

<!-- source: EN PDF p58; unit 472 -->

<!-- source: EN PDF p58; unit 473 -->

GainMode = EXPGAIN_MODE_NONLINEAR_DB 时使用非线性转换，目前仅支持 dB 模式，对应公式为 reg = 20xlog10(gain)x10/3。该公式无需填写，算法默认使用它。

<!-- source: EN PDF p58; unit 474 -->

对于支持 DCG 且转换公式为线性的传感器，GainRange 填写 LCG 的增益转换公式。

<!-- source: EN PDF p58; unit 475 -->

【示例】

<!-- source: EN PDF p58; unit 476 -->

s5kgm1sp

<!-- source: EN PDF p58; unit 477 -->

该传感器的模拟与数字增益转换公式不同。如图 4-3、4-4，模拟增益寄存器值是模拟增益的 32 倍，数字增益寄存器值是数字增益的 256 倍。

<!-- source: EN PDF p59; unit 478 -->

![英文 PDF 原图 59](/docs/rockchip-isp30-tuning/assets/en-p059-X517.png)

模拟增益公式为 `gain = x / 0x20`。S5KGM1ST03 的模拟增益为全局增益，不支持逐通道增益；`gain = x / 32`，最大支持 X16。

<!-- source: EN PDF p59; unit 479 -->

图 4-3 模拟增益到寄存器值示例

<!-- source: EN PDF p59; unit 480 -->

![英文 PDF 原图 59](/docs/rockchip-isp30-tuning/assets/en-p059-X518.png)

SMIA 增益寄存器接口支持粗调及 1/256 单位的小数增益。四个 Bayer 通道数字增益分别由四个参数控制；应用数字增益时，结果的 LSB(s) 应补零。表 15：数字增益示例。

| 增益值 | api_rw_digital_gain_code_XXX 寄存器值 |
| --- | --- |
| X1 | 0x0100 |
| X2 | 0x0200 |
| X3 | 0x0300 |
| X8 | 0x0800 |
| X16 | 0x1000 |

<!-- source: EN PDF p59; unit 481 -->

图 4-4 数字增益到寄存器值示例

<!-- source: EN PDF p59; unit 482 -->

已知 s5kgm1sp 的最大模拟增益为 16X，最大数字增益为 16X，total gain = again*dgain。Total gain &lt;=16X 时，again 有效，dgain=1X；Total gain &gt; 16X 时，again = 16X，dgain 有效。因此须分别配置总增益 [1,16] 倍和 [16,256] 倍区间的转换公式，具体如下：

<!-- source: EN PDF p59; unit 483 -->

[1.0000 16.0000 32.0000 0.0000 1.0000 32.0000 512.0000 16.0000 256.0000 16.0000 -512.0000 1.0000 768.0000 4608.0000 ]

<!-- source: EN PDF p59; unit 484 -->

总增益 [16,256] 倍区间内，模拟增益固定为 16X（a_reg=16x32=512），数字增益 d_reg = dgain x 256，故寄存器值 reg=a_reg+d_reg = 512 + Total gain /16 x 256 = 512 + Total gain x 16，即 M0=1、C0=-512、C1=16。应用下发的总增益寄存器值（下称 reg）需按如下方式修改：

<!-- source: EN PDF p59; unit 485 -->

```c
  if(reg <= 0x200){
      a_reg = reg;
      d_reg = 0x0100;
  }else{
      a_reg = 0x200;
      d_reg = reg-0x200;
  }
```

<!-- source: EN PDF p59; unit 486 -->

###### 1.2.6.2   Time2Reg

<!-- source: EN PDF p59; unit 487 -->

【说明】

<!-- source: EN PDF p59; unit 488 -->

将传感器曝光时间转换为寄存器曝光行数的公式由 4 个系数（C0、C1、C2、C3）构成。

<!-- source: EN PDF p59; unit 489 -->

转换公式：line = C0*VTS + C1 + C2 * (time * pclk / HTS + C3)。XML 参数依次为 C0、C1、C2、C3。反向计算曝光时间：

<!-- source: EN PDF p60; unit 490 -->

Time = ((line - C0 x vts - C1) / C2 - C3)*hts/pclk

<!-- source: EN PDF p60; unit 491 -->

【注意事项】

<!-- source: EN PDF p60; unit 492 -->

默认 4 个系数为 0、0、1、0.5，得到的曝光行数以 1 行为步长递增。通常无需修改。

<!-- source: EN PDF p60; unit 493 -->

###### 1.2.6.3   CISGainSet

<!-- source: EN PDF p60; unit 494 -->

【说明】

<!-- source: EN PDF p60; unit 495 -->

CIS 相关增益设置

<!-- source: EN PDF p60; unit 496 -->

【成员】

<!-- source: EN PDF p60; unit 497 -->

| 成员名称 | 说明 |
| --- | --- |
| CISAgainRange | 传感器模拟增益/LCG 的最小、最大值，最小不得低于 1。支持双转换增益时表示 LCG 范围；若以数字增益补精度，可表示总增益范围。 |
| CISExtraAgainRange | 传感器模拟增益 HCG 的最小、最大值，最小不得低于 1。支持 DCG 时表示 HCG 范围；通常 range = CISAgainRange * dcg_ratio，但 ov2718 等例外，以厂商数据手册为准。不支持 DCG 时无效，建议最小最大均填 1 便于参考。 |
| CISDgainRange | 传感器数字增益范围，最小不得低于 1；若数字增益用于补精度，则填 1。 |
| CISIspDgainRange | ISP 数字增益范围，最小不得低于 1。原文称 356x 平台目前不支持 ISP 数字增益，最小最大均填 1。 |
| CISHdrGainIndSetEn | HDR 多帧传感器增益是否独立设置：0 共用增益，如 GC2093；1 各帧可独立设置。仅 HDR stagger 有效，HDR DCG 无效。 |

<!-- source: EN PDF p61; unit 498 -->

###### 1.2.6.4   CISTimeSet

<!-- source: EN PDF p61; unit 499 -->

【说明】

<!-- source: EN PDF p61; unit 500 -->

CIS 曝光时间设置按曝光模式分为 Linear 和 HDR；HDR 又分为两帧和三帧配置。

<!-- source: EN PDF p61; unit 501 -->

【成员】

<!-- source: EN PDF p62; unit 502 -->

| 成员名称 | 说明 |
| --- | --- |
| CISLinTimeRegMaxFac | 线性模式最大曝光行数与 VTS 的关系含 C0、C1：MaxTimeLine = C0*vts – C1。系数见传感器数据手册。 |
| CISHdrTimeRegSumFac | HDR 多帧最大曝光行数之和与 VTS 的关系含 C0、C1。原文公式为 MaxTimeLineSum = C0vts – C1（C0vts 缺运算符且前句散落 *，保留待核对）；系数见数据手册。 |
| CISTimeRegMin | 线性/HDR 模式传感器允许的最小曝光行数（寄存器值），整数。 |
| CISTimeRegOdevity | 线性/HDR 曝光行数奇偶约束：Line = C0*x+C1。无限制 C0=1 C1=0；奇数行 C0=2 C1=1；偶数行 C0=2 C1=0；N 的整数倍 C0=N C1=0。 |
| CISTimeRegUnEqualEn | HDR 各帧 S/M/L 曝光行数相等限制：En=0 允许相等，En=1 不允许相等。 |
| CISTimeRegMax | HDR 最大允许曝光行数（寄存器值），整数。3 个元素：两帧时前 2 项为短、长帧上限；三帧时全部为短、中、长上限。无单帧上限可填 0**（原文符号保留）；非 0 时以该值为限。例如 IMX307 短帧上限 222 行、长帧无限制，填 [222 0 0]。 |

<!-- source: EN PDF p63; unit 503 -->

###### 1.2.6.5   CISTimeSet

<!-- source: EN PDF p63; unit 504 -->

【说明】

<!-- source: EN PDF p63; unit 505 -->

CIS 曝光时间设置按曝光模式分为 Linear 和 HDR；HDR 又分为两帧和三帧配置。

<!-- source: EN PDF p63; unit 506 -->

【成员】

<!-- source: EN PDF p64; unit 507 -->

| 成员名称 | 说明 |
| --- | --- |
| CISLinTimeRegMaxFac | 线性模式最大曝光行数与 VTS 的关系含 C0、C1：MaxTimeLine = C0*vts – C1。系数见传感器数据手册。 |
| CISHdrTimeRegSumFac | HDR 多帧最大曝光行数之和与 VTS 的关系含 C0、C1。原文公式为 MaxTimeLineSum = C0vts – C1（C0vts 缺运算符且前句散落 *，保留待核对）；系数见数据手册。 |
| CISTimeRegMin | 线性/HDR 模式传感器允许的最小曝光行数（寄存器值），整数。 |
| CISTimeRegOdevity | 线性/HDR 曝光行数奇偶约束：Line = C0*x+C1。无限制 C0=1 C1=0；奇数行 C0=2 C1=1；偶数行 C0=2 C1=0；N 的整数倍 C0=N C1=0。 |
| CISTimeRegUnEqualEn | HDR 各帧 S/M/L 曝光行数相等限制：En=0 允许相等，En=1 不允许相等。 |
| CISTimeRegMax | HDR 最大允许曝光行数（寄存器值），整数。3 个元素：两帧时前 2 项为短、长帧上限；三帧时全部为短、中、长上限。无单帧上限可填 0**（原文符号保留）；非 0 时以该值为限。例如 IMX307 短帧上限 222 行、长帧无限制，填 [222 0 0]。 |

<!-- source: EN PDF p65; unit 508 -->

###### 1.2.6.6   CISHdrSet

<!-- source: EN PDF p65; unit 509 -->

【说明】

<!-- source: EN PDF p65; unit 510 -->

HDR 模式相关设置参数

<!-- source: EN PDF p65; unit 511 -->

【成员】

<!-- source: EN PDF p65; unit 512 -->

| 成员名称 | 说明 |
| --- | --- |
| Enable | HDR 使能：0 不支持，1 支持。 |
| Support_mode | HDR 帧模式共四种：MODE_2_LINE/MODE_3_LINE、MODE_2_FRAME/MODE_3_FRAME。 |
| Line_mode | HDR Line_mode 目前仅支持 DCG 和 STAGGER。DOL 等同 STAGGER，统一写作 STAGGER。 |

<!-- source: EN PDF p65; unit 513 -->

###### 1.2.6.7   CISDcgSet

<!-- source: EN PDF p65; unit 514 -->

【说明】

<!-- source: EN PDF p65; unit 515 -->

双转换增益功能的参数模块包含线性和 HDR 模式，用于控制 DCG 切换，要求传感器支持 DCG 模式切换配置。若传感器在内部自行切换 DCG，须关闭本模块。

<!-- source: EN PDF p65; unit 516 -->

【成员】

<!-- source: EN PDF p65; unit 517 -->

| 成员名称 | 说明 |
| --- | --- |
| Support_en | DCG 支持：1 模块参数有效；0 不支持双转换增益。 |
| dcg_optype | DCG 切换模式：RK_AIQ_OP_MODE_AUTO 按阈值切换 LCG/HCG；RK_AIQ_OP_MODE_MANUAL 不自动切换，使用 dcgmode_init 固定值。 |
| dcgmode_init | 各帧 DCG 模式初始值。 |
| dcg_ratio | 转换增益值 |
| sync_switch | 同步切换，仅 HDR 有效。1 各帧以长帧为准同步切换 DCG；0 各帧独立切换。 |
| gain_ctrl | 按曝光增益切换 DCG：lcg2hcg_th 为 LCG→HCG 阈值，hcg2lcg_th 为 HCG→LCG 阈值。 |

<!-- source: EN PDF p65; unit 518 -->

【注意事项】

<!-- source: EN PDF p66; unit 519 -->

本模块控制 DCG 切换，要求传感器支持 DCG 模式切换配置。若传感器在内部自行切换 DCG，须关闭本模块。

<!-- source: EN PDF p66; unit 520 -->

传感器使用 HDR-DCG 模式时，短曝光帧固定为 LCG，长曝光帧固定为 HCG。因此 dcg_optype 应设为 MANUAL；两帧模式 dcgmode_init = [0 1 0]，三帧模式 dcgmode_init = [0 0 1]。

<!-- source: EN PDF p66; unit 521 -->

若传感器不支持双转换增益功能，dcg_ratio 须设为 1。

<!-- source: EN PDF p66; unit 522 -->

###### 1.2.6.8   CISExpUpdate

<!-- source: EN PDF p66; unit 523 -->

【说明】

<!-- source: EN PDF p66; unit 524 -->

曝光生效参数通常可从传感器数据手册获取。部分传感器普通与 HDR 模式下的生效帧数不同，须按模式分别填写。

<!-- source: EN PDF p66; unit 525 -->

【成员】

<!-- source: EN PDF p66; unit 526 -->

| 成员名称 | 说明 |
| --- | --- |
| time_update | 传感器曝光时间生效帧数 |
| gain_update | 传感器曝光增益生效帧数 |
| dcg_update | DCG 模式生效帧数 |

<!-- source: EN PDF p66; unit 527 -->

【注意事项】

<!-- source: EN PDF p66; unit 528 -->

模块数值须依据传感器厂商的数据手册，不能任意设置。错误设置可能导致曝光调整时闪烁。

<!-- source: EN PDF p66; unit 529 -->

一般传感器数据手册会说明曝光时间和增益的生效帧数。如果在第 n 帧写入时间和增益，到第 n+2 帧生效，则 time_delay = 2、gain_delay = 2，以此类推。

<!-- source: EN PDF p66; unit 530 -->

某些传感器的曝光时间与增益生效帧数不同。参数错误可能使曝光调整过程中二者生效不同步，导致闪烁。

<!-- source: EN PDF p66; unit 531 -->

###### 1.2.6.9   CISMinFps

<!-- source: EN PDF p66; unit 532 -->

【说明】

<!-- source: EN PDF p66; unit 533 -->

允许的最低帧率：用于自动降帧模式，限制最低帧率，防止弱光下帧率过低，拖影严重影响效果。

<!-- source: EN PDF p66; unit 534 -->

###### 1.2.6.10   CISFlip

<!-- source: EN PDF p66; unit 535 -->

【说明】

<!-- source: EN PDF p66; unit 536 -->

控制传感器输出图像方向。

<!-- source: EN PDF p67; unit 537 -->

bit 0：镜像控制位。

<!-- source: EN PDF p67; unit 538 -->

bit 1：翻转控制位。

<!-- source: EN PDF p67; unit 539 -->

##### 1.2.7   4.1.2.5 moduleinfo 参数

<!-- source: EN PDF p67; unit 540 -->

【说明】

<!-- source: EN PDF p67; unit 541 -->

模组信息参数，通常从模组数据手册获取。

<!-- source: EN PDF p67; unit 542 -->

【成员】

<!-- source: EN PDF p67; unit 543 -->

| 成员名称 | 说明 |
| --- | --- |
| FNumber | 模组镜头相对光圈，与镜头有关，无需调试。 |
| EFL | 模组镜头焦距，与镜头有关，无需调试。 |
| LensTavg | 镜头透过率，与镜头有关，无需调试。 |
| IRCutTavg | IRCut 透过率，与镜头有关，无需调试。 |

<!-- source: EN PDF p67; unit 544 -->

【注意事项】

<!-- source: EN PDF p67; unit 545 -->

这一部分参数当前无效。

<!-- source: EN PDF p67; unit 546 -->

#### 1.3   4.1.3 调试步骤

<!-- source: EN PDF p67; unit 547 -->

AEC 模块调试主要包括 AE 目标值、曝光分解路径、权重、收敛速度等。ISP 调试前须确认传感器驱动正常、CIS 相关曝光参数正确，避免错误曝光设置。

<!-- source: EN PDF p67; unit 548 -->

调试 AEC 前还须确认 BLC、AWB、LSC、CCM 已校准且功能正确；gamma 模块可使用默认曲线。

<!-- source: EN PDF p67; unit 549 -->

###### 1.3.0.1 步骤 1：设置传感器曝光参数

<!-- source: EN PDF p67; unit 550 -->

如 4.1.2 节所述，正式调试前须确保 SensorInfo 参数正确，以免曝光设置错误或闪烁。这些参数来自传感器原厂数据手册，调试人员及驱动开发者应重点核对。填好参数后，可开启前述 AE 同步测试功能 SyncTest。它循环设置 N 组不同曝光值，测试传感器曝光时间、增益及 DCG 切换生效帧数是否正确，也可测试曝光线性度，从而确认曝光时间和增益的寄存器值转换公式及相关参数。

<!-- source: EN PDF p67; unit 551 -->

若已在校准前确认这些参数，可跳过本步。

<!-- source: EN PDF p68; unit 552 -->

###### 1.3.0.2 步骤 2：设置 AE Weight 参数

<!-- source: EN PDF p68; unit 553 -->

AEC 测光统计模块可统计直方图及分块亮度。将画面等间隔划分为 NXN 块，每块赋予权重；对关注区域可提高权重，因此应按应用需求设置。IPC 场景的关注主体一般位于画面中心，建议提高中心、降低周边权重，突出中心区域；CVR 场景的主体一般位于中下部道路区域，建议提高中下部权重、降低上部天空区域权重。

<!-- source: EN PDF p68; unit 554 -->

![英文 PDF 原图 68](/docs/rockchip-isp30-tuning/assets/en-p068-X550.png)

原始 15×15 AecGridWeight 示例的可编辑转录（225 个值）。

```xml
<AecGridWeight index="1" type="double" size="[15 15]">
  [0 1 1 1 1 1 1 1 1 1 1 1 1 1 0
   1 2 2 2 2 2 2 2 2 2 2 2 2 2 1
   1 2 5 5 5 5 5 5 5 5 5 5 5 2 1
   1 2 5 8 8 8 8 8 8 8 8 8 5 2 1
   1 2 5 8 10 10 10 10 10 10 10 8 5 2 1
   1 2 5 8 10 13 13 13 13 13 10 8 5 2 1
   1 2 5 8 10 13 15 15 15 13 10 8 5 2 1
   1 2 5 8 10 13 15 15 15 13 10 8 5 2 1
   1 2 5 8 10 13 15 15 15 13 10 8 5 2 1
   1 2 5 8 10 13 13 13 13 13 10 8 5 2 1
   1 2 5 8 10 10 10 10 10 10 10 8 5 2 1
   1 2 5 8 8 8 8 8 8 8 8 8 5 2 1
   1 2 5 5 5 5 5 5 5 5 5 5 5 2 1
   1 2 2 2 2 2 2 2 2 2 2 2 2 2 1
   0 1 1 1 1 1 1 1 1 1 1 1 1 1 0]
</AecGridWeight>
```

<!-- source: EN PDF p68; unit 555 -->

图 4-5 AEC 权重参数

<!-- source: EN PDF p68; unit 556 -->

部分芯片硬件支持更多亮度统计分块。为方便调试，调试文件统一设置 15X15 权重，算法内部根据实际分块数扩展。

<!-- source: EN PDF p68; unit 557 -->

###### 1.3.0.3 步骤 3：设置 AE 曝光分解参数

<!-- source: EN PDF p68; unit 558 -->

AE 控制算法计算出的曝光量须分解为传感器曝光时间、传感器增益、ISP 数字增益及光圈分量，并分别设置到对应模块，共同得到目标亮度。AecRoute 模块参数完成分解，参数详见 4.1.2 节。不同场景须设置不同 AecRoute：白天通常限制曝光时间，优先调整增益，避免曝光过长引起运动拖影；夜间通常优先调整曝光时间，再调增益，以提高信噪比和夜间亮度。

<!-- source: EN PDF p68; unit 559 -->

###### 1.3.0.4 步骤 4：设置 AE 目标亮度

<!-- source: EN PDF p68; unit 560 -->

线性曝光模式建议开启动态目标亮度，以适应不同亮度场景。相关参数包括 DySetpoint、ToleranceIn/ToleranceOut、BackLightCtrl、OverExpCtrl 等，详见 4.1.2 节。应在室内静态场景下适用，避免大范围过曝；环境从亮到暗变化时，亮度应平滑过渡。

<!-- source: EN PDF p69; unit 561 -->

<!-- source: EN PDF p69; unit 562 -->

HDR 模式下，目标亮度调试步骤随曝光比模式及 StrategyMode 而异。应据此在对应帧的参数模块中调整目标亮度。长帧参数 LSetPoint、TargetLLLuma 分别表示全局目标亮度和暗区目标亮度；中帧 MSetPoint 表示中帧全局目标亮度；短帧 SSetPoint、TargetHLLuma 分别表示短帧全局目标亮度及高光区目标亮度。各参数详见 4.1.2 节。

<!-- source: EN PDF p69; unit 563 -->

###### 1.3.0.5 步骤 5：设置 AE 收敛与响应速度

<!-- source: EN PDF p69; unit 564 -->

AE 收敛及响应速度影响曝光响应、收敛速度和调整平滑性。相关参数为 AecRunInterval、AecSpeed、AecDelayFrmNum，详见 4.1.2 节。室内静态场景可通过开关灯检测光线突变时的收敛速度。较快收敛可能在亮度缓变时造成过渡不平滑或过冲，须权衡。

<!-- source: EN PDF p69; unit 565 -->

### 2.   4.2 NR 与 SHARP

<!-- source: EN PDF p69; unit 566 -->

ISP 降噪包括 Bayernr 2D、Bayernr 3D、YNR、CNR 四个模块。

<!-- source: EN PDF p69; unit 567 -->

ISP 锐化包含 SHARP 模块。

<!-- source: EN PDF p69; unit 568 -->

![英文 PDF 原图 69](/docs/rockchip-isp30-tuning/assets/en-p069-X556.png)

<!-- source: EN PDF p69; unit 569 -->

NR 处理流程框图

<!-- source: EN PDF p69; unit 570 -->

建议按处理流程顺序调试降噪，各模块须考虑与前后模块的相互影响及综合效果。

<!-- source: EN PDF p69; unit 571 -->

调试时应观察每一步的效果，明确各步骤对降噪的影响。

<!-- source: EN PDF p69; unit 572 -->

观察 Bayernr2D 时，应将未经降噪的原始图与仅开启 Bayernr2D 的图像比较。

<!-- source: EN PDF p69; unit 573 -->

观察原文所称“YNARR”效果时，应比较 Bayernr3D 输出与仅开启 YNR、关闭 SHARP 的图像（YNARR 为原文拼写）。

<!-- source: EN PDF p69; unit 574 -->

其余模块依此类推。

<!-- source: EN PDF p70; unit 575 -->

原文另述 RV1106 与 RK3588 的处理流程差异如下（并非将本指南适用范围扩展为 ArmSoM 实测）：

<!-- source: EN PDF p70; unit 576 -->

1：将 bayer3dnr 提前到 bayer2dnr 之前。

<!-- source: EN PDF p70; unit 577 -->

2：Bayer3DNR 的 BayE3D Gain 指导 Bayer2DNR 对运动和静止区域设置不同降噪强度。

<!-- source: EN PDF p70; unit 578 -->

3：YNR、CNR、SHARP 根据 local gain 模块，对运动和静止区域设置不同降噪强度。

<!-- source: EN PDF p70; unit 579 -->

#### 2.1   4.2.1 Bayer2dnr

<!-- source: EN PDF p70; unit 580 -->

##### 2.1.1   4.2.1.1 功能说明

<!-- source: EN PDF p70; unit 581 -->

Bayernr 2D 主要对 RAW 数据进行空间降噪。模块判断是否为 HDR 模式，并转换降噪强度，同时对 HDR 长、短帧降噪。

<!-- source: EN PDF p70; unit 582 -->

调试时须校准 RAW 数据噪声方差，取得相应校准数据。

<!-- source: EN PDF p70; unit 583 -->

降噪模块根据噪声校准结果建立更符合噪声特性的模型。

<!-- source: EN PDF p70; unit 584 -->

分别支持高信噪比和低信噪比两种噪声校准及参数。

<!-- source: EN PDF p70; unit 585 -->

例如支持双转换增益 DCG 的 CIS：高转换增益 HCG 对应高信噪比模式，低转换增益对应低信噪比模式；原文将后者也写作 HCG，与下文 LCG 说明矛盾，保留待核对。

<!-- source: EN PDF p70; unit 586 -->

![英文 PDF 原图 70](/docs/rockchip-isp30-tuning/assets/en-p070-X561.png)

<!-- source: EN PDF p70; unit 587 -->

Bayernr2D 框图

<!-- source: EN PDF p71; unit 588 -->

##### 2.1.2   4.2.1.2 关键参数

<!-- source: EN PDF p71; unit 589 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| enable | 调试参数 | 常用调试参数 |
| SNR_Mode | 模式参数 | DCG 对应高、低信噪比模式 |
| Sensor_Mode | 模式参数 | 传感器 DCG 模式 |
| ISO | 调试参数 | 常用调试参数 |
| lumapoint | 校准数据 | 由校准工具生成参数 |
| sigma | 校准数据 | 由校准工具生成参数 |
| gauss_guide | 调试参数 | 常用调试参数 |
| filter_strength | 调试参数 | 常用调试参数 |
| edgesofts | 调试参数 | 不常调试的参数 |
| ratio | 调试参数 | 常用调试参数 |
| weight | 调试参数 | 常用调试参数 |
| pix_diff | 调试参数 | 不常调试，工具界面暂未开放，原文称未来开放。 |
| diff_thld | 调试参数 | 不常调试，工具界面暂未开放，原文称未来开放。 |

<!-- source: EN PDF p71; unit 590 -->

###### 2.1.2.1   enable:

<!-- source: EN PDF p71; unit 591 -->

【说明】

<!-- source: EN PDF p71; unit 592 -->

不同像素亮度对应不同噪声 sigma 曲线点，共 16 点。

<!-- source: EN PDF p72; unit 593 -->

###### 2.1.2.2   SNR_Mode

<!-- source: EN PDF p72; unit 594 -->

【说明】

<!-- source: EN PDF p72; unit 595 -->

LCG 与 HCG 对应不同噪声模式。

<!-- source: EN PDF p72; unit 596 -->

HSNR 对应 HCG，LSNR 对应 LCG 模式。

<!-- source: EN PDF p72; unit 597 -->

###### 2.1.2.3   Sensor_Mode

<!-- source: EN PDF p72; unit 598 -->

【说明】

<!-- source: EN PDF p72; unit 599 -->

传感器支持的 HCG、LCG 模式；若不支持 DCG，默认使用 LCG 参数。

<!-- source: EN PDF p72; unit 600 -->

###### 2.1.2.4   ISO

<!-- source: EN PDF p72; unit 601 -->

【说明】

<!-- source: EN PDF p72; unit 602 -->

不同 ISO 档位对应不同调试参数，目前仅支持 13 档。

<!-- source: EN PDF p72; unit 603 -->

###### 2.1.2.5   filter_strength

<!-- source: EN PDF p72; unit 604 -->

【说明】

<!-- source: EN PDF p72; unit 605 -->

降噪强度参数，范围 [0, 16]，值越大降噪越强。

<!-- source: EN PDF p72; unit 606 -->

###### 2.1.2.6   gauss_guide

<!-- source: EN PDF p72; unit 607 -->

【说明】

<!-- source: EN PDF p72; unit 608 -->

是否启用高斯引导：1 开启，0 关闭。

<!-- source: EN PDF p72; unit 609 -->

###### 2.1.2.7   lumapoint/sigma

<!-- source: EN PDF p72; unit 610 -->

【说明】

<!-- source: EN PDF p72; unit 611 -->

校准数据：不同像素亮度对应不同噪声 SIGMA 曲线点，共 16 点。

<!-- source: EN PDF p72; unit 612 -->

LumaPoint 对应横坐标像素亮度，范围 [0, 65535]。

<!-- source: EN PDF p72; unit 613 -->

sigma 对应纵坐标噪声值曲线，范围 [0, 65535]。

<!-- source: EN PDF p73; unit 614 -->

###### 2.1.2.8   edgesofts

<!-- source: EN PDF p73; unit 615 -->

【说明】

<!-- source: EN PDF p73; unit 616 -->

影响空间域权重，范围 [1, 16]，默认 1。

<!-- source: EN PDF p73; unit 617 -->

###### 2.1.2.9   ratio

<!-- source: EN PDF p73; unit 618 -->

【说明】

<!-- source: EN PDF p73; unit 619 -->

软阈值权重，范围 [0, 1.0]，值越小降噪越强。

<!-- source: EN PDF p73; unit 620 -->

范围 [0, 1]，默认 0.01。

<!-- source: EN PDF p73; unit 621 -->

###### 2.1.2.10   weight

<!-- source: EN PDF p73; unit 622 -->

【说明】

<!-- source: EN PDF p73; unit 623 -->

滤波输出的值越大，降噪强度越大。

<!-- source: EN PDF p73; unit 624 -->

范围 [0, 1]，默认 0.5。

<!-- source: EN PDF p73; unit 625 -->

###### 2.1.2.11   pix_diff

<!-- source: EN PDF p73; unit 626 -->

【说明】

<!-- source: EN PDF p73; unit 627 -->

此参数不常调试，工具界面目前未开放，原文称后续会开放。

<!-- source: EN PDF p73; unit 628 -->

双边滤波 5x5 窗口像素差阈值，默认 0x3fff。

<!-- source: EN PDF p73; unit 629 -->

###### 2.1.2.12   diff_thld

<!-- source: EN PDF p73; unit 630 -->

【说明】

<!-- source: EN PDF p73; unit 631 -->

此参数不常调试，工具界面目前未开放，原文称后续会开放。

<!-- source: EN PDF p73; unit 632 -->

双边滤波计算欧氏距离的平方差阈值，默认 0x3ff。

<!-- source: EN PDF p74; unit 633 -->

##### 2.1.3   4.2.1.3 调试步骤

<!-- source: EN PDF p74; unit 634 -->

调试时关闭 Bayernr3D、Ynr、CNR、Sharp 等模块。

<!-- source: EN PDF p74; unit 635 -->

Bayernr2D 抑制影响细节和噪声形态的高频噪声。强度较大时，噪声颗粒变为低频，细节减少。

<!-- source: EN PDF p74; unit 636 -->

调整 bayernr2D 处理强度，在噪声与细节损失之间取得平衡（原文用词为 velocity）。

<!-- source: EN PDF p74; unit 637 -->

低 ISO 下整体降噪较弱，filter_strength 和 weight 较小。

<!-- source: EN PDF p74; unit 638 -->

高 ISO 下建议适当逐渐增加强度，增大 filter_strength 和 weight。

<!-- source: EN PDF p74; unit 639 -->

#### 2.2   4.2.2 BayerTnr

<!-- source: EN PDF p74; unit 640 -->

##### 2.2.1   4.2.2.1 功能说明

<!-- source: EN PDF p74; unit 641 -->

本模块对 RAW 域图像执行时域降噪和软阈值降噪。

<!-- source: EN PDF p74; unit 642 -->

将当前帧和 IIR 帧数据分为低频、高频层，分别处理和降噪。

<!-- source: EN PDF p74; unit 643 -->

本模块调试需要与 Bayernr 2D 相同的校准数据。

<!-- source: EN PDF p74; unit 644 -->

降噪模块根据噪声校准结果建立更符合噪声特性的模型。

<!-- source: EN PDF p74; unit 645 -->

分别支持高、低信噪比两种噪声校准和参数。

<!-- source: EN PDF p74; unit 646 -->

例如支持双转换增益（DCG）的 CIS，高转换增益 HCG 对应高信噪比模式，低转换增益对应低信噪比模式；原文将低转换增益同样写作 HCG，保留此疑点待核对。

<!-- source: EN PDF p74; unit 647 -->

![英文 PDF 原图 74](/docs/rockchip-isp30-tuning/assets/en-p074-X586.png)

<!-- source: EN PDF p74; unit 648 -->

bayernr3d 框图

<!-- source: EN PDF p75; unit 649 -->

##### 2.2.2   4.2.2.2 关键参数

<!-- source: EN PDF p75; unit 650 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常用调试参数 |
| SNR_Mode | 模式参数 | DCG 对应高、低信噪比模式 |
| sensor_Mode | 模式参数 | 传感器 DCG 模式 |
| iso | 调试参数 | 常用调试参数 |
| thumbds | 调试参数 | 不常调试的参数 |
| lo_enable | 调试参数 | 常用调试参数 |
| hi_enable | 调试参数 | 常用调试参数 |
| lo_med_en、lo_gsbay_en、lo_gslum_en | 调试参数 | 不常调试的参数 |
| hi_med_en、hi_gslum_en | 调试参数 | 不常调试的参数 |
| hi_wgt_comp | 调试参数 | 不常调试的参数 |
| clipwgt | 调试参数 | 不常调试的参数 |
| global_pk_en | 调试参数 | 不常调试的参数 |
| global_pksq | 调试参数 | 不常调试的参数 |
| hidif_th | 调试参数 | 不常调试的参数 |
| lo_filter_strength | 调试参数 | 常用调试参数 |
| hi_filter_strength | 调试参数 | 常用调试参数 |
| softwgt | 调试参数 | 常用调试参数 |

<!-- source: EN PDF p76; unit 651 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| lumapoint / sigm | 校准数据 | 由校准工具生成参数 |
| lumapoint2 / lo_sigma | 校准数据 | 由校准工具生成参数 |
| lumapoint2 / hi_sigma | 校准数据 | 由校准工具生成参数 |

<!-- source: EN PDF p76; unit 652 -->

###### 2.2.2.1   Enable:

<!-- source: EN PDF p76; unit 653 -->

【说明】

<!-- source: EN PDF p76; unit 654 -->

Bayernr3d 模块使能位：0 关闭，1 开启。

<!-- source: EN PDF p76; unit 655 -->

###### 2.2.2.2   SNR_Mode

<!-- source: EN PDF p76; unit 656 -->

【说明】

<!-- source: EN PDF p76; unit 657 -->

LCG、HCG 对应不同噪声模式；HSNR 对应 HCG，LSNR 对应 LCG。

<!-- source: EN PDF p76; unit 658 -->

###### 2.2.2.3   sensor_Mode

<!-- source: EN PDF p76; unit 659 -->

【说明】

<!-- source: EN PDF p76; unit 660 -->

传感器不支持 DCG 时，默认使用 LCG 参数。

<!-- source: EN PDF p76; unit 661 -->

###### 2.2.2.4   ISO

<!-- source: EN PDF p76; unit 662 -->

【说明】

<!-- source: EN PDF p76; unit 663 -->

不同 ISO 档位对应不同调试参数，目前仅支持 13 档。

<!-- source: EN PDF p76; unit 664 -->

###### 2.2.2.5   thumbds

<!-- source: EN PDF p76; unit 665 -->

【说明】

<!-- source: EN PDF p76; unit 666 -->

下采样比例，无需调试，默认 8。

<!-- source: EN PDF p76; unit 667 -->

###### 2.2.2.6   lo_enable

<!-- source: EN PDF p76; unit 668 -->

【说明】

<!-- source: EN PDF p76; unit 669 -->

低频运动判断开关：1 开启、0 关闭，默认开启。

<!-- source: EN PDF p77; unit 670 -->

###### 2.2.2.7   hi_enable

<!-- source: EN PDF p77; unit 671 -->

【说明】

<!-- source: EN PDF p77; unit 672 -->

高频运动判断开关：1 开启、0 关闭，默认开启。

<!-- source: EN PDF p77; unit 673 -->

###### 2.2.2.8   lo_med_en、lo_gsbay_en、lo_gslum_en

<!-- source: EN PDF p77; unit 674 -->

【说明】

<!-- source: EN PDF p77; unit 675 -->

内部低频子模块开关：1 开启、0 关闭，默认开启。

<!-- source: EN PDF p77; unit 676 -->

###### 2.2.2.9   hi_med_en、hi_gslum_en

<!-- source: EN PDF p77; unit 677 -->

【说明】

<!-- source: EN PDF p77; unit 678 -->

内部高频子模块开关：1 开启、0 关闭，默认开启。

<!-- source: EN PDF p77; unit 679 -->

###### 2.2.2.10   hi_wgt_comp

<!-- source: EN PDF p77; unit 680 -->

【说明】

<!-- source: EN PDF p77; unit 681 -->

叠加权重补偿比例系数，仅在高频开启时有效。

<!-- source: EN PDF p77; unit 682 -->

默认 0.16，范围 [0.0, 1.0]。

<!-- source: EN PDF p77; unit 683 -->

###### 2.2.2.11   clipwgt

<!-- source: EN PDF p77; unit 684 -->

【说明】

<!-- source: EN PDF p77; unit 685 -->

图像叠加权重限制值。

<!-- source: EN PDF p77; unit 686 -->

默认 0.03215，范围 0.0, 1.0。

<!-- source: EN PDF p77; unit 687 -->

###### 2.2.2.12   global_pk_en

<!-- source: EN PDF p77; unit 688 -->

【说明】

<!-- source: EN PDF p77; unit 689 -->

时域降噪是否使用全局 PK：1 使用，0 不使用。

<!-- source: EN PDF p77; unit 690 -->

当前仅支持 0。

<!-- source: EN PDF p77; unit 691 -->

###### 2.2.2.13   global_pksq

<!-- source: EN PDF p77; unit 692 -->

【说明】

<!-- source: EN PDF p77; unit 693 -->

全局 pk 的平方值，在 global_pk_en 为 1 时使用。

<!-- source: EN PDF p77; unit 694 -->

默认 1024，范围 [0, 268435455]。

<!-- source: EN PDF p78; unit 695 -->

###### 2.2.2.14   hidif_th

<!-- source: EN PDF p78; unit 696 -->

【说明】

<!-- source: EN PDF p78; unit 697 -->

高频差异阈值。

<!-- source: EN PDF p78; unit 698 -->

默认 32767，范围 0, 65535。

<!-- source: EN PDF p78; unit 699 -->

###### 2.2.2.15   lo_filter_strength

<!-- source: EN PDF p78; unit 700 -->

【说明】

<!-- source: EN PDF p78; unit 701 -->

高频运动判断强度，最终影响 Hi Sigma，进而影响时域降噪强度（原文将此说明置于 lo_filter_strength 下，保留待核对）。

<!-- source: EN PDF p78; unit 702 -->

默认 1，范围 [0.0, 16.0]。

<!-- source: EN PDF p78; unit 703 -->

###### 2.2.2.16   hi_filter_strength

<!-- source: EN PDF p78; unit 704 -->

【说明】

<!-- source: EN PDF p78; unit 705 -->

高频运动判断强度，最终影响 Hi Sigma，进而影响时域降噪强度（原文将此说明置于 lo_filter_strength 下，保留待核对）。

<!-- source: EN PDF p78; unit 706 -->

默认 1，范围 [0.0, 16.0]。

<!-- source: EN PDF p78; unit 707 -->

###### 2.2.2.17   softwgt

<!-- source: EN PDF p78; unit 708 -->

【说明】

<!-- source: EN PDF p78; unit 709 -->

软阈值权重，值越大保留噪声越多。

<!-- source: EN PDF p78; unit 710 -->

范围 0.0 1.0，默认 0。

<!-- source: EN PDF p78; unit 711 -->

###### 2.2.2.18   lumapoint / sigma

<!-- source: EN PDF p78; unit 712 -->

【说明】

<!-- source: EN PDF p78; unit 713 -->

不同像素亮度对应的噪声曲线值，共 16 点。

<!-- source: EN PDF p78; unit 714 -->

LumaPoint 对应像素亮度，范围 [0, 65535]。

<!-- source: EN PDF p78; unit 715 -->

sigma 对应噪声曲线值，范围 [0, 65535]。

<!-- source: EN PDF p78; unit 716 -->

###### 2.2.2.19   lumapoint2 / lo_sigma

<!-- source: EN PDF p78; unit 717 -->

【说明】

<!-- source: EN PDF p78; unit 718 -->

不同像素亮度对应的噪声曲线值，共 16 点。

<!-- source: EN PDF p78; unit 719 -->

lumapoint2 对应像素亮度，范围 [0, 65535]。

<!-- source: EN PDF p78; unit 720 -->

lo_sigma 对应噪声曲线值，范围 [0, 65535]。

<!-- source: EN PDF p79; unit 721 -->

###### 2.2.2.20   lumapoint2 / hi_sigma

<!-- source: EN PDF p79; unit 722 -->

【说明】

<!-- source: EN PDF p79; unit 723 -->

不同像素亮度对应的噪声曲线值，共 16 点。

<!-- source: EN PDF p79; unit 724 -->

lumapoint2 对应像素亮度，范围 [0, 65535]。

<!-- source: EN PDF p79; unit 725 -->

hi_sigma 对应噪声曲线值，范围 [0, 65535]。

<!-- source: EN PDF p79; unit 726 -->

##### 2.2.3   4.2.2.3 调试步骤

<!-- source: EN PDF p79; unit 727 -->

关闭 bayernr2d、ynr、cnr、sharp 模块。

<!-- source: EN PDF p79; unit 728 -->

调整 filter_strength、lo_clipwgt、hi_clipwgt，在降噪与拖影之间取得平衡。

<!-- source: EN PDF p79; unit 729 -->

通常时域多帧叠加降噪不改变噪声形态。

<!-- source: EN PDF p79; unit 730 -->

但 Bayernr3D 在多帧叠加后还有软阈值处理，因此会影响噪声形态。

<!-- source: EN PDF p79; unit 731 -->

软阈值处理越强，噪声颗粒频率越低。

<!-- source: EN PDF p79; unit 732 -->

##### 2.2.4   4.2.2.3 调试步骤

<!-- source: EN PDF p79; unit 733 -->

调试时开启 bayernr3d，关闭 ynr、cnr、sharp 等模块。

<!-- source: EN PDF p79; unit 734 -->

Bayernr2D 抑制高频噪声，影响图像细节和噪声形态。强度较大时，噪声颗粒变为低频，细节减少。

<!-- source: EN PDF p79; unit 735 -->

调整 bayernr2D 强度，平衡噪声与细节损失。

<!-- source: EN PDF p79; unit 736 -->

低 ISO 下整体降噪较弱，filter_strength、weight 较小。

<!-- source: EN PDF p79; unit 737 -->

高 ISO 下建议适当逐渐提高强度，增大 filter_strength 和 weight。

<!-- source: EN PDF p79; unit 738 -->

根据运动区域 GAIN 值调整 gain_adj 映射表，提高运动区域降噪强度。

<!-- source: EN PDF p79; unit 739 -->

#### 2.3   4.2.3 YNR

<!-- source: EN PDF p79; unit 740 -->

##### 2.3.1   4.2.3.1 功能说明

<!-- source: EN PDF p79; unit 741 -->

该模块在 YUV 域对图像亮度信号降噪等处理，利用上一帧下采样图像和当前帧进行双边降噪、软阈值降噪、边缘滤波等。

<!-- source: EN PDF p79; unit 742 -->

YNR 使用 GAIN 模块记录的局部噪声大小，对不同局部区域降噪。

<!-- source: EN PDF p80; unit 743 -->

YNR 还以图像中心为原点，沿径向设置不同降噪强度，处理 LSC 对应的边角噪声。

<!-- source: EN PDF p80; unit 744 -->

降噪模块根据噪声校准结果建立更符合噪声特性的模型。

<!-- source: EN PDF p80; unit 745 -->

分别支持高信噪比和低信噪比两种噪声校准及参数。

<!-- source: EN PDF p80; unit 746 -->

例如支持双转换增益 DCG 的 CIS：高转换增益 HCG 对应高信噪比模式，低转换增益对应低信噪比模式；原文将后者也写作 HCG，与下文 LCG 说明矛盾，保留待核对。

<!-- source: EN PDF p80; unit 747 -->

![英文 PDF 原图 80](/docs/rockchip-isp30-tuning/assets/en-p080-X629.png)

<!-- source: EN PDF p80; unit 748 -->

图 4-2-3-1 YNNR 功能框图

#### 4.2.3.2 关键参数

<!-- source: EN PDF p81; unit 749 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常用调试参数 |
| SNR_Mode | 模式参数 | DCG 对应高、低信噪比模式 |
| Sensor_Mode | 模式参数 | 传感器 DCG 模式 |
| iso | 调试参数 | 常用调试参数 |
| ynr_bft3x3_bypass | 调试参数 | 不常调试，切换内部模块。 |
| ynr_lbft5x5_bypass | 调试参数 | 不常调试，切换内部模块。 |
| ynr_lgft3x3_bypass | 调试参数 | 不常调试，切换内部模块。 |
| ynr_flt1x1_bypass | 调试参数 | 不常调试，切换内部模块。 |
| ynr_sft5x5_bypass | 调试参数 | 不常调试，切换内部模块。 |
| ynr_global_gain_alpha | 调试参数 | 不常调试的参数 |
| ynr_global_gain | 调试参数 | 不常调试的参数 |
| ynr_adjust_thres | 调试参数 | 常用调试参数 |
| ynr_adjust_scale | 调试参数 | 常用调试参数 |
| rnr_strength | 调试参数 | 常用调试参数 |
| low_bf | 调试参数 | 常用调试参数 |
| low_thred_adj | 调试参数 | 常用调试参数 |
| low_peak_supress | 调试参数 | 常用调试参数 |
| low_edge_adj_thresh | 调试参数 | 常用调试参数 |

<!-- source: EN PDF p82; unit 750 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| low_lbf_weight_thresh | 调试参数 | 常用调试参数 |
| low_center_weight | 调试参数 | 常用调试参数 |
| low_dist_adj | 调试参数 | 常用调试参数 |
| low_weight | 调试参数 | 常用调试参数 |
| low_filt_strength | 调试参数 | 常用调试参数 |
| low_bi_weight | 调试参数 | 常用调试参数 |
| base_filter_weight | 调试参数 | 不常调试的参数 |
| high_thred_adj | 调试参数 | 常用调试参数 |
| high_weight | 调试参数 | 常用调试参数 |
| high_direction_weight | 调试参数 | 不常调试的参数 |
| hi_min_adj | 调试参数 | 常用调试参数 |
| hi_edge_thed | 调试参数 | 常用调试参数 |
| sigma_curve | 校准数据 | 由校准工具生成参数 |
| ynr_ci | 校准数据 | 由校准工具生成参数 |

<!-- source: EN PDF p82; unit 751 -->

###### 2.3.1.1   Enable:

<!-- source: EN PDF p82; unit 752 -->

【说明】

<!-- source: EN PDF p82; unit 753 -->

ynr 使能开关：1 开启，0 关闭。

<!-- source: EN PDF p83; unit 754 -->

###### 2.3.1.2   SNR_Mode

<!-- source: EN PDF p83; unit 755 -->

【说明】

<!-- source: EN PDF p83; unit 756 -->

LCG 与 HCG 对应不同噪声模式。

<!-- source: EN PDF p83; unit 757 -->

HSNR 对应 HCG，LSNR 对应 LCG 模式。

<!-- source: EN PDF p83; unit 758 -->

###### 2.3.1.3   Sensor_Mode

<!-- source: EN PDF p83; unit 759 -->

【说明】

<!-- source: EN PDF p83; unit 760 -->

传感器支持的 HCG、LCG 模式；若不支持 DCG，默认使用 LCG 参数。

<!-- source: EN PDF p83; unit 761 -->

###### 2.3.1.4   ISO

<!-- source: EN PDF p83; unit 762 -->

【说明】

<!-- source: EN PDF p83; unit 763 -->

不同 ISO 档位对应不同调试参数，目前仅支持 13 档。

<!-- source: EN PDF p83; unit 764 -->

###### 2.3.1.5   ynr_bft3x3_bypass,ynr_lbft5x5_bypass,ynr_lgft3x3_bypass,ynr_flt1x1_bypass， ynr_sft5x5_bypass

<!-- source: EN PDF p83; unit 765 -->

【说明】

<!-- source: EN PDF p83; unit 766 -->

子模块旁路功能：0 启用功能，1 旁路。

<!-- source: EN PDF p83; unit 767 -->

通常启用全部子模块，将这些值设为 0。

<!-- source: EN PDF p83; unit 768 -->

###### 2.3.1.6   ynr_global_gain_alpha/ynr_global_gain

<!-- source: EN PDF p83; unit 769 -->

【说明】

<!-- source: EN PDF p83; unit 770 -->

配置 Ynr 局部模式与全局模式降噪强度的插值。

<!-- source: EN PDF p83; unit 771 -->

通常使用默认值，无需配置，全部使用 local gain 方式。

<!-- source: EN PDF p83; unit 772 -->

公式：Gain = (global_gain_alphaglobal_gain+(8-global_gain_alpha)local_gain)&gt;&gt;3（原文疑似缺少乘号，按原样保留，未猜补）。

<!-- source: EN PDF p83; unit 773 -->

Global gain alpha 范围 [0.0 1.0]，默认 0。

<!-- source: EN PDF p83; unit 774 -->

Global gain 范围 [0.0 64.0]，默认 1。

<!-- source: EN PDF p84; unit 775 -->

###### 2.3.1.7   ynr_adjust_thresh /ynr_adjust_scale

<!-- source: EN PDF p84; unit 776 -->

【说明】

<!-- source: EN PDF p84; unit 777 -->

控制噪声高于 ynr_adjust_thresh 阈值时的降噪强度。

<!-- source: EN PDF p84; unit 778 -->

设计认为运动区域噪声较大，可设置适当阈值，提高运动区域原文所称“YYR”的降噪强度（原文拼写保留待核对）。

<!-- source: EN PDF p84; unit 779 -->

ynr_adjust_thresh 范围 [0.0, 1.0]，默认 1。

<!-- source: EN PDF p84; unit 780 -->

ynr_adjust_scale 范围 [0, 16.0]，默认 1。

<!-- source: EN PDF p84; unit 781 -->

###### 2.3.1.8   rnr_strength

<!-- source: EN PDF p84; unit 782 -->

【说明】

<!-- source: EN PDF p84; unit 783 -->

以图像中心为原点，沿圆的半径 r 方向设置不同降噪强度。

<!-- source: EN PDF p84; unit 784 -->

主要针对 LSC 引起的噪声配置。

<!-- source: EN PDF p84; unit 785 -->

范围 [0, 16.0]，默认 1。

<!-- source: EN PDF p84; unit 786 -->

###### 2.3.1.9   low_bf

<!-- source: EN PDF p84; unit 787 -->

【说明】

<!-- source: EN PDF p84; unit 788 -->

双边滤波强度参数。

<!-- source: EN PDF p84; unit 789 -->

第一行为原始图像 3x3 双边滤波强度，值越大降噪越强。

<!-- source: EN PDF p84; unit 790 -->

范围 [0.01, 32]，默认 1。

<!-- source: EN PDF p84; unit 791 -->

第二行为上一帧 5x5 双边滤波强度，值越大降噪越强。

<!-- source: EN PDF p84; unit 792 -->

范围 [0.01, 32]，默认 1。

<!-- source: EN PDF p84; unit 793 -->

###### 2.3.1.10   low_thred_adj

<!-- source: EN PDF p84; unit 794 -->

【说明】

<!-- source: EN PDF p84; unit 795 -->

低频软阈值越大，低频降噪越强。

<!-- source: EN PDF p84; unit 796 -->

范围 [0, 31]，默认 0.5。

<!-- source: EN PDF p85; unit 797 -->

###### 2.3.1.11   low_peak_supress

<!-- source: EN PDF p85; unit 798 -->

【说明】

<!-- source: EN PDF p85; unit 799 -->

控制孤立噪声去除强度，值越小降噪越强。

<!-- source: EN PDF p85; unit 800 -->

范围 [0, 1]，默认 0.5。

<!-- source: EN PDF p85; unit 801 -->

###### 2.3.1.12   low_edge_adj_thresh

<!-- source: EN PDF p85; unit 802 -->

【说明】

<!-- source: EN PDF p85; unit 803 -->

小图边缘检测调整系数阈值，用于限制调整系数可取的最大值。

<!-- source: EN PDF p85; unit 804 -->

值越小降噪越强，图像越模糊；整数范围 [0, 1023]，默认 7。

<!-- source: EN PDF p85; unit 805 -->

###### 2.3.1.13   low_lbf_weight_thresh

<!-- source: EN PDF p85; unit 806 -->

【说明】

<!-- source: EN PDF p85; unit 807 -->

限制 5x5 双边滤波权重，值越大低频降噪越弱。

<!-- source: EN PDF p85; unit 808 -->

范围 [0.0, 1.0]，默认 0.25。

<!-- source: EN PDF p85; unit 809 -->

###### 2.3.1.14   low_center_weight

<!-- source: EN PDF p85; unit 810 -->

【说明】

<!-- source: EN PDF p85; unit 811 -->

5x5 双边滤波中心点权重，值越小降噪越强。

<!-- source: EN PDF p85; unit 812 -->

范围 [0,1]，默认 0.5。

<!-- source: EN PDF p85; unit 813 -->

###### 2.3.1.15   low_dist_adj

<!-- source: EN PDF p85; unit 814 -->

【说明】

<!-- source: EN PDF p85; unit 815 -->

双边滤波距离权重调整系数，值越小降噪越强。

<!-- source: EN PDF p85; unit 816 -->

范围 [0, 127.0]，默认 8.0。

<!-- source: EN PDF p86; unit 817 -->

###### 2.3.1.16   low_weight

<!-- source: EN PDF p86; unit 818 -->

【说明】

<!-- source: EN PDF p86; unit 819 -->

低频降噪结果权重，值越大低频降噪越强。

<!-- source: EN PDF p86; unit 820 -->

范围 [0, 1]，默认 0.5。

<!-- source: EN PDF p86; unit 821 -->

###### 2.3.1.17   low_filt_strength

<!-- source: EN PDF p86; unit 822 -->

【说明】

<!-- source: EN PDF p86; unit 823 -->

第一行为对原图进行高斯滤波的滤波核权重。

<!-- source: EN PDF p86; unit 824 -->

范围 [0,1.0]，默认 0.7。

<!-- source: EN PDF p86; unit 825 -->

第二行为对双边滤波结果进行高斯滤波的滤波核权重。

<!-- source: EN PDF p86; unit 826 -->

范围 [0,1.0]，默认 0.85。

<!-- source: EN PDF p86; unit 827 -->

###### 2.3.1.18   low_bi_weight

<!-- source: EN PDF p86; unit 828 -->

【说明】

<!-- source: EN PDF p86; unit 829 -->

软阈值处理中使用的第一次双边滤波权重，值越大降噪越强。

<!-- source: EN PDF p86; unit 830 -->

范围 [0, 1]，默认 0.3。

<!-- source: EN PDF p86; unit 831 -->

###### 2.3.1.19   base_filter_weight

<!-- source: EN PDF p86; unit 832 -->

【说明】

<!-- source: EN PDF p86; unit 833 -->

方向滤波器系数，通常无需调整。

<!-- source: EN PDF p86; unit 834 -->

###### 2.3.1.20   high_thred_adj

<!-- source: EN PDF p86; unit 835 -->

【说明】

<!-- source: EN PDF p86; unit 836 -->

值越大，高频降噪越强。

<!-- source: EN PDF p86; unit 837 -->

范围 0, 31.0，默认 1.0。

<!-- source: EN PDF p87; unit 838 -->

###### 2.3.1.21   high_weight

<!-- source: EN PDF p87; unit 839 -->

【说明】

<!-- source: EN PDF p87; unit 840 -->

高频降噪权重；注意该值表示保留的高频分量比例。

<!-- source: EN PDF p87; unit 841 -->

值越低降噪越强，默认 0.78。

<!-- source: EN PDF p87; unit 842 -->

###### 2.3.1.22   high_direction_weight

<!-- source: EN PDF p87; unit 843 -->

【说明】

<!-- source: EN PDF p87; unit 844 -->

设置各方向权重；某方向值越大，沿该方向降噪越强。

<!-- source: EN PDF p87; unit 845 -->

<!-- source: EN PDF p87; unit 846 -->

###### 2.3.1.23   hi_min_adj

<!-- source: EN PDF p87; unit 847 -->

【说明】

<!-- source: EN PDF p87; unit 848 -->

所有方差值减去最小方差值的比例，值越大边缘越锐利。

<!-- source: EN PDF p87; unit 849 -->

范围 0.0, 1.0，默认 0.9。

<!-- source: EN PDF p87; unit 850 -->

###### 2.3.1.24   hi_edge_thed

<!-- source: EN PDF p87; unit 851 -->

【说明】

<!-- source: EN PDF p87; unit 852 -->

阈值越小，高频降噪越强。

<!-- source: EN PDF p87; unit 853 -->

整数范围 0, 255，默认 100。

<!-- source: EN PDF p87; unit 854 -->

###### 2.3.1.25   sigma_curve

<!-- source: EN PDF p87; unit 855 -->

【说明】

<!-- source: EN PDF p87; unit 856 -->

噪声 sigma 曲线。

<!-- source: EN PDF p88; unit 857 -->

###### 2.3.1.26   ynr_ci

<!-- source: EN PDF p88; unit 858 -->

【说明】

<!-- source: EN PDF p88; unit 859 -->

噪声 sigma 的影响系数；值越大，sigma 越大，噪声去除越强。

<!-- source: EN PDF p88; unit 860 -->

第一行影响低频 sigma。

<!-- source: EN PDF p88; unit 861 -->

第二行影响高频 sigma。

<!-- source: EN PDF p88; unit 862 -->

###### 2.3.1.27   hi_center_weight

<!-- source: EN PDF p88; unit 863 -->

【说明】

<!-- source: EN PDF p88; unit 864 -->

高频中心点权重越大，降噪越弱。

<!-- source: EN PDF p88; unit 865 -->

范围 [0, 1]，默认 0.8。

<!-- source: EN PDF p88; unit 866 -->

##### 2.3.2   4.2.3.3 调试步骤

<!-- source: EN PDF p88; unit 867 -->

关闭 SHARP 模块。

<!-- source: EN PDF p88; unit 868 -->

调整 Lob、Lothred Adi、Lowitt、Lobivet 等低频降噪参数（名称按原文保留，疑似转写错误，须与工具核对）。

<!-- source: EN PDF p88; unit 869 -->

调整 Hewitt、Hesley Adi 等高频降噪参数（原文名称待核对）。

<!-- source: EN PDF p88; unit 870 -->

调整 An_Strent 以调节边角噪声强度（原文名称待核对）。

<!-- source: EN PDF p88; unit 871 -->

调整 Ian Adjast Sresh、Ian Adjast Skelle，以调节运动区域噪声（原文名称待核对）。

<!-- source: EN PDF p88; unit 872 -->

整体平衡降噪与细节损失。降噪越强，噪声越趋于低频。

<!-- source: EN PDF p88; unit 873 -->

#### 2.4   4.2.4 CNR

<!-- source: EN PDF p88; unit 874 -->

##### 2.4.1   4.2.4.1 功能说明

<!-- source: EN PDF p88; unit 875 -->

本模块主要对 UV 数据进行色彩降噪，算法接近 RK ISP2X 的 UVNR 模块。

<!-- source: EN PDF p88; unit 876 -->

主要对图像进行不同尺度下采样，最后上采样回原始图像尺度。

<!-- source: EN PDF p88; unit 877 -->

各尺度上下采样时进行中值滤波，然后对 UV 数据双边滤波，参考 y 的梯度处理边缘色噪，最后与未经降噪的图像插值输出。

<!-- source: EN PDF p88; unit 878 -->

支持分别设置高、低信噪比的锐化参数（原文此处写 sharpening，保留术语待核对）。

<!-- source: EN PDF p89; unit 879 -->

例如支持双转换增益（DCG）的 CIS，高转换增益 HCG 对应高信噪比模式，低转换增益对应低信噪比模式；原文将低转换增益同样写作 HCG，保留此疑点待核对。

<!-- source: EN PDF p89; unit 880 -->

![英文 PDF 原图 89](/docs/rockchip-isp30-tuning/assets/en-p089-X680.png)

<!-- source: EN PDF p89; unit 881 -->

图 4-2-3-1 CNR 功能框图

<!-- source: EN PDF p90; unit 882 -->

##### 2.4.2   4.2.4.2 关键参数

<!-- source: EN PDF p90; unit 883 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常用调试参数 |
| SNR_Mode | 模式参数 | DCG 对应高、低信噪比模式 |
| Sensor_Mode | 模式参数 | 传感器 DCG 模式 |
| iso | 调试参数 | 常用调试参数 |
| hf_bypass | 调试参数 | 不常调试，切换内部模块。 |
| lf_bypass | 调试参数 | 不常调试，切换内部模块。 |
| global_gain | 调试参数 | 不常调试的参数 |
| global_gain_alpha | 调试参数 | 不常调试的参数 |
| global_gain_scale | 调试参数 | 不常调试的参数 |
| gain_adj_strength_ratio | 调试参数 | 常用调试参数 |
| color_sat_adj | 调试参数 | 常用调试参数 |
| color_sat_adj_alpha | 调试参数 | 常用调试参数 |
| hf_spikes_reducion_strength | 调试参数 | 常用调试参数 |
| hf_denoise_strength | 调试参数 | 常用调试参数 |
| hf_color_sat | 调试参数 | 常用调试参数 |
| hf_denoise_alpha | 调试参数 | 常用调试参数 |
| hf_bf_wgt_clip | 调试参数 | 常用调试参数 |

<!-- source: EN PDF p91; unit 884 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| thumb_spikes_reducion_strength | 调试参数 | 常用调试参数 |
| thumb_denoise_strength | 调试参数 | 常用调试参数 |
| thumb_color_sat | 调试参数 | 常用调试参数 |
| lf_denoise_strength | 调试参数 | 常用调试参数 |
| lf_color_sat | 调试参数 | 常用调试参数 |
| lf_denoise_alpha | 调试参数 | 常用调试参数 |
| kernel_5x5 | 调试参数 | 不常调试的参数 |

<!-- source: EN PDF p91; unit 885 -->

###### 2.4.2.1   Enable

<!-- source: EN PDF p91; unit 886 -->

【说明】

<!-- source: EN PDF p91; unit 887 -->

模块使能开关：1 开启，0 关闭。

<!-- source: EN PDF p91; unit 888 -->

###### 2.4.2.2   SNR_Mode

<!-- source: EN PDF p91; unit 889 -->

【说明】

<!-- source: EN PDF p91; unit 890 -->

LCG 与 HCG 对应不同噪声模式。HSNR 对应 HCG，LSNR 对应 LCG。

<!-- source: EN PDF p91; unit 891 -->

###### 2.4.2.3   Sensor_Mode

<!-- source: EN PDF p91; unit 892 -->

【说明】

<!-- source: EN PDF p91; unit 893 -->

传感器支持的 HCG、LCG 模式；若不支持 DCG，默认使用 LCG 参数。

<!-- source: EN PDF p92; unit 894 -->

###### 2.4.2.4   ISO

<!-- source: EN PDF p92; unit 895 -->

【说明】

<!-- source: EN PDF p92; unit 896 -->

不同 ISO 档位对应不同调试参数，目前仅支持 13 档。

<!-- source: EN PDF p92; unit 897 -->

###### 2.4.2.5   hf_bypass

<!-- source: EN PDF p92; unit 898 -->

【说明】

<!-- source: EN PDF p92; unit 899 -->

高频降噪旁路：0 不旁路，1 旁路。

<!-- source: EN PDF p92; unit 900 -->

###### 2.4.2.6   lf_bypass

<!-- source: EN PDF p92; unit 901 -->

【说明】

<!-- source: EN PDF p92; unit 902 -->

低频降噪旁路：0 不旁路，1 旁路。

<!-- source: EN PDF p92; unit 903 -->

###### 2.4.2.7   global_gain/global_gain_alpha

<!-- source: EN PDF p92; unit 904 -->

【说明】

<!-- source: EN PDF p92; unit 905 -->

配置 CNR 局部与全局降噪模式的插值强度。

<!-- source: EN PDF p92; unit 906 -->

通常使用默认值，无需配置，使用 local gain 方式。

<!-- source: EN PDF p92; unit 907 -->

公式：Gain=(global_gain_alphaglobal_gain+(8-global_gain_alpha)local_gain)&gt;&gt;3（原文疑似缺乘号，按原样保留）。

<!-- source: EN PDF p92; unit 908 -->

global gain alpha 范围 [0.0 1.0]，默认 0。

<!-- source: EN PDF p92; unit 909 -->

global gain 范围 0.0 到 64.0，默认 1。

<!-- source: EN PDF p92; unit 910 -->

###### 2.4.2.8   local_gain_scale

<!-- source: EN PDF p92; unit 911 -->

【说明】

<!-- source: EN PDF p92; unit 912 -->

放大 CNR 降噪强度，通常使用默认值，不宜轻易调整。

<!-- source: EN PDF p92; unit 913 -->

范围 0, 128，默认 1。

<!-- source: EN PDF p93; unit 914 -->

###### 2.4.2.9   gain_adj_strength_ratio

<!-- source: EN PDF p93; unit 915 -->

【说明】

<!-- source: EN PDF p93; unit 916 -->

根据 local gain 调整滤波强度，值越小噪声去除越强。

<!-- source: EN PDF p93; unit 917 -->

范围 [1, 255]，默认 255。

<!-- source: EN PDF p93; unit 918 -->

###### 2.4.2.10   color_sat_adj

<!-- source: EN PDF p93; unit 919 -->

【说明】

<!-- source: EN PDF p93; unit 920 -->

基于梯度调整的双边滤波 UV 比例，1~255；值越小色噪去除越强。

<!-- source: EN PDF p93; unit 921 -->

有效范围 [1, 255]，默认 40。

<!-- source: EN PDF p93; unit 922 -->

###### 2.4.2.11   color_sat_adj_alpha

<!-- source: EN PDF p93; unit 923 -->

【说明】

<!-- source: EN PDF p93; unit 924 -->

color_sat_adj 调整比例；值越大色噪去除越强。

<!-- source: EN PDF p93; unit 925 -->

范围 0, 1.0，默认 0.8。

<!-- source: EN PDF p93; unit 926 -->

###### 2.4.2.12   hf_spikes_reducion_strength

<!-- source: EN PDF p93; unit 927 -->

【说明】

<!-- source: EN PDF p93; unit 928 -->

高频中值滤波强度，值越大滤波越强。

<!-- source: EN PDF p93; unit 929 -->

范围 0, 1.0，默认 0.5。

<!-- source: EN PDF p93; unit 930 -->

###### 2.4.2.13   hf_denoise_strength

<!-- source: EN PDF p93; unit 931 -->

【说明】

<!-- source: EN PDF p93; unit 932 -->

高频双边滤波强度，值越大色噪去除越强。

<!-- source: EN PDF p93; unit 933 -->

范围 [1, 1023]，默认 10。

<!-- source: EN PDF p94; unit 934 -->

###### 2.4.2.14   hf_color_sat

<!-- source: EN PDF p94; unit 935 -->

【说明】

<!-- source: EN PDF p94; unit 936 -->

高频双边滤波 UV 比例系数，值越小色彩饱和度下降越多。

<!-- source: EN PDF p94; unit 937 -->

范围 0.0, 7.9，默认 1.5。

<!-- source: EN PDF p94; unit 938 -->

###### 2.4.2.15   hf_denoise_alpha

<!-- source: EN PDF p94; unit 939 -->

【说明】

<!-- source: EN PDF p94; unit 940 -->

高频双边滤波中心点权重。

<!-- source: EN PDF p94; unit 941 -->

有效范围 0.0, 1.0，默认 0。

<!-- source: EN PDF p94; unit 942 -->

###### 2.4.2.16   hf_bf_wgt_clip

<!-- source: EN PDF p94; unit 943 -->

【说明】

<!-- source: EN PDF p94; unit 944 -->

高频最小降噪，值越大降噪越强。

<!-- source: EN PDF p94; unit 945 -->

范围 0, 255，默认 0。

<!-- source: EN PDF p94; unit 946 -->

###### 2.4.2.17   thumb_spikes_reducion_strength

<!-- source: EN PDF p94; unit 947 -->

【说明】

<!-- source: EN PDF p94; unit 948 -->

缩略图中值滤波强度，值越大滤波越强。

<!-- source: EN PDF p94; unit 949 -->

有效范围 0.0, 1.0，默认 0.5。

<!-- source: EN PDF p94; unit 950 -->

###### 2.4.2.18   thumb_denoise_strength

<!-- source: EN PDF p94; unit 951 -->

【说明】

<!-- source: EN PDF p94; unit 952 -->

缩略图双边滤波强度，值越大色噪去除越强。

<!-- source: EN PDF p94; unit 953 -->

范围 [1, 1023]，默认 8。

<!-- source: EN PDF p95; unit 954 -->

###### 2.4.2.19   thumb_color_sat

<!-- source: EN PDF p95; unit 955 -->

【说明】

<!-- source: EN PDF p95; unit 956 -->

缩略图双边滤波 UV 比例系数，影响色彩饱和度下降（原文未完整说明增减方向，未猜补）。

<!-- source: EN PDF p95; unit 957 -->

范围 0.0, 7.9，默认 4。

<!-- source: EN PDF p95; unit 958 -->

###### 2.4.2.20   lf_denoise_strength

<!-- source: EN PDF p95; unit 959 -->

【说明】

<!-- source: EN PDF p95; unit 960 -->

低频双边滤波强度，值越大色噪去除越强。

<!-- source: EN PDF p95; unit 961 -->

范围 [1, 1023]，默认 8。

<!-- source: EN PDF p95; unit 962 -->

###### 2.4.2.21   lf_color_sat

<!-- source: EN PDF p95; unit 963 -->

【说明】

<!-- source: EN PDF p95; unit 964 -->

低频双边滤波 UV 比例系数；值越小饱和度下降越多。

<!-- source: EN PDF p95; unit 965 -->

范围 0.0, 7.9，默认 4。

<!-- source: EN PDF p95; unit 966 -->

###### 2.4.2.22   lf_denoise_alpha

<!-- source: EN PDF p95; unit 967 -->

【说明】

<!-- source: EN PDF p95; unit 968 -->

低频双边滤波中心点权重。

<!-- source: EN PDF p95; unit 969 -->

有效范围 0.0, 1.0，默认 0.5。

<!-- source: EN PDF p95; unit 970 -->

###### 2.4.2.23   kernel_5x5

<!-- source: EN PDF p95; unit 971 -->

【说明】

<!-- source: EN PDF p95; unit 972 -->

5x5 双边滤波核。

<!-- source: EN PDF p96; unit 973 -->

##### 2.4.3   4.2.4.3 调试步骤

<!-- source: EN PDF p96; unit 974 -->

关闭 SHARP 模块。

<!-- source: EN PDF p96; unit 975 -->

调整各层的 denoise_strength、denoise_alpha、color_sat 等参数。

<!-- source: EN PDF p96; unit 976 -->

控制高、低频色噪去除，权衡色彩涂抹、饱和度下降等缺陷。

<!-- source: EN PDF p96; unit 977 -->

#### 2.5   4.2.5 SHARP

<!-- source: EN PDF p96; unit 978 -->

##### 2.5.1   4.2.5.1 功能说明

<!-- source: EN PDF p96; unit 979 -->

Sharpen 用于增强图像清晰度，算法接近 rk isp2x。

<!-- source: EN PDF p96; unit 980 -->

主要提取高频数据，随后预滤波、锐化增强、噪声抑制，最后与未锐化原图插值叠加输出。

<!-- source: EN PDF p96; unit 981 -->

支持分别为高、低信噪比噪声模式设置锐化参数。

<!-- source: EN PDF p96; unit 982 -->

例如支持双转换增益（DCG）的 CIS，高转换增益 HCG 对应高信噪比模式，低转换增益对应低信噪比模式；原文将低转换增益同样写作 HCG，保留此疑点待核对。

<!-- source: EN PDF p96; unit 983 -->

![英文 PDF 原图 96](/docs/rockchip-isp30-tuning/assets/en-p096-X720.png)

<!-- source: EN PDF p96; unit 984 -->

图 4-2-5-1 SHARP 功能框图

<!-- source: EN PDF p97; unit 985 -->

##### 2.5.2   4.2.5.2 关键参数

<!-- source: EN PDF p97; unit 986 -->

| 参数名 | 参数类型 | 简要说明 |
| --- | --- | --- |
| Enable | 调试参数 | 常用调试参数 |
| SNR_Mode | 模式参数 | DCG 对应高、低信噪比模式 |
| Sensor_Mode | 模式参数 | 传感器 DCG 模式 |
| iso | 调试参数 | 常用调试参数 |
| pbf_gain | 调试参数 | 常用调试参数 |
| pbf_add | 调试参数 | 常用调试参数 |
| pbf_ratio | 调试参数 | 常用调试参数 |
| gaus_ratio | 调试参数 | 常用调试参数 |
| sharp_ratio | 调试参数 | 常用调试参数 |
| bf_gain | 调试参数 | 常用调试参数 |
| bf_add | 调试参数 | 常用调试参数 |
| luma_point / luma_sigma | 调试参数 | 常用调试参数 |
| luma_point / hf_clip | 调试参数 | 常用调试参数 |
| luma_point / local_sharp_strength | 调试参数 | 常用调试参数 |
| prefilter_coeff | 调试参数 | 常用调试参数 |
| GaussianFilter_coeff | 调试参数 | 常用调试参数 |
| hfBilateralFilter_coeff | 调试参数 | 常用调试参数 |

<!-- source: EN PDF p98; unit 987 -->

###### 2.5.2.1   Enable:

<!-- source: EN PDF p98; unit 988 -->

【说明】

<!-- source: EN PDF p98; unit 989 -->

Sharp 模块使能开关。

<!-- source: EN PDF p98; unit 990 -->

1 开启模块，0 关闭模块。

<!-- source: EN PDF p98; unit 991 -->

###### 2.5.2.2   SNR_Mode

<!-- source: EN PDF p98; unit 992 -->

【说明】

<!-- source: EN PDF p98; unit 993 -->

LCG 与 HCG 对应不同噪声模式。HSNR 对应 HCG，LSNR 对应 LCG。

<!-- source: EN PDF p98; unit 994 -->

###### 2.5.2.3   Sensor_Mode

<!-- source: EN PDF p98; unit 995 -->

【说明】

<!-- source: EN PDF p98; unit 996 -->

传感器支持的 HCG、LCG 模式；若不支持 DCG，默认使用 LCG 参数。

<!-- source: EN PDF p98; unit 997 -->

###### 2.5.2.4   ISO

<!-- source: EN PDF p98; unit 998 -->

【说明】

<!-- source: EN PDF p98; unit 999 -->

不同 ISO 档位对应不同调试参数，目前仅支持 13 档。

<!-- source: EN PDF p98; unit 1000 -->

###### 2.5.2.5   pbf_gain

<!-- source: EN PDF p98; unit 1001 -->

【说明】

<!-- source: EN PDF p98; unit 1002 -->

预滤波 sigma 的乘法比例，值越大滤波越强，噪声和细节越少。

<!-- source: EN PDF p98; unit 1003 -->

范围 [0.0, 2.0]，默认 1.0。

<!-- source: EN PDF p98; unit 1004 -->

###### 2.5.2.6   pbf_add

<!-- source: EN PDF p98; unit 1005 -->

【说明】

<!-- source: EN PDF p98; unit 1006 -->

预滤波 sigma 叠加偏移，值越大滤波越强，噪声和细节越少。

<!-- source: EN PDF p99; unit 1007 -->

范围 [0, 1023]，默认 0。

<!-- source: EN PDF p99; unit 1008 -->

###### 2.5.2.7   pbf_ratio

<!-- source: EN PDF p99; unit 1009 -->

【说明】

<!-- source: EN PDF p99; unit 1010 -->

预滤波融合权重，值越大滤波越强，噪声和细节越少。

<!-- source: EN PDF p99; unit 1011 -->

范围 [0.0, 1.0]，默认 0.5。

<!-- source: EN PDF p99; unit 1012 -->

###### 2.5.2.8   gaus_ratio

<!-- source: EN PDF p99; unit 1013 -->

【说明】

<!-- source: EN PDF p99; unit 1014 -->

高频双边滤波的引导图像由高斯滤波结果与原图融合得到。

<!-- source: EN PDF p99; unit 1015 -->

值越大，高斯双边滤波的引导权重越大。

<!-- source: EN PDF p99; unit 1016 -->

范围 [0.0, 1.0]，默认 0。

<!-- source: EN PDF p99; unit 1017 -->

###### 2.5.2.9   sharp_ratio

<!-- source: EN PDF p99; unit 1018 -->

【说明】

<!-- source: EN PDF p99; unit 1019 -->

锐化强度，值越大锐化越强。

<!-- source: EN PDF p99; unit 1020 -->

范围 [0.0, 32]，默认 6。

<!-- source: EN PDF p99; unit 1021 -->

###### 2.5.2.10   bf_gain

<!-- source: EN PDF p99; unit 1022 -->

【说明】

<!-- source: EN PDF p99; unit 1023 -->

高频双边滤波 sigma 的乘法比例，值越大滤波越强，噪声和细节越少。

<!-- source: EN PDF p99; unit 1024 -->

范围 [0.0, 2.0]，默认 1.0。

<!-- source: EN PDF p99; unit 1025 -->

###### 2.5.2.11   bf_add

<!-- source: EN PDF p99; unit 1026 -->

【说明】

<!-- source: EN PDF p99; unit 1027 -->

高频双边滤波 sigma 叠加偏移，值越大滤波越强，噪声和细节越少。

<!-- source: EN PDF p100; unit 1028 -->

范围 [0, 1023]，默认 0。

<!-- source: EN PDF p100; unit 1029 -->

###### 2.5.2.12   bf_ratio

<!-- source: EN PDF p100; unit 1030 -->

【说明】

<!-- source: EN PDF p100; unit 1031 -->

高频双边滤波融合权重，值越大滤波越强，噪声和细节越少。

<!-- source: EN PDF p100; unit 1032 -->

范围 [0.0, 1.0]，默认 0.5。

<!-- source: EN PDF p100; unit 1033 -->

###### 2.5.2.13   luma_point / luma_sigma

<!-- source: EN PDF p100; unit 1034 -->

【说明】

<!-- source: EN PDF p100; unit 1035 -->

不同像素亮度对应不同噪声 SIGMA 曲线。

<!-- source: EN PDF p100; unit 1036 -->

luma_point 为曲线亮度值，范围 [0, 1023]。

<!-- source: EN PDF p100; unit 1037 -->

luma_sigma 为噪声强度值，范围 [0, 1023]。

<!-- source: EN PDF p100; unit 1038 -->

###### 2.5.2.14   luma_point / hf_clip

<!-- source: EN PDF p100; unit 1039 -->

【说明】

<!-- source: EN PDF p100; unit 1040 -->

对不同像素亮度的高频值进行限幅的范围。

<!-- source: EN PDF p100; unit 1041 -->

值越大，允许的最大锐化强度越高。

<!-- source: EN PDF p100; unit 1042 -->

范围 [0, 1023]，默认 256。

<!-- source: EN PDF p100; unit 1043 -->

###### 2.5.2.15   luma_point / local_sharp_strength

<!-- source: EN PDF p100; unit 1044 -->

【说明】

<!-- source: EN PDF p100; unit 1045 -->

计算不同像素亮度下的高频叠加权重比例。

<!-- source: EN PDF p100; unit 1046 -->

值越大，允许叠加的高频越多，图像越锐利。

<!-- source: EN PDF p101; unit 1047 -->

###### 2.5.2.16   prefilter_coeff:

<!-- source: EN PDF p101; unit 1048 -->

【说明】

<!-- source: EN PDF p101; unit 1049 -->

预滤波算子。

<!-- source: EN PDF p101; unit 1050 -->

###### 2.5.2.17   GaussianFilter_coeff

<!-- source: EN PDF p101; unit 1051 -->

【说明】

<!-- source: EN PDF p101; unit 1052 -->

高斯滤波算子。

<!-- source: EN PDF p101; unit 1053 -->

###### 2.5.2.18   hfBilateralFilter_coeff

<!-- source: EN PDF p101; unit 1054 -->

【说明】

<!-- source: EN PDF p101; unit 1055 -->

高频双边滤波算子。

<!-- source: EN PDF p101; unit 1056 -->

##### 2.5.3   4.2.5.3 调试步骤

<!-- source: EN PDF p101; unit 1057 -->

调整 sharp_ratio、local_sharp_strength、hf_clip，控制高频边缘增强强度。

<!-- source: EN PDF p101; unit 1058 -->

调整 gaus_ratio、pbf_ratio、pbf_gain、pbf_add、bf_ratio、bf_gain、bf_add，以减少锐化引入的噪声，平衡噪声与细节锐化。

<!-- source: EN PDF p101; unit 1059 -->

Sharp 可在增强细节的同时抑制噪声，但最终仍不可避免地增加整体噪声。

<!-- source: EN PDF p101; unit 1060 -->

### 3.   4.3 MERGE

<!-- source: EN PDF p101; unit 1061 -->

#### 3.1   4.3.1 功能说明

<!-- source: EN PDF p101; unit 1062 -->

本模块调整合成时长（中）、短帧的使用比例。每帧比例由过曝权重与运动权重相乘决定；过曝权重由过曝曲线决定，运动权重由运动曲线决定。

<!-- source: EN PDF p101; unit 1063 -->

融合时参考帧可选长帧或短帧，分别对应长帧模式和短帧模式。

<!-- source: EN PDF p102; unit 1064 -->

过曝曲线由 OECurve_smooth、OECurve_offset 决定。两帧模式在长、短帧之间判断过曝；三帧模式在长、中帧之间判断。

<!-- source: EN PDF p102; unit 1065 -->

长帧模式具有长–中帧运动曲线（LM_smooth、LM_offset）及中–短帧运动曲线（MS_smooth、MS_offset）。两帧模式仅中–短帧曲线生效。短帧模式的曲线由 Coef、ms_thd0、lm_thd0 决定。

<!-- source: EN PDF p102; unit 1066 -->

![英文 PDF 原图 102](/docs/rockchip-isp30-tuning/assets/en-p102-X759.png)

<!-- source: EN PDF p102; unit 1067 -->

Merge 框图

<!-- source: EN PDF p102; unit 1068 -->

#### 3.2   4.3.2 关键参数

<!-- source: EN PDF p102; unit 1069 -->

##### 3.2.1   4.3.2.1 BaseFrm

<!-- source: EN PDF p102; unit 1070 -->

【说明】

<!-- source: EN PDF p102; unit 1071 -->

表示融合过程中的参考帧选择。

<!-- source: EN PDF p102; unit 1072 -->

【成员】

<!-- source: EN PDF p102; unit 1073 -->

| 成员名称 | 说明 |
| --- | --- |
| BASEFRAME_LONG | 以长帧为基准 |
| BASEFRAME_SHORT | 以短帧为基准 |

<!-- source: EN PDF p102; unit 1074 -->

【注意事项】

<!-- source: EN PDF p102; unit 1075 -->

BASEFRAME_LONG 与 BASEFRAME_SHORT 融合后亮度基本相同。主要区别为 BASEFRAME_SHORT 的运动拖影较少，BASEFRAME_LONG 的噪声表现较好。

<!-- source: EN PDF p103; unit 1076 -->

BASEFRAME_LONG 模式使用 LongFrmModeData 参数；BASEFRAME_SHORT 模式使用 ShortFrmModeData 参数。

<!-- source: EN PDF p103; unit 1077 -->

##### 3.2.2   4.3.2.2 ByPassThr

<!-- source: EN PDF p103; unit 1078 -->

【说明】

<!-- source: EN PDF p103; unit 1079 -->

本模块旁路阈值，范围 [0,1]。当前环境亮度与上一帧环境亮度的百分比差小于 ByPassThr 时，不更新本模块参数。

<!-- source: EN PDF p103; unit 1080 -->

【成员】

<!-- source: EN PDF p103; unit 1081 -->

【注意事项】

<!-- source: EN PDF p103; unit 1082 -->

使用工具调试时将值设为 0，否则调试可能无效。

<!-- source: EN PDF p103; unit 1083 -->

##### 3.2.3   4.3.2.3 LongFrmModeData

<!-- source: EN PDF p103; unit 1084 -->

【说明】

<!-- source: EN PDF p103; unit 1085 -->

长帧模式的 merge 参数。

<!-- source: EN PDF p103; unit 1086 -->

【成员】

<!-- source: EN PDF p103; unit 1087 -->

| 成员名称 | 说明 |
| --- | --- |
| OECurve | 过曝曲线参数 |
| MDCurve | 运动曲线参数 |
| OECurve_damp | 过曝曲线变化平滑系数，即当前帧参数占比，范围 [0,1]，默认 0.9。 |
| MDCurveLM_damp | 长中帧运动曲线变化平滑系数，即当前帧参数占比，范围 [0,1]，默认 0.9；HDR x2 无效。 |
| MDCurveMS_damp | 中短帧运动曲线变化平滑系数，即当前帧参数占比，范围 [0,1]，默认 0.9。 |

<!-- source: EN PDF p103; unit 1088 -->

【注意事项】

<!-- source: EN PDF p103; unit 1089 -->

###### 3.2.3.1   4.3.2.3.1 EnableEachChn

<!-- source: EN PDF p103; unit 1090 -->

【说明】

<!-- source: EN PDF p103; unit 1091 -->

单通道过曝检测开关：0 关闭，1 开启。

<!-- source: EN PDF p103; unit 1092 -->

【成员】

<!-- source: EN PDF p104; unit 1093 -->

【注意事项】

<!-- source: EN PDF p104; unit 1094 -->

画面存在单色区域过曝，且 merge 后该区域噪声较大时，建议开启。

<!-- source: EN PDF p104; unit 1095 -->

###### 3.2.3.2   4.3.2.3.2 OECurve

<!-- source: EN PDF p104; unit 1096 -->

【说明】

<!-- source: EN PDF p104; unit 1097 -->

长帧模式的过曝曲线参数。

<!-- source: EN PDF p104; unit 1098 -->

【成员】

<!-- source: EN PDF p104; unit 1099 -->

| 成员名称 | 说明 |
| --- | --- |
| EnvLv | 过曝曲线参数 |
| EnvLv_len | EnvLv 数组长度 |
| Smooth | 过曝曲线斜率，范围 [0,1]，默认 0.4，精度 0.01。 |
| Smooth_len | Smooth 数组长度 |
| Offset | 过曝曲线偏移，范围 [108,280]，默认 210，精度 0.1。 |
| Offset_len | Offset 数组长度 |

<!-- source: EN PDF p104; unit 1100 -->

【注意事项】

<!-- source: EN PDF p104; unit 1101 -->

###### 3.2.3.3   4.3.2.3.3 MDCurve

<!-- source: EN PDF p104; unit 1102 -->

【说明】

<!-- source: EN PDF p104; unit 1103 -->

长帧模式的运动曲线参数。

<!-- source: EN PDF p104; unit 1104 -->

【成员】

<!-- source: EN PDF p105; unit 1105 -->

| 成员名称 | 说明 |
| --- | --- |
| MoveCoef | 运动程度，范围 [0,1]，0 完全静止，1 完全运动。 |
| MoveCoef_len | MoveBeef 数组长度 |
| LM_smooth | 长中帧运动曲线斜率，范围 [0,1]，默认 0.4；HDR x2 无效。 |
| LM_smooth_len | LM_smooth 数组长度 |
| LM_offset | 长中帧运动曲线偏移，范围 [0.26,1]，默认 0.38；HDR x2 无效。 |
| LM_offset_len | LM_offset 数组长度 |
| MS_smooth | 中短帧运动曲线斜率，范围 [0,1]，默认 0.4。 |
| MS_smooth_len | MS_smooth 数组长度 |
| MS_offset | 中短帧运动曲线偏移，范围 [0.26,1]，默认 0.38。 |
| MS_offset_len | MS_offset 数组长度 |

<!-- source: EN PDF p105; unit 1106 -->

【注意事项】

<!-- source: EN PDF p105; unit 1107 -->

MoveCoef：目前未实现场景检测，无法取得运动量，实际使用 MoveComeEf 等于 1（原文此处拼写 MoveComeEf，与标题不同，保留待核对）。

<!-- source: EN PDF p105; unit 1108 -->

##### 3.2.4   4.3.2.4 ShortFrmModeData

<!-- source: EN PDF p105; unit 1109 -->

【说明】

<!-- source: EN PDF p105; unit 1110 -->

短帧模式的 merge 参数。

<!-- source: EN PDF p105; unit 1111 -->

【成员】

<!-- source: EN PDF p105; unit 1112 -->

| 成员名称 | 说明 |
| --- | --- |
| OECurve | 过曝曲线参数 |
| MDCurve | 运动曲线参数 |
| OECurve_damp | 过曝曲线平滑系数，当前帧参数占比，范围 [0,1]，默认 0.9。 |
| MDCurve_damp | 运动曲线平滑系数，当前帧参数占比，范围 [0,1]，默认 0.9。 |

<!-- source: EN PDF p105; unit 1113 -->

【注意事项】

<!-- source: EN PDF p106; unit 1114 -->

###### 3.2.4.1   4.3.2.4.1 OECurve

<!-- source: EN PDF p106; unit 1115 -->

【说明】

<!-- source: EN PDF p106; unit 1116 -->

长帧模式的过曝曲线参数。

<!-- source: EN PDF p106; unit 1117 -->

【成员】

<!-- source: EN PDF p106; unit 1118 -->

| 成员名称 | 说明 |
| --- | --- |
| EnvLv | 过曝曲线参数 |
| EnvLv_len | EnvLv 数组长度 |
| Smooth | 过曝曲线斜率，范围 [0,1]，默认 0.4，精度 0.01。 |
| Smooth_len | Smooth 数组长度 |
| Offset | 过曝曲线偏移，范围 [108,280]，默认 210，精度 0.1。 |
| Offset_len | Offset 数组长度 |

<!-- source: EN PDF p106; unit 1119 -->

【注意事项】

<!-- source: EN PDF p106; unit 1120 -->

###### 3.2.4.2   4.3.2.4.2 MDCurve

<!-- source: EN PDF p106; unit 1121 -->

【说明】

<!-- source: EN PDF p106; unit 1122 -->

长帧模式的过曝曲线参数。

<!-- source: EN PDF p106; unit 1123 -->

【成员】

<!-- source: EN PDF p106; unit 1124 -->

| 成员名称 | 说明 |
| --- | --- |
| MoveCoef | 运动程度，范围 [0,1]，0 完全静止，1 完全运动。 |
| MoveCoef_len | MoveBeef 数组长度 |
| Coef | 默认 0.05，精度 0.0001。 |
| Coef_len | Coef 数组长度 |
| ms_thd0 | 短中帧控制系数，范围 [0,1]，默认 0.0，精度 0.1。 |
| ms_thd0_len | ms_thd0 数组长度 |
| lm_thd0 | 长中帧控制系数可设 0.0，精度 0.1；HDR x2 无效。 |
| lm_thd0_len | lm_thd0 数组长度 |

<!-- source: EN PDF p107; unit 1125 -->

【注意事项】

<!-- source: EN PDF p107; unit 1126 -->

#### 3.3   4.3.3 调试步骤

<!-- source: EN PDF p107; unit 1127 -->

Merge 调试主要分为过曝曲线和运动曲线两部分。

<!-- source: EN PDF p107; unit 1128 -->

##### 3.3.1   4.3.3.1 过曝曲线调试

<!-- source: EN PDF p107; unit 1129 -->

【说明】

<!-- source: EN PDF p107; unit 1130 -->

OECurve 由 OECurve_smooth、OECurve_offset 决定（如下图），并根据不同 Envlv 设置不同曲线。

<!-- source: EN PDF p107; unit 1131 -->

![英文 PDF 原图 107](/docs/rockchip-isp30-tuning/assets/en-p107-X781.png)

<!-- source: EN PDF p107; unit 1132 -->

OECurve 示意图

<!-- source: EN PDF p107; unit 1133 -->

【成员】

<!-- source: EN PDF p107; unit 1134 -->

| 成员名称 | 说明 |
| --- | --- |
| Smooth | 过曝曲线斜率 |
| Offset | 过曝曲线斜率 |

<!-- source: EN PDF p108; unit 1135 -->

【注意事项】

<!-- source: EN PDF p108; unit 1136 -->

1\.Smooth：

<!-- source: EN PDF p108; unit 1137 -->

在图像上，该值控制长短帧过渡区域的平滑性：越小，过曝与非过曝区域之间过渡越平滑，过渡区越大；越大，过渡越突兀，但区域越小。下图红、绿、蓝曲线分别对应 0、0.4、1。

<!-- source: EN PDF p108; unit 1138 -->

![英文 PDF 原图 108](/docs/rockchip-isp30-tuning/assets/en-p108-X786.png)

<!-- source: EN PDF p108; unit 1139 -->

OECurve_smooth 示意图

<!-- source: EN PDF p108; unit 1140 -->

2\.Offset：

<!-- source: EN PDF p108; unit 1141 -->

该值表示过曝时开始使用短帧的起始值。值越小，越倾向以最大权重使用短帧。

<!-- source: EN PDF p108; unit 1142 -->

特殊点：108 时过曝曲线所有值均为 1023，短帧权重最大，对应黄线；128 表示从亮度 128 起可能使用短帧，对应蓝线；215 表示从亮度 215 起可能使用短帧，到 256 时短帧权重恰为 1023，对应绿线；280 时过曝曲线所有值为 0，merge 不使用短帧，对应红线。

<!-- source: EN PDF p109; unit 1143 -->

![英文 PDF 原图 109](/docs/rockchip-isp30-tuning/assets/en-p109-X789.png)

<!-- source: EN PDF p109; unit 1144 -->

OECurve_offset 示意图

<!-- source: EN PDF p109; unit 1145 -->

##### 3.3.2   4.3.3.2 长帧模式运动曲线调试

<!-- source: EN PDF p109; unit 1146 -->

【说明】

<!-- source: EN PDF p109; unit 1147 -->

长帧模式运动曲线由 MS_smooth、MS_offset 及 LM_smooth、LM_offset 两组参数决定，实际曲线如下。

<!-- source: EN PDF p110; unit 1148 -->

![英文 PDF 原图 110](/docs/rockchip-isp30-tuning/assets/en-p110-X793.png)

<!-- source: EN PDF p110; unit 1149 -->

MDCurve 示意图

<!-- source: EN PDF p110; unit 1150 -->

画面运动时需降低权重，减少短帧使用，降低运动重影；同时根据不同 MoveCoef 设置不同运动曲线。

<!-- source: EN PDF p110; unit 1151 -->

【成员】

<!-- source: EN PDF p110; unit 1152 -->

| 成员名称 | 说明 |
| --- | --- |
| MS_smooth | 运动曲线斜率 |
| MS_offset | 运动曲线斜率 |

<!-- source: EN PDF p110; unit 1153 -->

【注意事项】

<!-- source: EN PDF p110; unit 1154 -->

1\.MS_smooth：

<!-- source: EN PDF p110; unit 1155 -->

该值控制短、中帧过渡区平滑性：越小，过曝与非过曝区域间过渡越平滑、范围越大；越大，过渡越突兀、范围越小。下图绿、红、蓝曲线分别对应 0、0.4、1。

<!-- source: EN PDF p111; unit 1156 -->

![英文 PDF 原图 111](/docs/rockchip-isp30-tuning/assets/en-p111-X796.png)

<!-- source: EN PDF p111; unit 1157 -->

MDCurve_smooth 示意图

<!-- source: EN PDF p111; unit 1158 -->

2\.MS_offset：

<!-- source: EN PDF p111; unit 1159 -->

该值表示过曝时开始使用短帧的起始值。越小，越倾向以最大权重使用短帧。绿、蓝、红曲线分别对应 0、0.38、1。

<!-- source: EN PDF p112; unit 1160 -->

![英文 PDF 原图 112](/docs/rockchip-isp30-tuning/assets/en-p112-X799.png)

<!-- source: EN PDF p112; unit 1161 -->

MDCurve_offset 示意图

<!-- source: EN PDF p112; unit 1162 -->

##### 3.3.3   4.3.3.2 短帧模式运动曲线调试

<!-- source: EN PDF p112; unit 1163 -->

【说明】

<!-- source: EN PDF p112; unit 1164 -->

短帧模式运动曲线由 Coef、ms_thd0、lm_thd0 三个参数决定，如下图。

<!-- source: EN PDF p113; unit 1165 -->

![英文 PDF 原图 113](/docs/rockchip-isp30-tuning/assets/en-p113-X793.png)

<!-- source: EN PDF p113; unit 1166 -->

MDCurve 示意图

<!-- source: EN PDF p113; unit 1167 -->

画面运动时需降低权重，减少短帧使用，降低运动重影；根据不同 MoveCoef 设置不同运动曲线。

<!-- source: EN PDF p113; unit 1168 -->

【成员】

<!-- source: EN PDF p113; unit 1169 -->

| 成员名称 | 说明 |
| --- | --- |
| Coef | 控制系数，范围 [0,1]，默认 0.05，精度 0.0001。 |
| ms_thd0 | 中短帧控制系数，范围 [0,1]，默认 0.0，精度 0.1。 |
| lm_thd0 | 长中帧控制系数，范围 [0,1]，默认 0.0，精度 0.1。 |

<!-- source: EN PDF p113; unit 1170 -->

【注意事项】

<!-- source: EN PDF p114; unit 1171 -->

### 4.   4.4 DRC

<!-- source: EN PDF p114; unit 1172 -->

#### 4.1   4.4.1 功能说明

<!-- source: EN PDF p114; unit 1173 -->

动态范围为场景最亮与最暗物体的亮度比；范围越大，通常表示场景亮度层次越丰富。

<!-- source: EN PDF p114; unit 1174 -->

| 类别 | 动态范围 |
| --- | --- |
| 真实场景 | &gt;= 180 dB |
| 人眼视觉系统感知 | 约 100 dB |
| 传统图像传感器像素 | 约 60 dB |

<!-- source: EN PDF p114; unit 1175 -->

传统图像传感器拍摄高动态场景时，可能过曝丢失细节，或暗区欠曝难辨细节。记录此类场景需更高动态范围传感器或多曝光图像合成。主流显示设备动态范围有限，无法直接显示宽动态图像；DRC 压缩图像动态范围，使观看真实场景与显示设备的观察者获得相同视觉体验。

<!-- source: EN PDF p114; unit 1176 -->

#### 4.2   4.4.2 关键参数

<!-- source: EN PDF p114; unit 1177 -->

##### 4.2.1   4.4.2.1 Enable

<!-- source: EN PDF p114; unit 1178 -->

【说明】

<!-- source: EN PDF p114; unit 1179 -->

功能开关：0 关闭，1 开启。

<!-- source: EN PDF p114; unit 1180 -->

【成员】

<!-- source: EN PDF p114; unit 1181 -->

【注意事项】

<!-- source: EN PDF p114; unit 1182 -->

该开关仅在线性模式有效；HDR 模式无效，强制开启。

<!-- source: EN PDF p114; unit 1183 -->

##### 4.2.2   4.4.2.2 DrcGain

<!-- source: EN PDF p114; unit 1184 -->

【说明】

<!-- source: EN PDF p114; unit 1185 -->

DrcGain 可调整输入 RAW 亮度，包括整体或局部亮度。

<!-- source: EN PDF p114; unit 1186 -->

【成员】

<!-- source: EN PDF p115; unit 1187 -->

| 成员名称 | 说明 |
| --- | --- |
| EnvLv | 环境亮度，范围 [0,1]，0 全黑、1 最亮。 |
| EnvLv_len | EnvLv 数组长度 |
| DrcGain | DRC 增益，范围 [1,8]。 |
| DrcGain_len | DrcGain 数组长度 |
| Alpha | 范围 [0,1]。 |
| Alpha_len | Alpha 数组长度 |
| Clip | 原文范围表述为“0,64 to”，未补写缺失内容。 |
| Clip_len | Clip 数组长度 |

<!-- source: EN PDF p115; unit 1188 -->

【注意事项】

<!-- source: EN PDF p115; unit 1189 -->

##### 4.2.3   4.4.2.3 HiLight

<!-- source: EN PDF p115; unit 1190 -->

HiLight 可调整输出 RAW 的高光区域。

<!-- source: EN PDF p115; unit 1191 -->

【成员】

<!-- source: EN PDF p115; unit 1192 -->

| 成员名称 | 说明 |
| --- | --- |
| EnvLv | 环境亮度，范围 [0,1]，0 全黑、1 最亮。 |
| EnvLv_len | EnvLv 数组长度 |
| Strength | 高光细节，范围 [0,1]。 |
| Strength_len | Strength 数组长度 |

<!-- source: EN PDF p115; unit 1193 -->

【注意事项】

<!-- source: EN PDF p115; unit 1194 -->

##### 4.2.4   4.4.2.4 LocalSetting

<!-- source: EN PDF p115; unit 1195 -->

【说明】

<!-- source: EN PDF p115; unit 1196 -->

LocalSetting 用于调整 Local 相关参数。

<!-- source: EN PDF p115; unit 1197 -->

###### 4.2.4.1   4.4.2.4.1 LocalData

<!-- source: EN PDF p115; unit 1198 -->

【说明】

<!-- source: EN PDF p115; unit 1199 -->

LocalData 主要调整局部权重和对比度。

<!-- source: EN PDF p115; unit 1200 -->

【成员】

<!-- source: EN PDF p116; unit 1201 -->

| 成员名称 | 说明 |
| --- | --- |
| EnvLv | 环境亮度，范围 [0,1]，0 全黑、1 最亮。 |
| EnvLv_len | EnvLv 数组长度 |
| LocalWeit | Local 范围 0,1；0 为 Global，1 为全 Local，默认 0。 |
| LocalWeit_len | LocalWeit 数组长度 |
| LocalAutoEnable | 自动 LocalWeit 开关，范围 [0,1]，默认 1，精度 1。 |
| LocalAutoEnable_len | LocalAutoEnable 数组长度 |
| LocalAutoWeit | 自动 LocalWeit 值，范围 0,1，默认 0.4，精度 0.01。 |
| LocalAutoWeit_len | LocalAutoWeit 数组长度 |
| GlobalContrast | 全局对比度，范围 0,1，默认 0，精度 0.01。 |
| GlobalContrast_len | GlobalContrast 数组长度 |
| LoLitContrast | 低亮区对比度，范围 0,1，默认 0，精度 0.01。 |
| LoLitContrast_len | LoLitContrast 数组长度 |

<!-- source: EN PDF p116; unit 1202 -->

【注意事项】

<!-- source: EN PDF p116; unit 1203 -->

开启 LocalAutoEnable 时，LocalAutoWeit 生效，LocalWeit 不生效。

<!-- source: EN PDF p116; unit 1204 -->

###### 4.2.4.2   4.4.2.4.3 curPixWeit

<!-- source: EN PDF p116; unit 1205 -->

【说明】

<!-- source: EN PDF p116; unit 1206 -->

当前点双边权重，范围 [0,1]，默认 0.37，精度 0.001。

<!-- source: EN PDF p116; unit 1207 -->

【成员】

<!-- source: EN PDF p116; unit 1208 -->

【注意事项】

<!-- source: EN PDF p116; unit 1209 -->

###### 4.2.4.3   4.4.2.4.4 preFrameWeit

<!-- source: EN PDF p116; unit 1210 -->

【说明】

<!-- source: EN PDF p116; unit 1211 -->

原文说明为当前帧双边权重，范围 [0,1]，默认 0.8，精度 0.001（参数名 preFrameWeit 与说明存在疑点）。

<!-- source: EN PDF p116; unit 1212 -->

【成员】

<!-- source: EN PDF p116; unit 1213 -->

【注意事项】

<!-- source: EN PDF p117; unit 1214 -->

###### 4.2.4.4   4.4.2.4.5 Range_force_sgm

<!-- source: EN PDF p117; unit 1215 -->

【说明】

<!-- source: EN PDF p117; unit 1216 -->

双边值域 sigma 的倒数，范围 [0,1]，默认 0，精度 0.0001。

<!-- source: EN PDF p117; unit 1217 -->

【成员】

<!-- source: EN PDF p117; unit 1218 -->

【注意事项】

<!-- source: EN PDF p117; unit 1219 -->

Range_force_sgm 非零时，Range_sgm_cur 和 Range_sgm_pre 不生效。

<!-- source: EN PDF p117; unit 1220 -->

###### 4.2.4.5   4.4.2.4.6 Range_sgm_cur

<!-- source: EN PDF p117; unit 1221 -->

【说明】

<!-- source: EN PDF p117; unit 1222 -->

当前帧双边空间域 sigma 的倒数，范围 [0,1]，默认 0.2，精度 0.0001（域名称按原文保留）。

<!-- source: EN PDF p117; unit 1223 -->

【成员】

<!-- source: EN PDF p117; unit 1224 -->

【注意事项】

<!-- source: EN PDF p117; unit 1225 -->

###### 4.2.4.6   4.4.2.4.7 Range_sgm_pre

<!-- source: EN PDF p117; unit 1226 -->

【说明】

<!-- source: EN PDF p117; unit 1227 -->

上一帧双边空间域 sigma 的倒数，范围 [0,1]，默认 0.2，精度 0.0001（域名称按原文保留）。

<!-- source: EN PDF p117; unit 1228 -->

【成员】

<!-- source: EN PDF p117; unit 1229 -->

【注意事项】

<!-- source: EN PDF p117; unit 1230 -->

###### 4.2.4.7   4.4.2.4.8 Space_sgm_cur

<!-- source: EN PDF p117; unit 1231 -->

【说明】

<!-- source: EN PDF p117; unit 1232 -->

当前帧双边值域 sigma 的倒数，范围 [0,4095]，默认 4068，精度 1（域名称按原文保留）。

<!-- source: EN PDF p117; unit 1233 -->

【成员】

<!-- source: EN PDF p117; unit 1234 -->

【注意事项】

<!-- source: EN PDF p118; unit 1235 -->

###### 4.2.4.8   4.4.2.4.9 Space_sgm_pre

<!-- source: EN PDF p118; unit 1236 -->

【说明】

<!-- source: EN PDF p118; unit 1237 -->

上一帧双边值域 sigma 的倒数，范围 [0,4095]，默认 3068，精度 1（域名称按原文保留）。

<!-- source: EN PDF p118; unit 1238 -->

【成员】

<!-- source: EN PDF p118; unit 1239 -->

【注意事项】

<!-- source: EN PDF p118; unit 1240 -->

##### 4.2.5   4.4.2.5 CompressSetting

<!-- source: EN PDF p118; unit 1241 -->

【说明】

<!-- source: EN PDF p118; unit 1242 -->

CompressSetting 可调整压缩曲线。

<!-- source: EN PDF p118; unit 1243 -->

【成员】

<!-- source: EN PDF p118; unit 1244 -->

| 成员名称 | 说明 |
| --- | --- |
| Mode | 进入曲线表选择模式 |

<!-- source: EN PDF p118; unit 1245 -->

【注意事项】

<!-- source: EN PDF p118; unit 1246 -->

默认使用 AUTO 模式。

<!-- source: EN PDF p118; unit 1247 -->

##### 4.2.6   4.4.2.6 Scale_y

<!-- source: EN PDF p118; unit 1248 -->

【说明】

<!-- source: EN PDF p118; unit 1249 -->

增益修改比例表，范围 [0,2048]。

<!-- source: EN PDF p118; unit 1250 -->

【成员】

<!-- source: EN PDF p118; unit 1251 -->

【注意事项】

<!-- source: EN PDF p118; unit 1252 -->

##### 4.2.7   4.4.2.7 ByPassThr

<!-- source: EN PDF p118; unit 1253 -->

【说明】

<!-- source: EN PDF p118; unit 1254 -->

本模块旁路阈值，范围 [0,1]。当前环境亮度与上一帧环境亮度的百分比差小于 ByPassThr 时，不更新本模块参数。

<!-- source: EN PDF p118; unit 1255 -->

【成员】

<!-- source: EN PDF p118; unit 1256 -->

【注意事项】

<!-- source: EN PDF p118; unit 1257 -->

使用工具调试时将值设为 0，否则调试可能无效。

<!-- source: EN PDF p119; unit 1258 -->

##### 4.2.8   4.4.2.8 Edge_Weit

<!-- source: EN PDF p119; unit 1259 -->

【说明】

<!-- source: EN PDF p119; unit 1260 -->

边缘响应比例，范围 [0,1]，默认 0.02，精度 0.01，用于减少高对比度边缘伪影。

<!-- source: EN PDF p119; unit 1261 -->

【成员】

<!-- source: EN PDF p119; unit 1262 -->

【注意事项】

<!-- source: EN PDF p119; unit 1263 -->

##### 4.2.9   4.4.2.9 OutPutLongFrame

<!-- source: EN PDF p119; unit 1264 -->

【说明】

<!-- source: EN PDF p119; unit 1265 -->

仅输出长帧：0 关闭，1 开启。

<!-- source: EN PDF p119; unit 1266 -->

【成员】

<!-- source: EN PDF p119; unit 1267 -->

【注意事项】

<!-- source: EN PDF p119; unit 1268 -->

此参数仅用于 Debug 阶段。

<!-- source: EN PDF p119; unit 1269 -->

##### 4.2.10   4.4.2.10 IIR_frame

<!-- source: EN PDF p119; unit 1270 -->

【说明】

<!-- source: EN PDF p119; unit 1271 -->

IIR 滤波帧数，范围 [1,1000]，默认 2，精度 1。

<!-- source: EN PDF p119; unit 1272 -->

【成员】

<!-- source: EN PDF p119; unit 1273 -->

【注意事项】

<!-- source: EN PDF p119; unit 1274 -->

该参数在线性模式下无效。

<!-- source: EN PDF p119; unit 1275 -->

##### 4.2.11   4.4.2.11 Tolerance

<!-- source: EN PDF p119; unit 1276 -->

【说明】

<!-- source: EN PDF p119; unit 1277 -->

随 EnvLv 变化的参数 DrcGain、Alpha、Clip、Strength、LocalWeit、GlobalContrast、LoLitContrast 的容差，范围 [0,1]。

<!-- source: EN PDF p119; unit 1278 -->

【成员】

<!-- source: EN PDF p119; unit 1279 -->

【注意事项】

<!-- source: EN PDF p119; unit 1280 -->

##### 4.2.12   4.4.2.12 damp

<!-- source: EN PDF p119; unit 1281 -->

【说明】

<!-- source: EN PDF p120; unit 1282 -->

上述随 EnvLv 变化参数的平滑系数，即当前帧参数所占比例；范围 [0,1]，默认 0.9。参数为 DrcGain、Alpha、Clip、Strength、LocalWeit、GlobalContrast、LoLitContrast。

<!-- source: EN PDF p120; unit 1283 -->

【成员】

<!-- source: EN PDF p120; unit 1284 -->

【注意事项】

<!-- source: EN PDF p120; unit 1285 -->

#### 4.3   4.4.3 调试步骤

<!-- source: EN PDF p120; unit 1286 -->

##### 4.3.1   4.4.3.1 DrcGain 调试

<!-- source: EN PDF p120; unit 1287 -->

【说明】

<!-- source: EN PDF p120; unit 1288 -->

DrcGain 可调整输入 RAW 亮度，包括整体或局部亮度。

<!-- source: EN PDF p120; unit 1289 -->

【成员】

<!-- source: EN PDF p120; unit 1290 -->

| 成员名称 | 说明 |
| --- | --- |
| DrcGain | DRC 模块增益，范围 [1,8]。 |
| Alpha | 范围 [0,1]。 |
| Clip | 范围 [0,64]。 |

<!-- source: EN PDF p120; unit 1291 -->

【注意事项】

<!-- source: EN PDF p120; unit 1292 -->

DrcGain 曲线由 DrcGain、Alpha、Clip 三个参数构成，近似形状如下。

<!-- source: EN PDF p121; unit 1293 -->

![英文 PDF 原图 121](/docs/rockchip-isp30-tuning/assets/en-p121-X844.png)

<!-- source: EN PDF p121; unit 1294 -->

图中横坐标为像素亮度 0~4096，纵坐标为该亮度像素的增益倍数。

<!-- source: EN PDF p121; unit 1295 -->

DrcGain：

<!-- source: EN PDF p121; unit 1296 -->

DrcGain 确定最大增益倍数，受两个条件限制：

![DRC 原始约束公式](/docs/rockchip-isp30-tuning/assets/en-p121-vector-drc-constraints.png)

`1 <= DrcGain <= 8`

`AERatio * DrcGain <= 256`

<!-- source: EN PDF p121; unit 1297 -->

由上述条件可知实际 DrcGain 小于 8x。若调试中设为 8x，但与 AERatio 的乘积大于 256x，内部会裁减 DrcGain，使乘积小于 256x。

<!-- source: EN PDF p121; unit 1298 -->

实际调试中，在相同亮度下增加 DrcGain 可减少长短帧位移误差；原文括号写“except for sensors other than DCG mode”，例外范围表述不清，保留待核对。DrcGain 是数字增益：传感器仍处于模拟增益模式时，增加它会提高噪声；传感器处于数字增益模式时，增加它对噪声水平没有显著差异。

<!-- source: EN PDF p121; unit 1299 -->

下图为 DrcGain 等于 1x（红线）和 8x（蓝线）的近似曲线。

<!-- source: EN PDF p122; unit 1300 -->

![英文 PDF 原图 122](/docs/rockchip-isp30-tuning/assets/en-p122-X847.png)

<!-- source: EN PDF p122; unit 1301 -->

Alpha：

<!-- source: EN PDF p122; unit 1302 -->

Alpha 确定 DrcGain 曲线斜率，下图比较 Alpha 为 0（红线）与 0.9（蓝线）。

<!-- source: EN PDF p123; unit 1303 -->

![英文 PDF 原图 123](/docs/rockchip-isp30-tuning/assets/en-p123-X850.png)

<!-- source: EN PDF p123; unit 1304 -->

Alpha 越小，DrcGain 曲线越接近水平直线，即各亮度被等比例放大，可能导致对比度不足及暗部噪声放大。

<!-- source: EN PDF p123; unit 1305 -->

<!-- source: EN PDF p123; unit 1306 -->

Clip：

<!-- source: EN PDF p124; unit 1307 -->

![英文 PDF 原图 124](/docs/rockchip-isp30-tuning/assets/en-p124-X853.png)

<!-- source: EN PDF p124; unit 1308 -->

##### 4.3.2   4.4.3.2 HiLight 调试

<!-- source: EN PDF p124; unit 1309 -->

【说明】

<!-- source: EN PDF p124; unit 1310 -->

HiLight 可调整输出 RAW 高光区域的细节。

<!-- source: EN PDF p124; unit 1311 -->

【成员】

<!-- source: EN PDF p124; unit 1312 -->

| 成员名称 | 说明 |
| --- | --- |
| Strength | 高光细节，范围 [0,1]。 |

<!-- source: EN PDF p124; unit 1313 -->

【注意事项】

<!-- source: EN PDF p124; unit 1314 -->

Stength 值越大，高光压缩后细节越好，但高光边界越容易产生光晕。下图左侧 Strength 为 0，右侧为 1（Stength 为原文拼写）。

<!-- source: EN PDF p125; unit 1315 -->

![英文 PDF 原图 125](/docs/rockchip-isp30-tuning/assets/en-p125-X857.png)

<!-- source: EN PDF p125; unit 1316 -->

![英文 PDF 原图 125](/docs/rockchip-isp30-tuning/assets/en-p125-X858.png)

<!-- source: EN PDF p125; unit 1317 -->

##### 4.3.3   4.4.3.3 LocalSetting 调试

<!-- source: EN PDF p125; unit 1318 -->

【说明】

<!-- source: EN PDF p125; unit 1319 -->

LocalSetting 调整 Local 相关参数。当 LocalAutoEnable=0 且 LocalWeit=0，或 LocalAutoEnable=1 且 LocalAutoWeit=0 时，本模块全部参数无效。

<!-- source: EN PDF p125; unit 1320 -->

###### 4.3.3.1   4.4.3.3.1 LocalData 调试

<!-- source: EN PDF p125; unit 1321 -->

【说明】

<!-- source: EN PDF p125; unit 1322 -->

LocalTMOData 主要调整 LocalTMO 权重、全局对比度和暗区对比度。

<!-- source: EN PDF p125; unit 1323 -->

【成员】

<!-- source: EN PDF p126; unit 1324 -->

| 成员名称 | 说明 |
| --- | --- |
| LocalWeit | Local TMO 权重，范围 [0,1]；0 全局 TMO，1 全局部 TMO。 |
| LocalAutoEnable | 自动 LocalWeit 开关，范围 [0,1]，默认 1，精度 1。 |
| LocalAutoWeit | 自动 LocalWeit 值，范围 [0,1]，默认 0.4，精度 0.01。 |
| GlobalContrast | 全局对比度，范围 [0,1]，默认 0，精度 0.01。 |
| LoLitContrast | 低亮区对比度，范围 [0,1]，默认 0，精度 0.01。 |

<!-- source: EN PDF p126; unit 1325 -->

【注意事项】

<!-- source: EN PDF p126; unit 1326 -->

当 LocalAutoEnable = 0 且 LocalWeit = 0，或 LocalAutoEnable = 1 且 LocalAutoWeit=0 时，DRC 为 Global 模式。原文接着列出 LocalAutoEnable=0 且 LocalWeit &gt; 0，或 LocalAutoEnable=1 且 LocalAutoWeit&gt;0 的条件，但句子未完成，未猜补其结论。

<!-- source: EN PDF p126; unit 1327 -->

GlobalContrast：值越大，整体对比度越强（不含暗区）。下图左侧为 0，右侧为 1。

<!-- source: EN PDF p126; unit 1328 -->

![英文 PDF 原图 126](/docs/rockchip-isp30-tuning/assets/en-p126-X863.png)

<!-- source: EN PDF p126; unit 1329 -->

![英文 PDF 原图 126](/docs/rockchip-isp30-tuning/assets/en-p126-X864.png)

<!-- source: EN PDF p126; unit 1330 -->

LoLitContrast：值越大，暗区对比度越强。下图左侧为 0，右侧为 1。

<!-- source: EN PDF p127; unit 1331 -->

![英文 PDF 原图 127](/docs/rockchip-isp30-tuning/assets/en-p127-X867.png)

<!-- source: EN PDF p127; unit 1332 -->

![英文 PDF 原图 127](/docs/rockchip-isp30-tuning/assets/en-p127-X868.png)

<!-- source: EN PDF p127; unit 1333 -->

##### 4.3.4   4.4.3.4 Edge_Weit 调试

<!-- source: EN PDF p127; unit 1334 -->

【说明】

<!-- source: EN PDF p127; unit 1335 -->

改变该值以减少高对比度边缘伪影。

<!-- source: EN PDF p127; unit 1336 -->

【成员】

<!-- source: EN PDF p127; unit 1337 -->

【注意事项】

<!-- source: EN PDF p128; unit 1338 -->

![英文 PDF 原图 128](/docs/rockchip-isp30-tuning/assets/en-p128-X872.png)

<!-- source: EN PDF p128; unit 1339 -->

![英文 PDF 原图 128](/docs/rockchip-isp30-tuning/assets/en-p128-X873.png)

<!-- source: EN PDF p128; unit 1340 -->

### 5.   4.5 去雾与增强

<!-- source: EN PDF p128; unit 1341 -->

#### 5.1   4.5.1 功能说明

<!-- source: EN PDF p128; unit 1342 -->

雾霾等恶劣天气下，大气散射使图像质量严重下降，颜色灰白、对比度降低、物体特征难以识别，需要图像去雾技术增强或修复视觉效果。

<!-- source: EN PDF p128; unit 1343 -->

本模块包括 Dehaze、Enhance、Hist。Dehaze 主要用于雾霾较重的画面，Enhanced 和 Hist 多用于增强对比度。原文关于 Dehaze 与 Enhance 同时开启的句子自相矛盾，写两者“can only be opened at the same time”，随后又称同时开启时仅“Add module”生效；未擅自推定优先级。Hist 可与其他模块一起开启。

<!-- source: EN PDF p128; unit 1344 -->

原文含未解析的图片标记 `! [] (Resources/Dehaze Block Diagram .png)`；下方保留实际原图。

<!-- source: EN PDF p129; unit 1345 -->

![英文 PDF 原图 129](/docs/rockchip-isp30-tuning/assets/en-p129-X878.png)

<!-- source: EN PDF p129; unit 1346 -->

Dehaze 模块框图

<!-- source: EN PDF p129; unit 1347 -->

#### 5.2   4.5.2 关键参数

<!-- source: EN PDF p129; unit 1348 -->

##### 5.2.1   4.7.2.1 Enable

<!-- source: EN PDF p129; unit 1349 -->

【说明】

<!-- source: EN PDF p129; unit 1350 -->

Dehaze 与 Enhanced 功能开关。

<!-- source: EN PDF p129; unit 1351 -->

0：关闭。

<!-- source: EN PDF p129; unit 1352 -->

1：开启。

<!-- source: EN PDF p129; unit 1353 -->

【成员】

<!-- source: EN PDF p129; unit 1354 -->

【注意事项】

<!-- source: EN PDF p129; unit 1355 -->

##### 5.2.2   4.5.2.2 cfg_alpha

<!-- source: EN PDF p129; unit 1356 -->

【说明】

<!-- source: EN PDF p129; unit 1357 -->

软件配置参数占比，范围 [0,1]，默认 1，精度 0.01。

<!-- source: EN PDF p129; unit 1358 -->

0：全部使用自适应参数。

<!-- source: EN PDF p129; unit 1359 -->

1：全部使用软件配置参数；可按比例混合自适应与软件配置参数。

<!-- source: EN PDF p129; unit 1360 -->

【成员】

<!-- source: EN PDF p129; unit 1361 -->

【注意事项】

<!-- source: EN PDF p129; unit 1362 -->

值为 0 时，Dehaze 的 cfg_wt、cfg_air、cfg_tmax 及 Hist 的 cfg_gratio 无效；值为 1 时，Dehaze 完全由 cfg_wt、cfg_air、cfg_tmax 决定，Hist 完全由 cfg_gratio 决定。

<!-- source: EN PDF p129; unit 1363 -->

##### 5.2.3   4.5.2.3 ByPassThr

<!-- source: EN PDF p129; unit 1364 -->

【说明】

<!-- source: EN PDF p130; unit 1365 -->

本模块旁路阈值，范围 [0,1]。当前环境亮度与上一帧环境亮度的百分比差小于 ByPassThr 时，不更新本模块参数。

<!-- source: EN PDF p130; unit 1366 -->

【成员】

<!-- source: EN PDF p130; unit 1367 -->

【注意事项】

<!-- source: EN PDF p130; unit 1368 -->

使用工具调试时将值设为 0，否则调试可能无效。

<!-- source: EN PDF p130; unit 1369 -->

##### 5.2.4   4.5.2.4 Dehaze_Setting

<!-- source: EN PDF p130; unit 1370 -->

【说明】

<!-- source: EN PDF p130; unit 1371 -->

通过本模块调整去雾参数。

<!-- source: EN PDF p130; unit 1372 -->

【成员】

<!-- source: EN PDF p130; unit 1373 -->

| 成员名称 | 说明 |
| --- | --- |
| en | 功能开关 |
| air_lc_en | 是否基于 Airlight Base 进行最小截断的开关。 |
| stab_fnum | 帧稳定最大值 |
| sigma | IIR 控制的 sigma |
| wt_sigma | 帧间 WT 滤波系数 |
| air_sigma | 帧间 air 滤波系数 |
| tmax_sigma | 帧间 tmax 滤波系数 |
| pre_wet | 参考数据 IIR 滤波因子 |
| DehazeData | 去雾调试参数 |

<!-- source: EN PDF p131; unit 1374 -->

| 成员名称 | 说明 |
| --- | --- |
| EnvLv | 环境亮度 |
| EnvLv_len | EnvLv 数组长度 |
| dc_min_th | WT 自适应统计范围，范围 [16, 120]，默认 64。 |
| dc_min_th_len | dc_min_th 数组长度 |
| dc_max_th | WT 自适应高曝光区统计范围，范围 [170, 255]，默认 192。 |
| dc_max_th_len | dc_max_th 数组长度 |
| yhist_th | y 分量高曝光区统计范围 [170, 255]，默认 249。 |
| yhist_th_len | yhist_th 数组长度 |
| yblk_th | y 分量块数量比例阈值，范围 0.002, 0.01，默认 0.002。 |
| yblk_th_len | yblk_th 数组长度 |
| dark_th | WT 自适应 Y 分量块最小值阈值，范围 [230, 250]，默认 250。 |
| dark_th_len | dark_th 数组长度 |
| bright_min | air 自适应阈值最小值，160 到 200，默认 180。 |
| bright_min_len | bright_min 数组长度 |
| bright_max | air 自适应阈值最大值，210 到 250，默认 240。 |
| bright_max_len | bright_max 数组长度 |
| wt_max | WT 自适应最大值，范围 0.75, 0.9，默认 0.9。 |
| wt_max_len | wt_max 数组长度 |
| air_min | air 自适应最小值，200 到 220，默认 200。 |
| air_min_len | air_min 数组长度 |
| air_max | air 自适应最大值，230 到 250，默认 250。 |
| air_max_len | air_max 数组长度 |
| tmax_base | tmax 默认 125；对应配置 200 (131)、210 (125)、220 (119)、230 (114)、240 (109)、250 (105)，范围 131-105。 |

<!-- source: EN PDF p132; unit 1375 -->

| 成员名称 | 说明 |
| --- | --- |
| tmax_base_len | tmax_base 数组长度 |
| tmax_off | tmax 自适应固定值，范围 [0.1, 0.5]，默认 0.1。 |
| tmax_off_len | tmax_off 数组长度 |
| tmax_max | tmax 最大值，范围 0.1, 0.5，默认 0.5。 |
| tmax_max_len | tmax_max 数组长度 |
| cfg_wt | 软件配置 wt 去雾强度，范围 [0, 1]，默认 0.8。 |
| cfg_wt_len | cfg_wt 数组长度 |
| cfg_air | 软件配置 air 大气光系数，范围 [0, 255]，默认 210。 |
| cfg_air_len | cfg_air 数组长度 |
| cfg_tmax | 软件配置 tmax 最大去雾值，范围 0, 1，默认 0.2。 |
| cfg_tmax_len | cfg_tmax 数组长度 |
| bf_weight | 两种双边滤波的合成权重，范围 [0, 1]，默认 0.5。 |
| bf_weight_len | bf_weight 数组长度 |
| dc_weitcur | 暗通道部分权重，范围 [0, 1]；原文默认值缺失。 |
| dc_weitcur_len | dc_weitcur 数组长度 |
| range_sigma | 双边滤波值域 sigma，范围 [0, 1]，默认 0.4。 |
| range_sigma_len | range_sigma 数组长度 |
| space_sigma_pre | 以 IIR 数据为参考时的双边空间域 sigma，范围 [0, 1]，默认 0.4。 |
| space_sigma_pre_len | space_sigma_pre 数组长度 |
| space_sigma_cur | 以当前数据为参考时的双边空间域 sigma，范围 [0, 1]，默认 0.8。 |
| space_sigma_cur_len | space_sigma_cur 数组长度 |

<!-- source: EN PDF p132; unit 1376 -->

【注意事项】

<!-- source: EN PDF p132; unit 1377 -->

stab_fnum：去雾参数从 0 逐渐达到稳定值，sw_dhaze_stab_fnum 为软件指定的稳定帧数；一般 10 帧较合适，最大可配 31，最多约 1s 进入稳定状态。

<!-- source: EN PDF p133; unit 1378 -->

##### 5.2.5   4.5.2.5 Enhance_Setting

<!-- source: EN PDF p133; unit 1379 -->

【说明】

<!-- source: EN PDF p133; unit 1380 -->

本模块调整图像对比度。

<!-- source: EN PDF p133; unit 1381 -->

【成员】

<!-- source: EN PDF p133; unit 1382 -->

| 成员名称 | 说明 |
| --- | --- |
| en | enhance 功能开关 |
| enhance_curve | 低频曲线 |
| EnhanceData | enhance 调试参数 |

<!-- source: EN PDF p133; unit 1383 -->

| 成员名称 | 说明 |
| --- | --- |
| EnvLv | 环境亮度 |
| EnvLv_len | 环境亮度数组长度 |
| enhance_value | 通用对比度强度，范围 [0, 16]，建议 [1, 2]。 |
| enhance_value_len | enhance_value 数组长度 |
| enhance_chroma | 色度增强调整参数，范围 [0, 16]，建议 [1, 2]。 |
| enhance_chroma_len | enhance_chroma 数组长度 |

<!-- source: EN PDF p133; unit 1384 -->

【注意事项】

<!-- source: EN PDF p133; unit 1385 -->

enhance_value：值越大，对比度越大。

<!-- source: EN PDF p133; unit 1386 -->

enhance_chroma：值越大，饱和度越高。

<!-- source: EN PDF p133; unit 1387 -->

##### 5.2.6   4.5.2.6 Hist_Setting

<!-- source: EN PDF p133; unit 1388 -->

【说明】

<!-- source: EN PDF p133; unit 1389 -->

本模块调整图像对比度，通常用于去雾后对比度仍不足时。

<!-- source: EN PDF p133; unit 1390 -->

【成员】

<!-- source: EN PDF p134; unit 1391 -->

| 成员名称 | 说明 |
| --- | --- |
| en | Hist 功能开关 |
| hist_para_en | 直方图拉伸控制开关 |
| HistData | hist 调试参数 |

<!-- source: EN PDF p134; unit 1392 -->

| 成员名称 | 说明 |
| --- | --- |
| EnvLv | 环境亮度 |
| EnvLv_len | EnvLv 数组长度 |
| hist_gratio | 直方图拉伸倍数、均衡控制系数，范围 [0, 32]。 |
| hist_gratio_len | hist_gratio 数组长度 |
| hist_th_off | 直方图统计阈值，0 到 255，默认 64。 |
| hist_th_off_len | hist_th_off 数组长度 |
| hist_k | 直方图自适应阈值放大倍数，0 到 7，默认 2。 |
| hist_k_len | hist_k 数组长度 |
| hist_min | 直方图统计阈值最小值，范围 [0,2]，默认 0.016。 |
| hist_min_len | hist_min 数组长度 |
| hist_scale | 直方图均衡控制系数，范围 [0, 32]。 |
| hist_scale_len | hist_scale 数组长度 |
| cfg_gratio | 软件配置直方图拉伸倍数和均衡系数，范围 [0, 32)（右开区间按原文保留）。 |
| cfg_gratio_len | cfg_gratio 数组长度 |

<!-- source: EN PDF p134; unit 1393 -->

【注意事项】

<!-- source: EN PDF p134; unit 1394 -->

hist_para_en 为 1 时 hist_scale 生效、hist_gratio 无效；为 0 时相反。

<!-- source: EN PDF p134; unit 1395 -->

hist_gratio：值越大，直方图拉伸越多，整体亮度越高。

<!-- source: EN PDF p134; unit 1396 -->

hist_th_off：值越大，直方图统计值越大，整体亮度越高。

<!-- source: EN PDF p134; unit 1397 -->

hist_k：值越大，直方图统计值越大，整体亮度越高。

<!-- source: EN PDF p135; unit 1398 -->

hist_min：值越大，直方图统计值越大，整体亮度越高。

<!-- source: EN PDF p135; unit 1399 -->

#### 5.3   4.5.3 调试步骤

<!-- source: EN PDF p135; unit 1400 -->

主要分为 Dehaze、Enhanced、Hist 三部分调试。

<!-- source: EN PDF p135; unit 1401 -->

##### 5.3.1   4.5.3.1 Dehaze 调试

<!-- source: EN PDF p135; unit 1402 -->

【说明】

<!-- source: EN PDF p135; unit 1403 -->

建议通过以下三个参数调节去雾强度，它们随 ISO 变化。调试时 cfg_alpha 须设为 1。

<!-- source: EN PDF p135; unit 1404 -->

【成员】

<!-- source: EN PDF p135; unit 1405 -->

| 成员名称 | 说明 |
| --- | --- |
| cfg_wt | 软件配置 wt，图像去雾强度 |
| cfg_air | 软件配置 air，大气光幕系数 |
| cfg_tmax | 软件配置 tmax，最大去雾 |

<!-- source: EN PDF p135; unit 1406 -->

【注意事项】

<!-- source: EN PDF p135; unit 1407 -->

1\.cfg_wt：越大去雾越强。wt 最好不超过 0.9；除非场景雾很重，多数情况下超过 0.9 会产生不自然效果。下图从左到右为 Dehaze_en= 0、Dehaze_en = 1 且 cfg_wt= 0.4、Dehaze_en = 1 且 cfg_wt= 0.8。

<!-- source: EN PDF p135; unit 1408 -->

![英文 PDF 原图 135](/docs/rockchip-isp30-tuning/assets/en-p135-X898.png)

<!-- source: EN PDF p135; unit 1409 -->

cfg_wt 对比图

<!-- source: EN PDF p135; unit 1410 -->

2\.cfg_air：也控制去雾强度，并影响过曝区域去雾效果，配合 sw_dhaz_cfg_wt 使用。

<!-- source: EN PDF p135; unit 1411 -->

如下输入图中，cfg_air 越大，天空交界处去雾越自然；为 250 时没有中间分层问题。调试 AIR 主要考虑画面有无天空或过曝区域；若有，应增大 AIR，避免分层或细节丢失。下图从左到右为 Dehaze_en= 0、Dehaze_en= 1 且 cfg_air= 200、Dehaze_en= 1 且 cfg_air= 250。

<!-- source: EN PDF p136; unit 1412 -->

![英文 PDF 原图 136](/docs/rockchip-isp30-tuning/assets/en-p136-X903.png)

<!-- source: EN PDF p136; unit 1413 -->

cfg_air 对比图

<!-- source: EN PDF p136; unit 1414 -->

3\.cfg_tmax：值越小，沿景深方向去雾越强；值越大，越弱。

<!-- source: EN PDF p136; unit 1415 -->

cfg_tmax 为 0.1 时景深方向雾去除较干净，已可见部分细节；为 0.5 时明显较弱。并非去雾越多越好，过度处理会破坏层次，通常 0.2 较合适。下图从左到右为 Dehaze_en= 0、Dehaze_en= 1 且 cfg_tmax= 0.1、Dehaze_en= 1 且 cfg_tmax= 0.5。

<!-- source: EN PDF p136; unit 1416 -->

![英文 PDF 原图 136](/docs/rockchip-isp30-tuning/assets/en-p136-X904.png)

<!-- source: EN PDF p136; unit 1417 -->

cfg_tmax 对比图

<!-- source: EN PDF p136; unit 1418 -->

##### 5.3.2   4.5.3.2 Enhanced 调试

<!-- source: EN PDF p136; unit 1419 -->

【说明】

<!-- source: EN PDF p136; unit 1420 -->

通用对比度增强通过 enhance_value 调整，它随 ISO 变化。

<!-- source: EN PDF p136; unit 1421 -->

【成员】

<!-- source: EN PDF p136; unit 1422 -->

| 成员名称 | 说明 |
| --- | --- |
| enhance_value | 通用对比度强度 |
| enhance_chroma | 色度增强调整参数 |
| enh_curve | 低频曲线 |

<!-- source: EN PDF p136; unit 1423 -->

【注意事项】

<!-- source: EN PDF p136; unit 1424 -->

1\.enhance_value：值越大，对比度越强。下图从左到右为 Enhance_en = 0、Enhance_en = 1 且 enhance_value = 1.5。

<!-- source: EN PDF p137; unit 1425 -->

![英文 PDF 原图 137](/docs/rockchip-isp30-tuning/assets/en-p137-X908.png)

<!-- source: EN PDF p137; unit 1426 -->

enhance_value 对比图

<!-- source: EN PDF p137; unit 1427 -->

2\.enhance_chroma：值越大，饱和度越高。下图从左到右为 Enhance_en = 0、Enhance_en = 1 且 enhance_chroma = 1.5。

<!-- source: EN PDF p137; unit 1428 -->

![英文 PDF 原图 137](/docs/rockchip-isp30-tuning/assets/en-p137-X909.png)

<!-- source: EN PDF p137; unit 1429 -->

enhance_chroma 对比图

<!-- source: EN PDF p137; unit 1430 -->

3\.enh_curve：降低暗区参数可改善暗区亮度和对比度。

<!-- source: EN PDF p137; unit 1431 -->

##### 5.3.3   4.5.3.3 Hist 调试

<!-- source: EN PDF p137; unit 1432 -->

【说明】

<!-- source: EN PDF p137; unit 1433 -->

原文建议用“以下两个参数”调节直方图均衡 Hist，它们随 ISO 变化；调整时 cfg_alpha 设为 1。以下实际仅给出 cfg_gratio，保留原稿缺项待核对。

<!-- source: EN PDF p137; unit 1434 -->

【成员】

<!-- source: EN PDF p137; unit 1435 -->

| 成员名称 | 说明 |
| --- | --- |
| cfg_gratio | 软件配置直方图拉伸倍数、均衡控制系数。 |

<!-- source: EN PDF p137; unit 1436 -->

【注意事项】

<!-- source: EN PDF p137; unit 1437 -->

cfg_gratio：与 WT 相关。原文关于 WT、Gratio、GT 的大小关系表述混乱，需核对；参数过大会使效果不自然、整体偏蓝，并再次丢失部分细节。gratio 是直方图拉伸系数，其大小与 wt 相关：wt 较大时适当调高 gratio，wt 较小时降低，避免小 wt 配大 gratio。下图从左到右为 Hist_en = 0、Hist_en = 1 且 cfg_gratio = 0.768、Hist_en = 1 且 cfg_gratio= 2。

<!-- source: EN PDF p138; unit 1438 -->

![英文 PDF 原图 138](/docs/rockchip-isp30-tuning/assets/en-p138-X913.png)

<!-- source: EN PDF p138; unit 1439 -->

cfg_gratio 对比图

<!-- source: EN PDF p138; unit 1440 -->

### 6.   4.6 DPCC

<!-- source: EN PDF p138; unit 1441 -->

#### 6.1   4.6.1 功能说明

<!-- source: EN PDF p138; unit 1442 -->

DPCC 包含 ISP DPCC 和 Sensor DPCC。

<!-- source: EN PDF p138; unit 1443 -->

![英文 PDF 原图 138](/docs/rockchip-isp30-tuning/assets/en-p138-X914.png)

<!-- source: EN PDF p138; unit 1444 -->

##### 6.1.1   4.6.1.1 ISP DPCC

<!-- source: EN PDF p138; unit 1445 -->

ISP DPCC 硬件提供 RK、LC、PG、RND、RG、RO 六种坏点判定算法，检测后去除坏点。每种算法有独立开关和阈值调整，均可检测亮点、暗点、动态坏点，但对不同坏点能力不同。RO、PG 对孤立亮点和暗点较有效，RK、RG、RND 对多个坏点较有效。

<!-- source: EN PDF p138; unit 1446 -->

可从六种算法中启用若干，组合为一个判定方案。方案中所有启用算法均判为坏点时，该方案才判定此点为坏点。例如启用 RK、LC、PG、RND 四种算法，须同时满足四者条件。下图为启用全部六种算法的方案。

<!-- source: EN PDF p139; unit 1447 -->

<!-- source: EN PDF p139; unit 1448 -->

![英文 PDF 原图 139](/docs/rockchip-isp30-tuning/assets/en-p139-X921.png)

<!-- source: EN PDF p139; unit 1449 -->

ISP DPCC 最多支持三个可配置方案 Set1~3，以及一个仅能开关、算法组合固定的 fix_set，共四种方案。只要任一启用方案将待测像素判为坏点，DPCC 就判为坏点并执行补偿。

<!-- source: EN PDF p139; unit 1450 -->

![英文 PDF 原图 139](/docs/rockchip-isp30-tuning/assets/en-p139-X923.png)

<!-- source: EN PDF p139; unit 1451 -->

###### 6.1.1.1   4.6.1.1.1 Expert_mode

<!-- source: EN PDF p139; unit 1452 -->

Expert_mode 可直接配置 ISP DPCC 硬件，主要包括 fix_set、set1、set2、set3 四个坏点判定方案。

<!-- source: EN PDF p139; unit 1453 -->

<!-- source: EN PDF p139; unit 1454 -->

###### 6.1.1.2   4.6.1.1.2 Fast_mode

<!-- source: EN PDF p139; unit 1455 -->

Fast_mode 是 RK 基于各硬件算法能力抽象、按坏点类型组织的工作模式，主要包括：

<!-- source: EN PDF p139; unit 1456 -->

Single_level：适用于单个孤立坏点，仅启用 Set1，其包含六种算法。等级提高时，使用算法数量减少、阈值变化，坏点去除能力增强。

<!-- source: EN PDF p140; unit 1457 -->

Double_level：适用于相邻两坏点，如 1x2、2x1 簇。仅启用 Set2；原文称“四种”算法，却列出 RK、LC、PG、RND、RO 五项，保留矛盾待核对。等级提高时阈值变化，去除能力增强。

<!-- source: EN PDF p140; unit 1458 -->

Triple_leve：适用于邻域内三个或更多像素的坏点簇。启用 Set3 和 fix_set，set3 使用 RK、PG、RND、RO 四种算法；等级提高时阈值变化，去除能力增强。

<!-- source: EN PDF p140; unit 1459 -->

三种模式使用的硬件方案不重复，因此可同时开启；但 Triple_level 会增强 Double_level、Single_level，Double_level 会增强 Single_level。

<!-- source: EN PDF p140; unit 1460 -->

![英文 PDF 原图 140](/docs/rockchip-isp30-tuning/assets/en-p140-X929.png)

<!-- source: EN PDF p140; unit 1461 -->

##### 6.1.2   4.6.1.2 传感器 DPCC

<!-- source: EN PDF p140; unit 1462 -->

Sensor DPCC 为传感器自带功能。驱动实现支持时，AIQ 可通过 JSON 参数文件该模块下的参数控制传感器端 DPCC。

<!-- source: EN PDF p140; unit 1463 -->

<!-- source: EN PDF p140; unit 1464 -->

#### 6.2   4.6.2 关键参数

<!-- source: EN PDF p140; unit 1465 -->

##### 6.2.1   4.6.2.1 Enable

<!-- source: EN PDF p140; unit 1466 -->

【说明】

<!-- source: EN PDF p140; unit 1467 -->

DPCC 功能开关。

<!-- source: EN PDF p140; unit 1468 -->

0：关闭。

<!-- source: EN PDF p140; unit 1469 -->

1：开启。

<!-- source: EN PDF p140; unit 1470 -->

【成员】

<!-- source: EN PDF p140; unit 1471 -->

【注意事项】

<!-- source: EN PDF p141; unit 1472 -->

##### 6.2.2   4.6.2.2 Fast_mode

<!-- source: EN PDF p141; unit 1473 -->

【说明】

<!-- source: EN PDF p141; unit 1474 -->

本节调整 Fast_mode 相关参数。

<!-- source: EN PDF p141; unit 1475 -->

【成员】

<!-- source: EN PDF p141; unit 1476 -->

| 成员名称 | 说明 |
| --- | --- |
| Fast_mode_enable | Fast_mode 开关：0 关，1 开。 |
| ISO | 环境 ISO |
| Single_enable | 单坏点去除开关：0 关，1 开。 |
| Single_level | 单坏点去除强度，范围 [0, 10]。 |
| Double_enable | 双坏点去除开关：0 关，1 开。 |
| Double_level | 双坏点去除强度，范围 [0, 10]。 |
| Triple_enable | 多坏点去除开关：0 关，1 开。 |
| Triple_level | 多坏点去除强度，范围 [0, 10]。 |

<!-- source: EN PDF p141; unit 1477 -->

【注意事项】

<!-- source: EN PDF p141; unit 1478 -->

Fast_mode_enable 为 0 时关闭 Fast_mode、开启 Expert_mode；为 1 时开启 Fast_mode、关闭 Expert_mode。

<!-- source: EN PDF p141; unit 1479 -->

双坏点和多坏点指彼此邻近的多个坏点。

<!-- source: EN PDF p141; unit 1480 -->

去除强度：0 不处理，1~10 为不同强度，值越大强度越高。

<!-- source: EN PDF p141; unit 1481 -->

若 Fast_mode 无法达到所需强度，则使用 Expert_mode。

<!-- source: EN PDF p141; unit 1482 -->

##### 6.2.3   4.6.2.3 Expert_mode

<!-- source: EN PDF p141; unit 1483 -->

【说明】

<!-- source: EN PDF p141; unit 1484 -->

本节调整 Expert_mode 相关参数。

<!-- source: EN PDF p141; unit 1485 -->

【成员】

<!-- source: EN PDF p142; unit 1486 -->

| 成员名称 | 说明 |
| --- | --- |
| stage1_Enable | 默认 1。 |
| grayscale_mode | 黑白模式开关：0 关，1 开。 |
| rk_out_sel | RK 算法 ro_lim 选择：0:ro_lim1,1:ro_lim2,2:ro_lim3。 |
| dpcc_out_sel | 坏点校正模式：0 中值，1 RK。 |
| stage1_rb_3x3 | 默认 0。 |
| stage1_g_3x3 | 默认 0。 |
| stage1_inc_rb_center | 红/蓝通道中值去坏点时是否包含待去除点：0 否，1 是，默认 1。 |
| stage1_inc_g_center | 绿色通道中值去坏点时是否包含待去除点：0 否，1 是，默认 1。 |
| set | 场景条件 |

<!-- source: EN PDF p142; unit 1487 -->

【注意事项】

<!-- source: EN PDF p142; unit 1488 -->

grayscale_mode：彩色传感器设为 0，黑白传感器设为 1。

<!-- source: EN PDF p142; unit 1489 -->

###### 6.2.3.1   4.6.2.3.1 SetEnable

<!-- source: EN PDF p142; unit 1490 -->

【说明】

<!-- source: EN PDF p142; unit 1491 -->

Expert_mode 的四个方案开关。

<!-- source: EN PDF p142; unit 1492 -->

【成员】

<!-- source: EN PDF p142; unit 1493 -->

| 成员名称 | 说明 |
| --- | --- |
| ISO | 环境 ISO |
| stage1_use_fix_set | 内置坏点条件开关：0 关，1 开。 |
| stage1_use_set3 | set_cell 第三个坏点条件开关：0 关，1 开。 |
| stage1_use_set2 | set_cell 第二个坏点条件开关：0 关，1 开。 |
| stage1_use_set1 | set_cell 第一个坏点条件开关：0 关，1 开。 |

<!-- source: EN PDF p142; unit 1494 -->

【注意事项】

<!-- source: EN PDF p142; unit 1495 -->

###### 6.2.3.2   4.6.2.3.2 set

<!-- source: EN PDF p142; unit 1496 -->

【说明】

<!-- source: EN PDF p142; unit 1497 -->

调整坏点判定阈值，主要包括 RK、LC、PG、RND、RG、RO 六种条件，彼此为“与”关系。

<!-- source: EN PDF p143; unit 1498 -->

![英文 PDF 原图 143](/docs/rockchip-isp30-tuning/assets/en-p143-X944.png)

<!-- source: EN PDF p143; unit 1499 -->

set_cell 框图

<!-- source: EN PDF p143; unit 1500 -->

【成员】

<!-- source: EN PDF p143; unit 1501 -->

| 成员名称 | 说明 |
| --- | --- |
| RK | RK 坏点判定算法 |
| LC | LC 坏点判定算法 |
| PG | PG 坏点判定算法 |
| RNG | RND 坏点判定算法 |
| RG | RG 坏点判定算法 |
| RO | RO 坏点判定算法 |

<!-- source: EN PDF p143; unit 1502 -->

【注意事项】

<!-- source: EN PDF p143; unit 1503 -->

###### 6.2.3.2.1 4.6.2.3.2.1 RK

<!-- source: EN PDF p143; unit 1504 -->

【说明】

<!-- source: EN PDF p143; unit 1505 -->

调整坏点检测中 RK 算法相关参数。

<!-- source: EN PDF p143; unit 1506 -->

【成员】

<!-- source: EN PDF p143; unit 1507 -->

| 成员名称 | 说明 |
| --- | --- |
| RK_red_blue_enable | RK 红/蓝通道开关：0 关，1 开。 |
| RK_green_enable | RK 绿色通道开关：0 关，1 开。 |
| rb_sw_mindis | RK 红/蓝通道阈值 1，范围 [0,255]。 |
| g_sw_mindis | RK 绿色通道阈值 1，范围 [0,255]。 |
| sw_dis_scale_min | RK 阈值 2，范围 [0,63]。 |
| sw_dis_scale_max | RK 阈值 3，范围 [0,63]。 |

<!-- source: EN PDF p144; unit 1508 -->

【注意事项】

<!-- source: EN PDF p144; unit 1509 -->

###### 6.2.3.2.2 4.6.2.3.2.2 LC

<!-- source: EN PDF p144; unit 1510 -->

【说明】

<!-- source: EN PDF p144; unit 1511 -->

调整坏点检测中 LC 算法参数。

<!-- source: EN PDF p144; unit 1512 -->

【成员】

<!-- source: EN PDF p144; unit 1513 -->

| 成员名称 | 说明 |
| --- | --- |
| LC_red_blue_enable | LC 红/蓝通道开关：0 关，1 开。 |
| LC_green_enable | LC 绿色通道开关：0 关，1 开。 |
| rb_line_thr | LC 红/蓝通道阈值，范围 [0,255]，默认 16。 |
| g_line_thr | LC 绿色通道阈值，范围 [0,255]，默认 12。 |
| rb_line_mad_fac | LC 红/蓝通道系数，范围 [0,63]，默认 34。 |
| g_line_mad_fac | LC 绿色通道系数，范围 [0,63]，默认 16。 |

<!-- source: EN PDF p144; unit 1514 -->

【注意事项】

<!-- source: EN PDF p144; unit 1515 -->

###### 6.2.3.2.3 4.6.2.3.2.3 PG

<!-- source: EN PDF p144; unit 1516 -->

【说明】

<!-- source: EN PDF p144; unit 1517 -->

调整坏点检测中 PG 算法参数。

<!-- source: EN PDF p144; unit 1518 -->

【成员】

<!-- source: EN PDF p144; unit 1519 -->

| 成员名称 | 说明 |
| --- | --- |
| PG_red_blue_enable | PG 红/蓝通道开关：0 关，1 开。 |
| PG_green_enable | PG 绿色通道开关：0 关，1 开。 |
| rb_pg_fac | PG 红/蓝通道系数，范围 [0,63]，默认 4。 |
| g_pg_fac | PG 绿色通道系数，范围 [0,63]，默认 3。 |

<!-- source: EN PDF p144; unit 1520 -->

【注意事项】

<!-- source: EN PDF p144; unit 1521 -->

###### 6.2.3.2.4 4.6.2.3.2.4 RND

<!-- source: EN PDF p144; unit 1522 -->

【说明】

<!-- source: EN PDF p144; unit 1523 -->

调整坏点检测中 RND 算法相关参数。

<!-- source: EN PDF p145; unit 1524 -->

【成员】

<!-- source: EN PDF p145; unit 1525 -->

| 成员名称 | 说明 |
| --- | --- |
| RND_red_blue_enable | RND 红/蓝通道开关：0 关，1 开。 |
| RND_green_enable | RND 绿色通道开关：0 关，1 开。 |
| rb_rnd_thr | RND 红/蓝通道阈值，范围 [0,255]，默认 8。 |
| g_rnd_thr | RND 绿色通道阈值，范围 [0,255]，默认 8。 |
| rb_rnd_offs | RND 红/蓝通道偏移，范围 [0,3]，默认 3。 |
| g_rnd_offs | RND 绿色通道偏移，范围 [0,3]，默认 3。 |

<!-- source: EN PDF p145; unit 1526 -->

【注意事项】

<!-- source: EN PDF p145; unit 1527 -->

###### 6.2.3.2.5 4.6.2.3.2.5 RG

<!-- source: EN PDF p145; unit 1528 -->

【说明】

<!-- source: EN PDF p145; unit 1529 -->

调整坏点检测中 RG 算法参数。

<!-- source: EN PDF p145; unit 1530 -->

【成员】

<!-- source: EN PDF p145; unit 1531 -->

| 成员名称 | 说明 |
| --- | --- |
| RG_red_blue_enable | RG 红/蓝通道开关：0 关，1 开。 |
| RG_green_enable | RG 绿色通道开关：0 关，1 开。 |
| rb_rg_fac | RG 红/蓝通道系数，范围 [0,63]，默认 8。 |
| g_rg_fac | RG 绿色通道系数，范围 [0,63]，默认 8。 |

<!-- source: EN PDF p145; unit 1532 -->

【注意事项】

<!-- source: EN PDF p145; unit 1533 -->

###### 6.2.3.2.6 4.6.2.3.2.6 RO

<!-- source: EN PDF p145; unit 1534 -->

【说明】

<!-- source: EN PDF p145; unit 1535 -->

调整坏点检测中 RO 算法相关参数。

<!-- source: EN PDF p145; unit 1536 -->

【成员】

<!-- source: EN PDF p146; unit 1537 -->

| 成员名称 | 说明 |
| --- | --- |
| RO_red_blue_enable | RO 红/蓝通道开关：0 关，1 开。 |
| RO_green_enable | RO 绿色通道开关：0 关，1 开。 |
| rb_ro_lim | RO 红/蓝通道阈值，范围 [0,3]，默认 1。 |
| g_ro_lim | RO 绿色通道阈值，范围 [0,3]，默认 1。 |

<!-- source: EN PDF p146; unit 1538 -->

【注意事项】

<!-- source: EN PDF p146; unit 1539 -->

##### 6.2.4   4.6.2.5 sensor_dpcc

<!-- source: EN PDF p146; unit 1540 -->

【说明】

<!-- source: EN PDF p146; unit 1541 -->

调整传感器自身的坏点去除强度。

<!-- source: EN PDF p146; unit 1542 -->

【成员】

<!-- source: EN PDF p146; unit 1543 -->

| 成员名称 | 说明 |
| --- | --- |
| sensor_dpcc_auto_en | Sensor DPCC 开关：0 关，1 开。 |
| max_level | 最大坏点去除强度 |
| ISO | 环境 ISO |
| level_single | 单坏点去除强度 |
| level_multiple | 多坏点去除强度 |

<!-- source: EN PDF p146; unit 1544 -->

【注意事项】

<!-- source: EN PDF p146; unit 1545 -->

#### 6.3   4.6.3 调试步骤

<!-- source: EN PDF p146; unit 1546 -->

DPCC 调试包括 Fast_mode、Expert_mode、sensor_dpcc。前两者互斥，由 Fast_mode 中 Fast_mode_enable 决定：为 0 时关闭 Fast_mode、开启 Expert_mode；为 1 时相反。

<!-- source: EN PDF p146; unit 1547 -->

实际调试建议先用 Fast_mode，若达不到所需坏点去除强度，再用 Expert_mode。

<!-- source: EN PDF p147; unit 1548 -->

##### 6.3.1   4.6.3.1 Fast_mode 调试

<!-- source: EN PDF p147; unit 1549 -->

【说明】

<!-- source: EN PDF p147; unit 1550 -->

Single_level 主要去除单坏点，Double_level 去除相邻双坏点，Triple_level 去除原文所称“三个以上”相邻坏点（与前文“三个或更多”边界表述不同，待核对）。

<!-- source: EN PDF p147; unit 1551 -->

原文称三种功能互不影响，但同时说明 Triple_level 增强 Double_level，Double_level 增强 Single_level；保留该相互关系说明。

<!-- source: EN PDF p147; unit 1552 -->

【成员】

<!-- source: EN PDF p147; unit 1553 -->

| 成员名称 | 说明 |
| --- | --- |
| Fast_mode_enable | Fast_mode 开关：0 关，1 开。 |
| Single_level | 单坏点去除强度，范围 [0, 10]。 |
| Double_level | 双坏点去除强度，范围 [0, 10]。 |
| Triple_level | 多坏点去除强度，范围 [0, 10]。 |

<!-- source: EN PDF p147; unit 1554 -->

【注意事项】

<!-- source: EN PDF p147; unit 1555 -->

去除强度：0 不处理，1~10 为不同强度，值越大强度越高。

<!-- source: EN PDF p147; unit 1556 -->

开启某模式时，对应强度不能为 0。例如 Single_enable 开启时 Single_level 不能为 0。

<!-- source: EN PDF p147; unit 1557 -->

##### 6.3.2   4.6.3.2 Expert_mode 调试

<!-- source: EN PDF p147; unit 1558 -->

【说明】

<!-- source: EN PDF p147; unit 1559 -->

Expert_mode 主要通过 stage1_use_fix_set、stage1_use_set1、stage1_use_set2、stage1_use_set3 和 set_cell 去除坏点。

<!-- source: EN PDF p147; unit 1560 -->

四个 stage1_use_* 为互不影响的检测方法；全开启时，只要任一方法判定某点为坏点，就按坏点处理。

<!-- source: EN PDF p147; unit 1561 -->

stage1_use_fix_set 条件固定在硬件中；stage1_use_set1、stage1_use_set2、stage1_use_set3 分别对应 set_cell 中 cell1、cell2、cell3。

<!-- source: EN PDF p147; unit 1562 -->

set_cell 包含 RK、LC、PG、RND、RG、RO 六算法，彼此为“与”关系；若全部开启，待测点须满足六条件才判为坏点。

<!-- source: EN PDF p147; unit 1563 -->

【成员】

<!-- source: EN PDF p148; unit 1564 -->

| 成员名称 | 说明 |
| --- | --- |
| stage1_use_fix_set | 内置坏点条件开关：0 关，1 开。 |
| stage1_use_set1 | set_cell 第一个坏点条件开关：0 关，1 开。 |
| stage1_use_set3 | set_cell 第三个坏点条件开关：0 关，1 开。 |
| set_cell | 坏点判定条件 |

<!-- source: EN PDF p148; unit 1565 -->

【注意事项】

<!-- source: EN PDF p148; unit 1566 -->

六种算法按绿色及红/蓝通道判断坏点，建议两组通道同步开关。

<!-- source: EN PDF p148; unit 1567 -->

六算法可独立开关。由于为“与”关系，开启越多越不容易判为坏点。但噪声存在时，开启过少可能出现“边缘抖动”，即固定边缘出现帧间变化的波浪线。因此实际建议每个 set 至少启用三种算法。

<!-- source: EN PDF p148; unit 1568 -->

###### 6.3.2.1   4.6.3.2.1 RK

<!-- source: EN PDF p148; unit 1569 -->

【说明】

<!-- source: EN PDF p148; unit 1570 -->

调整坏点检测中 RK 算法相关参数。

<!-- source: EN PDF p148; unit 1571 -->

【成员】

<!-- source: EN PDF p148; unit 1572 -->

| 成员名称 | 说明 |
| --- | --- |
| enable | RK开关：0 关，1 开。 |
| ro_lim | RK 偏移，范围 [0,3]。 |
| sw_mindis | RK 阈值 1，范围 [0,255]。 |
| sw_dis_scale_min | RK 阈值 2，范围 [0,63]。 |
| sw_dis_scale_max | RK 阈值 3，范围 [0,63]。 |

<!-- source: EN PDF p148; unit 1573 -->

【注意事项】

<!-- source: EN PDF p148; unit 1574 -->

ro_lim：越大越容易判为坏点。

<!-- source: EN PDF p148; unit 1575 -->

sw_mindis：越小越容易判为坏点。

<!-- source: EN PDF p148; unit 1576 -->

sw_dis_scale_max：越小越容易判为坏点。

<!-- source: EN PDF p148; unit 1577 -->

sw_dis_scale_max：越小越容易判为坏点（原文重复列出）。

<!-- source: EN PDF p149; unit 1578 -->

###### 6.3.2.2   4.6.3.2.2 LC

<!-- source: EN PDF p149; unit 1579 -->

【说明】

<!-- source: EN PDF p149; unit 1580 -->

调整坏点检测中 LC 算法参数。

<!-- source: EN PDF p149; unit 1581 -->

【成员】

<!-- source: EN PDF p149; unit 1582 -->

| 成员名称 | 说明 |
| --- | --- |
| enable | LC开关：0 关，1 开。 |
| line_thr | LC 通道阈值，范围 [0,255]，默认 12。 |
| line_mad_fac | LC 通道系数，范围 [0,63]，默认 16。 |

<!-- source: EN PDF p149; unit 1583 -->

【注意事项】

<!-- source: EN PDF p149; unit 1584 -->

line_thr：越小越容易判为坏点。

<!-- source: EN PDF p149; unit 1585 -->

line_mad_fac：越小越容易判为坏点。

<!-- source: EN PDF p149; unit 1586 -->

###### 6.3.2.3   4.6.3.2.3 PG

<!-- source: EN PDF p149; unit 1587 -->

【说明】

<!-- source: EN PDF p149; unit 1588 -->

调整坏点检测中 PG 算法参数。

<!-- source: EN PDF p149; unit 1589 -->

【成员】

<!-- source: EN PDF p149; unit 1590 -->

| 成员名称 | 说明 |
| --- | --- |
| enable | PG开关：0 关，1 开。 |
| pg_fac | PG 通道系数，范围 [0,63]，默认 3。 |

<!-- source: EN PDF p149; unit 1591 -->

【注意事项】

<!-- source: EN PDF p149; unit 1592 -->

pg_fac：越小越容易判为坏点。

<!-- source: EN PDF p149; unit 1593 -->

###### 6.3.2.4   4.6.3.2.4 RND

<!-- source: EN PDF p149; unit 1594 -->

【说明】

<!-- source: EN PDF p149; unit 1595 -->

调整坏点检测中 RND 算法相关参数。

<!-- source: EN PDF p149; unit 1596 -->

【成员】

<!-- source: EN PDF p150; unit 1597 -->

| 成员名称 | 说明 |
| --- | --- |
| enable | RND开关：0 关，1 开。 |
| rnd_thr | RND 通道阈值，范围 [0,255]，默认 8。 |
| rnd_offs | RND 通道偏移，范围 [0,3]，默认 3。 |

<!-- source: EN PDF p150; unit 1598 -->

【注意事项】

<!-- source: EN PDF p150; unit 1599 -->

rnd_thr：越小越容易判为坏点。

<!-- source: EN PDF p150; unit 1600 -->

rnd_offs：越小越容易判为坏点。

<!-- source: EN PDF p150; unit 1601 -->

###### 6.3.2.5   4.6.3.2.5 RG

<!-- source: EN PDF p150; unit 1602 -->

【说明】

<!-- source: EN PDF p150; unit 1603 -->

调整坏点检测中 RG 算法参数。

<!-- source: EN PDF p150; unit 1604 -->

【成员】

<!-- source: EN PDF p150; unit 1605 -->

| 成员名称 | 说明 |
| --- | --- |
| enable | RG开关：0 关，1 开。 |
| rg_fac | RG 通道系数，范围 [0,63]，默认 8。 |

<!-- source: EN PDF p150; unit 1606 -->

【注意事项】

<!-- source: EN PDF p150; unit 1607 -->

rg_fac：越小越容易判为坏点。

<!-- source: EN PDF p150; unit 1608 -->

###### 6.3.2.6   4.6.3.2.6 RO

<!-- source: EN PDF p150; unit 1609 -->

【说明】

<!-- source: EN PDF p150; unit 1610 -->

调整坏点检测中 RO 算法相关参数。

<!-- source: EN PDF p150; unit 1611 -->

【成员】

<!-- source: EN PDF p150; unit 1612 -->

| 成员名称 | 说明 |
| --- | --- |
| enable | RO 通道开关：0 关，1 开。 |
| ro_lim | RO 通道阈值，范围 [0,3]，默认 1。 |

<!-- source: EN PDF p150; unit 1613 -->

【注意事项】

<!-- source: EN PDF p151; unit 1614 -->

ro_lim：越大越容易判为坏点。

<!-- source: EN PDF p151; unit 1615 -->

##### 6.3.3   4.6.3.3 sensor_dpcc 调试

<!-- source: EN PDF p151; unit 1616 -->

【说明】

<!-- source: EN PDF p151; unit 1617 -->

sensor_dpcc 通过 max_level、level_single、level_multiple 控制传感器端坏点去除。须传感器自身支持该功能且驱动配置完成后才能使用。

<!-- source: EN PDF p151; unit 1618 -->

【成员】

<!-- source: EN PDF p151; unit 1619 -->

| 成员名称 | 说明 |
| --- | --- |
| max_level | 最大坏点去除强度 |
| level_single | 单坏点去除强度 |
| level_multiple | 多坏点去除强度 |

<!-- source: EN PDF p151; unit 1620 -->

【注意事项】

<!-- source: EN PDF p151; unit 1621 -->

max_level：定义传感器端最大坏点去除强度，主要用于细分单个等级的强度。

<!-- source: EN PDF p151; unit 1622 -->

level_single 和 level_multiple 不能超过 max_level。

<!-- source: EN PDF p151; unit 1623 -->

### 7.   4.7 Gamma

<!-- source: EN PDF p151; unit 1624 -->

#### 7.1   4.7.1 功能说明

<!-- source: EN PDF p151; unit 1625 -->

本模块调整三条 Gamma 曲线：curve_normal、curve_hdr、curve_night。

<!-- source: EN PDF p151; unit 1626 -->

<!-- source: EN PDF p151; unit 1627 -->

![英文 PDF 原图 151](/docs/rockchip-isp30-tuning/assets/en-p151-X977.png)

<!-- source: EN PDF p151; unit 1628 -->

GAMMA 框图

<!-- source: EN PDF p152; unit 1629 -->

#### 7.2   4.7.2 关键参数

<!-- source: EN PDF p152; unit 1630 -->

##### 7.2.1   4.7.2.1 Gamma_en

<!-- source: EN PDF p152; unit 1631 -->

【说明】

<!-- source: EN PDF p152; unit 1632 -->

Gamma 功能开关。

<!-- source: EN PDF p152; unit 1633 -->

0：关闭。

<!-- source: EN PDF p152; unit 1634 -->

1：开启。

<!-- source: EN PDF p152; unit 1635 -->

【成员】

<!-- source: EN PDF p152; unit 1636 -->

【注意事项】

<!-- source: EN PDF p152; unit 1637 -->

##### 7.2.2   4.7.2.2 Gamma_out_offset

<!-- source: EN PDF p152; unit 1638 -->

【说明】

<!-- source: EN PDF p152; unit 1639 -->

Gamma 曲线修正，范围 [-2048, 2048]，默认 0。

<!-- source: EN PDF p152; unit 1640 -->

【成员】

<!-- source: EN PDF p152; unit 1641 -->

【注意事项】

<!-- source: EN PDF p152; unit 1642 -->

最终曲线为 Gamma_curve-Gamma_out_offset。

<!-- source: EN PDF p152; unit 1643 -->

##### 7.2.3   4.7.2.3 Gamma_curve

<!-- source: EN PDF p152; unit 1644 -->

【说明】

<!-- source: EN PDF p152; unit 1645 -->

49 点 Gamma 曲线 Y 轴值，范围 [0,4095]。

<!-- source: EN PDF p152; unit 1646 -->

【成员】

<!-- source: EN PDF p152; unit 1647 -->

【注意事项】

<!-- source: EN PDF p152; unit 1648 -->

Gamma 曲线 X 轴固定为以下 49 点：

<!-- source: EN PDF p152; unit 1649 -->

```c
  int X_isp30[49] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32,
  40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640,
  768, 896, 1024, 1280, 1536, 1792, 2048, 2304, 2560, 2816, 3072, 3328, 3584, 3840,
  4095};
```

<!-- source: EN PDF p152; unit 1650 -->

#### 7.3   4.7.3 调试步骤

<!-- source: EN PDF p153; unit 1651 -->

### 8.   4.8 Debayer

<!-- source: EN PDF p153; unit 1652 -->

#### 8.1   4.8.1 功能说明

<!-- source: EN PDF p153; unit 1653 -->

多数彩色摄像头使用单个传感器获取图像，表面覆盖 CFA（彩色滤光阵列），每个像素只能取得 R、G、B 三原色之一。为获得彩色图像，需利用已知颜色信息插值补齐另外两个分量，称为去马赛克（Debayer 或 Demosaic）。模块支持 RGGB、BGGR、GRBG、gbrg 四种排列，不支持 RGBIR。

<!-- source: EN PDF p153; unit 1654 -->

![英文 PDF 原图 153](/docs/rockchip-isp30-tuning/assets/en-p153-X991.png)

<!-- source: EN PDF p153; unit 1655 -->

图 4-10-1 Debayer 功能示意图

<!-- source: EN PDF p153; unit 1656 -->

#### 8.2   4.8.2 关键参数

<!-- source: EN PDF p153; unit 1657 -->

##### 8.2.1   Enable

<!-- source: EN PDF p153; unit 1658 -->

【说明】

<!-- source: EN PDF p153; unit 1659 -->

Debayer 使能位：0 关闭，1 开启。

<!-- source: EN PDF p153; unit 1660 -->

##### 8.2.2   debayer_filter1

<!-- source: EN PDF p153; unit 1661 -->

【说明】

<!-- source: EN PDF p153; unit 1662 -->

低频梯度滤波器，范围 [-8,7]。

<!-- source: EN PDF p154; unit 1663 -->

##### 8.2.3   debayer_filter2

<!-- source: EN PDF p154; unit 1664 -->

【说明】

<!-- source: EN PDF p154; unit 1665 -->

高频梯度滤波器，范围 [-8,7]。

<!-- source: EN PDF p154; unit 1666 -->

##### 8.2.4   debayer_gain_offset

<!-- source: EN PDF p154; unit 1667 -->

【说明】

<!-- source: EN PDF p154; unit 1668 -->

计算 G 通道插值系数中的锐化权重时，梯度的偏移值，范围 [0,15]。

<!-- source: EN PDF p154; unit 1669 -->

##### 8.2.5   ISO

<!-- source: EN PDF p154; unit 1670 -->

【说明】

<!-- source: EN PDF p154; unit 1671 -->

当前档位 ISO 值，范围 [50,2048]。

<!-- source: EN PDF p154; unit 1672 -->

##### 8.2.6   sharp_strength

<!-- source: EN PDF p154; unit 1673 -->

【说明】

<!-- source: EN PDF p154; unit 1674 -->

G 通道插值锐化权重最大值，范围 [0,4]。

<!-- source: EN PDF p154; unit 1675 -->

##### 8.2.7   debayer_hf_offset

<!-- source: EN PDF p154; unit 1676 -->

【说明】

<!-- source: EN PDF p154; unit 1677 -->

计算梯度时的偏移，范围 [0,4095]。

<!-- source: EN PDF p154; unit 1678 -->

##### 8.2.8   debayer_offset

<!-- source: EN PDF p154; unit 1679 -->

【说明】

<!-- source: EN PDF p154; unit 1680 -->

G 通道限幅偏移，范围 [0,15]；值越大，限幅范围越大。

<!-- source: EN PDF p154; unit 1681 -->

##### 8.2.9   debayer_clip_en

<!-- source: EN PDF p154; unit 1682 -->

【说明】

<!-- source: EN PDF p154; unit 1683 -->

G 通道插值限幅开关：0 关闭，1 开启。

<!-- source: EN PDF p155; unit 1684 -->

##### 8.2.10   debayer_filter_g_en

<!-- source: EN PDF p155; unit 1685 -->

【说明】

<!-- source: EN PDF p155; unit 1686 -->

G 通道插值结果滤波开关：0 关闭，1 开启。

<!-- source: EN PDF p155; unit 1687 -->

##### 8.2.11   debayer_filter_c_en

<!-- source: EN PDF p155; unit 1688 -->

【说明】

<!-- source: EN PDF p155; unit 1689 -->

色差滤波开关：0 关闭，1 开启。

<!-- source: EN PDF p155; unit 1690 -->

##### 8.2.12   debayer_thed0

<!-- source: EN PDF p155; unit 1691 -->

【说明】

<!-- source: EN PDF p155; unit 1692 -->

值越大，选择高频权重的概率越小，范围 [0,16]。

<!-- source: EN PDF p155; unit 1693 -->

##### 8.2.13   debayer_thed1

<!-- source: EN PDF p155; unit 1694 -->

【说明】

<!-- source: EN PDF p155; unit 1695 -->

值越大，选择低频权重的概率越小，范围 [0,16]。

<!-- source: EN PDF p155; unit 1696 -->

##### 8.2.14   debayer_dist_scale

<!-- source: EN PDF p155; unit 1697 -->

【说明】

<!-- source: EN PDF p155; unit 1698 -->

值越大，选择高频权重的概率越小，范围 [0,16]。原文句末额外附有 debayer_hf_offset，保留待核对。

<!-- source: EN PDF p155; unit 1699 -->

##### 8.2.15   debayer_cnr_strength

<!-- source: EN PDF p155; unit 1700 -->

【说明】

<!-- source: EN PDF p155; unit 1701 -->

色差滤波时的限幅强度，范围 [0,9]。

<!-- source: EN PDF p155; unit 1702 -->

##### 8.2.16   debayer_shift_num

<!-- source: EN PDF p155; unit 1703 -->

【说明】

<!-- source: EN PDF p155; unit 1704 -->

值越小，色差限幅范围越大，取值 [0,4]。

<!-- source: EN PDF p156; unit 1705 -->

#### 8.3   4.8.3 术语说明

<!-- source: EN PDF p156; unit 1706 -->

| 缩写 | 说明 |
| --- | --- |
| CFA | 彩色滤光阵列 |
| 去马赛克 | Debayer 或 Demosaic，将每像素单色的 Bayer RGB 转为三色 RGB 的过程。 |
| 滤波器 | 用于去除数字图像不需要信号的一组滤波参数。 |
| 色差图 | 原文称“插值后的 G 通道图像劣于原始 RAW 图像”，定义含糊，保留待核对。 |

<!-- source: EN PDF p156; unit 1707 -->

### 9.   4.10 GIC

<!-- source: EN PDF p156; unit 1708 -->

#### 9.1   4.10.1 功能说明

<!-- source: EN PDF p156; unit 1709 -->

本模块调整 GIC 参数。GIC_ISO 中主要分为 GIC 相关参数与噪声相关参数；噪声参数通过校准获得，GIC 参数用于调整强度。

<!-- source: EN PDF p156; unit 1710 -->

#### 9.2   4.10.2 关键参数

<!-- source: EN PDF p156; unit 1711 -->

##### 9.2.1   4.10.2.1 enable

<!-- source: EN PDF p156; unit 1712 -->

【说明】

<!-- source: EN PDF p156; unit 1713 -->

GIC 功能开关。

<!-- source: EN PDF p156; unit 1714 -->

0：关闭。

<!-- source: EN PDF p156; unit 1715 -->

1：开启。

<!-- source: EN PDF p156; unit 1716 -->

【成员】

<!-- source: EN PDF p156; unit 1717 -->

【注意事项】

<!-- source: EN PDF p156; unit 1718 -->

##### 9.2.2   4.10.2.3 gr_ration

<!-- source: EN PDF p156; unit 1719 -->

【说明】

<!-- source: EN PDF p156; unit 1720 -->

确定 gr、GB 补偿值的参数，范围 [0,3]，默认 0。

<!-- source: EN PDF p156; unit 1721 -->

【成员】

<!-- source: EN PDF p156; unit 1722 -->

【注意事项】

<!-- source: EN PDF p157; unit 1723 -->

##### 9.2.3   4.10.2.5 SettingV21

<!-- source: EN PDF p157; unit 1724 -->

【说明】

<!-- source: EN PDF p157; unit 1725 -->

根据 ISO 对相关参数插值。

<!-- source: EN PDF p157; unit 1726 -->

【成员】

<!-- source: EN PDF p158; unit 1727 -->

| 成员名称 | 说明 |
| --- | --- |
| iso | 环境 ISO |
| min_busy_thre | 复杂区域检测能力，范围 [0, 1023]，默认 160。 |
| min_grad_thr1 | 非边缘区域数量阈值 1，控制 GIC 强度，范围 [0, 1023]，默认 32。 |
| min_grad_thr2 | 非边缘区域数量阈值 2，控制 GIC 强度，范围 [0, 1023]，默认 32。 |
| k_grad1 | 边缘横竖梯度响应阈值 1，范围 [0, 15]，默认 5。 |
| k_grad2 | 边缘横竖梯度响应阈值 2，范围 [0, 15]，默认 1。 |
| gb_thre | 缩放比例系数，范围 [0, 15]，默认 7。 |
| maxCorV | 限制边缘区 GB 最大补偿，范围 [0, 1023]，默认 40。 |
| maxCorVboth | 限制平坦非边缘区 GB 最大补偿，范围 [0, 1023]，默认 8。 |
| dark_thre | 暗区阈值 1，范围 [0, 2047]，默认 120。 |
| dark_threHi | 暗区阈值 2，范围 [0, 2047]，默认 240。 |
| k_grad1_dark | 暗部边缘横竖梯度阈值 1，范围 [0, 15]，默认 6。 |
| k_grad2_dark | 暗部边缘横竖梯度响应阈值 2，范围 [0, 15]，默认 1。 |
| min_grad_thr_dark1 | 暗部非边缘区数量阈值 1，范围 [0, 1023]，默认 64。 |
| min_grad_thr_dark2 | 暗部非边缘区数量阈值 2，范围 [0, 1023]，默认 32。 |
| noiseCurve_0 | 噪声曲线参数 1 |
| noiseCurve_1 | 噪声曲线参数 2 |
| globalStrength | 全局控制 GB 补偿强度，范围 [0, 2]，默认 1。 |
| NoiseScale | 由噪声曲线获取当前点噪声标准差，以 noise_std *noise_scale 确定最大 GB 补偿。 |

<!-- source: EN PDF p159; unit 1728 -->

| 成员名称 | 说明 |
| --- | --- |
| NoiseBase | 图像边缘调整阈值；以第一、第二梯度加 noise_offset 计算，仅一个方向满足 gradx &gt; 2*grady 时视为边缘，不调整（原文语序异常，条件保留）。 |
| diff_clip | 限制 GB 最大补偿值。 |

<!-- source: EN PDF p159; unit 1729 -->

【注意事项】

<!-- source: EN PDF p159; unit 1730 -->

#### 9.3   4.10.3 调试步骤

<!-- source: EN PDF p159; unit 1731 -->

调试时主要调整 GIC_ISO 中 GIC 相关参数。

<!-- source: EN PDF p159; unit 1732 -->

##### 9.3.1   4.10.3.1 GIC_ISO 调试

<!-- source: EN PDF p159; unit 1733 -->

| 成员名称 | 说明 |
| --- | --- |
| min_busy_thre | 复杂区域检测能力，范围 [16, 120]，默认 64（与前表不同，按原文保留）。 |
| min_grad_thr1 | 非边缘区域数量阈值 1，控制 GIC 强度。 |
| min_grad_thr2 | 非边缘区域数量阈值 2，控制 GIC 强度。 |
| k_grad1 | 边缘横竖梯度响应阈值 1。 |
| k_grad2 | 边缘横竖梯度响应阈值 2。 |
| gb_thre | 缩放比例系数 |
| maxCorV | 限制边缘区 GB 最大补偿。 |
| maxCorVboth | 限制平坦非边缘区 GB 最大补偿。 |
| dark_thre | 暗区阈值 1。 |
| dark_threHi | 暗区阈值 2。 |
| k_grad1_dark | 暗部边缘横竖梯度响应阈值 1。 |
| k_grad2_dark | 暗部边缘横竖梯度响应阈值 2。 |
| min_grad_thr_dark1 | 暗部非边缘区域数量阈值 1。 |
| min_grad_thr_dark2 | 暗部非边缘区域数量阈值 2。 |

<!-- source: EN PDF p159; unit 1734 -->

min_busy_thre：主要修正暗区复杂区域（如文字等不规则、高对比区域）的检测能力，即给暗区设置阈值。值越大，检测到的 BUSY 区域越多，反之越少。GIC 不处理 BUS 区域，因此更多 BUSY 区域可保留部分边缘细节，但误检区域也会残留 GIC 问题（BUS/BUSY 按原文保留）。

<!-- source: EN PDF p160; unit 1735 -->

min_grad_thr1、min_grad_thr2：直接影响非边缘区域数量。非边缘区域越多，GIC 越强、涂抹越重、保留细节越少；越少则可能残留典型 GIC 纹理，如横竖明暗条纹和伪边缘。值越大，方向判断时越容易判为平坦非边缘区，因此是控制 GIC 强度的参数。

<!-- source: EN PDF p160; unit 1736 -->

min_grad_thr_dark1、min_grad_thr_dark2：作用及调试方法与 min_grad_thr1、min_grad_thr2 相同，通常取值比 min_grad_thr 更大。

<!-- source: EN PDF p160; unit 1737 -->

k_grad1、k_grad2：调整对边缘（横、竖梯度）的响应。越大，判定边缘阈值越高，弱边缘会被判为平坦区；降低则可增加检测到的边缘。

<!-- source: EN PDF p160; unit 1738 -->

k_grad1_dark、k_grad2_dark：作用及调试方法与 k_grad1、k_grad2 相同，通常大于 k_grad，以降低暗部边缘响应。

<!-- source: EN PDF p160; unit 1739 -->

gb_thre：缩放比例系数，并非直接判定的绝对阈值。越大，允许补偿的 GB 越小，反之亦然；与传感器及镜头密切相关。

<!-- source: EN PDF p160; unit 1740 -->

maxCorV：假定 gb 补偿有上限，计算值超过阈值时视为计算误差，为减轻影响而向下限制 gb 补偿值。

<!-- source: EN PDF p160; unit 1741 -->

maxCorVboth：用途与 maxCorV 相同。

<!-- source: EN PDF p160; unit 1742 -->

dark_thre：确定图像暗区与正常区域之间的下边界。

<!-- source: EN PDF p160; unit 1743 -->

dark_threHi：确定图像暗区与正常区域之间的上边界。

{% endraw %}
