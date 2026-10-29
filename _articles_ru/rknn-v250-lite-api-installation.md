---
title: "RKNN Toolkit Lite2 V2.5.0, часть 1: установка, ResNet18 и возвращаемые значения"
description: "RKNN Toolkit Lite2 V2.5.0, часть 1: установка, ResNet18 и возвращаемые значения · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, часть 1: установка, ResNet18 и возвращаемые значения"
translation_key: "rknn-v250-lite-api-installation"
slug: "rknn-v250-lite-api-installation"
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

**RKNN Toolkit Lite2 V2.5.0, часть 1: установка, ResNet18 и возвращаемые значения**

[RKNN Toolkit Lite2 V2.5.0, часть 2: жизненный цикл, входы и повторное использование выходов](/ru/articles/rknn-v250-lite-api-programming-model/)

[RKNN Toolkit Lite2 V2.5.0, часть 3: загрузка, шифрование и инициализация Runtime](/ru/articles/rknn-v250-lite-api-loading-runtime/)

[RKNN Toolkit Lite2 V2.5.0, часть 4: API инференса, устройств и версий](/ru/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0, часть 5: ошибки, Core Mask и журналы](/ru/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 1. Обзор справочника API

Руководство описывает Python API RKNN Toolkit Lite2: объект RKNNLite, требования к среде, загрузку модели, инициализацию Runtime, инференс, запрос версии SDK и поддерживаемых платформ.

RKNN Toolkit Lite2 развёртывает модели RKNN на платформах Rockchip NPU. Преобразование моделей выполняется RKNN Toolkit2 и не рассматривается здесь.

### 1.1 Версия и платформы

Документ соответствует RKNN Toolkit Lite2 V2.5.0.

Текущая область поддержки:

| Параметр | Поддержка |
| --- | --- |
| Версия RKNN Toolkit Lite2 | V2.5.0 |
| Аппаратные платформы | RK3562, семейства RK3566, RK3568, RK3576, RK3588 |
| Операционная система | Debian 10 / 11 / 12 (aarch64) |
| Python | 3.8 / 3.9 / 3.10 / 3.11 / 3.12 |
| Зависимости Python | numpy, ruamel.yaml, psutil |

### 1.2 Установка и настройка среды

RKNN Toolkit Lite2 устанавливается командой pip3 install.

Если python3 или pip3 отсутствуют, сначала установите базовые пакеты:

```text
sudo apt-get update
sudo apt-get install -y python3 python3-dev python3-pip gcc
```

Некоторые зависимости компилируются при установке, поэтому вместе устанавливаются python3-dev и gcc для предотвращения ошибок сборки.

Примеры также используют opencv-python и numpy:

```text
sudo apt-get install -y python3-opencv
sudo apt-get install -y python3-numpy
```

Примечания:

1. Сам RKNN Toolkit Lite2 не зависит от opencv-python, но примеры используют его для обработки изображений.

2. Прямая установка numpy через pip3 может завершиться ошибкой на прошивке Debian 10. Рекомендуется указанный выше способ установки системного пакета.

Пакеты для каждой платформы RKNN Toolkit Lite2 находятся в каталоге packages SDK. Войдите в него и установите Wheel для соответствующей версии Python:

```text
# Python 3.8
pip3 install rknn_toolkit_lite2-2.x.0-cp38-cp38-linux_aarch64.whl

# Python 3.9
pip3 install rknn_toolkit_lite2-2.x.0-cp39-cp39-linux_aarch64.whl

# Python 3.10
pip3 install rknn_toolkit_lite2-2.x.0-cp310-cp310-linux_aarch64.whl

# Python 3.11
pip3 install rknn_toolkit_lite2-2.x.0-cp311-cp311-linux_aarch64.whl

# Python 3.12
pip3 install rknn_toolkit_lite2-2.x.0-cp312-cp312-linux_aarch64.whl
```

### 1.3 Основной порядок использования

До использования RKNN Toolkit Lite2 преобразуйте экспортированные моделями глубокого обучения файлы в RKNN с помощью RKNN Toolkit2.

Основной порядок:

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

RKNNLite() создаёт Python-объект RKNN Toolkit Lite2;

load_rknn() загружает модель RKNN;

init_runtime() инициализирует среду Runtime;

inference() выполняет инференс модели;

release() освобождает ресурсы объекта RKNNLite после использования.

До inference() подготовьте и предобработайте входные данные, затем задайте data_format и другие параметры согласно фактическим входам. После инференса выходам обычно требуется постобработка для реализации функций приложения.

### 1.4 Пример программы

В каталоге examples SDK есть пример resnet18. Он загружает ResNet18, выполняет инференс и выводит Top-5 классов тестового изображения.

Порядок запуска:

1. Подготовьте плату с установленным RKNN Toolkit Lite2.

2. Скопируйте пример на плату.

3. Войдите в examples/resnet18 и выполните:

```text
python3 test.py
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

### 1.5 Соглашения о возвращаемых значениях API

В текущей реализации RKNNLite Python основные API используют следующие соглашения:

| API | Нормальный результат | Ошибка / особый результат |
| --- | --- | --- |
| load_rknn() | 0 | -1 |
| list_devices() | (adb_devices, ntb_devices), оба элемента — list | Отдельный результат ошибки не определён |
| init_runtime() | 0 | -1 при ошибке проверки параметров, загрузки модели, создания или инициализации Runtime |
| inference() | list выходных ndarray; при get_frame_id=True в конец добавляется Frame ID | None, если Runtime не инициализирован или возникла ошибка входов, выполнения либо получения выходов |
| get_sdk_version() | Строка версии SDK | None, если Runtime не инициализирован или запрос не удался |
| list_support_target_platform() | dict функции запроса платформ | None, если указанный путь модели RKNN не существует |
| release() | None | None |

Явно проверяйте возвращаемые коды состояния. Например:

```text
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_AUTO)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

Для inference(), get_sdk_version() и list_support_target_platform() также проверяйте None, чтобы не обрабатывать недействительные результаты при невыполненных условиях или внутренней ошибке.

{% endraw %}
