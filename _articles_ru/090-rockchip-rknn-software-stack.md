---
title: "Программный стек Rockchip RKNN: Toolkit2, Runtime, платформы и v2.3.2"
description: "Полная техническая справка по README PDF: архитектура RKNN, платформы, загрузки, совместимость Python, LLM и изменения v2.3.2 с исходной схемой."
translation_key: "090-rockchip-rknn-software-stack"
slug: "090-rockchip-rknn-software-stack"
lang: "ru"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []
tags: ["Rockchip", "RKNN", "RK3588", "RK3576", "NPU", "Toolkit2"]
keywords: "ArmSoM Rockchip RKNN Toolkit2 Runtime RK3588 RK3576 NPU"
excerpt: "Полная техническая справка по README PDF: архитектура RKNN, платформы, загрузки, совместимость Python, LLM и изменения v2.3.2 с исходной схемой."
---

{% raw %}

# Программный стек Rockchip RKNN: Toolkit2, Runtime, платформы и v2.3.2

## Применимость к ArmSoM и источник

Это справка по платформе Rockchip, а не отчёт испытаний ArmSoM. Исходник перечисляет RK3588, RK3576 и другие платформы, но не задаёт плату, SDK/BSP или версию ядра. Перед адаптацией к конкретной плате ArmSoM проверьте согласованность драйвера NPU, Runtime, Toolkit, ОС и поддержки модели; совпадение SoC само по себе не доказывает совместимость. README.pdf в китайском и английском каталогах побайтно одинаков, текст — английский. Китайская, русская и немецкая версии полностью переводят его. Китайская версия берёт рисунок из китайского каталога (подписи английские); английская, русская и немецкая — соответствующий оригинал из английского. Номера версии документа нет; v2.3.2 обозначает снимок ПО, а не текущий последний выпуск. Аппаратная проверка и измерение производительности моделей не проводились.

[Редакционные примечания](/docs/rockchip-rknn-software-stack/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

## 1. Описание программного стека

Программный стек RKNN помогает быстро развёртывать модели ИИ на чипах Rockchip. Общая структура показана ниже.

![Исходная схема программного стека RKNN, страница 1 PDF](/docs/rockchip-rknn-software-stack/assets/en-p001-framework.png)

Для использования RKNPU сначала запустите RKNN-Toolkit2 на компьютере и преобразуйте обученную модель в формат RKNN. Затем выполняйте инференс на плате через RKNN C API или Python API.

- **RKNN-Toolkit2** — комплект разработки для преобразования моделей, инференса и оценки производительности на ПК и платформах Rockchip NPU.
- **RKNN-Toolkit-Lite2** предоставляет Python-интерфейсы для Rockchip NPU, помогая развёртывать модели RKNN и ускорять реализацию приложений ИИ.
- **RKNN Runtime** предоставляет C/C++-интерфейсы для Rockchip NPU, помогая развёртывать модели RKNN и ускорять реализацию приложений ИИ.
- **RKNPU kernel driver** взаимодействует с аппаратным NPU. Драйвер открыт и доступен в коде ядра Rockchip.

## 2. Поддерживаемые платформы по исходнику

- RK3588 (серия)
- RK3576 (серия)
- RK3566/RK3568 (серия)
- RK3562 (серия)
- RV1103/RV1106
- RV1103B/RV1106B
- RV1126B
- RK2118

Для RK1808/RV1109/RV1126/RK3399Pro исходник направляет к следующим проектам. Не смешивайте их с приведённым выше списком Toolkit2:

- [rknn-toolkit](https://github.com/airockchip/rknn-toolkit)
- [rknpu](https://github.com/airockchip/rknpu)
- [RK3399Pro_npu](https://github.com/airockchip/RK3399Pro_npu)

## 3. Загрузка

Пакеты, Docker-образы, примеры, документация и platform-tools доступны через [RKNPU2_SDK](https://console.zbox.filez.com/l/I00fc3); код доступа в исходнике — `rknn`. Дополнительные примеры: [rknn_model_zoo](https://github.com/airockchip/rknn_model_zoo). Это ссылки исходного документа; при подготовке статьи программы не загружались и не запускались.

## 4. Примечания и версии Python

RKNN-Toolkit2 несовместим с [RKNN-Toolkit](https://github.com/airockchip/rknn-toolkit). В исходнике перечислены следующие версии Python:

- Python 3.6
- Python 3.7
- Python 3.8
- Python 3.9
- Python 3.10
- Python 3.11
- Python 3.12

В исходнике указано «Latest version: v2.3.2». Здесь зафиксирован снимок PDF, а не текущая последняя версия; это также не означает, что каждый пакет поддерживает все перечисленные версии Python.

## 5. RKNN LLM

Для развёртывания LLM (Large Language Model, большой языковой модели) исходник представляет SDK под названием RKNN-LLM; см. [rknn-llm](https://github.com/airockchip/rknn-llm). Исходные название и ссылка сохранены, а не заменены другим продуктом.

## 6. Технические изменения v2.3.2

- Поддержка платформы RV1126B.
- Улучшена поддержка операций einsum и Norm.
- Добавлена автоматическая смешанная точность.
- Улучшена оптимизация графа.

Для старых выпусков исходник отсылает к `CHANGELOG`. Ссылка PDF ведёт к внутреннему локальному файлу, а не к публичной странице. Сохранено имя файла без активной внутренней ссылки; проверяйте CHANGELOG используемого SDK.

{% endraw %}
