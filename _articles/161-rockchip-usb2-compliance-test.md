---
title: "Rockchip USB 2.0 Compliance: Functional, Electrical and Interoperability Tests"
description: "Rockchip USB 2.0 Compliance: Functional, Electrical and Interoperability Tests — V1.0.0"
excerpt: "Rockchip USB 2.0 Compliance: Functional, Electrical and Interoperability Tests"
translation_key: "161-rockchip-usb2-compliance-test"
slug: "161-rockchip-usb2-compliance-test"
lang: "en"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, Compliance]
---

{% raw %}

# Rockchip USB 2.0 Compliance: Functional, Electrical and Interoperability Tests

ArmSoM platform reference based on Chinese source RK-CS-YF-129 V1.0.0 (2020 technical context). The source covers all Rockchip chips (29/30/31/32/33/PX/RV families and MCU) and kernels, but the particular ArmSoM board, USB topology, BSP and laboratory requirements need separate verification. No hardware test or certification was performed. No English PDF or independent technical figures were supplied; the page-spanning table is editable. Certification procedures, tool requirements and vendor lists below are historical source statements, not verified current policies.

Source ambiguities: Host FS is paired with Low-speed and Host LS with Full-speed; the names and requirements conflict. Both device interpacket-gap entries say EL_22. Preserved as written; verify against the applicable specification before testing.

[ArmSoM Docs](https://docs.armsom.org/)

## 1. USB 2.0 functional testing

Functional testing checks whether the product implements the required functions. USB-IF provides USB20CV (USB 2.0 Command Verifier) to assess high-, full- and low-speed devices against the device framework (Chapter 9), hub device class (Chapter 11), HID class and OTG specifications. It also covers mass-storage and video-class test specifications. The source requires all USB peripherals and hubs to pass device-framework tests for certification.

USB20CV supports Windows only. The source requires Windows 7 or later and a host supporting EHCI. Downloads:

- [USB20CV 32-bit Windows](https://usb.org/document-library/usb20cv-x32-bit)
- [USB20CV 64-bit Windows](https://usb.org/document-library/usb20cv-x64-bit)

## 2. USB 2.0 electrical testing

Electrical testing primarily checks signals. The USB 2.0 electrical test specifications define product test criteria [2][3]; the source requires all USB products to pass electrical tests for USB-IF certification. High-, full- and low-speed signals must be covered.

- Low/full speed: USB-IF Full and Low Speed Electrical and Interoperability Compliance Test Procedure.
- High speed: USB 2.0 Electrical Compliance Test Specification.

The source lists Keysight, Rohde & Schwarz, Tektronix and Teledyne LeCroy as USB-IF-recognized oscilloscope vendors. It recommends the tests in Table 1 according to the specifications.

Table 1: Main USB 2.0 electrical tests.

| Test item | Requirement |
| --- | --- |
| Device HS Signal Quality Test | Reference[2]<br>EL_2 EL_4 EL_5 Data Eye and Mask Test<br>EL_6 Device Rise Time<br>EL_6 Device Fall Time<br>EL_7 Device Non-Monotonic Edge Test |
| Device HS Packet Parameters | Reference[2]<br>EL_21 Sync Field Length Test<br>EL_25 EOP Length Test<br>EL_22 Measure Interpacket Gap Between Second and Third Packets<br>EL_22 Measure Interpacket Gap Between First and Second Packets |
| Device HS Device CHIRP Timing | Reference[2]<br>EL_28 Measure Device CHIRP-K Latency<br>EL_29 Measure Device CHIRP-K Duration<br>EL_31 Hi-Speed Terminations Enable and D+ Disconnect Time |
| Device HS Suspend/Resume/Reset Timing | Reference[2]<br>EL_38 EL_39 Suspend Timing Response<br>EL_40 Resume Timing Response<br>EL_27 Device CHIRP Response to Reset from Hi-Speed<br>EL_28 Device CHIRP Response to Reset from Suspend |
| Device HS Test J/K, SE0_NAK | Reference[2]<br>EL_8 J Test<br>EL_8 K Test<br>EL_9 SE0_NAK Test |
| Device HS Receiver Sensitivity | Reference[2]<br>EL_18 Receiver sensitivity Test - Minimum SYNC Field<br>EL_17 Receiver sensitivity Test<br>EL_16 Receiver sensitivity Test @ Squelch |
| Host HS Signal Quality | Reference[2]<br>EL_6 Rise Time<br>EL_6 Fall Time<br>EL_3 Data Eye and Mask Test<br>EL_7 Non-Monotonic Edge Test |
| Host HS Packet Parameters | Reference[2]<br>EL_21 Sync Field Length Test<br>EL_25 EOP Length Test<br>EL_23 Inter-packet Gap Between First 2 Packets Test<br>EL_22 Inter-packet Gap Between 2nd and 3rd Packet Test<br>EL_55 SOF EOP Width Test |
| Host HS Disconnect Detect | Reference[2]<br>EL_37 Disconnect Detect Test At 525mV Threshold<br>EL_36 Disconnect Detect Test At 625mV Threshold |
| Host HS CHIRP Timing | Reference[2]<br>EL_33 CHIRP Timing Response<br>EL_34 CHIRP K Width<br>EL_34 CHIRP J Width<br>EL_35 SOF Timing Response |
| Host HS Suspend/Resume Timing | Reference[2]<br>EL_39 Suspend Timing Response<br>EL_41 Resume Timing Response |
| Host HS Test J/K, SE0_NAK | Reference[2]<br>EL_8 J Test<br>EL_8 K Test<br>EL_9 SE0_NAK Test |
| Host LS/FS Inrush Current Test | Reference[3]<br>B.4 Inrush Current Testing |
| Host FS Signal Quality Test | Reference[3]<br>B.3.3.1 Low-speed Downstream Signal Quality Test |
| Host LS Signal Quality Test | Reference[3]<br>B.3.3.2 Full-speed Downstream Signal Quality Test |

Table 1 mainly tests high-speed signal quality. The source provides the Windows-based HSETT (High-Speed Electrical Test Tool) and the following download links; its manual is HSET Documentation version 0.41 for EHCI and xHCI.

- [EHSETT 32-bit](https://usb.org/document-library/usbhset-ehci-32-bit)
- [EHSETT 64-bit](https://usb.org/document-library/usbhset-ehci-64-bit)
- [XHSETT 32-bit](https://usb.org/document-library/xhsett-x32)
- [XHSETT 64-bit](https://usb.org/document-library/xhsett-x64)
- [HSET Documentation version 0.41 for EHCI and xHCI](https://usb.org/document-library/hset-documentation-version-041-ehci-and-xhci)

For Device/Host HS Signal Quality tests, the device under test must enter Test Packet Mode to generate the correct signal. Rockchip controllers use test commands or HSETT, subject to these restrictions:

- USB 2.0 Device: either test commands or the tool can enter Test Packet Mode.
- USB 2.0 Host: only test commands can enter Test Packet Mode.

For commands, see “USB 2.0 test commands and test tools” in Rockchip_Developer_Guide_USB_SQ_Test_CN.

## 3. USB 2.0 interoperability testing

Interoperability testing checks compatibility with different operating systems and hardware controllers. “Gold Tree” devices may test interaction with different hosts, for example successful enumeration on an EHCI host. The source says USB-IF did not mandate USB 2.0 interoperability testing at that time, so it does not detail it. See xHCI Interoperability Test Procedures For Peripherals, Hubs and Hosts Version for methods.

- [xHCI Interoperability Test Procedures](https://usb.org/document-library/xhci-interoperability-test-procedures-peripherals-hubs-and-hosts-version)

## 4. USB 2.0 certification

USB 2.0 certification means passing USB-IF tests and obtaining permission to use the USB logo. The source lists two test routes: USB-IF-sponsored compliance workshops or USB-IF-recognized independent laboratories (https://www.usb.org/labs). It says passing yields a TESTING ID (TID), allowing device information to be found on the USB-IF website and qualifying for logo use.

The source describes this general process:

1. Apply for USB-IF membership and obtain a Vendor ID (VID).
2. Prepare the USB compliance test checklist.
3. Submit the product to an authorized independent laboratory.
4. Obtain the passing report and certificate.
5. Use the corresponding USB logo.

The source identifies Rockchip as a USB-IF member with VID 0x2207, also the SDK default. It says this VID is only for development/debugging and cannot be licensed to developers for product certification; developers should independently apply for membership to obtain a unique Vendor ID. This is the 2020 source procedure, not a substitute for current USB-IF licensing terms.

## 5. References

1. [USB 2.0 Testing Information](https://usb.org/usb2)

2. [USB 2.0 Electrical Compliance Test Specification](https://usb.org/document-library/usb-20-electrical-compliance-test-specification-version-107)

3. [USB-IF Full and Low Speed Electrical and Interoperability Compliance Test Procedure](https://usb.org/document-library/usb-if-full-and-low-speed-electrical-and-interoperability-compliance-test)

4. [HSET Documentation version 0.41 for EHCI and xHCI](https://usb.org/document-library/hset-documentation-version-041-ehci-and-xhci)

5. `Rockchip_Developer_Guide_USB_SQ_Test_CN`

{% endraw %}
