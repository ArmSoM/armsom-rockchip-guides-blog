---
title: "DDR Bandwidth Tool: измерение трафика памяти Rockchip"
description: "Пробник DDR показывает трафик контроллера при видео, AI и отображении. Он не заменяет проверку стабильности памяти, а MB/s не является оценкой скорости приложения."
excerpt: "Пробник DDR показывает трафик контроллера при видео, AI и отображении. Он не заменяет проверку стабильности памяти, а MB/s не является оценкой скорости приложения."
translation_key: "rockchip-tool-ddr-bandwidth"
slug: "rockchip-tool-ddr-bandwidth"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "DDR Bandwidth Tool"]
---

{% raw %}

![DDR Bandwidth Tool](/assets/rockchip-tools/flows/ddr-bandwidth-ru.svg)

Пробник DDR показывает трафик контроллера при видео, AI и отображении. Он не заменяет проверку стабильности памяти, а MB/s не является оценкой скорости приложения.

## Подготовка

Выберите 32- или 64-битный файл для целевой платы и запустите справку:

```text
./rk-msch-probe-for-user-64bit -h
```

Параметр `-c chip_name` выбирает платформу, `-d msecs` задаёт интервал, `-f freq` — частоту в MHz. Обобщённое имя в руководстве отличается от имени файла пакета. Проверьте SoC и BSP.

## Частота

Руководство требует избегать `dmc_ondemand` и приводит пример:

```text
echo userspace > /sys/class/devfreq/dmc/governor
echo 780000000 > /sys/class/devfreq/dmc/userspace/set_freq
```

`780000000` задано в Hz и не является универсальным значением. Выбирайте поддерживаемую BSP точку OPP и сохраните прежние настройки для восстановления. В `-f` используются MHz. При “DDR monitor time gets error” результат выборки следует отбросить.

## Интерпретация

`ALL` — сумма каналов, `CHx` — отдельный канал; `LOAD`, `RD`, `WR` — общий трафик, чтение и запись с показателями загрузки. `ACT(access : active)` отражает число обращений после активации и локальность. `PRE` в источнике вычисляется из activation, а не отдельного аппаратного счётчика. Поля энергосбережения показывают долю времени.

Сравнивайте простой и одинаковую нагрузку при одинаковых настройках и длительности. Запишите SoC, память, ядро, governor, частоту и интервал. Отсутствие `/dev/mem` может означать выключенный `CONFIG_DEVMEM`; нужен согласованный отладочный kernel. Измерения на ArmSoM для этой статьи не выполнялись.

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Загрузка, версии и SHA-256

Выберите архив, проверьте хеш и распакуйте весь каталог. Разделённый Linux PinDebug сначала восстановите по инструкции; его указанный хеш относится к целому файлу.

| Хост / версия | Пакет |
|---|---|
| Linux target / manual 1.4.1 | [ddr-bandwidth-linux-directory-snapshot.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/ddr-bandwidth/ddr-bandwidth-linux-directory-snapshot.zip) |

**ddr-bandwidth-linux-directory-snapshot.zip — SHA-256**

```text
198ec5ad23aedee97518936fb4c2810f3d92c415269fad56788e833811af612d
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- Rockchip_Introduction_DDR_Bandwidth_Tool_CN.pdf V1.4.1, pp.3–6; packaged 32/64-bit probes
- [Исходный PDF: Rockchip_Introduction_DDR_Bandwidth_Tool_CN.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/35fc41c5ec2e.pdf)

## Связанные рабочие процессы

- [Руководство Rockchip DDR: частота, ёмкость, проверка, глазковые диаграммы и ECC](/ru/articles/037-rockchip-ddr/)
- [DDR_UserTool 1.41: выбор конфигурации тестирования DDR](/ru/articles/rockchip-tool-ddr-user-tool/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
