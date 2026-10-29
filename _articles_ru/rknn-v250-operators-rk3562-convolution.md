---
title: "RKNN2 V2.5.0 · RK3562：Основы и свёртки"
description: "RKNN2 V2.5.0 · RK3562：Основы и свёртки · Полные параметры и ограничения операторов по оригиналу V2.5.0."
excerpt: "RKNN2 V2.5.0 · RK3562：Основы и свёртки · Полные параметры и ограничения операторов по оригиналу V2.5.0."
translation_key: "rknn-v250-operators-rk3562-convolution"
slug: "rknn-v250-operators-rk3562-convolution"
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

Страницы источника: CN 125–134; EN 128–138.

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

**RKNN2 V2.5.0 · RK3562：Основы и свёртки**

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

## RK3562

## Add

Выполняет поэлементное бинарное сложение (C=A+B) с многомерным расширением по правилам NumPy.

### Входы

- A:T1,T2
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Поддерживается расширение по любой размерности.
        - Ограничения расширения совпадают с оператором Expand.
- B:T1,T2
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Поддерживается расширение по любой размерности.
        - Ограничения расширения совпадают с оператором Expand.

### Выходы

- C:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)

## AddRelu

Объединённое вычисление Add и Relu, C=Relu(A+B).

### Входы

- Как у Add.

### Выходы

- Как у Add.

### Прочие возможности

- Совместная работа нескольких ядер: поддерживается.

## BatchNormalization

Выполняет пакетную нормализацию входного тензора согласно https://arxiv.org/abs/1502.03167.

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

- epsilon: float (значение по умолчанию = 1e-5)
    - Вещественное число, добавляемое при делении на стандартное отклонение для предотвращения деления на 0.
    - epsilon∈(0,∞\]
- momentum:float
    - Параметр скользящего среднего при обучении.

## Concat

Объединяет последовательность векторов в один вдоль axis. Размеры всех векторов вне axis должны совпадать.

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

- axisint64
    - axis∈{0,1,2,3}

## Свёртка

Свёртка

### Входы

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: при dilated\_kernel\_h&gt;1 требуется width&lt;16383. Дополнительные ограничения ширины входа первого слоя см. в описании входов модели.
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
    - dilations\_h∈\[1,31\]
    - dilations\_w∈\[1,31\]

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

## Depthwise Convolution

Разделимая свёртка по глубине

### Входы

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: при dilated\_kernel\_h&gt;1 требуется width&lt;16383. Дополнительные ограничения ширины входа первого слоя см. в описании входов модели.
    - Поддержка квантования
        - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,8\]
        - kernel\_w∈\[1,8\]
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

- T1:int8(Tensor),float16(Tensor)

## ConvolutionRelu

Объединённое вычисление Convolution и Relu, Output=Relu(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionClip

Объединённое вычисление Convolution и Clip, Output=Clip(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionPRelu/LeakyRelu

Объединённое вычисление Convolution и PRelu/LeakyRelu, Output = PRelu(Conv(Input)) или Output = LeakyRelu(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionAdd

Объединённое вычисление Convolution и Add, Output=Add(Conv(Input0),Input1). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionSigmoid

Объединённое вычисление Convolution и Sigmoid, Output=Sigmoid(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionTanh

Объединённое вычисление Convolution и Tanh, Output=Tanh(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionSoftplus

Объединённое вычисление Convolution и Softplus, Output=Softplus(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionHardSigmoid

Объединённое вычисление Convolution и HardSigmoid, Output=HardSigmoid(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionHardSwish

Объединённое вычисление Convolution и HardSwish, Output=HardSwish(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionElu

Объединённое вычисление Convolution и Elu, Output=Elu(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionSwish

Объединённое вычисление Convolution и Swish, Output=Swish(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionMish

Объединённое вычисление Convolution и Mish, Output=Mish(Conv(Input)). Описание и ограничения спецификации совпадают с Convolution.

## ConvolutionAddRelu

Объединённое вычисление Convolution и Add и Relu, Output=Relu(Add(Conv(Input0),Input1)). Описание и ограничения спецификации совпадают с Convolution.

## ConvTranspose

Транспонированная свёртка

### Входы

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: при dilated\_kernel\_h&gt;1 требуется width&lt;16383. Дополнительные ограничения ширины входа первого слоя см. в описании входов модели.
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
    - stride\_h∈\[1,8\]
    - stride\_w∈\[1,8\]
- pads:int(pads\_top,pads\_left,pads\_bottom,pads\_right). При задании pad не поддерживаются: kernel\_hdilations\_h-dilations\_h-pads\_top&lt;0; kernel\_wdilations\_w-dilations\_w-pads\_left&lt;0; stride\_h(height-1)-pads\_top+1&lt;output\_h; stride\_w(width-1)-pads\_left+1&lt;output\_w.
    - pads\_top∈\[0,15\]
    - pads\_left∈\[0,15\]
    - pads\_bottom∈\[0,15\]
    - pads\_right∈\[0,15\]
- group:int
    - group: поддерживается только 1; num\_output поддерживается тогда и только тогда, когда num\_input=num\_output.
- dilations:int(dilations\_h,dilations\_w)
    - dilations\_h∈\[1,32\]
    - dilations\_w∈\[1,32\]
    - Если dilation не равно (1,1), поддерживается только kernel=(1,1).

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

## ConvTranposeRelu

Объединённое вычисление ConvTranspose и Relu, Output=Relu(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposeClip

Объединённое вычисление ConvTranspose и Clip, Output=Clip(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposePRelu/LeakyRelu

Объединённое вычисление ConvTranspose и PRelu/LeakyRelu, Output=PRelu(ConvTranspose(Input)) или Output= LeakyRelu(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposeAdd

Объединённое вычисление ConvTranspose и Add, Output=Add(ConvTranspose(Input0),Input1). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposeSigmoid

Объединённое вычисление ConvTranspose и Sigmoid, Output=Sigmoid(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposeTanh

Объединённое вычисление ConvTranspose и Tanh, Output=Tanh(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposeSoftplus

Объединённое вычисление ConvTranspose и Softplus, Output=Softplus(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposeHardSigmoid

Объединённое вычисление ConvTranspose и HardSigmoid, Output=HardSigmoid(ConvTranspose(Input)).

## ConvTranposeHardSwish

Объединённое вычисление ConvTranspose и HardSwish, Output=HardSwish(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposeElu

Объединённое вычисление ConvTranspose и Elu, Output=Elu(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposeSwish

Объединённое вычисление ConvTranspose и Swish, Output=Swish(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

## ConvTranposeMish

Объединённое вычисление ConvTranspose и Mish, Output=Mish(ConvTranspose(Input)). Описание и ограничения спецификации совпадают с ConvTranspose.

{% endraw %}
