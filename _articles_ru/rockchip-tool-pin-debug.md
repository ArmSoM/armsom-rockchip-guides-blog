---
title: "PinDebug: диагностика IOMUX, GPIO и доменов питания Rockchip"
description: "PinDebug сопоставляет назначение выводов с текущими регистрами платы. Это помогает найти контакт, оставшийся GPIO вместо нужного интерфейса."
excerpt: "PinDebug сопоставляет назначение выводов с текущими регистрами платы. Это помогает найти контакт, оставшийся GPIO вместо нужного интерфейса."
translation_key: "rockchip-tool-pin-debug"
slug: "rockchip-tool-pin-debug"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "PinDebug"]
---

{% raw %}

![PinDebug](/assets/rockchip-tools/flows/pin-debug-ru.svg)

## Полное руководство PinDebug V1.1

В руководстве перечислены RK3588, RK3566, RK3568, RV1126, RV1109, RV1106, RV1103 и RK3528. PinDebug читает IOMUX и настраивает выводы; интерфейсы Windows 1.18 и Linux 1.11 могут отличаться. Ниже раскрыты разделы 1.1–1.11; рисунки сохраняют китайский интерфейс оригинала.

### 1.1 Открыть проект

Перед любыми действиями выберите SoC. Страница Pin показывает функции по выводам/GPIO: поиск по Function; правая кнопка выводит команду настройки; двойной щелчок при подключённой плате непосредственно меняет функцию. Столбцы выводов и номеров IO сортируются. IOmux группирует сигналы по модулям.

### 1.2 Подключить устройство

Обмен выполняется через ADB. Откройте проект, включите ADB на устройстве, подключите компьютер и нажмите значок соединения.

### 1.3 Прочитать IOMUX

Чтение всех регистров IOMUX обновляет Pin и IOmux. Офлайн-описание не заменяет значения реального устройства.

### 1.4 Изменить IOMUX

Флажок функционального IO выбирает эту функцию; снятие переводит вывод в GPIO. При конфликте можно отменить или подтвердить изменение.

### 1.5 Подтяжки и сила драйвера

Выберите активный функциональный IO и правой кнопкой прочитайте/измените подтяжки и силу драйвера. Пример — EMMC_CLKOUT; перед изменением проверьте использование контроллером памяти.

### 1.6 Чтение и изменение GPIO

Пример использует GPIO1C3. Флажок функции GPIO означает режим GPIO; направление берётся из `ddr`, выходной уровень из `dr`, напряжение IO из PMU `vsel`, уровень порта из `ext_port`. Здесь `ddr` — регистр направления, не память DDR.

### 1.7 Прочитать регуляторы

Инструмент читает узел regulator summary через `cat` и разбирает все домены. Полный путь узла в оригинале не указан.

### 1.8 Прочитать выбор напряжения доменов

Регистр выбора напряжения преобразуется в список доменов. В разделе 1.8 написано `vesl`, в 1.6 — `vsel`; расхождение отмечено. Значение выбора не является измеренным напряжением.

### 1.9 Проверить IOmux

Вывести выбранные IO по модулям, чтобы определить активную группу при нескольких mode.

### 1.10 Экспортировать настройки GPIO

После открытия проекта экспортируйте конфигурацию GPIO в Excel. Укажите SoC и различайте статические определения и прочитанные данные устройства.

### 1.11 Офлайн-поиск команд GPIO

При открытом проекте можно без устройства искать команды IOMUX, подтяжек, силы драйвера и триггера Шмитта. Введите `help`; пример запроса — `gpio0a0`. Сгенерированная команда не подтверждает совместимость с электрической схемой платы.

### Синтаксис офлайн-поиска со снимка

Вводите в поле поиска инструмента, не в shell. Поддерживаются регулярные выражения. Снимки экспорта и поиска показывают разные адреса регистров примерных проектов; не объединяйте их в одну конфигурацию платы.

```text
gpio [mux|pull|ds|smt|ddr|dr]
gpio0a0
gpio0a0 mux
gpio0a0 pull
gpio0a0 ds
gpio0a0 smt
gpio0a0 ddr
gpio0a0 dr
gpio0a0 ddr|dr
```

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Каталог GitHub, версии и SHA-256

Откройте соответствующий каталог GitHub, выберите платформу и версию, проверьте хеш и распакуйте весь каталог. Ссылки ниже ведут в каталоги репозитория.

[Открыть каталог инструмента на GitHub](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/pin-debug)

| Платформа / версия | Файл | SHA-256 |
|---|---|---|
| Linux / 1.11 | `pin_debug_tool_v1.11_for_linux.tar.gz` | `16cb25b8fc2533e8f730a790c7486ab5042baa964b3bdb95a161ddce143c4a34` |
| Windows / 1.18 | `pin_debug_tool_v1.18_20250322_win.zip` | `88c550ee9a578eaa451a9b8a05b3d088247dc63dd9bd426b832191994dc6a7d5` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- PinDebug_UserManual.pdf

### Исходные интерфейсы и схемы руководства

Сохранён язык исходных интерфейсов. При наличии используются английские рисунки; дополнительные без английского оригинала остаются китайскими. Значения — примеры руководства, не измерения платы.

![Рисунок оригинального руководства: pin-debug · p. 2 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p02-f01.png)

PinDebug_UserManual.pdf · p. 2

![Рисунок оригинального руководства: pin-debug · p. 2 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p02-f02.png)

PinDebug_UserManual.pdf · p. 2

![Рисунок оригинального руководства: pin-debug · p. 3 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f01.png)

PinDebug_UserManual.pdf · p. 3

![Рисунок оригинального руководства: pin-debug · p. 3 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f02.png)

PinDebug_UserManual.pdf · p. 3

![Рисунок оригинального руководства: pin-debug · p. 3 · 3](/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f03.png)

PinDebug_UserManual.pdf · p. 3

![Рисунок оригинального руководства: pin-debug · p. 4 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p04-f01.png)

PinDebug_UserManual.pdf · p. 4

![Рисунок оригинального руководства: pin-debug · p. 4 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p04-f02.png)

PinDebug_UserManual.pdf · p. 4

![Рисунок оригинального руководства: pin-debug · p. 5 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f01.png)

PinDebug_UserManual.pdf · p. 5

![Рисунок оригинального руководства: pin-debug · p. 5 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f02.png)

PinDebug_UserManual.pdf · p. 5

![Рисунок оригинального руководства: pin-debug · p. 5 · 3](/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f03.png)

PinDebug_UserManual.pdf · p. 5

![Рисунок оригинального руководства: pin-debug · p. 6 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f01.png)

PinDebug_UserManual.pdf · p. 6

![Рисунок оригинального руководства: pin-debug · p. 6 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f02.png)

PinDebug_UserManual.pdf · p. 6

![Рисунок оригинального руководства: pin-debug · p. 6 · 3](/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f03.png)

PinDebug_UserManual.pdf · p. 6

![Рисунок оригинального руководства: pin-debug · p. 7 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f01.png)

PinDebug_UserManual.pdf · p. 7

![Рисунок оригинального руководства: pin-debug · p. 7 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f02.png)

PinDebug_UserManual.pdf · p. 7

![Рисунок оригинального руководства: pin-debug · p. 7 · 3](/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f03.png)

PinDebug_UserManual.pdf · p. 7

![Рисунок оригинального руководства: pin-debug · p. 7 · 4](/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f04.png)

PinDebug_UserManual.pdf · p. 7

![Рисунок оригинального руководства: pin-debug · p. 8 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p08-f01.png)

PinDebug_UserManual.pdf · p. 8

![Рисунок оригинального руководства: pin-debug · p. 8 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p08-f02.png)

PinDebug_UserManual.pdf · p. 8

![Рисунок оригинального руководства: pin-debug · p. 9 · 1](/assets/rockchip-tools/manuals/1cae2e2c0777/p09-f01.png)

PinDebug_UserManual.pdf · p. 9

![Рисунок оригинального руководства: pin-debug · p. 9 · 2](/assets/rockchip-tools/manuals/1cae2e2c0777/p09-f02.png)

PinDebug_UserManual.pdf · p. 9

## Связанные рабочие процессы

- [Rockchip Linux Pinctrl: полное руководство по GPIO, IOMUX, силе драйвера и DTS](/ru/articles/116-rockchip-linux-pinctrl/)
- [USB SQ Tool 1.5: глазковая диаграмма и настройки USB PHY](/ru/articles/rockchip-tool-usb-sq-tool/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
