---
title: "Rockchip Linux USB Host UVC: диагностика, драйверы, полоса и задержка"
description: "Rockchip Linux USB Host UVC: диагностика, драйверы, полоса и задержка — V1.0.0"
excerpt: "Rockchip Linux USB Host UVC: диагностика, драйверы, полоса и задержка"
translation_key: "171-rockchip-linux-usb-host-uvc"
slug: "171-rockchip-linux-usb-host-uvc"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, UVC, Linux]
---

{% raw %}

Полный технический текст китайского RK-PC-YF-493 V1.0.0. Область исходной таблицы — все чипы Rockchip, кроме MCU, Linux4.19 и новее; конкретные методы в основном относятся к Linux5.10. Это не подтверждение поддержки всех ядер или плат ArmSoM. Проверяйте плату, SoC, SDK/BSP, Host-контроллер, V4L2/libusb и камеру. Команды на аппаратуре и испытания ArmSoM не выполнялись. Английского PDF нет; полный перевод использует пять китайских оригинальных рисунков.

> Неясности и риски: H256 сохранено как возможная опечатка названия кодека. Доля периодических передач 95% и выше отступает от указанного в исходнике ограничения USB2.0 80%, может нарушить работу непериодических устройств и не подходит xHCI; это не универсальное решение без проверки. Фиксированная высокая частота CPU/DDR и отключение IDLE/autosuspend увеличивают потребление и нагрев; bind/unbind прерывает USB-службы. Сначала создайте резервную копию и проверьте SDK, восстановление и номиналы компонентов.

> Исходный uvc-data.py обращается к line[0]/line[1], предполагая формат анализатора, без проверки пустых/коротких строк и шестнадцатеричного синтаксиса. Состояние eof между строками и сохранение последнего кадра требуют проверки на реальных данных. Алгоритм сохранён; извлечение не выполнялось и не проверялось.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Обмен UVC

На рис. 1 показан обмен UVC в Linux. Слева — модули UVC USB Device и соответствующие пути ядра, справа — USB Host. Руководство посвящено диагностике драйвера UVC на Host; методы в основном относятся к Linux-5.10 Rockchip, не обязательно применимы к другим ядрам и не предназначены для диагностики приложения UVC. На стороне Host приложение может обращаться к UVC-драйверу через V4L2 либо через libusb к универсальному USB-драйверу Devio. Rockchip поддерживает оба варианта; выбор определяется приложением.

![Рисунок из китайского оригинала](/docs/rockchip-linux-usb-host-uvc/assets/cn-p004-figure-01.png)

Рис. 1. Обмен UVC в Linux

## 2. Средства отладки UVC

### 2.1 Анализатор протокола USB

USB-анализатор протокола в реальном времени перехватывает обмен на USB для захвата пакетов и анализа протокола. На рис. 2 показано типичное подключение USB 2.0: анализатор включается последовательно между Device и Host, а на ПК устанавливается соответствующая программа. Это наиболее прямой и эффективный способ определить, находится ли причина на стороне Device или Host.

![Рисунок из китайского оригинала](/docs/rockchip-linux-usb-host-uvc/assets/cn-p005-figure-01.png)

Рис. 2. Подключение USB-анализатора. Он подходит для анализа следующих типичных проблем UVC:

1. Не удаётся открыть предпросмотр UVC.

2. Задержка предпросмотра UVC.

3. Зависание предпросмотра UVC.

4. Статистика частоты кадров и разбор данных изображения.

5. Ошибка загрузки драйвера UVC. Анализатор не подходит для следующих проблем:

1. Качество сигнала USB.

2. Неожиданное отключение UVC.

3. Ошибки EMI USB-контроллера во время обмена UVC. Для анализа сигналов, отключений и EMI используйте широкополосный осциллограф: измеряйте глазковую диаграмму USB, high-speed handshake и провалы VBUS.

### 2.2 Захват и анализ usbmon

usbmon (USB monitor) — средство ядра Linux для захвата обмена между USB core и драйвером класса, например UVC, а также между USB core и драйвером Host-контроллера. Пакеты usbmon анализируют в vusb-analyzer или Wireshark, чтобы увидеть обработку UVC в ядре и локализовать проблемы UVC/USB-контроллера. Модуль находится в drivers/usb/mon/. Включение usbmon:

1. Включите CONFIG_USB_MON в ядре.

2. Смонтируйте debugfs: mount -t debugfs none_debugs /sys/kernel/debug. Сообщение busy означает, что debugfs уже смонтирован. В большинстве выпусков Rockchip SDK usbmon включён по умолчанию; проверьте: ls /sys/kernel/debug/usb/usbmon/. Анализатор vusb-analyzer: https://vusb-analyzer.sourceforge.net/download.html. Установка Ubuntu: sudo apt-get install vusb-analyzer. Далее пример UVC на USB2 HOST0 RK3588 EVB1.

1. Просмотрите номера USB-шин, доступных usbmon. Числа 1/2/3 и т. д. обозначают шины платформы; каждое USB-устройство принадлежит одной шине. 0 означает захват всех шин. Суффиксы s/t/u задают формат сохранения; обычно используют u.

```text
console:/sys/kernel/debug/usb/usbmon # ls
0s  1s  1u  2t  3s  3u  4t  5s  5u  6t
0u  1t  2s  2u  3t  4s  4u  5t  6s  6u
```

2. Найдите шину наблюдаемого устройства командой lsusb, различая устройства по vendor ID и product ID.

```text
console:/sys/kernel/debug/usb/usbmon # lsusb
Bus 005 Device 001: ID 1d6b:0002
Bus 003 Device 001: ID 1d6b:0001
Bus 002 Device 005: ID 046d:0823
Bus 001 Device 001: ID 1d6b:0002
Bus 006 Device 001: ID 1d6b:0003
Bus 004 Device 001: ID 1d6b:0001
Bus 002 Device 001: ID 1d6b:0002
```

Bus 002 означает шину 2. ID 046d:0823 — vendor ID и product ID нужного устройства; оно подключено к шине 2.

3. Захватите обмен usbmon: cat /sys/kernel/debug/usb/usbmon/2u &gt; /data/usbmon.mon

4. Проанализируйте пакеты: vusb-analyzer usbmon.mon

### 2.3 v4l2-ctl

v4l2-ctl управляет video-устройствами Linux V4L2 (/dev/video*): читает поддерживаемые форматы, захватывает изображение с заданными разрешением и форматом и выполняет другие операции. Драйвер UVC Linux основан на V4L2. Если подозревается приложение UVC, используйте v4l2-ctl для исключения его влияния.

1. v4l2-ctl --list-devices — перечислить все устройства, включая все video-устройства, зарегистрированные через V4L2.

Пример:

```text
console:/ # v4l2-ctl --list-devices
UVC Camera (046d:0823) (usb-fc800000.usb-1):
        /dev/video21
        /dev/video22
```

Одной USB-камере соответствуют два устройства: захват изображения/видео и захват метаданных.

2. v4l2-ctl --list-formats-ext --device path/to/video_device — перечислить форматы предпросмотра указанного устройства. Пример:

```text
console:/ # v4l2-ctl --list-formats-ext --device /dev/video21
ioctl: VIDIOC_ENUM_FMT
        Index       : 0
        Type        : Video Capture
        Pixel Format: 'YUYV'
        Name        : YUYV 4:2:2
                Size: Discrete 640x480
                        Interval: Discrete 0.033s (30.000 fps)
                        Interval: Discrete 0.042s (24.000 fps)
                        Interval: Discrete 0.050s (20.000 fps)
                        Interval: Discrete 0.067s (15.000 fps)
                        Interval: Discrete 0.100s (10.000 fps)
                        Interval: Discrete 0.133s (7.500 fps)
                        Interval: Discrete 0.200s (5.000 fps)
         ......
```

3. v4l2-ctl --all --device path/to/video_device — получить все сведения об указанном устройстве. Пример:

```text
console:/ # v4l2-ctl --all --device /dev/video21
Driver Info:
        Driver name      : uvcvideo
        Card type        : UVC Camera (046d:0823)
        Bus info         : usb-fc800000.usb-1
        Driver version   : 5.10.198
        Capabilities     : 0x84a00001
                Video Capture
                Metadata Capture
                Streaming
                Extended Pix Format
                Device Capabilities
        Device Caps      : 0x04200001
                Video Capture
                Streaming
                Extended Pix Format
        ......
```

4. v4l2-ctl --device path/to/video_device --set-fmt-video=width=width,height=height,pixelformat=MJPG --stream-mmap --stream-to=path/to/output.jpg --stream-count=1 — захватить изображение с выбранными разрешением и форматом. Пример: один кадр MJPG 1920x1080 с video21 сохранить в /sdcard/DCIM/.

```text
v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap --stream-to=/sdcard/DCIM/output_1920.jpg --stream-count=1
```

5. v4l2-ctl --device path/to/video_device --set-fmt-video=width=width,height=height,pixelformat=format --stream-mmap --stream-to=path/to/output --stream-count=number_of_frames_to_capture — захватить поток с выбранным разрешением. Пример 1: 100 кадров MJPG 1920x1080 с video21 сохранить в /sdcard/DCIM/.

```text
v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap --stream-to=/sdcard/DCIM/output.mjpg --stream-count=100
```

Пример 2: непрерывно получать поток MJPG 1920x1080 с video21.

```text
v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap
```

## 3. Интерфейсы отладки UVC ядра

### 3.1 Отладка драйвера UVC

Драйвер UVC находится в drivers/media/usb/uvc. Его интерфейс system module позволяет динамически включать trace, по умолчанию отключённый: /sys/module/uvcvideo/parameters/trace. Включение: echo 0xffff &gt; /sys/module/uvcvideo/parameters/trace. Уровень сообщений KERN_DEBUG; просматривайте их через dmesg. Для вывода на последовательный терминал измените уровень printk: echo 8 &gt; /proc/sys/kernel/printk.

Динамическое отключение: echo 0 &gt; /sys/module/uvcvideo/parameters/trace. Ниже пример trace при открытии предпросмотра UVC на USB2 HOST0 RK3588:

```text
[   60.780597][  T477] uvcvideo: uvc_v4l2_open
[   60.843298][  T477] uvcvideo: Resuming interface 2
[   60.843318][  T477] uvcvideo: Resuming interface 3
[   60.852317][  T477] uvcvideo: uvc_v4l2_release
[   60.855127][  T477] uvcvideo: uvc_v4l2_open
[   60.877415][  T477] uvcvideo: Trying format 0x47504a4d (MJPG): 2592x1944.
[   60.877525][  T477] uvcvideo: Using default frame interval 100000.0 us (10.0
fps).
[   60.910575][  T477] uvcvideo: Device requested 3060 B/frame bandwidth.
[   60.910622][  T477] uvcvideo: Selecting alternate setting 11 (3060 B/frame
bandwidth).
[   60.913504][  T477] uvcvideo: Allocated 5 URB buffers of 32x3060 bytes each.
[   60.913836][  T477] uvcvideo: uvc_v4l2_poll
[   62.010310][    C0] uvcvideo: Frame complete (EOF found).
[   62.010438][    C0] uvcvideo: frame 1 stats: 1111/763/1876 packets,
1/1111/1876 pts (early initial), 1875/1876 scr, last pts/stc/sof
223854994/228661160/514
```

### 3.2 Отладка V4L2

Драйвер UVC Linux использует V4L2 для queue buf и dequeue buf между ядром и приложением. V4L2 предоставляет tracepoint [1] инфраструктуры трассировки ядра для отслеживания queue buf, dequeue buf и buf done. В ядре нужны следующие настройки Trace:

```text
Kernel hacking  --->
    [*] Tracers  --->
        [*]   Trace process context switches and events
        [*]   Enable uprobes-based dynamic events
        [*]   Trace gpio events：
```

V4L2 поддерживает следующие trace events:

```text
/sys/kernel/debug/tracing/events/vb2# ls
enable  filter  vb2_buf_done  vb2_buf_queue  vb2_dqbuf  vb2_qbuf
/sys/kernel/debug/tracing/events/v4l2]# ls
enable  v4l2_dqbuf  vb2_v4l2_buf_done   vb2_v4l2_dqbuf
filter  v4l2_qbuf   vb2_v4l2_buf_queue  vb2_v4l2_qbuf
```

Подробности использования: /sys/kernel/debug/tracing/README.

### 3.3 Динамическая переинициализация USB-контроллера

/sys/bus/platform/drivers/[usb_controller_name]/bind, unbind. Замените [usb_controller_name] именем USB-контроллера конкретного чипа. Если передача UVC нарушена и автоматически не восстанавливается, вручную переинициализируйте контроллер для проверки его связи с проблемой. Пример RK3588 EVB1:

```text
/* USB2 HOST0/1 OHCI 控制器驱动 */
console:/sys/bus/platform/drivers/ohci-platform # ls
bind  fc840000.usb  fc8c0000.usb  uevent  unbind

/* USB2 HOST0/1 EHCI 控制器驱动 */
console:/sys/bus/platform/drivers/ehci-platform # ls
bind  fc800000.usb  fc880000.usb  uevent  unbind

/* USB3 OTG1_HOST 控制器驱动 */
console:/sys/bus/platform/drivers/xhci-hcd # ls
bind  uevent  unbind  xhci-hcd.8.auto

/* USB3 OTG0/1 控制器驱动 */
console:/sys/bus/platform/drivers/dwc3 # ls
bind  fc000000.usb  fc400000.usb  uevent  unbind

执⾏如下命令，可以重新初始化 USB2 HOST0 接⼝对应的 OHCI/EHCI 控制器
echo fc840000.usb > /sys/bus/platform/drivers/ohci-platform/unbind
echo fc800000.usb > /sys/bus/platform/drivers/ehci-platform/unbind
echo fc800000.usb > /sys/bus/platform/drivers/ehci-platform/bind
echo fc840000.usb > /sys/bus/platform/drivers/ohci-platform/bind
```

## 4. Методы отладки UVC

### 4.1 Привязка USB-прерываний к CPU

Назначение: анализ и устранение искажений предпросмотра и нестабильной частоты кадров при высокой нагрузке из-за медленной обработки USB-прерываний. Linux предоставляет /proc/irq/[irq_num]/smp_affinity_list для привязки прерывания к CPU; файл содержит десятичный список CPU. Нумерация начинается с 0: CPU0, CPU1 и т. д. Пример привязки USB OTG0 RK3588 EVB1 к CPU1:

```text
console:/ # cat /proc/interrupts | grep dwc
153:         77          0          0          0          0          0          0
         0     GICv3 252 Level     dwc3
console:/ # echo 1 > /proc/irq/153/smp_affinity_list
```

### 4.2 Отключение UVC autosuspend

Назначение: диагностика совместимости autosuspend некоторых UVC-устройств с Rockchip. Следующей командой можно динамически отключить USB autosuspend для первоначальной локализации.

```text
for i in $(find /sys -name control | grep usb);
do echo on > $i;
echo "echo on > $i";
done;
```

Если отключение autosuspend устраняет проблему конкретного устройства, это указывает на его несовместимость autosuspend с платформой Rockchip. Добавьте устройство в чёрный список autosuspend USB-драйвера. Пример Linux-5.10 для VID,PID=0x05a3,0x9230:

```text
diff --git a/drivers/usb/core/quirks.c b/drivers/usb/core/quirks.c
index 76ac5d6555ae..d799e93b9a0d 100644
--- a/drivers/usb/core/quirks.c
+++ b/drivers/usb/core/quirks.c
@@ -322,6 +322,9 @@ static const struct usb_device_id usb_quirk_list[] = {
        /* Alcor Micro Corp. Hub */
        { USB_DEVICE(0x058f, 0x9254), .driver_info = USB_QUIRK_RESET_RESUME },

+       /* HD Camera Manufacturer */
+       { USB_DEVICE(0x05a3, 0x9230), .driver_info = USB_QUIRK_AUTO_SUSPEND },
```

Таблица 1 содержит известные UVC-устройства с проблемами autosuspend. Таблица 1. USB Camera auto suspend blacklist.

| VID | PID | Производитель |
| --- | --- | --- |
| 0x05a3 | 0x9230 | Microdia |
| 0x05a3 | 0x9320 | Microdia |
| 0x0c45 | 0x6321 | Sonix |
| 0x0c45 | 0x636a | Sonix |
| 0x0c45 | 0x636b | Sonix |
| 0x0c45 | 0x64ab | Sonix |
| 0x0c45 | 0x64ac | Sonix |
| 0x0e8d | 0x7668 | unknown |
| 0x2bc5 | 0x051f | MediaTek |
| 0x1e10 | 0x4000 | Point Grey Research |
| 0x15aa | 0x1555 | Gearway Electronics |

### 4.3 Отключение CPU IDLE

Назначение: выявить искажения и нестабильную частоту кадров из-за долгого выхода CPU из IDLE, замедляющего обработку USB-прерываний. Пример RK3588 EVB1:

```text
cpunum=$(cat /proc/cpuinfo | grep processor | wc -l)
for i in `seq 0 $(($cpunum-1))`
do
echo 1 > /sys/devices/system/cpu/cpu$i/cpuidle/state0/disable
echo 1 > /sys/devices/system/cpu/cpu$i/cpuidle/state1/disable
done
```

Узлы state* различаются между платформами; например, RK3399 имеет state0/1/2.

### 4.4 Фиксированная высокая частота CPU

Назначение: анализ и устранение нестабильной частоты кадров при высокой нагрузке. Политика CPU performance удерживает CPU на максимальной частоте для наибольшей производительности.

```text
cpunum=$(cat /proc/cpuinfo | grep processor | wc -l)
for i in `seq 0 $(($cpunum-1))`
do
echo performance > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor
done
```

### 4.5 Фиксированная высокая частота DDR

Назначение: диагностировать ошибки запуска предпросмотра, искажения и нестабильную частоту кадров из-за динамического изменения частоты DDR. Большинство платформ Rockchip поддерживают его для экономии энергии. Возможны два случая: низкая частота DDR в момент запуска иногда вызывает отказ предпросмотра; во время предпросмотра — нестабильность кадров или искажения сжатого изображения. Ниже два способа установить максимальную частоту. Способ 1 предназначен преимущественно для отладки: DDR всегда работает на максимуме независимо от UVC. Способ 2 подходит для серийного продукта: максимум только во время работы UVC, иначе частота определяется нагрузкой. Способ 1: настройка командной строкой на примере RK3588.

```text
console:/ # cd /sys/class/devfreq/dmc
console:/sys/class/devfreq/dmc # cat max_freq
2112000000
console:/sys/class/devfreq/dmc # echo userspace > governor
console:/sys/class/devfreq/dmc # echo 2112000000 > userspace/set_freq
```

Способ 2: изменение UVC-драйвера для высокой частоты DDR [рекомендуется]. Изменения для Linux-4.19:

```text
From 970e4749125d685dc03ea32e3ae77e6f0ab7cff7 Mon Sep 17 00:00:00 2001
From: "william.wu" <william.wu@rock-chips.com>
Date: Sat, 11 Nov 2023 15:41:10 +0800
Subject: [PATCH] media: uvcvideo: set system status to performance when stream
 on

For rockchip platforms, set performance frequency for the
memory controller when uvc stream on, and clear it after
uvc stream off. It can improve uvc streaming stability.

Signed-off-by: william.wu <william.wu@rock-chips.com>
Change-Id: I1dc0cf10c552bba2c3a0f8a1bb37d90f546eb4a3
---
 drivers/media/usb/uvc/uvc_video.c | 6 ++++++
 1 file changed, 6 insertions(+)

diff --git a/drivers/media/usb/uvc/uvc_video.c b/drivers/media/usb/uvc/uvc_video.c
index ef3832b03709..d2158c94ae47 100644
--- a/drivers/media/usb/uvc/uvc_video.c
+++ b/drivers/media/usb/uvc/uvc_video.c
@@ -25,6 +25,8 @@
 #include <media/v4l2-common.h>
 #include "uvcvideo.h"
+#include <dt-bindings/soc/rockchip-system-status.h>
+#include <soc/rockchip/rockchip-system-status.h>

 /* ------------------------------------------------------------------------
  * UVC Controls
@@ -2149,6 +2151,7 @@ int uvc_video_enable(struct uvc_streaming *stream, int
enable)
        }

        uvc_video_clock_cleanup(stream);
+       rockchip_clear_system_status(SYS_STATUS_PERFORMANCE);
        return 0;
    }

@@ -2161,6 +2164,8 @@ int uvc_video_enable(struct uvc_streaming *stream, int
enable)
    if (ret < 0)
        goto error_commit;

+   rockchip_set_system_status(SYS_STATUS_PERFORMANCE);
+
    ret = uvc_init_video(stream, GFP_KERNEL);
    if (ret < 0)
        goto error_video;
@@ -2168,6 +2173,7 @@ int uvc_video_enable(struct uvc_streaming *stream, int
enable)
    return 0;

 error_video:
+   rockchip_clear_system_status(SYS_STATUS_PERFORMANCE);
    usb_set_interface(stream->dev->udev, stream->intfnum, 0);
 error_commit:
    uvc_video_clock_cleanup(stream);
--
2.34.1
```

Изменения для Linux-5.10:

```text
From ab0546fdd01a8a8df0f15d0c648fa73aba76d173 Mon Sep 17 00:00:00 2001
From: William Wu <william.wu@rock-chips.com>
Date: Wed, 8 Nov 2023 09:49:48 +0800
Subject: [PATCH] media: uvcvideo: set system status to performance when stream
 on

For rockchip platforms, set performance frequency for the
memory controller when uvc stream on, and clear it after
uvc stream off. It can improve uvc streaming stability.

Signed-off-by: William Wu <william.wu@rock-chips.com>
Change-Id: I1dc0cf10c552bba2c3a0f8a1bb37d90f546eb4a3
---
 drivers/media/usb/uvc/uvc_video.c | 6 ++++++
 1 file changed, 6 insertions(+)
diff --git a/drivers/media/usb/uvc/uvc_video.c b/drivers/media/usb/uvc/uvc_video.c
index 03dfe96bceba..79ffe93b19ae 100644
--- a/drivers/media/usb/uvc/uvc_video.c
+++ b/drivers/media/usb/uvc/uvc_video.c
@@ -20,6 +20,8 @@
 #include <media/v4l2-common.h>

 #include "uvcvideo.h"
+#include <dt-bindings/soc/rockchip-system-status.h>
+#include <soc/rockchip/rockchip-system-status.h>

 /* ------------------------------------------------------------------------
  * UVC Controls
@@ -2139,6 +2141,8 @@ int uvc_video_start_streaming(struct uvc_streaming *stream)
    if (ret < 0)
        goto error_commit;

+   rockchip_set_system_status(SYS_STATUS_PERFORMANCE);
+
    ret = uvc_video_start_transfer(stream, GFP_KERNEL);
    if (ret < 0)
        goto error_video;
@@ -2146,6 +2150,7 @@ int uvc_video_start_streaming(struct uvc_streaming *stream)
    return 0;

 error_video:
+   rockchip_clear_system_status(SYS_STATUS_PERFORMANCE);
    usb_set_interface(stream->dev->udev, stream->intfnum, 0);
 error_commit:
    uvc_video_clock_cleanup(stream);
@@ -2176,4 +2181,5 @@ void uvc_video_stop_streaming(struct uvc_streaming *stream)
    }

    uvc_video_clock_cleanup(stream);
+   rockchip_clear_system_status(SYS_STATUS_PERFORMANCE);
 }
--
2.34.1
```

### 4.6 Разбор кадров UVC

Назначение: анализ искажений изображения при предпросмотре или записи, чтобы различить причину в UVC Device и Host. Пример разбора MJPG-кадров Logitech UVC Camera (idVendor=046d, idProduct=0823) с высокополосной изохронной передачей. Захват данных и извлечение кадров:

1. Захватите USB-обмен предпросмотра MJPG анализатором Ellisys USB2.0.

2. Экспортируйте и сохраните Text по рис. 3: File -&gt; Export -&gt; Transactions data -&gt; Text.

3. Откройте UVC txt в редакторе и найдите заголовок кадра согласно Format of the Payload Header спецификации UVC [2]. На рис. 4 длина заголовка 0x0C, информация заголовка 0x8C.

4. Передайте информацию заголовка скрипту Python uvc-data.py для разбора txt; скрипт автоматически сохраняет кадры UVC как .jpg.

![Рисунок из китайского оригинала](/docs/rockchip-linux-usb-host-uvc/assets/cn-p016-figure-01.png)

Рис. 3. Данные анализатора UVC

![Рисунок из китайского оригинала](/docs/rockchip-linux-usb-host-uvc/assets/cn-p016-figure-02.png)

Рис. 4. Текстовые данные UVC. Python-скрипт извлечения кадров uvc-data.py:

```text
# -*- coding: utf-8 -*-
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--file', '-f', type=str, required=True, default='',
help='The txt format file of uvc data')
parser.add_argument('--header_len', '-l', type=str, required=True, default='',
help='Length of uvc header in bytes')
parser.add_argument('--header_info','-i', type=str, required=True, default='',
help='Information of uvc header')
parser.add_argument('--count', '-n', type=int, default=10, help='The count of images to saved')
args = parser.parse_args()

def get_photo(cnt = 0):
    src = open(args.file, 'r')
    uvc_header_len = int(args.header_len, 16)
    uvc_header_info = int(args.header_info, 16)
    uvc_header_even_frame = uvc_header_info & 0xFC
    uvc_header_even_frame_eof = uvc_header_even_frame | 0x02
    uvc_header_odd_frame = (uvc_header_info & 0xFC) | 0x01
    uvc_header_odd_frame_eof = (uvc_header_odd_frame | 0x02)
    pic = []
    num = 0
    eof = 0
    uvc_first_frame = 0
    uvc_payload_offset = 0

    print('UVC Header Length:        ', hex(uvc_header_len), 'Bytes')
    print('UVC Header EVEN Frame:    ', hex(uvc_header_even_frame))
    print('UVC Header EVEN Frame EOF:', hex(uvc_header_even_frame_eof))
    print('UVC Header ODD Frame:     ', hex(uvc_header_odd_frame))
    print('UVC Header ODD Frame EOF: ', hex(uvc_header_odd_frame_eof))

    for line in src:
        line = line.split(' ')
        data0 = int(line[0], 16)
        data1 = int(line[1], 16)

        if ((data0 == uvc_header_len) and
            ((data1 == uvc_header_even_frame) or (data1 ==
uvc_header_odd_frame))):
            uvc_payload_offset = uvc_header_len
            uvc_first_frame = 1
        elif ((data0 == uvc_header_len) and
            ((data1 == uvc_header_even_frame_eof) or
            (data1 == uvc_header_odd_frame_eof) or
            (data1 == ((uvc_header_even_frame_eof & 0x0F) | 0x10)) or
            (data1 == ((uvc_header_odd_frame_eof & 0x0F) | 0x10)))):
            uvc_payload_offset = uvc_header_len
            uvc_first_frame = 0
            eof = 1
        else:
            uvc_payload_offset = 0
            uvc_first_frame = 0
            eof = 0

        if (eof == 1 and uvc_first_frame == 1):
            path = 'photo_' + str(num) + '.jpg'
            print(path + ' Saved ' + str(len(pic)) + 'Bytes')
            dst = open(path, 'wb+')
            dst.write(bytes.fromhex(''.join(pic)))
            dst.close()
            num += 1
            pic = []
            eof = 0
            if (cnt != 0 and cnt == num):
                break
        if (len(line) > uvc_payload_offset):
            for i in range(uvc_payload_offset, len(line)):
                pic.append(line[i])

    src.close()

get_photo(args.count)
```

Пример использования:

```text
# 查看 uvc-data.py 使⽤⽅法
# -f: 待解析的 uvc 数据⽂本⽂件，必要参数；
# -l: 待解析的  帧头⻓度，必要参数；
# -i: 待解析的 uvc 帧头信息，必要参数；
# -n：待解析和保存的 uvc 帧图像数量；
python uvc-data.py -h
usage: uvc-data.py [-h] --file FILE --header_len HEADER_LEN --header_info
HEADER_INFO [--count COUNT]

options:
  -h, --help            show this help message and exit
  --file FILE, -f FILE  The txt format file of uvc data
  --header_len HEADER_LEN, -l HEADER_LEN
                        Length of uvc header in bytes
  --header_info HEADER_INFO, -i HEADER_INFO
                        Information of uvc header
  --count COUNT, -n COUNT
                        The count of images to saved
# 解析 uvcdata.txt，uvc 帧头⻓度为 0x0c，uvc 帧头信息为 0x8c，保存 5 张图象
python uvc-data.py -f uvcdata.txt -l 0c -i 8c -n 5
UVC Header Length:         0xc Bytes
UVC Header EVEN Frame:     0x8c
UVC Header EVEN Frame EOF: 0x8e
UVC Header ODD Frame:      0x8d
UVC Header ODD Frame EOF:  0x8f
photo_0.jpg Saved 516573Bytes
photo_1.jpg Saved 827193Bytes
photo_2.jpg Saved 827585Bytes
photo_3.jpg Saved 3120193Bytes
photo_4.jpg Saved 188340Bytes
```

### 4.7 Оптимизация драйвера UVC

1. Увеличение количества URB UVC. Цель: повысить допустимую задержку обработки USB-прерываний. Последствие: URB буферизуют кадры, увеличивая задержку предпросмотра. Пример Linux-4.19:

```text
diff --git a/drivers/media/usb/uvc/uvcvideo.h b/drivers/media/usb/uvc/uvcvideo.h
index 96632cc58d77..3761946af110 100644
--- a/drivers/media/usb/uvc/uvcvideo.h
+++ b/drivers/media/usb/uvc/uvcvideo.h
@@ -173,7 +173,7 @@
 #define DRIVER_VERSION         "1.1.1"

 /* Number of isochronous URBs. */
-#define UVC_URBS               5
+#define UVC_URBS               32
 /* Maximum number of packets per URB. */
 #define UVC_MAX_PACKETS                32
 /* Maximum status buffer size in bytes of interrupt URB. */
```

2. Изменение выделения DMA-буфера UVC: заменить стандартный usb_alloc_coherent на kmalloc, чтобы ускорить чтение и разбор данных драйвером. Последствие: USB-драйвер должен обеспечивать когерентность кэша DMA-буфера. Драйвер Rockchip уже делает это по умолчанию; дополнительных изменений не требуется.

```text
diff --git a/drivers/media/usb/uvc/uvc_video.c b/drivers/media/usb/uvc/uvc_video.c
index d2158c94ae47..fff3c710bc97 100644
--- a/drivers/media/usb/uvc/uvc_video.c
+++ b/drivers/media/usb/uvc/uvc_video.c
@@ -1604,7 +1604,7 @@ static void uvc_free_urb_buffers(struct uvc_streaming
*stream)
                struct uvc_urb *uvc_urb = &stream->uvc_urb[i];

                if (uvc_urb->buffer) {
-#ifndef CONFIG_DMA_NONCOHERENT
+#if 0
                        usb_free_coherent(stream->dev->udev, stream->urb_size,
                                        uvc_urb->buffer, uvc_urb->dma);
 #else
@@ -1651,7 +1651,7 @@ static int uvc_alloc_urb_buffers(struct uvc_streaming
*stream,
                        struct uvc_urb *uvc_urb = &stream->uvc_urb[i];

                        stream->urb_size = psize * npackets;
-#ifndef CONFIG_DMA_NONCOHERENT
+#if 0
                        uvc_urb->buffer = usb_alloc_coherent(
                                stream->dev->udev, stream->urb_size,
                                gfp_flags | __GFP_NOWARN, &uvc_urb->dma);
@@ -1768,7 +1768,7 @@ static int uvc_init_video_isoc(struct uvc_streaming
*stream,
                urb->context = uvc_urb;
                urb->pipe = usb_rcvisocpipe(stream->dev->udev,
                                ep->desc.bEndpointAddress);
-#ifndef CONFIG_DMA_NONCOHERENT
+#if 0
                urb->transfer_flags = URB_ISO_ASAP | URB_NO_TRANSFER_DMA_MAP;
                urb->transfer_dma = uvc_urb->dma;
 #else
@@ -1834,7 +1834,7 @@ static int uvc_init_video_bulk(struct uvc_streaming
*stream,

                usb_fill_bulk_urb(urb, stream->dev->udev, pipe, uvc_urb->buffer,
                                  size, uvc_video_complete, uvc_urb);
-#ifndef CONFIG_DMA_NONCOHERENT
+#if 0
                urb->transfer_flags = URB_NO_TRANSFER_DMA_MAP;
                urb->transfer_dma = uvc_urb->dma;
 #endif
```

## 5. Типичные проблемы UVC

### 5.1 Не запускается предпросмотр

Ошибка открытия предпросмотра обычно относится к пяти случаям. Случай 1: отказ high-speed handshake. Большинство UVC-устройств работают только в high-speed или super-speed. Если из-за сигнала скорость падает до full-speed, нормальный предпросмотр невозможен. Проверьте перечисление USB через последовательный порт: сообщение full-speed, подобное следующему, указывает на отказ high-speed handshake.

```text
usb 3: new full-speed USB device number 3 using ohci-platform
usb 3: not running at top speed; connect to a high speed hub
```

Решение: осциллографом определите причину ошибки handshake; затем сочетайте оптимизацию аппаратуры и настройку регистров PHY. Случай 2: ошибка согласования полосы UVC Probe Control/Commit Control. Перед предпросмотром Host и Device согласуют параметры в четыре этапа, показанные на рис. 5:

1. Host отправляет устройству желаемые настройки (PROBE).

2. Устройство корректирует их в пределах своих возможностей и возвращает Host (PROBE).

3. Если настройки подходят, Host подтверждает их (COMMIT).

4. Устройство задаёт формат, разрешение, полосу и другие параметры по COMMIT Host.

![Рисунок из китайского оригинала](/docs/rockchip-linux-usb-host-uvc/assets/cn-p021-figure-01.png)

Рис. 5. Согласование параметров UVC. Решение: захватите полный обмен перечисления и запуска предпросмотра анализатором USB либо usbmon и проверьте корректность согласования. Если подтверждена ошибка Probe/Commit, исправьте соответствующую логику драйвера или приложения.

Случай 3: неисправная работа Host. По USB 2.0 все транзакции инициирует Host; Device не может самостоятельно отправлять данные. Если при запуске Host не выполняет SetInterface streaming on либо после него не отправляет IN packet на Streaming endpoint, Device не передаёт изображения. Решение: полный захват транзакций анализатором. Если анализатор недоступен, наблюдайте Host через usbmon по соответствующему разделу.

Случай 4: несовместимость autosuspend. В Rockchip UVC Host autosuspend включён для экономии энергии, но некоторые устройства несовместимы и дают сбои предпросмотра. См. раздел отключения UVC autosuspend.

Случай 5: динамическая частота DDR нарушает получение потока. Низкая частота DDR повышает bus latency USB-контроллера; превышение допуска изохронной UVC-передачи может сорвать запуск. См. раздел фиксации высокой частоты DDR.

### 5.2 Нестабильная частота кадров

На частоту кадров влияют задержка USB-прерываний, latency доступа USB к шине, время разбора кадров драйвером и другие факторы. При высокой нагрузке нестабильность заметнее. Решение: привязка USB-прерываний к CPU, отключение CPU IDLE, фиксация высокой частоты CPU и DDR согласно соответствующим разделам; это улучшает обработку прерываний, latency шины и производительность CPU.

### 5.3 Искажения изображения

Основная причина искажений: большинство UVC-устройств используют изохронную передачу USB — своевременную, но ненадёжную; ошибочные или потерянные данные не передаются повторно. Для быстрой локализации рекомендуется USB-анализатор. Форматы бывают несжатые (YUV) и сжатые (MJPG/H264/H256 — написание оригинала), и причины искажений различаются. Случай 1: искажения несжатого изображения. Драйвер проверяет размер полного несжатого кадра и отбрасывает кадр, если принятый размер не совпадает с расчётным, предотвращая искажения от ошибок физической шины или потери кадров. Поэтому сначала можно исключить проблемы сигнала и несвоевременную обработку изохронной передачи драйвером контроллера. Этапы анализа:

1. Непрерывно захватывайте обмен несжатого предпросмотра USB-анализатором и наблюдайте изображение. При искажении сразу остановите захват, сохраните данные и извлеките изображения Python-скриптом по разделу разбора кадров.

2. Если захват и извлечённые изображения нормальны, причина на Host. Иначе исходные данные UVC уже повреждены — исследуйте Device.

3. На Host прежде всего проверьте когерентность кэша DMA-буфера USB-контроллера.

4. Используйте v4l2-ctl для получения потока и проверки влияния приложения. Случай 2: искажения сжатого изображения. Они возникают легче, поскольку размер сжатого кадра непостоянен и драйвер не может проверить правильность фактически полученного размера. Этапы анализа:

1. Непрерывно захватывайте обмен сжатого предпросмотра и наблюдайте изображение. При искажении сразу остановите анализатор, сохраните данные и извлеките изображения Python-скриптом по соответствующему разделу.

2. При явных ошибках передачи, например CRC error или неполных пакетах, прежде всего исследуйте качество USB-сигнала.

3. Если извлечённые анализатором изображения также повреждены, данные физической USB-шины уже ненормальны. Найдите соответствующие транзакции. Отсутствие IN packet от Host в нескольких последовательных микрокадрах может указывать на несвоевременную обработку изохронной передачи контроллером. Если Host работает нормально, возможна ошибка исходных данных Device; исследуйте Device.

4. Если извлечённые изображения нормальны, проверьте на Host когерентность кэша DMA-буфера USB-контроллера, приоритет USB/CPU на шине (QOS), обработку приложением UVC и другие факторы.

5. Используйте v4l2-ctl для исключения влияния приложения. Способы устранения:

1. Качество сигнала: измерьте глазковую диаграмму USB HS и по отчёту оптимизируйте аппаратную схему и параметры PHY драйвера [4].

2. Несвоевременная обработка изохронной передачи: используйте разделы привязки USB-прерываний, отключения CPU IDLE и фиксации высокой частоты CPU/DDR для улучшения отклика, latency шины и производительности.

3. Повысить приоритет USB/CPU на шине (QOS).

### 5.4 Недостаток полосы нескольких потоков UVC

Недостаток полосы обычно возникает, когда через HUB к USB Host подключены две или более USB2.0 UVC-камеры: предпросмотр не открывается, ядро выдаёт ошибки:

1. Журнал ошибок USB3.0 Host

```text
usb 5-1.4: Not enough bandwidth for new device state.
usb 5-1.4: Not enough bandwidth for altsetting 11
VIDIOC_STREAMON: failed: No space left on device
```

2. Журнал ошибок USB2.0 Host

```text
uvcvideo: Failed to submit URB 0 (-28).
VIDIOC_STREAMON: failed: No space left on device
```

Пример: USB2.0 Host RK3588 расширен HUB, к двум downstream-портам подключены Logitech HD C93 и UVC Camera (046d:0823). Воспроизведение проблемы:

```text
# step1. 查看 UVC video 节点信息
console:/ # v4l2-ctl --list-devices
罗技⾼清⽹络摄像机 C93 (usb-fc880000.usb-1.1):
        /dev/video21
        /dev/video22

UVC Camera (046d:0823) (usb-fc880000.usb-1.4):
        /dev/video23
        /dev/video24

# step2. 两路 UVC 同时以分辨率 1920*1080 图像格式 MJPG ⽅式取流
console:/ # v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap &
console:/ # v4l2-ctl --device /dev/video23 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap &
# step3. video21 取流成功，但 video23 取流失败，串⼝提⽰log
console:/ # uvcvideo: Failed to submit URB 0 (-28).
console:/ # VIDIOC_STREAMON: failed: No space left on device
```

Анализ проблемы:

```text
# 查看 UVC 设备的端点信息
console:/ # cat /sys/kernel/debug/usb/devices
# 对应 罗技⾼清⽹络摄像机 C93 设备
T:  Bus=02 Lev=02 Prnt=02 Port=00 Cnt=01 Dev#=  3 Spd=480  MxCh= 0
D:  Ver= 2.00 Cls=ef(misc ) Sub=02 Prot=01 MxPS=64 #Cfgs=  1
P:  Vendor=046d ProdID=0891 Rev= 0.19
S:  Product=罗技⾼清⽹络摄像机 C930c
S:  SerialNumber=83FBB5EE
......
I:* If#= 1 Alt= 0 #EPs= 0 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
I:  If#= 1 Alt= 1 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS= 192 Ivl=125us
I:  If#= 1 Alt= 2 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
......
I:  If#= 1 Alt=10 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS=2688 Ivl=125us
I:  If#= 1 Alt=11 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS=3072 Ivl=125us

# 对应 UVC Camera (046d:0823) 设备
T:  Bus=02 Lev=02 Prnt=02 Port=03 Cnt=02 Dev#=  4 Spd=480  MxCh= 0
D:  Ver= 2.00 Cls=ef(misc ) Sub=02 Prot=01 MxPS=64 #Cfgs=  1
P:  Vendor=046d ProdID=0823 Rev= 0.10
S:  SerialNumber=7F65EA20
......
I:* If#= 3 Alt= 0 #EPs= 0 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
I:  If#= 3 Alt= 1 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS= 192 Ivl=125us
......
E:  Ad=81(I) Atr=05(Isoc) MxPS=1984 Ivl=125us
I:  If#= 3 Alt=10 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS=3060 Ivl=125us
I:  If#= 3 Alt=11 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS=3060 Ivl=125us
```

Информация endpoint показывает динамическую настройку полосы обеих камер Logitech. Минимальный Maxpacket size — 192 bytes у обеих; максимумы — 3072 bytes и 3060 bytes. Max packet size здесь означает максимальные данные камеры за один USB-микрокадр. Динамическая настройка изменяет этот размер по разрешению и формату. Включите UVC trace по разделу диагностики драйвера, чтобы определить полосу при открытии предпросмотра.

```text
# 查看 UVC 设备占⽤的 USB 总线带宽信息
console:/ # echo 0xffff > /sys/module/uvcvideo/parameters/trace
console:/ # echo 8 > /proc/sys/kernel/printk
console:/ # v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap

# 罗技⾼清⽹络摄像机 C93 设备的 trace 关键信息如下：
uvcvideo: Selecting alternate setting 11 (3072 B/frame bandwidth).

# 同样的操作⽅法，UVC Camera (046d:0823) 设备的 trace 关键信息如下：
uvcvideo: Selecting alternate setting 11 (3060 B/frame bandwidth).
```

Trace показывает: для MJPG 1920*1080 камера Logitech HD C93 требует 3072 B/frame, а камера 046d:0823 — 3060 B/frame. Frame здесь означает USB-микрокадр длительностью 125 микросекунд. По USB2.0 [5], §5.6.4 Isochronous Transfer Bus Access Constraints, high-speed endpoints могут выделять периодическим передачам не более 80% микрокадра. Максимальное время: 125 us * 80% = 100us; остальное зарезервировано непериодическим устройствам. §5.11.3 Calculating Bus Transaction Times описывает:

```text
High-speed (Input)
Isochronous Transfer (No Handshake)
= (38 * 8 * 2.083) + (2.083 * Floor(3.167 + BitStuffTime(Data_bc))) +
Host_Delay
```

USB-драйвер ядра Linux строго следует USB 2.0. Реализация:

```text
include/linux/usb/hcd.h
/*
 * Ceiling [nano/micro]seconds (typical) for that many bytes at high speed
 * ISO is a bit less, no ACK ... from USB 2.0 spec, 5.11.3 (and needed
 * to preallocate bandwidth)
 */
#define USB2_HOST_DELAY 5       /* nsec, guess */
#define HS_NSECS(bytes) (((55 * 8 * 2083) \
        + (2083UL * (3 + BitTime(bytes))))/1000 \
        + USB2_HOST_DELAY)
#define HS_NSECS_ISO(bytes) (((38 * 8 * 2083) \
        + (2083UL * (3 + BitTime(bytes))))/1000 \
        + USB2_HOST_DELAY)
#define HS_USECS(bytes)         NS_TO_US(HS_NSECS(bytes))
#define HS_USECS_ISO(bytes)     NS_TO_US(HS_NSECS_ISO(bytes))

drivers/usb/core/hcd.c
long usb_calc_bus_time (int speed, int is_input, int isoc, int bytecount)
{
        unsigned long   tmp;
        ......
        case USB_SPEED_HIGH:    /* ISOC or INTR */
                /* FIXME adjust for input vs output */
                if (isoc)
                        tmp = HS_NSECS_ISO (bytecount);
                else
                        tmp = HS_NSECS (bytecount);
        ......
}
```

По этому расчёту разные ISOC Max packet size дают следующее bus time:

| Макс. пакет (bytes/uframe) | Время шины (us) |
| --- | --- |
| 256 | 5 |
| 640 | 13 |
| 1024 | 20 |
| 1920 | 37 |
| 3072 | 60 |

Поэтому две камеры с высокой полосой, например 3072bytes/uframe каждая, превышают предел USB2.0 100us, вызывая нехватку полосы. Способ 1: оптимизация распределения полосы UVC [предпочтительно]. Цель: уменьшить максимальный запрос конкретного устройства. Последствие: возможное снижение частоты кадров несжатого YUV. Пример Linux-5.10:

```text
diff --git a/drivers/media/usb/uvc/uvc_video.c b/drivers/media/usb/uvc/uvc_video.c
index f6373d678d25..ee798b778255 100644
--- a/drivers/media/usb/uvc/uvc_video.c
+++ b/drivers/media/usb/uvc/uvc_video.c
@@ -1845,6 +1845,7 @@ static int uvc_video_start_transfer(struct uvc_streaming *stream,
        struct usb_interface *intf = stream->intf;
        struct usb_host_endpoint *ep;
        struct uvc_urb *uvc_urb;
+       struct usb_device *udev = interface_to_usbdev(intf);
        unsigned int i;
        int ret;

@@ -1866,6 +1867,13 @@ static int uvc_video_start_transfer(struct uvc_streaming *stream,
                /* Isochronous endpoint, select the alternate setting. */
                bandwidth = stream->ctrl.dwMaxPayloadTransferSize;

+               if ((le16_to_cpu(udev->descriptor.idVendor) == 0x2bdf) &&
+                   (le16_to_cpu(udev->descriptor.idProduct) == 0x0293) &&
+                   (bandwidth > 1600)){
+                       printk("UVC_DBG: limit bandwidth from %u to 1600B\n", bandwidth);
+                       bandwidth = 1600;
+               }
+
                if (bandwidth == 0) {
                        uvc_trace(UVC_TRACE_VIDEO, "Device requested null "
                                "bandwidth, defaulting to lowest.\n");
```

Способ 2: увеличить долю периодической полосы USB до 95% или выше. Это повышает доступную периодическую полосу, но непериодические устройства той же шины, например флеш-накопители, могут перестать нормально работать. Ограничение: способ неприменим к USB3.0 Host xHCI. Пример изменения драйвера USB2.0 Host EHCI:

```text
diff --git a/drivers/usb/host/ehci-hcd.c b/drivers/usb/host/ehci-hcd.c
index 8aff19ff8e8f..bed879a4ab5b 100644
--- a/drivers/usb/host/ehci-hcd.c
+++ b/drivers/usb/host/ehci-hcd.c
@@ -475,7 +475,7 @@ static int ehci_init(struct usb_hcd *hcd)
         * by default set standard 80% (== 100 usec/uframe) max periodic
         * bandwidth as required by USB 2.0
         */
-       ehci->uframe_periodic_max = 100;
+       ehci->uframe_periodic_max = 125;

        /*
         * hw default: 1K periodic list heads, one per frame.
```

Пример для контроллера USB2.0 Host DWC2:

```text
diff --git a/drivers/usb/dwc2/hcd_queue.c b/drivers/usb/dwc2/hcd_queue.c
index b2e0721a3eb8..e8b394bd9aae 100644
--- a/drivers/usb/dwc2/hcd_queue.c
+++ b/drivers/usb/dwc2/hcd_queue.c
@@ -119,7 +119,7 @@ static int dwc2_check_periodic_bandwidth(struct
dwc2_hsotg *hsotg,
                 * High speed mode
                 * Max periodic usecs is 80% x 125 usec = 100 usec
                 */
-               max_claimed_usecs = 100 - qh->host_us;
+               max_claimed_usecs = 125 - qh->host_us;
        } else {
                /*
                 * Full speed mode
```

### 5.5 Задержка предпросмотра

Путь UVC-изображения длинный, и задержка каждого модуля влияет на общую задержку предпросмотра. Сначала захватите анализатором полный поток при запуске и определите узкое место — Device или Host. На Host отдельно измеряйте задержки каждого звена. Пример: буферизация Host вызывает задержку MJPEG 1080P модуля структурированного света. APK libuvc после получения данных ядра выполняет memcopy в собственную frame queue, асинхронную с 10 URB ядра, циклически принимающими данные. Программное декодирование и отображение 1080P на Host медленны: первое изображение показывается лишь после приёма ядром и помещения libuvc в очередь 6–7 кадров. Несколько буферизованных кадров и создают задержку. Решение: ускорить программное декодирование Host и избежать накопления кадров.

### 5.6 Проблемы EMI UVC

EMI обычно связана с аппаратной схемой USB-устройства и может нарушать UVC, например не давать открыть предпросмотр или вызывать зависание. Linux Host обычно сообщает: usb usb1-port1: disabled by hub (EMI?), re-enabling... Принцип определения: Host-контроллер, например EHCI, постоянно опрашивает port enable. Если порт внезапно стал disabled, а регистр подключения всё ещё показывает устройство, драйвер предполагает EMI и выводит этот журнал. Поэтому сообщение EMI — важное направление проверки, но не доказательство причины. Способы устранения:

1. Измерьте глазковую диаграмму USB осциллографом и передайте отчёт инженерам аппаратуры и USB-драйвера. По отчёту они корректируют схему и регистры PHY для улучшения сигнала и EMI.

2. Измерьте одиночные и дифференциальные сигналы DP/DM. Повышенный шум ухудшает качество и может вызвать EMI. Три аппаратных варианта уменьшения шума: (1) синфазный дроссель последовательно в DP/DM; (2) дополнительное общее заземление Device и Host; (3) USB Host-разъём с большей площадью контактов DP/DM.

## 6. Ссылки

1. kernel/Documentation/trace/ftrace.rst

2. USB Video Class v1.1

3. «Rockchip_Developer_Guide_USB_CN»

4. «Rockchip_Introduction_USB_SQ_Tool_CN»

5. USB 2.0 Specification

{% endraw %}
