---
title: "programmer_image_tool: образы для eMMC, SPI NOR и NAND-программаторов"
description: "programmer_image_tool преобразует контейнер прошивки в файлы для производственного программатора. Он создаёт файлы на хосте, а не прошивает плату напрямую."
excerpt: "programmer_image_tool преобразует контейнер прошивки в файлы для производственного программатора. Он создаёт файлы на хосте, а не прошивает плату напрямую."
translation_key: "rockchip-tool-programmer-image-tool"
slug: "rockchip-tool-programmer-image-tool"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "programmer_image_tool"]
---

{% raw %}

![programmer_image_tool](/assets/rockchip-tools/flows/programmer-image-tool-ru.svg)

## programmer_image_tool: все примеры двух руководств

Два файла `user_manual.pdf` поставляются с Linux 1.26 и Windows 1.28 и содержат одинаковые четыре команды. В Linux-разделе usage description повреждена локальная ссылка на рисунок; в Windows есть снимок справки, сохранённый ниже вместе со всеми текстовыми примерами. Создание образов не записывает плату.

### 1. eMMC

```text
./programmer_image_tool -i update.img -t emmc
```

Создаёт `out_image.bin` в каталоге программы.

### 2. SPI NOR

```text
./programmer_image_tool -i update.img -t spinor
```

Также создаёт `out_image.bin`, но для SPI NOR; образ eMMC не взаимозаменяем с ним.

### 3. SPI NAND: блок 256 КБ, страница 4 КБ

```text
./programmer_image_tool -i update.img -b 256 -p 4 -t spinand -o out
```

Создаёт образы по именам разделов в `out`. В источнике шаблон написан `partiiton_name.img`; это обозначение имени раздела, а не требуемая опечатка файла.

### 4. SLC NAND: блок 256 КБ, страница 4 КБ, OOB 256 Б

```text
./programmer_image_tool -i update.img -b 256 -p 4 -s 256 -t slc -2 -o rockdev
```

Создаёт образы разделов в `rockdev`. Заголовок оригинала также содержит `2k_page`, но команда — `-p 4` и `-2`. Значения сохранены; справка ниже подтверждает для `-2` 2k данных на страницу, а не изменение её физического размера. Сверьте datasheet NAND и справку инструмента.

## Полные параметры со снимка справки

Снимок Windows подтверждает: `-2` означает 2k данных в одной странице, а не замену `-p 4` физической страницей 2 КБ. Ниже копируемый текст. SYNOPSIS короче списка OPTIONS; различие оригинала сохранено.

```text
NAME
    programmer_image_tool - creating image for programming on flash
SYNOPSIS
    programmer_image_tool [-iotbpsvh]
DESCRIPTION
    This tool aims to convert firmware into image for programming
    From now on,it can support slc nand(rk)|spi nand|nor|emmc.
OPTIONS:
    -i    input file
    -o    output directory
    -t    storage type,range in[SLC|SPINAND|SPINOR|EMMC]
    -f    input format,range in[UPDATE|PARAMETER|IMAGE]
    -b    block size,unit KB
    -p    page size,unit KB
    -s    oob size,unit B
    -2    2k data in one page
    -1    single idblock
    -d    set idblock start sector
    -l    using page linked list
    -v    show version
```

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Каталог GitHub, версии и SHA-256

Откройте соответствующий каталог GitHub, выберите платформу и версию, проверьте хеш и распакуйте весь каталог. Ссылки ниже ведут в каталоги репозитория.

[Открыть каталог инструмента на GitHub](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/programmer-image-tool)

| Платформа / версия | Файл | SHA-256 |
|---|---|---|
| Linux / 1.26 | `programmer_image_tool_v1.26_linux.tar.gz` | `ea38df34e97cd697aa53d09af06fa1ff2b0847fe2c9699c49d1890509cc5c0d0` |
| Windows / 1.28 | `programmer_image_tool_v1.28.zip` | `696d07d8232a637ef59b724d0c0522e500fc9f26571c2633d96271ffce48e56f` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- user_manual.pdf
- user_manual.pdf

### Исходные интерфейсы и схемы руководства

Сохранён язык исходных интерфейсов. При наличии используются английские рисунки; дополнительные без английского оригинала остаются китайскими. Значения — примеры руководства, не измерения платы.

![Рисунок оригинального руководства: programmer-image-tool · p. 1 · 1](/assets/rockchip-tools/manuals/454e7646c90d/p01-f01.png)

user_manual.pdf · p. 1

![Рисунок оригинального руководства: programmer-image-tool · p. 1 · 1](/assets/rockchip-tools/manuals/47ce51e919d3/p01-f01.png)

user_manual.pdf · p. 1

## Связанные рабочие процессы

- [Firmware_Merger: образы Flat RK, Flat GPT и Compact GPT](/ru/articles/rockchip-tool-firmware-merger/)
- [afptool и rkImageMaker: создание и проверка update.img](/ru/articles/rockchip-tool-firmware-pack-tools/)
- [Полное руководство по накопителям Rockchip: flash, загрузка, разделы, запись и Vendor Storage](/ru/articles/099-rockchip-storage-application/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
