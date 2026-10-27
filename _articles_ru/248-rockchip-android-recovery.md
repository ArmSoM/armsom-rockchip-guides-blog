---
title: "Руководство разработчика Rockchip Android Recovery"
description: "Руководство разработчика Rockchip Android Recovery — OTA, update.img, rkLoader, RKUpdateService, V1.2.0"
excerpt: "Руководство разработчика Rockchip Android Recovery"
translation_key: "248-rockchip-android-recovery"
slug: "248-rockchip-android-recovery"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "Recovery", "OTA"]
---

{% raw %}

# Руководство разработчика Rockchip Android Recovery

Справочный материал для ArmSoM. RK-YH-YF-209 V1.2.0 предназначен для Rockchip Android >= 12, главным образом без AB. Таблица версий перечисляет RK3326/RK3399/RK356x/RK3588 и ядра 4.19/5.10; основной текст также содержит команды разностного пакета Android 14. Общий тег BSP не указан; совместимость всех плат ArmSoM не предполагается. Проверьте Android BSP, разделы, bootloader, ключи подписи и конфигурацию ядра целевой платы. Аппаратной проверки не было. Прошивка, сброс и создание носителей могут стереть данные: сделайте копию и проверьте устройство. Команды здесь не выполнялись.

| Чипы в исходнике | Версии ядра в исходнике |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 4.19, 5.10 |

## 1. Обзор

Руководство описывает Rockchip Recovery для Rockchip Android >= 12. Режим Recovery позволяет изменять внутренние данные или систему: устанавливать новую Android, создавать резервную копию или обновлять существующую систему, восстанавливать заводские настройки. Основная тема — системы без AB. Для AB см. Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN.

## 2. Сборка пакетов OTA

На описанной платформе Rockchip Android AB по умолчанию отключён. Для его использования настройте Android, U-BOOT и kernel DTS; см. Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN. Далее преимущественно рассматриваются системы без AB.

### 2.1 Введение в OTA

OTA (Over The Air) — стандартный механизм обновления Android. Он поддерживает полное обновление (полный пакет) и инкрементальное обновление (разностный пакет), локально или по сети.

### 2.2 Создание полного пакета

OTA (Over The Air) — стандартный механизм обновления Android. Он поддерживает полное обновление (полный пакет) и инкрементальное обновление (разностный пакет), локально или по сети. Команды сборки:

```text
非AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage.sh ota
AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage_ab.sh ota
```

Или:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

Полный пакет rkxxxx-ota-eng.root.zip создаётся в out/target/product/rkxxxx/. Переименуйте его в update.zip и скопируйте на T-карту или внутреннюю flash-память. На разных платформах Android также можно использовать build.sh; требуется параметр -o, как в исходном примере build.sh –AUCKuop.

При выпуске прошивки используйте ./mkimage.sh ota, объединяя boot и kernel; отдельно прошивать kernel не требуется. Раздельная производственная прошивка влияет на последующие разностные обновления, если они нужны. Для упаковки update.img через ./build.sh требуется ./build.sh -ou, а не только ./build.sh -u.

### 2.3 Создание разностного пакета

Разностный пакет OTA содержит только изменения и имеет меньший размер. Обычно он используется для сетевого OTA, но подходит и для локального обновления с T-карты. Нужна специальная ручная сборка:

(1) Выпустите прошивку v1 и создайте полный пакет:

```text
非AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage.sh ota
AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage_ab.sh ota
```

Или:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

(2) Сохраните out/target/product/rkxxxx/obj/PACKAGING/target_files_intermediates/rkxxx-target_files-eng.xxx.zip как rkxxxx-target_files-v1.zip — исходный target-files для v1. Обязательно прошейте устройство файлами из rockdev, полученными на шаге 1.

(3) Измените kernel или Android, выпустите v2 и создайте полный пакет:

```text
make installclean && make -j16 && make otapackage -j16
```

Или:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

(4) Сохраните out/target/product/rkxxxx/obj/PACKAGING/target_files_intermediates/rkxxx-target_files-eng.xxx.zip как rkxxxx-target_files-v2.zip — исходный пакет v2.

(5) Создайте разностный пакет v1-v2, например:

```text
./build/tools/releasetools/ota_from_target_files -v -i ./rockdev/v1/rk3588_t-target_files-eng.jdy.zip --block -p ./out/host/linux-x86  ./rockdev/v2/rk3588_t-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

Для Android 13 требуется python3:

```text
python3 ./build/tools/releasetools/ota_from_target_files -v -i ./rockdev/v1/rk3588_t-target_files-eng.jdy.zip --block -p ./out/host/linux-x86 ./rockdev/v2/rk3588_t-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

Для Android >= 14:

```text
out/host/linux-x86/bin/ota_from_target_files -v -i ./rockdev/V1/rk3588_u-target_files-eng.jdy.zip  --block -p ./out/host/linux-x86 ./rockdev/V2/rk3588_u-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

Формат команды создания разностного пакета:

- ota_from_target_files: генератор пакета.
- -v -i: предыдущий target file для сравнения.
- --block: блочное обновление OTA.
- -p: среда сборки хоста.
- -k: ключ упаковки. Для Android 13 путь по умолчанию device/rockchip/common/security/testkey; для других платформ — build/make/target/product/security/testkey.
- Следующий позиционный аргумент: новый target file.
- Последний аргумент: результирующий разностный OTA-пакет.

### 2.4 Важные замечания

Полный пакет обновления и target-files — разные файлы. Разностный пакет получается сравнением target-files двух версий. Поэтому для каждого выпуска сохраняйте исходный пакет из obj, полный пакет обновления и все образы, созданные ./mkimage.sh ota.

## 3. Обновление rkLoader

Обычно OTA не требует обновления rkloader. Если оно нужно, поместите loader (miniloader для инструмента прошивки) под именем RKLoader.bin в $(TARGET_DEVICE_DIR)/ota/loader; он будет включён в OTA. Чтобы узнать $(TARGET_DEVICE_DIR), выполните source build/envsetup.sh и lunch XXX из корня SDK, затем get_build_var TARGET_DEVICE_DIR.

## 4. Прямая установка update.img в Recovery

Обычно update.img записывается инструментом прошивки. Для установки из Recovery вызовите do_rk_mode_update в нужном месте логики приложения. Если update.img находится на USB-накопителе, сначала смонтируйте его самостоятельно или через:

```text
prksdboot->ensure_usb_mounted();
```

Пример do_rk_mode_update, если update.img находится на USB-накопителе:

```text
+ auto ui = device->GetUI();
+ InstallResult result = INSTALL_SUCCESS;

+ prksdboot->sdboot_set_bSDBoot(false);
+ prksdboot->sdboot_set_bUsbBoot(true);
+ /*FileName是相对于U盘根目录的路径，比如update.img位于U盘根目录abc子目录下，则设置
FileName为“/abc/update.img”即可*/
+ result = (InstallResult)do_rk_mode_update(FileName, prksdboot, ui);
```

## 5. Настройка

### 5.1 Перенаправление журналов

1. Журналы могут выводиться в три места: последовательный порт, SD-карта и /cache/recovery/.

2. Настройте bootable/recovery/Android.bp:

- -DLogToSerial: вывод в последовательный порт.
- -DLogToCache: запись в /cache/recovery/.
- -DLogToSDCard: recovery.log на SD-карте.

### 5.2 Поворот экрана

1. Recovery поддерживает поворот на 0°, 90°, 180° и 270°.

2. В device/rockchip/XXXX/BoardConfig.mk выберите одно присваивание:

- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_NONE — без поворота.
- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_LEFT — 270°.
- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_RIGHT — 90°.
- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_DOWN — 180°.

### 5.3 Сохранение файлов

Источник утверждает, что файлы /cache/recovery/Recovery_* не удаляются при форматировании.

### 5.4 Обновление с NTFS на USB/SD

В источнике сказано, что NTFS по умолчанию не поддерживается по причинам интеллектуальных прав, и перед использованием требуется соответствующее разрешение. Штатное ядро не монтирует NTFS USB-накопители, поэтому Recovery их не использует. Для поддержки включите соответствующую конфигурацию ядра.

## 6. Порядок обновления

Rockchip предоставляет клиент RKUpdateService для проверки обновлений платформы. Выполните шаги ниже. Для AB используйте Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN.

1. Соберите OTA по разделу 2 и переименуйте пакет в update.zip.

2. Скопируйте update.zip в корень USB/SD либо /data/media/0/.

3. Пакет обнаруживается автоматически, появляется диалог обновления. Если этого не произошло, переподключите USB-кабель или перезапустите устройство.

4. Устройство перезагружается в Recovery и автоматически устанавливает OTA. После завершения оно перезагружается в главный интерфейс Android.

## 7. Носители обновления

### 7.1 SD-карта обновления

Создайте карту из производственной update.img с помощью SDDiskTool: выберите режим обновления прошивки, соответствующий update.img, нажмите «Начать создание» и дождитесь завершения. Вставьте готовую карту в разъём устройства и заново подайте питание. Для AB предварительно задайте UPGRADE_PROGRAM_PARTITION=boot_b в config SDDiskTool и перезапустите инструмент.

### 7.2 USB-носитель обновления

Для USB-носителя сначала включите CONFIG_ROCKCHIP_USB_BOOT в U-Boot, пересоберите его и прошейте устройство этим U-Boot. Затем создайте носитель из полностью собранного update.img. Пример настройки для rk3588:

```text
diff --git a/configs/rk3588_defconfig b/configs/rk3588_defconfig
index 67a8c357f0..be47518735 100644
--- a/configs/rk3588_defconfig
+++ b/configs/rk3588_defconfig
@@ -234,3 +234,4 @@ CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
 CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_ROCKCHIP_USB_BOOT=y
```

SDDiskTool преобразует производственный update.img в USB-носитель обновления. Выберите обновление прошивки, нужный update.img, начните создание и дождитесь завершения. Подключите готовый носитель к соответствующему порту и заново подайте питание. Для AB предварительно задайте UPGRADE_PROGRAM_PARTITION=boot_b в config SDDiskTool и снова откройте инструмент.

## Источник и редакционная проверка

Предоставлен только китайский Rockchip_Developer_Guide_Android_Recovery_CN.pdf, 9 страниц. Основной текст: страницы 4–8; страница 9 пустая. Английская, русская и немецкая статьи — полные переводы, не отдельные исходные издания. Технических рисунков нет. Все модели и версии ядра из таблицы продукта сохранены во вводной области применения.

- В `build.sh –AUCKuop` исходный символ U+2013 не является ASCII-дефисом. Он сохранён буквально; вставка в shell может не работать. Проверьте параметры реального скрипта, не подменяя оригинал молча.
- Визуальные переносы длинных OTA-команд соединены; дефисы внутри `rk3588_t-target_files` и `rk3588_u-target_files`, регистр `v1/v2` и `V1/V2` сохранены.
- В примере do_rk_mode_update сохранены префиксы diff `+` и китайский комментарий: FileName задаётся относительно корня USB, например `/abc/update.img`. Это фрагмент патча, не готовый исполняемый файл.
- Источник объединяет `-v -i`, не объясняя их отдельно. Пути testkey — примеры разработки, не рекомендация для производственных ключей.
- Сохранение `/cache/recovery/Recovery_*` при форматировании относится к исходной реализации Recovery, а не к любой операции стирания. Нужна внешняя резервная копия.
- Сведения об авторизации NTFS и штатной поддержке исторические, не актуальное юридическое заключение. Проверяйте конкретный BSP и применимые разрешения.
- Удалены дата/гриф обложки, правовые и контактные разделы, аудитория и история редакций; техническая версия, область применения и все семь глав сохранены. Повтор OTA-обзора соответствует оригиналу.


Официальные ресурсы: [Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab).

{% endraw %}
