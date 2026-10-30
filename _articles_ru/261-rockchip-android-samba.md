---
title: "Rockchip Android Samba: клиент и подключение CIFS"
description: "Rockchip Android Samba: клиент и подключение CIFS — Android / Rockchip"
excerpt: "Rockchip Android Samba: клиент и подключение CIFS — Android / Rockchip"
translation_key: "261-rockchip-android-samba"
slug: "261-rockchip-android-samba"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Справочный материал для разработчиков ArmSoM. Источник: RK-SM-YF-295 V1.0.0. Перед применением сопоставьте SoC, Android SDK/BSP, конфигурацию ядра и инструменты с платой. Исходник не подтверждает поддержку конкретной платы ArmSoM или версии ядра. Проверка на оборудовании ArmSoM не выполнялась; примеры и снимки взяты из исходника.

## Область применения исходника

Руководство V1.0.0 описывает Samba на Rockchip Android 10/11. В исходнике указаны все чипы Rockchip; это не означает, что каждый образ ArmSoM содержит клиент или поддержку CIFS. Предоставлена только китайская PDF; во всех версиях используются два исходных снимка.

## 1 Samba Client

### 1.1 Приложение Android Samba Client

Google предоставляет открытый клиент Samba для Android: [samba-documents-provider](https://github.com/google/samba-documents-provider/). В исходном руководстве говорится, что официального готового APK нет: его можно собрать самостоятельно или получить сборку другого автора. Это утверждение исходника, а не проверка текущих выпусков.

![Форма подключения Android Samba Client](/docs/rockchip-android-samba/images/p002-01.png)

*Форма подключения Android Samba Client — Исходный рисунок из китайского PDF, p. 2.*

Введите общую папку сервера Samba и данные учетной записи, затем нажмите `MOUNT`. После успешного подключения приложение автоматически открывает Google Files для просмотра общей папки.

![Подключенная папка в Google Files](/docs/rockchip-android-samba/images/p003-01.png)

*Подключенная папка в Google Files — Исходный рисунок из китайского PDF, p. 3.*

### 1.2 Подключение общей папки из командной строки

Ядро должно поддерживать CIFS. Включите следующую настройку, пересоберите образ ядра и прошейте его. По исходной процедуре изменения в Android не требуются.

```text
CONFIG_CIFS=y
```

Сначала настройте сервер Samba на ПК; исходник не описывает настройку сервера. На устройстве откройте ADB shell, создайте точку подключения и подключите папку. Вторая команда mount — конкретный пример из исходника; выберите одну команду для своего сервера.

```sh
adb shell
mkdir -p /sdcard/share
mount -t cifs -o username=<SMB_USER>,password=<SMB_PASSWORD>,vers=2.1 //<SMB_IP>/<SMB_PATH> /sdcard/share

mount -t cifs -o username=all,password=all,vers=2.1 //10.10.10.201/all /sdcard/share
```

После подключения просмотрите содержимое папки; после работы отключите ее.

```sh
ls -l /sdcard/share
umount /sdcard/share
```

Официальная документация: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
