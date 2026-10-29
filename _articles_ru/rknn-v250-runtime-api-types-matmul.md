---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Структуры матричного умножения"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-types-matmul"
slug: "rknn-v250-runtime-api-types-matmul"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Структуры матричного умножения | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Структуры матричного умножения | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-types-matmul/"
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

<!-- source EN p40 unit 449 -->

### 6.3. Структуры матричного умножения

<!-- source EN p40 unit 450 -->

### rknn_matmul_info

<!-- source EN p40 unit 451 -->

rknn_matmul_info задаёт спецификацию матричного умножения: размеры операции, тип данных и размещение входных и выходных матриц в памяти. Определение структуры приведено в таблице:

<!-- source EN p40 unit 452 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| M | int32_t | Число строк A. |
| K | int32_t | Число столбцов A. |
| N | int32_t | Число столбцов B. |
| type | rknn_matmul_type | Типы входных и выходной матриц:<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32: A/B — float16, C — float;<br>RKNN_INT8_MM_INT8_TO_INT32: A/B — int8, C — int32;<br>RKNN_INT8_MM_INT8_TO_INT8: A/B/C — int8;<br>RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT16: A/B/C — float16;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT32: A — float16, B — int8, C — float;<br>RKNN_FLOAT16_MM_INT8_TO_FLOAT16: A — float16, B — int8, C — float16;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT32: A — float16, B — int4, C — float;<br>RKNN_FLOAT16_MM_INT4_TO_FLOAT16: A — float16, B — int4, C — float16;<br>RKNN_INT8_MM_INT8_TO_FLOAT32: A/B — int8, C — float;<br>RKNN_INT4_MM_INT4_TO_INT16: A/B — int4, C — int16;<br>RKNN_INT8_MM_INT4_TO_INT32: A — int8, B — int4, C — int32. |
| B_layout | int16_t | Размещение памяти B. 0 означает форму [K,N]. RKNN_MM_LAYOUT_NORM — исходная форма KxN; RKNN_MM_LAYOUT_NATIVE — высокопроизводительное размещение; RKNN_MM_LAYOUT_TP_NORM — форма после транспонирования NxK. |
| B_quant_type | int16_t | Квантование B: RKNN_QUANT_TYPE_PER_LAYER_SYM — симметричное Per-Layer; RKNN_QUANT_TYPE_PER_LAYER_ASYM — асимметричное Per-Layer; RKNN_QUANT_TYPE_PER_CHANNEL_SYM — симметричное Per-Channel; RKNN_QUANT_TYPE_PER_CHANNEL_ASYM — асимметричное Per-Channel; RKNN_QUANT_TYPE_PER_GROUP_SYM — симметричное Per-Group; RKNN_QUANT_TYPE_PER_GROUP_ASYM — асимметричное Per-Group. |
| AC_layout | int16_t | Размещение данных A и C: RKNN_MM_LAYOUT_NORM — исходные формы; RKNN_MM_LAYOUT_NATIVE — высокопроизводительные формы. |
| AC_quant_type | int16_t | Квантование A и C: RKNN_QUANT_TYPE_PER_LAYER_SYM — симметричное Per-Layer; RKNN_QUANT_TYPE_PER_LAYER_ASYM — асимметричное Per-Layer. |
| iommu_domain_id | int32_t | Индекс домена адресного пространства IOMMU контекста матриц. Домен и контекст соответствуют друг другу один к одному; размер каждого домена — 4 GB. Параметр главным образом нужен при больших A/B/C, когда после выделения NPU более 4 GB в одном домене требуется переход в другой. |
| group_size | int16_t | Число элементов группы; действует только при групповом квантовании. |
| reserved | int8_t[] | Зарезервированное поле. |

<!-- source EN p42 unit 455 -->

### rknn_matmul_tensor_attr

<!-- source EN p42 unit 456 -->

rknn_matmul_tensor_attr описывает атрибуты тензора каждой матрицы: имя, форму, размер и тип данных. Определение структуры приведено в таблице:

<!-- source EN p42 unit 457 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| name | char[] | Имя матрицы. |
| n_dims | uint32_t | Число измерений матрицы. |
| dims | uint32_t[] | Форма матрицы. |
| size | uint32_t | Размер матрицы. |
| type | rknn_tensor_type | Тип данных матрицы. |

<!-- source EN p42 unit 458 -->

### rknn_matmul_io_attr

<!-- source EN p42 unit 459 -->

rknn_matmul_io_attr описывает все входные и выходные тензоры матричной операции, включая атрибуты матриц A, B и C. Определение структуры приведено в таблице:

<!-- source EN p42 unit 460 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| A | rknn_matmul_tensor_attr | Атрибуты тензора матрицы A. |
| B | rknn_matmul_tensor_attr | Атрибуты тензора матрицы B. |
| C | rknn_matmul_tensor_attr | Атрибуты тензора матрицы C. |

<!-- source EN p42 unit 461 -->

### rknn_quant_params

<!-- source EN p42 unit 462 -->

rknn_quant_params описывает параметры квантования матрицы: имя, указатели и длины массивов scale и zero_point. Поле name определяет имя матрицы; его можно получить из rknn_matmul_io_attr, возвращённой при инициализации контекста. Определение структуры приведено в таблице:

<!-- source EN p42 unit 463 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| name | char[] | Имя матрицы. |
| scale | float* | Указатель массива scale матрицы. |
| scale_len | int32_t | Длина массива scale матрицы. |
| zp | int32_t* | Указатель массива zero_point матрицы. |
| zp_len | int32_t | Длина массива zero_point матрицы. |

<!-- source EN p42 unit 464 -->

### rknn_matmul_shape

<!-- source EN p42 unit 465 -->

rknn_matmul_shape задаёт M, K и N матричного умножения определённой формы. При инициализации контекста с динамическими формами нужно передать число форм и массив rknn_matmul_shape со всеми входными формами. Определение структуры приведено в таблице:

<!-- source EN p42 unit 466 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| M | int32_t | Число строк A. |
| K | int32_t | Число столбцов A. |
| N | int32_t | Число столбцов C. |

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
