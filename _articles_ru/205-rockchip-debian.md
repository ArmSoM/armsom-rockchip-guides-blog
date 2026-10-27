---
title: "Руководство разработчика Rockchip Debian"
description: "Руководство разработчика Rockchip Debian — V1.8.0"
excerpt: "Руководство разработчика Rockchip Debian"
translation_key: "205-rockchip-debian"
slug: "205-rockchip-debian"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Debian, Linux]
---

{% raw %}

# Руководство разработчика Rockchip Debian

Основа — китайский и английский документы Rockchip Debian V1.8.0 от 2024-09-20. Сохранены все 11 технических глав, команды, конфигурации, таблицы и исходные рисунки. Статус сопровождения, планы выпусков, показатели производительности и стандартные учётные записи — исторические сведения источника, а не текущий статус или результаты испытаний ArmSoM. Перед применением проверьте конкретную плату, SoC, SDK/BSP, ядро и периферию. Команды и аппаратные испытания не выполнялись.

В английском PDF несколько заголовков и пояснений FAQ ошибочно попали в код; потеряны экранирование shell и отдельные параметры. Границы кода и номера 9.1–9.30 с подразделами восстановлены по китайскому оригиналу; последние английские номера 0.19/0.20/1/2 приведены к 9.29/9.30/10/11. Написания `-no-sandbox` / `--no-sandbox`, `vvp8enc`, разные порядки Padding и номера версий сохранены без скрытого исправления. Слабые стандартные пароли, root без пароля и отключённая песочница описывают исходную среду разработки и не рекомендуются для эксплуатации.

| Версия Debian | Платформа | SoC, проверенные в источнике |
| --- | --- | --- |
| 12 | ARM | RK3588, RK3576, RK3568, RK3566, RK3562 |
| 11 | ARM | RK3588, RK3568, RK3566, RK3562, RK3399, RK3288 |
| 10 | ARM | RK3399PRO, PX30, RK3326, RK3288, RK3328, RK3126C |

<!-- source:en p6 unit:0 -->

## 1. Введение в Debian

<!-- source:en p6 unit:1 -->

### 1.1 Что такое Debian

<!-- source:en p6 unit:2 -->

Debian — полностью свободная Linux-система с открытым исходным кодом, широко применяемая на различных устройствах. Причины выбора Debian: свободное ПО. Debian состоит из свободного ПО с открытым кодом и всегда будет на 100% свободным. Каждый может использовать, изменять и распространять его. На платформе Rockchip можно построить Debian для дальнейшей разработки. Debian — стабильная и безопасная ОС на базе Linux. Она широко используется на ноутбуках, настольных компьютерах и серверах. С 1993 года пользователи высоко оценивают её стабильность и надёжность. Для каждого пакета предусмотрены разумные настройки по умолчанию. Разработчики Debian стремятся предоставлять обновления безопасности всем пакетам на протяжении их жизненного цикла. Debian поддерживает разнообразное оборудование. Большинство устройств поддерживается ядром Linux; при недостаточной поддержке свободным ПО можно использовать проприетарные драйверы. Адаптированы и поддерживаются, в частности, Rockchip RK3588/RK3576/RK356X/RK3399/RK3288. Debian обеспечивает плавное обновление. В течение цикла выпуска обновления просты и плавны, включая переход к следующей основной версии. Rockchip уже перешла с Debian Stretch (9) на Debian Buster (10), Bullseye (11) и Bookworm (12). Debian служит основой множества других дистрибутивов.

<!-- source:en p7 unit:3 -->

Многие популярные Linux-дистрибутивы, например Ubuntu, Knoppix, PureOS, SteamOS и Tails, используют Debian как программную основу. Debian предоставляет инструменты, позволяющие расширять пакеты его архива собственными пакетами под конкретные потребности. Проект Debian — сообщество. Это не только операционная система Linux: ПО создают сотни добровольцев со всего мира. Участником сообщества можно стать, даже не будучи программистом или системным администратором.

<!-- source:en p7 unit:4 -->

### 1.2 Поддерживаемые версии Debian

<!-- source:en p7 unit:5 -->

| Версия | Поддерживаемые архитектуры | Окончание поддержки (ожидаемое) | Текущее состояние |
| --- | --- | --- | --- |
| Debian 9 «Stretch» | armhf и arm64 | 2022-06 | Поддержка завершена |
| Debian 10 «Buster» | armhf и arm64 | 2024-06 | На сопровождении |
| Debian 11 «Bullseye» | armhf и arm64 | 2026-06 | На сопровождении |
| Debian 12 «Bookworm» | armhf и arm64 | 2028-06 | В разработке |

<!-- source:en p7 unit:6 -->

Дополнительные сведения о долгосрочной поддержке версий Debian доступны на официальном сайте.

<!-- source:en p7 unit:7 -->

## 2. Быстрый старт с Debian

<!-- source:en p7 unit:8 -->

### 2.1 Подготовка среды

<!-- source:en p7 unit:9 -->

Для сборки рекомендуется Ubuntu 22.04. В других Linux-системах может потребоваться соответствующая корректировка пакетов. Помимо требований к ОС существуют аппаратные и программные требования. Аппаратные: 64-битная система, более 40G дискового пространства. Для нескольких проектов потребуется больше места. Программные: Ubuntu 22.04. Далее команды установки пакетов, необходимых для среды сборки SDK:

<!-- source:en p7 unit:10 -->

```text
sudo apt-get update && sudo apt-get install git ssh make gcc libssl-dev liblz4-
tool expect expect-dev g++ patchelf chrpath gawk texinfo chrpath diffstat binfmt-
support qemu-user-static live-build bison flex fakeroot cmake gcc-multilib g++-
multilib unzip device-tree-compiler ncurses-dev libgucharmap-2-90-dev bzip2 expat
gpgv2 cpp-aarch64-linux-gnu libgmp-dev libmpc-dev bc python-is-python3 python2
```

<!-- source:en p8 unit:11 -->

Для разработки рекомендуется Ubuntu22.04 или более новая версия. При ошибках сборки установите соответствующие пакеты по сообщениям об ошибках.

<!-- source:en p8 unit:12 -->

### 2.2 Получение исходного кода

<!-- source:en p8 unit:13 -->

Исходный код находится в каталоге проекта &lt;SDK&gt;/debian в SDK, опубликованном на сервере кода Rockchip.

<!-- source:en p8 unit:14 -->

### 2.3 Сборка

<!-- source:en p8 unit:15 -->

Пакеты, необходимые для сборки Debian

<!-- source:en p8 unit:16 -->

```text
sudo dpkg -i debian/ubuntu-build-service/packages/*
sudo apt-get install -f

Note: The live-build_*.deb is sourced from
https://mirrors.ustc.edu.cn/debian/pool/main/l/live-build/
The debootstrap_*.deb is sourced from
https://mirrors.ustc.edu.cn/debian/pool/main/d/debootstrap/

Alternatively, you can install the dependency environment by:
sudo apt-get remove live-build
git clone https://salsa.debian.org/live-team/live-build.git --depth 1 -b
debian/1%20230131
cd live-build
rm -rf manpages/po/
sudo make install -j8
```

<!-- source:en p8 unit:17 -->

Сборка Debian: перейдите в проект SDK и выполните сборку напрямую.

<!-- source:en p8 unit:18 -->

```text
./build.sh debian
```

<!-- source:en p8 unit:19 -->

Либо перейдите в каталог Debian/:

<!-- source:en p8 unit:20 -->

```text
cd debian/
```

<!-- source:en p8 unit:21 -->

См. readme.md в текущем каталоге.

<!-- source:en p9 unit:22 -->

## 3. Структура каталогов Debian

<!-- source:en p9 unit:23 -->

```text
debian
├── mk-base-debian.sh ##Retrieve Debian base packages and compile
├── mk-image.sh ##Package to generate ext4 firmware
├── mk-rootfs-<debian-version>.sh ##Adapt for Rockchip hardware acceleration
packages
├── mk-rootfs.sh  ##Point to specific Rootfs version, currently Bullseye and
Bookworm versions are available.
├── overlay ##Common configuration files for Rockchip platform adaptation
├── overlay-debug ##System frequently used debugging tools
├── overlay-firmware ##Storage for some device firmware, such as npu/dp, etc.
├── packages ##Contains precompiled packages for armhf/arm64 system adaptation
with hardware acceleration
├── packages-patches ##Precompiled packages with patches based on official
versions
├── readme.md ##Documentation guide
└── ubuntu-build-service ##Obtain Debian distribution from official sources, can
depend on packages and customize installation of related packages.
```

<!-- source:en p9 unit:24 -->

Вся структура реализована shell-скриптами для получения, построения, компиляции и установки Debian Linux с адаптированными пакетами аппаратного ускорения Rockchip.

<!-- source:en p9 unit:25 -->

## 4. Руководство по Debian live-build

<!-- source:en p9 unit:26 -->

live build — набор скриптов для построения образов live-систем. Его идея — инструментарий с конфигурационным каталогом для полной автоматизации и настройки всех аспектов создания live-образов. Подробнее см. Live manual на официальном сайте. Репозиторий исходников пакета Debian (VCS: Git): live-build-git. Репозиторий исходников с веб-просмотром: live-build.

<!-- source:en p9 unit:27 -->

### 4.1 Связанные команды

<!-- source:en p9 unit:28 -->

lb config создаёт в текущем каталоге auto, config и соответствующие конфигурационные файлы, затем запускает auto/config. lb clean запускает auto/clean.

<!-- source:en p10 unit:29 -->

lb build строит образ системы согласно конфигурационным скриптам каталога config.

<!-- source:en p10 unit:30 -->

### 4.2 Настройка репозиториев пакетов

<!-- source:en p10 unit:31 -->

Способ 1

<!-- source:en p10 unit:32 -->

```text
lb config --mirror-bootstrap http://mirrors.ustc.edu.cn/debian --mirror-chroot-
security http://mirrors.ustc.edu.cn/debian-security/ --mirror-chroot-backports
http://mirrors.ustc.edu.cn/debian-backports/
```

<!-- source:en p10 unit:33 -->

Зеркало chroot: --mirror-chroot. По умолчанию используется значение --mirror-bootstrap; также можно создать config/archives/your-repository.list.chroot с адресом репозитория. Источник будет добавлен в /etc/apt/sources.list.d/ live-системы. Способ 2:

<!-- source:en p10 unit:34 -->

```text
lb config --mirror-binary http://mirrors.ustc.edu.cn/debian --mirror-binary-
security http://mirrors.ustc.edu.cn/debian-security/
```

<!-- source:en p10 unit:35 -->

Другой вариант — создать config/archives/your-repository.list.binary с адресом репозитория.

<!-- source:en p10 unit:36 -->

### 4.3 Настройка набора системных пакетов

<!-- source:en p10 unit:37 -->

Способ 1: разместите список необходимых пакетов в customization/package-lists под именем XXX.list.chroot или XXX.list.binary. Способ 2: параметром --package-lists "XXX" укажите список из /usr/share/live/build/package-lists/. После выполнения lb config по параметрам скрипта в config создаются четыре файла: binary, bootstrap, chroot и common. lb build читает эти файлы, поэтому после lb config их параметры можно дополнительно изменить. Например, в auto/config имеются следующие параметры:

<!-- source:en p11 unit:38 -->

```text
set -e

echo "I: create configuration"
export LB_BOOTSTRAP_INCLUDE="apt-transport-https gnupg"
lb config  --mirror-bootstrap "http://mirrors.ustc.edu.cn/debian"  --mirror-
chroot "http://mirrors.ustc.edu.cn/debian"  --mirror-chroot-security
"http://mirrors.ustc.edu.cn/debian-security"  --mirror-binary
"http://mirrors.ustc.edu.cn/debian"  --mirror-binary-security
"http://mirrors.ustc.edu.cn/debian-security"  --apt-indices false  --apt-
recommends false  --apt-secure false  --architectures arm64  --archive-areas
'main contrib non-free'  --backports false  --binary-filesystem ext4  --binary-
images tar  --bootappend-live "hostname=linaro-alip username=linaro"  --
bootloader "syslinux"  --bootstrap-qemu-arch arm64  --bootstrap-qemu-static
/usr/bin/qemu-aarch64-static  --cache false  --chroot-filesystem none  --
compression gzip  --debootstrap-options "--variant=minbase --include=apt-
transport-https,gnupg"  --distribution bullseye  --gzip-options '-9 --rsyncable'
--iso-publisher 'Linaro; http://www.linaro.org/; linaro-dev@lists.linaro.org'  --
iso-volume 'Linaro Bullseye $(date +%Y%m%d-%H:%M)'  --linux-flavours none  --
linux-packages none  --mode debian  --security true  --system normal  --updates
true
```

<!-- source:en p11 unit:39 -->

#### 4.3.1 Пользовательский каталог

<!-- source:en p11 unit:40 -->

Пользовательские каталоги и файлы следует помещать в соответствующий include-каталог внутри config/: config/binary_local-includes (корень — корневой каталог создаваемого образа); config/chroot_local-includes (корень — корневой каталог целевой системы).

<!-- source:en p11 unit:41 -->

#### 4.3.2 HOOKS

<!-- source:en p11 unit:42 -->

После каждого этапа live-build выполняются скрипты соответствующих hooks в config/: config/binary_local-hooks и config/chroot_local-hooks. Новые версии live-build получают патчи из каталогов live/normal.

<!-- source:en p11 unit:43 -->

```text
customization/hooks/live/
├── 0001-setup_user_linaro.binary
├── 0002-add_linaro_to_groups.binary
├── 0003-check_sudoers_for_admin.binary
├── 0021-silence-systemd.binary
├── 0022-disable-systemd-services.binary
├── 0023-lightdm-autologin.binary
└── 0098-resolvconf.binary
```

<!-- source:en p12 unit:44 -->

## 5. Обзор предварительно собранных пакетов Debian

<!-- source:en p12 unit:45 -->

```text
packages/
├── arm64/armhf
│   ├── blueman
│   ├── cheese
│   ├── chromium
│   ├── glmark2
│   ├── gst-plugins-bad1.0
│   ├── gst-plugins-base1.0
│   ├── gst-plugins-good1.0
│   ├── gst-plugins-ugly1.0
│   ├── gstreamer
│   ├── gst-rkmpp
│   ├── libdrm
│   ├── libdrm-cursor
│   ├── libmali
│   ├── libv4l
│   ├── mpp
│   ├── openbox
│   ├── pcmanfm
│   ├── pipewire
│   ├── rga
│   ├── rga2
│   ├── rkaiq
│   ├── rkisp
│   ├── rknpu2
│   ├── rktoolkit
│   ├── rkwifibt
│   ├── wayland
│   ├── weston
│   ├── wireplumber
│   └── xserver
```

<!-- source:en p12 unit:46 -->

### 5.1 Blueman

<!-- source:en p12 unit:47 -->

Blueman — менеджер Bluetooth на GTK+. Он эффективно работает с API BlueZ и упрощает следующие задачи: коммутируемые соединения 3G/EDGE/GPRS; подключение и создание сетей Bluetooth; подключение устройств ввода и аудиоустройств; отправка, получение и просмотр файлов по OBEX (Object Exchange); сопряжение. Предварительно собранные пакеты:

<!-- source:en p13 unit:48 -->

```text
blueman/
├── blueman_2.3.5-2_arm64.deb
└── blueman-dbgsym_2.3.5-2_arm64.deb

packages-patches/blueman/
├── 0001-Blueman-Fix-DisplayPasskey-for-Keyboard.patch
└── 0002-Don-t-turn-off-the-bt-power.patch
```

<!-- source:en p13 unit:49 -->

Rockchip обновила Blueman главным образом для устранения проблем Bluetooth-устройств, например клавиатур и колонок, при переходе в сон и пробуждении. Кроме того, многие сторонние Bluetooth- и Wi-Fi-программы пытаются управлять питанием модулей через /dev/rfkill. Платформа Rockchip использует нестандартные драйверы поставщиков, которым обычно нужны особые этапы инициализации; после повторного включения питания они могут работать неправильно. Поэтому питание и инициализацию Wi-Fi/Bluetooth независимо выполняют скрипты SDK, исключая вмешательство сторонних программ.

<!-- source:en p13 unit:50 -->

### 5.2 Media Process Platform (MPP)

<!-- source:en p13 unit:51 -->

Rockchip предоставляет универсальную для своего семейства микросхем платформу обработки мультимедиа Media Process Platform (MPP). Она скрывает от приложений сложность низкоуровневой обработки и различия между микросхемами, предоставляя единый Media Process Interface (MPI). Функции MPP: декодирование H.265 / H.264 / H.263 / VP9 / VP8 / MPEG-4 / MPEG-2 / MPEG-1 / VC1 / MJPEG / AV1; кодирование H.265 / H.264 / VP8 / MJPEG; обработка видео — копирование, масштабирование, преобразование цветового пространства и устранение чересстрочности (Deinterlace). Для отладки можно включить следующие переключатели подробного журналирования:

<!-- source:en p13 unit:52 -->

```text
export mpi_debug=1
export mpp_debug=1
export h264d_debug=1
export mpp_buffer_debug=2
```

<!-- source:en p13 unit:53 -->

По умолчанию MPP не выводит журнал непосредственно в терминал. Для просмотра в терминале задайте:

<!-- source:en p13 unit:54 -->

```text
export mpp_syslog_perror=1
```

<!-- source:en p13 unit:55 -->

Переключатели отладочного журнала зависят от ядра. Для ядер 4.19/5.10/6.1 (Linux 4.19 и выше):

<!-- source:en p14 unit:56 -->

```text
echo 0x100 > /sys/module/rk_vcodec/parameters/mpp_dev_debug
cat /proc/kmsg
```

<!-- source:en p14 unit:57 -->

Для ядра 4.4 (Linux 4.4):

<!-- source:en p14 unit:58 -->

```text
echo 0x100 > /sys/module/rk_vcodec/parameters/debug
cat /proc/kmsg
```

<!-- source:en p14 unit:59 -->

После выполнения этих команд видно время кодирования и декодирования одного кадра в ядре. Это полезно для оценки производительности и анализа рывков или плавности. Пример журнала:

<!-- source:en p14 unit:60 -->

```text
rk_vcodec: fdf80200.rkvdec:0 session 2269:34 time: 14870 us hw 5430 us
rk_vcodec: fdf80200.rkvdec:0 session 2269:34 time: 13157 us hw 4132 us
rk_vcodec: fdf80200.rkvdec:0 session 2269:34 time: 12976 us hw 4098 us
rk_vcodec: fdf80200.rkvdec:0 session 2269:34 time: 11295 us hw 4070 us
...
```

<!-- source:en p14 unit:61 -->

Подробнее см. документацию разработки MPP в &lt;SDK&gt;/docs/Linux/Multimedia. В Debian интегрированы следующие предварительно собранные пакеты:

<!-- source:en p14 unit:62 -->

```text
mpp/
├── librockchip-mpp-dev_1.5.0-1_arm64.deb
├── librockchip-mpp1-dbgsym_1.5.0-1_arm64.deb
├── librockchip-mpp1_1.5.0-1_arm64.deb
├── librockchip-vpu0-dbgsym_1.5.0-1_arm64.deb
├── librockchip-vpu0_1.5.0-1_arm64.deb
├── rockchip-mpp-demos-dbgsym_1.5.0-1_arm64.deb
└── rockchip-mpp-demos_1.5.0-1_arm64.deb
```

<!-- source:en p14 unit:63 -->

В Debian MPP интегрируется с разработанным Rockchip фреймворком Rockit и сторонними мультимедийными фреймворками, например GStreamer, обеспечивая поддержку обработки мультимедиа. Примечание: из-за авторских прав и коммерческих лицензионных ограничений официальный Linux SDK не поддерживает FFmpeg.

<!-- source:en p14 unit:64 -->

### 5.3 libv4l

<!-- source:en p14 unit:65 -->

Плагин v4l2 связывает Chromium с mpp для аппаратного декодирования. Предварительно собранные пакеты:

<!-- source:en p14 unit:66 -->

```text
libv4l/
...
├── libv4l-0_1.22.1-5_arm64.deb
├── libv4l-0-dbgsym_1.22.1-5_arm64.deb
├── libv4l2rds0_1.22.1-5_arm64.deb
├── libv4l2rds0-dbgsym_1.22.1-5_arm64.deb
├── libv4lconvert0_1.22.1-5_arm64.deb
```

<!-- source:en p15 unit:67 -->

```text
├── libv4lconvert0-dbgsym_1.22.1-5_arm64.deb
├── libv4l-dev_1.22.1-5_arm64.deb
├── libv4l-rkmpp_1.5.1-1.1_arm64.deb
├── libv4l-rkmpp-dbgsym_1.5.1-1.1_arm64.deb
├── v4l-utils_1.22.1-5_arm64.deb
└── v4l-utils-dbgsym_1.22.1-5_arm64.deb
```

<!-- source:en p15 unit:68 -->

Сторонний пакет v4l-utils требует следующих патчей:

<!-- source:en p15 unit:69 -->

```text
├── 0001-libv4l2-Support-mmap-to-libv4l-plugin.patch
├── 0002-libv4l-mplane-Filter-out-multiplane-formats.patch
├── 0003-libv4l-add-V4L2_MEMORY_DMABUF-memory-support.patch
├── 0004-libv4l-mplane-plugin-add-exbuf_ioctl-for-dmabuf.patch
├── 0005-video-max-frame-change-from-32-to-64.patch
├── 0006-Support-builtin-v4l-plugins.patch
├── 0007-libv4l-Disallow-conversion-by-default.patch
```

<!-- source:en p15 unit:70 -->

Затем соберите libv4l-rkmpp — плагин связи libv4l с mpp.

<!-- source:en p15 unit:71 -->

### 5.4 Chromium

<!-- source:en p15 unit:72 -->

Встроенный в Debian браузер Chromium собирается на основе Yocto.

<!-- source:en p15 unit:73 -->

```text
chromium/
└── chromium-x11_126.0.6478.126_arm64/armhf.deb
```

<!-- source:en p15 unit:74 -->

Chromium поддерживает H264, VP8, VP9, AV1 и другие видеоформаты; начиная с версии 105 добавлен H265. В Debian аппаратное декодирование реализовано изменённым Chromium, плагином V4L2 и MPP. Основные изменения: включение v4l2 vda в Chromium и соответствующие патчи; добавление плагина v4l2 mpp. Ограничения: a) декодирование только vp8, h264, h265, vp9, av1; b) кодирование только vp8 и h264; c) нужна изменённая сборка Chromium с прохождением процесса сборки Yocto. Предоставляются Chromium wayland-патчи для Yocto, buildroot и других систем. Версия Chromium: root@linaro-alip:~# chromium --version; вывод: Chromium 126.0.6478.126 stable.

```text
root@linaro-alip:~# chromium --version
Chromium 126.0.6478.126 stable
```

<!-- source:en p16 unit:75 -->

### 5.5 glmark2

<!-- source:en p16 unit:76 -->

```text
glmark2/
├── glmark2-data_2023.01+dfsg-1_all.deb
├── glmark2-drm-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-drm_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-drm-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-drm_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-wayland-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-wayland_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-x11-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-es2-x11_2023.01+dfsg-1_arm64.deb
├── glmark2-wayland-dbgsym_2023.01+dfsg-1_arm64.deb
├── glmark2-wayland_2023.01+dfsg-1_arm64.deb
├── glmark2-x11-dbgsym_2023.01+dfsg-1_arm64.deb
└── glmark2-x11_2023.01+dfsg-1_arm64.deb
```

<!-- source:en p16 unit:77 -->

Glmark2 — открытый инструмент тестирования OpenGL 2.0 и ES 2.0, обычно используемый для оценки GPU. Открытый код Glmark2 интегрирован в Debian для соответствующих тестов.

<!-- source:en p16 unit:78 -->

```text
usr/local/bin/test_glmark2_*.sh
├── test_glmark2_fullscreen.sh  ### Full screen test
├── test_glmark2_normal.sh ### Default display resolution test at 800x600
├── test_glmark2_offscreen.sh ### Screenless test

root@linaro-alip:~# test_glmark2_normal.sh
arm_release_ver: g24p0-00eac0, rk_so_ver: 3
=======================================================
    glmark2 2023.01
=======================================================
    OpenGL Information
    GL_VENDOR:      ARM
    GL_RENDERER:    Mali-G610
    GL_VERSION:     OpenGL ES 3.2 v1.g24p0-
00eac0.98fbd14bd397c6bd1b57c689f07cf638
    Surface Config: buf=24 r=8 g=8 b=8 a=0 depth=24 stencil=0 samples=0
    Surface Size:   1080x1920 fullscreen
=======================================================
[build] use-vbo=false:
---
```

<!-- source:en p16 unit:79 -->

Дополнительные варианты использования см. в справке.

<!-- source:en p16 unit:80 -->

```text
root@linaro-alip:~# glmark2-es2 --help
A benchmark for Open GL (ES) 2.0

Options:
  -b, --benchmark BENCH  A benchmark or options to run: '(scene)?(:opt1=val1)*'
                         (the option can be used multiple times)
  -f, --benchmark-file F Load benchmarks to run from a file containing a
                         list of benchmark descriptions (one per line)
```

<!-- source:en p17 unit:81 -->

```text
(the option can be used multiple times)
    --validate         Run a quick output validation test instead of
                       running the benchmarks
    --data-path PATH   Path to glmark2 models, shaders and textures
                       Default: /usr/share/glmark2
    --frame-end METHOD How to end a frame [default,none,swap,finish,readpixels]
    --off-screen       Render to an off-screen surface
    --visual-config C  The visual configuration to use for the rendering
                       target: 'red=R:green=G:blue=B:alpha=A:buffer=BUF'.
                       The parameters may be defined in any order, and any
                       omitted parameters assume a default value of '1'
    --reuse-context    Use a single context for all scenes
                       (by default, each scene gets its own context)
-s, --size WxH         Size of the output window (default: 800x600)
    --fullscreen       Run in fullscreen mode (equivalent to --size -1x-1)
-l, --list-scenes      Display information about the available scenes
                       and their options
    --show-all-options Show all scene option values used for benchmarks
                       (only explicitly set options are shown by default)
    --run-forever      Run indefinitely, looping from the last benchmark
                       back to the first
    --annotate         Annotate the benchmarks with on-screen information
                       (same as -b :show-fps=true:title=#info#)
-d, --debug            Display debug messages
-h, --help             Display help
```

<!-- source:en p17 unit:82 -->

### 5.6 gst-rkmpp

<!-- source:en p17 unit:83 -->

GStreamer-Rockchip — промежуточное ПО кодирования и декодирования аудио/видео на основе GStreamer, адаптированное к Rockchip и преимущественно использующее интерфейс mpp. Предварительно собранные пакеты GStreamer-Rockchip:

<!-- source:en p17 unit:84 -->

```text
gst-rkmpp/
├── gstreamer1.0-rockchip1-dbgsym_1.14-4_arm64.deb
└── gstreamer1.0-rockchip1_1.14-4_arm64.deb
```

<!-- source:en p17 unit:85 -->

### 5.7 GStreamer

<!-- source:en p17 unit:86 -->

GStreamer включает основной фреймворк и базовые компоненты. Патч GStreamer 1.22.0 добавляет DMABUF как часть системной памяти, делая операции с памятью гибче и эффективнее и устраняя зависание циклического воспроизведения. Соответствующие патчи:

<!-- source:en p17 unit:87 -->

```text
├── 0001-filesrc-Fix-stopping-race-in-pull-mode.patch
├── 0002-HACK-gstpad-Add-1-sec-timeout-for-activation.patch
├── 0003-HACK-caps-Consider-dmabuf-subset-of-system-memory.patch
├── 0004-gst-launch-Fix-random-hang-when-EOS.patch
```

<!-- source:en p18 unit:88 -->

### 5.8 gst-plugins-base1.0

<!-- source:en p18 unit:89 -->

gst1-plugins-base — часть GStreamer с базовыми плагинами обработки мультимедиа. На основе официального gst-plugins-base улучшены производительность, совместимость и функции декодирования, воспроизведения, видеовывода, интерфейса пользователя и форматов файлов. Основные изменения: снято ограничение выдачи drained некоторыми декодерами только в верхнем контейнере; улучшены playbin/playbin2 — обработка завершения, отказ от очистки буфера при первом завершении, исправление взаимоблокировок и переходов состояния видео; добавлен рендеринг DMABUF, особенно в xvimagesink; video-converter поддерживает Rockchip RGA 2D; gl может напрямую импортировать DMABUF, даже без EGLImage; загрузчик OpenGL предпочитает DirectDmabufExternal; поддержан NV12_10LE40; можно отключать оформление окна xvimagesink; применяются координаты окна верхнего уровня; события expose игнорируются до готовности видео; поддержаны предпочтительные аудио- и видеоприёмники; исправлен расчёт битрейта ADPCM в RIFF; можно по умолчанию отключить QoS; добавлен NV16_10LE40. Патчи для gst-plugins-base1.0-1.22.0:

<!-- source:en p18 unit:90 -->

```text
gst1-plugins-base
├── 0001-Revert-decodebin-only-emit-drained-signal-when-top-c.patch
├── 0002-playbin2-send-one-about-to-finish-per-group.patch
├── 0003-playbin-do-not-drain-on-first-EOS.patch
├── 0004-playbin2-Fix-deadlock-when-hooking-about-to-finish-s.patch
├── 0005-playbin3-Fix-Qt-videoplayer-cannot-change-video-stat.patch
├── 0006-playbin2-Add-preferred-audio-video-sink.patch
├── 0007-HACK-xvimagesink-Support-dma-buffer-rendering.patch
├── 0008-video-converter-Support-rockchip-RGA-2D-accel.patch
├── 0009-HACK-gl-egl-allow-direct-dmabuf-import-when-unable-t.patch
├── 0010-glupload-dmabuf-prefer-DirectDmabufExternal-uploader.patch
├── 0011-videoconvert-Support-preferred-formats.patch
├── 0012-glupload-Support-NV12_10LE40-and-NV12-NV12_10LE40-NV.patch
├── 0013-xvimagesink-Defer-prepare-window-when-getting-zero-w.patch
├── 0014-riff-Fix-bps-caculation-error-for-ADPCM.patch
├── 0015-xvimagesink-Allow-disabling-decorations.patch
├── 0016-xvimagesink-Apply-toplevel-window-s-position.patch
├── 0017-xvimagesink-Ignore-expose-redraw-when-video-not-read.patch
```

<!-- source:en p19 unit:91 -->

```text
├── 0018-gl-x11-Honor-render-rectangle-for-toplevel-window.patch
├── 0019-gl-wayland-Honor-render-rectangle-for-toplevel-windo.patch
├── 0020-gl-x11-Allow-disabling-decorations-for-toplevel-wind.patch
├── 0021-gst-libs-Support-NV16_10LE40.patch
├── 0022-videodecoder-Allow-disabling-QoS-by-default.patch
```

<!-- source:en p19 unit:92 -->

### 5.9 gst-plugins-bad1.0

<!-- source:en p19 unit:93 -->

Патчи gst1-plugins-bad1.0 улучшают расширенный набор GStreamer в обработке видео/аудио, управлении окнами, производительности и совместимости. Изменения: исправлено чтение VUI в анализаторе H.265; устранена возможная утечка памяти VC1 при определённых условиях; MPEG-анализатор разделяет видео на кадры; улучшены Wayland и KMS, включая положение, иерархию, прозрачность, заполнение и синхронизацию окон; исправлены подготовка, показ и полноэкранный режим Wayland; оптимизирована обработка групп PCR с большими разрывами демультиплексором MPEG-TS; устранено возможное двойное закрытие общих дескрипторов KMS; поддержаны NV12_10LE40, NV16_10LE40 и другие форматы; можно игнорировать повреждённые PCR-потоки; добавлены оптимизации Rockchip, его драйверы и HDR; KMS не выбирает неподключённые разъёмы и поддерживает масштабирование/полноэкранность при установке режима; JPEG-анализатор разрешён при автоматической вставке parsebin; поддержаны DMABUF в Wayland, прозрачное видео и сенсорные указатели. На основе официального gst-plugins-bad добавлены kmssink, waylandsink и адаптации/исправления Rockchip. Патчи gst-plugins-bad1.0-1.22.0:

<!-- source:en p19 unit:94 -->

```text
gst1-plugins-bad
├── 0001-h265parser-Fix-read-vui-error.patch
├── 0002-interim-fix-vc1-stream-may-memory-leak-when-pending.patch
├── 0003-waylandsink-release-frame-callback-when-finalizing.patch
├── 0004-kmssink-Support-render-rectangle-for-plane.patch
├── 0005-kmssink-Request-window-handle.patch
├── 0006-waylandsink-Support-place-below-above.patch
├── 0007-waylandsink-Enable-changing-window-handle.patch
```

<!-- source:en p20 unit:95 -->

```text
├── 0008-kmssink-Support-setting-plane-zpos.patch
├── 0009-waylandsink-Support-setting-toplevel-window-position.patch
├── 0010-HACK-gstmpegvideoparse-Split-every-picture.patch
├── 0011-mpegtsdemux-Create-new-PCR-group-for-big-gap.patch
├── 0012-gstjpegparse-Allow-parsebin-to-use-it-for-autopluggi.patch
├── 0013-waylandsink-Drop-frame-when-window-not-ready.patch
├── 0014-waylandsink-Fix-random-crash.patch
├── 0015-camerabin2-Support-setting-default-filters.patch
├── 0016-waylandsink-Defer-prepare-window-when-getting-zero-w.patch
├── 0017-mpegts-Support-ignoring-broken-PCR-streams-by-defaul.patch
├── 0018-waylandsink-Fix-crash-when-setting-fullscreen-proper.patch
├── 0019-waylandsink-Support-window-layer-property.patch
├── 0020-waylandsink-Support-window-alpha-property.patch
├── 0021-waylandsink-Support-window-fill-mode-property.patch
├── 0022-HACK-kmssink-Open-drm-devnode-directly.patch
├── 0023-waylandsink-Use-create_immed-to-create-dmabuf.patch
├── 0024-waylandsink-Support-frame-sync-mode.patch
├── 0025-kmssink-Support-NV12_10LE40-and-NV12-NV12_10LE40-NV1.patch
├── 0026-waylandsink-Support-NV12_10LE40-and-NV12-NV12_10LE40.patch
├── 0027-waylandsink-Use-the-correct-video-info-to-access-all.patch
├── 0028-waylandsink-Prefer-to-use-waylandsink.patch
├── 0029-kmssink-Avoid-double-closing-shared-gem-handle.patch
├── 0030-kmssink-Support-ignoring-aspect-ratio.patch
├── 0031-kmssink-Support-setting-prefered-frame-syncing-mode.patch
├── 0032-waylandsink-Support-pointer-and-touch.patch
├── 0033-waylandsink-Parse-video-size-in-propose_allocation.patch
├── 0034-waylandsink-Wait-10s-for-toplevel-window-s-configure.patch
├── 0035-waylandsink-Fix-buffer-size-error-when-video-cropped.patch
├── 0036-HACK-waylandsink-Set-size-in-wl_subsurface_set_posit.patch
├── 0037-waylandsink-Support-transparent-video.patch
├── 0038-kmssink-Improve-monitor-and-plane-selection.patch
├── 0039-kmssink-Support-scaling-in-modesetting.patch
├── 0040-kmssink-Support-fullscreen-prop.patch
├── 0041-av1parser-Don-t-consider-unknown-metadata-OBUs-a-bit.patch
├── 0042-kmssink-Avoid-src-size-overflow.patch
├── 0043-waylandsink-Support-force-trying-dmabuf.patch
├── 0044-kmssink-Support-NV16_10LE40.patch
```

<!-- source:en p20 unit:96 -->

### 5.10 gst-plugins-good1.0

<!-- source:en p20 unit:97 -->

Патчи gst1-plugins-good1.0 адаптируют плагины «good», включая v4l2 и rga, к особенностям и исправлениям Rockchip. Добавлены: аппаратное отражение видео через Rockchip RGA 2D; выбор видеоустройства по умолчанию; фильтрация недоступных источников Rockchip; максимальное разрешение захвата; увеличение VIDEO_MAX_FRAME для большего числа кадровых буферов; минимальное число V4L2-буферов; настройка совместного использования буферов.

<!-- source:en p21 unit:98 -->

Для повышения производительности V4L2-источника поддержан пропуск очистки кеша буферов. Патчи gst-plugins-good1.0-1.22.0:

<!-- source:en p21 unit:99 -->

```text
gst1-plugins-good/
├── 0001-qtdemux-don-t-skip-the-stream-duration-longer-than-3.patch
├── 0002-HACK-flacparse-Handle-metadata-127.patch
├── 0003-autodetect-Add-preferred-for-autovideosink-autoaudio.patch
├── 0004-v4l2-Support-preferred-formats.patch
├── 0005-video-flip-Support-Rockchip-RGA-2D-accel.patch
├── 0006-v4l2src-Support-setting-default-device.patch
├── 0007-v4l2src-Filter-out-unavailable-RK-sources.patch
├── 0008-v4l2src-Support-setting-max-resolution.patch
├── 0009-matroska-demux-parse-Disable-QoS-lace-skipping-by-de.patch
├── 0010-v4l2-Increase-VIDEO_MAX_FRAME-to-64.patch
├── 0011-v4l2-Support-setting-v4l2-min-buffers.patch
├── 0012-v4l2-Support-disabling-buffer-sharing.patch
```

<!-- source:en p21 unit:100 -->

### 5.11 libdrm

<!-- source:en p21 unit:101 -->

Изменения относительно официальной LIBDRM: по умолчанию открывается устройство Rockchip DRM; по умолчанию обходятся API аутентификации DRM, например drmGetBusid, drmSetBusid, drmGetMagic, drmAuthMagic, drmSetInterfaceVersion, drmSetMaster, drmDropMaster. LIBDRM — междрайверное промежуточное ПО, через которое приложения пользовательского пространства, например Mesa и 2D-драйверы, взаимодействуют с ядром по протоколу DRI. Структура DRM показана ниже:

<!-- source:en p22 unit:102 -->

![libdrm](/docs/rockchip-debian/assets/en-p022-figure-01.png)

<!-- source:en p22 unit:103 -->

Предварительно собранные пакеты libdrm:

<!-- source:en p22 unit:104 -->

```text
libdrm
├── libdrm2_2.4.114-1_arm64.deb
├── libdrm2-dbgsym_2.4.114-1_arm64.deb
├── libdrm-common_2.4.114-1_all.deb
├── libdrm-dev_2.4.114-1_arm64.deb
├── libdrm-tests_2.4.114-1_arm64.deb
└── libdrm-tests-dbgsym_2.4.114-1_arm64.deb
```

<!-- source:en p22 unit:105 -->

Патчи:

<!-- source:en p22 unit:106 -->

```text
├── 0001-tests-meson.build-disable-nouveau-tests-for-static-b.patch
├── 0002-modetest-Speed-up-dumping-info.patch
├── 0003-HACK-Open-Rockchip-drm-device-by-default.patch
├── 0004-HACK-Bypass-auth-APIs-by-default.patch
```

<!-- source:en p22 unit:107 -->

### 5.12 libdrm-cursor

<!-- source:en p22 unit:108 -->

Пакет решает проблемы RK3566/RK3568, где имеются только AFBC-слои. Три основные функции: VOP не имеет отдельного слоя мыши, поэтому overlay используется как слой курсора; отображение overlay в формате AFBC; обработка выхода мыши за границы.

<!-- source:en p23 unit:109 -->

Возможности настройки drm-cursor:

<!-- source:en p23 unit:110 -->

```text
$cat /etc/drm-cursor.conf

# Configure file for libdrm-cursor.
#
#debug=
# log-file=
# hide=1 # hide cursors
# atomic=0 # disable atomic drm API
# max-fps=60
# allow-overlay=1 # allowing overlay planes
# prefer-afbc=0 # prefer plane with AFBC modifier supported
# num-surfaces=8 # num of egl surfaces to avoid edge moving corruption
# prefer-plane=65
# prefer-planes=61,65
# crtc-blocklist=64,83
```

<!-- source:en p23 unit:111 -->

Журнал по умолчанию: /var/log/drm-cursor.log. Предварительно собранные пакеты libdrm-cursor:

<!-- source:en p23 unit:112 -->

```text
libdrm-cursor/
├── libdrm-cursor-dbgsym_1.4.1-1_arm64.deb
├── libdrm-cursor-dev_1.4.1-1_arm64.deb
└── libdrm-cursor_1.4.1-1_arm64.deb
```

<!-- source:en p23 unit:113 -->

### 5.13 libmali

<!-- source:en p23 unit:114 -->

libmali — SDK для семейства GPU ARM Mali. Rockchip предоставляет предварительно собранные Debian-пакеты libmali, упрощающие разработку. Mali — платформа графического ускорения на открытых стандартах с 2D/3D-рендерингом и вычислениями общего назначения на GPU (GPGPU). Rockchip Linux поддерживает API OpenGL ES 1.1, 2.0, 3.2; Vulkan 1.0, 1.1; OpenCL 2.0. Поддержка OpenGL ES не означает поддержку полного OpenGL API. Имена пакетов строятся так: модель GPU - версия ПО - аппаратная версия (если различается, например r1p0 для RK3288/RK3288w) - параметры сборки. Вариант без суффикса — x11-gbm. GBM — механизм управления памятью на основе DRM, подходящий для EGLFS и не зависящий от X11/Wayland. Варианты Wayland и Wayland-gbm предназначены для среды Wayland.

<!-- source:en p24 unit:115 -->

Вариант dummy предназначен главным образом для мультимедийной среды разработки rockit. Набор API зависит от микросхемы; подробности см. в руководстве соответствующего чипа.

<!-- source:en p24 unit:116 -->

```text
libmali/
├── libmali-valhall-g610-g13p0-dummy-dbgsym_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-dummy_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-gbm-dbgsym_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-gbm_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-wayland-gbm-dbgsym_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-wayland-gbm_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-x11-gbm-dbgsym_1.9-1_arm64.deb
├── libmali-valhall-g610-g13p0-x11-gbm_1.9-1_arm64.deb
...
```

<!-- source:en p24 unit:117 -->

### 5.14 RGA

<!-- source:en p24 unit:118 -->

Rockchip RGA — независимый 2D-блок растрового ускорения. Он ускоряет рисование точек/линий, масштабирование, вращение, растровые операции, композицию и другие 2D-операции. Предварительно собранные пакеты приведены ниже. RGA подходит для RK kernel 4.4 и более старых версий, преимущественно ветка im2d репозитория linux-rga. RGA2 подходит для RK kernel 4.19, 5.10, 6.1 и более новых версий, преимущественно ветка multi_rga_im2d_api репозитория linux-rga.

<!-- source:en p24 unit:119 -->

```text
rga/
├── librga-dev_2.1.0-1_arm64.deb
├── librga2-deb
└── librga2_2.1.0-1_arm64.deb

rga2
├── librga2_2.2.0-1_arm64.deb
├── librga2-dbgsym_2.2.0-1_arm64.deb
└── librga-dev_2.2.0-1_arm64.deb
```

<!-- source:en p24 unit:120 -->

### 5.15 Openbox

<!-- source:en p24 unit:121 -->

Openbox — лёгкий оконный менеджер X11. Официальная версия расширена поддержкой перемещения контура окна и ограничения интервала перемещения.

<!-- source:en p25 unit:122 -->

```text
Modify /home/linaro/.config/openbox/lxde-rc.xml to wireframe, change the
drawContents content:
<drawContents>yes</drawContents> to <drawContents>no</drawContents>

Set moveInterval to limit the interval of window movement:
<moveInterval>50</moveInterval>
```

<!-- source:en p25 unit:123 -->

Подробнее см. Openbox. Предварительно собранный пакет:

<!-- source:en p25 unit:124 -->

```text
openbox/
└── openbox_3.6.1-10_arm64.deb
```

<!-- source:en p25 unit:125 -->

### 5.16 pcmanfm

<!-- source:en p25 unit:126 -->

Лёгкий файловый менеджер, главным образом для лёгких рабочих окружений, например LXDE (Lightweight X11 Desktop Environment). По сравнению с официальной версией добавлена поддержка контуров. Предварительно собранные пакеты:

<!-- source:en p25 unit:127 -->

```text
pcmanfm/
├── pcmanfm_1.3.2-1_arm64.deb
└── pcmanfm-dbgsym_1.3.2-1_arm64.deb
```

<!-- source:en p25 unit:128 -->

### 5.17 Pipewire

<!-- source:en p25 unit:129 -->

Pipewire — открытый мультимедийный сервисный фреймворк с гибкими аудио-/видеоконвейерами низкой задержки для современных Linux-систем. Он предназначен для замены PulseAudio и JACK Audio Connection Kit более современным и эффективным решением. Пакет pipewire обновлён главным образом из-за шума записи в официальном Debian 12; подробнее см. официальное сообщение об ошибке. Предварительно собранные пакеты:

<!-- source:en p25 unit:130 -->

```text
pipewire/
└── libspa-0.2-modules_0.3.65-3+deb12u1_arm64.deb
```

<!-- source:en p25 unit:131 -->

### 5.18 wireplumber

<!-- source:en p25 unit:132 -->

WirePlumber — открытый инструмент маршрутизации аудио/видео на PipeWire с гибкими конвейерами обработки потоков. Изменения официальной версии главным образом адаптируют автоматическое переключение звука. Предварительно собранные пакеты:

<!-- source:en p26 unit:133 -->

```text
wireplumber/
├── gir1.2-wp-0.4_0.4.13-1_arm64.deb
├── libwireplumber-0.4-0_0.4.13-1_arm64.deb
├── libwireplumber-0.4-0-dbgsym_0.4.13-1_arm64.deb
├── libwireplumber-0.4-dev_0.4.13-1_arm64.deb
├── wireplumber_0.4.13-1_arm64.deb
├── wireplumber-dbgsym_0.4.13-1_arm64.deb
└── wireplumber-doc_0.4.13-1_all.deb
```

<!-- source:en p26 unit:134 -->

### 5.19 Rockchip Automatic Image Quality

<!-- source:en p26 unit:135 -->

Полное название — Rockchip Automatic Image Quality: автоматическая настройка процессора обработки изображения. Главным образом реализует Camera 3A и подходит для чипов ISP2.x, например RK3588, RK3576, RK356X и других. Предварительно собранные пакеты:

<!-- source:en p26 unit:136 -->

```text
rkaiq/
├── camera_engine_rkaiq_rk3562_arm64.deb ##Suitable for RK3562 series chips
├── camera_engine_rkaiq_rk3568_arm64.deb ##Suitable for RK3566/RK3568 series
chips
├── camera_engine_rkaiq_rk3576_arm64.deb ##Suitable for RK3576 series chips
└── camera_engine_rkaiq_rk3588_arm64.deb ##Suitable for RK3588 series chips
```

<!-- source:en p26 unit:137 -->

### 5.20  rkisp

<!-- source:en p26 unit:138 -->

Полное название — Rockchip Image Signal Processor, процессор обработки изображения. Главным образом реализует Camera 3A для чипов ISP1.X, например RK3288, RK3399, RK3326, PX30. Предварительно собранный пакет:

<!-- source:en p26 unit:139 -->

```text
rkisp/
└──  camera_engine_rkisp_v2.3.0_arm64.deb
```

<!-- source:en p26 unit:140 -->

### 5.21  rknpu2

<!-- source:en p26 unit:141 -->

Полное название — Rockchip Neural Processing Unit, блок обработки нейросетей. Для RKNPU сначала на компьютере преобразуйте обученную модель в RKNN с помощью RKNN-Toolkit2, затем разверните на плате через RKNN C API или Python API. Стек RKNN помогает быстро развертывать ИИ-модели на Rockchip, включая RK356X, RK3576, RK3588. Интеграционный пакет:

<!-- source:en p26 unit:142 -->

```text
rknpu2/
└── rknpu2.tar
```

<!-- source:en p27 unit:143 -->

### 5.22  rkwifibt

<!-- source:en p27 unit:144 -->

Отлаженные модули Wi-Fi/Bluetooth для платформы Rockchip, включая прошивки, инструменты и конфигурационные файлы. Предварительно собранные пакеты:

<!-- source:en p27 unit:145 -->

```text
rkwifibt/
├── rkwifibt-broadcom-firmware_1.0.0-1_arm64.deb
├── rkwifibt-dev-tools-dbgsym_1.0.0-1_arm64.deb
└── rkwifibt-dev-tools_1.0.0-1_arm64.deb
```

<!-- source:en p27 unit:146 -->

### 5.23  rktoolkit

<!-- source:en p27 unit:147 -->

Специализированный набор Rockchip rktoolkit включает io/update/vendor_storage/modetest/stressapptest/memtester/vendor_storage и другие инструменты. Предварительно собранные пакеты:

<!-- source:en p27 unit:148 -->

```text
rktoolkit/
├── rktoolkit_1.0.0-1_arm64.deb
└── rktoolkit-dbgsym_1.0.0-1_arm64.deb
```

<!-- source:en p27 unit:149 -->

### 5.24 Сервер X

<!-- source:en p27 unit:150 -->

X server — сокращённое название сервера графического интерфейса Linux. Рабочие окружения XFCE, KDE и GNOME поддерживаются X server. Debian использует лёгкое окружение LXDE/XFCE. Ниже сравниваются доступные Linux-окружения и оконные менеджеры:

<!-- source:en p28 unit:151 -->

| Рабочее окружение / оконный менеджер | Потребление памяти | Загрузка CPU | Тип |
| --- | --- | --- | --- |
| KDE 4.6 | 363MB | 4% | Рабочее окружение |
| Unity | 271MB | 14% | Рабочее окружение |
| GNOME 3 | 193MB | 10% | Рабочее окружение |
| GNOME 2.x | 191MB | 1% | Рабочее окружение |
| XFCE 4.8 | 144MB | 10% | Рабочее окружение |
| LXDE | 85MB | 10% | Рабочее окружение |
| IceWM | 85MB | 2% | Рабочее окружение |
| Enlightenment (E17 Standard) | 72MB | 1% | Оконный менеджер |
| Fluxbox | 69MB | 1% | Оконный менеджер |
| OpenBox | 60MB | 1% | Оконный менеджер |
| JWM | 58MB | 1% | Оконный менеджер |

<!-- source:en p28 unit:152 -->

Rockchip расширяет X Server следующими возможностями. Выбор видеокарты: можно вручную указать дискретную или встроенную графику. В секции OutputClass устройства с драйвером "rockchip" назначаются основным GPU, чтобы автоматическое перечисление не вызывало ошибок отображения. Аппаратное ускорение: поддержаны glamor и exa. Glamor использует GPU для композиции, exa — Rockchip RGA 2D; exa по умолчанию закомментирован и для использования требует снятия комментария. Обычно настройки находятся в /etc/X11/xorg.conf.d/20-modesetting.conf. Предотвращение разрывов: FlipFB="always" постоянно включает защиту от разрыва, но потеря производительности может достигать 50%. Оптимизация: закомментированный MaxFlipRate ограничивает частоту обновления и пропуск кадров для уменьшения потерь. Отключение EDID:

<!-- source:en p29 unit:153 -->

Значение NoEDID="true" отключает EDID; обычно это требуется при неверных данных EDID монитора. Коррекция гаммы: UseGammaLUT включает таблицу преобразования гаммы (LUT) для улучшения цветопередачи. Размер виртуального экрана: закомментированный параметр VirtualSize задаёт виртуальное разрешение, масштабируемое аппаратным VOP. Отступы физического экрана: закомментированный Padding задаёт пустые области по краям экрана. Настройки экрана и монитора: определены экран и монитор по умолчанию, связанные с ранее заданными устройствами; исходный поворот — "normal". Параметр Rotate позволяет выбрать normal, left, right и другие варианты. Конфигурационный файл приведён ниже:

<!-- source:en p29 unit:154 -->

```text
### Use Rockchip DRM driver
Section "OutputClass"
    Identifier  "RockchipDRM"
    MatchDriver "rockchip"
    Option      "PrimaryGPU"     "yes"
EndSection

Section "Device"
    Identifier  "Rockchip Graphics"
    Driver      "modesetting"

### Use Rockchip RGA 2D HW accel
#    Option      "AccelMethod"    "exa"

### Use GPU HW accel
    Option      "AccelMethod"    "glamor"

    Option      "DRI"            "2"

### Set to "always" to avoid tearing, could lead to up 50% performance loss
    Option      "FlipFB"         "always"

### Limit flip rate and drop frames for "FlipFB" to reduce performance lost
#    Option      "MaxFlipRate"    "60"

    Option      "NoEDID"         "true"
    Option      "UseGammaLUT"    "true"

### Set virtual screen size (scaled by VOP hardware)
#    Option "VirtualSize" "DSI-1:600x1080"
```

<!-- source:en p30 unit:155 -->

```text
### Set physical display paddings <top,bottom,left,right>
#    Option "Padding" "DSI-1:180,300,300,540"

EndSection

Section "Screen"
    Identifier  "Default Screen"
    Device      "Rockchip Graphics"
    Monitor     "Default Monitor"
EndSection

### Valid values for rotation are "normal", "left", "right"
Section "Monitor"
    Identifier  "Default Monitor"
    Option      "Rotate"         "normal"
EndSection
```

<!-- source:en p30 unit:156 -->

Предварительно собранные пакеты:

<!-- source:en p30 unit:157 -->

```text
Debian10 xserver/
├── xserver-common_1.20.4-1+deb10u3_all.deb
├── xserver-xorg-core-dbgsym_1.20.4-1+deb10u3_arm64.deb
├── xserver-xorg-core_1.20.4-1+deb10u3_arm64.deb
├── xserver-xorg-dev_1.20.4-1+deb10u3_arm64.deb
├── xserver-xorg-legacy-dbgsym_1.20.4-1+deb10u3_arm64.deb
└── xserver-xorg-legacy_1.20.4-1+deb10u3_arm64.deb

Debian11 xserver/
├── xserver-common_1.20.11-1_all.deb
├── xserver-xorg-core-dbgsym_1.20.11-1_arm64.deb
├── xserver-xorg-core_1.20.11-1_arm64.deb
├── xserver-xorg-dev_1.20.11-1_arm64.deb
├── xserver-xorg-legacy-dbgsym_1.20.11-1_arm64.deb
└── xserver-xorg-legacy_1.20.11-1_arm64.deb

Debian12 xserver/
├── xserver-common_21.1.7-3_all.deb
├── xserver-xorg-core-dbgsym_21.1.7-3_arm64.deb
├── xserver-xorg-core_21.1.7-3_arm64.deb
├── xserver-xorg-dev_21.1.7-3_arm64.deb
├── xserver-xorg-legacy-dbgsym_21.1.7-3_arm64.deb
└── xserver-xorg-legacy_21.1.7-3_arm64.deb
```

<!-- source:en p30 unit:158 -->

Журнал запуска находится в /var/log/Xorg*. Версию Xserver можно проверить следующим образом:

<!-- source:en p30 unit:159 -->

```text
root@linaro-alip:~# cat /var/log/Xorg.0.log |grep "X.Org X Server"
X.Org X Server 1.20.11
```

<!-- source:en p30 unit:160 -->

Соответствующие изменения Rockchip можно проверить следующим образом:

<!-- source:en p31 unit:161 -->

```text
root@linaro-alip:~# cat /var/log/Xorg.0.log |grep xorg-server
[    26.786] xorg-server f805fe554 modesetting: Filter out invalid format
modifiers (https://www.debian.org/support)
```

<!-- source:en p31 unit:162 -->

### 5.25 Weston

<!-- source:en p31 unit:163 -->

Weston — открытый сервер отображения, эталонная реализация протокола Wayland. По сравнению с официальной версией внесены следующие изменения: динамическое управление состоянием экрана (разрешение, поворот, включение/выключение, замораживание, положение); настраиваемый размер указателя, поскольку исходный слишком мал на экранах высокого разрешения; значки рабочего стола; эффективная передача экрана по VNC; зеркальный режим; виртуальный VT пользовательского уровня; поддержка обрезанных экранов; анимация загрузки. Предварительно собранные пакеты:

<!-- source:en p31 unit:164 -->

```text
weston/
├── libweston-10-0_10.0.1-1_arm64.deb
├── libweston-10-0-dbgsym_10.0.1-1_arm64.deb
├── libweston-10-dev_10.0.1-1_arm64.deb
├── weston_10.0.1-1_arm64.deb
└── weston-dbgsym_10.0.1-1_arm64.deb
```

<!-- source:en p31 unit:165 -->

### 5.26 Wayland

<!-- source:en p31 unit:166 -->

Wayland — новый открытый протокол отображения, современная альтернатива традиционной X Window System (X11). На основе последней официальной версии добавлены поддержка wayland-egl и ожидание сокета в клиентах Wayland. Предварительно собранные пакеты:

<!-- source:en p31 unit:167 -->

```text
wayland
├── libwayland-bin_1.21.0-1_arm64.deb
├── libwayland-client0_1.21.0-1_arm64.deb
├── libwayland-cursor0_1.21.0-1_arm64.deb
├── libwayland-dev_1.21.0-1_arm64.deb
├── libwayland-egl1_1.21.0-1_arm64.deb
├── libwayland-egl-backend-dev_1.21.0-1_arm64.deb
└── libwayland-server0_1.21.0-1_arm64.deb
```

<!-- source:en p32 unit:168 -->

## 6. Основные навыки разработки для Debian

<!-- source:en p32 unit:169 -->

### 6.1 Пересборка пакетов Debian

<!-- source:en p32 unit:170 -->

Изменение и переупаковка сторонних пакетов Debian: apt-get build-dep &lt;pkg&gt; — установка зависимостей сборки; apt source &lt;pkg&gt; — загрузка исходного кода пакета &lt;pkg&gt;; создание репозитория git и применение исправлений; dpkg-buildpackage -b -uc -us -d — повторная сборка и упаковка. Ниже приведён пример изменения Xserver и повторной упаковки deb. Убедитесь, что в /etc/apt/sources.list включён deb-src, и обновите источники командой apt update.

<!-- source:en p32 unit:171 -->

```text
- Install build dependencies
`apt-get build-dep xorg-server-source`

- Download Xorg-xserver source code
`apt source xorg-server-source`

- Create git and apply patches
$ cd xorg-server_*
$ git init && git add .
$ git commit -s "xxxxx"

- Start compiling and packaging deb
dpkg-buildpackage -b -uc -us -d
```

<!-- source:en p32 unit:172 -->

### 6.2 Сборка Debian в Docker

<!-- source:en p32 unit:173 -->

Поддерживается сборка соответствующего исходного кода в Docker на ПК и упаковка в deb для удобной интеграции в систему. Подробнее: &lt;SDK&gt;/docs/en/Linux/Docker/Rockchip_Developer_Guide_Debian_Docker_EN.pdf.

<!-- source:en p32 unit:174 -->

### 6.3 Управление разделами Debian

<!-- source:en p32 unit:175 -->

При загрузке Debian поддерживает проверку, изменение размера и монтирование разделов rootfs/oem/userdata. В систему добавлена служба resize-all.service для изменения размера разделов различных форматов.

<!-- source:en p33 unit:176 -->

Служба находится в /lib/systemd/system/resize-all.service; основные исполняемые файлы — /usr/bin/resize-helper и /usr/bin/disk-helper. Отладочный журнал — /var/log/resize-all.log, например:

<!-- source:en p33 unit:177 -->

```text
root@linaro-alip:~# cat /var/log/resize-all.log
Start resizing all internal mounted partitions
Log saved to /var/log/resize-all.log
[19]: Handling /dev/sda8 /userdata ext4 rw,relatime,stripe=128
[18]: Handling /dev/sda7 /oem ext4 rw,relatime
[0]: Handling /dev/sda6 / ext4 rw,relatime
[19]: Already resized /dev/sda8(ext4)
[18]: Already resized /dev/sda7(ext4)
[0]: Already resized /dev/sda6(ext4)
```

<!-- source:en p33 unit:178 -->

При обычном монтировании root=PARTUUID=614e0000-0000 в командной строке ядра указывает корневой раздел rootfs. Разделы oem/userdata перечислены в /etc/fstab; systemd монтирует их при загрузке.

<!-- source:en p33 unit:179 -->

```text
root@linaro-alip:/# cat /etc/fstab
/* <file system> <mount point>   <type>  <options>       <dump>  <pass> */
proc    /proc   proc    defaults        0 0
devtmpfs        /dev    devtmpfs        defaults        0 0
devpts  /dev/pts        devpts  mode=0620,ptmxmode=0666,gid=5   0 0
tmpfs   /dev/shm        tmpfs   nosuid,nodev,noexec     0 0
sysfs   /sys    sysfs   defaults        0 0
debugfs /sys/kernel/debug       debugfs defaults        0 0
pstore  /sys/fs/pstore  pstore  defaults      0 0
PARTLABEL=oem   /oem    ext4    defaults      0 2
PARTLABEL=userdata      /userdata       ext4  defaults  0 2

File system: Device name or UUID, or the path of a network file system (NFS).
Mount point: The mount point of the file system, such as / or /mnt/mydrive.
File system type: Such as ext4, ntfs, swap, etc.
Mount options: Options used when mounting, such as defaults, ro (read-only),
noatime, etc. Multiple options are separated by commas.
dump: This field is used for the dump command, usually set to 0, indicating no
backup is needed.
pass: This field is used for the fsck command, the number indicates the order of
fsck checking. The root file system is usually 1, other file systems are 2, set
to 0 means no check.
```

<!-- source:en p33 unit:180 -->

### 6.4 Адаптация графической подсистемы Debian

<!-- source:en p33 unit:181 -->

В настоящее время основные поддерживаемые архитектуры отображения — X11 и Wayland. Основные сочетания следующие. Стандартное сочетание для X11:

<!-- source:en p33 unit:182 -->

```text
xfce4/lxde + xserver + lightdm
```

<!-- source:en p33 unit:183 -->

Стандартное сочетание для WAYLAND:

<!-- source:en p34 unit:184 -->

```text
Weston+Wayland or gnome + Wayland + gdm3
```

<!-- source:en p34 unit:185 -->

#### 6.4.1 Адаптация архитектуры отображения

<!-- source:en p34 unit:186 -->

X11/Xserver используется с лёгкими рабочими столами LXDE/XFCE и диспетчером входа lightdm. GNOME, один из основных рабочих столов, работает преимущественно с протоколом WAYLAND и настраивается через gdm3. Для проверки демонстрационных программ WAYLAND можно переключиться на Weston — тот же рабочий стол, что собирается через Buildroot или Yocto в SDK.

<!-- source:en p34 unit:187 -->

#### 6.4.2 Адаптация оконного менеджера

<!-- source:en p34 unit:188 -->

Openbox — быстрый, лёгкий, расширяемый и полностью соответствующий стандартам оконный менеджер. Ветка Openbox 3 написана заново и не наследует код предшественников, хотя внешне похожа на Blackbox; Openbox 2 основывался на Blackbox 0.65.0. Openbox может работать самостоятельно либо заменять штатный оконный менеджер KDE/Gnome. KWin — оконный менеджер X Window, часть K Desktop Environment (KDE), также работающий самостоятельно или с другими рабочими столами. В KDE 4 добавлены композитный режим и OpenGL. Xfwm4 — штатный оконный менеджер Xfce4 с простым гибким пиксельным механизмом тем на основе изображений .xpm; прочие параметры задаются текстовым файлом. Можно также использовать цвета темы gtk.

<!-- source:en p34 unit:189 -->

#### 6.4.3 Адаптация среды рабочего стола

<!-- source:en p34 unit:190 -->

GNOME 3 значительно отличается от GNOME 2.x. Интерфейс сравнительно интуитивен: нажмите «Обзор» (Activities) слева вверху или проведите пальцем для просмотра приложений, рабочих областей и т. д. В описываемых версиях дистрибутивов, включая Debian, GNOME 3 используется по умолчанию. KDE имеет меню «Пуск» в стиле Windows и эффектный интерфейс. Во многих дистрибутивах, таких как OpenSUSE, PCLinuxOS и Mandriva, KDE — рабочий стол по умолчанию.

<!-- source:en p35 unit:191 -->

XFCE потребляет меньше ресурсов, чем GNOME и KDE, подходит для лёгких систем и напоминает интерфейс Windows. LXDE — ещё одна из четырёх основных сред рабочего стола, также лёгкая и малотребовательная к ресурсам.

<!-- source:en p35 unit:192 -->

#### 6.4.4 Адаптация Chromium

<!-- source:en p35 unit:193 -->

Chromium поддерживает H264, VP8, VP9, AV1 и другие видеоформаты; с версии 105 добавлен H265. В Debian интегрировано аппаратное декодирование с помощью специальной версии Chromium, плагина V4L2 и MPP. Основные изменения: включена поддержка v4l2 vda и соответствующие исправления; добавлен плагин v4l2 mpp. Ограничения: a) декодирование только vp8, h264, h265, vp9, av1; b) кодирование только vp8 и h264; c) требуется изменённая сборка Chromium, полный процесс выполняется через Yocto. Предоставляются исправления Chromium Wayland для Yocto и Buildroot. Общая схема: в Chromium включаются V4L2 VDA/VEA, при загрузке создаётся виртуальный узел v4l2; операции Chromium с ним перехватываются v4l-utils, передаются плагину v4l-rkmpp и преобразуются в вызовы интерфейса mpp.

<!-- source:en p35 unit:194 -->

##### 6.4.4.1 Версия

<!-- source:en p35 unit:195 -->

```text
root@linaro-alip:~# chromium --version
Chromium 126.0.6478.126 stable
```

<!-- source:en p35 unit:196 -->

##### 6.4.4.2 Проверка

<!-- source:en p35 unit:197 -->

Выполните проверку следующей командой:

<!-- source:en p35 unit:198 -->

```text
chromium --no-sandbox file:///usr/local/test.mp4
```

<!-- source:en p35 unit:199 -->

Тестовый сценарий находится в /rockchip-test/chromium/test_chromium_with_video.sh.

<!-- source:en p36 unit:200 -->

```text
root@linaro-alip:~# /rockchip-test/chromium/test_chromium_with_video.sh
mpp[3048]: mpp_info: mpp version: 48962a10 author: Hongjin Li    2024-09-19
fix[avsd]: Fix attach dev error issue
[   73.431901] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 2893 us hw 2681
us
[   73.434160] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 2169 us hw 1935
us
[   73.437078] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 1500 us hw 1400
us
[   73.440013] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 1526 us hw 1497
us
[   73.441579] rk_vcodec: 27b00100.rkvdec:0 session 3129:1 time: 1345 us hw 1314
us
...
```

<!-- source:en p36 unit:201 -->

В Linux4.19/5.10/6.1+ вызов аппаратного декодирования проверяется следующей командой:

<!-- source:en p36 unit:202 -->

```text
export mpp_syslog_perror=1
echo 0x100 > /sys/module/rk_vcodec/parameters/mpp_dev_debug
```

<!-- source:en p36 unit:203 -->

В Linux4.4 вызов аппаратного декодирования проверяется следующей командой:

<!-- source:en p36 unit:204 -->

```text
export mpp_syslog_perror=1
echo 0x4 > /sys/module/rk_vcodec/parameters/debug
```

<!-- source:en p36 unit:205 -->

##### 6.4.4.3 Отладка

<!-- source:en p36 unit:206 -->

При возникновении проблем включите следующие параметры для получения дополнительных отладочных журналов.

<!-- source:en p36 unit:207 -->

```text
export mpi_debug=1
export mpp_debug=1
export h264d_debug=1
```

<!-- source:en p36 unit:208 -->

Использование аппаратного ускорения можно проверить по загрузке GPU:

<!-- source:en p36 unit:209 -->

```text
cat /sys/devices/platform/*gpu/utilisation
```

<!-- source:en p36 unit:210 -->

Если ускорение или аппаратное декодирование не используются, подробно исследуйте причину: GPU, адаптация libv4l, разрешения доступа и т. п. Например, создайте соответствующие узлы устройств в /etc/init.d/rockchip.sh.

<!-- source:en p37 unit:211 -->

```text
/* Create dummy video node for chromium V4L2 VDA/VEA with rkmpp plugin */
echo dec > /dev/video-dec0
echo enc > /dev/video-enc0
chmod 660 /dev/video-*
chown root.video /dev/video-*

/* The chromium using fixed pathes for libv4l2.so */
ln -rsf /usr/lib/*/libv4l2.so /usr/lib/
[ -e /usr/lib/aarch64-linux-gnu/ ] && ln -Tsf lib /usr/lib64
```

<!-- source:en p37 unit:212 -->

Также настройте права соответствующих узлов ядра в /etc/udev/rules.d/99-rockchip-permissions.rules, например:

<!-- source:en p37 unit:213 -->

```text
ACTION=="remove", GOTO="permissions_end"

/* VPU devices */
KERNEL=="avsd", MODE="0660", GROUP="video"
KERNEL=="vepu", MODE="0660", GROUP="video"
KERNEL=="h265e", MODE="0660", GROUP="video"
KERNEL=="rkvdec", MODE="0660", GROUP="video"
KERNEL=="rkvenc", MODE="0660", GROUP="video"
KERNEL=="mpp_service", MODE="0660", GROUP="video"
KERNEL=="vpu[_-]service", MODE="0660", GROUP="video"
KERNEL=="hevc[_-]service", MODE="0660", GROUP="video"

/* RGA device */
KERNEL=="rga", MODE="0660", GROUP="video"

/* MALI devices (/dev/mali for mali400) */
KERNEL=="mali*", MODE="0660", GROUP="video"
```

<!-- source:en p37 unit:214 -->

##### 6.4.4.4 Тестирование производительности

<!-- source:en p37 unit:215 -->

По умолчанию отображение ускоряется GPU. При аппаратном декодировании Chromium включает V4L2 VDA/VEA; при загрузке создаётся виртуальный узел V4L2; v4l-utils перехватывает операции с виртуальным устройством, передаёт их плагину v4l-rkmpp, который вызывает интерфейс mpp. Распространённые браузерные тесты: ARES-6 измеряет время выполнения новейших возможностей JavaScript; преимущество имеют быстро запускающиеся и плавно работающие браузеры. Basemark Web 3.0 — комплексный тест способности браузера выполнять веб-приложения; измеряет реальную клиентскую производительность и выявляет узкие места. JetStream 2:

<!-- source:en p38 unit:216 -->

JetStream 2 — набор тестов JavaScript и WebAssembly для современных веб-приложений; выше оцениваются быстрый запуск, исполнение кода и плавность работы. MotionMark 1.2 измеряет способность браузера анимировать сложные сцены с заданной частотой кадров. Octane — устаревший общий тест JavaScript. Он измеряет производительность JS-движка, но неточно отражает оптимизацию для современных веб-приложений; оптимизация под Octane часто не помогает реальным страницам, а иногда замедляет их. Speedometer 2.1 измеряет отзывчивость веб-приложений, имитируя действия пользователя, например добавление задач, в демонстрационных приложениях. По сравнению с Octane он точнее отражает оптимизацию JS-движка для современных приложений.

<!-- source:en p38 unit:217 -->

##### 6.4.4.5 Дополнительная информация

<!-- source:en p38 unit:218 -->

Дополнительные сведения о Chromium доступны по адресу chrome://about.

<!-- source:en p38 unit:219 -->

```text
List of Chrome URLs
chrome://about
...
chrome://flags
chrome://gcm-internals
chrome://gpu
chrome://help
chrome://histograms
chrome://history
chrome://indexeddb-internals
chrome://inspect
chrome://interstitials
chrome://invalidations
chrome://settings
chrome://version
chrome://webrtc-internals
chrome://webrtc-logs
List of chrome://internals pages
chrome://internals/web-app

For Debug
The following pages are for debugging purposes only. Because they crash or hang
the renderer, they're not linked directly; you can type them into the address bar
if you need them.

chrome://badcastcrash/
chrome://memory-exhaust/
```

<!-- source:en p39 unit:220 -->

```text
chrome://memory-pressure-critical/
chrome://memory-pressure-moderate/
...
chrome://quit/
chrome://restart/
```

<!-- source:en p39 unit:221 -->

#### 6.4.5 Адаптация Panfrost для Debian

<!-- source:en p39 unit:222 -->

См. официальные сведения Debian об адаптации Panfrost.

<!-- source:en p39 unit:223 -->

### 6.5 Адаптация аудио и видео в Debian

<!-- source:en p39 unit:224 -->

Общий процесс кодирования и декодирования видео на платформе Rockchip

<!-- source:en p39 unit:225 -->

```text
vpu_service  -->  mpp --> GStreamer/rockit --> app
vpu_service: Driver
mpp: The video encoding and decoding middleware on the Rockchip platform, refer
to the mpp documentation for details
GStreamer/rockit: Interface with app and other components
```

<!-- source:en p39 unit:226 -->

В Debian интерфейс между приложениями и компонентами кодирования/декодирования обычно обеспечивает GStreamer. Их функции можно также проверять напрямую тестовыми интерфейсами mpp, такими как mpi_dec_test и mpi_enc_test. Исходный код mpp: &lt;SDK&gt;/external/mpp/; демонстрационные тесты: &lt;SDK&gt;/external/mpp/test. Подробнее в документе SDK Rockchip_Developer_Guide_MPP_CN.pdf.

<!-- source:en p39 unit:227 -->

#### 6.5.1 Адаптация звукового тракта PulseAudio

<!-- source:en p39 unit:228 -->

По умолчанию используется pulseaudio; обычно достаточно настроить /etc/pulse/default.pa. SDK поддерживает адаптацию кодеков ES8388 и RK809.

<!-- source:en p39 unit:229 -->

```text
+set-default-source alsa_input.platform-es8388-
sound.HiFi__hw_rockchipes8388__source
+set-default-sink alsa_output.platform-es8388-sound.HiFi__hw_rockchipes8388__sink
+set-default-source alsa_input.platform-rk809-
sound.HiFi__hw_rockchiprk809__source
+set-default-sink alsa_output.platform-rk809-sound.HiFi__hw_rockchiprk809__sink
```

<!-- source:en p39 unit:230 -->

Чтобы добавить другие кодеки, получите необходимые сведения следующими командами:

<!-- source:en p39 unit:231 -->

```text
pactl list sinks short
pactl list sources short
```

<!-- source:en p40 unit:232 -->

Подробности: официальная документация Debian по PulseAudio и &lt;SDK&gt;/docs/Common/AUDIO/Rockchip_Developer_Guide_PulseAudio_EN.pdf.

<!-- source:en p40 unit:233 -->

#### 6.5.2 Адаптация MPP и VPU

<!-- source:en p40 unit:234 -->

По умолчанию MPP заранее собирается в deb и интегрируется в:

<!-- source:en p40 unit:235 -->

```text
/usr/lib/aarch64-linux-gnu/librockchip_mpp.so
/usr/lib/aarch64-linux-gnu/librockchip_mpp.so.0
/usr/lib/aarch64-linux-gnu/librockchip_mpp.so.1
```

<!-- source:en p40 unit:236 -->

Убедитесь также, что ядро предоставляет соответствующие узлы /dev/mpp_service. Подробнее: &lt;SDK&gt;/docs/Linux/Multimedia/Rockchip_Developer_Guide_MPP_EN.pdf.

<!-- source:en p40 unit:237 -->

#### 6.5.3 Адаптация GStreamer

<!-- source:en p40 unit:238 -->

См. &lt;SDK&gt;/docs/Linux/Multimedia/Rockchip_User_Guide_Linux_Gstreamer_EN.pdf.

<!-- source:en p40 unit:239 -->

#### 6.5.4 Адаптация Rockit

<!-- source:en p40 unit:240 -->

См. &lt;SDK&gt;/docs/Linux/Multimedia/Rockchip_User_Guide_Linux_Rockit_EN.pdf.

<!-- source:en p40 unit:241 -->

### 6.6 Адаптация сети Debian

<!-- source:en p40 unit:242 -->

#### 6.6.1 Адаптация RKWIFIBT

<!-- source:en p40 unit:243 -->

См. &lt;SDK&gt;/docs/Linux/Wifibt/Rockchip_Developer_Guide_Linux_WIFI_BT_EN.pdf.

<!-- source:en p40 unit:244 -->

### 6.7 Адаптация веб-камер в Debian

<!-- source:en p40 unit:245 -->

Стандартное приложение веб-камеры — cheese; оно вызывает GStreamer->mpp->vpu для кодирования и декодирования на Rockchip. Если cheese не требуется, встроенный GStreamer может напрямую обращаться к USB-камере и использовать 3A Rockchip для камер MIPI/CSI. Пример тестового сценария:

<!-- source:en p40 unit:246 -->

```text
/rockchip-test$ tree -L 1 camera/
camera/
├── camera_rkaiq_test.sh
├── camera_rkisp_test.sh
├── camera_stresstest.sh
├── camera_test.sh
└── camera_usb_test.sh
```

<!-- source:en p41 unit:247 -->

#### 6.7.1 Адаптация Cheese

<!-- source:en p41 unit:248 -->

Cheese — приложение камеры для Debian с эффектами в реальном времени, фотосъёмкой и видеозаписью. Поддерживает почти все распространённые встроенные и USB-камеры. Возможности: эффекты при фото- и видеосъёмке (чёрно-белый, комикс, рыбий глаз, масляная живопись и т. д.); съёмка фото и видео с разными разрешениями и форматами; автоматическое сохранение, а также ручной выбор каталога и имени файла; видеопредпросмотр перед съёмкой; совместимость с большинством встроенных и USB-камер. При адаптации cheese необходимо устранить следующие проблемы.

<!-- source:en p41 unit:249 -->

##### 6.7.1.1 Cheese не находит подходящий узел устройства

<!-- source:en p41 unit:250 -->

По умолчанию Cheese ищет подходящие устройства с именами video*. Фактические имена устройств Rockchip ISP включают rkisp_mainpath, rkisp_selfpath и т. д.:

<!-- source:en p41 unit:251 -->

```text
root@rk3568:~# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:rkisp_mainpath
/sys/class/video4linux/video1/name:rkisp_selfpath
/sys/class/video4linux/video2/name:rkisp_rawwr0
/sys/class/video4linux/video3/name:rkisp_rawwr2
/sys/class/video4linux/video4/name:rkisp_rawwr3
/sys/class/video4linux/video5/name:rkisp_rawrd0_m
/sys/class/video4linux/video6/name:rkisp_rawrd2_s
/sys/class/video4linux/video7/name:rkisp-statistics
/sys/class/video4linux/video8/name:rkisp-input-param
```

<!-- source:en p41 unit:252 -->

Сейчас проблема решается фильтрацией через плагин GStreamer v4l2. Задайте переменные окружения в /etc/profile.d/gst.sh:

<!-- source:en p41 unit:253 -->

```text
# Default device for v4l2src
export GST_V4L2SRC_DEFAULT_DEVICE=/dev/video-camera0

# Available RK devices for v4l2src
export GST_V4L2SRC_RK_DEVICES=_mainpath_selfpath:_bypass:_scale
```

<!-- source:en p42 unit:254 -->

##### 6.7.1.2 Потеря кадров камеры высокого разрешения в Cheese

<!-- source:en p42 unit:255 -->

При открытии imx415 в Cheese датчик MIPI теряет кадры; наблюдаются следующие признаки:

<!-- source:en p42 unit:256 -->

```text
root@linaro-alip:/# cheese -d rkisp_mainpath

[  488.510646] rkisp0-vir0: MIPI drop frame
[  488.544222] rkisp0-vir0: MIPI drop frame
[  488.577718] rkisp0-vir0: MIPI drop frame
[  488.611408] rkisp0-vir0: MIPI drop frame
[  488.644975] rkisp0-vir0: MIPI drop frame
[  488.678581] rkisp0-vir0: MIPI drop frame

Output     rkisp_mainpath Format:UYVY Size:4672x3504
```

<!-- source:en p42 unit:257 -->

Полученный от устройства размер 4672x3504 превышает возможности аппаратуры. Максимальный выход mp ISP сейчас ограничивается до 3840x2160 плагином GStreamer v4l2. Задайте переменные окружения в /etc/profile.d/gst.sh:

<!-- source:en p42 unit:258 -->

```text
# Max resolution for v4l2src
export GST_V4L2SRC_MAX_RESOLUTION=3840x2160
```

<!-- source:en p42 unit:259 -->

##### 6.7.1.3 Ошибки форматов захвата в Cheese

<!-- source:en p42 unit:260 -->

Драйвер ISP может не поддерживать некоторые форматы, даже если драйвер ядра сообщает об их поддержке. Например:

<!-- source:en p42 unit:261 -->

```text
root@linaro-alip:~# v4l2-ctl --list-formats-ext -d /dev/video8
ioctl: VIDIOC_ENUM_FMT
        Type: Video Capture Multiplanar

        [0]: 'UYVY' (UYVY 4:2:2)
                Size: Stepwise 32x16 - 4672x3504 with step 8/8
        [1]: '422P' (Planar YUV 4:2:2)
                Size: Stepwise 32x16 - 4672x3504 with step 8/8
        [2]: 'NV16' (Y/CbCr 4:2:2)
                Size: Stepwise 32x16 - 4672x3504 with step 8/8
...
```

<!-- source:en p42 unit:262 -->

При проверке NV12 и NV16 работали нормально, а I420 отображался неправильно; возможны и другие неподдерживаемые форматы. Старые приложения Windows часто предпочитают RGB. Если драйвер ISP объявляет поддержку RGB, но фактически её не обеспечивает, многие приложения работают неправильно.

<!-- source:en p43 unit:263 -->

Решение: выбрать предпочтительные форматы переменными окружения GStreamer v4l2 в /etc/profile.d/gst.sh:

<!-- source:en p43 unit:264 -->

```text
# Preferred formats for videoconvert
export GST_VIDEO_CONVERT_PREFERRED_FORMAT=NV12:NV16:I420:YUY2
```

<!-- source:en p43 unit:265 -->

##### 6.7.1.4 Зависание записи Cheese

<!-- source:en p43 unit:266 -->

В Cheese жёстко задан программный vp8enc, который может вызывать сбои и зависания штатного PulseAudio. Решение: добавить поддержку программного кодирования vp8enc через GStreamer и обновить PulseAudio. Задайте переменные окружения в /etc/profile.d/gst.sh:

<!-- source:en p43 unit:267 -->

```text
export GST_MPP_VP8ENC_FAKE_VP8ENC=1
```

<!-- source:en p43 unit:268 -->

##### 6.7.1.5 Использование mpp для видеозаписи Cheese

<!-- source:en p43 unit:269 -->

Cheese по умолчанию использует малопроизводительный программный кодировщик vvp8enc. Стандартное изменение принудительно включает аппаратный mppvp8enc из Rockchip mpp.

<!-- source:en p43 unit:270 -->

```text
--- a/libcheese/cheese-camera.c
+++ b/libcheese/cheese-camera.c
@@ -442,7 +442,7 @@ cheese_camera_set_video_recording (CheeseCamera *camera,
GError **error)
   gboolean res;
   /* Check if we can use global preset for vp8enc. */
-  video_enc = gst_element_factory_make ("vp8enc", "vp8enc");
+  video_enc = gst_element_factory_make ("mppvp8enc", "vp8enc");
   video_preset = (gchar *) &CHEESE_VIDEO_ENC_PRESET;
   res = gst_preset_load_preset (GST_PRESET (video_enc), video_preset);
```

<!-- source:en p43 unit:271 -->

Проверить можно следующим образом:

<!-- source:en p43 unit:272 -->

```text
root@linaro-alip:/# gst-inspect-1.0 |grep vp8
vpx:  vp8dec: On2 VP8 Decoder
vpx:  vp8enc: On2 VP8 Encoder
rtp:  rtpvp8depay: RTP VP8 depayloader
rtp:  rtpvp8pay: RTP VP8 payloader
rockchipmpp:  mppvp8enc: Rockchip Mpp VP8 Encoder
```

<!-- source:en p43 unit:273 -->

Ниже приведены возможности кодирования микросхем Rockchip. Таблица характеристик кодирования:

<!-- source:en p44 unit:274 -->

| Микросхема | H264 | H265 | VP8 |
| --- | --- | --- | --- |
| RK3588 | 7680x4320@30f | 7680x4320@30f | 1920x1088@30f |
| RK3566/RK3568 | 1920x1088@60f | 1920x1088@60f | Не применимо |
| RK3562 | 1920x1088@60f | Не применимо | Не применимо |
| RK3399 | 1920x1088@30f | Не применимо | 1920x1088@30f |
| RK3328 | 1920x1088@30f | 1920x1088@30f | 1920x1088@30f |
| RK3288 | 1920x1088@30f | Не применимо | 1920x1088@30f |
| RK3326 | 1920x1088@30f | Не применимо | 1920x1088@30f |
| PX30 | 1920x1088@30f | Не применимо | 1920x1088@30f |
| RK312X | 1920x1088@30f | Не применимо | 1920x1088@30f |

<!-- source:en p44 unit:275 -->

##### 6.7.1.6 Изменение каталога хранения фотографий и видео Cheese

<!-- source:en p44 unit:276 -->

По умолчанию изображения и видео сохраняются в ~/.gnome2/cheese. Чтобы изменить путь, выполните следующие действия:

<!-- source:en p44 unit:277 -->

```text
cat << EOF >~/.config/user-dirs.dirs
> #!/bin/bash
> XDG_DESKTOP_DIR="$HOME/Desktop"
> XDG_DOWNLOAD_DIR="$HOME/Downloads"
> XDG_TEMPLATES_DIR="$HOME/Templates"
> XDG_PUBLICSHARE_DIR="$HOME/Public"
> XDG_DOCUMENTS_DIR="$HOME/Documents"
> XDG_MUSIC_DIR="$HOME/Music"
> XDG_PICTURES_DIR="$HOME/Pictures"
> XDG_VIDEOS_DIR="$HOME/Videos"
> EOF
```

<!-- source:en p44 unit:278 -->

XDG_VIDEOS_DIR задаёт каталог видео, XDG_PICTURES_DIR — каталог изображений.

<!-- source:en p44 unit:279 -->

#### 6.7.2 Адаптация RKISP

<!-- source:en p44 unit:280 -->

Поддерживается ISP1.X, главным образом для RK3399/RK3288/PX30/RK3326.

<!-- source:en p44 unit:281 -->

```text
rkisp/
└── camera_engine_rkisp-v2.2.0_arm64.deb
```

<!-- source:en p45 unit:282 -->

#### 6.7.3 Адаптация RKAIQ

<!-- source:en p45 unit:283 -->

Поддерживаются версии ISP21/30/32-Lite, главным образом для RK3566/RK3568/RK3588/RK3562 и других микросхем.

<!-- source:en p45 unit:284 -->

```text
rkaiq/
├── camera_engine_rkaiq_rk3562_arm64.deb
├── camera_engine_rkaiq_rk3568_arm64.deb
└── camera_engine_rkaiq_rk3588_arm64.deb
```

<!-- source:en p45 unit:285 -->

##### 6.7.3.1 Отладка RKAIQ

<!-- source:en p45 unit:286 -->

Проверка версии rkaiq и соответствующих журналов

<!-- source:en p45 unit:287 -->

```text
root@linaro-alip:/# cat /var/log/syslog |grep rkaiq
...
Jun 18 17:37:50 linaro-alip rkaiq: ************************** VERSION INFOS
**************************
Jun 18 17:37:50 linaro-alip rkaiq: version release date: 2023-10-07
Jun 18 17:37:50 linaro-alip rkaiq:          AIQ:       AIQ v5.0x4.0
Jun 18 17:37:50 linaro-alip rkaiq:    IQ PARSER:       Calib
v1.4.8,magicCode:1170944
Jun 18 17:37:50 linaro-alip rkaiq: ************************ VERSION INFOS END
************************
```

<!-- source:en p45 unit:288 -->

Проверьте работу службы rkaiq: root@linaro-alip:/# ps aux &#124;grep rkaiq; пример вывода: root 2339 0.0 0.4 163020 8076 ? Sl 17:37 0:00 /usr/bin/rkaiq_3A_server; root 2340 0.0 0.0 8508 1240 ? S 17:37 0:00 logger -t rkaiq; root 2699 0.0 0.0 6264 604 ttyFIQ0 S+ 17:42 0:00 grep rkaiq. Отладочные журналы ISP ядра: echo 3 > /sys/module/video_rkisp/parameters/debug; echo 3 > /sys/module/video_rkcif/parameters/debug. Журналы rkaiq: AE — echo 0x1ff4 > /tmp/.rkaiq_log; AWB — echo 0x2ff4 > /tmp/.rkaiq_log; AF — echo 0x4ff4 > /tmp/.rkaiq_log; HDR — echo 0x20ff3 > /tmp/.rkaiq_log; NR — echo 0x40ff4 > /tmp/.rkaiq_log.

```text
root@linaro-alip:/# ps aux |grep rkaiq
root 2339 0.0 0.4 163020 8076 ? Sl 17:37 0:00 /usr/bin/rkaiq_3A_server
root 2340 0.0 0.0 8508 1240 ? S 17:37 0:00 logger -t rkaiq
root 2699 0.0 0.0 6264 604 ttyFIQ0 S+ 17:42 0:00 grep rkaiq
echo 3 > /sys/module/video_rkisp/parameters/debug
echo 3 > /sys/module/video_rkcif/parameters/debug
# AE
echo 0x1ff4 > /tmp/.rkaiq_log
# AWB
echo 0x2ff4 > /tmp/.rkaiq_log
# AF
echo 0x4ff4 > /tmp/.rkaiq_log
# HDR
echo 0x20ff3 > /tmp/.rkaiq_log
# NR
echo 0x40ff4 > /tmp/.rkaiq_log
```

<!-- source:en p46 unit:289 -->

Журнал Dehaze: echo 0x2000ff3 > /tmp/.rkaiq_log; Sharp: echo 0x80000ff4 > /tmp/.rkaiq_log; CAMHW: echo 0x4000000ff4 > /tmp/.rkaiq_log. Проверка информации об узлах устройств:

```text
# Dehaze
echo 0x2000ff3 > /tmp/.rkaiq_log
# Sharp
echo 0x80000ff4 > /tmp/.rkaiq_log
# CAMHW
echo 0x4000000ff4 > /tmp/.rkaiq_log
```

<!-- source:en p46 unit:290 -->

```text
root@linaro-alip:/# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif_mipi_id0
/sys/class/video4linux/video1/name:stream_cif_mipi_id1
/sys/class/video4linux/video2/name:stream_cif_mipi_id2
/sys/class/video4linux/video3/name:stream_cif_mipi_id3
/sys/class/video4linux/video4/name:rkcif_scale_ch0
/sys/class/video4linux/video5/name:rkcif_scale_ch1
/sys/class/video4linux/video6/name:rkcif_scale_ch2
/sys/class/video4linux/video7/name:rkcif_scale_ch3
/sys/class/video4linux/video8/name:rkcif_tools_id0
/sys/class/video4linux/video9/name:rkcif_tools_id1
/sys/class/video4linux/video10/name:rkcif_tools_id2
...
```

<!-- source:en p46 unit:291 -->

### 6.8 Адаптация управления питанием Debian

<!-- source:en p46 unit:292 -->

#### 6.8.1 Адаптация управления питанием

<!-- source:en p46 unit:293 -->

Управление питанием Debian достаточно сложно: разные системы имеют несколько путей перехода в сон. Добавленный сценарий кнопки power-key.sh использует pm-utils либо прямую запись в узлы; команда pm-utils записывает в узлы после выполнения hook-сценариев. Автоматический сон в xfce4, mate, gnome и других рабочих столах обычно сначала использует systemd, затем consolekit или pm-utils; systemd непосредственно записывает в узлы. Здесь приоритет унифицирован: systemd по умолчанию использует pm-utils для сна и пробуждения. Соответствующие файлы конфигурации уже интегрированы в overlay/etc/Powermanager Debian.

<!-- source:en p46 unit:294 -->

```text
├── 01npu
├── 02npu
├── 03wifibt
├── 04wifibt
├── power-key.conf
├── power-key.sh
├── triggerhappy
└── triggerhappy.service
```

<!-- source:en p46 unit:295 -->

В etc/init.d/rockchip.sh есть специальная обработка управления питанием, особенно для NPU и RKWIFIBT, а также обработка кнопки питания.

<!-- source:en p46 unit:296 -->

```text
# support power management
```

<!-- source:en p47 unit:297 -->

```text
if [ -e "/usr/sbin/pm-suspend" -a -e /etc/Powermanager ] ;
then
    mv /etc/Powermanager/power-key.sh /usr/bin/
    mv /etc/Powermanager/power-key.conf /etc/triggerhappy/triggers.d/
    if [[ "$CHIPNAME" == "rk3399pro" ]];
    then
        mv /etc/Powermanager/01npu /usr/lib/pm-utils/sleep.d/
        mv /etc/Powermanager/02npu /lib/systemd/system-sleep/
    fi
    mv /etc/Powermanager/03wifibt /usr/lib/pm-utils/sleep.d/
    mv /etc/Powermanager/04wifibt /lib/systemd/system-sleep/
    mv /etc/Powermanager/triggerhappy /etc/init.d/triggerhappy

    rm /etc/Powermanager -rf
    service triggerhappy restart
fi
```

<!-- source:en p47 unit:298 -->

Особую обработку пробуждения других модулей можно разместить в следующих двух каталогах конфигурации.

<!-- source:en p47 unit:299 -->

```text
/usr/lib/pm-utils/sleep.d/ and  /lib/systemd/system-sleep/
```

<!-- source:en p47 unit:300 -->

Тест сна и пробуждения: /rockchip-test/suspend_resume/suspend_resume.sh. Обработка для других микросхем описана в &lt;SDK&gt;/docs/en/Common/TRUST/Rockchip_RK3588_Developer_Guide_System_Suspend_EN.pdf.

<!-- source:en p47 unit:301 -->

#### 6.8.2 Настройка управления питанием

<!-- source:en p47 unit:302 -->

Раздел описывает настройку питания xfce4, главным образом DPMS и сна. Подробная конфигурация приведена ниже:

<!-- source:en p47 unit:303 -->

```text
#/etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xfce4-power-manager.xml

<channel name="xfce4-power-manager" version="1.0">
  <property name="xfce4-power-manager" type="empty">
    <!-- Let other power manager(e.g. trigger-happy) handle power key -->
    <property name="power-button-action" type="uint" value="0"/>

    <!-- Disable DPMS(auto screen-off) by default -->
    <property name="dpms-enabled" type="bool" value="false"/>
    <property name="blank-on-ac" type="int" value="0"/>

    <!-- Disable Screen lock by default -->
    <property name="lock-screen-suspend-hibernate" type="bool" value="false"/>
  </property>
</channel>
```

<!-- source:en p48 unit:304 -->

### 6.9 Адаптация ИИ в Debian

<!-- source:en p48 unit:305 -->

Адаптация NPU платформы Rockchip: RKNPU используется главным образом для преобразования моделей, инференса и оценки производительности моделей.

<!-- source:en p48 unit:306 -->

#### 6.9.1 Адаптация RKNPU

<!-- source:en p48 unit:307 -->

Главным образом для RK3568/RK3566/RK3588.

<!-- source:en p48 unit:308 -->

```text
rknpu2/
└── rknpu2.tar
```

<!-- source:en p48 unit:309 -->

#### 6.9.2 Проверка RKNN

<!-- source:en p48 unit:310 -->

Включает прежде всего тесты изменения частоты NPU, нагрузочные и демонстрационные тесты.

<!-- source:en p48 unit:311 -->

```text
/rockchip-test/npu2/
├── npu_freq_scaling.sh
├── npu_stress_test.sh
├── npu_test.sh
├── rknn_demo.sh
└── rknn_stress_test
```

<!-- source:en p48 unit:312 -->

### 6.10 Обновление прошивки Debian

<!-- source:en p48 unit:313 -->

Основные способы обновления прошивки Debian: USB; загрузка с SD-карты или USB-накопителя; программатор; OTA. OTA подразделяется на обновление через Recovery (Loader, Parameter, прочие и пользовательские разделы), обновление A/B-разделов и дифференциальное обновление. Подробнее: &lt;SDK&gt;/docs/en/Linux/Recovery/Rockchip_Developer_Guide_Linux_Upgrade_EN.pdf.

<!-- source:en p49 unit:314 -->

### 6.11 Безопасная загрузка Debian

<!-- source:en p49 unit:315 -->

#### 6.11.1 Безопасная загрузка

<!-- source:en p49 unit:316 -->

Основные методы безопасной загрузки — AVB и FIT; поддержка по микросхемам приведена ниже:

<!-- source:en p49 unit:317 -->

| Микросхема | Метод проверки ядра | Версия ядра | Носитель хранения |
| --- | --- | --- | --- |
| RK3399/RK3288 | AVB | 4.4 | eFuse |
| RK3308/RK3328/RK3326/PX30/RK3358 | AVB | 4.4 | OTP |
| RK3588/RK3562/RK3566/RK3568 | FIT | 5.10 | OTP |

<!-- source:en p49 unit:318 -->

Подробнее: &lt;SDK&gt;/docs/en/Linux/Security/Rockchip_Developer_Guide_Linux_Secure_Boot_EN.pdf.

<!-- source:en p49 unit:319 -->

### 6.12 Адаптация сенсорного ввода Debian

<!-- source:en p49 unit:320 -->

Настройте параметры матрицы X server либо проверьте их из командной строки.

<!-- source:en p49 unit:321 -->

### 6.13 Адаптация USB-устройств Debian

<!-- source:en p49 unit:322 -->

Добавлены службы usbdevice для функций usb adb/acm/hid/mtp/ntb/rndis/uac1/uac2/ums/uvc. Служба находится в /lib/systemd/system/usbdevice.service, основной исполняемый файл — /usr/bin/usbdevice. Функции USB настраиваются в /etc/profile.d/usbdevice.sh, например:

<!-- source:en p49 unit:323 -->

```text
#!/bin/sh

# The env variables below can be overridden

# option: adb acm hid mtp ntb rndis uac1 uac2 ums uvc
export USB_FUNCS="adb"

export UMS_FILE=/userdata/ums_shared.img
export UMS_SIZE=256M
export UMS_FSTYPE=vfat
export UMS_MOUNT=0
export UMS_MOUNTPOINT=/mnt/ums
export UMS_RO=0
```

<!-- source:en p50 unit:324 -->

Отладочный журнал находится в /tmp/usbdevice.log. Поддерживаемые функции USB можно проверить в /tmp/.usbdevice.

<!-- source:en p50 unit:325 -->

### 6.14 Адаптация датчиков Debian

<!-- source:en p50 unit:326 -->

gsensor/lsensor. Установите пакет lm-sensors.

<!-- source:en p50 unit:327 -->

```text
sudo apt-get install lm-sensors
```

<!-- source:en p50 unit:328 -->

Обнаружение датчиков системы

<!-- source:en p50 unit:329 -->

```text
sudo sensors-detect
```

<!-- source:en p50 unit:330 -->

Будут найдены датчики системы и предложено включить поддержку каждого типа. Следуйте запросам для нужных датчиков. Проверка установки:

<!-- source:en p50 unit:331 -->

```text
sensors
```

<!-- source:en p50 unit:332 -->

### 6.15 Сведения о системе Debian

<!-- source:en p50 unit:333 -->

#### 6.15.1 Точный номер версии Debian

<!-- source:en p50 unit:334 -->

```text
root@linaro-alip:~# cat /etc/debian_version
11.8
```

<!-- source:en p50 unit:335 -->

#### 6.15.2 Сведения о версии Debian

<!-- source:en p50 unit:336 -->

```text
root@linaro-alip:~# cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 11 (bullseye)"
NAME="Debian GNU/Linux"
VERSION_ID="11"
VERSION="11 (bullseye)"
VERSION_CODENAME=bullseye
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
BUILD_INFO="root@pc April 27, 2022 Wednesday 11:49:33 CST"
```

<!-- source:en p51 unit:337 -->

#### 6.15.3 Аппаратные сведения системы Debian

<!-- source:en p51 unit:338 -->

```text
root@linaro-alip:~# hardinfo  -r
Computer
 Summary
 Operating System
 Kernel Modules
 Boots
 Languages
 Filesystems
 Display
 Environment Variables
 Development
 Users
 Groups
...
```

<!-- source:en p51 unit:339 -->

#### 6.15.4 Системные журналы Debian

<!-- source:en p51 unit:340 -->

```text
/info/
├── clk_summary -> /sys/kernel/debug/clk/clk_summary
├── cmdline -> /proc/cmdline
├── cpuinfo -> /proc/cpuinfo
├── device-tree -> /proc/device-tree
├── diskstats -> /proc/diskstats
├── dma_buf -> /sys/kernel/debug/dma_buf
├── dri -> /sys/kernel/debug/dri
├── fstab -> /etc/fstab
├── gpio -> /sys/kernel/debug/gpio
├── interrupts -> /proc/interrupts
├── iomem -> /proc/iomem
├── kallsyms -> /proc/kallsyms
├── log -> /var/log
├── meminfo -> /proc/meminfo
├── mountall.log -> /tmp/mountall.log
├── os-release -> /etc/os-release
├── partitions -> /proc/partitions
├── pinctrl -> /sys/kernel/debug/pinctrl/
├── rkcif-mipi-lvds -> /proc/rkcif-mipi-lvds
├── rk_dmabuf -> /proc/rk_dmabuf
├── rkisp0-vir0 -> /proc/rkisp0-vir0
├── slabinfo -> /proc/slabinfo
├── softirqs -> /proc/softirqs
├── version -> /proc/version
└── wakeup_sources -> /sys/kernel/debug/wakeup_sources

...
```

<!-- source:en p52 unit:341 -->

### 6.16 Сокращение Debian

<!-- source:en p52 unit:342 -->

С добавлением функций в каждом выпуске Debian требует больше дискового пространства. Здесь рассматривается сокращение компонентов настольной версии для Rockchip ARM. Для уменьшения образа можно удалить базовые пакеты прошивки, например:

<!-- source:en p52 unit:343 -->

```text
debian/ubuntu-build-service/bullseye-desktop-arm64/customization/package-
lists/linaro.list.chroot
```

<!-- source:en p52 unit:344 -->

Пакеты, добавленные shell-скриптом rockchip

<!-- source:en p52 unit:345 -->

```text
mk-rootfs-buster.sh
```

<!-- source:en p52 unit:346 -->

Также можно сократить следующее: в mesa-пакете libgl1-mesa-dri, каталог /usr/lib/*/dri/, оставить только kms_swrast_dri.so и swrast_dri.so, поскольку остальные не используются; в linux-firmware (если установлен), каталог /usr/lib/firmware, оставить только используемые прошивки (заказчикам обычно не нужны); в packages оставить только x11 mali для своего чипа; var/cache. При создании образа также можно изменить размер файла dd-образа в mk-image.sh, например:

<!-- source:en p52 unit:347 -->

```text
truncate -s 2500M rootfs.img
mkfs.ext4 -d binary rootfs.img
```

<!-- source:en p52 unit:348 -->

Основное использование дискового пространства:

<!-- source:en p52 unit:349 -->

```text
root@pc:/# du -sh */
120M    bin/
22M boot/
12K dev/
10M etc/
20K home/
1.6G    lib/
4.0K    media/
4.0K    mnt/
4.0K    opt/
4.0K    proc/
36M rockchip-test/
28K root/
44K run/
26M sbin/
4.0K    srv/
4.0K    sys/
18M system/
```

<!-- source:en p53 unit:350 -->

```text
4.0K    tmp/
1.3G    usr/
73M var/
8.0K    vendor/
```

<!-- source:en p53 unit:351 -->

Размер установленных пакетов также можно посмотреть следующим образом:

<!-- source:en p53 unit:352 -->

```text
dpkg-query -Wf '${Installed-size}K\t${Package}\t${Status}\n' | grep -w installed
| column -t|sort -h
```

<!-- source:en p53 unit:353 -->

### 6.17 Тестирование Debian

<!-- source:en p53 unit:354 -->

Интеграция нагрузочного скрипта Rockchip: rockchip_test объединяет функциональные, нагрузочные и производительные тесты.

<!-- source:en p53 unit:355 -->

```text
root@linaro-alip:~# /rockchip-test/rockchip_test.sh

cpu test:             1 (cpufreq stresstest)
ddr test:             2 (memtester & stressapptest)
gpu test:             3 (use glmark2)
npu test:             4 (npu2:rk3588)
auto reboot test:     5 (reboot tests)
suspend_resume test:  6 (suspend & resume)
nand power lost test: 7 (S5 stress tests)
flash stress test:    8 (flash tests)
audio test:           9 (audio tests)
recovery test:        10 (default wipe all)
bluetooth test:       11 (bluetooth on&off test)
wifi test:            12 (wifi on&off test)
ethernet test:        13 (ethernet tests)
camera test:          14 (use rkaiq_demo)
video test:           15 (use gstreamer-wayland and app_demo)
chromium test:        16 (chromium with video hardware acceleration)
hardware information:  17 (to get the hardware information)

*****************************************************
please input your test module:
```

<!-- source:en p53 unit:356 -->

### 6.18 Инструменты отладки Debian

<!-- source:en p53 unit:357 -->

#### 6.18.1 Инструменты ADB

<!-- source:en p53 unit:358 -->

##### 6.18.1.1 Обзор ADB

<!-- source:en p53 unit:359 -->

Запуск shell устройства; управление перенаправлением портов эмулятора или устройства; передача файлов между компьютером и устройством в обоих направлениях.

<!-- source:en p54 unit:360 -->

Установка локального ПО на устройства Debian. ADB — программа «клиент-сервер»: клиентом обычно является ПК, сервером — физическая или виртуальная машина устройства Debian. По способу подключения различают сетевой ADB, где хост соединяется с STB по проводной/беспроводной сети в одной LAN, и USB ADB, где используется USB-кабель.

<!-- source:en p54 unit:361 -->

##### 6.18.1.2 Использование USB ADB

<!-- source:en p54 unit:362 -->

Ограничения USB ADB: только порты USB OTG; одновременная работа нескольких клиентов не поддерживается; хост подключается только к одному устройству, не к нескольким. Для проверки подключения выполните "adb devices". Появление серийного номера устройства означает успешное подключение.

<!-- source:en p54 unit:363 -->

#### 6.18.2 Анализ загрузки через systemd-analyze

<!-- source:en p54 unit:364 -->

systemd-analyze анализирует производительность загрузки и время запуска служб. Показать время каждого этапа инициализации:

<!-- source:en p54 unit:365 -->

```text
root@linaro-alip:/# systemd-analyze time
Startup finished in 1.523s (kernel) + 3.833s (userspace) = 5.357s
graphical.target reached after 3.810s in userspace
```

<!-- source:en p54 unit:366 -->

Список времени инициализации всех units

<!-- source:en p54 unit:367 -->

```text
root@linaro-alip:/# systemd-analyze blame

1.680s rkwifibt.service
1.368s keyboard-setup.service
1.148s console-setup.service
 588ms blueman-mechanism.service
 557ms dev-mmcblk0p6.device
 495ms usbdevice.service
 319ms udisks2.service
 287ms resize-all.service
 283ms systemd-udev-trigger.service
 246ms systemd-journal-flush.service
 203ms user@0.service
 198ms user@1000.service
 196ms NetworkManager.service
 185ms nginx.service
 185ms systemd-rfkill.service
```

<!-- source:en p55 unit:368 -->

```text
184ms systemd-journald.service
...
```

<!-- source:en p55 unit:369 -->

#### 6.18.3 Инструмент настройки производительности

<!-- source:en p55 unit:370 -->

Инструмент perf; краткое описание использования:

<!-- source:en p55 unit:371 -->

```text
apt install -fy linux-perf-5.10

root@linaro-alip:/# perf

 usage: perf [--version] [--help] [OPTIONS] COMMAND [ARGS]

 The most commonly used perf commands are:
   annotate        Read perf.data (created by perf record) and display annotated
code
   archive         Create archive with object files with build-ids found in
perf.data file
   bench           General framework for benchmark suites
   buildid-cache   Manage build-id cache.
   buildid-list    List the buildids in a perf.data file
   c2c             Shared Data C2C/HITM Analyzer.
   config          Get and set variables in a configuration file.
   data            Data file related processing
   diff            Read perf.data files and display the differential profile
   evlist          List the event names in a perf.data file
   ftrace          simple wrapper for kernel's ftrace functionality
   inject          Filter to augment the events stream with additional
information
   kallsyms        Searches running kernel for symbols
   kmem            Tool to trace/measure kernel memory properties
   kvm             Tool to trace/measure kvm guest os
   list            List all symbolic event types
   lock            Analyze lock events
   mem             Profile memory accesses
   record          Run a command and record its profile into perf.data
   report          Read perf.data (created by perf record) and display the
profile
   sched           Tool to trace/measure scheduler properties (latencies)
   script          Read perf.data (created by perf record) and display trace
output
   stat            Run a command and gather performance counter statistics
   test            Runs sanity tests.
   timechart       Tool to visualize total system behavior during a workload
   top             System profiling tool.
   version         display the version of perf binary
   probe           Define new dynamic tracepoints
   trace           strace inspired tool
```

<!-- source:en p56 unit:372 -->

## 7. Обновления безопасности Debian

<!-- source:en p56 unit:373 -->

Справочник обновлений безопасности: Debian-security. Последние обновления удобно получать через APT. Чтобы система Debian получала их, добавьте следующую строку в /etc/apt/sources.list:

<!-- source:en p56 unit:374 -->

```text
deb http://security.debian.org/debian-security bookworm-security main contrib
non-free non-free-firmware
```

<!-- source:en p56 unit:375 -->

Сохраните изменения и выполните две команды для загрузки и установки обновлений безопасности:

<!-- source:en p56 unit:376 -->

```text
apt-get update && apt-get upgrade
```

<!-- source:en p56 unit:377 -->

Если обнаружена уязвимость в своём или чужом пакете, сообщите команде безопасности по адресу team@security.debian.org. Она отслеживает уязвимости, помогает сопровождающим исправлять их либо исправляет сама, выпускает уведомления и поддерживает security.debian.org. Последние уведомления: следующая страница представляет краткий архив сообщений списка debian-security-announce.

<!-- source:en p56 unit:378 -->

```text
[2023/08/07] DSA-5471-1 libhtmlcleaner-java security update
[2023/08/06] DSA-5470-1 python-werkzeug security update
[2023/08/05] DSA-5469-1 thunderbird security update
[2023/08/05] DSA-5468-1 webkit2gtk security update
[2023/08/04] DSA-5467-1 chromium security update
[2023/08/04] DSA-5466-1 ntpsec security update
[2023/08/03] DSA-5465-1 python-django security update
[2023/08/03] DSA-5464-1 firefox-esr security update
[2023/07/30] DSA-5463-1 thunderbird security update
[2023/07/30] DSA-5462-1 linux security update
[2023/07/30] DSA-5461-1 linux security update
[2023/07/26] DSA-5460-1 curl security update
[2023/07/25] DSA-5459-1 amd64-microcode security update
[2023/07/25] DSA-5458-1 openjdk-17 security update
[2023/07/22] DSA-5457-1 webkit2gtk security update
[2023/07/20] DSA-5456-1 chromium security update
[2023/07/17] DSA-5455-1 iperf3 security update
[2023/07/16] DSA-5454-1 kanboard security update
[2023/07/16] DSA-5453-1 linux security update
[2023/07/14] DSA-5452-1 gpac security update
[2023/07/09] DSA-5451-1 thunderbird security update
```

<!-- source:en p57 unit:379 -->

## 8. План развития Debian

<!-- source:en p57 unit:380 -->

Согласно источнику RK поддерживает официальные версии от stretch (9) до bookworm (12), с основным сопровождением bullseye (11).

<!-- source:en p57 unit:381 -->

| Версия | Выпуск Debian | Выпуск SDK | Окончание LTS |
| --- | --- | --- | --- |
| Stretch (9) | 2017-06-17 | 2018-06-20 | 2022-07-01 |
| Buster (10) | 2019-07-06 | 2020-12-11 | 2024-06-30 |
| Bullseye (11) | 2021-08-14 | 2022-01-15 | ~ 2026 |
| Bookworm (12) | 2023-06-10 | 2023 Q4 | ~ 2028 |

<!-- source:en p57 unit:382 -->

Версии Debian LTS обновляются каждые два года. Подробнее см. официальные сведения о выпусках Debian-Release.

<!-- source:en p57 unit:383 -->

## 9. Частые вопросы Debian

<!-- source:en p57 unit:384 -->

Раздел отвечает на частые вопросы Debian GNU/Linux на Rockchip. Дополнительные сведения — в официальном Debian FAQ.

<!-- source:en p57 unit:385 -->

### 9.1 Проблемы "noexec or nodev"

<!-- source:en p57 unit:386 -->

```text
noexec or nodev issue /usr/share/debootstrap/functions: line 1450:
..../rootfs/ubuntu-build-service/buster-desktop-arm64/chroot/test-dev-null:
Permission denied E: Cannot install into target '/rootfs/ubuntu-build-
service/buster-desktop-arm64/chroot' mounted with noexec or nodev
```

<!-- source:en p57 unit:387 -->

Решение:

<!-- source:en p57 unit:388 -->

```text
mount -o remount,exec,dev xxx
```

<!-- source:en p57 unit:389 -->

Здесь xxx — путь каталога проекта; затем повторите сборку.

<!-- source:en p57 unit:390 -->

При других ошибках сборки прежде всего проверьте тип файловой системы ext2/ext4 как возможный фактор.

<!-- source:en p57 unit:391 -->

### 9.2 Проблемы загрузки "Base Debian"

<!-- source:en p57 unit:392 -->

Для сборки Base Debian нужен доступ к зарубежным сайтам, загрузки с которых из Китая часто не удаются. Debian использует live build; зеркало можно заменить на китайское следующим образом:

<!-- source:en p58 unit:393 -->

```text
32位系统：

+++ b/ubuntu-build-service/{buster/bullseye}-desktop-armhf/configure
@@ -11,6 +11,11 @@ set -e
 echo "I: create configuration"
 export LB_BOOTSTRAP_INCLUDE="apt-transport-https gnupg"
 lb config \
+ --mirror-bootstrap "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-chroot "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-chroot-security "http://mirrors.ustc.edu.cn/debian-security" \
+ --mirror-binary "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-binary-security "http://mirrors.ustc.edu.cn/debian-security" \
  --apt-indices false \
  --apt-recommends false \
  --apt-secure false \

  64位系统：
  --- a/ubuntu-build-service/{buster/bullseye}-desktop-arm64/configure
+++ b/ubuntu-build-service/{buster/bullseye}-desktop-arm64/configure
@@ -11,6 +11,11 @@ set -e
 echo "I: create configuration"
 export LB_BOOTSTRAP_INCLUDE="apt-transport-https gnupg"
 lb config \
+ --mirror-bootstrap "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-chroot "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-chroot-security "http://mirrors.ustc.edu.cn/debian-security" \
+ --mirror-binary "http://mirrors.ustc.edu.cn/debian" \
+ --mirror-binary-security "http://mirrors.ustc.edu.cn/debian-security" \
  --apt-indices false \
```

<!-- source:en p58 unit:394 -->

```text
--apt-recommends false \
--apt-secure false \
```

<!-- source:en p58 unit:395 -->

Если другие сетевые проблемы мешают загрузить пакеты, готовые пакеты доступны на [Baidu Cloud Disk](https://eyun.baidu.com/s/3bqwrvo7). Поместите их в текущий каталог и сразу переходите к следующему шагу.

<!-- source:en p58 unit:396 -->

### 9.3 Ошибка монтирования /dev после нештатных операций

<!-- source:en p58 unit:397 -->

Например, возникает ошибка «askpass command or cannot use one».

<!-- source:en p58 unit:398 -->

Причиной могут быть частые нештатные прерывания сборки (CTRL+C). Исправить можно следующим образом:

<!-- source:en p58 unit:399 -->

```text
sudo -S umount /dev
```

<!-- source:en p58 unit:400 -->

### 9.4 Ошибка /dev после многократного монтирования

<!-- source:en p58 unit:401 -->

Например, возникает ошибка <code>sudo: unable to allocate pty: No such device</code>.

<!-- source:en p58 unit:402 -->

Причиной может быть многократное монтирование во время сборки. Исправление:

<!-- source:en p58 unit:403 -->

```text
ssh <⽤⼾名>@<IP地址> -T sudo -S umount /dev -l
```

<!-- source:en p59 unit:404 -->

### 9.5 Просмотр сведений о системе

<!-- source:en p59 unit:405 -->

#### 9.5.1 Проверка версии Debian

<!-- source:en p59 unit:406 -->

```text
root@linaro-alip:~# cat /etc/debian_version
11.1
```

<!-- source:en p59 unit:407 -->

#### 9.5.2 Как определить, используется X11 или Wayland

<!-- source:en p59 unit:408 -->

В системе X11:

<!-- source:en p59 unit:409 -->

```text
$ echo $XDG_SESSION_TYPE
x11
```

<!-- source:en p59 unit:410 -->

В системе Wayland:

<!-- source:en p59 unit:411 -->

```text
$ echo $XDG_SESSION_TYPE
wayland
```

<!-- source:en p59 unit:412 -->

#### 9.5.3 Проверка разделов системы

<!-- source:en p59 unit:413 -->

```text
root@linaro-alip:~# parted -l

Model: MMC BJTD4R (sd/mmc)
Disk /dev/mmcblk0: 31.3GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name      Flags
 1      8389kB  12.6MB  4194kB               uboot
 2      12.6MB  16.8MB  4194kB               misc
 3      16.8MB  83.9MB  67.1MB               boot
 4      83.9MB  218MB   134MB                recovery
 5      218MB   252MB   33.6MB               backup
 6      252MB   15.3GB  15.0GB  ext4         rootfs
 7      15.3GB  15.4GB  134MB   ext2         oem
 8      15.6GB  31.3GB  15.6GB  ext2         userdata
```

<!-- source:en p59 unit:414 -->

#### 9.5.4 Сбой службы SSH

<!-- source:en p59 unit:415 -->

Проблема встречается в Debian10 и более ранних версиях. Добавьте в /etc/rc.local:

<!-- source:en p60 unit:416 -->

```text
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.
# Generate the SSH keys if non-existent
if [ ! -f /etc/ssh/ssh_host_rsa_key ]
then
    # else ssh service start in dpkg-reconfigure will fail
    systemctl stop ssh.socket||true
    dpkg-reconfigure openssh-server
fi

exit 0
```

<!-- source:en p60 unit:417 -->

### 9.6 Ошибка сборки базового пакета Debian11

<!-- source:en p60 unit:418 -->

Пример возникающей ошибки:

<!-- source:en p60 unit:419 -->

```text
W: Failure trying to run:  /sbin/ldconfig
W: See //debootstrap/debootstrap.log for details
```

<!-- source:en p60 unit:420 -->

Основное требование — ядро ПК 5.10+ из-за ошибки старых QEMU. Два решения: обеспечить на ПК ядро 5.10+; проверить его версию:

<!-- source:en p60 unit:421 -->

```text
cat /proc/version
Linux version 5.13.0-39-generic
```

<!-- source:en p60 unit:422 -->

Либо обновить QEMU системы; см. QEMU.

<!-- source:en p61 unit:423 -->

### 9.7 Распаковка, изменение и повторная упаковка deb-пакетов Debian

<!-- source:en p61 unit:424 -->

Для изменения и повторной упаковки существующего deb-пакета выполните следующие шаги:

<!-- source:en p61 unit:425 -->

```text
# Extract the package files into the extract directory
dpkg -X xxx.deb extract/

# Extract the package control information into extract/DEBIAN/
dpkg -e xxx.deb extract/DEBIAN/

# Modify the file XXX

# Repackage the modified content to generate a deb package
dpkg-deb -b extract/ .
```

<!-- source:en p61 unit:426 -->

### 9.8 Добавление swap в Debian

<!-- source:en p61 unit:427 -->

При нехватке физической памяти можно добавить swap для запущенных программ. Например, создайте 2G виртуальной памяти. Создание swap-файла:

<!-- source:en p61 unit:428 -->

```text
cd /opt
mkdir swap
dd if=/dev/zero of=swapfile bs=1024 count=2000000
# count represents the size, which is 2G here.
```

<!-- source:en p61 unit:429 -->

Преобразовать файл в swap

<!-- source:en p61 unit:430 -->

```text
sudo mkswap swapfile
```

<!-- source:en p61 unit:431 -->

Активировать swap-файл

<!-- source:en p61 unit:432 -->

```text
swapon /opt/swapfile

To deactivate:
swapoff /opt/swapfile
```

<!-- source:en p61 unit:433 -->

Для автоматического подключения после загрузки добавьте в /etc/fstab, например: /opt/swapfile swap swap defaults 0 0. Проверить действие:

<!-- source:en p62 unit:434 -->

```text
root@linaro-alip:/opt# free -h
               total        used        free      shared  buff/cache   available
Memory:      1.9Gi       390Mi        91Mi        75Mi       1.5Gi       1.4Gi
Swap:       1.9Gi          0B       1.9Gi
```

<!-- source:en p62 unit:435 -->

### 9.9 Первое обновление Debian может перезапустить службу отображения

<!-- source:en p62 unit:436 -->

Универсальная Debian-система при первом выполнении /etc/init.d/rockchip.sh устанавливает зависящие от чипа пакеты, например libmali и isp, для совместимости с разными микросхемами. Затем перезапускается служба отображения. В отдельном проекте различия можно учесть при создании образа.

<!-- source:en p62 unit:437 -->

### 9.10 Проблемы вызова dri.so, связанного с libGL

<!-- source:en p62 unit:438 -->

Объяснение: EGL — расширение OpenGL для ARM и оконной системы X, функционально соответствующее glx на x86. Xorg использует modesetting, по умолчанию загружающий libglx.so. Отключение glx может мешать запуску приложений, проверяющих GLX. libglx.so ищет библиотеки реализации DRI, но 2D-ускорение Xorg здесь напрямую основано на DRM и не реализует библиотеку DRI. Поэтому при запуске libglx.so сообщает следующую ошибку.

<!-- source:en p62 unit:439 -->

```text
AIGLX error: dlopen of /usr/lib/aarch64-linux-gnu/dri/rockchip_dri.so failed
```

<!-- source:en p62 unit:440 -->

Это не влияет на работу системы и не требует обработки. По той же причине приложения при запуске могут выводить следующие ошибки, которые также не требуют обработки и не мешают работе приложения.

<!-- source:en p62 unit:441 -->

```text
libGL error: unable to load driver: rockchip_dri.so
libGL error: driver pointer missing
libGL error: failed to load driver: rockchip
```

<!-- source:en p62 unit:442 -->

### 9.11 Проверка использования аппаратного слоя указателя в Debian

<!-- source:en p62 unit:443 -->

Конфигурация DTS ядра задана. Пример журнала:

<!-- source:en p63 unit:444 -->

```text
root@linaro-alip:~# dmesg |grep cursor
[    2.062561] rockchip-vop2 fe040000.vop: [drm:vop2_bind] Cluster1-win0 as
cursor plane for vp0
[    2.062669] rockchip-vop2 fe040000.vop: [drm:vop2_bind] Cluster0-win0 as
cursor plane for vp1
```

<!-- source:en p63 unit:445 -->

Проверить через modetest, сообщается ли слой

<!-- source:en p63 unit:446 -->

```text
102     0       0       0,0             0,0     0               0x00000002
  formats: XR30 AR30 XB30 AB30 XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16 YU08 YU10
YUYV Y210
  props:
        8 type:
                flags: immutable enum
                enums: Overlay=0 Primary=1 Cursor=2
                value: 2
```

<!-- source:en p63 unit:447 -->

Проверьте в summary использование аппаратного слоя курсора: root@linaro-alip:~# cat /sys/kernel/debug/dri/0/summary &#124;grep 64 x 64. Если шаги 1/2 подтверждены, но проблема остаётся, проверьте /var/log/drm-cursor.log.

<!-- source:en p63 unit:448 -->

### 9.12 Размер журналов Debian

<!-- source:en p63 unit:449 -->

Debian предоставляет logrotate для управления многочисленными журналами. Он автоматически ротирует, сжимает и удаляет файлы, отправляет связанные с журналами письма. Запуск возможен ежедневно, еженедельно, ежемесячно или при достижении заданного размера файла. Обычно это ежедневная задача cron.

<!-- source:en p63 unit:450 -->

```text
apt install -fy logrotate cron
```

<!-- source:en p63 unit:451 -->

### 9.13 Настройка multi-user target в Debian

<!-- source:en p63 unit:452 -->

При старте systemd пытается запустить /lib/systemd/system/default.target, обычно символическую ссылку на "graphical.target" для графических систем. Состояние можно получить командой:

<!-- source:en p63 unit:453 -->

```text
systemctl get-default
graphical.target
```

<!-- source:en p63 unit:454 -->

Задать многопользовательский режим командной строки

<!-- source:en p63 unit:455 -->

```text
systemctl set-default multi-user.target
```

<!-- source:en p63 unit:456 -->

После перезагрузки экран остаётся на логотипе, войти в систему не удаётся.

<!-- source:en p64 unit:457 -->

Обычная последовательность запуска: sysinit->multi-user->graphic. При multi-user.target графический интерфейс не запускается. Нужен VT2 с включённым терминальным взаимодействием, то есть следующие два макроса ядра:

<!-- source:en p64 unit:458 -->

```text
CONFIG_FRAMEBUFFER_CONSOLE=y
CONFIG_VT=y
```

<!-- source:en p64 unit:459 -->

### 9.14 Имя пользователя и пароль Debian

<!-- source:en p64 unit:460 -->

В описанной системе имя пользователя и пароль по умолчанию — <code>linaro</code> и <code>linaro</code>. Учётная запись <code>root</code> допускает вход без пароля; переключиться на неё можно командой <code>sudo su</code>.

<!-- source:en p64 unit:461 -->

### 9.15 Ошибка двойного щелчка по значкам XFCE в Debian

<!-- source:en p64 unit:462 -->

В XFCE есть исходная ошибка, которую можно обойти в <code>Settings---&gt;Desktop---&gt;Icons</code>, включив <code>Single-click to activate items</code>.

<!-- source:en p64 unit:463 -->

### 9.16 Параметр командной строки Chromium --no-sandbox

<!-- source:en p64 unit:464 -->

Исключение — штатная официальная версия браузера без аппаратного ускорения. Специальные версии запускаются с <code>-no-sandbox</code>: песочница управляет правами доступа к файлам; её отключение позволяет обращаться к аппаратным узлам для ускорения.

<!-- source:en p64 unit:465 -->

### 9.17 Поддержка расширения DRI2 в Debian X11

<!-- source:en p64 unit:466 -->

glmark2-es2 из SDK и библиотека Mali GPU выводят изображение через dri2.

<!-- source:en p64 unit:467 -->

Реализацию см. в коде xserver: ./hw/xfree86/drivers/modesetting/dri2.c, ms_dri2_get_msc и ms_dri2_schedule_wait_msc.

<!-- source:en p64 unit:468 -->

Поддержку DRI2 в Xserver можно проверить по следующему журналу:

<!-- source:en p64 unit:469 -->

```text
root@linaro-alip:/# grep -i dri2 /var/log/Xorg.0.log
[    47.696] (II) modeset(0): [DRI2] Setup complete
[    47.699] (II) modeset(0): [DRI2]   DRI driver: rockchip
[    47.712] (II) modeset(0): [DRI2]   VDPAU driver: rockchip
[    48.502] (II) Initializing extension DRI2
```

<!-- source:en p64 unit:470 -->

Ниже приведён тест DRI2 в файле dri2-test.c.

<!-- source:en p64 unit:471 -->

```text
#include <stdlib.h>
#include <stdio.h>
```

<!-- source:en p65 unit:472 -->

```text
#include <xcb/xcb.h>
#include <xcb/dri2.h>
#include <X11/Xlib.h>
#include <X11/Xlib-xcb.h>

int main(void)
{
    xcb_connection_t *c;
    xcb_dri2_connect_cookie_t cookie;
    xcb_dri2_connect_reply_t *reply;
    Display *display = XOpenDisplay(NULL);
    Window window = DefaultRootWindow(display);
    c = XGetXCBConnection(display);
    cookie = xcb_dri2_connect(c, window, XCB_DRI2_DRIVER_TYPE_DRI);
    reply = xcb_dri2_connect_reply(c, cookie, 0);
    printf("%s[%d] device(%s)\n", __func__, __LINE__,
xcb_dri2_connect_device_name (reply));
    c = xcb_connect(NULL, NULL);
    xcb_screen_t *screen = xcb_setup_roots_iterator(xcb_get_setup(c)).data;
    cookie = xcb_dri2_connect(c, screen->root, XCB_DRI2_DRIVER_TYPE_DRI);
    reply = xcb_dri2_connect_reply(c, cookie, 0);
    printf("%s[%d] device(%s)\n", __func__, __LINE__,
xcb_dri2_connect_device_name (reply));
    return 0;
}
```

<!-- source:en p65 unit:473 -->

Сборка и проверка:

<!-- source:en p65 unit:474 -->

```text
$ gcc dri2-test.c -lxcb -lxcb-dri2 -lX11 -lX11-xcb -o dri2-test
$ ./dri2-test
main[21] device(/dev/dri/card0)
main[27] device(/dev/dri/card0)
```

<!-- source:en p65 unit:475 -->

### 9.18 Установка инструментария GCC в Debian

<!-- source:en p65 unit:476 -->

Выполните следующие команды установки:

<!-- source:en p65 unit:477 -->

```text
apt update && apt install -y build-essential manpages-dev
```

<!-- source:en p65 unit:478 -->

После установки проверьте версию GCC:

<!-- source:en p66 unit:479 -->

```text
root@linaro-alip:/# gcc -v
Using built-in specs.
COLLECT_GCC=gcc
COLLECT_LTO_WRAPPER=/usr/lib/gcc/aarch64-linux-gnu/10/lto-wrapper
Target: aarch64-linux-gnu
Configured with: ../src/configure -v --with-pkgversion='Debian 10.2.1-6' --with-
bugurl=file:///usr/share/doc/gcc-10/README.Bugs --enable-
languages=c,ada,c++,go,d,fortranx
Thread model: posix
Supported LTO compression algorithms: zlib zstd
gcc version 10.2.1 20210110 (Debian 10.2.1-6)
```

<!-- source:en p66 unit:480 -->

### 9.19 Не работает автодополнение при установке пакетов Debian

<!-- source:en p66 unit:481 -->

Это обычная операция Linux: основные дистрибутивы требуют ручной установки bash-completion. Подробности источник предлагает искать в Baidu; обычно нужны следующие действия:

<!-- source:en p66 unit:482 -->

```text
sudo apt-get install bash-completion
source /etc/bash_completion
```

<!-- source:en p66 unit:483 -->

### 9.20 Поддержка расширения DRI3 в Debian X11

<!-- source:en p66 unit:484 -->

DRI3 — расширение X11, улучшающее прямой рендеринг. В Debian оно обычно включено по умолчанию. Как низкоуровневый протокол, оно не запускается самостоятельно без внешних вызовов. Для применения изучите документацию и вызывайте нужные интерфейсы, например DRI3 из XCB (X protocol C-language Binding). Шаги установки и просмотра: установите библиотеку разработки XCB DRI3 следующей командой для libxcb-dri3:

<!-- source:en p66 unit:485 -->

```text
sudo apt-get install libxcb-dri3-dev
```

<!-- source:en p66 unit:486 -->

Будут установлены библиотеки и заголовки для использования DRI3 в приложениях. Просмотр интерфейсов DRI3:

<!-- source:en p67 unit:487 -->

Определения интерфейса и доступные функции находятся в заголовке dri3.h:

<!-- source:en p67 unit:488 -->

```text
vi /usr/include/xcb/dri3.h
```

<!-- source:en p67 unit:489 -->

Файл содержит сведения о реализации интерфейса DRI3 и помогает понять его применение. Выполнив эти шаги, можно использовать DRI3 для разработки или улучшения графических приложений Debian. При программировании обращайтесь к официальной документации XCB и DRI3 для правильного и эффективного использования.

<!-- source:en p67 unit:490 -->

### 9.21 Загрузка системы в режим командной строки

<!-- source:en p67 unit:491 -->

Общий подход: удалить xserver; включить в ядре CONFIG_FRAMEBUFFER_CONSOLE, CONFIG_DRM_FBDEV_EMULATION, CONFIG_VT, CONFIG_VT_CONSOLE.

<!-- source:en p67 unit:492 -->

### 9.22 Настройка поворота экрана

<!-- source:en p67 unit:493 -->

См. /etc/X11/xorg.conf.d/20-modesetting.conf.

<!-- source:en p67 unit:494 -->

```text
...
Section "Screen"
    Identifier  "Default Screen"
    Device      "Rockchip Graphics"
    Monitor     "Default Monitor"
    DefaultDepth        24
    SubSection "Display"
            Depth       24
            Modes       "1024x600"
    EndSubSection
EndSection

### Valid values for rotation are "normal", "left", "right"
Section "Monitor"
    Identifier  "HDMI-A-1"
    Option      "Rotate" "inverted"
    Option      "Position" "0x0"
EndSection
Section "Monitor"
    Identifier  "DSI-1"
    Option      "Rotate" "left"
    Option      "Position" "0x0"
```

<!-- source:en p68 unit:495 -->

```text
EndSection
```

<!-- source:en p68 unit:496 -->

### 9.23 Устранение чёрного экрана в Debian

<!-- source:en p68 unit:497 -->

Между запуском X и появлением приложений рабочего стола экран чёрный; время расходуется самими приложениями. Чтобы сохранить логотип на этот период, перед Xorg.wrap в /usr/bin/X добавьте:

<!-- source:en p68 unit:498 -->

```text
export XSERVER_FREEZE_DISPLAY=/.freeze_xserver
touch $XSERVER_FREEZE_DISPLAY
$(sleep 6; rm $XSERVER_FREEZE_DISPLAY)&
```

<!-- source:en p68 unit:499 -->

Изображение фиксируется на 6 секунд, затем появляется рабочий стол. Длительность можно разумно изменить под требования продукта.

<!-- source:en p68 unit:500 -->

```text
{
        export XSERVER_FREEZE_DISPLAY=/.freeze_xserver
        touch $XSERVER_FREEZE_DISPLAY
        while sleep .5; do
                pgrep panel && break # Wait for the status bar service
        done
        sleep 2 # Wait for the status bar to be drawn
        rm $XSERVER_FREEZE_DISPLAY
}&
```

<!-- source:en p68 unit:501 -->

### 9.24 Удаление указателя мыши с рабочего стола Debian

<!-- source:en p68 unit:502 -->

Штатный механизм нужен для приложений без поддержки касаний: Xserver принудительно преобразует первое касание в событие мыши. Для обхода есть три способа: прозрачная тема курсора (подробности ищите отдельно); в hw/xfree86/drivers/modesetting/drmmode_display.c удалить вызовы drmModeSetCursor и drmModeMoveCursor; если SDK содержит drm-cursor, добавить hide=1 в /etc/drm-cursor.conf.

<!-- source:en p69 unit:503 -->

### 9.25 Сборка и перенос репозитория rkaiq/rkisp в Debian

<!-- source:en p69 unit:504 -->

Как правильно перенести в Debian функции rkaiq/rkisp, отлаженные в Buildroot?

<!-- source:en p69 unit:505 -->

#### 9.25.1 Обзор шагов

<!-- source:en p69 unit:506 -->

Например, для RK3588 можно выбрать более старые GCC и GLIBC и собрать вариант для сторонней системы. Шаг 1: изменить конфигурацию Buildroot для поддержки GCC 8.

<!-- source:en p69 unit:507 -->

```text
diff --git a/configs/rockchip/chips/rk3588.config
b/configs/rockchip/chips/rk3588.config
index f806813a6e..affb5e71ad 100644
--- a/configs/rockchip/chips/rk3588.config
+++ b/configs/rockchip/chips/rk3588.config
@@ -1,4 +1,4 @@
-BR2_cortex_a76_a55=y
+BR2_cortex_a72_a53=y
 BR2_PACKAGE_RK3588=y
 BR2_ROOTFS_OVERLAY+="board/rockchip/rk3588/fs-overlay/"
 BR2_TARGET_GENERIC_HOSTNAME="rk3588"
diff --git a/package/gcc/Config.in.host b/package/gcc/Config.in.host
index 7556e1ece6..c917823f57 100644
--- a/package/gcc/Config.in.host
+++ b/package/gcc/Config.in.host
@@ -17,7 +17,6 @@ config BR2_GCC_VERSION_ARC
 config BR2_GCC_VERSION_8_X
    bool "gcc 8.x"
-   depends on !BR2_ARCH_NEEDS_GCC_AT_LEAST_9
    # ARC HS48 rel 31 only supported by gcc arc fork.
    depends on !BR2_archs4x_rel31
    select BR2_TOOLCHAIN_GCC_AT_LEAST_8
```

<!-- source:en p69 unit:508 -->

Шаг 2: настроить Buildroot на сборку с GCC 8 и GLIBC 2.28 по умолчанию.

<!-- source:en p69 unit:509 -->

```text
buildroot#cat configs/rockchip_rk3588_glibc2.28_defconfig

#include "../rockchip_rk3588_defconfig"
BR2_GCC_VERSION_8_X=y
BR2_PACKAGE_GLIBC_2_28=y
```

<!-- source:en p69 unit:510 -->

Шаг 3: собрать соответствующую конфигурацию Buildroot. Настроить среду и собрать модуль camera-engine-rkaiq.

<!-- source:en p70 unit:511 -->

```text
<SDK>#source buildroot/envsetup.sh rockchip_rk3588_glibc2.28
<SDK>## cd buildroot
buildroot# make camera-engine-rkaiq
```

<!-- source:en p70 unit:512 -->

После сборки перенесите полученные файлы, например <code>output/rockchip_rk3588_glibc2.28/build/camera-engine-rkaiq-1.0/camera-engine-rkaiq-1.0.tar</code>, в систему Debian.

<!-- source:en p70 unit:513 -->

### 9.26 Загрузка deb-пакетов для автономной установки

<!-- source:en p70 unit:514 -->

```text
root@linaro-alip:/# apt-get download <package name>
```

<!-- source:en p70 unit:515 -->

### 9.27 Проверка версии glibc в Debian

<!-- source:en p70 unit:516 -->

```text
root@linaro-alip:/# ldd --version
ldd (Debian GLIBC 2.31-13+deb11u7) 2.31

# /lib/libc.so.6
GNU C Library (GNU libc) stable release version 2.35.
```

<!-- source:en p70 unit:517 -->

### 9.28 Поддержка физически обрезанного экрана в Debian

<!-- source:en p70 unit:518 -->

Экран заказчика физически обрезан с 3840x2160 до 3840x720. Для включения экрана выходное разрешение должно оставаться 3840x2160, однако видны лишь 720 строк. В нижнюю невидимую область высотой 1440 строк указатель может перемещаться.

<!-- source:en p70 unit:519 -->

В новую версию xserver добавлена поддержка padding.

<!-- source:en p70 unit:520 -->

Способ настройки:

<!-- source:en p70 unit:521 -->

```text
+++ b/overlay/etc/X11/xorg.conf.d/20-modesetting.conf
@ -2,6 +2,9 @ Section "Device"
Identifier "Rockchip Graphics"
Driver "modesetting"

+ Option "VirtualSize" "LVDS-1:3840x720"
+ Option "Padding" "LVDS-1:0,1440,0,0"
```

<!-- source:en p71 unit:522 -->

Измените /etc/X11/xorg.conf.d/20-modesetting.conf указанным способом. VirtualSize задаёт разрешение, видимое приложению; Padding — число отсекаемых пикселей в порядке сверху, снизу, слева, справа. Если текст нечёткий, порядок Padding можно изменить на left right top bottom: Option "VirtualSize" "DSI-1:1920x316"; Option "Padding" "DSI-1:0,0,0,764". Мышь перемещается относительно и обычно не требует изменений. При неправильном масштабе или смещении попробуйте программный курсор: удалить аппаратный слой из DTS ядра либо настроить SWcursor в modesetting conf. Найдите и удалите cursor в DTS, например:

<!-- source:en p71 unit:523 -->

```text
kernel/arch/arm64/boot/dts/rockchip# ag cursor
rk3566-evb2-lp4x-v10-linux.dts
12:     cursor-win-id = <ROCKCHIP_VOP2_CLUSTER0>;
```

<!-- source:en p71 unit:524 -->

Или:

<!-- source:en p71 unit:525 -->

```text
--- a/overlay/etc/X11/xorg.conf.d/20-modesetting.conf
+++ b/overlay/etc/X11/xorg.conf.d/20-modesetting.conf
@@ -2,6 +2,8 @@ Section "Device"
     Identifier  "Rockchip Graphics"
     Driver      "modesetting"

+    Option      "SWcursor"       "TRUE"
```

<!-- source:en p71 unit:526 -->

### 9.29 Не работает блокировка экрана XFCE4 в Debian

<!-- source:en p71 unit:527 -->

Для блокировки экрана через верхний правый угол рабочего стола XFCE нужен пакет light-locker.

<!-- source:en p71 unit:528 -->

```text
sudo apt install -y light-locker
```

<!-- source:en p71 unit:529 -->

### 9.30 Проблемы сборки Debian на ПК с Ubuntu 24.04

<!-- source:en p71 unit:530 -->

Если /sbin/ldconfig не запускается, причиной может быть неверная среда QEMU. Замените исполняемый файл QEMU в device/rockchip/common/tools/x86_64/qemu-aarch64-static внутри SDK, затем перезагрузите систему. Перед заменой убедитесь, что

<!-- source:en p72 unit:531 -->

соответствующие файлы сохранены в резервной копии. По состоянию на источник версии QEMU после V8.1.1 имеют несовместимость со старым ldconfig; см. официальный отчёт #2072564.

<!-- source:en p72 unit:532 -->

## 10. Стороннее открытое ПО Debian и лицензии

<!-- source:en p72 unit:533 -->

Сведения об открытом ПО Debian см. в разделе legal официального сайта.

<!-- source:en p72 unit:534 -->

## 11. Справочные материалы Debian

<!-- source:en p72 unit:535 -->

Официальная документация: debian-docs. Официальные пакеты stable: packages.

### Ссылки исходного документа

- [https://wiki.debian.org/LTS](https://wiki.debian.org/LTS)

- [https://salsa.debian.org/live-team/live-build](https://salsa.debian.org/live-team/live-build)

- [https://live-team.pages.debian.net/live-manual/](https://live-team.pages.debian.net/live-manual/)

- [https://packages.debian.org/buster/git-core](https://packages.debian.org/buster/git-core)

- [https://salsa.debian.org/live-team/live-build.git](https://salsa.debian.org/live-team/live-build.git)

- [https://salsa.debian.org/games-team/glmark2](https://salsa.debian.org/games-team/glmark2)

- [https://openbox.org/help/Contents#rc.xml](https://openbox.org/help/Contents#rc.xml)

- [https://gitlab.freedesktop.org/pipewire/pipewire/-/issues/3463](https://gitlab.freedesktop.org/pipewire/pipewire/-/issues/3463)

- [https://salsa.debian.org/public](https://salsa.debian.org/public)

- [https://baike.baidu.com/item/%E7%AA%97%E5%8F%A3%E7%AE%A1%E7%90%86%E5%99%A8](https://baike.baidu.com/item/%E7%AA%97%E5%8F%A3%E7%AE%A1%E7%90%86%E5%99%A8)

- [https://baike.baidu.com/item/X%20Window](https://baike.baidu.com/item/X%20Window)

- [https://baike.baidu.com/item/%E6%A1%8C%E9%9D%A2%E7%8E%AF%E5%A2%83](https://baike.baidu.com/item/%E6%A1%8C%E9%9D%A2%E7%8E%AF%E5%A2%83)

- [https://baike.baidu.com/item/KDE](https://baike.baidu.com/item/KDE)

- [https://baike.baidu.com/item/OpenGL](https://baike.baidu.com/item/OpenGL)

- [https://browserbench.org/ARES-6/](https://browserbench.org/ARES-6/)

- [https://web.basemark.com/](https://web.basemark.com/)

- [https://browserbench.org/JetStream/](https://browserbench.org/JetStream/)

- [https://browserbench.org/MotionMark1.2/](https://browserbench.org/MotionMark1.2/)

- [https://chromium.github.io/octane/](https://chromium.github.io/octane/)

- [https://browserbench.org/Speedometer2.1/](https://browserbench.org/Speedometer2.1/)

- [https://wiki.debian.org/PanfrostLima](https://wiki.debian.org/PanfrostLima)

- [https://wiki.debian.org/PulseAudio/](https://wiki.debian.org/PulseAudio/)

- [https://www.debian.org/security/](https://www.debian.org/security/)

- [https://wiki.debian.org/DebianReleases](https://wiki.debian.org/DebianReleases)

- [https://www.debian.org/doc/manuals/debian-faq/index.en.html](https://www.debian.org/doc/manuals/debian-faq/index.en.html)

- [https://launchpad.net/~canonical-server/+archive/ubuntu/server-backports](https://launchpad.net/~canonical-server/+archive/ubuntu/server-backports)

- [https://bugs.launchpad.net/ubuntu/+source/qemu/+bug/2072564](https://bugs.launchpad.net/ubuntu/+source/qemu/+bug/2072564)

- [https://www.debian.org/legal/](https://www.debian.org/legal/)

- [https://www.debian.org/doc/devel-manuals#debmake-doc](https://www.debian.org/doc/devel-manuals#debmake-doc)

- [https://packages.debian.org/stable/allpackages](https://packages.debian.org/stable/allpackages)

{% endraw %}
