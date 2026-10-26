---
title: "RK3588 USB: Hardware, PHY-Versorgung, DTS und Type-C"
description: "RK3588 USB: Hardware, PHY-Versorgung, DTS und Type-C · CN/EN V1.3.0"
excerpt: "RK3588 USB: Hardware, PHY-Versorgung, DTS und Type-C"
translation_key: "169-rockchip-rk3588-usb"
slug: "169-rockchip-rk3588-usb"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "RK3588", "USB", "Type-C", "PHY", "DTS"]
---

{% raw %}

Plattformreferenz: vollständige USB-Herstellerunterlagen für RK3588/RK3588S (CN/EN V1.3.0), Kernelbasis Linux-5.10+. Behandelt werden Controller-/PHY-Schaltungen, Versorgung, Anschlüsse und DTS für produktspezifische Entwicklung. Passende ArmSoM-Boards und SDK/BSPs sind nicht bestätigt; keine Hardwarevalidierung. Schaltplan, SoC/Kernel, Patches, PHY-Versorgung, GPIO, PD-Controller und Verkabelung prüfen. Verbrauchstabellen und Befehle sind Herstellerbeispiele, keine ArmSoM-Messungen. ZH verwendet chinesische, EN/RU/DE englische Originalbilder. Quellunterschiede und eigene Codebeispiele bleiben getrennt nachvollziehbar.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- en PDF p.5; unit 0 -->

## 1. USB-Controller und PHYs des RK3588

<!-- en PDF p.5; unit 1 -->

RK3588 hat fünf unabhängige Controller: zwei USB2.0 HOST, zwei USB3.1 OTG und einen USB3.1 HOST. RK3588S besitzt einen USB3.1-OTG-Controller weniger. Tabelle 1 nennt die Typen, das Datasheet weitere Merkmale. Tabelle 1: USB-Controller des RK3588.

<!-- en PDF p.5; unit 2 -->

| Chip/Controller | USB 2.0 HOST (EHCI&OHCI) | USB 3.1 OTG (DWC3&xHCI) | USB 3.1 Host(xHCI) |
| --- | --- | --- | --- |
| RK3588 | 2 | 2 | 1 |
| RK3588S | 2 | 1 | 1 |

<!-- en PDF p.5; unit 3 -->

RK3588 besitzt sieben unabhängige USB-PHYs: vier USB2.0 PHY, zwei USB3.1/DP Combo PHY und einen USB <!-- en PDF p.5; unit 4 --> 3.1/SATA/PCIe Combo PHY. RK3588S hat einen USB2.0 PHY und einen USB3.1/DP Combo PHY weniger. Tabelle 2: PHY-Unterstützung.

<!-- en PDF p.5; unit 5 -->

| Chip/PHY | USB 2.0 PHY | USB3.1/DP ComboPHY | USB 3.1/SATA/PCIe ComboPHY |
| --- | --- | --- | --- |
| RK3588 | 4 [1 × port] | 2 | 1 |
| RK3588S | 3 [1 × port] | 1 | 1 |

<!-- en PDF p.5; unit 6 -->

Hinweise:

<!-- en PDF p.5; unit 7 -->

1. N bedeutet N unabhängige Controller beziehungsweise PHYs.

<!-- en PDF p.5; unit 8 -->

2. [1 × ports] bedeutet einen Port pro PHY.

<!-- en PDF p.5; unit 9 -->

3. EHCI&OHCI bezeichnet integrierte EHCI-/OHCI-Controller; DWC3&xHCI integrierte DWC3-/xHCI-Controller.

<!-- en PDF p.5; unit 10 -->

4. Physikalische Datenrate: USB3.1 Gen1 5Gbps, USB2.0 480Mbps.

<!-- en PDF p.5; unit 11 -->

5. USB3.1/DP Combo PHY bietet vier Lanes und gleichzeitig USB3.1 plus zwei DP-Lanes.

<!-- en PDF p.5; unit 12 -->

6. USB3.1/SATA/PCIe Combo PHY unterstützt jeweils nur einen Modus; USB3.1 und SATA/PCIe schließen sich aus. Tabelle 3: Controller-/PHY-Verbindungen.

<!-- en PDF p.6; unit 13 -->

| USB-Schnittstelle (Schaltplan) | USB-Controller | USB PHY |
| --- | --- | --- |
| TYPEC0 | OTG0 (DWC3&xHCI) | USB3.1/DP ComboPHY0 + USB2.0<br>PHY0 |
| TYPEC1 | OTG1 (DWC3&xHCI) | USB3.1/DP ComboPHY1 + USB2.0<br>PHY1 |
| USB20_HOST0 | USB2.0 HOST0<br>(EHCI&OHCI) | USB2.0 PHY2 |
| USB20_HOST1 | USB2.0 HOST1<br>(EHCI&OHCI) | USB2.0 PHY3 |
| USB30_2 | USB3.1 HOST2 (xHCI) | USB3.1/SATA/PCIe ComboPHY2 |

<!-- en PDF p.6; unit 14 -->

Tabelle 4 ordnet USB-Controller des RK3588 den USB-Datenpins am Chip zu.

<!-- en PDF p.6; unit 15 -->

| USB-Controller/Pin | USB-Datenpins RK3588 |
| --- | --- |
| USB 2.0 HOST0 | USB20_HOST0_DP/USB20_HOST0_DM |
| USB 2.0 HOST1 | USB20_HOST1_DP/USB20_HOST1_DM |
| USB 3.1 OTG0 | TYPEC0_USB20_OTG_DP/TYPEC0_USB20_OTG_DM,<br>TYPEC0_SSRX1P/TYPEC0_SSRX1N, TYPEC0_SSTX1P/TYPEC0_SSTX1N,<br>TYPEC0_SSRX2P/TYPEC0_SSRX2N, TYPEC0_SSTX2P/TYPEC0_SSTX2N |
| USB 3.1 OTG1 | TYPEC1_USB20_OTG_DP/TYPEC1_USB20_OTG_DM,<br>TYPEC1_SSRX1P/TYPEC1_SSRX1N, TYPEC1_SSTX1P/TYPEC1_SSTX1N<br>TYPEC1_SSRX2P/TYPEC1_SSRX2N, TYPEC1_SSTX2P/TYPEC1_SSTX2N |
| USB 3.1 HOST2 | USB30_2_SSTXP/USB30_2_SSTXN<br>USB30_2_SSRXP/USB30_2_SSRXN |

<!-- en PDF p.6; unit 16 -->

Abbildung 1 zeigt interne Verbindungen von Controllern und PHYs sowie zugehörige übliche physische USB-Schnittstellen.

<!-- en PDF p.7; unit 17 -->

![Technische Abbildung aus englischem Original · PDF p.7](/docs/rockchip-rk3588-usb/assets/en-p007-figure-01.png)

<!-- en PDF p.7; unit 18 -->

Abbildung 1: Controller und PHYs des RK3588. Daraus folgt:

<!-- en PDF p.7; unit 19 -->

1. Maximal zwei vollständige Type-C, zwei Type-A USB2.0 und ein Type-A USB3.1-only ohne USB2.0-Abwärtskompatibilität.

<!-- en PDF p.7; unit 20 -->

2. USB3.1 OTG und DP teilen den USB3.1/DP Combo PHY für vollständiges Type-C oder getrennte Anschlüsse, etwa Type-A USB3.1 plus DP mit zwei Lanes.

<!-- en PDF p.7; unit 21 -->

3. USB3.1 HOST_2 unterstützt mangels USB2.0 PHY kein USB2.0. Zusammen mit USB2.0 HOST_0 oder USB <!-- en PDF p.7; unit 22 --> 2.0 HOST_1 ergibt sich vollständiges Type-A USB3.1.

<!-- en PDF p.7; unit 23 -->

4. USB3.1/DP Combo PHY unterstützt nur Gen1, nicht rückwärtskompatibel USB <!-- en PDF p.7; unit 24 --> 2.0. Intern wird er deshalb für vollständiges USB3.1 mit USB2.0 PHY kombiniert: Combo PHY0 fest mit USB2 PHY0, Combo PHY1 mit USB2 PHY1.

<!-- en PDF p.7; unit 25 -->

5. USB3.1/SATA/PCIe Combo PHY unterstützt nur Gen1 und ist intern nicht mit USB2 PHY kombiniert. USB3 HOST_2 muss daher extern mit einem USB2 HOST_0/1 kombiniert werden, um vollständiges USB3.1 zu bieten.

<!-- en PDF p.7; unit 26 -->

6. RK3588S fehlt Type-C1: ein USB3.1-OTG-Controller, ein DP-Controller, ein USB3.1/DP Combo PHY und ein USB2.0 PHY.

<!-- en PDF p.8; unit 27 -->

Die unterstützten Schnittstellen sind nicht auf Type-C/A in Abbildung 1 beschränkt; möglich sind alle üblichen Anschlüsse einschließlich Type-C USB <!-- en PDF p.8; unit 28 --> 2.0/3.1, Type-A USB2.0/3.1 und Micro USB2.0/3.1. Siehe Abschnitt Anschlusstypen. Linux-5.10 ist bereits für verschiedene Schaltungen und Anschlüsse angepasst; Entwickler konfigurieren USB DTS passend zur Produktschaltung. Details im DTS-Abschnitt.

<!-- en PDF p.8; unit 29 -->

## 2. Unterstützte USB-Anschlusstypen

<!-- en PDF p.8; unit 30 -->

Abbildung 2 zeigt übliche unterstützte Anschlüsse. Die Hardware kann an die Anwendung angepasst werden, sofern Linux USB DTS entsprechend adaptiert wird.

<!-- en PDF p.8; unit 31 -->

![Technische Abbildung aus englischem Original · PDF p.8](/docs/rockchip-rk3588-usb/assets/en-p008-figure-01.png)

<!-- en PDF p.8; unit 32 -->

Abbildung 2: USB-Anschlusstypen.

<!-- en PDF p.8; unit 33 -->

### 2.1 Type-C

<!-- en PDF p.8; unit 34 -->

#### 2.1.1 Vollständiges Type-C USB 3.1/DP

<!-- en PDF p.8; unit 35 -->

Type-C0/1 unterstützen vollständiges Type-C[1], Abbildung 3; Schaltungsdetails folgen. Merkmale: Type-C PD mit externem Controller, USB3.1 Gen1 5Gbps und DP Alternate Mode.

<!-- en PDF p.9; unit 36 -->

![Technische Abbildung aus englischem Original · PDF p.9](/docs/rockchip-rk3588-usb/assets/en-p009-figure-01.png)

<!-- en PDF p.9; unit 37 -->

Abbildung 3: Type-C USB3.1/DP.

<!-- en PDF p.9; unit 38 -->

![Technische Abbildung aus englischem Original · PDF p.9](/docs/rockchip-rk3588-usb/assets/en-p009-figure-02.png)

<!-- en PDF p.9; unit 39 -->

Abbildung 4: Type-C-Pinbelegung. Tabelle 5: Type-C-Beschreibung.

<!-- en PDF p.10; unit 40 -->

| Pin | Name | Beschreibung | Pin | Name | Beschreibung |
| --- | --- | --- | --- | --- | --- |
| A1 | GND | Masse | B12 | GND | Masse |
| A2 | SSTXp1 | SuperSpeed: Differenzsignal TX1+ | B11 | SSRXp1 | SuperSpeed: Differenzsignal RX1+ |
| A3 | SSTXn1 | SuperSpeed: Differenzsignal TX1- | B10 | SSRXn1 | SuperSpeed: Differenzsignal RX1- |
| A4 | VBUS | USB-Busversorgung | B9 | VBUS | USB-Busversorgung |
| A5 | CC1 | Konfigurationskanal | B8 | SBU2 | Nebenbandsignale (SBU) |
| A6 | Dp1 | USB 2.0: Differenzsignal D1+ | B7 | Dn2 | USB 2.0: Differenzsignal D2- |
| A7 | Dn1 | USB 2.0: Differenzsignal D1- | B6 | Dp2 | USB 2.0: Differenzsignal D2+ |
| A8 | SBU1 | Nebenbandsignale (SBU) | B5 | CC2 | Konfigurationskanal |
| A9 | VBUS | USB-Busversorgung | B4 | VBUS | USB-Busversorgung |
| A10 | SSRXn2 | SuperSpeed: Differenzsignal RX2- | B3 | SSTXn2 | SuperSpeed: Differenzsignal TX2- |
| A11 | SSRXp2 | SuperSpeed: Differenzsignal RX2+ | B2 | SSTXp2 | SuperSpeed: Differenzsignal TX2+ |
| A12 | GND | Masse | B1 | GND | Masse |

<!-- en PDF p.10; unit 41 -->

Tabelle 6: Verbindung von RK3588 Type-C0 mit dem Type-C-Anschluss.

<!-- en PDF p.11; unit 42 -->

| RK3588-Type-C0-Pin | Type-C-Anschlusspin | Verbindungsbeschreibung |
| --- | --- | --- |
| TYPEC0_SSRX1P/DP0_TX0P<br>TYPEC0_SSRX1N/DP0_TX0N | B10/B11 | An RK3588 USBDP PHY lane0; USB3.1 Rx oder DP Tx |
| TYPEC0_SSTX1P/DP0_TX1P<br>TYPEC0_SSTX1N/DP0_TX1N | A2/A3 | An RK3588 USBDP PHY lane1; USB3.1 Tx oder DP Tx |
| TYPEC0_SSRX2P/DP0_TX2P<br>TYPEC0_SSRX2N/DP0_TX2N | A10/A11 | An RK3588 USBDP PHY lane2; USB3.1 Rx oder DP Tx |
| TYPEC0_SSTX2P/DP0_TX3P<br>TYPEC0_SSTX2N/DP0_TX3N | B2/B3 | An RK3588 USBDP PHY lane3; USB3.1 Tx oder DP Tx |
| TYPEC0_OTG_DP/DM | A6/A7,<br>B6/B7 | An RK3588 TYPEC0_OTG_DP/DM; A6/B6 parallel, A7/B7 parallel |
| TYPEC0_SBU1/TYPEC0_SBU2 | A8/B8 | An USBDP PHY AUX, nur DP Alternate Mode |
| TYPEC0_SBU1_DC/TYPEC0_SBU2_DC | A8/B8 | An RK3588-GPIO zur softwaregesteuerten Pull-up-Steuerung bei DP AUX; keine Vorgabe zu Standard-Pull-up/-down |
| TYPEC0_CC1/TYPEC0_CC2 | A5/B5 | An externen Type-C-Controller HUSB311/FUSB302, nicht R3588 SoC (Quellschreibweise) |

<!-- en PDF p.11; unit 43 -->

#### 2.1.2 Type-C zu Type-A USB 3.1/DP

<!-- en PDF p.11; unit 44 -->

Type-C0/1 lassen sich in unabhängiges Type-A USB3.1 und DP aufteilen; siehe Hardwareabschnitt. EVB2-Beispiel: Type-C0 verwendet PHY0 lane0/1 für USB3.1 und lane2/3 für DP1.4; Type-C1 verwendet PHY1 lane0/1 für USB3.1 und lane2/3 für DP zu VGA. Theoretisch sind lane2/3 für USB3.1 und lane0/1 für DP möglich; dafür rockchip,dp-lane-mux im usbdp_phy-Knoten anpassen.

<!-- en PDF p.12; unit 45 -->

#### 2.1.3 Type-C zu Type-A USB 2.0/DP

<!-- en PDF p.12; unit 46 -->

Type-C0/1 können in Type-A USB2.0 und DP mit vier Lanes geteilt werden. RK3588-NVR-DEMO-Beispiel: Type-C1 bietet USB2.0 ohne USBDP PHY und DP 4 x lane zu HDMI2.0 über PHY1 lane0/1/2/3. Details im Hardwareabschnitt.

<!-- en PDF p.12; unit 47 -->

#### 2.1.4 Type-C USB 2.0 Only

<!-- en PDF p.12; unit 48 -->

Type-C0/1 können auf USB2.0 Only vereinfacht werden, Abbildung 5: PD mit externem Controller; USB2.0 480Mbps; kein DP Alternate Mode. Die Hardware wird einfacher, die Maximalrate sinkt. Linux USB DTS muss erheblich geändert werden; siehe USB2-only-DTS.

<!-- en PDF p.12; unit 49 -->

![Technische Abbildung aus englischem Original · PDF p.12](/docs/rockchip-rk3588-usb/assets/en-p012-figure-01.png)

<!-- en PDF p.12; unit 50 -->

Abbildung 5: Type-C USB2.0 Only.

<!-- en PDF p.13; unit 51 -->

### 2.2 Type-A

<!-- en PDF p.13; unit 52 -->

#### 2.2.1 Type-A USB 3.1

<!-- en PDF p.13; unit 53 -->

Maximal drei Type-A USB3.1: umgewandeltes Type-C0, umgewandeltes Type-C1 und USB3_HOST2 plus USB2.0 HOST0/1. Details im Hardwareabschnitt.

<!-- en PDF p.13; unit 54 -->

![Technische Abbildung aus englischem Original · PDF p.13](/docs/rockchip-rk3588-usb/assets/en-p013-figure-01.png)

<!-- en PDF p.13; unit 55 -->

Abbildung 6: Type-A USB3.1.

<!-- en PDF p.13; unit 56 -->

#### 2.2.2 Type-A USB 2.0

<!-- en PDF p.13; unit 57 -->

Maximal vier Type-A USB2.0: umgewandeltes Type-C0, umgewandeltes Type-C1, USB2.0 HOST0 und HOST1. Details im Hardwareabschnitt.

<!-- en PDF p.14; unit 58 -->

![Technische Abbildung aus englischem Original · PDF p.14](/docs/rockchip-rk3588-usb/assets/en-p014-figure-01.png)

<!-- en PDF p.14; unit 59 -->

Abbildung 7: Type-A USB2.0.

<!-- en PDF p.14; unit 60 -->

### 2.3 Micro

<!-- en PDF p.14; unit 61 -->

#### 2.3.1 Micro USB 3.1

<!-- en PDF p.14; unit 62 -->

Type-C0/1 erlauben Micro USB3.1; wegen größerer PCB-Fläche ist dieser Anschluss heute selten. Gegenüber Type-A kommt OTG ID hinzu, das per Hardwarepegel Device/HOST automatisch umschaltet. Mit USB20_OTG_ID des RK3588 verbinden. Intern liegt bereits Pull-up auf 1.8V an; kein externer Pull-up erforderlich.

<!-- en PDF p.14; unit 63 -->

![Technische Abbildung aus englischem Original · PDF p.14](/docs/rockchip-rk3588-usb/assets/en-p014-figure-02.png)

<!-- en PDF p.14; unit 64 -->

Abbildung 8: Micro USB3.1.

<!-- en PDF p.14; unit 65 -->

#### 2.3.2 Micro USB 2.0

<!-- en PDF p.14; unit 66 -->

Type-C0 erlaubt Micro USB2.0, vereinfacht die Schaltung, senkt aber die Maximalgeschwindigkeit.

<!-- en PDF p.15; unit 67 -->

Gegenüber Type-A USB2.0 kommt OTG ID für automatische Hardware-Erkennung und Device/HOST-Umschaltung hinzu. An USB20_OTG_ID anschließen. Interner 1.8V-Pull-up ist vorhanden; kein externer nötig.

<!-- en PDF p.15; unit 68 -->

![Technische Abbildung aus englischem Original · PDF p.15](/docs/rockchip-rk3588-usb/assets/en-p015-figure-01.png)

<!-- en PDF p.15; unit 69 -->

Abbildung 9: Micro USB2.0.

<!-- en PDF p.15; unit 70 -->

## 3. RK3588 USB Config Map

<!-- en PDF p.15; unit 71 -->

Fünf Controller und sieben PHYs ermöglichen Abbildung 10. Die Quelle nennt „4 Konfigurationen“, führt aber Config0–4 auf:

- Config0: Type-C0 mit DP.
- Config1: USB2.0 OTG + DP 4 x Lane, Swap off.
- Config2: USB2.0 OTG + DP 4 x Lane, Swap on.
- Config3: USB3.1 OTG + DP 2 x Lane, Swap on.
- Config4: USB3.1 OTG + DP 2 x Lane, Swap off.

HOST0/1 und USB3_HOST2: Config0 — HOST0 + HOST1 ohne HOST2; Config1 — HOST0 + HOST1/HOST2 kombiniert; Config2 — HOST0/HOST2 kombiniert + HOST1.

<!-- en PDF p.16; unit 72 -->

![Technische Abbildung aus englischem Original · PDF p.16](/docs/rockchip-rk3588-usb/assets/en-p016-figure-01.png)

<!-- en PDF p.16; unit 73 -->

Abbildung 10: RK3588 USB Config Map. Details stehen in USB Controller Configure Table des SDK-EVB-Referenzschaltplans. DP und die vier USBDP-Lanes lassen sich beliebig zuordnen, Abbildung 11, durch DTS-Anpassung. Bei unklarer Softwareanpassung die üblichen Schaltungen aus Abbildung 10 verwenden.

<!-- en PDF p.16; unit 74 -->

![Technische Abbildung aus englischem Original · PDF p.16](/docs/rockchip-rk3588-usb/assets/en-p016-figure-02.png)

<!-- en PDF p.16; unit 75 -->

Abbildung 11: DP-Lane-Zuordnung.

<!-- en PDF p.16; unit 76 -->

## 4. USB-Hardwareschaltungen

<!-- en PDF p.16; unit 77 -->

Der Abschnitt beschreibt praktische Schaltungsvarianten. Anschlüsse in Abbildung 12: USB20 HOST0, <!-- en PDF p.17; unit 78 --> USB20 HOST1, USB30/DP1.4 MULTI0, USB30/DP1.4 MULTI1 und USB30/PCIE2.0/SATA30 MULTI2. RK3588S fehlt USB30/DP1.4 MULTI1.

<!-- en PDF p.17; unit 79 -->

![Technische Abbildung aus englischem Original · PDF p.17](/docs/rockchip-rk3588-usb/assets/en-p017-figure-01.png)

<!-- en PDF p.17; unit 80 -->

Abbildung 12: USB-Schnittstellenblockdiagramm.

<!-- en PDF p.17; unit 81 -->

### 4.1 Controller-Versorgung und Verbrauch

<!-- en PDF p.17; unit 82 -->



<!-- en PDF p.17; unit 83 -->

USB-Controller werden von VDD_LOGIC versorgt. Die zugehörigen internen Power-Domains stehen in Tabelle 7: Zuordnung USB-Controller/PD.

<!-- en PDF p.18; unit 84 -->

| USB-Controller | Power-Domain |
| --- | --- |
| USB 2.0 HOST0/1 | PD_USB |
| USB 3.1 OTG0/1 | PD_USB |
| USB 3.1 HOST2 | PD_PHP |

<!-- en PDF p.18; unit 85 -->

Im Betrieb schaltet der Linux-Treiber PDs abhängig vom Anschlusszustand dynamisch per PM Runtime. Im Standby zweiter Stufe schaltet die Software alle USB-PDs ab. Müssen Register ihren Betriebszustand behalten, muss device_init_wakeup im Treiber dies verhindern. Strategie:

<!-- en PDF p.18; unit 86 -->

1. Ungenutzte Controller auf DTS disabled setzen.

<!-- en PDF p.18; unit 87 -->

2. Aktivierte Controller unterstützen Auto suspend bereits: Ohne HOST-Peripherie folgt automatisch stromsparender Suspend; separates Debugging ist nicht erforderlich. USB2.0 HOST0/1 im Kernel deaktivieren:

<!-- en PDF p.18; unit 88 -->

```text
# Disable USB 2.0 HOST0
&usb_host0_ehci {
        status = "disabled";
};

&usb_host0_ohci {
        status = "disabled";
};

# Disable USB 2.0 HOST1
&usb_host1_ehci {
        status = "disabled";
};

&usb_host1_ohci {
        status = "disabled";
};
```

<!-- en PDF p.19; unit 89 -->

### 4.2 PHY-Versorgung und Verbrauch

<!-- en PDF p.19; unit 90 -->

#### 4.2.1 USB 2.0 PHY

<!-- en PDF p.19; unit 91 -->

RK3588 hat vier unabhängige USB2.0 PHYs; RK3588S fehlt PHY1. Alle liegen in PD_BUS (Alive) und teilen drei externe Versorgungen, Abbildung 13. Im Betrieb kann Verbrauch deshalb nicht einfach durch Abschalten von Versorgung oder PD gesenkt werden.

<!-- en PDF p.19; unit 92 -->

![Technische Abbildung aus englischem Original · PDF p.19](/docs/rockchip-rk3588-usb/assets/en-p019-figure-01.png)

<!-- en PDF p.19; unit 93 -->

Abbildung 13: USB2.0-PHY-Versorgung. Spannungen außerhalb Min./Max. können USB-Verbindungen stören. Tabelle 8: Spannungsanforderungen.

<!-- en PDF p.19; unit 94 -->

| Versorgung | Minimum | Normal | Maximum | Einheit |
| --- | --- | --- | --- | --- |
| USB20_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB20_AVDD_1V8 | 1.674 | 1.8 | 1.98 | V |
| USB20_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |

<!-- en PDF p.19; unit 95 -->

Verbrauchsstrategie für USB2.0 PHY:

<!-- en PDF p.19; unit 96 -->

1. Maskrom USB braucht normale USB2.0-PHY-Versorgung.

<!-- en PDF p.19; unit 97 -->

2. Nach Einschalten sind alle PHYs in Normal. U-Boot SPL setzt PHY1/PHY2/PHY3 in IDDQ; SDK-Unterstützung besteht. Im System holt der Treiber den benötigten PHY anwendungsabhängig aus IDDQ.

<!-- en PDF p.19; unit 98 -->

3. Ungenutzte USB2.0 PHYs auf DTS disabled setzen; die Quelle verweist auf Tabelle 9.

<!-- en PDF p.19; unit 99 -->

4. Der Treiber aktivierter PHYs regelt dynamisch. Bei erkanntem Gerät setzt er <!-- en PDF p.20; unit 100 --> Normal, ohne Gerät Suspend. Tabelle 9: Verbrauch eines einzelnen USB2.0 PHY.

<!-- en PDF p.20; unit 101 -->

| Versorgung | Lesen/Schreiben | Dynamischer Suspend | PHY deaktiviert | Standby zweiter Stufe | Einheit |
| --- | --- | --- | --- | --- | --- |
| USB20_DVDD_0V75 | 7.1 | 2.6 | 0.05 | 0 | mA |
| USB20_AVDD_1V8 | 17.8 | 3.1 | 0.05 | 0 | mA |
| USB20_AVDD_3V3 | 3.3 | 0.05 | 0.05 | 0 | mA |

<!-- en PDF p.20; unit 102 -->

Herstellerszenarien: Lesen/Schreiben — U2-Datenträger, Normal; dynamischer Suspend — DTS an, keine Peripherie, Suspend; PHY disabled — DTS disabled, IDDQ; Standby zweiter Stufe — alle drei USB <!-- en PDF p.20; unit 103 --> 2.0-PHY-Versorgungen aus. Tabelle 10: USB2.0-PHY-/Controller-Verbindungen.

<!-- en PDF p.20; unit 104 -->

| USB 2.0 PHY | USB-Controller |
| --- | --- |
| USB 2.0 PHY0 | USB 3.1 OTG0 |
| USB 2.0 PHY1 | USB 3.1 OTG1 |
| USB 2.0 PHY2 | USB 2.0 HOST0 |
| USB 2.0 PHY3 | USB 2.0 HOST1 |

<!-- en PDF p.20; unit 105 -->

USB2.0 PHY2/3 im Kernel deaktivieren:

<!-- en PDF p.20; unit 106 -->

```text
&u2phy2 {
        status = "disabled";
};

&u2phy3 {
        status = "disabled";
};

&u2phy2_host {
        status = "disabled";
};

&u2phy3_host {
        status = "disabled";
};
```

<!-- en PDF p.21; unit 108 -->

#### 4.2.2 USB-3.1-PHY-Versorgung und Verbrauch

<!-- en PDF p.21; unit 109 -->

RK3588 unterstützt zwei USB3.1-Combo-PHY-Arten:

<!-- en PDF p.21; unit 110 -->

1. USB3.1/DP Combo PHY.

<!-- en PDF p.21; unit 111 -->

2. USB3.1/SATA/PCIe Combo PHY. Tabelle 11: Combo-PHY-/Controller-Verbindungen.

<!-- en PDF p.21; unit 112 -->

| USB 3.1 Combo PHY | USB-Controller |
| --- | --- |
| USB 3.1/DP Combo PHY0 | USB 3.1 OTG0 |
| USB 3.1/DP Combo PHY1 | USB 3.1 OTG1 |
| USB 3.1/SATA/PCIe Combo PHY2 | USB 3.1 HOST2 |

<!-- en PDF p.21; unit 113 -->

Die Versorgungs- und Verbrauchssteuerung unterscheidet sich und wird getrennt beschrieben.

<!-- en PDF p.21; unit 114 -->

##### 4.2.2.1 USB 3.1/DP Combo PHY

<!-- en PDF p.21; unit 115 -->

RK3588 hat zwei unabhängige USB3.1/DP Combo PHYs; RK3588S fehlt PHY1. Beide liegen in PD_BUS (Alive); jeder hat eigene externe Versorgungspins, Abbildung 14.

<!-- en PDF p.22; unit 116 -->

![Technische Abbildung aus englischem Original · PDF p.22](/docs/rockchip-rk3588-usb/assets/en-p022-figure-01.png)

<!-- en PDF p.22; unit 117 -->

Abbildung 14: USB3.1/DP-Combo-PHY-Versorgung. Tabelle 12: Spannungsanforderungen.

<!-- en PDF p.22; unit 118 -->

| Versorgung | Minimum | Nennwert | Maximum | Einheit |
| --- | --- | --- | --- | --- |
| VDD_0V85/VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |

<!-- en PDF p.22; unit 119 -->

Verbrauchsstrategie für USB3.1/DP Combo PHY:

<!-- en PDF p.22; unit 120 -->

1. Maskrom USB benötigt normale Versorgung des Type-C0 USBDP PHY0.

<!-- en PDF p.22; unit 121 -->

2. Bei ungenutztem Type-C1 darf USBDP PHY1 unversorgt bleiben.

<!-- en PDF p.22; unit 122 -->

3. Nach Einschalten verbraucht der uninitialisierte PHY am wenigsten.

<!-- en PDF p.22; unit 123 -->

4. Ungenutzten PHY auf DTS disabled setzen: uninitialisiert, minimaler Verbrauch.

<!-- en PDF p.22; unit 124 -->

5. Der Treiber wählt automatisch P0 bei Gerät, sonst P3 bei Type-A oder Reset bei Type-C. Tabelle 13: Verbrauch des Combo PHY.

<!-- en PDF p.23; unit 125 -->

Die Angaben gelten für einen einzelnen USB3.1/DP Combo PHY.

<!-- en PDF p.23; unit 126 -->

| Versorgung | Lesen/Schreiben | Dynamischer Schlaf[1] | Dynamischer Schlaf[2] | PHY deaktiviert | Tiefer Standby | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| VDD_0V85/VDDA_0V85 | 115.7 | 6.8 | 7.9 | 2 | 0 | mA |
| VDDH_1V8 | 29.4 | 0 | 2 | 0 | 0 | mA |

<!-- en PDF p.23; unit 127 -->

Herstellerszenarien: Lesen/Schreiben — U3-Datenträger, P0; dynamischer Schlaf [1] — Type-C ohne Peripherie, Reset; Schlaf [2] — Type-A ohne Peripherie, P3; disabled — uninitialisiert, minimaler Verbrauch; tiefer Standby — beide Versorgungen aus. USBDP PHY1 im Kernel deaktivieren:

<!-- en PDF p.23; unit 128 -->

```text
&usbdp_phy1 {
        status = "disabled";
};

&usbdp_phy1_dp {
        status = "disabled";
};

&usbdp_phy1_u3 {
        status = "disabled";
};
```

<!-- en PDF p.23; unit 129 -->

##### 4.2.2.2 USB 3.1/SATA/PCIe Combo PHY

<!-- en PDF p.23; unit 130 -->

RK3588 unterstützt einen USB3.1/SATA/PCIe Combo PHY in PD_BUS (Alive) mit eigenständiger externer Versorgung, Abbildung 15.

<!-- en PDF p.24; unit 131 -->

![Technische Abbildung aus englischem Original · PDF p.24](/docs/rockchip-rk3588-usb/assets/en-p024-figure-01.png)

<!-- en PDF p.24; unit 132 -->

Abbildung 15: Combo-PHY-Versorgung. Tabelle 14: Spannungsanforderungen.

<!-- en PDF p.24; unit 133 -->

| Versorgung | Minimum | Normal | Maximum | Einheit |
| --- | --- | --- | --- | --- |
| AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |

<!-- en PDF p.24; unit 134 -->

Verbrauchsstrategie des USB3.1/SATA/PCIe Combo PHY:

<!-- en PDF p.24; unit 135 -->

1. Beim Einschalten arbeitet der PHY standardmäßig. U-Boot SPL setzt ihn für minimalen Verbrauch in Reset. Im Kernel gibt der USB-Treiber den Reset durch rockchip_combphy_init() frei.

<!-- en PDF p.24; unit 136 -->

2. Im USB-Modus steuert die Controller-Hardware PIPE P0/P1/P2/P3 abhängig vom Szenario. Ohne Gerät ist PIPE in P3; mit U3-Datenträger in P0. Bei angeschlossenem U3-HUB ohne nachgelagerte Peripherie geht PIPE automatisch in P3 zur Einsparung; mit Peripherie am HUB wieder in P0. P0 ist Normalbetrieb, P3 minimaler Verbrauch.

<!-- en PDF p.24; unit 137 -->

3. Ist USB3.1 HOST2 ungenutzt, darf der entsprechende Combo PHY unversorgt bleiben.

<!-- en PDF p.24; unit 138 -->

4. Bei versorgtem, ungenutztem PHY DTS disabled setzen: Reset, minimaler Verbrauch. Tabelle 15: Verbrauchsdaten.

<!-- en PDF p.24; unit 139 -->

| Versorgung | Lesen/Schreiben | Dynamischer Schlaf | PHY deaktiviert | Standby zweiter Stufe | Einheit |
| --- | --- | --- | --- | --- | --- |
| AVDD_0V85 | 43.4 | 43.3 | 0.4 | 0 | mA |
| AVDD_1V8 | 4.3 | 4.1 | 0.2 | 0 | mA |

<!-- en PDF p.25; unit 140 -->

Herstellerszenarien: Lesen/Schreiben — U3-Datenträger, P0; dynamischer Schlaf — DTS an, keine Peripherie, P3; disabled — DTS disabled, Reset; Standby zweiter Stufe — beide Versorgungen aus. Combo PHY im Kernel deaktivieren:

<!-- en PDF p.25; unit 141 -->

```text
&combphy2_psu {
        status = "disabled";
};
```

<!-- en PDF p.25; unit 142 -->

### 4.3 USB-Hardwareschaltungen

<!-- en PDF p.25; unit 143 -->

#### 4.3.1 TYPEC0_USB20_VBUSDET

<!-- en PDF p.25; unit 144 -->

TYPEC0_USB20_VBUSDET erkennt Device-An-/Abstecken. Bei Type-C0 mit PD und externem FUSB302/HUSB311 EVB1 verwenden: VBUSDET fest an VCC_3V3_S0, Hotplug-Erkennung über CC. Ohne externen Controller (Type-C0 USB2-only, Type-A USB3.1, Micro USB2.0/3.1) den üblichen Spannungsteiler zu Anschluss-VBUS verwenden, keine Dauerstromversorgung. HOST braucht separate GPIO-/PMIC-VBUS-Steuerung, nicht gemeinsam mit anderen HOST. Geforderter High-Pegel: [0.9V ~ 3.3V].

<!-- en PDF p.25; unit 145 -->

#### 4.3.2 Maskrom USB

<!-- en PDF p.25; unit 146 -->

RK3588 Maskrom verwendet immer Type-C0 USB2.0 zum Firmwareladen, Abbildung 16. Anforderungen: TYPEC0_USB20_VBUSDET extern hochziehen, nicht offen lassen. TypeC0-USBDP-PHY-Versorgung TYPEC0_DP0_VDD_0V85/TYPEC0_DP0_VDDA_0V85/TYPEC0_DP0_VDDH_1V8 und externer Referenz- <!-- en PDF p.26; unit 147 --> widerstand TYPEC0_DP0_REXT müssen korrekt verbunden sein. Nach Systemstart behandelt die Software den PHY stromsparend.

<!-- en PDF p.26; unit 148 -->

![Technische Abbildung aus englischem Original · PDF p.26](/docs/rockchip-rk3588-usb/assets/en-p026-figure-01.png)

<!-- en PDF p.26; unit 149 -->

Abbildung 16: Maskrom-USB2-Firmwareport.

<!-- en PDF p.26; unit 150 -->

#### 4.3.3 Vollständiges Type-C USB3.1/DP

<!-- en PDF p.26; unit 151 -->

Gilt für Type-C0 und Type-C1; Beispiel RK3588 EVB1 Type-C0.

<!-- en PDF p.26; unit 152 -->

1. Pinverbindungen siehe Tabelle 5 im Abschnitt vollständiges Type-C; Quellnummer unverändert.

<!-- en PDF p.26; unit 153 -->

2. Externer Controller für Orientierungserkennung und Hochvolt-/Hochstrom-PD erforderlich. Die meisten gängigen Chips sind unterstützt; siehe Liste.

<!-- en PDF p.26; unit 154 -->

3. Für Hochvolt-Laden und geringeres Hardware-Risiko VBUSDET nicht mit Type-C-VBUS verbinden, sondern fest auf <!-- en PDF p.26; unit 155 --> 3.3V ziehen, VCC_3V3_S0 in Abbildung 17. Nicht offen lassen.

<!-- en PDF p.26; unit 156 -->

4. TYPEC0_USB20_OTG_ID gilt nur für Micro-OTG; bei Type-C offen lassen.

<!-- en PDF p.26; unit 157 -->

5. TYPEC0_SBU1/TYPEC0_SBU2 dienen nur AUX im DP Alternate Mode. Laut <!-- en PDF p.27; unit 158 --> AUX-Protokoll müssen die Pull-up-Pegel zur Steckerorientierung passen. RK3588 automatisiert das nicht, daher zwei externe GPIOs TYPEC0_SBU1_DC/TYPEC0_SBU2_DC in Abbildung 19. Beliebige GPIOs, keine Vorgabe für Standard-Pull-ups/-downs. Softwareseitig sbu1-dc-gpios und sbu2-dc-gpios im usbdp_phy anpassen.

<!-- en PDF p.27; unit 159 -->

6. DTS siehe vollständiges Type-C USB3.1/DP.

<!-- en PDF p.27; unit 160 -->

![Technische Abbildung aus englischem Original · PDF p.27](/docs/rockchip-rk3588-usb/assets/en-p027-figure-01.png)

<!-- en PDF p.27; unit 161 -->

Abbildung 17: Type-C0-Schaltung.

<!-- en PDF p.27; unit 162 -->

![Technische Abbildung aus englischem Original · PDF p.27](/docs/rockchip-rk3588-usb/assets/en-p027-figure-02.png)

<!-- en PDF p.27; unit 163 -->

Abbildung 18: Type-C0-PD-Controller und VBUS-Steuerung.

<!-- en PDF p.28; unit 164 -->

![Technische Abbildung aus englischem Original · PDF p.28](/docs/rockchip-rk3588-usb/assets/en-p028-figure-01.png)

<!-- en PDF p.28; unit 165 -->

Abbildung 19: Type-C0-Anschluss.

<!-- en PDF p.28; unit 166 -->

#### 4.3.4 Type-C zu Type-A USB3.1/DP

<!-- en PDF p.28; unit 167 -->

Type-C0/1 werden in Type-A USB3.1 und DP mit zwei Lanes getrennt. Beispiel EVB2 Type-C0.

<!-- en PDF p.28; unit 168 -->

1. USB3.1 nutzt TYPEC0_SSRX1P/N und TYPEC0_SSTX1P/N (lane0/1); DP nutzt DP0_TX2P/N und DP0_TX3P/N (lane2/3 des USBDP PHY).

<!-- en PDF p.28; unit 169 -->

2. Bei Device/HOST TYPEC0_OTG_VBUSDET vorzugsweise über 30KΩ mit Type-A-VBUS verbinden.

<!-- en PDF p.28; unit 170 -->

3. GPIO steuert VCC5V0_USB30_HOST2: im Device aus, im HOST an. SY6280AAC-Strom wird durch OCB-Widerstand bestimmt: Ilim(A) = 6800/Rset(ohm). Abbildung 21 begrenzt auf 1A.

<!-- en PDF p.28; unit 171 -->

4. Siehe zugehöriges DTS. Theoretisch USB3.1 auf lane2/3, DP auf lane0/1; dann rockchip,dp-lane-mux im usbdp_phy anpassen.

<!-- en PDF p.29; unit 172 -->

![Technische Abbildung aus englischem Original · PDF p.29](/docs/rockchip-rk3588-usb/assets/en-p029-figure-01.png)

<!-- en PDF p.29; unit 173 -->

Abbildung 20: Type-A USB3.1/DP.

<!-- en PDF p.29; unit 174 -->

![Technische Abbildung aus englischem Original · PDF p.29](/docs/rockchip-rk3588-usb/assets/en-p029-figure-02.png)

<!-- en PDF p.29; unit 175 -->

Abbildung 21: Type-A-USB3.1/DP-Anschluss.

<!-- en PDF p.30; unit 176 -->

#### 4.3.5 Type-C zu Type-A USB2.0/DP

<!-- en PDF p.30; unit 177 -->

Type-C0/1 lassen sich in USB2.0 und DP mit vier Lanes teilen. Beispiel Type-C1 des RK3588 NVR Demo Board.

<!-- en PDF p.30; unit 178 -->

1. Alle vier TYPEC1-USBDP-Lanes dienen DP; USB nutzt den PHY nicht.

<!-- en PDF p.30; unit 179 -->

2. Bei HOST-only dürfen TYPEC1_USB20_OTG_ID und TYPEC1_USB20_VBUSDET offen bleiben.

<!-- en PDF p.30; unit 180 -->

3. GPIO schaltet VCC5V0_USB20_HOST im HOST-Modus ein. SY6280AAC-Begrenzung per OCB-Widerstand: Ilim(A) = 6800/Rset(ohm), in Abbildung 23 1.45A.

<!-- en PDF p.30; unit 181 -->

4. DTS siehe Type-C zu Type-A USB2.0/DP.

<!-- en PDF p.30; unit 182 -->

![Technische Abbildung aus englischem Original · PDF p.30](/docs/rockchip-rk3588-usb/assets/en-p030-figure-01.png)

<!-- en PDF p.30; unit 183 -->

Abbildung 22: Type-A USB2.0/DP.

<!-- en PDF p.31; unit 184 -->

![Technische Abbildung aus englischem Original · PDF p.31](/docs/rockchip-rk3588-usb/assets/en-p031-figure-01.png)

<!-- en PDF p.31; unit 185 -->

Abbildung 23: Type-A USB2/DP zu HDMI.

<!-- en PDF p.31; unit 186 -->

#### 4.3.6 Type-A USB3.1

<!-- en PDF p.31; unit 187 -->

Gilt für Type-C0, Type-C1 und USB3.1 HOST2. Die ersten beiden stehen im USB3.1/DP-Abschnitt; hier HOST2. USB3.1 HOST_2 alias USB30_2 hat keinen USB2.0 PHY und muss mit USB2.0 HOST0/1 kombiniert werden, um vollständiges USB3.1 zu ergeben. Beispiel EVB2 USB30_2 HOST.

<!-- en PDF p.31; unit 188 -->

1. HOST2 wird mit USB2.0 HOST1 kombiniert.

<!-- en PDF p.31; unit 189 -->

2. Der Chip erlaubt auch USB2.0 von Type-C0/1. Diese könnten jedoch als Device gebraucht werden; Device und Host eines USB3.1-OTG-Controllers sind nicht gleichzeitig nutzbar[2]. Zur Vereinfachung empfiehlt die Quelle die Kombination nur mit USB <!-- en PDF p.31; unit 190 --> 2.0 HOST0/1.

<!-- en PDF p.31; unit 191 -->

3. DTS siehe Type-A USB3.1.

<!-- en PDF p.32; unit 192 -->

![Technische Abbildung aus englischem Original · PDF p.32](/docs/rockchip-rk3588-usb/assets/en-p032-figure-01.png)

<!-- en PDF p.32; unit 193 -->

Abbildung 24: USB3.1-HOST2-Schaltung.

<!-- en PDF p.32; unit 194 -->

![Technische Abbildung aus englischem Original · PDF p.32](/docs/rockchip-rk3588-usb/assets/en-p032-figure-02.png)

<!-- en PDF p.32; unit 195 -->

Abbildung 25: USB3.1-HOST2-Anschluss.

<!-- en PDF p.32; unit 196 -->

#### 4.3.7 Type-A USB2.0

<!-- en PDF p.32; unit 197 -->

Gilt für USB2.0 HOST0/1; Beispiel EVB1.

<!-- en PDF p.32; unit 198 -->

1. HOST0/1 teilen VCC5V0_USB20_HOST. GPIO steuert SY6280AAC, dessen OCB-Widerstand den Strom bestimmt: Ilim(A)=6800/Rset(ohm). Abbildung 26 begrenzt VBUS auf 1.45A.

<!-- en PDF p.32; unit 199 -->

2. DTS siehe Type-A USB2.0.

<!-- en PDF p.33; unit 200 -->

![Technische Abbildung aus englischem Original · PDF p.33](/docs/rockchip-rk3588-usb/assets/en-p033-figure-01.png)

<!-- en PDF p.33; unit 201 -->

Abbildung 26: Type-A-USB2.0-HOST-Schaltung.

<!-- en PDF p.33; unit 202 -->

## 5. RK3588 USB DTS

<!-- en PDF p.33; unit 203 -->

Enthalten sind chipweite Controller-/PHY-DTSI und Board-DTS. Details in Kernel-Dokumenten:

<!-- en PDF p.33; unit 204 -->

1. `kernel/Documentation/devicetree/bindings/usb/snps,dwc3.yaml`

<!-- en PDF p.33; unit 205 -->

2. `kernel/Documentation/devicetree/bindings/usb/generic-ohci.yaml`

<!-- en PDF p.33; unit 206 -->

3. `kernel/Documentation/devicetree/bindings/usb/generic-ehci.yaml`

<!-- en PDF p.33; unit 207 -->

4. `kernel/Documentation/devicetree/bindings/connector/usb-connector.yaml`

<!-- en PDF p.33; unit 208 -->

5. `kernel/Documentation/devicetree/bindings/phy/phy-rockchip-inno-usb2.yaml`

<!-- en PDF p.33; unit 209 -->

6. `kernel/Documentation/devicetree/bindings/phy/phy-rockchip-usbdp.yaml`

<!-- en PDF p.33; unit 210 -->

7. `kernel/Documentation/devicetree/bindings/phy/phy/phy-rockchip-naneng-combphy.txt` (Quellpfad).

<!-- en PDF p.33; unit 211 -->

### 5.1 Chipweite USB-DTSI

<!-- en PDF p.33; unit 212 -->

Wesentliche Controller-/PHY-Knoten folgen. Sie definieren gemeinsame Ressourcen und Eigenschaften; Änderungen durch Entwickler werden nicht empfohlen.

<!-- en PDF p.34; unit 213 -->

Die Quelle nennt rk3588s-evb.dtsi für OTG0, HOST0/1 und HOST2 sowie rk3588-evb.dts für OTG1, listet danach jedoch `arch/arm64/boot/dts/rockchip/rk3588s.dtsi` und `arch/arm64/boot/dts/rockchip/rk3588.dtsi`; unterschiedliche Namen bleiben nachvollziehbar. In rk3588s-evb.dtsi/rk3588-evb.dtsi sind alle Controller und PHYs status="okay". Übernimmt Board-DTS diese EVB-Dateien, nur ungenutzte Knoten mit disabled überschreiben. Tabelle 16 ordnet Schnittstellen und DTS-Knoten zu.

<!-- en PDF p.34; unit 214 -->

| USB-Schnittstelle (Schaltplan) | USB-Controller-DTS-Knoten | USB-PHY-DTS-Knoten |
| --- | --- | --- |
| TYPEC0 | usbdrd3_0<br>usbdrd_dwc3_0 | u2phy0<br>u2phy0_otg<br>usbdp_phy0<br>usbdp_phy0_u3 |
| TYPEC1 | usbdrd3_1<br>usbdrd_dwc3_1 | u2phy1<br>u2phy1_otg<br>usbdp_phy1<br>usbdp_phy1_u3 |
| USB20_HOST0 | usb_host0_ehci<br>usb_host0_ohci | u2phy2<br>u2phy2_host |
| USB20_HOST1 | usb_host1_ehci<br>usb_host1_ohci | u2phy3<br>u2phy3_host |
| USB30_2 | usbhost3_0<br>usbhost_dwc3_0 | combphy2_psu |

<!-- en PDF p.34; unit 215 -->

USB-Controller-DTSI-Knoten:

<!-- en PDF p.34; unit 216 -->

```text
#USB3.1 OTG0 Controller
usbdrd3_0: usbdrd3_0 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_0: usb@fc000000 {
                compatible = "snps,dwc3";
                ......
        };
};
#USB2.0 HOST0 Controller
usb_host0_ehci: usb@fc800000 {
        compatible = "generic-ehci";
        ......
};

usb_host0_ohci: usb@fc840000 {
        compatible = "generic-ohci";
        ......
};

#USB2.0 HOST1 Controller
usb_host1_ehci: usb@fc880000 {
        compatible = "generic-ehci";
        ......
};

usb_host1_ohci: usb@fc8c0000 {
        compatible = "generic-ohci";
        ......
};

#USB3.1 HOST2 Controller
usbhost3_0: usbhost3_0 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbhost_dwc3_0: usb@fcd00000 {
                compatible = "snps,dwc3";
                ......
        };
};

#USB3.1 OTG1 Controller
usbdrd3_1: usbdrd3_1 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_1: usb@fc400000 {
                compatible = "snps,dwc3";
                ......
        };
};
```

<!-- en PDF p.35; unit 218 -->

PHY-DTSI-Knoten: Controller und PHY paarweise konfigurieren. Verbindungen siehe Abbildung 1 und Tabelle 16; Controller-phys verweist auf den passenden PHY.

<!-- en PDF p.35; unit 219 -->

```text
#USB2.0 PHY0
usb2phy0_grf: syscon@fd5d0000 {
                compatible = "rockchip,rk3588-usb2phy-grf", "syscon",
                             "simple-mfd";
                ......
                u2phy0: usb2-phy@0 {
                        compatible = "rockchip,rk3588-usb2phy";
                        ......
                        u2phy0_otg: otg-port {
                                #phy-cells = <0>;
                                status = "disabled";
                        };
                };
        };

#USB2.0 PHY1
usb2phy1_grf: syscon@fd5d4000 {
    ......
};

#USB2.0 PHY2
usb2phy2_grf: syscon@fd5d8000 {
    ......
};

#USB2.0 PHY3
usb2phy3_grf: syscon@fd5dc000 {
    ......
};

#USB3.1/DP Combo PHY0
usbdp_phy0: phy@fed80000 {
        compatible = "rockchip,rk3588-usbdp-phy";
        ......
        usbdp_phy0_dp: dp-port {
                #phy-cells = <0>;
                status = "disabled";
        };

        usbdp_phy0_u3: u3-port {
                #phy-cells = <0>;
                status = "disabled";
        };
};

#USB3.1/DP Combo PHY1
usbdp_phy1: phy@fed90000 {
    ......
};

#USB3.1/SATA/PCIe PHY2
combphy2_psu: phy@fee20000 {
        compatible = "rockchip,rk3588-naneng-combphy";
        ......
};
```

<!-- en PDF p.37; unit 221 -->

### 5.2 Vollständiges Type-C USB3.1/DP DTS

<!-- en PDF p.37; unit 222 -->

Siehe Type-C0 in `arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi`.

<!-- en PDF p.37; unit 223 -->

```text
#USB2.0 PHY configuration attribute "rockchip,typec-vbus-det", indicating support for
hardware design where Type-C VBUS_DET is always pulled high
&u2phy0_otg {
        rockchip,typec-vbus-det;
};

#USB3.1/DP PHY0, configure properties "sbu1-dc-gpios" and "sbu2-dc-gpios" according to
hardware design
&usbdp_phy0 {
        orientation-switch;
        svid = <0xff01>;
        sbu1-dc-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_HIGH>;
        sbu2-dc-gpios = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;

        port {
                #address-cells = <1>;
                #size-cells = <0>;
                usbdp_phy0_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };

                usbdp_phy0_dp_altmode_mux: endpoint@1 {
                        reg = <1>;
                        remote-endpoint = <&dp_altmode_mux>;
                };
        };
};

#USB3.1 OTG0 Controller
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        usb-role-switch;
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_0_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#VBUS GPIO configuration, controlled by the Type-C controller chip driver
vbus5v0_typec: vbus5v0-typec {
        compatible = "regulator-fixed";
        regulator-name = "vbus5v0_typec";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PD0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&typec5v_pwren>;
};

#Configure external Type-C controller chip FUSB302
#Configure properties "I2C/interrupts/vbus-supply/usb_con" according to actual hardware
design
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
                            ......
                        };
                };
        };
};
```

<!-- en PDF p.39; unit 226 -->

Hinweis: Bei Ersatz von FUSB302 durch HUSB311 reichen folgende DTS-Anpassungen.

<!-- en PDF p.39; unit 227 -->

```text
#Configure external Type-C controller chip HUSB311
&i2c2 {
        usbc0: husb311@4e {
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                ......
        };
};
```

<!-- en PDF p.39; unit 228 -->

### 5.3 Type-C zu Type-A USB3.1/DP DTS

<!-- en PDF p.39; unit 229 -->

Siehe Type-C0 in `arch/arm64/boot/dts/rockchip/rk3588-evb2-lp4.dtsi`.

<!-- en PDF p.39; unit 230 -->

```text
#Configure the "phy-supply" property for USB2.0 PHY0 to control the 5V VBUS output
#Note: Using phy-supply does not allow for dynamic switching of VBUS. If the OTG exclusively
uses a GPIO and does not share it with other HOSTs, and if OTG needs to support both
Device/HOST, it should be configured as "vbus-supply = <&vcc5v0_otg>" to achieve dynamic
VBUS switching.
&u2phy0_otg {
        phy-supply = <&vcc5v0_host>;
};

#Configure the VBUS GPIO, which is controlled by the USB2.0 PHY driver
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PA1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#USB3.1/DP PHY0, only need to configure DP to use lane2/3, the driver will automatically
allocate lane0/1 for USB3.1 Rx/Tx
#If the hardware design uses DP on lane0/1, this should be configured as "rockchip,dp-lane-
mux = <0 1>"
#Note: In actual circuitry, even if DP is not supported, "rockchip,dp-lane-mux" must be
configured, otherwise the USBDP PHY driver cannot automatically allocate lanes to USB3.1
&usbdp_phy0 {
        rockchip,dp-lane-mux = <2 3>;
};

#USB3.1 OTG0 Controller
#Set "dr_mode" to "otg" and configure the "extcon" property to support software switching
between Device/Host modes
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        extcon = <&u2phy0>;
        status = "okay";
};
```

<!-- en PDF p.40; unit 232 -->

### 5.4 Type-C zu Type-A USB2.0/DP DTS

<!-- en PDF p.40; unit 233 -->

Siehe Type-C1 in `arch/arm64/boot/dts/rockchip/rk3588-nvr-demo.dtsi`.

<!-- en PDF p.40; unit 234 -->

```text
#Configure the "phy-supply" property for USB2.0 PHY1 to control the 5V VBUS output
&u2phy1_otg {
        phy-supply = <&vcc5v0_host>;
        status = "okay";
};

#Configure the VBUS GPIO, controlled by the USB2.0 PHY driver
vcc5v0_host: vcc5v0-host-regulator {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_sys>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};
#USB3.1/DP PHY1, configure DP to use lanes 0/1/2/3
#Adjust the "rockchip,dp-lane-mux" property according to the actual hardware design
#Set the "maximum-speed" property to inform the USBDP driver to limit USB to USB2.0 only
&usbdp_phy1 {
        maximum-speed = "high-speed";
        rockchip,dp-lane-mux = < 0 1 2 3 >;
        status = "okay";
};

&usbdp_phy1_dp {
        status = "okay";
};

&usbdp_phy1_u3 {
        status = "okay";
};

#Set the "maximum-speed" property to inform the DWC3 driver to limit USB to USB2.0 only
&usbdrd_dwc3_1 {
        dr_mode = "host";
        maximum-speed = "high-speed";
        status = "okay";
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
};
```

<!-- en PDF p.41; unit 236 -->

### 5.5 Type-C USB2.0 only DTS

<!-- en PDF p.41; unit 237 -->

Variante 1: Externer Type-C-Controller mit PD; Type-C0 USB2.0 OTG in `arch/arm64/boot/dts/rockchip/rk3588s-tablet-rk806-single.dtsi`.

<!-- en PDF p.41; unit 238 -->

```text
#USB2.0 PHY0 registers typec orientation switch, used to interact with the TCPM subsystem,
to obtain USB hot-plug information
&u2phy0 {
        orientation-switch;
        status = "okay";

        port {
                #address-cells = <1>;
                #size-cells = <0>;
                u2phy0_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };
        };
};

#USB2.0 PHY0 OTG configuration
#Configure attribute "rockchip,sel-pipe-phystatus", indicating the selection of GRF control
pipe phystatus, replacing the control of USBDP PHY
#Configure attribute "rockchip,typec-vbus-det", indicating support for Type-C VBUS_DET
hardware design with a constant pull-up
#Configure attribute "rockchip,dis-u2-susphy", indicating the disabling of USB2 PHY driver's
dynamic entry into suspend mode
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,typec-vbus-det;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#Disable all related nodes of USBDP PHY0, keeping USBDP PHY0 in an uninitialized state to
achieve the lowest power consumption
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
};

&dp0 {
        status = "disabled";
};

&usbdrd3_0 {
        status = "okay";
}

#Configure USB3.1 OTG0 Controller
#Configure "phys = <&u2phy0_otg>", i.e., not referencing USBDP PHY
#Configure maximum-speed = "high-speed", notifying the DWC3 driver to restrict USB to USB2.0
only
#Configure "snps,dis_u2_susphy_quirk", disabling the controller's hardware suspend usb2 phy
function, improving USB communication stability
#Configure "snps,usb2-lpm-disable", disabling the controller's Host mode LPM function,
improving USB peripheral compatibility
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        status = "okay";

        maximum-speed = "high-speed";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        usb-role-switch;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_0_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#Configure external Type-C controller chip FUSB302
#Need to configure "I2C/interrupts/vbus-supply/usb_con" properties according to the actual
hardware design
#Need to configure the property remote-endpoint = <&u2phy0_orientation_switch> for
usbc0_orien_sw
&i2c8 {
        status = "okay";
        pinctrl-names = "default";
        pinctrl-0 = <&i2c8m2_xfer>;

        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                interrupt-parent = <&gpio0>;
                interrupts = <RK_PC4 IRQ_TYPE_LEVEL_LOW>;
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
                        ......
                        ports {
                                #address-cells = <1>;
                                #size-cells = <0>;

                                port@0 {
                                        reg = <0>;
                                        usbc0_orien_sw: endpoint {
                                                remote-endpoint =
<&u2phy0_orientation_switch>;
                                        };
                                };
                        };

                };
        };
```

<!-- en PDF p.44; unit 242 -->

Variante 2: Kein externer Controller, nur Device; Type-C0 USB2.0 Device in `arch/arm64/boot/dts/rockchip/rk3588-evb5-lp4.dtsi`.

<!-- en PDF p.44; unit 243 -->

```text
#USB2.0 PHY0 OTG configuration
#Configure attribute "rockchip,sel-pipe-phystatus", indicating the selection of GRF control
pipe phystatus, replacing the control of USBDP PHY
#Configure attribute "rockchip,dis-u2-susphy", indicating the disabling of USB2 PHY driver's
dynamic entry into suspend mode
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#Disable all related nodes of USBDP PHY0, keeping USBDP PHY0 in an uninitialized state to
achieve the lowest power consumption
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
}

#Configure USB3.1 OTG0 Controller
#Configure dr_mode = "peripheral", notifying the DWC3 driver to initialize in Device only
mode
#Configure "phys = <&u2phy0_otg>", i.e., not referencing USBDP PHY
#Configure maximum-speed = "high-speed", notifying the DWC3 driver to restrict USB to USB2.0
only
&usbdrd_dwc3_0 {
        dr_mode = "peripheral";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
};
```

<!-- en PDF p.45; unit 245 -->

Variante 3: Kein externer Type-C-Controller, OTG; CC-zu-ID-Pegelwandlung erforderlich.

<!-- en PDF p.45; unit 246 -->

```text
#USB2.0 PHY0 OTG configuration
#Configure attribute "rockchip,sel-pipe-phystatus", indicating the selection of GRF control
pipe phystatus, replacing the control of USBDP PHY
#Configure attribute "rockchip,dis-u2-susphy", indicating the disabling of USB2 PHY driver's
dynamic entry into suspend mode
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#Disable all related nodes of USBDP PHY0, keeping USBDP PHY0 in an uninitialized state to
achieve the lowest power consumption
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
}

#Configure USB3.1 OTG0 Controller
#Configure dr_mode = "otg"
#Configure "phys = <&u2phy0_otg>", i.e., not referencing USBDP PHY
#Configure maximum-speed = "high-speed", notifying the DWC3 driver to restrict USB to USB2.0
only
#Configure "extcon" attribute, to support automatic switching between Device/Host mode
#Configure "snps,dis_u2_susphy_quirk", disabling the controller's hardware suspend usb2 phy
function, improving USB communication stability
#Configure "snps,usb2-lpm-disable", disabling the controller's Host mode LPM function,
improving USB peripheral compatibility
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        extcon = <&u2phy0>;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
};
```

<!-- en PDF p.46; unit 247 -->

### 5.6 Type-A USB3.1 DTS

<!-- en PDF p.46; unit 248 -->

Siehe USB30_2 HOST in `arch/arm64/boot/dts/rockchip/rk3588-evb2-lp4.dtsi`.

<!-- en PDF p.46; unit 249 -->

```text
#USB2.0 PHY3 configuration for "phy-supply" attribute, used to control the VBUS output of 5V
&u2phy3_host {
        phy-supply = <&vcc5v0_host>;
}

#VBUS GPIO configuration, controlled by this GPIO in the USB2.0 PHY driver
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PA1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#Enable USB3.1/SATA/PCIe Combo PHY
&combphy2_psu {
        status = "okay";
};

#Configure USB3.1 HOST2 Controller
&usbhost3_0 {
        status = "okay";
};

&usbhost_dwc3_0 {
        dr_mode = "host";
        status = "okay";
};
```

<!-- en PDF p.46; unit 250 -->

### 5.7 Type-A USB2.0 DTS

<!-- en PDF p.46; unit 251 -->

Siehe HOST0/1 in `arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi`.

<!-- en PDF p.46; unit 252 -->

```text
#USB2.0 PHY2/3 configuration for "phy-supply" attribute, used to control 5V VBUS output
&u2phy2_host {
        phy-supply = <&vcc5v0_host>;
};
&u2phy3_host {
        phy-supply = <&vcc5v0_host>;
};

#VBUS GPIO configuration, controlled by this GPIO in the USB2.0 PHY driver
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#USB2.0 HOST0/1 Controller
&usb_host0_ehci {
        status = "okay";
};

&usb_host0_ohci {
        status = "okay";
};

&usb_host1_ehci {
        status = "okay";
};

&usb_host1_ohci {
        status = "okay";
};
```

<!-- en PDF p.47; unit 254 -->

### 5.8 Micro USB DTS

<!-- en PDF p.47; unit 255 -->

RK3588 OTG unterstützt Micro USB2.0. Ausgehend von `arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi` entfernen:

<!-- en PDF p.47; unit 256 -->

1. usbc0 und dessen Kindknoten.

<!-- en PDF p.47; unit 257 -->

2. orientation-switch und port unter usbdp_phy0.

<!-- en PDF p.47; unit 258 -->

3. usb-role-switch und port unter usbdrd_dwc3_0.

<!-- en PDF p.47; unit 259 -->

4. rockchip,typec-vbus-det unter u2phy0_otg.

<!-- en PDF p.47; unit 260 -->

5. usb-typec unter pinctrl. Danach hinzufügen:

<!-- en PDF p.48; unit 261 -->

1. vcc5v0_otg zur VBUS-Steuerung.

<!-- en PDF p.48; unit 262 -->

2. vbus-supply unter u2phy0_otg.

<!-- en PDF p.48; unit 263 -->

3. `extcon = <&u2phy0>;` unter usbdrd_dwc3_0.

<!-- en PDF p.48; unit 264 -->

```text
[...]
# VBUS GPIO Configuration, control this GPIO in the USB2.0 PHY driver
vcc5v0_otg: vcc5v0-otg {
    compatible = "regulator-fixed";
    regulator-name = "vcc5v0_otg";
    regulator-min-microvolt = <5000000>;
    regulator-max-microvolt = <5000000>;
    enable-active-high;
    gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
    vin-supply = <&vcc5v0_sys>;
    pinctrl-names = "default";
    pinctrl-0 = <&vcc5v0_otg_en>;
};

&pinctrl {
    usb {
        [...]
        vcc5v0_otg_en: vcc5v0-otg-en {
            rockchip,pins = <4 RK_PA7 RK_FUNC_GPIO &pcfg_pull_up>;
        };
    };
};

[...]

# Configure status according to the actual design. If neither USB3 nor DP is used, it is
recommended to close all related nodes of USBDP PHY0 to reduce power consumption
&usbdp_phy0 {
    maximum-speed = "high-speed";
    status = "okay";
};

&usbdp_phy0_dp {
    status = "okay";
};

&usbdp_phy0_u3 {
    status = "okay";
};

&u2phy0 {
    status = "okay";
};

&u2phy0_otg {
    vbus-supply = <&vcc5v0_otg>;
    rockchip,sel-pipe-phystatus;
    rockchip,dis-u2-susphy;
    status = "okay";
};

&usbdrd_dwc3_0 {
    status = "okay";
    dr_mode = "otg";
    maximum-speed = "high-speed";
    extcon = <&u2phy0>;
    snps,dis_u2_susphy_quirk;
    snps,usb2-lpm-disable;
};
```

<!-- en PDF p.49; unit 266 -->

### 5.9 Hinweise zu Linux USB DT

<!-- en PDF p.49; unit 267 -->

#### 5.9.1 Wichtige USB-DT-Eigenschaften

<!-- en PDF p.49; unit 268 -->

##### 5.9.1.1 USB-Controller

<!-- en PDF p.49; unit 269 -->

1. usb-role-switch ist nur für Standard-Type-C mit PD-Controller vorgesehen; dr_mode muss otg sein. Bei anderem dr_mode nicht konfigurieren.

<!-- en PDF p.49; unit 270 -->

2. extcon schaltet OTG dynamisch in Nicht-Standard-Type-C-Schaltungen (der Originaltext erwähnt einen PD-Controller), etwa Micro oder Type-A, wenn der Controller im otg-Modus konfiguriert ist.

<!-- en PDF p.49; unit 271 -->

3. snps,dis_u2_susphy_quirk deaktiviert das automatische Hardware-Suspend des USB2 PHY durch den Controller, vor allem für stabilere USB2-only-Kommunikation.

<!-- en PDF p.49; unit 272 -->

4. snps,usb2-lpm-disable deaktiviert Host-LPM, vor allem für bessere Peripheriekompatibilität bei USB2-only.

<!-- en PDF p.49; unit 273 -->

##### 5.9.1.2 USB2 PHY

<!-- en PDF p.49; unit 274 -->

1. vbus-supply und phy-supply steuern 5V-VBUS: vbus-supply für dynamisch schaltendes OTG; phy-supply für USB HOST mit dauerhaftem 5V-VBUS nach Systemstart.

<!-- en PDF p.49; unit 275 -->

2. rockchip,sel-pipe-phystatus konfiguriert das GRF-USB-Steuerregister, sodass GRF statt USBDP PHY pipe phystatus steuert. Bei USB2-only ohne aktivierten USBDP PHY ist es zwingend, sonst arbeitet USB nicht korrekt.

<!-- en PDF p.49; unit 276 -->

3. rockchip,typec-vbus-det unterstützt Schaltungen mit dauerhaft hochgezogenem Type-C VBUS_DET.

<!-- en PDF p.49; unit 277 -->

4. rockchip,dis-u2-susphy verhindert dynamischen Suspend im USB2-PHY-Treiber, insbesondere bei USB2-only, um dessen Ausgangstakt zum Controller zu erhalten.

<!-- en PDF p.50; unit 278 -->

##### 5.9.1.3 USBDP Combo PHY

<!-- en PDF p.50; unit 279 -->

1. rockchip,dp-lane-mux ordnet DP-Lanes bei nicht vollständigem Type-C zu. Zwei oder vier Lanes sind möglich: `<2, 3>` ordnet DP Lane0 PHY Lane2 und DP Lane1 PHY Lane3 zu; `<0, 1, 2, 3>` ist die direkte Zuordnung.

<!-- en PDF p.50; unit 280 -->

## 6. OTG-Umschalten des RK3588

<!-- en PDF p.50; unit 281 -->

Das SDK erzwingt Host/Peripheral unabhängig von OTG-ID oder Type-C. Linux-5.10 bietet zwei Methoden. Methode 1 braucht korrektes DTS und gilt nur ohne Type-C. Methode 2 hat keine solchen Einschränkungen und wird bei unklarer Hardware-/Softwareanpassung empfohlen. Methode 1 [Legacy]:

<!-- en PDF p.50; unit 282 -->

```text
#1.Force host mode
  echo host > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-phy@0/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-
phy@0/otg_mode
```

<!-- en PDF p.50; unit 283 -->

Methode 2 [New]:

<!-- en PDF p.50; unit 284 -->

```text
#1.Force host mode
  echo host > /sys/kernel/debug/usb/fc000000.usb/mode
#2.Force peripheral mode
  echo device > /sys/kernel/debug/usb/fc000000.usb/mode
```

<!-- en PDF p.50; unit 285 -->

## 7. Unterstützte Type-C-Controller

<!-- en PDF p.50; unit 286 -->

Tabelle 17: Unterstützte Type-C-Controller.

<!-- en PDF p.51; unit 287 -->

| Type-C-Controllermodell | Linux-4.4 | Linux-4.19 | Linux-5.10 | Linux-6.1 | Beschreibung |
| --- | --- | --- | --- | --- | --- |
| ANX7411 | Nicht unterstützt | Nicht unterstützt | Nicht unterstützt | In Erprobung | Linux-6.1-Treiber unterstützt; Funktionen weiter zu debuggen |
| AW35615 | Unterstützt | Unterstützt | Unterstützt | Unterstützt | Empfohlen; gute DisplayPort-Alt-Mode-Kompatibilität, vollständig kompatibel zu FUSB302 |
| ET7301B | Unterstützt | Unterstützt | Unterstützt | Unterstützt | Vollständig kompatibel zu FUSB302, Hinweis 1 |
| ET7303 | Nicht unterstützt | Unterstützt | Unterstützt | Unterstützt | Hardwarekompatibel zu FUSB302, Treiber stark ähnlich RT1711, Hinweis 2 |
| FUSB302 | Unterstützt | Unterstützt | Unterstützt | Unterstützt | Standardchip der RK3588 EVB |
| HUSB311 | Nicht unterstützt | Unterstützt | Unterstützt | Unterstützt | Empfohlen; hardwarekompatibel zu FUSB302, Treiber inkompatibel, Hinweis 3 |
| RT1711H | Nicht unterstützt | Unterstützt | Unterstützt | Unterstützt | Hardwarekompatibel zu FUSB302, Treiber stark ähnlich ET7303, Hinweis 4 |
| WUSB3801 | Keine SDK-Unterstützung; in einzelnen Projekten verwendet | Nicht unterstützt | Nicht unterstützt | Nicht unterstützt | Proprietäre Eindrahtkommunikation, hohe Fehlerrate, keine gesicherte Stabilität |

<!-- en PDF p.51; unit 288 -->

Hinweis 1: Linux-4.4 besitzt kein TCPM und unterstützt nur FUSB302/ET7301B, direkt ohne Hardware-/Softwareänderung austauschbar. Linux-4.19/5.10 unterstützt TCPM/TCPCI, theoretisch alle TCPCI-konformen Chips wie ET7303/HUSB311/RT1711H.

Hinweis 2: Kleiner ET7303 wurde auf RK validiert; laut Quelle gibt es kein großes Gehäuse. CONFIG_TYPEC_ET7303 aktivieren; am usbc0-Beispiel nur Knotenname, reg und compatible ändern.

Hinweis 3: FUSB302 ist durch HUSB311 ersetzbar; CONFIG_TYPEC_HUSB311 nutzen, DTS wie Hinweis 2.

<!-- en PDF p.52; unit 289 -->

Hinweis 4: RT1711H ist hardwarekompatibel zu FUSB302/ET7303; Treiber ähnelt ET7303. CONFIG_TYPEC_RT1711H aktivieren; DTS wie Hinweis 2.

<!-- en PDF p.52; unit 290 -->

## 8. Referenzdokumente

<!-- en PDF p.52; unit 291 -->

1. Universal Serial Bus Type-C Cable and Connector Specification.

<!-- en PDF p.52; unit 292 -->

2. Rockchip Developer Guide USB EN.

## Quellunterschiede und Anpassung

Beispiele unterscheiden sich in Pfadschreibweise, Knotennamen, Kommentaren und Seitenumbrüchen. Der Anhang bewahrt abweichende Blöcke der anderen Quelle separat; unabhängige Beispiele, kein gemeinsames ausführbares Skript. Verbrauchsdaten gelten nur für die genannten Herstellerszenarien, nicht als Boardvalidierung durch diese Website.

Beide Quellen sind V1.3.0. §3 nennt vier Varianten, listet Config0–4; EVB-Dateinamen in §5.1 weichen von nachfolgenden Chip-DTSI-Pfaden ab; die Tabelle schreibt R3588; §4.3.3 verweist auf Tabelle 5 statt Verbindungstabelle 6. Quellangaben bleiben mit Hinweis erhalten, ohne vermutete Verdrahtungskorrektur. Maskrom nutzt Type-C0 USB2.0 und verlangt USBDP-PHY0-Versorgung sowie REXT: RK3576-USB3.1-Maskrom nicht übertragen.

## Abweichende Originalbeispiele der anderen Fassung

**CN PDF p.18 · #102**

```text
&u2phy2 {
        status = "disabled";
};

&u2phy3 {
        status = "disabled";
};

&u2phy2_host {
        status = "disabled";
};

&u2phy3_host {
        status = "disabled";
};
```

**CN PDF p.29 · #209**

```text
#USB3.1 OTG0 Controller
usbdrd3_0: usbdrd3_0 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_0: usb@fc000000 {
                compatible = "snps,dwc3";
                ......
        };
};

#USB2.0 HOST0 Controller
usb_host0_ehci: usb@fc800000 {
        compatible = "generic-ehci";
        ......
};

usb_host0_ohci: usb@fc840000 {
        compatible = "generic-ohci";
        ......
};

#USB2.0 HOST1 Controller
```

**CN PDF p.30 · #210**

```text
usb_host1_ehci: usb@fc880000 {
        compatible = "generic-ehci";
        ......
};

usb_host1_ohci: usb@fc8c0000 {
        compatible = "generic-ohci";
        ......
};

#USB3.1 HOST2 Controller
usbhost3_0: usbhost3_0 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbhost_dwc3_0: usb@fcd00000 {
                compatible = "snps,dwc3";
                ......
        };
};

#USB3.1 OTG1 Controller
usbdrd3_1: usbdrd3_1 {
        compatible = "rockchip,rk3588-dwc3", "rockchip,rk3399-dwc3";
        ......
        usbdrd_dwc3_1: usb@fc400000 {
                compatible = "snps,dwc3";
                ......
        };
};
```

**CN PDF p.30 · #212**

```text
#USB2.0 PHY0
usb2phy0_grf: syscon@fd5d0000 {
                compatible = "rockchip,rk3588-usb2phy-grf", "syscon",
                             "simple-mfd";
                ......
                u2phy0: usb2-phy@0 {
                        compatible = "rockchip,rk3588-usb2phy";
                        ......
                        u2phy0_otg: otg-port {
                                #phy-cells = <0>;
                                status = "disabled";
                        };
                };
        };

#USB2.0 PHY1
usb2phy1_grf: syscon@fd5d4000 {
    ......
};
```

**CN PDF p.31 · #213**

```text
#USB2.0 PHY2
usb2phy2_grf: syscon@fd5d8000 {
    ......
};

#USB2.0 PHY3
usb2phy3_grf: syscon@fd5dc000 {
    ......
};

#USB3.1/DP Combo PHY0
usbdp_phy0: phy@fed80000 {
        compatible = "rockchip,rk3588-usbdp-phy";
        ......
        usbdp_phy0_dp: dp-port {
                #phy-cells = <0>;
                status = "disabled";
        };

        usbdp_phy0_u3: u3-port {
                #phy-cells = <0>;
                status = "disabled";
        };
};

#USB3.1/DP Combo PHY1
usbdp_phy1: phy@fed90000 {
    ......
};

#USB3.1/SATA/PCIe PHY2
combphy2_psu: phy@fee20000 {
        compatible = "rockchip,rk3588-naneng-combphy";
        ......
};
```

**CN PDF p.31 · #216**

```text
#USB2.0 PHY配置属性"rockchip,typec-vbus-det"，表⽰⽀持Type-C VBUS_DET常拉⾼的硬件设计
&u2phy0_otg {
        rockchip,typec-vbus-det;
};

#USB3.1/DP PHY0，需要根据硬件设计，配置属性"sbu1-dc-gpios"和"sbu2-dc-gpios"
&usbdp_phy0 {
        orientation-switch;
        svid = <0xff01>;
        sbu1-dc-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_HIGH>;
        sbu2-dc-gpios = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
```

**CN PDF p.32 · #217**

```text
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                usbdp_phy0_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };

                usbdp_phy0_dp_altmode_mux: endpoint@1 {
                        reg = <1>;
                        remote-endpoint = <&dp_altmode_mux>;
                };
        };
};

#USB3.1 OTG0 Controller
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        usb-role-switch;
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_0_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#VBUS GPIO配置，在Type-C控制器芯⽚驱动中控制该GPIO
vbus5v0_typec: vbus5v0-typec {
        compatible = "regulator-fixed";
        regulator-name = "vbus5v0_typec";
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PD0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&typec5v_pwren>;
};

#配置外置Type-C控制器芯⽚FUSB302
#需要根据实际的硬件设计，配置"I2C/interrupts/vbus-supply/usb_con"的属性
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
```

**CN PDF p.33 · #218**

```text
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
                    ......
                };
        };
};
```

**CN PDF p.33 · #220**

```text
#配置外置Type-C控制器芯⽚HUSB311
&i2c2 {
        usbc0: husb311@4e {
                compatible = "hynetek,husb311";
                reg = <0x4e>;
                ......
        };
};
```

**CN PDF p.34 · #223**

```text
#USB2.0 PHY0配置"phy-supply"属性，⽤于控制VBUS输出5V
#注意：使⽤phy-supply，⽆法实现VBUS的动态开关。如果OTG独占GPIO，不与其他HOST共⽤，并且OTG需
要⽀持Device/HOST，则应该配置为"vbus-supply = <&vcc5v0_otg>"，才能实现VBUS动态开关。
&u2phy0_otg {
        phy-supply = <&vcc5v0_host>;
};

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PA1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#USB3.1/DP PHY0，只需配置DP使⽤lane2/3，驱动会⾃动分配lane0/1给USB3.1 Rx/Tx
#如果硬件设计DP使⽤lane0/1，则此处应配置"rockchip,dp-lane-mux = <0 1>"
#注意：实际电路中，即使未⽀持DP，也需要配置"rockchip,dp-lane-mux"，否则USBDP PHY驱动⽆法⾃
动分配lane给USB3.1
&usbdp_phy0 {
        rockchip,dp-lane-mux = <2 3>;
};

#USB3.1 OTG0 Controller
#配置"dr_mode"为"otg"，同时配置"extcon"属性，才能⽀持软件切换Device/Host mode
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        extcon = <&u2phy0>;
        status = "okay";
};
```

**CN PDF p.34 · #226**

```text
#USB2.0 PHY1配置"phy-supply"属性，⽤于控制VBUS输出5V
&u2phy1_otg {
        phy-supply = <&vcc5v0_host>;
```

**CN PDF p.35 · #227**

```text
        status = "okay";
};

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_host: vcc5v0-host-regulator {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_sys>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#USB3.1/DP PHY1，配置DP使⽤lane0/1/2/3
#需要根据实际的硬件设计，配置属性"rockchip,dp-lane-mux"
#配置属性"maximum-speed"，通知USBDP驱动将USB限制为USB2.0 only
&usbdp_phy1 {
        maximum-speed = "high-speed";
        rockchip,dp-lane-mux = < 0 1 2 3 >;
        status = "okay";
};

&usbdp_phy1_dp {
        status = "okay";
};

&usbdp_phy1_u3 {
        status = "okay";
};

#配置属性"maximum-speed"，通知DWC3驱动将USB限制为USB2.0 only
&usbdrd_dwc3_1 {
        dr_mode = "host";
        maximum-speed = "high-speed";
        status = "okay";
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
};
```

**CN PDF p.35 · #230**

```text
#USB2.0 PHY0注册typec orientation switch，⽤于与TCPM⼦系统交互，获取USB热拔插的信息
&u2phy0 {
```

**CN PDF p.36 · #231**

```text
        orientation-switch;
        status = "okay";

        port {
                #address-cells = <1>;
                #size-cells = <0>;
                u2phy0_orientation_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_orien_sw>;
                };
        };
};

#USB2.0 PHY0 OTG配置
#配置属性"rockchip,sel-pipe-phystatus"，表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,typec-vbus-det"，表⽰⽀持Type-C VBUS_DET常拉⾼的硬件设计
#配置属性"rockchip,dis-u2-susphy"，表⽰关闭USB2 PHY驱动动态进⼊suspend mode的功能
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,typec-vbus-det;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#disable USBDP PHY0的所有相关节点，让USBDP PHY0处于未初始化状态，达到最低功耗的⽬的
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
};

&dp0 {
        status = "disabled";
};

&usbdrd3_0 {
        status = "okay";
}

#配置USB3.1 OTG0 Controller
#配置"phys = <&u2phy0_otg>"，即不引⽤USBDP PHY
#配置maximum-speed = "high-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的稳定
性
#配置"snps,usb2-lpm-disable"，关闭控制器Host mode的LPM功能，提⾼USB外设的兼容性
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        status = "okay";
```

**CN PDF p.37 · #232**

```text
        maximum-speed = "high-speed";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        usb-role-switch;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
        port {
                #address-cells = <1>;
                #size-cells = <0>;
                dwc3_0_role_switch: endpoint@0 {
                        reg = <0>;
                        remote-endpoint = <&usbc0_role_sw>;
                };
        };
};

#配置外置Type-C控制器芯⽚FUSB302
#需要根据实际的硬件设计，配置"I2C/interrupts/vbus-supply/usb_con"的属性
#需要配置usbc0_orien_sw的属性remote-endpoint = <&u2phy0_orientation_switch>
&i2c8 {
        status = "okay";
        pinctrl-names = "default";
        pinctrl-0 = <&i2c8m2_xfer>;

        usbc0: fusb302@22 {
                compatible = "fcs,fusb302";
                reg = <0x22>;
                interrupt-parent = <&gpio0>;
                interrupts = <RK_PC4 IRQ_TYPE_LEVEL_LOW>;
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
                        ......
                        ports {
                                #address-cells = <1>;
                                #size-cells = <0>;
```

**CN PDF p.38 · #233**

```text
                                port@0 {
                                        reg = <0>;
                                        usbc0_orien_sw: endpoint {
                                                remote-endpoint =
<&u2phy0_orientation_switch>;
                                        };
                                };
                        };

                };
        };
```

**CN PDF p.38 · #235**

```text
#USB2.0 PHY0 OTG配置
#配置属性"rockchip,sel-pipe-phystatus"，表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,dis-u2-susphy"，表⽰关闭USB2 PHY驱动动态进⼊suspend mode的功能
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#disable USBDP PHY0的所有相关节点，让USBDP PHY0处于未初始化状态，达到最低功耗的⽬的
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
}

#配置USB3.1 OTG0 Controller
#配置dr_mode = "peripheral"，通知DWC3驱动初始化为Device only mode
#配置"phys = <&u2phy0_otg>"，即不引⽤USBDP PHY
#配置maximum-speed = "high-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的稳定
性
&usbdrd_dwc3_0 {
        dr_mode = "peripheral";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        snps,dis_u2_susphy_quirk;
};
```

**CN PDF p.39 · #237**

```text
#USB2.0 PHY0 OTG配置
#配置属性"rockchip,sel-pipe-phystatus"，表⽰选择GRF控制pipe phystatus，替代USBDP PHY的
控制
#配置属性"rockchip,dis-u2-susphy"，表⽰关闭USB2 PHY驱动动态进⼊suspend mode的功能
&u2phy0_otg {
        rockchip,sel-pipe-phystatus;
        rockchip,dis-u2-susphy;
        status = "okay";
};

#disable USBDP PHY0的所有相关节点，让USBDP PHY0处于未初始化状态，达到最低功耗的⽬的
&usbdp_phy0 {
        status = "disabled";
};

&usbdp_phy0_dp {
        status = "disabled";
};

&usbdp_phy0_u3 {
        status = "disabled";
}

#配置USB3.1 OTG0 Controller
#配置dr_mode = "otg"
#配置"phys = <&u2phy0_otg>"，即不引⽤USBDP PHY
#配置maximum-speed = "high-speed"，通知DWC3驱动将USB限制为USB2.0 only
#配置"extcon"属性，才能⽀持⾃动切换Device/Host mode
#配置"snps,dis_u2_susphy_quirk"，关闭控制器硬件suspend usb2 phy的功能，提⾼USB通信的稳定
性
#配置"snps,usb2-lpm-disable"，关闭控制器Host mode的LPM功能，提⾼USB外设的兼容性
&usbdrd_dwc3_0 {
        dr_mode = "otg";
        phys = <&u2phy0_otg>;
        phy-names = "usb2-phy";
        maximum-speed = "high-speed";
        extcon = <&u2phy0>;
        snps,dis_u2_susphy_quirk;
        snps,usb2-lpm-disable;
};
```

**CN PDF p.39 · #240**

```text
#USB2.0 PHY3配置"phy-supply"属性，⽤于控制VBUS输出5V
&u2phy3_host {
        phy-supply = <&vcc5v0_host>;
}

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
```

**CN PDF p.40 · #241**

```text
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PA1 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
};

#使能USB3.1/SATA/PCIe Combo PHY
&combphy2_psu {
        status = "okay";
};

#配置USB3.1 HOST2 Controller
&usbhost3_0 {
        status = "okay";
};

&usbhost_dwc3_0 {
        dr_mode = "host";
        status = "okay";
};
```

**CN PDF p.40 · #244**

```text
#USB2.0 PHY2/3配置"phy-supply"属性，⽤于控制VBUS输出5V
&u2phy2_host {
        phy-supply = <&vcc5v0_host>;
};

&u2phy3_host {
        phy-supply = <&vcc5v0_host>;
};

#VBUS GPIO配置，在USB2.0 PHY驱动中控制该GPIO
vcc5v0_host: vcc5v0-host {
        compatible = "regulator-fixed";
        regulator-name = "vcc5v0_host";
        regulator-boot-on;
        regulator-always-on;
        regulator-min-microvolt = <5000000>;
        regulator-max-microvolt = <5000000>;
        enable-active-high;
        gpio = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
        vin-supply = <&vcc5v0_usb>;
        pinctrl-names = "default";
        pinctrl-0 = <&vcc5v0_host_en>;
```

**CN PDF p.41 · #245**

```text
};

#USB2.0 HOST0/1 Controller
&usb_host0_ehci {
        status = "okay";
};

&usb_host0_ohci {
        status = "okay";
};

&usb_host1_ehci {
        status = "okay";
};

&usb_host1_ohci {
        status = "okay";
};
```

**CN PDF p.41 · #256**

```text
[...]
# VBUS GPIO 配置，在USB2.0 PHY驱动中控制该 GPIO
vcc5v0_otg: vcc5v0-otg {
    compatible = "regulator-fixed";
    regulator-name = "vcc5v0_otg";
    regulator-min-microvolt = <5000000>;
    regulator-max-microvolt = <5000000>;
    enable-active-high;
    gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
    vin-supply = <&vcc5v0_sys>;
    pinctrl-names = "default";
    pinctrl-0 = <&vcc5v0_otg_en>;
};
```

**CN PDF p.42 · #257**

```text
&pinctrl {
    usb {
        [...]
        vcc5v0_otg_en: vcc5v0-otg-en {
            rockchip,pins = <4 RK_PA7 RK_FUNC_GPIO &pcfg_pull_up>;
        };
    };
};

[...]

# 按实际设计配置 status. 如果 USB3 和 DP 都不使⽤，建议关闭 USBDP PHY0 的所有相关节点，以降
低功耗
&usbdp_phy0 {
    maximum-speed = "high-speed";
    status = "okay";
};

&usbdp_phy0_dp {
    status = "okay";
};

&usbdp_phy0_u3 {
    status = "okay";
};

&u2phy0 {
    status = "okay";
};

&u2phy0_otg {
    vbus-supply = <&vcc5v0_otg>;
    rockchip,sel-pipe-phystatus;
    rockchip,dis-u2-susphy;
    status = "okay";
};

&usbdrd_dwc3_0 {
    status = "okay";
    dr_mode = "otg";
    maximum-speed = "high-speed";
    extcon = <&u2phy0>;
    snps,dis_u2_susphy_quirk;
    snps,usb2-lpm-disable;
};
```

**CN PDF p.44 · #276**

```text
#1.Force host mode
  echo host > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-
phy@0/otg_mode
#2.Force peripheral mode
  echo peripheral > /sys/devices/platform/fd5d0000.syscon/fd5d0000.syscon:usb2-
phy@0/otg_mode
```

{% endraw %}
