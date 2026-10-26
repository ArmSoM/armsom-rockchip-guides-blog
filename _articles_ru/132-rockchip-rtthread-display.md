---
title: "Руководство дисплея Rockchip RT-Thread: VOP, панели, частичное обновление и Color Key"
description: "Руководство дисплея Rockchip RT-Thread: VOP, панели, частичное обновление и Color Key — V1.4.0"
excerpt: "Руководство дисплея Rockchip RT-Thread: VOP, панели, частичное обновление и Color Key"
translation_key: "132-rockchip-rtthread-display"
slug: "132-rockchip-rtthread-display"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, VOP, MIPI, LCD]
---

{% raw %}

# Руководство дисплея Rockchip RT-Thread: VOP, панели, частичное обновление и Color Key

Полный технический текст китайского RK-KF-YF-105 V1.4.0. Версии платформ приведены ниже. Это руководство драйвера RT-Thread, а не настройки Linux DRM. Для ArmSoM проверьте SoC, RT-Thread BSP/HAL, VOP, интерфейс, модель панели, временные параметры и питание. Конкретная комбинация платы не подтверждена: платформенный справочник, не поддержка всех плат. Английского PDF нет; четыре языка используют 16 технических рисунков китайского источника, а таблицы и код со снимков также перенесены в редактируемый текст. Аппаратная проверка примеров не выполнялась.

| SoC | RT-Thread |
| --- | --- |
| RK2108 | lts-v3.1.x |
| RK3308 | lts-v4.1.x |
| RV1109/RV1126 | lts-v3.1.x |
| RV1103/RV1106 | lts-v4.1.x |
| RK2118 | lts-v4.1.x |
| RK3506 | lts-v4.1.x |

> Сохранены проблемы источника: путь VOP указан как `dsp/rockchip-common/...`, остальные — bsp. Порядок умножения на рисунке матрицы и отдельные значения фиксированной точки (0.0691 → 0x05, 0.0880 → 0x08) не соответствуют заявленному умножению на 0x80; значения не изменены. В 6.4 hsync/vsync названы porch, на рисунке pulse; единицы MIPI оставлены Mbps. Таблицы структур раздела 4 не содержат все поля примеров раздела 7. Массивы инициализации на снимках — фрагменты; окончания и команды не выдуманы. Написание YUVY422 сохранено. Перед применением сверяйте HAL, регистры и спецификацию панели.

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

## 1. Обзор

Драйвер дисплея Rockchip RT-Thread регистрирует LCD-драйвер в ОС через модель IO-устройств RT-Thread и поддерживает GUI, например LittlevGL. Для использования возможностей оборудования расширены интерфейсы: многослойная композиция, цветовые эффекты, последующее масштабирование и MIPI switch.

### 1.1 Основные понятия

CRTC: абстракция контроллера дисплея — модуля VOP SoC (в части документов LCDC).

Plane: абстракция слоя win внутри VOP/LCDC.

Encoder/Connector: программная абстракция выходов RGB, LVDS, DSI, eDP, HDMI и других.

Panel: абстракция устройств отображения LCD, HDMI и прочих.

### 1.2 Тракт отображения

RK2108

![Тракт дисплея RK2108](/docs/rockchip-rtthread-display/assets/cn-p004-figure-01.png)

*Тракт дисплея RK2108*

Для других платформ см. описание тракта в Rockchip_Developer_Guide_DRM_Display_Driver_CN.

## 2. Программная архитектура

![Программная архитектура дисплея](/docs/rockchip-rtthread-display/assets/cn-p005-figure-01.png)

*Программная архитектура дисплея*

### 2.1 Файлы уровня Driver

| Драйвер | Файл | Описание |
| --- | --- | --- |
| Core | bsp/rockchip-common/drivers/drv_display.c | Фреймворк дисплея RT-Thread: регистрирует драйвер, загружает модули, связывает приложения и драйвер и управляет всеми модулями. |
| VOP | bsp/rockchip-common/drivers/drv_vop.c<br>dsp/rockchip-common/drivers/drv_vop.h | Драйвер дисплейного модуля VOP |
| DSI | bsp/rockchip-common/drivers/drv_dsi.c<br>bsp/rockchip-common/drivers/drv_dsi.h | Драйвер дисплейного модуля DSI/DPHY |
| PANEL | bsp/rockchip-common/drivers/drv_panel.c<br>bsp/rockchip-common/drivers/drv_panel_cfg.h | Драйвер панели: абстракция команд инициализации, временных параметров, питания и других операций. |

### 2.2 Файлы уровня HAL

| Драйвер | Файл | Описание |
| --- | --- | --- |
| Core | bsp/rockchip-common/hal/lib/hal/inc/hal_display.h | Определения основных структур дисплея |
| VOP | bsp/rockchip-common/hal/lib/hal/src/hal_vop.c<br>bsp/rockchip-common/hal/lib/hal/inc/hal_vop.h | Аппаратные функции VOP |
| DSI | bsp/rockchip-common/hal/lib/hal/src/hal_dsi.c<br>bsp/rockchip-common/hal/lib/hal/inc/hal_dsi.h | Аппаратные функции DSI/DPHY |

## 3. Основные интерфейсы

GUI-приложения RT-Thread взаимодействуют с драйвером через операции control, аналогичные Linux IOCTL. Расширенные операции:

| Параметр | Описание |
| --- | --- |
| RK_DISPLAY_CTRL_ENABLE | Включить дисплей |
| RK_DISPLAY_CTRL_DISABLE | Выключить дисплей |
| RK_DISPLAY_CTRL_SET_PLANE | Настроить указанный слой |
| RK_DISPLAY_CTRL_SET_SCALE | Настроить последующее масштабирование |
| RK_DISPLAY_CTRL_LOAD_LUT | Настроить таблицу bpp |
| RK_DISPLAY_CTRL_SET_COLOR_MATRIX | Задать матрицу цветового преобразования |
| RK_DISPLAY_CTRL_SET_GAMMA_COE | Задать коэффициенты gamma |
| RK_DISPLAY_CTRL_SET_BCSH | Задать BCSH: яркость, контраст, насыщенность, тон |
| RK_DISPLAY_CTRL_SET_POST_CLIP | Задать коэффициент clip |
| RK_DISPLAY_CTRL_MIPI_SWITCH | Переключить тракт MIPI switch |

| Параметр | Описание |
| --- | --- |
| RK_DISPLAY_CTRL_COMMIT | Обновить конфигурацию дисплея |

## 4. Основные структуры данных

### 4.1 struct display_state

Центральная структура драйвера включает структуры device и graphic_info RTT, а также абстракции оборудования Rockchip.

| Параметр | Описание |
| --- | --- |
| struct rt_device_graphic_info graphic_info | Структура информации о дисплее RTT |
| struct rt_device lcd | Структура устройства LCD |
| uint32_t *rtt_framebuffer | Адрес framebuffer RTT |
| struct crtc_state crtc_state | Контроллер дисплея VOP Rockchip |
| struct connector_state conn_state | Преобразователь дисплея MIPI DSI Rockchip |
| struct panel_state panel_state | Команды инициализации панели, питание и связанные сведения |
| struct DISPLAY_MODE_INFO mode | Временные параметры развёртки и сведения о панели |

### 4.2 struct crtc_state

Описывает модуль VOP процессора Rockchip; основные поля:

| Параметр | Описание |
| --- | --- |
| struct VOP_REG *hw_base | Базовый адрес регистров VOP |
| const struct rockchip_crtc_funcs *funcs | Указатели функций основных операций VOP |
| struct CRTC_WIN_STATE win_state | Структура слоя WIN |
| struct VOP_POST_SCALE_INFO post_scale | Информация последующего масштабирования |
| uint8_t irqno | Номер прерывания VOP |
| uint8_t power_state | Состояние питания |

### 4.3 struct CRTC_WIN_STATE

Описывает слой WIN модуля VOP Rockchip:

| Параметр | Описание |
| --- | --- |
| bool winEn | Слой: 0 выключен, 1 включён |
| uint8_t winId | Выбор: 0,1,2 означают win0,win1,win2 |
| uint8_t zpos | Порядок Z: 0,1,2 снизу вверх |
| uint8_t format | Формат; значения в rt-thread/include/rtdef.h |
| uint32_t yrgbAddr | Адрес RGBX или компоненты Y в YUV |
| uint32_t cbcrAddr | Адрес компоненты UV в YUV |
| uint16_t xVir | Виртуальная ширина; выравнивание 4Byte |
| uint16_t srcX | Координата X слоя на панели |
| uint16_t srcY | Координата Y слоя на панели |
| uint16_t srcW | Ширина отображения слоя |
| uint16_t srcH | Высота отображения слоя |
| uint8_t hwFormat | Аппаратная настройка драйвера; приложение не задаёт |
| uint16_t hwCrtcX | Аппаратная настройка драйвера; приложение не задаёт |
| uint16_t hwCrtcY | Аппаратная настройка драйвера; приложение не задаёт |
| uint16_t xLoopOffset | Настройка loop по X |
| uint16_t yLoopOffset | Настройка loop по Y |
| bool alphaEn | Включение alpha |
| uint8_t alphaMode | Общая alpha: VOP_ALPHA_MODE_USER_DEFINED; попиксельная: VOP_ALPHA_MODE_PER_PIXEL |
| uint8_t alphaPreMul | Предумножение alpha: YES VOP_PREMULT_ALPHA; NO VOP_NON_PREMULT_ALPHA |
| uint8_t alphaSatMode | Изменение alpha: 1 — alpha = alpha + alpha[7]; 0 — без изменения. Рекомендуется 0. |
| uint8_t globalAlphaValue | Общая alpha: 0~0xff |
| uint32_t *lut | Таблица bpp: см. display_test.c или задайте свою |

### 4.4 struct VOP_POST_SCALE_INFO

Описывает последующее масштабирование в VOP Rockchip:

| Параметр | Описание |
| --- | --- |
| uint16_t srcW | Разрешение источника X |
| uint16_t srcH | Разрешение источника Y |
| uint16_t dstX | Координата X после масштабирования |
| uint16_t dstY | Координата Y после масштабирования |
| uint16_t dstW | Ширина после масштабирования |
| uint16_t dstH | Высота после масштабирования |
| bool postScaleEn | Включение аппаратного масштаба: определяет драйвер, не приложение |
| eVOP_PostSclMode postSclHmode | Аппаратный масштаб вычисляет драйвер; приложение не задаёт |
| eVOP_PostSclMode postSclVmode | Аппаратный масштаб вычисляет драйвер; приложение не задаёт |

### 4.5 struct VOP_BCSH_INFO

Описывает выходной блок BCSH VOP:

| Параметр | Описание |
| --- | --- |
| uint8_t brightness | Яркость: 0~100, по умолчанию 50 |
| uint8_t contrast | Контраст: 0~100, по умолчанию 50 |
| uint8_t satCon | Насыщенность: 0~100, по умолчанию 50 |
| uint8_t hue | Тон: 0~100, по умолчанию 50 |

### 4.6 struct VOP_COLOR_MATRIX_INFO

Описывает выходную цветовую матрицу VOP:

| Параметр | Описание |
| --- | --- |
| bool colorMatrixEn | Включение |
| uint8_t *colorMatrixCoe | Коэффициенты матрицы |
| uint8_t *colorMatrixOffset | Смещения матрицы |

![Исходная цветовая матрица](/docs/rockchip-rtthread-display/assets/cn-p010-figure-01.png)

*Исходная цветовая матрица*

```text
[csc_out0]   [csc_in0]   [coe00 coe01 coe02]   [offset0]
[csc_out1] = [csc_in1] X [coe10 coe11 coe12] + [offset1]
[csc_out2]   [csc_in2]   [coe20 coe21 coe22]   [offset2]
```

Пример: матрица преобразования bt709tobt2020:

```text
{0.6274, 0.3293, 0.0433},
{0.0691, 0.9195, 0.0114},
{0.0164, 0.0880, 0.8956}
```

После перевода в фиксированную точку с 0x80 (bit7 — знак):

```text
coe00 = 0.6274 * 0x80  = 0x50
coe01 = 0.3293 * 0x80  = 0x2a
coe02 = 0.0433 * 0x80  = 0x05
```

Аналогично источник приводит:

```text
colorMatrixCoe[3][3] = {
    {0x50, 0x2a, 0x05},
    {0x05, 0x75, 0x02},
    {0x02, 0x08, 0x72}
};
```

### 4.7 struct VOP_POST_CLIP_INFO

Описывает выходной блок clip VOP:

| Параметр | Описание |
| --- | --- |
| bool postClipEn | Включение |
| uint8_t postYThres | Значение clip |

## 5. Требования к выравниванию

### 5.1 Выравнивание данных

RK2108

![Выравнивание данных RK2108](/docs/rockchip-rtthread-display/assets/cn-p011-figure-01.png)

*Выравнивание данных RK2108*

| Формат | crtc W (пиксели) | crtc H (строки) | xLoopOffset (пиксели) | yLoopOffset (строки) | xVir (байты) | act_xoff (пиксели) | act_yoff (строки) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RGB ARGB8888 | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| RGB RGB888 | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| RGB RGB565 | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| RGB RGB444 | 1 | 1 | 2 | 1 | 4 | 2 | 1 |
| YUV YUV420 4bit | 4 | 2 | 4 | 2 | 4 | 4 | 2 |
| YUV YUV420 8bit | 2 | 2 | 2 | 2 | 4 | 2 | 2 |
| YUV YUV422 4bit | 4 | 1 | 4 | 1 | 4 | 4 | 1 |
| YUV YUV422 8bit | 2 | 1 | 2 | 1 | 4 | 2 | 1 |
| YUV YUV444 4bit | 4 | 1 | 4 | 1 | 4 | 4 | 1 |
| YUV YUV444 8bit | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| YUV YUVY422 4bit | 2 | 1 | 2 | 1 | 4 | 2 | 1 |
| YUV YUVY422 8bit | 2 | 1 | 2 | 1 | 4 | 2 | 1 |
| 8BPP | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| 4BPP | 1 | 1 | 2 | 1 | 4 | 2 | 1 |
| 2BPP | 1 | 1 | 4 | 1 | 4 | 4 | 1 |
| 1BPP | 1 | 1 | 8 | 1 | 4 | 8 | 1 |

### 5.2 Выравнивание панели

Некоторые панели требуют выравнивания. У S6E3HC2 при 1440x3120 размер среза DSC — 720x65: положение частичного обновления выравнивается по 720x65, размер области — по 720x195. При 720x1560 срез равен 360x52: положение выравнивается по 360x52, размер — по 360x390.

## 6. Настройка панели

### 6.1 Выбор поддерживаемой панели

Выберите конфигурацию панели через меню:

```text
cd bsp/rockchip-pisces
    scons --menuconfig
        RT-Thread rockchip common drivers  --->
            Panel Type (R17 SS mipi panel, resolution is 1080x2340)  --->
```

### 6.2 Добавление новой панели

1. Перейдите в каталог: `cd bsp/rockchip-common/drivers/panel_cfg`.

2. Скопируйте имеющийся .h в new_panel.h и измените параметры по разделу 6.4 и спецификации панели.

3. Вернитесь командой `cd ../` в bsp/rockchip-common/drivers/.

4. Откройте Kconfig, найдите “Panel Type” и определите RT_USING_PANEL_NEW_PANEL по примеру config RT_USING_PANEL.

![Новая панель в Kconfig](/docs/rockchip-rtthread-display/assets/cn-p012-figure-01.png)

*Новая панель в Kconfig*

```text
--- a/bsp/rockchip-common/drivers/Kconfig
+++ b/bsp/rockchip-common/drivers/Kconfig
@@ -58,6 +58,9 @@ choice

     config RT_USING_PANEL_S6E3HC2_X4
        bool "S6E3HC2_X4 mipi panel, resolution is 720x1560"
+
+    config RT_USING_PANEL_NEW_PANEL
+       bool "It's a new panel demo, resolution is wxh"
 endchoice
```

### 6.3 Типовая временная диаграмма развёртки

![Временная диаграмма развёртки](/docs/rockchip-rtthread-display/assets/cn-p012-figure-02.png)

*Временная диаграмма развёртки*

### 6.4 Параметры панели

| Параметр | Описание |
| --- | --- |
| RT_HW_LCD_XRES | Горизонтальное разрешение; hactive в 6.3 |
| RT_HW_LCD_YRES | Вертикальное разрешение; vactive в 6.3 |
| RT_HW_LCD_PIXEL_CLOCK | Пиксельная частота, khz |
| RT_HW_LCD_LANE_MBPS | Частота MIPI DPHY CLK Lane, Mbps |
| RT_HW_LCD_LEFT_MARGIN | Левое гашение; hback-porch в 6.3 |
| RT_HW_LCD_RIGHT_MARGIN | Правое гашение; hfront-porch в 6.3 |
| RT_HW_LCD_UPPER_MARGIN | Верхнее гашение; vback-porch в 6.3 |
| RT_HW_LCD_LOWER_MARGIN | Нижнее гашение; vfront-porch в 6.3 |
| RT_HW_LCD_HSYNC_LEN | Горизонтальная синхронизация; источник называет hsync-porch в 6.3 |
| RT_HW_LCD_VSYNC_LEN | Вертикальная синхронизация; источник называет vsync-porch в 6.3 |
| RT_HW_LCD_CONN_TYPE | Тип панели, например RK_DISPLAY_CONNECTOR_DSI |
| RT_HW_LCD_BUS_FORMAT | Формат шины, например MEDIA_BUS_FMT_RGB888_1X24 |
| RT_HW_LCD_VMODE_FLAG | Полярность, поддержка DSC и другие флаги |
| RT_HW_LCD_INIT_CMD_TYPE | Тип команд; CMD_TYPE_DEFAULT — MIPI CMD |
| RT_HW_LCD_DISPLAY_MODE | Выбор CMD или video |
| RT_HW_LCD_AREA_DISPLAY | Поддержка частичного обновления |
| RT_HW_LCD_XACT_ALIGN | Выравнивание ширины области, пиксели |
| RT_HW_LCD_YACT_ALIGN | Выравнивание высоты области, пиксели |

| Параметр | Описание |
| --- | --- |
| RT_HW_LCD_XPOS_ALIGN | Выравнивание позиции X, пиксели |
| RT_HW_LCD_YPOS_ALIGN | Выравнивание позиции Y, пиксели |
| RT_HW_LCD_PREPARE_DELAY_MS | Время готовности к приёму изображения, ms |
| RT_HW_LCD_UNPREPARE_DELAY_MS | Время полного отключения питания, ms |
| RT_HW_LCD_ENABLE_DELAY_MS | Время от готовности до нормального изображения, ms |
| RT_HW_LCD_DISABLE_DELAY_MS | Время выхода из нормального отображения, ms |
| RT_HW_LCD_INIT_DELAY_MS | Время от сброса до отправки команд инициализации, ms |
| RT_HW_LCD_RESET_DELAY_MS | Время полного сброса панели, ms |
| struct rockchip_cmd cmd_on[] | Команды инициализации панели |
| struct rockchip_cmd cmd_off[] | Команды деинициализации панели |
| struct rockchip_cmd cmd_aod_on[] | Команды входа в AOD |
| struct rockchip_cmd cmd_aod_off[] | Команды выхода из AOD |

### 6.5 Команды инициализации панели

1. Пример MIPI DSI CMD:

![Фрагмент команд инициализации](/docs/rockchip-rtthread-display/assets/cn-p014-figure-01.png)

*Фрагмент команд инициализации*

```text
struct rockchip_cmd cmd_on[] =
{
    /* sleep out */
    {0x05, 0x05, 0x01, {0x11}},
    /* FD Setting */
    {0x29, 0x00, 0x03, {0xf0, 0x5a, 0x5a}},
    {0x23, 0x00, 0x02, {0xb0, 0x01}},
    {0x23, 0x00, 0x02, {0xcd, 0x01}},
    {0x29, 0x14, 0x03, {0xf0, 0xa5, 0xa5}},
    /* 4. Common Setting */
    /* 4.1 TE(Vync) ON/OFF */
    {0x29, 0x00, 0x03, {0x9f, 0xa5, 0xa5}},
    {0x15, 0x00, 0x02, {0x35, 0x00}},
    {0x29, 0x00, 0x03, {0x9f, 0x5a, 0x5a}},
```

Первые три шестнадцатеричных байта — Data Type, Delay и Payload Length. Начиная с четвёртого байта идёт полезная нагрузка длиной Payload Length.

2. Разбор первой команды:

![Первая команда инициализации](/docs/rockchip-rtthread-display/assets/cn-p014-figure-02.png)

*Первая команда инициализации*

```text
/* sleep out */
{0x05, 0x05, 0x01, {0x11}},
```

Data Type: 0x05 (DCS Short Write)

Delay: 0x05 (5 ms)

Payload Length: 0x01 (1 байт)

Payload: 0x11

3. Разбор второй команды:

![Вторая команда инициализации](/docs/rockchip-rtthread-display/assets/cn-p015-figure-01.png)

*Вторая команда инициализации*

```text
/* FD Setting */
{0x29, 0x00, 0x03, {0xf0, 0x5a, 0x5a}},
```

Data Type: 0x29 (Generic Long Write)

Delay: 0x00 (0 ms)

Payload Length: 0x03 (3 байта)

Payload: 0xf0 0x5a 0x5a

4. Определения Data Type

![Типы пакетов от процессора](/docs/rockchip-rtthread-display/assets/cn-p015-figure-02.png)

*Типы пакетов от процессора*

| Data Type (hex) | Data Type (binary) | Описание | Тип пакета |
| --- | --- | --- | --- |
| 0x01 | 00 0001 | Начало V Sync | Короткий |
| 0x11 | 01 0001 | Конец V Sync | Короткий |
| 0x21 | 10 0001 | Начало H Sync | Короткий |
| 0x31 | 11 0001 | Конец H Sync | Короткий |
| 0x08 | 00 1000 | Пакет конца передачи (EoTp) | Короткий |
| 0x02 | 00 0010 | Выключить Color Mode (CM) | Короткий |
| 0x12 | 01 0010 | Включить Color Mode (CM) | Короткий |
| 0x22 | 10 0010 | Выключить периферию | Короткий |
| 0x32 | 11 0010 | Включить периферию | Короткий |
| 0x03 | 00 0011 | Generic Short WRITE, без параметров | Короткий |
| 0x13 | 01 0011 | Generic Short WRITE, 1 параметр | Короткий |
| 0x23 | 10 0011 | Generic Short WRITE, 2 параметра | Короткий |
| 0x04 | 00 0100 | Generic READ, без параметров | Короткий |
| 0x14 | 01 0100 | Generic READ, 1 параметр | Короткий |
| 0x24 | 10 0100 | Generic READ, 2 параметра | Короткий |
| 0x05 | 00 0101 | DCS Short WRITE, без параметров | Короткий |
| 0x15 | 01 0101 | DCS Short WRITE, 1 параметр | Короткий |
| 0x06 | 00 0110 | DCS READ, без параметров | Короткий |
| 0x37 | 11 0111 | Задать максимальный размер ответного пакета | Короткий |
| 0x09 | 00 1001 | Пустой пакет без данных | Длинный |
| 0x19 | 01 1001 | Пакет гашения без данных | Длинный |
| 0x29 | 10 1001 | Generic Long Write | Длинный |
| 0x39 | 11 1001 | Пакет DCS Long Write/write_LUT | Длинный |
| 0x0C | 00 1100 | Неплотно упакованный поток, 20-bit YCbCr, 4:2:2 | Длинный |
| 0x1C | 01 1100 | Упакованный поток, 24-bit YCbCr, 4:2:2 | Длинный |
| 0x2C | 10 1100 | Упакованный поток, 16-bit YCbCr, 4:2:2 | Длинный |
| 0x0D | 00 1101 | Упакованный поток, 30-bit RGB, 10-10-10 | Длинный |
| 0x1D | 01 1101 | Упакованный поток, 36-bit RGB, 12-12-12 | Длинный |

![Продолжение типов пакетов](/docs/rockchip-rtthread-display/assets/cn-p016-figure-01.png)

*Продолжение типов пакетов*

| Data Type (hex) | Data Type (binary) | Описание | Тип пакета |
| --- | --- | --- | --- |
| 0x3D | 11 1101 | Упакованный поток, 12-bit YCbCr, 4:2:0 | Длинный |
| 0x0E | 00 1110 | Упакованный поток, 16-bit RGB, 5-6-5 | Длинный |
| 0x1E | 01 1110 | Упакованный поток, 18-bit RGB, 6-6-6 | Длинный |
| 0x2E | 10 1110 | Неплотно упакованный поток, 18-bit RGB, 6-6-6 | Длинный |
| 0x3E | 11 1110 | Упакованный поток, 24-bit RGB, 8-8-8 | Длинный |
| 0xX0 / 0xXF / unspecified | XX 0000 / XX 1111 | НЕ ИСПОЛЬЗОВАТЬ. Неуказанные коды зарезервированы. |  |

5. DCS Write

![Типы DCS Write](/docs/rockchip-rtthread-display/assets/cn-p016-figure-02.png)

*Типы DCS Write*

| Data Type (hex) | Data Type (binary) | Описание | Тип пакета |
| --- | --- | --- | --- |
| 0x05 | 00 0101 | DCS Short WRITE, без параметров | Короткий |
| 0x15 | 01 0101 | DCS Short WRITE, 1 параметр | Короткий |
| 0x39 | 11 1001 | Пакет DCS Long Write/write_LUT | Длинный |

Пакет DCS содержит байт команды и n байтов параметров. При n < 2 используется Short Packet: n=0 — только команда, Data Type 0x05; n=1 — один параметр, Data Type 0x15. При n >= 2 используется Long Packet с командой и n параметрами, Data Type 0x39.

6. Generic Write

![Типы Generic Write](/docs/rockchip-rtthread-display/assets/cn-p016-figure-03.png)

*Типы Generic Write*

| Data Type (hex) | Data Type (binary) | Описание | Тип пакета |
| --- | --- | --- | --- |
| 0x03 | 00 0011 | Generic Short WRITE, без параметров | Короткий |
| 0x13 | 01 0011 | Generic Short WRITE, 1 параметр | Короткий |
| 0x23 | 10 0011 | Generic Short WRITE, 2 параметра | Короткий |
| 0x29 | 10 1001 | Generic Long Write | Длинный |

Generic Packet содержит n байтов параметров. При n < 3 используется Short Packet: n=0 — без параметров, Data Type 0x03; n=1 — один параметр, 0x13; n=2 — два параметра, 0x23. При n >= 3 используется Long Packet с n параметрами, Data Type 0x29.

7. Delay — задержка в ms после текущего пакета перед следующей командой.

8. Payload Length — длина полезной нагрузки пакета.

9. Payload — полезные данные длиной Payload Length.

10. Пример

![Регулировка яркости и команды](/docs/rockchip-rtthread-display/assets/cn-p017-figure-01.png)

*Регулировка яркости и команды*

| Command | R/W | Values | Описание |
| --- | --- | --- | --- |
| 0xF0 | W | { 0x5A, 0x5A } | Включить доступ ключа Level2 |
| 0xB0 | W | { 0x07 } |  |
| 0xB7 | W | { 0xXX }; /* 0xFF : 255Frames; ~; 0x01 : 1Frame */ | Скорость регулировки яркости |
| 0xF0 | W | { 0xA5, 0xA5 } | Отключить доступ ключа Level2 |
| 0x53 | W | { 0x28 } | WRCTRLD |
| 0x51 | W | { 0xXX, 0xXX }; /* Brightness can control */ | WRDISBV |

```text
/* 5.1 Dimming Setting */
{0x29, 0x00, 0x03, {0xf0, 0x5a, 0x5a}},
{0x23, 0x00, 0x02, {0xb0, 0x07}},
{0x23, 0x00, 0x02, {0xb7, 0x01}},
{0x29, 0x00, 0x03, {0xf0, 0xa5, 0xa5}},
{0x15, 0x00, 0x02, {0x53, 0x28}},
{0x39, 0x00, 0x03, {0x51, 0x03, 0xff}},
```

## 7. Инструмент display_test

display_test применим только к RK2108. На других платформах для проверки дисплея используется описанный ниже modetest.

### 7.1 Поддерживаемые тесты

Команда:

```text
display_test cmd
dsc; winloop; winmove; winalpha; scale; coe;  bcsh; gamma; clip; mipi_switch;
ebook; color_bar
```

| Параметр | Описание |
| --- | --- |
| winloop | Проверка loop слоя |
| winmove | Проверка перемещения слоя |
| dsc | Частичное обновление с выравниванием DSC панели 2k |
| winalpha | Проверка alpha слоя |
| scale | Проверка последующего масштаба |
| coe | Проверка цветового преобразования; демо 709to2020 |
| bcsh | Проверка яркости, контраста, насыщенности, тона через BCSH |
| gamma | Изменение изображения кривой gamma |
| clip | Проверка clip |
| mipi_switch | Проверка MIPI switch |
| ebook | Демо электронной книги с изображением 1bpp |
| color_bar | Демо циклических цветовых полос |

### 7.2 Порядок работы демо

1. Найдите устройство LCD.

```text
g_display_dev = rt_device_find("lcd");
RT_ASSERT(g_display_dev != RT_NULL);
```

2. Откройте LCD.

```text
ret = rt_device_open(g_display_dev, RT_DEVICE_FLAG_RDWR);
RT_ASSERT(ret == RT_EOK);
```

3. Включите LCD.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_ENABLE, NULL);
RT_ASSERT(ret == RT_EOK);
```

4. Получите информацию о панели.

```text
ret = rt_device_control(g_display_dev, RTGRAPHIC_CTRL_GET_INFO, (void *)graphic_info);
RT_ASSERT(ret == RT_EOK);
```

5. Инициализируйте win_config и post_scale. Инициализация win_config:

```text
static void display_win_init(struct CRTC_WIN_STATE *win_config)
{
    win_config->winEn = true;
    win_config->winId = 0;
    win_config->zpos  = 0;
    win_config->format   = SRC_DATA_FMT;
    win_config->yrgbAddr = (uint32_t)rtt_framebuffer_test;
    win_config->cbcrAddr = (uint32_t)rtt_framebuffer_uv;
    win_config->yrgbLength = 0;
    win_config->cbcrLength = 0;
    win_config->xVir = SRC_DATA_W;
    win_config->srcX = 0;
    win_config->srcY = 0;
    win_config->srcW = SRC_DATA_W;
    win_config->srcH = SRC_DATA_H;
    win_config->crtcX = 0;
    win_config->crtcY = 0;
    win_config->crtcW = SRC_DATA_W;
    win_config->crtcH = SRC_DATA_H;
    win_config->xLoopOffset = 0;
    win_config->yLoopOffset = 0;
}
```

Инициализация post_scale для полного экрана без масштабирования:

```text
static void display_post_init(struct CRTC_WIN_STATE *win_config,
                              struct VOP_POST_SCALE_INFO *post_scale,
                              struct rt_device_graphic_info *graphic_info)
{
    post_scale->srcW = graphic_info->width;
    post_scale->srcH = graphic_info->height;
    post_scale->dstX = 0;
    post_scale->dstY = 0;
    post_scale->dstW = graphic_info->width;
    post_scale->dstH = graphic_info->height;
}
```

Инициализация post_scale для частичного обновления с увеличением 2x по горизонтали и вертикали:

```text
static void display_post_init(struct CRTC_WIN_STATE *win_config,
                              struct VOP_POST_SCALE_INFO *post_scale,
                              struct rt_device_graphic_info *graphic_info)
{
    post_scale->srcW = graphic_info->width / 2;
    post_scale->srcH = win_config->srcH;
    post_scale->dstX = 0;
    post_scale->dstY = 0;
    post_scale->dstW = graphic_info->width;
    post_scale->dstH = win_config->srcH * 2;
}
```

6. Загрузите палитру LUT для bpp; для других форматов пропустите.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_LOAD_LUT, &lut_state);
RT_ASSERT(ret == RT_EOK);
```

7. Настройте post_scale: размер данных до масштабирования и отображения после него.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_SCALE, post_scale);
RT_ASSERT(ret == RT_EOK);
```

8. Настройте сведения о слое win_config.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_PLANE, win_config);
RT_ASSERT(ret == RT_EOK);
```

9. Примените отображение.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_COMMIT, NULL);
RT_ASSERT(ret == RT_EOK);
```

Для одного кадра выполните шаги 1–9. Для нескольких меняйте win_config и post_scale и повторяйте 7, 8, 9.

### 7.3 Координаты частичного обновления

1. Пример для панелей с частичным обновлением по X и Y.

![Координаты обновления XY](/docs/rockchip-rtthread-display/assets/cn-p021-figure-01.png)

*Координаты обновления XY*

Красная область — win0 в (X0,Y0), размер (W0,H0). Настройка:

```text
win_config->winId = 0;
win_config->winEn = 1;
……
win_config->srcX = X0;
win_config->srcY = Y0;
win_config->srcW = W0;
win_config->srcH = H0;
```

Зелёная область — win1 в (X1,Y1), размер (W1,H1). Настройка:

```text
win_config->winId = 1;
win_config->winEn = 1;
……
win_config->srcX = X1;
win_config->srcY = Y1;
win_config->srcW = W1;
win_config->srcH = H1;
```

Настройка последующего масштабирования:

```text
post_scale->srcW = W1;
post_scale->srcH = H2;
post_scale->dstX = X1;
post_scale->dstY = Y0;
post_scale->dstW = W1;
post_scale->dstH = H2;
```

В коде сначала настройте последующее масштабирование:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_SCALE, post_scale);
RT_ASSERT(ret == RT_EOK);
```

Затем настройте WIN0 и WIN1:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_PLANE, win_config);
RT_ASSERT(ret == RT_EOK);
```

Наконец примените отображение:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_COMMIT, NULL);
RT_ASSERT(ret == RT_EOK);
```

2. Пример обновления только по Y, без поддержки X.

![Координаты обновления только Y](/docs/rockchip-rtthread-display/assets/cn-p023-figure-01.png)

*Координаты обновления только Y*

Красная область — win0 в (X0,Y0), размер (W0,H0). Настройка:

```text
win_config->winId = 0;
win_config->winEn = 1;
……
win_config->srcX = X0;
win_config->srcY = Y0;
win_config->srcW = W0;
win_config->srcH = H0;
```

Зелёная область — win1 в (X1,Y1), размер (W1,H1). Настройка:

```text
win_config->winId = 1;
win_config->winEn = 1;
……
win_config->srcX = X1;
win_config->srcY = Y1;
win_config->srcW = W1;
win_config->srcH = H1;
```

Настройка последующего масштабирования:

```text
post_scale->srcW = Xres;
post_scale->srcH = H2;
post_scale->dstX = 0;
post_scale->dstY = Y0;
post_scale->dstW = Xres;
post_scale->dstH = H2;
```

Без частичного обновления по X, в отличие от случая 1, ширина источника post scale и dstW равны ширине панели Xres, dstX=0. Остальные шаги те же. Сначала настройте масштабирование:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_SCALE, post_scale);
RT_ASSERT(ret == RT_EOK);
```

Затем настройте WIN0 и WIN1:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_PLANE, win_config);
RT_ASSERT(ret == RT_EOK);
```

Наконец примените отображение:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_COMMIT, NULL);
RT_ASSERT(ret == RT_EOK);
```

## 8. Инструмент modetest

### 8.1 Поддерживаемые тесты

```text
modetest [-afgp]

        -p <plane_id>:<w>x<h>:<crtc_w>x<crtc_h>[+<x>+<y>][#<zpos>][@<format>]  set plane
        -f <pattern>    specify fill pattern
        -a      test alpha
        -g      test gamma
```

Пример команды:

```text
modetest -p 0:720x1280:720x1280@AR24 -a -g
```

## 9. Color Key

VOP может сделать выбранный цвет слоя полностью прозрачным, открывая следующий слой или фон. Драйвер использует win_config.colorKey: биты [23,0] содержат компоненты RGB, bit24 включает/выключает функцию. В примерах RGB888 и RGB565 R_VAL, G_VAL, B_VAL — компоненты прозрачного цвета.

```text
#define COLOR_KEY_EN    BIT(24)
```

### 9.1 Color Key для RGB888

1. Полная прозрачность красного:

```text
win_config->colorKey = 0xFF0000 | COLOR_KEY_EN;
```

2. Полная прозрачность зелёного:

```text
win_config->colorKey = 0x00FF00 | COLOR_KEY_EN;
```

3. Полная прозрачность синего:

```text
win_config->colorKey = 0x0000FF | COLOR_KEY_EN;
```

То есть:

```text
win_config->colorKey = (R_VAL << 16) | (G_VAL << 8) | (B_VAL) | COLOR_KEY_EN;
```

### 9.2 Color Key для RGB565

1. Полная прозрачность красного:

```text
win_config->colorKey = 0xF80000 | COLOR_KEY_EN;
```

2. Полная прозрачность зелёного:

```text
win_config->colorKey = 0x00FC00 | COLOR_KEY_EN;
```

3. Полная прозрачность синего:

```text
win_config->colorKey = 0x0000F8 | COLOR_KEY_EN;
```

То есть:

```text
R_VAL_CONFIG = R_VAL << 3;  //R[4,0] -> R[7,0]

G_VAL_CONFIG = G_VAL << 2;  //G[5,0] -> G[7,0]

B_VAL_CONFIG = B_VAL << 3;  //B[4,0] -> B[7,0]

win_config->colorKey = (R_VAL_CONFIG  << 16) | (G_VAL_CONFIG << 8) | B_VAL_CONFIG | COLOR_KEY_EN;
```

### 9.3 Отключение Color Key

```text
win_config->colorKey = 0;
```

## 10. Обновление LUT

Для LUT слоя нужен lut_en. После включения LUT защищена и её регистры недоступны для чтения/записи. Изменение lut_en вступает в силу по кадру. При смене сценария обновляйте LUT так:

1. Отключите LUT. (1) Установите формат не bpp, исключая:

```text
RTGRAPHIC_PIXEL_FORMAT_GRAY1
RTGRAPHIC_PIXEL_FORMAT_GRAY4,
RTGRAPHIC_PIXEL_FORMAT_GRAY16,
RTGRAPHIC_PIXEL_FORMAT_GRAY256,
RTGRAPHIC_PIXEL_FORMAT_RGB332,
```

(2) Отключите все слои и обновите изображение 32x32 в месте без отображаемого содержимого. Размер не фиксирован: нужен невидимый кадр, применяющий отключение lut_en без изменения текущего изображения.

2. Обновите массив LUT и вызовите RK_DISPLAY_CTRL_LOAD_LUT.

3. Настройте новый кадр: задайте win соответствующий формат bpp и обновите кадр. Новая LUT вступит в силу.

## 11. Справочные документы

1. Rockchip DRM Display Driver Development Guide

2. Rockchip_DRM_Panel_Porting_Guide.pdf

{% endraw %}
