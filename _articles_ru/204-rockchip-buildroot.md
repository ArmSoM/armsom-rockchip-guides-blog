---
title: "Rockchip Buildroot: руководство разработчика"
description: "Rockchip Buildroot: руководство разработчика — V1.0.0"
excerpt: "Rockchip Buildroot: руководство разработчика"
translation_key: "204-rockchip-buildroot"
slug: "204-rockchip-buildroot"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Buildroot, Linux]
---

{% raw %}

# Rockchip Buildroot: руководство разработчика

Платформенная справка ArmSoM, оригинал V1.0.0. Описан модифицированный Rockchip Buildroot SDK; наличие тех же расширений в upstream Buildroot/Weston или на всех платах ArmSoM не гарантируется. Сверяйте SoC, плату, SDK/BSP, ядро, дисплей и ввод; версия ядра в оригинале отсутствует. Примеры не являются тестами ArmSoM; команды и аппаратные проверки не выполнялись.

Оба оригинала V1.0.0; сохранены все 16 глав. ZH использует три китайских рисунка, EN/RU/DE — три английских. Даты SDK относительно годов Buildroot в таблице выглядят противоречиво и сохранены. Ограничение uClibc в §4.1 — историческая формулировка, проверяйте SDK. В export из §6 нет знака присваивания: это сохранённая ошибка источника, не готовая команда. В §8 различаются foo-barboo и foo-bar_boo, а в §14.7 есть двойное двоеточие output:eDP-1::rotate180; проверяйте фактический обработчик.

Buildroot автоматизирует кросс-компиляцию полной встроенной Linux-системы. Rockchip интегрирует BSP чипов, настройки аппаратного ускорения и модифицированные сторонние пакеты для дальнейшей разработки. Таблица — данные исходника, не обязательство поддержки ArmSoM.

| Версия Buildroot | Дата SDK (оригинал) | Проверенные в источнике чипы |
| --- | --- | --- |
| 2021.11 | 2018-06-20 | RK3588, RK356X, RK3399, RK3326/PX30/RK3358, RK3308, RK3399, RK3288, RK312X, RK3036 |
| 2018.02 | 2022-01-15 | RK356X, RK3399, RK3326/PX30/RK3358, RK3308, RK3399, RK3288, RK312X, RK3036, RK3399PRO, RK1808, RK1806, RV1126/RV1109, RK3328 |

## 1. Механизм загрузки сторонних пакетов Buildroot

SDK включает механизм загрузки сторонних пакетов Buildroot, обеспечивающий доступность загрузок. Более гибкая схема добавляет к исходному dl каталог archives с предварительно сохранёнными пакетами. Если Google недоступен, используется китайское зеркало kgithub. Сначала выбирается источник из сценария mk, при неудаче — зеркала из mk и defconfig, затем официальный резервный источник. В официальном дереве большая часть исходников загружается wget; меньшая часть — из соответствующих репозиториев git, mercurial или svn.

## 2. Переменные окружения

В каталоге SDK:

```text
source buildroot/envsetup.sh <config_name>
```

Команда source buildroot/envsetup.sh выводит список config_name для выбора целевой платформы сборки.

## 3. Сборка модулей и системы

После выбора платформы можно собирать отдельные пакеты. Основные этапы — config, build и install. Перейдите в каталог buildroot. Команда make &lt;package&gt; собирает и устанавливает пакет и его зависимости. Для пакетов Buildroot доступны отдельные специальные цели make:

```text
make <package>-<target>
```

| Команда/цель | Описание |
| --- | --- |
| source | Получить исходники: архив, клон репозитория и т. п. |
| depends | Собрать и установить все зависимости пакета |
| extract | Разместить исходники в каталоге сборки: распаковать архив, скопировать код и т. п. |
| patch | Применить патчи, если есть |
| configure | Выполнить configure, если есть |
| build | Выполнить сборку |
| install-staging | Целевой пакет: выполнить необходимую установку в staging |
| install | Целевой пакет: выполнить две предыдущие команды установки. Хостовый пакет: установить в host. |

Также доступны следующие полезные цели:

| Команда/цель | Описание |
| --- | --- |
| show-depends | Показать зависимости сборки |
| clean | Выполнить очистку пакета; возможно удаление из target и staging. Реализовано не для всех пакетов. |
| dirclean | Удалить весь каталог сборки пакета |
| rebuild | Повторить компиляцию |
| reconfigure | Повторить конфигурацию |

Пример конфигурации, сборки, установки и повторной сборки изменённого пакета rockchip-test:

```text
### Compile package
buildroot$ make rockchip-test-configure
buildroot$ make rockchip-test-build
buildroot$ make rockchip-test-install

### Rebuild package
buildroot$ make rockchip-test-reconfigure
buildroot$ make rockchip-test-rebuild
buildroot$ make rockchip-test-reinstall

### Clean package
buildroot$ make rockchip-test-dirclean
```

Для изменения конфигурации можно выполнить make menuconfig:

```text
buildroot$ make menuconfig
```

В конфигураторе справка описывает назначение пунктов меню. После завершения создаётся файл .config с описанием конфигурации. Makefile использует его для необходимых действий. Затем выполняется make. Для сборки всей системы Buildroot достаточно make.

```text
buildroot$ make
```

Сохранение конфигурации rootfs: `buildroot$ make update-defconfig`.

Результат сборки находится в output со следующими подкаталогами:

- images: все образы файловых систем, например ext2/4, squashfs и cpio.
- build: здесь собираются все компоненты — инструменты для хоста Buildroot и пакеты целевой системы. Для каждого компонента есть подкаталог.
- staging: структура похожа на корневую файловую систему; содержит установленный кросс-компилятор и выбранные пользовательские пакеты. Это не целевая rootfs: здесь много файлов разработки, неочищенных двоичных файлов и библиотек, слишком больших для встроенной системы. Файлы разработки предоставляют библиотеки и зависимости для компиляции.
- target: почти полная целевая rootfs, но Buildroot не работает и не должен работать от root, поэтому некоторые объекты отсутствуют; права тоже не окончательные, например setuid у busybox. Не используйте этот каталог непосредственно на устройстве: берите образ из images/. Для внешнего NFS-образа исходник предписывает создание образа в images/ с правами root. В отличие от staging/, target/ содержит лишь необходимые для исполнения приложений файлы и библиотеки, без заголовков разработки; двоичные файлы очищены от отладочных данных.
- host: установленные хостовые инструменты, необходимые Buildroot, включая кросс-компилятор.

## 4. Кросс-компилятор

Buildroot предоставляет разные варианты построения кросс-компилятора:

- Внутренний механизм, обозначенный в конфигураторе как Buildroot toolchain.

- Внешний механизм, обозначенный как external toolchain.

```text
$ make menuconfig
  -> Toolchain
  │       -> Toolchain type (<choice> [=y])
```

SDK по умолчанию использует внутренний механизм.

### 4.1 Внутренний механизм toolchain

Встроенный механизм сначала строит кросс-компилятор для пользовательских приложений и библиотек целевой встроенной системы. Это исторический механизм Buildroot. Оригинал ограничивает его библиотекой C uClibc и говорит, что glibc/eglibc здесь не поддерживаются, отсылая к внешнему и cross-ystem-механизмам. Это утверждение оригинала, требующее сверки с фактической версией Buildroot.

Преимущества:

- Хорошая совместимость с Buildroot.
- Быстрая сборка только необходимого.

Недостатки:

- После очистки требуется заново строить toolchain, что занимает время; для сокращения времени рассмотрите внешнюю toolchain.
- В исходном описании ограничен uClibc.

### 4.2 Внешний механизм toolchain

Позволяет использовать готовую кросс-toolchain. Buildroot распознаёт распространённые варианты: Linaro ARM, Sourcery CodeBench ARM, x86, x86-64, PowerPC, MIPS, SuperH, ADI Blackfin, Xilinx Microblaze и другие. Их можно автоматически загрузить либо указать собственную загружаемую или локально установленную toolchain.

Преимущества:

- Использование известных и проверенных кросс-компиляторов.
- Экономия времени построения toolchain, существенного для общей сборки embedded Linux.
- Не ограничивается uClibc: поддерживаются glibc и eglibc.

Недостаток: исправление дефектов готовой внешней toolchain может зависеть от поставщика, если вы не собираете её самостоятельно. SDK содержит готовые кросс-компиляторы в prebuilts; при выборе внешней toolchain используются следующие пути:

| Каталог | Описание |
| --- | --- |
| prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu | gcc arm 10.3.1, 64-битная toolchain |
| prebuilts/gcc/linux-x86/arm/gcc-arm-10.3-2021.07-x86_64-arm-none-linux-gnueabihf | gcc arm 10.3.1, 32-битная toolchain |

Toolchain также доступна через указанную в оригинале ссылку Baidu Cloud. Для отдельного модуля SDK или стороннего приложения настройте кросс-компиляционную среду. Например, инструменты RK3562 находятся в buildroot/output/rockchip_rk3562/host/usr. Каталоги bin/ и aarch64-buildroot-linux-gnu/bin/ следует включить в окружение. Сценарий из корня SDK настраивает его автоматически:

```text
source buildroot/envsetup.sh rockchip_rk3562
```

Проверка командой:

```text
cd buildroot/output/rockchip_rk3562/host/usr/bin
./aarch64-linux-gcc --version
```

Вывод:

```text
aarch64-linux-gcc.br_real (Buildroot) 12.3.0
```

Если нужна встроенная в SDK внешняя toolchain, включите соответствующие конфигурации configs/rockchip/toolchain/*.

## 5. ccache в Buildroot

При сборке Buildroot SDK по умолчанию включает кэш компилятора ccache. Он хранится в $HOME/.buildroot-ccache. Для удаления кэша оригинал предлагает удалить этот каталог; команда здесь не выполнялась. make ccache-stats показывает размер кэша, попадания, промахи и другую статистику.

## 6. Каталог загрузки пакетов

Архивы Buildroot находятся в BR2_DL_DIR, по умолчанию dl. Предварительное заполнение dl ускоряет сборку и помогает при сбоях загрузки сторонних пакетов. Путь SDK можно задать переменной BUILDROOT_DL_DIR.

```text
$ export BUILDROOT_DL_DIR <shared download location>
```

Добавьте строку в ~/.bashrc для настройки окружения.

Путь также задаётся параметром BR2_DL_DIR в .config. Переменная BUILDROOT_DL_DIR имеет приоритет над этим значением.

## 7. Добавление новых пакетов Buildroot

Для интеграции новых пользовательских библиотек и приложений ориентируйтесь на пакеты в buildroot/package/rockchip/*.

### 7.1 Каталог программы внутри package

Например, package/rockchip.

### 7.2 Файл Config.in

Создайте Config.in с описанием параметров rockchip, используемых и отображаемых конфигуратором. Основное содержимое:

```text
menuconfig BR2_PACKAGE_ROCKCHIP
        bool "Rockchip Platform"

if BR2_PACKAGE_ROCKCHIP

config BR2_PACKAGE_ROCKCHIP_HAS_ISP1
        bool
        help
         Has Rockchip ISP1
```

### 7.3 Файлы .mk

Это наиболее сложная часть. Файл rockchip.mk описывает загрузку, конфигурацию, сборку и установку. Его структура зависит от типа пакета и инфраструктуры.

- Обычные пакеты без autotools и CMake: инфраструктура похожа на autotools, но требует больше работы разработчика. Она определяет конфигурацию, компиляцию, установку и очистку. Используется

для пакетов, которые не используют autotools; для других систем сборки в будущем могут появляться специальные механизмы.

- Пакеты autotools (autoconf, automake и т. п.): предусмотрена специальная инфраструктура, поскольку это распространённая система сборки. Новые пакеты, зависящие от autotools, должны использовать её.
- Пакеты CMake: предусмотрена отдельная инфраструктура для всё более распространённой системы со стандартизированным поведением; новые пакеты CMake должны использовать её.

## 8. Имена пакетов, параметров и переменных Makefile

Связаны имя каталога пакета и файла *.mk, имя параметра в Config.in и префикс переменных Makefile. Правила согласования:

- Имя каталога и *.mk — имя пакета, например package/foo-bar_boo/foo-bar_boo.mk.
- Цель также называется по пакету; оригинал приводит foo-barboo, что отличается от предыдущего написания.
- Для параметра имя переводят в верхний регистр, заменяют дефисы подчёркиваниями и добавляют BR2_PACKAGE_: BR2_PACKAGE_FOO_BAR_BOO. В английском оригинале подчёркивание в описании пропущено, пример сохранён.
- Переменные .mk получают префикс из имени пакета в верхнем регистре с заменой дефисов на подчёркивания: FOO_BAR_BOO_VERSION.

## 9. Пакет из GitHub

Для пакетов GitHub обычно нет отдельной ссылки на выпущенный архив, но архив можно загрузить непосредственно из репозитория:

```text
FOO_VERSION = v1.0 # tag or (abbreviated) commit ID
FOO_SITE = http://github.com/<user>/<package>/tarball/$(FOO_VERSION)
```

Примечания:

- FOO_VERSION может быть тегом или идентификатором коммита.

- Имя архива GitHub соответствует стандартному имени Buildroot, например foo-1234567.tar.gz; его не требуется задавать в .mk.

- Для версии по коммиту обычно достаточно первых 7 символов SHA1.

## 10. Разработка собственных модулей

Для настройки отдельных модулей используйте переключатели в &lt;SDK&gt;/buildroot/configs/rockchip*.

```text
buildroot$ tree -L 2 configs/rockchip/
configs/rockchip/
├── base  # General base packages
│   ├── base.config
│   ├── common.config
│   ├── kernel.config
│   ├── recovery.config
│   └── tiny.config
├── benchmark.config # Benchmark scoring test tools
├── chips # Chip-related configurations
│   ├── rk3036_arm.config
│   ├── rk3036.config
│   ├── rk312x_arm.config
│   ├── rk312x.config
│   ├── rk3288_arm.config
│   ├── rk3288.config
│   ├── rk3308_aarch64.config
│   ├── rk3308_arm.config
│   ├── rk3308.config
│   ├── rk3326_aarch64.config
│   ├── rk3326_arm.config
│   ├── rk3326.config
│   ├── rk3399_aarch64.config
│   ├── rk3399_arm.config
│   ├── rk3399.config
│   ├── rk3399pro_aarch64.config
│   ├── rk3399pro_arm.config
│   ├── rk3399pro.config
│   ├── rk3399pro_npu_aarch64.config
│   ├── rk3399pro_npu_arm.config
│   ├── rk3399pro_npu.config
│   ├── rk3528_aarch64.config
│   ├── rk3528.config
│   ├── rk3562_aarch64.config
│   ├── rk3562_arm.config
│   ├── rk3562.config
│   ├── rk3566_rk3568_aarch64.config
│   ├── rk3566_rk3568_arm.config
│   ├── rk3566_rk3568.config
│   ├── rk3588_aarch64.config
│   ├── rk3588_arm.config
│   └── rk3588.config
├── chromium.config # Chromium browser
├── debug.config # Debug tool configuration
├── electric.config # Electric power configuration
├── font # Font configuration
│   ├── chinese.config
│   └── font.config
├── fs # File system format configuration
│   ├── e2fs.config
│   ├── exfat.config
│   ├── ntfs.config
│   ├── ubifs.config
│   └── vfat.config
├── gdb.config # GDB debugging
├── gpu # GPU configuration
│   └── gpu.config
├── libcamera.config # libcamera configuration
├── locale
│   ├── chinese.config
│   └── locale.config
├── multimedia # Multimedia configuration
│   ├── audio.config
│   ├── camera.config
│   ├── gst
│   ├── mpp.config
│   └── rockit.config
├── npu2.config # NPU configuration
├── powermanager.config # Power management configuration
├── rknn_demo.conf
├── tee_aarch64_v2.config
├── test.config
├── toolchain # Toolchain configuration
│   ├── arm_10_aarch64.config
│   ├── arm_10_armhf.config
│   └── arm_8_armhf.config
├── weston.config # Weston configuration
├── wifibt # RKWIFIBT network configuration
│   ├── bt.config
│   ├── network.config
│   └── wireless.config
└── x11.config # X11 configuration
...
```

## 11. Графические приложения

По умолчанию Buildroot использует Weston DRM на основе протокола Wayland как графический backend:

![Рисунок английского оригинала](/docs/rockchip-buildroot/assets/en-p013-figure-01.png)

Приложения Weston предоставляют базовую конфигурацию панели и фона, Chromium, терминал, запуск приложений, предпросмотр камеры, многоканальное видео, GPU, мышь и другие демонстрации. Дополнительные демонстрации добавляются через /etc/xdg/weston/weston.ini.d/*. Подробности параметров и использования см. в разделе о Weston.

Примечание исходника: сторонние UI-фреймворки могут требовать коммерческой авторизации. Для Buildroot QT/Enlightenment/Minigui/LVGL и других фреймворков на Rockchip следует отдельно проверить сторонние разрешения и поддержку; оригинал указывает, что Rockchip не предоставляет их техническую поддержку и сопровождение. Это сохранённое исходное предупреждение, не самостоятельное заключение о лицензиях.

### 11.1 Приложения Weston

Клиентские приложения Weston для Wayland:

```text
/usr/bin/#
├── weston-calibrator
├── weston-clickdot
├── weston-cliptest
├── weston-confine
├── weston-content_protection
├── weston-debug
├── weston-dnd
├── weston-editor
├── weston-eventdemo
├── weston-flower
├── weston-fullscreen
├── weston-image
├── weston-multi-resource
├── weston-presentation-shm
├── weston-resizor
├── weston-scaler
├── weston-screenshooter
├── weston-simple-damage
├── weston-simple-dmabuf-egl
├── weston-simple-dmabuf-v4l
├── weston-simple-egl
├── weston-simple-shm
├── weston-simple-touch
├── weston-smoke
├── weston-stacking
├── weston-subsurfaces
├── weston-tablet
├── weston-terminal
├── weston-touch-calibrator
├── weston-transformed
```

### 11.2 Рабочий стол Enlightenment

Включите следующие параметры:

```text
BR2_PACKAGE_EFL=y
BR2_PACKAGE_LUAJIT=y
BR2_PACKAGE_EFL_GSTREAMER1=y
BR2_PACKAGE_ENLIGHTENMENT=y
BR2_PACKAGE_EFL_WAYLAND=y
```

Вид работающего интерфейса:

![Рисунок английского оригинала](/docs/rockchip-buildroot/assets/en-p014-figure-01.png)

### 11.3 Рабочий стол LVGL

Включите соответствующие параметры:

```text
BR2_PACKAGE_LVGL=y
BR2_PACKAGE_LVGL_COLOR_DEPTH=32
BR2_PACKAGE_LV_DRIVERS=y
BR2_PACKAGE_LV_DRIVERS_USE_DRM=y
BR2_PACKAGE_LVGL_DEMO=y
BR2_PACKAGE_RK_DEMO=y
BR2_PACKAGE_LVGL_DEMO_USE_DRM=y
BR2_PACKAGE_FREETYPE=y
```

![Рисунок английского оригинала](/docs/rockchip-buildroot/assets/en-p015-figure-01.png)

## 12. Пользователь и пароль

Пользователь: root. Пароль: rockchip. Это значения примера SDK, а не рекомендация оставлять общий пароль в рабочей системе.

## 13. Разработка Weston

Weston — официальная эталонная реализация открытого протокола Wayland. Графическая служба Rockchip Buildroot SDK по умолчанию использует backend Weston drm.

### 13.1 Способы конфигурации

Buildroot SDK предоставляет несколько способов.

a. Параметры запуска: передаются команде Weston, например weston --tty=2. Сценарий /etc/init.d/S49weston соответствует buildroot/package/weston/S49weston в SDK.

b. Конфигурационные файлы weston.ini:

Файлы .ini расположены в /etc/xdg/weston/weston.ini и /etc/xdg/weston/weston.ini.d/. Пример пути в SDK: buildroot/board/rockchip/common/base/etc/xdg/weston/weston.ini. Справка: https://fossies.org/linux/weston/man/weston.ini.man.

c. Специальные переменные окружения: обычно задаются в /etc/profile.d/weston.sh, исходный файл SDK — buildroot/package/weston/weston.sh.

d. Динамический файл: для отображения через drm backend Weston Buildroot SDK поддерживает динамические параметры. Стандартный путь /tmp/.weston_drm.conf можно заменить переменной WESTON_DRM_CONFIG.

e. Правила udev: требуются для некоторых параметров устройств ввода Weston.

## 14. Отдельные настройки

### 14.1 Идентификация экрана

Weston различает экраны по имени output (head). Оно видно в журнале запуска:

```text
# weston&
[02:11:29.746] DRM: head 'DSI-1' found ...
```

### 14.2 Вид и размер курсора

Стиль и размер курсора задаются в разделе shell файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[shell]
cursor-theme=whiteglass # Buildroot SDK supports comix/obsidian/xcursor/xcursor-transparent mouse theme packages
cursor-size=24
```

### 14.3 Панель состояния

В shell файла weston.ini задаются цвет фона, положение и масштаб панели; в launcher — быстро запускаемые программы:

```text
# /etc/xdg/weston/weston.ini

[shell]
panel-color=0x90ff0000
# Color format is ARGB8888

panel-position=bottom
# top|bottom|left|right|none, none means disabled

panel-scale=4
# 4x scaling

[launcher]
icon=/usr/share/icons/gnome/24x24/apps/utilities-terminal.png
# Icon path

path=/usr/bin/gnome-terminal
# Shortcut launch command
```

### 14.4 Фон рабочего стола

В shell файла weston.ini задаются фоновое изображение и цвет, а в desktop-launcher — ярлыки программ:

```text
# /etc/xdg/weston/weston.ini

[shell]
background-image=/usr/share/backgrounds/gnome/Aqua.jpg
# Absolute path of the background pattern (wallpaper)

background-type=tile
# scale|scale-crop|tile

background-color=0xff002244
# Color format is ARGB8888, takes effect when no background pattern is set

[desktop-launcher]
icon=/usr/share/icons/hicolor/256x256/apps/chromium.png
# Icon path

path=/usr/bin/chromium www.baidu.com
# Shortcut launch command
displayname=chromium
# Display name
```

### 14.5 Ожидание и блокировка

Тайм-аут ожидания Weston задаётся параметрами запуска или разделом core в weston.ini:

```text
# /etc/init.d/S49weston
start_weston()
{
  /usr/bin/weston --idle-time=0&  # 0 means no standby, unit is seconds
}
```

Или:

```text
# /etc/xdg/weston/weston.ini

[core]
idle-time=10
```

Блокировка экрана настраивается в shell файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[shell]
locking=false
# Disable lock screen

lockscreen-icon=/usr/share/icons/gnome/256x256/actions/lock.png
# Unlock button image

lockscreen=/usr/share/backgrounds/gnome/Garden.jpg
# Lock screen background
```

### 14.6 Формат цвета

Weston в Buildroot SDK по умолчанию использует ARGB8888. На менее производительных платформах можно задать RGB565 в core файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[core]
gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

Формат каждого экрана можно отдельно задать в output:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

gbm-format=rgb565
# xrgb8888|argb8888|rgb565|xrgb2101010
```

### 14.7 Ориентация экрана

Ориентация настраивается в output файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

transform=rotate-90
# normal|rotate-90|rotate-180|rotate-270|flipped|flipped-90|flipped-180|flipped-270
```

Для динамической смены ориентации используется динамический файл:

```text
echo "output:all:rotate90" > /tmp/.weston_drm.conf # Rotate all screens by 90 degrees
echo "output:eDP-1::rotate180" > /tmp/.weston_drm.conf # Rotate eDP-1 by 180 degrees
```

### 14.8 Разрешение и масштаб

Разрешение и масштаб задаются в output файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=1280x800
# Must be a valid resolution supported by the screen

scale=2
# Must be an integer multiple, support applications to achieve scaling
```

Для масштабирования до заданного размера без изменения физического разрешения задайте размер всех экранов переменной WESTON_DRM_VIRTUAL_SIZE:

```text
# /etc/profile.d/weston.sh
export WESTON_DRM_VIRTUAL_SIZE=1024x768
```

Динамическая настройка разрешения и масштаба:

```text
echo "output:HDMI-A-1:mode=800x600" > /tmp/.weston_drm.conf # Change the resolution of HDMI-A-1 to 800x600
echo "output:eDP-1:rect=<10,20,410,620>" > /tmp/.weston_drm.conf # Display eDP-1 at position (10,20), scaled to a size of 400x600
echo "output:HDMI-A-1:size=1920x1080" > /tmp/.weston_drm.conf # Scale HDMI-A-1 to 1080p, with the physical resolution unchanged
```

Если аппаратный модуль VOP не поддерживает масштабирование, обработка должна выполняться RGA.

### 14.9 Замораживание экрана

При запуске Weston между загрузочным логотипом и UI может появиться чёрный экран. Чтобы избежать этого, можно кратковременно заморозить содержимое. Специальный параметр --warm-up начинает показ только после запуска UI:

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
  export WESTON_FREEZE_DISPLAY=/tmp/.weston_freeze # Set special configuration file path
  touch /tmp/.weston_freeze # Freeze display
  /usr/bin/weston&
  sleep 1 && rm /tmp/.weston_freeze& # Unfreeze after 1 second
}
```

Или:

```text
# /etc/init.d/S49weston
start_weston()
{
  echo "output:all:freeze" > /tmp/.weston_drm.conf # Freeze display
  /usr/bin/weston&
  ...
  sleep 1 && echo "output:all:unfreeze" > /tmp/.weston_drm.conf& # Unfreeze after 1 second
}
```

### 14.10 Состояние экрана

DRM позволяет принудительно задать состояние экрана:

```text
echo on > /sys/class/drm/card0-HDMI-A-1/status # Force HDMI-A-1 to be in the connected state
# on|off|detect, detect for hot-plug
```

Более точные динамические состояния задаются через динамический файл:

```text
echo "output:DSI-1:off" > /tmp/.weston_drm.conf # Turn off DSI (without unplugging)
echo "output:HDMI-A-1:freeze" > /tmp/.weston_drm.conf # Freeze HDMI-A-1
echo "output:eDP-1:on" > /tmp/.weston_drm.conf # Turn on eDP
echo "compositor:state:off" > /tmp/.weston_drm.conf # Suspend display
echo "compositor:state:sleep" > /tmp/.weston_drm.conf # Suspend display, wake up with touch screen
echo "compositor:state:freeze" > /tmp/.weston_drm.conf # Freeze display
echo "compositor:state:on" > /tmp/.weston_drm.conf # Wake up display
```

### 14.11 Несколько экранов

Weston Buildroot SDK поддерживает зеркалирование, расширенный рабочий стол, положение экранов и горячее подключение. При зеркалировании, если VOP не умеет масштабировать, используется попытка обработки через RGA. Настройки задаются переменными окружения:

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

Отдельный экран можно отключить в output файла weston.ini:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=off
# off|current|preferred|<WIDTHxHEIGHT@RATE>
```

Также можно использовать динамический файл:

```text
echo "output:HDMI-A-1:pos=100,200" > /tmp/.weston_drm.conf # Set HDMI display position
echo "output:HDMI-A-1:prefer" > /tmp/.weston_drm.conf # Set applications to default display on HDMI
echo "output:HDMI-A-1:primary" > /tmp/.weston_drm.conf # Set HDMI as the primary display
```

### 14.12 Устройства ввода

По умолчанию Weston требует хотя бы одно устройство ввода. Если его нет, требуется специальная настройка core:

```text
# /etc/xdg/weston/weston.ini

[core]
require-input=false
```

При нескольких экранах привязка устройства ввода к экрану задаётся WL_OUTPUT в правилах udev:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{WL_OUTPUT}="HDMI-A-1"
```

Или задайте WL_SEAT:

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

Либо используйте динамический файл:

```text
echo "output:HDMI-A-1:input=*" > /tmp/.weston_drm.conf # Match all devices
echo "output:HDMI-A-1:input=" > /tmp/.weston_drm.conf # Disable input
echo "output:HDMI-A-1:input=event6" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix*" > /tmp/.weston_drm.conf
echo "output:HDMI-A-1:input=goodix-ts" > /tmp/.weston_drm.conf
```

evtest показывает идентификаторы производителя и продукта и имя устройства ввода:

```text
# evtest /dev/input/event8 | head -3
Input driver version is 1.0.1
Input device ID: bus 0x18 vendor 0xdead product 0xbeef version 0x28bb
Input device name: "goodix-ts"
```

### 14.13 Калибровка сенсорного экрана

Для калибровки можно задать WESTON_TOUCH_CALIBRATION:

```text
# /etc/profile.d/weston.sh
export WESTON_TOUCH_CALIBRATION="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Или используйте правило udev:

```text
# /lib/udev/rules.d/99-goodix-ts.rules
ATTRS{name}=="goodix-ts", ENV{LIBINPUT_CALIBRATION_MATRIX}="1.013788 0.0 -0.061495 0.0 1.332709 -0.276154"
```

Параметры выдаёт weston-calibrator. Инструмент генерирует случайные точки; после последовательных нажатий выводит Final calibration values: 1.013788 0.0 -0.061495 0.0 1.332709 -0.276154.

Другой инструмент Weston — weston-touch-calibrator — требует следующей конфигурации:

```text
# /etc/xdg/weston/weston.ini

[libinput]
touchscreen_calibrator=true
calibration_helper=/bin/weston-calibration-helper.sh
```

### 14.14 Платформа без GPU

SDK-Weston по умолчанию использует GPU для ускорения рендеринга. Если GPU отсутствует или недостаточно производителен, можно использовать 2D-ускоритель Rockchip RGA. В Buildroot SDK включите BR2_PACKAGE_LINUX_RGA и BR2_PACKAGE_WESTON_DEFAULT_PIXMAN.

### 14.15 ARM AFBC Modifier

Если чип поддерживает AFBC, SDK-Weston может выводить сжатый GPU-формат AFBC. Конфигурация:

```text
# /etc/profile.d/weston.sh
# export WESTON_DISABLE_ATOMIC=1
export WESTON_ALLOW_GBM_MODIFIERS=1
```

### 14.16 Уменьшение разрешения UI

При нехватке производительности UI или полосы DDR можно уменьшить разрешение UI:

```text
echo "output:HDMI-A-1:down-scale=0.5" >> /tmp/.weston_drm.conf # UI scaling by 0.5x
```

Подробности в &lt;SDK&gt;/docs/cn/Linux/Graphics/Rockchip_Developer_Guide_Buildroot_Weston_CN.pdf.

## 15. Снимок экрана

```text
buildroot:/# killall weston
buildroot:/# weston --debug&
buildroot:/# weston-screenshooter
```

Команды делают снимок текущего экрана.

## 16. Отображение китайского текста

Конфигурация Weston:

```text
$ cat /etc/xdg/weston/weston.ini
[terminal]
font=Source Han Sans CN Medium
font-size=14
term=xterm-256color
```

Подключите chinese.config из configs/rockchip/locale/ в Buildroot либо включите следующие параметры:

```text
BR2_TOOLCHAIN_GLIBC_GCONV_LIBS_COPY=y
BR2_PACKAGE_BUSYBOX_UNICODE=y
# BR2_ENABLE_LOCALE_PURGE is not set
BR2_GENERATE_LOCALE="zh_CN.UTF-8"
```

Окружение Buildroot:

```text
root@rk3588:/# cat /etc/profile.d/lang.sh
export LANG=zh_CN.utf8
```

Соответствующие коммиты Buildroot:

```text
buildroot$ git log --oneline
c476944fee configs: locale.config: Disable BR2_ENABLE_LOCALE_PURGE
f9654d67c8 localedef: Sync with 2018 SDK
2cbb75a54c coreutils: Support bypassing Unicode when printing
15340338dc busybox: Support bypassing Unicode when printing
5e9b8ba00c configs: rockchip: Add locale.config
863eed048e busybox: Support enabling unicode

device/rockchip$ git log --oneline
5c42211 post-rootfs.sh: Support setting LANG environment
```

## Различия и дополнения источников

Китайский §3 прямо указывает отсутствие файлов устройств `/dev/` в target/; английский пропускает эту фразу. Китайский описывает build/ как все компоненты кроме кросс-toolchain, английский — как все компоненты. Обе формулировки зафиксированы без выбора применимости к конкретному SDK. В китайском §7 путь записан `builroot/package/rockchip/*`, в английском — `buildroot/package/rockchip/*`. В английском §8 пропущено подчёркивание в описании замены; китайский текст и пример используют `_`. Проверяйте свой SDK.

[Toolchain / 工具链 / Toolchain / Toolchain](https://eyun.baidu.com/s/3smN9fml)

[ArmSoM Docs](https://docs.armsom.org/)

[Weston source reference](https://fossies.org/linux/weston/man/weston.ini.man)

{% endraw %}
