---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Структуры операторов и миграция устаревших API"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-types-custom-migration"
slug: "rknn-v250-runtime-api-types-custom-migration"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Структуры операторов и миграция устаревших API | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Структуры операторов и миграция устаревших API | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-types-custom-migration/"
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

<!-- source EN p43 unit 467 -->

### 6.4. Структуры пользовательских операторов

<!-- source EN p43 unit 468 -->

### rknn_gpu_op_context

<!-- source EN p43 unit 469 -->

rknn_gpu_op_context содержит контекст пользовательского оператора, выполняемого указанной GPU. Определение структуры приведено в таблице:

<!-- source EN p43 unit 470 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| cl_context | void* | Объект OpenCL cl_context; при использовании выполните явное приведение к cl_context. |
| cl_command_queue | void* | Объект OpenCL cl_command_queue; при использовании выполните явное приведение к cl_command_queue. |
| cl_kernel | void* | Объект OpenCL cl_kernel; при использовании выполните явное приведение к cl_kernel. |

<!-- source EN p43 unit 471 -->

### rknn_custom_op_context

<!-- source EN p43 unit 472 -->

rknn_custom_op_context содержит контекст пользовательского оператора. Определение структуры приведено в таблице:

<!-- source EN p43 unit 473 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| target | rknn_target_type | Устройство исполнения пользовательских операторов: RKNN_TARGET_TYPE_CPU: CPU; RKNN_TARGET_TYPE_CPU: GPU. Повтор CPU для GPU присутствует в источнике и требует проверки. |
| internal_ctx | rknn_custom_op_interal_context | Внутренний контекст оператора. |
| gpu_ctx | rknn_gpu_op_context | Контекст OpenCL пользовательского оператора. При выполнении на GPU обратный вызов получает из этой структуры объекты OpenCL, например cl_context. |
| priv_data | void* | Указатели данных, управление которыми оставлено разработчику. |

<!-- source EN p43 unit 474 -->

### rknn_custom_op_tensor

<!-- source EN p43 unit 475 -->

rknn_custom_op_tensor описывает входной/выходной тензор пользовательского оператора. Определение структуры приведено в таблице:

<!-- source EN p43 unit 476 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| attr | rknn_tensor_attr | Имя, форма, размер и другие сведения о тензоре. |
| mem | rknn_tensor_mem | Адрес памяти тензора, fd, смещение действительных данных и другие сведения. |

<!-- source EN p43 unit 477 -->

### rknn_custom_op_attr

<!-- source EN p43 unit 478 -->

rknn_custom_op_attr описывает параметры или атрибуты пользовательского оператора. Определение структуры приведено в таблице:

<!-- source EN p43 unit 479 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| name | char[] | Имя параметра пользовательского оператора. |
| dtype | rknn_tensor_type | Тип данных каждого элемента. |
| n_elems | uint32_t | Число элементов. |
| data | void* | Виртуальный адрес области памяти данных параметра. |

<!-- source EN p43 unit 480 -->

### rknn_custom_op

<!-- source EN p43 unit 481 -->

rknn_custom_op содержит регистрационные сведения пользовательского оператора. Определение структуры приведено в таблице:

<!-- source EN p43 unit 482 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| version | uint32_t | Номер версии пользовательского оператора. |
| target | rknn_target_type | Тип вычислительного бэкенда оператора. |
| op_type | char[] | Тип пользовательского оператора. |
| cl_kernel_name | char[] | Имя функции ядра OpenCL. |
| cl_kernel_source | char* | Ресурс OpenCL: при cl_source_size=0 — абсолютный путь к файлу; при cl_source_size>0 — строка кода функции ядра. |
| cl_source_size | uint64_t | Если cl_kernel_source — строка, её длина; если путь к файлу — 0. |
| cl_build_options | char[] | Параметры компиляции ядра OpenCL. |
| init | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Указатель обратного вызова инициализации оператора. Вызывается один раз при регистрации. Если не нужен, допускается NULL. |
| prepare | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Указатель обратного вызова предварительной обработки. Вызывается один раз при rknn_run. Если не нужен, допускается NULL. |
| compute | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Указатель обратного вызова вычисления пользовательского оператора. Вызывается один раз при rknn_run. NULL недопустим. |
| compute_native | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Указатель высокопроизводительного вычислительного обратного вызова. Отличается от compute форматом входных и выходных тензоров. Пока не поддерживается; задаётся NULL. |
| destroy | int (*)(rknn_custom_op_context*<br>op_ctx); | Указатель обратного вызова освобождения ресурсов. Вызывается один раз при rknn_destroy. |

<!-- source EN p45 unit 484 -->

## 7. Изменения API, устаревшие интерфейсы и миграция

<!-- source EN p45 unit 485 -->

Добавления, изменения и устаревание интерфейсов по версиям перечислены в истории редакций оригинального справочника.

<!-- source EN p45 unit 486 -->

В V2.5.0 следующие интерфейсы устарели. Используйте указанные замены:

<!-- source EN p45 unit 487 -->

| Устаревший интерфейс | Замена |
| --- | --- |
| rknn_set_input_shape | rknn_set_input_shapes |
| rknn_matmul_create_dyn_shape | rknn_matmul_create_dynamic_shape |

<!-- source EN p45 unit 488 -->

Подробнее: rknn_set_input_shape (устаревший) в 5.3 «Выполнение инференса» и rknn_matmul_create_dyn_shape (устаревший) в 5.5 «Матричное умножение».

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
