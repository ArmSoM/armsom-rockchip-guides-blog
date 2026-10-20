---
title: "RK3399-DisplayPort-Entwicklerleitfaden: TCPM, EXTCON, HPD und PHY-Debugging"
description: "Vollständige RK3399-DP-Funktionen, Device-Tree-Konfiguration, HPD-Patch, Debug-Befehle und Beispiele für PHY-Register."
translation_key: "042-rockchip-rk3399-displayport"
slug: "042-rockchip-rk3399-displayport"
lang: "de"
date: "2026-10-16"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "linux"
products: []
tags: ["RK3399", "DisplayPort", "TCPM", "EXTCON", "PHY"]
keywords: "ArmSoM Rockchip RK3399 DisplayPort DP Type-C PHY"
excerpt: "Vollständige RK3399-DP-Funktionen, Device-Tree-Konfiguration, HPD-Patch, Debug-Befehle und Beispiele für PHY-Register."
---

{% raw %}

# RK3399-DisplayPort-Entwicklerleitfaden: TCPM, EXTCON, HPD und PHY-Debugging

Dies ist eine Plattformreferenz für Rockchip RK3399 und die in der Quelle beschriebenen BSPs mit Linux-Kernel 4.4 und neuer. Die TCPM- und EXTCON-Konfigurationen gelten nur für die in den jeweiligen Abschnitten genannten Kernel-Bereiche. Eine Unterstützung auf jedem ArmSoM-Board wird damit nicht zugesichert: Prüfen Sie den tatsächlichen SoC, die DP-/Type-C-Verdrahtung, den PD-Controller, die Firmware, den Device Tree und die BSP-Patches. Es wurde keine Prüfung an ArmSoM-Hardware durchgeführt; Protokolle, Werte und Testmöglichkeiten sind Beispiele oder Aussagen aus der Quelle.

Quelle: Rockchip RK3399 Developer Guide DisplayPort, in beiden Quellsprachen V1.0.0, jedoch mit unterschiedlichen Deckblattdaten. Widersprüche der Quelle bleiben erhalten; die Registerbeispiele sind keine für ein bestimmtes Board validierten Befehle. Die Abbildungen dieser deutschen Fassung stammen wie im englischen Artikel aus dem englischen PDF. [Redaktionelle Hinweise](/docs/rockchip-rk3399-displayport/EDITORIAL-NOTES.md). [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Einführung in DP auf der RK3399-Plattform

### 1.1 Funktionsübersicht

Die Funktionsparameter der DP-Schnittstelle des RK3399 lauten:

| Funktion | RK3399 |
| --- | --- |
| Version | 1.2 |
| SST | Unterstützt |
| MST | Nicht unterstützt |
| DSC | Nicht unterstützt |
| Maximale Auflösung | 4K@60Hz |
| Main-Link-Lanes | 1/2/4 Lanes |
| Main-Link-Datenrate | 5.4/2.7/1.62 Gbps/lane |
| AUX_CH | 1 M |
| Farbformat | RGB/YUV444/YUV422 |
| Farbtiefe | 8/10 bit |
| Type-C-Unterstützung | Unterstützt |
| I2S | Unterstützt |
| SPDIF | Unterstützt |

### 1.2 Verbindungen zwischen DP, VOP und PHY

Die Verbindungen zwischen DP, VOP und PHY sind nachfolgend dargestellt:

![Technische Originalabbildung (englisches PDF, S. 6)](/docs/rockchip-rk3399-displayport/assets/en-p6-1.png)

Der RK3399 besitzt 2 VOPs: VOPB und VOPL. DP kann einen davon als Eingangsquelle auswählen. Wird VOPB als DP-Eingangsquelle gewählt, beträgt die maximal unterstützte Auflösung 4096x2160@60Hz. Bei VOPL als Eingangsquelle beträgt sie 2650x1600@60Hz. Für die DP-Ausgabe stehen 2 Optionen zur Verfügung: UPHY0 und UPHY1. Es kann jedoch immer nur eine davon verwendet werden; ein gleichzeitiger Betrieb ist nicht möglich.

### 1.3 Codepfade

Code des Kernel-Treibers

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

DTS-Referenzkonfiguration

```text
arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi
```

### 1.4 Laden des Treibers

Der DP-Block des RK3399 besitzt einen internen Mikrocontroller. Vor Beginn des DP-Betriebs wird zunächst die Firmware geladen. Sie liegt unter:

```text
/lib/firmware/rockchip/dptx.bin
```

Anhand des folgenden Protokolls lässt sich erkennen, ob der Treiber erfolgreich geladen wurde:

```text
[  3.796582][ T9] rockchip-drm display-subsystem: bound fec00000.dp (ops
cdn_dp_component_ops)
```

## 2. Funktionskonfiguration

DP und USB3.0 teilen sich den PHY (Type-C-PHY). Je nach Schnittstelle gibt es 2 Konfigurationsmodi: DP Alt Mode (Type-C) und Legacy Mode (DP-Standardanschluss).

Die Softwareabläufe dieser beiden Verfahren unterscheiden sich nur geringfügig. Bei der Type-C-Schnittstelle übermittelt der auf TCPM basierende PD-Chip-Treiber HPD-Informationen über Callback-Funktionen an den PHY-Treiber und den DP-Controller-Treiber. Beim DP-Standardanschluss meldet ein virtueller PD-Treiber die am HPD-Pin erfassten HPD-Informationen an den PHY-Treiber und den DP-Controller.

Die Lane- und Pinzuordnungen am Type-C-PHY lauten:

| PHY-Lanes/Modulpins | Pins der Type-C-Buchse |
| --- | --- |
| Lane0 (tx_p/m_ln_0) | TX1+/TX1- (Pins A2/A3) |
| Lane1 (tx_rx_p/m_ln_1) | RX1+/RX1- (Pins B11/B10) |
| Lane2 (tx_rx_p/m_ln_2) | RX2+/RX2- (Pins A11/A10) |
| Lane3 (tx_p/m_ln_3) | TX2+/TX2- (Pins B2/B3) |

Die Zuordnung der USB- und DP-Lanes am Type-C-PHY unterstützt die in DP Alt Mode aufgeführten Belegungen C, D, E usw. (normale Orientierung):

| PHY-Lanes | C | D | E |
| --- | --- | --- | --- |
| 0 | ML2 | SSTX | ML2 |
| 1 | ML3 | SSRX | ML3 |
| 2 | ML0 | ML0 | ML0 |
| 3 | ML1 | ML1 | ML1 |

Die Zuordnung bei umgekehrter Orientierung lautet:

| PHY-Lanes | C | D | E |
| --- | --- | --- | --- |
| 0 | ML0 | ML0 | ML0 |
| 1 | ML1 | ML1 | ML1 |
| 2 | ML2 | SSTX | ML2 |
| 3 | ML3 | SSRX | ML3 |

Zusätzlich steuert der PHY selbst die Polarität für die normale und umgekehrte Type-C-Orientierung.

### 2.1 DP Alt Mode (Type-C)

Bei ausschließlicher Verwendung von UPHY0 wird die DP-Schnittstelle beispielsweise wie folgt aktiviert:

```text
&cdn_dp {
   status = "okay";
   phys = <&tcphy0_dp>;

};
```

Legen Sie den von DP verwendeten VOP fest, beispielsweise VOPB:

```text
&dp_in_vopb {
   status = "okay";
};


&dp_in_vopl {
   status = "disabled";
};
```

PHY aktivieren:

```text
&tcphy0 {
   status = "okay";
};
```

Ab Linux-Kernel 5.10 verwendet der PD-Chip-Treiber die TCPM-Architektur und registriert Callback-Funktionen zur Meldung von HPD-Informationen. Unter Linux-Kernel 4.19 und älter verwendet der PD-Chip dafür den EXTCON-Mechanismus. Die DTS- und PD-Chip-Konfigurationen unterscheiden sich zwischen diesen beiden Verfahren.

#### 2.1.1 Konfiguration der TCPM-Architektur

Bei ausschließlicher Verwendung von UPHY0 muss der Type-C-PHY beispielsweise wie folgt aktiviert und konfiguriert werden:

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

In der obigen Konfiguration:

svid: Für DP ist der Wert fest auf 0xff01 gesetzt.

tcphy_dp_altmode_switch: Dient zur Zuordnung des PD-Chip-Knotens.

Die Type-C-Schnittstelle muss die Lane-Belegung und den HPD-Zustand über Type-C-CC-Erkennung und PD-Aushandlung konfigurieren. Deshalb muss auch der PD-Chip konfiguriert werden:

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

displayport wird als DP-Knoten konfiguriert.

Im Knoten altmode@0 wird svid fest auf 0xff01 und vdo fest auf 0xffffffff gesetzt.

dp_mode_sw dient zur Zuordnung des Type-C-PHY-Knotens.

Hinweis: Die Quelle nennt fusb302 und hub311 als unterstützte PD-Chips. Der Treiber für fusb302 liegt unter /drivers/usb/typec/tcpm/fusb302.c, der für hub311 unter /drivers/usb/typec/tcpm/tcpci_husb311.c.

#### 2.1.2 Konfiguration des EXTCON-Mechanismus

Bei ausschließlicher Verwendung von UPHY0 muss der Type-C-PHY beispielsweise wie folgt aktiviert und konfiguriert werden:

```text
&tcphy0 {
   extcon = <&fusb0>;
   status = "okay";

};
```

Konfiguration des DP-Controllers:

```text
&cdn_dp {
   status = "okay";
   extcon = <&fusb0>;

   phys = <&tcphy0_dp>;
};
```

In der obigen Konfiguration:

extcon ist die Referenz auf den PD-Chip-Knoten.

### 2.2 Legacy Mode (DP-Standardanschluss)

Bei ausschließlicher Verwendung von UPHY0 entspricht die Aktivierung der DP-Schnittstelle derjenigen der Type-C-Schnittstelle. Die Konfiguration lautet:

```text
&cdn_dp {
   status = "okay";
   phys = <&tcphy0_dp>;

};
```

Legen Sie den von DP verwendeten VOP fest, beispielsweise VOPB:

```text
&dp_in_vopb {
   status = "okay";
};


&dp_in_vopl {
   status = "disabled";
};
```

PHY aktivieren:

```text
&tcphy0 {
   status = "okay";
};
```

Beim Standardanschluss werden ab Linux-Kernel 5.10 GPIO-Interrupts zur Erfassung der HPD-Informationen verwendet. Unter Linux-Kernel 4.19 und älter erfolgt die Meldung über EXTCON. Ein spezieller Patch ist erforderlich, um die Informationen am HPD-Pin über Callback-Funktionen oder den EXTCON-Mechanismus zu übermitteln.

#### 2.2.1 DP-Lane-Zuordnung

An der Type-C-PHY-Schnittstelle gilt folgende Zuordnung zwischen PHY-Lanes und Type-C-Pins:

| PHY-Lanes/Modulpins | Pins der Type-C-Buchse |
| --- | --- |
| Lane0 (tx_p/m_ln_0) | TX1+/TX1- (Pins A2/A3) |
| Lane1 (tx_rx_p/m_ln_1) | RX1+/RX1- (Pins B11/B10) |
| Lane2 (tx_rx_p/m_ln_2) | RX2+/RX2- (Pins A11/A10) |
| Lane3 (tx_p/m_ln_3) | TX2+/TX2- (Pins B2/B3) |

Die PHY-Lanes unterstützen nur zwei feste Zuordnungsverfahren: eine 4-Lane- und eine 2-Lane-Zuordnung.

Die 4-Lane-Zuordnung lautet:

| PHY-Lanes | DP-Lane |
| --- | --- |
| Lane0 | ML2 |
| Lane1 | ML3 |
| Lane2 | ML0 |
| Lane3 | ML1 |

Die 2-Lane-Zuordnung lautet:

| PHY-Lanes | DP-Lane |
| --- | --- |
| Lane2 | ML0 |
| Lane3 | ML1 |

#### 2.2.2 Patch für HPD-Benachrichtigungen

Unter Linux-Kernel 4.19 und älter wird EXTCON zur Meldung von HPD-Informationen verwendet; dafür muss der folgende Patch angewendet werden:

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

Zusätzlich zum obigen Patch muss folgende Kompilierungsoption aktiviert werden:

```text
CONFIG_EXTCON_PD_VIRTUAL=y
```

#### 2.2.3 DTS-Konfiguration

Bei ausschließlicher Verwendung von UPHY0 und dem nachfolgenden Hardwaredesign ergibt sich die in den Abbildungen gezeigte DP-Lane-Zuordnung:

![Technische Originalabbildung (englisches PDF, S. 24)](/docs/rockchip-rk3399-displayport/assets/en-p24-1.png)

![Technische Originalabbildung (englisches PDF, S. 25)](/docs/rockchip-rk3399-displayport/assets/en-p25-1.png)

![Technische Originalabbildung (englisches PDF, S. 25)](/docs/rockchip-rk3399-displayport/assets/en-p25-2.png)

2.2.3.1 Kernel 5.10 und neuere Versionen

Die Konfiguration des cdn-dp-Knotens lautet:

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

Konfiguration des PHY-Knotens:

```text
&tcphy0 {
   status = "okay";
   rockchip, dp-lane-mux = <2 3 0 1>;

}
```

Bei einem Hardwaredesign mit 2 Lanes ändern Sie die PHY-Knotenkonfiguration wie folgt:

```text
&tcphy0 {
   status = "okay";
   rockchip, dp-lane-mux = <2 3>;

}
```

2.2.3.2 Kernel 4.19 und ältere Versionen

Die Konfiguration des virtuellen EXTCON-Treibers lautet:

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

In der obigen Konfiguration:

dp-det-gpios: Der HPD-GPIO

vpd,init-flip: Legt fest, ob Type-C die umgekehrte Zuordnung verwendet. 0 steht für die normale und 1 für die umgekehrte Zuordnung.

vpd,init-mode: Konfiguriert den aktuellen PHY-Nutzungsmodus. 0 und 1 bedeuten nur USB, 2 nur DP und 3 gemeinsame Nutzung durch USB/DP.

Konfiguration des DP-Controller-Knotens:

```text
&cdn_dp {
   status = "okay";
   extcon = <&vpd0>;

   phys = <&tcphy0_dp>;
};
```

Bei einem Hardwaredesign mit 2 Lanes ändern Sie die Konfiguration des virtuellen EXTCON-Treibers wie folgt:

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

### 2.3 DP-Boot-Logo

Der RK3399 unterstützt beim Start kein U-Boot-Logo.

## 3. Gängige Debugging-Verfahren

### 3.1 Prüfen des Connector-Status

Im Verzeichnis /sys/class/drm sind die vom Treiber registrierten Karten sichtbar. In der folgenden Liste sind card0-DP-1 und card0-DP-2 DP-Anzeigegeräte:

```text
console:/ # ls /sys/class/drm
card0 card0-DP-1 card0-HDMI-A-1 card0-eDP-1 renderD128 version
```

Das Verzeichnis card0-DP-1 enthält Folgendes:

```text
console:/ # ls /sys/class/drm/card0-DP-1/
device dpms edid enabled modes power status subsystem uevent
```

Aktivierungszustand prüfen:

```text
console:/ # cat /sys/class/drm/card0-DP-1/enabled
enabled
```

Verbindungszustand prüfen:

```text
console:/ # cat /sys/class/drm/card0-DP-1/status
connected
```

Liste der vom Gerät unterstützten Auflösungen:

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

Die EDID des Geräts lässt sich mit folgendem Befehl speichern:

```text
console:/ # cat /sys/class/drm/card0-DP-1/edid > /data/edid.bin
```

### 3.2 Aktivierung/Deaktivierung von DP erzwingen

```text
# Force disable DP
console:/ # echo off > /sys/class/drm/card0-DP-1/status
# Force enable DP

console:/ # echo on > /sys/class/drm/card0-DP-1/status
# Restore hotplug detection
console:/ # echo detect > /sys/class/drm/card0-DP-1/status
```

### 3.3 Lesen und Schreiben von DPCD

DPCD wird über AUX_CH gelesen und geschrieben. Die Implementierung des Lese-/Schreibknotens liegt unter:

```text
/drivers/gpu/drm/drm_dp_aux_dev.c
```

Stellen Sie vor Verwendung dieser Funktion sicher, dass die entsprechenden Kompilierungsoptionen konfiguriert sind:

```text
CONFIG_DRM_DP_AUX_CHARDEV=y
```

DPCD wird wie folgt gelesen:

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

Schreiben in DPCD-Register:

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

### 3.4 Debugging der Type-C-Schnittstelle

Hinweis: Dieser Abschnitt gilt nur für Linux-Kernel 5.10 und neuere Versionen.

Die HPD-Erkennung der Type-C-Schnittstelle übernimmt der PD-Chip; der zugehörige Softwareablauf wird hauptsächlich durch das TCPM-Framework realisiert. Das TCPM-Erkennungsprotokoll lässt sich folgendermaßen abrufen:

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

Im Verzeichnis /sys/kernel/debug/usb/ finden Sie fusb302-2-0022 und tcpm-2-0022. Der Knoten fusb302-2-0022 gehört zum PD-Chip, tcpm-2-0022 zum TCPM-Framework. Mit folgendem Befehl rufen Sie das Protokoll des TCPM-Frameworks ab:

```text
cat /sys/kernel/debug/usb/tcpm-2-0022
```

Hinweis: In tcpm-2-0022 bezeichnet die mittlere 2 den zugehörigen i2c-Bus und die abschließende 0022 die i2c-Adresse des PD-Chips.

Das Protokoll des PD-Chips wird mit folgendem Befehl abgerufen:

```text
cat /sys/kernel/debug/usb/fusb302-2-0022
```

Hinweis: In fusb302-2-0022 bezeichnet die mittlere 2 den zugehörigen i2c-Bus und die abschließende 0022 die i2c-Adresse des PD-Chips. Der obige Knoten gehört zum Chip fusb302; bei anderen Chips unterscheidet sich der Knotenname.

Neben den Protokollen lassen sich unter dem Type-C-Knoten weitere Informationen abrufen. Sein Pfad lautet:

```text
console:/ # ls /sys/class/typec
port0 port0-partner
```

port0 bezeichnet die Type-C-Schnittstelle auf der SoC-Seite. port0-partner bezeichnet nach dem Verbinden über Type-C das Knotenverzeichnis des angeschlossenen Geräts.

Informationen zur Orientierung der Type-C-Verbindung:

```text
cat /sys/class/typec/port0/orientation
reverse
```

Unter port0-partner können mehrere Verzeichnisse vorhanden sein. Das zum DP Alt Mode gehörende Verzeichnis besitzt ein Unterverzeichnis displayport und den svid-Wert 0xff01.

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

Aktuelle Pinbelegung abrufen:

```text
cat /sys/class/typec/port0-partner/port0-partner.0/displayport/pin_assignment
C [D]

#The connected device supports C assignment and D assignment. The current configuration is D
assignment.
```

Hinweis: Oben wird die Informationsabfrage für einen PD-Chip auf Basis des TCPM-Frameworks beschrieben. Basiert der eingesetzte PD-Chip nicht auf TCPM, klären Sie die entsprechenden Informationen mit dessen Hersteller.

### 3.5 Prüfen des VOP-Status

Der Befehl zum Prüfen des VOP-Status lautet:

```text
console:/ # cat /sys/kernel/debug/dri/0/summary
```

Bei einem an den RK3399 angeschlossenen DP-Display ergibt cat folgende Ausgabe:

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

VOP [ff8f0000.vop]: ACTIVE — ff8f0000.vop ist VOPL; ACTIVE bedeutet, dass dieser VOP aktiviert ist.

VOP [ff900000.vop]: DISABLED — ff900000.vop ist VOPB; DISABLED bedeutet, dass dieser VOP deaktiviert ist.

Connector: DP-1 bezeichnet die Schnittstelle.

Display mode: 2560x1440p60 bezeichnet die aktuelle Ausgabeauflösung.

winx-x: DISABLED/ACTIVE gibt den Zustand der Ebene an.

### 3.6 Anpassen der DRM-Protokollstufe

DRM definiert folgende Ausgabestufen. Sie können die jeweilige Protokollausgabe bei Bedarf dynamisch aktivieren:

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

Bei der Fehlersuche an der DP-Schnittstelle, insbesondere bei Commit-Problemen, wird meist ATOMIC wie folgt aktiviert:

```text
echo 0x10 > /sys/module/drm/parameters/debug
```

Für die Ausgabe des DPCD-Lese-/Schreibprotokolls verwenden Sie folgenden Befehl:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

## 4. Anpassung des PHY-Signals

Die Basisadressen von UPHY0 und UPHY1 lauten:

```text
UPHY0 BASE: 0xff7c0000
UPHY1 BASE: 0xff800000
```

### 4.1 Register für die Spannungsamplitude

Das Register für die Spannungsamplitude heißt TX_TXCC_MGNFS_MULT_000. Die Registeroffsets der einzelnen Lanes lauten:

```text
lane0: 0x10140[7:0]
lane1: 0x10940[7:0]

lane2: 0x11140[7:0]
lane3: 0x11040[7:0]
```

Der Einstellbereich des Registers reicht von 0x00 bis 0x36. Je größer der Registerwert, desto kleiner die Amplitude; je kleiner der Wert, desto größer die Amplitude.

Am Beispiel von UPHY0 Lane0 wird die maximale Amplitude wie folgt konfiguriert:

```text
io -4 0xff7d0140 0x00
```

Konfiguration des Minimalwerts:

```text
io -4 0xff7d0140 0x36
```

### 4.2 Pre-Emphasis-Register

Das Pre-Emphasis-Register heißt TX_TXCC_CPOST_MULT_00. Die Registeroffsets der einzelnen Lanes lauten:

```text
lane0: 0x10130[7:0]
lane1: 0x10930[7:0]
lane2: 0x11130[7:0]

lane3: 0x11930[7:0]
```

Der Einstellbereich des Registers reicht von 0x00 bis 0xff. Je größer der Registerwert, desto stärker die Pre-Emphasis; je kleiner der Registerwert, desto stärker die Pre-Emphasis. Diese widersprüchliche Aussage der Quelle bleibt unverändert.

Am Beispiel von UPHY0 Lane0 wird die maximale Pre-Emphasis wie folgt konfiguriert:

```text
io -4 0xff7d0140 0xff
```

Konfiguration der minimalen Pre-Emphasis:

```text
io -4 0xff7d0140 0x00
```

### 4.3 Boost-Register

Das Boost-Register heißt TX_DIAG_TX_DRV. Die Registeroffsets der einzelnen Lanes lauten:

```text
lane0: 0x10784[10:8]
lane1: 0x10f84[10:8]
lane2: 0x11784[10:8]

lane3: 0x11f84[10:8]
where bit[10] is the enable bit, and bit[9:8] is the configuration value.
```

Bei aktivierter Boost-Funktion gilt: Je größer der Registerwert, desto größer die Boost-Amplitude; je kleiner der Wert, desto kleiner die Boost-Amplitude.

Am Beispiel von UPHY0 Lane0 wird die Boost-Funktion wie folgt deaktiviert:

```text
io -4 0xff7d0784 0x000
```

Zur Aktivierung von Boost am Beispiel von UPHY0 Lane0 stehen folgende Werte zur Verfügung:

```text
io -4 0xff7d0784 0x400
io -4 0xff7d0784 0x500

io -4 0xff7d0784 0x600
io -4 0xff7d0784 0x700
```

### 4.4 Skalierungsregister

Das Skalierungsregister heißt TX_TXCC_CAL_SCLR_MULT. Die Registeroffsets der einzelnen Lanes lauten:

```text
lane0: 0x1011c[8:0]
lane1: 0x1091c[8:0]
lane2: 0x1111c[8:0]

lane3: 0x1191c[8:0]
where bit[8] is the direction bit, and bit[7:0] is the configuration value.
```

Bei bit[8]=1 gilt: Je größer der Registerwert, desto stärker die Anhebung der Spannungsamplitude. Der Einstellbereich reicht von 0x100 bis 0x13c.

Am Beispiel von UPHY0 Lane0 wird die maximale Anhebung wie folgt konfiguriert:

```text
io -4 0xff7d011c 0x13c
```

Konfiguration der minimalen Anhebung:

```text
io -4 0xff7d011c 0x100
```

Bei bit[8]=0 gilt: Je größer der Registerwert, desto stärker die Dämpfung der Spannungsamplitude. Der Einstellbereich reicht von 0x00 bis 0x3c.

Am Beispiel von UPHY0 Lane0 wird die maximale Dämpfung wie folgt konfiguriert:

```text
io -4 0xff7d011c 0x3c
```

Konfiguration der minimalen Dämpfung:

```text
io -4 0xff7d011c 0x00
```

### 4.5 Debugging-Verfahren

Wenn die Standardkonfiguration die Anforderungen nicht erfüllt, passen Sie zuerst das Spannungsamplitudenregister und das Pre-Emphasis-Register an.

Wenn die Anpassung des Spannungsamplitudenregisters nicht ausreicht, passen Sie das Skalierungsregister an.

Wenn die Anpassung des Pre-Emphasis-Registers nicht ausreicht, passen Sie das Boost-Register an.

Hinweis: Laut Quelle unterstützt der RK3399 automatisierte Signaltests. Wenden Sie sich bei entsprechendem Testbedarf an den FAE, um Unterstützung für die erforderlichen Patches zu erhalten.

### 4.6 Konfiguration im Code

Die Standardkonfiguration der Register befindet sich in drivers/phy/rockchip/phy-rockchip-typec.c.

Die Spannungsamplituden- und Pre-Emphasis-Register lauten:

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

Die Zeilen des Arrays entsprechen den Swing-Stufen, die Spalten den Pre-Emphasis-Stufen. Beispielsweise gehört zu swing level = 0 und pre-emphasis level = 1 das Element tcphy_default_config[0][1].

Die Standardkonfiguration von Boost- und Skalierungsregister steht in der Funktion rockchip_dp_phy_set_voltages:

```text
if (dp->voltage[lane] == 2 && dp->pre[lane] == 0 && dp->link_rate != 540000) {
   writel(0x700, tcphy->base + TX_DIAG_TX_DRV(lane));
   writel(0x13c, tcphy->base + TX_TXCC_CAL_SCLR_MULT(lane));

} else {
   writel(0x128, tcphy->base + TX_TXCC_CAL_SCLR_MULT(lane));
   writel(0x0400, tcphy->base + TX_DIAG_TX_DRV(lane));
 }
```

Hinweis: Bei den Datenraten RBR, HBR und HBR2 unterscheiden sich bei swing level = 2 und pre-emphasis level = 0 die Standardkonfigurationen von Boost- und Skalierungsregister.

## 5. Häufig gestellte Fragen

### 5.1 Unterstützung von I2C-over-AUX

I2C-over-AUX unterstützt ausschließlich das Lesen der EDID, nicht jedoch MCCS oder andere Funktionen.

{% endraw %}
