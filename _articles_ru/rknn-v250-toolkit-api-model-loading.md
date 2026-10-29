---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Загрузка Caffe, TensorFlow, ONNX и PyTorch"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-toolkit-api-model-loading"
slug: "rknn-v250-toolkit-api-model-loading"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Загрузка Caffe, TensorFlow, ONNX и PyTorch | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Загрузка Caffe, TensorFlow, ONNX и PyTorch | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-toolkit-api-model-loading/"
---

## Платформа и источник

Статья подготовлена по PDF производителя RKNN V2.5.0 и относится только к перечисленным в нём чипам и интерфейсам. Для платы ArmSoM сначала проверьте SoC, драйвер NPU, Toolkit/Runtime, SDK/BSP и версию ядра. Проверки на оборудовании ArmSoM не проводились; примеры и измерения оригинала не являются тестами ArmSoM.

## Навигация по серии

- [Среда и жизненный цикл объекта](/ru/articles/rknn-v250-toolkit-api-requirements-lifecycle/)
- [Конфигурация модели и параметры квантования](/ru/articles/rknn-v250-toolkit-api-configuration/)
- [Загрузка Caffe, TensorFlow, ONNX и PyTorch](/ru/articles/rknn-v250-toolkit-api-model-loading/)
- [Построение, гибридное квантование и экспорт](/ru/articles/rknn-v250-toolkit-api-build-quantize-export/)
- [Среда выполнения, регистрация операторов и инференс](/ru/articles/rknn-v250-toolkit-api-runtime-inference/)
- [Точность, производительность, память и запросы устройств](/ru/articles/rknn-v250-toolkit-api-evaluation-query/)
- [Генерация, сборка и запуск примеров C++](/ru/articles/rknn-v250-toolkit-api-cpp-codegen/)

{% raw %}

<!-- source EN p12 unit 47 -->

## 4 Загрузка модели 

<!-- source EN p12 unit 48 -->

RKNN-Toolkit2 поддерживает загрузку исходных моделей Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet и PyTorch, ещё не преобразованных в RKNN. Для разных форматов используются разные интерфейсы, описанные ниже.

<!-- source EN p12 unit 49 -->

### 4.1 Загрузка модели Caffe

<!-- source EN p12 unit 50 -->

| API | load_caffe |
| --- | --- |
| Описание | Загрузить модель Caffe. (Недоступно на ARM64.) |
| Параметр | model: Путь к файлу структуры модели Caffe (суффикс ".prototxt"). |
| Параметр | blobs: Путь к файлу двоичных данных модели Caffe (суффикс ".caffemodel"). |
| Параметр | input_name: Для модели Caffe с несколькими входами этим параметром можно задать порядок имён входных слоёв, например ['input1','input2','input3']. Имена должны совпадать с именами входов модели. По умолчанию None: порядок автоматически определяется файлом модели Caffe с суффиксом .prototxt. |
| Возвращаемое значение | 0: Импорт выполнен успешно. |
| Возвращаемое значение | -1: Ошибка импорта. |

<!-- source EN p12 unit 51 -->

Пример кода:

<!-- source EN p12 unit 52 -->

```python
# Load the mobilenet_v2 Caffe model in the current path
ret = rknn.load_caffe(model='./mobilenet_v2.prototxt',
                     blobs='./mobilenet_v2.caffemodel')
```

<!-- source EN p12 unit 53 -->

### 4.2 Загрузка модели TensorFlow

<!-- source EN p12 unit 54 -->

| API | load_tensorflow |
| --- | --- |
| Описание | Загрузить модель TensorFlow. (Недоступно на ARM64.) |
| Параметр | tf_pb: Путь к файлу модели TensorFlow (суффикс ".pb"). |
| Параметр | inputs: Входные узлы модели (имена операндов); поддерживается несколько узлов. Все строки имён входных узлов помещаются в список. |
| Параметр | input_size_list: Формы входных узлов, все формы помещаются в список. Например, для ssd_mobilenet_v1 параметр input_size_list должен быть [[1,300,300,3]]. |
| Параметр | outputs: Выходные узлы модели (имена операндов); поддерживается несколько узлов. Все выходные узлы помещаются в список. |
| Параметр | input_is_nchw: Имеет ли вход модели уже раскладку NCHW. По умолчанию False, то есть исходная раскладка NHWC. |
| Возвращаемое значение | 0: Импорт выполнен успешно. |
| Возвращаемое значение | -1: Ошибка импорта. |

<!-- source EN p13 unit 56 -->

Пример кода:

<!-- source EN p13 unit 57 -->

```python
# Load ssd_mobilenet_v1_coco_2017_11_17 TF model in the current path
ret = rknn.load_tensorflow(tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
                         inputs=['Preprocessor/sub'],
                         outputs=['concat', 'concat_1'],
                         input_size_list=[[300, 300, 3]])
```

<!-- source EN p13 unit 58 -->

### 4.3 Загрузка модели TensorFlow Lite

<!-- source EN p13 unit 59 -->

| API | load_tflite |
| --- | --- |
| Описание | Загрузить модель TensorFlow Lite. (Недоступно на ARM64.) |
| Параметр | model: Путь к файлу модели TensorFlow Lite (суффикс ".tflite"). |
| Параметр | input_is_nchw: Имеет ли вход модели уже раскладку NCHW. По умолчанию False, то есть исходная раскладка NHWC. |
| Возвращаемое значение | 0: Импорт выполнен успешно. |
| Возвращаемое значение | -1: Ошибка импорта. |

<!-- source EN p13 unit 60 -->

Пример кода:

<!-- source EN p13 unit 61 -->

```python
# Load the mobilenet_v1 TF-Lite model in the current path
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

<!-- source EN p13 unit 62 -->

### 4.4 Загрузка модели ONNX

<!-- source EN p13 unit 63 -->

| API | load_onnx |
| --- | --- |
| Описание | Загрузить модель ONNX. |
| Параметр | model: Путь к файлу модели ONNX (суффикс ".onnx"). |
| Параметр | inputs: Входные узлы модели (имена операндов); поддерживается несколько узлов. Все строки имён входных узлов помещаются в список. По умолчанию None: берутся из модели. |
| Параметр | input_size_list: Формы входных узлов, все формы помещаются в список. Если задан inputs, необходимо задать и input_size_list. По умолчанию None. |
| Параметр | input_initial_val: Начальные значения входов модели в формате списка ndarray. По умолчанию None.<br>Используется главным образом для фиксации некоторых входов как констант. Для входов, которые не должны быть константами, задаётся None, например [None, np.array([1])]. |
| Параметр | outputs: Выходные узлы модели (имена операндов); поддерживается несколько узлов. Все выходные узлы помещаются в список. По умолчанию None: берутся из модели. |
| Возвращаемое значение | 0: Импорт выполнен успешно. |
| Возвращаемое значение | -1: Ошибка импорта. |

<!-- source EN p14 unit 65 -->

Пример кода:

<!-- source EN p14 unit 66 -->

```python
# Load the arcface onnx model in the current path
ret = rknn.load_onnx(model='./arcface.onnx')
```

<!-- source EN p14 unit 67 -->

### 4.5 Загрузка модели DarkNet

<!-- source EN p14 unit 68 -->

| API | load_darknet |
| --- | --- |
| Описание | Загрузить модель DarkNet. (Недоступно на ARM64.) |
| Параметр | model: Путь к файлу структуры модели DarkNet (суффикс ".cfg"). |
| Параметр | weight: Путь к файлу весов (суффикс ".weight"). |
| Возвращаемое значение | 0: Импорт выполнен успешно. |
| Возвращаемое значение | -1: Ошибка импорта. |

<!-- source EN p14 unit 69 -->

Пример кода:

<!-- source EN p14 unit 70 -->

```python
# Load the yolov3-tiny DarkNet model in the current path
ret = rknn.load_darknet(model='./yolov3-tiny.cfg',
                       weight= './yolov3.weights')
```

<!-- source EN p14 unit 71 -->

### 4.6 Загрузка модели PyTorch

<!-- source EN p14 unit 72 -->

| API | load_pytorch |
| --- | --- |
| Описание | Загрузить модель PyTorch.<br>Поддерживается модель Quantization Aware Training (QAT), но для этого нужно обновить torch до версии '1.9.0' или выше. |
| Параметр | model: Путь к файлу структуры модели PyTorch (суффикс ".pt"); модель должна быть в формате torchscript. |
| Параметр | input_size_list: Формы входных узлов, все формы помещаются в список. |
| Возвращаемое значение | 0: Импорт выполнен успешно. |
| Возвращаемое значение | -1: Ошибка импорта. |

<!-- source EN p14 unit 73 -->

Пример кода:

<!-- source EN p14 unit 74 -->

```python
# Load the PyTorch model resnet18 in the current path
ret = rknn.load_pytorch(model='./resnet18.pt',
                       input_size_list=[[1,3,224,224]])
```

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Примечания: журналы с SDK 1.5.2 сохранены как исторические примеры, а не измерения V2.5.0. Ячейка Python для Ubuntu20.04 различается: китайский текст 3.8/3.9, английский 3.8/3.8; аналогично для Debian11; в разделе ARM64 Debian всё ещё помечен x64. Значения сохранены; проверяйте фактический установочный пакет. V2.5.0 добавляет главу C++ codegen и уточняет квантование и стратегии памяти; параметры старой версии не подменяют новый источник.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
