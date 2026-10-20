---
title: "Rockchip IQ Tools 完整指南：采集、标定与在线 ISP 调试"
description: "完整保留 RKISP Tuner V1.0.1 全部技术章节、Raw/YUV、BLC/LSC/AWB/CCM/NR/FEC 标定、Gamma 与离线模拟。"
translation_key: "081-rockchip-iq-tools"
slug: "081-rockchip-iq-tools"
lang: "zh"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["ArmSoM", "Rockchip", "IQ Tools", "RKISP", "Camera"]
keywords: "ArmSoM Rockchip RK356x RK3588 RV1106 ISP IQ Tools"
excerpt: "完整保留 RKISP Tuner V1.0.1 全部技术章节、Raw/YUV、BLC/LSC/AWB/CCM/NR/FEC 标定、Gamma 与离线模拟。"
---

{% raw %}

# Rockchip IQ Tools 完整指南：采集、标定与在线 ISP 调试

## ArmSoM 适用说明与来源

本文为 ArmSoM 适配前的平台参考，完整依据唯一提供的英文 Rockchip_IQ_Tools_Guide_EN_v1.0.1.pdf（RK-SM-YF-609，81 页）。未提供中文 PDF；中文、俄文、德文完整译自英文，所有版本保留英文原图，德文与英文图片 URL 相同。原文产品范围见 1.2：RK356x/RKISP21、RK3588/RKISP30、RV1106/RKISP32，Linux/Android；未指定内核版本。使用前核对实际 ArmSoM 板卡、SoC、SDK/BSP、内核、Sensor/镜头驱动、ToolServer、Tuner 与 IQ 模板版本；未进行任何板卡适配或图像质量硬件验证。原文时间、增益、图像对比与参数均为示例，不是 ArmSoM 实测。

原稿示例含重启、权限修改与 `setenforce 0`（降低 SELinux 保护）；只为完整保留源文，整理时没有执行，不建议直接用于生产系统。

[校对记录](/docs/rockchip-iq-tools/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip AIQ](https://github.com/rockchip-toybrick/camera_engine_rkaiq)

<!-- Source EN PDF p.1, unit 0 -->

本文介绍 RKISP2 Tuner 的使用与 ISP 调试流程，帮助使用 RKISP Tuner 的工程师快速入门，并为 IQ 调试提供参考。

<!-- Source EN PDF p.4, unit 1 -->

## 1 引言

<!-- Source EN PDF p.4, unit 2 -->

### 1.1 概述

<!-- Source EN PDF p.4, unit 3 -->

RKISP Tuner（下称 Tuner）提供 ISP 参数调试工具集，可对各 ISP 模块进行 Calibration、Tuning 等操作。用户可用 Capture Tool 采集 Raw 图像，在 Calibration Tool 中完成基础模块标定，再由 Tuner 连接设备，在线调整 ISP 参数。

<!-- Source EN PDF p.4, unit 4 -->

### 1.2 对应版本

<!-- Source EN PDF p.4, unit 5 -->

| 芯片 | 系统 | ISP 版本 |
| --- | --- | --- |
| RK356x | Linux/Android | RKISP21 |
| RK3588 | Linux/Android | RKISP30 |
| RV1106 | Linux/Android | RKISP32 |

<!-- Source EN PDF p.4, unit 6 -->

ISP21、ISP30、ISP32 版本大幅改善了兼容性。应确保 ToolServer 与 RKISP Tuner 的版本匹配；若工具页面参数与设备侧参数文件不同，应联系 Rockchip 工程师更新参数模板文件。

<!-- Source EN PDF p.4, unit 7 -->

### 1.3 环境准备

<!-- Source EN PDF p.4, unit 8 -->

##### 计算机环境要求

<!-- Source EN PDF p.4, unit 9 -->

1. 运行 Tuner 的计算机须为 x64 Windows 7 或更高版本的 64 位 Windows。

<!-- Source EN PDF p.4, unit 10 -->

2. 运行 Tuner 前须预装 64 位 MCR_R2016a (9.0.1)，原稿仅支持此版本。下载地址：https://ww2.mathworks.cn/products/compiler/matlab-runtime

<!-- Source EN PDF p.4, unit 11 -->

##### 设备侧环境要求

<!-- Source EN PDF p.4, unit 12 -->

1. 配备网卡，支持有线、无线等方式接入局域网。

<!-- Source EN PDF p.4, unit 13 -->

2. 没有网卡的设备应支持 RNDIS；此时设备被识别为 USB 网卡，可通过 USB 连接 PC。

<!-- Source EN PDF p.5, unit 14 -->

### 1.4 安装与配置

<!-- Source EN PDF p.5, unit 15 -->

RKISP2.x Tuner 无须安装，使用解压工具解压到任意目录即可运行，但应避免包含中文字符的路径。

<!-- Source EN PDF p.5, unit 16 -->

原文提到第 3 节所述的 MCR_R2016a 预安装要求；安装步骤如下（环境要求实际见 1.3 节，保留并记录此交叉引用疑点）：

<!-- Source EN PDF p.5, unit 17 -->

1. 打开 MCR_R2016a_x64.exe，等待解压完成。

<!-- Source EN PDF p.5, unit 18 -->

![英文原稿技术图，第 5](/docs/rockchip-iq-tools/assets/en-p005-figure-01.png)

<!-- Source EN PDF p.5, unit 19 -->

图 1-4-1

<!-- Source EN PDF p.5, unit 20 -->

2. 点击 Next，选择同意条款，再点击 Next 和 Install。

<!-- Source EN PDF p.5, unit 21 -->

![英文原稿技术图，第 5](/docs/rockchip-iq-tools/assets/en-p005-figure-02.png)

<!-- Source EN PDF p.5, unit 22 -->

图 1-4-2

<!-- Source EN PDF p.6, unit 23 -->

3. 等待安装完成。

<!-- Source EN PDF p.6, unit 24 -->

![英文原稿技术图，第 6](/docs/rockchip-iq-tools/assets/en-p006-figure-01.png)

<!-- Source EN PDF p.6, unit 25 -->

图 1-4-3

<!-- Source EN PDF p.6, unit 26 -->

4. 安装完成。

<!-- Source EN PDF p.6, unit 27 -->

![英文原稿技术图，第 6](/docs/rockchip-iq-tools/assets/en-p006-figure-02.png)

<!-- Source EN PDF p.6, unit 28 -->

图 1-4-4

<!-- Source EN PDF p.7, unit 29 -->

## 2 功能介绍

<!-- Source EN PDF p.7, unit 30 -->

### 2.1 概述

<!-- Source EN PDF p.7, unit 31 -->

进行调试时应遵循下图流程：

<!-- Source EN PDF p.7, unit 32 -->

![英文原稿技术图，第 7](/docs/rockchip-iq-tools/assets/en-p007-figure-01.png)

<!-- Source EN PDF p.7, unit 33 -->

图 2-1-1

<!-- Source EN PDF p.7, unit 34 -->

准备阶段需在工具中生成基础 IQ 文件（.json 格式），记录 ISP 所有可调参数。完成调试后，将文件替换到固件或设备相应位置，再重启相机应用，确认最终图像效果。

<!-- Source EN PDF p.7, unit 35 -->

Raw 采集、在线调试和参数交互均通过网络协议传输，因此准备环境时 PC 与设备必须接入同一局域网。

<!-- Source EN PDF p.7, unit 36 -->

标定工作应遵循下列流程：

<!-- Source EN PDF p.7, unit 37 -->

![英文原稿技术图，第 7](/docs/rockchip-iq-tools/assets/en-p007-figure-02.png)

<!-- Source EN PDF p.7, unit 38 -->

图 2-1-2

<!-- Source EN PDF p.7, unit 39 -->

部分模块的标定依赖前一模块结果，应按流程顺序完成；每个模块标定完成后，须确认其结果正确。

<!-- Source EN PDF p.8, unit 40 -->

### 2.2 Sensor 配置

<!-- Source EN PDF p.8, unit 41 -->

![英文原稿技术图，第 8](/docs/rockchip-iq-tools/assets/en-p008-figure-01.png)

<!-- Source EN PDF p.8, unit 42 -->

图 2-2-1

<!-- Source EN PDF p.8, unit 43 -->

Sensor 配置界面如图 2-2-1，由两部分组成：

<!-- Source EN PDF p.8, unit 44 -->

1. 参数调试区：参数说明参见 Rockchip_Tuning_Guide_ISP21/30/32 第 4.1.2.5 节 sensorinfo parameters。应按 Sensor Datasheet 填写，可能需要驱动工程师协助。

<!-- Source EN PDF p.8, unit 45 -->

2. 菜单栏：包含从 SensorList.ini 导入及向其导出的功能。

<!-- Source EN PDF p.9, unit 46 -->

### 2.3 RKISP Capture Tool

<!-- Source EN PDF p.9, unit 47 -->

![英文原稿技术图，第 9](/docs/rockchip-iq-tools/assets/en-p009-figure-01.png)

<!-- Source EN PDF p.9, unit 48 -->

图 2-3-1

<!-- Source EN PDF p.9, unit 49 -->

RKISP Capture Tool 主界面如图 2-3-1，由三部分组成：

<!-- Source EN PDF p.9, unit 50 -->

1. 设备连接配置：设置设备网络参数、切换模式并测试连接。

<!-- Source EN PDF p.9, unit 51 -->

2. 采集设置分为 Raw Capture 和 Online Capture。Raw Capture 为离线 Raw 采集，包含相机配置和曝光控制。相机配置提供采集所需的 Sensor 曝光参数、Module/Light 名称、分辨率与 Gain/Exposure 参数范围。曝光控制支持手动、自动，以及 NR 标定专用采集。手动曝光可设置步长，遍历并采集多个曝光组合；自动曝光搜索曝光参数，直至达到用户设置的目标亮度。YNR Capture 采集用于 YNR 标定的 Raw，详见 4.6.1。Online Capture 在在线流中采集，支持 raw 和 yuv。

<!-- Source EN PDF p.9, unit 52 -->

3. Raw 预览与统计：显示采集到的 Raw 灰度图、直方图与 ROI 亮度。

<!-- Source EN PDF p.10, unit 53 -->

### 2.4 RKISP Calibration Tool

<!-- Source EN PDF p.10, unit 54 -->

按选定的芯片与版本（图 2-4-1），加载相应 RKISP Calibration Tool（图 2-4-2）；导入的 IQ 文件也必须匹配芯片和版本。

<!-- Source EN PDF p.10, unit 55 -->

![英文原稿技术图，第 10](/docs/rockchip-iq-tools/assets/en-p010-figure-01.png)

<!-- Source EN PDF p.10, unit 56 -->

图 2-4-1

<!-- Source EN PDF p.10, unit 57 -->

![英文原稿技术图，第 10](/docs/rockchip-iq-tools/assets/en-p010-figure-02.png)

<!-- Source EN PDF p.10, unit 58 -->

图 2-4-2

<!-- Source EN PDF p.10, unit 59 -->

RKISP Calibration Tool 主界面如图 2-4-2，包含以下标定模块：BLC：黑电平校正；LSC：镜头阴影校正；CCM：色彩校正矩阵；AWB：自动白平衡校正。

<!-- Source EN PDF p.11, unit 60 -->

GIC：绿色通道平衡校正（标定集成于 Bayer NR 模块）；Bayer NR：Raw 域降噪，包含 Bayer 2DNR、Bayer 3DNR；YNR：Y 通道降噪；FEC：鱼眼标定。

<!-- Source EN PDF p.11, unit 61 -->

### 2.5 RKRAW Tool

<!-- Source EN PDF p.11, unit 62 -->

![英文原稿技术图，第 11](/docs/rockchip-iq-tools/assets/en-p011-figure-01.png)

<!-- Source EN PDF p.11, unit 63 -->

图 2-5-1

<!-- Source EN PDF p.11, unit 64 -->

RKRAW Tool 主界面如图 2-5-1，支持查看 jpg/bmp/png、raw、RKRawV1、RKRawV2。原文称分四部分，下文实际列五项，均保留：

<!-- Source EN PDF p.11, unit 65 -->

1. 文件系统：选择要查看的图像路径。

<!-- Source EN PDF p.11, unit 66 -->

2. 显示窗口：右键切换 GRAY/RGB、Normal/Hdr Short/Mid/Long（后者仅支持 RKRawV2），见图 2-5-2；按 Ctrl 并滚动滚轮可缩放。

<!-- Source EN PDF p.11, unit 67 -->

3. 直方图：灰度通道统计。

<!-- Source EN PDF p.11, unit 68 -->

4. RKRawV2 信息：raw 格式、曝光参数等。

<!-- Source EN PDF p.11, unit 69 -->

5. Compare：按 Ctrl 同时选择超过 2 张图，点击 compare 按钮，见图 2-5-3。

<!-- Source EN PDF p.12, unit 70 -->

![英文原稿技术图，第 12](/docs/rockchip-iq-tools/assets/en-p012-figure-01.png)

<!-- Source EN PDF p.12, unit 71 -->

图 2-5-2

<!-- Source EN PDF p.12, unit 72 -->

![英文原稿技术图，第 12](/docs/rockchip-iq-tools/assets/en-p012-figure-02.png)

<!-- Source EN PDF p.12, unit 73 -->

图 2-5-3

<!-- Source EN PDF p.13, unit 74 -->

### 2.6 RKISP 3D-LUT Tools

<!-- Source EN PDF p.13, unit 75 -->

![英文原稿技术图，第 13](/docs/rockchip-iq-tools/assets/en-p013-figure-01.png)

<!-- Source EN PDF p.13, unit 76 -->

图 2-6-1

<!-- Source EN PDF p.13, unit 77 -->

RKISP 3D-LutTool 主界面如图 2-6-1：左侧为 LUT 区，右侧为预览区。

<!-- Source EN PDF p.13, unit 78 -->

1. File：导入图像、导入/保存 IQ 参数及 LUT Info。Load Image 支持 jpg/bmp/png/nv12，导入图显示于右侧 Preview，见图 2-6-2。Load IQ File 导入 IQ 参数并选择 scene 与 Lut3D 表，见图 2-6-3。

<!-- Source EN PDF p.13, unit 79 -->

![英文原稿技术图，第 13](/docs/rockchip-iq-tools/assets/en-p013-figure-02.png)

<!-- Source EN PDF p.13, unit 80 -->

图 2-6-2

<!-- Source EN PDF p.14, unit 81 -->

![英文原稿技术图，第 14](/docs/rockchip-iq-tools/assets/en-p014-figure-01.png)

<!-- Source EN PDF p.14, unit 82 -->

![英文原稿技术图，第 14](/docs/rockchip-iq-tools/assets/en-p014-figure-02.png)

<!-- Source EN PDF p.14, unit 83 -->

图 2-6-3

<!-- Source EN PDF p.14, unit 84 -->

Save IQ File：可覆盖 IQ 文件中的现有表或新建表，见图 2-6-4。

<!-- Source EN PDF p.14, unit 85 -->

![英文原稿技术图，第 14](/docs/rockchip-iq-tools/assets/en-p014-figure-03.png)

<!-- Source EN PDF p.14, unit 86 -->

图 2-6-4

<!-- Source EN PDF p.14, unit 87 -->

2. 颜色查找：在图上移动鼠标，左侧 LUT 标记对应颜色，见图 2-6-5；左键锁定当前颜色，通过 Adjust Sat、Adjust Hue 或直接拖动标记点调色。可查看标记点 AB、Sat、Hue、RGB 的前后数值及 LUT/Preview 的颜色变化。

<!-- Source EN PDF p.15, unit 88 -->

![英文原稿技术图，第 15](/docs/rockchip-iq-tools/assets/en-p015-figure-01.png)

<!-- Source EN PDF p.15, unit 89 -->

图 2-6-5

<!-- Source EN PDF p.15, unit 90 -->

3. Adjust Sat：拖动滑块，LUT 标记颜色及其邻近颜色一起变化，见图 2-6-6(a)。若只想改标记色，可右键锁定不想移动的颜色：圆点变方块后位置锁定。再拖动 Adjust Sat，仅标记色变化，见图 2-6-6(b)。

<!-- Source EN PDF p.15, unit 91 -->

![英文原稿技术图，第 15](/docs/rockchip-iq-tools/assets/en-p015-figure-02.png)

<!-- Source EN PDF p.15, unit 92 -->

(a)

<!-- Source EN PDF p.16, unit 93 -->

![英文原稿技术图，第 16](/docs/rockchip-iq-tools/assets/en-p016-figure-01.png)

<!-- Source EN PDF p.16, unit 94 -->

(b)

<!-- Source EN PDF p.16, unit 95 -->

图 2-6-6

<!-- Source EN PDF p.16, unit 96 -->

4. After & Before：查看调整前后图像。

<!-- Source EN PDF p.16, unit 97 -->

5. Reset LUT：恢复 LUT 默认值。

<!-- Source EN PDF p.16, unit 98 -->

6. Image：支持左右旋转、垂直/水平翻转并保存调整后的图像，见图 2-6-7。

<!-- Source EN PDF p.16, unit 99 -->

![英文原稿技术图，第 16](/docs/rockchip-iq-tools/assets/en-p016-figure-02.png)

<!-- Source EN PDF p.16, unit 100 -->

图 2-6-7

<!-- Source EN PDF p.16, unit 101 -->

7. Options：设置 LUT 显示，可调标记点大小与线宽，见图 2-6-8。

<!-- Source EN PDF p.16, unit 102 -->

![英文原稿技术图，第 16](/docs/rockchip-iq-tools/assets/en-p016-figure-03.png)

<!-- Source EN PDF p.16, unit 103 -->

图 2-6-8

<!-- Source EN PDF p.17, unit 104 -->

### 2.7 RKISP 3A Analyzer Tool

<!-- Source EN PDF p.17, unit 105 -->

![英文原稿技术图，第 17](/docs/rockchip-iq-tools/assets/en-p017-figure-01.png)

<!-- Source EN PDF p.17, unit 106 -->

图 2-7-1

<!-- Source EN PDF p.17, unit 107 -->

点击 Connect 连接 rkaiq_tool_server，打开 RKISP 3AAnalyzerTool，主界面见图 2-7-1。修改 URL，勾选 Open 开启预览；该版本支持获取 AE、AWB 模块统计。

<!-- Source EN PDF p.17, unit 108 -->

TimerSet：设置数据获取间隔。

<!-- Source EN PDF p.17, unit 109 -->

Reverse color：改变预览面板中的数据颜色。

<!-- Source EN PDF p.17, unit 110 -->

点击 AE，开启 AE 模块，在 AE Statistics 窗口显示动态直方图。主界面预览图分为 15 * 15 小格，每格显示对应块的 12bit 统计值；Channel 列表可切换通道，HDR 支持 L/M/S 帧统计，见图 2-7-2。

<!-- Source EN PDF p.18, unit 111 -->

![英文原稿技术图，第 18](/docs/rockchip-iq-tools/assets/en-p018-figure-01.png)

<!-- Source EN PDF p.18, unit 112 -->

图 2-7-2

<!-- Source EN PDF p.18, unit 113 -->

点击 AWB，在 AWB Statistics 窗口动态打印当前 AWB 状态。主界面预览图分为 15 * 15 小格，各格显示对应块的白点数和 WBGains，见图 2-7-3。

<!-- Source EN PDF p.18, unit 114 -->

![英文原稿技术图，第 18](/docs/rockchip-iq-tools/assets/en-p018-figure-02.png)

<!-- Source EN PDF p.18, unit 115 -->

图 2-7-3

<!-- Source EN PDF p.19, unit 116 -->

## 3 快速开始

<!-- Source EN PDF p.19, unit 117 -->

### 3.1 准备工作

<!-- Source EN PDF p.19, unit 118 -->

ISP 调试有大量工作在设备侧进行。需运行服务程序，在 Tuner 与 AIQ 之间传输数据，并支持 Raw 采集等任务。因此开始 Tuning 前，先将服务程序及相关文件推送到设备并运行。下面分别介绍 Android 和 Linux 的准备工作：

<!-- Source EN PDF p.19, unit 119 -->

1. 连接局域网。

<!-- Source EN PDF p.19, unit 120 -->

2. 运行 rkaiq_tool_server 并配置环境。命令执行和文件传输可用 TFTP、串口、ADB 等协议或工具，示例采用 ADB。

<!-- Source EN PDF p.19, unit 121 -->

#### 3.1.1 Android

<!-- Source EN PDF p.19, unit 122 -->

##### 3.1.1.1 RK356X & RK3588

<!-- Source EN PDF p.19, unit 123 -->

可使用有线网络的设备：

<!-- Source EN PDF p.19, unit 124 -->

1. 用网线连接设备和路由器。

<!-- Source EN PDF p.19, unit 125 -->

2. 用 ifconfig 查看设备 IP 地址。

<!-- Source EN PDF p.19, unit 126 -->

3. PC 连接同一路由器，可用有线或无线。

<!-- Source EN PDF p.19, unit 127 -->

4. 查看 PC 的 IP，在 PC 或设备命令行用 ping 确认网络连通。

<!-- Source EN PDF p.19, unit 128 -->

无法使用有线网络的设备（平板等）：

<!-- Source EN PDF p.19, unit 129 -->

1. 用 USB 线连接 PC 与 EVB，使用 ADB 的同一接口。

<!-- Source EN PDF p.19, unit 130 -->

2. 上电并进入系统。

<!-- Source EN PDF p.19, unit 131 -->

3. 打开 Settings。

<!-- Source EN PDF p.19, unit 132 -->

4. 进入 Network&internet。

<!-- Source EN PDF p.19, unit 133 -->

5. 进入 Hotspot&tethering。

<!-- Source EN PDF p.19, unit 134 -->

6. 开启 USB tethering。

<!-- Source EN PDF p.19, unit 135 -->

7. 用 adb shell 进入设备。

<!-- Source EN PDF p.19, unit 136 -->

8. 执行 ifconfig usb0 查看 IP。

<!-- Source EN PDF p.19, unit 137 -->

9. 在 PC 或设备命令行用 ping 确认网络连通。

<!-- Source EN PDF p.20, unit 138 -->

运行 rkaiq_tool_server 的步骤如下；如果服务与依赖文件已在设备相应路径，只需直接运行 rkaiq_tool_server。

<!-- Source EN PDF p.20, unit 139 -->

1. 在 SDK 中编译得到 rkaiq_tool_server 与 rkaiq_3A_server。

<!-- Source EN PDF p.20, unit 140 -->

2. SDK 路径为 external/rkaiq_tool_server；固件必须为 user-debug 版本。

<!-- Source EN PDF p.20, unit 141 -->

3. 将 android.hardware.camera.provider@2.4-service.rc 推送到板端 /vendor/etc/init/。

<!-- Source EN PDF p.20, unit 142 -->

4. 进入 /vendor/etc/init/，执行 chmod 644 android.hardware.camera.provider@2.4-service.rc 修改权限。

<!-- Source EN PDF p.20, unit 143 -->

5. 将 rkaiq_tool_server 和 rkaiq_3A_server 推送到板端 /vendor/bin/。

<!-- Source EN PDF p.20, unit 144 -->

6. 进入 /vendor/bin/，执行 chmod 755 rkaiq_tool_server；rkaiq_3A_server 同样处理。

<!-- Source EN PDF p.20, unit 145 -->

7. 执行 sync 刷新缓存。

<!-- Source EN PDF p.20, unit 146 -->

8. 重启设备。

<!-- Source EN PDF p.20, unit 147 -->

9. 执行 setenforce 0。

<!-- Source EN PDF p.20, unit 148 -->

10. 打开相机 apk。

<!-- Source EN PDF p.20, unit 149 -->

11. 运行 rkaiq_tool_server。

<!-- Source EN PDF p.20, unit 150 -->

ADB 操作示例：

<!-- Source EN PDF p.20, unit 151 -->

```sh
#The following commands are run in cmd on the PC side
adb root
adb remount
adb push android.hardware.camera.provider@2.4-service.rc /vendor/etc/init/
adb push rkaiq_tool_server /vendor/bin/
adb shell

# The following commands are executed in adb shell terminal
chmod 644 /vendor/etc/init/android.hardware.camera.provider@2.4-service.rc
chmod 755 /vendor/bin/rkaiq_tool_server
sync
reboot

# After restart, enter adb shell again
# disable SELinux
setenforce 0
# Manually run the camera apk first
# Then run tool server
/vendor/bin/rkaiq_tool_server &
```

<!-- Source EN PDF p.20, unit 152 -->

多摄像头示例：

<!-- Source EN PDF p.20, unit 153 -->

```sh
#If there are 2 sensors in the device and you need to switch to another sensor for tuning, run tool server as follows:
/vendor/bin/rkaiq_tool_server -d 1 &
```

<!-- Source EN PDF p.21, unit 154 -->

注意：用 New 生成初始 IQ 参数并推送设备后，按下面操作重置相机应用并重新启动 ToolServer。如遇崩溃、卡住、在线调试失败或无法预览等，也可尝试按此流程重新连接。

<!-- Source EN PDF p.21, unit 155 -->

```sh
source /vendor/etc/camera/reset_camera.sh
# run camera apk
/vendor/bin/rkaiq_tool_server &
```

<!-- Source EN PDF p.21, unit 156 -->

#### 3.1.2 Linux

<!-- Source EN PDF p.21, unit 157 -->

##### 3.1.2.1 RK356X & RK3588 & RV1106

<!-- Source EN PDF p.21, unit 158 -->

可使用有线网络的设备：

<!-- Source EN PDF p.21, unit 159 -->

1. 用网线连接设备和路由器。

<!-- Source EN PDF p.21, unit 160 -->

2. 用 ifconfig 查看设备 IP 地址。

<!-- Source EN PDF p.21, unit 161 -->

3. PC 连接同一路由器，可用有线或无线。

<!-- Source EN PDF p.21, unit 162 -->

4. 查看 PC 的 IP，在 PC 或设备命令行用 ping 确认网络连通。

<!-- Source EN PDF p.21, unit 163 -->

无法使用有线网络的设备：

<!-- Source EN PDF p.21, unit 164 -->

1. 尝试启动 RNDIS 服务。

<!-- Source EN PDF p.21, unit 165 -->

2. 用 ifconfig 查看设备 IP 地址。

<!-- Source EN PDF p.21, unit 166 -->

3. 在 PC 或设备命令行用 ping 确认网络连通。

<!-- Source EN PDF p.21, unit 167 -->

运行 rkaiq_tool_server 的步骤如下；如果服务与依赖文件已在设备相应路径，只需直接运行 rkaiq_tool_server。

<!-- Source EN PDF p.21, unit 168 -->

1. 在 SDK 编译得到 rkaiq_tool_server 与 librkmedia.so。

<!-- Source EN PDF p.21, unit 169 -->

2. 将 librkmedia.so 推送到板端 /data/。

<!-- Source EN PDF p.21, unit 170 -->

3. 进入 /data/，执行 chmod 777 librkmedia.so 修改权限。

<!-- Source EN PDF p.21, unit 171 -->

4. 将 rkaiq_tool_server 推送到板端 /data/。

<!-- Source EN PDF p.21, unit 172 -->

5. 进入 /data/，执行 chmod 777 rkaiq_tool_server 修改权限。

<!-- Source EN PDF p.21, unit 173 -->

6. 执行 sync 刷新缓存。

<!-- Source EN PDF p.21, unit 174 -->

7. 重启设备。

<!-- Source EN PDF p.21, unit 175 -->

8. 运行相机应用。

<!-- Source EN PDF p.21, unit 176 -->

9. 运行 rkaiq_tool_server。

<!-- Source EN PDF p.22, unit 177 -->

ADB 操作示例：

<!-- Source EN PDF p.22, unit 178 -->

```sh
#The following commands are run in cmd on the PC side
adb root
adb remount
adb push librkmedia.so /data/
adb push rkaiq_tool_server /data/
adb shell

# The following commands are executed in adb shell
chmod 777 /data/rkaiq_tool_server
sync
reboot

# After restart, enter adb shell again
# Run the camera app first
/data/rkaiq_tool_server &
```

<!-- Source EN PDF p.22, unit 179 -->

### 3.2 ToolServer 参数说明

<!-- Source EN PDF p.22, unit 180 -->

rkaiq_tool_server 参数和配置简要说明如下：

<!-- Source EN PDF p.22, unit 181 -->

`-d`：选择 Sensor。设备有多个 Sensor 时，以 0/1/2 等设备编号选择，默认 0。可用 `media-ctl -p -d /dev/mediaX`（X=0/1/2/3...）查看拓扑，节点包含 Sensor 名，例如 `m01_b_ov8858 2-0036`。m01 对应 mNN，NN 为两位 Sensor 索引；故参数为 `-d 1`，不足两位不补前导 0。

<!-- Source EN PDF p.22, unit 182 -->

`-s`：选择 YUV 采集 video 节点；默认自动搜索 iqtool，也可手动指定 mainPath 或 selfPath。

<!-- Source EN PDF p.22, unit 183 -->

`-r`：RTSP 开关，0 关闭、1 开启，默认 0。开启后可用 CaptureTool 的 Start RTSP。

<!-- Source EN PDF p.22, unit 184 -->

`-i`：IQ 文件路径；路径改变时同步修改，`-r` 为 0 时可忽略。

<!-- Source EN PDF p.22, unit 185 -->

`-w/-h`：RTSP 流预览输出分辨率，按 ISP 输出尺寸缩放，默认 1920/1080。

<!-- Source EN PDF p.22, unit 186 -->

`-n`：在线连续 Raw 采集缓冲区数，默认 4；需采集大量连续 Raw 时建议增大。

<!-- Source EN PDF p.22, unit 187 -->

`-f`：离线帧发送功能的帧率，原文默认值为 10 frames。

<!-- Source EN PDF p.23, unit 188 -->

### 3.3 平台设置与 IP 地址

<!-- Source EN PDF p.23, unit 189 -->

1. 打开 RKISP Tuner，初始配置窗口见图 3-3-1。

<!-- Source EN PDF p.23, unit 190 -->

![英文原稿技术图，第 23](/docs/rockchip-iq-tools/assets/en-p023-figure-01.png)

<!-- Source EN PDF p.23, unit 191 -->

图 3-3-1

<!-- Source EN PDF p.23, unit 192 -->

2. 选择芯片，输入前面得到的 IP。端口默认 5543，无特殊需求不要修改。确认 rkaiq_tool_server 正常运行后，点击 Connect to rkaiq_tool_server。连接后若需第三方工具预览，具体操作参见原文指向的 3.7 节第 3 点。

<!-- Source EN PDF p.23, unit 193 -->

3. 点击 OK，所选芯片与版本的调试界面见图 3-3-2。

<!-- Source EN PDF p.23, unit 194 -->

![英文原稿技术图，第 23](/docs/rockchip-iq-tools/assets/en-p023-figure-02.png)

<!-- Source EN PDF p.23, unit 195 -->

图 3-3-2

<!-- Source EN PDF p.24, unit 196 -->

### 3.4 生成新 Sensor 配置与 IQ 文件

<!-- Source EN PDF p.24, unit 197 -->

1. 点击 File → New。

<!-- Source EN PDF p.24, unit 198 -->

![英文原稿技术图，第 24](/docs/rockchip-iq-tools/assets/en-p024-figure-01.png)

<!-- Source EN PDF p.24, unit 199 -->

图 3-4-1

<!-- Source EN PDF p.24, unit 200 -->

![英文原稿技术图，第 24](/docs/rockchip-iq-tools/assets/en-p024-figure-02.png)

<!-- Source EN PDF p.24, unit 201 -->

图 3-4-2

<!-- Source EN PDF p.24, unit 202 -->

2. 点击 Sensor 列表右侧的 New，打开 Sensor Information。

<!-- Source EN PDF p.24, unit 203 -->

![英文原稿技术图，第 24](/docs/rockchip-iq-tools/assets/en-p024-figure-03.png)

<!-- Source EN PDF p.24, unit 204 -->

图 3-4-3

<!-- Source EN PDF p.25, unit 205 -->

3. 填好 Sensor Information，点击 File → Export To Sensor List。

<!-- Source EN PDF p.25, unit 206 -->

![英文原稿技术图，第 25](/docs/rockchip-iq-tools/assets/en-p025-figure-01.png)

<!-- Source EN PDF p.25, unit 207 -->

图 3-4-4

<!-- Source EN PDF p.25, unit 208 -->

4. 输入要保存的 Sensor 名，点击 OK 保存配置。

<!-- Source EN PDF p.25, unit 209 -->

![英文原稿技术图，第 25](/docs/rockchip-iq-tools/assets/en-p025-figure-02.png)

<!-- Source EN PDF p.25, unit 210 -->

图 3-4-5

<!-- Source EN PDF p.25, unit 211 -->

5. 关闭配置页，Generated New IQ File 窗口的 Sensor 列表中会出现新 Sensor。

<!-- Source EN PDF p.25, unit 212 -->

![英文原稿技术图，第 25](/docs/rockchip-iq-tools/assets/en-p025-figure-03.png)

<!-- Source EN PDF p.25, unit 213 -->

图 3-4-6

<!-- Source EN PDF p.25, unit 214 -->

6. 选择 Sensor，点击 Generate IQ File 生成 IQ 文件。

<!-- Source EN PDF p.25, unit 215 -->

### 3.5 参数加载、保存与场景选择

<!-- Source EN PDF p.25, unit 216 -->

1. 点击 File → Open...，选择 IQ 文件。

<!-- Source EN PDF p.25, unit 217 -->

![英文原稿技术图，第 25](/docs/rockchip-iq-tools/assets/en-p025-figure-04.png)

<!-- Source EN PDF p.25, unit 218 -->

图 3-5-1

<!-- Source EN PDF p.26, unit 219 -->

2. Scene Selection 窗口显示 IQ 文件各场景组名称；选择待调场景，点击 OK。

<!-- Source EN PDF p.26, unit 220 -->

![英文原稿技术图，第 26](/docs/rockchip-iq-tools/assets/en-p026-figure-01.png)

<!-- Source EN PDF p.26, unit 221 -->

图 3-5-2

<!-- Source EN PDF p.26, unit 222 -->

3. IQ 文件与 UI 模板参数进行比较，差异显示于 Different Member List。左侧 Missing 为 IQ 缺失参数；右侧 Existed 为 IQ 中存在、但 UI 模板已删除或更名的参数。

<!-- Source EN PDF p.26, unit 223 -->

![英文原稿技术图，第 26](/docs/rockchip-iq-tools/assets/en-p026-figure-02.png)

<!-- Source EN PDF p.26, unit 224 -->

图 3-5-3

<!-- Source EN PDF p.27, unit 225 -->

4. 点击 File → Save As...（图 3-5-4、3-5-5），可保存到步骤 2 所选场景或另存新场景，支持仅保存选定模块；右侧列出已修改参数供参考。

<!-- Source EN PDF p.27, unit 226 -->

![英文原稿技术图，第 27](/docs/rockchip-iq-tools/assets/en-p027-figure-01.png)

<!-- Source EN PDF p.27, unit 227 -->

图 3-5-4

<!-- Source EN PDF p.27, unit 228 -->

![英文原稿技术图，第 27](/docs/rockchip-iq-tools/assets/en-p027-figure-02.png)

<!-- Source EN PDF p.27, unit 229 -->

图 3-5-5

<!-- Source EN PDF p.27, unit 230 -->

### 3.6 编辑 Sensor 信息

<!-- Source EN PDF p.27, unit 231 -->

1. 按上一节步骤加载 IQ 参数文件。

<!-- Source EN PDF p.27, unit 232 -->

2. 点击 Tuning → Edit Sensor Information，打开 Sensor Info 配置界面。

<!-- Source EN PDF p.27, unit 233 -->

![英文原稿技术图，第 27](/docs/rockchip-iq-tools/assets/en-p027-figure-03.png)

<!-- Source EN PDF p.27, unit 234 -->

图 3-6-1

<!-- Source EN PDF p.28, unit 235 -->

![英文原稿技术图，第 28](/docs/rockchip-iq-tools/assets/en-p028-figure-01.png)

<!-- Source EN PDF p.28, unit 236 -->

图 3-6-2

<!-- Source EN PDF p.28, unit 237 -->

3. 点击 File → Import From Sensor List。

<!-- Source EN PDF p.28, unit 238 -->

![英文原稿技术图，第 28](/docs/rockchip-iq-tools/assets/en-p028-figure-02.png)

<!-- Source EN PDF p.28, unit 239 -->

图 3-6-3

<!-- Source EN PDF p.28, unit 240 -->

4. 按下图选择 Sensor。

<!-- Source EN PDF p.28, unit 241 -->

![英文原稿技术图，第 28](/docs/rockchip-iq-tools/assets/en-p028-figure-03.png)

<!-- Source EN PDF p.28, unit 242 -->

图 3-6-4

<!-- Source EN PDF p.29, unit 243 -->

5. 点击 OK 导入配置参数。

<!-- Source EN PDF p.29, unit 244 -->

6. 关闭 Sensor Information 窗口。

<!-- Source EN PDF p.29, unit 245 -->

7. 列表中找不到 Sensor 名时，可参照其 Datasheet，在 Sensor Information 中新建配置。

<!-- Source EN PDF p.29, unit 246 -->

### 3.7 Raw 与 YUV 图像采集

<!-- Source EN PDF p.29, unit 247 -->

#### 3.7.1 离线 Raw 采集

<!-- Source EN PDF p.29, unit 248 -->

1. 点击 Tools → RK Capture Tool。

<!-- Source EN PDF p.29, unit 249 -->

![英文原稿技术图，第 29](/docs/rockchip-iq-tools/assets/en-p029-figure-01.png)

<!-- Source EN PDF p.29, unit 250 -->

图 3-7-1-1

<!-- Source EN PDF p.29, unit 251 -->

2. 确认设备 IP 正确，点击 Device Status；若 Tuner 正确连接 rkaiq_tool_server，会打印 Device is Ready。

<!-- Source EN PDF p.29, unit 252 -->

![英文原稿技术图，第 29](/docs/rockchip-iq-tools/assets/en-p029-figure-02.png)

<!-- Source EN PDF p.29, unit 253 -->

图 3-7-1-2

<!-- Source EN PDF p.29, unit 254 -->

3. 点击 Start RTSP Streaming，开启相机及 RTSP 视频流（可选）。

<!-- Source EN PDF p.30, unit 255 -->

1) Android：开启 Start RTSP Streaming 后，可用第三方播放器打开 `rtsp://192.168.10.104:1234/v` 预览。此时设备侧相机 apk 会断开；要用相机，先点击 Stop RTSP Streaming，再点击 Switch To Tuning Mode。

<!-- Source EN PDF p.30, unit 256 -->

2) Linux：若板端已有其他相机程序运行，先退出，再运行 ToolServer。点击 Start RTSP Streaming 后，可用第三方播放器打开 `rtsp://192.168.10.104/live/0` 预览。

<!-- Source EN PDF p.30, unit 257 -->

4. 选择待调试 Sensor 名称。

<!-- Source EN PDF p.30, unit 258 -->

![英文原稿技术图，第 30](/docs/rockchip-iq-tools/assets/en-p030-figure-01.png)

<!-- Source EN PDF p.30, unit 259 -->

图 3-7-1-3

<!-- Source EN PDF p.30, unit 260 -->

5. 选择正确分辨率、光源和模块名称，便于区分。

<!-- Source EN PDF p.30, unit 261 -->

6. 设置 Gain、Exposure Time、数量等参数。

<!-- Source EN PDF p.30, unit 262 -->

7. 点击 Start Manual Capture。

<!-- Source EN PDF p.30, unit 263 -->

8. Raw 图像显示在右侧 Raw Preview & Statistics。

<!-- Source EN PDF p.30, unit 264 -->

9. 这里还显示直方图、最大/最小/平均亮度、全局 wb gain 等。

<!-- Source EN PDF p.30, unit 265 -->

10. Raw 默认保存到 `./raw_capture/module name/`。

<!-- Source EN PDF p.31, unit 266 -->

![英文原稿技术图，第 31](/docs/rockchip-iq-tools/assets/en-p031-figure-01.png)

<!-- Source EN PDF p.31, unit 267 -->

图 3-7-1-4：Gain=5x、ExpTime=0.01s 的单帧 Raw

<!-- Source EN PDF p.31, unit 268 -->

#### 3.7.2 在线 YUV 采集

<!-- Source EN PDF p.31, unit 269 -->

1. 打开相机应用，确认设备预览正常。

<!-- Source EN PDF p.31, unit 270 -->

2. 运行 ToolServer，在工具中输入 IP 并连接设备。

<!-- Source EN PDF p.31, unit 271 -->

3. 切换 Online Capture，在 Sensor Name 填写名称，作为 YUV 文件名前缀。

<!-- Source EN PDF p.31, unit 272 -->

4. 连续帧采集时，在 Frame Num 配置数量。

<!-- Source EN PDF p.31, unit 273 -->

5. 点击 Capture YUV，图像可预览，文件保存到 `raw_capture/yuv/`，见图 3-7-2-1。

<!-- Source EN PDF p.31, unit 274 -->

![英文原稿技术图，第 31](/docs/rockchip-iq-tools/assets/en-p031-figure-02.png)

<!-- Source EN PDF p.31, unit 275 -->

图 3-7-2-1

<!-- Source EN PDF p.32, unit 276 -->

#### 3.7.3 在线 Raw 采集

<!-- Source EN PDF p.32, unit 277 -->

1. 打开相机应用，确认设备预览正常。

<!-- Source EN PDF p.32, unit 278 -->

2. 运行 ToolServer，在工具中输入 IP 并连接设备。

<!-- Source EN PDF p.32, unit 279 -->

3. 切换 Online Capture，在 Sensor Name 填写名称，作为 Raw 文件名前缀。

<!-- Source EN PDF p.32, unit 280 -->

4. 连续帧采集时，在 Frame Num 配置数量。

<!-- Source EN PDF p.32, unit 281 -->

5. 点击 Capture Raw，可在预览中查看图像，文件保存到 `raw_capture/`，见图 3-7-3-1。

<!-- Source EN PDF p.32, unit 282 -->

![英文原稿技术图，第 32](/docs/rockchip-iq-tools/assets/en-p032-figure-01.png)

<!-- Source EN PDF p.32, unit 283 -->

图 3-7-3-1

<!-- Source EN PDF p.32, unit 284 -->

在线 Raw 连续采集的最大帧数

<!-- Source EN PDF p.32, unit 285 -->

最大连续帧数取决于申请的缓存 buffer 数，可用 ToolServer 的 `-n` 设置。buffer 越多，一次可采集连续帧越多；buffer 少于采集帧数时可能丢帧。可配置数量也受内核分配的缓存与内存大小限制，内核部分参考下面示例。

<!-- Source EN PDF p.33, unit 286 -->

![英文原稿技术图，第 33](/docs/rockchip-iq-tools/assets/en-p033-figure-01.png)

图片中的补丁示例完整转录如下；图像原件保留供对照。此为原稿片段，不保证可直接应用于任意内核。

```diff
diff --git a/include/media/videobuf2-core.h b/include/media/videobuf2-core.h
index 3f4f171..ee359c5 100644
--- a/include/media/videobuf2-core.h
+++ b/include/media/videobuf2-core.h
@@ -19,7 +19,7 @@
 #include <linux/bitops.h>
 #include <media/media-request.h>

-#define VB2_MAX_FRAME (64)
+#define VB2_MAX_FRAME (128)
 #define VB2_MAX_PLANES (8)

 /**
diff --git a/include/uapi/linux/videodev2.h b/include/uapi/linux/videodev2.h
index d900af7..592fccc 100644
--- a/include/uapi/linux/videodev2.h
+++ b/include/uapi/linux/videodev2.h
@@ -70,7 +70,7 @@
 /*
  * Common stuff for both V4L1 and V4L2
  * Moved from videodev.h
  */
-#define VIDEO_MAX_FRAME        64
+#define VIDEO_MAX_FRAME        128
 #define VIDEO_MAX_PLANES       8
```

<!-- Source EN PDF p.34, unit 287 -->

## 4 标定说明

<!-- Source EN PDF p.34, unit 288 -->

每个模块的标定分为三个部分：

<!-- Source EN PDF p.34, unit 289 -->

1. 图像采集：按模块需求，以合适曝光拍摄标定板或场景 Raw。

<!-- Source EN PDF p.34, unit 290 -->

2. 计算标定参数：导入 Raw 并计算，部分模块可按需微调。

<!-- Source EN PDF p.34, unit 291 -->

3. 确认并保存：按各模块标准判断标定参数是否正确。

<!-- Source EN PDF p.34, unit 292 -->

### 4.1 Raw 图像采集

<!-- Source EN PDF p.34, unit 293 -->

原文指向 3.6 节操作步骤（该节实际为 Sensor 编辑；采集见 3.7，交叉引用疑点已记录）。

<!-- Source EN PDF p.34, unit 294 -->

### 4.2 BLC 标定

<!-- Source EN PDF p.34, unit 295 -->

#### 4.2.1 基本原理

<!-- Source EN PDF p.34, unit 296 -->

Sensor 存在 Black Level，无外部光时仍有输出电压，最终输出需扣除此值。为测量它，Sensor 预留完全不曝光的像素，读取这些像素即可实时获得 Optical Black Level。此时：`Raw = Sensor Input - Optical Black Level`。

<!-- Source EN PDF p.34, unit 297 -->

考虑 Sensor 输出信噪比，通常另加基础 Pedestal，此时：`Raw = Sensor Input - Optical Black Level - Pedestal`。

<!-- Source EN PDF p.34, unit 298 -->

Sensor 配置各异，BLC 最终校正值可通过全黑场景的 RAW 数据获得。

<!-- Source EN PDF p.34, unit 299 -->

校正值主要受 Gain 与 Temperature 影响，因此需分别标定不同 ISO。BLC 是偏移量，其他模块标定时须扣除此偏移，否则无法获得正确参数。

<!-- Source EN PDF p.34, unit 300 -->

RV1106：为在 Bayer2D/Bayer3D 降噪中保留更多暗部，BLC 新增 Sensor OB 配置，即前述 Pedestal。部分厂商支持在驱动序列配置，部分为固定值，可

<!-- Source EN PDF p.35, unit 301 -->

通过 Datasheet 或驱动代码确认。若难以确认，可用 4.2.4 参考值，或用 Gain=1x 计算的各通道 BLC 均值。

<!-- Source EN PDF p.35, unit 302 -->

#### 4.2.2 Raw 图像要求

<!-- Source EN PDF p.35, unit 303 -->

1. 采集时遮住镜头，确保无光进入。

<!-- Source EN PDF p.35, unit 304 -->

2. 遍历 Gain=1x、2x、4x、8x、16x...Max；若驱动最大支持 40x，则 Max=32。

<!-- Source EN PDF p.35, unit 305 -->

3. 曝光时间不影响 BLC 标定，可统一为 10ms。

<!-- Source EN PDF p.35, unit 306 -->

#### 4.2.3 Raw 采集

<!-- Source EN PDF p.35, unit 307 -->

1. 按 3.1、3.2 打开 RK Capture Tool 并连接设备；光源选 unknow（无光），模块选 BLC。

<!-- Source EN PDF p.35, unit 308 -->

2. 将设备或模块置于无光环境，用黑布或镜头盖等严密遮住镜头。

<!-- Source EN PDF p.35, unit 309 -->

3. Manual Exposure 勾选 Step 和 2^n，按 Gain Range 设置 Gain Begin=1.0、Gain End=Max、ExpTime=0.010。

<!-- Source EN PDF p.35, unit 310 -->

4. 点击 Start Manual Capture，按 2 的 N 次幂步进采集 Raw。

<!-- Source EN PDF p.35, unit 311 -->

5. Raw 显示在右侧，用下拉框切换要查看的图。

<!-- Source EN PDF p.35, unit 312 -->

![英文原稿技术图，第 35](/docs/rockchip-iq-tools/assets/en-p035-figure-01.png)

<!-- Source EN PDF p.35, unit 313 -->

图 4-2-3-1

<!-- Source EN PDF p.36, unit 314 -->

#### 4.2.4 标定流程

<!-- Source EN PDF p.36, unit 315 -->

![英文原稿技术图，第 36](/docs/rockchip-iq-tools/assets/en-p036-figure-01.png)

<!-- Source EN PDF p.36, unit 316 -->

图 4-2-4-1：BLC 标定结果

<!-- Source EN PDF p.36, unit 317 -->

1. 打开 Calibration Tool，点击左上 Edit Options，填写 Raw 尺寸、位宽、bayer 顺序。

<!-- Source EN PDF p.36, unit 318 -->

2. 选择 BLC 页，点击 Load Raw Files，选择存放 Raw 的文件夹。

<!-- Source EN PDF p.36, unit 319 -->

3. 导入的 Raw 显示在右侧列表。

<!-- Source EN PDF p.36, unit 320 -->

4. 点击 Calibrate。RV1106 的 Linear 模式标定须先填 Sensor OB。常用参考值如下：

<!-- Source EN PDF p.36, unit 321 -->

| 厂商 | OB 参考值 |
| --- | --- |
| GalaxyCore(gc) | 256 |
| OmniVision(ov/os) | 256 |
| Samsung(s5k) | 256 |
| SmartSens(sc) | 256 |
| Sony(imx) | 驱动序列可配置；建议查询 Datasheet 与驱动代码，以实际为准。 |

<!-- Source EN PDF p.36, unit 322 -->

5. 标定所得 Black Level Curve 显示在上方坐标轴。

<!-- Source EN PDF p.36, unit 323 -->

6. BLC 标定值显示在表中，点击 Save。

注意：

<!-- Source EN PDF p.36, unit 324 -->

1. 注意设备电源灯、状态灯等是否漏光。

<!-- Source EN PDF p.36, unit 325 -->

2. BLC 错值会影响后续所有模块标定；开始后续标定前须确认 BLC 正确。

<!-- Source EN PDF p.37, unit 326 -->

### 4.3 LSC 标定

<!-- Source EN PDF p.37, unit 327 -->

#### 4.3.1 基本原理

<!-- Source EN PDF p.37, unit 328 -->

Luma Shading 来自镜头光学特性。将整体视作凸透镜，其中心聚光能力远大于边角，Sensor 中心光强大于边角。无畸变相机的周边照度衰减遵循下式：

<!-- Source EN PDF p.37, unit 329 -->

![英文原稿技术图，第 37](/docs/rockchip-iq-tools/assets/en-p037-figure-01.png)

<!-- Source EN PDF p.37, unit 330 -->

`cos^4(theta)`

<!-- Source EN PDF p.37, unit 331 -->

#### 4.3.2 Raw 图像要求

<!-- Source EN PDF p.37, unit 332 -->

1. 镜头前放漫射片，或用 DNP 灯箱、积分球等设备。

<!-- Source EN PDF p.37, unit 333 -->

2. 标准光源灯箱中采集，建议标定 HZ、A、CWF、TL84、D50、D65、D75 七种光源。

<!-- Source EN PDF p.37, unit 334 -->

3. 为防交流光闪烁，曝光时间建议为 10ms 整数倍。

<!-- Source EN PDF p.37, unit 335 -->

4. Raw 最大亮度约 200 (8bit)，最小亮度须明显大于前一节标定黑电平。

<!-- Source EN PDF p.37, unit 336 -->

5. 建议使用下图漫射片。

<!-- Source EN PDF p.37, unit 337 -->

![英文原稿技术图，第 37](/docs/rockchip-iq-tools/assets/en-p037-figure-02.png)

<!-- Source EN PDF p.37, unit 338 -->

图 4-3-2-1：乳白漫射片

<!-- Source EN PDF p.37, unit 339 -->

#### 4.3.3 Raw 采集

<!-- Source EN PDF p.37, unit 340 -->

1. 按 3.1、3.2 打开 RK Capture Tool 并连接设备，模块选 LSC。

<!-- Source EN PDF p.37, unit 341 -->

2. 模块放入灯箱，切 HZ 光，将漫射片靠近镜头。

<!-- Source EN PDF p.38, unit 342 -->

3. 选 HZ，在 Auto Exposure 勾选 Search Exposure by Max Luma (8bit)、Anti Flicker (50hz)，右侧目标最大亮度设 200±10%，Frame Number = 1。

<!-- Source EN PDF p.38, unit 343 -->

4. 点击 Start Auto Capture；工具自动选择曝光，直到达到预设最大亮度。

<!-- Source EN PDF p.38, unit 344 -->

5. 光源切 A，名称改 A，重复步骤 4，直至所有光源完成。

<!-- Source EN PDF p.38, unit 345 -->

![英文原稿技术图，第 38](/docs/rockchip-iq-tools/assets/en-p038-figure-01.png)

<!-- Source EN PDF p.38, unit 346 -->

图 4-3-3-1

<!-- Source EN PDF p.38, unit 347 -->

#### 4.3.4 标定流程

<!-- Source EN PDF p.38, unit 348 -->

1. 打开 Calibration Tool，左上 Edit Options 中填写 Raw 尺寸、位宽、bayer 顺序。

<!-- Source EN PDF p.38, unit 349 -->

2. 选 LSC，点击 Load Raw Files 导入所有 Raw。

<!-- Source EN PDF p.38, unit 350 -->

3. 导入图显示在上方窗口。

<!-- Source EN PDF p.38, unit 351 -->

4. Light Fall off 设 100%。

<!-- Source EN PDF p.38, unit 352 -->

5. 点击 Calibrate。

<!-- Source EN PDF p.38, unit 353 -->

6. 完成后在结果页查看各光源 Raw。

<!-- Source EN PDF p.38, unit 354 -->

7. 点击 Save。

<!-- Source EN PDF p.38, unit 355 -->

8. Light Fall off 改 70%，重复步骤 5–7。

<!-- Source EN PDF p.39, unit 356 -->

![英文原稿技术图，第 39](/docs/rockchip-iq-tools/assets/en-p039-figure-01.png)

<!-- Source EN PDF p.39, unit 357 -->

图 4-3-4-1

<!-- Source EN PDF p.39, unit 358 -->

![英文原稿技术图，第 39](/docs/rockchip-iq-tools/assets/en-p039-figure-02.png)

<!-- Source EN PDF p.39, unit 359 -->

图 4-3-4-2

<!-- Source EN PDF p.39, unit 360 -->

注意：光过亮或过暗时可能无法找到合适曝光，可参考下列解决方法：

<!-- Source EN PDF p.39, unit 361 -->

1. 调整光源亮度。

<!-- Source EN PDF p.39, unit 362 -->

2. 使用 ND 滤镜。

<!-- Source EN PDF p.40, unit 363 -->

3. 调整镜头方向。

<!-- Source EN PDF p.40, unit 364 -->

4. 修改 Gain Range 或 Exp Range。

<!-- Source EN PDF p.40, unit 365 -->

5. 调整自动曝光最大亮度或阈值。

<!-- Source EN PDF p.40, unit 366 -->

6. 改用手动曝光；最低要求是最小亮度明显大于前一节黑电平。

<!-- Source EN PDF p.40, unit 367 -->

### 4.4 AWB 标定

<!-- Source EN PDF p.40, unit 368 -->

#### 4.4.1 简介

<!-- Source EN PDF p.40, unit 369 -->

标定 Raw 在 XY、UV、YUV 中的白点条件、简单颜色算法参数，以及标准光源下白平衡增益。

<!-- Source EN PDF p.40, unit 370 -->

#### 4.4.2 Raw 图像要求

<!-- Source EN PDF p.40, unit 371 -->

Raw 采集准备：

<!-- Source EN PDF p.40, unit 372 -->

1. 设备：X-Rite 24 ColorChecker、灯箱（D75、D65、D50、TL84、CWF、A、HZ）。

<!-- Source EN PDF p.40, unit 373 -->

2. 调整曝光，使最亮白色色块最大值在 [150-240]，范围内越亮越好；若后续 CCM 共用此 Raw，应偏暗一些。

<!-- Source EN PDF p.40, unit 374 -->

3. ColorChecker 占画面超过 1/9。

Raw 采集方法：

<!-- Source EN PDF p.40, unit 375 -->

1. 按 3.1、3.2 打开 RK Capture Tool 并连接设备，模块选 CCM_AWB。

<!-- Source EN PDF p.40, unit 376 -->

2. 设备和 ColorChecker 放入灯箱，调整位置，使色卡位于画面中心且尽量大；不要移动设备。

<!-- Source EN PDF p.40, unit 377 -->

3. 开灯箱，光源切 HZ。

<!-- Source EN PDF p.40, unit 378 -->

4. 选择 HZ，在 Auto Exposure 勾选 Search Exposure By Max Luma (8bit)、Anti Flicker (50hz)，目标最大亮度设 200±10%，Frame Number = 1。若 1x Gain、10ms 整数倍无法采集 Raw，关闭 Anti-Flicker (50hz) 再试。

<!-- Source EN PDF p.41, unit 379 -->

![英文原稿技术图，第 41](/docs/rockchip-iq-tools/assets/en-p041-figure-01.png)

<!-- Source EN PDF p.41, unit 380 -->

图 4-4-2-1

<!-- Source EN PDF p.41, unit 381 -->

5. 点击 Start Auto Capture，工具自动选曝光，直至达到预设最大亮度。

<!-- Source EN PDF p.41, unit 382 -->

6. 光源切 A，名称改 A，重复前面步骤直至所有光源完成。

<!-- Source EN PDF p.41, unit 383 -->

标定 Raw 去马赛克后的示例如下：

<!-- Source EN PDF p.41, unit 384 -->

![英文原稿技术图，第 41](/docs/rockchip-iq-tools/assets/en-p041-figure-02.png)

<!-- Source EN PDF p.41, unit 385 -->

图 4-4-2-2

<!-- Source EN PDF p.42, unit 386 -->

#### 4.4.3 标定工具介绍

<!-- Source EN PDF p.42, unit 387 -->

1. 调整 UV、XY 域白点条件及 YUV 域 TH。

<!-- Source EN PDF p.42, unit 388 -->

![英文原稿技术图，第 42](/docs/rockchip-iq-tools/assets/en-p042-figure-01.png)

<!-- Source EN PDF p.42, unit 389 -->

图 4-4-3-1

<!-- Source EN PDF p.42, unit 390 -->

![英文原稿技术图，第 42](/docs/rockchip-iq-tools/assets/en-p042-figure-02.png)

<!-- Source EN PDF p.42, unit 391 -->

图 4-4-3-2

<!-- Source EN PDF p.42, unit 392 -->

2. UV、XY 域白点条件调整说明：

<!-- Source EN PDF p.42, unit 393 -->

a) 拖动坐标系中任一光源白点区域的四角，调整位置和大小。

<!-- Source EN PDF p.42, unit 394 -->

b) 在坐标系空白处拖动，调整显示范围。

<!-- Source EN PDF p.42, unit 395 -->

c) 滚轮缩放，调整比例。

<!-- Source EN PDF p.42, unit 396 -->

d) Exclude WPC Range 可设置非白点区域和额外光源白点区域。

<!-- Source EN PDF p.42, unit 397 -->

3. AWB Simulation 检测原图白点，计算 WB Gain、白点数，并将指定像素映射到 UV、XY，确认白点条件。

<!-- Source EN PDF p.43, unit 398 -->

![英文原稿技术图，第 43](/docs/rockchip-iq-tools/assets/en-p043-figure-01.png)

<!-- Source EN PDF p.43, unit 399 -->

图 4-4-3-3

<!-- Source EN PDF p.44, unit 400 -->

a) LoadImage 导入 Raw 后打印白点信息。不同光源的白点以不同颜色显示；中框、大框白点数以及 RGain、BGain 累计值显示于 WP Number、RGain、BGain 三个文本框。

<!-- Source EN PDF p.44, unit 401 -->

![英文原稿技术图，第 44](/docs/rockchip-iq-tools/assets/en-p044-figure-01.png)

<!-- Source EN PDF p.44, unit 402 -->

图 4-4-3-4

<!-- Source EN PDF p.45, unit 403 -->

b) 点击图中任意位置（黑箭头），会映射为 UV、XY 域的小黑方块，便于检查是否落在白点范围。还会显示该点 R G B U V X Y RGain BGain（红框），以及映射至各光源 YUV 后的 u、th 与标准白点偏差距离（绿框三列）。

<!-- Source EN PDF p.45, unit 404 -->

![英文原稿技术图，第 45](/docs/rockchip-iq-tools/assets/en-p045-figure-01.png)

<!-- Source EN PDF p.45, unit 405 -->

图 4-4-3-5

<!-- Source EN PDF p.45, unit 406 -->

![英文原稿技术图，第 45](/docs/rockchip-iq-tools/assets/en-p045-figure-02.png)

<!-- Source EN PDF p.45, unit 407 -->

图 4-4-3-6

<!-- Source EN PDF p.46, unit 408 -->

#### 4.4.4 标定流程

<!-- Source EN PDF p.46, unit 409 -->

1. 打开 Calibration Tool → Edit Options，填写 Raw 尺寸、sensor bpp、bayer 顺序。

<!-- Source EN PDF p.46, unit 410 -->

2. AWB 标定前必须完成 BLC、LSC。

<!-- Source EN PDF p.46, unit 411 -->

3. Load Raw Files 导入 A、CWF、D50、D65、D75、HZ、TL84 七种推荐光源 Raw。

<!-- Source EN PDF p.46, unit 412 -->

4. Find Chart 打开色块搜索界面。导入图若镜像，可用右侧 Flip；该版本支持水平及垂直翻转。

<!-- Source EN PDF p.46, unit 413 -->

![英文原稿技术图，第 46](/docs/rockchip-iq-tools/assets/en-p046-figure-01.png)

<!-- Source EN PDF p.46, unit 414 -->

图 4-4-4-1

<!-- Source EN PDF p.46, unit 415 -->

a) 拖动左上、右上、左下、右下红框中心点调整统计区域，尽量使其位于每个色块中心，见图 4-4-4-1。

<!-- Source EN PDF p.46, unit 416 -->

b) 点击 FindChart，识别所有光源色块，见图 4-4-4-2。

<!-- Source EN PDF p.47, unit 417 -->

![英文原稿技术图，第 47](/docs/rockchip-iq-tools/assets/en-p047-figure-01.png)

<!-- Source EN PDF p.47, unit 418 -->

图 4-4-4-2

<!-- Source EN PDF p.47, unit 419 -->

c) 菜单选择其他光源，确认色块检测。正确见图 4-4-4-4，错误位置见图 4-4-4-3。错误时在 Mode 选 Find Current Chart，单独重复 a)、b)，直至正确。

<!-- Source EN PDF p.47, unit 420 -->

![英文原稿技术图，第 47](/docs/rockchip-iq-tools/assets/en-p047-figure-02.png)

<!-- Source EN PDF p.47, unit 421 -->

图 4-4-4-3

<!-- Source EN PDF p.48, unit 422 -->

![英文原稿技术图，第 48](/docs/rockchip-iq-tools/assets/en-p048-figure-01.png)

<!-- Source EN PDF p.48, unit 423 -->

图 4-4-4-4

<!-- Source EN PDF p.48, unit 424 -->

d) 点击 save，完成检测。

<!-- Source EN PDF p.48, unit 425 -->

5. 点击 Calibrate，原文约需 30s，得到初始白点条件等参数。UV、XY 中不同颜色点表示各光源 ColorChecker 色块的坐标，矩形框表示各光源白点条件。

<!-- Source EN PDF p.48, unit 426 -->

![英文原稿技术图，第 48](/docs/rockchip-iq-tools/assets/en-p048-figure-02.png)

<!-- Source EN PDF p.48, unit 427 -->

图 4-4-4-5

<!-- Source EN PDF p.49, unit 428 -->

![英文原稿技术图，第 49](/docs/rockchip-iq-tools/assets/en-p049-figure-01.png)

<!-- Source EN PDF p.49, unit 429 -->

图 4-4-4-6

<!-- Source EN PDF p.49, unit 430 -->

6. AWB Simulation 依次导入 A、CWF、D50、D65、D75、HZ、TL84 Raw，检查白点检测准确性。

<!-- Source EN PDF p.49, unit 431 -->

7. 调整 UV/XY 框或 YUV 的 TH，提高各光源色卡白点检测准确性。

<!-- Source EN PDF p.49, unit 432 -->

8. 点击 Save，再在 AWB Simulation 点击 Run Simulator，查看导入光源图的白点结果。

<!-- Source EN PDF p.49, unit 433 -->

9. 重复 6–8，直到各光源白点检测合理。

<!-- Source EN PDF p.50, unit 434 -->

注意：

<!-- Source EN PDF p.50, unit 435 -->

1. 尽量使白点（19、20、21、22 色块）在框内，非白点在框外。

<!-- Source EN PDF p.50, unit 436 -->

2. 黑体轨迹上各光源中框在 x 方向应连续。错误示例：大框间距小、中框间距大。

<!-- Source EN PDF p.50, unit 437 -->

![英文原稿技术图，第 50](/docs/rockchip-iq-tools/assets/en-p050-figure-01.png)

<!-- Source EN PDF p.50, unit 438 -->

正确示例如下：

<!-- Source EN PDF p.50, unit 439 -->

![英文原稿技术图，第 50](/docs/rockchip-iq-tools/assets/en-p050-figure-02.png)

<!-- Source EN PDF p.50, unit 440 -->

3. XY 域 Y 方向 A、HZ 可略小，D50、D65 可略大。

<!-- Source EN PDF p.50, unit 441 -->

4. 色温接近的 CWF、TL84 可在 Y 方向调整为相邻。

<!-- Source EN PDF p.50, unit 442 -->

5. UV 域任意两个光源之间不能有空隙。

<!-- Source EN PDF p.50, unit 443 -->

6. 光源区域可重叠，但不能在 XY、UV 同时重叠。

<!-- Source EN PDF p.50, unit 444 -->

7. 排除非白点时，以 XY 分布为参考调整 UV。

<!-- Source EN PDF p.51, unit 445 -->

例如下图圈出的 D75 第 7 色块落在 HZ 范围，会误判为白点。

<!-- Source EN PDF p.51, unit 446 -->

![英文原稿技术图，第 51](/docs/rockchip-iq-tools/assets/en-p051-figure-01.png)

<!-- Source EN PDF p.51, unit 447 -->

调整后，D75 第 7 色块在 xy、uv 中不属于同一光源，不再判为白点。

<!-- Source EN PDF p.51, unit 448 -->

![英文原稿技术图，第 51](/docs/rockchip-iq-tools/assets/en-p051-figure-02.png)

<!-- Source EN PDF p.51, unit 449 -->

8. 非白点落在 XY、UV 白点范围时，可减小 TH 或扩大非白点范围排除。

<!-- Source EN PDF p.51, unit 450 -->

9. 白点虽在 XY、UV 白点范围却未识别时，可能超出亮度范围、落入非白点区域，或小于 TH，未处于 YUV 白点区间。

<!-- Source EN PDF p.52, unit 451 -->

#### 4.4.5 AWB 标定结果示例

<!-- Source EN PDF p.52, unit 452 -->

最终白点条件：

<!-- Source EN PDF p.52, unit 453 -->

![英文原稿技术图，第 52](/docs/rockchip-iq-tools/assets/en-p052-figure-01.png)

<!-- Source EN PDF p.52, unit 454 -->

图 4-4-5-1

<!-- Source EN PDF p.52, unit 455 -->

各光源白点检测结果：

<!-- Source EN PDF p.52, unit 456 -->

![英文原稿技术图，第 52](/docs/rockchip-iq-tools/assets/en-p052-figure-02.png)

<!-- Source EN PDF p.53, unit 457 -->

图 4-4-5-1 A

<!-- Source EN PDF p.53, unit 458 -->

![英文原稿技术图，第 53](/docs/rockchip-iq-tools/assets/en-p053-figure-01.png)

<!-- Source EN PDF p.53, unit 459 -->

图 4-4-5-2 CWF

<!-- Source EN PDF p.53, unit 460 -->

![英文原稿技术图，第 53](/docs/rockchip-iq-tools/assets/en-p053-figure-02.png)

<!-- Source EN PDF p.54, unit 461 -->

图 4-4-5-3 D50

<!-- Source EN PDF p.54, unit 462 -->

![英文原稿技术图，第 54](/docs/rockchip-iq-tools/assets/en-p054-figure-01.png)

<!-- Source EN PDF p.54, unit 463 -->

图 4-4-5-4 D65

<!-- Source EN PDF p.54, unit 464 -->

![英文原稿技术图，第 54](/docs/rockchip-iq-tools/assets/en-p054-figure-02.png)

<!-- Source EN PDF p.55, unit 465 -->

图 4-4-5-5 D75

<!-- Source EN PDF p.55, unit 466 -->

![英文原稿技术图，第 55](/docs/rockchip-iq-tools/assets/en-p055-figure-01.png)

<!-- Source EN PDF p.55, unit 467 -->

图 4-4-5-6 HZ

<!-- Source EN PDF p.55, unit 468 -->

![英文原稿技术图，第 55](/docs/rockchip-iq-tools/assets/en-p055-figure-02.png)

<!-- Source EN PDF p.55, unit 469 -->

图 4-4-5-7 TL84

<!-- Source EN PDF p.56, unit 470 -->

### 4.5 CCM 标定

<!-- Source EN PDF p.56, unit 471 -->

#### 4.5.1 Raw 图像要求

<!-- Source EN PDF p.56, unit 472 -->

Raw 要求见 4.4，CCM 可复用 AWB Raw。Gamma 曲线影响 CCM 结果，修改 Gamma 后可能需重新调 CCM，参见

<!-- Source EN PDF p.56, unit 473 -->

4.5.2 第 12 点。

<!-- Source EN PDF p.56, unit 474 -->

#### 4.5.2 CCM 标定流程

<!-- Source EN PDF p.56, unit 475 -->

1. Calibration Tool 选 CCM，Load Raw Files 导入所有 Raw，列表显示导入图。

<!-- Source EN PDF p.56, unit 476 -->

![英文原稿技术图，第 56](/docs/rockchip-iq-tools/assets/en-p056-figure-01.png)

<!-- Source EN PDF p.56, unit 477 -->

图 4-5-2-1

<!-- Source EN PDF p.57, unit 478 -->

2. Find Chart 打开色块搜索界面。

<!-- Source EN PDF p.57, unit 479 -->

![英文原稿技术图，第 57](/docs/rockchip-iq-tools/assets/en-p057-figure-01.png)

<!-- Source EN PDF p.57, unit 480 -->

图 4-5-2-2

<!-- Source EN PDF p.57, unit 481 -->

3. 拖动四角红框中心点调整采样区，使其位于每个色块中心。

<!-- Source EN PDF p.57, unit 482 -->

4. Find Chart 统计色块值，统计区域标为绿色。

<!-- Source EN PDF p.57, unit 483 -->

5. 逐一检查列表中光源，确认统计区域正确。

<!-- Source EN PDF p.57, unit 484 -->

![英文原稿技术图，第 57](/docs/rockchip-iq-tools/assets/en-p057-figure-02.png)

<!-- Source EN PDF p.57, unit 485 -->

图 4-5-2-3

<!-- Source EN PDF p.57, unit 486 -->

6. 搜索完成后 Save 并退出。

<!-- Source EN PDF p.57, unit 487 -->

7. 饱和度设 100%，见图 4-5-2-4。

<!-- Source EN PDF p.58, unit 488 -->

![英文原稿技术图，第 58](/docs/rockchip-iq-tools/assets/en-p058-figure-01.png)

<!-- Source EN PDF p.58, unit 489 -->

图 4-5-2-4

<!-- Source EN PDF p.58, unit 490 -->

8. 点击 Calibrate，原文标定约需 20s。

<!-- Source EN PDF p.58, unit 491 -->

9. 完成后结果显示在结果页。

<!-- Source EN PDF p.58, unit 492 -->

10. 点击 Save。

<!-- Source EN PDF p.58, unit 493 -->

11. 饱和度改 74%，重复 8–10。

<!-- Source EN PDF p.58, unit 494 -->

![英文原稿技术图，第 58](/docs/rockchip-iq-tools/assets/en-p058-figure-02.png)

<!-- Source EN PDF p.58, unit 495 -->

图 4-5-2-5

<!-- Source EN PDF p.58, unit 496 -->

12. ΔE 过大可能因 Raw 过亮。右键图 4-5-2-5 右侧 ColorChecker，点击 Save Current，保存图并检查色块过曝或某通道饱和；应用 Gamma 曲线后标定 CCM 可能使标定色块饱和。

<!-- Source EN PDF p.58, unit 497 -->

a) 过亮或过饱和时，应降低曝光，重新采集该光源色卡并标定。

<!-- Source EN PDF p.58, unit 498 -->

b) 色块亮度正常时，可能原因包括 BLC 异常、LSC 异常、镜头漏光（红外）等。

<!-- Source EN PDF p.58, unit 499 -->

13. 具体调试方法参见 Rockchip_Color_Optimization_Guide。

<!-- Source EN PDF p.59, unit 500 -->

### 4.6 NR 标定

<!-- Source EN PDF p.59, unit 501 -->

#### 4.6.1 Raw 图像要求

<!-- Source EN PDF p.59, unit 502 -->

NR 模块 Raw 采集说明：

<!-- Source EN PDF p.59, unit 503 -->

1. 在标准光源灯箱采集，建议亮度可调的直流光源。

<!-- Source EN PDF p.59, unit 504 -->

2. 必须使用图 4-6-1-1 所示灰阶渐变卡。

<!-- Source EN PDF p.59, unit 505 -->

![英文原稿技术图，第 59](/docs/rockchip-iq-tools/assets/en-p059-figure-01.png)

<!-- Source EN PDF p.59, unit 506 -->

图 4-6-1-1

<!-- Source EN PDF p.59, unit 507 -->

3. 曝光须遍历 Gain=1x、2x、4x、8x、16x...Max；如最大支持 40x，则 Max=32。

<!-- Source EN PDF p.59, unit 508 -->

4. 每个 Gain 采四张 Raw：高光叠帧、高光单帧、低光叠帧、低光单帧。

<!-- Source EN PDF p.59, unit 509 -->

5. 用曝光时间或光亮度区分高光、低光；多帧及单帧由工具处理生成。

<!-- Source EN PDF p.59, unit 510 -->

6. 以下亮度值均为 8-bit。

<!-- Source EN PDF p.59, unit 511 -->

7. 低光要求：图 4-6-1-1 最亮块值达到 30，以看清各色块边界；不满足可适当提高。最暗块达到 Black-Level，通常最亮块刚到 30 时即可满足。

<!-- Source EN PDF p.59, unit 512 -->

8. 高光要求：最亮块达到 255，最暗块一般约 60–70。

<!-- Source EN PDF p.59, unit 513 -->

9. RK Capture Tool 的 YNR Capture 根据最暗、最亮块亮度设置，自动搜索合格曝光组合。

<!-- Source EN PDF p.59, unit 514 -->

#### 4.6.2 Raw 采集

<!-- Source EN PDF p.59, unit 515 -->

1. 按 3.1、3.2 打开 RK Capture Tool 并连接设备。

<!-- Source EN PDF p.59, unit 516 -->

2. 设备或模块放入灯箱，将渐变卡贴在灯箱上。

<!-- Source EN PDF p.59, unit 517 -->

3. 调整设备位置，使渐变卡居中并尽量占满画面。

<!-- Source EN PDF p.60, unit 518 -->

4. 开灯箱，切 TL84 或 CWF。

<!-- Source EN PDF p.60, unit 519 -->

5. 光源名称改 TL84 或 CWF，模块名设 NR_Normal。

<!-- Source EN PDF p.60, unit 520 -->

6. 假设 Sensor 支持 Gain=1-24，需采 1x、2x、4x、8x、16x。

<!-- Source EN PDF p.60, unit 521 -->

7. 选 YNR Capture，先拍一张 Raw。右键右侧预览选择 Draw ROI，依次框出最亮、最暗块，后称白块、黑块。双击矩形可重画；固定画面与矩形位置后进行 NR 采集，见

<!-- Source EN PDF p.60, unit 522 -->

图 4-6-2-1。

<!-- Source EN PDF p.60, unit 523 -->

![英文原稿技术图，第 60](/docs/rockchip-iq-tools/assets/en-p060-figure-01.png)

<!-- Source EN PDF p.60, unit 524 -->

图 4-6-2-1

<!-- Source EN PDF p.60, unit 525 -->

8. 低光 Raw：灯箱约 800lux，Gain Range 改为 1.0 - 1.0，Exp Range 不改。勾选 Multi-Frame、Low-Light。在 YNR Capture 填黑白矩形阈值，FrameNumber=32。Black Block Mean Luma 为黑块目标值，初始填 BLC(8bit)+1；White Block Mean Luma 为白块目标值，初始填

<!-- Source EN PDF p.60, unit 526 -->

30。

<!-- Source EN PDF p.60, unit 527 -->

![英文原稿技术图，第 60](/docs/rockchip-iq-tools/assets/en-p060-figure-02.png)

<!-- Source EN PDF p.60, unit 528 -->

图 4-6-2-2

<!-- Source EN PDF p.61, unit 529 -->

a) 点击 Start YNR Capture；日志打印两个矩形当前均值和对应曝光。meanValue[0]：黑块当前均值；meanValue[1]：白块当前均值；blackTarget：填写的 Black Block Mean Luma；whiteTarget：填写的 White Block Mean Luma。

<!-- Source EN PDF p.61, unit 530 -->

b) 若阈值导致无法采集（图 4-6-2-3），查看日志。原文表述为找到“meanValue[1] 刚大于 whiteTarget 的 meanValue[0]”，将该值设为 Black Block Mean Luma；为避免噪声干扰可略提高 meanValue[0]，见图 4-6-2-4。该比较关系原文不清晰，保留并在校对记录中标为待核实，不猜测改写。

<!-- Source EN PDF p.61, unit 531 -->

![英文原稿技术图，第 61](/docs/rockchip-iq-tools/assets/en-p061-figure-01.png)

<!-- Source EN PDF p.61, unit 532 -->

图 4-6-2-3

<!-- Source EN PDF p.61, unit 533 -->

![英文原稿技术图，第 61](/docs/rockchip-iq-tools/assets/en-p061-figure-02.png)

<!-- Source EN PDF p.61, unit 534 -->

图 4-6-2-4

<!-- Source EN PDF p.62, unit 535 -->

c) 找到满足条件的阈值后，再点 Start YNR Capture。完成后得到带 Multiple、Single 后缀的 Raw，见图 4-6-2-5。

<!-- Source EN PDF p.62, unit 536 -->

![英文原稿技术图，第 62](/docs/rockchip-iq-tools/assets/en-p062-figure-01.png)

<!-- Source EN PDF p.62, unit 537 -->

图 4-6-2-5

<!-- Source EN PDF p.62, unit 538 -->

9. 高光 Raw：灯箱约 800lux，Gain Range 1.0 - 1.0，Exp Range 不变，勾选 Multi-Frame、High-Light。在 YNR Capture 设置 Black Block Mean Luma 初始 60、White Block Mean Luma 固定 255，FrameNumber=32。

<!-- Source EN PDF p.63, unit 539 -->

![英文原稿技术图，第 63](/docs/rockchip-iq-tools/assets/en-p063-figure-01.png)

<!-- Source EN PDF p.63, unit 540 -->

图 4-6-2-6

<!-- Source EN PDF p.63, unit 541 -->

a) Start YNR Capture 后，每次调整曝光会记录 ROI 均值、曝光、增益。meanValue[0]：最暗块均值；meanValue[1]：最亮块均值；blackTarget、whiteTarget 分别为填写的 Black Block Mean Luma、White Block Mean Luma 阈值。

<!-- Source EN PDF p.63, unit 542 -->

b) 曝光与增益已到最大、最亮块仍不到 255（图 4-6-2-7）时，手动调灯箱亮度，再点 Start YNR Capture。满足条件后得到 Multiple、Single 后缀 Raw，见图 4-6-2-8。

<!-- Source EN PDF p.63, unit 543 -->

![英文原稿技术图，第 63](/docs/rockchip-iq-tools/assets/en-p063-figure-02.png)

<!-- Source EN PDF p.63, unit 544 -->

图 4-6-2-7

<!-- Source EN PDF p.64, unit 545 -->

![英文原稿技术图，第 64](/docs/rockchip-iq-tools/assets/en-p064-figure-01.png)

<!-- Source EN PDF p.64, unit 546 -->

图 4-6-2-8

<!-- Source EN PDF p.64, unit 547 -->

10. Gain Range 改 2x，重复 8、9，直至所有 Gain 采完。

<!-- Source EN PDF p.64, unit 548 -->

11. Gain 增大后，黑块阈值受噪声影响明显，可根据日志略调。

<!-- Source EN PDF p.65, unit 549 -->

#### 4.6.3 标定流程

<!-- Source EN PDF p.65, unit 550 -->

GIC & BayerNR、YNR & MFNR 共用同组 Raw：

<!-- Source EN PDF p.65, unit 551 -->

1. Calibration Tool 左上 Edit Options 填写 Raw 尺寸、位宽、bayer 顺序。

<!-- Source EN PDF p.65, unit 552 -->

2. GIC & Bayer NR 页用 Load Raw Files 导入全部 Raw，显示在下方列表。

<!-- Source EN PDF p.65, unit 553 -->

3. Find ROI 框选渐变卡（图 4-6-3-1），确保矩形在色块内。

<!-- Source EN PDF p.65, unit 554 -->

![英文原稿技术图，第 65](/docs/rockchip-iq-tools/assets/en-p065-figure-01.png)

<!-- Source EN PDF p.65, unit 555 -->

图 4-6-3-1

<!-- Source EN PDF p.65, unit 556 -->

4. 点击 Calibrate。

<!-- Source EN PDF p.65, unit 557 -->

5. 完成后的 BayerNR 噪声曲线显示在右侧，见图 4-6-3-2。

<!-- Source EN PDF p.65, unit 558 -->

![英文原稿技术图，第 65](/docs/rockchip-iq-tools/assets/en-p065-figure-02.png)

<!-- Source EN PDF p.65, unit 559 -->

图 4-6-3-2

<!-- Source EN PDF p.66, unit 560 -->

6. 点击 Save。

<!-- Source EN PDF p.66, unit 561 -->

7. YNR&MFNR 页用 Load Raw Files 导入全部 Raw，下方列表可查看。

<!-- Source EN PDF p.66, unit 562 -->

8. Calculate YUV 由模拟器将 Raw 处理为 YUV。

<!-- Source EN PDF p.66, unit 563 -->

9. 点击 Calibrate；标定前勾选 YNRCurve Print，可保存每个 iso 的标定参数与采样点。

<!-- Source EN PDF p.66, unit 564 -->

10. YNR 噪声曲线显示在右侧，见图 4-6-3-3。

<!-- Source EN PDF p.66, unit 565 -->

11. 点击 Save。

<!-- Source EN PDF p.66, unit 566 -->

![英文原稿技术图，第 66](/docs/rockchip-iq-tools/assets/en-p066-figure-01.png)

<!-- Source EN PDF p.66, unit 567 -->

图 4-6-3-3

<!-- Source EN PDF p.66, unit 568 -->

注意：噪声曲线与图 4-6-3-3 差异很大，可能是高光或低光亮度错误。左侧曲线异常表示低光不合适，右侧异常表示高光不合适。光源色温不可过高或过低，否则 Calculate YUV 可能不正确。灯箱最小亮度不能满足采集要求时，可用减光膜辅助。

<!-- Source EN PDF p.67, unit 569 -->

### 4.7 FEC/LDCH

<!-- Source EN PDF p.67, unit 570 -->

FEC/LDCH 需要 map table，记录图像水平 x/y 坐标，是降采样后的映射表。生成它需了解镜头参数，拍摄一组棋盘图，并用标定工具标定。

<!-- Source EN PDF p.67, unit 571 -->

#### 4.7.1 标定图像要求

<!-- Source EN PDF p.67, unit 572 -->

拍摄棋盘，尺寸可变，标定图仅支持 jpg、bmp、png。两种方式：方法 1 每图仅一个棋盘，精度较高，推荐；方法 2 每图含 n 个棋盘，为方便标定 n=4。

<!-- Source EN PDF p.67, unit 573 -->

1. 准备工作

(1) 使用标准标定板。自行打印须注意真实尺寸，表面平整，最好固定在平板上。横纵格数应尽量不同，便于工具识别方向。

(2) 适当照明与环境：亮度适中，所有角度图像清晰，棋盘无反光、模糊。全过程固定光圈和焦距，即保持进光量与焦距不变。

<!-- Source EN PDF p.67, unit 574 -->

2. 操作规则

(1) 比例：棋盘占整个视野约 1/4 至 1/8。

(2) 数量：全部图覆盖整个视野，通常约 15 张；太少会导致参数不准。建议每个位置拍 3–4 张，便于筛选并替换不合格图。

(3) 分布：原文称图 2-1，标定板应均匀覆盖各区域与角落；靠边时尽量贴近视野边缘，但不能出画。

(4) 角度：不要只拍平行镜头平面的图，应有不同倾角。

<!-- Source EN PDF p.68, unit 575 -->

3. 拍摄演示

<!-- Source EN PDF p.68, unit 576 -->

两种拍法：(1) 推荐方法 1：四张标定图，棋盘分别在左上、右上、左下、右下，无固定顺序。

<!-- Source EN PDF p.68, unit 577 -->

![英文原稿技术图，第 68](/docs/rockchip-iq-tools/assets/en-p068-figure-01.png)

<!-- Source EN PDF p.68, unit 578 -->

![英文原稿技术图，第 68](/docs/rockchip-iq-tools/assets/en-p068-figure-02.png)

<!-- Source EN PDF p.68, unit 579 -->

![英文原稿技术图，第 68](/docs/rockchip-iq-tools/assets/en-p068-figure-03.png)

<!-- Source EN PDF p.69, unit 580 -->

![英文原稿技术图，第 69](/docs/rockchip-iq-tools/assets/en-p069-figure-01.png)

<!-- Source EN PDF p.69, unit 581 -->

图 4-7-1-1

<!-- Source EN PDF p.69, unit 582 -->

(2) 方法 2：一张图，左上、右上、左下、右下各有棋盘。

<!-- Source EN PDF p.69, unit 583 -->

![英文原稿技术图，第 69](/docs/rockchip-iq-tools/assets/en-p069-figure-02.png)

<!-- Source EN PDF p.69, unit 584 -->

图 4-7-1-2

<!-- Source EN PDF p.70, unit 585 -->

#### 4.7.2 标定流程

<!-- Source EN PDF p.70, unit 586 -->

![英文原稿技术图，第 70](/docs/rockchip-iq-tools/assets/en-p070-figure-01.png)

<!-- Source EN PDF p.70, unit 587 -->

图 4-7-2-1

<!-- Source EN PDF p.70, unit 588 -->

1. Raw Options 配置分辨率，Bit、Bayer Pattern 可忽略。

<!-- Source EN PDF p.70, unit 589 -->

2. 导入标定图文件夹，支持 jpg、bmp、png。

<!-- Source EN PDF p.70, unit 590 -->

3. 调整标定配置参数。

<!-- Source EN PDF p.70, unit 591 -->

a) Square Size：实际每格尺寸，一般 30mm 或 25mm。

<!-- Source EN PDF p.70, unit 592 -->

b) Horizontal/Vertical：棋盘水平与垂直的内部角点数量。

<!-- Source EN PDF p.70, unit 593 -->

c) Check Board Number：每图棋盘数，1 或 4。

<!-- Source EN PDF p.70, unit 594 -->

d) Level：畸变校正等级，共 256 级。Level = 0 的映射表不校正，输出等于输入；Level = 255 为 LDCH 能达到的最大校正。

<!-- Source EN PDF p.70, unit 595 -->

e) Correct Direction：FEC 可选择方向。i. 仅 Correct X：只校正水平方向，类似 LDCH；ii. 仅 Correct Y：只校正垂直；iii. 同时选 X、Y：水平、垂直均校正。

<!-- Source EN PDF p.70, unit 596 -->

4. 点击 Calibrate。

<!-- Source EN PDF p.70, unit 597 -->

5. 保存结果。

<!-- Source EN PDF p.71, unit 598 -->

棋盘角点与内角点的区分见图 4-7-2-2。示例横向 12 格、纵向 9 格，横向角点 13、内角点 11；故 Horizontal = 11、Vertical = 8。

<!-- Source EN PDF p.71, unit 599 -->

![英文原稿技术图，第 71](/docs/rockchip-iq-tools/assets/en-p071-figure-01.png)

<!-- Source EN PDF p.71, unit 600 -->

图 4-7-2-2：棋盘角点与内角点

<!-- Source EN PDF p.71, unit 601 -->

角点包括红、绿，内角点仅红色。

<!-- Source EN PDF p.71, unit 602 -->

注意：

<!-- Source EN PDF p.71, unit 603 -->

1. 工具路径须有 result 文件夹，没有则在 Calibration Tool 同目录新建 result。

<!-- Source EN PDF p.71, unit 604 -->

2. 最外圈棋盘也参与计算，采集时不能让预览完全遮住外圈黑白块。

<!-- Source EN PDF p.71, unit 605 -->

3. 水平角点数等于水平黑白格数减 1。

<!-- Source EN PDF p.71, unit 606 -->

4. 垂直角点数等于垂直黑白格数减 1。

<!-- Source EN PDF p.71, unit 607 -->

5. FEC 默认双向校正，标定时可选择方向。

<!-- Source EN PDF p.71, unit 608 -->

6. 图片文件夹最好以 Sensor 名 + 镜头名/焦距 + 分辨率命名，工具按此名生成标定文件目录。

<!-- Source EN PDF p.72, unit 609 -->

#### 4.7.3 标定结果示例

<!-- Source EN PDF p.72, unit 610 -->

1. 标定失败通常因棋盘不清晰，导致角点检测不准或不全。先确认各图角点完整准确，完整检测的图不能少于 3 张。

<!-- Source EN PDF p.72, unit 611 -->

2. 成功后显示图 4-7-3-1，可在左侧 log 查看六个参数，自上而下为相机中心 cx、cy，以及畸变参数 a0、a2、a3、a4。

<!-- Source EN PDF p.72, unit 612 -->

3. result 中可查看各图角点结果；不准确则删除该图并重新标定。FEC、LDCH 映射表保存在 result 对应子目录。

<!-- Source EN PDF p.72, unit 613 -->

![英文原稿技术图，第 72](/docs/rockchip-iq-tools/assets/en-p072-figure-01.png)

<!-- Source EN PDF p.72, unit 614 -->

图 4-7-3-1

<!-- Source EN PDF p.73, unit 615 -->

## 5 在线调试

<!-- Source EN PDF p.73, unit 616 -->

### 5.1 调试界面介绍

<!-- Source EN PDF p.73, unit 617 -->

![英文原稿技术图，第 73](/docs/rockchip-iq-tools/assets/en-p073-figure-01.png)

<!-- Source EN PDF p.73, unit 618 -->

图 5-1-1：RKISP Tuner v2 主界面

<!-- Source EN PDF p.73, unit 619 -->

图 5-1-1 为典型使用状态：调试 UI 已加载并导入 IQ 参数。图中编号含义如下：

<!-- Source EN PDF p.73, unit 620 -->

1. 模块树：顶部 normal: day 为加载 IQ 时选择的场景，normal 是主场景，day 是子场景。

<!-- Source EN PDF p.73, unit 621 -->

2. ISP 模块：场景可含多个模块，模块可含多个页面。

<!-- Source EN PDF p.73, unit 622 -->

3. 调试页：模块节点可含多页，每页可含多个调试单元。

<!-- Source EN PDF p.73, unit 623 -->

4. 调试单元：如 InitExp，包含 5 个数值成员参数。

<!-- Source EN PDF p.73, unit 624 -->

5. 单元读写按钮：在线读写整个单元所有参数。

<!-- Source EN PDF p.74, unit 625 -->

6. 自动写：已连接 rkaiq_tool_server 时，每次修改参数均自动下发到设备并生效。

<!-- Source EN PDF p.74, unit 626 -->

7. 页/模块读写按钮：在线读写整页或模块。

<!-- Source EN PDF p.74, unit 627 -->

8. Undo/Redo：撤销上次修改；若勾选 AutoWrite，设备同步操作。

<!-- Source EN PDF p.74, unit 628 -->

9. 搜索：按关键词找参数所在页。

<!-- Source EN PDF p.74, unit 629 -->

### 5.2 平台与网络配置

<!-- Source EN PDF p.74, unit 630 -->

首次启动或点击 Project → Network and Platform Settings，打开平台网络配置窗口。

<!-- Source EN PDF p.74, unit 631 -->

![英文原稿技术图，第 74](/docs/rockchip-iq-tools/assets/en-p074-figure-01.png)

<!-- Source EN PDF p.74, unit 632 -->

图 5-2-1

<!-- Source EN PDF p.74, unit 633 -->

1. Platform Setting：选芯片会加载不同 UI 配置，平台对应关系在 config/config.ini。

<!-- Source EN PDF p.74, unit 634 -->

2. Network Config：设备地址配置，端口默认 5543，无特殊需求不要修改。

<!-- Source EN PDF p.74, unit 635 -->

点击 Connect，工具尝试连接设备 rkaiq_tool_server，须保证该服务正常运行。

<!-- Source EN PDF p.75, unit 636 -->

### 5.3 寄存器与算法参数

<!-- Source EN PDF p.75, unit 637 -->

每个调试单元包含寄存器或算法参数，按形式和值域使用不同控件，通常分四类：

<!-- Source EN PDF p.75, unit 638 -->

1. 数值：有值域的整数或浮点数；可直接修改、用上下箭头或右侧滑块调整。

<!-- Source EN PDF p.75, unit 639 -->

![英文原稿技术图，第 75](/docs/rockchip-iq-tools/assets/en-p075-figure-01.png)

<!-- Source EN PDF p.75, unit 640 -->

图 5-3-1

<!-- Source EN PDF p.75, unit 641 -->

2. 布尔：值 0/1，主要用于开关；Enable 为 1，Disable 为 0。

<!-- Source EN PDF p.75, unit 642 -->

![英文原稿技术图，第 75](/docs/rockchip-iq-tools/assets/en-p075-figure-02.png)

<!-- Source EN PDF p.75, unit 643 -->

图 5-3-2

<!-- Source EN PDF p.75, unit 644 -->

3. 列表：选预设项，用于模式、ISO、Day/Night、LCG/HCG 档。

<!-- Source EN PDF p.75, unit 645 -->

![英文原稿技术图，第 75](/docs/rockchip-iq-tools/assets/en-p075-figure-03.png)

<!-- Source EN PDF p.75, unit 646 -->

图 5-3-3

<!-- Source EN PDF p.75, unit 647 -->

4. 表格：NxM 整数或浮点矩阵，点击单元的 Show data 或 Enter Array Table 展开。

<!-- Source EN PDF p.75, unit 648 -->

![英文原稿技术图，第 75](/docs/rockchip-iq-tools/assets/en-p075-figure-04.png)

<!-- Source EN PDF p.75, unit 649 -->

图 5-3-4

<!-- Source EN PDF p.76, unit 650 -->

### 5.4 Gamma 参数在线调试

<!-- Source EN PDF p.76, unit 651 -->

#### 5.4.1 Gamma 可视调试

<!-- Source EN PDF p.76, unit 652 -->

1. GammaTuningPara 页点击 Gamma_Curve 的 Edit Curve，打开可视调试，见图 5-4-1-1。

<!-- Source EN PDF p.76, unit 653 -->

![英文原稿技术图，第 76](/docs/rockchip-iq-tools/assets/en-p076-figure-01.png)

<!-- Source EN PDF p.76, unit 654 -->

图 5-4-1-1：Gamma 界面

<!-- Source EN PDF p.76, unit 655 -->

2. 图 5-4-1-2 的可视界面功能如下：

<!-- Source EN PDF p.76, unit 656 -->

1) 曲线区：鼠标拖红点改曲线；AutoWrite 开启时每次调整实时写入板端。

<!-- Source EN PDF p.76, unit 657 -->

2) Curve Coeff：按系数生成 Gamma，修改后自动生成，可能覆盖原来手调曲线。

<!-- Source EN PDF p.76, unit 658 -->

3. Position Control：鼠标移到点上更新 X、Y 坐标框，可手动设置 Y。

<!-- Source EN PDF p.76, unit 659 -->

4. Control Point Number：控制点数支持 49、45、24、13。

<!-- Source EN PDF p.76, unit 660 -->

5. Axis Range：调整 X、Y 轴比例，主要便于调暗区密集节点。

<!-- Source EN PDF p.76, unit 661 -->

6. Export/Import：Gamma 曲线导出文件或从文件读取。

<!-- Source EN PDF p.77, unit 662 -->

![英文原稿技术图，第 77](/docs/rockchip-iq-tools/assets/en-p077-figure-01.png)

<!-- Source EN PDF p.77, unit 663 -->

图 5-4-1-2：Gamma 可视调试窗口

<!-- Source EN PDF p.77, unit 664 -->

#### 5.4.2 Gamma 曲线调试方法

<!-- Source EN PDF p.77, unit 665 -->

坐标轴上蓝线为原曲线，红线为当前曲线。指针移至红点显示上下箭头，可上下拖动，红曲线随位置变化，见图 5-4-2-1。

<!-- Source EN PDF p.77, unit 666 -->

![英文原稿技术图，第 77](/docs/rockchip-iq-tools/assets/en-p077-figure-02.png)

<!-- Source EN PDF p.77, unit 667 -->

图 5-4-2-1：拖点后的曲线

<!-- Source EN PDF p.78, unit 668 -->

Curve Coeff 中 Gamma Coeff 改 1.5，按 Enter，按系数生成新曲线，见图 5-4-2-2。

<!-- Source EN PDF p.78, unit 669 -->

![英文原稿技术图，第 78](/docs/rockchip-iq-tools/assets/en-p078-figure-01.png)

<!-- Source EN PDF p.78, unit 670 -->

图 5-4-2-2：按系数生成曲线

<!-- Source EN PDF p.79, unit 671 -->

## 6 其他功能

<!-- Source EN PDF p.79, unit 672 -->

### 6.1 IQ 文件导入

<!-- Source EN PDF p.79, unit 673 -->

菜单 File Transfer → Send File To Device，选择 IQ 文件并输入设备保存路径，点击 Send；完成后可在目标路径找到文件，见图 6-1-1。

<!-- Source EN PDF p.79, unit 674 -->

![英文原稿技术图，第 79](/docs/rockchip-iq-tools/assets/en-p079-figure-01.png)

<!-- Source EN PDF p.79, unit 675 -->

图 6-1-1：设置传输路径

<!-- Source EN PDF p.79, unit 676 -->

![英文原稿技术图，第 79](/docs/rockchip-iq-tools/assets/en-p079-figure-02.png)

<!-- Source EN PDF p.79, unit 677 -->

图 6-1-2：文件传输成功

<!-- Source EN PDF p.79, unit 678 -->

### 6.2 离线 Raw 模拟

<!-- Source EN PDF p.79, unit 679 -->

此功能把 Raw 回灌板端，经 ISP 处理。

<!-- Source EN PDF p.79, unit 680 -->

1. File → Send RAW Image To Device 打开配置。

<!-- Source EN PDF p.80, unit 681 -->

![英文原稿技术图，第 80](/docs/rockchip-iq-tools/assets/en-p080-figure-01.png)

<!-- Source EN PDF p.80, unit 682 -->

图 6-2-1：打开 Raw 配置页

<!-- Source EN PDF p.80, unit 683 -->

2. Add 加载 Raw 文件。

<!-- Source EN PDF p.80, unit 684 -->

![英文原稿技术图，第 80](/docs/rockchip-iq-tools/assets/en-p080-figure-02.png)

<!-- Source EN PDF p.80, unit 685 -->

图 6-2-2：加载 Raw

<!-- Source EN PDF p.80, unit 686 -->

注意：仅支持 .rkraw，内部数据为 compact+align256，其他格式可用 RKRAW Tool 批量转换。采 Raw 时还需在 config.ini 将 RKRawV2 设 1。原文指向 3.7.2 的在线 Raw 方法，实际 Raw 在 3.7.3，差异已记录。

<!-- Source EN PDF p.81, unit 687 -->

3. Send 将 Raw 发至设备，并在 /tmp 生成配置文件。

<!-- Source EN PDF p.81, unit 688 -->

![英文原稿技术图，第 81](/docs/rockchip-iq-tools/assets/en-p081-figure-01.png)

<!-- Source EN PDF p.81, unit 689 -->

图 6-2-3：发送 Raw 到设备

<!-- Source EN PDF p.81, unit 690 -->

5. 不关闭此窗口，重启相机应用；设备检测到配置文件后进入离线模拟。原稿缺步骤 4，此处保留原编号并注明。

<!-- Source EN PDF p.81, unit 691 -->

6. Run 启动模拟。

<!-- Source EN PDF p.81, unit 692 -->

7. Raw 逐张送入 ISP，处理图显示在相机预览；此时支持在线读写调试参数与 YUV 采集。

<!-- Source EN PDF p.81, unit 693 -->

8. 更换 Raw 文件时：

<!-- Source EN PDF p.81, unit 694 -->

1) Stop 暂停离线模拟。

<!-- Source EN PDF p.81, unit 695 -->

2) Add 加载 Raw。

<!-- Source EN PDF p.81, unit 696 -->

3) Send 发送 Raw。

<!-- Source EN PDF p.81, unit 697 -->

4) Run 启动离线模拟。

{% endraw %}
