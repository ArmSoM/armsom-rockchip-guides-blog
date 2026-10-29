---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Коды состояния, тензоры, память и расширения"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-types-common"
slug: "rknn-v250-runtime-api-types-common"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Коды состояния, тензоры, память и расширения | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Коды состояния, тензоры, память и расширения | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-types-common/"
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

<!-- source EN p36 unit 399 -->

## 6. Справочник типов

<!-- source EN p36 unit 400 -->

### 6.1. Коды состояния

<!-- source EN p36 unit 401 -->

Коды возврата функций RKNN API определены в следующей таблице.

<!-- source EN p36 unit 402 -->

| Код ошибки | Сообщение |
| --- | --- |
| RKNN_SUCC(0) | Успешное выполнение. |
| RKNN_ERR_FAIL (-1) | Ошибка выполнения. |
| RKNN_ERR_TIMEOUT (-2) | Тайм-аут выполнения. |
| RKNN_ERR_DEVICE_UNAVAILABLE (-3) | Устройство NPU недоступно. |
| RKNN_ERR_MALLOC_FAIL (-4) | Не удалось выделить память. |
| RKNN_ERR_PARAM_INVALID (-5) | Ошибка параметра. |
| RKNN_ERR_MODEL_INVALID (-6) | Недействительная модель RKNN. |
| RKNN_ERR_CTX_INVALID (-7) | Недействительный rknn_context. |
| RKNN_ERR_INPUT_INVALID (-8) | Недействительный объект rknn_input. |
| RKNN_ERR_OUTPUT_INVALID (-9) | Недействительный объект rknn_output. |
| RKNN_ERR_DEVICE_UNMATCH (-10) | Несоответствие версий. |
| RKNN_ERR_INCOMPATILE_PRE_COMPILE_MODEL (-11) | Модель RKNN использует pre_compile, несовместимый с текущим драйвером. |
| RKNN_ERR_INCOMPATILE_OPTIMIZATION_LEVEL_VERSION<br>(-12) | Модель RKNN использует режим уровня оптимизации, несовместимый с текущим драйвером. |
| RKNN_ERR_TARGET_PLATFORM_UNMATCH (-13) | Модель RKNN несовместима с текущей платформой. |
| RKNN_ERR_KEY_INVALID (-14) | Конверт ключа расшифрования недействителен или не разбирается. |
| RKNN_ERR_DECRYPT_FAILED (-15) | Ошибка расшифрования модели или конверта ключа. |
| RKNN_ERR_SOC_BIND_FAILED (-16) | Текущая SoC не совпадает ни с одной привязанной платформой (ошибка привязки SoC). |

<!-- source EN p36 unit 403 -->

### 6.2. Общие структуры

<!-- source EN p36 unit 404 -->

### rknn_sdk_version

<!-- source EN p36 unit 405 -->

Структура rknn_sdk_version содержит сведения о версии RKNN SDK. Определение приведено в следующей таблице:

<!-- source EN p36 unit 406 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| api_version | char[] | Сведения о версии API SDK. |
| drv_version | char[] | Сведения о версии драйвера SDK. |

<!-- source EN p36 unit 407 -->

### rknn_input_output_num

<!-- source EN p36 unit 408 -->

Структура rknn_input_output_num задаёт число входных и выходных тензоров. Определение приведено в таблице:

<!-- source EN p36 unit 409 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| n_input | uint32_t | Число входных тензоров. |
| n_output | uint32_t | Число выходных тензоров. |

<!-- source EN p36 unit 410 -->

### rknn_input_range

<!-- source EN p37 unit 411 -->

Структура rknn_input_range описывает список поддерживаемых форм входа: индекс входа, число форм, формат размещения данных, имя и список форм. Полное определение приведено в таблице:

<!-- source EN p37 unit 412 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| index | uint32_t | Индекс входа. |
| shape_number | uint32_t | Число входных форм, поддерживаемых моделью RKNN. |
| fmt | rknn_tensor_format | Формат размещения данных соответствующей формы. |
| name | char[] | Имя входа. |
| dyn_range | uint32_t[][] | Список форм входа: двумерный массив, содержащий несколько массивов форм; формы хранятся по первой размерности. |
| n_dims | uint32_t | Число действительных измерений каждого массива формы. |

<!-- source EN p37 unit 413 -->

### rknn_tensor_attr

<!-- source EN p37 unit 414 -->

Структура rknn_tensor_attr описывает атрибуты тензора модели. Определение приведено в таблице:

<!-- source EN p37 unit 415 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| index | uint32_t | Индекс входного или выходного тензора. |
| n_dims | uint32_t | Число измерений тензора. |
| dims | uint32_t[] | Значение каждого измерения. |
| name | char[] | Имя тензора. |
| n_elems | uint32_t | Число элементов данных тензора. |
| size | uint32_t | Размер памяти данных тензора. |
| fmt | rknn_tensor_format | Формат измерений тензора: RKNN_TENSOR_NCHW, RKNN_TENSOR_NHWC, RKNN_TENSOR_NC1HWC2. |
| type | rknn_tensor_type | Типы данных тензора: RKNN_TENSOR_FLOAT32,<br>RKNN_TENSOR_FLOAT16, RKNN_TENSOR_INT8, RKNN_TENSOR_UINT8,<br>RKNN_TENSOR_INT16, RKNN_TENSOR_UINT16, RKNN_TENSOR_INT32,<br>RKNN_TENSOR_UINT32, RKNN_TENSOR_INT64, RKNN_TENSOR_BOOL,<br>RKNN_TENSOR_INT4, RKNN_TENSOR_BFLOAT16 |
| qnt_type | rknn_tensor_qnt_type | Тип квантования: RKNN_TENSOR_QNT_NONE — без квантования; RKNN_TENSOR_QNT_DFP — динамическая квантованная фиксированная точка; RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC — асимметричное квантование. |
| fl | int8_t | Параметр квантования RKNN_TENSOR_QNT_DFP. |
| zp | int32_t | Нулевая точка квантования RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC. |
| scale | float | Параметр квантования RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC. |
| w_stride | uint32_t | Фактическое число пикселей для хранения строки изображения: действительные пиксели строки плюс недействительные пиксели заполнения, позволяющие аппаратуре быстро перейти к следующей строке. Единица — пиксель. |
| size_with_stride | uint32_t | Фактический размер изображения в байтах, включая недействительные пиксели заполнения. |
| pass_through | uint8_t | 0 — непреобразованные данные; 1 — преобразованные данные. Преобразование включает нормализацию и квантование. |
| h_stride | uint32_t | Используется только при входе из нескольких batch и задаётся пользователем, чтобы NPU правильно определяла начальный адрес каждого batch. Равно исходной высоте входа модели плюс число недействительных пикселей заполнения для быстрого перехода аппаратуры к следующей строке. При значении 0 равно высоте входа модели. Единица — пиксель. |

<!-- source EN p37 unit 416 -->

### rknn_perf_detail

<!-- source EN p38 unit 417 -->

Структура rknn_perf_detail описывает подробные показатели производительности модели. Определение приведено в таблице. Примечание: RV1106/RV1103/RV1106B/RV1103B/RK2118 не поддерживаются.

<!-- source EN p38 unit 418 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| perf_data | char* | Подробные показатели производительности: время выполнения каждого слоя сети, сохранённое строкой. |
| data_len | uint64_t | Длина строковых данных perf_data. |

<!-- source EN p38 unit 419 -->

### rknn_perf_run

<!-- source EN p38 unit 420 -->

Структура rknn_perf_run описывает общее время инференса модели. Определение приведено в таблице. Примечание: RV1106/RV1103/RV1106B/RV1103B/RK2118 не поддерживаются.

<!-- source EN p38 unit 421 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| run_duration | int64_t | Общее время инференса сети в микросекундах без настройки входов и выходов. |

<!-- source EN p38 unit 422 -->

### rknn_mem_size

<!-- source EN p38 unit 423 -->

Структура rknn_mem_size описывает выделение памяти при инициализации модели. Определение приведено в таблице:

<!-- source EN p38 unit 424 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| total_weight_size | uint32_t | Объём памяти, выделенный под веса сети. |
| total_internal_size | uint32_t | Объём памяти внутренних тензоров сети. |
| total_dma_allocated_size | uint64_t | Общий объём DMA-памяти, выделенной сети. |
| total_sram_size | uint32_t | Только RK3588: объём SRAM, зарезервированный для NPU. Подробности: RK3588_NPU_SRAM_usage.md. |
| free_sram_size | uint32_t | Только RK3588: доступная сейчас SRAM. Подробности: RK3588_NPU_SRAM_usage.md. |
| reserved[10] | uint32_t | Зарезервировано. |

<!-- source EN p38 unit 425 -->

### rknn_tensor_mem

<!-- source EN p38 unit 426 -->

Структура rknn_tensor_mem описывает память тензора. Определение приведено в таблице:

<!-- source EN p38 unit 427 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| virt_addr | void* | Виртуальный адрес тензора. |
| phys_addr | uint64_t | Физический адрес тензора. |
| fd | int32_t | Файловый дескриптор тензора. |
| offset | int32_t | Смещение fd и виртуального адреса. |
| size | uint32_t | Фактический размер тензора. |
| flags | uint32_t | Флаги rknn_tensor_mem:<br>RKNN_TENSOR_MEMORY_FLAGS_ALLOC_INSIDE: структура создана Runtime;<br>RKNN_TENSOR_MEMORY_FLAGS_FROM_FD: создана из fd;<br>RKNN_TENSOR_MEMORY_FLAGS_FROM_PHYS: создана из физического адреса. Пользователю не требуется управлять этими флагами. |
| priv_data | void* | Внутренние данные. |

### rknn_input

<!-- source EN p38 unit 428 -->

Структура rknn_input представляет входные данные модели и используется как параметр rknn_inputs_set. Определение приведено в таблице:

<!-- source EN p38 unit 429 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| index | uint32_t | Индекс данного входа. |
| buf | void* | Указатель на буфер входных данных. |
| size | uint32_t | Размер памяти буфера входных данных. |
| pass_through | uint8_t | При 1 buf напрямую задаёт входной узел модели без предварительной обработки. |
| type | rknn_tensor_type | Тип входных данных. |
| fmt | rknn_tensor_format | Формат входных данных. |

<!-- source EN p39 unit 431 -->

### rknn_output

<!-- source EN p39 unit 432 -->

Структура rknn_output представляет выходные данные модели и используется как параметр rknn_outputs_get. После вызова rknn_outputs_get она заполняется данными. Определения всех полей приведены в таблице:

<!-- source EN p39 unit 433 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| want_float | uint8_t | Нужно ли преобразовать выходные данные в float; поле задаётся пользователем. |
| is_prealloc | uint8_t | Предварительно ли выделен буфер выходных данных; поле задаётся пользователем. |
| index | uint32_t | Индекс данного выхода. В исходнике поле одновременно названо задаваемым пользователем и возвращаемым интерфейсом; противоречие сохранено. |
| buf | void* | Указатель на буфер выходных данных, возвращаемый интерфейсом. |
| size | uint32_t | Размер буфера выходных данных в байтах, возвращаемый интерфейсом. |

<!-- source EN p39 unit 434 -->

### rknn_decrypt_key_mem

<!-- source EN p39 unit 435 -->

rknn_decrypt_key_mem — вспомогательная структура для передачи конверта ключа зашифрованной модели в rknn_init через поле user_key структуры rknn_init_extend. Определение:

<!-- source EN p39 unit 436 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| key_data | void* | Указатель на память конверта ключа RKKE. |
| key_size | uint32_t | Длина конверта ключа в байтах. |

<!-- source EN p39 unit 437 -->

### rknn_init_extend

<!-- source EN p39 unit 438 -->

rknn_init_extend содержит расширенные сведения для инициализации модели. Определение:

<!-- source EN p39 unit 439 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| ctx | rknn_context | Инициализированный объект rknn_context. |
| real_model_offset | int32_t | Фактическое смещение в файле модели .rknn. Действует только при инициализации через путь к файлу или буфер модели без копирования. |
| real_model_size | uint32_t | Фактический размер файла модели rknn. Действует только при инициализации через путь к файлу или буфер модели без копирования. |
| model_buffer_fd | int32_t | fd памяти модели, выделенной NPU после инициализации с RKNN_FLAG_MODEL_BUFFER_ZERO_COPY. |
| model_buffer_flags | uint32_t | Флаги памяти модели, выделенной NPU после инициализации с RKNN_FLAG_MODEL_BUFFER_ZERO_COPY. |
| user_key | rknn_decrypt_key_mem* | Указатель на ключ пользователя (rknn_decrypt_key_mem*) для загрузки зашифрованных RKCE-моделей. Для незашифрованных моделей — NULL. |
| reserved | uint8_t[] | Зарезервированные данные. |

<!-- source EN p39 unit 440 -->

### rknn_run_extend

<!-- source EN p39 unit 441 -->

Структура rknn_run_extend содержит расширенную информацию при инференсе модели. В описываемой версии недоступна. Определение приведено в таблице:

<!-- source EN p40 unit 442 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| frame_id | uint64_t | Индекс кадра текущего инференса. |
| non_block | int32_t | 0 — блокирующий режим; 1 — неблокирующий, при котором rknn_run возвращается немедленно. |
| timeout_ms | int32_t | Тайм-аут инференса в миллисекундах. |
| fence_fd | int32_t | Для неблокирующего инференса; недоступно. |

<!-- source EN p40 unit 443 -->

### rknn_output_extend

<!-- source EN p40 unit 444 -->

Структура rknn_output_extend служит для получения расширенной информации выхода. В описываемой версии недоступна. Определение приведено в таблице:

<!-- source EN p40 unit 445 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| frame_id | uint64_t | Индекс кадра выходного результата. |

<!-- source EN p40 unit 446 -->

### rknn_custom_string

<!-- source EN p40 unit 447 -->

Структура rknn_custom_string содержит пользовательскую строку, заданную при преобразовании модели RKNN. Определение приведено в таблице:

<!-- source EN p40 unit 448 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| string | char[] | Пользовательская строка. |

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
