---
title: "DriverAssitant 5.13: драйверы Rockusb и ADB в Windows"
description: "DriverAssitant устанавливает и удаляет USB-драйверы Rockchip. Это подготовка компьютера, а не программа записи прошивки. Неверная привязка драйвера мешает RKDevTool связаться с платой."
excerpt: "DriverAssitant устанавливает и удаляет USB-драйверы Rockchip. Это подготовка компьютера, а не программа записи прошивки. Неверная привязка драйвера мешает RKDevTool связаться с платой."
translation_key: "rockchip-tool-driver-assistant"
slug: "rockchip-tool-driver-assistant"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "DriverAssitant"]
---

{% raw %}

![DriverAssitant](/assets/rockchip-tools/flows/driver-assistant-ru.svg)

DriverAssitant устанавливает и удаляет USB-драйверы Rockchip. Это подготовка компьютера, а не программа записи прошивки. Неверная привязка драйвера мешает RKDevTool связаться с платой.

## Подготовка и ограничения

Сохраните папки драйверов рядом с установщиком. README рекомендует удалить старую версию перед установкой новой. Для установки нужны соответствующие права администратора; отключение защиты Windows не устраняет несовместимость драйвера.

Историческая документация перечисляет Windows XP, 7, 8 и 10 в вариантах 32/64 бит. Она не подтверждает Windows 11 или Windows on Arm. Проверьте архитектуру и подпись фактического драйвера.

## Последовательность

1. Запишите текущего поставщика и имя драйвера в диспетчере устройств.
2. При замене удалите старый драйвер Rockchip по инструкции пакета, затем установите новый.
3. Подключите одну плату к порту данных из её руководства. Для Rockusb войдите в Loader или Maskrom.
4. Проверьте ошибки перечисления USB, затем обнаружение через RKDevTool или `upgrade_tool ld`.
5. Для ADB нужна работающая ОС с включённым и авторизованным ADB. Драйвер Rockusb не добавляет эту службу в прошивку.

## Поиск причины

Кабель только для питания, неверный разъём, слабое питание и другой режим загрузки также объясняют отсутствие устройства. Если Windows видит плату, а приложение нет, проверьте привязку драйвера и версию программы. Авторизация ADB относится к ОС, восстановление Maskrom — к загрузочной цепочке.

Сохраните версию установщика, сборку и архитектуру Windows, USB-контроллер, режим платы и имя драйвера. Проверьте одну плату до подключения нескольких через концентратор. Установка драйвера в рамках подготовки статьи не выполнялась.

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Каталог GitHub, версии и SHA-256

Откройте соответствующий каталог GitHub, выберите платформу и версию, проверьте хеш и распакуйте весь каталог. Ссылки ниже ведут в каталоги репозитория.

[Открыть каталог инструмента на GitHub](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/driver-assistant)

| Платформа / версия | Файл | SHA-256 |
|---|---|---|
| Windows / 5.13 | `DriverAssitant_v5.13.zip` | `b2cabce5ab23551d8649c1201ef741fd73c8326044b78edac5439f013f034ff9` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- DriverAssitant_v5.13.zip: Readme and packaged driver directories

## Связанные рабочие процессы

- [RKDevTool: загрузка, Loader, разделы и прошивка update.img](/ru/articles/rockchip-tool-rkdevtool/)
- [upgrade_tool: команды прошивки Rockchip и выбор устройства](/ru/articles/rockchip-tool-upgrade-tool/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
