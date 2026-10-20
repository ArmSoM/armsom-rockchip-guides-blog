---
title: "Rockchip IQ Tools: Complete Capture, Calibration and Online ISP Tuning Guide"
description: "All V1.0.1 technical chapters: RKISP Tuner, Raw/YUV, BLC/LSC/AWB/CCM/NR/FEC calibration, Gamma and offline simulation."
translation_key: "081-rockchip-iq-tools"
slug: "081-rockchip-iq-tools"
lang: "en"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["ArmSoM", "Rockchip", "IQ Tools", "RKISP", "Camera"]
keywords: "ArmSoM Rockchip RK356x RK3588 RV1106 ISP IQ Tools"
excerpt: "All V1.0.1 technical chapters: RKISP Tuner, Raw/YUV, BLC/LSC/AWB/CCM/NR/FEC calibration, Gamma and offline simulation."
---

{% raw %}

# Rockchip IQ Tools: Complete Capture, Calibration and Online ISP Tuning Guide

## ArmSoM applicability and source

Platform reference for adapting ArmSoM, fully based on the sole supplied Rockchip_IQ_Tools_Guide_EN_v1.0.1.pdf (RK-SM-YF-609, 81 pages). No Chinese PDF was supplied; Chinese, Russian and German fully translate the English source. All editions retain English original figures; German uses exactly the English image URLs. The source product scope in 1.2 is RK356x/RKISP21, RK3588/RKISP30 and RV1106/RKISP32 on Linux/Android; no kernel version is specified. Check the exact ArmSoM board, SoC, SDK/BSP, kernel, sensor/lens drivers, ToolServer, Tuner and IQ template versions. No board adaptation or image quality has been hardware-validated. Times, gains, comparisons and parameters are source examples, not ArmSoM test results.

Source examples include reboots, permission changes and `setenforce 0` (reducing SELinux protection). They are retained for completeness, were not executed while editing and should not be applied blindly to production systems.

[Editorial notes](/docs/rockchip-iq-tools/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip AIQ](https://github.com/rockchip-toybrick/camera_engine_rkaiq)

<!-- Source EN PDF p.1, unit 0 -->

This article aims to introduce how to use RKISP2 Tuner and the ISP tuning process. Help engineers who use RKISP Tuner to quickly get started and provide reference for IQ tuning work.

<!-- Source EN PDF p.4, unit 1 -->

## 1 Introduction

<!-- Source EN PDF p.4, unit 2 -->

### 1.1 Overview

<!-- Source EN PDF p.4, unit 3 -->

RKISP Tuner (hereinafter referred to as Tuner) provides a set of tools for users to tune ISP parameters. Users can perform Calibration, Tuning, etc. on all ISP modules in Tuner. Users can use the Capture Tool provided by Tuner to capture Raw images. complete the calibration of the basic modules in the Calibration Tool. connect the device in Tuner and perform online ISP parameter tuning.

<!-- Source EN PDF p.4, unit 4 -->

### 1.2 Related Versions

<!-- Source EN PDF p.4, unit 5 -->

| Chips | Systems | ISP Version |
| --- | --- | --- |
| RK356x | Linux/Android | RKISP21 |
| RK3588 | Linux/Android | RKISP30 |
| RV1106 | Linux/Android | RKISP32 |

<!-- Source EN PDF p.4, unit 6 -->

ISP21, ISP30, and ISP32 versions have greatly improved compatibility. Users should make sure that ToolServer and RKISP Tuner versions can match. If the parameters on the tool page are different from the parameter files on the device side, please contact RockChip engineers to update the parameter template file.

<!-- Source EN PDF p.4, unit 7 -->

### 1.3 Environment Preparations

<!-- Source EN PDF p.4, unit 8 -->

##### Computer Environment Requirements

<!-- Source EN PDF p.4, unit 9 -->

1. The computer running Tuner must have an x64 version of Windows 7, or a later 64-bit Windows operating system.

<!-- Source EN PDF p.4, unit 10 -->

2. Before running Tuner, the 64-bit version of MCR_R2016a (9.0.1) should be pre-installed (only this version is supported), download address: https://ww2.mathworks.cn/products/compiler/matlab-runtime

<!-- Source EN PDF p.4, unit 11 -->

##### Environmental requirements on the device side

<!-- Source EN PDF p.4, unit 12 -->

1. Have an Ethernet card and support the use of wired, wireless, etc. to connect to the local area network.

<!-- Source EN PDF p.4, unit 13 -->

2. For devices without network card, should support the RNDIS function. In this case, the device will be recognized as a USB network card, and the PC can be connected through USB.

<!-- Source EN PDF p.5, unit 14 -->

### 1.4 Installation and Configuration

<!-- Source EN PDF p.5, unit 15 -->

The RKISP2.x Tuner does not need to be installed. It can be used directly by unzipping it to any directory with the decompression tool, But avoid unzipping to a path with Chinese characters.

<!-- Source EN PDF p.5, unit 16 -->

It is mentioned in Section 3 that MCR_R2016a needs to be pre-installed before running Tuner. The installation steps are as follows:

<!-- Source EN PDF p.5, unit 17 -->

1. Open MCR_R2016a_x64.exe and wait for unzipping completed

<!-- Source EN PDF p.5, unit 18 -->

![Technical figure from English PDF, page 5](/docs/rockchip-iq-tools/assets/en-p005-figure-01.png)

<!-- Source EN PDF p.5, unit 19 -->

Figure 1-4-1

<!-- Source EN PDF p.5, unit 20 -->

2. Click Next, choose to agree to the terms, Next, click Install

<!-- Source EN PDF p.5, unit 21 -->

![Technical figure from English PDF, page 5](/docs/rockchip-iq-tools/assets/en-p005-figure-02.png)

<!-- Source EN PDF p.5, unit 22 -->

Figure 1-4-2

<!-- Source EN PDF p.6, unit 23 -->

3. Wait for the installation to complete

<!-- Source EN PDF p.6, unit 24 -->

![Technical figure from English PDF, page 6](/docs/rockchip-iq-tools/assets/en-p006-figure-01.png)

<!-- Source EN PDF p.6, unit 25 -->

Figure 1-4-3

<!-- Source EN PDF p.6, unit 26 -->

4. Installation completed

<!-- Source EN PDF p.6, unit 27 -->

![Technical figure from English PDF, page 6](/docs/rockchip-iq-tools/assets/en-p006-figure-02.png)

<!-- Source EN PDF p.6, unit 28 -->

Figure 1-4-4

<!-- Source EN PDF p.7, unit 29 -->

## 2 Function introduction

<!-- Source EN PDF p.7, unit 30 -->

### 2.1 Overview

<!-- Source EN PDF p.7, unit 31 -->

Users should follow the below process when doing the tuning work:

<!-- Source EN PDF p.7, unit 32 -->

![Technical figure from English PDF, page 7](/docs/rockchip-iq-tools/assets/en-p007-figure-01.png)

<!-- Source EN PDF p.7, unit 33 -->

Figure 2-1-1

<!-- Source EN PDF p.7, unit 34 -->

In the preparation stage, the user needs to generate a basic IQ file (.json format) in the tool, which records all the adjustable parameters in the ISP. After completing the tuning, the user needs to replace the file to the corresponding location in the firmware or device, and then restart the camera application to confirm the final image effect.

<!-- Source EN PDF p.7, unit 35 -->

Since the functions of the tool such as raw capturing, online tuning, and parameter interaction are transmitted through the network protocol, therefore, when prepare for the tuning environment, users need to connect the PC and the device to the same local area network.

<!-- Source EN PDF p.7, unit 36 -->

The calibration work should follow workflows as below:

<!-- Source EN PDF p.7, unit 37 -->

![Technical figure from English PDF, page 7](/docs/rockchip-iq-tools/assets/en-p007-figure-02.png)

<!-- Source EN PDF p.7, unit 38 -->

Figure 2-1-2

<!-- Source EN PDF p.7, unit 39 -->

Since the calibration of some parts will depend on the results of previous one, users should complete the calibration work in the order of the process. After completing the calibration of one module, make sure the results are correct.

<!-- Source EN PDF p.8, unit 40 -->

### 2.2 Sensor Configuration

<!-- Source EN PDF p.8, unit 41 -->

![Technical figure from English PDF, page 8](/docs/rockchip-iq-tools/assets/en-p008-figure-01.png)

<!-- Source EN PDF p.8, unit 42 -->

Figure 2-2-1

<!-- Source EN PDF p.8, unit 43 -->

The Sensor configuration UI is shown in Figure 2-2-1. It has two parts:

<!-- Source EN PDF p.8, unit 44 -->

1. Parameter tuning area: For the parameter description please refer to the "sensorinfo parameters" in section 4.1.2.5 of Rockchip_Tuning_Guide_ISP21/30/32. Users should refer to the Sensor's Datasheet to enter (this part may require the help of a driver engineer).

<!-- Source EN PDF p.8, unit 45 -->

2. Menu bar: Includes the import and export to SensorList.ini

<!-- Source EN PDF p.9, unit 46 -->

### 2.3 RKISP Capture Tool

<!-- Source EN PDF p.9, unit 47 -->

![Technical figure from English PDF, page 9](/docs/rockchip-iq-tools/assets/en-p009-figure-01.png)

<!-- Source EN PDF p.9, unit 48 -->

Figure 2-3-1

<!-- Source EN PDF p.9, unit 49 -->

The main UI of RKISP Capture Tool is shown in Figure 2-3-1. It has 3 parts:

<!-- Source EN PDF p.9, unit 50 -->

1. Device-side connection configuration Provides device network parameter configuration, mode switching function, and test connection function.

<!-- Source EN PDF p.9, unit 51 -->

2. Capture settings It has two parts: Raw Capture and Online Capture: Raw Capture: Offline raw capture, including configuration of camera and exposure control: Configuration of Camera: Provides Sensor Exposure parameters, Source Name of Module/Light, Resolution and Gain/Exposure parameter ranges required for capture. Exposure control: Supports both manual exposure and automatic exposure, as well as a picture-taking function specially used for NR calibration. Manual exposure allows configuring the step size for traversing and capturing multiple exposure combinations. Automatic Exposure: This function is used to automatically search an exposure parameter until reaching the target brightness set by the user. YNR Capture: This function is used for capture a raw image for YNR Calibration, the detail please refers to chapter 4.6.1. Online Capture: This function is used for capturing in online stream, supports both raw and yuv formats.

<!-- Source EN PDF p.9, unit 52 -->

3. Preview and Statistics of Raw Images The captured Raw image (displayed in grayscale), histogram, and ROI brightness are displayed here.

<!-- Source EN PDF p.10, unit 53 -->

### 2.4 RKISP Calibration Tool

<!-- Source EN PDF p.10, unit 54 -->

The calibration tool will load the RKISP calibration tool (Figure 2-4-2) for the selected chip and version (Figure 2-4-1), and the imported IQ file should also match the chip and version.

<!-- Source EN PDF p.10, unit 55 -->

![Technical figure from English PDF, page 10](/docs/rockchip-iq-tools/assets/en-p010-figure-01.png)

<!-- Source EN PDF p.10, unit 56 -->

Figure 2-4-1

<!-- Source EN PDF p.10, unit 57 -->

![Technical figure from English PDF, page 10](/docs/rockchip-iq-tools/assets/en-p010-figure-02.png)

<!-- Source EN PDF p.10, unit 58 -->

Figure 2-4-2

<!-- Source EN PDF p.10, unit 59 -->

The main UI of RKISP Calibration Tool is shown in Figure 2-4-2, it includes the calibration functions of the following modules: BLC: Black Level Correction LSC: Lens Shading Correction CCM: Color Correction Matrix AWB: Automatic White Balance Correction

<!-- Source EN PDF p.11, unit 60 -->

GIC: Green channel balance correction (calibration is integrated in the Bayer NR module) Bayer NR: Raw domain noise reduction, including Bayer 2DNR, Bayer 3DNR YNR: Y channel noise reduction FEC: Fisheye Calibration

<!-- Source EN PDF p.11, unit 61 -->

### 2.5 RKRAW Tool

<!-- Source EN PDF p.11, unit 62 -->

![Technical figure from English PDF, page 11](/docs/rockchip-iq-tools/assets/en-p011-figure-01.png)

<!-- Source EN PDF p.11, unit 63 -->

Figure 2-5-1

<!-- Source EN PDF p.11, unit 64 -->

The main UI of RKRAW Tool is shown in Figure 2-5-1. It supports viewing in those formats: jpg/bmp/png, raw, RKRawV1, and RKRawV2. This tool has four parts:

<!-- Source EN PDF p.11, unit 65 -->

1. File system, for selecting the image path to view.

<!-- Source EN PDF p.11, unit 66 -->

2. Display window: Right-click the display area to switch between GRAY/RGB, Normal/Hdr Short/Mid/Long (only support the RKRawV2 format), as shown in Figure 2-5-2. Hold down the Ctrl and wheel in or out to zoom in or out.

<!-- Source EN PDF p.11, unit 67 -->

3. Histogram display: Histogram statistics in gray channel

<!-- Source EN PDF p.11, unit 68 -->

4. The information of RKRawV2: Such as raw format, exposure parameters, etc.

<!-- Source EN PDF p.11, unit 69 -->

5. Compare: Hold down the Ctrl and select more than 2 images at the same time and click compare button as shown in Figure 2-5-3.

<!-- Source EN PDF p.12, unit 70 -->

![Technical figure from English PDF, page 12](/docs/rockchip-iq-tools/assets/en-p012-figure-01.png)

<!-- Source EN PDF p.12, unit 71 -->

Figure 2-5-2

<!-- Source EN PDF p.12, unit 72 -->

![Technical figure from English PDF, page 12](/docs/rockchip-iq-tools/assets/en-p012-figure-02.png)

<!-- Source EN PDF p.12, unit 73 -->

Figure 2-5-3

<!-- Source EN PDF p.13, unit 74 -->

### 2.6 RKISP 3D-LUT Tools

<!-- Source EN PDF p.13, unit 75 -->

![Technical figure from English PDF, page 13](/docs/rockchip-iq-tools/assets/en-p013-figure-01.png)

<!-- Source EN PDF p.13, unit 76 -->

Figure 2-6-1

<!-- Source EN PDF p.13, unit 77 -->

The main UI of RKISP 3D-LutTool is shown in Figure 2-6-1, including two parts: Left is the LUT area, right is the preview area.

<!-- Source EN PDF p.13, unit 78 -->

1. File: Includes image import, IQ parameter import and save, LUT Info import and save. Load Image: Click Load Image to import (supports jpg/bmp/png/nv12), the image will be displayed in the Preview area on the right as shown in Figure 2-6-2. Load IQ File: Click Load IQ File to import IQ parameters, select the scene and Lut3D table to be imported. As shown in Figure 2-6-3.

<!-- Source EN PDF p.13, unit 79 -->

![Technical figure from English PDF, page 13](/docs/rockchip-iq-tools/assets/en-p013-figure-02.png)

<!-- Source EN PDF p.13, unit 80 -->

Figure 2-6-2

<!-- Source EN PDF p.14, unit 81 -->

![Technical figure from English PDF, page 14](/docs/rockchip-iq-tools/assets/en-p014-figure-01.png)

<!-- Source EN PDF p.14, unit 82 -->

![Technical figure from English PDF, page 14](/docs/rockchip-iq-tools/assets/en-p014-figure-02.png)

<!-- Source EN PDF p.14, unit 83 -->

Figure 2-6-3

<!-- Source EN PDF p.14, unit 84 -->

Save IQ File: Click Save IQ File, user can choose to overwrite an existing table in the IQ file or create a new table, as shown in Figure 2-6-4.

<!-- Source EN PDF p.14, unit 85 -->

![Technical figure from English PDF, page 14](/docs/rockchip-iq-tools/assets/en-p014-figure-03.png)

<!-- Source EN PDF p.14, unit 86 -->

Figure 2-6-4

<!-- Source EN PDF p.14, unit 87 -->

2. Color search: Move the mouse on the image, the color corresponding to the mouse point will be marked in the left LUT, as shown in Figure 2-6-5. Left-click the current position to lock the marked color in the LUT. Adjust the color by “Adjust Sat” and “Adjust Hue” or directly drag the marked point. We can see the before and after of AB, Sat, Hue, RGB values of the marked points and the color changes in LUT/Preview.

<!-- Source EN PDF p.15, unit 88 -->

![Technical figure from English PDF, page 15](/docs/rockchip-iq-tools/assets/en-p015-figure-01.png)

<!-- Source EN PDF p.15, unit 89 -->

Figure 2-6-5

<!-- Source EN PDF p.15, unit 90 -->

3. Adjust Sat: Drag the slider, the marked colors in the LUT will change together with the nearest colors, as shown in Figure 2-6-6 (a). If you only want to change the marked color, and keep the positions of the other colors, you can right-click the color you don’t want to move, and after turning the dot into a square, its position is locked. Drag Adjust Sat, then only the marked color in the LUT changes. As shown in Figure 2-6-6 (b).

<!-- Source EN PDF p.15, unit 91 -->

![Technical figure from English PDF, page 15](/docs/rockchip-iq-tools/assets/en-p015-figure-02.png)

<!-- Source EN PDF p.15, unit 92 -->

(a)

<!-- Source EN PDF p.16, unit 93 -->

![Technical figure from English PDF, page 16](/docs/rockchip-iq-tools/assets/en-p016-figure-01.png)

<!-- Source EN PDF p.16, unit 94 -->

(b)

<!-- Source EN PDF p.16, unit 95 -->

Figure 2-6-6

<!-- Source EN PDF p.16, unit 96 -->

4. After & Before: View the image before and after adjustment

<!-- Source EN PDF p.16, unit 97 -->

5. Reset LUT: Restore the default values of LUT

<!-- Source EN PDF p.16, unit 98 -->

6. Image: Support image left and right rotation, vertical/horizontal flip transformation and save the adjusted image, as shown in Figure 2-6-7

<!-- Source EN PDF p.16, unit 99 -->

![Technical figure from English PDF, page 16](/docs/rockchip-iq-tools/assets/en-p016-figure-02.png)

<!-- Source EN PDF p.16, unit 100 -->

Figure 2-6-7

<!-- Source EN PDF p.16, unit 101 -->

7. Options: Support LUT display settings, you can adjust the size and line width of marker points, as shown in Figure 2-6-8.

<!-- Source EN PDF p.16, unit 102 -->

![Technical figure from English PDF, page 16](/docs/rockchip-iq-tools/assets/en-p016-figure-03.png)

<!-- Source EN PDF p.16, unit 103 -->

Figure 2-6-8

<!-- Source EN PDF p.17, unit 104 -->

### 2.7 RKISP 3A Analyzer Tool

<!-- Source EN PDF p.17, unit 105 -->

![Technical figure from English PDF, page 17](/docs/rockchip-iq-tools/assets/en-p017-figure-01.png)

<!-- Source EN PDF p.17, unit 106 -->

Figure 2-7-1

<!-- Source EN PDF p.17, unit 107 -->

Click Connect to rkaiq_tool_server, open RKISP 3AAnalyzerTool, the main UI is shown as Figure 2-7-1, modify the URL address, check Open to start preview, the current version supports obtaining statistical data of AE and AWB modules.

<!-- Source EN PDF p.17, unit 108 -->

TimerSet: Adjust the interval for getting data

<!-- Source EN PDF p.17, unit 109 -->

Reverse color: Change the color of the data in the preview panel.

<!-- Source EN PDF p.17, unit 110 -->

Click the AE button to open the AE module, and display the dynamic histogram in the AE Statistics window. Then the image in the preview panel of the main UI will be divided into 15 * 15 small grids, each grid will display the statistical value (12bit) of the corresponding block, the display channel can be switched by the Channel list, HDR mode supports L/M/S frame statistics display, as shown in Figure 2-7-2.

<!-- Source EN PDF p.18, unit 111 -->

![Technical figure from English PDF, page 18](/docs/rockchip-iq-tools/assets/en-p018-figure-01.png)

<!-- Source EN PDF p.18, unit 112 -->

Figure 2-7-2

<!-- Source EN PDF p.18, unit 113 -->

Click the AWB button. In the AWB Statistics window, the status information of the current AWB will be dynamically printed. Then the image in the preview panel of the main UI will be divided into 15 * 15 small grids, and each grid will display the number of white points and the WBGains of the corresponding block, as shown in Figure 2-7-3.

<!-- Source EN PDF p.18, unit 114 -->

![Technical figure from English PDF, page 18](/docs/rockchip-iq-tools/assets/en-p018-figure-02.png)

<!-- Source EN PDF p.18, unit 115 -->

Figure 2-7-3

<!-- Source EN PDF p.19, unit 116 -->

## 3 Quick Start

<!-- Source EN PDF p.19, unit 117 -->

### 3.1 Preparations

<!-- Source EN PDF p.19, unit 118 -->

The ISP tuning has a lot of work to do on the device side. Here we need to run a service application on the device side to transfer data between Tuner and AIQ, and we can also use it for capturing raw image and other works. To do this, before starting the Tuning job, the service application and other relevant files need to be push to the device and run. The following two parts describe the preparations required to tuning on the Android and Linux:

<!-- Source EN PDF p.19, unit 119 -->

1. LAN connection

<!-- Source EN PDF p.19, unit 120 -->

2. Run rkaiq_tool_server and other environment configuration jobs (where command execution and file transfer can be done via: TFTP, serial port, ADB and other protocols or tools. ADB is used in the example)

<!-- Source EN PDF p.19, unit 121 -->

#### 3.1.1 Android

<!-- Source EN PDF p.19, unit 122 -->

##### 3.1.1.1 RK356X & RK3588

<!-- Source EN PDF p.19, unit 123 -->

For devices that can be connected using a wired network:

<!-- Source EN PDF p.19, unit 124 -->

1. Connect the device to the router with a network cable

<!-- Source EN PDF p.19, unit 125 -->

2. Use the ifconfig command to view the IP address of the device

<!-- Source EN PDF p.19, unit 126 -->

3. The PC is also connected to the same router (either wired or wireless)

<!-- Source EN PDF p.19, unit 127 -->

4. Check the IP address of the PC, and use ping on the command line of the PC or device to confirm that the network path is normal

<!-- Source EN PDF p.19, unit 128 -->

For devices that cannot be connected using a wired network (tablets, etc.):

<!-- Source EN PDF p.19, unit 129 -->

1. Connect the PC and EVB with a USB cable (the same port as ADB)

<!-- Source EN PDF p.19, unit 130 -->

2. Turn on the power and enter the system

<!-- Source EN PDF p.19, unit 131 -->

3. Open Settings

<!-- Source EN PDF p.19, unit 132 -->

4. Enter Network&internet

<!-- Source EN PDF p.19, unit 133 -->

5. Enter Hotspot&tethering

<!-- Source EN PDF p.19, unit 134 -->

6. Turn on USB tethering

<!-- Source EN PDF p.19, unit 135 -->

7. adb shell into the device side

<!-- Source EN PDF p.19, unit 136 -->

8. Execute ifconfig usb0 to view the IP address

<!-- Source EN PDF p.19, unit 137 -->

9. Use ping on the command line on the PC or device side to confirm that the network path is normal

<!-- Source EN PDF p.20, unit 138 -->

Operations required to run rkaiq_tool_server (if the required service application and other dependent files already exist in the corresponding path on the device side, just run rkaiq_tool_server directly):

<!-- Source EN PDF p.20, unit 139 -->

1. Compile and obtain rkaiq_tool_server and rkaiq_3A_server in the SDK

<!-- Source EN PDF p.20, unit 140 -->

2. Path in SDK: external/rkaiq_tool_server, firmware must be user-debug version

<!-- Source EN PDF p.20, unit 141 -->

3. Push the android.hardware.camera.provider@2.4-service.rc file into /vendor/etc/init/ on the board under the path

<!-- Source EN PDF p.20, unit 142 -->

4. Enter the /vendor/etc/init/ path and execute the command to modify permissions: chmod 644 android.hardware.camera.provider@2.4-service.rc

<!-- Source EN PDF p.20, unit 143 -->

5. Push rkaiq_tool_server and rkaiq_3A_server into the /vendor/bin/ path of the board

<!-- Source EN PDF p.20, unit 144 -->

6. Enter the /vendor/bin/ path and execute the command to modify permissions: chmod 755 rkaiq_tool_server (and rkaiq_3A_server)

<!-- Source EN PDF p.20, unit 145 -->

7. Execute the flush cache command: sync

<!-- Source EN PDF p.20, unit 146 -->

8. Restart the device

<!-- Source EN PDF p.20, unit 147 -->

9. Execute the command: setenforce 0

<!-- Source EN PDF p.20, unit 148 -->

10. Open the camera apk

<!-- Source EN PDF p.20, unit 149 -->

11. Run rkaiq_tool_server

<!-- Source EN PDF p.20, unit 150 -->

Example of ADB operation:

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

For multiple cameras example:

<!-- Source EN PDF p.20, unit 153 -->

```sh
#If there are 2 sensors in the device and you need to switch to another sensor for tuning, run tool server as follows:
/vendor/bin/rkaiq_tool_server -d 1 &
```

<!-- Source EN PDF p.21, unit 154 -->

Note: After pushing the initial version of IQ parameters generated by the “New” function into the device, use the following operations to reset the camera application and run ToolServer again. If there are abnormal problems such as crash, stuck, failure of online tuning, unable to preview, etc., please also try to reconnect the tool according to the following steps

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

For devices that can be connected using a wired network:

<!-- Source EN PDF p.21, unit 159 -->

1. Connect the device to the router with a network cable

<!-- Source EN PDF p.21, unit 160 -->

2. Use the ifconfig command to view the IP address of the device

<!-- Source EN PDF p.21, unit 161 -->

3. The PC is also connected to the same router (either wired or wireless)

<!-- Source EN PDF p.21, unit 162 -->

4. Check the IP address of the PC, and use ping on the command line of the PC or device to confirm that the network path is normal

<!-- Source EN PDF p.21, unit 163 -->

For devices that cannot be connected using a wired network:

<!-- Source EN PDF p.21, unit 164 -->

1. Try to start the RNDIS service

<!-- Source EN PDF p.21, unit 165 -->

2. Use the ifconfig command to view the IP address of the device

<!-- Source EN PDF p.21, unit 166 -->

3. Use ping on the command line on the PC or device side to confirm that the network path is normal

<!-- Source EN PDF p.21, unit 167 -->

Operations required to run rkaiq_tool_server (if the required service application and other dependent files already exist in the corresponding path on the device side, just run rkaiq_tool_server directly):

<!-- Source EN PDF p.21, unit 168 -->

1. Compile and obtain rkaiq_tool_server and librkmedia.so in the SDK

<!-- Source EN PDF p.21, unit 169 -->

2. Push the librkmedia.so file into the /data/ path of the board

<!-- Source EN PDF p.21, unit 170 -->

3. Enter the /data/ path and execute the modify permission command: chmod 777 librkmedia.so

<!-- Source EN PDF p.21, unit 171 -->

4. Push the rkaiq_tool_server file into the /data/ path of the board

<!-- Source EN PDF p.21, unit 172 -->

5. Enter the /data/ path and execute the modify permission command: chmod 777 rkaiq_tool_server

<!-- Source EN PDF p.21, unit 173 -->

6. Execute the flush cache command: sync

<!-- Source EN PDF p.21, unit 174 -->

7. Restart the device

<!-- Source EN PDF p.21, unit 175 -->

8. Run the camera app

<!-- Source EN PDF p.21, unit 176 -->

9. Run rkaiq_tool_server

<!-- Source EN PDF p.22, unit 177 -->

Example of ADB operation:

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

### 3.2 ToolServer Parameter Instructions

<!-- Source EN PDF p.22, unit 180 -->

Here is a brief description of the parameters and configurations of rkaiq_tool_server:

<!-- Source EN PDF p.22, unit 181 -->

-d: sensor selection, when there are multiple sensors in the device that need to be tuned, you can use the device number such as 0/1/2 to select which sensor to use. The default value is 0. For the query method of the specific device number, refer to the following description: media-ctl -p -d /dev/mediaX (X=0/1/2/3...) The output will have a topology structure, and the nodes in it contain the sensor name, for example: "m01_b_ov8858 2-0036", m01 corresponds to mNN , NN is a 2-digit sensor index, then the parameter configuration is -d 1, 1 corresponds to the above NN, less than 2 digits do not need to add 0 in front

<!-- Source EN PDF p.22, unit 182 -->

-s: Select the video node for YUV capture. The default value will automatically search for the iqtool node, or it can be manually specified to mainPath or selfPath

<!-- Source EN PDF p.22, unit 183 -->

-r: RTSP switch, 0 is off, 1 is on, the default value is 0, you can use the Start RTSP function in CaptureTool after it is turned on

<!-- Source EN PDF p.22, unit 184 -->

-i: IQ file path, if the path is changed, this parameter should be modified synchronously, it can be ignored when the -r parameter is 0

<!-- Source EN PDF p.22, unit 185 -->

-w/-h: Configure RTSP video stream preview output resolution, the resolution will be scaled based on ISP output size to meet the requirements, the default value is 1920/1080

<!-- Source EN PDF p.22, unit 186 -->

-n: The number of buffers used for online capture of continuous Raw, the default value is 4, it is recommended to increase this parameter when you need to capture a large number of continuous Raw images

<!-- Source EN PDF p.22, unit 187 -->

-f: The sending frame rate of the offline frame function, the default value is 10 frames

<!-- Source EN PDF p.23, unit 188 -->

### 3.3 Platform Setting & IP Address

<!-- Source EN PDF p.23, unit 189 -->

1. Open RKISP Tuner, the initial configuration window as shown in Figure 3-3-1.

<!-- Source EN PDF p.23, unit 190 -->

![Technical figure from English PDF, page 23](/docs/rockchip-iq-tools/assets/en-p023-figure-01.png)

<!-- Source EN PDF p.23, unit 191 -->

Figure 3-3-1

<!-- Source EN PDF p.23, unit 192 -->

2. Select the chip, enter the IP address obtained in the previous section, the port number is 5543 by default (do not modify it unless there are special requirements), please make sure that rkaiq_tool_server is running correctly, click Connect to rkaiq_tool_server, after the connection, if need to use third-party tools to preview, please refer to the point 3 of chapter 3.7 for specific operations.

<!-- Source EN PDF p.23, unit 193 -->

3. Click OK, the tuning UI of the selected chip and version as shown in figure 3-3-2.

<!-- Source EN PDF p.23, unit 194 -->

![Technical figure from English PDF, page 23](/docs/rockchip-iq-tools/assets/en-p023-figure-02.png)

<!-- Source EN PDF p.23, unit 195 -->

Figure 3-3-2

<!-- Source EN PDF p.24, unit 196 -->

### 3.4 Generate New Sensor Configuration and IQ File

<!-- Source EN PDF p.24, unit 197 -->

1. Click the "File" - "New" buttons.

<!-- Source EN PDF p.24, unit 198 -->

![Technical figure from English PDF, page 24](/docs/rockchip-iq-tools/assets/en-p024-figure-01.png)

<!-- Source EN PDF p.24, unit 199 -->

Figure 3-4-1

<!-- Source EN PDF p.24, unit 200 -->

![Technical figure from English PDF, page 24](/docs/rockchip-iq-tools/assets/en-p024-figure-02.png)

<!-- Source EN PDF p.24, unit 201 -->

Figure 3-4-2

<!-- Source EN PDF p.24, unit 202 -->

2. Click the "New" button on the right side of the Sensor list to open the Sensor Information page.

<!-- Source EN PDF p.24, unit 203 -->

![Technical figure from English PDF, page 24](/docs/rockchip-iq-tools/assets/en-p024-figure-03.png)

<!-- Source EN PDF p.24, unit 204 -->

Figure 3-4-3

<!-- Source EN PDF p.25, unit 205 -->

3. After filling in the Sensor Information, click the button "File" - "Export To Sensor List".

<!-- Source EN PDF p.25, unit 206 -->

![Technical figure from English PDF, page 25](/docs/rockchip-iq-tools/assets/en-p025-figure-01.png)

<!-- Source EN PDF p.25, unit 207 -->

Figure 3-4-4

<!-- Source EN PDF p.25, unit 208 -->

4. Enter the saved Sensor name and click "OK" to save the configuration.

<!-- Source EN PDF p.25, unit 209 -->

![Technical figure from English PDF, page 25](/docs/rockchip-iq-tools/assets/en-p025-figure-02.png)

<!-- Source EN PDF p.25, unit 210 -->

Figure 3-4-5

<!-- Source EN PDF p.25, unit 211 -->

5. Close the configuration page, we can see the new Sensor name in the Sensor list on the Generated New IQ File window.

<!-- Source EN PDF p.25, unit 212 -->

![Technical figure from English PDF, page 25](/docs/rockchip-iq-tools/assets/en-p025-figure-03.png)

<!-- Source EN PDF p.25, unit 213 -->

Figure 3-4-6

<!-- Source EN PDF p.25, unit 214 -->

6. Select the Sensor and click the "Generate IQ File", an IQ file is generated.

<!-- Source EN PDF p.25, unit 215 -->

### 3.5 Load and Save Parameters & Scene Selection

<!-- Source EN PDF p.25, unit 216 -->

1. Click the "File" - "Open..." and select the IQ file you want to load.

<!-- Source EN PDF p.25, unit 217 -->

![Technical figure from English PDF, page 25](/docs/rockchip-iq-tools/assets/en-p025-figure-04.png)

<!-- Source EN PDF p.25, unit 218 -->

Figure 3-5-1

<!-- Source EN PDF p.26, unit 219 -->

2. In the Scene Selection window, the name of each group of scenes in the IQ file will be displayed, select the scene you want to tune, and click OK.

<!-- Source EN PDF p.26, unit 220 -->

![Technical figure from English PDF, page 26](/docs/rockchip-iq-tools/assets/en-p026-figure-01.png)

<!-- Source EN PDF p.26, unit 221 -->

Figure 3-5-2

<!-- Source EN PDF p.26, unit 222 -->

3. At this point, the IQ file will be compared with the UI template parameters, their differences will be in the Different Member List. The list on the left shows the Missing parameters in the IQ file, and the list on the right shows the Existed parameters in the IQ file but have been removed or renamed in the UI template；

<!-- Source EN PDF p.26, unit 223 -->

![Technical figure from English PDF, page 26](/docs/rockchip-iq-tools/assets/en-p026-figure-02.png)

<!-- Source EN PDF p.26, unit 224 -->

Figure 3-5-3

<!-- Source EN PDF p.27, unit 225 -->

4. Click "File" - "Save As...", as shown in Figure 3-5-4 and 3-5-5, we can save the parameters to the scene parameters selected in step 2, or save as a new scene parameter, support saving only selected modules parameters, and display the modified parameters in the list on the right for reference.

<!-- Source EN PDF p.27, unit 226 -->

![Technical figure from English PDF, page 27](/docs/rockchip-iq-tools/assets/en-p027-figure-01.png)

<!-- Source EN PDF p.27, unit 227 -->

Figure 3-5-4

<!-- Source EN PDF p.27, unit 228 -->

![Technical figure from English PDF, page 27](/docs/rockchip-iq-tools/assets/en-p027-figure-02.png)

<!-- Source EN PDF p.27, unit 229 -->

Figure 3-5-5

<!-- Source EN PDF p.27, unit 230 -->

### 3.6 Edit Sensor Information

<!-- Source EN PDF p.27, unit 231 -->

1. Refer to the steps in the previous section to load an IQ parameter file.

<!-- Source EN PDF p.27, unit 232 -->

2. Click "Tuning" - "Edit Sensor Information" to open the Sensor Info configuration interface.

<!-- Source EN PDF p.27, unit 233 -->

![Technical figure from English PDF, page 27](/docs/rockchip-iq-tools/assets/en-p027-figure-03.png)

<!-- Source EN PDF p.27, unit 234 -->

Figure 3-6-1

<!-- Source EN PDF p.28, unit 235 -->

![Technical figure from English PDF, page 28](/docs/rockchip-iq-tools/assets/en-p028-figure-01.png)

<!-- Source EN PDF p.28, unit 236 -->

Figure 3-6-2

<!-- Source EN PDF p.28, unit 237 -->

3. Click "File" - "Import From Sensor List".

<!-- Source EN PDF p.28, unit 238 -->

![Technical figure from English PDF, page 28](/docs/rockchip-iq-tools/assets/en-p028-figure-02.png)

<!-- Source EN PDF p.28, unit 239 -->

Figure 3-6-3

<!-- Source EN PDF p.28, unit 240 -->

4. Select the Sensor as shown below:

<!-- Source EN PDF p.28, unit 241 -->

![Technical figure from English PDF, page 28](/docs/rockchip-iq-tools/assets/en-p028-figure-03.png)

<!-- Source EN PDF p.28, unit 242 -->

Figure 3-6-4

<!-- Source EN PDF p.29, unit 243 -->

5. Click "OK" to import the configuration parameters.

<!-- Source EN PDF p.29, unit 244 -->

6. Close the "Sensor Information" window.

<!-- Source EN PDF p.29, unit 245 -->

7. When the sensor name cannot be found in the sensor list, the user can refer to the sensor data sheet to create a new configuration in the Sensor Information window.

<!-- Source EN PDF p.29, unit 246 -->

### 3.7 Capture Raw and YUV Images

<!-- Source EN PDF p.29, unit 247 -->

#### 3.7.1 Capture Raw Image Offline

<!-- Source EN PDF p.29, unit 248 -->

1. Click the "Tools" - "RK Capture Tool".

<!-- Source EN PDF p.29, unit 249 -->

![Technical figure from English PDF, page 29](/docs/rockchip-iq-tools/assets/en-p029-figure-01.png)

<!-- Source EN PDF p.29, unit 250 -->

Figure 3-7-1-1

<!-- Source EN PDF p.29, unit 251 -->

2. Make sure the device IP address is entered correctly, click the "Device Status" button, if the Tuner is connected with rkaiq_tool_server correctly, it will print "Device is Ready"

<!-- Source EN PDF p.29, unit 252 -->

![Technical figure from English PDF, page 29](/docs/rockchip-iq-tools/assets/en-p029-figure-02.png)

<!-- Source EN PDF p.29, unit 253 -->

Figure 3-7-1-2

<!-- Source EN PDF p.29, unit 254 -->

3. Click Start RTSP Streaming to turn on the camera and start RTSP video streaming (optional)

<!-- Source EN PDF p.30, unit 255 -->

1) Android: After clicking Start RTSP Streaming, you can use a third-party playback tool to open rtsp://192.168.10.104:1234/v to preview. At this time, the camera apk on the device will be disconnected, if you want to use the camera, please click Stop RTSP Streaming first, and then click Switch To Tuning Mode to open the camera.

<!-- Source EN PDF p.30, unit 256 -->

2) Linux: If there are other camera devices running on the board, exit it and then run ToolServer. After clicking Start RTSP Streaming, you can directly use a third-party playback tool to open rtsp://192.168.10.104/live/0 to preview it.

<!-- Source EN PDF p.30, unit 257 -->

4. Select the name of sensor to tuning.

<!-- Source EN PDF p.30, unit 258 -->

![Technical figure from English PDF, page 30](/docs/rockchip-iq-tools/assets/en-p030-figure-01.png)

<!-- Source EN PDF p.30, unit 259 -->

Figure 3-7-1-3

<!-- Source EN PDF p.30, unit 260 -->

5. Choose the correct resolution, light source and module name to distinguish in use.

<!-- Source EN PDF p.30, unit 261 -->

6. Configure parameters such as Gain, Exposure Time and number.

<!-- Source EN PDF p.30, unit 262 -->

7. Click the Start Manual Capture button.

<!-- Source EN PDF p.30, unit 263 -->

8. The captured raw image will be in the Raw Preview & Statistics on the right side.

<!-- Source EN PDF p.30, unit 264 -->

9. The histogram information, maximum/minimum/average brightness, global wb gain, etc. can also be found here.

<!-- Source EN PDF p.30, unit 265 -->

10. Raw images are stored in ./raw_capture/module name/ by default.

<!-- Source EN PDF p.31, unit 266 -->

![Technical figure from English PDF, page 31](/docs/rockchip-iq-tools/assets/en-p031-figure-01.png)

<!-- Source EN PDF p.31, unit 267 -->

Figure 3-7-1-4 Captured a single-frame raw image with Gain=5x ExpTime=0.01s

<!-- Source EN PDF p.31, unit 268 -->

#### 3.7.2 Capture YUV Image Online

<!-- Source EN PDF p.31, unit 269 -->

1. Open the camera app and make sure the preview of the device work correctly.

<!-- Source EN PDF p.31, unit 270 -->

2. Run ToolServer, enter the IP address of the tool and connect to the device.

<!-- Source EN PDF p.31, unit 271 -->

3. Switch to the Online Capture, enter the name in Sensor Name, it will become the prefix of the YUV file name.

<!-- Source EN PDF p.31, unit 272 -->

4. When we need to capture continuous frames , configure the number in Frame Num.

<!-- Source EN PDF p.31, unit 273 -->

5. Click Capture YUV, the image can be previewed, the file will be stored in raw_capture/yuv/, as shown in Figure 3-7-2-1：

<!-- Source EN PDF p.31, unit 274 -->

![Technical figure from English PDF, page 31](/docs/rockchip-iq-tools/assets/en-p031-figure-02.png)

<!-- Source EN PDF p.31, unit 275 -->

Figure 3-7-2-1

<!-- Source EN PDF p.32, unit 276 -->

#### 3.7.3 Capture Raw Image Online

<!-- Source EN PDF p.32, unit 277 -->

1. Open the camera app and make sure the preview on the device works

<!-- Source EN PDF p.32, unit 278 -->

2. Run ToolServer, enter the IP address in the tool side, and connect to the device

<!-- Source EN PDF p.32, unit 279 -->

3. Switch to the Online Capture, enter the name in Sensor Name, it will become the prefix of the Raw file name

<!-- Source EN PDF p.32, unit 280 -->

4. When we need to capture continuous frames , configure the number in Frame Num

<!-- Source EN PDF p.32, unit 281 -->

5. Click Capture Raw, the image can be viewed on the preview, the file will be stored in raw_capture/, as shown in Figure 3-7-3-1:

<!-- Source EN PDF p.32, unit 282 -->

![Technical figure from English PDF, page 32](/docs/rockchip-iq-tools/assets/en-p032-figure-01.png)

<!-- Source EN PDF p.32, unit 283 -->

Figure 3-7-3-1

<!-- Source EN PDF p.32, unit 284 -->

About the maximum number of consecutive frames for capturing Raw online

<!-- Source EN PDF p.32, unit 285 -->

The maximum number of consecutive frames depends on the number of cache buffers applied for. This parameter can be configured through the -n parameter of ToolServer. The larger the number of buffers, the more consecutive frames can be captured in one performance. When the number of buffers is less than the number of captured frames, frames may be dropped. The number of buffers that can be configured also depends on the number of caches and memory size allocated by the kernel. For the kernel part, please refer to the following example:

<!-- Source EN PDF p.33, unit 286 -->

![Technical figure from English PDF, page 33](/docs/rockchip-iq-tools/assets/en-p033-figure-01.png)

The patch image is fully transcribed below; the original remains for comparison. This is a source fragment, not a patch guaranteed to apply to an arbitrary kernel.

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

## 4 Descriptions of Calibration

<!-- Source EN PDF p.34, unit 288 -->

The calibration work of each module has three parts:

<!-- Source EN PDF p.34, unit 289 -->

1. Capturing the images: According to the needs of each module, use the appropriate exposure to capture the raw image of the calibration board or scene.

<!-- Source EN PDF p.34, unit 290 -->

2. Calculate calibration parameters: import raw images, calculate calibration parameters, and individual modules can fine-tune some parameters as needed.

<!-- Source EN PDF p.34, unit 291 -->

3. Confirm and save the parameters: according to the standards of each module, judge whether the calibration parameters are correct.

<!-- Source EN PDF p.34, unit 292 -->

### 4.1 Capture Raw Images

<!-- Source EN PDF p.34, unit 293 -->

Refer to the operation steps in Section 3.6.

<!-- Source EN PDF p.34, unit 294 -->

### 4.2 BLC Calibration

<!-- Source EN PDF p.34, unit 295 -->

#### 4.2.1 Basic Principles

<!-- Source EN PDF p.34, unit 296 -->

Since the sensor has Black Level, it also has a certain output voltage when there is no external light, and the final output of the sensor needs to be subtracted from this value. In order to measure this value, some pixels that are not exposed at all are reserved. By reading the size of these pixel values, the Optical Black Level can be obtained in real time. At this time, the output of the sensor is: Raw = Sensor Input - Optical Black Level

<!-- Source EN PDF p.34, unit 297 -->

In addition, considering the signal-to-noise ratio of the sensor output, a base Pedestal is usually placed on the sensor output, and the output at this time is: Raw = Sensor Input - Optical Black Level - Pedestal

<!-- Source EN PDF p.34, unit 298 -->

Due to the different sensor configurations, for the BLC module, the final BLC correction value can be obtained by capturing the RAW data in the complete black scene.

<!-- Source EN PDF p.34, unit 299 -->

The correction value here is mainly affected by Gain and Temperature, so it needs to be calibrated separately at different ISOs. Since BLC is an offset, other modules need to deduct the offset when calibrating, otherwise the correct calibration parameters cannot be obtained.

<!-- Source EN PDF p.34, unit 300 -->

RV1106 platform: In order to retain more dark information during Bayer2D and Bayer3D noise reduction, the BLC module adds Sensor OB configuration, which is the Pedestal mentioned above. Some manufacturers support the configuration in the driver sequence, Some are fixed values, which can

<!-- Source EN PDF p.35, unit 301 -->

be confirmed by querying the data sheet or the driver code. If it is difficult to confirm the value, you can use the reference value in Section 4.2.4 or the BLC average value of each channel calculated by using Gain=1x.

<!-- Source EN PDF p.35, unit 302 -->

#### 4.2.2 Raw Image Requirements

<!-- Source EN PDF p.35, unit 303 -->

1. Cover the lens when capturing, make sure no light enters.

<!-- Source EN PDF p.35, unit 304 -->

2. Capturing needs to traverse Gain=1x, 2x, 4x, 8x, 16x...Max (if the driver supports the maximum Gain to 40x, then Max=32).

<!-- Source EN PDF p.35, unit 305 -->

3. The exposure time does not affect the BLC calibration and can be unified to 10ms.

<!-- Source EN PDF p.35, unit 306 -->

#### 4.2.3 Capture Raw Image

<!-- Source EN PDF p.35, unit 307 -->

1. Open the RK Capture Tool, refer to the instructions in Sections 3.1 and 3.2, connect to the device, select unknow (no light) for the light source name, and BLC for the module name.

<!-- Source EN PDF p.35, unit 308 -->

2. Put the device or module in a no light environment, and use a black cloth, lens cover, etc. to cover the lens tightly.

<!-- Source EN PDF p.35, unit 309 -->

3. Check Step and 2^n on the Manual Exposure page, according to Gain Range, configure: Gain Begin=1.0 and Gain End=Max, and ExpTime=0.010.

<!-- Source EN PDF p.35, unit 310 -->

4. Click Start Manual Capture to capture the Raw image in steps of 2 to the Nth power.

<!-- Source EN PDF p.35, unit 311 -->

5. The captured Raw image will be displayed on the right side, select the image you want to view by switching the drop-down box.

<!-- Source EN PDF p.35, unit 312 -->

![Technical figure from English PDF, page 35](/docs/rockchip-iq-tools/assets/en-p035-figure-01.png)

<!-- Source EN PDF p.35, unit 313 -->

Figure 4-2-3-1

<!-- Source EN PDF p.36, unit 314 -->

#### 4.2.4 Calibration Procedure

<!-- Source EN PDF p.36, unit 315 -->

![Technical figure from English PDF, page 36](/docs/rockchip-iq-tools/assets/en-p036-figure-01.png)

<!-- Source EN PDF p.36, unit 316 -->

Figure 4-2-4-1 BLC calibration results

<!-- Source EN PDF p.36, unit 317 -->

1. Open Calibration Tool, click Edit Options in the upper left of the interface, open the configuration interface, and enter the size, bit width and bayer order of the raw image.

<!-- Source EN PDF p.36, unit 318 -->

2. Select the BLC page, click the Load Raw Files, and select a folder to store Raw images.

<!-- Source EN PDF p.36, unit 319 -->

3. The imported Raw image will be displayed in the list on the right.

<!-- Source EN PDF p.36, unit 320 -->

4. Click Calibrate to start. RV1106 platform: Linear mode calibration needs to enter the Sensor OB value first. We list some commonly used OB values for reference:

<!-- Source EN PDF p.36, unit 321 -->

| Manufacturers | OB value for reference |
| --- | --- |
| GalaxyCore(gc) | 256 |
| OmniVision(ov/os) | 256 |
| Samsung(s5k) | 256 |
| SmartSens(sc) | 256 |
| Sony(imx) | The driver sequence can be configured, it is recommended to refer to the DataSheet and driver code, whichever is the actual. |

<!-- Source EN PDF p.36, unit 322 -->

5. The Black Level Curve obtained from calibration is displayed on the upper axis.

<!-- Source EN PDF p.36, unit 323 -->

6. The BLC value obtained from calibration will be in the table, click Save. Notes:

<!-- Source EN PDF p.36, unit 324 -->

1. If the device itself has power light and status indicators, etc., pay attention to whether there is light leakage.

<!-- Source EN PDF p.36, unit 325 -->

2. An incorrect BLC value will affect the calibration results of all subsequent modules. Please make sure that the BLC results are correct before performing subsequent calibration.

<!-- Source EN PDF p.37, unit 326 -->

### 4.3 LSC Calibration

<!-- Source EN PDF p.37, unit 327 -->

#### 4.3.1 Basic Principles

<!-- Source EN PDF p.37, unit 328 -->

Luma Shading is caused by the optical properties of the lens. For the entire lens, think of it as a convex lens. Since the light-gathering ability of the center of the convex lens is much greater than that of its corner, the light intensity in the center of the Sensor is greater than that in the corner areas. For an undistorted camera, the illumination attenuation around the image follows the formula:

<!-- Source EN PDF p.37, unit 329 -->

![Technical figure from English PDF, page 37](/docs/rockchip-iq-tools/assets/en-p037-figure-01.png)

<!-- Source EN PDF p.37, unit 330 -->

`cos^4(theta)`

<!-- Source EN PDF p.37, unit 331 -->

#### 4.3.2 Raw Image Requirements

<!-- Source EN PDF p.37, unit 332 -->

1. When capturing, cover the lens with diffuser (or use DNP light box, integrating sphere and other equipment).

<!-- Source EN PDF p.37, unit 333 -->

2. Capture in a light box with standard lighting, we recommend to calibrate 7 light sources: HZ, A, CWF, TL84, D50, D65, D75.

<!-- Source EN PDF p.37, unit 334 -->

3. To prevent the AC light source from generating Flicker, it is recommended to use an integer multiple of 10ms to configure the exposure time.

<!-- Source EN PDF p.37, unit 335 -->

4. The maximum brightness of the Raw image is about 200 (8bit), and the minimum brightness should be significantly larger than the black level value calibrated in the previous section.

<!-- Source EN PDF p.37, unit 336 -->

5. We recommend to use the diffuser as shown below:

<!-- Source EN PDF p.37, unit 337 -->

![Technical figure from English PDF, page 37](/docs/rockchip-iq-tools/assets/en-p037-figure-02.png)

<!-- Source EN PDF p.37, unit 338 -->

Figure 4-3-2-1 Opal Diffuser

<!-- Source EN PDF p.37, unit 339 -->

#### 4.3.3 Capture Raw Image

<!-- Source EN PDF p.37, unit 340 -->

1. Open the RK Capture Tool, refer to the instructions in sections 3.1 and 3.2, connect to the device, and select LSC as module name.

<!-- Source EN PDF p.37, unit 341 -->

2. Put the module in the light box, switch to HZ light, and place the diffuser close to the lens.

<!-- Source EN PDF p.38, unit 342 -->

3. Select HZ light source, check Search Exposure by Max Luma (8bit) on the Auto Exposure page, check Anti Flicker (50hz), and configure the maximum brightness of the target over the right to 200±10%, Frame Number = 1.

<!-- Source EN PDF p.38, unit 343 -->

4. Click Start Auto Capture to capture a raw image, during which the tool will automatically select the appropriate exposure until it meet the preset maximum brightness.

<!-- Source EN PDF p.38, unit 344 -->

5. Switch the light source to A, change the name of the light source to A, and repeat step 4 until all light sources are finished.

<!-- Source EN PDF p.38, unit 345 -->

![Technical figure from English PDF, page 38](/docs/rockchip-iq-tools/assets/en-p038-figure-01.png)

<!-- Source EN PDF p.38, unit 346 -->

Figure 4-3-3-1

<!-- Source EN PDF p.38, unit 347 -->

#### 4.3.4 Calibration Procedure

<!-- Source EN PDF p.38, unit 348 -->

1. Open Calibration Tool, click the Edit Options in the upper left corner, open the configuration interface, and enter the size, bit width and bayer order of the raw image.

<!-- Source EN PDF p.38, unit 349 -->

2. Select the LSC and click the Load Raw Files to import all raw images.

<!-- Source EN PDF p.38, unit 350 -->

3. The imported raw image will be displayed in the above window.

<!-- Source EN PDF p.38, unit 351 -->

4. Modify the Light Fall off to 100%.

<!-- Source EN PDF p.38, unit 352 -->

5. Click Calibrate to start.

<!-- Source EN PDF p.38, unit 353 -->

6. After calibration is done, we can view the raw image of each light source on the result page.

<!-- Source EN PDF p.38, unit 354 -->

7. Click Save.

<!-- Source EN PDF p.38, unit 355 -->

8. Modify the Light Fall off to 70%, repeat steps 5~7.

<!-- Source EN PDF p.39, unit 356 -->

![Technical figure from English PDF, page 39](/docs/rockchip-iq-tools/assets/en-p039-figure-01.png)

<!-- Source EN PDF p.39, unit 357 -->

Figure 4-3-4-1

<!-- Source EN PDF p.39, unit 358 -->

![Technical figure from English PDF, page 39](/docs/rockchip-iq-tools/assets/en-p039-figure-02.png)

<!-- Source EN PDF p.39, unit 359 -->

Figure 4-3-4-2

<!-- Source EN PDF p.39, unit 360 -->

Notes: The tool may not be able to find suitable exposure parameters because the light is too bright or too dark. In this case, we can refer to the following solutions:

<!-- Source EN PDF p.39, unit 361 -->

1. Adjust the brightness of the light source.

<!-- Source EN PDF p.39, unit 362 -->

2. Use ND filter.

<!-- Source EN PDF p.40, unit 363 -->

3. Adjust the lens orientation.

<!-- Source EN PDF p.40, unit 364 -->

4. Modify the Gain Range or Exp Range.

<!-- Source EN PDF p.40, unit 365 -->

5. Adjust the maximum brightness or threshold value for automatic exposure.

<!-- Source EN PDF p.40, unit 366 -->

6. Use manual exposure instead (the minimum standard for selection is that the minimum brightness is significantly greater than the Black Level value calibrated in the previous section).

<!-- Source EN PDF p.40, unit 367 -->

### 4.4 AWB Calibration

<!-- Source EN PDF p.40, unit 368 -->

#### 4.4.1 Introduction

<!-- Source EN PDF p.40, unit 369 -->

Calibrate the white point conditions of raw in XY, UV, YUV, the simple color algorithm parameter and the white balance gain under standard light source.

<!-- Source EN PDF p.40, unit 370 -->

#### 4.4.2 Raw Image Requirements

<!-- Source EN PDF p.40, unit 371 -->

Preparations for capturing raw images:

<!-- Source EN PDF p.40, unit 372 -->

1. Equipment: X-Rite 24 ColorChecker, Light Box (including D75, D65, D50, TL84, CWF, A, HZ)

<!-- Source EN PDF p.40, unit 373 -->

2. Adjust the exposure parameters, so that the maximum value of the brightest white block in the color is [150-240], the brighter the better within this range (if you want to use the same raw image with the following CCM, it should be darker)

<!-- Source EN PDF p.40, unit 374 -->

3. The ColorChecker occupies more than 1/9 of the screen Raw image capturing method:

<!-- Source EN PDF p.40, unit 375 -->

1. Open the RK Capture Tool, refer to chapter 3.1 and 3.2, connect to the device, module selects to CCM_AWB.

<!-- Source EN PDF p.40, unit 376 -->

2. Put the device and the ColorChecker in the light box, adjust their position, make the ColorChecker in the center of the screen, capture as large as possible, and do not move the device

<!-- Source EN PDF p.40, unit 377 -->

3. Open the light box and switch the light source to HZ light.

<!-- Source EN PDF p.40, unit 378 -->

4. Select HZ, check Search Exposure By Max Luma (8bit) on the Auto Exposure page, check Anti Flicker (50hz), and configure the maximum brightness of the target on the right to 200±10%, Frame Number = 1. (If at 1x Gain, 10ms integer multiples cannot capture raw images, turn off Anti-Flicker (50hz) and try again)

<!-- Source EN PDF p.41, unit 379 -->

![Technical figure from English PDF, page 41](/docs/rockchip-iq-tools/assets/en-p041-figure-01.png)

<!-- Source EN PDF p.41, unit 380 -->

Figure 4-4-2-1

<!-- Source EN PDF p.41, unit 381 -->

5. Click Start Auto Capture, the tool will automatically select the appropriate exposure until the preset maximum brightness is reached.

<!-- Source EN PDF p.41, unit 382 -->

6. Switch the light source to A, name the light source to A, and repeat the previous steps until all light sources are finished.

<!-- Source EN PDF p.41, unit 383 -->

For example, the calibration raw image after demosaicing are as follows:

<!-- Source EN PDF p.41, unit 384 -->

![Technical figure from English PDF, page 41](/docs/rockchip-iq-tools/assets/en-p041-figure-02.png)

<!-- Source EN PDF p.41, unit 385 -->

Figure 4-4-2-2

<!-- Source EN PDF p.42, unit 386 -->

#### 4.4.3 Calibration Tool Introduction

<!-- Source EN PDF p.42, unit 387 -->

1. Adjust the white point condition of the UV and XY domains, and the TH value of the YUV domain.

<!-- Source EN PDF p.42, unit 388 -->

![Technical figure from English PDF, page 42](/docs/rockchip-iq-tools/assets/en-p042-figure-01.png)

<!-- Source EN PDF p.42, unit 389 -->

Figure 4-4-3-1

<!-- Source EN PDF p.42, unit 390 -->

![Technical figure from English PDF, page 42](/docs/rockchip-iq-tools/assets/en-p042-figure-02.png)

<!-- Source EN PDF p.42, unit 391 -->

Figure 4-4-3-2

<!-- Source EN PDF p.42, unit 392 -->

2. Instructions for adjusting white point conditions in the UV and XY domains

<!-- Source EN PDF p.42, unit 393 -->

a) Use the mouse to drag the four corners of the white point area of any light source in the coordinate system to adjust the position and size

<!-- Source EN PDF p.42, unit 394 -->

b) Drag the mouse in the blank area in the coordinate system to adjust the display range.

<!-- Source EN PDF p.42, unit 395 -->

c) Use the scroll wheel to zoom in and out to adjust the scale.

<!-- Source EN PDF p.42, unit 396 -->

d) The Exclude WPC Range parameter can set the non-white point area and the extra light source white point area.

<!-- Source EN PDF p.42, unit 397 -->

3. Click the "AWB Simulation" button, this function can be used to detect the white point of the original image, calculate the WB Gain and the number of white points, and map the specified pixels to the UV and XY domains to confirm the correct white point conditions.

<!-- Source EN PDF p.43, unit 398 -->

![Technical figure from English PDF, page 43](/docs/rockchip-iq-tools/assets/en-p043-figure-01.png)

<!-- Source EN PDF p.43, unit 399 -->

Figure 4-4-3-3

<!-- Source EN PDF p.44, unit 400 -->

a) After clicking LoadImage to import the raw image, as shown below, the white point information will be printed. The white points of different light sources are displayed in different colors. The number of white points in the middle frame and large frame, RGain accumulation and BGain accumulation will be displayed in the three text boxes of WP Number, RGain and BGain

<!-- Source EN PDF p.44, unit 401 -->

![Technical figure from English PDF, page 44](/docs/rockchip-iq-tools/assets/en-p044-figure-01.png)

<!-- Source EN PDF p.44, unit 402 -->

Figure 4-4-3-4

<!-- Source EN PDF p.45, unit 403 -->

b) Click any position in the image (the black arrow as shown below), it will be mapped to the UV domain axes and the XY domain (small black square), which is convenient to check whether the point falls in the white point range. At the same time, the R G B U V X Y RGain BGain (red frame area) of the point is displayed, and the u and th after the point is mapped to each light source in the yuv domain and the deviation distance from the standard white point (corresponding to the three columns in the green frame area)

<!-- Source EN PDF p.45, unit 404 -->

![Technical figure from English PDF, page 45](/docs/rockchip-iq-tools/assets/en-p045-figure-01.png)

<!-- Source EN PDF p.45, unit 405 -->

Figure 4-4-3-5

<!-- Source EN PDF p.45, unit 406 -->

![Technical figure from English PDF, page 45](/docs/rockchip-iq-tools/assets/en-p045-figure-02.png)

<!-- Source EN PDF p.45, unit 407 -->

Figure 4-4-3-6

<!-- Source EN PDF p.46, unit 408 -->

#### 4.4.4 Calibration Procedure

<!-- Source EN PDF p.46, unit 409 -->

1. Open Calibration Tool, click Edit Options to open the configuration window, and enter the size, sensor bpp and bayer order of the raw image.

<!-- Source EN PDF p.46, unit 410 -->

2. Before AWB calibration, we must complete the BLC and LSC calibration.

<!-- Source EN PDF p.46, unit 411 -->

3. Click Load Raw Files to import the raw images of A, CWF, D50, D65, D75, HZ, TL84 (we recommend these seven light sources).

<!-- Source EN PDF p.46, unit 412 -->

4. Click Find Chart to open the color block search GUI. If the imported image is mirrored, it can be flipped through the Flip function area on the right. The current version supports horizontal and vertical flips.

<!-- Source EN PDF p.46, unit 413 -->

![Technical figure from English PDF, page 46](/docs/rockchip-iq-tools/assets/en-p046-figure-01.png)

<!-- Source EN PDF p.46, unit 414 -->

Figure 4-4-4-1

<!-- Source EN PDF p.46, unit 415 -->

a) Adjust the statistics area by dragging the red frame center dots on the upper left, upper right, lower left and lower right, and try to ensure that the statistics area is in the center of each color block, as shown in Figure 4-4-4-1

<!-- Source EN PDF p.46, unit 416 -->

b) Click FindChart to identify the color blocks of all light sources, as shown in Figure 4-4-4-2

<!-- Source EN PDF p.47, unit 417 -->

![Technical figure from English PDF, page 47](/docs/rockchip-iq-tools/assets/en-p047-figure-01.png)

<!-- Source EN PDF p.47, unit 418 -->

Figure 4-4-4-2

<!-- Source EN PDF p.47, unit 419 -->

c) Select another light source from the menu to confirm that the color patch detection results are correct. If the detection is correct, as shown in Figure 4-4-4-4. If it is found that the position of the detection result is wrong, as shown in Figure 4-4-4-3, it is only necessary to re-detect it separately. Select “Find Current Chart” in Mode and repeat steps a) and b) until the detection result is correct.

<!-- Source EN PDF p.47, unit 420 -->

![Technical figure from English PDF, page 47](/docs/rockchip-iq-tools/assets/en-p047-figure-02.png)

<!-- Source EN PDF p.47, unit 421 -->

Figure 4-4-4-3

<!-- Source EN PDF p.48, unit 422 -->

![Technical figure from English PDF, page 48](/docs/rockchip-iq-tools/assets/en-p048-figure-01.png)

<!-- Source EN PDF p.48, unit 423 -->

Figure 4-4-4-4

<!-- Source EN PDF p.48, unit 424 -->

d) Click the save button to complete the detection

<!-- Source EN PDF p.48, unit 425 -->

5. Click Calibrate to start. It will take about 30s. the following initial white point conditions and other parameters are obtained. Those dots in different colors in the coordinate systems of the UV and XY domains represent the positions of the color block values in the ColorChecker captured by each light source in the UV and XY color spaces, the rectangle box represents the white point conditions of different light sources.

<!-- Source EN PDF p.48, unit 426 -->

![Technical figure from English PDF, page 48](/docs/rockchip-iq-tools/assets/en-p048-figure-02.png)

<!-- Source EN PDF p.48, unit 427 -->

Figure 4-4-4-5

<!-- Source EN PDF p.49, unit 428 -->

![Technical figure from English PDF, page 49](/docs/rockchip-iq-tools/assets/en-p049-figure-01.png)

<!-- Source EN PDF p.49, unit 429 -->

Figure 4-4-4-6

<!-- Source EN PDF p.49, unit 430 -->

6. Click AWB Simulation and import the raw images of A, CWF, D50, D65, D75, HZ, TL84 in turn to check the accuracy of white point detection.

<!-- Source EN PDF p.49, unit 431 -->

7. Modify the frame of the UV domain or the XY domain or the TH of the YUV to make the white point detection of the ColorChecker under each light source more accurate.

<!-- Source EN PDF p.49, unit 432 -->

8. Click Save, and click Run Simulator on the AWB Simulation interface to view the white point detection results of the imported light source image.

<!-- Source EN PDF p.49, unit 433 -->

9. Repeat steps 6 to 8 until the white point detection of each light source is reasonable.

<!-- Source EN PDF p.50, unit 434 -->

Notes:

<!-- Source EN PDF p.50, unit 435 -->

1. Adjust the condition, try best to make white points (points marked 19, 20, 21, and 22 blocks) inside the box, and the non-white points are outside the box.

<!-- Source EN PDF p.50, unit 436 -->

2. The middle box of all light sources on the blackbody locus is continuous in the x direction. Example of error as shown in the below: Small spacing between large boxes, but large spacing between middle boxes

<!-- Source EN PDF p.50, unit 437 -->

![Technical figure from English PDF, page 50](/docs/rockchip-iq-tools/assets/en-p050-figure-01.png)

<!-- Source EN PDF p.50, unit 438 -->

The correct example is as follows:

<!-- Source EN PDF p.50, unit 439 -->

![Technical figure from English PDF, page 50](/docs/rockchip-iq-tools/assets/en-p050-figure-02.png)

<!-- Source EN PDF p.50, unit 440 -->

3. A and HZ light sources can be slightly smaller in the Y direction of the XY domain, and D50 and D65 can be slightly larger in the Y direction of the XY domain.

<!-- Source EN PDF p.50, unit 441 -->

4. Two light sources with very close color temperature (CWF and TL84) can be changed to be adjacent in the Y direction.

<!-- Source EN PDF p.50, unit 442 -->

5. In the UV domain, there cannot be a gap between any two light sources.

<!-- Source EN PDF p.50, unit 443 -->

6. The areas of different light sources can overlap, but do not overlap in both the XY and UV domains at the same time.

<!-- Source EN PDF p.50, unit 444 -->

7. When excluding non-white points, adjust the UV domain with the distribution of the XY domain as a reference.

<!-- Source EN PDF p.51, unit 445 -->

For example, the 7th block of D75 circled in the picture below falls within the HZ range and will be incorrectly detected as a white point.

<!-- Source EN PDF p.51, unit 446 -->

![Technical figure from English PDF, page 51](/docs/rockchip-iq-tools/assets/en-p051-figure-01.png)

<!-- Source EN PDF p.51, unit 447 -->

After readjustment, the 7th block of D75 light source is not in the same light source in xy and uv space and will not be recognized as a white point.

<!-- Source EN PDF p.51, unit 448 -->

![Technical figure from English PDF, page 51](/docs/rockchip-iq-tools/assets/en-p051-figure-02.png)

<!-- Source EN PDF p.51, unit 449 -->

8. When the non-white point falls in the white point range of XY and UV, it can also be excluded by reducing TH, or by increasing the non-white point range.

<!-- Source EN PDF p.51, unit 450 -->

9. When the white point falls within the white point range of XY and UV, but it is still not a white point, it may be excluded because it exceeds the brightness range, or it falls within the non-white point range, or it is less than TH and does not fall within the white point range. In the white point interval of the YUV domain.

<!-- Source EN PDF p.52, unit 451 -->

#### 4.4.5 Example of AWB Calibration Results

<!-- Source EN PDF p.52, unit 452 -->

Final White Point Conditions:

<!-- Source EN PDF p.52, unit 453 -->

![Technical figure from English PDF, page 52](/docs/rockchip-iq-tools/assets/en-p052-figure-01.png)

<!-- Source EN PDF p.52, unit 454 -->

Figure 4-4-5-1

<!-- Source EN PDF p.52, unit 455 -->

The white point detection results of each light source are:

<!-- Source EN PDF p.52, unit 456 -->

![Technical figure from English PDF, page 52](/docs/rockchip-iq-tools/assets/en-p052-figure-02.png)

<!-- Source EN PDF p.53, unit 457 -->

Figure 4-4-5-1 A

<!-- Source EN PDF p.53, unit 458 -->

![Technical figure from English PDF, page 53](/docs/rockchip-iq-tools/assets/en-p053-figure-01.png)

<!-- Source EN PDF p.53, unit 459 -->

Figure 4-4-5-2 CWF

<!-- Source EN PDF p.53, unit 460 -->

![Technical figure from English PDF, page 53](/docs/rockchip-iq-tools/assets/en-p053-figure-02.png)

<!-- Source EN PDF p.54, unit 461 -->

Figure 4-4-5-3 D50

<!-- Source EN PDF p.54, unit 462 -->

![Technical figure from English PDF, page 54](/docs/rockchip-iq-tools/assets/en-p054-figure-01.png)

<!-- Source EN PDF p.54, unit 463 -->

Figure 4-4-5-4 D65

<!-- Source EN PDF p.54, unit 464 -->

![Technical figure from English PDF, page 54](/docs/rockchip-iq-tools/assets/en-p054-figure-02.png)

<!-- Source EN PDF p.55, unit 465 -->

Figure 4-4-5-5 D75

<!-- Source EN PDF p.55, unit 466 -->

![Technical figure from English PDF, page 55](/docs/rockchip-iq-tools/assets/en-p055-figure-01.png)

<!-- Source EN PDF p.55, unit 467 -->

Figure 4-4-5-6 HZ

<!-- Source EN PDF p.55, unit 468 -->

![Technical figure from English PDF, page 55](/docs/rockchip-iq-tools/assets/en-p055-figure-02.png)

<!-- Source EN PDF p.55, unit 469 -->

Figure 4-4-5-7 TL84

<!-- Source EN PDF p.56, unit 470 -->

### 4.5 CCM Calibration

<!-- Source EN PDF p.56, unit 471 -->

#### 4.5.1 Raw Image Requirements

<!-- Source EN PDF p.56, unit 472 -->

The raw image requirements refer to chapter 4.4, CCM can use the raw image of AWB to calibration. In addition, since the Gamma curve will affect the CCM results, it may be necessary to adjust the CCM parameters again when the Gamma curve is modified. In this case, please refer to chapter

<!-- Source EN PDF p.56, unit 473 -->

4.5.2, point 12.

<!-- Source EN PDF p.56, unit 474 -->

#### 4.5.2 CCM Calibration Procedure

<!-- Source EN PDF p.56, unit 475 -->

1. Open the Calibration Tool, select the CCM, and click the Load Raw Files to import all raw images. The imported raw image will be displayed in the list:

<!-- Source EN PDF p.56, unit 476 -->

![Technical figure from English PDF, page 56](/docs/rockchip-iq-tools/assets/en-p056-figure-01.png)

<!-- Source EN PDF p.56, unit 477 -->

Figure 4-5-2-1

<!-- Source EN PDF p.57, unit 478 -->

2. Click Find Chart to open the color block search GUI.

<!-- Source EN PDF p.57, unit 479 -->

![Technical figure from English PDF, page 57](/docs/rockchip-iq-tools/assets/en-p057-figure-01.png)

<!-- Source EN PDF p.57, unit 480 -->

Figure 4-5-2-2

<!-- Source EN PDF p.57, unit 481 -->

3. Drag the red frame center dots on the upper left, upper right, lower left, and lower right to adjust the sampling area, and make sure that the sampling area is in the center of each color block.

<!-- Source EN PDF p.57, unit 482 -->

4. Click Find Chart to start counting the color block values, and the statistical area will be marked in green.

<!-- Source EN PDF p.57, unit 483 -->

5. Check each light source in the list and confirm whether the statistical area is correct.

<!-- Source EN PDF p.57, unit 484 -->

![Technical figure from English PDF, page 57](/docs/rockchip-iq-tools/assets/en-p057-figure-02.png)

<!-- Source EN PDF p.57, unit 485 -->

Figure 4-5-2-3

<!-- Source EN PDF p.57, unit 486 -->

6. After the search is complete, click Save and then exit.

<!-- Source EN PDF p.57, unit 487 -->

7. Set the saturation to 100%, as shown in Figure 4-5-2-4.

<!-- Source EN PDF p.58, unit 488 -->

![Technical figure from English PDF, page 58](/docs/rockchip-iq-tools/assets/en-p058-figure-01.png)

<!-- Source EN PDF p.58, unit 489 -->

Figure 4-5-2-4

<!-- Source EN PDF p.58, unit 490 -->

8. Click the Calibrate to start the calibration. It takes about 20s.

<!-- Source EN PDF p.58, unit 491 -->

9. After the calibration is completed, the calculation result will be on the result page.

<!-- Source EN PDF p.58, unit 492 -->

10. Click the Save button.

<!-- Source EN PDF p.58, unit 493 -->

11. Modify the saturation to 74% and repeat steps 8~10.

<!-- Source EN PDF p.58, unit 494 -->

![Technical figure from English PDF, page 58](/docs/rockchip-iq-tools/assets/en-p058-figure-02.png)

<!-- Source EN PDF p.58, unit 495 -->

Figure 4-5-2-5

<!-- Source EN PDF p.58, unit 496 -->

12. If ΔE is too large, the raw image may be too bright. You can right-click the ColorChecker image on the right side of Figure 4-5-2-5, click Save Current, save the image, and check whether each color patch is overexposed or a certain channel is saturated (CCM calibration after applying the Gamma curve may cause calibration patches saturation).

<!-- Source EN PDF p.58, unit 497 -->

a) If there is a problem of over-brightness or over-saturation, you should re-capture the color chart of the light source, reduce the exposure, and re-calibrate.

<!-- Source EN PDF p.58, unit 498 -->

b) If the brightness of the color blocks is normal, the possible causes of the problem are: abnormal BLC parameters, abnormal LSC parameters, lens light leakage (infrared light), etc..

<!-- Source EN PDF p.58, unit 499 -->

13. For specific tuning methods, please refer to Rockchip_Color_Optimization_Guide

<!-- Source EN PDF p.59, unit 500 -->

### 4.6 NR Calibration

<!-- Source EN PDF p.59, unit 501 -->

#### 4.6.1 Raw Image Requirements

<!-- Source EN PDF p.59, unit 502 -->

NR module raw image capture instructions:

<!-- Source EN PDF p.59, unit 503 -->

1. Capture in a light box with a standard light source, it is recommended to use a DC light source with adjustable brightness.

<!-- Source EN PDF p.59, unit 504 -->

2. A grayscale gradient card must be used, as shown in Figure 4-6-1-1.

<!-- Source EN PDF p.59, unit 505 -->

![Technical figure from English PDF, page 59](/docs/rockchip-iq-tools/assets/en-p059-figure-01.png)

<!-- Source EN PDF p.59, unit 506 -->

Figure 4-6-1-1

<!-- Source EN PDF p.59, unit 507 -->

3. Exposure needs to traverse Gain=1x, 2x, 4x, 8x, 16x...Max (for example, if the maximum gain is supported to 40x, then Max=32).

<!-- Source EN PDF p.59, unit 508 -->

4. Four Raw images need to be captured under each Gain, namely highlight-stacked frame, highlight-single frame, low-light-stacked frame, and low-light single frame.

<!-- Source EN PDF p.59, unit 509 -->

5. High light and low light can be distinguished by adjusting the exposure time or light brightness, and multiple frames and single frames are generated by tool processing.

<!-- Source EN PDF p.59, unit 510 -->

6. The following brightness values are all 8-bits.

<!-- Source EN PDF p.59, unit 511 -->

7. Low-light image requirements: the pixel value of the brightest block in Figure 4-6-1-1 reaches 30 (to ensure that the boundary of each color block can be seen clearly, if it is not satisfied, it can be appropriately increased), and the pixel value of the darkest block reaches Black-Level (It can be satisfied when the pixel value of the brightest block just reaches 30).

<!-- Source EN PDF p.59, unit 512 -->

8. Highlight image requirements: the pixel value of the brightest block in Figure 4-6-1-1 reaches 255, and the pixel value of the darkest block is generally around 60-70.

<!-- Source EN PDF p.59, unit 513 -->

9. RK Capture Tool provides the YNR Capture function, which can automatically search for qualified exposure combinations based on the brightness of the darkest and brightest blocks settings.

<!-- Source EN PDF p.59, unit 514 -->

#### 4.6.2 Capture Raw Image

<!-- Source EN PDF p.59, unit 515 -->

1. Open the RK Capture Tool, refer to the instructions in sections 3.1 and 3.2 to connect the device.

<!-- Source EN PDF p.59, unit 516 -->

2. Put the device or module in the light box, and stick the gradient chart on the light box.

<!-- Source EN PDF p.59, unit 517 -->

3. Adjust the position of the device so that the gradient chart is moved to the center of the screen, and it is as close to the picture as possible.

<!-- Source EN PDF p.60, unit 518 -->

4. Turn on the light box and switch the light source to TL84 or CWF.

<!-- Source EN PDF p.60, unit 519 -->

5. Modify the light source name to TL84 or CWF, and the module name to NR_Normal.

<!-- Source EN PDF p.60, unit 520 -->

6. Assuming that the sensor supports Gain=1-24, we need to capture 1x 2x 4x 8x 16x.

<!-- Source EN PDF p.60, unit 521 -->

7. Select the YNR Capture, first take a raw image, right-click on the preview on the right and select Draw ROI, and select the brightest block and the darkest block in the preview image in turn (represented by black and white blocks later), double-click the rectangle, we can re-draw it, fix the image position and the rectangle position, and perform NR capturing, as shown in

<!-- Source EN PDF p.60, unit 522 -->

Figure 4-6-2-1.

<!-- Source EN PDF p.60, unit 523 -->

![Technical figure from English PDF, page 60](/docs/rockchip-iq-tools/assets/en-p060-figure-01.png)

<!-- Source EN PDF p.60, unit 524 -->

Figure 4-6-2-1

<!-- Source EN PDF p.60, unit 525 -->

8. Capturing the low-light raw image: The brightness of the light box is adjusted to about 800lux. Modify the value of Gain Range in the tool to 1.0 - 1.0, and Exp Range will not be modified. Check Multi-Frame and Low-Light. Select the YNR Capture page and fill in the thresholds of the black and white rectangles. set FrameNumber=32. Black Block Mean Luma: The target value to be achieved by the black block, which is initially filled in as BLC(8bit)+1. White Block Mean Luma: The target value to be achieved by the white block, the initial fill is

<!-- Source EN PDF p.60, unit 526 -->

30.

<!-- Source EN PDF p.60, unit 527 -->

![Technical figure from English PDF, page 60](/docs/rockchip-iq-tools/assets/en-p060-figure-02.png)

<!-- Source EN PDF p.60, unit 528 -->

Figure 4-6-2-2

<!-- Source EN PDF p.61, unit 529 -->

a) Click the Start YNR Capture button to start capturing, and the current average pixel value of the two rectangular boxes and the corresponding exposure parameters will be printed in the log box; meanValue[0]: the current average pixel value of the black block; meanValue[1]: The current average pixel value of the white block; blackTarget: the filled Black Block Mean Luma threshold; whiteTarget: the filled White Block Mean Luma threshold.

<!-- Source EN PDF p.61, unit 530 -->

b) When the threshold value cannot capture the image, as shown in Figure 4-6-2-3, check the log, find that meanValue[1] is just larger than the meanValue[0] of whiteTarget, and set this value to Black Block Mean Luma (In order to avoid noise interference threshold, meanValue[0] can be slightly increased), as shown in Figure 4-6-2-4.

<!-- Source EN PDF p.61, unit 531 -->

![Technical figure from English PDF, page 61](/docs/rockchip-iq-tools/assets/en-p061-figure-01.png)

<!-- Source EN PDF p.61, unit 532 -->

Figure 4-6-2-3

<!-- Source EN PDF p.61, unit 533 -->

![Technical figure from English PDF, page 61](/docs/rockchip-iq-tools/assets/en-p061-figure-02.png)

<!-- Source EN PDF p.61, unit 534 -->

Figure 4-6-2-4

<!-- Source EN PDF p.62, unit 535 -->

c) After finding the threshold that satisfies the conditions, click the Start YNR Capture button again to start the capture. After the capture is completed, one Raw image with the Multiple and Single suffixes is obtained, as shown in Figure 4-6-2-5.

<!-- Source EN PDF p.62, unit 536 -->

![Technical figure from English PDF, page 62](/docs/rockchip-iq-tools/assets/en-p062-figure-01.png)

<!-- Source EN PDF p.62, unit 537 -->

Figure 4-6-2-5

<!-- Source EN PDF p.62, unit 538 -->

9. Capturing the high-light raw image: The brightness of the light box is adjusted to about 800lux. Modify the value of Gain Range in the interface to 1.0 - 1.0, and Exp Range will not be modified. Check Multi-Frame and High-Light. Select the YNR Capture page and fill in the following two boxes for the thresholds. Black Block Mean Luma: Indicates the target value to be achieved by the darkest block, the initial fill is 60. White Block Mean Luma: Indicates the target value to be achieved by the brightest block, fixed at 255. set FrameNumber=32

<!-- Source EN PDF p.63, unit 539 -->

![Technical figure from English PDF, page 63](/docs/rockchip-iq-tools/assets/en-p063-figure-01.png)

<!-- Source EN PDF p.63, unit 540 -->

Figure 4-6-2-6

<!-- Source EN PDF p.63, unit 541 -->

a) Click the Start YNR Capture button to start capturing, and the log of the tool will print the average value of the ROI area, exposure and gain after each exposure adjustment. meanValue[0]: the current average pixel value of the darkest block. meanValue[1]: the current average pixel value of the brightest block. blackTarget: the filled Black Block Mean Luma threshold. whiteTarget: the filled White Block Mean Luma threshold.

<!-- Source EN PDF p.63, unit 542 -->

b) When the exposure and gain reach the maximum, but the brightness of the brightest block still cannot reach 255, as shown in Figure 4-6-2-7, you need to manually adjust the brightness of the light box, and then click Start YNR Capture to re-capture, after the conditions are met Obtain a Raw image with Multiple and Single suffixes, as shown in Figure 4-6-2-8.

<!-- Source EN PDF p.63, unit 543 -->

![Technical figure from English PDF, page 63](/docs/rockchip-iq-tools/assets/en-p063-figure-02.png)

<!-- Source EN PDF p.63, unit 544 -->

Figure 4-6-2-7

<!-- Source EN PDF p.64, unit 545 -->

![Technical figure from English PDF, page 64](/docs/rockchip-iq-tools/assets/en-p064-figure-01.png)

<!-- Source EN PDF p.64, unit 546 -->

Figure 4-6-2-8

<!-- Source EN PDF p.64, unit 547 -->

10. Modify the Gain Range value to 2x, and repeat steps 8 and 9 until all Gain capturing is completed.

<!-- Source EN PDF p.64, unit 548 -->

11. Since the Gain will continue to increase, the threshold of the black block will be greatly affected by the noise, and the threshold of the black block can be slightly adjusted according to the printed log.

<!-- Source EN PDF p.65, unit 549 -->

#### 4.6.3 Calibration Procedure

<!-- Source EN PDF p.65, unit 550 -->

GIC & BayerNR and YNR & MFNR modules share the same set of Raw images:

<!-- Source EN PDF p.65, unit 551 -->

1. Open Calibration Tool, click the Edit Options button in the upper left corner, enter the size, bit width and bayer order of the Raw image.

<!-- Source EN PDF p.65, unit 552 -->

2. Select the GIC & Bayer NR page, click the Load Raw Files button to import all Raw images, and the imported Raw images will be in the list below.

<!-- Source EN PDF p.65, unit 553 -->

3. Click Find ROI to frame the position of the gradient chart, as shown in Figure 4-6-3-1, make sure that the rectangular frame is within the color block.

<!-- Source EN PDF p.65, unit 554 -->

![Technical figure from English PDF, page 65](/docs/rockchip-iq-tools/assets/en-p065-figure-01.png)

<!-- Source EN PDF p.65, unit 555 -->

Figure 4-6-3-1

<!-- Source EN PDF p.65, unit 556 -->

4. Click Calibrate button to start.

<!-- Source EN PDF p.65, unit 557 -->

5. The BayerNR noise curve obtained after the calibration is completed will be displayed in the right window, as shown in Figure 4-6-3-2.

<!-- Source EN PDF p.65, unit 558 -->

![Technical figure from English PDF, page 65](/docs/rockchip-iq-tools/assets/en-p065-figure-02.png)

<!-- Source EN PDF p.65, unit 559 -->

Figure 4-6-3-2

<!-- Source EN PDF p.66, unit 560 -->

6. Click Save.

<!-- Source EN PDF p.66, unit 561 -->

7. Select the YNR&MFNR page, click the Load Raw Files button to import all Raw images, and the imported Raw can be found in the list below.

<!-- Source EN PDF p.66, unit 562 -->

8. Click the Calculate YUV button, the Raw image will be processed into a YUV image by the simulator.

<!-- Source EN PDF p.66, unit 563 -->

9. Click the Calibrate button, and check YNRCurve Print before Calibrating to save the calibration parameters and sampling points of each iso.

<!-- Source EN PDF p.66, unit 564 -->

10. The YNR noise curve obtained from calibration will be in the right window, as shown in Figure 4-6-3-3.

<!-- Source EN PDF p.66, unit 565 -->

11. Click Save.

<!-- Source EN PDF p.66, unit 566 -->

![Technical figure from English PDF, page 66](/docs/rockchip-iq-tools/assets/en-p066-figure-01.png)

<!-- Source EN PDF p.66, unit 567 -->

Figure 4-6-3-3

<!-- Source EN PDF p.66, unit 568 -->

Notes: If the generated noise curve is very different from the curve in Figure 4-6-3-3, it may be that the high light or low light brightness is wrong. You can judge according to the abnormal position of the curve: The wrong curve on the left means that the low light brightness is not suitable. The wrong curve on the right means that the highlight brightness is not suitable. The color temperature of the light source used should not be too high or too low, otherwise the result of Calculate YUV may be incorrect. If the minimum brightness of the light box cannot meet the capturing requirements, you can use a light reduction film to assist the capture.

<!-- Source EN PDF p.67, unit 569 -->

### 4.7 FEC/LDCH

<!-- Source EN PDF p.67, unit 570 -->

To use the FEC/LDCH module, a map table is needed. The map table only with the coordinates of the horizontal x/y direction of the image, and is a mapping table after down-sampling. To get the map table, we need to know the relevant parameters of the camera lens. We need to capture a set of checkerboard images, and then use the calibration tool to calibrate.

<!-- Source EN PDF p.67, unit 571 -->

#### 4.7.1 Calibration Image Requirements

<!-- Source EN PDF p.67, unit 572 -->

Capturing checkerboard, the checkerboard size is changeable, and the calibration image only supports jpg, bmp, png format. Checkerboard capturing has two modes: Method 1: One image contains only one checkerboard (higher precision, recommended). Method 2: One image contains n checkerboards (for the convenience of calibration, n=4).

<!-- Source EN PDF p.67, unit 573 -->

1. Preparations (1) The checkerboard should be a standard calibration board. If you print the checkerboard by yourself, please pay attention to the real size. The self-printed checkerboard should have a flat surface, preferably fixed on a flat board. The number of checkerboards grids should be different from the horizontal and vertical grids as much as possible, which is convenient for the calibration tool to identify the direction. (2) Appropriate lighting conditions and capturing environment: The lighting is moderate to ensure that the images from all angles during the capturing process are clear, and there should be no reflection or blur on the checkerboard. In the whole process, the aperture and focal length of the camera should be fixed, and it is necessary that the amount of light entering the camera and the focal length are fixed.

<!-- Source EN PDF p.67, unit 574 -->

2. Operating rules (1) Appropriate ratio: try to make the captured checkerboard image occupy between 1/4 and 1/8 of the entire camera field of view. (2) Appropriate number: make sure that the checkerboards of all images can cover the entire camera field of view, the number is usually about 15, too few quantities will cause inaccurate calibration parameters. It is recommended to take 3-4 pictures at the same position, In order to facilitate subsequent screening and replacement of unqualified images. (3) Appropriate distribution: As shown in Figure 2-1, make sure that the captured images of the calibration board are evenly distributed in all areas and corners of the camera's field of view, and when it is close to the edge of the field of view, the checkerboard should be as close to the edges as possible, but take care that do not make the checkerboard out of the image field of view. (4) Different tilt angles: We should not just capture images parallel to the plane of the lens, but make sure it with different tilt angles.

<!-- Source EN PDF p.68, unit 575 -->

3. Capturing demonstration

<!-- Source EN PDF p.68, unit 576 -->

There are two ways to capture: (1) Method 1 (recommended) Four calibration pictures, the checkerboard occupies four positions of the upper left, upper right, lower left and lower right in the calibration picture, and there is no specific order.

<!-- Source EN PDF p.68, unit 577 -->

![Technical figure from English PDF, page 68](/docs/rockchip-iq-tools/assets/en-p068-figure-01.png)

<!-- Source EN PDF p.68, unit 578 -->

![Technical figure from English PDF, page 68](/docs/rockchip-iq-tools/assets/en-p068-figure-02.png)

<!-- Source EN PDF p.68, unit 579 -->

![Technical figure from English PDF, page 68](/docs/rockchip-iq-tools/assets/en-p068-figure-03.png)

<!-- Source EN PDF p.69, unit 580 -->

![Technical figure from English PDF, page 69](/docs/rockchip-iq-tools/assets/en-p069-figure-01.png)

<!-- Source EN PDF p.69, unit 581 -->

Figure 4-7-1-1

<!-- Source EN PDF p.69, unit 582 -->

(2) Method 2 A calibration image, the upper left, upper right, lower left and lower right corners are covered with checkerboards.

<!-- Source EN PDF p.69, unit 583 -->

![Technical figure from English PDF, page 69](/docs/rockchip-iq-tools/assets/en-p069-figure-02.png)

<!-- Source EN PDF p.69, unit 584 -->

Figure 4-7-1-2

<!-- Source EN PDF p.70, unit 585 -->

#### 4.7.2 Calibration Procedure

<!-- Source EN PDF p.70, unit 586 -->

![Technical figure from English PDF, page 70](/docs/rockchip-iq-tools/assets/en-p070-figure-01.png)

<!-- Source EN PDF p.70, unit 587 -->

Figure 4-7-2-1

<!-- Source EN PDF p.70, unit 588 -->

1. Configure the resolution in the Raw Options. Bit and Bayer Pattern can be ignored.

<!-- Source EN PDF p.70, unit 589 -->

2. Import the folder of calibration images. Support jpg, bmp, png formats.

<!-- Source EN PDF p.70, unit 590 -->

3. Adjust the calibration configuration parameters.

<!-- Source EN PDF p.70, unit 591 -->

a) Square Size: The actual size of each grid in the checkerboard, generally 30mm or 25mm.

<!-- Source EN PDF p.70, unit 592 -->

b) Horizontal/Vertical: The number of inner corner points of the horizontal (Horizontal) and vertical (Vertical) of the checkerboard:

<!-- Source EN PDF p.70, unit 593 -->

c) Check Board Number: the number of checkerboards in each image can be 1 or 4.

<!-- Source EN PDF p.70, unit 594 -->

d) Level: Set the Level of distortion correction, which is divided into 256 levels. Level = 0 means that the mapping table obtained at this time has no correction effect (that is, the output image is the same as the input image), and Level = 255 means that the mapping table is the maximum degree of correction that LDCH can achieve.

<!-- Source EN PDF p.70, unit 595 -->

e) Correct Direction: If the mapping table is generated for the FEC module, we can also set different corrections: i. Only check Correct X: Only correct the horizontal direction, the effect is similar to LDCH. ii. Only check Correct Y: only the vertical direction is corrected. iii. Both Correct X and Correct Y: both horizontal and vertical directions are corrected.

<!-- Source EN PDF p.70, unit 596 -->

4. Click Calibrate.

<!-- Source EN PDF p.70, unit 597 -->

5. Save the results.

<!-- Source EN PDF p.71, unit 598 -->

How to distinguish the corners and interior corners of the checkerboard (see Figure 4-7-2-2). The picture below shows a checkerboard with 12 horizontal and 9 vertical grids. The number of horizontal corners is 13, the number of horizontal inner corners is 11, and so on. So Horizontal = 11, Vertical = 8.

<!-- Source EN PDF p.71, unit 599 -->

![Technical figure from English PDF, page 71](/docs/rockchip-iq-tools/assets/en-p071-figure-01.png)

<!-- Source EN PDF p.71, unit 600 -->

Figure 4-7-2-2 The corners and interior corners of the checkerboard

<!-- Source EN PDF p.71, unit 601 -->

(Corners include red and green parts, while inner corners only include red parts)

<!-- Source EN PDF p.71, unit 602 -->

Notes:

<!-- Source EN PDF p.71, unit 603 -->

1. Check the "result" folder exists in the toolpath, if not, we have to create a new folder called "result" and place it in the same directory as the Calibration Tool.

<!-- Source EN PDF p.71, unit 604 -->

2. The outermost circle of the chessboard is indeed calculated. However, when capturing the image, the black and white blocks in the outermost circle cannot be completely blocked by the preview.

<!-- Source EN PDF p.71, unit 605 -->

3. The number of corner points in the horizontal direction is equal to: the number of black and white blocks in the horizontal direction minus 1.

<!-- Source EN PDF p.71, unit 606 -->

4. The number of corner points in the vertical direction is equal to: the number of black and white blocks in the vertical direction minus 1.

<!-- Source EN PDF p.71, unit 607 -->

5. FEC is corrected in both directions by default. When calibrating, the direction can be selected.

<!-- Source EN PDF p.71, unit 608 -->

6. The folder for storing the image, preferably named after sensor name + lens name/focal length + resolution, the tool will generate a folder for storing calibration files according to this name

<!-- Source EN PDF p.72, unit 609 -->

#### 4.7.3 Example of Calibration Results

<!-- Source EN PDF p.72, unit 610 -->

1. If there is an unsuccessful calibration result, generally, the corner detection is inaccurate or incomplete due to the unclear capturing of the checkerboard. Therefore, we should first check whether the corners of each image checkerboard are completely and accurately detected, and the number of complete detections cannot be less than 3.

<!-- Source EN PDF p.72, unit 611 -->

2. If the calibration is successful, the result shown in Figure 4-7-3-1 will appear. We can view the calibrated distortion parameters in the “log” on the left. The meanings of the six parameters from top to bottom are: the center coordinates of the camera (cx, cy), camera distortion parameters (a0, a2, a3, a4).

<!-- Source EN PDF p.72, unit 612 -->

3. On the “result”, we can view the checkerboard corner detection results for each image. If the detection result is inaccurate, delete the image, and re-calibrate it to obtain a more accurate result. The generated FEC and LDCH mapping table is stored in the corresponding folder under the “result”.

<!-- Source EN PDF p.72, unit 613 -->

![Technical figure from English PDF, page 72](/docs/rockchip-iq-tools/assets/en-p072-figure-01.png)

<!-- Source EN PDF p.72, unit 614 -->

Figure 4-7-3-1

<!-- Source EN PDF p.73, unit 615 -->

## 5 Online Tuning

<!-- Source EN PDF p.73, unit 616 -->

### 5.1 Introduction of Tuning GUI

<!-- Source EN PDF p.73, unit 617 -->

![Technical figure from English PDF, page 73](/docs/rockchip-iq-tools/assets/en-p073-figure-01.png)

<!-- Source EN PDF p.73, unit 618 -->

Figure 5-1-1 Main UI of RKISP Tuner v2

<!-- Source EN PDF p.73, unit 619 -->

As shown in Figure 5-1-1, this interface is a typical state of use: the interface after the loading and tuning UI is completed and the IQ parameters are imported. The following briefly introduces the UI meaning and functions of the numbers marked in the figure:

<!-- Source EN PDF p.73, unit 620 -->

1. Module tree structure diagram: "normal: day" displayed at the top is the name of the scene selected to load when loading IQ parameters, where "normal" is the name of the main scene, and day is the name of the sub-scene.

<!-- Source EN PDF p.73, unit 621 -->

2. ISP module: a scene can contain multiple modules, and a module can contain some pages.

<!-- Source EN PDF p.73, unit 622 -->

3. Tuning page: A module node can contain multiple tuning pages, and a tuning page can contain some tuning units.

<!-- Source EN PDF p.73, unit 623 -->

4. Tuning unit: For example, the unit name is InitExp, which contains 5 numeric member parameters.

<!-- Source EN PDF p.73, unit 624 -->

5. Tuning unit read and write buttons: provide online read and write functions for all parameters in the entire unit.

<!-- Source EN PDF p.74, unit 625 -->

6. Automatic writing function: when it is checked, if the tool has been connected to rkaiq_tool_server, every parameter modification will be automatically sent to the device and the settings will take effect.

<!-- Source EN PDF p.74, unit 626 -->

7. Page/module read/write button: provide online read and write functions for the entire page or module.

<!-- Source EN PDF p.74, unit 627 -->

8. Undo/Redo function: Can undo the last modification operation, if AutoWrite is checked, the device will also synchronize the operation.

<!-- Source EN PDF p.74, unit 628 -->

9. Search function: find the page where the parameter is located according to the keyword.

<!-- Source EN PDF p.74, unit 629 -->

### 5.2 Platform & Network Configuration Function

<!-- Source EN PDF p.74, unit 630 -->

Open the platform & network configuration window when you start the tool for the first time or click the "Project" - "Network and Platform Settings" button in the menu bar, as shown in the following figure

<!-- Source EN PDF p.74, unit 631 -->

![Technical figure from English PDF, page 74](/docs/rockchip-iq-tools/assets/en-p074-figure-01.png)

<!-- Source EN PDF p.74, unit 632 -->

Figure 5-2-1

<!-- Source EN PDF p.74, unit 633 -->

1.Platform Setting: Selecting the chip will load different configuration files of tuning UI. The correspondence between different platforms and configuration files is recorded in config/config.ini

<!-- Source EN PDF p.74, unit 634 -->

2. Network Config: Configure the network address of the device, the port number is 5543 by default, do not modify it unless there are special requirements

<!-- Source EN PDF p.74, unit 635 -->

Click the "Connect" button, the tool will try to establish a connection to the rkaiq_tool_server in the device, please make sure rkaiq_tool_server is running correctly

<!-- Source EN PDF p.75, unit 636 -->

### 5.3 Registers and Algorithm Parameters

<!-- Source EN PDF p.75, unit 637 -->

Each tuning unit contains registers or algorithm parameters. According to the different parameter forms and value ranges, different controls are used, which generally have the following four categories:

<!-- Source EN PDF p.75, unit 638 -->

1. Numerical value: an integer or floating-point value with a certain range of values. Modify the value directly Use the up and down arrows to adjust the value Use the slider on the right to adjust the value

<!-- Source EN PDF p.75, unit 639 -->

![Technical figure from English PDF, page 75](/docs/rockchip-iq-tools/assets/en-p075-figure-01.png)

<!-- Source EN PDF p.75, unit 640 -->

Figure 5-3-1

<!-- Source EN PDF p.75, unit 641 -->

2. Boolean: a parameter whose value is 0 or 1, mainly for various function switches, etc.. Take 1 when Enable, and take 0 when Disable.

<!-- Source EN PDF p.75, unit 642 -->

![Technical figure from English PDF, page 75](/docs/rockchip-iq-tools/assets/en-p075-figure-02.png)

<!-- Source EN PDF p.75, unit 643 -->

Figure 5-3-2

<!-- Source EN PDF p.75, unit 644 -->

3. List: choose one of the preset options, mainly for various function modes, ISO, Day/Night and LCG/HCG gear selection.

<!-- Source EN PDF p.75, unit 645 -->

![Technical figure from English PDF, page 75](/docs/rockchip-iq-tools/assets/en-p075-figure-03.png)

<!-- Source EN PDF p.75, unit 646 -->

Figure 5-3-3

<!-- Source EN PDF p.75, unit 647 -->

4. Table: NxM matrix parameters, the matrix elements may be integer or float, expand by clicking the “Show data” or “Enter Array Table” on the tuning unit.

<!-- Source EN PDF p.75, unit 648 -->

![Technical figure from English PDF, page 75](/docs/rockchip-iq-tools/assets/en-p075-figure-04.png)

<!-- Source EN PDF p.75, unit 649 -->

Figure 5-3-4

<!-- Source EN PDF p.76, unit 650 -->

### 5.4 Online Tuning of Gamma Parameters

<!-- Source EN PDF p.76, unit 651 -->

#### 5.4.1 Gamma Visual Tuning

<!-- Source EN PDF p.76, unit 652 -->

1. As shown in Figure 5-4-1-1, enter the GammaTuningPara page, and click the “Edit Curve” of the Gamma_Curve parameter to open the Gamma visual tuning UI

<!-- Source EN PDF p.76, unit 653 -->

![Technical figure from English PDF, page 76](/docs/rockchip-iq-tools/assets/en-p076-figure-01.png)

<!-- Source EN PDF p.76, unit 654 -->

Figure 5-4-1-1 Gamma UI

<!-- Source EN PDF p.76, unit 655 -->

2. As shown in Figure 5-4-1-2, the Gamma visual tuning UI includes the following functions:

<!-- Source EN PDF p.76, unit 656 -->

1) Curve adjustment area: Drag the red dot with mouse to adjust the curve. When AutoWrite is checked, each adjustment will be set to the board end in real time.

<!-- Source EN PDF p.76, unit 657 -->

2) Curve Coeff: Supports generating Gamma curves based on coefficients. Note that the curves corresponding to the coefficients will be automatically generated after modification here, and the curves originally adjusted manually may be overwritten.

<!-- Source EN PDF p.76, unit 658 -->

3. Position Control: move the mouse on the dot, the coordinates will be updated to the X and Y boxes, we can manually set the Y value of the point.

<!-- Source EN PDF p.76, unit 659 -->

4. Control Point Number: Adjust the number of control points, support four types (49, 45, 24, 13).

<!-- Source EN PDF p.76, unit 660 -->

5. Axis Range: Adjust the scale of the coordinate axis, both X and Y axes support adjustment, mainly used for adjustment of denser areas in dark area nodes.

<!-- Source EN PDF p.76, unit 661 -->

6. Export/Import: Supports exporting Gamma curves as files to save or reading Gamma curves from files.

<!-- Source EN PDF p.77, unit 662 -->

![Technical figure from English PDF, page 77](/docs/rockchip-iq-tools/assets/en-p077-figure-01.png)

<!-- Source EN PDF p.77, unit 663 -->

Figure 5-4-1-2 Gamma visual tuning window

<!-- Source EN PDF p.77, unit 664 -->

#### 5.4.2 Tuning Method of Gamma Curve

<!-- Source EN PDF p.77, unit 665 -->

There are two curves on the axes, the blue one is the original curve, the red one is the current adjustment curve, when the pointer moves to the dot on the red curve, it will be displayed as up and down arrows, you can drag the dot to move up and down, The red curve will change with the position of the point, as shown in Figure 5-4-2-1.

<!-- Source EN PDF p.77, unit 666 -->

![Technical figure from English PDF, page 77](/docs/rockchip-iq-tools/assets/en-p077-figure-02.png)

<!-- Source EN PDF p.77, unit 667 -->

Figure 5-4-2-1 The curve after dragging the dot

<!-- Source EN PDF p.78, unit 668 -->

Modify the “Gamma Coeff” in Curve Coeff to 1.5 and press “Enter”, a new curve will be generated according to the coefficient, as shown in Figure 5-4-2-2

<!-- Source EN PDF p.78, unit 669 -->

![Technical figure from English PDF, page 78](/docs/rockchip-iq-tools/assets/en-p078-figure-01.png)

<!-- Source EN PDF p.78, unit 670 -->

Figure 5-4-2-2 Generate Curves Using Coefficients

<!-- Source EN PDF p.79, unit 671 -->

## 6 Other functions

<!-- Source EN PDF p.79, unit 672 -->

### 6.1 IQ File Import Function

<!-- Source EN PDF p.79, unit 673 -->

Click "File Transfer" - "Send File To Device" in the menu bar, select the IQ file to be transferred, and enter the path to save the IQ file on the device, as shown in Figure 6-1-1, click “Send”, after the transfer complicated, the file can be found in the target path.

<!-- Source EN PDF p.79, unit 674 -->

![Technical figure from English PDF, page 79](/docs/rockchip-iq-tools/assets/en-p079-figure-01.png)

<!-- Source EN PDF p.79, unit 675 -->

Figure 6-1-1 Set Transferring Path

<!-- Source EN PDF p.79, unit 676 -->

![Technical figure from English PDF, page 79](/docs/rockchip-iq-tools/assets/en-p079-figure-02.png)

<!-- Source EN PDF p.79, unit 677 -->

Figure 6-1-2 File Transfer Success

<!-- Source EN PDF p.79, unit 678 -->

### 6.2 Offline Raw Simulation

<!-- Source EN PDF p.79, unit 679 -->

This function is used to import the raw image back to the board, and run the ISP to process it.

<!-- Source EN PDF p.79, unit 680 -->

1. Click “File - Send RAW Image To Device” to open the configuration window

<!-- Source EN PDF p.80, unit 681 -->

![Technical figure from English PDF, page 80](/docs/rockchip-iq-tools/assets/en-p080-figure-01.png)

<!-- Source EN PDF p.80, unit 682 -->

Figure 6-2-1 Open the Raw configuration page

<!-- Source EN PDF p.80, unit 683 -->

2. Click “Add” to load the raw files

<!-- Source EN PDF p.80, unit 684 -->

![Technical figure from English PDF, page 80](/docs/rockchip-iq-tools/assets/en-p080-figure-02.png)

<!-- Source EN PDF p.80, unit 685 -->

Figure 6-2-2 Load Raw image

<!-- Source EN PDF p.80, unit 686 -->

Note: This function only support “.rkraw” format, and the internal data is “compact+align256”. Other formats can be converted in batches using RKRAW Tool. Please also configure “RKRawV2” in “config.ini” to 1 when capture Raw. (For the method of Online Capture of Raw, please refer to the description in Section 3.7.2)

<!-- Source EN PDF p.81, unit 687 -->

3. Click “Send” the Raw image to the device, and this will generate a configuration file under “/tmp”

<!-- Source EN PDF p.81, unit 688 -->

![Technical figure from English PDF, page 81](/docs/rockchip-iq-tools/assets/en-p081-figure-01.png)

<!-- Source EN PDF p.81, unit 689 -->

Figure 6-2-3 Send Raw image to the device

<!-- Source EN PDF p.81, unit 690 -->

5. Don’t close this window and restart the camera app. After the device detects the configuration file, it will switch to the offline simulation mode.

<!-- Source EN PDF p.81, unit 691 -->

6. Click “Run” to start simulation process.

<!-- Source EN PDF p.81, unit 692 -->

7. The raw images are sent to the ISP one by one and the processed images can be seen in the preview of the camera app. In this state it supports: online tuning parameter reading and writing, and capture YUV images.

<!-- Source EN PDF p.81, unit 693 -->

8. If you need to replace the raw file, refer to the following process:

<!-- Source EN PDF p.81, unit 694 -->

1) Click Stop to pause the offline simulation.

<!-- Source EN PDF p.81, unit 695 -->

2) Click Add to load the raw files.

<!-- Source EN PDF p.81, unit 696 -->

3) Click Send to send the raw files.

<!-- Source EN PDF p.81, unit 697 -->

4) Click Run to start the offline simulation.

{% endraw %}
