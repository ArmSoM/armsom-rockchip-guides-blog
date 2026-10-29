---
title: "RK356x USB: Controller, PHYs, Schnittstellenschaltungen und DTS"
description: "RK356x USB: Controller, PHYs, Schnittstellenschaltungen und DTS — V1.4.0"
translation_key: "167-rockchip-rk356x-usb"
slug: "167-rockchip-rk356x-usb"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
reference_products: ["Sige3", "CM3", "AIM3", "KVM"]
products: []
tags: [ArmSoM, Rockchip, USB, Type-C, PHY, DTS]
excerpt: "RK356x USB: Controller, PHYs, Schnittstellenschaltungen und DTS — V1.4.0"
---

{% raw %}

Vollständiger technischer Inhalt der chinesischen und englischen Rockchip-RK356x-USB-Anleitung V1.4.0. Geltungsbereich: RK356x, Linux 4.19+. ArmSoM-Plattformreferenz, keine Zusage für jedes Board. Board, SDK/BSP, Kernelzweig, USB/DP-Pins, VBUS-Versorgung und Type-C-Controller müssen abgeglichen werden. Keine ArmSoM-Hardwarevalidierung; Ergebnisse und Ausgaben stammen aus dem Original. Chinesisch verwendet chinesische Originalbilder, die übrigen Sprachen englische.

Originalüberblick: Hardware- und Treiberdesign der RK356x-USB-Controller und USB-PHYs für flexible, produktgerechte USB-Entwicklung. Geltungsbereich der Originaltabelle: RK3566 und RK3568, Linux-4.19 und neuer.

> Unterstützungs- und Erprobungsangaben gelten für den Dokumentstand, nicht für das heutige SDK. Versorgung und Verdrahtung müssen Bauteilgrenzwerte einhalten. Befehle erfordern Prüfung und ein angepasstes Testgerät; hier wurden sie nicht ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. RK356x USB-Controller und PHY: Einführung

Tabelle 1. Unterstützte RK356x-USB-Controller.

| Chip/Controller | USB 2.0 HOST (EHCI/OHCI) | USB 3.0/2.0 OTG (DWC3/xHCI) |
| --- | --- | --- |
| RK3566 | 2 | 2 (OTG 2.0 + Host 3.0) |
| RK3568 | 2 | 2 (OTG 3.0+ Host 3.0) |

Tabelle 2. Unterstützte RK356x-USB-PHYs.

| Chip/PHY | USB 2.0 ComboPHY | USB 3.0/SATA/QSGMII ComboPHY |
| --- | --- | --- |
| RK3566 | 2 [2 × port] | 1 |
| RK3568 | 2 [2 × port] | 2 |

Hinweise:

1. N bezeichnet N unabhängige USB-Controller.

2. [2 × ports] bezeichnet zwei Ports je PHY.

3. EHCI/OHCI bedeutet integrierte EHCI- und OHCI-Controller, DWC3/xHCI entsprechend DWC3 und xHCI.

4. RK3566-DWC3-OTG unterstützt nur OTG 2.0 mit maximal 480Mbps, kein OTG 3.0. RK3568 unterstützt OTG 3.0. Beide bieten einen USB-3.0-Host und zwei USB-2.0-Hosts. Abbildung 1-1 zeigt die RK3568-Verbindungen:

1. USB 3.0 OTG und SATA_0 teilen USB3/SATA Combo PHY_0.

2. USB 3.0 Host_1 und SATA_1/QSGMII teilen USB3/SATA/QSGMII Combo PHY_1.

3. USB 3.0 OTG und Host_1 verwenden port0 beziehungsweise port1 des USB 2.0 Comb PHY_0.

4. USB 2.0 Host_2/Host_3 verwenden port0/port1 des USB 2.0 Comb PHY_1. Combo PHY_0 und Combo PHY_1 arbeiten jeweils nur in einem Modus: USB3, SATA und QSGMII schließen sich aus. Gewünschte Peripherie per DTS wählen; siehe RK356x-USB-DTS.

![Originalabbildung 1, englisches PDF, Seite 6](/docs/rockchip-rk356x-usb/assets/en-p006-figure-01.png)

*Originalabbildung 1, englisches PDF, Seite 6*

Abbildung 1-1. Verbindungen der RK3568-USB-Controller und PHYs.

## 2. RK356x USB-Hardwaredesign

RK356x erlaubt verschiedene Schaltungen. RK3568 besitzt vier USB-Schnittstellen: einmal USB 3.0 OTG, einmal USB 3.0 Host und zweimal USB 2.0 Host (Abbildung 2-1). RK3566 hat ebenfalls vier: einmal USB 2.0 OTG, einmal USB 3.0 Host und zweimal USB 2.0 Host.

![Originalabbildung 2, englisches PDF, Seite 7](/docs/rockchip-rk356x-usb/assets/en-p007-figure-01.png)

*Originalabbildung 2, englisches PDF, Seite 7*

Abbildung 2-1. USB-Schnittstellen im RK3568-Schaltplan.

### 2.1 RK356x USB 2.0/3.0 Versorgung und Leistungsaufnahme

Grundsätze der Verbrauchsregelung:

1. Lässt sich USB2-/Combo-PHY hardwareseitig stromlos schalten, beträgt dessen Verbrauch null; DTS-Knoten deaktivieren.

2. Muss USB2-PHY versorgt bleiben, beide Portknoten aktivieren, damit der Treiber ungenutzte Ports in suspend setzt.

3. DTS-Knoten ungenutzter USB-Controller deaktivieren.

4. DTS-Knoten ungenutzter Combo-PHYs deaktivieren.

#### 2.1.1 RK356x Versorgung und Leistungsaufnahme der USB-2.0/3.0-Controller

USB2/3-Controller werden aus VDD_LOGIC versorgt. USB3 teilt PD_PIPE mit PCIe/SATA/XPCS; die Domäne kann dynamisch geschaltet werden. USB2 hat keine Power-Domäne. Der RK356x-Kernel unterstützt dynamisches PD_PIPE für USB3-OTG und Host-auto-suspend ohne Peripherie bereits; keine zusätzliche Leistungsregelungsentwicklung nötig. Ungenutzte Controller im DTS deaktivieren. Beispiel Host_2/Host_3:

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

#### 2.1.2 RK356x USB 2.0 PHYs Versorgung und Leistungsaufnahme

Zwei USB2-Combo-PHYs: PHY_0 für OTG/Host_1, PHY_1 für Host_2/Host_3. Jeder hat drei Versorgungen:

3.3V, 1.8V und 0.9V, siehe Tabelle 3. Unter-/Überschreiten der Grenzwerte (zulässig ±10%) kann USB-Verbindungsfehler verursachen. Tabelle 3: USB2-PHY-Versorgung.

| Versorgungsspannung | Min. | Typ. | Max. | Einheit |
| --- | --- | --- | --- | --- |
| USB_AVDD_3V3 | 3.0 | 3.3 | 3.6 | V |
| USB_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| USB_AVDD_0V9 | 0.81 | 0.9 | 0.99 | V |

![Originalabbildung 3, englisches PDF, Seite 8](/docs/rockchip-rk356x-usb/assets/en-p008-figure-01.png)

*Originalabbildung 3, englisches PDF, Seite 8*

Abbildung 2-2. Versorgung USB2 Comb PHY_0 für OTG/Host_1.

![Originalabbildung 4, englisches PDF, Seite 9](/docs/rockchip-rk356x-usb/assets/en-p009-figure-01.png)

*Originalabbildung 4, englisches PDF, Seite 9*

Abbildung 2-3. Versorgung USB2 Comb PHY_1 für Host_2/Host_3. Nach Einschalten ist der PHY aktiv: dynamische Treiberregelung (bereits unterstützt) oder Stromabschaltung erforderlich. PHY_0 darf nicht abgeschaltet werden, da er mindestens zum USB-Firmwaredownload benötigt wird. Typisches Produkt nur mit OTG, ohne Host_1/2/3; empfohlene Optimierung

für USB-2.0-PHY:

1. u2phy0_host im DTS deaktivieren, damit probe ihn nicht initialisiert und seinen Verbrauch erhöht.

2. PHY_1-Versorgung abschalten: Wie in Abbildung 2-4 seine drei Versorgungsanschlüsse an Masse legen.

![Originalabbildung 5, englisches PDF, Seite 10](/docs/rockchip-rk356x-usb/assets/en-p010-figure-01.png)

*Originalabbildung 5, englisches PDF, Seite 10*

Abbildung 2-4. Abschaltung PHY_1 für Host_2/Host_3. Im DTS unbedingt u2phy1_host, u2phy1_otg und zugehörige usb_host1_ehci/usb_host1_ohci deaktivieren:

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

Ist der PHY stromlos, sein Controller aber nicht deaktiviert, hängt der Kernel bei USB-Initialisierung. Typisches Protokoll:

```text
[    1.240101] ohci_hcd: USB 1.1 'Open' Host Controller (OHCI) Driver
[    1.241896] ohci-platform: OHCI generic platform driver
[    1.242698] ohci-platform fd8c0000.usb: Generic Platform OHCI controller
[    1.243686] ohci-platform fd8c0000.usb: new USB bus registered, assigned bus
number 3
```

#### 2.1.3 RK356x USB 3.0 PHYs Versorgung und Leistungsaufnahme

RK3566-Host_1 verwendet USB3/SATA/QSGMII Combo PHY_1 (MULTI_PHY1). RK3568-OTG nutzt USB3/SATA Combo PHY_0 (MULTI_PHY0), Host_1 Combo PHY_1 (MULTI_PHY1). MULTI_PHY0/1/2 teilen die Versorgungen 0.9V und 1.8V, siehe Abbildung 2-5 und Tabelle 4. Tabelle 4: USB3-Combo-PHY.

| Versorgungsspannung | Min. | Typ. | Max. | Einheit |
| --- | --- | --- | --- | --- |
| MULTI_PHY_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| MULTI_PHY_AVDD_0V9 | 0.81 | 0.9 | 0.99 | V |

![Originalabbildung 6, englisches PDF, Seite 11](/docs/rockchip-rk356x-usb/assets/en-p011-figure-01.png)

*Originalabbildung 6, englisches PDF, Seite 11*

Abbildung 2-5. Versorgung der RK356x-Multi-PHYs. Beim Einschalten sind alle drei aktiv. U-Boot setzt sie für minimalen Verbrauch in reset. Im Kernel lösen USB

3.0/SATA/PCIe/QSGMII-Treiber reset per rockchip_combphy_init(). Im USB3-Modus steuert der Controller PIPE P0/P1/P2/P3 automatisch. Host ohne Gerät: P3; mit U3-Disk: P0; USB3-Hub ohne Downstream-Geräte: automatisch P3, bei Geräteanschluss P0. P0 ist Normalbetrieb, P3 Minimalverbrauch. Ungenutzte PHYs und USB3-Controller im DTS deaktivieren, siehe DTS-Abschnitt.

### 2.2 RK3566 USB 2.0 OTG Micro-B Schnittstellenschaltung

RK3566-Micro-B-OTG in Abbildungen 2-6–2-8 entspricht anderen Rockchip-SDKs; das Prinzip wird nicht nochmals erläutert. Drei Hinweise:

1. Je 2.2 Ω in Reihe mit DP und DM für Überspannungs-/ESD-Festigkeit.

2. Für Device-Hotplug und Ladeerkennung VBUSDET an den Micro-Anschluss anbinden.

3. Ohne diese Funktionen VBUSDET auf 3.3V ziehen (empfohlen) oder offen lassen. RK356x-MaskROM benötigt VBUSDET nicht und kann auch bei offenem Pin Firmware herunterladen.

![Originalabbildung 7, englisches PDF, Seite 12](/docs/rockchip-rk356x-usb/assets/en-p012-figure-01.png)

*Originalabbildung 7, englisches PDF, Seite 12*

Abbildung 2-6. RK3566-USB2-OTG-Pins.

![Originalabbildung 8, englisches PDF, Seite 12](/docs/rockchip-rk356x-usb/assets/en-p012-figure-02.png)

*Originalabbildung 8, englisches PDF, Seite 12*

Abbildung 2-7. RK3566-USB2-OTG-Micro-B.

![Originalabbildung 9, englisches PDF, Seite 13](/docs/rockchip-rk356x-usb/assets/en-p013-figure-01.png)

*Originalabbildung 9, englisches PDF, Seite 13*

Abbildung 2-8. RK3566-VBUS-/OTG_ID-Steuerung.

### 2.3 RK3566 USB 2.0 OTG Type-C Schnittstellenschaltung

#### 2.3.1 RK3566 Type-C USB 2.0 only Schaltungsentwurf[No PD]

RK3566-Type-C-USB2-only in Abbildungen 2-9–2-11 bietet:

1. USB2-OTG-Erkennung und automatische Umschaltung.

2. Kein Type-C-PD.

3. Kein externer Type-C-Controller, geringere Kosten. DP1/DM1 und DP2/DM2 sind direkt mit USB_OTG0_DP/DM verbunden; keine Orientierungserkennung nötig. CC1/CC2 bestimmen UFP/DFP (Device/Host), siehe Abbildung 2-11. Grundlage: USB Type-C Specification [1], Abschnitte 3.5.2 USB Type-C to USB 2.0 Standard-A Cable Assembly und 3.6.1 USB Type-C to USB 3.1 Standard-A Receptacle Adapter Assembly:

1. Type-C-to-USB-2.0-Standard-A-Kabel: A5 (CC) des Type-C-Steckers über Rp 56 kΩ ±5% an VBUS.

2. Type-C to USB 3.1 Standard-A Receptacle: A5 (CC) über Rd 5.1 kΩ ±20% an GND.

![Originalabbildung 10, englisches PDF, Seite 14](/docs/rockchip-rk356x-usb/assets/en-p014-figure-01.png)

*Originalabbildung 10, englisches PDF, Seite 14*

Abbildung 2-9. RK3566-USB2-OTG-Pins.

![Originalabbildung 11, englisches PDF, Seite 14](/docs/rockchip-rk356x-usb/assets/en-p014-figure-02.png)

*Originalabbildung 11, englisches PDF, Seite 14*

Abbildung 2-10. RK3566-USB2-OTG-Type-C-Anschluss.

![Originalabbildung 12, englisches PDF, Seite 14](/docs/rockchip-rk356x-usb/assets/en-p014-figure-03.png)

*Originalabbildung 12, englisches PDF, Seite 14*

Abbildung 2-11. CC-Erkennung für RK3566-USB2-Type-C. Hinweise:

1. USB_OTG0_ID hat intern einen 155K-ohm-Pull-up auf 1.8V.

2. Type-C-to-USB2-Standard-A-Plug-Kabel zieht CC schwach auf VBUS-5V; ID ist High, OTG arbeitet als Device.

3. Type-C-to-USB2-Standard-A-Receptacle-Kabel zieht CC schwach auf GND; ID wird Low, der ID-Interrupt schaltet OTG auf Host.

#### 2.3.2 RK3566 Type-C USB 2.0 + PD Hardwareschaltung

RK3566-Type-C-USB2 + PD in Abbildungen 2-12–2-14 bietet:

1. USB2-OTG-Erkennung und automatische Umschaltung.

2. Type-C-PD-Unterstützung.

3. Externer Type-C-Controller erforderlich.

4. Eine VBUS-5-V-Reglerschaltung ist für PD-Laden mit höherer Spannung und höherem Strom erforderlich.

![Originalabbildung 13, englisches PDF, Seite 15](/docs/rockchip-rk356x-usb/assets/en-p015-figure-01.png)

*Originalabbildung 13, englisches PDF, Seite 15*

Abbildung 2-12. RK3566 Type-C USB 2.0 + PD

![Originalabbildung 14, englisches PDF, Seite 15](/docs/rockchip-rk356x-usb/assets/en-p015-figure-02.png)

*Originalabbildung 14, englisches PDF, Seite 15*

Abbildung 2-13. RK3566-Type-C-FUSB302-Schaltung

![Originalabbildung 15, englisches PDF, Seite 16](/docs/rockchip-rk356x-usb/assets/en-p016-figure-01.png)

*Originalabbildung 15, englisches PDF, Seite 16*

Abbildung 2-14. RK3566-Type-C-VBUS-5-V-Reglerschaltung

### 2.4 RK356x USB 2.0 Host Type-A Schnittstellenschaltung

Die USB-2.0-Host-Type-A-Schaltungen des RK356x sind in Abbildungen 2-15 und 2-16 dargestellt. Sie entsprechen üblichen USB-2.0-Host-Schaltungen anderer Rockchip-SDKs; das Prinzip wird deshalb nicht erneut erläutert. Wird USB 2.0 Host nicht benötigt, sollte dessen PHY-Versorgung getrennt werden; siehe den Abschnitt zur Versorgung und Leistungsaufnahme der RK356x-USB-2.0-PHYs und die Schaltung in Abbildung 5.

![Originalabbildung 16, englisches PDF, Seite 16](/docs/rockchip-rk356x-usb/assets/en-p016-figure-02.png)

*Originalabbildung 16, englisches PDF, Seite 16*

Abbildung 2-15. RK356x-USB-2.0-Host-Pins

![Originalabbildung 17, englisches PDF, Seite 17](/docs/rockchip-rk356x-usb/assets/en-p017-figure-01.png)

*Originalabbildung 17, englisches PDF, Seite 17*

Abbildung 2-16. RK356x-USB-2.0-Host-Schnittstelle

### 2.5 RK3568 USB 3.0 OTG Type-A Schnittstellenschaltung

Die RK3568-USB-3.0-OTG-Type-A-Schaltung ist in Abbildungen 2-17–2-19 dargestellt. Der Anschluss ist kleiner als Micro USB 3.0 und bequem für Peripheriegeräte. Da USB3_OTG0_ID nicht ausgewertet wird, kann die Hardware jedoch nicht automatisch in OTG Host wechseln; erforderlich sind die Befehle im Abschnitt zum RK356x-USB-OTG-Moduswechsel. Standardmäßig arbeitet USB 3.0 OTG normalerweise im OTG-Modus. Beim Anschluss an einen PC schaltet der Treiber automatisch auf Device. Für USB-Peripherie wie einen Speicherstick muss Host per Software erzwungen werden; auch der Wechsel zurück zu Device erfolgt per Software. Einige USB-3.0-Geräte, etwa mechanische Festplatten und Kameras, benötigen höhere Ströme. VBUS muss im Host-Modus daher mehr als 1 A liefern. In Abbildung 2-19 ist die Strombegrenzung des SY6280AAC auf 1.446 A eingestellt, ausreichend für die meisten USB-3.0-Geräte. Vier Punkte sind zu beachten:

1. In DP und DM ist jeweils ein 2.2-Ω-Serienwiderstand erforderlich, um Spannungs- und ESD-Festigkeit zu verbessern.

2. Für dynamische USB-Device-Anschluss-/Trennungserkennung und Ladearterkennung muss VBUSDET mit dem USB-Type-A-Anschluss verbunden sein.

3. Ohne diese Funktionen darf VBUSDET dauerhaft auf 3.3 V liegen oder offen bleiben; empfohlen sind 3.3 V. Die RK356x-Maskrom-USB-Verbindung hängt nicht von VBUSDET ab. Auch bei offenem Pin funktioniert Maskrom USB und kann Firmware herunterladen.

4. Der unbenutzte USB3_OTG0_ID kann offen bleiben; intern ist er auf 1.8 V hochgezogen.

![Originalabbildung 18, englisches PDF, Seite 18](/docs/rockchip-rk356x-usb/assets/en-p018-figure-01.png)

*Originalabbildung 18, englisches PDF, Seite 18*

Abbildung 2-17. RK3568-USB-3.0-OTG-Pins

![Originalabbildung 19, englisches PDF, Seite 18](/docs/rockchip-rk356x-usb/assets/en-p018-figure-02.png)

*Originalabbildung 19, englisches PDF, Seite 18*

Abbildung 2-18. RK3568-USB-3.0-OTG-Type-A-Schnittstelle

![Originalabbildung 20, englisches PDF, Seite 19](/docs/rockchip-rk356x-usb/assets/en-p019-figure-01.png)

*Originalabbildung 20, englisches PDF, Seite 19*

Abbildung 2-19. RK3568-USB-3.0-OTG-VBUS- und OTG-ID-Steuerung

### 2.6 RK3568 USB 3.0 OTG Type-C Schnittstellenschaltung

Das beschriebene RK3568-SDK enthält keine USB-3.0-OTG-Type-C-Referenzschaltung. Dafür müssen zwischen RK3568 USB 3.0 OTG und Type-C ein USB-3.1-Switch, beispielsweise FUSB340, und ein CC-Kommunikationschip, beispielsweise FUSB302, eingefügt werden.

### 2.7 RK356x USB 3.0 HOST Type-A Schnittstellenschaltung

Die USB-3.0-HOST-Type-A-Schaltung für RK3566/RK3568 entspricht weitgehend der zuvor beschriebenen RK3568-USB-3.0-OTG-Type-A-Schaltung; USB 3.0 HOST besitzt jedoch weder VBUSDET noch ID. Hinweise zur Auslegung stehen im Abschnitt RK3568 USB 3.0 OTG Type-A.

![Originalabbildung 21, englisches PDF, Seite 20](/docs/rockchip-rk356x-usb/assets/en-p020-figure-01.png)

*Originalabbildung 21, englisches PDF, Seite 20*

Abbildung 2-20. RK356x-USB3.0-HOST1-Pins

![Originalabbildung 22, englisches PDF, Seite 20](/docs/rockchip-rk356x-usb/assets/en-p020-figure-02.png)

*Originalabbildung 22, englisches PDF, Seite 20*

Abbildung 2-21. RK356x-USB3.0-HOST1-Type-A-Schnittstelle

![Originalabbildung 23, englisches PDF, Seite 20](/docs/rockchip-rk356x-usb/assets/en-p020-figure-03.png)

*Originalabbildung 23, englisches PDF, Seite 20*

Abbildung 2-22. RK356x-USB3.0-HOST1-VBUS-Steuerung

## 3. RK356x USB DTS Konfiguration

Die RK356x-USB-Hardware bietet viele Varianten, insbesondere flexible USB-OTG-Schaltungen und komplexe USB-3.0/SATA/QSGMII-Combo-PHY-Multiplexbeziehungen. Controller- und PHY-DTS-Knoten müssen deshalb auf Grundlage der verstandenen Hardware korrekt konfiguriert werden. Dieses Dokument beschreibt USB-DTS-Konfiguration, nicht die Controller- und PHY-Treiber. Deren detaillierter Aufbau steht im USB-Entwicklerhandbuch des SDK [2].

### 3.1 RK3568 USB-Controller- und PHY-DTSI-Knoten

Einzelheiten zur DTS-Konfiguration der RK3568-USB-Controller und -PHYs stehen in den Kerneldokumenten [4]–[10]. Der folgende Code zeigt die wichtigsten zugehörigen DTSI-Knoten.

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

### 3.2 RK3568 USB 3.0 OTG to USB 2.0 only Konfiguration

Der USB-3.0-PHY von USB 3.0 OTG und der SATA_0-Controller teilen sich Comb PHY_0. Wird Comb PHY_0 SATA_0 zugewiesen, muss USB 3.0 OTG per folgendem DTS auf USB 2.0 only eingestellt werden; Controller- und PHY-Treiber bleiben unverändert:

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

### 3.3 RK356x USB 3.0 Host to USB 2.0 only Konfiguration

Der USB-3.0-PHY von USB 3.0 Host und die SATA_1/QSGMII-Controller teilen sich Comb PHY_1. Wird dieser SATA_1 oder QSGMII zugewiesen, ist USB 3.0 Host per folgendem DTS auf USB 2.0 only einzustellen; Controller- und PHY-Treiber müssen nicht geändert werden:

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

### 3.4 RK356x Type-C USB DTS Konfiguration

Üblich sind die folgenden fünf RK356x-Type-C-Varianten:

1. RK3566 Type-C USB 2.0 only;

2. RK3568 Type-C USB 2.0 only;

3. RK3566 Type-C USB 2.0 + PD;

4. RK3568 Type-C USB 2.0 + PD;

5. RK3568 Type-C USB 3.0 + PD.

Varianten 1 und 2 verwenden die Schaltung RK3566 Type-C USB 2.0 only [No PD] mit CC-zu-OTG_ID-Umsetzung. Die interne OTG-Erkennung entspricht Micro-B USB; das DTS folgt daher üblichen RK356x-OTG-Micro-USB-/Type-A-Schaltungen. Varianten 3 und 4 verwenden einen externen Type-C-Controller für PD, siehe RK3566 Type-C USB 2.0 + PD. Ihre USB-DTS-Konfiguration ist weitgehend identisch. Hier wird Variante 3 erläutert; für Variante 4 ist zusätzlich der USB-Controller gemäß dem Abschnitt RK3568 USB 3.0 OTG to USB 2.0 only auf USB 2.0 zu begrenzen. Bei Variante 5 kann der RK3568-USB3-PHY die Type-C-Orientierung nicht umschalten. Erforderlich sind deshalb ein externer USB3-Switch wie FUSB340 und ein Type-C-Controller wie FUSB302. Das DTS des Type-C-Controllers folgt Varianten 3 und 4; der USB-3.1-Switch-Steuertreiber muss passend zur ausgewählten Hardware selbst entwickelt werden.

#### 3.4.1 Linux-4.19 RK3566 Type-C USB 2.0 + FUSB302 DTS Konfiguration

Linux-4.19 unterstützt zwei FUSB302-Treiber: drivers/mfd/fusb302.c [Legacy] und drivers/usb/typec/tcpm/fusb302.c [New]. Das Linux-4.19-SDK verwendet standardmäßig Legacy; rockchip_defconfig aktiviert bereits CONFIG_FUSB_30X. Dieser Treiber wurde auf RK3399 breit und in Serienprodukten eingesetzt und wird im Original vorrangig empfohlen. Für den neuen Treiber müssen die Type-C-TCPM-Patches gemäß dem Abschnitt Linux-4.19 RK3566 Type-C USB 2.0 + HUSB311 DTS aktualisiert werden.

Linux-4.19-DTS-Beispiel für den Legacy-FUSB302-Treiber:

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

#### 3.4.2 Linux-4.19 RK3566 Type-C USB 2.0 + HUSB311 DTS Konfiguration

Der im Original aktuelle RK3568-Linux-4.19-Stand unterstützt HUSB311 und ET7303. Beide besitzen die I2C-Adresse 4E; im weitgehend gleichen DTS ändern sich nur Knotenname und compatible. Hier dient HUSB311 als Beispiel. Beide verwenden das Type-C-TCPM-Framework. Linux-4.19 muss daher mit dem aktuellen develop-4.19-Stand synchronisiert werden; falls dies nicht vollständig möglich ist, mindestens folgende Verzeichnisse aktualisieren:

```text
kernel/include/linux/usb
kernel/drivers/usb/typec
kernel/drivers/usb/dwc3
```

Zusätzlich müssen folgende Patches manuell aktualisiert werden:

```text
0001-usb-typec-tcpm-add-vdm-retry-mechanism.patch
0002-arm64-rockchip_defconfig-enable-tcpm-and-husb311-and.patch
```

Laden Sie die vollständige Referenz „RK356x_Linux-4.19_TypeC-HUSB311-ET7303-参考设计“ für die Anpassung herunter: https://redmine.rockchip.com.cn/documents/113. Es folgt das Linux-4.19-DTS-Beispiel für HUSB311 auf RK3566:

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

DTS-Konfiguration der USB-VBUS-Steuerung über PMICs wie RK817/RK818/bq25700

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

#### 3.4.3 Linux-5.10 RK3566 Type-C USB 2.0 + FUSB302 DTS Konfiguration

Linux-5.10 Type-C verwendet das standardisierte TCPM-Framework. Der wichtigste Unterschied zu Linux-4.19 und älteren Kerneln: remote-endpoint und registrierte Rückruffunktionen ersetzen den früheren extcon-Mechanismus. Deshalb benötigt die Type-C-DTS-Konfiguration unter Linux-5.10 kein extcon mehr. Beispiel für FUSB302 auf RK3566:

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

#### 3.4.4 Linux-5.10 RK3566 Type-C USB 2.0 + HUSB311 DTS Konfiguration

Für den Ersatz von FUSB302 durch HUSB311 genügen folgende kleine Änderungen am DTS für Linux-5.10 RK3566 Type-C USB 2.0 + FUSB302:

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

### 3.5 USB VBUS Konfiguration

Rockchip-Plattformen verwenden drei wesentliche USB-VBUS-Steuerungsvarianten [3]:

1. Ein GPIO steuert den Spannungsregler für VBUS 5 V.

2. Ein PMIC wie RK809/RK817/RK818 liefert VBUS 5 V.

3. Nach dem Einschalten liefert die Hardware VBUS 5 V unmittelbar, ohne Softwaresteuerung; dies wird meist für USB Host verwendet. Das RK356x-SDK nutzt überwiegend Variante 1. Es folgt die VBUS-Konfiguration der OTG- und HOST-Ports des RK3568 EVB:

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

### 3.6 Hinweise zur Linux-USB-DT-Konfiguration

#### 3.6.1 USB DT wichtige Eigenschaften

##### 3.6.1.1 DT-Eigenschaften des USB-3.1-Controllers

1. snps,dis_rxdet_inp3_quirk: RK356x-spezifische USB-3.1-Controller-Eigenschaft, die Receiver Detection (Rx-detect) in P3 deaktiviert. Vor der Erkennung wechselt der USB3-PHY von P3 nach P2 und nach etwa 30 us zurück nach P3. Dies behebt Erkennungsprobleme bestimmter USB3-Speichergeräte.

2. snps,dis_u2_susphy_quirk: verhindert, dass der USB-3.1-Controller den USB2-PHY automatisch suspendiert. Bei auf USB 2.0 erzwungenem USB 3.1 ist die Eigenschaft erforderlich, sonst können USB2-Fehler auftreten. In anderen Fällen bleibt USB funktionsfähig, jedoch steigt der Verbrauch bei USB autosuspend.

3. snps,usb2-lpm-disable: deaktiviert USB2 LPM des USB-3.1-Controllers. Beim Erzwingen von USB 2.0 erforderlich, um Speichergeräte ohne USB2 LPM zu unterstützen.

4. usb-role-switch: nur für Linux-5.10 und einen standardmäßigen Type-C-Anschluss mit PD-Controller; zusätzlich ist dr_mode = "otg" erforderlich. Bei anderem dr_mode darf usb-role-switch nicht gesetzt werden.

5. extcon: eine Hauptfunktion ist der dynamische OTG-Moduswechsel. Geeignet für Hardware ohne standardmäßigen Type-C-Anschluss mit PD-Controller, etwa Micro USB oder Type-A, wenn der Controller auf otg eingestellt ist.

##### 3.6.1.2 DT-Eigenschaften des USB2-PHY

1. vbus-supply und phy-supply steuern beide VBUS 5 V, jedoch unterschiedlich: vbus-supply dient OTG und dynamischem Ein-/Ausschalten; phy-supply dient USB2 HOST mit nach dem Einschalten dauerhaft aktivem VBUS 5 V.

2. rockchip,vbus-always-on: für OTG mit ständig versorgtem VBUS. Behebt nicht erkannte USB Devices wie USB ADB, deaktiviert aber USB2-PHY-autosuspend und erhöht dessen Laufzeitverbrauch.

3. rockchip,dis-u2-susphy deaktiviert den dynamischen Suspend-Wechsel des USB2-PHY-Treibers; hauptsächlich für USB

2.0 only, damit der PHY den USB-Controller weiterhin mit einem Takt versorgt.

##### 3.6.1.3 DT-Eigenschaften des USB-3.0/SATA/QSGMII-ComboPHY

1. rockchip,dis-u3otg0-port: deaktiviert den USB3-Root-Port von USB3_OTG0, wenn USB 2.0 erzwungen wird.

2. rockchip,dis-u3otg1-port: deaktiviert den USB3-Root-Port von USB3_HOST1, wenn USB 2.0 erzwungen wird.

## 4. RK356x USB OTG mode Umschaltbefehle

Das RK356x-SDK kann USB 2.0/3.0 OTG per Software unabhängig vom OTG-ID-Pegel oder Type-C in Host oder Peripheral zwingen. Linux-4.19/5.10-Befehle (Legacy):

```text
#1.Force host mode
  echo host > /sys/devices/platform/fe8a0000.usb2-phy/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/fe8a0000.usb2-phy/otg_mode
#3.Force otg mode
  echo otg > /sys/devices/platform/fe8a0000.usb2-phy/otg_mode
```

Neuer Umschaltbefehl in Linux-5.10:

```text
#1.Force host mode
  echo host > /sys/kernel/debug/usb/fcc00000.usb/mode
#2.Force peripheral mode
  echo device > /sys/kernel/debug/usb/fcc00000.usb/mode
```

Hinweis: Der neue Linux-5.10-Befehl beseitigt die Einschränkung des bisherigen Befehls, der von korrektem extcon im USB-DTS abhing.

## 5. Type-C unterstützte Controller

Tabelle 5-1. Unterstützte Type-C-Controller

| Type-C-Controllermodell | Linux-4.4 | Linux-<br>4.19 | Linux-<br>5.10 | Hinweise |
| --- | --- | --- | --- | --- |
| FUSB302 | Ja | Ja | Ja | Auf RK am häufigsten verwendet |
| ET7301B | Ja | Ja | Ja | Hardware und Software vollständig FUSB302-kompatibel, Hinweis 1 |
| ET7303 | Nein | Ja | Ja | FUSB302-hardwarekompatibel; Treiber sehr ähnlich zu RT1711, Hinweis 2 |
| HUSB311 | Nein | Ja | Ja | Vorrangig empfohlen; FUSB302-hardwarekompatibel, Treiber nicht kompatibel, Hinweis 3 |
| RT1711H | Nein | Ja | Ja | FUSB302-hardwarekompatibel; Treiber sehr ähnlich zu ET7303, Hinweis 4 |
| ANX7411 | Nein | Nein | In Erprobung | RK3588-Anpassung läuft |
| WUSB3801 | Nicht im SDK unterstützt; in einzelnen Projekten verwendet | Nein | Nein | Proprietäre Eindrahtkommunikation; hohe Fehlerrate, Stabilität nicht gewährleistet. |

Hinweis 1. Linux-4.4 unterstützt kein TCPM und damit nur FUSB302/ET7301B; beide sind ohne Hardware- oder Softwareänderung austauschbar. Linux-4.19/5.10 unterstützen TCPM und TCPCI und sind theoretisch mit allen TCPCI-Controllern wie ET7303/HUSB311/RT1711H kompatibel.

Hinweis 2. ET7303 im kleinen Gehäuse wurde auf RK-Plattformen validiert; laut damaligem Original bot der Hersteller kein großes Gehäuse an. CONFIG_TYPEC_ET7303 separat aktivieren. Siehe HUSB311-DTS-Abschnitte für Linux-4.19 und Linux-5.10: Beide Chips verwenden 0x4E; nur Knotenname und compatible = "etek,et7303" ändern.

Hinweis 3. CONFIG_TYPEC_HUSB311 separat aktivieren; Einzelheiten stehen in den HUSB311-DTS-Abschnitten für Linux-4.19 und Linux-5.10.

Hinweis 4. RT1711H ist hardwarekompatibel zu FUSB302/ET7303; sein Treiber ähnelt ET7303 stark. CONFIG_TYPEC_RT1711H separat aktivieren. Das DTS entspricht weitgehend HUSB311/ET7303 mit ebenfalls 0x4E; Knotenname und compatible = "richtek,rt1711h" ändern.

## 6. Referenzen

1. „Universal Serial Bus Type-C Cable and Connector Specification“

2. „Rockchip_Developer_Guide_USB_CN“

3. „Rockchip_RK3399_Developer_Guide_USB_CN“

4. kernel/Documentation/devicetree/bindings/usb/generic.txt

5. kernel/Documentation/devicetree/bindings/usb/dwc3.txt

6. kernel/Documentation/devicetree/bindings/usb/rockchip,dwc3.txt

7. kernel/Documentation/devicetree/bindings/usb/usb-ehci.txt

8. kernel/Documentation/devicetree/bindings/usb/usb-ohci.txt

9. kernel/Documentation/devicetree/bindings/phy/phy-rockchip-naneng-combphy.txt

10. kernel/Documentation/devicetree/bindings/phy/phy-rockchip-inno-usb2.txt

{% endraw %}
