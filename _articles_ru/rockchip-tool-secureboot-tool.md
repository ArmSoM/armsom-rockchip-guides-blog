---
title: "SecureBootTool 1.85: границы исторической схемы Secure Boot"
description: "SecureBootTool относится к старой цепочке безопасности Rockchip."
excerpt: "SecureBootTool относится к старой цепочке безопасности Rockchip."
translation_key: "rockchip-tool-secureboot-tool"
slug: "rockchip-tool-secureboot-tool"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "SecureBootTool"]
---

{% raw %}

![SecureBootTool](/assets/rockchip-tools/flows/secureboot-tool-ru.svg)

## Историческое руководство Secure Boot V1.2

Руководство 2016 года перечисляет RK3126, RK3128, RK3228, RK3288 и RK3368, а не общую конфигурацию RK35xx. Возможности: Secure Boot ROM, SHA256/SHA160, RSA2048/RSA1024, проверка RSA через OTP и обновление Secure Boot Rockusb. Минимум: Miniloader 2.19, U-Boot 2.17, EfuseTool 1.35, SecureBootTool 1.75, RKBatchTool 1.8.

### 1. Цепочка доверия и настройка подписи

Схема ниже показывает проверки ROM и этапов загрузки. В Windows выберите чип (others для предшествующих 3188), затем eFuse либо программный режим. Источник поддерживает eFuse для 3128, 3288, 3228 и 3368, но не для других старых чипов. Слово encryption в GUI не означает, что проверка подписи обеспечивает секретность прошивки.

3188 и более ранние используют loaderex=false и 1024-битный ключ. Для 3128/3288/3228/3368 применяется следующее с указанными минимальными Loader/U-Boot. Допустимы только 1024 и 2048.

```ini
[Options]
Loaderex=true
Key=2048
```

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p05-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p05-f01.png" alt="Подпись и проверка загрузочного образа" width="1248" height="815" style="width:100%;max-width:1248px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 1: Подпись и проверка загрузочного образа</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p06-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p06-f01.png" alt="Главное окно SecureBootTool" width="900" height="600" style="width:100%;max-width:900px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 2: Главное окно SecureBootTool</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p07-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p07-f01.png" alt="Выбор целевого чипа" width="256" height="71" style="width:100%;max-width:256px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 3: Выбор целевого чипа</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p07-f02.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p07-f02.png" alt="Выбор режима eFuse или программного режима" width="216" height="84" style="width:100%;max-width:216px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 4: Выбор режима eFuse или программного режима</strong></figcaption>
</figure>

### 2. Создать, сохранить и загрузить RSA

Источник требует одну пару на модель изделия, повторно используемую для прошивок и отдельно резервируемую. Создайте, подтвердите, сохраните и загрузите ключи. Поддерживается OpenSSL `.pem` RSA2048. Потеря может исключить обновление и восстановление. Снимки показывают порядок действий, не систему хранения производственных ключей.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p09-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p09-f01.png" alt="Подтверждение сохранения созданной пары ключей" width="897" height="594" style="width:100%;max-width:897px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 5: Подтверждение сохранения созданной пары ключей</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p10-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p10-f01.png" alt="Выбор каталога для сохранения ключей" width="906" height="596" style="width:100%;max-width:906px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 6: Выбор каталога для сохранения ключей</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p11-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p11-f01.png" alt="Загрузка сохранённого файла закрытого ключа" width="969" height="775" style="width:100%;max-width:969px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 7: Загрузка сохранённого файла закрытого ключа</strong></figcaption>
</figure>

### 3. Подготовить и подписать прошивку

boot.img и recovery.img должны содержать ядро. Снимок терминала показывает следующий пример RK3288 Android 4.4; прошивка NAND также включает miniloader и uboot.img. Загрузите ключи, выберите и подпишите прошивку, сохраните результат. Повторяющийся номер 3.5 оригинала упорядочен по действиям.

```text
./mkimage.sh ota
TARGET_PRODUCT=rk3288
TARGET_HARDWARE=rk30board
system filesystem is ext4
make ota images...
create boot.img with kernel... done.
create recovery.img with kernel... done.
create misc.img.... done.
```

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p12-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p12-f01.png" alt="Создание образов boot и recovery с ядром" width="728" height="161" style="width:100%;max-width:728px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 8: Создание образов boot и recovery с ядром</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p07-f03.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p07-f03.png" alt="Запуск подписи через Sign Firmware" width="222" height="60" style="width:100%;max-width:222px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 9: Запуск подписи через Sign Firmware</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p13-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p13-f01.png" alt="Выбор прошивки для подписи" width="963" height="784" style="width:100%;max-width:963px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 10: Выбор прошивки для подписи</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p14-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p14-f01.png" alt="Сообщение об успешной подписи прошивки" width="888" height="594" style="width:100%;max-width:888px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 11: Сообщение об успешной подписи прошивки</strong></figcaption>
</figure>

### 4. Программирование eFuse

Откройте eFuse tool, выберите подписанную производственную прошивку и Start. Пустое устройство по USB входит в `maskromrockusb`, запись начинается автоматически; поддерживается несколько устройств. RK312X требует отдельного питания eFuse через оснастку, RK3288 имеет программно управляемое питание. Сначала проверьте один экземпляр с полной подписанной прошивкой. eFuse — необратимая настройка, не эксперимент на обычной плате.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p15-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p15-f01.png" alt="Открытие инструмента eFuse" width="1224" height="744" style="width:100%;max-width:1224px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 12: Открытие инструмента eFuse</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p16-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p16-f01.png" alt="Выбор подписанной производственной прошивки" width="1206" height="792" style="width:100%;max-width:1206px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 13: Выбор подписанной производственной прошивки</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p17-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p17-f01.png" alt="Запуск инструмента и ожидание подключения устройства" width="1303" height="789" style="width:100%;max-width:1303px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 14: Запуск инструмента и ожидание подключения устройства</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p18-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p18-f01.png" alt="Просмотр результата программирования eFuse" width="868" height="657" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 15: Просмотр результата программирования eFuse</strong></figcaption>
</figure>

### 5. Обновить и проверить

Обновите подписанную прошивку подходящим производственным инструментом. Без записи eFuse этот Secure Boot не включается. Отрицательная проверка записывает неподписанную прошивку: загрузка не проходит, устройство остаётся в `maskromrockusb`, после Loader возникает ошибка. Ниже исходные снимки, не тесты ArmSoM.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p20-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p20-f01.png" alt="Загрузка подписанной прошивки в инструмент массовой записи" width="868" height="682" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 16: Загрузка подписанной прошивки в инструмент массовой записи</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p21-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p21-f01.png" alt="Успешное обновление подписанной прошивкой" width="868" height="683" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 17: Успешное обновление подписанной прошивкой</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p22-f01.png" target="_blank" rel="noopener" aria-label="Открыть изображение в полном размере"><img src="/assets/rockchip-tools/manuals/094883c784c1/p22-f01.png" alt="Отрицательная проверка с неподписанной прошивкой" width="868" height="682" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Рисунок 18: Отрицательная проверка с неподписанной прошивкой</strong></figcaption>
</figure>

### 6. Типичные ошибки

При ошибке eFuse проверьте питание и предыдущую запись устройства. Не диагностируйте многократной записью; сохраните ключи, версию прошивки, чип и журнал и сверяйтесь с его документацией.

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

## Каталог GitHub, версии и SHA-256

Откройте соответствующий каталог GitHub, выберите платформу и версию, проверьте хеш и распакуйте весь каталог. Ссылки ниже ведут в каталоги репозитория.

[Открыть каталог инструмента на GitHub](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/secureboot-tool)

| Платформа / версия | Файл | SHA-256 |
|---|---|---|
| Host to verify / 1.85 | `SecureBootTool_v1.85_foruser.zip` | `d241ccc7503a3202c68a036f51cdd7f5d2db2a7594eb749ec19e2ffb2c67681a` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Документы и исходные иллюстрации

- Rockchip Secure Boot Application Note_v1.2_20160202.pdf

## Связанные рабочие процессы

- [Полное руководство Rockchip Secure Boot: подпись, eFuse, OTP и проверка](/ru/articles/105-rockchip-secure-boot/)
- [Руководство разработчика Rockchip Linux Secure Boot](/ru/articles/203-rockchip-linux-secure-boot/)
- [rk_sign_tool и sign_tool: подпись и проверка прошивки Rockchip](/ru/articles/rockchip-tool-rk-sign-tool/)
- [EfuseTool 1.42: подготовка станции Secure Boot provisioning](/ru/articles/rockchip-tool-efuse-tool/)
- [Каталог инструментов Rockchip и руководств](/ru/articles/rockchip-tools-download-guide/)

## Документация плат ArmSoM

Требования платы и носителя проверяйте по руководству изделия. Эти ссылки — платформенные материалы, а не подтверждение проверки данного инструмента на изделиях.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
