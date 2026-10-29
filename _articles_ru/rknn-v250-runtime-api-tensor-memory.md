---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Тензоры, выделение памяти и синхронизация"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-tensor-memory"
slug: "rknn-v250-runtime-api-tensor-memory"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Тензоры, выделение памяти и синхронизация | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Тензоры, выделение памяти и синхронизация | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-tensor-memory/"
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

<!-- source EN p25 unit 279 -->

### 5.4. Тензоры и память

<!-- source EN p25 unit 280 -->

Выделение, освобождение, синхронизация тензорной памяти и назначение пользовательской памяти.

<!-- source EN p25 unit 281 -->

### rknn_create_mem_from_phys

<!-- source EN p25 unit 282 -->

Для предоставления памяти NPU rknn_create_mem_from_phys создаёт структуру rknn_tensor_mem и возвращает указатель на неё. Физический и виртуальный адреса, размер и сведения о внешней памяти передаются в эту структуру.

<!-- source EN p25 unit 283 -->

| API | rknn_create_mem_from_phys |
| --- | --- |
| Описание | Создаёт rknn_tensor_mem и предоставляет память по физическому адресу. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | uint64_t phys_addr: физический адрес буфера. |
| Параметр | void *virt_addr: виртуальный адрес буфера, начальный адрес памяти, соответствующей fd. |
| Параметр | uint32_t size: размер буфера. |
| Возвращаемое значение | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |

<!-- source EN p25 unit 284 -->

Пример кода:

<!-- source EN p25 unit 285 -->

```c
//suppose we have got buffer information as input_phys, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_phys(ctx, input_phys, input_virt, size);
```

<!-- source EN p25 unit 286 -->

### rknn_create_mem_from_fd

<!-- source EN p25 unit 287 -->

Для предоставления памяти NPU rknn_create_mem_from_fd создаёт rknn_tensor_mem и возвращает указатель на структуру. В неё передаются файловый дескриптор, логический адрес, размер и сведения о внешней памяти.

<!-- source EN p26 unit 288 -->

| API | rknn_create_mem_from_fd |
| --- | --- |
| Описание | Создаёт rknn_tensor_mem и предоставляет память через файловый дескриптор. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | int32_t fd: файловый дескриптор буфера. |
| Параметр | void *virt_addr: виртуальный адрес буфера, соответствующий началу fd. |
| Параметр | uint32_t size: размер буфера. |
| Параметр | int32_t offset: смещение, соответствующее файловому дескриптору и виртуальному адресу. |
| Возвращаемое значение | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |

<!-- tensor-memory-source-difference:start -->

**Различие оригиналов:** В китайском PDF на странице 25 параметр записан как `void virt_addr`, а `*` стоит в конце описания; в английском PDF на странице 26 указано `void *virt_addr`. Таблица сохраняет формулировку соответствующего оригинала. Это расхождение в обозначении типа, а не проверенное объявление API; перед использованием сверьтесь с заголовочным файлом фактического SDK V2.5.0.

<!-- tensor-memory-source-difference:end -->

<!-- source EN p26 unit 289 -->

Пример кода:

<!-- source EN p26 unit 290 -->

```c
//suppose we have got buffer information as input_fd, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_fd(ctx, input_fd, input_virt, size, 0);
```

<!-- source EN p26 unit 291 -->

### rknn_create_mem

<!-- source EN p26 unit 292 -->

rknn_create_mem выделяет указанный пользователем объём памяти, непосредственно доступной NPU, и возвращает структуру rknn_tensor_mem.

<!-- source EN p26 unit 293 -->

| API | rknn_create_mem |
| --- | --- |
| Описание | Внутри Runtime создаёт rknn_tensor_mem и выделяет память. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | uint32_t size: размер буфера. |
| Возвращаемое значение | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |

<!-- source EN p26 unit 294 -->

Пример кода:

<!-- source EN p26 unit 295 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem(ctx, size);
```

<!-- source EN p26 unit 296 -->

rknn_create_mem2

<!-- source EN p26 unit 297 -->

rknn_create_mem2 выделяет непосредственно доступную NPU память заданных пользователем размера и типа, возвращая структуру rknn_tensor_mem.

<!-- source EN p26 unit 298 -->

| API | rknn_create_mem2 |
| --- | --- |
| Описание | Внутри Runtime создаёт rknn_tensor_mem и выделяет память. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | uint64_t size: размер буфера. |
| Параметр | uint64_t alloc_flags: Управляет кэшированием памяти. RKNN_FLAG_MEMORY_CACHEABLE: кэшируемая; RKNN_FLAG_MEMORY_NON_CACHEABLE: некэшируемая.<br>RKNN_FLAG_MEMORY_FLAGS_DEFAULT совпадает с RKNN_FLAG_MEMORY_CACHEABLE.<br>RKNN_FLAG_MEMORY_TRY_ALLOC_SRAM: по возможности выделять SRAM; если её недостаточно, остаток выделяется в DRAM. |
| Возвращаемое значение | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |

<!-- source EN p26 unit 299 -->

Основное отличие rknn_create_mem2 от rknn_create_mem — параметр alloc_flags, позволяющий указать кэшируемость памяти. rknn_create_mem не предоставляет такого выбора и по умолчанию выделяет кэшируемую память.

<!-- source EN p26 unit 300 -->

Пример кода:

<!-- source EN p27 unit 301 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem2(ctx, size, RKNN_FLAG_MEMORY_NON_CACHEABLE);
```

<!-- source EN p27 unit 302 -->

### rknn_destroy_mem

<!-- source EN p27 unit 303 -->

rknn_destroy_mem уничтожает структуру rknn_tensor_mem. Однако память, выделенную пользователем, необходимо освободить вручную.

<!-- source EN p27 unit 304 -->

| API | rknn_destroy_mem |
| --- | --- |
| Описание | Уничтожает структуру rknn_tensor_mem. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p27 unit 305 -->

Пример кода:

<!-- source EN p27 unit 306 -->

```c
rknn_tensor_mem* input_mems [1];
int ret = rknn_destroy_mem(ctx, input_mems[0]);
```

<!-- source EN p27 unit 307 -->

### rknn_set_weight_mem

<!-- source EN p27 unit 308 -->

Если пользователь выделил память весов сети, после инициализации соответствующей rknn_tensor_mem её можно предоставить NPU через rknn_set_weight_mem. Функцию необходимо вызвать до rknn_run.

<!-- source EN p27 unit 309 -->

| API | rknn_set_weight_mem |
| --- | --- |
| Описание | Задаёт rknn_tensor_mem со сведениями о памяти весов. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p27 unit 310 -->

Пример кода:

<!-- source EN p27 unit 311 -->

```c
rknn_tensor_mem* weight_mems [1];
int ret = rknn_set_weight_mem(ctx, weight_mems[0]);
```

<!-- source EN p27 unit 312 -->

### rknn_set_internal_mem

<!-- source EN p27 unit 313 -->

Если пользователь выделил память внутренних тензоров сети, после инициализации соответствующей rknn_tensor_mem её можно предоставить NPU через rknn_set_internal_mem. Функцию необходимо вызвать до rknn_run.

<!-- source EN p27 unit 314 -->

| API | rknn_set_internal_mem |
| --- | --- |
| Описание | Задаёт rknn_tensor_mem со сведениями о памяти внутренних тензоров сети. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p27 unit 315 -->

Пример кода:

<!-- source EN p27 unit 316 -->

```c
rknn_tensor_mem* internal_tensor_mems [1];
int ret = rknn_set_internal_mem(ctx, internal_tensor_mems[0]);
```

<!-- source EN p28 unit 317 -->

### rknn_set_io_mem

<!-- source EN p28 unit 318 -->

После выделения входной/выходной памяти и инициализации rknn_tensor_mem вызов rknn_set_io_mem разрешает NPU использовать её. Вызывается до rknn_run и относится к zero-copy API. Память может выделять Runtime через rknn_create_mem либо внешний модуль через rknn_create_mem_from_fd/rknn_create_mem_from_phys. Подобно rknn_init, rknn_set_io_mem достаточно вызвать один раз в начале, затем многократно вызывать rknn_run.

<!-- source EN p28 unit 319 -->

| API | rknn_set_io_mem |
| --- | --- |
| Описание | Задаёт rknn_tensor_mem со сведениями о памяти входных/выходных тензоров сети. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |
| Параметр | rknn_tensor_attr *: атрибуты буфера входного или выходного тензора. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p28 unit 320 -->

Примечания по использованию:

<!-- source EN p28 unit 321 -->

1. Получите rknn_tensor_attr через rknn_query. Для zero-copy используйте RKNN_QUERY_NATIVE_INPUT_ATTR/RKNN_QUERY_NATIVE_OUTPUT_ATTR, а не RKNN_QUERY_INPUT_ATTR/RKNN_QUERY_OUTPUT_ATTR: это даёт наиболее эффективные для NPU компоновку и тип.

<!-- source EN p28 unit 322 -->

2. Если тип и компоновка не меняются, выделяйте size_with_stride байт. При изменении выделяйте новый объём: например, переход выхода int8 → float32 требует четырёхкратного размера, n_elems * sizeof(float).

<!-- source EN p28 unit 323 -->

3. Вход должен соответствовать запрошенной или изменённой компоновке, например NHWC. При pass_through=1 может потребоваться выравнивание ширины по w_stride.

<!-- source EN p28 unit 324 -->

4. После инференса считайте выходную память из rknn_tensor_mem. Для внешней памяти также требуется сброс кэша через интерфейс соответствующего типа памяти.

<!-- source EN p28 unit 325 -->

Пример кода:

<!-- source EN p29 unit 326 -->

```c
// Zero-copy API: query native attributes -> modify type/layout -> allocate memory -> set input/output memory
rknn_tensor_attr input_attrs[1], output_attrs[1];
rknn_tensor_mem* input_mems[1];
rknn_tensor_mem* output_mems[1];

memset(input_attrs, 0, sizeof(input_attrs));
input_attrs[0].index = 0;
rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[0]), sizeof(rknn_tensor_attr));
// The default input type is int8 (normalize and quantize need to be computed outside);
// if uint8 is set, normalize and quantize will be fused into the NPU
input_attrs[0].type = RKNN_TENSOR_UINT8;
// The default fmt is NHWC, and the NPU only supports NHWC input in zero-copy mode
input_attrs[0].fmt = RKNN_TENSOR_NHWC;
input_mems[0] = rknn_create_mem(ctx, input_attrs[0].size_with_stride);
// Copy input data to input_mems[0]->virt_addr ...

memset(output_attrs, 0, sizeof(output_attrs));
output_attrs[0].index = 0;
rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR, &(output_attrs[0]), sizeof(rknn_tensor_attr));
// The default output type depends on the model; float32 is required here to compute top5
output_attrs[0].type = RKNN_TENSOR_FLOAT32;
output_mems[0] = rknn_create_mem(ctx, output_attrs[0].n_elems * sizeof(float));

// Set input/output memory
ret = rknn_set_io_mem(ctx, input_mems[0], &input_attrs[0]);
ret = rknn_set_io_mem(ctx, output_mems[0], &output_attrs[0]);

// Run inference
ret = rknn_run(ctx, NULL);
// Read the output result from output_mems[0]->virt_addr ...
```

<!-- source EN p29 unit 327 -->

### rknn_mem_sync

<!-- source EN p29 unit 328 -->

Память rknn_create_mem по умолчанию кэшируемая. При одновременном доступе CPU и NPU к такой памяти поведение кэша может нарушать согласованность данных. Этот интерфейс синхронизирует кэшируемую память, обеспечивая согласованность данных, доступных CPU и NPU.

<!-- source EN p29 unit 329 -->

| API | rknn_mem_sync |
| --- | --- |
| Описание | Синхронизирует данные кэша CPU и DDR. |
| Параметр | rknn_context context: объект rknn_context. |
| Параметр | rknn_tensor_mem* mem: указатель структуры информации о памяти тензора. |
| Параметр | rknn_mem_sync_mode mode: режим обновления CPU-кэша и DDR. RKNN_MEMORY_SYNC_TO_DEVICE — записывает данные CPU-кэша в DDR, обычно после записи CPU и перед доступом NPU к той же памяти. RKNN_MEMORY_SYNC_FROM_DEVICE — синхронизирует DDR с CPU-кэшем, обычно после записи NPU: делает кэш недействительным, чтобы при следующем доступе CPU повторно прочитал DDR. RKNN_MEMORY_SYNC_BIDIRECTIONAL — записывает CPU-кэш в DDR и заставляет CPU заново читать DDR. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p29 unit 330 -->

Пример кода:

<!-- source EN p29 unit 331 -->

```c
ret =rknn_mem_sync(ctx, &outputs[0].mem,
RKNN_MEMORY_SYNC_FROM_DEVICE);
if (ret < 0) {
   fprintf(stderr, " rknn_mem_sync error! ret=%d\n", ret);
   return -1;
}
```

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
