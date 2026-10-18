---
title: "Rockchip 摄像头模组 OTP 完整校准指南：AWB、LSC、PDAF、API 与数据格式"
description: "完整整理 V1.0.34 的 AWB/LSC、Gain Map/DCC Map 校准与验证、全部 API、sensor.ini、示例代码及 OTP 数据布局。"
translation_key: "075-rockchip-camera-otp-calibration"
slug: "075-rockchip-camera-otp-calibration"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "Camera", "OTP", "PDAF", "AWB", "LSC"]
keywords: "ArmSoM Rockchip camera OTP AWB LSC PDAF"
excerpt: "完整整理 V1.0.34 的 AWB/LSC、Gain Map/DCC Map 校准与验证、全部 API、sensor.ini、示例代码及 OTP 数据布局。"
---

{% raw %}

# Rockchip 摄像头模组 OTP 完整校准指南：AWB、LSC、PDAF、API 与数据格式

本文完整整理 47 页英文 V1.0.34 原稿的技术正文（PDF p.9–47）。没有提供对应中文 PDF：中文与俄文均完整翻译英文原稿，三语统一使用英文 PDF 原图；原图中已有中文标签如实保留，不伪称已获得另一语言图片。代码、参数、标识符、示例数值与代码注释保持原文；自然语言说明和图注本地化。

原稿适用芯片见下表，未指定统一内核版本或具体 ArmSoM 板卡。本篇仅作 ArmSoM 平台参考：需核对实际 SoC、模组、传感器、VCM/OIS、ISP、SDK/BSP、校准 DLL/API 版本、驱动及 OTP/EEPROM 存储格式，不能将原厂模组示例当成 ArmSoM 实测。尚未进行硬件验证，也未执行校准、烧写或相机操作。

**操作风险与来源疑点**：OTP/EEPROM 烧写可能不可逆或覆盖模组校准数据；先核对厂家流程及目标存储布局。原文若干参数默认值、函数声明与附录调用存在差异，附录是原文示例，不保证可直接编译或适配生产环境。公式、地址、位数和 ID 均按原文保留；未擅自纠正技术常量。

| 原文芯片范围 |
|---|
| RV1109 / RV1126 / RK356X / RK3588 |

原文疑点及校对记录：
[EDITORIAL-NOTES](/docs/rockchip-camera-otp-calibration/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.9, block 0 -->

## 1. LSC 与 AWB 校准流程

<!-- Source EN PDF p.9, block 1 -->

### 1.1 校准方案

<!-- Source EN PDF p.9, block 2 -->

1\. 光源环境与设备

<!-- Source EN PDF p.9, block 3 -->

D50（5000K±100K），避免其他环境杂散光干扰。

<!-- Source EN PDF p.9, block 4 -->

使用满足上述光源要求的匀光片或 DNP 灯箱，匀光片如下图所示：

<!-- Source EN PDF p.9, block 5 -->

![英文原稿技术图, p.9](/docs/rockchip-camera-otp-calibration/assets/en-p09-figure1.png)

*英文原稿技术图, PDF p.9.*

<!-- Source EN PDF p.9, block 6 -->

2\. 拍摄方法

<!-- Source EN PDF p.9, block 7 -->

1. 根据实际条件选择以下方法之一：
   - 使用匀光片：使镀膜面朝向镜头并靠近放置，保持模组端面、匀光片和光源面板平行。
   - 使用 DNP 灯箱：将模组放在 DNP 光源面板前 1–2cm，模组端面与面板平行。
2. 关闭 mirror/flip 等功能。
3. 调节曝光，使图像 G 通道的最大亮度（8bit）达到 160~180。
4. 使用该曝光拍摄并保存一幅 raw 图像。

<!-- Source EN PDF p.9, block 8 -->

3\. AWB 校准

<!-- Source EN PDF p.9, block 9 -->

1\. 选择 Raw 图像中心区域（每通道长、宽各 20%），计算 R、Gr、Gb、B 通道平均值。

<!-- Source EN PDF p.9, block 10 -->

Gr_ave = ROI 的 Gr 平均值 - Black level

<!-- Source EN PDF p.9, block 11 -->

Gb_ave = ROI 的 Gb 平均值 - Black level

<!-- Source EN PDF p.9, block 12 -->

R_ave = ROI 的 Red 平均值 - Black level

<!-- Source EN PDF p.9, block 13 -->

B_ave = ROI 的 Blue 平均值 - Black level

<!-- Source EN PDF p.9, block 14 -->

2\. 计算 R/Gb、B/Gb 和 Gr/Gb。

<!-- Source EN PDF p.9, block 15 -->

`R/Gb=R_ave/Gb_ave`

<!-- Source EN PDF p.9, block 16 -->

`B/Gb=B_ave/Gb_ave`

<!-- Source EN PDF p.10, block 17 -->

`Gr/Gb=Gr_ave/Gb_ave`

<!-- Source EN PDF p.10, block 18 -->

3\. 将 R/Gb、B/Gb、Gr/Gb 转换为 10 位定点数：

`R/Gb_hex=R/Gb * 1024`

<!-- Source EN PDF p.10, block 19 -->

`B/Gb_hex=B/Gb * 1024`

<!-- Source EN PDF p.10, block 20 -->

`Gr/Gb_hex=Gr/Gb * 1024`

<!-- Source EN PDF p.10, block 21 -->

4\. LSC 校准

<!-- Source EN PDF p.10, block 22 -->

1\. 将校准计算目标值设置为 70%。

<!-- Source EN PDF p.10, block 23 -->

2\. 计算四个通道各自的 10 位增益。

<!-- Source EN PDF p.10, block 24 -->

### 1.2 管控方案

<!-- Source EN PDF p.10, block 25 -->

1\. LSC 校准前

<!-- Source EN PDF p.10, block 26 -->

1\. Y shading 标准：

<!-- Source EN PDF p.10, block 27 -->

`ROI = 1/5 Width * 1/5Height`

<!-- Source EN PDF p.10, block 28 -->

`YShading_Corner = Y_Corner/Y_Center`

<!-- Source EN PDF p.10, block 29 -->

`30% < YShading_Corner < 55%`

<!-- Source EN PDF p.10, block 30 -->

`Ydiffer = YShading_Corner_Max - YShading_Corner_Min < 7%`

<!-- Source EN PDF p.10, block 31 -->

2\. Color Shading 标准：

<!-- Source EN PDF p.10, block 32 -->

单个模组的色彩阴影均匀性：管控每个块与中心块之间的差异。

<!-- Source EN PDF p.10, block 33 -->

ROI 框为 1/5\*1/5，计算 24 个块与中心块的差异。

<!-- Source EN PDF p.10, block 34 -->

`ROI = 1/5Width * 1/5Height`

<!-- Source EN PDF p.10, block 35 -->

`|(R/G_Corner)/(R/G_Center)-1| < 15%`

<!-- Source EN PDF p.10, block 36 -->

`|(B/G_Corner)/(B/G_Center)-1| < 15%`

<!-- Source EN PDF p.10, block 37 -->

2\. LSC 校准

<!-- Source EN PDF p.10, block 38 -->

针对模组摆放导致 RAW 数据四周暗角不对称的问题，在 lsc_otp_Calibrate 接口中增加 ratio 参数管控校准结果，默认 ratio=1.5。

<!-- Source EN PDF p.10, block 39 -->

如果模组自身装配导致光学中心偏移，可以增大 ratio 以提高通过率。

<!-- Source EN PDF p.10, block 40 -->

3\. LSC 校准后

<!-- Source EN PDF p.10, block 41 -->

1\. Y shading 标准：

<!-- Source EN PDF p.10, block 42 -->

`ROI = 1/5 Width * 1/5Height`

<!-- Source EN PDF p.10, block 43 -->

`YShading_Corner = Y_Corner/Y_Center`

<!-- Source EN PDF p.10, block 44 -->

`Ydiffer = YShading_Corner_Max - YShading_Corner_Min < 5%`

<!-- Source EN PDF p.10, block 45 -->

2\. Color Shading 标准：

<!-- Source EN PDF p.10, block 46 -->

单个模组的色彩阴影均匀性：管控每个块与中心块之间的差异。

<!-- Source EN PDF p.10, block 47 -->

ROI 框为 1/5\*1/5，计算 24 个块与中心块的差异。

<!-- Source EN PDF p.10, block 48 -->

`ROI = 1/5Width * 1/5Height`

<!-- Source EN PDF p.10, block 49 -->

`|(R/G_Corner)/(R/G_Center)-1| < 5%`

<!-- Source EN PDF p.11, block 50 -->

`|(B/G_Corner)/(B/G_Center)-1| < 5%`

<!-- Source EN PDF p.12, block 51 -->

## 2. PDAF 校准流程

<!-- Source EN PDF p.12, block 52 -->

PDAF 校准分为 Gain Map 校准和 DCC Map 校准两部分，流程如下：

<!-- Source EN PDF p.12, block 53 -->

![英文原稿技术图, p.12](/docs/rockchip-camera-otp-calibration/assets/en-p12-figure1.png)

*英文原稿技术图, PDF p.12.*

<!-- Source EN PDF p.12, block 54 -->

### 2.1 校准前准备

<!-- Source EN PDF p.12, block 55 -->

1\. 模组准备

<!-- Source EN PDF p.12, block 56 -->

(1) 检测镜头脏污。

<!-- Source EN PDF p.12, block 57 -->

(2) VCM 检测：测试线性度、镜头位置精度和稳定性。

<!-- Source EN PDF p.12, block 58 -->

(3) AF 基础校正：

<!-- Source EN PDF p.12, block 59 -->

确定 DAC 与对焦距离的关系：校准模组镜头在 Inf 和 Marco 焦点处的马达位置，记录 DAC_inf 与 Dac_marco，确定 DCC_LENS_BEGIN 与 DCC_LENS_END。马达中心位置对焦最清晰时对应的物距，就是 DCC Map 校准距离 a。

<!-- Source EN PDF p.12, block 60 -->

马达中心位置 DAC = (DAC_INF + DAC_MACRO)/2，相应校准距离 a 可通过镜头景深表确定。先查 INF 和 MACRO 的 lens shift，计算二者中间值，再在景深表中找最接近该值的 lens shift，得到马达中心位置及对应物距 A。例如，无穷远物距对应 lens shift 为 0；最近物距选 10cm，对应 -0.183，则中心位移为 -0.0915，最接近表中 -0.091，相应 DCC Map 校准物距 a 为 0.20m。

<!-- Source EN PDF p.13, block 61 -->

| 物距 (m) | 镜头位移 (mm) | 远景深 (m) | 近景深 (m) |
|---|---|---|---|
| INF | 0.000 | - | - |
| 10.0 | -0.002 | INF | 4.33 |
| 7.6 | -0.002 | 14417.449 | 3.81 |
| 5.0 | -0.004 | 14.511 | 3.02 |
| 4.0 | -0.004 | 8.406 | 2.63 |
| 3.0 | -0.006 | 4.941 | 2.15 |
| 2.0 | -0.009 | 2.71 | 1.59 |
| 1.9 | -0.009 | 2.53 | 1.52 |
| 1.8 | -0.010 | 2.35 | 1.46 |
| 1.7 | -0.010 | 2.19 | 1.39 |
| 1.6 | -0.011 | 2.02 | 1.32 |
| 1.5 | -0.012 | 1.87 | 1.25 |
| 1.4 | -0.013 | 1.71 | 1.18 |
| 1.3 | -0.014 | 1.57 | 1.11 |
| 1.2 | -0.015 | 1.42 | 1.04 |
| 1.1 | -0.016 | 1.28 | 0.96 |
| 1.0 | -0.018 | 1.15 | 0.88 |
| 0.9 | -0.020 | 1.02 | 0.81 |
| 0.8 | -0.022 | 0.89 | 0.72 |
| 0.7 | -0.025 | 0.77 | 0.64 |
| 0.6 | -0.029 | 0.65 | 0.56 |
| 0.5 | -0.035 | 0.53 | 0.47 |
| 0.45 | -0.039 | 0.478 | 0.425 |
| 0.40 | -0.044 | 0.422 | 0.380 |
| 0.35 | -0.051 | 0.366 | 0.335 |
| 0.30 | -0.059 | 0.312 | 0.289 |
| 0.25 | -0.071 | 0.258 | 0.242 |
| 0.20 | -0.091 | 0.202 | 0.192 |
| 0.15 | -0.120 | 0.153 | 0.147 |
| 0.14 | -0.129 | 0.142 | 0.138 |
| 0.13 | -0.140 | 0.132 | 0.128 |
| 0.12 | -0.152 | 0.122 | 0.118 |
| 0.11 | -0.166 | 0.111 | 0.109 |
| 0.10 | -0.183 | 0.101 | 0.099 |
| 0.09 | -0.205 | 0.091 | 0.089 |
| 0.08 | -0.232 | 0.081 | 0.079 |
| 0.07 | -0.267 | 0.071 | 0.069 |
| 0.06 | -0.315 | 0.060 | 0.060 |
| 0.05 | -0.383 | 0.050 | 0.050 |

<!-- Source EN PDF p.15, block 63 -->

| 项目 | 详情 | 说明 |
|---|---|---|
| 测试图卡 | 由供应商定义 | 建议采用棋盘格、菱形图等具有高对比度和适中频率的测试图卡。 |
| 测试图卡表面照明亮度 | 大于 400Lux | 成像不应闪烁 |
| 模组与测试图卡的距离 | INF:2~5m；Marco:10-20cm（详见景深表；Marco 为原文拼写） | INF 距离使用增距镜模拟远焦位置。 |
| 模组校正方向 | 校正 INF/MACRO 时，模组光轴水平。 | 开环 VCM 仅在水平方向校正；闭环 VCM 可将光轴朝上校正。注意 Inf/Macro 的校正方向应一致。 |
| 增益设置 | 与 AWB 相同 | 数字增益固定为 1；模拟增益：传统 PD 或 2x1OCL 设为 1x，Dual-photodiode 的 PD 设为 2x。 |
| 传感器设置 | 禁用传感器的 mirror/flip/OB/坏点去除等设置。 |  |
| 图像亮度要求 | 与 AWB 相同 | 全尺寸显示时，画面中心 1/32W*1/32H ROI 内 G 通道最高 10% 的平均亮度为 800LSB (raw10)；dual pd G 通道平均值为 700LSB (raw10)。 |
| 误差测试样本数 | 范围检查：每个模组应进行准确检查；大于 10pcs（原文表述）。 | 测试失败时需修改校正方法，使 AF 远焦和近焦校正结果更准确。 |

<!-- Source EN PDF p.15, block 64 -->

(4) 若模组支持 OIS，校准 lsc 和 pdaf 前应完成防抖校正。将马达移到参考 XY 位置，确认 OIS 配置；此步骤生成用于 LSC 和 PDAF 索引的平场图像。

<!-- Source EN PDF p.15, block 65 -->

(5) 完成黑电平和 LSC 校正，必要时也可校正场曲。

<!-- Source EN PDF p.15, block 66 -->

2\. 模组 AE 设置

<!-- Source EN PDF p.15, block 67 -->

(1) 数字增益固定为 1；传统 PD 或 2x1OCL 的模拟增益 again 设置为 1x； Dual-photodiode 的 PD 模拟增益 again 设置为 2x，以防像素电荷溢出。

<!-- Source EN PDF p.15, block 68 -->

<!-- Source EN PDF p.15, block 69 -->

(2) 曝光时间：为防止 dual-pd 电荷溢出及普通像素（regular_pixel=dual_pd_l+dual_pd_r）过曝，调节曝光使全尺寸显示时中心区域 G 通道亮度为 700（raw10）。OCL 与 metal-shield 类型应保证中心 G 通道亮度为 800（raw10）。建议传感器曝光时间为 10ms 的整数倍，避免工频干扰。

<!-- Source EN PDF p.16, block 70 -->

### 2.2 Gain Map 校准

<!-- Source EN PDF p.16, block 71 -->

1\. 光源环境与设备

<!-- Source EN PDF p.16, block 72 -->

D50（5000K±100K），避免其他环境杂散光干扰。

<!-- Source EN PDF p.16, block 73 -->

满足上述光源要求的匀光片或 DNP 灯箱、积分球。

<!-- Source EN PDF p.16, block 74 -->

2\. 拍摄方法

<!-- Source EN PDF p.16, block 75 -->

![英文原稿技术图, p.16](/docs/rockchip-camera-otp-calibration/assets/en-p16-figure1.png)

*英文原稿技术图, PDF p.16.*

<!-- Source EN PDF p.16, block 76 -->

1. 将模组放在均匀面光源前，端面与光源平行；例如原文实验使用积分球，将面板亮度调为 6.6。镜头前放匀光片，使面光源充满画面。
2. 传感器增益：metal-shield 和 2x1OCL 的 again、dgain 均设为 1x；dual-pd 的 again 为 2x、dgain 为 1x，曝光时间设为 10 的倍数。
3. 关闭传感器 mirro/flip/OB 等设置。
4. 全尺寸显示时，中心 1/32W*1/32H ROI 内 TOP 10% G 通道平均亮度为 800LSB（raw10）或 200LSB（raw8）；dual pd G 通道平均值为 700LSB（raw10）或 175LSB（raw8）。
5. 开机预热 3 分钟，马达移到中心位置，连续拍摄 3 幅 RAW。先检查坏点数是否超限；超限时降低亮度重新拍摄，通过后获得平均图像数据。

<!-- Source EN PDF p.16, block 77 -->

3\. 校准

<!-- Source EN PDF p.16, block 78 -->

调用 pdaf_gainmap_calibration(...) 生成 gainmap 数据，并获得 gainmap 大小：gainmap_width\*gainmap_height\*2 字节，包含左、右 gainmap。

<!-- Source EN PDF p.16, block 79 -->

4\. 验证

<!-- Source EN PDF p.16, block 80 -->

1\. 保持步骤 2 的环境一致，拍摄测试图，将已校准 gainmap 与测试图送入 pdaf_gainmap_vertification(...)。返回 1 表示验证成功，gainmap 可用；返回 -1 表示坏点数可能超出允许范围，需要降低图像亮度并重新拍摄。

<!-- Source EN PDF p.16, block 81 -->

2\. 验证标准

<!-- Source EN PDF p.16, block 82 -->

gainmap 校正后的左右 PD 像素差异小于 5%，则验证成功。

<!-- Source EN PDF p.17, block 83 -->

### 2.3 DCC Map 校准

<!-- Source EN PDF p.17, block 84 -->

DCC（离焦转换系数）表示马达位置与左右图像差异之间的关系。将图像分区，等步长移动马达，计算不同位置的 pd 值，通过线性回归获得各区域 DCC 值，即 DCCMAP。

![原文公式, PDF p.17](/docs/rockchip-camera-otp-calibration/assets/en-p17-formula1.png)

`DCC = Δlensposition[dac]/Δphasedisparity[pixel]`

<!-- Source EN PDF p.17, block 85 -->

![英文原稿技术图, p.17](/docs/rockchip-camera-otp-calibration/assets/en-p17-figure1.png)

*英文原稿技术图, PDF p.17.*

<!-- Source EN PDF p.17, block 86 -->

[可选]

<!-- Source EN PDF p.17, block 87 -->

部分模组需要校准 PD_OFFSET。例如，马达位于 DAC_0 时得到失焦图，清晰对焦位置计算为 DAC = DAC_0 + PD \* DCC + PD_OFFSET \* DCC。

<!-- Source EN PDF p.17, block 88 -->

1\. 光源环境与设备

<!-- Source EN PDF p.17, block 89 -->

D50（5000K±100K），避免其他环境杂散光干扰。

<!-- Source EN PDF p.17, block 90 -->

满足上述光源要求的匀光片或 DNP 灯箱、积分球、黑白标准板。

<!-- Source EN PDF p.17, block 91 -->

标准板由定制半透明胶片制作，图案为等间距黑白条纹或菱形网格。

<!-- Source EN PDF p.17, block 92 -->

![英文原稿技术图, p.17](/docs/rockchip-camera-otp-calibration/assets/en-p17-figure2.png)

*英文原稿技术图, PDF p.17.*

<!-- Source EN PDF p.18, block 93 -->

![英文原稿技术图, p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-figure2.png)

*英文原稿技术图, PDF p.18.*

<!-- Source EN PDF p.18, block 94 -->

![英文原稿技术图, p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-figure1.png)

*英文原稿技术图, PDF p.18.*

<!-- Source EN PDF p.18, block 95 -->

校准距离 a 在 2.1.1 AF 基础校正步骤中确定。

<!-- Source EN PDF p.18, block 96 -->

标准板宽度取决于镜头水平 FOV 和校准距离 a，建议：

![原文公式, PDF p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-formula1.png)

`S >= a * tan(FOV * pi/360) * 2/0.9`

<!-- Source EN PDF p.18, block 97 -->

校准距离在 2.1.1 AF 基础校正步骤中确定。

<!-- Source EN PDF p.18, block 98 -->

标准板宽度取决于镜头水平 FOV 和校准距离 a，建议：

![原文公式, PDF p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-formula2.png)

`λ[mm] = (u[um]/1000) * raw_width/(6 * dccmap_width)`

![原文公式, PDF p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-formula3.png)

`W[mm] = (a[mm] - f[mm])/f[mm] * λ[mm]`

<!-- Source EN PDF p.18, block 99 -->

IMX258 的系数 λ 建议为 0.11；S5KJN1 建议为 0.088~0.099。

<!-- Source EN PDF p.18, block 100 -->

DCC 校准要求正确制作、放置标准板。条纹尺寸不当、摆放旋转或变形、亮度过暗或过曝都会导致校准失败。下图给出部分错误情况。

<!-- Source EN PDF p.18, block 101 -->

![英文原稿技术图, p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-figure3.png)

*英文原稿技术图, PDF p.18.*

<!-- Source EN PDF p.18, block 102 -->

2\. 拍摄方法

<!-- Source EN PDF p.19, block 103 -->

1. 将条纹胶片放在积分球前，模组置于标准板前、约中间焦点处，距离按 2.1.1 AF 基础校正确定。端面与标准板平行，避免标准板旋转、倾斜和扭曲，拍摄时图案应充满画面。
2. metal-shield、2x1OCL 的 again、dgain 均为 1x；dual-pd 的 again 为 2x、dgain 为 1x。
3. 关闭传感器 mirro/flip/OB/坏点去除等设置。
4. 曝光：标准板画面中心 1/32w*1/32h ROI 内白块 G 通道平均值应为 800LSB（raw10）或 200LSB（raw8）；dual pd 为 700LSB（raw10）或 175LSB（raw8），防止过暗或过曝影响 DCC 精度。metal-shield 传感器还应保证非遮挡像素不过曝。
5. 马达从 DCC_LENS_BEGIN 按 DCC_LENS_INTERVAL 步长移动到 DCC_LENS_END，每次稳定后拍 3 幅 RAW，计算该位置平均图像。原文示例从 0 到 64、步长 8，共 9 个位置、27 幅图。

<!-- Source EN PDF p.19, block 104 -->

3\. 校准

<!-- Source EN PDF p.19, block 105 -->

将第 2.1 节校准得到的 gainmap、马达位置参数以及各位置平均图像数据输入 pdaf_dccmap_calibration(...)，获得 dccmap 数据及其大小。

<!-- Source EN PDF p.19, block 106 -->

<!-- Source EN PDF p.19, block 107 -->

大小为 dccmap_width\*dccmap_height\*2 字节。原文此处还写：若选择 PD_OFFSET 校准，其值大小同时为 2bytes DCC_RSQ_THRESHOLD（原句语义不完整，保留待核对）。不满足线性阈值的块数超过一定数量时校准失败；应检查输入数据、调整环境并重新拍摄。

<!-- Source EN PDF p.19, block 108 -->

4\. 验证

<!-- Source EN PDF p.19, block 109 -->

本步骤检查当前 dccmap 是否正确，流程如下：

<!-- Source EN PDF p.19, block 110 -->

![英文原稿技术图, p.19](/docs/rockchip-camera-otp-calibration/assets/en-p19-figure1.png)

*英文原稿技术图, PDF p.19.*

<!-- Source EN PDF p.19, block 111 -->

1\. 验证图拍摄环境与 DCCmap 校准一致，镜头端面平行标准板，拍摄时标准板图案充满画面。

<!-- Source EN PDF p.19, block 112 -->

2\. 相机预热 3 分钟，将马达移到失焦位置 DAC0。

![原文公式, PDF p.19](/docs/rockchip-camera-otp-calibration/assets/en-p19-formula1.png)

`DAC0 ∈ (DACinf + 0.2 * abs(DACinf - DACmacro), DACinf + 0.8 * abs(DACinf - DACmacro)]`

<!-- Source EN PDF p.20, block 113 -->

马达稳定后拍摄三幅 Raw 并取平均，将 DAC0、平均图像、已校准 gainmap 和 dccmap 输入 pdaf_dccmap_vertification()，计算失焦图像对应的理想清晰位置 DAC1。

<!-- Source EN PDF p.20, block 114 -->

3\. 将马达移到 DAC1，在其前后 tolerance_factor\*abs(DACinf-DACmacro)+Δ（如 Δ=2）范围内拍摄五幅图。tolerance_factor 为验证容差，不同传感器的误差范围不同，如 5%、10%、20%。

<!-- Source EN PDF p.20, block 115 -->

验证时马达从位置 1 移动到位置 5；五个位置如下（例 tolerance_factor=10%、Δ=2）：

<!-- Source EN PDF p.20, block 116 -->

4.

| 序号 | 位置 |
|---|---|
| 1 | DAC1-10% *abs(DACinf-DACmacro)-Δ |
| 2 | DAC1-10% *abs(DACinf-DACmacro) |
| 3 | DAC1 |
| 4 | DAC1+10% *abs(DACinf-DACmacro) |
| 5 | DAC1+10% *abs(DACinf-DACmacro)+Δ |

<!-- Source EN PDF p.20, block 118 -->

5\. 将五幅图输入 pdaf_calc_sharpness(...)，计算中心区域 DCC_PERCENT_ROI_W\*DCC_PERCENT_ROI_H（如 30%\*30%）的清晰度，若存在峰值则验证成功。失败时增大 tolerance_factor 和 Δ（如 Δ 从 2 增至 5），重新采集 5 幅图并重复步骤 4。建议选择 PD 像素较少的通道计算清晰度。

<!-- Source EN PDF p.20, block 119 -->

![英文原稿技术图, p.20](/docs/rockchip-camera-otp-calibration/assets/en-p20-figure1.png)

*英文原稿技术图, PDF p.20.*

<!-- Source EN PDF p.21, block 120 -->

## 3. 校准接口方案

<!-- Source EN PDF p.21, block 121 -->

校准模块包括 AWB（自动白平衡）、LSC（镜头阴影校正）和 PDAF（相位检测自动对焦）。

<!-- Source EN PDF p.21, block 122 -->

### 3.1 AWB 校准

<!-- Source EN PDF p.21, block 123 -->

【功能说明】

<!-- Source EN PDF p.21, block 124 -->

此函数计算 raw 图像 ROI 的 R/G、B/G、Gr/Gb。

<!-- Source EN PDF p.21, block 125 -->

【函数原型】

<!-- Source EN PDF p.21, block 126 -->

```text
bool awb_otp_Calibrate(uint16_t* RawAddr, int width, int height, int roiw,
                       int roih, int bits, int bayer, int blc_r, int blc_gr,
                       int blc_gb, int blc_b, uint16_t* R, uint16_t* Gr,
                       uint16_t*Gb, uint16_t* B, uint16_t* R_G, uint16_t* B_G,
                       uint16_t* Gr_Gb)
```

<!-- Source EN PDF p.21, block 127 -->

【输入信息】

<!-- Source EN PDF p.21, block 128 -->

| 参数名 | 描述 |
|---|---|
| RawAddr | 产线上当前模组拍摄的 raw 图像数据 |
| width | raw 图像宽度 |
| height | raw 图像高度 |
| bits | 每像素位数。10bit=10 |
| roiw | ROI 区域宽度与图像宽度之比的倒数 |
| roih | ROI 区域高度与图像高度之比的倒数 |
| bayer | Raw 图像 Bayer 模式。BGGR=0，GBRG=1，GRBG=2，RGGB=3 |
| blc_r | R 通道 BLC |
| blc_gr | Gr 通道 BLC |
| blc_gb | Gb 通道 BLC |
| blc_b | B 通道 BLC |

<!-- Source EN PDF p.21, block 129 -->

【输出信息】

<!-- Source EN PDF p.22, block 130 -->

| 参数名 | 描述 |
|---|---|
| R | ROI 区域 R 通道均值 |
| Gr | ROI 区域 Gr 通道均值 |
| Gb | ROI 区域 Gb 通道均值 |
| B | ROI 区域 B 通道均值 |
| R_G | ROI 内 R 通道均值与 Gb 通道均值之比 *1024 |
| B_G | ROI 内 B 通道均值与 Gb 通道均值之比 *1024 |
| Gr_Gb | ROI 内 Gr 通道均值与 Gb 通道均值之比 *1024 |

<!-- Source EN PDF p.22, block 131 -->

【返回值】

<!-- Source EN PDF p.22, block 132 -->

=0：参数错误

<!-- Source EN PDF p.22, block 133 -->

=1：校准成功

<!-- Source EN PDF p.22, block 134 -->

### 3.2 LSC 校准

<!-- Source EN PDF p.22, block 135 -->

#### 3.2.1 LSC 校准

<!-- Source EN PDF p.22, block 136 -->

【功能说明】

<!-- Source EN PDF p.22, block 137 -->

此函数计算 raw 图像各通道增益。

<!-- Source EN PDF p.22, block 138 -->

【函数原型】

<!-- Source EN PDF p.22, block 139 -->

```text
bool lsc_otp_Calibrate(int vig,uint16_t* RawAddr, int width, int height,
                       int bits, int bayer, int blc_r, int blc_gr,
                       int blc_gb, int blc_b, float ratio, uint16_t* lsc_otp)
```

<!-- Source EN PDF p.22, block 140 -->

【输入信息】

<!-- Source EN PDF p.23, block 141 -->

| 参数名 | 描述 |
|---|---|
| vig | LSC 校正强度，默认 vig=70 (%) |
| RawAddr | 产线上当前模组拍摄的 raw 图像数据 |
| width | raw 图像宽度 |
| height | raw 图像高度 |
| bits | 每像素位数。10bit=10 |
| bayer | Raw 图像 Bayer 模式。BGGR=0，GBRG=1，GRBG=2，RGGB=3 |
| blc_r | R 通道 BLC |
| blc_gr | Gr 通道 BLC |
| blc_gb | Gb 通道 BLC |
| blc_b | B 通道 BLC |
| ratio | 衡量周边暗角是否对称的阈值，建议 ratio=1.5 |

<!-- Source EN PDF p.23, block 142 -->

【输出信息】

<!-- Source EN PDF p.23, block 143 -->

| 参数名 | 描述 |
|---|---|
| lsc_otp | LSC 增益：R、Gr、Gb、B 通道各为 17 * 17 |

<!-- Source EN PDF p.23, block 144 -->

【返回值】

<!-- Source EN PDF p.23, block 145 -->

=0：LSC 校准数据异常，暗角异常。

<!-- Source EN PDF p.23, block 146 -->

=1：校准成功

<!-- Source EN PDF p.23, block 147 -->

#### 3.2.2 LSC 验证

<!-- Source EN PDF p.23, block 148 -->

【功能说明】

<!-- Source EN PDF p.23, block 149 -->

此函数验证 LSC 校准结果。

<!-- Source EN PDF p.23, block 150 -->

【函数原型】

<!-- Source EN PDF p.24, block 151 -->

```text
bool lsc_otp_verify(uint16_t *RawAddr, int width, int height, int bits,
                    int bayer, int blc_r, int blc_gr, int blc_gb,
                    int blc_b, uint16_t *lsc_otp, int Ydiffer_down,
                    int Ydiffer_up, int ColorShading_down,
                    int ColorShading_up, float *fYdiffer,
                    float *fRGCorner,float *fBGCorner)
```

<!-- Source EN PDF p.24, block 152 -->

【输入信息】

<!-- Source EN PDF p.24, block 153 -->

| 参数名 | 描述 |
|---|---|
| RawAddr | 产线上当前模组拍摄的 raw 图像数据 |
| width | raw 图像宽度 |
| height | raw 图像高度 |
| bits | 每像素位数。10bit=10 |
| bayer | Raw 图像 Bayer 模式。BGGR=0，GBRG=1，GRBG=2，RGGB=3 |
| blc_r | R 通道 BLC |
| blc_gr | Gr 通道 BLC |
| blc_gb | Gb 通道 BLC |
| blc_b | B 通道 BLC |
| lsc_otp | 由 lsc_otp_Calibrate 计算输出的 lsc_otp |
| Ydiffer_down | 校准控制指标 YShading_Corner_Max - YShading_Corner_Min 的下限，以百分比表示 |
| Ydiffer_up | 校准控制指标 YShading_Corner_Max - YShading_Corner_Min 的上限，以百分比表示 |
| ColorShading_down | 校准控制指标 abs((R/G_Corner)/(R/G_Center)-1)、abs((B/G_Corner)/(B/G_Center)-1) 的下限，以百分比表示 |
| ColorShading_up | 校准控制指标 abs((R/G_Corner)/(R/G_Center)-1)、abs((B/G_Corner)/(B/G_Center)-1) 的上限，以百分比表示 |

<!-- Source EN PDF p.24, block 154 -->

【输出信息】

<!-- Source EN PDF p.25, block 155 -->

| 参数名 | 描述 |
|---|---|
| fYdiffer | YShading_Corner_Max - YShading_Corner_Min 的值 |
| fRGCorner | 各块 abs((R/G_Corner)/(R/G_Center)-1) 的值，共 5 x 5 块 |
| fBGCorner | 各块 abs((B/G_Corner)/(B/G_Center)-1) 的值，共 5 x 5 块 |

<!-- Source EN PDF p.25, block 156 -->

【返回值】

<!-- Source EN PDF p.25, block 157 -->

=0：不满足校准后的管控指标，验证失败。

<!-- Source EN PDF p.25, block 158 -->

=1：验证成功

<!-- Source EN PDF p.26, block 159 -->

### 3.3 PDAF 校准

<!-- Source EN PDF p.26, block 160 -->

#### 3.3.1 获取传感器配置

<!-- Source EN PDF p.26, block 161 -->

【功能说明】

<!-- Source EN PDF p.26, block 162 -->

配置 sensor.ini，从该文件获取 PD 传感器信息。

<!-- Source EN PDF p.26, block 163 -->

【配置内容】

<!-- Source EN PDF p.26, block 164 -->

[sensor config]

<!-- Source EN PDF p.27, block 165 -->

| 关键字 | 描述 |
|---|---|
| RAW_WIDTH | Raw 图像宽度 |
| RAW_HEIGHT | Raw 图像高度 |
| RAW_BITS | 像素值位宽 |
| RAW_BLACK_LEVEL | 黑电平值 |
| RAW_BAYER_PATTERN | Raw 图像 Bayer 排列。0:BGGR，1:GBRG，2:GRBG，3:RGGB |
| SENSOR_TYPE | 0：shieldPD 或 1x2OCL；1：水平和垂直 (LR&TB)；2：保留；3：保留 |
| PD_DUAL_MODE | 0：非 dual；1：dual PD |
| PD_BINNING_TYPE | 使用 binning PD 校准；0:OFF；1:ON |
| MIPI_MIX_MODE | 0：数据仅含 raw 或 PD；1：数据同时包含 raw 和 PD。仅在 PD_DUAL_MODE=1 时有效。 |
| PD_OFFSET_X | PD 块的 x 偏移 |
| PD_OFFSET_Y | PD 块的 y 偏移 |
| PD_PITCH_X | PD 块的 x 间距 |
| PD_PITCH_Y | PD 块的 y 间距 |
| PD_DENSITY_X | 一对 L/R PD 像素的 x 间隔 |
| PD_DENSITY_Y | 一对 L/R PD 像素的 y 间隔 |
| PD_BLOCK_NUM_X | 沿 x 方向的 PD 块总数 |
| PD_BLOCK_NUM_Y | 沿 y 方向的 PD 块总数 |
| CALB_S_LEVEL | 饱和级别，默认 100 |
| CALB_S_CNT | 饱和计数，默认 10 |
| PD_POS_L | 一个 PD 块内 L PD 像素的位置 |
| PD_POS_R | 一个 PD 块内 R PD 像素的位置 |

<!-- Source EN PDF p.27, block 166 -->

dual 类型

<!-- Source EN PDF p.27, block 167 -->

[sensor config]

<!-- Source EN PDF p.28, block 168 -->

| 关键字 | 描述 |
|---|---|
| RAW_WIDTH | Raw 图像宽度 |
| RAW_HEIGHT | Raw 图像高度 |
| LR_WIDTH | PD 图像宽度 |
| LR_HEIGHT | PD 图像高度 |
| RAW_BITS | 像素值位宽 |
| RAW_BLACK_LEVEL | 黑电平值 |
| RAW_BAYER_PATTERN | Raw 图像 Bayer 排列。0:BGGR，1:GBRG，2:GRBG，3:RGGB |
| SENSOR_TYPE | 0：shieldPD 或 1x2OCL；1：水平和垂直 (LR&TB)；2：保留；3：保留 |
| PD_DUAL_MODE | 0：非 dual；1：dual PD |
| PD_BINNING_TYPE | 使用 binning PD 校准；0:OFF；1:ON |
| MIPI_MIX_MODE | 0：数据仅含 raw 或 PD；1：数据同时包含 raw 和 PD。仅在 PD_DUAL_MODE=1 时有效。 |
| PD_OFFSET_X | PD 块的 x 偏移 |
| PD_OFFSET_Y | PD 块的 y 偏移 |
| PD_PITCH_X | PD 块的 x 间距 |
| PD_PITCH_Y | PD 块的 y 间距 |
| PD_DENSITY_X | 一对 L/R PD 像素的 x 间隔 |
| PD_DENSITY_Y | 一对 L/R PD 像素的 y 间隔 |
| PD_BLOCK_NUM_X | 沿 x 方向的 PD 块总数 |
| PD_BLOCK_NUM_Y | 沿 y 方向的 PD 块总数 |
| CALB_S_LEVEL | 饱和级别，默认 100 |
| CALB_S_CNT | 饱和计数，默认 10 |
| PD_POS_L | 一个 PD 块内 L PD 像素的位置 |
| PD_POS_R | 一个 PD 块内 R PD 像素的位置 |

<!-- Source EN PDF p.28, block 169 -->

[Gainmap_Calib]

<!-- Source EN PDF p.29, block 170 -->

| 关键字 | 描述 |
|---|---|
| GAINMAP_BLKSZ_W | 一个 gainmap 块的宽度 |
| GAINMAP_BLKSZ_H | 一个 gainmap 块的高度 |
| GAIN_CALIB_INPUT_MAX | 输入 raw 图像级别上限：920(raw10) |
| GAIN_CALIB_INPUT_MIN | 输入 raw 图像级别下限：800(raw10) |
| GAIN_VERIFY_DIFF_MAX | 增益处理后的 L/R 差异级别 (5%*1024) |
| CROSS_VER | 使用其他图像验证 gainmap |

<!-- Source EN PDF p.29, block 171 -->

[DCCmap_Calib]

<!-- Source EN PDF p.29, block 172 -->

| 关键字 | 描述 |
|---|---|
| DCCMAP_BLKSZ_W | 一个 dccmap 块的宽度 |
| DCCMAP_BLKSZ_H | 一个 dccmap 块的高度 |
| DCC_CALIBRATE_MODE | DCC 校准模式，默认 1 |
| DCC_LENS_BEGIN | 采样起始码值位置 |
| DCC_LENS_END | 采样结束码值位置 |
| DCC_LENS_INTERVAL | 采样码值间隔 |
| DCC_RSQ_THRESHOLD | RSQ 矩阵阈值 |
| DCC_BORDER_RSQ_THRESHOLD | RSQ 边界矩阵阈值 |
| DCC_BAD_RSQ_NUM_RATIO | 不合格 RSQ 矩阵数量的比例 |
| DCC_CALIB_INPUT_MAX | 输入 raw 图像级别上限：640(raw10) 或 160(raw8) |
| DCC_CALIB_INPUT_MIN | 输入 raw 图像级别下限：340(raw10) 或 85(raw8) |
| DCC_CALIB_PD_RANGE | 像素视差搜索半径 |
| DCC_VERIFY_CAF_DIFF_MAX | DAC 范围阈值 (%) |
| DCC_VERIFY_CAF_DIFF_DET | DAC 范围的 delta(DAC) |
| CALIB_TARGET_PEAK_OFFSET_LOG | 将 FV 峰值信息保存至 PDAFFVLog.txt。1:ON，0:OFF |
| CALIB_TARGET_PEAK_OFFSET | FV 峰值判据中的 PD 目标偏移，默认 0 |
| DCC_PERCENT_ROI_W | 测试图像 ROI 宽度 |
| DCC_PERCENT_ROI_H | 测试图像 ROI 高度 |
| DCC_SHARPNESS_MODE | 清晰度计算模式，默认 1 |
| DCC_SHARPNESS_CHL | 清晰度计算通道：0:origin raw；1:red；2:green（默认）；3:blue；4:demosaic |

<!-- Source EN PDF p.30, block 173 -->

[optional params]

<!-- Source EN PDF p.30, block 174 -->

| 关键字 | 描述 |
|---|---|
| QUALITY_VERIFY_ENABLE | 启用 gainmap 校准质量测试 |
| QUALTI_LRDiff_L_MIN | L/R 差异判据 (block1,2,3) |
| QUALTI_LRDiff_L_MAX | L/R 差异判据 (block1,2,3) |
| QUALTI_LRDiff_C_MIN | L/R 差异判据 (block4,5,6) |
| QUALTI_LRDiff_C_MAX | L/R 差异判据 (block4,5,6) |
| QUALTI_LRDiff_R_MIN | L/R 差异判据 (block7,8,9) |
| QUALTI_LRDiff_R_MAX | L/R 差异判据 (block7,8,9) |
| QUALITY_SENSITIVITY_MIN | 灵敏度判据 |

<!-- Source EN PDF p.30, block 175 -->

【示例】

<!-- Source EN PDF p.30, block 176 -->

以 IMX258 的 PD 像素分布为例，如图：

<!-- Source EN PDF p.30, block 177 -->

![英文原稿技术图, p.30](/docs/rockchip-camera-otp-calibration/assets/en-p30-figure1.png)

*英文原稿技术图, PDF p.30.*

<!-- Source EN PDF p.30, block 178 -->

根据图示，sensor.ini 内容如下：

<!-- Source EN PDF p.30, block 179 -->

```text
[sensor config]
RAW_WIDTH =4208
RAW_HEIGHT =3120
RAW_BITS =12
RAW_BLACK_LEVEL =64
RAW_BAYER_PATTERN =0
SENSOR_TYPE=0
PD_DUAL_MODE=0
PD_BINNING_TYPE=0
PD_OFFSET_X =24
PD_OFFSET_Y =24
PD_PITCH_X =32
PD_PITCH_Y =32
PD_DENSITY_X =16
PD_DENSITY_Y =16
PD_BLOCK_NUM_X =130
PD_BLOCK_NUM_Y =96
CALB_S_LEVEL=1000
CALB_S_CNT=10
PD_POS_L=
[26 29]
[42 29]
[33 48]
[49 48]; #end with a ";"
PD_POS_R=
[25 32]
[41 32]
[34 45]
[50 45]; #end with a ";"
[Gainmap_Calib]
GAINMAP_BLKSZ_W=16
GAINMAP_BLKSZ_H=16
GAIN_CALIB_INPUT_MAX=920
GAIN_CALIB_INPUT_MIN=800
GAIN_VERIFY_DIFF_MAX=5
CROSS_VER=1
[DCCmap_Calib]
DCCMAP_BLKSZ_W=32
DCCMAP_BLKSZ_H=32
DCC_CALIBRATE_MODE=1
DCC_LENS_BEGIN=0
DCC_LENS_END=64
DCC_LENS_INTERVAL=8
DCC_RSQ_THRESHOLD=0.985
DCC_BORDER_RSQ_THRESHOLD=0.97
DCC_BAD_RSQ_NUM_RATIO=0.05
DCC_CALIB_INPUT_MAX=640
DCC_CALIB_INPUT_MIN=340
DCC_VERIFY_CAF_DIFF_MAX=10
DCC_VERIFY_CAF_DIFF_DET=2
CALIB_TARGET_PEAK_OFFSET_LOG=0
CALIB_TARGET_PEAK_OFFSET=0
DCC_PERCENT_ROI_W=0.4
DCC_PERCENT_ROI_H=0.4
DCC_SHARPNESS_MODE=1
DCC_SHARPNESS_CHL=1
[optional params]
QUALITY_VERIFY_ENABLE=1
QUALTI_LRDiff_L_MIN=0.4
QUALTI_LRDiff_L_MAX=2.5
QUALTI_LRDiff_C_MIN=0.55
QUALTI_LRDiff_C_MAX=1.8
QUALTI_LRDiff_R_MIN=0.4
QUALTI_LRDiff_R_MAX=2.5
QUALITY_SENSITIVITY_MIN=0.45
```

<!-- Source EN PDF p.32, block 183 -->

【函数原型】

<!-- Source EN PDF p.32, block 184 -->

```text
bool pdaf_initial(char* filename, sensor_cfg* psensor_cfg)
```

<!-- Source EN PDF p.32, block 185 -->

【输入信息】

<!-- Source EN PDF p.32, block 186 -->

| 参数名 | 描述 |
|---|---|
| filename | Sensor.ini 文件的完整路径 |

<!-- Source EN PDF p.32, block 187 -->

【输出信息】

<!-- Source EN PDF p.32, block 188 -->

| 参数名 | 描述 |
|---|---|
| psensor_cfg | 保存 sensor.ini 内容的结构体指针 |

<!-- Source EN PDF p.32, block 189 -->

【返回值】

<!-- Source EN PDF p.32, block 190 -->

=0：获取 sensor.ini 失败。

<!-- Source EN PDF p.32, block 191 -->

=1：成功获取 sensor.ini。

<!-- Source EN PDF p.32, block 192 -->

#### 3.3.2 Gain Map 校准

<!-- Source EN PDF p.32, block 193 -->

【功能说明】

<!-- Source EN PDF p.32, block 194 -->

此函数用于 PDAF gain map 的标定。

<!-- Source EN PDF p.32, block 195 -->

【函数原型】

<!-- Source EN PDF p.32, block 196 -->

```text
bool pdaf_gainmap_calibration(uint16_t *RawAddr, sensor_cfg* psensor_cfg,
                              uint16_t *gainmap_lut,int* gainmap_width,
                              int* gainmap_height)
```

<!-- Source EN PDF p.32, block 197 -->

【输入信息】

<!-- Source EN PDF p.32, block 198 -->

| 参数名 | 描述 |
|---|---|
| RawAddr | 产线上当前模组拍摄的 raw 图像数据 |
| psensor_cfg | 保存 sensor.ini 内容的结构体指针 |

<!-- Source EN PDF p.32, block 199 -->

【输出信息】

<!-- Source EN PDF p.33, block 200 -->

| 参数名 | 描述 |
|---|---|
| gainmap_lut | 校准后的 gain map |
| gainmap_width | 所得 gain map 宽度 |
| gainmap_height | 校准所得 gain map 高度 |

<!-- Source EN PDF p.33, block 201 -->

【返回值】

<!-- Source EN PDF p.33, block 202 -->

=0：参数错误

<!-- Source EN PDF p.33, block 203 -->

=1：校准成功

<!-- Source EN PDF p.33, block 204 -->

#### 3.3.3 Gain Map 验证

<!-- Source EN PDF p.33, block 205 -->

【功能说明】

<!-- Source EN PDF p.33, block 206 -->

此函数验证已校准 gain map 是否满足要求。

<!-- Source EN PDF p.33, block 207 -->

【函数原型】

<!-- Source EN PDF p.33, block 208 -->

```text
bool pdaf_gainmap_vertification(uint16_t *RawAddr, sensor_cfg* psensor_cfg,
                                uint16_t *gainmap_lut)
```

<!-- Source EN PDF p.33, block 209 -->

【输入信息】

<!-- Source EN PDF p.33, block 210 -->

| 参数名 | 描述 |
|---|---|
| RawAddr | 产线上当前模组拍摄的 raw 图像数据 |
| psensor_cfg | 保存 sensor.ini 内容的结构体指针 |
| gainmap_lut | 由 pdaf_gainmap_calibration 得到的 gain map |

<!-- Source EN PDF p.33, block 211 -->

【返回值】

<!-- Source EN PDF p.33, block 212 -->

=0：验证失败，所用 gainmap 不满足要求。

<!-- Source EN PDF p.33, block 213 -->

=1：验证成功

<!-- Source EN PDF p.33, block 214 -->

#### 3.3.4 DCC Map 校准

<!-- Source EN PDF p.33, block 215 -->

【功能说明】

<!-- Source EN PDF p.33, block 216 -->

此函数用于 PDAF DCC MAP 校准。

<!-- Source EN PDF p.33, block 217 -->

【函数原型】

<!-- Source EN PDF p.33, block 218 -->

```text
bool pdaf_dccmap_calibration(uint16_t *RawAddrAll , sensor_cfg* psensor_cfg,
                             uint16_t *gainmap_lut, uint16_t *dccmap_lut,
                             int* dccmap_width,int* dccmap_height,
                             uint8_t* dccSign,wchar_t*pd_offset)
```

<!-- Source EN PDF p.34, block 219 -->

【输入信息】

<!-- Source EN PDF p.34, block 220 -->

| 参数名 | 描述 |
|---|---|
| RawAddrAll | 在各马达位置采集的平均图像数据序列 |
| psensor_cfg | 保存 sensor.ini 内容的结构体指针 |
| gainmap_lut | 由 pdaf_gainmap_calibration 得到的 gain map |

<!-- Source EN PDF p.34, block 221 -->

【输出信息】

<!-- Source EN PDF p.34, block 222 -->

| 参数名 | 描述 |
|---|---|
| dccmap_lut | 所得 DCC MAP |
| dccmap_width | 所得 DCC map 宽度 |
| dccmap_height | 所得 DCC MAP 高度 |
| dccSign | 校准得到的 DCC MAP 方向 |
| pd_offset | 校准得到的 pd_offset |

<!-- Source EN PDF p.34, block 223 -->

【返回值】

<!-- Source EN PDF p.34, block 224 -->

=0：校准失败。

<!-- Source EN PDF p.34, block 225 -->

=1：校准成功

<!-- Source EN PDF p.34, block 226 -->

#### 3.3.5 DCC Map 验证

<!-- Source EN PDF p.34, block 227 -->

验证 dcc map 是否满足要求，包括 pdaf_dccmap_vertification() 和 pdaf_calc_sharpness() 两个接口。

<!-- Source EN PDF p.34, block 228 -->

【功能说明】

<!-- Source EN PDF p.34, block 229 -->

使用已校准 dcc map 获取失焦图像的理想清晰位置 DAC1。

<!-- Source EN PDF p.34, block 230 -->

【函数原型】

<!-- Source EN PDF p.34, block 231 -->

```text
uint16_t pdaf_dccmap_vertification(uint16_t *RawAddr, sensor_cfg* psensor_cfg,
                                   int cur_pos_id, uint16_t *gainmap_lut,
                                   uint16_t *dccmap_lut, uint8_t dccSign, wchar_t
*pd_offset)
```

<!-- Source EN PDF p.34, block 232 -->

【输入信息】

<!-- Source EN PDF p.35, block 233 -->

| 参数名 | 描述 |
|---|---|
| RawAddr | 所拍摄模糊图像的平均图像数据 |
| psensor_cfg | 保存 sensor.ini 内容的结构体指针 |
| cur_pos_id | 拍摄模糊图像时的当前马达位置 |
| gainmap_lut | 由 pdaf_gainmap_calibration 校准的 gain map |
| dccmap_lut | 由 pdaf_dccmap_calibration 校准的 dcc map |
| dccSign | 由 pdaf_dccmap_calibration 校准的 dccSign |
| pd_offset | 由 pdaf_dccmap_calibration 校准得到的 pd_offset |

<!-- Source EN PDF p.35, block 234 -->

【返回值】

<!-- Source EN PDF p.35, block 235 -->

失焦图像达到理想清晰对焦时的马达位置 DAC1。

<!-- Source EN PDF p.35, block 236 -->

【功能说明】

<!-- Source EN PDF p.35, block 237 -->

在 DAC1 前后 DCC_VERIFY_CAF_DIFF_MAX\*abs(DACinf-DACmacro)+DCC_VERIFY_CAF_DIFF_DET 范围内计算图像中心区域清晰度，判断是否有峰值。

<!-- Source EN PDF p.35, block 238 -->

【函数原型】

<!-- Source EN PDF p.35, block 239 -->

```text
bool pdaf_calc_sharpness(uint16_t *RawAddrAll, int img_num, sensor_cfg*
psensor_cfg)
```

<!-- Source EN PDF p.35, block 240 -->

【输入信息】

<!-- Source EN PDF p.35, block 241 -->

| 参数名 | 描述 |
|---|---|
| RawAddrAll | DAC1 前后 valid_toerance*abs (DACinf-DACmacro)+2 范围内的平均图像数据序列 |
| img_num | RawAddrAll 中包含的图像数 |
| psensor_cfg | 保存 sensor.ini 内容的结构体指针 |

<!-- Source EN PDF p.35, block 242 -->

【返回值】

<!-- Source EN PDF p.35, block 243 -->

=0：没有找到清晰度峰值，验证失败。

<!-- Source EN PDF p.35, block 244 -->

=1：验证成功

<!-- Source EN PDF p.36, block 245 -->

## 4. 附录

<!-- Source EN PDF p.36, block 246 -->

### 4.1 OTP 应用示例代码

<!-- Source EN PDF p.36, block 247 -->

```text
#include <iostream>
#include "RKOTPDLL.h"
#include <stdlib.h>
int main()
{
    int ret = 0;
    #LSC AWB Otp Calibration
    ret =lsc_awbtest();
    #Pdaf Otp Calibration
    uint16_t gainmap[30*30 * 2];
    uint16_t dccmap[20 * 20 * 2];
    uint16_t code = 0;
    int gainmap_width = 0;
    int gainmap_height = 0;
    int dccmap_width = 0;
    int dccmap_height = 0;
    uint8_t dcc_Sign = 0;
    wchar_t pd_offset=0xffff;
    int curpos = 864;
    sensor_cfg sensor_param;
    if (pdaf_initial("D:\\testdll\\testdll\\sensor_ov16A10.ini", &sensor_param))
    {
        if (gainmaptest(&sensor_param, gainmap,&gainmap_width,&gainmap_height))
        {
        if (dccmaptest(&sensor_param, gainmap, dccmap, curpos, &code,
&dccmap_width, &dccmap_height, &dcc_Sign,&pd_offset))
            {
                ret = dcc_calc_sharpness(&sensor_param);
            }
        }
    }
}
bool lsc_awbtest()
{
    int vig=70;
    int height = 1944;
    int width = 2592;
    int bits =10;#10bit
    int bayer =0;#BGGR
    int roiw =5;#1/5 width
    int roih =5;#1/5 height
    int blc[4]={ 64, 64, 64, 64};
    uint16_t lsctable[17*17*4];
    uint16_t awb[3];
    uint16_t Rave =0;
    uint16_t Grave =0;
    uint16_t Gbave =0;
    uint16_t Bave =0;
    int Ydiffer_down =0;#%
    int Ydiffer_up =5;#%
    int ColorShading_down =0;#%
    int ColorShading_up =5;#%
    float Ydiffer = 0;
    float RGconer[25];
    float BGconer[25];
    bool ret =0;
    uint16_t *Rawdata = NULL;
    Rawdata = (uint16_t*)malloc(width * height * 2);
    memset(Rawdata, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    fp = fopen("input.raw", "rb");
    if (fp == NULL)
    {
        return false;
    }
    fread(Rawdata, 1, height * width * 2, fp);
    fclose(fp);
    ret =lsc_otp_Calibrate(vig,Rawdata, width, height, bits, bayer, blc[0],
blc[1],blc[2], blc[3],lsctable);
    ret = awb_otp_Calibrate(Rawdata, width, height,roiw,roih, bits, bayer,
blc[0], blc[1],blc[2], blc[3],&Rave,&Grave,&Gbave,&Bave, &awb[0], &awb[1],
&awb[2]);
    ret = lsc_otp_verify(Rawdata, width, height, bits, bayer, blc[0], blc[1],
blc[2], blc[3], lsctable, Ydiffer_down, Ydiffer_up, ColorShading_down,
ColorShading_up, &Ydiffer, RGconer, BGconer);
    if(!ret)
    {
        return false; #The calibrated data does not meet the control standards and the verification fails.
    }
    if(Rawdata!=NULL)
    {
        free (Rawdata);
        Rawdata =NULL;
    }
    return ret;
}
int gainmaptest(sensor_cfg* psensor_cfg, uint16_t *gainmap_lut,int *
gainmap_width, int *gainmap_height)
{
    int ret = 0;
    int height = psensor_cfg->height;
    int width = psensor_cfg->width;
    uint16_t maxval = (1 << psensor_cfg->bits) - 1;
    int gainmapfilenum = 3;
    int over_exp_cnt = 0;
    if (psensor_cfg->pd_dual_mode && psensor_cfg->mipi_mix_mode)
    {
        height = psensor_cfg->height + (psensor_cfg->sensor_type+1)*psensor_cfg->pd_height;
    }
    uint16_t *ave_pixelbuf = NULL;
    ave_pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    uint16_t *sum_pixelbuf = NULL;
    sum_pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(sum_pixelbuf, 0, sizeof(uint16_t)* width * height);
    uint16_t *pixelbuf = NULL;
    pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    char prename[20] = "gainRAW";
    char endname[5] = ".raw";
    for (int i = 0; i < gainmapfilenum; i++)
    {
        char temp[20];
        char id[5];
        int idint = i + 1;
        strcpy(temp, prename);
        _itoa_s(idint, id, 10);
        strcat(temp, id);
        strcat(temp, endname);
        fp = fopen(temp, "rb");
        if (fp == NULL)
        {
            return false;
        }
        fread(pixelbuf, 1, height * width * 2, fp);
        fclose(fp);
        for (int j = 0; j < height; j++)
        {
            for (int i = 0; i < width; i++)
            {
                uint32_t tempbuf = *(pixelbuf + j*width + i);
                *(sum_pixelbuf + j*width + i) = tempbuf + *(sum_pixelbuf +
j*width + i);
                if (tempbuf >= maxval)
                    over_exp_cnt++;
            }
        }
    }
    for (int j = 0; j < height; j++)
    {
        for (int i = 0; i < width; i++)
        {
            *(ave_pixelbuf + j*width + i) = *(sum_pixelbuf + j*width + i) /
gainmapfilenum;
        }
    }
    ret = pdaf_gainmap_calibration(ave_pixelbuf, psensor_cfg, gainmap_lut,
gainmap_width,gainmap_height);
    ret = pdaf_gainmap_vertification(ave_pixelbuf, psensor_cfg, gainmap_lut);
    if(ret == -1)
        printf("gainmap image OVER exposure!!!");
    if (ave_pixelbuf!=NULL)
    {
        free(ave_pixelbuf);
        ave_pixelbuf = NULL;
    }
    if (pixelbuf != NULL)
    {
        free(pixelbuf);
        pixelbuf = NULL;
    }
    if (sum_pixelbuf != NULL)
    {
        free(sum_pixelbuf);
        sum_pixelbuf = NULL;
    }
    return ret;
}
bool dccmaptest(sensor_cfg* psensor_cfg, uint16_t *gainmap_lut, uint16_t
*dccmap_lut, int curpos , uint16_t *code, int *dccmap_width, int *dccmap_height,
uint8_t *dcc_Sign,wchar_t *pdaf_offset)
{
    int ret = 0;
    int lens_begin = 0;
    int lens_end = 64;
    int lens_interval = 8;
    int height = psensor_cfg->height;
    int width = psensor_cfg->width;
    int lensnum = (lens_end - lens_begin) / lens_interval + 1;
    if (psensor_cfg->pd_dual_mode && psensor_cfg->mipi_mix_mode)
    {
        height = psensor_cfg->height + (psensor_cfg->sensor_type +
1)*psensor_cfg->pd_height;
    }
    uint16_t *ave_pixelbuf = NULL;
    ave_pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    uint16_t *Rawdata = NULL;
    Rawdata = (uint16_t*)malloc(width * height * 2 * lensnum);
    memset(Rawdata, 0, sizeof(uint16_t)* width * height* lensnum);
    uint16_t *pixelbuf= NULL;
    pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    char prename[20] = "dccRAW";
    char endname[5] = ".raw";
    for (int a = 0;a <lensnum;a++)
    {
        char temp[20];
        char id[5] ;
        int id1 = a + 1;
        strcpy(temp,prename);
        _itoa_s(id1, id, 10);
        strcat(temp, id);
        for (int b = 0; b < 3;b++)
        {
            char name[20];
            strcpy(name, temp);
            int id2 = b + 1;
            _itoa_s(id2, id, 10);
            strcat(name, id);
            strcat(name, endname);
            fp = fopen(name, "rb");
            if (fp == NULL)
            {
                return false;
            }
            fread(pixelbuf, 1, height * width * 2, fp);
            fclose(fp);
            for (int j = 0; j < height; j++)
            {
                for (int i = 0; i < width; i++)
                {
                    uint16_t tempbuf = *(ave_pixelbuf + j*width + i);
                    *(ave_pixelbuf + j*width + i) = tempbuf + *(pixelbuf +
j*width + i) / 3;
                }
            }
        }
        memcpy(Rawdata + a*height * width, ave_pixelbuf, sizeof(uint16_t)*height
* width);
        memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    }
    ret = pdaf_dccmap_calibration(Rawdata, psensor_cfg, gainmap_lut, dccmap_lut,
dccmap_width, dccmap_height, dcc_Sign,pd_offset);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    char prename1[20] = "image";
    for (int i = 0; i < 3; i++)
    {
        char temp[20];
        char id[5];
        int idint = i + 1;
        strcpy(temp, prename1);
        _itoa_s(idint, id, 10);
        strcat(temp, id);
        strcat(temp, endname);
        fp = fopen(temp, "rb");
        if (fp == NULL)
        {
            return false;
        }
        fread(pixelbuf, 1, height * width * 2, fp);
        fclose(fp);
        for (int j = 0; j < height; j++)
        {
            for (int i = 0; i < width; i++)
            {
                uint16_t tempbuf = *(ave_pixelbuf + j*width + i);
                *(ave_pixelbuf + j*width + i) = tempbuf + *(pixelbuf + j*width +
i) / 3;
            }
        }
    }
        *code = pdaf_dccmap_vertification(ave_pixelbuf, psensor_cfg, curpos,
gainmap_lut, dccmap_lut, *dcc_Sign,pd_offset);
    if (ave_pixelbuf != NULL)
    {
        free(ave_pixelbuf);
        ave_pixelbuf = NULL;
    }
    if (pixelbuf != NULL)
    {
        free(pixelbuf);
        pixelbuf = NULL;
    }
    if (Rawdata != NULL)
    {
        free(Rawdata);
        Rawdata = NULL;
    }
    return ret;
}
bool dcc_calc_sharpness(sensor_cfg* psensor_cfg)
{
    int height = psensor_cfg->height;
    int width = psensor_cfg->width;
    int imgnum = 5;
    if (psensor_cfg->pd_dual_mode && psensor_cfg->mipi_mix_mode)
    {
        height = psensor_cfg->height + (psensor_cfg->sensor_type +
1)*psensor_cfg->pd_height;
    }
    uint16_t *Rawdata = NULL;
    Rawdata = (uint16_t*)malloc(width * height * 2 * imgnum);
    memset(Rawdata, 0, sizeof(uint16_t)* width * height* imgnum);
    uint16_t *pixelbuf = NULL;
    pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    char prename[20] = "calimage";
    char endname[5] = ".raw";
    for (int i = 0; i < imgnum; i++)
    {
        char temp[20];
        char id[5];
        int idint = i + 1;
        strcpy(temp, prename);
        _itoa_s(idint, id, 10);
        strcat(temp, id);
        strcat(temp, endname);
        fp = fopen(temp, "rb");
        if (fp == NULL)
        {
            return false;
        }
        fread(pixelbuf, 1, height * width * 2, fp);
        fclose(fp);
        memcpy(Rawdata + i*height * width, pixelbuf, sizeof(uint16_t)*height *
width);
    }
    bool ret=pdaf_calc_sharpness(Rawdata, imgnum, psensor_cfg);
    if (pixelbuf != NULL)
    {
        free(pixelbuf);
        pixelbuf = NULL;
    }
    if (Rawdata != NULL)
    {
        free(Rawdata);
        Rawdata = NULL;
    }
    return ret;
}
```

<!-- Source EN PDF p.43, block 259 -->

### 4.2 烧录封装数据格式

<!-- Source EN PDF p.43, block 260 -->

如下表，可按需烧录指定块，但不能更改块 ID；所需块烧录完成后还需烧录结束值 0xff。

<!-- Source EN PDF p.43, block 261 -->

| 长度(Byte) | 数据项 | 说明 |
|---|---|---|
| 8 | 标志 | ROCKCHIP |
| 1 | ID | ID=0，传感器信息 |
| 4 | 大小 | 块数据大小 |
|  | 块数据 |  |
| 1 | ID | ID=1，AWB 校准 |
| 4 | 大小 | 块数据大小 |
|  | 块数据 |  |
| 1 | ID | ID=2，LSC 校准 |
| 4 | 大小 | 块数据大小 |
|  | 块数据 |  |
| 1 | ID | ID=3，PDAF 校准 |
| 4 | 大小 | 块数据大小 |
|  | 块数据 |  |
| 1 | ID | ID=4，AF 码值 |
| 4 | 大小 | 块数据大小 |
|  | 块数据 |  |
| 1 | ID | ID=5，QSC |
| 4 | 大小 | 块数据大小 |
|  | 块数据 |  |
| ... | ... | ... |
| 1 | 0xFF | 结束标志 |

<!-- Source EN PDF p.43, block 262 -->

各块具体内容如下。多字节数据统一采用大端模式：高字节存低地址，低字节存高地址。

<!-- Source EN PDF p.44, block 263 -->

| 偏移地址 | 长度(Byte) | 数据项 | 说明 |
|---|---|---|---|
| 0x0000 | 8 | 标志 | ROCKCHIP |
| 0x0008 | 1 | ID | ID=0，传感器信息 |
| 0x0009 | 4 | 大小 | Size=35 |
| 0x000D | 2 | 版本 | Sensor Info 版本：v1.0.8=0x0108 |
| 0x000F | 1 | 供应商 ID | 用户指定 |
| 0x0010 | 1 | 日期：年 | 例如 2021 年写 21 |
| 0x0011 | 1 | 日期：月 | 例如 7 月写 7 |
| 0x0012 | 1 | 日期：日 | 例如 12 日写 12 |
| 0x0013 | 1 | Sensor ID | 用户指定 |
| 0x0014 | 1 | Lens ID | 用户指定 |
| 0x0015 | 1 | VCM ID | 用户指定 |
| 0x0016 | 1 | Driver ID | 用户指定 |
| 0x0017 | 4 | Module ID | 用户指定 |
| 0x001B | 1 | mirror/flip | Bit[7:4]:Mirror（镜像）；Bit[3:0]:Flip（翻转）；ON: 1，OFF: 0 |
| 0x001C | 1 | Full Width H | 全尺寸宽度高字节 |
| 0x001D | 1 | Full Width L | 全尺寸宽度低字节 |
| 0x001E | 1 | Full Height H | 全尺寸高度高字节 |
| 0x001F | 1 | Full Height L | 全尺寸高度低字节 |
| 0x0020 | 15 | 保留 | Reserved=0xff |
| 0x002F | 1 | 校验和 | Sensor Info 校验和；Sum(0x0009~0x002E) % 255+1 |

<!-- Source EN PDF p.45, block 264 -->

| 偏移地址 | 长度(Byte) | 数据项 | 说明 |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=1，AWB 校准 |
| 0x0001 | 4 | 大小 | Size=43 |
| 0x0005 | 2 | 版本 | AWB 版本：v1.0.9=0x0109 |
| 0x0007 | 1 | R/G_H | 当前 R/G 高字节 |
| 0x0008 | 1 | R/G_L | 当前 R/G 低字节 |
| 0x0009 | 1 | B/G_H | 当前 B/G 高字节 |
| 0x000A | 1 | B/G_L | 当前 B/G 低字节 |
| 0x000B | 1 | Gr/Gb_H | 当前 Gr/Gb 高字节 |
| 0x000C | 1 | Gr/Gb_L | 当前 Gr/Gb 低字节 |
| 0x000D | 1 | R/G_H | Golden 参考 R/G 高字节 |
| 0x000E | 1 | R/G_L | Golden 参考 R/G 低字节 |
| 0x000F | 1 | B/G_H | Golden 参考 B/G 高字节 |
| 0x0010 | 1 | B/G_L | Golden 参考 B/G 低字节 |
| 0x0011 | 1 | Gr/Gb_H | Golden 参考 Gr/Gb 高字节 |
| 0x0012 | 1 | Gr/Gb_L | Golden 参考 Gr/Gb 低字节 |
| 0x0013 | 28 | 保留 | Reserved=0xff |
| 0x002F | 1 | 校验和 | AWB Calibration 校验和；Sum(0x0001~0x002E) % 255+1 |

<!-- Source EN PDF p.45, block 265 -->

| 偏移地址 | 长度(Byte) | 数据项 | 说明 |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=2，LSC 校准 |
| 0x0001 | 4 | 大小 | Size=2347 |
| 0x0005 | 2 | 版本 | LSC 版本：v1.0.b=0x010b |
| 0x0007 | 2312 | LSC 校准数据 | 17x17x4 矩阵，定点到 1024，非压缩封装，大端存储；通道顺序 R、Gr、Gb、B |
| 0x090F | 32 | 保留 | Reserved=0xff |
| 0x092F | 1 | 校验和 | LSC Calibration 校验和；Sum(0x0001~0x092E) % 255+1 |

<!-- Source EN PDF p.46, block 266 -->

| 偏移地址 | 长度(Byte) | 数据项 | 说明 |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=3，PDAF 校准 |
| 0x0001 | 4 | 大小 | Size=2603 |
| 0x0005 | 2 | 版本 | PDAF 版本：v1.1.12=0x011c |
| 0x0007 | 1 | Gainmap_width | Gainmap 尺寸，由 pdaf_gainmap_calibration() 得到 |
| 0x0008 | 1 | Gainmap_height | Gainmap 尺寸，由 pdaf_gainmap_calibration() 得到 |
| 0x0009 | 2048 | Gainmap | 实际大小=Gainmap_width* Gainmap_height*2，大端，默认值 0xff |
| 0x0809 | 1 | 校验和 | Gainmap 校验和；Sum(0x0007~0x00808) % 255+1 |
| 0x080A | 1 | 模式值 | DCC Map 拟合模式（本版本默认 1），与 PD ini 中的 DCC_CALIBRATE_MODE 一致 |
| 0x080B | 1 | 方向 | 由 pdaf_dccmap_calibration() 得到 dccSign；0：负；1：正 |
| 0x080C | 1 | DCCmap_width | DCCmap 尺寸，由 pdaf_dccmap_calibration() 得到 |
| 0x080D | 1 | DCCmap_height | DCCmap 尺寸，由 pdaf_dccmap_calibration() 得到 |
| 0x080E | 512 | Dccmap | 实际大小=DCCmap_width* DCCmap_height*2，大端，默认值 0xff |
| 0x0A0E | 1 | 校验和 | DCCmap 校验和；Sum(0x080A~0x0A0D) % 255+1 |
| 0x0A0F | 2 | pd_offset | flag(1)sign(1)reserve(2)integer(4)8fix_decimals(8)，flag=0：校准；sign=1：正 |
| 0x0A11 | 30 | 保留 | Reserved=0xff |
| 0x0A2F | 1 | 校验和 | PDAF Calibration 校验和；Sum(0x0001~0x0A2E) % 255+1 |

<!-- Source EN PDF p.47, block 267 -->

| 偏移地址 | 长度(Byte) | 数据项 | 说明 |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=4，AF 码值 |
| 0x0001 | 4 | 大小 | Size=27 |
| 0x0005 | 2 | 版本 | AF 版本：v1.0.9=0x0109 |
| 0x0007 | 1 | AF Infinite H | AF 远焦码值高位 |
| 0x0008 | 1 | AF Infinite L | AF 远焦码值低位 |
| 0x0009 | 1 | AF Macro H | AF 近焦码值高位 |
| 0x000A | 1 | AF Macro L | AF 近焦码值低位 |
| 0x000B | 1 | AF_Medium H | AF 中焦码值高位 |
| 0x000C | 1 | AF_Medium L | AF 中焦码值低位 |
| 0x000D | 18 | 保留 | Reserved=0xff |
| 0x001F | 1 | 校验和 | AF Code 校验和；Sum(0x0001~0x001E) % 255+1 |

<!-- Source EN PDF p.47, block 268 -->

| 偏移地址 | 长度(Byte) | 数据项 | 说明 |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=5，QSC |
| 0x0001 | 4 | 大小 | Size=4107 |
| 0x0005 | 2 | 版本 | QSC 版本：v1.0.0=0x0100 |
| 0x0007 | 2 | QSC Size | QSC 大小，大端 |
| 0x0009 | 4096 | 数据 | QSC 数据实际写入大小依据 QSC size，默认值 0xff |
| 0x1009 | 6 | 保留 | Reserved=0xff |
| 0x100F | 1 | 校验和 | QSC 校验和；Sum(0x0001~0x100E) % 255+1 |

{% endraw %}
