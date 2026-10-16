---
title: "Полное руководство по DisplayPort RK3399: TCPM, EXTCON, HPD и отладка PHY"
description: "Полные параметры DP RK3399, конфигурация дерева устройств, патч HPD, команды отладки и примеры регистров PHY."
translation_key: "042-rockchip-rk3399-displayport"
slug: "042-rockchip-rk3399-displayport"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["RK3399", "DisplayPort", "TCPM", "EXTCON", "PHY"]
keywords: "ArmSoM Rockchip RK3399 DisplayPort DP Type-C PHY"
excerpt: "Полные параметры DP RK3399, конфигурация дерева устройств, патч HPD, команды отладки и примеры регистров PHY."
---

{% raw %}

# Полное руководство по DisplayPort RK3399: TCPM, EXTCON, HPD и отладка PHY

Это справочное руководство для платформы Rockchip RK3399 и описанных в оригинале BSP с Linux kernel 4.4 и новее. Конфигурации TCPM и EXTCON применимы только к диапазонам версий ядра, указанным в соответствующих разделах. Это не означает поддержку на всех платах ArmSoM: необходимо проверить SoC, разводку DP/Type-C, PD-контроллер, прошивку, дерево устройств и патчи BSP. Проверка на оборудовании ArmSoM не проводилась; журналы, значения и возможности испытаний взяты из оригинала.

Источник: Rockchip RK3399 Developer Guide DisplayPort, V1.0.0 в обеих языковых версиях с различающимися датами на обложках. Противоречия оригинала сохранены; примеры регистров не являются проверенными командами для конкретной платы. [Редакционная проверка](/docs/rockchip-rk3399-displayport/EDITORIAL-NOTES.md). [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Введение в DP платформы RK3399

### 1.1 Обзор функций

Функциональные параметры интерфейса DP RK3399 приведены ниже:

| Функция | RK3399 |
| --- | --- |
| Версия | 1.2 |
| SST | Поддерживается |
| MST | Не поддерживается |
| DSC | Не поддерживается |
| Максимальное разрешение | 4K@60Hz |
| Линии Main-Link | 1/2/4 lanes |
| Скорость Main-Link | 5.4/2.7/1.62 Gbps/lane |
| AUX_CH | 1 M |
| Цветовой формат | RGB/YUV444/YUV422 |
| Глубина цвета | 8/10 bit |
| Поддержка Type-C | Поддерживается |
| I2S | Поддерживается |
| SPDIF | Поддерживается |

### 1.2 Связь между DP, VOP и PHY

Связь между DP, VOP и PHY показана на следующей схеме:

![Техническая иллюстрация из оригинала (EN, 6)](/docs/rockchip-rk3399-displayport/assets/en-p6-1.png)

RK3399 содержит два VOP: VOPB и VOPL. Источником входных данных DP может быть любой из них. При выборе VOPB максимальное разрешение составляет 4096x2160@60Hz, при выборе VOPL — 2650x1600@60Hz. Выход DP можно направить на UPHY0 или UPHY1, но одновременно использовать оба невозможно.

### 1.3 Пути исходного кода

Код драйвера ядра:

```text
# Controller
drivers/gpu/drm/rockchip/cdn-dp-core.c
drivers/gpu/drm/rockchip/cdn-dp-core.h

drivers/gpu/drm/rockchip/cdn-dp-link-training.c
drivers/gpu/drm/rockchip/cdn-dp-reg.c
drivers/gpu/drm/rockchip/cdn-dp-reg.h
# PHY
drivers/phy/rockchip/phy-rockchip-typec.c
```

Пример конфигурации DTS:

```text
arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi
```

### 1.4 Загрузка драйвера

DP в RK3399 содержит внутренний микроконтроллер. Перед началом работы DP загружается прошивка, расположенная по следующему пути:

```text
/lib/firmware/rockchip/dptx.bin
```

Об успешной загрузке драйвера можно судить по следующему сообщению журнала:

```text
[  3.796582][ T9] rockchip-drm display-subsystem: bound fec00000.dp (ops
cdn_dp_component_ops)
```

## 2. Настройка функций

DP и USB3.0 совместно используют PHY (Type-C PHY). В зависимости от разъёма применяются два режима: DP Alt Mode (Type-C) или Legacy Mode (стандартный разъём DP).

Программные последовательности этих режимов отличаются незначительно. Для Type-C драйвер PD-контроллера на основе TCPM уведомляет драйверы PHY и контроллера DP о состоянии HPD через функции обратного вызова. Для стандартного разъёма DP виртуальный драйвер PD передаёт драйверам PHY и DP состояние, обнаруженное на контакте HPD.

Соответствие линий и контактов Type-C PHY:

| Линии PHY / контакты модуля | Контакты разъёма Type-C |
| --- | --- |
| Lane0 (tx_p/m_ln_0) | TX1+/TX1- (контакты A2/A3) |
| Lane1 (tx_rx_p/m_ln_1) | RX1+/RX1- (контакты B11/B10) |
| Lane2 (tx_rx_p/m_ln_2) | RX2+/RX2- (контакты A11/A10) |
| Lane3 (tx_p/m_ln_3) | TX2+/TX2- (контакты B2/B3) |

Распределение линий USB и DP на Type-C PHY поддерживает схемы C, D, E и другие схемы DP Alt Mode. Для обычной ориентации (Normal):

| Линии PHY | C | D | E |
| --- | --- | --- | --- |
| 0 | ML2 | SSTX | ML2 |
| 1 | ML3 | SSRX | ML3 |
| 2 | ML0 | ML0 | ML0 |
| 3 | ML1 | ML1 | ML1 |

Для перевёрнутой ориентации (Flip):

| Линии PHY | C | D | E |
| --- | --- | --- | --- |
| 0 | ML0 | ML0 | ML0 |
| 1 | ML1 | ML1 | ML1 |
| 2 | ML2 | SSTX | ML2 |
| 3 | ML3 | SSRX | ML3 |

Полярностью контактов при обычной и перевёрнутой ориентации Type-C управляет сам PHY.

### 2.1 DP Alt Mode (Type-C)

В примере используется только UPHY0. Для включения интерфейса DP задайте:

```text
&cdn_dp {
   status = "okay";
   phys = <&tcphy0_dp>;

};
```

Укажите VOP, используемый DP. Например, для выбора VOPB:

```text
&dp_in_vopb {
   status = "okay";
};


&dp_in_vopl {
   status = "disabled";
};
```

Включите PHY:

```text
&tcphy0 {
   status = "okay";
};
```

В Linux Kernel 5.10 и более новых версиях драйвер PD-контроллера использует архитектуру TCPM и регистрирует функции обратного вызова для передачи состояния HPD. В Linux Kernel 4.19 и более ранних версиях для этого используется EXTCON. Поэтому конфигурации DTS и PD-контроллера для этих двух механизмов различаются.

#### 2.1.1 Конфигурация архитектуры TCPM

В примере используется только UPHY0. Включите и настройте Type-C PHY следующим образом:

```text
&tcphy0 {
   status = "okay";

   /* DP related config */

   svid = <0xff01>;
   /* DP related config */

   orientation-switch;
   port {
      #address-cells = <1>;
      #size-cells = <0>;
      tcphy0_orientation_switch: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&usbc0_orien_sw>;
      };


      /* DP related config */
      tcphy_dp_altmode_switch: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&dp_mode_sw>;
      };
      /* DP related config */
   };
};
```

В этой конфигурации:

`svid`: для DP используется фиксированное значение `0xff01`.

`tcphy_dp_altmode_switch`: служит для сопоставления с узлом PD-контроллера.

Для Type-C линии и состояние HPD настраиваются посредством обнаружения CC и согласования PD. Поэтому также необходимо настроить PD-контроллер:

```text
usb_con: connector {
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

   /* DP related config */
   displayport = <&cdn_dp>;

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
           remote-endpoint = <&tcphy0_orientation_switch>;

         };
      };
      /* DP related config */
      port@1 {
         reg = <1>;
         dp_mode_sw: endpoint {
           remote-endpoint = <&tcphy_dp_altmode_switch>;
         };
      };
      /* DP related config */
   };
};
```

Свойство `displayport` указывает узел DP.

В узле `altmode@0` свойство `svid` имеет фиксированное значение `0xff01`, а `vdo` — `0xffffffff`.

`dp_mode_sw` служит для сопоставления с узлом Type-C PHY.

Примечание: в исходном документе указана поддержка PD-контроллеров fusb302 и hub311. Драйвер fusb302 находится в `/drivers/usb/typec/tcpm/fusb302.c`, а драйвер hub311 — в `/drivers/usb/typec/tcpm/tcpci_husb311.c`.

#### 2.1.2 Конфигурация механизма EXTCON

В примере используется только UPHY0. Включите и настройте Type-C PHY следующим образом:

```text
&tcphy0 {
   extcon = <&fusb0>;
   status = "okay";

};
```

Конфигурация контроллера DP:

```text
&cdn_dp {
   status = "okay";
   extcon = <&fusb0>;

   phys = <&tcphy0_dp>;
};
```

В этой конфигурации:

`extcon` — ссылка на узел PD-контроллера.

### 2.2 Legacy Mode (стандартный разъём DP)

В примере используется только UPHY0. Включение DP выполняется так же, как для интерфейса Type-C:

```text
&cdn_dp {
   status = "okay";
   phys = <&tcphy0_dp>;

};
```

Укажите VOP, используемый DP. Например, для выбора VOPB:

```text
&dp_in_vopb {
   status = "okay";
};


&dp_in_vopl {
   status = "disabled";
};
```

Включите PHY:

```text
&tcphy0 {
   status = "okay";
};
```

Для стандартного разъёма в Linux Kernel 5.10 и более новых версиях состояние HPD определяется через прерывания GPIO. В Linux Kernel 4.19 и более ранних версиях используется механизм EXTCON; требуется специальный патч, передающий состояние контакта HPD через функции обратного вызова или EXTCON.

#### 2.2.1 Распределение линий DP

На интерфейсе Type-C PHY линии PHY соответствуют следующим контактам Type-C:

| Линии PHY / контакты модуля | Контакты разъёма Type-C |
| --- | --- |
| Lane0 (tx_p/m_ln_0) | TX1+/TX1- (контакты A2/A3) |
| Lane1 (tx_rx_p/m_ln_1) | RX1+/RX1- (контакты B11/B10) |
| Lane2 (tx_rx_p/m_ln_2) | RX2+/RX2- (контакты A11/A10) |
| Lane3 (tx_p/m_ln_3) | TX2+/TX2- (контакты B2/B3) |

Для линий PHY поддерживаются только две фиксированные схемы: на четыре и на две линии.

Схема для четырёх линий:

| Линии PHY | Линия DP |
| --- | --- |
| Lane0 | ML2 |
| Lane1 | ML3 |
| Lane2 | ML0 |
| Lane3 | ML1 |

Схема для двух линий:

| Линии PHY | Линия DP |
| --- | --- |
| Lane2 | ML0 |
| Lane3 | ML1 |

#### 2.2.2 Патч уведомления HPD

В Linux Kernel 4.19 и более ранних версиях для передачи состояния HPD используется EXTCON. Необходимо применить следующий патч:

```text
diff --git a/drivers/extcon/Kconfig b/drivers/extcon/Kconfig
index de15bf55895b..90f5c9eb956c 100644
--- a/drivers/extcon/Kconfig

+++ b/drivers/extcon/Kconfig
@@ -158,4 +158,10 @@ config EXTCON_USBC_CROS_EC
       Say Y here to enable USB Type C cable detection extcon support when
       using Chrome OS EC based USB Type-C ports.
@@ -158,4 +158,10 @@ config EXTCON_USBC_CROS_EC
       Say Y here to enable USB Type C cable detection extcon support when
       using Chrome OS EC based USB Type-C ports.

+config EXTCON_PD_VIRTUAL
+     tristate "Rockchip Virtual PD EXTCON support"
+     depends on GPIOLIB
+     help
+       Say Y here to enable Rockchip Virtual PD extcon support.
+

 endif
diff --git a/drivers/extcon/Makefile b/drivers/extcon/Makefile
index 0888fdeded72..d8dd2b8647c9 100644
--- a/drivers/extcon/Makefile
+++ b/drivers/extcon/Makefile
@@ -22,3 +22,4 @@ obj-$(CONFIG_EXTCON_RT8973A) += extcon-rt8973a.o
 obj-$(CONFIG_EXTCON_SM5502) += extcon-sm5502.o
 obj-$(CONFIG_EXTCON_USB_GPIO) += extcon-usb-gpio.o
 obj-$(CONFIG_EXTCON_USBC_CROS_EC) += extcon-usbc-cros-ec.o
+obj-$(CONFIG_EXTCON_PD_VIRTUAL) += extcon-pd-virtual.o
diff --git a/drivers/extcon/extcon-pd-virtual.c b/drivers/extcon/extcon-pd-virtual.c
new file mode 100755

index 000000000000..94095beff9ff
--- /dev/null
+++ b/drivers/extcon/extcon-pd-virtual.c
@@ -0,0 +1,578 @@
+/*
+ * Copyright (c) 2024, Fuzhou Rockchip Electronics Co., Ltd
+ *
+ * This program is free software; you can redistribute it and/or modify it
+ * under the terms and conditions of the GNU General Public License,
+ * version 2, as published by the Free Software Foundation.
+ */
+
+#include <linux/init.h>

+#include <linux/kernel.h>
+#include <linux/module.h>
+#include <linux/platform_device.h>
+#include <linux/slab.h>
+#include <linux/extcon-provider.h>
+#include <linux/gpio.h>
+#include <linux/of_gpio.h>
+#include <linux/irq.h>
+#include <linux/interrupt.h>
+#include <linux/delay.h>
+
+struct virtual_pd {

+     struct extcon_dev *extcon;
+     struct gpio_desc *gpio_vbus_5v;
+     struct gpio_desc *gpio_hdmi_5v;
+     struct gpio_desc *gpio_irq;
+     struct device *dev;
+     bool flip;
+     bool usb_ss;
+     bool enable;
+     u8 mode;
+     int irq;
+     int enable_irq;
+     int plug_state;
+     struct work_struct work;
+     struct workqueue_struct *virtual_pd_wq;
+     spinlock_t irq_lock;
+     struct delayed_work irq_work;

+     int shake_lev;
+};
+
+static const unsigned int vpd_cable[] = {
+     EXTCON_USB,
+     EXTCON_USB_HOST,
+     EXTCON_USB_VBUS_EN,
+     EXTCON_CHG_USB_SDP,
+     EXTCON_CHG_USB_CDP,
+     EXTCON_CHG_USB_DCP,
+/*
+ FIXME: There's no real pd phy, control the charging is very

+ dangerous, just rely on the BC detection. We don't use slow
+ and fast.
+*/
+     EXTCON_CHG_USB_SLOW,
+     EXTCON_CHG_USB_FAST,
+     EXTCON_DISP_DP,
+     EXTCON_NONE,
+};
+
+enum vpd_mode {
+     VPD_DFP = 0,
+     VPD_UFP,
+     VPD_DP,

+     VPD_DP_UFP,
+};
+
+static void vpd_set_vbus_enable(struct virtual_pd *vpd, bool enable)
+{
+     extcon_set_state(vpd->extcon, EXTCON_USB_VBUS_EN, enable);
+     extcon_sync(vpd->extcon, EXTCON_USB_VBUS_EN);
+     if (vpd->gpio_vbus_5v)
+           gpiod_set_raw_value(vpd->gpio_vbus_5v, enable);
+}
+
+static void vpd_extcon_notify(struct virtual_pd *vpd, bool flip, bool usb_ss,

+                     bool dfp, bool ufp, bool dp)
+{
+     union extcon_property_value property;
+
+     property.intval = flip;
+     extcon_set_property(vpd->extcon, EXTCON_USB,
+                    EXTCON_PROP_USB_TYPEC_POLARITY, property);
+     extcon_set_property(vpd->extcon, EXTCON_USB_HOST,
+                    EXTCON_PROP_USB_TYPEC_POLARITY, property);
+     extcon_set_property(vpd->extcon, EXTCON_DISP_DP,
+                    EXTCON_PROP_USB_TYPEC_POLARITY, property);
+
+     property.intval = usb_ss;
+     extcon_set_property(vpd->extcon, EXTCON_USB,
+                    EXTCON_PROP_USB_SS, property);
+     extcon_set_property(vpd->extcon, EXTCON_USB_HOST,

+                    EXTCON_PROP_USB_SS, property);
+     extcon_set_property(vpd->extcon, EXTCON_DISP_DP,
+                    EXTCON_PROP_USB_SS, property);
+     extcon_set_state(vpd->extcon, EXTCON_USB, ufp);
+     extcon_set_state(vpd->extcon, EXTCON_USB_HOST, dfp);
+     extcon_set_state(vpd->extcon, EXTCON_DISP_DP, dp);
+     extcon_sync(vpd->extcon, EXTCON_USB);
+     extcon_sync(vpd->extcon, EXTCON_USB_HOST);
+     extcon_sync(vpd->extcon, EXTCON_DISP_DP);
+}
+
+static void vpd_extcon_notify_set(struct virtual_pd *vpd)

+{
+     bool flip = vpd->flip, usb_ss = vpd->usb_ss;
+     bool dfp = 0, ufp = 0, dp = 0;
+
+     switch (vpd->mode) {
+     case VPD_DFP:
+           dfp = 1;
+           break;
+     case VPD_DP:
+           dp = 1;
+           dfp = 1;
+           break;
+     case VPD_DP_UFP:

+           dp = 1;
+           ufp = 1;
+           break;
+     case VPD_UFP:
+           /* fall through */
+     default:
+           ufp = 1;
+           break;
+     }
+
+     vpd_set_vbus_enable(vpd, !ufp);
+     vpd_extcon_notify(vpd, flip, usb_ss, dfp, ufp, dp);

+}
+
+static void vpd_extcon_notify_clr(struct virtual_pd *vpd)
+{
+     vpd_set_vbus_enable(vpd, 0);
+     vpd_extcon_notify(vpd, vpd->flip, vpd->usb_ss, 0, 0, 0);
+}
+
+static ssize_t vpd_flip_show(struct device *dev,
+                    struct device_attribute *attr, char *buf)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);
+
+     return sprintf(buf, "%d\n", vpd->flip);
+}
+

+static ssize_t vpd_flip_store(struct device *dev,
+                     struct device_attribute *attr,
+                     const char *buf, size_t count)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);
+
+     if (vpd->enable)
+           goto out;
+
+     if (strncmp(buf, "1", 1) == 0)
+           vpd->flip = true;
+     else

+           vpd->flip = false;
+out:
+     return count;
+}
+static DEVICE_ATTR(flip, S_IWUSR | S_IRUSR, vpd_flip_show, vpd_flip_store);
+
+static ssize_t vpd_ss_show(struct device *dev,
+                   struct device_attribute *attr, char *buf)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);
+
+     return sprintf(buf, "%d\n", vpd->usb_ss);
+}

+
+static ssize_t vpd_ss_store(struct device *dev,
+                     struct device_attribute *attr,
+                     const char *buf, size_t count)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);
+
+     if (vpd->enable)
+           goto out;
+
+     if (strncmp(buf, "1", 1) == 0)
+           vpd->usb_ss = true;

+     else
+           vpd->usb_ss = false;
+out:
+     return count;
+}
+static DEVICE_ATTR(ss, S_IWUSR | S_IRUSR, vpd_ss_show, vpd_ss_store);
+
+static ssize_t vpd_mode_show(struct device *dev,
+                   struct device_attribute *attr, char *buf)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);
+
+     return sprintf(buf, "%d\n", vpd->mode);
+}
+
+static ssize_t vpd_mode_store(struct device *dev,

+                     struct device_attribute *attr,
+                     const char *buf, size_t count)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);
+
+     if (vpd->enable)
+           goto out;
+
+     if (strncmp(buf, "0", 1) == 0)
+           vpd->mode = VPD_DFP;
+     else if (strncmp(buf, "2", 1) == 0)
+           vpd->mode = VPD_DP;

+     else if (strncmp(buf, "3", 1) == 0)
+           vpd->mode = VPD_DP_UFP;
+     else
+           vpd->mode = VPD_UFP;
+out:
+     return count;
+}
+static DEVICE_ATTR(mode, S_IWUSR | S_IRUSR, vpd_mode_show, vpd_mode_store);
+
+static ssize_t vpd_enable_show(struct device *dev,
+                    struct device_attribute *attr, char *buf)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);

+
+     return sprintf(buf, "%d\n", vpd->enable);
+}
+
+static ssize_t vpd_enable_store(struct device *dev,
+                     struct device_attribute *attr,
+                     const char *buf, size_t count)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);
+
+     if (strncmp(buf, "1", 1) == 0) {
+           if (vpd->enable)

+                 goto out;
+           vpd->enable = true;
+           vpd_extcon_notify_set(vpd);
+     } else {
+           if (!vpd->enable)
+                 goto out;
+           vpd->enable = false;
+           vpd_extcon_notify_clr(vpd);
+     }
+out:
+     return count;
+}
+static DEVICE_ATTR(enable, S_IWUSR | S_IRUSR, vpd_enable_show, vpd_enable_store);
+
+static struct attribute *vpd_attributes[] = {
+     &dev_attr_flip.attr,

+     &dev_attr_ss.attr,
+     &dev_attr_mode.attr,
+     &dev_attr_enable.attr,
+     NULL
+};
+
+static const struct attribute_group vpd_attr_group = {
+     .attrs = vpd_attributes,
+};
+
+void vpd_irq_disable(struct virtual_pd *vpd)
+{

+     unsigned long irqflags = 0;
+
+     spin_lock_irqsave(&vpd->irq_lock, irqflags);
+     if (!vpd->enable_irq) {
+           disable_irq_nosync(vpd->irq);
+           vpd->enable_irq = 1;
+     } else {
+           dev_warn(vpd->dev, "irq have already disabled\n");
+     }
+     spin_unlock_irqrestore(&vpd->irq_lock, irqflags);
+}
+
+void vpd_irq_enable(struct virtual_pd *vpd)

+{
+     unsigned long irqflags = 0;
+
+     spin_lock_irqsave(&vpd->irq_lock, irqflags);
+     if (vpd->enable_irq) {
+           enable_irq(vpd->irq);
+           vpd->enable_irq = 0;
+     }
+     spin_unlock_irqrestore(&vpd->irq_lock, irqflags);
+}
+
+static void virtual_pd_work_func(struct work_struct *work)

+{
+     struct virtual_pd *vpd;
+
+     vpd = container_of(work, struct virtual_pd, work);
+     dev_info(vpd->dev, "%s %d =====>\n",__FUNCTION__,__LINE__);
+}
+
+static void extcon_pd_delay_irq_work(struct work_struct *work)
+{
+     struct virtual_pd *vpd =
+           container_of(work, struct virtual_pd, irq_work.work);
+     int lev;
+
+     lev = gpiod_get_raw_value(vpd->gpio_irq);
+
+     if(vpd->shake_lev != lev) {

+           vpd_irq_enable(vpd);
+           return;
+     }
+
+     switch(vpd->plug_state) {
+           case 1:
+                 if(lev==0) {
+                       vpd->enable = false;
+                       vpd_extcon_notify_clr(vpd);
+                       vpd->plug_state=0;
+                 }
+                 break;

+           case 0:
+                 if(lev==1) {
+                       vpd->enable = true;
+                       vpd_extcon_notify_set(vpd);
+                       vpd->plug_state=1;
+                 }
+                 break;
+           default:
+                 break;
+     }
+     vpd_irq_enable(vpd);
+}
+

+static irqreturn_t dp_det_irq_handler(int irq, void *dev_id)
+{
+     struct virtual_pd *vpd = dev_id;
+     int lev;
+
+     lev=gpiod_get_raw_value(vpd->gpio_irq);
+     vpd->shake_lev = lev;
+     schedule_delayed_work(&vpd->irq_work, msecs_to_jiffies(10));
+     vpd_irq_disable(vpd);
+     return IRQ_HANDLED;
+}
+

+static void vpd_extcon_init(struct virtual_pd *vpd)
+{
+     struct device *dev = vpd->dev;
+     u32 tmp = 0;
+     int ret = 0;
+
+     ret = device_property_read_u32(dev, "vpd,init-flip", &tmp);
+     if (ret < 0)
+           vpd->flip = 0;
+     else
+           vpd->flip = tmp;
+     dev_dbg(dev, "init-flip = %d\n", vpd->flip);
+
+     ret = device_property_read_u32(dev, "vpd,init-ss", &tmp);
+     if (ret < 0)
+           vpd->usb_ss = 0;

+     else
+           vpd->usb_ss = tmp;
+     dev_dbg(dev, "init-ss = %d\n", vpd->usb_ss);
+
+     ret = device_property_read_u32(dev, "vpd,init-mode", &tmp);
+     if (ret < 0)
+           vpd->mode = 0;
+     else
+           vpd->mode = tmp;
+     dev_dbg(dev, "init-mode = %d\n", vpd->flip);
+     if(gpiod_get_raw_value(vpd->gpio_irq)) {
+           vpd_extcon_notify_set(vpd);

+           vpd->plug_state=1;
+     }
+}
+
+static int vpd_extcon_probe(struct platform_device *pdev)
+{
+     struct virtual_pd *vpd;
+     struct device *dev = &pdev->dev;
+     int ret = 0;
+
+     dev_info(dev, "%s: %d start\n", __func__, __LINE__);
+
+     vpd = devm_kzalloc(dev, sizeof(*vpd), GFP_KERNEL);

+     if (!vpd)
+           return -ENOMEM;
+
+     vpd->dev = dev;
+     dev_set_drvdata(dev, vpd);
+     vpd->enable = 1;
+
+     vpd->extcon = devm_extcon_dev_allocate(dev, vpd_cable);
+     if (IS_ERR(vpd->extcon)) {
+           dev_err(dev, "allocat extcon failed\n");
+           return PTR_ERR(vpd->extcon);
+     }

+
+     ret = devm_extcon_dev_register(dev, vpd->extcon);
+     if (ret) {
+           dev_err(dev, "register extcon failed: %d\n", ret);
+           return ret;
+     }
+
+     vpd->gpio_vbus_5v = devm_gpiod_get_optional(dev,"vbus-5v",
+                                     GPIOD_OUT_LOW);
+     if (IS_ERR(vpd->gpio_vbus_5v)) {
+           dev_warn(dev, "maybe miss named GPIO for vbus-5v\n");
+           vpd->gpio_vbus_5v = NULL;
+     } else
+           gpiod_set_raw_value(vpd->gpio_vbus_5v, 0);
+
+     vpd->gpio_hdmi_5v = devm_gpiod_get_optional(dev,"hdmi-5v",

+                                     GPIOD_OUT_LOW);
+     if (IS_ERR(vpd->gpio_hdmi_5v)) {
+           dev_warn(dev, "maybe miss named GPIO for gpio_hdmi_5v\n");
+           vpd->gpio_hdmi_5v = NULL;
+     }
+
+     vpd->gpio_irq = devm_gpiod_get_optional(dev,"dp-det",
+                                     GPIOD_OUT_LOW);
+     if (IS_ERR(vpd->gpio_irq)) {
+           dev_warn(dev, "maybe miss named GPIO for dp-det\n");
+           vpd->gpio_irq = NULL;
+     }

+
+     ret = extcon_set_property_capability(vpd->extcon, EXTCON_USB,
+                                EXTCON_PROP_USB_TYPEC_POLARITY);
+     if (ret) {
+           dev_err(dev,
+                 "set USB property capability failed: %d\n", ret);
+           return ret;
+     }
+
+     ret = extcon_set_property_capability(vpd->extcon, EXTCON_USB_HOST,
+                                EXTCON_PROP_USB_TYPEC_POLARITY);
+     if (ret) {
+           dev_err(dev,

+                 "set USB_HOST property capability failed: %d\n",
+                 ret);
+           return ret;
+     }
+
+     ret = extcon_set_property_capability(vpd->extcon, EXTCON_DISP_DP,
+                                EXTCON_PROP_USB_TYPEC_POLARITY);
+     if (ret) {
+           dev_err(dev,
+                 "set DISP_DP property capability failed: %d\n",
+                 ret);
+           return ret;

+     }
+
+     ret = extcon_set_property_capability(vpd->extcon, EXTCON_USB,
+                                EXTCON_PROP_USB_SS);
+     if (ret) {
+           dev_err(dev,
+                 "set USB USB_SS property capability failed: %d\n",
+                 ret);
+           return ret;
+     }
+
+     ret = extcon_set_property_capability(vpd->extcon, EXTCON_USB_HOST,
+                                EXTCON_PROP_USB_SS);
+     if (ret) {
+           dev_err(dev,
+                 "set USB_HOST USB_SS property capability failed: %d\n",

+                 ret);
+           return ret;
+     }
+
+     ret = extcon_set_property_capability(vpd->extcon, EXTCON_DISP_DP,
+                                EXTCON_PROP_USB_SS);
+     if (ret) {
+           dev_err(dev,
+                 "set DISP_DP USB_SS property capability failed: %d\n",
+                 ret);
+           return ret;
+     }

+
+     ret = extcon_set_property_capability(vpd->extcon, EXTCON_CHG_USB_FAST,
+                                EXTCON_PROP_USB_TYPEC_POLARITY);
+     if (ret) {
+           dev_err(dev,
+                 "set USB_PD property capability failed: %d\n", ret);
+           return ret;
+     }
+
+     vpd_extcon_init(vpd);
+     INIT_DELAYED_WORK(&vpd->irq_work, extcon_pd_delay_irq_work);
+
+     vpd->irq=gpiod_to_irq(vpd->gpio_irq);

+     dev_info(dev, "%s %d =====>%d\n",__FUNCTION__,__LINE__,vpd->irq);
+     if (vpd->irq){
+           ret = devm_request_threaded_irq(dev,
+                                  vpd->irq,
+                                  NULL,
+                                  dp_det_irq_handler,
+                                  //IRQF_TRIGGER_HIGH | IRQF_ONESHOT,
+                                  IRQF_TRIGGER_FALLING | IRQF_TRIGGER_RISING |
+                                  IRQF_ONESHOT,
+                                  NULL,
+                                  vpd);
+     } else {

+           dev_err(dev,"gpio can not be irq !\n");
+     }
+
+     vpd->virtual_pd_wq = create_workqueue("virtual_pd_wq");
+     INIT_WORK(&vpd->work, virtual_pd_work_func);
+     ret = sysfs_create_group(&dev->kobj, &vpd_attr_group);
+     if (ret < 0)
+           dev_warn(dev, "attr group create failed\n");
+
+     dev_info(dev, "%s: %d sussess\n", __func__, __LINE__);
+
+     return 0;
+}
+
+static int vpd_extcon_remove(struct platform_device *pdev)
+{

+     return 0;
+}
+
+#ifdef CONFIG_PM_SLEEP
+static int vpd_extcon_suspend(struct device *dev)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);
+
+     int lev=0;
+     lev = gpiod_get_raw_value(vpd->gpio_irq);
+     cancel_delayed_work_sync(&vpd->irq_work);
+     vpd_irq_disable(vpd);

+     if (vpd->gpio_hdmi_5v)
+           gpiod_set_raw_value(vpd->gpio_hdmi_5v, 0);
+     return 0;
+}
+
+static int vpd_extcon_resume(struct device *dev)
+{
+     struct virtual_pd *vpd = dev_get_drvdata(dev);
+     if (vpd->gpio_hdmi_5v) {
+           gpiod_set_raw_value(vpd->gpio_hdmi_5v, 1);
+           msleep(800);
+     }
+     vpd_irq_enable(vpd);

+     return 0;
+}
+#endif
+
+static SIMPLE_DEV_PM_OPS(vpd_extcon_pm_ops,
+                 vpd_extcon_suspend, vpd_extcon_resume);
+
+static const struct of_device_id vpd_extcon_dt_match[] = {
+     { .compatible = "linux,extcon-pd-virtual", },
+     { /* sentinel */ }
+};
+MODULE_DEVICE_TABLE(of, usb_extcon_dt_match);

+
+static struct platform_driver vpd_extcon_driver = {
+     .probe      = vpd_extcon_probe,
+     .remove     = vpd_extcon_remove,
+     .driver     = {
+           .name = "extcon-pd-virtual",
+           .pm   = &vpd_extcon_pm_ops,
+           .of_match_table = vpd_extcon_dt_match,
+     },
+};
+
+static int __init __vpd_extcon_init(void)
+{
+          return platform_driver_register(&vpd_extcon_driver);
+}
+

+static void __exit __vpd_extcon_exit(void)
+{
+          platform_driver_unregister(&vpd_extcon_driver);
+}
+
+module_init(__vpd_extcon_init);
+module_exit(__vpd_extcon_exit);
+
+MODULE_LICENSE("GPL");
+MODULE_AUTHOR("rockchip");
+MODULE_DESCRIPTION("Virtual Typec-pd extcon driver");
```

Помимо патча необходимо включить следующую опцию сборки:

```text
CONFIG_EXTCON_PD_VIRTUAL=y
```

#### 2.2.3 Конфигурация DTS

В примере используется только UPHY0. Для показанной аппаратной схемы распределение линий DP приведено на рисунке:

![Техническая иллюстрация из оригинала (EN, 24)](/docs/rockchip-rk3399-displayport/assets/en-p24-1.png)

![Техническая иллюстрация из оригинала (EN, 25)](/docs/rockchip-rk3399-displayport/assets/en-p25-1.png)

![Техническая иллюстрация из оригинала (EN, 25)](/docs/rockchip-rk3399-displayport/assets/en-p25-2.png)

2.2.3.1 Kernel 5.10 и более новые версии

Конфигурация узла cdn-dp:

```text
&cdn_dp {
   status = "okay";

   pinctrl-names = "default";
   pinctrl-0 = <&dp_hpd>;
   hpd-gpios = <&gpio4 RK_PD1 GPIO_ACTIVE_HIGH>;
   phys = <&tcphy0_dp>;
};
&pinctrl {
   ...

   dp {
      dp_hpd: dp-hpd {
         rockchip,pins = <4 RK_PD1 RK_FUNC_GPIO &pcfg_pull_down>;
      };
   };
   ...
};
```

Конфигурация узла PHY:

```text
&tcphy0 {
   status = "okay";
   rockchip, dp-lane-mux = <2 3 0 1>;

}
```

Если аппаратная схема использует две линии, измените конфигурацию узла PHY следующим образом:

```text
&tcphy0 {
   status = "okay";
   rockchip, dp-lane-mux = <2 3>;

}
```

2.2.3.2 Kernel 4.19 и более ранние версии

Конфигурация виртуального драйвера EXTCON:

```text
/ {
   vpd0: virtual-pd0 {
      compatible = "linux,extcon-pd-virtual";

      dp-det-gpios = <&gpio4 RK_PD1 GPIO_ACTIVE_HIGH>;
      /* 0: normal, 1: flip*/
      vpd,init-flip = <0>;
      /* 0: dfp, 1: ufp, 2: dp 3: dp/ufp */
      vpd,init-mode = <2>;
   };
};
```

В этой конфигурации:

`dp-det-gpios`: GPIO сигнала HPD.

`vpd,init-flip`: задаёт ориентацию Type-C. Значение 0 соответствует обычной ориентации, 1 — перевёрнутой.

`vpd,init-mode`: задаёт текущий режим использования PHY. Значения 0 и 1 означают только USB, 2 — только DP, 3 — совместное использование USB/DP.

Конфигурация узла контроллера DP:

```text
&cdn_dp {
   status = "okay";
   extcon = <&vpd0>;

   phys = <&tcphy0_dp>;
};
```

Если аппаратная схема использует две линии, измените конфигурацию виртуального драйвера EXTCON следующим образом:

```text
/ {
   vpd0: virtual-pd0 {

      compatible = "linux,extcon-pd-virtual";
      dp-det-gpios = <&gpio4 RK_PD1 GPIO_ACTIVE_HIGH>;
      /* 0: normal, 1: flip*/
      vpd,init-flip = <0>;
      /* 0: dfp, 1: ufp, 2: dp 3: dp/ufp */
      vpd,init-mode = <3>;
   };
};
```

### 2.3 Загрузочный логотип DP

RK3399 не поддерживает вывод загрузочного логотипа U-Boot через DP.

## 3. Основные методы отладки

### 3.1 Проверка состояния разъёма

В каталоге `/sys/class/drm` перечислены устройства, зарегистрированные драйвером. В исходном описании `card0-DP-1` и `card0-DP-2` обозначают дисплейные устройства DP:

```text
console:/ # ls /sys/class/drm
card0 card0-DP-1 card0-HDMI-A-1 card0-eDP-1 renderD128 version
```

Содержимое каталога `card0-DP-1`:

```text
console:/ # ls /sys/class/drm/card0-DP-1/
device dpms edid enabled modes power status subsystem uevent
```

Проверка состояния включения:

```text
console:/ # cat /sys/class/drm/card0-DP-1/enabled
enabled
```

Проверка состояния подключения:

```text
console:/ # cat /sys/class/drm/card0-DP-1/status
connected
```

Список разрешений, поддерживаемых устройством:

```text
console:/ # cat /sys/class/drm/card0-DP-1/modes
2560x1440

2048x1280
2048x1152
1920x1200
2048x1080
1920x1080
1920x1080
1920x1080
1920x1080
1920x1080
1920x1080
1600x1200
1680x1050
1280x1024

1280x1024
1280x800
1152x864
1280x720
1280x720
1280x720
1024x768
1024x768
800x600
800x600
720x576
720x576

720x480
720x480
720x480
720x480
640x480
640x480
640x480
640x480
720x400
```

EDID устройства можно сохранить следующей командой:

```text
console:/ # cat /sys/class/drm/card0-DP-1/edid > /data/edid.bin
```

### 3.2 Принудительное включение и отключение DP

```text
# Force disable DP
console:/ # echo off > /sys/class/drm/card0-DP-1/status
# Force enable DP

console:/ # echo on > /sys/class/drm/card0-DP-1/status
# Restore hotplug detection
console:/ # echo detect > /sys/class/drm/card0-DP-1/status
```

### 3.3 Чтение и запись DPCD

Доступ к DPCD осуществляется через AUX_CH. Реализация узла чтения и записи находится в:

```text
/drivers/gpu/drm/drm_dp_aux_dev.c
```

Перед использованием функции убедитесь, что включена соответствующая опция сборки:

```text
CONFIG_DRM_DP_AUX_CHARDEV=y
```

Чтение DPCD:

```text
#if is followed by the aux node. When two DP interfaces are registered, there will be
/dev/drm_dp_aux0 and /dev/drm_dp_aux1.
#skip value is the starting address of the DPCD register.

#count value is the number of DPCD registers to be read.
dd if=/dev/drm_dp_aux0 bs=1 skip=$((0x00200)) count=2 status=none | od -tx1
#The following is the content of two DPCD registers starting at address 0x00200.
console:/ # dd if=/dev/drm_dp_aux1 bs=1 skip=$((0x00200)) count=2 status=none | od -tx1
0000000 01 00
0000002
```

Запись регистров DPCD:

```text
#echo is followed by the value to be written. The following example writes two hexadecimal
values, 0x0a and 0x80.

#of is followed by the aux node. When two DP interfaces are registered, there will be
/dev/drm_dp_aux0 and /dev/drm_dp_aux1.
#seek is the starting address of the DPCD register.
#count value is the number of DPCD registers to be written.
#The following command writes the values 0x0a and 0x80 to the two DPCD registers starting at
address 0x100.
echo -e -n "\x0a\x80" | dd of=/dev/drm_dp_aux0 bs=1 seek=$((0x100)) count=2 status=none
```

### 3.4 Отладка интерфейса Type-C

Примечание: этот раздел относится только к Linux Kernel 5.10 и более новым версиям.

Обнаружение HPD на Type-C выполняет PD-контроллер, а основная программная обработка осуществляется подсистемой TCPM. Журнал обнаружения TCPM можно получить следующим образом:

```text
rk3588_s:/ # ls -l /sys/kernel/debug/usb/
total 0
-r--r--r-- 1 root root 0 1970-01-01 00:00 devices

drwxr-xr-x 18 root root 0 1970-01-01 00:00 fc000000.usb
drwxr-xr-x 2 root root 0 1970-01-01 00:00 fc400000.usb
-r--r--r-- 1 root root 0 1970-01-01 00:00 fusb302-2-0022
drwxr-xr-x 4 root root 0 1970-01-01 00:00 ohci
-r--r--r-- 1 root root 0 1970-01-01 00:00 tcpm-2-0022
drwxr-xr-x 2 root root 0 2021-01-01 12:00 usbmon
drwxr-xr-x 2 root root 0 1970-01-01 00:00 uvcvideo
drwxr-xr-x 3 root root 0 1970-01-01 00:00 xhci
```

В каталоге `/sys/kernel/debug/usb/` имеются узлы `fusb302-2-0022` и `tcpm-2-0022`: первый относится к PD-контроллеру, второй — к подсистеме TCPM. Команда получения журнала TCPM:

```text
cat /sys/kernel/debug/usb/tcpm-2-0022
```

Примечание: в имени `tcpm-2-0022` число 2 обозначает соответствующую шину i2c, а 0022 — адрес PD-контроллера на этой шине.

Команда получения журнала PD-контроллера:

```text
cat /sys/kernel/debug/usb/fusb302-2-0022
```

Примечание: в имени `fusb302-2-0022` число 2 обозначает соответствующую шину i2c, а 0022 — адрес PD-контроллера. Этот узел относится к fusb302; для других микросхем имена узлов будут отличаться.

Помимо журнала, дополнительную информацию можно получить в узле Type-C по следующему пути:

```text
console:/ # ls /sys/class/typec
port0 port0-partner
```

`port0` обозначает интерфейс Type-C со стороны SoC, а `port0-partner` — каталог узла устройства, подключённого через этот интерфейс.

Информация об ориентации подключения Type-C:

```text
cat /sys/class/typec/port0/orientation
reverse
```

В `port0-partner` может быть несколько каталогов. Каталог, соответствующий DP Alt Mode, содержит подкаталог `displayport`, а значение `svid` равно `0xff01`.

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

Получение текущего назначения контактов:

```text
cat /sys/class/typec/port0-partner/port0-partner.0/displayport/pin_assignment
C [D]

#The connected device supports C assignment and D assignment. The current configuration is D
assignment.
```

Примечание: выше описано получение информации от PD-контроллера на основе TCPM. Если используемый PD-контроллер не основан на TCPM, уточните способ получения информации у его поставщика.

### 3.5 Проверка состояния VOP

Команда проверки состояния VOP:

```text
console:/ # cat /sys/kernel/debug/dri/0/summary
```

При подключении дисплея DP к RK3399 команда cat выдаёт следующий результат:

```text
console:/ # cat /sys/kernel/debug/dri/0/summary
VOP [ff8f0000.vop]: ACTIVE
   Connector: DP-1

      bus_format[0]: Unknown
      overlay_mode[0] output_mode[0] color_space[0]
   Display mode: 2560x1440p60
      clk[241500] real_clk[241500] type[40] flag[9]
      H: 2560 2608 2640 2720
      V: 1440 1443 1448 1481

   win0-0: DISABLED
   win2-0: ACTIVE
      format: AB24 little-endian (0x34324241) SDR[0] color_space[0]
      csc: y2r[0] r2r[0] r2y[0] csc mode[0]
      zpos: 0
      src: pos[0x0] rect[2560x1440]
      dst: pos[0x0] rect[2560x1440]
      buf[0]: addr: 0x00000000f9228000 pitch: 10240 offset: 0
   win2-1: DISABLED
   win2-2: DISABLED
   win2-3: DISABLED
   post: sdr2hdr[0] hdr2sdr[0]

   pre : sdr2hdr[0]
   post CSC: r2y[0] y2r[0] CSC mode[1]
VOP [ff900000.vop]: DISABLED
```

`VOP [ff8f0000.vop]: ACTIVE`: `ff8f0000.vop` — VOPL; `ACTIVE` означает, что этот VOP включён.

`VOP [ff900000.vop]: DISABLED`: `ff900000.vop` — VOPB; `DISABLED` означает, что этот VOP отключён.

`Connector: DP-1` — информация об интерфейсе.

`Display mode: 2560x1440p60` — текущее выходное разрешение.

`winx-x: DISABLED/ACTIVE` — информация о слоях.

### 3.6 Изменение уровня журналирования DRM

В DRM определены следующие категории журналирования. Нужные сообщения можно включать динамически:

```text
enum drm_debug_category {
      DRM_UT_CORE      = 0x01,
      DRM_UT_DRIVER    = 0x02,

      DRM_UT_KMS       = 0x04,
      DRM_UT_PRIME     = 0x08,
      DRM_UT_ATOMIC    = 0x10,
      DRM_UT_VBL       = 0x20,
      DRM_UT_STATE     = 0x40,
      DRM_UT_LEASE     = 0x80,
      DRM_UT_DP        = 0x100,

      DRM_UT_DRMRES    = 0x200,
};
```

При отладке DP, особенно при ошибках commit, обычно включают категорию ATOMIC:

```text
echo 0x10 > /sys/module/drm/parameters/debug
```

Для вывода журнала чтения и записи DPCD выполните:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

## 4. Настройка сигналов PHY

Базовые адреса UPHY0 и UPHY1:

```text
UPHY0 BASE: 0xff7c0000
UPHY1 BASE: 0xff800000
```

### 4.1 Регистр амплитуды напряжения

Регистр амплитуды — `TX_TXCC_MGNFS_MULT_000`. Смещения регистров для каждой линии:

```text
lane0: 0x10140[7:0]
lane1: 0x10940[7:0]

lane2: 0x11140[7:0]
lane3: 0x11040[7:0]
```

Диапазон настройки — от `0x00` до `0x36`. Чем больше значение регистра, тем меньше амплитуда; чем меньше значение, тем больше амплитуда.

Пример для UPHY0 Lane0: установка максимальной амплитуды:

```text
io -4 0xff7d0140 0x00
```

Установка минимальной амплитуды:

```text
io -4 0xff7d0140 0x36
```

### 4.2 Регистр предыскажения

Регистр предыскажения — `TX_TXCC_CPOST_MULT_00`. Смещения для каждой линии:

```text
lane0: 0x10130[7:0]
lane1: 0x10930[7:0]
lane2: 0x11130[7:0]

lane3: 0x11930[7:0]
```

Диапазон настройки — от `0x00` до `0xff`. Английский оригинал утверждает: чем больше значение, тем больше предыскажение; чем меньше значение, тем также больше предыскажение. Это противоречие исходного текста сохранено и отмечено в записи проверки.

Пример для UPHY0 Lane0: установка максимального предыскажения:

```text
io -4 0xff7d0140 0xff
```

Установка минимального предыскажения:

```text
io -4 0xff7d0140 0x00
```

### 4.3 Регистр Boost

Регистр Boost — `TX_DIAG_TX_DRV`. Смещения для каждой линии:

```text
lane0: 0x10784[10:8]
lane1: 0x10f84[10:8]
lane2: 0x11784[10:8]

lane3: 0x11f84[10:8]
where bit[10] is the enable bit, and bit[9:8] is the configuration value.
```

Здесь bit[10] включает функцию, а bit[9:8] задаёт её значение; английская строка внутри исходного блока сохранена для сверки.

При включённой функции Boost большее значение регистра означает большее усиление, меньшее — меньшее усиление.

Пример для UPHY0 Lane0: отключение Boost:

```text
io -4 0xff7d0784 0x000
```

Пример для UPHY0 Lane0: при включении Boost доступны следующие значения:

```text
io -4 0xff7d0784 0x400
io -4 0xff7d0784 0x500

io -4 0xff7d0784 0x600
io -4 0xff7d0784 0x700
```

### 4.4 Регистр Scale

Регистр Scale — `TX_TXCC_CAL_SCLR_MULT`. Смещения для каждой линии:

```text
lane0: 0x1011c[8:0]
lane1: 0x1091c[8:0]
lane2: 0x1111c[8:0]

lane3: 0x1191c[8:0]
where bit[8] is the direction bit, and bit[7:0] is the configuration value.
```

Здесь bit[8] задаёт направление изменения, а bit[7:0] — значение настройки; исходная английская строка выше сохранена.

При `bit[8]=1` большее значение регистра сильнее увеличивает амплитуду напряжения. Диапазон настройки — от `0x100` до `0x13c`.

Пример для UPHY0 Lane0: максимальное усиление:

```text
io -4 0xff7d011c 0x13c
```

Минимальное усиление:

```text
io -4 0xff7d011c 0x100
```

При `bit[8]=0` большее значение регистра сильнее уменьшает амплитуду напряжения. Диапазон настройки — от `0x00` до `0x3c`.

Пример для UPHY0 Lane0: максимальное ослабление:

```text
io -4 0xff7d011c 0x3c
```

Минимальное ослабление:

```text
io -4 0xff7d011c 0x00
```

### 4.5 Методика отладки

Если настройки по умолчанию не удовлетворяют требованиям, сначала настройте регистры амплитуды и предыскажения.

Если регулировки регистра амплитуды недостаточно для достижения требуемого напряжения, дополнительно настройте регистр Scale.

Если регулировки регистра предыскажения недостаточно, дополнительно настройте регистр Boost.

Примечание: согласно оригиналу, RK3399 поддерживает автоматизированные испытания сигналов. Для таких испытаний необходимо запросить соответствующий патч у FAE.

### 4.6 Настройка в коде

Настройки регистров по умолчанию находятся в `drivers/phy/rockchip/phy-rockchip-typec.c`.

Настройки регистров амплитуды и предыскажения:

```text
static const struct phy_config tcphy_default_config[3][4] = {
      {{ .swing = 0x2a, .pe = 0x00 },
      { .swing = 0x1f, .pe = 0x15 },

      { .swing = 0x14, .pe = 0x22 },
      { .swing = 0x02, .pe = 0x2b } },

      {{ .swing = 0x21, .pe = 0x00 },
      { .swing = 0x12, .pe = 0x15 },
      { .swing = 0x02, .pe = 0x22 },
      { .swing = 0, .pe = 0 } },

      {{ .swing = 0x15, .pe = 0x00 },
      { .swing = 0x00, .pe = 0x15 },
      { .swing = 0, .pe = 0 },
      { .swing = 0, .pe = 0 } },

};
```

Строки массива соответствуют уровням swing, столбцы — уровням предыскажения. Например, для `swing level = 0` и `pre-emphasis level = 1` используется элемент `tcphy_default_config[0][1]`.

Настройки регистров Boost и Scale по умолчанию находятся в функции `rockchip_dp_phy_set_voltages`:

```text
if (dp->voltage[lane] == 2 && dp->pre[lane] == 0 && dp->link_rate != 540000) {
   writel(0x700, tcphy->base + TX_DIAG_TX_DRV(lane));
   writel(0x13c, tcphy->base + TX_TXCC_CAL_SCLR_MULT(lane));

} else {
   writel(0x128, tcphy->base + TX_TXCC_CAL_SCLR_MULT(lane));
   writel(0x0400, tcphy->base + TX_DIAG_TX_DRV(lane));
 }
```

Примечание: при `swing level = 2` и `pre-emphasis level = 0` настройки Boost и Scale по умолчанию различаются для скоростей RBR, HBR и HBR2.

## 5. Частые вопросы

### 5.1 Поддержка I2C-over-AUX

I2C-over-AUX поддерживает только чтение EDID; MCCS и другие функции не поддерживаются.

{% endraw %}
