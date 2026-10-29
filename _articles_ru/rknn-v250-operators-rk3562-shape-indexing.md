---
title: "RKNN2 V2.5.0 · RK3562：Формы, срезы и транспонирование"
description: "RKNN2 V2.5.0 · RK3562：Формы, срезы и транспонирование · Полные параметры и ограничения операторов по оригиналу V2.5.0."
excerpt: "RKNN2 V2.5.0 · RK3562：Формы, срезы и транспонирование · Полные параметры и ограничения операторов по оригиналу V2.5.0."
translation_key: "rknn-v250-operators-rk3562-shape-indexing"
slug: "rknn-v250-operators-rk3562-shape-indexing"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RK3562"]
---

Этот справочник платформ RKNN2 V2.5.0 предназначен для разработчиков ArmSoM при выборе и адаптации моделей. Он не подтверждает поддержку на всех платах ArmSoM: проверьте SoC платы, фактические версии Toolkit2, Runtime, драйвера NPU и BSP. В оригинале не задана единая версия ядра Linux. Аппаратная проверка на ArmSoM не выполнялась.

Источник: предоставленные китайская и английская редакции RKNN2 Supported Operators and Constraints Reference V2.5.0, 374 и 384 страницы. Китайский текст следует китайской редакции; английский, русский и немецкий — английской. Ограничения платформ не объединяются. В английском PDF рисунки и таблицы I/O содержат китайские подписи; их происхождение сохранено, добавлены редактируемые локализованные таблицы. Написание ConvTranpose и исходные уравнения LSTM/GRU сохранены; эти формулы не являются исправлениями реализации SDK.

Страницы источника: CN 151–163; EN 155–168.

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

**RKNN2 V2.5.0 · RK3562：Формы, срезы и транспонирование**

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

[RKNN2 V2.5.0 · Ввод/вывод модели, выравнивание и ограничения свёрток](/ru/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Relu

Заменяет отрицательные значения входного тензора нулём, оставляя положительные без изменений.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Нет

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Clip/ReLU6

Ограничивает значения входного тензора диапазоном \[0,6\].

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Нет

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## PRelu

Масштабирует отрицательные значения входного тензора обучаемым параметром, оставляя положительные без изменений.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer/per-channel
    - Поддержка расширения размерностей
        - Нет

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer/per-channel

### Атрибуты

- slope: коэффициент PRelu.
    - Поддерживается только один скаляр или коэффициенты по размерности C.

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## LeakyRelu

Масштабирует отрицательные значения входного тензора фиксированным коэффициентом, оставляя положительные без изменений.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Нет

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Reshape

Возвращает тензор заданной формы, не изменяя входные данные и число элементов.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Атрибуты

- shape:int
    - Задаёт форму выходного тензора.

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Resize

Изменяет размер входного тензора. Обычно каждое выходное значение вычисляется как взвешенное среднее соседних значений (точек выборки) входного тензора.

### Входы

- X:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
- roi(optional):T2
    - Пока не поддерживается.
- scales(optional):T2
    - Массив коэффициентов масштабирования по каждой размерности.
- sizes(optional):T3
    - Целевой размер выходного тензора.

### Выходы

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)

### Атрибуты

- antialias:int (по умолчанию 0)
    - Настройка сейчас не поддерживается.
- axes:int\[\]
    - Настройка сейчас не поддерживается.
- coordinate\_transformation\_mode:strings (по умолчанию ”half\_pixel”)
    - Сейчас поддерживаются только half\_pixel, pytorch\_half\_pixel и align\_corners.
- cubic\_coeff\_a: float (по умолчанию -0.75)
    - Настройка сейчас не поддерживается.
- exclude\_outside:int (по умолчанию 0)
    - Настройка сейчас не поддерживается.
- extrapolation\_value:float (по умолчанию 0)
    - Настройка сейчас не поддерживается.
- keep\_aspect\_ratio\_policy:strings (по умолчанию ”stretch”)
    - Настройка сейчас не поддерживается.
- mode:strings (по умолчанию ”nearest”)
    - Сейчас можно настроить только nearest и linear.
- nearest\_mode:strings (по умолчанию ”round\_prefer\_floor”)
    - Настройка пока не поддерживается. Примечание о поддержке: сейчас поддерживается только целочисленное масштабирование по ширине и высоте с множителем 2–8. Вход (1,c,1,1) можно увеличить до (1,c,h,w).

## Slice

Получает срез текущего вектора по правилам срезов NumPy.

### Входы

- input\_tensor:T
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Выходы

- output:T
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T:int8(Tensor),float16(Tensor)

### Атрибуты

- starts:int(Tensor)
    - Начальная позиция среза: без ограничений.
- ends:int(Tensor)
    - Конечная позиция среза: без ограничений.
- axes:int(Tensor)
    - Выбор осей среза: любые оси 0~3, включая несколько одновременно.
- steps:int(Tensor)
    - Выбирает шаг по соответствующей оси среза.
    - При height\*width==1&amp;&amp;channel%subc==0&amp;&amp;starts\[1\]%subc==0&amp;&amp;ends\[1\]%subc==0&amp;&amp;steps\[1\]&lt;=subc значения steps могут отличаться от 1. Иначе SliceOP может выполняться на NPU только при steps==\[1,1,1,1\].

## Softmax

Оператор вычисляет нормализованные экспоненциальные значения входа:

Softmax(input, axis) = exp(input − max(input, axis)) / Σ\_axis exp(input − max(input, axis))

Атрибут “axis” задаёт размерность вычисления Softmax. Выходной тензор имеет ту же форму и содержит значения Softmax соответствующего входа.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
        - Действуют ограничения спецификации transpose.

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Атрибуты

- axis:int
    - Ось softmax:1,3, то есть channel и width.

## exSoftmax13

Оператор вычисляет нормализованные экспоненциальные значения входа:

exSoftmax13(input, axis) = exp(input − max(input, axis)) / Σ\_axis exp(input − max(input, axis))

Атрибут “axis” задаёт размерность вычисления Softmax. Выходной тензор имеет ту же форму и содержит значения Softmax соответствующего входа.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
        - Действуют ограничения спецификации transpose.

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Атрибуты

- axis:int64
    - Ось softmax:1,3, то есть channel и width.

## exSoftmaxMask

Оператор вычисляет нормализованные экспоненциальные значения входа:

```text
input(x, mask_t, mask_value) =
    x + (mask_t - 1) * inf       if mask_value = 0
    x + mask_t * (-inf)          elif mask_value = 1
```

```text
exSoftmaxMask(input, axis) = exp(input - max(input, axis)) / Σ_axis(exp(input - max(input, axis)))
```

Атрибут “axis” задаёт размерность вычисления Softmax. Выходной тензор имеет ту же форму и содержит значения Softmax соответствующего входа.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
        - Действуют ограничения спецификации transpose.
- mask(optional):T1
    - shape:\[1,channel,height,width\]
        - channel∈(0,8192\]
        - width: при axis=1 ограничений нет; при axis=3/-1 width∈(0,8192\].

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Атрибуты

- axis:int64
    - Ось softmax:1,3, то есть channel и width.
- mask\_value:int64
    - Значения для mask:0,1.

## Split

Делит вектор вдоль axis на num\_outputs векторов; split задаёт размеры результатов вдоль axis.

### Входы

- input\_tensor:T
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Выходы

- output:T
    - Один или несколько выходных векторов согласно num\_outputs.
    - shape: определяется разбиением.
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T:int8(Tensor),float16(Tensor)

### Атрибуты

- axis:int
    - axis∈{0,1,2,3}
- num\_outputs:int
- split:int(Tensor)

## Sub

- Выполняет поэлементное двоичное вычитание (C=A-B) с многонаправленным broadcasting в стиле NumPy.

### Входы

- A:T1,T2
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - \[b,c,1,1\]
        - \[scalar\]
- B:T1,T2
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - \[b,c,1,1\]
        - \[scalar\]

### Выходы

- C:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)

## Tile

Создаёт тензор повторением заданного тензора, как функция NumPy tile, но без расширения размерностей.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
- repeats:T2
    - shape:\[batch,channel,height,width\]

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)

## Transpose

Транспонирует входной тензор.

### Входы

- X:T1
    - shape:\[n1,c1,h1,w1\]
        - Подробные ограничения приведены в списке атрибутов.
    - Поддержка квантования
        - per-layer

### Выходы

- Y:T1,T2
    - shape:\[n2,c2,h2,w2\]
        - Подробные ограничения приведены в списке атрибутов.
    - Поддержка квантования
        - per-layer

### Атрибуты

- perm, порядок транспонируемых осей: ограничения для разных perm приведены ниже (p=268435456,q=65536).
    - perm=\[0,1,2,3\]
        - Без ограничений
    - perm=\[0,1,3,2\]
        - T1:h1%16=0,h1w1&lt;16p,h1w1&lt;2q
        - T2:h1%8=0,h1w1&lt;8p,h1w1&lt;2q
    - perm=\[0,2,3,1\]
        - T1:c1&lt;8192,h1w1%8=0,w1c1&lt;p\*16
        - T2:c1&lt;8192,h1w1%8=0,w1c1&lt;p\*8
    - perm=\[0,2,1,3\]
        - T1:h1%16=0,h1w1&lt;16p,h1w1&lt;2q,c1\*w1&lt;p
        - T2:h1%8=0,h1w1&lt;8p,h1w1&lt;2q,c1\*w1&lt;p
    - perm=\[0,3,1,2\]
        - T1,T2:h1w1&lt;p,w1&lt;8192,h1c1&lt;p
    - perm=\[0,3,2,1\]
        - T1:h1%16=0,h1w1&lt;16p,h1w1&lt;2q,c1&lt;p\*16
        - T2:h1%8=0,h1w1&lt;8p,h1w1&lt;2q,c1&lt;p\*8
    - perm=\[1,0,2,3\]
        - T1:h1w1&lt;16p,n1&lt;8192,h1\*w1&lt;p
        - T2:h1w1&lt;8p,n1&lt;8192,h1\*w1&lt;p
    - perm=\[1,0,3,2\]
        - T1:h1%16=0,c1h1w1&lt;16p,h1w1&lt;2\*q
        - T2:h1%8=0,c1h1w1&lt;8p,h1w1&lt;2\*q
    - perm=\[1,2,0,3\]
        - T1:n1w1&lt;p16,c1h1w1&lt;p,w1%16=0
        - T2:n1w1&lt;p8,c1h1w1p,w1%8=0
    - perm=\[1,2,3,0\]
        - T1:h1w1&lt;p,n1&lt;p16,c1h1w1&lt;p16,n1w1&lt;p\*16
        - T2:h1w1&lt;p,n1&lt;p8,c1h1w1&lt;p8,n1w1&lt;p\*8
    - perm=\[1,3,0,2\]
        - T1:c1w1&lt;8192,n1h1&lt;p,w1%16=0
        - T2:c1w1&lt;8192,n1h1&lt;p,w1%8=0
    - perm=\[1,3,2,0\]
        - T1:c1h1w1&lt;p,n1\*h1&lt;p,w1&lt;8192,w1%16=0
        - T2:c1h1w1&lt;p,n1\*h1&lt;p,w1&lt;8192,w1%8=0
    - perm=\[2,1,0,3\]
        - T1,T2:c1&lt;8192,c1h1w1&lt;p,n1\*w1&lt;p
    - perm=\[2,1,3,0\]
        - T1:c1h1w1&lt;p,n1w1&lt;p16,c1&lt;8192,n1\*w1%4=0
        - T2:c1h1w1&lt;p,n1w1&lt;p8,c1&lt;8192,n1\*w1%4=0
    - perm=\[2,0,3,1\]
        - T1,T2:c1&lt;8192,c1h1w1&lt;p
    - perm=\[2,0,1,3\]
        - T1:n1c1h1w1&lt;p,h1w1%16=0
        - T2:n1c1h1w1&lt;p,h1w1%8=0
    - perm=\[2,3,1,0\]
        - T1:c1h1w1&lt;p,n1c1&lt;p,h1w1&lt;8192,h1\*w1%16=0
        - T2:c1h1w1&lt;p,n1c1&lt;p,h1w1&lt;8192,h1\*w1%8=0
    - perm=\[2,3,0,1\]
        - T1,T2:h1w1&lt;8192,n1c1&lt;p
    - perm=\[3,0,2,1\]
        - T1:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1\*w1%16=0
        - T2:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1\*w1%8=0
    - perm=\[3,0,1,2\]
        - T1:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1h1w1%16=0
        - T2:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1h1w1%8=0
    - perm=\[3,2,0,1\]
        - T1,T2:h1w1&lt;p,n1c1&lt;8192,n1c1w1&lt;p
    - perm=\[3,2,1,0\]
        - T1:c1h1w1&lt;p,h1w1&lt;8192,2h1w1&lt;q,n1c1&lt;p\*16,h1%16=0
        - T2:c1h1w1&lt;p,h1w1&lt;8192,2h1w1&lt;q,n1c1&lt;p\*8,h1%8=0
    - perm=\[3,1,0,2\]
        - T1,T2:h1w1&lt;p,c1w1&lt;8192,n1\*h1&lt;p
    - perm=\[3,1,2,0\]
        - T1,T2:h1w1&lt;p,n1c1&lt;8192,n1h1&lt;p,n1c1\*w1&lt;p

### Ограничения типов данных

- T1:int8(Tensor)
- T2:int16(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.
{% endraw %}
