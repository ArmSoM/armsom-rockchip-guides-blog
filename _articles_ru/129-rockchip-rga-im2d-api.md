---
title: "Rockchip RGA IM2D API: возможности, интерфейсы и примеры"
description: "Rockchip RGA IM2D API: возможности, интерфейсы и примеры — V2.2.7."
translation_key: "129-rockchip-rga-im2d-api"
slug: "129-rockchip-rga-im2d-api"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, RGA, IM2D, librga]
excerpt: "Rockchip RGA IM2D API: возможности, интерфейсы и примеры — V2.2.7."
---

{% raw %}

Полные технические главы Rockchip RGA IM2D API V2.2.7 (82 китайские и 79 английских страниц). Для применения на ArmSoM проверьте версию RGA в SoC платы, SDK/BSP, совместимость librga/драйвера ядра, ограничения памяти и форматов. Поддержка всех функций на всех платах не заявляется. Единая версия ядра не указана; совместимость драйверов приведена в главе 2. Аппаратная проверка ArmSoM не выполнялась. Производительность — теоретические данные изготовителя, примеры и журналы не являются измерениями ArmSoM.

> Сохранены сомнения источника: impyramind/impyramid и imfilp/imflip; imcvtcolorTask описан как смещение; §5.3.12 указывает IM_ALPHA_BLEND_DST, но §3.15 — SRC_OVER. Таблица OSD связывает внутреннее/внешнее управление с EXTERNAL/INTERNAL, предположительно наоборот относительно имён. Написания bule, RK_FORMA_A8, RK1103B, RK1108 требуют проверки по SDK. Правый край аппаратной таблицы обрезан: видимое 3 (by pa… для RGA3 сохранено без догадок.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip librga](https://github.com/airockchip/librga)

## 1. Обзор

RGA (Raster Graphic Acceleration Unit) — независимый аппаратный 2D-ускоритель для рисования точек/линий, масштабирования, поворота, bitBlt и альфа-смешивания.

### 1.1 Проектные характеристики

| Версия | Кодовое имя | Чип | Источник min | Источник max | Назначение min | Назначение max | Функции | Pixels/Cycle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RGA1 | Pagani | RK3066 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/2~8 масштаб<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1 | Jaguar<br>Plus | RK3188 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/2~8 масштаб<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1 | Beetles | RK2926/2928 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/2~8 масштаб<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1 | Beetles<br>Plus | RK3026/3028 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/2~8 масштаб<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>ROP<br>IOMMU(32bit) | 1 |
| RGA1_plus | Audi | RK3128 | 2x2 | 8192x8192 | 2x2 | 2048x2048 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/2~8 масштаб<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>IOMMU(32bit) | 1 |
| RGA1_plus | Granite | Sofia 3gr | 2x2 | 8192x8192 | 2x2 | 2048x2048 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/2~8 масштаб<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>IOMMU(32bit) | 1 |
| RGA2 | Lincoln | RK3288/3288w | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP<br>IOMMU(32bit) | 2 |
| RGA2 | Capricorn | RK3190 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite0 | Maybach | RK3368 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/8~8 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite0 | BMW | RK3366 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/8~8 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP<br>IOMMU(32bit) | 2 |

| Версия | Кодовое имя | Чип | Источник min | Источник max | Назначение min | Назначение max | Функции | Pixels/Cycle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RGA2-<br>Lite1 | Benz | RK3228 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/8~8 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite1 | Infiniti | RK3228H | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/8~8 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite1 | Gemini | RK3326 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/8~8 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite1 | Lion | RK1808 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/8~8 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>IOMMU(32bit) | 2 |
| RGA2-<br>Lite2 | Libra | RK3506 | 2x2 | 1280x8192 | 2x2 | 1280x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>Размытие Guassion (так в источнике)<br>alpha-8bit | 2 |
| RGA2-<br>Lite3 | Pather | RK1103B | 2x2 | 2880x8192 | 2x2 | 2880x8192 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное)<br>уменьшение(билинейное/усреднение)<br>Заливка цветом | 2 |
| RGA2-<br>Enhance | Mclaren | RK3399 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP(недоступно для<br>RV1108/RV1109/RK3566)<br>Квантование NN(недоступно для<br>RK3399/RV1108)<br>osd (только<br>RV1106/RV1103/RK3562/RK3528)<br>мозаика(только<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562—<br>40bit,недоступно для RV1106/1103) | 2 |
| RGA2-<br>Enhance | Mercury | RK1108 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP(недоступно для<br>RV1108/RV1109/RK3566)<br>Квантование NN(недоступно для<br>RK3399/RV1108)<br>osd (только<br>RV1106/RV1103/RK3562/RK3528)<br>мозаика(только<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562—<br>40bit,недоступно для RV1106/1103) | 2 |
| RGA2-<br>Enhance | Puma | RV1126/RV1109 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP(недоступно для<br>RV1108/RV1109/RK3566)<br>Квантование NN(недоступно для<br>RK3399/RV1108)<br>osd (только<br>RV1106/RV1103/RK3562/RK3528)<br>мозаика(только<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562—<br>40bit,недоступно для RV1106/1103) | 2 |
| RGA2-<br>Enhance | skylarkV2 | RK3566/RK3568 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP(недоступно для<br>RV1108/RV1109/RK3566)<br>Квантование NN(недоступно для<br>RK3399/RV1108)<br>osd (только<br>RV1106/RV1103/RK3562/RK3528)<br>мозаика(только<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562—<br>40bit,недоступно для RV1106/1103) | 2 |
| RGA2-<br>Enhance | Orion | RK3588 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP(недоступно для<br>RV1108/RV1109/RK3566)<br>Квантование NN(недоступно для<br>RK3399/RV1108)<br>osd (только<br>RV1106/RV1103/RK3562/RK3528)<br>мозаика(только<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562—<br>40bit,недоступно для RV1106/1103) | 2 |
| RGA2-<br>Enhance | Otter | RV1106/1103 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP(недоступно для<br>RV1108/RV1109/RK3566)<br>Квантование NN(недоступно для<br>RK3399/RV1108)<br>osd (только<br>RV1106/RV1103/RK3562/RK3528)<br>мозаика(только<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562—<br>40bit,недоступно для RV1106/1103) | 2 |
| RGA2-<br>Enhance | Bull | RK3528 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP(недоступно для<br>RV1108/RV1109/RK3566)<br>Квантование NN(недоступно для<br>RK3399/RV1108)<br>osd (только<br>RV1106/RV1103/RK3562/RK3528)<br>мозаика(только<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562—<br>40bit,недоступно для RV1106/1103) | 2 |
| RGA2-<br>Enhance | Snipe | RK3562 | 2x2 | 8192x8192 | 2x2 | 4096x4096 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP(недоступно для<br>RV1108/RV1109/RK3566)<br>Квантование NN(недоступно для<br>RK3399/RV1108)<br>osd (только<br>RV1106/RV1103/RK3562/RK3528)<br>мозаика(только<br>RV1106/RV1103/RK3562/RK3528)<br>IOMMU(32bit, RK3528/RK3562—<br>40bit,недоступно для RV1106/1103) | 2 |

| Версия | Кодовое имя | Чип | Источник min | Источник max | Назначение min | Назначение max | Функции | Pixels/Cycle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RGA2-Pro | Heron | RK3576 | 2x2 | 8192x8192 | 2x2 | 8192x8192 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(билинейное/усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP<br>osd<br>мозаика(только RK3576)<br>Карта альфа-битов ARGB5551<br>rkfbc64x4 вход(только RK3576)<br>afbc32x8 вход(раздельный режим, только<br>RK3576)<br>tile4x4(RV1126B только вход)<br>IOMMU(40bit) | 2 |
| RGA2-Pro | Swan | RV1126B | 2x2 | 8192x8192 | 2x2 | 8192x8192 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/16~16 масштаб<br>увеличение(билинейное/бикубическое)<br>уменьшение(билинейное/усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>Заливка цветом<br>Палитра<br>ROP<br>osd<br>мозаика(только RK3576)<br>Карта альфа-битов ARGB5551<br>rkfbc64x4 вход(только RK3576)<br>afbc32x8 вход(раздельный режим, только<br>RK3576)<br>tile4x4(RV1126B только вход)<br>IOMMU(40bit) | 2 |
| RGA3 | Orion | RK3588 | 68x2 | 8176x8176 | 68x2 | 8128x8128 | Поворот 90/180/270<br>Отражение X/Y<br>Обрезка<br>1/8~8 масштаб<br>увеличение(бикубическое)<br>уменьшение(усреднение)<br>Альфа-смешивание<br>Цветовой ключ<br>afbc16x16<br>IOMMU(40bit) | 3 (by pa…; 2 (scale) |

Примечание:

1) Число пикселей за такт — теоретическая величина. Реальная производительность зависит от пропускной способности, частоты аппаратуры и других факторов; таблица приведена для справки.

2) Помимо минимального входного разрешения, x, y, width и height фактического прямоугольника операции каждого канала должны быть не меньше 2.

3) Адресуемая память RGA связана с разрядностью IOMMU. Например, RGA с 32-битным IOMMU адресует физическую память только в диапазоне 0–4G.

### 1.2 Поддерживаемые форматы

Преобразование форматов пикселей: BT.601/BT.709/BT.2020 (BT.2020 только на RGA3). Дизеринг.

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA1 | Pagani | RK3066 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1<br>RK_FORMAT_BPP2<br>RK_FORMAT_BPP4<br>RK_FORMAT_BPP8 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP (только для<br>размытия/резкости)<br>RK_FORMAT_YCrCb_420_SP (только для<br>размытия/резкости)<br>RK_FORMAT_YCbCr_422_SP (только для<br>размытия/резкости)<br>RK_FORMAT_YCrCb_422_SP (только для<br>размытия/резкости)<br>RK_FORMAT_YCbCr_420_P (только для<br>размытия/резкости)<br>RK_FORMAT_YCrCb_420_P (только для<br>размытия/резкости)<br>RK_FORMAT_YCbCr_422_P (только для<br>размытия/резкости)<br>RK_FORMAT_YCrCb_422_P (только для<br>размытия/резкости) |
|  | Jaguar<br>Plus | RK3188 |  |  |
|  | Beetles | RK2926/2928 |  |  |
|  | Beetles<br>Plus | RK3026/3028 |  |  |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA1_plus | Audi | RK3128 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1<br>RK_FORMAT_BPP2<br>RK_FORMAT_BPP4<br>RK_FORMAT_BPP8 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP (только для<br>обычного Bitblt без alpha)<br>RK_FORMAT_YCrCb_420_SP (только для<br>обычного Bitblt без alpha)<br>RK_FORMAT_YCbCr_422_SP (только для<br>обычного Bitblt без alpha)<br>RK_FORMAT_YCrCb_422_SP (только для<br>обычного Bitblt без alpha)<br>RK_FORMAT_YCbCr_420_P (только для<br>обычного Bitblt без alpha)<br>RK_FORMAT_YCrCb_420_P (только для<br>обычного Bitblt без alpha)<br>RK_FORMAT_YCbCr_422_P (только для<br>обычного Bitblt без alpha)<br>RK_FORMAT_YCrCb_422_P (только для<br>обычного Bitblt без alpha) |
|  | Granite | Sofia 3gr |  |  |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA2 | Lincoln | RK3288/3288w | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1 (только для<br>палитры)<br>RK_FORMAT_BPP2 (только для<br>палитры)<br>RK_FORMAT_BPP4 (только для<br>палитры)<br>RK_FORMAT_BPP8 (только для<br>палитры) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P |
|  | Capricorn | RK3190 |  |  |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA2-Lite0 | Maybach | RK3368 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_BPP1 (только для<br>палитры)<br>RK_FORMAT_BPP2 (только для<br>палитры)<br>RK_FORMAT_BPP4 (только для<br>палитры)<br>RK_FORMAT_BPP8 (только для<br>палитры) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P |
|  | BMW | RK3366 |  |  |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA2-Lite1 | Benz | RK3228 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGBA_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_BPP1 (только для<br>палитры)<br>RK_FORMAT_BPP2 (только для<br>палитры)<br>RK_FORMAT_BPP4 (только для<br>палитры)<br>RK_FORMAT_BPP8 (только для<br>палитры) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P |
|  | Infiniti | RK3228H |  |  |
|  | Gemini | RK3326 |  |  |
|  | Lion | RK1808 |  |  |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA2-Lite2 | Libra | RK3506 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_A8<br>RK_FORMAT_BPP1 (только для<br>палитры)<br>RK_FORMAT_BPP2 (только для<br>палитры)<br>RK_FORMAT_BPP4 (только для<br>палитры)<br>RK_FORMAT_BPP8 (только для<br>палитры) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4 |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA2-Lite2 | Pather | RV1103B | RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400 | RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400 |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA2-<br>Enhance | Mclaren | RK3399 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_BPP1 (только для<br>палитры)<br>RK_FORMAT_BPP2 (только для<br>палитры)<br>RK_FORMAT_BPP4 (только для<br>палитры)<br>RK_FORMAT_BPP8 (только для<br>палитры) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422 |
|  | Mercury | RK1108 |  |  |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
|  | Puma | RV1126/<br>RV1109 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMAT_BPP1 (только для<br>палитры)<br>RK_FORMAT_BPP2 (только для<br>палитры)<br>RK_FORMAT_BPP4 (только для<br>палитры)<br>RK_FORMAT_BPP8 (только для<br>палитры) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4 |
|  | skylarkV2 | RK3566/RK3568 |  |  |
|  | Orion | RK3588 |  |  |
|  |  |  |  |  |
|  | Otter | RV1106/1103 |  |  |
|  | Bull | RK3528 |  |  |
|  | Snipe | RK3562 |  |  |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA2-Pro | Heron | RK3576 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_444_SP<br>RK_FORMAT_YCrCb_444_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B<br>RK_FORMA_A8 (только src для<br>альфа-смешивания)<br>RK_FORMAT_BPP1 (только для<br>палитры)<br>RK_FORMAT_BPP2 (только для<br>палитры)<br>RK_FORMAT_BPP4 (только для<br>палитры)<br>RK_FORMAT_BPP8 (только для<br>палитры) | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_444_SP<br>RK_FORMAT_YCrCb_444_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4 (только RK3576)<br>RK_FORMAT_Y8 (только RK3576) |
|  | Swan | RV1126B |  |  |

| Версия | Кодовое имя | Чип | Входной формат | Выходной формат |
| --- | --- | --- | --- | --- |
| RGA3 | Orion | RK3588 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565<br>RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B |

Примечание:

1) RK_FORMAT_YCbCr_400 использует только канал Y формата YUV, обычно для 256 (2^8) уровней серого. При преобразовании RGB/YUV учитывайте настройку цветового пространства. Для полного диапазона из 256 уровней серого задайте full range при преобразовании.

2) RK_FORMAT_Y4 использует только Y-канал YUV с дизерингом до 4 бит, обычно для 16 (2^4) уровней серого. Требования к цветовому пространству такие же, как для RK_FORMAT_YCbCr_400. RK_FORMAT_Y8 аналогичен RK_FORMAT_Y4: действительны лишь 4 старших бита, а 4 младших недействительны.

### 1.3 Выравнивание форматов изображения

| Версия | Byte_stride | Формат | Выравнивание |
| --- | --- | --- | --- |
| RGA1<br>RGA1-Plus | 4 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888 | Нет требований выравнивания width stride. |
|  |  | RK_FORMAT_RGBA_4444<br>RK_FORMAT_BGRA_4444<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_RGBA_5551<br>RK_FORMAT_BGRA_5551<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565 | width stride: выравнивание по 2. |
|  |  | RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888 | width stride: выравнивание по 4. |
|  |  | RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P | width stride: выравнивание по 4; x_offset, y_offset, width, height, height stride: выравнивание по 2. |

| RGA2<br>RGA2-Lite0<br>RGA2-Lite1<br>RGA2-Lite2<br>RGA2-Lite3<br>RGA2-<br>Enhance<br>RGA2-Pro | 4 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888 | Нет требований выравнивания width stride. |
| --- | --- | --- | --- |
|  |  | RK_FORMAT_RGBA_4444<br>RK_FORMAT_BGRA_4444<br>RK_FORMAT_ARGB_4444<br>RK_FORMAT_ABGR_4444<br>RK_FORMAT_RGBA_5551<br>RK_FORMAT_BGRA_5551<br>RK_FORMAT_ARGB_5551<br>RK_FORMAT_ABGR_5551<br>RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565 | width stride: выравнивание по 2. |
|  |  | RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422<br>RK_FORMAT_YUYV_420<br>RK_FORMAT_YVYU_420<br>RK_FORMAT_UYVY_420<br>RK_FORMAT_VYUY_420 | width stride: выравнивание по 2; x_offset, y_offset, width, height, height stride: выравнивание по 2. |
|  |  | RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888<br>RK_FORMAT_A8 | width stride: выравнивание по 4. |
|  |  | RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP<br>RK_FORMAT_YCbCr_444_SP<br>RK_FORMAT_YCrCb_444_SP<br>RK_FORMAT_YCbCr_420_P<br>RK_FORMAT_YCrCb_420_P<br>RK_FORMAT_YCbCr_422_P<br>RK_FORMAT_YCrCb_422_P<br>RK_FORMAT_YCbCr_400<br>RK_FORMAT_Y4<br>RK_FORMAT_Y8 | width stride: выравнивание по 4; x_offset, y_offset, width, height, height stride: выравнивание по 2. |
|  |  | RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B | width stride: выравнивание по 16; x_offset, y_offset: выравнивание по 64; width, height, height stride: выравнивание по 2. |

| RGA3 | 16 | RK_FORMAT_RGBA_8888<br>RK_FORMAT_BGRA_8888<br>RK_FORMAT_ARGB_8888<br>RK_FORMAT_ABGR_8888<br>RK_FORMAT_RGBX_8888<br>RK_FORMAT_BGRX_8888<br>RK_FORMAT_XRGB_8888<br>RK_FORMAT_XBGR_8888 | width stride: выравнивание по 4. |
| --- | --- | --- | --- |
|  |  | RK_FORMAT_RGB_565<br>RK_FORMAT_BGR_565 | width stride: выравнивание по 8. |
|  |  | RK_FORMAT_YUYV_422<br>RK_FORMAT_YVYU_422<br>RK_FORMAT_UYVY_422<br>RK_FORMAT_VYUY_422 | width stride: выравнивание по 8; x_offset, y_offset, width, height, height stride: выравнивание по 2. |
|  |  | RK_FORMAT_RGB_888<br>RK_FORMAT_BGR_888 | width stride: выравнивание по 16. |
|  |  | RK_FORMAT_YCbCr_420_SP<br>RK_FORMAT_YCrCb_420_SP<br>RK_FORMAT_YCbCr_422_SP<br>RK_FORMAT_YCrCb_422_SP | width stride: выравнивание по 16; x_offset, y_offset, width, height, height stride: выравнивание по 2. |
|  |  | RK_FORMAT_YCbCr_420_SP_10B<br>RK_FORMAT_YCrCb_420_SP_10B<br>RK_FORMAT_YCbCr_422_SP_10B<br>RK_FORMAT_YCrCb_422_SP_10B | width stride: выравнивание по 64; x_offset, y_offset: выравнивание по 4; width, height, height stride: выравнивание по 2. |
|  |  | FBC mode | Помимо указанного выше выравнивания форматов: width stride, height stride: выравнивание по 16. |
|  |  | TILE8*8 mode | Помимо указанного выше выравнивания форматов: width, height: выравнивание по 8; входной канал width stride, height stride: выравнивание по 16. |

Примечание:

1) Формула выравнивания: lcm(bpp, byte_stride * 8) / pixel_stride.

2) Если платформа содержит несколько версий аппаратуры, librga применяет наиболее строгие требования выравнивания для использования аппаратных ресурсов.

## 2. Версии

Библиотека librga.so обновляет номер версии по правилам, отражающим новые функции, совместимость и исправления. Несколько способов запроса версии помогают определить пригодность библиотеки для текущего окружения. Подробные изменения и различия приведены в CHANGLOG.md в корне исходного дерева.

### 2.1 Версия API librga

#### 2.1.1 Формат версии и правила повышения

##### 2.1.1.1 Формат версии

```text
major.minor.revision_[build]
```

Пример:

1.0.0_[0]

##### 2.1.1.2 Правила повышения

| Название | Правило |
| --- | --- |
| major | Мажорная версия: обратно несовместимые выпуски. |
| minor | Минорная версия: обратно совместимое добавление функциональных API. |
| revision | Ревизия: обратно совместимые дополнения функций или исправления критических ошибок. |
| build | Версия сборки: обратно совместимые исправления ошибок. |

#### 2.1.2 Запрос версии

##### 2.1.2.1 Запрос через strings

Пример для 64-битного Android R:

```text
:/# strings vendor/lib64/librga.so |grep rga_api |grep version
rga_api version 1.0.0_[0]
```

##### 2.1.2.2 Вывод журнала

Версия выводится при первом вызове RGA API каждым процессом.

```text
rockchiprga: rga_api version 1.0.0_[0]
```

##### 2.1.2.3 Запрос через API

Следующий API запрашивает версию кода, сборки и аппаратуры RGA. Подробности использования приведены в разделе прикладных интерфейсов.

```text
querystring(RGA_VERSION);
```

Формат строк:

```text
RGA_api version : v1.0.0_[0]
RGA version : RGA_2_Enhance
```

##### 2.1.2.4 Запрос свойства

Запрос свойства поддерживается только Android и работает после того, как процесс вызвал RGA и свойство было установлено.

```text
:/# getprop |grep rga
[vendor.rga_api.version]: [1.0.0_[0]]
```

### 2.2 Версия драйвера

librga обращается к аппаратуре RGA через драйвер. Его версия должна поддерживаться используемой версией librga.

#### 2.2.1 Формат версии и правила повышения

##### 2.2.1.1 Формат версии

```text
<driver_name>: v major.minor.revision
```

Примеры:

```text
RGA2 Device Driver: v2.1.0
RGA multicore Device Driver: v1.2.23
```

##### 2.2.1.2 Правила повышения

| Название | Правило |
| --- | --- |
| major | Мажорная версия: обратно несовместимые выпуски. |
| minor | Минорная версия: обратно совместимое добавление функциональных API. |
| revision | Ревизия: обратно совместимые дополнения функций или исправления критических ошибок. |

#### 2.2.2 Запрос версии

##### 2.2.2.1 Запрос журнала загрузки

После загрузки запросите журнал инициализации RGA следующей командой. Некоторые старые драйверы не выводят версию, поэтому метод применим не ко всем версиям.

```text
dmesg |grep rga
```

Пример:

```text
[ 2.382393] rga3_core0 fdb60000.rga: Adding to iommu group 2
[ 2.382651] rga: rga3_core0, irq = 33, match scheduler
[ 2.383058] rga: rga3_core0 hardware loaded successfully, hw_version:3.0.76831.
[ 2.383121] rga: rga3_core0 probe successfully
[ 2.383687] rga3_core1 fdb70000.rga: Adding to iommu group 3
[ 2.383917] rga: rga3_core1, irq = 34, match scheduler
[ 2.384313] rga: rga3_core1 hardware loaded successfully, hw_version:3.0.76831.
[ 2.384412] rga: rga3_core1 probe successfully
[ 2.384893] rga: rga2, irq = 35, match scheduler
[ 2.385238] rga: rga2 hardware loaded successfully, hw_version:3.2.63318.
[ 2.385257] rga: rga2 probe successfully
[ 2.385455] rga_iommu: IOMMU binding successfully, default mapping core[0x1]
[ 2.385586] rga: Module initialized. v1.2.23
```

Здесь v1.2.23 — версия драйвера.

##### 2.2.2.2 Запрос отладочного узла

Версию можно запросить через отладочные узлы драйвера. Отсутствие указанных узлов означает, что текущая версия не поддерживает запрос. Для ядра с обычно включённой опцией CONFIG_ROCKCHIP_RGA_DEBUG_FS:

```text
cat /sys/kernel/debug/rkrga/driver_version
```

Для ядра с включённой ROCKCHIP_RGA_PROC_FS:

```text
cat /proc/rkrga/driver_version
```

```text
cat /sys/kernel/debug/rkrga/driver_version
RGA multicore Device Driver: v1.2.23
```

RGA multicore Device Driver — имя драйвера; v1.2.23 означает версию 1.2.23. Таким образом, работает RGA multicore Device Driver версии 1.2.23 (обычно multi_rga driver).

```text
cat /sys/kernel/debug/rkrga/driver_version
RGA2 Device Driver: v2.1.0
```

RGA2 Device Driver — имя драйвера; v2.1.0 означает версию 2.1.0. Таким образом, работает RGA2 Device Driver версии 2.1.0 (обычно rga2 driver).

### 2.3 Соответствие версий

Перед использованием RGA убедитесь в совместимости окружения. Ниже приведены распространённые соответствия версий librga и драйвера.

| Версия librga | Соответствующий драйвер | Поддержка оборудования |
| --- | --- | --- |
| Без номера версии | Драйвер соответствующего SDK | RGA1、RGA2 |
| 1.0.0 ~ 1.3.2 | RGA Device Driver(kernel - 4.4 и выше)<br>RGA2 Device Driver(без версии или v2.1.0) | RGA1、RGA2 |
| &gt; 1.4.0 | RGA multicore Device Driver(v1.2.0 и выше) | RGA2、RGA3 |
| &gt; 1.9.0 | RGA Device Driver(kernel-4.4 и выше)<br>RGA2 Device Driver(без версии и v2.1.0)<br>RGA multicore Device Driver(v1.2.0 и выше) | RGA1、RGA2、RGA3 |

## 3. Интерфейсы приложений

Библиотека RGA — librga.so. Она настраивает структуру буфера struct rga_info для 2D-операций и предоставляет удобные оболочки распространённых функций. Интерфейсы ориентируются на 2D API OpenCV/MATLAB, сокращая время обучения. RGA query возвращает аппаратную версию, максимальные входные/выходные разрешения и форматы для учёта совместимости. Перед обработкой wrapbuffer_T заполняет struct rga_buffer_t сведениями о входном и выходном буферах, включая разрешение и формат. improcess выполняет составные операции по заданным флагам usage. Операции, которые нельзя выполнить за один проход, объединяются в задание RGA и передаются драйверу для последовательного выполнения.

### 3.1 Обзор

Библиотека предоставляет следующие API. Асинхронный режим поддерживается только реализацией C++.

- `querystring`: Запросить версию оборудования и возможности RGA текущего SoC, вернуть строку.
- `imcheckHeader`: Проверить различия версий используемого заголовка и librga.
- `importbuffer_T`: Импортировать внешнюю память (dma_fd, виртуальный или физический адрес) в драйвер RGA для быстрого аппаратного доступа к физически непрерывной или разрывной памяти.
- `releasebuffer_handle`: Удалить ссылки и отображения внешнего буфера в драйвере.
- `wrapbuffer_handle`: Быстро упаковать буфер изображения в rga_buffer_t.
- `imbeginJob`: Создать задание обработки RGA.
- `imendJob`: Отправить и выполнить задание RGA.
- `imcancelJob`: Отменить и удалить задание RGA.
- `imcopy`: Вызвать RGA для быстрой операции: копирование изображения.
- `imcopyTask`: Добавить в задание RGA быструю операцию: копирование изображения.
- `imresize`: Вызвать RGA для быстрой операции: масштабирование изображения.
- `imresizeTask`: Добавить в задание RGA быструю операцию: масштабирование изображения.
- `impyramind`: Вызвать RGA для быстрой операции: обработку пирамиды изображения (написание источника).
- `imcrop`: Вызвать RGA для быстрой операции: обрезку изображения.
- `imcropTask`: Добавить в задание RGA быструю операцию: обрезку изображения.
- `imtranslate`: Вызвать RGA для быстрой операции: смещение изображения.
- `imtranslateTask`: Добавить в задание RGA быструю операцию: смещение изображения.
- `imcvtcolor`: Вызвать RGA для быстрой операции: преобразование формата.
- `imcvtcolorTask`: Добавить в задание RGA быструю операцию: преобразование формата.
- `imrotate`: Вызвать RGA для быстрой операции: поворот изображения.
- `imrotateTask`: Добавить в задание RGA быструю операцию: поворот изображения.
- `imflip`: Вызвать RGA для быстрой операции: зеркальное отражение.
- `imflipTask`: Добавить в задание RGA быструю операцию: зеркальное отражение.
- `imblend`: Вызвать RGA для быстрой операции: двухканальную композицию.
- `imblendTask`: Добавить в задание RGA быструю операцию: двухканальную композицию.
- `imcomposite`: Вызвать RGA для быстрой операции: трёхканальную композицию.
- `imcompositeTask`: Добавить в задание RGA быструю операцию: трёхканальную композицию.

- `imcolorkey`: Вызвать RGA для быстрой операции: обработку цветового ключа.
- `imcolorkeyTask`: Добавить в задание RGA быструю операцию: обработку цветового ключа.
- `imosd`: Вызвать RGA для быстрой операции: наложение текста OSD.
- `imosdTask`: Добавить в задание RGA быструю операцию: наложение текста OSD.
- `imquantize`: Вызвать RGA для быстрой операции: предобработку NN (квантование).
- `imquantizeTask`: Добавить в задание RGA быструю операцию: предобработку NN (квантование).
- `imrop`: Вызвать RGA для быстрой операции: растровые операции.
- `imropTask`: Добавить в задание RGA быструю операцию: растровые операции.
- `imfill`: Вызвать RGA для быстрой операции: заливку изображения.
- `imfillTask`: Добавить в задание RGA быструю операцию: заливку изображения.
- `imfillArray`: Вызвать RGA для быстрой операции: множественную заливку.
- `imfillTaskArray`: Добавить в задание RGA быструю операцию: множественную заливку.
- `imrectangle`: Вызвать RGA для быстрой операции: равномерные прямоугольные рамки.
- `imrectangleTask`: Добавить в задание RGA быструю операцию: равномерные прямоугольные рамки.
- `imrectangleArray`: Вызвать RGA для быстрой операции: несколько равномерных прямоугольных рамок.
- `imrectangleTaskArray`: Добавить в задание RGA быструю операцию: несколько равномерных прямоугольных рамок.
- `immakeBorder`: Вызвать RGA для быстрой операции: прямоугольные рамки.
- `immosaic`: Вызвать RGA для быстрой операции: мозаичную маскировку.
- `immosaicTask`: Добавить в задание RGA быструю операцию: мозаичную маскировку.
- `immosaicArray`: Вызвать RGA для быстрой операции: мозаичную маскировку.
- `immosaicTaskArray`: Добавить в задание RGA быструю операцию: мозаичную маскировку.
- `improcess`: Вызвать RGA для быстрой операции: комбинированную обработку.
- `improcessTask`: Добавить в задание RGA быструю операцию: комбинированную обработку.
- `imcheck`: Проверить корректность параметров и поддержку оборудования.
- `imsync`: Синхронизировать завершение в асинхронном режиме.
- `imconfig`: Добавить настройки по умолчанию в контекст текущего потока.

Ниже приведена поддержка API в различных средах:

| Пункт | API | Поддерживаемые языки | Поддерживаемые системы | librga | RGA2<br>драйвер | Multi_RGA<br>драйвер |
| --- | --- | --- | --- | --- | --- | --- |
| общий<br>API | querystring | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | imcheckHeader | C++ | Android / Linux<br>/ QNX / RT-<br>thread | ≥1.9.0 | / | / |
|  | imcheck | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imStrError | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | imsync | C++/C | Android / Linux | ≥1.6.0 | × | √ |
|  | imconfig | C++/C | Android / Linux | ≥1.6.0 | × | √ |
| API буфера | importbuffer_virtualaddr | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | importbuffer_physicaladdr | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | importbuffer_fd | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | releasebuffer_handle | C++/C | Android / Linux | ≥1.7.2 | × | √ |
|  | wrapbuffer_handle | C++/C | Android / Linux | ≥1.7.2 | / | / |
|  | wrapbuffer_virtualaddr | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | wrapbuffer_physicaladdr | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |
|  | wrapbuffer_fd | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | / | / |

| Пункт | API | Поддерживаемые языки | Поддерживаемые системы | librga | RGA2<br>драйвер | Multi_RGA<br>драйвер |
| --- | --- | --- | --- | --- | --- | --- |
|  | imcopy | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imresize | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | impyramind | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcrop | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imtranslate | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcvtcolor | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imrotate | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imflip | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imblend | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcomposite | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imcolorkey | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imosd | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | ≥1.8.0 | × | √ |
|  | imquantize | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imrop | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imfill | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
|  | imfillArray | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | imrectangle | C++/C | Android / Linux | ≥1.9.0 | × | √ |

| Пункт | API | Поддерживаемые языки | Поддерживаемые системы | librga | RGA2<br>драйвер | Multi_RGA<br>драйвер |
| --- | --- | --- | --- | --- | --- | --- |
|  | imrectangleArray | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | immakeBorder | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | imмозаика | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | ≥1.8.0 | × | √ |
|  | imмозаикаArray | C++/C | Android / Linux | ≥1.9.0 | × | √ |
|  | improcess | C++/C | Android / Linux<br>/ QNX / RT-<br>thread | √ | √ | √ |
| API обработки<br>заданий | imbeginJob | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imendJob | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcancelJob | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcopyTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imresizeTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcropTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imtranslateTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcvtcolorTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imrotateTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imflipTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imblendTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcompositeTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imcolorkeyTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imosdTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imquantizeTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imropTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imfillTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imfillTaskArray | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imrectangleTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imrectangleTaskArray | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imмозаикаTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imмозаикаTaskArray | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | imмозаикаTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |
|  | improcessTask | C++ | Android / Linux | ≥1.9.0 | × | ≥1.2.25 |

| Пункт | API | Поддерживаемые языки | Поддерживаемые системы | librga | RGA2<br>драйвер | Multi_RGA<br>драйвер |
| --- | --- | --- | --- | --- | --- | --- |
| расширенный API | importbuffer_GraphicBuffer | C++ | Android | √ | / | / |
|  | importbuffer_GraphicBuffer_handle | C++ | Android | √ | / | / |
|  | importbuffer_AHardwareBuffer | C++ | Android | √ | / | / |
|  | wrapbuffer_GraphicBuffer | C++ | Android | √ | / | / |
|  | wrapbuffer_handle(GraphicBuffer<br>handle) | C++ | Android | √ | / | / |
|  | wrapbuffer_AHardwareBuffer | C++ | Android | √ | / | / |

Обозначения: √ поддерживается; × не поддерживается; / неприменимо.

### 3.2 Версия и возможности RGA

#### 3.2.1 querystring

```text
const char* querystring(int name);
```

Запросить базовую информацию RGA и поддержку разрешений и форматов.

| Параметры | Описание |
| --- | --- |
| name | RGA_VENDOR - изготовитель<br>RGA_VERSION - версия<br>RGA_MAX_INPUT - максимальное входное разрешение<br>RGA_MAX_OUTPUT - максимальное выходное разрешение<br>RGA_BYTE_STRIDE - поддерживаемое выравнивание stride<br>RGA_SCALE_LIMIT - коэффициенты масштабирования<br>RGA_INPUT_FORMAT - входные форматы<br>RGA_OUTPUT_FORMAT - выходные форматы<br>RGA_EXPECTED - ожидаемая производительность<br>RGA_ALL - вывести всю информацию |

Возвращает строку с характеристиками RGA.

### 3.3 Проверка версии заголовка

#### 3.3.1 imcheckHeader

```text
IM_API IM_STATUS imcheckHeader(im_api_version_t header_version = RGA_CURRENT_API_HEADER_VERSION);
```

Проверить различия между версией используемого заголовка и librga.

| Параметры | Описание |
| --- | --- |
| header_version | Версия заголовка; обычно используется RGA_CURRENT_API_HEADER_VERSION. |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.4 Предобработка буфера изображения

#### 3.4.1 importbuffer_T

Для внешней памяти, обрабатываемой RGA, importbuffer_T отображает сведения о физических адресах буфера в драйвер и получает соответствующую адресную информацию для последующих стабильных и быстрых вызовов RGA.

| Параметры(T) | Тип данных | Описание |
| --- | --- | --- |
| виртуальный адрес | void * | Виртуальный адрес буфера |
| физический адрес | uint64_t | Непрерывный физический адрес буфера |
| fd | int | Файловый дескриптор DMA-буфера |
| GraphicBuffer<br>handle | buffer_handle_t | Дескриптор буфера изображения с адресом, файловым дескриптором, разрешением и форматом |
| GraphicBuffer | GraphicBuffer | графический буфер Android |
| AHardwareBuffer | AHardwareBuffer | блоки памяти, доступные различным аппаратным компонентам<br>системы. https://developer.android.com/ndk/reference/group/a-hardware-buffer |

Производительность зависит от типа буфера: physical address &gt; fd &gt; virtual address. Обычно рекомендуется fd.

```text
IM_API rga_buffer_handle_t importbuffer_fd(int fd, int size);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, int size);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, int size);
```

| Параметр | Описание |
| --- | --- |
| fd/va/pa | [обязательно] внешний буфер |
| size | [обязательно] размер памяти |

```text
IM_API rga_buffer_handle_t importbuffer_fd(int fd, int width, int height, int format);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, int width, int height, int format);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, int width, int height, int format);
```

| Параметр | Описание |
| --- | --- |
| fd/va/pa | [обязательно] внешний буфер |
| width | [обязательно] шаг ширины буфера в пикселях |
| height | [обязательно] шаг высоты буфера в пикселях |
| format | [обязательно] пиксельный формат буфера |

```text
IM_API rga_buffer_handle_t importbuffer_fd(int fd, im_handle_param_t *param);
IM_API rga_buffer_handle_t importbuffer_virtualaddr(void *va, im_handle_param_t *param);
IM_API rga_buffer_handle_t importbuffer_physicaladdr(uint64_t pa, im_handle_param_t *param);
```

| Параметр | Описание |
| --- | --- |
| fd/va/pa | [обязательно] внешний буфер |
| param | [обязательно] настроить параметры буфера |

```text
IM_API rga_buffer_handle_t importbuffer_GraphicBuffer_handle(buffer_handle_t hnd);
IM_API rga_buffer_handle_t importbuffer_GraphicBuffer(sp<GraphicBuffer> buf);
IM_API rga_buffer_handle_t importbuffer_AHardwareBuffer(AHardwareBuffer *buf);
```

| Параметр | Описание |
| --- | --- |
| hnd/buf | [обязательно] внешний буфер |

Возвращает дескриптор памяти rga_buffer_handle_t.

#### 3.4.2 releasebuffer_handle

После завершения работы RGA с внешней памятью вызовите releasebuffer_handle с её handle, чтобы удалить отображение/привязку буфера и освободить соответствующие ресурсы драйвера.

```text
IM_API IM_STATUS releasebuffer_handle(rga_buffer_handle_t handle);
```

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.4.3 wrapbuffer_handle

Входные и выходные параметры изображений IM2D поддерживают разные типы и описывают память, формат, ширину и высоту. До операции вызовите wrapbuffer_handle для преобразования параметров в единую структуру rga_buffer_t, передаваемую пользовательскому API.

```text
rga_buffer_t wrapbuffer_handle(rga_buffer_handle_t handle,
                               int width,
                               int height,
                               int format,
                               int wstride = width,
                               int hstride = height);
```

| Параметр | Описание |
| --- | --- |
| handle | [обязательно] дескриптор буфера RGA |
| width | [обязательно] ширина обрабатываемого изображения в пикселях |
| height | [обязательно] высота обрабатываемого изображения в пикселях |
| format | [обязательно] пиксельный формат |
| wtride | [необязательно] шаг ширины изображения в пикселях |
| hstride | [необязательно] шаг ширины изображения в пикселях |

Возвращает rga_buffer_t с описанием изображения.

### 3.5 Создание задания обработки

#### 3.5.1 imbeginJob

```text
IM_API im_job_handle_t imbeginJob(uint64_t flags = 0);
```

Создать задание обработки RGA и вернуть его дескриптор. job_handle используется для добавления/удаления операций и отправки/выполнения задания.

| Параметр | Описание |
| --- | --- |
| flags | [необязательно] флаги задания |

Возвращает дескриптор задания im_job_handle_t.

### 3.6 Отправка задания обработки

#### 3.6.1 imendJob

```text
IM_API IM_STATUS imendJob(im_job_handle_t job_handle,
                          int sync_mode = IM_SYNC,
                          int acquire_fence_fd = 0,
                          int *release_fence_fd = NULL);
```

Отправить и выполнить созданное задание обработки RGA. После завершения его ресурсы автоматически удаляются.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| sync_mode | [необязательно] ожидать завершения операции |
| acquire_fence_fd | [необязательно] в асинхронном режиме запустить задание после ожидания сигнала acquire_fence |
| release_fence_fd | [необязательно] используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.7 Отмена задания обработки

#### 3.7.1 imcancelJob

```text
IM_API IM_STATUS imcancelJob(im_job_handle_t job_handle);
```

Отменить и удалить созданное задание обработки RGA.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.8 Копирование изображения

#### 3.8.1 imcopy

```text
IM_STATUS imcopy(const rga_buffer_t src,
                 rga_buffer_t dst,
                 int sync = 1,
                 int *release_fence_fd = NULL);
```

Выполнить однократное быстрое копирование изображения из буфера канала src в буфер канала dst.

| Параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.8.2 imcopyTask

```text
IM_API IM_STATUS imcopyTask(im_job_handle_t job_handle,
                            const rga_buffer_t src,
                            rga_buffer_t dst);
```

Через job_handle добавить операцию копирования изображения в указанное задание. Использование соответствует imcopy.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.9 Масштабирование и пирамиды

#### 3.9.1 imresize

```text
IM_STATUS imresize(const rga_buffer_t src,
                   rga_buffer_t dst,
                   double fx = 0,
                   double fy = 0,
                   int interpolation = INTER_LINEAR,
                   int sync = 1,
                   int *release_fence_fd = NULL);
```

Задайте целевые размеры через dst либо коэффициенты fx/fy для нужного масштаба. При одновременной настройке dst и fx/fy приоритет имеют размеры, вычисленные по fx/fy.

Настройка interpolation поддерживается только RGA1/RGA1 plus; алгоритм других версий смотрите в соответствующем TRM. При fx/fy размеры форматов с требованиями выравнивания, например YUV, принудительно округляются вниз, что может изменить ожидаемый результат масштабирования.

| Параметры | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение; размер dsize (если не ноль) либо вычисленный из src.size(), fx<br>и fy; тип dst совпадает с src. |
| fx | [необязательно] коэффициент масштаба по горизонтали; при 0 вычисляется как:<br>fx = (double) dst.width / src.width |
| fy | [необязательно] коэффициент масштаба по вертикали; при 0 вычисляется как:<br>fy = (double) dst.height / src.height |
| interpolation | [необязательно] метод интерполяции:<br>INTER_NEAREST - интерполяция ближайшего соседа<br>INTER_LINEAR - билинейная интерполяция (по умолчанию)<br>INTER_CUBIC - бикубическая интерполяция окрестности 4x4 пикселя |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.9.2 impyramid

```text
IM_STATUS impyramid (const rga_buffer_t src,
                     rga_buffer_t dst，
                     IM_SCALE direction)
```

Масштабирование пирамиды: в зависимости от direction изменить ширину и высоту одновременно в 1/2 или 2 раза.

| Параметры | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение; |
| direction | [обязательно] режим масштаба<br>IM_UP_SCALE —— увеличение<br>IM_DOWN_SCALE —— уменьшение |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.9.3 imresizeTask

```text
IM_API IM_STATUS imresizeTask(im_job_handle_t job_handle,
                              const rga_buffer_t src,
                              rga_buffer_t dst,
                              double fx = 0,
                              double fy = 0,
                              int interpolation = 0);
```

Через job_handle добавить операцию масштабирования изображения в указанное задание. Использование соответствует imresize.

| Параметры | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение; размер dsize (если не ноль) либо вычисленный из src.size(), fx<br>и fy; тип dst совпадает с src. |
| fx | [необязательно] коэффициент масштаба по горизонтали; при 0 вычисляется как:<br>fx = (double) dst.width / src.width |
| fy | [необязательно] коэффициент масштаба по вертикали; при 0 вычисляется как:<br>fy = (double) dst.height / src.height |
| interpolation | [необязательно] метод интерполяции:<br>INTER_NEAREST - интерполяция ближайшего соседа<br>INTER_LINEAR - билинейная интерполяция (по умолчанию)<br>INTER_CUBIC - бикубическая интерполяция окрестности 4x4 пикселя |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.10 Обрезка изображения

#### 3.10.1 imcrop

```text
IM_STATUS imcrop(const rga_buffer_t src,
                 rga_buffer_t dst,
                 im_rect rect,
                 int sync = 1,
                 int *release_fence_fd = NULL);
```

Обрезать изображение по указанным области и размеру Rect.

| Параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| rect | [обязательно] область обрезки<br>x - координата x верхнего левого угла<br>y - координата y верхнего левого угла<br>width - ширина области<br>height - высота области |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.10.2 imcropTask

```text
IM_API IM_STATUS imcropTask(im_job_handle_t job_handle,
                            const rga_buffer_t src,
                            rga_buffer_t dst,
                            im_rect rect);
```

Через job_handle добавить операцию обрезки изображения в указанное задание. Использование соответствует imcrop.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| rect | [обязательно] область обрезки<br>x - координата x верхнего левого угла<br>y - координата y верхнего левого угла<br>width - ширина области<br>height - высота области |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.11 Смещение изображения

#### 3.11.1 imtranslate

```text
IM_STATUS imtranslate(const rga_buffer_t src,
                      rga_buffer_t dst,
                      int x,
                      int y,
                      int sync = 1,
                      int *release_fence_fd = NULL);
```

Сместить изображение в координаты (x, y). Ширина и высота src и dst должны совпадать; выходящая за границы часть обрезается.

| Параметр | Описание |
| --- | --- |
| src | [обязательно]входное изображение |
| dst | [обязательно] выходное изображение |
| x | [обязательно] горизонтальное смещение |
| y | [обязательно] вертикальное смещение |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.11.2 imtranslateTask

```text
IM_API IM_STATUS imtranslateTask(im_job_handle_t job_handle,
                                 const rga_buffer_t src,
                                 rga_buffer_t dst,
                                 int x,
                                 int y);
```

Через job_handle добавить операцию смещения изображения в указанное задание. Использование соответствует imtranslate.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно]входное изображение |
| dst | [обязательно] выходное изображение |
| x | [обязательно] горизонтальное смещение |
| y | [обязательно] вертикальное смещение |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.12 Преобразование формата

#### 3.12.1 imcvtcolor

```text
IM_STATUS imcvtcolor(rga_buffer_t src,
                     rga_buffer_t dst,
                     int sfmt,
                     int dfmt,
                     int mode = IM_COLOR_SPACE_DEFAULT,
                     int sync = 1,
                     int *release_fence_fd = NULL);
```

Преобразовать формат. Поддержка зависит от SoC; см. раздел форматов. Форматы задаются через rga_buffer_t либо отдельно через sfmt/dfmt. При преобразовании цветового пространства YUV/RGB параметр mode выбирает пространство; по умолчанию BT.601 limited range.

| параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| sfmt | [необязательно] формат исходного изображения |
| dfmt | [необязательно] формат целевого изображения |
| Mode | [необязательно] режим цветового пространства:<br>IM_YUV_TO_RGB_BT601_LIMIT<br>IM_YUV_TO_RGB_BT601_FULL<br>IM_YUV_TO_RGB_BT709_LIMIT<br>IM_RGB_TO_YUV_BT601_LIMIT<br>IM_RGB_TO_YUV_BT601_FULL<br>IM_RGB_TO_YUV_BT709_LIMIT |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.12.2 imcvtcolorTask

```text
IM_API IM_STATUS imcvtcolorTask(im_job_handle_t job_handle,
                                rga_buffer_t src,
                                rga_buffer_t dst,
                                int sfmt,
                                int dfmt,
                                int mode = IM_COLOR_SPACE_DEFAULT);
```

Через job_handle добавить операцию смещения изображения (формулировка источника) в указанное задание. Использование соответствует imcvtcolor.

| параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| sfmt | [необязательно] формат исходного изображения |
| dfmt | [необязательно] формат целевого изображения |
| Mode | [необязательно] режим цветового пространства:<br>IM_YUV_TO_RGB_BT601_LIMIT<br>IM_YUV_TO_RGB_BT601_FULL<br>IM_YUV_TO_RGB_BT709_LIMIT<br>IM_RGB_TO_YUV_BT601_LIMIT<br>IM_RGB_TO_YUV_BT601_FULL<br>IM_RGB_TO_YUV_BT709_LIMIT |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.13 Поворот изображения

#### 3.13.1 imrotate

```text
IM_STATUS imrotate(const rga_buffer_t src,
                   rga_buffer_t dst,
                   int rotation,
                   int sync = 1,
                   int *release_fence_fd = NULL);
```

Поворот изображений на 90, 180 или 270 градусов.

| Параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| rotation | [обязательно] угол поворота:<br>IM_HAL_TRANSFORM_ROT_90<br>IM_HAL_TRANSFORM_ROT_180<br>IM_HAL_TRANSFORM_ROT_270 |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.13.2 imrotateTask

```text
IM_API IM_STATUS imrotateTask(im_job_handle_t job_handle,
                              const rga_buffer_t src,
                              rga_buffer_t dst,
                              int rotation);
```

Через job_handle добавить операцию поворота изображения в указанное задание. Использование соответствует imrotate.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| rotation | [обязательно] угол поворота:<br>IM_HAL_TRANSFORM_ROT_90<br>IM_HAL_TRANSFORM_ROT_180<br>IM_HAL_TRANSFORM_ROT_270 |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.14 Зеркальное отражение

#### 3.14.1 imfilp

```text
IM_STATUS imflip (const rga_buffer_t src,
                  rga_buffer_t dst,
                  int mode,
                  int sync = 1,
                  int *release_fence_fd = NULL);
```

Зеркально отразить изображение по горизонтали или вертикали.

| Параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| mode | [обязательно] режим отражения:<br>IM_HAL_TRANSFORM_FLIP_H_V<br>IM_HAL_TRANSFORM_FLIP_H<br>IM_HAL_TRANSFORM_FLIP_V |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.14.2 imflipTask

```text
IM_API IM_STATUS imflipTask(im_job_handle_t job_handle,
                            const rga_buffer_t src,
                            rga_buffer_t dst,
                            int mode);
```

Через job_handle добавить операцию зеркального отражения в указанное задание. Использование соответствует imflip.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| mode | [обязательно] режим отражения:<br>IM_HAL_TRANSFORM_FLIP_H_V<br>IM_HAL_TRANSFORM_FLIP_H<br>IM_HAL_TRANSFORM_FLIP_V |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.15 Композиция изображения

#### 3.15.1 imblend/imcomposite

```text
IM_STATUS imblend(const rga_buffer_t fg_image,
                  rga_buffer_t bg_image,
                  int mode = IM_ALPHA_BLEND_SRC_OVER,
                  int sync = 1,
                  int *release_fence_fd = NULL);
```

Двухканальная композиция RGA использует A+B -&gt; B: передний план srcA и фон dst смешиваются по заданной альфа-модели, результат записывается в dst. Без настройки используется src-over.

```text
IM_STATUS imcomposite(const rga_buffer_t fg_image,
                      const rga_buffer_t bg_image,
                      rga_buffer_t output_image,
                      int mode = IM_ALPHA_BLEND_SRC_OVER,
                      int sync = 1,
                      int *release_fence_fd = NULL);
```

Трёхканальная композиция RGA использует A+B -&gt; C: передний план srcA и фон srcB альфа-смешиваются по выбранной модели, результат записывается в dst. По умолчанию src-over. В обоих режимах mode выбирает модель Porter-Duff. Определения:

- S: источник/передний план.
- D: назначение/фон.
- R: результат.
- c: компоненты RGB цвета RGBA. В Porter-Duff используются предумноженные цвета: исходный цвет, умноженный на альфа-компонент. Если предумножение не выполнено, примените Xc = Xc * Xa.
- a: альфа-компонент/прозрачность RGBA.
- f: коэффициент для цвета или альфа-компонента.

Основные формулы: цвет результата = цвет источника × коэффициент источника + цвет назначения × коэффициент назначения; альфа-компонент рассчитывается аналогично. RGA поддерживает модели:

```text
Rc = Sc * Sf + Dc * Df;
Ra = Sa * Sf + Da * Df;

SRC:
Sf = 1, Df = 0;
[Rc,Ra] = [Sc,Sa];
DST:
Sf = 0, Df = 1;
[Rc,Ra] = [Dc,Da];
SRC_OVER:
Sf = 1, Df = (1 - Sa);
[Rc,Ra] = [ Sc + (1 - Sa) * Dc, Sa + (1 - Sa) * Da ];
DST_OVER:
Sf = (1 - Da), Df = 1;
```

```text
[Rc,Ra] = [ Sc * (1 - Da) + Dc, Sa * (1 - Da) + Da ] ;
```

Композиция между изображениями YUV не поддерживается. dst функции imblend и srcB функции imcomposite не могут иметь формат YUV.

| Параметр | Описание |
| --- | --- |
| fg_image | [обязательно] изображение переднего плана |
| bg_image | [обязательно] фоновое изображение; при A+B-&gt;B также выходное изображение. |
| output_image | [обязательно] выходное изображение. |
| mode | [необязательно] режим смешивания:<br>IM_ALPHA_BLEND_SRC —— режим SRC<br>IM_ALPHA_BLEND_DST —— режим DST<br>IM_ALPHA_BLEND_SRC_OVER —— режим SRC OVER<br>IM_ALPHA_BLEND_DST_OVER —— режим DST OVER<br>IM_ALPHA_BLEND_PRE_MUL —— Включить предумножение: объединить флаг через OR с остальными флагами перед присваиванием mode. |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.15.2 imblendTask/imcompositeTask

```text
IM_API IM_STATUS imblendTask(im_job_handle_t job_handle,
                             const rga_buffer_t fg_image,
                             rga_buffer_t bg_image,
                             int mode = IM_ALPHA_BLEND_SRC_OVER);
```

Через job_handle добавить композицию A+B -&gt; B в задание. Использование соответствует imblend; по умолчанию применяется src-over.

```text
IM_API IM_STATUS imcompositeTask(im_job_handle_t job_handle,
                                 const rga_buffer_t fg_image,
                                 const rga_buffer_t bg_image,
                                 rga_buffer_t output_image,
                                 int mode = IM_ALPHA_BLEND_SRC_OVER);
```

Через job_handle добавить композицию A+B -&gt; C в задание. Использование соответствует imcomposite; режим по умолчанию src-over. Композиция между изображениями YUV не поддерживается: dst функции imblend и srcB функции imcomposite не могут иметь формат YUV.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| fg_image | [обязательно] изображение переднего плана |
| bg_image | [обязательно] фоновое изображение; при A+B-&gt;B также выходное изображение. |
| output_image | [обязательно] выходное изображение. |
| mode | [необязательно] режим смешивания:<br>IM_ALPHA_BLEND_SRC —— режим SRC<br>IM_ALPHA_BLEND_DST —— режим DST<br>IM_ALPHA_BLEND_SRC_OVER —— режим SRC OVER<br>IM_ALPHA_BLEND_DST_OVER —— режим DST OVER<br>IM_ALPHA_BLEND_PRE_MUL —— Включить предумножение: объединить флаг через OR с остальными флагами перед присваиванием mode. |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.16 Цветовой ключ

#### 3.16.1 imcolorkey

```text
IM_STATUS imcolorkey(const rga_buffer_t src,
                     rga_buffer_t dst,
                     im_colorkey_range range,
                     int mode = IM_ALPHA_COLORKEY_NORMAL,
                     int sync = 1,
                     int *release_fence_fd = NULL);
```

Color Key предварительно обрабатывает источник: обнуляет альфа-компонент пикселей, удовлетворяющих условию цветового ключа, заданному непрозрачными значениями цвета, затем смешивает обработанный источник с назначением. Фильтрация применяется только к заданному диапазону цветов src, результат накладывается на dst. IM_ALPHA_COLORKEY_NORMAL обнуляет альфа-компонент внутри диапазона; IM_ALPHA_COLORKEY_INVERTED действует наоборот. По умолчанию используется IM_ALPHA_COLORKEY_NORMAL.

| Параметры | Диапазон | Описание |
| --- | --- | --- |
| max | 0x0 ~ 0xFFFFFFFF | Максимальное значение удаляемого цвета, порядок ABGR |
| min | 0x0 ~ 0xFFFFFFFF | Минимальное значение удаляемого цвета, порядок ABGR |

| параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| range | [обязательно] целевой диапазон цвета<br>typedef struct im_colorkey_range {<br>int max;<br>int min;<br>} im_colorkey_value; |
| Mode | [обязательно] режим цветового ключа:<br>IM_ALPHA_COLORKEY_NORMAL<br>IM_ALPHA_COLORKEY_INVERTED |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.16.2 imcolorkeyTask

```text
IM_API IM_STATUS imcolorkeyTask(im_job_handle_t job_handle,
                                const rga_buffer_t fg_image,
                                rga_buffer_t bg_image,
                                im_colorkey_range range,
                                int mode = IM_ALPHA_COLORKEY_NORMAL);
```

Через job_handle добавить обработку Color Key в задание. Использование соответствует imcolorkey; режим по умолчанию IM_ALPHA_COLORKEY_NORMAL.

| Параметры | Диапазон | Описание |
| --- | --- | --- |
| max | 0x0 ~ 0xFFFFFFFF | Максимальное значение удаляемого цвета, порядок ABGR |
| min | 0x0 ~ 0xFFFFFFFF | Минимальное значение удаляемого цвета, порядок ABGR |

| параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| range | [обязательно] целевой диапазон цвета<br>typedef struct im_colorkey_range {<br>int max;<br>int min;<br>} im_colorkey_value; |
| Mode | [обязательно] режим цветового ключа:<br>IM_ALPHA_COLORKEY_NORMAL<br>IM_ALPHA_COLORKEY_INVERTED |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.17 Наложение текста OSD

#### 3.17.1 imosd

```text
IM_API IM_STATUS imosd(const rga_buffer_t osd,
                       const rga_buffer_t bg_image,
                       const im_rect osd_rect,
                       im_osd_t *osd_config,
                       int sync = 1,
                       int *release_fence_fd = NULL);
```

OSD (On-Screen Display) накладывает текст на видеокадры, поддерживает статистику яркости текста и автоматическую инверсию цвета.

| параметр | Описание |
| --- | --- |
| OSD | [обязательно] изображение блока OSD |
| bg_image | [обязательно] выходное изображение |
| osd_rect | [обязательно] область изображения для OSD |
| osd_config | [обязательно] настройка функции OSD |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.17.2 imosdTask

```text
IM_API IM_STATUS imosdTask(im_job_handle_t job_handle,
                           const rga_buffer_t osd,
                           const rga_buffer_t bg_image,
                           const im_rect osd_rect,
                           im_osd_t *osd_config);
```

Через job_handle добавить обработку OSD в указанное задание. Использование соответствует imosd.

| параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| OSD | [обязательно] изображение блока OSD |
| dst | [обязательно] выходное изображение |
| osd_rect | [обязательно] область изображения для OSD |
| osd_config | [обязательно] настройка функции OSD |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.18 Предобработка NN (квантование)

#### 3.18.1 imquantize

```text
IM_STATUS imquantize(const rga_buffer_t src,
                     rga_buffer_t dst,
                     rga_nn_t nn_info,
                     int sync = 1,
                     int *release_fence_fd = NULL);
```

Сейчас поддерживается только на RV1126 / RV1109. Предобработка NN позволяет отдельно задавать offset и scale для каждого из трёх каналов RGB. Формула:

```text
dst = 【(src + offset) * scale 】
```

Диапазоны параметров:

| Параметры | Диапазон | Описание |
| --- | --- | --- |
| scale | 0 ~ 3.99 | 10 бит: старшие 2 бита — целая часть, младшие 8 — дробная. |
| offset | -255 ~ 255 | 9 бит: старший бит — знак, младшие кодируют смещение 0–255. |

| параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| nn_info | [обязательно] rga_nn_t отдельно задаёт offset и масштаб каждого канала RGB<br>typedef struct rga_nn {<br>int nn_flag;<br>int масштаб_r;<br>int масштаб_g;<br>int масштаб_b;<br>int offset_r;<br>int offset_g;<br>int offset_b;<br>} rga_nn_t; |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.18.2 imquantizeTask

```text
IM_API IM_STATUS imquantizeTask(im_job_handle_t job_handle,
                                const rga_buffer_t src,
                                rga_buffer_t dst,
                                im_nn_t nn_info);
```

Через job_handle добавить квантование изображения в указанное задание. Использование соответствует imquantize.

| параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| nn_info | [обязательно] rga_nn_t отдельно задаёт offset и масштаб каждого канала RGB<br>typedef struct rga_nn {<br>int nn_flag;<br>int масштаб_r;<br>int масштаб_g;<br>int масштаб_b;<br>int offset_r;<br>int offset_g;<br>int offset_b;<br>} rga_nn_t; |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.19 Растровые операции (ROP)

#### 3.19.1 imrop

```text
IM_STATUS imrop(const rga_buffer_t src,
                rga_buffer_t dst,
                int rop_code,
                int sync = 1,
                int *release_fence_fd = NULL);
```

Выполнить операцию ROP над двумя изображениями.

| параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| rop_code | [обязательно] режим кода ROP<br>IM_ROP_AND : dst = dst AND src;<br>IM_ROP_OR : dst = dst OR src<br>IM_ROP_NOT_DST : dst = NOT dst<br>IM_ROP_NOT_SRC : dst = NOT src<br>IM_ROP_XOR : dst = dst XOR src<br>IM_ROP_NOT_XOR : dst = NOT (dst XOR src) |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.19.2 imropTask

```text
IM_API IM_STATUS imropTask(im_job_handle_t job_handle,
                           const rga_buffer_t src,
                           rga_buffer_t dst,
                           int rop_code);
```

Через job_handle добавить обработку изображения ROP в указанное задание. Использование соответствует imrop.

| параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение |
| dst | [обязательно] выходное изображение |
| rop_code | [обязательно] режим кода ROP<br>IM_ROP_AND : dst = dst AND src;<br>IM_ROP_OR : dst = dst OR src<br>IM_ROP_NOT_DST : dst = NOT dst<br>IM_ROP_NOT_SRC : dst = NOT src<br>IM_ROP_XOR : dst = dst XOR src<br>IM_ROP_NOT_XOR : dst = NOT (dst XOR src) |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.20 Заливка цветом и рисование рамок

#### 3.20.1 imfill

```text
IM_STATUS imfill(rga_buffer_t dst,
                 im_rect rect,
                 int color,
                 int sync = 1,
                 int *release_fence_fd = NULL);
```

Залить указанную область rect цветом. Параметр color задаёт RGBA: от старших битов к младшим A, B, G, R; например, красный: color = 0x000000ff. Ширина и высота rect должны быть не меньше 2.

| Параметр | Описание |
| --- | --- |
| dst | [обязательно] целевое изображение |
| rect | [обязательно] область для заливки заданным цветом<br>ширина и высота rect должны быть не меньше 2 |
| color | [обязательно] цвет заливки |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.20.2 imfillArray

```text
IM_API IM_STATUS imfillArray(rga_buffer_t dst,
                             im_rect *rect_array,
                             int array_size,
                             uint32_t color,
                             int sync = 1,
                             int *release_fence_fd = NULL);
```

Поочерёдно залить несколько областей изображения цветом. Параметр color задаёт RGBA: от старших битов к младшим A, B, G, R; например, красный: color = 0x000000ff. Ширина и высота rect должны быть не меньше 2.

| Параметр | Описание |
| --- | --- |
| dst | [обязательно] целевое изображение |
| rect_array | [обязательно] array_ptr областей для заливки заданным цветом<br>ширина и высота rect должны быть не меньше 2 |
| array_size | [обязательно] размер массивов областей. |
| color | [обязательно] цвет заливки |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.20.3 imfillTask

```text
IM_API IM_STATUS imfillTask(im_job_handle_t job_handle,
                            rga_buffer_t dst,
                            im_rect rect,
                            uint32_t color);
```

Через job_handle добавить заливку изображения в задание. Использование соответствует imfill. Ширина и высота rect должны быть не меньше 2.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| dst | [обязательно] целевое изображение |
| rect | [обязательно] область для заливки заданным цветом<br>ширина и высота rect должны быть не меньше 2 |
| color | [обязательно] цвет заливки |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.20.4 imfillTaskArray

```text
IM_API IM_STATUS imfillTaskArray(im_job_handle_t job_handle,
                                 rga_buffer_t dst,
                                 im_rect *rect_array,
                                 int array_size,
                                 uint32_t color);
```

Через job_handle добавить заливку нескольких областей цветом в задание. Использование соответствует imfillArray. Ширина и высота rect должны быть не меньше 2.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| dst | [обязательно] целевое изображение |
| rect_array | [обязательно] array_ptr областей для заливки заданным цветом<br>ширина и высота rect должны быть не меньше 2 |
| array_size | [обязательно] размер массивов областей. |
| color | [обязательно] цвет заливки |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.20.5 imrectangle

```text
IM_API IM_STATUS imrectangle(rga_buffer_t dst,
                             im_rect rect,
                             uint32_t color,
                             int thickness,
                             int sync = 1,
                             int *release_fence_fd = NULL);
```

Нарисовать цветом color рамку толщины thickness вокруг rect, задающего внешнюю границу. При отрицательном thickness прямоугольник заливается целиком. Параметр color задаёт RGBA: от старших битов к младшим A, B, G, R; например, красный: color = 0x000000ff. Ширина и высота rect должны быть не меньше 2.

| Параметр | Описание |
| --- | --- |
| dst | [обязательно] целевое изображение |
| rect | [обязательно] область для заливки заданным цветом<br>ширина и высота rect должны быть не меньше 2 |
| color | [обязательно] цвет заливки |
| thickness | [обязательно] Толщина линий прямоугольника.<br>Отрицательные значения, например -1, означают рисование заполненного прямоугольника. |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.20.6 imrectangleArray

```text
IM_API IM_STATUS imrectangleArray(rga_buffer_t dst,
                                  im_rect *rect_array,
                                  int array_size,
                                  uint32_t color,
                                  int thickness,
                                  int sync = 1,
                                  int *release_fence_fd = NULL);
```

Поочерёдно нарисовать цветом color рамки толщины thickness вокруг нескольких областей rect, задающих внешние границы. При отрицательном thickness прямоугольники заливаются целиком. Параметр color задаёт RGBA: от старших битов к младшим A, B, G, R; например, красный: color = 0x000000ff. Ширина и высота rect должны быть не меньше 2.

| Параметр | Описание |
| --- | --- |
| dst | [обязательно] целевое изображение |
| rect_array | [обязательно] array_ptr областей для заливки заданным цветом<br>ширина и высота rect должны быть не меньше 2 |
| array_size | [обязательно] размер массивов областей. |
| color | [обязательно] цвет заливки |
| thickness | [обязательно] Толщина линий прямоугольника.<br>Отрицательные значения, например -1, означают рисование заполненного прямоугольника. |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.20.7 imrectangleTask

```text
IM_API IM_STATUS imrectangleTask(im_job_handle_t job_handle,
                                 rga_buffer_t dst,
                                 im_rect rect,
                                 uint32_t color,
                                 int thickness);
```

Через job_handle добавить рисование прямоугольных рамок в задание. Использование соответствует imrectangle. Ширина и высота rect должны быть не меньше 2.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| dst | [обязательно] целевое изображение |
| rect | [обязательно] область для заливки заданным цветом<br>ширина и высота rect должны быть не меньше 2 |
| color | [обязательно] цвет заливки |
| thickness | [обязательно] Толщина линий прямоугольника.<br>Отрицательные значения, например -1, означают рисование заполненного прямоугольника. |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.20.8 imrectangleTaskArray

```text
IM_API IM_STATUS imrectangleTaskArray(im_job_handle_t job_handle,
                                      rga_buffer_t dst,
                                      im_rect *rect_array,
                                      int array_size,
                                      uint32_t color,
                                      int thickness);
```

Через job_handle добавить рисование нескольких прямоугольных рамок в задание. Использование соответствует imrectangleArray. Ширина и высота rect должны быть не меньше 2.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| dst | [обязательно] целевое изображение |
| rect_array | [обязательно] array_ptr областей для заливки заданным цветом<br>ширина и высота rect должны быть не меньше 2 |
| array_size | [обязательно] размер массивов областей. |
| color | [обязательно] цвет заливки |
| thickness | [обязательно] Толщина линий прямоугольника.<br>Отрицательные значения, например -1, означают рисование заполненного прямоугольника. |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.20.9 immakeBorder

```text
IM_API IM_STATUS immakeBorder(rga_buffer_t src,
                              rga_buffer_t dst,
                              int top,
                              int bottom,
                              int left,
                              int right,
                              int border_type,
                              int value = 0,
                              int sync = 1,
                              int acquir_fence_fd = -1,
                              int *release_fence_fd = NULL);
```

Добавить к входному изображению рамку размером top/bottom/left/right пикселей и записать результат в целевой буфер. Каждое значение top/bottom/left/right должно быть не меньше 2.

| Параметр | Описание |
| --- | --- |
| src | [обязательно] входное исходное изображение |
| dst | [обязательно] выходное целевое изображение |
| top | [обязательно] число пикселей сверху |
| bottom | [обязательно] число пикселей снизу |
| left | [обязательно] число пикселей слева |
| right | [обязательно] число пикселей справа |
| border_type | [обязательно] тип рамки<br>IM_BORDER_CONSTANT // iiiiii abcdefgh iiiiiii с заданным значением 'i'<br>IM_BORDER_REFLECT //fedcba abcdefgh hgfedcb<br>IM_BORDER_WRAP //cdefgh abcdefgh abcdefg |
| value | [необязательно] значение пикселя заливки рамки |
| sync | [необязательно] ожидать завершения операции |
| acquire_fence_fd | [обязательно] в асинхронном режиме запустить задание после ожидания сигнала acquire_fence |
| release_fence_fd | [обязательно] используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.21 Мозаика изображения

#### 3.21.1 immosaic

```text
IM_API IM_STATUS immosaic(const rga_buffer_t image,
                          im_rect rect,
                          int mosaic_mode,
                          int sync = 1,
                          int *release_fence_fd = NULL);
```

Применить мозаичную маскировку к указанной области изображения.

| Параметр | Описание |
| --- | --- |
| image | [обязательно] целевое изображение |
| rect | [обязательно] область для мозаики |
| мозаика_mode | [обязательно] режим мозаики<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.21.2 immosaicArray

```text
IM_API IM_STATUS immosaicArray(const rga_buffer_t image,
                               im_rect *rect_array,
                               int array_size,
                               int mosaic_mode,
                               int sync = 1,
                               int *release_fence_fd = NULL);
```

Поочерёдно применить мозаичную маскировку к нескольким областям изображения.

| Параметр | Описание |
| --- | --- |
| image | [обязательно] целевое изображение |
| rect_array | [обязательно] array_ptr областей для мозаики |
| array_size | [обязательно] размер массивов областей. |
| мозаика_mode | [обязательно] режим мозаики<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |
| sync | [необязательно] ожидать завершения операции |
| release_fence_fd | [необязательно]используется асинхронно как параметр imsync() |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.21.3 immosaicTask

```text
IM_API IM_STATUS immosaicTask(im_job_handle_t job_handle,
                              const rga_buffer_t image,
                              im_rect rect,
                              int mosaic_mode);
```

Через job_handle добавить мозаичную маскировку в указанное задание. Использование соответствует immosaic.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| image | [обязательно] целевое изображение |
| rect | [обязательно] область для мозаики |
| мозаика_mode | [обязательно] режим мозаики<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.21.4 immosaicTaskArray

```text
IM_API IM_STATUS immosaicTaskArray(im_job_handle_t job_handle,
                                   const rga_buffer_t image,
                                   im_rect *rect_array,
                                   int array_size,
                                   int mosaic_mode);
```

Через job_handle добавить мозаичную маскировку нескольких областей изображения в указанное задание. Использование соответствует immosaicArray.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| image | [обязательно] целевое изображение |
| rect_array | [обязательно] array_ptr областей для мозаики |
| array_size | [обязательно] размер массивов областей. |
| мозаика_mode | [обязательно] режим мозаики<br>IM_MOSAIC_8<br>IM_MOSAIC_16<br>IM_MOSAIC_32<br>IM_MOSAIC_64<br>IM_MOSAIC_128 |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.22 Обработка изображения

#### 3.22.1 improcess

```text
IM_STATUS improcess(rga_buffer_t src,
                    rga_buffer_t dst,
                    rga_buffer_t pat,
                    im_rect srect,
                    im_rect drect,
                    im_rect prect,
                    int acquire_fence_fd,
                    int *release_fence_fd,
                    im_opt_t *opt,
                    int usage);
```

Функция комбинированных операций RGA. Остальные API построены на её основе; improcess поддерживает более сложные комбинации. Операции задаются через usage со следующим определением:

```text
typedef enum {
    /* Rotation */
    IM_HAL_TRANSFORM_ROT_90     = 1 << 0,
    IM_HAL_TRANSFORM_ROT_180    = 1 << 1,
    IM_HAL_TRANSFORM_ROT_270    = 1 << 2,
    IM_HAL_TRANSFORM_FLIP_H     = 1 << 3,
    IM_HAL_TRANSFORM_FLIP_V     = 1 << 4,
    IM_HAL_TRANSFORM_FLIP_H_V   = 1 << 5,
    IM_HAL_TRANSFORM_MASK       = 0x3f,
    /*
     * Blend
     * Additional blend usage, can be used with both source and target configs.
     * If none of the below is set, the default "SRC over DST" is applied.
     */
    IM_ALPHA_BLEND_SRC_OVER     = 1 << 6,     /* Default, Porter-Duff "SRC over DST" */
    IM_ALPHA_BLEND_SRC          = 1 << 7,     /* Porter-Duff "SRC" */
    IM_ALPHA_BLEND_DST          = 1 << 8,     /* Porter-Duff "DST" */
    IM_ALPHA_BLEND_SRC_IN       = 1 << 9,     /* Porter-Duff "SRC in DST" */
    IM_ALPHA_BLEND_DST_IN       = 1 << 10,    /* Porter-Duff "DST in SRC" */
    IM_ALPHA_BLEND_SRC_OUT      = 1 << 11,    /* Porter-Duff "SRC out DST" */
    IM_ALPHA_BLEND_DST_OUT      = 1 << 12,    /* Porter-Duff "DST out SRC" */
    IM_ALPHA_BLEND_DST_OVER     = 1 << 13,    /* Porter-Duff "DST over SRC" */
    IM_ALPHA_BLEND_SRC_ATOP     = 1 << 14,    /* Porter-Duff "SRC ATOP" */
    IM_ALPHA_BLEND_DST_ATOP     = 1 << 15,    /* Porter-Duff "DST ATOP" */
    IM_ALPHA_BLEND_XOR          = 1 << 16,    /* Xor */
    IM_ALPHA_BLEND_MASK         = 0x1ffc0,

    IM_ALPHA_COLORKEY_NORMAL    = 1 << 17,
    IM_ALPHA_COLORKEY_INVERTED  = 1 << 18,
    IM_ALPHA_COLORKEY_MASK      = 0x60000,

    IM_SYNC                     = 1 << 19,
    IM_ASYNC                    = 1 << 26,
    IM_CROP                     = 1 << 20,    /* Unused */
    IM_COLOR_FILL               = 1 << 21,
    IM_COLOR_PALETTE            = 1 << 22,
    IM_NN_QUANTIZE              = 1 << 23,
    IM_ROP                      = 1 << 24,
    IM_ALPHA_BLEND_PRE_MUL      = 1 << 25,
} IM_USAGE;
```

| Параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение A |
| dst | [обязательно] выходное изображение |
| pat | [обязательно] входное изображение B |
| srect | [обязательно] область обрезки src |
| drect | [обязательно] область обрезки dst |
| prect | [обязательно] область обрезки pat |
| acquire_fence_fd | [обязательно] в асинхронном режиме запустить задание после ожидания сигнала acquire_fence |
| release_fence_fd | [обязательно] используется асинхронно как параметр imsync() |
| opt | [обязательно] параметры операции<br>typedef struct im_opt {<br>int color;<br>im_colorkey_range colorkey_range;<br>im_nn_t nn;<br>int rop_code;<br>int priority;<br>int core;<br>} im_opt_t; |
| usage | [обязательно] режим операции изображения |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

#### 3.22.2 improcessTask

```text
IM_API IM_STATUS improcessTask(im_job_handle_t job_handle,
                               rga_buffer_t src,
                               rga_buffer_t dst,
                               rga_buffer_t pat,
                               im_rect srect,
                               im_rect drect,
                               im_rect prect,
                               im_opt_t *opt_ptr,
                               int usage);
```

Через job_handle добавить комбинированную обработку изображения в указанное задание. Использование соответствует improcess.

| Параметр | Описание |
| --- | --- |
| job_handle | [обязательно] дескриптор задания |
| src | [обязательно] входное изображение A |
| dst | [обязательно] выходное изображение |
| pat | [обязательно] входное изображение B |
| srect | [обязательно] область обрезки src |
| drect | [обязательно] область обрезки dst |
| prect | [обязательно] область обрезки pat |
| acquire_fence_fd | [обязательно] в асинхронном режиме запустить задание после ожидания сигнала acquire_fence |
| release_fence_fd | [обязательно] используется асинхронно как параметр imsync() |
| opt | [обязательно] параметры операции<br>typedef struct im_opt {<br>int color;<br>im_colorkey_range colorkey_range;<br>im_nn_t nn;<br>int rop_code;<br>int priority;<br>int core;<br>} im_opt_t; |
| usage | [обязательно] режим операции изображения |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.23 Проверка параметров

#### 3.23.1 imcheck

```text
IM_API IM_STATUS imcheck(const rga_buffer_t src, const rga_buffer_t dst,
                         const im_rect src_rect, const im_rect dst_rect,
                         const int mode_usage);
IM_API IM_STATUS imcheck_composite(const rga_buffer_t src, const rga_buffer_t dst, const rga_buffer_t pat,
                                   const im_rect src_rect, const im_rect dst_rect, const im_rect pat_rect,
                                   const int mode_usage);
```

После настройки параметров задания RGA этот интерфейс проверяет их корректность и поддержку текущим оборудованием.

Рекомендуется использовать интерфейс только при разработке и отладке, чтобы повторные проверки не снижали производительность.

| Параметр | Описание |
| --- | --- |
| src | [обязательно] входное изображение A |
| dst | [обязательно] выходное изображение |
| pat | [необязательно] входное изображение B |
| srect | [обязательно] область обрезки src |
| drect | [обязательно] область обрезки dst |
| prect | [необязательно] область обрезки pat |
| usage | [необязательно] режим операции изображения |

При успехе возвращает IM_STATUS_NOERROR, иначе отрицательный код ошибки.

### 3.24 Синхронизация

#### 3.24.1 imsync

```text
IM_STATUS imsync(int fence_fd);
```

В асинхронном режиме передайте возвращённый release_fence_fd этому интерфейсу для ожидания завершения. Значение sync = 0 в других API включает асинхронный вызов, аналогичный OpenGL glFlush; последующий вызов imsync даёт эффект glFinish.

| Параметр | Описание |
| --- | --- |
| fence_fd | [обязательно] fence_fd для ожидания |

При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

### 3.25 Настройка контекста потока

#### 3.25.1 imconfig

```text
IM_STATUS  imconfig(IM_CONFIG_NAME name, uint64_t value);
```

Настройте контекст текущего потока с помощью различных имён конфигурации. Контекст задаёт значения потока по умолчанию и имеет меньший приоритет, чем аргументы интерфейса. Если параметр не задан при вызове, используется значение контекста; иначе действует аргумент текущего вызова.

| параметр | Описание |
| --- | --- |
| name | [обязательно] имя настройки контекста:<br>IM_CONFIG_SCHEDULER_CORE —— выбрать ядро обработки задания<br>IM_CONFIG_PRIORITY —— приоритет задания<br>IM_CHECK_CONFIG —— включение проверки |
| value | [обязательно] значение настройки<br>IM_CONFIG_SCHEDULER_CORE :<br>IM_SCHEDULER_RGA3_CORE0<br>IM_SCHEDULER_RGA3_CORE1<br>IM_SCHEDULER_RGA2_CORE0<br>IM_SCHEDULER_RGA3_DEFAULT<br>IM_SCHEDULER_RGA2_DEFAULT<br>IM_CONFIG_PRIORITY:<br>0 ~ 6<br>IM_CHECK_CONFIG:<br>TRUE<br>FALSE |

priority и core имеют очень высокие полномочия. Неправильное использование может вызвать сбой или взаимоблокировку системы. Рекомендуется применять их только при разработке и отладке, а не в продуктах. При успехе возвращает IM_STATUS_SUCCESS, иначе отрицательный код ошибки.

## 4. Структуры данных

В этой главе подробно описаны структуры данных интерфейсов приложений.

### 4.1 Обзор

| Структура данных | Описание |
| --- | --- |
| rga_buffer_t | Информация о буфере изображения |
| im_rect | Фактическая область обработки изображения |
| im_opt_t | Параметры операций изображения |
| im_job_handle_t | Дескриптор задания RGA |
| rga_buffer_handle_t | Дескриптор буфера изображения драйвера RGA |
| im_handle_param_t | Свойства импортируемого буфера изображения |
| im_context_t | Контекст текущего потока по умолчанию |
| im_nn_t | Параметры предобработки NN |
| im_colorkey_range | Диапазон цветового ключа |

### 4.2 Подробные описания

#### 4.2.1 rga_buffer_t

Информация о буфере изображения одного канала.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct {
    void* vir_addr;                     /* virtual address */
    void* phy_addr;                     /* physical address */
    int fd;                             /* shared fd */
    rga_buffer_handle_t handle;         /* buffer handle */

    int width;                          /* width */
    int height;                         /* height */
    int wstride;                        /* wstride */
    int hstride;                        /* hstride */
    int format;                         /* format */

    int color_space_mode;               /* color_space_mode */
    int global_alpha;                   /* global_alpha */
    int rd_mode;
} rga_buffer_t;
```

| Поле | Описание |
| --- | --- |
| vir_addr | Виртуальный адрес буфера. |
| phy_addr | Непрерывный физический адрес буфера. |
| fd | Файловый дескриптор DMA-буфера. |
| handle | Дескриптор памяти буфера, импортированного в RGA. |
| width | Ширина фактической области операции в пикселях. |
| height | Высота фактической области операции в пикселях. |
| wstride | Шаг ширины изображения в пикселях. |
| hstride | Шаг высоты изображения в пикселях. |
| format | Формат изображения. |
| color_space_mode | Цветовое пространство. |
| global_alpha | Глобальный альфа-компонент. |
| rd_mode | Режим чтения текущего канала. |

Примечания: выберите только одно из vir_addr, phy_addr, fd, handle для описания буфера. При присваивании нескольких полей выбирается одно по приоритету: handle &gt; phy_addr &gt; fd &gt; vir_addr.

#### 4.2.2 im_rect

Фактическая область операции одного канала.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct {
    int x;        /* upper-left x */
    int y;        /* upper-left y */
    int width;    /* width */
    int height;   /* height */
} im_rect;
```

| Поле | Описание |
| --- | --- |
| x | Начальная координата x фактической области операции в пикселях. |
| y | Начальная координата y фактической области операции в пикселях. |
| width | Ширина фактической области операции в пикселях. |
| height | Высота фактической области операции в пикселях. |

Область операции не должна выходить за размеры изображения: (x + width) &lt;= wstride и (y + height) &lt;= hstride.

#### 4.2.3 im_opt_t

Параметры обработки изображения текущего задания.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct im_opt {
    im_api_version_t version DEFAULT_INITIALIZER(RGA_CURRENT_API_HEADER_VERSION);
    int color;                          /* color, used by color fill */
    im_colorkey_range colorkey_range;   /* range value of color key */
    im_nn_t nn;
    int rop_code;
    int priority;
    int core;
    int mosaic_mode;
    im_osd_t osd_config;
    im_intr_config_t intr_config;
    char reserve[128];
} im_opt_t;
```

| Поле | Описание |
| --- | --- |
| version | Текущая версия заголовка |
| color | Цвет заливки изображения. |
| colorkey_range | Настройка диапазона цветового ключа. |
| nn | Предобработка NN (квантование). |
| rop_code | Настройка кода операции ROP. |
| priority | Приоритет текущего задания. |
| core | Аппаратное ядро текущего задания. |
| мозаика_mode | Режим мозаики. |
| osd_config | Настройка инверсии/статистики наложения текста OSD. |
| intr_config | Режим раннего прерывания. |
| reserve | Зарезервировано. |

priority и core имеют очень высокие полномочия. Неправильное использование может вызвать сбой или взаимоблокировку системы. Рекомендуется применять их только при разработке и отладке, а не в продуктах.

#### 4.2.4 im_job_handle_t

Дескриптор задания RGA, идентифицирующий настраиваемое задание.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef uint32_t im_job_handle_t;
```

При ошибке настройки освободите текущий дескриптор задания через imcancelJob, чтобы избежать утечки памяти.

#### 4.2.5 rga_buffer_handle_t

Дескриптор буфера изображения драйвера RGA.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef int rga_buffer_handle_t;
```

После использования памяти освободите её через releasebuffer_handle, чтобы избежать утечки.

#### 4.2.6 im_handle_param_t

Параметры описания импортируемого буфера изображения.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct im_handle_param {
    uint32_t width;
    uint32_t height;
    uint32_t format;
} im_handle_param_t;
```

| Поле | Описание |
| --- | --- |
| width_stride | Горизонтальный шаг импортируемого буфера в пикселях. |
| height_stride | Вертикальный шаг импортируемого буфера в пикселях. |
| format | Формат импортируемого буфера. |

Структура описывает размер выделенной памяти буфера. Если фактически выделено меньше указанного размера, importbuffer_T завершится ошибкой.

#### 4.2.7 im_nn_t

Параметры предобработки NN (квантования).

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct im_nn {
    int scale_r;                /* scaling factor on R channal */
    int scale_g;                /* scaling factor on G channal */
    int scale_b;                /* scaling factor on B channal */
    int offset_r;               /* offset on R channal */
    int offset_g;               /* offset on G channal */
    int offset_b;               /* offset on B channal */
} im_nn_t;
```

| Поле | Описание |
| --- | --- |
| scale_r | Коэффициент масштаба красного канала. |
| scale_g | Коэффициент масштаба зелёного канала. |
| scale_b | Коэффициент масштаба синего канала. |
| offset_r | Смещение красного канала. |
| offset_g | Смещение зелёного канала. |
| offset_b | Смещение синего канала. |

Примечания: нет.

#### 4.2.8 im_colorkey_range

Диапазон цветового ключа.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct {
    int max;                    /* The Maximum value of the color key */
    int min;                    /* The minimum value of the color key */
} im_colorkey_range;
```

| Поле | Описание |
| --- | --- |
| max | Максимум цветового ключа. |
| min | Минимум цветового ключа. |

Примечания: нет.

#### 4.2.9 im_osd_block_t

Настройка описания текстового блока OSD.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct im_osd_block {
    int width_mode;                 // normal or different
                                    //   IM_OSD_BLOCK_MODE_NORMAL
                                    //   IM_OSD_BLOCK_MODE_DIFFERENT
    union {
        int width;                  // normal_mode block width
        int width_index;            // different_mode block width index in RAM
    };

    int block_count;                // block count

    int background_config;          // background config is bright or dark
                                    //   IM_OSD_BACKGROUND_DEFAULT_BRIGHT
                                    //   IM_OSD_BACKGROUND_DEFAULT_DARK

    int direction;                  // osd block direction
                                    //   IM_OSD_MODE_HORIZONTAL
                                    //   IM_OSD_MODE_VERTICAL

    int color_mode;                 // using src1 color or config color
                                    //   IM_OSD_COLOR_PIXEL
                                    //   IM_OSD_COLOR_EXTERNAL
    im_color_t normal_color;        // config color: normal
    im_color_t invert_color;        // config color: invert
} im_osd_block_t;
```

| Поле | Описание |
| --- | --- |
| width_mode | Режим ширины блоков:<br>Одинаковая: IM_OSD_BLOCK_MODE_NORMAL.<br>Разная: IM_OSD_BLOCK_MODE_DIFFERENT. |
| width/width_index | width: в режиме одинаковой ширины задаёт ширину блока OSD текущего задания.<br>width_index: в режиме разной ширины задаёт индекс используемой таблицы ширин во внутренней RAM. |
| block_count | Число текстовых блоков |
| background_config | Яркость фона текста:<br>Чёрный текст на белом: IM_OSD_BACKGROUND_DEFAULT_BRIGHT.<br>Белый на чёрном: IM_OSD_BACKGROUND_DEFAULT_DARK. |
| direction | Направление OSD:<br>Вертикальное: IM_OSD_MODE_VERTICAL.<br>Горизонтальное: IM_OSD_MODE_HORIZONTAL. |
| color_mode | Цвет блока OSD:<br>Цвет пикселя: IM_OSD_COLOR_PIXEL.<br>Внешний цвет: IM_OSD_COLOR_EXTERNAL. |
| normal_color | Внешне заданный цвет текстового блока в обычном состоянии без инверсии. |
| invert_color | Внешне заданный цвет текстового блока при инверсии. |

Примечания: нет.

#### 4.2.10 im_osd_invert_factor_t

Настройка формулы инверсии цвета OSD.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct im_osd_invert_factor {
    uint8_t alpha_max;
    uint8_t alpha_min;
    uint8_t yg_max;
    uint8_t yg_min;
    uint8_t crb_max;
    uint8_t crb_min;
} im_osd_invert_factor_t;
```

Формула: `MAX(channel_min_factor, channel_max_factor - channel_value)`. Примечания: нет.

#### 4.2.11 im_osd_invert_t

Настройка инверсии цвета OSD.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct im_osd_invert {
    int invert_channel;         // invert channel config:
                                //   IM_OSD_INVERT_CHANNEL_NONE
                                //   IM_OSD_INVERT_CHANNEL_Y_G
                                //   IM_OSD_INVERT_CHANNEL_C_RB
                                //   IM_OSD_INVERT_CHANNEL_ALPHA
                                //   IM_OSD_INVERT_CHANNEL_COLOR
                                //   IM_OSD_INVERT_CHANNEL_BOTH
    int flags_mode;             // use external or inertnal RAM invert flags
                                //   IM_OSD_FLAGS_EXTERNAL
                                //   IM_OSD_FLAGS_INTERNAL
    int flags_index;            // flags index when using internal RAM invert flags

    uint64_t invert_flags;      // external invert flags
    uint64_t current_flags;     // current flags

    int invert_mode;            // invert use swap or factor
                                //   IM_OSD_INVERT_USE_FACTOR
                                //   IM_OSD_INVERT_USE_SWAP
    im_osd_invert_factor_t factor;

    int threash;
} im_osd_invert_t;
```

| Поле | Описание |
| --- | --- |
| invert_channel | Каналы инверсии:<br>По умолчанию нет: IM_OSD_INVERT_CHANNEL_NONE.<br>Y/G: IM_OSD_INVERT_CHANNEL_Y_G.<br>C(UV)/RB: IM_OSD_INVERT_CHANNEL_C_RB.<br>Alpha: IM_OSD_INVERT_CHANNEL_ALPHA.<br>Цвет: IM_OSD_INVERT_CHANNEL_COLOR, то есть (IM_OSD_INVERT_CHANNEL_Y_G &#124; IM_OSD_INVERT_CHANNEL_C_RB).<br>Все: IM_OSD_INVERT_CHANNEL_BOTH, то есть (IM_OSD_INVERT_CHANNEL_COLOR &#124; IM_OSD_INVERT_CHANNEL_ALPHA). |
| flags_mode | Режим управления инверсией (назначения источника):<br>Внутреннее: IM_OSD_FLAGS_EXTERNAL, флаги собраны во внутренней RAM.<br>Внешнее: IM_OSD_FLAGS_INTERNAL, управление извне. |
| flags_index | Индекс используемой таблицы флагов управления инверсией во внутренней RAM. |
| invert_flags | Внешняя 64-битная таблица управления инверсией. |
| current_flags | 64-битная таблица инверсии, собранная текущим заданием; читать после его завершения. |
| invert_mode | Режим инверсии:<br>Собственная формула: IM_OSD_INVERT_USE_FACTOR.<br>Стандартная: IM_OSD_INVERT_USE_SWAP; поменять U и V для YUV либо R и B для RGB. |
| factor | Формула инверсии цвета. |
| threash | Порог инверсии. |

Примечания: нет.

#### 4.2.12 im_osd_bpp2_t

Настройка отображения формата OSD BPP2 в RGB.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct im_osd_bpp2 {
    uint8_t  ac_swap;       // ac swap flag
                            // 0: CA
                            // 1: AC
    uint8_t  endian_swap;   // rgba2bpp endian swap
                            // 0: Big endian
                            // 1: Little endian
    im_color_t color0;
    im_color_t color1;
} im_osd_bpp2_t;
```

| Поле | Описание |
| --- | --- |
| ac_swap | Режим расположения AC. |
| endian_swap | Настройка порядка байтов. |
| color0 | Цвет отображения при color = 0. |
| color1 | Цвет отображения при color = 1. |

Примечания: нет.

#### 4.2.13 im_osd_t

Настройка функции OSD.

Путь: `im2d_api/im2d_type.h`. Определение:

```text
typedef struct im_osd {

  int osd_mode;                 // osd mode: statistics or auto_invert
  im_osd_block_t block_parm;    // osd block info config
  im_osd_invert_t invert_config;
  im_osd_bpp2_t bpp2_info;
} im_osd_t;
```

| Поле | Описание |
| --- | --- |
| osd_mode | Режим OSD:<br>Статистика: IM_OSD_MODE_STATISTICS.<br>Инверсия: IM_OSD_MODE_AUTO_INVERT. |
| block_parm | Параметры блока OSD. |
| invert_config | Настройка инверсии цвета. |
| bpp2_info | Настройка формата bpp2-rgb. |

Примечания: нет.

## 5. Тесты и отладка

Запуск демонстрационной программы и разбор её исходного кода помогают быстрее освоить описанные интерфейсы.

### 5.1 Тестовые файлы

Заранее подготовьте двоичные входные/выходные файлы теста. Готовые исходные изображения RGBA8888 находятся в /sample/sample_file. На Android поместите их в /data/, на Linux в /usr/data. Правила имён:

```text
in%dw%d-h%d-%s.bin
out%dw%d-h%d-%s.bin

⽰例：
1280×720 RGBA8888的输⼊图像： in0w1280-h720-rgba8888.bin
1280×720 RGBA8888的输出图像： out0w1280-h720-rgba8888.bin
```

Значения параметров: входные файлы используют in, выходные out. Первый %d — индекс, обычно 0, различающий файлы одинакового формата и размеров. Второй %d — ширина, обычно виртуальная; третий — высота, обычно виртуальная. Четвёртый %s — имя формата. Ниже приведены распространённые предустановленные форматы; строки остальных форматов см. в rgaUtils.cpp.

| format(Android) | format(Linux) | name |
| --- | --- | --- |
| HAL_PIXEL_FORMAT_RGB_565 | RK_FORMAT_RGB_565 | "rgb565" |
| HAL_PIXEL_FORMAT_RGB_888 | RK_FORMAT_RGB_888 | "rgb888" |
| HAL_PIXEL_FORMAT_RGBA_8888 | RK_FORMAT_RGBA_8888 | "rgba8888" |
| HAL_PIXEL_FORMAT_RGBX_8888 | RK_FORMAT_RGBX_8888 | "rgbx8888" |
| HAL_PIXEL_FORMAT_BGRA_8888 | RK_FORMAT_BGRA_8888 | "bgra8888" |
| HAL_PIXEL_FORMAT_YCrCb_420_SP | RK_FORMAT_YCrCb_420_SP | "crcb420sp" |
| HAL_PIXEL_FORMAT_YCrCb_NV12 | RK_FORMAT_YCbCr_420_SP | "nv12" |
| HAL_PIXEL_FORMAT_YCrCb_NV12_VIDEO | / | "nv12" |
| HAL_PIXEL_FORMAT_YCrCb_NV12_10 | RK_FORMAT_YCbCr_420_SP_10B | "nv12_10" |

Вход по умолчанию — 1280x720 RGBA8888. Подготовьте in0w1280-h720-rgba8888.bin в /data или /usr/data. Для композиции дополнительно нужен in1w1280-h720-rgba8888.bin в том же каталоге.

### 5.2 Отладка

После запуска demo выводит следующий журнал (пример копирования). Журнал Android:

```text
# rgaImDemo --copy

librga:RGA_GET_VERSION:3.02,3.020000                    //RGA版本
ctx=0x7ba35c1520,ctx->rgaFd=3                           //RGA上下⽂
Start selecting mode
im2d copy ..                                            //RGA运⾏模式
GraphicBuffer check ok
GraphicBuffer check ok
lock buffer ok
open file ok                                            //src⽂件的状态，如果/data/⽬录下没有对应⽂件这⾥会报错
unlock buffer ok
lock buffer ok
unlock buffer ok
copying .... successfully                               //标志运⾏成功
open /data/out0w1280-h720-rgba8888.bin and write ok     //输出⽂件名以及⽬录
```

Журнал Linux:

```text
# rgaImDemo --copy

librga:RGA_GET_VERSION:3.02,3.020000                    //RGA版本
ctx=0x2b070,ctx->rgaFd=3                                //RGA上下⽂
Rga built version:version:1.00
Start selecting mode
im2d copy ..                                            //RGA运⾏模式
open file                                               //src⽂件的状态，如果/usr/data/⽬录下没有对应⽂件这⾥会报错
copying .... Run successfully                           //标志运⾏成功
open /usr/data/out0w1280-h720-rgba8888.bin and write ok //输出⽂件名以及⽬录
```

Для подробного журнала RGA на Android включите вывод конфигурации свойством vendor.rga.log (sys.rga.log на Android 8 и более ранних версиях):

```text
setprop vendor.rga.log 1        打开RGA log打印
logcat -s librga                开启并过滤log打印
setprop vendor.rga.log 0        关闭RGA log打印
```

На Linux установите __DEBUG в 1 в core/NormalRgaContext.h и пересоберите.

```text
#ifdef LINUX

-#define __DEBUG 0
+#define __DEBUG 1
```

Ниже приведены типичные журналы. Их можно загрузить в RedMine для анализа соответствующими инженерами RK. Журнал Android:

```text
D librga  : <<<<-------- print rgaLog -------->>>>
D librga  : src->hnd = 0x0 , dst->hnd = 0x0
D librga  : srcFd = 11 , phyAddr = 0x0 , virAddr = 0x0
D librga  : dstFd = 15 , phyAddr = 0x0 , virAddr = 0x0
D librga  : srcBuf = 0x0 , dstBuf = 0x0
D librga  : blend = 0 , perpixelAlpha = 1
D librga  : scaleMode = 0 , stretch = 0;
D librga  : rgaVersion = 3.020000  , ditherEn =0
D librga  : srcMmuFlag = 1 , dstMmuFlag = 1 , rotateMode = 0
D librga  : <<<<-------- rgaReg -------->>>>
D librga  : render_mode=0 rotate_mode=0
D librga  : src:[b,0,e1000],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
D librga  : dst:[f,0,e1000],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
D librga  : pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0
D librga  : ROP:[0,0,0],LUT[0]
D librga  : color:[0,0,0,0,0]
D librga  : MMU:[1,0,80000521]
D librga  : mode[0,0,0,0]
```

Журнал Linux:

```text
render_mode=0 rotate_mode=0
src:[0,a681a008,a68fb008],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
dst:[0,a6495008,a6576008],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0
pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0
ROP:[0,0,0],LUT[0]
color:[0,0,0,0,0]
MMU:[1,0,80000521]
mode[0,0,0,0,0]
gr_color_x [0, 0, 0]
gr_color_x [0, 0, 0]
```

### 5.3 Тесты

Тесты находятся в sample/im2d_api_demo дерева исходников librga. Настройки demo можно менять по необходимости; первый запуск рекомендуется выполнять со стандартными настройками. Сборка зависит от платформы: Android поддерживает команду mm, а Linux создаёт тестовый исполняемый файл в том же каталоге при сборке librga.so через CMake. Перенесите файл на устройство через adb, разрешите исполнение, запустите и изучите журнал. Проверьте соответствие выходного файла ожиданиям.

#### 5.3.1 Выделение буферов изображения

Demo предоставляет буферы Graphicbuffer и AHardwareBuffer для композиции RGA; выбор задаётся макросом USE_AHARDWAREBUFFER.

```text
⽬录：librga/samples/im2d_api_demo/Android.mk
（line +15）

ifeq (1,$(strip $(shell expr $(PLATFORM_SDK_VERSION) \> 25)))
/*USE_AHARDWAREBUFFER为1则使⽤AHardwareBuffer，为0使⽤Graphicbuffer*/
LOCAL_CFLAGS += -DUSE_AHARDWAREBUFFER=1
endif
```

##### 5.3.1.1 Graphicbuffer

Три основные функции инициализируют Graphicbuffer, заполняют/очищают буфер и заполняют rga_buffer_t.

```text
/*传⼊src/dst的宽、⾼、图像格式，初始化Graphicbuffer*/
src_buf = GraphicBuffer_Init(SRC_WIDTH, SRC_HEIGHT, SRC_FORMAT);
dst_buf = GraphicBuffer_Init(DST_WIDTH, DST_HEIGHT, DST_FORMAT);

/*通过枚举值FILL_BUFF/EMPTY_BUFF，执⾏填充/清空Graphicbuffer*/
GraphicBuffer_Fill(src_buf, FILL_BUFF, 0);
if(MODE == MODE_BLEND)
    GraphicBuffer_Fill(dst_buf, FILL_BUFF, 1);
else
    GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);

/*填充rga_buffer_t结构体:src、dst*/
src = wrapbuffer_GraphicBuffer(src_buf);
dst = wrapbuffer_GraphicBuffer(dst_buf);
```

##### 5.3.1.2 AHardwareBuffer

Три основные функции инициализируют AHardwareBuffer, заполняют/очищают буфер и заполняют rga_buffer_t.

```text
/*传⼊src/dst的宽、⾼、图像格式，初始化AHardwareBuffer*/
AHardwareBuffer_Init(SRC_WIDTH, SRC_HEIGHT, SRC_FORMAT, &src_buf);
AHardwareBuffer_Init(DST_WIDTH, DST_HEIGHT, DST_FORMAT, &dst_buf);

/*通过枚举值FILL_BUFF/EMPTY_BUFF，执⾏填充/清空AHardwareBuffer*/
AHardwareBuffer_Fill(&src_buf, FILL_BUFF, 0);
if(MODE == MODE_BLEND)
    AHardwareBuffer_Fill(&dst_buf, FILL_BUFF, 1);
else
    AHardwareBuffer_Fill(&dst_buf, EMPTY_BUFF, 1);

/*填充rga_buffer_t结构体:src、dst*/
src = wrapbuffer_AHardwareBuffer(src_buf);
dst = wrapbuffer_AHardwareBuffer(dst_buf);
```

#### 5.3.2 Просмотр справки

Следующая команда выводит справку теста.

```text
rgaImDemo -h
rgaImDemo --help
rgaImDemo
```

После успешного выполнения используйте demo согласно выведенной справке:

```text
rk3399_Android10:/ # rgaImDemo
librga:RGA_GET_VERSION:3.02,3.020000
ctx=0x7864d7c520,ctx->rgaFd=3

=============================================================================================
   usage: rgaImDemo [--help/-h] [--while/-w=(time)] [--querystring/--querystring=<options>]
                    [--copy] [--resize=<up/down>] [--crop] [--rotate=90/180/270]
                    [--flip=H/V] [--translate] [--blend] [--cvtcolor]
                    [--fill=blue/green/red]
         --help/-h     Call help
         --while/w     Set the loop mode. Users can set the number of cycles by themselves.
         --querystring You can print the version or support information corresponding to the current version
of RGA according to the options.
                       If there is no input options, all versions and support information of the current
version of RGA will be printed.
                       <options>:
                       vendor           Print vendor information.
                       version          Print RGA version, and librga/im2d_api version.
                       maxinput         Print max input resolution.
                       maxoutput        Print max output resolution.
                       scalelimit       Print scale limit.
                       inputformat      Print supported input formats.
                       outputformat     Print supported output formats.
                       expected         Print expected performance.
                       all              Print all information.
         --copy        Copy the image by RGA.The default is 720p to 720p.
         --resize      resize the image by RGA.You can choose to up(720p->1080p) or down(720p->480p).
         --crop        Crop the image by RGA.By default, a picture of 300*300 size is cropped from (100,100).
         --rotate      Rotate the image by RGA.You can choose to rotate 90/180/270 degrees.

         --flip        Flip the image by RGA.You can choice of horizontal flip or vertical flip.
         --translate   Translate the image by RGA.Default translation (300,300).
         --blend       Blend the image by RGA.Default, Porter-Duff 'SRC over DST'.
         --cvtcolor    Modify the image format and color space by RGA.The default is RGBA8888 to NV12.
         --fill        Fill the image by RGA to blue, green, red, when you set the option to the corresponding
color.
=============================================================================================
```

Весь разбор аргументов находится в /librga/demo/im2d_api_demo/args.cpp.

#### 5.3.3 Циклический запуск demo

Следующая команда повторяет запуск demo. Команда цикла должна предшествовать всем аргументам. Число повторений имеет тип int; интервал по умолчанию 200ms.

```text
rgaImDemo -w6 --copy
rgaImDemo --while=6 --copy
```

#### 5.3.4 Запрос версии и возможностей RGA

Следующая команда запрашивает версию и поддерживаемые возможности:

```text
rgaImDemo --querystring
rgaImDemo --querystring=<options>
```

Команда принимает options; без них используется =all. Доступные варианты:

```text
options：
    =vendor             打印⼚商信息
    =version            打印版本信息
    =maxinput           打印⽀持的最⼤输⼊分辨率
    =maxoutput          打印⽀持的最⼤输出分辨率
    =scalelimit         打印⽀持的缩放倍数
    =inputformat        打印⽀持的输⼊格式
    =outputformat       打印⽀持的输出格式
    =expected           打印预期性能
    =all                打印所有信息
```

##### 5.3.4.1 Разбор кода

Аргументы main() определяют выводимую информацию.

```text
/*将main()传参转化为QUERYSTRING_INFO枚举值*/
IM_INFO = (QUERYSTRING_INFO)parm_data[MODE_QUERYSTRING];
/*打印querystring()返回的字符串，即所需要的信息*/
printf("\n%s\n", querystring(IM_INFO));
```

#### 5.3.5 Масштабирование изображения

Следующая команда тестирует масштабирование изображения.

```text
rgaImDemo --resize=up
rgaImDemo --resize=down
```

Функция требует указать вариант. Доступные варианты:

```text
options：
    =up                 图像分辨率放⼤⾄1920x1080
    =down               图像分辨率缩⼩⾄720x480
```

##### 5.3.5.1 Разбор кода

Аргумент up/down функции main() выбирает увеличение или уменьшение. Повторно инициализируйте и очистите буфер для выбранного случая, заполните rga_buffer_t и передайте итоговые дескрипторы изображений src и dst в imresize().

```text
switch(parm_data[MODE_RESIZE])
{
    /*放⼤图像*/
    case IM_UP_SCALE :
        /*重新初始化Graphicbuffer为分辨率1920x1080对应⼤⼩*/
        dst_buf = GraphicBuffer_Init(1920, 1080, DST_FORMAT);
        /*清空buffer*/
        GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);
        /*重新填充存储dst数据的rga_buffer_t结构体*/
        dst = wrapbuffer_GraphicBuffer(dst_buf);
        break;

    case IM_DOWN_SCALE :
        /*重新初始化Graphicbuffer为分辨率1920x1080对应⼤⼩*/
        dst_buf = GraphicBuffer_Init(720, 480, DST_FORMAT);
        /*清空buffer*/
        GraphicBuffer_Fill(dst_buf, EMPTY_BUFF, 1);
        /*重新填充存储dst数据的rga_buffer_t结构体*/
        dst = wrapbuffer_GraphicBuffer(dst_buf);
        break;
}
/*将rga_buffer_t格式的结构体src、dst传⼊imresize()*/
STATUS = imresize(src, dst);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("resizing .... %s\n", imStrError(STATUS));
```

#### 5.3.6 Обрезка изображения

Следующая команда тестирует обрезку изображения.

```text
rgaImDemo --crop
```

Вариантов нет. По умолчанию обрезается область LT(100,100), RT(400,100), LB(100,400), RB(400,400).

##### 5.3.6.1 Разбор кода

Задайте размеры обрезки в im_rect, описывающем прямоугольник src, затем передайте структуры rga_buffer_t с src и dst в imcrop().

```text
/*这⾥通过x、y确定裁剪顶点的坐标，width、height确定裁剪区域⼤⼩*/
src_rect.x      = 100;
src_rect.y      = 100;
src_rect.width  = 300;
src_rect.height = 300;

/*将im_rect格式的结构体src_rect与rga_buffer_t格式的结构体src、dst传⼊imcrop()*/
STATUS = imcrop(src, dst, src_rect);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("cropping .... %s\n", imStrError(STATUS));
```

#### 5.3.7 Поворот изображения

Следующая команда тестирует поворот изображения.

```text
rgaImDemo --rotate=90
rgaImDemo --rotate=180
rgaImDemo --rotate=270
```

Функция требует указать вариант. Доступные варианты:

```text
options：
    =90                 图像旋转90° ，输出图像分辨率宽⾼交换
    =180                图像旋转180°，输出图像分辨率不变
    =270                图像旋转270°，输出图像分辨率宽⾼交换
```

##### 5.3.7.1 Разбор кода

Аргумент main() 90/180/270 задаёт угол поворота. Преобразуйте его в значение перечисления IM_USAGE и передайте вместе со структурами rga_buffer_t для src и dst в imrotate().

```text
/*将main()传参转化为IM_USAGE枚举值*/
ROTATE = (IM_USAGE)parm_data[MODE_ROTATE];

/*将标识旋转⻆度的IM_USAGE枚举值与rga_buffer_t格式的结构体src、dst⼀同传⼊imrotate()*/
STATUS = imrotate(src, dst, ROTATE);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("rotating .... %s\n", imStrError(STATUS));
```

#### 5.3.8 Зеркальное отражение

Следующая команда тестирует зеркальное отражение.

```text
rgaImDemo --flip=H
rgaImDemo --flip=V
```

Функция требует указать вариант. Доступные варианты:

```text
options：
    =H                  图像⽔平镜像翻转
    =V                  图像垂直镜像翻转
```

##### 5.3.8.1 Разбор кода

Аргумент main() H/V выбирает направление отражения. Преобразуйте его в IM_USAGE и передайте вместе со структурами rga_buffer_t для src и dst в imflip().

```text
/*将main()传参转化为IM_USAGE枚举值*/
FLIP = (IM_USAGE)parm_data[MODE_FLIP];

/*将标识镜像反转⽅向的IM_USAGE枚举值与rga_buffer_t格式的结构体src、dst⼀同传⼊imflip()*/
STATUS = imflip(src, dst, FLIP);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("flipping .... %s\n", imStrError(STATUS));
```

#### 5.3.9 Заливка цветом

Следующая команда тестирует заливку цветом.

```text
rgaImDemo --fill=blue
rgaImDemo --fill=green
rgaImDemo --fill=red
```

Требуется вариант. Область заливки по умолчанию: LT(100,100), RT(400,100), LB(100,400), RB(400,400). Доступные варианты:

```text
options：
    =blue               图像颜⾊填充为蓝⾊
    =green              图像颜⾊填充为绿⾊
    =red                图像颜⾊填充为红⾊
```

##### 5.3.9.1 Разбор кода

Аргумент main() (bule/green/red — написание источника) выбирает цвет заливки. Задайте размеры в im_rect для dst, преобразуйте аргумент в шестнадцатеричное значение цвета и передайте его со структурой rga_buffer_t для dst в imfill().

```text
/*将main()传参转化为对应颜⾊的16进制数*/
COLOR = parm_data[MODE_FILL];

/*这⾥通过x、y确定裁剪顶点的坐标，width、height确定填充颜⾊区域⼤⼩*/
dst_rect.x      = 100;
dst_rect.y      = 100;
dst_rect.width  = 300;
dst_rect.height = 300;

/*将im_rect格式的结构体dst_rect、对应颜⾊的16进制数与rga_buffer_t格式的结构体src、dst⼀同传⼊imfill()*/
STATUS = imfill(dst, dst_rect, COLOR);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("filling .... %s\n", imStrError(STATUS));
```

#### 5.3.10 Смещение изображения

Следующая команда тестирует смещение изображения.

```text
rgaImDemo --translate
```

Вариантов нет. По умолчанию верхняя левая вершина смещается в (300,300): на 300 пикселей вправо и на 300 вниз.

##### 5.3.10.1 Разбор кода

Задайте смещения в im_rect для прямоугольника src и передайте структуры rga_buffer_t для src и dst в imtranslate().

```text
/*这⾥通过x、y确定平移后图像的顶点的坐标*/
src_rect.x = 300;
src_rect.y = 300;

/*将im_rect格式的结构体src_rect与rga_buffer_t格式的结构体src、dst⼀同传⼊imtranslate()*/
STATUS = imtranslate(src, dst, src_rect.x, src_rect.y);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("translating .... %s\n", imStrError(STATUS));
```

#### 5.3.11 Копирование изображения

Следующая команда тестирует копирование изображения.

```text
rgaImDemo --copy
```

Вариантов нет. По умолчанию копируется изображение 1280x720 RGBA8888.

##### 5.3.11.1 Разбор кода

Передайте структуры rga_buffer_t с данными src и dst в imcopy().

```text
/*rga_buffer_t格式的结构体src、dst传⼊imcopy()*/
STATUS = imcopy(src, dst);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("copying .... %s\n", imStrError(STATUS));
```

#### 5.3.12 Композиция изображения

Следующая команда тестирует композицию изображения.

```text
rgaImDemo --blend
```

Вариантов нет. Источник указывает режим композиции по умолчанию IM_ALPHA_BLEND_DST.

##### 5.3.12.1 Разбор кода

Передайте структуры rga_buffer_t с данными src и dst в imblend().

```text
/*rga_buffer_t格式的结构体src、dst传⼊imblend()*/
STATUS = imblend(src, dst);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("blending .... %s\n", imStrError(STATUS));
```

#### 5.3.13 Преобразование формата

Следующая команда тестирует преобразование формата изображения.

```text
rgaImDemo --cvtcolor
```

Вариантов нет. По умолчанию изображение 1280x720 преобразуется из RGBA8888 в NV12.

##### 5.3.13.1 Разбор кода

Задайте требуемые форматы в полях format структур rga_buffer_t и передайте структуры изображений src и dst в imcvtcolor().

```text
/*将转换前后的格式赋值给对应的rga_buffer_t结构体的成员变量format*/
src.format = HAL_PIXEL_FORMAT_RGBA_8888;
dst.format = HAL_PIXEL_FORMAT_YCrCb_NV12;

/*将需要转换的格式与rga_buffer_t格式的结构体src、dst⼀同传⼊imcvtcolor()*/
STATUS = imcvtcolor(src, dst, src.format, dst.format);
/*根据返回的IM_STATUS枚举值打印运⾏状态*/
printf("cvtcolor .... %s\n", imStrError(STATUS));
```

## Сопоставление источников: английский оригинал также V2.2.7

Ниже сохранены отличающиеся определения английского оригинала для прослеживаемости, а не для смешивания с предыдущим кодом. Проверьте реальные заголовки SDK, librga и драйвер. В английском оригинале отсутствуют пять структур OSD китайских §§4.2.9–4.2.13 и расширенные поля im_opt_t; выше они включены полностью.

§3.20.1 imfill: английский — buf, color по умолчанию 0x00000000, без release_fence_fd; китайский — dst, обязательный color и дополнительный release_fence_fd.

```text
IM_STATUS imfill(rga_buffer_t buf,
                 im_rect rect,
                 int color = 0x00000000,
                 int sync = 1);
```

§4.2.3 im_opt_t: сокращённая английская структура не содержит китайские поля version, mosaic_mode, osd_config, intr_config, reserve.

```text
typedef struct im_opt {
    int color;                          /* color, used by color fill */
    im_colorkey_range colorkey_range;   /* range value of color key */
    im_nn_t nn;
    int rop_code;

    int priority;
    int core;
} im_opt_t;
```

§4.2.6 im_handle_param_t: английский использует rga_memory_parm и width_stride/height_stride; китайский — im_handle_param и width/height. Английская таблица также описывает width_stride/height_stride. Не предполагайте одинаковый ABI.

```text
typedef struct rga_memory_parm im_handle_param_t;

struct rga_memory_parm {
    uint32_t width_stride;
    uint32_t height_stride;
    uint32_t format;
};
```

§3.8.1 imcopy: в английском оригинале лишняя закрывающая скобка после sync = 1. Ниже сохранён оригинал как сомнительное место; выше использована китайская сигнатура.

```text
IM_STATUS imcopy(const rga_buffer_t src,
                 rga_buffer_t dst,
                 int sync = 1),
                 int *release_fence_fd = NULL);
```

§3.15.1 imblend: английские srcA/dst соответствуют китайским fg_image/bg_image; различаются имена.

```text
IM_STATUS imblend(const rga_buffer_t srcA,
                  rga_buffer_t dst,
                  int mode = IM_ALPHA_BLEND_SRC_OVER,
                  int sync = 1,
                  int *release_fence_fd = NULL);
```

§3.15.1 imcomposite: английские srcA/srcB/dst соответствуют китайским fg_image/bg_image/output_image.

```text
IM_STATUS imcomposite(const rga_buffer_t srcA,
                      const rga_buffer_t srcB,
                      rga_buffer_t dst,
                      int mode = IM_ALPHA_BLEND_SRC_OVER,
                      int sync = 1,
                      int *release_fence_fd = NULL);
```

{% endraw %}
