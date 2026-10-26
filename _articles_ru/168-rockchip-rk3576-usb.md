---
title: "RK3576 USB: аппаратные схемы, питание PHY, DTS и Type-C"
description: "RK3576 USB: аппаратные схемы, питание PHY, DTS и Type-C · CN V1.1.0 / EN V1.2.0"
excerpt: "RK3576 USB: аппаратные схемы, питание PHY, DTS и Type-C"
translation_key: "168-rockchip-rk3576-usb"
slug: "168-rockchip-rk3576-usb"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "RK3576", "USB", "Type-C", "PHY", "DTS"]
---

{% raw %}

Справочный материал платформы: полная документация производителя USB для RK3576 (CN V1.1.0 / EN V1.2.0), базовое ядро Linux-6.1. Описаны схемы контроллеров/PHY, питание, интерфейсы и DTS для адаптации продукта. Соответствие конкретным платам ArmSoM и SDK/BSP не подтверждено; аппаратные испытания не проводились. Проверяйте схему, SoC/ядро, патчи, питание PHY, GPIO, PD-контроллер и соединения. Таблицы потребления и команды — примеры производителя, не измерения ArmSoM. ZH использует китайские рисунки, EN/RU/DE — английские оригиналы. Различия источников и уникальные примеры сохранены отдельно.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- en PDF p.5; unit 0 -->

## 1. Контроллеры USB и PHY RK3576

<!-- en PDF p.5; unit 1 -->

RK3576 поддерживает 2 независимых контроллера USB 3.1 OTG, 2 независимых USB 2.0 PHY, один USB 3.1/DP Combo PHY и один USB 3.1/SATA/PCIe Combo PHY. Подробные характеристики контроллеров приведены в RK3576 TRM. Добавлены следующие функции:

<!-- en PDF p.5; unit 2 -->

1. OTG0 и OTG1 поддерживают MMU: аппаратный контроллер USB может обращаться к памяти за пределами 4G.

<!-- en PDF p.5; unit 3 -->

2. OTG1 поддерживает CCI для когерентности кеша, поэтому CPU не требуется выполнять очистку кеша; OTG0 этого не поддерживает.

<!-- en PDF p.5; unit 4 -->

3. DP/DM OTG0 мультиплексируются с UART/JTAG. SDK по умолчанию включает эту функцию; требуется переходная плата RK USB to DEBUG. Примечания:

<!-- en PDF p.5; unit 5 -->

1. Физическая скорость USB 3.1 Gen1 — 5Gbps, USB 2.0 — 480Mbps.

<!-- en PDF p.5; unit 6 -->

2. USB 3.1/DP Combo PHY имеет 4 линии и может одновременно обеспечивать USB 3.1 и две линии DP.

<!-- en PDF p.5; unit 7 -->

3. USB 3.1/SATA/PCIe Combo PHY работает только в одном режиме одновременно: USB 3.1 взаимоисключается с SATA/PCIe. Таблица 1. Соединения контроллеров USB и PHY RK3576.

<!-- en PDF p.5; unit 8 -->

| Интерфейс USB (схема) | Контроллер USB | USB PHY |
| --- | --- | --- |
| USB OTG0 | OTG0<br>(DWC3&xHCI) | USB3.1/DP ComboPHY + USB2.0 PHY0 |
| USB OTG1 | OTG1<br>(DWC3&xHCI) | USB3.1/SATA/PCIe ComboPHY1 + USB2.0<br>PHY1 |

<!-- en PDF p.5; unit 9 -->

Соответствие контроллеров USB RK3576 контактам передачи данных чипа приведено в таблице 2. Таблица 2. Контроллеры USB и контакты RK3576.

<!-- en PDF p.6; unit 10 -->

| Контроллер/контакт USB | Контакты данных USB RK3576 |
| --- | --- |
| USB 3.1 OTG0 | USB2_OTG0_DP/USB2_OTG0_DM,<br>USB3_OTG0_SSRX1P/USB3_OTG0_SSRX1N,<br>USB3_OTG0_SSTX1P/USB3_OTG0_SSTX1N,<br>USB3_OTG0_SSRX2P/USB3_OTG0_SSRX2N,<br>USB3_OTG0_SSTX2P/USB3_OTG0_SSTX2N, |
| USB 3.1 OTG1 | USB2_OTG1_DP/USB2_OTG1_DM,<br>USB3_OTG1_SSTXP/USB3_OTG1_SSTXN,<br>USB3_OTG1_SSRXP/USB3_OTG1_SSRXN, |

<!-- en PDF p.6; unit 11 -->

Внутренние соединения контроллеров USB RK3576 с PHY и соответствующие распространённые физические интерфейсы показаны на рисунке 1.

<!-- en PDF p.6; unit 12 -->

![Рисунок английского оригинала · PDF p.6](/docs/rockchip-rk3576-usb/assets/en-p006-figure-01.png)

<!-- en PDF p.6; unit 13 -->

Рисунок 1. Соединения контроллеров USB RK3576 и PHY. Примечания:

<!-- en PDF p.6; unit 14 -->

1. Поддержка не ограничивается Type-C/A на рисунке 1: доступны обычные интерфейсы Type-C USB 2.0/3.1, Type-A USB 2.0/3.1, Micro USB 2.0/3.1 и другие. Драйвер USB ядра Linux-6.1 уже обеспечивает программную совместимость с различными схемами и типами разъёмов. Для включения нужной функции разработчику следует правильно настроить Linux USB DTS под схему продукта. Подробности — в разделе конфигурации DTS RK3576 USB.

<!-- en PDF p.6; unit 15 -->

2. Особое ограничение: доступ контроллеров OTG1/PCIe1/SATA1 к шине взаимоисключающий. Если схема использует PCIe1 либо SATA1, недоступны обе функции OTG1: USB2 и USB3.

<!-- en PDF p.7; unit 16 -->

## 2. Карта конфигураций USB RK3576

<!-- en PDF p.7; unit 17 -->

Два независимых контроллера позволяют создавать варианты продуктов на рисунках 2–4. Для OTG0 доступны пять схем:

- Config0: Type-C0 USB3.1 OTG0 с DP.
- Config1: USB 2.0 OTG0 + DP 4 x Lane (Swap off).
- Config2: USB 2.0 OTG0 + DP 4 x Lane (Swap on).
- Config3: USB 3.1 OTG0 + DP 2 x Lane (Swap on).
- Config4: USB 3.1 OTG0 + DP 2 x Lane (Swap off).

Для OTG1 две схемы: Config0 — USB 2.0 only OTG1; Config1 — USB 3.1 OTG1. Более подробная карта находится в USB/DP Configure Map эталонной схемы RK3576 SDK EVB. Примечания:

<!-- en PDF p.7; unit 18 -->

1. USB 2.0/3.1 OTG1 нельзя использовать одновременно с PCIe1/SATA1.

<!-- en PDF p.7; unit 19 -->

2. Соответствие линий USBDP: Swap off — Lane0/1/2/3 TxData → Lane0/1/2/3_TXDP/N; Swap on — Lane0/1/2/3 TxData → Lane2/3/0/1_TXDP/N.

<!-- en PDF p.7; unit 20 -->

![Рисунок английского оригинала · PDF p.7](/docs/rockchip-rk3576-usb/assets/en-p007-figure-01.png)

<!-- en PDF p.7; unit 21 -->

Рисунок 2. Карта трактов USB RK3576.

<!-- en PDF p.8; unit 22 -->

![Рисунок английского оригинала · PDF p.8](/docs/rockchip-rk3576-usb/assets/en-p008-figure-01.png)

<!-- en PDF p.8; unit 23 -->

Рисунок 3. Карта трактов OTG0 USBDP RK3576.

<!-- en PDF p.8; unit 24 -->

![Рисунок английского оригинала · PDF p.8](/docs/rockchip-rk3576-usb/assets/en-p008-figure-02.png)

<!-- en PDF p.8; unit 25 -->

Рисунок 4. Карта трактов OTG1 MULTI PHY RK3576.

<!-- en PDF p.8; unit 26 -->

## 3. Аппаратная схема USB RK3576

<!-- en PDF p.8; unit 27 -->

Раздел описывает поддерживаемые аппаратные варианты для практических применений. Интерфейсы RK3576: USB30/DP1.4 MULTI0 и USB30/PCIE2.0/SATA30 MULTI1.

<!-- en PDF p.9; unit 28 -->

### 3.1 Питание и управление потреблением контроллера USB

<!-- en PDF p.9; unit 29 -->



<!-- en PDF p.9; unit 30 -->

Контроллер USB RK3576 питается от VD_LOGIC; предусмотрены отдельные домены питания: USB3.1 OTG0 в PD_USB, USB3.1 OTG1 в PD_PHP. Драйвер Linux динамически переключает PD по состоянию интерфейса через Linux PM Runtime, снижая потребление. При переходе системы во второй уровень ожидания ПО принудительно отключает все PD контроллеров USB для минимального потребления. Если нужно сохранить рабочее состояние регистров USB в этом ожидании, драйвер должен вызвать device_init_wakeup, чтобы предотвратить отключение PD. Стратегия:

<!-- en PDF p.9; unit 31 -->

1. Для неиспользуемого контроллера установить соответствующий DTS-узел в disabled.

<!-- en PDF p.9; unit 32 -->

2. Драйвер ядра уже поддерживает Auto suspend включённых контроллеров: когда USB HOST не имеет подключённых устройств, контроллер автоматически переходит в suspend с низким потреблением. Отдельная отладка динамического управления питанием не требуется.

<!-- en PDF p.9; unit 33 -->

### 3.2 Питание и потребление USB PHY

<!-- en PDF p.9; unit 34 -->

#### 3.2.1 Питание и потребление USB 2.0 PHY

<!-- en PDF p.9; unit 35 -->

RK3576 имеет два независимых USB 2.0 PHY. Внутри чипа все относятся к VD_USBPHY и совместно используют три внешних источника питания на рисунке 5. Поэтому во время работы нельзя просто отключить аппаратное питание или PD для снижения их потребления.

<!-- en PDF p.9; unit 36 -->

![Рисунок английского оригинала · PDF p.9](/docs/rockchip-rk3576-usb/assets/en-p009-figure-01.png)

<!-- en PDF p.9; unit 37 -->

Рисунок 5. Питание USB 2.0 PHY.

<!-- en PDF p.10; unit 38 -->

Напряжение USB 2.0 PHY выше указанного максимума либо ниже минимума может вызвать ненормальную работу USB-соединения. Таблица 3. Требования к напряжениям USB 2.0 PHY.

<!-- en PDF p.10; unit 39 -->

| Напряжение питания | Минимум | Нормальное | Максимум | Единица |
| --- | --- | --- | --- | --- |
| USB2_OTG_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB2_OTG_AVDD_1V8 | 1.674 | 1.8 | 1.98 | V |
| USB2_OTG_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |

<!-- en PDF p.10; unit 40 -->

Стратегия управления потреблением USB 2.0 PHY:

<!-- en PDF p.10; unit 41 -->

1. Для загрузки прошивки через Maskrom USB все три питания USB 2.0 PHY должны быть нормальными.

<!-- en PDF p.10; unit 42 -->

2. После включения все USB 2.0 PHY находятся в Normal. На этапе U-Boot SPL ПО переводит USB 2.0 PHY1/PHY2/PHY3 в минимально потребляющий IDDQ; SDK уже поддерживает это. После загрузки системы драйвер ядра выводит нужный PHY из IDDQ по требованиям приложения. Нумерация сохранена как в источнике.

<!-- en PDF p.10; unit 43 -->

3. Для включённых ядром PHY драйвер автоматически управляет потреблением: обнаружено устройство — Normal; устройства нет — Suspend. Таблица 4 показывает потребление одного USB 2.0 PHY в различных режимах.

<!-- en PDF p.10; unit 44 -->

| Напряжение питания | Чтение/запись | Динамический suspend | PHY отключён | Ожидание второго уровня | Единица |
| --- | --- | --- | --- | --- | --- |
| USB20_DVDD_0V75 | 8.9 | 2.8 | 0.05 | 0 | mA |
| USB20_AVDD_1V8 | 8.6 | 3.34 | 0.05 | 0 | mA |
| USB20_AVDD_3V3 | 2.5 | 0.14 | 0.05 | 0 | mA |

<!-- en PDF p.10; unit 45 -->

Примечания к исходным измерениям:

<!-- en PDF p.10; unit 46 -->

1. Чтение/запись: копирование с диском U2, PHY в Normal.

<!-- en PDF p.10; unit 47 -->

2. Динамический suspend: DTS USB 2.0 PHY включён, периферия не подключена, PHY в Suspend.

<!-- en PDF p.10; unit 48 -->

3. PHY disabled: DTS выключен, PHY в IDDQ.

<!-- en PDF p.10; unit 49 -->

4. Второй уровень ожидания: отключены все три источника питания USB <!-- en PDF p.10; unit 50 --> 2.0 PHY.

<!-- en PDF p.11; unit 51 -->

#### 3.2.2 Питание и потребление USB 3.1 PHY

<!-- en PDF p.11; unit 52 -->

RK3576 поддерживает два вида USB 3.1 Combo PHY:

<!-- en PDF p.11; unit 53 -->

1. USB 3.1/DP Combo PHY.

<!-- en PDF p.11; unit 54 -->

2. USB 3.1/PCIe/SATA Combo PHY. Питание и управление потреблением различаются; ниже они описаны отдельно.

<!-- en PDF p.11; unit 55 -->

##### 3.2.2.1 USB 3.1/DP Combo PHY

<!-- en PDF p.11; unit 56 -->

USB3.1 OTG0 RK3576 использует USB 3.1/DP Combo PHY. Внутри чипа он относится к VD_USBDPPHY (Alive), снаружи имеет два независимых питания, показанных на рисунке 6.

<!-- en PDF p.11; unit 57 -->

![Рисунок английского оригинала · PDF p.11](/docs/rockchip-rk3576-usb/assets/en-p011-figure-01.png)

<!-- en PDF p.11; unit 58 -->

Рисунок 6. Питание USBDP Combo PHY RK3576. Таблица 5. Требования к напряжениям USB 3.1/DP Combo PHY.

<!-- en PDF p.11; unit 59 -->

| Питание | Минимум | Нормальное | Максимум | Единица |
| --- | --- | --- | --- | --- |
| VDD_0V85/VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |

<!-- en PDF p.11; unit 60 -->

Стратегия потребления USB 3.1/DP Combo PHY:

<!-- en PDF p.11; unit 61 -->

1. После включения USBDP PHY не инициализирован и потребляет минимум.

<!-- en PDF p.11; unit 62 -->

2. При использовании USBDP драйвер автоматически управляет PHY: устройство обнаружено — P0 State; не обнаружено — P3 State для Type-A либо reset для Type-C.

<!-- en PDF p.11; unit 63 -->

3. Если ни USB3.1, ни DP не используются, питание USBDP PHY можно оставить или отключить по требованиям проекта. (1) Для загрузки прошивки USB3.1 питание должно оставаться нормальным. (2) Если такая загрузка не нужна, рекомендуется внешне отключить <!-- en PDF p.12; unit 64 --> питание USBDP PHY, но изменить DTS по разделу отключённого питания USB PHY. (3) Если загрузка USB3.1 не нужна, но питание остаётся, рекомендуется disabled для USBDP PHY DTS: неинициализированное состояние с минимальным потреблением. Таблица 6. Потребление USB 3.1/DP Combo PHY.

<!-- en PDF p.12; unit 65 -->

| Питание | Чтение/запись | Динамический сон | PHY отключён | Ожидание L2 | Единица |
| --- | --- | --- | --- | --- | --- |
| VDD_0V85/VDDA_0V85 | 101.6 | 5 | 2 | 0 | mA |
| VDDH_1V8 | 29 | 0 | 0 | 0 | mA |

<!-- en PDF p.12; unit 66 -->

Примечания к исходным измерениям:

<!-- en PDF p.12; unit 67 -->

1. Чтение/запись: копирование с диском U3, PHY в P0.

<!-- en PDF p.12; unit 68 -->

2. Динамический сон: Type-C без USB-устройства, PHY в reset.

<!-- en PDF p.12; unit 69 -->

3. PHY Disabled: DTS disabled, PHY не инициализирован, потребление минимально.

<!-- en PDF p.12; unit 70 -->

4. L2 Standby: оба питания PHY отключены. Отключение USBDP PHY в ядре:

<!-- en PDF p.12; unit 71 -->

```text
&usbdp_phy {
        status = "disabled";
};

&usbdp_phy_dp {
        status = "disabled";
};

&usbdp_phy_u3 {
        status = "disabled";
};
```

<!-- en PDF p.12; unit 72 -->

##### 3.2.2.2 USB 3.1/PCIe/SATA Combo PHY

<!-- en PDF p.12; unit 73 -->

USB3.1 OTG1 RK3576 использует Combo PHY1 USB3.1/PCIe/SATA. Внутри он относится к PD_BUS (Alive); снаружи два независимых источника питания, показанные на рисунке <!-- en PDF p.12; unit 74 --> 7.

<!-- en PDF p.13; unit 75 -->

![Рисунок английского оригинала · PDF p.13](/docs/rockchip-rk3576-usb/assets/en-p013-figure-01.png)

<!-- en PDF p.13; unit 76 -->

Рисунок 7. Питание USB 3.1/PCIe/SATA Combo PHY RK3576. Таблица 7. Требования к напряжениям.

<!-- en PDF p.13; unit 77 -->

| Питание | Минимум | Нормальное | Максимум | Единица |
| --- | --- | --- | --- | --- |
| AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |

<!-- en PDF p.13; unit 78 -->

Стратегия потребления USB 3.1/PCIe/SATA Combo PHY:

<!-- en PDF p.13; unit 79 -->

1. При включении PHY по умолчанию работает. U-Boot SPL переводит его в reset с минимальным потреблением. После входа в ядро драйвер USB снимает reset вызовом rockchip_combphy_init().

<!-- en PDF p.13; unit 80 -->

2. В USB-режиме аппаратный контроллер автоматически управляет PIPE P0/P1/P2/P3 в зависимости от работы. Без USB-устройства PIPE в P3; при подключении U3-диска — P0. Если подключён U3 HUB без периферии на нижних портах, PIPE автоматически переходит в P3 для экономии; подключение периферии к HUB возвращает P0. P0 — нормальная работа, P3 — минимальное потребление.

<!-- en PDF p.13; unit 81 -->

3. Если USB 3.1 OTG1/PCIe/SATA точно не используется, Combo PHY можно не питать, но DTS должен быть изменён по разделу отключённого питания PHY.

<!-- en PDF p.13; unit 82 -->

4. При наличии питания, но неиспользовании PHY, установить DTS disabled: PHY останется в reset с минимальным потреблением. Таблица 8. Потребление USB 3.1/SATA/PCIe Combo PHY.

<!-- en PDF p.14; unit 83 -->

| Питание | Чтение/запись | Динамический сон | PHY отключён | Ожидание второго уровня | Единица |
| --- | --- | --- | --- | --- | --- |
| AVDD_0V85 | 44.5 | 9.6 | 0.4 | 0 | mA |
| AVDD_1V8 | 5.2 | 0.5 | 0.2 | 0 | mA |

<!-- en PDF p.14; unit 84 -->

Примечания к исходным измерениям:

<!-- en PDF p.14; unit 85 -->

1. Чтение/запись: U3-диск, PHY в P0.

<!-- en PDF p.14; unit 86 -->

2. Динамический сон: DTS включён, периферии нет, PHY в P3.

<!-- en PDF p.14; unit 87 -->

3. PHY disabled: DTS disabled, PHY в reset.

<!-- en PDF p.14; unit 88 -->

4. Второй уровень ожидания: оба питания отключены. Отключение USB 3.1/PCIe/SATA Combo PHY в ядре:

<!-- en PDF p.14; unit 89 -->

```text
&combphy1_psu {
        status = "disabled";
};
```

<!-- en PDF p.14; unit 90 -->

### 3.3 Аппаратные схемы USB

<!-- en PDF p.14; unit 91 -->

#### 3.3.1 Схема USB2_OTG0_VBUSDET

<!-- en PDF p.14; unit 92 -->

USB2_OTG0_VBUSDET определяет подключение и отключение при работе USB в Device. Требования:

<!-- en PDF p.14; unit 93 -->

1. Для Type-C с PD и внешним контроллером, например FUSB302/HUSB311, использовать схему Type-C RK3576 EVB1: USB2_OTG0_VBUSDET постоянно подтянут к VCC_3V3_S0. Драйвер обнаруживает подключение/отключение Device через CC внешнего контроллера.

<!-- en PDF p.14; unit 94 -->

2. Без внешнего Type-C-контроллера, например Type-C USB 2.0 only, Type-A USB 3.1, Micro USB 2.0/3.1, USB2_OTG0_VBUSDET подключается к VBUS разъёма через обычный делитель. Нельзя подключать VBUSDET к постоянному питанию. Для USB HOST требуется независимое управление VBUS через GPIO или PMIC, не общее с другими HOST.

<!-- en PDF p.14; unit 95 -->

3. Допустимый высокий уровень входа USB2_OTG0_VBUSDET: [0.9V ~ 3.3V].

<!-- en PDF p.15; unit 96 -->

#### 3.3.2 Схема Maskrom USB

<!-- en PDF p.15; unit 97 -->

Maskrom загружает прошивку через USB3.1 и совместим с загрузкой USB2.0. Требования к схеме:

<!-- en PDF p.15; unit 98 -->

1. USB 2.0 PHY должен питаться; см. соответствующий раздел питания.

<!-- en PDF p.15; unit 99 -->

2. Питание USBDP PHY можно оставить либо отключить по проекту, см. раздел USB 3.1 PHY. Для загрузки USB3.1 питание обязательно, а USB3_OTG0_TX1/RX1 должны быть подключены к порту загрузки.

<!-- en PDF p.15; unit 100 -->

3. Перечисление Maskrom USB не зависит от уровня USB2_OTG0_VBUSDET.

<!-- en PDF p.15; unit 101 -->

4. Настройка инструмента прошивки. (1) Загрузка USB3.1 требует Windows-инструмент v3.28 либо Linux-инструмент v2.30 или новее; config.ini изменяется вручную: Windows `USB3_TRANSFER=TRUE`, Linux `usb3_transfer_on=true`. (2) Если схема поддерживает только OTG0 USB2 и USBDP PHY не питается (USB3_OTG0_DP_TX_AVDD0V85, USB3_OTG0_DP_TX_DVDD0V85, USB3_OTG0_DP_TX_AVDD1V8 отключены), функцию USB3 инструмента обязательно выключить, иначе загрузка Maskrom завершится неудачей.

<!-- en PDF p.15; unit 102 -->

#### 3.3.3 USB2: схема с пробуждением системы

<!-- en PDF p.15; unit 103 -->

USB2 может пробуждать систему через DP/DM. Для второго уровня ожидания нужны следующие питания:

<!-- en PDF p.15; unit 104 -->

1. Все три внешних питания USB2 PHY — USB2_OTG_DVDD_0V75, USB2_OTG_AVDD_1V8, USB2_OTG_AVDD_3V3 — должны оставаться включёнными.

<!-- en PDF p.15; unit 105 -->

2. VBUS разъёма должен продолжать питать USB-периферию.

<!-- en PDF p.15; unit 106 -->

3. Внешнее питание OSC RK3576, OSC_AVDD1V8, должно оставаться включённым.

<!-- en PDF p.15; unit 107 -->

4. Внешнее питание PMU RK3576 должно оставаться включённым.

<!-- en PDF p.15; unit 108 -->

5. Питание Logic RK3576 можно оставить или отключить; для уменьшения потребления второго уровня ожидания рекомендуется отключение.

<!-- en PDF p.16; unit 109 -->

#### 3.3.4 Полнофункциональная схема Type-C USB 3.1/DP

<!-- en PDF p.16; unit 110 -->

Пример: USB 3.1 OTG0 Type-C платы RK3576 EVB1.

<!-- en PDF p.16; unit 111 -->

1. Для полной функциональности Type-C — определения ориентации, согласования PD-зарядки и Alternate Mode — нужен внешний Type-C-контроллер. Поддерживается большинство распространённых чипов; см. список поддержки.

<!-- en PDF p.16; unit 112 -->

2. Для высоковольтной зарядки и снижения аппаратного риска USB2_OTG0_VBUSDET не подключать к VBUS Type-C: постоянно подтянуть к 3.3V, то есть VCC_3V3_S0 на рисунках 8–9. Оставлять его неподключённым нельзя.

<!-- en PDF p.16; unit 113 -->

3. USB2_OTG0_ID нужен лишь для OTG интерфейса Micro; в Type-C он не используется и оставляется неподключённым.

<!-- en PDF p.16; unit 114 -->

4. TYPEC_SBU1/TYPEC0_SBU2 применяются только для AUX в DP Alternate Mode. AUX требует подтяжки SBU1/SBU2 к уровню, соответствующему ориентации Type-C. В RK3576 автоматическая подтяжка не реализована, поэтому схема должна добавить два внешних GPIO (TYPEC_SBU1/TYPEC_SBU2 на рисунке 9). Требований к исходным подтяжкам GPIO нет, можно выбрать любые GPIO. В ПО адаптировать свойства `sbu1-dc-gpios` и `sbu2-dc-gpios` узла usbdp_phy.

<!-- en PDF p.16; unit 115 -->

5. DTS описан в разделе полнофункционального Type-C USB 3.1/DP.

<!-- en PDF p.16; unit 116 -->

![Рисунок английского оригинала · PDF p.16](/docs/rockchip-rk3576-usb/assets/en-p016-figure-01.png)

<!-- en PDF p.17; unit 117 -->

Рисунок 8. Схема Type-C RK3576.

<!-- en PDF p.17; unit 118 -->

![Рисунок английского оригинала · PDF p.17](/docs/rockchip-rk3576-usb/assets/en-p017-figure-01.png)

<!-- en PDF p.17; unit 119 -->

Рисунок 9. Интерфейс Type-C RK3576.

<!-- en PDF p.17; unit 120 -->

![Рисунок английского оригинала · PDF p.17](/docs/rockchip-rk3576-usb/assets/en-p017-figure-02.png)

<!-- en PDF p.17; unit 121 -->

Рисунок 10. Управление VBUS Type-C RK3576.

<!-- en PDF p.17; unit 122 -->

#### 3.3.5 Схема Type-C → Type-A USB 3.1/DP

<!-- en PDF p.17; unit 123 -->

OTG0 Type-C можно разделить на независимые Type-A USB 3.1 и DP (две линии). Пример — соответствующая схема RK3576 EVB2.

<!-- en PDF p.17; unit 124 -->

1. Type-A USB 3.1 использует USB3_OTG0_SSRX1P/N и USB3_OTG0_SSTX1P/N, то есть lane0/1 внутреннего USBDP PHY. DP использует DP_TX_D2P/N и DP_TX_D3P/N, то есть lane2/3.

<!-- en PDF p.17; unit 125 -->

2. Если OTG применяется и как Device, и как HOST, рекомендуется подключить USB2_OTG0_VBUSDET к VBUS Type-A через резистор 30KΩ.

<!-- en PDF p.17; unit 126 -->

3. Питание VBUS Type-A (VCC5V0_USB30_HOST0) управляется GPIO: в Device выход отключён, в HOST включён. Ток стабилизатора SGM2590D определяется резистором <!-- en PDF p.18; unit 127 --> на выводе OCB. Максимальный ток Ilim(A) = 6612/RILIM^0.982; в схеме рисунка 12 ограничение VBUS составляет 2.3A.

<!-- en PDF p.18; unit 128 -->

4. См. соответствующий раздел DTS Type-C → Type-A USB 3.1/DP. Примечание: теоретически Type-A USB 3.1 можно назначить lane2/3, а DP lane0/1, но тогда свойство rockchip,dp-lane-mux узла usbdp_phy необходимо изменить под схему.

<!-- en PDF p.18; unit 129 -->

![Рисунок английского оригинала · PDF p.18](/docs/rockchip-rk3576-usb/assets/en-p018-figure-01.png)

<!-- en PDF p.18; unit 130 -->

Рисунок 11. Схема Type-A USB 3.1/DP RK3576.

<!-- en PDF p.18; unit 131 -->

![Рисунок английского оригинала · PDF p.18](/docs/rockchip-rk3576-usb/assets/en-p018-figure-02.png)

<!-- en PDF p.18; unit 132 -->

Рисунок 12. Интерфейс Type-A USB3.1 RK3576.

<!-- en PDF p.19; unit 133 -->

#### 3.3.6 Схема Type-C → Type-A/Micro USB 2.0/DP

<!-- en PDF p.19; unit 134 -->

OTG0 Type-C разделяется на независимые Type-A USB 2.0 и DP с четырьмя линиями. Пример — схема RK3576 TEST2 Board Type-C → Type-A USB 2.0/DP.

<!-- en PDF p.19; unit 135 -->

1. Все четыре линии TYPEC USBDP PHY используются для DP; USB не использует этот PHY.

<!-- en PDF p.19; unit 136 -->

2. Если TYPEC USB работает только как HOST, USB2_OTG0_ID и USB2_OTG0_VBUSDET можно оставить неподключёнными.

<!-- en PDF p.19; unit 137 -->

3. VBUS Type-A (VCC5V0_USB2_OTG0) управляется GPIO и включается в HOST. SGM2590D также имеет настройку ограничения тока.

<!-- en PDF p.19; unit 138 -->

4. См. DTS Type-C → Type-A/Micro USB 2.0/DP.

<!-- en PDF p.19; unit 139 -->

![Рисунок английского оригинала · PDF p.19](/docs/rockchip-rk3576-usb/assets/en-p019-figure-01.png)

<!-- en PDF p.19; unit 140 -->

Рисунок 13. Схема Type-A USB 2.0/DP RK3576.

<!-- en PDF p.20; unit 141 -->

![Рисунок английского оригинала · PDF p.20](/docs/rockchip-rk3576-usb/assets/en-p020-figure-01.png)

<!-- en PDF p.20; unit 142 -->

Рисунок 14. Интерфейс Type-A/Micro USB2 RK3576.

<!-- en PDF p.20; unit 143 -->

#### 3.3.7 Схема Type-A USB3.1 OTG1

<!-- en PDF p.20; unit 144 -->

Главное отличие OTG0 и OTG1 — разные USB3 PHY. Поэтому схема OTG1 без Type-C практически совпадает с USB3.1 OTG0. Для полнофункционального Type-C между OTG1 и разъёмом нужны дополнительный USB3.1 Switch, например FUSB340, и Type-C-контроллер, например FUSB302.

<!-- en PDF p.20; unit 145 -->

![Рисунок английского оригинала · PDF p.20](/docs/rockchip-rk3576-usb/assets/en-p020-figure-02.png)

<!-- en PDF p.20; unit 146 -->

Рисунок 15. Интерфейс USB3.1 OTG1 RK3576.

<!-- en PDF p.20; unit 147 -->

## 4. Конфигурация DTS USB RK3576

<!-- en PDF p.20; unit 148 -->

Конфигурация включает DTSI контроллера/PHY уровня чипа и DTS уровня платы. Подробности в документах ядра:

<!-- en PDF p.21; unit 149 -->

1. `kernel/Documentation/devicetree/bindings/usb/snps,dwc3.yaml`

<!-- en PDF p.21; unit 150 -->

2. `kernel/Documentation/devicetree/bindings/connector/usb-connector.yaml`

<!-- en PDF p.21; unit 151 -->

3. `kernel/Documentation/devicetree/bindings/phy/phy-rockchip-inno-usb2.yaml`

<!-- en PDF p.21; unit 152 -->

4. `kernel/Documentation/devicetree/bindings/phy/phy-rockchip-usbdp.yaml`

<!-- en PDF p.21; unit 153 -->

5. `kernel/Documentation/devicetree/bindings/phy/phy/phy-rockchip-naneng-combphy.txt` (путь источника).

<!-- en PDF p.21; unit 154 -->

### 4.1 DTSI USB уровня чипа

<!-- en PDF p.21; unit 155 -->

Основные узлы контроллеров и PHY RK3576 приведены ниже. Они задают общие ресурсы и свойства, поэтому разработчикам не рекомендуется их изменять. Путь исходного DTSI: `arch/arm64/boot/dts/rockchip/RK3576.dtsi`. Таблица 9. Интерфейсы USB и DTS-узлы RK3576.

<!-- en PDF p.21; unit 156 -->

| Интерфейс USB (схема) | DTS-узел контроллера USB | DTS-узел USB PHY |
| --- | --- | --- |
| USB3 OTG0 | usb_drd0_dwc3 | u2phy0<br>u2phy0_otg<br>usbdp_phy<br>usbdp_phy_u3 |
| USB3 OTG1 | usb_drd1_dwc3 | u2phy1<br>u2phy1_otg<br>combphy1_psu |

<!-- en PDF p.21; unit 157 -->

DTSI-узлы контроллеров USB:

<!-- en PDF p.21; unit 158 -->

```text
#USB3.1 OTG0 Controller
usb_drd0_dwc3: usb@23000000 {
        compatible = "rockchip,rk3576-dwc3", "snps,dwc3";
        ......
};

#USB3.1 OTG1 Controller
usb_drd1_dwc3: usb@23400000 {
        compatible = "rockchip,rk3576-dwc3", "snps,dwc3";
        ......
};
```

<!-- en PDF p.21; unit 159 -->

DTSI-узлы USB PHY. PHY и контроллеры соответствуют друг другу и должны настраиваться парами. Внутренние соединения — рисунок 1 и таблица 9. Свойство phys узла контроллера связывает его с нужным PHY.

<!-- en PDF p.22; unit 160 -->

```text
usb2phy_grf: syscon@2602e000 {
        compatible = "rockchip,RK3576-usb2phy-grf", "syscon",
                     "simple-mfd";
        ......

        // USB2.0 PHY0
        u2phy0: usb2-phy@0 {
                compatible = "rockchip,RK3576-usb2phy";
                ......
                u2phy0_otg: otg-port {
                        #phy-cells = <0>;
                        status = "disabled";
                };
        };

        // USB2.0 PHY1
        u2phy1: usb2-phy@2000 {
                compatible = "rockchip,RK3576-usb2phy";
                ......
                u2phy1_otg: otg-port {
                        #phy-cells = <0>;
                        status = "disabled";
                };
        };
};

#USB3.1/DP Combo PHY
usbdp_phy: phy@2b010000 {
        compatible = "rockchip,rk3576-usbdp-phy";
        ......
        usbdp_phy_dp: dp-port {
                #phy-cells = <0>;
                status = "disabled";
        };

        usbdp_phy_u3: u3-port {
                #phy-cells = <0>;
                status = "disabled";
        };
};

#USB3.1/SATA/PCIe PHY1
combphy1_psu: phy@2b060000 {
        compatible = "rockchip,rk3576-naneng-combphy";
        ......
};
```

<!-- en PDF p.23; unit 161 -->

### 4.2 Полнофункциональный USB 3.1/DP DTS

<!-- en PDF p.23; unit 162 -->

См. usbc0 в `arch/arm64/boot/dts/rockchip/rk3576-evb1.dtsi`.

<!-- en PDF p.23; unit 163 -->

```text
// USB2.0 PHY Configuration Property "rockchip,typec-vbus-det", indicating support for
hardware designs with Type-C VBUS_DET constantly pulled high
&u2phy0_otg {
        rockchip,typec-vbus-det;
};

// USB3.1/DP PHY, configure properties "sbu1-dc-gpios" and "sbu2-dc-gpios" according to
hardware design
&usbdp_phy {
        orientation-switch;
        svid = <0xff01>;
        sbu1-dc-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
        sbu2-dc-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;

        port {
                #address-cells = <1>;
                #size-cells = <0>;
                usbdp_phy_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };

                usbdp_phy_dp_altmode_mux: endpoint@1 {
                        reg = <1>;
                        remote-endpoint = <&dp_altmode_mux>;
                };
        };
};

// USB3.1 OTG0 Controller
&usb_drd0_dwc3 {
        dr_mode = "otg";
        usb-role-switch;
        port {
                usb_drd0_role_switch: endpoint {
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

// VBUS GPIO Configuration, controlled by the Type-C controller chip driver
vbus5v0_typec: vbus5v0-typec {
        compatible = "regulator-fixed";
        regulator-name = "vbus5v0_typec";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio0 RK_PD1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_device>;
        pinctrl-names = "default";
        pinctrl-0 = <&usb_otg0_pwren>;
};

// Configure external Type-C controller chip HUSB311
// Configure properties "I2C/interrupts/vbus-supply/usb_con" according to actual hardware
design
&i2c2 {
        status = "okay";

        usbc0: husb311@4e {
                compatible = "hynetek,husb311"; // Note 1
                reg = <0x4e>;
                interrupt-parent = <&gpio0>;
                interrupts = <RK_PA5 IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
                pinctrl-0 = <&usbc0_int>;
                vbus-supply = <&vbus5v0_typec>;
                status = "okay";

                port {
                        usbc0_role_sw: endpoint {
                                remote-endpoint = <&usb_drd0_role_switch>;
                        };
                };

                usb_con: connector {
                        compatible = "usb-c-connector";
                        label = "USB-C";
                        data-role = "dual";
                        power-role = "dual";
                        try-power-role = "sink";
                        op-sink-microwatt = <1000000>;

                        // Configure charging/supplying capability according to actual
hardware design
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
                                #address-cells = <1>;
                                #size-cells = <0>;

                                port@0 {
                                        reg = <0>;
                                        usbc0_orien_sw: endpoint {
                                                remote-endpoint =
<&usbdp_phy_orientation_switch>;
                                        };
                                };

                                port@1 {
                                        reg = <1>;
                                        dp_altmode_mux: endpoint {
                                                remote-endpoint =
<&usbdp_phy_dp_altmode_mux>;
                                        };
                                };
                        };
                };
        };
};
```

<!-- en PDF p.25; unit 166 -->

Примечание: изменения ПО при замене HUSB311 на FUSB302/AW35615/AW35615; повтор AW35615 сохранён из источника.

<!-- en PDF p.25; unit 167 -->

1. DTS: достаточно следующих небольших изменений конфигурации HUSB311.

<!-- en PDF p.25; unit 168 -->

```text
// Configure external Type-C controller chip HUSB311
&i2c2 {
        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                ...... // The rest is the same as HUSB311
        };
};
```

<!-- en PDF p.25; unit 169 -->

2. Драйвер: изменить механизм irq wakeup FUSB302, чтобы поддержать различные сценарии ожидания с отключённым или включённым питанием VBUS.

<!-- en PDF p.25; unit 170 -->

```text
diff --git a/drivers/usb/typec/tcpm/fusb302.c b/drivers/usb/typec/tcpm/fusb302.c
index 77a050cd2e88..72bef94887b4 100644
--- a/drivers/usb/typec/tcpm/fusb302.c
+++ b/drivers/usb/typec/tcpm/fusb302.c
@@ -105,6 +105,7 @@ struct fusb302_chip {
        bool vbus_on;
        bool charge_on;
        bool vbus_present;
+       bool wakeup;
        enum typec_cc_polarity cc_polarity;
        enum typec_cc_status cc1;
        enum typec_cc_status cc2;
@@ -1769,7 +1770,8 @@ static int fusb302_probe(struct i2c_client *client,
                dev_err(dev, "cannot request IRQ for GPIO Int_N, ret=%d", ret);
                goto tcpm_unregister_port;
        }
-       enable_irq_wake(chip->gpio_int_n_irq);
+       chip->wakeup = device_property_read_bool(dev, "wakeup-source");
+       device_init_wakeup(dev, true);
        i2c_set_clientdata(client, chip);

        return ret;
@@ -1788,7 +1790,7 @@ static void fusb302_remove(struct i2c_client *client)
 {
        struct fusb302_chip *chip = i2c_get_clientdata(client);

-       disable_irq_wake(chip->gpio_int_n_irq);
+       device_init_wakeup(chip->dev, false);
        free_irq(chip->gpio_int_n_irq, chip);
        kthread_destroy_worker(chip->irq_worker);
        cancel_delayed_work_sync(&chip->bc_lvl_handler);
@@ -1809,6 +1811,11 @@ static int fusb302_pm_suspend(struct device *dev)

        /* Make sure any pending irq_work is finished before the bus suspends */
        kthread_flush_worker(chip->irq_worker);
+
+       if (device_may_wakeup(dev) && (!chip->vbus_on || chip->wakeup))
+               enable_irq_wake(chip->gpio_int_n_irq);
+       else
+               disable_irq(chip->gpio_int_n_irq);
        return 0;
 }

@@ -1819,6 +1826,11 @@ static int fusb302_pm_resume(struct device *dev)
        u8 pwr;
        int ret = 0;

+       if (device_may_wakeup(dev) && (!chip->vbus_on || chip->wakeup))
+               disable_irq_wake(chip->gpio_int_n_irq);
+       else
+               enable_irq(chip->gpio_int_n_irq);
+
        /*
         * When the power of fusb302 is lost or i2c read failed in PM S/R
         * process, we must reset the tcpm port first to ensure the devices
```

<!-- en PDF p.27; unit 172 -->

### 4.3 DTS Type-C → Type-A USB 3.1/DP

<!-- en PDF p.27; unit 173 -->

См. `arch/arm64/boot/dts/rockchip/RK3576-evb2.dtsi`.

<!-- en PDF p.27; unit 174 -->

```text
#USB2.0 PHY configuration for "phy-supply" attribute, used to control VBUS output at 5V
&u2phy0_otg {
        phy-supply = <&vcc5v0_otg>;
};

#VBUS GPIO configuration, controlled by this GPIO in the USB2.0 PHY driver
vcc5v0_otg: vcc5v0-otg {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_otg";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio0 RK_PD1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_device>;
        pinctrl-names = "default";
        pinctrl-0 = <&usb_otg0_pwren>;
};

#USB3.1/DP PHY0, configure DP to use lane2/3, the driver will automatically allocate lane0/1
for USB3.1 Rx/Tx
#If the hardware design uses DP on lane0/1, then "rockchip,dp-lane-mux = <0 1>" should be
configured here
#Note: Even if DP is not supported in the actual circuit, "rockchip,dp-lane-mux" must be
configured, otherwise the USBDP PHY driver cannot automatically allocate lanes to USB3.1
&usbdp_phy {
        rockchip,dp-lane-mux = <2 3>;
};

#USB3.1 OTG0 Controller
#Set "dr_mode" to "otg" and configure the "extcon" attribute to support software switching
between Device/Host mode
&usb_drd0_dwc3 {
        dr_mode = "otg";
        extcon = <&u2phy0>;
        status = "okay";
};
```

<!-- en PDF p.27; unit 175 -->

### 4.4 DTS Type-C → Type-A/Micro USB 2.0/DP

<!-- en PDF p.27; unit 176 -->

См. `arch/arm64/boot/dts/rockchip/RK3576-test2.dtsi`.

<!-- en PDF p.27; unit 177 -->

```text
# USB2.0 PHY0 Configuration
# Configure the property "phy-supply" to control the VBUS output of 5V
# Configure the property "rockchip,sel-pipe-phystatus", indicating the selection of GRF to
control the pipe phystatus, replacing the control of USBDP PHY
# Configure the property "rockchip,dis-u2-susphy", where otg mode is an option, indicating
the function to close the USB2 PHY driver dynamically entering suspend mode is optional
&u2phy0_otg {
        vbus-supply = <&vcc5v0_otg>;
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

# VBUS GPIO Configuration, controlling this GPIO in the USB2.0 PHY driver
vcc5v0_otg: vcc5v0-otg {
        ...
};

# USB3.1/DP PHY, configure DP to use lanes 0/1/2/3
# According to the actual hardware design, configure the property "rockchip,dp-lane-mux"
# Configure the property maximum-speed = "high-speed", to notify the USBDP PHY driver to
restrict USB to USB2.0 only
&usbdp_phy {
        maximum-speed = "high-speed";
        rockchip,dp-lane-mux = < 0 1 2 3 >;
        status = "okay";
};

&usbdp_phy_dp {
        status = "okay";
};

&usbdp_phy_u3 {
        status = "okay";
};

# Configure the property "maximum-speed", to notify the DWC3 driver to restrict USB to
USB2.0 only
# Configure the property "snps,dis_u2_susphy_quirk", to disable the controller hardware's
suspend usb2 phy function, improving the stability of USB communication
# Configure the property "snps,usb2-lpm-disable", to disable the controller's Host mode LPM
function, improving the compatibility of USB peripherals
&usb_drd0_dwc3 {
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        extcon = <&u2phy0>;
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        status = "okay";
};
```

<!-- en PDF p.29; unit 179 -->

### 4.5 DTS Type-C USB 2.0 only

<!-- en PDF p.29; unit 180 -->

Вариант 1. Внешний Type-C-контроллер в схеме, поддерживается PD.

<!-- en PDF p.29; unit 181 -->

```text
#USB2.0 PHY0 registers typec orientation switch, used for interaction with the TCPM
subsystem, to obtain USB hot-plug information
&u2phy0 {
        orientation-switch;
        status = "okay";

        port {
                u2phy0_orientation_switch: endpoint {
                        remote-endpoint = <&usbc0_orien_sw>;
                };
        };
};

#USB2.0 PHY0 OTG configuration
#Configuration property "rockchip,sel-pipe-phystatus", indicates the selection of GRF
control pipe phystatus, replacing the control of USBDP PHY
#Configuration property "rockchip,typec-vbus-det", indicates support for Type-C VBUS_DET
hardware designs that are always pulled high
#Configuration property "rockchip,dis-u2-susphy", optional, indicates disabling the USB2 PHY
driver's dynamic entry into suspend mode function
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,typec-vbus-det;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#Configure the USBDP CombPHY parent node
#Note: The usbdp_phy node must be correctly configured according to whether the actual
hardware circuit USBDP CombPHY is powered.
#Case 1. If the actual hardware circuit CombPHY is designed to be powered, then disable all
relevant parent nodes and child nodes of usbdp_phy, keeping the USBDP PHY in an
uninitialized state to achieve the lowest power consumption
&usbdp_phy {
        status = "disabled";
};
#Case 2. If the actual hardware circuit CombPHY is not powered, then enable the usbdp_phy
node and disable related child nodes to prevent system startup exceptions or USB download
function exceptions
&usbdp_phy {
        rockchip,usbdpphy-clamp; /* To avoid power-off affecting bus access and Logic
leakage to USBDP PHY */
        maximum-speed = "high-speed"; /* Limit u2 only, to avoid initializing USBDP PHY */
        status = "okay";
};

#Configure the USBDP CombPHY child nodes
&usbdp_phy_dp {
        status = "disabled";
};

&usbdp_phy_u3 {
        status = "disabled";
};

#Configure the DP controller
&dp {
        status = "disabled";
};

#Configure the USB3.1 OTG0 Controller
#Configure "phys = <&u2phy0_otg>", which means not to reference the USBDP PHY
#Configure maximum-speed = "high-speed", to inform the DWC3 driver to limit USB to USB2.0
only
#Configuration property "snps,dis_u2_susphy_quirk", to disable the controller's hardware
suspend usb2 phy function, improving the stability of USB communication
#Configuration property "snps,usb2-lpm-disable", to disable the controller's Host mode LPM
function, improving the compatibility of USB peripherals
&usb_drd0_dwc3 {
        dr_mode = "otg";
        status = "okay";
        maximum-speed = "high-speed";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        usb-role-switch;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        port {
                usb_drd0_role_switch: endpoint {
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#Configure the external Type-C controller chip HUSB311
#Properties "I2C/interrupts/vbus-supply/usb_con" must be configured according to the actual
hardware design
#The property usbc0_orien_sw's remote-endpoint must be set to <&u2phy0_orientation_switch>
&i2c2 {
        status = "okay";
        usbc0: husb311@4e {
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                interrupt-parent = <&gpio0>;
                interrupts = <RK_PC4 IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
                pinctrl-0 = <&usbc0_int>;
                vbus-supply = <&vbus5v0_typec>;
                status = "okay";

                port {
                usbc0_role_sw: endpoint {
                        remote-endpoint = <&usb_drd0_role_switch>;
                };
        };

        usb_con: connector {
                compatible = "usb-c-connector";
                label = "USB-C";
                data-role = "dual";
                power-role = "dual";
                ......
                port {
                        usbc0_orien_sw: endpoint {
                                remote-endpoint = <&u2phy0_orientation_switch>;
                        };
                };
        };
};
```

<!-- en PDF p.31; unit 184 -->

Вариант 2. Без внешнего Type-C-контроллера, только Device. DTS Type-C USB 2.0 Device:

<!-- en PDF p.31; unit 185 -->

```text
#USB2.0 PHY0 OTG configuration
#Configuration property "rockchip,sel-pipe-phystatus", indicates the selection of GRF
control pipe phystatus, replacing the control of USBDP PHY
#Configuration property "rockchip,dis-u2-susphy", a required option, indicates disabling the
USB2 PHY driver's dynamic entry into suspend mode function
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#Configure the USBDP CombPHY parent node
#Note: The usbdp_phy node must be correctly configured according to whether the actual
hardware circuit USBDP CombPHY is powered.
#Case 1. If the actual hardware circuit CombPHY is designed to be powered, then disable all
relevant parent nodes and child nodes of usbdp_phy, keeping the USBDP PHY in an
uninitialized state to achieve the lowest power consumption
&usbdp_phy {
        status = "disabled";
};
#Case 2. If the actual hardware circuit CombPHY is not powered, then enable the usbdp_phy
node and disable related child nodes to prevent system startup exceptions or USB download
function exceptions
&usbdp_phy {
        rockchip,usbdpphy-clamp; /* To avoid power-off affecting bus access and Logic
leakage to USBDP PHY */
        maximum-speed = "high-speed"; /* Limit u2 only, to avoid initializing USBDP PHY */
        status = "okay";
};
#Configure the USBDP CombPHY child nodes
&usbdp_phy_dp {
        status = "disabled";
};

&usbdp_phy_u3 {
        status = "disabled";
};

#Configure the DP controller
&dp {
        status = "disabled";
};

#Configure the USB3.1 OTG0 Controller
#Configure dr_mode = "peripheral", to inform the DWC3 driver to initialize in Device only
mode
#Configure "phys = <&u2phy0_otg>", which means not to reference the USBDP PHY
#Configure maximum-speed = "high-speed", to inform the DWC3 driver to limit USB to USB2.0
only
#Configuration property "snps,dis_u2_susphy_quirk", to disable the controller's hardware
suspend usb2 phy function, improving the stability of USB communication
&usb_drd0_dwc3 {
        dr_mode = "peripheral";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
        status = "okay";
};
```

<!-- en PDF p.32; unit 187 -->

Вариант 3. Без внешнего Type-C-контроллера, поддерживается OTG; нужна схема преобразования уровня CC в ID.

<!-- en PDF p.32; unit 188 -->

```text
#USB2.0 PHY0 OTG configuration
#Configuration property "rockchip,sel-pipe-phystatus", indicates the selection of GRF
control pipe phystatus, replacing the control of USBDP PHY
#Configuration property "rockchip,dis-u2-susphy", otg mode is an optional, indicates
disabling the USB2 PHY driver's dynamic entry into suspend mode function
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#Configure the USBDP CombPHY parent node
#Note: The usbdp_phy node must be correctly configured according to whether the actual
hardware circuit USBDP CombPHY is powered.
#Case 1. If the actual hardware circuit CombPHY is designed to be powered, then disable the
parent node and child nodes of usbdp_phy, keeping the USBDP PHY in an uninitialized state to
achieve the lowest power consumption
&usbdp_phy {
        status = "disabled";
};
#Case 2. If the actual hardware circuit CombPHY is not powered, then enable the usbdp_phy
node and disable related child nodes to prevent system startup exceptions or USB download
function exceptions
&usbdp_phy {
        rockchip,usbdpphy-clamp; /* To avoid power-off affecting bus access and Logic
leakage to USBDP PHY */
        maximum-speed = "high-speed"; /* Limit u2 only, to avoid initializing USBDP PHY */
        status = "okay";
};

#Configure the USBDP CombPHY child nodes
&usbdp_phy_dp {
        status = "disabled";
};

&usbdp_phy_u3 {
        status = "disabled";
};

#Configure the DP controller
&dp {
        status = "disabled";
};

#Configure the USB3.1 OTG0 Controller
#Configure dr_mode = "otg"
#Configure "phys = <&u2phy0_otg>", which means not to reference the USBDP PHY
#Configure maximum-speed = "high-speed", to inform the DWC3 driver to limit USB to USB2.0
only
#Configure "extcon" property, to support automatic switching between Device/Host mode
#Configuration property "snps,dis_u2_susphy_quirk", to disable the controller's hardware
suspend usb2 phy function, improving the stability of USB communication
#Configuration property "snps,usb2-lpm-disable", to disable the controller's Host mode LPM
function, improving the compatibility of USB peripherals
&usb_drd0_dwc3 {
        dr_mode = "otg";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        extcon = <&u2phy0>;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        status = "okay";
};
```

<!-- en PDF p.34; unit 190 -->

### 4.6 DTS Type-A USB 3.1

<!-- en PDF p.34; unit 191 -->

См. конфигурацию USB3 OTG1 в `arch/arm64/boot/dts/rockchip/rk3576-evb1.dtsi`.

<!-- en PDF p.34; unit 192 -->

```text
#USB2.0 PHY1 configuration for "phy-supply" attribute to control VBUS output at 5V
&u2phy1_otg {
        phy-supply = <&vcc5v0_host>;
}

#VBUS GPIO configuration to control this GPIO in the USB2.0 PHY driver
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio0 RK_PC7 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_device>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#Enable USB3.1/SATA/PCIe Combo PHY
&combphy1_psu {
        status = "okay";
};

#Configure USB3.1 OTG1 Controller
&usb_drd1_dwc3 {
        dr_mode = "host";
        status = "okay";
};
```

<!-- en PDF p.34; unit 193 -->

### 4.7 DTS при отсутствии питания USB PHY

<!-- en PDF p.34; unit 194 -->

Внешнее питание USBDP PHY (OTG0 USB3.1/DP) и ComboPHY1 (OTG1 USB3.1/PCIe1/SATA1) допускается отключить, снизив потребление системы и упростив схему. Но соответствующий DTS обязательно изменить, иначе возможны ошибки загрузки системы и USB.

<!-- en PDF p.35; unit 195 -->

#### 4.7.1 USBDP PHY без питания: DTS

<!-- en PDF p.35; unit 196 -->

```text
&usbdp_phy {
        rockchip,usbdpphy-clamp; /* Prevent power-off from affecting bus access and Logic
leakage to USBDP PHY */
        maximum-speed = "high-speed"; /* Restrict u2 only, to avoid initializing USBDP PHY
*/
        status = "okay";
};

&usbdp_phy_dp {
        status = "disabled";
};

&usbdp_phy_u3 {
        status = "disabled";
};
```

<!-- en PDF p.35; unit 197 -->

Лог активации ядром:

<!-- en PDF p.35; unit 198 -->

```text
rockchip-usbdp-phy 2b010000.phy: Failed to enable usbdpphy because clamp is set
rockchip-usbdp-phy: probe of 2b010000.phy failed with error -95
```

<!-- en PDF p.35; unit 199 -->

Также отключить USB3-загрузку в инструменте прошивки, иначе загрузка Maskrom не удастся. Windows config.ini: `USB3_TRANSFER=FALSE`; Linux config.ini: `usb3_transfer_on=false`.

<!-- en PDF p.35; unit 200 -->

#### 4.7.2 ComboPHY1 без питания: DTS

<!-- en PDF p.35; unit 201 -->

ComboPHY1 используется USB3.1 OTG1, но влияет и на доступ USB2 OTG1 к шине SoC. DTS зависит от того, используется ли OTG1 USB2.0.

<!-- en PDF p.35; unit 202 -->

1. USB3.1 OTG1 не используется, USB2.0 требуется.

<!-- en PDF p.35; unit 203 -->

```text
&combphy1_psu {
        rockchip,dis-u3otg1-port;
        status = "okay";
};

&usb_drd1_dwc3 {
        dr_mode = "host";
        phys = <&u2phy1_otg>, <&combphy1_psu PHY_TYPE_USB3>;  /* This must reference
combphy1_psu */
        phy-names = "usb2-phy", "usb3-phy";
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        status = "okay";
};
```

<!-- en PDF p.36; unit 205 -->

2. Не используются ни USB2.0, ни USB3.1 OTG1.

<!-- en PDF p.36; unit 206 -->

```text
&combphy1_psu {
        status = "disabled";
};

&usb_drd1_dwc3 {
        status = "disabled";
};
```

<!-- en PDF p.36; unit 207 -->

### 4.8 Замечания к Linux USB DT

<!-- en PDF p.36; unit 208 -->

#### 4.8.1 Важные свойства USB DT

<!-- en PDF p.36; unit 209 -->

##### 4.8.1.1 Свойства контроллера USB

<!-- en PDF p.36; unit 210 -->

1. usb-role-switch используется только стандартным Type-C с PD-контроллером; dr_mode обязательно otg. При другом dr_mode это свойство не задавать.

<!-- en PDF p.36; unit 211 -->

2. extcon динамически переключает OTG в схемах нестандартного Type-C (формулировка оригинала упоминает PD-контроллер), например Micro или Type-A, когда контроллер настроен в otg.

<!-- en PDF p.36; unit 212 -->

3. snps,dis_u2_susphy_quirk отключает аппаратный автоматический suspend USB2 PHY контроллером. Применяется прежде всего в USB2-only для устойчивости связи.

<!-- en PDF p.36; unit 213 -->

4. snps,usb2-lpm-disable отключает LPM контроллера в Host, прежде всего для совместимости периферии USB2-only.

<!-- en PDF p.36; unit 214 -->

##### 4.8.1.2 Свойства USB2 PHY

<!-- en PDF p.36; unit 215 -->

1. vbus-supply и phy-supply управляют выходом VBUS 5V, но для разных случаев: vbus-supply — OTG с динамическим VBUS; phy-supply — USB HOST, где 5V остаётся включённым после запуска.

<!-- en PDF p.36; unit 216 -->

2. rockchip,sel-pipe-phystatus задаёт GRF USB control register: phystatus управляется GRF вместо USBDP PHY. В USB2-only без включённого USBDP PHY это свойство обязательно, иначе USB не работает нормально.

<!-- en PDF p.36; unit 217 -->

3. rockchip,typec-vbus-det поддерживает схему с постоянно высоким Type-C VBUS_DET.

<!-- en PDF p.36; unit 218 -->

4. rockchip,dis-u2-susphy отключает динамический suspend в драйвере USB2 PHY; прежде всего <!-- en PDF p.37; unit 219 --> для USB2-only, чтобы сохранить выходную частоту PHY к контроллеру.

<!-- en PDF p.37; unit 220 -->

##### 4.8.1.3 Свойства USBDP Combo PHY

<!-- en PDF p.37; unit 221 -->

1. rockchip,dp-lane-mux задаёт линии DP в неполнофункциональных Type-C-схемах. DP поддерживает 2 или 4 линии. `rockchip,dp-lane-mux = <2, 3>;` сопоставляет DP Lane0 с PHY Lane2, DP Lane1 с PHY Lane3. `<0, 1, 2, 3>` означает прямое соответствие. Даже если схема использует только USB3.1 без DP, свойство обязательно, иначе драйвер не выделит линии USB3.1 автоматически.

<!-- en PDF p.37; unit 222 -->

2. `maximum-speed = "high-speed";` ограничивает USB до USB2.0 в драйвере USBDP PHY; задаётся именно в родительском узле usbdp_phy.

<!-- en PDF p.37; unit 223 -->

##### 4.8.1.4 Свойства USBC

<!-- en PDF p.37; unit 224 -->

1. usbc обычно дочерний узел i2c. Помимо compatible и reg, имеет port и connector. port задаёт role switch с контроллером USB. connector содержит основные свойства PD и узлы altmodes и ports; последние задают orientation switch и altmode mux.

<!-- en PDF p.37; unit 225 -->

2. sink-pdos и source-pdos узла connector задают напряжения, токи и возможности питания RK3576 как Sink и Source. Они должны соответствовать зарядной IC. Поля обязаны отвечать PD Spec; ключевые поля используют макросы `include/dt-bindings/usb/pd.h`.

<!-- en PDF p.37; unit 226 -->

## 5. Команды переключения USB OTG RK3576

<!-- en PDF p.37; unit 227 -->

SDK позволяет программно принудить Host/Peripheral независимо от аппаратного OTG ID либо Type-C. Linux-6.1 имеет два метода. Метод 1 требует правильного USB DTS и применим только к схемам без Type-C; метод 2 не имеет этих ограничений. Если корректность аппаратно-программной адаптации неясна, источник рекомендует метод 2. Метод 1 [Legacy]:

<!-- en PDF p.38; unit 228 -->

```text
#1.Force host mode
  echo host > /sys/devices/platform/2602e000.syscon/2602e000.syscon:usb2-phy@0/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/2602e000.syscon/2602e000.syscon:usb2-
phy@0/otg_mode
```

<!-- en PDF p.38; unit 229 -->

Метод 2 [New]:

<!-- en PDF p.38; unit 230 -->

```text
#1.Force host mode
  echo host > /sys/kernel/debug/usb/23000000.usb/mode
#2.Force peripheral mode
  echo device > /sys/kernel/debug/usb/23000000.usb/mode
```

<!-- en PDF p.38; unit 231 -->

## 6. Поддерживаемые Type-C-контроллеры

<!-- en PDF p.38; unit 232 -->

Таблица 17. Поддерживаемые Type-C-контроллеры.

<!-- en PDF p.38; unit 233 -->

| Модель Type-C-контроллера | Linux-6.1 | Описание |
| --- | --- | --- |
| ANX7411 | На испытаниях | Драйвер поддерживается; функции требуют дальнейших испытаний |
| AW35615 | Поддерживается | Приоритетно рекомендуется; хорошая совместимость с DisplayPort Alt Mode; полностью аппаратно и программно совместим с FUSB302 |
| ET7301B | Поддерживается | Полная аппаратная/программная совместимость с FUSB302, прим.1 |
| ET7303 | Поддерживается | Аппаратно совместим с FUSB302, драйвер близок RT1711, прим.2 |
| FUSB302 | Поддерживается | Распространённый чип платформы RK, прим.2 |
| HUSB311 | Поддерживается | Штатный чип RK3576 EVB; аппаратно совместим с FUSB302, драйвер несовместим, прим.3 |
| RT1711H | Поддерживается | Аппаратно совместим с FUSB302, драйвер близок ET7303, прим.4 |
| WUSB3801 | Не поддерживается | Нестандартная однопроводная связь, высокий уровень ошибок; стабильность не гарантируется |

<!-- en PDF p.38; unit 234 -->

Примечание 1. Linux-6.1 использует TCPM и TCPCI; теоретически может <!-- en PDF p.39; unit 235 --> работать со всеми контроллерами стандарта TCPCI, например ET7303/HUSB311/RT1711H.

Примечание 2. ET7303 в малом корпусе проверен на платформе RK; по сведениям источника, большого корпуса производитель пока не предлагает. Нужен CONFIG_TYPEC_ET7303. В примере usbc0 полнофункционального Type-C изменить только имя узла, reg и compatible.

Примечание 3. FUSB302 можно непосредственно заменить HUSB311; включить CONFIG_TYPEC_HUSB311, DTS — как в примечании 2.

Примечание 4. RT1711H аппаратно совместим с FUSB302/ET7303; драйвер близок ET7303. Включить CONFIG_TYPEC_RT1711H, DTS — как в примечании 2.

<!-- en PDF p.39; unit 236 -->

## 7. Справочные документы

<!-- en PDF p.39; unit 237 -->

1. Universal Serial Bus Type-C Cable and Connector Specification.

<!-- en PDF p.39; unit 238 -->

2. Universal Serial Bus Power Delivery Specification.

<!-- en PDF p.39; unit 239 -->

3. Rockchip Developer Guide USB EN.

<!-- en PDF p.39; unit 240 -->

4. Rockchip RK3576 Technical Reference Manual.

<!-- en PDF p.39; unit 241 -->

5. Аппаратные схемы RK3576 EVB1/EVB2/TEST1/TEST2.

## Различия источников и адаптация

Примеры отличаются регистром путей, именами узлов, комментариями и разбиением страниц. Приложение сохраняет отличающиеся блоки другого источника отдельно; это независимые примеры, не единый исполняемый сценарий. Данные потребления относятся только к указанным сценариям производителя, а не к проверкам плат сайтом.

Английский V1.2.0 расширяет §4.5 USB2-only: варианты питания родительского USBDP, rockchip,usbdpphy-clamp и maximum-speed. Полный код сохранён, старые китайские примеры отдельно. Оба источника называют два USB2 PHY, но в §3.2.1 перечисляют PHY1/PHY2/PHY3 — нерешённое противоречие. Английская фраза extcon неоднозначно упоминает нестандартный Type-C с PD, китайский контекст исключает стандартную PD-Type-C-схему. Проверять реальные Micro/Type-A, dr_mode и драйвер. Повтор AW35615, phy/phy и прописные RK3576 в путях сохранены.

## Отличающиеся исходные примеры другой версии

**CN PDF p.18 · #159**

```text
usb2phy_grf: syscon@2602e000 {
        compatible = "rockchip,RK3576-usb2phy-grf", "syscon",
                     "simple-mfd";
        ......

        // USB2.0 PHY0
        u2phy0: usb2-phy@0 {
                compatible = "rockchip,RK3576-usb2phy";
                ......
                u2phy0_otg: otg-port {
                        #phy-cells = <0>;
                        status = "disabled";
                };
        };

        // USB2.0 PHY1
        u2phy1: usb2-phy@2000 {
                compatible = "rockchip,RK3576-usb2phy";
                ......
                u2phy1_otg: otg-port {
                        #phy-cells = <0>;
                        status = "disabled";
                };
        };
};

#USB3.1/DP Combo PHY
usbdp_phy: phy@2b010000 {
        compatible = "rockchip,rk3576-usbdp-phy";
        ......
        usbdp_phy_dp: dp-port {
                #phy-cells = <0>;
                status = "disabled";
        };
```

**CN PDF p.19 · #160**

```text
        usbdp_phy_u3: u3-port {
                #phy-cells = <0>;
                status = "disabled";
        };
};

#USB3.1/SATA/PCIe PHY1
combphy1_psu: phy@2b060000 {
        compatible = "rockchip,rk3576-naneng-combphy";
        ......
};
```

**CN PDF p.19 · #163**

```text
#USB2.0 PHY配置属性"rockchip,typec-vbus-det"，表⽰⽀持Type-C VBUS_DET常拉⾼的硬件设计
&u2phy0_otg {
        rockchip,typec-vbus-det;
};

#USB3.1/DP PHY，需要根据硬件设计，配置属性"sbu1-dc-gpios"和"sbu2-dc-gpios"
&usbdp_phy {
        orientation-switch;
        svid = <0xff01>;
        sbu1-dc-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
        sbu2-dc-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;

        port {
                #address-cells = <1>;
                #size-cells = <0>;
                usbdp_phy_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };

                usbdp_phy_dp_altmode_mux: endpoint@1 {
                        reg = <1>;
                        remote-endpoint = <&dp_altmode_mux>;
                };
        };
};

#USB3.1 OTG0 Controller
&usb_drd0_dwc3 {
        dr_mode = "otg";
        usb-role-switch;
        port {
                usb_drd0_role_switch: endpoint {
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};
```

**CN PDF p.20 · #164**

```text
#VBUS GPIO配置，在Type-C控制器芯⽚驱动中控制该GPIO
vbus5v0_typec: vbus5v0-typec {
        compatible = "regulator-fixed";
        regulator-name = "vbus5v0_typec";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio0 RK_PD1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_device>;
        pinctrl-names = "default";
        pinctrl-0 = <&usb_otg0_pwren>;
};

#配置外置Type-C控制器芯⽚HUSB311
#需要根据实际的硬件设计，配置"I2C/interrupts/vbus-supply/usb_con"的属性
&i2c2 {
        status = "okay";

        usbc0: husb311@4e {
                compatible = "hynetek,husb311"; // 注意本 Note 1
                reg = <0x4e>;
                interrupt-parent = <&gpio0>;
                interrupts = <RK_PA5 IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
                pinctrl-0 = <&usbc0_int>;
                vbus-supply = <&vbus5v0_typec>;
                status = "okay";

                port {
                        usbc0_role_sw: endpoint {
                                remote-endpoint = <&usb_drd0_role_switch>;
                        };
                };

                usb_con: connector {
                        compatible = "usb-c-connector";
                        label = "USB-C";
                        data-role = "dual";
                        power-role = "dual";
                        try-power-role = "sink";
                        op-sink-microwatt = <1000000>;

                        // 须根据实际的硬件设计进⾏配置充电/供电能⼒
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
```

**CN PDF p.21 · #165**

```text
                                        vdo = <0xffffffff>;
                                };
                        };

                        ports {
                                #address-cells = <1>;
                                #size-cells = <0>;

                                port@0 {
                                        reg = <0>;
                                        usbc0_orien_sw: endpoint {
                                                remote-endpoint =
<&usbdp_phy_orientation_switch>;
                                        };
                                };

                                port@1 {
                                        reg = <1>;
                                        dp_altmode_mux: endpoint {
                                                remote-endpoint =
<&usbdp_phy_dp_altmode_mux>;
                                        };
                                };
                        };
                };
        };
```

**CN PDF p.21 · #168**

```text
#配置外置Type-C控制器芯⽚HUSB311
&i2c2 {
        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                ...... // 其它同HUSB311
        };
};
```

**CN PDF p.21 · #170**

```text
diff --git a/drivers/usb/typec/tcpm/fusb302.c b/drivers/usb/typec/tcpm/fusb302.c
index 77a050cd2e88..72bef94887b4 100644
--- a/drivers/usb/typec/tcpm/fusb302.c
+++ b/drivers/usb/typec/tcpm/fusb302.c
@@ -105,6 +105,7 @@ struct fusb302_chip {
        bool vbus_on;
        bool charge_on;
        bool vbus_present;
+       bool wakeup;
        enum typec_cc_polarity cc_polarity;
        enum typec_cc_status cc1;
        enum typec_cc_status cc2;
```

**CN PDF p.22 · #171**

```text
@@ -1769,7 +1770,8 @@ static int fusb302_probe(struct i2c_client *client,
                dev_err(dev, "cannot request IRQ for GPIO Int_N, ret=%d", ret);
                goto tcpm_unregister_port;
        }
-       enable_irq_wake(chip->gpio_int_n_irq);
+       chip->wakeup = device_property_read_bool(dev, "wakeup-source");
+       device_init_wakeup(dev, true);
        i2c_set_clientdata(client, chip);

        return ret;
@@ -1788,7 +1790,7 @@ static void fusb302_remove(struct i2c_client *client)
 {
        struct fusb302_chip *chip = i2c_get_clientdata(client);

-       disable_irq_wake(chip->gpio_int_n_irq);
+       device_init_wakeup(chip->dev, false);
        free_irq(chip->gpio_int_n_irq, chip);
        kthread_destroy_worker(chip->irq_worker);
        cancel_delayed_work_sync(&chip->bc_lvl_handler);
@@ -1809,6 +1811,11 @@ static int fusb302_pm_suspend(struct device *dev)

        /* Make sure any pending irq_work is finished before the bus suspends */
        kthread_flush_worker(chip->irq_worker);
+
+       if (device_may_wakeup(dev) && (!chip->vbus_on || chip->wakeup))
+               enable_irq_wake(chip->gpio_int_n_irq);
+       else
+               disable_irq(chip->gpio_int_n_irq);
        return 0;
 }

@@ -1819,6 +1826,11 @@ static int fusb302_pm_resume(struct device *dev)
        u8 pwr;
        int ret = 0;

+       if (device_may_wakeup(dev) && (!chip->vbus_on || chip->wakeup))
+               disable_irq_wake(chip->gpio_int_n_irq);
+       else
+               enable_irq(chip->gpio_int_n_irq);
+
        /*
         * When the power of fusb302 is lost or i2c read failed in PM S/R
         * process, we must reset the tcpm port first to ensure the devices
```

**CN PDF p.22 · #174**

```text
#USB2.0 PHY配置"phy-supply"属性，⽤于控制VBUS输出5V
&u2phy0_otg {
        phy-supply = <&vcc5v0_otg>;
};
```

**CN PDF p.23 · #175**

```text
#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_otg: vcc5v0-otg {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_otg";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio0 RK_PD1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_device>;
        pinctrl-names = "default";
        pinctrl-0 = <&usb_otg0_pwren>;
};

#USB3.1/DP PHY0，只需配置DP使⽤lane2/3,驱动会⾃动分配lane0/1给USB3.1 Rx/Tx
#如果硬件设计DP使⽤lane0/1，则此处应配置"rockchip,dp-lane-mux = <0 1>"
#注意：实际电路中，即使未⽀持DP，也需要配置"rockchip,dp-lane-mux"，否则USBDP PHY驱动⽆法⾃
动分配lane给USB3.1
&usbdp_phy {
        rockchip,dp-lane-mux = <2 3>;
};

#USB3.1 OTG0 Controller
#配置"dr_mode"为"otg"，同时配置"extcon"属性，才能⽀持软件切换Device/Host mode
&usb_drd0_dwc3 {
        dr_mode = "otg";
        extcon = <&u2phy0>;
        status = "okay";
};
```

**CN PDF p.23 · #178**

```text
#USB2.0 PHY0配置
#配置属性"phy-supply"，⽤于控制VBUS输出5V
#配置属性"rockchip,sel-pipe-phystatus"，表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,dis-u2-susphy"，otg mode为可选项，表⽰关闭USB2 PHY驱动动态进⼊suspend
mode的功能
&u2phy0_otg {
        vbus-supply = <&vcc5v0_otg>;
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_otg: vcc5v0-otg {
        ...
};
```

**CN PDF p.24 · #179**

```text
#USB3.1/DP PHY，配置DP使⽤lane0/1/2/3
#需要根据实际的硬件设计，配置属性"rockchip,dp-lane-mux"
#配置属性maximum-speed = "high-speed"，通知USBDP PHY驱动将USB限制为USB2.0 only
&usbdp_phy {
        maximum-speed = "high-speed";
        rockchip,dp-lane-mux = < 0 1 2 3 >;
        status = "okay";
};

&usbdp_phy_dp {
        status = "okay";
};

&usbdp_phy_u3 {
        status = "okay";
};

#配置属性"maximum-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置属性"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的
稳定性
#配置属性"snps,usb2-lpm-disable"，关闭控制器Host mode的LPM功能，提⾼USB外设的兼容性
&usb_drd0_dwc3 {
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        extcon = <&u2phy0>;
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        status = "okay";
};
```

**CN PDF p.24 · #182**

```text
#USB2.0 PHY0注册typec orientation switch，⽤于与TCPM⼦系统交互，获取USB热拔插的信息
&u2phy0 {
        orientation-switch;
        status = "okay";

        port {
                u2phy0_orientation_switch: endpoint {
                        remote-endpoint = <&usbc0_orien_sw>;
                };
        };
};

#USB2.0 PHY0 OTG配置
#配置属性"rockchip,sel-pipe-phystatus",表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,typec-vbus-det"，表⽰⽀持Type-C VBUS_DET常拉⾼的硬件设计
#配置属性"rockchip,dis-u2-susphy"，可选项，表⽰关闭USB2 PHY驱动动态进⼊suspend mode的功能
&u2phy0_otg {
```

**CN PDF p.25 · #183**

```text
        rockchip,sel-pipe-phystatus;
        rockchip,typec-vbus-det;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#disable USBDP PHY0的所有相关节点，让USBDP PHY0处于未初始化状态，达到最低功耗的⽬的
&usbdp_phy {
        status = "disabled";
};

&usbdp_phy_dp {
        status = "disabled";
};

&usbdp_phy_u3 {
        status = "disabled";
};

&dp {
        status = "disabled";
};

#配置USB3.1 OTG0 Controller
#配置"phys = <&u2phy0_otg>",即不引⽤USBDP PHY
#配置maximum-speed = "high-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置属性"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的
稳定性
#配置属性"snps,usb2-lpm-disable"，关闭控制器Host mode的LPM功能，提⾼USB外设的兼容性
&usb_drd0_dwc3 {
        dr_mode = "otg";
        status = "okay";
        maximum-speed = "high-speed";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        usb-role-switch;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        port {
                usb_drd0_role_switch: endpoint {
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#配置外置Type-C控制器芯⽚HUSB311
#需要根据实际的硬件设计，配置"I2C/interrupts/vbus-supply/usb_con"的属性
#需要配置usbc0_orien_sw的属性remote-endpoint = <&u2phy0_orientation_switch>
&i2c2 {
        status = "okay";
        usbc0: husb311@4e {
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                interrupt-parent = <&gpio0>;
                interrupts = <RK_PC4 IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
```

**CN PDF p.26 · #184**

```text
                pinctrl-0 = <&usbc0_int>;
                vbus-supply = <&vbus5v0_typec>;
                status = "okay";

                port {
                        usbc0_role_sw: endpoint {
                                remote-endpoint = <&usb_drd0_role_switch>;
                        };
                };

                usb_con: connector {
                        compatible = "usb-c-connector";
                        label = "USB-C";
                        data-role = "dual";
                        power-role = "dual";
                        ......
                        port {
                                usbc0_orien_sw: endpoint {
                                        remote-endpoint =
<&u2phy0_orientation_switch>;
                                };
                        };
                };
        };
```

**CN PDF p.26 · #186**

```text
#USB2.0 PHY0 OTG配置
#配置属性"rockchip,sel-pipe-phystatus",表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,dis-u2-susphy"，必选项，表⽰关闭USB2 PHY驱动动态进⼊suspend mode的功能
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#disable USBDP PHY的所有相关节点，让USBDP PHY0处于未初始化状态，达到最低功耗的⽬的
&usbdp_phy {
        status = "disabled";
};

&usbdp_phy_dp {
        status = "disabled";
};

&usbdp_phy_u3 {
        status = "disabled";
}

#配置USB3.1 OTG0 Controller
#配置dr_mode = "peripheral"，通知DWC3驱动初始化为Device only mode
#配置"phys = <&u2phy0_otg>",即不引⽤USBDP PHY
```

**CN PDF p.27 · #187**

```text
#配置maximum-speed = "high-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置属性"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的
稳定性
&usb_drd0_dwc3 {
        dr_mode = "peripheral";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
        status = "okay";
};
```

**CN PDF p.27 · #189**

```text
#USB2.0 PHY0 OTG配置
#配置属性"rockchip,sel-pipe-phystatus",表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,dis-u2-susphy"，otg mode为可选项，表⽰关闭USB2 PHY驱动动态进⼊suspend
mode的功能
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#disable USBDP PHY的所有相关节点，让USBDP PHY0处于未初始化状态，达到最低功耗的⽬的
&usbdp_phy {
        status = "disabled";
};

&usbdp_phy_dp {
        status = "disabled";
};

&usbdp_phy_u3 {
        status = "disabled";
}

#配置USB3.1 OTG0 Controller
#配置dr_mode = "otg"
#配置"phys = <&u2phy0_otg>",即不引⽤USBDP PHY
#配置maximum-speed = "high-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置"extcon"属性，才能⽀持⾃动切换Device/Host mode
#配置属性"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的
稳定性
#配置属性"snps,usb2-lpm-disable"，关闭控制器Host mode的LPM功能，提⾼USB外设的兼容性
&usb_drd0_dwc3 {
        dr_mode = "otg";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        extcon = <&u2phy0>;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        status = "okay";
```

**CN PDF p.28 · #190**

```text
};
```

**CN PDF p.28 · #193**

```text
#USB2.0 PHY1配置"phy-supply"属性，⽤于控制VBUS输出5V
&u2phy1_otg {
        phy-supply = <&vcc5v0_host>;
}

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio0 RK_PC7 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_device>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#使能USB3.1/SATA/PCIe Combo PHY
&combphy1_psu {
        status = "okay";
};

#配置USB3.1 OTG1 Controller
&usb_drd1_dwc3 {
        dr_mode = "host";
        status = "okay";
};
```

**CN PDF p.29 · #197**

```text
&usbdp_phy {
        rockchip,usbdpphy-clamp; /* 避免断电影响到总线访问和Logic漏电到USBDP PHY */
        maximum-speed = "high-speed"; /* 限制 u2 only，避免初始化 USBDP PHY */
        status = "okay";
};

&usbdp_phy_dp {
        status = "disabled";
};

&usbdp_phy_u3 {
        status = "disabled";
};
```

**CN PDF p.29 · #204**

```text
&combphy1_psu {
        rockchip,dis-u3otg1-port;
        status = "okay";
};

&usb_drd1_dwc3 {
        dr_mode = "host";
        phys = <&u2phy1_otg>, <&combphy1_psu PHY_TYPE_USB3>;  /* 这⾥必须要引⽤
combphy1_psu */
        phy-names = "usb2-phy", "usb3-phy";
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        status = "okay";
};
```

**CN PDF p.31 · #228**

```text
#1.Force host mode
  echo host > /sys/devices/platform/2602e000.syscon/2602e000.syscon:usb2-
phy@0/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/2602e000.syscon/2602e000.syscon:usb2-
phy@0/otg_mode
```

{% endraw %}
