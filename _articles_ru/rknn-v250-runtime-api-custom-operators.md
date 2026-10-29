---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Регистрация и атрибуты пользовательских операторов"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-custom-operators"
slug: "rknn-v250-runtime-api-custom-operators"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Регистрация и атрибуты пользовательских операторов | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Регистрация и атрибуты пользовательских операторов | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-custom-operators/"
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

<!-- source EN p34 unit 386 -->

### 5.6. Пользовательские операторы

<!-- source EN p34 unit 387 -->

Регистрация пользовательских операторов и получение их атрибутов.

<!-- source EN p34 unit 388 -->

### rknn_register_custom_ops

<!-- source EN p34 unit 389 -->

После успешной инициализации контекста функция регистрирует несколько пользовательских операторов: их типы, типы вычислительного бэкенда, сведения о ядрах OpenCL и указатели обратных вызовов. После регистрации во время инференса rknn_run вызывает функции, реализованные разработчиком.

<!-- source EN p34 unit 390 -->

| API | rknn_register_custom_ops |
| --- | --- |
| Описание | Регистрирует несколько пользовательских операторов в контексте. |
| Параметры | rknn_context *context: указатель rknn_context. До вызова контекст должен быть успешно инициализирован. |
| Параметры | rknn_custom_op* op: массив сведений об операторах; каждый элемент — объект структуры rknn_custom_op. |
| Параметры | uint32_t custom_op_num: длина массива сведений об операторах. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p35 unit 392 -->

Пример кода:

<!-- source EN p35 unit 393 -->

```c
// CPU operators
rknn_custom_op user_op[2];
memset(user_op, 0, 2 * sizeof(rknn_custom_op));
strncpy(user_op[0].op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op[0].version = 1;
user_op[0].target = RKNN_TARGET_TYPE_CPU;
user_op[0].init = custom_op_init_callback;
user_op[0].compute = compute_custom_softmax_float32;
user_op[0].destroy = custom_op_destroy_callback;

strncpy(user_op[1].op_type, "ArgMax", RKNN_MAX_NAME_LEN - 1);
user_op[1].version = 1;
user_op[1].target = RKNN_TARGET_TYPE_CPU;
user_op[1].init = custom_op_init_callback;
user_op[1].compute = compute_custom_argmax_float32;
user_op[1].destroy = custom_op_destroy_callback;

ret = rknn_register_custom_ops(ctx, user_op, 2);
if (ret < 0) {
  printf("rknn_register_custom_ops fail! ret = %d\n", ret);
  return -1;
}
```

<!-- source EN p35 unit 394 -->

### rknn_custom_op_get_op_attr

<!-- source EN p35 unit 395 -->

Функция получает параметры пользовательского оператора внутри его обратного вызова, например axis оператора Softmax. Передаются имя поля параметра и указатель на rknn_custom_op_attr. После вызова значение помещается в поле data структуры. Разработчик приводит указатель согласно dtype в возвращённой структуре к адресу начала массива нужного типа C и считывает полное значение параметра по числу элементов.

<!-- source EN p35 unit 396 -->

| API | rknn_custom_op_get_op_attr |
| --- | --- |
| Описание | Получает параметры или атрибуты пользовательского оператора. |
| Параметры | rknn_custom_op_context* op_ctx: указатель контекста оператора. |
| Параметры | const char* attr_name: имя поля параметра оператора. |
| Параметры | rknn_custom_op_attr* op_attr: структура, представляющая значение параметра оператора. |
| Возвращаемое значение | Нет значения. |

<!-- source EN p35 unit 397 -->

Пример кода:

<!-- source EN p35 unit 398 -->

```c
rknn_custom_op_attr op_attr;
rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
   axis = ((int64_t*)op_attr.data)[0];
}
...
```

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
