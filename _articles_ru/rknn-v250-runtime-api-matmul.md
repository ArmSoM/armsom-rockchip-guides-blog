---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Матричное умножение и динамические формы"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-matmul"
slug: "rknn-v250-runtime-api-matmul"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Матричное умножение и динамические формы | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Матричное умножение и динамические формы | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-matmul/"
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

<!-- source EN p30 unit 332 -->

### 5.5. Матричное умножение

<!-- source EN p30 unit 333 -->

Создание контекста матричного умножения, память, параметры квантования и выполнение.

<!-- source EN p30 unit 334 -->

### rknn_matmul_create

<!-- source EN p30 unit 335 -->

Функция инициализирует контекст матричного умножения по переданной спецификации и другим сведениям, возвращая форму, размер, тип данных и другие атрибуты входных и выходных тензоров. Здесь указатель rknn_matmul_ctx и rknn_context имеют одинаковую структуру данных.

<!-- source EN p30 unit 336 -->

| API | rknn_matmul_create |
| --- | --- |
| Описание | Инициализирует контекст матричного умножения. |
| Параметры | rknn_matmul_ctx* ctx: указатель контекста матричного умножения. |
| Параметры | rknn_matmul_info* info: указатель структуры спецификации матричного умножения. |
| Параметры | rknn_matmul_io_attr* io_attr: указатель структуры атрибутов входных/выходных тензоров матричного умножения. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p30 unit 337 -->

Пример кода:

<!-- source EN p30 unit 338 -->

```c
rknn_matmul_info info;
memset(&info, 0, sizeof(rknn_matmul_info));
info.M = 4;
info.K = 64;
info.N = 32;
info.type = RKNN_INT8_MM_INT8_TO_INT32;
info.B_layout = RKNN_MM_LAYOUT_NORM;
info.AC_layout = RKNN_MM_LAYOUT_NORM;

rknn_matmul_io_attr io_attr;
memset(&io_attr, 0, sizeof(rknn_matmul_io_attr));

int ret = rknn_matmul_create(&ctx, &info, &io_attr);
if (ret < 0) {
   printf("rknn_matmul_create fail! ret=%d\n", ret);
   return -1;
}
```

<!-- source EN p30 unit 339 -->

### rknn_matmul_set_io_mem

<!-- source EN p30 unit 340 -->

Функция задаёт память входов и выходов матричного умножения. Сначала создайте указатель rknn_tensor_mem через rknn_create_mem, затем передайте его вместе с указателем rknn_matmul_tensor_attr матрицы A, B или C, полученным от rknn_matmul_create. Это привязывает память к контексту операции. До вызова подготовьте данные матриц A и B согласно размещению памяти, настроенному в rknn_matmul_info.

<!-- source EN p30 unit 341 -->

| API | rknn_matmul_set_io_mem |
| --- | --- |
| Описание | Задаёт входную/выходную память матричного умножения. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
| Параметры | rknn_tensor_mem* mem: указатель структуры информации о памяти тензора. |
| Параметры | rknn_matmul_tensor_attr* attr: указатель структуры атрибутов входных/выходных тензоров матричного умножения. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p30 unit 342 -->

Пример кода:

<!-- source EN p31 unit 343 -->

```c
// Create A
rknn_tensor_mem* A = rknn_create_mem(ctx, io_attr.A.size);
if (A == NULL) {
  printf("rknn_create_mem fail!\n");
  return -1;
}
memset(A->virt_addr, 1, A->size);
rknn_matmul_io_attr io_attr;
memset(&io_attr, 0, sizeof(rknn_matmul_io_attr));

int ret = rknn_matmul_create(&ctx, &info, &io_attr);
if (ret < 0) {
  printf("rknn_matmul_create fail! ret=%d\n", ret);
  return -1;
}
// Set A
ret = rknn_matmul_set_io_mem(ctx, A, &io_attr.A);
if (ret < 0) {
  printf("rknn_matmul_set_io_mem fail! ret=%d\n", ret);
  return -1;
}
```

<!-- source EN p31 unit 344 -->

### rknn_matmul_set_core_mask

<!-- source EN p31 unit 345 -->

Функция задаёт доступные ядра NPU для матричного умножения; поддерживаются только RK3588 и RK3576. До вызова инициализируйте контекст через rknn_matmul_create. Маска выбирает используемые ядра для повышения производительности и эффективности матричного умножения.

<!-- source EN p31 unit 346 -->

| API | rknn_matmul_set_core_mask |
| --- | --- |
| Описание | Задаёт маску ядер NPU для матричного умножения. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
| Параметры | rknn_core_mask core_mask: маска доступных ядер NPU для матричного умножения. Каждый бит соответствует ядру: 1 — доступно, иначе недоступно. Подробности см. в параметрах rknn_set_core_mask. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p31 unit 347 -->

Пример кода:

<!-- source EN p31 unit 348 -->

```c
rknn_matmul_set_core_mask(ctx, RKNN_NPU_CORE_AUTO);
```

<!-- source EN p31 unit 349 -->

### rknn_matmul_set_quant_params

<!-- source EN p31 unit 350 -->

rknn_matmul_set_quant_params задаёт параметры квантования каждой матрицы в режимах Per-Channel и Per-Layer. При Per-Channel длина массивов scale и zp в rknn_quant_params равна N; при Per-Layer она равна 1. Вызовите интерфейс до rknn_matmul_run для настройки всех матриц. Без вызова применяется Per-Layer со scale=1.0 и zero_point=0.

<!-- source EN p31 unit 351 -->

| API | rknn_matmul_set_quant_params |
| --- | --- |
| Описание | Задаёт параметры квантования матрицы. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
| Параметры | rknn_quant_params* params: параметры квантования матрицы. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p31 unit 352 -->

Пример кода:

<!-- source EN p32 unit 353 -->

```c
rknn_quant_params params_a;
memcpy(params_a.name, io_attr.A.name, RKNN_MAX_NAME_LEN);
params_a.scale_len = 1;
params_a.scale = (float *)malloc(params_a.scale_len * sizeof(float));
params_a.scale[0] = 0.2;
params_a.zp_len = 1;
params_a.zp = (int32_t *)malloc(params_a.zp_len * sizeof(int32_t));
params_a.zp[0] = 0;
rknn_matmul_set_quant_params(ctx, &params_a);
```

<!-- source EN p32 unit 354 -->

### rknn_matmul_get_quant_params

<!-- source EN p32 unit 355 -->

rknn_matmul_get_quant_params используется при rknn_matmul_type=RKNN_INT8_MM_INT8_TO_INT32 и квантовании Per-Channel для получения нормализованных scale всех каналов матрицы B. Умножение полученного scale на исходный scale матрицы A даёт scale матрицы C. Это позволяет приблизительно вычислить scale C, когда реальное значение для C отсутствует.

<!-- source EN p32 unit 356 -->

| API | rknn_matmul_get_quant_params |
| --- | --- |
| Описание | Получает параметры квантования матрицы B. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
| Параметры | rknn_quant_params* params: параметры квантования матрицы B. |
| Параметры | float* scale: указатель scale матрицы B. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p32 unit 357 -->

Пример кода:

<!-- source EN p32 unit 358 -->

```c
float b_scale;
rknn_matmul_get_quant_params(ctx, &params_b, &b_scale);
```

<!-- source EN p32 unit 359 -->

rknn_matmul_create_dyn_shape (устаревший интерфейс)

<!-- source EN p32 unit 360 -->

Интерфейс устарел и заменён на rknn_matmul_create_dynamic_shape.

<!-- source EN p32 unit 361 -->

### rknn_matmul_create_dynamic_shape

<!-- source EN p32 unit 362 -->

rknn_matmul_create_dynamic_shape создаёт контекст матричного умножения с динамическими формами. Передаются rknn_matmul_info, число форм и соответствующий массив с несколькими значениями M, K и N. После успешной инициализации возвращается массив rknn_matmul_io_attr с формой, размером и типом данных всех входных и выходных матриц. В описываемой версии поддерживается задание нескольких различных M, K и N.

<!-- source EN p32 unit 363 -->

| API | rknn_matmul_create_dynamic_shape |
| --- | --- |
| Описание | Инициализирует контекст матричного умножения с динамическими формами. |
| Параметры | rknn_matmul_ctx *ctx: указатель контекста матричного умножения. |
| Параметры | rknn_matmul_info* info: указатель структуры спецификации матричного умножения. M, K и N задавать не требуется. |
| Параметры | int shape_num: число форм, поддерживаемых контекстом. |
| Параметры | rknn_matmul_shape dynamic_shapes[]: массив форм, поддерживаемых контекстом. |
| Параметры | rknn_matmul_io_attr io_attrs[]: массив структур атрибутов входных/выходных тензоров матричного умножения. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p32 unit 364 -->

Пример кода:

<!-- source EN p33 unit 365 -->

```c
const int shape_num = 2;
rknn_matmul_shape shapes[shape_num];
for (int i = 0; i < shape_num; ++i) {
  shapes[i].M = i+1;
  shapes[i].K = 64;
  shapes[i].N = 32;
}
rknn_matmul_io_attr io_attr[shape_num];
memset(io_attr, 0, sizeof(rknn_matmul_io_attr) * shape_num);

int ret = rknn_matmul_create_dynamic_shape(&ctx, &info, shape_num, shapes, io_attr);
if (ret < 0) {
  fprintf(stderr, " rknn_matmul_create_dynamic_shape fail! ret=%d\n", ret);
  return -1;
}
```

<!-- source EN p33 unit 366 -->

### rknn_matmul_set_dynamic_shape

<!-- source EN p33 unit 367 -->

rknn_matmul_set_dynamic_shape выбирает конкретную форму матричного умножения. После создания контекста динамических форм передайте одну из структур rknn_matmul_shape, чтобы задать форму текущей операции.

<!-- source EN p33 unit 368 -->

| API | rknn_matmul_set_dynamic_shape |
| --- | --- |
| Описание | Задаёт форму матричного умножения. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
| Параметры | rknn_matmul_shape* shape: форма, используемая для матричного умножения. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p33 unit 369 -->

Пример кода:

<!-- source EN p33 unit 370 -->

```c
ret = rknn_matmul_set_dynamic_shape(ctx, &shapes[0]);
if (ret != 0) {
  fprintf(stderr, "rknn_matmul_set_dynamic_shapes fail!\n");
  return -1;
}
```

<!-- source EN p33 unit 371 -->

rknn_B_normal_layout_to_native_layout

<!-- source EN p33 unit 372 -->

rknn_B_normal_layout_to_native_layout преобразует данные матрицы B из исходного размещения (KxN) в высокопроизводительное размещение данных.

<!-- source EN p33 unit 373 -->

| API | rknn_B_normal_layout_to_native_layout |
| --- | --- |
| Описание | Преобразует размещение B из исходной формы в высокопроизводительную. |
| Параметры | void* B_input: указатель данных B в исходной форме. |
| Параметры | void* B_output: указатель данных B в высокопроизводительной форме. |
| Параметры | int K: число строк B. |
| Параметры | int N: число столбцов B. |
| Параметры | int subN: равно B.dims[2] в rknn_matmul_io_attr. |
| Параметры | int subK: равно B.dims[3] в rknn_matmul_io_attr. |
| Параметры | rknn_matmul_info* info: указатель структуры информации о матричном умножении. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p33 unit 374 -->

Пример кода:

<!-- source EN p34 unit 375 -->

```c
int32_t subN = io_attr.B.dims[2];
int32_t subK = io_attr.B.dims[3];
rknn_B_normal_layout_to_native_layout(B_Matrix, B->virt_addr, K, N, subN, subK, &info);
```

<!-- source EN p34 unit 376 -->

### rknn_matmul_run

<!-- source EN p34 unit 377 -->

Функция выполняет матричное умножение и сохраняет результат в матрице C. До вызова подготовьте данные A и B и привяжите их входные буферы через rknn_matmul_set_io_mem. Выходной буфер C также задаётся через rknn_matmul_set_io_mem, а атрибуты выходного тензора получают через rknn_matmul_create.

<!-- source EN p34 unit 378 -->

| API | rknn_matmul_run |
| --- | --- |
| Описание | Выполняет матричное умножение. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p34 unit 379 -->

Пример кода:

<!-- source EN p34 unit 380 -->

```c
int ret = rknn_matmul_run(ctx);
```

<!-- source EN p34 unit 381 -->

### rknn_matmul_destroy

<!-- source EN p34 unit 382 -->

Функция уничтожает контекст матричного умножения и освобождает связанные ресурсы. После использования указателя, созданного через rknn_matmul_create, необходимо вызвать эту функцию для его уничтожения.

<!-- source EN p34 unit 383 -->

| API | rknn_matmul_destroy |
| --- | --- |
| Описание | Уничтожает контекст матричного умножения. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p34 unit 384 -->

Пример кода:

<!-- source EN p34 unit 385 -->

```c
int ret = rknn_matmul_destroy(ctx);
```

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
