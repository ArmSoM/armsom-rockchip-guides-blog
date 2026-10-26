---
title: "Журналы инициализации Rockchip Linux USB: ядра 3.10 и 4.4"
description: "Журналы инициализации Rockchip Linux USB: ядра 3.10 и 4.4 — V1.1.1"
excerpt: "Журналы инициализации Rockchip Linux USB: ядра 3.10 и 4.4"
translation_key: "158-rockchip-usb-initialization-log"
slug: "158-rockchip-usb-initialization-log"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, Linux]
---

{% raw %}

# Журналы инициализации Rockchip Linux USB: ядра 3.10 и 4.4

Платформенная справка ArmSoM по китайскому RK-KF-YF-099 V1.1.1 для перечисленных SDK Linux 3.10/4.4 и чипов. Исторический список контроллеров нельзя распространять на новые чипы или все платы ArmSoM. Проверяйте конкретную плату, BSP, разводку USB и ядро; аппаратная проверка не выполнялась. Все журналы — примеры источника, не измерения ArmSoM. Английского PDF и отдельных технических рисунков нет; полные журналы доступны как копируемый текст.

Неясность источника: порядок USB3.0/USB2.0 Root HUB и номеров шин в двух описаниях DWC3 вызывает вопрос при сравнении с соседними строками idProduct=0002/0003. Текст и журналы сохранены; сверяйте реальные дескрипторы, не меняйте номера молча. Написания wc_otg_hcd_suspend и ndroid_work в исходном журнале также сохранены.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Подсистема USB в Linux

Linux предоставляет структуры и общие драйверы USB для сторон хоста и устройства. Сторона хоста включает USB Core, драйверы хост-контроллеров, концентраторов и классов устройств. Сторона устройства включает Gadget, драйверы контроллеров устройств и Function-драйверы классов.

## 2. USB-контроллеры SoC Rockchip

| Чип / контроллер | EHCI&OHCI | DWC2 | DWC3 |
| --- | --- | --- | --- |
| RV1108 | Y | Y | N |
| RK312X | Y | Y | N |
| RK3288 | Y | Y | N |
| RK322X | Y | Y | N |
| RK322XH | Y | Y | Y |
| RK3328 | Y | Y | Y |
| RK3366 | Y | Y | Y |
| RK3368 | Y | Y | N |
| RK3399 | Y | N | Y |

## 3. Kernel 3.10

### 3.1 Поддерживаемые чипы

Глава описывает журналы инициализации Linux Kernel 3.10 для платформ с SDK на этом ядре: RV1108, RK312X, RK3288, RK322X, RK322XH, RK3328 и RK3368.

### 3.2 Журналы стороны хоста

#### 3.2.1 USB CORE

```text
01 [    0.959817]  usbcore: registered new interface driver usbfs
02 [    0.959890]  usbcore: registered new interface driver hub
03 [    0.960070]  usbcore: registered new device driver usb
...
```

Это первые три сообщения USB при запуске Linux Kernel 3.10. Строка 01 регистрирует файловую систему USB, которой после загрузки соответствует /sys/bus/usb/. Строка 02 регистрирует драйвер концентраторов. Строка 03 регистрирует общий драйвер usb_generic_driver. Обычно устройство сначала сопоставляется с usb_generic_driver как устройство; после успешного сопоставления создаются интерфейсы. Вызов device_add() для интерфейса запускает его сопоставление с драйвером.

#### 3.2.2 Драйверы классов устройств

```text
01 [    1.234947]  usbcore: registered new interface driver catc
02 [    1.235015]  usbcore: registered new interface driver kaweth
03 [    1.235109]  usbcore: registered new interface driver pegasus
04 [    1.235180]  usbcore: registered new interface driver rtl8150
05 [    1.235246]  usbcore: registered new interface driver r8152
06 [    1.235379]  usbcore: registered new interface driver hso
07 [    1.235451]  usbcore: registered new interface driver asix
08 [    1.235515]  usbcore: registered new interface driver ax88179_178a
09 [    1.235586]  usbcore: registered new interface driver cdc_ether
10 [    1.235656]  usbcore: registered new interface driver cdc_eem
11 [    1.235727]  usbcore: registered new interface driver dm9601
12 [    1.235793]  usbcore: registered new interface driver dm9620
13 [    1.235867]  usbcore: registered new interface driver smsc75xx
14 [    1.235996]  usbcore: registered new interface driver smsc95xx
15 [    1.236065]  usbcore: registered new interface driver gl620a
16 [    1.236132]  usbcore: registered new interface driver net1080
17 [    1.236197]  usbcore: registered new interface driver plusb
18 [    1.236266]  usbcore: registered new interface driver rndis_host
...
```

Это драйверы классов на стороне хоста, то есть хост-драйверы отдельных USB-устройств. Их настраивают через menuconfig.

```text
Location:
 |     -> Device Drivers
 |        -> USB support
 |        *** USB Device Class drivers ***
 |        < > xxx
 |        < > xxx
```

#### 3.2.3 Драйверы хост-контроллеров

##### 3.2.3.1 EHCI

```text
01 [    1.243691]  ehci_hcd: USB 2.0 'Enhanced' Host Controller (EHCI) Driver
02 [    1.243722]  ehci-platform: EHCI generic platform driver
03 [    1.244307]  ehci-platform ff5c0000.usb: EHCI Host Controller
04 [    1.244358]  ehci-platform ff5c0000.usb: new USB bus registered, assigned bus number 3
05 [    1.244875]  ehci-platform ff5c0000.usb: irq 48, io mem 0xff5c0000
06 [    1.252401]  ehci-platform ff5c0000.usb: USB 2.0 started, EHCI 1.00
07 [    1.252526]  usb usb3: New USB device found, idVendor=1d6b, idProduct=0002
08 [    1.252561]  usb usb3: New USB device strings: Mfr=3, Product=2, SerialNumber=1
09 [    1.252593]  usb usb3: Product: EHCI Host Controller
10 [    1.252623]  usb usb3: Manufacturer: Linux 3.10.104 ehci_hcd
11 [    1.252654]  usb usb3: SerialNumber: ff5c0000.usb
12 [    1.253238]  hub 3-0:1.0: USB hub found
13 [    1.253284]  hub 3-0:1.0: 1 port detected
...
```

Полный журнал инициализации EHCI содержит основные сведения: номер прерывания, виртуальный адрес устройства и версию контроллера. Контроллер перечисляется как USB2.0 Root HUB (hub 3-0:1.0) с BUS Number 3.

##### 3.2.3.2 OHCI

```text
01 [    1.253939]  ohci_hcd: USB 1.1 'Open' Host Controller (OHCI) Driver
02 [    1.253970]  ohci-platform: OHCI generic platform driver
03 [    1.254316]  ohci-platform ff5d0000.usb: Generic Platform OHCI controller
04 [    1.254366]  ohci-platform ff5d0000.usb: new USB bus registered, assigned bus number 4
05 [    1.254456]  ohci-platform ff5d0000.usb: irq 49, io mem 0xff5d0000
06 [    1.308870]  usb usb4: New USB device found, idVendor=1d6b, idProduct=0001
07 [    1.308909]  usb usb4: New USB device strings: Mfr=3, Product=2, SerialNumber=1
08 [    1.308942]  usb usb4: Product: Generic Platform OHCI controller
09 [    1.308973]  usb usb4: Manufacturer: Linux 3.10.104 ohci_hcd
10 [    1.309004]  usb usb4: SerialNumber: ff5d0000.usb
11 [    1.309601]  hub 4-0:1.0: USB hub found
12 [    1.309648]  hub 4-0:1.0: 1 port detected
...
```

Полный журнал инициализации OHCI содержит основные сведения: номер прерывания, виртуальный адрес устройства и версию контроллера. Контроллер перечисляется как USB1.1 Root HUB (hub 4-0:1.0) с BUS Number 4.

##### 3.2.3.3 DWC2 Host

```text
01 [    1.313609]  usb20_otg ff580000.usb: DWC OTG Controller
02 [    1.313660]  usb20_otg ff580000.usb: new USB bus registered, assigned bus number 5
03 [    1.313719]  usb20_otg ff580000.usb: irq 55, io mem 0x00000000
04 [    1.313833]  usb usb5: New USB device found, idVendor=1d6b, idProduct=0002
05 [    1.313868]  usb usb5: New USB device strings: Mfr=3, Product=2, SerialNumber=1
06 [    1.313900]  usb usb5: Product: DWC OTG Controller
07 [    1.313931]  usb usb5: Manufacturer: Linux 3.10.104 dwc_otg_hcd
08 [    1.313962]  usb usb5: SerialNumber: ff580000.usb
09 [    1.314523]  hub 5-0:1.0: USB hub found
10 [    1.314568]  hub 5-0:1.0: 1 port detected
11 [    1.315013]  usb20_host: version 3.10a 21-DEC-2012
...
```

Полный журнал DWC2 HOST сообщает номер прерывания, виртуальный адрес и версию контроллера (version 3.10a 21-DEC-2012). Он перечисляется как USB2.0 Root HUB (hub 5-0:1.0) с BUS Number 5.

##### 3.2.3.4 DWC3 Host

```text
01 [    1.240046]  xhci-hcd xhci-hcd.0.auto: xHCI Host Controller
02 [    1.240104]  xhci-hcd xhci-hcd.0.auto: new USB bus registered, assigned bus number 1
03 [    1.241268]  xhci-hcd xhci-hcd.0.auto: irq 99, io mem 0xff600000
04 [    1.241409]  usb usb1: New USB device found, idVendor=1d6b, idProduct=0002
05 [    1.241443]  usb usb1: New USB device strings: Mfr=3, Product=2, SerialNumber=1
06 [    1.241477]  usb usb1: Product: xHCI Host Controller
07 [    1.241508]  usb usb1: Manufacturer: Linux 3.10.104 xhci-hcd
08 [    1.241539]  usb usb1: SerialNumber: xhci-hcd.0.auto
09 [    1.242232]  hub 1-0:1.0: USB hub found
10 [    1.242282]  hub 1-0:1.0: 1 port detected
11 [    1.242570]  xhci-hcd xhci-hcd.0.auto: xHCI Host Controller
12 [    1.242617]  xhci-hcd xhci-hcd.0.auto: new USB bus registered, assigned bus number 2
13 [    1.242734]  usb usb2: New USB device found, idVendor=1d6b, idProduct=0003
14 [    1.242771]  usb usb2: New USB device strings: Mfr=3, Product=2, SerialNumber=1
15 [    1.242803]  usb usb2: Product: xHCI Host Controller
16 [    1.242834]  usb usb2: Manufacturer: Linux 3.10.104 xhci-hcd
17 [    1.242865]  usb usb2: SerialNumber: xhci-hcd.0.auto
18 [    1.243408]  hub 2-0:1.0: USB hub found
19 [    1.243451]  hub 2-0:1.0: 1 port detected
...
```

DWC3 Host содержит контроллер XHCI. Полный журнал даёт номер прерывания, физический адрес контроллера. Источник описывает отдельное перечисление USB3.0 Root HUB (hub 1-0:1.0) и USB2.0 Root HUB (hub 2-0:1.0) с назначенными номерами шин.

## 4. Журналы стороны устройства

В контексте источника чипы Rockchip с SDK Kernel 3.10 интегрируют только DWC2 IP, поэтому единственный контроллер устройств — DWC2. Ядро использует dwc_otg_310 из drivers/usb/dwc_otg_310.

### 4.1 DWC2 Peripheral

```text
01 [    1.312160]  usb20_otg: version 3.10a 21-DEC-2012
02 [    1.312963]  Core Release: 3.10a
03 [    1.312992]  Setting default values for core params
04 [    1.313179]  Using Buffer DMA mode
05 [    1.313207]  Periodic Transfer Interrupt Enhancement - disabled
06 [    1.313233]  Multiprocessor Interrupt Enhancement - disabled
07 [    1.313262]  OTG VER PARAM: 0, OTG VER FLAG: 0
08 [    1.313288]  ^^^^^^^^^^^^^^^^^Device Mode
...
```

Журнал инициализации контроллера устройств также сообщает сведения о нём. Строки 01–02: версия ПО 3.10a 21-DEC-2012, версия IP 3.10a.

Также показаны текущий режим контроллера и настройки некоторых параметров.

### 4.2 Журнал перечисления DWC2 Peripheral

```text
01 [    9.208851]  [otg id chg] last id -1 current id 64
02 [    9.208971]  rk_battery_charger_detect_cb , battery_charger_detect 6
03 [    9.308586]  Using Buffer DMA mode
04 [    9.308692]  Periodic Transfer Interrupt Enhancement - disabled
05 [    9.308710]  Multiprocessor Interrupt Enhancement - disabled
06 [    9.308729]  OTG VER PARAM: 0, OTG VER FLAG: 0
07 [    9.308745]  ^^^^^^^^^^^^^^^^^Device Mode
08 [    9.308774]  dwc_otg_hcd_resume, usb device mode
09 [    9.409073]  wc_otg_hcd_suspend, usb device mode
10 [    9.799241]  ***************vbus detect*****************
11 [    9.801964]  rk_battery_charger_detect_cb , battery_charger_detect 1
12 [    9.924721]  Using Buffer DMA mode
13 [    9.924755]  Periodic Transfer Interrupt Enhancement - disabled
14 [    9.924772]  Multiprocessor Interrupt Enhancement - disabled
15 [    9.924790]  OTG VER PARAM: 0, OTG VER FLAG: 0
16 [    9.924807]  ^^^^^^^^^^^^^^^^^Device Mode
17 [    9.924873]  *******************soft connect!!!*******************
18 [   10.038883]  USB RESET
19 [   10.129663]  ndroid_work: sent uevent USB_STATE=CONNECTED
20 [   10.133049]  USB RESET
21 [   10.256977]  android_usb gadget: high-speed config #1: android
22 [   10.257999]  android_work: sent uevent USB_STATE=CONFIGURED
23 [   10.297006]  mtp_open
...
```

Это полный журнал перечисления DWC2 peripheral. Строка 01 обнаруживает изменение USB ID при подключении кабеля. Строки 03–07 — повторная инициализация контроллера; 10 — обнаружение VBUS; 18–22 — успешное перечисление и уведомление Android о подключении Gadget через UEVENT.

## 5. Kernel 4.4

### 5.1 Поддерживаемые чипы

Глава описывает журналы инициализации Linux Kernel 4.4 для платформ с соответствующим SDK: RK312X, RK3288, RK322X, RK322XH, RK3328, RK3366, RK3368 и RK3399.

### 5.2 Журналы стороны хоста

#### 5.2.1 USB CORE и драйверы классов устройств

Как и в Linux Kernel 3.10, usbcore регистрирует файловую систему USB, драйвер концентраторов и общий драйвер устройств с теми же сообщениями. У драйверов классов также те же журналы и способ настройки, что в Kernel 3.10.

#### 5.2.2 Драйверы хост-контроллеров

##### 5.2.2.1 EHCI

```text
01 [    0.869076] ehci_hcd: USB 2.0 'Enhanced' Host Controller (EHCI) Driver
02 [    0.869099] ehci-pci: EHCI PCI platform driver
03 [    0.869191] ehci-platform: EHCI generic platform driver
04 [    0.873032] ehci-platform ff5c0000.usb: EHCI Host Controller
05 [    0.873078] ehci-platform ff5c0000.usb: new USB bus registered, assigned bus number 2
06 [    0.873322] ehci-platform ff5c0000.usb: irq 44, io mem 0xff5c0000
07 [    0.883191] ehci-platform ff5c0000.usb: USB 2.0 started, EHCI 1.00
08 [    0.883418] usb usb2: New USB device found, idVendor=1d6b, idProduct=0002
09 [    0.883438] usb usb2: New USB device strings: Mfr=3, Product=2, SerialNumber=1
10 [    0.883454] usb usb2: Product: EHCI Host Controller
11 [    0.883469] usb usb2: Manufacturer: Linux 4.4.103 ehci_hcd
12 [    0.883484] usb usb2: SerialNumber: ff5c0000.usb
13 [    0.884226] hub 2-0:1.0: USB hub found
14 [    0.884291] hub 2-0:1.0: 1 port detected
...
```

Полный журнал инициализации EHCI содержит основные сведения: номер прерывания, виртуальный адрес устройства и версию драйвера контроллера. Контроллер перечисляется как USB2.0 Root HUB (hub 2-0:1.0) с BUS Number 2.

##### 5.2.2.2 OHCI

```text
01 [    0.884853] ohci_hcd: USB 1.1 'Open' Host Controller (OHCI) Driver
02 [    0.884897] ohci-platform: OHCI generic platform driver
03 [    0.885315] ohci-platform ff5d0000.usb: Generic Platform OHCI controller
04 [    0.885352] ohci-platform ff5d0000.usb: new USB bus registered, assigned bus number 3
05 [    0.885551] ohci-platform ff5d0000.usb: irq 45, io mem 0xff5d0000
06 [    0.940734] usb usb3: New USB device found, idVendor=1d6b, idProduct=0001
07 [    0.940763] usb usb3: New USB device strings: Mfr=3, Product=2, SerialNumber=1
08 [    0.940783] usb usb3: Product: Generic Platform OHCI controller
09 [    0.940800] usb usb3: Manufacturer: Linux 4.4.103 ohci_hcd
10 [    0.940815] usb usb3: SerialNumber: ff5d0000.usb
11 [    0.941546] hub 3-0:1.0: USB hub found
12 [    0.941597] hub 3-0:1.0: 1 port detected
...
```

Полный журнал инициализации OHCI содержит основные сведения: номер прерывания, виртуальный адрес устройства и версию драйвера контроллера. Контроллер перечисляется как USB1.1 Root HUB (hub 3-0:1.0) с BUS Number 3.

##### 5.2.2.3 DWC2 Host

```text
01 [    0.579425] ff580000.usb supply vusb_d not found, using dummy regulator
02 [    0.579500] ff580000.usb supply vusb_a not found, using dummy regulator
03 [    0.866540] dwc2 ff580000.usb: EPs: 10, dedicated fifos, 972 entries in SPRAM
04 [    0.867120] dwc2 ff580000.usb: DWC OTG Controller
05 [    0.867163] dwc2 ff580000.usb: new USB bus registered, assigned bus number 1
06 [    0.867211] dwc2 ff580000.usb: irq 43, io mem 0x00000000
07 [    0.867428] usb usb1: New USB device found, idVendor=1d6b, idProduct=0002
08 [    0.867449] usb usb1: New USB device strings: Mfr=3, Product=2, SerialNumber=1
09 [    0.867466] usb usb1: Product: DWC OTG Controller
10 [    0.867480] usb usb1: Manufacturer: Linux 4.4.103 dwc2_hsotg
11 [    0.867495] usb usb1: SerialNumber: ff580000.usb
12 [    0.868254] hub 1-0:1.0: USB hub found
13 [    0.868303] hub 1-0:1.0: 1 port detected
...
```

Полный журнал DWC2 HOST, как у других хост-контроллеров, сообщает номер прерывания, виртуальный адрес устройства и часть конфигурации контроллера.

DWC2 HOST перечисляется как USB2.0 Root HUB (hub 1-0:1.0), BUS Number 1.

##### 5.2.2.4 DWC3 Host

```text
01 [    0.942624] xhci-hcd xhci-hcd.7.auto: xHCI Host Controller
02 [    0.942662] xhci-hcd xhci-hcd.7.auto: new USB bus registered, assigned bus number 4
03 [    0.943032] xhci-hcd xhci-hcd.7.auto: hcc params 0x0220fe64 hci version 0x110 quirks 0x00210010
04 [    0.943107] xhci-hcd xhci-hcd.7.auto: irq 185, io mem 0xff600000
05 [    0.943357] usb usb4: New USB device found, idVendor=1d6b, idProduct=0002
06 [    0.943378] usb usb4: New USB device strings: Mfr=3, Product=2, SerialNumber=1
07 [    0.943395] usb usb4: Product: xHCI Host Controller
08 [    0.943410] usb usb4: Manufacturer: Linux 4.4.103 xhci-hcd
09 [    0.943425] usb usb4: SerialNumber: xhci-hcd.7.auto
10 [    0.944176] hub 4-0:1.0: USB hub found
11 [    0.944226] hub 4-0:1.0: 1 port detected
12 [    0.944647] xhci-hcd xhci-hcd.7.auto: xHCI Host Controller
13 [    0.944676] xhci-hcd xhci-hcd.7.auto: new USB bus registered, assigned bus number 5
14 [    0.944779] usb usb5: We don't know the algorithms for LPM for this host, disabling LPM.
15 [    0.944943] usb usb5: New USB device found, idVendor=1d6b, idProduct=0003
16 [    0.944963] usb usb5: New USB device strings: Mfr=3, Product=2, SerialNumber=1
17 [    0.944979] usb usb5: Product: xHCI Host Controller
18 [    0.944994] usb usb5: Manufacturer: Linux 4.4.103 xhci-hcd
19 [    0.945009] usb usb5: SerialNumber: xhci-hcd.7.auto
20 [    0.945718] hub 5-0:1.0: USB hub found
21 [    0.945766] hub 5-0:1.0: 1 port detected
...
```

DWC3 Host содержит контроллер XHCI. Полный журнал даёт номер прерывания, виртуальный адрес устройства и версию контроллера. Источник описывает отдельное перечисление USB3.0 Root HUB (hub 4-0:1.0) и USB2.0 Root HUB (hub 5-0:1.0) с назначенными номерами шин.

## 6. Журналы стороны устройства

В пределах платформ источника все чипы кроме RK3399 содержат DWC2 OTG IP; RK3399 содержит DWC3 OTG с USB3.0. Поэтому журналы стороны устройства рассматриваются отдельно. В Kernel 4.4 драйвер DWC2 находится в drivers/usb/dwc2, DWC3 — в drivers/usb/dwc3.

### 6.1 DWC2/DWC3 Peripheral

При запуске Kernel 4.4 без USB-кабеля DWC2 в режиме OTG выводит те же сообщения, что DWC2 Host; в Peripheral нет специальных сообщений. DWC3 ведёт себя аналогично.

### 6.2 Журнал перечисления DWC2 Peripheral

```text
01 [   18.566773] read descriptors
02 [   18.566811] read descriptors
03 [   18.566820] read strings
04 [   18.631141] dwc2 ff580000.usb: bound driver configfs-gadget
05 [   18.767106] dwc2 ff580000.usb: new device is high-speed
06 [   18.796143] android_work: sent uevent USB_STATE=CONNECTED
07 [   18.807125] dwc2 ff580000.usb: new device is high-speed
08 [   18.835990] dwc2 ff580000.usb: new address 1
09 [   18.871528] configfs-gadget gadget: high-speed config #1: b
10 [   18.871732] android_work: sent uevent USB_STATE=CONFIGURED
...
```

Полный журнал DWC2 Peripheral: 01–03 — Android начинает настройку Gadget; 04–05 — сведения о перечислении; 06 — перечисление завершено, Gadget отправляет Android Connected через Uevent; 10 — отправляет Configured через Uevent, подтверждая успешную настройку.

### 6.3 Журнал перечисления DWC3 Peripheral

```text
01 [   13.924130] fusb302 4-0022: CC connected in 1 as UFP
02 [   14.061902] phy phy-ff770000.syscon:usb2-phy@e450.5: charger = USB_SDP_CHARGER
03 [   15.633013] fusb302 4-0022: PD disabled
04 [   15.635514] cdn-dp-fb fec00000.dp-fb: lanes count does not change: 0
05 [   15.651643] rockchip-dwc3 usb@fe800000: USB peripheral connected
06 [   19.811878] read descriptors
07 [   19.811923] read strings
08 [   19.938589] android_work: sent uevent USB_STATE=CONNECTED
09 [   19.973662] configfs-gadget gadget: super-speed config #1: b
10 [   19.974071] android_work: sent uevent USB_STATE=CONFIGURED
...
```

Полный журнал DWC3 Peripheral: 01 — FUSB302 обнаруживает кабель; 02 — начинается определение зарядного устройства (источник называет его стандартным при подключении к ПК); 06–07 — Android начинает настройку Gadget; 08 — перечисление завершено, Gadget отправляет Connected через Uevent.

Строки 09–10: USB Config завершена, Gadget уведомляет Android об успешной настройке сообщением Configured через Uevent.

{% endraw %}
