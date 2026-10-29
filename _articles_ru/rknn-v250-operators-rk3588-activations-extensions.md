---
title: "RKNN2 V2.5.0 · RK3588：Активации, нормализация и расширения"
description: "RKNN2 V2.5.0 · RK3588：Активации, нормализация и расширения · Полные параметры и ограничения операторов по оригиналу V2.5.0."
excerpt: "RKNN2 V2.5.0 · RK3588：Активации, нормализация и расширения · Полные параметры и ограничения операторов по оригиналу V2.5.0."
translation_key: "rknn-v250-operators-rk3588-activations-extensions"
slug: "rknn-v250-operators-rk3588-activations-extensions"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RK3588"]
---

Этот справочник платформ RKNN2 V2.5.0 предназначен для разработчиков ArmSoM при выборе и адаптации моделей. Он не подтверждает поддержку на всех платах ArmSoM: проверьте SoC платы, фактические версии Toolkit2, Runtime, драйвера NPU и BSP. В оригинале не задана единая версия ядра Linux. Аппаратная проверка на ArmSoM не выполнялась.

Источник: предоставленные китайская и английская редакции RKNN2 Supported Operators and Constraints Reference V2.5.0, 374 и 384 страницы. Китайский текст следует китайской редакции; английский, русский и немецкий — английской. Ограничения платформ не объединяются. В английском PDF рисунки и таблицы I/O содержат китайские подписи; их происхождение сохранено, добавлены редактируемые локализованные таблицы. Написание ConvTranpose и исходные уравнения LSTM/GRU сохранены; эти формулы не являются исправлениями реализации SDK.

Страницы источника: CN 110–125; EN 113–128.

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

**RKNN2 V2.5.0 · RK3588：Активации, нормализация и расширения**

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

[RKNN2 V2.5.0 · Ввод/вывод модели, выравнивание и ограничения свёрток](/ru/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Sigmoid

Функция y=1/(1+exp(-x)) применяется поэлементно к входному тензору для получения выходного тензора.

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

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Tanh

Вычисляет гиперболический тангенс элементов входного тензора.

### Входы

- X:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования: per-layer

### Выходы

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования: per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Softplus

Поэлементно применяет Softplus, y=ln(exp(x)+1).

### Входы

- X:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования: per-layer

### Выходы

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования: per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## HardSigmoid

Функция y=max(0,min(1,alpha\*x+beta)) применяется поэлементно к входному тензору для получения выходного тензора, где alpha=1/6, beta=0.5.

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

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## HardSwish

Функция y = x \* max(0, min(1, alpha \* x + beta)) = x \* HardSigmoid(x) применяется поэлементно к входному тензору для получения выходного тензора, где alpha=1/6, beta=0.5.

### Входы

- X:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования: per-layer

### Выходы

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования: per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Elu

Функция f(x)=alpha\*(exp(x)-1.) for x&lt;0; f(x)=x for x&gt;=0 применяется поэлементно к входному тензору для получения выходного тензора, где alpha=1.

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

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## exSwish

Поэлементно применяет линейный блок Sigmoid. Swish также называется SiLU: y=x\*sigmoid(x).

### Входы

- X:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования: per-layer

### Выходы

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования: per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## exMish

Функция mish(x)=xtanh(softplus(x))=xtanh(ln(1+e^{x})) применяется поэлементно к входному тензору для получения выходного тензора.

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

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## exGelu

Функция y = x\*Φ(x) применяется поэлементно к входному тензору для получения выходного тензора. При выборе tanh для Φ(x): y = 0.5\*x\*(1+Tanh(sqrt(2/π)\*(x+0.044715\*x^3))).

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

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## exSwooshR

К входному тензору поэлементно применяется следующая функция из статьи https://arxiv.org/abs/2310.11230 для получения выходного тензора: SwooshR(x)=log(1+exp(x−1))−0.08x−0.313261687

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

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## exSwooshL

К входному тензору поэлементно применяется следующая функция из статьи https://arxiv.org/abs/2310.11230 для получения выходного тензора: SwooshL(x)=log(1+exp(x−4))−0.08x−0.035

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

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Where

Выбирает значения x\_tensor или y\_tensor по mask\_tensor: при True берётся соответствующее значение x\_tensor, иначе y\_tensor.

### Входы

- mask\_tensor:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка расширения размерностей
        - Поддерживается расширение по любой размерности.
    - Ограничения расширения размерностей
        - Ограничения расширения совпадают с оператором Expand.
- x\_tensor:\*T2
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Поддерживается расширение по любой размерности.
    - Ограничения расширения размерностей
        - Ограничения расширения совпадают с оператором Expand.
- y\_tensor:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Поддерживается расширение по любой размерности.
    - Ограничения расширения размерностей
        - Ограничения расширения совпадают с оператором Expand.

### Выходы

- output:T2
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:bool(Tensor)
- T2:int8(Tensor),float16(Tensor)

## exConvStreaming

Для снижения задержки речевых моделей вход исходной свёртки делится на временные фрагменты. Каждый фрагмент обрабатывается свёрткой, а результаты кэшируются для следующих кадров, обеспечивая потоковую обработку аудио.

### Входы

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: сейчас поддерживается width=1.
    - Поддержка квантования
        - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,31\]
        - kernel\_w∈\[1,31\]
    - Поддержка квантования
        - per-layer
        - per-channel

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Атрибуты

- strides:int(strides\_h,strides\_w)
    - stride\_h∈\[1,7\]
    - stride\_w∈\[1,7\]
- pads:int(pads\_top,pads\_left,pads\_bottom,pads\_right)
    - pads\_top∈\[0,15\]
    - pads\_left∈\[0,15\]
    - pads\_bottom∈\[0,15\]
    - pads\_right∈\[0,15\]
- group:int
- dilations:int(dilations\_h,dilations\_w)
    - dilations\_h∈\[1,32\]
    - dilations\_w∈\[1,32\]

### Ограничения типов данных

- T1:float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## exConvStreamingPRelu/LeakyRelu

Объединённое вычисление exConvStreaming и PRelu/LeakyRelu, Output = PRelu(exConvStreaming(Input)) или Output= LeakyRelu(exConvStreaming(Input)). Описание и ограничения спецификации совпадают с exConvStreaming.

## exGlu

Функция управляемого линейного блока (Gated Linear Unit), где a — первая половина входной матрицы, b — вторая: GLU(a,b)=a⊗σ(b).

### Входы

- Input:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования: per-layer

### Выходы

- Output:T1
    - shape:\[batch,channel/2,height,width\]
    - Поддержка квантования: per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Атрибуты

- axis:int(по умолчанию=1)
    - Размерность разделения входа.
    - Ограничение: поддерживается только 1.

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## exMatMul

Матричное умножение

```text
Y = A·B + C    if c_type = "add"
Y = A·B * C    if c_type = "mul"
```

### Входы

- A:T1
    - shape:\[b,k,1,n\]
        - k ∈(0,8192\]
    - Поддержка квантования
        - per-layer
- B:T1
    - shape:\[b,k,1,m\]
    - Поддержка квантования
        - per-layer
- C(optional):T1,T2
    - shape:\[b,n,1,m\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Поддерживается расширение по любой размерности.
        - Ограничения расширения совпадают с оператором Expand.

### Выходы

- Y:T1
    - shape:\[b,n,1,m\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)

### Атрибуты

- c\_type:strings(по умолчанию “add”)
    - Выбор add или mul задаёт сложение или умножение с C.

### Прочие возможности

- Совместная работа нескольких ядер: не поддерживается.

## exNorm

Выполняет различные операции нормализации входных данных. Поддерживаются три типа: LayerNormalization, RMSNormalization и MeanVarianceNormalization:

```text
LayerNorm(x) = ((x - μ) / sqrt(σ^2 + ε)) * W + B
```

```text
RMSNorm(x) = (x / sqrt(RMS^2 + ε)) * W + B
```

```text
MeanVarianceNorm(x) = ((x - μ) / sqrt(Variance + ε)) * W + B
```

Здесь x — входной вектор. µ и σ2 — его среднее и дисперсия:

```text
μ = (1/H) * Σ[i=1..H](x_i)
```

```text
σ^2 = (1/H) * Σ[i=1..H]((x_i - μ)^2)
```

RMS — среднеквадратичное значение входного вектора:

```text
RMS = sqrt((1/H) * Σ[i=1..H](x_i^2))
```

Variance — эквивалентная дисперсия входного вектора:

```text
Variance = (1/H) * Σ[i=1..H](x_i^2) - μ^2
```

ϵ — малое число для предотвращения деления на ноль. W и B — необязательные параметры.

### Входы

- X:T1
    - shape:\[batch,channel,height,width\]
- W(optional):T1
    - shape:\[batch,channel,height,width\]
- B(optional):T1
    - shape:\[batch,channel,height,width\]

### Выходы

- Y:T1
    - shape:\[batch,channel,height,width\]

### Ограничения типов данных

- T1:float16(Tensor)

### Атрибуты

- epsilon: float (по умолчанию 1e-05)
    - Значение epsilon для предотвращения деления на 0.
- mode:string
    - Доступны три режима Normalization: layer, rms и mean\_var.
- axes:int64\[\](по умолчанию \[1\])
    - Оси нормализации: сейчас поддерживаются только \[1\] и \[1,2,3\].

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## exSDPAttention

Вычисляет масштабированное скалярное внимание (SDPA) между query, key и value.

### Входы

- query:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
    - Поддержка квантования
        - per-layer
- key:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
- value:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
    - Поддержка квантования
        - per-layer
- mask(optional):T1,T2
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Поддерживается расширение по любой размерности.
- scale(optional):T3

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

### Прочие возможности

- Совместная работа нескольких ядер: не поддерживается.

## exWindow

exWindow основан на window\_partition и window\_reverse из swin\_transformer. В исходной статье входные признаки делятся на непересекающиеся окна window\_size×window\_size. Входные и выходные признаки должны иметь 4-мерный shape с разбиением по высоте и ширине. Ниже реализация PyTorch:

```python
def window_partition(x, window_size):
    """
    Args:
        x: (B, C, H, W)
        window_size (int): window size
    Returns:
        windows: (B, C, num_windows * num_windows, window_size * window_size)
    """
    B, C, H, W = x.shape
    x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
    windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size * window_size)
    return windows

def window_reverse(windows, window_size, H, W):
    """
    Args:
        windows: (B, C, num_windows * num_windows, window_size * window_size)
        window_size (int): Window size
        H (int): Height of image
        W (int): Width of image
    Returns:
        x: (B, C, H, W)
    """
    B, C, _, _ = windows.shape
    x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
    x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
    return x
```

### Входы

- X:T1
    - shape:\[batch,channel,height,width\]

### Выходы

- Y:T1
    - shape:\[batch,channel,height,width\]

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Атрибуты

- mode:string
    - Поддерживаемые режимы:partition,reverse,partition\_num\_first.
        - partition: см. реализацию window\_partition.
        - reverse: см. реализацию window\_reverse.
        - partition\_num\_first отличается от partition тем, что H,W делятся согласно num\_windows, тогда как partition делит H,W согласно window\_sizes.
- window\_sizes:listofints
    - 2-мерный вектор размера окна, задающий высоту и ширину каждого окна. На этом размере основаны вычисление внимания и извлечение признаков внутри окна.
- num\_windows:listofints
    - 2-мерный вектор числа окон, задающий количество окон по высоте и ширине входных признаков.

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.
{% endraw %}
