---
title: "Загрузочное видео Rockchip Android"
description: "Настройка файлов загрузочного видео Rockchip Android, длительности, громкости и задержки запуска."
excerpt: "Настройка файлов загрузочного видео Rockchip Android, длительности, громкости и задержки запуска."
translation_key: "255-rockchip-android-boot-video"
slug: "255-rockchip-android-boot-video"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}


Источник:RK-SM-YF-505 V1.0.0,китайский. Работа,настройка и использование bootvideo SDK Rockchip;не тесты ArmSoM и не подтверждение новых SDK. Команды не выполнялись. Все рисунки из CN,английского источника нет.

## 1 Обзор

Руководство объясняет принцип работы, настройку и использование загрузочного видео Android. Для быстрой настройки перейдите к главе 3.

## 2 Принцип работы загрузочного видео

Быстрое использование см.§3. Штатный bootanimation дополнен воспроизведением/управлением bootvideo. Audio service обрабатывает звук загрузочного видео для стабильной громкости. Исходная схема состоит из двух объектов,ниже последовательно.

![Поток bootvideo,верхняя часть](/docs/rockchip-android-boot-video/images/bootvideo-flow.png)

Поток bootvideo,верхняя часть - Оригинальная иллюстрация;страница PDF 6 (CN).

![Поток bootvideo,продолжение](/docs/rockchip-android-boot-video/images/audio-flow.png)

Поток bootvideo,продолжение - Оригинальная иллюстрация;страница PDF 6 (CN).

## 3 Использование

### 3.1 Включение и отключение

Описанный RKSDK уже включает bootvideo. Макрос в device/rockchip/common/BoardConfig.mk:true включает,false отключает;выберите один.

```make
BOOT_VIDEO_ENABLE ?= true
```

```make
BOOT_VIDEO_ENABLE ?= false
```

### 3.2 Расположение видеофайла

Поместите bootanimation.ts в device/rockchip/common/bootvideo/bootanimation.ts. Код распознаёт имя;другой поддерживаемый формат можно переименовать без преобразования. Это не добавляет кодеки. Сборка копирует в media раздела system;выход на снимке ниже.

### 3.3 Результат сборки

После успешной сборки bootanimation.ts копируется в каталог media раздела system. На исходном снимке показан следующий путь для RK3328 BOX:

```text
out/target/product/rk3328_box/system/media/bootanimation.ts
```

![Результат сборки](/docs/rockchip-android-boot-video/images/installed-file.png)

Результат сборки - Оригинальная иллюстрация;страница PDF 7 (CN).

### 3.4 Требования к видео

Теоретически подходит видео,нормально играющее в локальном Media Center приставки. Но загрузка многих служб создаёт высокую нагрузку:учитывайте чип,предпочитайте аппаратное декодирование. Рекомендуемый максимум:RK3328/RK3228H 1080p;RK322x/RK312x 720p.

### 3.5 Управление свойствами

| Свойство | Значения |
| --- | --- |
| persist.sys.bootvideo.enable | true вкл;false выкл |
| persist.sys.bootvideo.showtime | -2 по умолчанию:длительность файла,полное воспроизведение. -1:без таймера,сразу остановить по запросу системы. Положительное целое:секунды;20 играет20с,при раннем конце держит последний кадр. Здесь &gt;0;свыше120 ограничено120с. |
| persist.sys.bootvideo.vol | 1–100,максимум100 |
| persist.sys.bootvideo.delaytime | Отладочная задержка ≥0 секунд;5 означает5с |

## 4 Вопросы и ответы

Источник:«добавить позже»;других ответов нет.

{% endraw %}
