---
title: "Rockchip DisplayPort vollständig erklärt: RK3576 MST, RK3588 SST und Fehlersuche"
description: "Vollständige Referenz zu DP-Device-Tree, SST/MST, Type-C, HPD, Panels, HDR/HDCP, Taktquelle, DP-Status und Bandbreite."
translation_key: "040-rockchip-displayport"
slug: "040-rockchip-displayport"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["RK3576", "RK3588", "DisplayPort", "MST", "SST", "Type-C"]
keywords: "ArmSoM Rockchip RK3576 RK3588 DisplayPort DP MST SST"
excerpt: "Vollständige Referenz zu DP-Device-Tree, SST/MST, Type-C, HPD, Panels, HDR/HDCP, Taktquelle, DP-Status und Bandbreite."
---

{% raw %}

# Rockchip DisplayPort vollständig erklärt: RK3576 MST, RK3588 SST und Fehlersuche

Dies ist eine Rockchip-Plattformreferenz. Der Produktgeltungsbereich der Quelle umfasst RK3576 / Linux-Kernel 6.1 sowie RK3588 / Linux-Kernel 5.10 oder 6.1. Prüfen Sie für ein ArmSoM-Projekt bei jeder Platine den SoC, die herausgeführten DP-/Type-C-Schnittstellen, den PD-Controller, die PHY-Verdrahtung, die SDK-/BSP-Patches und die Kernelkonfiguration. Dies bedeutet nicht, dass jede ArmSoM-Platine sämtliche beschriebenen Modi unterstützt. Es wurden keine ArmSoM-Hardwaretests durchgeführt; Protokolle, Displayfotos und Leistungswerte sind Quellenbeispiele oder Fähigkeitsangaben.

Quellen: die chinesische Rockchip-DisplayPort-Anleitung (Deckblatt V1.3.0, Änderungstabelle V1.3.3) und die englische V1.2.1. Wie ausdrücklich genehmigt, bildet der neuere chinesische Haupttext die gemeinsame Grundlage. Insbesondere stammen die detaillierten SST-/MST-Knoten- und Konfigurationsabschnitte §2.1–2.4, dclk source §2.9 und DP Status §3.10 aus der neueren chinesischen Quelle; sie werden nicht als Bestandteil der älteren englischen Ausgabe dargestellt. Die chinesische Fassung verwendet ihre 17 Originalabbildungen; Englisch und Russisch verwenden die 17 entsprechenden Originale aus der englischen PDF-Datei. Diese deutsche Fassung übernimmt ebenfalls die Bildadressen des englischen Artikels. Für die neuen Erläuterungen wurden keine zusätzlichen eigenständigen Abbildungen gefunden. Code und Befehle folgen der neueren chinesischen Quelle; Originalkommentare bleiben erhalten.

[Redaktionelle Hinweise](/docs/rockchip-displayport/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Einführung in Rockchip DisplayPort

### 1.1 Eigenschaften

Die Fähigkeiten der DP-Schnittstellen von Rockchip RK3576 und RK3588 sind nachfolgend aufgeführt:

| Funktion | RK3576 | RK3588 |
| --- | --- | --- |
| Version | 1.4a | 1.4a |
| SST | Unterstützt | Unterstützt |
| MST | Unterstützt | Nicht unterstützt |
| DSC | Nicht unterstützt | Nicht unterstützt |
| Maximale Auflösung | 4K@120Hz | 8K@30Hz |
| Main-Link-Lanes | 1/2/4 lanes | 1/2/4 lanes |
| Main-Link-Datenrate | 8.1/5.4/2.7/1.62 Gbps/lane | 8.1/5.4/2.7/1.62 Gbps/lane |
| AUX_CH | 1 M | 1 M |
| Farbformat | RGB/YUV444/YUV422/YUV420 | RGB/YUV444/YUV422/YUV420 |
| Farbtiefe | 8/10 bit (6bit nur für RGB) | 8/10 bit (6bit nur für RGB) |
| Geteilter Anzeigemodus | Unterstützt | Unterstützt |
| HDCP | HDCP2.2/HDCP1.3 | HDCP2.2/HDCP1.3 |
| Type-C-Unterstützung | DP Alternate Mode | DP Alternate Mode |
| I2S | Unterstützt | Unterstützt |
| SPDIF | Unterstützt | Unterstützt |
| HDR | Unterstützt | Unterstützt |
| DP Dual Mode(DP++) | Nicht unterstützt | Nicht unterstützt |

Hinweis:

1. Laut Quelle sind RK3576 und RK3528 abwärtskompatibel zu DP1.2.

RK3576 besitzt nur eine physische DP-Schnittstelle, nimmt intern im MST-Modus jedoch drei Anzeigedatenströme entgegen. Zur Unterscheidung von physischen Schnittstellen heißen diese Stream-0, Stream-1 und Stream-2. Die maximalen Fähigkeiten der einzelnen Streams sind:

| DP-Stream-Kanal | Maximale Breite | Maximale Höhe | Maximaler Pixeltakt |
| --- | --- | --- | --- |
| Stream-0 | 4096 | 4096 | 1188MHz |
| Stream-1 | 2560 | 2560 | 300MHz |
| Stream-2 | 1920 | 1920 | 150MHz |

### 1.2 Verbindungen zwischen DP und VOP

RK3576 besitzt drei VOP Video Ports und einen DP-Controller. Im MST-Modus kann der DP-Controller bis zu drei Anzeigedatenströme von VOP empfangen. Jeder der Streams Stream-0/1/2 kann Daten von Video Port0/1/2 empfangen. Der SST-Modus verwendet nur Stream-0; der MST-Modus kann Stream-0/1/2 verwenden.

![RK3576-Verbindungen zwischen VOP und DP-Streams](/docs/rockchip-displayport/assets/en-p6-1.png)

RK3588 besitzt vier VOP Video Ports und zwei DP-Controller. Nur Video Port 0/1/2 kann an DP0/1 ausgeben, wie nachfolgend dargestellt.

![RK3588-Verbindungen zwischen VOP und den beiden DP-Schnittstellen](/docs/rockchip-displayport/assets/en-p7-1.png)

Die beiden RK3588-DP-Schnittstellen unterstützen kein MST und nehmen intern nur Stream-0 entgegen. Auf Plattformen ohne MST gibt ein Video Port daher standardmäßig an Stream-0 der DP-Schnittstelle aus.

### 1.3 DP-Ausgabe

Je nach Anwendung kann die DP-Ausgabe einen Type-C-Anschluss, einen Standard-DP-Anschluss oder einen anderen Bridge-/Konverterchip verwenden.

![Optionen für die DP-Ausgabeschnittstelle](/docs/rockchip-displayport/assets/en-p8-1.png)

Im MST-Modus kann RK3576 bis zu drei Monitore über eine Reihenschaltung von MST-Monitoren anschließen:

![Reihenschaltung von MST-Monitoren](/docs/rockchip-displayport/assets/en-p8-2.png)

Nur der letzte Monitor der Kette darf ein SST-Monitor sein; alle davorliegenden Monitore müssen MST unterstützen.

Alternativ erfolgt der Anschluss über einen MST HUB:

![Verbindungen über einen MST HUB](/docs/rockchip-displayport/assets/en-p9-1.png)

Bei Verwendung eines MST HUB können die angeschlossenen DP-Monitore entweder SST- oder MST-Monitore sein.

### 1.4 Quellcodepfade

U-Boot-Treibercode:

```text
drivers/video/drm/dw-dp.c
drivers/phy/phy-rockchip-usbdp.c
```

Kerneltreibercode:

```text
drivers/gpu/drm/rockchip/dw-dp.c
drivers/phy/rockchip/phy-rockchip-usbdp.c
```

RK3576-DTS-Referenzkonfiguration:

```text
arch/arm64/boot/dts/rockchip/rk3576-evb1.dtsi
arch/arm64/boot/dts/rockchip/rk3576-test2.dtsi
```

RK3588-DTS-Referenzkonfiguration:

```text
arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb2-lp4.dtsi

arch/arm64/boot/dts/rockchip/rk3588-evb3-lp5.dtsi
arch/arm64/boot/dts/rockchip/rk3588-nvr-demo.dtsi
```

### 1.5 Laden des Treibers

Das folgende Protokoll zeigt, ob das Laden des Treibers abgeschlossen ist:

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

## 2. Funktionskonfiguration

Die grundlegende DTS-Knotenstruktur unterscheidet sich zwischen DP-Plattformen mit MST-Unterstützung und Plattformen, die ausschließlich SST unterstützen.

### 2.1 SST-Knotenkonfiguration

Auf reinen SST-Plattformen wie RK3588 unterstützt ein DP-Controller nur einen DP-Ausgang. Ein einzelner untergeordneter ports-Knoten genügt, um die verfügbaren Anzeigepfade dieses Ausgangs zu beschreiben:

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

### 2.2 MST-Knotenkonfiguration

Auf MST-fähigen Plattformen wie RK3576 unterstützt ein DP-Controller drei Anzeigedatenströme. Ein einzelner ports-Knoten kann die Pfade mehrerer DP-Kanäle nicht beschreiben; daher werden mehrere untergeordnete Knoten benötigt:

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

Die untergeordneten Knoten dp0/1/2 beschreiben jeweils die von Stream-0/1/2 unterstützten Anzeigepfade.

Gegenüber der DTS-Konfiguration einer reinen SST-Plattform besitzt eine MST-Plattform eine zusätzliche Ebene untergeordneter DP-Kanalknoten.

### 2.3 Aktivieren von DP

DP und USB3.0 teilen sich einen PHY. Die Konfiguration der PHY-Lanes hängt davon ab, ob die Ausgabe über Type-C oder einen anderen Anschluss erfolgt.

#### 2.3.1 DP Alt Mode (Type-C)

DisplayPort Alt Mode kommuniziert über die PD-Zustandsmaschine (Power Delivery) mit dem Monitor, um Lanes zuzuordnen und HPD-Informationen zu übertragen. Das folgende Diagramm zeigt den Eintritt in den DP-Modus über PD und die Übermittlung von HPD-Informationen mittels Attention-Befehlen.

![Eintritt in DP Alt Mode über PD und HPD-Benachrichtigung](/docs/rockchip-displayport/assets/en-p14-1.png)

2.3.1.1 SST-Controllerkonfiguration

Für reine SST-Plattformen wie RK3588:

```text
&dp0 {
   status = "okay";
};


&dp0_in_vp2 {
   status = "okay";
};
```

Dieses Beispiel aktiviert DP0 und bindet es an VOP Video Port2. Es handelt sich nur um eine Referenzkonfiguration. Aktivieren Sie im tatsächlichen Entwurf nach Bedarf DP0 oder DP1 und binden Sie es an den benötigten Video Port (0/1/2).

2.3.1.2 MST-Controllerkonfiguration

Für MST-fähige Plattformen wie RK3576:

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

Auf einer MST-fähigen Plattform müssen der DP-Geräteknoten, der gewünschte DP-Stream-Kanal und der an diesen Kanal gebundene VOP Video Port aktiviert werden. Dieses Beispiel aktiviert Stream-0 und bindet ihn an VOP Video Port2.

Auf MST-fähigen Plattformen verwendet der SST-Modus stets DP Stream-0. Daher muss dp0 aktiviert sein; konfigurieren Sie dp1 und dp2 entsprechend der tatsächlichen Verwendung.

2.3.1.3 PHY-Konfiguration

Die PHY-Konfiguration ist für Plattformen mit und ohne MST gleich. Das folgende Beispiel verwendet RK3588 usbdp phy0:

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

`sbu1-dc-gpios` und `sbu2-dc-gpios`:

Type-C SBU1 und SBU2 werden gemeinsam mit DP AUX_CH genutzt. In normaler Steckorientierung verwendet AUX_CH_P SBU1 und AUX_CH_N SBU2 (in der Quelle als SUB2 geschrieben). In umgekehrter Orientierung verwendet AUX_CH_P SBU2 und AUX_CH_N SBU1. DP verlangt einen Pulldown für AUX_CH_P und einen Pullup für AUX_CH_N. Die Zuordnung ändert sich mit der Steckorientierung. Rockchip steuert die Pullup-/Pulldown-Zustände von SBU1 und SBU2 über zwei GPIOs: sbu1-dc-gpios und sbu2-dc-gpios im DTS. Konfigurieren Sie diese entsprechend dem Schaltplan, beispielsweise als die unten gezeigten TYPEC0_SBU1_DC und TYPEC0_SBU2_DC. Der PHY-Treiber passt ihre Ausgangspegel an die aktuelle Orientierung an.

![Pullup-/Pulldown-Schaltung für SBU1/SBU2](/docs/rockchip-displayport/assets/en-p16-1.png)

`svid`:

Für DP ist der Wert fest auf 0xff01 gesetzt.

2.3.1.4 PD-Controllerkonfiguration

Type-C konfiguriert Lanes und HPD-Zustand durch CC-Erkennung und PD-Aushandlung. Konfigurieren Sie auch den PD-Controller:

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

In altmode@0 ist svid fest auf 0xff01 und vdo auf 0xffffffff gesetzt.

Die Quelle nennt fusb302 und hub311 als unterstützte PD-Chips. Ihre Treiber sind /drivers/usb/typec/tcpm/fusb302.c beziehungsweise /drivers/usb/typec/tcpm/tcpci_husb311.c.

#### 2.3.2 DP Legacy Mode

Bei einer Ausgabe ohne Type-C, ob über einen Standard-DP-Anschluss oder einen anderen Konverter, ist das Konfigurationsverfahren im Wesentlichen gleich und erfordert einen HPD-Pin. Verwenden Sie entweder den dedizierten DP_HPD-Pin mit passender IOMUX-Konfiguration oder einen gewöhnlichen GPIO zur Erkennung.

2.3.2.1 HPD-Konfiguration im SST-Modus

Konfigurieren Sie auf Plattformen ohne MST wie RK3588 den dedizierten DP_HPD-Pin wie folgt:

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

Für die HPD-Erkennung mit einem gewöhnlichen GPIO:

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

2.3.2.2 HPD-Konfiguration im MST-Modus

Konfigurieren Sie auf MST-fähigen Plattformen wie RK3576 den dedizierten DP_HPD-Pin wie folgt:

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

Für die HPD-Erkennung mit einem gewöhnlichen GPIO:

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

In beiden Konfigurationen gehört HPD zur gesamten DP-Schnittstelle und wird am Geräteknoten konfiguriert.

2.3.2.3 PHY-Konfiguration

DP und USB 3.0 teilen sich einen PHY. Bei DP-Ausgabe ohne Type-C muss im DTS angegeben werden, welche PHY-Lanes DP zugeordnet sind und in welcher Reihenfolge. DP kann zwei oder vier PHY-Lanes verwenden.

Die Nummern der physischen PHY-Lanes entsprechen folgenden Pins:

| Pin-Name | SSRX1 | SSTX1 | SSRX2 | SSTX2 |
| --- | --- | --- | --- | --- |
| PHY lane | 0 | 1 | 2 | 3 |

Verwenden Sie für vier DP-Lanes die folgende DTS-Eigenschaft:

```text
rockchip,dp-lane-mux = <x x x x>；
```

Verwenden Sie für zwei DP-Lanes:

```text
rockchip,dp-lane-mux = <x x>；
```

Der Index bezeichnet die DP-Lane, der Wert die PHY-Lane.

Sowohl bei Hardware mit zwei als auch mit vier Lanes wird üblicherweise OPTION1 oder OPTION2 aus der folgenden Darstellung verwendet.

![Zuordnung der PHY-Lanes für OPTION1/OPTION2](/docs/rockchip-displayport/assets/en-p20-1.png)

Editierbare Übertragung der obigen Pinzuordnungstabelle:

| Pin-Name | Type-C-Funktion | DP x4 Lane OPTION1 | DP x4 Lane OPTION2 | USB30 HOST + DP x2 Lane OPTION1 | USB30 HOST + DP x2 Lane OPTION2 |
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

DP mit vier Lanes, Zuordnung OPTION1:

| DP lane | PHY lane | Pin-Name |
| --- | --- | --- |
| 0 | 0 | SSRX1 |
| 1 | 1 | SSTX1 |
| 2 | 2 | SSRX2 |
| 3 | 3 | SSTX2 |

DP lane bezeichnet die DP-Lane-Nummer.

DTS-Konfiguration:

```text
&usbdp_phy1 {
   rockchip,dp-lane-mux = <0 1 2 3>;
   status = "okay";

};
```

DP mit vier Lanes, Zuordnung OPTION2:

| DP lane | PHY lane | Pin-Name |
| --- | --- | --- |
| 0 | 2 | SSRX2 |
| 1 | 3 | SSTX2 |
| 2 | 0 | SSRX1 |
| 3 | 1 | SSTX1 |

DP lane bezeichnet die DP-Lane-Nummer.

DTS-Konfiguration:

```text
&usbdp_phy1 {
   rockchip,dp-lane-mux = <2 3 0 1>;
   status = "okay";

};
```

DP mit zwei Lanes, Zuordnung OPTION1:

| DP lane | PHY lane | Pin-Name |
| --- | --- | --- |
| 0 | 2 | SSRX2 |
| 1 | 3 | SSTX2 |

DP-Konfiguration mit zwei Lanes:

```text
&usbdp_phy1 {
   rockchip,dp-lane-mux = <2 3>;
   status = "okay";

};
```

DP mit zwei Lanes, Zuordnung OPTION2:

| DP lane | PHY lane | Pin-Name |
| --- | --- | --- |
| 0 | 0 | SSRX1 |
| 1 | 1 | SSTX1 |

DP-Konfiguration mit zwei Lanes:

```text
&usbdp_phy1 {
   rockchip,dp-lane-mux = <0 1>;
   status = "okay";

};
```

### 2.4 Anschließen eines Panels an DP

Beim Anschluss eines eDP-Panels an DP werden eDP-spezifische Funktionen wie PSR, Multi-SST und ALPM nicht unterstützt. Verwenden Sie die folgende Panelkonfiguration als Referenz und passen Sie sie an die tatsächliche Hardware an.

#### 2.4.1 Panelkonfiguration im SST-Modus

Konfiguration für reine SST-Plattformen wie RK3588:

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

#### 2.4.2 Panelkonfiguration auf MST-fähigen Plattformen

Referenzkonfiguration für MST-fähige Plattformen wie RK3576:

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

Sowohl in SST- als auch in MST-Konfigurationen beschreibt force-hpd HPD für die gesamte DP-Schnittstelle und gehört an den Geräteknoten. Die Anzeigepfadkonfiguration ist hingegen DP-streamspezifisch; bei MST-Plattformen muss der entsprechende untergeordnete Knoten angepasst werden.

Auf MST-fähigen Plattformen wird beim Anschluss eines Panels derzeit nur SST unterstützt. Der Anzeigepfad muss daher Stream-0 verwenden, dargestellt durch dp0.

Die Quelle beschreibt force-hpd an dp0 so, dass der Treiber das eDP-Panel als ständig verbunden behandelt. Diese Eigenschaft ist optional: Prüfen Sie, ob das Panel HPD herausführt und ob für das Aktivieren von HPD und den AUX-Zugriff eine bestimmte Reihenfolge gilt. Muss der AUX-Zugriff nach dem Aktivieren von HPD erfolgen, konfigurieren Sie force-hpd nicht; andernfalls kann AUX vor dem High-Pegel von HPD angesprochen werden und der Zugriff scheitern. Wird ein HPD-Pin benötigt, folgen Sie der obigen HPD-Konfiguration für DP Legacy Mode (der Abschnittsverweis „1.2.1“ der Quelle ist veraltet).

panel-timing legt das unterstützte Timing fest. Konfigurieren Sie es, wenn das Panel kein EDID besitzt oder das daraus gelesene Timing ungenau ist. Andernfalls lässt sich das Timing direkt aus EDID beziehen.

Konfigurieren Sie Einschaltreihenfolge und Hintergrundbeleuchtung entsprechend Panel und Platinenentwurf.

### 2.5 DP-Startlogo

Bei konfigurierter Startlogounterstützung kann ein vor dem Einschalten angeschlossener Monitor das Logo während U-Boot anzeigen. Andernfalls wird das Anwendungsbild erst nach dem Systemstart sichtbar. Ergänzen Sie folgende Konfiguration:

```text
&route_dp0 {
   status = "okay";

   connect = <&vp2_out_dp0>;
};
```

Hier bindet die Eigenschaft connect DP während U-Boot an VOP Port2. Die DTSI-Konfiguration muss diese Bindung daher erlauben:

```text
&dp0_in_vp2 {
   status = "okay";
};
```

Hinweise:

1. Die Quelle unterstützt kein DP-Startlogo über Type-C.

2. Auf MST-fähigen Plattformen wird das Startlogo nur im SST-Modus unterstützt.

### 2.6 DP-Connector-Split-Modus

Im Connector-Split-Modus wird ein Bild in gleich große linke und rechte Hälften geteilt und über DP0 beziehungsweise DP1 übertragen. In dieser Abbildung ist DP0 die linke und DP1 die rechte Hälfte.

![Geteilte Anzeige im DP-Connector-Split-Modus](/docs/rockchip-displayport/assets/en-p26-1.png)

Konfiguration:

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

Fügen Sie dem DP-Knoten für die linke Hälfte split-mode hinzu und binden Sie ihn an den ausgebenden Video Port. Im Beispiel ist DP0 links und DP1 rechts. Die beiden DP-Schnittstellen werden als ein Connector behandelt. Dieser gilt nur dann als verbunden und zeigt ein Bild an, wenn sowohl DP0 als auch DP1 angeschlossen sind. Wird einer getrennt, gilt der gemeinsame Connector als getrennt und die Ausgabe endet. Beide DP-Ausgänge verwenden dasselbe Timing; daher werden zwei identische Monitore empfohlen.

Das Benutzerraumwerkzeug modetest oder der DRM-Zustandsknoten (`cat /sys/kernel/debug/dri/0/state`) zeigt nur einen DP-Connector.

Ergänzen Sie zur Anzeige eines U-Boot-Logos im Split-Modus, beispielsweise mit DP0 als linker Hälfte:

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

RK3576 besitzt nur eine DP-Schnittstelle und unterstützt diese Form des Connector-Split-Modus nicht. Laut Quelle sollte die RK3576-spezifische Split-Modus-Funktion später dokumentiert werden; wenden Sie sich bei Bedarf an Rockchip. Dies ist eine Aussage der Quelle, keine aktuelle Unterstützungsgarantie.

### 2.7 HDR

HDR wird im SST-Modus standardmäßig ohne Treiberkonfiguration unterstützt. HDR im MST-Modus wird in der beschriebenen Quellimplementierung nicht unterstützt.

### 2.8 HDCP

Der DP-Treiber implementiert HDCP über DRM. Der Benutzerraum muss zur Nutzung von HDCP die DRM-Schnittstellen aufrufen.

Der DP-Treiber unterstützt HDCP1.3 standardmäßig ohne zusätzliche Konfiguration. Zur HDCP-Schlüsselprogrammierung siehe Rockchip_RK3588_Developer_Guide_HDCP_CN.

HDCP2.2 verwendet einen separaten HDCP2-Controller zur Authentifizierung. Zur Aktivierung dieses Controllers ist eine DTS-Konfiguration erforderlich.

Bei RK3588 sind DP0/DP1 mit HDCP0 verbunden:

![RK3588 HDCP0 und DP0/DP1](/docs/rockchip-displayport/assets/en-p27-1.png)

Aktivieren Sie diese Knoten für DP HDCP2.2:

```text
&hdcp0 {
   status = "okay";

};
```

Bei RK3576 ist DP mit HDCP1 verbunden:

![RK3576 DP und HDCP1](/docs/rockchip-displayport/assets/en-p28-1.png)

Aktivieren Sie diese Knoten für DP HDCP2.2:

```text
&hdcp1 {
   status = "okay";

};
```

Zusätzlich zur Treiberkonfiguration erfordert HDCP2.2 die Aktivierung der HDCP2.2-Anwendung im Benutzerraum und die Erzeugung einer Firmware für den HDCP-Controller. Siehe Rockchip_RK3588_Developer_Guide_HDCP_CN.

### 2.9 Konfiguration der dclk-Quelle

DisplayPort betreibt häufig Monitore, die mehrere Auflösungen mit unterschiedlichen Pixeltakten unterstützen. Um den gebundenen VOP Video Port bei jedem Pixeltakt mit einem genauen dclk zu versorgen, verwendet die dclk-Quelle normalerweise eine ausschließlich VOP zur Verfügung stehende PLL, beispielsweise V0PLL beim RK3588 oder VPLL beim RK3576. Wird stattdessen die standardmäßige GPLL verwendet, können Auflösungen, deren dclk nicht durch ganzzahlige Teilung erzeugt werden kann, ungenaue Takte erhalten und herausgefiltert werden.

#### 2.9.1 dclk-Quelle des RK3576

Beim RK3576 setzt /arch/arm64/boot/dts/rockchip/rk3576-evb.dtsi die dclk-Quelle von VP0 standardmäßig auf VPLL:

```text
&vp0 {
      assigned-clocks = <&cru DCLK_VP0_SRC>;

      assigned-clock-parents = <&cru PLL_VPLL>;
};
```

Ist DP an VP0 gebunden, ist seine dclk-Quelle VPLL und ermöglicht die benötigte Frequenzteilung. Muss DP einen anderen VP verwenden, beispielsweise VP1, verwenden Sie diese Konfiguration:

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

Dadurch wird die dclk-Quellenkonfiguration von VP0 entfernt und bei VP1 hinzugefügt.

#### 2.9.2 dclk-Quelle des RK3588

Beim RK3588 setzt /arch/arm64/boot/dts/rockchip/rk3588s.dtsi die dclk-Quelle von VP2 standardmäßig auf V0PLL:

```text
vp2: port@2 {
......
      assigned-clocks = <&cru DCLK_VOP2_SRC>;

      assigned-clock-parents = <&cru PLL_V0PLL>;
};
```

Ist DP an VP2 gebunden, ist seine dclk-Quelle V0PLL und ermöglicht die benötigte Frequenzteilung. Muss DP einen anderen VP verwenden, beispielsweise VP1, verwenden Sie:

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

RK3588 besitzt DP0 und DP1. Werden beide gleichzeitig verwendet und an unterschiedliche VPs gebunden, etwa DP0 an VP0 und DP1 an VP1, darf nur einer von VP0 und VP1 V0PLL als dclk-Quelle verwenden. Andernfalls beeinflussen sich die VP-Taktkonfigurationen gegenseitig und verursachen Darstellungsfehler.

## 3. Gängige Verfahren zur Fehlersuche

### 3.1 Prüfen des Connector-Status

Das Verzeichnis /sys/class/drm listet die vom Treiber registrierten Karten auf. In der folgenden Ausgabe sind card0-DP-1 und card0-DP-2 DP-Anzeigegeräte.

```text
rk3588_s:/ # ls /sys/class/drm/
card0    card0-DP-2 card0-HDMI-A-1 card0-Writeback-1 renderD128 version

card0-DP-1 card0-DSI-1 card0-HDMI-A-2 card1 renderD129
```

Beispielsweise enthält card0-DP-1:

```text
rk3588_s:/ # ls /sys/class/drm/card0-DP-1/
device dpms edid enabled modes power status subsystem uevent
```

enabled: Prüfen, ob die Schnittstelle aktiviert ist:

```text
rk3588_s:/ # cat /sys/class/drm/card0-DP-1/enabled
disabled
```

status: Verbindungszustand prüfen:

```text
rk3588_s:/ # cat /sys/class/drm/card0-DP-1/status
disconnected
```

modes: Vom Gerät unterstützte Auflösungen auflisten:

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

edid: Geräte-EDID speichern mit:

```text
rk3588_s:/ # cat /sys/class/drm/card0-DP-1/edid > /data/edid.bin
```

### 3.2 DP zwangsweise ein- oder ausschalten

```text
#强制禁⽤ DP
rk3588_s:/ # echo off > /sys/class/drm/card0-DP-1/status
#强制使能 DP

rk3588_s:/ # echo on > /sys/class/drm/card0-DP-1/status
#恢复热插拔检测
rk3588_s:/ # echo detect > /sys/class/drm/card0-DP-1/status
```

### 3.3 Lesen und Schreiben von DPCD

Auf DPCD wird über AUX_CH zugegriffen. Der Lese-/Schreibknoten ist implementiert in:

```text
/drivers/gpu/drm/drm_dp_aux_dev.c
```

Prüfen Sie vor Verwendung dieser Funktion, ob die erforderliche Build-Option aktiviert ist:

```text
CONFIG_DRM_DP_AUX_CHARDEV=y
```

DPCD lesen:

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

DPCD-Register schreiben:

```text
#echo 后为要写⼊的值, 如下为需要写⼊两个  16 进制的值，分别为 0x0a, 0x80
#of 后⾯为 aux 节点，当注册两个 DP 接⼝时，会有 /dev/drm_dp_aux0 和 /dev/drm_dp_aux1

#seek 后为起始的 DPCD 寄存器地址
#count 值为要写⼊的 DPCD 寄存器的数量
#如下指令为把  0x0a 和 0x80 两个值写⼊ 0x100 起始的两个 DPCD 寄存器处
echo -e -n "\x0a\x80" | dd of=/dev/drm_dp_aux0 bs=1 seek=$((0x100)) count=2 status=none
```

### 3.4 Type-C-Fehlersuche

Der PD-Controller erkennt Type-C-HPD; der Softwareablauf wird hauptsächlich von TCPM verarbeitet. Rufen Sie das TCPM-Erkennungsprotokoll wie folgt ab:

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

Unter /sys/kernel/debug/usb/ ist fusb302-2-0022 der PD-Controller-Knoten und tcpm-2-0022 der TCPM-Knoten. Lesen Sie das TCPM-Protokoll mit:

```text
cat /sys/kernel/debug/usb/tcpm-2-0022
```

In tcpm-2-0022 bezeichnet 2 den i2c-Bus und 0022 die i2c-Adresse des PD-Controllers.

Lesen Sie das PD-Controller-Protokoll mit:

```text
cat /sys/kernel/debug/usb/fusb302-2-0022
```

In fusb302-2-0022 bezeichnet 2 den i2c-Bus und 0022 die PD-Controller-Adresse. Dieser Knoten gehört zu fusb302; andere Controller besitzen andere Knotennamen.

Neben Protokollen sind unter dem Type-C-Knoten weitere Informationen verfügbar:

```text
console:/ # ls /sys/class/typec
port0 port0-partner
```

port0 bezeichnet die Type-C-Schnittstelle auf SoC-Seite; port0-partner ist das Verzeichnis des über diese Schnittstelle angeschlossenen Geräts.

Type-C-Steckorientierung:

```text
cat /sys/class/typec/port0/orientation
reverse
```

Unter port0-partner können mehrere Verzeichnisse vorhanden sein. Das Verzeichnis für DP Alt Mode enthält ein Unterverzeichnis displayport und hat svid gleich 0xff01.

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

Aktuelle Pinzuordnung lesen:

```text
cat /sys/class/typec/port0-partner/port0-partner.0/displayport/pin_assignment
C [D]
#当前连接的设备⽀出  C assignment 和 D assignment, ⽬前配置的是 D assignment
```

Diese Verfahren gelten für PD-Controller mit TCPM. Bei einem PD-Controller ohne TCPM klären Sie die Informationsschnittstellen mit dessen Hersteller.

### 3.5 Lesen der DP-Register

DP-Register des RK3588:

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

DP-Register des RK3576:

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

PHY-Register dürfen nur ausgelesen werden, während ein DP-Monitor angeschlossen ist und normal anzeigt.

### 3.6 Prüfen des VOP-Status

VOP-Status abfragen mit:

```text
cat /sys/kernel/debug/dri/0/summary
```

Der resultierende VOP-Status ist nachfolgend dargestellt:

![VOP-Statusbeispiel aus der Quelle](/docs/rockchip-displayport/assets/en-p33-1.png)

Video Portx: aktueller Zustand des Video Ports.

Connector: die aktuell mit dem Video Port verbundene Ausgabeschnittstelle.

Display mode: aktuelles Ausgabetiming des Video Ports.

Clusterx-winx (Esmartx-winx): Ebeneninformationen.

Ab Kernel 6.1 lautet die Ausgabe:

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

Die Zusammenfassung enthält nun auch Encoder-Informationen.

RK3576 registriert einen SST-Encoder und drei MST-Encoder. Die drei MST-Encoder entsprechen folgenden DP-Anzeigestreams:

```text
DP-MST 0 --> Stream-0
DP-MST 1 --> Stream-1

DP-MST 2 --> Stream-2
```

Ein MST-Encoder zeigt an, dass DP im MST-Modus arbeitet. Ein an einen TMDS-xxx-Encoder gebundener DP-Connector zeigt SST-Modus an. Beispielsweise:

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

### 3.7 Prüfen der Anzeigetakte

Vollständigen Taktbaum lesen:

```text
cat /sys/kernel/debug/clk/clk_summary
```

DP-AUX-16M-Takt lesen:

```text
cat /sys/kernel/debug/clk/clk_summary | grep -e "clk_aux16m_"
```

VOP dclk lesen:

```text
cat /sys/kernel/debug/clk/clk_summary | grep -e "dclk"
```

### 3.8 Anpassen der DRM-Protokollierung

DRM definiert die folgenden Protokollkategorien. Aktivieren Sie die benötigten Kategorien dynamisch:

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

Bei der DP-Fehlersuche, insbesondere bei Commit-Fehlern, wird häufig ATOMIC-Protokollierung verwendet:

```text
echo 0x10 > /sys/module/drm/parameters/debug
```

Führen Sie für die Protokollierung von DPCD-Lese-/Schreibzugriffen aus:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

### 3.9 Debug-Protokollierung des DP-Treibers

Der DP-Treiber verwendet drm_dbg_dp für Debug-Meldungen. Aktivieren Sie die dynamische DP-Protokollierung mit:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

### 3.10 Lesen von DP Status

DP Status lesen mit:

```text
cat /sys/kernel/debug/dri/0/dw-dp0/dp_status
```

dw-dp0 bezeichnet die physische DP-Schnittstelle. RK3576 besitzt eine physische DP-Schnittstelle; verwenden Sie daher dw-dp0. RK3588 besitzt zwei, dargestellt durch dw-dp0 und dw-dp1.

Bei normaler DP-Ausgabe auf RK3576 liefert der Befehl:

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

#### 3.10.1 HPD-Status

Die HPD-Informationen umfassen HPD-Typ und -Zustand:

force hpd: yes bedeutet, dass force-hpd im DTS konfiguriert ist.

gpio hpd: yes bedeutet, dass im DTS ein gewöhnlicher GPIO als HPD-Pin konfiguriert ist.

usbdp hpd: yes bedeutet, dass der Type-C-HPD-Zustand über TCPM an den DP-Treiber übermittelt wird.

hpd status: plug bedeutet, dass HPD aktiviert ist; unplug bedeutet, dass HPD nicht aktiviert ist.

#### 3.10.2 AUX-Status

AUX: normal bezeichnet normalen AUX-Zugriff; wrong bezeichnet einen AUX-Zugriffsfehler.

#### 3.10.3 LINK-Status

Der Abschnitt LINK beschreibt die Verbindung nach dem Link-Training:

link lanes: nach dem Training gewählte Lane-Anzahl, entweder 1, 2 oder 4.

link rate: nach dem Training gewählte Rate: 1620MHz, 2700MHz, 5400MHz oder 8100MHz.

ssc: enable bedeutet, dass SSC aktiviert ist; disable bedeutet deaktiviert.

cr done: yes bedeutet, dass die Taktrückgewinnungsphase des Link-Trainings erfolgreich war.

eq done: yes bedeutet, dass die Kanalentzerrungsphase des Link-Trainings erfolgreich war.

#### 3.10.4 DP-Modusstatus

DP mode: SST oder MST bezeichnet den aktuellen DP-Transportmodus.

#### 3.10.5 DP-Stream-Status

Eine reine SST-Schnittstelle enthält Informationen zu einem DP-Stream; eine MST-fähige Schnittstelle zu mehreren Streams.

DP Streamx: active bedeutet, dass dieser DP-Stream aktiviert ist.

Video Info beschreibt die aktuelle Ausgabekonfiguration des DP-Controllers:

video enable: yes gibt das von VOP gelieferte Bild aus; no gibt das fortlaufend vom DP-Controller erzeugte Testmuster aus.

video format beschreibt Farbtiefe und Farbformat. Beispielsweise bedeutet RGB_10BIT RGB-Daten mit 10-Bit-Farbtiefe.

scan mode: Die Quelle schreibt den Wert für progressive Abtastung als preocess; interlace bezeichnet Zeilensprungabtastung.

hactive, hfp, hsync, hblank, hsync pol, vatctive, vfp, vsync, vblank und vsync pol beschreiben das aktuelle Ausgabe-Abtasttiming. Die Quellschreibweise vatctive bleibt erhalten.

MSA Info übermittelt die Konfiguration des ausgegebenen DP-Streams an DPRX:

misc0: rohe, nicht dekodierte misc0-Daten.

misc1: Die Quelle beschreibt dies als rohe, nicht dekodierte misc0-Daten; der widersprüchliche Feldname bleibt zur Überprüfung erhalten.

Pixel Encoding/Colorimetry format beschreibt Farbmetrik und Wertebereich. RGB bedeutet RGB mit vollem Wertebereich; CEA RGB bedeutet RGB mit begrenztem Wertebereich.

Zu den YUV-Optionen gehören YCBCR 422 BT601, YCBCR 422 BT709, YCBCR 444 BT601 und YCBCR 444 BT709; diese verwenden den begrenzten Wertebereich. Laut Quelle erfordern YUV420, BT2020 oder YUV mit begrenztem Wertebereich VSC SDP. In diesem Fall zeigt das Feld use VSC SDP.

Color Depth beschreibt die übertragene Farbtiefe; die Quelle nennt 6 bpc, 8 bpc und 12 bpc. Werden Farbinformationen mit VSC SDP übertragen, erscheint use VSC SDP.

SDP Bankx Info zeigt an, ob SDP Bankx zum Übertragen von SDP-Paketen verwendet wird:

vertical ctrl: yes bedeutet, dass das SDP dieser Bank während vblank übertragen wird; no bedeutet keine Übertragung während vblank.

horizontal ctrl: yes bedeutet Übertragung während hblank; no bedeutet keine Übertragung während hblank.

header: SDP-Paketheader; dekodieren Sie ihn gemäß der DP-Spezifikation.

payload: SDP-Nutzdaten; dekodieren Sie sie gemäß der DP-Spezifikation.

Es folgt ein Teil der DP-Stream-Informationen für eine 4K60Hz-Übertragung in YUV420:

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

Bei YUV420 zeigen sowohl Pixel Encoding/Colorimetry format als auch Color Depth use VSC SDP. SDP Bank01 Info zeigt, dass SDP Bank01 VSC SDP während vblank überträgt.

### 3.11 Lesen der DP-MST-Informationen

DP-MST-Informationen lesen mit:

```text
cat /sys/kernel/debug/dri/0/dw-dp0/dp_mst_info
```

dw-dp0 bezeichnet die physische DP-Schnittstelle. RK3576 besitzt nur eine und verwendet dw-dp0. RK3588 unterstützt kein DP MST und verwendet diesen Knoten nicht.

Wenn drei RK3576-MST-Ausgaben normal anzeigen, liefert der Befehl:

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

#### 3.11.1 MST-Portinformationen

Der erste Teil beschreibt die Verbindungstopologie der Geräte.

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

Wie im Abschnitt zur DP-Ausgabe beschrieben (die Quelle nennt Abschnitt 1.1.3), benötigt RK3576 MST einen MST HUB oder MST-Monitor. Jeder Ein- und Ausgangsport hat eine eigene Nummer. Der folgende HUB besitzt einen Eingang und drei Ausgänge; die Quelle bezeichnet irrtümlich beide Gruppen als Ausgänge.

![Nummerierung der physischen Ports eines MST HUB](/docs/rockchip-displayport/assets/en-p39-1.png)

Dies sind physische Ports zum Anschluss externer Geräte. DP weist physischen Ports die Nummern 0–7 zu, wobei Eingänge niedrigere Nummern als Ausgänge erhalten. Bei einem MST HUB beginnt die Nummerierung normalerweise mit 0. Dieser HUB besitzt vier Ports: Port0 ist Eingang, Port1/2/3 sind Ausgänge. Port2 ist mit einem SST-Monitor verbunden, wodurch folgende Topologie entsteht:

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

Ein MST-Monitor besitzt normalerweise einen DP-Eingang und einen DP-Ausgang, wie nachfolgend dargestellt; die Quelle wiederholt für beide „Eingang“.

![Physische und logische Ports eines MST-Monitors](/docs/rockchip-displayport/assets/en-p40-1.png)

Hier ist Port0 der Eingang, Port1 der Ausgang und Port8 ein interner Monitorausgang. Solche internen Ports sind logische Ports mit den Nummern 8–15. Ohne einen zusätzlich in Reihe angeschlossenen Monitor lautet die Topologie:

```text
      mstb - [0000000019f71241]: num_ports: 3
      port 1 - [0000000095fb1fc0] (output - NONE): ddps: 0, ldps: 0, sdp: 0/0, fec: false,
conn: 000000004d03ffa2

      port 8 - [00000000a66da753] (output - SST SINK): ddps: 1, ldps: 0, sdp: 1/2, fec:
true, conn: 000000009a417589
      port 0 - [000000009a0122a8] (input - NONE): ddps: 1, ldps: 0, sdp: 0/0, fec: false,
conn: 0000000000000000
```

#### 3.11.2 Informationen zum Atomic-Zustand

Im MST-Modus ist das grundlegende DP-Paket das Multi-Stream Transport Packet (MTP). Es enthält 64 Link-Symbole, auch Zeitschlitze genannt, mit den Nummern 0–63. Zeitschlitz 0 ist MTPH; die übrigen Zeitschlitze übertragen Anzeigestreamdaten. Das MTP-Format ist nachfolgend dargestellt.

![MTP-Paket und Zeitschlitze](/docs/rockchip-displayport/assets/en-p41-1.png)

In den folgenden payload info bezeichnet port die Portnummer des MST-Geräts, vcpi die Nummer des Anzeigestreams, slots die vom Stream belegten Zeitschlitze, pbn seine Bandbreitenzuweisung und sink name den Monitornamen.

```text
| idx | port | vcpi | slots | pbn | dsc | sink name |
   1     1    1 06 - 10 266 N          U27U2D
   2     8    2 11 - 15 266 N      DELL U2723QE

   3     3    3 01 - 05 266 N         U28E590
```

#### 3.11.3 DPCD-Informationen

Dieser Abschnitt enthält die DPCD-Daten. Beachten Sie besonders die Payload-Tabelle, die die detaillierte Zeitschlitzzuweisung festhält.

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

#### 3.11.4 Informationen zum Connector-Pfad

connector name ist der dynamisch registrierte DP-Connector; connector path ist dessen zugehöriger Pfad. Die Quelle schreibt diese Bezeichnungen irrtümlich als connecor und connecotr.

```text
*** Connector path info ***
connector name | connector path

DP-2        mst:185-1
DP-3        mst:185-2
DP-6        mst:185-3
DP-5        mst:185-2-8
DP-7        mst:185-2-1
```

## 4. Häufige Fragen

### 4.1 Keine oder fehlerhafte Anzeige nach dem DP-Anschluss

Prüfen Sie zunächst auf folgendes Protokoll:

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

#### 4.1.1 DP-Link-Training erfolgreich

Dieses Protokoll bedeutet, dass die DP-Verbindung erkannt wurde, das Link-Training erfolgreich war und die Bildausgabe begonnen hat. Ein leeres oder fehlerhaftes Bild kann folgende Ursachen haben:

(1) Ungenaue dclk-Teilung

Im folgenden Protokoll werden 25.175MHz dclk angefordert, jedoch 20MHz geliefert. Sammeln Sie bei diesem Taktzuweisungsproblem das vollständige Protokoll und das Taktbaumprotokoll zur weiteren Analyse.

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

(2) Keine Ebene zugewiesen

Wenn der Benutzerraum keine Ebene zugewiesen hat, führen Sie `cat /sys/kernel/debug/dri/0/summary` aus. Enthält die Ausgabe wie unten keine Ebeneninformationen, untersuchen Sie den Benutzerraum weiter.

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

#### 4.1.2 DP verbunden

Fehlt das am Anfang dieses Abschnitts gezeigte Protokoll, lesen Sie zuerst den DP-Verbindungsstatus:

```text
cat /sys/class/drm/card0-DP-1/status
```

Ist DP verbunden, prüfen Sie das Protokoll zunächst auf Fehler und untersuchen Sie diese. Wird kein Fehler protokolliert, aktivieren Sie DRM-ATOMIC-Protokollierung und reproduzieren Sie das Problem. Prüfen Sie, ob drm atomic commit vorzeitig zurückkehrt, weil eine Atomic-Check-Phase fehlgeschlagen ist.

#### 4.1.3 DP getrennt

Prüfen Sie bei einem Standard-DP-Port die HPD-Konfiguration und die Hardwareverbindungen. Verwenden Sie für Type-C die folgende Analyse von Verbindungsfehlern.

### 4.2 Type-C-Verbindungsfehler

Ein Type-C-Verbindungsfehler bezeichnet hier einen Fehler während der CC- oder PD-Phase. Rufen Sie zunächst den DP-Verbindungsstatus ab:

```text
cat /sys/class/drm/card0-DP-1/status
```

Bei einem Verbindungsfehler lautet der Zustand disconnected.

Lesen Sie das TCPM-Protokoll über dessen Debug-Knoten:

```text
cat /sys/kernel/debug/usb/tcpm-2-0022
```

Eine normale Verbindung erzeugt folgendes Protokoll:

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

Eine vollständige normale Sequenz tauscht die Befehle DISCOVER_IDENTITY, DISCOVER_MODES, DFP_TO_UFP_ENTER_MODE, STATUS UPDATE, CONFIGURATION und ATTENTION aus. Fehlt dieser Austausch, ist die PD-Aushandlung fehlerhaft.

Schlägt diese Sequenz fehl, schlägt die Quelle einen Test mit höherer I2C-Geschwindigkeit des PD-Controllers vor. Bleibt das Problem bestehen, stellen Sie vollständige TCPM- und PD-Controller-Protokolle zur weiteren Analyse bereit.

### 4.3 AUX_CH-Fehler

AUX_CH-Fehler verursachen Fehler beim Lesen und Schreiben von DPCD sowie beim Lesen von EDID. Das Protokoll kann Folgendes enthalten:

```text
[ 1368.952182] dw-dp fde50000.dp: failed to probe DP link: -110
```

Aktivieren Sie bei Unsicherheit diesen DRM-Debug-Protokollschalter:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

Lesen Sie das DPCD-Zugriffsprotokoll mit dmesg. Bei normalen Zugriffen ist ret gleich 0 (die Quelle schreibt DPCD irrtümlich als DPCP):

```text
[ 6329.554538] rockchip-drm display-subsystem: [drm:drm_dp_dpcd_probe] fde50000.dp: 0x00000
AUX -> (ret= 1) 12

[ 6329.554939] rockchip-drm display-subsystem: [drm:drm_dp_dpcd_read] fde50000.dp: 0x00000
AUX -> (ret= 15) 12 14 c2 81 01 01 01 81 02 02 06 00 00 00 81
[ 6329.555383] rockchip-drm display-subsystem: [drm:drm_dp_dpcd_probe] fde50000.dp: 0x00000
AUX -> (ret= 1) 12
```

Bei einem AUX_CH-Fehler enthält ret den Wert des Fehlertyps:

```text
[  31.116976] rockchip-drm display-subsystem: [drm:drm_dp_dpcd_probe] fde50000.dp: 0x00000
AUX -> (ret=-110)
```

Mögliche Ursachen sind:

#### 4.3.1 Falscher aux16m-Takt

Der übergeordnete Takt von aux16m ist GPLL, normalerweise auf 1188MHz konfiguriert. Die standardmäßige aux16m-Frequenz ist unten gezeigt:

```text
root@RK3588:/# cat /sys/kernel/debug/clk/clk_summary | grep "aux16m"
       clk_aux16m_1        1      2     0   15840000     0    0
50000

       clk_aux16m_0        1      2     0   15840000     0    0
50000
```

Ist GPLL nicht 1188MHz und auch aux16m nicht auf dem Standardwert, prüfen Sie Änderungen gegenüber dem SDK in /drivers/clk/rockchip/ oder eine Neukonfiguration des übergeordneten VOP-DCLK-Takts.

#### 4.3.2 Fehlerhafter PHY-Ein-/Ausschaltablauf

Dies tritt häufig auf, wenn USB und Type-C denselben PHY verwenden. Funktioniert Type-C in einer Orientierung, in der anderen jedoch nicht, wurde der USB-PHY beim Abziehen möglicherweise nicht beendet und verhindert die Neuinitialisierung beim nächsten Einstecken. Ergänzen Sie Protokolle, um das Ein-/Ausschalten des PHY beim Einstecken/Entfernen von USB und seine Neuinitialisierung nach dem Umdrehen des Steckers zu prüfen. Der folgende Patch veranschaulicht die Protokollierung.

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

#### 4.3.3 Fehler mit DP-Dual-Mode-Adaptern

DP Dual Mode setzt voraus, dass ein DP-Port sowohl DP-Ausgabe als auch HDMI-TMDS-Übertragung unterstützt und AUX sowohl DP AUX als auch DDC (I2C) unterstützt.

RK3588 DP unterstützt kein DP Dual Mode. Ein Dual-Mode-Kabel kann AUX_CH-Fehler verursachen, typischerweise bei Standard-DP-zu-HDMI-Kabeln oder -Konvertern. Schlägt AUX_CH mit einem solchen Kabel fehl und unterstützt es eine HDMI-Version unter 2.0, könnte es ein Dual-Mode-Adapter sein. Die Quelle empfiehlt einen Versuch mit einem Adapter für HDMI 2.0 oder höher; prüfen Sie jedoch die tatsächliche aktive Konvertertechnik, statt allein aus der Versionsangabe Kompatibilität abzuleiten.

#### 4.3.4 Signalstörungen

Dies tritt häufig bei direkten Type-C-Verbindungen auf, wenn USB-DP-/DM-Signale DP AUX stören. Trennen Sie zur Hardwarediagnose USB DP/DM und prüfen Sie, ob das Problem erneut auftritt. Die Quelle nennt als Lösungen ein hochwertigeres Type-C-Kabel mit geeigneter Abschirmung zwischen den Signalen oder den Verzicht auf USB DP/DM zur Datenübertragung.

#### 4.3.5 Hardwarefehler

Prüfen Sie zunächst den Hardwarepfad, die Übertragung der AUX-Differenzsignale und die Lötstellen. Prüfen Sie anschließend, ob die AUX_CH-Beschaltung der DP-Spezifikation entspricht. Bei Verwendung eines Konverterchips prüfen Sie zuerst dessen Beschaltung.

### 4.4 Konfigurieren einer 4K-120Hz-Ausgabe

RK3588 VOP ACLK ist standardmäßig auf 500M eingestellt. Eine Ausgabe mit hohem Pixeltakt wie 4K 120Hz kann dessen Leistungsfähigkeit überschreiten und den folgenden Darstellungsfehler verursachen:

![Quellfoto eines Darstellungsfehlers bei hohem Pixeltakt](/docs/rockchip-displayport/assets/en-p48-1.png)

Für dieses Problem erhöht die Quelle VOP ACLK auf 800M:

```text
&vop {
   assigned-clocks = <&cru ACLK_VOP>;

   assigned-clock-rates = <800000000>;
};
```

VOP ACLK lesen mit:

```text
cat /sys/kernel/debug/clk/clk_summary | grep "aclk_vop"
```

### 4.5 Berechnung der DP-Bandbreite

#### 4.5.1 SST-Bandbreite

Berechnen Sie die erforderliche Bandbreite je DP-Lane mit:

```text
bandwidth_per_lane = pixel_clk * bit_per_pixel * 1.25 / lane_count
```

bit_per_pixel ist die Anzahl der Bits pro Pixel, 1.25 der PHY-Codierungsfaktor und lane_count die Anzahl verfügbarer Lanes. Die berechnete bandwidth_per_lane ist die mindestens erforderliche Rate je Lane. Ist die aktuelle Lane-Rate niedriger, filtert der DP-Treiber den Anzeigemodus mit diesem Pixeltakt heraus.

Prüfen Sie bei Adaptern oder Dockingstationen, ob Lane-Rate und Lane-Anzahl den Bandbreitenbedarf decken. Verwenden Sie andernfalls einen Adapter oder ein Dock mit höherer Rate und/oder mehr Lanes.

Beispielsweise muss ein Dock mit zwei Lanes von jeweils maximal 5.4 Gbps/lane für 4K@60Hz mit 594MHz Pixeltakt und RGB888 folgende Bandbreite je Lane bereitstellen:

```text
bandwidth_per_lane = 594 * 24 * 1.25 / 2 = 8.91 Gbps/lane > 5.4 Gbps/lane
```

Dieses Dock kann 4K@60Hz RGB888 mit einem Pixeltakt von 594MHz nicht ausgeben. Verwenden Sie ein Dock mit vier Lanes, um die verfügbare PHY-Bandbreite zu erhöhen, oder geben Sie YUV420 aus, um den Bandbreitenbedarf zu senken.

#### 4.5.2 MST-Bandbreite

MST verwendet pro Stream und Lane dieselbe Bandbreitenformel wie SST. Die Summe der Streams muss jedoch innerhalb der Link-Bandbreite bleiben; außerdem benötigt der MTPH-Header Bandbreite.

Für die maximale RK3576-Verbindung mit vier Lanes bei 8.1Gbps:

Ein MTP besitzt 64 Zeitschlitze, von denen einer durch MTPH belegt ist. Die maximale Nutzdatenbandbreite je Lane beträgt daher:

```text
bandwidth_per_lane_max = 8.1 * 63 / 64 = 7.97 Gbps
```

Für 4096x2160@60Hz mit 594MHz Pixeltakt und RGB888 beträgt die Bandbreite je Lane:

```text
bandwidth_per_lane = 594 * 24 * 1.25 / 4 = 4.46 Gbps
```

Für 2560x1440@60Hz mit 297MHz Pixeltakt und RGB888 nennt die Quelle folgende Formel. Ihr Zähler enthält weiterhin 594; diese Unstimmigkeit bleibt erhalten und wird nicht stillschweigend korrigiert.

```text
bandwidth_per_lane = 594 * 24 * 1.25 / 4 = 2.23 Gbps
```

Für 1920x1080@60Hz mit 148.5MHz Pixeltakt und RGB888 nennt die Quelle folgende Formel. Auch hier steht im Zähler 594 statt des angegebenen Pixeltakts.

```text
bandwidth_per_lane = 594 * 24 * 1.25 / 4 = 1.12 Gbps
```

Bei der maximalen RK3576-Verbindung mit vier Lanes bei 8.1Gbps und gleichzeitigen Streams von 4096x2160@60Hz, 2560x1440@60Hz und 1920x1080@60Hz summiert die Quelle die Bandbreite je Lane wie folgt:

```text
bandwidth_per_lane_total = 4.46 + 2.23 + 1.12 = 7.81 Gbps < 7.97 Gbps
```

Die Quelle bezeichnet dies als maximale Fähigkeit des RK3576 für drei Ausgaben im MST-Modus.

### 4.6 DP-Timinggrenzen

Bei nicht standardmäßigen Auflösungen kann ein zu kurzer Porch die Anzeige verhindern. Der beschriebene DP-Treiber verlangt HBP von mindestens 16 und HSYNC von mindestens 9. Kleinere Werte werden auf das unterstützte Minimum angehoben.

### 4.7 MST-Einschränkungen

#### 4.7.1 Fähigkeitsgrenzen

Maximale Fähigkeiten der einzelnen RK3576-DP-Streams:

| DP-Stream-Kanal | Maximale Breite | Maximale Höhe | Maximaler Pixeltakt |
| --- | --- | --- | --- |
| Stream-0 | 4096 | 2160 | 1188MHz |
| Stream-1 | 2560 | 1440 | 300MHz |
| Stream-2 | 1920 | 1080 | 150MHz |

Maximale Fähigkeiten der einzelnen RK3576-VOP-Video-Ports:

| VOP Video Port | Maximale Breite | Maximale Höhe | Maximaler Pixeltakt |
| --- | --- | --- | --- |
| Video Port 0 | 4096 | 2160 | 1200MHz |
| Video Port 1 | 2560 | 1600 | 300MHz |
| Video Port 2 | 1920 | 1080 | 150MHz |

Für drei unabhängige Anzeigen mit ihren jeweils maximal unterstützten Auflösungen empfiehlt die Quelle aufgrund der VOP- und DP-Grenzen Video Port0 -> DP Stream-0, Video Port1 -> DP Stream-1 und Video Port2 -> DP Stream-2. DTS-Konfiguration:

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

Für drei gespiegelte Anzeigen über RK3576 MST beträgt das Maximum 1920x1080@60Hz. Die empfohlenen Pfade sind Video Port2 -> DP Stream-0, Video Port2 -> DP Stream-1 und Video Port2 -> DP Stream-2:

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

#### 4.7.2 Auflösungsfilterung

In Linux DRM werden MST-Connectors dynamisch registriert, während DP Stream-0/1/2 als drei Encoder registriert werden. Beim Anschließen eines Connectors ist noch nicht bekannt, welchen Encoder er verwenden wird. In der obigen Konfiguration für unabhängige Anzeigen wird eine Auflösung nur dann herausgefiltert, wenn keiner der drei Streams sie unterstützt:

![Diagramm zur MST-Auflösungsfilterung](/docs/rockchip-displayport/assets/en-p53-1.png)

Da DP-Streams und VOP Video Ports unterschiedliche Fähigkeiten besitzen, können bestimmte Auflösungen auf einzelnen Pfaden nicht ausgegeben werden. Beispielsweise kann 3840x2160@60Hz auf Video Port2 -> DP Stream-2 nicht normal angezeigt werden.

Der Benutzerraum muss daher die Auflösungen für den gewählten Anzeigepfad begrenzen, oder die maximale Auflösung des angeschlossenen Displays darf die Fähigkeit von DP Stream-2 nicht überschreiten.

{% endraw %}

