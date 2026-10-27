---
title: "Rockchip Android14 Automotive SDK: драйверы, дисплеи и настройка"
description: "Rockchip Android14 Automotive SDK: драйверы, дисплеи и настройка"
excerpt: "Rockchip Android14 Automotive SDK: драйверы, дисплеи и настройка"
translation_key: "243-rockchip-android14-car-sdk"
slug: "243-rockchip-android14-car-sdk"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14 Automotive SDK: драйверы, дисплеи и настройка

Руководство по автомобильному SDK Android14 для Rockchip RK3588M/RK3576M описывает дополнительные драйверы, функции и типовые проблемы. Общие операции с репозиториями, сборкой, прошивкой и разделами приведены в Rockchip_Developer_Guide_Android14_SDK_CN.pdf. Источник: китайский V1.0,RK-YH-YF-725,20 страниц; английской пары нет. Таблица продукта называет Kernel6.10 для обоих чипов, команды используют kernel-6.1; расхождение сохранено. Аппаратные примеры относятся к Rockchip EVB, не подтверждают поддержку или испытания плат ArmSoM. Команды сохранены как примеры и на оборудовании не выполнялись.

## 1.1 Загрузка исходников

Инициализация рабочей копии; для серверного зеркала добавить --mirror:

```sh
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/vehicle-manifests.git -m Android14_vehicle.xml
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/vehicle-manifests.git -m Android14_vehicle.xml --mirror
```

Часть автомобильных репозиториев использует отдельные ветви и manifest XML, большая часть кода совпадает с планшетным SDK. Работа repo, размещение репозиториев, управление кодом и добавление lunch-целей одинаковы. Источник сообщает о временной поддержке старого адреса для существующих клиентов с последующим переходом на новый; это историческое утверждение, не проверка текущей доступности.

## 1.2 Сборка

Полная сборка AAOS RK3588M; при работе только с ядром достаточно boot.img:

```sh
source build/envsetup.sh && lunch rk3588m_u-userdebug && ./build.sh -AUCKuo

cd kernel-6.1/
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig rk3588_vehicle.config android-14.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3588m_u/boot.img rk3588-vehicle-evb-v22.img
```

Соответствующие команды полной сборки и ядра RK3576M:

```sh
source build/envsetup.sh && lunch rk3576m_u-userdebug && ./build.sh -AUCKuo

cd kernel-6.1/
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig rk3576.config rk3576_vehicle.config android-14.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3576m_u/boot.img rk3576-vehicle-evb-v10.img -j32
```

## 2.1 Аппаратная архитектура

EVB используют базовую плату и дочерние модули для расширяемости. Версии источника: RK3588M V22 и RK3576M V10. RK3588M поддерживает шесть SERDES-дисплейных плат, одну AHD-камерную, две SERDES-камерные, одну PCIe/SDIO Wi-Fi, одну RK3308-аудиоплату, одну PCIe-модемную/Ethernet-плату и встроенные Ethernet/GNSS/FM. Питание модулей независимо; будущие EVB могут менять аппаратные возможности.

![Блок-схема автомобильной EVB RK3588M](/docs/rockchip-android14-car-sdk/images/hardware-rk3588m.png)

Блок-схема автомобильной EVB RK3588M - Оригинальная иллюстрация;страница PDF 5 (CN).

Следующий абзац источника тоже назван RK3588M, но сопровождается схемой RK3576M: три SERDES-дисплейные и три SERDES-камерные платы, PCIe Wi-Fi, RK2118-аудио, MCU, PCIe-модем/Ethernet, встроенные Ethernet/GNSS/FM и независимое питание модулей. Несоответствие названия отмечено, а не исправлено без предупреждения.

![Блок-схема автомобильной EVB RK3576M](/docs/rockchip-android14-car-sdk/images/hardware-rk3576m.png)

Блок-схема автомобильной EVB RK3576M - Оригинальная иллюстрация;страница PDF 5 (CN).

## 2.2.1 Дополнительные драйверы дисплея

Модульная конструкция открыта для периферии. Большинство модулей поддержано, новые/непроверенные драйверы будут добавлены позднее. SERDES-дисплей переработан в ядре и U-Boot в drivers/mfd/display-serdes/ с целью охватить все решения SERDES. MAXIM,ROHM и Rockchip отлажены, работа продолжается.

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

MAXIM DSI:max96755/max96789 + max96772/max96752; eDP/DP:max96745/max96749 + max96752 (max96749 есть в тексте, не в списке файлов). RK3588M реализует два входа/два выхода max96789+max96752 и один вход/два выхода max96745+max96752 для снижения стоимости. ROHM: DSI RK3588/RK3576 прямо в bu18tl82; DP/eDP через LT7911 в LVDS, затем bu18tl82. DTSI ниже: MAXIM один-к-одному, MAXIM разделение два-к-двум/один-к-двум, ROHM один-к-одному.

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

Дополнительная ссылка источника:Rockchip_Developer_Guide_Android_Car_MultiDisplay_CN.pdf.

## 2.2.2 Камерные модули

RK3588M поддерживает AHD NVP6188 и SERDES MAXIM/THINE; RK3576M только SERDES. NVP6188 AHD,THINE thcv244/thcv241 и MAXIM max96714/max96712/max96722 обеспечивают четыре входа1080P@30. Драйвер THINE привязан к определённому модулю; при замене нужна новая последовательность инициализации от THINE.

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

## 2.2.3 Сетевые модули

Автомобильные Wi-Fi/BT: PCIe CYW89459 и SDIO CYW88373, Bluetooth через UART, дочерние платы. Начиная с RK3588M EVB V20 база поддерживает100-Мбит PHY Realtek RTL9010A и GNSS N303 через стандартный последовательный порт. PCIe4G RM310 поддержан, но несовместимые части Android не включены по умолчанию; доступен отдельный патч.

```text
kernel/drivers/net/wireless/rockchip_wlan/infineon/
kernel/drivers/net/wireless/rockchip_wlan/cywdhd/
kernel/drivers/net/phy/realtek.c
hardware/techtotop/gnss
hardware/techtotop/gps
```

## 2.2.4 Аудиомодули

Аудиоплаты RK3308/RK2118 имеют восемь динамиков и четыре микрофона. Чип работает как отдельная RTOS-система и требует прошивки; прошивка с хоста планировалась. Есть воспроизведение, запись, голосовое пробуждение, Bluetooth-звонки и отдельный звук экранов, например четыре экрана/четыре потока. Хост использует simple-card.c; SPI-драйвер для прошивки, обмена и регистров планировался. Audio HAL переключает маршруты звуковой карты.

```text
kernel/sound/soc/generic/simple-card.c
android/hardware/rockchip/audio/alsa_hal
```

## 2.3.1 Поддержка AAOS

Примеры новых функций используют RK3588M и аналогичны для RK3576M. Планшетный SDK —AOSP, автомобильный —AAOS с UI Android14 и многопользовательским режимом, разделяющим права водителя/пассажиров. Поддержаны экраны, сенсоры, подсветки, аудиозоны и приборная панель; недостающие патчи предоставлялись через REDMINE. Пользователи работают независимо. API стандартные Google; ссылка источника:https://source.android.com/docs/devices/automotive. Car API с CarSensorManager расположен в /platform/packages/services/Car/car-lib; CarService в packages/services/Car/, APK в packages/apps/Car/, OEM-интерфейс свойств машины в hardware/interfaces/automotive/vehicle/. EVS обслуживает задний ход и AVM.

![Архитектура Vehicle HAL и Android Automotive](/docs/rockchip-android14-car-sdk/images/aaos.png)

Архитектура Vehicle HAL и Android Automotive - Оригинальная иллюстрация;страница PDF 9 (CN).

## 2.3.2 Независимые экраны и подсветка

U-Boot RK3588M поддерживает DP/eDP SPLIT для шести независимых экранов и LOGO1–LOGO6. Логотипы замедляют запуск, поэтому исходно включены только два DSI; остальные включают в DTS. RK3576M: три экрана/логотипа. AAOS связывает пользователя с экраном; DTS,HWC и XML адаптированы. RK3588 по умолчанию до шести экранов; измените XML для изделия. ID дисплеев и пути подсветки соответствуют EVB и также требуют адаптации.

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

В источнике узел edp2lvds_backligh1 написан без t в backlight; сохранено, сверить с DTS.

## 2.3.3 Несколько сенсорных панелей

input-port-associations.xml связывает physicalPort экрана с именем сенсора; EVB показывает шесть экранов/сенсоров. Используйте реальные связи изделия.

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

## 2.3.4 Несколько аудиозон

В выпуске четыре аудиозоны; независимое воспроизведение доступно только назначенным Occupant. Для остальных добавьте зоны, выходы и соответствия зона/Occupant. Ссылка:Rockchip_Developer_Guide_Android14_Car_Audio_CN.pdf.

```text
device/rockchip/rk3588/rk3588m_u/audio/car_audio_configuration.xml
device/rockchip/rk3588/rk3588m_u/audio/audio_policy_configuration.xml
```

## 2.3.5 EVS

EVS (Enhanced View System) —каркас Android Automotive для раннего заднего вида и кругового обзора. Источник предупреждает: не все документированные функции Google EVS реализованы; Camera Group и Logical Multi-camera в этом состоянии отсутствуют.

![Архитектура EVS](/docs/rockchip-android14-car-sdk/images/evs.png)

Архитектура EVS - Оригинальная иллюстрация;страница PDF 11 (CN).

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

HIDL-интерфейсы находятся в automotive/evs. В C++ apps —нативные примеры кругового обзора/заднего хода; manager —служба AAOS; sampleDriver —HAL для RK3588 VICAP; support_library —неиспользуемое расширение алгоритмов. CarEvsCameraPreviewApp —Java-пример EVS, SampleRearViewCamera —пример заднего вида; config.xml —overlay изделия. Ссылка:Rockchip_Developer_Guide_Automotive_Camera.pdf.

## 2.3.6 Круговой обзор AVM

RK3588M поддерживает AVM из четырёх/восьми камер, исходно четыре. Код —Camera360 и каталоги common/product device. Старые APK позволяют менять ID камер в avm_settings.xml; BOARD_CAMERA360_SUPPORT включает/выключает AVM. Ссылка:Rockchip_Developer_Guide_Around_View_Monitor_CN.pdf.

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

## 2.3.7 Ранний задний вид в ядре

По умолчанию RK3588M входит и выходит из раннего заднего вида до Android; изделие запускает по сценарию. Включите опции и укажите video_port/слой DTS. Поддерживаются YUV-камеры DVP/MIPI, не RAW. Ядро перехватывает поток, недоступный EVS HAL: варианты взаимоисключающие. Ядро быстрее стартует, EVS гибче; совместимость только планировалась. Ссылка:Rockchip_Android_Fast_Reverse_Image_System_Developer_Guide_CN.pdf.

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

## 3.1 Настройка DTS

Выберите DTS по аппаратной версии. RK3588M V10 —один PMIC,V20/V21/V22 —два. V10: шесть ROHM-дисплеев,NVP6188 четыре камеры,PCIe Wi-Fi,RK3308,задний вид ядра. V20 заменяет Wi-Fi на SDIO. V21/V22: четыре ROHM с сенсорами,MAX96712 четыре камеры,PCIe Wi-Fi,RK3308,EVS. RK3576M V10: три MAXIM с сенсорами,MAX96712 четыре камеры,PCIe Wi-Fi,RK2118,EVS.

```text
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v10.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v20.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v21.dts
kernel/arch/arm64/boot/dts/rockchip/rk3588-vehicle-evb-v22.dts
kernel/arch/arm64/boot/dts/rockchip/rk3576-vehicle-evb-v10.dts
```

Модули заменяемы. Для смены SERDES RK3576M с MAXIM на ROHM измените include. Остальные модули настраиваются по аппаратуре аналогично.

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

## 3.2 Настройка независимых дисплеев

Число экранов и интерфейсы изделия могут отличаться от EVB. Патч сокращает шесть экранов до четырёх. Mode:0=None зеркалирование,1=Slicing сшивка,2=Presentation независимые экраны. ConnectorCnt —число зарегистрированных коннекторов; для Presentation нужны только Type/TypeId. Источник описывает выбор коннекторов для разделённого экрана. Имя DsiplayMode сохранено. Ссылка источника буквально:«DrmHwc2多屏拼接异显功能说明.pd».

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

## 3.3 Конфигурация платы Android

BoardConfig.mk должен соответствовать модулям EVB. Скрипты копируют файлы по PRODUCT_KERNEL_DTS; аналогично для изделия. Пример выбирает HWC/EVS V21 и MAX96712-TXD, иначе обычный HWC и V20/NVP6188-AHD. Для V21 замените DTS и SDIO-фрагмент на PCIe. В исходном примере android-11.config, хотя руководство Android14; сверить с целевой ветвью.

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

## 3.4 Многопользовательская конфигурация

Overlay Car-service задаёт многопользовательский режим, максимум occupant и привязки экранов. display_settings.xml задаёт имена и подсветку. Добавьте каждый вторичный дисплей: ID в name,например port:4, должен совпадать с displayPort в config_occupant_display_mapping, иначе экран не найден. Используйте address из dumpsys display,например{port=3}, не произвольные ID. backlightPath должен соответствовать DTS; источник приводит /sys/class/backlight/dp2lvds_backlight0/brightness для DSI. Назначьте владельца всем узлам подсветки в init.car.rc.

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

Каталог sdcard пользователя:/mnt/pass_through/{userId}/emulated/{userId}.

## 3.5 Отладка нескольких пользователей

Проверьте пользователей и Car service; инъекция VHAL моделирует вход автомобиля.

```sh
pm list users
dumpsys car_service
dumpsys car_service inject-vhal-event {Vhal_prop_ID} {Vhal_prop_value}
```

## 3.6 Файловая система data

Оцените ext4 и f2fs; исходно data использует f2fs. Источник ссылается на https://blog.csdn.net/weixin_43245753/article/details/124427177 и даёт пример ext4. Изменения затрагивают форматирование, шифрование и checkpoint; перед прошивкой сохраните данные и проверьте изделие. Измените также recovery.fstab либо recovery.fstab_AB для A/B. Метки исходного diff смешивают rk3588_s/rk3588m_u; сохранены как исторический пример, не универсальная цель.

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

## 3.7 Отключение нескольких пользователей

Шаг1: отключить headless-system-user в device/rockchip/common/car/packages_car.mk.

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

Шаг2: отключить enablePassengerSupport и enableProfileUserAssignmentForMultiDisplay в overlay Car-service. После шагов1–2 экраны остаются независимыми, но пользователь один: разные экраны открывают разные приложения, не отдельные экземпляры одного приложения. Для зеркалирования выполните шаги3–4.

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

Шаг3: вторичные дисплеи имеют SecondaryBottomSystemBar; отключите config_enableBottomSystemBar в overlay SystemUI пассажира.

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

Шаг4: удалите Secondary Home для зеркалирования вместо независимого вторичного экрана. Уберите MultiDisplaySecondaryHomeTestLauncher из packages_car.mk согласно патчу.

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
