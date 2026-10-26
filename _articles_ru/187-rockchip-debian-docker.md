---
title: "Rockchip кросс-компиляция Debian в Docker"
description: "Rockchip кросс-компиляция Debian в Docker — V1.2.1"
excerpt: "Rockchip кросс-компиляция Debian в Docker"
translation_key: "187-rockchip-debian-docker"
slug: "187-rockchip-debian-docker"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip кросс-компиляция Debian в Docker

Платформенная справка ArmSoM по предоставленным китайскому и английскому оригиналам Rockchip. Проверяйте конкретную плату, SoC, SDK/BSP, ядро и периферию; поддержка всех плат ArmSoM не заявляется. Примеры и измерения источника не являются испытаниями ArmSoM. Команды и аппаратные тесты не выполнялись.

Сборка многоархитектурных deb-пакетов Debian на Ubuntu PC; таблица сохраняет исторические версии источника.

Оба оригинала V1.2.1; все технические главы сохранены, отдельных рисунков нет. Китайские шаблоны `<package_dir>`/`<pkg_dev>` отличаются от английских `<package dir>`/`<package-name>`; RU/DE следуют английскому. Шаблон с пробелом не является готовым путём. В китайском примере сохранены исходные `rockchip 。` и полноширинное двоеточие приглашения; работоспособность не заявляется. Исправлены только переносы, например `dpkg-buildpackage`. Старые Ubuntu, имена пакетов и «последняя версия» относятся ко времени источника. Переносимость зависит от архитектуры, ядра и устройств.

| Пакет | Версия | ОС |
| --- | --- | --- |
| glmark2 | 2021.02 | Debian |
| gst-plugins-base | 1.14.4/1.18.5 | Debian |
| gstreamer-rockchip | 1.14.4 | Debian |
| libdrm | 2.4.97/2.4.104 | Debian |
| libdrm-cursor | 1.4.0 | Debian |
| libmali | 1.9.0 | Debian |
| mpp | 1.5.0 | Debian |
| libv4l-rkmpp | 1.5.0 | Debian |
| openbox | 3.6.1 | Debian |
| pcmanfm | 1.2.5 | Debian |
| rga | 2.1.0/2.2.0 | Debian |
| rkisp | 2.2.0 | Debian |
| rkaiq | 5.0 | Debian |
| xserver | 1.20.4/1.20.11 | Debian |
| wifibt | 1.0.0 | Debian |
| rktoolkit | 1.0.0 | Debian |

## 1. Rockchip Docker

Docker упрощает создание, развёртывание и запуск приложений в контейнерах. Разработчик упаковывает приложение вместе с библиотеками и зависимостями. В исходнике это описано как возможность запуска на других Linux-машинах независимо от различий их настроек. В некотором отношении Docker похож на виртуальную машину, но не создаёт полную виртуальную ОС: приложение использует ядро Linux хоста, а в пакет включаются недостающие компоненты. По исходнику это повышает производительность и уменьшает размер приложения. Docker имеет открытый исходный код: любой может участвовать в разработке и добавлять необходимые функции. Для Rockchip Docker исходник ссылается на сторонний проект docker-rockchip.

## 2. Требования к ОС

В исходнике перечислены следующие 64-разрядные Ubuntu:

- Jammy 22.04 (LTS)
- Focal 20.04 (LTS)
- Bionic 18.04 (LTS)
- Xenial 16.04 (LTS)
- Trusty 14.04 (LTS)

По умолчанию dockerfile предназначен для ARM64. Для 32-разрядных SoC скопируйте `dockerfile-32` в `dockerfile`: `cp dockerfile-32 dockerfile`.

### 2.1 Установка Docker

Исходная команда установки Docker; для Ubuntu 14.04 в исходнике предписано заменить docker на docker.io:

```text
sudo apt-get install docker qemu-user-static binfmt-support
```

Запустите службу Docker:

```text
sudo service docker start
```

Соберите образ Docker из dockerfile:

```text
sudo docker build -t rockchip .
```

Получится образ rockchip с окружением кросс-компиляции Debian для нескольких архитектур.

### 2.2 Сборка приложения

Откройте оболочку контейнера:

```text
sudo docker run -it -v <package dir>:/home/rk/packages rockchip /bin/bash
```

Начните сборку. Для 32-разрядных ARM SoC:

```text
cd /home/rk/packages/<package-name>
DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d -uc -us -aarmhf
ls ../ | grep *.deb
```

Для 64-разрядных ARM SoC:

```text
cd /home/rk/packages/<package-name>
DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d -uc -us -aarm64
ls ../ | grep *.deb
```

### 2.3 Изменение образа

Чтобы изменить образ Docker, откройте оболочку следующей командой:

```text
sudo docker run -it rockchip /bin/bash
```

После выхода из контейнера сохраните изменения следующей командой:

```text
sudo docker commit  <container_id> rockchip
```

## 3. Дополнительная информация

Дополнительная документация Docker: https://docs.docker.com

## 4. Пример

Создание libmali-bifrost-g52-g2p0-x11_1.9-1_arm64.deb в проекте libmali:

```text
~/work/docker/docker-rockchip$sudo service docker start
~/work/docker/docker-rockchip$sudo docker build -t rockchip .
~/work/docker/docker-rockchip$sudo docker run -it -v /home/wxt/work:/home/rk/packages rockchip /bin/bash
rk@2888134f9c12:/$ cd /home/rk/packages/docker/libmali
rk@2888134f9c12:~/packages/docker/libmali$ DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d -uc -us -aarm64
```

В результате пакеты deb будут доступны в ~/packages/docker/. Исходник перечисляет проекты, из которых можно собирать deb-пакеты:

- glmark2
- libmali
- mpp
- rga
- rkwifbt
- gstreamer-rockchip

## Ссылки исходника

[ArmSoM Docs](https://docs.armsom.org/)

[https://github.com/docker/docker](https://github.com/docker/docker)

[https://opensource.com/resources/what-open-source](https://opensource.com/resources/what-open-source)

[https://github.com/Fruit-Pi/docker-rockchip](https://github.com/Fruit-Pi/docker-rockchip)

[https://docs.docker.com/](https://docs.docker.com/)

[https://salsa.debian.org/games-team/glmark2](https://salsa.debian.org/games-team/glmark2)

[https://github.com/Fruit-Pi/libmali](https://github.com/Fruit-Pi/libmali)

[https://github.com/Fruit-Pi/mpp](https://github.com/Fruit-Pi/mpp)

[https://github.com/Fruit-Pi/linux-rga](https://github.com/Fruit-Pi/linux-rga)

[https://github.com/Fruit-Pi/rkwifibt](https://github.com/Fruit-Pi/rkwifibt)

[https://github.com/Fruit-Pi/gstreamer-rockchip](https://github.com/Fruit-Pi/gstreamer-rockchip)

{% endraw %}
