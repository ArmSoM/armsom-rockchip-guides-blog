---
title: "Rockchip Android14 Automotive SDK: Treiber, Displays und Konfiguration"
description: "Rockchip Android14 Automotive SDK: Treiber, Displays und Konfiguration"
excerpt: "Rockchip Android14 Automotive SDK: Treiber, Displays und Konfiguration"
translation_key: "243-rockchip-android14-car-sdk"
slug: "243-rockchip-android14-car-sdk"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14 Automotive SDK: Treiber, Displays und Konfiguration

Dieser Leitfaden beschreibt zusätzliche Treiber, Funktionen und häufige Probleme des Rockchip-RK3588M/RK3576M-Automotive-SDK für Android14. Allgemeine Repository-, Build-, Firmware-, Flash- und Partitionsverfahren stehen in Rockchip_Developer_Guide_Android14_SDK_CN.pdf. Quelle: chinesisch,V1.0,RK-YH-YF-725,20 Seiten; keine englische Parallelquelle. Die Produkttabelle nennt für beide Chips Kernel6.10, die Befehle verwenden kernel-6.1; dieser Quellwiderspruch bleibt sichtbar. Hardwarebeispiele betreffen Rockchip-EVBs, keine bestätigte ArmSoM-Platinenunterstützung oder Tests. Befehle sind dokumentierte Beispiele und wurden nicht auf Hardware ausgeführt.

## 1.1 Quellcodedownload

Entwickler-Checkout initialisieren; für ein Servermirror --mirror ergänzen:

```sh
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/vehicle-manifests.git -m Android14_vehicle.xml
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/vehicle-manifests.git -m Android14_vehicle.xml --mirror
```

Einige Automotive-Repositories haben eigene Branches und Manifest-XML; der Großteil entspricht dem Tablet-SDK. repo-Nutzung, Repositoryhosting, Codeverwaltung und neue lunch-Ziele funktionieren gleich. Laut Quelle wurde die alte Adresse vorübergehend für Bestandskunden gepflegt und sollte schrittweise der neuen weichen; dies ist eine historische Aussage, keine aktuelle Verfügbarkeitsprüfung.

## 1.2 Kompilieren

Vollständiger RK3588M-AAOS-Build; für reine Kernelarbeit spart boot.img Zeit:

```sh
source build/envsetup.sh && lunch rk3588m_u-userdebug && ./build.sh -AUCKuo

cd kernel-6.1/
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig rk3588_vehicle.config android-14.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3588m_u/boot.img rk3588-vehicle-evb-v22.img
```

Entsprechende RK3576M-Vollbuild- und Kernelbefehle:

```sh
source build/envsetup.sh && lunch rk3576m_u-userdebug && ./build.sh -AUCKuo

cd kernel-6.1/
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig rk3576.config rk3576_vehicle.config android-14.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3576m_u/boot.img rk3576-vehicle-evb-v10.img -j32
```

## 2.1 Hardwarearchitektur

Die EVBs verwenden Basisplatinen mit Erweiterungsmodulen. Quellstände: RK3588M V22 und RK3576M V10. RK3588M unterstützt sechs SERDES-Displaymodule, ein AHD-Kameramodul, zwei SERDES-Kameramodule, ein PCIe-/SDIO-WLAN-Modul, ein RK3308-Audiomodul, ein PCIe-Modem-/Ethernetmodul sowie integriertes Ethernet/GNSS/FM. Module sind einzeln versorgbar; spätere EVBs können Hardware und Funktionen ändern.

![Blockdiagramm der RK3588M-Automotive-EVB](/docs/rockchip-android14-car-sdk/images/hardware-rk3588m.png)

Blockdiagramm der RK3588M-Automotive-EVB - Originalabbildung;PDF-Seite 5 (CN).

Der nächste Quellabsatz nennt erneut RK3588M, zeigt jedoch RK3576M: drei SERDES-Display- und drei SERDES-Kameramodule, PCIe-WLAN, RK2118-Audio, MCU, PCIe-Modem/Ethernet, integriertes Ethernet/GNSS/FM und individuelle Modulversorgung. Die abweichende Modellbezeichnung wird offengelegt statt stillschweigend umgedeutet.

![Blockdiagramm der RK3576M-Automotive-EVB](/docs/rockchip-android14-car-sdk/images/hardware-rk3576m.png)

Blockdiagramm der RK3576M-Automotive-EVB - Originalabbildung;PDF-Seite 5 (CN).

## 2.2.1 Zusätzliche Displaytreiber

Das modulare Design ist für Peripherie offen. Die meisten Module werden unterstützt; neue oder ungeprüfte Treiber folgen später. Display-SERDES wurde in Kernel und U-Boot unter drivers/mfd/display-serdes/ neu aufgebaut, mit dem Ziel allgemeiner SERDES-Kompatibilität. MAXIM,ROHM und Rockchip wurden erprobt; die Weiterentwicklung läuft.

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

MAXIM DSI:max96755/max96789 + max96772/max96752; eDP/DP:max96745/max96749 + max96752 (max96749 steht im Text, nicht in der Dateiliste). RK3588M realisiert zwei Eingänge/zwei Ausgänge mit max96789+max96752 und einen Eingang/zwei Ausgänge mit max96745+max96752 zur Kostenreduktion. ROHM: RK3588/RK3576-DSI direkt an bu18tl82; DP/eDP über LT7911 zu LVDS und dann bu18tl82. Folgende DTSI zeigen MAXIM eins-zu-eins, MAXIM-Split zwei-zu-zwei/eins-zu-zwei und ROHM eins-zu-eins.

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

Weiterführender Quellverweis:Rockchip_Developer_Guide_Android_Car_MultiDisplay_CN.pdf.

## 2.2.2 Kameramodule

RK3588M unterstützt AHD NVP6188 sowie MAXIM/THINE-SERDES-Kameramodule; RK3576M nur SERDES. NVP6188-AHD,THINE thcv244/thcv241 und MAXIM max96714/max96712/max96722 unterstützen jeweils vier1080P@30-Eingänge. Der THINE-Treiber ist an ein Kameramodul gebunden; beim Wechsel ist eine neue Initialisierungssequenz von THINE nötig.

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

## 2.2.3 Netzwerkmodule

Automotive-WLAN/BT: PCIe CYW89459 und SDIO CYW88373, jeweils UART-Bluetooth auf Erweiterungsmodulen. Ab RK3588M EVB V20 unterstützt die Basis100-Mbit-Realtek-RTL9010A-PHY und N303-GNSS über eine Standardschnittstelle. PCIe4G RM310 wird unterstützt; inkompatible Android-Anteile fehlen standardmäßig im SDK und sind als separater Patch vorgesehen.

```text
kernel/drivers/net/wireless/rockchip_wlan/infineon/
kernel/drivers/net/wireless/rockchip_wlan/cywdhd/
kernel/drivers/net/phy/realtek.c
hardware/techtotop/gnss
hardware/techtotop/gps
```

## 2.2.4 Audiomodule

RK3308/RK2118-Audiomodule bieten acht Lautsprecher und vier Mikrofone. Der Audiochip läuft als eigenes RTOS-System und benötigt Firmware; Flashen durch den Host war geplant. Unterstützt werden Wiedergabe, Aufnahme, Sprachaktivierung, Bluetooth-Telefonie und getrennte Audiosignale je Display, etwa vier Displays/vier Signale. Der Host verwendet simple-card.c; ein SPI-Audiotreiber für Firmware, Handshake und Register war geplant. Audio HAL schaltet Soundkartenrouten.

```text
kernel/sound/soc/generic/simple-card.c
android/hardware/rockchip/audio/alsa_hal
```

## 2.3.1 AAOS-Unterstützung

Neue Funktionen werden an RK3588M gezeigt und gelten entsprechend für RK3576M. Tablet-SDK:AOSP; Automotive-SDK:AAOS mit Android14-Fahrzeug-UI und Mehrbenutzerbetrieb, getrennten Fahrer-/Passagierrechten. Unterstützt werden mehrere Displays, Touchflächen, Hintergrundbeleuchtungen, Audiozonen und Kombiinstrument; noch benötigte Patches wurden über REDMINE geliefert. Nutzer arbeiten unabhängig. Obere APIs folgen Google; Quellverweis:https://source.android.com/docs/devices/automotive. Car API einschließlich CarSensorManager liegt unter /platform/packages/services/Car/car-lib, CarService unter packages/services/Car/, APKs unter packages/apps/Car/, die OEM-Fahrzeugeigenschaftsschnittstelle unter hardware/interfaces/automotive/vehicle/. EVS dient Rückfahransicht und AVM.

![Vehicle-HAL- und Android-Automotive-Architektur](/docs/rockchip-android14-car-sdk/images/aaos.png)

Vehicle-HAL- und Android-Automotive-Architektur - Originalabbildung;PDF-Seite 9 (CN).

## 2.3.2 Unabhängige Displays und Hintergrundbeleuchtung

RK3588M-U-Boot unterstützt DP/eDP-SPLIT für sechs unabhängige Displays und LOGO1–LOGO6. Weitere Logos verlängern den Start; standardmäßig sind nur zwei DSI-Logos aktiv, weitere per DTS. RK3576M startet mit drei Displays/Logos. AAOS ordnet Nutzer Displays zu; DTS,HWC und XML wurden angepasst. RK3588 unterstützt standardmäßig bis sechs Displays; XML sowie Display-IDs und EVB-Backlightpfade müssen produktbezogen angepasst werden.

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

Die Quelle schreibt edp2lvds_backligh1 ohne abschließendes t in backlight; unverändert, mit DTS abgleichen.

## 2.3.3 Mehrere Touchpanels

input-port-associations.xml verbindet Display-physicalPort mit Touch-Gerätenamen; das EVB-Beispiel zeigt sechs Displays/Touchpanels. Produktzuordnungen verwenden.

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

## 2.3.4 Mehrere Audiozonen

Der Release konfiguriert vier Audiozonen; nur zugeordnete Occupants können unabhängig Audio/Video abspielen. Für weitere Occupants Zonen, Ausgabegeräte und Zuordnungen ergänzen. Referenz:Rockchip_Developer_Guide_Android14_Car_Audio_CN.pdf.

```text
device/rockchip/rk3588/rk3588m_u/audio/car_audio_configuration.xml
device/rockchip/rk3588/rk3588m_u/audio/audio_policy_configuration.xml
```

## 2.3.5 EVS

EVS (Enhanced View System) ist das Android-Automotive-Framework für frühe Rückfahr- und Rundumsicht. Laut Quelle fehlen dokumentierte Funktionen: Camera Group und Logical Multi-camera werden in diesem Quellstand nicht unterstützt.

![EVS-Architektur](/docs/rockchip-android14-car-sdk/images/evs.png)

EVS-Architektur - Originalabbildung;PDF-Seite 11 (CN).

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

automotive/evs enthält HIDL-Schnittstellen. Im C++-Teil enthält apps native Rundum-/Rückfahrbeispiele, manager den AAOS-Dienst, sampleDriver den RK3588-VICAP-EVS-HAL und support_library eine derzeit ungenutzte Algorithmuserweiterung. CarEvsCameraPreviewApp ist das Java-EVS-Beispiel, SampleRearViewCamera das Rückfahrbeispiel; config.xml das Produkt-Overlay. Referenz:Rockchip_Developer_Guide_Automotive_Camera.pdf.

## 2.3.6 AVM-Rundumsicht

RK3588M unterstützt AVM mit vier/acht Kameras, standardmäßig vier. Code liegt in Camera360 und common/product-device-Verzeichnissen. Ältere APKs erlauben Kamera-IDs in avm_settings.xml; BOARD_CAMERA360_SUPPORT schaltet AVM. Referenz:Rockchip_Developer_Guide_Around_View_Monitor_CN.pdf.

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

## 2.3.7 Frühe Rückfahransicht im Kernel

RK3588M aktiviert und verlässt standardmäßig die Kernel-Rückfahransicht vor Android; Produkte lösen sie situationsabhängig aus. Optionen aktivieren und video_port/Plane in DTS wählen. Nur YUV über DVP/MIPI, kein RAW. Der Kernel fängt den Datenstrom ab, EVS HAL erhält ihn nicht: beide Varianten schließen sich hier aus. Kernel startet schneller, EVS ist flexibler; Koexistenz war geplant. Referenz:Rockchip_Android_Fast_Reverse_Image_System_Developer_Guide_CN.pdf.

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

## 3.1 DTS-Konfiguration

DTS passend zur Hardware wählen. RK3588M V10 hat einen PMIC,V20/V21/V22 zwei. V10: sechs ROHM-Displays,NVP6188 mit vier Kameras,PCIe-WLAN,RK3308,Kernel-Rückfahransicht. V20 wechselt zu SDIO-WLAN. V21/V22: vier ROHM-Touchdisplays,MAX96712 mit vier Kameras,PCIe-WLAN,RK3308,EVS. RK3576M V10: drei MAXIM-Touchdisplays,MAX96712 mit vier Kameras,PCIe-WLAN,RK2118,EVS.

```text
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v10.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v20.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v21.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v22.dts
kernel/arch/arm64/boot/dts/rockchip/rk3576-vehicle-evb-v10.dts
```

Module sind austauschbar. Für RK3576M-SERDES von MAXIM zu ROHM folgenden Include ändern; andere Module entsprechend der Hardware konfigurieren.

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

## 3.2 Konfiguration unabhängiger Displays

Displayanzahl und Schnittstellen können vom EVB abweichen. Der Patch reduziert sechs auf vier Displays. Mode:0=None Spiegelung,1=Slicing Zusammensetzen,2=Presentation unabhängige Displays. ConnectorCnt zählt intern registrierte Connectoren; bei Presentation reichen Type/TypeId. Die Quelle beschreibt dies als Connectorwahl für Split-Screen. DsiplayMode bleibt wörtlich. Weiterführender Quellname:„DrmHwc2多屏拼接异显功能说明.pd“.

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

## 3.3 Android-Boardkonfiguration

BoardConfig.mk muss zu EVB-Modulen passen. Skripte kopieren Dateien nach PRODUCT_KERNEL_DTS; Produkte können dies übernehmen. Das Beispiel wählt V21-HWC/EVS und MAX96712-TXD, sonst Standard-HWC und V20/NVP6188-AHD. Für V21 DTS und SDIO-Fragment durch PCIe ersetzen. android-11.config bleibt als Quellbeispiel trotz Android14 erhalten; mit dem Zielbranch prüfen.

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

## 3.4 Mehrbenutzerkonfiguration

Das Car-Service-Overlay setzt Mehrbenutzerbetrieb, maximale Occupantzahl und Displayzuordnungen. display_settings.xml definiert Namen/Backlight. Jedes Sekundärdisplay benötigt einen Eintrag; die ID in name,etwa port:4, muss displayPort in config_occupant_display_mapping entsprechen, sonst fehlt die Zuordnung. IDs aus dumpsys display,address etwa{port=3}, verwenden, nicht frei wählen. backlightPath muss DTS entsprechen; die Quelle nennt /sys/class/backlight/dp2lvds_backlight0/brightness als DSI-Beispiel. In init.car.rc allen Backlightknoten Besitzrechte zuweisen.

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

sdcard-Verzeichnis je Nutzer:/mnt/pass_through/{userId}/emulated/{userId}.

## 3.5 Mehrbenutzer-Debugging

Nutzer und Car-Service prüfen; VHAL-Ereignisse simulieren Fahrzeugeingaben.

```sh
pm list users
dumpsys car_service
dumpsys car_service inject-vhal-event {Vhal_prop_ID} {Vhal_prop_value}
```

## 3.6 Data-Dateisystem

ext4 und f2fs sorgfältig abwägen; data nutzt standardmäßig f2fs. Quelle:https://blog.csdn.net/weixin_43245753/article/details/124427177 und folgendes ext4-Beispiel. Änderungen betreffen Formatierung,Verschlüsselung und Checkpoints; vor Flashen Daten sichern und Produkt validieren. Auch recovery.fstab bzw.recovery.fstab_AB bei A/B ändern. Quell-Diffnamen mischen rk3588_s/rk3588m_u; historische Beispiele, keine allgemeingültigen Zielpfade.

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

## 3.7 Mehrbenutzerbetrieb entfernen

Schritt1: Headless-System-User in device/rockchip/common/car/packages_car.mk abschalten.

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

Schritt2: enablePassengerSupport und enableProfileUserAssignmentForMultiDisplay im Car-Service-Overlay abschalten. Danach bleiben Displays unabhängig, teilen aber einen Nutzer: unterschiedliche Apps je Display, nicht dieselbe App mehrfach. Für Spiegelung Schritte3–4 durchführen.

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

Schritt3: Sekundärdisplays besitzen SecondaryBottomSystemBar; config_enableBottomSystemBar im Passagier-SystemUI-Overlay deaktivieren.

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

Schritt4: Secondary Home entfernen, um unabhängige Sekundärausgabe durch Spiegelung zu ersetzen. MultiDisplaySecondaryHomeTestLauncher gemäß Patch aus packages_car.mk entfernen.

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
