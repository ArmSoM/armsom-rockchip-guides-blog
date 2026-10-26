---
title: "Rockchip USB FunctionFS AIO: сборка, Gadget и патч USB 3.0"
description: "Rockchip USB FunctionFS AIO: сборка, Gadget и патч USB 3.0 — V1.2.2"
excerpt: "Rockchip USB FunctionFS AIO: сборка, Gadget и патч USB 3.0"
translation_key: "162-rockchip-usb-ffs-demo"
slug: "162-rockchip-usb-ffs-demo"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, FunctionFS, Linux]
---

{% raw %}

# Rockchip USB FunctionFS AIO: сборка, Gadget и патч USB 3.0

Платформенная справка ArmSoM по китайскому RK-KF-YF-464 V1.2.2 для Linux 4.4/4.19: RK3399, RK3368, RK3366, RK3328, RK3288, RK312X, RK3188, RK30XX, RK3308, RK3326, PX30. Проверяйте плату ArmSoM, BSP, имя USB-контроллера и зависимости; пример RK3399 Excavator не универсален. Английского PDF и отдельных рисунков нет. Во всех четырёх языках сохранены полные патчи. Команды не выполнялись, аппаратные испытания не проводились.

Неясности и условия: `../..toolchain` в CROSS_COMPILE сохранён; сверяйте с реальным каталогом. Размеры полей, htole32 и контекст патча проверяйте по заголовкам/SDK без догадок. Настройка изменяет Gadget и удаляет f1; сначала разберитесь в конфигурации устройства. Ничего не выполнялось. Названия путей Makefile вынесены из содержимого, отступы рецептов восстановлены табуляцией.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Исходники тестовых примеров

1. Simple-Demo: `kernel/tools/usb/ffs-aio-example/simple`

2. Multibuf-Demo: `kernel/tools/usb/ffs-aio-example/multibuff`

Два примера показывают API асинхронного ввода-вывода FunctionFS. Simple-Demo выполняет простую двунаправленную передачу; Multibuf-Demo использует несколько буферов для высокопроизводительных приложений. Оба включают пользовательские приложения устройства и хоста. Устройству нужна libaio, хосту — libusb. Без изменений поддерживается только USB2.0.

## 2. Загрузка toolchain (ARCH=arm64)

`ssh://wulf@10.10.10.29:29418/rk/prebuilts/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu`

Замените «wulf» собственным именем Gerrit. Это адрес частной сети из источника, не общедоступная загрузка; нужны соответствующая разрешённая сеть и учётная запись.

## 3. Загрузка Libaio

[libaio](https://pagure.io/libaio.git)

## 4. Сборка библиотеки Libaio

Перейдите в libaio/src и измените «CC» и «AR» в Makefile.

```text
diff --git a/src/Makefile b/src/Makefile
index eadb336..9d3f19b 100644
--- a/src/Makefile
+++ b/src/Makefile
@@ -1,3 +1,5 @@
+CC = $(CROSS_COMPILE)gcc
+AR = $(CROSS_COMPILE)ar
 prefix=/usr
 includedir=$(prefix)/include
 libdir=$(prefix)/lib
```

Затем выполните make:

```text
make ARCH=arm64  CROSS_COMPILE=../..toolchain/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-
```

Результаты: статическая библиотека `libaio.a` и динамическая `libaio.so.1.0.1`. Источник рекомендует собирать FFS-пример со статической libaio.a.

## 5. Сборка тестовых примеров

### 5.1 Сборка Device_app

1. Скопируйте libaio/src/libaio.h в kernel/tools/include/tools/.

2. Скопируйте libaio.a в kernel/tools/usb/ffs-aio-example/multibuff/device_app/. и kernel/tools/usb/ffs-aio-example/simple/device_app/.

3. Измените подключаемый заголовок в aio_multibuff.c и aio_simple.c.

```text
diff --git a/tools/usb/ffs-aio-example/multibuff/device_app/aio_multibuff.c b/tools/usb/ffs-aio-example/multibuff/device_app/aio_multibuff.c
index aaca1f4..e0bf98c 100644
--- a/tools/usb/ffs-aio-example/multibuff/device_app/aio_multibuff.c
+++ b/tools/usb/ffs-aio-example/multibuff/device_app/aio_multibuff.c
@@ -42,7 +42,7 @@
 #include <stdbool.h>
 #include <sys/eventfd.h>

-#include "libaio.h"
+#include <tools/libaio.h>
 #define IOCB_FLAG_RESFD         (1 << 0)

 #include <linux/usb/functionfs.h>
diff --git a/tools/usb/ffs-aio-example/simple/device_app/aio_simple.c b/tools/usb/ffs-aio-example/simple/device_app/aio_simple.c
index 1f44a29..3dab7f1 100644
--- a/tools/usb/ffs-aio-example/simple/device_app/aio_simple.c
+++ b/tools/usb/ffs-aio-example/simple/device_app/aio_simple.c
@@ -42,7 +42,7 @@
 #include <stdbool.h>
 #include <sys/eventfd.h>

-#include "libaio.h"
+#include <tools/libaio.h>
 #define IOCB_FLAG_RESFD         (1 << 0)

 #include <linux/usb/functionfs.h>
```

4. Добавьте Makefile с поиском libaio.a в текущем каталоге.

`kernel/tools/usb/ffs-aio-example/simple/device_app/Makefile`

```text
# Makefile for USB tools
CC = $(CROSS_COMPILE)gcc
AIO_LIBS = -L. -laio
WARNINGS = -Wall -Wextra
CFLAGS = $(WARNINGS) -static -I../../../../include
LDFLAGS = $(AIO_LIBS)

all: aio_simple
%: %.c
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

clean:
	$(RM) aio_simple
```

`kernel/tools/usb/ffs-aio-example/multibuff/device_app/Makefile`

```text
# Makefile for USB tools
CC = $(CROSS_COMPILE)gcc
AIO_LIBS = -L. -laio
WARNINGS = -Wall -Wextra
CFLAGS = $(WARNINGS) -static -I../../../../include
LDFLAGS = $(AIO_LIBS)

all: aio_multibuff
%: %.c
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

clean:
	$(RM) aio_multibuff
```

5. Выполните make:

```text
make ARCH=arm64 CROSS_COMPILE=../../../../../../toolchain/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-
```

Выполните команду отдельно в ffs-aio-example/simple/device_app и ffs-aio-example/multibuff/device_app. Успешная сборка создаёт ARM64-программы aio_simple и aio_multibuff.

### 5.2 Сборка Host_app

Host_app работает на ПК Ubuntu. Изменения исходников не нужны: выполните make в kernel/tools/usb/ffs-aio-example/simple/host_app и kernel/tools/usb/ffs-aio-example/multibuff/host_app для получения программы test.

## 6. Порядок испытания

1. Скопируйте собранные aio_simple и aio_multibuff в /data/. тестовой платформы и задайте разрешение на выполнение.

2. Отсоедините USB между тестовой платформой и ПК.

3. Настройте Configfs и Function FS Gadget.

### 1.1 Общий способ настройки

Для платформы RK Android используйте «1.2 Настройка на RK3399 Android Excavator». Скрипты ниже ссылаются на init.rk30board.usb.rc и init.usb.configfs.rc.

```text
#usb init参考android 脚本 init.rk30board.usb.rc和init.usb.configfs.rc

#Manual / Command line instructions ：
#Mount ConfigFS and create Gadget
mount -t configfs none /config
mkdir /config/usb_gadget/g1

#Set default Vendor and Product IDs and so on for now
echo 0x1d6b > /config/usb_gadget/g1/idVendor
echo 0x0105 > /config/usb_gadget/g1/idProduct
echo 0x0310 > /config/usb_gadget/g1/bcdDevice
echo 0x0200 > /config/usb_gadget/g1/bcdUSB

#Create English strings and add random deviceID
mkdir /config/usb_gadget/g1/strings/0x409
echo 0123459876 > /config/usb_gadget/g1/strings/0x409/serialnumber

#Update following if you want to
echo "rockchip" > /config/usb_gadget/g1/strings/0x409/manufacturer
echo "rkusbtest" >  /config/usb_gadget/g1/strings/0x409/product

#Create gadget configuration
mkdir /config/usb_gadget/g1/configs/b.1
mkdir /config/usb_gadget/g1/configs/b.1/strings/0x409
echo "test" > /config/usb_gadget/g1/configs/b.1/strings/0x409/configuration
echo 500 > /config/usb_gadget/g1/configs/b.1/MaxPower

#Set os_desc and link it to the gadget configuration
echo 0x1 > /config/usb_gadget/g1/os_desc/b_vendor_code
echo "MSFT100" > /config/usb_gadget/g1/os_desc/qw_sign
ln -s /config/usb_gadget/g1/configs/b.1 /config/usb_gadget/g1/os_desc/b.1

#Create test FunctionFS function
#And link it to the gadget configuration
mkdir /config/usb_gadget/g1/functions/ffs.test
rm /config/usb_gadget/g1/configs/b.1/f1
ln -s /config/usb_gadget/g1/functions/ffs.test /config/usb_gadget/g1/configs/b.1/f1

#Create ffs test and mount it, then  /dev/usb-ffs/test/ep0 will be created
mkdir -p /dev/usb-ffs/test
mount -o rmode=0770,fmode=0660,uid=1024,gid=1024 -t functionfs test /dev/usb-ffs/test
```

### 1.2 Настройка на RK3399 Android Excavator

Android usb init уже создал Configfs и выполнил часть настройки; остаются следующие действия.

```text
#usb init参考android 脚本 init.rk30board.usb.rc和init.usb.configfs.rc

#Manual / Command line instructions ：

#Set default Vendor and Product IDs and so on for now
echo 0x1d6b > /config/usb_gadget/g1/idVendor
echo 0x0105 > /config/usb_gadget/g1/idProduct

#Set gadget configuration
echo "test" > /config/usb_gadget/g1/configs/b.1/strings/0x409/configuration

#Create test FunctionFS function
#And link it to the gadget configuration
mkdir /config/usb_gadget/g1/functions/ffs.test
rm /config/usb_gadget/g1/configs/b.1/f1
ln -s /config/usb_gadget/g1/functions/ffs.test /config/usb_gadget/g1/configs/b.1/f1

#Create ffs test and mount it, then  /dev/usb-ffs/test/ep0 will be created
mkdir -p /dev/usb-ffs/test
mount -o rmode=0770,fmode=0660,uid=1024,gid=1024 -t functionfs test /dev/usb-ffs/test
```

4. Запустите aio_simple либо aio_multibuff на тестовой платформе. После успешного запуска в /dev/usb-ffs/test видны ep0/ep1/ep2.

```text
./aio_simple /dev/usb-ffs/test &
./aio_multibuff /dev/usb-ffs/test &
```

5. Включите USB-контроллер:

```text
echo fe800000.dwc3 >/config/usb_gadget/g1/UDC
```

6. Подключите USB к ПК Ubuntu и выполните lsusb. Запись «1d6b:0105 Linux Foundation FunctionFS Gadget» означает успешное перечисление FFS Gadget.

7. Запустите хост-приложение test на ПК Ubuntu. Оно через libusb ищет USB-устройство 1d6b:0105 и выполняет тест передачи.

## 7. Поддержка USB 3.0

Без изменения примеры FFS из kernel tools поддерживают максимум USB 2.0. Для USB 3.0 примените следующий патч; порядок испытания тот же, что для USB 2.0.

```text
diff --git a/tools/usb/ffs-aio-example/multibuff/device_app/aio_multibuff.c b/tools/usb/ffs-aio-example/multibuff/device_app/aio_multibuff.c
index aaca1f4..e0bf98c 100644
--- a/tools/usb/ffs-aio-example/multibuff/device_app/aio_multibuff.c
+++ b/tools/usb/ffs-aio-example/multibuff/device_app/aio_multibuff.c
@@ -57,16 +57,30 @@ static const struct {
        struct usb_functionfs_descs_head_v2 header;
        __le32 fs_count;
        __le32 hs_count;
+       __le32 ss_count;
+       __le32 os_count;
        struct {
                struct usb_interface_descriptor intf;
                struct usb_endpoint_descriptor_no_audio bulk_sink;
                struct usb_endpoint_descriptor_no_audio bulk_source;
        } __attribute__ ((__packed__)) fs_descs, hs_descs;
+       struct {
+               struct usb_interface_descriptor intf;
+               struct usb_endpoint_descriptor_no_audio sink;
+               struct usb_ss_ep_comp_descriptor sink_comp;
+               struct usb_endpoint_descriptor_no_audio source;
+               struct usb_ss_ep_comp_descriptor source_comp;
+       } __attribute__ ((__packed__)) ss_descs;
+       struct usb_os_desc_header os_header;
+       struct usb_ext_compat_desc os_desc;
+
 } __attribute__ ((__packed__)) descriptors = {
        .header = {
                .magic = htole32(FUNCTIONFS_DESCRIPTORS_MAGIC_V2),
                .flags = htole32(FUNCTIONFS_HAS_FS_DESC |
-                                    FUNCTIONFS_HAS_HS_DESC),
+                                FUNCTIONFS_HAS_HS_DESC |
+                                FUNCTIONFS_HAS_SS_DESC |
+                                FUNCTIONFS_HAS_MS_OS_DESC),
                .length = htole32(sizeof(descriptors)),
        },
        .fs_count = htole32(3),
@@ -115,6 +129,57 @@ static const struct {
                        .wMaxPacketSize = htole16(512),
                },
        },
+       .ss_count = htole32(5),
+       .ss_descs = {
+               .intf = {
+                       .bLength = sizeof(descriptors.ss_descs.intf),
+                       .bDescriptorType = USB_DT_INTERFACE,
+                       .bInterfaceNumber = 0,
+                       .bNumEndpoints = 2,
+                       .bInterfaceClass = USB_CLASS_VENDOR_SPEC,
+                       .iInterface = 1,
+               },
+               .sink = {
+                       .bLength = sizeof(descriptors.ss_descs.sink),
+                       .bDescriptorType = USB_DT_ENDPOINT,
+                       .bEndpointAddress = 1 | USB_DIR_IN,
+                       .bmAttributes = USB_ENDPOINT_XFER_BULK,
+                       .wMaxPacketSize = htole16(1024),
+               },
+               .sink_comp = {
+                       .bLength = sizeof(descriptors.ss_descs.sink_comp),
+                       .bDescriptorType = USB_DT_SS_ENDPOINT_COMP,
+                       .bMaxBurst = 4,
+               },
+               .source = {
+                       .bLength = sizeof(descriptors.ss_descs.source),
+                       .bDescriptorType = USB_DT_ENDPOINT,
+                       .bEndpointAddress = 2 | USB_DIR_OUT,
+                       .bmAttributes = USB_ENDPOINT_XFER_BULK,
+                       .wMaxPacketSize = htole16(1024),
+               },
+               .source_comp = {
+                       .bLength = sizeof(descriptors.ss_descs.source_comp),
+                       .bDescriptorType = USB_DT_SS_ENDPOINT_COMP,
+                       .bMaxBurst = 4,
+               },
+       },
+       .os_count = htole32(1),
+       .os_header = {
+               .interface = htole32(1),
+               .dwLength = htole32(sizeof(descriptors.os_header) + sizeof(descriptors.os_desc)),
+               .bcdVersion = htole32(1),
+               .wIndex = htole32(4),
+               .bCount = htole32(1),
+               .Reserved = htole32(0),
+       },
+       .os_desc = {
+               .bFirstInterfaceNumber = 0,
+               .Reserved1 = htole32(1),
+               .CompatibleID = {0},
+               .SubCompatibleID = {0},
+               .Reserved2 = {0},
+       },
 };

 #define STR_INTERFACE "AIO Test"
diff --git a/tools/usb/ffs-aio-example/simple/device_app/aio_simple.c b/tools/usb/ffs-aio-example/simple/device_app/aio_simple.c
index 1f44a29..3dab7f1 100644
--- a/tools/usb/ffs-aio-example/simple/device_app/aio_simple.c
+++ b/tools/usb/ffs-aio-example/simple/device_app/aio_simple.c
@@ -55,16 +55,30 @@ static const struct {
        struct usb_functionfs_descs_head_v2 header;
        __le32 fs_count;
        __le32 hs_count;
+       __le32 ss_count;
+       __le32 os_count;
        struct {
                struct usb_interface_descriptor intf;
                struct usb_endpoint_descriptor_no_audio bulk_sink;
                struct usb_endpoint_descriptor_no_audio bulk_source;
        } __attribute__ ((__packed__)) fs_descs, hs_descs;
+       struct {
+               struct usb_interface_descriptor intf;
+               struct usb_endpoint_descriptor_no_audio sink;
+               struct usb_ss_ep_comp_descriptor sink_comp;
+               struct usb_endpoint_descriptor_no_audio source;
+               struct usb_ss_ep_comp_descriptor source_comp;
+       } __attribute__ ((__packed__)) ss_descs;
+       struct usb_os_desc_header os_header;
+       struct usb_ext_compat_desc os_desc;
+
 } __attribute__ ((__packed__)) descriptors = {
        .header = {
                .magic = htole32(FUNCTIONFS_DESCRIPTORS_MAGIC_V2),
                .flags = htole32(FUNCTIONFS_HAS_FS_DESC |
-                                    FUNCTIONFS_HAS_HS_DESC),
+                                FUNCTIONFS_HAS_HS_DESC |
+                                FUNCTIONFS_HAS_SS_DESC |
+                                FUNCTIONFS_HAS_MS_OS_DESC),
                .length = htole32(sizeof(descriptors)),
        },
        .fs_count = htole32(3),
@@ -113,6 +127,57 @@ static const struct {
                        .wMaxPacketSize = htole16(512),
                },
        },
+       .ss_count = htole32(5),
+       .ss_descs = {
+               .intf = {
+                       .bLength = sizeof(descriptors.ss_descs.intf),
+                       .bDescriptorType = USB_DT_INTERFACE,
+                       .bInterfaceNumber = 0,
+                       .bNumEndpoints = 2,
+                       .bInterfaceClass = USB_CLASS_VENDOR_SPEC,
+                       .iInterface = 1,
+               },
+               .sink = {
+                       .bLength = sizeof(descriptors.ss_descs.sink),
+                       .bDescriptorType = USB_DT_ENDPOINT,
+                       .bEndpointAddress = 1 | USB_DIR_IN,
+                       .bmAttributes = USB_ENDPOINT_XFER_BULK,
+                       .wMaxPacketSize = htole16(1024),
+               },
+               .sink_comp = {
+                       .bLength = sizeof(descriptors.ss_descs.sink_comp),
+                       .bDescriptorType = USB_DT_SS_ENDPOINT_COMP,
+                       .bMaxBurst = 4,
+               },
+               .source = {
+                       .bLength = sizeof(descriptors.ss_descs.source),
+                       .bDescriptorType = USB_DT_ENDPOINT,
+                       .bEndpointAddress = 2 | USB_DIR_OUT,
+                       .bmAttributes = USB_ENDPOINT_XFER_BULK,
+                       .wMaxPacketSize = htole16(1024),
+               },
+               .source_comp = {
+                       .bLength = sizeof(descriptors.ss_descs.source_comp),
+                       .bDescriptorType = USB_DT_SS_ENDPOINT_COMP,
+                       .bMaxBurst = 4,
+               },
+       },
+       .os_count = htole32(1),
+       .os_header = {
+               .interface = htole32(1),
+               .dwLength = htole32(sizeof(descriptors.os_header) + sizeof(descriptors.os_desc)),
+               .bcdVersion = htole32(1),
+               .wIndex = htole32(4),
+               .bCount = htole32(1),
+               .Reserved = htole32(0),
+       },
+       .os_desc = {
+               .bFirstInterfaceNumber = 0,
+               .Reserved1 = htole32(1),
+               .CompatibleID = {0},
+               .SubCompatibleID = {0},
+               .Reserved2 = {0},
+       },
 };

 #define STR_INTERFACE "AIO Test"
```

{% endraw %}
