---
title: "RKNN2 V2.5.0 · Поддержка и ограничения операторов GPU"
description: "RKNN2 V2.5.0 · Поддержка и ограничения операторов GPU · Полные параметры и ограничения операторов по оригиналу V2.5.0."
excerpt: "RKNN2 V2.5.0 · Поддержка и ограничения операторов GPU · Полные параметры и ограничения операторов по оригиналу V2.5.0."
translation_key: "rknn-v250-operators-gpu"
slug: "rknn-v250-operators-gpu"
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

Страницы источника: CN 367–367; EN 377–377.

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

**RKNN2 V2.5.0 · Поддержка и ограничения операторов GPU**

[RKNN2 V2.5.0 · Ввод/вывод модели, выравнивание и ограничения свёрток](/ru/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Спецификации операторов GPU

## Примечание:

- RV1106/RV1103/RV1106B/RV1103B/RV1126B/RK2118 не поддерживают операторы GPU.
- RK356X пока не поддерживает GridSample и exGelu.

## GridSample

- Описание: интерполяционная выборка.
- Ограничения спецификации: поддерживается только FP16; алгоритм интерполяции — только bilinear; padding\_mode — только zeros.

## GRU

- Описание: вентильный рекуррентный блок.
- Ограничения спецификации: hidden\_size должен быть кратен 4; input\_size и hidden\_size меньше 4 не поддерживаются.

## exGelu

- Описание: функция активации.
- Ограничения спецификации: в настоящее время поддерживается реализация Int8.
{% endraw %}
