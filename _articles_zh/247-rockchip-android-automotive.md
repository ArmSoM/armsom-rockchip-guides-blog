---
title: "Rockchip Android Automotive开发"
description: "完整整理 Rockchip Android Automotive 的多屏、多用户、系统界面、VHAL、Vehicle-dummy 与 AAOS 音频配置，注明 SDK 差异及未验证的适配前提。"
excerpt: "完整整理 Rockchip Android Automotive 的多屏、多用户、系统界面、VHAL、Vehicle-dummy 与 AAOS 音频配置，注明 SDK 差异及未验证的适配前提。"
translation_key: "247-rockchip-android-automotive"
slug: "247-rockchip-android-automotive"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android Automotive开发

来源：Rockchip Android Automotive开发指南，RK-KF-YF-792、V1.1.0、21页，仅中文稿，此版更新显示配置。四语均用真实中文稿内的架构图，其图中文字为英文。本文为Rockchip SDK配置例，不是ArmSoM硬件/实车测试；命令补丁未执行。驾驶分心限制、电源策略及车辆集成须按产品安全验证，示例不等于量产认可。

Android Automotive是运行预装IVI应用及可选第二/第三方Android应用的平台。免费开源代码提供基本信息娱乐功能，可定制产品，并复用Android通用框架、语言、API和开发者生态。它不是Android分叉或并行平台，与手机/平板共享代码仓库，复用十余年积累的安全、兼容、工具与基础设施，并扩展车辆特有需求和功能形成全栈信息娱乐平台。本文说明相关特性配置。

| 芯片 | 内核 | Android |
| --- | --- | --- |
| RK3588 | 5.10 | 12 |
| RK3588/RK3576 | 6.1 | 14 |

## 1 AAOS系统

平板SDK用AOSP，车载SDK用AAOS，包含Google车载UI、驾驶员/乘客权限区分、多屏/触控/背光、多音区和仪表盘；部分Cluster补丁当时由Redmine提供，使驾驶员与多乘客独立操作。上层采用Google标准API，参考https://source.android.com/docs/devices/automotive。Car API含CarSensorManager，接口在packages/services/Car/car-lib；CarService在packages/services/Car/，Car APK在packages/apps/Car/，VHAL OEM属性接口在hardware/interfaces/automotive/vehicle/。

![Vehicle HAL与AAOS架构](/docs/rockchip-android-automotive/images/aaos-architecture.png)

Vehicle HAL与AAOS架构 - 原稿技术图；PDF页 4 (CN).

## 2.1 无头多用户模式

默认一个Driver、最多五个Passenger，各自独立屏幕触控，可打开不同或相同应用。device/rockchip/common/car/packages_car.mk启用无头用户，参考https://source.android.google.cn/docs/devices/admin/multi-user?hl=zh-cn#android-automotive-multi-user。

```make
PRODUCT_SYSTEM_DEFAULT_PROPERTIES += \
    ro.fw.mu.headless_system_user?=true
```

## 2.2 使能用户

CarService两布尔值设true；framework最大用户及同时运行用户均9，与六个乘员/显示区数量不同。按Android版本保留路径，包括原稿Android14 framework路径未含common/。

| 配置 | Android14 | Android12 |
| --- | --- | --- |
| CarService | device/rockchip/common/car/overlay/packages/services/Car/service/res/values/config.xml | device/rockchip/rk3588/rk3588m_car/overlay/packages/services/Car/service/res/values/config.xml |
| Framework | device/rockchip/car/overlay/frameworks/base/core/res/res/values/config.xml | device/rockchip/rk3588/rk3588m_car/overlay/frameworks/base/core/res/res/values/config.xml |

```xml
<bool name="enablePassengerSupport">true</bool>
<bool name="enableProfileUserAssignmentForMultiDisplay" translatable="false">true</bool>
<integer name="config_multiuserMaximumUsers">9</integer>
<integer name="config_multiuserMaxRunningUsers">9</integer>
```

## 2.3 乘员与显示映射

CarService上述config.xml设置乘员区及屏幕。occupantZoneId为各区唯一无符号整数，occupantType为CarOccupantZoneManager.OCCUPANT_TYPE_*（DRIVER/FRONT_PASSENGER/REAR_PASSENGER）；seatRow是座位行，seatSide为left/center/right（原文误rgith），或driver/center/oppositeDriver兼容左右舵。未指定时默认左舵、司机在左；DEFAULT_DISPLAY若配置应始终给司机区。

```xml
<string-array translatable="false" name="config_occupant_zones">
<item>occupantZoneId=0,occupantType=DRIVER,seatRow=1,seatSide=driver</item>
<!--
<item>occupantZoneId=1,occupantType=DRIVER,seatRow=1,seatSide=driver</item> -->
<item>occupantZoneId=1,occupantType=FRONT_PASSENGER,seatRow=1,seatSide=oppositeDriver</item>
<item>occupantZoneId=2,occupantType=REAR_PASSENGER,seatRow=2,seatSide=left</item>
<item>occupantZoneId=3,occupantType=REAR_PASSENGER,seatRow=2,seatSide=right</item>
<item>occupantZoneId=4,occupantType=REAR_PASSENGER,seatRow=3,seatSide=left</item>
<item>occupantZoneId=5,occupantType=REAR_PASSENGER,seatRow=3,seatSide=right</item>
</string-array>
<string-array translatable="false" name="config_occupant_display_mapping">
<item>displayPort=0,displayType=MAIN,occupantZoneId=0</item>
<item>displayPort=1,displayType=MAIN,occupantZoneId=1</item>
<!--
<item>displayPort=1,displayType=INSTRUMENT_CLUSTER,occupantZoneId=0</item> -->
<item>displayPort=2,displayType=MAIN,occupantZoneId=2</item>
<item>displayPort=3,displayType=MAIN,occupantZoneId=3</item>
<item>displayPort=4,displayType=MAIN,occupantZoneId=4</item>
<item>displayPort=5,displayType=MAIN,occupantZoneId=5</item>
</string-array>
```

displayPort为dumpsys display所见唯一物理端口ID，可选displayUniqueId同样查询；VirtualDisplay为virtual:<package>:<ID>，Cluster需用。displayType用CarOccupantZoneManager.DISPLAY_TYPE_*，如MAIN/INSTRUMENT_CLUSTER；occupantZoneId关联区。dumpsys carservice的OccupantZoneService dump包含乘员/屏、乘员/用户、可用区和AudioZone；pm list users看UserInfo数量状态；dumpsys user看名称、状态、权限、创建/启动时间、限制及显示映射。

```sh
dumpsys display
dumpsys carservice
pm list users
dumpsys user
```

## 2.4 HWC显示配置

RK3588有4个VP默认4屏，RK3576有3个VP默认3屏。RK3588六屏用HWC拼接，见RKDocs/common/display/Rockchip_Developer_Guide_Android_Car_MultiDisplay_CN.pdf。默认主DSI、扩展eDP/HDMI-A须与硬件匹配，vendor.hwc.device.primary必须为实际主接口，否则影响开机动画时长及多屏性能。两芯片示例属性相同：

```make
PRODUCT_PROPERTY_OVERRIDES += vendor.hwc.device.primary=DSI
PRODUCT_PROPERTY_OVERRIDES += vendor.hwc.device.extend=HDMI-A,eDP
```

## 2.5 背光与亮度API

display_settings.xml定义屏ID和背光路径，默认匹配EVB，产品须调整。路径如下；identifier1按Port ID、0按Unique ID匹配name。dumpsys display或dumpsys SurfaceFlinger取得port:*或local:*，须匹配config_occupant_display_mapping的displayPort/displayUniqueId，否则服务找不到屏。backlightPath按屏及DTS匹配，DSI例/sys/class/backlight/backlight/brightness。原port4的edp2lvds_backligh1少t，与后文权限例不一致，保留标注。

| 版本 | display_settings.xml |
| --- | --- |
| Default | device/rockchip/common/display_settings.xml |
| RK3588 Android12 | device/rockchip/rk3588/rk3588m_car/display_settings.xml |
| RK3588 Android14 | device/rockchip/rk3588/rk3588m_u/displays/display_settings.xml |
| RK3576 Android14 | device/rockchip/rk3576/rk3576m_u/displays/display_settings.xml |

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
backlightPath="/sys/class/backlight/edp2lvds_backlight0/brightness"
/>
<display
name="port:2"
shouldShowSystemDecors="true"
shouldShowIme="true"
forcedDensity="160"
backlightPath="/sys/class/backlight/dsi2lvds_backlight1/brightness"
/>
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

init.rc将背光节点权限给System。其它参数由Google定义，代码frameworks/base/services/core/java/com/android/server/wm/DisplayWindowSettingsProvider.java，参考https://source.android.google.cn/docs/core/display/multi_display/recommended-practices?hl=zh-cn#windowing。

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

系统级DisplayManager API需系统权限，变更可同步ContentProvider，多用户开关不影响。参考packages/apps/Car/Settings/src/com/android/car/settings/qc/BrightnessSlider.java。

```java
DisplayManager mDisplayManager =
context.getSystemService(DisplayManager.class);
//参考代码
packages/apps/Car/Settings/src/com/android/car/settings/qc/BrightnessSlider.java
//设置亮度
float linearFloat = BrightnessSynchronizer.brightnessIntToFloat(linear);
mDisplayManager.setBrightness(displayId, linearFloat);
//获取亮度
float linearFloat = mDisplayManager.getBrightness(displayId);
int linear = BrightnessSynchronizer.brightnessFloatToInt(linearFloat);
```

Activity亮度0–1，只对当前Activity有效，退出回退系统值，多用户无影响。须确保Activity DisplayId为实际目标，泛用Context可能指错屏。Settings.System亮度0–255且需系统权限，未用AAOS多用户时不能调非主屏；先设手动模式再亮度。保留原变量笔误birghtessValue。

```java
//获取当前Activity亮度(0-1)
float brightness = getWindow().getAttributes().screenBrightness;
//设置当前Activity亮度(0-1)
Window window = getWindow();
WindowManager.LayoutParams lp = window.getAttributes();
lp.screenBrightness = (float)brightness;
window.setAttributes(lp);
```

```java
//获取当前系统亮度（0-255）
Settings.System.getIntForUser(mContext.getContentResolver(),
Settings.System.SCREEN_BRIGHTNESS, defValue, userId);
//设置当前系统亮度
//设置系统背光模式为手动调节
Settings.System.putIntForUser(mContext.getContentResolver(),
Settings.System.SCREEN_BRIGHTNESS_MODE,
Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL, userId);
//设置系统背光亮度
Settings.System.putIntForUser(mContext.getContentResolver(),
Settings.System.SCREEN_BRIGHTNESS, birghtessValue, userId);
```

## 2.6 输入与屏幕关联

通过物理端口在/vendor/etc/input-port-associations.xml关联输入与屏。display来自dumpsys display端口，input来自dumpsys input设备Location。产品路径及RK3588 Android14示例如下。原XML元素后的#说明不是合法XML注释，按注释性源码文本保留，不直接当可解析XML。

```text
device/rockchip/rk3588/rk3588m_car/input-port-associations.xml
device/rockchip/rk3588/rk3588m_u/displays/input-port-associations.xml
device/rockchip/rk3576/rk3576m_u/displays/input-port-associations.xml
```

```text
<ports>
<port display="0" input="himax-2-0048/input0" /> #DSI0 720P
<port display="1" input="ili210x-5-0041/input0" /> #EDP0 1080P
<port display="2" input="himax-6-0048/input0" /> #DSI1 720P
<port display="3" input="himax-4-0048/input0" /> #DP0 720P
<port display="241" input="ili210x-7-0041/input0" /> #EDP1 1080P
<port display="243" input="himax-8-0048/input0" /> #DP1 720P
</ports>
```

## 2.7 音区

SDK仅配置四音区，只支持四个对应乘员独立音视频，更多乘员须增加音区及实际输出设备/乘员映射。修改下列目录的audio_policy_configuration.xml和car_audio_configuration.xml。详见Rockchip_RK3588M_Developer_Guide_Android12_Audio_CN.md。

| 版本 | 两个XML所在目录 |
| --- | --- |
| RK3588 Android12 | device/rockchip/rk3588/rk3588m_car/ |
| RK3588 Android14 | device/rockchip/rk3588/rk3588m_u/audio/ |
| RK3576 Android14 | device/rockchip/rk3576/rk3576m_u/audio/ |

## 2.8 热插拔

Rockchip AAOS支持显示热插拔，多用户时乘员屏接口（HDMI/eDP/DP/MIPI等）拔出再接同类型显示设备，会保留原用户/配置并恢复已打开应用栈。

## 2.9 存储

多用户挂载区别单用户，FUSE使部分目录shell不可访问。AAOS启用FUSE透传/mnt/pass_through/减少用户/内核态切换。Environment.getExternalStorageDirectory()返回/storage/emulated/{userid}，该环境shell不可访问，原稿对应shell路径/mnt/user/userid/emulated/{userid}。所有用户可经MediaProvider API访问USB外存：挂载/mnt/pass_through/{userId}/{UUID}{userId}，应用/storage/{UUID}{userId}。保留userid占位写法和拼接，实际核实挂载。参考https://source.android.google.cn/docs/core/storage?hl=zh-cn及https://www.kernel.org/doc/html/latest/filesystems/fuse.html。

## 2.10–2.12 用户权限、预装与UX限制

电话、恢复出厂、安装应用等用户权限在packages/services/Car/car_product/overlay/frameworks/base/core/res/res/xml/config_user_types.xml配置，参考https://source.android.google.cn/docs/devices/admin/multi-user?hl=zh-cn#user_types。并非每系统包适合全部用户类型，预装白名单减少不必要包，优化用户创建/启动和内存。配置packages/services/Car/car_product/build/preinstalled-packages-product-car-base.xml，参考https://source.android.google.cn/docs/core/permissions/preinstalled-packages?hl=zh-cn#base。

UX限制段原文称驾驶位行驶中“默认开启显示”，驻车/空闲不限制，其它座位默认不限制。标题为UX限制但“开启显示”措辞含糊，不应据此理解为允许行驶时无限制驾驶交互。须在device/rockchip/common/car/overlay/packages/services/Car/service/res/xml/car_ux_restrictions_map.xml按产品需求配置并验证驾驶安全。参考https://source.android.google.cn/docs/automotive/driver_distraction/guidelines?hl=zh_cn。

## 2.13 关闭多用户与同显

device/rockchip/common/car/packages_car.mk设ro.fw.mu.headless_system_user=false，§2.2对应Android12/14 CarService config.xml两布尔值设false。关闭后多屏默认仍异显；同显采用下方对应版本修改，不混用两版本。

```make
PRODUCT_SYSTEM_DEFAULT_PROPERTIES += \
    ro.fw.mu.headless_system_user?=false
```

```xml
<bool name="enablePassengerSupport">false</bool>
<bool name="enableProfileUserAssignmentForMultiDisplay" translatable="false">false</bool>
```

Android12：packages/apps/Car/Launcher/AndroidManifest.xml注释Secondary Home的intent-filter，再在packages/apps/Car/SystemUI/res/values/config.xml关config_enableBottom2SystemBar。

```diff
diff --git a/AndroidManifest.xml b/AndroidManifest.xml
index c7078b89..cf3d8235 100644
--- a/AndroidManifest.xml
+++ b/AndroidManifest.xml
@@ -126,11 +126,11 @@
android:exported="true"
android:enabled="true"
android:configChanges="orientation|screenSize|smallestScreenSize|screenLayout|colorMode|density">
- <intent-filter>
+ <!--<intent-filter>
<action android:name="android.intent.action.MAIN" />
<category
android:name="android.intent.category.SECONDARY_HOME" />
<category android:name="android.intent.category.DEFAULT"
/>
- </intent-filter>
+ </intent-filter>-->
</activity>
<service
android:name=".homescreen.audio.telecom.InCallServiceImpl"
android:permission="android.permission.BIND_INCALL_SERVICE"
```

```diff
diff --git a/res/values/config.xml b/res/values/config.xml
index 6b2ffe1f..f8c44cfa 100644
--- a/res/values/config.xml
+++ b/res/values/config.xml
@@ -31,7 +31,7 @@
<bool name="config_enableLeftSystemBar">false</bool>
<bool name="config_enableRightSystemBar">false</bool>
<bool name="config_enableBottomSystemBar">true</bool>
- <bool name="config_enableBottom2SystemBar">true</bool>
+ <bool name="config_enableBottom2SystemBar">false</bool>
<!-- Configure the type of each system bar. Each system bar must have
a unique type. -->
<!-- STATUS_BAR = 0-->
```

Android14：packages/services/Car/car_product/overlay/frameworks/base/core/res/res/values/config.xml设config_localDisplaysMirrorContent=true，并在packages_car.mk移除MultiDisplaySecondaryHomeTestLauncher。原稿在续行PRODUCT_PACKAGES中注释条目，需核实实际make语法。

```diff
diff --git a/car_product/overlay/frameworks/base/core/res/res/values/config.xml b/car_product/overlay/frameworks/base/core/res/res/values/config.xml
index 59053739cc..c38c29eecb 100644
--- a/car_product/overlay/frameworks/base/core/res/res/values/config.xml
+++ b/car_product/overlay/frameworks/base/core/res/res/values/config.xml
@@ -23,7 +23,7 @@
<!-- The dreams feature (screensavers) is not supported in android
auto -->
<bool name="config_dreamsSupported">false</bool>
<!-- Disable local-display-mirror-content -->
- <bool name="config_localDisplaysMirrorContent">false</bool>
+ <bool name="config_localDisplaysMirrorContent">true</bool>
<!-- Enable multi-user. -->
<bool name="config_enableMultiUserUI">true</bool>
<!-- Maximum number of supported users -->
```

```diff
diff --git a/car/packages_car.mk b/car/packages_car.mk
index 6c820a44..afb91b85 100644
--- a/car/packages_car.mk
+++ b/car/packages_car.mk
@@ -164,7 +165,7 @@ PRODUCT_PACKAGES += \
libcarservicehelperjni \
com.android.car.procfsinspector \
com.android.permission \
- MultiDisplaySecondaryHomeTestLauncher \
+ #MultiDisplaySecondaryHomeTestLauncher \
```

## 3 Launcher实现

AAOS默认异显，Android14上述framework overlay为config_localDisplaysMirrorContent=false。非默认屏用SecondaryLauncher：Android12实现在CarLauncher，均运行User10，通过CarOccupantManager取对应屏真实用户，以UserId操作；Android14用MultiDisplaySecondaryHomeTestLauncher，已运行对应用户，取当前进程用户即可。Launcher操作均须考虑当前用户，AOSP/AAOS应用API基本支持UserId。必须等待User Unlock再操作，否则数据异常。代码：Android14 packages/services/Car/tests/MultiDisplaySecondaryHomeTestLauncher，Android12 packages/apps/Car/Launcher。

## 4 SystemUI差异

Android12仅一个SystemUI进程，CarSystemBar创建副屏栏，在packages/apps/Car/SystemUI/res/values/config.xml设config_enableBottom2SystemBar=true。Android14按用户创建SystemUI，CarSystemBar用OverlayManager，device/rockchip/common/car/overlay/packages/services/Car/car_product/rro/CarSystemUIPassengerRRO/res/values/config.xml设config_enableBottomSystemBar=true。SystemBarConfig检查NotificationPanel，BottomSystemBar需BottomNotificationPanelViewMediator；代码packages/apps/Car/SystemUI/src/com/android/systemui/car/systembar/SystemBarConfigs.java。

## 5 休眠唤醒

VMCU通常控制车载电源外设，因此AAOS休眠不同AOSP，可dumpsys car_service suspend/resume模拟。主机挂起禁用不适当唤醒源如心跳、modem、Wi-Fi、蓝牙；所述架构仅VMCU中断唤醒SoC，假设VMCU能监听modem远程事件（如远程发动机启动）；若AP承担则需加modem唤醒源。按硬件在kernel或CarPowerManagerService.java的doHandleFinish()禁用RTC/Wi-Fi/以太网/蓝牙二级待机唤醒，必要时handleWaitForVhal()恢复。

SDK默认无power_policy.xml、所有电源全开；需定义产品策略：https://source.android.com/docs/automotive/power/power_policy?hl=zh-cn，概览https://source.android.google.cn/docs/automotive/power?hl=zh_cn。原稿引用但未内嵌图https://source.android.com/static/docs/devices/automotive/images/automotive_power_deep_sleep.png?hl=zh-cn。Android14可单独休眠副屏，原API写CarPowerManster.setDisplayPowerState(displayid,false/true)，类名疑似笔误，保留追溯并须核实SDK接口；shell如下。

```sh
dumpsys car_service suspend
dumpsys car_service resume
dumpsys car_service set-display-state displayid false/true
```

## 6 跨屏应用迁移

AAOS通常多屏但交互较少，Rockchip增加多指滑动迁移应用。代码services/core/java/com/android/server/wm/FingersDisplayAnimationEventListener.java，配置device/rockchip/common/car/config_three_fingers.xml，板端/system/etc/config_three_fingers.xml。onPointerEvent计算手势，可自改算法。

```xml
<?xml version="1.0" encoding="utf-8"?>
<config>
<!-- option value:
OFF : don't use this feature
PARTIAL : only white app list can use
FULL : only black app list don't user
-->
<log-enable>true</log-enable>
<enable>PARTIAL</enable>
<finger-num>3</finger-num>
<min-swipe-distance-ratio>0.05</min-swipe-distance-ratio>
<effective-distance-ratio>0.5</effective-distance-ratio>
<white-app-lists>
<package>com.bilibili.bilithings</package>
<package>com.android.car.settings</package>
<package>android.rk.RockVideoPlayer</package>
</white-app-lists>
<black-app-lists>
<package>com.android.car.carlauncher</package>
<package>com.android.car.mapsplaceholder</package>
<package>com.android.systemui</package>
<package>com.android.permissioncontroller</package>
<package>com.android.car.developeroptions</package>
</black-app-lists>
<location>
<display>
<uniqueId>local:0</uniqueId>
<top>local:1</top>
<left>local:2</left>
<right>local:3</right>
<bottom>local:0</bottom>
</display>
<display>
<uniqueId>local:1</uniqueId>
<top>local:2</top>
<left>local:3</left>
<right>local:1</right>
<bottom>local:0</bottom>
</display>
<display>
<uniqueId>local:2</uniqueId>
<top>local:3</top>
<left>local:2</left>
<right>local:0</right>
<bottom>local:1</bottom>
</display>
<display>
<uniqueId>local:3</uniqueId>
<top>local:3</top>
<left>local:0</left>
<right>local:1</right>
<bottom>local:2</bottom>
</display>
</location>
</config>
```

| 参数 | 含义 |
| --- | --- |
| enable | OFF关闭；PARTIAL仅白名单（原稿建议）；FULL除黑名单外 |
| finger-num | 手指数 |
| min-swipe-distance-ratio | 最小滑动比例；0.05×1080=54激活 |
| effective-distance-ratio | 提交阈值；0.5×1080=540，大于迁移、小于动画返回 |
| white-app-lists / black-app-lists | 白名单/黑名单 |
| location / display | 现实位置关系/屏条目 |
| uniqueId | 当前屏UniqueId |
| top / bottom / left / right | 上/下/左/右滑动目标UniqueId |

## 7 仪表盘Cluster

司机额外占用Cluster屏，在config_occupant_display_mapping配置，由CarOccupantService启动解析。ClusterOsDouble接收VHAL渲染挡位/转速/车速/水温等，提供VirtualDisplay给ClusterHomeSample，使其它应用崩溃不影响仪表核心数据显示。务必保持稳定简单，仅显示车辆信息与提供虚拟屏，不放复杂内容。

ClusterHomeSample为ClusterHomeService默认UI，管理中间虚拟屏，可改packages/services/Car/service/res/values/config.xml的config_clusterHomeActivity选其它APK。原值末尾.ClusterHomeActivit缺y，应核实真实Activity名。按样例基于VirtualDisplay及ClusterManager的ClusterState实现导航/音乐/设置/电话UI。原补丁联系人zhijun.xie@rock-chips.com / tao.weng@rock-chips.com，本任务未联系。

```xml
<string name="config_clusterHomeActivity" translatable="false">com.android.car.cluster.home/.ClusterHomeActivit</string>
```

## 8 移除产品包

Rockchip的PRODUCT_REMOVE_PACKAGES宏便于移除不需要的PRODUCT_PACKAGES，无须逐处找源码声明，示例：

```make
PRODUCT_REMOVE_PACKAGES += \
    Contacts \
    Music \
    android.hardware.lights-service.rockchip
```

## 9 Vehicle HAL

VHAL定义OEM可实现的车辆属性及元数据，例如整数类型、允许的更改模式，通过读取、写入、订阅访问代表功能的属性。参考https://source.android.google.cn/docs/automotive/vhal?hl=zh_cn。SDK提供hardware/interfaces/automotive/vehicle的原生AAOS VHAL与hardware/rockchip/rvcam的Vehicle-dummy，后者开启补丁如下：

```diff
#device/rockchip/common
diff --git a/car/pre_google_car.mk b/car/pre_google_car.mk
index d85f017a..228be91f 100644
--- a/car/pre_google_car.mk
+++ b/car/pre_google_car.mk
@@ -56,7 +56,7 @@ $(call inherit-product, device/rockchip/common/car/packages_generic_system.mk)
PRODUCT_PACKAGES += \
android.hardware.broadcastradio-service.default
-SOONG_CONFIG_rvcam_has_vhal := false
+SOONG_CONFIG_rvcam_has_vhal := true
ifneq ($(strip $(SOONG_CONFIG_rvcam_has_vhal)), true)
PRODUCT_PACKAGES += \
```

Android 14建议以AIDL HAL替换HIDL HAL，因此Vehicle HAL已改用AIDL。若产品需要退回HIDL，原稿给出manifest、服务包及兼容矩阵8和9的修改。以下是原稿补丁片段，非对所有SDK版本验证可套用的补丁：

```diff
# device/rockchip/common
diff --git a/car/manifest.xml b/car/manifest.xml
index 30a042f4..bd4a56b6 100644
--- a/car/manifest.xml
+++ b/car/manifest.xml
@@ -14,10 +14,19 @@
limitations under the License.
-->
<manifest version="1.0" type="framework">
- <hal format="aidl">
+ <!-- <hal format="aidl">
<name>android.hardware.automotive.vehicle</name>
<version>2</version>
<fqname>IVehicle/default</fqname>
+ </hal> -->
+ <hal format="hidl">
+ <name>android.hardware.automotive.vehicle</name>
+ <transport>hwbinder</transport>
+ <version>2.0</version>
+ <interface>
+ <name>IVehicle</name>
+ <regex-instance>.*</regex-instance>
+ </interface>
</hal>
<hal format="aidl">
<name>android.hardware.broadcastradio</name>
diff --git a/car/pre_google_car.mk b/car/pre_google_car.mk
index d85f017a..88adf69d 100644
--- a/car/pre_google_car.mk
+++ b/car/pre_google_car.mk
@@ -60,7 +60,8 @@ SOONG_CONFIG_rvcam_has_vhal := false
ifneq ($(strip $(SOONG_CONFIG_rvcam_has_vhal)), true)
PRODUCT_PACKAGES += \
- android.hardware.automotive.vehicle@V1-default-service
+ android.hardware.automotive.vehicle@2.0-default-service
+ # android.hardware.automotive.vehicle@V1-default-service
endif
# Car init.rc
# hardware/interfaces/compatibility_matrices
diff --git a/compatibility_matrices/compatibility_matrix.8.xml b/compatibility_matrices/compatibility_matrix.8.xml
index 5ea075a377..2f12b12869 100644
--- a/compatibility_matrices/compatibility_matrix.8.xml
+++ b/compatibility_matrices/compatibility_matrix.8.xml
@@ -92,6 +92,14 @@
<instance>default</instance>
</interface>
</hal>
+ <hal format="hidl" optional="true">
+ <name>android.hardware.automotive.vehicle</name>
+ <version>2.0</version>
+ <interface>
+ <name>IVehicle</name>
+ <regex-instance>.*</regex-instance>
+ </interface>
+ </hal>
<hal format="aidl" optional="true">
<name>android.hardware.automotive.vehicle</name>
<version>1-2</version>
diff --git a/compatibility_matrices/compatibility_matrix.9.xml b/compatibility_matrices/compatibility_matrix.9.xml
index 188746d79b..15098f814c 100644
--- a/compatibility_matrices/compatibility_matrix.9.xml
+++ b/compatibility_matrices/compatibility_matrix.9.xml
@@ -101,6 +101,14 @@
<instance>default</instance>
</interface>
</hal>
+ <hal format="hidl" optional="true">
+ <name>android.hardware.automotive.vehicle</name>
+ <version>2.0</version>
+ <interface>
+ <name>IVehicle</name>
+ <regex-instance>.*</regex-instance>
+ </interface>
+ </hal>
<hal format="aidl" optional="true">
<name>android.hardware.automotive.remoteaccess</name>
<interface>
```

两种VHAL在应用/HAL层采用相同调试方法。--help列参考VHAL命令，--get读取如INFO_VIN属性。CarService可注入属性事件，带可选zone、逗号分隔数据及延时。最后一例模拟AP_POWER_STATE_REQ::SHUTDOWN_PREPARE，不应在运行车辆上执行关机测试。亦可通过Kitchen Sink获取/设置Vehicle HAL属性。

```text
dumpsys android.hardware.automotive.vehicle.IVehicle/default --help
dumpsys android.hardware.automotive.vehicle.IVehicle/default --get 0x11100100
dumpsys car_service -h
dumpsys car_service inject-vhal-event <PROPERTY_ID in Hex or Decimal> [zone] data(can be comma separated list) [-t delay_time_seconds]
dumpsys car_service inject-vhal-event 289475072 1,0
```

## 10 Vehicle-dummy

Vehicle-dummy用于模拟部分Vehicle HAL事件，实际产品须自行接入MCU/CAN硬件。实现为hardware/rockchip/rvcam/drivers/vehicle-dummy/vehicle_dummy_hw.c，节点如下：

```text
/sys/devices/platform/vehicle-dummy/ac_on
/sys/devices/platform/vehicle-dummy/auto_on
/sys/devices/platform/vehicle-dummy/defrost_left
/sys/devices/platform/vehicle-dummy/defrost_right
/sys/devices/platform/vehicle-dummy/fan_direction
/sys/devices/platform/vehicle-dummy/fan_speed
/sys/devices/platform/vehicle-dummy/gear
/sys/devices/platform/vehicle-dummy/hvac_on
/sys/devices/platform/vehicle-dummy/power_req
/sys/devices/platform/vehicle-dummy/recirc_on
/sys/devices/platform/vehicle-dummy/seat_temp_left
/sys/devices/platform/vehicle-dummy/seat_temp_right
/sys/devices/platform/vehicle-dummy/temp_left
/sys/devices/platform/vehicle-dummy/temp_right
/sys/devices/platform/vehicle-dummy/turn
```

转向灯演示：1右转，2左转，0关闭。

```sh
echo 1 > /sys/devices/platform/vehicle-dummy/turn
echo 2 > /sys/devices/platform/vehicle-dummy/turn
echo 0 > /sys/devices/platform/vehicle-dummy/turn
```

风向参考VehicleHvacFanDirection，风速参考HVAC_FAN_SPEED。原稿用以下斜线分隔候选值，使用时选择一个整数，不应把斜线表达式直接写入节点。其它部分模拟实现参见Vehicle-dummy代码。

```text
echo 1/2/3/4/6 > /sys/devices/platform/vehicle-dummy/fan_direction
echo 1/2/3/4/5/6 > /sys/devices/platform/vehicle-dummy/fan_speed
```

## 11 AAOS音频

Rockchip AAOS Audio的音区配置、音量调节、焦点管理及AudioControl详见RKDocs/common/Audio/Rockchip_Developer_Guide_AAOS_Audio_CN.pdf。

{% endraw %}
