---
title: "Rockchip Buildroot Weston: настройка экранов и ввода"
description: "Rockchip Buildroot Weston: настройка экранов и ввода — V1.4.5"
excerpt: "Rockchip Buildroot Weston: настройка экранов и ввода"
translation_key: "190-rockchip-buildroot-weston"
slug: "190-rockchip-buildroot-weston"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Buildroot Weston: настройка экранов и ввода

Платформенная справка ArmSoM по предоставленным китайскому и английскому оригиналам Rockchip. Проверяйте конкретную плату, SoC, SDK/BSP, ядро и периферию; поддержка всех плат ArmSoM не заявляется. Примеры и измерения источника не являются испытаниями ArmSoM. Команды и аппаратные тесты не выполнялись.

Относится к модифицированному Weston Rockchip Buildroot SDK; поддержка расширенных переменных в upstream не гарантируется.

Оба оригинала V1.4.5; сохранены все настройки до §2.16. Отдельных рисунков нет. Исправлены лишь PDF-переносы команд, матриц и комментариев, значения неизменны. Повторные export одной переменной показывают альтернативы, а не готовый скрипт. Функции с многоточиями неполные.

Различие CN/EN: §2.16 использует `>> /tmp/.weston_drm.conf` (добавление) в китайском и `> /tmp/.weston_drm.conf` (перезапись) в английском. Оба сохранены, RU/DE следуют английскому. Проверяйте обработчик динамической конфигурации SDK.

## 1. Введение

### 1.1 Обзор

Weston — эталонная реализация открытого протокола отображения Wayland. Rockchip Buildroot SDK по умолчанию использует DRM-бэкенд Weston. Указанный исходником репозиторий модифицированного Weston: https://github.com/JeffyCN/weston

### 1.2 Способы конфигурации

Rockchip Buildroot SDK Weston настраивается несколькими способами:

a. Параметры командной строки при запуске, например `weston --tty=2`. Скрипт: /etc/init.d/S49weston; в SDK: buildroot/package/weston/S49weston.

b. Файл weston.ini: /etc/xdg/weston/weston.ini и /etc/xdg/weston/weston.ini.d/; в SDK: buildroot/board/rockchip/common/base/etc/xdg/weston/weston.ini. Справка: https://fossies.org/linux/weston/man/weston.ini.man.

c. Специальные переменные окружения, обычно в /etc/profile.d/weston.sh; в SDK: buildroot/package/weston/weston.sh.

d. Файл динамической конфигурации DRM-бэкенда: по умолчанию /tmp/.weston_drm.conf, путь задаётся WESTON_DRM_CONFIG.

e. Правила udev: часть настроек устройств ввода Weston задаётся через udev.

## 2. Настройки

### 2.1 Идентификация экранов

Weston различает экраны по имени output(head). Имена видны в журнале запуска Weston:

```text
# weston&
[02:11:29.746] DRM: head 'DSI-1' found ...
```

### 2.2 Курсор

Тема и размер курсора задаются в секции shell файла weston.ini, например:

```text
    # /etc/xdg/weston/weston.ini

    [shell]
    cursor-theme=whiteglass # Buildroot SDK supports comix/obsidian/xcursor/xcursor-transparent cursor theme packages.
    cursor-size=24
```

### 2.3 Панель состояния

Цвет фона, положение и масштаб панели задаются в shell; программы быстрого запуска — в launcher файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[shell]
panel-color=0x90ff0000
# the color format is ARGB8888

panel-position=bottom
# top|bottom|left|right|none,none is disable

panel-scale=4
# scale up by 4

[launcher]
icon=/usr/share/icons/gnome/24x24/apps/utilities-terminal.png
# icon path

path=/usr/bin/gnome-terminal
# quick start command
```

### 2.4 Фон

Изображение и цвет фона задаются в shell, программы быстрого запуска — в desktop-launcher файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[shell]
background-image=/usr/share/backgrounds/gnome/Aqua.jpg
# Background pattern (wallpaper) absolute path

background-type=tile
# scale|scale-crop|tile

background-color=0xff002244
# The color format is ARGB8888, effective when no background pattern is set

[desktop-launcher]
icon=/usr/share/icons/hicolor/256x256/apps/chromium.png
# icon path

path=/usr/bin/chromium www.baidu.com
# quick start command

displayname=chromium
# display name
```

### 2.5 Простой и блокировка экрана

Тайм-аут простоя Weston задаётся параметром запуска или в секции core файла weston.ini:

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --idle-time=0&  # 0 means idle mode is disabled, in seconds
}
```

Или:

```text
# /etc/xdg/weston/weston.ini

[core]
idle-time=10
```

Блокировка экрана Weston настраивается в shell файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[shell]
locking=false
# lock screen is disabled

lockscreen-icon=/usr/share/icons/gnome/256x256/actions/lock.png
# unlock button icon

lockscreen=/usr/share/backgrounds/gnome/Garden.jpg
# background of lock screen
```

### 2.6 Цветовой формат

По умолчанию Weston в Buildroot SDK выводит ARGB8888. Для менее производительных платформ можно выбрать RGB565 в core файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[core]
gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

Формат каждого экрана можно отдельно задать в output файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

### 2.7 Ориентация экрана

Ориентация задаётся в output файла weston.ini:

```text
    # /etc/xdg/weston/weston.ini

    [output]
    name=LVDS-1

    transform=rotate-90
    # normal|rotate-90|rotate-180|rotate-270|flipped|flipped-90|flipped-180|flipped-270
```

Для динамического изменения ориентации используйте файл динамической конфигурации:

```text
    echo "output:all:rotate90" > /tmp/.weston_drm.conf # All screens rotate 90 degrees
    echo "output:eDP-1:rotate180" > /tmp/.weston_drm.conf # eDP-1 rotates 180 degrees
```

### 2.8 Разрешение и масштаб

Разрешение и масштаб экрана Weston задаются в output файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=1280x800
# should be an effective resolution supported by the screen

scale=2
# value must be an integer, support application level scaling
```

Чтобы масштабировать все экраны до заданного разрешения без изменения физического разрешения, задайте WESTON_DRM_VIRTUAL_SIZE:

```text
# /etc/profile.d/weston.sh
export WESTON_DRM_VIRTUAL_SIZE=1024x768
```

Для динамической настройки разрешения и масштаба используйте файл динамической конфигурации:

```text
    echo "output:HDMI-A-1:mode=800x600" > /tmp/.weston_drm.conf # change the resolution of HDMI-A-1 to 800x600
    echo "output:eDP-1:rect=<10,20,410,620>" > /tmp/.weston_drm.conf # eDP-1 display to the position of (10,20), the size is scaled to 400x600
    echo "output:HDMI-A-1:size=1920x1080" > /tmp/.weston_drm.conf # HDMI-A-1 scale to 1080p, the physical resolution is unchanged.
```

Если VOP аппаратно не поддерживает масштабирование, эти способы требуют 2D-ускорителя Rockchip RGA.

### 2.9 Замораживание экрана

При запуске Weston между загрузочным логотипом и интерфейсом кратковременно появляется чёрный экран. Его можно предотвратить временным замораживанием содержимого Weston одним из следующих способов. Добавьте --warm-up к параметрам запуска:

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --warm-up&
}
```

Или:

```text
    # /etc/init.d/S49weston
    start_weston()
    {
      export WESTON_FREEZE_DISPLAY=/tmp/.weston_freeze # Set a special configuration file path
      touch /tmp/.weston_freeze # Freeze the display
      /usr/bin/weston&
      sleep 1 && rm /tmp/.weston_freeze& # unfreeze after 1 second
    }
```

Или:

```text
    # /etc/init.d/S49weston
    start_weston()
    {
      echo "output:all:freeze" > /tmp/.weston_drm.conf # Freeze the display
      /usr/bin/weston&
      ...
      sleep 1 && \
      echo "output:all:unfreeze" > /tmp/.weston_drm.conf& # unfreeze  after 1 second
    }
```

### 2.10 Состояние экранов

DRM позволяет принудительно задать состояние экрана:

```text
echo on > /sys/class/drm/card0-HDMI-A-1/status # Force HDMI-A-1 connected
#on|off|detect, detect means hot-plug
```

Более подробные настройки доступны через динамический файл:

```text
    echo "output:DSI-1:off" > /tmp/.weston_drm.conf # Turn off screen
    echo "output:HDMI-A-1:freeze" > /tmp/.weston_drm.conf # Freeze screen
    echo "output:eDP-1:on" > /tmp/.weston_drm.conf # Turn on screen
    echo "output:HDMI-A-1:state=on" > /tmp/.weston_drm.conf #Force connected(should set screen mode on in weston.ini)
    echo "output:DSI-1:state=off" > /tmp/.weston_drm.conf #Force disconnected
    echo "output:DSI-1:state=detect" > /tmp/.weston_drm.conf #Use hot-plug
    echo "compositor:state:off" > /tmp/.weston_drm.conf # Turn off display
    echo "compositor:state:freeze" > /tmp/.weston_drm.conf # Freeze display
    echo "compositor:state:sleep" > /tmp/.weston_drm.conf # Turn off display and touch to wake
    echo "compositor:state:on" > /tmp/.weston_drm.conf # Turn on display
```

### 2.11 Несколько экранов

Weston в Buildroot SDK поддерживает зеркалирование, расширенный рабочий стол, настройку положения экранов и горячее подключение. При зеркалировании он пытается использовать RGA 2D, если VOP не поддерживает масштабирование или поворот. Настройки задаются переменными окружения:

```text
    # /etc/profile.d/weston.sh
    export WESTON_DRM_PRIMARY=HDMI-A-1 # Specify HDMI-A-1 as primary monitor
    export WESTON_DRM_SINGLE_HEAD=1 # Force using single monitor
    export WESTON_DRM_MIRROR=1 # In mirror mode (multi-screen with the same display), without setting this environment variable will be with different display
    export WESTON_DRM_KEEP_RATIO=1 # In mirror mode, scaling maintains the aspect ratio, without setting this variable will be full screen by force
    export WESTON_DRM_HEAD_MODE=primary # Only enable primary monitor
    export WESTON_DRM_HEAD_MODE=internal # Only enable internal monitors
    export WESTON_DRM_HEAD_MODE=external # Only enable external monitors
    export WESTON_DRM_HEAD_MODE=external-dual # Enable all monitors, and prefer the external ones
    export WESTON_DRM_HEAD_FALLBACK=1 # Fallback to any available monitor when none matched
    export WESTON_DRM_MASTER=1 # Allow disabling unused monitors

    export WESTON_OUTPUT_FLOW=horizontal # Laying outputs horizontally by default
    export WESTON_OUTPUT_FLOW=vertical # Laying outputs vertically by default
    export WESTON_OUTPUT_FLOW=same-as # Laying outputs at (0,0) by default
```

Отдельный экран можно выключить в output файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=off
# off|current|preferred|<WIDTHxHEIGHT@RATE>
```

Возможна и динамическая конфигурация:

```text
    echo "output:HDMI-A-1:pos=100,200" > /tmp/.weston_drm.conf # Set HDMI's position
    echo "output:HDMI-A-1:prefer" > /tmp/.weston_drm.conf # Show apps on HDMI by default
    echo "output:HDMI-A-1:primary" > /tmp/.weston_drm.conf # Specify HDMI as primary
    echo "output:HDMI-A-1:pin" > /tmp/.weston_drm.conf # Try to pin later views to the screen
```

### 2.12 Устройства ввода

По умолчанию службе Weston нужно хотя бы одно устройство ввода. Если его нет, задайте специальную настройку в core файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[core]
require-input=false
```

При нескольких экранах устройство ввода привязывается к экрану через WL_OUTPUT в правиле udev:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{WL_OUTPUT}="HDMI-A-1"
```

Или через WL_SEAT:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{WL_SEAT}="seat1"
```

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

seat=seat1
```

Или через динамическую конфигурацию:

```text
echo "output:HDMI-A-1:input=*" > /tmp/.weston_drm.conf # Match all devices
echo "output:HDMI-A-1:input=" > /tmp/.weston_drm.conf # Disallow all devices
echo "output:HDMI-A-1:input=event6" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix*" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix-ts" > /tmp/.weston_drm.conf
```

Vendor ID, product ID и имя устройства можно получить утилитой evtest:

```text
# evtest /dev/input/event8 | head -3
Input driver version is 1.0.1
Input device ID: bus 0x18 vendor 0xdead product 0xbeef version 0x28bb
Input device name: "goodix-ts"
```

### 2.13 Калибровка устройств ввода

Для калибровки сенсорного экрана используйте WESTON_TOUCH_CALIBRATION:

```text
    # /etc/profile.d/weston.sh
    export WESTON_TOUCH_CALIBRATION="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Либо правило udev:

```text
    # /lib/udev/rules.d/99-goodix-ts.rules
    ATTRS{name}=="goodix-ts", ENV{LIBINPUT_CALIBRATION_MATRIX}="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Либо динамическую конфигурацию:

```text
    echo "calibration:event9:-1 0 1 0 -1 1" > /tmp/.weston_drm.conf
    echo "calibration:goodix-ts:1 0 0 0 -1 1" > /tmp/.weston_drm.conf
    echo "calibration:event9:restore" > /tmp/.weston_drm.conf # Restore the previous setting
    echo "calibration:goodix-ts:clear" > /tmp/.weston_drm.conf # Clear all settings
```

Параметры получают утилитой weston-calibrator: она выводит случайные точки, которые нужно последовательно нажать. Пример результата: `Final calibration values: 1.013788 0.0 -0.061495 0.0 1.332709 -0.276154`.

Также можно использовать новый weston-touch-calibrator; для него требуется:

```text
# /etc/xdg/weston/weston.ini

[libinput]
touchscreen_calibrator=true
calibration_helper=/bin/weston-calibration-helper.sh
```

### 2.14 Платформа без GPU

Weston в SDK по умолчанию ускоряет отрисовку через GPU. Если GPU отсутствует или недостаточно производителен, можно использовать Rockchip RGA 2D. В Buildroot SDK включите BR2_PACKAGE_LINUX_RGA и BR2_PACKAGE_WESTON_DEFAULT_PIXMAN.

### 2.15 Модификатор ARM AFBC

На чипах с AFBC Weston в SDK поддерживает вывод в сжатом GPU-формате ARM AFBC.

```text
# /etc/profile.d/weston.sh
# export WESTON_DISABLE_ATOMIC=1
export WESTON_ALLOW_GBM_MODIFIERS=1
```

### 2.16 Уменьшение разрешения интерфейса

При недостаточной производительности интерфейса или пропускной способности DDR можно уменьшить разрешение UI:

```text
echo "output:HDMI-A-1:down-scale=0.5" > /tmp/.weston_drm.conf
```

## Ссылки исходника

[ArmSoM Docs](https://docs.armsom.org/)

[https://github.com/JeffyCN/weston](https://github.com/JeffyCN/weston)

[https://fossies.org/linux/weston/man/weston.ini.man](https://fossies.org/linux/weston/man/weston.ini.man)

{% endraw %}
