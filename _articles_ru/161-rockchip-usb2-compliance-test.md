---
title: "Rockchip USB 2.0: функциональные, электрические испытания и совместимость"
description: "Rockchip USB 2.0: функциональные, электрические испытания и совместимость — V1.0.0"
excerpt: "Rockchip USB 2.0: функциональные, электрические испытания и совместимость"
translation_key: "161-rockchip-usb2-compliance-test"
slug: "161-rockchip-usb2-compliance-test"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, Compliance]
---

{% raw %}

# Rockchip USB 2.0: функциональные, электрические испытания и совместимость

Платформенный материал для ArmSoM по китайскому RK-CS-YF-129 V1.0.0 (контекст 2020 года). Источник охватывает все чипы Rockchip (семейства 29/30/31/32/33/PX/RV и MCU) и ядра, но конкретную плату ArmSoM, топологию USB, BSP и требования лаборатории нужно проверить отдельно. Аппаратные испытания и сертификация не выполнялись. Английского PDF и отдельных технических рисунков нет; многостраничная таблица восстановлена редактируемой. Порядок сертификации, требования инструментов и список поставщиков ниже относятся к историческому источнику, не подтверждают действующие правила.

Неясности источника: Host FS сопоставлен с Low-speed, Host LS — с Full-speed; названия и требования расходятся. Оба межпакетных интервала устройства обозначены EL_22. Сохранено без исправления; перед испытанием сверить с применимой спецификацией.

[ArmSoM Docs](https://docs.armsom.org/)

## 1. Функциональные испытания USB 2.0

Функциональные испытания проверяют полноту функций изделия. USB-IF предоставляет USB20CV (USB 2.0 Command Verifier) для проверки высоко-, полно- и низкоскоростных устройств по требованиям структуры устройства (глава 9), класса концентраторов (глава 11), HID и OTG. Также охватываются спецификации испытаний классов массовых накопителей и видео. Согласно источнику, все периферийные устройства и концентраторы должны пройти проверку структуры устройства для сертификации.

USB20CV поддерживает только Windows. В источнике требуются Windows 7 или новее и поддержка EHCI на компьютере. Загрузка:

- [USB20CV 32-bit Windows](https://usb.org/document-library/usb20cv-x32-bit)
- [USB20CV 64-bit Windows](https://usb.org/document-library/usb20cv-x64-bit)

## 2. Электрические испытания USB 2.0

Электрические испытания прежде всего проверяют сигналы. Спецификации USB 2.0 задают критерии [2][3]; источник требует прохождения электрических испытаний всеми USB-изделиями для сертификации USB-IF. Проверяют высоко-, полно- и низкоскоростные сигналы.

- Низкая/полная скорость: USB-IF Full and Low Speed Electrical and Interoperability Compliance Test Procedure.
- Высокая скорость: USB 2.0 Electrical Compliance Test Specification.

Источник перечисляет признанных USB-IF поставщиков осциллографов: Keysight, Rohde & Schwarz, Tektronix, Teledyne LeCroy. Рекомендуются испытания таблицы 1 согласно спецификациям.

Таблица 1. Основные электрические испытания USB 2.0.

| Испытание | Требование |
| --- | --- |
| Device HS Signal Quality Test | Источник[2]<br>EL_2 EL_4 EL_5 Data Eye and Mask Test<br>EL_6 Device Rise Time<br>EL_6 Device Fall Time<br>EL_7 Device Non-Monotonic Edge Test |
| Device HS Packet Parameters | Источник[2]<br>EL_21 Sync Field Length Test<br>EL_25 EOP Length Test<br>EL_22 Measure Interpacket Gap Between Second and Third Packets<br>EL_22 Measure Interpacket Gap Between First and Second Packets |
| Device HS Device CHIRP Timing | Источник[2]<br>EL_28 Measure Device CHIRP-K Latency<br>EL_29 Measure Device CHIRP-K Duration<br>EL_31 Hi-Speed Terminations Enable and D+ Disconnect Time |
| Device HS Suspend/Resume/Reset Timing | Источник[2]<br>EL_38 EL_39 Suspend Timing Response<br>EL_40 Resume Timing Response<br>EL_27 Device CHIRP Response to Reset from Hi-Speed<br>EL_28 Device CHIRP Response to Reset from Suspend |
| Device HS Test J/K, SE0_NAK | Источник[2]<br>EL_8 J Test<br>EL_8 K Test<br>EL_9 SE0_NAK Test |
| Device HS Receiver Sensitivity | Источник[2]<br>EL_18 Receiver sensitivity Test - Minimum SYNC Field<br>EL_17 Receiver sensitivity Test<br>EL_16 Receiver sensitivity Test @ Squelch |
| Host HS Signal Quality | Источник[2]<br>EL_6 Rise Time<br>EL_6 Fall Time<br>EL_3 Data Eye and Mask Test<br>EL_7 Non-Monotonic Edge Test |
| Host HS Packet Parameters | Источник[2]<br>EL_21 Sync Field Length Test<br>EL_25 EOP Length Test<br>EL_23 Inter-packet Gap Between First 2 Packets Test<br>EL_22 Inter-packet Gap Between 2nd and 3rd Packet Test<br>EL_55 SOF EOP Width Test |
| Host HS Disconnect Detect | Источник[2]<br>EL_37 Disconnect Detect Test At 525mV Threshold<br>EL_36 Disconnect Detect Test At 625mV Threshold |
| Host HS CHIRP Timing | Источник[2]<br>EL_33 CHIRP Timing Response<br>EL_34 CHIRP K Width<br>EL_34 CHIRP J Width<br>EL_35 SOF Timing Response |
| Host HS Suspend/Resume Timing | Источник[2]<br>EL_39 Suspend Timing Response<br>EL_41 Resume Timing Response |
| Host HS Test J/K, SE0_NAK | Источник[2]<br>EL_8 J Test<br>EL_8 K Test<br>EL_9 SE0_NAK Test |
| Host LS/FS Inrush Current Test | Источник[3]<br>B.4 Inrush Current Testing |
| Host FS Signal Quality Test | Источник[3]<br>B.3.3.1 Low-speed Downstream Signal Quality Test |
| Host LS Signal Quality Test | Источник[3]<br>B.3.3.2 Full-speed Downstream Signal Quality Test |

Таблица 1 в основном проверяет качество высокоскоростных сигналов. Источник предлагает HSETT (High-Speed Electrical Test Tool) для Windows и ссылки ниже; руководство — HSET Documentation version 0.41 for EHCI and xHCI.

- [EHSETT 32-bit](https://usb.org/document-library/usbhset-ehci-32-bit)
- [EHSETT 64-bit](https://usb.org/document-library/usbhset-ehci-64-bit)
- [XHSETT 32-bit](https://usb.org/document-library/xhsett-x32)
- [XHSETT 64-bit](https://usb.org/document-library/xhsett-x64)
- [HSET Documentation version 0.41 for EHCI and xHCI](https://usb.org/document-library/hset-documentation-version-041-ehci-and-xhci)

Для Device/Host HS Signal Quality проверяемое устройство должно войти в Test Packet Mode, чтобы сформировать правильный сигнал. Контроллеры Rockchip используют команды или HSETT со следующими ограничениями:

- USB 2.0 Device: вход в Test Packet Mode командами либо инструментом.
- USB 2.0 Host: вход только командами.

Команды приведены в разделе «USB 2.0 test commands and test tools» документа Rockchip_Developer_Guide_USB_SQ_Test_CN.

## 3. Проверка совместимости USB 2.0

Проверяют совместимость USB-устройства с различными ОС и аппаратными контроллерами. Устройства «Gold Tree» могут использоваться для проверки взаимодействия с разными хостами, например успешного перечисления на EHCI. Источник сообщает, что тогда USB-IF не требовал обязательных испытаний совместимости USB 2.0, поэтому не раскрывает их подробно. Методики см. в xHCI Interoperability Test Procedures For Peripherals, Hubs and Hosts Version.

- [xHCI Interoperability Test Procedures](https://usb.org/document-library/xhci-interoperability-test-procedures-peripherals-hubs-and-hosts-version)

## 4. Сертификация USB 2.0

Сертификация USB 2.0 означает прохождение испытаний USB-IF и получение разрешения на логотип USB. Источник перечисляет два варианта: спонсируемые USB-IF мероприятия по проверке соответствия либо признанные независимые лаборатории (https://www.usb.org/labs). После успешных испытаний, по источнику, присваивается TESTING ID (TID), позволяющий найти устройство на сайте USB-IF и получить право на логотип.

Общий процесс в источнике:

1. Подать заявку на членство USB-IF и получить Vendor ID (VID).
2. Подготовить контрольный список испытаний.
3. Передать изделие уполномоченной независимой лаборатории.
4. Получить положительный отчёт и сертификат.
5. Использовать соответствующий логотип USB.

Источник называет Rockchip членом USB-IF с VID 0x2207, также заданным в SDK по умолчанию. Этот VID предназначен только для разработки/отладки и не предоставляется разработчикам для сертификации изделия; источник предлагает самостоятельно вступить в USB-IF для получения уникального Vendor ID. Это порядок из документа 2020 года, а не замена действующих условий USB-IF.

## 5. Источники

1. [USB 2.0 Testing Information](https://usb.org/usb2)

2. [USB 2.0 Electrical Compliance Test Specification](https://usb.org/document-library/usb-20-electrical-compliance-test-specification-version-107)

3. [USB-IF Full and Low Speed Electrical and Interoperability Compliance Test Procedure](https://usb.org/document-library/usb-if-full-and-low-speed-electrical-and-interoperability-compliance-test)

4. [HSET Documentation version 0.41 for EHCI and xHCI](https://usb.org/document-library/hset-documentation-version-041-ehci-and-xhci)

5. `Rockchip_Developer_Guide_USB_SQ_Test_CN`

{% endraw %}
