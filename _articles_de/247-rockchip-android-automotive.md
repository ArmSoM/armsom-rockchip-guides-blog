---
title: "Rockchip Android Automotive entwickeln"
description: "Rockchip Android Automotive: Displays, Benutzer, Systemoberfläche, VHAL, Vehicle-dummy und AAOS-Audio mit Hinweisen zu SDK-Abweichungen und ungeprüfter Anpassung."
excerpt: "Rockchip Android Automotive: Displays, Benutzer, Systemoberfläche, VHAL, Vehicle-dummy und AAOS-Audio mit Hinweisen zu SDK-Abweichungen und ungeprüfter Anpassung."
translation_key: "247-rockchip-android-automotive"
slug: "247-rockchip-android-automotive"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android Automotive entwickeln

Quelle:Rockchip Android Automotive,RK-KF-YF-792,V1.1.0,21 Seiten,nur chinesisch; Displaykonfiguration aktualisiert. Alle Fassungen nutzen Architekturabbildung aus CN-PDF mit englischen Beschriftungen. Rockchip-SDK-Beispiele, keine ArmSoM-/Fahrzeugtests; Befehle/Patches nicht ausgeführt. Fahrerablenkung, Energiepolitik und Fahrzeugintegration benötigen produktspezifische Sicherheitsprüfung, keine Produktionsfreigabe.

Android Automotive führt vorinstallierte IVI- und optionale Second-/Third-Party-Android-Apps aus. Freier offener Code liefert Infotainmentbasis, Produktanpassung und Wiederverwendung von Android-Frameworks, Sprachen/API und Entwicklerwissen. Kein Fork:gemeinsame Telefon-/Tablet-Repositories, Sicherheit, Kompatibilität, Tools und Infrastruktur aus über zehn Jahren, ergänzt um Fahrzeugfunktionen zum Full-Stack-Infotainment. Leitfaden beschreibt Funktionen/Konfiguration.

| Chip | Kernel | Android |
| --- | --- | --- |
| RK3588 | 5.10 | 12 |
| RK3588/RK3576 | 6.1 | 14 |

## 1 AAOS-Plattform

Tablet-SDK:AOSP; Automotive-SDK:AAOS mit Google-UI, Fahrer-/Passagierrechten, Displays/Touch/Backlight, Audiozonen/Cluster. Einige Clusterpatches über Redmine. Fahrer/Passagiere bedienen unabhängig. Standard-Google-API:https://source.android.com/docs/devices/automotive. CarSensorManager/API:packages/services/Car/car-lib; CarService:packages/services/Car/; APK:packages/apps/Car/; VHAL-OEM-Eigenschaften:hardware/interfaces/automotive/vehicle/.

![Vehicle-HAL-/AAOS-Architektur](/docs/rockchip-android-automotive/images/aaos-architecture.png)

Vehicle-HAL-/AAOS-Architektur - Originalabbildung;PDF-Seite 4 (CN).

## 2.1 Headless-Mehrbenutzermodus

Standard:ein Fahrer,bis fünf Passagiere mit unabhängigen Displays/Touch/Apps,auch derselben App je Nutzer. Headless in device/rockchip/common/car/packages_car.mk aktivieren. Referenz:https://source.android.google.cn/docs/devices/admin/multi-user?hl=zh-cn#android-automotive-multi-user.

```make
PRODUCT_SYSTEM_DEFAULT_PROPERTIES += \
    ro.fw.mu.headless_system_user?=true
```

## 2.2 Nutzer aktivieren

Beide CarService-Bools=true. Framework-Maximum/gleichzeitig laufende Nutzer jeweils9, nicht sechs Occupant-Zonen. Versionspfade erhalten, auch Android14-Frameworkpfad ohne common/.

| Konfiguration | Android14 | Android12 |
| --- | --- | --- |
| CarService | device/rockchip/common/car/overlay/packages/services/Car/service/res/values/config.xml | device/rockchip/rk3588/rk3588m_car/overlay/packages/services/Car/service/res/values/config.xml |
| Framework | device/rockchip/car/overlay/frameworks/base/core/res/res/values/config.xml | device/rockchip/rk3588/rk3588m_car/overlay/frameworks/base/core/res/res/values/config.xml |

```xml
<bool name="enablePassengerSupport">true</bool>
<bool name="enableProfileUserAssignmentForMultiDisplay" translatable="false">true</bool>
<integer name="config_multiuserMaximumUsers">9</integer>
<integer name="config_multiuserMaxRunningUsers">9</integer>
```

## 2.3 Insassen und Displays

CarService-config.xml oben definiert Zonen/Displays. occupantZoneId:eindeutige unsigned-ID; occupantType=CarOccupantZoneManager.OCCUPANT_TYPE_* (DRIVER/FRONT_PASSENGER/REAR_PASSENGER); seatRow:Sitzreihe; seatSide left/center/right (Quellfehler rgith) oder driver/center/oppositeDriver für Links-/Rechtslenker. Ohne Angabe Linkslenker/Fahrer links. DEFAULT_DISPLAY immer Fahrerzone zuordnen.

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

displayPort:eindeutige physische ID aus dumpsys display; optional displayUniqueId ebenfalls dort. VirtualDisplay:virtual:<package>:<ID>, für Cluster benötigt. displayType=CarOccupantZoneManager.DISPLAY_TYPE_* (MAIN/INSTRUMENT_CLUSTER); occupantZoneId verknüpft Zone. dumpsys carservice/OccupantZoneService zeigt Occupant-Display/User-Beziehungen,Zonen/AudioZone. pm list users:UserInfo-Anzahl/Zustand; dumpsys user:Namen,Zustände,Rechte,Zeiten,Einschränkungen,Displays.

```sh
dumpsys display
dumpsys carservice
pm list users
dumpsys user
```

## 2.4 HWC-Displaykonfiguration

RK3588:4VP/4Displays; RK3576:3VP/3Displays. RK3588-Sechsdisplay über HWC-Stitching, siehe RKDocs/common/display/Rockchip_Developer_Guide_Android_Car_MultiDisplay_CN.pdf. Primär DSI,erweitert eDP/HDMI-A müssen Hardware entsprechen. Falsches vendor.hwc.device.primary beeinträchtigt Bootanimation/Leistung. Beide Chipbeispiele:

```make
PRODUCT_PROPERTY_OVERRIDES += vendor.hwc.device.primary=DSI
PRODUCT_PROPERTY_OVERRIDES += vendor.hwc.device.extend=HDMI-A,eDP
```

## 2.5 Backlight und Helligkeits-API

display_settings.xml definiert IDs/Backlight; EVB-Defaults anpassen. identifier1=Port-ID,0=Unique-ID. port:*/local:* aus dumpsys display/SurfaceFlinger müssen config_occupant_display_mapping entsprechen,sonst Display nicht gefunden. backlightPath mit DTS/Display abgleichen; DSI:/sys/class/backlight/backlight/brightness. Quell-port4 edp2lvds_backligh1 fehlt t gegenüber späterer Rechtezeile; Widerspruch erhalten.

| Variante | display_settings.xml |
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

System-Eigentümer der Backlightknoten in init.rc setzen. Weitere Parameter:frameworks/base/services/core/java/com/android/server/wm/DisplayWindowSettingsProvider.java; https://source.android.google.cn/docs/core/display/multi_display/recommended-practices?hl=zh-cn#windowing.

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

System-DisplayManager-API benötigt Systemrechte,synchronisiert ContentProvider und arbeitet unabhängig von Multiuser. Referenz:packages/apps/Car/Settings/src/com/android/car/settings/qc/BrightnessSlider.java.

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

Activity-Helligkeit0–1 gilt nur für aktuelle Activity,danach Systemwert; unabhängig von Multiuser. Activity-DisplayId prüfen,Context kann falsches Display nennen. Settings.System0–255 braucht Systemrechte; ohne AAOS-Multiuser keine Nebendisplayregelung. Erst manueller Modus,dann Wert. Quellfehler birghtessValue erhalten.

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

## 2.6 Input-/Displayzuordnung

Physische Ports verbinden Input/Display in /vendor/etc/input-port-associations.xml. display aus dumpsys display,input=Location aus dumpsys input. Pfade/RK3588-Android14-Beispiel unten. #Kommentare nach XML sind kein gültiges XML; als annotierter Quelltext erhalten.

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

## 2.7 Audiozonen

SDK konfiguriert vier Audiozonen:nur vier zugeordnete Insassen spielen unabhängig AV. Weitere benötigen Zonen/Outputgeräte/Zuordnungen. audio_policy_configuration.xml und car_audio_configuration.xml in folgenden Verzeichnissen ändern. Details:Rockchip_RK3588M_Developer_Guide_Android12_Audio_CN.md.

| Variante | Verzeichnis beider XML |
| --- | --- |
| RK3588 Android12 | device/rockchip/rk3588/rk3588m_car/ |
| RK3588 Android14 | device/rockchip/rk3588/rk3588m_u/audio/ |
| RK3576 Android14 | device/rockchip/rk3576/rk3576m_u/audio/ |

## 2.8 Hotplug

AAOS unterstützt Hotplug; Wiederanschluss desselben HDMI/eDP/DP/MIPI-Typs behält Nutzer/Konfiguration und stellt Appstack wieder her.

## 2.9 Speicher

Multiuser-Mounts unterscheiden sich; FUSE blockiert einige Shellpfade. Passthrough /mnt/pass_through/ reduziert Userspace/Kernelwechsel. Environment.getExternalStorageDirectory():/storage/emulated/{userid},hier nicht shellzugänglich; Quelle nennt /mnt/user/userid/emulated/{userid}. USB für alle über MediaProvider:Mount /mnt/pass_through/{userId}/{UUID}{userId},App /storage/{UUID}{userId}. Schreibweise/Verkettung erhalten; reale Mounts prüfen. Referenzen:https://source.android.google.cn/docs/core/storage?hl=zh-cn und https://www.kernel.org/doc/html/latest/filesystems/fuse.html.

## 2.10–2.12 Rechte, Vorinstallation und UX

Rechte für Telefon/Werksreset/Installation:packages/services/Car/car_product/overlay/frameworks/base/core/res/res/xml/config_user_types.xml; https://source.android.google.cn/docs/devices/admin/multi-user?hl=zh-cn#user_types. Paket-Allowlist je Nutzertyp reduziert Erstellungs-/Startaufwand/Speicher. Datei:packages/services/Car/car_product/build/preinstalled-packages-product-car-base.xml; https://source.android.google.cn/docs/core/permissions/preinstalled-packages?hl=zh-cn#base.

UX-Absatz sagt wörtlich Fahrer-„Display aktiviert“ während Fahrt,keine Einschränkung beim Parken/Leerlauf/anderen Sitzen. Unter UX-Einschränkungen ist das mehrdeutig; keine Freigabe unbeschränkter Fahrerinteraktion. Produktsicher konfigurieren/prüfen in device/rockchip/common/car/overlay/packages/services/Car/service/res/xml/car_ux_restrictions_map.xml. Referenz:https://source.android.google.cn/docs/automotive/driver_distraction/guidelines?hl=zh_cn.

## 2.13 Multiuser deaktivieren und spiegeln

ro.fw.mu.headless_system_user=false in device/rockchip/common/car/packages_car.mk,beide CarService-Bools=false in §2.2-Pfaden. Displays bleiben unabhängig; Spiegelung über passende Versionsänderungen unten,nicht12/14 mischen.

```make
PRODUCT_SYSTEM_DEFAULT_PROPERTIES += \
    ro.fw.mu.headless_system_user?=false
```

```xml
<bool name="enablePassengerSupport">false</bool>
<bool name="enableProfileUserAssignmentForMultiDisplay" translatable="false">false</bool>
```

Android12:Secondary-Home-intent-filter in packages/apps/Car/Launcher/AndroidManifest.xml auskommentieren,config_enableBottom2SystemBar in packages/apps/Car/SystemUI/res/values/config.xml deaktivieren.

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

Android14:config_localDisplaysMirrorContent=true in packages/services/Car/car_product/overlay/frameworks/base/core/res/res/values/config.xml,MultiDisplaySecondaryHomeTestLauncher aus packages_car.mk entfernen. Kommentar in fortgesetzter PRODUCT_PACKAGES-Zeile:Make-Syntax prüfen.

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

## 3 Launcher-Implementierung

AAOS standardmäßig unabhängige Displays:Android14 config_localDisplaysMirrorContent=false. Nebenanzeigen nutzen SecondaryLauncher. Android12-CarLauncher läuft jeweils als User10; tatsächlichen Displaynutzer über CarOccupantManager/UserId verwenden. Android14-MultiDisplaySecondaryHomeTestLauncher läuft bereits als zugeordneter Nutzer; Prozessnutzer verwenden. Alle Aktionen berücksichtigen Nutzer,APIs meist mit UserId. Vor Aktionen User Unlock abwarten,sonst Datenfehler. Code14:packages/services/Car/tests/MultiDisplaySecondaryHomeTestLauncher;12:packages/apps/Car/Launcher.

## 4 SystemUI-Unterschiede

Android12:ein SystemUI-Prozess,CarSystemBar für Nebenleisten; config_enableBottom2SystemBar=true in packages/apps/Car/SystemUI/res/values/config.xml. Android14:SystemUI je Nutzer,OverlayManager; config_enableBottomSystemBar=true in device/rockchip/common/car/overlay/packages/services/Car/car_product/rro/CarSystemUIPassengerRRO/res/values/config.xml. BottomSystemBar benötigt BottomNotificationPanelViewMediator; Prüfung:packages/apps/Car/SystemUI/src/com/android/systemui/car/systembar/SystemBarConfigs.java.

## 5 Suspend und Wake

VMCU steuert meist Energie/Peripherie;AAOS-Suspend anders als AOSP,simulieren mit dumpsys car_service suspend/resume. Ungeeignete Heartbeat/Modem/Wi-Fi/Bluetooth-Wakequellen deaktivieren. Beschriebene Architektur:VMCU-IRQ weckt SoC,VMCU hört entfernte Modemereignisse wie Motorstart. Übernimmt AP diese Funktion,Modem-Wakequelle ergänzen. Kernel oder CarPowerManagerService.java doHandleFinish() für RTC/Wi-Fi/Ethernet/Bluetooth-Standby anpassen; ggf.in handleWaitForVhal() wiederherstellen.

SDK ohne power_policy.xml:alle Versorgung an. Produktpolitik:https://source.android.com/docs/automotive/power/power_policy?hl=zh-cn; Überblick:https://source.android.google.cn/docs/automotive/power?hl=zh_cn. Nur verlinkte,nicht eingebettete Grafik:https://source.android.com/static/docs/devices/automotive/images/automotive_power_deep_sleep.png?hl=zh-cn. Android14 kann Nebendisplays einzeln suspendieren. Quell-API CarPowerManster.setDisplayPowerState(displayid,false/true) hat vermutlich Klassentippfehler; SDK prüfen. Shell unten.

```sh
dumpsys car_service suspend
dumpsys car_service resume
dumpsys car_service set-display-state displayid false/true
```

## 6 Apps zwischen Displays verschieben

AAOS meist mehrere Displays mit wenig Interaktion. Rockchip ergänzt Appmigration per Mehrfingerswipe. Code:services/core/java/com/android/server/wm/FingersDisplayAnimationEventListener.java; Konfiguration:device/rockchip/common/car/config_three_fingers.xml → /system/etc/config_three_fingers.xml. onPointerEvent berechnet Gesten,Algorithmus anpassbar.

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

| Parameter | Bedeutung |
| --- | --- |
| enable | OFF aus; PARTIAL nur Allowlist (Quelle empfohlen); FULL außer Denylist |
| finger-num | Fingerzahl |
| min-swipe-distance-ratio | Minimum;0.05×1080=54 zur Aktivierung |
| effective-distance-ratio | Schwelle;0.5×1080=540,größer verschiebt,kleiner animiert zurück |
| white-app-lists / black-app-lists | Allowlist/Denylist |
| location / display | Räumliche Anordnung/Displayeintrag |
| uniqueId | Quell-Display-UniqueId |
| top / bottom / left / right | Ziel-UniqueId für oben/unten/links/rechts |

## 7 Cluster

Fahrer belegt zusätzlichen Clusterdisplay über config_occupant_display_mapping,beim Start durch CarOccupantService aufgelöst. ClusterOsDouble zeigt VHAL-Gang,Drehzahl,Geschwindigkeit,Temperatur und stellt VirtualDisplay für ClusterHomeSample bereit; Appcrash soll Kerndaten nicht stören. Einfach/stabil halten:Fahrzeugdaten plus VirtualDisplay,kein komplexer Inhalt.

ClusterHomeSample ist Standard-UI von ClusterHomeService fürs zentrale VirtualDisplay. Anderes APK über config_clusterHomeActivity in packages/services/Car/service/res/values/config.xml. Quellwert .ClusterHomeActivit ohne y:Activitynamen prüfen. Eigene Navigation/Musik/Einstellungen/Telefon auf VirtualDisplay/ClusterState aus ClusterManager aufbauen. Patchkontakte:zhijun.xie@rock-chips.com / tao.weng@rock-chips.com; nicht kontaktiert.

```xml
<string name="config_clusterHomeActivity" translatable="false">com.android.car.cluster.home/.ClusterHomeActivit</string>
```

## 8 Produktpakete entfernen

Rockchip-Makro PRODUCT_REMOVE_PACKAGES entfernt unnötige PRODUCT_PACKAGES ohne Suche aller Deklarationen. Beispiel:

```make
PRODUCT_REMOVE_PACKAGES += \
    Contacts \
    Music \
    android.hardware.lights-service.rockchip
```

## 9 Vehicle HAL

VHAL definiert OEM-Fahrzeugeigenschaften samt Metadaten wie Integer-Typ und erlaubten Änderungsmodi. Die Schnittstelle liest,schreibt und abonniert Funktions-Eigenschaften. Referenz:https://source.android.google.cn/docs/automotive/vhal?hl=zh_cn. SDK bietet natives AAOS-VHAL unter hardware/interfaces/automotive/vehicle und Vehicle-dummy unter hardware/rockchip/rvcam. Letzteres aktiviert dieser Patch:

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

Android 14 empfiehlt AIDL statt HIDL; Vehicle HAL verwendet daher AIDL. Für HIDL-Rückfall ändert die Quelle Manifest,Dienstpaket und Kompatibilitätsmatrizen 8/9. Quellpatch-Auszug,keine für alle SDK-Stände verifizierte Anpassung:

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

Beide Implementierungen nutzen dieselbe App-/HAL-Diagnose. --help listet Befehle,--get liest etwa INFO_VIN. CarService injiziert Ereignisse mit optionaler Zone,kommagetrennten Daten und Verzögerung. Letztes Beispiel simuliert AP_POWER_STATE_REQ::SHUTDOWN_PREPARE; keine Abschalttests am betriebenen Fahrzeug. Kitchen Sink liest/setzt ebenfalls Vehicle-HAL-Eigenschaften.

```text
dumpsys android.hardware.automotive.vehicle.IVehicle/default --help
dumpsys android.hardware.automotive.vehicle.IVehicle/default --get 0x11100100
dumpsys car_service -h
dumpsys car_service inject-vhal-event <PROPERTY_ID in Hex or Decimal> [zone] data(can be comma separated list) [-t delay_time_seconds]
dumpsys car_service inject-vhal-event 289475072 1,0
```

## 10 Vehicle-dummy

Vehicle-dummy simuliert einige Vehicle-HAL-Ereignisse. Reale Produkte müssen eigene MCU-/CAN-Hardware integrieren. Implementierung:hardware/rockchip/rvcam/drivers/vehicle-dummy/vehicle_dummy_hw.c. Knoten:

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

Blinkerbeispiel:1 rechts,2 links,0 aus.

```sh
echo 1 > /sys/devices/platform/vehicle-dummy/turn
echo 2 > /sys/devices/platform/vehicle-dummy/turn
echo 0 > /sys/devices/platform/vehicle-dummy/turn
```

Luftrichtung folgt VehicleHvacFanDirection,Lüftergeschwindigkeit HVAC_FAN_SPEED. Quelle schreibt Alternativen mit Schrägstrichen:ein Integer auswählen,nicht die Schrägstrichfolge schreiben. Weitere Teilsimulationen siehe Vehicle-dummy-Implementierung.

```text
echo 1/2/3/4/6 > /sys/devices/platform/vehicle-dummy/fan_direction
echo 1/2/3/4/5/6 > /sys/devices/platform/vehicle-dummy/fan_speed
```

## 11 AAOS-Audio

Rockchip-AAOS-Audiozonen,Lautstärke,Fokusverwaltung und AudioControl:RKDocs/common/Audio/Rockchip_Developer_Guide_AAOS_Audio_CN.pdf.

{% endraw %}
