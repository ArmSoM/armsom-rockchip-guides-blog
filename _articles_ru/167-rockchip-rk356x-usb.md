---
title: "RK356x USB: контроллеры, PHY, интерфейсные схемы и DTS"
description: "RK356x USB: контроллеры, PHY, интерфейсные схемы и DTS — V1.4.0"
translation_key: "167-rockchip-rk356x-usb"
slug: "167-rockchip-rk356x-usb"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
reference_products: ["Sige3", "CM3", "AIM3", "KVM"]
products: []
tags: [ArmSoM, Rockchip, USB, Type-C, PHY, DTS]
excerpt: "RK356x USB: контроллеры, PHY, интерфейсные схемы и DTS — V1.4.0"
---

{% raw %}

Полное техническое содержание китайского и английского руководств Rockchip RK356x USB V1.4.0. Область: RK356x, Linux 4.19+. Это платформенный справочник ArmSoM, не обещание поддержки всех плат. Проверяйте плату, SDK/BSP, ветку ядра, выводы USB/DP, питание VBUS и Type-C-контроллер. Аппаратная проверка ArmSoM не проводилась; результаты и вывод — примеры оригинала. Китайская версия использует китайские рисунки, остальные — английские оригиналы.

Обзор исходника: аппаратная архитектура и драйверы USB-контроллеров и USB PHY RK356x для гибкого проектирования под требования продукта и быстрой разработки. Область исходной таблицы: RK3566 и RK3568, Linux-4.19 и новее.

> Статусы поддержки и отладки относятся к периоду исходника, а не текущему SDK. Питание и соединения должны соответствовать номиналам компонентов. Команды требуют проверки и адаптированного устройства; здесь они не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. RK356x контроллеры USB и PHY: введение

Таблица 1. Поддерживаемые USB-контроллеры RK356x.

| Чип/контроллер | USB 2.0 HOST (EHCI/OHCI) | USB 3.0/2.0 OTG (DWC3/xHCI) |
| --- | --- | --- |
| RK3566 | 2 | 2 (OTG 2.0 + Host 3.0) |
| RK3568 | 2 | 2 (OTG 3.0+ Host 3.0) |

Таблица 2. Поддерживаемые USB PHY RK356x.

| Чип/PHY | USB 2.0 ComboPHY | USB 3.0/SATA/QSGMII ComboPHY |
| --- | --- | --- |
| RK3566 | 2 [2 × port] | 1 |
| RK3568 | 2 [2 × port] | 2 |

Примечания:

1. N обозначает N независимых USB-контроллеров.

2. [2 × ports] обозначает два порта на PHY.

3. EHCI/OHCI означает интеграцию EHCI и OHCI, DWC3/xHCI — DWC3 и xHCI.

4. DWC3 OTG RK3566 поддерживает только OTG 2.0, максимум 480Mbps, не OTG 3.0. RK3568 поддерживает OTG 3.0. Оба имеют один USB 3.0 Host и два USB 2.0 Host. На рис. 1-1 показаны связи RK3568:

1. USB 3.0 OTG и SATA_0 совместно используют USB3/SATA Combo PHY_0.

2. USB 3.0 Host_1 и SATA_1/QSGMII совместно используют USB3/SATA/QSGMII Combo PHY_1.

3. USB 3.0 OTG и Host_1 используют соответственно port0 и port1 USB 2.0 Comb PHY_0.

4. USB 2.0 Host_2/Host_3 используют port0/port1 USB 2.0 Comb PHY_1. Combo PHY_0 и Combo PHY_1 одновременно работают только в одном режиме: USB3, SATA и QSGMII взаимно исключаются. Выберите нужную периферию через DTS; см. RK356x USB DTS.

![Рисунок 1, английский PDF, с. 6](/docs/rockchip-rk356x-usb/assets/en-p006-figure-01.png)

*Рисунок 1, английский PDF, с. 6*

Рисунок 1-1. Связи USB-контроллеров и PHY RK3568.

## 2. RK356x аппаратные схемы USB

RK356x допускает разные аппаратные схемы. RK3568 имеет четыре USB-интерфейса: один USB 3.0 OTG, один USB 3.0 Host и два USB 2.0 Host (рис. 2-1). RK3566 также имеет четыре: один USB 2.0 OTG, один USB 3.0 Host и два USB 2.0 Host.

![Рисунок 2, английский PDF, с. 7](/docs/rockchip-rk356x-usb/assets/en-p007-figure-01.png)

*Рисунок 2, английский PDF, с. 7*

Рисунок 2-1. USB-интерфейсы схемы RK3568.

### 2.1 RK356x USB 2.0/3.0 питание и управление энергопотреблением

Принципы управления потреблением:

1. Если питание USB2/Combo PHY можно отключить аппаратно, его потребление равно нулю; DTS-узел отключите.

2. Если USB2 PHY должен оставаться запитанным, включите оба его port-узла, чтобы драйвер переводил неиспользуемый порт в suspend.

3. Отключите DTS-узлы неиспользуемых USB-контроллеров.

4. Отключите DTS-узлы неиспользуемых Combo PHY.

#### 2.1.1 RK356x питание и энергопотребление контроллеров USB 2.0/3.0

Контроллеры USB2/3 питаются от VDD_LOGIC. USB3 делит PD_PIPE с PCIe/SATA/XPCS; домен можно динамически отключать. USB2 power domain не имеет. Ядро RK356x уже поддерживает динамический PD_PIPE для USB3 OTG и Host auto suspend при отсутствии периферии, дополнительная отладка управления не нужна. Неиспользуемые контроллеры рекомендуется отключить в DTS. Пример отключения Host_2/Host_3:

```text
&usb_host0_ehci {
        status = "disabled";
};

&usb_host0_ohci {
        status = "disabled";
};

&usb_host1_ehci {
        status = "disabled";
};

&usb_host1_ohci {
        status = "disabled";
};
```

#### 2.1.2 RK356x USB 2.0 PHYs питание и управление энергопотреблением

Два USB2 Combo PHY: PHY_0 для OTG/Host_1, PHY_1 для Host_2/Host_3. У каждого три питания:

3.3V, 1.8V и 0.9V, см. таблицу 3. Выход за минимум/максимум (допустимо ±10%) может нарушить USB-соединение. Таблица 3: питания USB2 PHY.

| Напряжение питания | Мин. | Тип. | Макс. | Единица |
| --- | --- | --- | --- | --- |
| USB_AVDD_3V3 | 3.0 | 3.3 | 3.6 | V |
| USB_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| USB_AVDD_0V9 | 0.81 | 0.9 | 0.99 | V |

![Рисунок 3, английский PDF, с. 8](/docs/rockchip-rk356x-usb/assets/en-p008-figure-01.png)

*Рисунок 3, английский PDF, с. 8*

Рисунок 2-2. Питание USB2 Comb PHY_0 для OTG/Host_1.

![Рисунок 4, английский PDF, с. 9](/docs/rockchip-rk356x-usb/assets/en-p009-figure-01.png)

*Рисунок 4, английский PDF, с. 9*

Рисунок 2-3. Питание USB2 Comb PHY_1 для Host_2/Host_3. После включения PHY активен: требуется динамическое управление драйвером (уже поддерживается) или отключение питания. PHY_0 нельзя обесточивать, поскольку он необходим хотя бы для USB-загрузки прошивки. Типичный продукт использует только OTG, без Host_1/2/3; рекомендуемая оптимизация

USB 2.0 PHY:

1. Отключите u2phy0_host в DTS, чтобы probe не инициализировал его и не повышал потребление.

2. Отключите питание PHY_1: как на рис. 2-4, соедините три его питания с землёй.

![Рисунок 5, английский PDF, с. 10](/docs/rockchip-rk356x-usb/assets/en-p010-figure-01.png)

*Рисунок 5, английский PDF, с. 10*

Рисунок 2-4. Отключение питания PHY_1 для Host_2/Host_3. В DTS обязательно отключите u2phy1_host, u2phy1_otg и соответствующие usb_host1_ehci/usb_host1_ohci:

```text
&usb_host1_ehci {
    status = "disabled";
};

&usb_host1_ohci {
    status = "disabled";
};

&u2phy1_host {
    status = "disabled";
};

&u2phy1_otg {
    status = "disabled";
};
```

Если PHY не запитан, но его контроллер не отключён, ядро зависнет при инициализации USB. Типичный журнал:

```text
[    1.240101] ohci_hcd: USB 1.1 'Open' Host Controller (OHCI) Driver
[    1.241896] ohci-platform: OHCI generic platform driver
[    1.242698] ohci-platform fd8c0000.usb: Generic Platform OHCI controller
[    1.243686] ohci-platform fd8c0000.usb: new USB bus registered, assigned bus
number 3
```

#### 2.1.3 RK356x USB 3.0 PHYs питание и управление энергопотреблением

RK3566 Host_1 использует USB3/SATA/QSGMII Combo PHY_1 (MULTI_PHY1). RK3568 OTG использует USB3/SATA Combo PHY_0 (MULTI_PHY0), Host_1 — Combo PHY_1 (MULTI_PHY1). MULTI_PHY0/1/2 имеют общие питания 0.9V и 1.8V, см. рис. 2-5 и требования таблицы 4. Таблица 4: USB3 Combo PHY.

| Напряжение питания | Мин. | Тип. | Макс. | Единица |
| --- | --- | --- | --- | --- |
| MULTI_PHY_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| MULTI_PHY_AVDD_0V9 | 0.81 | 0.9 | 0.99 | V |

![Рисунок 6, английский PDF, с. 11](/docs/rockchip-rk356x-usb/assets/en-p011-figure-01.png)

*Рисунок 6, английский PDF, с. 11*

Рисунок 2-5. Питание Multi PHY RK356x. При включении все три активны. U-Boot переводит их в reset для минимального потребления. В ядре USB

3.0/SATA/PCIe/QSGMII-драйверы снимают reset через rockchip_combphy_init(). В USB3 режиме контроллер автоматически управляет PIPE P0/P1/P2/P3. Без устройства Host в P3; с U3-диском P0; USB3 hub без downstream-периферии автоматически P3, при подключении устройства P0. P0 — нормальная работа, P3 — минимум потребления. Неиспользуемые PHY и USB3-контроллеры отключите в DTS для минимального потребления, см. раздел DTS.

### 2.2 RK3566 USB 2.0 OTG Micro-B аппаратная схема интерфейса

Micro-B OTG RK3566, рис. 2-6–2-8, аналогичен другим SDK Rockchip; принцип отдельно не разбирается. Три замечания:

1. Последовательно с DP и DM установите по 2.2 Ω для стойкости к перенапряжениям/ESD.

2. Для Device hotplug и определения зарядки подключите VBUSDET к Micro-разъёму.

3. Без этих функций VBUSDET можно подтянуть к 3.3V (рекомендуется) или оставить открытым. MaskROM RK356x не зависит от VBUSDET и может подключаться/загружать прошивку даже при открытом выводе.

![Рисунок 7, английский PDF, с. 12](/docs/rockchip-rk356x-usb/assets/en-p012-figure-01.png)

*Рисунок 7, английский PDF, с. 12*

Рисунок 2-6. Контакты USB2 OTG RK3566.

![Рисунок 8, английский PDF, с. 12](/docs/rockchip-rk356x-usb/assets/en-p012-figure-02.png)

*Рисунок 8, английский PDF, с. 12*

Рисунок 2-7. Micro-B USB2 OTG RK3566.

![Рисунок 9, английский PDF, с. 13](/docs/rockchip-rk356x-usb/assets/en-p013-figure-01.png)

*Рисунок 9, английский PDF, с. 13*

Рисунок 2-8. Управление VBUS и OTG_ID RK3566.

### 2.3 RK3566 USB 2.0 OTG Type-C аппаратная схема интерфейса

#### 2.3.1 RK3566 Type-C USB 2.0 only проектирование аппаратной схемы[No PD]

Type-C USB2 only RK3566, рис. 2-9–2-11, имеет свойства:

1. Определение и автоматическое переключение USB2 OTG.

2. Без Type-C PD.

3. Без внешнего Type-C-контроллера, что дешевле. DP1/DM1 и DP2/DM2 напрямую соединены с USB_OTG0_DP/DM, определение ориентации не нужно. CC1/CC2 определяют UFP/DFP (Device/Host), см. рис. 2-11. Основа — USB Type-C Specification [1], разделы 3.5.2 USB Type-C to USB 2.0 Standard-A Cable Assembly и 3.6.1 USB Type-C to USB 3.1 Standard-A Receptacle Adapter Assembly:

1. Кабель Type-C to USB 2.0 Standard-A: контакт A5 (CC) штекера Type-C соединяется с VBUS через Rp 56 kΩ ±5%.

2. Type-C to USB 3.1 Standard-A Receptacle: A5 (CC) соединяется с GND через Rd 5.1 kΩ ±20%.

![Рисунок 10, английский PDF, с. 14](/docs/rockchip-rk356x-usb/assets/en-p014-figure-01.png)

*Рисунок 10, английский PDF, с. 14*

Рисунок 2-9. Контакты RK3566 USB2 OTG.

![Рисунок 11, английский PDF, с. 14](/docs/rockchip-rk356x-usb/assets/en-p014-figure-02.png)

*Рисунок 11, английский PDF, с. 14*

Рисунок 2-10. Разъём Type-C USB2 OTG RK3566.

![Рисунок 12, английский PDF, с. 14](/docs/rockchip-rk356x-usb/assets/en-p014-figure-03.png)

*Рисунок 12, английский PDF, с. 14*

Рисунок 2-11. Схема определения CC RK3566 USB2 Type-C. Примечания:

1. USB_OTG0_ID внутри чипа подтянут к 1.8V резистором 155K ohm.

2. Кабель Type-C to USB2 Standard-A Plug слабо подтягивает CC к VBUS 5V; ID высокий, OTG работает как Device.

3. Кабель Type-C to USB2 Standard-A Receptacle слабо подтягивает CC к GND; ID становится низким, его прерывание переключает OTG в Host.

#### 2.3.2 RK3566 Type-C USB 2.0 + PD аппаратная схема

Type-C USB2 + PD RK3566, рис. 2-12–2-14, имеет свойства:

1. Определение и автоматическое переключение USB2 OTG.

2. Поддержка Type-C PD.

3. Требуется внешний Type-C-контроллер.

4. Нужен стабилизатор VBUS 5 V для зарядки PD с высоким напряжением и током.

![Рисунок 13, английский PDF, с. 15](/docs/rockchip-rk356x-usb/assets/en-p015-figure-01.png)

*Рисунок 13, английский PDF, с. 15*

Рис. 2-12. Интерфейс RK3566 Type-C USB 2.0 + PD

![Рисунок 14, английский PDF, с. 15](/docs/rockchip-rk356x-usb/assets/en-p015-figure-02.png)

*Рисунок 14, английский PDF, с. 15*

Рис. 2-13. Схема Type-C FUSB302 RK3566

![Рисунок 15, английский PDF, с. 16](/docs/rockchip-rk356x-usb/assets/en-p016-figure-01.png)

*Рисунок 15, английский PDF, с. 16*

Рис. 2-14. Стабилизатор Type-C VBUS 5 V RK3566

### 2.4 RK356x USB 2.0 Host Type-A аппаратная схема интерфейса

Схемы USB 2.0 Host Type-A RK356x показаны на рис. 2-15 и 2-16. Они аналогичны распространённым схемам USB 2.0 Host в SDK других платформ Rockchip, поэтому принцип здесь подробно не рассматривается. Если USB 2.0 Host не используется, рекомендуется отключить питание его PHY; см. раздел о питании и энергопотреблении USB 2.0 PHY RK356x и схему на рис. 5.

![Рисунок 16, английский PDF, с. 16](/docs/rockchip-rk356x-usb/assets/en-p016-figure-02.png)

*Рисунок 16, английский PDF, с. 16*

Рис. 2-15. Выводы USB 2.0 Host RK356x

![Рисунок 17, английский PDF, с. 17](/docs/rockchip-rk356x-usb/assets/en-p017-figure-01.png)

*Рисунок 17, английский PDF, с. 17*

Рис. 2-16. Интерфейс USB 2.0 Host RK356x

### 2.5 RK3568 USB 3.0 OTG Type-A аппаратная схема интерфейса

Схема USB 3.0 OTG Type-A RK3568 показана на рис. 2-17–2-19. Разъём меньше Micro USB 3.0 и удобен для подключения периферии. Однако USB3_OTG0_ID не определяется, поэтому автоматическое аппаратное переключение OTG в Host невозможно: нужны команды из раздела переключения режима USB OTG RK356x. Обычно USB 3.0 OTG настроен в режим OTG; при подключении к ПК драйвер автоматически переключает его в Device. Для USB-периферии, например флеш-накопителя, требуется программно принудительно выбрать Host; возврат из Host в Device также выполняется программно. Некоторые устройства USB 3.0, например механические диски и камеры, требуют повышенного тока. Поэтому VBUS в режиме Host должен обеспечивать более 1 A. На рис. 2-19 ограничение тока SY6280AAC равно 1.446 A, что удовлетворяет большинству устройств USB 3.0. Следует учитывать четыре пункта:

1. В DP и DM необходимо последовательно включить по резистору 2.2 Ω для повышения стойкости к напряжению и электростатическим разрядам.

2. Для определения подключения/отключения USB Device и типа зарядки вывод VBUSDET обязательно соединяют с разъёмом USB Type-A.

3. Если эти функции не нужны, VBUSDET разрешается постоянно подтянуть к 3.3 V либо оставить неподключённым; рекомендуется подтяжка к 3.3 V. Подключение Maskrom USB RK356x не зависит от VBUSDET, поэтому даже при неподключённом выводе Maskrom USB работает и загружает прошивку.

4. Неиспользуемый USB3_OTG0_ID можно оставить неподключённым; внутри чипа он подтянут к 1.8 V.

![Рисунок 18, английский PDF, с. 18](/docs/rockchip-rk356x-usb/assets/en-p018-figure-01.png)

*Рисунок 18, английский PDF, с. 18*

Рис. 2-17. Выводы USB 3.0 OTG RK3568

![Рисунок 19, английский PDF, с. 18](/docs/rockchip-rk356x-usb/assets/en-p018-figure-02.png)

*Рисунок 19, английский PDF, с. 18*

Рис. 2-18. Интерфейс USB 3.0 OTG Type-A RK3568

![Рисунок 20, английский PDF, с. 19](/docs/rockchip-rk356x-usb/assets/en-p019-figure-01.png)

*Рисунок 20, английский PDF, с. 19*

Рис. 2-19. Управление VBUS и OTG ID USB 3.0 OTG RK3568

### 2.6 RK3568 USB 3.0 OTG Type-C аппаратная схема интерфейса

В описываемом SDK RK3568 нет аппаратной эталонной схемы USB 3.0 OTG Type-C. Для такого интерфейса между USB 3.0 OTG RK3568 и Type-C нужны переключатель USB 3.1, например FUSB340, и чип связи CC, например FUSB302.

### 2.7 RK356x USB 3.0 HOST Type-A аппаратная схема интерфейса

Схема USB 3.0 HOST Type-A RK3566/RK3568 в основном совпадает с предыдущей схемой USB 3.0 OTG Type-A RK3568, но у USB 3.0 HOST нет VBUSDET и ID. Требования к проектированию см. в разделе USB 3.0 OTG Type-A RK3568.

![Рисунок 21, английский PDF, с. 20](/docs/rockchip-rk356x-usb/assets/en-p020-figure-01.png)

*Рисунок 21, английский PDF, с. 20*

Рис. 2-20. Выводы USB3.0 HOST1 RK356x

![Рисунок 22, английский PDF, с. 20](/docs/rockchip-rk356x-usb/assets/en-p020-figure-02.png)

*Рисунок 22, английский PDF, с. 20*

Рис. 2-21. Интерфейс USB3.0 HOST1 Type-A RK356x

![Рисунок 23, английский PDF, с. 20](/docs/rockchip-rk356x-usb/assets/en-p020-figure-03.png)

*Рисунок 23, английский PDF, с. 20*

Рис. 2-22. Управление VBUS USB3.0 HOST1 RK356x

## 3. RK356x USB DTS настройка

Аппаратные схемы USB RK356x разнообразны, особенно варианты USB OTG и сложное мультиплексирование Combo PHY USB 3.0/SATA/QSGMII. Поэтому узлы контроллеров и PHY в DTS нужно настраивать, понимая аппаратную схему. Здесь описывается настройка USB DTS, а не драйверы контроллеров и PHY. Подробности их устройства приведены в руководстве USB SDK [2].

### 3.1 RK3568 узлы DTSI контроллеров USB и PHY

Подробности настройки DTS контроллеров и PHY USB RK3568 приведены в документации ядра [4]–[10]. Ниже показаны основные связанные узлы DTSI.

```text
/* USB 3.0 OTG/SATA Combo PHY_0 */
combphy0_us: phy@fe820000 {
        compatible = "rockchip,rk3568-naneng-combphy";
        reg = <0x0 0xfe820000 0x0 0x100>;
        #phy-cells = <1>;
        clocks = <&pmucru CLK_PCIEPHY0_REF>, <&cru PCLK_PIPEPHY0>,
                 <&cru PCLK_PIPE>;
        clock-names = "refclk", "apbclk", "pipe_clk";
        assigned-clocks = <&pmucru CLK_PCIEPHY0_REF>;
        assigned-clock-rates = <24000000>;
        resets = <&cru SRST_P_PIPEPHY0>, <&cru SRST_PIPEPHY0>;
        reset-names = "combphy-apb", "combphy";
        rockchip,pipe-grf = <&pipegrf>;
        rockchip,pipe-phy-grf = <&pipe_phy_grf0>;
        status = "disabled";
};
/* USB 3.0 Host/SATA/QSGMII Combo PHY_1 */
combphy1_usq: phy@fe830000 {
        compatible = "rockchip,rk3568-naneng-combphy";
        reg = <0x0 0xfe830000 0x0 0x100>;
        #phy-cells = <1>;
        clocks = <&pmucru CLK_PCIEPHY1_REF>, <&cru PCLK_PIPEPHY1>,
                 <&cru PCLK_PIPE>;
        clock-names = "refclk", "apbclk", "pipe_clk";
        assigned-clocks = <&pmucru CLK_PCIEPHY1_REF>;
        assigned-clock-rates = <24000000>;
        resets = <&cru SRST_P_PIPEPHY1>, <&cru SRST_PIPEPHY1>;
        reset-names = "combphy-apb", "combphy";
        rockchip,pipe-grf = <&pipegrf>;
        rockchip,pipe-phy-grf = <&pipe_phy_grf1>;
        status = "disabled";
};
/* USB OTG/USB Host_1 USB 2.0 Comb PHY_0 */
usb2phy0: usb2-phy@fe8a0000 {
        compatible = "rockchip,rk3568-usb2phy";
        reg = <0x0 0xfe8a0000 0x0 0x10000>;
        interrupts = <GIC_SPI 135 IRQ_TYPE_LEVEL_HIGH>;
        clocks = <&pmucru CLK_USBPHY0_REF>;
        clock-names = "phyclk";
        #clock-cells = <0>;
        assigned-clocks = <&cru USB480M>;
        assigned-clock-parents = <&usb2phy0>;
        clock-output-names = "usb480m_phy";
        rockchip,usbgrf = <&usb2phy0_grf>;
        status = "disabled";

        u2phy0_host: host-port {
                #phy-cells = <0>;
                status = "disabled";
        };

        u2phy0_otg: otg-port {
                #phy-cells = <0>;
                status = "disabled";
        };
};
/* USB Host_1/USB Host_2 USB 2.0 Comb PHY_0 */
usb2phy1: usb2-phy@fe8b0000 {
        compatible = "rockchip,rk3568-usb2phy";
        reg = <0x0 0xfe8b0000 0x0 0x10000>;
        interrupts = <GIC_SPI 136 IRQ_TYPE_LEVEL_HIGH>;
        clocks = <&pmucru CLK_USBPHY1_REF>;
        clock-names = "phyclk";
        #clock-cells = <0>;
        rockchip,usbgrf = <&usb2phy1_grf>;
        status = "disabled";

        u2phy1_host: host-port {
                #phy-cells = <0>;
                status = "disabled";
        };

        u2phy1_otg: otg-port {
                #phy-cells = <0>;
                status = "disabled";
        };
};
/* USB 3.0 OTG controller */
usbdrd30: usbdrd {
        compatible = "rockchip,rk3568-dwc3", "rockchip,rk3399-dwc3";
        clocks = <&cru CLK_USB3OTG0_REF>, <&cru CLK_USB3OTG0_SUSPEND>,
                 <&cru ACLK_USB3OTG0>, <&cru PCLK_PIPE>;
        clock-names = "ref_clk", "suspend_clk",
                      "bus_clk", "pipe_clk";
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;
        status = "disabled";

        usbdrd_dwc3: dwc3@fcc00000 {
                compatible = "snps,dwc3";
                reg = <0x0 0xfcc00000 0x0 0x400000>;
                interrupts = <GIC_SPI 169 IRQ_TYPE_LEVEL_HIGH>;
                dr_mode = "otg";
                phys = <&u2phy0_otg>, <&combphy0_us PHY_TYPE_USB3>;
                phy-names = "usb2-phy", "usb3-phy";
                phy_type = "utmi_wide";
                power-domains = <&power RK3568_PD_PIPE>;
                resets = <&cru SRST_USB3OTG0>;
                reset-names = "usb3-otg";
                snps,dis_enblslpm_quirk;
                snps,dis-u1-entry-quirk;
                snps,dis-u2-entry-quirk;
                snps,dis-u2-freeclk-exists-quirk;
                snps,dis-del-phy-power-chg-quirk;
                snps,dis-tx-ipgap-linecheck-quirk;
                snps,dis_rxdet_inp3_quirk;
                snps,xhci-trb-ent-quirk;
                status = "disabled";
        };
};
/* USB 3.0 Host_1 controller */
usbhost30: usbhost {
        compatible = "rockchip,rk3568-dwc3", "rockchip,rk3399-dwc3";
        clocks = <&cru CLK_USB3OTG1_REF>, <&cru CLK_USB3OTG1_SUSPEND>,
                 <&cru ACLK_USB3OTG1>, <&cru PCLK_PIPE>;
        clock-names = "ref_clk", "suspend_clk",
                      "bus_clk", "pipe_clk";
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;
        status = "disabled";

        usbhost_dwc3: dwc3@fd000000 {
                compatible = "snps,dwc3";
                reg = <0x0 0xfd000000 0x0 0x400000>;
                interrupts = <GIC_SPI 170 IRQ_TYPE_LEVEL_HIGH>;
                dr_mode = "host";
                phys = <&u2phy0_host>, <&combphy1_usq PHY_TYPE_USB3>;
                phy-names = "usb2-phy", "usb3-phy";
                phy_type = "utmi_wide";
                power-domains = <&power RK3568_PD_PIPE>;
                resets = <&cru SRST_USB3OTG1>;
                reset-names = "usb3-host";
                snps,dis_enblslpm_quirk;
                snps,dis-u2-freeclk-exists-quirk;
                snps,dis-del-phy-power-chg-quirk;
                snps,dis-tx-ipgap-linecheck-quirk;
                snps,dis_rxdet_inp3_quirk;
                snps,xhci-trb-ent-quirk;
                status = "disabled";
        };
};
/* USB 2.0 Host_2 EHCI controller for high speed */
usb_host0_ehci: usb@fd800000 {
        compatible = "generic-ehci";
        reg = <0x0 0xfd800000 0x0 0x40000>;
        interrupts = <GIC_SPI 130 IRQ_TYPE_LEVEL_HIGH>;
        clocks = <&cru HCLK_USB2HOST0>, <&cru HCLK_USB2HOST0_ARB>,
                 <&cru PCLK_USB>, <&usb2phy1>;
        clock-names = "usbhost", "arbiter", "pclk", "utmi";
        phys = <&u2phy1_otg>;
        phy-names = "usb2-phy";
        status = "disabled";
};
/* USB 2.0 Host_2 OHCI controller for full/low speed */
usb_host0_ohci: usb@fd840000 {
        compatible = "generic-ohci";
        reg = <0x0 0xfd840000 0x0 0x40000>;
        interrupts = <GIC_SPI 131 IRQ_TYPE_LEVEL_HIGH>;
        clocks = <&cru HCLK_USB2HOST0>, <&cru HCLK_USB2HOST0_ARB>,
                 <&cru PCLK_USB>, <&usb2phy1>;
        clock-names = "usbhost", "arbiter", "pclk", "utmi";
        phys = <&u2phy1_otg>;
        phy-names = "usb2-phy";
        status = "disabled";
};
/* USB 2.0 Host_3 EHCI controller for high speed */
usb_host1_ehci: usb@fd880000 {
        compatible = "generic-ehci";
        reg = <0x0 0xfd880000 0x0 0x40000>;
        interrupts = <GIC_SPI 133 IRQ_TYPE_LEVEL_HIGH>;
        clocks = <&cru HCLK_USB2HOST1>, <&cru HCLK_USB2HOST1_ARB>,
                 <&cru PCLK_USB>, <&usb2phy1>;
        clock-names = "usbhost", "arbiter", "pclk", "utmi";
        phys = <&u2phy1_host>;
        phy-names = "usb2-phy";
        status = "disabled";
};
/* USB 2.0 Host_3 OHCI controller for full/low speed */
usb_host1_ohci: usb@fd8c0000 {
        compatible = "generic-ohci";
        reg = <0x0 0xfd8c0000 0x0 0x40000>;
        interrupts = <GIC_SPI 134 IRQ_TYPE_LEVEL_HIGH>;
        clocks = <&cru HCLK_USB2HOST1>, <&cru HCLK_USB2HOST1_ARB>,
                 <&cru PCLK_USB>, <&usb2phy1>;
        clock-names = "usbhost", "arbiter", "pclk", "utmi";
        phys = <&u2phy1_host>;
        phy-names = "usb2-phy";
        status = "disabled";
};
```

### 3.2 RK3568 USB 3.0 OTG to USB 2.0 only настройка

USB 3.0 PHY USB 3.0 OTG и контроллер SATA_0 совместно используют Comb PHY_0. Если Comb PHY_0 назначен SATA_0, USB 3.0 OTG нужно настроить только на USB 2.0 следующим DTS; изменять драйверы контроллера и PHY не требуется:

```text
&usbdrd_dwc3 {
        phys = <&u2phy0_otg>; /* 配置 phys 属性只引⽤ usb 2.0 phy 节点 */
        phy-names = "usb2-phy";
        extcon = <&usb2phy0>;
        maximum-speed = "high-speed"; /* 配置 dwc3 控制器最⾼⽀持 high speed */
        snps,dis_u2_susphy_quirk; /* 配置 dwc3 控制器不⽀持⾃动 suspend usb2 phy */
        snps,usb2-lpm-disable; /* 配置 dwc3 host mode 不⽀持 LPM 功能 */
};

&combphy0_us {
        rockchip,dis-u3otg0-port; /* 配置 dwc3_0 控制器最⾼⽀持 high speed */
        status = "okay";
};

&u2phy0_otg {
        rockchip,dis-u2-susphy; /* 可选项，⽤于关闭 PHY 动态进⼊ suspend 的功能，提⾼
USB 热拔插稳定性 */
        status = "okay";
};
```

### 3.3 RK356x USB 3.0 Host to USB 2.0 only настройка

USB 3.0 PHY USB 3.0 Host и контроллеры SATA_1/QSGMII совместно используют Comb PHY_1. При назначении Comb PHY_1 SATA_1 или QSGMII USB 3.0 Host нужно настроить только на USB 2.0 следующим DTS; менять драйверы контроллера и PHY не нужно:

```text
&usbhost_dwc3 {
        phys = <&u2phy0_host>; /* 配置 phys 属性只引⽤ usb 2.0 phy 节点 */
        phy-names = "usb2-phy";
        maximum-speed = "high-speed"; /* 配置 dwc3 控制器最⾼⽀持 high speed */
        snps,dis_u2_susphy_quirk; /* 配置 dwc3 控制器不⽀持⾃动 suspend usb2 phy */
        snps,usb2-lpm-disable; /* 配置 dwc3 host mode 不⽀持 LPM 功能 */
        status = "okay";
};

&combphy1_usq {
        rockchip,dis-u3otg1-port; /* 配置 dwc3_1 控制器最⾼⽀持 high speed */
        status = "okay";
};
```

### 3.4 RK356x Type-C USB DTS настройка

Распространены следующие пять схем Type-C RK356x:

1. RK3566 Type-C USB 2.0 only;

2. RK3568 Type-C USB 2.0 only;

3. RK3566 Type-C USB 2.0 + PD;

4. RK3568 Type-C USB 2.0 + PD;

5. RK3568 Type-C USB 3.0 + PD.

Для вариантов 1 и 2 см. схему Type-C USB 2.0 only RK3566 [No PD]: аппаратное преобразование CC в OTG_ID определяет OTG так же, как Micro-B USB. Поэтому их DTS настраивается как для обычных интерфейсов OTG Micro-USB/Type-A RK356x. Варианты 3 и 4 используют внешний Type-C-контроллер для PD; см. схему Type-C USB 2.0 + PD RK3566. Их USB DTS практически одинаков. Здесь подробно рассматривается вариант 3; для варианта 4 дополнительно настройте контроллер только на USB 2.0 по разделу преобразования USB 3.0 OTG RK3568 в USB 2.0 only. Для варианта 5 USB3 PHY RK3568 не поддерживает переключение ориентации Type-C, поэтому нужны внешний USB3 Switch, например FUSB340, и Type-C-контроллер, например FUSB302. DTS Type-C-контроллера аналогичен вариантам 3 и 4, а драйвер управления USB 3.1 Switch необходимо разработать согласно выбранной аппаратной схеме.

#### 3.4.1 Linux-4.19 RK3566 Type-C USB 2.0 + FUSB302 DTS настройка

Ядро Linux-4.19 поддерживает два драйвера FUSB302: drivers/mfd/fusb302.c [Legacy] и drivers/usb/typec/tcpm/fusb302.c [New]. SDK Linux-4.19 по умолчанию использует Legacy; rockchip_defconfig уже включает CONFIG_FUSB_30X. Этот драйвер широко применялся в серийных устройствах RK3399 и в исходном руководстве рекомендуется в первую очередь. Для нового драйвера нужно обновить серию патчей Type-C TCPM по разделу DTS Linux-4.19 RK3566 Type-C USB 2.0 + HUSB311.

Пример DTS Linux-4.19 для Legacy FUSB302:

```text
/* 根据 FUSB302 I2C 实际硬件设计进⾏修改 */
&i2cx {
        fusb0: fusb30x@22 { /* 配置 FUSB302 芯⽚硬件信息*/
                compatible = "fairchild,fusb302";
                reg = <0x22>;
                pinctrl-names = "default";
                pinctrl-0 = <&fusb0_int>;
                int-n-gpios = <&gpiox RK_Pxx GPIO_ACTIVE_HIGH>; /* 根据 FUSB302
INT 实际连接的 GPIO 进⾏修改 */
                vbus-5v-gpios = <&gpiox RK_Pxx GPIO_ACTIVE_HIGH>; /* 根据 Type-C
VBUS 实际连接的 GPIO 进⾏修改 */
                status = "okay";
        };
};

/* 使能 USB2.0 PHY */
&usb2phy0 {
        status = "okay";
        extcon = <&fusb0>; /* 配置 extcon 属性，⽤于接收 FUSB302 驱动的 Type-C DRD
notifier*/
};

/* 使能 USB2.0 PHY OTG port */
&u2phy0_otg {
        rockchip,dis-u2-susphy; /* 可选项，⽤于关闭 PHY 动态进⼊ suspend 的功能，提⾼
USB 热拔插稳定性 */
        status = "okay";
};

/* 使能 USB3 控制器⽗节点 */
&usbdrd30 {
        status = "okay";
};

/* 使能 USB3 控制器⼦节点 */
&usbdrd_dwc3 {
        extcon = <&fusb0>; /* 配置 extcon 属性，⽤于接收 FUSB302 驱动的 Type-C DRD
notifier*/
        status = "okay";
};

&pinctrl {
         fusb30x { /* 配置 FUSB302 驱动的中断和 vbus gpio pinctrl */
                fusb0_int: fusb0-int {
                        rockchip,pins = <gpiox RK_Pxx RK_FUNC_GPIO
&pcfg_pull_up>,
                                        <gpiox RK_Pxx RK_FUNC_GPIO
&pcfg_pull_up>;
                };
        };
};
```

#### 3.4.2 Linux-4.19 RK3566 Type-C USB 2.0 + HUSB311 DTS настройка

Описываемая актуальная ветка Linux-4.19 RK3568 поддерживает HUSB311 и ET7303. Оба чипа имеют I2C-адрес 4E, поэтому DTS почти одинаков: меняются имя узла и compatible. Здесь рассматривается HUSB311. Оба используют инфраструктуру Type-C TCPM; Linux-4.19 нужно синхронизировать с актуальной develop-4.19. Если полная синхронизация невозможна, обновите как минимум следующие каталоги:

```text
kernel/include/linux/usb
kernel/drivers/usb/typec
kernel/drivers/usb/dwc3
```

Дополнительно вручную обновите следующие патчи:

```text
0001-usb-typec-tcpm-add-vdm-retry-mechanism.patch
0002-arm64-rockchip_defconfig-enable-tcpm-and-husb311-and.patch
```

Загрузите полный комплект «RK356x_Linux-4.19_TypeC-HUSB311-ET7303-参考设计» для внесения изменений: https://redmine.rockchip.com.cn/documents/113. Ниже пример DTS Linux-4.19 для HUSB311 на RK3566:

```text
/* 需要包含头⽂件 */
#include "dt-bindings/usb/pd.h"

/* 可选配置，⽤于 vbus 通过 gpio 控制的硬件⽅案 */
vcc_otg_vbus: otg-vbus-regulator {
        compatible = "regulator-fixed";
        gpio = <&gpiox RK_PXX GPIO_ACTIVE_HIGH>; /* 根据 Type-C VBUS 实际连接的 GPIO
进⾏修改 */
        pinctrl-names = "default";
        pinctrl-0 = <&otg_vbus_drv>;
        regulator-name = "vcc_otg_vbus";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
};

/* 根据 HUSB311 I2C 实际硬件设计进⾏修改 */
&i2cx {
        /* 对于 et7303, 可以修改为 usbc0: et7303@4e */
        usbc0: husb311@4e {
                /* 对于 et7303, compatible = "etek,et7303"*/
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                /* 根据 HUSB311 INT 实际连接的 GPIO 进⾏修改 */
                interrupt-parent = <&gpiox>;
                interrupts = <X IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
                pinctrl-0 = <&husb311_int>;
                /*
                 * vbus 配置
                 * 若 vbus 是通过 gpio 控制，则需要 vbus-supply = <&vcc_otg_vbus> 配
置;
                 * 若 vbus 是 RK817/RK818/bq25700/其他 charge ic 输出，则⽆需 vbus-
supply = <&vcc_otg_vbus> 配置;
                 */
                vbus-supply = <&vcc_otg_vbus>;
                status = "okay";

                usb_con: connector {
                        data-role = "dual";
                        power-role = "dual";
                        try-power-role = "sink";
                        /*
                         * source-pdos: PDO_FIXED(电压(mV), 电流(mA),
PDO_FIXED_USB_COMM)
                         * 主板端作为 Source 时,主板 vbus 可以输出的电压/电流列表,对于RK
平台采⽤默认值即可
                         */
                        source-pdos = <PDO_FIXED(5000, 2000,
PDO_FIXED_USB_COMM)>;
                        /*
                         * sink-pdos: <PDO_FIXED(电压(mV), 电流(mA),
PDO_FIXED_USB_COMM)>
                         * 主板端作为 Sink 时, 主板可以⽀持的电压/电流列表.
                         * 若有 PD 快充需求, sink-pdos 配置依赖于 charger ic 充电输⼊最
⼤电压/电流和主板承受的能⼒
                         * 若电压太⼤可能会烧主板, 这个细节请与硬件⼯程师沟通.
                         * 下⾯是主板可⽀持最⼤充电电压(20v)/电流(3A)配置, 请根据硬件设计
和实际需求进⾏适当修改.
                         * ⽐如主板只⽀持最⼤充电电压(12v)/电流(3A)，必须需要去掉 15v/3A
和 20V/3A.
                         */
                        sink-pdos = <PDO_FIXED(5000, 3000, PDO_FIXED_USB_COMM)
                                     PDO_FIXED(9000, 3000, PDO_FIXED_USB_COMM)
                                     PDO_FIXED(12000, 3000, PDO_FIXED_USB_COMM)
                                     PDO_FIXED(15000, 3000, PDO_FIXED_USB_COMM)
                                     PDO_FIXED(20000, 3000, PDO_FIXED_USB_COMM)>;
                         /* 若没有 PD 快充需求, sink-pdos 配置如下即可. */
                        sink-pdos = <PDO_FIXED(5000, 2000, PDO_FIXED_USB_COMM)>;
                        /*充电功率(op-sink-microwatt) = max_vol(mV) * max_cur(mA),
使⽤默认即可 */
                        op-sink-microwatt = <10000000>;
                };
        };
};

&pinctrl {
        husb311 {
                husb311_int: husb311-int {
                        rockchip,pins = <X RK_PXX RK_FUNC_GPIO &pcfg_pull_up>;
                };
        };

        usb {
                otg_vbus_drv: otg-vbus-drv {
                        /* 可选项，如果⽆ vcc_otg_vbus，就不需要该配置 */
                        rockchip,pins = <RK_XX RK_FUNC_GPIO &pcfg_pull_none>;
                };
        };
};

/* 使能 PMIC */
bq25700: bq25700@6b {
        compatible = "ti,bq25703";
        reg = <0x6b>;
        extcon = <&usbc0>; /* 配置 extcon 属性，⽤于接收 TCPM 驱动的 PD notifier */
        ......
};

/* 使能 USB2.0 PHY */
&u2phy0 {
        status = "okay";
        extcon = <&usbc0>; /* 配置 extcon 属性，⽤于接收 TCPM 驱动的 Type-C DRD
notifier*/
};

/* 使能 USB2.0 PHY OTG port */
&u2phy0_otg {
        rockchip,dis-u2-susphy; /* 可选项，⽤于关闭 PHY 动态进⼊ suspend 的功能，提⾼
USB 热拔插稳定性 */
        status = "okay";
};

/* 使能 USB3 控制器⽗节点 */
&usbdrd30 {
        status = "okay";
};

/* 使能 USB3 控制器⼦节点 */
&usbdrd_dwc3 {
        status = "okay";
        extcon = <&usbc0>; /* 配置 extcon 属性，⽤于接收 TCPM 驱动的 Type-C DRD
notifier */
};
```

Настройка DTS управления USB VBUS через PMIC RK817/RK818/bq25700 и аналогичные микросхемы

```text
/* rk818 */
rk818: pmic@1c {
        extcon = <&usbc0>;
};

/* rk817 */
rk817: pmic@20 {
        charger {
                extcon = <&usbc0>;
        };
};

/* bq25700 */
bq25700: bq25700@09 {
        extcon = <&usbc0>;
};
```

#### 3.4.3 Linux-5.10 RK3566 Type-C USB 2.0 + FUSB302 DTS настройка

Type-C в Linux-5.10 использует стандартную инфраструктуру TCPM. Главное отличие от Linux-4.19 и более ранних ядер: remote-endpoint и регистрация функций обратного вызова заменяют прежний extcon. Поэтому свойство extcon в Type-C DTS Linux-5.10 больше не требуется. Пример DTS Linux-5.10 для FUSB302 на RK3566:

```text
/* 配置 VBUS gpio regulator，⽤于 Type-C 作 USB Host mode 时 VBUS 5V 输出控制 */
vbus_typec: vbus-typec-regulator {
        compatible = "regulator-fixed";
        enable-active-high;
        gpio = <&gpiox RK_PXX GPIO_ACTIVE_HIGH>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_typec0_en>;
        regulator-name = "vbus_typec";
        vin-supply = <&vcc5v0_sys>;
};

/* 配置 FUSB302 芯⽚硬件信息*/
&i2cX { /* 根据 FUSB302 I2C 实际硬件设计进⾏修改 */
        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                interrupt-parent = <&gpix>; /* 根据 FUSB302 INT 实际连接的 GPIO 进⾏
修改 */
                interrupts = <RK_PXX IRQ_TYPE_LEVEL_LOW>;
                pinctrl-names = "default";
                pinctrl-0 = <&usbc0_int>;
                vbus-supply = <&vbus_typec>;
                status = "okay";

                ports {
                        #address-cells = <1>;
                        #size-cells = <0>;
                        /* ⽤于关联 USB 控制器，实现 USB ⻆⾊切换的功能 */
                        port@0 {
                                reg = <0>;
                                usbc0_role_sw: endpoint@0 {
                                        remote-endpoint = <&dwc3_role_switch>;
                                };
                        };
                };

                usb_con: connector { /* ⽤于描述 PD 协议相关信息 */
                        compatible = "usb-c-connector";
                        label = "USB-C";
                        data-role = "dual";
                        power-role = "dual";
                        try-power-role = "sink";
                        op-sink-microwatt = <1000000>;
                        sink-pdos =
                                <PDO_FIXED(5000, 2500, PDO_FIXED_USB_COMM)>;
                        source-pdos =
                                <PDO_FIXED(5000, 1500, PDO_FIXED_USB_COMM)>;
                };
        };
};

/* 使能 Type-C0 USB2.0 PHY */
&u2phy0 {
        status = "okay";
};

&u2phy0_otg {
        rockchip,dis-u2-susphy; /* 可选项，⽤于关闭 PHY 动态进⼊ suspend 的功能，提⾼
USB 热拔插稳定性 */
        status = "okay";
};

/* 使能 USB3 控制器⽗节点 */
&usbdrd30 {
        status = "okay";
};

/* 使能 USB3 控制器⼦节点 */
&usbdrd_dwc3 {
        status = "okay";
        usb-role-switch; /* ⽤于使能 DWC3 驱动注册 USB Role Switch 回调函数 */
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>; /* 关联 FUSB302，实现
USB ⻆⾊切换的功能 */
                };
        };
};

&pinctrl {
        usb-typec {
                usbc0_int: usbc0-int { /* 配置 FUSB302 驱动的中断 gpio pinctrl */
                        rockchip,pins = <X RK_PXX RK_FUNC_GPIO &pcfg_pull_up>;
                };

                vcc5v0_typec0_en: vcc5v0-typec0-en { /* 配置 FUSB302 驱动的 VBUS
gpio pinctrl */
                        rockchip,pins =
                                <X RK_PXX RK_FUNC_GPIO &pcfg_pull_none>;
                };
        };
};
```

#### 3.4.4 Linux-5.10 RK3566 Type-C USB 2.0 + HUSB311 DTS настройка

Для замены FUSB302 на HUSB311 достаточно следующих небольших изменений DTS Linux-5.10 RK3566 Type-C USB 2.0 + FUSB302:

```text
/* 配置外置 Type-C 控制器芯⽚ HUSB311 */
&i2cx {
        usbc0: husb311@4e {
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                ......
        };
};
```

### 3.5 USB VBUS настройка

На платформах Rockchip применяются три основных варианта управления USB VBUS [3]:

1. GPIO управляет стабилизатором, выдающим VBUS 5 V.

2. PMIC, например RK809/RK817/RK818, выдаёт VBUS 5 V.

3. После включения аппаратная схема непосредственно выдаёт VBUS 5 V без программного управления; обычно это USB Host. SDK RK356x преимущественно использует вариант 1. Ниже пример VBUS для портов OTG и HOST RK3568 EVB:

```text
vcc5v0_host: vcc5v0-host-regulator {
        compatible = "regulator-fixed";
        enable-active-high;
        gpio = <&gpio0 RK_PA6 GPIO_ACTIVE_HIGH>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
        regulator-name = "vcc5v0_host";
        regulator-always-on; /* Host Vbus 为常供电，所以配置属性为 regulator-always-
on */
};

vcc5v0_otg: vcc5v0-otg-regulator {
        compatible = "regulator-fixed";
        enable-active-high;
        gpio = <&gpio0 RK_PA5 GPIO_ACTIVE_HIGH>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_otg_en>;
        regulator-name = "vcc5v0_otg";
};

&pinctrl {
        usb {
                vcc5v0_host_en: vcc5v0-host-en {
                        rockchip,pins = <0 RK_PA6 RK_FUNC_GPIO &pcfg_pull_none>;
                };

                vcc5v0_otg_en: vcc5v0-otg-en {
                        rockchip,pins = <0 RK_PA5 RK_FUNC_GPIO &pcfg_pull_none>;
                };
        };
};

/* 注意： host 控制 vbus 的属性是 phy-supply */
&u2phy0_host {
        phy-supply = <&vcc5v0_host>;
        status = "okay";
};

/* 注意： otg 控制 vbus 的属性是 vbus-supply */
&u2phy0_otg {
        vbus-supply = <&vcc5v0_otg>;
        status = "okay";
};

&u2phy1_host {
        phy-supply = <&vcc5v0_host>;
        status = "okay";
};

&u2phy1_otg {
        phy-supply = <&vcc5v0_host>;
        status = "okay";
};
```

### 3.6 замечания по Linux USB DT

#### 3.6.1 USB DT важные свойства

##### 3.6.1.1 Свойства DT контроллера USB 3.1

1. snps,dis_rxdet_inp3_quirk: специфичное для контроллера USB 3.1 RK356x свойство отключает receiver detection (Rx-detect) в P3. Перед обнаружением USB3 PHY переходит из P3 в P2, затем после примерно 30 us возвращается в P3. Это устраняет несовместимость с некоторыми нераспознаваемыми USB3-накопителями.

2. snps,dis_u2_susphy_quirk: запрещает контроллеру USB 3.1 автоматически приостанавливать USB2 PHY. При принудительном USB 2.0 на USB 3.1 свойство обязательно, иначе USB2 может работать неправильно. В остальных случаях оно не нарушает USB, но повышает потребление при USB autosuspend.

3. snps,usb2-lpm-disable: отключает USB2 LPM контроллера USB 3.1. При принудительном USB 2.0 обязательно для совместимости с накопителями без USB2 LPM.

4. usb-role-switch: только для Linux-5.10 и стандартного Type-C с контроллером PD; одновременно требуется dr_mode = "otg". При другом dr_mode не задавайте usb-role-switch.

5. extcon: одна из основных функций — динамическое переключение OTG. Применяется к схемам без стандартного Type-C с PD-контроллером, например Micro USB или Type-A, когда контроллер настроен в otg.

##### 3.6.1.2 Свойства DT USB2 PHY

1. vbus-supply и phy-supply управляют выходом VBUS 5 V, но используются по-разному: vbus-supply — для OTG с динамическим включением/выключением VBUS; phy-supply — для USB2 HOST, где VBUS 5 V постоянно включён после подачи питания.

2. rockchip,vbus-always-on: для OTG с постоянным VBUS. Устраняет нераспознавание USB Device, например USB ADB, но запрещает USB2 PHY autosuspend и увеличивает динамическое потребление PHY.

3. rockchip,dis-u2-susphy отключает динамический переход драйвера USB2 PHY в suspend; главным образом используется для USB

2.0 only, чтобы PHY продолжал выдавать тактирование USB-контроллеру.

##### 3.6.1.3 Свойства DT ComboPHY USB 3.0/SATA/QSGMII

1. rockchip,dis-u3otg0-port: отключает корневой порт USB3 у USB3_OTG0 при принудительной работе только в USB 2.0.

2. rockchip,dis-u3otg1-port: отключает корневой порт USB3 у USB3_HOST1 при принудительной работе только в USB 2.0.

## 4. RK356x USB OTG mode команды переключения

SDK RK356x позволяет программно принудительно переключать USB 2.0/3.0 OTG в Host или Peripheral независимо от уровня OTG ID и Type-C. Команды Linux-4.19/5.10 (Legacy):

```text
#1.Force host mode
  echo host > /sys/devices/platform/fe8a0000.usb2-phy/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/fe8a0000.usb2-phy/otg_mode
#3.Force otg mode
  echo otg > /sys/devices/platform/fe8a0000.usb2-phy/otg_mode
```

Новая команда переключения в Linux-5.10:

```text
#1.Force host mode
  echo host > /sys/kernel/debug/usb/fcc00000.usb/mode
#2.Force peripheral mode
  echo device > /sys/kernel/debug/usb/fcc00000.usb/mode
```

Примечание: новая команда Linux-5.10 устраняет ограничение старой команды, зависевшей от правильной настройки extcon в USB DTS.

## 5. Type-C список поддерживаемых контроллеров

Таблица 5-1. Поддерживаемые контроллеры Type-C

| Модель Type-C-контроллера | Linux-4.4 | Linux-<br>4.19 | Linux-<br>5.10 | Примечания |
| --- | --- | --- | --- | --- |
| FUSB302 | Да | Да | Да | Наиболее распространён на RK |
| ET7301B | Да | Да | Да | Полностью совместим с FUSB302 аппаратно и программно, прим. 1 |
| ET7303 | Нет | Да | Да | Аппаратно совместим с FUSB302; драйвер очень похож на RT1711, прим. 2 |
| HUSB311 | Нет | Да | Да | Рекомендуется в первую очередь; аппаратно совместим с FUSB302, драйвер несовместим, прим. 3 |
| RT1711H | Нет | Да | Да | Аппаратно совместим с FUSB302; драйвер очень похож на ET7303, прим. 4 |
| ANX7411 | Нет | Нет | В отладке | Адаптация RK3588 |
| WUSB3801 | SDK не поддерживает; используется в отдельных проектах | Нет | Нет | Собственная однопроводная связь; высокая частота ошибок, стабильность не гарантирована. |

Примечание 1. Linux-4.4 не поддерживает TCPM и работает только с FUSB302/ET7301B; они взаимозаменяемы без изменения аппаратуры и ПО. Linux-4.19/5.10 поддерживают TCPM и TCPCI, поэтому теоретически совместимы со всеми контроллерами TCPCI, например ET7303/HUSB311/RT1711H.

Примечание 2. ET7303 в малом корпусе проверен на платформах RK; по сведениям исходного руководства большого корпуса производитель не предлагал. Отдельно включите CONFIG_TYPEC_ET7303. См. разделы DTS HUSB311 Linux-4.19 и Linux-5.10: адрес HUSB311 и ET7303 одинаков — 0x4E; достаточно изменить имя узла и compatible = "etek,et7303".

Примечание 3. Отдельно включите CONFIG_TYPEC_HUSB311; подробности см. в соответствующих разделах DTS HUSB311 Linux-4.19 и Linux-5.10.

Примечание 4. RT1711H аппаратно совместим с FUSB302/ET7303, а драйвер очень похож на ET7303. Отдельно включите CONFIG_TYPEC_RT1711H. DTS почти совпадает с HUSB311/ET7303, адрес также 0x4E; меняются имя узла и compatible = "richtek,rt1711h".

## 6. ссылки

1. «Universal Serial Bus Type-C Cable and Connector Specification»

2. «Rockchip_Developer_Guide_USB_CN»

3. «Rockchip_RK3399_Developer_Guide_USB_CN»

4. kernel/Documentation/devicetree/bindings/usb/generic.txt

5. kernel/Documentation/devicetree/bindings/usb/dwc3.txt

6. kernel/Documentation/devicetree/bindings/usb/rockchip,dwc3.txt

7. kernel/Documentation/devicetree/bindings/usb/usb-ehci.txt

8. kernel/Documentation/devicetree/bindings/usb/usb-ohci.txt

9. kernel/Documentation/devicetree/bindings/phy/phy-rockchip-naneng-combphy.txt

10. kernel/Documentation/devicetree/bindings/phy/phy-rockchip-inno-usb2.txt

{% endraw %}
