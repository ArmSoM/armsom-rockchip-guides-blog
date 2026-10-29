---
title: "RKNN2 V2.5.0 · RK3588：Рекуррентные сети, арифметика и пулинг"
description: "RKNN2 V2.5.0 · RK3588：Рекуррентные сети, арифметика и пулинг · Полные параметры и ограничения операторов по оригиналу V2.5.0."
excerpt: "RKNN2 V2.5.0 · RK3588：Рекуррентные сети, арифметика и пулинг · Полные параметры и ограничения операторов по оригиналу V2.5.0."
translation_key: "rknn-v250-operators-rk3588-recurrent-pooling"
slug: "rknn-v250-operators-rk3588-recurrent-pooling"
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

Страницы источника: CN 79–97; EN 82–100.

[Rockchip RKNN2](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<details markdown="1">
<summary>Серия справочников операторов</summary>

[RKNN2 V2.5.0 · RK3566/RK3568：Основы и свёртки](/ru/articles/rknn-v250-operators-rk3566-rk3568-convolution/)

[RKNN2 V2.5.0 · RK3566/RK3568：Рекуррентные сети, арифметика и пулинг](/ru/articles/rknn-v250-operators-rk3566-rk3568-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3566/RK3568：Формы, срезы и транспонирование](/ru/articles/rknn-v250-operators-rk3566-rk3568-shape-indexing/)

[RKNN2 V2.5.0 · RK3566/RK3568：Активации, нормализация и расширения](/ru/articles/rknn-v250-operators-rk3566-rk3568-activations-extensions/)

[RKNN2 V2.5.0 · RK3588：Основы и свёртки](/ru/articles/rknn-v250-operators-rk3588-convolution/)

**RKNN2 V2.5.0 · RK3588：Рекуррентные сети, арифметика и пулинг**

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

[RKNN2 V2.5.0 · Ввод/вывод модели, выравнивание и ограничения свёрток](/ru/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Div

Выполняет поэлементное бинарное деление (C=A/B) с многомерным расширением по правилам NumPy.

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

- T1:float16(Tensor)
- T2:float(constTensor)

### Прочие возможности

- Совместная работа нескольких ядер: не поддерживается.

## Expand

Расширяет входной тензор по заданным shape и правилам, подобно numpy.array(input) \*numpy.ones(shape): размерности выравниваются справа; соответствующие размерности должны совпадать либо одна из них должна быть 1.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
- shape:T2
    - shape:\[batch,channel,height,width\]

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)

Ограничения расширения размерностей

- \[b,c,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,1,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,c,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,1,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,c,1,1\]-&gt;\[b,c,h,w\],h∈\[1,8192\],w ∈\[1,8192\]

### Прочие возможности

- Совместная работа нескольких ядер: не поддерживается.

## GRU

Управляемый рекуррентный блок (GRU). Расширения и варианты GRU называются операторами exGRU. Параметры с пометкой (extern) относятся только к exGRU. Формулы вычисления: 

```text
Equations(Default:f=Sigmoid,g=Tanh):
r_t = f(x_t · W_r + h_{t−1} · R_r + Wb_r + Rb_r)
z_t = f(x_t · W_z + h_{t−1} · R_z + Wb_z + Rb_z)
h_t = g(x_t · W_h + (r_t ⊙ h_{t−1}) · R_h + Rb_h + Wb_h), (WRB=0)
h_t = g(x_t · W_h + r_t ⊙ (h_{t−1} · R_h + Rb_h)) + Wb_h, (WRB=1)
H_t = (1 − z_t) ⊙ h_t + z_t ⊙ h_{t−1}
```

### Входы

- X:T1
    - shape:\[seq\_length,batch\_size,input\_size\]
        - seqlength∈(0,8192\]
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - inputsize∈(0,8192\]
    - Поддержка квантования
        - per-layer
- W:T1
    - shape:\[num\_directions,4\*hidden\_size,input\_size\]
        - inputsize∈(0,8192\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Поддержка квантования
        - per-layer
        - per-channel
- R:T1
    - shape:\[num\_directions,4\*hidden\_size,hidden\_size\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Поддержка квантования
        - per-layer
        - per-channel
- B:T2
    - shape:\[num\_directions,8\*hidden\_size\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Поддержка квантования
        - per-layer
        - per-channel
- sequence\_lens:T3(optional)
    - shape:\[batch\_size\]
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
- initial\_h:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - hiddensize∈(0,8192\]
    - Поддержка квантования
        - per-layer

### Выходы

- Y:T1
    - shape:\[seq\_length,num\_directions,batch\_size,hidden\_size\]
        - seqlength∈(0,8192\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - hiddensize∈(0,8192\]
    - Поддержка квантования
        - per-layer
- Y\_h:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - hiddensize∈(0,8192\]
    - Поддержка квантования
        - per-layer

### Атрибуты

- linear\_before\_reset:int
    - Выбор варианта LBR:1(T) или 0(F).
- direction(extern):string
    - Задаёт направление вычисления GRU.
    - forward: прямое направление GRU.
    - reverse: обратное направление GRU.
    - bidirectional: двунаправленное вычисление GRU.
- sequence\_size(extern):int
    - Задаёт seqsize входа GRU; без ограничений, рекомендуется выравнивание по 4.
- hidden\_size(extern):int
    - hiddensize блока GRU; без ограничений, рекомендуется выравнивание по 8.
- input\_layout(extern):int
    - Задаёт layout, соответствующий смыслу shape данного входа.
    - Необходимо задать указанный layout и фактические параметры оператора: batch\_size, sequence\_size, hidden\_size.
    - snc: входной shape данного layout — \[seqs,batches,input\_size\].
    - (sn)c: входной shape данного layout — \[seqs\*batches,input\_size,1,1\].
- output\_layout(extern):int
    - Задаёт layout, соответствующий смыслу shape данного выхода.
    - Необходимо задать указанный layout и фактические параметры оператора: batch\_size, sequence\_size, hidden\_size, directions.
    - sbnc: выходной shape данного layout — \[seqs,directions,batches,hidden\_size\].
    - (sn)c: выходной shape данного layout — \[seqsbatches,directionsinput\_size,1,1\].

### Ограничения типов данных

- T1:float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Gather

Выбирает по Indices элементы входа X вдоль заданной axis и объединяет их.

### Входы

- X:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
- Indices:T2
    - Индексы выбираемых элементов; rank =1.

### Выходы

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:int(Tensor)

### Атрибуты

- axis:int(Tensor)
    - axis∈{0,1,2,3}
    - Задаёт размерность входа, из которой выбирает Indices.

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Hardmax

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
        - axis=1, height∗width&lt;16384;
        - axis=3/-1, channel∗height&lt;16384; также действуют ограничения спецификации transpose.

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Атрибуты

- axis:int
    - Ось hardmax: 1,3/-1, то есть направления channel и width.

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## LSTM

Сеть долгой краткосрочной памяти (LSTM). Расширения и варианты LSTM называются операторами exLSTM. Параметры с пометкой (extern) относятся только к exLSTM. Формулы вычисления: 

```text
Equations(Default:f=Sigmoid,g=Tanh,h=Tanh):
i_t = f(x_t · W_i + h_{t−1} · R_i + Wb_i + Rb_i)
f_t = f(x_t · W_f + h_{t−1} · R_f + Wb_f + Rb_f)
c_t = f(x_t · W_c + h_{t−1} · R_c + Wb_c + Rb_c)
o_t = f(x_t · W_o + h_{t−1} · R_o + Wb_o + Rb_o)
C_t = f_t ⊙ C_{t−1} + i_t ⊙ c_t
h_t = o_t ⊙ h(C_t)
```

### Входы

- X:T1
    - shape:\[seq\_length,batch\_size,input\_size\]
        - seqlength∈(0,8192\]
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - inputsize∈(0,8192\]
    - Поддержка квантования
        - per-layer
- W:T1
    - shape:\[num\_directions,4\*hidden\_size,input\_size\]
        - inputsize∈(0,8192\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Поддержка квантования
        - per-layer
        - per-channel
- R:T1
    - shape:\[num\_directions,4\*hidden\_size,hidden\_size\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Поддержка квантования
        - per-layer
        - per-channel
- B:T2,T3
    - shape:\[num\_directions,8\*hidden\_size\]
        - hiddensize∈(0,8192\]
        - numdirections:1or2
    - Поддержка квантования
        - per-layer
        - per-channel
- sequence\_lens:T4,T5(optional)
    - shape:\[batch\_size\]
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
- initial\_h:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - hiddensize∈(0,8192\]
    - Поддержка квантования
        - per-layer
- initial\_c:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - hiddensize∈(0,8192\]
    - Поддержка квантования
        - per-layer

### Выходы

- Y:T1
    - shape:\[seq\_length,num\_directions,batch\_size,hidden\_size\]
        - seqlength∈(0,8192\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - hiddensize∈(0,8192\]
    - Поддержка квантования
        - per-layer
- Y\_h:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - hiddensize∈(0,8192\]
    - Поддержка квантования
        - per-layer
- Y\_c:T1(optional)
    - shape:\[num\_directions,batch\_size,hidden\_size\]
        - numdirections:1or2
        - batchsize∈(0,8192\]; значения больше 1 должны быть кратны 4.
        - hiddensize∈(0,8192\]
    - Поддержка квантования
        - per-layer

### Атрибуты

- direction(extern):string
    - Задаёт направление вычисления LSTM.
    - forward: прямое направление LSTM.
    - reverse: обратное направление LSTM.
    - bidirectional: двунаправленное вычисление LSTM.
- sequence\_size(extern):int
    - Задаёт seqsize входа LSTM; без ограничений, рекомендуется выравнивание по 4.
- hidden\_size(extern):int
    - hiddensize блока LSTM; без ограничений, рекомендуется выравнивание по 8.
- proj\_size(extern):int
    - proj\_size при projection; projsize∈\[0,hiddensize\].
    - Сейчас допускается только 0; projection пока не поддерживается.
- input\_forget(extern):int
    - Выбор варианта cifg:1(T) или 0(F). Сейчас допускается только 0; вариант пока не поддерживается.
- has\_projection(extern):int
    - Вариант projection:1(T) или 0(F). Сейчас допускается только 0; вариант пока не поддерживается.
- input\_layout(extern):int
    - Задаёт layout, соответствующий смыслу shape данного входа.
    - Необходимо задать указанный layout и фактические параметры оператора: batch\_size, sequence\_size, hidden\_size.
    - snc: входной shape данного layout — \[seqs,batches,input\_size\].
    - (sn)c: входной shape данного layout — \[seqs\*batches,input\_size,1,1\].
- output\_layout(extern):int
    - Задаёт layout, соответствующий смыслу shape данного выхода.
    - Необходимо задать указанный layout и фактические параметры оператора: batch\_size, sequence\_size, hidden\_size, directions.
    - sbnc: выходной shape данного layout — \[seqs,directions,batches,hidden\_size\].
    - (sn)c: выходной shape данного layout — \[seqsbatches,directionsinput\_size,1,1\].

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int32(Tensor)
- T4:float(Scalar)
- T5:int(Scalar)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Max

Вычисляет поэлементный максимум входных тензоров.

### Входы

- A:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Поддерживается расширение по любой размерности.
        - Ограничения расширения совпадают с оператором Expand.
- B:T1
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
        - per-layer/per-channel

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Min

Вычисляет поэлементный минимум входных тензоров.

### Входы

- A:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
    - Поддержка расширения размерностей
        - Поддерживается расширение по любой размерности.
        - Ограничения расширения совпадают с оператором Expand.
- B:T1
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
        - per-layer/per-channel

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## Mul

Выполняет поэлементное бинарное умножение (C=A\*B) с многомерным расширением по правилам NumPy.

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

### Прочие возможности

- Совместная работа нескольких ядер: поддерживается.

## MulRelu

Объединённое вычисление Mul и Relu,C=Relu(A\*B).

### Входы

- Как у Mul.

### Выходы

- Как у Mul.

### Прочие возможности

- Совместная работа нескольких ядер: поддерживается.

## Pad

По тензору данных (data), тензору величин заполнения в начале/конце осей (pads), режиму (mode) и константе (constant\_value) создаёт дополненный тензор (output).

### Входы

- data:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
- pads:T2
    - shape : \[batch\_begin, channel\_begin, height\_begin, width\_begin, batch\_end, channel\_end,height\_end, width\_end\]
- constant\_value(optional):T3
    - shape:\[1\]
    - Поддержка квантования
        - per-layer

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)

### Атрибуты

- mode:string (по умолчанию constant)
    - Поддерживаемые режимы: constant,reflect.
        - constant: без ограничений.
        - reflectchannel∈(0,8192\],height∈(0,8192\],width∈(0,8176\]

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.

## MaxPool

MaxPool получает входной тензор X и выполняет максимальный пулинг согласно размеру ядра, шагу и длине pad. Для подмножеств входного тензора, заданных ядром, вычисляется максимум, а данные с пониженной дискретизацией помещаются в выходной тензор Y для дальнейшей обработки. Пространственный размер выхода зависит от явного заполнения (pads) либо автоматического (auto\_pad). Здесь используется только явное заполнение.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,8192\]
        - width∈(0,8192\]

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]

### Атрибуты

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - Способ pad: поддерживается только NOTSET.
- ceil\_mode:int64
    - Вычисление выходного shape через ceil или floor: не поддерживается.
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad, учитывать ли значения pad при вычислении:1.
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]
- storage\_order:int64
    - Приоритетный порядок хранения:0.

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## GlobalMaxPool

GlobalMaxPool применяет максимальный пулинг к значениям каждого канала входного тензора X. Это эквивалентно MaxPool с kernel\_shape, равным пространственным размерам input.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,7\]
        - width∈(0,7\]

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]

### Атрибуты

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - Способ pad: поддерживается только NOTSET.
- ceil\_mode:int64
    - Вычисление выходного shape через ceil или floor: не поддерживается.
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad, учитывать ли значения pad при вычислении:1.
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## AveragePool

AveragePool получает входной тензор X и выполняет усредняющий пулинг согласно размеру ядра, шагу и длине pad. Для подмножеств входного тензора, заданных ядром, вычисляется среднее всех значений, а данные с пониженной дискретизацией помещаются в выходной тензор Y для дальнейшей обработки. Пространственный размер выхода зависит от явного заполнения (pads) либо автоматического (auto\_pad). Здесь используется только явное заполнение.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,8192\]
        - width∈(0,8192\]

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]

### Атрибуты

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - Способ pad: поддерживается только NOTSET.
- ceil\_mode:int64
    - Вычисление выходного shape через ceil или floor: не поддерживается.
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad, учитывать ли значения pad при вычислении:1.
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## GlobalAveragePool

GlobalAveragePool применяет усредняющий пулинг к значениям каждого канала входного тензора X. Это эквивалентно AveragePool с kernel\_shape, равным пространственным размерам входного тензора.

### Входы

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,7\]
        - width∈(0,7\]

### Выходы

- output:T1
    - shape:\[batch,channel,height,width\]

### Атрибуты

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - Способ pad: поддерживается только NOTSET.
- ceil\_mode:int64
    - Вычисление выходного shape через ceil или floor: не поддерживается.
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad, учитывать ли значения pad при вычислении:1.
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## Pow

Возведение в степень Z = X^Y: принимает входные данные (тензор) и показатели степени и формирует один выходной тензор.

### Входы

- X:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer
- Y:T2
    - shape:\[1\]
        - В настоящее время поддерживаются только 0, 1, 2, 3, 0.5, -0.5.

### Выходы

- Z:T1
    - shape:\[batch,channel,height,width\]
    - Поддержка квантования
        - per-layer

### Ограничения типов данных

- T1:int8(Tensor),float16(Tensor)
- T2:int8(Tensor),int32(Tensor),int64(Tensor),float16(Tensor),float(Tensor)

### Прочие возможности

- Совместная работа нескольких ядер: ещё не поддерживается.
{% endraw %}
