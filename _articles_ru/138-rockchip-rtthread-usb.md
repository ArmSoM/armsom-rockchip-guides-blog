---
title: "Rockchip RT-Thread USB: руководство разработчика"
description: "Rockchip RT-Thread USB: руководство разработчика — V1.3.0"
excerpt: "Rockchip RT-Thread USB: руководство разработчика — V1.3.0"
translation_key: "138-rockchip-rtthread-usb"
slug: "138-rockchip-rtthread-usb"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "USB", "RT-Thread"]
---

{% raw %}

Справочник платформы Rockchip для RK RT-Thread SDK, чипов, перечисленных в оригинале, включая RK2108/RK2118. Поддержка конкретных плат ArmSoM не подтверждена, аппаратная проверка не проводилась. До адаптации проверьте SoC, SDK/BSP, версию RT-Thread, контроллер, IOMUX, проводку и напряжения. Команды и результаты — примеры оригинала, не измерения ArmSoM; аппаратные операции и доступ к flash не выполнялись. Есть только китайский оригинал; все четыре языка используют его рисунки.

RK-KF-YF-106 · V1.3.0

| SoC | RT-Thread |
| --- | --- |
| RK2108 / RK625 / RK1808 / RK3308 / RK3358 / RK3568 | 3.1.x+ |
| RK2118 / RK3506 | 4.1.x |

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

<!-- cn PDF p.5 -->

## 1. USB микроконтроллеров Rockchip

<!-- cn PDF p.5 -->

Поддерживаются High-Speed с совместимостью Full-Speed/Low-Speed, DMA контроллера, Device или OTG согласно документации чипа. Таблица 1: USB MCU.

<!-- cn PDF p.5 -->

| Chip | Controller | Mode | Rate | Transfer |
| --- | --- | --- | --- | --- |
| RK2108 | DWC2 | Device only | HS/FS; no LS | DMA |
| RK2118 | DWC2 | OTG (Device/Host) | Device HS/FS; Host HS/FS/LS | DMA |
| RK625 | DWC2 | OTG (Device/Host) | Device HS/FS; Host HS/FS/LS | DMA |

<!-- cn PDF p.5 -->

Примечание:

<!-- cn PDF p.5 -->

1. Переключение Device/Host пока только статическим выбором menuconfig.

<!-- cn PDF p.5 -->

2. Device по умолчанию High-Speed; ограничение Full-Speed см. в настройке скорости.

<!-- cn PDF p.5 -->

3. AP-чипы RK3308/RK3568: Rockchip_Developer_Guide_USB_CN.

<!-- cn PDF p.5 -->

## 2. Разработка ПО

<!-- cn PDF p.5 -->

### 2.1 Пути USB-исходников

<!-- cn PDF p.5 -->

USB-компонент rt-thread/components/drivers/usb абстрагирует стек USB2.0 и поддерживает Host/Device. Интерфейсы переноса позволяют подключить HCD (Host Controller Driver) и PCD (Peripheral Controller Driver) BSP производителя напрямую к RT-Thread. Пути:

<!-- cn PDF p.5 -->

```text
components/drivers/usb/usbdevice/core  /* USB Device 核心代码，实现 Device 协议栈 */
components/drivers/usb/usbdevice/class /* USB Device 设备类驱动 */
components/drivers/usb/usbhost/core    /* USB Host 核心代码，实现 Host 协议栈 */
components/drivers/usb/usbhost/class   /* USB Host 设备类驱动 */
```

<!-- cn PDF p.5 -->

Пути слоя адаптации USB, RT-Thread v3.1.x:

<!-- cn PDF p.6 -->

```text
bsp/rockchip/common/drivers/drv_usbd.c    /* RT-Thread 与 HAL USB Device DWC2 控制 器驱动之间的适配层 */
bsp/rockchip/common/drivers/drv_usbh.c    /* RT-Thread 与 HAL USB Host DWC2 控制器 驱动之间的适配层 */
bsp/rockchip/common/drivers/drv_usbhost.c /* RT-Thread 与 HAL USB Host EHCI&OHCI 控制器驱动之间的适配层 */
```

<!-- cn PDF p.6 -->

RT-Thread v4.1.x:

<!-- cn PDF p.6 -->

```text
bsp/rockchip/common/drivers/drv_usbd.c    /* RT-Thread 与 HAL USB Device DWC2 控制 器驱动之间的适配层 */
bsp/rockchip/common/drivers/drv_usbotgh.c /* RT-Thread 与 HAL USB Host DWC2 控制器 驱动之间的适配层 */
bsp/rockchip/common/drivers/drv_usbhost.c /* RT-Thread 与 HAL USB Host EHCI&OHCI 控制器驱动之间的适配层 */
```

<!-- cn PDF p.6 -->

Поддерживаемые USB Device классы:

<!-- cn PDF p.6 -->

1. CDC-ACM (Communication Device Class — Abstract Control Model), виртуальный COM-порт.

<!-- cn PDF p.6 -->

2. CDC-ECM (Communication Device Class — Ethernet Networking Control Model), USB Ethernet.

<!-- cn PDF p.6 -->

3. HID (Human Interface Device): Keyboard/Mouse/General HID/Mediakeyboard.

<!-- cn PDF p.6 -->

4. MStorage (Mass Storage).

<!-- cn PDF p.6 -->

5. RNDIS (Remote Network Driver Interface Specification).

<!-- cn PDF p.6 -->

6. WINUSB (Windows USB), универсальный USB Microsoft.

Классы USB Host:

<!-- cn PDF p.6 -->

1. MStorage (Mass Storage).

<!-- cn PDF p.6 -->

2. HUB: базовый драйвер есть, функции отлаживаются.

<!-- cn PDF p.6 -->

3. HID: базовый драйвер есть, функции отлаживаются.

<!-- cn PDF p.6 -->

### 2.2 Архитектура USB

<!-- cn PDF p.6 -->

Основа — модель I/O RT-Thread. Сверху вниз: управление I/O, USB RTT, адаптер RTT/HAL, HAL-драйвер контроллера USB.

<!-- cn PDF p.7 -->

![Рисунок китайского оригинала (p.7)](/docs/rockchip-rtthread-usb/assets/cn-p007-figure-01.png)

*Рисунок китайского оригинала (p.7)*

<!-- cn PDF p.7 -->

Рисунок 1. Приложения обращаются к классовым драйверам через I/O-управление и обмениваются данными/управлением с контроллером. Управление I/O оборачивает драйверы стандартными интерфейсами. RTT USB реализует стеки Host/Device и классы; классы используют USB Core, стек — адаптер. Адаптер задаёт аппаратные данные Rockchip, инициализирует через HAL и оборачивает HAL в функции RTT. HAL реализует низкоуровневое чтение/запись и пригоден для разных RTOS. Источник также ссылается на обзор форума RT-Thread “USB组件之USB device框架简单概览”.

<!-- cn PDF p.7 -->

### 2.3 Настройка USB

<!-- cn PDF p.7 -->

#### 2.3.1 Настройка USB Device

<!-- cn PDF p.7 -->

Device может иметь один интерфейс или несколько как Composite Device. Включение: RT_USB_DEVICE_COMPOSITE.

<!-- cn PDF p.8 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            [ ] Using USB host
            [*] Using USB device
            (4096) usb thread stack size
            (0x2207) USB Vendor ID
            (0x0007) USB Product ID
            [ ]   Enable composite device
                    Device type (Using custom class by register interface)  --->
```

<!-- cn PDF p.8 -->

Примечание:

<!-- cn PDF p.8 -->

1. Источник определяет 0x2207 как уникальный VID Rockchip USB-IF, не передаваемый другому производителю. Только разработка/отладка; для сертификации продукта требуется собственный VID через членство USB-IF.

<!-- cn PDF p.8 -->

2. Product ID 0x0007; меняйте в формате 0x00XX, старший байт нулевой против конфликтов Maskrom/Loader.

<!-- cn PDF p.8 -->

3. Выберите CDC/MSC/HID/WINUSB/UAC1.

<!-- cn PDF p.8 -->

4. Enable composite device для MSC + CDC-ACM и подобных; для одной функции не нужно.

<!-- cn PDF p.8 -->

5. Device преимущественно для MCU RK2108/RK2118/RK625.

<!-- cn PDF p.8 -->

#### 2.3.2 Настройка USB Host

<!-- cn PDF p.8 -->

Host пока поддерживает Mass Storage; HUB/HID разрабатываются. Настройка Mass Storage:

<!-- cn PDF p.8 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            [*] Using USB host
            [*]   Enable Udisk Drivers
            (/)     Udisk mount dir
            [ ]   Enable HID Drivers
            [ ] Using USB device
            (4096) usb thread stack size
```

<!-- cn PDF p.8 -->

Настройка адаптера Host:

<!-- cn PDF p.8 -->

```text
RT-Thread rockchip common drivers  --->
    RT-Thread rockchip USB Host driver  --->
        [ ] DWC2 HCD Support
        [ ] EHCI HCD Support
        [ ] OHCI HCD Support
```

<!-- cn PDF p.8 -->

Примечание:

<!-- cn PDF p.8 -->

1. Host для MCU/AP. Выберите DWC2 либо EHCI + OHCI по контроллеру.

<!-- cn PDF p.9 -->

2. Ограничения адаптера запрещают одновременные Using USB host и Using USB device; это вызывает сбой.

<!-- cn PDF p.9 -->

### 2.4 Создание/регистрация USB Device

<!-- cn PDF p.9 -->

rt_device_register() регистрирует контроллер в I/O RT-Thread. Доступ имеют только классы HID/MStorage, не приложения напрямую. Классы могут регистрировать свои устройства; например components/drivers/usb/usbdevice/class/hid.c создаёт hidd через rt_device_register. Контроллер создаётся в адаптере bsp/rockchip/common/drivers/drv_usbd.c; последовательность на рисунке 2.

<!-- cn PDF p.9 -->

![Рисунок китайского оригинала (p.9)](/docs/rockchip-rtthread-usb/assets/cn-p009-figure-01.png)

*Рисунок китайского оригинала (p.9)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

```text
rt_device_register("usbd")
rt_usb_device_init()
  rt_usbd_core_init() -> USB message queue / USB device thread
  rt_usbd_device_new() -> udevice / cfg_list
  rt_device_find("usbd")
  rt_usbd_device_set_controller()
  rt_usbd_config_new()
  rt_usbd_function_create() -> Uclass from class_list (hid_class)
  rt_usbd_config_add_function()
  rt_usbd_device_set_descriptor()
  rt_usbd_device_add_config() -> udevice->cfg_list
rt_device_init()
usb_pcd_init()
```

<!-- cn PDF p.9 -->

Рисунок 2. list_device показывает USB Device:

<!-- cn PDF p.10 -->

```text
msh />list_device
device           type         ref count
-------- -------------------- ----------
usbd     USB Slave Device     0
```

<!-- cn PDF p.10 -->

### 2.5 Создание/регистрация USB Host

<!-- cn PDF p.10 -->

Host регистрируется rt_device_register(). Поток USBHub следит за портами и перечисляет устройства при изменениях. Список классовых драйверов управляет ими. Адаптеры: DWC2/EHCI/OHCI, пути выше. Рисунок 3 — DWC2.

<!-- cn PDF p.10 -->

![Рисунок китайского оригинала (p.10)](/docs/rockchip-rtthread-usb/assets/cn-p010-figure-01.png)

*Рисунок китайского оригинала (p.10)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

```text
rt_device_register("usbh")
rt_usb_host_init()
  rt_usbh_hub_init()
  rt_usbh_class_driver_init()
  drv = rt_usbh_class_driver_storage()
  rt_usbh_class_driver_register()
rt_device_init()
usb_hcd_init()
```

<!-- cn PDF p.10 -->

Рисунок 3. EHCI/OHCI используют bsp/rockchip/common/drivers/drv_usbhost.c с аналогичной последовательностью. list_device показывает Host:

<!-- cn PDF p.11 -->

```text
msh />list_device
device           type         ref count
-------- -------------------- ----------
usbh     USB Host Bus         0
```

<!-- cn PDF p.11 -->

### 2.6 Примеры USB Device

<!-- cn PDF p.11 -->

#### 2.6.1 Интерфейсы управления устройством

<!-- cn PDF p.11 -->

Приложения обращаются к USB через I/O API RT-Thread (таблица 2):

<!-- cn PDF p.11 -->

| Функция | Описание |
| --- | --- |
| rt_device_find() | Найти USB |
| rt_device_open() | Открыть USB |
| rt_device_read() | Читать USB |
| rt_device_write() | Записать USB |
| rt_device_control() | Управлять USB |

<!-- cn PDF p.11 -->

#### 2.6.2 Пример HID

<!-- cn PDF p.11 -->

HID поддерживает Keyboard, Mouse, General HID, mediakeyboard. Выберите нужное. Пример RK2108 USB HID Keyboard: scons --menuconfig, выбрать HID.

<!-- cn PDF p.11 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            [ ] Using USB host
            [*] Using USB device
            (4096) usb thread stack size
            (0x2207) USB Vendor ID
            (0x0007) USB Product ID
            [ ]   Enable composite device
                Device type (Enable to use device as HID device)  --->
            [*]   Use to HID device as Keyboard
            (1)     Number of Keyboard(max 3)
            [ ]   Use to HID device as Mouse
            [ ]   Use to HID device as General HID device
            [ ]   Use to HID device as media keyboard
```

<!-- cn PDF p.12 -->

list_device показывает символьное HID:

<!-- cn PDF p.12 -->

```text
msh />list_device
device           type         ref count
-------- -------------------- ----------
hidd     Character Device     0
```

<!-- cn PDF p.12 -->

Создание/регистрация HID:

<!-- cn PDF p.12 -->

![Рисунок китайского оригинала (p.12)](/docs/rockchip-rtthread-usb/assets/cn-p012-figure-01.png)

*Рисунок китайского оригинала (p.12)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

```text
rt_usbd_class_register(hid_class)
rt_device_register("usbd")
rt_usb_device_init()
rt_usbd_function_create() -> rt_usbd_function_hid_create()
rt_usbd_function_new()
rt_usbd_interface_new()
rt_usbd_endpoint_new()
rt_device_register("hidg")
rt_usbd_config_add_function()
rt_usbd_device_set_descriptor()
rt_usbd_device_add_config()
rt_device_init()
usb_pcd_init()
```

<!-- cn PDF p.12 -->

Рисунок 4. Доступ приложения к HID:

<!-- cn PDF p.13 -->

![Рисунок китайского оригинала (p.13)](/docs/rockchip-rtthread-usb/assets/cn-p013-figure-01.png)

*Рисунок китайского оригинала (p.13)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

```text
rt_device_find("hidd") -> rt_device_open()
function_enable -> rt_usbd_io_request()
rt_usbd_ep_read_prepare() -> usb_ep_read_prepare()
rt_usbd_ep_out_handler() -> rt_usbd_event_signal() -> usbd_thread
_data_notify() -> _ep_out_handler() -> hid_mq -> hid_thread -> HID_Report_Received()
rt_device_Read -> _hid_read()
rt_device_write -> _hid_write() -> rt_usbd_io_request()
rt_usbd_ep_write() -> usb_ep_write()
```

<!-- cn PDF p.13 -->

Рисунок 5. Примеры: USB-мышь RT-Thread/IoT_Board; RK2108 HID RT-Thread. Оптимизация: дескриптор отчёта и FIFO INT ограничивают обычную передачу 64 bytes, снижая скорость. Настройте FIFO для 1024 bytes за передачу, пример RK2108 ниже.

<!-- cn PDF p.13 -->

```text
diff --git a/bsp/rockchip/rk2108/board/common/board_base.c b/bsp/rockchip/rk2108/board/common/board_base.c
index 79cc20854..a494d7528 100644
--- a/bsp/rockchip/rk2108/board/common/board_base.c
+++ b/bsp/rockchip/rk2108/board/common/board_base.c
@@ -484,8 +484,8 @@ RT_WEAK struct ep_id g_usb_ep_pool[] =
     { 0x2,  USB_EP_ATTR_BULK,       USB_DIR_OUT,    512,  ID_UNASSIGNED },
     { 0x3,  USB_EP_ATTR_ISOC,       USB_DIR_IN,     1024, ID_UNASSIGNED },
     { 0x4,  USB_EP_ATTR_ISOC,       USB_DIR_OUT,    512,  ID_UNASSIGNED },
-    { 0x5,  USB_EP_ATTR_INT,        USB_DIR_IN,     64,   ID_UNASSIGNED },
-    { 0x6,  USB_EP_ATTR_INT,        USB_DIR_OUT,    64,   ID_UNASSIGNED },
+    { 0x5,  USB_EP_ATTR_INT,        USB_DIR_IN,     1024,   ID_UNASSIGNED },
+    { 0x6,  USB_EP_ATTR_INT,        USB_DIR_OUT,    1024,   ID_UNASSIGNED },
     { 0xFF, USB_EP_ATTR_TYPE_MASK,  USB_DIR_MASK,   0,    ID_ASSIGNED   },
 };
 #endif
diff --git a/components/drivers/include/drivers/usb_common.h b/components/drivers/include/drivers/usb_common.h
index d16b42ea7..2370cdc88 100644
--- a/components/drivers/include/drivers/usb_common.h
+++ b/components/drivers/include/drivers/usb_common.h
@@ -508,7 +508,7 @@ typedef struct uhid_descriptor* uhid_desc_t;
 struct hid_report
 {
     rt_uint8_t report_id;
-    rt_uint8_t report[63];
+    ALIGN(32) rt_uint8_t report[1024];
     rt_uint8_t size;
 };
 typedef struct hid_report* hid_report_t;
diff --git a/components/drivers/usb/usbdevice/class/hid.c b/components/drivers/usb/usbdevice/class/hid.c
index f0e75178b..fdb12001e 100644
--- a/components/drivers/usb/usbdevice/class/hid.c
+++ b/components/drivers/usb/usbdevice/class/hid.c
@@ -194,14 +194,14 @@ const rt_uint8_t _report_desc[]=
     COLLECTION(1),      0x01,
     REPORT_ID(1),       HID_REPORT_ID_GENERAL,

-    REPORT_COUNT(1),    RT_USB_DEVICE_HID_GENERAL_IN_REPORT_LENGTH,
+    REPORT_COUNT(2),    0xff, 0x03,
     USAGE(1),           0x03,
     REPORT_SIZE(1),     0x08,
     LOGICAL_MINIMUM(1), 0x00,
     LOGICAL_MAXIMUM(1), 0xFF,
     INPUT(1),           0x02,

-    REPORT_COUNT(1),    RT_USB_DEVICE_HID_GENERAL_OUT_REPORT_LENGTH,
+    REPORT_COUNT(2),    0xff, 0x03,
     USAGE(1),           0x04,
     REPORT_SIZE(1),     0x08,
     LOGICAL_MINIMUM(1), 0x00,
@@ -347,7 +347,7 @@ const static struct uhid_comm_descriptor _hid_comm_desc =
         USB_DESC_TYPE_ENDPOINT,
         USB_DYNAMIC | USB_DIR_IN,
         USB_EP_ATTR_INT,
-        0x40,
+        1024,
         0x01,
     },

@@ -357,7 +357,7 @@ const static struct uhid_comm_descriptor _hid_comm_desc =
         USB_DESC_TYPE_ENDPOINT,
         USB_DYNAMIC | USB_DIR_OUT,
         USB_EP_ATTR_INT,
-        0x40,
+        1024,
         0x01,
     },
 };
@@ -607,7 +607,7 @@ static rt_size_t _hid_write(rt_device_t dev, rt_off_t pos, const void *buffer, r
         rt_memcpy((void *)report.report,(void *)buffer,size);
         report.size = size;
         hiddev->ep_in->request.buffer = (void *)&report;
-        hiddev->ep_in->request.size = (size+1) > 64 ? 64 : size+1;
+        hiddev->ep_in->request.size = (size+1) > MAX_REPORT_SIZE ? MAX_REPORT_SIZE : size+1;
         hiddev->ep_in->request.req_type = UIO_REQUEST_WRITE;
         rt_usbd_io_request(hiddev->func->device, hiddev->ep_in, &hiddev->ep_in->request);
         return size;
diff --git a/components/drivers/usb/usbdevice/class/hid.h b/components/drivers/usb/usbdevice/class/hid.h
index 4d0f314a1..ea9938220 100644
--- a/components/drivers/usb/usbdevice/class/hid.h
+++ b/components/drivers/usb/usbdevice/class/hid.h
@@ -34,8 +34,8 @@ extern "C" {
 #define USB_HID_REQ_SET_IDLE        0x0a
 #define USB_HID_REQ_SET_PROTOCOL    0x0b

-#define MAX_REPORT_SIZE             64
-#define HID_RX_BUFSIZE              64
+#define MAX_REPORT_SIZE             1024
+#define HID_RX_BUFSIZE              1024

 /* HID Report Types */
 #define HID_REPORT_INPUT            0x01
```

<!-- cn PDF p.15 -->

#### 2.6.3 Пример ADB

<!-- cn PDF p.15 -->

RT-Thread предоставляет ADBD (Android Debug Bridge daemon) для файлов/оболочки через USB/TCPIP. USB ADB использует WINUSB; ADBD работает с /dev/winusb. Документация: https://packages.rt-thread.org/detail.html?package=adbd ; исходники: https://github.com/heyuanjie87/adbd .
Выберите custom class: WINUSB реализован в packages/adbd-latest/core/adbusb.c. Рекомендуемый Product ID 0x0006 совпадает с Rockchip AP ADB и позволяет избежать ручной установки PC-драйвера.

<!-- cn PDF p.16 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            -*- Using USB device
            (4096) usb thread stack size
            (0x2207) USB Vendor ID
            (0x0006) USB Product ID
            [ ]   Enable composite device
                  Device type (Using custom class by register interface)  --->
                      (X) Using custom class by register interface
```

<!-- cn PDF p.16 -->

Настройте online packages ADBD:

<!-- cn PDF p.16 -->

```text
[*] Enable RT-Thread online packages  --->
    RT-Thread online packages  --->
        tools packages  --->
            [*] ADBD: Android Debug Bridge daemon implementation in RT-Thread  --
->
                [ ]   Using TCPIP transfer
                [*]   Using USB transfer
                (1280) Set transfer thread stack size
                [*]   Enable Shell service
                [*]   Enable File service
                (2304)  Set file service thread stack size
                (2000)  Set file service receive timeout(ms)
                [ ]   Enable external MOD
                [ ]   Enable ADB service discover
                      Version (latest)  --->
```

<!-- cn PDF p.16 -->

Отключите Using TCPIP transfer, иначе ADBD выбирает TCPIP вместо USB. Настройте POSIX:

<!-- cn PDF p.16 -->

```text
RT_USING_LEGACY [=y]
RT_USING_DFS [=y]
DFS_USING_POSIX [=y]
RT_USING_POSIX_FS [=y]
RT_USING_POSIX_DEVIO [=y]
RT_USING_POSIX_STDIO [=y]
RT_USING_POSIX_POLL [=y]
RT_USING_POSIX_SELECT [=y]
RT_USING_POSIX_SOCKET [=y]
```

<!-- cn PDF p.16 -->

Настройте ФС для ADB push/pull по разделу автомонтирования MSC. Сохраните, выйдите и загрузите online packages ADBD.

<!-- cn PDF p.17 -->

Пример SDK RK2118:

<!-- cn PDF p.17 -->

```text
~/rt-thread/bsp/rockchip/rk2118$ source ~/.env/env.sh
~/rt-thread/bsp/rockchip/rk2118$ pkgs --update
[Use Gitee server - auto decision based on IP location]
Cloning into '/home/wlf/rt-thread/bsp/rockchip/rk2118/packages/adbd-latest'...
remote: Enumerating objects: 42, done.
remote: Counting objects: 100% (42/42), done.
remote: Compressing objects: 100% (39/39), done.
remote: Total 42 (delta 2), reused 37 (delta 2), pack-reused 0
Receiving objects: 100% (42/42), 10.13 MiB | 1.74 MiB/s, done.
Resolving deltas: 100% (2/2), done.
==============================>  ADBD latest is downloaded successfully.

/home/wlf/rt-thread/bsp/rockchip/rk2118/packages/adbd-latest
==============================>  adbd update done

Operation completed successfully.
```

<!-- cn PDF p.17 -->

Адаптируйте исходники ADBD для Rockchip:

<!-- cn PDF p.17 -->

```text
diff --git a/core/adbusb.c b/core/adbusb.c
index 29455d0..034e9bb 100644
--- a/core/adbusb.c
+++ b/core/adbusb.c
@@ -232,7 +232,7 @@ static rt_err_t _ep_out_handler(ufunction_t func, rt_size_t size)
 static rt_err_t _ep_in_handler(ufunction_t func, rt_size_t size)
 {
     winusb_device_t wd = (winusb_device_t)func->user_data;
-    wd->wrcnt -= size;
+    wd->wrcnt -= wd->ep_in->request.size;
     rt_wqueue_wakeup(&(wd->wq), (void *)POLLOUT);

     return RT_EOK;
@@ -284,13 +284,12 @@ static rt_err_t _interface_handler(ufunction_t func, ureq_t setup)
     return RT_EOK;
 }

-#ifdef RT_USING_POSIX
 static int _ep_alloc_request(uep_t ep)
 {
     int size;

     size = EP_MAXPACKET(ep);
-    ep->buffer = rt_malloc(size);
+    ep->buffer = rt_malloc_align(RT_ALIGN(size, USB_DMA_ALIGN_SIZE),
USB_DMA_ALIGN_SIZE);
     if (!ep->buffer)
         return -1;

@@ -300,7 +299,6 @@ static int _ep_alloc_request(uep_t ep)

     return 0;
 }
-#endif

 static rt_err_t _function_enable(ufunction_t func)
 {
@@ -316,7 +314,7 @@ static rt_err_t _function_enable(ufunction_t func)
         return -1;
     if (_ep_alloc_request(wd->ep_in) != 0)
     {
-        rt_free(wd->ep_out->buffer);
+        rt_free_align(wd->ep_out->buffer);
         return -1;
     }
     _readreq(func, wd);
@@ -331,8 +329,8 @@ static rt_err_t _function_disable(ufunction_t func)
     RT_ASSERT(func != RT_NULL);
     wd = func->user_data;

-    rt_free(wd->ep_out->buffer);
-    rt_free(wd->ep_in->buffer);
+    rt_free_align(wd->ep_out->buffer);
+    rt_free_align(wd->ep_in->buffer);
     wd->ep_out->buffer = 0;
     wd->ep_in->buffer = 0;

diff --git a/services/shell_service.c b/services/shell_service.c
index 6252942..80e6cb0 100644
--- a/services/shell_service.c
+++ b/services/shell_service.c
@@ -344,6 +344,7 @@ static bool send_ready(struct shell_ext *ext, char *args)

 extern int libc_stdio_set_console(const char* device_name, int mode);
 extern int libc_stdio_get_console(void);
+extern int ioctl(int fildes, int cmd, ...);

 static int _shell_open(struct adb_service *ser, char *args)
 {
```

<!-- cn PDF p.18 -->

Проверьте winusb и монтирование через list_device и mount.

<!-- cn PDF p.18 -->

```text
msh />list_device
device           type         ref count
-------- -------------------- ----------
winusb   Miscellaneous Device 0
usbd     USB Slave Device     0
root     Block Device         1
snor     MTD Device           0
fspi0    Character Device     0
i2c0     I2C Bus              0
pin      Pin Device           0
uart0    Character Device     2

msh />mount
filesystem  device  mountpoint
----------  ------  ----------
devfs       (NULL)  /dev
elm         root    /
```

<!-- cn PDF p.19 -->

PC-инструменты/драйверы в adbd-latest/tools. Поддерживаются adb push/pull и adb shell; вход в shell переключает консоль с UART на USB.

<!-- cn PDF p.19 -->

#### 2.6.4 Пример MSC

<!-- cn PDF p.19 -->

MSC (Mass Storage Class) представляет устройство как съёмный USB-диск ПК для файлов. Пример RK2108: scons --menuconfig, Mass Storage device.

<!-- cn PDF p.19 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            [*] Using USB device
            (4096) usb thread stack size
            (0x2207) USB Vendor ID
            (0x0007) USB Product ID
            [ ]   Enable composite device
                    Device type (Enable to use device as Mass Storage device)  --
->
            (root) msc class disk name
            (4096) msc buffer length
```

<!-- cn PDF p.19 -->

Примечание:

<!-- cn PDF p.19 -->

1. Вручную задайте msc class disk name = root.

<!-- cn PDF p.19 -->

2. Включите CONFIG_RT_USING_DFS_MNTTABLE.

<!-- cn PDF p.19 -->

3. Больший msc buffer length обычно ускоряет передачу; диапазон 512–65536. MSC зависит от таблицы автомонтирования: без неё перечисление возможно, чтение/запись нет. SDK поддерживает Littlefs и FAT/EXFAT. Включите ФС в menuconfig и создайте mnt.c платы. Пример:

<!-- cn PDF p.20 -->

```text
RT_USING_DFS [=y] #文件系统总开关 DFS_FILESYSTEMS_MAX [=2] #最大允许的挂载节点数目（即分区数目），因为devfs要占用一个，所以这 个值要>=（需要挂载的物理分区+1） DFS_FILESYSTEM_TYPES_MAX [=2] #最大允许的文件系统数目，支持elmfat和devfs，所以是2 DFS_FD_MAX [=16] #最大可同时操作的文件句柄
RT_USING_DFS_MNTTABLE [=y] #启用自动挂载表
RT_USING_DFS_ELMFAT [=y] #启用elmfat文件系统，兼容fat文件系统
RT_USING_DFS_DEVFS [=y] #启用设备文件系统，可以通过文件接口访问设备驱动
RT_DFS_ELM_MAX_SECTOR_SIZE [=4096] # 设置扇区大小为4096，以兼容底层spi flash的擦除块大 小
```

<!-- cn PDF p.20 -->

Пример RK2108 EVB: bsp/rockchip/rk2108/board/rk2108d_evb/mnt.c

<!-- cn PDF p.20 -->

```text
#ifdef RT_USING_DFS_MNTTABLE
#include <dfs_fs.h>

#define PARTITION_ROOT          "root"

/********************* Private Variable Definition ***************************/
/** @defgroup MNT_Private_Variable Private Variable
 *  @{
 */

/**
 * @brief  Config mount table of filesystem
 * @attention The mount_table must be terminated with NULL, and the partition's
name
 * must be the same as above.
 */
const struct dfs_mount_tbl mount_table[] =
{
    {PARTITION_ROOT, "/", "elm", 0, 0},
#if defined(RT_USING_LITTLEFS) && defined(RT_USING_SPINAND)
    {"spinand0", "/nand", "lfs", 0, 0},
#elif defined(RT_USING_SDIO0) && defined(RT_SDCARD_MOUNT_POINT)
    {"sd0", RT_SDCARD_MOUNT_POINT, "elm", 0, 0},
#endif
    {0}
};
#endif
```

<!-- cn PDF p.20 -->

Структура dfs_mount_tbl:

<!-- cn PDF p.20 -->

```text
/* mount table */
struct dfs_mount_tbl
{
    const char   *device_name;    /* 设备节点名 */
    const char   *path;           /* 挂载点目录 */
    const char   *filesystemtype; /* 文件系统名字(elm对应fat) */
    unsigned long rwflag;         /* rw(1为读写，0为只读，elm不支持这个标识，填0) */
    const void   *data;           /* 文件系统私有数据(elm不支持，填0) */
};
```

<!-- cn PDF p.20 -->

Работа MSC:

<!-- cn PDF p.21 -->

После загрузки без ПК root смонтирован локально для чтения/записи. При USB-подключении драйвер снимает локальное монтирование; устройство теряет доступ, ПК получает USB-диск. При отключении драйвер снимает root и снова монтирует локально.

<!-- cn PDF p.21 -->

#### 2.6.5 Пример UAC1

<!-- cn PDF p.21 -->

UAC (USB Audio Class) делает устройство внешней звуковой картой. SDK поддерживает только V1.0, не V2.0. Настройка v3.1.x:

<!-- cn PDF p.21 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            [ ] Using USB host
            [*] Using USB device
            (4096) usb thread stack size
            (0x2207) USB Vendor ID
            (0x0019) USB Product ID
            [ ]   Enable composite device
                    Device type (Enable to use device as UAC1 device)  --->
            (es8388p) uac1 playback card name
            (pdmc) uac1 capture card name
            [ ]   Enable to use pll compensation for clock synchronization
```

<!-- cn PDF p.21 -->

UAC1, RT-Thread v4.1.x:

<!-- cn PDF p.21 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            [ ] Using USB host
            [*] Using USB device
            (4096) usb thread stack size
            (0x2207) USB Vendor ID
            (0x0019) USB Product ID
            [ ]   Enable composite device
                    Device type (Enable to use device as UAC1 device)  --->
            (es8388p) uac1 playback card name
            (pdmc) uac1 capture card name
            [ ]   Enable to poll ep first transfer status
```

<!-- cn PDF p.21 -->

UAC1 + HID composite (RT-Thread v4.1.x). Примечания:

<!-- cn PDF p.21 -->

1. При UAC1 отключите VAD: # CONFIG_RT_USING_VAD is not set.

<!-- cn PDF p.21 -->

2. RT_USB_AUDIO_P_NAME — реальное устройство воспроизведения по схеме; пример RK2108 es8388p.

<!-- cn PDF p.22 -->

3. RT_USB_AUDIO_C_NAME — устройство записи по схеме; пример RK2108 pdmc.

<!-- cn PDF p.22 -->

4. RT_USB_AUDIO_PLL_COMPENSATION динамически регулирует такт устройства при воспроизведении. Разные такты SOF USB Host и I2S вызывают overrun/underrun. Регулировка подстраивает обработку под поток host независимо от Windows/Linux/MAC OS. Требуется SoC-зависимое ПО тактов, возможны аппаратные ограничения; главным образом RK2108.

<!-- cn PDF p.22 -->

5. RT_USB_AUDIO_USING_EP_POLL определяет старт потока опросом HAL вместо прерываний. Для composite UAC1 + HID рекомендуется против возможного шторма прерываний, зависящего от host. Опрос добавляет задержку: EP_STATUS_POLL_INTERVAL_MS = 5ms по умолчанию, настройте при необходимости.

<!-- cn PDF p.22 -->

6. В v3.1.x опроса по умолчанию нет; патч https://redmine.rock-chips.com/attachments/1217535 . Без playback устройство определяется, но не играет; без recording возникает fault. Перед UAC1 проверьте Sound через list_device. Здесь пример RK2108 es8311p/pdmc (оригинал выше пишет es8388p). При отсутствии включите Audio в menuconfig.

<!-- cn PDF p.22 -->

```text
msh />list_device
device          type         ref count
------- -------------------- ----------
es8311c Sound Device         0
es8311p Sound Device         1
audpwmp Sound Device         0
pdmc    Sound Device         0
adcc    Sound Device         0
usbd    USB Slave Device     0
root    Block Device         1
snor    MTD Device           0
pwm0    Miscellaneous Device 0
dmac0   Miscellaneous Device 0
i2c0    I2C Bus              0
pin     Miscellaneous Device 0
uart2   Character Device     0
uart0   Character Device     2
```

<!-- cn PDF p.22 -->

#### 2.6.6 Пример UVC

<!-- cn PDF p.22 -->

UVC — USB-видеозахват. Rockchip RT-Thread реализует UVC 1.1, MJPEG/YUYV, до трёх каналов composite. Ограничения:

<!-- cn PDF p.22 -->

1. Только BULK, без ISOC.

<!-- cn PDF p.22 -->

2. Только RK625.

<!-- cn PDF p.23 -->

Настройка UVC:

<!-- cn PDF p.23 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            [*] Using USB device
            (4096) usb thread stack size
            (0x2207) USB Vendor ID
            (0x0007) USB Product ID
            [*]   Enable composite device
            [*]     Enable to use device as UVC device
            [*]   Use to UVC device as RGB
            [ ]   Use to UVC device as DEPTH
            [ ]   Use to UVC device as IR
            (10240) uvc device max buffer length
```

<!-- cn PDF p.23 -->

Примечание:

<!-- cn PDF p.23 -->

1. RGB/DEPTH/IR по аппаратуре. RK625 — RGB UVC; RK625 + RK1608 — три канала.

<!-- cn PDF p.23 -->

2. uvc device max buffer length: 4K–16K. UVC основан на USB Framework: поток, драйвер, буферы, обработка ошибок:

<!-- cn PDF p.23 -->

![Рисунок китайского оригинала (p.23)](/docs/rockchip-rtthread-usb/assets/cn-p023-figure-01.png)

*Рисунок китайского оригинала (p.23)*

<!-- cn PDF p.23 -->

Рисунок 6. Архитектура UVC.

<!-- cn PDF p.24 -->

Каждый канал имеет поток запросов VC/VS. Драйвер определяет дескрипторы/разрешения, состояния буферов, планирует передачу и обрабатывает ошибки. Связь поток/драйвер через OS Event, UVC/USB через USB IO. Для журналов подключите устройство, откройте Camera на host и смотрите UART после инициализации:

<!-- cn PDF p.24 -->

```text
[...1...]
INF: uvc(1) set format fcc 1196444237 width 640 height 480
VIDEO_OPEN(1)
INF: uvc(1) open camera device...
Open camera id width height 1 640 480
[...2...]
INF: uvc(1) buffer(0) addr 0x2006787c
INF: uvc(1) buffer(1) addr 0x2006987c
INF: uvc(1) buffer(2) addr 0x2006b87c
INF: uvc(1) buffer(3) addr 0x2006d87c
INF: uvc(1) mjpeg header addr 0x20087c00
INF: uvc(1) buffer size 8064
[...]
[...3...]
VIDEO_CLOSE(1)
INF: uvc(1) close camera device...
Close camera id 1
close rgb success
[...]
[...4...]
uvc(1) buffer: (0-1) (1-1) (2-1) (3-2)
ERR: uvc(1) buffer overflow irq 0x000100f0
```

<!-- cn PDF p.24 -->

Log 1: FCC, ширина/высота. Log 2: количество, адреса и размеры кольцевых буферов, для MJPEG также Header Buffer. После них данные сенсора запускают передачу host. Log 3: закрытие Camera. Log 4: AMCAP/GUVCView могут отправить только EP Halt без CloseCamera. Это вызывает UVC Buffer Overflow, менеджер закрывает канал и останавливает USB.

<!-- cn PDF p.24 -->

#### 2.6.7 Пример WINUSB

<!-- cn PDF p.24 -->

WINUSB — универсальный драйвер Windows для Bulk без отдельной установки. Настройка:

<!-- cn PDF p.25 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            [ ] Using USB host
            [*] Using USB device
            (4096) usb thread stack size
            (0x2207) USB Vendor ID
            (0x0007) USB Product ID
            [ ]   Enable composite device
                    Device type (Enable to use device as winusb device)  --->
            ({6860DC3C-C05F-4807-8807-1CA861CC1D66}) Guid for winusb
            (16384) winusb transfer length
```

<!-- cn PDF p.25 -->

list_device показывает WINUSB:

<!-- cn PDF p.25 -->

```text
msh />list_device
device           type         ref count
-------- -------------------- ----------
winusb   Miscellaneous Device 0
usbd     USB Slave Device     0
```

<!-- cn PDF p.25 -->

Тестовый demo Rockchip для ПК: https://redmine.rock-chips.com/attachments/1213728

<!-- cn PDF p.25 -->

#### 2.6.8 Пример CDC_VCOM

<!-- cn PDF p.25 -->

CDC_VCOM — виртуальный USB COM по CDC-ACM для обмена с host. Настройка:

<!-- cn PDF p.25 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
            [ ] Using USB host
            [*] Using USB device
            (4096) usb thread stack size
            (0x2207) USB Vendor ID
            (0x0007) USB Product ID
            [ ]   Enable composite device
                    Device type (Enable to use device as CDC device)  --->
            (512) virtual com thread stack size
            (128) virtual com rx buffer size
            [ ]   Enable to use dma for vcom tx
            (32021919830108) serial number of virtual co
            (14)  serial number length of virtual com
            (1000) tx timeout(ticks) of virtual com
```

<!-- cn PDF p.25 -->

Изменения USB system console RT-Thread 3.1.x:

<!-- cn PDF p.25 -->

```text
diff --git a/components/libc/compilers/newlib/libc.c b/components/libc/compilers/newlib/libc.c
index 2234c36f98..07ba2bafeb 100644
--- a/components/libc/compilers/newlib/libc.c
+++ b/components/libc/compilers/newlib/libc.c
@@ -23,6 +23,7 @@ int   _EXFUN(putenv,(char *__string));

 int libc_system_init(void)
 {
+    rt_console_set_device("vcom");
 #if defined(RT_USING_DFS) & defined(RT_USING_DFS_DEVFS) & defined(RT_USING_CONSOLE)
     rt_device_t dev_console;

@@ -47,4 +48,4 @@ int libc_system_init(void)

     return 0;
 }
-INIT_COMPONENT_EXPORT(libc_system_init);
+INIT_APP_EXPORT(libc_system_init);
```

<!-- cn PDF p.26 -->

USB system console RT-Thread 4.1.x требует POSIX:

<!-- cn PDF p.26 -->

```text
RT_USING_POSIX_FS [=y]
RT_USING_POSIX_DEVIO [=y]
RT_USING_POSIX_STDIO [=y]
diff --git a/components/libc/posix/io/stdio/libc.c b/components/libc/posix/io/stdio/libc.c
index cc891574f3..b12e24610b 100644
--- a/components/libc/posix/io/stdio/libc.c
+++ b/components/libc/posix/io/stdio/libc.c
@@ -20,6 +20,7 @@

 int libc_system_init(void)
 {
+    rt_console_set_device("vcom");
 #ifdef RT_USING_POSIX_STDIO
     rt_device_t dev_console;

@@ -31,7 +32,8 @@ int libc_system_init(void)
 #endif /* RT_USING_POSIX_STDIO */
     return 0;
 }
-INIT_COMPONENT_EXPORT(libc_system_init);
+INIT_APP_EXPORT(libc_system_init);
```

<!-- cn PDF p.26 -->

Совместимость CDC_VCOM: Rockchip принимает данные host, но не может отправить обратно. Исправление:

<!-- cn PDF p.26 -->

```text
Subject: [PATCH] [COMPONENTS]: drivers: usb: cdc_vcom: Fix connected state
The current cdc vcom driver depends the setup wValue of
the request CDC_SET_CONTROL_LINE_STATE to set the connected
state. Refer to CDC Spec V1.2 Chapter 6.3.12 SetControlLineState,
the Bit0 of the wValue is used to indicates to DCE if DTE
(Data Terminal Equipment, for example, a Personal Computer)
is present or not. However, some DTE always set the Bit0 of
the wValue to 0, this cause cdc vcom failed to send message to
DTE. This patch ignores the Bit0 of wValue, and set the
connected state to true directly if it receives the request
CDC_SET_CONTROL_LINE_STATE.

diff --git a/components/drivers/usb/usbdevice/class/cdc_vcom.c b/components/drivers/usb/usbdevice/class/cdc_vcom.c
index df5e03f54c..e201742747 100644
--- a/components/drivers/usb/usbdevice/class/cdc_vcom.c
+++ b/components/drivers/usb/usbdevice/class/cdc_vcom.c
@@ -463,7 +463,7 @@ static rt_err_t _interface_handler(ufunction_t func, ureq_t setup)
         _cdc_get_line_coding(func->device, setup);
         break;
     case CDC_SET_CONTROL_LINE_STATE:
-        data->connected = (setup->wValue & 0x01) > 0?RT_TRUE:RT_FALSE;
+        data->connected = RT_TRUE;
         RT_DEBUG_LOG(RT_DEBUG_USB, ("vcom state:%d \n", data->connected));
         dcd_ep0_send_status(func->device->dcd);
         break;
```

<!-- cn PDF p.27 -->

#### 2.6.9 Настройка скорости Device

<!-- cn PDF p.27 -->

По умолчанию High speed. Для принудительного Full speed, например UAC, задайте #define RT_USING_USBD_SPEED_FULL.

<!-- cn PDF p.27 -->

#### 2.6.10 Настройка FIFO конечных точек

<!-- cn PDF p.27 -->

FIFO — ресурсы контроллера: все Rx делят RxFIFO, каждый Tx имеет отдельный TxFIFO. Настройка в адаптере DWC2 Device и плате. RK2118: rt-thread/bsp/rockchip/rk2118/board/common/board_base.c, g_usb_ep_pool для одновременных 2 BULK, 2 ISOC, 2 INT. Для других composite настройте число/типы по потребности.

<!-- cn PDF p.28 -->

```text
#ifdef RT_USING_USB_DEVICE
RT_WEAK struct ep_id g_usb_ep_pool[] =
{
    { 0x0,  USB_EP_ATTR_CONTROL,    USB_DIR_INOUT,  64,   ID_ASSIGNED   },
    { 0x1,  USB_EP_ATTR_BULK,       USB_DIR_IN,     1024, ID_UNASSIGNED },
    { 0x2,  USB_EP_ATTR_BULK,       USB_DIR_OUT,    512,  ID_UNASSIGNED },
    { 0x3,  USB_EP_ATTR_ISOC,       USB_DIR_IN,     1024, ID_UNASSIGNED },
    { 0x4,  USB_EP_ATTR_ISOC,       USB_DIR_OUT,    512,  ID_UNASSIGNED },
    { 0x5,  USB_EP_ATTR_INT,        USB_DIR_IN,     64,   ID_UNASSIGNED },
    { 0x6,  USB_EP_ATTR_INT,        USB_DIR_OUT,    64,   ID_UNASSIGNED },
    { 0xFF, USB_EP_ATTR_TYPE_MASK,  USB_DIR_MASK,   0,    ID_ASSIGNED   },
};
#endif
```

<!-- cn PDF p.28 -->

HAL FIFO: rt-thread/bsp/rockchip/common/drivers/drv_usbd.c. HAL_PCDEx_SetRxFiFo задаёт RxFIFO, HAL_PCDEx_SetTxFiFo — TxFIFO; единица 4 байта.

<!-- cn PDF p.28 -->

```text
static void usb_pcd_lowlevel_hw_init(struct PCD_HANDLE *pcd)
{
    uint8_t i;

    /* Initialize Low Level Driver */
    HAL_PCD_Init(pcd);

#ifndef RT_USB_DEVICE_UVC
    HAL_PCDEx_SetRxFiFo(pcd, 0x118);
#else
    /*
     * Set smaller RxFiFo for 3 * UVC interfaces, then
     * it can assign enough TxFiFo size (1024 Bytes)
     * for each UVC streaming IN endpoint to get higher
     * performance.
     */
    HAL_PCDEx_SetRxFiFo(pcd, 0x8C);
#endif

    /* Set TxFIFOs according to the g_usb_ep_pool array */
    for (i = 0; i < pcd->cfg.epNum + 1; i++)
    {
        if (g_usb_ep_pool[i].addr == 0xFF)
            break;

        if (g_usb_ep_pool[i].dir == USB_DIR_IN || g_usb_ep_pool[i].dir ==
USB_DIR_INOUT)
            HAL_PCDEx_SetTxFiFo(pcd, g_usb_ep_pool[i].addr,
                                (g_usb_ep_pool[i].maxpacket >> 2));
    }

    HAL_PCD_Start(pcd);
}
```

<!-- cn PDF p.29 -->

#### 2.6.11 Обнаружение VBUS

<!-- cn PDF p.29 -->

Три способа:
- GPIO: USB_VBUS_PIN; RK2118 evb, rt-thread/bsp/rockchip/rk2118/board/evb/board.h.
- PMIC: RT_USING_USB_PMIC_VBUS; RK2108 recording_pen, rt-thread/bsp/rockchip/rk2108/board/recording_pen_v10/board.h.
- USB PHY: RT_USING_BVALID_IRQ; RK2118 iotest, rt-thread/bsp/rockchip/rk2118/board/iotest/board.h.

<!-- cn PDF p.29 -->

### 2.7 Примеры USB Host

<!-- cn PDF p.29 -->

#### 2.7.1 Пример Host MSC

<!-- cn PDF p.29 -->

Настройка компонента Host MSC:

<!-- cn PDF p.29 -->

```text
RT-Thread Components  --->
    Device Drivers  --->
        Using USB  --->
        [*] Using USB host
        [*]   Enable Udisk Drivers
        (/)     Udisk mount dir (NEW)
        [ ]   Enable HID Drivers (NEW)
        [ ] Using USB device
        (4096) usb thread stack size
```

<!-- cn PDF p.29 -->

Адаптер Host настраивается по контроллеру и версии RT-Thread. v3.1.x:

<!-- cn PDF p.29 -->

```text
RT-Thread rockchip common drivers  --->
    RT-Thread rockchip USB Host driver  --->
        [ ] DWC2 HCD Support
        [ ] EHCI HCD Support
        [ ] OHCI HCD Support
```

<!-- cn PDF p.29 -->

Примечание:

<!-- cn PDF p.29 -->

1. DWC2 HCD Support выбирает DWC2.

<!-- cn PDF p.29 -->

2. EHCI HCD Support и OHCI HCD Support выбирают USB2 Host EHCI/OHCI.

<!-- cn PDF p.30 -->

Начиная с v4.1.x настройка адаптера перенесена из общих драйверов в драйверы чипа для одновременных Host-портов. Пример RK3506 OTG0/1:

<!-- cn PDF p.30 -->

```text
RT-Thread rockchip RK3506 drivers  --->
    Enable USB HOST  --->
        [*] Enable USB OTG HOST
        [*]   Enable USB OTG0 HOST
        [*]   Enable USB OTG1 HOST
```

<!-- cn PDF p.30 -->

Настройка ФС для MSC:

<!-- cn PDF p.30 -->

```text
RT-Thread Components  --->
    [*] DFS: device virtual file system  ----
        [*]   Enable elm-chan fatfs
            elm-chan's FatFs, Generic FAT Filesystem Module  --->
```

<!-- cn PDF p.30 -->

RT-Thread пока поддерживает только FAT-32 USB-диски. Настройка cache:

<!-- cn PDF p.30 -->

```text
RT-Thread rockchip common drivers  --->
    [*] Enable cache
```

<!-- cn PDF p.30 -->

Регистрация/перечисление Host MSC:

<!-- cn PDF p.31 -->

![Рисунок китайского оригинала (p.31)](/docs/rockchip-rtthread-usb/assets/cn-p031-figure-01.png)

*Рисунок китайского оригинала (p.31)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

```text
rt_device_register("usbh")
rt_usb_host_init()
rt_usbh_hub_init()
rt_usbh_class_driver_init()
rt_usbh_class_driver_register()
rt_device_init()
usb_hcd_init()
rt_usbh_hub_port_change()
rt_usbh_alloc_instance()
rt_usbh_hub_get_port_status()
rt_usbh_attach_instance()
rt_usbh_class_driver_find()
rt_usbh_class_driver_enable()
```

<!-- cn PDF p.31 -->

Рисунок 7. Доступ приложения к MSC:

<!-- cn PDF p.31 -->

![Рисунок китайского оригинала (p.31)](/docs/rockchip-rtthread-usb/assets/cn-p031-figure-02.png)

*Рисунок китайского оригинала (p.31)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

```text
open()
read() -> dfs_file_read() -> dfs_elm_read() -> f_read() -> disk_read()
  -> rt_device_read() -> rt_udisk_read() -> rt_usb_hcd_pipe_xfer() -> drv_pipe_xfer()
write() -> dfs_file_write() -> dfs_elm_write() -> f_write() -> disk_write()
  -> rt_device_write() -> rt_udisk_write() -> rt_usb_hcd_pipe_xfer() -> drv_pipe_xfer()
```

<!-- cn PDF p.31 -->

Рисунок 8. Доступ приложения к MSC.

<!-- cn PDF p.32 -->

#### 2.7.2 Управление Host VBUS

<!-- cn PDF p.32 -->

Выход VBUS 5V управляется GPIO. Добавьте GPIOBANK_PIN в заголовок платы.

<!-- cn PDF p.32 -->

1. USB2.0 OTG Host VBUS GPIO: RK3506 EVB1, bsp/rockchip/rk3506-32/board/evb1/board.h.

<!-- cn PDF p.32 -->

```text
#define USB_OTG_HOST0_VBUS_PIN        BANK_PIN(GPIO_BANK1, 20)
#define USB_OTG_HOST1_VBUS_PIN        BANK_PIN(GPIO_BANK1, 24)
```

<!-- cn PDF p.32 -->

2. USB2.0 Host VBUS GPIO: RK3568 EVB1, bsp/rockchip/rk3568-32/board/rk3568_evb1/board.h.

<!-- cn PDF p.32 -->

```text
#define USB_HOST_VBUS_PIN        BANK_PIN(GPIO_BANK0, 6)
```


## Технические ссылки оригинала

- [PDF reference 1](https://www.rt-thread.org/document/site/programming-manual/device/device/)
- [PDF reference 2](https://www.rt-thread.org/qa/forum.php?mod=viewthread&tid=5651&highlight=usb)
- [PDF reference 3](https://github.com/RT-Thread/IoT_Board/tree/master/examples/10_component_usb_mouse)
- [PDF reference 4](https://redmine.rock-chips.com/attachments/1758822)
- [PDF reference 5](https://packages.rt-thread.org/detail.html?package=adbd)
- [PDF reference 6](https://github.com/heyuanjie87/adbd)
- [PDF reference 7](https://redmine.rock-chips.com/attachments/1217535)
- [PDF reference 8](https://redmine.rock-chips.com/attachments/1213728)

{% endraw %}
