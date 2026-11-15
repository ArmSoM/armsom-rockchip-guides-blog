---
title: "rk_ddrbin_tool: параметры ранней инициализации DDR"
description: "DDR binary инициализирует память до запуска Linux. rk_ddrbin_tool меняет поддерживаемые параметры совместимого бинарного файла, но не заменяет анализ разводки или подбор Loader."
excerpt: "DDR binary инициализирует память до запуска Linux. rk_ddrbin_tool меняет поддерживаемые параметры совместимого бинарного файла, но не заменяет анализ разводки или подбор Loader."
translation_key: "rockchip-tool-ddrbin-tool"
slug: "rockchip-tool-ddrbin-tool"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "rk_ddrbin_tool"]
---

{% raw %}

![rk_ddrbin_tool](/assets/rockchip-tools/flows/ddrbin-tool-ru.svg)

DDR binary инициализирует память до запуска Linux. `rk_ddrbin_tool` меняет поддерживаемые параметры совместимого бинарного файла, но не заменяет анализ разводки или подбор Loader.

## Две разные версии

Версия инструмента отличается от версии DDR binary. В руководстве есть матрица платформ и версий; переименование файла не исправляет несовместимость. Сохраните оригинал и хеш.

## Чтение и изменение

Исторические Python-примеры PX30 из текстового руководства:

```text
./ddrbin_tool.py px30 ddrbin_param.txt px30_ddr_333MHz_v1.13.bin
./ddrbin_tool.py px30 -g gen_param.txt px30_ddr_333MHz_v1.15.bin
```

Первая строка применяет `ddrbin_param.txt`, вторая экспортирует параметры через `-g`. Это не означает, что каждый GUI-пакет содержит `ddrbin_tool.py`, или что параметры PX30 подходят другому SoC. Используйте фактический интерфейс выбранной поставки. Пустые значения сохраняют значения по умолчанию согласно руководству.

Выберите точный чип и поддерживаемую версию binary, экспортируйте исходные настройки, если возможно, и меняйте по одному документированному параметру в копии. Перед включением результата в Loader сравните настройки, размер и хеш; сохраните весь комплект входных данных.

## Проверка на плате

Проверьте инициализацию памяти, холодный/тёплый старт и DDR-тесты при правильной установке памяти. Принятый редактором файл не доказывает стабильность. Если плата останавливается до консоли, восстановите рабочий Loader и исследуйте изменённый параметр.

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Каталог GitHub, версии и SHA-256

Откройте соответствующий каталог GitHub, выберите платформу и версию, проверьте хеш и распакуйте весь каталог. Ссылки ниже ведут в каталоги репозитория.

[Открыть каталог инструмента на GitHub](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/ddrbin-tool)

| Платформа / версия | Файл | SHA-256 |
|---|---|---|
| Linux / 1.01 | `rk_ddrbin_tool_V1.01.7z` | `db87698a90f620dcea6ab166af7d330dfb6f36e9b2cc9ec02dd000bf474b2212` |
| Windows / 1.07.2 | `rk_ddrBin_tool_V1.07.2.zip` | `618bd996e570cb2f94b2c714e53776c3edc6bad3211e6c377be3cfd45bc48bc1` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- rk_ddrbin_tool 1.01 / 1.07.2 packages; ddrbin_tool_user_guide.txt; parameter/version matrix

## Связанные рабочие процессы

- [Руководство Rockchip DDR: частота, ёмкость, проверка, глазковые диаграммы и ECC](/ru/articles/037-rockchip-ddr/)
- [boot_merger: согласование DDR, загрузочного кода и Loader](/ru/articles/rockchip-tool-boot-merger/)
- [DDR_UserTool 1.41: выбор конфигурации тестирования DDR](/ru/articles/rockchip-tool-ddr-user-tool/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
