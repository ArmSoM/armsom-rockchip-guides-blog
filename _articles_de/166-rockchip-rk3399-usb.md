---
title: "RK3399 USB: Controller, PHYs, Schnittstellenschaltungen und DTS"
description: "RK3399 USB: Controller, PHYs, Schnittstellenschaltungen und DTS — V2.0.0"
translation_key: "166-rockchip-rk3399-usb"
slug: "166-rockchip-rk3399-usb"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, Type-C, PHY, DTS]
excerpt: "RK3399 USB: Controller, PHYs, Schnittstellenschaltungen und DTS — V2.0.0"
---

{% raw %}

Vollständiger technischer Inhalt der chinesischen und englischen Rockchip-RK3399-USB-Anleitung V2.0.0. Geltungsbereich: RK3399, Linux 4.4+. ArmSoM-Plattformreferenz, keine Zusage für jedes Board. Board, SDK/BSP, Kernelzweig, USB/DP-Pins, VBUS-Versorgung und Type-C-Controller müssen abgeglichen werden. Keine ArmSoM-Hardwarevalidierung; Ergebnisse und Ausgaben stammen aus dem Original. Chinesisch verwendet chinesische Originalbilder, die übrigen Sprachen englische.

Originalüberblick: Konfiguration und Nutzung von RK3399-USB-DTS in verschiedenen Linux-Versionen. RK3399 besitzt zwei Type-C-Schnittstellen mit USB 3.1 Gen1 und DisplayPort sowie zwei USB-2.0-Host-Schnittstellen. Jeder Type-C-Port hat einen eigenen USB-3.1-Gen1-OTG-Controller für Peripheral und Host und ist zu USB2.0/1.1/1.0 abwärtskompatibel. Produkte können daraus Type-A USB 3.0/2.0 + DP, Micro USB 3.0/2.0 und andere physische Schnittstellen bilden. Kerneltreiber unterstützen gängige Schaltungen; das USB-DTS muss jedoch zur realen Hardware passen.

> Unterstützungs- und Erprobungsangaben gelten für den Dokumentstand, nicht für das heutige SDK. Versorgung und Verdrahtung müssen Bauteilgrenzwerte einhalten. Befehle erfordern Prüfung und ein angepasstes Testgerät; hier wurden sie nicht ausgeführt. Die Vorlage enthält RK3599, RK3588 Type-C0/1, R3399, USBDeviec und powr-role als mögliche Kopier-/Schreibfehler. Sie bleiben nachvollziehbar, belegen aber keine Boardunterstützung; RK3399-TRM und SDK prüfen.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. RK3399 USB-Controller und PHY: Einführung

RK3599 (Originalschreibweise; Thema ist RK3399, Bezeichnung prüfen) unterstützt fünf unabhängige USB-Controller: zwei USB 2.0 HOST, zwei USB 3.1 OTG und einen USB 2.0 HOST HSIC. Tabelle 1-1: RK3399-Controller.

| Chip/Controller | USB 2.0 HOST<br>(EHCI&amp;OHCI) | USB 3.1 OTG<br>(DWC3&amp;xHCI) | USB 2.0 Host<br>HSIC(EHCI) |
| --- | --- | --- | --- |
| RK3399 | 2 | 2 | 1 |

RK3399 enthält fünf USB-PHYs: zwei USB 2.0 Combo PHY, zwei USB 3.1/DP Combo PHY und einen HSIC PHY. Tabelle 1-2: RK3399-USB-PHYs.

| Chip/PHY | USB 2.0 Combo PHY | USB3.1/DP Combo PHY | HSIC PHY |
| --- | --- | --- | --- |
| RK3399 | 2 [2 × ports] | 2 | 1 |

Hinweise:

1. N bezeichnet N unabhängige USB-Controller oder PHYs.

2. [2 × ports] bedeutet zwei USB-Ports/Anschlüsse je PHY.

3. EHCI&amp;OHCI bedeutet integrierte EHCI- und OHCI-Controller, DWC3&amp;xHCI entsprechend DWC3 und xHCI.

4. Physikalische Datenrate: USB 3.1 Gen1 5Gbps, USB 2.0 480Mbps.

5. USB 3.1/DP Combo PHY besitzt vier Lanes und unterstützt gleichzeitig USB 3.1 + zweispuriges DP. Abbildung 1-1 zeigt interne Controller-/PHY-Verbindungen des RK3399 ohne HSIC und übliche physische Anschlüsse.

![Originalabbildung 1, englisches PDF, Seite 6](/docs/rockchip-rk3399-usb/assets/en-p006-figure-01.png)

*Originalabbildung 1, englisches PDF, Seite 6*

Abbildung 1-1. USB-Controller-/PHY-Verbindungen des RK3399. Hinweise:

1. Gleichzeitig bis zu zwei Type-C-, zwei Type-A-USB-2.0- und ein USB-2.0-HSIC-Anschluss.

2. RK3399 hat einen DP-Controller. Im SDK ist er mit Type-C0 verbunden; Software kann auf Type-C1 umschalten, aber nur einer ist nutzbar.

3. USB 3.1 OTG und DP teilen USB3.1/DP Combo PHY: vollwertiges Type-C oder getrenntes USB-3.1-Type-A plus zweispuriges DP.

4. USB 3.1/DP Combo PHY unterstützt nur USB 3.1 Gen1, nicht USB 2.0. Für vollständiges USB 3.1 wird er mit einem eigenständigen USB-2.0-PHY kombiniert; Hardware und Versorgung sind unabhängig. Combo PHY0 ist fest mit port0 des USB2 Combo PHY0 verbunden, Combo PHY1 mit port0 des USB2 Combo PHY1. Dies ist im Linux-USB-DTS abgebildet.

5. Nicht nur Type-C/A aus Abbildung 1-1 werden unterstützt, sondern übliche Type-C-, Type-A- und Micro-USB-2.0/3.1-Anschlüsse. Siehe Schnittstellentypen. Linux-Treiber berücksichtigen verschiedene Schaltungen; USB-DTS muss zur tatsächlichen Hardware passen. Einzelheiten im Abschnitt RK3399-USB-DTS-Konfiguration.

## 2. RK3399 unterstützte USB-Schnittstellen

RK3399 unterstützt die USB-Typen aus Abbildung 2-1; die Schaltung kann nach Produktanforderung gewählt werden.

![Originalabbildung 2, englisches PDF, Seite 7](/docs/rockchip-rk3399-usb/assets/en-p007-figure-01.png)

*Originalabbildung 2, englisches PDF, Seite 7*

Abbildung 2-1. Unterstützte RK3399-USB-Schnittstellen.

### 2.1 Type-C Schnittstellentypen

#### 2.1.1 Type-C USB 3.1&DP vollständige Schnittstelle

Die Vorlage nennt RK3588 Type-C0/1 (im RK3399-Dokument, zu prüfen). Vollwertiges Type-C in Abbildung 2-2 unterstützt PD mit externem Type-C-Controller, USB 3.1 Gen1 5Gbps und DP Alternate Mode.

![Originalabbildung 3, englisches PDF, Seite 8](/docs/rockchip-rk3399-usb/assets/en-p008-figure-01.png)

*Originalabbildung 3, englisches PDF, Seite 8*

Abbildung 2-2. Type-C USB 3.1/DP. Vollständige Stecker-/Buchsenbelegung in Abbildung 2-3.

![Originalabbildung 4, englisches PDF, Seite 8](/docs/rockchip-rk3399-usb/assets/en-p008-figure-02.png)

*Originalabbildung 4, englisches PDF, Seite 8*

Abbildung 2-3. Type-C-Pinbelegung. Tabelle 2-1: Pinbeschreibung.

| Pin | Name | Beschreibung | Pin | Name | Beschreibung |
| --- | --- | --- | --- | --- | --- |
| A1 | GND | Masse | B12 | GND | Masse |
| A2 | SSTXp1 | SuperSpeed-Differenzsignal<br>TX1+ | B11 | SSRXp1 | SuperSpeed-Differenzsignal<br>RX1+ |
| A3 | SSTXn1 | SuperSpeed-Differenzsignal<br>TX1- | B10 | SSRXn1 | SuperSpeed-Differenzsignal<br>RX1- |
| A4 | VBUS | USB-Busversorgung | B9 | VBUS | USB-Busversorgung |
| A5 | CC1 | Konfigurationskanal | B8 | SBU2 | Nebenkanal (SBU) |
| A6 | Dp1 | USB-2.0-Differenzsignal D1+ | B7 | Dn2 | USB-2.0-Differenzsignal D2- |
| A7 | Dn1 | USB-2.0-Differenzsignal D1- | B6 | Dp2 | USB-2.0-Differenzsignal D2+ |
| A8 | SBU1 | Nebenkanal (SBU) | B5 | CC2 | Konfigurationskanal |
| A9 | VBUS | USB-Busversorgung | B4 | VBUS | USB-Busversorgung |
| A10 | SSRXn2 | SuperSpeed-Differenzsignal<br>RX2- | B3 | SSTXn2 | SuperSpeed-Differenzsignal<br>TX2- |
| A11 | SSRXp2 | SuperSpeed-Differenzsignal<br>RX2+ | B2 | SSTXp2 | SuperSpeed-Differenzsignal<br>TX2+ |
| A12 | GND | Masse | B1 | GND | Masse |

Tabelle 2-2. Verbindungen zwischen RK3399 Type-C0 und Type-C-Anschluss.

| RK3399 Typ.e-C0 Pin | Type-C-Anschluss-Pin | Zuordnung |
| --- | --- | --- |
| TYPEC0_TX1P/TX1M | A2/A3 | Für USB 3.1 Tx1 oder DP Tx lane0 |
| TYPEC0_RX1P/RX1M | B11/B10 | Für USB 3.1 Rx1 oder DP Tx lane1 |
| TYPEC0_RX2P/RX2M | A11/A10 | Für USB 3.1 Rx2 oder DP Tx lane2 |
| TYPEC0_TX2P/TX2M | B2/B3 | Für USB 3.1 Tx2 oder DP Tx lane3 |
| TYPEC0_DP/DM | A6/A7, B6/B7 | An RK3399 TYPEC0_OTG_DP/DM; A6/B6 sowie A7/B7 parallel |
| TYPEC0_SBU1/SBU2 | A8/B8 | An AUX des RK3399-USBDP-PHY, nur DP Alternate Mode |
| TYPEC0_SBU1_DC/SBU2_DC | A8/B8 | Pull-up-Steuerung bei DP-AUX-Übertragung; keine GPIO-Verbindung nötig |
| TYPEC0_CC1/CC2 | A5/B5 | An externen HUSB311/FUSB302-Type-C-Controller, nicht an CC1/CC2 des R3399-SoC (Originalschreibweise) |
| TYPEC0_U2VBUSDET | A4/A9/B4/B9 | Type-C-VBUS über Spannungswandler auf 3V reduzieren und mit RK3399-SoC-VBUSDET verbinden |

Hinweise:

1. CC1/CC2 des RK3399 werden nicht verwendet und bleiben offen.

2. RK3399-USBDP-PHY steuert Pull-up/Pull-down für TYPEC0_SBU1_DC/SBU2_DC ohne zusätzliche GPIOs, anders als RK3588.

3. Der einzelne RK3399-DP-Controller erlaubt kein gleichzeitiges DP an Type-C0/1; RK3588 hat dagegen zwei unabhängige DP-Controller.

4. Der RK3399-Type-C-Treiber unterstützt keine dauerhafte Versorgung von TYPEC0_U2VBUSDET. Für USB-Device-Hotplug und BC 1.2 diesen Pin über Spannungsanpassung an Anschluss-VBUS anbinden; dies unterscheidet sich von RK3588.

5. Beide Chips unterstützen vollwertiges Type-C USB&amp;DP, unterscheiden sich aber im USBDP-PHY-Lane-Multiplexing. Tabelle 2-3: RK3399/RK3588-Lanes.

| USBDP PHY lane | RK3399 USB | RK3399 DP | RK3588 USB | RK3588 DP |
| --- | --- | --- | --- | --- |
| lane0 | USB3 Tx1 | DP TX0 | USB3 Rx1 | DP TX0 |
| lane1 | USB3 Rx1 | DP TX1 | USB3 Tx1 | DP TX1 |
| lane2 | USB3 Rx2 | DP TX2 | USB3 Rx2 | DP TX2 |
| lane3 | USB3 Tx2 | DP TX3 | USB3 Tx2 | DP TX3 |

#### 2.1.2 Type-C to Type-A USB&DP Schnittstelle

RK3399-Type-C0 kann in getrenntes Type-A USB 3.1 und DP aufgeteilt werden, etwa:

1. Type-A USB 3.1 über USBDP PHY0 lane0/1 plus DP 1.3 über lane2/3.

2. Type-A USB 3.1 über lane0/1 plus DP-to-VGA über lane2/3. Anschließend nennt die Vorlage RK3588 Type-C0: getrenntes Type-A USB 2.0 ohne USBDP-PHY plus vierspuriges DP-to-HDMI2.0 über lane0/1/2/3. Plattformbezeichnung prüfen. Hinweise:

1. Der SDK-Type-C-Treiber für Linux 4.4/4.19 unterstützt getrenntes USB/DP standardmäßig nicht; Änderungen siehe Type-C-to-Type-A-USB&amp;DP-DTS.

2. Wegen des einzelnen DP-Controllers ist Type-C0 USB&amp;DP plus Type-C1 USB only vorzuziehen; dies reduziert Entwicklungsaufwand.

3. Theoretisch sind USB 3.1 auf lane2/3 und DP auf lane0/1 möglich, erfordern aber eigene DTS-Anpassungen. Ohne besondere Hardwaregründe die obigen Standardvarianten 1 und 2 bevorzugen.

#### 2.1.3 Type-C USB 2.0 only Schnittstelle

Type-C USB 2.0 only vereinfacht die RK3399-Schaltung: PD mit externem Controller, USB 2.0 480Mbps, kein DP Alternate Mode (Abbildung 2-4). Die maximale Geschwindigkeit sinkt; Linux-USB-DTS benötigt größere Änderungen, siehe Type-C-USB-2.0-only-Konfiguration.

![Originalabbildung 5, englisches PDF, Seite 12](/docs/rockchip-rk3399-usb/assets/en-p012-figure-01.png)

*Originalabbildung 5, englisches PDF, Seite 12*

Abbildung 2-4. Type-C USB 2.0 only.

### 2.2 Type-A Schnittstellentypen

#### 2.2.1 Type-A USB 3.1 Schnittstelle

Bis zu zwei Type-A USB 3.1: Type-C0 to Type-A USB 3.1 und Type-C1 to Type-A USB 3.1.

![Originalabbildung 6, englisches PDF, Seite 12](/docs/rockchip-rk3399-usb/assets/en-p012-figure-02.png)

*Originalabbildung 6, englisches PDF, Seite 12*

Abbildung 2-5. Type-A USB 3.1.

#### 2.2.2 Type-A USB 2.0 Schnittstelle

Bis zu vier Type-A USB 2.0: Type-C0 to Type-A USB 2.0, Type-C1 to Type-A USB 2.0, USB 2.0 HOST0 und HOST1.

![Originalabbildung 7, englisches PDF, Seite 13](/docs/rockchip-rk3399-usb/assets/en-p013-figure-01.png)

*Originalabbildung 7, englisches PDF, Seite 13*

Abbildung 2-6. Type-A USB 2.0.

### 2.3 Micro Schnittstellentypen

#### 2.3.1 Micro USB 3.1 Schnittstelle

Type-C0/1 unterstützt Micro USB 3.1, das wegen des PCB-Platzbedarfs selten eingesetzt wird. Gegenüber Type-A kommt OTG ID zur automatischen Pegelerkennung und Device/Host-Umschaltung hinzu. ID an TYPEC0_ID beziehungsweise TYPEC1_ID anschließen. Interner Pull-up auf 1.8V ist vorhanden; extern keiner nötig.

![Originalabbildung 8, englisches PDF, Seite 13](/docs/rockchip-rk3399-usb/assets/en-p013-figure-02.png)

*Originalabbildung 8, englisches PDF, Seite 13*

Abbildung 2-7. Micro USB 3.1.

#### 2.3.2 Micro USB 2.0 Schnittstelle

Type-C0 unterstützt Micro USB 2.0 mit einfacherer Schaltung, aber geringerer Maximalgeschwindigkeit. Gegenüber Type-A kommt OTG ID zur automatischen Device/Host-Umschaltung hinzu. An TYPEC0_ID anschließen; der interne 1.8V-Pull-up genügt.

![Originalabbildung 9, englisches PDF, Seite 14](/docs/rockchip-rk3399-usb/assets/en-p014-figure-01.png)

*Originalabbildung 9, englisches PDF, Seite 14*

Abbildung 2-8. Micro USB 2.0.

## 3. RK3399 Type-C USB-Hinweise

1. Aufteilung von Type-C USB 3.1 in USB 2.0 und USB 3.1. Controllereigenschaften:

(1) Device und Host sind nicht gleichzeitig nutzbar. (2) Im Host-Modus können USB-2.0/3.1-Ports unabhängig gleichzeitig arbeiten. (3) Im Device-Modus geht USB 2.0/3.1 nicht gleichzeitig. Nur für reine Host-Anwendungen aufteilen; andernfalls sprechen Device-Einschränkungen dagegen.

2. Trennung von USB 3.1 und DP: USB 3.1 + DP mit zwei Lanes oder USB 2.0 + DP mit vier Lanes. Das SDK bietet keine vollständig fertige Unterstützung; siehe Type-C-to-Type-A-USB&amp;DP-DTS.

3. TYPEC0_U2VBUSDET erkennt USB-Device-Anschluss/Trennung; die Vorlage nennt auch TYPEC0_USB20_VBUSDET. (1) MaskROM-USB-Download erfordert beim Einschalten extern High, kein Floating. (2) High-Bereich 1.4V–3.3V. (3) Linux 4.4/4.19/5.10 unterstützt für Type-C kein dauerhaftes High. Über Spannungsanpassung an VBUS anschließen, sonst funktionieren Device-Hotplug und BC 1.2 nicht korrekt.

4. Beide Type-C-Controller unterstützen hardwareseitig USB 3.1 OTG sowie USB 2.0/1.1/1.0, doch das Gadget-Framework erlaubt nur einen Device-Controller. SDK: Type-C0 OTG, Type-C1 Host. (1) Firmwaredownload nur über Type-C0, nicht änderbar. (2) ADB standardmäßig Type-C0; Wechsel siehe Type-C1-OTG-Abschnitt. (3) Dual-OTG ist theoretisch möglich, das SDK implementiert aber kein dynamisches Device-Umschalten zwischen OTG0/1. Device möglichst auf einen Port festlegen. Für zwei OTG muss die Anwendung USB mode von Type-C0/C1 überwachen und /config/usb_gadget/g1/UDC dynamisch zum Binden des Gadgets an den passenden Controller setzen.

## 4. RK3399 USB DTS Konfiguration

USB-DTS umfasst gemeinsame Controller-/PHY-DTSI- und Board-DTS-Einstellungen. Erstere enthalten reg, clock, reset, grf, interrupts und Controllereigenschaften; letztere VBUS, externe Type-C-Controller wie FUSB302 und Schaltungsdetails.

### 4.1 USB-DTSI-Konfiguration auf Chipebene

Wichtige RK3399-DTSI-Knoten stehen in Tabelle 4-1. Sie definieren gemeinsame Ressourcen/Eigenschaften von Controllern und PHYs und sollten nicht geändert werden. Tabelle 4-1: Zuordnung von USB-Schnittstellen und DTS-Knoten.

| USB-Schnittstellenname (Schaltplan) | USB-Controller-DTS-Knoten | USB-PHY-DTS-Knoten |
| --- | --- | --- |
| TYPEC0 | usbdrd3_0<br>usbdrd_dwc3_0 | u2phy0_otg<br>tcphy0_usb3 |
| TYPEC1 | usbdrd3_1<br>usbdrd_dwc3_1 | u2phy1_otg<br>tcphy1_usb3 |
| USB20_HOST0 | usb_host0_ehci<br>usb_host0_ohci | u2phy0_host |
| USB20_HOST1 | usb_host1_ehci<br>usb_host1_ohci | u2phy1_host |

Controller-DTSI am Beispiel Linux 4.19: arch/arm64/boot/dts/rockchip/rk3399.dtsi.

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

PHY-DTSI am Beispiel Linux 4.19: arch/arm64/boot/dts/rockchip/rk3399.dtsi.

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

Hinweise:

1. PHY und Controller paarweise konfigurieren; Hardwareverbindungen siehe Einführung. phys des Controllers referenziert den PHY.

2. Seit Linux 4.19 ist DWC3 stark überarbeitet: power-domains und resets wanderten vom Elternknoten usbdrd3_x zum Kind usbdrd_dwc3_x. In Linux 4.4 stehen sie im Elternknoten. Für die meisten USB-Anwendungsentwickler ist dies nicht relevant.

3. SDK setzt Type-C0 auf OTG mit dynamischem Device/Host-Wechsel und Type-C1 auf Host-only. Für Type-C1-OTG/ADB Einschränkungen und Änderungen in den Type-C-USB-Hinweisen und Type-C1-OTG-Einstellungen beachten.

### 4.2 Type-C USB 3.1/DP vollständig DTS Konfiguration

Vollwertiges Type-C USB 3.1/DP benötigt einen externen Controller für Orientierung, PD, USB-Rollen und DP Alternate Mode. DTS ist chipabhängig. Frühe SDKs mit Linux 4.4/4.19 ohne Standard-TCPM/TCPCI unterstützen nur FUSB302. Neuere 4.19 und spätere Versionen unterstützen TCPM/TCPCI und weitere kompatible Chips wie HUSB311. Nachfolgend FUSB302/HUSB311 für verschiedene Kernel.

#### 4.2.1 Linux-4.4 Type-C USB 3.1&DP vollständig DTS Konfiguration[FUSB302]

Beispiel Type-C0 RK3399 IND EVB: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

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

#### 4.2.2 Linux-4.19 Type-C USB 3.1&DP vollständig DTS Konfiguration[FUSB302]

Linux-4.19-FUSB302 entspricht weitgehend 4.4; nur die Position der extcon-Referenz im DWC3-Knoten unterscheidet sich.

```text
&usbdrd3_0 {
        status = "okay";
};

&usbdrd_dwc3_0 {
        status = "okay";
        extcon = <&fusb0>; /* Linux-4.19 的 extcon 属性放在 DWC3 ⼦节点 */
};
```

#### 4.2.3 Linux-4.19 Type-C USB 3.1&DP vollständig DTS Konfiguration[HUSB311]

Aktuelles RK3399-4.19 unterstützt HUSB311 und ET7303. Beide haben I2C-Adresse 4E, DTS unterscheidet sich nur in Name und compatible; nachfolgend HUSB311. FUSB302 auf EVB IND kann durch HUSB311 ersetzt werden. Beide verwenden TCPM: develop-4.19 synchronisieren oder mindestens folgende Verzeichnisse:

```text
kernel/include/linux/usb
kernel/drivers/usb/typec
kernel/drivers/usb/dwc3
```

Außerdem folgende Patches manuell übernehmen:

```text
0001-usb-typec-tcpm-add-vdm-retry-mechanism.patch
0002-arm64-dts-rockchip-rk3399-ind-support-type-c-port-co.patch
0003-arm64-rockchip_defconfig-enable-tcpm-and-husb311-and.patch
```

Vollständiges Referenzpaket „RK3399_Linux-4.19_TypeC-HUSB311-ET7303-参考设计“ unter https://redmine.rockchip.com.cn/documents/113 verwenden. Beispiel Type-C0 HUSB311 RK3399 IND EVB: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

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

VBUS-Konfiguration über PMIC RK817/RK818/bq25700 und ähnliche:

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

#### 4.2.4 Linux-5.10 Type-C USB 3.1&DP vollständig DTS Konfiguration[FUSB302]

Linux 5.10 verwendet TCPM und remote-endpoint mit Callback-Registrierung statt des bisherigen extcon; Type-C benötigt kein extcon mehr. RK3399-Type-C-DP ist in dieser ursprünglichen SDK-Version noch unvollständig, daher fehlt dp_altmode in tcphy0 und usb_con. Beispiel Type-C0 IND EVB: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

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

#### 4.2.5 Linux-5.10 Type-C USB 3.1&DP vollständig DTS Konfiguration[HUSB311]

Zum Ersetzen von FUSB302 durch HUSB311 folgende kleine Änderungen am obigen Linux-5.10-FUSB302-DTS vornehmen:

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

### 4.3 Type-C to Type-A USB&DP DTS Konfiguration

Type-C-to-Type-A-USB&amp;DP trennt USB und DP und unterstützt USB 3.1 + DP mit zwei Lanes oder USB 2.0 + DP mit vier Lanes. Zwei Varianten:

1. DTS für Type-C to Type-A USB 3.1&amp;DP.

2. DTS für Type-C to Type-A USB 2.0&amp;DP.

RK3399-SDK Linux 4.4/4.19 unterstützt die Trennung nicht standardmäßig. drivers/extcon/extcon-pd-virtual.c ersetzt den externen Type-C-Controllertreiber und benachrichtigt Type-C-PHY, DP und USB. Bei Bedarf Unterstützung über Rockchip Redmine anfordern. Zum Dokumentstand unterstützt Linux 5.10 die Trennung noch nicht; eine neue Lösung ohne Spezialtreiber wird entwickelt. Hardware/Software für Type-C to USB2.0 + DP mit vier Lanes: https://redmine.rockchip.com.cn/documents/113.

#### 4.3.1 Type-C to Type-A USB 3.1&DP DTS Konfiguration

Type-A USB 3.1 verwendet Type-C-PHY lane0/1, DP 1.3 lane2/3. Beispiel Type-C0 Linux 4.4/4.19:

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

#### 4.3.2 Type-C to Type-A USB 2.0&DP DTS Konfiguration

Type-A USB 2.0 nutzt keinen Type-C-PHY; DP mit vier Lanes zu HDMI2.0 verwendet lane0/1/2/3. Beispiel Linux 4.4/4.19 Type-C0:

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

Bei Type-A muss die Anwendung nach dem Start Peripheral/Host über den Kernel-OTG-Umschaltknoten wählen. Siehe RK3399-OTG-Umschaltbefehle.

### 4.4 Type-C to Type-A USB only DTS Konfiguration

Type-C to Type-A USB only: USB3.1/2.0 ohne DP; kein automatischer OTG-Wechsel, aber erzwungener Softwarewechsel; kein externer Type-C-Controller nötig. Vier Varianten:

1. DTS für Type-C to Type-A USB 3.1 OTG.

2. DTS für Type-C to Type-A USB 3.1 Host only.

3. DTS für Type-C to Type-A USB 2.0 OTG.

4. DTS für Type-C to Type-A USB 2.0 Host only.

#### 4.4.1 Type-C to Type-A USB 3.1 OTG DTS Konfiguration

Type-C to Type-A USB 3.1 OTG verwendet üblicherweise RK3399-Type-C0 und unterstützt Type-A USB

3.1 OTG ohne DP. Nach dem Start steht der Controller auf OTG/Device ohne automatischen Device/Host-Wechsel; für Host ruft die Anwendung die Kernelschnittstelle auf, siehe OTG-Befehle. VBUS kann dauerhaft oder GPIO/PMIC-gesteuert sein, siehe VBUS; alle drei Type-C-Versorgungen aktivieren. Linux 4.4: keinen externen FUSB302/HUSB311 konfigurieren; kein extcon in tcphy, u2phy und Elternknoten usbdrd3; dr_mode="otg"; optional vbus-supply in u2phy0_otg für Host-5V. Linux 4.19: ebenfalls kein externer Controller und kein extcon in tcphy/u2phy; extcon in usbdrd_dwc3_0 für Software-OTG ergänzen; dr_mode="otg"; optional vbus-supply in u2phy0_otg. Für Linux 5.10:

Keinen externen FUSB302/HUSB311 konfigurieren; in tcphy kein orientation-switch samt zugehörigen Eigenschaften; in usbdrd_dwc3_0 kein usb-role-switch samt Eigenschaften, aber extcon ergänzen; dr_mode="otg"; optional vbus-supply in u2phy0_otg für Host-5V. Beispiel Type-C0 to Type-A USB 3.1 OTG mit VBUS über GPIO3_PC6:

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

VBUS-GPIO ist optional. RK3399 erlaubt dauerhaftes VBUS nach dem Einschalten: Dann kein vbus-supply in u2phy0_otg, aber rockchip,vbus-always-on ergänzen, sonst kann ADB scheitern. Beispiel Type-C0; für Type-C1 u2phy1_otg ändern:

```text
&u2phy0_otg {
        rockchip,vbus-always-on;
};
```

#### 4.4.2 Type-C to Type-A USB 3.1 Host only DTS Konfiguration

Type-C to Type-A USB 3.1 Host wird häufig an Type-C1 eingesetzt, etwa IND EVB. VBUS-5V dauerhaft oder GPIO-gesteuert; alle drei Type-C1-Versorgungen für SuperSpeed aktivieren. Linux 4.4/4.19: kein externer FUSB302/HUSB311; kein extcon in tcphy, u2phy und usbdrd3; dr_mode="host"; optional phy-supply in u2phy steuert VBUS-5V. Linux 5.10: kein externer Controller, orientation-switch oder zugehörige tcphy-Eigenschaften; kein usb-role-switch, zugehörige Eigenschaften oder extcon in usbdrd_dwc3_0; dr_mode="host"; optional phy-supply in u2phy.

Beispiel IND EVB Type-C1 to Type-A USB 3.1 Host: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

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

#### 4.4.3 Type-C to Type-A USB 2.0 OTG DTS Konfiguration

Type-C to Type-A USB 2.0 OTG meist an Type-C0 ist vereinfachtes USB 3.1 OTG mit nur USB 2.0. Nach dem Start OTG/Device ohne automatischen Device/Host-Wechsel; für Host Kernelschnittstelle nutzen, siehe OTG-Befehle. VBUS dauerhaft oder GPIO/PMIC, siehe VBUS. Drei Type-C-Versorgungen zum Senken des PHY-Verbrauchs abschalten. DTS wie USB 3.1 OTG, zusätzlich:

1. tcphy deaktivieren.

2. dr_mode, maximum-speed und phys am Controller setzen. Beispiel Type-C0 USB 2.0 OTG mit VBUS an GPIO3_PC6:

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

#### 4.4.4 Type-C to Type-A USB 2.0 Host only DTS Konfiguration

Type-A USB 2.0 Host only unterstützt nach Systemstart nur Host, kein Device, erlaubt aber Firmwareprogrammierung. Selten verwendet, da meist mindestens ADB benötigt wird. VBUS-5V dauerhaft oder GPIO; drei Type-C-Versorgungen zum Energiesparen abschalten. DTS siehe USB 3.1 OTG, zusätzlich:

1. tcphy deaktivieren.

2. dr_mode, maximum-speed und phys setzen. Beispiel Type-C0 USB 2.0 Host only mit dauerhaftem VBUS:

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

### 4.5 Type-C to Micro USB DTS Konfiguration

#### 4.5.1 Type-C to Micro USB 3.1 OTG Mode DTS Konfiguration

Micro USB 3.1 erkennt OTG-Kabel automatisch und wechselt Device/Host ohne externen Type-C-Controller. Günstiger als Type-C, aber wegen großem Anschluss für Embedded-Geräte selten. VBUS-5V per GPIO; TYPEC0_ID an Anschluss-ID. DTS entspricht Type-A USB 3.1 OTG mit drei Unterschieden:

1. Linux 4.4 benötigt extcon im Elternknoten usbdrd3:

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

2. Linux 4.19/5.10 benötigt extcon im Kindknoten usbdrd_dwc3:

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

3. vbus-supply in u2phy0_otg ist zum Schalten von VBUS-5V erforderlich.

#### 4.5.2 Type-C to Micro USB 2.0 OTG Mode DTS Konfiguration

Micro USB 2.0 erkennt OTG-Kabel und wechselt Device/Host automatisch ohne externen Controller. Günstiger als Type-C, aber maximal USB 2.0 480Mbps.

VBUS-5V per GPIO; TYPEC0_ID an Anschluss-ID für OTG; drei Type-C-Versorgungen zum Energiesparen abschalten. DTS entspricht Type-A USB 2.0 OTG mit drei Unterschieden:

1. Linux 4.4 benötigt extcon im Elternknoten usbdrd3:

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

2. Linux 4.19/5.10 benötigt extcon im Kindknoten usbdrd_dwc3:

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

3. vbus-supply in u2phy0_otg ist zum Schalten von VBUS-5V erforderlich.

### 4.6 Type-A USB 2.0 Host DTS Konfiguration

RK3399 hat zwei USB2.0-Hosts mit EHCI&amp;OHCI, gewöhnlich Type-A. Passenden Controller und PHY nach Schaltung und Tabelle 4-1 aktivieren; phy-supply des PHY-Knotens steuert VBUS-5V. Steuerungsvarianten siehe Host-VBUS-Abschnitt.

Type-A-USB-2.0-Host-DTS ist kernelübergreifend gleich. Beispiel USB20_HOST0 IND EVB: arch/arm64/boot/dts/rockchip/rk3399-evb-ind.dtsi.

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

phy-supply steuert den USB-VBUS-Regulator, nicht die PHY-eigene Versorgung.

## 5. RK3399 USB 3.1 force to USB 2.0

Erzwungenes USB 2.0 bei verbundenem USB-3.0-TX/RX dient Hardwareproblemen oder Sonderanforderungen. Diese ungewöhnliche Funktion ist nicht standardmäßig im SDK; Rockchip liefert einen separaten Patch auf Redmine-Anfrage.

## 6. RK3399 USB OTG mode Umschaltbefehle

SDK erlaubt erzwungenes Host/Peripheral unabhängig von ID und Type-C. Linux 4.4, alte Schnittstelle:

```text
#1.Force host mode
  echo host > /sys/kernel/debug/usb@fe800000/rk_usb_force_mode
#2.Force peripheral mode
  echo peripheral > /sys/kernel/debug/usb@fe800000/rk_usb_force_mode
```

Neue Schnittstelle:

```text
#1.Force host mode
  echo host > /sys/devices/platform/usb0/dwc3_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/usb0/dwc3_mode
```

Legacy-Befehle für Linux 4.19/5.10:

```text
#1.Force host mode
  echo host > /sys/devices/platform/ff770000.syscon/ff770000.syscon:usb2-phy@e450/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/ff770000.syscon/ff770000.syscon:usb2-phy@e450/otg_mode
```

Neuer Linux-5.10-Befehl:

```text
#1.Force host mode
  echo host > /sys/kernel/debug/usb/fe800000.usb/mode
#2.Force peripheral mode
  echo device > /sys/kernel/debug/usb/fe800000.usb/mode
```

Hinweise:

1. Befehle gelten für Type-C0. Für nicht empfohlenes Type-C1-OTG den USB-Knotennamen durch den zu Type-C1 gehörenden ersetzen.

2. Der neue 5.10-Befehl beseitigt alte Einschränkungen: Abhängigkeit von korrektem DTS und Verwendung nur bei Nicht-Type-C-Schaltungen.

## 7. RK3399 Hinweise zur USB-DTS-Konfiguration

### 7.1 Linux-4.4 und Linux-4.19 Unterschiede im USB-3.0-DTS

Linux-4.19-DWC3 wurde gegenüber 4.4 stark überarbeitet; DTS-Unterschiede:

1. power-domains, resets und extcon wanderten von usbdrd3 zum Kind usbdrd_dwc3.

2. Type-C to Type-A benötigt unter 4.19 extcon in usbdrd_dwc3 für Software-OTG; 4.4 verlangt dies nicht.

### 7.2 Linux-5.10 Unterschiede des Type-C-DTS zu früheren Kerneln

Linux-5.10-TCPM kommuniziert mit USB-PHY/Controller per Callback statt extcon. Wesentliche DTS-Änderungen:

1. ports am externen Controller, etwa FUSB302, verknüpft usb-role-switch.

2. connector beschreibt data-role, powr-role (Vorlagenschreibweise), sink-pdos, source-pdos und alt-modes. Siehe Linux-5.10 Type-C USB

3.1&amp;DP DTS [FUSB302].

### 7.3 Linux USB DTS wichtige Eigenschaften

1. usb-role-switch nur für Standard-Type-C mit PD-Controller und dr_mode="otg". Bei dr_mode="host" usb-role-switch entfernen, sonst sind DP-Fehler möglich.

2. vbus-supply und phy-supply am USB2-PHY steuern VBUS-5V: ersteres dynamisch für OTG, letzteres dauerhaft nach Einschalten für USB2-Host.

3. extcon dient dynamischem OTG. Unter Linux 4.19 für Softwareumschaltung in usbdrd_dwc3 ergänzen.

4. Für erzwungenes USB3.1-to-USB2.0 sind zwei Controllereigenschaften nötig:

```text
"snps,usb2-lpm-disable"   /* 兼容不⽀持 U2 LPM 的U盘 */
"snps,dis_u2_susphy_quirk" /* 关闭 USB 控制器⾃动 suspend usb2 phy 的功能 */
```

### 7.4 Type-C1 Anpassungen für OTG mode

Gadget erlaubt nur einen Device-Controller. SDK setzt Type-C0 auf OTG/Peripheral und Type-C1 auf Host; bei Bedarf kann Type-C1 OTG/Peripheral werden. Hinweise:

1. TYPEC1_U2VBUSDET muss mit Anschluss-VBUS verbunden sein, sonst funktioniert OTG1-Device nicht korrekt.

2. Firmwaredownload weiterhin ausschließlich über Type-C0.

3. Dual-Type-C-OTG ist nicht unterstützt; bei Type-C1-OTG Type-C0 auf dr_mode="host" setzen. Änderungen für Linux 4.4/4.19:

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

Type-C1-OTG-Änderungen für Linux 5.10:

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

## 8. USB Host VBUS Steuerungsmethoden

Drei Hardwarevarianten für VBUS:

1. GPIO steuert den VBUS-5V-Regler. Übliche Lösung für Type-C, Type-A und Micro. DTS entsprechend in den Abschnitten vollwertiges Type-C USB 3.1/DP, Type-C to Type-A USB only und Type-C to Micro USB.

2. PMIC wie RK817/RK818 liefert VBUS-5V. (1) Für RK8xx außer RK809 keine VBUS-DTS-Eigenschaften setzen; dies kann die Versorgung stören. Treiber benachrichtigt PMIC über EXTCON_USB_VBUS_EN. (2) Für andere Hersteller Empfangslogik nach drivers/power/rk818_charger.c implementieren. (3) RK809 bietet nur VBUS-Ausgang ohne Laden, daher keine Benachrichtigungsmethode; vbus-supply am USB2-PHY zur RK809-Steuerung setzen. Beispiel:

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

3. Hardware liefert nach Einschalten dauerhaft VBUS-5V ohne Softwaresteuerung, gewöhnlich für Host.

## 9. Type-C unterstützte Controller

Tabelle 9-1. Unterstützte Type-C-Controller.

| Type-C-Controllermodell | Linux-4.4 | Linux-<br>4.19 | Linux-<br>5.10 | Hinweise |
| --- | --- | --- | --- | --- |
| FUSB302 | Ja | Ja | Ja | Auf RK am häufigsten verwendet |
| ET7301B | Ja | Ja | Ja | Hardware und Software vollständig FUSB302-kompatibel, Hinweis 1 |
| ET7303 | Nein | Ja | Ja | FUSB302-hardwarekompatibel; Treiber sehr ähnlich zu RT1711, Hinweis 2 |
| HUSB311 | Nein | Ja | Ja | Vorrangig empfohlen; FUSB302-hardwarekompatibel, Treiber nicht kompatibel, Hinweis 3 |
| RT1711H | Nein | Ja | Ja | FUSB302-hardwarekompatibel; Treiber sehr ähnlich zu ET7303, Hinweis 4 |
| ANX7411 | Nein | Nein | In Erprobung | RK3588-Anpassung läuft |
| WUSB3801 | Nicht im SDK unterstützt; in einzelnen Projekten verwendet | Nein | Nein | Proprietäre Eindrahtkommunikation; hohe Fehlerrate, Stabilität nicht gewährleistet. |

Hinweis 1. Linux 4.4 ohne TCPM unterstützt nur ohne Änderungen austauschbare FUSB302/ET7301B. Linux 4.19/5.10 mit TCPM/TCPCI ist theoretisch zu allen TCPCI-Chips wie ET7303/HUSB311/RT1711H kompatibel.

Hinweis 2. ET7303 im kleinen Gehäuse wurde auf RK validiert; laut Vorlage kein großes Gehäuse verfügbar. CONFIG_TYPEC_ET7303 aktivieren. DTS siehe HUSB311 für 4.19/5.10: gleiche I2C-Adresse 0x4E, nur Name und compatible="etek,et7303" ändern.

Hinweis 3. RK3399-Excavator-FUSB302-Schaltung benötigt für HUSB311 Drahtbrücken; IND erlaubt direkten Austausch. CONFIG_TYPEC_HUSB311 aktivieren; DTS siehe HUSB311-Abschnitte für Linux 4.19/5.10.

Hinweis 4. RT1711H ist hardwarekompatibel zu FUSB302/ET7303, der Treiber ähnelt ET7303. CONFIG_TYPEC_RT1711H aktivieren. I2C 0x4E; DTS wie HUSB311/ET7303, nur Name und compatible="richtek,rt1711h" ändern.

## 10. Referenzdokumente

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
