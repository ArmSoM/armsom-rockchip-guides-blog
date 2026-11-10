---
title: "RK3506: аппаратное проектирование"
description: "RK3506: аппаратное проектирование. Схемные ограничения, параметры источника и проверка конкретной платы."
excerpt: "Схемные ограничения, параметры источника и проверка конкретной платы."
translation_key: "rk3506-hardware-design-series"
slug: "rk3506-hardware-design-series"
lang: "ru"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["CM1", "Forge1"]
tags: ["RK3506", "hardware design", "ArmSoM"]
image: "/assets/rk3506-hardware-series/rk3506-cn-p20.png"
---

# RK3506: аппаратное проектирование

По RK3506 Hardware Design Guide V1.0 (2024-09), охватывающему G2 и B/J. Корпус, память, питание и выводы проверяют по варианту, интерфейсы CM1/Forge1 — по документации платы. Это тематическая инженерная статья, не полный постраничный перевод. Значения взяты из источника, не из испытаний ArmSoM. Проверяйте реальные SDK/BSP, ядро и прошивку.

## Читайте по этапам

- [Минимальная система RK3506: тактирование, сброс и восстановление](/ru/articles/rk3506-clock-boot-reset-design/) · §2.1.1–2.1.5; §2.3.2; §3.3.1
- [Домены питания RK3506: G2, B/J и плата-носитель](/ru/articles/rk3506-power-domains-design/) · §1.2; §2.1.9; §2.2; §3.3.2
- [RK3506 DDR, eMMC и FSPI: схемы и трассировка](/ru/articles/rk3506-ddr-storage-hardware-design/) · §2.1.6–2.1.8; §3.3.9–3.3.12
- [RK3506: распределение дисплея, USB и RM_IO](/ru/articles/rk3506-display-usb-io-design/) · §2.3.4–2.3.6; §3.3.3–3.3.4; §3.3.11
- [Аудиотракт RK3506: SAI, PDM, ASRC и DSM](/ru/articles/rk3506-audio-hardware-design/) · §2.3.7; §3.3.13
- [Промышленные интерфейсы RK3506: RMII, FlexBus, DSMC](/ru/articles/rk3506-industrial-bus-hardware-design/) · §2.3.8–2.3.17; §3.3.5–3.3.7
- [RK3506: тепло, ESD и подготовка производства](/ru/articles/rk3506-thermal-esd-production-design/) · §3.1–3.2; §4–7

## Продукты и документация ArmSoM

- [ArmSoM CM1](https://www.armsom.org/product-page/cm1) · [CM1 Docs](https://docs.armsom.org/armsom-cm1)
- [ArmSoM Forge1](https://www.armsom.org/armsom-forge1) · [Forge1 Docs](https://docs.armsom.org/armsom-forge1)
