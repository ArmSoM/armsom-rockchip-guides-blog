---
title: "Защита от сброса к заводским настройкам Rockchip Android"
description: "Защита от сброса к заводским настройкам Rockchip Android"
excerpt: "Защита от сброса к заводским настройкам Rockchip Android"
translation_key: "257-rockchip-android-factory-reset-protection"
slug: "257-rockchip-android-factory-reset-protection"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android"]
---

{% raw %}

# Защита от сброса к заводским настройкам Rockchip Android

Полный технический текст страницы 6 двуязычного RK-SM-YF-206 V1.0. Android 8.1 и новее — исторический охват источника, не текущая гарантия совместимости. Китайский/английский основаны на своих абзацах; русский/немецкий переведены полностью. Китайское уточнение «не владелец аккаунта» явно сохранено в других языках. Технических рисунков/таблиц нет. Даты, заявления, контакты, аудитория и история изменений удалены. Прошивка, изменение безопасности и аппаратные тесты не выполнялись.

Безопасность и проверка: FRP защищает от несанкционированного использования. Утверждение об обслуживании через misc сохранено только как исторический материал, не универсальный способ; процедура обхода аккаунта не добавлена. Восстановление аккаунта — через официальный процесс владельца или авторизованный сервис. Прошивка может стереть данные и изменить защиту. Заголовок 2.1 упоминает отключение, но текст содержит только включение false→true; отсутствующие шаги не придуманы. Во второй строке «Google Service and frp overlay» в источнике нет #; она сохранена и не является корректной отдельной командой make. Зависимость GMS и имя документа сохранены.

<!-- source:bilingual p6 unit:0 -->

## 1 Обзор

<!-- source:bilingual p6 unit:1 -->

Документ описывает настройку Android FRP для Google Factory Reset Protection. Если функция включена, после входа в аккаунт Google и сброса через recovery комбинацией кнопок лицом, не являющимся владельцем аккаунта, отсутствие Wi-Fi или невозможность войти в аккаунт не позволяет завершить мастер первоначальной настройки.

<!-- source:bilingual p6 unit:2 -->

Источник утверждает, что прошивка misc может форматировать учётную запись для восстановления при возврате на завод.

<!-- source:bilingual p6 unit:3 -->

Для быстрого использования см. главу 2 «Быстрое включение».

<!-- source:bilingual p6 unit:4 -->

## 2 Быстрое включение

<!-- source:bilingual p6 unit:5 -->

### 2.1 Включение и отключение

<!-- source:bilingual p6 unit:6 -->

Описанная FRP требует GMS (сервисной платформы Google). Для иных требований см. [FactoryResetProtectionforPartners.pdf] и самостоятельно настройте нужные функции.

<!-- source:bilingual p6 unit:7 -->

Для включения измените следующие два значения в device/rockchip/rk3xxx/BoardConfig.mk:

<!-- source:bilingual p6 unit:8 -->

```text
#Google Service and frp overlay
BUILD_WITH_GOOGLE_MARKET := false
BUILD_WITH_GOOGLE_FRP := false
```

<!-- source:bilingual p6 unit:9 -->

На:

<!-- source:bilingual p6 unit:10 -->

```text
Google Service and frp overlay
BUILD_WITH_GOOGLE_MARKET := true
BUILD_WITH_GOOGLE_FRP := true
```

<!-- source:bilingual p6 unit:11 -->

Это включает FRP.

{% endraw %}
