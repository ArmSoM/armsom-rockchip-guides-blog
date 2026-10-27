---
title: "Оптимизация Rockchip Android 11: загрузка, производительность, память и анализ"
description: "Оптимизация Rockchip Android 11: загрузка, производительность, память и анализ — V1.0.0, ART, ZRAM, bootchart, Perfetto"
excerpt: "Оптимизация Rockchip Android 11: загрузка, производительность, память и анализ"
translation_key: "242-rockchip-android11-optimization"
slug: "242-rockchip-android11-optimization"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android11", "optimization", "ART"]
---

{% raw %}

# Оптимизация Rockchip Android 11: загрузка, производительность, память и анализ

Справочный материал для ArmSoM с полным содержанием китайского руководства Rockchip Android Platform Optimization Guide 1.0.0 (документ 290, 10 страниц). Имя файла указывает Android11, но примеры охватывают RK3399 Android7.1/Linux4.4, Linux4.19, Android8.1+ и RK3568; это не единый набор патчей BSP. Английская, русская и немецкая версии переведены с единственного китайского источника. Технических рисунков в нём нет, новые не выдуманы. Аппаратные тесты ArmSoM или других плат не проводились; все времена, баллы и память взяты из примеров источника.

## Ограничения применимости и источника

- Английской версии для сравнения нет. Проверяйте ядро, governor, DTS, init, ART и SDK каждого исторического примера; в другом BSP узлы могут отсутствовать. Не отключайте AVB и не ослабляйте SELinux в производстве ради скорости. Для CTS источник требует сохранить ftrace. Драйвер удаляют только при отсутствии оборудования; асинхронность и .ko требуют проверки зависимостей и порядка.
- Повышение touch boost и снижение target_loads меняют расход энергии и нагрев. Pinner занимает невысвобождаемую память; при малой DDR нужна осторожность. Слова источника об одном ядре в сравнении с big/LITTLE неоднозначны: проверяйте топологию CPU policy, не считайте один кластер одним физическим ядром.
- file_contexts/genfs_contexts не взаимозаменяемы без учёта файловой системы и маркировки. 32-битная система должна соответствовать ABI приложений, сертификации и продукту.
- Текст ART называет speed-profile, комментарии PRODUCT_DEXPREOPT_SPEED_APPS/PRODUCT_SYSTEM_SERVER_APPS — speed; это разные фильтры. `TARGET_ARCH_VARIANT := armv8-2a` сохранён, его допустимость проверьте в SDK.
- Все четыре таблицы — примеры, не контролируемые A/B-испытания. В Pinner меняется и Android. Установка Honor of Kings 1.9G: примерно 1:44→1:31; FilesGoogle при DDR3G/630MHz: 2000ms→1100ms; оптимизация 1GB после минуты простоя: 320MB→450M. Методика и гарантии не выдуманы.
- Комментарии и коммиты сохранены; два межстраничных патча объединены, переносы PDF исправлены. `...`, `do_something`, `xxxxx` — заполнители, не готовые патчи. Пояснение из блока bootchart вынесено и переведено. Прошивка, изменение системы и monkey-тесты не выполнялись.

## 1. U-Boot

Удаление ненужных функций U-Boot уменьшает время загрузки. Источник также предлагает отключение последовательных журналов loader/U-Boot и, по требованиям, проверки AVB. Ниже настройки включения AVB. Отключение проверки ослабляет цепочку доверия; это не рекомендация для производственных или сертифицированных устройств.

```text
CONFIG_ANDROID_AVB=y
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
```

## 2. Ядро

### Оптимизация загрузки

#### Подготовка: измерение запуска ядра

Начальная точка — первый журнал ядра:

```text
[    0.000000] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
```

Конец — завершение загрузки ядра:

```text
[    1.259604] Freeing unused kernel memory: 3136K
```

Интервал между сообщениями приближённо показывает запуск ядра. По умолчанию `CONFIG_RK_CONSOLE_THREAD` уменьшает влияние последовательного вывода, поэтому временные метки не абсолютно точны, но отражают общий расход времени.

#### Измерение инициализации драйверов

Добавьте `initcall_debug` в bootargs. Пример патча RK3568 включает диагностику:

```text
+++ b/arch/arm64/boot/dts/rockchip/rk3568-android.dtsi
@@ -6,7 +6,7 @@

 / {
        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0";
+               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0 initcall_debug loglevel=8";
        };
```

#### Поиск и оптимизация медленных драйверов

Два способа исключить модуль:

1. Отключить соответствующий config ядра. Для модулей без DTS-узлов, включая часть отладочных функций, это единственный способ.

2. Отключить DTS-узел. Удаление config сокращает и время инициализации, и размер ядра, но мешает поддерживать разные аппаратные варианты разными деревьями устройств одним ядром. Если модуль аппаратно точно не используется, его можно исключить из сборки. Ниже примеры медленных драйверов в initcall.

```text
[    3.723183] initcall rknand_driver_init+0x0/0x40 returned -1 after 2261968 usecs
```

NAND занимает около 2.2s. Если NAND не нужен, удалите `CONFIG_RK_NAND`.

```text
[    3.212658] ov5695 4-0036-1: Unexpected sensor id(000000),ret(-5)
[    3.213655] probe of 4-0036-1 returned 0 after 599822 usecs

... ...

[    3.052600] gc8034 4-0037: gc8034 read reg:0xf0 failed !
[    3.852833] gc8034 4-0037: gc8034 read reg:0xf1 failed !
[    3.852874] gc8034 4-0037: Unexpected sensor id(000000), ret(-6)
[    3.853169] probe of 4-0037 returned 0 after 1598844 usecs
```

Чтение ID ov5695 и gc8034 не удалось. Если датчиков физически нет, удалите `CONFIG_VIDEO_GC8034` и `CONFIG_VIDEO_OV5695` либо отключите DTS-узлы.

```text
[    0.412736] calling  tracer_init_tracefs+0x0/0x1d4 @ 1
[    0.524499] initcall tracer_init_tracefs+0x0/0x1d4 returned 0 after 109063 usecs
```

Это `CONFIG_TRACING`. Трассировка нужна для анализа производительности, но увеличивает образ и инициализацию. Источник предлагает удалить `CONFIG_FTRACE` и `CONFIG_TRACING` в выпускаемых сборках, что может сократить и запуск других модулей. Однако для CTS действует предупреждение ниже. Для сборки Linux 4.19 после удаления нужен патч:

```text
diff --git a/drivers/staging/android/ion/ion_trace.h b/drivers/staging/android/ion/ion_trace.h
index 8233691a73eb..4ac3c3786448 100644
--- a/drivers/staging/android/ion/ion_trace.h
+++ b/drivers/staging/android/ion/ion_trace.h
@@ -14,6 +14,7 @@
 #include <linux/tracepoint.h>

 #ifndef __ION_PTR_TO_HASHVAL
+#ifdef CONFIG_FTRACE
 static unsigned int __ion_ptr_to_hash(const void *ptr)
 {
        unsigned long hashval;
@@ -24,6 +25,7 @@ static unsigned int __ion_ptr_to_hash(const void *ptr)
        /* The hashed value is only 32-bit */
        return (unsigned int)hashval;
 }
+#endif
```

Внимание: пользователям CTS нельзя менять ftrace. Удаление нарушает systrace и аналогичные функции и вызывает ошибки CTS.

Обрезку ядра подбирайте под реальную аппаратуру; примеры относятся к необязательным модулям. Для необходимых, но медленных модулей рассмотрите два подхода.

1. Перенести длительные операции в Linux work для параллельного выполнения без блокировки инициализации драйвера.

2. Рассмотреть загрузку драйвера как модуля `.ko`.

### Оптимизация производительности

### Touch boost

Касание/мышь повышает частоту CPU. Обычно максимум не используется ради баланса мощности и скорости. Для чувствительных к задержке задач источник предлагает повысить частоту до максимума; пример для RK3399 Linux 4.4. Сначала проверьте температурные и энергетические пределы.

```text
diff --git a/drivers/cpufreq/cpufreq_interactive.c b/drivers/cpufreq/cpufreq_interactive.c
index 7a627216ac39..cad6026da0f5 100644
--- a/drivers/cpufreq/cpufreq_interactive.c
+++ b/drivers/cpufreq/cpufreq_interactive.c
@@ -1329,9 +1329,9 @@ static void rockchip_cpufreq_policy_init(struct cpufreq_policy *policy)
        if (policy->cpu == 0) {
                tunables->hispeed_freq = 1008000;
                tunables->touchboostpulse_duration_val = 500 * USEC_PER_MSEC;
-               tunables->touchboost_freq = 1200000;
+               tunables->touchboost_freq = 1416000;
        } else {
-               tunables->hispeed_freq = 816000;
+               tunables->hispeed_freq = 1800000;
        }

        index = (policy->cpu == 0) ? 0 : 1;
```

У RK3399 большие и малые ядра, поэтому меняются два места. Для описанного однородного/однополитического варианта меняйте ветвь:

```text
if (policy->cpu == 0)
```

Изменение выполняется внутри этой ветви.

### CPU target_loads

Помимо выбранного governor Linux меняет частоту по нагрузке. `target_loads` задаёт порог нагрузки в узле:

```text
/sys/devices/system/cpu/cpufreq/policy0/interactive/target_loads
```

Чем ниже значение, тем легче перейти на высокую частоту. Описанное значение по умолчанию — 90: при 90% нагрузки частота повышается. Снижение улучшает отклик ценой энергии. Обычно важны оба фактора, поэтому задают пороги для нескольких частот. Пример патча RK3399 Android 7.1:

```text
commit 0d73bc800b4fdd9a4b5d4a31d521e1e897b107e2
Author: Wenping Zhang <wenping.zhang@rock-chips.com>
Date:   Tue Dec 25 15:21:29 2018 +0800

    change the target_loads of cpu frequence policy for cpuB.

    previous target_loads is 65, which will cause cpu increase to
    high freqence when load is low, so we change the target_loads
    to make sure cpu will transmit to high frequence when cpu load
    is high and make sure cpu will stay in low frequence when load
    is low.

    Change-Id: I3c99039ac79d5915f1186994d7c2f58ffcbdd581
    Signed-off-by: Wenping Zhang <wenping.zhang@rock-chips.com>

diff --git a/init.tablet.rc b/init.tablet.rc
index faac269..8b535ec 100755
--- a/init.tablet.rc
+++ b/init.tablet.rc
@@ -19,7 +19,7 @@ on boot
     write /dev/cpuset/background/cpus 0
     write /dev/cpuset/system-background/cpus 0-3
     write /dev/cpuset/top-app/cpus 0-5
-    write /sys/devices/system/cpu/cpufreq/policy4/interactive/target_loads 65
+    write /sys/devices/system/cpu/cpufreq/policy4/interactive/target_loads "65 1008000:70 1200000:75 1416000:80 1608000:90"
     ioprio rt 4
service lan_bridge_on /system/bin/sh /system/bin/lan_bridge_on.sh
```

Подробности target_loads: `Documentation/cpu-freq/governors.txt` в ядре.

## 3. Android

### Оптимизация загрузки

По умолчанию `init.rc` поддерживает фиксированные частоты CPU/DDR при загрузке; источник сообщает о заметном ускорении.

Дополнительные действия добавьте в `init.rc`:

```text
on early-init
    do_something

on property:sys.boot_completed=1
    do_some_resume
```

### Повышение эффективности I/O

При загрузке много последовательного I/O. Настройка опережающего чтения может повысить скорость. Пример SDK использует `mmcblk2` и несколько интенсивно читаемых разделов. Проверьте реальную разметку и аналогично настройте новые интенсивно читаемые разделы.

```text
on late-fs
    # boot time fs tune
    write /sys/block/mmcblk2/queue/iostats 0
    write /sys/block/mmcblk2/queue/read_ahead_kb 2048
    write /sys/block/mmcblk2/queue/nr_requests 256
    write /sys/block/dm-0/queue/read_ahead_kb 2048

on property:sys.boot_completed=1
    # end boot time fs tune
    write /sys/block/mmcblk2/queue/read_ahead_kb 128
    write /sys/block/mmcblk2/queue/nr_requests 128
    write /sys/block/dm-0/queue/read_ahead_kb 128
    write /sys/block/mmcblk2/queue/iostats 1
```

DTS может зафиксировать порядок инициализации EMMC:

```text
aliases {
    mmc0 = &sdmmc0;
    mmc1 = &sdmmc1;
    mmc2 = &sdhci;
    mmc3 = &sdmmc2;
};
```

#### Проверка аномального ожидания служб

Сопоставьте bootchart и журнал загрузки. Если задача выполняется одним потоком, выясните, блокирует ли она загрузку.

### Оптимизация политики SELinux

Источник описывает маркировку узлов через file_contexts или genfs_contexts и сравнивает их ниже. Применимость зависит от файловой системы и политики: они не произвольно взаимозаменяемы.

1. file_contexts поддерживает регулярные выражения, но по источнику работает медленнее.

2. genfs_contexts не поддерживает регулярные выражения и описывается как более быстрый. Избегайте лишних шаблонов и используйте genfs_contexts там, где это допустимо, для ускорения загрузки политики.

### Оптимизация производительности

### Pinner Service

Android 7.1 и выше могут закреплять модули в памяти, избегая повторного вытеснения/загрузки. Rockchip Android 11 настраивает часто используемые модули в:

```text
vendor/rockchip/common/apps:
RockchipPinnerService
```

Приложение является overlay-модулем; сборка различает 32- и 64-битные системы автоматически. Для включения добавьте в `device.mk`:

```text
PRODUCT_PACKAGES += RockchipPinnerService
```

1. Для Android 10.0 и ниже изучите APK и меняйте `config.xml` в frameworks/base напрямую, самостоятельно выбирая 32-/64-битные файлы.

2. Используйте `lsof` для анализа библиотек. Эталонные библиотеки широко используются system_server и другими процессами, поэтому закрепление полезно. Бездумное добавление тратит память и снижает скорость; учитывайте нагрузку.

3. Закрепление занимает память; на устройствах с малой DDR его лучше избегать.

4. Источник сообщает об увеличении AnTuTu и предлагает включение при достаточной RAM. Ниже сравнение с PinnerService на RK3399 «Excavator»; версии Android различаются, поэтому эффект сервиса отдельно не доказан.

| Версия Android | Оценка AnTuTu |
| --- | --- |
| android 10.0 | около 13w (130,000) |
| android 11.0 | около 14.3w (143,000) |

#### Оптимизация под нагрузку

Ссылка источника на AOSP: https://source.android.com/devices/bootloader/boot-image-profiles

Внимание: изменение профиля по единственному сценарию может замедлить загрузку устройства и APK.

### Использование 32-битной системы

Источник сообщает об улучшении отклика 32-битного Android при малой или медленной DDR. После проверки требований приложений и платформы добавьте в `BoardConfig.mk`:

```text
TARGET_ARCH := arm
TARGET_ARCH_VARIANT := armv8-2a
TARGET_CPU_ABI := armeabi-v7a
TARGET_CPU_ABI2 := armeabi

TARGET_2ND_ARCH :=
TARGET_2ND_ARCH_VARIANT :=
TARGET_2ND_CPU_ABI :=
TARGET_2ND_CPU_ABI2 :=
TARGET_2ND_CPU_VARIANT :=
```

### Настройка компиляции ART

Источник предлагает список основных приложений и профильную компиляцию `speed-profile` для ускорения. Пример ниже выбирает для перечисленных приложений фильтр `speed`; это разные режимы. Комментарии поясняют список основных приложений, новую возможность профильной компиляции постоянных приложений вроде SystemUI лишь после перезагрузки и возможную пользу постоянной AOT-компиляции. Приложения system server также по умолчанию используют speed.

```text
# ⼀个应⽤列表，⽤于列出哪些应⽤已被确定为产品的核⼼应⽤。
# 添加后将使⽤ speed 编译过滤器对其进⾏编译。
# 注意，常驻应⽤（如 SystemUI）只有在下次系统重新启动时才有机会使⽤配置⽂件引导型编译。
# 因此对于产品来说，让这些应⽤始终采⽤ AOT 编译可能会更好。
PRODUCT_DEXPREOPT_SPEED_APPS += \
    Settings \
    Camera2 \
    ...

# 系统服务器加载的应⽤的列表。这些应⽤将默认使⽤ speed 编译过滤器进⾏编译
PRODUCT_SYSTEM_SERVER_APPS += \
    FilesGoogle \
    Settings \
    ...
```

Сравнение запуска до/после включения по источнику, DDR 3G/630MHz:

| FilesGoogle | Время запуска: am start -S -W |
| --- | --- |
| PRODUCT_DEXPREOPT_SPEED_APPS не добавлен | около 2000ms |
| PRODUCT_DEXPREOPT_SPEED_APPS добавлен | около 1100ms |

По источнику, PRODUCT_SYSTEM_SERVER_APPS эффективнее с 32-битной системой при низкой частоте DDR.

Иначе он может лишь увеличить размер системы без заметной пользы.

#### Ручная проверка компиляции

```text
adb shell cmd package compile -m speed-profile -f com.android.settings
```

#### Потоки компиляции и привязка CPU

С Android 11 параметры компиляции позволяют нескольким потокам работать на выбранной группе CPU:

1. `dalvik.vm.boot-dex2oat-cpu-set`: CPU потоков dex2oat во время загрузки.

2. `dalvik.vm.image-dex2oat-cpu-set`: CPU dex2oat при компиляции загрузочных образов.

3. `dalvik.vm.dex2oat-cpu-set`: CPU потоков dex2oat после загрузки.

4. `dalvik.vm.dex2oat-threads`: многопоточная компиляция. Пример:

```text
PRODUCT_PRODUCT_PROPERTIES += \
    dalvik.vm.dex2oat-cpu-set=0,1,2,3 \
    dalvik.vm.boot-dex2oat-threads=4 \
    dalvik.vm.dex2oat-threads=4
```

Согласуйте число потоков dex2oat с числом выбранных CPU для устранения лишней конкуренции за CPU и I/O.

Несколько потоков могут ускорить установку APK, особенно больших. Сравнение источника:

| Honor of Kings (1.9G) | time adb install *.apk |
| --- | --- |
| N/A | около 1:44 |
| 4 потока | около 1:31 |

## 4. Оптимизация малой памяти

Для устройств 1GB повышают использование ZRAM и периодически освобождают файловый кэш и анонимные страницы фоновых процессов. Источник сообщает о приемлемом уровне памяти для обычных сценариев 1GB. Возьмите архив ниже и примените по README.

```text
RKDocs/android/patches/memory_optimization/MemoryReclaim_*.tar.gz
```

| Свободная память после загрузки и минуты простоя | adb shell dumpsys meminfo |
| --- | --- |
| N/A | около 320MB |
| После оптимизации | около 450M |

Архив содержит некоторое сокращение функций; адаптируйте к требованиям продукта.

## 5. Инструменты анализа

### bootchart

bootchart анализирует запуск Linux: время процессов, CPU/I/O и наглядное изображение. Он применим и в Android. Включите вручную следующими командами для поиска затратных служб и ускорения загрузки; источник также упоминает ресурсы CPU/ROM.

```text
adb shell 'touch /data/bootchart/enabled'
adb reboot
# 开机后，pull出相关数据⽂件
adb shell 'tar -czf /sdcard/bootchart.tgz /data/bootchart'
adb pull /sdcard/bootchart.tgz .
bootchart bootchart.tgz -o bootchart.png
```

Команды создают изображение использования ресурсов службами. Альтернатива — скрипт SDK `./system/extras/boottime_tools/bootanalyze/bootanalyze.py -h`; параметр `-b` включает bootchart.

### Приоритеты CPU/I/O и порядок запуска против одновременной конкуренции

Используйте `priority` и `ioprio` в init.rc. Ниже привилегированная служба источника; её значения не являются универсально безопасными.

```text
service xxxxx /vendor/bin/hw/xxxx
    user root
    group root system
    priority -20
    ioprio rt 0
    writepid /dev/cpuset/foreground/tasks
```

### Анализ памяти

Ядро Android 11 собирает dmabuf для анализа DMA-памяти:

```text
cat /d/dma_buf/bufinfo
cat /d/dma_buf/bufprocs
```

SDK добавляет параметр monkey для сбора dmabuf при недостатке памяти. По следующему патчу адаптируйте monkey для сбора полезных данных при ошибке.

```text
development:
commit f82c5582bfc5f1fb9fcf46c9716e5f414bf89c84
Author: Bian Jin chen <kenjc.bian@rock-chips.com>
Date:   Fri Apr 2 16:20:38 2021 +0800

    Capture dmabuf info when the device is in low memory.

    Use: monkey ** --dump-dmabuf
    Example: monkey --throttle 200 --ignore-crashes \
            --ignore-timeouts --ignore-security-exceptions --dump-dmabuf -v -v 5000000

    Signed-off-by: Bian Jin chen <kenjc.bian@rock-chips.com>
    Change-Id: Ic0c0629158ef45db2cea4bbe30b9147cf4023363
```

### Сбор трасс Perfetto

Android 9.0 и выше поддерживает сбор на устройстве, копирование файла и просмотр в браузере.

1. В параметрах разработчика включите System Tracing. При желании Show Quick Setting tile добавит переключатель записи в панель уведомлений.

2. После записи скопируйте файл через adb:

```text
adb pull data/local/traces .
```

3. Откройте https://ui.perfetto.dev/#!/

4. Откройте файл для анализа записанных данных.

5. Опция источника Open with legacy UI показывает старый формат systrace. Доступность интерфейса может отличаться от руководства 2021 года.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
