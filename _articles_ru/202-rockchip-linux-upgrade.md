---
title: "Руководство по обновлению Rockchip Linux updateEngine"
description: "Руководство по обновлению Rockchip Linux updateEngine — V1.2.0"
excerpt: "Руководство по обновлению Rockchip Linux updateEngine"
translation_key: "202-rockchip-linux-upgrade"
slug: "202-rockchip-linux-upgrade"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Recovery, OTA, updateEngine]
---

{% raw %}

# Руководство по обновлению Rockchip Linux updateEngine

Основа — китайский и английский RK-KF-YF-348 V1.2.0 от 2023-03-06; китайский служит базой. Платформы источника: RK3308/Linux 4.4 и RV1126/RV1109/Linux 4.19. Сохранены восемь глав, таблицы разделов/структур/параметров, код и схемы. Для ArmSoM проверяйте плату, SDK, разделы и цепочку загрузки. Обновления и аппаратные тесты не выполнялись. Запись прошивки, создание SD и wipe_userdata удаляют или перезаписывают данные: сначала сделайте копии и проверьте цели. Описание восстановления после потери питания и A/B-отката не гарантирует невозможность повреждения произвольного устройства.

## 1. Обзор и исходный код

### 1.1 Обзор

Rockchip Linux поддерживает два режима загрузки: recovery и Linux A/B.

1. Recovery: отдельный раздел recovery используется для обновления.

2. Linux A/B: имеются две переключаемые прошивки. Выберите режим по требованиям, учитывая преимущества и недостатки каждого.

### 1.2 Исходный код

Для Rockchip Linux предусмотрены две реализации обновления.

| Реализация | Исходники | Recovery | Linux A/B | Описание |
| --- | --- | --- | --- | --- |
| updateEngine | external/recovery/update_engine; external/recovery | Да | Да | По умолчанию RV1126/RV1109 |
| rkupdate | external/rkupdate | Да | Нет | Другие платформы, здесь не рассматривается |

## 2. Режим Recovery

### 2.1 Обзор

Дополнительный раздел recovery состоит из kernel+resource+ramdisk и предназначен для обновления. U-Boot читает поля misc и выбирает обычную систему либо recovery. Независимость recovery позволяет продолжить прерванное обновление, например после потери питания. Преимущество:

1. Обеспечивается целостность обновления. Недостатки:

1. Нужен дополнительный раздел исключительно для обновления.

2. Для обновления требуется перезапуск в recovery; обновлять непосредственно в обычной системе нельзя. Разделы:

| Раздел | Образ | Описание |
| --- | --- | --- |
| loader | MiniLoaderAll.bin | Загрузчик первого уровня |
| u-boot | uboot.img | Загрузчик второго уровня |
| trust | trust.img | Защищённая среда, например OP-TEE/ATF; некоторые платформы объединяют trust и uboot |
| misc | misc.img | Параметры загрузки |
| recovery | recovery.img | Корневая файловая система kernel+dtb+ramdisk |
| boot | boot.img | kernel+dtb |
| rootfs | rootfs.img | Корневая файловая система, только чтение |
| oem | oem.img | Данные производителя, чтение/запись |
| userdata | userdata.img | Данные пользователя, чтение/запись |

### 2.2 Настройка и сборка

Buildroot: выберите в конфигурации recovery (make menuconfig):

```text
BR2_PACKAGE_RECOVERY=y  #turn on upgrade related functions
BR2_PACKAGE_RECOVERY_USE_UPDATEENGINE=y #use the new upgrade program, if not
configured, the original upgrade process will be used by default.
BR2_PACKAGE_RECOVERY_RECOVERYBIN=y  #turn on recovery bin file
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y #compile the new upgrade program
BR2_PACKAGE_RECOVERY_NO_UI=y # disable UI
```

Buildroot: выберите в конфигурации rootfs (make menuconfig):

```text
BR2_PACKAGE_RECOVERY=y #turn on upgrade related functions
BR2_PACKAGE_RECOVERY_USE_UPDATEENGINE=y #use the new upgrade program
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y  #compile the new upgrade program
BR2_PACKAGE_RECOVERY_NO_UI=y # disable UI
```

С экраном и без: источник говорит, что только RK3308 использует recovery без экрана. Для других чипов включите следующее в buildroot/package/rockchip/recovery/recovery.mk; английский путь обрывается на recovery, расширение восстановлено по китайскому.

```text
TARGET_MAKE_ENV += RecoveryNoUi=true
```

Источник указывает, что SDK уже включает эти настройки. Исходники находятся в external/recovery/. После изменений соберите так:

```text
# Step1: run the following command:
source envsetup.sh
# Step2: choose the rootfs configuration of a platform,and then run the following
command:
make recovery-dirclean
source envsetup.sh
# Step3: choose the recovery configuration of a platform, and then run the
following command:
make recovery-dirclean
./build.sh
# Step4: flashing the firmware again.
```

Для более нового SDK можно попробовать:

```text
./build.sh external/recovery
./build.sh
# flashing the firmware again.
```

### 2.3 Обновление OTA

Поддерживается локальное и сетевое обновление с выбором разделов. Команды выполняются в обычной системе. Сетевое обновление:

```text
# updateEngine --misc=update --image_url=firmware address --partition=0x3FFC00 --
version_url=version file address --savepath=/userdata/update.img --reboot
updateEngine --image_url=http://172.16.21.110:8080/recovery/update.img \
    --misc=update --savepath=/userdata/update.img --reboot &
```

Локальное обновление:

```text
updateEngine --image_url=/userdata/update.img --misc=update \
    --savepath=/userdata/update.img --reboot &
```

Последовательность:

1. Сравнить версии прошивки (--version_url).

2. Скачать прошивку (--image_url) и сохранить локально (--savepath).

3. Обновить раздел recovery.

4. Перезапустить (--reboot).

5. Войти в recovery и обновить выбранные разделы (--partition).

6. После успеха перезапустить обычную систему. Необязательные параметры:

1. --version_url: удалённый или локальный адрес. Без него версии не сравниваются.

2. --savepath: путь сохранения прошивки, по умолчанию /tmp/update.img; рекомендуется /userdata/update.img.

3. --partition: маска обновляемых разделов, рекомендуется 0x3FFC00. OTA не поддерживает обновление parameter и loader. Подробности ниже в параметрах.

4. --reboot: после обновления recovery перезапустить в recovery.

### 2.4 Просмотр журналов

1. Последовательный порт: в buildroot/output/rockchip_***/target выполните:

```text
touch .rkdebug
```

Этот скрытый файл включает вывод журнала recovery через последовательный порт.

2. После обновления прочитайте файл userdata/recovery/Log на устройстве.

```text
cat userdata/recovery/Log
```

## 3. Дифференциальное обновление

Инструменты Linux SDK в tools/linux/Linux_Diff_Firmware/ создают дифференциальные пакеты. Поддерживаются uboot/trust/kernel и rootfs с squashfs. Не поддерживаются доступные для записи ext2/ext3/ext4, разделы на слое MTD (например UBI/NAND), зашифрованные разделы и OTA в режиме A/B.

### 3.1 Зависимости и сборка

Создание и применение дифференциальных пакетов требует изменений в трёх проектах:

```text
.
├── buildroot
│   └── 0001-package-recovery-add-bzip2-dependency.
│   └── 0002-bsdiff-use-mmap-to-save-memory-when-apply-patch.patch
├── external
│   └── recovery
│       └── 0001-update_engine-add-differ-ota-funcion.patch
│       └── 0002-update_engine-recover-from-unexpected-reboot-when-do.patch
└── tools
    └── 0001-ota-add-diff-firmware-script.patch
```

Убедитесь, что эти изменения присутствуют. Иначе обновите SDK или запросите патчи у Rockchip. На ПК нужны bsdiff и md5sum. Установка bsdiff:

```text
sudo apt install bsdiff
```

### 3.2 Требования к размеру разделов

Источник не устанавливает требования к DDR в зависимости от размера патча. Свободное место должно вмещать сумму update_diff.img и полного нового rootfs.img. Если пакет лежит в /userdata, там должно оставаться место для нового rootfs.img.

### 3.3 Создание дифференциального пакета

Старую и новую OTA-прошивки распаковывают, вычисляют различия и упаковывают результат.

![Руководство по обновлению Rockchip Linux updateEngine — diff](/docs/rockchip-linux-upgrade/assets/en-differential-flow.png)

Дифференциальный процесс: распаковать старый и новый update.img, вычислить различия uboot/trust/boot/rootfs, затем вместе с недифференцируемыми разделами нового образа упаковать их в diff_img.

Важно: китайская основа требует новую OTA image, содержащую только обновляемые разделы, а не полный образ для первоначальной записи. Для старой прошивки рекомендуется полный update.img, содержащий как минимум обновляемые разделы. Старая прошивка должна точно совпадать с установленной на целевом устройстве. Пример:

```text
cd tools/linux/Linux_Diff_Firmware/
./mk-diff-ota.sh update_old.img update_new.img update_diff.img
```

Созданный update_diff.img заменяет новый update.img при OTA на устройстве. Использовать нужно updateEngine: rkupdate пока не поддерживает разбор дифференциальных пакетов.

## 4. Режим Linux A/B

### 4.1 Обзор

Две независимые системные прошивки хранятся во flash. Загрузка возможна из любого слота; при неудаче текущего используется другой. Обновление выполняется прямо в обычной системе без специального режима, после чего перезапуск загружает новую систему. Два слота дают преимущества:

1. Обновление прямо в текущей системе без перезапуска в режим обновления.

2. При неудаче обновления можно вернуться к текущей версии, предотвращая неработоспособность.

3. При повреждении текущей системы ошибочными действиями происходит переключение на другой слот. Недостаток:

1. Два слота занимают больше flash. Источник далее утверждает, что miniloader, trust и uboot уже имеют резервные копии, а двойными являются только boot/system. Однако таблица ниже содержит uboot_a/uboot_b; это противоречие необходимо сверить с конкретным SDK.

| Раздел | Образ | Описание |
| --- | --- | --- |
| loader | Miniloader.bin | Первичный loader, 4 копии на устройстве |
| uboot_a | uboot.img | Вторичный loader, 2 копии; число меняется в u-boot/make.sh |
| uboot_b | uboot.img | Резервная копия uboot_a |
| trust | trust.img | Защита, 2 копии; число меняется в u-boot/make.sh; иногда trust и uboot объединены |
| misc | misc.img | Параметры загрузки |
| boot_a | boot.img | kernel+dtb, загружает system_a |
| boot_b | boot.img | kernel+dtb, загружает system_b |
| system_a | rootfs.img | Корневая файловая система |
| system_b | rootfs.img | Корневая файловая система |
| oem | oem.img | Данные производителя, чтение/запись, без резервной копии |
| userdata | userdata.img | Данные пользователя, чтение/запись, без резервной копии |

### 4.2 Процесс загрузки

#### 4.2.1 Формат и хранение данных

Данные расположены по смещению 2K в misc. Структуры: AvbABSlotData хранит данные slot_a и slot_b.

| Поле | Назначение |
| --- | --- |
| unsigned char priority | Приоритет 0–15: 0 — без автоматической загрузки, 15 — высший |
| unsigned char tries_remaining | Оставшиеся попытки загрузки, максимум 7; можно изменить |
| unsigned char successful_boot | Источник: 0 — не загружается, 1 — загружается; см. уточнение по схеме |
| unsigned char is_update:1 | 0 — обновление неуспешно, 1 — успешно; остальные 7 бит зарезервированы |

AvbABData содержит информацию загрузки slot_a/slot_b.

| Поле | Назначение |
| --- | --- |
| unsigned char magic[AVB_AB_MAGIC_LEN] | Заголовок структуры: \0AB0 |
| unsigned char version_major | Основная версия |
| unsigned char version_minor | Дополнительная версия |
| unsigned char reserved1[2] | Резерв |
| AvbABSlotData slots[2] | Загрузочная информация слотов |
| unsigned char last_boot | Последний успешно загруженный слот: 0→slot_a, 1→slot_b |
| unsigned char reserved2[11] | Резерв |
| unsigned char crc32 | Проверка CRC; тип unsigned char сохранён из источника |

#### 4.2.2 Два режима загрузки

Настройка bootcontrol определяет successful_boot или reset retry. Сравнение:

| Режим | Преимущество | Недостаток | После успешной загрузки A | При обновлении B из A |
| --- | --- | --- | --- | --- |
| Successful boot | После успешной загрузки не возвращается к старой версии | При позднем отказе накопителя система может бесконечно перезапускаться | tries_remaining=0 successful_boot=1 last_boot=0 | A:priority=14 B:priority=15 |
| Reset retry | Постоянные повторные попытки позволяют обойти проблемы накопителя | Возможен неконтролируемый откат версии. Ошибки пользователя могут исчерпать попытки и вызвать неверную оценку слота; источник пишет «загружаемый», см. примечание | tries_remaining=7 last_boot=0 | A:priority=14 B:priority=15 |

#### 4.2.3 Схема загрузки

![Руководство по обновлению Rockchip Linux updateEngine — en 14](/docs/rockchip-linux-upgrade/assets/en-p014-figure-01.png)

### 4.3 Конфигурация сборки

#### 4.3.1 U-Boot

Добавьте в defconfig следующие настройки; пример RK3308 64-bit: u-boot/configs/rk3308_defconfig.

```text
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_ANDROID_AB=y
```

#### 4.3.2 Buildroot

```text
BR2_PACKAGE_RECOVERY=y  #enable recovery function
BR2_PACKAGE_RECOVERY_BOOTCONTROL=y  #enable the boot control script
BR2_PACKAGE_RECOVERY_RETRY=y
#The boot mode is retry mode. it is successful_boot mode by default when not
configured.
BR2_PACKAGE_RECOVERY_USE_UPDATEENGINE=y  #Use the new upgrade program
BR2_PACKAGE_RECOVERY_UPDATEENGINEBIN=y
BR2_PACKAGE_RECOVERY_NO_UI=y # disable UI
#compile the new upgrade program
```

После настройки обязательно пересоберите:

```text
make recovery-dirclean
make recovery
./build.sh
```

Для более нового SDK можно использовать:

```text
./build.sh external/recovery
./build.sh
# flashing the firmware again.
```

#### 4.3.3 Таблица разделов

В соответствующем BoardConfig.mk задайте parameter:

```text
#choose device/rockchip/rk3308/parameter-ab-64bit.txt file
# parameter for GPT table
export RK_PARAMETER=parameter-ab-64bit.txt
```

64-bit: /device/rockchip/rk3308/parameter-ab-64bit.txt. 32-bit: /device/rockchip/rk3308/parameter-ab-32bit.txt.

#### 4.3.4 Выходные образы прошивки

Выберите соответствующую конфигурацию платы, например BoardConfig***-ab.mk. Для обновления A/B с загрузочной SD-карты задайте:

```text
# enable build update_sdcard.img
export RK_UPDATE_SDCARD_ENABLE_FOR_AB=true
```

После настройки выполните:

```text
./build.sh
```

Будут созданы следующие образы:

```text
tree rockdev/
rockdev/
├── boot.img
├── MiniLoaderAll.bin
├── misc.img
├── oem.img
├── parameter.txt
├── rootfs.img
├── uboot.img
├── update_ab.img
├── update_sdcard.img
├── update_ota.img
└── userdata.img
```

OTA: update_ota.img находится в rockdev и IMAGE. Текст называет boot.img и rootfs.img, но пример ниже также содержит uboot/oem; фактический состав задаётся tools/linux/Linux_Pack_Firmware/rockdev/rv1126_rv1109-package-file-2-ota, который можно изменить.

```text
# NAME        Relative path
#
#HWDEF        HWDEF
package-file  package-file
bootloader    Image/MiniLoaderAll.bin
parameter     Image/parameter.txt
uboot_a       Image/uboot.img
boot_a        Image/boot.img
system_a      Image/rootfs.img
oem           Image/oem.img
```

Первоначальная запись: update_ab.img создаётся в rockdev и IMAGE. Состав задаётся tools/linux/Linux_Pack_Firmware/rockdev/rv1126_rv1109-package-file-2-ab:

```text
# NAME          Relative path
#
#HWDEF          HWDEF
package-file    package-file
bootloader      Image/MiniLoaderAll.bin
parameter       Image/parameter.txt
misc            Image/misc.img
uboot_a         Image/uboot.img
uboot_b         Image/uboot.img
boot_a          Image/boot.img
boot_b          Image/boot.img
system_a        Image/rootfs.img
system_b        Image/rootfs.img
oem             Image/oem.img
```

### 4.4 Обновление OTA

Сетевое обновление:

```text
# updateEngine --update --image_url=firmware address --partition=0x3FFC00 --
version_url=version file address --savepath=save the firmware address --reboot
updateEngine --image_url=http://172.16.21.110:8080/linuxab/update_ota.img --
update --reboot
```

Локальное обновление:

```text
# updateEngine --update --image_url=firmware address(update_ab.img or
update_ota.img) --partition=0x3FFC00 --version_url=version file address --
savepath=save the firmware address --reboot
updateEngine --image_url=/userdata/update_ota.img --update --reboot
```

Последовательность:

1. Сравнить версии прошивки.

2. Скачать (--image_url) и сохранить прошивку (--savepath).

3. Обновить указанные разделы (--partition).

4. Назначить обновлённый слот следующим загрузочным, согласно китайскому тексту.

5. Перезапустить.

6. Попытаться загрузить обновлённый слот. Необязательные параметры:

1. --partition: для A/B рекомендуется обновлять только uboot_a/uboot_b, boot_a/boot_b, system_a/system_b, то есть 0xFC00. OTA не поддерживает parameter/loader. См. таблицу битов.

2. --version: источник утверждает, что без параметра версии не сравниваются; в справке указан --version_url. Сверьте реальный интерфейс.

3. --savepath: по умолчанию /tmp/update.img; для A/B рекомендуется оставить это значение.

4. --reboot: перезапуск после обновления.

### 4.5 Настройки загрузки разделов

#### 4.5.1 Отметка успешной загрузки

После успешной загрузки системы через misc пометьте текущий слот как загружаемый. Пример скрипта:

```text
$external/recovery/update_engine$ cat S99_bootcontrol
case "$1" in
start)
/usr/bin/updateEngine --misc=now
```

```text
;;
stop)
printf "stop finished\n"
;;
*)
echo "Usage: $0 {start|stop}"
exit 1
;;
esac
exit 0
```

#### 4.5.2 Выбор обновлённого слота

```text
updateEngine --misc=other --reboot
```

Последовательность:

1. Записать команду загрузки другого слота по смещению 4K в misc, как утверждает этот раздел; см. противоречие со структурой в приложении.

2. Перезапустить. Необязательный параметр:

--reboot: без него переключение вступает в силу при следующем перезапуске, немедленного перезапуска нет. updateEngine автоматически задаёт слот после OTA; повторять настройку не нужно.

## 5. Создание SD-карты обновления

Карта, подготовленная SDDiskTool, вставляется в устройство для обновления. Используйте инструмент tools\windows\SDDiskTool из проекта, как на рисунке.

![Руководство по обновлению Rockchip Linux updateEngine — en 20](/docs/rockchip-linux-upgrade/assets/en-p020-figure-01.png)

Выберите упакованный update.img через Firmware, нажмите Create. При успехе появится сообщение. В корне карты будут два файла, а update.img будет переименован в sdupdate.img. Вставьте карту в устройство и включите его.

### 5.1 Загрузочная SD-карта для режима Recovery

В режиме Recovery используйте SDDiskTool для преобразования update.img в sdupdate.img на карте.

### 5.2 Загрузочная SD-карта для режима A/B

В A/B команда ./build.sh updateimg создаёт три образа: update_ab.img — полные разделы A/B для полной записи; update_ota.img — только система слота A или B; update_sdcard.img — исключительно для создания загрузочной SD-карты A/B.

Загрузите update_sdcard.img в SDDiskTool для создания карты, затем скопируйте на неё update_ab.img или update_ota.img.

```text
rksdfw.tag
sd_boot_config.config
sdupdate.img
update_ab.img  # first priority
update_ota.img # second priority
```

## 6. Заводской сброс

Настройки, доступные для записи, хранятся в userdata. Заводские значения меняются при использовании, и сброс удаляет эти изменения. В SDK сочетание RECOVERY + VOLUMEUP запускает сброс. Исходники: buildroot/board/rockchip/rk3308/fs-overlay/etc/input-event-daemon.conf и board/rockchip/rk3308/fs-overlay/usr/sbin/factory_reset_cfg.

```text
updateEngine --misc=wipe_userdata --reboot
```

Последовательность:

1. Записать команду форматирования по смещению 4K в misc.

2. Перезапустить (--reboot).

3. S21mountall.sh распознаёт команду форматирования в misc.

4. Форматируется userdata. Необязательный параметр:

--reboot: если отсутствует, сброс произойдёт при следующем перезапуске.

## 7. Подробности программы обновления

### 7.1 Параметры

updateEngine обновляет разделы и записывает конфигурацию misc. Справка команд:

```text
*** update_engine: Version V1.1.0 ***.
--misc=now             Linux A/B mode: Setting the current partition to bootable.
--misc=other           Linux A/B mode: Setting another partition to bootable.
--misc=update          Recovery mode: Setting the partition to be upgraded.
--misc=wipe_userdata   Format data partition.
--update               Upgrade mode.
--partition=0x3FFC00   Set the partition to be upgraded.(NOTICE: OTA not support
upgrade loader and parameter)
                       0x3FFC00: 0011 1111 1111 1100 0000 0000.
                                 uboot trust boot recovery rootfs oem
                                 uboot_a uboot_b boot_a boot_b system_a system_b.
                       000000000000000000000000: reserved
                       100000000000000000000000: Upgrade loader
                       010000000000000000000000: Upgrade parameter
                       001000000000000000000000: Upgrade uboot
                       000100000000000000000000: Upgrade trust
                       000010000000000000000000: Upgrade boot
                       000001000000000000000000: Upgrade recovery
                       000000100000000000000000: Upgrade rootfs
                       000000010000000000000000: Upgrade oem
                       000000001000000000000000: Upgrade uboot_a
                       000000000100000000000000: Upgrade uboot_b
                       000000000010000000000000: Upgrade boot_a
                       000000000001000000000000: Upgrade boot_b
                       000000000000100000000000: Upgrade system_a
                       000000000000010000000000: Upgrade system_b
                       000000000000001000000000: Upgrade misc
                       000000000000000100000000: Upgrade userdata
--reboot               Restart the machine at the end of the program.
--version_url=url      The path to the file of version.
--image_url=url        Path to upgrade firmware.
--savepath=url         save the update.img to url.
```

--misc=now: в A/B пометить текущий слот как загружаемый. Скрипт external/recovery/update_engine/S99_bootcontrol выполняет это в конце успешной загрузки. В английском тексте также встречается S99bootcontrol без подчёркивания; используйте реальный путь SDK. Включите:

```text
BR2_PACKAGE_RECOVERY_BOOTCONTROL=y
```

other: в A/B пометить другой слот как обновлённый и попытаться загрузить его после перезапуска.

После OTA updateEngine делает это автоматически. update: в Recovery-режиме сначала обновить recovery в обычной системе, затем остальные разделы в recovery. display: показать структуру misc для отладки. --update sdboot: прямое обновление flash без понятия разделов. --update без значения: преимущественно A/B, обновление в текущей системе. --partition=0x0000 задаёт маску; по умолчанию 0x3FFC00 включает uboot, trust, boot, recovery, rootfs, oem, uboot_a, uboot_b, boot_a, boot_b, system_a, system_b. Используются старшие 16 бит, младшие 8 зарезервированы для расширения; 1 означает обновлять, 0 — нет.

| Бит | Раздел |
| --- | --- |
| 23 | loader |
| 22 | parameter |
| 21 | uboot |
| 20 | trust |
| 19 | boot |
| 18 | recovery |
| 17 | rootfs |
| 16 | oem |
| 15 | uboot_a |
| 14 | uboot_b |
| 13 | boot_a |
| 12 | boot_b |
| 11 | system_a |
| 10 | system_b |
| 9 | misc |
| 8 | userdata |
| 7~0 | Резерв |

--reboot перезапускает после успешного updateEngine. --version_url (в источнике опечатка --vsersion_url) сравнивает версию с RK_VERSION= в /etc/version: локальная версия читается из прошивки, удалённый файл скачивается и должен иметь формат /etc/version. --image_url задаёт локальный или удалённый путь прошивки. --savepath задаёт сохранение; для удалённой прошивки без него используется /tmp/update.img.

### 7.2 Обновление собственного раздела

```text
typedef struct {
char name[32];      //firmware name
bool need_update;   //need to upgrade
bool is_ab;         //whether it is A/B dual patition
long long size;     //firmware size
long long offset;   //Offset position in update.img
long long flash_offset; //Offset position in flash
char dest_path[100];    //Target path
update_func cmd;        //Upgrade function
}UPDATE_CMD, *PUPDATE_CMD;
```

Для собственного раздела factory добавьте строку ниже и установите соответствующий бит --partition в 1.

```text
{"factory", false, false, 0, 0, 0, "", flash_normal},
```

Файл: external/recovery/update_engine/update.cpp.

```text
UPDATE_CMD update_cmd[] = {
           {"bootloader" , false , false , 0 , 0 , 0 , "" , flash_bootloader} ,
           {"parameter"  , false , false , 0 , 0 , 0 , "" , flash_parameter}  ,
           {"uboot"      , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"trust"      , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"boot"       , false , true  , 0 , 0 , 0 , "" , flash_normal}     ,
           {"recovery"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"rootfs"     , false , true  , 0 , 0 , 0 , "" , flash_normal}     ,
           {"oem"        , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"uboot_a"    , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"uboot_b"    , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"boot_a"     , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"boot_b"     , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"system_a"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"system_b"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"misc"       , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
           {"userdata"   , false , false , 0 , 0 , 0 , "" , flash_normal}     ,
```

Завершающая строка восстановлена по китайскому источнику:

```text
};
```

## 8. Приложение

### 8.1 Инструменты упаковки прошивки

#### 8.1.1 Windows

Инструмент Windows расположен в tools\windows\AndroidTool\rockdev. Сначала добавьте обновляемые образы в package-file; пути относительные.

mkupdate.bat связывает tools\windows\AndroidTool\rockdev\Image с rockdev в корне SDK. Проверьте наличие образов в rockdev и запустите mkupdate.bat: выбранные образы будут упакованы в update.img в корневом rockdev.

#### 8.1.2 Linux

Инструмент Linux находится в tools/linux/Linux_Pack_Firmware/rockdev. Добавьте образы в package-file с относительными путями. tools/linux/Linux_Pack_Firmware/rockdev/Image связан с корневым rockdev; убедитесь, что образы там есть. mkupdate.sh упаковывает их в update.img в корневом rockdev.

### 8.2 Раздел misc

misc не имеет файловой системы и хранит параметры загрузки. Структура ниже; подробности в external/recovery/bootloader.h и external/recovery/update_engine/rkbootloader.cpp.

| Смещение | Назначение |
| --- | --- |
| 2k | Информация загрузки Linux A/B |
| 4k | Команда форматирования |
| 16k | Связь Recovery с обычной системой |

## Сверка источников и границы реализации

- Оба V1.2.0: китайский 21 страница, английский 25. В китайской главе 5 создание — 5.1, Recovery — 5.2, A/B — 5.3; английский переносит создание во введение и использует 5.1/5.2. Всё содержание сохранено. Английский явно исключает EXT3/UBI, китайский — ext2/ext4 и MTD NAND. Дифференциальные A/B, зашифрованные и доступные для записи разделы не поддерживаются. Китайский требует новый OTA image, не полный загрузочный пакет; это строже английского пожелания и принято как основа.
- Векторная схема разностей экспортирована с оригинальных страниц CN 8/EN 9, а не заменена обрывками надписей. Только английская A/B-схема дополняет успешный slot_b значениями successful_boot=1, tries_remaining=0, last_boot=1. Изначально A priority=15, B=14, у обоих successful_boot=0 и tries_remaining=7. Ошибка CRC инициализирует misc. Выбор зависит от приоритета, успеха и повторов; при исчерпании приоритет обнуляется, при двух нулевых схема использует last_boot.
- Текст отрицает двойной uboot, таблицы и пакеты содержат uboot_a/uboot_b: сверяйте платформу. Английский явно указывает отсутствие копии OEM; одиночные oem/userdata не обеспечивают A/B-резервирование. Описание OTA называет boot/rootfs, пример также uboot/oem; состав определяет package-file.
- --version и опечатка --vsersion_url расходятся с --version_url в справке. S99bootcontrol/S99_bootcontrol тоже различаются. Английский путь recovery/recovery не содержит .mk, имеющегося в китайском. Код сохраняет комментарии и переносы PDF; разорванные --update и shell-строки проверяйте перед исполнением. Частные HTTP-адреса не использовались.
- misc: 2K — A/B, 4K — форматирование, 16K — связь Recovery/Normal, однако 4.5.2 заявляет 4K для смены слота. Не записывайте сырые смещения на основе противоречия, проверьте rkbootloader.cpp. Тип unsigned char crc32 сомнителен для CRC32: сохранён, но требует проверки. successful_boot=0 не запрещает все попытки: схема использует tries_remaining. Недостаток Reset retry ошибочно говорит о признании слота загружаемым после исчерпания попыток; проверяйте реализацию.
- Английский UPDATE_CMD update_cmd[] не имеет };. Оригинал сохранён, завершающая строка добавлена отдельно по китайскому. Бит factory должен соответствовать порядку массива и маске; младшие восемь бит резервные. 0x3FFC00 — группа по умолчанию, 0xFC00 рекомендована для A/B. Наличие loader/parameter в справочной маске не отменяет явного запрета их OTA-обновления.
- Имя первого патча обрывается в обоих источниках: 0001-package-recovery-add-bzip2-dependency.; найдите реальное имя в SDK. Утверждения о стандартном безэкранном режиме и «только RK3308» смешивают конфигурации; проверьте BR2_PACKAGE_RECOVERY_NO_UI и регистр Log.

{% endraw %}
