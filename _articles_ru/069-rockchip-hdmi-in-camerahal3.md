---
title: "Rockchip HDMI IN и CameraHAL3: мост RK628D, настройка и диагностика"
description: "Полный путь от драйвера RK628D и CameraHAL3 до DTS, XML, EDID, APK и журналов; исходные примеры для проверки возможности адаптации к ArmSoM."
translation_key: "069-rockchip-hdmi-in-camerahal3"
slug: "069-rockchip-hdmi-in-camerahal3"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "HDMI IN", "CameraHAL3", "Android", "Linux"]
keywords: "ArmSoM Rockchip HDMI IN RK628D CameraHAL3"
excerpt: "Полный путь от драйвера RK628D и CameraHAL3 до DTS, XML, EDID, APK и журналов; исходные примеры для проверки возможности адаптации к ArmSoM."
---

{% raw %}

# Rockchip HDMI IN и CameraHAL3: мост RK628D, настройка и диагностика

Это справочный материал Rockchip, а не руководство, испытанное на оборудовании ArmSoM. Примеры, журналы, задержки и заявленная поддержка относятся к оригиналу. Перед адаптацией проверьте SoC, вывод HDMI-входа на плате, мост и разводку, тактирование и питание, SDK/BSP, ядро и Android HAL. Поддержка всех плат не подразумевается. Предоставлен только китайский PDF; английская и русская версии полностью переводят технический текст и используют китайские исходные рисунки. Надписи внутри изображений не выдаются за английские. Код и исходные комментарии сохранены. Команды прошивки, регистров, прав доступа и SELinux не выполнялись.

Техническая версия оригинала: V1.1.0. Оригинал использует RK628D и Android 9.0 и описывает горячее подключение и адаптивные разрешения 4KP30, 1080P60, 720P60, 576P50 и 480P60. Таблица передаёт область исходника, а не проверку всех сочетаний.

| Платформа | Ядро | Android |
| --- | --- | --- |
| RK3288 / RK3326 / RK3368 / RK3399 / RK3566 / RK3568 | Linux 4.4 / 4.19 | 9.0 / 10.0 / 11.0 |

[Редакционные замечания](/docs/rockchip-hdmi-in-camerahal3/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Код драйверов HDMI IN

### 1.1 Реализация HDMI IN с RK628D

![Блок-схема RK AP и RK628D — китайский PDF, стр. 4](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p4-1.png)

Блок-схема RK AP и RK628D — китайский PDF, стр. 4

RK628D является устройством MFD и включает драйвер MFD и драйверы отдельных интерфейсных модулей. Тракт RK628D HDMI RX — MIPI CSI TX используется для HDMI IN: RK628D рассматривается как устройство, подобное камере, с драйверами на основе V4L2. Поскольку этот подход отличается от подсистемы отображения DRM, повторно используются только драйверы COMBRXPHY и COMBTXPHY; HDMI RX Controller, Post Process и MIPI CSI TX заново реализованы в V4L2.

Соответствующий код драйверов:

```text
drivers/mfd/rk628.c


drivers/gpu/drm/rockchip/rk628/rk628_combrxphy.c

drivers/gpu/drm/rockchip/rk628/rk628_combtxphy.c

drivers/media/i2c/rk628_csi.c
```

Конфигурация ядра:

```text
CONFIG_MFD_RK628=y

CONFIG_VIDEO_RK628_CSI=y


CONFIG_DRM_ROCKCHIP_RK628=y
```

### 1.2 Реализация HDMI IN с другими мостами

Другие мосты не используют драйвер MFD: для них реализуются драйверы устройств I2C на основе V4L2. Примеры: TC358743, TC358749 и LT6911UXC.

Соответствующий код драйверов:

```text
drivers/media/i2c/tc35874x.c


drivers/media/i2c/lt6911uxc.c
```

Конфигурация ядра:

```text
CONFIG_VIDEO_TC35874X=y

CONFIG_VIDEO_LT6911UXC=y
```

## 2. Подсистема видео HDMI IN

В реализации видео HDMI IN RK628D представлен как устройство MIPI SoC camera. Видеоданные принимаются через подсистему камеры и отображаются в APK. Для сценариев HDMI IN дополнительно реализованы обработка горячего подключения и автоматическая адаптация к входному разрешению.

### 2.1 Последовательность работы APK HDMI IN

![Рабочий процесс APK — китайский PDF, стр. 6](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p6-1.png)

Рабочий процесс APK — китайский PDF, стр. 6

### 2.2 Архитектура драйвера RK628D

В драйвере RK628D следует уделить внимание трём основным частям: инициализации, обработке прерываний горячего подключения и обработке прерываний изменения разрешения. См. следующие блок-схемы.

![Подключение в драйвере — китайский PDF, стр. 8](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p8-2.png)

Подключение в драйвере — китайский PDF, стр. 8

![Инициализация драйвера — китайский PDF, стр. 8](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p8-1.png)

Инициализация драйвера — китайский PDF, стр. 8

![Смена разрешения — китайский PDF, стр. 9](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p9-1.png)

Смена разрешения — китайский PDF, стр. 9

## 3. Настройка

Для HDMI IN необходимо обновить SDK как минимум до указанной версии и привести настройки платы в соответствие с фактическими аппаратными соединениями.

### 3.1 Требования к коду SDK

Примечание: идентификаторы коммитов могут отличаться.

Код kernel/ должен содержать следующие коммиты:

```text
git log drivers/gpu/drm/rockchip/rk628/
```

![История коммитов RK628 DRM — китайский PDF, стр. 10](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p10-1.png)

История коммитов RK628 DRM — китайский PDF, стр. 10

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
wendingxian@ubuntu:~/rk3288_9.0_int/kernel$ git log drivers/gpu/drm/rockchip/rk628/
commit 2420e34afd4dbd0045e13222165b159bb62df151
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Wed Apr 21 10:19:19 2021 +0800

    drm: rockchip: rk628: the combrxphy cable mode wait for clk to stabilize

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: I7502b8f71f4fcc376a925045adbe6148ebdc2d3f

commit 403cf034772cd268eb6554f577d98462c007a90f
Author: Shunqing Chen <csq@rock-chips.com>
Date:   Wed Apr 7 09:10:10 2021 +0800

    drm: rockchip: rk628: post_process: recalculate dst clock

    Signed-off-by: Shunqing Chen <csq@rock-chips.com>
    Change-Id: I93388ba499f0d74c5f5c549decc83f3225ae1b82

commit 71d16a0f377366d398af6b4f2ea7f53b4fbaf91b
Author: Guochun Huang <hero.huang@rock-chips.com>
Date:   Thu Jan 7 16:15:30 2021 +0800

    drm/rockchip/rk628: fix no_connector found when find_connector_by_bridge

    Change-Id: Id530565a1165957ffc1cb4604fe9a14fe7537ed5
    Signed-off-by: Guochun Huang <hero.huang@rock-chips.com>

commit 744285a44b5bdf864cad77dd18450c8ec0a1129e
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Mon Dec 14 15:25:19 2020 +0800

    drm: rockchip: rk628: add rk628 combrx-phy support for HDMIRX cable mode

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: I4c02fb6add7cce5fef8a52853c35f113b53040ff
```

```text
git log drivers/media/i2c/rk628_csi.c
```

![Коммиты драйвера RK628 CSI — китайский PDF, стр. 11](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p11-1.png)

Коммиты драйвера RK628 CSI — китайский PDF, стр. 11

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
wendingxian@ubuntu:~/rk3288_9.0_int/kernel$ git log drivers/media/i2c/rk628_csi.c
commit 57edf24f52778f6eafad004bc70bd1f71525a28c (HEAD -> develop-4.4)
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Wed Apr 28 16:25:13 2021 +0800

    media: i2c: rk628csi: upgrade the driver version to v0.0.3

    Modify RK628_CSI_PIXEL_RATE_LOW to 400M.

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: I024a0c24f7e61e9314e9e6f24c78f24ec403e4e4

commit ed3d2ca11c2e0635b423d24977cdab6894e90400
Author: Shunhua Lan <lsh@rock-chips.com>
Date:   Sun Apr 25 18:48:28 2021 +0800

    media: i2c: rk628csi: fix mask for clkrate and fs audio align to 100

    Signed-off-by: Shunhua Lan <lsh@rock-chips.com>
    Change-Id: I15b290319463f1b41e6908e54caa99ef9c6db4f4

commit 2ac8d31dbbcfa7cd0b43d20834cd31341c6da7be
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Wed Apr 21 15:14:20 2021 +0800

    media: i2c: rk628csi: upgrade the driver version to v0.0.2

    1.The hpd effective level can be configured to be inverted, when the hpd
    output circuit is reversed.
```

Код hardware/rockchip/camera/ должен содержать следующий коммит:

![Коммит конфигурации CameraHAL — китайский PDF, стр. 11](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p11-2.png)

Коммит конфигурации CameraHAL — китайский PDF, стр. 11

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
commit 4bd9632ed59261e8fc43057b7545cedcde2d927a
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Tue Apr 27 21:16:59 2021 +0800

    Add rk628 configuration for each platform

    include:
    camera3_profiles_rk3288.xml
    camera3_profiles_rk3326.xml
    camera3_profiles_rk3368.xml
    camera3_profiles_rk3399.xml
    camera3_profiles_rk3399pro.xml
    camera3_profiles_rk356x.xml

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: I8d13feca46739df37f7f01e3a02014106ee8e48c
```

Код device/rockchip/common/ должен содержать следующий коммит:

![Коммит прав устройства — китайский PDF, стр. 11](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p11-3.png)

Коммит прав устройства — китайский PDF, стр. 11

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
commit 17112e1430b0f10a88b57c73ad19203e58f0eeff (HEAD -> mid_9.0, rk/rk
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Tue Apr 27 21:26:48 2021 +0800

    ueventd.rockchip.rc: modify the /dev/v4l-subdev* permission to 666

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: Id4848209fd983f7e525761f19c7f0420b9fee747
```

Код RKDocs/common/ должен содержать следующий коммит:

![Коммит APK в RKDocs — китайский PDF, стр. 12](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p12-1.png)

Коммит APK в RKDocs — китайский PDF, стр. 12

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
commit b1a130c7759b7f8588931acc82d5d9b88b38af45 (HEAD -> rk
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Fri May 7 17:27:12 2021 +0800

    add hdmi-in apk based on camerahal3

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: I0dc677d4e0f4bb39fc693bdea73a2eb8a4087935
```

### 3.2 Настройка платы

SDK содержит конфигурацию DTS для RK3288 RK628D EVB. В качестве примера используйте следующий файл:

```text
arch/arm/boot/dts/rk3288-evb-rk628-hdmi2csi-avb.dts
```

#### 3.2.1 Функциональные модули

Для HDMI IN на RK628D требуются COMBRXPHY, COMBTXPHY и CSI; включите эти модули отдельно в DTS. Остальные неупомянутые модули оставьте в состоянии по умолчанию из rk628.dtsi: включать их не требуется. В частности, rk628_post_process, rk628_hdmi и rk628_hdmirx относятся к трактам отображения RK628D и для данного сценария HDMI IN не включаются.

```text
&rk628_combrxphy {
      status = "okay";
};


&rk628_combtxphy {
      status = "okay";
};

&rk628_csi {
      status = "okay";
...
```

#### 3.2.2 Аппаратные соединения

RK628D является устройством I2C и должен быть размещён под соответствующей шиной I2C. Основные настройки соединений показаны ниже:

```text
&i2c1 {
      clock-frequency = <400000>;
      status = "okay";


      rk628: rk628@50 {
           reg = <0x50>;
           interrupt-parent = <&gpio7>;
           interrupts = <15 IRQ_TYPE_LEVEL_HIGH>;
           enable-gpios = <&gpio5 RK_PC2 GPIO_ACTIVE_HIGH>;
           reset-gpios = <&gpio7 RK_PB6 GPIO_ACTIVE_LOW>;
           status = "okay";
      };
};
```

reg: адрес I2C. Типовой 7-битный адрес RK628D — 0x50. При использовании нескольких RK628D их адреса I2C можно изменить посредством GPIO, как показано ниже:

![Адрес ведомого I2C и GPIO — китайский PDF, стр. 13](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p13-1.png)

Адрес ведомого I2C и GPIO — китайский PDF, стр. 13

Адрес I2C состоит из 7 бит: старшие четыре обозначают устройство (4b’1010), младшие три задают адрес и программируются через GPIO. Типичный адрес ведомого — 7’b1010000. Текст рисунка ссылается на таблицу 5-1, но заголовок указывает 5-2; отображение сохранено.

| Addr bit | Pad Name | GPIO Setting |
| --- | --- | --- |
| cfg_slvadr[2] | IO_GPIO0a1 | GPIO0A_OE[1]=1’b1 |
| cfg_slvadr[1] | IO_GPIO0a0 | GPIO0A_OE[0]=1’b1 |
| cfg_slvadr[0] | IO_GPIO3b3 | GPIO3B_OE[2]=1’b1 |

interrupt-parent / interrupts: GPIO, подключённый к сигналу прерывания RK628D.

enable-gpios: GPIO управления питанием RK628D; при постоянном питании его можно не задавать.

reset-gpios: GPIO управления сбросом RK628D.

Модуль RK628_CSI также требует настройки аппаратных соединений:

```text
&rk628_csi {
      status = "okay";
      /*

      * If the hpd output level is inverted on the circuit,
      * the following configuration needs to be enabled.
      */
      /* hpd-output-inverted; */
      plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
      power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
...
```

hpd-output-inverted: инверсия выхода HPD. Включите параметр, если схема инвертирует выходной уровень HPD.

![Схема HPD — китайский PDF, стр. 14](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p14-1.png)

Схема HPD — китайский PDF, стр. 14

plugin-det-gpios: GPIO обнаружения подключения HDMI. Проверьте, инвертирует ли схема уровень, и правильно задайте активный уровень.

![Схема обнаружения подключения — китайский PDF, стр. 14](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p14-2.png)

Схема обнаружения подключения — китайский PDF, стр. 14

power-gpios: GPIO управления питанием домена MIPI RX ведущего SoC Rockchip; при постоянном питании его можно не задавать.

#### 3.2.3 Настройка тракта приёма изображения в DTS

RK628D, TC35874x, LT6911 и аналогичные мосты рассматриваются как устройства, подобные камере. Как и датчикам камеры, им нужен драйвер на основе V4L2. Тракт данных настраивается так же, как для MIPI SoC sensor.

Пример для RK3288: тракт rk628 + isp1:

```text
&rk628_csi {
   status = "okay";
   /*

   * If the hpd output level is inverted on the circuit,
   * the following configuration needs to be enabled.
   */
   /* hpd-output-inverted; */
   plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
   power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
   rockchip,camera-module-index = <0>;
   rockchip,camera-module-facing = "back";
   rockchip,camera-module-name = "RK628-CSI";
   rockchip,camera-module-lens-name = "NC";

   port {

      hdmiin_out0: endpoint {
         remote-endpoint = <&mipi_in>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&mipi_phy_rx0 {
   status = "okay";

   ports {
      #address-cells = <1>;

      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&hdmiin_out0>;
            data-lanes = <1 2 3 4>;
         };
      };


      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         dphy_rx_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&isp_mipi_in>;
         };
      };
   };

};

&rkisp1 {
   status = "okay";
   port {
      #address-cells = <1>;
      #size-cells = <0>;

      isp_mipi_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dphy_rx_out>;
      };
   };

};

&isp_mmu {
```

```text
   rockchip,camera-module-lens-name = "NC";

   port {

      hdmiin_out0: endpoint {
         remote-endpoint = <&mipi_in>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&mipi_phy_rx0 {
   status = "okay";

   ports {
      #address-cells = <1>;

      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_in: endpoint@1 {
           reg = <1>;
           remote-endpoint = <&hdmiin_out0>;
           data-lanes = <1 2 3 4>;
         };
      };


      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         dphy_rx_out: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&isp_mipi_in>;
         };
      };
   };

};

&rkisp1 {
   status = "okay";
   port {
      #address-cells = <1>;
      #size-cells = <0>;

      isp_mipi_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dphy_rx_out>;
      };
   };

};

&isp_mmu {
   status = "okay";
};
```

Пример для RK356x: тракт rk628 + isp2:

```text
&rk628_csi {
   status = "okay";

   /*
   * If the hpd output level is inverted on the circuit,
   * the following configuration needs to be enabled.
   */
   /* hpd-output-inverted; */
   plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
   power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
   rockchip,camera-module-index = <0>;
   rockchip,camera-module-facing = "back";
   rockchip,camera-module-name = "RK628-CSI";
   rockchip,camera-module-lens-name = "NC";

   port {

      hdmiin_out0: endpoint {
         remote-endpoint = <&mipi_in>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&csi2_dphy_hw {
   status = "okay";
};

&csi2_dphy0 {

   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_in: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&hdmiin_out0>;

           data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         csidphy0_out: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&isp0_in>;
         };
      };

   };
};

&rkisp {
   status = "okay";
};

&rkisp_mmu {
   status = "okay";
};

&rkisp_vir0 {

   status = "okay";

   port {
      #address-cells = <1>;
      #size-cells = <0>;

      isp0_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&csidphy0_out>;
      };
   };
};
```

Пример для RK356x: тракт rk628 + vicap:

```text
&rk628_csi {
   status = "okay";

   /*
   * If the hpd output level is inverted on the circuit,
   * the following configuration needs to be enabled.
   */
   /* hpd-output-inverted; */
   plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
   power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
   rockchip,camera-module-index = <0>;
   rockchip,camera-module-facing = "back";
   rockchip,camera-module-name = "RK628-CSI";
   rockchip,camera-module-lens-name = "NC";

   port {

      hdmiin_out0: endpoint {
         remote-endpoint = <&mipi_in>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&csi2_dphy_hw {
   status = "okay";
};
&csi2_dphy0 {
   status = "okay";


   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_in: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&hdmiin_out0>;

            data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         csidphy0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&mipi_csi2_input>;
            data-lanes = <1 2 3 4>;
         };

      };
   };
};

&mipi_csi2 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {

         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_csi2_input: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&csidphy0_out>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;

         #address-cells = <1>;
         #size-cells = <0>;
```

```text
&csi2_dphy0 {
   status = "okay";


   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_in: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&hdmiin_out0>;

           data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         csidphy0_out: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&mipi_csi2_input>;
           data-lanes = <1 2 3 4>;
         };

      };
   };
};

&mipi_csi2 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {

         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_csi2_input: endpoint@1 {
           reg = <1>;
           remote-endpoint = <&csidphy0_out>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;

         #address-cells = <1>;
         #size-cells = <0>;
         mipi_csi2_output: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&cif_mipi_in>;

           data-lanes = <1 2 3 4>;
         };
      };
   };
};

&rkcif {
   status = "okay";
};

&rkcif_mipi_lvds {
   status = "okay";


   port {
      cif_mipi_in: endpoint {
         remote-endpoint = <&mipi_csi2_output>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&rkcif_mmu {
   status = "okay";
};
```

### 3.3 Настройка camera3_profiles.xml

camera3_profiles.xml соответствует файлу конкретной платформы в SDK:

```text
hardware/rockchip/camera/etc/camera/camera3_profiles_rk3xxx.xml
```

Основные замечания по настройке перечислены ниже. Подробности см. в процедуре настройки SoC sensor.

name: должно совпадать с именем драйвера с учётом регистра.

moduleId: должен совпадать с index в DTS драйвера.

![XML профиля камеры — китайский PDF, стр. 19](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p19-1.png)

XML профиля камеры — китайский PDF, стр. 19

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
</Profiles>
<Profiles cameraId="0" name="rk628-csi" moduleId="m00">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
```

![Индекс модуля DTS — китайский PDF, стр. 20](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p20-1.png)

Индекс модуля DTS — китайский PDF, стр. 20

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
&rk628_csi {
    status = "okay";
    /*
     * If the hpd output level is inverted on the circuit,
     * the following configuration needs to be enabled.
     */
    /* hpd-output-inverted; */
    plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
    power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
    rockchip,camera-module-index = <0>;
    rockchip,camera-module-facing = "back";
    rockchip,camera-module-name = "RK628-CSI";
    rockchip,camera-module-lens-name = "NC";
```

scaler.availableStreamConfigurations / scaler.availableMinFrameDurations / scaler.availableStallDurations: правильно задайте поддерживаемые драйвером разрешения и минимальные интервалы кадров. При добавлении нового разрешения в драйвер добавьте соответствующую настройку и здесь.

![Разрешения и длительности кадров XML — китайский PDF, стр. 20](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p20-2.png)

Разрешения и длительности кадров XML — китайский PDF, стр. 20

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
<scaler.availableStreamConfigurations value="BLOB,3840x2160,OUTPUT,
    BLOB,1920x1080,OUTPUT,
    BLOB,1280x720,OUTPUT,
    BLOB,720x576,OUTPUT,
    BLOB,720x480,OUTPUT,
    YCbCr_420_888,3840x2160,OUTPUT,
    YCbCr_420_888,1920x1080,OUTPUT,
    YCbCr_420_888,1280x720,OUTPUT,
    YCbCr_420_888,720x576,OUTPUT,
    YCbCr_420_888,720x480,OUTPUT,
    IMPLEMENTATION_DEFINED,3840x2160,OUTPUT,
    IMPLEMENTATION_DEFINED,1920x1080,OUTPUT,
    IMPLEMENTATION_DEFINED,1280x720,OUTPUT,
    IMPLEMENTATION_DEFINED,720x576,OUTPUT,
    IMPLEMENTATION_DEFINED,720x480,OUTPUT" />
<scaler.availableMinFrameDurations value="BLOB,3840x2160,33333333,
    BLOB,1920x1080,16666667,
    BLOB,1280x720,16666667,
    BLOB,720x576,20000000,
    BLOB,720x480,16666667,
    YCbCr_420_888,3840x2160,33333333,
    YCbCr_420_888,1920x1080,16666667,
    YCbCr_420_888,1280x720,16666667,
    YCbCr_420_888,720x576,20000000,
    YCbCr_420_888,720x480,16666667,
    IMPLEMENTATION_DEFINED,3840x2160,33333333,
    IMPLEMENTATION_DEFINED,1920x1080,16666667,
    IMPLEMENTATION_DEFINED,1280x720,16666667,
    IMPLEMENTATION_DEFINED,720x576,20000000,
    IMPLEMENTATION_DEFINED,720x480,16666667"/>
<scaler.availableStallDurations value="BLOB,3840x2160,33333333,
    BLOB,1920x1080,16666667,
    BLOB,1280x720,16666667,
    BLOB,720x576,20000000,
    BLOB,720x480,16666667"/>
```

sensor.orientation: угол поворота изображения; поддерживаются значения 0, 90, 180 и 270.

![XML ориентации сенсора — китайский PDF, стр. 21](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p21-1.png)

XML ориентации сенсора — китайский PDF, стр. 21

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
<sensor.maxAnalogSensitivity value="2400"/>
<sensor.orientation value="0"/>
<sensor.profileHueSatMapDimensions value="0,0,0"/>
```

### 3.4 Возможности приёма разных платформ

Максимальные возможности приёма изображения различаются из-за разной производительности ISP/VICAP на разных платформах. См. таблицу исходного документа:

| Платформа | Приёмник | Максимальное разрешение |
| --- | --- | --- |
| RK3288/RK3326/RK3368 | isp | 1920x1080P60 |
| RK3399 | isp | 3840x2160P30 (требуется разгон ISP) |
| RK3566/RK3568 | vicap/isp | 3840x2160P30 |

#### 3.4.1 Настройка разгона ISP на RK3399

Настройте PLL_NPLL на 650M:

```text
--- a/arch/arm64/boot/dts/rockchip/rk3399-vop-clk-set.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399-vop-clk-set.dtsi

@@ -148,7 +148,7 @@
                  <50000000>, <100000000>,
                  <75000000>, <75000000>,
                  <816000000>, <816000000>,
-                 <600000000>, <200000000>,
+                 <650000000>, <200000000>,
                  <800000000>, <150000000>,
                  <75000000>, <37500000>,
                  <300000000>, <100000000>,
```

Измените максимальную поддерживаемую частоту ISP RK3399 на 650M:

```text
--- a/drivers/media/platform/rockchip/isp1/dev.c
+++ b/drivers/media/platform/rockchip/isp1/dev.c
@@ -757,7 +757,7 @@ static const unsigned int rk3368_isp_clk_rate[] = {


 /* isp clock adjustment table (MHz) */
 static const unsigned int rk3399_isp_clk_rate[] = {
-     300, 400, 600
+     300, 400, 650
 };

 static struct isp_irqs_data rk1808_isp_irqs[] = {
```

Настройте частоту ISP в драйвере микросхемы моста:

```text
#define RK628_CSI_PIXEL_RATE_HIGH 600000000
...


static int rk628_csi_set_fmt(struct v4l2_subdev *sd,
           struct v4l2_subdev_pad_config *cfg,
           struct v4l2_subdev_format *format)
{
...
      if ((mode->width == 3840) && (mode->height == 2160)) {
           v4l2_dbg(1, debug, sd,
                 "%s res wxh:%dx%d, link freq:%llu, pixrate:%u\n",
                 __func__, mode->width, mode->height,
                 link_freq_menu_items[1], RK628_CSI_PIXEL_RATE_HIGH);
           __v4l2_ctrl_s_ctrl(csi->link_freq, 1);
           __v4l2_ctrl_s_ctrl_int64(csi->pixel_rate,

                 RK628_CSI_PIXEL_RATE_HIGH);
      }
...
}
```

Драйвер ISP добавляет к заданной частоте ещё 25% запаса, поэтому задайте подходящее значение RK628_CSI_PIXEL_RATE_HIGH в драйвере.

```text
drivers/media/platform/rockchip/isp1/dev.c


static int __isp_pipeline_s_isp_clk(struct rkisp1_pipeline *p)
{
...
      ctrl = v4l2_ctrl_find(sd->ctrl_handler, V4L2_CID_PIXEL_RATE);
      if (!ctrl) {
           v4l2_warn(sd, "No pixel rate control in subdev\n");
           return -EPIPE;
      }

      /* calculate data rate */
      data_rate = v4l2_ctrl_g_ctrl_int64(ctrl) *
              dev->isp_sdev.in_fmt.bus_width;
      data_rate >>= 3;

      do_div(data_rate, 1000 * 1000);

      /* increase 25% margin */
      data_rate += data_rate >> 2;
...
}
```

#### 3.4.2 Настройка ISP для использования памяти CMA

При приёме изображений HDMI IN на некоторых платформах фактическая загрузка системы может привести к нехватке пропускной способности, пропускам кадров или ошибкам приёма MIPI. Пример журнала ошибки:

```text
[ 228.999567] rkisp1: MIPI mis error: 0x00800000
[ 228.999925] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 228.999976] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:

CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000081] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000187] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000294] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
```

В таком случае увеличьте частоту DDR. Если улучшения нет, зарезервируйте память CMA для ISP:

Зарезервируйте 128 МБ памяти CMA в rockchip_defconfig:

```text
CONFIG_CMA=y
CONFIG_CMA_SIZE_MBYTES=128
```

Отключите IOMMU ISP в DTS, чтобы ISP использовал память CMA:

```text
&isp_mmu {
      status = "disabled";

};
```

### 3.5 Настройка EDID

RK628D поддерживает настраиваемый EDID. EDID драйвера, описанного в исходнике, поддерживает следующие разрешения:

3840x2160P30, 1920x1080P60, 1920x1080P30, 1280x720P60, 720x576P50, 720x480P60.

Для изменения поддерживаемых разрешений измените EDID непосредственно в коде драйвера:

```text
drivers/media/i2c/rk628_csi.c

static u8 edid_init_data[] = {

      0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
      0x52, 0x62, 0x01, 0x88, 0x00, 0x88, 0x88, 0x88,
      0x1C, 0x15, 0x01, 0x03, 0x80, 0x00, 0x00, 0x78,
      0x0A, 0x0D, 0xC9, 0xA0, 0x57, 0x47, 0x98, 0x27,
      0x12, 0x48, 0x4C, 0x00, 0x00, 0x00, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x02, 0x3A,
      0x80, 0x18, 0x71, 0x38, 0x2D, 0x40, 0x58, 0x2C,
      0x45, 0x00, 0xC4, 0x8E, 0x21, 0x00, 0x00, 0x1E,
      0x01, 0x1D, 0x00, 0x72, 0x51, 0xD0, 0x1E, 0x20,
      0x6E, 0x28, 0x55, 0x00, 0xC4, 0x8E, 0x21, 0x00,
      0x00, 0x1E, 0x00, 0x00, 0x00, 0xFC, 0x00, 0x54,
      0x37, 0x34, 0x39, 0x2D, 0x66, 0x48, 0x44, 0x37,

      0x32, 0x30, 0x0A, 0x20, 0x00, 0x00, 0x00, 0xFD,
      0x00, 0x14, 0x78, 0x01, 0xFF, 0x1D, 0x00, 0x0A,
      0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x01, 0x7B,

      0x02, 0x03, 0x1A, 0x71, 0x47, 0x5F, 0x90, 0x22,
   0x04, 0x11, 0x02, 0x01, 0x23, 0x09, 0x07, 0x01,
...
```

## 4. Адаптация APK HDMI IN

### 4.1 Получение и сборка исходного кода APK

Исходный код APK находится в каталоге SDK:

```text
RKDocs/common/hdmi-in/apk/rkCamera2_based_on_CameraHal3_V1.3.tar.gz
```

Скопируйте и распакуйте исходный код в:

```text
packages/apps/
```

Для RK3288 внесите аналогичные следующим изменения в device/rockchip/rk3288/, чтобы включить APK rkCamera2 в сборку:

```text
diff --git a/device.mk b/device.mk
index 6667b5c..96f08f1 100644
--- a/device.mk

+++ b/device.mk
@@ -17,7 +17,8 @@
 PRODUCT_PACKAGES += \
   memtrack.$(TARGET_BOARD_PLATFORM) \
   WallpaperPicker \
-  Launcher3
+  Launcher3 \
+  rkCamera2

 #$_rbox_$_modify_$_zhengyang: add displayd
 PRODUCT_PACKAGES += \
```

### 4.2 Адаптация исходного кода APK

APK обращается к узлу устройства RK628D через ioctl для получения текущего состояния подключения и разрешения. Узел RK628D может отличаться в трактах isp1, isp2 и vicap. Измените исходный код APK согласно фактической конфигурации. Определение узла описано в примерах отладочных команд.

```text
rkCamera2/jni/native.cpp
```

![Пример открытия устройства C++ — китайский PDF, стр. 25](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p25-1.png)

Пример открытия устройства C++ — китайский PDF, стр. 25

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
static void openDevice(JNIEnv *env, jobject thiz)
{
    (void)*env;
    (void)thiz;

    char video_name[64];
    memset(video_name, 0, sizeof(video_name));
    strcat(video_name, "/dev/v4l-subdev2");

    camFd = open(video_name, O_RDWR);
    if (camFd < 0) {
        LOGE("open %s failed,erro=%s",video_name,strerror(errno));
    } else {
        LOGD("open %s success,fd=%d",video_name,camFd);
    }
}
```

Код получения текущего состояния подключения и разрешения показан ниже:

![Запрос сигнала и формата C++ — китайский PDF, стр. 25](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p25-2.png)

Запрос сигнала и формата C++ — китайский PDF, стр. 25

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
static void getDeviceFormat(int *format)
{
    struct v4l2_control control;
    memset(&control, 0, sizeof(struct v4l2_control));
    control.id = V4L2_CID_DV_RX_POWER_PRESENT;
    int err = ioctl(camFd, VIDIOC_G_CTRL, &control);
    if (err < 0) {
        LOGV("Set POWER_PRESENT failed ,%d(%s)", errno, strerror(errno));
    }

    unsigned int noSignalAndSync = 0;
    ioctl(camFd, VIDIOC_G_INPUT, &noSignalAndSync);
    LOGV("noSignalAndSync ? %s",noSignalAndSync?"YES":"NO");

    struct v4l2_dv_timings dv_timings;
    memset(&dv_timings, 0, sizeof(struct v4l2_dv_timings));
    err = ioctl(camFd, VIDIOC_SUBDEV_QUERY_DV_TIMINGS, &dv_timings);
    if (err < 0) {
        LOGV("Set VIDIOC_SUBDEV_QUERY_DV_TIMINGS failed ,%d(%s)", errno, strerror(errno));
    }

    format[0] = dv_timings.bt.width;
    format[1] = dv_timings.bt.height;
    format[2] = control.value && !noSignalAndSync;
}
```

Поскольку APK обращается к узлу устройства, исходник предлагает проверить отключение SELinux командой getenforce. На снимке показан переход в permissive. Это отладочная процедура исходника, а не рекомендация отключать защиту в рабочей системе.

![Пример диагностики SELinux — китайский PDF, стр. 25](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p25-3.png)

Пример диагностики SELinux — китайский PDF, стр. 25

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
rk3288:/ # getenforce
Enforcing
rk3288:/ # setenforce 0
rk3288:/ #
rk3288:/ # getenforce
Permissive
```

### 4.3 Подготовка к отладке APK

Сначала завершите отладку драйвера согласно соответствующему разделу. Затем следующей командой проверьте правильность регистрации устройства камеры в CameraHal. Если регистрация неверна, проверьте camera3_profiles.xml согласно разделу его настройки.

![Состояние Camera service — китайский PDF, стр. 26](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p26-1.png)

Состояние Camera service — китайский PDF, стр. 26

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
rk3288:/ #
rk3288:/ # dumpsys media.camera

== Service global info: ==

Number of camera devices: 1
Number of normal camera devices: 1
    Device 0 maps to "0"
Active Camera Clients:
[]
Allowed user IDs: 0

== Camera service events log (most recent at top): ==
  04-08 11:08:31 : USER_SWITCH previous allowed user IDs: <None>, current allowed user IDs: 0
  01-18 08:50:15 : ADD device 0, reason: (Device status changed from 0 to 1)
  01-18 08:50:15 : ADD device 0, reason: (Device added)
```

## 5. Отладка драйвера

Отладка выполняется так же, как для SoC sensor. Для дополнительных сведений исходник ссылается на следующий документ Redmine:

https://redmine.rock-chips.com/documents/53

### 5.1 Получение средств отладки

Требуются media-ctl и v4l2-ctl. Описанный в исходнике SDK автоматически копирует их в прошивку при сборке; они находятся в каталоге:

```text
hardware/rockchip/camera/etc/tools/
```

Для более старых версий SDK получите их из Redmine:

https://redmine.rock-chips.com/documents/104

Скопируйте media-ctl и v4l2-ctl в /vendor/bin/ устройства с помощью adb push.

### 5.2 Примеры отладочных команд

Следующий пример использует RK3288 + RK628D для приёма 1920x1080P. Изменяйте команды согласно фактической конфигурации.

Просмотр топологии тракта:

Выполните команду просмотра топологии узла media. В зависимости от платформы и тракта это может быть /dev/media0 или /dev/media1.

```text
media-ctl -d /dev/media0 –p
```

Следующий фрагмент RK628D показывает узел /dev/v4l-subdev2 и определённое входное разрешение HDMI IN 1920x1080.

```text
...
- entity 8: m00_b_rk628-csi rk628-csi (1 pad, 1 link)
         type V4L2 subdev subtype Sensor

         device node name /dev/v4l-subdev2
      pad0: Source
           [fmt:UYVY2X8/1920x1080]
           -> "rockchip-mipi-dphy-rx":0 [ENABLED]
...
```

Настройка связей тракта:

После сброса и загрузки связи включены по умолчанию. Открытие APK HDMI IN и последующий выход разрывают связи. Восстанавливайте их только при отсутствии [ENABLED] в выводе топологии.

```text
media-ctl -d /dev/media0 -l \
'"m00_b_rk628-csi rk628-csi":0->"rockchip-mipi-dphy-rx":0 [1]'

media-ctl -d /dev/media0 -l \
'"rockchip-mipi-dphy-rx":1->"rkisp1-isp-subdev":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-input-params":0->"rkisp1-isp-subdev":1 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":2->"rkisp1_mainpath":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":2->"rkisp1_selfpath":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":3->"rkisp1-statistics":0 [1]'
```

Настройка разрешения:

```text
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":0[fmt:UYVY2X8/1920x1080]'
media-ctl -d /dev/media0 \

--set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/1920x1080]'
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":2[fmt:UYVY2X8/1920x1080]'
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/1920x1080]'
```

Получение потока изображения:

Проверка результата настройки:

```text
media-ctl -d /dev/media0 –p
```

Получение потока изображения:

```text
v4l2-ctl --verbose -d /dev/video0 \
--set-fmt-video=width=1920,height=1080,pixelformat='NV12' \
--stream-mmap=4 \

--set-selection=target=crop,flags=0,top=0,left=0,width=1920,height=1080
```

Сохраните файл изображения YUV; получите его командой adb pull и просмотрите, например, в 7yuv:

```text
v4l2-ctl --verbose -d /dev/video0 \
--set-fmt-video=width=1920,height=1080,pixelformat='NV12' \
--stream-mmap=4 --stream-skip=5 --stream-count=10 \

--stream-to=/data/rk628_1920x1080.yuv --stream-poll
```

Если приём работает нормально, в выводе отображается частота кадров. Пример журнала:

```text
VIDIOC_QUERYCAP: ok
VIDIOC_G_FMT: ok
VIDIOC_S_FMT: ok

Format Video Capture Multiplanar:
      Width/Height : 1920/1080
      Pixel Format : 'NV12'
      Field        : None
      Number of planes : 1
      Flags        :
      Colorspace   : Default
      Transfer Function : Default
      YCbCr Encoding : Default
      Quantization : Full Range
      Plane 0      :
        Bytes per Line : 1920
        Size Image : 3110400

VIDIOC_G_SELECTION: ok
VIDIOC_S_SELECTION: ok
VIDIOC_REQBUFS: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok

VIDIOC_STREAMON: ok
idx: 0 seq: 0 bytesused: 3110400 ts: 131.560377
idx: 1 seq: 1 bytesused: 3110400 ts: 131.577023 delta: 16.646 ms
idx: 2 seq: 2 bytesused: 3110400 ts: 131.593697 delta: 16.674 ms
idx: 3 seq: 3 bytesused: 3110400 ts: 131.610363 delta: 16.666 ms
idx: 0 seq: 4 bytesused: 3110400 ts: 131.627033 delta: 16.670 ms fps: 60.01
idx: 1 seq: 5 bytesused: 3110400 ts: 131.643721 delta: 16.688 ms fps: 59.99
idx: 2 seq: 6 bytesused: 3110400 ts: 131.660390 delta: 16.669 ms fps: 59.99
idx: 3 seq: 7 bytesused: 3110400 ts: 131.677058 delta: 16.668 ms fps: 59.99
```

## 6. Поиск неисправностей

### 6.1 Включение журналирования

Включите журналирование RK628D следующей командой, затем получите журнал ядра. В исходнике команда написана demsg; проверьте dmesg в целевой системе.

```text
echo 1 > /sys/module/rk628_csi/parameters/debug
```

Для получения журнала с момента включения и загрузки исходник рекомендует изменить код, пересобрать и прошить соответствующие компоненты ядра:

```text
diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index c763a9558169..bd7f3effb45a 100644
--- a/drivers/media/i2c/rk628_csi.c

+++ b/drivers/media/i2c/rk628_csi.c
@@ -34,7 +34,7 @@
 #include <video/videomode.h>
 #include "rk628_csi.h"

-static int debug;
+static int debug = 1;
 module_param(debug, int, 0644);
 MODULE_PARM_DESC(debug, "debug level (0-3)");

diff --git a/include/media/v4l2-common.h b/include/media/v4l2-common.h
index 1cc0c5ba16b3..e74f3a85f0b8 100644

--- a/include/media/v4l2-common.h
+++ b/include/media/v4l2-common.h
@@ -75,7 +75,7 @@
 #define v4l2_dbg(level, debug, dev, fmt, arg...)   \
      do {                                          \
           if (debug >= (level))                    \
-                v4l2_printk(KERN_DEBUG, dev, fmt , ## arg); \
+                v4l2_printk(KERN_INFO, dev, fmt , ## arg); \
      } while (0)
```

### 6.2 Чтение и запись регистров

Ниже показаны отладочные узлы регистров RK628. В этом примере RK628 подключён к I2C1 по адресу 0x51.

```text
rk3288:/ # ls -l /d/regmap/
total 0
drwxr-xr-x 2 root root 0 1970-01-01 00:00 0-001b

drwxr-xr-x 2 root root 0 1970-01-01 00:00 1-0051-combrxphy
drwxr-xr-x 2 root root 0 1970-01-01 00:00 1-0051-combtxphy
drwxr-xr-x 2 root root 0 1970-01-01 00:00 1-0051-cru
drwxr-xr-x 2 root root 0 1970-01-01 00:00 1-0051-csi
drwxr-xr-x 2 root root 0 1970-01-01 00:00 1-0051-grf
drwxr-xr-x 2 root root 0 1970-01-01 00:00 1-0051-hdmirx
drwxr-xr-x 2 root root 0 1970-01-01 00:00 1-0051-key_map
drwxr-xr-x 2 root root 0 1970-01-01 00:00 1-0051-rk628-pinctrl
drwxr-xr-x 2 root root 0 1970-01-01 00:00 2-001a
drwxr-xr-x 2 root root 0 1970-01-01 00:00 ff890000.i2s

drwxr-xr-x 2 root root 0 1970-01-01 00:00 ff96c000.video-phy
```

По умолчанию узлы регистров доступны только для чтения. Для включения записи исходник приводит следующее изменение:

```text
diff --git a/drivers/base/regmap/regmap-debugfs.c b/drivers/base/regmap/regmap-
debugfs.c
index 3f0a7e262d69..b819645edd84 100644

--- a/drivers/base/regmap/regmap-debugfs.c
+++ b/drivers/base/regmap/regmap-debugfs.c
@@ -259,7 +259,7 @@ static ssize_t regmap_map_read_file(struct file *file, char
__user *user_buf,
                         count, ppos);
 }

-#undef REGMAP_ALLOW_WRITE_DEBUGFS
+#define REGMAP_ALLOW_WRITE_DEBUGFS
 #ifdef REGMAP_ALLOW_WRITE_DEBUGFS
 /*
 * This can be dangerous especially when we have clients such as
```

Чтение регистров:

```text
rk3288:/ # cat /d/regmap/1-0051-cru/registers
c0000: 00001063

c0004: 00001442
c0008: 00000000
c000c: 00000007
c0010: 00007f00
c0020: 00006010
c0024: 00000581
c0028: 00ef348b
c002c: 00000007
c0030: 00007f00
...
```

Запись регистра:

```text
rk3288:/ # echo 0x000 0xffffffff > /d/regmap/1-0051-grf/registers
```

### 6.3 Ошибки устройства MFD

RK628D является устройством MFD. Сразу после включения probe дочерних устройств, например COMBRXPHY, может вернуть -517, поскольку probe родительского устройства ещё не завершён. Попытка повторяется, поэтому первоначальные ошибки не мешают работе, если последующий отложенный probe успешен.

![Журнал MFD probe — китайский PDF, стр. 31](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p31-1.png)

Журнал MFD probe — китайский PDF, стр. 31

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
0.950153] rk3x-i2c ff650000.i2c: Initialized RK3xxx I2C bus at e15c6000
0.951507] rk628 1-0051: GPIO lookup for consumer enable
0.951550] rk628 1-0051: using device tree for GPIO lookup
0.951677] rk628 1-0051: GPIO lookup for consumer reset
0.951696] rk628 1-0051: using device tree for GPIO lookup
0.998162] rk628-pinctrl rk628-pinctrl: bank->clk get error -517
0.998958] rk628-combrxphy rk628-combrxphy: failed to get pclk: -517
1.007020] rk628-hdmi rk628-hdmi: could not find pctldev for node /i2c@ff

1.008377] rk3x-i2c ff140000.i2c: Initialized RK3xxx I2C bus at e15c8000
1.009677] rk3x-i2c ff660000.i2c: Initialized RK3xxx I2C bus at e15ca000
1.010690] rk628-csi rk628-csi: could not find pctldev for node /i2c@ff14
```

### 6.4 Ошибки Clk det

Если COMBRXPHY не обнаруживает сигнал, неверный активный уровень обнаружения подключения HDMI или HPD может препятствовать нормальному выходу HDMI источника. Проверьте plugin-det-gpios и hpd-output-inverted в rk628_csi; уровень HPD также можно измерить мультиметром.

При ошибках выполняются повторные попытки, максимум до retry 2. Если после них работа нормализуется, исходник считает сигнал нормальным.

![Повтор обнаружения тактирования — китайский PDF, стр. 31](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p31-2.png)

Повтор обнаружения тактирования — китайский PDF, стр. 31

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
0_b_rk628-csi rk628-csi: tx_5v_power_present hdp det gpio val:0x1!
628-combrxphy rk628-combrxphy: rk628_combrxphy_power_on
628-combrxphy rk628-combrxphy: clk det over cnt:10, reg_0x6654:0x501f000
628-combrxphy rk628-combrxphy: clock detected failed, cfg resistance manual!
628-combrxphy rk628-combrxphy: error,clock error!
hy phy-rk628-combrxphy.4: phy poweron failed --> -22
0_b_rk628-csi rk628-csi: hdmi rxphy power on failed
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:1
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:2
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:3
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:4
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:5
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:6
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:7
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:8
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:9
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:10
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:11
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:12
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:13
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:14
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup read wxh:0x0, total:0x0, SCDC_REGS1:0x0, cnt:15
0_b_rk628-csi rk628-csi: rk628_hdmirx_phy_setup hdmi rxphy lock failed, retry:0
628-combrxphy rk628-combrxphy: rk628_combrxphy_power_on
628-combrxphy rk628-combrxphy: clock detected!
```

### 6.5 Проверка нормальной работы HDMI RX

После нормальной синхронизации COMBRXPHY контроллер HDMI RX может определить тайминги. Они вычисляются, поэтому возможны небольшие расхождения, обычно на единицу. Подробные определения таймингов приведены в документации стандартов CEA.

![Журнал нормального тайминга HDMI — китайский PDF, стр. 31](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p31-3.png)

Журнал нормального тайминга HDMI — китайский PDF, стр. 31

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
m00_b_rk628-csi rk628-csi: cnt_num:1000, tmds_cnt:3000, hs_cnt:15, vs_cnt:3667, hofs:192
m00_b_rk628-csi rk628-csi: SCDC_REGS1:0xffff0f00, act:1920x1080, total:2200x1125, fps:60,
m00_b_rk628-csi rk628-csi: hfp:88, hs:45, hbp:147, vfp:4, vs:5, vbp:36, interlace:0
m00_b_rk628-csi rk628-csi: rk628-csi_s_dv_timings: 1920x1080p60.0 (2200x1125)
m00_b_rk628-csi rk628-csi: enable_stream: disable
```

### 6.6 Ошибки разрешений при открытии subdev

![Ошибка прав устройства — китайский PDF, стр. 32](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p32-1.png)

Ошибка прав устройства — китайский PDF, стр. 32

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
D JNI     : JNI CAMERA CALL init
I HdmiInput-native: JNI OnLoad
I HdmiInput-native: Apk Version: V1.2
E HdmiInput-native: openDevice(91): open /dev/v4l-subdev2 failed,erro=Permission denied
D RockchipCamera2: remove take pic button
D RockchipCamera2: recreatTextureview
D RockchipCamera2: textureView remove
D RockchipCamera2: onResume
```

Проверьте, предоставлены ли /dev/v4l-subdev* указанные в исходнике разрешения 666. Запрос из оболочки устройства:

```text
rk3288:/ # cat /vendor/ueventd.rc | grep subdev
/dev/v4l-subdev*   0666 media   camera
```

SDK, описанный в исходнике, уже содержит этот коммит. Если он отсутствует, используйте следующее изменение в device/rockchip/common/ как пример. Перед рабочим использованием широкие разрешения узлов устройств требуют проверки безопасности.

![Патч прав ueventd — китайский PDF, стр. 32](/docs/rockchip-hdmi-in-camerahal3/assets/cn-p32-2.png)

Патч прав ueventd — китайский PDF, стр. 32

Транскрипция видимого кода (исходный снимок частичный; обрезанные части не выдуманы):

```text
wendingxian@ubuntu:~/rk3288_9.0_int/device/rockchip/common$ git show
commit 17112e1430b0f10a88b57c73ad19203e58f0eeff (HEAD -> mid_9.0, rk/rk/rk33/mid/9.0/develop)
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Tue Apr 27 21:26:48 2021 +0800

    ueventd.rockchip.rc: modify the /dev/v4l-subdev* permission to 666

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: Id4848209fd983f7e525761f19c7f0420b9fee747

diff --git a/ueventd.rockchip.rc b/ueventd.rockchip.rc
index 1914490b..52935d49 100755
--- a/ueventd.rockchip.rc
+++ b/ueventd.rockchip.rc
@@ -178,7 +178,7 @@
 /dev/ovr0                0664   system     system

 #for rk_isp1
-/dev/v4l-subdev*         0660   media      camera
+/dev/v4l-subdev*         0666   media      camera

 /dev/video0         0660   media      camera
 /dev/video1         0660   media      camera
```

{% endraw %}
