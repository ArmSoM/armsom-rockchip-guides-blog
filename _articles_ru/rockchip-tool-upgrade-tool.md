---
title: "upgrade_tool: команды прошивки Rockchip и выбор устройства"
description: "upgrade_tool предоставляет операции Rockusb из командной строки. В коллекции отдельно представлены Linux 2.44, macOS 2.13 и Windows 2.46. Выбирайте пакет для своего компьютера."
excerpt: "upgrade_tool предоставляет операции Rockusb из командной строки. В коллекции отдельно представлены Linux 2.44, macOS 2.13 и Windows 2.46. Выбирайте пакет для своего компьютера."
translation_key: "rockchip-tool-upgrade-tool"
slug: "rockchip-tool-upgrade-tool"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "upgrade_tool"]
---

{% raw %}

![upgrade_tool](/assets/rockchip-tools/flows/upgrade-tool-ru.svg)

## Руководство командной строки: версии и применимость

Ниже объединены полные технические разделы китайских руководств V1.0 и файла V1.1. На обложке второго по-прежнему указано 1.0, но добавлено стирание SPI NAND; различие сохранено. В оригинале перечислены RK3308, RK3326, RK3399, RK3328, RK3228H, RK3229, RK3368, RK3228, RK3288, RK3128, RK3126, RK3188, RK3036, RK1808, PX30, RV1109, RV1126, RK3566 и RK3568. Это не перечень испытанных плат ArmSoM.

### 1. Список устройств

```text
upgrade_tool ld
```

Устройства обновления называются Rockusb и работают в режиме Loader или Maskrom. При нескольких платах сначала определите нужную; LocationID не является постоянным серийным номером.

### 2. Загрузить Boot в ОЗУ

```text
upgrade_tool db rkxxloader.bin
```

В Maskrom сначала загрузите Boot для последующего обмена. Эта операция не записывает накопитель. При ошибке проверьте DDR/SoC либо USB и перезагрузите устройство перед повтором. Имя файла — пример оригинала; нужен Loader конкретной платы.

### 3. Записать Loader

```text
upgrade_tool ul rkxxloader.bin
upgrade_tool ul rkxxloader.bin -noreset
upgrade_tool ul rkxxloader.bin SPINOR
```

Три формы выполняют перезагрузку после записи, отменяют её либо выбирают SPINOR при нескольких накопителях. Допустимы Maskrom и Loader; загружается Boot, создаётся IDBlock и записывается накопитель. Проверьте поддержку Flash и пайку. При случайных сбоях обмена проверьте USB, при постоянных — устройство.

### 4. Записать образы разделов

```text
upgrade_tool di -p parameter.txt
upgrade_tool di -k kernel.img
upgrade_tool di -u uboot.img -b boot.img
upgrade_tool di -vendor vendor.img
upgrade_tool di -boot_a boot.img -boot_b boot.img
```

Сначала запишите таблицу разделов, затем один или несколько образов. Если сокращение не определено, используйте полное имя, в том числе для A/B. Ниже все сокращения оригинала. Отдельно проверяйте отсутствие/занятость файла, превышение размера раздела и USB; принудительный адрес не исправляет несоответствие размера.

| Параметр | Раздел |
|---|---|
| `-b` | `boot` |
| `-k` | `kernel` |
| `-r` | `recovery` |
| `-s` | `system` |
| `-u` | `uboot` |
| `-m` | `misc` |
| `-t` | `trust` |

### 5. Перейти из Loader в Maskrom

```text
upgrade_tool rd 3
```

### 6. Обновить полную прошивку

```text
upgrade_tool uf update.img
upgrade_tool uf update.img -noreset
```

Обновление допускается в Maskrom или Loader без предварительной загрузки Boot; вторая форма отключает завершающую перезагрузку. Семь причин ошибок в оригинале: отсутствующий/занятый файл; неверная метка прошивки — проверить упаковку; ошибка хеша — проверить изменения; ошибка чтения — обновить упаковщик и пересоздать; образ больше раздела; неверный флаг чипа — прочитать сведения и переупаковать; сбой обмена — проверить USB при случайном характере и устройство при постоянном.

### 7. Чтение и запись по адресу

```text
upgrade_tool wl 0x12000 oem.img
upgrade_tool rl 0x12000 0x2000 out.img
```

Первая команда записывает файл с LBA `0x12000`; вторая читает `0x2000` секторов начиная с `0x12000` в `out.img`. Это исходные примеры, не адреса для произвольной разметки.

### 8. Стирание и отличие V1.1

```text
upgrade_tool ef rkxxloader.bin
upgrade_tool el 0 0x2000
```

`ef` стирает все данные в Maskrom без предварительной загрузки Boot; перечислены eMMC и NAND. Пример `el` стирает `0x2000` секторов с сектора 0. V1.0 указывает только eMMC, V1.1 — `emmc|spinand|spinor`. Для полного стирания SPI NAND V1.1 предписывает войти в Maskrom и последовательно выполнить две строки ниже. `-1` сохранено из оригинала; проверьте реализацию инструмента и памяти.

```text
upgrade_tool db rkxxloader.bin
upgrade_tool el 0 -1
```

### 9. Прочитать сведения об устройстве

```text
upgrade_tool rfi
upgrade_tool rci
upgrade_tool pl
```

Соответственно читаются сведения о накопителе, ID чипа и таблица разделов.

### 10. Выбор накопителя

```text
upgrade_tool ssd
```

Выполните после успешной загрузки Boot в Maskrom. `*` отмечает текущий накопитель; введите No нужного устройства из списка.

### 11. Выбор устройства

```text
upgrade_tool -s 100 ul rkxxloader.bin
```

Сначала получите LocationID командой `ld`, затем задайте его через `-s`; `100` — пример. Этот `-s` выбирает устройство, а `di -s` обозначает раздел system.

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Каталог GitHub, версии и SHA-256

Откройте соответствующий каталог GitHub, выберите платформу и версию, проверьте хеш и распакуйте весь каталог. Ссылки ниже ведут в каталоги репозитория.

[Открыть каталог инструмента на GitHub](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/upgrade-tool)

| Платформа / версия | Файл | SHA-256 |
|---|---|---|
| Linux / 2.44 | `upgrade_tool_v2.44_for_linux.zip` | `b779239cb1dc6cadd823520439e4163cf223145d048e6b5f9eaf1735b407cff8` |
| macOS / 2.13 | `upgrade_tool_v2.13_for_mac.zip` | `d49db00e892b72a1760b9766b5e4ab998e75a17a37cb3acc8bf13b981b0ffc34` |
| Windows / 2.46 | `upgrade_tool_v2.46.zip` | `de1dc7ce00ed5cfdaa0432f1c7e3efaf096e5dbb7e0ad851345739f6342c06dc` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- 命令行开发工具使用文档.pdf
- 命令行开发工具使用文档v1.1.pdf

## Связанные рабочие процессы

- [RKDevTool: загрузка, Loader, разделы и прошивка update.img](/ru/articles/rockchip-tool-rkdevtool/)
- [Полное руководство по накопителям Rockchip: flash, загрузка, разделы, запись и Vendor Storage](/ru/articles/099-rockchip-storage-application/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
