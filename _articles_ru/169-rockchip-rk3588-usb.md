---
title: "RK3588 USB: аппаратные схемы, питание PHY, DTS и Type-C"
description: "RK3588 USB: аппаратные схемы, питание PHY, DTS и Type-C · CN/EN V1.3.0"
excerpt: "RK3588 USB: аппаратные схемы, питание PHY, DTS и Type-C"
translation_key: "169-rockchip-rk3588-usb"
slug: "169-rockchip-rk3588-usb"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "RK3588", "USB", "Type-C", "PHY", "DTS"]
---

{% raw %}

Справочный материал платформы: полная документация производителя USB для RK3588/RK3588S (CN/EN V1.3.0), базовое ядро Linux-5.10+. Описаны схемы контроллеров/PHY, питание, интерфейсы и DTS для адаптации продукта. Соответствие конкретным платам ArmSoM и SDK/BSP не подтверждено; аппаратные испытания не проводились. Проверяйте схему, SoC/ядро, патчи, питание PHY, GPIO, PD-контроллер и соединения. Таблицы потребления и команды — примеры производителя, не измерения ArmSoM. ZH использует китайские рисунки, EN/RU/DE — английские оригиналы. Различия источников и уникальные примеры сохранены отдельно.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- en PDF p.5; unit 0 -->

## 1. Контроллеры USB и PHY RK3588

<!-- en PDF p.5; unit 1 -->

RK3588 поддерживает пять независимых контроллеров: два USB 2.0 HOST, два USB 3.1 OTG и один USB 3.1 HOST. RK3588S имеет на один USB 3.1 OTG меньше. Типы приведены в таблице 1; подробные характеристики — в datasheet RK3588. Таблица 1. Контроллеры USB RK3588.

<!-- en PDF p.5; unit 2 -->

| Чип/контроллер | USB 2.0 HOST (EHCI&OHCI) | USB 3.1 OTG (DWC3&xHCI) | USB 3.1 Host(xHCI) |
| --- | --- | --- | --- |
| RK3588 | 2 | 2 | 1 |
| RK3588S | 2 | 1 | 1 |

<!-- en PDF p.5; unit 3 -->

RK3588 имеет семь независимых USB PHY: четыре USB 2.0 PHY, два USB 3.1/DP Combo PHY и один USB <!-- en PDF p.5; unit 4 --> 3.1/SATA/PCIe Combo PHY. У RK3588S на один USB 2.0 PHY и один USB 3.1/DP Combo PHY меньше. Таблица 2. Поддерживаемые PHY RK3588.

<!-- en PDF p.5; unit 5 -->

| Чип/PHY | USB 2.0 PHY | USB3.1/DP ComboPHY | USB 3.1/SATA/PCIe ComboPHY |
| --- | --- | --- | --- |
| RK3588 | 4 [1 × port] | 2 | 1 |
| RK3588S | 3 [1 × port] | 1 | 1 |

<!-- en PDF p.5; unit 6 -->

Примечания:

<!-- en PDF p.5; unit 7 -->

1. Число N в таблице означает N независимых контроллеров или PHY.

<!-- en PDF p.5; unit 8 -->

2. [1 × ports] означает один USB-порт на PHY.

<!-- en PDF p.5; unit 9 -->

3. EHCI&OHCI означает интеграцию EHCI и OHCI; DWC3&xHCI — интеграцию DWC3 и xHCI.

<!-- en PDF p.5; unit 10 -->

4. Физическая скорость USB 3.1 Gen1 — 5Gbps, USB 2.0 — 480Mbps.

<!-- en PDF p.5; unit 11 -->

5. USB 3.1/DP Combo PHY имеет четыре линии и одновременно поддерживает USB 3.1 и две линии DP.

<!-- en PDF p.5; unit 12 -->

6. USB 3.1/SATA/PCIe Combo PHY работает только в одном режиме: USB3.1 взаимоисключается с SATA/PCIe. Таблица 3. Соединения контроллеров USB и PHY.

<!-- en PDF p.6; unit 13 -->

| Интерфейс USB (схема) | Контроллер USB | USB PHY |
| --- | --- | --- |
| TYPEC0 | OTG0 (DWC3&xHCI) | USB3.1/DP ComboPHY0 + USB2.0<br>PHY0 |
| TYPEC1 | OTG1 (DWC3&xHCI) | USB3.1/DP ComboPHY1 + USB2.0<br>PHY1 |
| USB20_HOST0 | USB2.0 HOST0<br>(EHCI&OHCI) | USB2.0 PHY2 |
| USB20_HOST1 | USB2.0 HOST1<br>(EHCI&OHCI) | USB2.0 PHY3 |
| USB30_2 | USB3.1 HOST2 (xHCI) | USB3.1/SATA/PCIe ComboPHY2 |

<!-- en PDF p.6; unit 14 -->

Таблица 4 сопоставляет контроллеры USB RK3588 с контактами передачи USB-данных чипа.

<!-- en PDF p.6; unit 15 -->

| Контроллер/контакт USB | Контакты данных USB RK3588 |
| --- | --- |
| USB 2.0 HOST0 | USB20_HOST0_DP/USB20_HOST0_DM |
| USB 2.0 HOST1 | USB20_HOST1_DP/USB20_HOST1_DM |
| USB 3.1 OTG0 | TYPEC0_USB20_OTG_DP/TYPEC0_USB20_OTG_DM,<br>TYPEC0_SSRX1P/TYPEC0_SSRX1N, TYPEC0_SSTX1P/TYPEC0_SSTX1N,<br>TYPEC0_SSRX2P/TYPEC0_SSRX2N, TYPEC0_SSTX2P/TYPEC0_SSTX2N |
| USB 3.1 OTG1 | TYPEC1_USB20_OTG_DP/TYPEC1_USB20_OTG_DM,<br>TYPEC1_SSRX1P/TYPEC1_SSRX1N, TYPEC1_SSTX1P/TYPEC1_SSTX1N<br>TYPEC1_SSRX2P/TYPEC1_SSRX2N, TYPEC1_SSTX2P/TYPEC1_SSTX2N |
| USB 3.1 HOST2 | USB30_2_SSTXP/USB30_2_SSTXN<br>USB30_2_SSRXP/USB30_2_SSRXN |

<!-- en PDF p.6; unit 16 -->

Внутренние соединения контроллеров и PHY и соответствующие распространённые USB-интерфейсы показаны на рисунке 1.

<!-- en PDF p.7; unit 17 -->

![Рисунок английского оригинала · PDF p.7](/docs/rockchip-rk3588-usb/assets/en-p007-figure-01.png)

<!-- en PDF p.7; unit 18 -->

Рисунок 1. Контроллеры USB и PHY RK3588. Из рисунка следует:

<!-- en PDF p.7; unit 19 -->

1. Максимум два полнофункциональных Type-C, два Type-A USB 2.0 и один Type-A USB 3.1 only без обратной совместимости с USB2.0.

<!-- en PDF p.7; unit 20 -->

2. USB3.1 OTG и DP совместно используют USB3.1/DP Combo PHY, формируя полный Type-C либо раздельные интерфейсы: например, Type-A USB3.1 и DP с двумя линиями.

<!-- en PDF p.7; unit 21 -->

3. USB3.1 HOST_2 поддерживает только USB3.1, не USB2.0, поскольку не имеет USB2.0 PHY. Его можно объединить с USB2.0 HOST_0 или USB <!-- en PDF p.7; unit 22 --> 2.0 HOST_1 в полноценный Type-A USB3.1.

<!-- en PDF p.7; unit 23 -->

4. USB3.1/DP Combo PHY поддерживает только Gen1 и не совместим с USB <!-- en PDF p.7; unit 24 --> 2.0 самостоятельно. Внутри чипа он объединён с USB2.0 PHY для полного USB3.1. Combo PHY0 фиксированно связан с USB2 PHY0, Combo PHY1 — с USB2 PHY1.

<!-- en PDF p.7; unit 25 -->

5. USB3.1/SATA/PCIe Combo PHY также поддерживает только Gen1 и не объединён внутри с USB2 PHY. Поэтому USB3 HOST_2 нужно сочетать с одним из USB2 HOST_0/1 для полного USB3.1.

<!-- en PDF p.7; unit 26 -->

6. RK3588S не имеет Type-C1: одного USB3.1 OTG-контроллера, одного DP-контроллера, одного USB3.1/DP Combo PHY и одного USB2.0 PHY.

<!-- en PDF p.8; unit 27 -->

Поддержка не ограничивается Type-C/A на рисунке 1; возможны все обычные интерфейсы, включая Type-C USB <!-- en PDF p.8; unit 28 --> 2.0/3.1, Type-A USB2.0/3.1 и Micro USB2.0/3.1. См. раздел поддерживаемых типов. Драйвер Linux-5.10 адаптирован к различным схемам и разъёмам; разработчику достаточно правильно настроить Linux USB DTS под схему продукта. Подробности — в разделе DTS.

<!-- en PDF p.8; unit 29 -->

## 2. Поддерживаемые типы интерфейсов USB RK3588

<!-- en PDF p.8; unit 30 -->

Поддерживаются распространённые интерфейсы рисунка 2. При проектировании можно выбирать схему под приложение, адаптируя Linux USB DTS.

<!-- en PDF p.8; unit 31 -->

![Рисунок английского оригинала · PDF p.8](/docs/rockchip-rk3588-usb/assets/en-p008-figure-01.png)

<!-- en PDF p.8; unit 32 -->

Рисунок 2. Типы USB-разъёмов.

<!-- en PDF p.8; unit 33 -->

### 2.1 Type-C

<!-- en PDF p.8; unit 34 -->

#### 2.1.1 Полнофункциональный Type-C USB 3.1/DP

<!-- en PDF p.8; unit 35 -->

Type-C0/1 поддерживают полную функциональность Type-C[1], рисунок 3; схема описана далее. Возможности: Type-C PD с внешним Type-C-контроллером; USB3.1 Gen1 5Gbps; DP Alternate Mode.

<!-- en PDF p.9; unit 36 -->

![Рисунок английского оригинала · PDF p.9](/docs/rockchip-rk3588-usb/assets/en-p009-figure-01.png)

<!-- en PDF p.9; unit 37 -->

Рисунок 3. Интерфейс Type-C USB3.1/DP.

<!-- en PDF p.9; unit 38 -->

![Рисунок английского оригинала · PDF p.9](/docs/rockchip-rk3588-usb/assets/en-p009-figure-02.png)

<!-- en PDF p.9; unit 39 -->

Рисунок 4. Контакты Type-C. Таблица 5. Описание интерфейса Type-C.

<!-- en PDF p.10; unit 40 -->

| Контакт | Имя | Описание | Контакт | Имя | Описание |
| --- | --- | --- | --- | --- | --- |
| A1 | GND | Земля | B12 | GND | Земля |
| A2 | SSTXp1 | SuperSpeed: дифференциальный сигнал TX1+ | B11 | SSRXp1 | SuperSpeed: дифференциальный сигнал RX1+ |
| A3 | SSTXn1 | SuperSpeed: дифференциальный сигнал TX1- | B10 | SSRXn1 | SuperSpeed: дифференциальный сигнал RX1- |
| A4 | VBUS | Питание USB-шины | B9 | VBUS | Питание USB-шины |
| A5 | CC1 | Канал конфигурации | B8 | SBU2 | Вспомогательные сигналы (SBU) |
| A6 | Dp1 | USB 2.0: дифференциальный сигнал D1+ | B7 | Dn2 | USB 2.0: дифференциальный сигнал D2- |
| A7 | Dn1 | USB 2.0: дифференциальный сигнал D1- | B6 | Dp2 | USB 2.0: дифференциальный сигнал D2+ |
| A8 | SBU1 | Вспомогательные сигналы (SBU) | B5 | CC2 | Канал конфигурации |
| A9 | VBUS | Питание USB-шины | B4 | VBUS | Питание USB-шины |
| A10 | SSRXn2 | SuperSpeed: дифференциальный сигнал RX2- | B3 | SSTXn2 | SuperSpeed: дифференциальный сигнал TX2- |
| A11 | SSRXp2 | SuperSpeed: дифференциальный сигнал RX2+ | B2 | SSTXp2 | SuperSpeed: дифференциальный сигнал TX2+ |
| A12 | GND | Земля | B1 | GND | Земля |

<!-- en PDF p.10; unit 41 -->

Таблица 6. Соединение RK3588 Type-C0 с разъёмом Type-C.

<!-- en PDF p.11; unit 42 -->

| Контакт Type-C0 RK3588 | Контакт Type-C | Описание соединения |
| --- | --- | --- |
| TYPEC0_SSRX1P/DP0_TX0P<br>TYPEC0_SSRX1N/DP0_TX0N | B10/B11 | К USBDP PHY RK3588 lane0; USB3.1 Rx либо DP Tx |
| TYPEC0_SSTX1P/DP0_TX1P<br>TYPEC0_SSTX1N/DP0_TX1N | A2/A3 | К USBDP PHY RK3588 lane1; USB3.1 Tx либо DP Tx |
| TYPEC0_SSRX2P/DP0_TX2P<br>TYPEC0_SSRX2N/DP0_TX2N | A10/A11 | К USBDP PHY RK3588 lane2; USB3.1 Rx либо DP Tx |
| TYPEC0_SSTX2P/DP0_TX3P<br>TYPEC0_SSTX2N/DP0_TX3N | B2/B3 | К USBDP PHY RK3588 lane3; USB3.1 Tx либо DP Tx |
| TYPEC0_OTG_DP/DM | A6/A7,<br>B6/B7 | К TYPEC0_OTG_DP/DM RK3588; A6/B6 соединены параллельно, A7/B7 параллельно |
| TYPEC0_SBU1/TYPEC0_SBU2 | A8/B8 | К AUX USBDP PHY; только DP Alternate Mode |
| TYPEC0_SBU1_DC/TYPEC0_SBU2_DC | A8/B8 | К GPIO RK3588 для программной подтяжки при передаче DP AUX; исходные pull-up/pull-down GPIO не ограничены |
| TYPEC0_CC1/TYPEC0_CC2 | A5/B5 | К внешнему Type-C-контроллеру HUSB311/FUSB302, не к R3588 SoC (написание источника) |

<!-- en PDF p.11; unit 43 -->

#### 2.1.2 Type-C → Type-A USB 3.1/DP

<!-- en PDF p.11; unit 44 -->

Type-C0/1 можно разделить на независимые Type-A USB3.1 и DP; схема описана в соответствующем разделе. Пример EVB2: Type-C0 — USB3.1 на lane0/1 USBDP PHY0 и DP1.4 на lane2/3; Type-C1 — USB3.1 на lane0/1 PHY1 и DP→VGA на lane2/3. Теоретически USB3.1 можно перенести на lane2/3, DP на lane0/1; в ПО адаптировать rockchip,dp-lane-mux узла usbdp_phy.

<!-- en PDF p.12; unit 45 -->

#### 2.1.3 Type-C → Type-A USB 2.0/DP

<!-- en PDF p.12; unit 46 -->

Type-C0/1 разделяются на Type-A USB2.0 и DP с четырьмя линиями. Пример RK3588 NVR DEMO: Type-C1 — USB2.0 без USBDP PHY и DP 4 x lane → HDMI2.0 через lane0/1/2/3 USBDP PHY1. См. соответствующую аппаратную схему.

<!-- en PDF p.12; unit 47 -->

#### 2.1.4 Type-C USB 2.0 Only

<!-- en PDF p.12; unit 48 -->

Type-C0/1 можно упростить до USB2.0 Only, рисунок 5: PD с внешним контроллером; USB2.0 480Mbps; без DP Alternate Mode. Это упрощает схему, но снижает максимальную скорость. Требуются существенные изменения Linux USB DTS; см. USB2-only DTS.

<!-- en PDF p.12; unit 49 -->

![Рисунок английского оригинала · PDF p.12](/docs/rockchip-rk3588-usb/assets/en-p012-figure-01.png)

<!-- en PDF p.12; unit 50 -->

Рисунок 5. Type-C USB2.0 Only.

<!-- en PDF p.13; unit 51 -->

### 2.2 Type-A

<!-- en PDF p.13; unit 52 -->

#### 2.2.1 Type-A USB 3.1

<!-- en PDF p.13; unit 53 -->

Максимум три Type-A USB3.1: преобразованный Type-C0, преобразованный Type-C1 и USB3_HOST2 + USB2.0 HOST0/1. Подробности в аппаратном разделе.

<!-- en PDF p.13; unit 54 -->

![Рисунок английского оригинала · PDF p.13](/docs/rockchip-rk3588-usb/assets/en-p013-figure-01.png)

<!-- en PDF p.13; unit 55 -->

Рисунок 6. Type-A USB3.1.

<!-- en PDF p.13; unit 56 -->

#### 2.2.2 Type-A USB 2.0

<!-- en PDF p.13; unit 57 -->

Максимум четыре Type-A USB2.0: преобразованный Type-C0, преобразованный Type-C1, USB2.0 HOST0, USB2.0 HOST1. Подробности в аппаратном разделе.

<!-- en PDF p.14; unit 58 -->

![Рисунок английского оригинала · PDF p.14](/docs/rockchip-rk3588-usb/assets/en-p014-figure-01.png)

<!-- en PDF p.14; unit 59 -->

Рисунок 7. Type-A USB2.0.

<!-- en PDF p.14; unit 60 -->

### 2.3 Micro

<!-- en PDF p.14; unit 61 -->

#### 2.3.1 Micro USB 3.1

<!-- en PDF p.14; unit 62 -->

Type-C0/1 допускают Micro USB3.1. Большая площадь разъёма на PCB делает его редким в современных продуктах. По сравнению с Type-A добавляется OTG ID: аппаратно определяется уровень и переключается Device/HOST. Подключить его к USB20_OTG_ID RK3588. Внутренняя подтяжка к 1.8V уже есть; внешняя не нужна.

<!-- en PDF p.14; unit 63 -->

![Рисунок английского оригинала · PDF p.14](/docs/rockchip-rk3588-usb/assets/en-p014-figure-02.png)

<!-- en PDF p.14; unit 64 -->

Рисунок 8. Micro USB3.1.

<!-- en PDF p.14; unit 65 -->

#### 2.3.2 Micro USB 2.0

<!-- en PDF p.14; unit 66 -->

Type-C0 допускает Micro USB2.0: схема упрощается, но максимальная скорость уменьшается.

<!-- en PDF p.15; unit 67 -->

По сравнению с Type-A USB2.0 добавляется OTG ID для аппаратного определения уровня и переключения Device/HOST. Соединить с USB20_OTG_ID RK3588. Встроенная подтяжка к 1.8V исключает необходимость внешней.

<!-- en PDF p.15; unit 68 -->

![Рисунок английского оригинала · PDF p.15](/docs/rockchip-rk3588-usb/assets/en-p015-figure-01.png)

<!-- en PDF p.15; unit 69 -->

Рисунок 9. Micro USB2.0.

<!-- en PDF p.15; unit 70 -->

## 3. Карта конфигураций USB RK3588

<!-- en PDF p.15; unit 71 -->

Пять контроллеров и семь PHY поддерживают варианты рисунка 10. Источник называет «4 конфигурации», но перечисляет Config0–4:

- Config0: Type-C0 с DP.
- Config1: USB2.0 OTG + DP 4 x Lane, Swap off.
- Config2: USB2.0 OTG + DP 4 x Lane, Swap on.
- Config3: USB3.1 OTG + DP 2 x Lane, Swap on.
- Config4: USB3.1 OTG + DP 2 x Lane, Swap off.

Для HOST0/1 и USB3_HOST2: Config0 — HOST0 + HOST1 без HOST2; Config1 — HOST0 + сочетание HOST1/HOST2; Config2 — сочетание HOST0/HOST2 + HOST1.

<!-- en PDF p.16; unit 72 -->

![Рисунок английского оригинала · PDF p.16](/docs/rockchip-rk3588-usb/assets/en-p016-figure-01.png)

<!-- en PDF p.16; unit 73 -->

Рисунок 10. USB Config Map RK3588. Подробности — USB Controller Configure Table эталонной SDK EVB-схемы. DP и четыре линии USBDP PHY поддерживают произвольное соответствие, рисунок 11, через изменение DTS. Если адаптация ПО неясна, рекомендуется использовать обычные варианты рисунка 10.

<!-- en PDF p.16; unit 74 -->

![Рисунок английского оригинала · PDF p.16](/docs/rockchip-rk3588-usb/assets/en-p016-figure-02.png)

<!-- en PDF p.16; unit 75 -->

Рисунок 11. Карта линий DP RK3588.

<!-- en PDF p.16; unit 76 -->

## 4. Аппаратные схемы USB RK3588

<!-- en PDF p.16; unit 77 -->

Раздел описывает практические аппаратные варианты. Поддерживаемые интерфейсы рисунка 12: USB20 HOST0, <!-- en PDF p.17; unit 78 --> USB20 HOST1, USB30/DP1.4 MULTI0, USB30/DP1.4 MULTI1, USB30/PCIE2.0/SATA30 MULTI2. RK3588S не имеет USB30/DP1.4 MULTI1.

<!-- en PDF p.17; unit 79 -->

![Рисунок английского оригинала · PDF p.17](/docs/rockchip-rk3588-usb/assets/en-p017-figure-01.png)

<!-- en PDF p.17; unit 80 -->

Рисунок 12. Блок-схема USB-интерфейсов RK3588.

<!-- en PDF p.17; unit 81 -->

### 4.1 Питание и потребление контроллеров USB

<!-- en PDF p.17; unit 82 -->



<!-- en PDF p.17; unit 83 -->

Контроллеры USB RK3588 питаются от VDD_LOGIC. Внутренние выделенные домены питания перечислены в таблице 7. Таблица 7. Соответствие контроллеров USB и PD.

<!-- en PDF p.18; unit 84 -->

| Контроллер USB | Домен питания |
| --- | --- |
| USB 2.0 HOST0/1 | PD_USB |
| USB 3.1 OTG0/1 | PD_USB |
| USB 3.1 HOST2 | PD_PHP |

<!-- en PDF p.18; unit 85 -->

В работе драйвер Linux динамически переключает PD по состоянию интерфейса через PM Runtime. При втором уровне ожидания ПО принудительно отключает все USB PD для минимального потребления. Если требуется сохранить рабочие регистры, драйвер должен вызвать device_init_wakeup, предотвращая отключение PD. Стратегия:

<!-- en PDF p.18; unit 86 -->

1. Неиспользуемый контроллер: DTS disabled.

<!-- en PDF p.18; unit 87 -->

2. Включённые ядром контроллеры уже имеют Auto suspend: без периферии HOST автоматически переходит в малопотребляющий suspend. Дополнительная отладка динамического питания не нужна. Отключение USB2.0 HOST0/1 в ядре:

<!-- en PDF p.18; unit 88 -->

```text
# Disable USB 2.0 HOST0
&usb_host0_ehci {
        status = "disabled";
};

&usb_host0_ohci {
        status = "disabled";
};

# Disable USB 2.0 HOST1
&usb_host1_ehci {
        status = "disabled";
};

&usb_host1_ohci {
        status = "disabled";
};
```

<!-- en PDF p.19; unit 89 -->

### 4.2 Питание и потребление USB PHY

<!-- en PDF p.19; unit 90 -->

#### 4.2.1 USB 2.0 PHY

<!-- en PDF p.19; unit 91 -->

RK3588 поддерживает четыре независимых USB2.0 PHY; у RK3588S отсутствует PHY1. Все относятся к PD_BUS (Alive) и делят три внешние линии питания, рисунок 13. Поэтому во время работы нельзя просто отключить питание или PD для экономии.

<!-- en PDF p.19; unit 92 -->

![Рисунок английского оригинала · PDF p.19](/docs/rockchip-rk3588-usb/assets/en-p019-figure-01.png)

<!-- en PDF p.19; unit 93 -->

Рисунок 13. Питание USB2.0 PHY. Выход за минимальные/максимальные напряжения может нарушить USB-соединение. Таблица 8. Требования к напряжению.

<!-- en PDF p.19; unit 94 -->

| Питание | Минимум | Нормальное | Максимум | Единица |
| --- | --- | --- | --- | --- |
| USB20_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB20_AVDD_1V8 | 1.674 | 1.8 | 1.98 | V |
| USB20_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |

<!-- en PDF p.19; unit 95 -->

Стратегия потребления USB2.0 PHY:

<!-- en PDF p.19; unit 96 -->

1. Для Maskrom USB требуется нормальное питание USB2.0 PHY.

<!-- en PDF p.19; unit 97 -->

2. При включении все PHY в Normal; U-Boot SPL переводит PHY1/PHY2/PHY3 в IDDQ, SDK уже поддерживает это. После загрузки драйвер выводит соответствующий PHY из IDDQ по требованиям приложения.

<!-- en PDF p.19; unit 98 -->

3. Неиспользуемым USB2.0 PHY задать DTS disabled; источник ссылается на таблицу 9.

<!-- en PDF p.19; unit 99 -->

4. Драйвер включённых PHY автоматически управляет потреблением. При обнаружении устройства устанавливает <!-- en PDF p.20; unit 100 --> Normal; без устройства — Suspend. Таблица 9. Потребление одного USB2.0 PHY в различных режимах.

<!-- en PDF p.20; unit 101 -->

| Питание | Чтение/запись | Динамический suspend | PHY отключён | Ожидание второго уровня | Единица |
| --- | --- | --- | --- | --- | --- |
| USB20_DVDD_0V75 | 7.1 | 2.6 | 0.05 | 0 | mA |
| USB20_AVDD_1V8 | 17.8 | 3.1 | 0.05 | 0 | mA |
| USB20_AVDD_3V3 | 3.3 | 0.05 | 0.05 | 0 | mA |

<!-- en PDF p.20; unit 102 -->

Исходные сценарии: чтение/запись — копирование с U2-диском, Normal; динамический suspend — DTS включён, периферии нет, Suspend; PHY disabled — DTS disabled, IDDQ; второй уровень ожидания — все три питания USB <!-- en PDF p.20; unit 103 --> 2.0 PHY отключены. Таблица 10. Связь USB2.0 PHY и контроллеров.

<!-- en PDF p.20; unit 104 -->

| USB 2.0 PHY | Контроллер USB |
| --- | --- |
| USB 2.0 PHY0 | USB 3.1 OTG0 |
| USB 2.0 PHY1 | USB 3.1 OTG1 |
| USB 2.0 PHY2 | USB 2.0 HOST0 |
| USB 2.0 PHY3 | USB 2.0 HOST1 |

<!-- en PDF p.20; unit 105 -->

Отключение USB2.0 PHY2/3 в ядре:

<!-- en PDF p.20; unit 106 -->

```text
&u2phy2 {
        status = "disabled";
};

&u2phy3 {
        status = "disabled";
};

&u2phy2_host {
        status = "disabled";
};

&u2phy3_host {
        status = "disabled";
};
```

<!-- en PDF p.21; unit 108 -->

#### 4.2.2 Питание и потребление USB 3.1 PHY

<!-- en PDF p.21; unit 109 -->

RK3588 поддерживает два вида USB3.1 Combo PHY:

<!-- en PDF p.21; unit 110 -->

1. USB3.1/DP Combo PHY.

<!-- en PDF p.21; unit 111 -->

2. USB3.1/SATA/PCIe Combo PHY. Таблица 11. Связь Combo PHY и USB-контроллеров.

<!-- en PDF p.21; unit 112 -->

| USB 3.1 Combo PHY | Контроллер USB |
| --- | --- |
| USB 3.1/DP Combo PHY0 | USB 3.1 OTG0 |
| USB 3.1/DP Combo PHY1 | USB 3.1 OTG1 |
| USB 3.1/SATA/PCIe Combo PHY2 | USB 3.1 HOST2 |

<!-- en PDF p.21; unit 113 -->

Их питание и управление потреблением различаются; ниже описаны отдельно.

<!-- en PDF p.21; unit 114 -->

##### 4.2.2.1 USB 3.1/DP Combo PHY

<!-- en PDF p.21; unit 115 -->

RK3588 имеет два независимых USB3.1/DP Combo PHY, у RK3588S отсутствует PHY1. Оба относятся к PD_BUS (Alive); у каждого собственные внешние контакты питания, рисунок 14.

<!-- en PDF p.22; unit 116 -->

![Рисунок английского оригинала · PDF p.22](/docs/rockchip-rk3588-usb/assets/en-p022-figure-01.png)

<!-- en PDF p.22; unit 117 -->

Рисунок 14. Питание USB3.1/DP Combo PHY RK3588. Таблица 12. Требования к напряжению.

<!-- en PDF p.22; unit 118 -->

| Питание | Минимум | Номинал | Максимум | Единица |
| --- | --- | --- | --- | --- |
| VDD_0V85/VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |

<!-- en PDF p.22; unit 119 -->

Стратегия потребления USB3.1/DP Combo PHY:

<!-- en PDF p.22; unit 120 -->

1. Для Maskrom USB требуется нормальное питание Type-C0 USBDP PHY0.

<!-- en PDF p.22; unit 121 -->

2. Неиспользуемый Type-C1 USBDP PHY1 можно не питать.

<!-- en PDF p.22; unit 122 -->

3. После включения неинициализированный USBDP PHY потребляет минимум.

<!-- en PDF p.22; unit 123 -->

4. Неиспользуемому PHY задать DTS disabled: он остаётся неинициализированным с минимальным потреблением.

<!-- en PDF p.22; unit 124 -->

5. Драйвер включённого PHY автоматически выбирает P0 при обнаружении устройства; без устройства — P3 для Type-A либо reset для Type-C. Таблица 13. Потребление USB3.1/DP Combo PHY.

<!-- en PDF p.23; unit 125 -->

Данные относятся к одному USB3.1/DP Combo PHY.

<!-- en PDF p.23; unit 126 -->

| Питание | Чтение/запись | Динамический сон[1] | Динамический сон[2] | PHY отключён | Глубокое ожидание | Единица |
| --- | --- | --- | --- | --- | --- | --- |
| VDD_0V85/VDDA_0V85 | 115.7 | 6.8 | 7.9 | 2 | 0 | mA |
| VDDH_1V8 | 29.4 | 0 | 2 | 0 | 0 | mA |

<!-- en PDF p.23; unit 127 -->

Исходные сценарии: чтение/запись — U3-диск, P0; динамический сон [1] — Type-C без периферии, reset; сон [2] — Type-A без периферии, P3; disabled — неинициализированный PHY, минимальное потребление; глубокое ожидание — оба питания отключены. Отключение USBDP PHY1 в ядре:

<!-- en PDF p.23; unit 128 -->

```text
&usbdp_phy1 {
        status = "disabled";
};

&usbdp_phy1_dp {
        status = "disabled";
};

&usbdp_phy1_u3 {
        status = "disabled";
};
```

<!-- en PDF p.23; unit 129 -->

##### 4.2.2.2 USB 3.1/SATA/PCIe Combo PHY

<!-- en PDF p.23; unit 130 -->

RK3588 имеет один USB3.1/SATA/PCIe Combo PHY. Внутри он относится к PD_BUS (Alive), снаружи имеет независимое питание, рисунок 15.

<!-- en PDF p.24; unit 131 -->

![Рисунок английского оригинала · PDF p.24](/docs/rockchip-rk3588-usb/assets/en-p024-figure-01.png)

<!-- en PDF p.24; unit 132 -->

Рисунок 15. Питание USB3.1/SATA/PCIe Combo PHY. Таблица 14. Требования к напряжению.

<!-- en PDF p.24; unit 133 -->

| Питание | Минимум | Нормальное | Максимум | Единица |
| --- | --- | --- | --- | --- |
| AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |

<!-- en PDF p.24; unit 134 -->

Стратегия потребления USB3.1/SATA/PCIe Combo PHY:

<!-- en PDF p.24; unit 135 -->

1. При включении PHY по умолчанию работает. U-Boot SPL переводит его в reset с минимальным потреблением. После входа в ядро драйвер USB снимает reset вызовом rockchip_combphy_init().

<!-- en PDF p.24; unit 136 -->

2. В USB-режиме аппаратный контроллер автоматически управляет PIPE P0/P1/P2/P3 в зависимости от работы. Без USB-устройства PIPE в P3; при подключении U3-диска — P0. Если подключён U3 HUB без периферии на нижних портах, PIPE автоматически переходит в P3 для экономии; подключение периферии к HUB возвращает P0. P0 — нормальная работа, P3 — минимальное потребление.

<!-- en PDF p.24; unit 137 -->

3. Если USB3.1 HOST2 не используется, соответствующий Combo PHY можно не питать.

<!-- en PDF p.24; unit 138 -->

4. При питании, но неиспользовании PHY задать DTS disabled: reset и минимальное потребление. Таблица 15. Потребление USB3.1/SATA/PCIe Combo PHY.

<!-- en PDF p.24; unit 139 -->

| Питание | Чтение/запись | Динамический сон | PHY отключён | Ожидание второго уровня | Единица |
| --- | --- | --- | --- | --- | --- |
| AVDD_0V85 | 43.4 | 43.3 | 0.4 | 0 | mA |
| AVDD_1V8 | 4.3 | 4.1 | 0.2 | 0 | mA |

<!-- en PDF p.25; unit 140 -->

Исходные сценарии: чтение/запись — U3-диск, P0; динамический сон — DTS включён, нет периферии, P3; disabled — DTS disabled, reset; второй уровень ожидания — оба питания выключены. Отключение Combo PHY в ядре:

<!-- en PDF p.25; unit 141 -->

```text
&combphy2_psu {
        status = "disabled";
};
```

<!-- en PDF p.25; unit 142 -->

### 4.3 Аппаратные схемы USB

<!-- en PDF p.25; unit 143 -->

#### 4.3.1 TYPEC0_USB20_VBUSDET

<!-- en PDF p.25; unit 144 -->

TYPEC0_USB20_VBUSDET определяет подключение и отключение в Device. Для Type-C0 с PD и внешним FUSB302/HUSB311 использовать схему EVB1: постоянная подтяжка VBUSDET к VCC_3V3_S0, обнаружение через CC контроллера. Для схем без внешнего контроллера (Type-C0 USB2-only, Type-A USB3.1, Micro USB2.0/3.1) использовать традиционный делитель к VBUS разъёма, не постоянное питание. HOST требует независимого GPIO/PMIC-управления VBUS, не общего с другими HOST. Высокий уровень входа должен быть [0.9V ~ 3.3V].

<!-- en PDF p.25; unit 145 -->

#### 4.3.2 Maskrom USB

<!-- en PDF p.25; unit 146 -->

Maskrom RK3588 всегда загружает прошивку через Type-C0 USB2.0. Схема на рисунке 16; требования: TYPEC0_USB20_VBUSDET должен иметь внешнюю подтяжку, не быть неподключённым; питание TypeC0 USBDP PHY — TYPEC0_DP0_VDD_0V85/TYPEC0_DP0_VDDA_0V85/TYPEC0_DP0_VDDH_1V8 — и внешний опорный <!-- en PDF p.26; unit 147 --> резистор TYPEC0_DP0_REXT должны быть подключены корректно. После входа в систему ПО переводит TypeC0 USBDP PHY на низкое потребление.

<!-- en PDF p.26; unit 148 -->

![Рисунок английского оригинала · PDF p.26](/docs/rockchip-rk3588-usb/assets/en-p026-figure-01.png)

<!-- en PDF p.26; unit 149 -->

Рисунок 16. Порт Maskrom USB2 для загрузки прошивки RK3588.

<!-- en PDF p.26; unit 150 -->

#### 4.3.3 Полнофункциональная схема Type-C USB3.1/DP

<!-- en PDF p.26; unit 151 -->

Применяется к Type-C0 и Type-C1; пример — RK3588 EVB1 Type-C0.

<!-- en PDF p.26; unit 152 -->

1. Соединение всех контактов Type-C0 с разъёмом см. в таблице 5 раздела полнофункционального интерфейса (номер сохранён из источника).

<!-- en PDF p.26; unit 153 -->

2. Нужен внешний Type-C-контроллер для определения ориентации и высоковольтного/высокотокового PD. Поддерживается большинство распространённых чипов; см. список.

<!-- en PDF p.26; unit 154 -->

3. Для высоковольтной зарядки и меньшего аппаратного риска VBUSDET не подключать к Type-C VBUS, а постоянно подтянуть к <!-- en PDF p.26; unit 155 --> 3.3V, то есть VCC_3V3_S0 на рисунке 17. Нельзя оставлять неподключённым.

<!-- en PDF p.26; unit 156 -->

4. TYPEC0_USB20_OTG_ID применяется только в Micro OTG; для Type-C оставить неподключённым.

<!-- en PDF p.26; unit 157 -->

5. TYPEC0_SBU1/TYPEC0_SBU2 используются только для AUX в DP Alternate Mode. По требованиям <!-- en PDF p.27; unit 158 --> AUX уровни подтяжки зависят от ориентации Type-C. В RK3588 это не автоматизировано, поэтому нужны два внешних GPIO, TYPEC0_SBU1_DC/TYPEC0_SBU2_DC на рисунке 19. Можно выбрать любые GPIO, их исходные подтяжки не ограничены. В ПО адаптировать sbu1-dc-gpios и sbu2-dc-gpios узла usbdp_phy.

<!-- en PDF p.27; unit 159 -->

6. DTS см. в разделе полнофункционального Type-C USB3.1/DP.

<!-- en PDF p.27; unit 160 -->

![Рисунок английского оригинала · PDF p.27](/docs/rockchip-rk3588-usb/assets/en-p027-figure-01.png)

<!-- en PDF p.27; unit 161 -->

Рисунок 17. Type-C0 RK3588.

<!-- en PDF p.27; unit 162 -->

![Рисунок английского оригинала · PDF p.27](/docs/rockchip-rk3588-usb/assets/en-p027-figure-02.png)

<!-- en PDF p.27; unit 163 -->

Рисунок 18. PD-контроллер и управление VBUS Type-C0.

<!-- en PDF p.28; unit 164 -->

![Рисунок английского оригинала · PDF p.28](/docs/rockchip-rk3588-usb/assets/en-p028-figure-01.png)

<!-- en PDF p.28; unit 165 -->

Рисунок 19. Интерфейс Type-C0.

<!-- en PDF p.28; unit 166 -->

#### 4.3.4 Type-C → Type-A USB3.1/DP

<!-- en PDF p.28; unit 167 -->

Type-C0/1 разделяются на независимые Type-A USB3.1 и DP с двумя линиями. Пример EVB2 Type-C0.

<!-- en PDF p.28; unit 168 -->

1. USB3.1 использует TYPEC0_SSRX1P/N и TYPEC0_SSTX1P/N (lane0/1 USBDP PHY); DP — DP0_TX2P/N и DP0_TX3P/N (lane2/3).

<!-- en PDF p.28; unit 169 -->

2. При Device/HOST рекомендуется подключить TYPEC0_OTG_VBUSDET к VBUS Type-A через 30KΩ.

<!-- en PDF p.28; unit 170 -->

3. VBUS Type-A VCC5V0_USB30_HOST2 управляется GPIO: Device выключает выход, HOST включает. Ток SY6280AAC задаётся резистором OCB: Ilim(A) = 6800/Rset(ohm). На рисунке 21 предел 1A.

<!-- en PDF p.28; unit 171 -->

4. См. соответствующий DTS. Теоретически USB3.1 можно назначить lane2/3, DP lane0/1; тогда адаптировать rockchip,dp-lane-mux в usbdp_phy.

<!-- en PDF p.29; unit 172 -->

![Рисунок английского оригинала · PDF p.29](/docs/rockchip-rk3588-usb/assets/en-p029-figure-01.png)

<!-- en PDF p.29; unit 173 -->

Рисунок 20. Type-A USB3.1/DP RK3588.

<!-- en PDF p.29; unit 174 -->

![Рисунок английского оригинала · PDF p.29](/docs/rockchip-rk3588-usb/assets/en-p029-figure-02.png)

<!-- en PDF p.29; unit 175 -->

Рисунок 21. Интерфейс Type-A USB3.1/DP.

<!-- en PDF p.30; unit 176 -->

#### 4.3.5 Type-C → Type-A USB2.0/DP

<!-- en PDF p.30; unit 177 -->

Type-C0/1 разделяются на USB2.0 и DP с четырьмя линиями. Пример — Type-C1 платы RK3588 NVR Demo.

<!-- en PDF p.30; unit 178 -->

1. Все четыре линии TYPEC1 USBDP PHY отданы DP; USB этот PHY не использует.

<!-- en PDF p.30; unit 179 -->

2. При USB HOST-only TYPEC1_USB20_OTG_ID и TYPEC1_USB20_VBUSDET могут оставаться неподключёнными.

<!-- en PDF p.30; unit 180 -->

3. VBUS VCC5V0_USB20_HOST управляется GPIO, включается в HOST. SY6280AAC ограничивается резистором OCB: Ilim(A) = 6800/Rset(ohm), на рисунке 23 предел 1.45A.

<!-- en PDF p.30; unit 181 -->

4. DTS см. в разделе Type-C → Type-A USB2.0/DP.

<!-- en PDF p.30; unit 182 -->

![Рисунок английского оригинала · PDF p.30](/docs/rockchip-rk3588-usb/assets/en-p030-figure-01.png)

<!-- en PDF p.30; unit 183 -->

Рисунок 22. Type-A USB2.0/DP RK3588.

<!-- en PDF p.31; unit 184 -->

![Рисунок английского оригинала · PDF p.31](/docs/rockchip-rk3588-usb/assets/en-p031-figure-01.png)

<!-- en PDF p.31; unit 185 -->

Рисунок 23. Type-A USB2/DP → HDMI.

<!-- en PDF p.31; unit 186 -->

#### 4.3.6 Type-A USB3.1

<!-- en PDF p.31; unit 187 -->

Применяется к Type-C0, Type-C1 и USB3.1 HOST2. Первые два описаны в разделе USB3.1/DP; здесь рассматривается HOST2. Как указано ранее, USB3.1 HOST_2 (USB30_2) не имеет USB2.0 PHY, поэтому должен сочетаться с USB2.0 HOST0/1 для полного USB3.1. Пример — EVB2 USB30_2 HOST.

<!-- en PDF p.31; unit 188 -->

1. HOST2 сочетается с USB2.0 HOST1.

<!-- en PDF p.31; unit 189 -->

2. Конструкция чипа допускает сочетание HOST2 с USB2.0 Type-C0/1. Но Type-C0/1 могут требоваться как Device, а Device и Host у USB3.1 OTG одновременно не работают[2]. Для упрощения аппаратуры и ПО рекомендуется сочетать HOST2 только с USB <!-- en PDF p.31; unit 190 --> 2.0 HOST0/1.

<!-- en PDF p.31; unit 191 -->

3. DTS см. Type-A USB3.1.

<!-- en PDF p.32; unit 192 -->

![Рисунок английского оригинала · PDF p.32](/docs/rockchip-rk3588-usb/assets/en-p032-figure-01.png)

<!-- en PDF p.32; unit 193 -->

Рисунок 24. Схема USB3.1 HOST2.

<!-- en PDF p.32; unit 194 -->

![Рисунок английского оригинала · PDF p.32](/docs/rockchip-rk3588-usb/assets/en-p032-figure-02.png)

<!-- en PDF p.32; unit 195 -->

Рисунок 25. Интерфейс USB3.1 HOST2.

<!-- en PDF p.32; unit 196 -->

#### 4.3.7 Type-A USB2.0

<!-- en PDF p.32; unit 197 -->

Применяется к USB2.0 HOST0/1; пример — EVB1.

<!-- en PDF p.32; unit 198 -->

1. HOST0/1 совместно используют VBUS VCC5V0_USB20_HOST. GPIO управляет выходом SY6280AAC; ток задаётся резистором OCB: Ilim(A)=6800/Rset(ohm). На рисунке 26 ограничение 1.45A.

<!-- en PDF p.32; unit 199 -->

2. DTS см. Type-A USB2.0.

<!-- en PDF p.33; unit 200 -->

![Рисунок английского оригинала · PDF p.33](/docs/rockchip-rk3588-usb/assets/en-p033-figure-01.png)

<!-- en PDF p.33; unit 201 -->

Рисунок 26. Схема Type-A USB2.0 HOST.

<!-- en PDF p.33; unit 202 -->

## 5. DTS USB RK3588

<!-- en PDF p.33; unit 203 -->

DTS включает чиповые DTSI контроллера/PHY и DTS платы. Подробности в документации ядра:

<!-- en PDF p.33; unit 204 -->

1. `kernel/Documentation/devicetree/bindings/usb/snps,dwc3.yaml`

<!-- en PDF p.33; unit 205 -->

2. `kernel/Documentation/devicetree/bindings/usb/generic-ohci.yaml`

<!-- en PDF p.33; unit 206 -->

3. `kernel/Documentation/devicetree/bindings/usb/generic-ehci.yaml`

<!-- en PDF p.33; unit 207 -->

4. `kernel/Documentation/devicetree/bindings/connector/usb-connector.yaml`

<!-- en PDF p.33; unit 208 -->

5. `kernel/Documentation/devicetree/bindings/phy/phy-rockchip-inno-usb2.yaml`

<!-- en PDF p.33; unit 209 -->

6. `kernel/Documentation/devicetree/bindings/phy/phy-rockchip-usbdp.yaml`

<!-- en PDF p.33; unit 210 -->

7. `kernel/Documentation/devicetree/bindings/phy/phy/phy-rockchip-naneng-combphy.txt` (исходный путь).

<!-- en PDF p.33; unit 211 -->

### 5.1 DTSI USB уровня чипа

<!-- en PDF p.33; unit 212 -->

Основные узлы контроллеров/PHY приведены ниже. Они описывают общие ресурсы и свойства, поэтому изменять их разработчикам не рекомендуется.

<!-- en PDF p.34; unit 213 -->

Исходник относит USB3.1 OTG0, USB2.0 HOST0/1 и USB3.1 HOST2 к rk3588s-evb.dtsi, OTG1 — к rk3588-evb.dts, но далее даёт полные чиповые пути `arch/arm64/boot/dts/rockchip/rk3588s.dtsi` и `arch/arm64/boot/dts/rockchip/rk3588.dtsi`; различие имён сохранено. Все контроллеры и PHY в rk3588s-evb.dtsi/rk3588-evb.dtsi имеют status="okay". Если DTS платы включает эти EVB-файлы, достаточно переопределить неиспользуемые USB-узлы как disabled. Таблица 16 сопоставляет интерфейсы и DTS-узлы.

<!-- en PDF p.34; unit 214 -->

| Интерфейс USB (схема) | DTS-узел контроллера USB | DTS-узел USB PHY |
| --- | --- | --- |
| TYPEC0 | usbdrd3_0<br>usbdrd_dwc3_0 | u2phy0<br>u2phy0_otg<br>usbdp_phy0<br>usbdp_phy0_u3 |
| TYPEC1 | usbdrd3_1<br>usbdrd_dwc3_1 | u2phy1<br>u2phy1_otg<br>usbdp_phy1<br>usbdp_phy1_u3 |
| USB20_HOST0 | usb_host0_ehci<br>usb_host0_ohci | u2phy2<br>u2phy2_host |
| USB20_HOST1 | usb_host1_ehci<br>usb_host1_ohci | u2phy3<br>u2phy3_host |
| USB30_2 | usbhost3_0<br>usbhost_dwc3_0 | combphy2_psu |

<!-- en PDF p.34; unit 215 -->

DTSI-узлы USB-контроллеров:

<!-- en PDF p.34; unit 216 -->

```text
#USB3.1 OTG0 Controller
usbdrd3_0: usbdrd3_0 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_0: usb@fc000000 {
                compatible = "snps,dwc3";
                ......
        };
};
#USB2.0 HOST0 Controller
usb_host0_ehci: usb@fc800000 {
        compatible = "generic-ehci";
        ......
};

usb_host0_ohci: usb@fc840000 {
        compatible = "generic-ohci";
        ......
};

#USB2.0 HOST1 Controller
usb_host1_ehci: usb@fc880000 {
        compatible = "generic-ehci";
        ......
};

usb_host1_ohci: usb@fc8c0000 {
        compatible = "generic-ohci";
        ......
};

#USB3.1 HOST2 Controller
usbhost3_0: usbhost3_0 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbhost_dwc3_0: usb@fcd00000 {
                compatible = "snps,dwc3";
                ......
        };
};

#USB3.1 OTG1 Controller
usbdrd3_1: usbdrd3_1 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_1: usb@fc400000 {
                compatible = "snps,dwc3";
                ......
        };
};
```

<!-- en PDF p.35; unit 218 -->

DTSI-узлы PHY. Контроллеры и PHY следует настраивать попарно. Внутренние связи — рисунок 1 и таблица 16; phys контроллера связывает соответствующий PHY.

<!-- en PDF p.35; unit 219 -->

```text
#USB2.0 PHY0
usb2phy0_grf: syscon@fd5d0000 {
                compatible = "rockchip,rk3588-usb2phy-grf", "syscon",
                             "simple-mfd";
                ......
                u2phy0: usb2-phy@0 {
                        compatible = "rockchip,rk3588-usb2phy";
                        ......
                        u2phy0_otg: otg-port {
                                #phy-cells = <0>;
                                status = "disabled";
                        };
                };
        };

#USB2.0 PHY1
usb2phy1_grf: syscon@fd5d4000 {
    ......
};

#USB2.0 PHY2
usb2phy2_grf: syscon@fd5d8000 {
    ......
};

#USB2.0 PHY3
usb2phy3_grf: syscon@fd5dc000 {
    ......
};

#USB3.1/DP Combo PHY0
usbdp_phy0: phy@fed80000 {
        compatible = "rockchip,rk3588-usbdp-phy";
        ......
        usbdp_phy0_dp: dp-port {
                #phy-cells = <0>;
                status = "disabled";
        };

        usbdp_phy0_u3: u3-port {
                #phy-cells = <0>;
                status = "disabled";
        };
};

#USB3.1/DP Combo PHY1
usbdp_phy1: phy@fed90000 {
    ......
};

#USB3.1/SATA/PCIe PHY2
combphy2_psu: phy@fee20000 {
        compatible = "rockchip,rk3588-naneng-combphy";
        ......
};
```

<!-- en PDF p.37; unit 221 -->

### 5.2 Полнофункциональный Type-C USB3.1/DP DTS

<!-- en PDF p.37; unit 222 -->

См. Type-C0 в `arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi`.

<!-- en PDF p.37; unit 223 -->

```text
#USB2.0 PHY configuration attribute "rockchip,typec-vbus-det", indicating support for
hardware design where Type-C VBUS_DET is always pulled high
&u2phy0_otg {
        rockchip,typec-vbus-det;
};

#USB3.1/DP PHY0, configure properties "sbu1-dc-gpios" and "sbu2-dc-gpios" according to
hardware design
&usbdp_phy0 {
        orientation-switch;
        svid = <0xff01>;
        sbu1-dc-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_HIGH>;
        sbu2-dc-gpios = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;

        port {
                #address-cells = <1>;
                #size-cells = <0>;
                usbdp_phy0_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };

                usbdp_phy0_dp_altmode_mux: endpoint@1 {
                        reg = <1>;
                        remote-endpoint = <&dp_altmode_mux>;
                };
        };
};

#USB3.1 OTG0 Controller
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        usb-role-switch;
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_0_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#VBUS GPIO configuration, controlled by the Type-C controller chip driver
vbus5v0_typec: vbus5v0-typec {
        compatible = "regulator-fixed";
        regulator-name = "vbus5v0_typec";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PD0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&typec5v_pwren>;
};

#Configure external Type-C controller chip FUSB302
#Configure properties "I2C/interrupts/vbus-supply/usb_con" according to actual hardware
design
&i2c2 {
        status = "okay";
        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                interrupt-parent = <&gpio3>;
                interrupts = <RK_PB4 IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
                pinctrl-0 = <&usbc0_int>;
                vbus-supply = <&vbus5v0_typec>;
                status = "okay";

                ports {
                        #address-cells = <1>;
                        #size-cells = <0>;

                        port@0 {
                                reg = <0>;
                                usbc0_role_sw: endpoint@0 {
                                        remote-endpoint = <&dwc3_0_role_switch>;
                                };
                        };
                };

                usb_con: connector {
                        compatible = "usb-c-connector";
                        label = "USB-C";
                        data-role = "dual";
                        power-role = "dual";
                        try-power-role = "sink";
                        op-sink-microwatt = <1000000>;
                        sink-pdos =
                                <PDO_FIXED(5000, 1000, PDO_FIXED_USB_COMM)>;
                        source-pdos =
                                <PDO_FIXED(5000, 3000, PDO_FIXED_USB_COMM)>;

                        altmodes {
                                #address-cells = <1>;
                                #size-cells = <0>;

                                altmode@0 {
                                        reg = <0>;
                                        svid = <0xff01>;
                                        vdo = <0xffffffff>;
                                };
                        };

                        ports {
                            ......
                        };
                };
        };
};
```

<!-- en PDF p.39; unit 226 -->

Примечание: при замене FUSB302 на HUSB311 достаточно следующих изменений DTS на основе FUSB302.

<!-- en PDF p.39; unit 227 -->

```text
#Configure external Type-C controller chip HUSB311
&i2c2 {
        usbc0: husb311@4e {
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                ......
        };
};
```

<!-- en PDF p.39; unit 228 -->

### 5.3 DTS Type-C → Type-A USB3.1/DP

<!-- en PDF p.39; unit 229 -->

См. Type-C0 в `arch/arm64/boot/dts/rockchip/rk3588-evb2-lp4.dtsi`.

<!-- en PDF p.39; unit 230 -->

```text
#Configure the "phy-supply" property for USB2.0 PHY0 to control the 5V VBUS output
#Note: Using phy-supply does not allow for dynamic switching of VBUS. If the OTG exclusively
uses a GPIO and does not share it with other HOSTs, and if OTG needs to support both
Device/HOST, it should be configured as "vbus-supply = <&vcc5v0_otg>" to achieve dynamic
VBUS switching.
&u2phy0_otg {
        phy-supply = <&vcc5v0_host>;
};

#Configure the VBUS GPIO, which is controlled by the USB2.0 PHY driver
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PA1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#USB3.1/DP PHY0, only need to configure DP to use lane2/3, the driver will automatically
allocate lane0/1 for USB3.1 Rx/Tx
#If the hardware design uses DP on lane0/1, this should be configured as "rockchip,dp-lane-
mux = <0 1>"
#Note: In actual circuitry, even if DP is not supported, "rockchip,dp-lane-mux" must be
configured, otherwise the USBDP PHY driver cannot automatically allocate lanes to USB3.1
&usbdp_phy0 {
        rockchip,dp-lane-mux = <2 3>;
};

#USB3.1 OTG0 Controller
#Set "dr_mode" to "otg" and configure the "extcon" property to support software switching
between Device/Host modes
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        extcon = <&u2phy0>;
        status = "okay";
};
```

<!-- en PDF p.40; unit 232 -->

### 5.4 DTS Type-C → Type-A USB2.0/DP

<!-- en PDF p.40; unit 233 -->

См. Type-C1 в `arch/arm64/boot/dts/rockchip/rk3588-nvr-demo.dtsi`.

<!-- en PDF p.40; unit 234 -->

```text
#Configure the "phy-supply" property for USB2.0 PHY1 to control the 5V VBUS output
&u2phy1_otg {
        phy-supply = <&vcc5v0_host>;
        status = "okay";
};

#Configure the VBUS GPIO, controlled by the USB2.0 PHY driver
vcc5v0_host: vcc5v0-host-regulator {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_sys>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};
#USB3.1/DP PHY1, configure DP to use lanes 0/1/2/3
#Adjust the "rockchip,dp-lane-mux" property according to the actual hardware design
#Set the "maximum-speed" property to inform the USBDP driver to limit USB to USB2.0 only
&usbdp_phy1 {
        maximum-speed = "high-speed";
        rockchip,dp-lane-mux = < 0 1 2 3 >;
        status = "okay";
};

&usbdp_phy1_dp {
        status = "okay";
};

&usbdp_phy1_u3 {
        status = "okay";
};

#Set the "maximum-speed" property to inform the DWC3 driver to limit USB to USB2.0 only
&usbdrd_dwc3_1 {
        dr_mode = "host";
        maximum-speed = "high-speed";
        status = "okay";
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
};
```

<!-- en PDF p.41; unit 236 -->

### 5.5 Type-C USB2.0 only DTS

<!-- en PDF p.41; unit 237 -->

Вариант 1: внешний Type-C-контроллер, PD. См. Type-C0 USB2.0 OTG в `arch/arm64/boot/dts/rockchip/rk3588s-tablet-rk806-single.dtsi`.

<!-- en PDF p.41; unit 238 -->

```text
#USB2.0 PHY0 registers typec orientation switch, used to interact with the TCPM subsystem,
to obtain USB hot-plug information
&u2phy0 {
        orientation-switch;
        status = "okay";

        port {
                #address-cells = <1>;
                #size-cells = <0>;
                u2phy0_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };
        };
};

#USB2.0 PHY0 OTG configuration
#Configure attribute "rockchip,sel-pipe-phystatus", indicating the selection of GRF control
pipe phystatus, replacing the control of USBDP PHY
#Configure attribute "rockchip,typec-vbus-det", indicating support for Type-C VBUS_DET
hardware design with a constant pull-up
#Configure attribute "rockchip,dis-u2-susphy", indicating the disabling of USB2 PHY driver's
dynamic entry into suspend mode
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,typec-vbus-det;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#Disable all related nodes of USBDP PHY0, keeping USBDP PHY0 in an uninitialized state to
achieve the lowest power consumption
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
};

&dp0 {
        status = "disabled";
};

&usbdrd3_0 {
        status = "okay";
}

#Configure USB3.1 OTG0 Controller
#Configure "phys = <&u2phy0_otg>", i.e., not referencing USBDP PHY
#Configure maximum-speed = "high-speed", notifying the DWC3 driver to restrict USB to USB2.0
only
#Configure "snps,dis_u2_susphy_quirk", disabling the controller's hardware suspend usb2 phy
function, improving USB communication stability
#Configure "snps,usb2-lpm-disable", disabling the controller's Host mode LPM function,
improving USB peripheral compatibility
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        status = "okay";

        maximum-speed = "high-speed";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        usb-role-switch;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_0_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#Configure external Type-C controller chip FUSB302
#Need to configure "I2C/interrupts/vbus-supply/usb_con" properties according to the actual
hardware design
#Need to configure the property remote-endpoint = <&u2phy0_orientation_switch> for
usbc0_orien_sw
&i2c8 {
        status = "okay";
        pinctrl-names = "default";
        pinctrl-0 = <&i2c8m2_xfer>;

        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                interrupt-parent = <&gpio0>;
                interrupts = <RK_PC4 IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
                pinctrl-0 = <&usbc0_int>;
                vbus-supply = <&vbus5v0_typec>;
                status = "okay";

                ports {
                        #address-cells = <1>;
                        #size-cells = <0>;

                        port@0 {
                                reg = <0>;
                                usbc0_role_sw: endpoint@0 {
                                        remote-endpoint = <&dwc3_0_role_switch>;
                                };
                        };
                };

                usb_con: connector {
                        compatible = "usb-c-connector";
                        label = "USB-C";
                        data-role = "dual";
                        power-role = "dual";
                        ......
                        ports {
                                #address-cells = <1>;
                                #size-cells = <0>;

                                port@0 {
                                        reg = <0>;
                                        usbc0_orien_sw: endpoint {
                                                remote-endpoint =
<&u2phy0_orientation_switch>;
                                        };
                                };
                        };

                };
        };
```

<!-- en PDF p.44; unit 242 -->

Вариант 2: без внешнего контроллера, только Device. См. Type-C0 USB2.0 Device в `arch/arm64/boot/dts/rockchip/rk3588-evb5-lp4.dtsi`.

<!-- en PDF p.44; unit 243 -->

```text
#USB2.0 PHY0 OTG configuration
#Configure attribute "rockchip,sel-pipe-phystatus", indicating the selection of GRF control
pipe phystatus, replacing the control of USBDP PHY
#Configure attribute "rockchip,dis-u2-susphy", indicating the disabling of USB2 PHY driver's
dynamic entry into suspend mode
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#Disable all related nodes of USBDP PHY0, keeping USBDP PHY0 in an uninitialized state to
achieve the lowest power consumption
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
}

#Configure USB3.1 OTG0 Controller
#Configure dr_mode = "peripheral", notifying the DWC3 driver to initialize in Device only
mode
#Configure "phys = <&u2phy0_otg>", i.e., not referencing USBDP PHY
#Configure maximum-speed = "high-speed", notifying the DWC3 driver to restrict USB to USB2.0
only
&usbdrd_dwc3_0 {
        dr_mode = "peripheral";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
};
```

<!-- en PDF p.45; unit 245 -->

Вариант 3: без внешнего Type-C-контроллера, OTG; нужна схема преобразования CC в ID.

<!-- en PDF p.45; unit 246 -->

```text
#USB2.0 PHY0 OTG configuration
#Configure attribute "rockchip,sel-pipe-phystatus", indicating the selection of GRF control
pipe phystatus, replacing the control of USBDP PHY
#Configure attribute "rockchip,dis-u2-susphy", indicating the disabling of USB2 PHY driver's
dynamic entry into suspend mode
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#Disable all related nodes of USBDP PHY0, keeping USBDP PHY0 in an uninitialized state to
achieve the lowest power consumption
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
}

#Configure USB3.1 OTG0 Controller
#Configure dr_mode = "otg"
#Configure "phys = <&u2phy0_otg>", i.e., not referencing USBDP PHY
#Configure maximum-speed = "high-speed", notifying the DWC3 driver to restrict USB to USB2.0
only
#Configure "extcon" attribute, to support automatic switching between Device/Host mode
#Configure "snps,dis_u2_susphy_quirk", disabling the controller's hardware suspend usb2 phy
function, improving USB communication stability
#Configure "snps,usb2-lpm-disable", disabling the controller's Host mode LPM function,
improving USB peripheral compatibility
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        extcon = <&u2phy0>;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
};
```

<!-- en PDF p.46; unit 247 -->

### 5.6 Type-A USB3.1 DTS

<!-- en PDF p.46; unit 248 -->

См. USB30_2 HOST в `arch/arm64/boot/dts/rockchip/rk3588-evb2-lp4.dtsi`.

<!-- en PDF p.46; unit 249 -->

```text
#USB2.0 PHY3 configuration for "phy-supply" attribute, used to control the VBUS output of 5V
&u2phy3_host {
        phy-supply = <&vcc5v0_host>;
}

#VBUS GPIO configuration, controlled by this GPIO in the USB2.0 PHY driver
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PA1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#Enable USB3.1/SATA/PCIe Combo PHY
&combphy2_psu {
        status = "okay";
};

#Configure USB3.1 HOST2 Controller
&usbhost3_0 {
        status = "okay";
};

&usbhost_dwc3_0 {
        dr_mode = "host";
        status = "okay";
};
```

<!-- en PDF p.46; unit 250 -->

### 5.7 Type-A USB2.0 DTS

<!-- en PDF p.46; unit 251 -->

См. HOST0/1 в `arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi`.

<!-- en PDF p.46; unit 252 -->

```text
#USB2.0 PHY2/3 configuration for "phy-supply" attribute, used to control 5V VBUS output
&u2phy2_host {
        phy-supply = <&vcc5v0_host>;
};
&u2phy3_host {
        phy-supply = <&vcc5v0_host>;
};

#VBUS GPIO configuration, controlled by this GPIO in the USB2.0 PHY driver
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#USB2.0 HOST0/1 Controller
&usb_host0_ehci {
        status = "okay";
};

&usb_host0_ohci {
        status = "okay";
};

&usb_host1_ehci {
        status = "okay";
};

&usb_host1_ohci {
        status = "okay";
};
```

<!-- en PDF p.47; unit 254 -->

### 5.8 Micro USB DTS

<!-- en PDF p.47; unit 255 -->

OTG RK3588 поддерживает Micro USB2.0. На примере `arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi` удалить следующие узлы/свойства:

<!-- en PDF p.47; unit 256 -->

1. usbc0 и все его дочерние узлы.

<!-- en PDF p.47; unit 257 -->

2. orientation-switch и дочерний port в usbdp_phy0.

<!-- en PDF p.47; unit 258 -->

3. usb-role-switch и дочерний port в usbdrd_dwc3_0.

<!-- en PDF p.47; unit 259 -->

4. rockchip,typec-vbus-det в u2phy0_otg.

<!-- en PDF p.47; unit 260 -->

5. usb-typec в pinctrl. Затем добавить:

<!-- en PDF p.48; unit 261 -->

1. vcc5v0_otg для управления VBUS.

<!-- en PDF p.48; unit 262 -->

2. vbus-supply в u2phy0_otg.

<!-- en PDF p.48; unit 263 -->

3. `extcon = <&u2phy0>;` в usbdrd_dwc3_0.

<!-- en PDF p.48; unit 264 -->

```text
[...]
# VBUS GPIO Configuration, control this GPIO in the USB2.0 PHY driver
vcc5v0_otg: vcc5v0-otg {
    compatible = "regulator-fixed";
    regulator-name = "vcc5v0_otg";
    regulator-min-microvolt = <5000000>;
    regulator-max-microvolt = <5000000>;
    enable-active-high;
    gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
    vin-supply = <&vcc5v0_sys>;
    pinctrl-names = "default";
    pinctrl-0 = <&vcc5v0_otg_en>;
};

&pinctrl {
    usb {
        [...]
        vcc5v0_otg_en: vcc5v0-otg-en {
            rockchip,pins = <4 RK_PA7 RK_FUNC_GPIO &pcfg_pull_up>;
        };
    };
};

[...]

# Configure status according to the actual design. If neither USB3 nor DP is used, it is
recommended to close all related nodes of USBDP PHY0 to reduce power consumption
&usbdp_phy0 {
    maximum-speed = "high-speed";
    status = "okay";
};

&usbdp_phy0_dp {
    status = "okay";
};

&usbdp_phy0_u3 {
    status = "okay";
};

&u2phy0 {
    status = "okay";
};

&u2phy0_otg {
    vbus-supply = <&vcc5v0_otg>;
    rockchip,sel-pipe-phystatus;
    rockchip,dis-u2-susphy;
    status = "okay";
};

&usbdrd_dwc3_0 {
    status = "okay";
    dr_mode = "otg";
    maximum-speed = "high-speed";
    extcon = <&u2phy0>;
    snps,dis_u2_susphy_quirk;
    snps,usb2-lpm-disable;
};
```

<!-- en PDF p.49; unit 266 -->

### 5.9 Замечания к Linux USB DT

<!-- en PDF p.49; unit 267 -->

#### 5.9.1 Важные свойства USB DT

<!-- en PDF p.49; unit 268 -->

##### 5.9.1.1 Контроллер USB

<!-- en PDF p.49; unit 269 -->

1. usb-role-switch используется только стандартным Type-C с PD-контроллером; dr_mode обязательно otg. При другом dr_mode это свойство не задавать.

<!-- en PDF p.49; unit 270 -->

2. extcon динамически переключает OTG в схемах нестандартного Type-C (формулировка оригинала упоминает PD-контроллер), например Micro или Type-A, когда контроллер настроен в otg.

<!-- en PDF p.49; unit 271 -->

3. snps,dis_u2_susphy_quirk отключает аппаратный автоматический suspend USB2 PHY контроллером. Применяется прежде всего в USB2-only для устойчивости связи.

<!-- en PDF p.49; unit 272 -->

4. snps,usb2-lpm-disable отключает LPM контроллера в Host, прежде всего для совместимости периферии USB2-only.

<!-- en PDF p.49; unit 273 -->

##### 5.9.1.2 USB2 PHY

<!-- en PDF p.49; unit 274 -->

1. vbus-supply и phy-supply управляют выходом VBUS 5V, но для разных случаев: vbus-supply — OTG с динамическим VBUS; phy-supply — USB HOST, где 5V остаётся включённым после запуска.

<!-- en PDF p.49; unit 275 -->

2. rockchip,sel-pipe-phystatus задаёт GRF USB control register: phystatus управляется GRF вместо USBDP PHY. В USB2-only без включённого USBDP PHY это свойство обязательно, иначе USB не работает нормально.

<!-- en PDF p.49; unit 276 -->

3. rockchip,typec-vbus-det поддерживает схему с постоянно высоким Type-C VBUS_DET.

<!-- en PDF p.49; unit 277 -->

4. rockchip,dis-u2-susphy отключает динамический suspend драйвера USB2 PHY, прежде всего в USB2-only, сохраняя выходную частоту к контроллеру.

<!-- en PDF p.50; unit 278 -->

##### 5.9.1.3 USBDP Combo PHY

<!-- en PDF p.50; unit 279 -->

1. rockchip,dp-lane-mux задаёт линии DP в неполнофункциональном Type-C. DP поддерживает 2 либо 4 линии: `<2, 3>` сопоставляет DP Lane0 с PHY Lane2 и DP Lane1 с PHY Lane3; `<0, 1, 2, 3>` задаёт прямое соответствие.

<!-- en PDF p.50; unit 280 -->

## 6. Переключение OTG RK3588

<!-- en PDF p.50; unit 281 -->

SDK программно принуждает Host/Peripheral независимо от OTG ID или Type-C. Linux-5.10 имеет два метода. Первый требует правильного DTS и применим только без Type-C. Второй этих ограничений не имеет; при неясной адаптации аппаратуры и ПО источник рекомендует начать с него. Метод 1 [Legacy]:

<!-- en PDF p.50; unit 282 -->

```text
#1.Force host mode
  echo host > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-phy@0/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-
phy@0/otg_mode
```

<!-- en PDF p.50; unit 283 -->

Метод 2 [New]:

<!-- en PDF p.50; unit 284 -->

```text
#1.Force host mode
  echo host > /sys/kernel/debug/usb/fc000000.usb/mode
#2.Force peripheral mode
  echo device > /sys/kernel/debug/usb/fc000000.usb/mode
```

<!-- en PDF p.50; unit 285 -->

## 7. Поддерживаемые Type-C-контроллеры

<!-- en PDF p.50; unit 286 -->

Таблица 17. Поддерживаемые Type-C-контроллеры.

<!-- en PDF p.51; unit 287 -->

| Модель Type-C-контроллера | Linux-4.4 | Linux-4.19 | Linux-5.10 | Linux-6.1 | Описание |
| --- | --- | --- | --- | --- | --- |
| ANX7411 | Не поддерживается | Не поддерживается | Не поддерживается | На испытаниях | Драйвер Linux-6.1 поддерживается; функции требуют дальнейшей отладки |
| AW35615 | Поддерживается | Поддерживается | Поддерживается | Поддерживается | Рекомендуется; хорошая совместимость DisplayPort Alt Mode, полная совместимость с FUSB302 |
| ET7301B | Поддерживается | Поддерживается | Поддерживается | Поддерживается | Полностью совместим с FUSB302, прим.1 |
| ET7303 | Не поддерживается | Поддерживается | Поддерживается | Поддерживается | Аппаратно совместим с FUSB302, драйвер близок RT1711, прим.2 |
| FUSB302 | Поддерживается | Поддерживается | Поддерживается | Поддерживается | Штатный чип RK3588 EVB |
| HUSB311 | Не поддерживается | Поддерживается | Поддерживается | Поддерживается | Рекомендуется; аппаратно совместим с FUSB302, драйвер несовместим, прим.3 |
| RT1711H | Не поддерживается | Поддерживается | Поддерживается | Поддерживается | Аппаратно совместим с FUSB302, драйвер близок ET7303, прим.4 |
| WUSB3801 | Нет поддержки SDK; используется в отдельных проектах | Не поддерживается | Не поддерживается | Не поддерживается | Нестандартная однопроводная связь, высокая частота ошибок, стабильность не обеспечивается |

<!-- en PDF p.51; unit 288 -->

Примечание 1. Linux-4.4 не имеет TCPM и поддерживает только FUSB302/ET7301B; они заменяются напрямую без изменения аппаратуры и ПО. Linux-4.19/5.10 поддерживает TCPM и TCPCI и теоретически все TCPCI-контроллеры, например ET7303/HUSB311/RT1711H.

Примечание 2. ET7303 малого корпуса проверен на RK; по сведениям источника, большого корпуса нет. Включить CONFIG_TYPEC_ET7303. В примере usbc0 полнофункционального Type-C изменить имя узла, reg и compatible.

Примечание 3. FUSB302 можно заменить HUSB311; включить CONFIG_TYPEC_HUSB311, DTS как в примечании 2.

<!-- en PDF p.52; unit 289 -->

Примечание 4. RT1711H аппаратно совместим с FUSB302/ET7303, драйвер близок ET7303. Включить CONFIG_TYPEC_RT1711H; DTS как в примечании 2.

<!-- en PDF p.52; unit 290 -->

## 8. Справочные документы

<!-- en PDF p.52; unit 291 -->

1. Universal Serial Bus Type-C Cable and Connector Specification.

<!-- en PDF p.52; unit 292 -->

2. Rockchip Developer Guide USB EN.

## Различия источников и адаптация

Примеры отличаются регистром путей, именами узлов, комментариями и разбиением страниц. Приложение сохраняет отличающиеся блоки другого источника отдельно; это независимые примеры, не единый исполняемый сценарий. Данные потребления относятся только к указанным сценариям производителя, а не к проверкам плат сайтом.

Обе версии V1.3.0. §3 говорит о четырёх конфигурациях, но даёт Config0–4; имена EVB-файлов §5.1 не совпадают с последующими чиповыми DTSI-путями; таблица содержит R3588; §4.3.3 ссылается на таблицу 5 вместо таблицы соединений 6. Сведения сохранены без догадок об исправлении проводки. Maskrom использует Type-C0 USB2.0 и требует питание USBDP PHY0 и REXT: схема USB3.1 Maskrom RK3576 здесь неприменима.

## Отличающиеся исходные примеры другой версии

**CN PDF p.18 · #102**

```text
&u2phy2 {
        status = "disabled";
};

&u2phy3 {
        status = "disabled";
};

&u2phy2_host {
        status = "disabled";
};

&u2phy3_host {
        status = "disabled";
};
```

**CN PDF p.29 · #209**

```text
#USB3.1 OTG0 Controller
usbdrd3_0: usbdrd3_0 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_0: usb@fc000000 {
                compatible = "snps,dwc3";
                ......
        };
};

#USB2.0 HOST0 Controller
usb_host0_ehci: usb@fc800000 {
        compatible = "generic-ehci";
        ......
};

usb_host0_ohci: usb@fc840000 {
        compatible = "generic-ohci";
        ......
};

#USB2.0 HOST1 Controller
```

**CN PDF p.30 · #210**

```text
usb_host1_ehci: usb@fc880000 {
        compatible = "generic-ehci";
        ......
};

usb_host1_ohci: usb@fc8c0000 {
        compatible = "generic-ohci";
        ......
};

#USB3.1 HOST2 Controller
usbhost3_0: usbhost3_0 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbhost_dwc3_0: usb@fcd00000 {
                compatible = "snps,dwc3";
                ......
        };
};

#USB3.1 OTG1 Controller
usbdrd3_1: usbdrd3_1 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_1: usb@fc400000 {
                compatible = "snps,dwc3";
                ......
        };
};
```

**CN PDF p.30 · #212**

```text
#USB2.0 PHY0
usb2phy0_grf: syscon@fd5d0000 {
                compatible = "rockchip,rk3588-usb2phy-grf", "syscon",
                             "simple-mfd";
                ......
                u2phy0: usb2-phy@0 {
                        compatible = "rockchip,rk3588-usb2phy";
                        ......
                        u2phy0_otg: otg-port {
                                #phy-cells = <0>;
                                status = "disabled";
                        };
                };
        };

#USB2.0 PHY1
usb2phy1_grf: syscon@fd5d4000 {
    ......
};
```

**CN PDF p.31 · #213**

```text
#USB2.0 PHY2
usb2phy2_grf: syscon@fd5d8000 {
    ......
};

#USB2.0 PHY3
usb2phy3_grf: syscon@fd5dc000 {
    ......
};

#USB3.1/DP Combo PHY0
usbdp_phy0: phy@fed80000 {
        compatible = "rockchip,rk3588-usbdp-phy";
        ......
        usbdp_phy0_dp: dp-port {
                #phy-cells = <0>;
                status = "disabled";
        };

        usbdp_phy0_u3: u3-port {
                #phy-cells = <0>;
                status = "disabled";
        };
};

#USB3.1/DP Combo PHY1
usbdp_phy1: phy@fed90000 {
    ......
};

#USB3.1/SATA/PCIe PHY2
combphy2_psu: phy@fee20000 {
        compatible = "rockchip,rk3588-naneng-combphy";
        ......
};
```

**CN PDF p.31 · #216**

```text
#USB2.0 PHY配置属性"rockchip,typec-vbus-det"，表⽰⽀持Type-C VBUS_DET常拉⾼的硬件设计
&u2phy0_otg {
        rockchip,typec-vbus-det;
};

#USB3.1/DP PHY0，需要根据硬件设计，配置属性"sbu1-dc-gpios"和"sbu2-dc-gpios"
&usbdp_phy0 {
        orientation-switch;
        svid = <0xff01>;
        sbu1-dc-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_HIGH>;
        sbu2-dc-gpios = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
```

**CN PDF p.32 · #217**

```text
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                usbdp_phy0_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };

                usbdp_phy0_dp_altmode_mux: endpoint@1 {
                        reg = <1>;
                        remote-endpoint = <&dp_altmode_mux>;
                };
        };
};

#USB3.1 OTG0 Controller
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        usb-role-switch;
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_0_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#VBUS GPIO配置，在Type-C控制器芯⽚驱动中控制该GPIO
vbus5v0_typec: vbus5v0-typec {
        compatible = "regulator-fixed";
        regulator-name = "vbus5v0_typec";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PD0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&typec5v_pwren>;
};

#配置外置Type-C控制器芯⽚FUSB302
#需要根据实际的硬件设计，配置"I2C/interrupts/vbus-supply/usb_con"的属性
&i2c2 {
        status = "okay";
        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                interrupt-parent = <&gpio3>;
                interrupts = <RK_PB4 IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
                pinctrl-0 = <&usbc0_int>;
                vbus-supply = <&vbus5v0_typec>;
                status = "okay";
```

**CN PDF p.33 · #218**

```text
        ports {
                #address-cells = <1>;
                #size-cells = <0>;

                port@0 {
                        reg = <0>;
                        usbc0_role_sw: endpoint@0 {
                                remote-endpoint = <&dwc3_0_role_switch>;
                        };
                };
        };

        usb_con: connector {
                compatible = "usb-c-connector";
                label = "USB-C";
                data-role = "dual";
                power-role = "dual";
                try-power-role = "sink";
                op-sink-microwatt = <1000000>;
                sink-pdos =
                        <PDO_FIXED(5000, 1000, PDO_FIXED_USB_COMM)>;
                source-pdos =
                        <PDO_FIXED(5000, 3000, PDO_FIXED_USB_COMM)>;

                altmodes {
                        #address-cells = <1>;
                        #size-cells = <0>;

                        altmode@0 {
                                reg = <0>;
                                svid = <0xff01>;
                                vdo = <0xffffffff>;
                        };
                };

                ports {
                    ......
                };
        };
};
```

**CN PDF p.33 · #220**

```text
#配置外置Type-C控制器芯⽚HUSB311
&i2c2 {
        usbc0: husb311@4e {
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                ......
        };
};
```

**CN PDF p.34 · #223**

```text
#USB2.0 PHY0配置"phy-supply"属性，⽤于控制VBUS输出5V
#注意：使⽤phy-supply，⽆法实现VBUS的动态开关。如果OTG独占GPIO，不与其他HOST共⽤，并且OTG需
要⽀持Device/HOST，则应该配置为"vbus-supply = <&vcc5v0_otg>"，才能实现VBUS动态开关。
&u2phy0_otg {
        phy-supply = <&vcc5v0_host>;
};

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PA1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#USB3.1/DP PHY0，只需配置DP使⽤lane2/3，驱动会⾃动分配lane0/1给USB3.1 Rx/Tx
#如果硬件设计DP使⽤lane0/1，则此处应配置"rockchip,dp-lane-mux = <0 1>"
#注意：实际电路中，即使未⽀持DP，也需要配置"rockchip,dp-lane-mux"，否则USBDP PHY驱动⽆法⾃
动分配lane给USB3.1
&usbdp_phy0 {
        rockchip,dp-lane-mux = <2 3>;
};

#USB3.1 OTG0 Controller
#配置"dr_mode"为"otg"，同时配置"extcon"属性，才能⽀持软件切换Device/Host mode
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        extcon = <&u2phy0>;
        status = "okay";
};
```

**CN PDF p.34 · #226**

```text
#USB2.0 PHY1配置"phy-supply"属性，⽤于控制VBUS输出5V
&u2phy1_otg {
        phy-supply = <&vcc5v0_host>;
```

**CN PDF p.35 · #227**

```text
        status = "okay";
};

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_host: vcc5v0-host-regulator {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_sys>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#USB3.1/DP PHY1，配置DP使⽤lane0/1/2/3
#需要根据实际的硬件设计，配置属性"rockchip,dp-lane-mux"
#配置属性"maximum-speed"，通知USBDP驱动将USB限制为USB2.0 only
&usbdp_phy1 {
        maximum-speed = "high-speed";
        rockchip,dp-lane-mux = < 0 1 2 3 >;
        status = "okay";
};

&usbdp_phy1_dp {
        status = "okay";
};

&usbdp_phy1_u3 {
        status = "okay";
};

#配置属性"maximum-speed"，通知DWC3驱动将USB限制为USB2.0 only
&usbdrd_dwc3_1 {
        dr_mode = "host";
        maximum-speed = "high-speed";
        status = "okay";
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
};
```

**CN PDF p.35 · #230**

```text
#USB2.0 PHY0注册typec orientation switch，⽤于与TCPM⼦系统交互，获取USB热拔插的信息
&u2phy0 {
```

**CN PDF p.36 · #231**

```text
        orientation-switch;
        status = "okay";

        port {
                #address-cells = <1>;
                #size-cells = <0>;
                u2phy0_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };
        };
};

#USB2.0 PHY0 OTG配置
#配置属性"rockchip,sel-pipe-phystatus"，表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,typec-vbus-det"，表⽰⽀持Type-C VBUS_DET常拉⾼的硬件设计
#配置属性"rockchip,dis-u2-susphy"，表⽰关闭USB2 PHY驱动动态进⼊suspend mode的功能
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,typec-vbus-det;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#disable USBDP PHY0的所有相关节点，让USBDP PHY0处于未初始化状态，达到最低功耗的⽬的
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
};

&dp0 {
        status = "disabled";
};

&usbdrd3_0 {
        status = "okay";
}

#配置USB3.1 OTG0 Controller
#配置"phys = <&u2phy0_otg>"，即不引⽤USBDP PHY
#配置maximum-speed = "high-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的稳定
性
#配置"snps,usb2-lpm-disable"，关闭控制器Host mode的LPM功能，提⾼USB外设的兼容性
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        status = "okay";
```

**CN PDF p.37 · #232**

```text
        maximum-speed = "high-speed";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        usb-role-switch;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_0_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#配置外置Type-C控制器芯⽚FUSB302
#需要根据实际的硬件设计，配置"I2C/interrupts/vbus-supply/usb_con"的属性
#需要配置usbc0_orien_sw的属性remote-endpoint = <&u2phy0_orientation_switch>
&i2c8 {
        status = "okay";
        pinctrl-names = "default";
        pinctrl-0 = <&i2c8m2_xfer>;

        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                interrupt-parent = <&gpio0>;
                interrupts = <RK_PC4 IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
                pinctrl-0 = <&usbc0_int>;
                vbus-supply = <&vbus5v0_typec>;
                status = "okay";

                ports {
                        #address-cells = <1>;
                        #size-cells = <0>;

                        port@0 {
                                reg = <0>;
                                usbc0_role_sw: endpoint@0 {
                                        remote-endpoint = <&dwc3_0_role_switch>;
                                };
                        };
                };

                usb_con: connector {
                        compatible = "usb-c-connector";
                        label = "USB-C";
                        data-role = "dual";
                        power-role = "dual";
                        ......
                        ports {
                                #address-cells = <1>;
                                #size-cells = <0>;
```

**CN PDF p.38 · #233**

```text
                                port@0 {
                                        reg = <0>;
                                        usbc0_orien_sw: endpoint {
                                                remote-endpoint =
<&u2phy0_orientation_switch>;
                                        };
                                };
                        };

                };
        };
```

**CN PDF p.38 · #235**

```text
#USB2.0 PHY0 OTG配置
#配置属性"rockchip,sel-pipe-phystatus"，表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,dis-u2-susphy"，表⽰关闭USB2 PHY驱动动态进⼊suspend mode的功能
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#disable USBDP PHY0的所有相关节点，让USBDP PHY0处于未初始化状态，达到最低功耗的⽬的
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
}

#配置USB3.1 OTG0 Controller
#配置dr_mode = "peripheral"，通知DWC3驱动初始化为Device only mode
#配置"phys = <&u2phy0_otg>"，即不引⽤USBDP PHY
#配置maximum-speed = "high-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的稳定
性
&usbdrd_dwc3_0 {
        dr_mode = "peripheral";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
};
```

**CN PDF p.39 · #237**

```text
#USB2.0 PHY0 OTG配置
#配置属性"rockchip,sel-pipe-phystatus"，表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,dis-u2-susphy"，表⽰关闭USB2 PHY驱动动态进⼊suspend mode的功能
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#disable USBDP PHY0的所有相关节点，让USBDP PHY0处于未初始化状态，达到最低功耗的⽬的
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
}

#配置USB3.1 OTG0 Controller
#配置dr_mode = "otg"
#配置"phys = <&u2phy0_otg>"，即不引⽤USBDP PHY
#配置maximum-speed = "high-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置"extcon"属性，才能⽀持⾃动切换Device/Host mode
#配置"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的稳定
性
#配置"snps,usb2-lpm-disable"，关闭控制器Host mode的LPM功能，提⾼USB外设的兼容性
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        extcon = <&u2phy0>;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
};
```

**CN PDF p.39 · #240**

```text
#USB2.0 PHY3配置"phy-supply"属性，⽤于控制VBUS输出5V
&u2phy3_host {
        phy-supply = <&vcc5v0_host>;
}

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
```

**CN PDF p.40 · #241**

```text
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PA1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#使能USB3.1/SATA/PCIe Combo PHY
&combphy2_psu {
        status = "okay";
};

#配置USB3.1 HOST2 Controller
&usbhost3_0 {
        status = "okay";
};

&usbhost_dwc3_0 {
        dr_mode = "host";
        status = "okay";
};
```

**CN PDF p.40 · #244**

```text
#USB2.0 PHY2/3配置"phy-supply"属性，⽤于控制VBUS输出5V
&u2phy2_host {
        phy-supply = <&vcc5v0_host>;
};

&u2phy3_host {
        phy-supply = <&vcc5v0_host>;
};

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
```

**CN PDF p.41 · #245**

```text
};

#USB2.0 HOST0/1 Controller
&usb_host0_ehci {
        status = "okay";
};

&usb_host0_ohci {
        status = "okay";
};

&usb_host1_ehci {
        status = "okay";
};

&usb_host1_ohci {
        status = "okay";
};
```

**CN PDF p.41 · #256**

```text
[...]
# VBUS GPIO 配置，在USB2.0 PHY驱动中控制该 GPIO
vcc5v0_otg: vcc5v0-otg {
    compatible = "regulator-fixed";
    regulator-name = "vcc5v0_otg";
    regulator-min-microvolt = <5000000>;
    regulator-max-microvolt = <5000000>;
    enable-active-high;
    gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
    vin-supply = <&vcc5v0_sys>;
    pinctrl-names = "default";
    pinctrl-0 = <&vcc5v0_otg_en>;
};
```

**CN PDF p.42 · #257**

```text
&pinctrl {
    usb {
        [...]
        vcc5v0_otg_en: vcc5v0-otg-en {
            rockchip,pins = <4 RK_PA7 RK_FUNC_GPIO &pcfg_pull_up>;
        };
    };
};

[...]

# 按实际设计配置 status. 如果 USB3 和 DP 都不使⽤，建议关闭 USBDP PHY0 的所有相关节点，以降
低功耗
&usbdp_phy0 {
    maximum-speed = "high-speed";
    status = "okay";
};

&usbdp_phy0_dp {
    status = "okay";
};

&usbdp_phy0_u3 {
    status = "okay";
};

&u2phy0 {
    status = "okay";
};

&u2phy0_otg {
    vbus-supply = <&vcc5v0_otg>;
    rockchip,sel-pipe-phystatus;
    rockchip,dis-u2-susphy;
    status = "okay";
};

&usbdrd_dwc3_0 {
    status = "okay";
    dr_mode = "otg";
    maximum-speed = "high-speed";
    extcon = <&u2phy0>;
    snps,dis_u2_susphy_quirk;
    snps,usb2-lpm-disable;
};
```

**CN PDF p.44 · #276**

```text
#1.Force host mode
  echo host > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-
phy@0/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-
phy@0/otg_mode
```

{% endraw %}
