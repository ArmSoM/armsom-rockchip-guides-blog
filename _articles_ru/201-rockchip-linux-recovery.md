---
title: "Руководство по обновлению Rockchip Linux Recovery"
description: "Руководство по обновлению Rockchip Linux Recovery — V1.2.1"
excerpt: "Руководство по обновлению Rockchip Linux Recovery"
translation_key: "201-rockchip-linux-recovery"
slug: "201-rockchip-linux-recovery"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Recovery, OTA]
---

{% raw %}

# Руководство по обновлению Rockchip Linux Recovery

Основа — китайский и английский RK-KF-YF-353 V1.2.1 от 2021-07-30; техническая основа — китайский текст. Исходный охват: RK3308, RK3226, RK3399, RK3288, RK3326, PX30 и другие платформы Linux 4.4. Для ArmSoM проверяйте конкретную плату, SoC, SDK/BSP, разделы и накопители. Команды устройств и аппаратная проверка не выполнялись. Заводской сброс и wipe_all/wipe_data удаляют данные; создание SD и запись прошивки также могут перезаписать носитель. Сделайте резервные копии и проверьте цели. Вводное утверждение источника «без потерь» не означает сохранение данных во всех процедурах.

## 1. Обновление OTA

### 1.1 Обзор

OTA (Over-the-Air) — беспроводная доставка обновлений, стандартный способ обновления ПО Android. Источник описывает обновление без потери данных, автоматическую загрузку пакетов по Wi-Fi, 3G/4G и обновление с пакета на SD-карте или USB-накопителе. Указанный типичный размер пакета — от нескольких до примерно десяти с лишним MB; это не гарантия для любой прошивки. Документ рассматривает локальную программу recovery, процесс обновления, технические подробности и меры предосторожности при разработке.

### 1.2 Сборка

Основная система rootfs: включите update, задав BR2_PACKAGE_UPDATE=y в файле configs.

```text
source envsetup.sh
#choose a combo number to build rootfs according to platform chip
make menuconfig
```

Подробные настройки:

```text
Target packages  --->
[*] Rockchip BSP packages  --->
[*]   Rockchip OTA update for linux
```

Recovery: конфигурации платформ вынесены в buildroot/configs/rockchip/recovery.config. Выполните следующую команду в корне SDK.

```text
./build.sh recovery
```

При успехе создаётся buildroot/output/rockchip_rkxxxx_recovery/images/recovery.img, где rkxxxx — конкретный чип. Затем выполните:

```text
./mkfirmware.sh
```

Прошивка копируется в rockdev/. Основные исходники: external/recovery/ создаёт бинарный recovery — ключевую программу режима восстановления; external/rkupdate/ создаёт rkupdate, разбирающий данные разделов update.img и выполняющий их обновление. Китайский источник уточняет: rkupdate вызывается из recovery. После изменения этих каталогов сборка выполняется так:

1. Выполнить source envsetup.sh.

2. Выбрать конфигурацию recovery нужной платформы.

3. Английский источник: make recovery-dirclean &amp;&amp; recovery. Китайский: make recovery-dirclean &amp;&amp; make recovery; см. сверку источников.

4. Выполнить make rkupdate-dirclean &amp;&amp; make rkupdate.

5. Выполнить ./build.sh recovery.

6. Выполнить ./mkfirmware.sh.

7. Записать recovery.img.

### 1.3 Процесс обновления

#### 1.3.1 Подготовка прошивки

Измените tools/linux/Linux_Pack_Firmware/rockdev/package-file согласно обновляемым разделам. В корне SDK выполните:

```text
./build.sh updateimg
```

Образы разделов из package-file упаковываются в update.img в каталоге rockdev/; этот файл используется для обновления. Ошибка “Error!imageHead.uiTag !=0x57464B52” означает ошибку упаковки. Пересоздайте update.img указанным способом и повторите.

![Ошибка пакета обновления](/docs/rockchip-linux-recovery/assets/en-p006-figure-01.png)

#### 1.3.2 Выполнение обновления

Поместите update.img в корень SD-карты или USB-накопителя либо в /userdata устройства. В обычной системе выполните update ota /xxx/update.img: устройство перейдёт в recovery и начнёт обновление. Точки монтирования: USB — /udisk; SD — /mnt/sdcard/ или /sdcard; flash — /userdata/. После успеха устройство перезапускается в обычную систему. Схема процесса приведена ниже.

![Процесс обновления OTA](/docs/rockchip-linux-recovery/assets/en-p007-figure-01.png)

### 1.4 Восстановление заводского состояния

Доступные для записи настройки хранятся в userdata. Заводская прошивка содержит значения по умолчанию; пользователь создаёт или меняет конфигурацию при работе. Для удаления этих данных и возврата к заводской конфигурации запустите update без аргументов либо с factory/reset: устройство перейдёт в recovery для сброса.

### 1.5 Замечания

Не обязательно обновлять все разделы: удалите ненужные из package-file, чтобы уменьшить update.img. Если пакет содержит recovery.img, этот раздел обновляется в обычной системе до перехода в recovery, чтобы отключение питания при его записи не сорвало обновление остальных разделов. misc включать не рекомендуется: загрузчик обновления его игнорирует, а после успеха recovery всё равно очищает команды и параметры misc. Если update.img лежит в userdata на flash, НЕ включайте userdata.img в package-file: это может повредить файловую систему и помешать монтированию oem/userdata. При обновлении с SD или USB userdata.img можно включить; после обновления выполняется изменение размера userdata.

## 2. Отладка

### 2.1 Журналы режима recovery

В каталоге buildroot/output/rockchip_rkxxxx_recovery/target создайте скрытый файл:

```text
touch .rkdebug
```

Журнал обновления recovery выводится через последовательный порт:

![Включение журналов recovery](/docs/rockchip-linux-recovery/assets/en-p009-figure-01.png)

Другой способ — после успешного обновления прочитать журнал в userdata/recovery на устройстве. В тексте источник пишет Log, в команде — log; учитывайте регистр.

```text
cat userdata/recovery/log
```

### 2.2 Устройства с экраном и без него

Если recovery завершается ошибкой и выводит:

```text
failed to read font: res=-1, fall back to the compiled-in font
cannot find/open a drm device: No such file or directory
```

Сообщение означает, что устройство DRM не найдено или не открывается. Для устройства с экраном подключите экран; для устройства без экрана настройте следующее. Этот раздел источника говорит, что конфигурация SDK по умолчанию рассчитана на отсутствие экрана; противоречие с FAQ отмечено ниже.

```text
cd Path_to_SDK/buildroot/package/rockchip/recovery

vim recovery.mk
```

Откройте recovery.mk из buildroot/package/rockchip/recovery, как показано на рисунке.

![Сборка без экрана](/docs/rockchip-linux-recovery/assets/en-p010-figure-01.png)

При BR2_PACKAGE_RECOVERY_NO_UI макрос RecoveryNoUi получает true; иначе подключаются библиотеки отображения.

```text
ifeq ($(BR2_PACKAGE_RECOVERY_NO_UI),y)
TARGET_MAKE_ENV += RecoveryNoUi=true
else
RECOVERY_BUILD_OPTS += -lz -lpng -ldrm
RECOVERY_DEPENDENCIES += libzlib libpng libdrm
endif
```

Для устройства без экрана включите BR2_PACKAGE_RECOVERY_NO_UI в конфигурации recovery. После изменения соберите:

1. source envsetup.sh rockchip_xxxx_recovery, где xxxx — конкретная платформа.

2. В make menuconfig включить No UI for recovery.

3. Выполнить make recovery-dirclean &amp;&amp; make recovery.

4. Выполнить ./build.sh recovery.

5. Выполнить ./mkimage.sh, как указано именно в этом разделе источника.

6. Записать rockdev/recovery.img.

#### 2.2.1 Поворот и отображение на устройствах с экраном

Для поворота интерфейса обновления recovery согласно ориентации экрана выполните следующие действия.

1. Обновить исходники recovery.

2. В minui/graphics.c изменить параметр gr_rotate, вызываемого из gr_init. ROTATION_NONE — без поворота; ROTATION_RIGHT — 90° по часовой стрелке; ROTATION_DOWN — 180°; ROTATION_LEFT — 270°.

3. Пересобрать recovery, создать и записать образ раздела. Для изменения видимой яркости интерфейса источник предлагает последний параметр gr_color — alpha: 255 полностью непрозрачно, 0 полностью прозрачно. Это прозрачность, не настройка аппаратной подсветки. Фоновые картинки можно заменить в external/recovery/res/images, сохранив имена файлов.

### 2.3 Обновление Debian и Ubuntu

Та же OTA-схема recovery применяется в Debian/Ubuntu. Recovery должен распознавать узлы разделов и записывать соответствующие образы. Buildroot создаёт универсальные псевдонимы by-name через udev; в Debian/Ubuntu их отсутствие мешает работе. Скопируйте buildroot/output/rockchip_rkxxxx/target/lib/udev/rules.d/61-partition-init.rules либо buildroot/output/rockchip_rkxxxx_recovery/target/lib/udev/rules.d/61-partition-init.rules в подходящий каталог, например rootfs/overlay-debug/lib/udev/rules.d/. rkxxxx обозначает RK3308, RK3328, RK3399, RK3326 и т. п. После загрузки для узлов /dev/mmcblk0p0, /dev/mmcblk0p1, /dev/mmcblk0p2, /dev/mmcblk0p3 и других должны появиться имена /dev/block/by-name/uboot, /dev/block/by-name/misc, /dev/block/by-name/boot, /dev/block/by-name/rootfs и т. п.; это примеры, а не универсальное соответствие номеров. Если остаются следующие узлы:

```text
root@linaro-alip :~# ls /dev/block/
179:0 179:3 179:5 179:7 179:96 7:0 7:3 7:6
179:1 179:32 179:6 179:8 1:0 7:1 7:4 7:7
179:2 179:4 179:64 179:9 254:0 7:2 7:5
```

Попробуйте поместить 61-partition-init.rules в /etc/udev/rules.d/ или /lib/udev/rules.d/ системы Debian/Ubuntu.

## 3. Обновление с загрузочной SD-карты

Раздел описывает создание загрузочной SD-карты и обновление устройства с ещё не прошитым чипом. Используйте инструмент из tools\windows\SDDiskTool в каталоге проекта.

![Создание SD-карты обновления](/docs/rockchip-linux-recovery/assets/en-p012-figure-01.png)

Выберите подготовленный update.img и нажмите запуск создания; при успехе появится сообщение. В корне SD-карты будут два файла, а выбранный update.img переименуется в sdupdate.img. Вставьте карту в устройство и снова подайте питание. Следующий журнал подтверждает успешную загрузку с SD.

```text
U-Boot 2017.09-g1bee468 (Oct 11 2018 - 16:53:06 +0800) V1.000
Model: USM-110 a102-1
Board:Advantech usm110_rk3288 Board,HW version:0
DRAM: 2 GiB
Relocation Offset is: 7ff5a000
PMIC: RK808
vdd_arm 1100000 uV
vdd_gpu 1100000 uV
vcc_io 3300000 uV
regulator(LDO_REG2) init 3300000 uV
regulator(LDO_REG3) init 1100000 uV
regulator(LDO_REG4) init 1800000 uV
regulator(LDO_REG5) init 3300000 uV
```

```text
regulator(LDO_REG6) init 1100000 uV
regulator(LDO_REG7) init 1800000 uV
regulator(LDO_REG8) init 1800000 uV
MMC: dwmmc@ff0c0000: 1, dwmmc@ff0f0000: 0
SF: Detected w25q32bv with page size 256 Bytes, erase size 4 KiB, total 4 MiB
*** Warning - bad CRC, using default environment
In: serial
Out: serial
Err: serial
switch to partitions #0, OK
mmc1 is current device
do_rkimg_test found IDB in SDcard
Boot from SDcard
enter Recovery mode!
SF: Detected w25q32bv with page size 256 Bytes, erase size 4 KiB, total 4 MiB
Skipped ethaddr assignment due to invalid,using default!
Net: No ethernet found.
Hit any key to stop autoboot: 0
ANDROID: reboot reason: "recovery"
FDT load addr 0x10f00000 size 263 KiB
Booting kernel at 0x3575c70 with fdt at 42cf470...
```

Следующий вывод последовательного порта показывает, что запущенный с SD recovery обновляет устройство с не прошитым чипом.

```text
firmware update will from SDCARD.
is_sdcard_update out
sdupdate_package = /mnt/sdcard/sdupdate.img
Command: "/usr/bin/recovery"
sdboot update will update from /mnt/sdcard/sdupdate.img
start with main.
```

## 4. Приложение

### 4.1 Раздел misc

misc — первые четыре буквы miscellaneous («разное»). Раздел пришёл из Android и в Linux обычно используется для обновления системы или заводского сброса. Чтение/запись происходит в следующих случаях.

1. U-Boot: при включении первым запускается U-Boot и читает misc. Поле command выбирает обычную загрузку или recovery: boot-recovery запускает recovery, пустая команда — обычную систему.

2. Recovery: после входа в recovery читается часть recovery раздела misc, определяющая обновление, удаление пользовательских данных и другие действия. Структура misc показана ниже.

![Структура misc BootLoader Msg](/docs/rockchip-linux-recovery/assets/en-p014-figure-01.png)

Пример RK3308: откройте misc.img как двоичный файл в WinHex или UltraEdit. Структура BootLoader Msg начинается со смещения 16K (16384 байта) от начала файла.

![Пример двоичного смещения misc](/docs/rockchip-linux-recovery/assets/en-p014-figure-02.png)

Поддерживаемые команды recovery перечислены в OPTIONS файла external/recovery/recovery.c.

#### 4.1.1 Выбор misc.img

Шаблоны misc.img находятся в device/rockchip/rockimg относительно корня SDK. При создании прошивки конфигурация определяет копируемый файл.

```text
.
├ ── blank-misc.img     #blank misc partition file
├── pcba_small_misc.img #infrequently used
├── pcba_whole_misc.img #infrequently used
└── wipe_all-misc.img   #format the misc partition file used by the user
partition
```

Основные варианты — blank-misc.img и wipe_all-misc.img. Откройте BoardConfig.mk нужного чипа для выбора misc.img.

```text
cd device/rockchip/rkxxxx
vim BoardConfig.mk
```

![Выбор misc в BoardConfig.mk](/docs/rockchip-linux-recovery/assets/en-p015-figure-01.png)

На рисунке по умолчанию выбран wipe_all-misc.img. После записи такого misc форматируются пользовательский раздел /userdata или /data и настраиваемый /oem. Для входа сразу в обычную систему замените файл misc image в BoardConfig.mk на blank-misc.img, затем пересоберите прошивку.

### 4.2 Recovery в разных сценариях

#### 4.2.1 Первое включение

Для устройства с записанными misc.img и recovery.img источник показывает следующий журнал первого включения. Конкретное действие зависит от команды в misc.

```text
Boot command: boot-recovery
Got arguments from boot message
Command: "recovery" "--wipe_all"
format '/dev/block/by-name/userdata' to ext2 filesystem
executing '/sbin/mke2fs'
executed '/sbin/mke2fs' done
executed '/sbin/mke2fs' return 0
executing '/sbin/e2fsck'
e2fsck 1.43.9 (8-Feb-2018)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/block/by-name/userdata: 11/2304 files (0.0% non-contiguous), 82/2299 blocks
executed '/sbin/e2fsck' done
executed '/sbin/e2fsck' return 0
executing '/usr/sbin/e2fsck'
e2fsck 1.43.9 (8-Feb-2018)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
```

```text
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/block/by-name/oem: 18/2448 files (0.0% non-contiguous), 513/16384 blocks
executed '/usr/sbin/e2fsck' done
executed '/usr/sbin/e2fsck' return 1
executing '/usr/sbin/resize2fs'
resize2fs 1.43.9 (8-Feb-2018)
The filesystem is already 16384 (1k) blocks long. Nothing to do!
executed '/usr/sbin/resize2fs' done
executed '/usr/sbin/resize2fs' return 0
```

#### 4.2.2 Заводской сброс

Запустите update из командной строки: устройство перейдёт в recovery, выполнит форматирование и автоматически вернётся в обычную систему.

```text
update (or update reset)
```

Вывод последовательного порта:

```text
I:Boot command: boot-recovery
I:Got arguments from boot message
Command: "recovery" "--wipe_data"
format '/dev/block/by-name/userdata' to ext2 filesystem
executing '/sbin/mke2fs'
[ 4.692437] vendor storage:20160801 ret = -1
[ 6.030842] phy phy-ff008000.syscon:usb2-phy@100.0: charger =
USB_SDP_CHARGER
[ 10.891460] random: nonblocking pool is initialized
```

#### 4.2.3 Обновление

Команда update ota /xxx/update.img переводит устройство в recovery и запускает обновление.

```text
update ota /udisk/update.img
```

Пример журнала обновления с USB-накопителя:

```text
I:Boot command: boot-recovery
I:Got arguments from boot message
Command: "recovery" "--update_package=/udisk/update.img"
。。。。
librkupdate_ui_print = parameter writing....
########### RKA_Gpt_Download #########
librkupdate_###### Download trust ... #######
```

### 4.3 Частые вопросы

#### 4.3.1 “cannot find or open a drm device”

На платформах, отличных от RK3308, после входа в recovery может появиться следующий вывод:

```text
we are in recovery, skip init oem/userdata
start debug recovery...
Starting recovery on Fri Jan 18 09:19:51 2013
failed to read font: res=-1, fall back to the compiled-in font
Starting network: cannot find/open a drm device: No such file or directory
```

Подключите поддерживаемый дисплей или HDMI. По журналу recovery не может найти или открыть DRM-устройство. Этот раздел источника утверждает, что на платформах кроме RK3308 UI включён по умолчанию; невозможность открыть дисплей приводит к ошибке. Для работы без экрана на RK3399, RK3288 и подобных платформах выполните следующее.

1. Выполнить source envsetup.sh.

2. Ввести номер конфигурации recovery текущей платформы.

3. В make menuconfig включить No UI for recovery.

```text
> Target packages  --->
[*] Rockchip BSP packages  --->
[*]   Rockchip recovery for linux
[*]   No UI for recovery
[ ]   Linux AB bool control
Linux A/B bringup features. (successful_boot)  --->
choice the update bin of recovery. (rkupdate)  --->
-*-   recovery bin
[ ]   updateEngine bin
```

Тогда external/recovery/Makefile не компилирует код отображения.

![Объектные файлы под управлением RecoveryNoUi](/docs/rockchip-linux-recovery/assets/en-p018-figure-01.png)

4. Пересобрать пакет recovery.

```text
make recovery-dirclean && make recovery
```

5. Пересоздать прошивку recovery.

```text
./build.sh recovery
```

6. Сформировать прошивку.

```text
./mkfirmware.sh
```

#### 4.3.2 Изменение команды по умолчанию в misc

Для упаковки других команд recovery в misc или использования пустого misc измените mkfirmware.sh в корне проекта, как показано на рисунке.

![Выбор misc в mkfirmware.sh](/docs/rockchip-linux-recovery/assets/en-p019-figure-01.png)

#### 4.3.3 Файловая система vfat для userdata

SDK по умолчанию использует ext2/ext4 для userdata. Для перехода на vfat32 источник предлагает следующие изменения.

1. Изменить board/rockchip/rkxxxx/fs-overlay-recovery/etc/fstab. До изменения:

```text
/dev/block/by-name/userdata /userdata ext2 defaults0
```

После изменения:

```text
/dev/block/by-name/userdata /userdata vfat defaults0 0
```

2. В configs/rockchip_rkxxxx_release_defconfig добавить:

```text
BR2_PACKAGE_DOSFSTOOLS=y
BR2_PACKAGE_DOSFSTOOLS_FATLABEL=y
BR2_PACKAGE_DOSFSTOOLS_FSCK_FAT=y
BR2_PACKAGE_DOSFSTOOLS_MKFS_FAT=y
```

3. Изменить package/rockchip/usbdevice/S50usbdevice.

```text
start)
mkdir /dev/usb-ffs -m 0770
mkdir /dev/usb-ffs/adb -m 0770
mount -t configfs none /sys/kernel/config
mkdir /sys/kernel/config/usb_gadget/rockchip -m 0770
echo 0x2207 > /sys/kernel/config/usb_gadget/rockchip/idVendor
echo "ums_adb" >
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
mount -t functionfs adb /dev/usb-ffs/adb
mount -t vfat /dev/disk/by-partlabel/userdata /media/usb0
export service_adb_tcp_port=5555
adbd &
sleep 1
```

4. Убедиться, что применён патч 0001-common-mk-userdata-Fix-wrong-FS_TYPE-check.patch.

```text
case $FS_TYPE in
ext[2-4])
$COMMON_DIR/mke2img.sh $USERDATA_DIR $USERDATA_IMG
;;
fat|vfat)
SIZE=$(du -h -BM --max-depth=1 $USERDATA_DIR|awk '{print int($1)}')
# echo "create image size=${SIZE}M"
dd if=/dev/zero of=$USERDATA_IMG bs=1M count=$SIZE >/dev/null 2>&1
mkfs.vfat $USERDATA_IMG >/dev/null 2>&1
mcopy -i $USERDATA_IMG $USERDATA_DIR/* ::/ >/dev/null 2>&1
;;
*)
echo "file system: $FS_TYPE not support."
exit 1
;;
Esac
```

5. Изменить common/mk-userdata.sh.

```text
SIZE=$(du -h -BM --max-depth=1 $USERDATA_DIR|awk '{print int($1)}')
# echo "create image size=${SIZE}M"
dd if=/dev/zero of=$USERDATA_IMG bs=1M count=$SIZE >/dev/null 2>&1
mkfs.vfat -F 32 $USERDATA_IMG >/dev/null 2>&1
mcopy -i $USERDATA_IMG $USERDATA_DIR/* ::/ >/dev/null 2>&1
;;
*)
```

6. В rk3308/BoardConfig.mk заменить export RK_USERDATA_FS_TYPE=ext2 следующей настройкой.

```text
# Set userdata partition type, including ext2, fat
export RK_USERDATA_FS_TYPE=vfat
```

#### 4.3.4 Не форматировать userdata или data

Если в BoardConfig.mk выбран wipe_all-misc.img, но требуется сохранить userdata/oem, источник предлагает изменить main в external/recovery/reocvery.c (опечатка пути; правильное имя recovery.c). Китайский источник предлагает закомментировать, английский — удалить код в красной рамке ниже. Затем пересобрать и записать recovery. Это изменение поведения сброса требует проверки под конкретный проект.

![Ветвь wipe_all](/docs/rockchip-linux-recovery/assets/en-p021-figure-01.png)

#### 4.3.5 Проблемы обновления с SD

SD-карта применяется для первоначальной записи чипа или обновления flash. Глава 3 описывает нормальный запуск recovery с SD. Если обновление не идёт и последовательный порт молчит, причиной может быть совмещение выводов SD и отладочного UART2. Ниже пример RK1808; RK3288, RK3399 и RK3399PRO рассматриваются аналогично с учётом платформы.

1. По схеме проверьте, совмещены ли GPIO SD-карты с UART2. Если да, в U-Boot dtsi включите SDMMC и отключите UART2, используемый по умолчанию для отладки. Если нет, проверьте питание и инициализацию SD.

2. Перенастройте UART loader в SDK/rkbin/tools/ddrbin_param.txt. При подключении проводами к uart1 m0 задайте uart id=1; для uart1 m1 — uart id=1 и uart iomux=1.

3. Пересоздать ddr.bin следующей командой.

```text
cd SDK/rkbin/tools
rkbin/tools$./ddrbin_tool ddrbin_param.txt
../bin/rk1x/rk1808_ddr_933MHz_v1.04.bin
```

Имя rk1808_ddr_933MHz_v1.04.bin должно соответствовать реальному файлу в SDK/rkbin/bin/rk1x/. Каталог платформы зависит от первых двух цифр номера чипа. Параметры ddrbin_tool описаны в SDK/rkbin/tools/ddrbin_tool_user_guide.txt.

4. Изменить DTS ядра. Для смены отладочного UART недостаточно ddr.bin: требуется также настройка ядра.

![Настройка UART отладчика FIQ](/docs/rockchip-linux-recovery/assets/en-p022-figure-01.png)

5. Изменить cmdline в kernel/arch/arm64/boot/dts/rockchip/rk1808-evb-v10.dts.

```text
chosen {
    bootargs = "earlycon=uart8250,mmio32,0xff550000 console=ttyFIQ0
root=PARTUUID=614e0000-0000 rootfstype=ext4 rootwait swiotlb=1 kpti=0
snd_aloop.index=7";
};
```

Адрес 0xff550000 замените по выбранному UART. Адреса ищутся в arch/arm64/boot/dts/rockchip/rk1808.dtsi или соответствующем дереве другой платформы. Для RK1808: uart2 — serial@ff550000, uart1 — serial@ff540000.

![Адреса регистров UART RK1808](/docs/rockchip-linux-recovery/assets/en-p022-figure-02.png)

6. Собрать прошивку. U-Boot: ./build.sh uboot либо ./make.sh rk1808 внутри u-boot. Созданные файлы находятся в u-boot:

```text
u-boot/
├── rk1808_loader_v1.03.104.bin
├── trust.img
└── uboot.img
```

Ядро: ./build.sh kernel. Recovery: ./build.sh recovery. Затем ./build.sh updateimg. Пробелы после точки в английском источнике исправлены по китайскому.

7. После правильной записи прошивки:

1. Упаковать update.img и записать на SD-карту через SDDiskTool_v1.62 или новее.

2. Выключить плату, вставить SD и включить. Журнал должен появиться на uart1 или другом выбранном UART, подключённом проводами; по нему анализируют проблему обновления с SD.

## Сверка источников и ограничения

- Оба источника V1.2.1. Китайский текст начинается на странице 4, английский — 5; сохранены четыре главы, пять FAQ и технические рисунки. Китайский уточняет внутренний вызов rkupdate из recovery и основные шаблоны blank-misc.img/wipe_all-misc.img; эти сведения дополняют английский.
- В английском make recovery-dirclean && recovery пропущен make; китайский: make recovery-dirclean && make recovery. В конце английского “. /build.sh” исправляется по китайскому на ./build.sh. Исходный код сохранён с пояснениями. Раздел 2.2 использует ./mkimage.sh, другие — ./mkfirmware.sh; взаимозаменяемость не предполагается, проверяйте SDK.
- Раздел 2.2 называет отсутствие UI стандартом, FAQ 4.3.1 — включённый UI для всех кроме RK3308. Противоречие есть в обоих источниках. Проверяйте BR2_PACKAGE_RECOVERY_NO_UI и Makefile. gr_color alpha — прозрачность (255 непрозрачно, 0 прозрачно), не аппаратная подсветка.
- external/recovery/reocvery.c — опечатка recovery.c. Китайский предлагает закомментировать красную рамку, английский удалить; меняется ветвь wipe_all, но не обязательно все пути стирания. На рисунке вызываются erase_volume("/userdata") и resize_volume("/oem"); утверждение о форматировании обоих разделов проверяется по реализации.
- В обоих fstab-примерах склеены defaults0 / defaults0 0: проверьте разделение полей. Английский case заканчивается Esac вместо esac; исходный пример сохранён с предупреждением. Log и log различаются регистром. update (or update reset) обозначает альтернативы, а не команду со скобками.
- Диаграмма misc: всего 1088 байт — Command 32, Status 32, Recovery 768, Reserved 256; пример RK3308 начинается с байта 16384. mis и wip_all на рисунках — опечатки; сверяйте misc, wipe_all и OPTIONS в коде. Английская схема не показывает обход при отсутствии recovery в пакете, хотя текст явно делает его обновление условным.
- Для SD/UART согласуйте pinmux U-Boot, UART ID/IOMUX loader, rockchip,serial-id отладчика FIQ ядра и адрес cmdline. Значение serial-id 2 на рисунке RK1808 заменяется согласно проводам; UART2=0xff550000, UART1=0xff540000. Это примеры исходной платформы, не универсальные адреса ArmSoM.

{% endraw %}
