---
title: "RKNN2 V2.5.0, часть 1: развёртывание, платформы и репозитории SDK"
description: "RKNN2 V2.5.0, часть 1: развёртывание, платформы и репозитории SDK · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, часть 1: развёртывание, платформы и репозитории SDK"
translation_key: "rknn-v250-sdk-quickstart-deployment-flow"
slug: "rknn-v250-sdk-quickstart-deployment-flow"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Область применения: справочный материал RKNN2 V2.5.0 для RK3562, семейств RK3566/3568/3576/3588 и RV1126B. Плате ArmSoM с тем же SoC всё равно нужны соответствующие BSP, драйвер NPU и Runtime; нельзя напрямую переносить требования EVB Rockchip к питанию, USB и прошивке. Требования к ПК и драйверу приведены ниже. Проверка на оборудовании ArmSoM не проводилась.

Подготовлено по локальным китайскому и английскому оригиналам V2.5.0 с сохранением нумерации. Китайский использует китайские рисунки, остальные языки — рисунки английского источника. Восстановлены переносы PDF, продолжения таблиц и отступы кода. Примеры вывода не являются испытаниями ArmSoM.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 V2.5.0, часть 1: развёртывание, платформы и репозитории SDK**

[RKNN2 V2.5.0, часть 2: подключение и проверка ADB](/ru/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0, часть 3: Toolkit, Runtime Android/Linux и компиляторы](/ru/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0, часть 4: преобразование и развёртывание MobileNet](/ru/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0, часть 5: детекция YOLOv5 и оценка точности](/ru/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0, часть 6: Docker, диагностика и документация](/ru/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 1. Перед началом работы

Это руководство описывает кратчайший путь к первому запуску RKNN2 SDK: подключение оборудования, подготовку среды, преобразование модели, отладку с подключённой платой и развёртывание на плате. Принципы преобразования моделей, настройка квантования, полный справочник API и систематическая диагностика выходят за его рамки; см. соответствующие документы.

Примечание: полный процесс разработки, интерфейсы Toolkit, анализ точности, производительности и памяти описаны в RKNN2 SDK Development Guide. Поддерживаемые устройства, ОС и диапазоны версий определяются пакетом выпуска SDK. Здесь приведено только необходимое для первого запуска.

### 1.1 Цели руководства

После выполнения руководства вы сможете:

1. Убедиться в доступности компьютера, платы и среды выполнения RKNPU2;

2. Преобразовать модель ONNX с помощью RKNN-Toolkit2;

3. Запустить Python Demo через отладку с подключённой платой;

4. Скомпилировать C Demo и запустить на плате;

5. При необходимости перейти к полным документам по разработке, API или диагностике.

### 1.2 Программная архитектура и основные компоненты

Процесс разработки RKNN2 SDK состоит главным образом из двух частей: комплекта разработки на ПК и среды выполнения на плате:

Комплект на ПК: RKNN-Toolkit2 преобразует модели, обученные с помощью ONNX, PyTorch, TensorFlow и других средств глубокого обучения, в формат RKNN и проверяет их через отладку с подключённой платой. RKNN Model Zoo предоставляет примеры преобразования и развёртывания моделей.

Среда выполнения платы: после преобразования RKNPU2 Runtime на плате загружает и выполняет модели RKNN.

Основные компоненты:

| Компонент | Где работает | Назначение |
| --- | --- | --- |
| RKNN-Toolkit2 | ПК | Python-инструментарий преобразования, квантования, отладки с подключённой платой и других основных функций |
| RKNN Server (rknn_server) | Плата | Фоновая прокси-служба принимает команды и данные ПК, вызывает соответствующие интерфейсы Runtime на плате и возвращает результаты ПК |
| RKNPU2 Runtime (librknnrt.so) | Плата | Загружает модели RKNN и выполняет инференс на NPU |
| RKNN Model Zoo | ПК / плата | Скрипты преобразования и примеры Python/C++ для YOLOv5, YOLOv8, MobileNet и других распространённых моделей |

### 1.3 Выбор примера

Для первого запуска руководство использует следующие два примера:

| Пример | Назначение | Каталог Model Zoo |
| --- | --- | --- |
| MobileNet | Классификация изображений | examples/mobilenet |
| YOLOv5 | Детекция объектов | examples/yolov5 |

Для каждой модели имеются примеры Python и C/C++. Далее они называются RKNN Python Demo и RKNN C Demo. Использование разных Demo может отличаться; следуйте README.md в соответствующем каталоге.

### 1.4 Поддерживаемые платформы и требования к версиям

Поддерживаются следующие платформы:

| Категория | Описание |
| --- | --- |
| Аппаратные платформы | RK3562, семейства RK3566, RK3568, RK3576, RK3588, RV1126B |
| Компьютер разработки | Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04 |
| Версия Python | 3.8 (рекомендуется) |
| Версия драйвера RKNPU2 | Рекомендуется >= 0.9.8 |

Примечание: версии rknn_server, библиотеки Runtime (librknnrt.so) и RKNN-Toolkit2 должны быть согласованы. Рекомендуются последние версии. Для моделей RKNN с динамическими входными размерностями версии rknn_server и Runtime должны быть >= 1.5.0.

### 1.5 Получение SDK и сопутствующих репозиториев

Рекомендуется создать отдельный каталог репозиториев RKNN, например Projects, и разместить в нём RKNN-Toolkit2 и RKNN Model Zoo. Команды:

```text
# Create the 'Projects' folder
mkdir Projects

# Switch to this directory
cd Projects

# Download the RKNN-Toolkit2 repository
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# Download the RKNN Model Zoo repository
git clone https://github.com/airockchip/rknn_model_zoo.git --depth 1

# Notice:
# 1. Parameter --depth 1 means to clone only the latest commit
# 2. If the 'git clone' command fails, you can also download the compressed file directly from GitHub and unzip it locally in this directory.
```

Структура каталогов, используемая далее по умолчанию:

```text
Projects
├── rknn-toolkit2
│   ├── doc
│   ├── rknn-toolkit2
│   │   ├── packages
│   │   ├── docker
│   │   └── ...
│   ├── rknpu2
│   │   ├── runtime
│   │   └── ...
│   └── ...
└── rknn_model_zoo
    ├── datasets
    ├── examples
    └── ...
```

{% endraw %}
