---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Вход, выполнение, выход и динамические формы"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-inference"
slug: "rknn-v250-runtime-api-inference"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Вход, выполнение, выход и динамические формы | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Вход, выполнение, выход и динамические формы | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-inference/"
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

<!-- source EN p23 unit 245 -->

### 5.3. Выполнение инференса

<!-- source EN p23 unit 246 -->

Настройка входов, инференс, получение выходов и динамические формы.

<!-- source EN p23 unit 247 -->

### rknn_inputs_set

<!-- source EN p23 unit 248 -->

rknn_inputs_set задаёт входные данные модели. Поддерживается несколько входов, каждый представлен объектом rknn_input. До вызова rknn_inputs_set пользователь должен заполнить поля этих объектов. Недоступно на RV1106/RV1103/RV1103B/RV1106B/RK2118.

<!-- source EN p23 unit 249 -->

| API | rknn_inputs_set |
| --- | --- |
| Описание | Задаёт входные данные модели. |
| Параметр | rknn_context context: объект rknn_contex (написание источника). |
| Параметр | uint32_t n_inputs: число входов. |
| Параметр | rknn_input inputs[]: массив rknn_input. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p23 unit 250 -->

Пример кода:

<!-- source EN p23 unit 251 -->

```c
rknn_input inputs[1];
memset(inputs, 0, sizeof(inputs));
inputs[0].index = 0;
inputs[0].type = RKNN_TENSOR_UINT8;
inputs[0].size = img_width*img_height*img_channels;
inputs[0].fmt = RKNN_TENSOR_NHWC;
inputs[0].buf = in_data;
inputs[0].pass_through = 0;

ret = rknn_inputs_set(ctx, 1, inputs);
```

<!-- source EN p23 unit 252 -->

### rknn_run

<!-- source EN p23 unit 253 -->

rknn_run выполняет инференс модели. До вызова входные данные следует настроить через rknn_inputs_set или интерфейс без копирования.

<!-- source EN p23 unit 254 -->

| API | rknn_run |
| --- | --- |
| Описание | Выполняет инференс модели. |
| Параметр | rknn_context context: объект rknn_contex (написание источника). |
| Параметр | rknn_run_extend* extend: резерв расширения; в описываемой версии не используется, допускается только NULL. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p23 unit 255 -->

Пример кода:

<!-- source EN p23 unit 256 -->

```c
ret = rknn_run(ctx, NULL);
```

<!-- source EN p23 unit 257 -->

### rknn_outputs_get

<!-- source EN p23 unit 258 -->

rknn_outputs_get получает выходные данные модели. Можно получить несколько выходов, каждый представлен объектом rknn_output, который необходимо создать и инициализировать перед вызовом. RV1106/RV1103/RV1106B/RV1103B/RK2118 не поддерживаются.

<!-- source EN p24 unit 260 -->

Есть два способа предоставления буферов выходных данных:

<!-- source EN p24 unit 261 -->

1. Пользователь сам выделяет и освобождает буферы. Тогда rknn_output.is_prealloc=1, а rknn_output.buf указывает на выделенный пользователем буфер.

<!-- source EN p24 unit 262 -->

2. Память выделяет rknn. Тогда rknn_output.is_prealloc=0. После выполнения функции создаётся rknn_output.buf с выходными данными.

<!-- source EN p24 unit 263 -->

| API | rknn_outputs_get |
| --- | --- |
| Описание | Получает выходные данные инференса. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | uint32_t n_outputs: число выходов. |
| Параметр | rknn_output outputs[]: массив rknn_output. |
| Параметр | rknn_run_extend* extend: резерв расширения; пока не используется, допускается только NULL. Тип сохранён по источнику. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p24 unit 264 -->

Пример кода:

<!-- source EN p24 unit 265 -->

```c
rknn_output outputs[io_num.n_output];
memset(outputs, 0, sizeof(outputs));
for (int i = 0; i < io_num.n_output; i++) {
   outputs[i].index = i;
   outputs[i].is_prealloc = 0;
   outputs[i].want_float = 1;
}
ret = rknn_outputs_get(ctx, io_num.n_output, outputs, NULL);
```

<!-- source EN p24 unit 266 -->

### rknn_outputs_release

<!-- source EN p24 unit 267 -->

rknn_outputs_release освобождает ресурсы объекта rknn_output.

<!-- source EN p24 unit 268 -->

| API | rknn_outputs_release |
| --- | --- |
| Описание | Освобождает объект rknn_output. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | uint32_t n_outputs: число выходов. |
| Параметр | rknn_output outputs[]: массив освобождаемых rknn_output. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p24 unit 269 -->

Пример кода:

<!-- source EN p24 unit 270 -->

```c
ret = rknn_outputs_release(ctx, io_num.n_output, outputs);
```

<!-- source EN p24 unit 271 -->

rknn_set_input_shape (устаревший интерфейс)

<!-- source EN p24 unit 272 -->

Интерфейс устарел. Для привязки форм входа используйте rknn_set_input_shapes. В текущей версии старый интерфейс недоступен. Для продолжения его использования нужен SDK 1.5.0 и руководство версии 1.5.0.

<!-- source EN p24 unit 273 -->

### rknn_set_input_shapes

<!-- source EN p24 unit 274 -->

Для модели с динамическим входом перед инференсом укажите текущую форму. Передаются число входов и массив rknn_tensor_attr с формами и компоновками. Заполните index, name, dims и fmt каждого элемента; остальные поля не требуются. Через rknn_query можно заранее получить число входных форм и список поддерживаемых динамических форм. Форма входа должна входить в этот список. Вызов необходим при первом запуске и каждом переключении формы; иначе повторять его не нужно.

<!-- source EN p25 unit 276 -->

| API | rknn_set_input_shapes |
| --- | --- |
| Описание | Задаёт текущую форму входа модели. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | uint32_t n_inputs: число входных тензоров. |
| Параметр | rknn_tensor_attr *: указатель массива атрибутов со всеми формами входов. Для каждого входа задаются index, name, dims, fmt и n_dims; остальные поля не требуются. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p25 unit 277 -->

Пример кода:

<!-- source EN p25 unit 278 -->

```c
for (int i = 0; i < io_num.n_input; i++) {
   for (int j = 0; j < input_attrs[i].n_dims; ++j) {
      input_attrs[i].dims[j] = dyn_range[i].dyn_range[0][j];
   }
}
ret = rknn_set_input_shapes(ctx, io_num.n_input, input_attrs);
if (ret < 0) {
   fprintf(stderr, "rknn_set_input_shapes error! ret=%d\n", ret);
   return -1;
}
```

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
