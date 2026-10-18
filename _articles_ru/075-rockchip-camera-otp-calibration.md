---
title: "Калибровка OTP модулей камер Rockchip: AWB, LSC, PDAF, API и форматы данных"
description: "Полный материал V1.0.34: калибровка и проверка AWB/LSC, Gain Map/DCC Map, все API, sensor.ini, пример кода и структуры OTP."
translation_key: "075-rockchip-camera-otp-calibration"
slug: "075-rockchip-camera-otp-calibration"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "Camera", "OTP", "PDAF", "AWB", "LSC"]
keywords: "ArmSoM Rockchip camera OTP AWB LSC PDAF"
excerpt: "Полный материал V1.0.34: калибровка и проверка AWB/LSC, Gain Map/DCC Map, все API, sensor.ini, пример кода и структуры OTP."
---

{% raw %}

# Калибровка OTP модулей камер Rockchip: AWB, LSC, PDAF, API и форматы данных

Статья полностью сохраняет техническую часть (стр.9–47 PDF) английского исходника V1.0.34 объёмом 47 страниц. Соответствующий китайский PDF не предоставлен. Китайская и русская версии полностью переводят английский исходник; во всех трёх статьях используются его оригинальные рисунки, включая китайские подписи, уже присутствующие в них. Код, параметры, идентификаторы, значения примеров и комментарии к коду сохранены; текст и подписи рисунков локализованы.

Ниже воспроизведена область применимости по SoC. Единая версия ядра и конкретные платы ArmSoM не указаны. Это справочник по платформе для ArmSoM: проверьте SoC, модуль, сенсор, VCM/OIS, ISP, SDK/BSP, версию калибровочной DLL/API, драйверы и структуру OTP/EEPROM. Примеры модулей из исходника не являются результатами испытаний ArmSoM. Аппаратная проверка, калибровка, программирование и операции с камерой не выполнялись.

**Риск операций и неоднозначности исходника:** программирование OTP/EEPROM может быть необратимым или перезаписать калибровочные данные. Сначала проверьте процедуру производителя и структуру целевого хранилища. Некоторые значения по умолчанию, объявления функций и вызовы в приложении различаются. Приложение является примером исходника, а не гарантией компилируемости или пригодности для производства. Формулы, адреса, разрядность и ID сохранены; технические константы не исправлялись без обоснования.

| SoC по исходнику |
|---|
| RV1109 / RV1126 / RK356X / RK3588 |

Неоднозначности и запись проверки:
[EDITORIAL-NOTES](/docs/rockchip-camera-otp-calibration/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.9, block 0 -->

## 1. Процесс калибровки LSC и AWB

<!-- Source EN PDF p.9, block 1 -->

### 1.1 Схема калибровки

<!-- Source EN PDF p.9, block 2 -->

1\. Освещение и оборудование

<!-- Source EN PDF p.9, block 3 -->

D50 (5000K±100K); исключите посторонний свет из окружающей среды.

<!-- Source EN PDF p.9, block 4 -->

Используйте рассеивающую пластину или световой короб DNP с указанным освещением. Рассеиватель показан ниже:

<!-- Source EN PDF p.9, block 5 -->

![Технический рисунок английского исходника, p.9](/docs/rockchip-camera-otp-calibration/assets/en-p09-figure1.png)

*Технический рисунок английского исходника, PDF p.9.*

<!-- Source EN PDF p.9, block 6 -->

2\. Способ съёмки

<!-- Source EN PDF p.9, block 7 -->

1. Выберите подходящий способ:
   - Рассеиватель: разместите его покрытой стороной к объективу, вблизи него; торец модуля, рассеиватель и световая панель должны быть параллельны.
   - Короб DNP: расположите модуль в 1–2cm перед световой панелью DNP, параллельно ей.
2. Отключите mirror/flip и аналогичные функции.
3. Подберите экспозицию, чтобы максимальная яркость канала G (8bit) находилась в диапазоне 160~180.
4. С этой экспозицией снимите и сохраните raw-изображение.

<!-- Source EN PDF p.9, block 8 -->

3\. Калибровка AWB

<!-- Source EN PDF p.9, block 9 -->

1\. Выберите центральную область Raw-изображения (20% длины и ширины каждого канала) и вычислите средние значения R, Gr, Gb и B.

<!-- Source EN PDF p.9, block 10 -->

Gr_ave = среднее Gr в ROI - Black level

<!-- Source EN PDF p.9, block 11 -->

Gb_ave = среднее Gb в ROI - Black level

<!-- Source EN PDF p.9, block 12 -->

R_ave = среднее Red в ROI - Black level

<!-- Source EN PDF p.9, block 13 -->

B_ave = среднее Blue в ROI - Black level

<!-- Source EN PDF p.9, block 14 -->

2\. Вычислите R/Gb, B/Gb и Gr/Gb.

<!-- Source EN PDF p.9, block 15 -->

`R/Gb=R_ave/Gb_ave`

<!-- Source EN PDF p.9, block 16 -->

`B/Gb=B_ave/Gb_ave`

<!-- Source EN PDF p.10, block 17 -->

`Gr/Gb=Gr_ave/Gb_ave`

<!-- Source EN PDF p.10, block 18 -->

3\. Преобразуйте R/Gb, B/Gb и Gr/Gb в 10-разрядное представление с фиксированной точкой:

`R/Gb_hex=R/Gb * 1024`

<!-- Source EN PDF p.10, block 19 -->

`B/Gb_hex=B/Gb * 1024`

<!-- Source EN PDF p.10, block 20 -->

`Gr/Gb_hex=Gr/Gb * 1024`

<!-- Source EN PDF p.10, block 21 -->

4\. Калибровка LSC

<!-- Source EN PDF p.10, block 22 -->

1\. Задайте целевое значение расчёта калибровки 70%.

<!-- Source EN PDF p.10, block 23 -->

2\. Вычислите 10-разрядный коэффициент усиления каждого из четырёх каналов.

<!-- Source EN PDF p.10, block 24 -->

### 1.2 Критерии контроля

<!-- Source EN PDF p.10, block 25 -->

1\. До калибровки LSC

<!-- Source EN PDF p.10, block 26 -->

1\. Критерий Y shading:

<!-- Source EN PDF p.10, block 27 -->

`ROI = 1/5 Width * 1/5Height`

<!-- Source EN PDF p.10, block 28 -->

`YShading_Corner = Y_Corner/Y_Center`

<!-- Source EN PDF p.10, block 29 -->

`30% < YShading_Corner < 55%`

<!-- Source EN PDF p.10, block 30 -->

`Ydiffer = YShading_Corner_Max - YShading_Corner_Min < 7%`

<!-- Source EN PDF p.10, block 31 -->

2\. Критерий Color Shading:

<!-- Source EN PDF p.10, block 32 -->

Равномерность цветового затенения отдельного модуля: контролируется различие каждого блока и центрального блока.

<!-- Source EN PDF p.10, block 33 -->

Размер ROI — 1/5\*1/5; вычисляется различие 24 блоков и центрального блока.

<!-- Source EN PDF p.10, block 34 -->

`ROI = 1/5Width * 1/5Height`

<!-- Source EN PDF p.10, block 35 -->

`|(R/G_Corner)/(R/G_Center)-1| < 15%`

<!-- Source EN PDF p.10, block 36 -->

`|(B/G_Corner)/(B/G_Center)-1| < 15%`

<!-- Source EN PDF p.10, block 37 -->

2\. Калибровка LSC

<!-- Source EN PDF p.10, block 38 -->

Для контроля асимметрии виньетирования RAW из-за положения модуля в интерфейс lsc_otp_Calibrate добавлен параметр ratio, ограничивающий результат калибровки; по умолчанию ratio=1.5.

<!-- Source EN PDF p.10, block 39 -->

Если оптический центр смещён из-за сборки самого модуля, ratio можно увеличить для повышения доли прошедших проверку модулей.

<!-- Source EN PDF p.10, block 40 -->

3\. После калибровки LSC

<!-- Source EN PDF p.10, block 41 -->

1\. Критерий Y shading:

<!-- Source EN PDF p.10, block 42 -->

`ROI = 1/5 Width * 1/5Height`

<!-- Source EN PDF p.10, block 43 -->

`YShading_Corner = Y_Corner/Y_Center`

<!-- Source EN PDF p.10, block 44 -->

`Ydiffer = YShading_Corner_Max - YShading_Corner_Min < 5%`

<!-- Source EN PDF p.10, block 45 -->

2\. Критерий Color Shading:

<!-- Source EN PDF p.10, block 46 -->

Равномерность цветового затенения отдельного модуля: контролируется различие каждого блока и центрального блока.

<!-- Source EN PDF p.10, block 47 -->

Размер ROI — 1/5\*1/5; вычисляется различие 24 блоков и центрального блока.

<!-- Source EN PDF p.10, block 48 -->

`ROI = 1/5Width * 1/5Height`

<!-- Source EN PDF p.10, block 49 -->

`|(R/G_Corner)/(R/G_Center)-1| < 5%`

<!-- Source EN PDF p.11, block 50 -->

`|(B/G_Corner)/(B/G_Center)-1| < 5%`

<!-- Source EN PDF p.12, block 51 -->

## 2. Процесс калибровки PDAF

<!-- Source EN PDF p.12, block 52 -->

Калибровка PDAF состоит из калибровки Gain Map и DCC Map. Процесс показан ниже:

<!-- Source EN PDF p.12, block 53 -->

![Технический рисунок английского исходника, p.12](/docs/rockchip-camera-otp-calibration/assets/en-p12-figure1.png)

*Технический рисунок английского исходника, PDF p.12.*

<!-- Source EN PDF p.12, block 54 -->

### 2.1 Подготовка к калибровке

<!-- Source EN PDF p.12, block 55 -->

1\. Подготовка модуля

<!-- Source EN PDF p.12, block 56 -->

(1) Проверьте загрязнение объектива.

<!-- Source EN PDF p.12, block 57 -->

(2) Проверка VCM: линейность, точность положения объектива и стабильность.

<!-- Source EN PDF p.12, block 58 -->

(3) Базовая коррекция AF:

<!-- Source EN PDF p.12, block 59 -->

Определите связь DAC и расстояния фокусировки: откалибруйте положение мотора объектива в точках Inf и Marco, запишите DAC_inf и Dac_marco, определите DCC_LENS_BEGIN и DCC_LENS_END. Предметное расстояние наилучшей резкости при среднем положении мотора является расстоянием калибровки DCC Map a.

<!-- Source EN PDF p.12, block 60 -->

Среднее положение мотора DAC = (DAC_INF + DAC_MACRO)/2; соответствующее расстояние a определяется по таблице глубины резкости. Найдите lens shift для INF и MACRO, вычислите среднее и выберите ближайшее значение lens shift в таблице: оно задаёт среднее положение мотора и предметное расстояние A. Например, бесконечности соответствует сдвиг 0; для ближайшего расстояния 10cm сдвиг равен -0.183. Средний сдвиг -0.0915 ближе всего к -0.091, поэтому расстояние калибровки DCC Map a равно 0.20m.

<!-- Source EN PDF p.13, block 61 -->

| Расстояние до объекта (m) | Смещение объектива (mm) | Дальняя граница резкости (m) | Ближняя граница резкости (m) |
|---|---|---|---|
| INF | 0.000 | - | - |
| 10.0 | -0.002 | INF | 4.33 |
| 7.6 | -0.002 | 14417.449 | 3.81 |
| 5.0 | -0.004 | 14.511 | 3.02 |
| 4.0 | -0.004 | 8.406 | 2.63 |
| 3.0 | -0.006 | 4.941 | 2.15 |
| 2.0 | -0.009 | 2.71 | 1.59 |
| 1.9 | -0.009 | 2.53 | 1.52 |
| 1.8 | -0.010 | 2.35 | 1.46 |
| 1.7 | -0.010 | 2.19 | 1.39 |
| 1.6 | -0.011 | 2.02 | 1.32 |
| 1.5 | -0.012 | 1.87 | 1.25 |
| 1.4 | -0.013 | 1.71 | 1.18 |
| 1.3 | -0.014 | 1.57 | 1.11 |
| 1.2 | -0.015 | 1.42 | 1.04 |
| 1.1 | -0.016 | 1.28 | 0.96 |
| 1.0 | -0.018 | 1.15 | 0.88 |
| 0.9 | -0.020 | 1.02 | 0.81 |
| 0.8 | -0.022 | 0.89 | 0.72 |
| 0.7 | -0.025 | 0.77 | 0.64 |
| 0.6 | -0.029 | 0.65 | 0.56 |
| 0.5 | -0.035 | 0.53 | 0.47 |
| 0.45 | -0.039 | 0.478 | 0.425 |
| 0.40 | -0.044 | 0.422 | 0.380 |
| 0.35 | -0.051 | 0.366 | 0.335 |
| 0.30 | -0.059 | 0.312 | 0.289 |
| 0.25 | -0.071 | 0.258 | 0.242 |
| 0.20 | -0.091 | 0.202 | 0.192 |
| 0.15 | -0.120 | 0.153 | 0.147 |
| 0.14 | -0.129 | 0.142 | 0.138 |
| 0.13 | -0.140 | 0.132 | 0.128 |
| 0.12 | -0.152 | 0.122 | 0.118 |
| 0.11 | -0.166 | 0.111 | 0.109 |
| 0.10 | -0.183 | 0.101 | 0.099 |
| 0.09 | -0.205 | 0.091 | 0.089 |
| 0.08 | -0.232 | 0.081 | 0.079 |
| 0.07 | -0.267 | 0.071 | 0.069 |
| 0.06 | -0.315 | 0.060 | 0.060 |
| 0.05 | -0.383 | 0.050 | 0.050 |

<!-- Source EN PDF p.15, block 63 -->

| Пункт | Подробности | Примечание |
|---|---|---|
| Тестовая мишень | Определяется поставщиком | Рекомендуются шахматные, ромбические и другие мишени с высоким контрастом и умеренной пространственной частотой. |
| Освещённость поверхности мишени | Более 400Lux | Изображение не должно мерцать |
| Расстояние между модулем и мишенью | INF:2~5m; Marco:10-20cm (подробнее см. таблицу глубины резкости; написание Marco сохранено) | Для расстояния INF дальнее положение фокусировки моделируется телеконвертером. |
| Ориентация модуля при коррекции | При коррекции INF/MACRO оптическая ось модуля горизонтальна. | Для VCM без обратной связи коррекция выполняется только горизонтально; для VCM с обратной связью допускается направление оптической оси вверх. Направление коррекции Inf/Macro должно совпадать. |
| Настройки усиления | Как для AWB | Цифровое усиление фиксировано на 1; аналоговое усиление: для традиционного PD или 2x1OCL — 1x, для PD типа Dual-photodiode — 2x. |
| Настройки сенсора | Отключите mirror/flip/OB/устранение дефектных пикселей и аналогичные функции сенсора. |  |
| Требования к яркости изображения | Как для AWB | При полном размере средняя яркость верхних 10% значений канала G в центральной ROI размером 1/32W*1/32H составляет 800LSB (raw10); для канала G dual pd среднее значение — 700LSB (raw10). |
| Число образцов для проверки ошибок | Проверка диапазона: каждый модуль следует точно проверить; более 10pcs (формулировка исходника). | При неудачной проверке измените метод коррекции для повышения точности дальнего и ближнего фокуса AF. |

<!-- Source EN PDF p.15, block 64 -->

(4) Если модуль поддерживает OIS, завершите коррекцию дрожания до калибровки lsc и pdaf. Переместите мотор в опорную позицию XY и проверьте настройку OIS. На этом этапе получают плоские поля для индексирования LSC и PDAF.

<!-- Source EN PDF p.15, block 65 -->

(5) Завершите коррекцию чёрного уровня и LSC; при необходимости скорректируйте кривизну поля.

<!-- Source EN PDF p.15, block 66 -->

2\. Настройки AE модуля

<!-- Source EN PDF p.15, block 67 -->

(1) Цифровое усиление фиксируется на 1; для обычного PD или 2x1OCL аналоговое усиление again задаётся 1x; Для PD типа Dual-photodiode аналоговое усиление again задаётся 2x для предотвращения растекания заряда пикселей.

<!-- Source EN PDF p.15, block 68 -->

<!-- Source EN PDF p.15, block 69 -->

(2) Экспозиция: чтобы избежать растекания заряда dual-pd и пересвета обычных пикселей (regular_pixel=dual_pd_l+dual_pd_r), установите яркость G в центре полноразмерного изображения 700 (raw10). Для OCL и metal-shield обеспечьте 800 (raw10). Рекомендуется экспозиция, кратная 10ms, для исключения помех частоты электросети.

<!-- Source EN PDF p.16, block 70 -->

### 2.2 Калибровка Gain Map

<!-- Source EN PDF p.16, block 71 -->

1\. Освещение и оборудование

<!-- Source EN PDF p.16, block 72 -->

D50 (5000K±100K); исключите постороннее освещение.

<!-- Source EN PDF p.16, block 73 -->

Рассеиватель или короб DNP с указанным освещением; интегрирующая сфера.

<!-- Source EN PDF p.16, block 74 -->

2\. Способ съёмки

<!-- Source EN PDF p.16, block 75 -->

![Технический рисунок английского исходника, p.16](/docs/rockchip-camera-otp-calibration/assets/en-p16-figure1.png)

*Технический рисунок английского исходника, PDF p.16.*

<!-- Source EN PDF p.16, block 76 -->

1. Установите модуль перед равномерным плоским источником света, параллельно его поверхности. Например, в исходном опыте использована интегрирующая сфера с яркостью панели 6.6. Перед объективом установите рассеиватель, чтобы источник заполнял кадр.
2. Для metal-shield и 2x1OCL установите again и dgain = 1x; для dual-pd — again = 2x, dgain = 1x; экспозиция кратна 10.
3. Отключите mirro/flip/OB и аналогичные настройки сенсора.
4. В полноразмерном изображении средняя яркость TOP 10% канала G в центральном ROI 1/32W*1/32H равна 800LSB (raw10) или 200LSB (raw8); для dual pd — 700LSB (raw10) или 175LSB (raw8).
5. Прогрейте камеру 3 минуты, установите мотор в среднее положение и последовательно снимите 3 RAW. Проверьте число дефектных пикселей; при превышении предела уменьшите яркость и переснимите. После успешной проверки получите усреднённые данные изображения.

<!-- Source EN PDF p.16, block 77 -->

3\. Калибровка

<!-- Source EN PDF p.16, block 78 -->

Вызов pdaf_gainmap_calibration(...) создаёт данные gainmap и возвращает размер gainmap_width\*gainmap_height\*2 байт, включая левую и правую gainmap.

<!-- Source EN PDF p.16, block 79 -->

4\. Проверка

<!-- Source EN PDF p.16, block 80 -->

1\. В условиях шага 2 снимите тестовое изображение и передайте его вместе с откалиброванной gainmap в pdaf_gainmap_vertification(...). Возврат 1 означает успешную проверку и пригодность gainmap. Возврат -1 указывает на возможное превышение допустимого числа дефектных пикселей: уменьшите яркость и переснимите.

<!-- Source EN PDF p.16, block 81 -->

2\. Критерий проверки

<!-- Source EN PDF p.16, block 82 -->

Проверка успешна, если различие левых и правых PD-пикселей после коррекции gainmap меньше 5%.

<!-- Source EN PDF p.17, block 83 -->

### 2.3 Калибровка DCC Map

<!-- Source EN PDF p.17, block 84 -->

DCC (коэффициент преобразования расфокусировки) описывает связь положения мотора и различия левого/правого изображения. Разделите изображение на области, перемещайте мотор равными шагами, вычисляйте pd в разных положениях и получите DCC каждой области линейной регрессией — DCCMAP.

![Формула исходника, PDF p.17](/docs/rockchip-camera-otp-calibration/assets/en-p17-formula1.png)

`DCC = Δlensposition[dac]/Δphasedisparity[pixel]`

<!-- Source EN PDF p.17, block 85 -->

![Технический рисунок английского исходника, p.17](/docs/rockchip-camera-otp-calibration/assets/en-p17-figure1.png)

*Технический рисунок английского исходника, PDF p.17.*

<!-- Source EN PDF p.17, block 86 -->

[Необязательно]

<!-- Source EN PDF p.17, block 87 -->

Для некоторых модулей требуется калибровка PD_OFFSET. Например, при положении DAC_0 получают размытое изображение, а положение резкого фокуса вычисляется как DAC = DAC_0 + PD \* DCC + PD_OFFSET \* DCC.

<!-- Source EN PDF p.17, block 88 -->

1\. Освещение и оборудование

<!-- Source EN PDF p.17, block 89 -->

D50 (5000K±100K); исключите посторонний свет.

<!-- Source EN PDF p.17, block 90 -->

Рассеиватель или короб DNP с указанным освещением, интегрирующая сфера, чёрно-белая тестовая мишень.

<!-- Source EN PDF p.17, block 91 -->

Мишень изготавливается из специальной полупрозрачной плёнки с равномерными чёрно-белыми полосами или ромбической сеткой.

<!-- Source EN PDF p.17, block 92 -->

![Технический рисунок английского исходника, p.17](/docs/rockchip-camera-otp-calibration/assets/en-p17-figure2.png)

*Технический рисунок английского исходника, PDF p.17.*

<!-- Source EN PDF p.18, block 93 -->

![Технический рисунок английского исходника, p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-figure2.png)

*Технический рисунок английского исходника, PDF p.18.*

<!-- Source EN PDF p.18, block 94 -->

![Технический рисунок английского исходника, p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-figure1.png)

*Технический рисунок английского исходника, PDF p.18.*

<!-- Source EN PDF p.18, block 95 -->

Расстояние a определяется на этапе базовой коррекции AF 2.1.1.

<!-- Source EN PDF p.18, block 96 -->

Ширина мишени зависит от горизонтального FOV объектива и расстояния a; рекомендуется:

![Формула исходника, PDF p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-formula1.png)

`S >= a * tan(FOV * pi/360) * 2/0.9`

<!-- Source EN PDF p.18, block 97 -->

Расстояние калибровки определяется на этапе базовой коррекции AF 2.1.1.

<!-- Source EN PDF p.18, block 98 -->

Ширина мишени зависит от горизонтального FOV объектива и расстояния a; рекомендуется:

![Формула исходника, PDF p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-formula2.png)

`λ[mm] = (u[um]/1000) * raw_width/(6 * dccmap_width)`

![Формула исходника, PDF p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-formula3.png)

`W[mm] = (a[mm] - f[mm])/f[mm] * λ[mm]`

<!-- Source EN PDF p.18, block 99 -->

Для IMX258 рекомендуется коэффициент λ = 0.11, для S5KJN1 — 0.088~0.099.

<!-- Source EN PDF p.18, block 100 -->

Для DCC необходимо правильно изготовить и разместить мишень. Неправильная ширина полос, поворот или деформация, слишком низкая яркость и пересвет вызывают отказ калибровки. Примеры ошибок показаны ниже.

<!-- Source EN PDF p.18, block 101 -->

![Технический рисунок английского исходника, p.18](/docs/rockchip-camera-otp-calibration/assets/en-p18-figure3.png)

*Технический рисунок английского исходника, PDF p.18.*

<!-- Source EN PDF p.18, block 102 -->

2\. Способ съёмки

<!-- Source EN PDF p.19, block 103 -->

1. Поместите полосатую плёнку перед интегрирующей сферой, а модуль — перед мишенью примерно в средней точке фокусировки; расстояние задаётся базовой коррекцией AF 2.1.1. Торец параллелен мишени; исключите её поворот, наклон и скручивание, рисунок должен заполнять кадр.
2. Для metal-shield и 2x1OCL again и dgain = 1x; для dual-pd again = 2x, dgain = 1x.
3. Отключите mirro/flip/OB/удаление дефектных пикселей в сенсоре.
4. Экспозиция: средний G белого блока в центральном ROI 1/32w*1/32h должен быть 800LSB (raw10) или 200LSB (raw8), для dual pd — 700LSB (raw10) или 175LSB (raw8). Недостаточная яркость и пересвет ухудшают точность DCC. Для metal-shield также исключите пересвет незакрытых пикселей.
5. Перемещайте мотор от DCC_LENS_BEGIN до DCC_LENS_END с шагом DCC_LENS_INTERVAL. После стабилизации снимайте 3 RAW и усредняйте данные каждой позиции. В примере исходника диапазон 0–64 с шагом 8 даёт 9 позиций и 27 изображений.

<!-- Source EN PDF p.19, block 104 -->

3\. Калибровка

<!-- Source EN PDF p.19, block 105 -->

Передайте gainmap, параметры положения мотора и усреднённые изображения каждой позиции, полученные в разделе 2.1, в pdaf_dccmap_calibration(...) для получения данных dccmap и их размера.

<!-- Source EN PDF p.19, block 106 -->

<!-- Source EN PDF p.19, block 107 -->

Размер равен dccmap_width\*dccmap_height\*2 байт. Далее исходник указывает: при выборе калибровки PD_OFFSET размер значения одновременно составляет 2bytes DCC_RSQ_THRESHOLD; фраза неполна и сохранена для проверки. Если число блоков, не удовлетворяющих порогу линейности, превышает заданное количество, калибровка не проходит. Проверьте входные данные, скорректируйте условия и переснимите.

<!-- Source EN PDF p.19, block 108 -->

4\. Проверка

<!-- Source EN PDF p.19, block 109 -->

На этом этапе проверяется правильность текущей dccmap; процесс показан ниже:

<!-- Source EN PDF p.19, block 110 -->

![Технический рисунок английского исходника, p.19](/docs/rockchip-camera-otp-calibration/assets/en-p19-figure1.png)

*Технический рисунок английского исходника, PDF p.19.*

<!-- Source EN PDF p.19, block 111 -->

1\. Условия съёмки совпадают с калибровкой DCCmap; объектив параллелен мишени, её рисунок заполняет кадр.

<!-- Source EN PDF p.19, block 112 -->

2\. Прогрейте камеру 3 минуты и переместите мотор в положение расфокусировки DAC0.

![Формула исходника, PDF p.19](/docs/rockchip-camera-otp-calibration/assets/en-p19-formula1.png)

`DAC0 ∈ (DACinf + 0.2 * abs(DACinf - DACmacro), DACinf + 0.8 * abs(DACinf - DACmacro)]`

<!-- Source EN PDF p.20, block 113 -->

После стабилизации снимите три Raw и усредните их. Передайте DAC0, усреднённое изображение, gainmap и dccmap в pdaf_dccmap_vertification(), чтобы вычислить идеальное резкое положение DAC1.

<!-- Source EN PDF p.20, block 114 -->

3\. Переместите мотор в DAC1 и снимите пять изображений в диапазоне tolerance_factor\*abs(DACinf-DACmacro)+Δ (например Δ=2) по обе стороны. tolerance_factor задаёт допуск проверки; для разных сенсоров он может составлять 5%, 10% или 20%.

<!-- Source EN PDF p.20, block 115 -->

При проверке мотор движется от позиции 1 к позиции 5. Пять позиций для tolerance_factor=10%, Δ=2:

<!-- Source EN PDF p.20, block 116 -->

4.

| Номер | Положение |
|---|---|
| 1 | DAC1-10% *abs(DACinf-DACmacro)-Δ |
| 2 | DAC1-10% *abs(DACinf-DACmacro) |
| 3 | DAC1 |
| 4 | DAC1+10% *abs(DACinf-DACmacro) |
| 5 | DAC1+10% *abs(DACinf-DACmacro)+Δ |

<!-- Source EN PDF p.20, block 118 -->

5\. Передайте пять изображений в pdaf_calc_sharpness(...), вычислите резкость центральной области DCC_PERCENT_ROI_W\*DCC_PERCENT_ROI_H (например 30%\*30%) и проверьте наличие пика. При наличии пика проверка успешна. Иначе увеличьте tolerance_factor и Δ (например с 2 до 5), снова снимите 5 изображений и повторите шаг 4. Для расчёта резкости предпочтителен канал с меньшим числом PD-пикселей.

<!-- Source EN PDF p.20, block 119 -->

![Технический рисунок английского исходника, p.20](/docs/rockchip-camera-otp-calibration/assets/en-p20-figure1.png)

*Технический рисунок английского исходника, PDF p.20.*

<!-- Source EN PDF p.21, block 120 -->

## 3. Интерфейсы калибровки

<!-- Source EN PDF p.21, block 121 -->

Калибруемые модули: AWB (автоматический баланс белого), LSC (коррекция затенения объектива), PDAF (фазовый автофокус).

<!-- Source EN PDF p.21, block 122 -->

### 3.1 Калибровка AWB

<!-- Source EN PDF p.21, block 123 -->

【Назначение】

<!-- Source EN PDF p.21, block 124 -->

Функция вычисляет R/G, B/G и Gr/Gb в ROI raw-изображения.

<!-- Source EN PDF p.21, block 125 -->

【Прототип функции】

<!-- Source EN PDF p.21, block 126 -->

```text
bool awb_otp_Calibrate(uint16_t* RawAddr, int width, int height, int roiw,
                       int roih, int bits, int bayer, int blc_r, int blc_gr,
                       int blc_gb, int blc_b, uint16_t* R, uint16_t* Gr,
                       uint16_t*Gb, uint16_t* B, uint16_t* R_G, uint16_t* B_G,
                       uint16_t* Gr_Gb)
```

<!-- Source EN PDF p.21, block 127 -->

【Входные данные】

<!-- Source EN PDF p.21, block 128 -->

| Имя параметра | Описание |
|---|---|
| RawAddr | Данные raw-изображения, снятого текущим модулем на производственной линии |
| width | Ширина raw-изображения |
| height | Высота raw-изображения |
| bits | Число бит на пиксель. 10bit=10 |
| roiw | Обратная величина отношения ширины ROI к ширине изображения |
| roih | Обратная величина отношения высоты ROI к высоте изображения |
| bayer | Порядок Bayer для raw-изображений. BGGR=0, GBRG=1, GRBG=2, RGGB=3 |
| blc_r | BLC канала R |
| blc_gr | BLC канала Gr |
| blc_gb | BLC канала Gb |
| blc_b | BLC канала B |

<!-- Source EN PDF p.21, block 129 -->

【Выходные данные】

<!-- Source EN PDF p.22, block 130 -->

| Имя параметра | Описание |
|---|---|
| R | Среднее канала R в ROI |
| Gr | Среднее канала Gr в ROI |
| Gb | Среднее канала Gb в ROI |
| B | Среднее канала B в ROI |
| R_G | Отношение среднего канала R к среднему Gb в ROI *1024 |
| B_G | Отношение среднего канала B к среднему Gb в ROI *1024 |
| Gr_Gb | Отношение среднего канала Gr к среднему Gb в ROI *1024 |

<!-- Source EN PDF p.22, block 131 -->

【Возвращаемое значение】

<!-- Source EN PDF p.22, block 132 -->

=0：Неверные параметры

<!-- Source EN PDF p.22, block 133 -->

=1：Калибровка успешна

<!-- Source EN PDF p.22, block 134 -->

### 3.2 Калибровка LSC

<!-- Source EN PDF p.22, block 135 -->

#### 3.2.1 Калибровка LSC

<!-- Source EN PDF p.22, block 136 -->

【Назначение】

<!-- Source EN PDF p.22, block 137 -->

Функция вычисляет усиление каждого канала raw-изображения.

<!-- Source EN PDF p.22, block 138 -->

【Прототип функции】

<!-- Source EN PDF p.22, block 139 -->

```text
bool lsc_otp_Calibrate(int vig,uint16_t* RawAddr, int width, int height,
                       int bits, int bayer, int blc_r, int blc_gr,
                       int blc_gb, int blc_b, float ratio, uint16_t* lsc_otp)
```

<!-- Source EN PDF p.22, block 140 -->

【Входные данные】

<!-- Source EN PDF p.23, block 141 -->

| Имя параметра | Описание |
|---|---|
| vig | Сила коррекции LSC, по умолчанию vig=70 (%) |
| RawAddr | Данные raw-изображения, снятого текущим модулем на производственной линии |
| width | Ширина raw-изображения |
| height | Высота raw-изображения |
| bits | Число бит на пиксель. 10bit=10 |
| bayer | Порядок Bayer для raw-изображений. BGGR=0, GBRG=1, GRBG=2, RGGB=3 |
| blc_r | BLC канала R |
| blc_gr | BLC канала Gr |
| blc_gb | BLC канала Gb |
| blc_b | BLC канала B |
| ratio | Порог оценки симметричности виньетирования по краям; рекомендуется ratio=1.5 |

<!-- Source EN PDF p.23, block 142 -->

【Выходные данные】

<!-- Source EN PDF p.23, block 143 -->

| Имя параметра | Описание |
|---|---|
| lsc_otp | Усиление LSC: по 17 * 17 для каналов R, Gr, Gb и B |

<!-- Source EN PDF p.23, block 144 -->

【Возвращаемое значение】

<!-- Source EN PDF p.23, block 145 -->

=0: данные калибровки LSC и виньетирование ненормальны.

<!-- Source EN PDF p.23, block 146 -->

=1：Калибровка успешна

<!-- Source EN PDF p.23, block 147 -->

#### 3.2.2 Проверка LSC

<!-- Source EN PDF p.23, block 148 -->

【Назначение】

<!-- Source EN PDF p.23, block 149 -->

Функция проверяет результат калибровки LSC.

<!-- Source EN PDF p.23, block 150 -->

【Прототип функции】

<!-- Source EN PDF p.24, block 151 -->

```text
bool lsc_otp_verify(uint16_t *RawAddr, int width, int height, int bits,
                    int bayer, int blc_r, int blc_gr, int blc_gb,
                    int blc_b, uint16_t *lsc_otp, int Ydiffer_down,
                    int Ydiffer_up, int ColorShading_down,
                    int ColorShading_up, float *fYdiffer,
                    float *fRGCorner,float *fBGCorner)
```

<!-- Source EN PDF p.24, block 152 -->

【Входные данные】

<!-- Source EN PDF p.24, block 153 -->

| Имя параметра | Описание |
|---|---|
| RawAddr | Данные raw-изображения, снятого текущим модулем на производственной линии |
| width | Ширина raw-изображения |
| height | Высота raw-изображения |
| bits | Число бит на пиксель. 10bit=10 |
| bayer | Порядок Bayer для raw-изображений. BGGR=0, GBRG=1, GRBG=2, RGGB=3 |
| blc_r | BLC канала R |
| blc_gr | BLC канала Gr |
| blc_gb | BLC канала Gb |
| blc_b | BLC канала B |
| lsc_otp | Выход lsc_otp, вычисленный lsc_otp_Calibrate |
| Ydiffer_down | Нижняя граница контрольного показателя калибровки YShading_Corner_Max - YShading_Corner_Min, в процентах |
| Ydiffer_up | Верхняя граница контрольного показателя калибровки YShading_Corner_Max - YShading_Corner_Min, в процентах |
| ColorShading_down | Нижняя граница контрольных показателей abs((R/G_Corner)/(R/G_Center)-1), abs((B/G_Corner)/(B/G_Center)-1), в процентах |
| ColorShading_up | Верхняя граница контрольных показателей abs((R/G_Corner)/(R/G_Center)-1), abs((B/G_Corner)/(B/G_Center)-1), в процентах |

<!-- Source EN PDF p.24, block 154 -->

【Выходные данные】

<!-- Source EN PDF p.25, block 155 -->

| Имя параметра | Описание |
|---|---|
| fYdiffer | Значение YShading_Corner_Max - YShading_Corner_Min |
| fRGCorner | Значение abs((R/G_Corner)/(R/G_Center)-1) для каждого блока, всего 5 x 5 блоков |
| fBGCorner | Значение abs((B/G_Corner)/(B/G_Center)-1) для каждого блока, всего 5 x 5 блоков |

<!-- Source EN PDF p.25, block 156 -->

【Возвращаемое значение】

<!-- Source EN PDF p.25, block 157 -->

=0: контрольные показатели после калибровки не соблюдены; проверка не пройдена.

<!-- Source EN PDF p.25, block 158 -->

=1：Проверка успешна

<!-- Source EN PDF p.26, block 159 -->

### 3.3 Калибровка PDAF

<!-- Source EN PDF p.26, block 160 -->

#### 3.3.1 Получение конфигурации сенсора

<!-- Source EN PDF p.26, block 161 -->

【Назначение】

<!-- Source EN PDF p.26, block 162 -->

Настройте sensor.ini и получите из него сведения о PD-сенсоре.

<!-- Source EN PDF p.26, block 163 -->

【Содержимое конфигурации】

<!-- Source EN PDF p.26, block 164 -->

[sensor config]

<!-- Source EN PDF p.27, block 165 -->

| Ключевое слово | Описание |
|---|---|
| RAW_WIDTH | Ширина raw-изображения |
| RAW_HEIGHT | Высота raw-изображения |
| RAW_BITS | Разрядность значения пикселя |
| RAW_BLACK_LEVEL | Значение чёрного уровня |
| RAW_BAYER_PATTERN | Порядок Bayer raw-изображения. 0:BGGR, 1:GBRG, 2:GRBG, 3:RGGB |
| SENSOR_TYPE | 0: shieldPD или 1x2OCL; 1: горизонтальный и вертикальный (LR&TB); 2: резерв; 3: резерв |
| PD_DUAL_MODE | 0: не dual; 1: dual PD |
| PD_BINNING_TYPE | Калибровка с binning PD: 0:OFF, 1:ON |
| MIPI_MIX_MODE | 0: данные содержат только raw или PD; 1: содержат и raw, и PD. Действует только при PD_DUAL_MODE=1. |
| PD_OFFSET_X | Смещение блока PD по x |
| PD_OFFSET_Y | Смещение блока PD по y |
| PD_PITCH_X | Шаг блока PD по x |
| PD_PITCH_Y | Шаг блока PD по y |
| PD_DENSITY_X | Интервал пары пикселей L/R PD по x |
| PD_DENSITY_Y | Интервал пары пикселей L/R PD по y |
| PD_BLOCK_NUM_X | Общее число блоков PD по x |
| PD_BLOCK_NUM_Y | Общее число блоков PD по y |
| CALB_S_LEVEL | Уровень насыщения, по умолчанию 100 |
| CALB_S_CNT | Число насыщенных отсчётов, по умолчанию 10 |
| PD_POS_L | Положение пикселя L PD внутри блока PD |
| PD_POS_R | Положение пикселя R PD внутри блока PD |

<!-- Source EN PDF p.27, block 166 -->

Тип dual

<!-- Source EN PDF p.27, block 167 -->

[sensor config]

<!-- Source EN PDF p.28, block 168 -->

| Ключевое слово | Описание |
|---|---|
| RAW_WIDTH | Ширина raw-изображения |
| RAW_HEIGHT | Высота raw-изображения |
| LR_WIDTH | Ширина PD-изображения |
| LR_HEIGHT | Высота PD-изображения |
| RAW_BITS | Разрядность значения пикселя |
| RAW_BLACK_LEVEL | Значение чёрного уровня |
| RAW_BAYER_PATTERN | Порядок Bayer raw-изображения. 0:BGGR, 1:GBRG, 2:GRBG, 3:RGGB |
| SENSOR_TYPE | 0: shieldPD или 1x2OCL; 1: горизонтальный и вертикальный (LR&TB); 2: резерв; 3: резерв |
| PD_DUAL_MODE | 0: не dual; 1: dual PD |
| PD_BINNING_TYPE | Калибровка с binning PD: 0:OFF, 1:ON |
| MIPI_MIX_MODE | 0: данные содержат только raw или PD; 1: содержат и raw, и PD. Действует только при PD_DUAL_MODE=1. |
| PD_OFFSET_X | Смещение блока PD по x |
| PD_OFFSET_Y | Смещение блока PD по y |
| PD_PITCH_X | Шаг блока PD по x |
| PD_PITCH_Y | Шаг блока PD по y |
| PD_DENSITY_X | Интервал пары пикселей L/R PD по x |
| PD_DENSITY_Y | Интервал пары пикселей L/R PD по y |
| PD_BLOCK_NUM_X | Общее число блоков PD по x |
| PD_BLOCK_NUM_Y | Общее число блоков PD по y |
| CALB_S_LEVEL | Уровень насыщения, по умолчанию 100 |
| CALB_S_CNT | Число насыщенных отсчётов, по умолчанию 10 |
| PD_POS_L | Положение пикселя L PD внутри блока PD |
| PD_POS_R | Положение пикселя R PD внутри блока PD |

<!-- Source EN PDF p.28, block 169 -->

[Gainmap_Calib]

<!-- Source EN PDF p.29, block 170 -->

| Ключевое слово | Описание |
|---|---|
| GAINMAP_BLKSZ_W | Ширина блока gainmap |
| GAINMAP_BLKSZ_H | Высота блока gainmap |
| GAIN_CALIB_INPUT_MAX | Максимальный уровень входного raw: 920(raw10) |
| GAIN_CALIB_INPUT_MIN | Минимальный уровень входного raw: 800(raw10) |
| GAIN_VERIFY_DIFF_MAX | Уровень различия L/R после усиления (5%*1024) |
| CROSS_VER | Проверка gainmap на других изображениях |

<!-- Source EN PDF p.29, block 171 -->

[DCCmap_Calib]

<!-- Source EN PDF p.29, block 172 -->

| Ключевое слово | Описание |
|---|---|
| DCCMAP_BLKSZ_W | Ширина блока dccmap |
| DCCMAP_BLKSZ_H | Высота блока dccmap |
| DCC_CALIBRATE_MODE | Режим калибровки DCC, по умолчанию 1 |
| DCC_LENS_BEGIN | Начальное положение кода при выборке |
| DCC_LENS_END | Конечное положение кода при выборке |
| DCC_LENS_INTERVAL | Интервал выборки кодов |
| DCC_RSQ_THRESHOLD | Порог матрицы RSQ |
| DCC_BORDER_RSQ_THRESHOLD | Порог граничной матрицы RSQ |
| DCC_BAD_RSQ_NUM_RATIO | Доля неудовлетворительных матриц RSQ |
| DCC_CALIB_INPUT_MAX | Максимальный уровень входного raw: 640(raw10) или 160(raw8) |
| DCC_CALIB_INPUT_MIN | Минимальный уровень входного raw: 340(raw10) или 85(raw8) |
| DCC_CALIB_PD_RANGE | Радиус поиска пиксельного диспаритета |
| DCC_VERIFY_CAF_DIFF_MAX | Порог диапазона DAC (%) |
| DCC_VERIFY_CAF_DIFF_DET | Величина delta(DAC) для диапазона DAC |
| CALIB_TARGET_PEAK_OFFSET_LOG | Сохранение сведений о пике FV в PDAFFVLog.txt: 1:ON, 0:OFF |
| CALIB_TARGET_PEAK_OFFSET | Целевое смещение PD в критерии пика FV, по умолчанию 0 |
| DCC_PERCENT_ROI_W | Ширина ROI тестового изображения |
| DCC_PERCENT_ROI_H | Высота ROI тестового изображения |
| DCC_SHARPNESS_MODE | Режим расчёта резкости, по умолчанию 1 |
| DCC_SHARPNESS_CHL | Канал расчёта резкости: 0:origin raw; 1:red; 2:green (по умолчанию); 3:blue; 4:demosaic |

<!-- Source EN PDF p.30, block 173 -->

[optional params]

<!-- Source EN PDF p.30, block 174 -->

| Ключевое слово | Описание |
|---|---|
| QUALITY_VERIFY_ENABLE | Включение проверки качества калибровки gainmap |
| QUALTI_LRDiff_L_MIN | Критерий различия L/R (block1,2,3) |
| QUALTI_LRDiff_L_MAX | Критерий различия L/R (block1,2,3) |
| QUALTI_LRDiff_C_MIN | Критерий различия L/R (block4,5,6) |
| QUALTI_LRDiff_C_MAX | Критерий различия L/R (block4,5,6) |
| QUALTI_LRDiff_R_MIN | Критерий различия L/R (block7,8,9) |
| QUALTI_LRDiff_R_MAX | Критерий различия L/R (block7,8,9) |
| QUALITY_SENSITIVITY_MIN | Критерий чувствительности |

<!-- Source EN PDF p.30, block 175 -->

【Пример】

<!-- Source EN PDF p.30, block 176 -->

Пример распределения PD-пикселей IMX258 показан ниже:

<!-- Source EN PDF p.30, block 177 -->

![Технический рисунок английского исходника, p.30](/docs/rockchip-camera-otp-calibration/assets/en-p30-figure1.png)

*Технический рисунок английского исходника, PDF p.30.*

<!-- Source EN PDF p.30, block 178 -->

Согласно рисунку содержимое sensor.ini следующее:

<!-- Source EN PDF p.30, block 179 -->

```text
[sensor config]
RAW_WIDTH =4208
RAW_HEIGHT =3120
RAW_BITS =12
RAW_BLACK_LEVEL =64
RAW_BAYER_PATTERN =0
SENSOR_TYPE=0
PD_DUAL_MODE=0
PD_BINNING_TYPE=0
PD_OFFSET_X =24
PD_OFFSET_Y =24
PD_PITCH_X =32
PD_PITCH_Y =32
PD_DENSITY_X =16
PD_DENSITY_Y =16
PD_BLOCK_NUM_X =130
PD_BLOCK_NUM_Y =96
CALB_S_LEVEL=1000
CALB_S_CNT=10
PD_POS_L=
[26 29]
[42 29]
[33 48]
[49 48]; #end with a ";"
PD_POS_R=
[25 32]
[41 32]
[34 45]
[50 45]; #end with a ";"
[Gainmap_Calib]
GAINMAP_BLKSZ_W=16
GAINMAP_BLKSZ_H=16
GAIN_CALIB_INPUT_MAX=920
GAIN_CALIB_INPUT_MIN=800
GAIN_VERIFY_DIFF_MAX=5
CROSS_VER=1
[DCCmap_Calib]
DCCMAP_BLKSZ_W=32
DCCMAP_BLKSZ_H=32
DCC_CALIBRATE_MODE=1
DCC_LENS_BEGIN=0
DCC_LENS_END=64
DCC_LENS_INTERVAL=8
DCC_RSQ_THRESHOLD=0.985
DCC_BORDER_RSQ_THRESHOLD=0.97
DCC_BAD_RSQ_NUM_RATIO=0.05
DCC_CALIB_INPUT_MAX=640
DCC_CALIB_INPUT_MIN=340
DCC_VERIFY_CAF_DIFF_MAX=10
DCC_VERIFY_CAF_DIFF_DET=2
CALIB_TARGET_PEAK_OFFSET_LOG=0
CALIB_TARGET_PEAK_OFFSET=0
DCC_PERCENT_ROI_W=0.4
DCC_PERCENT_ROI_H=0.4
DCC_SHARPNESS_MODE=1
DCC_SHARPNESS_CHL=1
[optional params]
QUALITY_VERIFY_ENABLE=1
QUALTI_LRDiff_L_MIN=0.4
QUALTI_LRDiff_L_MAX=2.5
QUALTI_LRDiff_C_MIN=0.55
QUALTI_LRDiff_C_MAX=1.8
QUALTI_LRDiff_R_MIN=0.4
QUALTI_LRDiff_R_MAX=2.5
QUALITY_SENSITIVITY_MIN=0.45
```

<!-- Source EN PDF p.32, block 183 -->

【Прототип функции】

<!-- Source EN PDF p.32, block 184 -->

```text
bool pdaf_initial(char* filename, sensor_cfg* psensor_cfg)
```

<!-- Source EN PDF p.32, block 185 -->

【Входные данные】

<!-- Source EN PDF p.32, block 186 -->

| Имя параметра | Описание |
|---|---|
| filename | Полный путь к файлу sensor.ini |

<!-- Source EN PDF p.32, block 187 -->

【Выходные данные】

<!-- Source EN PDF p.32, block 188 -->

| Имя параметра | Описание |
|---|---|
| psensor_cfg | Указатель на структуру с содержимым sensor.ini |

<!-- Source EN PDF p.32, block 189 -->

【Возвращаемое значение】

<!-- Source EN PDF p.32, block 190 -->

=0: не удалось получить sensor.ini.

<!-- Source EN PDF p.32, block 191 -->

=1: sensor.ini успешно получен.

<!-- Source EN PDF p.32, block 192 -->

#### 3.3.2 Калибровка Gain Map

<!-- Source EN PDF p.32, block 193 -->

【Назначение】

<!-- Source EN PDF p.32, block 194 -->

Функция предназначена для калибровки gain map PDAF.

<!-- Source EN PDF p.32, block 195 -->

【Прототип функции】

<!-- Source EN PDF p.32, block 196 -->

```text
bool pdaf_gainmap_calibration(uint16_t *RawAddr, sensor_cfg* psensor_cfg,
                              uint16_t *gainmap_lut,int* gainmap_width,
                              int* gainmap_height)
```

<!-- Source EN PDF p.32, block 197 -->

【Входные данные】

<!-- Source EN PDF p.32, block 198 -->

| Имя параметра | Описание |
|---|---|
| RawAddr | Данные raw-изображения, снятого текущим модулем на производственной линии |
| psensor_cfg | Указатель на структуру с содержимым sensor.ini |

<!-- Source EN PDF p.32, block 199 -->

【Выходные данные】

<!-- Source EN PDF p.33, block 200 -->

| Имя параметра | Описание |
|---|---|
| gainmap_lut | Калиброванная карта усиления |
| gainmap_width | Ширина полученной карты усиления |
| gainmap_height | Высота карты усиления, полученной калибровкой |

<!-- Source EN PDF p.33, block 201 -->

【Возвращаемое значение】

<!-- Source EN PDF p.33, block 202 -->

=0：Неверные параметры

<!-- Source EN PDF p.33, block 203 -->

=1：Калибровка успешна

<!-- Source EN PDF p.33, block 204 -->

#### 3.3.3 Проверка Gain Map

<!-- Source EN PDF p.33, block 205 -->

【Назначение】

<!-- Source EN PDF p.33, block 206 -->

Функция проверяет соответствие откалиброванной gain map требованиям.

<!-- Source EN PDF p.33, block 207 -->

【Прототип функции】

<!-- Source EN PDF p.33, block 208 -->

```text
bool pdaf_gainmap_vertification(uint16_t *RawAddr, sensor_cfg* psensor_cfg,
                                uint16_t *gainmap_lut)
```

<!-- Source EN PDF p.33, block 209 -->

【Входные данные】

<!-- Source EN PDF p.33, block 210 -->

| Имя параметра | Описание |
|---|---|
| RawAddr | Данные raw-изображения, снятого текущим модулем на производственной линии |
| psensor_cfg | Указатель на структуру с содержимым sensor.ini |
| gainmap_lut | Карта усиления, полученная pdaf_gainmap_calibration |

<!-- Source EN PDF p.33, block 211 -->

【Возвращаемое значение】

<!-- Source EN PDF p.33, block 212 -->

=0: проверка не пройдена; используемая gainmap не соответствует требованиям.

<!-- Source EN PDF p.33, block 213 -->

=1：Проверка успешна

<!-- Source EN PDF p.33, block 214 -->

#### 3.3.4 Калибровка DCC Map

<!-- Source EN PDF p.33, block 215 -->

【Назначение】

<!-- Source EN PDF p.33, block 216 -->

Функция выполняет калибровку DCC MAP PDAF.

<!-- Source EN PDF p.33, block 217 -->

【Прототип функции】

<!-- Source EN PDF p.33, block 218 -->

```text
bool pdaf_dccmap_calibration(uint16_t *RawAddrAll , sensor_cfg* psensor_cfg,
                             uint16_t *gainmap_lut, uint16_t *dccmap_lut,
                             int* dccmap_width,int* dccmap_height,
                             uint8_t* dccSign,wchar_t*pd_offset)
```

<!-- Source EN PDF p.34, block 219 -->

【Входные данные】

<!-- Source EN PDF p.34, block 220 -->

| Имя параметра | Описание |
|---|---|
| RawAddrAll | Последовательность усреднённых изображений, снятых в каждом положении мотора |
| psensor_cfg | Указатель на структуру с содержимым sensor.ini |
| gainmap_lut | Карта усиления, полученная pdaf_gainmap_calibration |

<!-- Source EN PDF p.34, block 221 -->

【Выходные данные】

<!-- Source EN PDF p.34, block 222 -->

| Имя параметра | Описание |
|---|---|
| dccmap_lut | Полученная карта DCC |
| dccmap_width | Ширина полученной карты DCC |
| dccmap_height | Высота полученной карты DCC |
| dccSign | Направление карты DCC, полученное при калибровке |
| pd_offset | Значение pd_offset, полученное при калибровке |

<!-- Source EN PDF p.34, block 223 -->

【Возвращаемое значение】

<!-- Source EN PDF p.34, block 224 -->

=0: калибровка не выполнена.

<!-- Source EN PDF p.34, block 225 -->

=1：Калибровка успешна

<!-- Source EN PDF p.34, block 226 -->

#### 3.3.5 Проверка DCC Map

<!-- Source EN PDF p.34, block 227 -->

Проверка соответствия dcc map требованиям включает два интерфейса: pdaf_dccmap_vertification() и pdaf_calc_sharpness().

<!-- Source EN PDF p.34, block 228 -->

【Назначение】

<!-- Source EN PDF p.34, block 229 -->

Используйте откалиброванную dcc map для получения идеального резкого положения DAC1 размытого изображения.

<!-- Source EN PDF p.34, block 230 -->

【Прототип функции】

<!-- Source EN PDF p.34, block 231 -->

```text
uint16_t pdaf_dccmap_vertification(uint16_t *RawAddr, sensor_cfg* psensor_cfg,
                                   int cur_pos_id, uint16_t *gainmap_lut,
                                   uint16_t *dccmap_lut, uint8_t dccSign, wchar_t
*pd_offset)
```

<!-- Source EN PDF p.34, block 232 -->

【Входные данные】

<!-- Source EN PDF p.35, block 233 -->

| Имя параметра | Описание |
|---|---|
| RawAddr | Усреднённые данные снятого нерезкого изображения |
| psensor_cfg | Указатель на структуру с содержимым sensor.ini |
| cur_pos_id | Текущее положение мотора при съёмке нерезкого изображения |
| gainmap_lut | Карта усиления, калиброванная pdaf_gainmap_calibration |
| dccmap_lut | Карта DCC, калиброванная pdaf_dccmap_calibration |
| dccSign | Значение dccSign, калиброванное pdaf_dccmap_calibration |
| pd_offset | Значение pd_offset, полученное калибровкой pdaf_dccmap_calibration |

<!-- Source EN PDF p.35, block 234 -->

【Возвращаемое значение】

<!-- Source EN PDF p.35, block 235 -->

Положение мотора DAC1, при котором размытое изображение идеально сфокусировано.

<!-- Source EN PDF p.35, block 236 -->

【Назначение】

<!-- Source EN PDF p.35, block 237 -->

В диапазоне DCC_VERIFY_CAF_DIFF_MAX\*abs(DACinf-DACmacro)+DCC_VERIFY_CAF_DIFF_DET по обе стороны DAC1 вычисляется резкость центральной области для поиска пика.

<!-- Source EN PDF p.35, block 238 -->

【Прототип функции】

<!-- Source EN PDF p.35, block 239 -->

```text
bool pdaf_calc_sharpness(uint16_t *RawAddrAll, int img_num, sensor_cfg*
psensor_cfg)
```

<!-- Source EN PDF p.35, block 240 -->

【Входные данные】

<!-- Source EN PDF p.35, block 241 -->

| Имя параметра | Описание |
|---|---|
| RawAddrAll | Последовательность усреднённых изображений в пределах valid_toerance*abs (DACinf-DACmacro)+2 до и после DAC1 |
| img_num | Число изображений в RawAddrAll |
| psensor_cfg | Указатель на структуру с содержимым sensor.ini |

<!-- Source EN PDF p.35, block 242 -->

【Возвращаемое значение】

<!-- Source EN PDF p.35, block 243 -->

=0: пик резкости не найден; проверка не пройдена.

<!-- Source EN PDF p.35, block 244 -->

=1：Проверка успешна

<!-- Source EN PDF p.36, block 245 -->

## 4. Приложение

<!-- Source EN PDF p.36, block 246 -->

### 4.1 Пример кода приложения OTP

<!-- Source EN PDF p.36, block 247 -->

```text
#include <iostream>
#include "RKOTPDLL.h"
#include <stdlib.h>
int main()
{
    int ret = 0;
    #LSC AWB Otp Calibration
    ret =lsc_awbtest();
    #Pdaf Otp Calibration
    uint16_t gainmap[30*30 * 2];
    uint16_t dccmap[20 * 20 * 2];
    uint16_t code = 0;
    int gainmap_width = 0;
    int gainmap_height = 0;
    int dccmap_width = 0;
    int dccmap_height = 0;
    uint8_t dcc_Sign = 0;
    wchar_t pd_offset=0xffff;
    int curpos = 864;
    sensor_cfg sensor_param;
    if (pdaf_initial("D:\\testdll\\testdll\\sensor_ov16A10.ini", &sensor_param))
    {
        if (gainmaptest(&sensor_param, gainmap,&gainmap_width,&gainmap_height))
        {
        if (dccmaptest(&sensor_param, gainmap, dccmap, curpos, &code,
&dccmap_width, &dccmap_height, &dcc_Sign,&pd_offset))
            {
                ret = dcc_calc_sharpness(&sensor_param);
            }
        }
    }
}
bool lsc_awbtest()
{
    int vig=70;
    int height = 1944;
    int width = 2592;
    int bits =10;#10bit
    int bayer =0;#BGGR
    int roiw =5;#1/5 width
    int roih =5;#1/5 height
    int blc[4]={ 64, 64, 64, 64};
    uint16_t lsctable[17*17*4];
    uint16_t awb[3];
    uint16_t Rave =0;
    uint16_t Grave =0;
    uint16_t Gbave =0;
    uint16_t Bave =0;
    int Ydiffer_down =0;#%
    int Ydiffer_up =5;#%
    int ColorShading_down =0;#%
    int ColorShading_up =5;#%
    float Ydiffer = 0;
    float RGconer[25];
    float BGconer[25];
    bool ret =0;
    uint16_t *Rawdata = NULL;
    Rawdata = (uint16_t*)malloc(width * height * 2);
    memset(Rawdata, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    fp = fopen("input.raw", "rb");
    if (fp == NULL)
    {
        return false;
    }
    fread(Rawdata, 1, height * width * 2, fp);
    fclose(fp);
    ret =lsc_otp_Calibrate(vig,Rawdata, width, height, bits, bayer, blc[0],
blc[1],blc[2], blc[3],lsctable);
    ret = awb_otp_Calibrate(Rawdata, width, height,roiw,roih, bits, bayer,
blc[0], blc[1],blc[2], blc[3],&Rave,&Grave,&Gbave,&Bave, &awb[0], &awb[1],
&awb[2]);
    ret = lsc_otp_verify(Rawdata, width, height, bits, bayer, blc[0], blc[1],
blc[2], blc[3], lsctable, Ydiffer_down, Ydiffer_up, ColorShading_down,
ColorShading_up, &Ydiffer, RGconer, BGconer);
    if(!ret)
    {
        return false; #The calibrated data does not meet the control standards and the verification fails.
    }
    if(Rawdata!=NULL)
    {
        free (Rawdata);
        Rawdata =NULL;
    }
    return ret;
}
int gainmaptest(sensor_cfg* psensor_cfg, uint16_t *gainmap_lut,int *
gainmap_width, int *gainmap_height)
{
    int ret = 0;
    int height = psensor_cfg->height;
    int width = psensor_cfg->width;
    uint16_t maxval = (1 << psensor_cfg->bits) - 1;
    int gainmapfilenum = 3;
    int over_exp_cnt = 0;
    if (psensor_cfg->pd_dual_mode && psensor_cfg->mipi_mix_mode)
    {
        height = psensor_cfg->height + (psensor_cfg->sensor_type+1)*psensor_cfg->pd_height;
    }
    uint16_t *ave_pixelbuf = NULL;
    ave_pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    uint16_t *sum_pixelbuf = NULL;
    sum_pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(sum_pixelbuf, 0, sizeof(uint16_t)* width * height);
    uint16_t *pixelbuf = NULL;
    pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    char prename[20] = "gainRAW";
    char endname[5] = ".raw";
    for (int i = 0; i < gainmapfilenum; i++)
    {
        char temp[20];
        char id[5];
        int idint = i + 1;
        strcpy(temp, prename);
        _itoa_s(idint, id, 10);
        strcat(temp, id);
        strcat(temp, endname);
        fp = fopen(temp, "rb");
        if (fp == NULL)
        {
            return false;
        }
        fread(pixelbuf, 1, height * width * 2, fp);
        fclose(fp);
        for (int j = 0; j < height; j++)
        {
            for (int i = 0; i < width; i++)
            {
                uint32_t tempbuf = *(pixelbuf + j*width + i);
                *(sum_pixelbuf + j*width + i) = tempbuf + *(sum_pixelbuf +
j*width + i);
                if (tempbuf >= maxval)
                    over_exp_cnt++;
            }
        }
    }
    for (int j = 0; j < height; j++)
    {
        for (int i = 0; i < width; i++)
        {
            *(ave_pixelbuf + j*width + i) = *(sum_pixelbuf + j*width + i) /
gainmapfilenum;
        }
    }
    ret = pdaf_gainmap_calibration(ave_pixelbuf, psensor_cfg, gainmap_lut,
gainmap_width,gainmap_height);
    ret = pdaf_gainmap_vertification(ave_pixelbuf, psensor_cfg, gainmap_lut);
    if(ret == -1)
        printf("gainmap image OVER exposure!!!");
    if (ave_pixelbuf!=NULL)
    {
        free(ave_pixelbuf);
        ave_pixelbuf = NULL;
    }
    if (pixelbuf != NULL)
    {
        free(pixelbuf);
        pixelbuf = NULL;
    }
    if (sum_pixelbuf != NULL)
    {
        free(sum_pixelbuf);
        sum_pixelbuf = NULL;
    }
    return ret;
}
bool dccmaptest(sensor_cfg* psensor_cfg, uint16_t *gainmap_lut, uint16_t
*dccmap_lut, int curpos , uint16_t *code, int *dccmap_width, int *dccmap_height,
uint8_t *dcc_Sign,wchar_t *pdaf_offset)
{
    int ret = 0;
    int lens_begin = 0;
    int lens_end = 64;
    int lens_interval = 8;
    int height = psensor_cfg->height;
    int width = psensor_cfg->width;
    int lensnum = (lens_end - lens_begin) / lens_interval + 1;
    if (psensor_cfg->pd_dual_mode && psensor_cfg->mipi_mix_mode)
    {
        height = psensor_cfg->height + (psensor_cfg->sensor_type +
1)*psensor_cfg->pd_height;
    }
    uint16_t *ave_pixelbuf = NULL;
    ave_pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    uint16_t *Rawdata = NULL;
    Rawdata = (uint16_t*)malloc(width * height * 2 * lensnum);
    memset(Rawdata, 0, sizeof(uint16_t)* width * height* lensnum);
    uint16_t *pixelbuf= NULL;
    pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    char prename[20] = "dccRAW";
    char endname[5] = ".raw";
    for (int a = 0;a <lensnum;a++)
    {
        char temp[20];
        char id[5] ;
        int id1 = a + 1;
        strcpy(temp,prename);
        _itoa_s(id1, id, 10);
        strcat(temp, id);
        for (int b = 0; b < 3;b++)
        {
            char name[20];
            strcpy(name, temp);
            int id2 = b + 1;
            _itoa_s(id2, id, 10);
            strcat(name, id);
            strcat(name, endname);
            fp = fopen(name, "rb");
            if (fp == NULL)
            {
                return false;
            }
            fread(pixelbuf, 1, height * width * 2, fp);
            fclose(fp);
            for (int j = 0; j < height; j++)
            {
                for (int i = 0; i < width; i++)
                {
                    uint16_t tempbuf = *(ave_pixelbuf + j*width + i);
                    *(ave_pixelbuf + j*width + i) = tempbuf + *(pixelbuf +
j*width + i) / 3;
                }
            }
        }
        memcpy(Rawdata + a*height * width, ave_pixelbuf, sizeof(uint16_t)*height
* width);
        memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    }
    ret = pdaf_dccmap_calibration(Rawdata, psensor_cfg, gainmap_lut, dccmap_lut,
dccmap_width, dccmap_height, dcc_Sign,pd_offset);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    memset(ave_pixelbuf, 0, sizeof(uint16_t)* width * height);
    char prename1[20] = "image";
    for (int i = 0; i < 3; i++)
    {
        char temp[20];
        char id[5];
        int idint = i + 1;
        strcpy(temp, prename1);
        _itoa_s(idint, id, 10);
        strcat(temp, id);
        strcat(temp, endname);
        fp = fopen(temp, "rb");
        if (fp == NULL)
        {
            return false;
        }
        fread(pixelbuf, 1, height * width * 2, fp);
        fclose(fp);
        for (int j = 0; j < height; j++)
        {
            for (int i = 0; i < width; i++)
            {
                uint16_t tempbuf = *(ave_pixelbuf + j*width + i);
                *(ave_pixelbuf + j*width + i) = tempbuf + *(pixelbuf + j*width +
i) / 3;
            }
        }
    }
        *code = pdaf_dccmap_vertification(ave_pixelbuf, psensor_cfg, curpos,
gainmap_lut, dccmap_lut, *dcc_Sign,pd_offset);
    if (ave_pixelbuf != NULL)
    {
        free(ave_pixelbuf);
        ave_pixelbuf = NULL;
    }
    if (pixelbuf != NULL)
    {
        free(pixelbuf);
        pixelbuf = NULL;
    }
    if (Rawdata != NULL)
    {
        free(Rawdata);
        Rawdata = NULL;
    }
    return ret;
}
bool dcc_calc_sharpness(sensor_cfg* psensor_cfg)
{
    int height = psensor_cfg->height;
    int width = psensor_cfg->width;
    int imgnum = 5;
    if (psensor_cfg->pd_dual_mode && psensor_cfg->mipi_mix_mode)
    {
        height = psensor_cfg->height + (psensor_cfg->sensor_type +
1)*psensor_cfg->pd_height;
    }
    uint16_t *Rawdata = NULL;
    Rawdata = (uint16_t*)malloc(width * height * 2 * imgnum);
    memset(Rawdata, 0, sizeof(uint16_t)* width * height* imgnum);
    uint16_t *pixelbuf = NULL;
    pixelbuf = (uint16_t*)malloc(width * height * 2);
    memset(pixelbuf, 0, sizeof(uint16_t)* width * height);
    FILE *fp = NULL;
    char prename[20] = "calimage";
    char endname[5] = ".raw";
    for (int i = 0; i < imgnum; i++)
    {
        char temp[20];
        char id[5];
        int idint = i + 1;
        strcpy(temp, prename);
        _itoa_s(idint, id, 10);
        strcat(temp, id);
        strcat(temp, endname);
        fp = fopen(temp, "rb");
        if (fp == NULL)
        {
            return false;
        }
        fread(pixelbuf, 1, height * width * 2, fp);
        fclose(fp);
        memcpy(Rawdata + i*height * width, pixelbuf, sizeof(uint16_t)*height *
width);
    }
    bool ret=pdaf_calc_sharpness(Rawdata, imgnum, psensor_cfg);
    if (pixelbuf != NULL)
    {
        free(pixelbuf);
        pixelbuf = NULL;
    }
    if (Rawdata != NULL)
    {
        free(Rawdata);
        Rawdata = NULL;
    }
    return ret;
}
```

<!-- Source EN PDF p.43, block 259 -->

### 4.2 Формат упакованных данных для программирования

<!-- Source EN PDF p.43, block 260 -->

Можно программировать выбранные блоки по необходимости, но изменять ID блоков нельзя. После нужных блоков необходимо записать завершающее значение 0xff.

<!-- Source EN PDF p.43, block 261 -->

| Длина (Byte) | Элемент данных | Примечание |
|---|---|---|
| 8 | Метка | ROCKCHIP |
| 1 | ID | ID=0，Данные сенсора |
| 4 | Размер | Размер данных блока |
|  | Данные блока |  |
| 1 | ID | ID=1，Калибровка AWB |
| 4 | Размер | Размер данных блока |
|  | Данные блока |  |
| 1 | ID | ID=2，Калибровка LSC |
| 4 | Размер | Размер данных блока |
|  | Данные блока |  |
| 1 | ID | ID=3，Калибровка PDAF |
| 4 | Размер | Размер данных блока |
|  | Данные блока |  |
| 1 | ID | ID=4，Код AF |
| 4 | Размер | Размер данных блока |
|  | Данные блока |  |
| 1 | ID | ID=5，QSC |
| 4 | Размер | Размер данных блока |
|  | Данные блока |  |
| ... | ... | ... |
| 1 | 0xFF | Признак конца |

<!-- Source EN PDF p.43, block 262 -->

Содержимое блоков приведено ниже. Многобайтные данные используют big-endian: старший байт хранится по младшему адресу, младший — по старшему.

<!-- Source EN PDF p.44, block 263 -->

| Адрес смещения | Длина (Byte) | Элемент данных | Примечание |
|---|---|---|---|
| 0x0000 | 8 | Метка | ROCKCHIP |
| 0x0008 | 1 | ID | ID=0，Данные сенсора |
| 0x0009 | 4 | Размер | Size=35 |
| 0x000D | 2 | Версия | Версия Sensor Info: v1.0.8=0x0108 |
| 0x000F | 1 | ID поставщика | Задаётся пользователем |
| 0x0010 | 1 | Дата: год | Например, для 2021 года записать 21 |
| 0x0011 | 1 | Дата: месяц | Например, для июля записать 7 |
| 0x0012 | 1 | Дата: день | Например, для 12-го числа записать 12 |
| 0x0013 | 1 | Sensor ID | Задаётся пользователем |
| 0x0014 | 1 | Lens ID | Задаётся пользователем |
| 0x0015 | 1 | VCM ID | Задаётся пользователем |
| 0x0016 | 1 | Driver ID | Задаётся пользователем |
| 0x0017 | 4 | Module ID | Задаётся пользователем |
| 0x001B | 1 | mirror/flip | Bit[7:4]:Mirror (зеркало); Bit[3:0]:Flip (переворот); ON: 1, OFF: 0 |
| 0x001C | 1 | Full Width H | Старший байт полной ширины |
| 0x001D | 1 | Full Width L | Младший байт полной ширины |
| 0x001E | 1 | Full Height H | Старший байт полной высоты |
| 0x001F | 1 | Full Height L | Младший байт полной высоты |
| 0x0020 | 15 | Резерв | Reserved=0xff |
| 0x002F | 1 | Контрольная сумма | Контрольная сумма Sensor Info; Sum(0x0009~0x002E) % 255+1 |

<!-- Source EN PDF p.45, block 264 -->

| Адрес смещения | Длина (Byte) | Элемент данных | Примечание |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=1，Калибровка AWB |
| 0x0001 | 4 | Размер | Size=43 |
| 0x0005 | 2 | Версия | Версия AWB: v1.0.9=0x0109 |
| 0x0007 | 1 | R/G_H | Текущее R/G; старший байт |
| 0x0008 | 1 | R/G_L | Текущее R/G; младший байт |
| 0x0009 | 1 | B/G_H | Текущее B/G; старший байт |
| 0x000A | 1 | B/G_L | Текущее B/G; младший байт |
| 0x000B | 1 | Gr/Gb_H | Текущее Gr/Gb; старший байт |
| 0x000C | 1 | Gr/Gb_L | Текущее Gr/Gb; младший байт |
| 0x000D | 1 | R/G_H | Эталонное Golden R/G; старший байт |
| 0x000E | 1 | R/G_L | Эталонное Golden R/G; младший байт |
| 0x000F | 1 | B/G_H | Эталонное Golden B/G; старший байт |
| 0x0010 | 1 | B/G_L | Эталонное Golden B/G; младший байт |
| 0x0011 | 1 | Gr/Gb_H | Эталонное Golden Gr/Gb; старший байт |
| 0x0012 | 1 | Gr/Gb_L | Эталонное Golden Gr/Gb; младший байт |
| 0x0013 | 28 | Резерв | Reserved=0xff |
| 0x002F | 1 | Контрольная сумма | Контрольная сумма AWB Calibration; Sum(0x0001~0x002E) % 255+1 |

<!-- Source EN PDF p.45, block 265 -->

| Адрес смещения | Длина (Byte) | Элемент данных | Примечание |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=2，Калибровка LSC |
| 0x0001 | 4 | Размер | Size=2347 |
| 0x0005 | 2 | Версия | Версия LSC: v1.0.b=0x010b |
| 0x0007 | 2312 | Данные калибровки LSC | Матрица 17x17x4, фиксированная точка с масштабом 1024, без упаковки, big endian; порядок каналов R, Gr, Gb, B |
| 0x090F | 32 | Резерв | Reserved=0xff |
| 0x092F | 1 | Контрольная сумма | Контрольная сумма LSC Calibration; Sum(0x0001~0x092E) % 255+1 |

<!-- Source EN PDF p.46, block 266 -->

| Адрес смещения | Длина (Byte) | Элемент данных | Примечание |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=3，Калибровка PDAF |
| 0x0001 | 4 | Размер | Size=2603 |
| 0x0005 | 2 | Версия | Версия PDAF: v1.1.12=0x011c |
| 0x0007 | 1 | Gainmap_width | Размер Gainmap, полученный из pdaf_gainmap_calibration() |
| 0x0008 | 1 | Gainmap_height | Размер Gainmap, полученный из pdaf_gainmap_calibration() |
| 0x0009 | 2048 | Gainmap | Фактический размер=Gainmap_width* Gainmap_height*2, big endian, значение по умолчанию 0xff |
| 0x0809 | 1 | Контрольная сумма | Контрольная сумма Gainmap; Sum(0x0007~0x00808) % 255+1 |
| 0x080A | 1 | Значение режима | Режим аппроксимации DCC Map (в этой версии по умолчанию 1), соответствует DCC_CALIBRATE_MODE в PD ini |
| 0x080B | 1 | Направление | dccSign из pdaf_dccmap_calibration(); 0: отрицательное; 1: положительное |
| 0x080C | 1 | DCCmap_width | Размер DCCmap, полученный из pdaf_dccmap_calibration() |
| 0x080D | 1 | DCCmap_height | Размер DCCmap, полученный из pdaf_dccmap_calibration() |
| 0x080E | 512 | Dccmap | Фактический размер=DCCmap_width* DCCmap_height*2, big endian, значение по умолчанию 0xff |
| 0x0A0E | 1 | Контрольная сумма | Контрольная сумма DCCmap; Sum(0x080A~0x0A0D) % 255+1 |
| 0x0A0F | 2 | pd_offset | flag(1)sign(1)reserve(2)integer(4)8fix_decimals(8), flag=0: калибровка; sign=1: положительное |
| 0x0A11 | 30 | Резерв | Reserved=0xff |
| 0x0A2F | 1 | Контрольная сумма | Контрольная сумма PDAF Calibration; Sum(0x0001~0x0A2E) % 255+1 |

<!-- Source EN PDF p.47, block 267 -->

| Адрес смещения | Длина (Byte) | Элемент данных | Примечание |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=4，Код AF |
| 0x0001 | 4 | Размер | Size=27 |
| 0x0005 | 2 | Версия | Версия AF: v1.0.9=0x0109 |
| 0x0007 | 1 | AF Infinite H | Старшая часть кода дальнего фокуса AF |
| 0x0008 | 1 | AF Infinite L | Младшая часть кода дальнего фокуса AF |
| 0x0009 | 1 | AF Macro H | Старшая часть кода ближнего фокуса AF |
| 0x000A | 1 | AF Macro L | Младшая часть кода ближнего фокуса AF |
| 0x000B | 1 | AF_Medium H | Старшая часть кода среднего фокуса AF |
| 0x000C | 1 | AF_Medium L | Младшая часть кода среднего фокуса AF |
| 0x000D | 18 | Резерв | Reserved=0xff |
| 0x001F | 1 | Контрольная сумма | Контрольная сумма AF Code; Sum(0x0001~0x001E) % 255+1 |

<!-- Source EN PDF p.47, block 268 -->

| Адрес смещения | Длина (Byte) | Элементы данных | Примечание |
|---|---|---|---|
| 0x0000 | 1 | ID | ID=5，QSC |
| 0x0001 | 4 | Размер | Size=4107 |
| 0x0005 | 2 | Версия | Версия QSC: v1.0.0=0x0100 |
| 0x0007 | 2 | QSC Size | Размер QSC, big endian |
| 0x0009 | 4096 | Данные | Фактический размер записи данных QSC определяется QSC size; значение по умолчанию 0xff |
| 0x1009 | 6 | Резерв | Reserved=0xff |
| 0x100F | 1 | Контрольная сумма | Контрольная сумма QSC; Sum(0x0001~0x100E) % 255+1 |

{% endraw %}
