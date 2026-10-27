---
title: "Настройка дисплейного фреймворка Rockchip Android BOX"
description: "Настройка режимов DRM и раздела Baseparameter: framebuffer, резервная область и диагностика."
excerpt: "Настройка режимов DRM и раздела Baseparameter: framebuffer, резервная область и диагностика."
translation_key: "256-rockchip-android-box-display"
slug: "256-rockchip-android-box-display"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}


Источник:RK-SM-YF-504 V1.0.1,CN. Настройки разрешения,масштаба,цвета,BCSH,framebuffer и основного/дополнительного дисплея BOX SDK. Область:RK3328/RK3368/RK3229,Linux4.4/Linux4.19,Android8.1+. Не проверка ArmSoM или всех новых SDK;команды не выполнялись. Шесть рисунков из CN,источника EN нет.

## 1 Настройки дисплея

### 1.1 Поток настроек дисплея

Описанная RK-платформа Android8.1+ использует DRM (Direct Rendering Manager). Верхний интерфейс задаёт параметры,HWC применяет их через libdrm. Схема:TVSetting → rkdisplay → HWC → libdrm → kernel.

![Поток настроек](/docs/rockchip-android-box-display/images/display-flow.png)

Поток настроек - Оригинальная иллюстрация;страница PDF 5 (CN).

### 1.2 Фильтрация разрешений

Начальный список содержит лишние режимы. HWC фильтрует HDMI/DP и другие hotplug-экраны через device/rockchip/common/resolution_white.xml перед передачей наверх. Каждый `<resolution>` задаёт один разрешённый режим;временные поля см.схему.

| Поле | Значение |
| --- | --- |
| clock | Тактовая частота |
| hdisplay | Поле временной диаграммы2 |
| hsync_start | Поле временной диаграммы2 |
| hsync_end | Поле временной диаграммы2 |
| htotal | Поле временной диаграммы2 |
| hskew | Поле временной диаграммы2 |
| vdisplay | Поле временной диаграммы2 |
| vsync_start | Поле временной диаграммы2 |
| vsync_end | Поле временной диаграммы2 |
| vtotal | Поле временной диаграммы2 |
| vscan | Поле временной диаграммы2 |
| vrefresh | Частота кадров |
| flags | Биты синхронизации/чересстрочности ниже |
| vic | VIC стандарта HDMI;0 если не определён |

```c
DRM_MODE_FLAG_PHSYNC (1<<0)
DRM_MODE_FLAG_NHSYNC (1<<1)
DRM_MODE_FLAG_PVSYNC (1<<2)
DRM_MODE_FLAG_NVSYNC (1<<3)
DRM_MODE_FLAG_INTERLACE (1<<4)
```

![Определения временных параметров](/docs/rockchip-android-box-display/images/mode-timing.png)

Определения временных параметров - Оригинальная иллюстрация;страница PDF 6 (CN).

## 2 Раздел Baseparameter

### 2.1 Образ Baseparameter

Настройки хранятся в разделе Baseparameter1МБ,инициализируемом прошивкой baseparameter.img. Стандартный файл:device/rockchip/common/baseparameter/baseparameter_fb1080.img. Новый образ создаётся saveBaseParameter;задайте TARGET_BASE_PARAMETER_IMAGE в BoardConfig.mk:

```make
TARGET_BASE_PARAMETER_IMAGE := device/rockchip/rk3328/baseparameter.img
```

### 2.2 saveBaseParameter

Утилита читает,настраивает и экспортирует раздел. Код:device/rockchip/common/baseparameter/saveBaseParameter. По умолчанию в eng/userdebug;запуск на устройстве. -h помощь,-p данные,-t `<path>` экспорт образа для pull/прошивки. Остальные опции исходной справки:

| Опция | Значение/пример |
| --- | --- |
| -d | Дисплей0/1 |
| -f | 1920x1080@60 |
| -D | HDMI-A,TV |
| -c | RGB, YCbCr444-10bit |
| -u | 2 авторазрешение;1 фиксированное |
| -o | Overscan100,100,100,100 |
| -b | BCSH50,50,50,50 |
| -R | 1 сброс пользовательских настроек;2 раздел вместе с резервом |

![Справка saveBaseParameter](/docs/rockchip-android-box-display/images/tool-help.png)

Справка saveBaseParameter - Оригинальная иллюстрация;страница PDF 7 (CN).

![Пример данных раздела](/docs/rockchip-android-box-display/images/partition-dump.png)

Пример данных раздела - Оригинальная иллюстрация;страница PDF 8 (CN).

Основная область принимает настройки пользователя;заводской сброс стирает её и копирует резервную. Обе содержат main/aux:resolution,color,fbinfo(framebuffer),device,bcsh(яркость,контраст,насыщенность,тон),overscan(left,top,right,bottom),feature(флаги). Порядок CLI overscan отличается от структуры ниже.

### 2.3 Структуры данных раздела

#### 2.3.1 Структура раздела

```c
struct disp_info{
struct drm_display_mode resolution;
struct overscan scan;
enum output_format format;
enum output_depth depthc;
unsigned int feature;
struct hwc_inital_info hwc_info;
struct bcsh_info bcsh;
unsigned int reserve[128];
struct lut_data mlutdata;
};
```

```c
struct disp_info main;
struct disp_info aux;
```

main в первом диапазоне8КБ,aux со смещением8КБ. sizeof(disp_info) не8КБ:читайте/пишите отдельно,перед aux lseek8КБ. Подписи схемы:drm_display_mode52Б,overscan12Б,format4Б,depth4Б,feature4Б,hwc_inital_info140Б,bcsh8Б,reserve512Б,lut_data6КБ+4. Это подписи,не проверенный ABI:ниже lut_data содержит16-битный size и три массива1024×16бит;выравнивание сверяйте с SDK.

![Структура main/aux](/docs/rockchip-android-box-display/images/partition-layout.png)

Структура main/aux - Оригинальная иллюстрация;страница PDF 9 (CN).

#### 2.3.2 Поля disp_info

drm_display_mode хранит тайминги;clock в кГц. overscan — предел и края масштабирования.

```c
struct drm_display_mode {
/* Proposed mode values */
int clock; /* in kHz */
int hdisplay;
int hsync_start;
int hsync_end;
int htotal;
int vdisplay;
int vsync_start;
int vsync_end;
int vtotal;
int vrefresh;
int vscan;
unsigned int flags;
int picture_aspect_ratio;
};
```

```c
struct overscan {
unsigned int maxvalue;
unsigned short leftscale;
unsigned short rightscale;
unsigned short topscale;
unsigned short bottomscale;
};
```

output_format задаёт цвет;Auto выбирает output_ycbcr_high_subsampling:YCbCr444>YCbCr422>YCbCr420>RGB;low — обратный порядок. output_depth задаёт глубину,Auto выбирает Automatic.

```c
enum output_format {
output_rgb=0,
output_ycbcr444=1,
output_ycbcr422=2,
output_ycbcr420=3,
output_ycbcr_high_subsampling=4, // (YCbCr444 > YCbCr422 > YCbCr420 > RGB)
output_ycbcr_low_subsampling=5 , // (RGB > YCbCr420 > YCbCr422 > YCbCr444)
invalid_output=6,
};
```

```c
enum output_depth{
Automatic=0,
depth_24bit=8,
depth_30bit=10,
};
```

feature управляет авторазрешением/цветом,HDCP1.x и whitelist. hwc_inital_info задаёт ширину/высоту framebuffer,fps и подключённые main/aux устройства. device:HDMI-A,TV;fps ограничивает частоту.

```c
#define RESOLUTION_AUTO (1<<0)
#define COLOR_AUTO (1<<1)
#define HDCP1X_EN (1<<2)
#define RESOLUTION_WHITE_EN (1<<3)
```

```c
struct hwc_inital_info{
char device[128];
unsigned int framebuffer_width;
unsigned int framebuffer_height;
float fps;
};
```

bcsh_info:0–100,по умолчанию все50. reserve[128] для будущего. lut_data — таблицы RGB;size число значений в каждой,максимум1024.

```c
struct bcsh_info {
unsigned short brightness;
unsigned short contrast;
unsigned short saturation;
unsigned short hue;
};
```

```c
unsigned int reserve[128];
```

```c
struct lut_data{
uint16_t size;
uint16_t lred[1024];
uint16_t lgreen[1024];
uint16_t lblue[1024];
};
```

#### 2.3.3 Резервная область

Вторая половина с512КБ хранит начальные значения для сброса. main_backup/AUX_backup занимают первые16КБ этой половины с шагом8КБ.

![Резервная структура](/docs/rockchip-android-box-display/images/backup-layout.png)

Резервная структура - Оригинальная иллюстрация;страница PDF 11 (CN).

### 2.4 Отладка

| Свойство только чтение | Значение |
| --- | --- |
| vendor.hwc.device.main | Текущий основной выход |
| vendor.hwc.device.aux | Текущий дополнительный выход |

<code>logcat &#124; grep BP</code> проверяет чтение Baseparameter HWC при загрузке.

```sh
logcat | grep BP
```

### 2.5 FAQ:framebuffer1280×720

Шаги:a)root;b)сброс;c)настройки;d)печать/проверка;e)экспорт/pull. Внимание:-R2 сбрасывает и резерв;сохраните существующие данные заранее. Команды только документированы,не выполнялись.

```sh
su
saveBaseParameter -R 2
saveBaseParameter -d 0 -f 1280x720@60 -D "HDMI-A,TV" -c Auto -u 2 -o "100,100,100,100" -b "50,50,50,50"
saveBaseParameter -p
saveBaseParameter -t /sdcard/baseparameter.img
adb pull /sdcard/baseparameter.img
```

f)Прошейте образ,перезапустите,проверьте HWC через <code>logcat &#124; grep BP</code>. g)Поместите в SDK,например device/rockchip/rk3328/baseparameter.img,измените BoardConfig и пересоберите. Разбитое печатью присваивание объединено в одну строку Make.

```diff
diff --git a/rk3328_box/BoardConfig.mk b/rk3328_box/BoardConfig.mk
index 3831ce8..f151fe7 100755
--- a/rk3328_box/BoardConfig.mk
+++ b/rk3328_box/BoardConfig.mk
@@ -16,6 +16,8 @@
TARGET_BOARD_PLATFORM_PRODUCT := box
+TARGET_BASE_PARAMETER_IMAGE := device/rockchip/rk3328/baseparameter.img
+
# Use the non-open-source parts, if they're present
-include vendor/rockchip/rk3328/BoardConfigVendor.mk
-include device/rockchip/common/BoardConfig.mk
```

{% endraw %}
