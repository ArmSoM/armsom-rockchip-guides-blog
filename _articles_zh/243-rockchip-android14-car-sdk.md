---
title: "Rockchip Android14车载SDK：驱动、多屏与配置"
description: "Rockchip Android14车载SDK：驱动、多屏与配置"
excerpt: "Rockchip Android14车载SDK：驱动、多屏与配置"
translation_key: "243-rockchip-android14-car-sdk"
slug: "243-rockchip-android14-car-sdk"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14车载SDK：驱动、多屏与配置

本文介绍Rockchip RK3588M/RK3576M Android14车载SDK新增驱动、功能及常见问题；通用仓库、编译、固件、烧录和分区操作参见Rockchip_Developer_Guide_Android14_SDK_CN.pdf。来源：中文V1.0，RK-YH-YF-725，20页，无配对英文稿。原产品表将两款芯片内核写为Kernel6.10，实际命令使用kernel-6.1，保留并注明此处不一致。硬件示例均为Rockchip EVB，不代表ArmSoM板卡已验证支持或实测；命令作为文档示例保留，未对硬件执行。

## 1.1 代码下载

初始化开发者工作副本；服务器镜像增加--mirror：

```sh
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/vehicle-manifests.git -m Android14_vehicle.xml
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/vehicle-manifests.git -m Android14_vehicle.xml --mirror
```

车载SDK部分仓库切分支并独立manifest XML，大部分代码与平板SDK相同；repo使用、仓库搭建、代码管理和新增lunch的方法一致。原稿称旧地址暂为已有客户维护，后续逐步只维护新地址；这是原稿历史说明，不代表已验证当前地址可用性。

## 1.2 编译

RK3588M AAOS完整编译；仅开发内核时单编boot.img节省时间：

```sh
source build/envsetup.sh && lunch rk3588m_u-userdebug && ./build.sh -AUCKuo

cd kernel-6.1/
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig rk3588_vehicle.config android-14.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3588m_u/boot.img rk3588-vehicle-evb-v22.img
```

RK3576M对应完整编译和单编内核命令：

```sh
source build/envsetup.sh && lunch rk3576m_u-userdebug && ./build.sh -AUCKuo

cd kernel-6.1/
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig rk3576.config rk3576_vehicle.config android-14.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3576m_u/boot.img rk3576-vehicle-evb-v10.img -j32
```

## 2.1 硬件方案

车载EVB采用底板加小板以提高扩展性，原稿版本为RK3588M EVB V22和RK3576M EVB V10。RK3588M支持6块SERDES显示小板、1块AHD摄像小板、2块SERDES摄像小板、1块PCIe或SDIO Wi-Fi小板、1块RK3308音频小板、1块PCIe MODEM/以太网小板，以及板载以太网/GNSS/FM；各模块可单独控制电源，后续EVB可能修改硬件和功能。

![RK3588M车载EVB框图](/docs/rockchip-android14-car-sdk/images/hardware-rk3588m.png)

RK3588M车载EVB框图 - 原稿技术图；PDF页 5 (CN).

原稿下一段仍写“RK3588M”，但配图为RK3576M：3块SERDES显示小板、3块SERDES摄像小板、1块PCIe Wi-Fi小板、1块RK2118音频小板、1块MCU小板、1块PCIe MODEM/以太网小板、板载以太网/GNSS/FM及各模块独立电源控制。注明此型号标签不一致，不静默改写归属。

![RK3576M车载EVB框图](/docs/rockchip-android14-car-sdk/images/hardware-rk3576m.png)

RK3576M车载EVB框图 - 原稿技术图；PDF页 5 (CN).

## 2.2.1 新增显示驱动

底板/小板方案对外围设备开放，软件已支持大部分模块，新模块或未调试驱动后续更新。显示SERDES在内核和U-Boot中重新设计，路径drivers/mfd/display-serdes/，目标是兼容各类SERDES方案；MAXIM、ROHM和Rockchip方案已有调试，代码仍持续完善。

```text
drivers/mfd/display-serdes/maxim/
  maxim-max96745.c
  maxim-max96752.c
  maxim-max96755.c
  maxim-max96772.c
  maxim-max96789.c

drivers/mfd/display-serdes/rohm/
  rohm-bu18rl82.c
  rohm-bu18tl82.c

drivers/mfd/rkx110_x120/
  rkx110.c
  rkx120.c
```

MAXIM DSI方案：max96755/max96789 + max96772/max96752；eDP/DP：max96745/max96749 + max96752（max96749出现在文字中，不在所列驱动文件里）。RK3588M已实现max96789+max96752二进二出及max96745+max96752一进二出，可降低SERDES成本。ROHM方案中RK3588/RK3576 DSI直接接bu18tl82，DP/eDP经LT7911转LVDS后接bu18tl82。下列更新DTSI依次为MAXIM一进一出、MAXIM二进二出/一进二出分屏、ROHM一进一出参考。

```text
/* 以下dtsi支持了MAXIM方案的一进一出的基础方案*/
arch/arm64/boot/dts/rockchip/rk3588-vehicle-serdes-mfd-display-maxim.dtsi
arch/arm64/boot/dts/rockchip/rk3576-vehicle-serdes-mfd-display-maxim.dtsi
/* 以下dtsi支持了MAXIM方案的二进二出和一进二出的一拖二方案*/
arch/arm64/boot/dts/rockchip/rk3588-vehicle-serdes-mfd-display-maxim-split.dtsi
/* 以下dtsi支持了ROHM方案的一进一出的基础方案*/
arch/arm64/boot/dts/rockchip/rk3588-vehicle-serdes-mfd-display-rohm.dtsi
arch/arm64/boot/dts/rockchip/rk3576-vehicle-serdes-mfd-display-rohm.dtsi
```

原稿进一步参考：Rockchip_Developer_Guide_Android_Car_MultiDisplay_CN.pdf。

## 2.2.2 摄像模块

RK3588M支持AHD NVP6188及MAXIM/THINE SERDES摄像小板，RK3576M仅支持SERDES。NVP6188 AHD、THINE thcv244/thcv241、MAXIM max96714/max96712/max96722方案均支持四路1080P@30输入。THINE当前驱动绑定特定摄像模块，更换后需厂家更新初始化序列。

```text
kernel/drivers/media/i2c/nvp6188.c
kernel/drivers/media/i2c/thcv244.c
kernel/drivers/media/i2c/max96714.c
kernel/drivers/media/i2c/max96712.c
kernel/drivers/media/i2c/max96722.c
```

```text
/*dts for vehicle quick reverse function*/
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-image-reverse.dtsi
/*dts for camera des max96712*/
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-maxim-max96712.dtsi
/*dts for camera des max96722*/
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-maxim-max96722.dtsi
/*dts for ahd camera switch nvp6188*/
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-mipi-nvp6188.dtsi
/*dts for camera des thcv244*/
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-thine_thcv244.dtsi
```

## 2.2.3 网络模块

车规Wi-Fi/BT支持PCIe CYW89459及SDIO CYW88373，蓝牙均为UART，通过小板使用。RK3588M EVB V20起底板支持百兆Realtek RTL9010A PHY和N303 GNSS（标准串口）。支持RM310 PCIe4G，但部分Android代码不兼容，未默认提交SDK，可单独提供补丁。

```text
kernel/drivers/net/wireless/rockchip_wlan/infineon/
kernel/drivers/net/wireless/rockchip_wlan/cywdhd/
kernel/drivers/net/phy/realtek.c
hardware/techtotop/gnss
hardware/techtotop/gps
```

## 2.2.4 音频模块

RK3308/RK2118音频小板支持8个喇叭、4个MIC，作为独立RTOS系统运行并需烧录固件，原稿计划后续改主控烧录。支持基本播放、录音、语音唤醒、蓝牙通话及多屏异声，例如四屏四声。主控暂用simple-card.c，计划后续SPI音频驱动用于固件、握手和寄存器配置；Audio HAL负责声卡通路切换。

```text
kernel/sound/soc/generic/simple-card.c
android/hardware/rockchip/audio/alsa_hal
```

## 2.3.1 AAOS支持

新增功能以RK3588M为例，RK3576M同理。平板SDK为AOSP，车载SDK为AAOS，适配Android14车载UI及多用户，区分驾驶员/乘客权限，支持多显示、触摸、背光、音区和仪表；尚需补丁的部分原稿称通过REDMINE提供。驾驶员与乘客可独立操作。上层API按Google标准，原稿参考https://source.android.com/docs/devices/automotive。Car API含CarSensorManager，路径/platform/packages/services/Car/car-lib；CarService位于packages/services/Car/，APK位于packages/apps/Car/，OEM车辆属性接口位于hardware/interfaces/automotive/vehicle/；EVS用于倒车及AVM。

![Vehicle HAL与Android Automotive架构](/docs/rockchip-android14-car-sdk/images/aaos.png)

Vehicle HAL与Android Automotive架构 - 原稿技术图；PDF页 9 (CN).

## 2.3.2 多屏异显及背光

RK3588M U-Boot支持DP/eDP SPLIT，可六屏异显及LOGO1–LOGO6；更多LOGO降低启动速度，默认只开两路DSI LOGO，其余在DTS开启。RK3576M默认三屏异显/三LOGO。AAOS一个用户对应一个屏幕，内核DTS、HWC及XML已适配异显。RK3588默认最多六屏，产品须修改下列XML；显示ID和背光路径默认配套EVB，也须按产品调整。

```text
device/rockchip/rk3588/rk3588m_u/displays/HwComposerEnv-multidisplay.xml
device/rockchip/rk3588/rk3588m_u/displays/display_settings.xml
```

```xml
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<display-settings>
<config identifier="1" />
<display
name="port:0"
backlightPath="/sys/class/backlight/backlight/brightness" />
<display
name="port:1"
shouldShowSystemDecors="true"
shouldShowIme="true"
forcedDensity="160"
backlightPath="/sys/class/backlight/edp2lvds_backlight0/brightness" />
<display
name="port:2"
shouldShowSystemDecors="true"
shouldShowIme="true"
forcedDensity="160"
backlightPath="/sys/class/backlight/dsi2lvds_backlight1/brightness" />
<display
name="port:3"
shouldShowSystemDecors="true"
shouldShowIme="true"
forcedDensity="160"
backlightPath="/sys/class/backlight/dp2lvds_backlight0/brightness" />
<display
name="port:4"
shouldShowSystemDecors="true"
shouldShowIme="true"
forcedDensity="160"
backlightPath="/sys/class/backlight/edp2lvds_backligh1/brightness" />
<display
name="port:5"
shouldShowSystemDecors="true"
shouldShowIme="true"
forcedDensity="160"
backlightPath="/sys/class/backlight/dp2lvds_backlight1/brightness" />
</display-settings>
```

原稿一处节点为edp2lvds_backligh1，backlight缺末尾t；原样保留，须按实际DTS核对。

## 2.3.3 多触摸

input-port-associations.xml将显示physicalPort绑定触摸设备名称；EVB示例支持六屏六触摸，产品按实际映射填写。

```xml
device/rockchip/rk3588/rk3588m_u/displays/input-port-associations.xml
<ports>
<port display="0" input="himax-2-0048/input0" /> #DSI0 720P
<port display="1" input="ili210x-5-0041/input0" /> #EDP0 1080P
<port display="2" input="himax-6-0048/input0" /> #DSI1 720P
<port display="3" input="himax-4-0048/input0" /> #DP0 720P
<port display="241" input="ili210x-7-0041/input0" /> #EDP1 1080P
<port display="243" input="himax-8-0048/input0" /> #DP1 720P
</ports>
```

## 2.3.4 多音区

发布版本默认四音区，仅已配置音区的Occupant可独立播放音视频；更多Occupant需增加音区，配置输出设备及音区/Occupant映射。参考Rockchip_Developer_Guide_Android14_Car_Audio_CN.pdf。

```text
device/rockchip/rk3588/rk3588m_u/audio/car_audio_configuration.xml
device/rockchip/rk3588/rk3588m_u/audio/audio_policy_configuration.xml
```

## 2.3.5 EVS

EVS（增强型视觉系统）是Android Automotive用于快速倒车和环视的框架。原稿提醒Google EVS未实现文档所述全部功能，此源码状态不支持Camera Group和Logical Multi-camera。

![EVS架构](/docs/rockchip-android14-car-sdk/images/evs.png)

EVS架构 - 原稿技术图；PDF页 11 (CN).

```text
hardware/interfaces/automotive/evs #HIDL接口
├── 1.0
├── 1.1
├── common
└── OWNERS
packages/services/Car/cpp/evs/ #EVS实现
├── Android.bp
├── apps #Native C++ 示例应用，支持环视，快速倒车
├── manager #EVS服务，AAOS官方源码
├── OWNERS
├── sampleDriver #EVS HAL具体实现，已经适配 RK3588 VICAP 接口
└── support_library #可用于算法实现，目前不使用
packages/services/Car/tests/CarEvsCameraPreviewApp #默认Java层EVS示例APK
packages/services/Car/tests/SampleRearViewCamera/ #示例倒车APK
device/rockchip/rk3588/rk3588m_u/overlay/packages/services/Car/service/res/values/config.xml
```

automotive/evs下为HIDL接口。C++实现中apps为环视/快速倒车原生示例，manager为AAOS官方服务，sampleDriver为适配RK3588 VICAP的EVS HAL，support_library可用于算法但当前未用。CarEvsCameraPreviewApp是默认Java EVS示例，SampleRearViewCamera为倒车示例；config.xml为产品overlay。参考Rockchip_Developer_Guide_Automotive_Camera.pdf。

## 2.3.6 AVM环视

RK3588M支持四路或八路AVM，默认四摄像头。主代码在Camera360及common/产品device目录；旧版APK可在avm_settings.xml调整摄像头ID，BOARD_CAMERA360_SUPPORT控制环视开关。参考Rockchip_Developer_Guide_Around_View_Monitor_CN.pdf。

```text
packages/apps/Camera360/
device/rockchip/common/
device/rockchip/rk3588/
packages/apps/Camera360/AppData_rk/avm_settings.xml
```

```xml
<?xml version="1.0"?>
<rk_avm_algo>
<camera>
<camera_number>4</camera_number>
<car_model>/data/AppData_rk/Content/models/ferrari.dae</car_model>
<calib_result>/data/AppData_rk/output</calib_result>
<file_content>/data/AppData_rk/Content</file_content>
<camera1>
<dev_id>0</dev_id>
</camera1>
<camera2>
<dev_id>1</dev_id>
</camera2>
<camera3>
<dev_id>2</dev_id>
</camera3>
<camera4>
<dev_id>3</dev_id>
</camera4>
</camera>
</rk_avm_algo>
```

```make
BOARD_CAMERA360_SUPPORT := true
```

## 2.3.7 内核快速倒车

RK3588M默认在Android启动前进入内核快速倒车再退出，实际产品按场景触发。启用下列配置并在DTS指定video_port/图层；仅支持DVP/MIPI的YUV摄像头，不支持RAW。内核方案截获数据流导致EVS HAL无法获取，因此本版与EVS快速倒车二选一；内核启动快，EVS灵活，兼容是后续计划而非本版能力。参考Rockchip_Android_Fast_Reverse_Image_System_Developer_Guide_CN.pdf。

```text
kernel/drivers/video/rockchip/vehicle/
kernel/drivers/phy/rockchip/
kernel/drivers/gpu/drm/rockchip/
```

```text
CONFIG_ROCKCHIP_DRM_DIRECT_SHOW=y
CONFIG_VIDEO_REVERSE_IMAGE=y
```

```dts
vehicle,crtc_name = "video_port3";
vehicle,plane_name = "Esmart3-win0";
```

## 3.1 DTS配置

选择与硬件匹配的板级DTS。RK3588M V10为单PMIC，V20/V21/V22为双PMIC。默认V10：六ROHM显示、NVP6188四摄像头、PCIe Wi-Fi、RK3308音频、内核倒车；V20将Wi-Fi改SDIO；V21/V22：四ROHM显示带触摸、MAX96712四摄像头、PCIe Wi-Fi、RK3308音频、EVS倒车。RK3576M V10：三MAXIM显示带触摸、MAX96712四摄像头、PCIe Wi-Fi、RK2118音频、EVS倒车。

```text
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v10.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v20.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v21.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v22.dts
kernel/arch/arm64/boot/dts/rockchip/rk3576-vehicle-evb-v10.dts
```

小板可替换；RK3576M显示SERDES从MAXIM换ROHM时修改如下include，其它模块同样按硬件选择。

```diff
--- a/arch/arm64/boot/dts/rockchip/rk3576-vehicle-evb-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3576-vehicle-evb-v10.dts
@@ -8,7 +8,7 @@
#include "rk3576-vehicle-evb.dtsi"
#include "rk3576-vehicle-evb-v10-nca9539-io-expander.dtsi"
-#include "rk3576-vehicle-serdes-mfd-display-maxim.dtsi"
+#include "rk3576-vehicle-serdes-mfd-display-rohm.dtsi"
#include "rk3576-vehicle-evb-maxim-max96712-dphy0.dtsi"
#include "rk3576-android.dtsi"
```

## 3.2 多屏异显配置

产品屏幕数量和接口可能不同于EVB，补丁示例从六屏改四屏。Mode：0=None同显，1=Slicing拼接，2=Presentation异显。ConnectorCnt为系统内部注册Connector数量，异显仅配置Type/TypeId，其它无需设置；原稿称指定Connector使用分割屏幕显示。元素DsiplayMode原拼写保留。进一步参考原稿写作“DrmHwc2多屏拼接异显功能说明.pd”。

```diff
--- a/rk3588m_u/HwComposerEnv-multidisplay.xml
+++ b/rk3588m_u/HwComposerEnv-multidisplay.xml
@@ -31,8 +31,7 @@
| 3840 | 1920 | - FbWidth = 5760
- ConnectorCnt = 4
-->
- <DsiplayMode Mode="2" FbWidth="0" FbHeight="0" ConnectorCnt="2">
- <Connector>
+ <DsiplayMode Mode="2" FbWidth="0" FbHeight="0" ConnectorCnt="0">
<!--
Example 1 - Slicing-6x1 1920x1080:
Type-TypeId can be obtained through the following process:
@@ -74,28 +73,5 @@
Type-TypeId = DSI-1
Type-TypeId = DSI-2
-->
- <Type>DP</Type>
- <TypeId>1</TypeId>
- <SrcX>0</SrcX> <!-- Framebuffer x 0ffset -->
- <SrcY>0</SrcY> <!-- Framebuffer y 0ffset -->
- <SrcW>0</SrcW> <!-- Framebuffer Width -->
- <SrcH>0</SrcH> <!-- Framebuffer Height-->
- <DstX>0</DstX> <!-- unuse , reserved -->
- <DstY>0</DstY> <!-- unuse , reserved -->
- <DstW>0</DstW> <!-- unuse , reserved -->
- <DstH>0</DstH> <!-- unuse , reserved -->
- </Connector>
- <Connector>
- <Type>eDP</Type>
- <TypeId>1</TypeId>
- <SrcX>0</SrcX> <!-- Framebuffer x 0ffset -->
- <SrcY>0</SrcY> <!-- Framebuffer y 0ffset -->
- <SrcW>0</SrcW> <!-- Framebuffer Width -->
- <SrcH>0</SrcH> <!-- Framebuffer Height-->
- <DstX>0</DstX> <!-- unuse , reserved-->
- <DstY>0</DstY> <!-- unuse , reserved-->
- <DstW>0</DstW> <!-- unuse , reserved-->
- <DstH>0</DstH> <!-- unuse , reserved-->
- </Connector>
</DsiplayMode>
</HwComposerEnv>
```

## 3.3 Android板级配置

BoardConfig.mk须匹配EVB模块，脚本按PRODUCT_KERNEL_DTS复制不同文件，产品可同样处理。示例V21选相应HWC、EVS配置和MAX96712-TXD，否则选默认HWC及V20/NVP6188-AHD配置。编V21时如下修改DTS并将SDIO Wi-Fi片段换PCIe片段。原示例仍为android-11.config，虽本文是Android14指南，须按实际分支核对。

```make
ifeq ($(strip $(PRODUCT_KERNEL_DTS)), rk3588-vehicle-evb-v21)
PRODUCT_COPY_FILES += $(LOCAL_PATH)/HwComposerEnv-four-multidisplay.xml:vendor/etc/HwComposerEnv-multidisplay.xml
PRODUCT_PROPERTY_OVERRIDES += persist.vendor.rockchip.evs.cam=MAX96712-TXD
PRODUCT_COPY_FILES += $(LOCAL_PATH)/evs/evs_configuration_v21.xml:$(TARGET_COPY_OUT_VENDOR)/etc/automotive/evs/evs_configuration_override.xml
else
PRODUCT_COPY_FILES += $(LOCAL_PATH)/HwComposerEnv-multidisplay.xml:vendor/etc/HwComposerEnv-multidisplay.xml
PRODUCT_PROPERTY_OVERRIDES += persist.vendor.rockchip.evs.cam=NVP6188-AHD
PRODUCT_COPY_FILES += $(LOCAL_PATH)/evs/evs_configuration_v20.xml:$(TARGET_COPY_OUT_VENDOR)/etc/automotive/evs/evs_configuration_override.xml
endif
```

```diff
diff --git a/rk3588m_u/BoardConfig.mk b/rk3588m_u/BoardConfig.mk
index 5978929..d7e278a 100755
--- a/rk3588m_u/BoardConfig.mk
+++ b/rk3588m_u/BoardConfig.mk
@@ -39,8 +39,8 @@ ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
endif
PRODUCT_UBOOT_CONFIG := rk3588-ab
-PRODUCT_KERNEL_DTS := rk3588-vehicle-evb-v20
-PRODUCT_KERNEL_CONFIG := rockchip_defconfig android-11.config sdio_wifi_cywdhd.config
+PRODUCT_KERNEL_DTS := rk3588-vehicle-evb-v21
+PRODUCT_KERNEL_CONFIG := rockchip_defconfig android-11.config pcie_wifi_infineon.config
PRODUCT_KERNEL_CONFIG += rk3588_vehicle.config
```

## 3.4 多用户配置

产品Car服务overlay配置多用户开关、最大occupant数和屏幕/occupant绑定；display_settings.xml配置各屏name、背光。所有副屏都须配置，name例如port:4的ID必须与config_occupant_display_mapping中displayPort一致，否则occupant找不到display。两处必须采用dumpsys display所见address，例如address{port=3}，不能随意指定。backlightPath按DTS匹配；原稿将/sys/class/backlight/dp2lvds_backlight0/brightness作为DSI示例。init.car.rc须赋予所有背光节点权限。

```text
device/rockchip/rk3588/rk3588m_u/overlay/packages/services/Car/service/res/values/config.xml
device/rockchip/common/display_settings.xml
device/rockchip/rk3588/rk3588m_u/init.car.rc
```

```text
on boot
# backlight
chown system system /sys/class/backlight/backlight/brightness
chown system system /sys/class/backlight/dp2lvds_backlight0/brightness
chown system system /sys/class/backlight/dp2lvds_backlight1/brightness
chown system system /sys/class/backlight/dsi2lvds_backlight1/brightness
chown system system /sys/class/backlight/edp2lvds_backlight0/brightness
chown system system /sys/class/backlight/edp2lvds_backlight1/brightness
```

各用户sdcard目录为/mnt/pass_through/{userId}/emulated/{userId}。

## 3.5 多用户调试

查看用户及Car服务，并注入VHAL事件模拟车辆输入。

```sh
pm list users
dumpsys car_service
dumpsys car_service inject-vhal-event {Vhal_prop_ID} {Vhal_prop_value}
```

## 3.6 data文件系统

谨慎评估ext4与f2fs优缺点，SDK的data默认f2fs。原稿参考https://blog.csdn.net/weixin_43245753/article/details/124427177，并给出下列ext4示例。修改涉及格式化、加密和checkpoint行为，烧录前备份数据并验证产品。还须修改recovery.fstab，A/B固件则修改recovery.fstab_AB。原diff标签混用rk3588_s与rk3588m_u，作为历史示例保留，不代表其它产品应直接采用该目标。

```diff
device/rockchip/common$ git diff
diff --git a/scripts/fstab_tools/fstab.in b/scripts/fstab_tools/fstab.in
index 6e78b00..a658332 100755
--- a/scripts/fstab_tools/fstab.in
+++ b/scripts/fstab_tools/fstab.in
@@ -20,6 +20,6 @@ ${_block_prefix}system_ext /system_ext ext4 ro,barrier=1 ${_flags},first_stage_
# For sdmmc
/devices/platform/${_sdmmc_device}/mmc_host* auto auto defaults voldmanaged=sdcard1:auto
# Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065 latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,quota,formattable,reservedsize=128M,checkpoint=fs
+#/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065 latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,quota,formattable,reservedsize=128M,checkpoint=fs
# for ext4
-#/dev/block/by-name/userdata /data ext4 discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1 latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M,checkpoint=block
+/dev/block/by-name/userdata /data ext4 discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1 latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M,checkpoint=block
```

```diff
device/rockchip/rk3588$ git diff
diff --git a/rk3588_s/recovery.fstab b/rk3588m_u/recovery.fstab
index 7532217..cf789ac 100755
--- a/rk3588_s/recovery.fstab
+++ b/rk3588_s/recovery.fstab
@@ -7,7 +7,7 @@
/dev/block/by-name/odm /odm ext4 defaults defaults
/dev/block/by-name/cache /cache ext4 defaults defaults
/dev/block/by-name/metadata /metadata ext4 defaults defaults
-/dev/block/by-name/userdata /data f2fs defaults defaults
+/dev/block/by-name/userdata /data ext4 defaults defaults
/dev/block/by-name/cust /cust ext4 defaults defaults
/dev/block/by-name/custom /custom ext4 defaults defaults
/dev/block/by-name/radical_update /radical_update ext4 defaults
```

## 3.7 移除多用户

步骤1：在device/rockchip/common/car/packages_car.mk关闭headless-system-user属性。

```diff
diff --git a/car/packages_car.mk b/car/packages_car.mk
index 458afa9..a580f50 100644
--- a/car/packages_car.mk
+++ b/car/packages_car.mk
@@ -79,7 +79,7 @@ PRODUCT_SYSTEM_DEFAULT_PROPERTIES += \
# Enable headless system user mode
PRODUCT_SYSTEM_DEFAULT_PROPERTIES += \
- ro.fw.mu.headless_system_user?=true
+ ro.fw.mu.headless_system_user?=false
# Enable user pre-creation
PRODUCT_SYSTEM_DEFAULT_PROPERTIES += \
```

步骤2：在下列Car服务overlay关闭enablePassengerSupport与enableProfileUserAssignmentForMultiDisplay。完成前两步后，多屏仍异显但共用同一用户，不同屏只能打开不同应用，不能各开同一应用。若需要同显，继续步骤3–4。

```text
device/rockchip/common/car/overlay/packages/services/Car/service/res/values/config.xml
```

```diff
diff --git a/car/overlay/packages/services/Car/service/res/values/config.xml b/car/overlay/packages/services/Car/service/res/values/config.xml
index b33e8664..e0ee6213 100644
--- a/car/overlay/packages/services/Car/service/res/values/config.xml
+++ b/car/overlay/packages/services/Car/service/res/values/config.xml
@@ -101,11 +101,11 @@
<!-- Configuration to enable passenger support.
If this is set to true and there is a passenger display, a user can
login to the passenger
display and use it as a normal Android user. -->
- <bool name="enablePassengerSupport">true</bool>
+ <bool name="enablePassengerSupport">false</bool>
<!-- Enable profile user assignment per each CarOccupantZone for per
display android user
assignments. This feature is still experimental. -->
- <bool name="enableProfileUserAssignmentForMultiDisplay" translatable="false">true</bool>
+ <bool name="enableProfileUserAssignmentForMultiDisplay" translatable="false">false</bool>
<!-- A name of a camera device that provides the rearview through EVS
service -->
<string name="config_evsRearviewCameraId" translatable="false">0</string>
```

步骤3：默认副屏有SecondaryBottomSystemBar，在乘客SystemUI overlay关闭config_enableBottomSystemBar。

```text
device/rockchip/common/car/overlay/packages/services/Car/car_product/rro/CarSystemUIPassengerRRO/res/values/config.xml
```

```diff
diff --git a/car/overlay/packages/services/Car/car_product/rro/CarSystemUIPassengerRRO/res/values/config.xml b/car/overlay/packages/services/Car/car_product/rro/CarSystemUIPassengerRRO/res/values/config.xml
index dd7d86b9..a1932cf7 100644
--- a/car/overlay/packages/services/Car/car_product/rro/CarSystemUIPassengerRRO/res/values/config.xml
+++ b/car/overlay/packages/services/Car/car_product/rro/CarSystemUIPassengerRRO/res/values/config.xml
@@ -18,6 +18,5 @@
<bool name="config_enableTopSystemBar">false</bool>
<bool name="config_enableLeftSystemBar">false</bool>
<bool name="config_enableRightSystemBar">false</bool>
- <bool name="config_enableBottomSystemBar">true</bool>
+ <bool name="config_enableBottomSystemBar">false</bool>
</resources>
```

步骤4：移除Secondary Home，将默认副屏异显改同显，按原补丁从packages_car.mk移除MultiDisplaySecondaryHomeTestLauncher。

```diff
diff --git a/car/packages_car.mk b/car/packages_car.mk
index 6c820a44..e77e75ce 100644
--- a/car/packages_car.mk
+++ b/car/packages_car.mk
@@ -164,7 +164,7 @@ PRODUCT_PACKAGES += \
libcarservicehelperjni \
com.android.car.procfsinspector \
com.android.permission \
- MultiDisplaySecondaryHomeTestLauncher \
+ # MultiDisplaySecondaryHomeTestLauncher \
# RROs
PRODUCT_PACKAGES += \
```

{% endraw %}
