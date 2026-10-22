---
title: "Rockchip RKNN Runtime C API: базовые API, Matmul и пользовательские операторы"
description: "Полная справка RKNN C API V2.3.2: платформы, сборка, структуры, параметры, примеры и все коды ошибок с замечаниями к исходнику."
translation_key: "094-rockchip-rknn-runtime-c-api"
slug: "094-rockchip-rknn-runtime-c-api"
lang: "ru"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
tags: ["ArmSoM", "Rockchip", "RKNN", "Runtime", "NPU", "C API"]
keywords: "ArmSoM Rockchip RKNN Runtime C API RK3588 RK3576"
excerpt: "Полная справка RKNN C API V2.3.2: платформы, сборка, структуры, параметры, примеры и все коды ошибок с замечаниями к исходнику."
---

{% raw %}

# Rockchip RKNN Runtime C API: базовые API, Matmul и пользовательские операторы

## Применимость к ArmSoM и источник

Источники — RK-YH-YF-413, V2.3.2: 52 страницы на китайском и 57 на английском. Китайская статья следует китайскому оригиналу; английская — английскому, полностью переведённому на русский и немецкий. Технических иллюстраций и скриншотов кода в источниках нет: все таблицы редактируемые, весь код копируемый; рисунки не выдумываются. Перечислены RV1103/RV1103B/RV1106/RV1106B/RV1126B, RK2118, RK3562 и серии RK3566/RK3568/RK3576/RK3588, но поддержка API, запросов и параметров различается — проверяйте матрицы поддержки. Это только справка для адаптации ArmSoM, без проверки конкретной платы, SDK/BSP, ядра и драйвера. Требуется согласовать RKNPU Runtime, формат модели и аппаратную NPU. Код не выполнялся, аппаратных и скоростных испытаний не было; примеры не являются измерениями ArmSoM.

Предупреждение: описание поддержки DEVICE_MEM_INFO противоречит матрице. Есть вопросы к INPUT/OUTPUT, перечислению CPU/GPU и порядку освобождения при работе без копирования. Значения источника сохранены; это не проверенный исправленный исполняемый код. Перед использованием сверяйтесь с примечаниями и заголовками SDK.

[EDITORIAL-NOTES](/docs/rockchip-rknn-runtime-c-api/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

<!-- source: EN PDF p6; unit 0 -->

## 1. Обзор

<!-- source: EN PDF p6; unit 1 -->

RKNN C API — интерфейсы языка C для RKNPU Runtime (библиотеки времени выполнения). Они позволяют использовать вычислительную мощность NPU для эффективного инференса моделей RKNN или матричного умножения. Здесь описаны функции, структуры данных и коды возврата RKNN C API.

<!-- source: EN PDF p6; unit 2 -->

## 2. Поддерживаемые аппаратные платформы

<!-- source: EN PDF p6; unit 3 -->

Документ относится к следующим аппаратным платформам:

<!-- source: EN PDF p6; unit 4 -->

RV1103

<!-- source: EN PDF p6; unit 5 -->

RV1103B

<!-- source: EN PDF p6; unit 6 -->

RV1106

<!-- source: EN PDF p6; unit 7 -->

RV1106B

<!-- source: EN PDF p6; unit 8 -->

RV1126B

<!-- source: EN PDF p6; unit 9 -->

RK2118

<!-- source: EN PDF p6; unit 10 -->

RK3562

<!-- source: EN PDF p6; unit 11 -->

Серия RK3566

<!-- source: EN PDF p6; unit 12 -->

Серия RK3568

<!-- source: EN PDF p6; unit 13 -->

Серия RK3576

<!-- source: EN PDF p6; unit 14 -->

Серия RK3588

<!-- source: EN PDF p7; unit 15 -->

## 3. Инструкции по сборке RKNPU

<!-- source: EN PDF p7; unit 16 -->

При сборке приложения необходимо подключить заголовочный файл с функцией интерфейса и скомпоновать приложение с соответствующей библиотекой RKNPU Runtime для используемых аппаратной платформы и системы. Далее описаны заголовочные файлы RKNN C API и файлы библиотек времени выполнения.

<!-- source: EN PDF p7; unit 17 -->

### 3.1 Заголовочные файлы RKNN C API

<!-- source: EN PDF p7; unit 18 -->

По назначению RKNN C API делится на три части. Соответствие функций, определений структур данных и заголовочных файлов следующее:

<!-- source: EN PDF p7; unit 19 -->

1\. “rknn_api.h” определяет базовые интерфейсы и структуры данных для развёртывания модели RKNN.

<!-- source: EN PDF p7; unit 20 -->

2\. “rknn_matmul_api.h” определяет интерфейсы и структуры данных матричного умножения.

<!-- source: EN PDF p7; unit 21 -->

3\. “rknn_custom_op.h” определяет интерфейсы и структуры данных пользовательских операторов.

<!-- source: EN PDF p7; unit 22 -->

### 3.2 Библиотека RKNPU Runtime для Linux

<!-- source: EN PDF p7; unit 23 -->

1\. Для RK3562, серий RK3566, RK3568, RK3576, RK3588 и RV1126B библиотека RKNPU Runtime — librknnrt.so в каталоге &lt;sdk_path&gt;/rknpu2/runtime, где &lt;sdk_path&gt; — путь к комплекту разработки ПО Rockchip NPU.

<!-- source: EN PDF p7; unit 24 -->

2\. Для RV1106/RV1103/RV1106B/RV1103B библиотека RKNPU Runtime — librknnmrt.so в каталоге &lt;sdk_path&gt;/rknpu2/runtime.

<!-- source: EN PDF p7; unit 25 -->

### 3.3 Библиотека RKNPU Runtime для Android

<!-- source: EN PDF p7; unit 26 -->

На Android RKNN API можно вызывать двумя способами:

<!-- source: EN PDF p7; unit 27 -->

1\. Приложение непосредственно связывается с librknnrt.so.

<!-- source: EN PDF p7; unit 28 -->

2\. Приложение связывается с librknn_api_android.so, реализованной через HIDL на Android.

<!-- source: EN PDF p7; unit 29 -->

Устройства Android, которые должны пройти CTS/VTS, должны использовать RKNN API на основе Android HIDL; librknn_api_android.so не включает матричное умножение и пользовательские операторы. Если CTS/VTS не требуется, рекомендуется напрямую использовать librknnrt.so, включающую обе эти функции: цепочка вызовов интерфейса короче и может обеспечивать лучшую производительность.

<!-- source: EN PDF p7; unit 30 -->

Код RKNN API на основе Android HIDL расположен в каталоге vendor/rockchip/hardware/interfaces/neuralnetworks системного Android SDK для RK3562/RK3566/RK3568/RK3576/RK3588.

<!-- source: EN PDF p7; unit 31 -->

После сборки Android создаётся набор библиотек RKNPU; для разработки приложений достаточно связать приложение с librknn_api_android.so. Список файлов приведён ниже:

<!-- source: EN PDF p7; unit 32 -->

```c
/vendor/lib/librknn_api_android.so
/vendor/lib/librknnhal_bridge.rockchip.so
/vendor/lib64/librknn_api_android.so
/vendor/lib64/librknnhal_bridge.rockchip.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0.so
/vendor/lib64/rockchip.hardware.neuralnetworks@1.0-adapter-helper.so
/vendor/lib64/hw/rockchip.hardware.neuralnetworks@1.0-impl.so
/vendor/bin/hw/rockchip.hardware.neuralnetworks@1.0-service
```

<!-- source: EN PDF p8; unit 33 -->

Для отдельной повторной сборки этих библиотек также можно использовать следующую команду:

<!-- source: EN PDF p8; unit 34 -->

```c
mmm vendor/rockchip/hardware/interfaces/neuralnetworks/ -j8
```

<!-- source: EN PDF p8; unit 35 -->

### 3.4 Библиотека RKNPU Runtime для RK2118

<!-- source: EN PDF p8; unit 36 -->

Для RK2118 библиотека RKNPU Runtime находится в системном SDK RK2118. См. раздел “Prepare RK2118 SDK” документа “Rockchip_RK2118_Quick_Start_RKNN_SDK_EN.pdf”.

<!-- source: EN PDF p9; unit 37 -->

## 4. Описание RKNN C API

<!-- source: EN PDF p9; unit 38 -->

### 4.1 Поддержка C API аппаратными платформами

<!-- source: EN PDF p9; unit 39 -->

Из-за различий аппаратных характеристик поддержка интерфейсов RKNN C API и их параметров зависит от платформы. Поддержка интерфейсов показана в таблице 4-1.

<!-- source: EN PDF p9; unit 40 -->

Таблица 4-1:

<!-- source: EN PDF p9; unit 41 -->

Таблица 4-1. Поддержка интерфейсов RKNN C API аппаратными платформами

<!-- source: EN PDF p9,10; unit 42,43 -->

|  | RKNN C API | RV1126B/RK3562/RK3566/<br>RK3568 | RK3576/RK3588 | RV1106/RV1103/<br>RV1103B/RV1106B | RK2118 |
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

<!-- source: EN PDF p10; unit 44 -->

Поддерживаемые платформами параметры запроса rknn_query приведены в таблице 4-2:

<!-- source: EN PDF p10; unit 45 -->

Таблица 4-2. Поддержка параметров rknn_query аппаратными платформами

<!-- source: EN PDF p10; unit 46 -->

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

<!-- source: EN PDF p10; unit 47 -->

### 4.2 Определения базовых структур данных

<!-- source: EN PDF p10; unit 48 -->

#### rknn_sdk_version

<!-- source: EN PDF p10; unit 49 -->

Структура rknn_sdk_version содержит сведения о версии RKNN SDK. Определение приведено в следующей таблице:

<!-- source: EN PDF p10; unit 50 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| api_version | char[] | Сведения о версии API SDK. |
| drv_version | char[] | Сведения о версии драйвера SDK. |

<!-- source: EN PDF p11; unit 51 -->

#### rknn_input_output_num

<!-- source: EN PDF p11; unit 52 -->

Структура rknn_input_output_num задаёт число входных и выходных тензоров. Определение приведено в таблице:

<!-- source: EN PDF p11; unit 53 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| n_input | uint32_t | Число входных тензоров. |
| n_output | uint32_t | Число выходных тензоров. |

<!-- source: EN PDF p11; unit 54 -->

#### rknn_input_range

<!-- source: EN PDF p11; unit 55 -->

Структура rknn_input_range описывает список поддерживаемых форм входа: индекс входа, число форм, формат размещения данных, имя и список форм. Полное определение приведено в таблице:

<!-- source: EN PDF p11; unit 56 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| index | uint32_t | Индекс входа. |
| shape_number | uint32_t | Число входных форм, поддерживаемых моделью RKNN. |
| fmt | rknn_tensor_format | Формат размещения данных соответствующей формы. |
| name | char[] | Имя входа. |
| dyn_range | uint32_t[][] | Список форм входа: двумерный массив, содержащий несколько массивов форм; формы хранятся по первой размерности. |
| n_dims | uint32_t | Число действительных измерений каждого массива формы. |

<!-- source: EN PDF p12; unit 57 -->

#### rknn_tensor_attr

<!-- source: EN PDF p12; unit 58 -->

Структура rknn_tensor_attr описывает атрибуты тензора модели. Определение приведено в таблице:

<!-- source: EN PDF p12,13; unit 59,60 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| index | uint32_t | Индекс входного или выходного тензора. |
| n_dims | uint32_t | Число измерений тензора. |
| dims | uint32_t[] | Значение каждого измерения. |
| name | char[] | Имя тензора. |
| n_elems | uint32_t | Число элементов данных тензора. |
| size | uint32_t | Размер памяти данных тензора. |
| fmt | rknn_tensor_format | Формат измерений тензора: RKNN_TENSOR_NCHW, RKNN_TENSOR_NHWC, RKNN_TENSOR_NC1HWC2. |
| type | rknn_tensor_type | Тип данных тензора: RKNN_TENSOR_FLOAT32, RKNN_TENSOR_FLOAT16, RKNN_TENSOR_INT8, RKNN_TENSOR_UINT8, RKNN_TENSOR_INT16, RKNN_TENSOR_UINT16, RKNN_TENSOR_INT32, RKNN_TENSOR_INT64, RKNN_TENSOR_BOOL. |
| qnt_type | rknn_tensor_qnt_type | Тип квантования: RKNN_TENSOR_QNT_NONE — без квантования; RKNN_TENSOR_QNT_DFP — динамическая квантованная фиксированная точка; RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC — асимметричное квантование. |
| fl | int8_t | Параметр квантования RKNN_TENSOR_QNT_DFP. |
| scale | float | Параметр квантования RKNN_TENSOR_QNT_AFFINE_ASYMMETRIC. |
| w_stride | uint32_t | Фактическое число пикселей для хранения строки изображения: действительные пиксели строки плюс недействительные пиксели заполнения, позволяющие аппаратуре быстро перейти к следующей строке. Единица — пиксель. |
| size_with_stride | uint32_t | Фактический размер изображения в байтах, включая недействительные пиксели заполнения. |
| pass_through | uint8_t | 0 — непреобразованные данные; 1 — преобразованные данные. Преобразование включает нормализацию и квантование. |
| h_stride | uint32_t | Используется только при входе из нескольких batch и задаётся пользователем, чтобы NPU правильно определяла начальный адрес каждого batch. Равно исходной высоте входа модели плюс число недействительных пикселей заполнения для быстрого перехода аппаратуры к следующей строке. При значении 0 равно высоте входа модели. Единица — пиксель. |

<!-- source: EN PDF p13; unit 61 -->

#### rknn_perf_detail

<!-- source: EN PDF p13; unit 62 -->

Структура rknn_perf_detail описывает подробные показатели производительности модели. Определение приведено в таблице. Примечание: RV1106/RV1103/RV1106B/RV1103B/RK2118 не поддерживаются.

<!-- source: EN PDF p13; unit 63 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| perf_data | char* | Подробные показатели производительности: время выполнения каждого слоя сети, сохранённое строкой. |
| data_len | uint64_t | Длина строковых данных perf_data. |

<!-- source: EN PDF p13; unit 64 -->

#### rknn_perf_run

<!-- source: EN PDF p13; unit 65 -->

Структура rknn_perf_run описывает общее время инференса модели. Определение приведено в таблице. Примечание: RV1106/RV1103/RV1106B/RV1103B/RK2118 не поддерживаются.

<!-- source: EN PDF p13; unit 66 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| run_duration | int64_t | Общее время инференса сети в микросекундах без настройки входов и выходов. |

<!-- source: EN PDF p14; unit 67 -->

#### rknn_mem_size

<!-- source: EN PDF p14; unit 68 -->

Структура rknn_mem_size описывает выделение памяти при инициализации модели. Определение приведено в таблице:

<!-- source: EN PDF p14; unit 69 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| total_weight_size | uint32_t | Объём памяти, выделенный под веса сети. |
| total_internal_size | uint32_t | Объём памяти внутренних тензоров сети. |
| total_dma_allocated_size | uint64_t | Общий объём DMA-памяти, выделенной сети. |
| total_sram_size | uint32_t | Только RK3588: размер SRAM, зарезервированной для NPU. Подробнее см. RK3588_NPU_SRAM_usage.md. |
| free_sram_size | uint32_t | Только RK3588: доступная в данный момент SRAM. Подробнее см. RK3588_NPU_SRAM_usage.md. |
| reserved[12] | uint32_t | Зарезервировано. |

<!-- source: EN PDF p14; unit 70 -->

#### rknn_tensor_mem

<!-- source: EN PDF p14; unit 71 -->

Структура rknn_tensor_mem описывает память тензора. Определение приведено в таблице:

<!-- source: EN PDF p14; unit 72 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| virt_addr | void* | Виртуальный адрес тензора. |
| phys_addr | uint64_t | Физический адрес тензора. |
| fd | int32_t | Файловый дескриптор тензора. |
| offset | int32_t | Смещение fd и виртуального адреса. |
| size | uint32_t | Фактический размер тензора. |
| flags | uint32_t | Флаги rknn_tensor_mem: RKNN_TENSOR_MEMORY_FALGS_ALLOC_INSIDE — структура создана внутри Runtime; RKNN_TENSOR_MEMORY_FLAGS_FROM_FD — создана через fd; RKNN_TENSOR_MEMORY_FLAGS_FROM_PHYS — создана по физическому адресу. Пользователю не требуется учитывать эти флаги. |
| priv_data | void* | Внутренние данные. |

<!-- source: EN PDF p15; unit 73 -->

#### rknn_input

<!-- source: EN PDF p15; unit 74 -->

Структура rknn_input представляет входные данные модели и используется как параметр rknn_inputs_set. Определение приведено в таблице:

<!-- source: EN PDF p15; unit 75 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| index | uint32_t | Индекс данного входа. |
| buf | void* | Указатель на буфер входных данных. |
| size | uint32_t | Размер памяти буфера входных данных. |
| pass_through | uint8_t | При 1 buf напрямую задаёт входной узел модели без предварительной обработки. |
| type | rknn_tensor_type | Тип входных данных. |
| fmt | rknn_tensor_format | Формат входных данных. |

<!-- source: EN PDF p15; unit 76 -->

#### rknn_output

<!-- source: EN PDF p15; unit 77 -->

Структура rknn_output представляет выходные данные модели и используется как параметр rknn_outputs_get. После вызова rknn_outputs_get она заполняется данными. Определения всех полей приведены в таблице:

<!-- source: EN PDF p15; unit 78 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| want_float | uint8_t | Нужно ли преобразовать выходные данные в float; поле задаётся пользователем. |
| is_prealloc | uint8_t | Предварительно ли выделен буфер выходных данных; поле задаётся пользователем. |
| index | uint32_t | Индекс данного выхода. В исходнике поле одновременно названо задаваемым пользователем и возвращаемым интерфейсом; противоречие сохранено. |
| buf | void* | Указатель на буфер выходных данных, возвращаемый интерфейсом. |
| size | uint32_t | Размер буфера выходных данных в байтах, возвращаемый интерфейсом. |

<!-- source: EN PDF p16; unit 79 -->

#### rknn_init_extend

<!-- source: EN PDF p16; unit 80 -->

Структура rknn_init_extend содержит расширенную информацию инициализации модели. В описываемой версии она недоступна на RV1106/RV1103/RV1106B/RV1103B/RK2118. Определение приведено в таблице:

<!-- source: EN PDF p16; unit 81 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| ctx | rknn_context | Инициализированный объект rknn_context. |
| real_model_offset | int32_t | Фактическое смещение в файле модели .rknn. Действует только при инициализации через путь к файлу или буфер модели без копирования. |
| real_model_size | uint32_t | Фактический размер файла модели rknn. Действует только при инициализации через путь к файлу или буфер модели без копирования. |
| model_buffer_fd | int32_t | fd памяти модели, выделенной NPU после инициализации с RKNN_FLAG_MODEL_BUFFER_ZERO_COPY. |
| model_buffer_flags | uint32_t | Флаги памяти модели, выделенной NPU после инициализации с RKNN_FLAG_MODEL_BUFFER_ZERO_COPY. |
| reserved | uint8_t[] | Зарезервированные данные. |

<!-- source: EN PDF p16; unit 82 -->

#### rknn_run_extend

<!-- source: EN PDF p16; unit 83 -->

Структура rknn_run_extend содержит расширенную информацию при инференсе модели. В описываемой версии недоступна. Определение приведено в таблице:

<!-- source: EN PDF p16; unit 84 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| frame_id | uint64_t | Индекс кадра текущего инференса. |
| non_block | int32_t | 0 — блокирующий режим; 1 — неблокирующий, при котором rknn_run возвращается немедленно. |
| timeout_ms | int32_t | Тайм-аут инференса в миллисекундах. |
| fence_fd | int32_t | Для неблокирующего инференса; недоступно. |

<!-- source: EN PDF p16; unit 85 -->

#### rknn_output_extend

<!-- source: EN PDF p16; unit 86 -->

Структура rknn_output_extend служит для получения расширенной информации выхода. В описываемой версии недоступна. Определение приведено в таблице:

<!-- source: EN PDF p16; unit 87 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| frame_id | int32_t | Индекс кадра выходного результата. |

<!-- source: EN PDF p17; unit 88 -->

#### rknn_custom_string

<!-- source: EN PDF p17; unit 89 -->

Структура rknn_custom_string содержит пользовательскую строку, заданную при преобразовании модели RKNN. Определение приведено в таблице:

<!-- source: EN PDF p17; unit 90 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| string | char[] | Пользовательская строка. |

<!-- source: EN PDF p18; unit 91 -->

### 4.3 Описание базовых API

<!-- source: EN PDF p18; unit 92 -->

#### rknn_init

<!-- source: EN PDF p18; unit 93 -->

Функция инициализации rknn_init создаёт объект rknn_context, загружает модель RKNN и выполняет заданные действия инициализации согласно флагам и структуре rknn_init_extend.

<!-- source: EN PDF p18; unit 94 -->

| API | rknn_init |
| --- | --- |
| Описание | Инициализирует контекст rknn. |
| Параметры | rknn_context *context: указатель на объект rknn_context. |
|  | void *model: двоичные данные модели RKNN или путь к ней. При size&gt;0 — двоичные данные; при size=0 — путь модели. |
|  | uint32_t size: размер модели, переданной двоичными данными; 0, если model задаёт путь. |
|  | uint32_t flag: флаг инициализации; для поведения по умолчанию задайте 0. |
|  | rknn_init_extend: расширенная информация специальной инициализации. Источник называет её отключённой и требует NULL, но для совместного использования весов требует указатель другого rknn_context, связанного с другой моделью. Оба утверждения сохранены. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p18; unit 95 -->

Пример кода:

<!-- source: EN PDF p18; unit 96 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
```

<!-- source: EN PDF p18; unit 97 -->

Флаги инициализации описаны далее:

<!-- source: EN PDF p18; unit 98 -->

RKNN_FLAG_COLLECT_PERF_MASK: позволяет запрашивать время выполнения каждого слоя сети.

<!-- source: EN PDF p18; unit 99 -->

RKNN_FLAG_MEM_ALLOC_OUTSIDE: указывает, что память входов, выходов, весов и промежуточных тензоров модели полностью выделяет пользователь. Основные назначения:

<!-- source: EN PDF p18; unit 100 -->

1\. Выделение всей памяти пользователем упрощает общее планирование системной памяти.

<!-- source: EN PDF p18; unit 101 -->

2\. Повторное использование памяти, особенно при её сильном дефиците, как на RV1106/RV1103/RV1106B/RV1103B/RK2118.

<!-- source: EN PDF p18; unit 102 -->

Предположим, модели A и B выполняются последовательно. Тогда память промежуточных тензоров обеих моделей можно использовать повторно. Пример кода:

<!-- source: EN PDF p18,19; unit 103,104 -->

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

<!-- source: EN PDF p19; unit 105 -->

RKNN_FLAG_SHARE_WEIGHT_MEM: используется для совместного использования весов другой модели. Основное назначение — имитация входа переменной длины; начиная с RKNPU Runtime 1.5.0 эта функция заменена динамическими формами. Например, речевые модели имеют переменную длину входа, но NPU не поддерживает такой вход непосредственно, поэтому создают несколько моделей RKNN разных разрешений. Только одна модель содержит полные веса, остальные — без весов. При инициализации модели без весов этот флаг позволяет текущему контексту использовать веса полной модели. Для двух моделей разрешений A и B порядок следующий:

<!-- source: EN PDF p19; unit 106 -->

1\. Создайте модель разрешения A с помощью RKNN-Toolkit2.

<!-- source: EN PDF p19; unit 107 -->

2\. Создайте с помощью RKNN-Toolkit2 модель разрешения B без весов: в rknn.config() задайте remove_weight=True. Главная цель — уменьшить размер модели B.

<!-- source: EN PDF p19; unit 108 -->

3\. На плате обычным образом инициализируйте модель A.

<!-- source: EN PDF p19; unit 109 -->

4\. Инициализируйте модель B с флагом RKNN_FLAG_SHARE_WEIGHT_MEM.

<!-- source: EN PDF p19; unit 110 -->

5\. Остальное используется обычным образом. Пример кода для платы:

<!-- source: EN PDF p19; unit 111 -->

```c
rknn_context ctx_a, ctx_b;
rknn_init(&ctx_a, model_path_a, 0, 0, NULL);

rknn_init_extend extend;
extend.ctx = ctx_a;
rknn_init(&ctx_b, model_path_b, 0, RKNN_FLAG_SHARE_WEIGHT_MEM, &extend);
```

<!-- source: EN PDF p19; unit 112 -->

RKNN_FLAG_COLLECT_MODEL_INFO_ONLY: инициализирует пустой контекст. В нём можно только вызывать rknn_query для получения общего объёма памяти весов и промежуточных тензоров; инференс невозможен.

<!-- source: EN PDF p19; unit 113 -->

RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE: промежуточные тензоры модели выделяет пользователь. Обычно применяется для самостоятельного управления и повторного использования их памяти между несколькими моделями.

<!-- source: EN PDF p19; unit 114 -->

RKNN_FLAG_EXECUTE_FALLBACK_PRIOR_DEVICE_GPU: для всех слоёв, не поддерживаемых NPU, предпочтительно выполнение на GPU, но оно не гарантируется. Фактическое устройство исполнения зависит от поддержки оператора библиотекой Runtime.

<!-- source: EN PDF p19; unit 115 -->

RKNN_FLAG_ENABLE_SRAM: память промежуточных тензоров по возможности выделяется в SRAM.

<!-- source: EN PDF p19; unit 116 -->

RKNN_FLAG_SHARE_SRAM: текущий контекст пытается совместно использовать адресное пространство SRAM другого контекста. При инициализации текущего контекста обязательно должен быть включён RKNN_FLAG_ENABLE_SRAM.

<!-- source: EN PDF p20; unit 117 -->

RKNN_FLAG_DISABLE_PROC_HIGH_PRIORITY: текущий контекст использует стандартный приоритет процесса. Без этого флага nice процесса равен -19.

<!-- source: EN PDF p20; unit 118 -->

RKNN_FLAG_DISABLE_FLUSH_INPUT_MEM_CACHE: Runtime не сбрасывает кэш входного тензора; пользователь обязан обеспечить сброс до вызова rknn_run.

<!-- source: EN PDF p20; unit 119 -->

RKNN_FLAG_DISABLE_FLUSH_OUTPUT_MEM_CACHE: Runtime не очищает кэш выходного тензора автоматически. Прямой доступ пользователя к output_mem-&gt;virt_addr тогда может нарушить согласованность кэша. Перед использованием output_mem-&gt;virt_addr необходимо обновить кэш через rknn_mem_sync(ctx, mem, RKNN_MEMORY_SYNC_FROM_DEVICE). Флаг обычно нужен, когда выход NPU читает не CPU, а, например, GPU или RGA.

<!-- source: EN PDF p20; unit 120 -->

RKNN_FLAG_MODEL_BUFFER_ZERO_COPY: переданный rknn_init буфер модели выделен через rknn_create_mem или rknn_create_mem2. Runtime не создаёт дополнительную копию буфера, уменьшая потребление памяти. Пользователь должен сохранять память модели действительной до уничтожения контекста и освобождать её после этого. При инициализации поля real_model_offset, real_model_size, model_buffer_fd и model_buffer_flags параметра rknn_init_extend функции rknn_init задаются по rknn_tensor_mem, возвращённому rknn_create_mem2.

<!-- source: EN PDF p20; unit 121 -->

RKNN_MEM_FLAG_ALLOC_NO_CONTEXT: при выделении памяти через rknn_create_mem2 разрешает ctx=0 или NULL. Поэтому память драйвера NPU можно получить до инициализации какого-либо контекста. Возвращённую структуру памяти необходимо освободить через rknn_destroy_mem, передав любой контекст. Пример кода:

<!-- source: EN PDF p20; unit 122 -->

```c
 rknn_tensor_mem* model_mem = rknn_create_mem2(ctx, model_size,
RKNN_MEM_FLAG_ALLOC_NO_CONTEXT);
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

<!-- source: EN PDF p20; unit 123 -->

#### rknn_set_core_mask

<!-- source: EN PDF p20; unit 124 -->

Функция задаёт конкретные ядра NPU для выполнения. В описываемом состоянии поддерживаются только RK3588 и RK3576. На платформе с одноядерной NPU возвращается код ошибки.

<!-- source: EN PDF p20,21; unit 125,126 -->

| API | rknn_set_core_mask |
| --- | --- |
| Описание | Задаёт ядра NPU. |
| Параметры | rknn_context context: объект rknn_context. |
|  | rknn_core_mask core_mask: выбор ядер NPU. RKNN_NPU_CORE_AUTO — автоматический выбор свободного ядра; RKNN_NPU_CORE_0 — NPU0; RKNN_NPU_CORE_1 — NPU1; RKNN_NPU_CORE_2 — NPU2; RKNN_NPU_CORE_0_1 — одновременно NPU0 и NPU1; RKNN_NPU_CORE_0_1_2 — одновременно NPU0, NPU1 и NPU2; RKNN_NPU_CORE_ALL — все ядра NPU данной платформы. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p21; unit 127 -->

```c
rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

<!-- source: EN PDF p21; unit 128 -->

В многоядерных режимах RKNN_NPU_CORE_0_1 и RKNN_NPU_CORE_0_1_2 лучше ускоряются Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu, Prelu и LeakyRelu. Остальные операторы продолжают работу на Core0. Источник обещает поддержку Pool и ConvTranpose в будущих обновлениях; это обещание оригинала, не подтверждение текущей реализации.

<!-- source: EN PDF p21; unit 129 -->

#### rknn_set_batch_core_num

<!-- source: EN PDF p21; unit 130 -->

rknn_set_batch_core_num задаёт число ядер NPU для модели RKNN с несколькими batch, экспортированной при rknn_batch_size больше 1 в RKNN-Toolkit2. Поддерживаются только RK3588 и RK3576.

<!-- source: EN PDF p21; unit 131 -->

| API | rknn_set_batch_core_num |
| --- | --- |
| Описание | Задаёт число ядер NPU для выполнения модели RKNN с несколькими batch. |
| Параметры | rknn_context context: объект rknn_context. |
|  | int core_num: число используемых ядер. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p21; unit 132 -->

Пример кода:

<!-- source: EN PDF p21; unit 133 -->

```c
rknn_context ctx;
int ret = rknn_set_batch_core_num(ctx, 2);
```

<!-- source: EN PDF p21; unit 134 -->

#### rknn_dup_context

<!-- source: EN PDF p21; unit 135 -->

rknn_dup_context создаёт новый контекст, ссылающийся на ту же модель. Он полезен для повторного использования весов при многопоточном выполнении одной модели. Недоступно на RV1106/RV1103/RV1106B/RV1103B/RK2118.

<!-- source: EN PDF p22; unit 136 -->

| API | rknn_dup_context |
| --- | --- |
| Описание | Создаёт новый контекст той же модели для повторного использования весов. |
| Параметры | rknn_context *context_in: указатель объекта rknn_context. По тексту источника после вызова входной контекст будет инициализирован. |
|  | rknn_context *context_out: указатель выходного объекта rknn_context, в котором возвращаются сведения о новом объекте. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p22; unit 137 -->

Пример кода:

<!-- source: EN PDF p22; unit 138 -->

```c
rknn_context ctx_in;
rknn_context ctx_out;
int ret = rknn_dup_context(&ctx_in, &ctx_out);
```

<!-- source: EN PDF p22; unit 139 -->

#### rknn_destroy

<!-- source: EN PDF p22; unit 140 -->

Функция освобождает rknn_context и связанные ресурсы.

<!-- source: EN PDF p22; unit 141 -->

| API | rknn_destroy |
| --- | --- |
| Описание | Уничтожает rknn_context и связанные ресурсы. |
| Параметры | rknn_context context: уничтожаемый объект rknn_context. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p22; unit 142 -->

Пример кода:

<!-- source: EN PDF p22; unit 143 -->

```c
rknn_context ctx;
int ret = rknn_destroy(ctx);
```

<!-- source: EN PDF p23; unit 144 -->

#### rknn_query

<!-- source: EN PDF p23; unit 145 -->

rknn_query запрашивает сведения о модели и SDK: входы и выходы модели, время выполнения отдельных слоёв, общее время инференса, версию SDK, потребление памяти, пользовательские строки и другую информацию.

<!-- source: EN PDF p23; unit 146 -->

| API | rknn_query |
| --- | --- |
| Описание | Запрашивает сведения о модели и SDK. |
| Параметры | rknn_context context: объект rknn_contex (написание источника). |
|  | rknn_query_cmd: команда запроса. |
|  | void* info: объект структуры для результата запроса. |
|  | uint32_t size: размер объекта структуры info. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p23; unit 147 -->

В описываемой версии SDK поддерживает следующие команды запроса:

<!-- source: EN PDF p23,24; unit 148,149 -->

| Команда запроса | Структура результата | Назначение |
| --- | --- | --- |
| RKNN_QUERY_IN_OUT_NUM | rknn_input_output_num | Число входных и выходных тензоров. |
| RKNN_QUERY_INPUT_ATTR | rknn_tensor_attr | Атрибуты входного тензора. |
| RKNN_QUERY_OUTPUT_ATTR | rknn_tensor_attr | Атрибуты выходного тензора. |
| RKNN_QUERY_PERF_DETAIL | rknn_perf_detail | Время каждого слоя сети; работает только при RKNN_FLAG_COLLECT_PERF_MASK, заданном через rknn_init. |
| RKNN_QUERY_PERF_RUN | rknn_perf_run | Общее время инференса в микросекундах без настройки входов и выходов. |
| RKNN_QUERY_SDK_VERSION | rknn_sdk_version | Версия SDK. |
| RKNN_QUERY_MEM_SIZE | rknn_mem_size | Память весов и внутренних тензоров сети. |
| RKNN_QUERY_CUSTOM_STRING | rknn_custom_string | Пользовательские строки модели RKNN. |
| RKNN_QUERY_NATIVE_INPUT_ATTR | rknn_tensor_attr | В API без копирования — нативные атрибуты входа, непосредственно читаемого NPU. |
| RKNN_QUERY_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | В API без копирования — нативные атрибуты выхода непосредственно от NPU. |
| RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | rknn_tensor_attr | В API без копирования — нативные атрибуты входа, непосредственно читаемого NPU; эквивалентно RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | rknn_tensor_attr | В API без копирования — нативные атрибуты выхода; источник далее называет их атрибутами входа, читаемого NPU. Эквивалентно RKNN_QUERY_NATIVE_OUTPUT_ATTR. Противоречие вход/выход сохранено. |
| RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | rknn_tensor_attr | В API без копирования — нативные атрибуты входа, непосредственно читаемого NPU. Источник приравнивает команду к RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | rknn_tensor_attr | В API без копирования — нативные атрибуты выходного NHWC-тензора; источник далее называет их атрибутами входа, непосредственно читаемого NPU. |
| RKNN_QUERY_DEVICE_MEM_INFO | rknn_tensor_mem | Свойства памяти буфера модели. |
| RKNN_QUERY_INPUT_DYNAMIC_RANGE | rknn_input_range | Для модели с динамическими формами — число и список поддерживаемых форм входа, их размещение данных и имена. |
| RKNN_QUERY_CURRENT_INPUT_ATTR | rknn_tensor_attr | Для модели с динамическими формами — входные атрибуты текущего инференса. |
| RKNN_QUERY_CURRENT_OUTPUT_ATTR | rknn_tensor_attr | Для модели с динамическими формами — выходные атрибуты текущего инференса. |
| RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | rknn_tensor_attr | Для модели с динамическими формами — нативные входные атрибуты NPU текущего инференса. |
| RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | Для модели с динамическими формами — нативные выходные атрибуты NPU текущего инференса. |

<!-- source: EN PDF p24; unit 150 -->

Далее каждая команда рассмотрена подробно.

<!-- source: EN PDF p24; unit 151 -->

##### 1. Запрос версии SDK

<!-- source: EN PDF p24; unit 152 -->

RKNN_QUERY_SDK_VERSION запрашивает версию RKNN SDK. Сначала необходимо создать объект структуры rknn_sdk_version.

<!-- source: EN PDF p24; unit 153 -->

Пример кода:

<!-- source: EN PDF p24; unit 154 -->

```c
rknn_sdk_version version;
ret = rknn_query(ctx, RKNN_QUERY_SDK_VERSION, &version,
         sizeof(rknn_sdk_version));
printf("sdk api version: %s\n", version.api_version);
printf("driver version: %s\n", version.drv_version);
```

<!-- source: EN PDF p24; unit 155 -->

##### 2. Запрос числа входных и выходных тензоров

<!-- source: EN PDF p24; unit 156 -->

RKNN_QUERY_IN_OUT_NUM запрашивает число входных и выходных тензоров модели. Сначала создайте объект структуры rknn_input_output_num.

<!-- source: EN PDF p24; unit 157 -->

Пример кода:

<!-- source: EN PDF p24; unit 158 -->

```c
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num, sizeof(io_num));
printf("model input num: %d, output num: %d\n", io_num.n_input, io_num.n_output);
```

<!-- source: EN PDF p24; unit 159 -->

##### 3. Запрос атрибутов входного тензора (обычный API)

<!-- source: EN PDF p25; unit 160 -->

RKNN_QUERY_INPUT_ATTR запрашивает атрибуты входного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source: EN PDF p25; unit 161 -->

Примечание: на RV1106/RV1103/RV1106B/RV1103B/RK2118 запрашивается исходный входной тензор в нативном формате.

<!-- source: EN PDF p25; unit 162 -->

Пример кода:

<!-- source: EN PDF p25; unit 163 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p25; unit 164 -->

##### 4. Запрос атрибутов выходного тензора (обычный API)

<!-- source: EN PDF p25; unit 165 -->

RKNN_QUERY_OUTPUT_ATTR запрашивает атрибуты выходного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source: EN PDF p25; unit 166 -->

Пример кода:

<!-- source: EN PDF p25; unit 167 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR, &(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p25; unit 168 -->

##### 5. Запрос времени инференса каждого слоя модели

<!-- source: EN PDF p25; unit 169 -->

После rknn_run команда RKNN_QUERY_PERF_DETAIL запрашивает время инференса по слоям в микросекундах. Для этого параметр flag при rknn_init должен включать RKNN_FLAG_COLLECT_PERF_MASK.

<!-- source: EN PDF p25; unit 170 -->

Пример кода:

<!-- source: EN PDF p25; unit 171 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_COLLECT_PERF_MASK, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_detail perf_detail;
ret = rknn_query(ctx, RKNN_QUERY_PERF_DETAIL, &perf_detail, sizeof(perf_detail));
```

<!-- source: EN PDF p25; unit 172 -->

##### 6. Запрос общего времени инференса модели

<!-- source: EN PDF p25; unit 173 -->

После rknn_run команда RKNN_QUERY_PERF_RUN запрашивает время инференса модели в микросекундах, без времени настройки входов и выходов.

<!-- source: EN PDF p25; unit 174 -->

Пример кода:

<!-- source: EN PDF p25; unit 175 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_run perf_run;
ret = rknn_query(ctx, RKNN_QUERY_PERF_RUN, &perf_run, sizeof(perf_run));
```

<!-- source: EN PDF p26; unit 176 -->

##### 7. Запрос выделенной памяти модели

<!-- source: EN PDF p26; unit 177 -->

После rknn_init, если пользователь самостоятельно выделяет память сети, RKNN_QUERY_MEM_SIZE позволяет запросить память весов и внутреннюю память сети, исключая входы и выходы. Для этого параметр flag при rknn_init должен включать RKNN_FLAG_MEM_ALLOC_OUTSIDE.

<!-- source: EN PDF p26; unit 178 -->

Пример кода:

<!-- source: EN PDF p26; unit 179 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_MEM_ALLOC_OUTSIDE , NULL);
rknn_mem_size mem_size;
ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size, sizeof(mem_size));
```

<!-- source: EN PDF p26; unit 180 -->

##### 8. Запрос пользовательской строки модели

<!-- source: EN PDF p26; unit 181 -->

После rknn_init команда RKNN_QUERY_CUSTOM_STRING получает пользовательскую строку, добавленную при создании модели RKNN. Например, при преобразовании модели строка “RGB” может указывать, что вход — трёхканальное изображение RGB, а не BGR. Во время выполнения по полученной строке “RGB” данные преобразуются в изображение RGB.

<!-- source: EN PDF p26; unit 182 -->

Пример кода:

<!-- source: EN PDF p26; unit 183 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
rknn_custom_string custom_string;
ret = rknn_query(ctx, RKNN_QUERY_CUSTOM_STRING, &custom_string, sizeof(custom_string));
```

<!-- source: EN PDF p26; unit 184 -->

##### 9. Запрос нативных атрибутов входного тензора (API без копирования)

<!-- source: EN PDF p26; unit 185 -->

RKNN_QUERY_NATIVE_INPUT_ATTR, эквивалентная RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR, запрашивает нативные атрибуты входного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source: EN PDF p26; unit 186 -->

Пример кода:

<!-- source: EN PDF p26; unit 187 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p26; unit 188 -->

##### 10. Запрос нативных атрибутов выходного тензора (API без копирования)

<!-- source: EN PDF p26; unit 189 -->

RKNN_QUERY_NATIVE_OUTPUT_ATTR, эквивалентная RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR, запрашивает нативные атрибуты выходного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source: EN PDF p26; unit 190 -->

Пример кода:

<!-- source: EN PDF p27; unit 191 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p27; unit 192 -->

##### 11. Запрос нативных атрибутов выходного тензора (заголовок оригинала; следующий текст относится к входу, API без копирования)

<!-- source: EN PDF p27; unit 193 -->

RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR запрашивает атрибуты NHWC входного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source: EN PDF p27; unit 194 -->

Пример кода:

<!-- source: EN PDF p27; unit 195 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
  input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR,
&(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p27; unit 196 -->

##### 12. Запрос нативных атрибутов выходного тензора (API без копирования)

<!-- source: EN PDF p27; unit 197 -->

RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR запрашивает атрибуты NHWC выходного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source: EN PDF p27; unit 198 -->

Пример кода:

<!-- source: EN PDF p27; unit 199 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
  output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p27; unit 200 -->

##### 13. Запрос поддерживаемых моделью RKNN динамических форм входа

<!-- source: EN PDF p27; unit 201 -->

Примечание: RV1106/RV1103/RV1106B/RV1103B/RK2118 не поддерживают этот интерфейс.

<!-- source: EN PDF p27; unit 202 -->

После rknn_init передайте RKNN_QUERY_INPUT_DYNAMIC_RANGE для получения сведений о поддерживаемых формах входа: их числа, списка, размещения данных, имён и других данных. Сначала создайте объект структуры rknn_input_range.

<!-- source: EN PDF p27; unit 203 -->

Пример кода:

<!-- source: EN PDF p27; unit 204 -->

```c
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input * sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++) {
  dyn_range[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE, &dyn_range[i],
sizeof(rknn_input_range));
}
```

<!-- source: EN PDF p28; unit 205 -->

##### 14. Запрос памяти буфера модели (примечание для RV1106/RV1103/RV1106B/RV1103B/RK2118)

<!-- source: EN PDF p28; unit 206 -->

Источник утверждает, что эти платформы не поддерживают интерфейс; это следует сверить с таблицей аппаратной поддержки.

<!-- source: EN PDF p28; unit 207 -->

После rknn_init команда RKNN_QUERY_DEVICE_MEM_INFO запрашивает атрибуты буфера модели, созданного внутри Runtime, включая fd и физический адрес.

<!-- source: EN PDF p28; unit 208 -->

```c
rknn_tensor_mem mem_info;
memset(&mem_info, 0, sizeof(mem_info));
ret = rknn_query(ctx, RKNN_QUERY_DEVICE_MEM_INFO, &mem_info, sizeof(mem_info));
```

<!-- source: EN PDF p28; unit 209 -->

##### 15. Запрос текущей динамической формы входа модели RKNN

<!-- source: EN PDF p28; unit 210 -->

После rknn_set_input_shapes передайте RKNN_QUERY_CURRENT_INPUT_ATTR для получения используемых моделью атрибутов входа. Сначала создайте структуру rknn_tensor_attr.

<!-- source: EN PDF p28; unit 211 -->

Примечание: RV1106/RV1103/RV1103B/RV1106B/RK2118 не поддерживают эту команду.

<!-- source: EN PDF p28; unit 212 -->

Пример кода:

<!-- source: EN PDF p28; unit 213 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
  cur_input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR, &(cur_input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p28; unit 214 -->

##### 16. Запрос текущей динамической формы выхода модели RKNN

<!-- source: EN PDF p28; unit 215 -->

После rknn_set_input_shapes передайте RKNN_QUERY_CURRENT_OUTPUT_ATTR для получения используемых моделью атрибутов выхода. Сначала создайте структуру rknn_tensor_attr.

<!-- source: EN PDF p28; unit 216 -->

Примечание: RV1106/RV1103/RV1103B/RV1106B/RK2118 не поддерживают эту команду.

<!-- source: EN PDF p28; unit 217 -->

Пример кода:

<!-- source: EN PDF p28; unit 218 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
  cur_output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p28; unit 219 -->

##### 17. Запрос текущей нативной динамической формы входа модели RKNN

<!-- source: EN PDF p28; unit 220 -->

После rknn_set_input_shapes передайте RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR для получения используемых моделью нативных атрибутов входа. Сначала создайте структуру rknn_tensor_attr.

<!-- source: EN PDF p28; unit 221 -->

Примечание: RV1106/RV1103/RV1103B/RV1106B/RK2118 не поддерживают эту команду.

<!-- source: EN PDF p28; unit 222 -->

Пример кода:

<!-- source: EN PDF p29; unit 223 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
  cur_input_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p29; unit 224 -->

##### 18. Запрос текущей нативной динамической формы выхода модели RKNN

<!-- source: EN PDF p29; unit 225 -->

После rknn_set_input_shapes источник предлагает RKNN_QUERY_CURRENT_OUTPUT_ATTR для получения текущих нативных атрибутов выхода. Сначала создайте rknn_tensor_attr. Имя команды сохранено по оригиналу; его соответствие нативному выходу требует проверки.

<!-- source: EN PDF p29; unit 226 -->

Примечание: RV1106/RV1103/RV1103B/RV1106B/RK2118 не поддерживают эту команду.

<!-- source: EN PDF p29; unit 227 -->

Пример кода:

<!-- source: EN PDF p29; unit 228 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
  cur_output_attrs[i].index = i;
  ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source: EN PDF p30; unit 229 -->

#### rknn_inputs_set

<!-- source: EN PDF p30; unit 230 -->

rknn_inputs_set задаёт входные данные модели. Поддерживается несколько входов, каждый представлен объектом rknn_input. До вызова rknn_inputs_set пользователь должен заполнить поля этих объектов. Недоступно на RV1106/RV1103/RV1103B/RV1106B/RK2118.

<!-- source: EN PDF p30; unit 231 -->

| API | rknn_inputs_set |
| --- | --- |
| Описание | Задаёт входные данные модели. |
| Параметр | rknn_context context: объект rknn_contex (написание источника). |
|  | uint32_t n_inputs: число входов. |
|  | rknn_input inputs[]: массив rknn_input. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p30; unit 232 -->

Пример кода:

<!-- source: EN PDF p30; unit 233 -->

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

<!-- source: EN PDF p30; unit 234 -->

#### rknn_run

<!-- source: EN PDF p30; unit 235 -->

rknn_run выполняет инференс модели. До вызова входные данные следует настроить через rknn_inputs_set или интерфейс без копирования.

<!-- source: EN PDF p30; unit 236 -->

| API | rknn_run |
| --- | --- |
| Описание | Выполняет инференс модели. |
| Параметр | rknn_context context: объект rknn_contex (написание источника). |
|  | rknn_run_extend* extend: резерв расширения; в описываемой версии не используется, допускается только NULL. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p30; unit 237 -->

Пример кода:

<!-- source: EN PDF p30; unit 238 -->

```c
ret = rknn_run(ctx, NULL);
```

<!-- source: EN PDF p31; unit 239 -->

#### rknn_outputs_get

<!-- source: EN PDF p31; unit 240 -->

rknn_outputs_get получает выходные данные модели. Поддерживается несколько выходов, каждый представлен объектом rknn_output, который необходимо создать и инициализировать до вызова. RV1106/RV1103/RV1106B/RV1103B/RK2118 не поддерживаются.

<!-- source: EN PDF p31; unit 241 -->

Есть два способа предоставления буферов выходных данных:

<!-- source: EN PDF p31; unit 242 -->

1\. Пользователь сам выделяет и освобождает буферы. Тогда rknn_output.is_prealloc=1, а rknn_output.buf указывает на выделенный пользователем буфер.

<!-- source: EN PDF p31; unit 243 -->

2\. Память выделяет rknn. Тогда rknn_output.is_prealloc=0. После выполнения функции создаётся rknn_output.buf с выходными данными.

<!-- source: EN PDF p31; unit 244 -->

| API | rknn_outputs_get |
| --- | --- |
| Описание | Получает выходные данные инференса. |
| Параметр | rknn_context context: объект rknn_context. |
|  | uint32_t n_outputs: число выходов. |
|  | rknn_output outputs[]: массив rknn_output. |
|  | rknn_run_extend* extend: резерв расширения; пока не используется, допускается только NULL. Тип сохранён по источнику. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p31; unit 245 -->

Пример кода:

<!-- source: EN PDF p31; unit 246 -->

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

<!-- source: EN PDF p31; unit 247 -->

#### rknn_outputs_release

<!-- source: EN PDF p31; unit 248 -->

rknn_outputs_release освобождает ресурсы объекта rknn_output.

<!-- source: EN PDF p31; unit 249 -->

| API | rknn_outputs_release |
| --- | --- |
| Описание | Освобождает объект rknn_output. |
| Параметр | rknn_context context: объект rknn_context. |
|  | uint32_t n_outputs: число выходов. |
|  | rknn_output outputs[]: массив освобождаемых rknn_output. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p31; unit 250 -->

Пример кода:

<!-- source: EN PDF p32; unit 251 -->

```c
ret = rknn_outputs_release(ctx, io_num.n_output, outputs);
```

<!-- source: EN PDF p32; unit 252 -->

#### rknn_create_mem_from_phys

<!-- source: EN PDF p32; unit 253 -->

Для предоставления памяти NPU rknn_create_mem_from_phys создаёт структуру rknn_tensor_mem и возвращает указатель на неё. Физический и виртуальный адреса, размер и сведения о внешней памяти передаются в эту структуру.

<!-- source: EN PDF p32; unit 254 -->

| API | rknn_create_mem_from_phys |
| --- | --- |
| Описание | Создаёт rknn_tensor_mem и предоставляет память по физическому адресу. |
| Параметр | rknn_context context: объект rknn_context. |
|  | uint64_t phys_addr: физический адрес буфера. |
|  | void *virt_addr: виртуальный адрес буфера, начальный адрес памяти, соответствующей fd. |
|  | uint32_t size: размер буфера. |
| Возвращаемое значение | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |

<!-- source: EN PDF p32; unit 255 -->

Пример кода:

<!-- source: EN PDF p32; unit 256 -->

```c
//suppose we have got buffer information as input_phys, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_phys(ctx, input_phys, input_virt, size);
```

<!-- source: EN PDF p33; unit 257 -->

#### rknn_create_mem_from_fd

<!-- source: EN PDF p33; unit 258 -->

Для предоставления памяти NPU rknn_create_mem_from_fd создаёт rknn_tensor_mem и возвращает указатель на структуру. В неё передаются файловый дескриптор, логический адрес, размер и сведения о внешней памяти.

<!-- source: EN PDF p33; unit 259 -->

| API | rknn_create_mem_from_fd |
| --- | --- |
| Описание / параметр | Создаёт rknn_tensor_mem и предоставляет память через файловый дескриптор. |
|  | rknn_context context: объект rknn_context. |
|  | int32_t fd: файловый дескриптор буфера. |
|  | void *virt_addr: виртуальный адрес буфера, соответствующий началу fd. |
|  | uint32_t size: размер буфера. |
|  | int32_t offset: смещение, соответствующее файловому дескриптору и виртуальному адресу. |
| Возвращаемое значение | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |

<!-- source: EN PDF p33; unit 260 -->

Пример кода:

<!-- source: EN PDF p33; unit 261 -->

```c
//suppose we have got buffer information as input_fd, input_virt and size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem_from_fd(ctx, input_fd, input_virt, size, 0);
```

<!-- source: EN PDF p33; unit 262 -->

#### rknn_create_mem

<!-- source: EN PDF p33; unit 263 -->

rknn_create_mem выделяет указанный пользователем объём памяти, непосредственно доступной NPU, и возвращает структуру rknn_tensor_mem.

<!-- source: EN PDF p33; unit 264 -->

| API | rknn_create_mem |
| --- | --- |
| Описание | Внутри Runtime создаёт rknn_tensor_mem и выделяет память. |
| Параметр | rknn_context context: объект rknn_context. |
|  | uint32_t size: размер буфера. |
| Возвращаемое значение | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |

<!-- source: EN PDF p33; unit 265 -->

Пример кода:

<!-- source: EN PDF p33; unit 266 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem(ctx, size);
```

<!-- source: EN PDF p34; unit 267 -->

#### rknn_create_mem2

<!-- source: EN PDF p34; unit 268 -->

rknn_create_mem2 выделяет непосредственно доступную NPU память заданных пользователем размера и типа, возвращая структуру rknn_tensor_mem.

<!-- source: EN PDF p34; unit 269 -->

| API | rknn_create_mem2 |
| --- | --- |
| Описание | Внутри Runtime создаёт rknn_tensor_mem и выделяет память. |
| Параметр | rknn_context context: объект rknn_context. |
|  | uint64_t size: размер буфера. |
|  | uint64_t alloc_flags: кэшируемость выделяемой памяти. RKNN_FLAG_MEMORY_CACHEABLE — кэшируемая; RKNN_FLAG_MEMORY_NON_CACHEABLE — некэшируемая; RKNN_FLAG_MEMORY_FLAGS_DEFAULT — то же, что RKNN_FLAG_MEMORY_CACHEABLE. |
| Возвращаемое значение | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |

<!-- source: EN PDF p34; unit 270 -->

Основное отличие rknn_create_mem2 от rknn_create_mem — параметр alloc_flags, позволяющий указать кэшируемость памяти. rknn_create_mem не предоставляет такого выбора и по умолчанию выделяет кэшируемую память.

<!-- source: EN PDF p34; unit 271 -->

Пример кода:

<!-- source: EN PDF p34; unit 272 -->

```c
//suppose we have got buffer size
rknn_tensor_mem* input_mems [1];
input_mems[0] = rknn_create_mem2(ctx, size, RKNN_FLAG_MEMORY_NON_CACHEABLE);
```

<!-- source: EN PDF p34; unit 273 -->

#### rknn_destroy_mem

<!-- source: EN PDF p34; unit 274 -->

rknn_destroy_mem уничтожает структуру rknn_tensor_mem. Однако память, выделенную пользователем, необходимо освободить вручную.

<!-- source: EN PDF p34; unit 275 -->

| API | rknn_destroy_mem |
| --- | --- |
| Описание | Уничтожает структуру rknn_tensor_mem. |
| Параметр | rknn_context context: объект rknn_context. |
|  | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p34; unit 276 -->

Пример кода:

<!-- source: EN PDF p34; unit 277 -->

```c
rknn_tensor_mem* input_mems [1];
int ret = rknn_destroy_mem(ctx, input_mems[0]);
```

<!-- source: EN PDF p35; unit 278 -->

#### rknn_set_weight_mem

<!-- source: EN PDF p35; unit 279 -->

Если пользователь выделил память весов сети, после инициализации соответствующей rknn_tensor_mem её можно предоставить NPU через rknn_set_weight_mem. Функцию необходимо вызвать до rknn_run.

<!-- source: EN PDF p35; unit 280 -->

| API | rknn_set_weight_mem |
| --- | --- |
| Описание | Задаёт rknn_tensor_mem со сведениями о памяти весов. |
| Параметр | rknn_context context: объект rknn_context. |
|  | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p35; unit 281 -->

Пример кода:

<!-- source: EN PDF p35; unit 282 -->

```c
rknn_tensor_mem* weight_mems [1];
int ret = rknn_set_weight_mem(ctx, weight_mems[0]);
```

<!-- source: EN PDF p35; unit 283 -->

#### rknn_set_internal_mem

<!-- source: EN PDF p35; unit 284 -->

Если пользователь выделил память внутренних тензоров сети, после инициализации соответствующей rknn_tensor_mem её можно предоставить NPU через rknn_set_internal_mem. Функцию необходимо вызвать до rknn_run.

<!-- source: EN PDF p35; unit 285 -->

| API | rknn_set_internal_mem |
| --- | --- |
| Описание | Задаёт rknn_tensor_mem со сведениями о памяти внутренних тензоров сети. |
| Параметр | rknn_context context: объект rknn_context. |
|  | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p35; unit 286 -->

Пример кода:

<!-- source: EN PDF p35; unit 287 -->

```c
rknn_tensor_mem* internal_tensor_mems [1];
int ret = rknn_set_internal_mem(ctx, internal_tensor_mems[0]);
```

<!-- source: EN PDF p35; unit 288 -->

#### rknn_set_io_mem

<!-- source: EN PDF p35; unit 289 -->

Если пользователь выделил память входных/выходных тензоров сети, после инициализации соответствующей rknn_tensor_mem её можно предоставить NPU через rknn_set_io_mem. Функцию необходимо вызвать до rknn_run.

<!-- source: EN PDF p35,36; unit 290,291 -->

| API | rknn_set_io_mem |
| --- | --- |
| Описание | Задаёт rknn_tensor_mem со сведениями о памяти входных/выходных тензоров сети. |
| Параметр | rknn_context context: объект rknn_context. |
|  | rknn_tensor_mem*: указатель структуры информации о памяти тензора. |
|  | rknn_tensor_attr *: атрибуты буфера входного или выходного тензора. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p36; unit 292 -->

Пример кода:

<!-- source: EN PDF p36; unit 293 -->

```c
rknn_tensor_attr output_attrs[1];
rknn_tensor_mem* output_mems[1];
ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR, &(output_attrs[0]), sizeof(rknn_tensor_attr));
output_mems[0] = rknn_create_mem(ctx, output_attrs[0].size_with_stride);
rknn_set_io_mem(ctx, output_mems[0], &output_attrs[0]);
```

<!-- source: EN PDF p36; unit 294 -->

#### rknn_set_input_shape (устаревший интерфейс)

<!-- source: EN PDF p36; unit 295 -->

Интерфейс устарел. Для привязки форм входа используйте rknn_set_input_shapes. В текущей версии старый интерфейс недоступен. Для продолжения его использования нужен SDK 1.5.0 и руководство версии 1.5.0.

<!-- source: EN PDF p37; unit 296 -->

#### rknn_set_input_shapes

<!-- source: EN PDF p37; unit 297 -->

Для модели RKNN с динамическими формами входа до инференса необходимо задать текущую форму. Передаются число входов и массив rknn_tensor_attr, содержащий формы и размещение данных каждого входа. В каждом объекте rknn_tensor_attr следует заполнить index, name, dims и fmt; остальные поля задавать не требуется. Предварительно через rknn_query можно получить число и список поддерживаемых динамических форм. Форма входных данных должна входить в этот список. Интерфейс вызывается при первом запуске и при каждом переходе к новой форме; в остальных случаях повторный вызов не нужен.

<!-- source: EN PDF p37; unit 298 -->

| API | rknn_set_input_shapes |
| --- | --- |
| Описание | Задаёт текущую форму входа модели. |
| Параметр | rknn_context context: объект rknn_context. |
|  | uint32_t n_inputs: число входных тензоров. |
|  | rknn_tensor_attr *: указатель массива атрибутов со всеми формами входов. Для каждого входа задаются index, name, dims, fmt и n_dims; остальные поля не требуются. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p37; unit 299 -->

Пример кода:

<!-- source: EN PDF p37; unit 300 -->

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

<!-- source: EN PDF p38; unit 301 -->

#### rknn_mem_sync

<!-- source: EN PDF p38; unit 302 -->

Память rknn_create_mem по умолчанию кэшируемая. При одновременном доступе CPU и NPU к такой памяти поведение кэша может нарушать согласованность данных. Этот интерфейс синхронизирует кэшируемую память, обеспечивая согласованность данных, доступных CPU и NPU.

<!-- source: EN PDF p38; unit 303 -->

| API | rknn_mem_sync |
| --- | --- |
| Описание | Синхронизирует данные кэша CPU и DDR. |
| Параметр | rknn_context context: объект rknn_context. |
|  | rknn_tensor_mem* mem: указатель структуры информации о памяти тензора. |
|  | rknn_mem_sync_mode mode: режим обновления CPU-кэша и DDR. RKNN_MEMORY_SYNC_TO_DEVICE — записывает данные CPU-кэша в DDR, обычно после записи CPU и перед доступом NPU к той же памяти. RKNN_MEMORY_SYNC_FROM_DEVICE — синхронизирует DDR с CPU-кэшем, обычно после записи NPU: делает кэш недействительным, чтобы при следующем доступе CPU повторно прочитал DDR. RKNN_MEMORY_SYNC_BIDIRECTIONAL — записывает CPU-кэш в DDR и заставляет CPU заново читать DDR. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p38; unit 304 -->

Пример кода:

<!-- source: EN PDF p38; unit 305 -->

```c
ret =rknn_mem_sync(ctx, &outputs[0].mem,
RKNN_MEMORY_SYNC_FROM_DEVICE);
if (ret < 0) {
  fprintf(stderr, " rknn_mem_sync error! ret=%d\n", ret);
  return -1;
}
```

<!-- source: EN PDF p39; unit 306 -->

### 4.4 Структуры данных матричного умножения

<!-- source: EN PDF p39; unit 307 -->

#### rknn_matmul_info

<!-- source: EN PDF p39; unit 308 -->

rknn_matmul_info задаёт спецификацию матричного умножения: размеры операции, тип данных и размещение входных и выходных матриц в памяти. Определение структуры приведено в таблице:

<!-- source: EN PDF p39,40; unit 309,310 -->

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

<!-- source: EN PDF p41; unit 311 -->

#### rknn_matmul_tensor_attr

<!-- source: EN PDF p41; unit 312 -->

rknn_matmul_tensor_attr описывает атрибуты тензора каждой матрицы: имя, форму, размер и тип данных. Определение структуры приведено в таблице:

<!-- source: EN PDF p41; unit 313 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| name | char[] | Имя матрицы. |
| n_dims | uint32_t | Число измерений матрицы. |
| dims | uint32_t[] | Форма матрицы. |
| size | uint32_t | Размер матрицы. |
| type | rknn_tensor_type | Тип данных матрицы. |

<!-- source: EN PDF p41; unit 314 -->

#### rknn_matmul_io_attr

<!-- source: EN PDF p41; unit 315 -->

rknn_matmul_io_attr описывает все входные и выходные тензоры матричной операции, включая атрибуты матриц A, B и C. Определение структуры приведено в таблице:

<!-- source: EN PDF p41; unit 316 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| A | rknn_matmul_tensor_attr | Атрибуты тензора матрицы A. |
| B | rknn_matmul_tensor_attr | Атрибуты тензора матрицы B. |
| C | rknn_matmul_tensor_attr | Атрибуты тензора матрицы C. |

<!-- source: EN PDF p41; unit 317 -->

#### rknn_quant_params

<!-- source: EN PDF p41; unit 318 -->

rknn_quant_params описывает параметры квантования матрицы: имя, указатели и длины массивов scale и zero_point. Поле name определяет имя матрицы; его можно получить из rknn_matmul_io_attr, возвращённой при инициализации контекста. Определение структуры приведено в таблице:

<!-- source: EN PDF p41; unit 319 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| name | char[] | Имя матрицы. |
| scale | float* | Указатель массива scale матрицы. |
| scale_len | int32_t | Длина массива scale матрицы. |
| zp | int32_t* | Указатель массива zero_point матрицы. |
| zp_len | int32_t | Длина массива zero_point матрицы. |

<!-- source: EN PDF p41; unit 320 -->

#### rknn_matmul_shape

<!-- source: EN PDF p41; unit 321 -->

rknn_matmul_shape задаёт M, K и N матричного умножения определённой формы. При инициализации контекста с динамическими формами нужно передать число форм и массив rknn_matmul_shape со всеми входными формами. Определение структуры приведено в таблице:

<!-- source: EN PDF p42; unit 322 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| M | int32_t | Число строк A. |
| K | int32_t | Число столбцов A. |
| N | int32_t | Число столбцов C. |

<!-- source: EN PDF p43; unit 323 -->

### 4.5 API матричного умножения

<!-- source: EN PDF p43; unit 324 -->

#### rknn_matmul_create

<!-- source: EN PDF p43; unit 325 -->

Функция инициализирует контекст матричного умножения по переданной спецификации и другим сведениям, возвращая форму, размер, тип данных и другие атрибуты входных и выходных тензоров. Здесь указатель rknn_matmul_ctx и rknn_context имеют одинаковую структуру данных.

<!-- source: EN PDF p43; unit 326 -->

| API | rknn_matmul_create |
| --- | --- |
| Описание | Инициализирует контекст матричного умножения. |
| Параметры | rknn_matmul_ctx* ctx: указатель контекста матричного умножения. |
|  | rknn_matmul_info* info: указатель структуры спецификации матричного умножения. |
|  | rknn_matmul_io_attr* io_attr: указатель структуры атрибутов входных/выходных тензоров матричного умножения. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p43; unit 327 -->

Пример кода:

<!-- source: EN PDF p43; unit 328 -->

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

<!-- source: EN PDF p43; unit 329 -->

#### rknn_matmul_set_io_mem

<!-- source: EN PDF p43; unit 330 -->

Функция задаёт память входов и выходов матричного умножения. Сначала создайте указатель rknn_tensor_mem через rknn_create_mem, затем передайте его вместе с указателем rknn_matmul_tensor_attr матрицы A, B или C, полученным от rknn_matmul_create. Это привязывает память к контексту операции. До вызова подготовьте данные матриц A и B согласно размещению памяти, настроенному в rknn_matmul_info.

<!-- source: EN PDF p44; unit 331 -->

| API | rknn_matmul_set_io_mem |
| --- | --- |
| Описание | Задаёт входную/выходную память матричного умножения. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
|  | rknn_tensor_mem* mem: указатель структуры информации о памяти тензора. |
|  | rknn_matmul_tensor_attr* attr: указатель структуры атрибутов входных/выходных тензоров матричного умножения. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p44; unit 332 -->

Пример кода:

<!-- source: EN PDF p44; unit 333 -->

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

<!-- source: EN PDF p45; unit 334 -->

#### rknn_matmul_set_core_mask

<!-- source: EN PDF p45; unit 335 -->

Функция задаёт доступные ядра NPU для матричного умножения; поддерживаются только RK3588 и RK3576. До вызова инициализируйте контекст через rknn_matmul_create. Маска выбирает используемые ядра для повышения производительности и эффективности матричного умножения.

<!-- source: EN PDF p45; unit 336 -->

| API | rknn_matmul_set_core_mask |
| --- | --- |
| Описание | Задаёт маску ядер NPU для матричного умножения. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
|  | rknn_core_mask core_mask: маска доступных ядер NPU для матричного умножения. Каждый бит соответствует ядру: 1 — доступно, иначе недоступно. Подробности см. в параметрах rknn_set_core_mask. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p45; unit 337 -->

Пример кода:

<!-- source: EN PDF p45; unit 338 -->

```c
rknn_matmul_set_core_mask(ctx, RKNN_NPU_CORE_AUTO);
```

<!-- source: EN PDF p45; unit 339 -->

#### rknn_matmul_set_quant_params

<!-- source: EN PDF p45; unit 340 -->

rknn_matmul_set_quant_params задаёт параметры квантования каждой матрицы в режимах Per-Channel и Per-Layer. При Per-Channel длина массивов scale и zp в rknn_quant_params равна N; при Per-Layer она равна 1. Вызовите интерфейс до rknn_matmul_run для настройки всех матриц. Без вызова применяется Per-Layer со scale=1.0 и zero_point=0.

<!-- source: EN PDF p45; unit 341 -->

| API | rknn_matmul_set_quant_params |
| --- | --- |
| Описание | Задаёт параметры квантования матрицы. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
|  | rknn_quant_params* params: параметры квантования матрицы. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p45; unit 342 -->

Пример кода:

<!-- source: EN PDF p46; unit 343 -->

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

<!-- source: EN PDF p46; unit 344 -->

#### rknn_matmul_get_quant_params

<!-- source: EN PDF p46; unit 345 -->

rknn_matmul_get_quant_params используется при rknn_matmul_type=RKNN_INT8_MM_INT8_TO_INT32 и квантовании Per-Channel для получения нормализованных scale всех каналов матрицы B. Умножение полученного scale на исходный scale матрицы A даёт scale матрицы C. Это позволяет приблизительно вычислить scale C, когда реальное значение для C отсутствует.

<!-- source: EN PDF p46; unit 346 -->

| API | rknn_matmul_get_quant_params |
| --- | --- |
| Описание | Получает параметры квантования матрицы B. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
|  | rknn_quant_params* params: параметры квантования матрицы B. |
|  | float* scale: указатель scale матрицы B. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p46; unit 347 -->

Пример кода:

<!-- source: EN PDF p46; unit 348 -->

```c
float b_scale;
rknn_matmul_get_quant_params(ctx, &params_b, &b_scale);
```

<!-- source: EN PDF p47; unit 349 -->

#### rknn_matmul_create_dynamic_shape

<!-- source: EN PDF p47; unit 350 -->

rknn_matmul_create_dynamic_shape создаёт контекст матричного умножения с динамическими формами. Передаются rknn_matmul_info, число форм и соответствующий массив с несколькими значениями M, K и N. После успешной инициализации возвращается массив rknn_matmul_io_attr с формой, размером и типом данных всех входных и выходных матриц. В описываемой версии поддерживается задание нескольких различных M, K и N.

<!-- source: EN PDF p47; unit 351 -->

| API | rknn_matmul_create_dynamic_shape |
| --- | --- |
| Описание | Инициализирует контекст матричного умножения с динамическими формами. |
| Параметры | rknn_matmul_ctx *ctx: указатель контекста матричного умножения. |
|  | rknn_matmul_info* info: указатель структуры спецификации матричного умножения. M, K и N задавать не требуется. |
|  | int shape_num: число форм, поддерживаемых контекстом. |
|  | rknn_matmul_shape dynamic_shapes[]: массив форм, поддерживаемых контекстом. |
|  | rknn_matmul_io_attr io_attrs[]: массив структур атрибутов входных/выходных тензоров матричного умножения. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p47; unit 352 -->

Пример кода:

<!-- source: EN PDF p47; unit 353 -->

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

<!-- source: EN PDF p47; unit 354 -->

#### rknn_matmul_create_dyn_shape (устаревший интерфейс)

<!-- source: EN PDF p47; unit 355 -->

Интерфейс устарел и заменён на rknn_matmul_create_dynamic_shape.

<!-- source: EN PDF p48; unit 356 -->

#### rknn_matmul_set_dynamic_shape

<!-- source: EN PDF p48; unit 357 -->

rknn_matmul_set_dynamic_shape выбирает конкретную форму матричного умножения. После создания контекста динамических форм передайте одну из структур rknn_matmul_shape, чтобы задать форму текущей операции.

<!-- source: EN PDF p48; unit 358 -->

| API | rknn_matmul_set_dynamic_shape |
| --- | --- |
| Описание | Задаёт форму матричного умножения. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
|  | rknn_matmul_shape* shape: форма, используемая для матричного умножения. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p48; unit 359 -->

Пример кода:

<!-- source: EN PDF p48; unit 360 -->

```c
ret = rknn_matmul_set_dynamic_shape(ctx, &shapes[0]);
if (ret != 0) {
 fprintf(stderr, "rknn_matmul_set_dynamic_shapes fail!\n");
 return -1;
}
```

<!-- source: EN PDF p49; unit 361 -->

#### rknn_B_normal_layout_to_native_layout

<!-- source: EN PDF p49; unit 362 -->

rknn_B_normal_layout_to_native_layout преобразует данные матрицы B из исходного размещения (KxN) в высокопроизводительное размещение данных.

<!-- source: EN PDF p49; unit 363 -->

| API | rknn_B_normal_layout_to_native_layout |
| --- | --- |
| Описание | Преобразует размещение B из исходной формы в высокопроизводительную. |
| Параметры | void* B_input: указатель данных B в исходной форме. |
|  | void* B_output: указатель данных B в высокопроизводительной форме. |
|  | int K: число строк B. |
|  | int N: число столбцов B. |
|  | int subN: равно B.dims[2] в rknn_matmul_io_attr. |
|  | int subK: равно B.dims[3] в rknn_matmul_io_attr. |
|  | rknn_matmul_info* info: указатель структуры информации о матричном умножении. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p49; unit 364 -->

Пример кода:

<!-- source: EN PDF p49; unit 365 -->

```c
int32_t subN = io_attr.B.dims[2];
int32_t subK = io_attr.B.dims[3];
rknn_B_normal_layout_to_native_layout(B_Matrix, B->virt_addr, K, N, subN, subK, &info);
```

<!-- source: EN PDF p49; unit 366 -->

#### rknn_matmul_run

<!-- source: EN PDF p49; unit 367 -->

Функция выполняет матричное умножение и сохраняет результат в матрице C. До вызова подготовьте данные A и B и привяжите их входные буферы через rknn_matmul_set_io_mem. Выходной буфер C также задаётся через rknn_matmul_set_io_mem, а атрибуты выходного тензора получают через rknn_matmul_create.

<!-- source: EN PDF p49; unit 368 -->

| API | rknn_matmul_run |
| --- | --- |
| Описание | Выполняет матричное умножение. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p49; unit 369 -->

Пример кода:

<!-- source: EN PDF p49; unit 370 -->

```c
int ret = rknn_matmul_run(ctx);
```

<!-- source: EN PDF p50; unit 371 -->

#### rknn_matmul_destroy

<!-- source: EN PDF p50; unit 372 -->

Функция уничтожает контекст матричного умножения и освобождает связанные ресурсы. После использования указателя, созданного через rknn_matmul_create, необходимо вызвать эту функцию для его уничтожения.

<!-- source: EN PDF p50; unit 373 -->

| API | rknn_matmul_destroy |
| --- | --- |
| Описание | Уничтожает контекст матричного умножения. |
| Параметры | rknn_matmul_ctx ctx: контекст матричного умножения. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p50; unit 374 -->

Пример кода:

<!-- source: EN PDF p50; unit 375 -->

```c
int ret = rknn_matmul_destroy(ctx);
```

<!-- source: EN PDF p51; unit 376 -->

### 4.6 Структуры данных пользовательских операторов

<!-- source: EN PDF p51; unit 377 -->

#### rknn_gpu_op_context

<!-- source: EN PDF p51; unit 378 -->

rknn_gpu_op_context содержит контекст пользовательского оператора, выполняемого указанной GPU. Определение структуры приведено в таблице:

<!-- source: EN PDF p51; unit 379 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| cl_context | void* | Объект OpenCL cl_context; при использовании выполните явное приведение к cl_context. |
| cl_command_queue | void* | Объект OpenCL cl_command_queue; при использовании выполните явное приведение к cl_command_queue. |
| cl_kernel | void* | Объект OpenCL cl_kernel; при использовании выполните явное приведение к cl_kernel. |

<!-- source: EN PDF p51; unit 380 -->

#### rknn_custom_op_context

<!-- source: EN PDF p51; unit 381 -->

rknn_custom_op_context содержит контекст пользовательского оператора. Определение структуры приведено в таблице:

<!-- source: EN PDF p51; unit 382 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| target | rknn_target_type | Устройство исполнения пользовательских операторов: RKNN_TARGET_TYPE_CPU: CPU; RKNN_TARGET_TYPE_CPU: GPU. Повтор CPU для GPU присутствует в источнике и требует проверки. |
| internal_ctx | rknn_custom_op_interal_context | Внутренний контекст оператора. |
| gpu_ctx | rknn_gpu_op_context | Контекст OpenCL пользовательского оператора. При выполнении на GPU обратный вызов получает из этой структуры объекты OpenCL, например cl_context. |
| priv_data | void* | Указатели данных, управление которыми оставлено разработчику. |

<!-- source: EN PDF p52; unit 383 -->

#### rknn_custom_op_tensor

<!-- source: EN PDF p52; unit 384 -->

rknn_custom_op_tensor описывает входной/выходной тензор пользовательского оператора. Определение структуры приведено в таблице:

<!-- source: EN PDF p52; unit 385 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| attr | rknn_tensor_attr | Имя, форма, размер и другие сведения о тензоре. |
| mem | rknn_tensor_mem | Адрес памяти тензора, fd, смещение действительных данных и другие сведения. |

<!-- source: EN PDF p52; unit 386 -->

#### rknn_custom_op_attr

<!-- source: EN PDF p52; unit 387 -->

rknn_custom_op_attr описывает параметры или атрибуты пользовательского оператора. Определение структуры приведено в таблице:

<!-- source: EN PDF p52; unit 388 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| name | char[] | Имя параметра пользовательского оператора. |
| dtype | rknn_tensor_type | Тип данных каждого элемента. |
| n_elems | uint32_t | Число элементов. |
| data | void* | Виртуальный адрес области памяти данных параметра. |

<!-- source: EN PDF p53; unit 389 -->

#### rknn_custom_op

<!-- source: EN PDF p53; unit 390 -->

rknn_custom_op содержит регистрационные сведения пользовательского оператора. Определение структуры приведено в таблице:

<!-- source: EN PDF p53,54; unit 391,392 -->

| Поле | Тип | Значение |
| --- | --- | --- |
| version | uint32_t | Номер версии пользовательского оператора. |
| target | rknn_target_type | Тип вычислительного бэкенда оператора. |
| op_type | char[] | Тип пользовательского оператора. |
| cl_kernel_name | char[] | Имя функции ядра OpenCL. |
| cl_kernel_source | char* | Ресурс OpenCL: при cl_source_size=0 — абсолютный путь к файлу; при cl_source_size&gt;0 — строка кода функции ядра. |
| cl_source_size | uint64_t | Если cl_kernel_source — строка, её длина; если путь к файлу — 0. |
| cl_build_options | char[] | Параметры компиляции ядра OpenCL. |
| init | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Указатель обратного вызова инициализации оператора. Вызывается один раз при регистрации. Если не нужен, допускается NULL. |
| prepare | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Указатель обратного вызова предварительной обработки. Вызывается один раз при rknn_run. Если не нужен, допускается NULL. |
| compute | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Указатель обратного вызова вычисления пользовательского оператора. Вызывается один раз при rknn_run. NULL недопустим. |
| compute_native | int (*)(rknn_custom_op_context* op_ctx,<br>rknn_custom_op_tensor* inputs, uint32_t<br>n_inputs, rknn_custom_op_tensor*<br>outputs, uint32_t n_outputs); | Указатель высокопроизводительного вычислительного обратного вызова. Отличается от compute форматом входных и выходных тензоров. Пока не поддерживается; задаётся NULL. |
| destroy | int (*)(rknn_custom_op_context*<br>op_ctx); | Указатель обратного вызова освобождения ресурсов. Вызывается один раз при rknn_destroy. |

<!-- source: EN PDF p55; unit 393 -->

### 4.7 API пользовательских операторов

<!-- source: EN PDF p55; unit 394 -->

#### rknn_register_custom_ops

<!-- source: EN PDF p55; unit 395 -->

После успешной инициализации контекста функция регистрирует несколько пользовательских операторов: их типы, типы вычислительного бэкенда, сведения о ядрах OpenCL и указатели обратных вызовов. После регистрации во время инференса rknn_run вызывает функции, реализованные разработчиком.

<!-- source: EN PDF p55; unit 396 -->

| API | rknn_register_custom_ops |
| --- | --- |
| Описание | Регистрирует несколько пользовательских операторов в контексте. |
| Параметры | rknn_context *context: указатель rknn_context. До вызова контекст должен быть успешно инициализирован. |
|  | rknn_custom_op* op: массив сведений об операторах; каждый элемент — объект структуры rknn_custom_op. |
|  | uint32_t custom_op_num: длина массива сведений об операторах. |
| Возвращаемое значение | int: код ошибки (см. коды ошибок RKNN). |

<!-- source: EN PDF p55; unit 397 -->

Пример кода:

<!-- source: EN PDF p55; unit 398 -->

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

<!-- source: EN PDF p56; unit 399 -->

#### rknn_custom_op_get_op_attr

<!-- source: EN PDF p56; unit 400 -->

Функция получает параметры пользовательского оператора внутри его обратного вызова, например axis оператора Softmax. Передаются имя поля параметра и указатель на rknn_custom_op_attr. После вызова значение помещается в поле data структуры. Разработчик приводит указатель согласно dtype в возвращённой структуре к адресу начала массива нужного типа C и считывает полное значение параметра по числу элементов.

<!-- source: EN PDF p56; unit 401 -->

| API | rknn_custom_op_get_op_attr |
| --- | --- |
| Описание | Получает параметры или атрибуты пользовательского оператора. |
| Параметры | rknn_custom_op_context* op_ctx: указатель контекста оператора. |
|  | const char* attr_name: имя поля параметра оператора. |
|  | rknn_custom_op_attr* op_attr: структура, представляющая значение параметра оператора. |
| Возвращаемое значение | Нет значения. |

<!-- source: EN PDF p56; unit 402 -->

Пример кода:

<!-- source: EN PDF p56; unit 403 -->

```c
rknn_custom_op_attr op_attr;
rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
  axis = ((int64_t*)op_attr.data)[0];
}
…
```

<!-- source: EN PDF p57; unit 404 -->

## 5. Коды ошибок RKNN

<!-- source: EN PDF p57; unit 405 -->

Коды возврата функций RKNN API определены в следующей таблице.

<!-- source: EN PDF p57; unit 406 -->

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
| RKNN_ERR_INCOMPATILE_OPTIMIZATION_LEVEL_VERSION<br>(-12) | Модель RKNN использует режим уровня оптимизации, несовместимый с текущим драйвером. |
| RKNN_ERR_TARGET_PLATFORM_UNMATCH (-13) | Модель RKNN несовместима с текущей платформой. |

{% endraw %}
