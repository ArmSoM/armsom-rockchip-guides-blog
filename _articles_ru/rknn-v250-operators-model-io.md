---
title: "RKNN2 V2.5.0 · Ввод/вывод модели, выравнивание и ограничения свёрток"
description: "RKNN2 V2.5.0 · Ввод/вывод модели, выравнивание и ограничения свёрток · Полные параметры и ограничения операторов по оригиналу V2.5.0."
excerpt: "RKNN2 V2.5.0 · Ввод/вывод модели, выравнивание и ограничения свёрток · Полные параметры и ограничения операторов по оригиналу V2.5.0."
translation_key: "rknn-v250-operators-model-io"
slug: "rknn-v250-operators-model-io"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RKNN2"]
---

Этот справочник платформ RKNN2 V2.5.0 предназначен для разработчиков ArmSoM при выборе и адаптации моделей. Он не подтверждает поддержку на всех платах ArmSoM: проверьте SoC платы, фактические версии Toolkit2, Runtime, драйвера NPU и BSP. В оригинале не задана единая версия ядра Linux. Аппаратная проверка на ArmSoM не выполнялась.

Источник: предоставленные китайская и английская редакции RKNN2 Supported Operators and Constraints Reference V2.5.0, 374 и 384 страницы. Китайский текст следует китайской редакции; английский, русский и немецкий — английской. Ограничения платформ не объединяются. В английском PDF рисунки и таблицы I/O содержат китайские подписи; их происхождение сохранено, добавлены редактируемые локализованные таблицы. Написание ConvTranpose и исходные уравнения LSTM/GRU сохранены; эти формулы не являются исправлениями реализации SDK.

Страницы источника: CN 368–374; EN 378–384.

[Rockchip RKNN2](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<details markdown="1">
<summary>Серия справочников операторов</summary>

[RKNN2 V2.5.0 · RK3566/RK3568：Основы и свёртки](/ru/articles/rknn-v250-operators-rk3566-rk3568-convolution/)

[RKNN2 V2.5.0 · RK3566/RK3568：Рекуррентные сети, арифметика и пулинг](/ru/articles/rknn-v250-operators-rk3566-rk3568-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3566/RK3568：Формы, срезы и транспонирование](/ru/articles/rknn-v250-operators-rk3566-rk3568-shape-indexing/)

[RKNN2 V2.5.0 · RK3566/RK3568：Активации, нормализация и расширения](/ru/articles/rknn-v250-operators-rk3566-rk3568-activations-extensions/)

[RKNN2 V2.5.0 · RK3588：Основы и свёртки](/ru/articles/rknn-v250-operators-rk3588-convolution/)

[RKNN2 V2.5.0 · RK3588：Рекуррентные сети, арифметика и пулинг](/ru/articles/rknn-v250-operators-rk3588-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3588：Формы, срезы и транспонирование](/ru/articles/rknn-v250-operators-rk3588-shape-indexing/)

[RKNN2 V2.5.0 · RK3588：Активации, нормализация и расширения](/ru/articles/rknn-v250-operators-rk3588-activations-extensions/)

[RKNN2 V2.5.0 · RK3562：Основы и свёртки](/ru/articles/rknn-v250-operators-rk3562-convolution/)

[RKNN2 V2.5.0 · RK3562：Рекуррентные сети, арифметика и пулинг](/ru/articles/rknn-v250-operators-rk3562-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3562：Формы, срезы и транспонирование](/ru/articles/rknn-v250-operators-rk3562-shape-indexing/)

[RKNN2 V2.5.0 · RK3562：Активации, нормализация и расширения](/ru/articles/rknn-v250-operators-rk3562-activations-extensions/)

[RKNN2 V2.5.0 · RV1103/RV1106：Основы и свёртки](/ru/articles/rknn-v250-operators-rv1103-rv1106-convolution/)

[RKNN2 V2.5.0 · RV1103/RV1106：Рекуррентные сети, арифметика и пулинг](/ru/articles/rknn-v250-operators-rv1103-rv1106-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103/RV1106：Формы, срезы и транспонирование](/ru/articles/rknn-v250-operators-rv1103-rv1106-shape-indexing/)

[RKNN2 V2.5.0 · RV1103/RV1106：Активации, нормализация и расширения](/ru/articles/rknn-v250-operators-rv1103-rv1106-activations-extensions/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Основы и свёртки](/ru/articles/rknn-v250-operators-rk3576-rv1126b-convolution/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Рекуррентные сети, арифметика и пулинг](/ru/articles/rknn-v250-operators-rk3576-rv1126b-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Формы, срезы и транспонирование](/ru/articles/rknn-v250-operators-rk3576-rv1126b-shape-indexing/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Активации, нормализация и расширения](/ru/articles/rknn-v250-operators-rk3576-rv1126b-activations-extensions/)

[RKNN2 V2.5.0 · RK2118：Основы и свёртки](/ru/articles/rknn-v250-operators-rk2118-convolution/)

[RKNN2 V2.5.0 · RK2118：Рекуррентные сети, арифметика и пулинг](/ru/articles/rknn-v250-operators-rk2118-recurrent-pooling/)

[RKNN2 V2.5.0 · RK2118：Формы, срезы и транспонирование](/ru/articles/rknn-v250-operators-rk2118-shape-indexing/)

[RKNN2 V2.5.0 · RK2118：Активации, нормализация и расширения](/ru/articles/rknn-v250-operators-rk2118-activations-extensions/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Основы и свёртки](/ru/articles/rknn-v250-operators-rv1103b-rv1106b-convolution/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Рекуррентные сети, арифметика и пулинг](/ru/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Формы, срезы и транспонирование](/ru/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Активации, нормализация и расширения](/ru/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · Поддержка и ограничения операторов CPU](/ru/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · Поддержка и ограничения операторов GPU](/ru/articles/rknn-v250-operators-gpu/)

**RKNN2 V2.5.0 · Ввод/вывод модели, выравнивание и ограничения свёрток**

</details>

{% raw %}

## Ограничения входов и выходов модели

## Ограничения входов модели

1. Эти ограничения выравнивания относятся только к API нулевого копирования, а не к обычным API.

2. Выравнивание входной ширины можно узнать через атрибут w\_stride API нулевого копирования. Примечание: w\_stride нельзя изменять.

3. Выравнивание требуется только для входной ширины (width) в зависимости от числа каналов (channel); прочих ограничений нет.

4. Если mean и scale не нужны, задайте mean=0 и scale=1.

5. Если channel&gt;4, mean/scale используют для всех каналов только первые значения: mean\[0\] и scale\[0\].

6. Если первый слой имеет тип с плавающей точкой, операция quant отсутствует.

7. RV1106/RV1103/RV1103B не поддерживают операции mean/scale/quant на CPU.

8. Подробное использование см. в Rockchip\_RKNPU\_User\_Guide\_RKNN\_SDK.

## RK3566/RK3568

![Ограничения входа модели из исходного PDF](/assets/images/rknn-v250/operators/en/p378-figure-01.png)

Редактируемая транскрипция оригинала (объединённые ячейки развёрнуты):

| Платформа | Точность первого слоя | Размерность входа | Заданный тип входа первого слоя | Исполнитель mean/scale/quant | Выравнивание width (элементы), channel=1,3,4 | Выравнивание width (элементы), channel≠1,3,4 | Ограничения width, channel=1,3,4 | Ограничения width, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3566/RK3568 | int8 | 4 | uint8 | NPU | 8 | 1 | A | Без ограничений |
| RK3566/RK3568 | int8 | 4 | int8 | NPU | 8 | 1 | A | Без ограничений |
| RK3566/RK3568 | int8 | 4 | float16 | CPU | 8 | 1 | A | Без ограничений |
| RK3566/RK3568 | int8 | 4 | Прочие типы (выравнивание входа может измениться) | CPU | 8 | 1 | A | Без ограничений |
| RK3566/RK3568 | float16 | 4 | uint8 | CPU | 4 | 1 | B | Без ограничений |
| RK3566/RK3568 | float16 | 4 | int8 | CPU | 4 | 1 | B | Без ограничений |
| RK3566/RK3568 | float16 | 4 | float16 | CPU | 4 | 1 | B | Без ограничений |
| RK3566/RK3568 | float16 | 4 | Прочие типы (выравнивание входа может измениться) | CPU | 4 | 1 | B | Без ограничений |
| RK3566/RK3568 | Без ограничений | Не 4-мерный | Без ограничений | CPU | 1 | 1 | Без ограничений | Без ограничений |

Для каждого типа свёртки width/kernel_h/kernel_w должны удовлетворять обоим условиям ниже. N — целое число от 1 до 7; свёртки вне диапазона не поддерживаются. Формулы N приведены ниже. Написание dilation_kernel_h/w на рисунке отличается от dilated_kernel_h/w в последней главе; сохранён вариант рисунка.

| Условие | Формула |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt; 1024 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |

| Условие | Формула |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt; 1024 \* N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |
| B / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| B / ConvTranspose/Deconvolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |

## RK3588

![Ограничения входа модели из исходного PDF](/assets/images/rknn-v250/operators/en/p379-figure-01.png)

Редактируемая транскрипция оригинала (объединённые ячейки развёрнуты):

| Платформа | Точность первого слоя | Размерность входа | Заданный тип входа первого слоя | Исполнитель mean/scale/quant | Выравнивание width (элементы), channel=1,3,4 | Выравнивание width (элементы), channel≠1,3,4 | Ограничения width, channel=1,3,4 | Ограничения width, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3588 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Без ограничений |
| RK3588 | int8 | 4 | int8 | NPU | 16 | 1 | A | Без ограничений |
| RK3588 | int8 | 4 | float16 | CPU | 16 | 1 | A | Без ограничений |
| RK3588 | int8 | 4 | Прочие типы (выравнивание входа может измениться) | CPU | 16 | 1 | A | Без ограничений |
| RK3588 | float16 | 4 | uint8 | CPU | 8 | 1 | B | Без ограничений |
| RK3588 | float16 | 4 | int8 | CPU | 8 | 1 | B | Без ограничений |
| RK3588 | float16 | 4 | float16 | CPU | 8 | 1 | B | Без ограничений |
| RK3588 | float16 | 4 | Прочие типы (выравнивание входа может измениться) | CPU | 8 | 1 | B | Без ограничений |
| RK3588 | Без ограничений | Не 4-мерный | Без ограничений | CPU | 1 | 1 | Без ограничений | Без ограничений |

Для каждого типа свёртки width/kernel_h/kernel_w должны удовлетворять обоим условиям ниже. N — целое число от 1 до 7; свёртки вне диапазона не поддерживаются. Формулы N приведены ниже. Написание dilation_kernel_h/w на рисунке отличается от dilated_kernel_h/w в последней главе; сохранён вариант рисунка.

| Условие | Формула |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 8192 |
| A / Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |
| A / Depthwise Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048), 3) |
| A / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |

| Условие | Формула |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt;= 1024 \* N |
| B (2) | width &lt;= 8192 |
| B / Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |
| B / Depthwise Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048), 3) |
| B / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |

## RV1103/RV1106

![Ограничения входа модели из исходного PDF](/assets/images/rknn-v250/operators/en/p379-figure-02.png)

Редактируемая транскрипция оригинала (объединённые ячейки развёрнуты):

| Платформа | Точность первого слоя | Размерность входа | Заданный тип входа первого слоя | Исполнитель mean/scale/quant | Выравнивание width (элементы), channel=1,3,4 | Выравнивание width (элементы), channel≠1,3,4 | Ограничения width, channel=1,3,4 | Ограничения width, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RV1103/RV1106 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Без ограничений |

Для каждого типа свёртки width/kernel_h/kernel_w должны удовлетворять обоим условиям ниже. N — целое число от 1 до 7; свёртки вне диапазона не поддерживаются. Формулы N приведены ниже. Написание dilation_kernel_h/w на рисунке отличается от dilated_kernel_h/w в последней главе; сохранён вариант рисунка.

| Условие | Формула |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

> Заголовок рисунка ссылается на примечание 9, но предоставленное описание входов содержит только 1–8. Примечание 9 не найдено и не дополняется догадками.

## RK3562

![Ограничения входа модели из исходного PDF](/assets/images/rknn-v250/operators/en/p380-figure-01.png)

Редактируемая транскрипция оригинала (объединённые ячейки развёрнуты):

| Платформа | Точность первого слоя | Размерность входа | Заданный тип входа первого слоя | Исполнитель mean/scale/quant | Выравнивание width (элементы), channel=1,3,4 | Выравнивание width (элементы), channel≠1,3,4 | Ограничения width, channel=1,3,4 | Ограничения width, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3562 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Без ограничений |
| RK3562 | int8 | 4 | int8 | NPU | 16 | 1 | A | Без ограничений |
| RK3562 | int8 | 4 | float16 | CPU | 16 | 1 | A | Без ограничений |
| RK3562 | int8 | 4 | Прочие типы (выравнивание входа может измениться) | CPU | 16 | 1 | A | Без ограничений |
| RK3562 | float16 | 4 | uint8 | CPU | 8 | 1 | B | Без ограничений |
| RK3562 | float16 | 4 | int8 | CPU | 8 | 1 | B | Без ограничений |
| RK3562 | float16 | 4 | float16 | CPU | 8 | 1 | B | Без ограничений |
| RK3562 | float16 | 4 | Прочие типы (выравнивание входа может измениться) | CPU | 8 | 1 | B | Без ограничений |
| RK3562 | Без ограничений | Не 4-мерный | Без ограничений | CPU | 1 | 1 | Без ограничений | Без ограничений |

Для каждого типа свёртки width/kernel_h/kernel_w должны удовлетворять обоим условиям ниже. N — целое число от 1 до 7; свёртки вне диапазона не поддерживаются. Формулы N приведены ниже. Написание dilation_kernel_h/w на рисунке отличается от dilated_kernel_h/w в последней главе; сохранён вариант рисунка.

| Условие | Формула |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

| Условие | Формула |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| B / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| B / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

## RK3576/RV1126B

![Ограничения входа модели из исходного PDF](/assets/images/rknn-v250/operators/en/p380-figure-02.png)

Редактируемая транскрипция оригинала (объединённые ячейки развёрнуты):

| Платформа | Точность первого слоя | Размерность входа | Заданный тип входа первого слоя | Исполнитель mean/scale/quant | Выравнивание width (элементы), channel=1,3,4 | Выравнивание width (элементы), channel≠1,3,4 | Ограничения width, channel=1,3,4 | Ограничения width, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3576/RV1126B | int8 | 4 | uint8 | NPU | 16 | 1 | A | Без ограничений |
| RK3576/RV1126B | int8 | 4 | int8 | NPU | 16 | 1 | A | Без ограничений |
| RK3576/RV1126B | int8 | 4 | float16 | CPU | 16 | 1 | A | Без ограничений |
| RK3576/RV1126B | int8 | 4 | Прочие типы (выравнивание входа может измениться) | CPU | 16 | 1 | A | Без ограничений |
| RK3576/RV1126B | float16 | 4 | uint8 | CPU | 8 | 1 | B | Без ограничений |
| RK3576/RV1126B | float16 | 4 | int8 | CPU | 8 | 1 | B | Без ограничений |
| RK3576/RV1126B | float16 | 4 | float16 | CPU | 8 | 1 | B | Без ограничений |
| RK3576/RV1126B | float16 | 4 | Прочие типы (выравнивание входа может измениться) | CPU | 8 | 1 | B | Без ограничений |
| RK3576/RV1126B | Без ограничений | Не 4-мерный | Без ограничений | CPU | 1 | 1 | Без ограничений | Без ограничений |

Для каждого типа свёртки width/kernel_h/kernel_w должны удовлетворять обоим условиям ниже. N — целое число от 1 до 7; свёртки вне диапазона не поддерживаются. Формулы N приведены ниже. Написание dilation_kernel_h/w на рисунке отличается от dilated_kernel_h/w в последней главе; сохранён вариант рисунка.

| Условие | Формула |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

| Условие | Формула |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| B / Depthwise Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048), 3) |
| B / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

## RK2118

![Ограничения входа модели из исходного PDF](/assets/images/rknn-v250/operators/en/p381-figure-01.png)

Редактируемая транскрипция оригинала (объединённые ячейки развёрнуты):

| Платформа | Точность первого слоя | Размерность входа | Заданный тип входа первого слоя | Исполнитель mean/scale/quant | Выравнивание width (элементы), channel=1,3,4 | Выравнивание width (элементы), channel≠1,3,4 | Ограничения width, channel=1,3,4 | Ограничения width, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK2118 | float16 | 4 | float16 | CPU | 4 | 1 | A | Без ограничений |
| RK2118 | float16 | Не 4-мерный | float16 | CPU | 1 | 1 | A | Без ограничений |

Для каждого типа свёртки width/kernel_h/kernel_w должны удовлетворять обоим условиям ниже. N — целое число от 1 до 7; свёртки вне диапазона не поддерживаются. Формулы N приведены ниже. Написание dilation_kernel_h/w на рисунке отличается от dilated_kernel_h/w в последней главе; сохранён вариант рисунка.

| Условие | Формула |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

## RV1103B

![Ограничения входа модели из исходного PDF](/assets/images/rknn-v250/operators/en/p381-figure-02.png)

Редактируемая транскрипция оригинала (объединённые ячейки развёрнуты):

| Платформа | Точность первого слоя | Размерность входа | Заданный тип входа первого слоя | Исполнитель mean/scale/quant | Выравнивание width (элементы), channel=1,3,4 | Выравнивание width (элементы), channel≠1,3,4 | Ограничения width, channel=1,3,4 | Ограничения width, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RV1103B/RV1106B | int8 | 4 | uint8 | NPU | 8 | 1 | A | Без ограничений |
| RV1103B/RV1106B | int8 | 4 | int8 | NPU | 8 | 1 | A | Без ограничений |

Для каждого типа свёртки width/kernel_h/kernel_w должны удовлетворять обоим условиям ниже. N — целое число от 1 до 7; свёртки вне диапазона не поддерживаются. Формулы N приведены ниже. Написание dilation_kernel_h/w на рисунке отличается от dilated_kernel_h/w в последней главе; сохранён вариант рисунка.

| Условие | Формула |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

> Заголовок рисунка ссылается на примечание 9, но предоставленное описание входов содержит только 1–8. Примечание 9 не найдено и не дополняется догадками.

## Ограничения выходов модели

1. Для выходного тензора NHWC требуется выравнивание, если преобразование выхода выполняет NPU; при реализации на CPU выравнивание не требуется.

2. Точность выхода int8/float16 означает исходный тип данных выхода последнего слоя модели.

3. Для выхода NCHW, реализованного на NPU через интерфейс нулевого копирования, размер выделяемой выходной памяти определяется полученным через query значением size.

4. Для выхода NC1HWC2 размер выделяемой выходной памяти определяется полученным через query значением size.

## RK3566/RK3568

| Платформа | Точность выхода модели | Размерность выхода | Выходной layout | Выравнивание channel | Выравнивание H\*W |
|---|---|---|---|---|---|
| RK3566/RK3568 | int8 | 4 | NCHW | Нет | Нет |
| RK3566/RK3568 | int8 | 4 | NHWC | Кратно 8 | Нет |
| RK3566/RK3568 | int8 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 16; прочие операторы: кратно 8 | Кратно 4 |
| RK3566/RK3568 | int8 | 4 | UNDEFINE | Нет | Нет |
| RK3566/RK3568 | float16 | 4 | NCHW | Нет | Нет |
| RK3566/RK3568 | float16 | 4 | NHWC | Кратно 4 | Нет |
| RK3566/RK3568 | float16 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 8; прочие операторы: кратно 4 | Кратно 4 |
| RK3566/RK3568 | float16 | 4 | UNDEFINE | Нет | Нет |
| RK3566/RK3568 | Без ограничений | Не 4D | UNDEFINE | Нет | Нет |

## RK3588

| Платформа | Точность выхода модели | Размерность выхода | Выходной layout | Выравнивание channel | Выравнивание H\*W |
|---|---|---|---|---|---|
| RK3588 | int8 | 4 | NCHW | Нет | Нет |
| RK3588 | int8 | 4 | NHWC | Кратно 16 | Нет |
| RK3588 | int8 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 32; прочие операторы: кратно 16 | Кратно 4 |
| RK3588 | int8 | 4 | UNDEFINE | Нет | Нет |
| RK3588 | float16 | 4 | NCHW | Нет | Нет |
| RK3588 | float16 | 4 | NHWC | Кратно 8 | Нет |
| RK3588 | float16 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 16; прочие операторы: кратно 8 | Кратно 4 |
| RK3588 | float16 | 4 | UNDEFINE | Нет | Нет |
| RK3588 | Без ограничений | Не 4D | UNDEFINE | Нет | Нет |

## RV1103/RV1106

| Платформа | Точность выхода модели | Размерность выхода | Выходной layout | Выравнивание channel | Выравнивание H\*W |
|---|---|---|---|---|---|
| RV1103/RV1106 | int8 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 32; прочие операторы: кратно 16 | Кратно 4 |
| RV1103/RV1106 | int8 | 4 | NHWC | Нет | Нет |

## RK3562

| Платформа | Точность выхода модели | Размерность выхода | Выходной layout | Выравнивание channel | Выравнивание H\*W |
|---|---|---|---|---|---|
| RK3562 | int8 | 4 | NCHW | Нет | Нет |
| RK3562 | int8 | 4 | NHWC | Нет | Нет |
| RK3562 | int8 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 32; прочие операторы: кратно 16 | Кратно 4 |
| RK3562 | int8 | 4 | UNDEFINE | Нет | Нет |
| RK3562 | float16 | 4 | NCHW | Нет | Нет |
| RK3562 | float16 | 4 | NHWC | Нет | Нет |
| RK3562 | float16 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 16; прочие операторы: кратно 8 | Кратно 4 |
| RK3562 | float16 | 4 | UNDEFINE | Нет | Нет |
| RK3562 | Без ограничений | Не 4D | UNDEFINE | Нет | Нет |

## RK3576/RV1126B

| Платформа | Точность выхода модели | Размерность выхода | Выходной layout | Выравнивание channel | Выравнивание H\*W |
|---|---|---|---|---|---|
| RK3576/RV1126B | int8 | 4 | NCHW | Нет | Нет |
| RK3576/RV1126B | int8 | 4 | NHWC | Нет | Нет |
| RK3576/RV1126B | int8 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 32; прочие операторы: кратно 16 | Кратно 4 |
| RK3576/RV1126B | int8 | 4 | UNDEFINE | Нет | Нет |
| RK3576/RV1126B | float16 | 4 | NCHW | Нет | Нет |
| RK3576/RV1126B | float16 | 4 | NHWC | Нет | Нет |
| RK3576/RV1126B | float16 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 16; прочие операторы: кратно 8 | Кратно 4 |
| RK3576/RV1126B | float16 | 4 | UNDEFINE | Нет | Нет |
| RK3576/RV1126B | Без ограничений | Не 4D | UNDEFINE | Нет | Нет |

## RK2118

| Платформа | Точность выхода модели | Размерность выхода | Выходной layout | Выравнивание channel | Выравнивание H\*W |
|---|---|---|---|---|---|
| RK2118 | float16 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 8; прочие операторы: кратно 4 | Кратно 4 |
| RK2118 | float16 | 4 | NHWC | Нет | Нет |
| RK2118 | float16 | Не 4D | UNDEFINE | Нет | Нет |

## RV1103B/RV1106B

| Платформа | Точность выхода модели | Размерность выхода | Выходной layout | Выравнивание channel | Выравнивание H\*W |
|---|---|---|---|---|---|
| RV1103B/RV1106B | int8 | 4 | NC1HWC2 | Последний слой — свёртка: кратно 8; прочие операторы: кратно 8 | Кратно 4 |
| RV1103B/RV1106B | int8 | 4 | NHWC | Нет | Нет |

## Особые пояснения

## dilated\_kernel\_h

dilated\_kernel\_h = kernel\_h \* dilations\_h - dilations\_h + 1

## dilated\_kernel\_w

dilated\_kernel\_w = kernel\_w \* dilations\_w - dilations\_w + 1

{% endraw %}
