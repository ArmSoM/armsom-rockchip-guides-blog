---
title: "Руководство разработчика Rockchip Android SELinux (Sepolicy)"
description: "Руководство разработчика Rockchip Android SELinux (Sepolicy) — sepolicy, init, Binder, HAL, AVC, Android 7.1–10"
excerpt: "Руководство разработчика Rockchip Android SELinux (Sepolicy)"
translation_key: "249-rockchip-android-selinux"
slug: "249-rockchip-android-selinux"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "SELinux", "Sepolicy"]
---

{% raw %}

# Руководство разработчика Rockchip Android SELinux (Sepolicy)

Справочный материал для платформ ArmSoM по китайскому документу Rockchip RK-KF-YF-217 V1.0 в техническом контексте 2019 года. Рассмотрены примеры BSP Android 7.1, 8.0+ и частично 10.0; единой матрицы поддержки SoC, ядер или плат ArmSoM нет. Каталоги sepolicy, синтаксис init, разделы и переменные сборки сверяйте с фактическим SDK. Аппаратная проверка не проводилась.

Примеры root, прошивки, Permissive и чувствительных разрешений предназначены только для разрешённых устройств разработки. Для выпуска восстановите и проверьте мандатное управление доступом; не обходите neverallow и не копируйте широкие права вслепую. Перед операциями сохраняйте данные. Команды не выполнялись.

## 1. Введение в SeAndroid

### 1.1 Назначение SeAndroid

Модель безопасности Android частично основана на песочницах: каждое приложение работает в собственной среде. До Android 4.3 при установке приложению назначался отдельный uid; доступ к ресурсам по uid основывался на традиционном дискреционном управлении доступом Linux (DAC). Начиная с Android 4.3 SELinux дополнительно определяет границы песочниц. Android применяет мандатное управление доступом (MAC) ко всем процессам, включая root; sepolicy ограничивает привилегированные процессы. Исходник утверждает, что Android 4.4 включил Enforcing с политикой AOSP по умолчанию. В Enforcing нарушения блокируются, а недопустимый доступ записывается в dmesg и logcat. Анализ журналов помогает исправлять ПО и политики. Историческое утверждение сохранено как позиция источника, а не универсальная гарантия поддержки версий.

### 1.2 Политика безопасности SeAndroid

Контекст безопасности — метка объекта. Это строка из пользователя SELinux, роли, типа и уровня безопасности, разделённых двоеточиями: `user:role:type:rank`. Просмотр командой `ps -Z`:

```text
LABEL                           USER     PID   PPID  NAME
u:r:init:s0                     root      1     0     /init
u:r:kernel:s0                  root      2     0     kthreadd
...
u:r:kernel:s0                  root      258   2     irq/322-HPH_R O
u:r:logd:s0                     logd      259   1     /system/bin/logd
u:r:healthd:s0                 root      260   1     /sbin/healthd
u:r:lmkd:s0                     root      261   1     /system/bin/lmkd
u:r:servicemanager:s0          system    262   1     /system/bin/servicemanager
u:r:vold:s0                     root      263   1     /system/bin/vold
```

Левый столбец — SContext процесса. Исходник называет первым процессом `/system/bin/logwrapper` с `u:r:init:s0`, хотя первая строка таблицы содержит `/init`. `u` — пользователь SELinux (в SeAndroid определён `u`); `r` — роль. Пользователь может принадлежать нескольким ролям с разными правами. `init` — домен/тип процесса; источник говорит о более чем 100 типах Android. `S0` — написание уровня в исходном пояснении (пример использует `s0`). MLS классифицирует процессы и файлы, требуя соответствующего уровня для доступа. Эти расхождения сохранены для проверки.

### 1.3 Основные файлы SeAndroid

Исходники политик `*.te` определяют домены и метки. Новые файлы могут потребоваться в `/device/manufacturer/device-name/sepolicy`, но по возможности изменяйте существующие. Далее перечислены файлы контекстов.

1. `file_contexts` назначает метки файлам и используется несколькими компонентами userspace. При добавлении меток создайте или обновите его. Пересоберите образ файловой системы либо выполните `restorecon` для перемаркировки. При обновлении изменения автоматически применяются к system и userdata. Для других разделов добавьте `restorecon_recursive` в `init.board.rc` после монтирования на чтение и запись.

2. `genfs_contexts` маркирует файловые системы без расширенных атрибутов, например proc или vfat. Загружается в составе политики ядра, но изменения могут не затронуть существующие inode. Для полного применения перезагрузите устройство либо перемонтируйте ФС. Исходник также описывает `context=mount` для назначения метки смонтированной ФС, например vfat; проверьте реальный синтаксис mount целевой системы.

3. `property_contexts` маркирует системные свойства Android и определяет, какие процессы могут их задавать. init читает файл при загрузке.

4. `service_contexts` маркирует службы Android Binder и управляет добавлением/регистрацией и поиском/запросом их Binder-ссылок процессами. servicemanager читает файл при загрузке.

5. `seapp_contexts` маркирует процессы приложений и `/data/data`. zygote читает его при каждом запуске приложения, installd — при загрузке.

6. `mac_permissions.xml` назначает seinfo по подписи приложения и, необязательно, имени пакета. Затем `seapp_contexts` использует seinfo как ключ для назначения меток всем подходящим приложениям. system_server читает файл при загрузке.

BoardConfig.mk: после изменения политик и контекстов обновите `/device/rockchip/device-name/BoardConfig.mk`.

```text
BOARD_SEPOLICY_DIRS += \
        <root>/device/rockchip/device-name/sepolicy
```

Android 8.0+ не требует следующей части. Пунктуация в исходном `sepolicy.te。` сохранена как сомнительное место.

```text
BOARD_SEPOLICY_UNION += \
        genfs_contexts \
        file_contexts \
        sepolicy.te。
```

## 2. Проверка проблем Sepolicy

1. Если функция не работает в user, но работает в userdebug, возможна нехватка разрешений.

2. Отказы SELinux отображаются как `avc:denied` в журналах ядра или Android. Сначала определите режим Enforcing или Permissive. Для воспроизводимой проблемы временно проверьте Permissive, чтобы выяснить роль ограничений SELinux. Делайте это только при контролируемой отладке.

```text
adb shell setenforce 0
```

Исходник называет `setenforce 0` временным отключением, а `setenforce 1` включением SELinux. Точнее, они переключают Permissive/Enforcing, а не удаляют и не отключают сам SELinux.

3. Получите соответствующие журналы одной из команд:

```text
adb shell logcat | grep avc

adb shell dmesg | grep avc
```

## 3. Добавление и проверка правил Sepolicy

### 3.1 Определение разрешений по журналам

Пример 1

```text
audit(1444651438.800:8): avc: denied { search } for pid=158 comm="setmacaddr"
name="/" dev="nandi" ino=1 scontext=u:r:engsetmacaddr:s0
tcontext=u:object_r:vfat:s0 tclass=dir permissive=0
```

Недостающее разрешение: `search`; субъект: `engsetmacaddr`; цель: `vfat`; класс файла: `dir`. Итоговое правило исходника:

```text
allow engsetmacaddr vfat:dir { search };
```

Пример 2

```text
auditd  (  627):  avc: denied { write } for pid=15848 comm=“system_server”
name=“enable” dev=“sysfs” ino=9381 scontext=u:r:zygote:s0
tcontext=u:object_r:sysfs:s0 tclass=file permissive=1
```

Недостающее разрешение: `write`; субъект: `scontext=u:r:zygote:s0`; цель: `tcontext=u:object_r:sysfs:s0`; класс файла: `tclass=file`. Итоговое правило исходника:

```text
allow zygote sysfs:file write
```

Пример 3

```text
audit(1441759284.810:5): avc: denied { read } for pid=1494 comm="sdcard"
name="0" dev="nandk" ino=245281 scontext=u:r:sdcardd:s0
tcontext=u:object_r:system_data_file:s0 tclass=dir permissive=0
```

Недостающее разрешение: `read`; субъект: `sdcardd`; цель: `system_data_file`; класс файла: `dir`. Итоговое правило исходника:

```text
allow sdcardd system_data_file:dir read
```

Пример 4: особенности ioctl

```text
avc: denied { ioctl } for path="/dev/cmx_ddlsw" dev="tmpfs" ino=10422
ioctlcmd=4d02 scontext=u:r:system_server:s0
tcontext=u:object_r:cmx_ddlsw_device:s0 tclass=chr_file permissive=0
```

После разрешения ioctl задайте конкретный iocmd по исходному коду. Правила оригинала ниже (`chr_file` отличается от `file`; написание `allowxperm` сохранено). Перед применением сверьте целевой SDK.

```text
allow system_server cmx_ddlsw_device:file { ioctl };
allowxperm system_server cmx_ddlsw_device:file ioctl { 0x4d02 };
```

1. AVC может показывать проблемы последовательно: после разрешения read обнаруживается отказ write. Исходник рекомендует контролируемую отладку в Permissive, чтобы видеть больше отказов и сократить повторные попытки.

2. Группируйте разрешения в фигурных скобках либо используйте макросы; исходник настоятельно рекомендует макросы для совместимости. Пример:

```text
allow engsetmacaddr vfat:dir { search write add_name create};
```

### 3.2 Упрощение создания правил через audit2allow

1. Извлеките AVC-denied из logcat или последовательного вывода; пример выбирает все совпадения:

```text
$ adb shell "cat /proc/kmsg | grep avc" > avc_log.txt
```

2. Создайте policy через audit2allow после импорта окружения командой `source build/envsetup.sh`. Здесь исходник также пишет audio2allow; это отмечено как опечатка.

```text
$ audit2allow -i avc_log.txt
```

3. Добавьте policy в нужный te-файл, обычно в `/device/<company>/common/sepolicy` либо `/device/<company>/$DEVICE/sepolicy`. Каталог уточните через `get_build_var`, как в главе 5. Проверяйте разрешения, не добавляйте все сгенерированные правила вслепую.

### 3.3 Применение изменений

По журналам измените нужные policy-файлы в `$SDK/device/rockchip/common`. Пересоберите и запишите `vendor.img` для Android 8.0+ (`boot.img` для старых версий), затем проверьте. Для Android 10.0 источник указывает запись `odm.img` через fastboot.

## 4. Тесты GMS

```text
GtsSecurityHostTestCases
CtsSecurityHostTestCases
```

## 5. Разрешения для новых служб загрузки

### 5.1 Добавление службы framework: redmine:179485

Служба Java Binder может потребоваться для вызова интерфейсов framework либо предоставления специальных интерфейсов приложениям:

```text
    @Override
    public void onStart() {
        publishBinderService("ccc_service", new BinderService());

        publishLocalService(CCCServiceInternal.class, new LocalService());

        Watchdog.getInstance().addMonitor(this);
        Watchdog.getInstance().addThread(mHandler);
    }
```

Выполните `get_build_var BOARD_PLAT_PRIVATE_SEPOLICY_DIR`. В полученном каталоге измените `service.te`, например `device/rockchip/common/sepolicy/private/service.te`, добавив:

```text
type ccc_service, system_api_service, system_server_service, service_manager_type;
```

Затем добавьте эту связь контекста в конец `device/rockchip/common/sepolicy/private/service_contexts` того же каталога для маркировки службы. Источник также упоминает каталог service_context. Проверьте различие имён `ccc` здесь и `ccc_service` выше.

```text
ccc u:object_r:ccc_service:s0
```

### 5.2 Автозапуск бинарной службы: Android 7.1

Добавьте бинарный файл или скрипт для запуска при загрузке, например `rockchip.sample.nougat.sh`.

```text
#! /system/bin/sh
echo "starting service..."
```

Первая строка скрипта должна задавать shell; исходник требует пробел после `!`, как выше. Файлы раздела находятся в каталогах из `get_build_var BOARD_SEPOLICY_DIRS`.

Объявите службу в init.rc, любом загружаемом rc-файле либо новом rc-файле.

```text
service rockchip-sample-nougat-sh /system/bin/rockchip.sample.nougat.sh
    class main
    user root
    group root wifi
    oneshot
```

Формат: `service service_name service_path`. Скрипт должен быть исполняемым, идти непосредственно после имени службы и иметь метку file_context. Не используйте `/system/bin/sh xxx.sh`: субъектом станет sh/shell, а не скрипт. `class` задаёт этап запуска; настройте по требованиям. `oneshot` означает однократный запуск. Для запуска не автоматически исходник пишет `disable` и `start servic_name`; обе записи сохранены, перед применением проверьте синтаксис init.

Неправильный пример службы-скрипта:

```text
service rockchip-sample-nougat-sh /system/bin/sh /system/bin/rockchip.sample.nougat.sh
    class main
    user root
    group root wifi
    oneshot
```

Объявите домен в новом `rockchip_sample_nougat.te` каталога sepolicy:

```text
type rockchip_sample_nougat, domain;
type rockchip_sample_nougat_exec, exec_type, file_type;

init_daemon_domain(rockchip_sample_nougat)
```

Назначьте исполняемому файлу метку и свяжите с te-объявлением, добавив в `file_contexts` каталога sepolicy:

```text
/system/bin/rockchip\.sample\.nougat\.sh u:object_r:rockchip_sample_nougat_exec:s0
```

Формат: `service_path u:object_r:te_type_name_exec:s0`, соответствующий типу te. Учитывайте экранирование `\`. Пример завершён.

### 5.3 Автозапуск бинарной службы: Android 8.0+

Все файлы находятся в каталогах из `get_build_var BOARD_SEPOLICY_DIRS`. Пример xxxservice похож на Android 7.1, но программа/скрипт должны находиться в vendor/bin/. 1. init.rc либо другой rc:

```text
service xxxservice /vendor/bin/xxxservice
    class main
    oneshot
```

2. xxxservice.te: свяжите exec type также с vendor_file_type.

```text
type xxxservice, domain;
type xxxservice_exec, exec_type, vendor_file_type, file_type;
init_daemon_domain(xxxservice)
```

3. file_contexts: аналогично Android 7.1 добавьте:

```text
/vendor/bin/xxxservice u:object_r:xxxservice_exec:s0
```

### 5.4 Полный пример новой бинарной службы Android 7.1–9.0 (внутренняя ссылка)

```text
https://10.10.10.29/#/q/topic:%22npu+monitor+service%22
```

Это внутренний адрес источника; обращения к нему не выполнялись, доступ извне не гарантируется.

### 5.5 Добавление HAL-службы в Android 8.0+

Android 8.0 вводит hwservice; понятие описано в документации Google. Обычно это используется для NFC, отпечатков пальцев, распознавания радужки и другого оборудования. Пример добавляет HAL-службу NXP NFC.

Добавьте узел instance: выполните `get_build_var DEVICE_MANIFEST_FILE`, измените полученный файл (например `device/rockchip/common/manifest.xml`) и добавьте узел службы:

```text
 <hal format="hidl">
        <name>vendor.nxp.nxpnfc</name>
        <transport>hwbinder</transport>
        <version>1.0</version>
        <interface>
            <name>INxpNfc</name>
            <instance>default</instance>
        </interface>
    </hal>
```

Единый запуск через hwservice; пример rc:

```text
service vendor.nxp.nxpnfc-1-0 /vendor/bin/hw/vendor.nxp.nxpnfc@1.0-service

    class hal
    user system
    group system
```

Объявление `class hal` относит службу к HAL; исходник указывает запуск через hwservice на этапе start hal процесса init.

Объявите hwservice: выполните `get_build_var BOARD_SEPOLICY_DIRS` и измените hwservice.te в полученном каталоге.

```text
type vnd_nxpnfc_hwservice, hwservice_manager_type;
```

Свяжите метку исполняемого файла службы: снова определите каталог через `get_build_var BOARD_SEPOLICY_DIRS` и измените file_contexts:

```text
/vendor/bin/hw/vendor\.nxp\.nxpnfc@1\.0-service u:object_r:nxpnfc_hal_exec:s0
```

Свяжите instance из manifest: измените hwservice_contexts в каталоге из `get_build_var BOARD_SEPOLICY_DIRS`. Имя должно совпадать с новым instance manifest.

```text
vendor.nxp.nxpnfc::INxpNfc u:object_r:vnd_nxpnfc_hwservice:s0
```

Объявление службы: создайте nxpnfc.te в каталоге из `get_build_var BOARD_SEPOLICY_DIRS`. Последний add_hwservice нужен только при запуске новой службы процессом nfc.

```text
type nxpnfc_hal, domain;
type nxpnfc_hal_exec, exec_type, vendor_file_type, file_type;
init_daemon_domain(nxpnfc_hal)
add_hwservice(nfc, vnd_nxpnfc_hwservice)
```

## 6. Решение проблем Android 8.0+

### 6.1 Как отключить SELinux в Android 8.0+?

По исходнику в Android 8.0+ нельзя отключить SELinux, только включить Permissive. В конце журнала `permissive=0` означает действующий запрет, `permissive=1` — уведомление, само по себе не блокирующее операцию. `adb shell getenforce` возвращает permissive либо enforcing. Это описание контекста BSP источника, не замена проверки безопасности целевой сборки.

### 6.12 Как перевести SELinux в Permissive?

Добавьте `androidboot.selinux=permissive` в cmdline. Сначала определите ветку uboot:

```text
cd u-boot; git branch -a
```

develop: добавьте в parameter.txt. next-dev: добавьте в bootargs узла chosen kernel dts, например px30-android.dtsi.

### 6.13 Как включить Permissive в прошивке user?

После раздела 6.12 внесите следующее изменение из источника в system/core. Это отладочный пример, не политика безопасности серийного выпуска.

```text
kenjc@ubuntu:~/1_RK3326_P_29/system/core/init$ git diff
diff --git a/init/Android.mk b/init/Android.mk
index c4a6a50..58161ca 100644
--- a/init/Android.mk
+++ b/init/Android.mk
@@ -14,7 +14,7 @@ init_options += \
 else
 init_options += \
     -DALLOW_LOCAL_PROP_OVERRIDE=0 \
-    -DALLOW_PERMISSIVE_SELINUX=0 \
+    -DALLOW_PERMISSIVE_SELINUX=1 \
     -DREBOOT_BOOTLOADER_ON_PANIC=0 \
     -DWORLD_WRITABLE_KMSG=0 \
     -DDUMP_ON_UMOUNT_FAILURE=0
```

### 6.2 Почему приложение не получает доступ к узлу в Permissive даже после добавления прав?

Источник определяет чувствительные разрешения по `c512,c768` в журнале. Попытка добавления в untrusted_app.te:

```text
allow untrusted_app audio_device:chr_file { open write read };
```

Но сохраняется следующий отказ:

```text
[ 141.935275] type=1400 audit(1546939304.786:43): avc: denied { write } for
pid=1836 comm="Thread-4" name="pcmC0D1c" dev="tmpfs" ino=11947
scontext=u:r:untrusted_app:s0:c512,c768 tcontext=
u:object_r:audio_device:s0 tclass=chr_file permissive=1
```

Сначала определите, относится ли узел к чувствительному audio_device. По возможности измените каталог/файл доступа и сузьте область типа.

1. Найдите конкретный узел по коду или журналу, например `/dev/pcmc00xx`.
2. Объявите новый тип в соответствующем te-файле, например file.te:

```text
type test_audio_device, dev_type;
```

3. Свяжите конкретный узел с новым типом в file_context:

```text
/dev/pcmc00xx u:object_r:test_audio_device:s0
```

4. Добавьте или измените необходимые разрешения:

```text
allow untrusted_app test_audio_device:chr_file { open write read };
```

Источник также пишет, что без сертификации GMS объект можно связать с mlstrustedobject, но прямо не рекомендует это из-за серьёзных проблем безопасности. Ниже сохранён небезопасный пример источника, не рекомендация:

```text
typeattribute audio_device mlstrustedobject;
```

### 6.3 Почему новая служба не запускается в Android 8.0+?

Проверяйте по главе 5. Новые службы Android 8.0+ должны находиться в vendor.

### 6.4 Ошибка сборки после добавления прав: neverallow xxx

Исходник связывает это с чрезмерными разрешениями и рекомендует сузить их, объявив конкретные нужные узлы. Ссылка в оригинале — «раздел 2»; ориентируйтесь на реальное правило и диагностику neverallow, не удаляйте ограничения.

### 6.5 Системные команды через system() не работают в vendor-службе после Android 8.0

PATH службы vendor переопределён как `/vendor/bin:/vendor/xbin`, поэтому команды раздела system не находятся.

```text
cc_binary {
    name: "sh_vendor",
    defaults: ["sh-defaults"],
    stem: "sh",
    vendor: true,
    cflags: [
        // Additional flags for vendor variant
        "-UMKSH_DEFAULT_PROFILEDIR",
        "-UMKSHRC_PATH",
        "-UMKSH_DEFAULT_EXECSHELL",
        "-DMKSH_DEFAULT_PROFILEDIR=\"/vendor/etc\"",
        "-DMKSHRC_PATH=\"/vendor/etc/mkshrc\"",
        "-DMKSH_DEFAULT_EXECSHELL=\"/vendor/bin/sh\"",
        "-DMKSH_DEFPATH_OVERRIDE=\"/vendor/bin:/vendor/xbin\"",
    ],
}
```

Добавьте путь system непосредственно в вызов, например:

```text
system("export PATH=$PATH:/system/bin; input tap 0 0");
```

system создаёт дочерний процесс через fork: нельзя вызывать export и input отдельно; выполняйте их совместно в одном вызове.

### 6.6 Какие каталоги изменять и как применяются изменения?

Находите файлы командами get_build_var из соответствующих разделов. По исходнику Android 8.0+ не требует изменения system/sepolicy; отсутствующие целевые файлы создайте. Соответствие результатов сборки ниже; проверьте фактический BSP:

```text
BOARD_SEPOLICY_DIRS/BOARD_PLAT_PUBLIC_SEPOLICY_DIR -> vendor/etc/selinux
BOARD_PLAT_PRIVATE_SEPOLICY_DIR -> system/etc/selinux
```

### 6.7 Почему denied сохраняется после разрешения ioctl?

ioctl обращается непосредственно к драйверам и включает тысячи команд, поэтому разрешение должно задавать конкретный cmd. См. пример 4 раздела 3.1.

## Редакторские замечания и источники

- Соответствующего английского PDF нет; английский, русский и немецкий полностью переведены с китайского. Сохранены шесть глав на десяти страницах, включая технический текст страницы 1. Технических изображений нет. Нетехнические таблицы обложки, оглавление и гриф удалены.
- Пояснения на сером фоне восстановлены как редактируемый текст, а не код. Журналы, правила, Java, init, XML, патчи и примеры сборки сохранены. Исправлены дубли лигатуры fi в одной позиции, разрывы кода, порядок пояснений и визуальные переносы команд.
- Явно сохранены проблемы источника: /system/bin/logwrapper и /init; S0/s0; ccc/ccc_service; отсутствующие точки с запятой в allow; chr_file/file и allowxperm; audio2allow; sepolicy.te。; disable; servic_name; context=mount; старые пути и назначение образов. Всё сверяйте с целевым SDK. Нумерация 6.12/6.13 сохранена.
- Источник связывает c512,c768 с чувствительными разрешениями и считает сужение прав решением neverallow. Это объяснения источника, не проверенная универсальная диагностика. Небезопасный пример mlstrustedobject и предупреждение о серьёзном риске сохранены.
- GTS/CTS — названия тестов источника, не результаты ArmSoM. Внутренняя ссылка не открывалась. Код одинаков во всех языках; пояснения не являются исполняемым кодом.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP SELinux](https://source.android.com/docs/security/features/selinux/customize)

{% endraw %}
