---
title: "Rockchip Android14 automotive SDK: drivers, displays and configuration"
description: "Rockchip Android14 automotive SDK: drivers, displays and configuration"
excerpt: "Rockchip Android14 automotive SDK: drivers, displays and configuration"
translation_key: "243-rockchip-android14-car-sdk"
slug: "243-rockchip-android14-car-sdk"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14 automotive SDK: drivers, displays and configuration

This guide describes the Rockchip RK3588M/RK3576M Android14 automotive SDK, focusing on additional drivers, functions and common problems. Common repository, build, firmware, flashing and partition procedures follow Rockchip_Developer_Guide_Android14_SDK_CN.pdf. Source: Chinese V1.0,RK-YH-YF-725,20 pages; no paired English source. The source product table says Kernel6.10 for both chips, but commands use kernel-6.1; both are retained as a source inconsistency. Hardware examples are Rockchip EVBs, not verified ArmSoM board support or tests. Commands are documentary examples and have not been executed against hardware.

## 1.1 Source download

Initialize a developer checkout, or add --mirror for a server mirror:

```sh
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/vehicle-manifests.git -m Android14_vehicle.xml
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/vehicle-manifests.git -m Android14_vehicle.xml --mirror
```

Some automotive repositories use separate branches and a separate manifest XML, but most code matches the tablet SDK. repo usage, repository hosting, code management and adding lunch targets are identical. The source states that the old address was temporarily maintained for existing customers and would gradually be replaced by the new address; this is a historical statement, not a current availability check.

## 1.2 Building

Full AAOS build for RK3588M; for kernel-only development rebuild boot.img to save time:

```sh
source build/envsetup.sh && lunch rk3588m_u-userdebug && ./build.sh -AUCKuo

cd kernel-6.1/
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig rk3588_vehicle.config android-14.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3588m_u/boot.img rk3588-vehicle-evb-v22.img
```

The corresponding RK3576M full and kernel-only commands are:

```sh
source build/envsetup.sh && lunch rk3576m_u-userdebug && ./build.sh -AUCKuo

cd kernel-6.1/
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig rk3576.config rk3576_vehicle.config android-14.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3576m_u/boot.img rk3576-vehicle-evb-v10.img -j32
```

## 2.1 Hardware architecture

The automotive EVBs use a baseboard plus daughtercards for extensibility. The source versions are RK3588M EVB V22 and RK3576M EVB V10. RK3588M supports six SERDES display cards, one AHD camera card, two SERDES camera cards, one PCIe or SDIO Wi-Fi card, one RK3308 audio card, one PCIe modem/Ethernet card, and onboard Ethernet/GNSS/FM. Each module can be powered separately. Future EVB revisions may change these capabilities.

![RK3588M automotive EVB block diagram](/docs/rockchip-android14-car-sdk/images/hardware-rk3588m.png)

RK3588M automotive EVB block diagram - Original source figure; PDF page 5 (CN).

The next paragraph is also labelled RK3588M in the source, but accompanies the RK3576M diagram: three SERDES display cards, three SERDES camera cards, one PCIe Wi-Fi card, one RK2118 audio card, one MCU card, one PCIe modem/Ethernet card, onboard Ethernet/GNSS/FM and individual module power control. The label discrepancy is preserved rather than silently attributing it to another chip.

![RK3576M automotive EVB block diagram](/docs/rockchip-android14-car-sdk/images/hardware-rk3576m.png)

RK3576M automotive EVB block diagram - Original source figure; PDF page 5 (CN).

## 2.2.1 Additional display drivers

The baseboard/daughtercard design is open to peripheral extensions. Most modules are supported; new or untested drivers are deferred to later releases. Display SERDES was redesigned under drivers/mfd/display-serdes/ in both kernel and U-Boot, with the goal of accommodating all SERDES solutions. MAXIM, ROHM and Rockchip solutions have been debugged; further improvement remains ongoing.

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

MAXIM DSI: max96755/max96789 + max96772/max96752. eDP/DP: max96745/max96749 + max96752 (max96749 is named in prose, not the listed driver files). RK3588M implements two-input/two-output max96789+max96752 and one-input/two-output max96745+max96752, reducing SERDES cost. ROHM: RK3588/RK3576 DSI feeds bu18tl82 directly; DP/eDP goes through LT7911 to LVDS and then bu18tl82. The following updated DTSI references provide MAXIM one-to-one, MAXIM split two-to-two/one-to-two, and ROHM one-to-one configurations respectively.

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

Further source reference: Rockchip_Developer_Guide_Android_Car_MultiDisplay_CN.pdf.

## 2.2.2 Camera modules

RK3588M supports AHD NVP6188 and SERDES MAXIM/THINE camera daughtercards; RK3576M supports SERDES only. NVP6188 AHD, THINE thcv244/thcv241 and MAXIM max96714/max96712/max96722 each support four1080P@30 inputs. The THINE driver is bound to a particular camera module; changing the module requires an updated initialization sequence from THINE.

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

## 2.2.3 Network modules

Automotive Wi-Fi/BT options are PCIe CYW89459 and SDIO CYW88373; both use UART Bluetooth and daughtercards. From RK3588M EVB V20, the baseboard supports the100-Mbit Realtek RTL9010A PHY and N303 GNSS over a standard serial port. RM310 PCIe4G is supported, but incompatible Android code is not submitted by default in the SDK; a separate patch can be supplied.

```text
kernel/drivers/net/wireless/rockchip_wlan/infineon/
kernel/drivers/net/wireless/rockchip_wlan/cywdhd/
kernel/drivers/net/phy/realtek.c
hardware/techtotop/gnss
hardware/techtotop/gps
```

## 2.2.4 Audio modules

RK3308/RK2118 audio daughtercards provide eight speakers and four microphones. The audio chip runs an independent RTOS system and needs firmware flashing; host-driven flashing was planned. Supported basics include playback, recording, voice wakeup, Bluetooth calling and separate audio per display, e.g.four screens/four audio streams. The host currently uses simple-card.c; a future SPI audio driver was planned for firmware, handshaking and register configuration. Audio HAL switches sound-card routes.

```text
kernel/sound/soc/generic/simple-card.c
android/hardware/rockchip/audio/alsa_hal
```

## 2.3.1 AAOS support

New-function examples use RK3588M and apply analogously to RK3576M. The tablet SDK uses AOSP; the automotive SDK uses AAOS with Android14 automotive UI and multiuser support, separating driver/passenger permissions. Multiple displays, touch panels, backlights, audio zones and a cluster are supported; patches still needed were supplied through REDMINE. Driver and passengers can operate independently. Upper APIs follow Google standards; source reference: https://source.android.com/docs/devices/automotive. Car API includes CarSensorManager at /platform/packages/services/Car/car-lib. CarService is packages/services/Car/, APKs packages/apps/Car/, and the OEM vehicle-property interface is hardware/interfaces/automotive/vehicle/. EVS serves reversing and AVM.

![Vehicle HAL and Android Automotive architecture](/docs/rockchip-android14-car-sdk/images/aaos.png)

Vehicle HAL and Android Automotive architecture - Original source figure; PDF page 9 (CN).

## 2.3.2 Independent displays and backlights

RK3588M U-Boot supports DP/eDP SPLIT, enabling six independent screens and LOGO1–LOGO6. More logos slow boot, so only two DSI logos are enabled by default; enable others in DTS. RK3576M defaults to three displays/three logos. AAOS associates a user with a display; kernel DTS,HWC and XML were adapted for independent output. RK3588 defaults to at most six screens; adapt the following XML for the product. Display IDs and backlight paths default to the EVB and must likewise be adapted.

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

The source spells one node edp2lvds_backligh1, without the final t in backlight; retained as written and to be checked against the actual DTS.

## 2.3.3 Multiple touch panels

input-port-associations.xml binds a display physicalPort to its touch-device name. The EVB example supports six screens/six touch panels; use the actual product mappings.

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

## 2.3.4 Multiple audio zones

The release configures four audio zones: only occupants with configured zones can independently play audio/video. Add zones for more occupants; specify output devices and each zone-to-occupant mapping. Refer to Rockchip_Developer_Guide_Android14_Car_Audio_CN.pdf.

```text
device/rockchip/rk3588/rk3588m_u/audio/car_audio_configuration.xml
device/rockchip/rk3588/rk3588m_u/audio/audio_policy_configuration.xml
```

## 2.3.5 EVS

EVS (Enhanced View System) is the Android Automotive framework for early reversing and surround view. The source warns that Google EVS does not implement every documented feature: Camera Group and Logical Multi-camera are unsupported in this source snapshot.

![EVS architecture](/docs/rockchip-android14-car-sdk/images/evs.png)

EVS architecture - Original source figure; PDF page 11 (CN).

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

HIDL interfaces are under automotive/evs. In the C++ implementation, apps contains native surround-view/reversing samples, manager is the upstream AAOS service, sampleDriver is the EVS HAL adapted to RK3588 VICAP, and support_library is an unused algorithm extension point. CarEvsCameraPreviewApp is the default Java EVS sample; SampleRearViewCamera is a reversing example. config.xml is the product overlay. Reference: Rockchip_Developer_Guide_Automotive_Camera.pdf.

## 2.3.6 AVM surround view

RK3588M supports four- or eight-camera AVM, default four cameras. Main code resides in Camera360 and common/product device directories. Older APKs allow camera-ID adjustment through avm_settings.xml. BOARD_CAMERA360_SUPPORT enables/disables AVM. Reference: Rockchip_Developer_Guide_Around_View_Monitor_CN.pdf.

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

## 2.3.7 Kernel early reversing

RK3588M enters and then exits kernel reversing before Android starts by default; real products trigger it according to the scenario. Enable the following options and select the video_port/plane in DTS. Only YUV cameras are supported, not RAW, over DVP or MIPI. Kernel reversing intercepts the stream so EVS HAL cannot obtain it: these implementations are mutually exclusive in this release. Kernel mode starts faster, EVS is more flexible; coexistence was planned, not delivered here. Reference: Rockchip_Android_Fast_Reverse_Image_System_Developer_Guide_CN.pdf.

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

## 3.1 DTS configuration

Select a board DTS matching the hardware. RK3588M V10 uses one PMIC; V20/V21/V22 use two. Defaults: V10 has six ROHM displays,NVP6188 four cameras,PCIe Wi-Fi,RK3308 audio,kernel reversing; V20 changes Wi-Fi to SDIO; V21/V22 use four ROHM displays with touch,MAX96712 four cameras,PCIe Wi-Fi,RK3308 audio,EVS reversing. RK3576M V10 uses three MAXIM displays with touch,MAX96712 four cameras,PCIe Wi-Fi,RK2118 audio,EVS reversing.

```text
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v10.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v20.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v21.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v22.dts
kernel/arch/arm64/boot/dts/rockchip/rk3576-vehicle-evb-v10.dts
```

Daughtercards can be replaced. To change RK3576M display SERDES from MAXIM to ROHM, change the include below. Configure other modules similarly according to hardware.

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

## 3.2 Independent display configuration

Products may differ from the EVB in screen count and interfaces. The patch reduces six displays to four. Mode:0=None mirrors screens,1=Slicing stitches screens,2=Presentation uses independent screens. ConnectorCnt is the number of internally registered connectors. Presentation requires only Type/TypeId; other settings are unnecessary. The source calls this selecting connectors for split-screen display. The literal element name DsiplayMode is retained. Further reference is spelled “DrmHwc2多屏拼接异显功能说明.pd” in the source.

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

## 3.3 Android board configuration

BoardConfig.mk must match the EVB modules. Scripts copy different files according to PRODUCT_KERNEL_DTS; products may follow the same approach. The source example selects V21 HWC and EVS files/MAX96712-TXD, otherwise the default HWC and V20/NVP6188-AHD files. To build V21, replace the DTS and SDIO Wi-Fi fragment with the PCIe fragment as shown. The example retains android-11.config even though this guide is for Android14; verify it against the intended source branch.

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

## 3.4 Multiuser configuration

The product Car-service overlay configures multiuser enablement, maximum occupant count and display-to-occupant bindings. display_settings.xml configures each screen name and backlight. Include every secondary display: its name, e.g.port:4, must use the same ID as displayPort in config_occupant_display_mapping, otherwise no display is found. Both values must come from the address shown by dumpsys display, e.g.address{port=3}, not arbitrary IDs. backlightPath must match DTS; the source gives /sys/class/backlight/dp2lvds_backlight0/brightness as a DSI example. Grant all backlight-node ownership in init.car.rc.

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

Each user’s sdcard directory is /mnt/pass_through/{userId}/emulated/{userId}.

## 3.5 Multiuser debugging

Inspect users and Car service; inject a VHAL event to simulate vehicle input.

```sh
pm list users
dumpsys car_service
dumpsys car_service inject-vhal-event {Vhal_prop_ID} {Vhal_prop_value}
```

## 3.6 Data filesystem

Evaluate ext4 versus f2fs carefully; the SDK defaults to f2fs for data. The source links https://blog.csdn.net/weixin_43245753/article/details/124427177 and provides this ext4 example. These changes affect formatting/encryption/checkpoint behaviour; back up data and validate the product before flashing. Update recovery.fstab too, or recovery.fstab_AB for A/B firmware. Source diff labels mix rk3588_s and rk3588m_u; retained as historical examples, not a claim of the correct target for another product.

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

## 3.7 Removing multiuser mode

Step1: in device/rockchip/common/car/packages_car.mk, disable headless-system-user mode.

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

Step2: disable enablePassengerSupport and enableProfileUserAssignmentForMultiDisplay in the Car-service overlay below. After steps1–2, multiple screens still display independently, but share one user. Different screens can open different applications, not separate instances of the same application. To mirror screens instead, apply steps3–4.

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

Step3: secondary displays normally have SecondaryBottomSystemBar. Disable config_enableBottomSystemBar in the passenger SystemUI overlay.

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

Step4: remove Secondary Home to switch the default independent secondary screen to mirrored output. Remove MultiDisplaySecondaryHomeTestLauncher from packages_car.mk as in the source patch.

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
