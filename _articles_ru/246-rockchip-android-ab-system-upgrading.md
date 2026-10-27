---
title: "Руководство по обновлению системы A/B Rockchip Android"
description: "Руководство по обновлению системы A/B Rockchip Android — V1.2.0"
excerpt: "Руководство по обновлению системы A/B Rockchip Android"
translation_key: "246-rockchip-android-ab-system-upgrading"
slug: "246-rockchip-android-ab-system-upgrading"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, OTA, AB]
---

{% raw %}

# Руководство по обновлению системы A/B Rockchip Android

Полный технический текст шести глав (страницы 4–12) китайского RK-SM-YF-208 V1.2.0 от всего 12 страниц. Применимость Android >=12, настройки 12/13/>=14 и рекомендации по виртуальному A/B относятся к историческому SDK, не к текущей совместимости. Есть только китайский источник, английских оригинальных рисунков нет. Во всех изданиях сохранены восемь исходных иллюстраций; текст внутри не объявляется переведённым. Код, читаемые настройки и журналы на снимках редактируемы. Юридические/контактные страницы, аудитория, история изменений и повторное оглавление исключены. Сборка, обновление, прошивка и аппаратные тесты не выполнялись.

Вопросы источника: примеры Android 12/13 ссылаются на rk3399_Android11; в 6.1 написано installcelan и создаётся update_loader.zip, а 6.2 передаёт update.zip без объяснения выбора/переименования. Расхождения сохранены. Некоторые дефисы параметров make в главе 3 типографские — перед использованием проверьте ASCII. Патчи содержат переносы PDF и не проверены как готовые файлы. Снимок fstab отличается от текста (есть backup/system_ext, не все перечисленные узлы видны). Читаемые настройки, адреса и состояния расшифрованы; обрезанные пути и неясные хэши остаются в оригиналах без догадок. Имя файла/размер на странице 9 подтверждаются последующими строками того же снимка; хэши headers надёжно не читаются, поэтому расшифровка не является полным исполняемым сеансом обновления. Прошивка/OTA/загрузчик могут привести к потере данных или отказу загрузки: только разрешённые тестовые устройства, резервная копия, проверка разделов/прошивки и план восстановления. Сохранено исходное предупреждение против обычного обновления miniloader.

<!-- source:cn p2 unit:scope -->

| Название чипа | Версия ядра |
| --- | --- |
| <code>RK3326/RK3399/RK356x/RK3588</code> | <code>4.19, 5.10</code> |

<!-- source:cn p4 unit:0 -->

## 1. Обзор

<!-- source:cn p4 unit:1 -->

Документ описывает систему A/B Rockchip для Android >= 12. Все обновляемые разделы, кроме super, имеют копии a и b, что существенно увеличивает требования к памяти по сравнению с традиционным обновлением Recovery. Преимущество — бесшовное обновление во время работы Android по определённым заказчиком правилам и протоколам взаимодействия клиента с сервером.

<!-- source:cn p4 unit:2 -->

## 2. Конфигурация системы

<!-- source:cn p4 unit:3 -->

В Rockchip Android функция A/B по умолчанию отключена. Для её использования рассмотрите настройки Android, U-Boot и DTS ядра, описанные ниже.

<!-- source:cn p4 unit:4 -->

### 2.1 Настройка Android

<!-- source:cn p4 unit:5 -->

#### 2.1.1 Настройка Android 12

<!-- source:cn p4 unit:6 -->

Настройка Android 12 включает:

<!-- source:cn p4 unit:7-0 -->

1. Включите A/B в device\rockchip\rkxxx\BoardConfig.mk: BOARD_USES_AB_IMAGE=true вместо false по умолчанию. Пример для rk3326:

<!-- source:cn p4 unit:7-1 -->

```text
vim device/rockchip/rk3326_s/BoardConfig.mk
#AB image definition
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p4 unit:7-2 -->

Примечание: для виртуального A/B (не рекомендуется) задайте true для BOARD_USES_AB_IMAGE и BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE:

<!-- source:cn p4 unit:7-3 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p4 unit:8 -->

2. Проверьте наличие recovery.fstab_AB в соответствующем device\rockchip\rkxxx. Если файл есть, пропустите шаг; иначе: (1) создайте recovery.fstab_AB для A/B. В отличие от fstab.rk30board добавьте slotselect для A/B-разделов system/vendor/odm/product, узлы exernal_sd, frp, parameter, baseparameter и resource, а также измените параметры монтирования data. Пример: device\rockchip\rk3399\rk3399_Android12\recovery.fstab_AB:

<!-- source:cn p5 unit:9 -->

![Рисунок китайского источника и редактируемая расшифровка: p5](/docs/rockchip-android-ab-system-upgrading/assets/cn-p005-figure-01.png)

```text
# Android fstab file.
#<src> <mnt_point> <type> <mnt_flags and options> <fs_mgr_flags>
# The filesystem that contains the filesystem checker binary (typically /system) cannot
# specify MF_CHECK, and must come before any filesystems that do specify MF_CHECK
system /system ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
vendor /vendor ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
odm /odm ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
product /product ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
system_ext /system_ext ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
/dev/block/by-name/metadata /metadata ext4 nodev,noatime,nosuid,discard,sync wait,formattable,first_stage_mount
/dev/block/by-name/misc /misc emmc defaults defaults
/dev/block/by-name/cache /cache ext4 noatime,nodiratime,nosuid,nodev,noauto_da_alloc,discard wait,check
/dev/block/mmcblk0p1 /mnt/external_sd vfat /dev/block/mmcblk0 defaults
/dev/block/by-name/frp /frp emmc defaults defaults
/dev/block/by-name/baseparameter /baseparameter emmc defaults defaults
/dev/block/by-name/backup /backup emmc defaults defaults
/dev/block/zram0 none swap defaults zramsize=50%
/dev/block/by-name/userdata /data f2fs defaults defaults
```

<!-- source:cn p5 unit:10 -->

(2) Импортируйте настройки A/B в BoardConfig каталога device\rockchip\rkxxx, включая TARGET_RECOVERY_FSTAB с путём к новому recovery.fstab_AB.

<!-- source:cn p5 unit:11 -->

```text
device\rockchip\rk3399\rk3399_Android12\BoardConfig.mk：
diff --git a/ rk3399/rk3399_Android12/BoardConfig.mk b/
rk3399/rk3399_Android12/BoardConfig.mk
index 1e78940..159a3b6 100755
--- a/ rk3399/rk3399_Android12/BoardConfig.mk
+++ b/ rk3399/rk3399_Android12/BoardConfig.mk
+# AB image definition
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+
+ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
+    include device/rockchip/common/BoardConfig_AB.mk
+    TARGET_RECOVERY_FSTAB := device/rockchip/
rk3399/rk3399_Android11/recovery.fstab_AB
+endif
```

<!-- source:cn p5 unit:12 -->

#### 2.1.2 Настройка Android 13

<!-- source:cn p5 unit:13 -->

Настройка Android 13 включает:

<!-- source:cn p5 unit:14-0 -->

1. Включите A/B в device\rockchip\rkxxx\BoardConfig.mk: BOARD_USES_AB_IMAGE=true вместо false по умолчанию. Пример для rk3326:

<!-- source:cn p5 unit:14-1 -->

```text
vim device/rockchip/rk3326_s/BoardConfig.mk
#AB image definition
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p5 unit:14-2 -->

Примечания: (1) Для виртуального A/B (не рекомендуется из-за влияния на производительность обновления) задайте true для BOARD_USES_AB_IMAGE и BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE:

<!-- source:cn p5 unit:14-3 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p5 unit:14-4 -->

(2) С Android 13 поддерживается сжатое виртуальное A/B. Для включения (не рекомендуется из-за влияния на производительность обновления) задайте true для BOARD_USES_AB_IMAGE, BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE и BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION:

<!-- source:cn p6 unit:15-0 -->

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

<!-- source:cn p6 unit:16 -->

2. Проверьте наличие recovery.fstab_AB в соответствующем device\rockchip\rkxxx. Если файл есть, пропустите шаг; иначе: (1) создайте recovery.fstab_AB для A/B. В отличие от fstab.rk30board добавьте slotselect для A/B-разделов system/vendor/odm/product, узлы exernal_sd, frp, parameter, baseparameter и resource, а также измените параметры монтирования data. Пример: device\rockchip\rk3399\rk3399_Android12\recovery.fstab_AB:

<!-- source:cn p6 unit:17 -->

![Рисунок китайского источника и редактируемая расшифровка: p6](/docs/rockchip-android-ab-system-upgrading/assets/cn-p006-figure-01.png)

```text
# Android fstab file.
#<src> <mnt_point> <type> <mnt_flags and options> <fs_mgr_flags>
# The filesystem that contains the filesystem checker binary (typically /system) cannot
# specify MF_CHECK, and must come before any filesystems that do specify MF_CHECK
system /system ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
vendor /vendor ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
odm /odm ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
product /product ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
system_ext /system_ext ext4 ro,barrier=1 wait,slotselect,logical,first_stage_mount
/dev/block/by-name/metadata /metadata ext4 nodev,noatime,nosuid,discard,sync wait,formattable,first_stage_mount
/dev/block/by-name/misc /misc emmc defaults defaults
/dev/block/by-name/cache /cache ext4 noatime,nodiratime,nosuid,nodev,noauto_da_alloc,discard wait,check
/dev/block/mmcblk0p1 /mnt/external_sd vfat /dev/block/mmcblk0 defaults
/dev/block/by-name/frp /frp emmc defaults defaults
/dev/block/by-name/baseparameter /baseparameter emmc defaults defaults
/dev/block/by-name/backup /backup emmc defaults defaults
/dev/block/zram0 none swap defaults zramsize=50%
/dev/block/by-name/userdata /data f2fs defaults defaults
```

<!-- source:cn p6 unit:18 -->

(2) Импортируйте настройки A/B в BoardConfig каталога device\rockchip\rkxxx, включая TARGET_RECOVERY_FSTAB с путём к новому recovery.fstab_AB.

<!-- source:cn p6 unit:19 -->

```text
device\rockchip\rk3399\rk3399_Android12\BoardConfig.mk：
diff --git a/ rk3399/rk3399_Android12/BoardConfig.mk b/
rk3399/rk3399_Android12/BoardConfig.mk
index 1e78940..159a3b6 100755
--- a/ rk3399/rk3399_Android12/BoardConfig.mk
+++ b/ rk3399/rk3399_Android12/BoardConfig.mk
+# AB image definition
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+
+ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
+    include device/rockchip/common/BoardConfig_AB.mk
+    TARGET_RECOVERY_FSTAB := device/rockchip/
rk3399/rk3399_Android11/recovery.fstab_AB
+endif
```

<!-- source:cn p6 unit:20 -->

#### 2.1.3 Настройка Android >= 14

<!-- source:cn p6 unit:21 -->

Настройка Android 14 включает:

<!-- source:cn p6 unit:22 -->

1. Включите соответствующую настройку A/B в device\rockchip\: BOARD_USES_AB_IMAGE=true вместо false по умолчанию. Пример:

<!-- source:cn p7 unit:23 -->

```text
diff --git a/rk3588_u/BoardConfig.mk b/rk3588_u/BoardConfig.mk
index e30391c..c7a86ce 100644
--- a/rk3588_u/BoardConfig.mk
+++ b/rk3588_u/BoardConfig.mk
@@ -14,7 +14,10 @@
+
+BOARD_USES_AB_IMAGE := true
```

<!-- source:cn p7 unit:24-0 -->

Примечания: (1) Для виртуального A/B (не рекомендуется из-за влияния на производительность обновления) задайте true для BOARD_USES_AB_IMAGE и BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE:

<!-- source:cn p7 unit:24-1 -->

```text
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

<!-- source:cn p7 unit:24-2 -->

(2) Для сжатого виртуального A/B в версиях GKI (не рекомендуется из-за влияния на производительность обновления) задайте true для BOARD_USES_AB_IMAGE, BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE и BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION:

<!-- source:cn p7 unit:24-3 -->

```text
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

<!-- source:cn p7 unit:25 -->

### 2.2 Настройка DTS ядра

<!-- source:cn p7 unit:26 -->

Для Android >= 12 настройка ядра не требуется.

<!-- source:cn p7 unit:27 -->

### 2.3 Настройка U-Boot

<!-- source:cn p7 unit:28 -->

Добавьте CONFIG_ANDROID_AB=y в конфигурацию U-Boot для конкретного чипа. Пример показан на снимке ниже.

<!-- source:cn p7 unit:29 -->

![Рисунок китайского источника и редактируемая расшифровка: p7](/docs/rockchip-android-ab-system-upgrading/assets/cn-p007-figure-01.png)

```text
diff --git a/configs/rk3326_defconfig b/configs/rk3326_defconfig
old mode 100644
new mode 100755
index 0465f23..d4648c
--- a/configs/rk3326_defconfig
+++ b/configs/rk3326_defconfig
@@ -114,3 +114,4 @@ CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
 CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
 CONFIG_TEST_ROCKCHIP=y
+CONFIG_ANDROID_AB=y
```

<!-- source:cn p7 unit:30 -->

### 2.4 Добавление разделов в утилиту прошивки

<!-- source:cn p7 unit:31 -->

Добавьте пункты записи разделов B; в каждую пару A/B записывается одинаковая прошивка. Для Android >= 12 сборка по разделу 3 автоматически создаёт config.cfg в rockdev/xxxx/. Замените одноимённый файл RKDevTool и заново откройте утилиту; ручная настройка не нужна. Ниже пример интерфейса.

<!-- source:cn p8 unit:32 -->

![Рисунок китайского источника и редактируемая расшифровка: p8](/docs/rockchip-android-ab-system-upgrading/assets/cn-p008-figure-01.png)

```text
RKDevTool v2.63
Loader Ver:1.18
# Address Name
1 0x00000000 Loader
2 0x00000000 Parameter
3 0x00004000 Uboot_a
4 0x00006000 Uboot_b
5 0x00008000 trust_a
6 0x0000A000 trust_b
7 0x0000C000 Misc
8 0x00028000 Dtbo_a
9 0x0002A000 Dtbo_b
10 0x0002C000 vbmeta_a
11 0x0002C800 vbmeta_b
12 0x0002D000 Boot_a
13 0x0004D000 Boot_b
```

<!-- source:cn p8 unit:33 -->

Примечание: у rk3566/rk3568/rk3588 и подобных чипов нет раздела trust, поэтому trust_a и trust_b не нужны.

<!-- source:cn p8 unit:34 -->

## 3. Сборка A/B-системы и пакета OTA

<!-- source:cn p8 unit:35 -->

Собирайте A/B-прошивку строго в следующем порядке. Способ 1:

<!-- source:cn p8 unit:36 -->

```text
source build/envsetup.sh
lunch XXX
make installclean –j16  OR make clean -j16
make –j16
make dist –j16
mkimage_ab.sh  ota
```

<!-- source:cn p8 unit:37 -->

Способ 2:

<!-- source:cn p8 unit:38 -->

```text
source build/envsetup.sh
lunch XXX
./build.sh -ABUCKuop
```

<!-- source:cn p8 unit:39 -->

Примечания:

<!-- source:cn p8 unit:40 -->

1. После включения A/B перед первой сборкой выполните make clean.

<!-- source:cn p8 unit:41 -->

2. Дельта-пакеты собираются как для системы без A/B. Подробности полных и дельта-пакетов — в Rockchip_Developer_Guide_Android_Recovery_CN. Проверка A/B OTA описана в разделе 4 «Проверка (клиент и сервер)».

<!-- source:cn p9 unit:42 -->

## 4. Проверка (клиент и сервер)

<!-- source:cn p9 unit:43 -->

Бесшовное обновление может загружать и применять пакет одновременно; требуются HTTP-сервер и клиент обновления. Для проверки используйте update_device.py. Производственные клиент и сервер заказчик разрабатывает самостоятельно; образцом клиента служит Android update_engine_client. Пример update_device.py показывает его использование через adb. Метод проверки: скрипт превращает хост в HTTP-сервер через adb и вызывает update_engine_client для бесшовного обновления. Выполните следующую команду на хосте с исправными adb и Python:

<!-- source:cn p9 unit:44 -->

```text
system/update_engine/scripts/update_device.py {升级包名字}
```

<!-- source:cn p9 unit:45 -->

Пример:

<!-- source:cn p9 unit:46 -->

![Рисунок китайского источника и редактируемая расшифровка: p9](/docs/rockchip-android-ab-system-upgrading/assets/cn-p009-figure-01.png)

```text
sudo system/update_engine/scripts/update_device.py ~/rk3326_evb-ota-eng.jdy.zip
INFO:root:Running: adb reverse tcp:1234 tcp:37213
INFO:root:Running: adb shell su 0 update_engine_client --update --follow --payload=http://127.0.0.1:1234/payload --offset=5501 --size=451914571
FILE_SIZE=451914571
METADATA_SIZE=59119
USER_AGENT=Dalvik (something, something)
NETWORK_ID=0
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_IDLE (0), 0)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_UPDATE_AVAILABLE (2), 0)
127.0.0.1 - - [17/Jul/2018 17:24:40] "GET /payload HTTP/1.1" 206 -
INFO:root:Serving request for /payload from /home/jdy/rk3326_evb-ota-eng.jdy.zip [5501, 451920072) length: 451914571
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 4.84229e-05)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0100547)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0200611)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0300673)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0400735)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0500798)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0600861)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0700924)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0800987)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.0901049)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.100111)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.110118)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.120124)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.13013)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.140137)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.150143)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.160149)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.170155)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.180161)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.190168)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.200174)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.21018)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.220187)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.230193)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.240199)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.250205)
```

<!-- source:cn p10 unit:47 -->

![Рисунок китайского источника и редактируемая расшифровка: p10](/docs/rockchip-android-ab-system-upgrading/assets/cn-p010-figure-01.png)

```text
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.230193)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.240199)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.250205)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.260212)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.270218)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.280224)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.290231)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.300237)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.310243)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.320249)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.330256)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.340262)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.350268)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.360275)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.370281)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.380287)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.390293)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.4003)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.410306)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.420312)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.430318)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.440325)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.450331)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.460337)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.470344)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.48035)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.490356)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.500362)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.510369)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.520375)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.530381)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.540388)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.550394)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.5604)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.570406)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.580413)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.590419)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.600425)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.610432)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.620438)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.630444)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.64045)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.650457)
```

<!-- source:cn p10 unit:48 -->

![Рисунок китайского источника и редактируемая расшифровка: p10](/docs/rockchip-android-ab-system-upgrading/assets/cn-p010-figure-02.png)

```text
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.780538)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.790545)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.800551)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.810557)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.820563)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.83057)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.840576)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.850582)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.860589)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.870595)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.880601)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.890607)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.900614)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.91062)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.920626)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.930633)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.940639)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.950645)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.960651)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.970658)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.980664)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_DOWNLOADING (3), 0.99067)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.01)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.03)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.04)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.05)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.08)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.12)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.13)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.14)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.16)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.17)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.19)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.21)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.22)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.23)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.25)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.26)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.27)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.29)
```

<!-- source:cn p11 unit:49 -->

![Рисунок китайского источника и редактируемая расшифровка: p11](/docs/rockchip-android-ab-system-upgrading/assets/cn-p011-figure-01.png)

```text
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.53)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.55)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.56)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.58)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.6)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.61)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.62)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.64)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.65)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.66)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.68)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.7)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.71)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.73)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.74)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.75)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.77)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.78)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.79)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.81)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.83)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.84)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.86)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.87)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.88)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.9)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.91)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.92)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.94)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.95)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.96)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.97)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 0.99)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_FINALIZING (5), 1)
[INFO:update_engine_client_android.cc(90)] onStatusUpdate(UPDATE_STATUS_UPDATED_NEED_REBOOT (6), 0)
[INFO:update_engine_client_android.cc(98)] onPayloadApplicationComplete(ErrorCode::kSuccess (0))
INFO:root:Running: adb reverse --remove tcp:1234
INFO:root:Server Terminated
jdy@jdy-Latitude-E6440:/media/jdy/LDSecond/rk3326/rk3326_8.X$
```

<!-- source:cn p11 unit:50 -->

На снимках выше показан процесс обновления из источника. После успешного завершения выводится UPDATE_STATUS_UPDATED_NEED_REBOOT. Затем перезагрузите устройство вручную для перехода в обновлённую систему.

<!-- source:cn p11 unit:51 -->

## 5. Важные замечания

<!-- source:cn p11 unit:52-0 -->

1. При упаковке update.img добавьте соответствующие разделы в package-file. Пример для trust и uboot приведён ниже; остальные разделы аналогичны.

<!-- source:cn p11 unit:52-1 -->

```text
trust_a Image/trust.img
trust_b Image/trust.img
uboot_a Image/uboot.img
uboot_b Image/uboot.img
```

<!-- source:cn p11 unit:52-2 -->

Примечание: у rk3566/rk3568/rk3588 и подобных чипов нет раздела trust, поэтому trust_a и trust_b не нужны.

<!-- source:cn p11 unit:53 -->

## 6. OTA miniloader для A/B

<!-- source:cn p11 unit:54 -->

Miniloader — загрузчик первой стадии Rockchip. Обычно его OTA-обновление не требуется и не рекомендуется. В исключительных случаях используйте описанный способ для A/B Rockchip. Пакет OTA miniloader независим от обычного пакета A/B и не связан с ним. Создайте специальный пакет по разделу 6.1 и реализуйте клиент по 6.2. Эти команды переводят устройство в recovery для обновления miniloader A/B-системы с автоматической перезагрузкой после завершения.

<!-- source:cn p12 unit:55 -->

### 6.1 Сборка пакета обновления rkloader

<!-- source:cn p12 unit:56 -->

Для Android >= 12 после сборки прошивки в режиме OTA (исходная команда: make installcelan && make -j16 && make dist -j16 && ./mkimage_ab.sh ota) автоматически созданный rockdev/update_loader.zip является пакетом OTA rk loader.

<!-- source:cn p12 unit:57 -->

### 6.2 Пример команд обновления

<!-- source:cn p12 unit:58 -->

APK клиента обновления может реализовать следующую последовательность команд:

<!-- source:cn p12 unit:59 -->

```text
adb root
adb push update.zip /cache/
adb shell "echo \"--fw_rkloader=/cache/update.zip\" > /cache/recovery/command"
adb reboot recovery
```

{% endraw %}
