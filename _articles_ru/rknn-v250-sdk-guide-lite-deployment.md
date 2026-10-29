---
title: "RKNN2 SDK V2.5.0 · Развёртывание Python через Toolkit Lite2"
description: "RKNN2 SDK V2.5.0 · Развёртывание Python через Toolkit Lite2 · Полная серия руководства разработчика"
excerpt: "Развёртывание Python через Toolkit Lite2"
translation_key: "rknn-v250-sdk-guide-lite-deployment"
slug: "rknn-v250-sdk-guide-lite-deployment"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Справочник платформы по руководству Rockchip RKNN2 SDK V2.5.0. Рассматриваются только перечисленные в исходном документе SoC, Linux/Android Runtime и Toolkit. Возможности действуют при указанных в каждом разделе условиях для чипа, SDK, драйвера и ядра и не означают поддержку всех плат ArmSoM. Перед развёртыванием проверьте BSP, драйвер NPU, Runtime и версию модели конкретной платы. Проверка на оборудовании ArmSoM не проводилась; журналы, показатели и примеры взяты из оригинала.

Источники и вычитка: китайская версия следует китайскому V2.5.0 (182 страницы), английская, русская и немецкая — английскому V2.5.0 (208 страниц). Различия оригиналов сохранены; сведения старой версии не выдаются за новые. Китайские рисунки взяты из китайского PDF, остальные — из английского, включая отдельно извлечённые векторные схемы. Номера разделов и формул сохранены. Некоторые ссылки используют старую нумерацию; примеры динамической формы содержат «1224+140=264», утверждения о TP_NORM противоречат друг другу, а init()/rknn.val_perf() отличаются от последующих описаний API. Эти сомнения сохранены: перед выполнением проверьте реальные заголовки и справочник V2.5.0. Код и параметры сохранены, разрывы PDF и продолжения таблиц восстановлены.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 10/22**

[1. Программный стек и основные понятия](/ru/articles/rknn-v250-sdk-guide-overview/)

[2. Среда разработки, версии и подключение платы](/ru/articles/rknn-v250-sdk-guide-environment/)

[3. Процесс разработки и выбор интерфейса](/ru/articles/rknn-v250-sdk-guide-workflow/)

[4. Преобразование моделей и редактирование ONNX](/ru/articles/rknn-v250-sdk-guide-conversion/)

[5. Квантование, гибридное квантование и QAT](/ru/articles/rknn-v250-sdk-guide-quantization/)

[6. Инференс, оценка точности, производительности и памяти](/ru/articles/rknn-v250-sdk-guide-evaluation/)

[7. Жизненный цикл Runtime, размещение данных и память](/ru/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Нулевое копирование и ограничения входов/выходов](/ru/articles/rknn-v250-sdk-guide-zero-copy/)

[9. Развёртывание через C API и генерация кода](/ru/articles/rknn-v250-sdk-guide-c-deployment/)

**Развёртывание Python через Toolkit Lite2**

[11. Matmul API и размещение матриц](/ru/articles/rknn-v250-sdk-guide-matmul/)

[12. Многоядерная настройка NPU и производительность](/ru/articles/rknn-v250-sdk-guide-multicore/)

[13. Модели с динамической формой и развёртывание](/ru/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Многопакетный инференс](/ru/articles/rknn-v250-sdk-guide-multi-batch/)

[15. SRAM NPU RK3588/RK3576](/ru/articles/rknn-v250-sdk-guide-sram/)

[16. Согласованность кэша и разреженный инференс](/ru/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Пользовательские операторы: Python и C API](/ru/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Развёртывание зашифрованных моделей](/ru/articles/rknn-v250-sdk-guide-encryption/)

[19. Диагностика точности](/ru/articles/rknn-v250-sdk-guide-accuracy/)

[20. Анализ производительности и оптимизация сети](/ru/articles/rknn-v250-sdk-guide-performance/)

[21. Анализ, совместное использование и повторное использование памяти](/ru/articles/rknn-v250-sdk-guide-memory/)

[22. Вопросы, обработка ошибок и справочные ресурсы](/ru/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

## 3.3 Развёртывание Python через Toolkit Lite

RKNN-Toolkit Lite2 предоставляет Python-интерфейс инференса на плате, упрощая разработку приложений ИИ на Python.

Примечание: прежде чем разрабатывать AI-приложение через RKNN-Toolkit Lite2, преобразуйте модель исходного фреймворка в RKNN с помощью RKNN-Toolkit2. Подробности приведены в 2.1.

### 3.3.1 Среда выполнения и установка

RKNN-Toolkit Lite2 работает на плате. Поддерживаемые платформы, ОС, версии Python и зависимости определяются пакетом соответствующей версии. Точный перечень приведён в разделе применимых версий и платформ руководства «04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0».

Установка выполняется из Python Wheel. SDK содержит пакеты для соответствующих платформ и версий Python в rknn-toolkit-lite2/packages. Выберите Wheel под Python платы и установите его через pip3 install. Например:

```text
pip3 install rknn_toolkit_lite2-x.y.z-cpxx-cpxx-linux_aarch64.whl
```

Перед установкой подготовьте на плате Python, pip и зависимости. Полные шаги и требования приведены в разделе установки и развёртывания среды «04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0».

### 3.3.2 Основной процесс развёртывания

Главная точка входа Python API RKNN-Toolkit Lite2 — объект RKNNLite. Типичный процесс на плате:

```text
Create RKNNLite object
      ↓
  load_rknn()
      ↓
 init_runtime()
      ↓
Prepare input and complete pre-processing
      ↓
  inference()
      ↓
  Process inference results
      ↓
  release()
```

Основные интерфейсы:

RKNNLite(): создаёт объект RKNN-Toolkit Lite2.

load_rknn(): загружает модель RKNN.

init_runtime(): инициализирует среду Runtime.

inference(): передаёт входные данные и выполняет инференс.

release(): освобождает объект RKNNLite и связанные ресурсы.

До inference() приложение читает и предварительно обрабатывает данные по требованиям модели. После инференса выполняет постобработку, например классификацию или обработку детекций.

### 3.3.3 Основные функциональные интерфейсы

Помимо основного процесса RKNN-Toolkit Lite2 предоставляет запросы сведений Runtime и поддерживаемых платформ. Часто используемые интерфейсы:

| Интерфейс | Назначение |
| --- | --- |
| RKNNLite() | Создание RKNNLite с настраиваемым журналом |
| load_rknn() | Загрузка модели RKNN |
| init_runtime() | Инициализация Runtime для инференса |
| inference() | Выполнение инференса и возврат результатов |
| get_sdk_version() | Запрос версий Runtime, драйвера и модели |
| list_support_target_platform() | Запрос платформ, поддерживаемых моделью RKNN |
| release() | Освобождение ресурсов выполнения |

init_runtime() позволяет настроить режим ядер NPU для поддерживаемой платформы. inference() принимает входы как список объектов ndarray и позволяет задать размещение данных. Значения параметров, ограничения и возвращаемые результаты описаны в «04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0».

### 3.3.4 Справочный пример

Следующий базовый пример показывает создание RKNNLite, загрузку модели, инициализацию Runtime, инференс и освобождение ресурсов. input_data — данные, уже предварительно обработанные согласно требованиям модели.

```text
rknn_lite = RKNNLite(verbose=True)

# 1. Load RKNN model
ret = rknn_lite.load_rknn('./model.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

# 2. Initialize Runtime
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_AUTO)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)

# 3. Run inference
outputs = rknn_lite.inference(inputs=[input_data])

# 4. Post-process outputs according to the model type
# ...

# 5. Release resources
rknn_lite.release()
```

Каталог examples/inference_with_lite SDK содержит полный пример классификации изображений ResNet18. Разместите пример, RKNN-модель и тестовые данные на плате с установленным RKNN-Toolkit Lite2, перейдите в каталог примера и выполните:

```text
cd examples/inference_with_lite
python3 test.py
```

Пример включает предобработку, инференс и обработку Top-5 результатов классификации и служит ориентиром при разработке. Параметры, возвращаемые значения и ограничения RKNNLite, load_rknn(), init_runtime(), inference() и release() описаны в «04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0».

{% endraw %}
