---
title: "rk_sign_tool и sign_tool: подпись и проверка прошивки Rockchip"
description: "Подпись подготавливает файлы для цепочки доверия; запись хеша ключа в OTP/eFuse — отдельная операция. Linux 1.42, старый Linux-снимок и macOS 1.2 имеют разные границы возможностей."
excerpt: "Подпись подготавливает файлы для цепочки доверия; запись хеша ключа в OTP/eFuse — отдельная операция. Linux 1.42, старый Linux-снимок и macOS 1.2 имеют разные границы возможностей."
translation_key: "rockchip-tool-rk-sign-tool"
slug: "rockchip-tool-rk-sign-tool"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "rk_sign_tool and sign_tool"]
---

{% raw %}

![rk_sign_tool and sign_tool](/assets/rockchip-tools/flows/rk-sign-tool-ru.svg)

Подпись подготавливает файлы для цепочки доверия; запись хеша ключа в OTP/eFuse — отдельная операция. Linux 1.42, старый Linux-снимок и macOS 1.2 имеют разные границы возможностей.

## Идентичность ключа

Выберите чип и политику ключей по SDK. Храните закрытые ключи вне репозитория и журналов. Сохраните неподписанные входы, имена выходов и идентификатор ключа. Новый случайный ключ не исправляет обновление уже настроенного устройства.

## Пример источника

Linux README приводит последовательность RK3326 с существующей парой ключей:

```text
rk_sign_tool cc --chip 3326
rk_sign_tool lk --key privateKey.pem --pubkey publicKey.pem
rk_sign_tool sl --loader loader.bin
rk_sign_tool si --img uboot.img
```

Это обработка локальных файлов, не универсальный рецепт RK3576/RK3588. PDF `sign_tool` также описывает пары `sf`/`vf` для полной прошивки, `sl`/`vl` для Loader, `si`/`vi` для образов. Проверьте подпись поддерживаемой командой выбранной версии.

## Особые параметры

`ss --flag=0x20` включает запись OTP через miniloader. `exclude_boot_sign=true` в A/B пропускает автоматическую подпись boot, поэтому может потребоваться отдельный этап. При внешнем подписании extract/inject сохраняйте соответствие данных и подписи.

Проверьте чип, ключ и охват загрузочной цепочки. Корректная подпись чужим ключом не загрузит устройство. Padding и формат зависят от платформы. До необратимого provisioning проверьте подписанное обновление и восстановление. Ключи и аппаратные настройки в ходе подготовки не менялись.

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Загрузка, версии и SHA-256

Выберите архив, проверьте хеш и распакуйте весь каталог. Разделённый Linux PinDebug сначала восстановите по инструкции; его указанный хеш относится к целому файлу.

| Хост / версия | Пакет |
|---|---|
| Linux / 1.42 | [rk_sign_tool_v1.42_linux.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/rk_sign_tool_v1.42_linux.zip) |
| Linux / directory snapshot | [rk_sign_tool-linux-directory-snapshot.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/rk_sign_tool-linux-directory-snapshot.zip) |
| macOS / 1.2 | [sign_tool_v1.2_mac.zip](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/downloads/rk-sign-tool/sign_tool_v1.2_mac.zip) |

**rk_sign_tool_v1.42_linux.zip — SHA-256**

```text
799a0fad6e363b141e244580479ed8434e05c070d924db8a289e277e50a7ca1d
```

**rk_sign_tool-linux-directory-snapshot.zip — SHA-256**

```text
db3cd185e5e38b886be0a162a92d3400368acfb5684744b8e91af5ef9cdeb06e
```

**sign_tool_v1.2_mac.zip — SHA-256**

```text
30ee08cb35681b735f1636bcc9215af64c4b6b5ca303a0889509be32209ea8ed
```

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- rk_sign_tool/readme.txt; sign_tool用户使用手册.pdf V1.0; package revision notes
- [Исходный PDF: sign_tool用户使用手册.pdf](https://raw.githubusercontent.com/ArmSoM/rockchip-tools/main/manuals/8528f18eea87.pdf)

## Связанные рабочие процессы

- [Полное руководство Rockchip Secure Boot: подпись, eFuse, OTP и проверка](/ru/articles/105-rockchip-secure-boot/)
- [Руководство разработчика Rockchip Linux Secure Boot](/ru/articles/203-rockchip-linux-secure-boot/)
- [EfuseTool 1.42: подготовка станции Secure Boot provisioning](/ru/articles/rockchip-tool-efuse-tool/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
