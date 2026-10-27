---
title: "Предустановка приложений Rockchip Android"
description: "Предустановка приложений Rockchip Android"
excerpt: "Предустановка приложений Rockchip Android"
translation_key: "254-rockchip-android-application-preinstallation"
slug: "254-rockchip-android-application-preinstallation"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android"]
---

{% raw %}

# Предустановка приложений Rockchip Android

Полные технические страницы 6–7 двуязычного RK-SM-YF-203 V1.2. Технический охват: Android 8.1 и новее, с обновлением для Android Q; исторические сведения требуют проверки целевого BSP. Китайский/английский следуют исходным текстам с восстановлением английских пробелов; русский/немецкий переведены полностью. Технических изображений/таблиц нет. Даты обложки, заявления, контакты, аудитория и история изменений удалены. Команды, прошивка и аппаратные тесты не выполнялись.

Проверка: сохранены три варианта установки и оба набора трёх каталогов в исходном порядке, соединена межстраничная связь. Путь скрипта source не указан и не придуман. $OUT/oem вместе с odm/odm.img сохранены; сверяйте целевой SDK. Ограничение systemuid и пример штатной mk-интеграции сохранены. Прошивка может стереть данные: разрешённое устройство, резервная копия и проверенный образ обязательны. Документ не предоставляет права распространения сторонних APK.

<!-- source:bilingual p6 unit:0 -->

## 1 Обзор

<!-- source:bilingual p6 unit:1 -->

Предустановка приложений Android означает включение подготовленных сторонних приложений в систему при настройке продукта по требованиям производителя.

<!-- source:bilingual p6 unit:2 -->

Виды предустановки:

<!-- source:bilingual p6 unit:3 -->

1. Установка приложений, которые нельзя удалить.

<!-- source:bilingual p6 unit:4 -->

2. Установка приложений с возможностью окончательного удаления.

<!-- source:bilingual p6 unit:5 -->

3. Установка приложений, автоматически восстанавливаемых после сброса к заводским настройкам, если они были удалены.

<!-- source:bilingual p6 unit:6 -->

## 2 Включение функции

<!-- source:bilingual p6 unit:7 -->

### 2.1 Настройка и использование

<!-- source:bilingual p6 unit:8 -->

После source выполните следующую команду для определения целевого каталога, например device/rockchip/rk3126c/.

<!-- source:bilingual p6 unit:9 -->

```text
get_build_var TARGET_DEVICE_DIR
```

<!-- source:bilingual p6 unit:10 -->

Целевой каталог содержит три папки:

<!-- source:bilingual p6 unit:11 -->

```text
1. preinstall
2. preinstall_del_forever
3. preinstall_del
```

<!-- source:bilingual p6 unit:12 -->

Они соответствуют видам из обзора в указанном порядке. Поместите приложения в нужные папки. Предпочтительны английские имена APK без пробелов.

<!-- source:bilingual p6 unit:13 -->

После успешного make соответствующие папки создаются в $OUT/oem:

<!-- source:bilingual p6 unit:14 -->

```text
1. bundled_persist-app
2. bundled_uninstall_gone-app
3. bundled_uninstall_back-app
```

<!-- source:bilingual p6 unit:15 -->

Они также соответствуют видам из обзора.

<!-- source:bilingual p7 unit:16 -->

После прошивки система автоматически устанавливает приложения в соответствующие каталоги.

<!-- source:bilingual p7 unit:17 -->

Примечание: предустановка приложений с systemuid не поддерживается. Используйте штатный способ Android для написания mk-файла; пример интеграции — vendor/rockchip/common/apps/RkDeviceTest/.

<!-- source:bilingual p7 unit:18 -->

### 2.2 Результат сборки

<!-- source:bilingual p7 unit:19 -->

После сборки конфигурационные файлы выводятся в раздел odm ($OUT/oem/). После добавления обязательно прошейте odm.img, чтобы изменения вступили в силу.

{% endraw %}
