---
title: "RK3308: аппаратное проектирование"
description: "RK3308: аппаратное проектирование. Схемные ограничения, параметры источника и проверка конкретной платы."
excerpt: "Схемные ограничения, параметры источника и проверка конкретной платы."
translation_key: "rk3308-hardware-design-series"
slug: "rk3308-hardware-design-series"
lang: "ru"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["P2pro"]
tags: ["RK3308", "hardware design", "ArmSoM"]
image: "/assets/rk3308-hardware-series/rk3308-cn-p17.png"
---

# RK3308: аппаратное проектирование

По RK3308 Hardware Design Guide V1.0 (2018-09-14) с учётом отличий из документа совместимости V1.1 2023 года. P2 Pro использует RK3308B-S; старый эталон не заменяет её схему. Это тематическая статья, не полный постраничный перевод. Значения не являются испытаниями ArmSoM. Проверяйте интерфейсы, SDK/BSP, ядро и прошивку конкретной платы.

## Читайте по этапам

- [Загрузка и память RK3308: такт, FLASH_SEL и восстановление](/ru/articles/rk3308-clock-boot-storage-design/) · §2.1; §2.4.1; §2.4.6–2.4.7
- [RK3308: питание, DDR, ожидание и варианты S](/ru/articles/rk3308-power-ddr-hardware-design/) · §2.1.6; §2.2; compatibility V1.1
- [Микрофонные массивы RK3308: аналог, I2S, PDM и обратный захват](/ru/articles/rk3308-audio-array-hardware-design/) · §2.3
- [Периферия RK3308: USB, RMII, дисплей и отладка](/ru/articles/rk3308-usb-network-peripheral-design/) · §2.4; compatibility V1.1 §7
- [RK3308: тепло, ESD и подготовка производства](/ru/articles/rk3308-thermal-esd-production-design/) · §3–6

## Продукты и документация ArmSoM

- [ArmSoM P2 Pro](https://www.armsom.org/product-page/p2pro) · [P2 Pro Docs](https://docs.armsom.org/armsom-p2pro)
