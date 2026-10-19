---
title: "Rockchip ISP30 色彩优化完整指南：AWB、CCM 与 3DLUT"
description: "完整整理 ISP30 色彩优化 V3.0.2：白点检测与 AWB 策略、标定和日志定位、CCM 矩阵与色差调整、3DLUT 工具与示例。"
translation_key: "076-rockchip-isp30-color-optimization"
slug: "076-rockchip-isp30-color-optimization"
lang: "zh"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "AWB", "CCM", "3DLUT"]
keywords: "ArmSoM Rockchip ISP30 AWB CCM 3DLUT"
excerpt: "完整整理 ISP30 色彩优化 V3.0.2：白点检测与 AWB 策略、标定和日志定位、CCM 矩阵与色差调整、3DLUT 工具与示例。"
---

{% raw %}

# Rockchip ISP30 色彩优化完整指南：AWB、CCM 与 3DLUT

本文完整整理 84 页英文 V3.0.2 原稿的技术正文（PDF p.9–84）。未提供中文原稿，中俄文均为英文技术正文的完整翻译，三语使用同一份英文 PDF 独立原图（含原图既有中文界面）；另补录文字抽取遗漏的 p.64 矢量公式，公式、表格和代码可复制。截图中本来被裁去的日志前缀、末行或原稿未渲染的图片引用不猜补。

仅作 ArmSoM 平台参考，未经硬件实测。必须核对实际板卡、SoC、ISP、Sensor、SDK/BSP、AIQ、IQ Tool 和内核。原稿 p.2 产品表为 RK3566/RK3568、内核栏为空；p.9 正文称 ISP30/RK3588，p.77 又提 RK1109，范围矛盾如实记录。本文不据此声明所有 ArmSoM 板卡支持，也不将原厂示例效果当作 ArmSoM 测试结果。未执行代码、修改相机配置或刷新 IQ 参数。

保留的技术版本信息：V2.0.0 从 IQ XML 转为 JSON，支持 AIQ V2.0x60.0、IQ Tool V2.0.2；V2.0.1 适配 ISP21/RK356X；V3.0.0 适配 ISP30/RK3588；V3.0.1 移除 CCM/3DLUT 的手动 JSON 配置，在线仅自动模式；V3.0.2 AWB 仿真工具对应 IQ Tool V2.1.0。正文中的 XML 示例、暂不支持提示及不同 ISP 引用仍按原稿保留。

| SoC | 内核（原稿 p.2） |
|---|---|
| RK3566 / RK3568 | 原栏为空，未指定 |

[EDITORIAL-NOTES](/docs/rockchip-isp30-color-optimization/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.9, block 0 -->

## 1 概述

<!-- Source EN PDF p.9, block 1 -->

ISP30 的色彩调整模块包括自动白平衡 AWB、色彩校正 CC 和三维查找表 3dlut。

<!-- Source EN PDF p.9, block 2 -->

ISP21（RK3566/RK3568）与 ISP20（RV1126/RV1109）的 CCM 和 3DLUT 模块没有区别；AWB 调试需注意以下差异：

<!-- Source EN PDF p.9, block 3 -->

(1) ISP21 不支持 Multiwindow 多子窗口配置。

<!-- Source EN PDF p.9, block 4 -->

(2) 3dyuv 算法升级。

<!-- Source EN PDF p.9, block 5 -->

(3) 附加框仅支持扣除白点，不能作为额外点光源。

<!-- Source EN PDF p.9, block 6 -->

(4) 增加不同亮度白点使用不同权重的功能。

<!-- Source EN PDF p.9, block 7 -->

(5) 增加分块权重功能。

<!-- Source EN PDF p.9, block 8 -->

(6) XY 域每个光源配置两种大小的框，比 ISP20 少一种。

<!-- Source EN PDF p.9, block 9 -->

ISP30（RK3588）与 ISP21（RK3566/RK3568）的 CCM 和 3DLUT 模块没有区别，但 3DLUT 新增工具（见对应模块说明）。AWB 调试差异如下：

<!-- Source EN PDF p.9, block 10 -->

(1) 附加框既支持扣除白点，也可作为额外点光源。

<!-- Source EN PDF p.9, block 11 -->

(2) 工具升级了 YUV 阈值调试功能（见示例 2）。

<!-- Source EN PDF p.9, block 12 -->

## 2 AWB

<!-- Source EN PDF p.9, block 13 -->

### 2.1 功能说明

<!-- Source EN PDF p.9, block 14 -->

自动白平衡算法计算 R/G/B 通道的 WB gain，并乘到 RGB 通道，将环境光影响下的白色还原为纯白，使不同光照下相机成像颜色与物体真实颜色一致。场景有白点时，根据自动检测的白点计算 WB gain；无白点时，采用单色算法获得 WB gain。色适应模块调整白平衡校正目标，使校正后图像尽可能符合人眼感知。色调调整模块可按偏好调整整体色调。AWB 由硬件统计与软件策略构成，流程如下图。

<!-- Source EN PDF p.10, block 15 -->

![英文原稿图, PDF p.10, #15](/docs/rockchip-isp30-color-optimization/assets/en-p10-figure1.png)

*英文原稿图, PDF p.10, #15.*

<!-- Source EN PDF p.10, block 16 -->

图：AWB 流程。

<!-- Source EN PDF p.10, block 17 -->

### 2.2 关键参数

<!-- Source EN PDF p.10, block 18 -->

ISP21 参数位于 IQ JSON 的 wb_v21 节点（原文此处仍写 ISP21）。

<!-- Source EN PDF p.10, block 19 -->

#### 2.2.1 白平衡校正使能与模式选择

<!-- Source EN PDF p.10, block 20 -->

位于 control 节点。

<!-- Source EN PDF p.11, block 21 -->

| 名称 | 说明 |
|---|---|
| bypass | 取值 0 或 1。0：进行白平衡校正，所用增益由 mode 控制；1：不进行白平衡校正。 |
| mode | 取值 CALIB_WB_MODE_AUTO 或 CALIB_WB_MODE_MANUAL。CALIB_WB_MODE_MANUAL 使用手动白平衡增益；CALIB_WB_MODE_AUTO 使用自动白平衡算法计算增益。 |

<!-- Source EN PDF p.11, block 22 -->

#### 2.2.2 手动白平衡参数

<!-- Source EN PDF p.11, block 23 -->

位于 manualPara 节点。

<!-- Source EN PDF p.11, block 24 -->

| 名称 | 说明 |
|---|---|
| mode | 取值 CALIB_MWB_MODE_CCT、CALIB_MWB_MODE_WBGAIN 或 CALIB_MWB_MODE_SCENE。 |
| cfg.wbgain | 范围 [0.5-3.9]。mode == CALIB_MWB_MODE_WBGAIN 时，该参数应用于手动白平衡。 |
| cfg.scene | 可取 CALIB_WB_SCENE_INCANDESCENT（A 光源）、CALIB_WB_SCENE_FLUORESCENT（CWF）、CALIB_WB_SCENE_WARM_FLUORESCENT（U30）、CALIB_WB_SCENE_DAYLIGHT（D65）、CALIB_WB_SCENE_CLOUDY_DAYLIGHT（D50）、CALIB_WB_SCENE_TWILIGHT（HZ）或 CALIB_WB_SCENE_SHADE（D75）。Mode == CALIB_MWB_MODE_SCENE 时应用于手动白平衡。 |
| cfg.cct | CCT 范围 [0-10000]；CCRI 范围 [-2,2]。CCRI 为 0 时近似为色度图普朗克轨迹上的光源。Mode == CALIB_MWB_MODE_CCT 时应用于手动白平衡。 |

<!-- Source EN PDF p.11, block 25 -->

几种配置如下：

<!-- Source EN PDF p.12, block 26 -->

```text
Auto White Balance + White Balance Correction Enabled (recommended)
control.bypass = 0;
control.mode = CALIB_WB_MODE_AUTO;
White balance correction is not enabled
control.wbBypass = 1;
Manual white balance + white balance correction enabled
control.wbBypass = 0;
control.mode = CALIB_WB_MODE_MANUAL;
manualPara.mode = CALIB_MWB_MODE_WBGAIN;
manualPara.cfg.wbgain = [1,1,1,1];
```

<!-- Source EN PDF p.12, block 27 -->

#### 2.2.3 自动白平衡参数

<!-- Source EN PDF p.12, block 28 -->

以下参数均用于自动白平衡模式，位于 autoPara（ISP20/ISP21 成员不同）和 autoExtPara（ISP20/ISP21 成员相同）节点，后文参数均为这两个结构的成员。

<!-- Source EN PDF p.12, block 29 -->

#### 2.2.4 hdrPara

<!-- Source EN PDF p.12, block 30 -->

对应 autoPara.hdrPara。HDR Sensor 可指定长、中、短帧之一用于白平衡统计，建议自动模式。

<!-- Source EN PDF p.12, block 31 -->

| 名称 | 说明 |
|---|---|
| frameChooseMode | 取值 CALIB_AWB_INPUT_RAW_FIXED、CALIB_AWB_INPUT_RAW_AUTO、CALIB_AWB_INPUT_BAYERNR 或 CALIB_AWB_INPUT_DRC。RAW_FIXED 固定选择长/短帧 raw，由 frameChoose 指定；RAW_AUTO 自动选择长/短帧进行统计；BAYERNR 选择 bayer2dnr 模块输出；DRC 选择 DRC 输出。 |
| frameChoose | HDR 模式且 frameChooseMode 为 CALIB_AWB_INPUT_RAW_FIXED 时有效。两帧 HDR 取值 0 或 1：0 选择短帧 raw_in_short；1 选择长帧 raw_in_long- 进行白平衡统计（末尾连字符为原文）。 |

<!-- Source EN PDF p.12, block 32 -->

#### 2.2.5 limitRange

<!-- Source EN PDF p.12, block 33 -->

(1) 对应 JSON 的 autoPara.limitRange，规定白点统计的输入像素范围，超出者不计入。扩大范围可增加白点数量；若要提高准确性，应使参与统计的点不过暗也不过亮。可针对不同环境亮度配置范围，实际范围由这些配置线性插值得到。

<!-- Source EN PDF p.13, block 34 -->

| 名称 | 说明 |
|---|---|
| lumaValue | 环境亮度范围 0-255000。 |
| maxR | R 通道取值右边界，建议 255-black level-3，最大 255。 |
| minR | R 通道取值左边界，建议 3，最小 0。 |
| maxG | G 通道取值右边界，建议 255-black level-3，最大 255。 |
| minG | G 通道取值左边界，建议 3，最小 0。 |
| maxB | B 通道取值右边界，建议 255-black level-3，最大 255。 |
| minB | B 通道取值左边界，建议 3，最小 0。 |
| maxY | Y 通道取值右边界，建议 255-black level-3，最大 255。 |
| minY | Y 通道取值左边界，建议 3，最小 0。 |

<!-- Source EN PDF p.13, block 35 -->

#### 2.2.6 mainWindow

<!-- Source EN PDF p.13, block 36 -->

AWB 主统计窗口对应 JSON 的 autoPara.mainWindow，建议自动配置。特殊应用（如广角镜头周边色彩阴影严重）可自定义窗口尺寸，减少其对 AWB 统计的影响。

<!-- Source EN PDF p.13, block 37 -->

| 名称 | 说明 |
|---|---|
| mode | 取值 CALIB_AWB_WINDOW_CFG_FIXED 或 CALIB_AWB_WINDOW_CFG_AUTO。AUTO 自动将主统计窗口配置为 RAW 尺寸，为建议值；FIXED 自定义统计窗口尺寸。 |
| window | mode 为 1 时启用。window=[h_offset,v_offset,h_size,v_size]，h、v 分别为水平、垂直方向，各分量范围 0-1。[0, 0, 1, 1] 表示使用完整窗口，即 RAW 尺寸。 |

<!-- Source EN PDF p.14, block 38 -->

#### 2.2.7 downScaleMode

<!-- Source EN PDF p.14, block 39 -->

对应 JSON 的 autoPara.downScaleMode。

<!-- Source EN PDF p.14, block 40 -->

| 名称 | 说明 |
|---|---|
| downScaleMode | 取值 CALIB_AWB_DS_4X4 或 CALIB_AWB_DS_8X8。前者对 raw 做 4×4 下采样后输入 AWB 统计模块，ds_w、ds_h 均为 4；后者做 8×8 下采样，ds_w、ds_h 均为 8，为默认值。 |

<!-- Source EN PDF p.14, block 41 -->

#### 2.2.8 lscBypassEnable

<!-- Source EN PDF p.14, block 42 -->

对应 JSON 的 autoPara.lscBypassEnable。

<!-- Source EN PDF p.14, block 43 -->

| 名称 | 说明 |
|---|---|
| lscBypassEnable | 取值 0 或 1。0：不启用白平衡统计通路 LSC；1：启用该通路 LSC。不影响 ISP 主通路 LSC 模块。 |

<!-- Source EN PDF p.14, block 44 -->

#### 2.2.9 blkStatisticsEnable

<!-- Source EN PDF p.14, block 45 -->

对应 JSON 的 autoPara.blkStatisticsEnable。

<!-- Source EN PDF p.14, block 46 -->

| 名称 | 说明 |
|---|---|
| blkStatisticsEnable | 取值 0 或 1。0：关闭白平衡 15×15 分块统计；1：启用。 |

<!-- Source EN PDF p.14, block 47 -->

#### 2.2.10 blkMeasureMode

<!-- Source EN PDF p.14, block 48 -->

对应 JSON 的 autoPara.blkMeasureMode。

<!-- Source EN PDF p.15, block 49 -->

| 名称 | 说明 |
|---|---|
| blkMeasureMode | 取值 CALIB_AWB_BLK_STAT_MODE_ALL_V201 或 CALIB_AWB_BLK_STAT_MODE_REALWP_V201。ALL_V201 累加 15×15 统计块中的全部点，为默认值；REALWP_V201 仅累加其中白点。 |

<!-- Source EN PDF p.15, block 50 -->

#### 2.2.11 硬件白点检测流程

<!-- Source EN PDF p.15, block 51 -->

![英文原稿图, PDF p.15, #51](/docs/rockchip-isp30-color-optimization/assets/en-p15-figure1.png)

*英文原稿图, PDF p.15, #51.*

<!-- Source EN PDF p.15, block 52 -->

图：AWB 白点检测流程。

<!-- Source EN PDF p.15, block 53 -->

如流程图所示，从三个域判断是否为白点。

<!-- Source EN PDF p.16, block 54 -->

| 名称 | 说明 |
|---|---|
| uvDetectionEnable | 取值 0 或 1。0：关闭 UV 域非白点过滤；1：启用，按白点条件选取 UV 域白点。 |
| xyDetectionEnable | 取值 0 或 1。0：关闭 XY 域非白点过滤；1：启用，按白点条件选取 XY 域白点。 |
| yuvDetectionEnable | 取值 0 或 1。0：关闭 YUV 域非白点过滤；1：启用，按白点条件选取 YUV 域白点。 |

<!-- Source EN PDF p.16, block 55 -->

以上三个参数均为 autoPara 成员。全部设为 0 时，统计窗口内亮度符合要求的点均视为白点。来不及校准、只想粗略查看 AWB 效果时可这样使用。

<!-- Source EN PDF p.16, block 56 -->

##### 2.2.11.1 RGB2XY

<!-- Source EN PDF p.16, block 57 -->

RGB 到 XY 的转换参数由校准工具自动生成，对应 JSON 的 autoPara.rgb2TcsPara。

<!-- Source EN PDF p.16, block 58 -->

| 名称 | 说明 |
|---|---|
| pseudoLumWeight | 使不同光源白点尽可能位于直线上。标定工具生成，范围 0~1，不建议调整。 |
| rotationMat | 旋转矩阵，使 x 轴表征黑体辐射色温变化，y 轴表征相同色温光源的色偏。标定工具生成，范围 [-3.99, 3.99]，不建议调整。 |

<!-- Source EN PDF p.16, block 59 -->

##### 2.2.11.2 XY 域白点检测

<!-- Source EN PDF p.16, block 60 -->

![英文原稿图, PDF p.16, #60](/docs/rockchip-isp30-color-optimization/assets/en-p16-figure1.png)

*英文原稿图, PDF p.16, #60.*

<!-- Source EN PDF p.16, block 61 -->

图：XY 域白点区间。

<!-- Source EN PDF p.17, block 62 -->

XY 白点区间如上图，矩形框内的点为白点。有两种大小的区间，图中区间坐标为 [x0,x1,y0,y1]。在校准工具中手动调整白点区间，对应 autoPara.lightSources.xyRegion（原文这里写 SON）。

<!-- Source EN PDF p.17, block 64 -->

| 名称 | 说明 |
|---|---|
| normal | 中框白点区间，范围 [-8,7.99]。 |
| big | 大框白点区间，范围 [-8,7.99]。 |

<!-- Source EN PDF p.17, block 65 -->

##### 2.2.11.3 UV 域白点检测

<!-- Source EN PDF p.17, block 66 -->

![英文原稿图, PDF p.17, #66](/docs/rockchip-isp30-color-optimization/assets/en-p17-figure1.png)

*英文原稿图, PDF p.17, #66.*

<!-- Source EN PDF p.17, block 67 -->

图：UV 域白点区间。

<!-- Source EN PDF p.17, block 68 -->

UV 白点区间如上图，四边形框内的点为白点，对应 JSON 的 autoPara.lightSources.uvRegion。

<!-- Source EN PDF p.17, block 69 -->

| 名称 | 说明 |
|---|---|
| u | UV 白点条件的 U 坐标构成闭环，如 [u0,u1 u2,u3,u0]，范围 [0,255]，小数部分只能为 0 或 0.5。手动调整白点区间生成。 |
| v | UV 白点条件的 V 坐标构成闭环，如 [v0,v1 v2,v3,v0]，范围 [0,255]，小数部分只能为 0 或 0.5。在标定工具中手动调整生成。 |

<!-- Source EN PDF p.17, block 70 -->

##### 2.2.11.4 RGB2RYUV

<!-- Source EN PDF p.17, block 71 -->

RGB 到旋转 YUV 空间的转换参数，对应 JSON 的 autoPara.rgb2RotationYuvMat 矩阵。

<!-- Source EN PDF p.17, block 72 -->

```text
rgb2RotationYuvMat=[u0,u1,u2,uoffset
v0,v1,v2,voffset
y0,y1,y2,yoffset]
```

<!-- Source EN PDF p.18, block 75 -->

| 名称 | 说明 |
|---|---|
| u0,u1,u2,v0,v1,v2,y0,y1,y2 | 范围 [-1,1)，精度 1/2^9，由标定工具自动生成。 |
| uoffset,voffset,yoffset | 范围 [-255,254]，精度 1/2^4，由标定工具自动生成。 |

<!-- Source EN PDF p.18, block 76 -->

##### 2.2.11.5 RYUV 域白点检测

<!-- Source EN PDF p.18, block 77 -->

计算场景点 (y0,u0,v0) 与理论白点 (y',u0,v0) 的亮度差 diff = \|y0-y'\|。diff < th 时判为白点，否则不是。可按位置（u 分量区分）设置不同阈值 th，如图中的 dis-th 折线。

<!-- Source EN PDF p.18, block 78 -->

![英文原稿图, PDF p.18, #78](/docs/rockchip-isp30-color-optimization/assets/en-p18-figure1.png)

*英文原稿图, PDF p.18, #78.*

<!-- Source EN PDF p.18, block 79 -->

在校准工具中参考场景点 (y0,u0,v0) 的 diff 与 u，调整相应光源的 u-th 折线，以正确识别白点并 排除非白点（原文称目前此功能尚未实现）。光源通过前述 XY/UV 方法确定，因此 YUV 方法不能单独启用，需与 XY 或 UV 检测配合。

<!-- Source EN PDF p.18, block 81 -->

对应 JSON 的 autoPara.lightSources.rtYuvRegion。

<!-- Source EN PDF p.19, block 82 -->

| 名称 | 说明 |
|---|---|
| lineVector | 由 (y0,u0,v0) 求理论白点 (y',u0,v0) 所需参数；各分量范围 [0,255]，精度 1/(2^4)。标定工具生成，不建议调整。 |
| disP1P2 | 由 (y0,u0,v0) 求理论白点 (y',u0,v0) 所需参数；各分量范围 [0,5]。标定工具生成，不建议调整。 |
| thcurve_u | 分段线 u-th 的 u 分量，范围 [0,255]，整数。相邻 u 分量之差为 2 的幂。 |
| thcure_th | 分段线 u-th 的 th 分量，范围 [0,255]，精度 1/(2^4)。u-th 分段线必须单调递增。 |

<!-- Source EN PDF p.19, block 83 -->

##### 2.2.11.6 增加非白点区间

<!-- Source EN PDF p.19, block 84 -->

通常同时落入 XY、UV、YUV 白点区间的点会被视为白点。但某些非白点也可能符合条件，且处于范围中心，难以排除。此时可在 UV 或 XY 空间增加非白点区间，落入其中的点均视为非白点。

<!-- Source EN PDF p.19, block 85 -->

非白点区间最多为 7 个（原文表述为 non-white dots）。

<!-- Source EN PDF p.19, block 86 -->

对应 JSON 的 autoPara.extraWpRange。

<!-- Source EN PDF p.19, block 87 -->

![英文原稿图, PDF p.19, #87](/docs/rockchip-isp30-color-optimization/assets/en-p19-figure1.png)

*英文原稿图, PDF p.19, #87.*

<!-- Source EN PDF p.20, block 88 -->

| 名称 | 说明 |
|---|---|
| domain | 取值 CALIB_AWB_EXTRA_RANGE_DOMAIN_UV 或 CALIB_AWB_EXTRA_RANGE_DOMAIN_XY，分别表示 UV、XY 域白点区间。 |
| mode | 取值 CALIB_AWB_EXCLUDE_WP_MODE 或 CALIB_AWB_EXTTRA_LIGHT_SOURCES_MODE。前者表示非白点区间；后者表示附加光源白点区间（ISP21 不支持此模式）。 |
| window | 如图配置 [x0,x1,y0,y1]。domain=0 时范围 [0,511]，其中 1 bit 为小数；domain=1 时范围 [-8192,8191]，其中 10 bit 为小数。 |

<!-- Source EN PDF p.20, block 89 -->

##### 2.2.11.7 不同亮度白点的不同权重

<!-- Source EN PDF p.20, block 90 -->

lumalimit 模块提到，提高白点准确性需避免统计过亮/过暗点。本模块可视为升级版：给过亮/过暗白点较低权重，给适当亮度范围较高权重；可按场景中适当亮度白点的数量与环境亮度，动态设置不同亮度白点的权重，如下图。

<!-- Source EN PDF p.20, block 91 -->

![英文原稿图, PDF p.20, #91](/docs/rockchip-isp30-color-optimization/assets/en-p20-figure1.png)

*英文原稿图, PDF p.20, #91.*

<!-- Source EN PDF p.20, block 92 -->

图中适当亮度白点占比较大时，合适亮度区间（如 y 为 80–224）的权重较大，其他暗/亮区权重较小。

<!-- Source EN PDF p.20, block 93 -->

对应 JSON 的 autoPara.wpDiffLumaWeight。

<!-- Source EN PDF p.21, block 94 -->

| 名称 | 说明 |
|---|---|
| enable | 功能开关，0 或 1：0 关闭，1 启用。 |
| wpDiffWeiEnableTh | 启用功能还需满足阈值条件。 |
| wpDiffWeiEnableTh.wpDiffWeiNoTh | 白点数量大于该阈值才启用，范围 [0,1]。 |
| wpDiffWeiEnableTh.wpDiffWeiLvValueTh | 环境亮度高于此阈值才启用，范围 [0-2555000]。 |
| wpDiffwei_y | 白点亮度直方图分段，9 点划分 8 个 bin；范围 [0,255]。原文提示不建议调整，并要求相邻分量之差为 2 的幂。 |
| perfectBinConf | 指定直方图哪些 bin 为高可信白点，即指定合适亮度。各分量对应一个 bin，取值 0 或 1：0 为低可信，1 为高可信白点。 |
| wpDiffWeiLvTh | 两个分量分别对应环境亮度 wpDiffWeiLvTh0、wpDiffWeiLvTh1，范围 [0-2555000]。 |
| wpDiffWeightLvSet | 为不同亮度下不同高可信白点比例配置不同曲线，实际值由这些曲线线性插值。 |
| wpDiffWeightLvSet_len | 环境亮度配置数量。 |
| wpDiffWeightLvSet.LvValue | 环境亮度值。 |
| wpDiffWeightLvSet.ratioSet | 环境亮度为 wpDiffWeightLvSet.LvValue 时，可为不同高可信白点比例配置不同曲线。 |
| wpDiffWeightLvSet.ratioSet_len | 高可信白点数量（原文表述）。 |
| wpDiffWeightLvSet.ratioSet.ratioValue | 高可信白点百分比。 |
| wpDiffWeightLvSet.ratioSet.weight | 环境亮度为 wpDiffWeightLvSet.LvValue、高可信白点比例为 wpDiffWeightLvSet.ratioSet.ratioValue 时的亮度权重；每个分量对应一个 bin，范围 [0,1]。 |

<!-- Source EN PDF p.22, block 96 -->

##### 2.2.11.8 分块权重

<!-- Source EN PDF p.22, block 97 -->

不同块的白点可配置不同权重，按实际应用使用；没有特殊需求时不建议启用。

<!-- Source EN PDF p.22, block 98 -->

| 名称 | 说明 |
|---|---|
| wpDiffBlkWeiEnable | 功能开关，0 或 1：0 关闭，1 启用。 |
| wpDiffBlkWeight | 15×15 个块，各块权重为 [0-63] 的整数。 |

<!-- Source EN PDF p.22, block 99 -->

#### 2.2.12 AWB 策略

<!-- Source EN PDF p.22, block 100 -->

##### 2.2.12.1 分区策略计算 WBGain

<!-- Source EN PDF p.22, block 101 -->

![英文原稿图, PDF p.22, #101](/docs/rockchip-isp30-color-optimization/assets/en-p22-figure1.png)

*英文原稿图, PDF p.22, #101.*

<!-- Source EN PDF p.22, block 102 -->

图：AWB 分区策略计算 WBGain 示意。

<!-- Source EN PDF p.23, block 103 -->

对“环境亮度–白点数量”空间分区，不同区间用不同方法计算白平衡增益。环境亮度的含义：在 1x 曝光增益、1ms 积分时间下，若场景平均亮度为 255（最大），则环境亮度为 255000；数值越大表示环境越亮。

<!-- Source EN PDF p.23, block 104 -->

###### 2.2.12.1.1 (1) 分区参数

<!-- Source EN PDF p.23, block 105 -->

对应 JSON 的 autoExtPara.division。

<!-- Source EN PDF p.23, block 106 -->

| 名称 | 说明 |
|---|---|
| lumaValThLow | 图中环境亮度阈值 LV_THL1，范围 0-255000。 |
| lumaValThLow2 | 图中环境亮度阈值 LV_THL2，范围 0-255000。 |
| lumaValThHigh | 图中环境亮度阈值 LV_THH1，范围 0-255000。 |
| lumaValThHigh2 | 图中环境亮度阈值 LV_THH2，范围 0-255000。 |
| wpNumTh | 为不同亮度配置图中的 WP_THL、WP_THH 阈值，实际阈值由配置线性插值。 |
| wpNumTh.lumaValue | 环境亮度范围 0-255000。 |
| wpNumTh.low | 图中白点数量阈值 WP_THL，范围 0-100000。实际白点数与 WP_THL/100000*totalPixe 比较；totalPixel = wight * height /ds_w/ds_h，wight、height 为图宽高，ds_w、ds_h 为水平、垂直下采样倍数。保留原稿 totalPixe/wight 拼写。 |
| wpNumTh.high | 图中白点数量阈值 WP_THH，范围 0-100000。实际白点数与 WP_THH/100000*totalPixel 比较。 |

<!-- Source EN PDF p.23, block 107 -->

###### 2.2.12.1.2 (2) 策略 WBGain 相关参数

<!-- Source EN PDF p.23, block 108 -->

按上述阈值划分环境亮度–白点数量空间，各区间的白平衡增益计算方法如下：

<!-- Source EN PDF p.23, block 109 -->

① WPType3 的 wbgain 与各光源统计增益 StaGain_i、亮环境增益 DayGain_i 和暗环境增益 NightGain 相关。StaGain_i 权重为 staWeigthSet，DayGain_i 权重为 100-staWeigthSet；NightGain 权重为 tempWeigth，后文详细说明。

<!-- Source EN PDF p.23, block 110 -->

② WPType2 是过渡区，由 WPType3 与 WPType1 的 wbgain 混合得到。

<!-- Source EN PDF p.24, block 111 -->

③ WPType1 中的 wbgain：

<!-- Source EN PDF p.24, block 112 -->

首帧时，根据环境亮度区间，可能使用固定 NightGain/DayGain，或单色算法计算的 WBGain；否则使用前几帧 wbgain 的加权结果。

<!-- Source EN PDF p.24, block 113 -->

对应 JSON 参数如下。

<!-- Source EN PDF p.24, block 114 -->

① DayGain

<!-- Source EN PDF p.24, block 115 -->

| 名称 | 说明 |
|---|---|
| defaultDayGainLow | 特别明亮日光下建议 WBGAIN，范围 [0.5-7.9]。 |
| defaultDayGainHigh | 普通日光下建议 WBGAIN，范围 [0.5-7.9]。 |
| dayGainLvThSet | dayGainLvThSet_THL、dayGainLvThSet_THH 分别对应 defaultDayGainLow、defaultDayGainHigh；不同光源可不同，范围 [0-255000]。 |
| staWeight | WPType3 中 StaGain_i 的权重。不同亮度权重对应 JSON 的 LvMatrix；DayGain_i 权重为 100-staWeigthSet。不同光源可不同。通常 StaGain 权重 100 最佳；室外蓝天偏红时，可将 defaultDayGainLow 配为 d65 标准 wbgain、defaultDayGainHigh 配为 d50 标准 wbgain，减小对应亮度的 staWeigth 改善。范围 [0-100]。 |

<!-- Source EN PDF p.24, block 116 -->

根据环境亮度、dayGainLvThSet、defaultDayGainLow 和 defaultDayGainHigh 线性插值，得到各光源 DayGain_i；结合后文光源权重，得到 WPType1 区间 DayGain。

<!-- Source EN PDF p.24, block 117 -->

② NightGain

<!-- Source EN PDF p.24, block 118 -->

| 名称 | 说明 |
|---|---|
| defaultNightGain | 上述 NightGain，低环境亮度时建议 wbgain，范围 [0.5-7.9]。 |
| defaultNightGainWeight | WPType3 计算 wbgain 时 NightGain 的权重。不同亮度权重对应 JSON 的 lumaValueMatrix，范围 0-100。 |

<!-- Source EN PDF p.24, block 119 -->

③ SingleColorGain（singleColorProcess）

<!-- Source EN PDF p.25, block 120 -->

大面积单色白平衡功能依据场景，从配置的颜色集合和光源集合选择颜色及 WBGain。默认校准参数能识别红、绿、蓝、黄、紫；可按实际应用增删 colorBlock 并调整 lsUsedForEstimation。工具不支持该功能，对应 JSON 的 autoExtPara.singleColorGain。

<!-- Source EN PDF p.25, block 121 -->

| 名称 | 说明 |
|---|---|
| enable | 功能开关，0 或 1：0 关闭，1 启用。 |
| colorBlock | 待选颜色集合，由工具生成。 |
| colorBlock_len | colorBlock 集合中的颜色总数。 |
| colorBlock.index | 颜色索引，标记标定所用色块；修改不影响效果。范围 1-24；标定工具选择 13、14、15、16、5、10。 |
| colorBlock.meanC | 颜色在 LCH 空间的平均色度值。 |
| colorBlock.meanH | 颜色在 LCH 空间的平均色相值。 |
| lsUsedForEstimation | 待选光源集合，由工具生成。 |
| lsUsedForEstimation_len | lsUsedForEstimation 集合的光源总数。 |
| lsUsedForEstimation.name | 光源名称。 |
| lsUsedForEstimation.RGain | 该光源红通道白平衡增益，大于 0，小数。 |
| lsUsedForEstimation.BGain | 该光源蓝通道白平衡增益，大于 0，小数。 |
| alpha | LCH 空间的 H 权重，可使用默认值，不必调整；范围 [0.0-1.0]。 |

<!-- Source EN PDF p.25, block 122 -->

④ 前几帧已有白平衡增益时，使用其加权 wbgain 作为 WpType3 增益（此处区间名按原文保留）。

<!-- Source EN PDF p.26, block 123 -->

| 名称 | 说明 |
|---|---|
| weightForNightGainCalc_len | 指定用前 weightForNightGainCalc_len 帧加权，任意整数。 |
| weightForNightGainCalc | 前若干帧的权重。第 0 项对应最早帧，末项对应最新帧，范围 [0-100]。 |

<!-- Source EN PDF p.26, block 124 -->

###### 2.2.12.1.3 (3) 光源权重计算参数

<!-- Source EN PDF p.26, block 125 -->

WpType3 各光源概率计算参数。

<!-- Source EN PDF p.26, block 126 -->

![英文原稿图, PDF p.26, #126](/docs/rockchip-isp30-color-optimization/assets/en-p26-figure1.png)

*英文原稿图, PDF p.26, #126.*

```text
Prob_i = probLV_i * probDis_i * probWP_i
```

<!-- Source EN PDF p.26, block 127 -->

![英文原稿图, PDF p.26, #127](/docs/rockchip-isp30-color-optimization/assets/en-p26-figure2.png)

*英文原稿图, PDF p.26, #127.*

```text
probDis_i
```

<!-- Source EN PDF p.26, block 128 -->

① 距离概率参数。

<!-- Source EN PDF p.26, block 129 -->

计算上一帧 wbgain 与各光源标准 wbgain 的欧氏距离 gain_dis，按下图折线计算概率。

<!-- Source EN PDF p.26, block 130 -->

![英文原稿图, PDF p.26, #130](/docs/rockchip-isp30-color-optimization/assets/en-p26-figure3.png)

*英文原稿图, PDF p.26, #130.*

<!-- Source EN PDF p.26, block 131 -->

对应 JSON 的 autoExtPara.probCalcDis。

<!-- Source EN PDF p.26, block 132 -->

| 名称 | 说明 |
|---|---|
| proDis_THL | 图中距离阈值 disTHL，范围 [0-4]。 |
| proDis_THH | 图中距离阈值 disTHH，范围 [0-4]。 |

<!-- Source EN PDF p.26, block 133 -->

![英文原稿图, PDF p.26, #133](/docs/rockchip-isp30-color-optimization/assets/en-p26-figure4.png)

*英文原稿图, PDF p.26, #133.*

```text
probLV_i
```

<!-- Source EN PDF p.26, block 134 -->

② 场景亮度概率参数。

<!-- Source EN PDF p.26, block 135 -->

室外型光源概率为 pout，由图 4-14 的亮度–pout 曲线计算。

<!-- Source EN PDF p.26, block 136 -->

室内型光源概率 pin = 1-pout。

<!-- Source EN PDF p.26, block 137 -->

不能严格区分的光源，例如 PD50 = max(pout, pin)。

<!-- Source EN PDF p.27, block 138 -->

![英文原稿图, PDF p.27, #138](/docs/rockchip-isp30-color-optimization/assets/en-p27-figure1.png)

*英文原稿图, PDF p.27, #138.*

<!-- Source EN PDF p.27, block 139 -->

对应 JSON 参数如下。

<!-- Source EN PDF p.27, block 140 -->

| 名称 | 说明 |
|---|---|
| autoExtPara.probCalcLv.outdoorLumaValThLow | 图中环境亮度阈值 outdoorTHL，范围 0-255000。 |
| autoExtPara.probCalcLv.outdoorLumaValThHigh | 图中环境亮度阈值 outdoorTHH，范围 0-255000。 |
| autoPara.lightSources.doorType | 光源室内/室外类型，不同光源可不同：1 室内；2 介于室内外；3 室外。 |

<!-- Source EN PDF p.27, block 141 -->

![英文原稿图, PDF p.27, #141](/docs/rockchip-isp30-color-optimization/assets/en-p27-figure2.png)

*英文原稿图, PDF p.27, #141.*

```text
probWP_i
```

<!-- Source EN PDF p.27, block 142 -->

③ 场景白点数量概率参数。

<!-- Source EN PDF p.27, block 143 -->

对应 JSON 的 autoExtPara.probCalcWp。

<!-- Source EN PDF p.27, block 144 -->

| 名称 | 说明 |
|---|---|
| wpNumPercTh | 某光源白点数小于 wpNumPercTh*totalPixel，且其占所有光源白点总数的比例小于 wpNumPercTh2 时，该光源白点数概率为 0。其中 totalPixel = wight * height /ds_w/ds_h；wight、height 为宽高，ds_w、ds_h 为水平、垂直下采样倍数。范围 0-1。原表乘号以字形格式呈现，按原页恢复。 |
| wpNumPercTh2 | 同上。 |

<!-- Source EN PDF p.28, block 145 -->

#### 2.2.13 WBGain 色适应调整

<!-- Source EN PDF p.28, block 146 -->

暂不建议使用，对应 JSON 的 autoExtPara.chrAdpttAdj。

<!-- Source EN PDF p.28, block 147 -->

| 名称 | 说明 |
|---|---|
| enable | 使校正后的色彩外观尽可能接近人眼感知。0 不启用，1 启用。 |
| laCalcFactor | 控制不同亮度下色适应的系数，默认 40。 |
| targetGain | 以 wbgain 表征目标光源，将色彩外观调整至该光源下。范围 0-4，默认 d50 白平衡增益。 |

<!-- Source EN PDF p.28, block 148 -->

#### 2.2.14 WBGain 范围限制

<!-- Source EN PDF p.28, block 149 -->

![英文原稿图, PDF p.28, #149](/docs/rockchip-isp30-color-optimization/assets/en-p28-figure1.png)

*英文原稿图, PDF p.28, #149.*

<!-- Source EN PDF p.28, block 150 -->

将白平衡增益限制在上图红线围成的区域内。横坐标为相对色温，纵坐标为显色指数，二者均为光源属性。对应 JSON 的 autoExtPara.wbGainClip 结构。

<!-- Source EN PDF p.29, block 151 -->

| 名称 | 说明 |
|---|---|
| enable | 色温范围限制开关：0 关闭，1 启用。 |
| cct | 图中围合区域上下边界点的 CCT 坐标，两条边界使用相同 CCT 采样坐标，范围 [1000-10000]。 |
| cri_bound_up | 对应图中下边界点；需 cri0>=-cri_bound_up，范围 -1 到 1。 |
| cri_bound_low | 对应图中上边界点 cri 分量；需 cri0<=cri_bound_low，范围 -1 到 1。 |
| cct_len/cri_bound_up_len/cri_bound_low_len | cct_len、cri_bound_up_len、cri_bound_low_len 分别为 cct、cri_bound_up、cri_bound_low 长度，三者应相等。 |

<!-- Source EN PDF p.29, block 152 -->

此外，可限制室外光源的最低色温，对应 JSON 的 autoExtPara.wbGainDaylightClip 结构。

<!-- Source EN PDF p.29, block 153 -->

| 名称 | 说明 |
|---|---|
| enable | 室外最低色温限制开关：0 关闭，1 启用。 |
| outdoor_cct_min | 室外最低色温，取值不限制。 |

<!-- Source EN PDF p.29, block 154 -->

若 wbGainClip.eanble = 1，场景为 (cct0, cri0)，当 cct0 超出左（右）边界时，输出 cct0 被强制设为左（右）边界值；若 cri0`<-cri_bound_up，则输出 cri0=-cri_bound_up；若 cri0 >`cri_bound_low，则输出 cri0=cri_bound_low。

<!-- Source EN PDF p.29, block 155 -->

若 wbGainDaylightClip.enable= 1 且场景为室外，当 cct0 >outdoor_cct_min 时，输出 cct0=outdoor_cct_min。

<!-- Source EN PDF p.29, block 156 -->

#### 2.2.15 WBGain 色调调整

<!-- Source EN PDF p.29, block 157 -->

对应 JSON 的 autoExtPara.wbGainAdjust 结构。

<!-- Source EN PDF p.30, block 158 -->

| 名称 | 说明 |
|---|---|
| enable | 色调调整开关：0 关闭，1 启用。 |
| lutAll | 不同环境亮度可配置不同输出色温表。 |
| lutAll_len | 指定色温表数量。 |
| lutAll.lumaValue | 环境亮度，范围 0-255000。 |
| lutAll.ct_grid_num | 输入色温表的色温采样点数，不限制。 |
| lutAll.ct_in_range | 输入色温表的色温范围，不限制。 |
| lutAll.cri_grid_num | 输入色温表的显色指数采样点数，不限制。 |
| lutAll.cri_in_range | 输入色温表的显色指数范围，不限制。 |
| lutAll.ct_out | 如下方界面，各点 ct 从左至右（冷至暖）由小到大，范围 0-255000。 |
| lutAll.cri_out | 如下方界面，各点 CRI 从下至上（紫至绿）由负到正，不限制。 |
| lutAll.ct_in_range_len/ lutAll.cri_in_range_len/lutAll.cri_out_len/lutAll.cri_out | 表示下方二维网格的点数，应相等且为 lutAll.ct_grid_num*lutAll.cri_grid_num。 |

<!-- Source EN PDF p.30, block 159 -->

当前 JSON 版本的工具不支持该调整功能。

<!-- Source EN PDF p.30, block 160 -->

未调整色温时，ct_out、cri_out 对应的二维网格如下。在 ct_in_range 和 cri_in_range 指定的矩形区域内，水平和垂直方向分别按 ct_grid_num、cri_grid_num 进行采样，采样点对应下图圆点。ct_out 保存所有圆点的 ct 坐标，cri_out 保存所有圆点的纵坐标。

<!-- Source EN PDF p.31, block 161 -->

![英文原稿图, PDF p.31, #161](/docs/rockchip-isp30-color-optimization/assets/en-p31-figure1.png)

*英文原稿图, PDF p.31, #161.*

<!-- Source EN PDF p.31, block 162 -->

整体色彩风格的调整：

<!-- Source EN PDF p.31, block 163 -->

(1) 若要将色温 2000k 的色调调暖，选择 CT Line Only 模式，按下图调整表格：将鼠标移到任意 cct=2000 的圆点附近，按住并向右拖动。应用后，2000k–2391k 的输入全部调整到 2391k。

<!-- Source EN PDF p.31, block 164 -->

![英文原稿图, PDF p.31, #164](/docs/rockchip-isp30-color-optimization/assets/en-p31-figure2.png)

*英文原稿图, PDF p.31, #164.*

<!-- Source EN PDF p.31, block 165 -->

(2) 若要将全部色调调冷，选择 CT Line Only 模式，按下图调整表格：将鼠标移到不同 CCT 的圆点上，按住并向左拖动，直到所有色调向左移动。

<!-- Source EN PDF p.32, block 166 -->

![英文原稿图, PDF p.32, #166](/docs/rockchip-isp30-color-optimization/assets/en-p32-figure1.png)

*英文原稿图, PDF p.32, #166.*

<!-- Source EN PDF p.32, block 167 -->

(3) 若要将所有 CRI 为 0.5 的色调调紫，选择 CRILine ONLY 模式，按下图调整表格：将鼠标移到任意 CRI=0.5 的圆点附近，按住并向下拖动；向上拖动则偏绿。

<!-- Source EN PDF p.32, block 168 -->

![英文原稿图, PDF p.32, #168](/docs/rockchip-isp30-color-optimization/assets/en-p32-figure2.png)

*英文原稿图, PDF p.32, #168.*

<!-- Source EN PDF p.32, block 169 -->

色调调整效果如下（中间为原图，上、下、左、右分别为绿色、紫色、蓝色和红色色调）。

<!-- Source EN PDF p.33, block 170 -->

![英文原稿图, PDF p.33, #170](/docs/rockchip-isp30-color-optimization/assets/en-p33-figure1.png)

*英文原稿图, PDF p.33, #170.*

<!-- Source EN PDF p.33, block 171 -->

此外，二维表可方便地局部调整 wbgain 而不影响其他场景。此时选择自由模式，可沿任意方向调整；移动所在矩形四个顶点的坐标即可调整输出 wbgain。

<!-- Source EN PDF p.33, block 172 -->

#### 2.2.16 wbGain 偏移

<!-- Source EN PDF p.33, block 173 -->

对应 JSON 的 autoExtPara.wbGainOffset 结构。

<!-- Source EN PDF p.33, block 174 -->

| 名称 | 说明 |
|---|---|
| enable | 开关：0 不启用，1 启用。 |
| offset | R、GR、GB、B 通道偏移。范围由 wbgain+offset 决定：ISP21 相加后范围 [0,4]，其他平台 [0,8]。 |

<!-- Source EN PDF p.33, block 175 -->

#### 2.2.17 remosaic 传感器配置

<!-- Source EN PDF p.33, block 176 -->

其他形式的传感器 raw 通过插值转换为 Bayer raw 时，需先乘入 wbgain，之后没有逆 wbgain 运算。本配置用于适配当前 AWB 算法，对应 JSON 的 autoExtPara.remosaicCfg 结构。

<!-- Source EN PDF p.34, block 177 -->

| 名称 | 说明 |
|---|---|
| enable | 开关：0 不启用，1 启用。Bayer 排列传感器无需启用。 |
| sensorWbGain | 插值时乘入的 wbgain，对应 R、GR、GB、B 通道；范围参见传感器资料。 |
| applyInvWbGainEnable | 是否在 raw AWB 统计前进行逆 wbgain，即除以 sensorWbGain。0 不启用，1 启用。 |

<!-- Source EN PDF p.34, block 178 -->

#### 2.2.18 WBGain 平滑

<!-- Source EN PDF p.34, block 179 -->

计算前一帧白平衡增益的权重 wbGainDampFactor，通过对前一帧和当前帧 wbgain 加权，实现平滑变化。若要提高 wbgain 稳定性，可增大 dFMin、dFMax，但收敛速度会变慢；若要加快收敛，可减小 dFMin、dFMax，但 wbgain 可能跳变。

<!-- Source EN PDF p.34, block 180 -->

wbGainDampFactor 的计算逻辑如下：环境亮度变化较小时，wbGainDampFactor 稳定在 dFMax；环境亮度突变时，wbGainDampFactor 向 dFMin 靠近，即当前帧权重增大，使 wbgain 尽可能跟随环境变化并加快收敛。具体代码如下：

<!-- Source EN PDF p.34, block 181 -->

```text
if (varianceLuma > LvVarTh) {
*wbGainDampFactor -= dFStep;
}
else {
*wbGainDampFactor += dFStep;
}
if (*wbGainDampFactor < dFMin) {
*wbGainDampFactor = dFMin;
}
else if (*wbGainDampFactor > dFMax) {
*wbGainDampFactor = dFMax;
}
```

<!-- Source EN PDF p.34, block 193 -->

对应 JSON 的 autoExtPara.dampFactor 结构。

<!-- Source EN PDF p.35, block 194 -->

| 名称 | 说明 |
|---|---|
| dFStep | wbGainDampFactor 变化步长，范围 0-1。 |
| dFMin | wbGainDampFactor 最小值，范围 0-1。 |
| dFMax | wbGainDampFactor 最大值，范围 0-1。 |
| LvIIRsize | 记录环境亮度的帧数，范围 0-255。 |
| LvVarTh | 判断是否改变 wbGainDampFactor 的环境亮度方差阈值，范围 0-255000。 |

<!-- Source EN PDF p.35, block 195 -->

#### 2.2.19 其他

<!-- Source EN PDF p.35, block 196 -->

##### 2.2.19.1 tolerance

<!-- Source EN PDF p.35, block 197 -->

用于控制 wbgain 更新，可为不同环境亮度 lumaValue 配置不同阈值 toleranceValue。当 AWB 策略计算的若干帧白平衡增益差值（全部通道）的平均值小于该阈值时，wbgain 使用前一帧的值；帧数由 weightForNightGainCalc_len 配置。对应 JSON 的 autoExtPara.tolerance 结构。

<!-- Source EN PDF p.35, block 198 -->

| 名称 | 说明 |
|---|---|
| lumaValue | 环境亮度，范围 [0-255000]，参考后文 lumaValueMatrix 配置。 |
| toleranceValue | 阈值，范围 [0-1]。 |
| lumaValue_len/toleranceValue_len | 对应配置数量，两者相等，范围不限制。 |

<!-- Source EN PDF p.35, block 199 -->

##### 2.2.19.2 runInterval

<!-- Source EN PDF p.35, block 200 -->

控制每隔多少帧执行一次自动白平衡，可为不同环境亮度 lumaValue 配置不同帧间隔 intervalValue。对应 JSON 的 autoExtPara.runInterval 结构。

<!-- Source EN PDF p.36, block 201 -->

| 名称 | 说明 |
|---|---|
| lumaValue | 环境亮度，范围 [0-255000]，参考后文 lumaValueMatrix 配置。 |
| intervalValue | 帧数，范围 [0-255]。 |
| lumaValue_len/intervalValue_len | 对应配置数量，两者相等，范围不限制。 |

<!-- Source EN PDF p.36, block 202 -->

##### 2.2.19.3 lumaValueMatrix

<!-- Source EN PDF p.36, block 203 -->

对应 JSON 的 autoExtPara.lumaValueMatrix 数组。

<!-- Source EN PDF p.36, block 204 -->

| 名称 | 说明 |
|---|---|
| lumaValueMatrix | 环境亮度分为 15 级；每级起始亮度值范围 0-300000。 |

<!-- Source EN PDF p.36, block 205 -->

##### 2.2.19.4 白平衡收敛判断

<!-- Source EN PDF p.36, block 206 -->

对应 JSON 的 autoExtPara.converged 结构。

<!-- Source EN PDF p.36, block 207 -->

| 名称 | 说明 |
|---|---|
| varThforUnDamp | 白平衡收敛阈值。若若干帧内 AWB 策略所得各通道白平衡增益差平均值小于 varThforUnDamp，且平滑后各通道增益差平均值小于 varThforDamp，则认为收敛。帧数由 weightForNightGainCalc_len 指定。范围 0.0-1，建议 0.06。 |
| varThforDamp | 含义、范围同上，建议 0.03。 |

<!-- Source EN PDF p.36, block 208 -->

##### 2.2.19.5 中框、大框与附加框白点选择参数

<!-- Source EN PDF p.36, block 209 -->

对应 JSON 的 autoExtPara.xyRegionStableSelection 节点。

<!-- Source EN PDF p.37, block 210 -->

| 名称 | 说明 |
|---|---|
| enable | 使中框、大框和附加白点框选择结果稳定的功能开关。 |
| xyTypeListSize | xyRegionSize、LvVarTh 用于稳定框选结果。取 xyTypeListSize 帧中票数较多的框为最终结果；LvIIRsize 帧（参见 WBGain 平滑）的亮度方差小于 varianceLumaTh 时不更新框选，即沿用上一帧的框。范围 0-1000。 |
| varianceLumaTh | 说明参见上一行；范围 0-1000。 |
| wpNumTh | 配置随环境亮度变化的阈值，当前阈值由配置线性插值。 |
| wpNumTh.lumaValue | 环境亮度，范围 0-255000。 |
| wpNumTh.forBigType | 将白点数与 forBigType/100000*totalPixel 比较；范围 0-100000。 |
| wpNumTh.forExtraType | 将实际白点数与 forExtraType/100000*totalPixel 比较；范围 0-100000。 |

<!-- Source EN PDF p.37, block 211 -->

xyRegionSize = 0 或 varianceLumaTh= 0 时，每帧均使用当前帧信息对应的框选结果。

<!-- Source EN PDF p.37, block 212 -->

```text
if(number of white dots in the middle frame> forBigType/100000*totalPixel){
Then the white point for calculating wbgain comes from the middle box
}else{
The white point for calculating wbgain comes from the large box
if(The number of white dots in the large box<=forExtraType/100000*totalPixel && The total number of white dots in the accessory white dot box > 0){
The white point for calculating wbgain comes from the additional white point box}
}
```

<!-- Source EN PDF p.37, block 219 -->

注意：

<!-- Source EN PDF p.37, block 220 -->

(1) 用于计算 wbgain 的白点来自附加白点框时，“分区策略计算 WBGain”一节的参数无效。

<!-- Source EN PDF p.38, block 221 -->

### 2.3 标定

<!-- Source EN PDF p.38, block 222 -->

#### 2.3.1 AWB 标定原理

<!-- Source EN PDF p.38, block 223 -->

主要标定标准光源下 Raw 在 XY、UV、YUV 域中的白点条件、单色算法参数和白平衡增益。

<!-- Source EN PDF p.38, block 224 -->

#### 2.3.2 AWB 标定 raw 图要求

<!-- Source EN PDF p.38, block 225 -->

采集 RAW 图像时，需要准备以下环境：

<!-- Source EN PDF p.38, block 226 -->

① 设备：X-rite 24 色卡、灯箱。

<!-- Source EN PDF p.38, block 227 -->

② 调整曝光参数，使色卡最亮白块的最大值处于 [150-240]；在此范围内越亮越好。

<!-- Source EN PDF p.38, block 229 -->

③ 色卡占画面的比例大于 1/9。

<!-- Source EN PDF p.38, block 230 -->

依次在 A、CWF、D50、D65、D75、HZ、TL84 光源下拍摄 X-rite 24 色卡，去马赛克示意图如下：

<!-- Source EN PDF p.38, block 231 -->

![英文原稿图, PDF p.38, #231](/docs/rockchip-isp30-color-optimization/assets/en-p38-figure1.png)

*英文原稿图, PDF p.38, #231.*

<!-- Source EN PDF p.38, block 232 -->

#### 2.3.3 AWB 标定工具界面说明

<!-- Source EN PDF p.38, block 233 -->

(1) AWB 主界面示意图。

<!-- Source EN PDF p.39, block 234 -->

![英文原稿图, PDF p.39, #234](/docs/rockchip-isp30-color-optimization/assets/en-p39-figure1.png)

*英文原稿图, PDF p.39, #234.*

<!-- Source EN PDF p.39, block 235 -->

(2) 标定时，主要调整 UV、XY 域的白点边界和 YUV 域的 TH 值。

<!-- Source EN PDF p.39, block 236 -->

![英文原稿图, PDF p.39, #236](/docs/rockchip-isp30-color-optimization/assets/en-p39-figure2.png)

*英文原稿图, PDF p.39, #236.*

<!-- Source EN PDF p.40, block 237 -->

![英文原稿图, PDF p.40, #237](/docs/rockchip-isp30-color-optimization/assets/en-p40-figure1.png)

*英文原稿图, PDF p.40, #237.*

<!-- Source EN PDF p.40, block 238 -->

UV、XY 域白点区间调整操作：a) 在坐标系中，用鼠标拖动白点条件的角点，调整位置和白点区间；b) 在空白区域拖动鼠标，可拖动整个白点区间；c) 使用滚轮缩放。

<!-- Source EN PDF p.40, block 239 -->

(3) Exclude WPC Range 面板可添加非白点区间及附加光源白点区间。

<!-- Source EN PDF p.40, block 240 -->

(4) 点击 AWB 主界面的 AWB Simulaton 按钮，弹出下图界面。AWB Simulaton 用于检测 raw 图的白点，统计白点增益和数量。

<!-- Source EN PDF p.40, block 241 -->

![英文原稿图, PDF p.40, #241](/docs/rockchip-isp30-color-optimization/assets/en-p40-figure2.png)

*英文原稿图, PDF p.40, #241.*

<!-- Source EN PDF p.41, block 242 -->

① LoadImage 导入 Raw 图像后，按下图显示白点信息；不同光源的白点以不同颜色显示。中框、大框的白点数量及 RGain、BGain 分别显示在 Detected WP Number、RGain、BGain 三个文本框中。

<!-- Source EN PDF p.41, block 243 -->

![英文原稿图, PDF p.41, #243](/docs/rockchip-isp30-color-optimization/assets/en-p41-figure1.png)

*英文原稿图, PDF p.41, #243.*

<!-- Source EN PDF p.41, block 244 -->

② 点击图像任意位置（下图黑箭头），该点将映射到 UV 和 XY 域白点条件界面（黑色小方块），便于判断其是否位于白点区间内。同时显示该点的 R G B U V X Y RGain BGain（红框），以及映射到 YUV 域各光源后的 you、th 和相对标准白点的偏离距离（绿框三列；原文写作 you）。

<!-- Source EN PDF p.41, block 245 -->

![英文原稿图, PDF p.41, #245](/docs/rockchip-isp30-color-optimization/assets/en-p41-figure2.png)

*英文原稿图, PDF p.41, #245.*

<!-- Source EN PDF p.42, block 246 -->

![英文原稿图, PDF p.42, #246](/docs/rockchip-isp30-color-optimization/assets/en-p42-figure1.png)

*英文原稿图, PDF p.42, #246.*

<!-- Source EN PDF p.42, block 247 -->

#### 2.3.4 AWB 标定步骤

<!-- Source EN PDF p.42, block 248 -->

(1) AWB 标定前需完成 BLC 和 LSC 标定。

<!-- Source EN PDF p.42, block 249 -->

(2) 点击 Load Raw Files，导入 A、CWF、D50、D65、D75、HZ、TL84 下的 raw 图（建议使用这七种光源的 raw 图标定）。

<!-- Source EN PDF p.42, block 250 -->

(3) 点击 Find Chart 识别色卡。

<!-- Source EN PDF p.42, block 251 -->

![英文原稿图, PDF p.42, #251](/docs/rockchip-isp30-color-optimization/assets/en-p42-figure2.png)

*英文原稿图, PDF p.42, #251.*

<!-- Source EN PDF p.42, block 252 -->

① 依次点击 Block 1、Block 6、Block 19，再点击 Block 20。

<!-- Source EN PDF p.42, block 253 -->

② 点击 FindChart，批量识别所有光源下的色卡色块，如下图（显示最后一个光源的白点检测结果）。

<!-- Source EN PDF p.43, block 254 -->

![英文原稿图, PDF p.43, #254](/docs/rockchip-isp30-color-optimization/assets/en-p43-figure1.png)

*英文原稿图, PDF p.43, #254.*

<!-- Source EN PDF p.43, block 255 -->

③ 在下拉菜单中选择其他光源，确认色块识别是否正确。示例发现仅 TL84 的最后一个色块略偏右，此时只需单独重新检测：在对应模式下选择 Find chart one by one，重复步骤 1、2，直到 TL84 色块识别正确，如下图。

<!-- Source EN PDF p.43, block 256 -->

![英文原稿图, PDF p.43, #256](/docs/rockchip-isp30-color-optimization/assets/en-p43-figure2.png)

*英文原稿图, PDF p.43, #256.*

<!-- Source EN PDF p.43, block 257 -->

④ 点击 Save 完成识别。

<!-- Source EN PDF p.43, block 258 -->

(4) 点击 Calibrate，获得下列初始白点条件及其他参数。

<!-- Source EN PDF p.44, block 259 -->

![英文原稿图, PDF p.44, #259](/docs/rockchip-isp30-color-optimization/assets/en-p44-figure1.png)

*英文原稿图, PDF p.44, #259.*

<!-- Source EN PDF p.44, block 260 -->

![英文原稿图, PDF p.44, #260](/docs/rockchip-isp30-color-optimization/assets/en-p44-figure2.png)

*英文原稿图, PDF p.44, #260.*

| 光源 | U0 | U1 | U2 | U3 | U4 | U5 |
|---|---|---|---|---|---|---|
| A | 50 | 54 | 70 | 78 | 110 | 142 |
| CWF | 50 | 54 | 70 | 78 | 110 | 142 |
| D50 | 50 | 54 | 70 | 78 | 110 | 142 |
| D65 | 50 | 54 | 70 | 78 | 110 | 142 |
| D75 | 50 | 54 | 70 | 78 | 110 | 142 |
| HZ | 50 | 54 | 70 | 78 | 110 | 142 |
| TL84 | 50 | 54 | 70 | 78 | 110 | 142 |

| 光源 | Th0 | Th1 | Th2 | Th3 | Th4 | Th5 |
|---|---|---|---|---|---|---|
| A | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| CWF | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D50 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D65 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| D75 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| HZ | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |
| TL84 | 0.2 | 0.2 | 0.2 | 0.76 | 1 | 4 |

<!-- Source EN PDF p.44, block 261 -->

(5) 点击 AWB Simulaton，导入 A、CWF、D50、D65、D75、HZ、TL84 下的 raw 图，查看白点检测准确性。

<!-- Source EN PDF p.44, block 262 -->

(6) 修改 UV 或 XY 域的框，或 YUV 的 TH，使各光源色卡白点检测更准确。

<!-- Source EN PDF p.45, block 263 -->

(7) 点击 Save。

<!-- Source EN PDF p.45, block 264 -->

(8) 重复 (5)～(7)，直到各光源的白点检测合理。

<!-- Source EN PDF p.45, block 265 -->

(9) 注意事项：

<!-- Source EN PDF p.45, block 266 -->

① 调整边界，使白点在框内、非白点在框外（通常无法完全做到）。

<!-- Source EN PDF p.45, block 267 -->

② 黑体轨迹上所有光源的中框区间在 x 方向连续（三种线型代表三种尺寸的框；当前版本没有小框）。

<!-- Source EN PDF p.45, block 268 -->

错误示范：大框区间连续，但中框之间有空隙，如下图箭头。

<!-- Source EN PDF p.45, block 269 -->

![英文原稿图, PDF p.45, #269](/docs/rockchip-isp30-color-optimization/assets/en-p45-figure1.png)

*英文原稿图, PDF p.45, #269.*

<!-- Source EN PDF p.45, block 270 -->

正确示范：

<!-- Source EN PDF p.45, block 271 -->

![英文原稿图, PDF p.45, #271](/docs/rockchip-isp30-color-optimization/assets/en-p45-figure2.png)

*英文原稿图, PDF p.45, #271.*

<!-- Source EN PDF p.45, block 272 -->

③ A、hz 光源在 XY 域 y 方向可更紧凑；d50、d65 的 XY 域 y 方向可放宽。

<!-- Source EN PDF p.45, block 273 -->

④ 色温相近光源的中框、大框区间在 y 方向连续（CWF 和 TL84）。

<!-- Source EN PDF p.45, block 274 -->

⑤ 所有光源在 UV 域围成的区间不得断开。

<!-- Source EN PDF p.45, block 275 -->

⑥ 不同光源边界可以重叠，但不能在 XY 和 UV 空间同时重叠。

<!-- Source EN PDF p.45, block 276 -->

⑦ 参考 XY 空间划分 UV 空间，以排除非白点。

<!-- Source EN PDF p.45, block 277 -->

圈出的 D75 光源第 7 色块落入 hz 范围时，会被识别为白点。

<!-- Source EN PDF p.46, block 278 -->

![英文原稿图, PDF p.46, #278](/docs/rockchip-isp30-color-optimization/assets/en-p46-figure1.png)

*英文原稿图, PDF p.46, #278.*

<!-- Source EN PDF p.46, block 279 -->

重新调整后，D75 光源第 7 色块 B 在 XY 和 UV 空间不属于同一光源，因此不会识别为白点。

<!-- Source EN PDF p.46, block 280 -->

![英文原稿图, PDF p.46, #280](/docs/rockchip-isp30-color-optimization/assets/en-p46-figure2.png)

*英文原稿图, PDF p.46, #280.*

<!-- Source EN PDF p.46, block 281 -->

⑧ 非白点落入 XY 和 UV 白点区间时，还可通过降低 YUV 域的 TH 或增加非白点区间来排除。

<!-- Source EN PDF p.46, block 282 -->

⑨ 白点落入 XY、UV 白点区间，却仍未成为白点，可能是超出亮度范围被排除、落入非白点区间，或因小于 TH 而未落入 YUV 域白点区间。

<!-- Source EN PDF p.46, block 283 -->

#### 2.3.5 AWB 标定参数验证

<!-- Source EN PDF p.46, block 284 -->

依次导入标定图进行白点检测，优先保证较低漏检率，并适当降低误判率。

<!-- Source EN PDF p.46, block 285 -->

最终白点条件：

<!-- Source EN PDF p.47, block 286 -->

![英文原稿图, PDF p.47, #286](/docs/rockchip-isp30-color-optimization/assets/en-p47-figure1.png)

*英文原稿图, PDF p.47, #286.*

<!-- Source EN PDF p.47, block 287 -->

白点测试结果如下：

<!-- Source EN PDF p.47, block 288 -->

A 光源

<!-- Source EN PDF p.47, block 289 -->

![英文原稿图, PDF p.47, #289](/docs/rockchip-isp30-color-optimization/assets/en-p47-figure2.png)

*英文原稿图, PDF p.47, #289.*

<!-- Source EN PDF p.47, block 290 -->

CWF：

<!-- Source EN PDF p.48, block 291 -->

![英文原稿图, PDF p.48, #291](/docs/rockchip-isp30-color-optimization/assets/en-p48-figure1.png)

*英文原稿图, PDF p.48, #291.*

<!-- Source EN PDF p.48, block 292 -->

D50

<!-- Source EN PDF p.48, block 293 -->

![英文原稿图, PDF p.48, #293](/docs/rockchip-isp30-color-optimization/assets/en-p48-figure2.png)

*英文原稿图, PDF p.48, #293.*

<!-- Source EN PDF p.48, block 294 -->

D65

<!-- Source EN PDF p.49, block 295 -->

![英文原稿图, PDF p.49, #295](/docs/rockchip-isp30-color-optimization/assets/en-p49-figure1.png)

*英文原稿图, PDF p.49, #295.*

<!-- Source EN PDF p.49, block 296 -->

D75

<!-- Source EN PDF p.49, block 297 -->

![英文原稿图, PDF p.49, #297](/docs/rockchip-isp30-color-optimization/assets/en-p49-figure2.png)

*英文原稿图, PDF p.49, #297.*

<!-- Source EN PDF p.49, block 298 -->

HZ

<!-- Source EN PDF p.50, block 299 -->

![英文原稿图, PDF p.50, #299](/docs/rockchip-isp30-color-optimization/assets/en-p50-figure1.png)

*英文原稿图, PDF p.50, #299.*

<!-- Source EN PDF p.50, block 300 -->

TL84

<!-- Source EN PDF p.50, block 301 -->

![英文原稿图, PDF p.50, #301](/docs/rockchip-isp30-color-optimization/assets/en-p50-figure2.png)

*英文原稿图, PDF p.50, #301.*

<!-- Source EN PDF p.50, block 302 -->

### 2.4 常见问题定位

<!-- Source EN PDF p.50, block 303 -->

处理白平衡异常时，通常需抓取日志和 raw，分析原因，再通过修改白点条件或策略参数解决。

<!-- Source EN PDF p.50, block 304 -->

##### 2.4.0.1 抓取与分析日志

<!-- Source EN PDF p.50, block 305 -->

调试 AWB 日志使用命令 export persist_camera_engine_log=0x2ff4。

<!-- Source EN PDF p.51, block 306 -->

###### 2.4.0.1.1 A 的解读（原文标题）

<!-- Source EN PDF p.51, block 307 -->

##### 2.4.0.2 AWB 日志解读（以串口或 adb 打印日志为例）

<!-- Source EN PDF p.51, block 308 -->

###### 2.4.0.2.1 (1) 控制与模式日志

<!-- Source EN PDF p.51, block 309 -->

![英文原稿图, PDF p.51, #309](/docs/rockchip-isp30-color-optimization/assets/en-p51-figure1.png)

*英文原稿图, PDF p.51, #309.*

截图可辨正文转录（原截图裁切位置不猜补）：

```text
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:1979: AwbInitV201: (enter)
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:2040: AwbInitV201: (exit)
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:2070: AwbPrepareV201: (enter)
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:2148: hdr_working_mode(0), remosaic_cfg.enable (0)
[AWB]:XCAM INFO (1782) rk_aiq_awb_algo_v201.cpp:2149: AwbPrepareV201: (exit)
[AWB]:XCAM INFO (1782) rk_aiq_awb_itf.cpp:102: ---------------------------------------------frame_id (-1)---------------------------------------------
[AWB]:XCAM DEBUG rk_aiq_awb_algo_v201.cpp:2469: AwbReconfigV201: byPass: 0  mode( 0-manual 1-auto):1
[AWB]:XCAM INFO (1782) rk_aiq_awb_itf.cpp:250: processing awb_gain_algo (1.905082,1.000000,1.000000,1.978512)
[AWB]:XCAM INFO (1782) rk_aiq_awb_itf.cpp:102: ---------------------------------------------frame_id (0)---------------------------------------------
```

<!-- Source EN PDF p.51, block 310 -->

hdr_working_mode 为 0 表示当前为普通模式，否则为 HDR 模式。

<!-- Source EN PDF p.51, block 311 -->

byPass 为 0 表示启用白平衡校正，1 表示不启用。

<!-- Source EN PDF p.51, block 312 -->

mode 为 0 表示当前为手动白平衡模式，1 表示自动白平衡模式。

<!-- Source EN PDF p.51, block 313 -->

frame_id 为帧 ID。

<!-- Source EN PDF p.51, block 314 -->

processing awb_gain_algo 为本模块最终输出的 wbgain。

<!-- Source EN PDF p.51, block 315 -->

###### 2.4.0.2.2 (2) AWB 日志级别 export persist_camera_engine_log=0x2ff2，可用于一般问题定位

<!-- Source EN PDF p.51, block 317 -->

![英文原稿图, PDF p.51, #317](/docs/rockchip-isp30-color-optimization/assets/en-p51-figure2.png)

*英文原稿图, PDF p.51, #317.*

截图可辨正文转录（原截图裁切位置不猜补）：

```text
2: ---------------------------------------------frame_id (1)---------------------------------------------
68: ***1th calculate wbgain***
52: AwbGainClip, Input CCT : 5800.018555, CRI : -0.124677
09: AwbGainClip, Output CCT : 5800.018555, CRI : -0.124677
09: AwbGainAdjust2, Input CCT : 5800.018555, CRI : -0.124677
50: AwbGainAdjust2, Output CCT : 5800.018066, CRI : -0.124677
3:
7: wbgain_s5(after damping)(rggb):(2.146030,1.000000,1.000000,2.072558), awbConverged(0) ,LVValue(6054), WPType(3),df(0.75), frameChoose(0)
0: WPNo(normal,big):(203,208),valid wp number in standard light(187), valid wp number in extra light(0),
2: select white point range type (0-normal xy range,1-big xy range, 3-extra light) : 0, runInterval(0),tolerance(0.000000)
41:
0: processing awb_gain_algo (2.146030,1.000000,1.000000,2.072558)
```

<!-- Source EN PDF p.51, block 318 -->

AwbGainClip 的 Input 和 output 分别为 wbgain 范围限制前后的 CCT、CRI。

<!-- Source EN PDF p.51, block 319 -->

AwbGainAdjust2 的 Input 和 output 分别为色调调整前后的 CCT、CRI。

<!-- Source EN PDF p.51, block 320 -->

wbgain_s5 等于平滑后的 wbgain，通常等于 processing awb_gain_algo；awbConverged 为 0、1 分别表示 AWB 未收敛、已收敛。

<!-- Source EN PDF p.51, block 321 -->

LVValue 为环境亮度。

<!-- Source EN PDF p.51, block 322 -->

WPType 对应策略分区内的区间。

<!-- Source EN PDF p.51, block 323 -->

df 为当前平滑系数 wbGainDampFactor。

<!-- Source EN PDF p.51, block 324 -->

frameChoose 为 0、1、2 分别表示使用短、中、长帧作为 AWB 硬件统计输入。

<!-- Source EN PDF p.51, block 325 -->

WPNo 为中框、大框中的白点数。

<!-- Source EN PDF p.51, block 326 -->

VAILD WP Number in Standard Light 为所有光源的有效白点数。

<!-- Source EN PDF p.51, block 327 -->

Select White Point Range Type 为 0、1 分别表示当前白点统计基于中框、大框。

<!-- Source EN PDF p.51, block 328 -->

runInterval 为运行的帧间隔。

<!-- Source EN PDF p.51, block 329 -->

wbgain 的变化量小于 tolerance 时，不更新 wbgain。

<!-- Source EN PDF p.52, block 330 -->

###### 2.4.0.2.3 (3) AWB 日志级别 export persist_camera_engine_log=0x2ff3，可用于白点条件和策略问题定位

<!-- Source EN PDF p.52, block 332 -->

![英文原稿图, PDF p.52, #332](/docs/rockchip-isp30-color-optimization/assets/en-p52-figure1.png)

*英文原稿图, PDF p.52, #332.*

截图可辨正文转录（原截图裁切位置不猜补）：

```text
tf.cpp:102: ---------------------------------------------frame_id (91)---------------------------------------------
om1.cpp:868: ***91th calculate wbgain***
om2.cpp:352: AwbGainClip, Input CCT : 6534.665527, CRI : -0.122040
p:389: AwbGainClip wb gain clip, because current cri(-0.122040)< upper bound cri(-0.120000)
p:407: AwbGainClip, wbgain_s3 (rggb) (2.319863,1.000000,1.000000,1.746177)
om2.cpp:409: AwbGainClip, Output CCT : 6534.665527, CRI : -0.120000
om2.cpp:609: AwbGainAdjust2, Input CCT : 6534.665527, CRI : -0.120000
p:649: AwbGainAdjust2, wbgain_s4(2.319863,1.000000,1.000000,1.746177)
om2.cpp:650: AwbGainAdjust2, Output CCT : 6534.664551, CRI : -0.120000
p:847: Global CCT:6524.882812,CCRI:-0.119850,valid:1
p:860: ill:D65 prob: 0.923094, CCT:6514.593750, CCRI:-0.121243, valid:1
p:860: ill:D75 prob: 0.076906, CCT:6775.584961, CCRI:-0.131615, valid:1
p:860: ill:A prob: 0.000000, CCT:0.000000, CCRI:0.000000, valid:0
p:860: ill:CWF prob: 0.000000, CCT:4577.164551, CCRI:-0.118429, valid:1
201.cpp:43:
201.cpp:47: wbgain_s5(after damping)(rggb):(2.317371,1.000000,1.000000,1.750428), awbConverged(1) ,LVValue(1498), WPType(3),df(0.90), frameChoose(0)
201.cpp:50: WPNo(normal,big):(12374,12429),valid wp number in standard light(12282), valid wp number in extra light(0),
201.cpp:52: select white point range type (0-normal xy range,1-big xy range, 3-extra light) : 0, runInterval(0),tolerance(0.000000)
p:63: temporalDefaultGain for wbGainType3 (rggb):(1.327034,1.000000,1.000000,3.314321), weight (0.000000)
p:65: wbGainType1 (rggb):(0.000000,0.000000,0.000000,0.000000)
p:67: wbGainType3(rggb):(2.321654,1.000000,1.000000,1.747155)
p:70: wbgain_s1 (mix wbGainType1 and wbGainType3 ) :(2.321654,1.000000,1.000000,1.747155) is updated (1), weight of wbGainType3
p:108: A:
p:112:      stategy_result.gain (rggb):(0.000000,0.000000,0.000000,0.000000)
p:114:      prob_total(0.000000),prob_dis(0.056154),prob_LV(0.142857),prob_WPNO(0.000000)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(0.000000,0.000000) WPNo(0)
p:132:      type1: gain (rg,bg):(0.000000,0.000000) WPNo(0)
p:108: CWF:
p:112:      stategy_result.gain (rggb):(1.846224,1.000000,1.000000,2.610467)
p:114:      prob_total(0.000000),prob_dis(0.148655),prob_LV(0.142857),prob_WPNO(0.000000)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(1.846224,2.610467) WPNo(18)
p:132:      type1: gain (rg,bg):(1.860870,2.614064) WPNo(20)
p:108: D50:
p:112:      stategy_result.gain (rggb):(2.087728,1.000000,1.000000,2.081820)
p:114:      prob_total(0.000000),prob_dis(0.207562),prob_LV(0.142857),prob_WPNO(0.000000)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(2.087728,2.081820) WPNo(74)
p:132:      type1: gain (rg,bg):(2.092266,2.077117) WPNo(78)
p:108: D65:
p:112:      stategy_result.gain (rggb):(2.316112,1.000000,1.000000,1.755642)
p:114:      prob_total(0.923094),prob_dis(0.216764),prob_LV(0.142857),prob_WPNO(0.923058)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(2.316112,1.755642) WPNo(11337)
p:132:      type1: gain (rg,bg):(2.316112,1.755642) WPNo(11337)
p:108: D75:
p:112:      stategy_result.gain (rggb):(2.388181,1.000000,1.000000,1.645277)
p:114:      prob_total(0.076906),prob_dis(0.216654),prob_LV(0.142857),prob_WPNO(0.076942)
p:116:      spatial gain(rggb):(1.883842,1.000000,1.000000,2.821964),statistics gain weigth(1.000000)
p:132:      type0: gain (rg,bg):(2.388181,1.645277) WPNo(945)
p:132:      type1: gain (rg,bg):(2.389237,1.646780) WPNo(994)
p:108: Hz:
```

<!-- Source EN PDF p.52, block 333 -->

从 stat type0: gain 到最终 processing awb_gain_algo 的处理步骤如下：

<!-- Source EN PDF p.52, block 334 -->

type0: gain ==> stategy_result.gain ==> wbGainType1+wbGainType3 ==> wbgain_s1 ==> wbgain_s3（AwbGainClip 后）==> wbgain_s4（AwbGainAdjust，色调调整后）==> wbgain_s5（damp，平滑后）==> processing awb_gain_algo

<!-- Source EN PDF p.52, block 335 -->

①

<!-- Source EN PDF p.52, block 336 -->

![英文原稿图, PDF p.52, #336](/docs/rockchip-isp30-color-optimization/assets/en-p52-figure2.png)

*英文原稿图, PDF p.52, #336.*

截图可辨正文转录（原截图裁切位置不猜补）：

```text
: Global
: CCT:4342.158203,CCRI:0.072367

: ill:A prob: 0.372926
: CCT:3058.074463,CCRI:0.034103

: ill:D50 prob: 0.369272
: CCT:5710.621582,CCRI:0.096392

: ill:TL84 prob: 0.233994
: CCT:4246.391602,CCRI:0.107421

: ill:CWF prob: 0.014538
: CCT:4403.761719,CCRI:-0.060823
```

<!-- Source EN PDF p.52, block 337 -->

该信息用于表征场景色温，仅作辅助信息。Global 为综合色温；ill 列出参与 WBGain 计算的前几个光源的概率和色温。

<!-- Source EN PDF p.52, block 338 -->

② temporalDefaultGain for wbGainType3 和 weight 分别为 wbGainType3 中的 temporalDefaultGain 及其权重。

<!-- Source EN PDF p.52, block 339 -->

③ wbGainTepType1 为 WpType1 计算的 WBGain。

<!-- Source EN PDF p.53, block 340 -->

④ wbGainType3 为 WpType3 计算的 WBGain，wbWeightType3 为其权重（WpType1 权重为 1-wbWeightType3）。

<!-- Source EN PDF p.53, block 341 -->

⑤ wbgain_s1 为 wbGainTepType1 与 wbGainType3 加权的结果，weight 为 wbGainType3 权重。

<!-- Source EN PDF p.53, block 342 -->

⑥ stategy_result.gain 为各光源的 WBGain。

<!-- Source EN PDF p.53, block 343 -->

⑦ prob_total (0.372926)、prob_dis (0.151197)、prob_LV (0.142857)、prob_WPNO (0.383987) 分别标示各光源的总概率、距离概率、亮度概率和白点数量概率。

<!-- Source EN PDF p.53, block 344 -->

⑧ spatial gain (rggb) :(1.745900, 1.000000, 1.000000, 1.824126)、statistics gain weigth (1.000000) 分别表示各光源的 dayGain（策略 WBGain）以及各光源采用统计白点 WBGain 输出的概率；策略 WBGain 的概率为 1 - statistics gain weigth。

<!-- Source EN PDF p.53, block 345 -->

⑨ type0: gain (rg,bg):(1.287584,2.843158) WPNo(7707) 为中框统计的白平衡增益和白点数量。

<!-- Source EN PDF p.53, block 346 -->

⑩ type1: gain (rg,bg):(1.291619,2.862351) WPNo(8557) 为大框统计的白平衡增益和白点数量。

<!-- Source EN PDF p.53, block 347 -->

#### 2.4.1 根据日志定位问题

<!-- Source EN PDF p.53, block 348 -->

① 若 WPNo 较小而实际场景有白点，需重新调整白点条件。

<!-- Source EN PDF p.53, block 349 -->

② 检查各光源的 statistics gain weigth 是否为 1，是否受策略增益影响。

<!-- Source EN PDF p.53, block 350 -->

③ 检查 wbWeightType3 权重是否为 1：

<!-- Source EN PDF p.53, block 351 -->

若场景确实白点较少，但 wbGainType3 可能更符合实际色温，需调整 WP_THL、WP_THH，将当前场景划分到 WpType3。

<!-- Source EN PDF p.53, block 352 -->

其他情况请参考前两点说明调整。

<!-- Source EN PDF p.53, block 353 -->

#### 2.4.2 抓取 RAW 并仿真

<!-- Source EN PDF p.53, block 354 -->

需重新调整白点条件或从 Log 看不出问题时，应抓取 raw 图进行白点检测仿真，查看各光源的白点统计。

<!-- Source EN PDF p.53, block 355 -->

##### 2.4.2.1 (1) 示例 1

<!-- Source EN PDF p.53, block 356 -->

右侧为问题场景，左侧为抓图后重新调整白点条件的效果。

<!-- Source EN PDF p.54, block 357 -->

![英文原稿图, PDF p.54, #357](/docs/rockchip-isp30-color-optimization/assets/en-p54-figure1.png)

*英文原稿图, PDF p.54, #357.*

<!-- Source EN PDF p.54, block 358 -->

操作步骤：

<!-- Source EN PDF p.54, block 359 -->

① 抓取图 1。

<!-- Source EN PDF p.54, block 360 -->

② 打开 RKISPCalibrationTool，导入 json 文件。

<!-- Source EN PDF p.54, block 361 -->

③ 为参考之前标准光源色卡中白块与非白块的分布，需再次通过 Load Raw Files 导入所有标定图，点击 FindChart 完成色卡识别，不要点击 Calibrate；点击 Draw WPC From IQ Param 导入白点条件并显示色卡色块分布。

<!-- Source EN PDF p.54, block 362 -->

![英文原稿图, PDF p.54, #362](/docs/rockchip-isp30-color-optimization/assets/en-p54-figure2.png)

*英文原稿图, PDF p.54, #362.*

<!-- Source EN PDF p.54, block 363 -->

④ 在 AWB Simulation 界面点击 Load Image 导入 raw 图 1，界面同时更新图像和白点检测结果，如下图。

<!-- Source EN PDF p.55, block 364 -->

![英文原稿图, PDF p.55, #364](/docs/rockchip-isp30-color-optimization/assets/en-p55-figure1.png)

*英文原稿图, PDF p.55, #364.*

<!-- Source EN PDF p.55, block 365 -->

可见识别出的白点很少，图像也确实偏暗。下图圈出的类似灰色区域应识别为白点。

<!-- Source EN PDF p.55, block 366 -->

![英文原稿图, PDF p.55, #366](/docs/rockchip-isp30-color-optimization/assets/en-p55-figure2.png)

*英文原稿图, PDF p.55, #366.*

<!-- Source EN PDF p.55, block 367 -->

⑤ 点击图像中的灰色区域。

<!-- Source EN PDF p.55, block 368 -->

检查映射点是否位于 XY、UV 白点区间；若不是，调整白点条件，使其落入区间。

<!-- Source EN PDF p.55, block 369 -->

AWB Simulaton 还显示该点 R G B 和 Y 值，需与 JSON 的 limitRange 比较是否越界。若越界，可适当放宽 limit Range。特别暗或特别亮的点受噪声或某通道饱和影响，其 Rgain、Bgain 会偏离实际值，因此范围需要权衡。

<!-- Source EN PDF p.55, block 370 -->

若点位于 limitRange 和 XY、UV 白点区间内却未识别为白点，需检查 YUV 的 TH。后续 AWB Simulaton 界面也会显示该点 th，可参考界面数值调整 YUV 的 TH。

<!-- Source EN PDF p.56, block 371 -->

⑥ 调整后，在 AWB 界面点击 Save，再在 AWB Simulation 界面点击 Run Simlation 重新仿真。

<!-- Source EN PDF p.56, block 372 -->

修改 XY、UV 白点区间后，白点检测如下，白平衡异常得到解决。

<!-- Source EN PDF p.56, block 373 -->

![英文原稿图, PDF p.56, #373](/docs/rockchip-isp30-color-optimization/assets/en-p56-figure1.png)

*英文原稿图, PDF p.56, #373.*

<!-- Source EN PDF p.56, block 374 -->

##### 2.4.2.2 (2) 示例 2（仿真工具界面升级）

<!-- Source EN PDF p.56, block 375 -->

###### 2.4.2.2.1 a. 在线获取 RAW（暂不支持）

<!-- Source EN PDF p.56, block 376 -->

工具连接板端后，可点击 Get online Image 获取在线图像并自动更新界面仿真结果，相比示例 1 简化调试。其他调试步骤参见示例 1 的 ④⑤⑥。

<!-- Source EN PDF p.57, block 377 -->

![英文原稿图, PDF p.57, #377](/docs/rockchip-isp30-color-optimization/assets/en-p57-figure1.png)

*英文原稿图, PDF p.57, #377.*

<!-- Source EN PDF p.57, block 378 -->

注意：在线图保存在工具根目录，后缀为 .dat2，例如 awbinput_rgb_w2880_h1616_ds1_fr1453492.dat2。本界面的 Load Image 也支持导入该格式。

<!-- Source EN PDF p.57, block 379 -->

###### 2.4.2.2.2 b. 查看中框、大框白点及附加框、排除框中的点

<!-- Source EN PDF p.57, block 381 -->

通过界面相应按钮，可查看中框白点、大框白点、附加框和排除框中的点。原稿此处保留了未渲染图片标记：! [image-20230201154517001] (Rockchip_color_optimization_guide_isp2x_pngimage-20230201154517001.png)。

<!-- Source EN PDF p.57, block 382 -->

###### 2.4.2.2.3 c. 计算总 WBGAIN

<!-- Source EN PDF p.57, block 383 -->

原稿中的未渲染图片标记：! [image-20230201155238824] (Rockchip_color_optimization_guide_isp2x_pngimage-20230201155238824.png)。

<!-- Source EN PDF p.57, block 384 -->

最终 WBGAIN 基于各光源白点加权计算，与实际算法不同，因为实际算法还包含其他策略部分。原文所指图中，中框白点数 38125、wbgain 为 (1.549, 1.665)，大框白点数 38742、wbgain 为 (1.548, 1.666)。

<!-- Source EN PDF p.57, block 385 -->

可编辑红色部分改变权重；修改 WP Number 后，右侧 prob 自动更新，Statistics 行对应数据也随之更新。

<!-- Source EN PDF p.57, block 386 -->

###### 2.4.2.2.4 d. 离线仿真 BLC-LSC-WB-CCM-GAMMA 效果

<!-- Source EN PDF p.57, block 387 -->

该功能可查看不同 WBgain 的效果，辅助 AWB 调试；查看应用不同光源 LSC 的效果，辅助 LSC 调试；也可检查 RAW 图是否异常等。

<!-- Source EN PDF p.58, block 388 -->

![英文原稿图, PDF p.58, #388](/docs/rockchip-isp30-color-optimization/assets/en-p58-figure1.png)

*英文原稿图, PDF p.58, #388.*

<!-- Source EN PDF p.58, block 389 -->

点击 Run Simulator2 获得 blc-lsc-wb-ccm-gamma 效果。应用的 BLC、LSC、CCM、Gamma 数据来自 JSON，并打印在标定界面的日志窗口。

<!-- Source EN PDF p.59, block 390 -->

![英文原稿图, PDF p.59, #390](/docs/rockchip-isp30-color-optimization/assets/en-p59-figure1.png)

*英文原稿图, PDF p.59, #390.*

截图可辨正文转录（原截图裁切位置不猜补）：

```text
Width: 2560
Height: 1440
Bits: 10 bit
Bayer: BGGR
->Info: Load JsonIQ normal: day
->INFO: load
sc4336_OT01_40IRC_F16.json
successfully.
->INFO(AWB): init uv/xy wpc ok.
->INFO(AWB): use D65 CCM parameter.
->INFO(AWB): ccmMatrix:1.3683,-0.3732
,0.0049
->INFO(LSC): Raw Image loaded
successfully.
->Info: Load JsonIQ normal: day
->INFO: load
sc4336_OT01_40IRC_F16.json
successfully.
->INFO(AWB): init uv/xy wpc ok.
->INFO(AWB): use TL84 CCM parameter.
->INFO(AWB): ccmMatrix:1.2447,-0.2877
,0.0429
->INFO(AWB): Raw Image loaded
successfully.
->INFO(AWB): Load
rkisp_sc4336_D75_2560_1440_10bpp_1.80x
_0.0400s_normal_normL_single_104803899
.raw successfully
->INFO(AWB): BlcValue(12bit)= 254 ,254
,254 ,254
->INFO(AWB): D75 use D50 LSC
parameter.
->INFO(AWB): R:2246 ,1970 ,1760 ,1607
->INFO(AWB): Gr:2211 ,1901 ,1702 ,1578
->INFO(AWB): Gb:2264 ,1942 ,1757 ,1626
->INFO(AWB): B:2197 ,1979 ,1747 ,1625
->INFO(AWB): D75 use A CCM parameter.
->INFO(AWB): ccmMatrix:1.2380,-0.7220
,0.4840
```

<!-- Source EN PDF p.59, block 391 -->

应用的 wbgain 来自中框，可直接编辑 wbgain，再点击 Run Simulator2 更新仿真结果。

<!-- Source EN PDF p.59, block 392 -->

##### 2.4.2.3 (3) 示例 3（YUV TH 调整示意）

<!-- Source EN PDF p.59, block 393 -->

本例检查白点漏检是否由 yuv th 配置不当导致，步骤如下：

<!-- Source EN PDF p.59, block 394 -->

a. 根据该点在 XY、UV 域所处的光源区间，确定当前光源。

<!-- Source EN PDF p.59, block 395 -->

b. 在 AWB Simulator 中检查对应光源行的 distance 是否大于 TH；若是：

<!-- Source EN PDF p.60, block 396 -->

检查该光源行哪些列对应 YUV 条件的 U，并增大对应列的 th。

<!-- Source EN PDF p.60, block 397 -->

具体操作如下：

<!-- Source EN PDF p.60, block 398 -->

如下图，色卡第 22 色块未完全识别为白点。分析表明，此时 D65 光源下 distance > th（0.3125>0.1875）导致该问题。

<!-- Source EN PDF p.60, block 399 -->

![英文原稿图, PDF p.60, #399](/docs/rockchip-isp30-color-optimization/assets/en-p60-figure1.png)

*英文原稿图, PDF p.60, #399.*

<!-- Source EN PDF p.60, block 400 -->

该点在 D65 下映射为 u 60，位于 u1(54) 和 u2(70) 之间，因此可按下图调整对应 th1、th2 阈值，并根据白点检测结果判断修改方向。

<!-- Source EN PDF p.60, block 401 -->

![英文原稿图, PDF p.60, #401](/docs/rockchip-isp30-color-optimization/assets/en-p60-figure2.png)

*英文原稿图, PDF p.60, #401.*

<!-- Source EN PDF p.60, block 402 -->

注意：

<!-- Source EN PDF p.60, block 403 -->

使用 yuv th 去除非白点的步骤类似，只是此时减小阈值，同时确保不影响白点识别。

<!-- Source EN PDF p.60, block 404 -->

#### 2.4.3 特殊问题示例

<!-- Source EN PDF p.60, block 405 -->

(1) 网络摄像头应用将白平衡设为自然光模式，导致自动白平衡未开启。

<!-- Source EN PDF p.60, block 406 -->

查看日志发现当前 mode=1，原文称其为手动模式。

<!-- Source EN PDF p.60, block 407 -->

![英文原稿图, PDF p.60, #407](/docs/rockchip-isp30-color-optimization/assets/en-p60-figure3.png)

*英文原稿图, PDF p.60, #407.*

截图可辨正文转录（原截图裁切位置不猜补）：

```text
[09:51:39.57935][AWB]:XCAM DEBUG rk_aiq_awb_algo_v200.cpp:2795: AwbReConfigV200: byPass: 0  mode:1
```

<!-- Source EN PDF p.60, block 408 -->

修改白平衡模式后解决该问题。

<!-- Source EN PDF p.61, block 409 -->

(2) 标定时发现 HZ、A 光源下白点分布不集中。

<!-- Source EN PDF p.61, block 410 -->

![英文原稿图, PDF p.61, #410](/docs/rockchip-isp30-color-optimization/assets/en-p61-figure1.png)

*英文原稿图, PDF p.61, #410.*

<!-- Source EN PDF p.61, block 411 -->

实际效果如下，白平衡不正确。

<!-- Source EN PDF p.61, block 412 -->

![英文原稿图, PDF p.61, #412](/docs/rockchip-isp30-color-optimization/assets/en-p61-figure2.png)

*英文原稿图, PDF p.61, #412.*

<!-- Source EN PDF p.61, block 413 -->

后续测试发现红外滤镜不合格，未截止近红外波段；更换红外滤镜后解决。

<!-- Source EN PDF p.61, block 414 -->

(3) CC 模块光源估计来回振荡，引起色彩振荡。

<!-- Source EN PDF p.61, block 415 -->

![英文原稿图, PDF p.61, #415](/docs/rockchip-isp30-color-optimization/assets/en-p61-figure3.png)

*英文原稿图, PDF p.61, #415.*

截图可辨正文转录（原截图裁切位置不猜补）：

```text
Find result - 143 hits
Line 5698: [00:02:57.712232][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50(2)
Line 5699: [00:02:57.712232][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50(2)
Line 5809: [00:02:57.811349][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50(2)
Line 5810: [00:02:57.811349][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.262492,0.988665, estimation illuminant is D50(2)
Line 5920: [00:02:58.561261][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50(2)
Line 5921: [00:02:58.561261][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50(2)
Line 6031: [00:02:58.155059][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50(2)
Line 6032: [00:02:58.155059][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.267507,0.983502, estimation illuminant is D50(2)
Line 6142: [00:02:58.366345][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6143: [00:02:58.366345][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6253: [00:02:58.465620][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6254: [00:02:58.465620][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6364: [00:02:58.577856][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6365: [00:02:58.577856][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.271833,0.979029, estimation illuminant is D50(2)
Line 6475: [00:02:58.776105][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.275650,0.975244, estimation illuminant is D65(3)
Line 6476: [00:02:58.776105][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.275650,0.975244, estimation illuminant is D65(3)
Line 6586: [00:02:58.987769][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65(3)
Line 6587: [00:02:58.987769][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65(3)
Line 6697: [00:02:59.85831][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65(3)
Line 6698: [00:02:59.85831][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.279142,0.971930, estimation illuminant is D65(3)
Line 6808: [00:02:59.296966][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 6809: [00:02:59.296966][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 6919: [00:02:59.409406][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 6920: [00:02:59.409406][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 7030: [00:02:59.522048][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 7031: [00:02:59.522048][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.282218,0.968997, estimation illuminant is D65(3)
Line 7141: [00:02:59.719781][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.285019,0.966382, estimation illuminant is D65(3)
Line 7142: [00:02:59.719781][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.285019,0.966382, estimation illuminant is D65(3)
Line 7252: [00:02:59.945211][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.287606,0.963857, estimation illuminant is D65(3)
Line 7253: [00:02:59.945211][ACCM]:XCAM DEBUG rk_aiq_accm_algo.cpp:56: wbGain:1.287606,0.963857, estimation illuminant is D65(3)
```

<!-- Source EN PDF p.61, block 416 -->

增大 JSON tolerance 节点的 value；当 wbgain 变化小于该值时不更新，以提高稳定性。本例将 XML 参数改为下图值。

<!-- Source EN PDF p.62, block 417 -->

```text
<tolerance index="1" type="struct" size="[1 1]">
    <LV index="1" type="double" size="[1 4]">
        [0 64 128 256.0000 ]
    </LV>
    <value index="1" type="double" size="[1 4]">
        [0.05 0.05 0.05 0.05 ]
    </value>
</tolerance>
```

<!-- Source EN PDF p.62, block 418 -->

## 3 基础色彩调整 CCM

<!-- Source EN PDF p.62, block 419 -->

### 3.1 功能说明

<!-- Source EN PDF p.62, block 420 -->

传感器光谱分布函数难以完全匹配人眼视觉响应函数，因此通过色彩校正矩阵 CCM 校正光谱响应的交叉影响与响应强度，使前端采集图像的色彩与人眼视觉一致。

<!-- Source EN PDF p.62, block 421 -->

CCM 标定工具支持基于 24 色卡预标定 3×3 CCM (aij)。

<!-- Source EN PDF p.62, block 422 -->

![英文原稿图, PDF p.62, #422](/docs/rockchip-isp30-color-optimization/assets/en-p62-figure1.png)

*英文原稿图, PDF p.62, #422.*

```text
[R_CC, G_CC, B_CC]^T = [[a11,a12,a13],[a21,a22,a23],[a31,a32,a33]] * [R_camera,G_camera,B_camera]^T
```

<!-- Source EN PDF p.62, block 423 -->

支持不同色温的多组 CCM。ISP 运行时，根据 IQ 参数配置的 gain 节点调整全局或局部饱和度，实现 CCM 矩阵系数动态调整。

<!-- Source EN PDF p.62, block 424 -->

![英文原稿图, PDF p.62, #424](/docs/rockchip-isp30-color-optimization/assets/en-p62-figure2.png)

*英文原稿图, PDF p.62, #424.*

```text
[R_CC,G_CC,B_CC]^T = alpha * scale * [[a11-1,a12,a13],[a21,a22-1,a23],[a31,a32,a33-1]] * [R_camera,G_camera,B_camera]^T + [R_camera,G_camera,B_camera]^T
```

<!-- Source EN PDF p.62, block 425 -->

### 3.2 主要参数

<!-- Source EN PDF p.62, block 426 -->

ISP 参数位于 IQ json 文件的 ccm_calib 节点；json 参数仅在自动模式生效。

<!-- Source EN PDF p.62, block 427 -->

#### 3.2.1 使能控制与模式选择

<!-- Source EN PDF p.62, block 428 -->

位于 control 节点。

<!-- Source EN PDF p.63, block 429 -->

| 参数 | 说明 |
|---|---|
| enable | 色彩校正开关，0 或 1；1 启用。 |
| wbgain_tolerance | 色彩校正对白平衡增益变化的容差。统计增益差小于阈值时，认为满足稳定条件；范围 0.0-1，建议 0.3。 |
| gain_tolerance | 色彩校正对曝光增益变化的容差。统计曝光增益差小于阈值时，认为满足稳定条件；范围 0.0-1，建议 0.5。 |

<!-- Source EN PDF p.63, block 430 -->

#### 3.2.2 亮度与饱和度调整

<!-- Source EN PDF p.63, block 431 -->

位于 lumaCCM 节点。

<!-- Source EN PDF p.63, block 432 -->

##### 3.2.2.1 与像素亮度相关的饱和度调整

<!-- Source EN PDF p.63, block 433 -->

可调整指定 Y 区间内像素的色彩校正强度。

<!-- Source EN PDF p.63, block 434 -->

| 参数 | 说明 |
|---|---|
| RGB2Y_para | RGB 转 Y 系数，7 位定点数；整数范围 [0,128]，可调整。 |
| low_bound_pos_bit | 像素亮度 Y 与色彩校正 CC 强度的亮度阈值，整数范围 [0,10]。 |
| y_alpha_curve | 像素亮度 Y 对应的校正强度 alpha。1024 表示 1 倍强度，0 表示不校正；整数范围 [0,1024]。 |

<!-- Source EN PDF p.63, block 435 -->

![英文原稿图, PDF p.63, #435](/docs/rockchip-isp30-color-optimization/assets/en-p63-figure1.png)

*英文原稿图, PDF p.63, #435.*

<!-- Source EN PDF p.64, block 436 -->

图：Y-CcAlpha。

<!-- Source EN PDF p.64, block 437 -->

##### 3.2.2.2 全局饱和度调整

<!-- Source EN PDF p.64, block 438 -->

位于 gain_alphaScale_curve 节点。

<!-- Source EN PDF p.64, block 439 -->

不同曝光增益对应不同校正强度比例，对应 gain_alphaScale_curve 节点下的参数。

<!-- Source EN PDF p.64, block 440 -->

| 参数 | 说明 |
|---|---|
| gain | gain-scale 的曝光增益分量，小数，大于 0。 |
| scale | gain-scale 的校正强度分量，小数，范围 [0,1]。 |

<!-- Source EN PDF p.64, block 441 -->

#### 3.2.3 自动 CCM 参数

<!-- Source EN PDF p.64, block 442 -->

位于 TuningPara 节点。

<!-- Source EN PDF p.64, block 443 -->

| 参数 | 说明 |
|---|---|
| damp_enable | CCM 平滑功能开关，0 或 1；1 使用此功能。 |

<!-- Source EN PDF p.64, block 444 -->

##### 3.2.3.1 CCM 矩阵计算方法选择

<!-- Source EN PDF p.64, block 445 -->

CCM 模块有两种矩阵计算方法：(1) 选择标准白平衡增益与白平衡增益统计值欧氏距离最小的光源的 CCM 参数；(2) 将各光源标准白平衡增益与统计值之间的距离概率作为权重，加权计算 CCM 矩阵。各光源距离概率 prob 计算如下：

![原稿距离概率矢量公式](/docs/rockchip-isp30-color-optimization/assets/en-p64-vector-formulas.png)

```text
dist = sqrt((Rgain-awbGain[0])^2 * wr + (Bgain-awbGain[1])^2 * wb)
prob = exp(-dist^2 / sigma^2)
```

<!-- Source EN PDF p.64, block 446 -->

其中 Rgain、Bgain 为白平衡增益统计值，awbGain 为各光源标准白平衡增益，wr、wb 为 R、B 通道权重，sigma 为所有光源 dist 的标准差。

<!-- Source EN PDF p.64, block 447 -->

位于 illu_estim 节点。

<!-- Source EN PDF p.64, block 448 -->

| 参数 | 说明 |
|---|---|
| interp_enable | CCM 加权计算开关，0 或 1；1 启用。 |

<!-- Source EN PDF p.65, block 449 -->

##### 3.2.3.2 CCM 矩阵加权计算

<!-- Source EN PDF p.65, block 450 -->

位于 illu_estim 节点。

<!-- Source EN PDF p.65, block 451 -->

| 参数 | 说明 |
|---|---|
| default_illu | 默认光源名称。各光源距离概率相同时，使用默认光源 CCM 参数。 |
| weightRB | 使用的 R(G)gain 通道权重（原文写作 R(G)）。 |
| prob_limit | 距离概率下限。小于此值的光源不参与 CCM 矩阵计算。 |
| frame_no | 平滑帧数。取 frame_no 帧的距离概率平均值进行 CCM 加权计算。 |

<!-- Source EN PDF p.65, block 452 -->

##### 3.2.3.3 CCM 选择控制参数

<!-- Source EN PDF p.65, block 453 -->

根据白平衡增益自动选择对应光源参数；同一光源下可配置不同曝光增益 gain 对应不同饱和度 sat 的 CCM。

<!-- Source EN PDF p.65, block 454 -->

位于 aCcmCof 节点。

<!-- Source EN PDF p.65, block 455 -->

| 参数 | 说明 |
|---|---|
| name | 光源名称。 |
| awbGain | 光源对应的标准白平衡增益，由标定工具生成，大于 0。 |
| minDist | 该光源白平衡增益距离阈值，由标定工具生成，用于计算距离概率。dist 小于此值时，将该光源 prob 设为 1。 |
| matrixUsed | CCM。 |
| gains | gains-sat 的曝光增益分量，小数，大于 0。 |
| sat | gains-sat 的饱和度分量，小数，大于 0。 |

<!-- Source EN PDF p.66, block 456 -->

##### 3.2.3.4 CCM 参数

<!-- Source EN PDF p.66, block 457 -->

| 参数 | 说明 |
|---|---|
| Name | CCM 名称。 |
| illumination | 光源名称。 |
| saturation | 对应饱和度，由标定工具生成，大于等于 0。 |
| ccMatrix | 色彩校正矩阵，由标定工具生成；小数，范围 [-8,7.992]。 |
| ccOffsets | RGB 分量偏移，由标定工具生成，范围 [-4096,4095]。 |

<!-- Source EN PDF p.66, block 458 -->

### 3.3 CCM 标定

<!-- Source EN PDF p.66, block 459 -->

按 Rockchip_IQ_Tools_Guide_ISP2x_CN 完成 CCM 标定。

<!-- Source EN PDF p.66, block 460 -->

#### 3.3.1 RAW 数据采集

<!-- Source EN PDF p.66, block 461 -->

##### 3.3.1.1 标定光源选择

<!-- Source EN PDF p.66, block 462 -->

七种不同色温光源：D50、D65、D75、A、CWF、HZ、TL84。

<!-- Source EN PDF p.66, block 463 -->

##### 3.3.1.2 采集步骤

<!-- Source EN PDF p.66, block 464 -->

步骤 1：将色卡放在灯箱背景墙中央，确保左右光照均匀。项目对色彩要求较高时，可在旁边放置相应颜色目标（如肤色卡），便于确认效果。

<!-- Source EN PDF p.66, block 465 -->

步骤 2：调整曝光，使应用 gamma 后每个色块均不过曝，建议自动曝光。

<!-- Source EN PDF p.66, block 466 -->

步骤 3：拍摄时调整物距，使色卡占画面 1/9。

<!-- Source EN PDF p.66, block 467 -->

#### 3.3.2 标定

<!-- Source EN PDF p.66, block 468 -->

##### 3.3.2.1 步骤

<!-- Source EN PDF p.66, block 469 -->

步骤 1：RAW 导入及 24 色区域选择，参见 Rockchip_IQ_Tools_Guide_ISP2x_CN 第 4.5 节 CCM Calibration。

<!-- Source EN PDF p.66, block 470 -->

步骤 2：配置标定参数。

<!-- Source EN PDF p.66, block 471 -->

(1) 设置 gamma：选择摄像头将使用的 gamma 曲线。支持 Normal、HDR、Night 模式及自定义。

<!-- Source EN PDF p.67, block 472 -->

(2) 设置色块权重：在 6×4 表格中配置权重，色块位置与表格位置对应。

<!-- Source EN PDF p.67, block 473 -->

(3) 点击 Calibrate 标定并获得 CCM。可在 Calibration 页面手动调整 Saturation，直到 Result 的校正效果或色差图符合要求。

<!-- Source EN PDF p.67, block 474 -->

##### 3.3.2.2 色差图说明

<!-- Source EN PDF p.67, block 475 -->

根据色差图中相对标准色块的偏移方向和距离，分析异常分量：

<!-- Source EN PDF p.67, block 476 -->

(1) 摄像头色块距原点比理想色块更远，则摄像头饱和度高于理想值。

<!-- Source EN PDF p.67, block 477 -->

(2) 摄像头色块距原点比理想色块更近，则摄像头饱和度低于理想值。

<!-- Source EN PDF p.67, block 478 -->

示例图：

<!-- Source EN PDF p.67, block 479 -->

![英文原稿图, PDF p.67, #479](/docs/rockchip-isp30-color-optimization/assets/en-p67-figure1.png)

*英文原稿图, PDF p.67, #479.*

<!-- Source EN PDF p.67, block 480 -->

第 15 色块（红色）和第 14 色块（绿色）的摄像头饱和度低于 IDEA，但偏差相对较小。

<!-- Source EN PDF p.67, block 481 -->

第 13 色块（蓝色）偏紫，人眼也可能将第 13 色块感知为紫色，因此该偏差可接受。

<!-- Source EN PDF p.67, block 482 -->

通常需确保第 13–15 色块偏差不过大，它们近似代表三原色，其他颜色可由这三色叠加得到。

<!-- Source EN PDF p.67, block 483 -->

若第 13–15 色块或其他重点色块偏色，可增加对应权重，但需注意对其他色块偏色的影响。

<!-- Source EN PDF p.68, block 484 -->

##### 3.3.2.3 注意事项

<!-- Source EN PDF p.68, block 485 -->

(1) 识别 24 色区域时，不要选入各色块的黑色边框。

<!-- Source EN PDF p.68, block 486 -->

(2) 调整 gamma 曲线后可能需重新标定 CCM，因此最好先调整 gamma。

<!-- Source EN PDF p.68, block 487 -->

(3) 标定图亮度不合适会影响所标定 CCM 的饱和度特性：过亮 RAW 标定的 CCM 饱和度低，过暗 RAW 标定的 CCM 饱和度高。

<!-- Source EN PDF p.68, block 488 -->

(4) 建议的客观指标如下，但可因项目而异，不应只关注这些指标。

<!-- Source EN PDF p.68, block 489 -->

![英文原稿图, PDF p.68, #489](/docs/rockchip-isp30-color-optimization/assets/en-p68-figure1.png)

*英文原稿图, PDF p.68, #489.*

| 光源与用途 | 指标 | 原文建议 |
|---|---|---|
| D65 （外部） | 色彩饱和度 | 110-120% |
| D65 （外部） | mean(ΔC) | &lt;10 |
| D65 （外部） | max(ΔC) | &lt;20 |
| D65 （外部） | mean(ΔE) | &lt;15 |
| TL84 （仅内部） | 色彩饱和度 | 110-120% |
| TL84 （仅内部） | mean(ΔC) | &lt;10 |
| TL84 （仅内部） | max(ΔC) | &lt;20 |
| TL84 （仅内部） | mean(ΔE) | &lt;12 |
| Coolwhite （仅内部） | 色彩饱和度 | 110-125% |
| Coolwhite （仅内部） | mean(ΔC) | &lt;10 |
| Coolwhite （仅内部） | max(ΔC) | &lt;20 |
| Coolwhite （仅内部） | mean(ΔE) | &lt;12 |
| A （仅内部） | 色彩饱和度 | 110-120% |
| A （仅内部） | mean(ΔC) | &lt;10 |
| A （仅内部） | max(ΔC) | &lt;22 |
| A （仅内部） | mean(ΔE) | &lt;12 |

<!-- Source EN PDF p.68, block 490 -->

### 3.4 色彩调整

<!-- Source EN PDF p.68, block 491 -->

#### 3.4.1 整体色彩饱和度调整

<!-- Source EN PDF p.68, block 492 -->

##### 3.4.1.1 调整 gain_alphaScale_curve 参数

<!-- Source EN PDF p.68, block 493 -->

可在 [0, 1.0] 范围适当调整 scale，影响最终色彩校正强度。scale 越小，色彩饱和度越低；反之升高。

<!-- Source EN PDF p.68, block 494 -->

##### 3.4.1.2 调整 gains-sat

<!-- Source EN PDF p.68, block 495 -->

SAT 越小，色彩饱和度越低；反之升高。不同光源可使用不同参数。

<!-- Source EN PDF p.68, block 496 -->

##### 3.4.1.3 增加高饱和度 CCM

<!-- Source EN PDF p.68, block 497 -->

前两项调至最大值后饱和度仍不足时，需重新标定更高饱和度的 CCM，并将 gains-sat 的最大 sat 改为增加后的饱和度。

<!-- Source EN PDF p.69, block 498 -->

##### 3.4.1.4 降低暗像素色彩饱和度

<!-- Source EN PDF p.69, block 499 -->

减小 y_alpha_curve 的值可降低暗像素饱和度；最后一个值需为 1024，否则会影响图像中其他亮度的色彩饱和度。

<!-- Source EN PDF p.69, block 500 -->

#### 3.4.2 部分颜色调整

<!-- Source EN PDF p.69, block 501 -->

完成整体饱和度调整后，色彩仍未达到预期，可尝试以下步骤：

<!-- Source EN PDF p.69, block 502 -->

(1) 要使颜色符合人眼视觉，先确认白平衡正确。

<!-- Source EN PDF p.69, block 503 -->

(2) 要使颜色与对比机一致，先确认白平衡一致。

<!-- Source EN PDF p.69, block 504 -->

(3) 要使颜色与对比机一致，还需确认亮度接近。

<!-- Source EN PDF p.69, block 505 -->

(4) 确认白平衡一致或正确、亮度接近后，色彩仍不符合预期，再调整 CCM 相关参数。

<!-- Source EN PDF p.69, block 506 -->

##### 3.4.2.1 确认白平衡正确

<!-- Source EN PDF p.69, block 507 -->

重点：白色物体是否偏色。

<!-- Source EN PDF p.69, block 508 -->

方法：

<!-- Source EN PDF p.69, block 509 -->

目视检查视频中的白色物体是否为白色。

<!-- Source EN PDF p.69, block 510 -->

抓图检查白块 R/G/B 分量是否差异较大。

<!-- Source EN PDF p.69, block 511 -->

##### 3.4.2.2 确认与对比机白平衡一致并调整

<!-- Source EN PDF p.69, block 512 -->

(1) 若对比机白平衡正确，而 RK 白色物体偏色明显，先通过白平衡模块校正。

<!-- Source EN PDF p.69, block 513 -->

(2) 若对比机白色物体偏色明显，而 RK 白平衡较正确，需区分是对比机白平衡算法缺陷还是色调偏好不同。色调偏好不同，可先通过白平衡模块调整使二者一致，或用 faststone 等工具将对比机色调调整至 RK；若为算法缺陷，可增加场景白点重新抓图，或用 faststone 等工具将对比机色调调整至 RK。

<!-- Source EN PDF p.69, block 514 -->

(3) 如何区分对比机白色物体偏色源于算法缺陷还是色彩偏好：

<!-- Source EN PDF p.69, block 515 -->

a. 若场景只有白色物体且亮度合适，对比机仍有偏色，多半是进行了色调调整。

<!-- Source EN PDF p.69, block 516 -->

b. 否则属于对比机算法缺陷。

<!-- Source EN PDF p.70, block 517 -->

##### 3.4.2.3 将亮度调整至与对比机一致

<!-- Source EN PDF p.70, block 518 -->

(1) 调整亮度相关模块 AE、Gamma、Dehaze、HDR，使亮度接近，允许一定差异。

<!-- Source EN PDF p.70, block 519 -->

(2) 或用 faststone 等工具将对比机亮度调整至 RK。

<!-- Source EN PDF p.70, block 520 -->

#### 3.4.3 调整 CCM

<!-- Source EN PDF p.70, block 521 -->

##### 3.4.3.1 使用工具重新标定 CCM

<!-- Source EN PDF p.70, block 522 -->

在 24 色卡中找到最接近目标颜色的色块，增大其权重后重新标定 CCM。

<!-- Source EN PDF p.70, block 523 -->

示例：

<!-- Source EN PDF p.70, block 524 -->

下图左侧色差图中，第 6、18 色块偏色较大。可将中性色块 19–24 的权重设为 0，第 6 色块设为 16，第 18 色块设为 8。为减少对其他色块的影响，三原色色块 13–15 权重设为 8，肤色色块 2 权重也设为 8。得到右侧色差图，第 6、18 色块偏色减小。

<!-- Source EN PDF p.70, block 526 -->

![英文原稿图, PDF p.70, #526](/docs/rockchip-isp30-color-optimization/assets/en-p70-figure1.png)

*英文原稿图, PDF p.70, #526.*

<!-- Source EN PDF p.70, block 527 -->

![英文原稿图, PDF p.70, #527](/docs/rockchip-isp30-color-optimization/assets/en-p70-figure2.png)

*英文原稿图, PDF p.70, #527.*

<!-- Source EN PDF p.70, block 528 -->

##### 3.4.3.2 手动调整 CCM

<!-- Source EN PDF p.70, block 529 -->

###### 3.4.3.2.1 获取 RK RGB 值

<!-- Source EN PDF p.70, block 530 -->

使用 RK 设备抓图，获取 RK RGB 值。

<!-- Source EN PDF p.70, block 531 -->

###### 3.4.3.2.2 获取目标 RGB 值

<!-- Source EN PDF p.70, block 532 -->

(1) 有对比机时。

<!-- Source EN PDF p.70, block 533 -->

使用对比机抓图获得目标值，但应使亮度、白平衡与 RK 接近。

<!-- Source EN PDF p.71, block 534 -->

(2) 没有对比机时。

<!-- Source EN PDF p.71, block 535 -->

使用 faststone 等工具调整 RK 抓图中关注的颜色，直到符合预期。

<!-- Source EN PDF p.71, block 536 -->

![英文原稿图, PDF p.71, #536](/docs/rockchip-isp30-color-optimization/assets/en-p71-figure1.png)

*英文原稿图, PDF p.71, #536.*

<!-- Source EN PDF p.71, block 537 -->

![英文原稿图, PDF p.71, #537](/docs/rockchip-isp30-color-optimization/assets/en-p71-figure2.png)

*英文原稿图, PDF p.71, #537.*

<!-- Source EN PDF p.71, block 538 -->

例如，将调整后的 B 分量作为目标值：使用 fastone 将 B 通道减小 17，右下角绿色即预期颜色。

<!-- Source EN PDF p.71, block 539 -->

![英文原稿图, PDF p.71, #539](/docs/rockchip-isp30-color-optimization/assets/en-p71-figure3.png)

*英文原稿图, PDF p.71, #539.*

<!-- Source EN PDF p.71, block 540 -->

此时 RK 绿色 RGB 为 64 85 90，目标为 65 86 69，因此应调整 CCM 降低 B 分量，使两种绿色接近。

<!-- Source EN PDF p.71, block 541 -->

(3) 24 色卡对应人眼视觉的目标值如下：

<!-- Source EN PDF p.72, block 542 -->

![英文原稿图, PDF p.72, #542](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure1.png)

*英文原稿图, PDF p.72, #542.*

| 编号 | 色块 | sRGB R | G | B | CIE L* | a* | b* | 孟塞尔色相 | 明度 / 彩度 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 深肤色 | 115 | 82 | 68 | 37.986 | 13.555 | 14.059 | 3 YR | 3.7 / 3.2 |
| 2 | 浅肤色 | 194 | 150 | 130 | 65.711 | 18.13 | 17.81 | 2.2 YR | 6.47 / 4.1 |
| 3 | 蓝天 | 98 | 122 | 157 | 49.927 | -4.88 | -21.925 | 4.3 PB | 4.95 / 5.5 |
| 4 | 叶色 | 87 | 108 | 67 | 43.139 | -13.095 | 21.905 | 6.7 GY | 4.2 / 4.1 |
| 5 | 蓝花 | 133 | 128 | 177 | 55.112 | 8.844 | -25.399 | 9.7 PB | 5.47 / 6.7 |
| 6 | 蓝绿色 | 103 | 189 | 170 | 70.719 | -33.397 | -0.199 | 2.5 BG | 7 / 6 |
| 7 | 橙色 | 214 | 126 | 44 | 62.661 | 36.067 | 57.096 | 5 YR | 6 / 11 |
| 8 | 紫蓝色 | 80 | 91 | 166 | 40.02 | 10.41 | -45.964 | 7.5 PB | 4 / 10.7 |
| 9 | 中红色 | 193 | 90 | 99 | 51.124 | 48.239 | 16.248 | 2.5 R | 5 / 10 |
| 10 | 紫色 | 94 | 60 | 108 | 30.325 | 22.976 | -21.587 | 5 P | 3 / 7 |
| 11 | 黄绿色 | 157 | 188 | 64 | 72.532 | -23.709 | 57.255 | 5 GY | 7.1 / 9.1 |
| 12 | 橙黄色 | 224 | 163 | 46 | 71.941 | 19.363 | 67.857 | 10 YR | 7 / 10.5 |
| 13 | 蓝色 | 56 | 61 | 150 | 28.778 | 14.179 | -50.297 | 7.5 PB | 2.9 / 12.7 |
| 14 | 绿色 | 70 | 148 | 73 | 55.261 | -38.342 | 31.37 | 0.25 G | 5.4 / 8.65 |
| 15 | 红色 | 175 | 54 | 60 | 42.101 | 53.378 | 28.19 | 5 R | 4 / 12 |
| 16 | 黄色 | 231 | 199 | 31 | 81.733 | 4.039 | 79.819 | 5 Y | 8 / 11.1 |
| 17 | 品红 | 187 | 86 | 149 | 51.935 | 49.986 | -14.574 | 2.5 RP | 5 / 12 |
| 18 | 青色 | 8 | 133 | 161 | 51.038 | -28.631 | -28.638 | 5 B | 5 / 8 |
| 19 | 白色 (.05*) | 243 | 243 | 242 | 96.539 | -0.425 | 1.186 | N | 9.5 / |
| 20 | 中性 8 (.23*) | 200 | 200 | 200 | 81.257 | -0.638 | -0.335 | N | 8 / |
| 21 | 中性 6.5 (.44*) | 160 | 160 | 160 | 66.766 | -0.734 | -0.504 | N | 6.5 / |
| 22 | 中性 5 (.70*) | 122 | 122 | 121 | 50.867 | -0.153 | -0.27 | N | 5 / |
| 23 | 中性 3.5 (1.05*) | 85 | 85 | 85 | 35.656 | -0.421 | -1.231 | N | 3.5 / |
| 24 | 黑色 (1.50*) | 52 | 52 | 52 | 20.461 | -0.079 | -0.973 | N | 2 / |

<!-- Source EN PDF p.72, block 543 -->

###### 3.4.3.2.3 CCM 调整说明

<!-- Source EN PDF p.72, block 544 -->

对比当前与目标 RGB，手动调整 CCM 使二者接近。

<!-- Source EN PDF p.72, block 545 -->

(1) CCM 调整约束。

<!-- Source EN PDF p.72, block 546 -->

色彩校正矩阵公式如下：

<!-- Source EN PDF p.72, block 547 -->

![英文原稿图, PDF p.72, #547](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure2.png)

*英文原稿图, PDF p.72, #547.*

```text
[R',G',B']^T = [[a11,a12,a13],[a21,a22,a23],[a31,a32,a33]] * [R,G,B]^T
```

<!-- Source EN PDF p.72, block 548 -->

为不破坏白平衡，参数必须满足下列条件：

<!-- Source EN PDF p.72, block 549 -->

![英文原稿图, PDF p.72, #549](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure3.png)

*英文原稿图, PDF p.72, #549.*

```text
a_i1 + a_i2 + a_i3 = 1
```

<!-- Source EN PDF p.72, block 550 -->

各通道主要来自原通道的颜色分量，因此必须满足：

<!-- Source EN PDF p.72, block 551 -->

![英文原稿图, PDF p.72, #551](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure4.png)

*英文原稿图, PDF p.72, #551.*

```text
a_ii >= 1
```

<!-- Source EN PDF p.72, block 552 -->

同时，尽量减小主对角元素之间的差异，并使非主对角元素尽量为负。

<!-- Source EN PDF p.72, block 553 -->

![英文原稿图, PDF p.72, #553](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure5.png)

*英文原稿图, PDF p.72, #553.*

```text
a13
```

<!-- Source EN PDF p.72, block 554 -->

![英文原稿图, PDF p.72, #554](/docs/rockchip-isp30-color-optimization/assets/en-p72-figure6.png)

*英文原稿图, PDF p.72, #554.*

```text
a31
```

<!-- Source EN PDF p.72, block 555 -->

若 a13 为正，高饱和红色会偏紫；若 a31 为正，高饱和蓝色会偏紫。

<!-- Source EN PDF p.73, block 556 -->

![英文原稿图, PDF p.73, #556](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure1.png)

*英文原稿图, PDF p.73, #556.*

```text
a21
```

<!-- Source EN PDF p.73, block 557 -->

a21 为负时，绝对值越大，校正后红色的 G 分量越小， 红色饱和度越高；a23 为负时，绝对值越大，校正后蓝色的 G 分量越小，蓝色饱和度越高。

<!-- Source EN PDF p.73, block 558 -->

![英文原稿图, PDF p.73, #558](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure2.png)

*英文原稿图, PDF p.73, #558.*

```text
a23
```

<!-- Source EN PDF p.73, block 560 -->

(2) 常见偏色总结：

<!-- Source EN PDF p.73, block 561 -->

![英文原稿图, PDF p.73, #561](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure3.png)

*英文原稿图, PDF p.73, #561.*

```text
a13
```

<!-- Source EN PDF p.73, block 562 -->

![英文原稿图, PDF p.73, #562](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure4.png)

*英文原稿图, PDF p.73, #562.*

```text
a31
```

<!-- Source EN PDF p.73, block 563 -->

![英文原稿图, PDF p.73, #563](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure5.png)

*英文原稿图, PDF p.73, #563.*

```text
a13
```

<!-- Source EN PDF p.73, block 564 -->

![英文原稿图, PDF p.73, #564](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure6.png)

*英文原稿图, PDF p.73, #564.*

```text
a31
```

<!-- Source EN PDF p.73, block 565 -->

蓝色（红色）偏紫且 a13（a31）为正时，需降低 R（B）分量，将 a13（a31）从接近 0 的正数改为更小的负数。

<!-- Source EN PDF p.73, block 566 -->

![英文原稿图, PDF p.73, #566](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure7.png)

*英文原稿图, PDF p.73, #566.*

```text
a23
```

<!-- Source EN PDF p.73, block 567 -->

![英文原稿图, PDF p.73, #567](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure8.png)

*英文原稿图, PDF p.73, #567.*

```text
a21
```

<!-- Source EN PDF p.73, block 568 -->

蓝色（红色）过饱和且 a23（a21）为负时，需提高 G 分量，可 减小 a23（a21）的绝对值。

<!-- Source EN PDF p.73, block 569 -->

![英文原稿图, PDF p.73, #569](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure9.png)

*英文原稿图, PDF p.73, #569.*

```text
a23
```

<!-- Source EN PDF p.73, block 570 -->

![英文原稿图, PDF p.73, #570](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure10.png)

*英文原稿图, PDF p.73, #570.*

```text
a21
```

<!-- Source EN PDF p.73, block 572 -->

![英文原稿图, PDF p.73, #572](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure11.png)

*英文原稿图, PDF p.73, #572.*

```text
a13
```

<!-- Source EN PDF p.73, block 573 -->

![英文原稿图, PDF p.73, #573](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure12.png)

*英文原稿图, PDF p.73, #573.*

```text
a11
```

<!-- Source EN PDF p.73, block 574 -->

![英文原稿图, PDF p.73, #574](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure13.png)

*英文原稿图, PDF p.73, #574.*

```text
a12
```

<!-- Source EN PDF p.73, block 575 -->

紫色偏蓝时，需增大 R 分量，可增大 a13、减小 a11 和 a12；或降低 B 分量，减小 a33，增大 a31 和 a32。

<!-- Source EN PDF p.73, block 576 -->

![英文原稿图, PDF p.73, #576](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure14.png)

*英文原稿图, PDF p.73, #576.*

```text
a33
```

<!-- Source EN PDF p.73, block 577 -->

![英文原稿图, PDF p.73, #577](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure15.png)

*英文原稿图, PDF p.73, #577.*

```text
a31
```

<!-- Source EN PDF p.73, block 578 -->

![英文原稿图, PDF p.73, #578](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure16.png)

*英文原稿图, PDF p.73, #578.*

```text
a32
```

<!-- Source EN PDF p.73, block 580 -->

![英文原稿图, PDF p.73, #580](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure17.png)

*英文原稿图, PDF p.73, #580.*

```text
a21
```

<!-- Source EN PDF p.73, block 581 -->

![英文原稿图, PDF p.73, #581](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure18.png)

*英文原稿图, PDF p.73, #581.*

```text
a22
```

<!-- Source EN PDF p.73, block 582 -->

红色偏橙时，需降低 G 分量，可减小 a21、增大 a22。

<!-- Source EN PDF p.73, block 583 -->

肤色偏黄绿时，需降低 G、提高 B，可 大幅减小 a22、增大 a23、微调 a21；大幅增大 a31、减小 a32、微调 a33。

<!-- Source EN PDF p.73, block 584 -->

![英文原稿图, PDF p.73, #584](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure19.png)

*英文原稿图, PDF p.73, #584.*

```text
a22
```

<!-- Source EN PDF p.73, block 585 -->

![英文原稿图, PDF p.73, #585](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure20.png)

*英文原稿图, PDF p.73, #585.*

```text
a23
```

<!-- Source EN PDF p.73, block 586 -->

![英文原稿图, PDF p.73, #586](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure21.png)

*英文原稿图, PDF p.73, #586.*

```text
a21
```

<!-- Source EN PDF p.73, block 587 -->

![英文原稿图, PDF p.73, #587](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure22.png)

*英文原稿图, PDF p.73, #587.*

```text
a31
```

<!-- Source EN PDF p.73, block 588 -->

![英文原稿图, PDF p.73, #588](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure23.png)

*英文原稿图, PDF p.73, #588.*

```text
a32
```

<!-- Source EN PDF p.73, block 589 -->

![英文原稿图, PDF p.73, #589](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure24.png)

*英文原稿图, PDF p.73, #589.*

```text
a33
```

<!-- Source EN PDF p.73, block 591 -->

###### 3.4.3.2.4 CCM 调整示例

<!-- Source EN PDF p.73, block 592 -->

(1) 示例 1：红色偏橙。

<!-- Source EN PDF p.73, block 593 -->

![英文原稿图, PDF p.73, #593](/docs/rockchip-isp30-color-optimization/assets/en-p73-figure25.png)

*英文原稿图, PDF p.73, #593.*

<!-- Source EN PDF p.73, block 594 -->

使用 faststone 调整 RGB 后发现，降低 G 分量可改善偏橙问题。红色塑料片的目标 RGB 为 [212 63 79]。

<!-- Source EN PDF p.74, block 595 -->

![英文原稿图, PDF p.74, #595](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure1.png)

*英文原稿图, PDF p.74, #595.*

<!-- Source EN PDF p.74, block 596 -->

红框内塑料片偏橙，RGB = [212, 78, 80]，相对目标 [212 63 79]，G 分量偏大。经验较多时，可跳过 faststone 获取目标值，直接调整 CCM 降低 G 分量。

<!-- Source EN PDF p.74, block 597 -->

![英文原稿图, PDF p.74, #597](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure2.png)

*英文原稿图, PDF p.74, #597.*

```text
G' = a21*R + a22*G + a23*B
```

<!-- Source EN PDF p.74, block 598 -->

，

<!-- Source EN PDF p.74, block 599 -->

![英文原稿图, PDF p.74, #599](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure3.png)

*英文原稿图, PDF p.74, #599.*

```text
[a21,a22,a23] = [-0.2854,1.1496,0.1358]
```

<!-- Source EN PDF p.74, block 600 -->

原始校正系数：

<!-- Source EN PDF p.74, block 601 -->

![英文原稿图, PDF p.74, #601](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure4.png)

*英文原稿图, PDF p.74, #601.*

```text
a21
```

<!-- Source EN PDF p.74, block 602 -->

红色塑料片 R 分量最大，因此需减小 a21，并 增大 a22 的绝对值，以满足行和为 1 的约束。

<!-- Source EN PDF p.74, block 603 -->

![英文原稿图, PDF p.74, #603](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure5.png)

*英文原稿图, PDF p.74, #603.*

```text
a22
```

<!-- Source EN PDF p.74, block 605 -->

![英文原稿图, PDF p.74, #605](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure6.png)

*英文原稿图, PDF p.74, #605.*

```text
[a21,a22,a23] = [-0.385,1.2497,0.1358]
```

<!-- Source EN PDF p.74, block 606 -->

调整后校正系数：

<!-- Source EN PDF p.74, block 607 -->

![英文原稿图, PDF p.74, #607](/docs/rockchip-isp30-color-optimization/assets/en-p74-figure7.png)

*英文原稿图, PDF p.74, #607.*

<!-- Source EN PDF p.74, block 608 -->

红色塑料片：RGB = [208, 56, 76]。

<!-- Source EN PDF p.74, block 609 -->

(2) 示例 2：肤色偏黄绿。

<!-- Source EN PDF p.75, block 610 -->

![英文原稿图, PDF p.75, #610](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure1.png)

*英文原稿图, PDF p.75, #610.*

<!-- Source EN PDF p.75, block 611 -->

红框内肤色偏黄绿，RGB = [216, 174, 124]，其中 G 分量偏大，B 分量偏小。

<!-- Source EN PDF p.75, block 612 -->

![英文原稿图, PDF p.75, #612](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure2.png)

*英文原稿图, PDF p.75, #612.*

```text
[[a21,a22,a23],[a31,a32,a33]] = [[-0.3192,1.6927,-0.3735],[0.0239,-0.5738,1.5499]]
```

<!-- Source EN PDF p.75, block 613 -->

原始校正系数：

<!-- Source EN PDF p.75, block 614 -->

![英文原稿图, PDF p.75, #614](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure4.png)

*英文原稿图, PDF p.75, #614.*

```text
a23
```

<!-- Source EN PDF p.75, block 615 -->

![英文原稿图, PDF p.75, #615](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure3.png)

*英文原稿图, PDF p.75, #615.*

```text
a22
```

<!-- Source EN PDF p.75, block 616 -->

![英文原稿图, PDF p.75, #616](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure5.png)

*英文原稿图, PDF p.75, #616.*

```text
a21
```

<!-- Source EN PDF p.75, block 617 -->

同示例 1，降低 G 分量：大幅减小 a22、增大 a23、微调 a21。

<!-- Source EN PDF p.75, block 618 -->

![英文原稿图, PDF p.75, #618](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure6.png)

*英文原稿图, PDF p.75, #618.*

<!-- Source EN PDF p.75, block 619 -->

此时肤色：RGB = [212, 169, 124]。

<!-- Source EN PDF p.75, block 620 -->

![英文原稿图, PDF p.75, #620](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure7.png)

*英文原稿图, PDF p.75, #620.*

```text
a31
```

<!-- Source EN PDF p.75, block 621 -->

为提高 B 分量，由于 R 分量较大，故大幅增大 a31；为保证 行和为 1，还需减小 a32 和 a33。

<!-- Source EN PDF p.75, block 622 -->

![英文原稿图, PDF p.75, #622](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure8.png)

*英文原稿图, PDF p.75, #622.*

```text
a32
```

<!-- Source EN PDF p.75, block 623 -->

![英文原稿图, PDF p.75, #623](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure9.png)

*英文原稿图, PDF p.75, #623.*

```text
a33
```

<!-- Source EN PDF p.75, block 625 -->

![英文原稿图, PDF p.75, #625](/docs/rockchip-isp30-color-optimization/assets/en-p75-figure10.png)

*英文原稿图, PDF p.75, #625.*

<!-- Source EN PDF p.76, block 626 -->

![英文原稿图, PDF p.76, #626](/docs/rockchip-isp30-color-optimization/assets/en-p76-figure1.png)

*英文原稿图, PDF p.76, #626.*

```text
[[a21,a22,a23],[a31,a32,a33]] = [[-0.3004,1.6375,-0.3371],[0.2127,-0.7294,1.5166]]
```

<!-- Source EN PDF p.76, block 627 -->

调整后校正系数如下。

<!-- Source EN PDF p.76, block 628 -->

此处肤色：RGB = [214, 169, 146]。

<!-- Source EN PDF p.76, block 629 -->

## 4 高级色彩调整 3DLut

<!-- Source EN PDF p.76, block 630 -->

### 4.1 CCM 与 3DLut 对比

<!-- Source EN PDF p.76, block 631 -->

CCM 使不同光源下色彩接近人眼视觉；3DLut 按偏好调整个别颜色。二者用于色彩调整的优缺点如下：

<!-- Source EN PDF p.76, block 632 -->

|  | CCM | 3DLut |
|---|---|---|
| 优点 | 色彩过渡自然，不易引入噪声。 | 更容易调整某种颜色的色相、饱和度，可不影响无关颜色。 |
| 缺点 | 按偏好修改 CCM 可能影响其他不相似颜色；调整较困难。 | 当前 9×9×9 采样点较少，过渡容易不自然；调整数值会影响像素降噪强度并引入噪声。 |

<!-- Source EN PDF p.76, block 633 -->

具体选择需在实际项目中权衡色彩偏好、过渡和噪声。

<!-- Source EN PDF p.76, block 634 -->

### 4.2 功能说明

<!-- Source EN PDF p.76, block 635 -->

三维查找表：3 dimensional look-up-tables (3DLUT)。

<!-- Source EN PDF p.77, block 636 -->

![英文原稿图, PDF p.77, #636](/docs/rockchip-isp30-color-optimization/assets/en-p77-figure1.png)

*英文原稿图, PDF p.77, #636.*

<!-- Source EN PDF p.77, block 637 -->

图：9×9×9 旁路 3DLUT 示意。

<!-- Source EN PDF p.77, block 638 -->

可将任意颜色独立映射为另一数值。

<!-- Source EN PDF p.77, block 639 -->

![英文原稿图, PDF p.77, #639](/docs/rockchip-isp30-color-optimization/assets/en-p77-figure2.png)

*英文原稿图, PDF p.77, #639.*

<!-- Source EN PDF p.77, block 640 -->

图：9×9×9 增强绿色的 3DLUT 示意。

<!-- Source EN PDF p.77, block 641 -->

原文称 RK1109 的 3D LUT 为 9×9×9，表中未记录的数值可通过三线性插值获得。

<!-- Source EN PDF p.78, block 642 -->

### 4.3 主要参数

<!-- Source EN PDF p.78, block 643 -->

参数位于 IQ json 的 lut3d_calib 节点；json 参数仅在自动模式生效。

<!-- Source EN PDF p.78, block 644 -->

#### 4.3.1 使能控制与模式选择

<!-- Source EN PDF p.78, block 645 -->

位于 Common 节点。

<!-- Source EN PDF p.78, block 646 -->

| 参数 | 说明 |
|---|---|
| enable | 3DLUT 开关，0 或 1；1 启用。 |
| wbgain_tolerance | 3DLUT 白平衡增益变化容差。统计增益差小于此阈值时认为满足 3DLUT 稳定条件；范围 0.0-1。 |
| gain_tolerance | 3DLUT 曝光增益变化容差。统计曝光增益差小于此阈值时认为满足 3DLUT 稳定条件；范围 0.0-1。 |

<!-- Source EN PDF p.78, block 647 -->

#### 4.3.2 自动 3DLUT 参数

<!-- Source EN PDF p.78, block 648 -->

位于 ALut3D 节点。

<!-- Source EN PDF p.78, block 649 -->

| 参数 | 说明 |
|---|---|
| damp_en | 3DLUT 平滑功能开关，0 或 1；1 使用此功能。 |

<!-- Source EN PDF p.78, block 650 -->

##### 4.3.2.1 3DLUT 参数

<!-- Source EN PDF p.78, block 651 -->

| 参数 | 说明 |
|---|---|
| Name | 3DLUT 名称。 |
| awbGain | 对应标准白平衡增益，由标定工具生成，大于 0。 |
| gain | gain-alpha 的曝光增益分量，小数，大于 0。 |
| alpha | gain-alpha 的 3DLUT 强度分量，小数，大于 0。 |
| look_up_table_r | R 通道查找表，范围 [0,1023]。 |
| look_up_table_g | G 通道查找表，范围 [0,4095]。 |
| look_up_table_b | B 通道查找表，范围 [0,1023]。 |

<!-- Source EN PDF p.79, block 652 -->

### 4.4 3DLUT 标定与调整

<!-- Source EN PDF p.79, block 653 -->

RKISP 3D-LutTool 基于 LAB 模型，将 A-B（颜色通道）直角坐标转换为 C（饱和度）-H（色相）极坐标，输入支持 jpg/bmp/png/yuv/nv12。如图 4.4-2，原点 O 饱和度为 0，径向外侧饱和度增加，红箭头逆时针旋转改变色相。Rockchip_IQ_Tools_Guide_ISP2x_CN 第 2.6 节 3D-LUT Tools 介绍其界面与用法。

<!-- Source EN PDF p.79, block 654 -->

![英文原稿图, PDF p.79, #654](/docs/rockchip-isp30-color-optimization/assets/en-p79-figure1.png)

*英文原稿图, PDF p.79, #654.*

<!-- Source EN PDF p.80, block 655 -->

![英文原稿图, PDF p.80, #655](/docs/rockchip-isp30-color-optimization/assets/en-p80-figure1.png)

*英文原稿图, PDF p.80, #655.*

<!-- Source EN PDF p.80, block 656 -->

图 4.4-1：增强绿色饱和度。

<!-- Source EN PDF p.81, block 657 -->

![英文原稿图, PDF p.81, #657](/docs/rockchip-isp30-color-optimization/assets/en-p81-figure1.png)

*英文原稿图, PDF p.81, #657.*

<!-- Source EN PDF p.82, block 658 -->

![英文原稿图, PDF p.82, #658](/docs/rockchip-isp30-color-optimization/assets/en-p82-figure1.png)

*英文原稿图, PDF p.82, #658.*

<!-- Source EN PDF p.82, block 659 -->

图 4.4-2：改变红色色相。

<!-- Source EN PDF p.82, block 660 -->

#### 4.4.1 调整步骤

<!-- Source EN PDF p.82, block 661 -->

1\. 采集图像，关闭 3DLUT 及后续模块 YNR/SHARP/CNR 等，便于观察 3DLUT 是否引入其他影响；最好采集 yuv 图。

<!-- Source EN PDF p.82, block 662 -->

2\. 导入图像，参见 Rockchip_IQ_Tools_Guide_ISP2x_CN 第 2.6 节 3D-LUT Tools。

<!-- Source EN PDF p.82, block 663 -->

3\. 保持白平衡：右键点击中心原点，圆点变为方形即固定成功。

<!-- Source EN PDF p.83, block 664 -->

4\. 在右侧图像界面点击待调整像素，其位置显示在左侧坐标系。

<!-- Source EN PDF p.83, block 665 -->

5\. 用鼠标向目标点拖动，注意对坐标系中附近点进行平滑。

<!-- Source EN PDF p.83, block 666 -->

6\. 生成 3DLUT 参数后，在丰富色彩场景中应用并检查颜色是否符合预期。

<!-- Source EN PDF p.83, block 667 -->

##### 4.4.1.1 注意

<!-- Source EN PDF p.83, block 668 -->

3DLUT 前级模块发生调整，尤其影响色彩时，需重新调整 3DLUT。

<!-- Source EN PDF p.83, block 669 -->

##### 4.4.1.2 示例

<!-- Source EN PDF p.83, block 670 -->

调整人脸肤色：

<!-- Source EN PDF p.83, block 671 -->

(1) 选择 Grid Division (8,12,16)，值越大精度越高；点击右侧图像中的人脸区域，在左侧坐标系定位。

<!-- Source EN PDF p.83, block 672 -->

![英文原稿图, PDF p.83, #672](/docs/rockchip-isp30-color-optimization/assets/en-p83-figure1.png)

*英文原稿图, PDF p.83, #672.*

<!-- Source EN PDF p.83, block 673 -->

(2) 肤色偏黄绿，需将肤色锚点向红色色相方向移动并降低饱和度，如图 (1)、(2) 标记；图中 (3) 标记进行了轻微调整，用于平滑处理。

<!-- Source EN PDF p.84, block 674 -->

![英文原稿图, PDF p.84, #674](/docs/rockchip-isp30-color-optimization/assets/en-p84-figure1.png)

*英文原稿图, PDF p.84, #674.*

<!-- Source EN PDF p.84, block 675 -->

(3) 效果对比：

<!-- Source EN PDF p.84, block 676 -->

![英文原稿图, PDF p.84, #676](/docs/rockchip-isp30-color-optimization/assets/en-p84-figure2.png)

*英文原稿图, PDF p.84, #676.*

{% endraw %}
