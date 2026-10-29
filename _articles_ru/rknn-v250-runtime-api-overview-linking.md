---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Платформы, заголовки и компоновка"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-overview-linking"
slug: "rknn-v250-runtime-api-overview-linking"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Платформы, заголовки и компоновка | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Платформы, заголовки и компоновка | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-overview-linking/"
---

## Платформа и источник

Статья подготовлена по PDF производителя RKNN V2.5.0 и относится только к перечисленным в нём чипам и интерфейсам. Для платы ArmSoM сначала проверьте SoC, драйвер NPU, Toolkit/Runtime, SDK/BSP и версию ядра. Проверки на оборудовании ArmSoM не проводились; примеры и измерения оригинала не являются тестами ArmSoM.

## Навигация по серии

- [Платформы, заголовки и компоновка](/ru/articles/rknn-v250-runtime-api-overview-linking/)
- [Владение памятью и общий/zero-copy процессы](/ru/articles/rknn-v250-runtime-api-conventions-zero-copy/)
- [Устройство, контекст и флаги инициализации](/ru/articles/rknn-v250-runtime-api-device-context/)
- [Запросы модели, тензоров и динамических форм](/ru/articles/rknn-v250-runtime-api-query/)
- [Вход, выполнение, выход и динамические формы](/ru/articles/rknn-v250-runtime-api-inference/)
- [Тензоры, выделение памяти и синхронизация](/ru/articles/rknn-v250-runtime-api-tensor-memory/)
- [Матричное умножение и динамические формы](/ru/articles/rknn-v250-runtime-api-matmul/)
- [Регистрация и атрибуты пользовательских операторов](/ru/articles/rknn-v250-runtime-api-custom-operators/)
- [Коды состояния, тензоры, память и расширения](/ru/articles/rknn-v250-runtime-api-types-common/)
- [Структуры матричного умножения](/ru/articles/rknn-v250-runtime-api-types-matmul/)
- [Структуры операторов и миграция устаревших API](/ru/articles/rknn-v250-runtime-api-types-custom-migration/)

{% raw %}

<!-- source EN p6 unit 0 -->

## 1. Обзор справочника

<!-- source EN p6 unit 1 -->

RKNN C API — интерфейсы языка C для RKNPU Runtime (библиотеки времени выполнения). Они позволяют использовать вычислительную мощность NPU для эффективного инференса моделей RKNN или матричного умножения. Здесь описаны функции, структуры данных и коды возврата RKNN C API.

<!-- source EN p6 unit 2 -->

### 1.1 Версия

<!-- source EN p6 unit 3 -->

Документ относится к RKNPU Runtime V2.5.0 (см. историю редакций оригинального PDF). Описанные интерфейсы основаны на V2.5.0.

<!-- source EN p6 unit 4 -->

### 1.2 Поддерживаемые платформы

<!-- source EN p6 unit 5 -->

Документ относится к следующим аппаратным платформам:

<!-- source EN p6 unit 6 -->

RV1103

<!-- source EN p6 unit 7 -->

RV1103B

<!-- source EN p6 unit 8 -->

RV1106

<!-- source EN p6 unit 9 -->

RV1106B

<!-- source EN p6 unit 10 -->

RV1126B

<!-- source EN p6 unit 11 -->

RK2118

<!-- source EN p6 unit 12 -->

RK3562

<!-- source EN p6 unit 13 -->

Серия RK3566

<!-- source EN p6 unit 14 -->

Серия RK3568

<!-- source EN p6 unit 15 -->

Серия RK3576

<!-- source EN p6 unit 16 -->

Серия RK3588

<!-- source EN p6 unit 17 -->

### 1.3 Заголовки и библиотека Runtime

<!-- source EN p6 unit 18 -->

По назначению RKNN C API делится на три части. Соответствие функций, определений структур данных и заголовочных файлов следующее:

<!-- source EN p6 unit 19 -->

1. “rknn_api.h” определяет базовые интерфейсы и структуры данных для развёртывания модели RKNN.

<!-- source EN p6 unit 20 -->

2. “rknn_matmul_api.h” определяет интерфейсы и структуры данных матричного умножения.

<!-- source EN p6 unit 21 -->

3. “rknn_custom_op.h” определяет интерфейсы и структуры данных пользовательских операторов.

<!-- source EN p7 unit 22 -->

## 2. Компиляция и компоновка

<!-- source EN p7 unit 23 -->

При сборке приложения необходимо подключить заголовочный файл с функцией интерфейса и скомпоновать приложение с соответствующей библиотекой RKNPU Runtime для используемых аппаратной платформы и системы. Далее описаны заголовочные файлы RKNN C API и файлы библиотек времени выполнения.

<!-- source EN p7 unit 24 -->

### 2.1 Linux

<!-- source EN p7 unit 25 -->

1. Для RK3562, серий RK3566/RK3568/RK3576/RK3588 и RV1126B библиотека RKNPU называется librknnrt.so и находится в `&lt;sdk_path&gt;/rknpu2/runtime`, где `&lt;sdk_path&gt;` — путь к комплекту разработки Rockchip NPU.

<!-- source EN p7 unit 26 -->

2. Для RV1106/RV1103/RV1106B/RV1103B библиотека RKNPU — librknnmrt.so в `&lt;sdk_path&gt;/rknpu2/runtime`.

<!-- source EN p7 unit 27 -->

### 2.2 Android

<!-- source EN p7 unit 28 -->

На Android RKNN API можно вызывать двумя способами:

<!-- source EN p7 unit 29 -->

1) Приложение может непосредственно компоноваться с librknnrt.so.

<!-- source EN p7 unit 30 -->

2) На Android приложение компонуется с librknn_api_android.so, реализованной через HIDL.

<!-- source EN p7 unit 31 -->

Устройства Android, которые должны пройти CTS/VTS, должны использовать RKNN API на основе Android HIDL; librknn_api_android.so не включает матричное умножение и пользовательские операторы. Если CTS/VTS не требуется, рекомендуется напрямую использовать librknnrt.so, включающую обе эти функции: цепочка вызовов интерфейса короче и может обеспечивать лучшую производительность.

<!-- source EN p7 unit 32 -->

Код RKNN API через Android HIDL находится в vendor/rockchip/hardware/interfaces/neuralnetworks в Android SDK RK3562/RK3566/RK3568/RK3576/RK3588. После сборки системы создаются библиотеки RKNPU; приложению достаточно компоноваться с librknn_api_android.so, как показано ниже:

<!-- source EN p7 unit 33 -->

```text
/vendor/lib/librknn_api_android.so
/vendor/lib/librknnhal_bridge.rockchip.so
/vendor/lib64/librknn_api_android.so
/vendor/lib64/librknnhal_bridge.rockchip.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0-adapter-helper.so
/vendor/lib64/hw/rockchip.hardware.neuralnetworks@1.0-impl.so
/vendor/bin/hw/rockchip.hardware.neuralnetworks@1.0-service
```

<!-- source EN p7 unit 34 -->

Для отдельной повторной сборки этих библиотек также можно использовать следующую команду:

<!-- source EN p7 unit 35 -->

```c
mmm vendor/rockchip/hardware/interfaces/neuralnetworks/ -j8
```

<!-- source EN p7 unit 36 -->

### 2.3 Платформа RK2118

<!-- source EN p7 unit 37 -->

Для RK2118 библиотека RKNPU находится в системном SDK RK2118. См. раздел «Prepare RK2118 SDK» документа «RKNN3_RK2118_Quick_Start.pdf».

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
