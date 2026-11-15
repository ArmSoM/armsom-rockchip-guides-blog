---
title: "RKPCBATool 1.2.1: функциональные тесты Linux-платы и ручная оценка"
description: "RKPCBATool связывает Windows-приложение с тестовыми программами Linux-устройства. Память, беспроводные интерфейсы, аудио и кнопки проверяются только при поддержке BSP."
excerpt: "RKPCBATool связывает Windows-приложение с тестовыми программами Linux-устройства. Память, беспроводные интерфейсы, аудио и кнопки проверяются только при поддержке BSP."
translation_key: "rockchip-tool-pcba-tool"
slug: "rockchip-tool-pcba-tool"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "RKPCBATool"]
---

{% raw %}

![RKPCBATool](/assets/rockchip-tools/flows/pcba-tool-ru.svg)

RKPCBATool связывает Windows-приложение с тестовыми программами Linux-устройства. Память, беспроводные интерфейсы, аудио и кнопки проверяются только при поддержке BSP. Это не старый Android PCBA-процесс.

## Установка и связь

Используйте полный пакет и путь из английских символов: руководство предупреждает о проблемах ADB с другими путями. Загрузите PCBA-firmware и подключите ADB. Зелёный индикатор означает найденное устройство, оранжевый — отсутствие; соединение ещё не означает успешный тест.

## План JSON

Загрузите файл через **F2** или **...**. `test_item` — идентификатор, `test_bin_name` — программа на плате, `test_type` — автоматическая или ручная оценка. Ниже исправный синтаксический пример ArmSoM по документированным полям с отключённым MES; это не аттестованный производственный план:

```json
{
  "meta": {"version": "1.0", "needreboot": false},
  "test_groups": [{
    "test_item": "key_test",
    "test_bin_name": "echo_key_test",
    "name": "Key Test",
    "test_type": "manual",
    "enable": 1,
    "is_loop_test": false,
    "is_first": false,
    "is_last": false,
    "is_check_sn": false
  }],
  "mes_config": {"use_mes": false}
}
```

Программа должна существовать на целевой плате. Адаптируйте тесты к компонентам и оснастке. Исходный JSON содержит несогласованное оформление и примерные MES-адреса, которые нельзя переносить на станцию.

## Выполнение

Автоматические тесты и первый ручной запускаются вместе. Ручные переходят дальше после Pass/Fail. Для аудио нужны критерии качества, для кнопок — имена платы. Обнаружение Wi-Fi не измеряет пропускную способность. Отключённые и неприменимые тесты учитывайте отдельно.

`needreboot` задаёт перезапуск; пример A/B rootfs специфичен для изделия. Расширение требует согласованных host-конфигурации, программы и протокола цели. Китайский V1.2.0 удаляет старый camera-раздел, английский сохраняет его вопреки журналу: эти детали отмечаются как исторические.

Храните хеш плана, версии, firmware, оснастку и результаты устройств. Инструмент 1.2.1 и руководство V1.2.0 — разные версии. Производственные проверки не выполнялись.

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Загрузка, версии и SHA-256

Выберите архив, проверьте хеш и распакуйте весь каталог. Разделённый Linux PinDebug сначала восстановите по инструкции; его указанный хеш относится к целому файлу.

| Хост / версия | Пакет |
|---|---|
| Windows host + Linux target / 1.2.1 | [RKPCBATool_v1.2.1_20251226.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/pcba-tool/RKPCBATool_v1.2.1_20251226.zip) |

**RKPCBATool_v1.2.1_20251226.zip — SHA-256**

```text
ec3747fa2360e8e1793920882d7ec51a4aa1087a4cfab5d3c218f677999440bc
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- RKPCBATool 1.2.1 package; Rockchip_Developer_Guide_Linux_PCBA_CN/EN V1.2.0 (2025-12-13)
- [Исходный PDF: Rockchip_Developer_Guide_Linux_PCBA_CN.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/31be89bdda4b.pdf)
- [Исходный PDF: Rockchip_Developer_Guide_Linux_PCBA_EN.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/6cb5fb2c60e8.pdf)

Иллюстрации извлечены из указанных PDF. При наличии только китайского оригинала текст интерфейса сохранён; подписи переведены. Это исторические примеры, не результаты тестов ArmSoM.

![Иллюстрация исходного руководства · RKPCBATool](/assets/rockchip-tools/pcba-tool/en-p07-01.png)

Rockchip_Developer_Guide_Linux_PCBA_EN.pdf · p. 7

## Связанные рабочие процессы

- [Руководство по разработке тестов Rockchip Linux PCBA](/ru/articles/197-rockchip-linux-pcba/)
- [Руководство разработчика инструмента PCBA Rockchip](/ru/articles/252-rockchip-pcba-test-tool/)
- [RKDevInfoWriteTool: серийные номера и MAC без дублирования](/ru/articles/rockchip-tool-devinfo-write/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
