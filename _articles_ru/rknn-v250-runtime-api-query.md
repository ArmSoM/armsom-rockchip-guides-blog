---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Запросы модели, тензоров и динамических форм"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-runtime-api-query"
slug: "rknn-v250-runtime-api-query"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Запросы модели, тензоров и динамических форм | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN Runtime C API V2.5.0 — Запросы модели, тензоров и динамических форм | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-runtime-api-query/"
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

<!-- source EN p17 unit 151 -->

### 5.2. Запросы

<!-- source EN p17 unit 152 -->

Запрос атрибутов модели, версии SDK, памяти и других данных.

<!-- source EN p17 unit 153 -->

### rknn_query

<!-- source EN p17 unit 154 -->

rknn_query запрашивает сведения о модели и SDK: входы и выходы модели, время выполнения отдельных слоёв, общее время инференса, версию SDK, потребление памяти, пользовательские строки и другую информацию.

<!-- source EN p17 unit 155 -->

| API | rknn_query |
| --- | --- |
| Описание | Запрашивает сведения о модели и SDK. |
| Параметры | rknn_context context: объект rknn_contex (написание источника). |
| Параметры | rknn_query_cmd: команда запроса. |
| Параметры | void* info: объект структуры для результата запроса. |
| Параметры | uint32_t size: размер объекта структуры info. |
| Возвращаемое значение | int: Код ошибки (см. коды состояния). |

<!-- source EN p17 unit 156 -->

В описываемой версии SDK поддерживает следующие команды запроса:

<!-- source EN p17 unit 157 -->

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

<!-- source EN p18 unit 158 -->

<!-- source EN p18 unit 159 -->

| Команда запроса | Структура результата | Назначение |
| --- | --- | --- |
| RKNN_QUERY_NATIVE_INPUT_ATTR | rknn_tensor_attr | При zero-copy запрашивает нативный входной тензор, непосредственно читаемый NPU. |
| RKNN_QUERY_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | При zero-copy запрашивает нативный выходной тензор непосредственно от NPU. |
| RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | rknn_tensor_attr | При zero-copy запрашивает нативный входной тензор, непосредственно читаемый NPU. Совпадает с RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | rknn_tensor_attr | При zero-copy запрашивает нативный выходной тензор; оригинал называет его входным тензором, читаемым NPU. Совпадает с RKNN_QUERY_NATIVE_OUTPUT_ATTR. |
| RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | rknn_tensor_attr | При zero-copy запрашивает нативный входной тензор, читаемый NPU. В оригинале указано совпадение с RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | rknn_tensor_attr | При zero-copy запрашивает нативный выход NHWC; оригинал называет его входными атрибутами, читаемыми NPU. |
| RKNN_QUERY_DEVICE_MEM_INFO | rknn_tensor_mem | Запрос свойств памяти буфера модели. |
| RKNN_QUERY_INPUT_DYNAMIC_RANGE | rknn_input_range | Для динамических моделей запрашивает число форм, их список, компоновку и соответствующие имена входов. |
| RKNN_QUERY_CURRENT_INPUT_ATTR | rknn_tensor_attr | Запрос входных атрибутов текущего инференса динамической модели. |
| RKNN_QUERY_CURRENT_OUTPUT_ATTR | rknn_tensor_attr | Запрос выходных атрибутов текущего инференса динамической модели. |
| RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | rknn_tensor_attr | Запрос нативных входных атрибутов NPU для текущего инференса динамической модели. |
| RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | Запрос нативных выходных атрибутов NPU для текущего инференса динамической модели. |

<!-- source EN p18 unit 171 -->

Далее каждая команда рассмотрена подробно.

<!-- source EN p18 unit 172 -->

#### 1. Запрос версии SDK

<!-- source EN p18 unit 173 -->

RKNN_QUERY_SDK_VERSION запрашивает версию RKNN SDK. Сначала необходимо создать объект структуры rknn_sdk_version.

<!-- source EN p18 unit 174 -->

Пример кода:

<!-- source EN p18 unit 175 -->

```c
rknn_sdk_version version;
ret = rknn_query(ctx, RKNN_QUERY_SDK_VERSION, &version,
             sizeof(rknn_sdk_version));
printf("sdk api version: %s\n", version.api_version);
printf("driver version: %s\n", version.drv_version);
```

<!-- source EN p18 unit 176 -->

#### 2. Запрос числа входных и выходных тензоров

<!-- source EN p19 unit 177 -->

RKNN_QUERY_IN_OUT_NUM запрашивает число входных и выходных тензоров модели. Сначала создайте объект структуры rknn_input_output_num.

<!-- source EN p19 unit 178 -->

Пример кода:

<!-- source EN p19 unit 179 -->

```c
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num, sizeof(io_num));
printf("model input num: %d, output num: %d\n", io_num.n_input, io_num.n_output);
```

<!-- source EN p19 unit 180 -->

#### 3. Запрос атрибутов входного тензора (обычный API)

<!-- source EN p19 unit 181 -->

RKNN_QUERY_INPUT_ATTR запрашивает атрибуты входного тензора. Сначала создайте объект rknn_tensor_attr. Примечание: на RV1106/RV1103/RV1106B/RV1103B/RK2118 запрос возвращает исходный нативный входной тензор.

<!-- source EN p19 unit 182 -->

Пример кода:

<!-- source EN p19 unit 183 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p19 unit 184 -->

#### 4. Запрос атрибутов выходного тензора (обычный API)

<!-- source EN p19 unit 185 -->

RKNN_QUERY_OUTPUT_ATTR запрашивает атрибуты выходного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source EN p19 unit 186 -->

Пример кода:

<!-- source EN p19 unit 187 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR, &(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p19 unit 188 -->

#### 5. Запрос времени инференса каждого слоя модели

<!-- source EN p19 unit 189 -->

После rknn_run команда RKNN_QUERY_PERF_DETAIL запрашивает время инференса по слоям в микросекундах. Для этого параметр flag при rknn_init должен включать RKNN_FLAG_COLLECT_PERF_MASK.

<!-- source EN p19 unit 190 -->

Пример кода:

<!-- source EN p19 unit 191 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_COLLECT_PERF_MASK, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_detail perf_detail;
ret = rknn_query(ctx, RKNN_QUERY_PERF_DETAIL, &perf_detail, sizeof(perf_detail));
```

<!-- source EN p19 unit 192 -->

#### 6. Запрос общего времени инференса модели

<!-- source EN p19 unit 193 -->

После rknn_run команда RKNN_QUERY_PERF_RUN запрашивает время инференса модели в микросекундах, без времени настройки входов и выходов.

<!-- source EN p19 unit 194 -->

Пример кода:

<!-- source EN p20 unit 195 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_run perf_run;
ret = rknn_query(ctx, RKNN_QUERY_PERF_RUN, &perf_run, sizeof(perf_run));
```

<!-- source EN p20 unit 196 -->

#### 7. Запрос выделенной памяти модели

<!-- source EN p20 unit 197 -->

После rknn_init, если пользователь самостоятельно выделяет память сети, RKNN_QUERY_MEM_SIZE позволяет запросить память весов и внутреннюю память сети, исключая входы и выходы. Для этого параметр flag при rknn_init должен включать RKNN_FLAG_MEM_ALLOC_OUTSIDE.

<!-- source EN p20 unit 198 -->

Пример кода:

<!-- source EN p20 unit 199 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_MEM_ALLOC_OUTSIDE , NULL);
rknn_mem_size mem_size;
ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size, sizeof(mem_size));
```

<!-- source EN p20 unit 200 -->

#### 8. Запрос пользовательской строки модели

<!-- source EN p20 unit 201 -->

После rknn_init команда RKNN_QUERY_CUSTOM_STRING получает пользовательскую строку, добавленную при создании модели RKNN. Например, при преобразовании модели строка “RGB” может указывать, что вход — трёхканальное изображение RGB, а не BGR. Во время выполнения по полученной строке “RGB” данные преобразуются в изображение RGB.

<!-- source EN p20 unit 202 -->

Пример кода:

<!-- source EN p20 unit 203 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
rknn_custom_string custom_string;
ret = rknn_query(ctx, RKNN_QUERY_CUSTOM_STRING, &custom_string, sizeof(custom_string));
```

<!-- source EN p20 unit 204 -->

#### 9. Запрос нативных атрибутов входного тензора (API без копирования)

<!-- source EN p20 unit 205 -->

RKNN_QUERY_NATIVE_INPUT_ATTR, эквивалентная RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR, запрашивает нативные атрибуты входного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source EN p20 unit 206 -->

Пример кода:

<!-- source EN p20 unit 207 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source EN p20 unit 208 -->

#### 9. Запрос нативных атрибутов выхода (zero-copy API)

<!-- source EN p20 unit 209 -->

RKNN_QUERY_NATIVE_OUTPUT_ATTR, эквивалентная RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR, запрашивает нативные атрибуты выходного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source EN p20 unit 210 -->

Пример кода:

<!-- source EN p21 unit 211 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p21 unit 212 -->

#### 10. Запрос нативных атрибутов входа (zero-copy API)

<!-- source EN p21 unit 213 -->

RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR запрашивает атрибуты NHWC входного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source EN p21 unit 214 -->

Пример кода:

<!-- source EN p21 unit 215 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR,
&(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p21 unit 216 -->

#### 11. Запрос нативных атрибутов выходного тензора (заголовок оригинала; следующий текст относится к входу, API без копирования)

<!-- source EN p21 unit 217 -->

RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR запрашивает атрибуты NHWC выходного тензора модели. Сначала создайте объект структуры rknn_tensor_attr.

<!-- source EN p21 unit 218 -->

Пример кода:

<!-- source EN p21 unit 219 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p21 unit 220 -->

#### 12. Запрос памяти буфера модели (примечание: RV1106/RV1103/RV1106B/RV1103B/RK2118 поддерживают этот интерфейс)

<!-- source EN p21 unit 222 -->

После rknn_init команда RKNN_QUERY_DEVICE_MEM_INFO запрашивает атрибуты буфера модели, созданного внутри Runtime, включая fd и физический адрес.

<!-- source EN p21 unit 223 -->

```c
rknn_tensor_mem mem_info;
memset(&mem_info, 0, sizeof(mem_info));
ret = rknn_query(ctx, RKNN_QUERY_DEVICE_MEM_INFO, &mem_info, sizeof(mem_info));
```

<!-- source EN p21 unit 224 -->

#### 13. Запрос поддерживаемых моделью RKNN динамических форм входа

<!-- source EN p21 unit 225 -->

Примечание: RV1106/RV1103/RV1106B/RV1103B/RK2118 не поддерживают этот интерфейс.

<!-- source EN p21 unit 226 -->

После rknn_init передайте RKNN_QUERY_INPUT_DYNAMIC_RANGE для получения сведений о поддерживаемых формах входа: их числа, списка, размещения данных, имён и других данных. Сначала создайте объект структуры rknn_input_range.

<!-- source EN p21 unit 227 -->

Пример кода:

<!-- source EN p22 unit 228 -->

```c
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input * sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   dyn_range[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE, &dyn_range[i],
sizeof(rknn_input_range));
}
```

<!-- source EN p22 unit 229 -->

#### 14. Запрос текущей динамической формы входа модели RKNN

<!-- source EN p22 unit 230 -->

После rknn_set_input_shapes передайте RKNN_QUERY_CURRENT_INPUT_ATTR для запроса текущих атрибутов входа. Сначала создайте rknn_tensor_attr. RV1106/RV1103/RV1103B/RV1106B/RK2118 не поддерживают эту команду.

<!-- source EN p22 unit 231 -->

Пример кода:

<!-- source EN p22 unit 232 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   cur_input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR, &(cur_input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source EN p22 unit 233 -->

#### 15. Запрос текущей динамической формы выхода модели RKNN

<!-- source EN p22 unit 234 -->

После rknn_set_input_shapes передайте RKNN_QUERY_CURRENT_OUTPUT_ATTR для запроса текущих атрибутов выхода. Сначала создайте rknn_tensor_attr. RV1106/RV1103/RV1103B/RV1106B/RK2118 не поддерживают эту команду.

<!-- source EN p22 unit 235 -->

Пример кода:

<!-- source EN p22 unit 236 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
   cur_output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source EN p22 unit 237 -->

#### 16. Запрос текущей динамической формы нативного входа модели RKNN

<!-- source EN p22 unit 238 -->

После rknn_set_input_shapes передайте RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR для запроса текущих атрибутов нативного входа. Сначала создайте rknn_tensor_attr. RV1106/RV1103/RV1103B/RV1106B/RK2118 не поддерживают эту команду.

<!-- source EN p22 unit 239 -->

Пример кода:

<!-- source EN p22 unit 240 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   cur_input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p22 unit 241 -->

#### 17. Запрос текущей динамической формы нативного выхода модели RKNN

<!-- source EN p22 unit 242 -->

После rknn_set_input_shapes передайте RKNN_QUERY_CURRENT_OUTPUT_ATTR для запроса текущих атрибутов нативного выхода. Сначала создайте rknn_tensor_attr. RV1106/RV1103/RV1103B/RV1106B/RK2118 не поддерживают эту команду.

<!-- source EN p22 unit 243 -->

Пример кода:

<!-- source EN p23 unit 244 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
   cur_output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Оговорки оригинала: номера глав и примерные журналы сохранены; ранние версии SDK в журналах не являются версией этой статьи. Runtime переходит от главы 3 к 5 и повторяет номера запросов. Таблица rknn_init называет extend отключённым, но далее описывает user_key и общие веса. Текст о нативном динамическом выходе указывает RKNN_QUERY_CURRENT_OUTPUT_ATTR, пример — RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Некоторые описания native NHWC/NC1HWC2 смешивают вход и выход. Проверяйте фактические заголовки V2.5.0 и целевой SDK: поведение не подтверждено тестами. Ссылка RK2118 в оригинале называется RKNN3_RK2118_Quick_Start.pdf, а в текущем каталоге находится руководство RKNN2.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
