---
title: "RK3399 USB: контроллеры, PHY, интерфейсные схемы и DTS"
description: "RK3399 USB: контроллеры, PHY, интерфейсные схемы и DTS — V2.0.0"
translation_key: "166-rockchip-rk3399-usb"
slug: "166-rockchip-rk3399-usb"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, Type-C, PHY, DTS]
excerpt: "RK3399 USB: контроллеры, PHY, интерфейсные схемы и DTS — V2.0.0"
---

{% raw %}

Полное техническое содержание китайского и английского руководств Rockchip RK3399 USB V2.0.0. Область: RK3399, Linux 4.4+. Это платформенный справочник ArmSoM, не обещание поддержки всех плат. Проверяйте плату, SDK/BSP, ветку ядра, выводы USB/DP, питание VBUS и Type-C-контроллер. Аппаратная проверка ArmSoM не проводилась; результаты и вывод — примеры оригинала. Китайская версия использует китайские рисунки, остальные — английские оригиналы.

Обзор исходника: настройка и использование USB DTS RK3399 в разных версиях Linux. RK3399 имеет два Type-C с USB 3.1 Gen1 и DisplayPort и два USB 2.0 Host. Каждый Type-C использует отдельный контроллер USB 3.1 Gen1 OTG с Peripheral и Host и обратной совместимостью USB2.0/1.1/1.0. В изделиях можно упростить физические интерфейсы до Type-A USB 3.0/2.0 + DP, Micro USB 3.0/2.0 и других вариантов. Драйверы ядра поддерживают распространённые схемы, но USB DTS должен соответствовать реальной аппаратуре.

> Статусы поддержки и отладки относятся к периоду исходника, а не текущему SDK. Питание и соединения должны соответствовать номиналам компонентов. Команды требуют проверки и адаптированного устройства; здесь они не выполнялись. В оригинале встречаются RK3599, RK3588 Type-C0/1, R3399, USBDeviec и powr-role — возможные ошибки копирования/написания. Они сохранены для проверки, но не доказывают поддержку плат; сверяйте TRM RK3399 и SDK.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. RK3399 контроллеры USB и PHY: введение

RK3599 (так в оригинале; тема документа — RK3399, обозначение требует проверки) поддерживает пять независимых USB-контроллеров: два USB 2.0 HOST, два USB 3.1 OTG и один USB 2.0 HOST HSIC. Таблица 1-1: контроллеры RK3399.

| Чип/контроллер | USB 2.0 HOST<br>(EHCI&amp;OHCI) | USB 3.1 OTG<br>(DWC3&amp;xHCI) | USB 2.0 Host<br>HSIC(EHCI) |
| --- | --- | --- | --- |
| RK3399 | 2 | 2 | 1 |

RK3399 содержит пять USB PHY: два USB 2.0 Combo PHY, два USB 3.1/DP Combo PHY и один HSIC PHY. Таблица 1-2: USB PHY RK3399.

| Чип/PHY | USB 2.0 Combo PHY | USB3.1/DP Combo PHY | HSIC PHY |
| --- | --- | --- | --- |
| RK3399 | 2 [2 × ports] | 2 | 1 |

Примечания:

1. N означает N независимых USB-контроллеров или PHY.

2. [2 × ports] означает два USB-порта/разъёма на PHY.

3. EHCI&amp;OHCI означает интеграцию EHCI и OHCI, DWC3&amp;xHCI — DWC3 и xHCI в одном контроллере.

4. Физическая скорость USB 3.1 Gen1 — 5Gbps, USB 2.0 — 480Mbps.

5. USB 3.1/DP Combo PHY имеет четыре линии и одновременно поддерживает USB 3.1 + DP с двумя линиями. Внутренние связи контроллеров/PHY RK3399 без HSIC и распространённые физические разъёмы показаны на рис. 1-1.

![Рисунок 1, английский PDF, с. 6](/docs/rockchip-rk3399-usb/assets/en-p006-figure-01.png)

*Рисунок 1, английский PDF, с. 6*

Рисунок 1-1. Связи USB-контроллеров и PHY RK3399. Примечания:

1. Одновременно поддерживаются до двух Type-C, двух Type-A USB 2.0 и одного USB 2.0 HSIC.

2. RK3399 имеет один DP-контроллер. SDK соединяет его с Type-C0; ПО может переключить на Type-C1, но используется только один из них.

3. USB 3.1 OTG и DP совместно используют USB3.1/DP Combo PHY: полноценный Type-C либо отдельные USB 3.1 Type-A и двухлинейный DP.

4. USB 3.1/DP Combo PHY поддерживает только USB 3.1 Gen1, не USB 2.0. Для полной поддержки USB 3.1 он объединён с отдельным USB 2.0 PHY; аппаратные блоки и питание независимы. Combo PHY0 фиксированно связан с port0 USB2 Combo PHY0, Combo PHY1 — с port0 USB2 Combo PHY1. Связи отражены в Linux USB DTS.

5. Поддержка не ограничена Type-C/A на рис. 1-1: доступны распространённые Type-C, Type-A и Micro USB 2.0/3.1. См. раздел типов интерфейсов. Драйверы Linux уже учитывают различные схемы; разработчик должен правильно настроить USB DTS под фактическую плату. Подробности в разделе конфигурации RK3399 USB DTS.

## 2. RK3399 поддерживаемые интерфейсы USB

RK3399 поддерживает типы USB на рис. 2-1; аппаратную схему можно выбирать по требованиям продукта.

![Рисунок 2, английский PDF, с. 7](/docs/rockchip-rk3399-usb/assets/en-p007-figure-01.png)

*Рисунок 2, английский PDF, с. 7*

Рисунок 2-1. Поддерживаемые USB-интерфейсы RK3399.

### 2.1 Type-C типы интерфейсов

#### 2.1.1 Type-C USB 3.1&DP полнофункциональный интерфейс

В оригинале указано RK3588 Type-C0/1 (в документе RK3399, требует проверки). Полноценный Type-C на рис. 2-2 поддерживает PD с внешним Type-C-контроллером, USB 3.1 Gen1 5Gbps и DP Alternate Mode.

![Рисунок 3, английский PDF, с. 8](/docs/rockchip-rk3399-usb/assets/en-p008-figure-01.png)

*Рисунок 3, английский PDF, с. 8*

Рисунок 2-2. Type-C USB 3.1/DP. Полная распиновка штекера и гнезда приведена на рис. 2-3.

![Рисунок 4, английский PDF, с. 8](/docs/rockchip-rk3399-usb/assets/en-p008-figure-02.png)

*Рисунок 4, английский PDF, с. 8*

Рисунок 2-3. Распиновка Type-C. Таблица 2-1: описание контактов.

| Pin | Имя | Описание | Pin | Имя | Описание |
| --- | --- | --- | --- | --- | --- |
| A1 | GND | Земля | B12 | GND | Земля |
| A2 | SSTXp1 | Дифференциальный сигнал SuperSpeed<br>TX1+ | B11 | SSRXp1 | Дифференциальный сигнал SuperSpeed<br>RX1+ |
| A3 | SSTXn1 | Дифференциальный сигнал SuperSpeed<br>TX1- | B10 | SSRXn1 | Дифференциальный сигнал SuperSpeed<br>RX1- |
| A4 | VBUS | Питание шины USB | B9 | VBUS | Питание шины USB |
| A5 | CC1 | Канал конфигурации | B8 | SBU2 | Боковой канал (SBU) |
| A6 | Dp1 | Дифференциальный сигнал USB 2.0 D1+ | B7 | Dn2 | Дифференциальный сигнал USB 2.0 D2- |
| A7 | Dn1 | Дифференциальный сигнал USB 2.0 D1- | B6 | Dp2 | Дифференциальный сигнал USB 2.0 D2+ |
| A8 | SBU1 | Боковой канал (SBU) | B5 | CC2 | Канал конфигурации |
| A9 | VBUS | Питание шины USB | B4 | VBUS | Питание шины USB |
| A10 | SSRXn2 | Дифференциальный сигнал SuperSpeed<br>RX2- | B3 | SSTXn2 | Дифференциальный сигнал SuperSpeed<br>TX2- |
| A11 | SSRXp2 | Дифференциальный сигнал SuperSpeed<br>RX2+ | B2 | SSTXp2 | Дифференциальный сигнал SuperSpeed<br>TX2+ |
| A12 | GND | Земля | B1 | GND | Земля |

Таблица 2-2. Соединения RK3399 Type-C0 с Type-C-разъёмом.

| RK3399 Тип.e-C0 Pin | Вывод интерфейса Type-C | Соединение |
| --- | --- | --- |
| TYPEC0_TX1P/TX1M | A2/A3 | Для USB 3.1 Tx1 или DP Tx lane0 |
| TYPEC0_RX1P/RX1M | B11/B10 | Для USB 3.1 Rx1 или DP Tx lane1 |
| TYPEC0_RX2P/RX2M | A11/A10 | Для USB 3.1 Rx2 или DP Tx lane2 |
| TYPEC0_TX2P/TX2M | B2/B3 | Для USB 3.1 Tx2 или DP Tx lane3 |
| TYPEC0_DP/DM | A6/A7, B6/B7 | К RK3399 TYPEC0_OTG_DP/DM; A6 и B6 параллельно, A7 и B7 параллельно |
| TYPEC0_SBU1/SBU2 | A8/B8 | К AUX RK3399 USBDP PHY, только DP Alternate Mode |
| TYPEC0_SBU1_DC/SBU2_DC | A8/B8 | Управление подтяжкой передачи DP AUX; к GPIO подключать не нужно |
| TYPEC0_CC1/CC2 | A5/B5 | К внешнему Type-C-контроллеру HUSB311/FUSB302, не к CC1/CC2 SoC R3399 (так в оригинале) |
| TYPEC0_U2VBUSDET | A4/A9/B4/B9 | VBUS Type-C понижается преобразователем до 3V и соединяется с VBUSDET SoC RK3399 |

Примечания:

1. CC1/CC2 RK3399 не используются, оставьте неподключёнными.

2. USBDP PHY RK3399 управляет подтяжками TYPEC0_SBU1_DC/SBU2_DC без дополнительных GPIO, в отличие от RK3588.

3. Один DP-контроллер RK3399 не позволяет Type-C0/1 одновременно использовать DP, в отличие от RK3588 с двумя независимыми DP-контроллерами.

4. RK3399 Type-C-драйвер не поддерживает постоянное питание TYPEC0_U2VBUSDET. Соедините этот вывод через преобразование напряжения с VBUS разъёма для USB Device hotplug и BC 1.2; это отличается от RK3588.

5. Оба чипа поддерживают полноценный Type-C USB&amp;DP, но мультиплексирование линий USBDP PHY отличается. Таблица 2-3: линии RK3399/RK3588.

| USBDP PHY lane | RK3399 USB | RK3399 DP | RK3588 USB | RK3588 DP |
| --- | --- | --- | --- | --- |
| lane0 | USB3 Tx1 | DP TX0 | USB3 Rx1 | DP TX0 |
| lane1 | USB3 Rx1 | DP TX1 | USB3 Tx1 | DP TX1 |
| lane2 | USB3 Rx2 | DP TX2 | USB3 Rx2 | DP TX2 |
| lane3 | USB3 Tx2 | DP TX3 | USB3 Tx2 | DP TX3 |

#### 2.1.2 Type-C to Type-A USB&DP интерфейс

Type-C0 RK3399 можно разделить на отдельные Type-A USB 3.1 и DP, например:

1. Type-A USB 3.1 на USBDP PHY0 lane0/1 плюс DP 1.3 на lane2/3.

2. Type-A USB 3.1 на lane0/1 плюс DP-to-VGA на lane2/3. Далее оригинал называет RK3588 Type-C0: отдельный Type-A USB 2.0 без USBDP PHY плюс четырёхлинейный DP-to-HDMI2.0 на lane0/1/2/3. Обозначение платформы требует проверки. Примечания:

1. SDK-драйвер Type-C Linux 4.4/4.19 по умолчанию не поддерживает разделение USB/DP; изменения описаны в разделе Type-C to Type-A USB&amp;DP DTS.

2. Из-за одного DP-контроллера предпочтительна схема Type-C0 USB&amp;DP + Type-C1 USB only; она уменьшает объём разработки.

3. Теоретически возможны USB 3.1 на lane2/3 и DP на lane0/1, но требуется самостоятельная правка DTS. Без особых аппаратных причин предпочтительны обычные варианты 1 и 2 выше.

#### 2.1.3 Type-C USB 2.0 only интерфейс

Type-C USB 2.0 only RK3399 упрощает схему: PD с внешним контроллером, USB 2.0 480Mbps, без DP Alternate Mode (рис. 2-4). Максимальная скорость снижается; Linux USB DTS требует существенных изменений, см. конфигурацию Type-C USB 2.0 only.

![Рисунок 5, английский PDF, с. 12](/docs/rockchip-rk3399-usb/assets/en-p012-figure-01.png)

*Рисунок 5, английский PDF, с. 12*

Рисунок 2-4. Type-C USB 2.0 only.

### 2.2 Type-A типы интерфейсов

#### 2.2.1 Type-A USB 3.1 интерфейс

До двух Type-A USB 3.1: Type-C0 to Type-A USB 3.1 и Type-C1 to Type-A USB 3.1.

![Рисунок 6, английский PDF, с. 12](/docs/rockchip-rk3399-usb/assets/en-p012-figure-02.png)

*Рисунок 6, английский PDF, с. 12*

Рисунок 2-5. Type-A USB 3.1.

#### 2.2.2 Type-A USB 2.0 интерфейс

До четырёх Type-A USB 2.0: Type-C0 to Type-A USB 2.0, Type-C1 to Type-A USB 2.0, USB 2.0 HOST0 и HOST1.

![Рисунок 7, английский PDF, с. 13](/docs/rockchip-rk3399-usb/assets/en-p013-figure-01.png)

*Рисунок 7, английский PDF, с. 13*

Рисунок 2-6. Type-A USB 2.0.

### 2.3 Micro типы интерфейсов

#### 2.3.1 Micro USB 3.1 интерфейс

Type-C0/1 поддерживает Micro USB 3.1, редко используемый из-за площади PCB. По сравнению с Type-A добавлен OTG ID для автоматического определения уровня и переключения Device/Host. Подключите ID к TYPEC0_ID (для Type-C1 — TYPEC1_ID). Встроенная подтяжка к 1.8V уже есть, внешняя не нужна.

![Рисунок 8, английский PDF, с. 13](/docs/rockchip-rk3399-usb/assets/en-p013-figure-02.png)

*Рисунок 8, английский PDF, с. 13*

Рисунок 2-7. Micro USB 3.1.

#### 2.3.2 Micro USB 2.0 интерфейс

Type-C0 поддерживает Micro USB 2.0: схема проще, но максимальная скорость ниже. По сравнению с Type-A добавлен OTG ID для автоматической Device/Host-переключения. Подключите его к TYPEC0_ID; встроенной подтяжки к 1.8V достаточно.

![Рисунок 9, английский PDF, с. 14](/docs/rockchip-rk3399-usb/assets/en-p014-figure-01.png)

*Рисунок 9, английский PDF, с. 14*

Рисунок 2-8. Micro USB 2.0.

## 3. RK3399 Type-C замечания по USB

1. Разделение Type-C USB 3.1 на USB 2.0 и USB 3.1. Свойства контроллера:

(1) Device и Host одновременно не работают. (2) В Host USB 2.0/3.1 порты могут работать независимо и одновременно. (3) В Device USB 2.0/3.1 одновременно не работают. Разделяйте порты лишь при исключительно Host-применении; иначе ограничения Device делают разделение нежелательным.

2. Разделение USB 3.1 и DP: возможны USB 3.1 + DP 2 lanes либо USB 2.0 + DP 4 lanes. SDK не обеспечивает полностью готовую поддержку; см. Type-C to Type-A USB&amp;DP DTS.

3. TYPEC0_U2VBUSDET обнаруживает подключение/отключение USB Device. Исходник также называет его TYPEC0_USB20_VBUSDET. (1) Для MaskROM USB download при включении системы нужен внешний высокий уровень, не floating. (2) Допустимый высокий уровень 1.4V–3.3V. (3) Linux 4.4/4.19/5.10 не поддерживает постоянно высокий сигнал для Type-C. Соедините с VBUS через преобразователь напряжения, иначе нарушаются Device hotplug и BC 1.2.

4. Оба Type-C-контроллера аппаратно поддерживают USB 3.1 OTG и USB 2.0/1.1/1.0, но Gadget-фреймворк разрешает только один Device-контроллер. SDK задаёт Type-C0 OTG, Type-C1 Host. (1) Прошивка загружается только через Type-C0, изменить нельзя. (2) ADB по умолчанию Type-C0; перенос см. раздел Type-C1 OTG. (3) Двойной OTG теоретически возможен, но SDK не содержит динамического Device-переключения OTG0/1. Предпочтительно фиксировать Device на одном порту. Для двух OTG приложение должно отслеживать USB mode Type-C0/C1 и динамически записывать /config/usb_gadget/g1/UDC, связывая Gadget с соответствующим контроллером.

## 4. RK3399 USB DTS настройка

USB DTS включает общие DTSI-настройки контроллеров/PHY и DTS платы. Первые задают reg, clock, reset, grf, interrupts и свойства контроллеров; вторые — VBUS, внешний Type-C-контроллер вроде FUSB302 и особенности схемы.

### 4.1 настройка USB DTSI уровня чипа

Основные узлы RK3399 DTSI перечислены в таблице 4-1. Они задают общие ресурсы/свойства контроллеров и PHY, поэтому изменять их не рекомендуется. Таблица 4-1: соответствие USB-интерфейсов и DTS-узлов.

| Имя USB-интерфейса (схема) | Узел DTS USB-контроллера | Узел DTS USB PHY |
| --- | --- | --- |
| TYPEC0 | usbdrd3_0<br>usbdrd_dwc3_0 | u2phy0_otg<br>tcphy0_usb3 |
| TYPEC1 | usbdrd3_1<br>usbdrd_dwc3_1 | u2phy1_otg<br>tcphy1_usb3 |
| USB20_HOST0 | usb_host0_ehci<br>usb_host0_ohci | u2phy0_host |
| USB20_HOST1 | usb_host1_ehci<br>usb_host1_ohci | u2phy1_host |

DTSI контроллеров на примере Linux 4.19: arch/arm64/boot/dts/rockchip/rk3399.dtsi.

```text
/* USB3.1 OTG0 DWC3 Controller, support USB3.1/2.0/1.1/1.0 */
usbdrd3_0: usb@fe800000 {
        compatible = "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_0: usb@fe800000 {
                compatible = "snps,dwc3";
                ......
                dr_mode = "otg"; /* Type-C0 默认⽀持 OTG mode */
                phys = <&u2phy0_otg>, <&tcphy0_usb3>;  /* 配置 USB2.0 和 USB3.1
PHY 属性 */
                phy-names = "usb2-phy", "usb3-phy";
                ......
        };
};

/* USB3.1 OTG1 DWC3 Controller, support USB3.1/2.0/1.1/1.0 */
usbdrd3_1: usb@fe900000 {
        compatible = "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_1: usb@fe900000 {
                compatible = "snps,dwc3";
                ......
                dr_mode = "host"; /* Type-C1 默认只⽀持 Host mode */
                phys = <&u2phy1_otg>, <&tcphy1_usb3>; /* 配置 USB2.0 和 USB3.1 PHY
属性 */
                phy-names = "usb2-phy", "usb3-phy";
                ......
        };
};
/* USB2.0 HOST0 EHCI Controller, support USB2.0 only */
usb_host0_ehci: usb@fe380000 {
        compatible = "generic-ehci";
        ......
        phys = <&u2phy0_host>;
        ......
};

/* USB2.0 Host0 OHCI Controller, support USB1.1/1.0*/
usb_host0_ohci: usb@fe3a0000 {
        compatible = "generic-ohci";
        ......
        phys = <&u2phy0_host>;
        ......
};

/* USB2.0 HOST1 EHCI Controller, support USB2.0 only */
usb_host1_ehci: usb@fe3c0000 {
        compatible = "generic-ehci";
        ......
        phys = <&u2phy1_host>;
        ......
};

/* usb2.0 HOST1 OHCI Controller, support USB1.1/1.0 */
usb_host1_ohci: usb@fe3e0000 {
        compatible = "generic-ohci";
        ......
        phys = <&u2phy1_host>;
        ....
};
```

DTSI PHY на примере Linux 4.19: arch/arm64/boot/dts/rockchip/rk3399.dtsi.

```text
/* USB2.0 Combo PHY0/1 */
grf: syscon@ff770000 {
        compatible = "rockchip,rk3399-grf", "syscon", "simple-mfd";
        ......
        u2phy0: usb2-phy@e450 {
                compatible = "rockchip,rk3399-usb2phy";
                ......
                u2phy0_host: host-port { /* ⽤于 USB2.0 HOST0 */
                        #phy-cells = <0>;
                        ......
                };

                u2phy0_otg: otg-port { /* ⽤于 Type-C0 OTG 的 USB2 port */
                        #phy-cells = <0>;
                        ......
                };
        };
        u2phy1: usb2-phy@e460 {
                compatible = "rockchip,rk3399-usb2phy";
                ......
                u2phy1_host: host-port { /* ⽤于 USB2.0 HOST1 */
                        #phy-cells = <0>;
                        ......
                };

                u2phy1_otg: otg-port { /* ⽤于 Type-C1 OTG 的 USB2 port */
                        #phy-cells = <0>;
                        ......
                };
        };
};

/* USB3.1/DP Combo PHY0 */
tcphy0: phy@ff7c0000 {
        compatible = "rockchip,rk3399-typec-phy";
        ......
        tcphy0_dp: dp-port { /* ⽤于 Type-C0 的 Display 功能 */
                #phy-cells = <0>;
        };

        tcphy0_usb3: usb3-port { /* ⽤于 Type-C0 的 USB3.1 功能 */
                #phy-cells = <0>;
        };
};

/* USB3.1/DP Combo PHY1 */
tcphy1: phy@ff800000 {
        compatible = "rockchip,rk3399-typec-phy";
        ......
        tcphy1_dp: dp-port {  /* ⽤于 Type-C1 的 Display 功能 */
                #phy-cells = <0>;
        };

        tcphy1_usb3: usb3-port { /* ⽤于 Type-C1 的 USB3.1 功能 */
                #phy-cells = <0>;
        };
};
```

Примечания:

1. PHY и контроллеры настраиваются попарно; аппаратные связи см. введение. Свойство phys контроллера связывает его с PHY.

2. С Linux 4.19 драйвер DWC3 существенно изменён: power-domains и resets перенесены из родителя usbdrd3_x в дочерний usbdrd_dwc3_x. В Linux 4.4 они остаются в родителе. Большинству прикладных USB-разработчиков это изменение учитывать не требуется.

3. SDK задаёт Type-C0 OTG с динамическим Device/Host-переключением и Type-C1 только Host. Для Type-C1 OTG/ADB изучите ограничения и изменения в разделах замечаний Type-C USB и настройки Type-C1 OTG.

### 4.2 Type-C USB 3.1/DP полнофункциональный DTS настройка

Полноценный Type-C USB 3.1/DP требует внешнего контроллера для ориентации, PD, ролей USB и DP Alternate Mode. DTS зависит от чипа. Ранние SDK Linux 4.4/4.19 без стандартных TCPM/TCPCI поддерживают только FUSB302. Более новые 4.19 и последующие поддерживают TCPM/TCPCI и дополнительные совместимые чипы, например HUSB311. Ниже настройки FUSB302/HUSB311 для разных ядер.

#### 4.2.1 Linux-4.4 Type-C USB 3.1&DP полнофункциональный DTS настройка[FUSB302]

Пример Type-C0 RK3399 IND EVB: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

```text
&i2c4 {
        fusb0: fusb30x@22 { /* 配置 FUSB302 芯⽚硬件信息*/
                compatible = "fairchild,fusb302";
                reg = <0x22>;
                pinctrl-names = "default";
                pinctrl-0 = <&fusb0_int>;
                int-n-gpios = <&gpio1 2 GPIO_ACTIVE_HIGH>;
                vbus-5v-gpios = <&gpio1 18 GPIO_ACTIVE_HIGH>;
                status = "okay";
        };
};

&tcphy0 { /* 使能 Type-C0 USB3.1 PHY */
        extcon = <&fusb0>; /* 配置 extcon 属性，⽤于接收 FUSB302 驱动的 Type-C
notifier*/
        status = "okay";
};

&u2phy0 { /* 使能 Type-C0 USB2.0 PHY */
        status = "okay";
        extcon = <&fusb0>; /* 配置 extcon 属性，⽤于接收 FUSB302 驱动的 Type-C DRD
notifier*/
        u2phy0_otg: otg-port {
                status = "okay";
        };
};

&usbdrd3_0 { /* 使能 USB3 控制器⽗节点 */
        status = "okay";
        extcon = <&fusb0>; /* 配置 extcon 属性，⽤于接收 FUSB302 驱动的 Type-C DRD
notifier*/
};

&usbdrd_dwc3_0 { /* 使能 USB3 控制器⼦节点 */
        status = "okay";
};

&pinctrl {
    fusb30x { /* 配置 FUSB302 驱动的中断和 vbus gpio pinctrl */
                fusb0_int: fusb0-int {
                        rockchip,pins = <1 2 RK_FUNC_GPIO &pcfg_pull_up>,
                                        <1 18 RK_FUNC_GPIO &pcfg_pull_up>;
                };
        };
};
```

#### 4.2.2 Linux-4.19 Type-C USB 3.1&DP полнофункциональный DTS настройка[FUSB302]

Linux 4.19 FUSB302 почти совпадает с 4.4; отличается только место ссылки extcon в DWC3.

```text
&usbdrd3_0 {
        status = "okay";
};

&usbdrd_dwc3_0 {
        status = "okay";
        extcon = <&fusb0>; /* Linux-4.19 的 extcon 属性放在 DWC3 ⼦节点 */
};
```

#### 4.2.3 Linux-4.19 Type-C USB 3.1&DP полнофункциональный DTS настройка[HUSB311]

Обновлённое ядро 4.19 RK3399 поддерживает HUSB311 и ET7303. Оба имеют I2C-адрес 4E, DTS отличается лишь именем и compatible; далее HUSB311. FUSB302 на EVB IND можно заменить HUSB311. Оба драйвера используют TCPM: синхронизируйте develop-4.19 либо хотя бы следующие каталоги:

```text
kernel/include/linux/usb
kernel/drivers/usb/typec
kernel/drivers/usb/dwc3
```

Также вручную примените патчи:

```text
0001-usb-typec-tcpm-add-vdm-retry-mechanism.patch
0002-arm64-dts-rockchip-rk3399-ind-support-type-c-port-co.patch
0003-arm64-rockchip_defconfig-enable-tcpm-and-husb311-and.patch
```

Используйте полный комплект «RK3399_Linux-4.19_TypeC-HUSB311-ET7303-参考设计» по адресу https://redmine.rockchip.com.cn/documents/113. Пример Type-C0 HUSB311 RK3399 IND EVB: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

```text
/* 需要包含头⽂件 */
#include "dt-bindings/usb/pd.h"

/* 可选配置，⽤于 vbus 通过 gpio 控制的硬件⽅案 */
vcc_otg_vbus: otg-vbus-regulator {
        compatible = "regulator-fixed";
        gpio = <&gpio1 RK_PC2 GPIO_ACTIVE_HIGH>;
        pinctrl-names = "default";
        pinctrl-0 = <&otg_vbus_drv>;
        regulator-name = "vcc_otg_vbus";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
};

&i2c4 {
        /* 对于 et7303, 可以修改为 usbc0: et7303@4e */
        usbc0: husb311@4e {
                /* 对于 et7303, compatible = "etek,et7303"*/
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                /* 中断 gpio 配置, 请根据原理图设计进⾏相应修改 */
                interrupt-parent = <&gpio1>;
                interrupts = <2 IRQ_TYPE_LEVEL_LOW>;
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

                        /* rk3399 平台才需要配置 dp altmodes, 默认配置即可 */
                        altmodes {
                                #address-cells = <1>;
                                #size-cells = <0>;

                                altmode@0 {
                                        reg = <0>;
                                        svid = <0xff01>;
                                        vdo = <0xffffffff>;
                                };
                        };
                };
        };
};

&pinctrl {
        husb311 {
                husb311_int: husb311-int {
                        rockchip,pins = <1 RK_PA2 RK_FUNC_GPIO &pcfg_pull_up>;
                };
        };

        usb {
                otg_vbus_drv: otg-vbus-drv {
                        /* 可选项，如果⽆ vcc_otg_vbus，就不需要该配置 */
                        rockchip,pins = <1 RK_PC2 RK_FUNC_GPIO &pcfg_pull_none>;
                };
        };
};

&cdn_dp {
        status = "okay";
        extcon = <&husb0>;
        phys = <&tcphy0_dp>;
};

bq25700: bq25700@6b {
        compatible = "ti,bq25703";
        reg = <0x6b>;
        extcon = <&husb0>;
        ......
};

&tcphy0 {
        extcon = <&husb0>;
        status = "okay";
};

&u2phy0 {
        status = "okay";
        extcon = <&husb0>;
};

&usbdrd_dwc3_0 {
        status = "okay";
        extcon = <&husb0>;
};
```

Конфигурация VBUS через PMIC RK817/RK818/bq25700 и подобные:

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

#### 4.2.4 Linux-5.10 Type-C USB 3.1&DP полнофункциональный DTS настройка[FUSB302]

Linux 5.10 использует TCPM и remote-endpoint с регистрацией callback вместо extcon старых версий; свойство extcon для Type-C больше не нужно. Поддержка RK3399 Type-C DP в этой версии исходного SDK ещё неполная, поэтому dp_altmode отсутствует в tcphy0 и usb_con. Пример Type-C0 IND EVB: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

```text
/* 配置 VBUS gpio regulator，⽤于 Type-C 作 USB Host mode 时 VBUS 5V 输出控制 */
vbus_typec: vbus-typec-regulator {
        compatible = "regulator-fixed";
        enable-active-high;
        gpio = <&gpio1 18 GPIO_ACTIVE_HIGH>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_typec0_en>;
        regulator-name = "vbus_typec";
        vin-supply = <&vcc5v0_sys>;
};

/* 配置 FUSB302 芯⽚硬件信息*/
&i2c4 {
        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                interrupt-parent = <&gpio1>;
                interrupts = <RK_PA2 IRQ_TYPE_LEVEL_LOW>;
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
                                        remote-endpoint = <&dwc3_0_role_switch>;
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

                        ports {
                                #address-cells = <1>;
                                #size-cells = <0>;
                                /* ⽤于关联 Type-C PHY，实现正反⾯切换的功能 */
                                port@0 {
                                        reg = <0>;
                                        usbc0_orien_sw: endpoint {
                                                remote-endpoint =
<&tcphy0_orientation_switch>;
                                        };
                                };
                                /* TODO 关联 Type-C PHY，实现 dp_altmode 功能 */
                        };
                };
        };
};

/* 使能 Type-C0 USB3.1 PHY */
&tcphy0 {
        status = "okay";
        orientation-switch; /* ⽤于使能 Type-C PHY 驱动注册 orientation switch 回调函
数*/
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                tcphy0_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>; /* 关联 FUSB302，实现
正反⾯切换的功能 */
                };
        };
};

/* 使能 Type-C0 USB2.0 PHY */
&u2phy0 {
        status = "okay";

        u2phy0_otg: otg-port {
                status = "okay";
        };
};

/* 使能 USB3 控制器⽗节点 */
&usbdrd3_0 {
        status = "okay";
};

/* 使能 USB3 控制器⼦节点 */
&usbdrd_dwc3_0 {
        status = "okay";
        usb-role-switch; /* ⽤于使能 DWC3 驱动注册 USB Role Switch 回调函数 */
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_0_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>; /* 关联 FUSB302，实现
USB ⻆⾊切换的功能 */
                };
        };
};

&pinctrl {
        usb-typec {
                usbc0_int: usbc0-int { /* 配置 FUSB302 驱动的中断 gpio pinctrl */
                        rockchip,pins = <1 RK_PA2 RK_FUNC_GPIO &pcfg_pull_up>;
                };

                vcc5v0_typec0_en: vcc5v0-typec0-en { /* 配置 FUSB302 驱动的 VBUS
gpio pinctrl */
                        rockchip,pins =
                                <1 RK_PC2 RK_FUNC_GPIO &pcfg_pull_none>;
                };
        };
};
```

#### 4.2.5 Linux-5.10 Type-C USB 3.1&DP полнофункциональный DTS настройка[HUSB311]

Для замены FUSB302 на HUSB311 внесите следующие небольшие изменения в приведённый Linux-5.10 DTS FUSB302:

```text
// 配置外置Type-C控制器芯⽚HUSB311
&i2c2 {
        usbc0: husb311@4e {
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                ......
        };
};
```

### 4.3 Type-C to Type-A USB&DP DTS настройка

Схема Type-C to Type-A USB&amp;DP разделяет разъём на USB и DP, поддерживая USB 3.1 + DP 2 lanes либо USB 2.0 + DP 4 lanes. Два варианта:

1. DTS Type-C to Type-A USB 3.1&amp;DP.

2. DTS Type-C to Type-A USB 2.0&amp;DP.

SDK RK3399 Linux 4.4/4.19 не поддерживает разделение по умолчанию. Требуется drivers/extcon/extcon-pd-virtual.c вместо драйвера внешнего Type-C-контроллера: он уведомляет Type-C PHY, DP и USB. При необходимости запросите поддержку через Rockchip Redmine. По состоянию документа Linux 5.10 ещё не поддерживает разделение; новая реализация разрабатывается без специального драйвера. Схема/ПО Type-C to USB2.0 + DP 4 lanes: https://redmine.rockchip.com.cn/documents/113.

#### 4.3.1 Type-C to Type-A USB 3.1&DP DTS настройка

Type-A USB 3.1 использует Type-C PHY lane0/1, DP 1.3 — lane2/3. Пример Type-C0 Linux 4.4/4.19:

```text
/* 配置虚拟 pd 驱动，⽤于发送通知给 Type-C PHY驱动和DP驱动 */
vpd0:virtual-pd0{
        compatible = "linux,extcon-pd-virtual";
        pinctrl-names = "default";
        pinctrl-0 = <&vpd0_int>;
        dp-det-gpios = <&gpio4 25 GPIO_ACTIVE_LOW>; /* 配置 DP 热拔插检测 GPIO */
        hdmi-5v-gpios = <&gpio4 29 GPIO_ACTIVE_LOW>; /* 配置 HDMI 5V 控制 GPIO */

        /* 0: positive, 1: negative*/
        vpd,init-flip = <0>;
        /* 0: u2, 1: u3*/
        vpd,init-ss = <1>;
        /* 0: dfp, 1: ufp, 2: dp, 3: dp&ufp */
        vpd,init-mode = <3>;
        status = "okay";
};

&pinctrl {
        vpd {
                vpd0_int: vpd0-int { /* 配置 GPIO pinctrl */
                        rockchip,pins =
                                <4 25 RK_FUNC_GPIO &pcfg_pull_up>;
                };
        };
};

/* 使能 DP 控制器 */
&cdn_dp {
        status = "okay";
        extcon = <&vpd0>; /* 配置 extcon 属性，⽤于接收虚拟 PD 驱动的通知 */
        dp_vop_sel = <1>;
};

/* 使能 Type-C0 PHY */
&tcphy0 {
        extcon = <&vpd0>; /* 配置 extcon 属性，⽤于接收虚拟 PD 驱动的通知 */
        status = "okay";
};

/* 使能 USB2 PHY */
&u2phy0 {
        status = "okay";
        /* 这⾥不需要配置extcon属性 */

        u2phy0_otg: otg-port {
                status = "okay";
        };
};

/* 使能 USB 控制器⽗节点 */
&usbdrd3_0 {
        extcon = <&u2phy0>;  /* extcon 是可选项, 只⽤于 Linux-4.4 且为 Micro 接⼝。如
果⽤ Type-A 接⼝，不⽤配置，⻅ Note1 */
        status = "okay";
};

/* 使能 USB 控制器⼦节点 */
&usbdrd_dwc3_0 {
        dr_mode = "otg"; /* 配置为 otg mode */
        phys = <&u2phy0_otg>, <&tcphy0_usb3>; /* 必须要配置U2和U3 PHY */
        phy-names = "usb2-phy", "usb3-phy";
        extcon = <&u2phy0>;  /* extcon 只⽤于 Linux-4.19 */
        status = "okay";
};
```

#### 4.3.2 Type-C to Type-A USB 2.0&DP DTS настройка

Type-A USB 2.0 не использует Type-C PHY; DP 4 lanes to HDMI2.0 использует lane0/1/2/3. Пример Linux 4.4/4.19 Type-C0:

```text
/* 配置虚拟 pd 驱动，⽤于发送通知给 Type-C PHY驱动和DP驱动 */
vpd0:virtual-pd0{
        compatible = "linux,extcon-pd-virtual";
        pinctrl-names = "default";
        pinctrl-0 = <&vpd0_int>;
        dp-det-gpios = <&gpio4 25 GPIO_ACTIVE_LOW>; /* 配置 DP 热拔插检测 GPIO */
        hdmi-5v-gpios = <&gpio4 28 GPIO_ACTIVE_LOW>; /* 配置 HDMI 5V 控制 GPIO */

        /* 0: positive, 1: negative*/
        vpd,init-flip = <0>;
        /* 0: u2, 1: u3*/
        vpd,init-ss = <0>;
        /* 0: dfp, 1: ufp, 2: dp, 3: dp&ufp */
        vpd,init-mode = <2>;
        status = "okay";
};
&pinctrl {
        vpd {
                vpd0_int: vpd0-int { /* 配置 GPIO pinctrl */
                        rockchip,pins =
                                <4 25 RK_FUNC_GPIO &pcfg_pull_up>;
                };
        };
};

/* 使能 DP 控制器 */
&cdn_dp {
        status = "okay";
        extcon = <&vpd0>; /* 配置 extcon 属性，⽤于接收虚拟 PD 驱动的通知 */
        dp_vop_sel = <1>;
};

/* 使能 Type-C0 PHY */
&tcphy0 {
        extcon = <&vpd0>; /* 配置 extcon 属性，⽤于接收虚拟 PD 驱动的通知 */
        status = "okay";
};

/* 使能 USB2 PHY */
&u2phy0 {
        status = "okay";
        /* 这⾥不需要配置extcon属性 */

        u2phy0_otg: otg-port {
                status = "okay";
        };
};

/* 使能 USB 控制器⽗节点 */
&usbdrd3_0 {
        extcon = <&u2phy0>;  /* extcon 是可选项, 只⽤于 Linux-4.4 且为 Micro 接⼝。如
果⽤ Type-A 接⼝，不⽤配置，⻅ Note1 */
        status = "okay";
};

/* 使能 USB 控制器⼦节点 */
&usbdrd_dwc3_0 {
        dr_mode = "otg"; /* 配置为 otg mode */
        maximum-speed = "high-speed"; /* 配置最⾼⽀持 high-speed */
        phys = <&u2phy0_otg>, <&tcphy0_usb3>; /* 必须要配置U2和U3 PHY */
        phy-names = "usb2-phy", "usb3-phy";
        extcon = <&u2phy0>;  /* extcon 只⽤于 Linux-4.19 */
        status = "okay";
};
```

При Type-A приложение после запуска должно выбрать Peripheral/Host через узел смены OTG mode ядра. См. команды переключения RK3399 OTG.

### 4.4 Type-C to Type-A USB only DTS настройка

Type-C to Type-A USB only: USB3.1/2.0 без DP; нет автоматического OTG-переключения, но возможно принудительное программное; внешний Type-C-контроллер не нужен. Четыре варианта:

1. DTS Type-C to Type-A USB 3.1 OTG.

2. DTS Type-C to Type-A USB 3.1 Host only.

3. DTS Type-C to Type-A USB 2.0 OTG.

4. DTS Type-C to Type-A USB 2.0 Host only.

#### 4.4.1 Type-C to Type-A USB 3.1 OTG DTS настройка

Type-C to Type-A USB 3.1 OTG обычно использует Type-C0 RK3399 и поддерживает Type-A USB

3.1 OTG без DP. После запуска контроллер в OTG/Device и автоматически Device/Host не переключает; для Host приложение явно вызывает интерфейс ядра, см. OTG-команды. VBUS может быть постоянным или управляться GPIO/PMIC, см. раздел VBUS; все три питания Type-C включены. Linux 4.4: не задавать внешний FUSB302/HUSB311; не задавать extcon в tcphy, u2phy и родителе usbdrd3; dr_mode="otg"; необязательный vbus-supply в u2phy0_otg для Host 5V. Linux 4.19: также без внешнего контроллера и extcon в tcphy/u2phy; добавить extcon в usbdrd_dwc3_0 для программного OTG; dr_mode="otg"; необязательный vbus-supply в u2phy0_otg. Для Linux 5.10:

Не задавать внешний FUSB302/HUSB311; в tcphy не задавать orientation-switch и связанные свойства; в usbdrd_dwc3_0 не задавать usb-role-switch и связанные свойства, но добавить extcon; dr_mode="otg"; необязательный vbus-supply в u2phy0_otg для Host 5V. Пример Type-C0 to Type-A USB 3.1 OTG с VBUS на GPIO3_PC6:

```text
/* 配置 VBUS gpio regulator，⽤于 OTG USB Host mode 控制 VBUS 5V 输出 */
vcc_otg_vbus: otg-vbus-regulator {
                compatible = "regulator-fixed";
                gpio = <&gpio3 RK_PC6 GPIO_ACTIVE_HIGH>;
                pinctrl-names = "default";
                pinctrl-0 = <&otg_vbus_drv>;
                regulator-name = "vcc_otg_vbus";
                regulator-min-microvolt = <5000000>;
                regulator-max-microvolt = <5000000>;
                enable-active-high;
};

&pinctrl {
        usb {
                otg_vbus_drv: otg-vbus-drv { /* 配置 VBUS gpio pinctrl */
                        rockchip,pins = <3 RK_PC6 RK_FUNC_GPIO &pcfg_pull_none>;
                };
        };
};

/* 使能 Type-C0 USB3.1 PHY */
&tcphy0 {
        /* 不要配置 extcon 属性，且不要配置 orientation-switch 及其相关属性 */
        status = "okay";
};

/* 使能 Type-C0 USB2.0 PHY */
&u2phy0 {
        /* 不要配置 extcon 属性 */
        status = "okay";

        u2phy0_otg: otg-port {
                vbus-supply = <&vcc_otg_vbus>; /* 可选配置，⽤于 PHY 驱动控制 OTG
VBUS 输出 5V */
                status = "okay";
        };
};

/* 使能 Type-C0 USB3.1 控制器⽗节点 */
&usbdrd3_0 {
        /* 不要配置⽗节点的 extcon 属性 */
        status = "okay";
};

/* 使能 Type-C0 USB3.1 控制器⼦节点 */
&usbdrd_dwc3_0 {
        dr_mode = "otg"; /* ⽤于⽀持 OTG device/host mode 切换 */
        extcon = <&u2phy0>; /* 可选配置，只⽤于 Linux-4.19/5.10 ⽀持软件切换 OTG mode
*/
        status = "okay";
};
```

GPIO VBUS необязателен. RK3399 допускает постоянный VBUS после включения: тогда не задавайте vbus-supply в u2phy0_otg, но добавьте rockchip,vbus-always-on, иначе ADB может не подключаться. Пример Type-C0; для Type-C1 измените u2phy1_otg:

```text
&u2phy0_otg {
        rockchip,vbus-always-on;
};
```

#### 4.4.2 Type-C to Type-A USB 3.1 Host only DTS настройка

Type-C to Type-A USB 3.1 Host широко применяется на Type-C1, например IND EVB. VBUS 5V постоянный или GPIO; все три питания Type-C1 включены для SuperSpeed. Linux 4.4/4.19: без внешнего FUSB302/HUSB311; без extcon в tcphy, u2phy и usbdrd3; dr_mode="host"; необязательный phy-supply в u2phy управляет VBUS 5V. Linux 5.10: без внешнего контроллера, orientation-switch и связанных свойств tcphy; без usb-role-switch, связанных свойств и extcon в usbdrd_dwc3_0; dr_mode="host"; необязательный phy-supply в u2phy.

Пример IND EVB Type-C1 to Type-A USB 3.1 Host: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

```text
/* 使能 Type-C1 USB3.1 PHY */
&tcphy1 {
        /* 不要配置 extcon 属性 */
        status = "okay";
};

/* 使能 Type-C1 USB2.0 PHY */
&u2phy1 {
        status = "okay";
        /* 不要配置 extcon 属性 */

        u2phy1_otg: otg-port {
                status = "okay";
                /* phy-supply 属性为可选项 */
        };
};

/* 使能 Type-C0 USB3.1 控制器⽗节点 */
&usbdrd3_1 {
        status = "okay";
};

/* 使能 Type-C0 USB3.1 控制器⼦节点 */
&usbdrd_dwc3_1 {
        dr_mode = "host"; /* 配置 dr_mode 为 host，表⽰只⽀持 Host only mode */
        status = "okay";
        /* 不要配置 extcon 属性，且不要配置 usb-role-switch 及其相关属性 */
};
```

#### 4.4.3 Type-C to Type-A USB 2.0 OTG DTS настройка

Type-C to Type-A USB 2.0 OTG обычно на Type-C0 — упрощённый USB 3.1 OTG, только USB 2.0. После запуска OTG/Device, автоматического Device/Host-переключения нет; для Host приложение использует интерфейс ядра, см. OTG-команды. VBUS постоянный либо GPIO/PMIC, см. раздел VBUS. Три питания Type-C следует выключить для снижения потребления PHY. DTS как USB 3.1 OTG, дополнительно:

1. Отключить tcphy.

2. Задать dr_mode, maximum-speed и phys контроллера. Пример Type-C0 USB 2.0 OTG с VBUS на GPIO3_PC6:

```text
/* 配置 VBUS gpio regulator，⽤于 OTG USB Host mode 控制 VBUS 5V 输出 */
vcc_otg_vbus: otg-vbus-regulator {
                compatible = "regulator-fixed";
                gpio = <&gpio3 RK_PC6 GPIO_ACTIVE_HIGH>;
                pinctrl-names = "default";
                pinctrl-0 = <&otg_vbus_drv>;
                regulator-name = "vcc_otg_vbus";
                regulator-min-microvolt = <5000000>;
                regulator-max-microvolt = <5000000>;
                enable-active-high;
};

&pinctrl {
        usb {
                otg_vbus_drv: otg-vbus-drv { /* 配置 VBUS gpio pinctrl */
                        rockchip,pins = <3 RK_PC6 RK_FUNC_GPIO &pcfg_pull_none>;
                };
        };
};

/* Disable Type-C0 USB3.1 PHY */
&tcphy0 {
        status = "disabled";
};

/* 使能 Type-C0 USB2.0 PHY */
&u2phy0 {
        /* 不要配置 extcon 属性 */
        status = "okay";

        u2phy0_otg: otg-port {
                vbus-supply = <&vcc_otg_vbus>; /* 可选配置，⽤于 PHY 驱动控制 OTG
VBUS 输出 5V */
                status = "okay";
        };
};

/* 使能 Type-C0 USB3.1 控制器⽗节点 */
&usbdrd3_0 {
        /* 不要配置⽗节点的 extcon 属性 */
        status = "okay";
};

/* 使能 Type-C0 USB3.1 控制器⼦节点 */
&usbdrd_dwc3_0 {
        dr_mode = "otg"; /* ⽤于⽀持 OTG device/host mode 切换 */
        maximum-speed = “high-speed”; /* maximum-speed 属性配置为 high-speed */
        phys = <&u2phy0_otg>; /* phys 属性只引⽤ USB2 PHY节点 */
        phy-names = "usb2-phy";
        extcon = <&u2phy0>; /* 可选配置，只⽤于 Linux-4.19/5.10 ⽀持软件切换 OTG mode
*/
        status = "okay";
};
```

#### 4.4.4 Type-C to Type-A USB 2.0 Host only DTS настройка

Type-A USB 2.0 Host only после запуска поддерживает только Host, не Device, но запись прошивки возможна. В продуктах встречается редко, поскольку обычно нужен хотя бы ADB. VBUS 5V постоянный или GPIO; три питания Type-C выключить для экономии. DTS см. USB 3.1 OTG, дополнительно:

1. Отключить tcphy.

2. Задать dr_mode, maximum-speed и phys. Пример Type-C0 USB 2.0 Host only с постоянным VBUS:

```text
/* Disable Type-C0 USB3.1 PHY */
&tcphy0 {
        status = "disabled";
};

/* 使能 Type-C0 USB2.0 PHY */
&u2phy0 {
        /* 不要配置 extcon 属性 */
        status = "okay";

        u2phy0_otg: otg-port {
                /* vbus-supply 属性为可选配置，VBUS 常供电⽅案不⽤配置 */
                status = "okay";
        };
};

/* 使能 Type-C0 USB3.1 控制器⽗节点 */
&usbdrd3_0 {
        /* 不要配置⽗节点的 extcon 属性 */
        status = "okay";
};

/* 使能 Type-C0 USB3.1 控制器⼦节点 */
&usbdrd_dwc3_0 {
        dr_mode = "host"; /* ⽤于⽀持 OTG device/host mode 切换 */
        maximum-speed = “high-speed”; /* maximum-speed 属性配置为 high-speed */
        phys = <&u2phy0_otg>; /* phys 属性只引⽤ USB2 PHY节点 */
        phy-names = "usb2-phy";
        /* extcon 属性不⽤配置，因为不需要⽀持 OTG mode 切换的功能*/
        status = "okay";
};
```

### 4.5 Type-C to Micro USB DTS настройка

#### 4.5.1 Type-C to Micro USB 3.1 OTG Mode DTS настройка

Micro USB 3.1 автоматически обнаруживает OTG cable и переключает Device/Host без внешнего Type-C-контроллера. Схема дешевле Type-C, но большой разъём неудобен для embedded-устройств и редок. VBUS 5V управляется GPIO; TYPEC0_ID соединяется с ID разъёма. DTS подобен Type-A USB 3.1 OTG с тремя отличиями:

1. В Linux 4.4 extcon требуется в родителе usbdrd3:

```text
/* 使能 Type-C0 USB3.1 控制器⽗节点 */
&usbdrd3_0 {
        extcon = <&u2phy0>; /* 只⽤于 Linux-4.4 OTG mode 切换 */
        status = "okay";
};

/* 使能 Type-C0 USB3.1 控制器⼦节点 */
&usbdrd_dwc3_0 {
        dr_mode = "otg"; /* ⽤于⽀持 OTG device/host mode */
        status = "okay";
};
```

2. В Linux 4.19/5.10 extcon требуется в дочернем usbdrd_dwc3:

```text
/* 使能 Type-C0 USB3.1 控制器⽗节点 */
&usbdrd3_0 {
        status = "okay";
};

/* 使能 Type-C0 USB3.1 控制器⼦节点 */
&usbdrd_dwc3_0 {
        dr_mode = "otg"; /* ⽤于⽀持 OTG device/host mode */
        extcon = <&u2phy0>; /* 只⽤于 Linux-4.19/5.10 OTG mode 切换 */
        status = "okay";
};
```

3. vbus-supply в u2phy0_otg обязателен для включения/выключения VBUS 5V.

#### 4.5.2 Type-C to Micro USB 2.0 OTG Mode DTS настройка

Micro USB 2.0 автоматически обнаруживает OTG cable и переключает Device/Host без внешнего контроллера. Дешевле Type-C, но максимум USB 2.0 480Mbps.

VBUS 5V управляется GPIO; TYPEC0_ID соединяется с ID разъёма для OTG; три питания Type-C выключаются для снижения потребления. DTS подобен Type-A USB 2.0 OTG с тремя отличиями:

1. В Linux 4.4 extcon требуется в родителе usbdrd3:

```text
/* 使能 Type-C0 USB3.1 控制器⽗节点 */
&usbdrd3_0 {
        extcon = <&u2phy0>; /* 只⽤于 Linux-4.4 OTG mode 切换 */
        status = "okay";
};

/* 使能 Type-C0 USB3.1 控制器⼦节点 */
&usbdrd_dwc3_0 {
        dr_mode = "otg"; /* ⽤于⽀持 OTG device/host mode 切换 */
        maximum-speed = “high-speed”; /* maximum-speed 属性配置为 high-speed */
        phys = <&u2phy0_otg>; /* phys 属性只引⽤ USB2 PHY节点 */
        phy-names = "usb2-phy";
        status = "okay";
};
```

2. В Linux 4.19/5.10 extcon требуется в дочернем usbdrd_dwc3:

```text
/* 使能 Type-C0 USB3.1 控制器⽗节点 */
&usbdrd3_0 {
        status = "okay";
};

/* 使能 Type-C0 USB3.1 控制器⼦节点 */
&usbdrd_dwc3_0 {
        dr_mode = "otg"; /* ⽤于⽀持 OTG device/host mode 切换 */
        maximum-speed = “high-speed”; /* maximum-speed 属性配置为 high-speed */
        phys = <&u2phy0_otg>; /* phys 属性只引⽤ USB2 PHY节点 */
        phy-names = "usb2-phy";
        extcon = <&u2phy0>; /* 只⽤于 Linux-4.19/5.10 OTG mode 切换 */
        status = "okay";
};
```

3. vbus-supply в u2phy0_otg обязателен для включения/выключения VBUS 5V.

### 4.6 Type-A USB 2.0 Host DTS настройка

RK3399 имеет два USB2.0 Host на EHCI&amp;OHCI, обычно Type-A. Включите соответствующие контроллер и PHY по схеме и таблице 4-1; phy-supply узла PHY управляет выходом VBUS 5V. Различные схемы управления описаны в разделе Host VBUS.

Type-A USB 2.0 Host DTS одинаков для разных ядер. Пример USB20_HOST0 IND EVB: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

```text
rk809: pmic@20 {
        ....
        regulators {
                vcc5v0_usb: SWITCH_REG1 { /* 配置 USB VBUS regulator */
                        regulator-always-on;
                        regulator-boot-on;
                        regulator-name = "vcc5v0_usb";
                        regulator-state-mem {
                                regulator-on-in-suspend;
                        };
                };
        };
};

&usb_host0_ehci { /* 使能 USB2.0 EHCI Controller, ⽀持 USB2.0 only */
        status = "okay";
};

&usb_host0_ohci { /* 使能 USB2.0 OHCI Controller, ⽀持 USB1.1/1.0 */
        status = "okay";
};

&u2phy0 {
        status = "okay";

        u2phy0_host: host-port {
                phy-supply = <&vcc5v0_usb>; /* ⽤于 PHY 驱动控制 USB VBUS 输出 5V */
                status = "okay";
        };
};
```

phy-supply управляет USB VBUS regulator, а не питанием самого PHY.

## 5. RK3399 USB 3.1 force to USB 2.0

Принудительный USB 2.0 при подключённых USB 3.0 TX/RX нужен при аппаратных проблемах или специальных требованиях. Это нестандартная функция, не включённая в SDK по умолчанию. Rockchip предоставляет отдельный патч по запросу через Redmine.

## 6. RK3399 USB OTG mode команды переключения

SDK позволяет принудительно переключать Host/Peripheral независимо от ID и Type-C. Linux 4.4, старый интерфейс:

```text
#1.Force host mode
  echo host > /sys/kernel/debug/usb@fe800000/rk_usb_force_mode
#2.Force peripheral mode
  echo peripheral > /sys/kernel/debug/usb@fe800000/rk_usb_force_mode
```

Новый интерфейс:

```text
#1.Force host mode
  echo host > /sys/devices/platform/usb0/dwc3_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/usb0/dwc3_mode
```

Legacy-команды Linux 4.19/5.10:

```text
#1.Force host mode
  echo host > /sys/devices/platform/ff770000.syscon/ff770000.syscon:usb2-phy@e450/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/ff770000.syscon/ff770000.syscon:usb2-phy@e450/otg_mode
```

Новая команда Linux 5.10:

```text
#1.Force host mode
  echo host > /sys/kernel/debug/usb/fe800000.usb/mode
#2.Force peripheral mode
  echo device > /sys/kernel/debug/usb/fe800000.usb/mode
```

Примечания:

1. Команды относятся к Type-C0. Для Type-C1 OTG, что не рекомендуется, замените имя USB-узла соответствующим Type-C1.

2. Новая команда 5.10 снимает ограничения старой: зависимость от корректного DTS и применимость только к схемам не-Type-C.

## 7. RK3399 замечания по USB DTS

### 7.1 Linux-4.4 и Linux-4.19 различия DTS USB 3.0

Драйвер DWC3 Linux 4.19 существенно обновлён относительно 4.4, поэтому DTS отличается:

1. power-domains, resets и extcon перенесены из родителя usbdrd3 в дочерний usbdrd_dwc3.

2. Для Type-C to Type-A в Linux 4.19 требуется extcon в usbdrd_dwc3 для программного OTG; в 4.4 этого требования нет.

### 7.2 Linux-5.10 отличия Type-C DTS от предыдущих ядер

Linux 5.10 TCPM общается с USB PHY/контроллером callback-механизмом вместо extcon. Основные DTS-изменения:

1. ports у внешнего контроллера, например FUSB302, связывает usb-role-switch.

2. connector описывает data-role, powr-role (написание исходника), sink-pdos, source-pdos и alt-modes. См. Linux-5.10 Type-C USB

3.1&amp;DP DTS [FUSB302].

### 7.3 Linux USB DTS важные свойства

1. usb-role-switch только для стандартного Type-C с PD-контроллером и dr_mode="otg". При dr_mode="host" удалите usb-role-switch, иначе DP может работать неверно.

2. vbus-supply и phy-supply USB2 PHY управляют VBUS 5V: первый — динамически для OTG, второй — постоянно после включения для USB2 Host.

3. extcon используется для динамического OTG. В Linux 4.19 добавьте его в usbdrd_dwc3 для программного переключения.

4. Для принудительного USB3.1-to-USB2.0 нужны два свойства контроллера:

```text
"snps,usb2-lpm-disable"   /* 兼容不⽀持 U2 LPM 的U盘 */
"snps,dis_u2_susphy_quirk" /* 关闭 USB 控制器⾃动 suspend usb2 phy 的功能 */
```

### 7.4 Type-C1 изменения для поддержки OTG mode

Gadget допускает только один Device-контроллер. SDK задаёт Type-C0 OTG/Peripheral и Type-C1 Host; при необходимости Type-C1 можно настроить OTG/Peripheral. Примечания:

1. TYPEC1_U2VBUSDET должен соединяться с VBUS разъёма, иначе OTG1 Device не работает корректно.

2. Прошивка по-прежнему загружается только через Type-C0.

3. Двойной Type-C OTG не поддержан; при Type-C1 OTG задайте dr_mode="host" контроллеру Type-C0. Изменения Linux 4.4/4.19:

```text
&usbdrd_dwc3_0 {
        status = "okay";
        dr_mode = "host";  /* 配置 Type-C0 USB 控制器为 host mode */
        extcon = <&fusb1>; /* 注意：extcon 属性要根据实际的硬件电路设计来配置 */
};

&usbdrd_dwc3_1 {
        status = "okay";
        dr_mode = "otg";  /* 配置 Type-C1 USB 控制器为 OTG mode */
        extcon = <&fusb1>; /* 注意：extcon 属性要根据实际的硬件电路设计来配置 */
};
```

Изменения Type-C1 OTG Linux 5.10:

```text
&usbdrd_dwc3_0 {
        status = "okay";
        /delete-property/ usb-role-switch; /* 需要删除  usb-role-switch 属性，否则会
导致 DP 异常 */
        dr_mode = "host";  /* 配置 Type-C0 USB 控制器为 host mode */
};

&usbdrd_dwc3_1 {
        status = "okay";
        dr_mode = "otg";  /* 配置 Type-C1 USB 控制器为 OTG mode */
        usb-role-switch;  /* 配置 Type-C 相关属性 */
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_1_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc1_role_sw>;
                };
        };
};
```

## 8. USB Host VBUS методы управления

Три аппаратных способа питания VBUS:

1. GPIO управляет стабилизатором VBUS 5V. Это обычный вариант для Type-C, Type-A и Micro. DTS см. соответственно в разделах полноценного Type-C USB 3.1/DP, Type-C to Type-A USB only и Type-C to Micro USB.

2. PMIC вроде RK817/RK818 выдаёт VBUS 5V. (1) Для RK8xx кроме RK809 не задавайте VBUS-свойства DTS: это может нарушить питание. Драйвер уведомляет PMIC через EXTCON_USB_VBUS_EN. (2) Для других производителей реализуйте обработчик по drivers/power/rk818_charger.c. (3) RK809 имеет только VBUS-выход без зарядки, поэтому не подходит метод уведомлений; задайте vbus-supply USB2 PHY для управления RK809. Пример:

```text
rk809: pmic@20 {
        regulators {
                vcc5v0_host: SWITCH_REG1 {
                        regulator-name = "vcc5v0_host";
                };
        };
};
&u2phy {
        status = "okay";
        u2phy_host: host-port {
                status = "okay";
        };
        u2phy_otg: otg-port {
                vbus-supply = <&vcc5v0_host>;
                status = "okay";
        };
};
```

3. Аппаратура выдаёт постоянные VBUS 5V после включения без программного управления, обычно для Host.

## 9. Type-C список поддерживаемых контроллеров

Таблица 9-1. Поддерживаемые Type-C-контроллеры.

| Модель Type-C-контроллера | Linux-4.4 | Linux-<br>4.19 | Linux-<br>5.10 | Примечания |
| --- | --- | --- | --- | --- |
| FUSB302 | Да | Да | Да | Наиболее распространён на RK |
| ET7301B | Да | Да | Да | Полностью совместим с FUSB302 аппаратно и программно, прим. 1 |
| ET7303 | Нет | Да | Да | Аппаратно совместим с FUSB302; драйвер очень похож на RT1711, прим. 2 |
| HUSB311 | Нет | Да | Да | Рекомендуется в первую очередь; аппаратно совместим с FUSB302, драйвер несовместим, прим. 3 |
| RT1711H | Нет | Да | Да | Аппаратно совместим с FUSB302; драйвер очень похож на ET7303, прим. 4 |
| ANX7411 | Нет | Нет | В отладке | Адаптация RK3588 |
| WUSB3801 | SDK не поддерживает; используется в отдельных проектах | Нет | Нет | Собственная однопроводная связь; высокая частота ошибок, стабильность не гарантирована. |

Примечание 1. Linux 4.4 без TCPM поддерживает только взаимозаменяемые без правок FUSB302/ET7301B. Linux 4.19/5.10 с TCPM/TCPCI теоретически совместим со всеми TCPCI-чипами, например ET7303/HUSB311/RT1711H.

Примечание 2. Малый корпус ET7303 проверен на платформе RK; по сведениям исходника большого корпуса нет. Включите CONFIG_TYPEC_ET7303. DTS см. HUSB311 для 4.19/5.10: одинаковый I2C 0x4E, меняются имя и compatible="etek,et7303".

Примечание 3. Схема FUSB302 RK3399 Excavator несовместима с HUSB311 без перемычек; на IND замена прямая. Включите CONFIG_TYPEC_HUSB311; DTS см. разделы HUSB311 Linux 4.19/5.10.

Примечание 4. RT1711H аппаратно совместим с FUSB302/ET7303, драйвер близок к ET7303. Включите CONFIG_TYPEC_RT1711H. I2C 0x4E; DTS как HUSB311/ET7303, измените имя и compatible="richtek,rt1711h".

## 10. справочные документы

1. kernel/Documentation/devicetree/bindings/usb/generic.txt

2. kernel/Documentation/devicetree/bindings/usb/dwc3.txt

3. kernel/Documentation/devicetree/bindings/usb/rockchip,dwc3.txt

4. kernel/Documentation/devicetree/bindings/usb/usb-ehci.txt

5. kernel/Documentation/devicetree/bindings/usb/usb-ohci.txt

6. kernel/Documentation/devicetree/bindings/phy/phy-rockchip-typec.txt

7. kernel/Documentation/devicetree/bindings/phy/phy-rockchip-inno-usb2.txt

8. kernel/Documentation/devicetree/bindings/connector/usb-connector.yaml

9. kernel/Documentation/devicetree/bindings/usb/fcs,fusb302.txt

{% endraw %}
