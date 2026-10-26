---
title: "Rockchip Linux USB Gadget: настройка, аудио, сеть, хранение и составные устройства"
description: "Rockchip Linux USB Gadget: настройка, аудио, сеть, хранение и составные устройства — V1.0.0"
excerpt: "Rockchip Linux USB Gadget: настройка, аудио, сеть, хранение и составные устройства"
translation_key: "176-rockchip-linux-usb-gadget"
slug: "176-rockchip-linux-usb-gadget"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, Gadget, Linux]
---

{% raw %}

# Rockchip Linux USB Gadget: настройка, аудио, сеть, хранение и составные устройства

Справочник ArmSoM по CN/EN V1.0.0, RK-JC-YF-316, о базовом USB Gadget. Исходная платформа Linux, ядро v4.4. Проверяйте SoC, BSP, ядро, OTG и rkscript конкретной платы; поддержка всех плат не подразумевается. ZH использует китайские рисунки, EN/RU/DE английские, по восемь. Примеры из источника, без аппаратной проверки.

Риски/сомнения: перезапуск USB прерывает ADB/сеть, UMS требует эксклюзивного доступа к блоку. Команды переключения/монтирования не выполнялись. Текст иногда пишет S50usbdevce вместо S50usbdevice в командах. Последний раздел говорит ADB+RNDIS, но включает MTP+ADB; команды сохранены, не считать готовым примером RNDIS. Windows/UAC описан на момент источника, не как гарантия текущей совместимости.

Смысл комментариев: S50usbdevice в /etc/init.d/ использует соседний .usb_config; usbdevice в /usr/bin/, правила в /lib/udev/rules.d/, /tmp/.usb_config создаётся автоматически. ALSA: -D "hw:${card},${device}", пример hw:2,0; plughw пересэмплирует к заданной частоте. RNDIS задаёт 169.254.216.1. UMS допускает /userdata/ums_shared.img вместо раздела, пример создаёт FAT/8M с автомонтированием. ACM отправляет echo test с ПК, Device принимает cat; UVC по умолчанию 640x480.

[ArmSoM Docs](https://docs.armsom.org/) · [Linux Gadget](https://www.kernel.org/doc/htmldocs/gadget/intro.html)

## 1. Linux-USB Gadget API Framework

USB Gadget работает на USB Peripheral и настраивает USB-функции. Перечисляемое устройство обычно имеет минимум три уровня логики ядра, иногда дополнительный код в пользовательском пространстве. Gadget API — промежуточный уровень между функцией и оборудованием. Снизу вверх:

- USB Controller непосредственно взаимодействует с оборудованием, представляет endpoints для входящих/исходящих потоков и предоставляет их Gadget.
- USB Gadget оборачивает Controller, реализуя аппаратно-независимые функции: например class-specific протоколы на ep0, запуск функций и управление IN/OUT endpoints.
- Upper Level связывает большинство Gadget-драйверов с конкретным драйвером или подсистемой Linux для работы USB.
- Additional Layers могут включать сетевой стек ядра или пользовательское приложение со стандартными POSIX API `open()`, `close()`, `read()`, `write()`.

![Рисунок источника — PDF p5](/docs/rockchip-linux-usb-gadget/assets/en-p005-figure-01.png)

Источник: https://www.kernel.org/doc/htmldocs/gadget/intro.html

### 1.1 Конфигурация ядра

Путь настройки USB Gadget в menuconfig:

```text
Location:
  -> Device Drivers
    -> USB support
      -> USB Gadget Support
        -> USB Gadget Drivers
```

RK Linux предоставляет скрипты автоматической настройки следующих функций:

```text
CONFIG_USB_CONFIGFS_ACM
CONFIG_USB_CONFIGFS_RNDIS
CONFIG_USB_CONFIGFS_MASS_STORAGE
CONFIG_USB_CONFIGFS_F_FS
CONFIG_USB_CONFIGFS_F_MTP
CONFIG_USB_CONFIGFS_F_UAC1
CONFIG_USB_CONFIGFS_F_UAC2
CONFIG_USB_CONFIGFS_F_UVC
```

### 1.2 USB configfs

configfs — файловая система в памяти, сходная с sysfs, но с иным управлением временем жизни. Узлы sysfs создаёт и регистрирует ядро; пользователь читает атрибуты через readdir/read и изменяет через write. Создание/удаление и время жизни полностью контролирует ядро; sysfs лишь окно доступа. В configfs пользователь создаёт узлы mkdir и удаляет rmdir. После mkdir появляются атрибуты, доступные read/write. Как в sysfs, readdir перечисляет содержимое, symlink помогает управлять связями. Но время жизни определяет пользователь, а поддерживающий модуль ядра должен реагировать на его операции.

## 2. Использование USB Gadget

### 2.1 Управление USB

В RKScript имеются три файла USB:

```text
S50usbdevice # /etc/init.d/ 使⽤时，配合同级⽬录的.usb_config使⽤
usbdevice # /usr/bin/
61-usbdevice.rules # /lib/udev/rules.d/
#还有两个相关⽂件需要⽤⼾⾃建或修改
.usb_config # /etc/init.d/
/tmp/.usb_config # S50usbdevice ⾃动⽣成
```

![Рисунок источника — PDF p7](/docs/rockchip-linux-usb-gadget/assets/en-p007-figure-01.png)

Можно изменять .usb_config и запускать S50usbdevce для выбора USB-функций. При успешной настройке следующий журнал означает USB Ready:

```text
[   66.178517] android_work: sent uevent USB_STATE=CONNECTED
[   66.179977] configfs-gadget gadget: high-speed config #1: b
[   66.180663] android_work: sent uevent USB_STATE=CONFIGURED
```

### 2.2 Настройка функций

Конфигурация находится в `/etc/init.d/.usb_config`. Для изменения во время работы редактируйте `/tmp/.usb_config` и выполните `/etc/init.d/S50usbdevice restart`. Автонастройка Gadget поддерживает следующие параметры .usb_config:

```text
usb_adb_en
usb_uac1_en
usb_uac2_en
usb_rndis_en
usb_mtp_en
usb_ums_en
usb_acm_en
usb_uvc_en
```

Разница файлов: `/etc/init.d/.usb_config` — загрузочная конфигурация. Система может быть только для чтения, поэтому файл может быть неизменяемым; без особой причины во время работы его не редактируют.

`/tmp/.usb_config` — копия `/etc/init.d/.usb_config`, создаваемая S50usbdevice при загрузке. /tmp находится в RAM и допускает изменения. Для временного переключения измените этот файл и сбросьте USB-функции через `/etc/init.d/S50usbdevice restart`.

#### 2.2.1 ADB (Android Debug Bridge)

ADB — многофункциональный командный отладчик для передачи файлов, входа Unix Shell и других задач. Для запуска нужен adbd; включите сборку adbd в Buildroot.

```text
BR2_PACKAGE_ANDROID_TOOLS_ADBD
```

Убедившись, что adbd установлен, выполните команды и подключите USB к ПК:

```text
echo usb_adb_en > /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

Устройство появится в `adb devices` на ПК. Если Linux его не показывает, выполните:

```text
adb kill-server
sudo adb devices
```

Windows требует ADB-драйвер; при необходимости запускайте ADB с правами администратора.

#### 2.2.2 UAC (USB Audio Class)

UAC предоставляет Host стандартный виртуальный PCM-интерфейс USB для передачи аудио между Host и Device. Есть UAC1/UAC2. UAC2 имеет большую пропускную способность, зависящую от реализации платформы и фактического теста. Windows7 и некоторые Windows10 по источнику требуют отдельный драйвер UAC2, но поддерживают UAC1. Команды включения:

```text
echo usb_uac1_en > /tmp/.usb_config # or usb_uac2_en
/etc/init.d/S50usbdevice restart
```

Для теста используется ALSA. `aplay -l` или `arecord -l` перечисляет карты воспроизведения/захвата:

```text
# aplay -l
card 2: rk3xxx [rk3xxx], device 0: USB Audio [USB Audio]
  Subdevices: 1/1
  Subdevice #0: subdevice #0

# 指定设备设⽤ -D "hw:${card},${device}" (上述信息即可写为 -D "hw:2,0")
```

Замкните аудиопоток в петлю для одновременной проверки Playback и Capture:

![Рисунок источника — PDF p9](/docs/rockchip-linux-usb-gadget/assets/en-p009-figure-01.png)

(1) ПК воспроизводит аудиофайл на Device. Linux:

```text
aplay -D "plughw:2,0" -f S16_LE -r 48000 -c 2 /userdata/test.wav
# plughw 如果⾳频采样率和设置的不符，alsa将对⾳频进⾏重采样，保证输出⾳频采样率和设置的⼀致
```

Windows: правой кнопкой значок звука внизу справа → Open Sound Settings → выберите Device как выход (обычно Source/Sink, имя зависит от Windows), откройте проигрыватель и музыку.

![Рисунок источника — PDF p9](/docs/rockchip-linux-usb-gadget/assets/en-p009-figure-02.png)

(2) Device перенаправляет UAC Playback в Capture.

```text
arecord -D "hw:3,0" -f S16_LE -r 48000 -c 2 -t raw -N |  aplay -D "hw:3,0" -f S16_LE -r 48000 -c 2 -t raw -N
```

(3) ПК перенаправляет UAC Capture на обычный динамик. Linux:

```text
arecord -D "hw:2,0" -f S16_LE -r 44100 -c 2 -t raw -N | aplay -D "hw:1,0" -f S16_LE -r 44100 -c 2 -t raw -N
```

Windows: правой кнопкой значок звука → Open Sound Settings → входное устройство Device (обычно Source/Sink, имя зависит от Windows).

![Рисунок источника — PDF p10](/docs/rockchip-linux-usb-gadget/assets/en-p010-figure-01.png)

Откройте Device properties → Additional device properties, включите Listen to this device, укажите исходное устройство воспроизведения ПК в Playthrough this device.

![Рисунок источника — PDF p10](/docs/rockchip-linux-usb-gadget/assets/en-p010-figure-02.png)

Теперь тестовый звук слышен через динамик ПК.

#### 2.2.3 RNDIS (Remote Network Driver Interface Specification)

RNDIS предоставляет сетевой интерфейс USB; сетевые команды, например SSH, обмениваются данными Host/Device. Включение:

```text
echo usb_rndis_en > /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

`ifconfig` покажет дополнительный сетевой адаптер на Host и Device:

```text
# Host Linux
ifconfig
enp0s20u3u4u4 Link encap:Ethernet  HWaddr d6:11:03:17:c3:97
          inet6 addr: fe80::3fa6:da84:77bd:122a/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:61 errors:0 dropped:0 overruns:0 frame:0
          TX packets:187 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:7198 (7.1 KB)  TX bytes:41844 (41.8 KB)
# Device
ifconfig
usb0      Link encap:Ethernet  HWaddr 46:26:71:47:E3:9F
          inet addr:169.254.216.27  Bcast:169.254.255.255  Mask:255.255.0.0
          inet6 addr: fe80::9e72:7f20:cc68:4a34/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:606 errors:606 dropped:0 overruns:0 frame:606
          TX packets:125 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:100024 (97.6 KiB)  TX bytes:30346 (29.6 KiB)
```

На Host IPv4 не назначен; задайте вручную через ifconfig:

```text
#固定RNDIS地址为169.254.216.1
ifconfig enp0s20u3u4u4 down
ifconfig enp0s20u3u4u4 169.254.216.1
ifconfig enp0s20u3u4u4 up
```

После этого ping работает в обе стороны. В Windows после распознавания IPv4 назначается автоматически, ручное назначение не нужно.

#### 2.2.4 MTP (Media Transfer Protocol)

MTP — протокол Microsoft для обмена медиафайлами между Host и Device. Нужен mtp-server; включите его сборку в Buildroot.

```text
BR2_PACKAGE_MTP
```

Убедившись в наличии mtp-server, выполните команды и подключите OTG-кабель к ПК:

```text
echo usb_mtp_en > /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

Linux/Windows покажет устройство "---MODEL---". Имя MTP меняется патчем в buildroot/package/rockchip/mtp. По умолчанию открыт каталог /userdata.

#### 2.2.5 UMS (USB Mass Storage)

UMS предоставляет Host внешнее массовое хранилище. UMS работает блоками, MTP файлами. Целевой блок UMS используется исключительно: одновременный доступ нескольких пользователей вызывает ошибки; MTP поддерживает нескольких пользователей. Включение UMS:

```text
echo usb_ums_en > /tmp/.usb_config
echo "ums_block=/dev/block/by-name/userdata" >> /tmp/.usb_config # 可⽤镜像⽂件替换具体分区，例如/userdata/ums_shared.img
/etc/init.d/S50usbdevice restart
```

На ПК появится новый USB-накопитель. Для эксклюзивности S50usbdevice предлагает атрибут: при подключении ПК блок отмонтируется на Device, предотвращая ошибочные обращения; после отключения монтируется обратно в /mnt/ums. Добавьте в .usb_config:

```text
echo "ums_block_auto_mount=on" >> /tmp/.usb_config
```

Вместо логического раздела можно использовать image-файл, созданный самостоятельно или автоматически скриптом S50usbdevice:

```text
# ⾃动⽣成⼀个 fat 格式， 8M ⼤⼩的image⽂件，并开启UMS⾃动挂载
echo usb_ums_en > /tmp/.usb_config
echo "ums_block=/userdata/ums_shared.img" >> /tmp/.usb_config
echo "ums_block_size=8" >> /tmp/.usb_config #Unit M
echo "ums_block_type=fat" >> /tmp/.usb_config
echo "ums_block_auto_mount=on" >> /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

В Buildroot это настраивается через Target packages → Rockchip BSP packages → rockchip usb mass storage. Затем пересоберите rkscript: /etc/init.d/.usb_config создаётся автоматически.

![Рисунок источника — PDF p12](/docs/rockchip-linux-usb-gadget/assets/en-p012-figure-01.png)

#### 2.2.6 ACM (CDC - ACM: Communication Device Class - Abstract Control Model)

ACM — виртуальный последовательный порт USB, создающий TTY на Device/Host. Включение:

```text
echo usb_acm_en > /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

После включения Device имеет /dev/ttyGS0, ПК — /dev/ttyACM0.

```text
#PC上运⾏
echo test > /dev/ttyACM0
#Device上运⾏
cat /dev/ttyGS0 #得到 test 输出
```

#### 2.2.7 UVC (USB Video Class)

UVC требует пользовательское приложение. Buildroot предоставляет демонстрацию uvc_app; включите соответствующую опцию сборки.

```text
BR2_PACKAGE_UVC_APP
```

Вручную измените S50usbdevice, добавив:

```text
-       # Add uvc app here with start-stop-daemon
+       if [ $UVC_EN = on ];then
+               start-stop-daemon --start --quiet --background --exec
/usr/bin/uvc_app -- 640 480
+       fi
```

Включите UVC следующими командами:

```text
echo usb_uvc_en > /tmp/.usb_config #默认输出640x480格式图像
/etc/init.d/S50usbdevice restart
```

Средство просмотра Host: Linux — guvcview, Windows — Amcap; выберите Device → UVC Camera / Options → Preview.

![Рисунок источника — PDF p13](/docs/rockchip-linux-usb-gadget/assets/en-p014-figure-01.png)

Внизу слева показана частота кадров. uvc_app — только демонстрация, не готовое приложение: показывает четыре одноцветные полосы, его можно адаптировать. UVC обязательно требует приложение; без него включение нарушает USB. В системе только для чтения измените S50usbdevice до упаковки образа. Горячее отключение UVC поддерживается плохо: после unbind Gadget перестаёт работать из-за механизма регистрации V4L2-узла.

### 2.3 Составные USB-устройства

При достаточных портах и полосе пропускания несколько Gadget-функций объединяются на одном USB-порту. Пример ADB + RNDIS:

```text
echo usb_mtp_en > /tmp/.usb_config
echo usb_adb_en >> /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

{% endraw %}
