---
title: "USB SQ Tool 1.5: vom Augendiagramm zur USB-PHY-Konfiguration"
description: "USB SQ Tool erzeugt Prüfkommandos, Registerwerte und PHY-Treiberbeispiele."
excerpt: "USB SQ Tool erzeugt Prüfkommandos, Registerwerte und PHY-Treiberbeispiele."
translation_key: "rockchip-tool-usb-sq-tool"
slug: "rockchip-tool-usb-sq-tool"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "USB SQ Tool"]
---

{% raw %}

![USB SQ Tool](/assets/rockchip-tools/flows/usb-sq-tool-de.svg)

## Vollständige technische Referenz USB SQ Tool V1.4.0

Dieser Abschnitt folgt dem mitgelieferten Handbuch V1.4.0. Passende Fachabschnitte verwenden unsere geprüften V1.8.0-Übersetzungen, begrenzt auf den älteren Umfang; neue Plattformlisten belegen keine Unterstützung durch alte Werkzeuge. Die USB2.0-Hauptliste nennt RK3588/RK3588S, RK3568/RK3566/RK3562/RK3528, RK3399, PX30/PX30S, RK3308/RK3308B-S, RK3326/RK3326S, RK3228, RK3288, RK3328 und RV1103/RV1106. RK3328 umfasst OTG/HOST, nicht USB3-U2PHY. USB3.1 nennt RK3528/RK3562/RK3566/RK3568/RK3588. Spätere Abschnitte behandeln zusätzlich RK3036/RK312X und RV1109/RV1126; diese Abweichung bleibt sichtbar. Windows-Reihenfolge: Plattform, Port, Testbefehl, Parameter, Bestätigung, Code Output. Zuerst Kabel, Impedanz und Versorgung verbessern, dann schrittweise anhand des Augendiagramms abstimmen; größere Werte sind nicht automatisch besser.

Das RK3562-Beispiel endet wie die Quelle mit `]` und ist nicht direkt kompilierbar. Auslassungspunkte kennzeichnen Einfügepositionen, keine vollständigen Patches. Alle Abbildungen sind chinesische V1.4.0-Originale.

### 1. RK3399 USB2.0 Tuning Oberfläche

RK3399 USB2.0 unterstützt TYPE-C0, TYPE-C1, HOST0 und HOST1. Vorgehen:

1. Testschnittstelle links in Feld 1 wählen; rechts wird automatisch der SQ-Testbefehl erzeugt.

2. Parameter in rotem Feld 2 wählen. Pre-emphasize wird per Kontrollkästchen gewählt, andere Parameter über Bedienelemente wie Feld 4: Eingabe oder Auf-/Ab-Tasten. Bereich und Beschreibung stehen bei jedem Parameter.

3. Parameter wählen und Bestätigen in Feld 3 drücken. Daneben entstehen io-Befehle; Code Output in Feld 5 erzeugt Referenzcode.

Tabelle 3.  RK3399 USB2.0 Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| Pre-emphasize | HS-Tx-Pre-emphasis einstellen |
| Slew Rate | Slew Rate des HS-Tx-Auges einstellen |
| Compensation Voltage | HS-Tx-Spannungskalibrierung; Erhöhung vergrößert die Augenhöhe |
| Compensation Current | HS-Tx-Stromkalibrierung; Erhöhung vergrößert die Augenhöhe |
| Pre-emphasize Strength | HS-Tx-Pre-emphasis-Stärke einstellen |
| Bypass ODT &amp; Driver Strength | Automatische Widerstandseinstellung im Kompensationskreis umgehen, um die Augenhöhe zu ändern |
| Squelch | HS-Rx-Rauschschwelle einstellen |
| HOST Disconnect Detection | HS-Trennschwelle einstellen; nur HOST |

### 2. RK3568 USB2.0 Tuning Oberfläche

RK3568 USB2.0 unterstützt OTG, HOST1, HOST2 und HOST3. Vorgehen:

1. Testschnittstelle links in Feld 1 wählen; rechts wird automatisch der SQ-Testbefehl erzeugt.

2. RK3568-USB2.0-PHY-Register besitzen keine write_enable-Bits in den oberen 16 Bits. Zum Schutz anderer Bits den Anfangswert mit Feld 2 lesen und rechts in das Anfangswertfeld eintragen.

3. Parameter in Feld 3 wählen. Pre-emphasize per Kontrollkästchen, andere Werte über Elemente wie Feld 5 mit Eingabe oder Auf-/Ab-Tasten einstellen. Bereich und Beschreibung werden angezeigt.

4. Bestätigen in Feld 4 anklicken. Daneben entstehen io-Befehle, in Code Output (Feld 6) Referenzcode. Wichtig: Das Anfangswertfeld enthält Vorgaben. Ohne manuelle Ersetzung beeinflussen diese eventuell das Ergebnis. Vor dem Test immer den aktuellen Registerwert lesen und eintragen.

| Parameter | Beschreibung |
| --- | --- |
| Pre-emphasize | HS-Tx-Pre-emphasis einstellen |
| HS Eye Height | HS-Tx-Augenhöhe einstellen |
| HS ODT Value | 45Ω-ODT-Widerstand einstellen. Höherer Eingabewert senkt den Widerstand, erhöht die Augenhöhe und beschleunigt FS/LS-Slew-Rate |
| Slew Rate | HS-Augen-Slew-Rate einstellen; geringe Wirkung |
| Squelch | HS-Rx-Rauschschwelle einstellen |
| HOST Disconnect Detection | Trennschwelle einstellen; nur HOST |
| B_Session Valid | VBUS-DET-Schwelle einstellen; nur Device |

RK3568-USB2.0-Rauschschwelle: Lange, schlechte oder hochohmige Kabel können die High-Speed-Enumeration verhindern. Die PHY-Schwelle beträgt meist 150mV. Dämpfung kann gültige Signale darunter senken, sodass sie als Rauschen gelten. Mit Squelch die Schwelle moderat reduzieren, typischerweise auf 125mV oder 112.5mV.

RK3568-Trennschwelle: Host Disconnect Detection verwenden. Typische Rockchip-Host-Anschlusslogs:

```text
[ 1204.092638] usb 1-1: new high-speed USB device number 3 using ehci-platform
[ 1204.280373] usb 1-1: New USB device found, idVendor=058f, idProduct=6387, bcdDevice= 1.04
[ 1204.280449] usb 1-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[ 1204.280476] usb 1-1: Product: Mass Storage
[ 1204.280498] usb 1-1: SerialNumber: FA45A19C
```

Typisches Rockchip-Host-Trennungslog:

```text
[ 985.341233] usb 1-1: USB disconnect, device number 2
```

1) Abziehen eines USB2.0-Geräts wird nicht erkannt. Erscheint kein Trennungslog, folgende Schritte versuchen:

1. EOP-Pre-emphasis aktivieren; im SDK standardmäßig aus, siehe Abbildung 5.

2. Host-Trennschwelle reduzieren. Manche Chips bieten kein EOP-Tuning: Schritt 1 gemäß Oberfläche überspringen. Sonst Schritt 2 zusätzlich erst ausführen, wenn Schritt 1 nicht deutlich hilft. Zu starke Absenkung kann unbeabsichtigte Trennungen im Normalbetrieb verursachen; Risiko beachten.

2) Unerwartete USB2.0-Trennung im Betrieb: Host-Trennschwelle erhöhen versuchen. Nicht jede Trennung liegt daran; häufig sind Gerät oder Hardwareumgebung verantwortlich. Nicht blind abstimmen. EOP ist im SDK bereits aus; kein zusätzlicher Schreibzugriff nötig. Zu hohe Schwellen verhindern die Abzieherkennung.

RK356X-B_Sessionvalid betrifft PCs, die ein USB Device (ADB/MTP) nicht erkennen oder anschließend verlieren. Spannungsschwelle senken versuchen: Standard 3'b000; Quellenempfehlung 3'b111 (7) oder 3'b101 (5).

Drei wesentliche Hardwareursachen: zu niedrige VBUS-Spannung (unter 4.7V oft problematisch); hohe USB_AVDD1V0-Welligkeit oder Erhöhung auf 1.2V, wodurch Bvalid nicht erkannt wird; hohe Logic-Spannungswelligkeit mit Controllerstörung.

### 3. RK3588 USB2.0 Tuning Oberfläche

RK3588 USB2.0 unterstützt TYPE-C0, TYPE-C1, USB2.0 HOST0 und USB2.0 HOST1. Schritte:

1. Testschnittstelle links in Feld 1 wählen; rechts wird automatisch der SQ-Testbefehl erzeugt.

2. Parameter in Feld 2 eingeben oder mit Auf-/Ab-Tasten wählen. Bereich und Beschreibung sind angegeben.

3. Parameter wählen und Bestätigen in Feld 2 drücken. Daneben entstehen io-Befehle; Code Output in Feld 3 erzeugt Referenzcode.

Tabelle 5.  RK3588 USB2.0  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| TXRISE | HS-Tx-Slew-Rate für Anstiegs-/Abfallzeit einstellen |
| TXPREEMPAMP | HS-Tx-Pre-emphasis-Strom einstellen |
| TXPREEMPPLUSE | Tastverhältnis des Pre-emphasis-Stroms; nur bei aktivem TXPREEMPAMP TUNE wirksam |
| TXHSXV | HS-Tx-DP/DM-Kreuzungsspannung; keine deutliche Änderung |
| TXVREF | HS-Tx-Gleichspannung; deutliche Änderung der Augenamplitude |
| TXRES | HS-Tx-Impedanz; verändert Amplitude und Anstiegs-/Abfallzeit |
| TXFSLS | FS/LS-Tx-Impedanz; verändert Amplitude, Anstiegs-/Abfallzeit, Kreuzungsspannung und Tastverhältnis |
| HOST DISCONNECT DETECTION | Trennschwelle einstellen; nur HOST |

### 4. RK3588 USB3.1 Tuning Oberfläche

RK3588 USB3.1 umfasst USB3-OTG0 (USB3&amp;Dp CombPhy0), USB3-OTG1 (USB3&amp;Dp CombPhy1) und USB3-HOST2 (USB3&amp;PCIE&amp;SATA CombPhy). Schritte:

1. Testschnittstelle links in Feld 1 wählen; rechts wird automatisch der SQ-Testbefehl erzeugt.

2. Bei USB3-OTG0/1 das CombPhy0/1-Orientierungsregister über Feld 2 lesen und eintragen. Der Wert muss 0xCx oder 0x3x entsprechen. Schlägt das Lesen fehl (meist Type-C), Kabel am Testport anschließen, um CombPhy0/1 zu aktivieren, dann erneut lesen.

3. Bei USB3-HOST2 Feld 2 überspringen und START in Feld 3 drücken.

4. Nach START werden bei USB3-OTG0/1 die linken Bestätigen-Tasten in Feld 5 aktiv und die rechten HOST2-Tasten in Feld 6 inaktiv; bei HOST2 umgekehrt.

5. RK3588-USB3.1-PHY-Register besitzen keine write_enable-Bits in den oberen 16 Bits. Zum Schutz anderer Bits den Anfangswert mit Feld 4 lesen und rechts in das Anfangswertfeld eintragen.

6. Parameter wählen und Bestätigen in Feld 5 drücken. Daneben entstehen io-Befehle; Code Output in Feld 7 erzeugt Referenzcode.

Tabelle 11.  RK3588 USB3.1  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| TX Driver main-tap level(USB3-OTG) | SS-Tx-Spannung einstellen |
| TX Pmos current control(USB3-OTG) | SS-Tx-Strom; erst verwenden, wenn Spannungsabstimmung nicht genügt |
| TX De-emphasis(USB3-OTG) | SS-Tx-De-emphasis einstellen |
| TX Slew Rate(USB3-OTG) | SS-Tx-Slew-Rate einstellen |
| Full Txswing and TXmargin(USB3-HOST) | Full-Swing/Txmargin: TX_SWING und TX_MARGIN[2:0] steuern gemeinsam die Tx-Ausgangsamplitude |
| Low swing and Txmargin(USB3-HOST) | Low-Swing/Txmargin: gleiche Funktion wie Full Tx swing, andere Stufen |
| TX De-emphasis(USB3- HOST) | De-emphasis-Pegel des Senders konfigurieren |

### 5. RV1106 USB2.0 Tuning Oberfläche

RV1106 USB2.0 unterstützt Pre-emphasis samt Stärke, ODT, Augenhöhe, Rausch-, Bvalid- und Trennschwellen. RV1103/RV1103B besitzen keinen VBUS-DET-Gehäusepin und daher kein Bvalid-Tuning; andere Optionen entsprechen RV1106.

Tabelle 6.  RV1106 USB2.0  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| Pre-emphasize | HS-Tx-Pre-emphasis; standardmäßig aktiv |
| Pre-emphasize Strength | HS-Tx-Pre-emphasis-Stärke; Register nur bei aktivem Pre-emphasis wirksam |
| HS ODT Value | 45Ω-ODT-Widerstand: Höherer Wert senkt Widerstand und erhöht Augenhöhe ohne Einfluss auf FS/LS-Slew-Rate |
| Eye Height | HS-Tx-Augenhöhe. Stufe 4:470mV erfordert zugleich Logic-Spannung &gt; 850mV |
| Squelch | HS-Rx-Rauschschwelle einstellen |
| BValid | VBUS-DET-Schwelle einstellen; nur Device |
| HOST Disconnect Detection | Trennschwelle einstellen; nur HOST |

### 6. RV1109 USB2.0 Tuning Oberfläche

RV1109 USB2.0 bietet Slew Rate, Augenhöhe, Rausch- und Trennschwelle. RV1126 verwendet dieselben Optionen.

Tabelle 7.  RV1109 USB2.0  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| Slew Rate | Slew Rate des HS-Tx-Auges einstellen |
| Eye Height | HS-Tx-Augenhöhe einstellen |
| Squelch | HS-Rx-Rauschschwelle einstellen |
| HOST Disconnect Detection | Trennschwelle einstellen; nur HOST |

### 7. RK3528 USB3.1 Tuning Oberfläche

RK3528 USB3.1 bietet Full Txswing and Txmargin, Low Swing and Txmargin, Tx De-emphasis und Boost Level. RK3562 und RK3568 verwenden dieselben Optionen.

Tabelle 10.  RK3528 USB3.1  Signalparameter

| Parameter | Beschreibung |
| --- | --- |
| Full Txswing and TXmargin | Full-Swing/Txmargin: TX_SWING und TX_MARGIN[2:0] steuern gemeinsam die Tx-Ausgangsamplitude |
| Low swing and Txmargin | Low-Swing/Txmargin: gleiche Funktion wie Full Tx swing, andere Stufen |
| TX De-emphasis | De-emphasis-Pegel des Senders konfigurieren |
| Boost Level | Tx-Boost-Pegel einstellen |

### 8. RK3036/RK312X USB2.0 PHY

RK3036 unterstützt derzeit nur Kernel 3.10. Code in `usb20otg_hw_init()` in `kernel/drivers/usb/dwc_otg_310/usbdev_rk3036.c` einfügen.

```text
static void usb20otg_hw_init(void) {
    .../* OTG/Host PHY Tuning Code */
}
```

RK312X-Tuningcode in `rk312x_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk312x_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 9. RK3228 USB2.0 PHY

RK3228-Tuningcode in `rk3228_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk3228_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG/Host PHY Tuning Code */
}
```

### 10. RK3288 USB2.0 PHY

RK3288 besitzt zwei PHY-Treiberversionen. Kernel Version 4.4 für Kernel bis 4.4 wählen, 4.19 für 4.19 und neuer. Nur das Codeformat ändert sich, nicht die io-Befehle. Bei 4.19 am Ende von `rk3288_usb_phy_probe_init()` in `kernel/drivers/phy/rockchip/phy-rockchip-usb.c` einfügen. Für die drei Ports vor jedem Codefragment den Registeroffset prüfen. OTG-Code:

```text
if (rk_phy->reg_offset == 0x320) {
    ... /* OTG PHY Tuning Code */
}
```

HOST1-Code:

```text
if (rk_phy->reg_offset == 0x334) {
    ... /* HOST1 PHY Tuning Code */
}
```

HOST2-Code:

```text
if (rk_phy->reg_offset == 0x348) {
    ... /* HOST2 PHY Tuning Code */
}
```

RK3288-Kernel-4.4-Treiber: `kernel/drivers/usb/dwc_otg_310/usbdev_rk32.c`. OTG am Ende von `usb20otg_hw_init()`, HOST1 von `rk_ehci_hw_init()`, HOST2 von `usb20host_hw_init()` einfügen.

### 11. RK3308B_S/RK3308 USB2.0 PHY

Für RK3308B_S am Ende des `soc_is_rk3308bs()`-Zweigs von `rk3308_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
if (soc_is_rk3308bs()) {
    ... /* OTG/HOST PHY Tuning Code */
}
```

Für RK3308 am Ende des else-Zweigs von `rk3308_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
if (soc_is_rk3308bs()) {
    ...
} else {
    .../* OTG/HOST PHY Tuning Code */
}
```

### 12. RK3326S/PX30S/RK3326/PX30/RK3328 USB2.0 PHY

Für RK3326S/PX30S am Ende des `soc_is_px30s()`-Zweigs von `rk3328_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
if (soc_is_px30s()) {
    .../* OTG/HOST PHY Tuning Code */
}
```

Für RK3326/PX30/RK3328 am Ende des else-Zweigs von `rk3328_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
if (soc_is_px30s()) {
    ...
} else {
    .../* OTG/HOST PHY Tuning Code */
}
```

### 13. RK3399 USB2.0 PHY

RK3399-USB2.0-Tuning vor `if (!of_property_read_bool(node, "rockchip,u2phy-tuning"))` in `rk3399_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen. TYPE-C0/HOST0 teilen PHY 0xe450, TYPE-C1/HOST1 PHY 0xe460. Vor dem Code die Registeradresse prüfen, um die vier Ports zu unterscheiden.

```text
if (rphy->phy_cfg->reg == 0xe450) {
    .../* TYPE-C0/HOST0 PHY Tuning Code */
} else {
    ... /* TYPE-C1/HOST1 PHY Tuning Code */
}
if (!of_property_read_bool(node, "rockchip,u2phy-tuning"))
    return ret;
```

### 14. RK3528 USB2.0 PHY

RK3528 USB2.0-Tuningcode in `rk3528_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk3528_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
}
```

### 15. RK3562 USB2.0 PHY

RK3562 USB2.0-Tuningcode in `rk3562_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rk3562_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* USB2.0 PHY Tuning Code */
]
```

### 16. RK3568/RK3566 USB2.0 PHY

RK3568/RK3566 teilen Code am Ende von `rk3568_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c`. RK3568-OTG/HOST1 teilen Basis 0xfe8a0000, HOST2/HOST3 0xfe8b0000. Basisadresse vor dem Code prüfen. OTG/HOST1:

```text
if (rphy->phy_cfg->reg == 0xfe8a0000) {
    ... /* OTG/Host1 PHY Tuning Code */
}
```

HOST2/HOST3-Code:

```text
if (rphy->phy_cfg->reg == 0xfe8b0000) {
    ... /* Host2/Host3 PHY Tuning Code */
}
```

### 17. RK3528/RK3562/RK3566/RK3568 USB3.1 PHY

RK3528-, RK3562- und RK3568-USB3.1-Code gehört in die jeweilige combphy_cfg-Funktion in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c`. RK3528-Einfügepunkt in `rk3528_combphy_cfg`:

```text
case PHY_TYPE_USB3:
    ...
    /* Enable adaptive CTLE for USB3.0 Rx */
    val = readl(priv->mmio + 0x200);
    val &= ~GENMASK(17, 17);
    val |= 0x01;
    writel(val, priv->mmio + 0x200);
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

RK3562-Einfügepunkt in `rk3562_combphy_cfg`:

```text
case PHY_TYPE_USB3:
    /* Set SSC downward spread spectrum */
    val = readl(priv->mmio + (0x1f << 2));
    val &= ~GENMASK(5, 4);
    val |= 0x01 << 4;
    writel(val, priv->mmio + 0x7c);
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

RK3566 und RK3568 teilen Code; an dieser Stelle in `rk3568_combphy_cfg` einfügen:

```text
case PHY_TYPE_USB3:
    ...
    /* Set PLL KVCO to min and set PLL charge pump current to max */
    writel(0xf0, priv->mmio + (0xa << 2));
    ...
    .../* USB3.1 PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_sel_usb, true);
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
```

### 18. RK3588 USB2.0 PHY

RK3588-USB2.0-Tuning in `rk3588_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen. TYPE-C0, TYPE-C1, HOST0 und HOST1 anhand `rphy->phy_cfg->reg` unterscheiden:

```text
if (rphy->phy_cfg->reg == 0x0000) {
    .../* TYPE-C0 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0x4000) {
    .../* TYPE-C1 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0x8000) {
    .../* HOST0 PHY Tuning Code */
} else if (rphy->phy_cfg->reg == 0xc000) {
    .../* HOST1 PHY Tuning Code */
}
```

### 19. RK3588 USB3.1 PHY

RK3588-USB3-OTG und USB3-HOST haben unterschiedliche Einfügepunkte. USB3-OTG besitzt noch keine dedizierte Tuningschnittstelle wie USB2.0; daher am Ende von `rk3588_udphy_init()` in `kernel/drivers/phy/rockchip/phy-rockchip-usbdp.c` einfügen.

```text
ret = rk3588_udphy_status_check(udphy);
if (ret)
    goto assert_phy;
    .../* USB3-OTG PHY Tuning Code */
return 0;
```

RK3588-USB3-HOST-Tuning in `rk3588_combphy_cfg()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c` einfügen.

```text
case PHY_TYPE_USB3:
    /* Set SSC downward spread spectrum */
    val = readl(priv->mmio + (0x1f << 2));
    val &= ~GENMASK(5, 4);
    val |= 0x01 << 4;
    ...
    .../* USB3-HOST PHY Tuning Code */
    ...
    param_write(priv->phy_grf, &cfg->pipe_txcomp_sel, false);
    param_write(priv->phy_grf, &cfg->pipe_txelec_sel, false);
    param_write(priv->phy_grf, &cfg->usb_mode_set, true);
    break;
```

### 20. RV1103/RV1106 USB2.0 PHY

RV1103/RV1106-Tuningcode in `rv1106_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-inno-usb2.c` einfügen.

```text
static int rv1106_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    .../* OTG PHY Tuning Code */
}
```

### 21. RV1109/RV1126 USB2.0 PHY

RV1109/RV1126-Tuningcode in `rv1126_usb2phy_tuning()` in `kernel/drivers/phy/rockchip/phy-rockchip-naneng-usb2.c` einfügen.

```text
static int rv1126_usb2phy_tuning(struct rockchip_usb2phy *rphy)
{
    if (rphy->phy_cfg->reg == 0xff4c0000) {
        .../* OTG PHY Tuning Code */
    }
    if (rphy->phy_cfg->reg == 0xff4c8000) {
        .../* HOST PHY Tuning Code */
    }
}
```

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## Quellen und Originalabbildungen

- Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf

### Originaloberflächen und Diagramme des Handbuchs

Oberflächen behalten ihre Quellsprache. Englische Originale werden verwendet, soweit vorhanden; zusätzliche Ansichten ohne englische Vorlage bleiben chinesisch. Werte sind Handbuchbeispiele, keine aktuellen Boardmessungen.

![Originalabbildung des Handbuchs: usb-sq-tool · p. 4 · 1](/assets/rockchip-tools/manuals/0ec9ef065fdc/p04-f01.png)

Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf · p. 4

![Originalabbildung des Handbuchs: usb-sq-tool · p. 5 · 1](/assets/rockchip-tools/manuals/0ec9ef065fdc/p05-f01.png)

Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf · p. 5

![Originalabbildung des Handbuchs: usb-sq-tool · p. 7 · 1](/assets/rockchip-tools/manuals/0ec9ef065fdc/p07-f01.png)

Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf · p. 7

![Originalabbildung des Handbuchs: usb-sq-tool · p. 9 · 1](/assets/rockchip-tools/manuals/0ec9ef065fdc/p09-f01.png)

Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf · p. 9

![Originalabbildung des Handbuchs: usb-sq-tool · p. 10 · 1](/assets/rockchip-tools/manuals/0ec9ef065fdc/p10-f01.png)

Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf · p. 10

![Originalabbildung des Handbuchs: usb-sq-tool · p. 12 · 1](/assets/rockchip-tools/manuals/0ec9ef065fdc/p12-f01.png)

Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf · p. 12

![Originalabbildung des Handbuchs: usb-sq-tool · p. 14 · 1](/assets/rockchip-tools/manuals/0ec9ef065fdc/p14-f01.png)

Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf · p. 14

![Originalabbildung des Handbuchs: usb-sq-tool · p. 15 · 1](/assets/rockchip-tools/manuals/0ec9ef065fdc/p15-f01.png)

Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf · p. 15

![Originalabbildung des Handbuchs: usb-sq-tool · p. 16 · 1](/assets/rockchip-tools/manuals/0ec9ef065fdc/p16-f01.png)

Rockchip_Introduction_USB_SQ_Tool_CN_V1.4.0.pdf · p. 16

## Verwandte Arbeitsabläufe

- [Rockchip USB SQ Tool: USB2.0-/USB3.1-PHY-Abstimmung und Codeintegration](/de/articles/165-rockchip-usb-sq-tool/)
- [PinDebug: IOMUX, GPIO und Spannungsdomänen auf Rockchip prüfen](/de/articles/rockchip-tool-pin-debug/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
