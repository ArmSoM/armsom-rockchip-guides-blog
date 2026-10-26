---
title: "Rockchip USB FunctionFS AIO Demo: Build, Gadget Setup and USB 3.0 Patch"
description: "Rockchip USB FunctionFS AIO Demo: Build, Gadget Setup and USB 3.0 Patch — V1.2.2"
excerpt: "Rockchip USB FunctionFS AIO Demo: Build, Gadget Setup and USB 3.0 Patch"
translation_key: "162-rockchip-usb-ffs-demo"
slug: "162-rockchip-usb-ffs-demo"
lang: "en"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, FunctionFS, Linux]
---

{% raw %}

# Rockchip USB FunctionFS AIO Demo: Build, Gadget Setup and USB 3.0 Patch

ArmSoM platform reference from Chinese source RK-KF-YF-464 V1.2.2 for Linux 4.4/4.19, listing RK3399, RK3368, RK3366, RK3328, RK3288, RK312X, RK3188, RK30XX, RK3308, RK3326 and PX30. Verify the specific ArmSoM board, BSP, USB-controller name and dependencies; the RK3399 Excavator example is not universal. No English PDF or independent figures were supplied. All four languages retain the complete patches. No example was executed or hardware tested.

Source caveats and prerequisites: `../..toolchain` in CROSS_COMPILE is retained and must be checked against the actual directory. Verify patch field widths, htole32 choices and context against the actual headers/SDK; no guessed correction is made. Gadget configuration changes the active setup and removes f1; understand the existing device configuration before use. Nothing was executed. Makefile path labels are separated from file contents and recipe indentation restored as tabs.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Test-demo source code

1. Simple-Demo: `kernel/tools/usb/ffs-aio-example/simple`

2. Multibuf-Demo: `kernel/tools/usb/ffs-aio-example/multibuff`

The two demos illustrate the FunctionFS asynchronous I/O API. Simple-Demo provides simple bidirectional transfer; Multibuf-Demo uses multiple buffers for potential high-performance applications. Both include userspace device and host applications. The device requires libaio and the host requires libusb. The unmodified examples support USB2.0 only.

## 2. Toolchain download (ARCH=arm64)

`ssh://wulf@10.10.10.29:29418/rk/prebuilts/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu`

Replace “wulf” with your own Gerrit username. This is the source’s private-network example, not a public download; access requires the corresponding authorized network/account.

## 3. Libaio download

[libaio](https://pagure.io/libaio.git)

## 4. Build the Libaio library

Enter libaio/src and modify “CC” and “AR” in Makefile.

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

Then run make:

```text
make ARCH=arm64  CROSS_COMPILE=../..toolchain/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-
```

Outputs: static library `libaio.a` and shared library `libaio.so.1.0.1`. The source recommends building the FFS demo with the static library libaio.a.

## 5. Build the test demos

### 5.1 Build Device_app

1. Copy libaio/src/libaio.h to kernel/tools/include/tools/.

2. Copy libaio.a to both kernel/tools/usb/ffs-aio-example/multibuff/device_app/. and kernel/tools/usb/ffs-aio-example/simple/device_app/.

3. Change the included header in aio_multibuff.c and aio_simple.c.

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

4. Add a Makefile that searches the current directory for libaio.a.

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

5. Run make:

```text
make ARCH=arm64 CROSS_COMPILE=../../../../../../toolchain/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-
```

Run the command separately in ffs-aio-example/simple/device_app and ffs-aio-example/multibuff/device_app. Successful builds produce the ARM64 executables aio_simple and aio_multibuff.

### 5.2 Build Host_app

Host_app runs on an Ubuntu PC. No source changes are required: run make in kernel/tools/usb/ffs-aio-example/simple/host_app and kernel/tools/usb/ffs-aio-example/multibuff/host_app to obtain the executable test.

## 6. Test procedure

1. Copy the built Device-app executables aio_simple and aio_multibuff to /data/. on the test platform and grant execute permissions.

2. Disconnect USB between the test platform and PC.

3. Configure Configfs and the Function FS Gadget.

### 1.1 General configuration method

For an RK Android platform, use “1.2 Configuration on the RK3399 Android Excavator platform” instead. The scripts below refer to init.rk30board.usb.rc and init.usb.configfs.rc.

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

### 1.2 Configuration on the RK3399 Android Excavator platform

Android usb init has already created Configfs and completed part of its configuration, so only the following steps are needed.

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

4. Run aio_simple or aio_multibuff on the test platform. After a successful start, ep0/ep1/ep2 are visible under /dev/usb-ffs/test.

```text
./aio_simple /dev/usb-ffs/test &
./aio_multibuff /dev/usb-ffs/test &
```

5. Enable the USB controller:

```text
echo fe800000.dwc3 >/config/usb_gadget/g1/UDC
```

6. Connect USB to an Ubuntu PC and run lsusb. The entry “1d6b:0105 Linux Foundation FunctionFS Gadget” indicates successful FFS Gadget enumeration.

7. Run the host application test on the Ubuntu PC. It uses libusb to find USB device ID 1d6b:0105 and perform the transfer test.

## 7. Add USB 3.0 support

The kernel tools FFS demos support at most USB 2.0 without modification. Apply the following source patch to add USB 3.0 support; the test procedure is the same as for USB 2.0.

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
