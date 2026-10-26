---
title: "Rockchip Linux Graphics: архитектура и несколько экранов"
description: "Rockchip Linux Graphics: архитектура и несколько экранов — V1.2.0"
excerpt: "Rockchip Linux Graphics: архитектура и несколько экранов"
translation_key: "191-rockchip-linux-graphics"
slug: "191-rockchip-linux-graphics"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Linux Graphics: архитектура и несколько экранов

Платформенная справка ArmSoM по предоставленным китайскому и английскому оригиналам Rockchip. Проверяйте конкретную плату, SoC, SDK/BSP, ядро и периферию; поддержка всех плат ArmSoM не заявляется. Примеры и измерения источника не являются испытаниями ArmSoM. Команды и аппаратные тесты не выполнялись.

Матрица Buildroot/Debian/Yocto — историческая справка; проверяйте GPU, пакет драйвера и API по BSP.

Оба V1.2.0; техническая матрица предисловия и полный текст сохранены. ZH использует 2 китайских рисунка, EN/RU/DE — 2 английских. «Нет OPENGL» относится к стеку источника, не ко всем чипам, Mesa или новым BSP. Связь drmModeSetCrtc/SetPlane/PageFlip упрощена в источнике; проверяйте реальные API по используемой libdrm.

| Чип | Buildroot | Debian | Yocto |
| --- | --- | --- | --- |
| RK180X | Y | N | N |
| RK3036 | Y | N | N |
| RK312X/PX3SE | Y | N | N |
| RK322X | Y | N | N |
| RK3288 | Y | Y | Y |
| RK3308 | Y | N | N |
| RK3326/PX30 | Y | Y | Y |
| RK3358 | Y | N | N |
| RK3399/RK3399Pro | Y | Y | Y |
| RK356X | Y | Y | Y |
| RK3588 | Y | Y | Y |

## 1. Введение в Rockchip Linux Graphics

### 1.1 Обзор

Графическая подсистема Rockchip Linux основана на DRM и DMA-BUF и предоставляет эффективное окружение, соответствующее стандартам ARM Linux. Универсальная архитектура упрощает адаптацию и позволяет широко использовать готовые компоненты; по исходнику поэтому её выбирают многие открытые проекты ARM. Однако сложность технологий и архитектуры требует изучения. Дополнительные сведения находятся в docs/cn/Common/DISPLAY/, docs/cn/Linux/Graphics/ и Rockchip wiki.

### 1.2 Аппаратные модули SoC

#### 1.2.1 VOP (Video Output Processor)

VOP передаёт изображение из кадрового буфера памяти на устройство отображения, например выводит буфер NV12 или RGB на экран. Возможности зависят от платформы: максимальное разрешение интерфейсов, поддержка 4K, формата AFBC (Arm Frame Buffer Compression) и т. д. Подробности: docs/cn/Common/DISPLAY/Rockchip_Developer_Guide_DRM_Display_Driver_CN.pdf.

#### 1.2.2 GPU (Graphics Process Unit)

GPU — графический ускоритель на основе открытых стандартов для 2D, 3D и вычислений общего назначения GPGPU. В описанной исходником поставке Rockchip Linux GPU предоставляет OpenGL ES, EGL и OpenCL, но не desktop OpenGL. Перечень API (поддержка конкретного чипа уточняется по его руководству):

- OpenGL ES 3.0
- OpenGL ES 2.0
- OpenGL ES 1.1
- OpenCL 1.2
- OpenCL 1.1
- OpenCL 1.0

#### 1.2.3 RGA (Raster Graphic Acceleration)

Rockchip RGA — отдельный двумерный растровый ускоритель: пиксели/линии, масштабирование, поворот, операции с bitmap, композиция изображений и др. Поддерживаемые форматы различаются между чипами; см. их руководства. Код: SDK/external/linux-rga. Дополнительная документация: docs/en/Common/RGA/Rockchip_Developer_Guide_RGA_EN.pdf.

### 1.3 Программные графические модули

Важно понимать связи между libdrm, Wayland и X11 (композиторы), а также Mesa, libmali и GTK (приложения). См. Linux_Graphics_Stack в ссылках исходника.

#### 1.3.1 LIBDRM

LIBDRM — междрайверный промежуточный слой, позволяющий приложениям пользовательского пространства, например Mesa и 2D-драйверам, взаимодействовать с ядром через DRI. Структура DRM:

![Технический рисунок английского исходника](/docs/rockchip-linux-graphics/assets/en-p005-figure-01.png)

LIBDRM обеспечивает взаимодействие драйвера и пользовательского уровня. Ранее приложения могли обращаться к графическому драйверу непосредственно через open(fb), но развитие аппаратуры ставит новые задачи:

- несколько слоёв;
- несколько экранов;
- синхронизация vsync без разрывов;
- передача памяти без копирования через dmabuf.

LIBDRM помогает решать их и предоставляет API для X11/Wayland. Простая программа, например рекламный плеер с циклическим видео, может вызвать LIBDRM напрямую, но исходник это не рекомендует. Во-первых, API сравнительно новый, его типичные пользователи — разработчики DRM и Wayland/Xserver. Во-вторых, он быстро меняется: есть atomic и legacy, а поведение во многом зависит от производителя. Rockchip менял поведение основных API для проектов, поэтому одинаковый API может работать по-разному на разных платформах. Рекомендация не означает обязательного использования X11/Wayland: лучше использовать готовую обёртку, например GStreamer с kmssink вместо прямых вызовов LIBDRM для циклического видео.

Три понятия DRM:

- connector соответствует экранному подключению: у HDMI и DSI собственные номера connector;
- crtc соответствует VOP, обычно один на экран;
- plane — слой: например, видео на plane2 выше UI на plane1.

Есть legacy и atomic API. Legacy — более ранний вариант, которым, по исходнику, пользуется большинство описываемых программ. Важные функции: drmModeSetCrtc, drmModeSetPlane, drmModePageFlip. drmModeSetCrtc обычно задаёт UI-слой и разрешение. drmModeSetPlane настраивает отдельный слой, например видео: fd буфера, слой, размер вывода и размер буфера; буфер масштабируется и выводится. На Rockchip вызов асинхронный: два последовательных вызова могут привести к перезаписи предыдущего, поэтому может понадобиться drmWaitVBlank.

При legacy-выводе нескольких слоёв каждый отдельно вызывает drmModeSetPlane, затем ожидает vsync. Если два слоя делают это последовательно при 60 Hz, в примере возникает ограничение 30 fps. Для решения этой проблемы upstream-разработчики создали atomic API.

Atomic API объединяет сведения об обновлении всех слоёв в одном commit: вместо двух drmModeSetPlane выполняется один drmModeAtomicCommit со всеми параметрами.

```text
mainline source code:
git clone https://gitlab.freedesktop.org/mesa/drm.git
```

Дополнительные материалы из исходника: Rockchip wiki (Libdrm), официальная документация. Примеры legacy: modetest в libdrm, kmssink в GStreamer. Пример atomic: modeset-atomic. Ссылки сохранены в конце статьи.

#### 1.3.2 LIBMALI

Для OpenGL ES, EGL и OpenCL добавьте LIBMALI в rootfs. Готовые бинарные файлы: SDK/external/libmali. Именование: модель GPU — версия ПО — аппаратная версия (например, r1p0 различает RK3288 и RK3288w) — параметры сборки.

Без суффикса подразумевается x11-gbm. GBM используется для управления памятью DRM. fbdev не следует использовать, кроме ядра 3.10. GBM подходит, например, для QT EGLFS без зависимости от X11/Wayland. Варианты Wayland или Wayland-gbm предназначены для Wayland.

#### 1.3.3 ZERO-COPY

При выводе Mali данных dmabuf, например камеры/видео, механизм dmabuf ZERO-COPY устраняет копирование CPU при загрузке текстур. Для X11/Wayland предусмотрены настройки ZERO-COPY; см. также материалы Wayland dmabuf.

#### 1.3.4 X11

X11 похож на обычную настольную платформу, но исходник отмечает проблему производительности GPU. Код: SDK/external/xserver. Дополнительные ссылки:

```text
https://en.wikipedia.org/wiki/X.Org_Server
https://www.comptechdoc.org/os/linux/howlinuxworks/linux_hlxwindows.html
https://dri.freedesktop.org/wiki/DDX/
https://www.freedesktop.org/wiki/Software/Glamor/
https://en.wikipedia.org/wiki/X.Org_Server
```

#### 1.3.5 Wayland

Для разработки Wayland рекомендуется Yocto/Buildroot SDK. По исходнику Wayland несколько эффективнее X11; выбор также связан с совместимостью. Если рабочий стол не нужен, но нужны несколько окон, можно рассмотреть Wayland. Материалы:

```text
https://en.wikipedia.org/wiki/Wayland
```

#### 1.3.6 None

Помимо X11/Wayland есть режим None, распространённый во встраиваемых системах; примеры исходника — LVGL и SDL.

#### 1.3.7 Выбор архитектуры отображения

Варианты: EGL-программа + X11; X11; Wayland; None.

- Несколько окон: X11 или Wayland.
- Полноценный рабочий стол: X11.
- Видео 4K на весь экран: X11 или Wayland.
- Видео 4K в нескольких окнах: X11 или Wayland.

### 1.4 Несколько экранов

В описанных Debian/Buildroot-платформах Rockchip Linux комбинируются DP/HDMI/MIPI/eDP/LVDS и другие интерфейсы для одинакового или различного содержимого экранов. При независимом двухэкранном выводе один экран основной, другой дополнительный. Ниже приведено его использование.

#### 1.4.1 Два экрана в Debian

В Debian с X11 режимы зеркалирования и независимого вывода настраиваются xrandr. Это официальный инструмент RandR (Resize and Rotate) для X Window System: размер, ориентация, зеркалирование. Для нескольких мониторов см. Multihead по ссылке исходника.

##### 1.4.1.1 Устройства вывода и имена

Двухэкранный режим настраивается через командную строку или меню. В интерфейсе: правая кнопка мыши → Application → Settings → Display.

![Технический рисунок английского исходника](/docs/rockchip-linux-graphics/assets/en-p009-figure-01.png)

Команда:

```text
su linaro -c "DISPLAY=:0 xrandr"
```

Вывод:

```text
root@linaro-alip:/# su linaro -c "DISPLAY=:0 xrandr"
Screen 0: minimum 320 x 200, current 3000 x 1920, maximum 16384 x 16384
HDMI-1 connected 1920x1080+0+0 (normal left inverted right x axis y axis) 0mm x
0mm
   1920x1080     60.00*+  60.00
   1600x900      60.00
   1280x1024     60.02
   1280x720      60.00    60.00
   720x480       59.94    59.94
HDMI-2 disconnected (normal left inverted right x axis y axis)
DSI-1 connected 1080x1920+1920+0 (normal left inverted right x axis y axis) 0mm x
0mm
   1080x1920     59.90*+
DP-1 disconnected (normal left inverted right x axis y axis)
DP-2 disconnected (normal left inverted right x axis y axis)
```

В примере обнаружены два устройства вывода: HDMI-1 и DSI-1.

##### 1.4.1.2 Режим двух экранов

Поддерживаются одинаковое и разное содержимое. Для независимого вывода доступны четыре положения: справа (On right), сверху (Above), слева (On left), снизу (Below). В меню дисплеев режим переключается перетаскиванием экранов. Команда:

```text
su linaro -c "DISPLAY=:0 xrandr --output HDMI-1 --above DSI-1"
```

Вместо --above используйте --right-of, --left-of, --below или --same-as. Режим по умолчанию/same-as показывает одинаковое содержимое.

#### 1.4.2 Два экрана в Buildroot

Weston в Buildroot SDK поддерживает одинаковое/разное содержимое нескольких экранов и горячее подключение. Экраны различаются по DRM-имени из стартового журнала Weston или /sys/class/drm/card0-. Параметры задаются через окружение:

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

При масштабировании зеркального изображения требуется RGA-ускорение. Отдельный экран можно отключить в output файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=off
# off|current|preferred|<WIDTHxHEIGHT@RATE>
```

Подробности: docs/en/Linux/Graphics/Rockchip_Developer_Guide_Buildroot_Weston_EN.pdf.

### 1.5 Настройка изображения

В Linux modetest позволяет регулировать оттенок (hue), насыщенность (saturation), контраст (contrast) и яркость (brightness). Свойства задаются опцией -w; исходник приводит шаблон `-w <obj_id>:<prop_name>:`. Для eDP сначала выполните modetest -M rockchip; в примере Connectors id равен 92.

```text
Connectors:
id      encoder status          name            size (mm)       modes   encoders
92      91      connected       eDP-1           129x171         1       91
  modes:
        name refresh (Hz) hdisp hss hse htot vdisp vss vse vtot)
  1536x2048 60 1536 1548 1564 1612 2048 2056 2060 2068 200000 flags: nhsync,
nvsync; type: preferred
...
```

Установите hue eDP в 60; исходное значение 50, диапазон 0–100.

```text
modetest -M rockchip -w 92:hue:60
```

Аналогично настраиваются hue, saturation, contrast, brightness для LVDS/HDMI/MIPI. В X11 гамма меняется через xrandr. Сначала проверьте наличие следующей конфигурации в etc/X11/xorg.conf.d/20-modesetting.conf:

```text
Option      "UseGammaLUT"    "true"
```

Если её нет, обновите deb-пакет xserver для поддержки. Команда изменения гаммы с выбором экрана и весов RGB:

```text
xrandr --output HDMI-1 --gamma 1:1:0.9
```

## Ссылки исходника

[ArmSoM Docs](https://docs.armsom.org/)

[http://opensource.rock-chips.com/wiki_Graphics](http://opensource.rock-chips.com/wiki_Graphics)

[https://upload.wikimedia.org/wikipedia/commons/c/c2/Linux_Graphics_Stack_2013.svg](https://upload.wikimedia.org/wikipedia/commons/c/c2/Linux_Graphics_Stack_2013.svg)

[http://opensource.rock-chips.com/wiki_Libdrm](http://opensource.rock-chips.com/wiki_Libdrm)

[https://dri.freedesktop.org/docs/drm/gpu/drm-kms.html](https://dri.freedesktop.org/docs/drm/gpu/drm-kms.html)

[https://gitlab.freedesktop.org/mesa/drm/-/blob/main/tests/modetest/modetest.c](https://gitlab.freedesktop.org/mesa/drm/-/blob/main/tests/modetest/modetest.c)

[https://github.com/rockchip-linux/gstreamer-rockchip-extra/blob/master/gst/kms/gstkmssink.c](https://github.com/rockchip-linux/gstreamer-rockchip-extra/blob/master/gst/kms/gstkmssink.c)

[https://github.com/dvdhrm/docs/blob/master/drm-howto/modeset-atomic.c](https://github.com/dvdhrm/docs/blob/master/drm-howto/modeset-atomic.c)

[https://wiki.archlinux.org/index.php/Multihead](https://wiki.archlinux.org/index.php/Multihead)

{% endraw %}
