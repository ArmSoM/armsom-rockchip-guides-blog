---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Устройство, контекст и флаги инициализации"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-device-context"
slug: "rknn-v250-runtime-api-device-context"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Устройство, контекст и флаги инициализации | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Устройство, контекст и флаги инициализации | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-device-context/"
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

<!-- source EN p13 unit 88 -->

## 5. Справочник функций

<!-- source EN p13 unit 89 -->

Функции API

<!-- source EN p13 unit 90 -->

Функциональная классификация RKNN C API:

<!-- source EN p13 unit 91 -->

| Категория | Описание |
| --- | --- |
| 5.1. Устройство и контекст | Инициализация и уничтожение контекста, настройка ядер NPU. |
| 5.2. Запросы | Запрос атрибутов модели, версии SDK, памяти и других данных. |
| 5.3. Выполнение инференса | Настройка входов, инференс, получение выходов и динамические формы. |
| 5.4. Тензоры и память | Выделение, освобождение, синхронизация тензорной памяти и назначение пользовательской памяти. |
| 5.5. Матричное умножение | Создание контекста матричного умножения, память, параметры квантования и выполнение. |
| 5.6. Пользовательские операторы | Регистрация пользовательских операторов и получение их атрибутов. |

<!-- source EN p13 unit 92 -->

### 5.1. Устройство и контекст

<!-- source EN p13 unit 93 -->

Инициализация и уничтожение контекста, настройка ядер NPU.

<!-- source EN p13 unit 94 -->

### rknn_init

<!-- source EN p13 unit 95 -->

Функция инициализации rknn_init создаёт объект rknn_context, загружает модель RKNN и выполняет заданные действия инициализации согласно флагам и структуре rknn_init_extend.

<!-- source EN p13 unit 96 -->

| API | rknn_init |
| --- | --- |
| Описание | Инициализирует контекст rknn. |
| Параметры | rknn_context *context: указатель на объект rknn_context. |
| Параметры | void *model: двоичные данные модели RKNN или путь к ней. При size>0 — двоичные данные; при size=0 — путь модели. |
| Параметры | uint32_t size: размер модели, переданной двоичными данными; 0, если model задаёт путь. |
| Параметры | uint32_t flag: флаг инициализации; для поведения по умолчанию задайте 0. |
| Параметры | rknn_init_extend: расширенная информация специальной инициализации. Источник называет её отключённой и требует NULL, но для совместного использования весов требует указатель другого rknn_context, связанного с другой моделью. Оба утверждения сохранены. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p13 unit 97 -->

Пример кода:

<!-- source EN p13 unit 98 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
```

<!-- source EN p13 unit 99 -->

Флаги инициализации описаны далее:

<!-- source EN p13 unit 100 -->

RKNN_FLAG_PRIOR_HIGH: Высокий приоритет контекста.

<!-- source EN p13 unit 101 -->

RKNN_FLAG_PRIOR_MEDIUM: Средний приоритет контекста.

<!-- source EN p13 unit 102 -->

RKNN_FLAG_PRIOR_LOW: Низкий приоритет контекста.

<!-- source EN p13 unit 103 -->

RKNN_FLAG_ASYNC_MASK: Асинхронный режим. rknn_outputs_get получает результат предыдущего кадра без длительной блокировки, повышая частоту в однопоточном режиме, но не возвращая текущий кадр. Для многопоточного режима включать его не требуется.

<!-- source EN p13 unit 104 -->

RKNN_FLAG_COLLECT_PERF_MASK: позволяет запрашивать время выполнения каждого слоя сети.

<!-- source EN p14 unit 105 -->

RKNN_FLAG_MEM_ALLOC_OUTSIDE: указывает, что память входов, выходов, весов и промежуточных тензоров модели полностью выделяет пользователь. Основные назначения:

<!-- source EN p14 unit 106 -->

1) Вся память выделяется пользователем, что упрощает планирование памяти всей системы.

<!-- source EN p14 unit 107 -->

2) Для повторного использования памяти, особенно при её дефиците на RV1106/RV1103/RV1106B/RV1103B/RK2118.

<!-- source EN p14 unit 108 -->

Предположим, модели A и B выполняются последовательно. Тогда память промежуточных тензоров обеих моделей можно использовать повторно. Пример кода:

<!-- source EN p14 unit 109 -->

```c
rknn_context ctx_a, ctx_b;

rknn_init(&ctx_a, model_path_a, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
rknn_query(ctx_a, RKNN_QUERY_MEM_SIZE, &mem_size_a, sizeof(mem_size_a));

rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_MEM_ALLOC_OUTSIDE, NULL);
rknn_query(ctx_b, RKNN_QUERY_MEM_SIZE, &mem_size_b, sizeof(mem_size_b));

max_internal_size = MAX(mem_size_a.total_internal_size, mem_size_b.total_internal_size);
internal_mem_max = rknn_create_mem(ctx_a, max_internal_size);

internal_mem_a = rknn_create_mem_from_fd(ctx_a, internal_mem_max->fd,
      internal_mem_max->virt_addr, mem_size_a.total_internal_size, 0);
rknn_set_internal_mem(ctx_a, internal_mem_a);

internal_mem_b = rknn_create_mem_from_fd(ctx_b, internal_mem_max->fd,
      internal_mem_max->virt_addr, mem_size_b.total_internal_size, 0);
rknn_set_internal_mem(ctx_b, internal_mem_b);
```

<!-- source EN p14 unit 110 -->

RKNN_FLAG_SHARE_WEIGHT_MEM: используется для совместного использования весов другой модели. Основное назначение — имитация входа переменной длины; начиная с RKNPU Runtime 1.5.0 эта функция заменена динамическими формами. Например, речевые модели имеют переменную длину входа, но NPU не поддерживает такой вход непосредственно, поэтому создают несколько моделей RKNN разных разрешений. Только одна модель содержит полные веса, остальные — без весов. При инициализации модели без весов этот флаг позволяет текущему контексту использовать веса полной модели. Для двух моделей разрешений A и B порядок следующий:

<!-- source EN p14 unit 111 -->

1) Создайте RKNN-Toolkit2 модель с разрешением A.

<!-- source EN p14 unit 112 -->

2) Создайте модель с разрешением B без весов: в rknn.config() задайте remove_weight=True. Это уменьшает размер модели B.

<!-- source EN p14 unit 113 -->

3) На плате обычным образом инициализируйте A.

<!-- source EN p14 unit 114 -->

4) Инициализируйте B с флагом RKNN_FLAG_SHARE_WEIGHT_MEM.

<!-- source EN p14 unit 115 -->

5) Остальные действия прежние. Пример кода платы:

<!-- source EN p14 unit 116 -->

```c
rknn_context ctx_a, ctx_b;
rknn_init(&ctx_a, model_path_a, 0, 0, NULL);

rknn_init_extend extend;
extend.ctx = ctx_a;
rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_SHARE_WEIGHT_MEM, &extend);
```

<!-- source EN p14 unit 117 -->

RKNN_FLAG_FENCE_IN_OUTSIDE: Передать fence fd извне.

<!-- source EN p14 unit 118 -->

RKNN_FLAG_FENCE_OUT_OUTSIDE: Получить внутренний fence fd.

<!-- source EN p14 unit 119 -->

RKNN_FLAG_COLLECT_MODEL_INFO_ONLY: инициализирует пустой контекст. В нём можно только вызывать rknn_query для получения общего объёма памяти весов и промежуточных тензоров; инференс невозможен.

<!-- source EN p14 unit 120 -->

RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE: промежуточные тензоры модели выделяет пользователь. Обычно применяется для самостоятельного управления и повторного использования их памяти между несколькими моделями.

<!-- source EN p15 unit 121 -->

RKNN_FLAG_EXECUTE_FALLBACK_PRIOR_DEVICE_GPU: для всех слоёв, не поддерживаемых NPU, предпочтительно выполнение на GPU, но оно не гарантируется. Фактическое устройство исполнения зависит от поддержки оператора библиотекой Runtime.

<!-- source EN p15 unit 122 -->

RKNN_FLAG_ENABLE_SRAM: память промежуточных тензоров по возможности выделяется в SRAM.

<!-- source EN p15 unit 123 -->

RKNN_FLAG_SHARE_SRAM: текущий контекст пытается совместно использовать адресное пространство SRAM другого контекста. При инициализации текущего контекста обязательно должен быть включён RKNN_FLAG_ENABLE_SRAM.

<!-- source EN p15 unit 124 -->

RKNN_FLAG_DISABLE_PROC_HIGH_PRIORITY: текущий контекст использует стандартный приоритет процесса. Без этого флага nice процесса равен -19.

<!-- source EN p15 unit 125 -->

RKNN_FLAG_DISABLE_FLUSH_INPUT_MEM_CACHE: Runtime не сбрасывает кэш входного тензора; пользователь обязан обеспечить сброс до вызова rknn_run.

<!-- source EN p15 unit 126 -->

RKNN_FLAG_DISABLE_FLUSH_OUTPUT_MEM_CACHE: Runtime не очищает кэш выходного тензора автоматически. Прямой доступ пользователя к output_mem->virt_addr тогда может нарушить согласованность кэша. Перед использованием output_mem->virt_addr необходимо обновить кэш через rknn_mem_sync(ctx, mem, RKNN_MEMORY_SYNC_FROM_DEVICE). Флаг обычно нужен, когда выход NPU читает не CPU, а, например, GPU или RGA.

<!-- source EN p15 unit 127 -->

RKNN_FLAG_MODEL_BUFFER_ZERO_COPY: переданный rknn_init буфер модели выделен через rknn_create_mem или rknn_create_mem2. Runtime не создаёт дополнительную копию буфера, уменьшая потребление памяти. Пользователь должен сохранять память модели действительной до уничтожения контекста и освобождать её после этого. При инициализации поля real_model_offset, real_model_size, model_buffer_fd и model_buffer_flags параметра rknn_init_extend функции rknn_init задаются по rknn_tensor_mem, возвращённому rknn_create_mem2.

<!-- source EN p15 unit 128 -->

RKNN_MEM_FLAG_ALLOC_NO_CONTEXT: при выделении памяти через rknn_create_mem2 разрешает ctx=0 или NULL. Поэтому память драйвера NPU можно получить до инициализации какого-либо контекста. Возвращённую структуру памяти необходимо освободить через rknn_destroy_mem, передав любой контекст. Пример кода:

<!-- source EN p15 unit 129 -->

```c
  rknn_tensor_mem* model_mem = rknn_create_mem2(ctx, model_size, RKNN_MEM_FLAG_ALLOC_NO_CONTEXT);
  memcpy(model_mem->virt_addr, model_data, model_size);
  rknn_init_extend init_ext;
  memset(&init_ext, 0, sizeof(rknn_init_extend));
  init_ext.real_model_offset = 0;
  init_ext.real_model_size = model_size;
  init_ext.model_buffer_fd = model_mem->fd;
  init_ext.model_buffer_flags = model_mem->flags;
  int ret = rknn_init(&ctx, model_mem->virt_addr, model_size, RKNN_FLAG_MODEL_BUFFER_ZERO_COPY,
&init_ext);

  // do rknn inference...

  rknn_destroy_mem(ctx, model_mem);
  rknn_destroy(ctx);
```

<!-- source EN p15 unit 130 -->

### rknn_set_core_mask

<!-- source EN p15 unit 131 -->

Функция задаёт конкретные ядра NPU для выполнения. В описываемом состоянии поддерживаются только RK3588 и RK3576. На платформе с одноядерной NPU возвращается код ошибки.

<!-- source EN p15 unit 132 -->

| API | rknn_set_core_mask |
| --- | --- |
| Описание | Задаёт ядра NPU. |
| Параметры | rknn_context context: объект rknn_context. |
| Параметры | rknn_core_mask core_mask: выбор ядер NPU. RKNN_NPU_CORE_AUTO — автоматический выбор свободного ядра; RKNN_NPU_CORE_0 — NPU0; RKNN_NPU_CORE_1 — NPU1; RKNN_NPU_CORE_2 — NPU2; RKNN_NPU_CORE_0_1 — одновременно NPU0 и NPU1; RKNN_NPU_CORE_0_1_2 — одновременно NPU0, NPU1 и NPU2; RKNN_NPU_CORE_ALL — все ядра NPU данной платформы. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p16 unit 134 -->

```c
rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

<!-- source EN p16 unit 135 -->

В многоядерных режимах RKNN_NPU_CORE_0_1 и RKNN_NPU_CORE_0_1_2 лучше ускоряются Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu, Prelu и LeakyRelu. Остальные операторы продолжают работу на Core0. Источник обещает поддержку Pool и ConvTranpose в будущих обновлениях; это обещание оригинала, не подтверждение текущей реализации.

<!-- source EN p16 unit 136 -->

### rknn_set_batch_core_num

<!-- source EN p16 unit 137 -->

rknn_set_batch_core_num задаёт число ядер NPU для модели RKNN с несколькими batch, экспортированной при rknn_batch_size больше 1 в RKNN-Toolkit2. Поддерживаются только RK3588 и RK3576.

<!-- source EN p16 unit 138 -->

| API | rknn_set_batch_core_num |
| --- | --- |
| Описание | Задаёт число ядер NPU для выполнения модели RKNN с несколькими batch. |
| Параметры | rknn_context context: объект rknn_context. |
| Параметры | int core_num: число используемых ядер. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p16 unit 139 -->

Пример кода:

<!-- source EN p16 unit 140 -->

```c
rknn_context ctx;
int ret = rknn_set_batch_core_num(ctx, 2);
```

<!-- source EN p16 unit 141 -->

### rknn_dup_context

<!-- source EN p16 unit 142 -->

rknn_dup_context создаёт новый контекст, ссылающийся на ту же модель. Он полезен для повторного использования весов при многопоточном выполнении одной модели. Недоступно на RV1106/RV1103/RV1106B/RV1103B/RK2118.

<!-- source EN p16 unit 143 -->

| API | rknn_dup_context |
| --- | --- |
| Описание | Создаёт новый контекст той же модели для повторного использования весов. |
| Параметры | rknn_context *context_in: указатель объекта rknn_context. По тексту источника после вызова входной контекст будет инициализирован. |
| Параметры | rknn_context *context_out: указатель выходного объекта rknn_context, в котором возвращаются сведения о новом объекте. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p16 unit 144 -->

Пример кода:

<!-- source EN p17 unit 145 -->

```c
rknn_context ctx_in;
rknn_context ctx_out;
int ret = rknn_dup_context(&ctx_in, &ctx_out);
```

<!-- source EN p17 unit 146 -->

### rknn_destroy

<!-- source EN p17 unit 147 -->

Функция освобождает rknn_context и связанные ресурсы.

<!-- source EN p17 unit 148 -->

| API | rknn_destroy |
| --- | --- |
| Описание | Уничтожает rknn_context и связанные ресурсы. |
| Параметры | rknn_context context: уничтожаемый объект rknn_context. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p17 unit 149 -->

Пример кода:

<!-- source EN p17 unit 150 -->

```c
rknn_context ctx;
int ret = rknn_destroy(ctx);
```

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
