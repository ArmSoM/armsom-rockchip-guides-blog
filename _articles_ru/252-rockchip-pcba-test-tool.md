---
title: "Руководство разработчика инструмента PCBA Rockchip"
description: "Руководство разработчика инструмента PCBA Rockchip"
excerpt: "Руководство разработчика инструмента PCBA Rockchip"
translation_key: "252-rockchip-pcba-test-tool"
slug: "252-rockchip-pcba-test-tool"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "PCBA"]
---

{% raw %}

# Руководство разработчика инструмента PCBA Rockchip

Полный технический текст двуязычного RK-KF-YF-264 V1.3: обзор, тесты, настройки, расширение параметров/тестов, интерфейсы, поворот, сборка и запуск. Сохранены технические версии: автоопределение Bluetooth после Android 5.0 и поддержка Android 10.0 в V1.3. Это исторический охват источника; проверьте целевой BSP. Аппаратура не тестировалась. Китайский/английский используют соответствующие исходные абзацы; русский/немецкий переведены полностью. Технических изображений и таблиц нет, новые не создавались. Удалены даты обложки, заявления, контакты, аудитория и история изменений.

Проверка: соединены страницы; пояснения интерфейсов вынесены из комментариев и полностью переведены, короткие китайские комментарии локализованы. Сохранены вопросы источника: UST HOST/USB HOST, test_cong.cfg/test_config.cfg, Expample, регистр Boardconfig.mk, утверждение о неиспользуемом program против case1/case2, размещение codec среди автоматических тестов при category=1. Фигурные кавычки module_args, error/n, ...... и незаполненные условия — исходные примеры, не готовая компилируемая программа. Китайское «акустическая обратная связь» точнее английского noise; эта точность сохранена. Форматирование стирает данные: проверьте носитель и сделайте копию. При аудиотестах соблюдайте безопасную громкость и конфиденциальность записей. Тесты, форматирование и сборка не выполнялись.

<!-- source:bilingual p2 unit:0 -->

## Обзор

<!-- source:bilingual p2 unit:1 -->

Инструмент PCBA помогает быстро выявлять неисправности функций изделий при массовом производстве и повышать эффективность. Тестируются экран (LCD), беспроводная сеть (Wi-Fi), Bluetooth, память DDR/eMMC, SD-карта, USB HOST, кнопки (KEY), динамики и наушники (Codec).

<!-- source:bilingual p2 unit:2 -->

Тесты делятся на автоматические и ручные. Беспроводная сеть, DDR/eMMC и Ethernet проверяются автоматически; кнопки, SD-карта, USB Host и Codec требуют ручного участия.

<!-- source:bilingual p2 unit:3 -->

Тесты настраиваются файлом test_config.cfg; при необходимости можно добавить новые. Подробности приведены в разделе настройки этого документа.

<!-- source:bilingual p3 unit:4 -->

## Описание тестов

<!-- source:bilingual p3 unit:5 -->

Тесты делятся на автоматические и ручные.

<!-- source:bilingual p3 unit:6 -->

При автоматических тестах система выполняет проверку и оценивает результат, например для сети и памяти. Ручные тесты требуют участия оператора в выполнении или оценке: запись звука, кнопки, USB-накопитель, SD-карта и другие.

<!-- source:bilingual p3 unit:7 -->

Состояния тестов обозначаются двумя цветами: красным и жёлтым.

<!-- source:bilingual p3 unit:8 -->

Жёлтый: тест ожидает выполнения или выполняется. При успешном завершении отображается [PASS].

<!-- source:bilingual p3 unit:9 -->

Красный: тест не пройден.

<!-- source:bilingual p3 unit:10 -->

### Автоматические тесты

<!-- source:bilingual p3 unit:11 -->

#### Определение ёмкости DDR/EMMC

<!-- source:bilingual p3 unit:12 -->

Автоматический тест показывает ёмкость DDR и EMMC устройства в GB. Типичные DDR: 1GB, 2GB, 4GB; EMMC: 2GB, 4GB, 8GB, 16GB, 32GB, 64GB, 128GB. Пример результата: «системная память: [PASS] { DDR: 2GB, EMMC: 16GB }».

<!-- source:bilingual p3 unit:13 -->

#### Беспроводная сеть (тест Wi-Fi)

<!-- source:bilingual p3 unit:14 -->

Wi-Fi проверяется автоматически: сканируются окружающие AP и показываются имя и уровень сигнала самого сильного AP. Уровень отображается от 0 до 4 делений. Пример: «сеть: [PASS] { “AP WIFI” уровень сигнала 4 деления }».

<!-- source:bilingual p3 unit:15 -->

#### Тест Ethernet

<!-- source:bilingual p3 unit:16 -->

Предусмотрены два метода. По умолчанию связь Ethernet проверяется ping: отправлено 5 пакетов, получено 5, потеряно 0. Локальный адрес и адрес назначения ping задаются в external/rk-pcba-test/res/test_cong.cfg.

<!-- source:bilingual p3 unit:17 -->

Другой метод проверяет включение сетевой карты. Включённая карта имеет адрес inet6, например «inet6 addr: fe80::c8eb:eaff:fe6d:730d/64 Scope:Link».

<!-- source:bilingual p3 unit:18 -->

Наличие адреса inet6 считается исправностью Ethernet, но не подтверждает работоспособность сетевого обмена. Для этого режима закомментируйте «use_ping = 1;» в external/rk-pcba-test/lan_test.c.

<!-- source:bilingual p4 unit:19 -->

#### Тест наушников/динамика (codec)

<!-- source:bilingual p4 unit:20 -->

Codec имеет два режима: одновременная запись и воспроизведение либо воспроизведение перед записью. Второй менее эффективен, но не вызывает акустической обратной связи с динамиком и подходит для динамиков. Одновременный режим быстрее, но с динамиком вызывает обратную связь, поэтому подходит для наушников. Уровень записи зависит от входа и показывается в диапазоне 0–100%, например «уровень записи: [25%]». Настройка режимов описана далее.

<!-- source:bilingual p4 unit:21 -->

#### Тест Bluetooth

<!-- source:bilingual p4 unit:22 -->

Bluetooth проверяется автоматически. После включения проверки система определяет результат и показывает PASS или FAIL.

<!-- source:bilingual p4 unit:23 -->

Порт Bluetooth по умолчанию — /dev/ttyS0. Если используется другой, измените UartPort в hardware/broadcom/libbt/conf/rockchip/rksdk/bt_vendor.conf на фактический порт.

<!-- source:bilingual p4 unit:24 -->

### Ручные тесты

<!-- source:bilingual p4 unit:25 -->

#### Тест SD-карты

<!-- source:bilingual p4 unit:26 -->

После вставки SD-карта обнаруживается автоматически. На экране показывается результат; при успехе также отображается её ёмкость.

<!-- source:bilingual p4 unit:27 -->

SD-карта должна иметь FAT32; другие форматы не поддерживаются. На всей карте допускается только один раздел. Несоответствующую карту следует отформатировать в требуемый формат.

<!-- source:bilingual p4 unit:28 -->

#### Тест USB HOST

<!-- source:bilingual p4 unit:29 -->

USB HOST обычно проверяется USB-накопителем. После подключения выполняется автоматическое обнаружение, затем показываются результат и ёмкость накопителя.

<!-- source:bilingual p4 unit:30 -->

Как и SD-карта, USB-накопитель должен иметь FAT32 и только один раздел; другие форматы не поддерживаются. Если требования не выполнены, отформатируйте его в стандартный формат.

<!-- source:bilingual p5 unit:31 -->

## Файл конфигурации

<!-- source:bilingual p5 unit:32 -->

Все тесты PCBA настраиваются через test_config.cfg в каталоге «Android SDK»/bootable/recovery/pcba_core/res/test_config.cfg. Пользователь адаптирует файл к аппаратуре проекта, выбирает проверяемые модули и передаёт программе нужные параметры.

<!-- source:bilingual p5 unit:33 -->

Используется формат INI: разделы, ключи и значения. Обычно раздел соответствует модулю. Файл должен быть в UTF-8; другие кодировки могут вызвать неизвестные ошибки.

<!-- source:bilingual p5 unit:34 -->

### 1.3.1 Пример конфигурационного файла

<!-- source:bilingual p5 unit:35 -->

```text
[example]
display_name= "Example"
activated = 1
program = "example.sh"
category = 0
[example]
```

<!-- source:bilingual p5 unit:36 -->

#### [example] / Example

<!-- source:bilingual p5 unit:37 -->

Example — имя модуля конфигурации. Имена встроенных модулей cfg менять нельзя, иначе соответствующий тест не запустится.

<!-- source:bilingual p5 unit:38 -->

#### display_name

<!-- source:bilingual p5 unit:39 -->

display_name — отображаемое имя тестового модуля. Его можно изменить; максимум 64 байта. При пустом имени программа теста не запускается.

<!-- source:bilingual p5 unit:40 -->

#### activated

<!-- source:bilingual p5 unit:41 -->

activated определяет необходимость теста: 0 — не проверять модуль, 1 — проверять.

<!-- source:bilingual p5 unit:42 -->

#### program

<!-- source:bilingual p5 unit:43 -->

Сейчас ключ не используется и не требует настройки.

<!-- source:bilingual p5 unit:44 -->

#### category

<!-- source:bilingual p5 unit:45 -->

category определяет метод: 0 — автоматический, 1 — ручной.

<!-- source:bilingual p5 unit:46 -->

#### Пример

<!-- source:bilingual p6 unit:47 -->

```text
[Key] // тест кнопок
display_name= "Key"
activated = 1 // тестировать этот пункт
program = "keytester"
category = 1 // ручной тест
```

<!-- source:bilingual p6 unit:48 -->

### Настройка отдельных тестов

<!-- source:bilingual p6 unit:49 -->

#### Тест аудио

<!-- source:bilingual p6 unit:50 -->

```text
[Codec]
display_name= "Codec"
activated = 1 // тестировать этот пункт
program = "case1" //case1, case2
category = 1 // ручной тест
run_type = 1
delay = 5
volume = 40
```

<!-- source:bilingual p6 unit:51 -->

##### Case1

<!-- source:bilingual p6 unit:52 -->

Воспроизведение перед записью: менее эффективный режим, но с динамиком нет акустической обратной связи. Выбирайте его для динамиков.

<!-- source:bilingual p6 unit:53 -->

##### Case2

<!-- source:bilingual p6 unit:54 -->

Одновременное воспроизведение и запись: высокая эффективность, но с динамиком возникает обратная связь. Подходит для наушников.

<!-- source:bilingual p6 unit:55 -->

#### Тест Bluetooth

<!-- source:bilingual p6 unit:56 -->

```text
[bluetooth]
display_name= "bluetooth"
activated = 1
program =
category =
run_type = 1
chip_type = "" ; rk903, mt6622, rda587x, rda5990,rtk8723as
```

<!-- source:bilingual p6 unit:57 -->

chip_type выбирает модель BT-чипа. По умолчанию пусто, то есть BT не тестируется. После Android 5.0 выбор не требуется: система определяет модель автоматически.

<!-- source:bilingual p6 unit:58 -->

#### Тест датчиков

<!-- source:bilingual p6 unit:59 -->

```text
[allsensor]
display_name= "allsensor"
activated = 0
program = ""
category = 0
run_type = 1
sensor_type = 39
```

<!-- source:bilingual p7 unit:60 -->

sensor_type выбирает датчики: 1 — GSENSOR, 2 — GYROSCOPE, 4 — COMPASS, 8 — LSENSOR, 16 — PSENSOR, 32 — GSENSOR_CALIBRATE. Для нескольких датчиков сложите соответствующие значения. По умолчанию 39 = GSENSOR_CALIBRATE(32)+COMPASS(4)+GYROSCOPE(2)+GSENSOR(1).

<!-- source:bilingual p7 unit:61 -->

#### Тест камеры

<!-- source:bilingual p7 unit:62 -->

```text
[camera]
display_name = "camera"
activated = 1
category = 0
program = ""
number = 2
```

<!-- source:bilingual p7 unit:63 -->

number задаёт число проверяемых камер; поддерживается максимум 2 камеры.

<!-- source:bilingual p7 unit:64 -->

Для самостоятельного добавления тестового модуля см. документ «RK_PCBA_Camera移植说明v1.0.doc».

<!-- source:bilingual p7 unit:65 -->

## Расширение параметров конфигурации

<!-- source:bilingual p7 unit:66 -->

Параметры тестов в test_config.cfg можно расширять. Если модулю нужны дополнительные параметры из конфигурации, добавьте их следующим образом:

<!-- source:bilingual p7 unit:67 -->

```text
[example]
display_name= "Example"
activated = 1
program = "example.sh"
module_args = “xxx”
```

<!-- source:bilingual p7 unit:68 -->

В тестовой программе значения параметров можно получить через API script_fetch:

<!-- source:bilingual p7 unit:69 -->

```text
int script_fetch(char *main_name, char *sub_name, int value[], int count);
```

<!-- source:bilingual p7 unit:70 -->

main_name — имя тестового модуля в test_config.cfg; в примере «example».

<!-- source:bilingual p7 unit:71 -->

sub_name — ключ, например activated, display_name, module_args и т. п.

<!-- source:bilingual p7 unit:72 -->

### Пример получения значения

<!-- source:bilingual p8 unit:73 -->

```text
if(script_fetch("example", "module_args", (int *)des, 8) == 0)
{
printf("module_args value is: %s\n",des);
}
```

<!-- source:bilingual p8 unit:74 -->

## Добавление тестов

<!-- source:bilingual p8 unit:75 -->

Программа PCBA позволяет добавлять собственные тесты. Если проект использует ещё не поддерживаемый модуль, напишите его тест и интегрируйте в тестовый фреймворк.

<!-- source:bilingual p8 unit:76 -->

Порядок интеграции:

<!-- source:bilingual p8 unit:77 -->

Сначала создайте тестовую программу и заголовочный файл. Интерфейс теста должен иметь формат void * xxxx_test(void *argv, display_callback *hook).

<!-- source:bilingual p8 unit:78 -->

Определите, будет тест ручным или автоматическим, и добавьте нужную конфигурацию в test_config.cfg.

<!-- source:bilingual p8 unit:79 -->

Зарегистрируйте свой тестовый код в rkfactory_test.cpp.

<!-- source:bilingual p8 unit:80 -->

```text
/* new_test.h */
#ifndef _NEW_TEST_H_
#define _NEW_TEST_H_
#include "display_callback.h"
void *new_test(void *argv, display_callback *hook);
#endif
/* new_test.cpp */
void *new_test(void *argv, display_callback *hook) {
struct testcase_info *tc_info = (struct testcase_info *)argv;
char msg[50];
snprintf(msg, sizeof(msg), "%s:[%s..]", "New Test", PCBA_TESTING);
hook->handle_refresh_screen(tc_info->y, msg);
if (/* pass or fail */) {
hook->handle_refresh_screen_hl(tc_info->y, msg, highlight);
}
}
/* rkfactory_test.cpp */
#include "new_test.h"
int start_test_pthread(struct testcase_info *tc_info) {
......
if (!strcmp(tc_info->base_info->name, "new")) {
init_title_lines_for_testcase(tc_info->base_info->name, tc_info);
std::thread *temp = new std::thread(&new_test, tc_info, get_display_hook());
if (!temp) {
printf("create %s test thread error/n", tc_info->base_info->name);
}
}
......
}
```

<!-- source:bilingual p9 unit:81 -->

### Описание интерфейсов

<!-- source:bilingual p9 unit:82 -->

msg_index — индекс отображаемой записи; обычно передаётся её позиция при создании, соответствующая позиции в массиве сообщений. msg — текст для отображения типа std::string, задаваемый разработчиком.

<!-- source:bilingual p9 unit:83 -->

```text
handle_refresh_screen(int msg_index, string msg);
```

<!-- source:bilingual p9 unit:84 -->

highlight определяет подсветку сообщения. По умолчанию цвет красный; при неудаче теста обычно передаётся true.

<!-- source:bilingual p9 unit:85 -->

```text
handle_refresh_screen_hl(int msg_index, string msg, boolean highlight);
```

<!-- source:bilingual p9 unit:86 -->

new_test — тестовая функция модуля.

<!-- source:bilingual p9 unit:87 -->

## Настройка поворота экрана

<!-- source:bilingual p9 unit:88 -->

PCBA поддерживает поворот на 0°, 90°, 180° и 270° для различного размещения экрана. 0° и 180° соответствуют портретной ориентации, 90° и 270° — альбомной. По умолчанию 0°.

<!-- source:bilingual p9 unit:89 -->

Поворот экрана настраивается в device/rockchip/common/Boardconfig.mk.

<!-- source:bilingual p9 unit:90 -->

```text
#rotate screen to 0, 90, 180, 270
#0: ROTATION_NONE ORIENTATION_0 : 0
#90: ROTATION_RIGHT ORIENTATION_90 : 90
#180: ROTATION_DOWN ORIENTATION_180: 180
#270: ROTATION_LEFT ORIENTATION_270: 270
# For Recovery Rotation
TARGET_RECOVERY_DEFAULT_ROTATION ?= ROTATION_NONE
```

<!-- source:bilingual p9 unit:91 -->

## Сборка, настройка и упаковка образа

<!-- source:bilingual p9 unit:92 -->

Программа PCBA расположена в «Android SDK»/bootable/recovery/pcba_core. При сборке pcba_core статически связывается с recovery. Файлы из pcba_core/res автоматически копируются в каталог pcba системы recovery.

<!-- source:bilingual p9 unit:93 -->

PCBA работает в Recovery. Последовательность: после включения войдите в Recovery, затем запустите программу PCBA для функциональных тестов.

{% endraw %}
