---
title: "RKNN Toolkit Lite2 V2.5.0, часть 2: жизненный цикл, входы и повторное использование выходов"
description: "RKNN Toolkit Lite2 V2.5.0, часть 2: жизненный цикл, входы и повторное использование выходов · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, часть 2: жизненный цикл, входы и повторное использование выходов"
translation_key: "rknn-v250-lite-api-programming-model"
slug: "rknn-v250-lite-api-programming-model"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Справочный материал для RKNN Toolkit Lite2 V2.5.0, Debian 10/11/12 aarch64 и SoC из оригинала. На ArmSoM проверьте SoC, архитектуру, Python wheel, драйвер NPU в BSP и Runtime. Аппаратные испытания не проводились. Раздел шифрования перечисляет больше платформ, чем таблица установки Lite2; оба исходных списка сохранены без вывода о расширении поддержки Lite2.

Подготовлено по локальным китайскому и английскому оригиналам V2.5.0 с сохранением нумерации. Китайский использует китайские рисунки, остальные языки — рисунки английского источника. Восстановлены переносы PDF, продолжения таблиц и отступы кода. Примеры вывода не являются испытаниями ArmSoM.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN Toolkit Lite2 V2.5.0, часть 1: установка, ResNet18 и возвращаемые значения](/ru/articles/rknn-v250-lite-api-installation/)

**RKNN Toolkit Lite2 V2.5.0, часть 2: жизненный цикл, входы и повторное использование выходов**

[RKNN Toolkit Lite2 V2.5.0, часть 3: загрузка, шифрование и инициализация Runtime](/ru/articles/rknn-v250-lite-api-loading-runtime/)

[RKNN Toolkit Lite2 V2.5.0, часть 4: API инференса, устройств и версий](/ru/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0, часть 5: ошибки, Core Mask и журналы](/ru/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 2. Модель программирования RKNNLite

RKNNLite — основная точка входа Python в RKNN Toolkit Lite2. Через этот объект приложение загружает модели, инициализирует Runtime, выполняет инференс, запрашивает версии и освобождает ресурсы.

RKNN Toolkit Lite2 предназначен для развёртывания на устройстве. Сначала модель фреймворка преобразуется в RKNN с помощью RKNN Toolkit2; затем приложение устройства выполняет RKNNLite() → load_rknn() → init_runtime() → inference() → release().

Понимание связи модели RKNN, Runtime, входных данных и конфигурации NPU Core помогает использовать API главы 3.

### 2.1 Жизненный цикл объекта

Типичный жизненный цикл RKNN Toolkit Lite2:

```text
Create RKNNLite object
    ↓
load_rknn()
    ↓
init_runtime()
    ↓
Prepare and preprocess input data
    ↓
inference()
    ↓
Post-process inference results
    ↓
release()
```

Здесь:

RKNNLite() создаёт объект RKNNLite; verbose и verbose_file позволяют включить подробные журналы;

load_rknn() загружает модель RKNN по указанному пути;

init_runtime() инициализирует среду Runtime для выполнения модели;

inference() выполняет инференс подготовленных входов и возвращает выходы;

release() освобождает ресурсы объекта RKNNLite.

init_runtime() проверяет загрузку модели через load_rknn(), а inference() — инициализацию Runtime. Нормальный порядок вызовов: load_rknn() → init_runtime() → inference().

Типичная структура приложения:

```text
rknn_lite = RKNNLite(verbose=True)

ret = rknn_lite.load_rknn('./model.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)

outputs = rknn_lite.inference(inputs=[input_data])

# Post-process outputs according to the model type.
# ...

rknn_lite.release()
```

До inference() выполните предобработку входов и задайте data_format по входным размерностям и фактической раскладке данных. После инференса выходы обычно требуют постобработки для логики приложения.

### 2.2 Связь модели, Runtime и инференса

Развёртывание делится на этапы:

Преобразование: RKNN Toolkit2 преобразует модель фреймворка глубокого обучения в RKNN;

Загрузка: load_rknn() загружает модель в объект RKNNLite;

Инициализация: init_runtime() инициализирует Runtime;

Инференс: inference() получает результаты модели.

RKNN Toolkit2 и RKNN Toolkit Lite2 обслуживают разные этапы:

| Этап | Инструмент / API | Назначение |
| --- | --- | --- |
| Преобразование модели | RKNN Toolkit2 | Преобразование модели фреймворка глубокого обучения в RKNN |
| Загрузка модели | load_rknn() | Загрузка RKNN для исполнения на устройстве |
| Инициализация Runtime | init_runtime() | Инициализация среды выполнения |
| Выполнение модели | inference() | Инференс и возврат выходов |
| Освобождение ресурсов | release() | Освобождение ресурсов RKNNLite после использования |

Кроме инференса RKNN Toolkit Lite2 предоставляет запросы версии и платформ:

```text
load_rknn()
    ↓
init_runtime()
    ↓
get_sdk_version()
```

get_sdk_version() вызывается только после успешной инициализации Runtime; иначе возвращает None. Поскольку init_runtime() требует загруженную модель, обычный порядок остаётся load_rknn(), init_runtime(), затем get_sdk_version().

list_support_target_platform() запрашивает платформы чипов, на которых может работать указанная модель RKNN. Путь передаётся через rknn_model. Без пути API печатает текущие поддерживаемые платформы RKNN Toolkit Lite2 по категориям.

### 2.3 Входные данные, раскладка и выходы

Текущая сигнатура inference():

```text
inference(
    inputs,
    data_type=None,
    data_format=None,
    inputs_pass_through=None,
    get_frame_id=False,
    reuse_outputs=False
)
```

inputs — список входов модели. Остальные параметры задают тип, раскладку, Pass Through, поведение Frame ID в асинхронном режиме и повторное использование памяти выходов.

#### 2.3.1 inputs

inputs передаёт входные данные модели. Тип — list, каждый элемент — ndarray. Пример:

```text
outputs = rknn_lite.inference(inputs=[img])
```

Для модели с несколькими входами:

```text
outputs = rknn_lite.inference(
    inputs=[input0, input1]
)
```

До вызова инференса приложение должно завершить необходимую предобработку.

#### 2.3.2 data_type и data_format

data_type задаёт тип входных данных: int8, uint8, int16, float16 и float32 согласно текущему интерфейсу. По умолчанию None.

data_format задаёт раскладку входов: поддерживаются "nhwc" и "nchw", по умолчанию None. Параметр передаётся непосредственно логике задания входов Runtime; приложение должно согласовать его с фактической раскладкой буфера.

#### 2.3.3 inputs_pass_through

inputs_pass_through задаёт Pass Through для каждого входа списком значений 0 / 1 (выключено / включено), соответствующих входам модели. По умолчанию None.

#### 2.3.4 get_frame_id

get_frame_id по умолчанию False: API возвращает список выходных ndarray. При True в конец списка добавляется Frame ID Runtime. Это главным образом нужно в асинхронном режиме для сопоставления входных и выходных кадров.

#### 2.3.5 reuse_outputs

reuse_outputs управляет повторным использованием памяти выходных массивов. По умолчанию False; это необязательная оптимизация, не меняющая стандартное поведение.

При False (по умолчанию) каждый выходной ndarray владеет своей памятью и остаётся действительным между вызовами, как и в прежнем контракте API. Приложение может безопасно хранить результаты.

При True возвращаются представления внутренних повторно используемых промежуточных буферов без большого выделения памяти при каждом вызове. Режим подходит для долгих циклов, где выходы полностью обработаны до следующего инференса. Внимание: следующий inference() или get_outputs() перезапишет массивы. Для сохранения результатов заранее скопируйте их, например np.array(output).

#### 2.3.6 Выходы инференса и возврат при ошибке

Обычно inference() возвращает список выходных ndarray:

```text
Input ndarray list
        ↓
    inference()
        ↓
Output ndarray list
        ↓
Application post-processing
```

Если Runtime не инициализирован либо при задании входов, выполнении модели или получении выходов возникло исключение, возвращается None. До постобработки проверяйте результат.

### 2.4 Настройка NPU Core

init_runtime() настраивает режим ядер NPU параметром core_mask. По умолчанию RKNNLite.NPU_CORE_AUTO.

В RKNNLite определены следующие константы Core Mask:

| core_mask | Значение | Описание |
| --- | --- | --- |
| RKNNLite.NPU_CORE_AUTO | 0 | Автоматический режим, по умолчанию |
| RKNNLite.NPU_CORE_0 | 1 | Ядро 0 |
| RKNNLite.NPU_CORE_1 | 2 | Ядро 1 |
| RKNNLite.NPU_CORE_2 | 4 | Ядро 2 |
| RKNNLite.NPU_CORE_0_1 | 3 | Совместно ядра 0/1 |
| RKNNLite.NPU_CORE_0_1_2 | 7 | Совместно ядра 0/1/2; текущее описание интерфейса отмечает поддержку только RK3588 |
| RKNNLite.NPU_CORE_ALL | 0xffff | Все ядра NPU |

В исходном коде отмечено: core_mask действует только для RK3576 / RK3588. Реальные сочетания ядер зависят от чипа и проверки Runtime. Если ручной выбор не нужен, используйте RKNNLite.NPU_CORE_AUTO.

Типичная инициализация:

```text
ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

### 2.5 Запросы и освобождение ресурсов

Кроме инференса RKNN Toolkit Lite2 перечисляет устройства, запрашивает версию SDK, платформы модели и освобождает ресурсы. Предусловия этих API различаются.

Запрос версии SDK

get_sdk_version() получает:

версию Runtime;

версию драйвера;

информацию о версии модели RKNN.

Порядок вызовов:

```text
load_rknn()
    ↓
init_runtime()
    ↓
get_sdk_version()
```

Пример:

```text
sdk_version = rknn_lite.get_sdk_version()
```

Runtime должен быть успешно инициализирован до этого вызова; иначе возвращается None.

Запрос поддерживаемых платформ модели

list_support_target_platform() запрашивает чипы, на которых работает данная модель RKNN:

```text
rknn_lite.list_support_target_platform(
    rknn_model='mobilenet_v1.rknn'
)
```

При rknn_model=None аргумент передаётся прямо функции запроса, которая перечисляет текущие платформы RKNN Toolkit Lite2. Если явно заданный путь модели не существует, включая пустую строку, возвращается None.

Освобождение ресурсов

Завершив работу с объектом RKNNLite, вызовите:

```text
rknn_lite.release()
```

В полном процессе ресурсы освобождаются после инференса и связанных запросов:

```text
RKNNLite()
    ↓
load_rknn()
    ↓
init_runtime()
    ↓
inference() / get_sdk_version()
    ↓
release()
```

release() — последний шаг жизненного цикла RKNNLite. Освобождайте ресурсы сразу после завершения выполнения модели на объекте.

{% endraw %}
