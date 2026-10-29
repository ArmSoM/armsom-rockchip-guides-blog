---
title: "RKNN Toolkit Lite2 V2.5.0, часть 3: загрузка, шифрование и инициализация Runtime"
description: "RKNN Toolkit Lite2 V2.5.0, часть 3: загрузка, шифрование и инициализация Runtime · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, часть 3: загрузка, шифрование и инициализация Runtime"
translation_key: "rknn-v250-lite-api-loading-runtime"
slug: "rknn-v250-lite-api-loading-runtime"
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

**RKNN Toolkit Lite2 V2.5.0, часть 3: загрузка, шифрование и инициализация Runtime**

[RKNN Toolkit Lite2 V2.5.0, часть 4: API инференса, устройств и версий](/ru/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0, часть 5: ошибки, Core Mask и журналы](/ru/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 3. Класс RKNNLite

RKNNLite — основной Python-класс RKNN Toolkit Lite2: инициализация объекта, загрузка RKNN, перечисление устройств, инициализация Runtime, инференс, запросы версии SDK и платформ модели, освобождение ресурсов.

### 3.1 Инициализация и освобождение объекта

init

| API | RKNNLite(...) |
| --- | --- |
| Функция | Инициализация RKNNLite. verbose и verbose_file управляют подробным журналом. |
| Параметры | verbose: печатать ли подробные журналы на экран. |
|  | verbose_file: путь файла журнала. При заданном пути и verbose=True журналы также записываются в файл. |
| Возврат | Объект RKNNLite. |

Пример:

```text
# Show detailed logs on screen and save them to inference.log.
rknn_lite = RKNNLite(
    verbose=True,
    verbose_file='./inference.log'
)

# Only show detailed logs on screen.
rknn_lite = RKNNLite(verbose=True)
```

release

| API | release |
| --- | --- |
| Функция | Освобождение ресурсов RKNNLite после использования. |
| Параметры | Нет |
| Возврат | None. |

Пример:

```text
rknn_lite.release()
```

Замечания по использованию:

Вызовите release(), когда объект RKNNLite больше не нужен.

До освобождения завершите инференс и связанные запросы.

### 3.2 Загрузка модели и инициализация Runtime

load_rknn

| API | load_rknn |
| --- | --- |
| Функция | Загрузить модель RKNN. |
| Параметры | path: путь файла модели RKNN. |
|  | key_path: необязательный путь ключевого конверта зашифрованной модели. Обязателен для RKCE, может отсутствовать для незашифрованной модели. |
| Возврат | Успех: 0; ошибка: -1. |

Пример для незашифрованной модели:

```text
# Load resnet_18.rknn from the current directory.
ret = rknn_lite.load_rknn('./resnet_18.rknn')
```

Пример для зашифрованной модели:

```text
# Load an encrypted model together with its key envelope.
ret = rknn_lite.load_rknn(
    './encrypted_model.rknn',
    key_path='./encrypted_model_key.bin'
)
```

Замечания по использованию:

Вызывайте load_rknn() до init_runtime().

Файл должен быть моделью RKNN, созданной RKNN Toolkit2.

Описание шифрования моделей:

RKNN Toolkit Lite2 загружает зашифрованные RKNN-модели. Используется гибрид AES-256-CTR + RSA-OAEP: в заголовок записывается RKCE, тело шифруется AES-CTR, а ключ AES помещается с RSA-OAEP в конверт RKKE, развёртываемый вместе с моделью.

При загрузке передайте файл ключевого конверта через key_path. rknn_init() автоматически обнаруживает RKCE и прозрачно расшифровывает модель. Дальнейший инференс совпадает с незашифрованной моделью.

Шифрование выполняется на ПК/сервере инструментом RKNN Toolkit2 с открытым ключом RK rk_public_key.pem. Создаются два связанных файла:

| Файл | Описание |
| --- | --- |
| xxx.rknn | Зашифрованная модель RKNN: идентификатор RKCE и тело AES-CTR |
| xxx_key.bin | Ключевой конверт RSA-OAEP, развёртываемый вместе с зашифрованной моделью |

Зашифрованные модели поддерживаются RK3562, семействами RK3566, RK3568, RK3576, RK3588, RV1126B, семействами RV1103B и RV1106B.

Примечания:

Модель и ключевой конверт должны использоваться согласованной парой; ни один файл нельзя опустить.

Конверт содержит ключевой материал для расшифровки модели и должен быть защищён от раскрытия.

Подробнее о схеме и инструменте см. «Model Encryption» в RKNN2 SDK Development Guide.

init_runtime

| API | init_runtime |
| --- | --- |
| Функция | Инициализировать среду Runtime. Обязателен до инференса. |
| Параметры | target: целевая платформа, по умолчанию None. Для локальной NPU устройства aarch64 обычно оставляют None. |
|  | device_id: идентификатор устройства, по умолчанию None. Применять только при явной поддержке выбора устройства текущей средой. |
|  | async_mode: включить асинхронный режим; по умолчанию False. |
|  | core_mask: режим ядер NPU; по умолчанию RKNNLite.NPU_CORE_AUTO. |
| Возврат | 0 при успехе; -1 при невыполненных предусловиях или ошибке инициализации Runtime. |

core_mask принимает следующие константы класса RKNNLite:

| core_mask | Значение | Описание |
| --- | --- | --- |
| RKNNLite.NPU_CORE_AUTO | 0 | Автоматический режим, по умолчанию |
| RKNNLite.NPU_CORE_0 | 1 | Ядро 0 |
| RKNNLite.NPU_CORE_1 | 2 | Ядро 1 |
| RKNNLite.NPU_CORE_2 | 4 | Ядро 2 |
| RKNNLite.NPU_CORE_0_1 | 3 | Совместно ядра 0/1 |
| RKNNLite.NPU_CORE_0_1_2 | 7 | Совместно ядра 0/1/2; текущее описание интерфейса отмечает поддержку только RK3588 |
| RKNNLite.NPU_CORE_ALL | 0xffff | Все ядра NPU |

В исходном коде core_mask отмечен как действующий только для RK3576 / RK3588.

Пример:

```text
ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

Замечания по использованию:

Сначала вызовите load_rknn(). Без загруженной модели API сразу возвращает -1.

Если Runtime уже существует, перед повторной инициализацией он освобождается.

При исключении во время создания Runtime, построения графа, настройки Core Mask или проверки версий API возвращает -1.

inference() вызывается только после успешного init_runtime(). get_sdk_version() также требует инициализированную Runtime.

{% endraw %}
