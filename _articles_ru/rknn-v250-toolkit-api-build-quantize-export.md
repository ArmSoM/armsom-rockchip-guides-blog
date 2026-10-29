---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Построение, гибридное квантование и экспорт"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-toolkit-api-build-quantize-export"
slug: "rknn-v250-toolkit-api-build-quantize-export"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Построение, гибридное квантование и экспорт | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Построение, гибридное квантование и экспорт | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-toolkit-api-build-quantize-export/"
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

<!-- source EN p15 unit 75 -->

## 5 API построения и квантования модели

<!-- source EN p15 unit 76 -->

### 5.1 Построение модели RKNN

<!-- source EN p15 unit 77 -->

| API | build |
| --- | --- |
| Описание | Собрать соответствующую модель RKNN на основе импортированной модели. |
| Параметр | do_quantization: Выполнять ли квантование модели. По умолчанию True. |
| Параметр | dataset: Входной набор данных для калибровки параметров квантования. Поддерживается текстовый файл с путями к изображениям (jpg или png) либо файлам npy для калибровки. На каждой строке один путь, например:<br>a.jpg<br>b.jpg<br>или<br>a.npy<br>b.npy<br>При нескольких входах соответствующие файлы разделяются пробелом, например:<br>a.jpg a2.jpg<br>b.jpg b2.jpg<br>или<br>a.npy a2.npy<br>b.npy b2.npy<br>Примечание: обычно рекомендуются изображения квантования, соответствующие сценарию прогнозирования. |
| Параметр | rknn_batch_size: Изменяет размер пакета входа. По умолчанию None.<br>При значении больше 1 NPU обрабатывает несколько кадров изображений или входных данных за один инференс. Например, исходный вход MobileNet — [1, 224, 224, 3], выход — [1, 1001]. При rknn_batch_size = 4 вход становится [4, 224, 224, 3], выход — [4, 1001].<br>Примечания:<br>1. rknn_batch_size повышает производительность (загрузку ядер) только на многоядерных NPU; рекомендуется выбирать значение по числу ядер NPU.<br>2. Изменение rknn_batch_size меняет формы входов и выходов. Для inference нужно передавать входы правильного размера и соответственно обрабатывать возвращённые выходы на этапе постобработки. |
| Параметр | auto_hybrid: Включать ли автоматическое смешанное квантование для коррекции точности или переполнения. По умолчанию False: коррекция не выполняется. При квантовании модели auto_hybrid переводит операции, у которых косинусное и евклидово расстояния ниже заданных порогов, в вычисления FP16 (сейчас поддерживается только квантование 'w8a8'). Если модель не квантуется, auto_hybrid переводит операции, выходящие за диапазон значений FP16, в вычисления INT16.<br>Примечание:<br>1. Пороги косинусного и евклидова расстояния задаются через auto_hybrid_cos_thresh и auto_hybrid_euc_thresh интерфейса config. |
| Возвращаемое значение | 0: Сборка выполнена успешно. |
| Возвращаемое значение | -1: Ошибка сборки. |

<!-- source EN p16 unit 78 -->

Пример кода:

<!-- source EN p16 unit 79 -->

```python
# Build and quantize RKNN model
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
```

<!-- source EN p16 unit 80 -->

### 5.2 Гибридное квантование

<!-- source EN p16 unit 81 -->

#### 5.2.1 hybrid_quantization_step1

<!-- source EN p16 unit 82 -->

На первом этапе гибридного квантования вызывается hybrid_quantization_step1. Он создаёт временную модель (.model), файл данных (.data) и конфигурацию квантования (.quantization.cfg). Подробности интерфейса:

<!-- source EN p16 unit 83 -->

| API | hybrid_quantization_step1 |
| --- | --- |
| Описание | На основе загруженной исходной модели генерируются временные файлы модели, файлы данных и профили квантования. |
| Параметр | dataset: См. 5.1 «Построение модели RKNN». |
| Параметр | rknn_batch_size: См. 5.1 «Построение модели RKNN». |
| Параметр | proposal: Генерировать предложения по настройке смешанного квантования. По умолчанию False. |
| Параметр | proposal_dataset_size: Размер набора данных для proposal. По умолчанию 1. Поскольку proposal требует много времени, используется размер 1. |
| Параметр | custom_hybrid: Выбор подграфов гибридного квантования по нескольким парам имён входов и выходов пользователя. Формат [[input0_name, output0_name], [input1_name, output1_name], ...]. По умолчанию None.<br>Примечание: имена выбираются по временной модели (.model). |
| Возвращаемое значение | 0: Успешно. |
| Возвращаемое значение | -1: Ошибка. |

<!-- source EN p16 unit 84 -->

Пример кода:

<!-- source EN p16 unit 85 -->

```python
# Call hybrid_quantization_step1 to generate quantization config
ret = rknn.hybrid_quantization_step1(dataset='./dataset.txt')
```

<!-- source EN p16 unit 86 -->

#### 5.2.2 hybrid_quantization_step2

<!-- source EN p16 unit 87 -->

Для этапа формирования смешанно-квантованной модели RKNN вызывается hybrid_quantization_step2. Описание интерфейса:

<!-- source EN p16 unit 88 -->

| API | hybrid_quantization_step2 |
| --- | --- |
| Описание | Принимает временный файл модели, файл данных, профиль квантования и калибровочный набор данных, затем генерирует модель RKNN со смешанным квантованием. |
| Параметр | model_input: Путь к файлу временной модели (.model), созданному hybrid_quantization_step1. |
| Параметр | data_input: Путь к файлу данных модели (.data), созданному hybrid_quantization_step1. |
| Параметр | model_quantization_cfg: Путь к файлу изменённой конфигурации квантования (.quantization.cfg), созданному hybrid_quantization_step1. |
| Возвращаемое значение | 0: Успешно. |
| Возвращаемое значение | -1: Ошибка. |

<!-- source EN p17 unit 90 -->

Пример кода:

<!-- source EN p17 unit 91 -->

```python
# Call hybrid_quantization_step2 to generate hybrid quantized RKNN model
ret = rknn.hybrid_quantization_step2(
               model_input='./ssd_mobilenet_v2.model',
               data_input='./ssd_mobilenet_v2.data',
               model_quantization_cfg='./ssd_mobilenet_v2.quantization.cfg')
```

<!-- source EN p18 unit 92 -->

## 6 Экспорт модели RKNN

<!-- source EN p18 unit 93 -->

Модель RKNN, созданную через build, можно сохранить в файл для дальнейшего развёртывания.

<!-- source EN p18 unit 94 -->

| API | export_rknn |
| --- | --- |
| Описание | Сохранить модель RKNN в указанном файле (суффикс ".rknn"). |
| Параметр | export_path: Путь к создаваемому файлу модели RKNN. |
| Возвращаемое значение | 0: Экспорт выполнен успешно. |
| Возвращаемое значение | -1: Ошибка экспорта. |

<!-- source EN p18 unit 95 -->

Пример кода:

<!-- source EN p18 unit 96 -->

```python
# save the built RKNN model as a mobilenet_v1.rknn file in the current path
ret = rknn.export_rknn(export_path='./mobilenet_v1.rknn')
```

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Примечания: журналы с SDK 1.5.2 сохранены как исторические примеры, а не измерения V2.5.0. Ячейка Python для Ubuntu20.04 различается: китайский текст 3.8/3.9, английский 3.8/3.8; аналогично для Debian11; в разделе ARM64 Debian всё ещё помечен x64. Значения сохранены; проверяйте фактический установочный пакет. V2.5.0 добавляет главу C++ codegen и уточняет квантование и стратегии памяти; параметры старой версии не подменяют новый источник.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
