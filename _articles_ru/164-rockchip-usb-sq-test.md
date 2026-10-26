---
title: "Rockchip USB: руководство по целостности сигнала и соответствию"
description: "Rockchip USB: руководство по целостности сигнала и соответствию — V2.7.0"
excerpt: "Rockchip USB: руководство по целостности сигнала и соответствию"
translation_key: "164-rockchip-usb-sq-test"
slug: "164-rockchip-usb-sq-test"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, PHY, Linux]
---

{% raw %}

# Rockchip USB: руководство по целостности сигнала и соответствию

Платформенный справочник: китайский источник V2.7.0 (RK-CS-YF-094) перечисляет серии 29/30/31/32/33/35, PX, RV, Sofia, MCU и все версии ядра; это не обещание поддержки всех плат ArmSoM. Проверяйте SoC, контроллер, порт, BSP, ядро и TRM, особенно питание/роль Type-C. Это примеры источника, не измерения ArmSoM. Есть только китайский PDF; его оригинальные изображения сохранены во всех языках.

Внимание: io напрямую пишет регистры; переключение питания/режимов рискованно, команды не выполнялись. Сохранены сомнения: некоторые cat sys/... без начального слеша; Host назван Device; BER записан 10e-12; для Device текст указывает 11 дюймов, снимок 5; граница 10 cm не определена. Таблица 6 в разделе Device имеет колонки Host. Адреса/константы не исправлены догадками.

Техническое предисловие: USB2 охватывает High/Full/Low Speed, подробно High-Speed Signal Quality и Receiver Sensitivity. Для USB3 подробно дан Tx Compliance; для Rx только принципы и меры. Контроллеры Rockchip независимы: до выбора команды изучите TRM. Приборы Agilent, Tektronix, LeCroy: следуйте руководству производителя. Все USB-команды относятся к проверяемому порту.

Другие проверки USB2: Packet Parameters, CHIRP Timing, Suspend/Resume/Reset Timing, Test J/K, SE0_NAK. Команды даны по модели контроллера и требуют знаний ПО; для поиска по имени порта на схеме используйте Rockchip USB SQ Tool.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. USB 2.0 Compliance Test

### 1.1 Испытания соответствия USB2

USB 2.0 Tx Signal Quality проверяет глазковую диаграмму, скорость сигнала, ширину конца пакета, диапазон напряжения пересечения (Low/Full Speed), джиттер JK/KJ и последовательный джиттер, монотонность (High Speed), время нарастания/спада. USB 2.0 Rx Receiver Sensitivity проверяет чувствительность, порог подавления и минимальное поле SYNC.

### 1.2 Команды и средства USB2 Tx

USB 2.0 Tx SQ задаёт регистр Test Control для перехода в Test Packet Mode. Контроллер непрерывно передаёт периодический шаблон, а осциллограф анализирует целостность сигнала. Порты Device Rockchip включают режим командами или инструментом, Host — только командами.

#### 1.2.1 Команды и средства USB2 Device Tx

Команды USB 2.0 Device SQ приведены в таблице 1 и вводятся через UART или ADB. Таблица 1: команды USB 2.0 Device SQ.

| Микросхема | DWC2_0 OTG 2.0<br>Device | DWC3_0 OTG 2.0 device | DWC3_1 OTG 2.0 device |
| --- | --- | --- | --- |
| RK1808 | N.A | io -4 0xfd00c704 0x8c000a08 | N.A |
| RK1820 | N.A | io -4 0x102500c704 0x8c000a08 | io -4 0x102400c704 0x8c000a08 |
| RK2108 | io -4 0x41300804 0x40 | N.A | N.A |
| RK2116 | io -4 0x40040804 0x40 | N.A | N.A |
| RK2118 | io -4 0x50040804 0x40 | N.A | N.A |
| RK2206 | io -4 0x43040804 0x40 | N.A | N.A |
| RK29XX<br>RK30XX<br>RK31XX | io -4 0x10180804 0x40 | N.A | N.A |
| RK3228<br>RK3229 | io -4 0x30040804 0x40 | N.A | N.A |
| RK3288<br>RK3228H<br>RK3328<br>RK3368 | io -4 0xff580804 0x40 | N.A | N.A |
| RK3308<br>RK3308B-S<br>RK3308H-S | io -4 0xff400804 0x40 | N.A | N.A |
| RK3326<br>RK3326S<br>PX30<br>PX30S | io -4 0xff300804 0x40 | N.A | N.A |
| RV1103<br>RV1106 | N.A | io -4 0xffb0c704 0x8c000a08 | N.A |
| RV1103B | N.A | io -4 0x20b0c704 0x8c000a08 | N.A |
| RV1108 | io -4 0x30180804 0x40 | N.A | N.A |
| RV1126<br>RV1109 | N.A | io -4 0xffd0c704 0x8c000a08 | N.A |
| RV1126B | N.A | io -4 0x2150c704 0x8c000a08 | N.A |
| SOFIA-3GR | io -4 0xe2100804 0x40 | N.A | N.A |
| RK3366 | io -4 0xff4c0804 0x40 | io -4 0xff50c704 0x8c000a08 | N.A |
| RK3399 | N.A | io -4 0xfe80c704 0x8c000a08 | io -4 0xfe90c704 0x8c000a08 |
| RK3506 | io -4 0xff740804 0x40 | N.A | N.A |
| RK3528 | N.A | io -4 0xfe50c704 0x8c000a08 | N.A |
| RK3538 | N.A | io -4 0xfc00c704 0x8c000a08 | N.A |
| RK3562 | N.A | io -4 0xfe50c704 0x8c000a08 | N.A |
| RK3576 | N.A | io -4 0x2300c704 0x8c000a08 | io -4 0x2340c704 0x8c000a08 |
| RK3566<br>RK3568 | N.A | io -4 0xfcc0c704 0x8c000a08 | N.A |
| RK625 | io -4 0x40180804 0x40 | N.A | N.A |
| RK3588<br>RK3588S | N.A | io -4 0xfc00c704 0x8c000a08 | io -4 0xfc40c704 0x8c000a08 |

Команда RK3506 OTG1 Device: `io -4 0xff780804 0x40`. Альтернатива — USB HSET от USB-IF: USBHSET for EHCI или XHCI. Загрузка:

- EHCI 32-bit: https://www.usb.org/document-library/usbhset-ehci-32-bit
- EHCI 64-bit: https://www.usb.org/document-library/usbhset-ehci-64-bit
- xHCI 32-bit: https://www.usb.org/document-library/xhsett-x32
- xHCI 64-bit: https://www.usb.org/document-library/xhsett-x64e (ссылка источника)

Порядок работы:

1. Подключите проверяемый Device-порт к ПК USB-кабелем.

2. Откройте инструмент, выберите Device и нажмите TEST (рис. 1).

![Рисунок источника — PDF p9](/docs/rockchip-usb-sq-test/assets/cn-p009-figure-01.png)

Рисунок 1. Выбор типа теста.

3. Выберите устройство и TEST PACKET, нажмите EXECUTE (рис. 2). Контроллер входит в Test Packet Mode и передаёт периодические пакеты с формой сигнала рис. 3.

![Рисунок источника — PDF p9](/docs/rockchip-usb-sq-test/assets/cn-p009-figure-02.png)

Рисунок 2. Выбор устройства и команды.

![Рисунок источника — PDF p10](/docs/rockchip-usb-sq-test/assets/cn-p010-figure-01.png)

Рисунок 3. Тестовая форма сигнала.

#### 1.2.2 Команды USB2 Host Tx

USB 2.0 Host SQ требует команд, отдельного инструмента нет. Вводите команды таблиц 2–4 через ADB или UART. Таблица 2: команды USB 2.0 Host SQ (a).

| Микросхема | DWC2_0 OTG Host 2.0 | DWC2_1 Host 2.0 | EHCI_0 Host 2.0 |
| --- | --- | --- | --- |
| RK1808 | N.A | N.A | io -4 0xffd80054 0x40000 |
| RK2116 | io -4 0x40040440 0x8000 | N.A | N.A |
| RK2118 | io -4 0x50040440 0x8000 | N.A | N.A |
| RK2206 | io -4 0x43040440 0x8000 | N.A | N.A |
| RK29XX<br>RK30XX<br>RK3188 | io -4 0x10180440 0x8000 | io -4 0x101c0440 0x8000 | N.A |
| RK312X | io -4 0x10180440 0x8000 | io -4 0x101c0440 0x8000 | io -4 0x101c0054 0x40000 |
| RK3228<br>RK3229 | io -4 0x30040440 0x8000 | N.A | io -4 0x30080054 0x40000 |
| RK3288 | io -4 0xff580440 0x8000 | io -4 0xff540440 0x8000 | io -4 0xff500054 0x40000 |
| RK3308<br>RK3308B-S<br>RK3308H-S | io -4 0xff400440 0x8000 | N.A | io -4 0xff440054 0x40000 |
| RK3326<br>RK3326S | io -4 0xff300440 0x8000 | N.A | N.A |
| PX30<br>PX30S | io -4 0xff300440 0x8000 | N.A | io -4 0xff340054 0x40000 |
| RK3228H<br>RK3328 | io -4 0xff580440 0x8000 | N.A | io -4 0xff5c0054 0x40000 |
| RK3366 | io -4 0xff4c0440 0x8000 | N.A | io -4 0xff480054 0x40000 |
| RK3368 | io -4 0xff580440 0x8000 | N.A | io -4 0xff500054 0x40000 |
| RV1108 | io -4 0x30180440 0x8000 | N.A | io -4 0x30140054 0x40000 |
| RV1126<br>RV1109 | N.A | N.A | io -4 0xffe00054 0x40000 |
| RV1126B | N.A | N.A | io -4 0x21480054 0x40000 |
| SOFIA-3GR | io -4 0xe2100440 0x8000 | N.A | N.A |
| RK3399 | N.A | N.A | io -4 0xfe380054 0x40000 |
| RK3506 | io -4 0xff740440 0x8000 | io -4 0xff780440 0x8000 | N.A |
| RK3528 | N.A | N.A | io -4 0xff100054 0x40000 |
| RK3538 | N.A | N.A | io -4 0xfc100054 0x40000 |
| RK3562 | N.A | N.A | io -4 0xfed00054 0x40000 |
| RK3566<br>RK3568 | N.A | N.A | io -4 0xfd800054 0x40000 |
| RK3588<br>RK3588S | N.A | N.A | io -4 0xfc800054 0x40000 |

Таблица 3. Команды USB 2.0 Host SQ (b).

| Микросхема | EHCI_1 Host 2.0 | EHCI_2 Host 2.0 | EHCI_HSIC Host 2.0 |
| --- | --- | --- | --- |
| RK3168<br>RK3188 | N.A | N.A | io -4 0x10240054 0x40000 |
| RK3288 | N.A | N.A | io -4 0xff5c0054 0x40000 |
| RK3228<br>RK3229 | io -4 0x300c0054 0x40000 | io -4 0x30100054 0x40000 | N.A |
| RK3368 | N.A | N.A | io -4 0xff5c0054 0x40000 |
| RK3399 | io -4 0xfe3c0054 0x40000 | N.A | io -4 0xfe340054 0x40000 |
| RK3566<br>RK3568 | io -4 0xfd880054 0x40000 | N.A | N.A |
| RK3588<br>RK3588S | io -4 0xfc880054 0x40000 | N.A | N.A |

Таблица 4. Команды USB 2.0 Host SQ (c).

| Микросхема | DWC3_0 OTG Host 2.0 | DWC3_1 OTG Host 2.0 |
| --- | --- | --- |
| RK1808 | io -4 0xfd000424 0x40000000 | N.A |
| RK1820 | io -4 0x1025000424 0x40000000 | io -4 0x1024000424 0x40000000 |
| RK3228H | io -4 0xff600424 0x40000000 | N.A |
| RK3366 | io -4 0xff500424 0x40000000 | N.A |
| RK3399 | io -4 0xfe800424 0x40000000 | io -4 0xfe900424 0x40000000 |
| RV1103<br>RV1106 | io -4 0xffb00424 0x40000000 | N.A |
| RV1103B | io -4 0x20b00424 0x40000000 | N.A |
| RV1126<br>RV1109 | io -4 0xffd00424 0x40000000 | N.A |
| RV1126B | io -4 0x21500424 0x40000000 | N.A |
| RK3528 | io -4 0xfe500424 0x40000000 | N.A |
| RK3538 | io -4 0xfc000424 0x40000000 | N.A |
| RK3562 | io -4 0xfe500424 0x40000000 | N.A |
| RK3566<br>RK3568 | io -4 0xfcc00424 0x40000000 | io -4 0xfd000424 0x40000000 |
| RK3576 | io -4 0x23000424 0x40000000 | io -4 0x23400424 0x40000000 |
| RK3588<br>RK3588S | io -4 0xfc000424 0x40000000 | io -4 0xfc400424 0x40000000 |

### 1.3 Стенд USB2 Tx

Нужен осциллограф с USB-ПО: Agilent 9000/90000, Tektronix или LeCroy. Пример Agilent 9000: MSO9254A с N5416A; активный дифференциальный пробник 113xA; головка E2678A; оснастка E2649-66401 Device и E2649-66402 Host; кабель USB2. Кабель должен строго соответствовать USB2. До 10 см используется маска Near End, более 10 см — Far End. Избыточная длина или рассогласование импеданса может вызвать отказ Near End.

### 1.4 Процедура USB2 Tx

1. Соберите стенд. Для Agilent см. Agilent N5416A USB 2.0 Compliance Test Option и Agilent USB2.0 High Speed Device SQ Test. Для Tektronix/LeCroy найдите инструкции на официальных сайтах. Рис. 4 показывает Agilent USB2 Device SQ.

![Рисунок источника — PDF p14](/docs/rockchip-usb-sq-test/assets/cn-p014-figure-01.png)

Рисунок 4. Стенд Agilent USB2 SQ.

2. Войдите в Test Packet Mode. Сначала проверьте нормальный обмен USB. OTG Device подключите через оснастку/кабель к ПК и проверьте обнаружение, затем используйте описанные команды или инструмент. Для Host метод зависит от оснастки и осциллографа; ниже Agilent и Tektronix.

2.1 Оборудование Agilent

Подключите Host к одному концу оснастки, High-Speed устройство, например флешку, к другому (рис. 5), затем выполните команду.

![Рисунок источника — PDF p15](/docs/rockchip-usb-sq-test/assets/cn-p015-figure-01.png)

Рисунок 5. Подключение оснастки Agilent USB2.

2.2 Tektronix: оснастка имеет только порт Host и не позволяет одновременно подключить другое High-Speed устройство. Отключите оснастку, подключите High-Speed устройство, например флешку, выполните команду. После входа в тестовый режим извлеките устройство, подключите оснастку и тестируйте. Нужен именно High-Speed, не Full-/Low-Speed мышь или клавиатура.

3. Анализ автоматическим USB-ПО. В тестовом режиме осциллограф показывает непрерывные периодические Test Packet Patterns (рис. 6). ПО анализирует их и формирует полный отчёт.

![Рисунок источника — PDF p16](/docs/rockchip-usb-sq-test/assets/cn-p016-figure-01.png)

Рисунок 6. Анализ качества USB2.

### 1.5 Анализ глазковой диаграммы USB2

#### 1.5.1 Стандартная глазковая диаграмма USB2

USB2 использует маски Near End и Far End. Для High-Speed SQ кабель до 10 см между портом и оснасткой требует Near End, свыше 10 см — Far End. Для надёжности Rockchip источник рекомендует более строгую Near End как единый ориентир. Стандартные диаграммы показаны на рис. 7/8.

![Рисунок источника — PDF p16](/docs/rockchip-usb-sq-test/assets/cn-p016-figure-02.png)

Рисунок 7. Глазковая диаграмма USB2 High-Speed Near End.

![Рисунок источника — PDF p17](/docs/rockchip-usb-sq-test/assets/cn-p017-figure-01.png)

Рисунок 8. USB2 High-Speed Far End. Нормальный глаз имеет тонкие чёткие трассы и широкое раскрытие. Межсимвольная интерференция искажает сигнал, мешает совпадению символов, размывает и закрывает глаз. Шум дополнительно размывает линии и сужает раскрытие. Оно характеризует искажения и межсимвольную интерференцию.

#### 1.5.2 Проблемы глазковой диаграммы USB2

1. Нет триггера: проверьте оснастку и USB-ПО осциллографа. Ищите периодический сигнал рис. 1-3. Его отсутствие может означать ошибку или неуспех команды.

2. Сильное искажение амплитуды или провал обычно означает ошибку методики. На рис. 9 амплитуда вдвое выше нормы: для Agilent обычно отсутствуют оконечные SMA 50 Ом на D+/D-. Провал рис. 10 обычно означает, что переключатель оснастки Agilent не в ON.

![Рисунок источника — PDF p18](/docs/rockchip-usb-sq-test/assets/cn-p018-figure-01.png)

Рисунок 9. Искажение амплитуды глаза.

![Рисунок источника — PDF p18](/docs/rockchip-usb-sq-test/assets/cn-p018-figure-02.png)

Рисунок 10. Провал сигнала глаза.

3. Закрытый глаз рис. 11 пересекает маску. Проверьте DP/DM на ESD или электронные переключатели с большой ёмкостью; при наличии удалите для повторного теста. Программно настройте силу драйвера PHY и фронты с помощью инженера USB.

![Рисунок источника — PDF p18](/docs/rockchip-usb-sq-test/assets/cn-p018-figure-03.png)

Рисунок 11. Закрытый глаз USB.

4. Размытый глаз с множеством трасс (рис. 12) указывает на сильные перекрёстные помехи, возможные рассогласование импеданса и шум. Сначала проверьте/удалите ёмкостные ESD и переключатели DP/DM. Затем проверьте импеданс или замените кабель. Наконец проверьте разводку PCB, источник 24 MHz и пульсации питания PHY.

![Рисунок источника — PDF p19](/docs/rockchip-usb-sq-test/assets/cn-p019-figure-01.png)

Рисунок 12. Размытый глаз USB.

### 1.6 USB2 Rx Compliance Test

#### 1.6.1 Принцип USB2 Receiver Sensitivity

USB 2.0 Electrical Compliance Test Specification 1.07 определяет EL_16 Receiver Sensitivity @ Squelch, EL_17 Receiver Sensitivity и EL_18 Minimum SYNC Field. Переведите DUT в SE0_NAK. Генератор имитирует Host с IN-пакетами; принятый пакет вызывает NAK. Изменяйте амплитуду IN и наблюдайте NAK. EL_16 идёт сверху вниз: ответ ниже 100 mV означает чрезмерную чувствительность и отказ. EL_17 снизу вверх: отсутствие устойчивого ответа выше 200 mV означает недостаточную чувствительность и отказ. Изначально предел EL_17 был 150 mV, ECN изменил его на 200 mV. Поскольку генератор — Host, проверяется только Device или upstream HUB, не Host. NAK: 32-битная синхронизация (31 ноль и 1), затем 8-битный PID 10100101.

#### 1.6.2 Команды USB2 Rx

Таблица 5. Команды USB2 Test SE0_NAK.

| Микросхема | USB 2.0 Test SE0_NAK команда |
| --- | --- |
| RK1808 | io -4 0xfd00c704 0x8c000a06 |
| RK1820 | io -4 0x102500c704 0x8c000a06 |
| RK2108 | io -4 0x41300804 0x30 |
| RK2116 | io -4 0x40040804 0x30 |
| RK2206 | io -4 0x43040804 0x30 |
| RK29XX<br>RK30XX<br>RK31XX | io -4 0x10180804 0x30 |
| RK3228<br>RK3229 | io -4 0x30040804 0x30 |
| RK3288<br>RK3228H<br>RK3328<br>RK3368 | io -4 0xff580804 0x30 |
| RK3308<br>RK3308B-S<br>RK3308H-S | io -4 0xff400804 0x30 |
| RK3326<br>RK3326S<br>PX30<br>PX30S | io -4 0xff300804 0x30 |
| RV1103<br>RV1106 | io -4 0xffb0c704 0x8c000a06 |
| RV1108 | io -4 0x30180804 0x30 |
| RV1126<br>RV1109 | io -4 0xffd0c704 0x8c000a06 |
| RV1126B | io -4 0x2150c704 0x8c000a06 |
| RK3399 | io -4 0xfe80c704 0x8c000a06 |
| RK3566<br>RK3568 | io -4 0xfcc0c704 0x8c000a06 |
| RK625 | io -4 0x40180804 0x30 |
| RK3588<br>RK3588S | io -4 0xfc00c704 0x8c000a06 |

#### 1.6.3 Процедура USB2 Rx

Стандартная процедура: раздел 4.2.1 Upstream Port Receiver Sensitivity в USB 2.0 Electrical Compliance Test Specification 1.07. Пример использует Tektronix.

##### 1.6.3.1 Меры предосторожности USB2 Rx

До команд подключите DUT через оснастку к PC Host, чтобы PHY не перешёл в suspend. Введите Test SE0_NAK через UART. При EL_18, когда генератор Tektronix меняет SYNC с 32 на 12 бит, поменяйте полярность канала генератора.

##### 1.6.3.2 Процедура USB2 Rx

1. Подключите DUT через Device Sensitivity к генератору и осциллографу Tektronix, как на рис. 13.

![Рисунок источника — PDF p22](/docs/rockchip-usb-sq-test/assets/cn-p022-figure-01.png)

Рисунок 13. Соединения Tektronix USB2 Rx.

![Рисунок источника — PDF p23](/docs/rockchip-usb-sq-test/assets/cn-p023-figure-01.png)

Рисунок 14. Генератор Tektronix.

![Рисунок источника — PDF p23](/docs/rockchip-usb-sq-test/assets/cn-p023-figure-02.png)

Рисунок 15. Оснастка USB2 Rx Device Sensitivity.

2. Переключите DIP оснастки в ON и подключите её к PC Host.

3. Введите команду таблицы 5 через UART для режима SE0_NAK.

4. Переключите DIP в OFF.

5. Задайте шаблон Tektronix и последовательно выполните EL_16, EL_17, EL_18.

##### 1.6.3.3 Анализ результатов USB2 Rx

На рис. 16 осциллограф в реальном времени измеряет IN генератора и NAK DUT и формирует показанный отчёт.

![Рисунок источника — PDF p24](/docs/rockchip-usb-sq-test/assets/cn-p024-figure-01.png)

Рисунок 16. Сигналы USB2 Rx.

![Рисунок источника — PDF p24](/docs/rockchip-usb-sq-test/assets/cn-p024-figure-02.png)

Рисунок 17. Отчёт USB2 Rx. При отказе EL_16/EL_17 попробуйте настройку Squelch PHY USB2; см. Rockchip USB SQ Tool.

## 2. USB2 HUB SQ Test

SQ HUB охватывает upstream/downstream, но обычно проверяют пользовательские downstream, описанные здесь. Типовые USB2 HUB: FE1.1, FE1.1S, GL850, GL852, USX2064, HX2VL; HSIC: USB4604, GL850H. USB2 допускает оба метода, HSIC только второй. Метод 1: определите Host-контроллер и команду таблиц 2–4, затем проверьте все downstream по процедуре USB2. Команда и метод одинаковы для портов. Метод 2: сборка/запуск скрипта сложнее, но универсальны для USB2 и HSIC.

1. Загрузите и соберите USB_HUB_Compliance_Test_Script: https://redmine.rockchip.com.cn/documents/113 .

2. Скопируйте linux-eye в каталог data, выполните `chmod 777 linux-eye`, запустите его и вводите команды по подсказкам:

```text
[root@hari LinuxEye]# ./linuxEye
LinuxEye - select one of the following hub for testing.
[ 0] 4-port Full-Speed hub at tier 2 of Bus 3
(VID: 0451, PID: 1446, Address: 3)
[ 1] 4-port High-Speed hub at tier 2 of Bus 1
(VID: 1A40, PID: 0101, Address: 15)
[ 2] 4-port High-Speed hub at tier 2 of Bus 1
(VID: 1A40, PID: 0101, Address: 10)
[ 3] 7-port High-Speed hub at tier 3 of Bus 1
(VID: 1A40, PID: 0201, Address: 50)
Please enter [0 ~ 3] to select a hub or 'q' to quit: 2 （表⽰共有4个HUB， 测试HUB[2]）
[ 1] is connected to Low-Speed device
[ 2] is open
[ 3] is connected to High-Speed device
[ 4] is connected to Low-Speed device
Please enter [1 ~ 4] to select a port or 'q' to quit: 2 （表⽰测试HUB的第2个port）
LinuxEye - Start testing port 2 of device 10 on bus 1
Type 'q' to stop the test: q (退出测试脚本)
[root@hari LinuxEye]#
```

## 3. USB3 Compliance Test

USB3 имеет две шины, добавляя SuperSpeed к USB2. SuperSpeed: 5 Gbps, ANSI 8b/10b, полный дуплекс, кабель до 3 м. Рис. 18 показывает архитектуру.

![Рисунок источника — PDF p26](/docs/rockchip-usb-sq-test/assets/cn-p026-figure-01.png)

Рисунок 18. Архитектура шины USB3.

### 3.1 Дополнительные нормы USB3

Калибровка/тест выполняются в конце compliance channel худшего соединения: Host — кабель 3 м и трасса 5 дюймов; Device — 3 м и 11 дюймов. Tx допускает embedding эталонных S-параметров. Вычисляют DJ/RJ/TJ при указанном BER 10e-12 и Pj на 10, 20, 33 MHz. После CTLE анализируют выровненный глаз: 5 Gbps после длинного кабеля/PCB может закрыться; CTLE приёмника компенсирует ВЧ-потери, поэтому ПО осциллографа тоже требует CTLE. Калибровка глаза Device: 145 mVp-p, Host: 180 mVpp.

Электрические тесты USB3 включают Tx, Rx Tolerance Compliance и кабели/разъёмы.

### 3.2 USB3 Tx Compliance Test

#### 3.2.1 Требования USB3 Tx

Передатчик выдаёт заданные шаблоны. Осциллограф реального времени измеряет глаз, амплитуду, джиттер, среднюю скорость и фронты. Для USB3 5 Gbps с меньшей амплитудой нужен осциллограф свыше 12 GHz и низкий шум. Точка измерения — конец compliance channel, а не прямой контакт оснастки. Канал моделирует Host: 3 м + 5 дюймов PCB; Device: 3 м + 11 дюймов. USB3 даёт S-модели. На практике DUT подключают непосредственно через оснастку, а канал внедряют S-параметрами осциллографа. TP1 рис. 19 — точка измерения.

![Рисунок источника — PDF p27](/docs/rockchip-usb-sq-test/assets/cn-p027-figure-01.png)

Рисунок 19. Модель теста USB3 Tx.

![Рисунок источника — PDF p27](/docs/rockchip-usb-sq-test/assets/cn-p027-figure-02.png)

Рисунок 20. Требования глаза USB3 Tx.

Редактируемая транскрипция таблицы изображения (тексты указанных примечаний в изображении отсутствуют):

| Характеристика | Минимум | Номинал | Максимум | Единицы | Номера примечаний |
| --- | --- | --- | --- | --- | --- |
| Высота глаза | 100 |  | 1200 | mV | 2, 4 |
| Dj |  |  | 0.43 | UI | 1, 2, 3 |
| Rj |  |  | 0.23 | UI | 1, 2, 3, 5 |
| Tj |  |  | 0.66 | UI | 1, 2, 3 |

![Рисунок источника — PDF p28](/docs/rockchip-usb-sq-test/assets/cn-p028-figure-01.png)

Рисунок 21. Электрические требования USB3 Tx.

Редактируемая транскрипция таблицы изображения (тексты указанных примечаний в изображении отсутствуют):

| Символ | Параметр | 5.0 GT/s | Единицы | Примечания |
| --- | --- | --- | --- | --- |
| UI | Единичный интервал | 199.94 (min); 200.06 (max) | ps | UI соответствует допуску ±300 ppm на устройство; период без изменений от SSC. |
| V_TX-DIFF-PP | Дифференциальный размах Tx p-p | 0.8 (min); 1.2 (max) | V | Номинал 1 V p-p. |
| V_TX-DIFF-PP-LOW | Маломощный дифференциальный размах Tx p-p | 0.4 (min); 1.2 (max) | V | См. 6.7.2. В этом режиме требований к предыскажению нет; зависит от реализации. |
| V_TX-DE-RATIO | Предыскажение Tx | 3.0 (min); 4.0 (max) | dB | Номинал 3.5 dB. |

#### 3.2.2 Испытания USB3 Tx

LFPS (Near End); SSC (Near End); Tx (Near/Far End): глаз, Tj/Rj/Dj, амплитуда.

![Рисунок источника — PDF p28](/docs/rockchip-usb-sq-test/assets/cn-p028-figure-02.png)

Рисунок 22. Параметры Agilent USB3 Tx.

#### 3.2.3 Тестовый режим USB3 Tx

USB3 требует Compliance Mode до проверки Tx. После первого тайм-аута LFPS в Polling контроллер переходит из Polling.LFPS в Compliance Mode (рис. 23).

![Рисунок источника — PDF p29](/docs/rockchip-usb-sq-test/assets/cn-p029-figure-01.png)

Рисунок 23. Вход в USB3 Compliance Mode.

#### 3.2.4 Стенд USB3 Tx

Agilent рекомендует серию 90000 (до 13 GHz), автоматическое ПО U7243A и оснастку U7242A для теста передатчика USB3.

![Рисунок источника — PDF p29](/docs/rockchip-usb-sq-test/assets/cn-p029-figure-02.png)

Рисунок 24. Стенд Agilent USB3 Tx.

![Рисунок источника — PDF p29](/docs/rockchip-usb-sq-test/assets/cn-p029-figure-03.png)

Рисунок 25. Оснастка Agilent USB3 Tx U7242.

Agilent предлагает N7015A для USB3.1 Gen1 Type-C (рис. 26) с тем же ПО, что U7242A. См. Keysight N7015A-16A Type-C Test Kit.

![Рисунок источника — PDF p30](/docs/rockchip-usb-sq-test/assets/cn-p030-figure-01.png)

Рисунок 26. Agilent N7015A Type-C. Стенд Tektronix показан на рис. 27. Опция USB-Tx DPO/MSO70000 автоматизирует измерения передатчика USB3: https://www.tek.com.cn/datasheet/usb3-transmitter-and-receiver-solutions-datasheet .

![Рисунок источника — PDF p31](/docs/rockchip-usb-sq-test/assets/cn-p031-figure-01.png)

Рисунок 27. Соединения Tektronix USB3 Tx.

#### 3.2.5 Команды USB3 Device Tx

Некоторым микросхемам нужна команда Device Tx для CP1. Вводите её только по запросу осциллографа на CP1, иначе переключение CP0/CP1 может нарушиться. Команды приведены в таблице 6.

| Микросхема | DWC3_0 OTG Host 3.0 | DWC3_1 OTG Host 3.0 |
| --- | --- | --- |
| RK1808 | io -4 0xff384008 0xc | N.A |
| RK3228H<br>RK3328 | io -4 0xff478408 0xc | N.A |

Обычно Device входит в режим Tx без команд. В таблице 6 RK1808/RK3228H/RK3328 требуют команды ручного перехода CP1; RK3399/RK3568/RK3588 — нет.

#### 3.2.6 Процедура USB3 Device Tx

Ниже процедура Device Tx использует Agilent 90000 DSO91204A и оснастку U7242A. Для Tektronix и LeCroy см. руководства производителей.

 3.2.6.1 Меры USB3 Device Tx

Сначала проверьте таблицу 6. После подключения Device обычно автоматически входит в Compliance Mode; при необходимости выполните команду по запросу CP1. Device не должен выдавать 5 V на VBUS. Подайте VBUS через USB-питание U7242A от осциллографа или ПК.

 3.2.6.2 Шаги USB3 Device Tx

Шаг 1: настройте автоматическое испытательное ПО.

![Рисунок источника — PDF p32](/docs/rockchip-usb-sq-test/assets/cn-p032-figure-01.png)

На рисунке 28 показано ПО V2.01. У V3.00.0001 другой интерфейс; настройте канал, как показано ниже.

![Рисунок источника — PDF p33](/docs/rockchip-usb-sq-test/assets/cn-p033-figure-01.png)

Рисунок 29. По умолчанию Normal Channel добавляет модель кабеля 3 m и платы 5 дюймов. Подключите оснастку прямо к DUT. Реальный кабель длиннее 10 cm может вызвать отказ Far End; выберите None либо кабель короче 10 cm.

Шаг 2: выберите All USB3 Tests.

![Рисунок источника — PDF p33](/docs/rockchip-usb-sq-test/assets/cn-p033-figure-02.png)

Рисунок 30. Выбор испытаний.

Шаг 3: установите Automate Test Pattern Change = Auto; остальные настройки оставьте по умолчанию.

![Рисунок источника — PDF p34](/docs/rockchip-usb-sq-test/assets/cn-p034-figure-01.png)

Рисунок 31. Настройка испытаний.

Шаг 4: соедините осциллограф, оснастку и Device по подсказке, включая питание VBUS 5 V.

![Рисунок источника — PDF p34](/docs/rockchip-usb-sq-test/assets/cn-p034-figure-02.png)

Рисунок 32. Соединения Device Tx.

Шаг 5: запустите испытание Tx.

5.1 Указания для испытания LFPS.

![Рисунок источника — PDF p35](/docs/rockchip-usb-sq-test/assets/cn-p035-figure-01.png)

Рисунок 33. До теста LFPS отсоедините USB3-оснастку от DUT, нажмите OK, затем подключите снова.

![Рисунок источника — PDF p35](/docs/rockchip-usb-sq-test/assets/cn-p035-figure-02.png)

Рисунок 34. Эталонная форма LFPS.

5.2 После LFPS измените соединения по подсказке для теста SSC.

![Рисунок источника — PDF p36](/docs/rockchip-usb-sq-test/assets/cn-p036-figure-01.png)

Рисунок 35. Соединения SSC.

5.3 После SSC измените соединения для глазковой диаграммы и джиттера.

![Рисунок источника — PDF p36](/docs/rockchip-usb-sq-test/assets/cn-p036-figure-02.png)

Рисунок 36. Соединения для глазковой диаграммы и джиттера.

5.4 Просмотрите автоматически созданный отчёт.

![Рисунок источника — PDF p37](/docs/rockchip-usb-sq-test/assets/cn-p037-figure-01.png)

Рисунок 37. Отчёт.

![Рисунок источника — PDF p37](/docs/rockchip-usb-sq-test/assets/cn-p037-figure-02.png)

Рисунок 38. LFPS Burst Width.

![Рисунок источника — PDF p38](/docs/rockchip-usb-sq-test/assets/cn-p038-figure-01.png)

Рисунок 39. LFPS Repeat Time Interval.

![Рисунок источника — PDF p38](/docs/rockchip-usb-sq-test/assets/cn-p038-figure-02.png)

Рисунок 40. Short Channel Eye.

![Рисунок источника — PDF p39](/docs/rockchip-usb-sq-test/assets/cn-p039-figure-01.png)

Рисунок 41. Far End Eye.

#### 3.2.7 Команды USB3 Host Tx

Таблица 7. Команды USB3 Host Tx.

| Микросхема | DWC3_0 OTG Host 3.0 | DWC3_1 OTG Host 3.0 | DWC3_2 Host 3.0 |
| --- | --- | --- | --- |
| RK1808 | io -4 0xff384008 0xc<br>io -4 0xfd000430 0x0a010340 | N.A | N.A |
| RK1820 | io -4 0x1025000430 0x0a010340 | N.A | N.A |
| RK3228H<br>RK3328 | io -4 0xff478408 0xc<br>io -4 0xff600430 0x0a010340 | N.A | N.A |
| RK3366 | io -4 0xff500430 0x0a010340 | N.A | N.A |
| RK3399 | io -4 0xfe800430 0x0a010340 | io -4 0xfe900430 0x0a010340 | N.A |
| RK3528 | io -4 0xfe500430 0x0a010340 | N.A | N.A |
| RK3562 | io -4 0xfe500430 0x0a010340 | N.A | N.A |
| RK3566<br>RK3568 | io -4 0xfcc00430 0x0a010340 | io -4 0xfd000430 0x0a010340 | N.A |
| RK3576 | io -4 0x23000430 0x0a010340 | io -4 0x23400430 0x0a010340 | N.A |
| RK3588<br>RK3588S | io -4 0xfc000430 0x0a010340 | io -4 0xfc400430 0x0a010340 | io -4 0xfcd00430 0x0a010340 |
| RV1126B | io -4 0x21500430 0x0a010340 | N.A | N.A |

У RK1808/RK3228H/RK3328 две команды; первая записывает 0xc для ручного CP1. Обычно выполняйте обе вместе. При проблеме CP0/CP1 сначала запишите только 0x0a010340, затем 0xc по запросу CP1. Команды io применимы к разным чипам/ядрам. Узлы Type-C RK3399 Linux 3.10/4.4 см. 3.4.2.

#### 3.2.8 Процедура USB3 Host Tx

Источник называет следующий процесс Device Tx с Agilent 90000 DSO91204A/U7242A, хотя он расположен в разделе Host. Для Tektronix и LeCroy см. руководства производителей.

 3.2.8.1 Меры USB3 Host Tx

Сначала подключите USB3-диск и проверьте SuperSpeed в журнале, затем извлеките. Без этого тест RK3399 Type-A может не работать. До теста выполните команду таблицы 7. Host подаёт VBUS 5 V; оснастка не должна питать его — в отличие от Device. Момент команды различается для Type-A и Type-C.

 3.2.8.2 Шаги USB3 Host Tx

Шаг 1: настройте ПО как для Device.

Шаг 2: соедините оснастку и осциллограф, пока без Host.

Шаг 3: при LFPS осциллограф просит отсоединить оснастку от Host.

Шаг 4: найдите команду чипа и порта в таблице 7.

Шаг 5: для Type-A команда предшествует подключению; для Type-C подключите, подождите 2–3 s перехода Host, затем выполните команду.

Шаг 6: соедините оснастку и Host; тестовый режим запускается автоматически.

Шаг 7: следуйте остальным подсказкам осциллографа для завершения тестов.

#### 3.2.9 Проверка USB3 Tx Compliance mode

Запрос Device Tx: `cat /sys/kernel/debug/usb/xxxx/link_state`, где xxxx — узел проверяемого USB-контроллера. `Compliance` означает Device Tx. Для Host Tx Linux 4.19 и ранее прочитайте xHCI PORTSC через io: биты [8:5] — Port Link State (PLS). PLS = 10 (десятичное) означает Compliance mode (здесь источник пишет Device). База зависит от чипа, см. TRM; смещение 0x430. Для RK3399 Host0 PORTSC = 0xfe800430, Host1 = 0xfe900430. Linux 5.10 и новее предоставляют узел portsc для проверки Host Tx:

`cat sys/kernel/debug/usb/xhci/xxxx/ports/port02/portsc`, где xxxx — узел проверяемого xHCI. `Link:Compliance mode` означает Host Tx.

### 3.3 USB3 Rx Compliance Test

Электрический тест USB3 Rx называется Receiver Jitter Tolerance Test. Команды не нужны: после подключения стенда контроллер автоматически входит в Loopback и начинается Rx. Стенд сложен и зависит от осциллографа, поэтому подробной процедуры здесь нет; см. его руководство. Здесь описаны лишь вход в Loopback и проверка состояния.

#### 3.3.1 Процедура USB3 Rx

Вход в Loopback: на стадии Polling.Configuration обучения линии обнаружение бита Loopback в T2 pattern прибора автоматически переводит USB3 PHY в Loopback (рис. 42).

![Рисунок источника — PDF p42](/docs/rockchip-usb-sq-test/assets/cn-p042-figure-01.png)

Рисунок 42. Вход USB3 в Loopback. Процедуры Receiver Jitter Tolerance Test см. в Electrical Compliance Test Specification for SuperSpeed USB Rev.

1.0a, раздел TD.1.5 Receiver Jitter Tolerance Test с подробными шагами испытания.

#### 3.3.2 Проверка USB3 Rx Loopback mode

Запрос Device Rx: `cat /sys/kernel/debug/usb/xxxx/link_state`, где xxxx — узел проверяемого USB-контроллера.

`Loopback` означает Device Rx. Для Host Rx Linux 4.19 и ранее прочитайте xHCI PORTSC через io: биты [8:5] PLS = 11 (десятичное) означают Loopback. Базу см. в TRM чипа, смещение 0x430. RK3399 Host0 PORTSC = 0xfe800430, Host1 = 0xfe900430. Linux 5.10 и новее: `cat sys/kernel/debug/usb/xhci/xxxx/ports/port02/portsc`, где xxxx — реальный узел xHCI. `Link:Test mode` означает Host Rx.

### 3.4 Проблемы USB3 и решения

#### 3.4.1 Device не входит в Tx

USB3 Device обычно входит в Tx без команды. Иначе сначала измерьте VBUS. Спецификация Device Tx Compliance запрещает Device самостоятельно питать VBUS 5 V: это мешает автоматическому входу Compliance. VBUS должна подавать оснастка; соедините её USB-питание с осциллографом или ПК.

#### 3.4.2 Проблемы RK3399 USB3

1. RK3399 Type-A Host не входит в Tx: до испытания вставьте USB3-диск, как описано в мерах Host Tx, иначе вход может не сработать. Альтернатива: удалите `snps,usb3-warm-reset-on-resume-quirk` из DTS-узлов `usbdrd_dwc3_0` и `usbdrd_dwc3_1`.

2. RK3399 Type-C Host не входит в Tx: обычно достаточно процедуры Host Tx. При отказе проверьте VBus: постоянное питание может мешать. Способ 1: программное управление VBus, по умолчанию без 5 V, 5 V только после подключения кабеля Type-C–Type-A. Способ 2: DTS `dr_mode` = `"host"`.

3. RK3399 Type-A Host не входит в Rx Loopback: сначала вставьте USB3-диск и подтвердите SuperSpeed в последовательном журнале, то есть поддержку USB3 прошивкой. Извлеките диск и начните тест. Без этого Type-A может не войти в Loopback.

4. Процедура USB3 Host Tx RK3399 Linux 3.10/4.4.

Примечание: только для RK3399.

1. RK3399 Linux 3.10 / ранний Linux 4.4. Type-C0 прямая/обратная ориентация — первая/вторая команда; Type-C1 — третья/четвёртая:

```sh
echo test_u3 > /sys/kernel/debug/usb@fe800000/host_testmode
echo test_flip_u3 > /sys/kernel/debug/usb@fe800000/host_testmode
echo test_u3 > /sys/kernel/debug/usb@fe900000/host_testmode
echo test_flip_u3 > /sys/kernel/debug/usb@fe900000/host_testmode
```

2. RK3399 новый Linux 4.4: Type-C0 прямо/обратно — команды 1/2, Type-C1 — 3/4. Последний запрос проверяет вход. U2: test_packet — тест U2; U3: compliance mode — тест U3; U3: UNKNOWN — режим не включён.

```text
echo test_u3 > /sys/devices/platform/usb0/host_testmode
echo test_flip_u3 > /sys/devices/platform/usb0/host_testmode
echo test_u3 > /sys/devices/platform/usb1/host_testmode
echo test_flip_u3 > /sys/devices/platform/usb1/host_testmode
cat /sys/kernel/debug/usb3 控制器节点/host_testmode
U2: test_packet // means that U2 in test mode
U3: compliance mode // means that U3 in test mode
```

#### 3.4.3 Проблемы RK1808 USB3

1. RK1808 Type-A USB3 Host не входит в Rx Loopback: отключите hub autosuspend следующей правкой ПО.

```text
diff --git a/drivers/usb/core/usb.c b/drivers/usb/core/usb.c
index 36e5098..0b2930d 100644
--- a/drivers/usb/core/usb.c
+++ b/drivers/usb/core/usb.c
@@ -66,7 +66,7 @@ int usb_disabled(void)
 EXPORT_SYMBOL_GPL(usb_disabled);

 #ifdef CONFIG_PM
-static int usb_autosuspend_delay = 2;          /* Default delay value,
+static int usb_autosuspend_delay = -1;         /* Default delay value,
```

#### 3.4.4 Проблемы RK3588 USB3

Для тестов RK3588 USB3 Tx/Rx на Linux 5.10 соблюдайте следующие меры.

1. До теста Type-C0 Device отключите autosuspend контроллера:

```text
echo on > /sys/devices/platform/usbdrd3_0/fc000000.usb/power/control
```

2. Для Type-C Host сначала подключите оснастку к порту, подождите 2–3 секунды переключения Host, затем выполните команду таблицы 7.

3. Если Rx не входит автоматически в Loopback, добавьте `snps,dis_u3_susphy_quirk;` в конфигурацию DWC3 DTS.

4. Type-C0 Device Tx: `cat /sys/kernel/debug/usb/fc000000.usb/link_state`; `Compliance` подтверждает тестовый режим.

5. Type-C0 Device Rx: `cat /sys/kernel/debug/usb/fc000000.usb/link_state`; `Loopback` подтверждает тестовый режим.

6. Host Tx на примере Type-C1: `cat sys/kernel/debug/usb/xhci/xhci-hcd.8.auto/ports/port02/portsc`; `Link:Compliance mode` подтверждает Host Tx.

7. Host Rx на примере Type-C1: `cat sys/kernel/debug/usb/xhci/xhci-hcd.8.auto/ports/port02/portsc`; `Link:Test mode` подтверждает Host Rx.

## 4. USB3 HUB Compliance Test

Пояснения скрипта: пример USB2 содержит четыре HUB, выбирается HUB[2], затем порт 2, выход q. В USB3 выбор 0 означает SuperSpeed HUB, затем 1 означает port1 (2 — port2 и далее); q завершает тест. Исходный вывод и китайские комментарии не изменены.

USB3 HUB compliance охватывает upstream и downstream, но обычно проверяют только доступные пользователю downstream-порты; здесь описаны они. Распространены GL352x, VL812, VL813, USB5734, RTS5411 и CYPRESS HX3. В отличие от USB2 HUB, Rockchip USB3 HUB проверяется только скриптом.

1. Загрузите и скомпилируйте скрипт. Исходники: https://redmine.rockchip.com.cn/documents/113 , файл USB_HUB_Compliance_Test_Script.

2. Выполните скрипт: пример GL3523 на RK3399. (1) Передайте скрипт в Android через adb. (2) Измените права linux-eye. (3) Выполните для режима теста порта USB3 HUB. (3.1) Определите HUB по журналу ядра.

```text
adb push C:\Users\user\Desktop\linux-eye /data
root@rk3399:/data # chmod 777 linux-eye
```

```text
[  139.427845] usb 6-1: new SuperSpeed USB device number 2 using xhci-hcd
[  139.445641] usb 6-1: New USB device found, idVendor=05e3, idProduct=0612
[  139.445708] usb 6-1: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[  139.445738] usb 6-1: Product: USB3.0 Hub
[  139.445763] usb 6-1: Manufacturer: GenesysLogic
[  139.452409] usb 5-1: new high-speed USB device number 2 using xhci-hcd
[  139.463572] hub 6-1:1.0: USB hub found
[  139.465861] hub 6-1:1.0: 4 ports detected
[  139.589854] usb 5-1: New USB device found, idVendor=05e3, idProduct=0610
[  139.589920] usb 5-1: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[  139.589950] usb 5-1: Product: USB2.0 Hub
[  139.589975] usb 5-1: Manufacturer: GenesysLogic
[  139.607244] hub 5-1:1.0: USB hub found
[  139.609146] hub 5-1:1.0: 4 ports detected
```

(3.2) Выполните испытательный скрипт.

```text
root@rk3399:/ # ./data/linux-eye

LinuxEye - select one of the following hub for testing.

        [ 0]    4-port Super-Speed hub at tier 2 of Bus 6
                (VID: 05E3, PID: 0612, Address: 2)

        [ 1]    4-port High-Speed hub at tier 2 of Bus 5
                (VID: 05E3, PID: 0610, Address: 2)

    Please enter [0 ~ 1] to select a hub or 'q' to quit: 0 （输⼊0，表⽰测试super-speed）
                [ 1] is open
                [ 2] is open
                [ 3] is open
                [ 4] is open
    Please enter [1 ~ 4] to select a port or 'q' to quit: 1 （输⼊1，表⽰测试USB3 HUB
port1，如果测试port2，则输⼊2，以此类推）
    device file /dev/bus/usb/006/002 opened successfully
           Port (1) Status: 02A0
    LinuxEye - Start testing port 1 of device 2 on bus 6    （开始测试）
                Type 'q' to stop the test: q                （测试结束，输⼊q，退出）
```

(3.3) Повторите для остальных downstream-портов USB3 HUB.

## 5. Rockchip USB SQ Tool

Rockchip USB SQ Tool — средство отладки целостности сигнала USB PHY Rockchip. Оно показывает тестовые команды, динамически регулирует PHY и создаёт код драйвера по результатам настройки. См. Rockchip_Introduction_USB_SQ_Tool_CN. Загрузка: https://redmine.rockchip.com.cn/documents/113 .

## 6. Документация

1. USB 2.0 Specification

2. USB 3.1 Specification

3. Agilent N5416A USB 2.0 Compliance Test Option

4. Agilent USB2.0 High Speed Device SQ Test

5. Keysight N7015A-16A Type-C Test Kit

6. USB 2.0 Electrical Compliance Test Specification Version 1.07

7. Electrical Compliance Test Specification for SuperSpeed USB Rev. 1.0a

{% endraw %}
