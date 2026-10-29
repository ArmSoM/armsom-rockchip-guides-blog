---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Владение памятью и общий/zero-copy процессы"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-conventions-zero-copy"
slug: "rknn-v250-runtime-api-conventions-zero-copy"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Владение памятью и общий/zero-copy процессы | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Владение памятью и общий/zero-copy процессы | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-conventions-zero-copy/"
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

<!-- source EN p8 unit 38 -->

## 3. Общие соглашения C API

<!-- source EN p8 unit 39 -->

### 3.1 Различия платформ

<!-- source EN p8 unit 40 -->

Из-за аппаратных различий набор интерфейсов и параметров RKNN C API зависит от платформы. Поддержка интерфейсов приведена в таблице 3-1:

<!-- source EN p8 unit 41 -->

Таблица 3-1. Поддержка RKNN C API на аппаратных платформах

<!-- source EN p8 unit 42 -->

|  | RKNN C API | RV1126B/RK3562/RK3566/<br>RK3568 | RK3576/ RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B | RK2118 |
| --- | --- | --- | --- | --- | --- |
| 1 | rknn_init | √ | √ | √ | √ |
| 2 | rknn_set_core_mask | × | √ | × | × |
| 3 | rknn_dup_context | √ | √ | × | × |
| 4 | rknn_destroy | √ | √ | √ | √ |
| 5 | rknn_query | √ | √ | √ | √ |
| 6 | rknn_inputs_set | √ | √ | × | × |
| 7 | rknn_run | √ | √ | √ | √ |
| 8 | rknn_wait | × | × | × | × |
| 9 | rknn_outputs_get | √ | √ | × | × |
| 10 | rknn_outputs_release | √ | √ | × | × |
| 11 | rknn_create_mem_from_mb_blk | × | × | × | × |
| 12 | rknn_create_mem_from_phys | √ | √ | √ | √ |
| 13 | rknn_create_mem_from_fd | √ | √ | √ | × |
| 14 | rknn_create_mem | √ | √ | √ | √ |
| 15 | rknn_destroy_mem | √ | √ | √ | √ |
| 16 | rknn_set_weight_mem | √ | √ | √ | √ |
| 17 | rknn_set_internal_mem | √ | √ | √ | √ |
| 18 | rknn_set_io_mem | √ | √ | √ | √ |
| 19 | rknn_set_input_shapes | √ | √ | × | × |
| 20 | rknn_mem_sync | √ | √ | √ | √ |
| 21 | rknn_matmul_create | √ | √ | × | × |
| 22 | rknn_matmul_set_io_mem | √ | √ | × | × |
| 23 | rknn_matmul_set_core_mask | × | √ | × | × |
| 24 | rknn_matmul_run | √ | √ | × | × |
| 25 | rknn_matmul_destroy | √ | √ | × | × |
| 26 | rknn_register_custom_ops | √ | √ | × | × |
| 27 | rknn_custom_op_get_op_attr | √ | √ | × | × |
| 28 | rknn_set_batch_core_num | × | √ | × | × |
| 29 | rknn_matmul_set_quant_params | √ | √ | × | × |
| 30 | rknn_matmul_get_quant_params | √ | √ | × | × |
| 31 | rknn_matmul_create_dynamic_shape | √ | √ | × | × |
| 32 | rknn_matmul_set_dynamic_shape | √ | √ | × | × |
| 33 | rknn_B_normal_layout_to_native_layout | √ | √ | × | × |
| 34 | rknn_create_mem2 | √ | √ | √ | √ |

<!-- source EN p9 unit 43 -->

Поддержка параметров запроса rknn_query на разных платформах приведена в таблице 3-2:

<!-- source EN p9 unit 44 -->

Таблица 3-2. Поддерживаемые параметры rknn_query по платформам

<!-- source EN p9 unit 45 -->

|  | Параметры rknn_query | RV1126B/RK3562/RK3566/<br>RK3568 | RK3576/ RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B/RK2118 |
| --- | --- | --- | --- | --- |
| 1 | RKNN_QUERY_IN_OUT_NUM | √ | √ | √ |
| 2 | RKNN_QUERY_INPUT_ATTR | √ | √ | √ |
| 3 | RKNN_QUERY_OUTPUT_ATTR | √ | √ | √ |
| 4 | RKNN_QUERY_PERF_DETAIL | √ | √ | × |
| 5 | RKNN_QUERY_PERF_RUN | √ | √ | × |
| 6 | RKNN_QUERY_SDK_VERSION | √ | √ | √ |
| 7 | RKNN_QUERY_MEM_SIZE | √ | √ | √ |
| 8 | RKNN_QUERY_CUSTOM_STRING | √ | √ | √ |
| 9 | RKNN_QUERY_NATIVE_INPUT_ATTR | √ | √ | √ |
| 10 | RKNN_QUERY_NATIVE_OUTPUT_ATTR | √ | √ | √ |
| 11 | RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | √ | √ | √ |
| 12 | RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | √ | √ | √ |
| 13 | RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | √ | √ | √ |
| 14 | RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | √ | √ | √ |
| 15 | RKNN_QUERY_INPUT_DYNAMIC_RANGE | √ | √ | × |
| 16 | RKNN_QUERY_DEVICE_MEM_INFO | × | × | √ |
| 17 | RKNN_QUERY_CURRENT_INPUT_ATTR | √ | √ | × |
| 18 | RKNN_QUERY_CURRENT_OUTPUT_ATTR | √ | √ | × |
| 19 | RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | √ | √ | × |
| 20 | RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | √ | √ | × |

<!-- source EN p9 unit 46 -->

### 3.2 Владение памятью

<!-- source EN p9 unit 47 -->

Память API: тензорная память, выделенная rknn_create_mem, принадлежит вызывающей стороне. По окончании использования её необходимо освободить rknn_destroy_mem. Не допускайте двойного освобождения.

<!-- source EN p9 unit 48 -->

Память пользователя: память, переданная rknn_set_weight_mem, rknn_set_internal_mem и rknn_set_io_mem, остаётся собственностью вызывающей стороны, которая освобождает её после использования.

<!-- source EN p9 unit 49 -->

Обёртки внешней памяти: rknn_create_mem_from_fd, rknn_create_mem_from_phys и rknn_create_mem_from_mb_blk связывают ранее выделенную память (дескриптор файла, физический адрес или mb_blk) с RKNN для zero-copy. Объект-обёртку rknn_tensor_mem также необходимо освободить через rknn_destroy_mem.

<!-- source EN p9 unit 50 -->

### 3.3 Срок действия входных и выходных данных

<!-- source EN p9 unit 51 -->

Массив inputs и данные, на которые указывает buf в rknn_inputs_set, должны оставаться действительными во время вызова.

<!-- source EN p9 unit 52 -->

Массив outputs для rknn_outputs_get пользователь создаёт заранее, задавая index. При is_prealloc=1 buf заранее выделяется пользователем и должен быть действительным во время вызова. При is_prealloc=0 buf выделяет интерфейс, и память остаётся действительной до rknn_outputs_release. После освобождения указатель buf недействителен и не должен использоваться.

<!-- source EN p9 unit 53 -->

Память входных/выходных тензоров, заданная rknn_set_io_mem, должна оставаться действительной во время вызова и быть установлена до rknn_run.

<!-- source EN p9 unit 54 -->

### 3.4 Возвращаемые значения и обработка ошибок

<!-- source EN p10 unit 55 -->

Большинство интерфейсов возвращают int: 0 означает успех, отрицательное значение — ошибку. Некоторые возвращают указатели (rknn_create_mem, rknn_create_mem_from_fd, rknn_create_mem_from_phys, rknn_create_mem_from_mb_blk) и NULL при ошибке.

<!-- source EN p10 unit 56 -->

Полные определения приведены в 6.1 «Коды состояния».

<!-- source EN p10 unit 57 -->

Проверяйте результат каждого вызова и определяйте причину по коду: например, RKNN_ERR_DEVICE_UNMATCH означает несовпадение версии, RKNN_ERR_CTX_INVALID — недействительный контекст.

<!-- source EN p10 unit 58 -->

### 3.5 Общий API и zero-copy API

<!-- source EN p10 unit 59 -->

При инференсе данные проходят обработку входа, выполнение модели на NPU и обработку выхода. В зависимости от формата и квантования используются общий API либо zero-copy API. Основные различия использования и последовательности вызовов:

<!-- source EN p10 unit 60 -->

Общий API: простой набор интерфейсов rknn_inputs_set/rknn_outputs_get/rknn_outputs_release. При каждом обновлении кадра данные внешнего модуля копируются во входную память NPU Runtime. Нормализация, квантование, преобразование компоновки и деквантование выполняются преимущественно CPU, инференс — NPU.

<!-- source EN p10 unit 61 -->

Zero-copy API: создаёт или оборачивает память через rknn_create_mem/rknn_create_mem_from_fd/rknn_create_mem_from_phys и задаёт её через rknn_set_io_mem. Прямое использование заранее выделенной памяти NPU Runtime или внешней системы, например DRM, уменьшает копирование, повышает производительность и снижает трафик памяти. Нормализация, квантование и инференс выполняются на NPU.

<!-- source EN p10 unit 62 -->

Выбор интерфейса: при наличии только виртуального адреса входных данных используется только общий API; при физическом адресе или fd — zero-copy API. Общий и zero-copy API нельзя смешивать.

<!-- source EN p10 unit 63 -->

Последовательность общего API (рисунок 3-1):

<!-- source EN p10 unit 64 -->

1. Вызовите rknn_init() для инициализации модели;

<!-- source EN p10 unit 65 -->

2. Запросите атрибуты входов/выходов через rknn_query();

<!-- source EN p10 unit 66 -->

3. Предварительно обработайте вход;

<!-- source EN p10 unit 67 -->

4. Задайте входные данные через rknn_inputs_set();

<!-- source EN p10 unit 68 -->

5. Выполните инференс через rknn_run();

<!-- source EN p10 unit 69 -->

6. Получите результаты через rknn_outputs_get();

<!-- source EN p10 unit 70 -->

7. Обработайте выход;

<!-- source EN p10 unit 71 -->

8. Освободите выходную память через rknn_outputs_release();

<!-- source EN p10 unit 72 -->

9. Уничтожьте RKNN через rknn_destroy().

<!-- source EN p11 unit 73 -->

![Иллюстрация из исходного PDF — 11](/assets/images/rknn-v250/apis/runtime/en/p011-figure-01.png)

<!-- source EN p11 unit 74 -->

Рисунок 3-1. Последовательность общего API

<!-- source EN p11 unit 75 -->

Последовательность zero-copy API (пример с памятью входа/выхода, выделенной Runtime, рисунок 3-2):

<!-- source EN p11 unit 76 -->

1. Вызовите rknn_init() для инициализации модели;

<!-- source EN p11 unit 77 -->

2. Запросите нативные атрибуты через rknn_query() (RKNN_QUERY_NATIVE_INPUT_ATTR/RKNN_QUERY_NATIVE_OUTPUT_ATTR);

<!-- source EN p11 unit 78 -->

3. Предварительно обработайте вход (необязательно);

<!-- source EN p11 unit 79 -->

4. Создайте входные/выходные rknn_tensor_mem через rknn_create_mem() (для внешней памяти используйте rknn_create_mem_from_fd()/rknn_create_mem_from_phys());

<!-- source EN p11 unit 80 -->

5. Задайте входную/выходную память через rknn_set_io_mem();

<!-- source EN p11 unit 81 -->

6. Выполните инференс через rknn_run();

<!-- source EN p11 unit 82 -->

7. Прочитайте выходную память из rknn_tensor_mem и выполните постобработку;

<!-- source EN p11 unit 83 -->

8. Освободите входную/выходную память через rknn_destroy_mem();

<!-- source EN p11 unit 84 -->

9. Уничтожьте RKNN через rknn_destroy().

<!-- source EN p12 unit 85 -->

![Иллюстрация из исходного PDF — 12](/assets/images/rknn-v250/apis/runtime/en/p012-figure-01.png)

<!-- source EN p12 unit 86 -->

Рисунок 3-2. Последовательность zero-copy API с внутренним выделением памяти

<!-- source EN p12 unit 87 -->

Подробнее о rknn_set_io_mem() см. 5.4 «Тензоры и память».

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
