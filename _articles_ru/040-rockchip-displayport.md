---
title: "Полное руководство Rockchip DisplayPort: MST RK3576, SST RK3588 и отладка"
description: "Полное описание дерева устройств DP, SST/MST, Type-C, HPD, панелей, HDR/HDCP, тактирования, DP Status и ограничений полосы."
translation_key: "040-rockchip-displayport"
slug: "040-rockchip-displayport"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["RK3576", "RK3588", "DisplayPort", "MST", "SST", "Type-C"]
keywords: "ArmSoM Rockchip RK3576 RK3588 DisplayPort DP MST SST"
excerpt: "Полное описание дерева устройств DP, SST/MST, Type-C, HPD, панелей, HDR/HDCP, тактирования, DP Status и ограничений полосы."
---

{% raw %}

# Полное руководство Rockchip DisplayPort: MST RK3576, SST RK3588 и отладка

Это справочный материал для платформы Rockchip. Область оригинала: RK3576 / Linux Kernel 6.1 и RK3588 / Linux Kernel 5.10 либо 6.1. В проекте ArmSoM проверьте SoC каждой платы, доступные DP/Type-C, PD-контроллер, разводку PHY, патчи SDK/BSP и конфигурацию ядра. Поддержка всех режимов всеми платами ArmSoM не подразумевается. Аппаратные испытания ArmSoM не проводились; журналы, фотографии и числовые характеристики взяты из оригинала.

Источники: китайское руководство Rockchip DisplayPort (на обложке V1.3.0, в таблице редакций V1.3.3) и английское V1.2.1. По подтверждённому решению общая основа трёх языков — новый китайский текст. В частности, подробные конфигурации SST/MST в §2.1–2.4, источник dclk в §2.9 и DP Status в §3.10 переведены из новой китайской версии; они не выдаются за содержание старой английской. Китайская статья использует 17 китайских иллюстраций, английская и русская — 17 соответствующих оригиналов английского PDF. Дополнительных самостоятельных иллюстраций к новым объяснениям не обнаружено. Код и команды взяты из нового китайского оригинала с сохранением комментариев.

[Редакционная проверка](/docs/rockchip-displayport/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Введение в Rockchip DisplayPort

### 1.1 Функциональные возможности

Возможности интерфейсов DP Rockchip RK3576 и RK3588 приведены ниже:

| Функция | RK3576 | RK3588 |
| --- | --- | --- |
| Версия | 1.4a | 1.4a |
| SST | Поддерживается | Поддерживается |
| MST | Поддерживается | Не поддерживается |
| DSC | Не поддерживается | Не поддерживается |
| Максимальное разрешение | 4K@120Hz | 8K@30Hz |
| Линии Main-Link | 1/2/4 lanes | 1/2/4 lanes |
| Скорость Main-Link | 8.1/5.4/2.7/1.62 Gbps/lane | 8.1/5.4/2.7/1.62 Gbps/lane |
| AUX_CH | 1 M | 1 M |
| Цветовой формат | RGB/YUV444/YUV422/YUV420 | RGB/YUV444/YUV422/YUV420 |
| Глубина цвета | 8/10 бит (6 бит только для RGB) | 8/10 бит (6 бит только для RGB) |
| Режим разделения изображения | Поддерживается | Поддерживается |
| HDCP | HDCP2.2/HDCP1.3 | HDCP2.2/HDCP1.3 |
| Поддержка Type-C | DP Alternate Mode | DP Alternate Mode |
| I2S | Поддерживается | Поддерживается |
| SPDIF | Поддерживается | Поддерживается |
| HDR | Поддерживается | Поддерживается |
| DP Dual Mode(DP++) | Не поддерживается | Не поддерживается |

Примечание:

1. Согласно оригиналу, RK3576 и RK3528 обратно совместимы с DP1.2.

RK3576 имеет один физический интерфейс DP, но в режиме MST внутри принимает три потока изображения. Чтобы отличать их от физических интерфейсов, они называются Stream-0, Stream-1 и Stream-2. Максимальные возможности каждого потока:

| Канал потока DP | Максимальная ширина | Максимальная высота | Максимальная пиксельная частота |
| --- | --- | --- | --- |
| Stream-0 | 4096 | 4096 | 1188MHz |
| Stream-1 | 2560 | 2560 | 300MHz |
| Stream-2 | 1920 | 1920 | 150MHz |

### 1.2 Соединения DP и VOP

RK3576 содержит три Video Port в VOP и один контроллер DP. В режиме MST контроллер DP принимает до трёх потоков от VOP. Каждый Stream-0/1/2 может получать данные от Video Port0/1/2. В режиме SST используется только Stream-0, в MST доступны Stream-0/1/2.

![Соединения VOP и потоков DP RK3576](/docs/rockchip-displayport/assets/en-p6-1.png)

RK3588 содержит четыре Video Port в VOP и два контроллера DP. Вывод на DP0/1 возможен только с Video Port 0/1/2, как показано ниже.

![Соединения VOP и двух DP RK3588](/docs/rockchip-displayport/assets/en-p7-1.png)

Два интерфейса DP RK3588 не поддерживают MST и внутри принимают только Stream-0. На платформах без MST Video Port по умолчанию выводит данные в Stream-0 интерфейса DP.

### 1.3 Вывод DP

В зависимости от задачи вывод DP реализуется через Type-C, стандартный разъём DP или дополнительную микросхему преобразователя.

![Варианты интерфейса вывода DP](/docs/rockchip-displayport/assets/en-p8-1.png)

В режиме MST RK3576 поддерживает до трёх мониторов, соединённых последовательно через MST:

![Последовательное подключение мониторов MST](/docs/rockchip-displayport/assets/en-p8-2.png)

Только последний монитор последовательной цепочки может быть SST; все предыдущие должны поддерживать MST.

Другой вариант — подключение через MST HUB:

![Соединения MST HUB](/docs/rockchip-displayport/assets/en-p9-1.png)

При использовании MST HUB подключённые мониторы DP могут поддерживать как SST, так и MST.

### 1.4 Пути исходного кода

Код драйвера U-Boot:

```text
drivers/video/drm/dw-dp.c
drivers/phy/phy-rockchip-usbdp.c
```

Код драйвера ядра:

```text
drivers/gpu/drm/rockchip/dw-dp.c
drivers/phy/rockchip/phy-rockchip-usbdp.c
```

Пример конфигурации DTS для RK3576:

```text
arch/arm64/boot/dts/rockchip/rk3576-evb1.dtsi
arch/arm64/boot/dts/rockchip/rk3576-test2.dtsi
```

Пример конфигурации DTS для RK3588:

```text
arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb2-lp4.dtsi

arch/arm64/boot/dts/rockchip/rk3588-evb3-lp5.dtsi
arch/arm64/boot/dts/rockchip/rk3588-nvr-demo.dtsi
```

### 1.5 Загрузка драйвера

Следующий журнал позволяет проверить завершение загрузки драйвера:

```text
RK3576:
 [1.991964] rockchip-drm display-subsystem: bound 27e40000.dp (ops 0xffffffc0094a1570) //DP
驱动加载完成

RK3588:
 [2.472282] rockchip-drm display-subsystem: bound fde50000.dp (ops dw_dp_component_ops)
//DP0 驱动加载完成
 [2.472319] rockchip-drm display-subsystem: bound fde60000.dp (ops dw_dp_component_ops)
//DP1 驱动加载完成
```

## 2. Настройка функций

Базовая структура узлов DTS различается для платформ DP с поддержкой MST и платформ, поддерживающих только SST.

### 2.1 Конфигурация узлов SST

На платформах только с SST, например RK3588, один контроллер DP поддерживает один выход. Для описания доступных ему трактов отображения достаточно одного дочернего узла ports:

```text
dp0: dp@fde50000 {
   compatible = "rockchip,rk3588-dp";

   ...

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;
         dp0_in_vp0: endpoint@0 {
           reg = <0>;

           remote-endpoint = <&vp0_out_dp0>;
           status = "disabled";
         };

         dp0_in_vp1: endpoint@1 {
           reg = <1>;
           remote-endpoint = <&vp1_out_dp0>;
           status = "disabled";
         };

         dp0_in_vp2: endpoint@2 {
           reg = <2>;

           remote-endpoint = <&vp2_out_dp0>;
           status = "disabled";
         };
      };
   ...
   };
};
```

### 2.2 Конфигурация узлов MST

На платформах с MST, например RK3576, один контроллер DP поддерживает три потока. Один узел ports не может описать тракты нескольких каналов DP, поэтому требуются дополнительные дочерние узлы:

```text
dp: dp@27e40000 {
   compatible = "rockchip,rk3576-dp";

   ...
   dp0: dp0 {
      status = "disabled";

      ports {
         #address-cells = <1>;
         #size-cells = <0>;

         port@0 {
           reg = <0>;
           #address-cells = <1>;
           #size-cells = <0>;


           dp0_in_vp0: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&vp0_out_dp0>;
              status = "disabled";
           };

           dp0_in_vp1: endpoint@1 {
              reg = <1>;
            remote-endpoint = <&vp1_out_dp0>;
            status = "disabled";
         };


         dp0_in_vp2: endpoint@2 {
            reg = <2>;
            remote-endpoint = <&vp2_out_dp0>;
            status = "disabled";
         };
      };
   };
};

dp1: dp1 {
   status = "disabled";


   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         dp1_in_vp0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&vp0_out_dp1>;

            status = "disabled";
         };

         dp1_in_vp1: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&vp1_out_dp1>;
            status = "disabled";
         };

         dp1_in_vp2: endpoint@2 {
            reg = <2>;
            remote-endpoint = <&vp2_out_dp1>;

            status = "disabled";
         };
      };
   };
};

dp2: dp2 {
   status = "disabled";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
           reg = <0>;
           #address-cells = <1>;
           #size-cells = <0>;


           dp2_in_vp0: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&vp0_out_dp2>;
              status = "disabled";
           };

           dp2_in_vp1: endpoint@1 {
              reg = <1>;
              remote-endpoint = <&vp1_out_dp2>;
              status = "disabled";
           };


           dp2_in_vp2: endpoint@2 {
              reg = <2>;
              remote-endpoint = <&vp2_out_dp2>;
              status = "disabled";
           };
         };
      };
   };
};
```

Дочерние узлы dp0/1/2 описывают тракты, поддерживаемые Stream-0/1/2 соответственно.

По сравнению с DTS для SST платформа MST имеет дополнительный уровень дочерних узлов каналов DP.

### 2.3 Включение DP

DP и USB3.0 совместно используют PHY. Настройка линий PHY зависит от типа выхода: Type-C или не Type-C.

#### 2.3.1 DP Alt Mode (Type-C)

DisplayPort Alt Mode взаимодействует с монитором через автомат состояний PD (Power Delivery), назначая линии и передавая состояние HPD. На схеме показан переход в DP Mode через PD и передача HPD командами attention.

![Переход PD в DP Alt Mode и уведомление HPD](/docs/rockchip-displayport/assets/en-p14-1.png)

2.3.1.1 Настройка контроллера SST

Для платформ только с SST, например RK3588:

```text
&dp0 {
   status = "okay";
};


&dp0_in_vp2 {
   status = "okay";
};
```

В примере включён DP0, связанный с Video Port2 VOP. Это лишь пример: в реальной системе включите DP0 или DP1 и свяжите его с нужным Video Port (0/1/2).

2.3.1.2 Настройка контроллера MST

Для платформ с MST, например RK3576:

```text
&dp {
   status = "okay";
};


&dp0 {
   status = "okay";
};

&dp0_in_vp2 {
   status = "okay";
};
```

На платформе с MST необходимо включить узел устройства DP, нужный канал DP Stream и связанный с ним Video Port VOP. В примере включён Stream-0, связанный с Video Port2.

На платформах с MST режим SST обязательно использует DP Stream-0. Поэтому dp0 должен быть включён; dp1 и dp2 настраиваются по необходимости.

2.3.1.3 Настройка PHY

Настройка PHY одинакова для платформ с MST и без MST. Пример для RK3588 usbdp phy0:

```text
&usbdp_phy0 {
   status = "okay";

   orientation-switch;
   /* DP related config */
   svid = <0xff01>;
   sbu1-dc-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_HIGH>;
   sbu2-dc-gpios = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
   /* DP related config */

   port {
      #address-cells = <1>;
      #size-cells = <0>;
      usbdp_phy0_orientation_switch: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&usbc0_orien_sw>;

      };

      /* DP related config */
      usbdp_phy0_dp_altmode_mux: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&dp_altmode_mux>;
      };
      /* DP related config */
   };
};
```

`sbu1-dc-gpios` и `sbu2-dc-gpios`:

Контакты Type-C SBU1 и SBU2 мультиплексируются с DP AUX_CH. В обычной ориентации AUX_CH_P использует SBU1, AUX_CH_N — SBU2 (в оригинале опечатка SUB2); в обратной AUX_CH_P использует SBU2, AUX_CH_N — SBU1. DP требует подтяжки AUX_CH_P вниз, AUX_CH_N вверх. Назначение меняется с ориентацией разъёма. В решении Rockchip состояния подтяжек SBU1/SBU2 управляются двумя GPIO, указанными в DTS как sbu1-dc-gpios и sbu2-dc-gpios. Настройте их по схеме платы, например TYPEC0_SBU1_DC и TYPEC0_SBU2_DC ниже. Драйвер PHY выбирает уровни в соответствии с ориентацией.

![Схема подтяжек SBU1/SBU2](/docs/rockchip-displayport/assets/en-p16-1.png)

`svid`:

Для DP используется фиксированное значение 0xff01.

2.3.1.4 Настройка PD-контроллера

Type-C настраивает линии и состояние HPD через обнаружение CC и согласование PD. Поэтому также настройте PD-контроллер:

```text
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

   /* DP related config */
   altmodes {
      #address-cells = <1>;
      #size-cells = <0>;

      altmode@0 {
         reg = <0>;
         svid = <0xff01>;
         vdo = <0xffffffff>;

      };
   };
   /* DP related config */

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         usbc0_orien_sw: endpoint {
            remote-endpoint = <&usbdp_phy0_orientation_switch>;
         };
           };

           /* DP related config */

           port@1 {
              reg = <1>;
              dp_altmode_mux: endpoint {
                 remote-endpoint = <&usbdp_phy0_dp_altmode_mux>;
              };
           };
           /* DP related config */
         };
      };
   };
};
```

В altmode@0 фиксированное значение svid равно 0xff01, vdo — 0xffffffff.

В оригинале перечислены поддерживаемые PD-контроллеры fusb302 и hub311. Их драйверы: /drivers/usb/typec/tcpm/fusb302.c и /drivers/usb/typec/tcpm/tcpci_husb311.c соответственно.

#### 2.3.2 DP Legacy Mode

Для выхода не через Type-C, будь то стандартный DP или преобразователь, порядок настройки практически одинаков и требует контакта HPD. Можно использовать специализированный DP_HPD с настройкой IOMUX либо обычный GPIO для обнаружения.

2.3.2.1 Настройка HPD в SST

Для платформ без MST, например RK3588, специализированный контакт DP_HPD настраивается так:

```text
&dp1 {
   pinctrl-0 = <&dp1m2_pins>;
   pinctrl-names = "default";

   status = "okay";
};

&dp1_in_vp2 {
   status = "okay";
};
```

Для обнаружения HPD обычным GPIO:

```text
&dp1 {
   pinctrl-names = "default";

   pinctrl-0 = <&dp1_hpd>;
   hpd-gpios = <&gpio1 RK_PB5 GPIO_ACTIVE_HIGH>;
   status = "okay";
};
&dp1_in_vp2 {
   status = "okay";
};


&pinctrl {
   dp {
      dp1_hpd: dp1-hpd {
         rockchip,pins = <1 RK_PB5 RK_FUNC_GPIO &pcfg_pull_down>;
      };
   };
};
```

2.3.2.2 Настройка HPD в MST

Для платформ с MST, например RK3576, специализированный контакт DP_HPD настраивается так:

```text
&dp {
   pinctrl-0 = <&dp1m2_pins>;
   pinctrl-names = "default";

   status = "okay";
};

&dp0 {
   status = "okay";
};

&dp0_in_vp2 {
   status = "okay";
};
```

Для обнаружения HPD обычным GPIO:

```text
&dp {
   pinctrl-names = "default";
   pinctrl-0 = <&dp_hpd>;

   hpd-gpios = <&gpio1 RK_PB5 GPIO_ACTIVE_HIGH>;
   status = "okay";
};

&dp0 {
   status = "okay";
};

&dp0_in_vp2 {
   status = "okay";
};


&pinctrl {
   dp {
      dp_hpd: dp-hpd {
         rockchip,pins = <1 RK_PB5 RK_FUNC_GPIO &pcfg_pull_down>;
      };
   };
};
```

В обоих случаях HPD относится ко всему интерфейсу DP и настраивается в узле устройства.

2.3.2.3 Настройка PHY

DP и USB 3.0 совместно используют PHY. При выводе DP не через Type-C в DTS задаются выделенные DP линии PHY и их порядок. Доступны режимы с двумя или четырьмя линиями.

Физическим номерам линий PHY соответствуют следующие контакты:

| Имя контакта | SSRX1 | SSTX1 | SSRX2 | SSTX2 |
| --- | --- | --- | --- | --- |
| Линия PHY | 0 | 1 | 2 | 3 |

Для четырёх линий DP задайте свойство DTS:

```text
rockchip,dp-lane-mux = <x x x x>；
```

Для двух линий DP:

```text
rockchip,dp-lane-mux = <x x>；
```

Индекс обозначает линию DP, значение — линию PHY.

Для аппаратной схемы с двумя или четырьмя линиями обычно выбирают OPTION1 либо OPTION2 ниже.

![Распределение линий PHY OPTION1/OPTION2](/docs/rockchip-displayport/assets/en-p20-1.png)

Редактируемая расшифровка таблицы назначения контактов выше:

| Имя контакта | Функция Type-C | DP x4 Lane OPTION1 | DP x4 Lane OPTION2 | USB30 HOST + DP x2 Lane OPTION1 | USB30 HOST + DP x2 Lane OPTION2 |
| --- | --- | --- | --- | --- | --- |
| TYPEC0_SBU1/DP0_AUXP | TYPEC0_SBU1 | DP0_AUXP | DP0_AUXP | DP0_AUXP | DP0_AUXP |
| TYPEC0_SBU2/DP0_AUXN | TYPEC0_SBU2 | DP0_AUXN | DP0_AUXN | DP0_AUXN | DP0_AUXN |
| TYPEC0_SSRX1P/DP0_TX0P | TYPEC0_SSRX1P | DP0_TX0P | DP0_TX2P | TYPEC0_SSRX1P | DP0_TX0P |
| TYPEC0_SSRX1N/DP0_TX0N | TYPEC0_SSRX1N | DP0_TX0N | DP0_TX2N | TYPEC0_SSRX1N | DP0_TX0N |
| TYPEC0_SSTX1P/DP0_TX1P | TYPEC0_SSTX1P | DP0_TX1P | DP0_TX3P | TYPEC0_SSTX1P | DP0_TX1P |
| TYPEC0_SSTX1N/DP0_TX1N | TYPEC0_SSTX1N | DP0_TX1N | DP0_TX3N | TYPEC0_SSTX1N | DP0_TX1N |
| TYPEC0_SSRX2P/DP0_TX2P | TYPEC0_SSRX2P | DP0_TX2P | DP0_TX0P | DP0_TX2P | TYPEC0_SSRX2P |
| TYPEC0_SSRX2N/DP0_TX2N | TYPEC0_SSRX2N | DP0_TX2N | DP0_TX0N | DP0_TX2N | TYPEC0_SSRX2N |
| TYPEC0_SSTX2P/DP0_TX3P | TYPEC0_SSTX2P | DP0_TX3P | DP0_TX1P | DP0_TX3P | TYPEC0_SSTX2P |
| TYPEC0_SSTX2N/DP0_TX3N | TYPEC0_SSTX2N | DP0_TX3N | DP0_TX1N | DP0_TX3N | TYPEC0_SSTX2N |
| TYPEC0_USB20_OTG_DP | TYPEC0_USB20_OTG_DP |  |  | TYPEC0_USB20_OTG_DP | TYPEC0_USB20_OTG_DP |
| TYPEC0_USB20_OTG_DM | TYPEC0_USB20_OTG_DM |  |  | TYPEC0_USB20_OTG_DM | TYPEC0_USB20_OTG_DM |

Четыре линии DP: схема OPTION1:

| Линия DP | Линия PHY | Имя контакта |
| --- | --- | --- |
| 0 | 0 | SSRX1 |
| 1 | 1 | SSTX1 |
| 2 | 2 | SSRX2 |
| 3 | 3 | SSTX2 |

DP lane обозначает номер линии DP.

Конфигурация DTS:

```text
&usbdp_phy1 {
   rockchip,dp-lane-mux = <0 1 2 3>;
   status = "okay";

};
```

Четыре линии DP: схема OPTION2:

| Линия DP | Линия PHY | Имя контакта |
| --- | --- | --- |
| 0 | 2 | SSRX2 |
| 1 | 3 | SSTX2 |
| 2 | 0 | SSRX1 |
| 3 | 1 | SSTX1 |

DP lane обозначает номер линии DP.

Конфигурация DTS:

```text
&usbdp_phy1 {
   rockchip,dp-lane-mux = <2 3 0 1>;
   status = "okay";

};
```

Две линии DP: схема OPTION1:

| Линия DP | Линия PHY | Имя контакта |
| --- | --- | --- |
| 0 | 2 | SSRX2 |
| 1 | 3 | SSTX2 |

Конфигурация DP с двумя линиями:

```text
&usbdp_phy1 {
   rockchip,dp-lane-mux = <2 3>;
   status = "okay";

};
```

Две линии DP: схема OPTION2:

| Линия DP | Линия PHY | Имя контакта |
| --- | --- | --- |
| 0 | 0 | SSRX1 |
| 1 | 1 | SSTX1 |

Конфигурация DP с двумя линиями:

```text
&usbdp_phy1 {
   rockchip,dp-lane-mux = <0 1>;
   status = "okay";

};
```

### 2.4 Подключение панели к DP

При подключении панели eDP к DP специфические функции eDP, такие как PSR, Multi-SST и ALPM, не поддерживаются. Используйте пример настройки панели ниже, адаптировав его к аппаратной схеме.

#### 2.4.1 Настройка панели в SST

Настройка платформ только с SST, например RK3588:

```text
/ {
   ...
   panel-edp {

      compatible = "simple-panel";
      backlight = <&backlight>;
      power-supply = <&vcc3v3_lcd_edp>;
      prepare-delay-ms = <120>;
      enable-delay-ms = <120>;
      unprepare-delay-ms = <120>;
      disable-delay-ms = <120>;
      width-mm = <120>;
      height-mm = <160>;

      panel-timing {
         clock-frequency = <200000000>;
         hactive = <1536>;

         vactive = <2048>;
         hfront-porch = <12>;
         hsync-len = <16>;
         hback-porch = <48>;
         vfront-porch = <8>;
         vsync-len = <4>;
         vback-porch = <8>;
         hsync-active = <0>;
         vsync-active = <0>;
         de-active = <0>;
         pixelclk-active = <0>;
      };


      port {
         panel_in_edp: endpoint {
           remote-endpoint = <&dp0_out>;
         };
      };
   };
   ...

};

&dp0 {
   force-hpd;
   status = "okay";
};

&dp0_in_vp2 {
   status = "okay";
};

&dp0_out {

   remote-endpoint = <&panel_in_edp>;
};

&usbdp_phy0 {
   rockchip,dp-lane-mux = <0 1 2 3>;
   status = "okay";
};
```

#### 2.4.2 Настройка панели на платформе с MST

Пример настройки платформ с MST, например RK3576:

```text
/ {
   ...

   panel-edp {
      compatible = "simple-panel";
      backlight = <&backlight>;
      power-supply = <&vcc3v3_lcd_edp>;
      prepare-delay-ms = <120>;
      enable-delay-ms = <120>;
      unprepare-delay-ms = <120>;
      disable-delay-ms = <120>;
      width-mm = <120>;
      height-mm = <160>;

      panel-timing {
         clock-frequency = <200000000>;

         hactive = <1536>;
         vactive = <2048>;
         hfront-porch = <12>;
         hsync-len = <16>;
         hback-porch = <48>;
         vfront-porch = <8>;
         vsync-len = <4>;
         vback-porch = <8>;
         hsync-active = <0>;
         vsync-active = <0>;
         de-active = <0>;
         pixelclk-active = <0>;

      };

      port {
         panel_in_edp: endpoint {
           remote-endpoint = <&dp0_out_panel>;
         };
      };
   };
   ...
};

&dp {

   force-hpd;
   status = "okay";
};

&dp0 {
   status = "okay";

   ports {
      port@1 {
         reg = <1>;

         dp0_out_panel: endpoint {
           remote-endpoint = <&panel_in_edp>;

         };
      };
   };
};

&dp0_in_vp2 {
   status = "okay";
};

&usbdp_phy {
   rockchip,dp-lane-mux = <0 1 2 3>;
   status = "okay";

};
```

В конфигурациях SST и MST свойство force-hpd описывает HPD всего интерфейса и размещается в узле устройства. Настройка тракта относится к конкретному потоку DP; на платформе MST изменяется соответствующий дочерний узел.

Согласно оригиналу, на платформе с MST подключённая панель работает только в SST. Поэтому тракт должен использовать Stream-0, то есть узел dp0.

Оригинал описывает force-hpd в dp0 как указание драйверу считать панель eDP постоянно подключённой. Свойство необязательно: проверьте наличие HPD и требования к последовательности подъёма HPD и доступа AUX. Если AUX разрешён только после подъёма HPD, не задавайте force-hpd, иначе преждевременный доступ может завершиться ошибкой. Если нужен контакт HPD, используйте настройку DP Legacy Mode выше; ссылка оригинала на раздел 1.2.1 устарела.

panel-timing задаёт поддерживаемые тайминги. Настройте его, если у панели нет EDID либо тайминги EDID неточны. Иначе они могут считываться непосредственно из EDID.

Последовательность питания и подсветка настраиваются по требованиям панели и схеме платы.

### 2.5 Загрузочный логотип DP

После настройки загрузочного логотипа монитор, подключённый до включения, может показывать логотип уже в U-Boot. Иначе изображение приложения появится лишь после запуска системы. Добавьте следующую конфигурацию:

```text
&route_dp0 {
   status = "okay";

   connect = <&vp2_out_dp0>;
};
```

Здесь свойство connect связывает DP с VOP Port2 на этапе U-Boot, поэтому DTSI должна разрешать эту связь:

```text
&dp0_in_vp2 {
   status = "okay";
};
```

Примечания:

1. В описанной реализации загрузочный логотип DP через Type-C не поддерживается.

2. На платформах с MST загрузочный логотип поддерживается только в SST.

### 2.6 Режим DP connector-split

В connector-split изображение делится на равные левую и правую половины, передаваемые через DP0 и DP1. На схеме DP0 соответствует левой, DP1 — правой половине.

![Отображение DP connector-split](/docs/rockchip-displayport/assets/en-p26-1.png)

Конфигурация:

```text
&dp0 {
   split-mode;
   status = "okay";

};

&dp0_in_vp2 {
   status = "okay";
};

&dp1 {
   status = "okay";
};
```

Добавьте split-mode в узел DP левой половины и свяжите его с выходным Video Port. Здесь DP0 — слева, DP1 — справа. Два интерфейса рассматриваются как один connector: он подключён и выводит изображение только при подключении обоих DP0 и DP1. Отключение любого прекращает вывод. Оба интерфейса используют одинаковые тайминги, поэтому рекомендуются одинаковые мониторы.

В userspace modetest либо узел DRM state (`cat /sys/kernel/debug/dri/0/state`) покажет только один connector DP.

Для логотипа U-Boot в split mode, например с DP0 в качестве левой половины, добавьте:

```text
&route_dp0 {
   split-mode;
   status = "okay";

   connect = <&vp2_out_dp0>;
};

&route_dp1 {
   status = "disabled";
}
```

У RK3576 один интерфейс DP, поэтому этот вариант connector-split не поддерживается. Оригинал обещает позднее описать отдельную функцию split-mode RK3576; при необходимости следует обратиться в Rockchip. Это утверждение исходного документа, не гарантия текущей поддержки.

### 2.7 HDR

HDR по умолчанию поддерживается в SST без дополнительной настройки драйвера. В описанной реализации HDR в MST не поддерживается.

### 2.8 HDCP

Драйвер DP реализует HDCP через DRM. Для использования HDCP приложение userspace должно вызывать интерфейсы DRM.

HDCP1.3 по умолчанию поддерживается драйвером DP без дополнительной настройки. Запись ключей HDCP описана в Rockchip_RK3588_Developer_Guide_HDCP_CN.

HDCP2.2 использует отдельный контроллер HDCP2 для аутентификации. Для его включения требуется настройка DTS.

В RK3588 DP0/DP1 соединены с HDCP0:

![HDCP0 и DP0/DP1 RK3588](/docs/rockchip-displayport/assets/en-p27-1.png)

Для DP HDCP2.2 включите эти узлы:

```text
&hdcp0 {
   status = "okay";

};
```

В RK3576 DP соединён с HDCP1:

![DP и HDCP1 RK3576](/docs/rockchip-displayport/assets/en-p28-1.png)

Для DP HDCP2.2 включите эти узлы:

```text
&hdcp1 {
   status = "okay";

};
```

Помимо настройки драйвера, HDCP2.2 требует включения приложения HDCP2.2 в userspace и создания прошивки контроллера HDCP. См. Rockchip_RK3588_Developer_Guide_HDCP_CN.

### 2.9 Настройка источника dclk

DisplayPort обычно подключает мониторы с несколькими разрешениями и разными пиксельными частотами. Для точного dclk связанного Video Port VOP обычно выбирают PLL, выделенную VOP: V0PLL в RK3588 или VPLL в RK3576. При использовании стандартной GPLL частоты некоторых разрешений нельзя получить целочисленным делением; такие режимы могут отфильтровываться.

#### 2.9.1 Источник dclk RK3576

В RK3576 файл /arch/arm64/boot/dts/rockchip/rk3576-evb.dtsi по умолчанию задаёт VPLL источником dclk VP0:

```text
&vp0 {
      assigned-clocks = <&cru DCLK_VP0_SRC>;

      assigned-clock-parents = <&cru PLL_VPLL>;
};
```

Если DP связан с VP0, источником dclk служит VPLL, позволяя получить требуемую частоту. Если DP нужно связать с другим VP, например VP1, используйте следующую конфигурацию:

```text
&vp0 {
      /delete-property/ assigned-clocks;
      /delete-property/ assigned-clock-parents;

};

&vp1 {
      assigned-clocks = <&cru DCLK_VP1_SRC>;
      assigned-clock-parents = <&cru PLL_VPLL>;
};
```

Эта настройка удаляет конфигурацию источника dclk у VP0 и добавляет её для VP1.

#### 2.9.2 Источник dclk RK3588

В RK3588 файл /arch/arm64/boot/dts/rockchip/rk3588s.dtsi по умолчанию задаёт V0PLL источником dclk VP2:

```text
vp2: port@2 {
......
      assigned-clocks = <&cru DCLK_VOP2_SRC>;

      assigned-clock-parents = <&cru PLL_V0PLL>;
};
```

Если DP связан с VP2, источником dclk служит V0PLL. Для связи DP с другим VP, например VP1, используйте:

```text
&vp2 {
      /delete-property/ assigned-clocks;
      /delete-property/ assigned-clock-parents;

};

&vp1 {
      assigned-clocks = <&cru DCLK_VP1_SRC>;
      assigned-clock-parents = <&cru PLL_V0PLL>;
};
```

RK3588 имеет DP0 и DP1. Если они одновременно связаны с разными VP, например DP0 с VP0, DP1 с VP1, только один из VP0/VP1 может использовать V0PLL источником dclk. Иначе настройки частот VP влияют друг на друга и вызывают ошибки изображения.

## 3. Основные методы отладки

### 3.1 Проверка состояния разъёма

Каталог /sys/class/drm содержит устройства, зарегистрированные драйвером. В следующем выводе card0-DP-1 и card0-DP-2 — дисплейные устройства DP.

```text
rk3588_s:/ # ls /sys/class/drm/
card0    card0-DP-2 card0-HDMI-A-1 card0-Writeback-1 renderD128 version

card0-DP-1 card0-DSI-1 card0-HDMI-A-2 card1 renderD129
```

Например, каталог card0-DP-1 содержит:

```text
rk3588_s:/ # ls /sys/class/drm/card0-DP-1/
device dpms edid enabled modes power status subsystem uevent
```

enabled: проверка включения интерфейса:

```text
rk3588_s:/ # cat /sys/class/drm/card0-DP-1/enabled
disabled
```

status: проверка состояния подключения:

```text
rk3588_s:/ # cat /sys/class/drm/card0-DP-1/status
disconnected
```

modes: список разрешений, поддерживаемых устройством:

```text
rk3588_s:/ # cat /sys/class/drm/card0-DP-1/modes
1440x900
1280x1024

1280x1024
1280x960
1152x864
1024x768
1024x768
832x624
800x600
800x600
640x480
640x480
720x400
```

edid: сохранение EDID устройства:

```text
rk3588_s:/ # cat /sys/class/drm/card0-DP-1/edid > /data/edid.bin
```

### 3.2 Принудительное включение и отключение DP

```text
#强制禁⽤ DP
rk3588_s:/ # echo off > /sys/class/drm/card0-DP-1/status
#强制使能 DP

rk3588_s:/ # echo on > /sys/class/drm/card0-DP-1/status
#恢复热插拔检测
rk3588_s:/ # echo detect > /sys/class/drm/card0-DP-1/status
```

### 3.3 Чтение и запись DPCD

Доступ к DPCD выполняется через AUX_CH. Узел чтения и записи реализован в:

```text
/drivers/gpu/drm/drm_dp_aux_dev.c
```

Перед использованием функции проверьте соответствующую опцию сборки:

```text
CONFIG_DRM_DP_AUX_CHARDEV=y
```

Чтение DPCD:

```text
#if 后⾯为 aux 节点，当注册两个 DP 接⼝时，会有 /dev/drm_dp_aux0 和 /dev/drm_dp_aux1
#skip 值为起始的 DPCD 寄存器地址
#count 值为要读取的 DPCD 寄存器的数量

dd if=/dev/drm_dp_aux0 bs=1 skip=$((0x00200)) count=2 status=none | od -tx1
#如下为读取地址为  0x00200 开始的 2 个 DPCD 寄存器的内容
rk3588_s:/ # dd if=/dev/drm_dp_aux1 bs=1 skip=$((0x00200)) count=2 status=none | od -tx1
0000000 01 00
0000002
```

Запись регистров DPCD:

```text
#echo 后为要写⼊的值, 如下为需要写⼊两个  16 进制的值，分别为 0x0a, 0x80
#of 后⾯为 aux 节点，当注册两个 DP 接⼝时，会有 /dev/drm_dp_aux0 和 /dev/drm_dp_aux1

#seek 后为起始的 DPCD 寄存器地址
#count 值为要写⼊的 DPCD 寄存器的数量
#如下指令为把  0x0a 和 0x80 两个值写⼊ 0x100 起始的两个 DPCD 寄存器处
echo -e -n "\x0a\x80" | dd of=/dev/drm_dp_aux0 bs=1 seek=$((0x100)) count=2 status=none
```

### 3.4 Отладка Type-C

HPD Type-C обнаруживает PD-контроллер; программная обработка в основном выполняется TCPM. Получение журнала обнаружения TCPM:

```text
rk3588_s:/ # ls -l /sys/kernel/debug/usb/
total 0
-r--r--r-- 1 root root 0 1970-01-01 00:00 devices

drwxr-xr-x 18 root root 0 1970-01-01 00:00 fc000000.usb
drwxr-xr-x 2 root root 0 1970-01-01 00:00 fc400000.usb
-r--r--r-- 1 root root 0 1970-01-01 00:00 fusb302-2-0022
drwxr-xr-x 4 root root 0 1970-01-01 00:00 ohci
-r--r--r-- 1 root root 0 1970-01-01 00:00 tcpm-2-0022
drwxr-xr-x 2 root root 0 1970-01-01 00:00 usbmon
drwxr-xr-x 2 root root 0 2021-01-01 12:00 uvcvideo
drwxr-xr-x 3 root root 0 1970-01-01 00:00 xhci
```

В /sys/kernel/debug/usb/ узел fusb302-2-0022 относится к PD-контроллеру, tcpm-2-0022 — к TCPM. Чтение журнала TCPM:

```text
cat /sys/kernel/debug/usb/tcpm-2-0022
```

В tcpm-2-0022 число 2 обозначает шину i2c, 0022 — адрес PD-контроллера.

Чтение журнала PD-контроллера:

```text
cat /sys/kernel/debug/usb/fusb302-2-0022
```

В fusb302-2-0022 число 2 обозначает шину i2c, 0022 — адрес PD-контроллера. Узел относится к fusb302; имена других контроллеров отличаются.

Помимо журналов, дополнительная информация доступна в узле Type-C:

```text
console:/ # ls /sys/class/typec
port0 port0-partner
```

port0 представляет интерфейс Type-C со стороны SoC; port0-partner — каталог подключённого устройства.

Ориентация подключения Type-C:

```text
cat /sys/class/typec/port0/orientation
reverse
```

В port0-partner может быть несколько каталогов. Каталог DP Alt Mode содержит подкаталог displayport и значение svid, равное 0xff01.

```text
ls -l /sys/class/typec/port0-partner/port0-partner.0/
total 0

-r--r--r-- 1 root root 4096 2022-04-14 14:50 active
-r--r--r-- 1 root root 4096 2022-04-14 14:50 description
drwxr-xr-x 2 root root 0 2022-04-14 14:50 displayport
lrwxrwxrwx 1 root root 0 2022-04-14 14:50 driver ->
../../../../../../../../../bus/typec/drivers/typec_displayport
-r--r--r-- 1 root root 4096 2022-04-14 14:50 mode
drwxr-xr-x 2 root root 0 2022-04-14 14:50 mode1
lrwxrwxrwx 1 root root 0 2022-04-14 14:50 port -> ../../port0.0
drwxr-xr-x 2 root root 0 2022-04-14 14:50 power
lrwxrwxrwx 1 root root 0 2022-04-14 14:50 subsystem ->

../../../../../../../../../bus/typec
-r--r--r-- 1 root root 4096 2022-04-14 14:50 svid
-rw-r--r-- 1 root root 4096 2022-04-14 14:50 uevent
-r--r--r-- 1 root root 4096 2022-04-14 14:50 vdo
```

```text
cat /sys/class/typec/port0-partner/port0-partner.0/svid
ff01
```

Чтение текущего назначения контактов:

```text
cat /sys/class/typec/port0-partner/port0-partner.0/displayport/pin_assignment
C [D]
#当前连接的设备⽀出  C assignment 和 D assignment, ⽬前配置的是 D assignment
```

Эти процедуры относятся к PD-контроллерам на основе TCPM. Для других контроллеров уточните интерфейсы получения информации у поставщика.

### 3.5 Чтение регистров DP

Регистры DP RK3588:

```text
#dp0 控制器
cat /sys/kernel/debug/regmap/fde50000.dp/registers
#usbdp phy0

cmn_reg0000 - cmn_reg015D:
io -4 -r -l 1400 0xfed88000
trsv_reg0200 - trsv_reg03C3:
io -4 -r -l 1808 0xfed88800
trsv_reg0400 - trsv_reg0435:
io -4 -r -l 212 0xfed89000
trsv_reg0600 - trsv_reg07C3:
io -4 -r -l 1808 0xfed89800
trsv_reg0800 - trsv_reg0835:
io -4 -r -l 212 0xfed8A000
#dp1 控制器
cat /sys/kernel/debug/regmap/fde60000.dp/registers
#usbdp phy1

cmn_reg0000 - cmn_reg015D:
io -4 -r -l 1400 0xfed98000
trsv_reg0200 - trsv_reg03C3:
io -4 -r -l 1808 0xfed98800
trsv_reg0400 - trsv_reg0435:
io -4 -r -l 212 0xfed99000
trsv_reg0600 - trsv_reg07C3:
io -4 -r -l 1808 0xfed99800
trsv_reg0800 - trsv_reg0835:
io -4 -r -l 212 0xfed9A000
# vo0_grf
cat /sys/kernel/debug/regmap/dummy-syscon@fd5a6000/registers
```

Регистры DP RK3576:

```text
#dp 控制器
cat /sys/kernel/debug/regmap/27e40000.dp/registers
#usbdp phy

cmn_reg0000 - cmn_reg015D:
io -4 -r -l 1400 0x2b018000
trsv_reg0200 - trsv_reg03C3:
io -4 -r -l 1808 0x2b018800
trsv_reg0400 - trsv_reg0435:
io -4 -r -l 212 0x2b019000
trsv_reg0600 - trsv_reg07C3:
io -4 -r -l 1808 0x2b019800
trsv_reg0800 - trsv_reg0835:
io -4 -r -l 212 0x2b01a000
# vo1_grf
cat /sys/kernel/debug/regmap/dummy-syscon@0x0000000026036000/registers
```

Дамп регистров PHY следует получать только при подключённом и нормально работающем мониторе DP.

### 3.6 Проверка состояния VOP

Запрос состояния VOP:

```text
cat /sys/kernel/debug/dri/0/summary
```

Полученное состояние VOP показано ниже:

![Пример состояния VOP из оригинала](/docs/rockchip-displayport/assets/en-p33-1.png)

Video Portx: текущее состояние Video Port.

Connector: выходной интерфейс, связанный с Video Port.

Display mode: текущие тайминги выхода Video Port.

Clusterx-winx (Esmartx-winx): информация о слоях.

В Kernel 6.1 и новее вывод имеет вид:

```text
root@linaro-alip:/# cat /sys/kernel/debug/dri/0/summary
Video Port0: ACTIVE

   Connector:DP-2 Encoder: DP-MST 0
      bus_format[100a]: RGB888_1X24
      overlay_mode[0] output_mode[f] SDR[0] color-encoding[BT.709] color-range[Limited]
   Display mode: 1280x720p60
      clk[74250] real_clk[74250] type[0] flag[5]
      H: 1280 1390 1430 1650
      V: 720 725 730 750
   Esmart0-win0: ACTIVE
      win_id: 0
      format: XR24 little-endian (0x34325258) pixel_blend_mode[0] glb_alpha[0xff]
      color: SDR[0] color-encoding[BT.601] color-range[Limited]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]

      zpos: 0
      src: pos[0, 0] rect[1280 x 720]
      dst: pos[0, 0] rect[1280 x 720]
      buf[0]: addr: 0x0000000001017000 pitch: 5120 offset: 0
Video Port1: ACTIVE
   Connector:DP-5 Encoder: DP-MST 1
      bus_format[100a]: RGB888_1X24
      overlay_mode[0] output_mode[f] SDR[0] color-encoding[BT.709] color-range[Limited]
   Display mode: 1280x720p60
      clk[74250] real_clk[74250] type[0] flag[5]
      H: 1280 1390 1430 1650
      V: 720 725 730 750

   Esmart1-win0: ACTIVE
      win_id: 1
      format: XR24 little-endian (0x34325258) pixel_blend_mode[0] glb_alpha[0xff]
      color: SDR[0] color-encoding[BT.601] color-range[Limited]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]
      zpos: 1
      src: pos[0, 0] rect[1280 x 720]
      dst: pos[0, 0] rect[1280 x 720]
      buf[0]: addr: 0x00000000001e1000 pitch: 5120 offset: 0
Video Port2: ACTIVE
   Connector:DP-6 Encoder: DP-MST 2
      bus_format[100a]: RGB888_1X24

      overlay_mode[0] output_mode[f] SDR[0] color-encoding[BT.709] color-range[Limited]
   Display mode: 1280x720p60
      clk[74250] real_clk[74250] type[0] flag[5]
      H: 1280 1390 1430 1650
      V: 720 725 730 750
   Esmart2-win0: ACTIVE
win_id: 2
format: XR24 little-endian (0x34325258) pixel_blend_mode[0] glb_alpha[0xff]
color: SDR[0] color-encoding[BT.601] color-range[Limited]

rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
csc: y2r[0] r2y[0] csc mode[0]
zpos: 2
src: pos[0, 0] rect[1280 x 720]
dst: pos[0, 0] rect[1280 x 720]
buf[0]: addr: 0x00000000015e2000 pitch: 5120 offset: 0
```

Сводка также содержит информацию Encoder.

RK3576 регистрирует один Encoder для SST и три для MST. Три MST Encoder соответствуют потокам DP следующим образом:

```text
DP-MST 0 --> Stream-0
DP-MST 1 --> Stream-1

DP-MST 2 --> Stream-2
```

MST Encoder означает работу DP в MST. Если DP Connector связан с Encoder TMDS-xxx, используется SST. Например:

```text
root@linaro-alip:/# cat /sys/kernel/debug/dri/0/summary
Video Port0: ACTIVE
   Connector:DP-1 Encoder: TMDS-184

      bus_format[1018]: RGB101010_1X30
      overlay_mode[0] output_mode[f] SDR[0] color-encoding[BT.709] color-range[Limited]
   Display mode: 1280x720p60
      clk[74250] real_clk[74250] type[0] flag[5]
      H: 1280 1390 1430 1650
      V: 720 725 730 750
   Esmart0-win0: ACTIVE
      win_id: 0
      format: XR24 little-endian (0x34325258) pixel_blend_mode[0] glb_alpha[0xff]
      color: SDR[0] color-encoding[BT.601] color-range[Limited]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]

      zpos: 0
      src: pos[0, 0] rect[1280 x 720]
      dst: pos[0, 0] rect[1280 x 720]
      buf[0]: addr: 0x000000000090f000 pitch: 5120 offset: 0
Video Port1: DISABLED
Video Port2: DISABLED
```

### 3.7 Проверка частот отображения

Получение всего дерева частот:

```text
cat /sys/kernel/debug/clk/clk_summary
```

Получение частоты DP AUX 16M:

```text
cat /sys/kernel/debug/clk/clk_summary | grep -e "clk_aux16m_"
```

Получение VOP dclk:

```text
cat /sys/kernel/debug/clk/clk_summary | grep -e "dclk"
```

### 3.8 Настройка уровней журнала DRM

DRM определяет следующие категории журналирования. Нужные категории можно включать динамически:

```text
enum drm_debug_category {
      /**
      * @DRM_UT_CORE: Used in the generic drm code: drm_ioctl.c, drm_mm.c,

      * drm_memory.c, ...
      */
      DRM_UT_CORE      = 0x01,
      /**
      * @DRM_UT_DRIVER: Used in the vendor specific part of the driver: i915,
      * radeon, ... macro.
      */
      DRM_UT_DRIVER    = 0x02,
      /**
      * @DRM_UT_KMS: Used in the modesetting code.
      */
      DRM_UT_KMS       = 0x04,
      /**

      * @DRM_UT_PRIME: Used in the prime code.
      */
      DRM_UT_PRIME     = 0x08,
      /**
      * @DRM_UT_ATOMIC: Used in the atomic code.
      */
      DRM_UT_ATOMIC    = 0x10,
      /**
      * @DRM_UT_VBL: Used for verbose debug message in the vblank code.
      */
      DRM_UT_VBL       = 0x20,
      /**

      * @DRM_UT_STATE: Used for verbose atomic state debugging.
      */
      DRM_UT_STATE     = 0x40,
      /**
      * @DRM_UT_LEASE: Used in the lease code.
      */
      DRM_UT_LEASE     = 0x80,
      /**
      * @DRM_UT_DP: Used in the DP code.
      */
      DRM_UT_DP        = 0x100,
      /**
      * @DRM_UT_DRMRES: Used in the drm managed resources code.

      */
      DRM_UT_DRMRES    = 0x200,
};
```

При отладке DP, особенно ошибок commit, обычно включают ATOMIC:

```text
echo 0x10 > /sys/module/drm/parameters/debug
```

Для журнала чтения и записи DPCD выполните:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

### 3.9 Отладочный журнал драйвера DP

Для отладочных сообщений драйвер DP использует drm_dbg_dp. Включение динамического журнала DP:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

### 3.10 Получение DP Status

Получение DP Status:

```text
cat /sys/kernel/debug/dri/0/dw-dp0/dp_status
```

dw-dp0 обозначает физический интерфейс DP. В RK3576 один интерфейс, поэтому используется dw-dp0. У RK3588 два: dw-dp0 и dw-dp1.

Для RK3576 с нормально работающим выходом DP команда выдаёт:

```text
HPD:
      force hpd: no
      gpio hpd: no

      usbdp hpd: no
      hpd status: plug
AUX: normal
LINK:
      link lanes: 4
      link rate: 5400 MHz
      ssc: enable
      cr done:yes
      eq done:yes
DP mode: SST
DP Stream0: active
      Video Info:
            video enable: yes
            video format: RGB_10BIT

            scan mode: process
            hactive: 3840 hfp: 176   hsync: 88   hblank: 560  hsync
pol: 1
            vactive: 2160 vfp: 8     vsync: 10   vblank: 90   vsync
pol: 1
      MSA Info:
            misc0 : 0x40
            misc1 : 0x00
            Pixel Encoding/Colorimetry format: RGB
            Color Depth: 10 bpc
      SDP Bank00 Info:
            vertical ctrl: no

            horizontal ctrl: no
      SDP Bank01 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank02 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank03 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank04 Info:
            vertical ctrl: no
            horizontal ctrl: no

      SDP Bank05 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank06 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank07 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank08 Info:
            vertical ctrl: no
            horizontal ctrl: no

      SDP Bank09 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank10 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank11 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank12 Info:
            vertical ctrl: no
            horizontal ctrl: no
      SDP Bank13 Info:
     vertical ctrl: no
     horizontal ctrl: no
SDP Bank14 Info:

     vertical ctrl: no
     horizontal ctrl: no
SDP Bank15 Info:
     vertical ctrl: no
     horizontal ctrl: no
```

#### 3.10.1 HPD Status

Информация HPD содержит тип и состояние:

force hpd: yes означает, что в DTS задано force-hpd.

gpio hpd: yes означает, что обычный GPIO настроен в DTS как контакт HPD.

usbdp hpd: yes означает передачу состояния HPD Type-C драйверу DP через TCPM.

hpd status: plug означает высокий уровень HPD, unplug — отсутствие высокого уровня.

#### 3.10.2 AUX Status

AUX: normal означает нормальный доступ AUX, wrong — ошибку доступа.

#### 3.10.3 LINK Status

Раздел LINK описывает соединение после обучения:

link lanes: выбранное после обучения число линий — 1, 2 или 4.

link rate: выбранная после обучения скорость — 1620MHz, 2700MHz, 5400MHz или 8100MHz.

ssc: enable означает включённый SSC, disable — отключённый.

cr done: yes означает успешную фазу восстановления тактовой частоты при обучении.

eq done: yes означает успешную фазу выравнивания канала при обучении.

#### 3.10.4 DP Mode Status

DP mode: SST либо MST обозначает текущий режим передачи DP.

#### 3.10.5 DP Stream Status

Интерфейс только с SST содержит информацию об одном потоке DP; интерфейс с MST — о нескольких.

DP Streamx: active означает, что этот поток включён.

Video Info описывает текущую конфигурацию вывода контроллера DP:

video enable: yes выводит изображение от VOP; no выводит непрерывно формируемый контроллером DP шаблон.

video format описывает глубину и формат цвета. Например, RGB_10BIT означает данные RGB с глубиной 10 бит.

scan mode: значение прогрессивной развёртки в оригинале написано preocess; interlace обозначает чересстрочную развёртку.

hactive, hfp, hsync, hblank, hsync pol, vatctive, vfp, vsync, vblank и vsync pol описывают текущие тайминги развёртки. Написание vatctive сохранено из оригинала.

MSA Info передаёт DPRX конфигурацию выходного потока DP:

misc0: исходные недекодированные данные misc0.

misc1: в оригинале описан как исходные недекодированные данные misc0; несоответствие имени поля сохранено для проверки.

Pixel Encoding/Colorimetry format описывает колориметрию и диапазон. RGB означает полный диапазон RGB, CEA RGB — ограниченный.

Варианты YUV: YCBCR 422 BT601, YCBCR 422 BT709, YCBCR 444 BT601 и YCBCR 444 BT709; они используют ограниченный диапазон. Согласно оригиналу, YUV420, BT2020 либо YUV limited range требуют VSC SDP; тогда поле показывает use VSC SDP.

Color Depth описывает передаваемую глубину цвета; оригинал перечисляет 6 bpc, 8 bpc и 12 bpc. При передаче информации о цвете через VSC SDP выводится use VSC SDP.

SDP Bankx Info показывает использование SDP Bankx для передачи пакетов SDP:

vertical ctrl: yes означает передачу SDP этого банка в интервале vblank; no — отсутствие передачи в vblank.

horizontal ctrl: yes означает передачу в hblank; no — отсутствие передачи в hblank.

header: заголовок пакета SDP; декодируется по спецификации DP.

payload: данные SDP; декодируются по спецификации DP.

Ниже часть информации DP Stream при передаче 4K60Hz в YUV420:

```text
DP mode: SST
DP Stream0: active
      Video Info:

           video enable: yes
           video format: YCBCR420_8BIT
           scan mode: process
           hactive: 3840 hfp: 178   hsync: 88   hblank: 560   hsync
pol: 1
           vactive: 2160 vfp: 8     vsync: 10   vblank: 90    vsync
pol: 1
      MSA Info:
           misc0 : 0x20
           misc1 : 0x40

           Pixel Encoding/Colorimetry format: use VSC SDP
           Color Depth: use VSC SDP
      SDP Bank00 Info:
           vertical ctrl: no
           horizontal ctrl: no
      SDP Bank01 Info:
           vertical ctrl: yes
           horizontal ctrl: no
           header: 00 07 05 13
           payload: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 31 81 00 00 00 00
00 00 00 00 00 00 00 00 00 00
```

Для YUV420 поля Pixel Encoding/Colorimetry format и Color Depth показывают use VSC SDP. SDP Bank01 Info показывает передачу VSC SDP банком SDP Bank01 в интервале vblank.

### 3.11 Получение информации DP MST

Получение информации DP MST:

```text
cat /sys/kernel/debug/dri/0/dw-dp0/dp_mst_info
```

dw-dp0 обозначает физический интерфейс DP. RK3576 имеет один и использует dw-dp0. RK3588 не поддерживает DP MST и не использует этот узел.

При нормальной работе трёх выходов MST RK3576 команда возвращает:

```text
root@linaro-alip:/# cat /sys/kernel/debug/dri/0/dw-dp0/dp_mst_info
      mstb - [000000003a17fc25]: num_ports: 4
      port 3 - [00000000099bbb63] (output - SST SINK): ddps: 1, ldps: 0, sdp: 1/1, fec:

false, conn: 00000000c74ff83b
      port 2 - [00000000505d66cf] (output - MST BRANCHING): ddps: 1, ldps: 0, sdp: 0/0,
fec: true, conn: 00000000b57a2623
           mstb - [0000000090afd0f3]: num_ports: 3
           port 1 - [00000000072aa867] (output - NONE): ddps: 0, ldps: 0, sdp: 0/0,
fec: false, conn: 000000005ba2b268
           port 8 - [0000000046d78f33] (output - SST SINK): ddps: 1, ldps: 0, sdp: 1/2,
fec: true, conn: 000000002668a7af
           port 0 - [00000000a70f650f] (input - NONE): ddps: 1, ldps: 0, sdp: 0/0, fec:
false, conn: 0000000000000000
      port 1 - [000000003fd2f64a] (output - SST SINK): ddps: 1, ldps: 0, sdp: 1/1, fec:
false, conn: 000000005ff7f122

      port 0 - [00000000c8a5769d] (input - NONE): ddps: 1, ldps: 0, sdp: 0/0, fec: false,
conn: 0000000000000000

*** Atomic state info ***
payload_mask: 7, max_payloads: 3, start_slot: 1, pbn_div: 60
| idx | port | vcpi | slots | pbn | dsc | sink name |
   1     1    1 06 - 10 266 N          U27U2D
   2     8    2 11 - 15 266 N      DELL U2723QE

   3     3    3 01 - 05 266 N         U28E590

*** DPCD Info ***
dpcd: 14 1e c4 81 01 11 01 83 2a 3f 04 00 00 00 84
faux/mst: 00 01
mst ctrl: 07
branch oui: 90cc24 devid: SYNAS revision: hw: 1.0 sw: 5.5
payload table: 03 03 03 03 03 03 01 01 01 01 01 02 02 02 02 02 00 00 00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
00 00 00 00 00 00 00

*** Connector path info ***

connector name | connector path
DP-2        mst:185-1
DP-3        mst:185-2
DP-6        mst:185-3
DP-5        mst:185-2-8
DP-7        mst:185-2-1
```

#### 3.11.1 MST Port Info

Первая часть описывает топологию соединений устройств.

```text
      mstb - [000000003a17fc25]: num_ports: 4
      port 3 - [00000000099bbb63] (output - SST SINK): ddps: 1, ldps: 0, sdp: 1/1, fec:
false, conn: 00000000c74ff83b

      port 2 - [00000000505d66cf] (output - MST BRANCHING): ddps: 1, ldps: 0, sdp: 0/0,
fec: true, conn: 00000000b57a2623
           mstb - [0000000090afd0f3]: num_ports: 3
           port 1 - [00000000072aa867] (output - NONE): ddps: 0, ldps: 0, sdp: 0/0,
fec: false, conn: 000000005ba2b268
           port 8 - [0000000046d78f33] (output - SST SINK): ddps: 1, ldps: 0, sdp: 1/2,
fec: true, conn: 000000002668a7af
           port 0 - [00000000a70f650f] (input - NONE): ddps: 1, ldps: 0, sdp: 0/0, fec:
false, conn: 0000000000000000
      port 1 - [000000003fd2f64a] (output - SST SINK): ddps: 1, ldps: 0, sdp: 1/1, fec:
false, conn: 000000005ff7f122
      port 0 - [00000000c8a5769d] (input - NONE): ddps: 1, ldps: 0, sdp: 0/0, fec: false,
conn: 0000000000000000
```

Как описано в разделе о выводе DP (в оригинале ссылка 1.1.3), MST RK3576 требует MST HUB или MST-монитор. Каждый вход и выход имеет собственный номер. На схеме HUB имеет один вход и три выхода; оригинал ошибочно называет обе группы выходами.

![Нумерация физических портов MST HUB](/docs/rockchip-displayport/assets/en-p39-1.png)

Это физические порты для внешних устройств. По DP им назначаются номера 0–7, причём номер входа меньше номеров выходов. MST HUB обычно начинает с 0. Здесь четыре порта: Port0 — вход, Port1/2/3 — выходы. К Port2 подключён SST-монитор; получаем следующую топологию:

```text
      mstb - [00000000c8269fca]: num_ports: 4
      port 3 - [0000000007690f7c] (output - NONE): ddps: 0, ldps: 0, sdp: 0/0, fec: false,
conn: 00000000d0584c6f

      port 2 - [00000000812cc57a] (output - SST SINK): ddps: 1, ldps: 0, sdp: 1/1, fec:
false, conn: 000000001ef4a070
      port 1 - [00000000efb170aa] (output - NONE): ddps: 0, ldps: 0, sdp: 0/0, fec: false,
conn: 000000001455081f
      port 0 - [000000005aa73543] (input - NONE): ddps: 1, ldps: 0, sdp: 0/0, fec: false,
conn: 0000000000000000
```

MST-монитор обычно имеет вход DP и выход DP, как на схеме; оригинал дважды пишет «вход».

![Физические и логические порты MST-монитора](/docs/rockchip-displayport/assets/en-p40-1.png)

Здесь Port0 — вход, Port1 — выход, Port8 — внутренний выход монитора. Такие внутренние порты являются логическими и имеют номера 8–15. Без следующего монитора в цепочке топология выглядит так:

```text
      mstb - [0000000019f71241]: num_ports: 3
      port 1 - [0000000095fb1fc0] (output - NONE): ddps: 0, ldps: 0, sdp: 0/0, fec: false,
conn: 000000004d03ffa2

      port 8 - [00000000a66da753] (output - SST SINK): ddps: 1, ldps: 0, sdp: 1/2, fec:
true, conn: 000000009a417589
      port 0 - [000000009a0122a8] (input - NONE): ddps: 1, ldps: 0, sdp: 0/0, fec: false,
conn: 0000000000000000
```

#### 3.11.2 Atomic state info

В MST базовый пакет DP называется Multi-Stream Transport Packet (MTP). Он содержит 64 символа линии, или временных слота, с номерами 0–63. Слот 0 — MTPH, остальные передают данные потоков изображения. Формат MTP показан ниже.

![Пакет MTP и временные слоты](/docs/rockchip-displayport/assets/en-p41-1.png)

В payload info поле port — номер порта MST-устройства, vcpi — номер потока, slots — занятые потоком временные слоты, pbn — выделенная полоса, sink name — имя монитора.

```text
| idx | port | vcpi | slots | pbn | dsc | sink name |
   1     1    1 06 - 10 266 N          U27U2D
   2     8    2 11 - 15 266 N      DELL U2723QE

   3     3    3 01 - 05 266 N         U28E590
```

#### 3.11.3 DPCD Info

Раздел содержит данные DPCD. Особенно важна payload table с подробным распределением временных слотов.

```text
*** DPCD Info ***
dpcd: 14 1e c4 81 01 11 01 83 2a 3f 04 00 00 00 84
faux/mst: 00 01

mst ctrl: 07
branch oui: 90cc24 devid: SYNAS revision: hw: 1.0 sw: 5.5
payload table: 03 03 03 03 03 03 01 01 01 01 01 02 02 02 02 02 00 00 00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
00 00 00 00 00 00 00
```

#### 3.11.4 Connector Path Info

connector name — динамически зарегистрированный DP connector, connector path — соответствующий путь. В оригинале имеются опечатки connecor и connecotr.

```text
*** Connector path info ***
connector name | connector path

DP-2        mst:185-1
DP-3        mst:185-2
DP-6        mst:185-3
DP-5        mst:185-2-8
DP-7        mst:185-2-1
```

## 4. Частые вопросы

### 4.1 Нет изображения или изображение некорректно после подключения DP

Сначала проверьте наличие следующего сообщения:

```text
[  14.857002] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] Update mode to
1920x1080p60, type: 10(if:200) for vp2 dclk: 148500000
[  14.857149] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out2 div: 2

dclk_core2 div: 2
[  14.857868] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vop2 to
148500000, get 148500000
[  14.872406] dw-dp fde50000.dp: full-training link: 2 lanes at 5400 MHz
[  14.893269] dw-dp fde50000.dp: clock recovery succeeded
[  14.899797] dw-dp fde50000.dp: channel equalization succeeded
```

#### 4.1.1 Успешное обучение линии DP

Это сообщение означает обнаруженное подключение DP, успешное обучение линии и начало вывода. Отсутствие или искажение изображения возможно по следующим причинам:

(1) Неточное деление dclk

В следующем журнале запрошена dclk 25.175MHz, но получена 20MHz. Для анализа такой ошибки соберите полный журнал и дерево частот.

```text
[ 268.733803] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_disable] Crtc atomic disable
vp2
[ 268.759178] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] Update mode to

640x480p60, type: 10(if:200) for vp2 dclk: 25175000
[ 268.759447] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out2 div: 2
dclk_core2 div: 2
[ 268.759665] rockchip_rk3588_pll_set_rate: Invalid rate : 25175000 for pll clk pll_v0pll
[ 268.759715] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vop2 to
25175000, get 20000000
[ 268.775591] dw-dp fde50000.dp: full-training link: 4 lanes at 2700 MHz
[ 268.790059] dw-dp fde50000.dp: clock recovery succeeded
[ 268.795376] dw-dp fde50000.dp: channel equalization succeeded
```

(2) Слой не выделен

Если userspace не выделил слой, выполните `cat /sys/kernel/debug/dri/0/summary`. Если информация о слоях отсутствует, как ниже, продолжите анализ userspace.

```text
rk3588_s:/ # cat /sys/kernel/debug/dri/0/summary
Video Port0: DISABLED

Video Port1: DISABLED
Video Port2: DISABLED
Video Port3: ACTIVE
   Connector: DSI-1
      bus_format[100a]: RGB888_1X24
      overlay_mode[0] output_mode[0] color_space[0], eotf:0
   Display mode: 1080x1920p60
      clk[132000] real_clk[132000] type[48] flag[a]
      H: 1080 1095 1099 1129
      V: 1920 1935 1937 1952
```

#### 4.1.2 DP connected

Если сообщения из начала раздела нет, сначала получите состояние подключения DP:

```text
cat /sys/class/drm/card0-DP-1/status
```

Если DP имеет состояние connected, сначала проанализируйте ошибки журнала. Если ошибок нет, включите DRM ATOMIC и воспроизведите проблему. Проверьте, не завершился ли drm atomic commit досрочно из-за сбоя одного из этапов atomic check.

#### 4.1.3 DP disconnected

Для стандартного DP проверьте настройку HPD и аппаратные соединения. Для Type-C используйте анализ ошибок подключения ниже.

### 4.2 Ошибка подключения Type-C

Здесь ошибка Type-C означает сбой на этапе CC или PD. Сначала получите состояние DP:

```text
cat /sys/class/drm/card0-DP-1/status
```

При ошибке подключения состояние будет disconnected.

Прочтите журнал TCPM через отладочный узел:

```text
cat /sys/kernel/debug/usb/tcpm-2-0022
```

При нормальном подключении журнал выглядит так:

```text
[  25.026952] AMS DISCOVER_IDENTITY start
[  25.026967] PD TX, header: 0x176f

[  25.035314] PD TX complete, status: 0
[  25.042866] PD RX, header: 0x524f [1]
[  25.042880] Rx VDM cmd 0xff00a041 type 1 cmd 1 len 5
[  25.042894] AMS DISCOVER_IDENTITY finished
[  25.042898] cc:=4
[  25.052343] Identity: 04e8:a020.0212
[  25.052364] AMS DISCOVER_SVIDS start
[  25.052372] PD TX, header: 0x196f
[  25.061314] PD TX complete, status: 0
[  25.067667] PD RX, header: 0x344f [1]
[  25.067680] Rx VDM cmd 0xff00a042 type 1 cmd 2 len 3
[  25.067695] AMS DISCOVER_SVIDS finished
[  25.067705] cc:=4

[  25.077097] SVID 1: 0xff01
[  25.077114] SVID 2: 0x4e8
[  25.077129] AMS DISCOVER_MODES start
[  25.077135] PD TX, header: 0x1b6f
[  25.086092] PD TX complete, status: 0
[  25.092224] PD RX, header: 0x264f [1]
[  25.092237] Rx VDM cmd 0xff01a043 type 1 cmd 3 len 2

[  25.092252] AMS DISCOVER_MODES finished
[  25.092256] cc:=4
[  25.101432] Alternate mode 0: SVID 0xff01, VDO 1: 0x00000c05
[  25.101517] AMS DISCOVER_MODES start
[  25.101526] PD TX, header: 0x1d6f
[  25.109717] PD TX complete, status: 0
[  25.114919] PD RX, header: 0x284f [1]
[  25.114937] Rx VDM cmd 0x4e8a043 type 1 cmd 3 len 2
[  25.114951] AMS DISCOVER_MODES finished
[  25.114956] cc:=4
[  25.124604] Alternate mode 1: SVID 0x04e8, VDO 1: 0x00000001
[  25.125676] AMS DFP_TO_UFP_ENTER_MODE start

[  25.125686] PD TX, header: 0x1f6f
[  25.134560] PD TX complete, status: 0
[  25.137903] PD RX, header: 0x1a4f [1]
[  25.137917] Rx VDM cmd 0xff01a144 type 1 cmd 4 len 1
[  25.137930] AMS DFP_TO_UFP_ENTER_MODE finished
[  25.137936] cc:=4
[  25.145828] AMS STRUCTURED_VDMS start
[  25.145836] PD TX, header: 0x216f
[  25.154942] PD TX complete, status: 0
[  25.161111] PD RX, header: 0x2c4f [1]
[  25.161125] Rx VDM cmd 0xff01a150 type 1 cmd 16 len 2 //STATUS UPDATE
[  25.161138] AMS STRUCTURED_VDMS finished
[  25.161142] cc:=4

[  25.171888] AMS STRUCTURED_VDMS start
[  25.171911] PD TX, header: 0x236f
[  25.182016] PD TX complete, status: 0
[  25.185550] PD RX, header: 0x1e4f [1]
[  25.185563] Rx VDM cmd 0xff01a151 type 1 cmd 17 len 1 //CONFIGURATION
[  25.185577] AMS STRUCTURED_VDMS finished
[  25.185581] cc:=4
[  26.392673] PD RX, header: 0x204f [1]
[  26.392687] Rx VDM cmd 0xff018106 type 0 cmd 6 len 2 //ATTENTION
```

Нормальная полная последовательность включает обмен DISCOVER_IDENTITY, DISCOVER_MODES, DFP_TO_UFP_ENTER_MODE, STATUS UPDATE, CONFIGURATION и ATTENTION. Отсутствие такого обмена означает нарушение согласования PD.

При нарушении последовательности оригинал предлагает проверить работу на большей скорости I2C PD-контроллера. Если проблема остаётся, предоставьте полные журналы TCPM и PD-контроллера.

### 4.3 Ошибка AUX_CH

Ошибки AUX_CH нарушают чтение/запись DPCD и чтение EDID. В журнале возможны сообщения:

```text
[ 1368.952182] dw-dp fde50000.dp: failed to probe DP link: -110
```

Если причина неясна, включите следующий режим отладки DRM:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

Прочтите журнал доступа DPCD через dmesg. При нормальном доступе ret равен 0; в оригинале DPCD ошибочно написано DPCP:

```text
[ 6329.554538] rockchip-drm display-subsystem: [drm:drm_dp_dpcd_probe] fde50000.dp: 0x00000
AUX -> (ret= 1) 12

[ 6329.554939] rockchip-drm display-subsystem: [drm:drm_dp_dpcd_read] fde50000.dp: 0x00000
AUX -> (ret= 15) 12 14 c2 81 01 01 01 81 02 02 06 00 00 00 81
[ 6329.555383] rockchip-drm display-subsystem: [drm:drm_dp_dpcd_probe] fde50000.dp: 0x00000
AUX -> (ret= 1) 12
```

При ошибке AUX_CH ret содержит код типа ошибки:

```text
[  31.116976] rockchip-drm display-subsystem: [drm:drm_dp_dpcd_probe] fde50000.dp: 0x00000
AUX -> (ret=-110)
```

Возможные причины:

#### 4.3.1 Неверная частота aux16m

Источником aux16m служит GPLL, по умолчанию 1188MHz. Стандартная частота aux16m показана ниже:

```text
root@RK3588:/# cat /sys/kernel/debug/clk/clk_summary | grep "aux16m"
       clk_aux16m_1        1      2     0   15840000     0    0
50000

       clk_aux16m_0        1      2     0   15840000     0    0
50000
```

Если GPLL не равна 1188MHz и aux16m также отличается от стандартной, проверьте изменения файлов /drivers/clk/rockchip/ относительно SDK и перенастройку источника VOP DCLK.

#### 4.3.2 Неправильная последовательность включения и отключения PHY

Это обычно встречается при общем PHY для USB и Type-C. Если одна ориентация работает, а другая нет, USB PHY мог не выполнить выход при отключении и не переинициализироваться при повторном подключении. Добавьте журнал для проверки power-on/off при подключении/отключении USB и повторной инициализации при перевороте разъёма. Пример патча журналирования:

```text
diff --git a/drivers/phy/rockchip/phy-rockchip-usbdp.c b/drivers/phy/rockchip/phy-rockchip-usbdp.c

index c6fc4a2aa558..6b35e12f40aa 100644
--- a/drivers/phy/rockchip/phy-rockchip-usbdp.c
+++ b/drivers/phy/rockchip/phy-rockchip-usbdp.c
@@ -823,6 +823,7 @@ static int udphy_power_on(struct rockchip_udphy *udphy, u8 mode)
 {
      int ret;


+     dev_info(udphy->dev, "%s status:%x, mode:%x\n", __func__, udphy->status, mode);
      if (!(udphy->mode & mode)) {
            dev_info(udphy->dev, "mode 0x%02x is not support\n", mode);
            return 0;
@@ -859,6 +860,7 @@ static int udphy_power_off(struct rockchip_udphy *udphy, u8 mode)
 {
      int ret;

+     dev_info(udphy->dev, "%s status:%x, mode:%x\n", __func__, udphy->status, mode);
      if (!(udphy->mode & mode)) {
            dev_info(udphy->dev, "mode 0x%02x is not support\n", mode);
            return 0;

@@ -883,6 +885,7 @@ static int rockchip_dp_phy_power_on(struct phy *phy)
      struct rockchip_udphy *udphy = phy_get_drvdata(phy);
      int ret, dp_lanes;

+     dev_info(udphy->dev, "%s\n", __func__);
      mutex_lock(&udphy->mutex);

      dp_lanes = udphy_dplane_get(udphy);
@@ -914,6 +917,7 @@ static int rockchip_dp_phy_power_off(struct phy *phy)
      struct rockchip_udphy *udphy = phy_get_drvdata(phy);
      int ret;

+     dev_info(udphy->dev, "%s\n", __func__);

      mutex_lock(&udphy->mutex);
      ret = udphy_dplane_enable(udphy, 0);
      if (ret)
@@ -1028,6 +1032,7 @@ static int rockchip_u3phy_init(struct phy *phy)
      struct rockchip_udphy *udphy = phy_get_drvdata(phy);
      int ret = 0;

+     dev_info(udphy->dev, "%s\n", __func__);
      mutex_lock(&udphy->mutex);
      /* DP only or high-speed, disable U3 port */
      if (!(udphy->mode & UDPHY_MODE_USB) || udphy->hs) {
@@ -1047,6 +1052,7 @@ static int rockchip_u3phy_exit(struct phy *phy)

      struct rockchip_udphy *udphy = phy_get_drvdata(phy);
      int ret = 0;

+     dev_info(udphy->dev, "%s\n", __func__);
      mutex_lock(&udphy->mutex);
      /* DP only or high-speed */
      if (!(udphy->mode & UDPHY_MODE_USB) || udphy->hs)
@@ -1363,6 +1369,7 @@ static int rk3588_udphy_init(struct rockchip_udphy *udphy)
      const struct rockchip_udphy_cfg *cfg = udphy->cfgs;
      int ret;

+     dev_info(udphy->dev, "%s\n", __func__);
      /* enable rx lfps for usb */
if (udphy->mode & UDPHY_MODE_USB)
     grfreg_write(udphy->udphygrf, &cfg->grfcfg.rx_lfps, true);
```

#### 4.3.3 Ошибка переходника DP dual mode

DP dual mode требует поддержки выходом DP как сигналов DP, так и HDMI TMDS, а каналом AUX — DP AUX и DDC (I2C).

DP RK3588 не поддерживает DP dual mode. Кабель dual mode может вызвать ошибки AUX_CH, особенно при переходе со стандартного DP на HDMI. Если такой переходник вызывает ошибки и поддерживает HDMI ниже 2.0, он может использовать dual mode. Оригинал рекомендует попробовать переходник HDMI 2.0 или новее; необходимо проверить реальную схему активного преобразователя, а не считать обозначение версии гарантией совместимости.

#### 4.3.4 Помехи сигналов

При прямом подключении Type-C сигналы USB DP/DM могут создавать помехи DP AUX. Для аппаратной диагностики отключите USB DP/DM и проверьте повторяемость проблемы. Оригинал предлагает качественный кабель Type-C с экранированием сигналов либо отказ от передачи данных по USB DP/DM.

#### 4.3.5 Аппаратная неисправность

Сначала проверьте соединения, передачу дифференциального сигнала AUX и качество пайки. Затем проверьте соответствие внешней схемы AUX_CH спецификации DP. При использовании преобразователя сначала проверьте его обвязку.

### 4.4 Настройка вывода 4K 120Hz

VOP ACLK RK3588 по умолчанию равна 500M. Вывод с высокой пиксельной частотой, например 4K 120Hz, может превысить производительность и вызвать следующие искажения:

![Фото ошибки изображения при высокой пиксельной частоте из оригинала](/docs/rockchip-displayport/assets/en-p48-1.png)

Для этой проблемы оригинал повышает VOP ACLK до 800M:

```text
&vop {
   assigned-clocks = <&cru ACLK_VOP>;

   assigned-clock-rates = <800000000>;
};
```

Чтение VOP ACLK:

```text
cat /sys/kernel/debug/clk/clk_summary | grep "aclk_vop"
```

### 4.5 Расчёт полосы DP

#### 4.5.1 Полоса SST

Рассчитайте требуемую полосу на одну линию DP:

```text
bandwidth_per_lane = pixel_clk * bit_per_pixel * 1.25 / lane_count
```

bit_per_pixel — число бит на пиксель, 1.25 — коэффициент кодирования PHY, lane_count — число доступных линий. bandwidth_per_lane — минимальная требуемая скорость каждой линии. Если фактическая скорость ниже, драйвер DP отфильтрует режим с такой пиксельной частотой.

Для переходников и док-станций проверьте соответствие скорости и числа линий требованиям полосы. Иначе нужен переходник или док с большей скоростью и/или большим числом линий.

Например, для док-станции с двумя линиями до 5.4 Gbps/lane при 4K@60Hz, пиксельной частоте 594MHz и RGB888 требуется такая полоса на линию:

```text
bandwidth_per_lane = 594 * 24 * 1.25 / 2 = 8.91 Gbps/lane > 5.4 Gbps/lane
```

Этот док не может выводить 4K@60Hz RGB888 при 594MHz. Используйте док с четырьмя линиями для большей полосы PHY либо YUV420 для уменьшения требуемой полосы.

#### 4.5.2 Полоса MST

В MST для каждого потока и линии применяется та же формула, что в SST. Однако суммарная полоса потоков не должна превышать полосу соединения, а заголовок MTPH также расходует её.

Для максимального соединения RK3576: четыре линии по 8.1Gbps:

MTP содержит 64 временных слота, один занят MTPH. Максимальная полоса данных на линию:

```text
bandwidth_per_lane_max = 8.1 * 63 / 64 = 7.97 Gbps
```

Для 4096x2160@60Hz, пиксельной частоты 594MHz и RGB888 полоса на линию:

```text
bandwidth_per_lane = 594 * 24 * 1.25 / 4 = 4.46 Gbps
```

Для 2560x1440@60Hz, пиксельной частоты 297MHz и RGB888 оригинал приводит следующую формулу. В числителе по-прежнему 594; противоречие сохранено, а не исправлено без указания.

```text
bandwidth_per_lane = 594 * 24 * 1.25 / 4 = 2.23 Gbps
```

Для 1920x1080@60Hz, пиксельной частоты 148.5MHz и RGB888 оригинал приводит следующую формулу. В числителе снова 594 вместо указанной пиксельной частоты.

```text
bandwidth_per_lane = 594 * 24 * 1.25 / 4 = 1.12 Gbps
```

При максимальном соединении RK3576 с четырьмя линиями по 8.1Gbps и одновременных потоках 4096x2160@60Hz, 2560x1440@60Hz и 1920x1080@60Hz оригинал суммирует полосу на линию так:

```text
bandwidth_per_lane_total = 4.46 + 2.23 + 1.12 = 7.81 Gbps < 7.97 Gbps
```

Оригинал называет это максимальной возможностью трёх выходов RK3576 в MST.

### 4.6 Ограничения таймингов DP

В нестандартных разрешениях слишком короткий porch может препятствовать выводу. Описанный драйвер DP требует HBP не меньше 16 и HSYNC не меньше 9. Меньшие значения повышаются до поддерживаемого минимума.

### 4.7 Ограничения MST

#### 4.7.1 Ограничения возможностей

Максимальные возможности потоков DP RK3576:

| Канал потока DP | Максимальная ширина | Максимальная высота | Максимальная пиксельная частота |
| --- | --- | --- | --- |
| Stream-0 | 4096 | 2160 | 1188MHz |
| Stream-1 | 2560 | 1440 | 300MHz |
| Stream-2 | 1920 | 1080 | 150MHz |

Максимальные возможности каждого Video Port VOP RK3576:

| Video Port VOP | Максимальная ширина | Максимальная высота | Максимальная пиксельная частота |
| --- | --- | --- | --- |
| Video Port 0 | 4096 | 2160 | 1200MHz |
| Video Port 1 | 2560 | 1600 | 300MHz |
| Video Port 2 | 1920 | 1080 | 150MHz |

Для трёх независимых экранов с максимальными разрешениями, с учётом ограничений VOP и DP, рекомендуется Video Port0 -> DP Stream-0, Video Port1 -> DP Stream-1 и Video Port2 -> DP Stream-2. Конфигурация DTS:

```text
&dp0 {
   status = "okay";
};


&dp0_in_vp0 {
   status = "okay";
};

&dp0_in_vp1 {
   status = "disabled";
};

&dp0_in_vp2 {
   status = "disabled";
};


&dp1 {
   status = "okay";
};

&dp1_in_vp0 {
   status = "disabled";
};
&dp1_in_vp1 {
   status = "okay";
};


&dp1_in_vp2 {
   status = "disabled";
};

&dp2 {
   status = "okay";
};

&dp2_in_vp0 {
   status = "disabled";
};


&dp2_in_vp1 {
   status = "disabled";
};

&dp2_in_vp2 {
   status = "okay";
};
```

Для трёх дублирующих экранов через MST RK3576 максимум составляет 1920x1080@60Hz. Рекомендуются тракты Video Port2 -> DP Stream-0, Video Port2 -> DP Stream-1 и Video Port2 -> DP Stream-2:

```text
&dp0 {
   status = "okay";

};

&dp0_in_vp0 {
   status = "disabled";
};

&dp0_in_vp1 {
   status = "disabled";
};

&dp0_in_vp2 {
   status = "okay";
};


&dp1 {
   status = "okay";
};

&dp1_in_vp0 {
   status = "disabled";
};

&dp1_in_vp1 {
   status = "disabled";
};


&dp1_in_vp2 {
   status = "okay";
};

&dp2 {
   status = "okay";
};

&dp2_in_vp0 {
   status = "disabled";
};


&dp2_in_vp1 {
   status = "disabled";
};

&dp2_in_vp2 {
   status = "okay";
};
```

#### 4.7.2 Фильтрация разрешений

В Linux DRM MST Connector регистрируются динамически, а DP Stream-0/1/2 представлены тремя Encoder. При подключении Connector ещё неизвестно, какой Encoder будет использован. В конфигурации независимых экранов выше разрешение фильтруется лишь тогда, когда его не поддерживает ни один из трёх потоков:

![Схема фильтрации разрешений MST](/docs/rockchip-displayport/assets/en-p53-1.png)

Из-за разных возможностей потоков DP и Video Port VOP некоторые разрешения недоступны на отдельных трактах. Например, 3840x2160@60Hz не может нормально выводиться по Video Port2 -> DP Stream-2.

Поэтому приложение userspace должно ограничивать разрешения выбранного тракта, либо максимальное разрешение подключённого дисплея не должно превышать возможности DP Stream-2.

{% endraw %}
