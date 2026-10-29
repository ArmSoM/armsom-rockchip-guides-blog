---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Среда и жизненный цикл объекта"
date: "2026-10-29"
author: "ArmSoM"
lang: "ru"
translation_key: "rknn-v250-toolkit-api-requirements-lifecycle"
slug: "rknn-v250-toolkit-api-requirements-lifecycle"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Среда и жизненный цикл объекта | Полные параметры, примеры и ограничения платформ"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Среда и жизненный цикл объекта | Полные параметры, примеры и ограничения платформ"
permalink: "/ru/articles/rknn-v250-toolkit-api-requirements-lifecycle/"
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

<!-- source EN p5 unit 0 -->

## 1 Требования

<!-- source EN p5 unit 1 -->

### 1.1 Поддерживаемые модели чипов

<!-- source EN p5 unit 2 -->

RV1103

<!-- source EN p5 unit 3 -->

RV1103B

<!-- source EN p5 unit 4 -->

RV1106

<!-- source EN p5 unit 5 -->

RV1106B

<!-- source EN p5 unit 6 -->

RV1126B

<!-- source EN p5 unit 7 -->

RK2118

<!-- source EN p5 unit 8 -->

RK3562

<!-- source EN p5 unit 9 -->

Серия RK3566

<!-- source EN p5 unit 10 -->

Серия RK3568

<!-- source EN p5 unit 11 -->

Серия RK3576

<!-- source EN p5 unit 12 -->

Серия RK3588

<!-- source EN p5 unit 13 -->

Примечание: далее RK3566 / RK3568 / RK3576 / RK3588 обозначают соответствующие серии RK3566 / RK3568 / RK3576 / RK3588.

<!-- source EN p5 unit 14 -->

### 1.2 Требования к среде и зависимостям

<!-- source EN p5 unit 15 -->

Рекомендуется следующая среда операционной системы:

<!-- source EN p5 unit 16 -->

| Версия операционной системы | Ubuntu18.04<br>(x64) | Ubuntu20.04<br>(x64) | Ubuntu22.04<br>(x64) | Ubuntu24.04<br>(x64) |
| --- | --- | --- | --- | --- |
| Версия Python | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 | 3.12 |

<!-- source EN p5 unit 17 -->

Для ARM64:

<!-- source EN p5 unit 18 -->

| Версия операционной системы | Debian10 (x64) | Debian11 (x64) | Debian12 (x64) |
| --- | --- | --- | --- |
| Версия Python | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 / 3.12 |

<!-- source EN p5 unit 19 -->

Примечания:

<!-- source EN p5 unit 20 -->

1. Подробные зависимости библиотек Python указаны в doc/requirements*.txt.

<!-- source EN p5 unit 21 -->

2. Примеры документа в основном используют Ubuntu 20.04 / Python3.8.

<!-- source EN p5 unit 22 -->

### 1.3 Поддерживаемые фреймворки глубокого обучения

<!-- source EN p5 unit 23 -->

RKNN-Toolkit2 поддерживает Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet и PyTorch.

<!-- source EN p5 unit 24 -->

Соответствие версий RKNN-Toolkit2 и фреймворков приведено ниже:

<!-- source EN p6 unit 25 -->

| RKNN-Toolkit2 | Caffe | TensorFlow | TF Lite | ONNX | DarkNet | PyTorch |
| --- | --- | --- | --- | --- | --- | --- |
| 1.4.0<br>1.4.2<br>1.5.0<br>1.5.2 | 1.0 | 1.12.0<br>~2.8.0 | Версия<br>схемы=3 | 1.7.0<br>~1.10.0 | Идентификатор коммита:<br>810d7f7 | 1.6.0<br>~1.10.1 |
| 1.6.0 | 1.0 | 1.12.0<br>~2.14.0 | Версия<br>схемы=3 | 1.7.0<br>~1.14.0 | Идентификатор коммита:<br>810d7f7 | 1.6.0<br>~1.13.1 |
| 2.0.0<br>2.1.0<br>2.2.0 | 1.0 | 1.12.0<br>~2.14.0 | Версия<br>схемы=3 | 1.7.0<br>~1.14.1 | Идентификатор коммита:<br>810d7f7 | 1.10.1<br>~2.1.0 |
| 2.3.0<br>~2.5.0 | 1.0 | 1.12.0<br>~2.14.0 | Версия<br>схемы=3 | 1.7.0<br>~1.17.0 | Идентификатор коммита:<br>810d7f7 | 1.10.1<br>~2.4.0 |

<!-- source EN p6 unit 26 -->

Примечания:

<!-- source EN p6 unit 27 -->

1. Благодаря совместимости версий TensorFlow теоретически поддерживаются и pb-файлы, экспортированные версиями до TensorFlow 1.12.0. Подробности совместимости разных версий приведены в официальной документации: https://www.tensorflow.org/guide/versions

<!-- source EN p6 unit 28 -->

2. Схемы разных версий TFLite несовместимы. Если схема экспортированной модели отличается от версии схемы, используемой RKNN-Toolkit2, загрузка модели может завершиться ошибкой.

<!-- source EN p6 unit 29 -->

3. Протокол Caffe в RKNN-Toolkit2 основан на официальном Berkeley-протоколе с модификациями. Источник: https://github.com/BVLC/caffe/tree/master/src/caffe/proto, commit 828dd10. RKNN-Toolkit2 добавляет на этой основе некоторые операторы.

<!-- source EN p6 unit 30 -->

4. Соответствие выпусков ONNX версиям opset и IR описано в документации onnxruntime: https://github.com/microsoft/onnxruntime/blob/v1.10.0/docs/Versioning.md

<!-- source EN p6 unit 31 -->

5. Официальный репозиторий DarkNet: https://github.com/pjreddie/darknet. Правила преобразования RKNN-Toolkit2 в исходном документе основаны на последнем для его состояния коммите ветки master — 810d7f7; это не утверждение о текущем HEAD.

<!-- source EN p6 unit 32 -->

6. При загрузке PyTorch-модели (torchscript) рекомендуется использовать одну и ту же версию PyTorch для экспорта модели и преобразования в RKNN. Различие версий может привести к ошибке преобразования.

<!-- source EN p6 unit 33 -->

7. Версия ARM64 поддерживает только PyTorch и ONNX; остальные фреймворки в состоянии источника не поддерживаются.

<!-- source EN p7 unit 34 -->

## 2 Объект RKNN и жизненный цикл ресурсов

<!-- source EN p7 unit 35 -->

Эта группа интерфейсов создаёт и освобождает объект RKNN. Перед использованием любых API RKNN-Toolkit2 вызовите RKNN(); после завершения задачи освободите объект методом release().

<!-- source EN p7 unit 36 -->

При создании объекта RKNN параметры verbose и verbose_file управляют подробным журналом загрузки и построения модели и других операций. verbose имеет тип bool: при True RKNN-Toolkit2 печатает подробный журнал. verbose_file — строка; если она содержит путь к файлу, журнал записывается туда, причём verbose также должен быть True.

<!-- source EN p7 unit 37 -->

Пример кода:

<!-- source EN p7 unit 38 -->

```python
# Print the detailed log information.
rknn = RKNN(verbose=True)

...

rknn.release()
```

{% endraw %}

## Источник и редакционные примечания

Технические главы разделены по назначению. Код, идентификаторы и параметры сохранены. Китайская версия следует китайскому оригиналу; английская, русская и немецкая — английскому. В главы без иллюстраций вымышленные изображения не добавлены.

Примечания: журналы с SDK 1.5.2 сохранены как исторические примеры, а не измерения V2.5.0. Ячейка Python для Ubuntu20.04 различается: китайский текст 3.8/3.9, английский 3.8/3.8; аналогично для Debian11; в разделе ARM64 Debian всё ещё помечен x64. Значения сохранены; проверяйте фактический установочный пакет. V2.5.0 добавляет главу C++ codegen и уточняет квантование и стратегии памяти; параметры старой версии не подменяют новый источник.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
