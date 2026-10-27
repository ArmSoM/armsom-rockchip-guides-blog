---
title: "Разработка Rockchip Android Automotive"
description: "Полное руководство Rockchip Android Automotive: дисплеи, пользователи, системный интерфейс, VHAL, Vehicle-dummy и звук AAOS; ограничения конкретных SDK."
excerpt: "Полное руководство Rockchip Android Automotive: дисплеи, пользователи, системный интерфейс, VHAL, Vehicle-dummy и звук AAOS; ограничения конкретных SDK."
translation_key: "247-rockchip-android-automotive"
slug: "247-rockchip-android-automotive"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Разработка Rockchip Android Automotive

Источник:Rockchip Android Automotive,RK-KF-YF-792,V1.1.0,21 страница, только китайский; обновлены настройки дисплея. Все переводы используют архитектурную схему китайского PDF с английскими подписями. Это примеры SDK Rockchip, не испытания ArmSoM/автомобиля; команды/патчи не выполнялись. Ограничения водителя, питание и интеграция требуют проверки безопасности изделия, не одобрения производства.

Android Automotive запускает предустановленные IVI и дополнительные second-/third-party Android-приложения. Открытый бесплатный код даёт базовое infotainment, настройку продуктов и повторное использование Android-framework, языков/API и опыта разработчиков. Это не fork:общие с телефонами/планшетами репозитории, безопасность, совместимость, инструменты и инфраструктура более десяти лет, дополненные автомобильными функциями полного стека. Руководство описывает возможности/настройки.

| Чип | Ядро | Android |
| --- | --- | --- |
| RK3588 | 5.10 | 12 |
| RK3588/RK3576 | 6.1 | 14 |

## 1 Платформа AAOS

Tablet SDK использует AOSP, automotive — AAOS с Google UI, правами водителя/пассажиров, экранами/касаниями/подсветкой, аудиозонами/cluster. Некоторые cluster-патчи предоставлялись через Redmine. Водитель/пассажиры работают независимо. API стандартные Google:https://source.android.com/docs/devices/automotive. CarSensorManager и API:packages/services/Car/car-lib; CarService:packages/services/Car/; APK:packages/apps/Car/; OEM-свойства VHAL:hardware/interfaces/automotive/vehicle/.

![Архитектура Vehicle HAL/AAOS](/docs/rockchip-android-automotive/images/aaos-architecture.png)

Архитектура Vehicle HAL/AAOS - Оригинальная иллюстрация;страница PDF 4 (CN).

## 2.1 Headless multiuser

Исходно один водитель и до пяти пассажиров, независимые дисплеи/касания/приложения, включая одно приложение у разных пользователей. Headless в device/rockchip/common/car/packages_car.mk. Ссылка:https://source.android.google.cn/docs/devices/admin/multi-user?hl=zh-cn#android-automotive-multi-user.

```make
PRODUCT_SYSTEM_DEFAULT_PROPERTIES += \
    ro.fw.mu.headless_system_user?=true
```

## 2.2 Включение пользователей

Два CarService bool=true. Максимум и одновременно работающих пользователей framework —9, не число шести occupant-зон. Пути сохранены по версиям, включая Android14 framework без common/.

| Настройка | Android14 | Android12 |
| --- | --- | --- |
| CarService | device/rockchip/common/car/overlay/packages/services/Car/service/res/values/config.xml | device/rockchip/rk3588/rk3588m_car/overlay/packages/services/Car/service/res/values/config.xml |
| Framework | device/rockchip/car/overlay/frameworks/base/core/res/res/values/config.xml | device/rockchip/rk3588/rk3588m_car/overlay/frameworks/base/core/res/res/values/config.xml |

```xml
<bool name="enablePassengerSupport">true</bool>
<bool name="enableProfileUserAssignmentForMultiDisplay" translatable="false">true</bool>
<integer name="config_multiuserMaximumUsers">9</integer>
<integer name="config_multiuserMaxRunningUsers">9</integer>
```

## 2.3 Пассажиры и дисплеи

CarService config.xml выше задаёт зоны/экраны. occupantZoneId — уникальный unsigned ID; occupantType=CarOccupantZoneManager.OCCUPANT_TYPE_* (DRIVER/FRONT_PASSENGER/REAR_PASSENGER); seatRow — ряд; seatSide left/center/right (опечатка rgith) либо driver/center/oppositeDriver независимо от стороны руля. По умолчанию левый руль/водитель слева. DEFAULT_DISPLAY всегда назначается водителю.

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

displayPort — физический ID из dumpsys display; необязательный displayUniqueId там же. VirtualDisplay:virtual:<package>:<ID>, нужен Cluster. displayType=CarOccupantZoneManager.DISPLAY_TYPE_* (MAIN/INSTRUMENT_CLUSTER); occupantZoneId связывает зону. dumpsys carservice/OccupantZoneService показывает связи occupant-display/user, зоны/AudioZone. pm list users — число/статус UserInfo; dumpsys user — имена,статусы,права,время,ограничения,дисплеи.

```sh
dumpsys display
dumpsys carservice
pm list users
dumpsys user
```

## 2.4 Настройка дисплеев HWC

RK3588:4VP/4экрана; RK3576:3VP/3экрана. Шесть экранов RK3588 используют HWC stitching, см.RKDocs/common/display/Rockchip_Developer_Guide_Android_Car_MultiDisplay_CN.pdf. Основной DSI,дополнительные eDP/HDMI-A должны соответствовать hardware. Неверный vendor.hwc.device.primary ухудшает анимацию/производительность. Оба примера:

```make
PRODUCT_PROPERTY_OVERRIDES += vendor.hwc.device.primary=DSI
PRODUCT_PROPERTY_OVERRIDES += vendor.hwc.device.extend=HDMI-A,eDP
```

## 2.5 Подсветка и API яркости

display_settings.xml задаёт ID/подсветку; исходные EVB-настройки адаптируйте. identifier1=Port ID,0=Unique ID. port:*/local:* из dumpsys display/SurfaceFlinger должны совпасть с config_occupant_display_mapping, иначе экран не найден. backlightPath сверяйте с DTS/экраном; DSI:/sys/class/backlight/backlight/brightness. Исходный port4 edp2lvds_backligh1 без t расходится с дальнейшим примером прав; сохранено.

| Версия | display_settings.xml |
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

Назначьте System владельцем узлов в init.rc. Другие параметры:frameworks/base/services/core/java/com/android/server/wm/DisplayWindowSettingsProvider.java; https://source.android.google.cn/docs/core/display/multi_display/recommended-practices?hl=zh-cn#windowing.

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

Системные DisplayManager API требуют системных прав, синхронизируют ContentProvider и одинаковы с multiuser/без. Пример:packages/apps/Car/Settings/src/com/android/car/settings/qc/BrightnessSlider.java.

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

Яркость Activity0–1 действует только на текущую Activity, после выхода возвращается системная, multiuser не влияет. Проверяйте Activity DisplayId:Context может указывать другой экран. Settings.System0–255 требует системных прав; без AAOS multiuser не меняет дополнительные экраны. Сначала ручной режим, затем значение. Опечатка birghtessValue сохранена.

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

## 2.6 Привязка ввода к экранам

Физические порты связывают ввод/дисплей в /vendor/etc/input-port-associations.xml. display из dumpsys display,input=Location из dumpsys input. Пути/пример RK3588 Android14 ниже. #комментарии после XML невалидны как XML; сохранены как аннотированный текст.

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

## 2.7 Аудиозоны

SDK задаёт четыре аудиозоны:лишь четыре привязанных occupant независимо воспроизводят AV. Для остальных добавьте зоны/устройства/связи. Измените audio_policy_configuration.xml и car_audio_configuration.xml в каталогах ниже. Подробно:Rockchip_RK3588M_Developer_Guide_Android12_Audio_CN.md.

| Версия | Каталог обоих XML |
| --- | --- |
| RK3588 Android12 | device/rockchip/rk3588/rk3588m_car/ |
| RK3588 Android14 | device/rockchip/rk3588/rk3588m_u/audio/ |
| RK3576 Android14 | device/rockchip/rk3576/rk3576m_u/audio/ |

## 2.8 Горячее подключение

AAOS поддерживает hotplug; при переподключении occupant-дисплея того же типа HDMI/eDP/DP/MIPI сохраняет пользователя/настройки и восстанавливает стек приложений.

## 2.9 Хранилище

Multiuser-mount отличается; FUSE закрывает некоторые пути shell. Passthrough /mnt/pass_through/ уменьшает переходы userspace/kernel. Environment.getExternalStorageDirectory() возвращает /storage/emulated/{userid}, здесь недоступный shell; источник даёт /mnt/user/userid/emulated/{userid}. USB доступен всем через MediaProvider:mount /mnt/pass_through/{userId}/{UUID}{userId}, приложение /storage/{UUID}{userId}. Написание/конкатенация сохранены; проверьте реальные mount. Ссылки:https://source.android.google.cn/docs/core/storage?hl=zh-cn и https://www.kernel.org/doc/html/latest/filesystems/fuse.html.

## 2.10–2.12 Права, предустановка и UX

Права звонков/сброса/установки:packages/services/Car/car_product/overlay/frameworks/base/core/res/res/xml/config_user_types.xml; https://source.android.google.cn/docs/devices/admin/multi-user?hl=zh-cn#user_types. Allowlist системных пакетов по типу пользователя снижает создание/старт/память. Файл:packages/services/Car/car_product/build/preinstalled-packages-product-car-base.xml; https://source.android.google.cn/docs/core/permissions/preinstalled-packages?hl=zh-cn#base.

Абзац UX буквально говорит «дисплей включён» у водителя в движении, без ограничений при парковке/простое и у других мест. Заголовок про ограничения UX делает это неоднозначным; не считайте разрешением неограниченного взаимодействия водителя. Настройте/проверьте безопасность в device/rockchip/common/car/overlay/packages/services/Car/service/res/xml/car_ux_restrictions_map.xml. Ссылка:https://source.android.google.cn/docs/automotive/driver_distraction/guidelines?hl=zh_cn.

## 2.13 Отключение multiuser и зеркалирование

Задайте ro.fw.mu.headless_system_user=false в device/rockchip/common/car/packages_car.mk и оба CarService bool=false в путях §2.2. Экраны остаются независимыми; для зеркалирования примените изменения нужной версии ниже, не смешивая12/14.

```make
PRODUCT_SYSTEM_DEFAULT_PROPERTIES += \
    ro.fw.mu.headless_system_user?=false
```

```xml
<bool name="enablePassengerSupport">false</bool>
<bool name="enableProfileUserAssignmentForMultiDisplay" translatable="false">false</bool>
```

Android12:закомментируйте Secondary Home intent-filter в packages/apps/Car/Launcher/AndroidManifest.xml и отключите config_enableBottom2SystemBar в packages/apps/Car/SystemUI/res/values/config.xml.

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

Android14:config_localDisplaysMirrorContent=true в packages/services/Car/car_product/overlay/frameworks/base/core/res/res/values/config.xml,уберите MultiDisplaySecondaryHomeTestLauncher из packages_car.mk. Комментарий внутри продолжения PRODUCT_PACKAGES требует проверки make-синтаксиса.

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

## 3 Реализация Launcher

AAOS исходно независимые экраны:Android14 config_localDisplaysMirrorContent=false. Неосновные экраны используют SecondaryLauncher. Android12 CarLauncher запускает их как User10; CarOccupantManager даёт фактический UserId дисплея. Android14 MultiDisplaySecondaryHomeTestLauncher уже работает под назначенным пользователем, используйте текущий процесс. Все действия учитывают пользователя,API обычно принимают UserId. Дождитесь User Unlock,иначе ошибки данных. Код14:packages/services/Car/tests/MultiDisplaySecondaryHomeTestLauncher;12:packages/apps/Car/Launcher.

## 4 Различия SystemUI

Android12:один SystemUI,CarSystemBar создаёт вторичные панели; config_enableBottom2SystemBar=true в packages/apps/Car/SystemUI/res/values/config.xml. Android14:SystemUI по пользователю,OverlayManager; config_enableBottomSystemBar=true в device/rockchip/common/car/overlay/packages/services/Car/car_product/rro/CarSystemUIPassengerRRO/res/values/config.xml. BottomSystemBar требует BottomNotificationPanelViewMediator; проверка:packages/apps/Car/SystemUI/src/com/android/systemui/car/systembar/SystemBarConfigs.java.

## 5 Сон и пробуждение

VMCU обычно управляет питанием/периферией,AAOS отличается от AOSP; моделирование dumpsys car_service suspend/resume. При suspend отключите неподходящие heartbeat/modem/Wi-Fi/Bluetooth wake. В описанной схеме лишь VMCU IRQ будит SoC,предполагая прослушивание VMCU удалённых modem-событий,например запуска двигателя. Если это делает AP,нужен modem wake. Настройте kernel либо doHandleFinish() CarPowerManagerService.java для RTC/Wi-Fi/Ethernet/Bluetooth secondary-standby; при необходимости восстановите в handleWaitForVhal().

SDK не содержит power_policy.xml:всё питание включено. Задайте политику:https://source.android.com/docs/automotive/power/power_policy?hl=zh-cn; обзор:https://source.android.google.cn/docs/automotive/power?hl=zh_cn. Ссылка на рисунок (не встроен):https://source.android.com/static/docs/devices/automotive/images/automotive_power_deep_sleep.png?hl=zh-cn. Android14 отключает отдельный вторичный экран. Исходный API CarPowerManster.setDisplayPowerState(displayid,false/true) вероятно ошибочен в имени класса; проверьте SDK. Shell ниже.

```sh
dumpsys car_service suspend
dumpsys car_service resume
dumpsys car_service set-display-state displayid false/true
```

## 6 Перенос приложений между экранами

AAOS обычно имеет несколько экранов с малым взаимодействием. Rockchip добавляет перенос приложения многопальцевым свайпом. Код:services/core/java/com/android/server/wm/FingersDisplayAnimationEventListener.java; config:device/rockchip/common/car/config_three_fingers.xml → /system/etc/config_three_fingers.xml. onPointerEvent рассчитывает жесты,алгоритм изменяем.

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

| Параметр | Значение |
| --- | --- |
| enable | OFF выкл; PARTIAL только allowlist (рекомендация источника); FULL кроме denylist |
| finger-num | Число пальцев |
| min-swipe-distance-ratio | Минимум;0.05×1080=54 для активации |
| effective-distance-ratio | Порог;0.5×1080=540,больше переносит,меньше возвращает |
| white-app-lists / black-app-lists | Allowlist/denylist |
| location / display | Физическое расположение/дисплей |
| uniqueId | UniqueId исходного экрана |
| top / bottom / left / right | Целевой UniqueId вверх/вниз/влево/вправо |

## 7 Cluster

Водитель занимает дополнительный Cluster-экран через config_occupant_display_mapping; CarOccupantService разбирает при старте. ClusterOsDouble получает VHAL и рисует передачу,RPM,скорость,температуру; VirtualDisplay для ClusterHomeSample отделяет сбои приложений от основных приборов. Сохраняйте простоту/стабильность:данные автомобиля и VirtualDisplay,не сложный контент.

ClusterHomeSample — стандартный UI ClusterHomeService для центрального VirtualDisplay. Другой APK выбирается config_clusterHomeActivity в packages/services/Car/service/res/values/config.xml. Значение источника .ClusterHomeActivit без y:проверьте Activity. Свой UI навигации/музыки/настроек/телефона строится на VirtualDisplay/ClusterState из ClusterManager. Контакты патчей:zhijun.xie@rock-chips.com / tao.weng@rock-chips.com; обращений не было.

```xml
<string name="config_clusterHomeActivity" translatable="false">com.android.car.cluster.home/.ClusterHomeActivit</string>
```

## 8 Удаление пакетов продукта

Макрос Rockchip PRODUCT_REMOVE_PACKAGES удаляет ненужные PRODUCT_PACKAGES без поиска всех объявлений. Пример:

```make
PRODUCT_REMOVE_PACKAGES += \
    Contacts \
    Music \
    android.hardware.lights-service.rockchip
```

## 9 Vehicle HAL

VHAL определяет реализуемые OEM свойства и метаданные:например целочисленный тип и допустимые режимы изменения. Интерфейс читает,записывает и подписывается на свойства-функции. Справка:https://source.android.google.cn/docs/automotive/vhal?hl=zh_cn. SDK содержит штатный AAOS VHAL в hardware/interfaces/automotive/vehicle и Vehicle-dummy в hardware/rockchip/rvcam. Последний включается патчем:

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

Android 14 рекомендует AIDL вместо HIDL,поэтому Vehicle HAL использует AIDL. Для возврата к HIDL источник меняет manifest,пакет службы и матрицы совместимости 8/9. Это фрагмент исходного патча,не проверенный для каждой версии SDK:

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

Обе реализации имеют одинаковую отладку на уровне приложений/HAL. --help перечисляет команды,--get читает,например,INFO_VIN. CarService внедряет события с необязательной зоной,данными через запятую и задержкой. Последний пример моделирует AP_POWER_STATE_REQ::SHUTDOWN_PREPARE; не тестируйте выключение работающего автомобиля. Kitchen Sink также читает/задаёт свойства Vehicle HAL.

```text
dumpsys android.hardware.automotive.vehicle.IVehicle/default --help
dumpsys android.hardware.automotive.vehicle.IVehicle/default --get 0x11100100
dumpsys car_service -h
dumpsys car_service inject-vhal-event <PROPERTY_ID in Hex or Decimal> [zone] data(can be comma separated list) [-t delay_time_seconds]
dumpsys car_service inject-vhal-event 289475072 1,0
```

## 10 Vehicle-dummy

Vehicle-dummy моделирует часть событий Vehicle HAL. Реальные изделия требуют собственного подключения MCU/CAN. Реализация:hardware/rockchip/rvcam/drivers/vehicle-dummy/vehicle_dummy_hw.c. Узлы:

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

Пример поворотников:1 вправо,2 влево,0 выкл.

```sh
echo 1 > /sys/devices/platform/vehicle-dummy/turn
echo 2 > /sys/devices/platform/vehicle-dummy/turn
echo 0 > /sys/devices/platform/vehicle-dummy/turn
```

Направление воздуха:VehicleHvacFanDirection; скорость:HVAC_FAN_SPEED. Ниже исходные альтернативы через косую черту:выберите одно целое число,не записывайте строку с чертами. Другие частичные симуляции смотрите в реализации Vehicle-dummy.

```text
echo 1/2/3/4/6 > /sys/devices/platform/vehicle-dummy/fan_direction
echo 1/2/3/4/5/6 > /sys/devices/platform/vehicle-dummy/fan_speed
```

## 11 Аудио AAOS

Настройка аудиозон Rockchip AAOS Audio,громкости,управление фокусом и AudioControl:RKDocs/common/Audio/Rockchip_Developer_Guide_AAOS_Audio_CN.pdf.

{% endraw %}
