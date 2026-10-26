---
title: "Драйверы Camera Sensor Rockchip: V4L2, быстрый старт MCU, AOV и синхронизация"
description: "Драйверы Camera Sensor Rockchip: V4L2, быстрый старт MCU, AOV и синхронизация — V1.1.0"
excerpt: "Драйверы Camera Sensor Rockchip: V4L2, быстрый старт MCU, AOV и синхронизация"
translation_key: "182-rockchip-camera-driver"
slug: "182-rockchip-camera-driver"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: [ArmSoM, Rockchip, Camera, V4L2, MCU, AOV]
---

{% raw %}

Полный технический текст китайского V1.1.0. Английского PDF нет; EN/RU/DE полностью переведены. Все пять рисунков из китайского оригинала, подписи внутри сохранены. Область источника: RV1109/RV1126 и RK356X Linux4.19; RK3588, RK3576, RV1106/RV1103, RV1106B/RV1103B Linux5.10; RV1126B Linux6.1. Только платформенная справка ArmSoM: адаптировать плату, модуль камеры, SDK/BSP, питание/IOMUX и API ядра. Нет обещания поддержки всех плат. Время запуска и доли неисправностей — заявления источника, не измерения ArmSoM. Команды не выполнялись.

> Сомнения источника: сигнатуры probe/remove/ioctl различаются в определениях и таблицах, сохранены обе. Повтор SC200AI_LGAIN, denominato/Ctrol/intput и неверные ссылки не исправлены догадкой. Вертикальное Flip не равно повороту180°. Проценты90%/9%/1%, пределы MIPI, глаз/фронты/терминаторы раздела6.5 не проверены как универсальные нормы. Не применяйте автоматически «50Ω на землю»: инженер должен сверить PHY, эталонную схему и спецификацию во избежание повреждения. Соблюдайте номиналы, переподключайте без питания, отмените временное изменение power_off. Внутренний тестовый шаблон сам по себе не проверяет оптические дефектные пиксели.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 2. Подготовка к отладке

Перед отладкой драйвера Camera подготовьте следующие материалы:

### 2.1 Проверка характеристик хоста

Проверьте максимальное разрешение платформы, верхнюю границу входной частоты, максимальную скорость на линию, число поддерживаемых линий и тип входного интерфейса данного сенсора.

### 2.2 Sensor DataSheet

Запросите datasheet изготовителя: напряжения питания и последовательности включения/выключения; Chip ID для проверки в probe; настройка экспозиции, усиления и частоты кадров; поддержка Slave, соединение нескольких камер и настройка регистров; тестовый режим и HDR; настройка Mirror/Flip.

### 2.3 Sensor Initialize Settings

Получите список регистров, обычно от производителя. Укажите разрешение, частоту кадров, число линий, скорость на линию, VTS, HTS, разрядность и главный такт. Нужны как минимум стандартные разрешения; binning/crop — по проекту. Пример SmartSens: cleaned_0x2b_SC530AI_27Minput_1080Mbps_2lane_10bit_1920x1080_60fps.ini. Имя означает SC530AI, MCLK от хоста 27Mhz, MIPI от сенсора к хосту 1080Mbps на линию, 2 линии, 10bit, 1920x1080 (1080p), частота 60pfs (написание источника).

Ниже шаблон запроса конфигурации у производителя; выбирайте пункты по требованиям проекта.

```text
sensor: XXXX
mclk: 24MHz/27Mhz/37.5Mhz
mode: raw8/raw10/raw12/raw16
output: 720p/1080p/1440p/... (разрешение)
интерфейс: mipi 1/2/4 Lane
частота кадров: 30/60/120 fps
платформа: RK3588/RV1106/RV1103B/RV1126B/...
изделие: дверной звонок/дверной звонок/IPC/... (необязательно; повтор источника)
```

## 3. Разработка драйвера

### 3.1 Написание драйвера

Новый драйвер можно создать на основе близкого по характеристикам сенсора в kernel/drivers/media/i2c/ или близкой модели того же производителя. Далее процесс для RK показан на SmartSens SC200AI.

#### 3.1.1 Важные параметры сенсора

Структура mode определяет важные параметры сенсора; заполните их точно для каждого разрешения.

```text
struct XXXX_mode {
    u32 bus_fmt;    //输出像素格式
    u32 width;      //输出宽度
    u32 height;     //输出⾼度
    struct v4l2_fract max_fps; //最⼤输出帧率
    u32 hts_def;    //默认⾏总周期
    u32 vts_def;    //默认帧总周期
    u32 exp_def;    //默认曝光值
    u32 mipi_freq_idx;//链接频率索引值
    u32 bpp;        //每像素所⽤bit数
    const struct regval *reg_list; //寄存器列表
    u32 hdr_mode;   //宽动态模式
    u32 vc[PAD_MAX];//虚拟通道数组
};
```

Массив supported_modes хранит структуры mode поддерживаемых разрешений для перебора и сопоставления при probe или смене разрешения. Пример SC200AI:

```text
static const struct sc200ai_mode supported_modes[] = {
    { // 1080p 30fps 线性配置参数
    .width = 1920,
    .height = 1080,
    .max_fps = {
        .numerator = 10000,
        .denominator = 300000,
    },
    .exp_def = 0x0080,
    .hts_def = 0x44C * 2,
    .vts_def = 0x0465,
    .bus_fmt = MEDIA_BUS_FMT_SBGGR10_1X10,
    .reg_list = sc200ai_linear_10_1920x1080_30fps_regs,
    .hdr_mode = NO_HDR,
    .bpp = 10,
    .mipi_freq_idx = 1,
    .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0,
},
{ // 540p 120fps 线性配置参数
    .width = 960,
    .height = 540,
    .max_fps = {
        .numerator = 10000,
        .denominator = 1200000,
    },
    .exp_def = 0x0080,
    .hts_def = 0x420,
    .vts_def = 0x249,
    .bus_fmt = MEDIA_BUS_FMT_SBGGR10_1X10,
    .reg_list = sc200ai_linear_10_960x540_120fps_regs,
    .hdr_mode = NO_HDR,
    .bpp = 10,
    .mipi_freq_idx = 0,
    .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0,
},
{ // 1080p 30fps 宽动态配置参数
    .width = 1920,
    .height = 1080,
    .max_fps = {
        .numerator = 10000,
        .denominator = 300000,
    },
    .exp_def = 0x0080,
    .hts_def = 0x44C * 2,
    .vts_def = 0x08CC,
    .bus_fmt = MEDIA_BUS_FMT_SBGGR10_1X10,
    .reg_list = sc200ai_hdr_10_1920x1080_regs,
    .hdr_mode = HDR_X2,
    .bpp = 10,
    .mipi_freq_idx = 1,
    .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_1,
    .vc[PAD1] = V4L2_MBUS_CSI2_CHANNEL_0,//L->csi wr0
    .vc[PAD2] = V4L2_MBUS_CSI2_CHANNEL_1,
    .vc[PAD3] = V4L2_MBUS_CSI2_CHANNEL_1,//M->csi wr2
},
}
```

Параметры:

bus_fmt — порядок пикселей выхода. Последовательность производителя обычно задаёт разрядность (например 10bit); BGGR — порядок Bayer. Ошибочный Bayer не мешает получить изображение, но искажает цвет.

width и height — активные размеры выхода, важнейшие параметры, обычно меньше hts и vts.

max_fps — максимальная частота режима: denominato / numerator (написание источника). numerator обычно не меняют; для ровно 30 кадров/с denominator равен 300000.

exp_def — экспозиция по умолчанию, hts_def — полное число точек строки, vts_def — полное число строк кадра. Все берутся из регистров инициализации. Ошибка vts_def влияет на частоту.

global_reg_list — общие регистры инициализации, может быть пустым; reg_list — последовательность производителя. hdr_mode: NO_HDR для линейного режима, HDR_X2/HDR_X3 для объединения двух/трёх кадров HDR.

link_freq_idx — индекс link_freq_menu_items. Производитель обычно даёт Mbps на линию; MIPI считывает по обоим фронтам, поэтому частота вдвое меньше скорости. Первая линейная последовательность: 720Mbps, частота MIPI/link_freq 360M. Ошибка часто срывает захват: перепроверьте. bpp — бит на пиксель.

Линейный режим и HDR различаются hdr_mode и массивом виртуальных каналов vc. Линейный: hdr_mode = NO_HDR, vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0. HDR: hdr_mode = HDR_X2/HDR_X3; vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0; vc[PAD1] = V4L2_MBUS_CSI2_CHANNEL_0; vc[PAD2] = V4L2_MBUS_CSI2_CHANNEL_1; vc[PAD3] = V4L2_MBUS_CSI2_CHANNEL_1.

#### 3.1.2 Важные регистры сенсора

Ниже важные регистры, применяемые при разработке; детали зависят от изготовителя и модели.

##### 3.1.2.1 Chip id

Chip ID идентифицирует сенсор при загрузке драйвера. probe проверяет ID; источник считает верный ID признаком нормального распознавания, обмена I2C и напряжений питания.

```text
#define CHIP_ID                 0xcb1c
#define SC200AI_REG_CHIP_ID     0x3107
```

У некоторых сенсоров нет Chip ID. Для проверки распознавания и подключения прочитайте один или несколько регистров только для чтения и сравните со значениями по умолчанию.

##### 3.1.2.2 Ctrol mode

Регистр запуска/остановки потока обычно записывают после успешной записи всех остальных регистров сенсора.

```text
#define SC200AI_REG_CTRL_MODE       0x0100
#define SC200AI_MODE_SW_STANDBY     0x0
#define SC200AI_MODE_STREAMING      BIT(0)
```

Не задавайте этот регистр в последовательности инициализации: интерфейсы запуска/остановки управляют им отдельно.

##### 3.1.2.3 Exposure reg

Регистры экспозиции могут различаться в линейном режиме и HDR; смотрите руководство сенсора.

```text
#define SC200AI_REG_EXPOSURE_H      0x3e00  //⻓曝光最⾼位
#define SC200AI_REG_EXPOSURE_M      0x3e01  //⻓曝光中间位
#define SC200AI_REG_EXPOSURE_L      0x3e02  //⻓曝光最低位
#define SC200AI_REG_SEXPOSURE_H     0x3e22  //短曝光最⾼位
#define SC200AI_REG_SEXPOSURE_M     0x3e04  //短曝光中间位
#define SC200AI_REG_SEXPOSURE_L     0x3e05  //短曝光最低位
#define SC200AI_EXPOSURE_MIN        1       //最新曝光⾏，⼀般不改，除⾮sensor有最⼩曝光限制
#define SC200AI_EXPOSURE_STEP       1       //曝光步进，⼀般不⽤修改
```

Регистры экспозиции могут превышать 16bit: например 24bit содержат старший, средний и младший байты и требуют нескольких записей. Для длинного/короткого кадра возможны отдельные записи. Усиление может вычисляться по формуле: аналоговое бывает линейным или табличным; цифровой дробный множитель записывается как фиксированная точка, например Q8.8.

##### 3.1.2.4 Gain reg

Регистры управляют аналоговым и цифровым усилением. Каждое может иметь грубую часть (обычно целую) и точную (обычно дробную).

Аналоговое усиление увеличивает напряжение сенсора до ADC. Влияние на шум меньше, чем у цифрового, но диапазон ограничен: слишком большое усиливает шум и нелинейные искажения. Регистры: ANA_GAIN (грубо), ANA_FINE_GAIN (точно).

Цифровое усиление после ADC умножает исходные цифровые значения, например 10bit/12bit. Оно простое и гибкое, но увеличивает шум и ошибку квантования, особенно цветной шум при слабом свете. Регистры: DIG_GAIN (грубо), DIG_FINE_GAIN (точно).

Цели: повысить яркость при слабом свете; в AE динамически менять усиление и экспозицию (shutter/line count) до целевой яркости; контролировать SNR и динамический диапазон.

```text
#define SC200AI_REG_DIG_GAIN        0x3e06  //数字主增益
#define SC200AI_REG_DIG_FINE_GAIN   0x3e07  //数组精增益
#define SC200AI_REG_ANA_GAIN        0x3e08  //模拟主增益
#define SC200AI_REG_ANA_FINE_GAIN   0x3e09  //模拟精增益
#define SC200AI_REG_SDIG_GAIN       0x3e10  //短帧的数字主增益
#define SC200AI_REG_SDIG_FINE_GAIN  0x3e11  //短帧的数组精增益
#define SC200AI_REG_SANA_GAIN       0x3e12  //短帧的模拟主增益
#define SC200AI_REG_SANA_FINE_GAIN  0x3e13  //短帧的模拟精增益
#define SC200AI_GAIN_MIN            0x0040  //增益最⼩值
#define SC200AI_GAIN_MAX            (54 * 32 * 64)       //53.975*31.75*64 增益最⼤值
#define SC200AI_GAIN_STEP           1   //增益步进
#define SC200AI_GAIN_DEFAULT        0x0800  //默认增益值
#define SC200AI_LGAIN               0   //⻓帧增益
#define SC200AI_SGAIN               1   //短帧增益
```

В HDR могут требоваться разные усиления длинного и короткого кадров. Источник называет оба SC200AI_LGAIN и SC200AI_LGAIN; повтор сохранён до проверки.

##### 3.1.2.5 Group hold

Group Hold синхронизирует обновления экспозиции (shutter), усиления и других параметров CMOS. Во время одного кадра аналоговое/цифровое усиление и построчная экспозиция должны оставаться согласованными, иначе возможны полосы, неравномерная яркость, частичная пере-/недоэкспозиция. Регистры обычно вступают в силу на границе следующего кадра/строки, не сразу. Изменение во время захвата может разделить кадр на области со старыми и новыми значениями. Group Hold замораживает обновления и применяет их одновременно в заданный момент.

```text
#define SC200AI_REG_GROUP_HOLD      0x3812 //group hold 控制寄存器
#define SC200AI_GROUP_HOLD_START    0x00  //开启Group Hold（冻结参数更新）即：Group Hold Start
#define SC200AI_GROUP_HOLD_END      0x30  //关闭Group Hold（释放参数更新)即：Group Hold End
```

##### 3.1.2.6 Test pattern

Регистр тестового шаблона выбирает режим CMOS/CCD, выводящий внутреннее изображение вместо оптического. Оно служит тестированию, отладке и проверке. Типы: цветные полосы, градиент, шахматная доска, сплошной красный/зелёный/синий/чёрный/белый, сетка, Fixed Pattern Noise (FPN).

###### 3.1.2.6.1 Применение тестовых шаблонов

1. Проверка/отладка сенсора. Шаблон позволяет быстро проверить вывод данных, MIPI CSI-2 и тракт, разрешение и RAW/RGB/YUV, приём/обработку ISP и последующими модулями. Например, после первого включения можно проверить сенсор без объектива и источника света.

Если после включения шаблона на экране/в отладчике видны полосы или градиент, сенсор и тракт в основном работают.

2. Отладка ISP и алгоритмов. Проверяются Demosaic, 3A, Gamma, CSC, Sharpening и другие блоки, обработка разных входов, цвет, яркость, контраст и шумоподавление. Известный управляемый вход подходит для количественного анализа и настройки. Красное поле должно оставаться красным — это выявляет проблемы баланса белого/цветокоррекции; градиент проверяет Gamma, динамический диапазон и tone mapping.

3. Отладка/калибровка модуля камеры. При производстве проверяют тракт модуль объектива + сенсор + ISP, имитируют тесты AF/AE/AWB и проверяют базовые функции без реального освещения.

4. Поиск неисправностей. При искажении цветов, повреждённом изображении, полосах или полностью чёрном/белом кадре включите шаблон. Нормальный шаблон указывает на оптику (грязный объектив/нет света) или реальный вход; ненормальный — на сенсор, MIPI, ISP или питание. Так разделяют оптические и электрические/цифровые причины.

5. Заводское тестирование. Источник перечисляет автоматическую проверку выхода сенсора, мёртвых/горячих пикселей и постоянного шума, целостности данных, точности цвета и динамического диапазона.

###### 3.1.2.6.2 Основные типы шаблонов

| Шаблон | Описание | Применение |
| --- | --- | --- |
| Solid Color | Всё изображение красное/зелёное/синее/чёрное/белое | Цветовые каналы, дефектные пиксели |
| Color Bars | Телевизионные полосы: красный/зелёный/синий/чёрный/белый | Выход цвета, ISP |
| Gradient | Плавный переход чёрный–белый или RGB | Динамический диапазон, Gamma, tone mapping |
| Checkerboard | Чёрно-белые клетки | Резкость, края, сжатие |
| Moving Pattern | Меняющиеся шаблоны у некоторых сенсоров | Тайминг, буферы, задержка |
| Random / Noise Pattern | Имитация шума | Шумоподавление |
| Cross Hatch / Grid | Пересекающиеся линии | Геометрические искажения, выравнивание |

```text
#define SC200AI_REG_TEST_PATTERN        0x4501 //测试图案控制寄存器
#define SC200AI_TEST_PATTERN_BIT_MASK   BIT(3) //测试图案开启掩码
```

##### 3.1.2.7 VTS

HTS и VTS — ключевые параметры тайминга CMOS/CIS и модулей камеры. VTS означает Vertical Total Time или Vertical Total Lines: полное число строк/время кадра, включая активные строки и гашение. Обычно задаётся в строках, может переводиться во время (например ms) по частоте кадров и VTS. Состав:

1. Active Lines: строки реального изображения, например 1080 для 1920x1080.

2. VSYNC (вертикальная синхронизация)

3. Вертикальное гашение/передний и задний интервалы для смены кадра и внутренней обработки. VTS = активные строки + строки вертикального гашения. Связь HTS/VTS с разрешением и частотой:

1. Расчёт частоты кадров (FPS). Основная формула:

`FPS = PCLK / (HTS × VTS)`

PCLK — Pixel Clock, обычно в MHz или Hz, число передаваемых пиксельных тактов в секунду.

HTS — полные такты строки (её длительность), VTS — полные строки кадра. Вместе задают частоту кадров. Для повышения FPS уменьшите VTS/гашение или увеличьте PCLK. Для снижения FPS, например длинной экспозиции при слабом свете, увеличьте VTS или уменьшите PCLK. Основные различия:

| Пункт | HTS (Horizontal Total) | VTS (Vertical Total) |
| --- | --- | --- |
| Направление | Горизонтальное, внутри строки | Вертикальное, внутри кадра |
| Смысл | Такты строки: пиксели + гашение | Строки кадра: активные + гашение |
| Состав | Активные пиксели + HSYNC + гашение | Активные строки + VSYNC + гашение |
| Влияние | Частота строк, тайминг передачи | Частота и длительность кадров |
| Частота кадров | FPS = PCLK / (HTS × VTS) | Рост VTS снижает FPS, уменьшение повышает |
| Единицы | Такты/пиксельные такты | Строки |
| Настройка | Регистры строкового тайминга | Регистры кадрового тайминга |

```text
#define SC200AI_REG_VTS_H       0x320e
#define SC200AI_REG_VTS_L       0x320f
```

##### 3.1.2.8 Mirror / Flip

Регистры Mirror/Flip управляют ориентацией выхода сенсора: геометрическими отражениями влево/вправо и вверх/вниз.

1. Mirror меняет местами левое и правое по X, как зеркало. Бит Mirror/Horizontal Flip нужен при обратной горизонтальной установке сенсора или ориентации объектива.

2. Flip меняет местами верх и низ по Y. Источник сравнивает это с поворотом фото на 180° или взглядом с потолка; сравнение сохранено, но одно вертикальное отражение не равно повороту на 180°. Функция сенсора:

Бит Flip/Vertical Flip задаёт вертикальное отражение, обычно при перевёрнутой установке или для согласования с дисплеем. Сочетания Mirror/Flip:

| Настройка | Эффект | Вид |
| --- | --- | --- |
| Без Mirror / Flip | Нормальный | Без отражения, обычное направление (по умолчанию) |
| Mirror | Лево/право | Как зеркало |
| Flip | Верх/низ | Перевёрнутая фотография |
| Mirror + Flip | Оба отражения = поворот 180° | Все направления обращены; поворот 180° |

Большинство CMOS, включая Sony, OmniVision, SmartSens, GalaxyCore и Onsemi, настраивают Mirror/Flip регистрами.

```text
#define SC200AI_FLIP_MIRROR_REG     0x3221 // 镜像翻转控制寄存器

#define SC200AI_FETCH_MIRROR(VAL, ENABLE)   (ENABLE ? VAL | 0x06 : VAL & 0xf9)//设置镜像
#define SC200AI_FETCH_FLIP(VAL, ENABLE)     (ENABLE ? VAL | 0x60 : VAL & 0x9f)//设置翻转
```

3. Настройка отражений через v4l2-ctl

```text
// /dev/v4l-subdev2节点对应 Sensor ⼦设备节点。参考5.4 章节
v4l2-ctl --set-ctrl=horizontal_flip=1 -d /dev/v4l-subdev2  # 启⽤⽔平镜像
v4l2-ctl --set-ctrl=horizontal_flip=0 -d /dev/v4l-subdev2  # 禁⽤⽔平镜像

v4l2-ctl --set-ctrl=vertical_flip=1 -d /dev/v4l-subdev2    # 启⽤垂直翻转
v4l2-ctl --set-ctrl=vertical_flip=0  -d /dev/v4l-subdev2   # 禁⽤垂直翻转

v4l2-ctl --set-ctrl=horizontal_flip=1 --set-ctrl=vertical_flip=1 -d /dev/v4l-subdev2
 # 同时启⽤镜像和翻转
v4l2-ctl --set-ctrl=horizontal_flip=0 --set-ctrl=vertical_flip=0  -d /dev/v4l-subdev2#
同时禁⽤镜像和翻转
```

### 3.2 Структура драйвера

Сенсор общается с хостом по I2C. Его драйвер реализован как драйвер устройства I2C и использует V4L2 subdev для взаимодействия с драйвером хоста.

#### 3.2.1 Типы данных

##### 3.2.1.1 struct i2c_driver

Описание: информация драйвера I2C. Определение:

```text
struct i2c_driver {
    ...

    /* Standard driver model interfaces */
    int (*probe)(struct i2c_client *client, const struct i2c_device_id *id);
    int (*remove)(struct i2c_client *client);
    ...
    struct device_driver driver;
    const struct i2c_device_id *id_table;
    ...
};
```

Основные члены:

| Член | Тип | Назначение |
| --- | --- | --- |
| probe | int (*)(struct i2c_client *) | Обнаружение устройства; вызывается при совпадении драйвера с устройством |
| remove | void (*)(struct i2c_client *) | Очистка при удалении устройства |
| driver | struct device_driver | Основная структура драйвера; .probe вызывается при совпадении compatible из of_match_table с compatible файла DTS |
| id_table | const struct i2c_device_id * | Таблица сопоставления устройств; если ядро не использует of_match_table и устройства, зарегистрированные DTS, оно использует эту таблицу |

Пример:

```text
#if IS_ENABLED(CONFIG_OF)
static const struct of_device_id sc200ai_of_match[] = {
    { .compatible = "smartsens,sc200ai" },
    {},
};
MODULE_DEVICE_TABLE(of, sc200ai_of_match);
#endif

static const struct i2c_device_id sc200ai_match_id[] = {
    { "smartsens,sc200ai", 0 },
    { },
};

static struct i2c_driver sc200ai_i2c_driver = {
    .driver = {
        .name = SC200AI_NAME,
        .pm = &sc200ai_pm_ops,
        .of_match_table = of_match_ptr(sc200ai_of_match),
    },
    .probe      = &sc200ai_probe,
    .remove     = &sc200ai_remove,
    .id_table   = sc200ai_match_id,
};

static int __init sensor_mod_init(void)
{
    return i2c_add_driver(&sc200ai_i2c_driver);
}

static void __exit sensor_mod_exit(void)
{
    i2c_del_driver(&sc200ai_i2c_driver);
}
```

##### 3.2.1.2 struct v4l2_subdev_ops

Описание: struct v4l2_subdev_ops — основная структура операций подустройства V4L2, задающая интерфейсы сенсоров, ISP, декодеров. Определение:

```text
struct v4l2_subdev_ops {
    const struct v4l2_subdev_core_ops   *core;
    const struct v4l2_subdev_video_ops  *video;
    const struct v4l2_subdev_pad_ops    *pad;
    ...
};
```

Основные члены:

| Тип члена | Структура | Назначение | Оборудование |
| --- | --- | --- | --- |
| Основные операции | const struct v4l2_subdev_core_ops *core | Базовое управление: питание, прерывания, журналы и т. п. | Все подустройства |
| Управление видеопотоком | const struct v4l2_subdev_video_ops *video | Параметры потока: частота кадров, формат, HDR и т. п. | Сенсор/ISP/кодер |
| Управление pad | const struct v4l2_subdev_pad_ops *pad | Формат пикселей, разрешение, кадрирование (ключевые настройки) | Сенсор/ISP/приёмник MIPI-CSI |

Пример:

```text
static const struct v4l2_subdev_ops sc200ai_subdev_ops = {
    .core   = &sc200ai_core_ops,
    .video  = &sc200ai_video_ops,
    .pad    = &sc200ai_pad_ops,
};
```

##### 3.2.1.3 struct v4l2_subdev_core_ops

Описание: операции основных функций управления драйвера подустройства V4L2. Определение:

```text
struct v4l2_subdev_core_ops {
    ...
    long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
#ifdef CONFIG_COMPAT
    long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
                   unsigned long arg);
#endif
    int (*s_power)(struct v4l2_subdev *sd, int on);
    ...
};
```

Основные члены:

| Функция-член | Прототип | Назначение | Типичная реализация RK Sensor |
| --- | --- | --- | --- |
| s_power | int (*)(struct v4l2_subdev *sd, int on) | Состояние питания: включить/выключить питание устройства | Последовательности уровней PWDN/RESET и питание PMIC: on=1 включение, on=0 выключение |
| compat_ioctl32 | long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd, unsigned long arg) |  | Частные функции для 32-битного приложения с 64-битным ядром: обработка передачи данных из/в пользовательское пространство |
| ioctl | int (*)(struct v4l2_subdev *sd, unsigned int cmd, void *arg) | Частные пользовательские команды, не являющиеся стандартными командами V4L2 | Специфические функции и обработка системных вызовов ioctl |

Пример:

```text
static const struct v4l2_subdev_core_ops sc200ai_core_ops = {
    .s_power = sc200ai_s_power,
    .ioctl = sc200ai_ioctl,
#ifdef CONFIG_COMPAT
    .compat_ioctl32 = sc200ai_compat_ioctl32,
#endif
};c
```

Следующие частные ioctl запрашивают сведения модуля и запрашивают/настраивают OTP.

| Частный ioctl | Описание |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Получить сведения модуля |
| PREISP_CMD_SET_HDRAE_EXP | Задать экспозицию HDR |
| RKMODULE_SET_HDR_CFG | Задать HDR; переключать normal/линейный и HDR. Драйвер поддерживает оба набора |
| RKMODULE_GET_HDR_CFG | Получить текущий HDR |
| RKMODULE_SET_CONVERSION_GAIN | Conversion gain линейного режима, например imx347/os04a10; не требуется без поддержки сенсором |

##### 3.2.1.4 struct v4l2_subdev_video_ops

Описание: интерфейс управления видеоустройством. Определение:

```text
struct v4l2_subdev_video_ops {
    ...
    int (*s_stream)(struct v4l2_subdev *sd, int enable);
    int (*g_frame_interval)(struct v4l2_subdev *sd,
                struct v4l2_subdev_frame_interval *interval);
    int (*s_frame_interval)(struct v4l2_subdev *sd,
                struct v4l2_subdev_frame_interval *interval);
    ...

};
```

Основные члены:

| Член | Описание |
| --- | --- |
| .g_frame_interval | Callback VIDIOC_SUBDEV_G_FRAME_INTERVAL ioctl |
| .s_stream | Основной интерфейс запуска/остановки видео |
| .s_frame_interval | Динамическая смена частоты/интервала; основной callback настройки |

Пример:

```text
static const struct v4l2_subdev_video_ops sc200ai_video_ops = {
    .s_stream = sc200ai_s_stream,
    .g_frame_interval = sc200ai_g_frame_interval,
    .s_frame_interval = sc200ai_s_frame_interval,
};
```

##### 3.2.1.5 struct v4l2_subdev_pad_ops

Описание: обратные вызовы согласования формата пикселей, кадрирования, масштабирования и расположения кадра. В драйверах RK ключевой интерфейс конвейера сенсор → ISP → память. Определение:

```text
struct v4l2_subdev_pad_ops {
    ...
    int (*enum_mbus_code)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_mbus_code_enum *code);
    int (*enum_frame_size)(struct v4l2_subdev *sd,
                   struct v4l2_subdev_pad_config *cfg,
                   struct v4l2_subdev_frame_size_enum *fse);
    int (*enum_frame_interval)(struct v4l2_subdev *sd,
                   struct v4l2_subdev_pad_config *cfg,
                   struct v4l2_subdev_frame_interval_enum *fie);
    int (*get_fmt)(struct v4l2_subdev *sd,
               struct v4l2_subdev_pad_config *cfg,
               struct v4l2_subdev_format *format);
    int (*set_fmt)(struct v4l2_subdev *sd,
               struct v4l2_subdev_pad_config *cfg,
               struct v4l2_subdev_format *format);
    int (*get_selection)(struct v4l2_subdev *sd,
                 struct v4l2_subdev_pad_config *cfg,
                 struct v4l2_subdev_selection *sel);
    int (*set_selection)(struct v4l2_subdev *sd,
                 struct v4l2_subdev_pad_config *cfg,
                 struct v4l2_subdev_selection *sel);
    int (*get_edid)(struct v4l2_subdev *sd, struct v4l2_edid *edid);
    int (*set_edid)(struct v4l2_subdev *sd, struct v4l2_edid *edid);
    int (*dv_timings_cap)(struct v4l2_subdev *sd,
                  struct v4l2_dv_timings_cap *cap);
    int (*enum_dv_timings)(struct v4l2_subdev *sd,
                   struct v4l2_enum_dv_timings *timings);
    ...

    int (*get_mbus_config)(struct v4l2_subdev *sd, unsigned int pad,
                   struct v4l2_mbus_config *config);
    int (*set_mbus_config)(struct v4l2_subdev *sd, unsigned int pad,
                   struct v4l2_mbus_config *config);
};
```

Основные члены:

| Член | Описание |
| --- | --- |
| enum_mbus_code | Перечислить форматы шины; RAW/YUV сенсора, например MEDIA_BUS_FMT_SRGGB10_1X10. |
| get_fmt | Текущее разрешение/формат, например 1920x1080@SRGGB10. |
| set_fmt | Задать разрешение/формат, важнейшая функция. Например 1920x1080 и NV12, влияет на MIPI. |
| enum_frame_size | Разрешения формата, например 640x480/1280x720 для UYVY. |
| enum_frame_interval | Частоты для формата/разрешения; сведения текущего режима. |
| get_selection | Области кадрирования/масштаба (чтение/запись, выходной размер); цифровой зум или малая область энергосбережения. |
| set_selection | Задать область кадрирования/масштаба;1080p для просмотра. |
| get_edid/set_edid | EDID; HDMI-приёмники, обычно не используется сенсором. |
| dv_timings_cap | Поддерживаемые цифровые видеотайминги; только HDMITX/RX. |
| enum_dv_timings | Перечислить цифровые тайминги; только HDMITX/RX. |
| get_mbus_config | Конфигурация шины, например MIPI D-PHY; число линий V4L2_MBUS_CSI2_4LANE и такт V4L2_MBUS_CSI2_CONTINUOUS_CLOCK. |
| set_mbus_config | Настроить шину; динамически менять MIPI, например2-lane/4-lane. |

Пример:

```text
static const struct v4l2_subdev_pad_ops sc200ai_pad_ops = {
    .enum_mbus_code = sc200ai_enum_mbus_code,
    .enum_frame_size = sc200ai_enum_frame_sizes,
    .enum_frame_interval = sc200ai_enum_frame_interval,
    .get_fmt = sc200ai_get_fmt,
    .set_fmt = sc200ai_set_fmt,
    .get_mbus_config = sc200ai_g_mbus_config,
};
```

##### 3.2.1.6 struct v4l2_ctrl_ops

Описание: struct v4l2_ctrl_ops — основные операции управления V4L2 для динамической экспозиции, усиления, баланса белого и других параметров. На Rockchip это стандартный интерфейс запросов приложений, связывающий пользовательское управление с регистрами оборудования. Определение:

```text
struct v4l2_ctrl_ops {
    ...
    int (*s_ctrl)(struct v4l2_ctrl *ctrl);
};
```

Основные члены:

| Член | Функция | Реализация Rockchip |
| --- | --- | --- |
| s_ctrl | Задать управление (важнейший) | Записать значения пользователя в регистры, например экспозицию/усиление |

Пример:

```text
static int sc200ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    struct sc200ai *sc200ai = container_of(ctrl->handler,
                           struct sc200ai, ctrl_handler);
    struct i2c_client *client = sc200ai->client;

    ...

    if (!pm_runtime_get_if_in_use(&client->dev))
        return 0;

    switch (ctrl->id) {
    case V4L2_CID_EXPOSURE:
        dev_dbg(&client->dev, "set exposure value 0x%x\n", ctrl->val);
        ...
        break;
    case V4L2_CID_ANALOGUE_GAIN:
        dev_dbg(&client->dev, "set gain value 0x%x\n", ctrl->val);
        ...
        break;
    case V4L2_CID_VBLANK:
        dev_dbg(&client->dev, "set blank value 0x%x\n", ctrl->val);
        ...
        break;
    case V4L2_CID_TEST_PATTERN:
        ...
        break;
    case V4L2_CID_HFLIP:
        ...
        break;
    case V4L2_CID_VFLIP:
        ...
        break;
    default:
        dev_warn(&client->dev, "%s Unhandled id:0x%x, val:0x%x\n",
             __func__, ctrl->id, ctrl->val);
        break;
    }

    pm_runtime_put(&client->dev);

    return ret;
}

static const struct v4l2_ctrl_ops sc200ai_ctrl_ops = {
    .s_ctrl = sc200ai_set_ctrl,
};
```

#### 3.2.2 API

##### 3.2.2.1 xxxx_set_fmt

Описание: задать выходной формат сенсора. Драйвер может поддерживать несколько разрешений; set_fmt передаёт требуемое, драйвер ищет ближайшее. Линейный/HDR переключаются не здесь, а частной командой ioctl. Для переключения разрешения линейного режима и HDR должны совпадать. Синтаксис:

```text
static int xxxx_set_fmt(struct v4l2_subdev *sd,
                        struct v4l2_subdev_pad_config *cfg,
                        struct v4l2_subdev_format *fmt)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Указатель на структуру v4l2 subdev | Вход |
| *cfg | Указатель на subdev pad information | Вход |
| *fmt | Указатель на Pad-level media bus format | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

Примечание: в kernel 6.1 struct v4l2_subdev_pad_config *cfg заменён на struct v4l2_subdev_state *sd_state.

##### 3.2.2.2 xxxx_get_fmt

Описание: получить текущий выходной формат. struct xxx_mode может содержать несколько разрешений; одно выбирается при инициализации или через set_fmt. get_fmt подтверждает текущую конфигурацию. До RK3588 fmt-&gt;reserved[0] также передаёт виртуальный канал устройства, позволяя задать его вместо стандартного. RK3588 и новее получают канал через ioctl RKMODULE_GET_CHANNEL_INFO. Синтаксис:

```text
static int xxxx_get_fmt(struct v4l2_subdev *sd,
                        struct v4l2_subdev_pad_config *cfg,
                        struct v4l2_subdev_format *fmt)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Указатель на структуру v4l2 subdev | Вход |
| *cfg | Указатель на subdev pad information | Вход |
| *fmt | Указатель на Pad-level media bus format | Выход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

Примечание: в kernel 6.1 struct v4l2_subdev_pad_config *cfg заменён на struct v4l2_subdev_state *sd_state.

##### 3.2.2.3 xxxx_enum_mbus_code

Описание: перечислить выходные bus format. Статическая переменная struct xxx_mode содержит поддерживаемые разрешения; функция возвращает перечисляемый bus format из её записей. Синтаксис:

```text
static int xxxx_enum_m bus_code(struct v4l2_subdev *sd,
                                struct v4l2_subdev_pad_config *cfg,
                                struct v4l2_subdev_mbus_code_enum *code)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Указатель на структуру v4l2 subdev | Вход |
| *cfg | Указатель на subdev pad information | Вход |
| *code | Указатель на media bus format enumeration | Выход c (источник) |

Возвращаемые значения:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Указатель на структуру v4l2 subdev | Вход |
| *cfg | Указатель на subdev pad information | Вход |
| *code | Указатель на media bus format enumeration | Выход |

Примечание: в kernel 6.1 struct v4l2_subdev_pad_config *cfg заменён на struct v4l2_subdev_state *sd_state.

##### 3.2.2.4 xxxx_enum_frame_sizes

Описание: перечислить размеры выхода сенсора. Статическая struct xxx_mode содержит поддерживаемые разрешения; функция возвращает соответствующие значения. Синтаксис:

```text
static int xxxx_enum_frame_sizes(struct v4l2_subdev *sd,
                                struct v4l2_subdev_pad_config *cfg,
                                struct v4l2_subdev_frame_size_enum *fse)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Указатель на структуру v4l2 subdev | Вход |
| *cfg | Указатель на subdev pad information | Вход |
| *fse | Указатель на media bus frame size | Выход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

Примечание: в kernel 6.1 struct v4l2_subdev_pad_config *cfg заменён на struct v4l2_subdev_state *sd_state.

##### 3.2.2.5 xxxx_g_frame_interval

Описание: получить интервал кадров сенсора. Статическая struct xxx_mode задаёт максимальную частоту. Драйвер снижает её увеличением vblank. Для фактической частоты пересчитайте стандартный и текущий vblank и передайте приложению актуальный интервал. Синтаксис:

```text
static int xxxx_g_frame_interval(struct v4l2_subdev *sd,
                                struct v4l2_subdev_frame_interval *fi)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Указатель на структуру v4l2 subdev | Вход |
| *fi | Указатель на pad-level frame rate | Выход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 3.2.2.6 xxxx_s_stream

Описание: настроить поток ввода/вывода. Аргумент on выбирает start_stream или stop_stream. start_stream записывает массив инициализации, задаёт экспозицию и включает поток; stop_stream записывает регистры остановки. Синтаксис:

```text
static int xxxx_s_stream(struct v4l2_subdev *sd, int on)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Указатель на структуру v4l2 subdev | Вход |
| on | 1: запуск потока; 0: остановка | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 3.2.2.7 xxxx_runtime_resume

Описание: обратный вызов включения сенсора. Размещение включения здесь позволяет другим частям драйвера и верхним драйверам включать сенсор через pm_runtime_get_sync. Синтаксис:

```text
static int xxxx_runtime_resume(struct device *dev)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Указатель на device | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 3.2.2.8 xxxx_runtime_suspend

Описание: обратный вызов выключения сенсора. Другие части драйвера и верхние драйверы выключают через pm_runtime_put. Синтаксис:

```text
static int xxxx_runtime_suspend(struct device *dev)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Указатель на device | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 3.2.2.9 xxxx_set_ctrl

Описание: задать значения V4L2 control. Зарегистрируйте callback для команд управления; изменения параметров приложением настраивают сенсор через него. Реализуйте команды по разделу 3.2.1.6, struct v4l2_ctrl_ops. Синтаксис:

```text
static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *ctrl | Указатель на v4l2_ctrl | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 3.2.2.10 xxx_enum_frame_interval

Описание: перечислить интервалы поддерживаемых разрешений из статической struct xxx_mode. Обычно применяется редко; фактическая настройка частоты остаётся через vblank. Синтаксис:

```text
static int xxxx_enum_frame_interval(struct v4l2_subdev *sd,
                                    struct v4l2_subdev_pad_config *cfg,
                                    struct v4l2_subdev_frame_interval_enum *fie)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Экземпляр подустройства | Вход |
| *cfg | Конфигурация pad | Вход |
| *fie | Параметры интервала кадров | Выход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

Примечание: в kernel 6.1 struct v4l2_subdev_pad_config *cfg заменён на struct v4l2_subdev_state *sd_state.

##### 3.2.2.11 xxxx_g_mbus_config

Описание: получить конфигурацию шины. Типы: параллельная, MIPI, LVDS; параллельная включает BT601/BT656/BT1120, MIPI — DPHY/CPHY. Контроллер читает текущие параметры для выбора захвата. Если сенсор поддерживает несколько MIPI-режимов, сообщайте параметры активного. Синтаксис:

```text
static int xxxx_g_m bus_config(struct v4l2_subdev *sd,
                                struct v4l2_m bus_config *config)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *config | Конфигурация шины | Выход c (источник) |

Возвращаемые значения:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *config | Конфигурация шины | Выход |

##### 3.2.2.12 xxxx_get_selection

Описание: настроить кадрирование. Ширина входа ISP кратна 16, высота — 8. Для невыровненного или нестандартного выхода сенсора реализуйте кадрирование до входа ISP. Синтаксис:

```text
static int xxxx_get_selection(struct v4l2_subdev *sd,
                             struct v4l2_subdev_pad_config *cfg,
                             struct v4l2_subdev_selection *sel)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Экземпляр подустройства | Вход |
| *cfg | Конфигурация pad | Вход |
| *sel | Параметры кадрирования | Выход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

Примечание: в kernel 6.1 struct v4l2_subdev_pad_config *cfg заменён на struct v4l2_subdev_state *sd_state.

##### 3.2.2.13 xxxx_ioctl

Описание: реализация частных ioctl. Синтаксис:

```text
static long xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *sd | Экземпляр подустройства | Вход |
| cmd | Значение частной команды (источник: именования) | Вход |
| * arg | Передаваемые параметры | Вход/выход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 |  |

### 3.3 Порядок переноса драйвера

#### 3.3.1 Стандартный драйвер подустройства I2C

1. Реализуйте члены struct i2c_driver: struct driver.name, struct driver.pm, struct driver.of_match_table, probe и remove. Учитывайте различие возвращаемого значения kernel 5.10 и 6.1.

2. probe: получить ресурсы CIS, главным образом из DTS. Частные ресурсы RK называются rockchip,camera-module-xxx и передаются пользовательскому camera_engine для подбора IQ-параметров. Эталонные драйверы RK обычно задают следующие ресурсы CIS:

| Член | Описание |
| --- | --- |
| CIS reference clock | Для отдельного кварца ресурс не нужен. Эталонные RK обычно используют выход AP, обычно xvclk, который надо получить. |
| CIS control GPIO | Например Resst (написание источника) и Powerdown. |
| CIS power resources | Получить программные ресурсы питания по аппаратуре, например gpio/regulator. |

После получения ресурсов рекомендуется прочитать ID CIS для проверки оборудования, но это необязательно. Инициализируйте устройство V4L2 и media entity. Для подустройства используйте v4l2_i2c_subdev_init. RK требует собственный узел subdev для управления экспозицией через rk_aiq. Media entity инициализируется media_entity_init.

#### 3.3.2 Драйвер подустройства V4L2

Основные три члена:

```text
struct v4l2_subdev_core_ops
struct v4l2_subdev_video_ops
struct v4l2_subdev_pad_ops
```

1. Реализуйте callback struct v4l2_subdev_core_ops. s_power включает/выключает сенсор. В длинных массивах выделите общие регистры и запишите после включения; s_stream оставьте только специфичные разрешению регистры для ускорения переключения. Также .compat_ioctl32 и .ioctl; ioctl реализует частное управление RK:

| Член | Описание |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Передать сведения DTS, например имя модуля, camera_engine для сопоставления. |
| RKMODULE_AWB_CFG | При OTP camera_engine передаёт типовую AWB-калибровку. CIS сравнивает её с текущим модулем и вычисляет R/B Gain для MWB. |
| RKMODULE_LSC_CFG | При OTP camera_engine включает применение LSC-калибровки. |
| PREISP_CMD_SET_HDRAE_EXP | Экспозиция HDR |
| RKMODULE_SET_HDR_CFG | Переключить HDR/normal; драйвер поддерживает оба набора. |
| RKMODULE_GET_HDR_CFG | Получить текущий HDR |
| RKMODULE_SET_CONVERSION_GAIN | Задать линейный conversion gain, например imx347/os04a10. Высокий conversion gain улучшает SNR при слабом свете. Без поддержки необязательно. |
| RKMODULE_SET_QUICK_STREAM | Регистры stream on/off для аварийного сброса, синхронного запуска камер (см. механизм), быстрого запуска и AOV. |
| RKMODULE_GET_CHANNEL_INFO | Получить каналы. По умолчанию vicap id0–id3 соответствуют vc0–vc3; настройка для SPD/EBD. До RK3588 каналы по-прежнему через get_fmt. |
| RKMODULE_GET_SYNC_MODE, RKMODULE_SET_SYNC_MODE | Получить/задать синхронизацию; см. многокамерный режим. |

2. По struct v4l2_subdev_core_ops (ссылка источника) реализуйте следующие callback:

| Член | Описание |
| --- | --- |
| .s_stream | Запуск/остановка. При continuous MIPI CLK запускать в этом callback; ранний запуск мешает обнаружению MIPI LP. |
| .g_frame_interval | Получить интервал/частоту кадров |
| .g_mbus_config | Конфигурация шины. При нескольких lane/HDR вернуть MIPI текущего режима. |

3. По struct v4l2_subdev_pad_ops реализуйте следующие callback:

| Член | Описание |
| --- | --- |
| .enum_mbus_code | Перечислить форматы; см. xxxx_enum_mbus_code. |
| .enum_frame_size | Перечислить разрешения; см. xxxx_enum_frame_sizes. |
| .get_fmt | Обязательно: RKISP читает формат CIS. Bayer raw, SoC YUV и BW raw — MEDIA_BUS_FMT; field — struct v4l2_mbus_framefmt; реализация xxxx_get_fmt. |
| .set_fmt | Обязательно: формат/разрешение CIS; xxxx_set_fmt. |
| .enum_frame_interval | Интервалы с разрешением; xxx_enum_frame_interval. |
| .get_selection | Кадрирование: ширина ISP кратна16, высота8; xxxx_get_selection. |

4. По struct v4l2_ctrl_ops реализуйте следующие callback:

| Член | Описание |
| --- | --- |
| .s_ctrl | RKISP и camera_engine управляют экспозицией CIS разными командами. |

Следующие ID запрашивают информацию и реализуются как standard integer menu controls:

| Член | Описание |
| --- | --- |
| V4L2_CID_LINK_FREQ | См. стандарт в списке CIS V4L2-controls; RKISP получает частоту MIPI. |
| V4L2_CID_PIXEL_RATE | MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample |
| V4L2_CID_HBLANK | См. стандарт CIS V4L2-controls. |
| V4L2_CID_VBLANK | См. стандарт CIS V4L2-controls. |

RK camera_engine получает через эти команды данные для расчёта экспозиции. Формулы:

line_time = HTS / PIXEL_RATE;

```text
PIXEL_RATE = HTS * VTS * FPS
```

HTS = sensor_width_out + HBLANK;

```text
VTS = sensor_height_out + VBLANK;
```

Следующие ID служат управлению CIS из RK camera_engine:

| Член | Описание |
| --- | --- |
| V4L2_CID_VBLANK | Настроить VBLANK, частоту и максимальную экспозицию. |
| V4L2_CID_EXPOSURE | Экспозиция в строках. |
| V4L2_CID_ANALOGUE_GAIN | Усиление экспозиции; фактически total gain = analog gain*digital gain, в единицах регистра. |
| V4L2_CID_HFLIP | Горизонтальное отражение; у ISP нет, используйте сенсор. |
| V4L2_CID_VFLIP | Вертикальное отражение; у ISP нет, используйте сенсор. |
| V4L2_CID_TEST_PATTERN | Необязательный тестовый шаблон для отладки. |

5. Требования HDR. В линейном режиме экспозиция/усиление задаются стандартными V4L2 controls. В HDR параметры идут через PREISP_CMD_SET_HDRAE_EXP, а V4L2_CID_EXPOSURE и V4L2_CID_ANALOGUE_GAIN не используются. Частная команда должна кешировать параметры. После массива инициализации в start_stream заново запишите начальную экспозицию поверх стандартных значений, чтобы первый кадр ей соответствовал и AE быстрее сходился. Регистры включения потока не включайте в массив, задавайте перед возвратом start_stream для той же согласованности первого кадра. HDR-сенсор обязан реализовать RKMODULE_SET_HDR_CFG/RKMODULE_GET_HDR_CFG для обмена HDR/LINEAR с контроллером и переключения режимов.

### 3.4 Изменения Makefile

Добавьте сборку сенсора в kernel/drivers/media/i2c/Makefile. Пример SC200AI:

```text
......
obj-$(CONFIG_VIDEO_SC200AI) += sc200ai.o
......
```

Группируйте по изготовителю, имена сенсоров — по алфавиту.

### 3.5 Изменения Kconfig

Добавьте конфигурацию и описание сенсора в kernel/drivers/media/i2c/Kconfig. Пример SC200AI:

```text
config VIDEO_SC200AI
    tristate "SmartSens SC200AI sensor support"
    depends on I2C && VIDEO_V4L2
    select MEDIA_CONTROLLER
    select VIDEO_V4L2_SUBDEV_API
    select V4L2_FWNODE
    help
      This is a Video4Linux2 sensor driver for the SmartSens
      SC200AI camera.
```

Группируйте по изготовителю, имена сенсоров — по алфавиту.

## 4. Быстрый запуск

### 4.1 Понятие

Быстрый запуск минимизирует включение, инициализацию и время до действительного изображения для малой задержки и реального времени. Во встраиваемых, потребительских, автомобильных и промышленных системах нужны мгновенный снимок, вывод за &lt;100ms/300ms, быстрое пробуждение из энергосбережения, переключение/синхронный старт нескольких камер, видеосвязь/наблюдение. Обычный старт занимает сотни миллисекунд или более секунды, включая:

1. Включение питания

2. Стабилизация внутренних PLL/тактов

3. Инициализация регистров

4. Стабилизация аналоговых цепей

5. Установление строковых/кадровых таймингов

6. Первый действительный кадр. Быстрый запуск оптимизирует внутреннюю последовательность, пропускает необязательные шаги или заранее задаёт ключевые регистры. Сравнение типичного времени запуска:

| Режим | Типичное время до изображения | Применение |
| --- | --- | --- |
| Normal Boot | 300ms ~ 1000ms | Без строгих требований запуска |
| Fast Boot | 10ms ~ 200ms | Быстрый снимок, просмотр в реальном времени, малая задержка |
| Low-power Wakeup из Standby | 10ms ~ 50ms | Быстрое энергосберегающее пробуждение, лучше с Fast Boot |

RK RV1103, RV1103B/RV1106B, RV1126B и подобные платформы содержат производительное MCU-ядро RISC-V. Часть ISP AE/AWB перенесена туда для помощи ARM при инициализации камеры/ISP и быстрой сходимости. Во время загрузки Linux MCU параллельно выполняет AE и определяет день/ночь. При регистрации ISP-драйвера сенсор использует экспозицию и параметры MCU для первого действительного кадра с уже стабилизированным качеством. Базовый поток:

![Технический рисунок китайского оригинала](/docs/rockchip-camera-driver/assets/cn-p039-figure-01.png)

Быстрая сходимость изображения с помощью MCU:

![Технический рисунок китайского оригинала](/docs/rockchip-camera-driver/assets/cn-p039-figure-02.png)

Поток вывода на этапе ARM:

![Технический рисунок китайского оригинала](/docs/rockchip-camera-driver/assets/cn-p039-figure-03.png)

### 4.2 Изменения драйвера

#### 4.2.1 Драйвер ядра

1. Включите два заголовка:

```text
#include "../platform/rockchip/isp/rkisp_tb_helper.h"
#include "cam-tb-setup.h"
```

2. Добавьте is_thunderboot в структуру сенсора для обозначения быстрого запуска.

```text
struct sc200ai {
    ......
    bool            is_thunderboot;
    ......
};
```

В probe проверьте CONFIG_VIDEO_ROCKCHIP_THUNDER_BOOT_ISP. Если настройка включена в ядре, is_thunderboot равен true.

```text
sc200ai->is_thunderboot = IS_ENABLED(CONFIG_VIDEO_ROCKCHIP_THUNDER_BOOT_ISP);
```

3. Интерфейсы запуска/остановки потока

```text
static int __sc200ai_start_stream(struct sc200ai *sc200ai)
{
    int ret = 0;
    ......
    if (!sc200ai->is_thunderboot) { //⾮快启，写⼊完整寄存器配置
        ret = sc200ai_write_array(sc200ai->client, sc200ai->cur_mode->reg_list);
        if (ret)
            return ret;
        ......
    }

    if (sc200ai->sync_mode == NO_SYNC_MODE)//否则，配置起流
        ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                     SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
    return ret;
}

static int __sc200ai_stop_stream(struct sc200ai *sc200ai)
{
    int ret = 0;
    sc200ai->has_init_exp = false;

    if (sc200ai->is_thunderboot) {
        sc200ai->is_first_streamoff = true;
        pm_runtime_put(&sc200ai->client->dev);
    }
    ......

    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                 SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);
    return ret;
}
```

#### 4.2.2 Драйвер MCU

См. перенос драйвера камеры.

### 4.3 Настройка быстрого запуска MCU

#### 4.3.1 Структура драйвера

Далее разработка MCU-драйвера сенсора RK показана на SmartSens SC450AI.

##### 4.3.1.1 Типы данных

###### 4.3.1.1.1 struct rk_camera_ops

Описание: struct rk_camera_ops задаёт интерфейсы операций камеры. Определение:

```text
struct rk_camera_ops {
    ret_err_t (*init)(struct rk_camera_device *dev);  // 初始化相机设备
    ret_err_t (*open)(struct rk_camera_device *dev, rt_uint16_t oflag);  // 打开相机设备
    ret_err_t (*close)(struct rk_camera_device *dev);  // 关闭相机设备
    ret_err_t (*control)(struct rk_camera_device *dev, int cmd, void *args);  // 控制相机设备
};
```

Члены:

| Член | Описание |
| --- | --- |
| init | Инициализация устройства |
| open | Открыть устройство |
| close | Закрыть устройство |
| control | Управление устройством |

Пример:

```text
struct rk_camera_ops rk_sc450ai_ops =
{
    rk_sc450ai_init,
    rk_sc450ai_open,
    NULL,
    rk_sc450ai_control
};
```

###### 4.3.1.1.2 struct xxx_mode

Описание: сведения о поддерживаемых режимах; при необходимости добавьте члены. Определение:

```text
struct xxxx_mode
{
    struct v4l2_fract max_fps;
    uint16_t bus_fmt;
    uint16_t width;
    uint16_t height;
    uint16_t hts_def;
    uint16_t vts_def;
    uint16_t exp_def;
    uint32_t xvclk;
    uint32_t link_freq;
#ifndef REG_LIST_CONVERSION_DEBUG
    const uint8_t *reg_list;
#else
    const struct sc450ai_sensor_reg *reg_list;
#endif
    const int reg_list_size;
    uint8_t hdr_mode;
} __attribute__((__packed__));
```

Члены:

| Член | Описание |
| --- | --- |
| .max_fps | Частота: denominator/numerator = fps |
| .bus_fmt | Выходной формат |
| .width | Активная ширина, равная текущему выходу сенсора. |
| .height | Активная высота, равная текущему выходу сенсора. |
| .hts_def | HTS по умолчанию = активная ширина + HBLANK |
| .vts_def | VTS по умолчанию = активная высота + VBLANK |
| .exp_def | Экспозиция по умолчанию |
| .xvclk | Внешний такт/MCLK |
| .link_freq | Частота MIPI_DPHY в MHz, половина скорости MIPI |
| *reg_list | Список регистров |
| .reg_list_size | Размер массива регистров |
| .hdr_mode | Линейный, HDR двух или трёх кадров |

Пример:

```text
static const struct sc450ai_mode supported_modes_4lane[] =
{
    {
        .bus_fmt = MEDIA_BUS_FMT_SBGGR10_1X10,
        .width = 1344,
        .height = 760,
        .max_fps = {
            .numerator = 10000,
            .denominator = 1200000,
        },
        .exp_def = 0x80,
        .hts_def = 0x03a8,
        .vts_def = 0x030c,
        .xvclk = 27000000,
        .link_freq = 360000000,
        .reg_list = g_sc450ai_1344x760_4lane_120fps_reg_table,
        .reg_list_size = ARRAY_SIZE(g_sc450ai_1344x760_4lane_120fps_reg_table),
        .hdr_mode = NO_HDR,
    },
    {/* */}，
}
```

###### 4.3.1.1.3 struct xxx_dev

Описание: основная структура камеры с конфигурацией, состоянием и указателями функций. Настраивается в rk_xxx_init. Определение:

```text
struct xxx_dev
{
    struct rk_camera_device parent;
    char name[RK_CAMERA_DEVICE_NAME_SIZE];
    uint8_t time_valid_delay;
    uint8_t gain_valid_delay;
    char i2c_name[RK_CAMERA_I2C_NAME_SIZE];
    struct rt_i2c_bus_device *i2c_bus;
    uint8_t i2c_addr;
    uint8_t flip;
    struct rt_mutex mutex_lock;
    struct rk_camera_exp_val init_exp;
    uint8_t modes_num;
    const struct sc450ai_mode *supported_modes;
    const struct sc450ai_mode *cur_mode;
    const struct sc450ai_mode *pdst_mode;
    struct sc450ai_mode dst_mode;
    bool has_init_exp;
    bool streaming;
};
```

Члены:

| Член | Описание |
| --- | --- |
| parent | Родитель камеры |
| name[RK_CAMERA_DEVICE_NAME_SIZE] | Имя камеры |
| time_valid_delay | Экспозиция действует в кадре N + time_valid_delay |
| gain_valid_delay | Усиление действует в кадре N + gain_valid_delay |
| i2c_name[RK_CAMERA_I2C_NAME_SIZE] | Имя I2C-шины |
| *i2c_bus | Устройство I2C-шины |
| i2c_addr | Адрес I2C |
| flip | Настройка Flip/Mirror |
| mutex_lock | Мьютекс |
| init_exp | Начальная экспозиция |
| modes_num | Число конфигураций инициализации |
| *supported_modes | Список режимов по числу линий //todo (источник) |
| *cur_mode | Текущий режим |
| *dst_mode | Целевой режим |
| has_init_exp | Задана ли начальная экспозиция |
| streaming | Работает ли поток |

##### 4.3.1.2 API

###### 4.3.1.2.1 rk_xxx_control

Описание: общий интерфейс команд управления от приложений/ISP. Синтаксис:

```text
ret_err_t rk_sc450ai_control(struct rk_camera_device *dev,
                             dt_cmd_t cmd,
                             void *args);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |
| cmd | Команда управления камерой | Вход |
| *args | Аргументы команды | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

Пример:

```text
ret_err_t rk_sc450ai_control(struct rk_camera_device *dev,
                             dt_cmd_t cmd,
                             void *args)
{
    ...
    switch (cmd)
    {
    case RK_DEVICE_CTRL_DEVICE_INIT:
    {
        ret = rk_sc450ai_init(dev);
    }
    break;
    ...
    default:
        sc450ai_dbg("exit CMD %d\n", cmd);
        break;
    }

    return ret;
}
```

###### 4.3.1.2.2 rk_xxx_init

Описание: контроллер получает параметры шины камеры для определения режима захвата. Синтаксис:

```text
ret_err_t rk_xxx_init(struct rk_camera_device *dev);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.3 xxx_stream_on

Описание: запись регистров инициализации; RT_USING_CAM_STREAM_ON_LATE определяет раннее включение потока. Синтаксис:

```text
static void xxx_stream_on(struct xxx_dev *dev);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.4 xxx_stream_off

Описание: остановить поток камеры. Синтаксис:

```text
static void xxx_stream_off(struct xxx_dev *dev);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.5 rk_xxx_get_expinf

Описание: получить сведения об экспозиции. Синтаксис:

```text
static ret_err_t rk_xxx_get_expinf(struct xxx_dev *dev, struct rk_camera_exp_info *exp);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |
| *exp | Параметры экспозиции | Выход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.6 rk_xxx_set_expval

Описание: задать время экспозиции и усиление. Синтаксис:

```text
static ret_err_t rk_xxx_set_expval(struct xxx_dev *dev, struct rk_camera_exp_val *exp);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |
| *exp | Параметры экспозиции | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.7 rk_xxx_set_vts

Описание: задать VTS камеры. Синтаксис:

```text
static ret_err_t rk_xxx_set_vts(struct xxx_dev *dev, uint32_t dst_vts);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |
| dst_vts | Целевой VTS | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.8 rk_xxx_get_intput_fmt

Описание: получить текущий выходной формат. struct xxx_mode может содержать несколько разрешений, одно выбирается при инициализации. После переключения set_intput_fmt текущий формат проверяется get_intput_fmt. Синтаксис:

```text
static ret_err_t rk_xxx_get_intput_fmt(struct xxx_dev *dev, struct rk_camera_mbus_framefmt
*mbus_fmt);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |
| *mbus_fmt | Выходной формат камеры | Выход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.9 rk_xxx_set_intput_fmt

Описание: задать выходной формат камеры и параметры захвата контроллера. Синтаксис:

```text
static ret_err_t rk_xxx_set_intput_fmt(struct xxx_dev *dev, struct rk_camera_mbus_framefmt
*mbus_fmt);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |
| *mbus_fmt | Выходной формат камеры | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.10 rk_xxx_match_dst_config

Описание: перебрать supported_modes для целевого разрешения/формата. При снижении частоты кадров скорректировать целевой VTS. Синтаксис:

```text
static ret_err_t rk_xxx_match_dst_config(struct xxx_dev *dev, struct rk_camera_dst_config
*dst_config);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |
| *dst_config | Целевой выходной формат | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.11 rk_xxx_set_flip_mirror

Описание: задать отражения камеры. Синтаксис:

```text
static ret_err_t rk_xxx_set_flip_mirror(struct xxx_dev *dev, uint32_t flip)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |
| flip | 0: ни одного; 1: только Flip; 2: только Mirror; 3: оба | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.12 xxx_stream_on_late

Описание: задать начальную экспозицию, отражения и включить поток камеры. Синтаксис:

```text
static void xxx_stream_on_late(struct xxx_dev *dev);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.13 xxx_quick_stream

Описание: включить/выключить поток камеры. Синтаксис:

```text
static void xxx_quick_stream(struct xxx_dev *dev, int on);
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |
| on | 1: запуск потока; 0: остановка | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

###### 4.3.1.2.14 rk_camera_xxx_init

Описание: зарегистрировать I2C-устройство сенсора с последовательностью включения из datasheet. Синтаксис:

```text
int rk_xxx_check_sensor_id(struct xxx_dev *dev)
```

Параметры:

| Параметр | Описание | Направление |
| --- | --- | --- |
| *dev | Дескриптор камеры | Вход |

Возвращаемые значения:

| Возврат | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### 4.3.2 Перенос драйвера камеры

Возьмите за основу близкий по характеристикам драйвер в rt-thread/bsp/rockchip/camera/ или близкую модель того же производителя.

##### 4.3.2.1 Добавить параметры сборки

Добавьте следующее в rt-thread/bsp/rockchip/common/drivers/Kconfig.

```text
@@ -506,6 +506,8 @@ menu "supported camera"
        bool "Enable GC2053"
    config RT_USING_F37
        bool "Enable F37"
    config RT_USING_SC230AI
        bool "Enable SC230AI"
+   config RT_USING_SC450AI
+       bool "Enable SC450AI"
    config RT_USING_SC850SL
        bool "Enable SC850SL"
```

##### 4.3.2.2 Преобразование последовательности регистров

MCU-драйверы быстрого запуска используют непрерывную запись I2C. Обычно исходная последовательность производителя не непрерывная; скрипт преобразует её в нужный формат.

###### 4.3.2.2.1 Этапы преобразования

1. Оформите последовательность по &lt;sdk&gt;/sysdrv/source/mcu/project/scripts/camera_reg_convert/reg.txt.

2. Замените содержимое &lt;sdk&gt;/sysdrv/source/mcu/project/scripts/camera_reg_convert/reg.txt последовательностью.

3. Преобразуйте командой:

```text
cd <sdk>/sysdrv/source/mcu/project/scripts/camera_reg_convert/
python2 reg_conver.py
```

4. Замените соответствующую последовательность драйвера результатом. Пример:

```text
/*
 * Xclk 27Mhz
 * max_framerate 30fps
 * mipi_datarate per lane 720Mbps, 4lane
 * full resolution
 */
static const uint8_t g_sc450ai_2688x1520_4lane_30fps_reg_table[] =
{
    0x3, 0x01, 0x00, 0x00,
    0x3, 0x36, 0xe9, 0x80,
    0x3, 0x36, 0xf9, 0x80,
    0x3, 0x30, 0x1c, 0x78,
    0x3, 0x30, 0x1f, 0x01,
    0x3, 0x30, 0x2e, 0x00,
    0xa, 0x32, 0x08, 0x0a, 0x80, 0x05, 0xf0, 0x02, 0xee, 0x06, 0x18,
    0x4, 0x32, 0x14, 0x11, 0x11,
    0x8,
};
```

Формат непрерывной записи: столбец 1 — число байтов I2C DATA за запись, 2–3 — адрес, 4–n — последовательные значения регистров. Последняя строка — общее число записей I2C. Не включайте поток в последовательности, включайте отдельно в xxx_stream_on_late.

##### 4.3.2.3 Базовые функции

Реализуйте все функции rk_camera_ops, включая все control в rk_xxx_control, и rk_camera_xxx_init.

#### 4.3.3 Конфигурация платы MCU

##### 4.3.3.1 Регистрация CIS (CMOS image sensor)

###### 4.3.3.1.1 struct gpio_desc

Определение:

```text
struct gpio_desc
{
    uint32_t gpio_pin;
    struct GPIO_REG *gpio_group;
};
```

###### 4.3.3.1.2 camera_board_desc

Описание: конфигурация сенсора, связанная с аппаратурой платы. Определение:

```text
struct camera_board_desc
{
    struct gpio_desc rst_gpio;
    struct gpio_desc pwdn_gpio;
    struct gpio_desc pwren_gpio;
    eCLOCK_Name mclk_id;
    uint32_t mclk_out_gate_id;
    char isp_subdev_name[RK_CAMERA_DEVICE_NAME_SIZE];
    char i2c_bus[RK_CAMERA_I2C_NAME_SIZE];
    uint8_t i2c_addr;
    uint8_t time_valid_delay;
    uint8_t gain_valid_delay;
    uint8_t mode_id;
    uint32_t width;
    uint32_t height;
    uint32_t pixelcode;
    uint32_t maxfps;
    uint32_t lanes;
    uint32_t hdr_mode;
    uint32_t dst_width;
    uint32_t dst_height;
    uint32_t dst_pixelcode;
    uint32_t dst_maxfps;
    uint32_t dst_hdr_mode;
    bool rst_active;
    bool pwdn_active;
    bool pwren_active;
};
```

Члены:

| Член | Описание |
| --- | --- |
| rst_gpio | Аппаратный сброс; по gpio_desc |
| pwdn_gpio | Вывод малопотребляющего режима; по gpio_desc |
| pwren_gpio | Вывод питания; по gpio_desc |
| mclk_id | 0 выбирает mclk0; 1 — mclk1 |
| isp_subdev_name | Основной ISP: RK_ISP_MAIN_SUBDEV_NAME; вспомогательный: RK_ISP_ASSIST_SUBDEV_NAME |
| i2c_bus | Выбрать I2C |
| i2c_addr | 7-битный адрес I2C |
| time_valid_delay | Кадры до действия экспозиции |
| gain_valid_delay | Кадры до действия усиления |
| mode_id | Разрешение по camera.h |
| width | Ширина малого изображения MCU |
| height | Высота малого изображения MCU |
| pixelcode | Формат малого изображения MCU |
| maxfps | Максимальный FPS всех конфигураций малого изображения |
| lanes | Число линий |
| hdr_mode | HDR малого изображения (NO_HDR: 0 HDR_X2: 5 HDR_X3: 6) |
| dst_width | Ширина большого изображения MCU |
| dst_height | Высота большого изображения MCU |
| dst_pixelcode | Формат большого изображения MCU |
| dst_maxfps | Максимальный FPS всех конфигураций большого изображения |
| dst_hdr_mode | HDR большого изображения (NO_HDR: 0 HDR_X2: 5 HDR_X3: 6) |
| rst_active | Активный уровень сброса |
| pwdn_active | Активный уровень энергосбережения |
| pwren_active | Активный уровень питания |

###### 4.3.3.1.3 cif_hw_config

data_lanes: число линий сенсора. Соединения Sensor/csi_dphy/csi_host:

| Соединение основной камеры и DPHY | dphy1.enable | dphy2.enable | csi_host_0.enable | csi_host_1.enable |
| --- | --- | --- | --- | --- |
| lane0 &lt; - &gt; MIPI_CSI_RX_D0N/P | 1 | 0 | 1 | 0 |
| lane1 &lt; - &gt; MIPI_CSI_RX_D1N/P | 1 | 0 | 1 | 0 |
| lane2 &lt; - &gt; MIPI_CSI_RX_D2N/P | 0 | 1 | 0 | 1 |
| lane3 &lt; - &gt; MIPI_CSI_RX_D3N/P | 0 | 1 | 0 | 1 |

###### 4.3.3.1.4 Регистрация одной камеры

Пример:

```text
const struct camera_board_desc camera_sc450ai =
{
    .i2c_addr = 0x30,
    .rst_gpio =
    {
        .gpio_pin = GPIO_PIN_A7,
        .gpio_group = GPIO4,
    },
    .pwdn_gpio =
    {
        .gpio_pin = GPIO_PIN_A2,
        .gpio_group = GPIO4,
    },
    .time_valid_delay = 2,
    .gain_valid_delay = 2,
    .width = 1344,
    .height = 760,
    .maxfps = 120,
    .lanes = 4,
    .pixelcode = MEDIA_BUS_FMT_SBGGR10_1X10,
    .hdr_mode = NO_HDR,
    .dst_width = 2688,
    .dst_height = 1520,
    .dst_maxfps = 60,
    .dst_pixelcode = MEDIA_BUS_FMT_SBGGR10_1X10,
    .dst_hdr_mode = NO_HDR,
    .isp_subdev_name = RK_ISP_MAIN_SUBDEV_NAME,
    .i2c_bus = "i2c3",
    .rst_active = 0,
    .pwdn_active = 1,
    .mclk_id = CLK_MIPI0_OUT2IO,
    .mclk_out_gate_id = CLK_MIPI0_OUT2IO_GATE,
};
void cif_hw_config(void)
{
    struct dphy_board_desc *csi2_dphy = (struct dphy_board_desc *)&csi2_dphy_board;
    struct csi2_board_desc *csi_host_0 = (struct csi2_board_desc *)&csi2_host0_board;
    struct vicap_board_desc *vicap = (struct vicap_board_desc *)&vicap_board;
    csi2_dphy->enable = true;
    csi2_dphy->csi2_dphy1.enable = true;
    csi2_dphy->csi2_dphy1.csi_host_idx = 0;
    csi2_dphy->csi2_dphy1.isp_subdev_name = RK_ISP_MAIN_SUBDEV_NAME;

    csi_host_0->enable = true;

    vicap->enable = true;
}
```

#### 4.3.4 Добавить конфигурацию платы

1. Реализуйте camera_board_desc и cif_hw_config в bsp/rockchip/xxx_mcu/board/xxx/board.c; см. регистрацию CIS.

2. Добавьте IOMUX периферии в bsp/rockchip/xxx_mcu/board/xxx/iomux.c по схеме.

## 5. Новые функции

### 5.1 AOV

AOV (Always On Video) использует сон/пробуждение для непрерывной круглосуточной записи с низкой частотой. AI, PIR или Wi-Fi-события возвращают нормальную частоту.

#### 5.1.1 Сценарии

Три сценария: нормальная частота при удалённом просмотре, PIR или обнаружении человека, с записью/сетью; AOV при простое и достаточном заряде, запись основного потока с низкой частотой и поддержание Wi-Fi/4G; малопотребляющее поддержание связи при простое и низком заряде, SoC выключен, Wi-Fi/4G активен.

![Технический рисунок китайского оригинала](/docs/rockchip-camera-driver/assets/cn-p059-figure-01.png)

#### 5.1.2 Рабочий процесс

![Технический рисунок китайского оригинала](/docs/rockchip-camera-driver/assets/cn-p059-figure-02.png)

#### 5.1.3 Понятия

AOV использует standby: сон или сброс для экономии энергии. Сон останавливает поток, снижает потребление и сохраняет регистры. Два способа сна SC200AI:

1. Опустить PWDN; I2C недоступен.

2. Записать 0 в регистр потока; I2C доступен. Сброс останавливает поток, снижает потребление и сбрасывает все регистры. Два способа сброса SC200AI:

1. Опустить XSHUTDN; I2C недоступен.

2. Записать 1 в регистр программного сброса; сброс длится 150ns.

##### 5.1.3.1 Аппаратный standby

Аппаратный standby опускает PWDN для малопотребляющего сна; I2C недоступен. Для SC200AI добавьте rockchip,camera-module-stb = &lt;1&gt; в узел DTS сенсора. 1 означает поддержку, 0 — отсутствие.

```text
sc200ai: sc200ai@30 {
    compatible = "smartsens,sc200ai";
    status = "okay";
    reg = <0x30>;
    ...
    rockchip,camera-module-stb = <1>;
    port {
        sc200ai_out: endpoint {
            remote-endpoint = <&csi_dphy_input1>;
            data-lanes = <1 2>;
        };
    };
};
```

Разберите свойство в probe и сохраните в sc200ai-&gt;standby_hw. При поддержке ioctl RKMODULE_SET_QUICK_STREAM меняет PWDN GPIO по состоянию потока. При сне/пробуждении V4L2 ioctl заново задают экспозицию/усиление. См. реализацию:

Источник ссылается на «4.2.4 Реализация драйвера», пример аппаратного standby.

##### 5.1.3.2 Программный standby

После пробуждения программный standby заново пишет полную конфигурацию регистров. Затем ioctl RKMODULE_SET_QUICK_STREAM непосредственно задаёт регистр потока. Источник ссылается на «4.2.4 Реализация драйвера», программный standby.

#### 5.1.4 Реализация драйвера

Пример аппаратного standby:

```text
static long sc200ai_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
{
    ......
    switch (cmd) {
    case RKMODULE_SET_QUICK_STREAM:
            stream = *((u32 *)arg);

            if (sc200ai->standby_hw) { // hardware standby
                if (stream) {
                    if (!IS_ERR(sc200ai->pwdn_gpio))
                        gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 1);
                    // Make sure __v4l2_ctrl_handler_setup can be called correctly
                    sc200ai->is_standby = false;
                    ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                        SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

                    #if IS_REACHABLE(CONFIG_VIDEO_CAM_SLEEP_WAKEUP)
                    if (__v4l2_ctrl_handler_setup(&sc200ai->ctrl_handler))
                        dev_err(&sc200ai->client->dev, "__v4l2_ctrl_handler_setup fail!");
                    if (sc200ai->cur_mode->hdr_mode != NO_HDR) {
                        if (sc200ai->cam_sw_inf) {
                            ret = sc200ai_ioctl(&sc200ai->subdev,
                                        PREISP_CMD_SET_HDRAE_EXP,
                                        &sc200ai->cam_sw_inf->hdr_ae);
                            if (ret) {
                                dev_err(&sc200ai->client->dev,
                                    "init exp fail in hdr mode\n");
                                return ret;
                            }
                        }
                    }
                    #endif

                    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                        SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);

                    dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit hw
standby mode\n");
                } else {
                    ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                        SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);

                    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                        SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_OFF);

                    if (!IS_ERR(sc200ai->pwdn_gpio))
                        gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 0);

                    dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter hw
standby mode\n");
                    sc200ai->is_standby = true;
                }
            }
        ......
}
```

Пример программного standby:

```text
static long sc200ai_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
{
    ......
    switch (cmd) {
    case RKMODULE_SET_QUICK_STREAM:
            stream = *((u32 *)arg);
            ......
            else {  // software standby
            if (stream) {
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
                dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit soft
standby mode\n");
            } else {
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_OFF);
                dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter soft
standby mode\n");
            }
        }

        break;
        ......
    }
```

#### 5.1.5 Документация

Для AOV см. Rockchip_Trouble_Shooting_Linux5.10_Camera_CN.pdf и Rockchip_RV1106_Developer_Guide_Linux_AOV_CN.pdf.

### 5.2 Синхронизация (ведущий/ведомый)

Один сенсор обычно работает простым Master. Для двух и более с синхронным потоком/экспозицией требуется настройка режима, обычно ведущий/ведомый. Следующие приложения требуют одновременной экспозиции/вывода со строгим временным выравниванием:

| Член | Описание |
| --- | --- |
| 3D / binocular / stereo vision | Обязательная синхронизация, иначе неверная глубина. |
| Multicamera stitching / panorama | Кадровая синхронизация для точного совмещения. |
| Machine vision / industrial inspection | Синхронная выборка разных ракурсов. |
| Autonomous driving / ADAS | Временная синхронизация критична. |
| Video conferencing / multiple cameras | Строгая синхронизация обычно не нужна, но улучшает качество. |

Обычный способ — общий FSYNC/EFSYNC/TRIGGER/SYNC_IN. SoC одновременно запускает экспозицию/считывание всех сенсоров, синхронизируя изображения.

#### 5.2.1 Режим Slave сенсора

В Slave внешний MCU/SoC/DSP управляет связью, таймингом и передачей через такты, синхронизацию, I2C/MIPI. Сенсор отвечает, а не инициирует обмен/тайминг. В многосенсорной системе SoC/FPGA одновременно посылает FSYNC всем сенсорам, они вместе начинают экспозицию или считывание для одинаковых меток времени и синхронного содержания.

| Член | Описание |
| --- | --- |
| FSYNC (Frame SYNC) | Кадровый синхровход: внешний цифровой GPIO/CMOS-сигнал одновременно запускает экспозицию/считывание. |
| EFSYNC (External Frame SYNC) | Внешняя кадровая синхронизация, название зависит от производителя. Как FSYNC: хост посылает, все Slave выполняют одновременно. |
| TRIGGER / SYNC_IN / STROBE | Другие названия внешнего синхровхода сенсоров. |

В RK одна камера задаётся Master, остальные Slave. После завершения кадра Master внешний FSYNC/EFSYNC одновременно запускает экспозицию/считывание Slave для временного выравнивания.

#### 5.2.2 Реализация драйвера

1. Получите регистры master/slave из datasheet или у FAE производителя.

```text
/* sync mode regs */
static __maybe_unused const struct regval sc200ai_interal_sync_master_start_regs[] = {
    {0x300a, 0x24}, //sync as output PAD
    {0x3032, 0xa0},
    {0x3222, 0x00}, //master mode
    {0x3216, 0x00},
    {0x3217, 0x04},
    {REG_NULL, 0x00},
};

static __maybe_unused const struct regval sc200ai_interal_sync_master_stop_regs[] = {
    {REG_NULL, 0x00},
};

static __maybe_unused const struct regval sc200ai_interal_sync_slaver_start_regs[] = {
    {0x3222, 0x02}, //slave mode
    {0x3230, 0x00},
    {0x3231, 0x04}, //Rows Before Read
    {0x3224, 0x82}, //fsync trigger
    {REG_NULL, 0x00},
};

static __maybe_unused const struct regval sc200ai_interal_sync_slaver_stop_regs[] = {
    {REG_NULL, 0x00},
};
```

2. Добавьте переменные режима синхронизации

```text
struct sc200ai {
    ......
    enum rkmodule_sync_mode sync_mode;
    ......
};
```

Основные определения режимов синхронизации:

```text
/*
 * sensor exposure sync mode
 */
enum rkmodule_sync_mode {
    NO_SYNC_MODE = 0,
    EXTERNAL_MASTER_MODE,
    INTERNAL_MASTER_MODE,
    SLAVE_MODE,
    SOFT_SYNC_MODE,
};
```

Разберите свойства синхронизации узла сенсора DTS для определения режима.

```text
static int sc200ai_probe(struct i2c_client *client,
             const struct i2c_device_id *id)
    ......
    ret = of_property_read_string(node, RKMODULE_CAMERA_SYNC_MODE,
                      &sync_mode_name);
    if (ret) {
        sc200ai->sync_mode = NO_SYNC_MODE;
        dev_err(dev, "could not get sync mode!\n");
    } else {
        if (strcmp(sync_mode_name, RKMODULE_EXTERNAL_MASTER_MODE) == 0) {
            sc200ai->sync_mode = EXTERNAL_MASTER_MODE;
            dev_info(dev, "sync_mode = [EXTERNAL_MASTER_MODE]\n");
        } else if (strcmp(sync_mode_name, RKMODULE_INTERNAL_MASTER_MODE) == 0) {
            sc200ai->sync_mode = INTERNAL_MASTER_MODE;
            dev_info(dev, "sync_mode = [INTERNAL_MASTER_MODE]\n");
        } else if (strcmp(sync_mode_name, RKMODULE_SLAVE_MODE) == 0) {
            sc200ai->sync_mode = SLAVE_MODE;
            dev_info(dev, "sync_mode = [SLAVE_MODE]\n");
        } else if (strcmp(sync_mode_name, RKMODULE_SOFT_SYNC_MODE) == 0) {
            sc200ai->sync_mode = SOFT_SYNC_MODE;
            dev_info(dev, "sync_mode = [SOFT_SYNC_MODE]\n");
        } else {
            dev_info(dev, "sync_mode = [NO_SYNC_MODE]\n");
        }
    }
    ......
```

Соответствующие макросы:

```text
#define RKMODULE_CAMERA_SYNC_MODE       "rockchip,camera-module-sync-mode"
#define RKMODULE_INTERNAL_MASTER_MODE   "internal_master"
#define RKMODULE_EXTERNAL_MASTER_MODE   "external_master"
#define RKMODULE_SLAVE_MODE             "slave"
#define RKMODULE_SOFT_SYNC_MODE         "soft_sync"
```

3. При запуске потока задавайте регистры по режиму синхронизации сенсора.

```text
static int __sc200ai_start_stream(struct sc200ai *sc200ai)
{
    int ret = 0;
    ......
    if (!sc200ai->is_thunderboot) {
        ret = sc200ai_write_array(sc200ai->client, sc200ai->cur_mode->reg_list);
        if (ret)
            return ret;

        ......

        if (sc200ai->sync_mode == INTERNAL_MASTER_MODE ||
            sc200ai->sync_mode == SOFT_SYNC_MODE) {
            ret |= sc200ai_write_array(sc200ai->client,
                           sc200ai_interal_sync_master_start_regs);
        } else if (sc200ai->sync_mode == EXTERNAL_MASTER_MODE) {
            ret |= sc200ai_write_array(sc200ai->client,
                           sc200ai_interal_sync_slaver_start_regs);
        } else if (sc200ai->sync_mode == SLAVE_MODE) {
            ret |= sc200ai_write_array(sc200ai->client,
                           sc200ai_interal_sync_slaver_start_regs);
        }
        if (ret) {
            dev_err(&sc200ai->client->dev,
                "write sync regs failed\n");
            return ret;
        }
    }

    if (sc200ai->sync_mode == NO_SYNC_MODE)
        ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                     SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
    return ret;
}
```

4. Установка/получение режима в RKAIQ. Если DTS не задаёт синхронизацию, интерфейсы RKAIQ могут настроить её через ioctl.

```text
static long sc200ai_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
{
    ......
    case RKMODULE_GET_SYNC_MODE:
        sync_mode = (u32 *)arg;
        *sync_mode = sc200ai->sync_mode;
        break;
    case RKMODULE_SET_SYNC_MODE:
        sync_mode = (u32 *)arg;
        if (sync_mode) {
            sc200ai->sync_mode = *sync_mode;
            dev_info(&sc200ai->client->dev, "set sync mode is: %s\n",
                 ((*sync_mode == EXTERNAL_MASTER_MODE) ||
                  (*sync_mode == SLAVE_MODE)) ? "secondary" : "primary");
        } else {
            dev_info(&sc200ai->client->dev, "set sync mode is: NO_SYNC_MODE\n");
        }
        break;
    ......
}
```

### 5.3 Управление вспышкой

Драйвер может управлять вспышкой PWM или GPIO. Правильно задайте параметры для включения/выключения из приложения.

#### 5.3.1 Реализация драйвера

1. Заголовок

```text
#include "light_ctl.h"
```

2. Добавьте переменные управления

```text
struct xxxx {
    ......
    bool                    enable_light_ctl;
    struct rk_light_param   light_param;
    ......
}；
```

3. Обработка ioctl RKCIS_CMD_FLASH_LIGHT_CTRL

```text
static long xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
    ......
    struct rk_light_param *light_param;
    ......
    case RKCIS_CMD_FLASH_LIGHT_CTRL:
        dev_info(&mis5001->client->dev, "set flash light param\n");
        light_param = (struct rk_light_param *)arg;
        if (light_param->light_enable) {
            memcpy(&mis5001->light_param, light_param, sizeof(struct rk_light_param));
            mis5001->enable_light_ctl = true;
        } else {
            mis5001->enable_light_ctl = false;
        }
        ret = light_ctl_write(mis5001->module_index, light_param);
        break;

    ......
};

static long xxxx_compat_ioctl32(struct v4l2_subdev *sd,
                   unsigned int cmd, unsigned long arg)
{
        ......
        struct rk_light_param *light_param;
        ......
        switch (cmd) {
        ......
        case RKCIS_CMD_FLASH_LIGHT_CTRL:
            light_param = kzalloc(sizeof(*light_param), GFP_KERNEL);
            if (!light_param) {
                ret = -ENOMEM;
                return ret;
            }

            ret = copy_from_user(light_param, up, sizeof(*light_param));
            if (!ret)
                ret = mis5001_ioctl(sd, cmd, light_param);
            else
                ret = -EFAULT;
            kfree(light_param);
            break;
        }
        .....
}
```

#### 5.3.2 Документация

Подробности в разделе 7.2 управления подсветкой Rockchip_Trouble_Shooting_Linux5.10_Camera_CN.pdf.

### 5.4 Переключение разрешения

Приложения могут использовать разные разрешения в разных сценариях; драйвер переключает разрешение по команде верхнего уровня.

#### 5.4.1 Реализация драйвера

Пример кода:

```text
static int sc200ai_set_setting(struct sc200ai *sc200ai, struct rk_sensor_setting *setting)
{
    int i = 0;
    int cur_fps = 0;
    s64 h_blank, vblank_def;
    u64 pixel_rate = 0;
    const struct sc200ai_mode *mode = NULL;
    const struct sc200ai_mode *match = NULL;

    dev_info(&sc200ai->client->dev,
        "sensor setting: %d x %d, fps:%d fmt:%d, mode:%d\n",
        setting->width, setting->height,
        setting->fps, setting->fmt, setting->mode);

    for (i = 0; i < ARRAY_SIZE(supported_modes); i++) {
        mode = &supported_modes[i];
        if (mode->width == setting->width &&
            mode->height == setting->height &&
            mode->hdr_mode == setting->mode &&
            mode->bus_fmt == setting->fmt) {
            cur_fps = DIV_ROUND_CLOSEST(mode->max_fps.denominator, mode->max_fps.numerator);
            if (cur_fps == setting->fps) {
                match = mode;
                break;
            }
        }
    }

    if (match) {
        dev_info(&sc200ai->client->dev, "-----%s: match the support mode, mode idx:%d-----
\n",
            __func__, i);
        sc200ai->cur_mode = mode;

        h_blank = mode->hts_def - mode->width;
        __v4l2_ctrl_modify_range(sc200ai->hblank, h_blank,
                     h_blank, 1, h_blank);
        vblank_def = mode->vts_def - mode->height;
        __v4l2_ctrl_modify_range(sc200ai->vblank, vblank_def,
                     SC200AI_VTS_MAX - mode->height,
                     1, vblank_def);
        __v4l2_ctrl_s_ctrl(sc200ai->link_freq, mode->mipi_freq_idx);
        pixel_rate = (u32)link_freq_menu_items[mode->mipi_freq_idx] /
                 mode->bpp * 2 * SC200AI_LANES;
        __v4l2_ctrl_s_ctrl_int64(sc200ai->pixel_rate, pixel_rate);
        dev_info(&sc200ai->client->dev, "freq_idx:%d pixel_rate:%lld\n",
            mode->mipi_freq_idx, pixel_rate);
        sc200ai->cur_vts = mode->vts_def;
        sc200ai->cur_fps = mode->max_fps;

        dev_info(&sc200ai->client->dev, "hts_def:%d cur_vts:%d cur_fps:%d\n",
            mode->hts_def, mode->vts_def,
            sc200ai->cur_fps.denominator / sc200ai->cur_fps.numerator);
    } else {
        dev_err(&sc200ai->client->dev, "couldn't match the support modes\n");
        return -EINVAL;
    }

    return 0;
}

static long sc200ai_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
    ......
    struct rk_sensor_setting *setting;
    ......

    switch (cmd) {
    ......
    case RKCIS_CMD_SELECT_SETTING:
        setting = (struct rk_sensor_setting *)arg;
        ret = sc200ai_set_setting(sc200ai, setting);
        break;

    ......
    }
}
```

### 5.5 Поддержка разного числа линий

Платформа, число сенсоров, производительность и соединения могут требовать последовательностей для разного числа линий. Драйвер обеспечивает совместимость.

#### 5.5.1 Реализация драйвера

Пример кода:

```text
// 4 Lane 寄存器配置⽀持列表
static const struct sc450ai_mode supported_modes_4lane[] = {
    {
        ...
    },
    {
        ...
    },
};
// 2 Lane 寄存器配置⽀持列表
static const struct sc450ai_mode supported_modes_2lane[] = {
    {
        ...
    },
    {
        ...
    },
}
static int sc450ai_probe(struct i2c_client *client,
             const struct i2c_device_id *id)
{
    struct device_node *node = dev->of_node;
    struct device_node *endpoint;
    ......
    endpoint = of_graph_get_next_endpoint(dev->of_node, NULL);
    if (!endpoint) {
        dev_err(dev, "Failed to get endpoint\n");
        return -EINVAL;
    }
    ret = v4l2_fwnode_endpoint_parse(of_fwnode_handle(endpoint),
        &sc450ai->bus_cfg);
    of_node_put(endpoint);
    if (ret) {
        dev_err(dev, "Failed to get bus config\n");
        return -EINVAL;
    }

    // 根据dts配置的lane数选择不同的寄存器⽀持列表数组
    if (sc450ai->bus_cfg.bus.mipi_csi2.num_data_lanes == 4) {
        sc450ai->supported_modes = supported_modes_4lane;
        sc450ai->cfg_num = ARRAY_SIZE(supported_modes_4lane);
        dev_info(dev, "detect sc450ai lane: %d\n",
             sc450ai->bus_cfg.bus.mipi_csi2.num_data_lanes);
    } else {
        sc450ai->supported_modes = supported_modes_2lane;
        sc450ai->cfg_num = ARRAY_SIZE(supported_modes_2lane);
        dev_info(dev, "detect sc450ai lane: %d\n",
             sc450ai->bus_cfg.bus.mipi_csi2.num_data_lanes);
    }
    ......
}
```

Для supported_modes с 2Lane/4Lane probe читает число линий DTS в bus_cfg.bus.mipi_csi2.num_data_lanes и инициализирует нужный список режимов и число cfg_num.

### 5.6 Прочее

## 6. Анализ и устранение проблем

### 6.1 Сенсор не распознан, ошибка probe или I2C

Источник связывает нераспознанный ID с последовательностью включения, а не RKISP/RKCIF. Проверяйте в таком порядке:

1. Верный 7-битный I2C slave ID, не 8-битный.

2. Наличие MCLK и правильная амплитуда; обычно 24Mhz, иногда 27Mhz.

3. Последовательность питания: avdd, dovdd, dvdd по datasheet, правильная настройка PWDN/RESET GPIO.

#### 6.1.1 Не измеряются MCLK/VDD

Драйвер обычно включает MCLK/питание только по необходимости; после загрузки они выключены. Для измерений источник предлагает временно закомментировать power_off(), оставив питание включённым. Проверьте полосу осциллографа; рекомендовано не менее 48M.

1. Неверное включение MCLK: см. drivers/media/i2c/ov5695.c.

2. GPIO занят другим модулем: обычно есть сообщение ядра. Команда io позволяет проверить регистры pin-ctrl.

#### 6.1.2 Проверка последовательности включения

Осциллографом проверьте порядок и интервалы питания по datasheet. У некоторых, например ov5695, порядок VDD не задан и используется regulator_bulk. У других, например ov2685.c, нужны отдельные упорядоченные avdd_regulator, dovdd_regulator. Выбирайте по фактическим требованиям.

### 6.2 Значения exp_def, hts_def и vts_def

По возможности спросите производителя. Иначе найдите регистры в datasheet и начальные значения в списке инициализации. Пример SC200AI:

```text
#define SC200AI_REG_VTS_H       0x320e
#define SC200AI_REG_VTS_L       0x320f
...
static const struct regval sc200ai_linear_10_1920x1080_30fps_regs[] = {
    ...
    //HTS=1100*2=2200
    {0x320c, 0x04},
    {0x320d, 0x4c},
    //VTS=1125
    {0x320e, 0x04},
    {0x320f, 0x65},
    ...
};

static const struct sc200ai_mode supported_modes[] = {
    {
        .width = 1920,
        .height = 1080,
        .max_fps = {
            .numerator = 10000,
            .denominator = 300000,
        },
        .exp_def = 0x0080,  // exp曝光默认值，⼀般应⼩于vts默认值，最⼤vts_def - 8 (曝光⾏，具体减去
多少，参考 Sensor ⼿册，可能4/8/10)
        .hts_def = 0x44C * 2,// hts默认值填写对应寄存器列表中给出的默认值(可乘倍数)
        .vts_def = 0x0465,  // vts默认值填对应寄存器列表中给出的默认值
        ...
    },
    ...
};
```

### 6.3 Значения link_freq и pixel_rate

link_freq — фактическая частота MIPI, не 24M MCLK, а MIPI dn/dp clk. Предпочтительны данные производителя/datasheet. Обычно фактическое значение не меньше результата следующей формулы в Hz:

```text
link_freq = width * height * fps * bits_per_pixel / lanes / 2
```

Если link_freq неизвестен, измерьте осциллографом. pixel_rate — пиксели в секунду; после определения link_freq вычислите:

```text
pclk = link_freq * 2 * lanes / bits_per_pixel
```

### 6.4 Когда сенсор считается работающим?

Сначала проверьте ID и чтение/запись I2C. media-ctl -p -d /dev/media0 должен показать имя, разрешение и сведения сенсора:

```text
# media-ctl -p -d /dev/media0 | tail -n 30
                -> "rkcif_tools_id2":0 []
        pad11: Source
                -> "stream_cif_mipi_id0":0 []
                -> "stream_cif_mipi_id1":0 []
                -> "stream_cif_mipi_id2":0 []
                -> "stream_cif_mipi_id3":0 []
                -> "rkcif_scale_ch0":0 []
                -> "rkcif_scale_ch1":0 []
                -> "rkcif_scale_ch2":0 []
                -> "rkcif_scale_ch3":0 []
                -> "rkcif_tools_id0":0 []
                -> "rkcif_tools_id1":0 []
                -> "rkcif_tools_id2":0 [ENABLED]

- entity 58: rockchip-csi2-dphy0 (2 pads, 2 links)
             type V4L2 subdev subtype Unknown flags 0
             device node name /dev/v4l-subdev1
        pad0: Sink
                [fmt:SBGGR10_1X10/1920x1080@10000/300000 field:none]
                <- "m00_b_sc200ai 4-0030":0 [ENABLED]
        pad1: Source
                -> "rockchip-mipi-csi2":0 [ENABLED]

- entity 63: m00_b_sc200ai 4-0030 (1 pad, 1 link)
             type V4L2 subdev subtype Sensor flags 0
             device node name /dev/v4l-subdev2
        pad0: Source
                [fmt:SBGGR10_1X10/1920x1080@10000/300000 field:none]
                -> "rockchip-csi2-dphy0":0 [ENABLED]
```

Если media-ctl/v4l2-ctl отсутствуют, проверьте успешный Detect через dmesg. При захвате MIPI должен передавать данные без ошибок MIPI/ISP, а приложение — получать кадры.

### 6.5 Поток с ошибками CRC/ECC

#### 6.5.1 Источник ошибок и подробности журнала

Ищите в dmesg/журнале ядра ERR1, ERR2, CRC, ECC, mipi, csi2, phy. CSI/PHY-драйверы Rockchip обычно печатают состояние регистров. Запишите коды ERR1/ERR2 и номера VC (Virtual Channel). Пример:

```text
[  126.741234] rockchip-mipi-csi2 feaa0000.csi2-dphy: ERR1: 0x00000040 (ECC Error,
VC1), FIFO overflow? Check timings!
[  126.741259] rockchip-mipi-csi2 feaa0000.csi2-dphy: ERR2: 0x00000010 (CRC Error,
VC0)
```

Типы: ERR1 (CSIS_ERR1) обычно ошибки протокола — ECC, формат кадра, заголовок пакета. ERR2 (CSIS_ERR2) — транспорт: переполнение FIFO, таймаут, код синхронизации. CRC Error — неверная контрольная сумма/инверсия битов. ECC Error — ошибка обнаружения/исправления заголовка, обычно серьёзнее и указывает на физический уровень. Overflow — переполнение FIFO при несогласованном тайминге.

#### 6.5.2 Программная конфигурация (драйвер/DTS)

Согласуйте тайминг: HTS (Total Width) и VTS (Total Height) драйвера должны соответствовать приёмнику CSI2-DPHY. Несоответствие вызывает ERR2 Overflow. Проверка:

```text
media-ctl -p -d /dev/mediaX  # 查看 Entity 之间的链路和当前格式
v4l2-ctl -d /dev/v4l-subdevY --get-fmt-video # 查看 Sensor 输出格式
v4l2-ctl -d /dev/v4l-subdevZ --get-fmt-video # 查看 CSI-DPHY 输⼊格式
```

Скорость MIPI должна быть в пределах SoC CSI-DPHY; источник указывает около 2.5Gbps/lane для RK3566 и RK3588. VC сенсора (например 0/1) должен совпадать с csi2_dphy/rkcif_mipi_lvds в DTS; источник связывает несовпадение с CRC. Проверьте узел csi2_dphy:

```text
csi2_dphy_hw: csi2-dphy@fedc0000 {
    compatible = "rockchip,rk3588-csi2-dphy-hw";
    clocks = ...; // 时钟配置必须正确
    resets = ...;
    rockchip,hw = <&csi2_dphy0>; // 硬件版本
};
csi2_dphy0: csi2-dphy0 {
    compatible = "rockchip,rk3568-csi2-dphy";
    phys = <&mipi_dphy0>; // 指向正确的PHY
    phy-names = "dphy";
    ports {
        port@0 {
            reg = <0>;
            #address-cells = <1>;
            #size-cells = <0>;
            // 关键点: CSI 接收 VC 设置
            endpoint {
                remote-endpoint = <&sensor_out>;
                data-lanes = <1 2 3 4>; // Lane数量必须匹配Sensor
                virtual-channel-index = <0>; // 必须等于Sensor输出VC
            };
        };
    };
};
```

Проверьте такты/питание: верные частоты сенсора, MIPI DPHY и CSI2 Host Controller без конфликтов. DOVDD/AVDD/DVDD в допуске; пульсации &lt;50mV измеряются осциллографом.

#### 6.5.3 Аппаратный тракт (источник заявляет более 90% физических причин)

Соединения: переустановите и защёлкните FPC, испытайте заведомо исправный кабель. Проверьте окисление/грязь контактов, используйте очиститель электроники. Источник задаёт дифференциальный импеданс 100Ω ±10%; плохие кабели — частая причина.

Целостность сигнала проверяется осциллографом/анализатором. Все питания сенсора, особенно DVDD 1.2V/1.8V: шум &lt;50mV pk-pk. На CLK+/CLK- и DATA+/DATA- источник задаёт: глаз ≥100mV по высоте, ≥0.4 UI по ширине, чёткие монотонные фронты (закрытый/размытый глаз критичен); slew rate 1.5–4V/ns по версии D-PHY; выбросы/звон &lt;20% Vdiff pp; синфазный шум &lt;100mV; data-to-clock skew &lt;0.3 UI. Попробуйте 500Mbps и проверьте исчезновение ошибок.

MCLK обычно 24MHz/27MHz: стабильность ±50ppm, джиттер &lt;50ps RMS. Экранированные кабели, минимальная земля щупа. Импеданс земли плат сенсора и SoC по источнику &lt;1Ω. Избегайте Wi-Fi/DC-DC, двигателей и сильных магнитных полей.

#### 6.5.4 Системная проверка/отладка

Сверьте порядок/число data-lanes DTS с проводкой, особенно инверсию полярности и lane-polarities. Снизьте до 320x240 @10fps; исчезновение ошибок указывает на полосу/качество сигнала. Включите Color Bar/Checkerboard, обходящий аналоговый захват и проверяющий MIPI. Включите rkisp_3A_server в /etc/init.d/ для подробных логов. Мониторинг v4l2-ctl:

```text
v4l2-ctl -d /dev/video0 --stream-mmap --stream-count=100 --stream-skip=100
```

Температура: высокая ухудшает сигнал. Проверьте рост ошибок с температурой (пример источника: окружающая &gt;85°C).

#### 6.5.5 Срочные меры диагностики

1. Сначала снизьте MIPI до &lt;1.5Gbps/lane для проверки.

2. Попробуйте только 1 линию.

3. Уберите лишнюю периферию, снизьте CPU/GPU для изоляции помех.

4. Замените сенсор, вычислительный модуль или основную плату, особенно при подозрении на импеданс PCB.

#### 6.5.6 Типичные исправления

Физические причины (по источнику 90%): качественный кабель 100Ω±5%, короче дифференциальные дорожки, убрать via stub, разнести пары; источник также предлагает терминаторы 50Ω на землю. Программные (9%): согласовать VTS, HTS, Pixel Clock, исправить VC/lane map, обновить драйвер/прошивку, особенно MIPI PHY.

Аппаратные дефекты (по источнику 1%): переработать питание, добавить LDO-фильтрацию; точный кварц/тактовый буфер; улучшить ESD/выбор TVS.

#### 6.5.7 Индекс сенсора

Задайте rockchip,camera-module-index в DTS. librkaiq/rockit предпочитают этот индекс устройства; tool_server также ищет по нему. Без явного -d используется 0. Рекомендация: одна камера 0, две 0/1, несколько 0/1/2/3…

## 7. Документация

Написание драйвера — лишь этап. По DTS платформ, быстрому запуску/AOV и проблемам изображения см.:

1. Rockchip_Driver_Guide_VI_CN.pdf, last ver: v1.2.0

2. Rockchip Quick Start For Camera.pdf, last ver: v1.0.0

3. Rockchip_Trouble_Shooting_Linux5.10_Camera_CN.pdf

4. Rockchip_Developer_Guide_Linux_AOV_CN.pdf

## 8. Приложения

### 8.1 V4L2-controls CIS

| Член | Описание |
| --- | --- |
| V4L2_CID_VBLANK | Вертикальное гашение: простой после кадра без данных, в строках. Длина строки — ширина изображения плюс горизонтальное гашение при V4L2_CID_PIXEL_RATE того же подустройства. |

| Член | Описание |
| --- | --- |
| V4L2_CID_HBLANK | Горизонтальное гашение: простой после каждой строки без данных, в пикселях. |
| V4L2_CID_EXPOSURE | Экспозиция сенсора, ограниченная интервалом кадров. |
| V4L2_CID_ANALOGUE_GAIN | Усиление всех цветовых компонентов матрицы в аналоговой области до A/D. |
| V4L2_CID_PIXEL_RATE | Частота пикселей исходных pad subdev, только чтение, пикселей/с. MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample |
| V4L2_CID_LINK_FREQ | Частота шины в Hz. Вместе с кодом пикселей и типом шины (такты/отсчёт) задаёт V4L2_CID_PIXEL_RATE матрицы либо иной точки для не-сенсоров. Частота кадров зависит от такта, ширины/высоты и обоих гашений. Pixel-rate вне подустройства матрицы недостаточен: только в матрице гашение точно, поскольку другое гашение там недопустимо. Частота кадров выбирается горизонтальным/вертикальным гашением. |

### 8.2 Список MEDIA_BUS_FMT

| Тип CIS | Выходной формат |
| --- | --- |
| Bayer RAW | MEDIA_BUS_FMT_SBGGR10_1X10<br>MEDIA_BUS_FMT_SRGGB10_1X10<br>MEDIA_BUS_FMT_SGBRG10_1X10<br>MEDIA_BUS_FMT_SGRBG10_1X10<br>MEDIA_BUS_FMT_SRGGB12_1X12<br>MEDIA_BUS_FMT_SBGGR12_1X12<br>MEDIA_BUS_FMT_SGBRG12_1X12<br>MEDIA_BUS_FMT_SGRBG12_1X12<br>MEDIA_BUS_FMT_SRGGB8_1X8<br>MEDIA_BUS_FMT_SBGGR8_1X8<br>MEDIA_BUS_FMT_SGBRG8_1X8<br>MEDIA_BUS_FMT_SGRBG8_1X8 |
| YUV | MEDIA_BUS_FMT_YUYV8_2X8<br>MEDIA_BUS_FMT_YVYU8_2X8<br>MEDIA_BUS_FMT_UYVY8_2X8<br>MEDIA_BUS_FMT_VYUY8_2X8<br>MEDIA_BUS_FMT_YUYV10_2X10<br>MEDIA_BUS_FMT_YVYU10_2X10<br>MEDIA_BUS_FMT_UYVY10_2X10<br>MEDIA_BUS_FMT_VYUY10_2X10<br>MEDIA_BUS_FMT_YUYV12_2X12<br>MEDIA_BUS_FMT_YVYU12_2X12<br>MEDIA_BUS_FMT_UYVY12_2X12<br>MEDIA_BUS_FMT_VYUY12_2X12 |
| Только Y (монохромный), raw BW | MEDIA_BUS_FMT_Y8_1X8<br>MEDIA_BUS_FMT_Y10_1X10<br>MEDIA_BUS_FMT_Y12_1X12 |

### 8.3 Эталонные драйверы камер

| Интерфейс CIS | Тип выходных данных CIS | Frame/Field | Эталонные драйверы |
| --- | --- | --- | --- |
| MIPI | Bayer RAW | frame | 0.3M<br>ov7750.c<br>gc0403.c<br>0.9M<br>jx_h62.c<br>jx_h63p<br>1.2M<br>ov9750.c<br>jx-h65.c<br>mia1321.c<br>2M<br>jx_f37.c<br>mis20s1.c<br>mis2031.c<br>ov2685.c<br>ov2680.c<br>ov2735.c<br>ov02g10.c<br>ov02b10.c<br>gc2385.c<br>gc2355.c<br>gc2053.c<br>gc2093.c<br>sc2232.c<br>sc2239.c<br>sc223a.c<br>sc2310.c<br>sc2336.c<br>sc2336p.c<br>sc230ai.c<br>sc231hai.c<br>sc235hai.c<br>sc210iot.c<br>sp250a.c<br>4M<br>gc4c33.c<br>jx_k04.c<br>jx_k17.c<br>mis4001.c<br>mis40c1.c<br>mis40h1.c<br>ov4686.c<br>ov4688.c<br>ov4689.c<br>os04c10.c<br>os04a10.c<br>sc401ai.c<br>sc4236.c<br>sc450ai.c<br>sc485sl.c<br>imx347.c<br>5M<br>mis5001.c<br>os05a20.c<br>ov5695.c<br>ov5648.c<br>ov5670.c<br>gc5024.c<br>gc5025.c<br>gc5035.c<br>hm5040.c<br>sc5239.c<br>hynix_hi556.c<br>8M<br>ar0822.c<br>gc8613.c<br>mis8001.c<br>ov8858.c<br>os08a10.c<br>os08a20.c<br>sc8220.c<br>sc830ai.c<br>sc835hai.c<br>sc850sl.c<br>imx378.c<br>imx317.c<br>imx219.c<br>gc8034.c<br>hynix_hi846.c<br>s5kgm1sp.c<br>s5k4h7yx.c<br>13M<br>ov13850.c<br>ov13b10.c<br>imx258.c<br>ov12d2q.c |
| MIPI | Bayer raw hdr | frame | 2M<br>imx307.c<br>imx327.c<br>imx462.c<br>gc2093.c<br>ov02k10.c<br>ov2718.c<br>sc200ai.c<br>sc2310.c<br>jx-f37.c<br>4M<br>ov4689.c<br>os04a10.c<br>imx347.c<br>imx464.c<br>sc4238.c<br>5M<br>imx335.c<br>os05a20.c<br>sc500ai.c<br>8M<br>imx334.c<br>imx415.c |
| MIPI | YUV | frame | 2M<br>gc2145.c |
| MIPI | RAW BW | frame | 0.3M<br>ov7251.c<br>1M<br>ov9281.c<br>1.3M<br>sc132gs.c |
| MIPI | YUV | field | tc35874x.c |
| ITU.BT60 | Bayer RAW |  | 2M<br>imx323.c<br>ar0230.c |
| ITU.BT601 | YUV |  | 0.3M<br>gc0329.c<br>gc0312.c<br>gc032a.c<br>2M<br>gc2145.c<br>gc2155.c<br>gc2035.c<br>bf3925.c |
| ITU.BT601 | RAW BW |  | 0.3M<br>sc031gs.c<br>1.3M<br>sc032gs.c |
| ITU.BT656 | Bayer RAW |  | 2M<br>imx323.c (может поддерживаться) |

{% endraw %}
