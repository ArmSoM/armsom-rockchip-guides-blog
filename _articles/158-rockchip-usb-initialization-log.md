---
title: "Rockchip Linux USB Initialization Logs: Kernel 3.10 and 4.4"
description: "Rockchip Linux USB Initialization Logs: Kernel 3.10 and 4.4 — V1.1.1"
excerpt: "Rockchip Linux USB Initialization Logs: Kernel 3.10 and 4.4"
translation_key: "158-rockchip-usb-initialization-log"
slug: "158-rockchip-usb-initialization-log"
lang: "en"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, Linux]
---

{% raw %}

# Rockchip Linux USB Initialization Logs: Kernel 3.10 and 4.4

ArmSoM platform reference from Chinese source RK-KF-YF-099 V1.1.1, covering the listed Linux 3.10/4.4 SDKs and chips. The historical controller list must not be generalized to newer unlisted chips or every ArmSoM board. Verify the actual board, BSP, USB wiring and kernel; no hardware validation was performed. All logs are source examples, not ArmSoM measurements. No English PDF or independent technical figures were supplied; complete logs remain copyable text.

Source caveat: the two DWC3 paragraphs describe USB3.0/USB2.0 Root HUB bus numbers in an order that raises a conflict with adjacent idProduct=0002/0003 log entries. Both prose and logs are retained; verify actual descriptors rather than silently swapping numbers. Source log spellings such as wc_otg_hcd_suspend and ndroid_work are also preserved.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Linux USB subsystem overview

Linux provides USB driver frameworks and generic drivers from both host and device perspectives. The host side comprises USB Core, host-controller drivers, the hub driver and device-class drivers. The device side comprises the Gadget framework, device-controller drivers and class-specific Function drivers.

## 2. Rockchip SoC USB controllers

| Chip / controller | EHCI&OHCI | DWC2 | DWC3 |
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

### 3.1 Supported chips

This chapter describes Linux Kernel 3.10 initialization logs for platforms with a Kernel 3.10 SDK, including RV1108, RK312X, RK3288, RK322X, RK322XH, RK3328 and RK3368.

### 3.2 Host-side logs

#### 3.2.1 USB CORE

```text
01 [    0.959817]  usbcore: registered new interface driver usbfs
02 [    0.959890]  usbcore: registered new interface driver hub
03 [    0.960070]  usbcore: registered new device driver usb
...
```

These are the first three USB-module messages during Linux Kernel 3.10 startup. Line 01 registers the USB file system, corresponding to /sys/bus/usb/ after successful startup. Line 02 registers the USB hub driver. Line 03 registers the generic USB device driver, usb_generic_driver. Normally a USB device first matches usb_generic_driver as a device; after success, interfaces are created. Calling device_add() for an interface triggers matching between that interface and its driver.

#### 3.2.2 Device-class drivers

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

These are host-side device-class drivers, namely the host drivers for individual USB devices. Configure them through menuconfig.

```text
Location:
 |     -> Device Drivers
 |        -> USB support
 |        *** USB Device Class drivers ***
 |        < > xxx
 |        < > xxx
```

#### 3.2.3 Host-controller drivers

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

The complete EHCI initialization log gives basic controller information, including interrupt number, device virtual address and controller version. The controller is enumerated as a USB2.0 Root HUB (hub 3-0:1.0) assigned BUS Number 3.

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

The complete OHCI initialization log gives basic controller information, including interrupt number, device virtual address and controller version. The controller is enumerated as a USB1.1 Root HUB (hub 4-0:1.0) assigned BUS Number 4.

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

The complete DWC2 HOST initialization log gives the interrupt number, device virtual address and controller version (version 3.10a 21-DEC-2012). It is enumerated as a USB2.0 Root HUB (hub 5-0:1.0), assigned BUS Number 5.

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

DWC3 Host integrates an XHCI controller. This complete initialization log gives the interrupt number, controller physical address. The source describes separate USB3.0 Root HUB (hub 1-0:1.0) and USB2.0 Root HUB (hub 2-0:1.0) enumeration, with their assigned bus numbers.

## 4. Device-side logs

In the source context, Rockchip chips using the Kernel 3.10 SDK integrate only DWC2 IP, so DWC2 is the sole device controller. The kernel uses the dwc_otg_310 driver in drivers/usb/dwc_otg_310.

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

The device-controller initialization log also provides controller information. Lines 01–02 show software version 3.10a 21-DEC-2012 and IP version 3.10a.

It also shows the current controller operating mode and some parameter settings.

### 4.2 DWC2 Peripheral enumeration logs

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

This is the complete DWC2 peripheral enumeration log. Line 01 detects a USB ID change indicating cable insertion. Lines 03–07 reinitialize the controller. Line 10 detects VBUS. Lines 18–22 indicate successful enumeration and notify Android of the Gadget connection through a UEVENT event.

## 5. Kernel 4.4

### 5.1 Supported chips

This chapter describes Linux Kernel 4.4 initialization logs for platforms with a Kernel 4.4 SDK, including RK312X, RK3288, RK322X, RK322XH, RK3328, RK3366, RK3368 and RK3399.

### 5.2 Host-side logs

#### 5.2.1 USB CORE and device-class drivers

As in Linux Kernel 3.10, usbcore registers the USB file system, USB hub driver and generic USB device driver, producing the same logs. Device-class drivers also use the same logs and configuration method as Kernel 3.10.

#### 5.2.2 Host-controller drivers

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

The complete EHCI initialization log gives basic controller information, including interrupt number, device virtual address and controller driver version. The controller is enumerated as a USB2.0 Root HUB (hub 2-0:1.0) assigned BUS Number 2.

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

The complete OHCI initialization log gives basic controller information, including interrupt number, device virtual address and controller driver version. The controller is enumerated as a USB1.1 Root HUB (hub 3-0:1.0) assigned BUS Number 3.

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

This complete DWC2 HOST initialization log, like the other host-controller logs, gives the interrupt number, device virtual address and some controller configuration information.

The DWC2 HOST controller is enumerated as a USB2.0 Root HUB (hub 1-0:1.0), assigned BUS Number 1.

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

DWC3 Host integrates an XHCI controller. This complete initialization log gives the interrupt number, device virtual address and controller version. The source describes separate USB3.0 Root HUB (hub 4-0:1.0) and USB2.0 Root HUB (hub 5-0:1.0) enumeration, with their assigned bus numbers.

## 6. Device-side logs

Within the source platform scope, chips other than RK3399 integrate DWC2 OTG IP, while RK3399 integrates DWC3 OTG with USB3.0 support. Device-side logs are therefore discussed separately. In Kernel 4.4 the DWC2 driver is under drivers/usb/dwc2 and the DWC3 driver under drivers/usb/dwc3.

### 6.1 DWC2/DWC3 Peripheral

Under Kernel 4.4, when starting without a USB cable, DWC2 in OTG mode produces the same logs as DWC2 Host. In Peripheral mode it produces no special log output. DWC3 behaves similarly.

### 6.2 DWC2 Peripheral enumeration logs

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

This is the complete DWC2 Peripheral enumeration log. Lines 01–03: Android begins Gadget configuration. Lines 04–05: controller enumeration information. Line 06: enumeration succeeds and Gadget sends Connected to Android through Uevent. Line 10: Gadget sends Configured through Uevent, indicating successful configuration.

### 6.3 DWC3 Peripheral enumeration logs

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

This is the complete DWC3 Peripheral enumeration log. Line 01: FUSB302 detects cable insertion. Line 02: charger detection starts; the source calls it a standard charger because it is connected to a PC. Lines 06–07: Android begins Gadget configuration. Line 08: enumeration succeeds and Gadget sends Connected to Android via Uevent.

Lines 09–10: USB Config succeeds and Gadget sends the Configured success notification to Android via Uevent.

{% endraw %}
