---
title: "RKNN Toolkit Lite2 V2.5.0, часть 4: API инференса, устройств и версий"
description: "RKNN Toolkit Lite2 V2.5.0, часть 4: API инференса, устройств и версий · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, часть 4: API инференса, устройств и версий"
translation_key: "rknn-v250-lite-api-inference-queries"
slug: "rknn-v250-lite-api-inference-queries"
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

[RKNN Toolkit Lite2 V2.5.0, часть 2: жизненный цикл, входы и повторное использование выходов](/ru/articles/rknn-v250-lite-api-programming-model/)

[RKNN Toolkit Lite2 V2.5.0, часть 3: загрузка, шифрование и инициализация Runtime](/ru/articles/rknn-v250-lite-api-loading-runtime/)

**RKNN Toolkit Lite2 V2.5.0, часть 4: API инференса, устройств и версий**

[RKNN Toolkit Lite2 V2.5.0, часть 5: ошибки, Core Mask и журналы](/ru/articles/rknn-v250-lite-api-errors/)

{% raw %}

### 3.3 Инференс модели

inference

| API | inference |
| --- | --- |
| Функция | Выполнить инференс заданных входов и вернуть выходы. |
| Параметры | inputs: входные данные типа list с элементами ndarray. |
|  | data_type: тип входов, по умолчанию None. Перечислены int8, uint8, int16, float16 и float32. |
|  | data_format: раскладка входов, по умолчанию None. Поддерживаются "nhwc" и "nchw". |
|  | inputs_pass_through: список флагов Pass Through; 0 / 1 означают выключено / включено. По умолчанию None. |
|  | get_frame_id: получать ли Frame ID. По умолчанию False; главным образом для асинхронного режима. |
|  | reuse_outputs: повторно использовать внутренние выходные буферы, по умолчанию False. При True возвращаются представления буферов для долгих циклов; следующий инференс перезаписывает результаты. |
| Возврат | Обычно список выходных ndarray; при get_frame_id=True в конец добавляется Frame ID. None при неинициализированной Runtime или исключении во время инференса. |

Пример:

```text
outputs = rknn_lite.inference(inputs=[img])
if outputs is None:
    print('Inference failed')
else:
    show_top5(outputs)
```

Для сокращения выделений памяти в длительном цикле включите повторное использование выходов:

```text
for frame in frames:
    outputs = rknn_lite.inference(
        inputs=[frame],
        reuse_outputs=True
    )
    show_top5(outputs) # consume immediately; results are overwritten
                              # by the next inference
```

Пример вывода:

```text
-----TOP 5-----
[812]: 0.999442994594574
[404]: 0.0004096269840374589
[657]: 3.284541890025139e-05
[833]: 2.6112385967280716e-05
[895]: 1.8509887013351545e-05
```

Замечания по использованию:

init_runtime() должен успешно завершиться до вызова; иначе API возвращает None.

inputs, data_type, data_format и inputs_pass_through передаются логике задания входов Runtime.

Исключение при задании входов, выполнении модели или получении выходов приводит к None.

При get_frame_id=False возвращается обычный список выходов. При True Frame ID Runtime добавляется в конец списка.

По умолчанию reuse_outputs=False: массивы владеют памятью и сохраняются между вызовами. Включайте True только для явного сокращения выделений памяти: тогда массивы являются представлениями внутренних буферов и перезаписываются следующим инференсом. Нужные далее результаты сначала копируйте.

После успешного инференса выполните постобработку согласно типу модели.

### 3.4 Запросы устройств, версий и платформ

list_devices

| API | list_devices |
| --- | --- |
| Функция | Перечислить доступные через ADB и NTB устройства и напечатать списки. |
| Параметры | Нет |
| Возврат | (adb_devices, ntb_devices): два объекта list. Устройства, присутствующие также в NTB, удаляются из возвращаемого списка ADB. |

Пример:

```text
adb_devices, ntb_devices = rknn_lite.list_devices()
```

get_sdk_version

| API | get_sdk_version |
| --- | --- |
| Функция | Получить версию SDK. |
| Параметры | Нет |
| Возврат | Обычно строка sdk_version; None при неинициализированной Runtime или ошибке запроса. |

До вызова Runtime должен быть успешно инициализирован. Поскольку init_runtime() требует модель, стандартный порядок: load_rknn() → init_runtime() → get_sdk_version().

Пример:

```text
sdk_version = rknn_lite.get_sdk_version()
if sdk_version is None:
    print('Get SDK version failed')
```

Пример возвращаемых сведений:

```text
I RKNN: [10:47:23.097] RKNN Runtime Information:
librknnrt version: 1.2.0b1
(a47985372@2021-12-06T10:20:14)

I RKNN: [10:47:23.097] RKNN Driver Information:
version: 0.6.2

I RKNN: [10:47:23.098] RKNN Model Information:
version: 1,
toolkit version: 1.1.2
(compiler version: 1.1.2b13
(1e5726f57@2021-11-29T14:13:55)),
target: RKNPU v2,
target platform: rk3588,
framework name: PyTorch,
framework layout: NCHW
```

list_support_target_platform

| API | list_support_target_platform |
| --- | --- |
| Функция | Запросить платформы для данной RKNN-модели либо перечислить текущие поддерживаемые платформы. |
| Параметры | rknn_model: путь модели, по умолчанию None. При None напрямую вызывается функция перечисления поддерживаемых платформ. |
| Возврат | Обычно support_target типа dict. None, если явно заданный путь модели не существует. |

Пример:

```text
support_target = rknn_lite.list_support_target_platform(
    rknn_model='mobilenet_v1.rknn'
)
if support_target is None:
    print('Query target platform failed')
```

Пример результата:

```text
**************************************************
Target platforms filled in RKNN model: ['RK3588']
Target platforms supported by this RKNN model: ['RK3588']
**************************************************
```

Замечания по использованию:

При rknn_model=None существование файла не проверяется; напрямую вызывается нижележащая функция запроса платформ.

Если явно заданный путь модели не существует, API записывает ошибку и возвращает None.

{% endraw %}
