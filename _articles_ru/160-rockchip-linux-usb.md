---
title: "Rockchip Linux USB: контроллеры, PHY, DTS, отладка и устранение неисправностей"
description: "Rockchip Linux USB: контроллеры, PHY, DTS, отладка и устранение неисправностей · V2.4.0 / V2.4.1"
excerpt: "Rockchip Linux USB: контроллеры, PHY, DTS, отладка и устранение неисправностей"
translation_key: "160-rockchip-linux-usb"
slug: "160-rockchip-linux-usb"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "USB", "Linux", "PHY", "DWC2", "DWC3"]
---

{% raw %}

Справочный материал платформы: документ производителя RK-KF-YF-096, китайский V2.4.0 и английский V2.4.1, для Rockchip без MCU и BSP Linux 4.4+. Проверяйте конкретные SoC, SDK/BSP, патчи ядра, контроллер, PHY/IOMUX, питание и схему платы. Соответствие платам ArmSoM не подтверждено; аппаратные испытания не выполнялись. Команды, осциллограммы и показатели — примеры производителя, не измерения ArmSoM. Китайский текст дополнен английскими сведениями; EN/RU/DE основаны на английском тексте с китайскими дополнениями. Различия примеров не заменены молча: уникальные примеры другой версии сохранены в приложении кода. ZH использует китайские рисунки, остальные языки — английские оригиналы, иногда содержащие китайские подписи.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- en PDF p.8; unit 0 -->

## 1. Обзор

<!-- en PDF p.8; unit 1 -->

### 1.1 Контроллеры USB Rockchip

<!-- en PDF p.8; unit 2 -->

SoC Rockchip обычно содержит несколько независимых контроллеров USB. Подробности приведены в TRM чипа. Перед выбором схемы необходимо определить требования продукта и ограничения контроллеров. В таблице 1-1 перечислены встроенные контроллеры USB.

<!-- en PDF p.9; unit 3 -->

| Чип | USB 2.0 HOST<br>(EHCI&OHCI) | USB HSIC<br>(EHCI) | USB 2.0/3.0 OTG<br>(DWC3/xHCI) | USB 2.0 OTG<br>(DWC2) |
| --- | --- | --- | --- | --- |
| RK3399Pro | 2 | 1 | 2 | 0 |
| RK3399 | 2 | 1 | 2 | 0 |
| RK3368 | 1 | 1 | 0 | 1 |
| RK3366 | 1 | 0 | 1 | 1 |
| RK3328 | 1 | 0 | 1 | 1 |
| RK3288 | 0 | 1 | 0 | 2 (HOST+OTG) |
| RK3228 | 3 | 0 | 0 | 1 |
| RK312X | 1 | 0 | 0 | 1 |
| RK3188 | 1 | 1 | 0 | 1 |
| RK30XX | 1 | 0 | 0 | 1 |
| RK3308 | 1 | 0 | 0 | 1 |
| RK3326 | 0 | 0 | 0 | 1 |
| RK1808 | 1 | 0 | 1 | 0 |
| RK1108 | 1 | 0 | 0 | 1 |
| PX30 | 1 | 0 | 0 | 1 |
| RV1103 | 0 | 0 | 1 (OTG 2.0) | 0 |
| RV1103B | 0 | 0 | 1 (OTG 2.0) | 0 |
| RV1106 | 0 | 0 | 1 (OTG 2.0) | 0 |
| RV1109 | 1 | 0 | 1 (OTG 2.0) | 0 |
| RV1126 | 1 | 0 | 1 (OTG 2.0) | 0 |
| RV1126B | 1 | 0 | 1 (OTG 3.0) | 0 |
| RK3506 | 0 | 0 | 0 | 2 x OTG 2.0 |
| RK3528 | 1 | 0 | 1 (OTG 3.0) | 0 |
| RK3562 | 1 | 0 | 1 (OTG 3.0) | 0 |
| RK3576 | 0 | 0 | 2 (OTG 3.0) | 0 |
| RK3566 | 2 | 0 | 2 (OTG 2.0 + Host 3.0) | 0 |
| RK3568 | 2 | 0 | 2 (OTG 3.0+ Host 3.0) | 0 |

<!-- en PDF p.10; unit 4 -->

| Чип | USB 2.0 HOST<br>(EHCI&OHCI) | USB HSIC<br>(EHCI) | USB 2.0/3.0 OTG<br>(DWC3/xHCI) | USB 2.0 OTG<br>(DWC2) |
| --- | --- | --- | --- | --- |
| RK3588 | 2 | 0 | 3 (2 x OTG 3.0 +<br>1 x Host 3.0) | 0 |
| RK3588S | 2 | 0 | 2 (1 x OTG 3.0 +<br>1 x Host 3.0) | 0 |

<!-- en PDF p.10; unit 5 -->

Примечания:

<!-- en PDF p.10; unit 6 -->

1. Число N означает N независимых контроллеров USB.

<!-- en PDF p.10; unit 7 -->

2. EHCI/OHCI означает объединение контроллеров EHCI и OHCI; DWC3/xHCI — объединение DWC3 и xHCI.

<!-- en PDF p.10; unit 8 -->

3. RK3288 содержит два независимых DWC2: один поддерживает OTG, другой — только Host.

<!-- en PDF p.10; unit 9 -->

4. DWC3 в RV1103/RV1106/RV1109/RV1126/RK3566 поддерживает только OTG 2.0, без OTG 3.0; максимальная скорость — 480 Mb/s (High Speed).

<!-- en PDF p.10; unit 10 -->

5. В отличие от RK3588, RK3588S не имеет Type-C1: одного USB 3.0 OTG controller, одного DP controller, одного USB3.0/DP Combo PHY и одного USB 2.0 PHY.

<!-- en PDF p.10; unit 11 -->

6. Host 3.0 в RK3588/RK3588S (USB30_2) поддерживает только USB 3.0 и не совместим с USB 2.0.

<!-- en PDF p.10; unit 12 -->

7. PHY RV1103/RV1103B/RV1106 не имеет OTG_ID и не может автоматически переключать Device/Host аппаратно. Для программного переключения см. раздел «Часто используемые команды USB».

<!-- en PDF p.10; unit 13 -->

8. RK3506 содержит два полнофункциональных DWC2 OTG, подходящих для продукта с двумя Device. Только OTG0 поддерживает определение зарядки BC1.2 и отключения Device при горячем извлечении. Аппаратная и программная части SDK RK3506 позволяют определять уровни VBUS и ID через GPIO вместо обычных выводов PHY VBUSDET и OTG_ID.

<!-- en PDF p.10; unit 14 -->

### 1.2 USB 2.0 Host

<!-- en PDF p.10; unit 15 -->

Совместимые спецификации:

- Universal Serial Bus Specification, Revision 2.0.
- Enhanced Host Controller Interface Specification (EHCI), Revision 1.0.
- Open Host Controller Interface Specification (OHCI), Revision 1.0a.

Поддерживаются High Speed (480Mbps), Full Speed (12Mbps) и Low Speed (1.5Mbps). Блок-схема приведена на рисунке 1-1.

<!-- en PDF p.11; unit 16 -->

![Технический рисунок английского оригинала, PDF p.11](/docs/rockchip-linux-usb/assets/en-p011-figure-01.png)

<!-- en PDF p.11; unit 17 -->

Рисунок 1-1. Контроллер USB 2.0 Host.

<!-- en PDF p.11; unit 18 -->

### 1.3 USB 2.0 OTG

<!-- en PDF p.11; unit 19 -->

Совместимость: Universal Serial Bus Specification, Revision 2.0. Возможности:

- Режимы Host и Device.
- Определение OTG ID и автоматическое переключение Host/Device по его уровню.
- ADP/SRP/HNP не поддерживаются.
- Host поддерживает High/Full/Low Speed; Device — только High/Full Speed.
- 9 каналов Host.
- Помимо управляющей точки 0, в Device доступны 9 конечных точек: 4 IN, 3 OUT, 2 двунаправленные IN/OUT.
- Встроенный FIFO 1024x35 bits.
- Внутренний DMA со scatter/gather.
- Динамическое распределение FIFO по пакетам и конечным точкам для гибкого эффективного использования RAM.
- Динамическая настройка размера FIFO.
- Определение зарядки в Device.
- Режим UART Bypass.

<!-- en PDF p.12; unit 20 -->

![Технический рисунок английского оригинала, PDF p.12](/docs/rockchip-linux-usb/assets/en-p012-figure-01.png)

<!-- en PDF p.12; unit 21 -->

Рисунок 1-2. USB 2.0 OTG.

<!-- en PDF p.12; unit 22 -->

### 1.4 USB 3.0 OTG

<!-- en PDF p.12; unit 23 -->

Совместимые спецификации: Universal Serial Bus 3.0 Specification Revision 1.0; Universal Serial Bus Specification Revision 2.0; eXtensible Host Controller Interface for Universal Serial Bus (xHCI) Revision 1.1.

DWC3 поддерживает Control/Bulk (включая stream)/Interrupt/Isochronous, одновременную передачу IN/OUT USB 3.0 с полосой до 8Gbps, кэширование дескрипторов и предварительную выборку данных.

Возможности USB 3.0 Device:

- До 7 IN и 6 OUT конечных точек, включая управляющую точку 0.
- До 13 ресурсов передачи, по одному на конечную точку.
- Гибкая настройка точек для разных приложений и USB set-configuration.
- Аппаратная обработка ERDY и burst.
- Bulk stream с автоматическим запуском перемещения данных контроллером.
- Изохронные точки с данными в буферах.
- Гибкие дескрипторы: регулирование прерываний буфера, несколько передач, изохронная и управляющая передача, разрозненные буферы.

USB 3.0 DRD поддерживает фиксированные Device и Host, USB 3.0/2.0 OTG A/B по ID, UFP/DFP и обмен ролями данных Type-C. Протоколы SRP, HNP и

<!-- en PDF p.13; unit 24 -->

RSP не поддерживаются.

USB 3.0 xHCI Host:

- До 64 устройств.
- Один interrupter.
- Один порт USB 2.0 и один SuperSpeed.
- Одновременный трафик USB 3.0/2.0 с полосой до 8.48Gbps по английскому источнику.
- Стандартные или открытые драйверы xHCI и классов.
- xHCI Debug Capability.

<!-- en PDF p.13; unit 25 -->

![Технический рисунок английского оригинала, PDF p.13](/docs/rockchip-linux-usb/assets/en-p013-figure-01.png)

<!-- en PDF p.13; unit 26 -->

Рисунок 1-3. USB 3.0 OTG.

<!-- en PDF p.13; unit 27 -->

### 1.5 USB 2.0 PHY

<!-- en PDF p.13; unit 28 -->

PHY USB 2.0 существует в одно- и двухпортовом исполнении. На рисунке 1-4 показан двухпортовый вариант.

<!-- en PDF p.14; unit 29 -->

![Технический рисунок английского оригинала, PDF p.14](/docs/rockchip-linux-usb/assets/en-p014-figure-01.png)

<!-- en PDF p.14; unit 30 -->

Рисунок 1-4. USB 2.0 PHY. Host Port соединён с USB 2.0 Host через UTMI+. OTG Port через UTMI+ соединён с USB 3.0 OTG либо логикой USB 2.0 контроллера USB 2.0 OTG.

<!-- en PDF p.14; unit 31 -->

### 1.6 Type-C USB 3.0 PHY

<!-- en PDF p.14; unit 32 -->

Поддерживаются:

- USB 3.0, только SuperSpeed.
- DisplayPort 1.3, только скорости RBR, HBR и HBR2.
- Канал DisplayPort AUX.
- USB Type-C и DisplayPort Alt Mode.
- Назначения выводов Type-C A, B, C, D, E, F для DisplayPort Alt Mode.
- Прямая и перевёрнутая ориентация.

<!-- en PDF p.14; unit 33 -->

![Технический рисунок английского оригинала, PDF p.14](/docs/rockchip-linux-usb/assets/en-p014-figure-02.png)

<!-- en PDF p.14; unit 34 -->

Рисунок 1-5. Type-C PHY.

<!-- en PDF p.15; unit 35 -->

## 2. Аппаратные схемы и сигналы

<!-- en PDF p.15; unit 36 -->

### 2.1 Аппаратные схемы USB 2.0 Host

<!-- en PDF p.15; unit 37 -->

В этом разделе описаны схемы и сигналы USB 2.0 Host. В зависимости от используемого PHY

<!-- en PDF p.15; unit 38 -->

USB 2.0 различаются обычная схема USB 2.0 Host и схема USB 2.0 HSIC.

<!-- en PDF p.15; unit 39 -->

#### 2.1.1 Обычная схема USB 2.0 Host

<!-- en PDF p.15; unit 40 -->

USB 2.0 работает на 480MHz. Источник рекомендует ширину дорожек DP/DM 7–8 MIL и дифференциальное сопротивление 90 Ω. Предпочтителен внешний слой с заземляющей заливкой, без источников помех рядом и иных сигнальных дорожек непосредственно сверху и снизу. Пример — схема USB 2.0 Host RK3399. Выводы SoC показаны на рисунке 2-1.

<!-- en PDF p.15; unit 41 -->

![Технический рисунок английского оригинала, PDF p.15](/docs/rockchip-linux-usb/assets/en-p015-figure-01.png)

<!-- en PDF p.15; unit 42 -->

Рисунок 2-1. Выводы USB 2.0 Host SoC. Схемы управления VBUS и интерфейса показаны на рисунках 2-2 и 2-3.

<!-- en PDF p.16; unit 43 -->

![Технический рисунок английского оригинала, PDF p.16](/docs/rockchip-linux-usb/assets/en-p016-figure-01.png)

<!-- en PDF p.16; unit 44 -->

Рисунок 2-2. Управление VBUS и интерфейс USB 2.0 Host.

<!-- en PDF p.16; unit 45 -->

![Технический рисунок английского оригинала, PDF p.16](/docs/rockchip-linux-usb/assets/en-p016-figure-02.png)

<!-- en PDF p.16; unit 46 -->

Рисунок 2-3. GPIO управления VBUS USB 2.0 Host.

<!-- en PDF p.16; unit 47 -->

#### 2.1.2 Схема USB 2.0 HSIC

<!-- en PDF p.16; unit 48 -->

HSIC (High Speed Inter Chip) использует DDR 240MHz, обеспечивая 480Mbps, как USB 2.0. Типовое сопротивление линии — 50 Ω; рекомендуемая длина дорожки PCB не более 10cm. На рисунке 2-4 USIC_STROBE — сигнал DDR 240MHz, USIC_DATA — данные. Питание только 0.9V и 1.2V; стандартный сигнальный уровень 1.2V, энергопотребление ниже, чем у USB 2.0 PHY. Пример — схема HSIC RK3399.

<!-- en PDF p.16; unit 49 -->

![Технический рисунок английского оригинала, PDF p.16](/docs/rockchip-linux-usb/assets/en-p016-figure-03.png)

<!-- en PDF p.16; unit 50 -->

Рисунок 2-4. Выводы USB 2.0 HSIC SoC.

<!-- en PDF p.16; unit 51 -->

### 2.2 Схемы USB OTG

<!-- en PDF p.16; unit 52 -->

#### 2.2.1 Схема USB 2.0 OTG

<!-- en PDF p.16; unit 53 -->

Сигналы USB 2.0 OTG:

- OTG_DP/OTG_DM — дифференциальные D+/D-, на каждой линии нужен последовательный резистор 2.2Ω.
- USB_DET — вход для обнаружения Host или зарядного устройства в режиме Peripheral. По умолчанию 0V; при подключении Host/зарядного устройства — 3.0–3.2V.

<!-- en PDF p.17; unit 54 -->

- USB_ID определяет Host/Peripheral. По умолчанию 1.8V благодаря внутренней подтяжке, режим Peripheral. Кабель OTG-Host замыкает ID на землю; при переходе высокого уровня в низкий драйвер включает Host.
- USB_RBIAS — опорный резистор PHY. Его сопротивление влияет на амплитуду USB, поэтому строго следуйте эталонной схеме SDK.
- VCC5V0_OTG в Peripheral служит источником входного USB_DET, а в Host подаёт VBUS 5V устройствам.
- USB_AVDD_1V0/USB_AVDD_1V8/USB_AVDD_3V3 — питание PHY USB 2.0 OTG.

Полная эталонная схема USB 2.0 OTG приведена на рисунках 2-5–2-8, пример PX30 EVB.

<!-- en PDF p.17; unit 55 -->

![Технический рисунок английского оригинала, PDF p.17](/docs/rockchip-linux-usb/assets/en-p017-figure-01.png)

<!-- en PDF p.17; unit 56 -->

Рисунок 2-5. Выводы USB 2.0 OTG SoC.

<!-- en PDF p.18; unit 57 -->

![Технический рисунок английского оригинала, PDF p.18](/docs/rockchip-linux-usb/assets/en-p018-figure-01.png)

<!-- en PDF p.18; unit 58 -->

Рисунок 2-6. Разъём Micro USB 2.0 OTG.

<!-- en PDF p.18; unit 59 -->

![Технический рисунок английского оригинала, PDF p.18](/docs/rockchip-linux-usb/assets/en-p018-figure-02.png)

<!-- en PDF p.18; unit 60 -->

Рисунок 2-7. Схема USB 2.0 OTG_DET.

<!-- en PDF p.19; unit 61 -->

![Технический рисунок английского оригинала, PDF p.19](/docs/rockchip-linux-usb/assets/en-p019-figure-01.png)

<!-- en PDF p.19; unit 62 -->

Рисунок 2-8. Схема USB 2.0 OTG_DRV.

<!-- en PDF p.19; unit 63 -->

#### 2.2.2 Схема USB 3.0 OTG

<!-- en PDF p.19; unit 64 -->

USB 3.0 OTG обеспечивает до 5Gbps и совместим с USB 2.0 OTG. Разъём — Type-C либо Type-A. Поддерживаются четырёхпроводные дифференциальные линии: кабель до 3m и PCB до 11 дюймов. Для снижения помех передача 5Gbps по длинному кабелю выполняется дифференциально. На рисунках 2-9–2-14 показаны схемы Type-C USB 3.0 RK3399.

<!-- en PDF p.19; unit 65 -->

![Технический рисунок английского оригинала, PDF p.19](/docs/rockchip-linux-usb/assets/en-p019-figure-02.png)

<!-- en PDF p.19; unit 66 -->

![Технический рисунок английского оригинала, PDF p.19](/docs/rockchip-linux-usb/assets/en-p019-figure-03.png)

<!-- en PDF p.20; unit 67 -->

![Технический рисунок английского оригинала, PDF p.20](/docs/rockchip-linux-usb/assets/en-p020-figure-01.png)

<!-- en PDF p.20; unit 68 -->

Рисунок 2-9. Назначение контактов Type-C.

<!-- en PDF p.20; unit 69 -->

![Технический рисунок английского оригинала, PDF p.20](/docs/rockchip-linux-usb/assets/en-p020-figure-02.png)

<!-- en PDF p.20; unit 70 -->

Рисунок 2-10. Выводы USB 3.0 OTG SoC.

<!-- en PDF p.21; unit 71 -->

![Технический рисунок английского оригинала, PDF p.21](/docs/rockchip-linux-usb/assets/en-p021-figure-01.png)

<!-- en PDF p.21; unit 72 -->

Рисунок 2-11. Type-C USB 3.0 OTG.

<!-- en PDF p.21; unit 73 -->

![Технический рисунок английского оригинала, PDF p.21](/docs/rockchip-linux-usb/assets/en-p021-figure-02.png)

<!-- en PDF p.21; unit 74 -->

Рисунок 2-12. Определение CC Type-C через FUSB302.

<!-- en PDF p.21; unit 75 -->

![Технический рисунок английского оригинала, PDF p.21](/docs/rockchip-linux-usb/assets/en-p021-figure-03.png)

<!-- en PDF p.21; unit 76 -->

![Технический рисунок английского оригинала, PDF p.21](/docs/rockchip-linux-usb/assets/en-p021-figure-04.png)

<!-- en PDF p.21; unit 77 -->

Рисунок 2-13. Управление VBUS USB 3.0, вариант 1: GPIO.

<!-- en PDF p.22; unit 78 -->

![Технический рисунок английского оригинала, PDF p.22](/docs/rockchip-linux-usb/assets/en-p022-figure-01.png)

<!-- en PDF p.22; unit 79 -->

Рисунок 2-14. Управление VBUS USB 3.0, вариант 2: RK818.

<!-- en PDF p.22; unit 80 -->

### 2.3 Схемы USB GPIO

<!-- en PDF p.22; unit 81 -->

Применение GPIO USB:

- VBUS Regulator GPIO включает/отключает 5V в Host.
- VBUSDET GPIO обнаруживает подключение Device по уровню VBUS, управляя определением зарядки и динамическим энергопотреблением PHY.
- OTG_ID GPIO переключает Device/Host, обычно для Micro/Mini USB2.0. Type-C требует преобразования CC в ID.

VBUS Regulator GPIO широко используется в Rockchip, поэтому далее рассматриваются только VBUSDET и OTG_ID. Для чипов без выведенных VBUSDET/OTG_ID, например RK3506G, GPIO нужен, если требуется обнаруживать горячее подключение Device и автоматически менять роли по ID физического разъёма.

<!-- en PDF p.22; unit 82 -->

#### 2.3.1 Схема USB VBUSDET GPIO

<!-- en PDF p.22; unit 83 -->

VBUSDET GPIO обнаруживает подключение Device, подобно обычному VBUSDET PHY. Если вывод не выведен из корпуса, например RK3506G, GPIO определяет изменение VBUS, управляет определением зарядки и питанием PHY. Само начало соединения Device не зависит от VBUSDET GPIO, поэтому он не обязателен. Он необходим в следующих случаях:

<!-- en PDF p.22; unit 84 -->

1. Device требует определения зарядки либо динамического переключения suspend/normal PHY для снижения энергопотребления.

<!-- en PDF p.22; unit 85 -->

2. Device должен обнаруживать отключение USB.

VBUSDET GPIO не нужен в следующих случаях:

<!-- en PDF p.22; unit 86 -->

1. Вывод VBUSDET PHY уже имеется в корпусе, например RK3506B; дополнительный

<!-- en PDF p.23; unit 87 -->

GPIO не нужен.

<!-- en PDF p.23; unit 88 -->

2. OTG используется только как Host, Device нужен лишь для прошивки.

<!-- en PDF p.23; unit 89 -->

3. Device не требует определения зарядки и динамического управления питанием PHY: USB2 PHY может постоянно оставаться в Normal. Однако тогда отключение USB не определяется. Если оно необходимо, вручную измените драйвер контроллера, определяя Disconnect по прерыванию suspend.

Пример RK3506G_EVB1 показан на рисунке 2-15. Между входным VBUS разъёма и GPIO установлен транзистор, инвертирующий уровень: высокий VBUS даёт низкий GPIO, низкий VBUS — высокий GPIO. Для устройств с собственным питанием это предотвращает утечку от VBUS Host к обесточенному чипу и связанные проблемы при подключении.

<!-- en PDF p.23; unit 90 -->

![Технический рисунок английского оригинала, PDF p.23](/docs/rockchip-linux-usb/assets/en-p023-figure-01.png)

<!-- en PDF p.23; unit 91 -->

Рисунок 2-15. Схема VBUSDET GPIO.

<!-- en PDF p.23; unit 92 -->

#### 2.3.2 Схема USB OTG_ID GPIO

<!-- en PDF p.23; unit 93 -->

OTG_ID GPIO автоматически переключает Device/Host, обычно с Micro/Mini USB2.0. Для Type-C нужен преобразователь CC в ID. Выбор применения:

<!-- en PDF p.24; unit 94 -->

Если ID PHY не выведен, GPIO всё равно необязателен: роли можно переключать командами из раздела «Часто используемые команды USB». ID GPIO нужен для автоматической смены Device/Host по вставленному кабелю. Он не требуется в следующих случаях:

<!-- en PDF p.24; unit 95 -->

1. ID PHY выведен из корпуса, например RK3506B.

<!-- en PDF p.24; unit 96 -->

2. Переключение Device/Host требуется, но допустимы программные команды.

Пример RK3506G Test1 показан на рисунке 2-16. Внешняя подтяжка ID не нужна. В стандартном Device-кабеле ID оставлен неподключённым; в Host/OTG-кабеле замкнут на GND, указывая Host. Для совместимости ID GPIO по умолчанию должен иметь слабую подтяжку вверх, соответствующую Device; вставка OTG-переходника тянет ID вниз и включает Host.

<!-- en PDF p.24; unit 97 -->

![Технический рисунок английского оригинала, PDF p.24](/docs/rockchip-linux-usb/assets/en-p024-figure-01.png)

<!-- en PDF p.24; unit 98 -->

Рисунок 2-16. Схема OTG_ID GPIO.

<!-- en PDF p.25; unit 99 -->

## 3. Настройка USB в ядре

<!-- en PDF p.25; unit 100 -->

Настройка и сохранение USB выполняются как для других модулей ядра. Загрузите конфигурацию по умолчанию:

<!-- en PDF p.25; unit 101 -->

```text
make ARCH=arm64 rockchip_defconfig
```

<!-- en PDF p.25; unit 102 -->

Выберите настройки ядра:

<!-- en PDF p.25; unit 103 -->

```text
make ARCH=arm64 menuconfig
```

<!-- en PDF p.25; unit 104 -->

Сохраните конфигурацию:

<!-- en PDF p.25; unit 105 -->

```text
make ARCH=arm64 savedefconfig
```

<!-- en PDF p.25; unit 106 -->

Замените rockchip_defconfig полученным defconfig.

<!-- en PDF p.25; unit 107 -->

### 3.1 Настройка USB PHY

<!-- en PDF p.25; unit 108 -->

```text
Device Drivers  --->
    PHY Subsystem  --->
        ...
        <*> Rockchip INNO USB2PHY Driver
        ...
        <*> Rockchip TYPEC PHY Driver
        ...
        <*> Rockchip INNO USB 3.0 PHY Driver
```

<!-- en PDF p.25; unit 109 -->

Rockchip INNO USB2PHY Driver предназначен для USB 2.0 PHY Innosilicon; Rockchip TYPEC PHY Driver — для USB 3.0 PHY, например RK3399; Rockchip INNO USB 3.0 PHY Driver — для USB 3.0 PHY Innosilicon, например RK3328.

<!-- en PDF p.25; unit 110 -->

### 3.2 Настройка USB Host

<!-- en PDF p.25; unit 111 -->

Настройки USB Host находятся здесь:

<!-- en PDF p.25; unit 112 -->

```text
Device Drivers  --->
        [*] USB support  --->
-*- Support for Host-side USB
...
<*> xHCI HCD (USB 3.0) support
-*- Generic xHCI driver for a platform device
...
<*> EHCI HCD (USB 2.0) support
[ ]     Root Hub Transaction Translators
[*]     Improved Transaction Translator scheduling
<*> Generic EHCI driver for a platform device
...
<*> OHCI HCD (USB 1.1) support
< >     OHCI support for PCI-bus USB controllers
<*>     Generic OHCI driver for a platform device
```

<!-- en PDF p.26; unit 114 -->

Сначала включите USB support для основы USB, затем Support for Host-side USB для Host. OHCI нужен для USB 1.1 Host, EHCI — USB 2.0 Host, xHCI — USB 3.0 Host.

Примечание: для уменьшения ядра rk3308_linux_defconfig не включает USB Host, хотя RK3308 содержит один USB 2.0 Host EHCI/OHCI. Для его использования включите OHCI/EHCI и соответствующие драйверы классов устройств.

<!-- en PDF p.26; unit 115 -->

### 3.3 Настройка USB OTG

<!-- en PDF p.26; unit 116 -->

Для USB 2.0 OTG выберите DesignWare USB2 DRD Core Support и режим работы. Для USB 3.0 OTG — DesignWare USB3 DRD Core Support и режим.

<!-- en PDF p.26; unit 117 -->

```text
Device Drivers  --->
    -*- Support for Host-side USB
    [*] USB support  --->
        ...
        <*> DesignWare USB2 DRD Core Support
                DWC2 Mode Selection (Dual Role mode)
        ...
        <*> DesignWare USB3 DRD Core Support
                DWC3 Mode Selection (Dual Role mode)
```

<!-- en PDF p.27; unit 118 -->

### 3.4 Настройка USB Gadget

<!-- en PDF p.27; unit 119 -->

По умолчанию Rockchip поддерживает Gadget ACM, RNDIS, MSC, MTP, PTP, Accessory, ADB, MIDI и Audio. Дополнительные функции включаются по требованиям продукта; одновременно нужно изменить Android init.rk30board.usb.rc и init.usb.configfs.rc.

<!-- en PDF p.27; unit 120 -->

```text
DeviceDrivers  --->
    [*]USB support  --->
        [*] USB Gadget Support  --->
            ...
            USBGadget Drivers (USB functions configurable through configfs)  --->
                [ ]       Generic serial bulk in/out
                [*]       Abstract Control Model (CDC ACM)
                [ ]       Object Exchange Model (CDC OBEX)
                [ ]       Network Control Model (CDC NCM)
                [ ]       Ethernet Control Model (CDC ECM)
                [ ]       Ethernet Control Model (CDC ECM) subset
                [*]       RNDIS
                [ ]       Ethernet Emulation Model (EEM)
                [*]       Mass storage
                [ ]       Loopback and sourcesink function (for testing)
                [*]       Function filesystem (FunctionFS)
                [*]       MTP gadget
                [*]         PTP gadget
                [*]       Accessory gadget
                [*]         Audio Source gadget
                [*]       Uevent notification of Gadget state
                [ ]       Audio Class 1.0
                [ ]       Audio Class 2.0
                [*]       MIDI function
                [ ]       HID function
                [ ]       USB Webcam function
                [ ]       Printer function
```

<!-- en PDF p.27; unit 121 -->

### 3.5 Настройка драйверов классов USB

<!-- en PDF p.27; unit 122 -->

#### 3.5.1 Mass Storage Class

<!-- en PDF p.27; unit 123 -->

USB-накопитель относится к SCSI, поэтому перед USB Mass Storage настройте SCSI.

<!-- en PDF p.27; unit 124 -->

```text
Device Drivers --->
    SCSI device support --->
        <*> SCSI device support
[ ] SCSI: use blk-mq I/O path by default
[*] legacy /proc/scsi/ support
    *** SCSI support type (disk, tape, CD-ROM) ***
<*> SCSI disk support
< > SCSI tape support
< > SCSI OnStream SC-x0 tape support
< > SCSI CDROM support
<*> SCSI generic support
<*> SCSI media changer support
[*] Verbose SCSI error reporting (kernel size +=75K)
[*] SCSI logging facility
[*] Asynchronous SCSI scanning
    SCSI Transports  --->
[*] SCSI low-level drivers  --->
[ ] PCMCIA SCSI adapter support  ----
[ ] SCSI Device Handlers  ----
```

<!-- en PDF p.28; unit 126 -->

После SCSI Device Support включите USB Mass Storage support в USB Support.

<!-- en PDF p.28; unit 127 -->

```text
Device Driver --->
    [*] USB support  --->
        <*> USB Mass Storage support
```

<!-- en PDF p.28; unit 128 -->

#### 3.5.2 USB Serial Converter

<!-- en PDF p.28; unit 129 -->

Поддержка USB 3G Modem:

<!-- en PDF p.28; unit 130 -->

```text
Device Driver --->
    [*] USB support  --->
        <*> USB Serial Converter support  --->
            <*>   USB driver for GSM and CDMA modems
```

<!-- en PDF p.28; unit 131 -->

```text
Device Driver --->
    [*] Network device support  --->
        <*>   PPP (point-to-point protocol) support
            <*>     PPP BSD-Compress compression
            <*>     PPP Deflate compression
            [*]     PPP filtering
            <*>     PPP MPPE compression (encryption)
            [*]     PPP multilink support
            <*>     PPP over Ethernet
            <*>     PPP over L2TP
            <*>     PPP on L2TP Access Concentrator
            <*>     PPP on PPTP Network Server
<*>     PPP support for async serial ports
<*>     PPP support for sync tty ports
```

<!-- en PDF p.29; unit 133 -->

Поддержка PL2303: включите показанную конфигурацию (в исходной строке встречается PL203) и одновременно отключите USB driver for GSM and CDMA modems, иначе PL2303 может ошибочно определиться как 3G-модем.

<!-- en PDF p.29; unit 134 -->

```text
Device Driver --->
    [*] USB support  --->
        <*> USB Serial Converter support  --->
            <*> USB Prolific 2303 Single Port Serial Driver
```

<!-- en PDF p.29; unit 135 -->

Поддержка USB GPS, например u-blox 6 - GPS Receiver:

<!-- en PDF p.29; unit 136 -->

```text
Device Drivers  --->
    [*] USB support --->
        [*] USB Modem (CDC ACM) support
```

<!-- en PDF p.29; unit 137 -->

#### 3.5.3 USB HID

<!-- en PDF p.29; unit 138 -->

Для стандартных мышей и клавиатур USB выберите следующую HID-конфигурацию:

<!-- en PDF p.29; unit 139 -->

```text
Device Drivers  --->
    [*] HID support
        [*] USB HID transport layer
        [ ] PID device support
        [*] /dev/hiddev raw HID device support
```

<!-- en PDF p.29; unit 140 -->

#### 3.5.4 USB Net

<!-- en PDF p.29; unit 141 -->

Настройка USB Bluetooth:

<!-- en PDF p.30; unit 142 -->

```text
[*] Networking support  --->
    ...
    <*> Bluetooth subsystem support  --->
        Bluetooth device drivers  --->
            ...
            <*> HCI USB driver
            [*]   Broadcom protocol support (NEW)
            [*]   Realtek protocol support (NEW)
            ...
```

<!-- en PDF p.30; unit 143 -->

USB Wi-Fi требует специального драйвера производителя. Настройка USB Ethernet:

<!-- en PDF p.30; unit 144 -->

```text
Device Driver --->
    [*] Network device support  --->
        <*> USB Network Adapters  --->
            <*> USB CATC NetMate-based Ethernet device support
            <*> USB KLSI KL5USB101-based ethernet device support
            <*> USB Pegasus/Pegasus-II based ethernet device support
            <*> USB RTL8150 based ethernet device support
            <*> Realtek RTL8152/RTL8153 Based USB Ethernet Adapters
            < > Microchip LAN78XX Based USB Ethernet Adapters
            <*> Multi-purpose USB Networking Framework
            <*>     ASIX AX88xxx Based USB 2.0 Ethernet Adapters
            <*>     ASIX AX88179/178A USB 3.0/2.0 to Gigabit Ethernet
            -*- CDC Ethernet support (smart devices such as cable modems)
            <*> CDC EEM support
            -*- CDC NCM support
            < > Huawei NCM embedded AT channel support
            <*> CDC MBIM support
            <*> Davicom DM96xx based USB 10/100 ethernet devices
            < > CoreChip-sz SR9700 based USB 1.1 10/100 ethernet devices
            < > CoreChip-sz SR9800 based USB 2.0 10/100 ethernet devices
            <*> SMSC LAN75XX based USB 2.0 gigabit ethernet devices
            <*> SMSC LAN95XX based USB 2.0 10/100 ethernet devices
            <*> GeneSys GL620USB-A based cables
            <*> NetChip 1080 based cables (Laplink, ...)
            <*> Prolific PL-2301/2302/25A1/27A1 based cables
            <*> MosChip MCS7830 based Ethernet adapters
            <*> Host for RNDIS and ActiveSync devices
            <*> Simple USB Network Links (CDC Ethernet subset)
            [*]     ALi M5632 based 'USB 2.0 Data Link' cables
            [*]     AnchorChips 2720 based cables (Xircom PGUNET, ...)
            [*]     eTEK based host-to-host cables (Advance, Belkin, ...)
            [*]     Embedded ARM Linux links (iPaq, ...)
            [*]     Epson 2888 based firmware (DEVELOPMENT)
            [*]     KT Technology KC2190 based cables (InstaNet)
<*> Sharp Zaurus (stock ROMs) and compatible
<*> Conexant CX82310 USB ethernet port
<*> Samsung Kalmia based LTE USB modem
<*> QMI WWAN driver for Qualcomm MSM based 3G and LTE modems
<*> Option USB High Speed Mobile Devices
<*> Intellon PLC based usb adapter
<*> Apple iPhone USB Ethernet driver
<*> USB-to-WWAN Driver for Sierra Wireless modems
< > LG VL600 modem dongle
< > QingHeng CH9200 USB ethernet support
```

<!-- en PDF p.31; unit 146 -->

#### 3.5.5 USB Camera

<!-- en PDF p.31; unit 147 -->

```text
Device Driver --->
    <*> Multimedia support  --->
        [*]   Media USB Adapters  --->
            *** Webcam devices ***
            <*> USB Video Class (UVC)
            [*] UVC input events device support
```

<!-- en PDF p.31; unit 148 -->

#### 3.5.6 USB Audio

<!-- en PDF p.31; unit 149 -->

```text
Device Driver --->
    <*> Sound card support  --->
        <*> Advanced Linux Sound Architecture --->
            ...
            [*] USB sound devices   --->
                [*] USB Audio /MIDI driver
```

<!-- en PDF p.31; unit 150 -->

#### 3.5.7 USB HUB

<!-- en PDF p.31; unit 151 -->

Чтобы поддерживать внешние USB-концентраторы, отключите Disable external HUBs.

<!-- en PDF p.31; unit 152 -->

```text
Device Drivers --->
    [*] USB support --->
        -*- Support for Host-side USB
        ...
        [ ]     Disable external hubs
```

<!-- en PDF p.32; unit 153 -->

Другие устройства, например GPS и принтеры, могут требовать драйвер производителя либо стандартный драйвер класса. Методы поддержки можно найти в интернете; специальных требований платформы Rockchip к ним нет.

<!-- en PDF p.33; unit 154 -->

## 4. Настройка USB DTS

<!-- en PDF p.33; unit 155 -->

### 4.1 DTS USB 2.0/3.0 PHY

<!-- en PDF p.33; unit 156 -->

USB 2.0 PHY и USB 3.0 PHY независимы и существенно различаются; DTS настраивается отдельно. Конфигурация RK3399 особенно гибкая и сложная; см. Rockchip_RK3399_Developer_Guide_USB_DTS_CN.

<!-- en PDF p.33; unit 157 -->

#### 4.1.1 DTS USB 2.0 PHY

<!-- en PDF p.33; unit 158 -->

Основные USB 2.0 PHY IP Rockchip — Innosilicon и Synopsis. Аппаратные различия требуют разных DTS. Большинство PHY Rockchip используют Innosilicon.

<!-- en PDF p.33; unit 159 -->

1. Документация DTS:

- Innosilicon, кроме RK3188/RK3288: `Documentation/devicetree/bindings/phy/phy-rockchip-inno-usb2.txt`.
- Synopsis, RK3188/RK3288: `Documentation/devicetree/bindings/phy/rockchip-usb-phy.txt`.

<!-- en PDF p.33; unit 160 -->

2. Пример RK3399 USB 2.0 PHY0. Регистры PHY находятся в GRF, поэтому родительский узел — GRF с его базовым адресом. PHY содержит Host и OTG, использующие общий опорный входной тактовый сигнал, выход 480MHz и смещение регистров GRF. Каждому порту нужен дочерний узел: otg-port или host-port. Их прерывания различаются.

<!-- en PDF p.33; unit 161 -->

```text
grf: syscon@ff770000 {
    compatible = "rockchip,rk3399-grf", "syscon", "simple-mfd";
    reg = <0x0 0xff770000 0x0 0x10000>;
    #address-cells = <1>;
    #size-cells = <1>;
    u2phy0: usb2-phy@e450 {
        compatible = "rockchip,rk3399-usb2phy";
        reg = <0xe450 0x10>;
        clocks = <&cru SCLK_USB2PHY0_REF>;
        clock-names = "phyclk";
        #clock-cells = <0>;
        clock-output-names = "clk_usbphy0_480m";
        status = "disabled";

        u2phy0_host: host-port {
            #phy-cells = <0>;
            interrupts = <GIC_SPI 27 IRQ_TYPE_LEVEL_HIGH 0>;
            interrupt-names = "linestate";
            status = "disabled";
        };

        u2phy0_otg: otg-port {
            #phy-cells = <0>;
            interrupts = <GIC_SPI 103 IRQ_TYPE_LEVEL_HIGH 0>,
                         <GIC_SPI 104 IRQ_TYPE_LEVEL_HIGH 0>,
                         <GIC_SPI 106 IRQ_TYPE_LEVEL_HIGH 0>;
            interrupt-names = "otg-bvalid", "otg-id",
                              "linestate";
            status = "disabled";
        };
    };
};
```

<!-- en PDF p.34; unit 163 -->

В DTS платы для Host и OTG в Host может потребоваться необязательный регулятор VBUS 5V. В примере RK3399 GPIO High включает 5V, Low выключает. GPIO описан как regulator. regulator-always-on удерживает GPIO высоким и VBUS включённым от загрузки до выключения.

<!-- en PDF p.34; unit 164 -->

```text
vcc5v0_host: vcc5v0-host-regulator {
    compatible = "regulator-fixed";
    enable-active-high;
    gpio = <&gpio4 25 GPIO_ACTIVE_HIGH>;
    pinctrl-names = "default";
    pinctrl-0 = <&host_vbus_drv>;
    regulator-name = "vcc5v0_host";
    regulator-always-on;
};

usb2 {
    host_vbus_drv: host-vbus-drv {
        rockchip,pins =
                <4 25 RK_FUNC_GPIO &pcfg_pull_none>;
    };
};
```

<!-- en PDF p.35; unit 166 -->

Свойство phy-supply ссылается на регулятор vcc5v0_host, питающий VBUS 5V. Ядро PHY автоматически разбирает его и управляет GPIO VBUS.

<!-- en PDF p.35; unit 167 -->

```text
u2phy0_host: host-port {
    phy-supply = <&vcc5v0_host>;
    status = "okay";
};
```

<!-- en PDF p.35; unit 168 -->

#### 4.1.2 DTS USB 3.0 PHY

<!-- en PDF p.35; unit 169 -->

Основные варианты — Type-C PHY, Innosilicon USB 3.0 PHY и Innosilicon USB 3.0 CombPhy. Аппаратные различия требуют отдельных DTS.

<!-- en PDF p.35; unit 170 -->

1. Документация:

- Type-C, RK3399/RK3399Pro: `Documentation/devicetree/bindings/phy/phy-rockchip-typec.txt`.
- Innosilicon USB 3.0, RK3228H/RK3228 согласно источнику: `Documentation/devicetree/bindings/phy/phy-rockchip-inno-usb3.txt`.
- Innosilicon USB 3.0/PCIe Combphy RK1808: `Documentation/devicetree/bindings/phy/phy-rockchip-inno-combophy.txt`.

<!-- en PDF p.35; unit 171 -->

2. Пример RK3399 Type-C0. Type-C PHY объединяет USB 3.0 SuperSpeed и передатчик DisplayPort, поэтому tcphy0 содержит tcphy0_dp и tcphy0_usb3. Свойства:

- rockchip,grf: phandle syscon для GRF.
- rockchip,typec-conn-dir: регистр направления разъёма.
- rockchip,usb3tousb2-en: регистр принудительного USB3→USB2.
- rockchip,external-psm: регистр внешнего тактирования PSM.
- rockchip,pipe-status: регистр состояния PIPE.
- rockchip,uphy-dp-sel: регистр выбора PHY для DP.

<!-- en PDF p.36; unit 172 -->

```text
tcphy0: phy@ff7c0000 {
    compatible = "rockchip,rk3399-typec-phy";
    reg = <0x0 0xff7c0000 0x0 0x40000>;
    rockchip,grf = <&grf>;
    #phy-cells = <1>;
    clocks = <&cru SCLK_UPHY0_TCPDCORE>,
             <&cru SCLK_UPHY0_TCPDPHY_REF>;
    clock-names = "tcpdcore", "tcpdphy-ref";
    assigned-clocks = <&cru SCLK_UPHY0_TCPDCORE>;
    assigned-clock-rates = <50000000>;
    power-domains = <&power RK3399_PD_TCPD0>;
    resets = <&cru SRST_UPHY0>,
             <&cru SRST_UPHY0_PIPE_L00>,
             <&cru SRST_P_UPHY0_TCPHY>;
    reset-names = "uphy", "uphy-pipe", "uphy-tcphy";
    rockchip,typec-conn-dir = <0xe580 0 16>;
    rockchip,usb3tousb2-en = <0xe580 3 19>;
    rockchip,usb3-host-disable = <0x2434 0 16>;
    rockchip,usb3-host-port = <0x2434 12 28>;
    rockchip,external-psm = <0xe588 14 30>;
    rockchip,pipe-status = <0xe5c0 0 0>;
    rockchip,uphy-dp-sel = <0x6268 19 19>;
    status = "disabled";

    tcphy0_dp: dp-port {
        #phy-cells = <0>;
    };

    tcphy0_usb3: usb3-port {
        #phy-cells = <0>;
    };
};
```

<!-- en PDF p.36; unit 173 -->

RK3399 имеет два почти одинаковых Type-C PHY. Здесь приведён только DTSI. Связанные свойства DTS, включая extcon и микросхему CC FUSB302, описаны в Rockchip_RK3399_Developer_Guide_USB_CN.

<!-- en PDF p.36; unit 174 -->

### 4.2 DTS контроллера USB 2.0

<!-- en PDF p.36; unit 175 -->

Две архитектуры:

- EHCI (Enhanced Host Controller Interface), только USB 2.0, совместно с OHCI (Open Host Controller Interface), USB 1.1/1.0.
- DWC2 (DesignWare Cores USB 2.0 Hi-Speed OTG), USB 2.0/1.1/1.0.

<!-- en PDF p.37; unit 176 -->

Далее приведены DTS обеих архитектур.

<!-- en PDF p.37; unit 177 -->

#### 4.2.1 DTS USB 2.0 Host

<!-- en PDF p.37; unit 178 -->

1. Документация:

`Documentation/devicetree/bindings/usb/usb-ehci.txt`

`Documentation/devicetree/bindings/usb/usb-ohci.txt`

<!-- en PDF p.37; unit 179 -->

2. Пример RK3399 Host0 EHCI/OHCI. compatible фиксирован как generic-ehci и generic-ohci соответственно. EHCI/OHCI совместно используют clocks и phys. power-domains задаётся только при поддержке контроллером этой функции.

<!-- en PDF p.37; unit 180 -->

```text
usb_host0_ehci: usb@fe380000 {
    compatible = "generic-ehci";
    reg = <0x0 0xfe380000 0x0 0x20000>;
    interrupts = <GIC_SPI 26 IRQ_TYPE_LEVEL_HIGH 0>;
    clocks = <&cru HCLK_HOST0>, <&cru HCLK_HOST0_ARB>,
             <&cru SCLK_USBPHY0_480M_SRC>;
    clock-names = "hclk_host0", "hclk_host0_arb", "usbphy0_480m";
    phys = <&u2phy0_host>;
    phy-names = "usb";
    power-domains = <&power RK3399_PD_PERIHP>;
    status = "disabled";
};

usb_host0_ohci: usb@fe3a0000 {
    compatible = "generic-ohci";
    reg = <0x0 0xfe3a0000 0x0 0x20000>;
    interrupts = <GIC_SPI 28 IRQ_TYPE_LEVEL_HIGH 0>;
    clocks = <&cru HCLK_HOST0>, <&cru HCLK_HOST0_ARB>,
             <&cru SCLK_USBPHY0_480M_SRC>;
    clock-names = "hclk_host0", "hclk_host0_arb", "usbphy0_480m";
    phys = <&u2phy0_host>;
    phy-names = "usb";
    power-domains = <&power RK3399_PD_PERIHP>;
    status = "disabled";
};
```

<!-- en PDF p.38; unit 181 -->

#### 4.2.2 DTS USB 2.0 OTG

<!-- en PDF p.38; unit 182 -->

1. USB 2.0 OTG использует DWC2. Linux-4.4 содержит dwc2 и старый dwc_otg_310, последний только для RK3288/RK3368. Начиная с Linux-4.19 все SoC используют dwc2; старый вариант не поддерживается.

Для dwc2, Linux-4.4 и новее:

`Documentation/devicetree/bindings/usb/dwc2.txt`

`Documentation/devicetree/bindings/usb/generic.txt`

Для dwc_otg_310, только Linux-4.4 RK3288/RK3368:

`Documentation/devicetree/bindings/usb/rockchip-usb.txt`

<!-- en PDF p.38; unit 183 -->

2. Пример RK3328 USB 2.0 OTG. Свойства:

- dr_mode: host, peripheral или otg, см. usb/generic.txt.
- g-rx-fifo-size: RX FIFO Gadget.
- g-np-tx-fifo-size: непериодический TX FIFO Gadget.
- g-tx-fifo-size: TX FIFO каждой точки, кроме ep0.
- g-use-dma: включение DMA Gadget.
- phys: поставщик PHY.
- phy-names: usb2-phy.

Три свойства FIFO настраиваются под Device-приложение продукта:

<!-- en PDF p.38; unit 184 -->

1. g-np-tx-fifo-size задаёт FIFO точки 0; рекомендуется 16 единиц по 4Bytes.

<!-- en PDF p.38; unit 185 -->

2. g-rx-fifo-size задаёт общий RX FIFO всех OUT-точек; рекомендуется 275 единиц по 4Bytes.

<!-- en PDF p.38; unit 186 -->

3. g-tx-fifo-size задаёт отдельный TX FIFO каждой IN-точки. Настройте используемые IN-точки, соблюдая два правила:

<!-- en PDF p.38; unit 187 -->

1. TX FIFO не меньше EP max-packet.

<!-- en PDF p.38; unit 188 -->

2. Чем больше TX FIFO, тем выше производительность; при достаточной памяти рекомендуется не менее двух EP max-packet.

<!-- en PDF p.38; unit 189 -->

```text
usb20_otg: usb@ff580000 {
    compatible = "rockchip,rk3328-usb", "rockchip,rk3066-usb",
                 "snps,dwc2";
    reg = <0x0 0xff580000 0x0 0x40000>;
    interrupts = <GIC_SPI 23 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru HCLK_OTG>, <&cru HCLK_OTG_PMU>;
    clock-names = "otg", "otg_pmu";
    dr_mode = "otg";
    g-np-tx-fifo-size = <16>;
    g-rx-fifo-size = <275>;
    g-tx-fifo-size = <256 128 128 64 64 32>;
    g-use-dma;
    phys = <&u2phy_otg>;
    phy-names = "usb2-phy";
    status = "disabled";
};
```

<!-- en PDF p.39; unit 191 -->

### 4.3 DTS контроллера USB 3.0

<!-- en PDF p.39; unit 192 -->

#### 4.3.1 DTS USB 3.0 Host

<!-- en PDF p.39; unit 193 -->

xHCI встроен в DWC3 OTG и не требует отдельного DTS. Достаточно DWC3 со свойством dr_mode=otg или host.

<!-- en PDF p.39; unit 194 -->

#### 4.3.2 DTS USB 3.0 OTG

<!-- en PDF p.39; unit 195 -->

1. USB 3.0 OTG использует DWC3. DTS Linux-4.4 и Linux-4.19/новее

<!-- en PDF p.39; unit 196 -->

различаются, поскольку драйвер DWC3 существенно обновлён; см. раздел драйвера USB 3.0 OTG.

Linux-4.4:

- `Documentation/devicetree/bindings/usb/dwc3.txt`: общие свойства DWC3.
- `Documentation/devicetree/bindings/usb/generic.txt`: общие свойства USB.
- `Documentation/devicetree/bindings/usb/rockchip,dwc3.txt`: RK3399/RK1808.
- `Documentation/devicetree/bindings/usb/rockchip-inno,dwc3.txt`: RK3328/RK3228H.

Linux-4.19 и новее используют dwc3.txt, generic.txt и

<!-- en PDF p.40; unit 197 -->

`Documentation/devicetree/bindings/usb/rockchip-inno,dwc3.txt` для RK3328/RK3228H.

В Linux-4.4 power-domains, resets (в английском тексте restets) и extcon находятся в родительском usbdrd3; в Linux-4.19 они перенесены в usbdrd_dwc3. Для Type-C→Type-A USB 2.0/3.0 OTG в Linux-4.19 необходимо extcon в usbdrd_dwc3 для программного переключения роли; Linux-4.4 этого не требует.

<!-- en PDF p.40; unit 198 -->

2. Пример RK3399 Linux-4.4: родитель usbdrd3_0, дочерний usbdrd_dwc3_0. Для всех DWC3 SoC, кроме RK3328/RK3228H, родительский compatible должен включать rockchip,rk3399-dwc3; дочерний — snps,dwc3. Родитель задаёт clocks, power-domains, reset уровня чипа; дочерний — параметры контроллера, включая quirks, применимые ко всем DWC3.

<!-- en PDF p.40; unit 199 -->

```text
usbdrd3_0: usb0 {
        compatible = "rockchip,rk3399-dwc3";
        clocks = <&cru SCLK_USB3OTG0_REF>, <&cru SCLK_USB3OTG0_SUSPEND>,
             <&cru ACLK_USB3OTG0>, <&cru ACLK_USB3_GRF>;
        clock-names = "ref_clk", "suspend_clk",
                  "bus_clk", "grf_clk";
        power-domains = <&power RK3399_PD_USB3>;
        resets = <&cru SRST_A_USB3_OTG0>;
        reset-names = "usb3-otg";
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;
        status = "disabled";

        usbdrd_dwc3_0: dwc3@fe800000 {
            compatible = "snps,dwc3";
            reg = <0x0 0xfe800000 0x0 0x100000>;
            interrupts = <GIC_SPI 105 IRQ_TYPE_LEVEL_HIGH 0>;
            dr_mode = "otg";
            phys = <&u2phy0_otg>, <&tcphy0_usb3>;
            phy-names = "usb2-phy", "usb3-phy";
            phy_type = "utmi_wide";
            snps,dis_enblslpm_quirk;
            snps,dis-u2-freeclk-exists-quirk;
            snps,dis_u2_susphy_quirk;
            snps,dis-del-phy-power-chg-quirk;
            snps,tx-ipgap-linecheck-dis-quirk;
            snps,xhci-slow-suspend-quirk;
            snps,xhci-trb-ent-quirk;
            snps,usb3-warm-reset-on-resume-quirk;
        status = "disabled";
    };
};
```

<!-- en PDF p.41; unit 201 -->

### 4.4 DTS USB GPIO

<!-- en PDF p.41; unit 202 -->

Начиная с Linux-6.1 SDK Rockchip поддерживает USB VBUSDET/GPIO через drivers/extcon/extcon-usb-gpio.c. Он инициализирует GPIO, обрабатывает прерывания и уведомляет PHY через extcon. PHY по EXTCON_USB/EXTCON_USB_HOST определяет Device hotplug и меняет режим OTG. Подробности — в разделе драйвера GPIO и программного потока.

<!-- en PDF p.41; unit 203 -->

#### 4.4.1 DTS VBUSDET GPIO

<!-- en PDF p.41; unit 204 -->

Пример RK3506G EVB1: по аппаратной схеме VBUSDET GPIO — GPIO1_C5. Эталонный DTS:

<!-- en PDF p.41; unit 205 -->

```text
extcon_usb: extcon-usb {
        compatible = "linux,extcon-usb-gpio";
        /* The hardware design inverts the voltage level, so it must be configured as
GPIO_ACTIVE_LOW here. */
        vbus-gpio = <&gpio1 RK_PC5 GPIO_ACTIVE_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&usb_extcon_vbus>;
        status = "okay";
};

&pinctrl {
        usb {
                usb_extcon_vbus: usb-extcon-vbus {
                rockchip,pins = <1 RK_PC5 RK_FUNC_GPIO &pcfg_pull_none>;
            };
        };
};

&u2phy_otg0 {
        /* Add the property rockchip,gpio-vbus-det, indicating that the PHY driver supports
VBUS GPIO detection method. */
        rockchip,gpio-vbus-det;
        status = "okay";
};

&usb2phy {
        extcon = <&extcon_usb>;
        status = "okay";
};
```

<!-- en PDF p.42; unit 206 -->

Если VBUSDET PHY не выведен и схемы VBUSDET GPIO нет, такая настройка не нужна. Однако добавьте rockchip,vbus-always-on в u2phy_otg0: это отключает определение зарядки и динамический suspend порта USB2 PHY OTG0.

<!-- en PDF p.42; unit 207 -->

```text
&u2phy_otg0 {
        rockchip,vbus-always-on;
};
```

<!-- en PDF p.42; unit 208 -->

#### 4.4.2 DTS OTG_ID GPIO

<!-- en PDF p.42; unit 209 -->

Пример RK3506G TEST1: по аппаратной схеме ID GPIO — GPIO3_B4. Эталонный DTS:

<!-- en PDF p.42; unit 210 -->

```text
extcon_usb: extcon-usb {
        compatible = "linux,extcon-usb-gpio";
        id-gpio = <&gpio3 RK_PB4 GPIO_ACTIVE_HIGH>;
        /* Must set pinctrl-names to "default", otherwise the pcfg_pull_up configuration
will not take effect. */
        pinctrl-names = "default";
        pinctrl-0 = <&usb_extcon_id>;
        status = "okay";
};

&pinctrl {
        usb {
                usb_extcon_id: usb-extcon-id {
                        /* The ID should be internally pulled high by default, so it should
be configured as pcfg_pull_up. */
                        rockchip,pins = <3 RK_PB4 RK_FUNC_GPIO &pcfg_pull_up>;
                };
        };
};

&u2phy_otg0 {
        /* Add the property rockchip,gpio-id-det, indicating that the PHY driver supports ID
GPIO detection method. */
        rockchip,gpio-id-det;
        status = "okay";
};

&usb2phy {
        extcon = <&extcon_usb>;
        status = "okay";
};
```

<!-- en PDF p.43; unit 211 -->

#### 4.4.3 DTS VBUSDET/OTG_ID GPIO

<!-- en PDF p.43; unit 212 -->

Если оба вывода ID и USB_VBUSDET отсутствуют, например RK3506G, а аппаратно нужны оба GPIO, используйте следующую конфигурацию на основе RK3506G TEST1:

<!-- en PDF p.43; unit 213 -->

```text
extcon_usb: extcon-usb {
        compatible = "linux,extcon-usb-gpio";
        vbus-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
        id-gpio = <&gpio3 RK_PB4 GPIO_ACTIVE_HIGH>;
        /* Must set pinctrl-names to "default", otherwise the pcfg_pull_up configuration
will not take effect. */
        pinctrl-names = "default";
        /* pinctrl-0 references both usb_extcon_vbus and usb_extcon_id simultaneously. */
        pinctrl-0 = <&usb_extcon_vbus &usb_extcon_id>;
        status = "okay";
};

&pinctrl {
        usb {
                usb_extcon_id: usb-extcon-id {
                        rockchip,pins = <3 RK_PB4 RK_FUNC_GPIO &pcfg_pull_up>;
                };

                usb_extcon_vbus: usb-extcon-vbus {
                        rockchip,pins = <3 RK_PB2 RK_FUNC_GPIO &pcfg_pull_none>;
                };
        };
};

&u2phy_otg0 {
        rockchip,gpio-vbus-det;
        rockchip,gpio-id-det;
        status = "okay";
};

&usb2phy {
        extcon = <&extcon_usb>;
        status = "okay";
};
```

<!-- en PDF p.44; unit 214 -->

## 5. Разработка драйверов USB

<!-- en PDF p.44; unit 215 -->

### 5.1 Архитектура USB Linux

<!-- en PDF p.44; unit 216 -->

Стек USB Linux многоуровневый. На рисунке 5-1 слева показаны драйверы Device, справа — Host, снизу — контроллеры и PHY SoC Rockchip.

<!-- en PDF p.44; unit 217 -->

![Технический рисунок английского оригинала, PDF p.44](/docs/rockchip-linux-usb/assets/en-p044-figure-01.png)

<!-- en PDF p.44; unit 218 -->

Рисунок 5-1. Архитектура драйверов USB Linux.

<!-- en PDF p.44; unit 219 -->

### 5.2 Драйверы USB PHY

<!-- en PDF p.44; unit 220 -->

Этот раздел кратко описывает код PHY. Аппаратную архитектуру, регистры и настройку сигналов см. в TRM чипа и Rockchip_Introduction_USB_SQ_Tool_CN.

<!-- en PDF p.44; unit 221 -->

#### 5.2.1 Драйвер USB 2.0 PHY

<!-- en PDF p.44; unit 222 -->

Rockchip использует Innosilicon и Synopsis USB 2.0 PHY с разной аппаратной архитектурой и отдельными драйверами. SoC с одинаковым IP используют общий драйвер, а не отдельный для каждого чипа.

<!-- en PDF p.45; unit 223 -->

1. Драйвер Innosilicon: `drivers/phy/phy-rockchip-inno-usb2.c`. Драйвер Synopsis, только RK3188/RK3288: `drivers/phy/rockchip/phy-rockchip-usb.c`. Большинство остальных чипов используют Innosilicon; далее описан именно он.

<!-- en PDF p.45; unit 224 -->

2. Innosilicon USB 2.0 PHY:

- Полное соответствие USB 2.0.
- Передача 480/12/1.5Mbps.
- Все тестовые режимы USB 2.0.
- Один либо два порта на PHY; двухпортовый содержит OTG и Host.
- OTG поддерживает Dual Role.
- Полная поддержка Battery Charge 1.2.

<!-- en PDF p.45; unit 225 -->

3. Структура rockchip_usb2phy_cfg управляет регистрами PHY. При добавлении SoC с Innosilicon главным образом добавляют соответствующую rkxxxx_phy_cfgs.

<!-- en PDF p.45; unit 226 -->

```text
struct rockchip_usb2phy_cfg {
        unsigned int    reg;
        unsigned int    num_ports;
        int (*phy_tuning)(struct rockchip_usb2phy *);
        struct usb2phy_reg      clkout_ctl;
        const struct rockchip_usb2phy_port_cfg  port_cfgs[USB2PHY_NUM_PORTS];
        const struct rockchip_chg_det_reg       chg_det;
};
```

<!-- en PDF p.45; unit 227 -->

Поля rockchip_usb2phy_cfg:

- reg — смещение PHY в GRF, совпадающее с reg в DTS для сопоставления конфигураций.
- num_ports — число портов; для OTG+Host равно 2.
- phy_tuning — настройка сигнала, например предыскажения и амплитуды.
- clkout_ctl — управление выходом 480MHz.
- port_cfgs — настройки регистров портов.
- chg_det — регистры определения зарядки.

<!-- en PDF p.46; unit 228 -->

4. Три работы обслуживают автоматы PHY:

- rockchip_chg_detect_work — определение зарядки OTG Device.
- rockchip_usb2phy_otg_sm_work — состояние OTG и вход/выход suspend.
- rockchip_usb2phy_sm_work — состояние Host и вход/выход suspend.

Ключевые места содержат dev_dbg для наблюдения переходов при подключении/отключении.

<!-- en PDF p.46; unit 229 -->

5. Пример RK3399. Заголовок исходника называет USB 3.0 PHY, но здесь описаны два независимых USB 2.0 PHY, каждый с OTG и Host. OTG совместно с Type-C USB 3.0 PHY обслуживает полноценный Type-C; Host — контроллер USB 2.0. Далее rk3399_phy_cfgs. port_cfgs управляет suspend, VBUS, ID, состояниями DP/DM и др.; смысл полей см. в комментариях драйвера.

<!-- en PDF p.46; unit 230 -->

```text
static const struct rockchip_usb2phy_cfg rk3399_phy_cfgs[] = {
        {
                .reg            = 0xe450,
                .num_ports      = 2,
                .phy_tuning     = rk3399_usb2phy_tuning,
                .clkout_ctl     = { 0xe450, 4, 4, 1, 0 },
                .port_cfgs      = {
                        [USB2PHY_PORT_OTG] = {
                                .phy_sus = { 0xe454, 8, 0, 0x052, 0x1d1 },
                                .bvalid_det_en  = { 0xe3c0, 3, 3, 0, 1 },
                                .bvalid_det_st  = { 0xe3e0, 3, 3, 0, 1 },
                                .bvalid_det_clr = { 0xe3d0, 3, 3, 0, 1 },
                                .bypass_dm_en   = { 0xe450, 2, 2, 0, 1 },
                                .bypass_sel     = { 0xe450, 3, 3, 0, 1 },
                                .idfall_det_en  = { 0xe3c0, 5, 5, 0, 1 },
                                .idfall_det_st  = { 0xe3e0, 5, 5, 0, 1 },
                                .idfall_det_clr = { 0xe3d0, 5, 5, 0, 1 },
                                .idrise_det_en  = { 0xe3c0, 4, 4, 0, 1 },
                                .idrise_det_st  = { 0xe3e0, 4, 4, 0, 1 },
                                .idrise_det_clr = { 0xe3d0, 4, 4, 0, 1 },
                                .ls_det_en      = { 0xe3c0, 2, 2, 0, 1 },
                                .ls_det_st      = { 0xe3e0, 2, 2, 0, 1 },
                                .ls_det_clr     = { 0xe3d0, 2, 2, 0, 1 },
                                .utmi_avalid    = { 0xe2ac, 7, 7, 0, 1 },
                                .utmi_bvalid    = { 0xe2ac, 12, 12, 0, 1 },
                                .utmi_iddig     = { 0xe2ac, 8, 8, 0, 1 },
                                .utmi_ls        = { 0xe2ac, 14, 13, 0, 1 },
                                .vbus_det_en    = { 0x449c, 15, 15, 1, 0 },
                },
                [USB2PHY_PORT_HOST] = {
                        .phy_sus        = { 0xe458, 1, 0, 0x2, 0x1 },
                        .ls_det_en      = { 0xe3c0, 6, 6, 0, 1 },
                        .ls_det_st      = { 0xe3e0, 6, 6, 0, 1 },
                        .ls_det_clr     = { 0xe3d0, 6, 6, 0, 1 },
                        .utmi_ls        = { 0xe2ac, 22, 21, 0, 1 },
                        .utmi_hstdet    = { 0xe2ac, 23, 23, 0, 1 }
                }
        },
        .chg_det = {
                .opmode         = { 0xe454, 3, 0, 5, 1 },
                .cp_det         = { 0xe2ac, 2, 2, 0, 1 },
                .dcp_det        = { 0xe2ac, 1, 1, 0, 1 },
                .dp_det         = { 0xe2ac, 0, 0, 0, 1 },
                .idm_sink_en    = { 0xe450, 8, 8, 0, 1 },
                .idp_sink_en    = { 0xe450, 7, 7, 0, 1 },
                .idp_src_en     = { 0xe450, 9, 9, 0, 1 },
                .rdm_pdwn_en    = { 0xe450, 10, 10, 0, 1 },
                .vdm_src_en     = { 0xe450, 12, 12, 0, 1 },
                .vdp_src_en     = { 0xe450, 11, 11, 0, 1 },
        },
},
{
        .reg            = 0xe460,
        .num_ports      = 2,
        .phy_tuning     = rk3399_usb2phy_tuning,
        .clkout_ctl     = { 0xe460, 4, 4, 1, 0 },
        .port_cfgs      = {
                [USB2PHY_PORT_OTG] = {
                        .phy_sus = { 0xe464, 8, 0, 0x052, 0x1d1 },
                        .bvalid_det_en  = { 0xe3c0, 8, 8, 0, 1 },
                        .bvalid_det_st  = { 0xe3e0, 8, 8, 0, 1 },
                        .bvalid_det_clr = { 0xe3d0, 8, 8, 0, 1 },
                        .idfall_det_en  = { 0xe3c0, 10, 10, 0, 1 },
                        .idfall_det_st  = { 0xe3e0, 10, 10, 0, 1 },
                        .idfall_det_clr = { 0xe3d0, 10, 10, 0, 1 },
                        .idrise_det_en  = { 0xe3c0, 9, 9, 0, 1 },
                        .idrise_det_st  = { 0xe3e0, 9, 9, 0, 1 },
                        .idrise_det_clr = { 0xe3d0, 9, 9, 0, 1 },
                        .ls_det_en      = { 0xe3c0, 7, 7, 0, 1 },
                        .ls_det_st      = { 0xe3e0, 7, 7, 0, 1 },
                        .ls_det_clr     = { 0xe3d0, 7, 7, 0, 1 },
                        .utmi_avalid    = { 0xe2ac, 10, 10, 0, 1 },
                        .utmi_bvalid    = { 0xe2ac, 16, 16, 0, 1 },
                        .utmi_iddig     = { 0xe2ac, 11, 11, 0, 1 },
                        .utmi_ls        = { 0xe2ac, 18, 17, 0, 1 },
                        .vbus_det_en    = { 0x451c, 15, 15, 1, 0 },
                },
                [USB2PHY_PORT_HOST] = {
                        .phy_sus        = { 0xe468, 1, 0, 0x2, 0x1 },
                        .ls_det_en      = { 0xe3c0, 11, 11, 0, 1 },
                        .ls_det_st      = { 0xe3e0, 11, 11, 0, 1 },
                                .ls_det_clr     = { 0xe3d0, 11, 11, 0, 1 },
                                .utmi_ls        = { 0xe2ac, 26, 25, 0, 1 },
                                .utmi_hstdet    = { 0xe2ac, 27, 27, 0, 1 }
                        }
                },
                .chg_det = {
                        .opmode         = { 0xe464, 3, 0, 5, 1 },
                        .cp_det         = { 0xe2ac, 5, 5, 0, 1 },
                        .dcp_det        = { 0xe2ac, 4, 4, 0, 1 },
                        .dp_det         = { 0xe2ac, 3, 3, 0, 1 },
                        .idm_sink_en    = { 0xe460, 8, 8, 0, 1 },
                        .idp_sink_en    = { 0xe460, 7, 7, 0, 1 },
                        .idp_src_en     = { 0xe460, 9, 9, 0, 1 },
                        .rdm_pdwn_en    = { 0xe460, 10, 10, 0, 1 },
                        .vdm_src_en     = { 0xe460, 12, 12, 0, 1 },
                        .vdp_src_en     = { 0xe460, 11, 11, 0, 1 },
                },
        },
        { /* sentinel */ }
};
```

<!-- en PDF p.48; unit 233 -->

6. Отладочный интерфейс USB 2.0 PHY

<!-- en PDF p.48; unit 234 -->

```text
/sys/devices/platform/[u2phy dev name] # ls
driver          extcon   of_node  phy   subsystem
driver_override modalias otg_mode power uevent
```

<!-- en PDF p.48; unit 235 -->

otg_mode программно переключает Device/Host независимо от OTG ID. Принудительные режимы:

```sh
echo host > /sys/devices/platform/[u2phy dev name]/otg_mode
echo peripheral > /sys/devices/platform/[u2phy dev name]/otg_mode
echo otg > /sys/devices/platform/[u2phy dev name]/otg_mode
```

Совместимые команды Linux-3.10 и старше: 1 — Host, 2 — Device, 0 — OTG:

```sh
echo 1 > /sys/devices/platform/[u2phy dev name]/otg_mode
echo 2 > /sys/devices/platform/[u2phy dev name]/otg_mode
echo 0 > /sys/devices/platform/[u2phy dev name]/otg_mode
```

<!-- en PDF p.49; unit 236 -->

Примечания:

<!-- en PDF p.49; unit 237 -->

1. Замените [u2phy dev name] именем PHY соответствующего SoC.

<!-- en PDF p.49; unit 238 -->

2. RV1126/RV1109 требуют дополнительных действий. Host — отключить Device, затем переключить PHY:

```sh
echo disconnect > /sys/class/udc/ffd00000.dwc3/soft_connect
echo host > /sys/devices/platform/ff4c0000.usb2-phy/otg_mode
```

Device — переключить PHY, затем подключить Device:

```sh
echo peripheral > /sys/devices/platform/ff4c0000.usb2-phy/otg_mode
echo connect > /sys/class/udc/ffd00000.dwc3/soft_connect
```

OTG — переключить PHY и подключить Device:

```sh
echo otg > /sys/devices/platform/ff4c0000.usb2-phy/otg_mode
echo connect > /sys/class/udc/ffd00000.dwc3/soft_connect
```

<!-- en PDF p.49; unit 239 -->

#### 5.2.2 Драйверы USB 3.0 PHY

<!-- en PDF p.49; unit 240 -->

Rockchip использует Type-C PHY, Innosilicon USB 3.0 PHY и Innosilicon USB 3.0 CombPhy с разной аппаратной реализацией и отдельными драйверами. Все три поддерживают только SuperSpeed; для полного USB 3.0, включая High/Full/Low Speed, нужен также USB 2.0 PHY.

<!-- en PDF p.49; unit 241 -->

1. Type-C PHY: `drivers/phy/rockchip/phy-rockchip-typec.c`. Пример RK3399 объединяет USB 3.0 SuperSpeed и DisplayPort Transmit PHY. В probe отдельно создаются rockchip_dp_phy_ops для dp-port и rockchip_usb3_phy_ops для usb3-port; power_on/power_off и прочие операции независимы. Четыре режима:

- Только USB 3.0, например переходник Type-C→Type-A USB 3.0.
- Только DP, например DP-кабель.
- USB 3.0 и DP 2 lanes одновременно, например Type-C dongle.

<!-- en PDF p.50; unit 242 -->

- USB 2.0 и DP 4 lanes одновременно, например Type-C VR.

Для определения кабеля нужен CC-чип, рекомендуется FUSB302. Он уведомляет Type-C PHY через extcon.

- rockchip_usb3_phy_power_on/power_off включают и выключают USB 3.0 PHY по запросу контроллера.
- tcphy_cfg_usb3_to_usb2_only принудительно оставляет только USB 2.0.
- tcphy_cfg_usb3_pll настраивает PLL USB 3.0.

<!-- en PDF p.50; unit 243 -->

2. Innosilicon USB 3.0 PHY: `drivers/phy/rockchip/phy-rockchip-inno-usb3.c`. Пример RK3328 объединяет USB 3.0 PHY и USB 2.0 PHY. Возможности:

- Последовательная передача 5.0Gb/s.
- Параллельный интерфейс 8/16/32-bit для передачи и приёма SuperSpeed.
- Объединение высокоскоростных компонентов в единый функциональный блок.
- Восстановление данных и такта из последовательного потока.
- Регистры хранения для подготовки TX/RX.
- Прямое управление disparity при передаче compliance pattern.
- Кодирование/декодирование 8b/10b и индикация ошибок.
- Отсутствие аппаратного определения отключения периферии.

Особенность драйвера: одновременно реализует операции USB 2.0 и USB 3.0, хотя PHY аппаратно независимы. Их индексы — U3PHY_TYPE_UTMI и U3PHY_TYPE_PIPE соответственно.

<!-- en PDF p.50; unit 244 -->

Функции:

- rockchip_u3phy_port_init(): инициализация портов USB 2.0/3.0.
- rockchip_u3phy_power_on(): включение тактирования, USB 2.0 PHY в Normal и USB 3.0 PHY в P0.
- rockchip_u3phy_power_off(): USB 2.0 PHY в suspend, USB 3.0 PHY в P3, отключение такта для снижения потребления.

<!-- en PDF p.51; unit 245 -->

Для компенсации отсутствия определения отключения USB 3.0 добавлены:

- rockchip_u3phy_on_disconnect(): ядро HUB определяет отключение по linkstate и вызывает зарегистрированный PHY notifier для программного отключения.
- rockchip_u3phy_on_shutdown(): вызывается DWC3 и сбрасывает USB3 PHY при программном отключении.
- rockchip_u3phy_on_init(): вызывается DWC3 и снимает сброс по завершении.

Принудительный USB 2.0 only:

```sh
echo u2 > /sys/kernel/debug/[phy name]/u3phy_mode
```

USB 3.0/2.0, режим по умолчанию после инициализации:

```sh
echo u3 > /sys/kernel/debug/[phy name]/u3phy_mode
```

Замените [phy name] именем PHY данного SoC.

<!-- en PDF p.51; unit 246 -->

3. Innosilicon USB 3.0 CombPhy: `drivers/phy/rockchip/phy-rockchip-inno-combphy.c`. RK1808 объединяет USB 3.0 SuperSpeed и PCIe PHY, которые не работают одновременно. Зарегистрированная rockchip_combphy_xlate() позволяет драйверу USB 3.0 или PCIe выбрать требуемый тип. Для USB 3.0 задайте phys контроллера:

<!-- en PDF p.51; unit 247 -->

```text
phys = <&u2phy_otg>, <&combphy PHY_TYPE_USB3>;
phy-names = "usb2-phy", "usb3-phy";
```

<!-- en PDF p.51; unit 248 -->

Для PCIe задайте phys контроллера:

<!-- en PDF p.51; unit 249 -->

```text
phys = <&combphy PHY_TYPE_PCIE>;
phy-names = "pcie-phy";
```

<!-- en PDF p.51; unit 250 -->

USB 3.0 PHY поддерживает только SuperSpeed и совместно с OTG-портом USB 2.0 PHY обеспечивает USB 3.0/2.0/1.1/1.0. Возможности CombPhy:

<!-- en PDF p.52; unit 251 -->

- Передача 5.0Gb/s.
- Параллельный интерфейс 8/16/32-bit для TX/RX SuperSpeed.
- Объединение высокоскоростных компонентов в функциональный блок.
- Восстановление данных и такта из последовательного потока.
- Регистры подготовки TX/RX.
- Прямое управление disparity для compliance pattern.
- Кодирование/декодирование 8b/10b и индикация ошибок.

Общие phy_ops USB 3.0/PCIe:

- rockchip_combphy_init: подготовить опорный такт, выбрать тип и инициализировать регистры.
- rockchip_combphy_exit: снять подготовку такта.
- rockchip_combphy_power_on/power_off: включить/выключить блок USB 3.0 PHY для экономии питания.

Другие функции:

- rk1808_combphy_low_power_control: низкое потребление при deepsleep.
- u3phy_mode_store/u3phy_mode_show: принудительный USB 2.0 через sysfs u3phy_mode. При динамическом переключении USB 2.0 only↔USB 2.0/3.0 требуется переинициализация xHCI; sysfs otg_mode удаляет/добавляет xHCI HCD.

<!-- en PDF p.52; unit 252 -->

```text
#1. Default is USB 3.0 OTG mode, config to USB 2.0 only mode
   echo u2 > /sys/devices/platform/[u3phy dev name]/u3phy_mode
   echo host > /sys/devices/platform/[u2phy dev name]/otg_mode

#2. Default is USB 3.0 Host mode, config to USB 2.0 only mode
   echo otg > /sys/devices/platform/[u2phy dev name]/otg_mode
   echo u2 > /sys/devices/platform/[u3phy dev name]/u3phy_mode
   echo host > /sys/devices/platform/[u2phy dev name]/otg_mode

#3. Default is USB 2.0 only Host mode, config to USB 3.0 mode
   echo otg > /sys/devices/platform/[u2phy dev name]/otg_mode
   echo u3 > /sys/devices/platform/[u3phy dev name]/u3phy_mode
   echo host > /sys/devices/platform/[u2phy dev name]/otg_mode
```

<!-- en PDF p.52; unit 253 -->

Замените [u3phy dev name] и [u2phy dev name] именами PHY чипа. Режим USB по умолчанию определяется dr_mode в DTS DWC3.

<!-- en PDF p.53; unit 254 -->

### 5.3 Драйверы контроллеров USB

<!-- en PDF p.53; unit 255 -->

#### 5.3.1 Драйвер USB 2.0 OTG

<!-- en PDF p.53; unit 256 -->

5.3.1.1 Архитектура USB 2.0 OTG

<!-- en PDF p.53; unit 257 -->

USB 2.0 OTG использует DWC2 (рисунок 5-2). Интерфейсы AHB master/slave нужны для внутреннего DMA, передающего данные между FIFO и памятью по AHB. Зелёные блоки — опциональные возможности IP; DWC2 Rockchip не поддерживает внешний DMA и endp_multi_proc_interrupt. Связь с PHY — UTMI+.

<!-- en PDF p.53; unit 258 -->

![Технический рисунок английского оригинала, PDF p.53](/docs/rockchip-linux-usb/assets/en-p053-figure-01.png)

<!-- en PDF p.53; unit 259 -->

Рисунок 5-2. Системная схема DWC2. На рисунке 5-3 показана иерархия прерываний: Device, Host и OTG, каждое со своими подпрерываниями. Все объединяются в общий сигнал к контроллеру прерываний чипа.

<!-- en PDF p.54; unit 260 -->

![Технический рисунок английского оригинала, PDF p.54](/docs/rockchip-linux-usb/assets/en-p054-figure-01.png)

<!-- en PDF p.54; unit 261 -->

Рисунок 5-3. Иерархия прерываний DWC2.

<!-- en PDF p.54; unit 262 -->

5.3.1.2 Обзор драйвера USB 2.0 OTG

<!-- en PDF p.54; unit 263 -->

1. Драйверы DWC2:

- `drivers/usb/dwc2/*`: большинство SoC.
- `drivers/usb/dwc_otg_310/*`: устаревший вариант только RK3288/RK3368.

<!-- en PDF p.54; unit 264 -->

2. Linux-4.19 и новее используют dwc2 для всех SoC вместо dwc_otg_310, поэтому далее рассматривается dwc2.

<!-- en PDF p.55; unit 265 -->

USB OTG 2.0 — Dual-Role Device с Host/Device, соответствующий OTG Supplement to USB2.0, с передачей High Speed 480Mbps, Full Speed 12Mbps и Low Speed 1.5Mbps. Структура кода dwc2:

<!-- en PDF p.55; unit 266 -->

```text
~/src/android_Q/kernel/drivers/usb/dwc2$ tree .
├── core.c (dwc2 core reset, configure core param and other general operations)
├── core.h
├── core_intr.c (dwc2 general interrupt events, including otg intr, id intr, wakeup intr,
etc.)
├── debugfs.c (dwc2 debug interface, such as printing register information)
├── debug.h
├── gadget.c (all tasks related to dwc2 gadget mode, such as gadget initialization, gadget
interrupt event)
├── hcd.c (dwc2 host mode related tasks and core init, phy init, device/host mode switching)
├── hcd_ddma.c (dwc2 descriptor DMA related tasks)
├── hcd.h
├── hcd_intr.c (handling of all interrupt events in dwc2 host mode)
├── hcd_queue.c (dwc2 host mode transmission queue processing)
├── hw.h
├── Kconfig
├── Makefile
├── pci.c (initialization of pci bus interface, Rockchip dwc2 uses AHB bus)
└── platform.c (implement dwc2 probe, initialize dwc2 lowlevel hw resources according to
core_params configuration of different chips)
```

<!-- en PDF p.55; unit 267 -->

5.3.1.3 Отладка USB 2.0 OTG

<!-- en PDF p.55; unit 268 -->

Интерфейс DWC2, пример RK3328:

<!-- en PDF p.55; unit 269 -->

```text
rk3328_box:/sys/kernel/debug/ff580000.usb # ls
ep0   ep2out ep4out ep6out ep8in  ep9in  fifo    state
ep1in ep3in  ep5in  ep7in  ep8out ep9out regdump testmode
```

<!-- en PDF p.55; unit 270 -->

- ep*in/out: состояние каждой доступной конечной точки.
- fifo: общий FIFO и периодические TX FIFO.
- state: общее состояние оборудования и точек.
- regdump: регистры ядра.
- testmode: текущий тестовый режим USB.

Интерфейс DWC_OTG_310, пример RK3288:

<!-- en PDF p.56; unit 271 -->

```text
rk3288:/sys/devices/platform/ff580000.usb # ls
busconnected  fr_interval gsnpsid   modalias       regoffset     uevent
buspower      gadget      guid      mode           regvalue      usb5
bussuspend    ggpio       gusbcfg   mode_ch_tim_en remote_wakeup wr_reg_test
devspeed      gnptxfsiz   hcd_frrem pools          spramdump
disconnect_us gotgctl     hcddump   power          subsystem
driver        gpvndctl    hprt0     rd_reg_test    test_sq
enumspeed     grxfsiz     hptxfsiz  regdump        udc

rk3328_box:/sys/devices/platform/ff580000.usb/driver # ls
bind       dwc_otg_conn_en force_usb_mode uevent vbus_status
debuglevel ff580000.usb    op_state       unbind versio
```

<!-- en PDF p.56; unit 272 -->

- busconnected: чтение/запись Core Control Status Register.
- fr_interval: чтение HFIR Frame Interval; запись перезагружает HFIR во время работы только после установки HPRT.PrtEnaPort.
- gsnpsid: Synopsys ID Register.
- regoffset: смещение следующего доступа к регистру.
- buspower: питание шины, 0 выключено, 1 включено.
- guid: User ID Register.
- regvalue: значение регистра по regoffset.
- bussuspend: приостановка шины USB.
- ggpio: чтение младших 16 бит либо запись старших 16 бит General Purpose IO Register.
- gusbcfg: Core USB Configuration Register.
- mode_ch_tim_en: ожидание 200 тактов PHY после Resume перед opmode=00 после Suspend/LPM.
- remote_wakeup: чтение состояния; запись инициирует пробуждение Host. Если bit 0=1 и функция разрешена, сигнал Remote Wakeup в Device Control Register устанавливается на 1ms.
- wr_reg_test: время многократной записи GNPTXFSIZ; вывод включает число записей.
- devspeed: скорость Device в DCFG.
- gnptxfsiz: Non-periodic Transmit Size Register.
- spramdump: содержимое регистров ядра.
- disconnect_us: чтение disconnect_device_us; запись запускает программное отключение на 100us, только Device.
- gotgctl: Core Control Status Register.
- hcddump: текущее состояние HCD.

<!-- en PDF p.57; unit 273 -->

- gpvndctl: PHY Vendor Control Register.
- hprt0: Host Port Control and Status Register.
- rd_reg_test: время многократного чтения GNPTXFSIZ и число чтений.
- test_sq: использование атрибута test_sq.
- enumspeed: скорость перечисления Device.
- grxfsiz: Receive FIFO Size Register.
- hptxfsiz: Host Periodic Transmit FIFO.
- regdump: регистры ядра.
- dwc_otg_conn_en: включение/отключение соединения с ПК в Device.
- force_usb_mode: 0 Normal, 1 Host, 2 Device.
- vbus_status: напряжение VBUS.
- debuglevel: уровень отладки.
- op_state: программное состояние; при a_host→a_peripherial и b_device→b_host может не совпадать с ядром, позволяя отслеживать переход.
- version: версия драйвера.

<!-- en PDF p.57; unit 274 -->

#### 5.3.2 Драйвер USB 2.0 Host

<!-- en PDF p.57; unit 275 -->

5.3.2.1 Архитектура USB 2.0 Host

<!-- en PDF p.57; unit 276 -->

Контроллер объединяет EHCI USB 2.0 и OHCI USB 1.1. Зелёные блоки рисунка 5-4 — опциональные функции IP. Rockchip использует по одному EHCI/OHCI, связанному с PHY через UTMI+. Оба обращаются к памяти внутренним DMA по AHB. EHCI обслуживает High Speed, OHCI — Full/Low Speed.

<!-- en PDF p.58; unit 277 -->

![Технический рисунок английского оригинала, PDF p.58](/docs/rockchip-linux-usb/assets/en-p058-figure-01.png)

<!-- en PDF p.58; unit 278 -->

Рисунок 5-4. Системная схема EHCI/OHCI.

<!-- en PDF p.58; unit 279 -->

5.3.2.2 Обзор драйвера USB 2.0 Host

<!-- en PDF p.58; unit 280 -->

1. Код:

`drivers/usb/host/ehci*` — USB 2.0 Host.

`drivers/usb/host/ohci*` — USB 1.1/1.0 Host.

<!-- en PDF p.58; unit 281 -->

2. Структура EHCI приведена ниже. Неуказанные файлы, например ehci-exynos.c, реализуют платформы других производителей. Rockchip соответствует стандарту EHCI и использует общий ehci-platform.c.

<!-- en PDF p.59; unit 282 -->

```text
~/src/android_Q/kernel/drivers/usb/host$ tree
├── ehci-dbg.c (ehci debugfs debugging interface, such as printing ehci register
information)
├── ehci.h
├── ehci-hcd.c (Initialization of ehci controller, interrupt event processing, urb queue
management, etc.)
├── ehci-hub.c (control and status query of ehci root hub, bus suspend/resume)
├── ehci-mem.c (allocation and initialization of ehci mem, allocation and initialization of
qtd/qh resources)
├── ehci-pci.c (Initialization of pci bus interface, Rockchip ehci uses AHB bus, does not
use this driver)
├── ehci-platform.c (ehci universal platform driver, implement ehci probe, register ehci hcd
with usb bus, enable ehci controller)
├── ehci-q.c (processing of ehci qtd/qh transmission queue)
├── ehci-sched.c (cyclic transmission scheduling processing of ehci interrupt, iso, split
iso)
├── ehci-sysfs.c (ehci sysfs debugging interface, display companion controller, display
uframe_periodic_max)
├── ehci-timer.c (task processing related to ehci timer)
```

<!-- en PDF p.59; unit 283 -->

Важные структуры EHCI:

<!-- en PDF p.59; unit 284 -->

```text
static const struct hc_driver ehci_hc_driver = {
    .description =      hcd_name,
    .product_desc =     "EHCI Host Controller",
    .hcd_priv_size =    sizeof(struct ehci_hcd),
    /*
     * generic hardware linkage
     */
    .irq =          ehci_irq,
    .flags =        HCD_MEMORY | HCD_USB2 | HCD_BH,
    /*
     * basic lifecycle operations
     */
    .reset =        ehci_setup,
    .start =        ehci_run,
    .stop =         ehci_stop,
    .shutdown =     ehci_shutdown,
    /*
     * managing i/o requests and associated device resources
     */
    .urb_enqueue =      ehci_urb_enqueue,
    .urb_dequeue =      ehci_urb_dequeue,
    .endpoint_disable = ehci_endpoint_disable,
    .endpoint_reset =   ehci_endpoint_reset,
    .clear_tt_buffer_complete = ehci_clear_tt_buffer_complete,
    /*
     * scheduling support
     */
    .get_frame_number = ehci_get_frame,
    /*
     * root hub support
     */
    .hub_status_data =  ehci_hub_status_data,
    .hub_control =      ehci_hub_control,
    .bus_suspend =      ehci_bus_suspend,
    .bus_resume =       ehci_bus_resume,
    .relinquish_port =  ehci_relinquish_port,
    .port_handed_over = ehci_port_handed_over,
    /*
     * device support
     */
    .free_dev =     ehci_remove_device,
};
```

<!-- en PDF p.60; unit 286 -->

Далее структура OHCI. Неуказанные файлы, например ohci-exynos.c, относятся к платформам производителей. Rockchip соответствует стандарту OHCI и использует общий ohci-platform.c.

<!-- en PDF p.60; unit 287 -->

```text
~/src/android_Q/kernel/drivers/usb/host$ tree
├── ohci-dbg.c (ohci debugfs debugging interface, such as printing ohci register
information)
├── ohci.h
├── ohci-hcd.c (initialization of ohci controller, interrupt event processing, urb queue
management, etc.)
├── ohci-hub.c (control and status query of ohci root hub, bus suspend/resume)
├── ohci-mem.c (allocation and initialization of ohci mem, allocation and initialization of
td/ed resources)
├── ohci-pci.c (Initialization of pci bus interface, Rockchip ohci uses AHB bus, does not
use this driver file)
├── ohci-platform.c (ohci universal platform driver, implement ohci probe, register ohci hcd
with usb bus, enable ohci controller)
├── ohci-q.c (handling of ohci td/ed transmission queue)
```

<!-- en PDF p.60; unit 288 -->

Важные структуры OHCI:

<!-- en PDF p.60; unit 289 -->

```text
static const struct hc_driver ohci_hc_driver = {
    .description =          hcd_name,
    .product_desc =         "OHCI Host Controller",
    .hcd_priv_size =        sizeof(struct ohci_hcd),
    /*
     * generic hardware linkage
    */
    .irq =                  ohci_irq,
    .flags =                HCD_MEMORY | HCD_USB11,
    /*
    * basic lifecycle operations
    */
    .reset =                ohci_setup,
    .start =                ohci_start,
    .stop =                 ohci_stop,
    .shutdown =             ohci_shutdown,
    /*
     * managing i/o requests and associated device resources
    */
    .urb_enqueue =          ohci_urb_enqueue,
    .urb_dequeue =          ohci_urb_dequeue,
    .endpoint_disable =     ohci_endpoint_disable,
    /*
    * scheduling support
    */
    .get_frame_number =     ohci_get_frame,
    /*
    * root hub support
    */
    .hub_status_data =      ohci_hub_status_data,
    .hub_control =          ohci_hub_control,
#ifdef CONFIG_PM
    .bus_suspend =          ohci_bus_suspend,
    .bus_resume =           ohci_bus_resume,
#endif
    .start_port_reset = ohci_start_port_reset,
};
```

<!-- en PDF p.61; unit 291 -->

5.3.2.3 Отладка USB 2.0 Host

<!-- en PDF p.61; unit 292 -->

Пример RK3399 EHCI/OHCI. Для интерфейса EHCI включите CONFIG_DYNAMIC_DEBUG.

<!-- en PDF p.61; unit 293 -->

```text
rk3399_box:/sys/kernel/debug/usb/ehci/fe380000.usb # ls
async bandwidth periodic registers

rk3399:/sys/devices/platform/fe380000.usb # ls
companion driver_override of_node power     uevent              usb5
driver    modalias        pools   subsystem uframe_periodic_max usbmon
```

<!-- en PDF p.61; unit 294 -->

- async: снимок Async Schedule.
- bandwidth: таблица полосы HS.
- periodic: снимок Periodic Schedule.
- registers: Capability Registers, параметры прерываний и Operational Registers.
- companion: сопутствующий контроллер EHCI.
- uframe_periodic_max: максимальная полоса микрокадра периодических передач; по умолчанию 100μs, максимум 125μs.

<!-- en PDF p.62; unit 295 -->

Отладочный интерфейс OHCI требует CONFIG_DYNAMIC_DEBUG.

<!-- en PDF p.62; unit 296 -->

```text
rk3399_box:/sys/kernel/debug/usb/ohci/fe3a0000.usb # ls
async periodic registers
```

<!-- en PDF p.62; unit 297 -->

- async: совместный вывод списков Control и Bulk.
- periodic: снимок периодического расписания и нагрузки.
- registers: сведения драйвера, регистры в порядке спецификации и другие регистры времени кадров.

<!-- en PDF p.62; unit 298 -->

#### 5.3.3 Драйвер USB 3.0 OTG

<!-- en PDF p.62; unit 299 -->

5.3.3.1 Архитектура USB 3.0 OTG

<!-- en PDF p.62; unit 300 -->

USB 3.0 OTG использует DWC3, рисунок 5-5.

<!-- en PDF p.62; unit 301 -->

![Технический рисунок английского оригинала, PDF p.62](/docs/rockchip-linux-usb/assets/en-p062-figure-01.png)

<!-- en PDF p.62; unit 302 -->

Рисунок 5-5. Системная схема DWC3. Synopsys DesignWare Core USB 3.0 включает xHCI Host. Он работает как фиксированный Host/Device, USB 2.0/3.0 OTG A/B по ID USB2 PHY либо DFP/UFP с Data Role Swap Type-C. Передача поддерживает Super/High/Full/Low Speed. Свойства:

- USB 3.0/2.0/1.1/1.0.

<!-- en PDF p.63; unit 303 -->

- Встроенный xHCI Host.
- Только DRD, без полного OTG-протокола.
- Device и Host не работают одновременно.
- Порты Host USB 2.0/3.0 могут независимо работать одновременно.
- Порты Device USB 2.0/3.0 не могут так работать.
- Только DMA, без Slave.
- Требуется SRAM/DRAM.

xHCI — стандартный USB 3.0 Host, аналогичный ПК; поддерживается принудительный USB 2.0 only.

<!-- en PDF p.63; unit 304 -->

5.3.3.2 Обзор драйвера USB 3.0 OTG

<!-- en PDF p.63; unit 305 -->

1. Код:

`drivers/usb/dwc3/*` — общее ядро OTG и Peripheral.

`drivers/usb/host/xhci*` — USB 3.0 Host.

<!-- en PDF p.63; unit 306 -->

2. Linux-4.19 существенно обновляет DWC3 относительно 4.4, сохраняя общую структуру файлов:

- Добавлен drd.c для динамического Dual Role.
- Удалён dwc3-rockchip.c, заменён общим dwc3-of-simple.c.
- Сохранён dwc3-rockchip-inno.c для RK3328/RK3228H.

Структура DWC3/xHCI Linux-4.19:

<!-- en PDF p.63; unit 307 -->

```text
~/src/kernel-4.19/drivers/usb/dwc3$ tree .
├── core.c (implementation of dwc3 core probe, allocate various resources, initialize
controller, PM runtime management)
├── core.h
├── debugfs.c (implementation of dwc3 debugfs debug interface)
├── debug.h
├── drd.c (dwc3 drd/otg mode dynamic switching processing)
├── dwc3-of-simple.c (dwc3 universal platform driver, realize the first level
dwc3_of_simple_probe of dwc3, and call the second level dwc3_probe of dwc3 core through
of_platform_populate)
├── dwc3-pci.c (Initialization of pci bus interface, Rockchip dwc3 uses AXI bus, does not
use this driver file)
├── dwc3-rockchip-inno.c (glue layer for RK3328/RK3228H, increase the realization of
disconnect work)
├── ep0.c (task processing of dwc3 gadget ep0)
├── gadget.c (dwc3 gadget endpoint task processing except ep0, interrupt entry function
implementation)
├── gadget.h
├── host.c (dwc3 host resource allocation, and call xhci_plat_probe of xHCI through
platform_device_add)
├── io.h
├── Kconfig
├── Makefile
├── trace.c (Dwc3 trace implementation, Linux-based trace interface)
├── trace.h
└── ulpi.c (code implementation of ulpi phy interface, Rockchip dwc3 does not use ulpi)

~/src/kernel-4.19/drivers/usb/host$ tree
├── xhci.c (initialize xhci_hc_driver, start xHCI controller, manage urb queue, etc.)
├── xhci-dbg.c (realize debug function for printing log)
├── xhci-dbgcap.c (xHCI hardware module debug capability function is not supported by
Rockchip)
├── xhci-dbgcap.h
├── xhci-debugfs.c (xHCI debugfs debugging interface)
├── xhci-debugfs.h
├── xhci-ext-caps.c (xHCI extended capability function implementation, not supported by
Rockchip)
├── xhci-ext-caps.h
├── xhci.h
├── xhci-hub.c (xHCI root hub control and status query, bus suspend/resume)
├── xhci-mem.c (xHCI mem management, including allocation, initialization, release and other
operations)
├── xhci-pci.c (Initialization of pci bus interface, Rockchip xHCI uses AXI bus, does not
use this driver file)
├── xhci-plat.c (xHCI universal platform driver, implement xhci_plat_probe, Rockchip uses
this driver)
├── xhci-plat.h
├── xhci-ring.c (management of xHCI transfer/command/event ring)
├── xhci-trace.c (xHCI trace implementation, Linux-based trace interface)
└── xhci-trace.h
```

<!-- en PDF p.64; unit 309 -->

Важные структуры Gadget:

<!-- en PDF p.64; unit 310 -->

```text
static const struct usb_gadget_ops dwc3_gadget_ops = {
    .get_frame      = dwc3_gadget_get_frame,
    .wakeup         = dwc3_gadget_wakeup,
    .set_selfpowered    = dwc3_gadget_set_selfpowered,
    .pullup         = dwc3_gadget_pullup,
    .udc_start      = dwc3_gadget_start,
    .udc_stop       = dwc3_gadget_stop,
};
```

<!-- en PDF p.64; unit 311 -->

Важные структуры Host:

<!-- en PDF p.64; unit 312 -->

```text
static const struct hc_driver xhci_hc_driver = {
    .description =      "xhci-hcd",
    .product_desc =     "xHCI Host Controller",
    .hcd_priv_size =    sizeof(struct xhci_hcd *),
    /*
     * generic hardware linkage
     */
    .irq =          xhci_irq,
    .flags =        HCD_MEMORY | HCD_USB3 | HCD_SHARED,
    /*
     * basic lifecycle operations
     */
    .reset =        NULL, /* set in xhci_init_driver() */
    .start =        xhci_run,
    .stop =         xhci_stop,
    .shutdown =     xhci_shutdown,
    /*
     * managing i/o requests and associated device resources
     */
    .urb_enqueue =      xhci_urb_enqueue,
    .urb_dequeue =      xhci_urb_dequeue,
    .alloc_dev =        xhci_alloc_dev,
    .free_dev =     xhci_free_dev,
    .alloc_streams =    xhci_alloc_streams,
    .free_streams =     xhci_free_streams,
    .add_endpoint =     xhci_add_endpoint,
    .drop_endpoint =    xhci_drop_endpoint,
    .endpoint_reset =   xhci_endpoint_reset,
    .check_bandwidth =  xhci_check_bandwidth,
    .reset_bandwidth =  xhci_reset_bandwidth,
    .address_device =   xhci_address_device,
    .enable_device =    xhci_enable_device,
    .update_hub_device =    xhci_update_hub_device,
    .reset_device =     xhci_discover_or_reset_device,
    /*
     * scheduling support
     */
    .get_frame_number = xhci_get_frame,
    /*
     * root hub support
     */
    .hub_control =      xhci_hub_control,
    .hub_status_data =  xhci_hub_status_data,
    .bus_suspend =      xhci_bus_suspend,
    .bus_resume =       xhci_bus_resume,
    /*
     * call back when device connected and addressed
     */
    .update_device =        xhci_update_device,
    .set_usb2_hw_lpm =  xhci_set_usb2_hardware_lpm,
    .enable_usb3_lpm_timeout =  xhci_enable_usb3_lpm_timeout,
    .disable_usb3_lpm_timeout = xhci_disable_usb3_lpm_timeout,
    .find_raw_port_number = xhci_find_raw_port_number,
};
```

<!-- en PDF p.66; unit 314 -->

5.3.3.3 Отладка USB 3.0 OTG

<!-- en PDF p.66; unit 315 -->

Пример Linux-4.19 RK3399 USB 3.0 OTG0:

<!-- en PDF p.66; unit 316 -->

```text
console:/sys/kernel/debug/fe800000.dwc3 # ls
ep0in  ep1in  ep2in  ep3in  ep4in  ep5in  ep6out     lsp_dump regdump
ep0out ep1out ep2out ep3out ep4out ep5out link_state mode     testmode

console:/sys/kernel/debug/fe800000.dwc3/ep0in # ls
descriptor_fetch_queue rx_info_queue    trb_ring
event_queue            rx_request_queue tx_fifo_queue
rx_fifo_queue          transfer_type    tx_request_queue

console:/sys/kernel/debug/usb/xhci/xhci-hcd.0.auto # ls
command-ring ports          reg-ext-legsup:00   reg-op
devices      reg-cap        reg-ext-protocol:00 reg-runtime
event-ring   reg-ext-dbc:00 reg-ext-protocol:01
```

<!-- en PDF p.66; unit 317 -->

Отладочные узлы:

- mode: чтение/запись dr_mode.
- testmode: High Speed test для глазковой диаграммы.
- link_state: чтение/запись состояния линии.
- regdump: регистры DWC3.
- ep*in/out: каталог отладки точки.
- descriptor_fetch_queue: свободное место DescFetchQ.
- rx_info_queue: свободное место RXInfoQ.
- trb_ring: пул TRB.
- event_queue: свободное место EventQ.
- rx_request_queue: свободное место RxReqQ.
- tx_fifo_queue: свободное место TxFIFO.
- rx_fifo_queue: свободное место RxFIFO.
- transfer_type: тип передачи точки.
- tx_request_queue: свободное место TxReqQ.
- command-ring: состояние xHCI command ring.
- event-ring: состояние xHCI event ring.
- reg-op: состояние регистров xHCI.

Tracepoint USB 3.0 OTG:

<!-- en PDF p.67; unit 318 -->

`sys/kernel/debug/tracing/events/xhci-hcd`

`sys/kernel/debug/tracing/events/dwc3`

Подробности: `sys/kernel/debug/tracing/README`.

Программное переключение OTG принудительно задаёт Host/Device независимо от схемы USB. Старые команды Linux-4.4 только RK3399:

<!-- en PDF p.67; unit 319 -->

```text
#RK3399 Type-C0 USB OTG switch command
#1.Force host mode
  echo host > sys/kernel/debug/usb@fe800000/rk_usb_force_mode
#2.Force peripheral mode
  echo peripheral > sys/kernel/debug/usb@fe800000/rk_usb_force_mode
```

<!-- en PDF p.67; unit 320 -->

Новые команды Linux-4.4, только RK3399/RK1808:

<!-- en PDF p.67; unit 321 -->

```text
#RK3399 Type-C0 USB OTG switch command
#1.Force host mode
  echo host > sys/devices/platform/usb0/dwc3_mode
#2.Force peripheral mode
  echo peripheral > sys/devices/platform/usb0/dwc3_mode

#RK1808 USB OTG switch command
#1.Force host mode
  echo host > sys/devices/platform/usb/dwc3_mode
#2.Force peripheral mode
  echo peripheral > sys/devices/platform/usb/dwc3_mode
```

<!-- en PDF p.67; unit 322 -->

Команды Linux-4.19 для всех SoC с DWC3:

<!-- en PDF p.67; unit 323 -->

```text
#RK3399 Type-C0 USB OTG switch command
#1.Force host mode
  echo host > sys/devices/platform/ff770000.syscon/ff770000.syscon:usb2-phy@e450/otg_mode
#2.Force peripheral mode
  echo peripheral > sys/devices/platform/ff770000.syscon/ff770000.syscon:usb2-
phy@e450/otg_mode

#For other SoCs, the method is similar, just search for the "otg_mode" node under the
sys/devices/platform path, and then set the node.
```

<!-- en PDF p.68; unit 324 -->

Команды Linux-5.10 для всех SoC с DWC3:

<!-- en PDF p.68; unit 325 -->

```text
#RK3588 Type-C0 USB OTG switch command
#Method1. [Legacy] use usb phy node
#1.Force host mode
  echo host > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-phy@0/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-
phy@0/otg_mode

#Method2.[New] use usb controller node
#1.Force host mode
  echo host > /sys/kernel/debug/usb/fc000000.usb/mode
#2.Force peripheral mode
  echo device > /sys/kernel/debug/usb/fc000000.usb/mode

#For other SoCs, the method is similar, just search for the "otg_mode" or "mode" node under
the sys path, and then set the node.
```

<!-- en PDF p.68; unit 326 -->

### 5.4 Драйвер GPIO и программный поток

<!-- en PDF p.68; unit 327 -->

Linux поддерживает следующие драйверы USB GPIO:

<!-- en PDF p.68; unit 328 -->

1. usb-conn-gpio:

`Documentation/devicetree/bindings/connector/usb-connector.yaml`

`drivers/usb/common/usb-conn-gpio.c`

Обрабатывает VBUS/ID GPIO, задаёт Device/Host через usb_role_switch и уведомляет о роли зарядки SDP.

<!-- en PDF p.68; unit 329 -->

2. extcon-usb-gpio:

`Documentation/devicetree/bindings/extcon/extcon-usb-gpio.txt`

`drivers/extcon/extcon-usb-gpio.c`

Обрабатывает VBUS/ID GPIO и задаёт EXTCON_USB/EXTCON_USB_HOST через extcon.

<!-- en PDF p.68; unit 330 -->

3. `drivers/usb/phy/phy-gpio-vbus-usb.c` управляет VBUS regulator и соединением Gadget по состоянию VBUS через usb_gadget_vbus_connect/usb_gadget_vbus_disconnect. SDK Rockchip использует extcon-usb-gpio.c для связи с PHY/контроллером через extcon, обнаружения Device hotplug и смены OTG-режима.

<!-- en PDF p.69; unit 331 -->

#### 5.4.1 Программный поток VBUSDET GPIO

<!-- en PDF p.69; unit 332 -->

В RK3506G EVB1 транзистор между VBUS разъёма и VBUSDET GPIO инвертирует уровень. Обработка Device hotplug:

<!-- en PDF p.69; unit 333 -->

1. Подключение к ПК: VBUS Low→High → прерывание GPIO → обработчик видит GPIO Low → extcon к USB2 PHY → rockchip_usb2phy_usb_bvalid_enable() устанавливает GRF bvalid High → прерывание фронта bvalid → rockchip_usb2phy_bvalid_irq вызывает otg_sm_work → определение зарядки и resume PHY → подтяжка DP и начало перечисления.

<!-- en PDF p.69; unit 334 -->

2. Отключение: VBUS High→Low → прерывание GPIO → обработчик видит GPIO High → extcon к PHY → rockchip_usb2phy_usb_bvalid_enable() устанавливает bvalid Low, также вызывая Device disconnect DWC2 → otg_sm_work опрашивает GRF bvalid и видит Low → suspend PHY.

<!-- en diagram text units 335–348: transcribed in flow appendix -->

![Исходная схема; редактируемый текст в конце, PDF p.70](/docs/rockchip-linux-usb/assets/en-p070-flow.png)

![Исходная схема; редактируемый текст в конце, PDF p.71](/docs/rockchip-linux-usb/assets/en-p071-flow.png)

<!-- en PDF p.71; unit 349 -->

#### 5.4.2 Программный поток OTG_ID GPIO

<!-- en PDF p.71; unit 350 -->

1. Подключение OTG-кабеля: ID High→Low → прерывание GPIO → обработчик видит Low → extcon к PHY → GRF IDDIG Low → прерывание ID DWC2 → инициализация Host.

<!-- en PDF p.71; unit 351 -->

2. Извлечение: ID Low→High → прерывание GPIO → обработчик видит High → extcon к PHY → GRF IDDIG High → прерывание ID DWC2 → инициализация Device.

<!-- en diagram text units 352–362: transcribed in flow appendix -->

![Исходная схема; редактируемый текст в конце, PDF p.72](/docs/rockchip-linux-usb/assets/en-p072-flow.png)

![Исходная схема; редактируемый текст в конце, PDF p.73](/docs/rockchip-linux-usb/assets/en-p073-flow.png)

<!-- en PDF p.74; unit 363 -->

## 6. Настройка Android USB Gadget

<!-- en PDF p.74; unit 364 -->

### 6.1 USB Gadget Configfs

<!-- en PDF p.74; unit 365 -->

С Linux-3.11 Gadget настраивается через Configfs; android.c удалён из каталога Gadget ядра. Драйверы классов с Configfs перенесены в drivers/usb/gadget/function. Документация:

- `Documentation/ABI/testing/configfs-usb-gadget-xxxx.txt`
- `Documentation/filesystems/configfs/configfs.txt`
- `Documentation/usb/gadget_configfs.txt`
- `Documentation/usb/gadget-testing.txt`
- Kernel USB Gadget Configfs Interface
- TIZEN USB
- https://wiki.linaro.org/LMG/Kernel/AndroidConfigFSGadgets

<!-- en PDF p.74; unit 366 -->

### 6.2 Файлы настройки Gadget

<!-- en PDF p.74; unit 367 -->

USB-скрипты Android:

<!-- en PDF p.74; unit 368 -->

```text
init.usb.rc
init.usb.configfs.rc
init.rk30board.usb.rc
fstab.rk30board.bootmode.emmc
```

<!-- en PDF p.74; unit 369 -->

1. init.usb.rc — стандартный RC Android, менять не нужно.

<!-- en PDF p.74; unit 370 -->

2. fstab.rk30board.bootmode.emmc — пути монтирования SD и USB. Vold Rockchip может автоматически искать и сопоставлять USB-пути по шаблонам.

<!-- en PDF p.74; unit 371 -->

```text
# for USB 2.0
/devices/platform/*.usb*         auto vfat defaults     voldmanaged=usb:auto
# for USB 3.0
/devices/platform/usb@*/*.dwc3*    auto vfat defaults     voldmanaged=usb:auto
```

<!-- en PDF p.75; unit 372 -->

3. init.rk30board.usb.rc и init.usb.configfs.rc задают функции USB.

<!-- en PDF p.75; unit 373 -->

```text
on boot
    mkdir /dev/usb-ffs 0770 shell shell
    mkdir /dev/usb-ffs/adb 0770 shell shell
    mount configfs none /config
    mkdir /config/usb_gadget/g1 0770 shell shell
    write /config/usb_gadget/g1/idVendor 0x2207
    write /config/usb_gadget/g1/bcdDevice 0x0310
    write /config/usb_gadget/g1/bcdUSB 0x0200
    mkdir /config/usb_gadget/g1/strings/0x409 0770
    write /config/usb_gadget/g1/strings/0x409/serialnumber ${ro.serialno}
    write /config/usb_gadget/g1/strings/0x409/manufacturer ${ro.product.manufacturer}
    write /config/usb_gadget/g1/strings/0x409/product ${ro.product.model}
    mkdir /config/usb_gadget/g1/functions/accessory.gs2
    mkdir /config/usb_gadget/g1/functions/audio_source.gs3
    mkdir /config/usb_gadget/g1/functions/ffs.adb
    mkdir /config/usb_gadget/g1/functions/mtp.gs0
    mkdir /config/usb_gadget/g1/functions/ptp.gs1
    mkdir /config/usb_gadget/g1/functions/rndis.gs4
    write /config/usb_gadget/g1/functions/rndis.gs4/wceis 1
    mkdir /config/usb_gadget/g1/functions/midi.gs5
    mkdir /config/usb_gadget/g1/configs/b.1 0770 shell shell
    mkdir /config/usb_gadget/g1/configs/b.1/strings/0x409 0770 shell shell
    write /config/usb_gadget/g1/os_desc/b_vendor_code 0x1
    write /config/usb_gadget/g1/os_desc/qw_sign "MSFT100"
    write /config/usb_gadget/g1/configs/b.1/MaxPower 500
    symlink /config/usb_gadget/g1/configs/b.1 /config/usb_gadget/g1/os_desc/b.1
    mount functionfs adb /dev/usb-ffs/adb uid=2000,gid=2000
    setprop sys.usb.configfs 1
    setprop sys.usb.controller "fe800000.dwc3"

on property:sys.usb.config=none && property:sys.usb.configfs=1
    write /config/usb_gadget/g1/os_desc/use 0
    setprop sys.usb.ffs.ready 0

on property:init.svc.adbd=stopped
    setprop sys.usb.ffs.ready 0

on property:sys.usb.config=mtp && property:sys.usb.configfs=1
    write /config/usb_gadget/g1/functions/mtp.gs0/os_desc/interface.MTP/compatible_id "MTP"
    write /config/usb_gadget/g1/os_desc/use 1
    write /config/usb_gadget/g1/idProduct 0x0001

on property:sys.usb.config=mtp,adb && property:sys.usb.configfs=1
    write /config/usb_gadget/g1/functions/mtp.gs0/os_desc/interface.MTP/compatible_id "MTP"
    write /config/usb_gadget/g1/os_desc/use 1
    write /config/usb_gadget/g1/idProduct 0x0011
```

<!-- en PDF p.76; unit 374 -->

serialnumber, manufacturer и product динамически задаёт прикладной слой Android. Неверный serialnumber может сделать ADB недоступным. setprop sys.usb.controller включает соответствующий Gadget-контроллер. У RK3399 два OTG, оба пригодны для Gadget, но описанная архитектура драйвера поддерживает только один; выберите его по продукту. SDK Android RK3399 по умолчанию использует Type-C0.

<!-- en PDF p.76; unit 375 -->

```text
setprop sys.usb.controller "fe800000.usb"
```

<!-- en PDF p.76; unit 376 -->

Примечание: описанный Kernel Gadget Framework поддерживает одновременно один Gadget, а RK3399 имеет Type-C0/Type-C1. Для замены Type-C0 на Type-C1 измените две настройки:

<!-- en PDF p.76; unit 377 -->

1. В init.rk30board.usb.rc замените fe800000.usb на fe900000.usb.

<!-- en PDF p.76; unit 378 -->

```text
setprop sys.usb.controller "fe900000.usb"
```

<!-- en PDF p.76; unit 379 -->

2. В DTS usbdrd_dwc3_1 задайте dr_mode = "otg".

<!-- en PDF p.76; unit 380 -->

```text
&usbdrd_dwc3_1 {
        status = "okay";
        dr_mode = "otg";  /* Configure Type-C1 USB Controller to OTG mode */
        extcon = <&fusb1>; /* Note: extcon should be configured according to actual
hardware */
};
```

<!-- en PDF p.76; unit 381 -->

### 6.3 Настройка VID/PID

<!-- en PDF p.76; unit 382 -->

Правила источника:

- VID фиксирован как 0x2207, выданный USB-IF.
- PID выбирается под продукт, но старшие 8 бит равны 0 во избежание конфликта с Maskrom/Loader.
- Accessory использует VID/PID Google.
- VID уникален для производителя и не может быть разрешён разным производителям.

Ниже распространённые Android VID/PID.

<!-- en PDF p.77; unit 383 -->

| Функция USB | VID | PID |
| --- | --- | --- |
| MTP | 0x2207 | 0x0001 |
| PTP | 0x2207 | 0x0002 |
| RNDIS | 0x2207 | 0x0003 |
| MIDI | 0x2207 | 0x0004 |
| UVC | 0x2207 | 0x0005 |
| ADB | 0x2207 | 0x0006 |
| MTP,ADB | 0x2207 | 0x0011 |
| PTP,ADB | 0x2207 | 0x0012 |
| RNDIS,ADB | 0x2207 | 0x0013 |
| MIDI,ADB | 0x2207 | 0x0014 |
| UVC,ADB | 0x2207 | 0x0015 |
| ACCESSORY | 0x18d1 | 0x18d1 |
| ACCESSORY,ADB | 0x18d1 | 0x2d01 |

<!-- en PDF p.77; unit 384 -->

### 6.4 Отладка USB Gadget

<!-- en PDF p.77; unit 385 -->

Интерфейс Configfs: ядро предоставляет узлы для просмотра важных настроек Gadget:

<!-- en PDF p.77; unit 386 -->

```text
root@rk3399:/config/usb_gadget/g1 # ls
UDC          bDeviceProtocol bMaxPacketSize0 bcdUSB  functions idVendor strings
bDeviceClass bDeviceSubClass bcdDevice       configs idProduct os_desc
```

<!-- en PDF p.77; unit 387 -->

См. Documentation/usb/gadget_configfs.txt. Для включения Gadget его нужно привязать к UDC (USB Device Controller).

<!-- en PDF p.77; unit 388 -->

```text
echo <udc name> > UDC
#where <udc name> is one of those found in /sys/class/udc/*
```

<!-- en PDF p.77; unit 389 -->

Пример привязки Type-C0 RK3399 к UDC:

<!-- en PDF p.78; unit 390 -->

```text
echo fe800000.dwc3 > config/usb_gadget/g1/UDC
```

<!-- en PDF p.78; unit 391 -->

Отвязка контроллера:

<!-- en PDF p.78; unit 392 -->

```text
echo none > config/usb_gadget/g1/UDC
```

<!-- en PDF p.78; unit 393 -->

Просмотр состояния подключения:

<!-- en PDF p.78; unit 394 -->

```text
rk3399:/sys/class/udc/fe800000.dwc3 # ls
a_alt_hnp_support device          is_selfpowered srp
a_hnp_support     function        maximum_speed  state
b_hnp_enable      is_a_peripheral power          subsystem
current_speed     is_otg          soft_connect   uevent

rk3399:/sys/class/android_usb/android0 # ls
f_audio_source f_midi power state subsystem uevent
```

<!-- en PDF p.79; unit 395 -->

## 7. Методы и команды отладки USB

<!-- en PDF p.79; unit 396 -->

### 7.1 Методы отладки

<!-- en PDF p.79; unit 397 -->

1. Инструменты:

- Мультиметр: VBUS, OTG_ID и питание PHY.
- Широкополосный осциллограф: глазковая диаграмма, зарядка/handshake, провалы VBUS.
- Анализатор протокола USB: анализ обмена и определение стороны сбоя, Host либо Device.
- Windows: BusHound захватывает пакеты, Usbview показывает дескрипторы.
- Linux: usbmon захватывает пакеты, vusb-analyzer графически разбирает их, lsusb показывает дескрипторы.

См. Documentation/usb/usbmon.txt и USB Debugging and Profiling Techniques.

<!-- en PDF p.79; unit 398 -->

2. Интерфейсы:

- `/sys/bus/usb/*`: устройства и драйверы Host.
- `/sys/kernel/debug/usb/devices`: все устройства шины.
- `/sys/kernel/debug/*.dwc3`: DWC3.
- `/sys/kernel/debug/usb/usbmon`: захват USBMon.
- `/sys/kernel/debug/usb/xhci`: xHCI.
- `/sys/kernel/debug/usb/uvcvideo`: UVC.

Интерфейсы контроллеров описаны в разделах отладки USB 2.0 OTG/Host и USB 3.0 OTG. Trace:

- `/sys/kernel/debug/tracing/events/gadget`: взаимодействие Gadget и Device Controller.
- `/sys/kernel/debug/tracing/events/dwc3`: передачи DWC3.
- `/sys/kernel/debug/tracing/events/xhci-hcd`: передачи xHCI.

Логи UVC Host и devio:

```sh
echo 0xffff > /sys/module/uvcvideo/parameters/trace
echo 1 > /sys/module/usbcore/parameters/usbfs_snoop
```

<!-- en PDF p.80; unit 399 -->

### 7.2 Часто используемые команды USB

<!-- en PDF p.80; unit 400 -->

Команды Rockchip:

- USB 2.0 OTG: принудительный Host/Device независимо от ID; см. интерфейс отладки USB 2.0 PHY.
- USB 3.0 OTG: принудительный Host/Device независимо от ID или Type-C; см. интерфейс отладки USB 3.0 OTG.
- USB 3.0→USB 2.0 only: принудительный режим контроллера Host и PHY; см. драйверы USB 3.0 PHY.
- Глазковая диаграмма: перевод USB 2.0/3.0 в test mode; см. Rockchip_Developer_Guide_USB_SQ_Test_CN.

<!-- en PDF p.80; unit 401 -->

### 7.3 Отключение энергосбережения USB

<!-- en PDF p.80; unit 402 -->

SDK Rockchip поддерживает autosuspend: при отсутствии подключения или передачи контроллер и PHY переходят в suspend. Для корректной работы Host и Device должны соблюдать USB autosuspend/resume. Если важнее стабильность и совместимость обмена, можно рассмотреть отключение этого механизма.

<!-- en PDF p.80; unit 403 -->

#### 7.3.1 Отключение autosuspend Host и периферии

<!-- en PDF p.80; unit 404 -->

Область: DWC2/DWC3-xHCI/EHCI/OHCI, все внешние HUB, отдельные камеры. Для быстрой диагностики совместимости динамически отключите autosuspend:

```sh
for i in $(find /sys -name control | grep usb);do echo on > $i;echo "echo on > $i";done;
```

<!-- en PDF p.81; unit 405 -->

Все контроллеры и HUB: следующий способ не отключает autosuspend камер. Способ 1 — usbcore.autosuspend=-1 в CMDLINE. Пример RK3588 Linux-5.10:

<!-- en PDF p.81; unit 406 -->

```text
arch/arm64/boot/dts/rockchip/rk3588-android.dtsi
chosen: chosen {
        bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0
irqchip.gicv3_pseudo_nmi=0 rcupdate.rcu_expedited=1 rcu_nocbs=all
usbcore.autosuspend=-1";
};
```

<!-- en PDF p.81; unit 407 -->

Способ 2 — изменить usb_autosuspend_delay. Пример Linux-5.10:

<!-- en PDF p.81; unit 408 -->

```text
diff --git a/drivers/usb/core/usb.c b/drivers/usb/core/usb.c
index 3500e3c94c4b..3a90d3a92c0a 100644
--- a/drivers/usb/core/usb.c
+++ b/drivers/usb/core/usb.c
@@ -63,7 +63,7 @@ EXPORT_SYMBOL_GPL(usb_disabled);

 #ifdef CONFIG_PM
 /* Default delay value, in seconds */
-static int usb_autosuspend_delay = CONFIG_USB_AUTOSUSPEND_DELAY;
+static int usb_autosuspend_delay = -1;
 module_param_named(autosuspend, usb_autosuspend_delay, int, 0644);
 MODULE_PARM_DESC(autosuspend, "default autosuspend delay");
```

<!-- en PDF p.81; unit 409 -->

Отдельный HUB: добавьте его в hub_id_table[] и задайте id->driver_info = HUB_QUIRK_DISABLE_AUTOSUSPEND. Пример CYPRESS CY7C65632, VID=0x04b4, PID=0x6570:

<!-- en PDF p.81; unit 410 -->

```text
diff --git a/drivers/usb/core/hub.c b/drivers/usb/core/hub.c
index fc7d6cdacf16..df8e69e60aaf 100644
--- a/drivers/usb/core/hub.c
+++ b/drivers/usb/core/hub.c
@@ -41,6 +41,8 @@
 #define USB_VENDOR_GENESYS_LOGIC               0x05e3
 #define USB_VENDOR_SMSC                                0x0424
 #define USB_PRODUCT_USB5534B                   0x5534
+#define USB_VENDOR_CYPRESS                     0x04b4
+#define USB_PRODUCT_CY7C65632                  0x6570
 #define HUB_QUIRK_CHECK_PORT_AUTOSUSPEND       0x01
 #define HUB_QUIRK_DISABLE_AUTOSUSPEND          0x02

@@ -5697,6 +5699,11 @@ static const struct usb_device_id hub_id_table[] = {
       .idProduct = USB_PRODUCT_USB5534B,
       .bInterfaceClass = USB_CLASS_HUB,
       .driver_info = HUB_QUIRK_DISABLE_AUTOSUSPEND},
+    { .match_flags = USB_DEVICE_ID_MATCH_VENDOR
+                   | USB_DEVICE_ID_MATCH_PRODUCT,
+      .idVendor = USB_VENDOR_CYPRESS,
+      .idProduct = USB_PRODUCT_CY7C65632,
+      .driver_info = HUB_QUIRK_DISABLE_AUTOSUSPEND},
```

<!-- en PDF p.82; unit 412 -->

Отдельная камера UVC/UAC: drivers/media/usb/uvc/uvc_driver.c вызывает usb_enable_autosuspend, по умолчанию включая функцию для всех камер. Чтобы отключить её для конкретной камеры, добавьте USB_QUIRK_AUTO_SUSPEND. Примечание источника: новый upstream использует UVC_QUIRK_DISABLE_AUTOSUSPEND. Пример VID=0x05a3, PID=0x9230:

<!-- en PDF p.82; unit 413 -->

```text
diff --git a/drivers/usb/core/quirks.c b/drivers/usb/core/quirks.c
index 76ac5d6555ae..d799e93b9a0d 100644
--- a/drivers/usb/core/quirks.c
+++ b/drivers/usb/core/quirks.c
@@ -322,6 +322,9 @@ static const struct usb_device_id usb_quirk_list[] = {
        /* Alcor Micro Corp. Hub */
        { USB_DEVICE(0x058f, 0x9254), .driver_info = USB_QUIRK_RESET_RESUME },

+       /* HD Camera Manufacturer */
+       { USB_DEVICE(0x05a3, 0x9230), .driver_info = USB_QUIRK_AUTO_SUSPEND },
```

<!-- en PDF p.82; unit 414 -->

#### 7.3.2 Отключение USB2 LPM DWC3 Host

<!-- en PDF p.82; unit 415 -->

Все SoC DWC3, только Host. Добавьте snps,usb2-lpm-disable в узел DWC3 DTSI. Пример RK3568 Linux-5.10:

<!-- en PDF p.82; unit 416 -->

```text
&usbdrd_dwc3 {
        snps,usb2-lpm-disable;
};

&usbhost_dwc3 {
        snps,usb2-lpm-disable;
};
```

<!-- en PDF p.83; unit 417 -->

#### 7.3.3 Отключение USB2 LPM DWC3 Device

<!-- en PDF p.83; unit 418 -->

Все SoC DWC3, только Device. Добавьте snps,usb2-gadget-lpm-disable в узел DWC3 DTSI. Пример RK3568 Linux-5.10:

<!-- en PDF p.83; unit 419 -->

```text
&usbdrd_dwc3 {
        snps,usb2-gadget-lpm-disable;
};
```

<!-- en PDF p.83; unit 420 -->

#### 7.3.4 Отключение suspend PHY USB2/USB3 DWC3

<!-- en PDF p.83; unit 421 -->

Все SoC DWC3, Host и Device. Добавьте snps,dis_u2_susphy_quirk и snps,dis_u3_susphy_quirk в узел DWC3 DTSI. Пример RK3568 Linux-5.10:

<!-- en PDF p.83; unit 422 -->

```text
&usbdrd_dwc3 {
        snps,dis_u2_susphy_quirk;
        snps,dis_u3_susphy_quirk;
};

&usbhost_dwc3 {
        snps,dis_u2_susphy_quirk;
        snps,dis_u3_susphy_quirk;
};
```

<!-- en PDF p.83; unit 423 -->

#### 7.3.5 Отключение зарядки и динамического suspend USB 2.0 PHY

<!-- en PDF p.83; unit 424 -->

Все чипы с drivers/phy/rockchip/phy-rockchip-inno-usb2.c. Пример 1: отключить определение зарядки OTG-порта rk3568 usb2 phy0; также отключается динамический suspend:

<!-- en PDF p.83; unit 425 -->

```text
&u2phy0_otg {
        rockchip,vbus-always-on;
};
```

<!-- en PDF p.83; unit 426 -->

Пример 2: отключить динамический suspend OTG-порта rk3568 usb2 phy0, сохранив определение зарядки.

<!-- en PDF p.84; unit 427 -->

```text
&u2phy0_otg {
        rockchip,dis-u2-susphy;
};
```

<!-- en PDF p.84; unit 428 -->

### 7.4 Quirks периферии USB

<!-- en PDF p.84; unit 429 -->

USB core и драйверы классов позволяют добавлять quirks для совместимости с особыми устройствами: накопителями, HUB, HID, камерами, Audio.

<!-- en PDF p.84; unit 430 -->

#### 7.4.1 Добавление quirks в Linux

<!-- en PDF p.84; unit 431 -->

Два основных способа:

<!-- en PDF p.84; unit 432 -->

1. Изменить таблицу quirks в исходном драйвере, подходит для не-GKI.

<!-- en PDF p.84; unit 433 -->

2. Передать параметры модуля, подходит для GKI и не-GKI.

Способ 1: изменение драйвера.

<!-- en PDF p.84; unit 434 -->

1. Определите VID/PID устройства.

<!-- en PDF p.84; unit 435 -->

2. Найдите таблицу quirks: например drivers/usb/core/quirks.c для общих устройств или drivers/usb/storage/unusual_devs.h для Mass Storage.

<!-- en PDF p.84; unit 436 -->

3. Добавьте запись с VID/PID и нужными флагами. Пример:

<!-- en PDF p.84; unit 437 -->

1. Quirks USB core:

<!-- en PDF p.84; unit 438 -->

```text
include/linux/usb/quirks.h
drivers/usb/core/quirks.c

/* Lists of quirky USB devices */
static const struct usb_device_id usb_quirk_list[] = {
        { USB_DEVICE(0x0204, 0x6025), .driver_info = USB_QUIRK_RESET_RESUME },
        { USB_DEVICE(0x21c4, 0x0cd1), .driver_info = USB_QUIRK_NO_LPM },
};

static const struct usb_device_id usb_interface_quirk_list[] = {
        { USB_VENDOR_AND_INTERFACE_INFO(0x046d, USB_CLASS_VIDEO, 1, 0),
          .driver_info = USB_QUIRK_RESET_RESUME },
};

static const struct usb_device_id usb_endpoint_ignore[] = {
        { USB_DEVICE_INTERFACE_NUMBER(0x06f8, 0xb000, 5), .driver_info = 0x01 },
};
```

<!-- en PDF p.85; unit 440 -->

2. Quirks USB Storage:

<!-- en PDF p.85; unit 441 -->

```text
include/linux/usb_usual.h
drivers/usb/storage/unusual_devs.h   /* Driver for USB Mass Storage compliant devices
*/
drivers/usb/storage/unusual_uas.h    /* Driver for USB Attached SCSI devices - Unusual
Devices File */

/* Example of USB Mass Storage unusual device */
UNUSUAL_DEV(0x0951, 0x1697, 0x0100, 0x0100,
                    "Kingston",
                    "DT Ultimate G3",
                    USB_SC_DEVICE, USB_PR_DEVICE, NULL,
                    US_FL_NO_WP_DETECT)

/* Example of USB Attached SCSI unusual device */
UNUSUAL_DEV(0x0b05, 0x1932, 0x0000, 0x9999,
                    "ASUS",
                    "External HDD",
                    USB_SC_DEVICE, USB_PR_DEVICE, NULL,
                    US_FL_IGNORE_UAS)
```

<!-- en PDF p.85; unit 442 -->

3. Quirks USB HUB:

<!-- en PDF p.85; unit 443 -->

```text
drivers/usb/core/hub.c

/* Example of USB HUB unusual device */
static const struct usb_device_id hub_id_table[] = {
        { .match_flags = USB_DEVICE_ID_MATCH_VENDOR
                       | USB_DEVICE_ID_MATCH_PRODUCT
                       | USB_DEVICE_ID_MATCH_INT_CLASS,
          .idVendor = USB_VENDOR_SMSC,
          .idProduct = USB_PRODUCT_USB5534B,
          .bInterfaceClass = USB_CLASS_HUB,
          .driver_info = HUB_QUIRK_DISABLE_AUTOSUSPEND},
};
```

<!-- en PDF p.85; unit 444 -->

4. Quirks USB HID:

<!-- en PDF p.85; unit 445 -->

```text
include/linux/hid.h
drivers/hid/hid-quirks.c

/* Example of USB HID unusual device */
static const struct hid_device_id hid_quirks[] = {
        { HID_USB_DEVICE(USB_VENDOR_ID_LOGITECH, USB_DEVICE_ID_LOGITECH_C007),
HID_QUIRK_ALWAYS_POLL },
};
```

<!-- en PDF p.85; unit 446 -->

5. Quirks USB Camera:

<!-- en PDF p.86; unit 447 -->

```text
drivers/media/usb/uvc/uvcvideo.h
drivers/media/usb/uvc/uvc_driver.c

/* Example of USB Camera unusual device */
static const struct usb_device_id uvc_ids[] = {
        { .match_flags          = USB_DEVICE_ID_MATCH_DEVICE
                                | USB_DEVICE_ID_MATCH_INT_INFO,
          .idVendor             = 0x05c8,
          .idProduct            = 0x0403,
          .bInterfaceClass      = USB_CLASS_VIDEO,
          .bInterfaceSubClass   = 1,
          .bInterfaceProtocol   = 0,
          .driver_info          = (kernel_ulong_t)&uvc_quirk_fix_bandwidth },
};
```

<!-- en PDF p.86; unit 448 -->

6. Quirks USB Audio:

<!-- en PDF p.86; unit 449 -->

```text
sound/usb/usbaudio.h
sound/usb/quirks.c

/* Example of USB Audio unusual device */
static const struct usb_audio_quirk_flags_table quirk_flags_table[] = {
        DEVICE_FLG(0x046d, 0x084c, /* Logitech ConferenceCam Connect */
                   QUIRK_FLAG_GET_SAMPLE_RATE | QUIRK_FLAG_CTL_MSG_DELAY_1M),
};
```

<!-- en PDF p.86; unit 450 -->

Способ 2: параметры модулей. См. usbcore, usbhid и usb-storage в Documentation/admin-guide/kernel-parameters.txt. Механизм:

<!-- en PDF p.86; unit 451 -->

1. При загрузке quirks_param_ops → quirks_param_set создаёт quirk_list, разбирает quirks из cmdline и добавляет записи.

<!-- en PDF p.86; unit 452 -->

2. При перечислении hub.c выполняет hub_port_init → usb_detect_quirks → usb_detect_dynamic_quirks, ищет VID/PID в quirk_list и передаёт найденные флаги драйверу класса.

Пример 1, GKI: отключить autosuspend; LPM для 325d:6410; reset после сна для 058f:6387; REPORT_OPCODES для 174c:x55aa (исходное написание); UAS для 0bc2:2321; задать MAX_SECTORS_64 и IGNORE_RESIDUE для 05e3:0749. Изменить device/rockchip/common/modules/make_boot.mk:

<!-- en PDF p.87; unit 453 -->

```text
ifeq ($(BOARD_BUILD_GKI),true)
# When GKI enable, pass param to usb through cmdline
# ref:Documentation/admin-guide/kernel-parameters.txt
BOARD_KERNEL_CMDLINE += usbcore.autosuspend=-1
BOARD_KERNEL_CMDLINE += usbcore.quirks=325d:6410:k,058f:6387:e
BOARD_KERNEL_CMDLINE += usb-storage.quirks=174c:x55aa:f,0bc2:2321:u,05e3:0749:mr
endif
```

<!-- en PDF p.87; unit 454 -->

Пример 2, не-GKI: отключить autosuspend на RK3588.

<!-- en PDF p.87; unit 455 -->

```text
arch/arm64/boot/dts/rockchip/rk3588-android.dtsi
chosen: chosen {
        bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0
irqchip.gicv3_pseudo_nmi=0 rcu  usbcore.autosuspend=-1";
};
```

<!-- en PDF p.87; unit 456 -->

#### 7.4.2 Просмотр quirks

<!-- en PDF p.87; unit 457 -->

После загрузки просмотрите quirks через следующие узлы ядра:

<!-- en PDF p.87; unit 458 -->

```text
cat /proc/cmdline
cat /sys/module/usbcore/parameters/quirks
cat /sys/module/usb_storage/parameters/quirks
cat /sys/module/usbhid/parameters/quirks
cat /sys/module/uvcvideo/parameters/quirks
cat /sys/module/snd_usb_audio/parameters/quirk_flags
```

<!-- en PDF p.88; unit 459 -->

## 8. Разбор распространённых проблем USB

<!-- en PDF p.88; unit 460 -->

### 8.1 Логи перечисления устройств

<!-- en PDF p.88; unit 461 -->

#### 8.1.1 Нормальная загрузка USB 2.0 OTG

<!-- en PDF p.88; unit 462 -->

При загрузке без USB-кабеля режим по умолчанию — Device.

<!-- en PDF p.88; unit 463 -->

```text
[    8.764441]otg id chg last id -1 currentid 67108864
[    8.764925] PortPower off
[    8.866923] Using Buffer DMA mode
[    8.867280] Periodic Transfer Interrupt Enhancement- disabled
[    8.867787] Multiprocessor InterruptEnhancement - disabled
[    8.868294] OTG VER PARAM: 0, OTG VER FLAG: 0
[    8.868700] ^^^^^^^^^^^^^^^^^Device Mode
```

<!-- en PDF p.88; unit 464 -->

#### 8.1.2 Нормальное подключение USB 2.0 Device

<!-- en PDF p.88; unit 465 -->

```text
[  133.368479] ***vbusdetect*
[ 133.500590] Using Buffer DMA mode
[  133.500886] Periodic Transfer InterruptEnhancement - disabled
[  133.501391] Multiprocessor InterruptEnhancement - disabled
[  133.501875] OTG VER PARAM: 0, OTG VER FLAG: 0
[  133.502255] ^^^^^^^^^^^^^^^^^Device Mode
[  133.502630] ***************softconnect!!!*******************
[  133.618581] USB RESET
[  133.710877] android_work: sent ueventUSB_STATE=CONNECTED
[  133.714269] USB RESET
[  133.947001] configfs-gadget gadget: high-speed config #1: b
[  133.947649] android_work: sent ueventUSB_STATE=CONFIGURED
[  133.995447] mtp_open
```

<!-- en PDF p.89; unit 466 -->

#### 8.1.3 Отключение USB 2.0 Device

<!-- en PDF p.89; unit 467 -->

```text
[  187.085682] ********session end ,softdisconnect***********
[  187.086486] android_work: sent ueventUSB_STATE=DISCONNECTED
[  187.087217] mtp_release
```

<!-- en PDF p.89; unit 468 -->

#### 8.1.4 Перечисление LS-устройства USB 2.0 Host

<!-- en PDF p.89; unit 469 -->

```text
[  325.412454] usb 2-1: new low-speed USB device number 2 using ohci-platform
[  325.619507] usb 2-1: New USB device found,idVendor=046d, idProduct=c077
[  325.620116] usb 2-1: New USB device strings:Mfr=1, Product=2, SerialNumber=0
[  325.620809] usb 2-1: Product: USB OpticalMouse
[  325.621222] usb 2-1: Manufacturer: Logitech
```

<!-- en PDF p.89; unit 470 -->

#### 8.1.5 Перечисление FS-устройства USB 2.0 Host

<!-- en PDF p.89; unit 471 -->

```text
[  370.896519] usb 2-1: new full-speed USB device number 3 using ohci-platform
[  371.109574] usb 2-1: New USB device found,idVendor=1915, idProduct=0199
[  371.110183] usb 2-1: New USB device strings:Mfr=1, Product=2, SerialNumber=0
[  371.110832] usb 2-1: Product: Memsartcontroller
[  371.111251] usb 2-1: Manufacturer: Memsart
[  371.123172] input: Memsart Memsart controlleras /
```

<!-- en PDF p.89; unit 472 -->

#### 8.1.6 Перечисление HS-устройства USB 2.0 Host

<!-- en PDF p.89; unit 473 -->

```text
[  405.400521] usb 1-1: new high-speed USB device number 5 using ehci-platform
[  405.536569] usb 1-1: New USB device found,idVendor=0951, idProduct=1687
[  405.537178] usb 1-1: New USB device strings:Mfr=1, Product=2, SerialNumber=3
[  405.537815] usb 1-1: Product: DT R400
[  405.538151] usb 1-1: Manufacturer: Kingston
[  405.538533] usb 1-1: SerialNumber:0018F3D97D02BB91517E017D
[  405.541111] usb-storage 1-1:1.0: USB MassStorage device detected
[  405.542472] scsi host1: usb-storage 1-1:1.0
[  406.584573] scsi 1:0:0:0: Direct-AccessKingston DT R400 PMAP PQ: 0 ANSI: 0 CCS
[  406.586425] sd 1:0:0:0: Attached scsi genericsg0 type 0
[  408.171256] sd 1:0:0:0: [sda] 15646720512-byte logical blocks: (8.01 GB/7.46 GiB)
[  408.172788] sd 1:0:0:0: [sda] Write Protectis off
[  408.173970] sd 1:0:0:0: [sda] No Caching modepage found
[  408.174453] sd 1:0:0:0: [sda] Assuming drivecache: write through
[  408.223001] sda: sda1
[  408.229280] sd 1:0:0:0: [sda] Attached SCSIremovable disk
```

<!-- en PDF p.90; unit 475 -->

#### 8.1.7 Отключение LS/FS/HS от USB 2.0 Host

<!-- en PDF p.90; unit 476 -->

```text
[  443.151067] usb 1-1: USB disconnect, devicenumber 3
```

<!-- en PDF p.90; unit 477 -->

#### 8.1.8 Нормальное подключение USB 3.0 Device

<!-- en PDF p.90; unit 478 -->

```text
[   72.310531] android_work: sent ueventUSB_STATE=CONNECTED
[   72.689120] configfs-gadget gadget: super-speed config #1: b
[   72.690110] android_work: sent ueventUSB_STATE=CONFIGURED
[   72.767950] mtp_open
```

<!-- en PDF p.90; unit 479 -->

#### 8.1.9 Перечисление SS-устройства USB 3.0 Host

<!-- en PDF p.90; unit 480 -->

```text
[   26.715320] usb 8-1: new SuperSpeed USB device number 2 using xhci-hcd
[   26.732190] usb 8-1: New USB device found,idVendor=0bc2, idProduct=2320
[   26.732812] usb 8-1: New USB device strings:Mfr=2, Product=3, SerialNumber=1
[   26.733515] usb 8-1: Product: Expansion
[   26.733885] usb 8-1: Manufacturer: Seagate
[   26.734263] usb 8-1: SerialNumber: NA45HT1K
[   26.738410] usb-storage 8-1:1.0: USB MassStorage device detected
[   26.740446] scsi host0: usb-storage 8-1:1.0
[   27.745028] scsi 0:0:0:0: Direct-Access     Seagate Expansion        0608 PQ: 0 ANSI:6
[   27.753066] sd 0:0:0:0: [sda] 1953525167512-byte logical blocks: (1.00 TB/932 GiB)
[   27.754245] sd 0:0:0:0: [sda] Write Protectis off
[   27.754982] sd 0:0:0:0: Attached scsi genericsg0 type 0
[   27.755281] sd 0:0:0:0: [sda] Write cache:enabled, read cache: enabled, doesn't support
DPO or FUA
[   27.783395] sda: sda1
[   27.791561] sd 0:0:0:0: [sda] Attached SCSIdisk
```

<!-- en PDF p.91; unit 481 -->

### 8.2 Распространённые проблемы

<!-- en PDF p.91; unit 482 -->

#### 8.2.1 Аппаратная схема USB

<!-- en PDF p.91; unit 483 -->

1. Мультиметром проверьте питание PHY, VCC5V0_OTG, USB_DET и USB_ID.

<!-- en PDF p.91; unit 484 -->

2. Осциллографом измерьте пульсации питания PHY.

<!-- en PDF p.91; unit 485 -->

3. Осциллографом проверьте глазковую диаграмму USB.

<!-- en PDF p.91; unit 486 -->

#### 8.2.2 Проблемы Device

<!-- en PDF p.91; unit 487 -->

Нормальное подключение Device к ПК проявляется следующим образом:

<!-- en PDF p.91; unit 488 -->

1. Нормальный последовательный лог, см. соответствующий раздел подключения USB 2.0 Device.

<!-- en PDF p.91; unit 489 -->

2. На ПК появляется диск, по умолчанию недоступный; Windows 7/Mac OS могут показывать только устройство в диспетчере.

<!-- en PDF p.91; unit 490 -->

3. В строке состояния Device появляется USB connected.

<!-- en PDF p.91; unit 491 -->

4. Открывается окно подключения, по умолчанию только зарядка. После выбора MTP/PTP ПК получает доступ.

Проблема 1: ПК не реагирует и логов перечисления нет. Проверьте выбор MTP/PTP/ADB; через отладочный интерфейс убедитесь в Device mode; проверьте схему и D+/D-.

Проблема 2: ПК не распознаёт Device, а устройство выводит:

<!-- en PDF p.91; unit 492 -->

```text
[36.682587] DWC_OTG: ********softconnect!!!*****************************************
[36.688603] DWC_OTG: USB SUSPEND
[36.807373] DWC_OTG: USB RESET
```

<!-- en PDF p.91; unit 493 -->

Возможная причина — качество сигнала: проверьте глазковую диаграмму и схему.

Проблема 3: перечисление ядра нормально, но доступа с ПК нет. USB-драйвер исправен; возможна проблема Android USB service, соберите Android-лог.

Проблема 4: после извлечения кабеля интерфейс всё ещё показывает USB Connected, лог:

<!-- en PDF p.91; unit 494 -->

```text
[25.330017] DWC_OTG: USB SUSPEND
```

<!-- en PDF p.91; unit 495 -->

При этом отсутствует следующий лог:

<!-- en PDF p.91; unit 496 -->

```text
[25.514407] DWC_OTG: session end intr, softdisconnect
```

<!-- en PDF p.92; unit 497 -->

Обычно причина — неправильное напряжение USB_DET. После извлечения должно быть 0V. Если остаётся около 3V, отключение не определяется. Проверьте мультиметром.

<!-- en PDF p.92; unit 498 -->

#### 8.2.3 Проблемы Host

<!-- en PDF p.92; unit 499 -->

Проблема 1: при подключении нет перечисления. Проверьте VBUS=5V, наличие Host- и классового драйвера в конфигурации ядра.

Проблема 2: USB-диск не монтируется. Проверьте, определены ли разделы и корректен ли путь в fstab.

Проблема 3: адрес urb transfer_buffer не выровнен:

<!-- en PDF p.92; unit 500 -->

```text
DWC_OTG:dwc_otg_hcd_urb_enqueue urb->transfer_buffer address not align to 4-byte0xd6eab00a
DWC_OTG:dwc_otg_hcd_urb_enqueue urb->transfer_buffer address not align to 4-byte0xccf6140a
```

<!-- en PDF p.92; unit 501 -->

dwc2 требует выравнивания transfer_buffer URB на 4 bytes. Буфер обычно выделяет драйвер класса; исправление следует делать в нём.

<!-- en PDF p.92; unit 502 -->

#### 8.2.4 Проблемы камеры USB

<!-- en PDF p.92; unit 503 -->

1. Камера не включается. Проверьте /dev/video0 или /dev/Video1; при отсутствии узла — конфигурацию ядра. Если узел есть, подключите камеру до загрузки: описанный SDK по умолчанию не поддерживает hotplug камер. Для его добавления обратитесь к разработчику Camera; USB-драйвер менять не нужно.

<!-- en PDF p.92; unit 504 -->

2. Дрожание, отсутствие изображения или аварийный выход приложения могут быть вызваны потерей кадров USB. Проанализируйте реальный обмен анализатором USB.

<!-- en PDF p.92; unit 505 -->

#### 8.2.5 Определение зарядки USB

<!-- en PDF p.92; unit 506 -->

USB 2.0 PHY поддерживает BC1.2: SDP, CDP, стандартный DCP с замкнутыми D+/D- и нестандартный DCP без замыкания. См. drivers/phy/rockchip/phy-rockchip-inno-usb2.c.

SDP — Standard Downstream Port:

<!-- en PDF p.93; unit 507 -->

По USB 2.0 при отсутствии соединения или в suspend средний ток не более 2.5mA; при соединении без suspend — до 100mA (USB 3.0: 150mA); после конфигурации без suspend — до 500mA (USB 3.0: 900mA).

CDP — Charging Downstream Port: совместимый с USB 2.0 порт, оптимизированный для зарядки, до 1.5A.

DCP — Dedicated Charging Port: BC1.2 требует замкнуть D+ и D- в зарядном устройстве для распознавания; обмен данными не поддерживается. Схема определения типа:

<!-- en PDF p.93; unit 508 -->

![Технический рисунок английского оригинала, PDF p.93](/docs/rockchip-linux-usb/assets/en-p093-figure-01.png)

<!-- en PDF p.93; unit 509 -->

Рисунок 8-1. Определение зарядки. Типичные сигналы D+/D- для SDP:

<!-- en PDF p.94; unit 510 -->

![Технический рисунок английского оригинала, PDF p.94](/docs/rockchip-linux-usb/assets/en-p094-figure-01.png)

<!-- en PDF p.94; unit 511 -->

Рисунок 8-2. Сигналы SDP. Типичные сигналы D+/D- для DCP:

<!-- en PDF p.95; unit 512 -->

![Технический рисунок английского оригинала, PDF p.95](/docs/rockchip-linux-usb/assets/en-p095-figure-01.png)

<!-- en PDF p.95; unit 513 -->

Рисунок 8-3. Сигналы DCP. Медленная зарядка может быть следствием ошибочного определения DCP как SDP с ограничением 500mA, например из-за нестабильного кабеля или ошибки драйвера. Проверяйте по шагам:

<!-- en PDF p.95; unit 514 -->

1. Соберите UART-лог подключения к зарядному устройству. Ожидаемый тип — DCP.

<!-- en PDF p.95; unit 515 -->

2. SDP в логе означает ошибку определения. Замените кабель и повторите. Если сохраняется, осциллографом захватите D+/D- при подключении и передайте вместе с ошибочным логом ядра технической поддержке.

<!-- en PDF p.95; unit 516 -->

3. Если зарядное устройство распознано DCP, но зарядка медленная, возможна проблема зарядной микросхемы или батареи.

<!-- en PDF p.95; unit 517 -->

#### 8.2.6 Скорость передачи

<!-- en PDF p.95; unit 518 -->

Основные факторы: качество сигнала USB и частота шины контроллера,

<!-- en PDF p.96; unit 519 -->

частоты CPU/DDR, скорость носителя, файловая система и драйвер класса. См. Rockchip_Developer_Guide_Linux_USB_Performance_Analysis_CN.

<!-- en PDF p.96; unit 520 -->

#### 8.2.7 Скорость перечисленного устройства

<!-- en PDF p.96; unit 521 -->

В логе high-speed означает USB 2.0, super-speed — USB 3.0.

<!-- en PDF p.96; unit 522 -->

#### 8.2.8 USB 3.0 не определяется

<!-- en PDF p.96; unit 523 -->

Если подключение USB 3.0 ничего не вызывает, обычно процесс останавливается на Link Training PHY, то есть проблема связана с сигналом. Захватите Link Training анализатором USB 3.0 и сопоставьте с LTSSM из спецификации.

<!-- en PDF p.96; unit 524 -->

#### 8.2.9 Ошибка копирования USB 3.0

<!-- en PDF p.96; unit 525 -->

Проверьте достаточность тока VBUS; повторите операцию на ПК для сравнения; захватите протокол анализатором USB 3.0; уменьшите размер блока одной передачи; обновите xHCI и включите его debug-лог.

<!-- en PDF p.96; unit 526 -->

#### 8.2.10 Передача камеры USB 3.0

<!-- en PDF p.96; unit 527 -->

Обычно связано с доступом USB к DDR. Предлагаемые источником меры: фиксировать DDR на 800MHz; повысить USB QOS; оптимизировать прерывания UVC, перенеся memcpy в нижнюю половину; выделять URB через kmalloc вместо dma_alloc_coherent; для UVC Gadget Rockchip динамически увеличить TxFIFO.

<!-- en PDF p.97; unit 528 -->

### 8.3 Драйвер USB на ПК

<!-- en PDF p.97; unit 529 -->

При разработке Rockchip часто используются rockusb для загрузки и ADB для отладки.

<!-- en PDF p.97; unit 530 -->

1. Windows требует специального драйвера Rockchip, устанавливаемого инструментом DriverAssitant.

<!-- en PDF p.97; unit 531 -->

2. Ubuntu не требует специального драйвера производителя.

<!-- en PDF p.98; unit 532 -->

## 9. Проверка качества сигнала USB

<!-- en PDF p.98; unit 533 -->

См. Rockchip_Developer_Guide_USB_SQ_Test_CN и Rockchip_Introduction_USB_SQ_Tool_CN. Rockchip USB SQ Tool: https://redmine.rockchip.com.cn/documents/113

## Технические дополнения китайского V2.4.0 и различия источников

В таблице RK3288 EHCI/OHCI указан как 1 в китайском и 0 в английском. Суммарная полоса xHCI — 8Gbps против 8.48Gbps. Китайский текст отсылает за числом Device-точек к TRM, английский приводит 7 IN / 6 OUT / 13 ресурсов. Эти расхождения не разрешены аппаратной проверкой. Китайский §1.6 ограничивает описанный Type-C PHY RK3399/RK3399Pro. Английский §1.3 дополнительно описывает динамическое распределение FIFO по пакетам. Примеры нельзя переносить на все ArmSoM.

### VID/PID и инструменты прошивки

Китайский §6.3 разрешает использовать Rockchip VID 0x2207 только для разработки/отладки. Для сертификации USB-IF продукту требуется собственный уникальный VID через членство USB-IF. Maskrom/Loader Rockusb PID и Google Accessory VID/PID менять нельзя. Для пользовательского PID рекомендуется нулевой старший байт и отсутствие конфликтов с таблицей, иначе прошивальщик Rockchip может неверно распознать устройство; обычно это не влияет на загрузку драйвера ПК и USB-приложения. Английская старая таблица указывает ACCESSORY PID 0x18d1, китайская — 0x2d00. Оба исходных значения показаны. Ниже полная китайская таблица и таблица прошивальщика.

Прошивальщик определяет функцию по VID/PID и может, например, менять режим. Windows config.ini позволяет добавить пользовательские VID/PID; следуйте его описанию.

### Дополнительные интерфейсы отладки, китайский §7.1

Замените [usb controller name] именем Device-контроллера. soft_connect отключает/подключает Gadget; current_speed показывает скорость, state — состояние not attached/configured и др.:

```sh
echo disconnect > /sys/class/udc/[usb controller name]/soft_connect
echo connect > /sys/class/udc/[usb controller name]/soft_connect
cat /sys/class/udc/[usb controller name]/current_speed
cat /sys/class/udc/[usb controller name]/state
```

Каждый usb* в /sys/bus/usb/drivers/usb соответствует Host. bind/unbind переинициализирует его и заново перечисляет периферию. Gadget имеет /sys/bus/platform/drivers/[usb controller name]/bind и unbind; последовательность восстановления RV1126 UVC сохранена в дополнении к коду ниже. Китайская глава даёт USB SQ Tool https://redmine.rockchip.com.cn/documents/109, английская последняя глава — /documents/113; обе ссылки сохранены.

### Дополнительная диагностика, китайский §8.2

Если несколько контроллеров делят порт либо один обслуживает несколько портов, электронный коммутатор переключает сигналы и питание. Управление питанием контроллеров должно быть независимым, соединение после переключения — корректным. Сценарий 1: один порт, USB 2.0 Host для Host и USB 2.0 OTG для Device. В Host сигналы идут к Host, VBUS — от его источника, без нарушения Device VBUS detect. В Device сигналы идут к OTG, VBUS — от ПК. Сценарий 2: один OTG обслуживает отдельные Host/Device-разъёмы. В Host DP/DM идут к Host-разъёму с 5V/500mA; в Device — к Device-разъёму, определяющему только 5V ПК.

Нет Device-лога: проверьте режим, схему и сигналы, затем фронт USB_DET при подключении. Перечисление нормально, но доступа нет: выберите MTP/PTP, соберите logcat и обратитесь к разработчику Android vold/mtpserver. Ошибки копирования: проверьте глазковую диаграмму и USB-трафик; таймауты Flash/SD (источник описывает повторное подключение примерно каждые 10s в Windows XP); ошибки раздела при сбое в одном месте копирования. Источник предлагает `chkdsk E: /f` для раздела E:. Команда меняет файловую систему; сохранена как исходный материал и не выполнялась. Высокий VBUS после отключения также нарушает suspend/wakeup и требует аппаратной проверки.

Рабочий Host даёт 5V и минимум 500mA, затем лог перечисления. Нет лога: коммутация, Host mode, питание. Есть перечисление, нет class-лога: включите драйвер класса. Есть все логи и узлы, но Android не работает: нужна интеграция Android. vold монтирует /dev/block/sda в /udisk для медиатеки/менеджера; HID тоже требует поддержки Android. Проверьте /system/etc/vold.fstab: фактический путь может использовать usb20_OTG или окончание usb1. Исходная dev_mount сохранена ниже. Обратитесь к Android-разработчику. transfer_buffer и аргумент data usb_control_msg должны иметь выравнивание 4 bytes. OTG Host не определяет устройство: проверьте конфигурацию OTG, низкий ID и VBUS 5V, затем соберите логи.

Если камера по-прежнему не работает после проверки конфигурации и подключения до загрузки, передайте логи разработчикам USB/Camera. Hotplug требует изменений Android Camera, не USB-драйвера. При ошибке зарядки китайский текст дополнительно требует мультиметром проверить замыкание D+/D- после замены кабеля. Для RK3399 китайский текст требует DriverAssitant v4.4. Непрошитый чип/режим обновления использует rockusb; работающая система с USB debugging — ADB.

## 10. Материалы по разработке USB

Китайский §10: документация, эталонные схемы и решения проблем расположены в Redmine → проект FAE → Documents: https://redmine.rockchip.com.cn/documents/113. Может потребоваться аккаунт. В английском издании раздел отсутствует.


## Редактируемая распиновка Type-C

| Контакт | Сигнал | Контакт | Сигнал |
| --- | --- | --- | --- |
| A1 | GND | B1 | GND |
| A2 | TX1+ | B2 | TX2+ |
| A3 | TX1− | B3 | TX2− |
| A4 | VBUS | B4 | VBUS |
| A5 | CC1 | B5 | CC2 |
| A6 | D+ | B6 | D+ |
| A7 | D− | B7 | D− |
| A8 | SBU1 | B8 | SBU2 |
| A9 | VBUS | B9 | VBUS |
| A10 | RX2− | B10 | RX1− |
| A11 | RX2+ | B11 | RX1+ |
| A12 | GND | B12 | GND |

## Отличающиеся примеры кода другой версии

Ниже китайские блоки, дословно отличающиеся от английских, включая разбиение страниц и комментарии. Это отдельные исходные примеры, не единый исполняемый сценарий; параметры сохранены для сравнения.

<!-- cn PDF p.25; unit 149 -->

**CN · PDF p.25 · #149**

```text
Device Drivers  --->
    -*- Support for Host-side USB
```

<!-- cn PDF p.26; unit 150 -->

**CN · PDF p.26 · #150**

```text
[*] USB support  --->
    ...
    <*> xHCI HCD (USB 3.0) support
    -*- Generic xHCI driver for a platform device
    ...
    <*> EHCI HCD (USB 2.0) support
    [ ]     Root Hub Transaction Translators
    [*]     Improved Transaction Translator scheduling
    <*> Generic EHCI driver for a platform device
    ...
    <*> OHCI HCD (USB 1.1) support
    < >     OHCI support for PCI-bus USB controllers
    <*>     Generic OHCI driver for a platform device
```

<!-- cn PDF p.26; unit 156 -->

**CN · PDF p.26 · #156**

```text
DeviceDrivers  --->
    [*]USB support  --->
        [*] USB Gadget Support  --->
            ...
```

<!-- cn PDF p.27; unit 157 -->

**CN · PDF p.27 · #157**

```text
USBGadget Drivers (USB functions configurable through configfs)  --->
    [ ]       Generic serial bulk in/out
    [*]       Abstract Control Model (CDC ACM)
    [ ]       Object Exchange Model (CDC OBEX)
    [ ]       Network Control Model (CDC NCM)
    [ ]       Ethernet Control Model (CDC ECM)
    [ ]       Ethernet Control Model (CDC ECM) subset
    [*]       RNDIS
    [ ]       Ethernet Emulation Model (EEM)
    [*]       Mass storage
    [ ]       Loopback and sourcesink function (for testing)
    [*]       Function filesystem (FunctionFS)
    [*]       MTP gadget
    [*]         PTP gadget
    [*]       Accessory gadget
    [*]         Audio Source gadget
    [*]       Uevent notification of Gadget state
    [ ]       Audio Class 1.0
    [ ]       Audio Class 2.0
    [*]       MIDI function
    [ ]       HID function
    [ ]       USB Webcam function
    [ ]       Printer function
```

<!-- cn PDF p.27; unit 162 -->

**CN · PDF p.27 · #162**

```text
Device Drivers --->
    SCSI device support --->
        <*> SCSI device support
        [ ] SCSI: use blk-mq I/O path by default
        [*] legacy /proc/scsi/ support
            *** SCSI support type (disk, tape, CD-ROM) ***
        <*> SCSI disk support
        < > SCSI tape support
        < > SCSI OnStream SC-x0 tape support
        < > SCSI CDROM support
        <*> SCSI generic support
        <*> SCSI media changer support
        [*] Verbose SCSI error reporting (kernel size +=75K)
        [*] SCSI logging facility
```

<!-- cn PDF p.28; unit 163 -->

**CN · PDF p.28 · #163**

```text
[*] Asynchronous SCSI scanning
    SCSI Transports  --->
[*] SCSI low-level drivers  --->
[ ] PCMCIA SCSI adapter support  ----
[ ] SCSI Device Handlers  ----
```

<!-- cn PDF p.28; unit 170 -->

**CN · PDF p.28 · #170**

```text
Device Driver --->
    [*] Network device support  --->
        <*>   PPP (point-to-point protocol) support
            <*>     PPP BSD-Compress compression
            <*>     PPP Deflate compression
            [*]     PPP filtering
            <*>     PPP MPPE compression (encryption)
            [*]     PPP multilink support
            <*>     PPP over Ethernet
            <*>     PPP over L2TP
            <*>     PPP on L2TP Access Concentrator
            <*>     PPP on PPTP Network Server
            <*>     PPP support for async serial ports
            <*>     PPP support for sync tty ports
```

<!-- cn PDF p.30; unit 183 -->

**CN · PDF p.30 · #183**

```text
Device Driver --->
    [*] Network device support  --->
        <*> USB Network Adapters  --->
            <*> USB CATC NetMate-based Ethernet device support
            <*> USB KLSI KL5USB101-based ethernet device support
            <*> USB Pegasus/Pegasus-II based ethernet device support
            <*> USB RTL8150 based ethernet device support
            <*> Realtek RTL8152/RTL8153 Based USB Ethernet Adapters
            < > Microchip LAN78XX Based USB Ethernet Adapters
            <*> Multi-purpose USB Networking Framework
            <*>     ASIX AX88xxx Based USB 2.0 Ethernet Adapters
            <*>     ASIX AX88179/178A USB 3.0/2.0 to Gigabit Ethernet
            -*- CDC Ethernet support (smart devices such as cable modems)
            <*> CDC EEM support
            -*- CDC NCM support
            < > Huawei NCM embedded AT channel support
            <*> CDC MBIM support
            <*> Davicom DM96xx based USB 10/100 ethernet devices
            < > CoreChip-sz SR9700 based USB 1.1 10/100 ethernet devices
            < > CoreChip-sz SR9800 based USB 2.0 10/100 ethernet devices
            <*> SMSC LAN75XX based USB 2.0 gigabit ethernet devices
            <*> SMSC LAN95XX based USB 2.0 10/100 ethernet devices
            <*> GeneSys GL620USB-A based cables
            <*> NetChip 1080 based cables (Laplink, ...)
            <*> Prolific PL-2301/2302/25A1/27A1 based cables
            <*> MosChip MCS7830 based Ethernet adapters
            <*> Host for RNDIS and ActiveSync devices
            <*> Simple USB Network Links (CDC Ethernet subset)
            [*]     ALi M5632 based 'USB 2.0 Data Link' cables
            [*]     AnchorChips 2720 based cables (Xircom PGUNET, ...)
            [*]     eTEK based host-to-host cables (Advance, Belkin, ...)
            [*]     Embedded ARM Linux links (iPaq, ...)
            [*]     Epson 2888 based firmware (DEVELOPMENT)
            [*]     KT Technology KC2190 based cables (InstaNet)
            <*> Sharp Zaurus (stock ROMs) and compatible
            <*> Conexant CX82310 USB ethernet port
            <*> Samsung Kalmia based LTE USB modem
            <*> QMI WWAN driver for Qualcomm MSM based 3G and LTE modems
            <*> Option USB High Speed Mobile Devices
            <*> Intellon PLC based usb adapter
            <*> Apple iPhone USB Ethernet driver
            <*> USB-to-WWAN Driver for Sierra Wireless modems
            < > LG VL600 modem dongle
            < > QingHeng CH9200 USB ethernet support
```

<!-- cn PDF p.31; unit 190 -->

**CN · PDF p.31 · #190**

```text
Device Drivers --->
    [*] USB support --->
        -*- Support for Host-side USB
        ...
        [*]     Disable external hubs
```

<!-- cn PDF p.32; unit 199 -->

**CN · PDF p.32 · #199**

```text
grf: syscon@ff770000 {
    compatible = "rockchip,rk3399-grf", "syscon", "simple-mfd";
    reg = <0x0 0xff770000 0x0 0x10000>;
    #address-cells = <1>;
    #size-cells = <1>;

    u2phy0: usb2-phy@e450 {
        compatible = "rockchip,rk3399-usb2phy";
```

<!-- cn PDF p.33; unit 200 -->

**CN · PDF p.33 · #200**

```text
        reg = <0xe450 0x10>;
        clocks = <&cru SCLK_USB2PHY0_REF>;
        clock-names = "phyclk";
        #clock-cells = <0>;
        clock-output-names = "clk_usbphy0_480m";
        status = "disabled";

        u2phy0_host: host-port {
            #phy-cells = <0>;
            interrupts = <GIC_SPI 27 IRQ_TYPE_LEVEL_HIGH 0>;
            interrupt-names = "linestate";
            status = "disabled";
        };

        u2phy0_otg: otg-port {
            #phy-cells = <0>;
            interrupts = <GIC_SPI 103 IRQ_TYPE_LEVEL_HIGH 0>,
                         <GIC_SPI 104 IRQ_TYPE_LEVEL_HIGH 0>,
                         <GIC_SPI 106 IRQ_TYPE_LEVEL_HIGH 0>;
            interrupt-names = "otg-bvalid", "otg-id",
                              "linestate";
            status = "disabled";
        };
    };
};
```

<!-- cn PDF p.33; unit 202 -->

**CN · PDF p.33 · #202**

```text
vcc5v0_host: vcc5v0-host-regulator {
    compatible = "regulator-fixed";
    enable-active-high;
    gpio = <&gpio4 25 GPIO_ACTIVE_HIGH>;
    pinctrl-names = "default";
    pinctrl-0 = <&host_vbus_drv>;
    regulator-name = "vcc5v0_host";
    regulator-always-on;
};

usb2 {
    host_vbus_drv: host-vbus-drv {
        rockchip,pins =
                <4 25 RK_FUNC_GPIO &pcfg_pull_none>;
    };
};
```

<!-- cn PDF p.34; unit 209 -->

**CN · PDF p.34 · #209**

```text
tcphy0: phy@ff7c0000 {
    compatible = "rockchip,rk3399-typec-phy";
    reg = <0x0 0xff7c0000 0x0 0x40000>;
    rockchip,grf = <&grf>;
    #phy-cells = <1>;
```

<!-- cn PDF p.35; unit 210 -->

**CN · PDF p.35 · #210**

```text
    clocks = <&cru SCLK_UPHY0_TCPDCORE>,
             <&cru SCLK_UPHY0_TCPDPHY_REF>;
    clock-names = "tcpdcore", "tcpdphy-ref";
    assigned-clocks = <&cru SCLK_UPHY0_TCPDCORE>;
    assigned-clock-rates = <50000000>;
    power-domains = <&power RK3399_PD_TCPD0>;
    resets = <&cru SRST_UPHY0>,
             <&cru SRST_UPHY0_PIPE_L00>,
             <&cru SRST_P_UPHY0_TCPHY>;
    reset-names = "uphy", "uphy-pipe", "uphy-tcphy";
    rockchip,typec-conn-dir = <0xe580 0 16>;
    rockchip,usb3tousb2-en = <0xe580 3 19>;
    rockchip,usb3-host-disable = <0x2434 0 16>;
    rockchip,usb3-host-port = <0x2434 12 28>;
    rockchip,external-psm = <0xe588 14 30>;
    rockchip,pipe-status = <0xe5c0 0 0>;
    rockchip,uphy-dp-sel = <0x6268 19 19>;
    status = "disabled";

    tcphy0_dp: dp-port {
        #phy-cells = <0>;
    };

    tcphy0_usb3: usb3-port {
        #phy-cells = <0>;
    };
};
```

<!-- cn PDF p.37; unit 226 -->

**CN · PDF p.37 · #226**

```text
usb20_otg: usb@ff580000 {
    compatible = "rockchip,rk3328-usb", "rockchip,rk3066-usb",
                 "snps,dwc2";
    reg = <0x0 0xff580000 0x0 0x40000>;
    interrupts = <GIC_SPI 23 IRQ_TYPE_LEVEL_HIGH>;
    clocks = <&cru HCLK_OTG>, <&cru HCLK_OTG_PMU>;
    clock-names = "otg", "otg_pmu";
    dr_mode = "otg";
    g-np-tx-fifo-size = <16>;
    g-rx-fifo-size = <275>;
    g-tx-fifo-size = <256 128 128 64 64 32>;
    g-use-dma;
    phys = <&u2phy_otg>;
    phy-names = "usb2-phy";
    status = "disabled";
};
```

<!-- cn PDF p.38; unit 233 -->

**CN · PDF p.38 · #233**

```text
usbdrd3_0: usb0 {
        compatible = "rockchip,rk3399-dwc3";
        clocks = <&cru SCLK_USB3OTG0_REF>, <&cru SCLK_USB3OTG0_SUSPEND>,
```

<!-- cn PDF p.39; unit 234 -->

**CN · PDF p.39 · #234**

```text
         <&cru ACLK_USB3OTG0>, <&cru ACLK_USB3_GRF>;
    clock-names = "ref_clk", "suspend_clk",
              "bus_clk", "grf_clk";
    power-domains = <&power RK3399_PD_USB3>;
    resets = <&cru SRST_A_USB3_OTG0>;
    reset-names = "usb3-otg";
    #address-cells = <2>;
    #size-cells = <2>;
    ranges;
    status = "disabled";

    usbdrd_dwc3_0: dwc3@fe800000 {
        compatible = "snps,dwc3";
        reg = <0x0 0xfe800000 0x0 0x100000>;
        interrupts = <GIC_SPI 105 IRQ_TYPE_LEVEL_HIGH 0>;
        dr_mode = "otg";
        phys = <&u2phy0_otg>, <&tcphy0_usb3>;
        phy-names = "usb2-phy", "usb3-phy";
        phy_type = "utmi_wide";
        snps,dis_enblslpm_quirk;
        snps,dis-u2-freeclk-exists-quirk;
        snps,dis_u2_susphy_quirk;
        snps,dis-del-phy-power-chg-quirk;
        snps,tx-ipgap-linecheck-dis-quirk;
        snps,xhci-slow-suspend-quirk;
        snps,xhci-trb-ent-quirk;
        snps,usb3-warm-reset-on-resume-quirk;
        status = "disabled";
    };
};
```

<!-- cn PDF p.39; unit 239 -->

**CN · PDF p.39 · #239**

```text
extcon_usb: extcon-usb {
        compatible = "linux,extcon-usb-gpio";
        /* 硬件设计对电平做了反向处理，这⾥必须配置为 GPIO_ACTIVE_LOW */
        vbus-gpio = <&gpio1 RK_PC5 GPIO_ACTIVE_LOW>;
        pinctrl-names = "default";
```

<!-- cn PDF p.40; unit 240 -->

**CN · PDF p.40 · #240**

```text
        pinctrl-0 = <&usb_extcon_vbus>;
        status = "okay";
};

&pinctrl {
        usb {
                usb_extcon_vbus: usb-extcon-vbus {
                rockchip,pins = <1 RK_PC5 RK_FUNC_GPIO &pcfg_pull_none>;
            };
        };
};

&u2phy_otg0 {
        /* 添加属性 rockchip,gpio-vbus-det，表⽰ phy 驱动⽀持 VBUS GPIO 检测⽅式 */
        rockchip,gpio-vbus-det;
        status = "okay";
};

&usb2phy {
        extcon = <&extcon_usb>;
        status = "okay";
};
```

<!-- cn PDF p.40; unit 245 -->

**CN · PDF p.40 · #245**

```text
extcon_usb: extcon-usb {
        compatible = "linux,extcon-usb-gpio";
        id-gpio = <&gpio3 RK_PB4 GPIO_ACTIVE_HIGH>;
        /* 注意 pinctrl-names 要设置为 default, 否则 pinctrl 节点的 pcfg_pull_up 配置会不⽣效 */
        pinctrl-names = "default";
        pinctrl-0 = <&usb_extcon_id>;
        status = "okay";
};

&pinctrl {
        usb {
                usb_extcon_id: usb-extcon-id {
```

<!-- cn PDF p.41; unit 246 -->

**CN · PDF p.41 · #246**

```text
                        /* ID 默认要内部拉⾼，配置为 pcfg_pull_up */
                        rockchip,pins = <3 RK_PB4 RK_FUNC_GPIO &pcfg_pull_up>;
                };
        };
};

&u2phy_otg0 {
        rockchip,gpio-id-det;
        status = "okay";
};

&usb2phy {
        extcon = <&extcon_usb>;
        status = "okay";
};
```

<!-- cn PDF p.41; unit 249 -->

**CN · PDF p.41 · #249**

```text
extcon_usb: extcon-usb {
        compatible = "linux,extcon-usb-gpio";
        vbus-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
        id-gpio = <&gpio3 RK_PB4 GPIO_ACTIVE_HIGH>;
        /* 注意 pinctrl-names 要设置为 default, 否则 pinctrl 节点的 pcfg_pull_up 配置会不⽣效 */
        pinctrl-names = "default";
        /* 注意 pinctrl-0 同时引⽤ usb_extcon_vbus 和 usb_extcon_id */
        pinctrl-0 = <&usb_extcon_vbus &usb_extcon_id>;
        status = "okay";
};

&pinctrl {
        usb {
                usb_extcon_id: usb-extcon-id {
                        rockchip,pins = <3 RK_PB4 RK_FUNC_GPIO &pcfg_pull_up>;
                };

                usb_extcon_vbus: usb-extcon-vbus {
                        rockchip,pins = <3 RK_PB2 RK_FUNC_GPIO &pcfg_pull_none>;
                };
        };
};

&u2phy_otg0 {
        rockchip,gpio-vbus-det;
        rockchip,gpio-id-det;
        status = "okay";
};

&usb2phy {
```

<!-- cn PDF p.42; unit 250 -->

**CN · PDF p.42 · #250**

```text
        extcon = <&extcon_usb>;
        status = "okay";
};
```

<!-- cn PDF p.45; unit 268 -->

**CN · PDF p.45 · #268**

```text
static const struct rockchip_usb2phy_cfg rk3399_phy_cfgs[] = {
        {
                .reg            = 0xe450,
                .num_ports      = 2,
                .phy_tuning     = rk3399_usb2phy_tuning,
                .clkout_ctl     = { 0xe450, 4, 4, 1, 0 },
                .port_cfgs      = {
                        [USB2PHY_PORT_OTG] = {
                                .phy_sus = { 0xe454, 8, 0, 0x052, 0x1d1 },
                                .bvalid_det_en  = { 0xe3c0, 3, 3, 0, 1 },
                                .bvalid_det_st  = { 0xe3e0, 3, 3, 0, 1 },
                                .bvalid_det_clr = { 0xe3d0, 3, 3, 0, 1 },
                                .bypass_dm_en   = { 0xe450, 2, 2, 0, 1 },
                                .bypass_sel     = { 0xe450, 3, 3, 0, 1 },
                                .idfall_det_en  = { 0xe3c0, 5, 5, 0, 1 },
                                .idfall_det_st  = { 0xe3e0, 5, 5, 0, 1 },
                                .idfall_det_clr = { 0xe3d0, 5, 5, 0, 1 },
                                .idrise_det_en  = { 0xe3c0, 4, 4, 0, 1 },
                                .idrise_det_st  = { 0xe3e0, 4, 4, 0, 1 },
                                .idrise_det_clr = { 0xe3d0, 4, 4, 0, 1 },
                                .ls_det_en      = { 0xe3c0, 2, 2, 0, 1 },
                                .ls_det_st      = { 0xe3e0, 2, 2, 0, 1 },
                                .ls_det_clr     = { 0xe3d0, 2, 2, 0, 1 },
                                .utmi_avalid    = { 0xe2ac, 7, 7, 0, 1 },
                                .utmi_bvalid    = { 0xe2ac, 12, 12, 0, 1 },
                                .utmi_iddig     = { 0xe2ac, 8, 8, 0, 1 },
                                .utmi_ls        = { 0xe2ac, 14, 13, 0, 1 },
                                .vbus_det_en    = { 0x449c, 15, 15, 1, 0 },
                        },
                        [USB2PHY_PORT_HOST] = {
                                .phy_sus        = { 0xe458, 1, 0, 0x2, 0x1 },
                                .ls_det_en      = { 0xe3c0, 6, 6, 0, 1 },
                                .ls_det_st      = { 0xe3e0, 6, 6, 0, 1 },
                                .ls_det_clr     = { 0xe3d0, 6, 6, 0, 1 },
                                .utmi_ls        = { 0xe2ac, 22, 21, 0, 1 },
                                .utmi_hstdet    = { 0xe2ac, 23, 23, 0, 1 }
                        }
```

<!-- cn PDF p.46; unit 269 -->

**CN · PDF p.46 · #269**

```text
        },
        .chg_det = {
                .opmode         = { 0xe454, 3, 0, 5, 1 },
                .cp_det         = { 0xe2ac, 2, 2, 0, 1 },
                .dcp_det        = { 0xe2ac, 1, 1, 0, 1 },
                .dp_det         = { 0xe2ac, 0, 0, 0, 1 },
                .idm_sink_en    = { 0xe450, 8, 8, 0, 1 },
                .idp_sink_en    = { 0xe450, 7, 7, 0, 1 },
                .idp_src_en     = { 0xe450, 9, 9, 0, 1 },
                .rdm_pdwn_en    = { 0xe450, 10, 10, 0, 1 },
                .vdm_src_en     = { 0xe450, 12, 12, 0, 1 },
                .vdp_src_en     = { 0xe450, 11, 11, 0, 1 },
        },
},
{
        .reg            = 0xe460,
        .num_ports      = 2,
        .phy_tuning     = rk3399_usb2phy_tuning,
        .clkout_ctl     = { 0xe460, 4, 4, 1, 0 },
        .port_cfgs      = {
                [USB2PHY_PORT_OTG] = {
                        .phy_sus = { 0xe464, 8, 0, 0x052, 0x1d1 },
                        .bvalid_det_en  = { 0xe3c0, 8, 8, 0, 1 },
                        .bvalid_det_st  = { 0xe3e0, 8, 8, 0, 1 },
                        .bvalid_det_clr = { 0xe3d0, 8, 8, 0, 1 },
                        .idfall_det_en  = { 0xe3c0, 10, 10, 0, 1 },
                        .idfall_det_st  = { 0xe3e0, 10, 10, 0, 1 },
                        .idfall_det_clr = { 0xe3d0, 10, 10, 0, 1 },
                        .idrise_det_en  = { 0xe3c0, 9, 9, 0, 1 },
                        .idrise_det_st  = { 0xe3e0, 9, 9, 0, 1 },
                        .idrise_det_clr = { 0xe3d0, 9, 9, 0, 1 },
                        .ls_det_en      = { 0xe3c0, 7, 7, 0, 1 },
                        .ls_det_st      = { 0xe3e0, 7, 7, 0, 1 },
                        .ls_det_clr     = { 0xe3d0, 7, 7, 0, 1 },
                        .utmi_avalid    = { 0xe2ac, 10, 10, 0, 1 },
                        .utmi_bvalid    = { 0xe2ac, 16, 16, 0, 1 },
                        .utmi_iddig     = { 0xe2ac, 11, 11, 0, 1 },
                        .utmi_ls        = { 0xe2ac, 18, 17, 0, 1 },
                        .vbus_det_en    = { 0x451c, 15, 15, 1, 0 },
                },
                [USB2PHY_PORT_HOST] = {
                        .phy_sus        = { 0xe468, 1, 0, 0x2, 0x1 },
                        .ls_det_en      = { 0xe3c0, 11, 11, 0, 1 },
                        .ls_det_st      = { 0xe3e0, 11, 11, 0, 1 },
                        .ls_det_clr     = { 0xe3d0, 11, 11, 0, 1 },
                        .utmi_ls        = { 0xe2ac, 26, 25, 0, 1 },
                        .utmi_hstdet    = { 0xe2ac, 27, 27, 0, 1 }
                }
        },
        .chg_det = {
                .opmode         = { 0xe464, 3, 0, 5, 1 },
                .cp_det         = { 0xe2ac, 5, 5, 0, 1 },
                .dcp_det        = { 0xe2ac, 4, 4, 0, 1 },
```

<!-- cn PDF p.47; unit 270 -->

**CN · PDF p.47 · #270**

```text
                        .dp_det         = { 0xe2ac, 3, 3, 0, 1 },
                        .idm_sink_en    = { 0xe460, 8, 8, 0, 1 },
                        .idp_sink_en    = { 0xe460, 7, 7, 0, 1 },
                        .idp_src_en     = { 0xe460, 9, 9, 0, 1 },
                        .rdm_pdwn_en    = { 0xe460, 10, 10, 0, 1 },
                        .vdm_src_en     = { 0xe460, 12, 12, 0, 1 },
                        .vdp_src_en     = { 0xe460, 11, 11, 0, 1 },
                },
        },
        { /* sentinel */ }
};
```

<!-- cn PDF p.54; unit 301 -->

**CN · PDF p.54 · #301**

```text
~/src/android_Q/kernel/drivers/usb/dwc2$ tree
.
├── core.c        (dwc2 core reset, 配置 core param等通⽤操作)
├── core.h
├── core_intr.c   (dwc2 通⽤中断事件，包括otg intr，id intr，wakeup intr等)
├── debugfs.c     (dwc2 调试接⼝，⽐如打印寄存器信息)
├── debug.h
├── gadget.c      (dwc2 gadget mode相关的所有任务，如 gadget 初始化，gadget 中断事件)
├── hcd.c         (dwc2 host mode相关任务以及core init，phy init，device/host mode切换)
├── hcd_ddma.c    (dwc2 descriptor DMA相关的任务)
├── hcd.h
├── hcd_intr.c    (dwc2 host mode的所有中断事件处理)
├── hcd_queue.c   (dwc2 host mode的传输队列处理)
├── hw.h
├── Kconfig
├── Makefile
├── pci.c         (pci 总线接⼝的初始化，Rockchip dwc2使⽤ AHB 总线)
└── platform.c    (实现dwc2 probe，根据不同芯⽚的core_params配置，初始化dwc2 lowlevel hw
resources)
```

<!-- cn PDF p.54; unit 306 -->

**CN · PDF p.54 · #306**

```text
rk3288:/sys/devices/platform/ff580000.usb # ls
busconnected  fr_interval gsnpsid   modalias       regoffset     uevent
buspower      gadget      guid      mode           regvalue      usb5
bussuspend    ggpio       gusbcfg   mode_ch_tim_en remote_wakeup wr_reg_test
```

<!-- cn PDF p.55; unit 307 -->

**CN · PDF p.55 · #307**

```text
devspeed      gnptxfsiz   hcd_frrem pools          spramdump
disconnect_us gotgctl     hcddump   power          subsystem
driver        gpvndctl    hprt0     rd_reg_test    test_sq
enumspeed     grxfsiz     hptxfsiz  regdump        udc

rk3288:/sys/devices/platform/ff580000.usb/driver # ls
bind       dwc_otg_conn_en force_usb_mode uevent vbus_status
debuglevel ff580000.usb    op_state       unbind versio
```

<!-- cn PDF p.56; unit 317 -->

**CN · PDF p.56 · #317**

```text
~/src/android_Q/kernel/drivers/usb/host$ tree
├── ehci-dbg.c      (ehci debugfs调试接⼝，如打印 ehci 寄存器信息)
├── ehci.h
├── ehci-hcd.c      (ehci 控制器的初始化，中断事件处理，urb 队列的管理等)
├── ehci-hub.c      (ehci root hub 的控制和状态查询，bus suspend/resume)
├── ehci-mem.c      (ehci mem 的分配和初始化，qtd/qh资源的分配和初始化)
├── ehci-pci.c      (pci 总线接⼝的初始化，Rockchip ehci使⽤ AHB 总线，不使⽤该驱动)
├── ehci-platform.c (ehci 通⽤平台驱动，实现ehci probe，向usb bus注册ehci hcd，使能ehci控制器)
├── ehci-q.c        (ehci qtd/qh传输队列的处理)
├── ehci-sched.c    (ehci interrupt, iso, split iso的周期传输调度处理)
├── ehci-sysfs.c    (ehci sysfs调试接⼝，显⽰ companion 控制器，显⽰ uframe_periodic_max)
├── ehci-timer.c    (ehci timer相关的任务处理)
```

<!-- cn PDF p.56; unit 319 -->

**CN · PDF p.56 · #319**

```text
static const struct hc_driver ehci_hc_driver = {
    .description =      hcd_name,
    .product_desc =     "EHCI Host Controller",
    .hcd_priv_size =    sizeof(struct ehci_hcd),
    /*
     * generic hardware linkage
     */
    .irq =          ehci_irq,
    .flags =        HCD_MEMORY | HCD_USB2 | HCD_BH,
    /*
     * basic lifecycle operations
     */
    .reset =        ehci_setup,
    .start =        ehci_run,
    .stop =         ehci_stop,
    .shutdown =     ehci_shutdown,
    /*
     * managing i/o requests and associated device resources
     */
    .urb_enqueue =      ehci_urb_enqueue,
```

<!-- cn PDF p.57; unit 320 -->

**CN · PDF p.57 · #320**

```text
    .urb_dequeue =      ehci_urb_dequeue,
    .endpoint_disable = ehci_endpoint_disable,
    .endpoint_reset =   ehci_endpoint_reset,
    .clear_tt_buffer_complete = ehci_clear_tt_buffer_complete,
    /*
     * scheduling support
     */
    .get_frame_number = ehci_get_frame,
    /*
     * root hub support
     */
    .hub_status_data =  ehci_hub_status_data,
    .hub_control =      ehci_hub_control,
    .bus_suspend =      ehci_bus_suspend,
    .bus_resume =       ehci_bus_resume,
    .relinquish_port =  ehci_relinquish_port,
    .port_handed_over = ehci_port_handed_over,
    /*
     * device support
     */
    .free_dev =     ehci_remove_device,
};
```

<!-- cn PDF p.57; unit 322 -->

**CN · PDF p.57 · #322**

```text
~/src/android_Q/kernel/drivers/usb/host$ tree
├── ohci-dbg.c     (ohci debugfs调试接⼝，如打印 ohci 寄存器信息)
├── ohci.h
├── ohci-hcd.c     (ohci 控制器的初始化，中断事件处理，urb 队列的管理等)
├── ohci-hub.c     (ohci root hub 的控制和状态查询，bus suspend/resume)
├── ohci-mem.c     (ohci mem 的分配和初始化，td/ed资源的分配和初始化)
├── ohci-pci.c     (pci 总线接⼝的初始化，Rockchip ohci使⽤ AHB 总线，不使⽤该驱动⽂件)
├── ohci-platform.c(ohci 通⽤平台驱动，实现ohci probe，向usb bus注册ohci hcd，使能ohci控制器)
├── ohci-q.c       (ohci td/ed传输队列的处理)
```

<!-- cn PDF p.57; unit 324 -->

**CN · PDF p.57 · #324**

```text
static const struct hc_driver ohci_hc_driver = {
    .description =          hcd_name,
    .product_desc =         "OHCI Host Controller",
    .hcd_priv_size =        sizeof(struct ohci_hcd),
    /*
     * generic hardware linkage
    */
    .irq =                  ohci_irq,
    .flags =                HCD_MEMORY | HCD_USB11,
```

<!-- cn PDF p.58; unit 325 -->

**CN · PDF p.58 · #325**

```text
    /*
    * basic lifecycle operations
    */
    .reset =                ohci_setup,
    .start =                ohci_start,
    .stop =                 ohci_stop,
    .shutdown =             ohci_shutdown,
    /*
     * managing i/o requests and associated device resources
    */
    .urb_enqueue =          ohci_urb_enqueue,
    .urb_dequeue =          ohci_urb_dequeue,
    .endpoint_disable =     ohci_endpoint_disable,
    /*
    * scheduling support
    */
    .get_frame_number =     ohci_get_frame,
    /*
    * root hub support
    */
    .hub_status_data =      ohci_hub_status_data,
    .hub_control =          ohci_hub_control,
#ifdef CONFIG_PM
    .bus_suspend =          ohci_bus_suspend,
    .bus_resume =           ohci_bus_resume,
#endif
    .start_port_reset = ohci_start_port_reset,
};
```

<!-- cn PDF p.58; unit 328 -->

**CN · PDF p.58 · #328**

```text
rk3399:/sys/kernel/debug/fe380000.usb # ls
async bandwidth periodic registers

rk3399:/sys/devices/platform/fe380000.usb # ls
companion driver_override of_node power     uevent              usb5
driver    modalias        pools   subsystem uframe_periodic_max usbmon
```

<!-- cn PDF p.59; unit 331 -->

**CN · PDF p.59 · #331**

```text
rk3399:/sys/kernel/debug/usb/ohci/fe3a0000.usb # ls
async periodic registers
```

<!-- cn PDF p.60; unit 342 -->

**CN · PDF p.60 · #342**

```text
~/src/kernel-4.19/drivers/usb/dwc3$ tree
.
├── core.c              (dwc3 core probe的实现，分配各种资源，初始化控制器，PM runtime 管理)
├── core.h
├── debugfs.c           (dwc3 debugfs调试接⼝的实现)
├── debug.h
├── drd.c               (dwc3 dule role mode/otg mode 动态切换的处理)
├── dwc3-of-simple.c    (dwc3 通⽤平台驱动，实现dwc3的第⼀级dwc3_of_simple_probe，并通过
of_platform_populate 调⽤dwc3 core的第⼆级dwc3_probe)
├── dwc3-pci.c          (pci 总线接⼝的初始化，Rockchip dwc3使⽤AXI总线，不使⽤该驱动⽂件)
├── dwc3-rockchip-inno.c(RK3328/RK3228H专⽤的glue layer，增加了disconnect work的实现)
├── ep0.c               (dwc3 gadget ep0的任务处理)
├── gadget.c            (dwc3 gadget 除ep0外的端点任务处理，中断的⼊⼝函数实现)
├── gadget.h
├── host.c              (dwc3 host资源分配，并通过platform_device_add调⽤xHCI的xhci_plat_probe)
├── io.h
├── Kconfig
```

<!-- cn PDF p.61; unit 343 -->

**CN · PDF p.61 · #343**

```text
├── Makefile
├── trace.c              (dwc3 trace的实现，基于linux的trace接⼝)
├── trace.h
└── ulpi.c               (ulpi phy接⼝的代码实现，Rockchip dwc3不使⽤ulpi)

~/src/kernel-4.19/drivers/usb/host$ tree
├── xhci.c               (初始化xhci_hc_driver，启动xHCI控制器，管理urb队列等)
├── xhci-dbg.c           (实现打印log的调试函数)
├── xhci-dbgcap.c        (xHCI 硬件模块 debug capability的功能实现，Rockchip 不⽀持)
├── xhci-dbgcap.h
├── xhci-debugfs.c       (xHCI debugfs调试接⼝)
├── xhci-debugfs.h
├── xhci-ext-caps.c      (xHCI extended capability的功能实现，Rockchip 不⽀持)
├── xhci-ext-caps.h
├── xhci.h
├── xhci-hub.c           (xHCI root hub 的控制和状态查询，bus suspend/resume)
├── xhci-mem.c           (xHCI mem 管理，包括分配，初始化，释放等操作)
├── xhci-pci.c           (pci 总线接⼝的初始化，Rockchip xHCI使⽤AXI总线，不使⽤该驱动⽂件)
├── xhci-plat.c          (xHCI 通⽤平台驱动，实现xhci_plat_probe，Rockchip 使⽤该驱动)
├── xhci-plat.h
├── xhci-ring.c          (xHCI transfer/command/event ring 的管理)
├── xhci-trace.c         (xHCI trace的实现，基于linux的trace接⼝)
└── xhci-trace.h
```

<!-- cn PDF p.61; unit 347 -->

**CN · PDF p.61 · #347**

```text
static const struct hc_driver xhci_hc_driver = {
    .description =      "xhci-hcd",
    .product_desc =     "xHCI Host Controller",
    .hcd_priv_size =    sizeof(struct xhci_hcd *),
    /*
     * generic hardware linkage
     */
    .irq =          xhci_irq,
    .flags =        HCD_MEMORY | HCD_USB3 | HCD_SHARED,
    /*
     * basic lifecycle operations
```

<!-- cn PDF p.62; unit 348 -->

**CN · PDF p.62 · #348**

```text
     */
    .reset =        NULL, /* set in xhci_init_driver() */
    .start =        xhci_run,
    .stop =         xhci_stop,
    .shutdown =     xhci_shutdown,
    /*
     * managing i/o requests and associated device resources
     */
    .urb_enqueue =      xhci_urb_enqueue,
    .urb_dequeue =      xhci_urb_dequeue,
    .alloc_dev =        xhci_alloc_dev,
    .free_dev =     xhci_free_dev,
    .alloc_streams =    xhci_alloc_streams,
    .free_streams =     xhci_free_streams,
    .add_endpoint =     xhci_add_endpoint,
    .drop_endpoint =    xhci_drop_endpoint,
    .endpoint_reset =   xhci_endpoint_reset,
    .check_bandwidth =  xhci_check_bandwidth,
    .reset_bandwidth =  xhci_reset_bandwidth,
    .address_device =   xhci_address_device,
    .enable_device =    xhci_enable_device,
    .update_hub_device =    xhci_update_hub_device,
    .reset_device =     xhci_discover_or_reset_device,
    /*
     * scheduling support
     */
    .get_frame_number = xhci_get_frame,
    /*
     * root hub support
     */
    .hub_control =      xhci_hub_control,
    .hub_status_data =  xhci_hub_status_data,
    .bus_suspend =      xhci_bus_suspend,
    .bus_resume =       xhci_bus_resume,
    /*
     * call back when device connected and addressed
     */
    .update_device =        xhci_update_device,
    .set_usb2_hw_lpm =  xhci_set_usb2_hardware_lpm,
    .enable_usb3_lpm_timeout =  xhci_enable_usb3_lpm_timeout,
    .disable_usb3_lpm_timeout = xhci_disable_usb3_lpm_timeout,
    .find_raw_port_number = xhci_find_raw_port_number,
};
```

<!-- cn PDF p.63; unit 351 -->

**CN · PDF p.63 · #351**

```text
console:/sys/kernel/debug/fe800000.dwc3 # ls
ep0in  ep1in  ep2in  ep3in  ep4in  ep5in  ep6out     lsp_dump regdump
ep0out ep1out ep2out ep3out ep4out ep5out link_state mode     testmode

console:/sys/kernel/debug/usb/xhci/xhci-hcd.0.auto # ls
command-ring ports          reg-ext-legsup:00   reg-op
devices      reg-cap        reg-ext-protocol:00 reg-runtime
event-ring   reg-ext-dbc:00 reg-ext-protocol:01
```

<!-- cn PDF p.63; unit 353 -->

**CN · PDF p.63 · #353**

```text
#RK3399 Type-C0 USB OTG 切换命令
#1.Force host mode
  echo host > sys/kernel/debug/usb@fe800000/rk_usb_force_mode
#2.Force peripheral mode
  echo peripheral > sys/kernel/debug/usb@fe800000/rk_usb_force_mode
```

<!-- cn PDF p.64; unit 355 -->

**CN · PDF p.64 · #355**

```text
#RK3399 Type-C0 USB OTG 切换命令
#1.Force host mode
  echo host > sys/devices/platform/usb0/dwc3_mode
#2.Force peripheral mode
  echo peripheral > sys/devices/platform/usb0/dwc3_mode

#RK1808 USB OTG 切换命令
#1.Force host mode
  echo host > sys/devices/platform/usb/dwc3_mode
#2.Force peripheral mode
  echo peripheral > sys/devices/platform/usb/dwc3_mode
```

<!-- cn PDF p.64; unit 357 -->

**CN · PDF p.64 · #357**

```text
#RK3399 Type-C0 USB OTG 切换命令
#1.Force host mode
  echo host > sys/devices/platform/ff770000.syscon/ff770000.syscon:usb2-phy@e450/otg_mode
#2.Force peripheral mode
  echo peripheral > sys/devices/platform/ff770000.syscon/ff770000.syscon:usb2-
phy@e450/otg_mode

#其他芯⽚，⽅法类似，只要在 sys/devices/platform 路径下，搜索 otg_mode 节点，然后设置该节点即可。
```

<!-- cn PDF p.64; unit 359 -->

**CN · PDF p.64 · #359**

```text
#RK3588 Type-C0 USB OTG 切换命令
#⽅式1. [Legacy] 通过 USB PHY 节点切换
#1.Force host mode
  echo host > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-phy@0/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-
phy@0/otg_mode

#⽅式2.[New] 通过 USB 控制器节点切换
#1.Force host mode
  echo host > /sys/kernel/debug/usb/fc000000.usb/mode
#2.Force peripheral mode
  echo device > /sys/kernel/debug/usb/fc000000.usb/mode

#其他芯⽚，⽅法类似，只要在 sys/ 路径下，搜索 otg_mode 或者 mode 节点，然后设置该节点即可。
```

<!-- cn PDF p.72; unit 413 -->

**CN · PDF p.72 · #413**

```text
&usbdrd_dwc3_1 {
        status = "okay";
        dr_mode = "otg";  /* 配置Type-C1 USB控制器为OTG mode */
        extcon = <&fusb1>; /* 注意：extcon 属性要根据实际的硬件电路设计来配置 */
};
```

<!-- cn PDF p.74; unit 427 -->

**CN · PDF p.74 · #427**

```text
echo none > config/usb_gadget/g1/UDC
echo fe900000.dwc3 > config/usb_gadget/g1/UDC
```

<!-- cn PDF p.77; unit 435 -->

**CN · PDF p.77 · #435**

```text
echo usb2 > /sys/bus/usb/drivers/usb/unbind
echo usb2 > /sys/bus/usb/drivers/usb/bind
```

<!-- cn PDF p.78; unit 437 -->

**CN · PDF p.78 · #437**

```text
1. kill uvc_app #杀掉 uvc 应⽤
2. rm -rf /sys/kernel/config/usb_gadget/rockchip/configs/b.1/f* #移除已绑定的usb func
3. echo ffd00000.dwc3  > /sys/bus/platform/drivers/dwc3/unbind #remove usb 控制器
4. echo ffd00000.dwc3  > /sys/bus/platform/drivers/dwc3/bind #probe usb 控制器
5. cd /sys/kernel/config/usb_gadget/rockchip/configs/b.1 #绑定 usb function
   ln -s ../../functions/rndis.gs0 f1
   ln -s ../../functions/uvc.gs6/ f2
6. echo ffd00000.dwc3 > /sys/kernel/config/usb_gadget/rockchip/UDC #使能 usb 控制器连接
7. restart uvc_app #启动 uvc 应⽤
```

<!-- cn PDF p.79; unit 445 -->

**CN · PDF p.79 · #445**

```text
arch/arm64/boot/dts/rockchip/rk3588-android.dtsi
chosen: chosen {
    bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0
irqchip.gicv3_pseudo_nmi=0 rcupdate.rcu_expedited=1 rcu_nocbs=all
usbcore.autosuspend=-1";
};
```

<!-- cn PDF p.79; unit 449 -->

**CN · PDF p.79 · #449**

```text
diff --git a/drivers/usb/core/hub.c b/drivers/usb/core/hub.c
```

<!-- cn PDF p.80; unit 450 -->

**CN · PDF p.80 · #450**

```text
index fc7d6cdacf16..df8e69e60aaf 100644
--- a/drivers/usb/core/hub.c
+++ b/drivers/usb/core/hub.c
@@ -41,6 +41,8 @@
 #define USB_VENDOR_GENESYS_LOGIC               0x05e3
 #define USB_VENDOR_SMSC                                0x0424
 #define USB_PRODUCT_USB5534B                   0x5534
+#define USB_VENDOR_CYPRESS                     0x04b4
+#define USB_PRODUCT_CY7C65632                  0x6570
 #define HUB_QUIRK_CHECK_PORT_AUTOSUSPEND       0x01
 #define HUB_QUIRK_DISABLE_AUTOSUSPEND          0x02

@@ -5697,6 +5699,11 @@ static const struct usb_device_id hub_id_table[] = {
       .idProduct = USB_PRODUCT_USB5534B,
       .bInterfaceClass = USB_CLASS_HUB,
       .driver_info = HUB_QUIRK_DISABLE_AUTOSUSPEND},
+    { .match_flags = USB_DEVICE_ID_MATCH_VENDOR
+                   | USB_DEVICE_ID_MATCH_PRODUCT,
+      .idVendor = USB_VENDOR_CYPRESS,
+      .idProduct = USB_PRODUCT_CY7C65632,
+      .driver_info = HUB_QUIRK_DISABLE_AUTOSUSPEND},
```

<!-- cn PDF p.82; unit 477 -->

**CN · PDF p.82 · #477**

```text
include/linux/usb/quirks.h
drivers/usb/core/quirks.c

/* Lists of quirky USB devices */
static const struct usb_device_id usb_quirk_list[] = {
        { USB_DEVICE(0x0204, 0x6025), .driver_info = USB_QUIRK_RESET_RESUME },
        { USB_DEVICE(0x21c4, 0x0cd1), .driver_info = USB_QUIRK_NO_LPM },
};

static const struct usb_device_id usb_interface_quirk_list[] = {
        { USB_VENDOR_AND_INTERFACE_INFO(0x046d, USB_CLASS_VIDEO, 1, 0),
          .driver_info = USB_QUIRK_RESET_RESUME },
};
```

<!-- cn PDF p.83; unit 478 -->

**CN · PDF p.83 · #478**

```text
static const struct usb_device_id usb_endpoint_ignore[] = {
        { USB_DEVICE_INTERFACE_NUMBER(0x06f8, 0xb000, 5), .driver_info = 0x01 },
};
```

<!-- cn PDF p.83; unit 480 -->

**CN · PDF p.83 · #480**

```text
include/linux/usb_usual.h
drivers/usb/storage/unusual_devs.h   /* Driver for USB Mass Storage compliant devices */
drivers/usb/storage/unusual_uas.h    /* Driver for USB Attached SCSI devices - Unusual
Devices File */

/* Example of USB Mass Storage unusual device */
UNUSUAL_DEV(0x0951, 0x1697, 0x0100, 0x0100,
                    "Kingston",
                    "DT Ultimate G3",
                    USB_SC_DEVICE, USB_PR_DEVICE, NULL,
                    US_FL_NO_WP_DETECT)

/* Example of USB Attached SCSI unusual device */
UNUSUAL_DEV(0x0b05, 0x1932, 0x0000, 0x9999,
                    "ASUS",
                    "External HDD",
                    USB_SC_DEVICE, USB_PR_DEVICE, NULL,
                    US_FL_IGNORE_UAS)
```

<!-- cn PDF p.90; unit 540 -->

**CN · PDF p.90 · #540**

```text
dev_mount udisk /mnt/udisk 1 /devices/platform/usb20_Host/usb2
```

## Исходные векторные блок-схемы

Каждая схема сохранена двумя фрагментами страниц исходного PDF, а не вместо редактируемого текста. VBUS: подключение/отключение Device → изменение VBUS → прерывание GPIO → проверка инвертированного GPIO. Low передаёт EXTCON_USB True; PHY повышает bvalid; прерывание нарастающего фронта планирует otg_sm_work; определение зарядного устройства; возобновление PHY; подтяжка DP и перечисление. High передаёт EXTCON_USB False; PHY понижает bvalid; прерывание отключения контроллера; callback Gadget disconnect; suspend PHY; конец. ID: кабель OTG → прерывание ID GPIO. Low передаёт EXTCON_USB_HOST True; PHY понижает IDDIG; прерывание спада ID; инициализация Host; включение VBUS regulator. High передаёт EXTCON_USB_HOST False; PHY повышает IDDIG; прерывание нарастающего фронта ID; инициализация Device; выключение VBUS regulator; конец.

![Исходные векторные блок-схемы · EN PDF p.70](/docs/rockchip-linux-usb/assets/en-p070-flow.png)

![Исходные векторные блок-схемы · EN PDF p.71](/docs/rockchip-linux-usb/assets/en-p071-flow.png)

![Исходные векторные блок-схемы · EN PDF p.72](/docs/rockchip-linux-usb/assets/en-p072-flow.png)

![Исходные векторные блок-схемы · EN PDF p.73](/docs/rockchip-linux-usb/assets/en-p073-flow.png)

## Полные таблицы VID/PID китайского V2.4.0

Дополнение к прежней английской таблице §6.3. Повторяющиеся PID сохранены как опубликовано, без догадок. Источник: китайский PDF, стр.73–74.

| Функция USB | VID | PID | Примечание |
| --- | --- | --- | --- |
| UMS | 0x2207 | 0x0000 | Linux SDK Mass Storage |
| MTP | 0x2207 | 0x0001 | Android Q + Kernel 4.4 и более ранние SDK, а также Linux SDK |
| PTP | 0x2207 | 0x0002 | Android Q + Kernel 4.4 и более ранние SDK |
| RNDIS | 0x2207 | 0x0003 | Android/Linux SDK |
| MIDI | 0x2207 | 0x0004 | Android SDK |
| UVC | 0x2207 | 0x0005 | Android SDK |
| ADB | 0x2207 | 0x0006 | Android/Linux SDK |
| MTP | 0x2207 | 0x0007 | Android Q + kernel 4.19 и более новые SDK |
| PTP | 0x2207 | 0x0008 | Android Q + kernel 4.19 и более новые SDK |
| NTB | 0x2207 | 0x0009 | Резерв для следующего поколения вычислительного модуля |
| UMS,ADB | 0x2207 | 0x0010 | Kernel 3.10 и более ранние SDK |
| UMS | 0x2207 | 0x0010 | U-Boot UMS |
| MTP,ADB | 0x2207 | 0x0011 | Android Q + kernel 4.4 и более ранние SDK, а также Linux SDK |
| PTP,ADB | 0x2207 | 0x0012 | Android Q + kernel 4.4 и более ранние SDK |
| RNDIS,ADB | 0x2207 | 0x0013 | Android SDK |
| MIDI,ADB | 0x2207 | 0x0014 | Android SDK |
| UVC,ADB | 0x2207 | 0x0015 | Составное устройство UVC Android SDK |
| UVC,ADB [UAC,<br>RNDIS] | 0x2207 | 0x0016 | Составное устройство UVC Linux SDK |
| MTP,ADB | 0x2207 | 0x0017 | Android Q + kernel 4.19 и более новые SDK |
| PTP,ADB | 0x2207 | 0x0018 | Android Q + kernel 4.19 и более новые SDK |
| UMS,ADB | 0x2207 | 0x0018 | Linux SDK |
| NTB | 0x2207 | 0x0018 | NPU Transfer Bridge вычислительного модуля |
| NTB [RNDIS,HID] | 0x2207 | 0x0019 | Резерв для составного USB-устройства следующего вычислительного модуля |
| DFU | 0x2207 | 0x0107 | U-Boot USB Device Firmware update |
| Rockusb | 0x2207 | 0x1xxx/0x2xxx/0x3xxx | Устройство MASKROM/LOADER для загрузки прошивки |
| ACCESSORY | 0x18d1 | 0x2d00 | Определено Google |
| ACCESSORY,ADB | 0x18d1 | 0x2d01 | Определено Google |

| Функция USB | VID | PID |
| --- | --- | --- |
| MSC | 0x2207 | 0x0000/0x0010 |
| MTP | 0x2207 | 0x0001 |
| ADB | 0x2207 | 0x0006/0x0011 |
| UVC | 0x2207 | 0x0016 |
| MASKROM | 0x2207 | 0x1xxx/0x2xxx/0x3xxx |
| LOADER | 0x2207 | 0x1xxx/0x2xxx/0x3xxx |

{% endraw %}
<!-- render160-part-10 -->
