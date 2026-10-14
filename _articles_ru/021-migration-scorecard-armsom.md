---
title: "Оценка миграции на ArmSoM: Sige5, Sige7, CM5 и Forge1"
description: "Выбор замены Raspberry Pi или Jetson Nano по интерфейсам, производительности, затратам на перенос ПО и охлаждение."
translation_key: "021-migration-scorecard-armsom"
slug: "migration-scorecard-armsom"
date: 2026-10-14
author: "ArmSoM Editorial"
category: migration
products: [Sige5, Sige7, CM5, Forge1]
tags: [migration, Sige5, Sige7, CM5, Forge1, Jetson Nano, Raspberry Pi]
keywords: "Оценка миграции на ArmSoM: Sige5, Sige7, CM5 и Forge1, Sige5, Sige7, CM5, Forge1"
lang: ru
---

# Оценка миграции на ArmSoM: Sige5, Sige7, CM5 и Forge1

![Карта оценки миграции на ArmSoM](../assets/021-migration-cost.svg)

Подходящая замена должна уменьшать общий инженерный риск. Сначала проверьте интерфейсы и ПО, затем используйте характеристики CPU/GPU/NPU как ограничения проекта, а не обещание производительности приложения.

## Четыре варианта платформы

- **Sige5 / RK3576:** готовая SBC, два Gigabit Ethernet, NPU 6 TOPS INT8, мультимедиа класса 4K, вход 5–23 V.
- **Sige7 / RK3588:** больший запас CPU и мультимедиа, до 32 GB памяти, кодеки класса 8K, более тщательная тепловая проверка.
- **CM5 / RK3576:** модуль 55 × 40 mm для собственного носителя; его проектирование становится главным риском.
- **Forge1 / RK3506J:** промышленное управление и HMI, 512 MB DDR3L, два 100 Mb Ethernet, RS485/CAN, диапазон -40 °C…85 °C.

Перед заказом серийных устройств используйте следующую рабочую схему:

```text
interface fit = connectors + voltage + timing + driver evidence
software delta = BSP + device tree + AI runtime + update/recovery
field cost = thermal + EMC + test fixtures + service plan
```

Аксессуары Raspberry Pi могут уменьшить объём механической разработки, но нумерация BCM и предположения libcamera всё равно требуют адаптации. Для приложений Jetson CUDA/TensorRT нужен продуманный перенос на Rockchip/RKNN и повторная проверка точности и задержки.

## Источники

- [Спецификации и документация Sige5](https://docs.armsom.org/armsom-sige5)
- [Спецификации и документация Sige7](https://docs.armsom.org/armsom-sige7)
- [Спецификации и документация CM5](https://docs.armsom.org/armsom-cm5)
- [Документация Forge1](https://docs.armsom.org/zh/armsom-forge1)

## Проверки перед публикацией

- [ ] Заполните оценку измеренными данными интерфейсов и нагрузки.
- [ ] Учтите перенос ПО и восстановление на объекте, а не только BOM.
- [ ] Разделите утверждения «совместимо», «переносимо» и «прямая замена».
