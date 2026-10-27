---
title: "Rockchip: адаптация сторонних систем"
description: "Rockchip: адаптация сторонних систем — V1.0.2"
excerpt: "Rockchip: адаптация сторонних систем"
translation_key: "206-rockchip-third-party-system-adaptation"
slug: "206-rockchip-third-party-system-adaptation"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, Debian]
---

{% raw %}

# Rockchip: адаптация сторонних систем

Платформенная справка ArmSoM: RK-KF-YF-917 V1.0.2, 9/10 страниц CN/EN. Область оригинала — RK3568/Linux 4.19 и RK3588/Linux 5.10, главным образом пользовательские библиотеки и службы Debian-подобных систем. Установка на всех платах ArmSoM не гарантируется. Сверяйте SoC, SDK/BSP, ядро, архитектуру, ABI пакетов, GPU, камеру и беспроводной модуль. Команды — исходные примеры, на оборудовании ArmSoM не выполнялись.

Оба оригинала V1.0.2; сохранены восемь глав, обе таблицы и все примеры. Рисунков нет. §4.1 говорит opengl, таблица и §4.6 — opengles: противоречие сохранено, это не современная матрица поддержки. Команда §5.5 с uri/file/кавычками и видеовыходом — неполный исходный пример. В §6.2 английский путь `/tmp /0.yuv` содержит пробел, китайский — `/tmp/0.yuv`. Написания сохранены с предупреждением; проверяйте реальный синтаксис и узлы.

## 1. Аппаратные блоки RK, требующие адаптации

GPU (Graphics Processing Unit), также называемый графическим ядром или визуальным процессором, ускоряет геометрические преобразования, освещение, кубические карты окружения, смешивание вершин, сжатие текстур, рельефное отображение и упомянутый в оригинале 256-битный движок с двойной текстурой и четырьмя пикселями. GPU интегрирован в SoC RK.

RGA — 2D-ускоритель вращения, обрезки, масштабирования и других операций; интегрирован в SoC.

VPU — ускоритель видеокодирования и декодирования нескольких форматов; интегрирован в SoC.

ISP обрабатывает сигнал переднего датчика изображения; интегрирован в SoC.

NPU — встроенный нейросетевой процессор с архитектурой параллельных вычислений, управляемых данными. Особенно подходит для больших массивов видео и изображений. Разработан для ИИ Интернета вещей, ускоряет нейросети, преодолевая низкую эффективность традиционных чипов; интегрирован в SoC.

Wi-Fi/BT — модуль связи ближнего действия, адаптированный к плате.

## 2. Программная адаптация RK

| Путь исходников | Описание |
| --- | --- |
| SDK/external/libmali | Пользовательские интерфейсы GPU, главным образом общие OpenGL ES. Для Debian-подобных xserver/wayland приложений интерфейсы необходимо адаптировать. |
| SDK/external/xserver | Патчи аппаратного ускорения xserver. Для xserver используйте патчи этого репозитория. |
| SDK/external/linux-rga | Пользовательский интерфейс RGA. |
| SDK/external/mpp | Пользовательский интерфейс VPU. |
| SDK/external/rknpu2 | Пользовательский интерфейс NPU. |
| SDK/external/camera_engine_rkaiq | Пользовательский интерфейс ISP. |
| SDK/external/drm-cursor | Пользовательский интерфейс аппаратного слоя курсора. |

## 3. Особенности программной адаптации

В Debian-подобных системах возможны многочисленные зависимости версий. Если указанные ниже пакеты не устанавливаются, перенесите исходники на целевую машину и соберите заново:

```text
cd 'Source code directory'
sudo apt build-dep .
sudo DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d  -us
```

## 4. Служба отображения

### 4.1 Обзор

Состав отображения в Debian-подобной системе: приложение отображения + графический фреймворк + графический интерфейс + аппаратный графический блок. Примеры приложений: x11, gnome, kde, xfce4, sdl2. Фреймворки: wayland, xserver, gbm. Оригинал здесь говорит о поддержке только opengl для Rockchip; аппаратный блок — GPU. Далее приведены сочетания. Учитывайте дату оригинала и сверяйте поддержку на официальных сайтах проектов.

| Приложение | Поддерживаемый фреймворк | Поддерживаемый интерфейс |
| --- | --- | --- |
| x11 | xserver | opengles/gbm |
| gnome | xserver/wayland | opengles/gbm |
| kde | xserver/wayland | opengles/gbm |
| xfce4 | xserver | opengles/gbm |
| sdl2 | xserver/wayland | opengles/gbm |

Сначала определите приложение отображения, затем его графический фреймворк — xserver или wayland — и выполняйте соответствующую адаптацию.

### 4.2 GPU

Определите xserver или wayland — два поддерживаемых в оригинале фреймворка — и установите SDK/debian/packages/"ARCH"/libmali/libmali-***.deb. Например, для x11 на RK3588 с GPU valhall-g610-g6p0 нужен пакет:

```text
SDK/debian/packages/arm64/libmali/libmali-valhall-g610-g6p0-x11_1.9-1_arm64.deb
```

### 4.3 RGA

Установочный пакет:

```text
SDK/debian/packages/'ARCH'/rga/*.deb
```

### 4.4 drm-cursor

Установочный пакет:

```text
SDK/debian/packages/arm64/libdrm-cursor/*.deb
```

### 4.5 xserver

Версий xserver много. Определите версию своей системы, перенесите патчи исходников RK на неё и соберите заново. Создание патчей:

```text
cd 'source directory'

git format-patch e4f4521ca
```

Предварительно собранные пакеты версии 1.20.11:

```text
SDK/debian/packages/'ARCH'/xserver/xserver-common_1.20.11-1_all.deb

SDK/debian/packages/'ARCH'/xserver/xserver-xorg-core_1.20.11-1_'ARCH'.deb

SDK/debian/packages/'ARCH'/xserver/xserver-xorg-legacy_1.20.11-1_'ARCH'.deb
```

xserver также нужен сценарий запуска для инициализации. В Debian-подобной системе можно попробовать скопировать его; иначе настройте свою систему по его образцу:

```text
SDK/debian/overlay/etc/X11
```

### 4.6 Проверка адаптации

Ускорение отображения использует стандартный интерфейс opengles. Если система использует opengl, оригинал требует перенос на opengles. При успешной адаптации во время рендеринга или перемещения окон загрузка GPU в соответствующем узле меняется. Пример RK3588:

```text
cat /sys/devices/platform/fb000000.gpu/utilisation
```

Примечание: GPU-узлы различаются между платформами.

## 5. Видеокодирование и декодирование

### 5.1 Обзор

Служба состоит из верхнего мультимедийного фреймворка, промежуточной библиотеки mpp и аппаратного кодека. В открытом ПО распространён GStreamer; ниже он используется как пример. mpp связывает универсальное стороннее ПО, например GStreamer, с аппаратными кодеками.

### 5.2 mpp

Установочный пакет:

```text
SDK/debian/packages/'ARCH'/mpp/*.deb
```

Права некоторых узлов задаются по образцу:

```text
SDK/debian/overlay/etc/udev/rules.d/99-rockchip-permissions.rules
```

Проверка конфигурации mpp:

```text
# mpi_enc_test -w 1920 -h 1080 -t 7 -o /tmp/test.h264
# mpi_dec_test -w 1920 -h 1080 -t 7 -i /tmp/test.h264
```

### 5.3 Мультимедийное ПО

Мультимедийных фреймворков много. Оригинал рекомендует вызывать интерфейсы mpp непосредственно из проигрывателя для адаптации видеокодека. См. Rockchip_Developer_Guide_MPP_CN.pdf.

### 5.4 GStreamer

Для RK доступны предварительно собранные пакеты gst-base:

```text
SDK/debian/packages/'ARCH'/gst-plugins-base1.0/*.deb
SDK/debian/packages/'ARCH'/gst-plugins-bad1.0/*.deb
SDK/debian/packages/'ARCH'/gst-plugins-good1.0/*.deb
```

RK поддерживает и универсальный GStreamer. Сначала установите официальные компоненты GStreamer или вышеприведённые совместимые с системой gst-base-пакеты, затем плагин gst-rockchip:

```text
SDK/debian/packages/'ARCH'/gst-rkmpp/*.deb
```

### 5.5 Проверка адаптации

```text
sudo GST_DEBUG=2 gst-launch-1.0 playbin uri=file 'absolute video path' video-sink=“show sink” audio-sink=fakesink
```

Сообщения о вызове mpp, согласно оригиналу, показывают успешное подключение аппаратного декодирования.

## 6. Камера

### 6.1 camera_engine_rkaiq

Установочный пакет:

```text
SDK/debian/packages/'ARCH'/rkaiq/camera_engine_rkaiq_'ARCH'.deb
```

### 6.2 Проверка адаптации

Командой v4l2 проверьте успешный захват и корректность изображения. Узлы, форматы и разрешения различаются между камерами и платформами; измените команду под фактическое оборудование:

```text
v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-skip=3 --stream-to=/tmp /0.yuv --stream-count=1 --stream-poll
```

## 7. NPU

### 7.1 rknn_runtime

rknn_runtime — пользовательская библиотека; скопируйте её в целевую файловую систему.

```text
SDK/external/rknpu2/Linux/librknn_api/'ARCH'/librknn_api.so

SDK/external/rknpu2/Linux/librknn_api/'ARCH'/librknnrt.so
```

### 7.2 rknn_server

rknn_server обеспечивает связь с платой при работе rknntool2 на PC. Если модель обучена на PC, преобразована в rknn и затем перенесена на плату, эта служба не нужна.

```text
SDK/external/rknpu2/Linux/rknn_server/'ARCH'/usr/bin/*
```

### 7.3 Демонстрации rknn

См.:

```text
SDK/external/rknpu2/examples
```

## 8. Wi-Fi/BT

Подробности в Rockchip_Developer_Guide_Linux_WIFI_BT_CN.pdf. SDK содержит готовые пакеты:

```text
SDK\debian\packages\'ARCH'\rkwifibt\*.deb
```

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
