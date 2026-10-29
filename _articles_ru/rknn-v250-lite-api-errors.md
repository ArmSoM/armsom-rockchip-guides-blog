---
title: "RKNN Toolkit Lite2 V2.5.0, часть 5: ошибки, Core Mask и журналы"
description: "RKNN Toolkit Lite2 V2.5.0, часть 5: ошибки, Core Mask и журналы · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, часть 5: ошибки, Core Mask и журналы"
translation_key: "rknn-v250-lite-api-errors"
slug: "rknn-v250-lite-api-errors"
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

[RKNN Toolkit Lite2 V2.5.0, часть 4: API инференса, устройств и версий](/ru/articles/rknn-v250-lite-api-inference-queries/)

**RKNN Toolkit Lite2 V2.5.0, часть 5: ошибки, Core Mask и журналы**

{% raw %}

## 4. Обработка ошибок

Python API RKNN Toolkit Lite2 сообщают состояние через коды, None и журналы Runtime. Проверяйте коды явно, а результаты инференса и запросов — на None до использования.

### 4.1 Ошибки загрузки модели и инициализации Runtime

load_rknn() и init_runtime() возвращают:

Успех: 0

Ошибка: -1

Сразу проверяйте каждый шаг инициализации:

```text
ret = rknn_lite.load_rknn('./resnet_18.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

Переходите к inference() или get_sdk_version() только после успешной загрузки и инициализации.

### 4.2 Проверка входов и возвращаемых значений инференса

Перед inference() проверьте:

init_runtime() успешно завершён;

inputs — список ndarray, требуемых моделью;

используемые data_type, data_format и inputs_pass_through соответствуют входам;

для сопоставления кадров в асинхронном режиме задано get_frame_id=True;

при reuse_outputs=True массивы представляют внутренние повторно используемые буферы и не должны храниться между вызовами; нужные результаты сначала копируются.

inference() возвращает None при неинициализированной Runtime, ошибке входов, выполнения модели или получения выходов. Используйте единую проверку пустого результата:

```text
outputs = rknn_lite.inference(inputs=[input_data])
if outputs is None:
    print('Inference failed')
    exit(-1)
```

### 4.3 Проверка NPU Core

Исходный код ограничивает core_mask платформами RK3576 / RK3588. Описание также отмечает RKNNLite.NPU_CORE_0_1_2 как поддерживаемый только RK3588.

Без ручного выбора ядер используйте RKNNLite.NPU_CORE_AUTO. Конкретные сочетания проверяются Runtime. При ошибке Core Mask init_runtime() возвращает -1.

### 4.4 Журналирование

Для подробных журналов задайте verbose и verbose_file при создании RKNNLite:

```text
rknn_lite = RKNNLite(
    verbose=True,
    verbose_file='./inference.log'
)
```

При verbose=True подробные журналы выводятся на экран. Если также задан verbose_file, они записываются и в указанный файл.

При ошибке загрузки, инициализации или инференса сопоставляйте возвращаемое значение API с подробными журналами для поиска причины.

## 5. Приложение

### 5.1 Справочные документы

RKNN2 SDK Development Guide: стек RKNN2, преобразование и квантование, развёртывание и диагностика.

RKNN2 Toolkit Python API Reference: методы Python API RKNN-Toolkit2, параметры и возвращаемые значения.

Документация RKNN Toolkit2:

https://github.com/airockchip/rknn-toolkit2/tree/master/doc

Проект RKNN Toolkit2:

https://github.com/airockchip/rknn-toolkit2

{% endraw %}
