---
title: "Rockchip USB 2.0: Funktions-, elektrische und Interoperabilitätstests"
description: "Rockchip USB 2.0: Funktions-, elektrische und Interoperabilitätstests — V1.0.0"
excerpt: "Rockchip USB 2.0: Funktions-, elektrische und Interoperabilitätstests"
translation_key: "161-rockchip-usb2-compliance-test"
slug: "161-rockchip-usb2-compliance-test"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, Compliance]
---

{% raw %}

# Rockchip USB 2.0: Funktions-, elektrische und Interoperabilitätstests

ArmSoM-Plattformreferenz nach der chinesischen Quelle RK-CS-YF-129 V1.0.0 (technischer Stand 2020). Die Quelle umfasst alle Rockchip-Chips (29/30/31/32/33/PX/RV-Familien und MCU) und Kernel; konkrete ArmSoM-Platine, USB-Topologie, BSP und Laboranforderungen sind gesondert zu prüfen. Keine Hardwaretests oder Zertifizierung durchgeführt. Kein englisches PDF und keine eigenständigen technischen Abbildungen vorhanden; die seitenübergreifende Tabelle ist editierbar. Zertifizierungsabläufe, Werkzeuganforderungen und Herstellerlisten sind historische Quellenaussagen, keine bestätigten aktuellen Regeln.

Quellenunklarheiten: Host FS ist Low-speed, Host LS Full-speed zugeordnet; Namen und Anforderungen widersprechen sich. Beide Geräte-Paketabstände heißen EL_22. Unverändert übernommen; vor dem Test mit der geltenden Spezifikation abgleichen.

[ArmSoM Docs](https://docs.armsom.org/)

## 1. USB-2.0-Funktionstests

Funktionstests prüfen den vollständigen Funktionsumfang des Produkts. USB-IF stellt USB20CV (USB 2.0 Command Verifier) bereit, um High-, Full- und Low-Speed-Geräte anhand des Device Framework (Kapitel 9), der Hub-Geräteklasse (Kapitel 11), HID- und OTG-Spezifikationen zu prüfen. Auch Massenspeicher- und Videoklassen-Testspezifikationen sind enthalten. Laut Quelle müssen alle USB-Peripheriegeräte und Hubs die Device-Framework-Tests zur Zertifizierung bestehen.

USB20CV unterstützt nur Windows. Die Quelle fordert Windows 7 oder neuer sowie einen Rechner mit EHCI-Unterstützung. Downloads:

- [USB20CV 32-bit Windows](https://usb.org/document-library/usb20cv-x32-bit)
- [USB20CV 64-bit Windows](https://usb.org/document-library/usb20cv-x64-bit)

## 2. Elektrische USB-2.0-Tests

Elektrische Tests prüfen vor allem die Signale. Die USB-2.0-Prüfspezifikationen definieren Produktkriterien [2][3]; laut Quelle müssen alle USB-Produkte die elektrischen Tests für die USB-IF-Zertifizierung bestehen. High-, Full- und Low-Speed-Signale sind abzudecken.

- Low/Full Speed: USB-IF Full and Low Speed Electrical and Interoperability Compliance Test Procedure.
- High Speed: USB 2.0 Electrical Compliance Test Specification.

Die Quelle nennt Keysight, Rohde & Schwarz, Tektronix und Teledyne LeCroy als von USB-IF anerkannte Oszilloskophersteller. Sie empfiehlt die Prüfungen in Tabelle 1 nach den Spezifikationen.

Tabelle 1: Wesentliche elektrische USB-2.0-Tests.

| Prüfung | Anforderung |
| --- | --- |
| Device HS Signal Quality Test | Referenz[2]<br>EL_2 EL_4 EL_5 Data Eye and Mask Test<br>EL_6 Device Rise Time<br>EL_6 Device Fall Time<br>EL_7 Device Non-Monotonic Edge Test |
| Device HS Packet Parameters | Referenz[2]<br>EL_21 Sync Field Length Test<br>EL_25 EOP Length Test<br>EL_22 Measure Interpacket Gap Between Second and Third Packets<br>EL_22 Measure Interpacket Gap Between First and Second Packets |
| Device HS Device CHIRP Timing | Referenz[2]<br>EL_28 Measure Device CHIRP-K Latency<br>EL_29 Measure Device CHIRP-K Duration<br>EL_31 Hi-Speed Terminations Enable and D+ Disconnect Time |
| Device HS Suspend/Resume/Reset Timing | Referenz[2]<br>EL_38 EL_39 Suspend Timing Response<br>EL_40 Resume Timing Response<br>EL_27 Device CHIRP Response to Reset from Hi-Speed<br>EL_28 Device CHIRP Response to Reset from Suspend |
| Device HS Test J/K, SE0_NAK | Referenz[2]<br>EL_8 J Test<br>EL_8 K Test<br>EL_9 SE0_NAK Test |
| Device HS Receiver Sensitivity | Referenz[2]<br>EL_18 Receiver sensitivity Test - Minimum SYNC Field<br>EL_17 Receiver sensitivity Test<br>EL_16 Receiver sensitivity Test @ Squelch |
| Host HS Signal Quality | Referenz[2]<br>EL_6 Rise Time<br>EL_6 Fall Time<br>EL_3 Data Eye and Mask Test<br>EL_7 Non-Monotonic Edge Test |
| Host HS Packet Parameters | Referenz[2]<br>EL_21 Sync Field Length Test<br>EL_25 EOP Length Test<br>EL_23 Inter-packet Gap Between First 2 Packets Test<br>EL_22 Inter-packet Gap Between 2nd and 3rd Packet Test<br>EL_55 SOF EOP Width Test |
| Host HS Disconnect Detect | Referenz[2]<br>EL_37 Disconnect Detect Test At 525mV Threshold<br>EL_36 Disconnect Detect Test At 625mV Threshold |
| Host HS CHIRP Timing | Referenz[2]<br>EL_33 CHIRP Timing Response<br>EL_34 CHIRP K Width<br>EL_34 CHIRP J Width<br>EL_35 SOF Timing Response |
| Host HS Suspend/Resume Timing | Referenz[2]<br>EL_39 Suspend Timing Response<br>EL_41 Resume Timing Response |
| Host HS Test J/K, SE0_NAK | Referenz[2]<br>EL_8 J Test<br>EL_8 K Test<br>EL_9 SE0_NAK Test |
| Host LS/FS Inrush Current Test | Referenz[3]<br>B.4 Inrush Current Testing |
| Host FS Signal Quality Test | Referenz[3]<br>B.3.3.1 Low-speed Downstream Signal Quality Test |
| Host LS Signal Quality Test | Referenz[3]<br>B.3.3.2 Full-speed Downstream Signal Quality Test |

Tabelle 1 prüft vor allem die High-Speed-Signalqualität. Die Quelle stellt HSETT (High-Speed Electrical Test Tool) für Windows mit den folgenden Downloadlinks vor; die Anleitung heißt HSET Documentation version 0.41 for EHCI and xHCI.

- [EHSETT 32-bit](https://usb.org/document-library/usbhset-ehci-32-bit)
- [EHSETT 64-bit](https://usb.org/document-library/usbhset-ehci-64-bit)
- [XHSETT 32-bit](https://usb.org/document-library/xhsett-x32)
- [XHSETT 64-bit](https://usb.org/document-library/xhsett-x64)
- [HSET Documentation version 0.41 for EHCI and xHCI](https://usb.org/document-library/hset-documentation-version-041-ehci-and-xhci)

Für Device/Host HS Signal Quality muss das Prüfgerät in den Test Packet Mode wechseln, damit das richtige Signal entsteht. Rockchip-Controller verwenden Testbefehle oder HSETT unter folgenden Einschränkungen:

- USB 2.0 Device: Testbefehle oder Werkzeug können den Test Packet Mode aktivieren.
- USB 2.0 Host: nur Testbefehle können ihn aktivieren.

Befehle stehen im Abschnitt „USB 2.0 test commands and test tools“ von Rockchip_Developer_Guide_USB_SQ_Test_CN.

## 3. USB-2.0-Interoperabilitätstests

Interoperabilitätstests prüfen die Kompatibilität mit unterschiedlichen Betriebssystemen und Hardwarecontrollern. „Gold Tree“-Geräte können die Zusammenarbeit mit verschiedenen Hosts prüfen, beispielsweise erfolgreiche Enumeration an einem EHCI-Host. Laut Quelle waren USB-2.0-Interoperabilitätstests damals bei USB-IF nicht verpflichtend und werden deshalb nicht näher erläutert. Methoden stehen in xHCI Interoperability Test Procedures For Peripherals, Hubs and Hosts Version.

- [xHCI Interoperability Test Procedures](https://usb.org/document-library/xhci-interoperability-test-procedures-peripherals-hubs-and-hosts-version)

## 4. USB-2.0-Zertifizierung

USB-2.0-Zertifizierung bedeutet das Bestehen der USB-IF-Tests und die Erlaubnis zur Nutzung des USB-Logos. Die Quelle nennt zwei Wege: von USB-IF unterstützte Compliance-Workshops oder anerkannte unabhängige Labore (https://www.usb.org/labs). Nach Bestehen wird laut Quelle eine TESTING ID (TID) vergeben, mit der Geräteinformationen auf der USB-IF-Website auffindbar sind und die Logonutzung ermöglicht wird.

Allgemeiner Ablauf laut Quelle:

1. USB-IF-Mitgliedschaft beantragen und Vendor ID (VID) erhalten.
2. USB-Compliance-Testcheckliste vorbereiten.
3. Produkt an ein autorisiertes unabhängiges Labor übergeben.
4. Positiven Bericht und Zertifikat erhalten.
5. Entsprechendes USB-Logo verwenden.

Die Quelle nennt Rockchip als USB-IF-Mitglied mit VID 0x2207, zugleich SDK-Standardwert. Diese VID dient nur Entwicklung/Debugging und wird Entwicklern nicht zur Produktzertifizierung überlassen; laut Quelle sollen sie selbst Mitgliedschaft und eindeutige Vendor ID beantragen. Dies ist der Ablauf aus der Quelle von 2020, kein Ersatz für aktuelle USB-IF-Lizenzbedingungen.

## 5. Referenzen

1. [USB 2.0 Testing Information](https://usb.org/usb2)

2. [USB 2.0 Electrical Compliance Test Specification](https://usb.org/document-library/usb-20-electrical-compliance-test-specification-version-107)

3. [USB-IF Full and Low Speed Electrical and Interoperability Compliance Test Procedure](https://usb.org/document-library/usb-if-full-and-low-speed-electrical-and-interoperability-compliance-test)

4. [HSET Documentation version 0.41 for EHCI and xHCI](https://usb.org/document-library/hset-documentation-version-041-ehci-and-xhci)

5. `Rockchip_Developer_Guide_USB_SQ_Test_CN`

{% endraw %}
