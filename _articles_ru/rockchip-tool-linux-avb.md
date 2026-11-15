---
title: "Linux SecurityAVB: ключи, подпись boot и границы версий"
description: "Этот пакет AVB описывает историческую схему сертификатов и постоянных атрибутов. Он подходит для сопровождения соответствующего BSP, но не заменяет автоматически современный verified boot."
excerpt: "Этот пакет AVB описывает историческую схему сертификатов и постоянных атрибутов. Он подходит для сопровождения соответствующего BSP, но не заменяет автоматически современный verified boot."
translation_key: "rockchip-tool-linux-avb"
slug: "rockchip-tool-linux-avb"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "Linux SecurityAVB"]
---

{% raw %}

![Linux SecurityAVB](/assets/rockchip-tools/flows/linux-avb-ru.svg)

Этот пакет AVB описывает историческую схему сертификатов и постоянных атрибутов. Он подходит для сопровождения соответствующего BSP, но не заменяет автоматически современный verified boot.

## Интерфейс скрипта

Сначала изучите код и справку:

```text
./avb_user_tool.sh -h
```

`-n` принимает 16-байтный product ID и создаёт ключи, предварительно удаляя существующий `avb_keys`. Не запускайте его там, где лежат нужные ключи. `-f` готовит атрибуты с ключом Secure Boot, `-s` подписывает boot/recovery, `-d` программирует постоянные атрибуты, `-l`/`-u` блокирует/разблокирует устройство.

## Изоляция и размеры

Каталог исходных примерных ключей удалён из распространяемого пакета. Создавайте собственные ключи и согласуйте PRK, PIK, PSK, PUK, сертификаты и product ID. Проверьте совместимость Python/OpenSSL со старым скриптом.

Размер раздела должен быть кратен 4096 байтам и вмещать метаданные AVB; сообщение скрипта указывает запас 68K. Проверяйте вычисление, не обрезайте образ ради успешной подписи. Проверка подлинности не шифрует файловую систему.

V2.2.5 описывает раздел security 4M и исторические варианты OP-TEE. Новые руководства относятся к другим SDK. До постоянного provisioning проверьте отказ проверки, подписанное обновление и восстановление. Производственных ключей и результатов аппаратного тестирования здесь нет.

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Загрузка, версии и SHA-256

Выберите архив, проверьте хеш и распакуйте весь каталог. Разделённый Linux PinDebug сначала восстановите по инструкции; его указанный хеш относится к целому файлу.

| Хост / версия | Пакет |
|---|---|
| Linux / manual 2.2.5 | [linux-security-avb-without-keys.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/linux-avb/linux-security-avb-without-keys.zip) |

**linux-security-avb-without-keys.zip — SHA-256**

```text
fc7eae22caeadd51d85723b65451c70e88475a2c9ba7e7f5394ca1314688d17d
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- Rockchip_User_Manual_Linux_AVB_EN.pdf V2.2.5; avb_user_tool.sh
- [Исходный PDF: Rockchip_User_Manual_Linux_AVB_EN.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/50f19e52844b.pdf)

## Связанные рабочие процессы

- [Руководство разработчика Rockchip Linux Secure Boot](/ru/articles/203-rockchip-linux-secure-boot/)
- [Rockchip U-Boot Nextdev: загрузка, драйверы, SPL/TPL, FIT и проверка безопасности](/ru/articles/157-rockchip-uboot-nextdev/)
- [rk_sign_tool и sign_tool: подпись и проверка прошивки Rockchip](/ru/articles/rockchip-tool-rk-sign-tool/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
