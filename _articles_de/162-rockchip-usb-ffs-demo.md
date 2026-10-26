---
title: "Rockchip USB FunctionFS AIO: Build, Gadget-Konfiguration und USB-3.0-Patch"
description: "Rockchip USB FunctionFS AIO: Build, Gadget-Konfiguration und USB-3.0-Patch — V1.2.2"
excerpt: "Rockchip USB FunctionFS AIO: Build, Gadget-Konfiguration und USB-3.0-Patch"
translation_key: "162-rockchip-usb-ffs-demo"
slug: "162-rockchip-usb-ffs-demo"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, FunctionFS, Linux]
---

{% raw %}

# Rockchip USB FunctionFS AIO: Build, Gadget-Konfiguration und USB-3.0-Patch

ArmSoM-Plattformreferenz nach der chinesischen Quelle RK-KF-YF-464 V1.2.2 für Linux 4.4/4.19: RK3399, RK3368, RK3366, RK3328, RK3288, RK312X, RK3188, RK30XX, RK3308, RK3326 und PX30. Konkrete ArmSoM-Platine, BSP, USB-Controllername und Abhängigkeiten prüfen; RK3399 Excavator ist kein allgemeingültiges Beispiel. Kein englisches PDF oder eigenständige Abbildungen vorhanden. Alle vier Sprachen behalten die vollständigen Patches bei. Keine Befehle ausgeführt und keine Hardware getestet.

Quellenhinweise: `../..toolchain` in CROSS_COMPILE bleibt erhalten und ist mit dem tatsächlichen Verzeichnis abzugleichen. Feldbreiten, htole32-Auswahl und Patchkontext anhand der Header/des SDK prüfen; keine geratenen Korrekturen. Die Konfiguration verändert Gadget und entfernt f1; vorher die bestehende Gerätekonfiguration verstehen. Nichts wurde ausgeführt. Makefile-Pfadbezeichnungen stehen getrennt vom Inhalt; Rezept-Einrückungen wurden als Tabs wiederhergestellt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Quellcode der Test-Demos

1. Simple-Demo: `kernel/tools/usb/ffs-aio-example/simple`

2. Multibuf-Demo: `kernel/tools/usb/ffs-aio-example/multibuff`

Beide Demos zeigen die asynchrone I/O-API von FunctionFS. Simple-Demo bietet einfache bidirektionale Übertragung; Multibuf-Demo verwendet mehrere Puffer für mögliche Hochleistungsanwendungen. Beide enthalten Userspace-Anwendungen für Gerät und Host. Das Gerät benötigt libaio, der Host libusb. Unverändert unterstützen sie nur USB2.0.

## 2. Toolchain-Download (ARCH=arm64)

`ssh://wulf@10.10.10.29:29418/rk/prebuilts/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu`

„wulf“ durch den eigenen Gerrit-Benutzernamen ersetzen. Dies ist das private Netzwerkbeispiel der Quelle, kein öffentlicher Download; Zugriff erfordert das entsprechende autorisierte Netz/Konto.

## 3. Libaio-Download

[libaio](https://pagure.io/libaio.git)

## 4. Libaio-Bibliothek bauen

In libaio/src wechseln und „CC“ sowie „AR“ im Makefile ändern.

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

Anschließend make ausführen:

```text
make ARCH=arm64  CROSS_COMPILE=../..toolchain/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-
```

Ausgaben: statische Bibliothek `libaio.a` und dynamische Bibliothek `libaio.so.1.0.1`. Die Quelle empfiehlt die statische libaio.a für das FFS-Demo.

## 5. Test-Demos bauen

### 5.1 Device_app bauen

1. libaio/src/libaio.h nach kernel/tools/include/tools/ kopieren.

2. libaio.a sowohl nach kernel/tools/usb/ffs-aio-example/multibuff/device_app/. als auch nach kernel/tools/usb/ffs-aio-example/simple/device_app/. kopieren.

3. Den eingebundenen Header in aio_multibuff.c und aio_simple.c ändern.

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

4. Ein Makefile hinzufügen, das libaio.a im aktuellen Verzeichnis sucht.

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

5. make ausführen:

```text
make ARCH=arm64 CROSS_COMPILE=../../../../../../toolchain/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-
```

Den Befehl getrennt in ffs-aio-example/simple/device_app und ffs-aio-example/multibuff/device_app ausführen. Erfolgreiche Builds erzeugen die ARM64-Programme aio_simple und aio_multibuff.

### 5.2 Host_app bauen

Host_app läuft auf einem Ubuntu-PC. Quellcodeänderungen sind nicht nötig: make in kernel/tools/usb/ffs-aio-example/simple/host_app und kernel/tools/usb/ffs-aio-example/multibuff/host_app erzeugt das Programm test.

## 6. Testablauf

1. Die gebauten Device-app-Programme aio_simple und aio_multibuff nach /data/. der Testplattform kopieren und ausführbar machen.

2. USB-Verbindung zwischen Testplattform und PC trennen.

3. Configfs und Function FS Gadget konfigurieren.

### 1.1 Allgemeine Konfiguration

Für eine RK-Android-Plattform stattdessen „1.2 Konfiguration auf RK3399 Android Excavator“ verwenden. Die folgenden Skripte beziehen sich auf init.rk30board.usb.rc und init.usb.configfs.rc.

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

### 1.2 Konfiguration auf RK3399 Android Excavator

Android usb init hat Configfs bereits angelegt und teilweise konfiguriert; daher sind nur die folgenden Schritte nötig.

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

4. aio_simple oder aio_multibuff auf der Testplattform starten. Nach erfolgreichem Start sind ep0/ep1/ep2 unter /dev/usb-ffs/test sichtbar.

```text
./aio_simple /dev/usb-ffs/test &
./aio_multibuff /dev/usb-ffs/test &
```

5. USB-Controller aktivieren:

```text
echo fe800000.dwc3 >/config/usb_gadget/g1/UDC
```

6. USB an einen Ubuntu-PC anschließen und lsusb ausführen. „1d6b:0105 Linux Foundation FunctionFS Gadget“ zeigt die erfolgreiche FFS-Gadget-Enumeration.

7. Die Hostanwendung test auf dem Ubuntu-PC starten. Sie sucht mit libusb nach USB-Gerät 1d6b:0105 und führt den Übertragungstest aus.

## 7. USB-3.0-Unterstützung ergänzen

Die FFS-Demos aus kernel tools unterstützen unverändert höchstens USB 2.0. Der folgende Quellpatch ergänzt USB 3.0; der Testablauf entspricht USB 2.0.

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
