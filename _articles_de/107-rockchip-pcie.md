---
title: "Rockchip-PCIe-Entwicklerhandbuch: Ressourcen, DTS, EP, DMA, Debugging und Fehlersuche"
description: "Rockchip-PCIe-Entwicklerhandbuch: Ressourcen, DTS, EP, DMA, Debugging und Fehlersuche — V6.29.0"
excerpt: "Rockchip-PCIe-Entwicklerhandbuch: Ressourcen, DTS, EP, DMA, Debugging und Fehlersuche — V6.29.0"
translation_key: "107-rockchip-pcie"
slug: "107-rockchip-pcie"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "PCIe", "DMA", "Linux"]
---

{% raw %}

# Rockchip-PCIe-Entwicklerhandbuch: Ressourcen, DTS, EP, DMA, Debugging und Fehlersuche

Rockchip-Plattformreferenz, Quelle V6.29.0. SoC der ArmSoM-Platine, PCIe-Verdrahtung/PHY, SDK/BSP, Kernel, Peripherie und Versorgung prüfen; keine pauschale Platinenfreigabe. Beispiele, Register und Patches stammen aus der Quelle, ohne ArmSoM-Hardwarevalidierung. Chinesisch verwendet chinesische Bilder, andere Sprachen englische.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## Chip- und Kernelumfang der Quelle

<!-- Source PDF p.2: technical product-version table, not audience/revision history -->

| Chip | Kernelversion |
| --- | --- |
| RK1808 | 4.4, 4.19 |
| RK3528 | 4.19, 5.10, 6.1 |
| RK3562 | 5.10, 6.1 |
| RK3566/RK3568 | 4.19, 5.10, 6.1 |
| RK3576 | 6.1 |
| RK3588 | 5.4, 5.10, 6.1 |

RK3399 verwendet eine andere PCIe-Controller-IP und ist nicht abgedeckt; siehe Rockchip_RK3399_Developer_Guide_PCIe_CN.

<!-- en PDF p.11 -->

## 1. Chipressourcen

<!-- en PDF p.11 -->

Die vom jeweiligen Chipcontroller zuweisbaren BAR-Adressbereiche stehen unter Internal Address Mapping im PCIe-Kapitel des jeweiligen TRM. Suchbegriff: PCIe Outbound Memory. Die Controllertabelle enthält Base Address und Address Length sowohl für 32-Bit- als auch 64-Bit-BARs. Konfigurationsraum der Peripherie, I/O- und MEM-Raum teilen sich diesen Adressbereich; MEM unterstützt kein Prefetching.

<!-- en PDF p.11 -->

### 1.1 RK1808

<!-- en PDF p.11 -->

| Ressource | Modus | Lane-Aufteilung | DMA | IOMMU | ASPM | Anmerkungen | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 2 lane | RC/EP | Nein | 2 Lese- und 2 Schreibkanäle | Nein | L0s/L1 | Interner Takt | 65535 |

<!-- en PDF p.11 -->

### 1.2 RK3528

<!-- en PDF p.11 -->

| Ressource | Modus | Lane-Aufteilung | DMA | IOMMU | ASPM | Anmerkungen | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Nur RC | Nein | Nein | Nein | Alle | Interner Takt | 32 |

<!-- en PDF p.11 -->

### 1.3 RK3562

<!-- en PDF p.11 -->

| Ressource | Modus | Lane-Aufteilung | DMA | IOMMU | ASPM | Anmerkungen | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Nur RC | Nein | Nein | Nein | Alle | Interner Takt | 32 |

<!-- en PDF p.12 -->

### 1.4 RK3566

<!-- en PDF p.12 -->

| Ressource | Modus | Lane-Aufteilung | DMA | IOMMU | ASPM | Anmerkungen | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Nur RC | Nein | Nein | Nein | L0s/L1 | Interner Takt | 65535 |

<!-- en PDF p.12 -->

### 1.5 RK3568

<!-- en PDF p.12 -->

#### 1.5.1 Controller

<!-- en PDF p.12 -->

| Ressource | Modus | Lane-Aufteilung | DMA | IOMMU | ASPM | Anmerkungen | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Nur RC | Nein | Nein | Nein | L0s/L1 | Interner Takt | 65535 |
| PCIe Gen3 x 2 lane | RC/EP | 1 lane RC + 1 lane RC | 2 Lese- und 2 Schreibkanäle | Nein | Alle | Externer Oszillator, nur pcie30phy | 65535 |
| PCIe Gen3 x 1 lane | RC | 1 lane RC | Nein | Nein | Alle | Externer Oszillator, nur pcie30phy | 65535 |

<!-- en PDF p.12 -->

#### 1.5.2 PHY

<!-- en PDF p.12 -->

| Ressource | DTS-Knoten | Referenztakt | Aufteilung | Mehrfachnutzung |
| --- | --- | --- | --- | --- |
| pcie30phy | phy@fe8c0000 | Extern | 2Lane: Standard 1Lane + 1Lane: rockchip, bifurcation | Nur PCIe |
| combphy2_psq | phy@fe840000 | Intern/extern | - | Gemeinsam mit SATA/RGMII |

<!-- en PDF p.12 -->

Die zwei Lanes von pcie30phy arbeiten standardmäßig als PCIe Gen3 x2. Nach der Aufteilung erhalten die Controller PCIe Gen3 x2 und PCIe Gen3 x1 jeweils eine Lane. pcie30phy unterstützt getrennte Referenztakte mit SRNS ohne SSC. Die Konfiguration steht im Anhang „RK3568 pcie30phy SRNS Patch“. Die Signalqualität mit einem standardisierten Messaufbau und Peripherie-Stresstests sicherstellen.

<!-- en PDF p.13 -->

### 1.6 RK3576

<!-- en PDF p.13 -->

| Ressource | Modus | Lane-Aufteilung | DMA-Unterstützung | IOMMU-Unterstützung | ASPM-Unterstützung | Anmerkungen | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | Nur RC | Nein | Nein | Ja | Alle | Interner Takt | 32 |
| PCIe Gen2 x 1 lane | Nur RC | Nein | Nein | Ja | Alle | Interner Takt | 32 |

<!-- en PDF p.13 -->

### 1.7 RK3588

<!-- en PDF p.13 -->

RK3588 enthält fünf PCIe-Controller mit gleichem Hardware-IP, aber unterschiedlichen Konfigurationen. Der vierbahnige DM-Controller kann als EP arbeiten; der zweibahnige sowie die drei einbahnigen Controller nur als RC. Es gibt zwei PHY-Typen: PCIe 3.0 mit zwei Ports und insgesamt vier Lanes sowie drei einbahnige PCIe-2.0-PHYs, die mit SATA und USB gemeinsam genutzt werden. Der vierbahnige PCIe-3.0-PHY kann nach Bedarf geteilt werden. Danach die entsprechenden Controller konfigurieren. Alles erfolgt im DTS, ohne Treiberänderung. Einschränkungen:

<!-- en PDF p.13 -->

1. Nach der Aufteilung kann der PCIe-3.0-x4-Controller im Zweilane-Modus nur mit port0 und im Einlane-Modus nur mit port0 lane0 des PCIe-3.0-PHYs verbunden werden.

<!-- en PDF p.13 -->

2. Nach der Aufteilung kann der PCIe-3.0-x2-Controller im Zweilane-Modus nur mit port1 und im Einlane-Modus nur mit port1 lane0 verbunden werden.

<!-- en PDF p.13 -->

3. Bei Aufteilung in vier einzelne Lanes wird port0 lane1 ausschließlich mit PCIe 2 x1 l0 und port1 lane1 ausschließlich mit PCIe 2 x1 l1 verbunden.

<!-- en PDF p.13 -->

4. Der PCIe-3.0-x4-Controller kann als EP vier Lanes oder die zwei Lanes von port0 verwenden; die beiden Lanes von port1 können dann mit anderen Controllern als RC arbeiten. Bei gemeinsamem Referenztakt darf standardmäßig nicht lane0 von port0 als EP und gleichzeitig lane1 als RC mit einem anderen Controller arbeiten: Beide Lanes teilen denselben Eingangstakt, wodurch RC und EP in Konflikt geraten können.

<!-- en PDF p.13 -->

5. Wird nur ein Port des RK3588-PCIe-3.0-PHYs genutzt, muss der andere dennoch versorgt werden. Andere Signale wie refclk können an Masse gelegt werden.

<!-- en PDF p.14 -->

![Englische Originalabbildung — 14](/docs/rockchip-pcie/assets/en-p014-figure-01.png)

*Englische Originalabbildung — 14*

<!-- en PDF p.15 -->

#### 1.7.1 Controller

<!-- en PDF p.15 -->

| Ressource | Modus | DTS-Knoten | Verfügbarer PHY | Interner DMA | ASPM-Unterstützung | IOMMU-Unterstützung | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen3 x 4 lane | RC/EP | pcie3x4: pcie@fe150000 | pcie30phy | 2 Lese- und 2 Schreibkanäle | Alle | Ja | 63353 |
| PCIe Gen3 x 2 lane | Nur RC | pcie3x2: pcie@fe160000 | pcie30phy | Nein | Alle | Ja | 63353 |
| PCIe Gen3 x 1 lane | Nur RC | pcie2x1l0: pcie@fe170000 | pcie30phy, combphy1_ps | Nein | Alle | Ja | 63353 |
| PCIe Gen3 x 1 lane | Nur RC | pcie2x1l1: pcie@fe180000 | pcie30phy, combphy2_psu | Nein | Alle | Ja | 63353 |
| PCIe Gen3 x 1 lane | Nur RC | pcie2x1l2: pcie@fe190000 | combphy0_ps | Nein | Alle | Ja | 63353 |

<!-- en PDF p.15 -->

#### 1.7.2 PHY

<!-- en PDF p.15 -->

| Ressource | DTS-Knoten | Referenztakt | Aufteilung | Mehrfachnutzung |
| --- | --- | --- | --- | --- |
| pcie30phy | phy@fee80000 | Extern | 4Lane1: PHY_MODE_PCIE_AGGREGATION 2Lane+2Lane: PHY_MODE_PCIE_NANBNB 2Lane+1Lane+1Lane: PHY_MODE_PCIE_NANBBI 1Lane4: PHY_MODE_PCIE_NABIBI | Nur PCIe |
| combphy0_ps | phy@fee00000 | Intern/extern | - | Gemeinsam mit SATA |
| combphy1_ps | phy@fee10000 | Intern/extern | - | Gemeinsam mit SATA |
| combphy2_psu | phy@fee20000 | Intern/extern | - | Gemeinsam mit SATA/USB3 |

<!-- en PDF p.15 -->

pcie30phy unterstützt keine Architektur mit getrennten Referenztakten.

<!-- en PDF p.15 -->

### 1.8 RK3588S

<!-- en PDF p.15 -->

RK3588S besitzt zwei einbahnige Controller und zwei einbahnige comboPHYs für PCIe 2.0 mit eindeutiger Eins-zu-eins-Zuordnung.

<!-- en PDF p.16 -->

#### 1.8.1 Controller

<!-- en PDF p.16 -->

| Ressource | Modus | DTS-Knoten | Verfügbarer PHY | Interner DMA | ASPM | IOMMU | MSI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PCIe Gen3 x 1 lane | Nur RC | pcie2x1l1: pcie@fe180000 | combphy2_psu | Nein | Alle | Ja | 65535 |
| PCIe Gen3 x 1 lane | Nur RC | pcie2x1l2: pcie@fe190000 | combphy0_ps | Nein | Alle | Ja | 65535 |

<!-- en PDF p.16 -->

#### 1.8.2 PHY

<!-- en PDF p.16 -->

| Ressource | DTS-Knoten | Referenztakt | Aufteilung | Gemeinsam mit SATA/USB3 |
| --- | --- | --- | --- | --- |
| combphy0_ps | phy@fee00000 | Intern/extern | - | Gemeinsam mit SATA |
| combphy2_psu | phy@fee20000 | Intern/extern | - | Gemeinsam mit SATA/USB3 |

<!-- en PDF p.16 -->

## 2. DTS-Konfiguration

<!-- en PDF p.16 -->

### 2.1 Wesentliche Konfigurationsregeln

<!-- en PDF p.16 -->

Die PCIe-Konfiguration ist weitgehend fest; im Board-DTS sind nur wenige Variablen nötig. Wesentliche Punkte:

<!-- en PDF p.16 -->

1. Controller/PHY aktivieren: Nach Festlegung des Konzepts die passenden Komponenten gemäß Schaltplan aktivieren. Die Indizes müssen nicht übereinstimmen; RK3588 PCIe2x1l0 gehört beispielsweise nicht zu combphy0_ps.

<!-- en PDF p.16 -->

2. Einige Controller, etwa RK3588 PCIe2x1l0 und PCIe2x1l1, können mehrere PHYs nutzen. phys entsprechend dem Entwurf einstellen.

<!-- en PDF p.16 -->

3. Als RC wird normalerweise reset-gpios benötigt; dies entspricht PERSTn im PCIe-Schaltplan.

<!-- en PDF p.16 -->

4. Als RC kann vpcie3v3-supply erforderlich sein: der über das PCIe-PWREN-GPIO gesteuerte Festspannungsregler.

<!-- en PDF p.16 -->

5. Für EP-Betrieb compatible auf die entsprechende EP-Modus-Zeichenfolge ändern.

<!-- en PDF p.16 -->

6. PHY: PCIe30phy besitzt vier getrennt nutzbare Lanes. rockchip,pcie30-phymode entsprechend dem Entwurf setzen.

<!-- en PDF p.17 -->

### 2.2 RK1808 DTS-Konfiguration

<!-- en PDF p.17 -->

Für RK1808 enthält der EVB-Code des SDK DTS-Beispiele für alle Betriebsarten. Passende Tabellenvariante auswählen und die zugehörige Konfiguration in das Board-DTS des Produkts übernehmen.

<!-- en PDF p.17 -->

| Ressource | Modus | Referenzkonfiguration | Controllerknoten | PHY-Knoten | Anmerkungen |
| --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 2 lane | RC | rk1808-evb.dtsi | pcie0@fc400000 | combphy | usbdrd_dwc3 und usbdrd3 deaktivieren |
| PCIe Gen2 x 2 lane | EP | compatible = "rockchip,rk1808-pcie-ep", "snps,dw-pcie" im pcie0 von rk1808-evb.dtsi ergänzen; | pcie0@fc400000 | combphy | usbdrd_dwc3 und usbdrd3 deaktivieren |

<!-- en PDF p.17 -->

### 2.3 RK3528 DTS-Konfiguration

<!-- en PDF p.17 -->

Für RK3528 enthält der EVB-Code des SDK DTS-Beispiele für alle Betriebsarten. Passende Tabellenvariante auswählen und die zugehörige Konfiguration in das Board-DTS des Produkts übernehmen.

<!-- en PDF p.17 -->

| Ressource | Modus | Referenzkonfiguration | Controllerknoten | PHY-Knoten | Hinweis |
| --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3528-evb2-ddr3-v10.dtsi | pcie2x1@fe4f0000 | combphy_pu | - |

<!-- en PDF p.17 -->

### 2.4 RK356X DTS-Konfiguration

<!-- en PDF p.17 -->

Für RK356x enthält der EVB-Code des SDK DTS-Beispiele für alle Betriebsarten. Passende Tabellenvariante auswählen und die zugehörige Konfiguration in das Board-DTS des Produkts übernehmen.

<!-- en PDF p.17 -->

#### 2.4.1 RK3562 dts

<!-- en PDF p.17 -->

| Ressource | Modus | Referenzkonfiguration | Controllerknoten | PHY-Knoten |
| --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3562-evb1-lp4x-v10.dtsi | pcie2x1@ff500000 | combphy_pu |

<!-- en PDF p.18 -->

#### 2.4.2 RK3566 dts

<!-- en PDF p.18 -->

| Ressource | Modus | Referenzkonfiguration | Controllerknoten | PHY-Knoten |
| --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3566-evb1-ddr4-v10.dtsi | pcie2x1@fe260000 | combphy2_psq |

<!-- en PDF p.18 -->

#### 2.4.3 RK3568 dts

<!-- en PDF p.18 -->

| Ressource | Modus | Referenzkonfiguration | Controllerknoten | PHY-Knoten |
| --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3568-evb2-lp4x-v10.dtsi | pcie2x1@fe260000 | combphy2_psq |
| PCIe Gen3 x 2 lane | RC | rk3568-evb1-ddr4-v10.dtsi | pcie3x2@fe280000 | pcie30phy |
| PCIe Gen3 Aufteilung 1 lane + 1 lane | RC | rk3568-evb6-ddr3-v10.dtsi | pcie3x2@fe280000 pcie3x1@fe270000 | pcie30phy |
| PCIe Gen3 x 2 lane | EP | rk3568-iotest-ddr3-v10.dts | pcie3x2@fe280000 | pcie30phy |

<!-- en PDF p.18 -->

#### 2.4.4 RK3576 dts

<!-- en PDF p.18 -->

| Ressource | Modus | Referenzkonfiguration | Controllerknoten | PHY-Knoten |
| --- | --- | --- | --- | --- |
| PCIe Gen2 x 1 lane | RC | rk3576-test1.dtsi | pcie0@2a200000 | combphy0_ps |
| PCIe Gen2 x 1 lane | RC | rk3576-test1.dtsi | pcie1@2a210000 | combphy1_psu |

<!-- en PDF p.18 -->

### 2.5 RK3588 DTS-Konfiguration

<!-- en PDF p.18 -->

Die Kombinationen von RK3588-Controllern und PHYs sind zu zahlreich für eine vollständige Auflistung im EVB-Code. Nach den Grundregeln konfigurieren; typische Beispiele folgen. Wird der PCIe-3.0-PHY aufgeteilt, müssen alle beteiligten Controller gemeinsam über den Versorgungsknoten den Enable-Pin des Referenztaktchips steuern. Möglichkeiten:

<!-- en PDF p.18 -->

1. Eine gemeinsame vpcie3v3-supply-Referenz für alle Controller; oder

<!-- en PDF p.18 -->

2. regulator-always-on und regulator-boot-on im vpcie3v3-supply-Knoten setzen. Andernfalls das Enable-Signal hardwareseitig dauerhaft aktiv verdrahten.

<!-- en PDF p.19 -->

#### 2.5.1 Beispiel 1: PCIe 3.0 x4 RC und zwei PCIe-2.0-comboPHYs (RK3588 EVB1)

<!-- en PDF p.19 -->

```text
/ {
    vcc3v3_pcie30: vcc3v3-pcie30 {
        compatible = "regulator-fixed";
        regulator-name = "vcc3v3_pcie30";
        regulator-min-microvolt = <3300000>;
        regulator-max-microvolt = <3300000>;
        enable-active-high;
        gpios = <&gpio3 RK_PC3 GPIO_ACTIVE_HIGH>;
        startup-delay-us = <5000>;
        vin-supply = <&vcc12v_dcin>;
    };
};

&combphy1_ps {
    status = "okay";
};

&combphy2_psu {
    status = "okay";
};

&pcie2x1l0 {
    phys = <&combphy1_ps PHY_TYPE_PCIE>;
    reset-gpios = <&gpio4 RK_PA5 GPIO_ACTIVE_HIGH>;
    status = "okay";
};

&pcie2x1l1 {
    phys = <&combphy2_psu PHY_TYPE_PCIE>;
    reset-gpios = <&gpio4 RK_PA2 GPIO_ACTIVE_HIGH>;
    pinctrl-names = "default";
    pinctrl-0 = <&rtl8111_isolate>;
    status = "okay";
};

&pcie30phy {
    rockchip,pcie30-phymode = <PHY_MODE_PCIE_AGGREGATION>;
    status = "okay";
};

&pcie3x4 {
    reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};
```

<!-- en PDF p.20 -->

#### 2.5.2 Beispiel 2: PCIe-3.0-PHY in zwei x2-RCs, drei PCIe-2.0-x1-comboPHYs

<!-- en PDF p.20 -->

```text
/ {
    vcc3v3_pcie30: vcc3v3-pcie30 {
        compatible = "regulator-fixed";
        regulator-name = "vcc3v3_pcie30";
        regulator-min-microvolt = <3300000>;
        regulator-max-microvolt = <3300000>;
        enable-active-high;
        gpios = <&gpio3 RK_PC3 GPIO_ACTIVE_HIGH>;
        startup-delay-us = <5000>;
        vin-supply = <&vcc12v_dcin>;
    };
};

&combphy0_ps {
    status = "okay";
};

&combphy1_ps {
    status = "okay";
};

&combphy2_psu {
    status = "okay";
};

&pcie2x1l0 {
    phys = <&combphy1_ps PHY_TYPE_PCIE>;
    reset-gpios = <&gpio4 RK_PA5 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie2x1l1 {
    phys = <&combphy2_psu PHY_TYPE_PCIE>;
    reset-gpios = <&gpio4 RK_PA2 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie2x1l2 {
    reset-gpios = <&gpio4 RK_PC1 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie30phy {
    rockchip,pcie30-phymode = <PHY_MODE_PCIE_NANBNB>;
    status = "okay";
};
&pcie3x2 {
    reset-gpios = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie3x4 {
    num-lanes = <2>;
    reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};
```

<!-- en PDF p.21 -->

#### 2.5.3 Beispiel 3: PCIe-3.0-PHY in vier x1, ein PCIe-2.0-x1-comboPHY

<!-- en PDF p.21 -->

Hardwareseitig sind pcie2x1l0/pcie2x1l1 mit den entsprechenden TX/RX-Signalen des PCIe-3.0-PHYs verbunden; im DTS werden combphy1_ps/combphy2_psu deaktiviert. Referenzcode:

<!-- en PDF p.21 -->

```text
/ {
    vcc3v3_pcie30: vcc3v3-pcie30 {
        compatible = "regulator-fixed";
        regulator-name = "vcc3v3_pcie30";
        regulator-min-microvolt = <3300000>;
        regulator-max-microvolt = <3300000>;
        enable-active-high;
        gpios = <&gpio3 RK_PC3 GPIO_ACTIVE_HIGH>;
        startup-delay-us = <5000>;
        vin-supply = <&vcc12v_dcin>;
    };
};

&combphy0_ps {
    status = "okay";
};

&pcie2x1l0 {
    phys = <&pcie30phy>;
    reset-gpios = <&gpio4 RK_PA5 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie2x1l1 {
    phys = <&pcie30phy>;
    reset-gpios = <&gpio4 RK_PA2 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie2x1l2 {
    reset-gpios = <&gpio4 RK_PC1 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie30phy {
    rockchip,pcie30-phymode = <PHY_MODE_PCIE_NABIBI>;
    status = "okay";
};

&pcie3x2 {
    num-lanes = <1>;
    reset-gpios = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};

&pcie3x4 {
    num-lanes = <1>;
    reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_HIGH>;
    vpcie3v3-supply = <&vcc3v3_pcie30>;
    status = "okay";
};
```

<!-- en PDF p.22 -->

#### 2.5.4 IOMMU aktivieren

<!-- en PDF p.22 -->

PCIe-IOMMU-Konfiguration ergänzen.

<!-- en PDF p.22 -->

```text
# Enable PCIe IOMMU
--- a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
@@ -3370,7 +3370,7 @@
mmu600_pcie: iommu@fc900000 {
    compatible = "arm,smmu-v3";
    reg = <0x0 0xfc900000 0x0 0x200000>;
    interrupts = <GIC_SPI 369 IRQ_TYPE_LEVEL_HIGH>,
                <GIC_SPI 371 IRQ_TYPE_LEVEL_HIGH>,
                <GIC_SPI 374 IRQ_TYPE_LEVEL_HIGH>,
                <GIC_SPI 367 IRQ_TYPE_LEVEL_HIGH>;
                interrupt-names = "eventq", "gerror", "priq", "cmdq-sync";
                #iommu-cells = <1>;
-               status = "disabled";
+               status = "okay";
};

# Controllers requiring IOMMU should reference iommu-map as needed, ensuring numerical matching with msi-map
--- a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
@@ -548,6 +548,7 @@
                num-viewport = <8>;
                max-link-speed = <3>;
                msi-map = <0x0000 &its1 0x0000 0x1000>;
+               iommu-map = <0x0000 &mmu600_pcie 0x0000 0x1000>;
                num-lanes = <4>;
                phys = <&pcie30phy>;
                phy-names = "pcie-phy";
@@ -603,6 +604,7 @@
                num-viewport = <8>;
                max-link-speed = <3>;
                msi-map = <0x1000 &its1 0x1000 0x1000>;
+               iommu-map = <0x1000 &mmu600_pcie 0x1000 0x1000>;
                num-lanes = <2>;
                phys = <&pcie30phy>;
                phy-names = "pcie-phy";
@@ -658,6 +660,7 @@
                num-viewport = <4>;
                max-link-speed = <2>;
                msi-map = <0x2000 &its0 0x2000 0x1000>;
+               iommu-map = <0x2000 &mmu600_pcie 0x2000 0x1000>;
                num-lanes = <1>;
                phys = <&combphy1_ps PHY_TYPE_PCIE>;
                phy-names = "pcie-phy";
diff --git a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
index 9e19b61..b77a073 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
@@ -6319,6 +6319,7 @@
                num-viewport = <4>;
                max-link-speed = <2>;
                msi-map = <0x3000 &its0 0x3000 0x1000>;
+               iommu-map = <0x3000 &mmu600_pcie 0x3000 0x1000>;
                num-lanes = <1>;
                phys = <&combphy2_psu PHY_TYPE_PCIE>;
                phy-names = "pcie-phy";
@@ -6373,6 +6374,7 @@
                num-viewport = <4>;
                max-link-speed = <2>;
                msi-map = <0x4000 &its0 0x4000 0x1000>;
+               iommu-map = <0x4000 &mmu600_pcie 0x4000 0x1000>;
                num-lanes = <1>;
                phys = <&combphy0_ps PHY_TYPE_PCIE>;
                phy-names = "pcie-phy";
```

<!-- en PDF p.23 -->

Kernel5.10_PCIe_MMU_support.zip oder Kernel6.1_PCIe_MMU_support.zip über die Ressourcenadresse im Anhang beziehen und die enthaltenen Patches anwenden. Ältere Linux-Kernel unterstützen nicht gleichzeitig mehrere IOMMU-Systemversionen; deshalb enthält der Patch angepasste Änderungen. Werden Grafik- und Multimedia-IPs nicht benötigt, können die Patches entfallen und CONFIG_ROCKCHIP_IOMMU deaktiviert werden.

<!-- en PDF p.24 -->

### 2.6 DTS-Eigenschaften

<!-- en PDF p.24 -->

#### 2.6.1 Allgemeine Controller-DTS-Eigenschaften

<!-- en PDF p.24 -->

1. compatible = <?>; optional zur Auswahl von RC oder EP. RK3568 als RC: compatible = "rockchip,rk3568-pcie", "snps,dw-pcie"; als EP: compatible = "rockchip,rk3568-pcie-ep", "snps,dw-pcie". Für RK1808/RK3588 entsprechend rk3568 durch rk1808/rk3588 ersetzen.

<!-- en PDF p.24 -->

2. reset-gpios = <&gpio3 13 GPIO_ACTIVE_HIGH>; obligatorisch für das PERSTN-Resetsignal. Sowohl bei Steckkarten als auch verlöteter Peripherie den richtigen Pin im Schaltplan ermitteln, sonst kann der Link instabil sein. Nach Lane-Aufteilung braucht jeder Knoten eine eigene PERSTN-Leitung.

<!-- en PDF p.24 -->

3. num-lanes = <4>; optional, legt die Lane-Anzahl des PCIe-Geräts fest. Bereits im Chip-dtsi vorkonfiguriert und normalerweise unverändert zu lassen. Bei aufteilbarem PHY entsprechend der tatsächlichen Hardware einstellen.

<!-- en PDF p.24 -->

4. max-link-speed = <2>; optional: 1 bedeutet Gen1, 2 Gen2, 3 Gen3. Chipabhängig und bereits im Chip-dtsi gesetzt, daher normalerweise keine boardspezifische Anpassung nötig. Dient als Testmittel oder zur Herabstufung bei Boardproblemen.

<!-- en PDF p.24 -->

5. status = <okay>; obligatorisch gleichzeitig im Controller- und zugehörigen PHY-Knoten aktivieren.

<!-- en PDF p.24 -->

6. vpcie3v3-supply = <&vdd_pcie3v3>; optional für die 3V3-Versorgung der Peripherie. Im Herstellerreferenzschaltplan werden 12V und 3V3 des Slots gemeinsam geschaltet, sodass die 3V3-Konfiguration auch 12V steuert. Bei boardspezifischer 3V3-Steuerung einen passenden Regler definieren; siehe Documentation/devicetree/bindings/regulator/.

<!-- en PDF p.25 -->

Für PCIe 3.0 wird gewöhnlich ein externer 100M-Taktchip benötigt, dessen Versorgung im Hardwareentwurf mit 3V3 der Peripherie verbunden ist. Deshalb neben der Peripherieversorgung auch den Taktausgang prüfen. Der Generator benötigt Einschwingzeit: Den Mindestwert seines Datenblatts einhalten und startup-delay-us mit geprüfter Reserve im Versorgungsknoten festlegen. Bei langsamer Entladung nach Abschaltung zusätzlich off-on-delay-us setzen, damit vollständige Aus-/Einschaltzyklen gewährleistet sind. RK3568-Beispiel: vcc3v3_pcie in rk3568-evb1-ddr4-v10.dtsi.

<!-- en PDF p.25 -->

7. phys; optionale phandle-Referenz auf den Controller-PHY. Einige Controller können mehrere PHYs ansteuern, etwa RK3588 pcie2x1l0/pcie2x1l1. Die Referenzierung kann sich je nach PHY unterscheiden; bei comboPHY zusätzlich die Betriebsart angeben:

<!-- en PDF p.25 -->

```text
phys = <&pcie30phy>;
phys = <&combphy1_ps PHY_TYPE_PCIE>;
```

<!-- en PDF p.25 -->

8. rockchip,bifurcation; optionale RK3568-spezifische Eigenschaft. Teilt die beiden Lanes von pcie3x2 auf zwei einbahnige Controller auf. Im DTS pcie3x1, pcie3x2 und pcie30phy aktivieren und beiden Controllern rockchip,bifurcation hinzufügen; siehe rk3568-evb6-ddr3-v10.dtsi. Andernfalls ist pcie3x1 standardmäßig nicht nutzbar. Lane0 gehört zu pcie3x2, lane1 zu pcie3x1; die Verdrahtung muss dem Herstellerplan entsprechen. Beide Controller müssen gleichzeitig als RC arbeiten. Bei zwei verschiedenen Peripheriegeräten bleiben Taktchip und Versorgung gemeinsam. vpcie3v3-supply nicht nur einem Controller zuweisen: Dessen Kontrolle über 3V3 könnte die Initialisierung am anderen Controller stören. Für den zugehörigen Regler regulator-boot-on und regulator-always-on setzen.

<!-- en PDF p.25 -->

9. prsnt-gpios = <&gpio4 15 GPIO_ACTIVE_LOW>; optional zur Erkennung angeschlossener Peripherie und der zugehörigen Schaltung. Laut Quelltext wird bei erkanntem wirksamem Pegel die Geräteerkennung übersprungen. Nach der elektrischen PCIe-Spezifikation bedeutet Low ein angeschlossenes Gerät. Bei umgekehrter Boardlogik GPIO_ACTIVE_HIGH verwenden. Das Signal ermöglicht eine gemeinsame Software für Boardvarianten mit und ohne PCIe3 und vermeidet rcu stall während der Controllerinitialisierung.

<!-- en PDF p.25 -->

10. rockchip,perst-inactive-ms = <500>;

<!-- en PDF p.26 -->

Optionale #PERST-Resetzeit in Millisekunden. Die PCIe Express Card Electromechanical Spec verlangt mindestens 100ms zwischen stabiler Versorgung des nachgelagerten Geräts und Freigabe von #PERST. Ohne Eigenschaft verwendet der RK-Treiber 200ms. Reicht dies für die Peripherie nicht, anhand tatsächlicher Messungen anpassen.

<!-- en PDF p.26 -->

11. rockchip,s2r-perst-inactive-ms = <1>; optionale #PERST-Zeit beim Aufwachen in Millisekunden. Ohne Angabe gilt rockchip,perst-inactive-ms. Bleibt Peripherie wie Wi-Fi im Schlaf versorgt, liegt #PERST bereits im Reset; beim Aufwachen kann die Zeit daher bis auf 0 verkürzt werden.

<!-- en PDF p.26 -->

12. rockchip,wait-for-link-ms = <1>; optionale Wartezeit nach Freigabe von #PERST in Millisekunden. Verhindert Zeitüberschreitungen bei Peripherie mit langer interner Initialisierung, typischerweise FPGA und einigen KI-Beschleunigerkarten.

<!-- en PDF p.26 -->

13. supports-clkreq; optional, nur RC. CLKREQN pinctrl iomux muss als Funktions-IO konfiguriert sein. Die Eigenschaft meldet eine CLKREQN-Leitung vom Root-Port zum nachgelagerten Gerät, die der Hostbrückentreiber berücksichtigt. Ohne CLKREQN wird der Root-Port beispielsweise ohne PM-L1-Substates-Unterstützung eingestellt.

<!-- en PDF p.26 -->

14. rockchip,lpbk-master; spezielle Debug-Einstellung für Signal-Loopbacktests. Der Controller simuliert einen Loopback-Master und versetzt das Prüfgerät in den Slave-Modus. Nur für Labor-RX-Looptests verwenden; bei Gen3 kann Compliance Mode als Loopback-Slave nötig sein. Gehört Loopback nicht zur Aufgabe, diese Eigenschaft nicht setzen.

<!-- en PDF p.26 -->

15. rockchip,compliance-mode; spezielle Signalkonformitätsprüfung, die den Controller in den Compliance-Test versetzt oder mit SMA-Prüfvorrichtung ohne Abschalten in den Test eintritt. Das zweielementige Array enthält Modus und Preset. Für SMA wird rockchip,compliance-mode=<0 0>; empfohlen. Bei verlöteter Peripherie Modus und Preset festlegen: rockchip,compliance-mode=<mode preset>;. Mode 1/2/3 steht für 2.5GT/5.0GT/8GT. Nur bei 5GT und 8GT gelten Preset-Werte 0–10 für P0–P10 und die entsprechenden Protokoll-Preemphasis-Einstellungen; siehe PCIe TX Emphasis Preset im Anhang.

<!-- en PDF p.26 -->

16. rockchip,keep-power-in-suspend

<!-- en PDF p.27 -->

Optional, nur RC. Peripherie im Schlaf weder abschalten noch zurücksetzen, damit sie nach dem Einschlafen des Systems autonom weiterarbeiten kann. Der pcie-Knoten muss zudem vpcie3v3-supply referenzieren.

<!-- en PDF p.27 -->

#### 2.6.2 comboPHY-DTS-Konfiguration

<!-- en PDF p.27 -->

Die folgenden Einstellungen gelten nicht für RK1808 combphy. Die Knotennummer bezeichnet den Mux, das Suffix die Mehrfachnutzung: p, s, u, q stehen für PCIe, SATA, USB, QSGMII.

<!-- en PDF p.27 -->

1. rockchip,ext-refclk; spezielle Einstellung nur für combophy. combphy verwendet standardmäßig den internen SoC-Takt, beispielsweise 24MHz in rk3568.dtsi für RK356X. Unterstützt werden auch 25M und 100M; assigned-clock-rates = <24000000> auf die gewünschte Frequenz ändern. Der interne Takt ist am kostengünstigsten und SDK-Standard. Ein externer Generator bleibt möglich: rockchip,ext-refclk im von PCIe verwendeten Board-DTS-combphy-Knoten ergänzen und mit assigned-clock-rates die externe Eingangsfrequenz angeben. Zulässig sind ausschließlich 24M, 25M, 100M.

<!-- en PDF p.27 -->

2. rockchip,enable-ssc; spezielle Einstellung des PCIe-combphy. Standardmäßig verwendet der combophy-Ausgangstakt kein Spread Spectrum. Bei EMI-Problemen kann diese Eigenschaft im passenden combphy-Knoten versuchsweise SSC aktivieren.

<!-- en PDF p.27 -->

#### 2.6.3 PCIe30-PHY-DTS-Konfiguration

<!-- en PDF p.27 -->

1. rockchip,pcie30-phymode; optionale Einstellung der PCIe30-PHY-Kombination, standardmäßig vier gemeinsam genutzte Lanes. Zulässige Modi stehen in include/dt-bindings/phy/phy-snps-pcie3.h:

<!-- en PDF p.28 -->

```text
/*
 * pcie30_phy_mode[2:0]
 * bit2: aggregation
 * bit1: bifurcation for port 1
 * bit0: bifurcation for port 0
 */
#define PHY_MODE_PCIE_AGGREGATION 4 /* PCIe3x4 */
#define PHY_MODE_PCIE_NANBNB    0   /* P1:PCIe3x2  +  P0:PCIe3x2 */
#define PHY_MODE_PCIE_NANBBI    1   /* P1:PCIe3x2  +  P0:PCIe3x1*2 */
#define PHY_MODE_PCIE_NABINB    2   /* P1:PCIe3x1*2 + P0:PCIe3x2 */
#define PHY_MODE_PCIE_NABIBI    3   /* P1:PCIe3x1*2 + P0:PCIe3x1*2 */
```

<!-- en PDF p.28 -->

### 2.7 DTS anhand des Schaltplans erstellen

<!-- en PDF p.28 -->

#### 2.7.1 Langsame IO-Signale

<!-- en PDF p.28 -->

Neben Datenleitungen und differentiellen Referenztaktpaaren kann PCIe folgende langsame IO-Signale verwenden:

<!-- en PDF p.28 -->

| Name des langsamen IO | Funktion | Beschreibung |
| --- | --- | --- |
| PERSTN | GPIO-Ausgang | Obligatorisch, DTS-Eigenschaft reset-gpios |
| WAKEN | GPIO-Eingang der PMU-Domäne | Optional: Funktionstreiber registriert GPIO-Interrupt und Weckquelle; nicht vom PCIe-Controllertreiber behandelt |
| PWREN | GPIO-Ausgang | Optional, DTS vpcie3v3-supply |
| CLKREQN | Funktion | Optional, für L1SS DTS supports-clkreq setzen |
| PRSNTN | GPIO-Eingang | Optional, DTS prsnt-gpios |

<!-- en PDF p.28 -->

CLKREQN nutzt die PCIe-Funktion und wird nur für L1SS benötigt; sonst kann es unverbunden bleiben. Bei Nutzung die passende DTS-Eigenschaft ergänzen. GPIO-Pins nicht als PCIe-Funktion in pinctrl konfigurieren; siehe die jeweilige DTS-Konfiguration. PERSTN ist vom Protokoll vorgeschrieben, andere Signale sind projektabhängig. EP-Pins beschreibt Rockchip_Developer_Guide_PCIE_EP_Standard_Card_CN.

<!-- en PDF p.29 -->

#### 2.7.2 DTS-Konfigurationsverfahren

<!-- en PDF p.29 -->

Schaltpläne beschreiben Hardware über IO-Signale, die eng mit dem PHY-Index zusammenhängen. Controller- und PHY-Indizes des RK3588 können abweichen; daher beim Zuordnen zum DTS besonders aufpassen. Empfohlene Reihenfolge:

<!-- en PDF p.29 -->

1. Mit der Hardwareentwicklung Geräteanzahl und Zuordnung der PCIe-Schnittstellen klären.

<!-- en PDF p.29 -->

2. Im Schaltplan den PHY der Gerätedatenleitungen ermitteln.

<!-- en PDF p.29 -->

3. Controller und PHY des Geräts ermitteln und im DTS aktivieren.

<!-- en PDF p.29 -->

4. phy-Eigenschaft und Controllermodus im DTS prüfen; pcie2x1ln muss beispielsweise comboPHY und PHY_TYPE_PCIE auswählen.

<!-- en PDF p.29 -->

5. ComboPHY kann von SATA, USB, RGMII und weiteren Controllern gemeinsam genutzt werden. Die entsprechenden anderen Controller im DTS deaktivieren.

<!-- en PDF p.29 -->

6. Mehrere PHY-Betriebsarten und korrekte Einstellung prüfen; verschiedene pcie30phy-Aufteilungen brauchen den passenden Modus.

<!-- en PDF p.29 -->

7. PERSTn-GPIO der Schnittstelle ermitteln und im Controller-DTS korrekt setzen.

<!-- en PDF p.29 -->

8. PWREN-Steuer-GPIO ermitteln und im Controller-DTS setzen; die Einstellung kann auch im DTS der Onboard-Peripherie stehen.

<!-- en PDF p.29 -->

9. Weitere für die Peripherie erforderliche Hardware konfigurieren. Die Abbildung zeigt RK3588 pcie30phy und mögliche Controller: Rot bezeichnet Controller, Rosa PHY-Signale, Grün Peripheriesignale. Den tatsächlichen Controller anhand der Verbindungen oder mit der Hardwareentwicklung bestimmen. RK3588 evb1 besitzt einen PCIe3.0-x4-Slot, daher wird PCIe30X4 (DTS pcie3x4) verwendet; die anderen Controller nutzen diesen PHY nicht.

<!-- en PDF p.30 -->

![Englische Originalabbildung — 30](/docs/rockchip-pcie/assets/en-p030-figure-01.png)

*Englische Originalabbildung — 30*

<!-- en PDF p.30 -->

Abbildung des RK3588 comboPHY: Rot steht für Controller, Rosa für PHY, Grün für Peripherie. Die Zuordnung anhand der Verbindungen oder mit der Hardwareentwicklung bestätigen. Mux0-PHY combphy0_ps arbeitet als SATA, nicht PCIe. Mux1 combphy1_ps gehört zu PCIe30x1_0 (DTS pcie2x1l0) und kann abhängig vom angeschlossenen Gerät als PCIe arbeiten. Mux2 combphy2_psu gehört zu PCIe30x1_1 (DTS pcie2x1l1) und arbeitet als PCIe für eine Netzwerkkarte.

<!-- en PDF p.31 -->

![Englische Originalabbildung — 31](/docs/rockchip-pcie/assets/en-p031-figure-01.png)

*Englische Originalabbildung — 31*

<!-- en PDF p.31 -->

PCIe3.0-Versorgung des RK3588 evb1: Über PCIE30X4_PWREN_H das RK3588-GPIO ermitteln und im pcie3x4-Controller-DTS eintragen.

<!-- en PDF p.32 -->

![Englische Originalabbildung — 32](/docs/rockchip-pcie/assets/en-p032-figure-01.png)

*Englische Originalabbildung — 32*

<!-- en PDF p.32 -->

### 2.8 Wi-Fi-Device-Tree-Beispiel

<!-- en PDF p.32 -->

Wi-Fi wird meist über PCIe2.0 angeschlossen. Dessen combphy-Multiplexing ist komplex; Versorgung, Schlafmodus und Reset unterscheiden sich von anderer Peripherie. Folgendes Device-Tree-Beispiel dient als Referenz.

<!-- en PDF p.32 -->

1. Den Wi-Fi-combphy im Schaltplan bestimmen. Die Knotennummer bezeichnet Mux, p/s/u/q stehen für PCIe/SATA/USB/QSGMII. Im Beispiel liegt Wi-Fi an PCIE20/SATA30 Mux0; daher combphy0_ps konfigurieren.

<!-- en PDF p.33 -->

![Englische Originalabbildung — 33](/docs/rockchip-pcie/assets/en-p033-figure-01.png)

*Englische Originalabbildung — 33*

<!-- en PDF p.33 -->

2. Im DTS andere Controller dieses combphy deaktivieren, um Signalstörungen zu vermeiden.

<!-- en PDF p.33 -->

3. wifi_reg_on aus wireless_wlan in den PCIe-3.3v-Versorgungsknoten verschieben.

<!-- en PDF p.33 -->

4. Für den Wi-Fi-L1.x-Energiesparmodus siehe RC mode PM L1 Substates Support.

<!-- en PDF p.33 -->

5. Für drahtloses Aufwecken muss wifi_reg_on im Schlaf High bleiben; wifi_host_wake an ein weiter versorgtes PMU-IO anschließen, das den Host per Interrupt weckt. Hardware- und Softwaredetails stehen in Rockchip_Developer_Guide_Linux_WIFI_BT_CN.pdf des SDK.

<!-- en PDF p.33 -->

```text
+ vcc3v3_pcie20_wifi: vcc3v3-pcie20-wifi {
+     compatible = "regulator-fixed";
+     regulator-name = "vcc3v3_pcie20_wifi";
+     regulator-min-microvolt = <3300000>;
+     regulator-max-microvolt = <3300000>;
+     enable-active-high;
+    /*
+     * wifi_reg_on is enabled after vbat and vddio are stable, pulled high before reset-gpios, so
+     * it is placed in the PCIe power node to meet the module timing, referring to wifi_poweren_gpio.
+     */
+     pinctrl-0 = <&wifi_poweren_gpio>;
+     startup-delay-us = <5000>;
+     vin-supply = <&vcc12v_dcin>;
+   };

    wireless_wlan: wireless-wlan {
        compatible = "wlan-platdata";
        wifi_chip_type = "ap6275p";
        pinctrl-names = "default";
        pinctrl-0 = <&wifi_host_wake_irq>;
        WIFI,host_wake_irq = <&gpio0 RK_PA0 GPIO_ACTIVE_HIGH>;
+       /* Note: The wifi_reg_on pin also needs to be configured here for the WiFi driver to control */
+       WIFI,poweren_gpio = <&gpio0 RK_PC7 GPIO_ACTIVE_HIGH>;
        status = "okay";
    };
+
+&sata0 {
+    status = "disabled" /* sata0 and pcie2x1l2 share combphy0_ps, ensure it is disabled */
+}
+
+&combphy0_ps {
+    status = "okay"; /* Ensure phy is enabled */
+};
+
+&pcie2x1l2 {
+    reset-gpios = <&gpio3 RK_PD1 GPIO_ACTIVE_HIGH>;
+    rockchip,skip-scan-in-resume;
+    rockchip,perst-inactive-ms = <500>; /* Refer to the Wi-Fi module manual for the required #PERST reset time */
+    vpcie3v3-supply = <&vcc3v3_pcie20_wifi>;
+    status = "okay";
+};

&pinctrl {
     wireless-wlan {
         wifi_poweren_gpio: wifi-poweren-gpio {
+            //PCIE REG ON: Be sure to configure it as pull-up
+            rockchip,pins = <0 RK_PC7 RK_FUNC_GPIO &pcfg_pull_up>;
         };
     };
};
```

<!-- en PDF p.34 -->

## 3. menuconfig-Konfiguration

<!-- en PDF p.34 -->

1. Für korrekte PCIe-Funktion folgende Konfigurationen aktivieren:

<!-- en PDF p.34 -->

```text
CONFIG_PCI=y
CONFIG_PCI_DOMAINS=y
CONFIG_PCI_DOMAINS_GENERIC=y
CONFIG_PCI_SYSCALL=y
CONFIG_PCI_BUS_ADDR_T_64BIT=y
CONFIG_PCI_MSI=y
CONFIG_PCI_MSI_IRQ_DOMAIN=y
CONFIG_PHY_ROCKCHIP_SNPS_PCIE3=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
CONFIG_PCIE_DW=y
CONFIG_PCIE_DW_HOST=y
CONFIG_PCIE_DW_ROCKCHIP=y
CONFIG_PCIEPORTBUS=y
CONFIG_PCIE_PME=y
CONFIG_GENERIC_MSI_IRQ=y
CONFIG_GENERIC_MSI_IRQ_DOMAIN=y
CONFIG_IRQ_DOMAIN=y
CONFIG_IRQ_DOMAIN_HIERARCHY=y
```

<!-- en PDF p.35 -->

2. NVMe (PCIe-SSDs), PCIe-AHCI (SATA) und PCIe-USB (XHCI) sind im Standardconfig aktiviert; dies überprüfen. Für Ethernet, Wi-Fi und andere Geräte die jeweiligen Einstellungen gesondert prüfen.

<!-- en PDF p.35 -->

```text
CONFIG_BLK_DEV_NVME=y
CONFIG_SATA_PMP=y
CONFIG_SATA_AHCI=y
CONFIG_SATA_AHCI_PLATFORM=y
CONFIG_ATA_SFF=y
CONFIG_ATA=y
CONFIG_USB_XHCI_PCI=y
CONFIG_USB_XHCI_HCD=y
```

<!-- en PDF p.35 -->

Der Standardkernel unterstützt nur die in drivers/ata/ahci.c aufgeführten PCIe-SATA-Geräte. Für andere Geräte Unterstützung beim Hersteller oder Händler einholen.

<!-- en PDF p.35 -->

## 4. Standard-EP-Funktion entwickeln

<!-- en PDF p.35 -->

Der PCIe-Controller der RK-Chips unterstützt EP-Betrieb und ermöglicht standardkonforme PCIe-EP-Produkte. Die Implementierung beschreibt Rockchip_Developer_Guide_PCIE_EP_Standard_Card.

<!-- en PDF p.35 -->

## 5. PM L1 Substates im RC-Modus

<!-- en PDF p.35 -->

Unterstützen RK-Controller und Peripherie PM L1 Substates, lässt sich damit der Verbrauch senken. Unterstützt ein Zielgerät die Funktion nicht, insbesondere bei Slots mit wechselnden Geräten, darf sie nicht aktiviert werden, da manche Geräte sonst nicht korrekt funktionieren.

<!-- en PDF p.36 -->

Tpower_on von RK PCIe L1SS ist kleiner als 10us und nicht einstellbar; theoretisch ist dies mit den meisten Geräten kompatibel. Strenge gerätespezifische Vorgaben beim Hersteller bestätigen. Bei internem Referenztakt CLKREQN von RC und EP verbinden. Bei externem Takt CLKREQN des RC mit OE von CLOCK_GEN verbinden; bei High-aktivem OE einen Inverter ergänzen.

<!-- en PDF p.36 -->

![Englische Originalabbildung — 36](/docs/rockchip-pcie/assets/en-p036-figure-01.png)

*Englische Originalabbildung — 36*

<!-- en PDF p.36 -->

PM L1 Substates ist standardmäßig aus: kein supports-clkreq; im DTS und CONFIG_PCIEASPM_POWER_SUPERSAVE=n.

<!-- en PDF p.37 -->

Zum Aktivieren RC-/EP-Unterstützung bestätigen; RC-Unterstützung steht in der ASPM-Spalte der Chipressourcen. CLKREQN gemäß PM-L1-Substates-Schaltung anschließen, dessen iomux als Funktions-IO setzen und supports-clkreq; im Controller ergänzen (die Quelle verweist auf DTS-Punkt 11). Methode 1: CONFIG_PCIEASPM_POWER_SUPERSAVE=y. Methode 2: Manche Geräte, etwa Wi-Fi, aktivieren die Funktion im Treiber. Werden die Bedingungen nicht eingehalten, kann das Aktivieren des Makros den Link in einen fehlerhaften, nicht aufweckbaren Zustand versetzen. Aktuellen Kernel mit commit e18dfa93 PCI: rockchip: dw: Support PM L1 clock removing verwenden.

<!-- en PDF p.37 -->

## 6. GPIO-Erkennung von Einstecken und Entfernen

<!-- en PDF p.37 -->

### 6.1 Hardwareanforderungen

<!-- en PDF p.37 -->

1. PRSNTN_1 des PCIe-Slots zur Erkennung mit einem beliebigen Controller-GPIO verbinden.

<!-- en PDF p.37 -->

2. Die PCIe-Geräteversorgung muss softwareseitig ein- und ausschaltbar sein.

<!-- en PDF p.37 -->

### 6.2 Softwareanforderungen

<!-- en PDF p.37 -->

1. Mindestens folgende Commits müssen enthalten sein; andernfalls Patches beim Anbieter anfordern.

<!-- en PDF p.38 -->

```text
commit 4de1a0c19e0f9804ba22e7f5e544fea317913957
Author: Shawn Lin <shawn.lin@rockchip.com>
Date:   Tue Mar 12 16:38:46 2024 +0800

    PCI: rockchip: dw: Add gpio based hotplug
    Change-Id: I49c57755d11cc43bbf7cf9eb23542f5e1e11aaa3

commit 86f3010d7f523c9f5a2e88d9f8f1871ed89da098
Author: Vidya Sagar <vidyas@nvidia.com>
Date:   Sat Oct 1 00:57:45 2022 +0530

    FROMLIST: PCI/hotplug: Add GPIO PCIe hotplug driver
    Change-Id: Iafa798ee4d98f195f5d33d80120da0c569132548
```

<!-- en PDF p.38 -->

2. Folgende Kernelkonfigurationen müssen aktiviert sein:

<!-- en PDF p.38 -->

```text
CONFIG_HOTPLUG_PCI=y
CONFIG_HOTPLUG_PCI_GPIO=y
```

<!-- en PDF p.38 -->

3. DTS-Beispiel:

<!-- en PDF p.38 -->

```text
&pcie0 {
  reset-gpios = <&gpio4 RK_PC7 GPIO_ACTIVE_HIGH>;
  vpcie3v3-supply = <&vcc3v3_pcie0>;
  hotplug-gpios = <&gpio4 RK_PC4 IRQ_TYPE_EDGE_BOTH>;
  pinctrl-names = "default";
  pinctrl-0 = <&hot_plug0>;
  status = "okay";
};

&pinctrl {
  pcie {
      hot_plug0: hot-plug0 {
          rockchip,pins = <4 RK_PC4 RK_FUNC_GPIO &pcfg_pull_up>;
      };
  };
};
```

<!-- en PDF p.38 -->

### 6.3 Nutzungsgrenzen

<!-- en PDF p.38 -->

1. PCIe-Stecken/Ziehen unter Spannung kann Gerät und Controller beschädigen. Entladen und Abschalten nach Entfernung benötigen Zeit; schnelles wiederholtes Hotplug ist deshalb untersagt. Vor erneutem Stecken folgende Entfernungsmeldung abwarten:

<!-- en PDF p.39 -->

```text
[   35.680289][  T134] pcieport 0000:00:00.0: Hot-UnPlug Event
[   35.680361][  T134] pcieport 0000:00:00.0: Power Status = 1
[   35.827183][  T134] rk-pcie 2a200000.pcie: rk_pcie_slot_disable
[   35.827303][  T134] pcieport 0000:00:00.0: Hot-UnPlug Event
[   35.827323][  T134] pcieport 0000:00:00.0: Power Status = 0
[   35.827334][  T134] pcieport 0000:00:00.0: Device is already removed
```

<!-- en PDF p.39 -->

2. Für Datenintegrität und Systemstabilität Zugriffe auf das zu entfernende Gerät beenden.

<!-- en PDF p.39 -->

3. Separates Hotplug nachgelagerter Switch-Geräte wird nicht unterstützt. Falls benötigt, zuerst die entsprechende Switch-Fähigkeit bestätigen und dann den Rescan-Abschnitt zum Online-Austausch einzelner nachgelagerter Geräte verwenden; dies erzielt denselben Effekt.

<!-- en PDF p.39 -->

4. Einstecken/Entfernen im Schlaf- oder Standbyzustand wird nicht erkannt.

<!-- en PDF p.39 -->

## 7. Kernel DMATEST

<!-- en PDF p.39 -->

Vor der Entwicklung DMA-Unterstützung des Controllers anhand der Chipressourcen prüfen. RK PCIe DMA bietet einen auf Kernel-module_para basierenden Testmechanismus ähnlich Linux dmatest, der zur Entwicklung von Kernel-DMA-Anwendungen dienen kann. Der Kernel muss mindestens folgenden Commit enthalten; andernfalls Patch beim Anbieter anfordern.

<!-- en PDF p.39 -->

```text
commit a7c40cb119703e566d9d5befb8c1a7b0533dd7b7
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Tue Jan 17 17:46:48 2023 +0800

    PCI: rockchip: dw-dmatest: Suppport rc dma

    1.Set rc dma as default
    2.Changet to ep dma by sending command:
            echo 0 > ./sys/module/pcie_dw_dmatest/parameters/is_rc

    Change-Id: I9b16c328c08f220772e487c7c796b8898d74ae10
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- en PDF p.39 -->

Test-Makrokonfiguration:

<!-- en PDF p.39 -->

```text
CONFIG_PCIE_DW_DMATEST=y
CONFIG_ROCKCHIP_PCIE_DMA_OBJ=n
```

<!-- en PDF p.39 -->

Umgebung einrichten: PCIe-Verbindungsmodell:

<!-- en PDF p.40 -->

Kundenseitig RK RC — FPGA EP aufbauen. RK-Lokaltest: RK RC mit dmatest-Konfiguration — RK EP mit Chipverbindungskonfiguration. MPS = 256B. RC und EP benötigen reservierten Speicher; empfohlen sind jeweils 64MB ab 0x3c000000, der Standardtestadresse. Nicht benötigte PCIe-Controller deaktivieren. Testdetails stehen in pcie-dw-misc-dmatest.c.

<!-- en PDF p.40 -->

```text
static int size = 0x20;
module_param(size, int, 0644);
MODULE_PARM_DESC(size, "each packet size in bytes");

static unsigned int cycles_count = 1;
module_param(cycles_count, uint, 0644);
MODULE_PARM_DESC(cycles_count, "how many erase cycles to do (default 1)");

static bool irq;
module_param(irq, bool, 0644);
MODULE_PARM_DESC(irq, "Using irq? (default: false)");

static unsigned int chn_en = 1;
module_param(chn_en, uint, 0644);
MODULE_PARM_DESC(chn_en, "Each bits for one dma channel, up to 2 channels, (default enable chanel 0)");

static unsigned int rw_test = 3;
module_param(rw_test, uint, 0644);
MODULE_PARM_DESC(rw_test, "Read/Write test, 1-read 2-write 3-both(default 3)");

static unsigned int bus_addr = 0x3c000000;
module_param(bus_addr, uint, 0644);
MODULE_PARM_DESC(bus_addr, "Dmatest chn0 bus_addr(remote), chn1 add offset 0x100000, (default 0x3c000000)");

static unsigned int local_addr = 0x3c000000;
module_param(local_addr, uint, 0644);
MODULE_PARM_DESC(local_addr, "Dmatest chn0 local_addr(local), chn1 add offset 0x100000, (default 0x3c000000)");

static unsigned int test_dev;
module_param(test_dev, uint, 0644);
MODULE_PARM_DESC(test_dev, "Choose dma_obj device,(default 0)");

static bool is_rc = true;
module_param_named(is_rc, is_rc, bool, 0644);
MODULE_PARM_DESC(is_rc, "Test port is rc(default true)");
```

<!-- en PDF p.41 -->

Beispiel 1: RC, Kanal 0, Schreiben, Größe 1MB, 1000 Wiederholungen, lokale und entfernte Adresse 0x3c000000:

<!-- en PDF p.41 -->

```text
echo 0 > ./sys/module/pcie_dw_dmatest/parameters/test_dev
echo 1 > ./sys/module/pcie_dw_dmatest/parameters/is_rc
echo 1 > ./sys/module/pcie_dw_dmatest/parameters/chn_en
echo 1 > ./sys/module/pcie_dw_dmatest/parameters/rw_test
echo 0x100000 > ./sys/module/pcie_dw_dmatest/parameters/size
echo 1000 > ./sys/module/pcie_dw_dmatest/parameters/cycles_count
echo 0x3c000000 > ./sys/module/pcie_dw_dmatest/parameters/local_addr
echo 0x3c000000 > ./sys/module/pcie_dw_dmatest/parameters/bus_addr
echo run > ./sys/module/pcie_dw_dmatest/parameters/dmatest
```

<!-- en PDF p.41 -->

Beispiel 2: EP, Kanäle 0/1 mit zwei Threads, Lesen/Schreiben, 8KB, 10000 Wiederholungen, lokale und entfernte Adresse 0x3c000000:

<!-- en PDF p.41 -->

```text
echo 0 > ./sys/module/pcie_dw_dmatest/parameters/test_dev
echo 0 > ./sys/module/pcie_dw_dmatest/parameters/is_rc
echo 3 > ./sys/module/pcie_dw_dmatest/parameters/chn_en
echo 3 > ./sys/module/pcie_dw_dmatest/parameters/rw_test
echo 0x2000 > ./sys/module/pcie_dw_dmatest/parameters/size
echo 10000 > ./sys/module/pcie_dw_dmatest/parameters/cycles_count
echo 0x3c000000 > ./sys/module/pcie_dw_dmatest/parameters/local_addr
echo 0x3c000000 > ./sys/module/pcie_dw_dmatest/parameters/bus_addr
echo run > ./sys/module/pcie_dw_dmatest/parameters/dmatest
```

<!-- en PDF p.41 -->

## 8. Kernel-Stabilitätsstatistik

<!-- en PDF p.41 -->

Bei längerem Betrieb können PCIe-Geräte vom erwarteten Verhalten abweichen. Zur Analyse debugfs verwenden. Erforderlich ist der Commit pcie: rockchip: dw: Add debugfs support; andernfalls 0001-pcie-rockchip-dw-Add-debugfs-support.patch aus Redmine gemäß Anhang beziehen. Vorgehen:

<!-- en PDF p.41 -->

1. Controllerknotenadresse des betroffenen Geräts im Boot-Enumerationslog oder dtsi ermitteln.

<!-- en PDF p.41 -->

2. Für das Quellenbeispiel fe16000.pcie nach /sys/kernel/debug/fe160000.pcie wechseln; die unterschiedliche Adressschreibweise stammt aus der Quelle.

<!-- en PDF p.41 -->

3. echo disable > err_event deaktiviert sämtliche Ereignisstatistik.

<!-- en PDF p.41 -->

4. echo clear > err_event löscht alle Zähler.

<!-- en PDF p.41 -->

5. echo enable > err_event aktiviert sämtliche Statistik.

<!-- en PDF p.41 -->

6. Dauertest zur Fehlerreproduktion starten; anschließend cat dumpfifo und cat err_event ausführen.

<!-- en PDF p.42 -->

7. Ausgabe mit der Debugfs-Auswertungstabelle im Anhang zur ersten Fehlerbestimmung vergleichen.

<!-- en PDF p.42 -->

## 9. Kernel-AER und Injektionstest

<!-- en PDF p.42 -->

AER (Advanced Error Reporting) ist eine Standardfunktion von Linux. Sie meldet unterlagerte Kommunikationsfehler an Userspace-Daemons und ermöglicht fehlertolerante Behandlung. In komplexen Anwendungen können AER-Injektionstests Ereignisse vorab simulieren und die Ausnahmebehandlung verbessern.

<!-- en PDF p.42 -->

1. AER und Injektion im Kernel aktivieren, um /dev/aer_inject anzulegen:

<!-- en PDF p.42 -->

```text
CONFIG_PCIEAER=y
CONFIG_PCIEAER_INJECT=y
```

<!-- en PDF p.42 -->

2. Kernel-cmdline konfigurieren:

<!-- en PDF p.42 -->

```text
#Use RK3588-EVB Linux for example,  add pcie_pme=nomsi
--- a/arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi
@@ -12,7 +12,7 @@ aliases {
        };

        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0 irqchip.gicv3_pseudo_nmi=0 root=PARTUUID=614e0000-0000 rw rootwait rcupdate.rcu_expedited=1 rcu_nocbs=all";
+               bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0 irqchip.gicv3_pseudo_nmi=0 root=PARTUUID=614e0000-0000 rw rootwait rcupdate.rcu_expedited=1 rcu_nocbs=all pcie_pme=nomsi";
        };
```

<!-- en PDF p.42 -->

3. Korrekte Einrichtung und Registrierung des AER-IRQ-Dienstes prüfen:

<!-- en PDF p.42 -->

```text
# check the cmdline for sure we set pcie_pme=nomsi
cat /proc/cmdline
# check the irq
root@debian:/userdata# cat /proc/interrupts | grep aerdrv
 60:      0      0      0      0      0      0     0     0     INTx   0 Edge      PCIe PME, aerdrv, PCIe bwctrl
 63:      0      0      0      1      0      0     0     0     INTx   0 Edge      PCIe PME, aerdrv
110:      0      0      0      0      0      0     0     0     INTx   0 Edge      PCIe PME, aerdrv
```

<!-- en PDF p.42 -->

4. aer-inject über die Ressourcenadresse im Anhang beziehen.

<!-- en PDF p.43 -->

5. Adresse des Ziel-PCIe-Geräts ermitteln:

<!-- en PDF p.43 -->

```text
# Use lspci to obtain the PCIe device address. Example with network card 01:00.0:
00:00.0 PCI bridge: Rockchip Electronics Co., Ltd Device 3576 (rev 01)
01:00.0 Network controller: Broadcom Inc. and subsidiaries Device 449d (rev 02)
```

<!-- en PDF p.43 -->

4. Testskript erstellen; Nummerierung aus der Quelle übernommen:

<!-- en PDF p.43 -->

```text
# Example script name: aer.txt, content:

AER
BUS 1 DEV 0 FN 0        // BUS, DEV, FN correspond to the BDF of the DUT (Device Under Test)
COR_STATUS BAD_TLP      // Test correctable error: bad TLP
HEADER_LOG 0 1 2 3

AER
BUS 1 DEV 0 FN 0        // BUS, DEV, FN correspond to the BDF of the DUT
UNCOR_STATUS COMP_ABORT // Test uncorrectable error: completion abort
HEADER_LOG 4 5 6 7
```

<!-- en PDF p.43 -->

Korrigierbare Fehler neben BAD_TLP: RCVR, BAD_DLLP, REP_ROLL, REP_TIMER. Nicht korrigierbare neben COMP_ABORT: TRAIN, DLP, POISON_TLP, FCP, COMP_TIME, UNX_COM, RX_OVE, MALF_TLP, ECRC, UNSUP. Ein Skript kann mehrere Injektionskonfigurationen ausführen; nach Bedarf anpassen.

<!-- en PDF p.43 -->

5. Skript ausführen:

<!-- en PDF p.43 -->

```text
root@rk3576-buildroot:/data# ./aer-inject aer.txt
[  459.689869] pcieport 0000:00:00.0: aer_inject: Injecting errors 00000040/00000000 into device 0000:01:00.0
[  459.690302] pcieport 0000:00:00.0: AER: Corrected error message received from 0000:01:00.0
[  459.690376] pci 0000:01:00.0: PCIe Bus Error: severity=Corrected, type=Data Link Layer, (Receiver ID)
[  459.690404] pci 0000:01:00.0:   device [14e4:449d] error status/mask=00000040/00002000
[  459.690434] pci 0000:01:00.0:    [ 6] BadTLP
```

<!-- en PDF p.43 -->

## 10. Kernel-Fehlerinjektionstest

<!-- en PDF p.43 -->

Zur Prüfung der Fehlertoleranz von RC-Funktionstreiber, Anwendungsmodell, EP-Firmware und beidseitigem Hardware-IP kann Fehlerinkektion aktiviert werden. Sie simuliert Interaktionsfehler und bewertet die Stabilität von Software und IP beider Seiten. Vorgehen:

<!-- en PDF p.43 -->

```text
(1) The following commit needs to be included
commit fe835d5fd3329ba629f8c4290c818ef4b8f9895d
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Wed Sep 4 17:04:37 2024 +0800

    PCI: rockchip: dw: Add fault injection support
    Change-Id: Ib214cc1be565bf16bafb6a847215572f35c43753

(2) The functionality described in the "Kernel Stability Statistical Information" section of this document needs to be enabled, and the corresponding controller directory needs to be entered

(3) echo "einj_number enable_or_disable error_type error_number" > fault_injection
    |-------------------|----------------------------------------------------------|
    | Value             |         Meaning                                            |
    |-------------------|----------------------------------------------------------|
    |einj_number:       |Error injection group number, only supports 0 to 6, other values are invalid                         |
    |-------------------|----------------------------------------------------------|
    |enable_or_disable: |Enable or disable error injection, 0 means disable, 1 means enable, other values are invalid      |
    |-------------------|----------------------------------------------------------|
    |error_type:        |Error injection type selection, choose the error type corresponding to the einj_number group number as described in the appendix|
    |-------------------|----------------------------------------------------------|
    |error_number:      |Error injection quantity, only supports 0 to 255, other values are invalid                         |
    |-------------------|----------------------------------------------------------|
    For example, echo "2 1 2 128" > fault_injection, represents enabling einj2 and injecting 128 NAK DLLP packets

(4) Start the PCIe link transmission, for example, NVMe: dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000

(5) Check if the error occurs: cat err_event
    Rx Recovery Request: 0x1f
    ...
    Tx Nak DLLP: 0x80

(6) Analyze the dual-end software and hardware to see if there are any unexpected software or hardware exceptions
```

<!-- en PDF p.44 -->

## 11. Kernel PMU perf

<!-- en PDF p.44 -->

### 11.1 Software und Konfiguration

<!-- en PDF p.44 -->

```text
(1) The following five commits must be included:
commit 0270f32f207f5682a729c17e977eb87bba83823e
Author: Shuai Xue <xueshuai@linux.alibaba.com>
Date:   Fri Dec 8 10:56:50 2023 +0800
    UPSTREAM: PCI: Move pci_clear_and_set_dword() helper to PCI header
    Change-Id: I35125190a4dd8ba25e6ec14b4712750605c22285

commit 1b627c690ade9a72e3cd488e2e11edffb5d0e879
Author: Shuai Xue <xueshuai@linux.alibaba.com>
Date:   Fri Dec 8 10:56:49 2023 +0800

    UPSTREAM: PCI: Add Alibaba Vendor ID to linux/pci_ids.h
    Change-Id: I86188f119a42548ab777df0449f7d0a933f34d12

commit dcfa6c8947baeac74ab44ea8f03d3831a062c14b
Author: Shuai Xue <xueshuai@linux.alibaba.com>
Date:   Fri Dec 8 10:56:51 2023 +0800

    BACKPORT: drivers/perf: add DesignWare PCIe PMU driver
    Change-Id: I470f4dc2791168760517c77dd31a4dacd7dab591

commit 6cb6a00862fa29f815412634569e2015f86e397a
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Tue Sep 3 16:24:36 2024 +0800

    perf/dwc_pcie: Add support for Rockchip vendor devices
    Change-Id: I6fde80440d2fa058b38a7d927eb846f477812b5f

commit 50cb3fcd18fb9defe23ba95eb3962a287e957166
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Tue Sep 3 16:24:36 2024 +0800

    PCI: rockchip: dw: Add dwc pmu support for rockchip
    Change-Id: Ia27ee055aa3e63deeb7fd646411c3542b7019288

(2) The kernel must enable the CONFIG_PERF_EVENTS configuration.
(3) The system must integrate the perf tool; if not available, it can be downloaded from the development resource access address mentioned in the appendix of this document.
```

<!-- en PDF p.45 -->

### 11.2 Verwendung

<!-- en PDF p.45 -->

```text
(1) List all configurations supported by DWC PCIe PMU
root@rk3576-buildroot:/# /userdata/perf list | grep dwc_rootport
  dwc_rootport_0/CFG_RCVRY/                          [Kernel PMU event] #Percentage of time link is in rcvry state
  dwc_rootport_0/L0/                                 [Kernel PMU event] #Percentage of time link is in L0 state
  dwc_rootport_0/L1/                                 [Kernel PMU event] #Percentage of time link is in L1 state
  dwc_rootport_0/L1_1/                               [Kernel PMU event] #Percentage of time link is in L1.1 state
  dwc_rootport_0/L1_2/                               [Kernel PMU event] #Percentage of time link is in L1.2 state
  dwc_rootport_0/L1_AUX/                             [Kernel PMU event] #Status not supported by RK
  dwc_rootport_0/RX_L0S/                             [Kernel PMU event] #Percentage of time RX is in L0s state
  dwc_rootport_0/Rx_CCIX_TLP_Data_Payload/           [Kernel PMU event] #RK does not support CCIX data statistics
  dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/           [Kernel PMU event] #RX TLP data volume
  dwc_rootport_0/TX_L0S/                             [Kernel PMU event] #Percentage of time TX is in L0s state
  dwc_rootport_0/TX_RX_L0S/                          [Kernel PMU event] #Percentage of time both TX and RX are in L0s state
  dwc_rootport_0/Tx_CCIX_TLP_Data_Payload/           [Kernel PMU event] #RK does not support CCIX data statistics
  dwc_rootport_0/Tx_PCIe_TLP_Data_Payload/           [Kernel PMU event] #TX TLP data volume
  dwc_rootport_0/one_cycle/                          [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/rx_ack_dllp,lane=?/                 [Kernel PMU event] #Number of DLLPs acknowledged by RX
  dwc_rootport_0/rx_atomic,lane=?/                   [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/rx_ccix_tlp,lane=?/                 [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/rx_completion_with_data,lane=?/     [Kernel PMU event] #RX completion packets with data
  dwc_rootport_0/rx_completion_without_data,lane=?/  [Kernel PMU event] #RX completion packets without data
  dwc_rootport_0/rx_duplicate_tl,lane=?/             [Kernel PMU event] #Number of RX/TL dup errors
  dwc_rootport_0/rx_io_read,lane=?/                  [Kernel PMU event] #Number of ior packets on RX
  dwc_rootport_0/rx_io_write,lane=?/                 [Kernel PMU event] #Number of iow packets on RX
  dwc_rootport_0/rx_memory_read,lane=?/              [Kernel PMU event] #Number of memr packets on RX
  dwc_rootport_0/rx_memory_write,lane=?/             [Kernel PMU event] #Number of memw packets on RX
  dwc_rootport_0/rx_message_tlp,lane=?/              [Kernel PMU event] #Number of messages received on RX
  dwc_rootport_0/rx_nulified_tlp,lane=?/             [Kernel PMU event] #Number of TLPs discarded due to errors on RX
  dwc_rootport_0/rx_tlp_with_prefix,lane=?/          [Kernel PMU event] #Number of TLPs with prefix on RX
  dwc_rootport_0/rx_update_fc_dllp,lane=?/           [Kernel PMU event] #Number of flow control packets received on RX
  dwc_rootport_0/tx_ack_dllp,lane=?/                 [Kernel PMU event] #Number of DLLPs acknowledged by TX
  dwc_rootport_0/tx_atomic,lane=?/                   [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/tx_ccix_tlp,lane=?/                 [Kernel PMU event] #Not supported by RK
  dwc_rootport_0/tx_completion_with_data,lane=?/     [Kernel PMU event] #TX completion packets with data
  dwc_rootport_0/tx_completion_without_data,lane=?/  [Kernel PMU event] #TX completion packets without data
  dwc_rootport_0/tx_configuration_read,lane=?/       [Kernel PMU event] #Number of cfg-r packets on TX
  dwc_rootport_0/tx_configuration_write,lane=?/      [Kernel PMU event] #Number of cfg-w packets on TX
  dwc_rootport_0/tx_io_read,lane=?/                  [Kernel PMU event] #Number of ior packets on TX
  dwc_rootport_0/tx_io_write,lane=?/                 [Kernel PMU event] #Number of iow packets on TX
  dwc_rootport_0/tx_memory_read,lane=?/              [Kernel PMU event] #Number of memr packets on TX
  dwc_rootport_0/tx_memory_write,lane=?/             [Kernel PMU event] #Number of memw packets on TX
  dwc_rootport_0/tx_message_tlp,lane=?/              [Kernel PMU event] #Number of messages received on TX
  dwc_rootport_0/tx_nulified_tlp,lane=?/             [Kernel PMU event] #Number of TLPs discarded due to errors on TX
  dwc_rootport_0/tx_tlp_with_prefix,lane=?/          [Kernel PMU event] #Number of TLPs with prefix sent by TX
  dwc_rootport_0/tx_update_fc_dllp,lane=?/           [Kernel PMU event] #Number of flow control packets sent by TX

(2) Start a perf feature, using time-based statistics for RX TLP as an example
 /userdata/perf stat -a -e dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/

(3) Initiate transmission
root@rk3576-buildroot:/# dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000
dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000
5000+0 records in
5000+0 records out
5242880000 bytes (5.2 GB, 4.9 GiB) copied, 14.9016 s, 352 MB/s

(4) View statistics
Performance counter stats for 'system wide':
5221423060      dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/     (50.01%)
28.298528222 seconds time elapsed

(5) Similarly, test the data volume of TX TLP, and calculate the average RX/TX bandwidth
PCIe RX Bandwidth = Rx_PCIe_TLP_Data_Payload / duration
PCIe TX Bandwidth = Tx_PCIe_TLP_Data_Payload / duration

(6) Statistics for Lane events
Since each Lane has the same events, to avoid generating a large amount of redundant information, it is recommended to specify the Lane ID, for example:
 /userdata/perf stat -a -e dwc_rootport_0/rx_memory_read,lane=1/
```

<!-- en PDF p.48 -->

## 12. Häufige Anwendungsfragen

<!-- en PDF p.48 -->

### 12.1 Lanes für günstigere Leiterbahnführung vertauschen?

<!-- en PDF p.48 -->

1. Lane reversal wird vom Hardwareprotokoll umgesetzt; keine Softwareänderung nötig. Bei vier Lanes unterstützt RK nur vollständige Umkehrung: RC Lane[0.1.2.3] zu EP Lane[3.2.1.0]. Andere Varianten werden nicht unterstützt.

<!-- en PDF p.48 -->

![Englische Originalabbildung — 48](/docs/rockchip-pcie/assets/en-p048-figure-01.png)

*Englische Originalabbildung — 48*

<!-- en PDF p.48 -->

Bei zwei Lanes entsprechend RC Lane[0.1] mit EP Lane[1.0] verbinden.

<!-- en PDF p.48 -->

2. Signale verschiedener Lanes derselben Seite dürfen nicht kombiniert werden; RC lane0 TX und lane1 RX bilden beispielsweise keine gemeinsame Lane zur Peripherie.

<!-- en PDF p.49 -->

### 12.2 Differentielle Signale derselben Lane vertauschen?

<!-- en PDF p.49 -->

PN-Umkehr (Lane polarity) wird unterstützt: Normalerweise RC TX+ an EP RX+ und RC TX- an EP RX-, alternativ RC TX+ an EP RX-. Der Controller erkennt dies automatisch ohne Softwareänderung. TX/RX-Verflechtung wird nicht unterstützt: RC lane1 TX darf nicht an EP lane1 TX angeschlossen werden.

<!-- en PDF p.49 -->

### 12.3 Unterstützt eine Schnittstelle Aufteilen/Zusammenführen?

<!-- en PDF p.49 -->

Einige RK-PCIe-Ports unterstützen Aufteilen und Zusammenführen; siehe Chipressourcen, Beispiele und DTS-Beschreibung.

<!-- en PDF p.49 -->

### 12.4 Welche Eingangstakte unterstützt PCIe 3.0?

<!-- en PDF p.49 -->

Als Eingangstakt des PCIe-3.0-PHYs sind HCSL, LPHCSL oder andere differentielle Signale möglich, etwa LVDS mit zusätzlicher Pegelwandlung, sofern die PHY-Spezifikation eingehalten wird.

<!-- en PDF p.49 -->

![Englische Originalabbildung — 49](/docs/rockchip-pcie/assets/en-p049-figure-01.png)

*Englische Originalabbildung — 49*

<!-- en PDF p.49 -->

![Englische Originalabbildung — 49](/docs/rockchip-pcie/assets/en-p049-figure-02.png)

*Englische Originalabbildung — 49*

<!-- en PDF p.50 -->

![Englische Originalabbildung — 50](/docs/rockchip-pcie/assets/en-p050-figure-01.png)

*Englische Originalabbildung — 50*

<!-- en PDF p.50 -->



**Editierbare Abschrift der Quellabbildungen**

| Symbol | Parameter | Min. | Max. | Einheit | Bedingungen |
| --- | --- | --- | --- | --- | --- |
| FREF_CLK | Referenztaktfrequenz | 19.2 | 200 | MHz | Nicht kontinuierlich; je Protokoll gemäß Datenbuch |
| FREF_OFFSET | Referenztakt-Frequenzabweichung | -100 | 100 | ppm | Alle Protokolle außer SATA |
| RMSJREF_CLK <= 8 Gbps | Zufälliger Referenztakt-Jitter |  | 1.6 | ps_rms | Integrierter RJ von 12 kHz bis 20 MHz |
| RMSJREF_CLK <= 8 Gbps | Zufälliger Referenztakt-Jitter |  | 1.2 | ps_rms | Integrierter RJ von 2 MHz bis 20 MHz |
| DJREF_CLK <= 8 Gbps | Deterministischer Referenztakt-Jitter |  | 2.8 | ps, pp | 0.75–10 MHz (offset), a |
| DJREF_CLK <= 8 Gbps | Deterministischer Referenztakt-Jitter |  | 5.6 | ps, pp | 0.2–50 MHz (offset), a |
| DCREF_CLK | Tastverhältnis | 40 | 60 | % |  |
| VCMREF_CLK | Gleichtakt-Eingangspegel | 0 | vp | V | Differenzielle Eingänge |
| VDREF_CLK | Differenzieller Eingangshub | 300 | 2*vp | mVppd | Differenzieller Eingang muss VDREF_CLK und VDSEREF_CLK erfüllen |
| VDSEREF_CLK | Einseitige Spannung des differenziellen Takts | 0 | vp |  | Differenzieller Eingang muss VDREF_CLK und VDSEREF_CLK erfüllen |
| SKEWDIF_CLK | Versatz des differenziellen Eingangstakts |  | 100 | ps |  |
| SWREF_CLK | Anstiegsgeschwindigkeit des differenziellen Takts | 0.1 |  | V/ns | 20–80% |

Für PCIe gelten die CEM-Anforderungen. Fußnote a: DJ-Rauschgrenzen gelten im Offsetbereich des geteilten Referenztakts und seiner Oberwellen. Leere Zellen bleiben wie in der Quelle leer.

Die Quelle nennt 1.2 V noch als ausstehende Siliziumcharakterisierung und Validierung; dies ist kein bestätigter ArmSoM-Arbeitspunkt.

| vph / vp/vpdig/vptxX | Min | Typ | Max |
| --- | --- | --- | --- |
| vph | 1.8 V -10% | 1.8 V | 1.8 V +10% |
| vph | 1.5 V -5% | 1.5 V | 1.5 V +10% |
| vph | 1.2 V -5% | 1.2 V | 1.2 V +10% |
| vp/vpdig/vptxX | 0.9 V -7% | 0.9 V | 0.9 V +10% |

### 12.5 Werden PCIe-Switches unterstützt und welche empfohlen?

<!-- en PDF p.50 -->

### 12.6 Controller und Geräte zuordnen?

<!-- en PDF p.50 -->

RK3568-Beispiel: PCIe2x1 vergibt Busse 0x0~0xf, PCIe3x1 0x10~0x1f und PCIe3x2 0x20~0x2f. Die oberen Adressteile in lspci zeigen die Zuordnung. Spalte zwei Class ist der Gerätetyp, Spalte drei VID:PID. Typen: https://pci-ids.ucw.cz/read/PD/; Hersteller/Produkte: http://pci-ids.ucw.cz/v2.2/pci.ids.

<!-- en PDF p.50 -->

```text
console:/ # lspci
21:00.0 Class 0108: 144d:a808
20:00.0 Class 0604: 1d87:3566
11:00.0 Class 0c03: 1912:0014
10:00.0 Class 0604: 1d87:3566
01:00.0 Class 0c03: 1912:0014
00:00.0 Class 0604: 1d87:3566
```

<!-- en PDF p.50 -->

Jeder Controller reserviert 16 nachgelagerte Busebenen; die Quelle beschreibt dies als 16 Geräte einschließlich Switches, normalerweise ausreichend. Falls nötig bus-range der drei Controller in rk3568.dtsi überlappungsfrei ändern. Ohne Änderungsbedarf kann die weitere Erklärung übersprungen werden.

<!-- en PDF p.51 -->

Eine Änderung von bus-range verändert die MSI(-X)-RID-Bereiche; msi-map entsprechend anpassen.

<!-- en PDF p.51 -->

```text
bus-range = <start address   end address>

msi-map = < start address in bus-range << 8
            &its
            start address in bus-range << 8
            total number of buses allocated in bus-range << 8>
```

<!-- en PDF p.51 -->

Beispiel: bus-range 0x30~0x60 vergibt nachgelagert 0x30–0x60, laut Quelle insgesamt 0x30 Busse. Dann msi-map = <0x3000 &its 0x3000 0x3000>. bus-range und msi-map der drei Controller müssen überlappungsfrei und zueinander passend sein.

<!-- en PDF p.51 -->

### 12.7 Linkstatus eines Geräts bestimmen?

<!-- en PDF p.51 -->

Mit dem vom Server bereitgestellten Werkzeug lspci -vvv ausführen und linkStat des Geräts finden: Speed bezeichnet die Geschwindigkeit, Width die Lane-Anzahl. Für weitere Felder zusätzliche Referenzen heranziehen.

<!-- en PDF p.51 -->

### 12.7a MSI-Zuweisungskapazität (Ergänzung aus chinesischer Quelle)

Dieser Absatz steht in der chinesischen V6.29.0, §12.8 (S.46), fehlt aber in der englischen Ausgabe. Die zuweisbare MSI-Anzahl hängt von den Ressourcen des Interruptcontrollers ab. Für alle nachgelagerten Geräte jedes Controllers stehen bei RK1808/RK3566/RK3568/RK3588 insgesamt 65535 MSI zur Verfügung; bei RK3528/RK3562/RK3576 insgesamt 32. Dies sind Angaben der Quelle, keine ArmSoM-Messergebnisse.

### 12.8 Legacy INT unterstützen und INTA–INTD erzwingen?

<!-- en PDF p.51 -->

Legacy INT wird unterstützt. Linux priorisiert MSI-X, MSI, Legacy INT, weshalb übliche Geräte Legacy INT nicht anfordern. Für Tests MSI in cmdline gemäß Documentation/admin-guide/kernel-parameters.txt, pci=option[,option...], deaktivieren; dann wird Legacy INT erzwungen. Bei RK356X Android pci=nomsi mit Leerzeichen davor und danach in die cmdline von arch/arm64/boot/dts/rockchip/rk3568-android.dtsi einfügen:

<!-- en PDF p.51 -->

```text
bootargs = "...... pci=nomsi ......";
```

<!-- en PDF p.51 -->

Nach erfolgreicher Änderung zeigt lspci -vvv MSI und MSI-X als Enable- sowie INT A mit Nummer 80. Den Zustand von Interrupt 80 mit cat /proc/interrupts prüfen.

<!-- en PDF p.52 -->

```text
01:00.0 Class 0108: Device 14a4:22f1 (rev 01) (prog-if 02)
        Subsystem: Device 1b4b:1093
...
        Interrupt: pin A routed to IRQ 80
...
        Capabilities: [50] MSI: Enable- Count=1/1 Maskable+ 64bit+
                Address: 0000000000000000  Data: 0000
                Masking: 00000000  Pending: 00000000
...
        Capabilities: [b0] MSI-X: Enable- Count=19 Masked-
                Vector table: BAR=0 offset=00002000
                PBA: BAR=0 offset=00003000
```

<!-- en PDF p.52 -->

### 12.9 BAR bei 32-Bit-CPU-Betrieb ansprechen?

<!-- en PDF p.52 -->

Standardmäßig liegt der Controller-BAR oberhalb des 32-Bit-Adressbereichs. Der Chip reserviert zusätzlich niedrige BAR-Adressen mit controllerabhängigen Grenzen. RK3568 bietet pro Controller nur 32MB niedrigen BAR-Raum. Bei 32-Bit-CPU-Betrieb diesen Raum aktivieren und ranges jedes PCIe-Knotens neu zuweisen. Das Beispiel vergibt 1MB Konfigurationsraum, 1MB IO und 30MB 32-Bit-MEM:

<!-- en PDF p.52 -->

```text
&pcie2x1 {
        ranges = <0x00000800 0x0 0xF4000000 0x0 0xF4000000 0x0 0x100000
                  0x81000000 0x0 0xF4100000 0x0 0xF4100000 0x0 0x100000
                  0x82000000 0x0 0xF4200000 0x0 0xF4200000 0x0 0x1e00000>;
}

&pcie3x1 {
        ranges = <0x00000800 0x0 0xF2000000 0x0 0xF2000000 0x0 0x100000
                  0x81000000 0x0 0xF2100000 0x0 0xF2100000 0x0 0x100000
                  0x82000000 0x0 0xF2200000 0x0 0xF2200000 0x0 0x1e00000>;
}

&pcie3x2 {
        ranges = <0x00000800 0x0 0xF0000000 0x0 0xF0000000 0x0 0x100000
                  0x81000000 0x0 0xF0100000 0x0 0xF0100000 0x0 0x100000
                  0x82000000 0x0 0xF0200000 0x0 0xF0200000 0x0 0x1e00000>;
}
```

<!-- en PDF p.52 -->

Zum Anpassen der Größen siehe die ausführliche PCIe-Adressraumkonfiguration im Anhang.

<!-- en PDF p.53 -->

### 12.10 CPU- und PCIe-Busadresse anzeigen und zuordnen?

<!-- en PDF p.53 -->

lspci zeigt für jedes Gerät CPU-Domänen- und PCIe-Busdomänenadressen.

<!-- en PDF p.53 -->

```text
root@linaro-alip: /home/linaro# lspci -Vs 0002:21:00.0 -X
0002:21 :00.0 Non-Volatile memory controller: Intel Corporation SSD Pro 7600p/ 760p/E 6100p Series (rev 03) (prog-if 02 [NVM Express] )
    Subsystem: Intel Corporation SSD Pro 7600p/ 760p/E 6100p Series
    Flags: bus master, fast devsel, latency 0, IRQ 114
    Memory at 380900000 (64-bit, non-prefetchable) [size=16K]
    Capabilities: [40] Power Management version 3
    ....

00: 86 80 a6 f1 06 04 10 00 03 02 08 01 00 00 00 00
10: 04 00 90 80 00 00 00 00 00 00 00 00 00 00 00 00
20: 00 00 00 00 00 00 00 00 00 00 00 00 86 80 0b 39
30: 00 00 00 00 40 00 00 00 00 00 00 00 72 01 00 00
```

<!-- en PDF p.53 -->

Die CPU-Adresse 0x380900000 der Peripherie ist mit IO oder devmem lesbar. Die entsprechende Busadresse steht in BAR0, Offset 0x10–0x14: „04 00 90 80“, also 0x80900000; die unteren 04 kennzeichnen 64bit MEM. Bei CPU-Zugriff auf 0x380900000 erzeugt die ATU anhand der Outbound-Zuordnung die PCIe-Adresse 0x80900000. Die Zuordnung steht in rk3568.dtsi; Beispiel pcie3x2:

<!-- en PDF p.53 -->

```text
ranges = <0x00000800 0x0 0x80000000 0x3 0x80000000 0x0 0x800000
          0x81000000 0x0 0x80800000 0x3 0x80800000 0x0 0x100000  IO space
          0x83000000 0x0 0x80900000 0x3 0x80900000 0x0 0x3f700000>; Memory space
```

<!-- en PDF p.53 -->

Im Memory-Segment kennzeichnet 0x83000000 einen nicht vorladbaren 64-Bit-Raum. 0x3 0x80900000 ist die CPU-Adresse 0x0000000380900000; 0x0 0x80900000 die PCIe-Adresse 0x0000000080900000; 0x3f700000 die Segmentgröße. Der Offset beträgt 0x300000000 und wird hardwareseitig von der ATU umgesetzt. Details im Adresskonfigurationsanhang.

<!-- en PDF p.54 -->

### 12.11 Einzelnes Gerät online erneut scannen oder ersetzen?

<!-- en PDF p.54 -->

Erneute Enumeration des nachgelagerten Geräts ist in zwei Fällen nötig:

<!-- en PDF p.54 -->

1. Der BAR-Raum verändert sich zwischen Betriebsphasen.

<!-- en PDF p.54 -->

2. Ein defektes Gerät wird online ersetzt.

<!-- en PDF p.54 -->

```text
(1) Identify the downstream device that needs to be replaced or rescanned. Currently, we take the device with BDF 01:00.0 as an example.
console:/ # /data/lspci -k
00:00.0 Class 0604: Device 1d87:3566 (rev 01)
        Kernel driver in use: pcieport
01:00.0 Class 0c03: Device 1912:0014 (rev 03)

(2) Perform the remove operation on the device, and you can see the corresponding device node and the PCIe driver it runs are uninitialized.
console:/ # echo 1 > /sys/bus/pci/devices/0000\:01\:00.0/remove
[   30.624938] xhci_hcd 0000:01:00.0: remove, state 4
[   30.624985] usb usb8: USB disconnect, device number 1
[   30.625741] xhci_hcd 0000:01:00.0: USB bus 8 deregistered
[   30.626115] xhci_hcd 0000:01:00.0: remove, state 4
[   30.626142] usb usb7: USB disconnect, device number 1
[   30.640977] xhci_hcd 0000:01:00.0: USB bus 7 deregistered
[   32.055886] vcc5v0_otg: disabling
[   32.055920] vcc3v3_lcd1_n: disabling

(3) Check again to confirm that the device is no longer detected.
console:/ # /data/lspci -k
00:00.0 Class 0604: Device 1d87:3566 (rev 01)
        Kernel driver in use: pcieport

(4) Initiate a bus rescan. You can choose either of the following two commands. After execution, the new device will be recognized.
console:/ #  echo 1 > /sys/bus/pci/devices/0000\:00\:00.0/rescan
console:/ #  echo 1 > /sys/bus/pci/rescan
[   33.222240] pci 0000:01:00.0: BAR 0: assigned [mem 0x300900000-0x300900fff 64bit]
[   33.222606] xhci_hcd 0000:01:00.0: xHCI Host Controller
[   33.224875] xhci_hcd 0000:01:00.0: new USB bus registered, assigned bus number 7
[   33.225468] xhci_hcd 0000:01:00.0: hcc params 0x002841eb hci version 0x100 quirks 0x0000000000000090
[   33.226318] usb usb7: New USB device found, idVendor=1d6b, idProduct=0002, bcdDevice= 4.19
[   33.226329] usb usb7: New USB device strings: Mfr=3, Product=2, SerialNumber=1
[   33.226345] usb usb7: Product: xHCI Host Controller
[   33.226355] usb usb7: Manufacturer: Linux 4.19.172 xhci-hcd
[   33.226364] usb usb7: SerialNumber: 0000:01:00.0
[   33.227661] hub 7-0:1.0: USB hub found
[   33.227716] hub 7-0:1.0: 1 port detected
[   33.228252] xhci_hcd 0000:01:00.0: xHCI Host Controller
[   33.228581] xhci_hcd 0000:01:00.0: new USB bus registered, assigned bus number 8
[   33.226816] xhci_hcd 0000:01:00.0: Host supports USB 3.0 SuperSpeed
[   33.228678] usb usb8: We don't know the algorithms for LPM for this host, disabling LPM.
[   33.228783] usb usb8: New USB device found, idVendor=1d6b, idProduct=0003, bcdDevice= 4.19
[   33.228796] usb usb8: New USB device strings: Mfr=3, Product=2, SerialNumber=1
[   33.228803] usb usb8: Product: xHCI Host Controller
[   33.228809] usb usb8: Manufacturer: Linux 4.19.172 xhci-hcd
[   33.228814] usb usb8: SerialNumber: 0000:01:00.0
[   33.229360] hub 8-0:1.0: USB hub found
[   33.229406] hub 8-0:1.0: 4 ports detected
[   33.556216] usb 7-1: new high-speed USB device number 2 using xhci_hcd
[   33.700886] usb 7-1: New USB device found, idVendor=2109, idProduct=3431, bcdDevice= 4.20
[   33.700913] usb 7-1: New USB device strings: Mfr=0, Product=1, SerialNumber=0
[   33.700920] usb 7-1: Product: USB2.0 Hub
[   33.702398] hub 7-1:1.0: USB hub found
[   33.702642] hub 7-1:1.0: 4 ports detected
```

<!-- en PDF p.55 -->

### 12.12 Cachekohärenz zwischen Peripherie und Treiber erhalten?

<!-- en PDF p.55 -->

Gemäß PCIe Snoop/No Snoop setzt die Peripherie das No-Snoop-Attribut im TLP einer Hostanforderung, um anzugeben, ob Hardwarehilfe für Cachekohärenz benötigt wird.

<!-- en PDF p.55 -->

| No Snoop Bit | Cachekohärenztyp | Verwaltungsmodell | Anmerkungen |
| --- | --- | --- | --- |
| 0 | Snoop | Hardware gewährleistet Cachekohärenz | Für Cfg-, I/O-, Message- und MSI(-x)-Pakete muss 0 gesetzt sein |
| 1 | No Snoop | Peripherietreiber erhält Cachekohärenz | - |

<!-- en PDF p.55 -->

Bei TLP-Schreiben in Hostspeicher mit No Snoop=0 prüft der RC, ob andere CPUs die Adresse cachen, und invalidiert diese Caches nach dem Schreiben in physischen Speicher. Beim Lesen mit No Snoop=0 prüft er alle CPU-Caches und führt bei vorhandenen Daten vor dem Lesen einen Flush aus. Einige RK-Chips unterstützen Snoop nicht und behandeln alles als No Snoop=1; ihre Funktionstreiber müssen Kohärenz selbst pflegen. Mit Snoop-Unterstützung gewährleistet der Chip die Kohärenz.

<!-- en PDF p.56 -->

| Plattformen ohne PCIe-Cachekohärenz | Plattformen mit PCIe-Cachekohärenz |
| --- | --- |
| RK1808, RK3528, RK3562, RK3566, RK3568, RK3588(s) | RK3576 |

<!-- en PDF p.56 -->

### 12.13 Kann PCIe-Beacon den Host wecken?

<!-- en PDF p.56 -->

RK unterstützt kein Aufwecken des Hosts aus L2 durch ein PCIe-Geräte-Beacon. Dafür #WAKE als GPIO-Weckquelle verwenden.

<!-- en PDF p.56 -->

### 12.14 MSI vom RK-PCIe-EP per Befehl auslösen?

<!-- en PDF p.56 -->

Vor dem Test: RC und EP unterstützen und aktivieren MSI cap; bei RK standardmäßig aktiv. Auf dem RC läuft der EP-Funktionstreiber mit angeforderten MSI-Interrupts. Das EP-Register PCIE_CLIENT_MSI_GEN_CON löst MSI aus; 32 Bit entsprechen 32 Interrupts. RK3588-Beispiel:

<!-- en PDF p.56 -->

```text
io -4 0xFE150038 1
```

<!-- en PDF p.56 -->

Alternativ outbound ATU konfigurieren und Memory Write per CPU oder DMA auslösen. Manche PCs erlauben unter Linux wie Windows nur ein MSI, hauptsächlich durch BIOS-Einstellungen wie Intel-Virtualisierung/VT-d und Interrupt-Remapper-Unterstützung. RK3588 RC kann bis zu 32 MSI anfordern.

<!-- en PDF p.56 -->

### 12.15 MSI-X vom RK-PCIe-EP per Befehl auslösen?

<!-- en PDF p.56 -->

Prinzip: Der PC konfiguriert die MSI-Tabelle über das standardmäßige MSI-X-cap mit BAR4-Abbildung. Beispiel RK3568:

<!-- en PDF p.57 -->

```text
# After loading the driver, the msix configuration status can be viewed from the device side by executing the following two commands to see the MSI-X table
io -4 0xfe280270 0x10001      # Enable Dbi writeable during testing
io -4 -l 0x100 0xf6300000
io -4 0xfe280270 0x10000

f6300000:  fee02004 00000000 00000024 00000000
f6300010:  fee08004 00000000 00000024 00000000
f6300020:  fee01004 00000000 00000024 00000000
f6300030:  fee02004 00000000 00000025 00000000
f6300040:  fee08004 00000000 00000025 00000000
f6300050:  fee01004 00000000 00000025 00000000
f6300060:  fee02004 00000000 00000026 00000000
f6300070:  fee04004 00000000 00000026 00000000
f6300080:  00000000 00000000 00000000 00000001
f6300090:  00000000 00000000 00000000 00000001
f63000a0:  00000000 00000000 00000000 00000001
f63000b0:  00000000 00000000 00000000 00000001
f63000c0:  00000000 00000000 00000000 00000001
f63000d0:  00000000 00000000 00000000 00000001
f63000e0:  00000000 00000000 00000000 00000001
f63000f0:  00000000 00000000 00000000 00000001

# Since the current business does not provide an MSI-X interface example, MSI-X can be triggered in the following way
# Set device outbound, the default RK EP outbound configuration CPU addr is 0xf0000000, unchanged during testing, or Bar outbound configuration can be completed through the kernel interface
io -4 0xf6300014 0xfee00000    # Points to the output address of the previous io -4 -l 0x100 0xf5300000
io -4 0xf6300018 0x0

# Trigger MSI-X
io -4 0xf0002004 0x24
io -4 0xf0008004 0x24
io -4 0xf0001004 0x24
io -4 0xf0002004 0x25
io -4 0xf0008004 0x25
io -4 0xf0001004 0x25
io -4 0xf0002004 0x26
io -4 0xf0004004 0x26
```

<!-- en PDF p.57 -->

Beispiel RK3588:

<!-- en PDF p.57 -->

```text
# After loading the driver, the msix configuration status can be viewed from the device side by executing the following two commands to see the MSI-X table
io -4 0xfe150270 0x10001       # Enable Dbi writeable during testing
io -4 -l 0x100 0xf5300000
io -4 0xfe150270 0x10000

f5300000:  fee02004 00000000 00000024 00000000
f5300010:  fee08004 00000000 00000024 00000000
f5300020:  fee01004 00000000 00000024 00000000
f5300030:  fee02004 00000000 00000025 00000000
f5300040:  fee08004 00000000 00000025 00000000
f5300050:  fee01004 00000000 00000025 00000000
f5300060:  fee02004 00000000 00000026 00000000
f5300070:  fee04004 00000000 00000026 00000000
f5300080:  00000000 00000000 00000000 00000001
f5300090:  00000000 00000000 00000000 00000001
f53000a0:  00000000 00000000 00000000 00000001
f53000b0:  00000000 00000000 00000000 00000001
f53000c0:  00000000 00000000 00000000 00000001
f53000d0:  00000000 00000000 00000000 00000001
f53000e0:  00000000 00000000 00000000 00000001
f53000f0:  00000000 00000000 00000000 00000001

# Since the current business does not provide an MSI-X interface example, MSI-X can be triggered in the following way
# Set device outbound, the default RK EP outbound configuration CPU addr is 0xf0000000, unchanged during testing, or Bar outbound configuration can be completed through the kernel interface
io -4 0xf5300014 0xfee00000    # Points to the output address of the previous io -4 -l 0x100 0xf5300000
io -4 0xf5300018 0x0

# Trigger MSI-X
io -4 0xf0002004 0x24
io -4 0xf0008004 0x24
io -4 0xf0001004 0x24
io -4 0xf0002004 0x25
io -4 0xf0008004 0x25
io -4 0xf0001004 0x25
io -4 0xf0002004 0x26
io -4 0xf0004004 0x26
```

<!-- en PDF p.58 -->

### 12.16 32bits-np-Abbildungsraum vergrößern?

<!-- en PDF p.58 -->

PCIe-mmio ist dedizierter physischer Adressraum für CPU-initiierte PCIe-Übertragungen und gehört nicht zum DRAM. Jeder Controller besitzt eigenen mmio-Raum, typischerweise 32MB mit 32-Bit- und 1GB mit 64-Bit-Adressen. range bildet CPU-Zugriffsadressen auf virtuelle PCI-Domänenadressen ab. Domänenadressen dürfen nicht mit physischem DRAM überlappen, sonst drohen falsche EP-DMA-Zugriffe. Standardmäßig entsprechen sie deshalb dem physischen mmio des Controllers. Für mehr begrenzten 32bits-np-Domänenraum können 32bits-np-Domänenadressen anderer PCIe-Controller geteilt werden, der physische MMIO muss jedoch aus dem 64-Bit-MMIO desselben Controllers kommen, niemals aus dem eines anderen. Für weitere Erweiterung in System Map des TRM große freie 32-Bit-MMIO-Blöcke anderer IPs suchen und als Domänenadressen verwenden. Andernfalls reservierten Speicher unterhalb 4GB nutzen. Standardkonfiguration am Beispiel RK3588:

<!-- en PDF p.59 -->

```text
[    5.325570] pci_bus 0000:00: root bus resource [mem 0xf0200000-0xf0ffffff]
           # RC 14MB 32bits-np mem
[    5.325577] pci_bus 0000:00: root bus resource [mem 0x900000000-0x93fffffff pref]
          # RC 1GB 64bits-pref mem
```

<!-- en PDF p.59 -->

Problem: Die standardmäßige 32bits-np-Zuweisung reicht nicht. Protokoll:

<!-- en PDF p.59 -->

```text
[   11.646077] pci 0000:01:00.0: reg 0x10: [mem 0x00000000-0x00ffffff 64bit]   # Dev requires a total of 26MB 32bits-np, and will eventually align to a requirement of 32MB space
[   11.646113] pci 0000:01:00.0: reg 0x18: [mem 0x00000000-0x007fffff 64bit]
[   11.646150] pci 0000:01:00.0: reg 0x20: [mem 0x00000000-0x001fffff 64bit]
...
[   11.971710] pci 0000:01:00.0: BAR 0: no space for [mem size 0x01000000 64bit]
[   11.971713] pci 0000:01:00.0: BAR 0: failed to assign [mem size 0x01000000 64bit]
[   11.971717] pci 0000:01:00.0: BAR 2: no space for [mem size 0x00800000 64bit]
[   11.971720] pci 0000:01:00.0: BAR 2: failed to assign [mem size 0x00800000 64bit]
[   11.971723] pci 0000:01:00.0: BAR 4: no space for [mem size 0x00200000 64bit]
[   11.971726] pci 0000:01:00.0: BAR 4: failed to assign [mem size 0x00200000 64bit]
```

<!-- en PDF p.59 -->

Dedizierten PCIe-Speicher im TRM prüfen und fehlende mem ranges ergänzen. Beispiel 1: RK3588 pcie3x4 mit 240MB 32bits-np; range des passenden Knotens in rk3588.dtsi ändern:

<!-- en PDF p.59 -->

```text
ranges = <0x00000800 0x0 0xff000000 0x0 0xf0000000 0x0 0x100000
          0x81000000 0x0 0xff100000 0x0 0xf0100000 0x0 0x100000
          0x82000000 0x0 0xf0000000 0x9 0x00000000 0x0 0x0f000000
          0xc3000000 0x9 0x10000000 0x9 0x10000000 0x0 0x30000000>;
```

<!-- en PDF p.59 -->

Beispiel 2: RK3588s pcie2x1l2, 240MB 32bits-np; range in rk3588s.dtsi:

<!-- en PDF p.60 -->

```text
ranges = <0x00000800 0x0 0xff000000 0x0 0xf4000000 0x0 0x100000
          0x81000000 0x0 0xff100000 0x0 0xf4100000 0x0 0x100000
          0x82000000 0x0 0xf0000000 0xa 0x00000000 0x0 0x0f000000
          0xc3000000 0xa 0x10000000 0xa 0x10000000 0x0 0x30000000>;
```

<!-- en PDF p.60 -->

Beispiel 3: RK3588 pcie2x1l0, 240MB 32bits-np; range in rk3588.dtsi:

<!-- en PDF p.60 -->

```text
ranges = <0x00000800 0x0 0xff000000 0x0 0xff000000 0x0 0x100000
          0x81000000 0x0 0xff100000 0x0 0xff100000 0x0 0x100000
          0x82000000 0x0 0xf0000000 0x9 0x80000000 0x0 0x0f000000
          0xc3000000 0x9 0x90000000 0x9 0x90000000 0x0 0x30000000>;
```

<!-- en PDF p.60 -->

Beispiel 4: RK3568 pcie3x2, 240MB 32bits-np; range in rk356x.dtsi:

<!-- en PDF p.60 -->

```text
ranges = <0x00000800 0x0 0xff000000 0x0 0xf0000000 0x0 0x100000
          0x81000000 0x0 0xff100000 0x0 0xf0100000 0x0 0x100000
          0x82000000 0x0 0xf0000000 0x3 0x80000000 0x0 0x0f000000
          0xc3000000 0x3 0x90000000 0x3 0x90000000 0x0 0x30000000>;
```

<!-- en PDF p.60 -->

Beispiel 5: Beispiel 1 um eine 256M-Abbildung ab 0x30000000 ergänzen und den Speicher reservieren:

<!-- en PDF p.60 -->

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
index a10dad37f9cf..d1b16e13c459 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
@@ -233,6 +233,15 @@ wireless_wlan: wireless-wlan {
                WIFI,poweren_gpio = <&gpio3 RK_PB1 GPIO_ACTIVE_HIGH>;
                status = "okay";
        };
+
+       reserved-memory {
+               #address-cells = <2>;
+               #size-cells = <2>;
+               ranges;
+               pcie3x4_range: pcie3x4-range@30000000 {
+                       reg = <0x0 0xdfe00000 0x0 0x10200000>;
+               };
+       };
 };

 &backlight {
diff --git a/arch/arm64/boot/dts/rockchip/rk3588.dtsi b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
index ad414c61fd38..096f16740e11 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
@@ -601,10 +601,11 @@ pcie3x4: pcie@fe150000 {
                phys = <&pcie30phy>;
                phy-names = "pcie-phy";
                power-domains = <&power RK3588_PD_PCIE>;
-               ranges = <0x00000800 0x0 0xf0000000 0x0 0xf0000000 0x0 0x100000
-                         0x81000000 0x0 0xf0100000 0x0 0xf0100000 0x0 0x100000
-                         0x82000000 0x0 0xf0200000 0x0 0xf0200000 0x0 0xe00000
-                         0xc3000000 0x9 0x00000000 0x9 0x00000000 0x0 0x40000000>;
+                ranges = <0x00000800 0x0 0xdfe00000 0x0 0xf0000000 0x0 0x100000
+                          0x81000000 0x0 0xdff00000 0x0 0xf0100000 0x0 0x100000
+                          0x82000000 0x0 0xe0000000 0x9 0x00000000 0x0 0x20000000 // Extended to 512MB
+                          0xc3000000 0x9 0x20000000 0x9 0x20000000 0x0 0x20000000>;
                reg = <0x0 0xfe150000 0x0 0x10000>,
                      <0xa 0x40000000 0x0 0x400000>;
                reg-names = "pcie-apb", "pcie-dbi";
```

<!-- en PDF p.61 -->

### 12.17 Maximum Payload Size konfigurieren?

<!-- en PDF p.61 -->

PCIe überträgt TLPs. Maximum Payload Size (MPS) bestimmt deren maximale Nutzdatenmenge, wird zwischen beiden Linkenden ausgehandelt und darf vom Sender nicht überschritten werden. Der Kernel bietet DTS-basierte PCI subsystem options; siehe Documentation/admin-guide/kernel-parameters.txt. Konfigurationen:

<!-- en PDF p.61 -->

```text
pcie_bus_tune_off  # Disable MPS adjustment, use the device's default value
pcie_bus_safe      # Enable MPS adjustment, set the maximum MPS value supported by all devices
pcie_bus_perf      # Enable MPS adjustment, set the maximum MPS based on the parent bus and its own capability
pcie_bus_peer2peer # Enable MPS adjustment, set all devices to have an MPS of 128B
```

<!-- en PDF p.61 -->

Der Standardmechanismus für max payload size ist pcie_bus_tune_off. Gewöhnlich kann pci=pcie_bus_safe direkt in DTS-bootargs ergänzt werden.

<!-- en PDF p.61 -->

### 12.18 IDs enumerierter Geräte festlegen?

<!-- en PDF p.61 -->

Bei mehreren gleichartigen PCIe-Geräten, etwa Netzwerkkarten, ist die Initialisierungsreihenfolge nicht fest; eth0 kann daher unterschiedliche Geräte bezeichnen. Dies gilt auch für NVMe. Für feste IDs den Funktionstreiber ändern und die DTS-basierte Busnummernvergabe nutzen. Zwei Beispiele:

<!-- en PDF p.61 -->

```text
If RK3588 is connected to three network cards and wants to fix the order as follows:
pcie2x1l0: pcie@fe170000 => eth1
pcie2x1l2: pcie@fe190000 => eth2
pcie2x1l1: pcie@fe180000 => eth3

By querying dtsi, it is known that:
pcie2x1l0 node: bus-range = <0x20 0x2f> -> The bus number allocated to the network card is 0x21 -> eth1
pcie2x1l2 node: bus-range = <0x40 0x4f> -> The bus number allocated to the network card is 0x41 -> eth2
pcie2x1l1 node: bus-range = <0x30 0x3f> -> The bus number allocated to the network card is 0x31 -> eth3

Modify the corresponding function driver to change the name registered to the network subsystem before the register_netdev function is called.
--- a/drivers/net/ethernet/realtek/r8168/r8168_n.c
+++ b/drivers/net/ethernet/realtek/r8168/r8168_n.c
@@ -25481,6 +25481,18 @@ static const struct net_device_ops rtl8168_netdev_ops = {
 };
 #endif

+static void pci_bus_nr_2_id(struct pci_dev *pdev, struct net_device *ndev )
+{
+
+       dev_info(&pdev->dev, "%s pdev->bus->number = 0x%x\n",
+                __func__, pdev->bus->number);
+
+       if(pdev->bus->number == 0x21)
+               strcpy(ndev->name, "eth1");
+       if(pdev->bus->number == 0x41)
+               strcpy(ndev->name, "eth2");
+       if(pdev->bus->number == 0x31)
+               strcpy(ndev->name, "eth3");
+}
+
 static int __devinit
 rtl8168_init_one(struct pci_dev *pdev,
                  const struct pci_device_id *ent)
@@ -25624,7 +25636,7 @@ rtl8168_init_one(struct pci_dev *pdev,
                 rtl8168_set_eeprom_sel_low(tp);

         rtl8168_get_mac_address(dev);
-
+        pci_bus_nr_2_id(pdev, dev); // The modification must be before register_netdev()
         tp->fw_name = rtl_chip_fw_infos[tp->mcfg].fw_name;

Similarly, NVMe storage can be modified in a similar way.
--- a/drivers/nvme/host/core.c
+++ b/drivers/nvme/host/core.c
@@ -5169,6 +5169,19 @@ static void nvme_free_ctrl(struct device *dev)
                nvme_put_subsystem(subsys);
 }

+static void pci_bus_nr_2_id(struct pci_dev *pdev, struct nvme_ctrl *ctrl)
+{
+       dev_info(&pdev->dev, "%s pdev->bus->number = 0x%x\n",
+                __func__, pdev->bus->number);
+
+       if(pdev->bus->number == 0x21)
+               ctrl->instance = 1; //pcie2x1l0 -> nvme1
+       if(pdev->bus->number == 0x41)
+               ctrl->instance = 2; //pcie2x1l2 -> nvme2
+       if(pdev->bus->number == 0x31)
+               ctrl->instance = 3; //pcie2x1l1 -> nvme3
+}
+
 /*
  * Initialize a NVMe controller structures.  This needs to be called during
  * earliest initialization so that we have the initialized structured around
@@ -5178,6 +5191,7 @@ int nvme_init_ctrl(struct nvme_ctrl *ctrl, struct device *dev,
                const struct nvme_ctrl_ops *ops, unsigned long quirks)
 {
        int ret;
+       struct pci_dev *pdev = container_of(dev, struct pci_dev, dev);

        ctrl->state = NVME_CTRL_NEW;
        clear_bit(NVME_CTRL_FAILFAST_EXPIRED, &ctrl->flags);
@@ -5214,6 +5228,8 @@ int nvme_init_ctrl(struct nvme_ctrl *ctrl, struct device *dev,
                goto out;
        ctrl->instance = ret;

+       pci_bus_nr_2_id(pdev, ctrl);
        device_initialize(&ctrl->ctrl_device);
        ctrl->device = &ctrl->ctrl_device;
        ctrl->device->devt = MKDEV(MAJOR(nvme_ctrl_base_chr_devt),
```

<!-- en PDF p.63 -->

### 12.19 PCIe-Testmodus aufrufen?

<!-- en PDF p.63 -->

Standardtestsuite: siehe rockchip,compliance-mode in der Controller-DTS-Konfiguration. Peripherie-TX-Augendiagramm: TX direkt zum Messen anschließen. Ergebnisse sind normalerweise nicht direkt mit der Standardtestsuite vergleichbar, sondern nur zwischen Geräten gleichen Modells. Maßgeblich sind PCIe-Standardmetriken. Keine spezielle Softwarekonfiguration nötig; nach erfolgreicher Enumeration Bandbreite testen, etwa NVMe mit fio. PCIe 3.0 verwendet einen dedizierten PHY mit bereits abgestimmten, nicht zur Änderung freigegebenen Softwareparametern.

<!-- en PDF p.64 -->

Die meisten Gen3-TX/RX-Parameter stammen aus der PHY-Abstimmung und sind nicht veränderbar. Gen1/2 verwenden meist combophy mit bereits abgestimmten Parametern, deren Änderung ebenfalls normalerweise nicht vorgesehen ist. Bei schlechter Signalqualität Messmethode und PCB-Konformität zu RK-EVB-Vorgaben prüfen. Bei bestätigtem erheblichem Signaldefekt das PCB-Hardwarelayout optimieren.

<!-- en PDF p.64 -->

### 12.20 PCIe im zweiten Schlafzustand betriebsbereit halten?

<!-- en PDF p.64 -->

Standardablauf: PME_Turn_Off versetzt beide Seiten in L2; Referenztakt und EP-Versorgung werden abgeschaltet, beide Seiten erreichen D3 cold; Trust Firmware schaltet Bus und PLL ab. Nach dem Aufwachen wird erneut enumeriert. Geräte wie Wi-Fi behalten für Host-Wakeup im zweiten Standby ihre Versorgung; diese steuert der Funktionstreiber statt PCIe-vpcie3v3-supply. Dürfen auch Takt/Link nicht angehalten werden:

<!-- en PDF p.64 -->

1. Schlaf-/Aufwachfunktionen des PCIe-Treibers auskommentieren.

<!-- en PDF p.64 -->

```text
--- a/drivers/pci/controller/dwc/pcie-dw-rockchip.c
+++ b/drivers/pci/controller/dwc/pcie-dw-rockchip.c
@@ -1902,6 +1902,8 @@ static int __maybe_unused rockchip_dw_pcie_suspend(struct device *dev)
        struct dw_pcie *pci = rk_pcie->pci;
        u32 status;

+       return 0;
+
        /*
         * This is as per PCI Express Base r5.0 r1.0 May 22-2019,
         * 5.2 Link State Power Management (Page #440).
@@ -1997,6 +1999,8 @@ static int __maybe_unused rockchip_dw_pcie_resume(struct device *dev)
        struct dw_pcie *pci = rk_pcie->pci;
        int ret;

+       return 0;
```

<!-- en PDF p.64 -->

2. PCIe-PD und Busversorgung dauerhaft eingeschaltet lassen.

<!-- en PDF p.64 -->

```text
# 1. Query the power-domains node referenced by the PCIe controller node in the dtsi
pcie0: pcie@2a200000 {
    ...
    power-domains = <&power RK3576_PD_PHP>;
    ...
};

# 2. Configure this power-domain node to always be on, and modify the power control in the sleep state
--- a/arch/arm64/boot/dts/rockchip/rk3576.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3576.dtsi
@@ -1717,11 +1717,8 @@
rockchip_suspend: rockchip-suspend {
    compatible = "rockchip,pm-config";
    status = "disabled";

    rockchip,sleep-debug-en = <0>;
    rockchip,sleep-mode-config = <
            (0
-           | RKPM_SLP_ARMOFF_LOGOFF
-           | RKPM_SLP_PMU_PMUALIVE_32K
-           | RKPM_SLP_PMU_DIS_OSC
+           | RKPM_SLP_ARMOFF_DDRPD
            | RKPM_SLP_PMIC_LP
-           | RKPM_SLP_32K_EXT
            )
    >;

@@ -2325,7 +2325,7 @@
power-domain@RK3576_PD_PHP {
    reg = <RK3576_PD_PHP>;
    #address-cells = <1>;
    #size-cells = <0>;
    pm_qos = <&qos_mmu0>,
             <&qos_mmu1>;
-
+   rockchip,always-on;
    power-domain@RK3576_PD_SUBPHP {
        reg = <RK3576_PD_SUBPHP>;
    };
```

<!-- en PDF p.65 -->

3. Aktualisierte bl31 zum Erhalt von Bus und PLL vom Technikteam beziehen, anschließend U-Boot neu bauen.

<!-- en PDF p.66 -->

## 13. Fehlersuche

<!-- en PDF p.66 -->

### 13.1 Fehler beim Treiberladen

<!-- en PDF p.66 -->

```text
[    0.417008] rk-pcie 3c0000000.pcie: Linked as a consumer to regulator.14
[    0.417477] rk-pcie 3c0800000.pcie: Linked as a consumer to regulator.14
[    0.417648] rk-pcie 3c0800000.pcie: phy init failed
```

<!-- en PDF p.66 -->

Ursache: Der zugehörige Controller-PHY ist im DTS nicht korrekt aktiviert.

<!-- en PDF p.66 -->

```text
[    0.195567] rochchip_p3phy_init: lock failed 0x6890000, check input refclk and power supply
[    0.195585] phy phy-fe8c0000.phy.8: phy init failed --> -110
[    0.195599] rk-pcie 3c0800000.pcie: fail to init phy, err -110
[    0.195611] rk-pcie 3c0800000.pcie: phy init failed
```

<!-- en PDF p.66 -->

Ursache: Fehlerhafte Versorgung oder Eingangstakt des PCIe-3.0-PHYs verhindert dessen Betrieb.

<!-- en PDF p.66 -->

### 13.2 Linktraining fehlgeschlagen

<!-- en PDF p.66 -->

```text
PCIe Link Fail logs are repeatedly showing "PCIe Linking..." and the LTSSM state machine may differ

rk-pcie 3c0000000.pcie: PCIe Linking... LTSSM is 0x0
rk-pcie 3c0000000.pcie: PCIe Linking... LTSSM is 0x0
rk-pcie 3c0000000.pcie: PCIe Linking... LTSSM is 0x0

Alternatively, there may be a "PCIe Link up" printout, but the LTSSM state machine's bit16 and bit17 are not equal to 0x3, and the values from bit0 to bit8 are not greater than 0x11
[    3.108325] rk-pcie fe150000.pcie: Looking up vpcie3v3-supply from device tree
[    3.126926] rk-pcie fe150000.pcie: missing legacy IRQ resource
[    3.126940] rk-pcie fe150000.pcie: IRQ msi not found
[    3.126944] rk-pcie fe150000.pcie: use outband MSI support
[    3.126947] rk-pcie fe150000.pcie: Missing *config* reg space
[    3.126954] rk-pcie fe150000.pcie: host bridge /pcie@fe150000 ranges:
[    3.126965] rk-pcie fe150000.pcie:      err 0x00f0000000..0x00f00fffff -> 0x00f0000000
[    3.126972] rk-pcie fe150000.pcie:       IO 0x00f0100000..0x00f01fffff -> 0x00f0100000
[    3.126979] rk-pcie fe150000.pcie:      MEM 0x00f0200000..0x00f0ffffff -> 0x00f0200000
[    3.126984] rk-pcie fe150000.pcie:      MEM 0x0900000000..0x090fffffff -> 0x0900000000
[    3.127007] rk-pcie fe150000.pcie: Missing *config* reg space
[    3.127028] rk-pcie fe150000.pcie: invalid resource
[    3.387304] rk-pcie fe150000.pcie: PCIe Link up, LTSSM is 0x0

If the link is truly successful, logs similar to the following should be visible, with "PCIe Link up" printout and LTSSM state machine's bit16 and bit17 equal to 0x3, and values from bit0 to bit8 greater than or equal to 0x11
[    2.410536] rk-pcie 3c0000000.pcie: PCIe Link up, LTSSM is 0x130011
```

<!-- en PDF p.67 -->

Ursachen: fehlgeschlagenes Training, nicht betriebsbereite Peripherie oder Signalfehler. Langsame IO prüfen: PERSTN entspricht reset-gpios und muss umschalten; CLKREQN wird standardmäßig nicht genutzt und ist normalerweise Low; WAKEN ungenutzt und normalerweise High. Danach 3V3, ausreichende Versorgungskapazität und Störungen prüfen; manche Geräte benötigen 12V. Reset-/Versorgungstiming mit der Gerätespezifikation vergleichen. Hilft dies nicht, Signalintegrität untersuchen: PCB und Augendiagramme den Hardwareingenieuren des Herstellers vorlegen, bevorzugt mit einem Labor-TX-Compliance-Bericht. RK_PCIE_DBG in pcie-dw-rockchip.c aktivieren und protokollieren. Bei mehreren Controllern ungenutzte und fehlerfreie zuvor deaktivieren, um die Auswertung zu erleichtern. Beispiel: rk-pcie 3c0000000.pcie: fifo_status = 0x144001. Die letzten zwei Ziffern von fifo_status zeigen den PCIe-LTSSM-Zustand; Zustandsliste im Anhang.

<!-- en PDF p.67 -->

### 13.3 Systemfehler bei PCIe3.0-Initialisierung

<!-- en PDF p.67 -->

```text
[   21.523506] rcu: INFO: rcu_preempt detected stalls on CPUs/tasks:
[   21.523557] rcu:     1-...0: (0 ticks this GP) idle=652/1/0x4000000000000000 softirq=30/30 fqs=2097
[   21.523579] rcu:     3-...0: (5 ticks this GP) idle=4fa/1/0x4000000000000000 softirq=35/36 fqs=2097
[   21.523590] rcu:     (detected by 2, t=6302 jiffies, g=-1151, q=98)
[   21.523610] Task dump for CPU 1:
[   21.523622] rk-pcie         R  running task        0    55      2 0x0000002a
[   21.523640] Call trace:
[   21.523666]  __switch_to+0xe0/0x128
[   21.523682]  0x43752cfcfe820900
[   21.523694] Task dump for CPU 3:
[   21.523704] kworker/u8:0    R  running task        0     7      2 0x0000002a
[   21.523737] Workqueue: events_unbound enable_ptr_key_workfn
[   21.523751] Call trace:
[   21.523767]  __switch_to+0xe0/0x128
[   21.523786]  event_xdp_redirect+0x8/0x90
[   21.523816] rcu: INFO: rcu_sched detected stalls on CPUs/tasks:
[   21.523840] rcu:     1-...0: (50 ticks this GP) idle=652/1/0x4000000000000000 softirq=7/30 fqs=2099
[   21.523859] rcu:     3-...0: (55 ticks this GP) idle=4fa/1/0x4000000000000000 softirq=5/36 fqs=2099
[   21.523870] rcu:     (detected by 2, t=6302 jiffies, g=-1183, q=1)
[   21.523887] Task dump for CPU 1:
[   21.523898] rk-pcie         R  running task        0    55      2 0x0000002a
[   21.523915] Call trace:
[   21.523931]  __switch_to+0xe0/0x128
[   21.523944]  0x43752cfcfe820900
[   21.523955] Task dump for CPU 3:
[   21.523965] kworker/u8:0    R  running task        0     7      2 0x0000002a
[   21.523990] Workqueue: events_unbound enable_ptr_key_workfn
[   21.524004] Call trace:
```

<!-- en PDF p.68 -->

Ein Hängen nahe dieser Meldung weist auf fehlerhaften PCIe3.0-PHY-Betrieb hin. Nacheinander externen Takt prüfen: fehlender Takt oder falsche Amplitude verhindert Lock; PCIE30_AVDD_0V9 und PCIE30_AVDD_1V8 prüfen; langsame PCIe-IO-Konfigurationen im Board-DTS gegebenenfalls entfernen und erneut testen, anhand des IO-Abschnitts. Beim RK3588 pcie30phy muss auch der ungenutzte zweite Port versorgt sein.

<!-- en PDF p.68 -->

### 13.4 Systemfehler bei PCIe2.0-Initialisierung

<!-- en PDF p.68 -->

```text
[   21.523870] rcu:     (detected by 2, t=6302 jiffies, g=-1183, q=1)
[   21.523887] Task dump for CPU 1:
[   21.523898] rk-pcie         R  running task        0    55      2 0x0000002a
[   21.523915] Call trace:
[   21.523931]  __switch_to+0xe0/0x128
[   21.523944]  0x43752cfcfe820900
[   21.523955] Task dump for CPU 3:
[   21.523965] kworker/u8:0    R  running task        0     7      2 0x0000002a
[   21.523990] Workqueue: events_unbound enable_ptr_key_workfn
[   21.524004] Call trace:
```

<!-- en PDF p.68 -->

Ein Hängen nahe dieser Meldung weist auf PCIe2.0-PHY-Probleme hin. Für RK3568 combphy2_psq PCIE30_AVDD_0V9 und PCIE30_AVDD_1V8 prüfen; langsame PCIe-IO-Einstellungen zum Test aus dem Board-DTS entfernen und den IO-Abschnitt beachten. In phy-rockchip-naneng-combphy.c am Ende von rockchip_combphy_init folgenden Prüfcode ergänzen:

<!-- en PDF p.69 -->

```text
val = readl(priv->mmio + (0x27 << 2));
dev_err(priv->dev, "TXPLL_LOCK is 0x%x PWON_PLL is 0x%x\n",
val & BIT(0), val & BIT(1));
val = readl(priv->mmio + (0x28 << 2));
dev_err(priv->dev, "PWON_IREF is 0x%x\n", val & BIT(7));
```

<!-- en PDF p.69 -->

Zuerst muss TXPLL_LOCK=1 sein, sonst hat der PHY keinen Lock. Danach PWON_IREF=1 prüfen, andernfalls ist der PHY-Takt fehlerhaft. assigned-clock-rates von combphy2_psq in rk3568.dtsi nacheinander auf 25M und 100M testen. Hilft dies nicht, internen PHY-Takt zur Messung auf refclk ausgeben: Am Ende von rockchip_combphy_pcie_init chipabhängigen Bypasscode ergänzen:

<!-- en PDF p.69 -->

```text
/* For RK356X, RK3588 */
u32 val;
val = readl(priv->mmio + (0xd << 2));
val |= BIT(5);
writel(val,priv->mmio + (0xd << 2));

/* For RK3528 */
u32 val;
val = readl(priv->mmio + 0x108);
val |= BIT(29);
writel(val, priv->mmio + 0x108);
```

<!-- en PDF p.69 -->

Danach 24M, 25M und 100M nacheinander einstellen und refclk mit dem Oszilloskop auf Frequenz, Amplitude und Jitter prüfen. PCIe2.0 teilt den PHY mit SATA/USB; versehentlich gleichzeitige Aktivierung erzeugt ähnliche Meldungen beim Booten oder Aufwachen:

<!-- en PDF p.69 -->

```text
naneng-combphy 2b060000.phy: phy type select 2 overwriting type 4
rk-pcie 2a210000.pcie: PHY is reused by other controller, check the dts
```

<!-- en PDF p.69 -->

### 13.5 Memory-BAR-Zuweisungsfehler

<!-- en PDF p.69 -->

Ressourcenzuweisungsfehler der Peripherie fallen in drei Gruppen. Erstens Überschreitung der Plattformadressgrenzen; Größen siehe BAR-Adressraumfrage. Kennwort no space for: Das Gerät auf Bus 21 fordert 3GB 64-Bit-Speicher und überschreitet die Grenze. Ein kommerzielles Gerät wird so nicht unterstützt; bei eigenen Geräten mit dem Anbieter klären, ob die BAR-Größenkodierung geändert werden kann.

<!-- en PDF p.70 -->

```text
3.286864] pci 0002:20:00.0: bridge configuration invalid ([bus 01-ff]), reconfiguring
3.286886] scanning [bus 00-00] behind bridge, pass 1
3.288165] pci 0002:21 :00.0: supports D1 D2
3.288170] pci 0002:21 :00.0: PME# supported from DO D1 D3hot
3.298238] pci bus 0002:21: busn res: [bus 21-2f] end is updated to 21
3.298441] pci 0002:21:00.0: BAR 1: no space for [mem size 0xe0000000 ]
3.298456] pci 0002:21:00.0: BAR 1: failed to assign [mem size 0xe0000000 ]
3.298473] pci 0002:21:00.0: BAR 2: assigned [mem 0x380900000- 0x38090ffff pref ]
3.298488] pci 0002:21:00.0: PCI bridge to [bus 21]
```

<!-- en PDF p.70 -->

Zweitens ungültiger Class mit class 0x000000; lspci zeigt alle BARs unzugewiesen. Die korrekte Lösung ist eine Class-Korrektur durch den Modulanbieter. Falls unmöglich oder übergangsweise den gezeigten Quirk mit echten VID/PID und passendem Geräte-Class anwenden. Class-Typen stehen bei der Controller-Geräte-Zuordnung.

<!-- en PDF p.70 -->

```text
[    2.335899] pci 0000:02:04.0: [13fe:1730] type 00 class 0x000000
[    2.335986] pci 0000:02:04.0: reg 0x10: [io  0x0000-0x00ff]
[    2.336023] pci 0000:02:04.0: reg 0x14: [mem 0x00000000-0x0000007f]
[    2.336058] pci 0000:02:04.0: reg 0x18: [mem 0x00000000-0x000000ff]
[    2.342340] pci_bus 0000:02: busn_res: [bus 02-ff] end is updated to 02
[    2.342444] pci 0000:00:00.0: BAR 8: assigned [mem 0xf4200000-0xf42fffff]
[    2.342484] pci 0000:00:00.0: BAR 6: assigned [mem 0xf4300000-0xf430ffff pref]
[    2.342496] pci 0000:00:00.0: BAR 7: assigned [io  0x1000-0x1fff]
[    2.342510] pci 0000:01:00.0: BAR 8: assigned [mem 0xf4200000-0xf42fffff]
[    2.342519] pci 0000:01:00.0: BAR 7: assigned [io  0x1000-0x1fff]
[    2.342529] pci 0000:01:00.0: PCI bridge to [bus 02]
[    2.342546] pci 0000:01:00.0:   bridge window [io  0x1000-0x1fff]
[    2.342572] pci 0000:01:00.0:   bridge window [mem 0xf4200000-0xf42fffff]
[    2.342616] pci 0000:00:00.0: PCI bridge to [bus 01-ff]
[    2.342631] pci 0000:00:00.0:   bridge window [io  0x1000-0x1fff]
[    2.342645] pci 0000:00:00.0:   bridge window [mem 0xf4200000-0xf42fffff]
[    2.344896] pcieport 0000:00:00.0: Signaling PME with IRQ 87

lspci -vvv:

0000: 02:04.0 Non-VGA unclassified device: Advantech Co. Ltd Device 1730
Subsystem: Advantech Co. Ltd Device 1730
Flags: medium devsel, IRQ 255
I/O ports at[<unassigned> _disabled] [size=256]
Memory at <unassigned> (32-bit, non-prefetchabie) [disabled] [size=128]
Memory at <unassigned> (32-bit, non-prefetchable) [disabled] [size=256]
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@@ -207,6 +207,13 @@ static void quirk_mmio_always_on(struct pci_dev *dev)
 DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_ANY_ID, PCI_ANY_ID,
                                PCI_CLASS_BRIDGE_HOST, 8, quirk_mmio_always_on);

+static void quirk_class_id_fixup(struct pci_dev *dev)
+{
+       dev->class = 0x123456; /* Fixup your own class id ! */
+}
+
+DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_VENDOR_ID_FOO, PCI_DEVICE_ID_BAR, 8, quirk_class_id_fixup); /* Please Add Correct Vendor ID and Device ID ! */
```

<!-- en PDF p.71 -->

Prüffehler der Peripherie-BARs: Kennwörter assigned [mem und error updating; lspci zeigt unzugewiesene BARs. Die zurückgelesene Adresse stimmt wegen fehlerhaften Peripheriezustands nicht. Mögliche Ursachen sind Energiesparfehler, Probleme mit RC oberhalb Gen1 oder andere Modulfehler.

<!-- en PDF p.71 -->

```text
[    2.460092] pci 0002:21:00.0: calc_l1ss_pwron: Invalid T_PwrOn scale: 3
[    2.472049] pci_bus 0002:21: busn_res: [bus 21-2f] end is updated to 21
[    2.472089] pci 0002:20:00.0: BAR 8: assigned [mem 0xf2200000-0xf23fffff]
[    2.472105] pci 0002:20:00.0: BAR 6: assigned [mem 0xf2400000-0xf240ffff pref]
[    2.472124] pci 0002:21:00.0: BAR 0: assigned [mem 0xf2200000-0xf23fffff 64bit]
[    2.472139] pci 0002:21:00.0: BAR 0: error updating (0xf2200004 != 0xffffffff)
[    2.472153] pci 0002:21:00.0: BAR 0: error updating (high 0x000000 != 0xffffffff)
```

<!-- en PDF p.71 -->

Zuerst Modulversorgung, #PERST und 100M-Referenztakt gegen das Modulhandbuch messen. Beispielsweise kann Dauerstromversorgung beim QCNFA765 die Sequenz verletzen und diesen Fehler verursachen. Stimmen Hardware und Timing, die folgenden Patches nacheinander testen. Andernfalls den Anbieter zur Modulanalyse hinzuziehen.

<!-- en PDF p.71 -->

1. Modul-ASPM mit tatsächlichen PID/VID deaktivieren.

<!-- en PDF p.71 -->

```text
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@ -2356,6 +2356,7 @ static void quirk_disable_aspm_l0s_l1(struct pci_dev *dev) * disable both L0s and L1 for now to be safe.
*/
DECLARE_PCI_FIXUP_FINAL(PCI_VENDOR_ID_ASMEDIA, 0x1080, quirk_disable_aspm_l0s_l1);
+DECLARE_PCI_FIXUP_FINAL(PID, VID, quirk_disable_aspm_l0s_l1);  /* Please Add Correct Vendor ID and Device ID to disable L0s and L1 ASPM */
```

<!-- en PDF p.71 -->

2. Den Controller über max-link-speed im dtsi auf Gen1 begrenzen:

<!-- en PDF p.72 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
@@ -4552,7 +4552,7 @@
        num-ib-windows = <8>;
        num-ob-windows = <8>;
        num-viewport = <4>;
-       max-link-speed = <2>;
+       max-link-speed = <1>;
        msi-map = <0x4000 &its0 0x4000 0x1000>;
                num-lanes = <1>;
                phys = <&combphy0_ps PHY_TYPE_PCIE>;
```

<!-- en PDF p.72 -->

3. Versorgungsstabilisierungs- und #PERST-Resetzeit verlängern:

<!-- en PDF p.72 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
@@ -159,7 +159,7 @@
                regulator-max-microvolt = <3300000>;
                enable-active-high;
                gpios = <&gpio3 RK_PC3 GPIO_ACTIVE_HIGH>;
-               startup-delay-us = <5000>;
+               startup-delay-us = <500000>;
                vin-supply = <&vcc12v_dcin>;
        }; /* vcc3v3_pcie30 */

@@ -551,6 +551,7 @@
 &pcie3x4 {
        reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_HIGH>;
        vpcie3v3-supply = <&vcc3v3_pcie30>;
+       rockchip,perst-inactive-ms = <1000>;
        status = "okay";
 };
```

<!-- en PDF p.72 -->

4. Probleme sind bei bestimmten Qualcomm-Wi-Fi-Modulen einschließlich AR9xxx/QCA9xxx bekannt. Nicht-Qualcomm-Module benötigen diesen Patch nicht.

<!-- en PDF p.72 -->

```text
--- a/drivers/pci/pcie/aspm.c
+++ b/drivers/pci/pcie/aspm.c
@@ -192,12 +192,56 @@ static void pcie_clkpm_cap_init(struct pcie_link_state *link, int blacklist)
    link->clkpm_disable = blacklist ? 1 : 0;
 }

+static int pcie_downgrade_link_to_gen1(struct pci_dev *parent)
+{
+   u16 reg16;
+   u32 reg32;
+   int ret;
+
+   /* Check if link is capable of higher speed than 2.5 GT/s */
+   pcie_capability_read_dword(parent, PCI_EXP_LNKCAP, &reg32);
+   if ((reg32 & PCI_EXP_LNKCAP_SLS) <= PCI_EXP_LNKCAP_SLS_2_5GB)
+       return 0;
+
+   /* Check if link speed can be downgraded to 2.5 GT/s */
+   pcie_capability_read_dword(parent, PCI_EXP_LNKCAP2, &reg32);
+   if (!(reg32 & PCI_EXP_LNKCAP2_SLS_2_5GB)) {
+       pci_err(parent, "ASPM: Bridge does not support changing Link Speed to 2.5 GT/s\n");
+       return -EOPNOTSUPP;
+   }
+
+   /* Force link speed to 2.5 GT/s */
+   ret = pcie_capability_clear_and_set_word(parent, PCI_EXP_LNKCTL2,
+                        PCI_EXP_LNKCTL2_TLS,
+                        PCI_EXP_LNKCTL2_TLS_2_5GT);
+   if (!ret) {
+       /* Verify that new value was really set */
+       pcie_capability_read_word(parent, PCI_EXP_LNKCTL2, &reg16);
+       if ((reg16 & PCI_EXP_LNKCTL2_TLS) != PCI_EXP_LNKCTL2_TLS_2_5GT)
+           ret = -EINVAL;
+   }
+
+   if (ret) {
+       pci_err(parent, "ASPM: Changing Target Link Speed to 2.5 GT/s failed: %d\n", ret);
+       return ret;
+   }
+
+   pci_info(parent, "ASPM: Target Link Speed changed to 2.5 GT/s due to quirk\n");
+   return 0;
+}
+
 static bool pcie_retrain_link(struct pcie_link_state *link)
 {
    struct pci_dev *parent = link->pdev;
    unsigned long end_jiffies;
    u16 reg16;

+   if ((link->downstream->dev_flags & PCI_DEV_FLAGS_NO_RETRAIN_LINK_WHEN_NOT_GEN1) &&
+       pcie_downgrade_link_to_gen1(parent)) {
+       pci_err(parent, "ASPM: Retrain Link at higher speed is disallowed by quirk\n");
+       return false;
+   }
+
    pcie_capability_read_word(parent, PCI_EXP_LNKCTL, &reg16);
    reg16 |= PCI_EXP_LNKCTL_RL;
    pcie_capability_write_word(parent, PCI_EXP_LNKCTL, reg16);
diff --git a/drivers/pci/quirks.c b/drivers/pci/quirks.c
index 653660e3ba9e..4999ad9d08b8 100644
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@@ -3553,23 +3553,46 @@ static void mellanox_check_broken_intx_masking(struct pci_dev *pdev)
 DECLARE_PCI_FIXUP_FINAL(PCI_VENDOR_ID_MELLANOX, PCI_ANY_ID,
            mellanox_check_broken_intx_masking);

-static void quirk_no_bus_reset(struct pci_dev *dev)
+static void quirk_no_bus_reset_and_no_retrain_link(struct pci_dev *dev)
 {
-   dev->dev_flags |= PCI_DEV_FLAGS_NO_BUS_RESET;
+   dev->dev_flags |= PCI_DEV_FLAGS_NO_BUS_RESET |
+             PCI_DEV_FLAGS_NO_RETRAIN_LINK_WHEN_NOT_GEN1;
 }

 /*
- * Some Atheros AR9xxx and QCA988x chips do not behave after a bus reset.
+ * Atheros AR9xxx and QCA9xxx chips do not behave after a bus reset and also
+ * after retrain link when PCIe bridge is not in GEN1 mode at 2.5 GT/s speed.
  * The device will throw a Link Down error on AER-capable systems and
  * regardless of AER, config space of the device is never accessible again
  * and typically causes the system to hang or reset when access is attempted.
+ * Or if config space is accessible again then it contains only dummy values
+ * like fixed PCI device ID 0xABCD or values not initialized at all.
+ * Retrain link can be called only when using GEN1 PCIe bridge or when
+ * PCIe bridge has forced link speed to 2.5 GT/s via PCI_EXP_LNKCTL2 register.
+ * To reset these cards it is required to do PCIe Warm Reset via PERST# pin.
  * https://lore.kernel.org/r/20140923210318.498dacbd@dualc.maya.org/
+ * https://lore.kernel.org/r/87h7l8axqp.fsf@toke.dk/
+ * https://www.mail-archive.com/ath9k-devel@lists.ath9k.org/msg07529.html
  */
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0030, quirk_no_bus_reset);
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0032, quirk_no_bus_reset);
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x003c, quirk_no_bus_reset);
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0033, quirk_no_bus_reset);
-DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0034, quirk_no_bus_reset);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x002e,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0030,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0032,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0033,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0034,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x003c,
+            quirk_no_bus_reset_and_no_retrain_link);
+DECLARE_PCI_FIXUP_HEADER(PCI_VENDOR_ID_ATHEROS, 0x0042,
+            quirk_no_bus_reset_and_no_retrain_link);
+
+static void quirk_no_bus_reset(struct pci_dev *dev)
+{
+   dev->dev_flags |= PCI_DEV_FLAGS_NO_BUS_RESET;
+}

 /*
  * Root port on some Cavium CN8xxx chips do not successfully complete a bus
diff --git a/include/linux/pci.h b/include/linux/pci.h
index 86c799c97b77..fdbf7254e4ab 100644
--- a/include/linux/pci.h
+++ b/include/linux/pci.h
@@ -227,6 +227,8 @@ enum pci_dev_flags {
    PCI_DEV_FLAGS_NO_FLR_RESET = (__force pci_dev_flags_t) (1 << 10),
    /* Don't use Relaxed Ordering for TLPs directed at this device */
    PCI_DEV_FLAGS_NO_RELAXED_ORDERING = (__force pci_dev_flags_t) (1 << 11),
    /* Device does honor MSI masking despite saying otherwise */
    PCI_DEV_FLAGS_HAS_MSI_MASKING = (__force pci_dev_flags_t) (1 << 12),
+   /* Don't Retrain Link for device when bridge is not in GEN1 mode */
+   PCI_DEV_FLAGS_NO_RETRAIN_LINK_WHEN_NOT_GEN1 = (__force pci_dev_flags_t) (1 << 13),
 };
```

<!-- en PDF p.75 -->

Ungenutzte Switch-Ports belegen Ressourcen. Beim RK3588 kann jeder Root-Port 16MB 32-Bit-BAR vergeben. ASM2812 fordert beispielsweise 2MB pro Port unabhängig von angeschlossenen Geräten. lspci zeigt keine Geräte unter Ports 2/3/a/b des Switches auf Bus 12, dennoch belegen sie 8MB, sodass regulären Geräten Ressourcen fehlen.

<!-- en PDF p.75 -->

```text
[   22.005666] pci 0001:12:00.0: BAR 8: no space for [mem size 0x00600000]
[   22.040400] pci 0001:12:00.0: BAR 8: failed to assign [mem size 0x00600000]
[   22.040402] pci 0001:12:08.0: BAR 8: no space for [mem size 0x00600000]
[   22.040406] pci 0001:12:08.0: BAR 8: failed to assign [mem size 0x00600000]
[   22.067370] pci 0001:12:00.0: BAR 9: assigned [mem 0x940000000-0x9401fffff 64bit pref]
[   22.067373] pci 0001:12:02.0: BAR 8: no space for [mem size 0x00200000]
[   22.080018] pci 0001:12:02.0: BAR 8: failed to assign [mem size 0x00200000]
[   22.080022] pci 0001:12:02.0: BAR 9: assigned [mem 0x940200000-0x9403fffff 64bit pref]
[   22.093658] pci 0001:12:03.0: BAR 8: no space for [mem size 0x00200000]
[   22.093661] pci 0001:12:03.0: BAR 8: failed to assign [mem size 0x00200000]
[   22.093663] pci 0001:12:03.0: BAR 9: assigned [mem 0x940400000-0x9405fffff 64bit pref]
[   22.106310] pci 0001:12:08.0: BAR 9: assigned [mem 0x940600000-0x9407fffff 64bit pref]
[   22.106313] pci 0001:12:0a.0: BAR 8: no space for [mem size 0x00200000]
[   22.120756] pci 0001:12:0a.0: BAR 8: failed to assign [mem size 0x00200000]
[   22.130702] pci 0001:12:0a.0: BAR 9: assigned [mem 0x940800000-0x9409fffff 64bit pref]
[   22.130705] pci 0001:12:0b.0: BAR 8: no space for [mem size 0x00200000]
[   22.144573] pci 0001:12:0b.0: BAR 8: failed to assign [mem size 0x00200000]

lspci -vvt
-+-[0003:30]---00.0-[31]----00.0  Realtek Semiconductor Co., Ltd. Device [10ec:8125]
 +-[0001:10]---00.0-[11-18]----00.0-[12-18]--+-00.0-[13]----00.0  Aquantia Corp. Device
 |                                           +-02.0-[14]--
 |                                           +-03.0-[15]--
 |                                           +-08.0-[16]----00.0  Aquantia Corp. Device
 |                                           +-0a.0-[17]--
 |                                           \-0b.0-[18]--
 \-[0000:00]---00.0-[01-ff]----00.0  ASMedia Technology Inc. Device [1b21:1164]

lspci -nn
0000:00:00.0 PCI bridge [0604]: Fuzhou Rockchip Electronics Co., Ltd Device [1d87:3588] (rev 01)
0000:01:00.0 SATA controller [0106]: ASMedia Technology Inc. Device [1b21:1164] (rev 02)
0001:10:00.0 PCI bridge [0604]: Fuzhou Rockchip Electronics Co., Ltd Device [1d87:3588] (rev 01)
0001:11:00.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:00.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:02.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:03.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:08.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:0a.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:12:0b.0 PCI bridge [0604]: ASMedia Technology Inc. Device [1b21:2812] (rev 01)
0001:13:00.0 Ethernet controller [0200]: Aquantia Corp. Device [1d6a:14c0] (rev 03)
0001:16:00.0 Ethernet controller [0200]: Aquantia Corp. Device [1d6a:14c0] (rev 03)
0003:30:00.0 PCI bridge [0604]: Fuzhou Rockchip Electronics Co., Ltd Device [1d87:3588] (rev 01)
0003:31:00.0 Ethernet controller [0200]: Realtek Semiconductor Co., Ltd. Device [10ec:8125] (rev 05)
```

<!-- en PDF p.76 -->

Mit dem Switch-Hersteller eine Firmwareänderung zum Deaktivieren der BARs unbelegter Ports klären. Ist dies unmöglich und die Produkttopologie fest, ohne beliebiges Einstecken in Slots, folgende Filterpatches versuchen:

<!-- en PDF p.76 -->

```text
diff --git a/drivers/pci/probe.c b/drivers/pci/probe.c
index ece90a2..53bef6b 100644
--- a/drivers/pci/probe.c
+++ b/drivers/pci/probe.c
@@ -2794,6 +2794,37 @@ void __weak pcibios_fixup_bus(struct pci_bus *bus)
        /* nothing to do, expected to be removed in the future */
 }

+struct scan_blacklist_devfn {
+       u8 bus; /* bus number */
+       u8 dev; /* device number */
+       u8 func; /* function number */
+};
+
+#define ANY 0xff
+
+/* Please fill in the actual devices to be filtered in the sbl table, taking the above log as an example, filtering ports 2/3/a/b of bus12 */
+static struct scan_blacklist_devfn sbl[] = {
+       {12, 0x2, ANY},
+       {12, 0x3, ANY},
+       {12, 0xa, ANY},
+       {12, 0xb, ANY},
+};
+
+static bool pci_scan_check_blacklist(u8 bus, unsigned int devfn)
+{
+       int i;
+
+       for (i = 0; i < ARRAY_SIZE(sbl); i++) {
+               if (bus == sbl[i].bus && PCI_SLOT(devfn) == sbl[i].dev) {
+                       if (sbl[i].func == ANY)
+                               return true;
+                       else
+                               return sbl[i].func == PCI_FUNC(devfn);
+               }
+       }
+
+       return false;
+}
+
 /**
  * pci_scan_child_bus_extend() - Scan devices below a bus
  * @bus: Bus to scan for devices
@@ -2819,6 +2850,9 @@ static unsigned int pci_scan_child_bus_extend(struct pci_bus *bus,

        /* Go find them, Rover! */
        for (devfn = 0; devfn < 256; devfn += 8) {
+               if (pci_scan_check_blacklist(bus->number, devfn))
+                       continue;
+
                nr_devs = pci_scan_slot(bus, devfn);
```

<!-- en PDF p.77 -->

### 13.6 IO-BAR-Zuweisungsfehler

<!-- en PDF p.77 -->

Bei der Enumeration können IO-BAR-Schreibfehler mit assigned [io und error updating oder firmware Bug auftreten. IO-BAR-Einschränkungen im Gerätehandbuch prüfen:

<!-- en PDF p.77 -->

```text
dmesg | grep "0002:22"
[    2.324600] pci_bus 0002:22: extended config space not accessible
[    2.324764] pci 0002:22:00.0: [13f6:0111] type 00 class 0x040100
[    2.324873] pci 0002:22:00.0: [Firmware Bug]: reg 0x10: invalid BAR (can't size)
[    2.325445] pci 0002:22:00.0: supports D1 D2
[    2.331041] pci_bus 0002:22: busn_res: [bus 22-2f] end is updated to 22
```

<!-- en PDF p.77 -->

Oder:

<!-- en PDF p.77 -->

```text
console:/ $ dmesg | grep "0002:22"
[    2.434085] [  T117] pci_bus 0002:22: extended config space not accessible
[    2.434629] [  T117] pci 0002:22:00.0: [13f6:0111] type 00 class 0x040100
[    2.434842] [  T117] pci 0002:22:00.0: reg 0x10: initial BAR value 0x0000d000 invalid
[    2.434869] [  T117] pci 0002:22:00.0: reg 0x10: [io  size 0x0100]
[    2.435536] [  T117] pci 0002:22:00.0: supports D1 D2
[    2.458229] [  T117] pci_bus 0002:22: busn_res: [bus 22-2f] end is updated to 22
[    2.458542] [  T117] pci 0002:22:00.0: BAR 0: assigned [io  0x1000-0x10ff]
[    2.458581] [  T117] pci 0002:22:00.0: BAR 0: error updating (0x80801001 != 0x001001)
[    2.463002] [  T117] snd_cmipci 0002:22:00.0: enabling device (0080 -> 0081)
```

<!-- en PDF p.78 -->

Die Protokolle betreffen die PCI-Soundkarte CMI8738. PCI wurde ursprünglich für X86 entworfen; IO-BAR-Adressen sind daher meist klein. CMI8738 IO BAR0 ist auf 0xFF00 begrenzt; Patchbeispiel:

<!-- en PDF p.78 -->

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3568.dtsi b/arch/arm64/boot/dts/rockchip/rk3568.dtsi
index 9dc057637177..a060dcbf7df5 100644
--- a/arch/arm64/boot/dts/rockchip/rk3568.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568.dtsi
@@ -2311,7 +2311,7 @@
                phy-names = "pcie-phy";
                power-domains = <&power RK3568_PD_PIPE>;
                ranges = <0x00000800 0x0 0x80000000 0x3 0x80000000 0x0 0x800000
-                         0x81000000 0x0 0x80800000 0x3 0x80800000 0x0 0x100000
+                         0x81000000 0x0 0x00000000 0x3 0x80800000 0x0 0x100000
                          0x83000000 0x0 0x80900000 0x3 0x80900000 0x0 0x3f700000>;
                reg = <0x3 0xc0800000 0x0 0x400000>,
                      <0x0 0xfe280000 0x0 0x10000>;
```

<!-- en PDF p.78 -->

### 13.7 MSI/MSI-X nicht verfügbar

<!-- en PDF p.78 -->

Beim Portieren, besonders von Wi-Fi-Treibern, können MSI/MSI-X nicht nutzbar sein. menuconfig, besonders MSI, prüfen; sicherstellen, dass its in rk3568.dtsi nicht deaktiviert ist; lspci -vvv ausführen. Das Beispiel meldet 32 64-Bit-MSI, davon eines verwendet, aber Enable- bedeutet deaktiviert. Korrekt wären Enable+ und eine Adresse wie 0x00000000fd4400XX. Meist wurde der Treiber nicht geladen oder hat MSI/MSI-X nicht angefordert. pci_alloc_irq_vectors anhand etablierter Treiber und Documentation/PCI/MSI-HOWTO.txt implementieren und prüfen.

<!-- en PDF p.78 -->

```text
Capabilities: [58] MSI: Enable- Count=1/32 Maskable- 64bit+
                Address: 0000000000000000  Data: 0000
```

<!-- en PDF p.78 -->

Bei erfolgreicher Anforderung cat /proc/interrupts prüfen. ITS-MSI anhand des Treibernamens in der letzten Spalte suchen, etwa xhci_hcd. Theoretisch erhöht jede Übertragung den Zähler. Ohne oder bei gestörter Kommunikation bleibt er 0 oder steigt nach Kommunikationsstart nicht.

<!-- en PDF p.79 -->

```text
229: 0 0 0 0 0 0 ITS-MSI 524288 Edge xhci_hcd
```

<!-- en PDF p.79 -->

Bei sporadisch fehlenden MSI/MSI-X die IRQ-Nummer mit cat /proc/interrupts ermitteln und auf eine andere CPU verschieben, etwa IRQ229 auf CPU2 mit echo 2 > /proc/irq/229/smp_affinity_list. Mit einem Protokollanalysator prüfen, ob die Peripherie Interrupts sendet. Solche Analysatoren unterstützen meist keine verlöteten Geräte; eine Steckkarte vom Anbieter beziehen und auf RK-EVB mit Standardslot testen. Für M.2 key A/B/M/B+M/E anhand des M.2-Anhangs den passenden Adapter wählen.

<!-- en PDF p.79 -->

### 13.8 Fehler bei Enumeration und Peripheriekommunikation

<!-- en PDF p.79 -->

Beispiel ist ein NVMe-Gerät am RK3566-EVB2 mit Kommunikationsfehler nach normaler Enumeration. Korrekte Aktivierung zeigt enabling device (0000 -> 0002), etwa nvme 0000:01:00.0. Danach bei Fehlern oszilloskopisch Peripherieversorgung auf Einbrüche, #PERST auf unbeabsichtigte Resets sowie PHY-0v9/1v8 auf Versorgungsfehler prüfen. RK-EVB multiplexen viele Signale; Jumper teilen #PERST mit anderen IOs. Mit Hardwareentwicklung klären; fehlerhafte Jumper einiger RK3566-EVB2 sind bekannt und zu korrigieren.

<!-- en PDF p.79 -->

```text
[    2.426038] pci 0000:00:00.0:   bridge window [mem 0x300900000-0x3009fffff]
[    2.426183] pcieport 0000:00:00.0: of_irq_parse_pci: failed with rc=-22
[    2.427493] pcieport 0000:00:00.0: Signaling PME with IRQ 106
[    2.427712] pcieport 0000:00:00.0: AER enabled with IRQ 115
[    2.427899] pcieport 0000:00:00.0: of_irq_parse_pci: failed with rc=-22
[    2.428202] nvme nvme0: pci function 0000:01:00.0
[    2.428259] nvme 0000:01:00.0: enabling device (0000 -> 0002)
[    2.535404] nvme nvme0: missing or invalid SUBNQN field.
[    2.535522] nvme nvme0: Shutdown timeout set to 8 seconds
...
[   48.129408] print_req_error: I/O error, dev nvme0n1, sector 0
[   48.137197] nvme 0000:01:00.0: enabling device (0000 -> 0002)
[   48.137299] nvme nvme0: Removing after probe failure status: -19
[   48.147182] Buffer I/O error on dev nvme0n1, logical block 0, async page read
[   48.162900] nvme nvme0: failed to set APST feature (-19)
```

<!-- en PDF p.80 -->

### 13.9 Firmwarefehler bei Enumeration

<!-- en PDF p.80 -->

Die folgenden zwei Fehlerarten bei BAR-Zuweisung bedeuten meist Protokollinkompatibilität des BAR-Raums. Ein Quirk in drivers/pci/quirks.c ist nötig; Details beim Hersteller erfragen. Für JMB585 ist wiederholtes BAR-Lesen zur Behebung eines Firmwarefehlers bekannt. echo 1 > /sys/bus/pci/rescan scannt den Bus erneut und kann helfen.

<!-- en PDF p.80 -->

```text
Type 1:
[    2.379768] rk-pcie 3c0000000.pcie: PCIe Link up, LTSSM is 0x30011
[    2.380155] rk-pcie 3c0000000.pcie: PCI host bridge to bus 0000:00
[    2.380187] pci_bus 0000:00: root bus resource [bus 00-0f]
[    2.380204] pci_bus 0000:00: root bus resource [??? 0x300000000-0x3007fffff flags 0x0] (bus address [0x00000000-0x007fffff])
[    2.380217] pci_bus 0000:00: root bus resource [io  0x0000-0xfffff] (bus address
[0x800000-0x8fffff])
[    2.380230] pci_bus 0000:00: root bus resource [mem 0x300900000-0x33fffffff] (bus address
[0x00900000-0x3fffffff])
[    2.394983] pci 0000:01:00.0: [Firmware Bug] reg 0x10: invalid BAR (can't size)

Type 2:
[    2.548219] pci 0000:01:00.0: [10ec:b723] type 00 class 0x028000
[    2.548389] pci 0000:01:00.0: reg 0x10: initial BAR value 0x00000000 invalid
[    2.548426] pci 0000:01:00.0: reg 0x10: [io  size 0x0100]
[    2.548549] pci 0000:01:00.0: reg 0x18: [mem 0x00000000-0x00003fff 64bit]
[    2.549132] pci 0000:01:00.0: supports D1 D2
[    2.549138] pci 0000:01:00.0: PME# supported from D0 D1 D2 D3hot D3cold
```

<!-- en PDF p.80 -->

### 13.10 Ausnahmen beim Zugriff auf neu abgebildeten BAR

<!-- en PDF p.80 -->

1. ioremap eines BAR im Kernel mit anschließendem memset/memcpy erzeugt alignment fault. mmap im Userspace mit memset/memcpy erzeugt sigbug, so die Quellschreibweise. Ursache sind memcpy-Ausrichtungsoptimierungen oder memset mit ARM64-DC-ZVA-Instruktionen, die Device Memory nGnRE nicht unterstützen.

<!-- en PDF p.81 -->

```text
[    69.195811] Unhandled fault: alignment fault (0x96000061) at 0xffffff8009800000
[    69.195829] Internal error: : 96000061 [#1] PREEMPT SMP
[    69.363352] Modules linked in:
[    69.363655] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 4.19.172 #691
[    69.364205] Hardware name: Rockchip rk3568 evb board (DT)
[    69.364688] task: ffffffc00a300000 task.stack: ffffffc00a2dc000
[    69.365227] PC is at __memset+0x16c/0x190
[    69.365593] LR is at snda_alloc_res+0xac/0xfc
[    69.366054] pc : [<ffffff800839a2ac>] lr : [<ffffff80085055b8>] pstate: 404000c5
[    69.366713] sp : ffffffc00a2df810
```

<!-- en PDF p.81 -->

memset_io oder memset_fromio/memset_toio verwenden; Namen aus der Quelle übernommen. Im Userspace per Zuweisungsschleife kopieren/löschen. Wegen Ausrichtungsanforderungen bei solchen Ausnahmen CONFIG_ROCKCHIP_ARM64_ALIGN_FAULT_FIX dringend empfohlen.

<!-- en PDF p.81 -->

2. Beim RK3588 kann eine BAR-Zuweisungsausnahme bedeuten, dass der Compiler vier aufeinanderfolgende Adresszugriffe zu einem nicht unterstützten 16-Byte-Zugriff zusammengefasst hat.

<!-- en PDF p.81 -->

```text
[14037.477507][    C3] SError Interrupt on CPU3, code 0xbe000011 -- SError
[14037.477512][    C3] CPU: 3 PID: 2037 Comm: memtest Not tainted 5.10.110 #1690
[14037.477514][    C3] Hardware name: Rockchip RK3588 EVB1 LP4 V10 Board (DT)
[14037.477516][    C3] pstate: 00001000 (nzcv daif -PAN -UAO -TCO BTYPE=--)
[14037.477518][    C3] pc : 0000000000405d58
[14037.477519][    C3] lr : 0000000000405fb4
[14037.477521][    C3] sp : 0000007fc48effd0
[14037.477522][    C3] x29: 0000007fc48effd0 x28: 0000000000000000
[14037.477529][    C3] x27: 0000000000452000 x26: 000000000048b000
[14037.477533][    C3] x25: 000000000048b000 x24: 0000000000000018
[14037.477537][    C3] x23: 0000000000489030 x22: 0000000000400280
[14037.477541][    C3] x21: 0000000000000000 x20: 0000000000400eb8
[14037.477545][    C3] x19: 0000000000400df0 x18: 0000000000000000
[14037.477549][    C3] x17: 0000000000417e00 x16: 0000000000489030
[14037.477554][    C3] x15: 000000000572c738 x14: 0000000000000000
[14037.477558][    C3] x13: 0000000000000150 x12: 000000000048b000
[14037.477562][    C3] x11: 0000000000000000 x10: 0000200000000000
[14037.477566][    C3] x9 : 00003fffffffffff x8 : 00000000000000de
[14037.477570][    C3] x7 : 0000000000000000 x6 : 000000000048af30
[14037.477574][    C3] x5 : 00000000f0000000 x4 : 0000000000000000
[14037.477578][    C3] x3 : 0000000000000001 x2 : 0000000000000001
[14037.477582][    C3] x1 : 0000000000489058 x0 : 0000000000000000
[14037.477587][    C3] Kernel panic - not syncing: Asynchronous SError Interrupt
[14037.477589][    C3] CPU: 3 PID: 2037 Comm: memtest Not tainted 5.10.110 #1690
[14037.477590][    C3] Hardware name: Rockchip RK3588 EVB1 LP4 V10 Board (DT)
[14037.477592][    C3] Call trace:
[14037.477593][    C3]  dump_backtrace+0x0/0x1a8
[14037.477594][    C3]  show_stack+0x18/0x28
[14037.477596][    C3]  dump_stack_lvl+0xcc/0xf4
[14037.477598][    C3]  dump_stack+0x18/0x58
[14037.477600][    C3]  panic+0x170/0x36c
[14037.477602][    C3]  nmi_panic+0x8c/0x90
[14037.477603][    C3]  arm64_serror_panic+0x78/0x84
[14037.477605][    C3]  arm64_is_fatal_ras_serror+0x34/0xc8
[14037.477607][    C3]  do_serror+0x6c/0x98
[14037.477608][    C3]  el0_error_naked+0x14/0x1c
[14037.477622][    C2] CPU2: stopping
[14037.477684][    C0] CPU0: stopping
[14037.477711][    C1] CPU1: stopping
[14037.477718][    C1] CPU: 1 PID: 0 Comm: swapper/1 Not tainted 5.10.110 #1690
[14037.477720][    C1] Hardware name: Rockchip RK3588 EVB1 LP4 V10 Board (DT)
[14037.477722][    C1] Call trace:
[14037.477729][    C1]  dump_backtrace+0x0/0x1a8
[14037.477734][    C1]  show_stack+0x18/0x28
[14037.477739][    C7] CPU7: stopping
[14037.477744][    C1]  dump_stack_lvl+0xcc/0xf4
[14037.477749][    C6] CPU6: stopping
[14037.477753][    C1]  dump_stack+0x18/0x58
[14037.477760][    C1]  local_cpu_stop+0x60/0x70
[14037.477764][    C1]  ipi_handler+0x1a4/0x310
[14037.477769][    C4] CPU4: stopping
[14037.477778][    C1]  handle_percpu_devid_fasteoi_ipi+0x7c/0x1c8
```

<!-- en PDF p.82 -->

Ist addr die neu abgebildete BAR-Adresse mit vier aufeinanderfolgenden Zuweisungen, barrier() an einer der Stellen 1, 2 oder 3 ergänzen.

<!-- en PDF p.82 -->

```text
/* If used in user space, the following implementation of barrier is required */
# define barrier() __asm__ __volatile__("": : :"memory")

*((u32 *)((void *)addr + 0x0)) = 0x11111111;
/* Code Point 1 */
*((u32 *)((void *)addr + 0x4)) = 0x44444444;
/* Code Point 2 */
*((u32 *)((void *)addr + 0x8)) = 0x88888888;
/* Code Point 3 */
*((u32 *)((void *)addr + 0xc)) = 0xcccccccc;
```

<!-- en PDF p.82 -->

3. BAR-Zugriffe benötigen gerade ausgerichtete Adressen, die ein Vielfaches der Zugriffslänge sind: DWord darf nicht nur word-ausgerichtet sein, sondern mindestens DWord oder QWord. Compileroptimierung beachten: Userspace mit -O0 bauen, damit Lese-/Schreibbefehle erhalten bleiben. Bei Bibliotheken zusätzlich LTO deaktivieren, üblicherweise über -flto im Makefile.

<!-- en PDF p.83 -->

### 13.11 PCIe-USB-xhci-Ladefehler

<!-- en PDF p.83 -->

Bei manchen PCIe-USB-Chips, etwa VL805, scheitert nach Linkaufbau das Laden des Treibers am xHCI-Reset-Warten. Vermutlich braucht der Brückenchip ein Firmwareupdate. Auf einem PC testen und bei bestätigtem Updatebedarf den Anbieter kontaktieren.

<!-- en PDF p.83 -->

```text
[ 6.289987] pci 0000:01:00.0: xHCI HW not ready after 5 sec (HC bug?) status = 0x811
[ 6.531098] xhci_hcd 0000:01:00.0: xHCI Host Controller
[ 6.531803] xhci_hcd 0000:01:00.0: new USB bus registered, assigned bus number 3
[ 16.532539] xhci_hcd 0000:01:00.0: can't setup: -110
[ 16.533033] xhci_hcd 0000:01:00.0: USB bus 3 deregistered
[ 16.533712] xhci_hcd 0000:01:00.0: init 0000:01:00.0 fail, -110
[ 16.534281] xhci_hcd: probe of 0000:01:00.0 failed with error -110
```

<!-- en PDF p.83 -->

Bleibt das Problem bestehen, folgenden Patch für drivers/usb/host/pci-quirks.c versuchen:

<!-- en PDF p.83 -->

```text
diff --git a/drivers/usb/host/pci-quirks.c b/drivers/usb/host/pci-quirks.c
index 3ea435c..cca536d 100644
--- a/drivers/usb/host/pci-quirks.c
+++ b/drivers/usb/host/pci-quirks.c
@@ -1085,8 +1085,11 @@ static void quirk_usb_early_handoff(struct pci_dev *pdev)
    /* Skip Netlogic mips SoC's internal PCI USB controller.
     * This device does not need/support EHCI/OHCI handoff
     */
-   if (pdev->vendor == 0x184e) /* vendor Netlogic */
+   if ((pdev->vendor == 0x184e) ||
+       (pdev->vendor == PCI_VENDOR_ID_VIA && pdev->device == 0x3483)) {
+       /* Taking VL805 as an example, other chips should fill in the correct vendor ID and device ID */
+       dev_warn(&pdev->dev, "bypass xhci quirk for VL805\n");
        return;
+   }
    if (pdev->class != PCI_CLASS_SERIAL_USB_UHCI &&
            pdev->class != PCI_CLASS_SERIAL_USB_OHCI &&
            pdev->class != PCI_CLASS_SERIAL_USB_EHCI &&
```

<!-- en PDF p.83 -->

### 13.12 PCIe3.0-Systemfehler beim Schlafen/Aufwachen

<!-- en PDF p.83 -->

Der Schlaf-/Aufwachfehler entsteht durch Beeinflussung der Taktgeneratorversorgung beim Abschalten von 3.3v. Drei Punkte prüfen: sinnvolle min/max-Werte von vpcie3v3-supply im DTS; messen, ob der Generator vor Schlaf abgeschaltet, nach fehlgeschlagenem Schlaf wieder eingeschaltet wurde oder unzureichende Entladung ihn störte; 3.3v und Generator testweise extern versorgen, um Versorgungsfehler auszuschließen.

<!-- en PDF p.84 -->

```text
[   17.406781] PM: suspend entry (deep)
[   17.406839] PM: Syncing filesystems ... done.
[   17.471710] Freezing user space processes ... (elapsed 0.002 seconds) done.
[   17.474337] OOM killer disabled.
[   17.474343] Freezing remaining freezable tasks ... (elapsed 0.001 seconds) done.
[   17.476200] Suspending console(s) (use no_console_suspend to debug)
[   17.479152] android_work: sent uevent USB_STATE=DISCONNECTED
[   17.480290] [WLAN_RFKILL]: Enter rfkill_wlan_suspend
[   17.501382] rk-pcie 3c0000000.pcie: fail to set vpcie3v3 regulator
[   17.501406] dpm_run_callback(): genpd_suspend_noirq+0x0/0x18 returns -22
[   17.501418] PM: Device 3c0000000.pcie failed to suspend noirq: error -22
[   38.506580] rcu: INFO: rcu_preempt detected stalls on CPUs/tasks:
[   38.506601] rcu:  1-...0: (1 GPs behind) idle=25a/1/0x4000000000000000 softirq=4657/4657 fqs=2100
[   38.506604] rcu:  (detected by 0, t=6302 jiffies, g=4609, q=17)
[   38.506613] Task dump for CPU 1:
[   38.506617] kworker/u8:4    R  running task        0  1380      2 0x0000002a
[   38.506642] Workqueue: events_unbound async_run_entry_fn
[   38.506647] Call trace:
[   38.506657]  __switch_to+0xe4/0x138
[   38.506667]  pci_pm_resume_noirq+0x0/0x120
[  101.523233] rcu: INFO: rcu_preempt detected stalls on CPUs/tasks:
[  101.523250] rcu:  1-...0: (1 GPs behind) idle=25a/1/0x4000000000000000 softirq=4657/4657 fqs=8402
[  101.523253] rcu:  (detected by 0, t=25207 jiffies, g=4609, q=17)
[  101.523260] Task dump for CPU 1:
[  101.523264] kworker/u8:4    R  running task        0  1380      2 0x0000002a
[  101.523284] Workqueue: events_unbound async_run_entry_fn
[  101.523288] Call trace:
[  101.523297]  __switch_to+0xe4/0x138
[  101.523307]  pci_pm_resume_noirq+0x0/0x120
```

<!-- en PDF p.84 -->

### 13.13 PCIe-PM-Wechsel verursacht Modulfehler

<!-- en PDF p.84 -->

Einige Wi-Fi-Module wechseln beim Aufwachen ihre Einstellung nicht von D3 hot nach D0 und verursachen Fehler. Da der Controllertreiber den Link ohnehin in L2 zwingt und zurücksetzt, erreichen Link und Gerät anschließend L0/D0. Ob der Protokollstack D0 erfolgreich setzt, beeinflusst deshalb die spätere Nutzung nicht. Die angegebenen Patches können nacheinander versucht werden.

<!-- en PDF p.84 -->

```text
[ 848.869840] PM: Some devices failed to suspend, or early wake event detected
[ 848.871600] rtl88x2ce 0000:01:00.0: Refused to change power state, currently in D3
[ 848.946128] rtl88x2ce 0000:01:00.0: Refused to change power state, currently in D3
[ 848.962770] rtl88x2ce 0000:01:00.0: Refused to change power state, currently in D3
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@@ -1859,6 +1865,15 @@ static void quirk_d3hot_delay(struct pci_dev *dev, unsigned int delay)
                 dev->d3_delay);
 }

+ /* Some devices report short delay it actually need, fix them! */
+static void quirk_wifi_pm(struct pci_dev *dev)
+{
+       /* Ask your vendor how long it takes for D3 to D0 !!! */
+       if (dev->vendor == PCI_VENDOR_ID_FOO && dev->device == PCI_DEVICE_ID_BAR)
+               quirk_d3hot_delay(dev, 200); /* e.g 200ms, can be more for test */
+}
+
+DECLARE_PCI_FIXUP_FINAL(PCI_VENDOR_ID_FOO, PCI_DEVICE_ID_BAR, quirk_wifi_pm);
+/* Please Add your own PID and VID */
--- a/drivers/pci/quirks.c
+++ b/drivers/pci/quirks.c
@@ -1334,6 +1334,12 @@ DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_VENDOR_ID_AL, PCI_ANY_ID,
 DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_VENDOR_ID_VIA, PCI_ANY_ID,
                                PCI_CLASS_STORAGE_IDE, 8, quirk_no_ata_d3);

+/* Some Wireless devices cannot transit from D3 to D0 by writing PCI_PM_CTRL */
+DECLARE_PCI_FIXUP_CLASS_EARLY(PCI_VENDOR_ID_FOO, PCI_DEVICE_ID_BAR,
+                             PCI_CLASS_NOT_DEFINED, 8, quirk_no_ata_d3);
+/* Please Add your own PID and VID */
--- a/drivers/pci/pci.c
+++ b/drivers/pci/pci.c
@@ -818,7 +818,7 @@ static int pci_raw_set_power_state(struct pci_dev *dev, pci_power_t state)
        if (!dev->pm_cap)
            return -EIO;
+       /* Block all requests to D3hot */
+       if (state == PCI_D3hot)
+           return 0;
```

<!-- en PDF p.85 -->

### 13.14 Schlaf-/Aufwach- und Verbindungsfehler

<!-- en PDF p.85 -->

PCIe-Peripherie sollte im Schlaf grundsätzlich abgeschaltet werden. Bei langsamer Hardwareentladung kann schnelles Aufwachen vor vollständigem Spannungsabbau erneut einschalten und das Modul stören. Dies betrifft häufig, aber nicht ausschließlich NVMe mit großen Kondensatoren zum Schutz vor Stromausfall. Der folgende Risikotestpatch reproduziert solche Fehler meist schnell.

<!-- en PDF p.85 -->

```text
--- a/kernel/cpu.c
+++ b/kernel/cpu.c
@@ -1724,11 +1724,11 @@ int freeze_secondary_cpus(int primary)
                if (cpu == primary)
                        continue;

-               if (pm_wakeup_pending()) {
+               //if (pm_wakeup_pending()) {
                        pr_info("Wakeup pending. Abort CPU freeze\n");
                        error = -EBUSY;
                        break;
-               }
+               //}

                trace_suspend_resume(TPS("CPU_OFF"), cpu, true);
                error = _cpu_down(cpu, 1, CPUHP_OFFLINE);
```

<!-- en PDF p.86 -->

Hardwareseitig die Entladung des PCIe-Moduls optimieren und die maximale Dauer t bestimmen. Softwareseitig eine Aus-/Einschaltverzögerung ergänzen, damit beim Aufwachen erst nach t erneut versorgt wird. Beispiel:

<!-- en PDF p.86 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
@@ -63,6 +63,7 @@
                enable-active-high;
                gpio = <&gpio0 RK_PD4 GPIO_ACTIVE_HIGH>;
                startup-delay-us = <5000>;
+               off-on-delay-us = <500000>; //The maximum duration t provided by hardware
                vin-supply = <&dc_12v>;
        };
```

<!-- en PDF p.86 -->

### 13.15 Gerät erhält Legacy-IRQ 0

<!-- en PDF p.86 -->

```text
0002:21:00.0 Serial controller: Device 1c00:3853 (rev 10) (prog-if 05 [16850])
        Subsystem: Device 1c00:3853
        Control: I/O- Mem- BusMaster- SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR- FastB2B- DisINTx-
        Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort- >SERR- <PERR- INTx-
        Interrupt: pin A routed to IRQ 0
        Region 0: I/O ports at 1000 [disabled] [size=256]
        Region 1: Memory at 380900000 (32-bit, prefetchable) [disabled] [size=32K]
        Region 2: I/O ports at 100100 [disabled] [size=4]
        [virtual] Expansion ROM at 380908000 [disabled] [size=32K]
        Capabilities: [60] Power Management version 3
```

<!-- en PDF p.87 -->

Pin A erhielt Legacy-IRQ 0, den unzugewiesenen Standardzustand. Unabhängig von MSI-Abschaltung in cmdline sollte der Stack beim Laden des PCI-Bustreibers pci_assign_irq aufrufen, den Pin aus Konfigurationsregister 0x3d lesen, einen virtuellen IRQ zuordnen und in 0x3c schreiben. Normalerweise muss daher die Legacy-IRQ-Abfrage funktionieren. Andernfalls kann die Peripherie keine korrekten Legacy-Interrupts senden und der Treiber wird beeinträchtigt. Manche Portierungen von Nicht-Linux-Treibern passen das PCI-Busmodell nicht korrekt an; pci_assign_irq wird nicht aufgerufen und der IRQ bleibt unzugewiesen.

<!-- en PDF p.87 -->

### 13.16 Peripherie-IO-Raum nicht zugänglich

<!-- en PDF p.87 -->

```text
0002:21:00.0 Serial controller: Device 1c00:3853 (rev 10) (prog-if 05 [16850])
        Subsystem: Device 1c00:3853
        Control: I/O- Mem- BusMaster- SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR- FastB2B- DisINTx-
        Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort- >SERR- <PERR- INTx-
        Interrupt: pin A routed to IRQ 0
        Region 0: I/O ports at 1000 [disabled] [size=256]
        Region 1: Memory at 380900000 (32-bit, prefetchable) [disabled] [size=32K]
        Region 2: I/O ports at 100100 [disabled] [size=4]
        [virtual] Expansion ROM at 380908000 [disabled] [size=32K]
        Capabilities: [60] Power Management version 3

0002:21:00.0 Serial Controler; device 1c00:3853 (rev 10)
00: 00 1c 53 38 00 00 10 00 10 05 00 07 00 00 00 00
10: 01 00 80 80 08 00 90 80 01 01 80 80 00 00 00 00
20: 00 00 00 00 00 00 00 00 00 00 00 00 00 1c 53 38
30: 00 00 00 00 60 00 00 00 00 00 00 00 00 01 00 00

console:/ # cat /proc/ioports
00000000-000fffff : I/O
  00001000-00001fff : PCI Bus 0002:21
    00001000-00001007 : 0002:21:00.0
    00001008-0000100f : 0002:21:00.2
    00001010-00001017 : 0002:21:00.2
```

<!-- en PDF p.87 -->

lspci zeigt IO-Port 0x1000 und PCIe-Bus 0x80800000. In rk3568.dtsi beginnt physischer IO für PCIe3x2 bei 0x380800000, entsprechend Bus 0x80800000. Physisches 0x1000 darf nicht direkt über IO/devmem oder ioremap angesprochen werden; dies verursacht Ausnahmen.

<!-- en PDF p.88 -->

Historischer Grund: x86 trennt IO- und Memory-Ports; der Bereich unter 16M dient IO. ARM emuliert PCIe-IO über Memory-Ports. Der Stack rechnet IO-Adressen um, damit sie unter 16M bleiben und x86 ähneln: Basis 0x1000, 4K-ausgerichtet. Somit entspricht lspci-0x1000 dem physischen 0x380800000 für IO/devmem, 0x1010 entsprechend 0x380800010. Für eigene Treiber siehe 8250_port.c und 8250_pci.c: pci_ioremap_bar zusammen mit request_region liefert reale physische IO- und iomap-CPU-Adressen.

<!-- en PDF p.88 -->

### 13.17 Wechselnde PCIe-SATA-Laufwerksnummern

<!-- en PDF p.88 -->

Threadbasierte Initialisierung legt die Reihenfolge externer SATA-Chips an mehreren PCIe-Controllern nicht fest. Laufwerke innerhalb eines Chips sind fest geordnet, zwischen Chips jedoch nicht: erster Chip sda–sdd und zweiter sde–sdh, beim nächsten Boot eventuell umgekehrt. Die Anwendung kann Laufwerkspfade durchlaufen, SATA-Chips über die Controlleradresse wie fe160000.pcie identifizieren und feste Symlinks anlegen. Alternativ Threadinitialisierung durch Entfernen von CONFIG_PCIE_RK_THREADED_INIT deaktivieren.

<!-- en PDF p.88 -->

```text
ls -al /sys/block/sd*

rwxrwxrwx    1 root     root             0 Jan  1 00:00 /sys/block/sda -> ../devices/platform/fe160000.pcie/pci0001:10/0001:10:00.0/0001:11:00.0/ata2/host1/target1:0:0/1:0:0:0/block/sda

lrwxrwxrwx    1 root     root             0 Jan  1 00:00 /sys/block/sdb -> ../devices/platform/fe160000.pcie/pci0001:10/0001:10:00.0/0001:11:00.0/ata3/host2/target2:0:0/2:0:0:0/block/sdb

lrwxrwxrwx    1 root     root             0 Jan  1 00:03 /sys/block/sdc -> ../devices/platform/fe160000.pcie/pci0001:10/0001:10:00.0/0001:11:00.0/ata4/host3/target3:0:0/3:0:0:0/block/sdc

lrwxrwxrwx    1 root     root             0 Jan  1 00:00 /sys/block/sdd -> ../devices/platform/fe160000.pcie/pci0001:10/0001:10:00.0/0001:11:00.0/ata5/host4/target4:0:0/4:0:0:0/block/sdd
```

<!-- en PDF p.89 -->

### 13.18 PCIe-Link steht, Enumeration fehlt

<!-- en PDF p.89 -->

Der Link steht, das Gerät wird aber nicht enumeriert: lspci sieht beispielsweise Root-Port-Bus 0, nicht den nachgelagerten Bus 1.

<!-- en PDF p.89 -->

```text
rk-pcie fe150000.pcie: PCIe Link up, LTSSM is 0x30011
rk-pcie fe150000.pcie: PCI host bridge to bus 0000:00
pci_bus 0000:00: root bus resource [bus 00-0f]
pci_bus 0000:00: root bus resource [??? 0xf0000000-0xf00fffff flags 0x0]
pci_bus 0000:00: root bus resource [io  0x300000-0x3fffff] (bus address [0xf0100000-0xf01fffff])
pci_bus 0000:00: root bus resource [mem 0xf0200000-0xf0ffffff]
pci_bus 0000:00: root bus resource [mem 0x900000000-0x93fffffff pref]
pci 0000:00:00.0: [1d87:3588] type 01 class 0x060400
pci 0000:00:00.0: reg 0x10: [mem 0x00000000-0x3fffffff]
pci 0000:00:00.0: reg 0x14: [mem 0x00000000-0x3fffffff]
pci 0000:00:00.0: reg 0x38: [mem 0x00000000-0x0000ffff pref]
pci 0000:00:00.0: supports D1 D2
pci 0000:00:00.0: PME# supported from D0 D1 D3hot

lspci
0000:00:00.0 PCI bridge: Fuzhou Rockchip Electronics Co., Ltd Device 3588 (rev 01) (prog-if 00 [Normal decode])
```

<!-- en PDF p.89 -->

Ursache ist eine ungültige Vendor-ID des Bus-1-Geräts. Ausgabe in pci_bus_generic_read_dev_vendor_id in drivers/pci/probe.c ergänzen; der Stack kennt vier ungültige ID-Typen.

<!-- en PDF p.89 -->

```text
--- a/drivers/pci/probe.c
+++ b/drivers/pci/probe.c
@@ -2314,6 +2314,8 @@ bool pci_bus_generic_read_dev_vendor_id(struct pci_bus *bus, int devfn, u32 *l,
        if (pci_bus_read_config_dword(bus, devfn, PCI_VENDOR_ID, l))
                return false;

+       dev_info(&bus->dev, "vendor id is 0x%x\n", *l);
+
        /* Some broken boards return 0 or ~0 if a slot is empty: */
        if (*l == 0xffffffff || *l == 0x00000000 ||
            *l == 0x0000ffff || *l == 0xffff0000)
```

<!-- en PDF p.89 -->

ZX-200 benötigt nach Resetfreigabe länger zum Laden/Ausführen des bin. Enumeriert der RC sofort nach Link-up, kann die interne Software noch nicht bereit sein und ID 0 liefern. Folgenden Patch versuchen; andernfalls den Gerätehersteller zur Analyse hinzuziehen.

<!-- en PDF p.90 -->

```text
--- a/drivers/pci/controller/dwc/pcie-dw-rockchip.c
+++ b/drivers/pci/controller/dwc/pcie-dw-rockchip.c
@@ -814,7 +814,7 @@ static int rk_pcie_establish_link(struct dw_pcie *pci)
                         * that LTSSM max timeout is 24ms per period, we can wait a bit
                         * more for Gen switch.
                         */
-                       msleep(50);
+                       msleep(1000);
                        /* In case link drop after linkup, double check it */
                        if (dw_pcie_link_up(pci)) {
                                dev_info(pci->dev, "PCIe Link up, LTSSM is 0x%x\n",
```

<!-- en PDF p.90 -->

### 13.19 Enumeration erfolgreich, Zugriff gestört

<!-- en PDF p.90 -->

Zu kurze #PERST-Zeit kann sporadisch Enumeration erlauben, aber den Betrieb stören. Beispiel ist RTL8111 hinter einem PCIe-Switch. Resetzeit über rockchip,perst-inactive-ms im DTS erhöhen; siehe Eigenschaftsbeschreibung.

<!-- en PDF p.90 -->

```text
[    8.739794] enP4p67s0f0: 0xffffffc0127bd000, 86:41:ff:d2:48:a0, IRQ 133
[   10.178084] ------------[ cut here ]------------
[   10.178100] WARNING: CPU: 6 PID: 691 at drivers/net/ethernet/realtek/r8168/r8168_n.c:7291 rtl8168_wait_phy_ups_resume+0x6c/0x88
[   10.178104] Modules linked in:
[   10.178112] CPU: 6 PID: 691 Comm: dhcpcd Not tainted 5.10.66 #1
[   10.178116] Hardware name: Rockchip RK3588 NVR DEMO LP4 V10 Board (DT)
[   10.178121] pstate: 60400089 (nZCv daIf +PAN -UAO -TCO BTYPE=--)
[   10.178127] pc : rtl8168_wait_phy_ups_resume+0x6c/0x88
[   10.178132] lr : rtl8168_wait_phy_ups_resume+0x54/0x88
[   10.178135] sp : ffffffc01358ba30
[   10.178139] x29: ffffffc01358ba30 x28: 0000000000001043
[   10.178145] x27: 0000000000000000 x26: 0000000000008914
[   10.178151] x25: 0000000000000000 x24: ffffff8102e10c38
[   10.178157] x23: 0000000000418958 x22: 0000000000000002
[   10.178163] x21: ffffff8102e109c0 x20: 0000000000000064
[   10.178168] x19: 0000000000000007 x18: 0000000000000000
[   10.178174] x17: 0000000000000000 x16: 0000000000000000
[   10.178179] x15: 000000000000000a x14: 00000000000b49d2
[   10.178186] x13: 0000000000000006 x12: ffffffffffffffff
[   10.178191] x11: 0000000000000010 x10: ffffffc09358b767
[   10.178197] x9 : ffffffc0104d3868 x8 : 0000000000000000
[   10.178202] x7 : 663a31343a363820 x6 : 00000000ffff0000
[   10.178208] x5 : 0000000000000004 x4 : 000000000000ffff
[   10.178213] x3 : 0000000000000006 x2 : ffffffc011dcbbb8
[   10.178219] x1 : ffffffc01358b9f0 x0 : 0000000000005dc3
[   10.178225] Call trace:
[   10.178231]  rtl8168_wait_phy_ups_resume+0x6c/0x88
[   10.178236]  rtl8168_exit_oob+0x2e8/0x36c
[   10.178241]  rtl8168_open+0x1c8/0x37c
[   10.178247]  __dev_open+0x154/0x17c
[   10.178252]  __dev_change_flags+0xfc/0x1ac
[   10.178257]  dev_change_flags+0x30/0x70
[   10.178263]  devinet_ioctl+0x288/0x51c
[   10.178268]  inet_ioctl+0x1b8/0x1e8

Output of lspci -vvv:
0003:31:00.0 Class 0108: Device 8086:f1a5 (rev ff) (prog-if ff)
        !!! Unknown header type 7f
```

<!-- en PDF p.91 -->

### 13.20 NVMe-Fehler im Dauerbetrieb

<!-- en PDF p.91 -->

```text
[186825.261896] nvme nvme0: Abort status: 0x0
[187047.435152] nvme nvme0: Abort status: 0x0
[187052.740828] nvme nvme0: I/O 256 QID 1 timeout, aborting
[187082.743811] nvme nvme0: I/O 256 QID 1 timeout, reset controller
[187092.649150] nvme nvme0: Abort status: 0x0
[187389.590726] nvme nvme0: I/O 709 QID 2 timeout, aborting
[187396.088472] nvme nvme0: Abort status: 0x0
[187419.670448] nvme nvme0: I/O 736 QID 2 timeout, aborting
[187430.034886] nvme nvme0: Abort status: 0x0
[187449.750258] nvme nvme0: I/O 736 QID 2 timeout, reset controller
```

<!-- en PDF p.91 -->

Im NVMe-Stresstest ist der Gerätestatus 0; bei Linkfehler wäre er 0xf, sodass hier Linkprobleme ausgeschlossen werden. Zuerst Temperatur prüfen. CONFIG_NVME_HWMON aktivieren, den hwmon-Knoten namens nvme suchen, etwa cat /sys/class/hwmon/hwmon8/name. Mit cat /sys/class/hwmon/hwmon8/*input Temperaturen unter Last beobachten und mit der Gerätegrenze vergleichen. Bei Überschreitung Kühlung verbessern oder Laufwerkstemperatursteuerung im Userspace umsetzen.

<!-- en PDF p.91 -->

```text
[ 3836.614828] sysrq: Show Blocked State
[ 3836.614921] task:binder:306_2    state:D stack:    0 pid:  329 ppid:     1 flags:0x04000009
[ 3836.614925] Call trace:
[ 3836.614932] __switch_to+0x118/0x148
[ 3836.614936] __schedule+0x538/0x7a4
[ 3836.614938] schedule+0x9c/0xe0
[ 3836.614940] schedule_timeout+0x8c/0xf4
[ 3836.614942] io_schedule_timeout+0x48/0x6c
[ 3836.614944] wait_for_common_io+0x7c/0x100
[ 3836.614945] wait_for_completion_io_timeout+0x10/0x1c
[ 3836.614949] submit_bio_wait+0x70/0xb4
[ 3836.614952] blkdev_issue_discard+0x88/0xd8
[ 3836.614954] blk_ioctl_discard+0x100/0x108
[ 3836.614955] blkdev_common_ioctl+0x388/0x664
[ 3836.614957] blkdev_ioctl+0x16c/0x20c
[ 3836.614959] block_ioctl+0x34/0x44
[ 3836.614962] __arm64_sys_ioctl+0x90/0xc8
[ 3836.614964] el0_svc_common+0xac/0x1ac
[ 3836.614965] do_el0_svc+0x1c/0x28
[ 3836.614968] el0_svc+0x10/0x1c
[ 3836.614970] el0_sync_handler+0x68/0xac
[ 3836.614972] el0_sync+0x160/0x180
```

<!-- en PDF p.92 -->

Erscheint neben nvme nvme0: I/O 736 QID 2 timeout, aborting auch die genannte Meldung, prüfen, ob Vollformatierung oder synchrone Massenlöschung vorausging. Besonders volle große NVMe sind anfällig. Lösung:

<!-- en PDF p.92 -->

```text
(1) Set the CONFIG_DEFAULT_HUNG_TASK_TIMEOUT to a slightly larger number of seconds, for example, 120, to avoid the block-mq blockage detection
(2) Adjust the software timeout times for the admin queue and io queue in the NVMe protocol stack
--- a/drivers/nvme/host/core.c
+++ b/drivers/nvme/host/core.c
@@ -41,12 +41,12 @@ struct nvme_ns_info {
        bool is_removed;
 };

-unsigned int admin_timeout = 60;
+unsigned int admin_timeout = 120;
 module_param(admin_timeout, uint, 0644);
 MODULE_PARM_DESC(admin_timeout, "timeout in seconds for admin commands");
 EXPORT_SYMBOL_GPL(admin_timeout);

-unsigned int nvme_io_timeout = 30;
+unsigned int nvme_io_timeout = 120;
 module_param_named(io_timeout, nvme_io_timeout, uint, 0644);
```

<!-- en PDF p.92 -->

Die folgenden Meldungen bedeuten einen NVMe-Fehler. Lässt sich die Ursache nicht finden und beheben, kann ein Reset versucht werden.

<!-- en PDF p.92 -->

```text
nvme nvme0: I/O 528 QID 10 timeout, reset controller
nvme nvme0: controller is down; will reset: CSTS=0xffffffff, PCI_STATUS=0x10
--- a/drivers/nvme/host/pci.c
+++ b/drivers/nvme/host/pci.c
@@ -11,6 +11,9 @@
 #include <linux/blk-mq.h>
 #include <linux/blk-mq-pci.h>
 #include <linux/blk-integrity.h>
+#ifdef CONFIG_ARCH_ROCKCHIP
+#include <linux/aspm_ext.h>
+#endif
 #include <linux/dmi.h>
 #include <linux/init.h>
 #include <linux/interrupt.h>
@@ -132,6 +135,7 @@ struct nvme_dev {
        void __iomem *bar;
        unsigned long bar_mapped_size;
        struct work_struct remove_work;
+       struct pci_saved_state *state;
        struct mutex shutdown_lock;
        bool subsystem;
        u64 cmb_size;
@@ -1324,6 +1328,21 @@ static void nvme_warn_reset(struct nvme_dev *dev, u32 csts)
                 "Try \"nvme_core.default_ps_max_latency_us=0 pcie_aspm=off pcie_port_pm=off\" and report a bug\n");
 }
+
+static struct pci_dev *nvme_get_rc(struct pci_dev *pdev)
+{
+       struct pci_dev *rc;
+
+       /* Walk bus to get root port */
+       rc = pdev;
+       while (rc->bus->parent) {
+               rc = rc->bus->self;
+               if (!rc)
+                       break;
+       }
+
+       return rc;
+}
+
 static enum blk_eh_timer_return nvme_timeout(struct request *req)
 {
        struct nvme_iod *iod = blk_mq_rq_to_pdu(req);
@@ -1344,6 +1363,9 @@ static enum blk_eh_timer_return nvme_timeout(struct request *req)
         * Reset immediately if the controller is failed
         */
        if (nvme_should_reset(dev, csts)) {
+               rockchip_dw_pcie_pm_ctrl_for_user(nvme_get_rc(to_pci_dev(dev->dev)),
+                                                 ROCKCHIP_PCIE_PM_CTRL_RESET);
+               pci_restore_state(to_pci_dev(dev->dev));
                nvme_warn_reset(dev, csts);
                nvme_dev_disable(dev, false);
                nvme_reset_ctrl(&dev->ctrl);
@@ -1839,9 +1861,18 @@ static int nvme_pci_configure_admin_queue(struct nvme_dev *dev)
        lo_hi_writeq(nvmeq->sq_dma_addr, dev->bar + NVME_REG_ASQ);
        lo_hi_writeq(nvmeq->cq_dma_addr, dev->bar + NVME_REG_ACQ);

+       pci_save_state(to_pci_dev(dev->dev));
+
        result = nvme_enable_ctrl(&dev->ctrl);
-       if (result)
-               return result;
+       if (result) {
+               rockchip_dw_pcie_pm_ctrl_for_user(nvme_get_rc(to_pci_dev(dev->dev)),
+                                                 ROCKCHIP_PCIE_PM_CTRL_RESET);
+               pci_restore_state(to_pci_dev(dev->dev));
+               /* Try again */
+               result = nvme_enable_ctrl(&dev->ctrl);
+               if (result)
+                       return result;
+       }

        nvmeq->cq_vector = 0;
        nvme_init_queue(nvmeq, 0);
@@ -3135,10 +3166,12 @@ static unsigned long check_vendor_combination_bug(struct pci_dev *pdev)
 static void nvme_async_probe(void *data, async_cookie_t cookie)
 {
        struct nvme_dev *dev = data;
+       struct pci_dev *pdev = to_pci_dev(dev->dev);

        flush_work(&dev->ctrl.reset_work);
        flush_work(&dev->ctrl.scan_work);
        nvme_put_ctrl(&dev->ctrl);
+       dev->state = pci_store_saved_state(pdev);
 }
```

<!-- en PDF p.94 -->

## 14. Anhang

<!-- en PDF p.94 -->

### 14.1 LTSSM-Zustandsautomat

<!-- en PDF p.94 -->

| Zustand | Zustandscode (6'h) | Anmerkungen |
| --- | --- | --- |
| S_DETECT_QUIET | 0x00 | Keine Peripherie-RX-Terminierung erkannt, Gerät arbeitet nicht normal |
| S_DETECT_ACTIVE | 0x01 | - |
| S_POLL_ACTIVE | 0x02 | - |
| S_POLL_COMPLIANCE | 0x03 | Compliance-Testmodus; außerhalb eines Tests fehlerhafter Eintritt durch Signalstörungen |
| S_POLL_CONFIG | 0x04 | - |
| S_PRE_DETECT_QUIET | 0x05 | - |
| S_DETECT_WAIT | 0x06 | - |

<!-- en PDF p.95 -->

| Zustand | Zustandscode (6'h) | Anmerkungen |
| --- | --- | --- |
| S_CFG_LINKWD_START | 0x07 | - |
| S_CFG_LINKWD_ACEPT | 0x08 | Lane-Reihenfolge wird erkannt |
| S_CFG_LANENUM_WAIT | 0x09 | - |
| S_CFG_LANENUM_ACEPT | 0x0a | - |
| S_CFG_COMPLETE | 0x0b | Physische Erkennung abgeschlossen |
| S_CFG_IDLE | 0x0c | - |
| S_RCVRY_LOCK | 0x0d | Geschwindigkeitswechsel |
| S_RCVRY_SPEED | 0x0e | - |
| S_RCVRY_RCVRCFG | 0x0f | - |
| S_RCVRY_IDLE | 0x10 | - |
| S_RCVRY_EQ0 | 0x20 | - |
| S_RCVRY_EQ1 | 0x21 | - |
| S_RCVRY_EQ2 | 0x22 | - |
| S_RCVRY_EQ3 | 0x23 | - |
| S_L0 | 0x11 | Normaler Linkbetrieb L0 |
| S_L0S | 0x12 | - |
| S_L123_SEND_EIDLE | 0x13 | - |
| S_L1_IDLE | 0x14 | - |
| S_L2_IDLE | 0x15 | - |
| S_L2_WAKE | 0x16 | - |
| S_DISABLED_ENTRY | 0x17 | - |
| S_DISABLED_IDLE | 0x18 | - |
| S_DISABLED | 0x19 | - |
| S_LPBK_ENTRY | 0x1a | - |
| S_LPBK_ACTIVE | 0x1b | Loopback-Testmodus, gewöhnlich in Testumgebungen |
| S_LPBK_EXIT | 0x1c | - |
| S_LPBK_EXIT_TIMEOUT | 0x1d | - |

<!-- en PDF p.96 -->

| Zustand | Zustandscode (6'h) | Anmerkungen |
| --- | --- | --- |
| S_HOT_RESET_ENTRY | 0x1e | Peripherie initiiert Hot Reset |
| S_HOT_RESET | 0x1f | - |

<!-- en PDF p.97 -->

### 14.2 Debugfs-Auswertung

<!-- en PDF p.97 -->

| Ereignissymbol | Bedeutung |
| --- | --- |
| EBUF Overflow | - |
| EBUF Under-run | - |
| Decode Error | Paketdekodierungsfehler, Signalstörung |
| Running Disparity Error | Polaritätsfehler, 0/1-Ungleichgewicht bei 8bit/10bit, Gen2-Signalstörung |
| SKP OS Parity Error | SKP-Paritätsfehler, Gen3-Signalstörung |
| SYNC Header Error | Asynchroner Paketkopffehler, Signalproblem |
| CTL SKP OS Parity Error | Steuer-SKP-Paritätsfehler, Gen3-Signalstörung |
| Detect EI Infer | Signalübersprechen erkannt |
| Receiver Error | Empfängerfehler |
| Rx Recovery Request | RX erhält Peripherieanforderung, Recovery zur Signalkorrektur |
| N_FTS Timeout | Peripherie-n_fts nicht normgerecht, Fehler bei L0s→L0 und Recovery |
| Framing Error | Rahmenformat-Dekodierungsfehler, Signalstörung |
| Deskew Error | Deskew-Fehler, Signalstörung |
| BAD TLP | Fehlerhaftes TLP empfangen |
| LCRC Error | Link-CRC, Signalstörung |
| BAD DLLP | Fehlerhaftes DLLP, Signalstörung |
| Replay Number Rollover | Zu viele Wiederholungen, Replay-Pufferüberlauf |
| Replay Timeout | Zeitüberschreitung der Paketwiederholung |
| Rx Nak DLLP | DLLP von nachgelagert empfangen, Zugriff abgewiesen |
| Tx Nak DLLP | Nachgelagert gesendetes DLLP abgewiesen |
| Retry TLP | Anzahl wiederholter TLPs, Fehlerindikator |
| FC Timeout | Zeitüberschreitung der Flusssteuerungsaktualisierung |
| Poisoned TLP | Falscher TLP-Typ, möglicherweise Link oder RAM-Bitfehler |

<!-- en PDF p.98 -->

| Ereignissymbol | Bedeutung |
| --- | --- |
| ECRC Error | End-CRC, Signalstörung |
| Unsupported Request | TLP mit nicht unterstützter Anforderung, möglicherweise Zugriff verweigert |
| Completer Abort | Gerät erhält RC-Anforderung, interner Fehler erfordert Zugriffsabbruch |
| Completion Timeout | Lesen von Peripherieressourcen, TLP-Antwort-Zeitüberschreitung |
| Common event signal status | Aktuellen PM-Modus des Controllers lesen |

<!-- en PDF p.99 -->

### 14.3 Fehlerinjektions-Konfigurationstabelle

<!-- en PDF p.99 -->

| Gruppennummer einj_number | Gruppenbeschreibung | Fehlertyp error_type | Fehlerbedeutung |
| --- | --- | --- | --- |
| 0 | CRC-Fehler | 0x0 | TLP LCRC Fehlerpaket |
| 0 | CRC-Fehler | 0x1 | 16b CRC von ACK/NAK DLLP Fehlerpaket |
| 0 | CRC-Fehler | 0x2 | 16b CRC von Update-FC DLLP Fehlerpaket |
| 0 | CRC-Fehler | 0x3 | TLP ECRC Fehlerpaket |
| 0 | CRC-Fehler | 0x4 | TLP FCRC Fehlerpaket (128b/130bit Kodierung) |
| 0 | CRC-Fehler | 0x5 | TX-Polaritätsfehler TSOS (128b/130bit Kodierung) |
| 0 | CRC-Fehler | 0x6 | TX-Polaritätsfehler SKPOS (128b/130bit Kodierung) |
| 0 | CRC-Fehler | 0x8 | RX LCRC Fehlerpaket |
| 0 | CRC-Fehler | 0xb | RX ECRC Fehlerpaket |
| 1 | Paketreihenfolgefehler | 0x0 | TLP SEQ#-Fehler |
| 1 | Paketreihenfolgefehler | 0x1 | DLLP SEQ#-Fehler ACK_NAK_DLLP |
| 2 | DLLP-Fehler | 0x0 | Übertragung sperren von DLLP ACK/NAK Paket[1] |
| 2 | DLLP-Fehler | 0x1 | Übertragung sperren von Update FC DLLP Paket[1] |
| 2 | DLLP-Fehler | 0x2 | Immer senden NAK DLLP Paket[1] |
| 3 | Symbolfehler | 0x0 | Synchronisationsheader invertieren (128bit/130bit Kodierung) |
| 3 | Symbolfehler | 0x1 | TS1 Ordered-Set-Fehler |
| 3 | Symbolfehler | 0x2 | TS2 Ordered-Set-Fehler |
| 3 | Symbolfehler | 0x3 | FTS Ordered-Set-Fehler |
| 3 | Symbolfehler | 0x4 | E-idle Ordered-Set-Fehler |

<!-- en PDF p.100 -->

| Gruppennummer einj_number | Gruppenbeschreibung | Fehlertyp error_type | Fehlerbedeutung |
| --- | --- | --- | --- |
| 3 | Symbolfehler | 0x5 | END/EDB Symbolfehler |
| 3 | Symbolfehler | 0x6 | STP/SDP Symbolfehler |
| 3 | Symbolfehler | 0x7 | SKP Ordered-Set-Fehler |
| 4 | FC-Flusssteuerungsfehler | 0x0 | Posted TLP Header-Credit |
| 4 | FC-Flusssteuerungsfehler | 0x1 | Non-Posted TLP Header-Credit |
| 4 | FC-Flusssteuerungsfehler | 0x2 | Completion TLP Header-Credit |
| 4 | FC-Flusssteuerungsfehler | 0x4 | Posted TLP Daten-Credit |
| 4 | FC-Flusssteuerungsfehler | 0x5 | Non-Posted TLP Daten-Credit |
| 4 | FC-Flusssteuerungsfehler | 0x6 | Completion TLP Daten-Credit |
| 5 | Spezieller TLP-Fehler | 0x0 | ACK DLLP als NAK DLLP behandeln, um doppelte TLPs zu erzeugen |
| 5 | Spezieller TLP-Fehler | 0x1 | Ungültige TLPs erzeugen, Originalpakete an Wiederholung übergeben |
| 6 | Paketkopf-Prüffehler | 0x0 | TLP-Headerfehler erzeugen |
| 6 | Paketkopf-Prüffehler | 0x1 | Fehler in der ersten Gruppe von vier Dwords des TLP-Präfixes erzeugen |
| 6 | Paketkopf-Prüffehler | 0x2 | Fehler in der zweiten Dword-Gruppe des TLP-Präfixes |

<!-- en PDF p.100 -->

[1] Erreichen des Zählerstands null stoppt nicht; ein manueller Stoppbefehl ist nötig.

<!-- en PDF p.101 -->

### 14.4 PCIe-TX-Emphasis-Preset-Tabelle

<!-- en PDF p.101 -->

| Preset-Nummer | Preshoot(dB) | De-emphasis(dB) |
| --- | --- | --- |
| P0 | 0 | -6.0 ± 1.5 dB |
| P1 | 0 | -3.5 ± 1 dB |
| P2 | 0 | -4.4 ± 1.5 dB |
| P3 | 0 | -2.5 ± 1 dB |
| P4 | 0 | 0 |
| P5 | 1.9 ± 1 dB | 0 |
| P6 | 2.5 ± 1 dB | 0 |
| P7 | 3.5 ± 1 dB | -6.0 ± 1.5 dB |
| P8 | 3.5 ± 1 dB | -3.5 ± 1 dB |
| P9 | 3.5 ± 1 dB | 0 |
| P10 | 0 | x |

<!-- en PDF p.101 -->

### 14.5 Bezugsadresse der Entwicklungsressourcen

<!-- en PDF p.101 -->

Nach Erhalt der Redmine-Berechtigung sind die Materialien unter https://redmine.rock-chips.com/documents/107 verfügbar.

<!-- en PDF p.101 -->

### 14.6 Ausführliche PCIe-Adresskonfiguration

<!-- en PDF p.101 -->

Ausführliche PCIe-Adresskonfiguration im DTS: https://elinux.org/Device_Tree_Usage#PCI_Host_Bridge.

<!-- en PDF p.101 -->

### 14.7 M.2-Hardwareschnittstelle

<!-- en PDF p.101 -->

Key B+M passt in Key-B- oder Key-M-Adapter; Key A+E in Key-A- oder Key-E-Adapter. Für andere Steckkarten den Adaptersteckplatz strikt passend zur Schnittstelle wählen.

<!-- en PDF p.102 -->

![Englische Originalabbildung — 102](/docs/rockchip-pcie/assets/en-p102-figure-01.png)

*Englische Originalabbildung — 102*

<!-- en PDF p.102 -->

### 14.8 Board-Timingparameter

<!-- en PDF p.102 -->

![Englische Originalabbildung — 102](/docs/rockchip-pcie/assets/en-p102-figure-02.png)

*Englische Originalabbildung — 102*

<!-- en PDF p.103 -->

| Einstellbare Zeit | Bezeichnung | DTS-Eigenschaft | Beschreibung (Linux-Kernelphase) |
| --- | --- | --- | --- |
| Versorgung stabil | t1 | startup-delay-us | Eigenschaft im Versorgungsknoten, den vpcie3v3-supply des PCIe-Knotens referenziert. |
| Tpvperl | t2 | rockchip,perst-inactive-ms | Im PCIe-Knoten; standardmäßig 200ms, beim Booten wirksam. |
| Tpvperl | t2 | rockchip,s2r-perst-inactive-ms | Im PCIe-Knoten; standardmäßig gleich rockchip,perst-inactive-ms, beim Fortsetzen aus Schlaf wirksam. |
| Verlassen von Electrical Idle | t3 | rockchip,wait-for-link-ms | Im PCIe-Knoten; standardmäßig 1ms Wartezeit bei jedem Linkstart. |

<!-- en PDF p.103 -->

### 14.9 RK3568-PCIe30PHY-SRNS-Patch

<!-- en PDF p.103 -->

```text
diff --git a/drivers/phy/rockchip/phy-rockchip-snps-pcie3.c b/drivers/phy/rockchip/phy-rockchip-snps-pcie3.c
index 2392bcb..fa3244e 100644
--- a/drivers/phy/rockchip/phy-rockchip-snps-pcie3.c
+++ b/drivers/phy/rockchip/phy-rockchip-snps-pcie3.c
@@ -19,12 +19,15 @@
 #include <dt-bindings/phy/phy.h>

 #define GRF_PCIE30PHY_CON4 0x10
+#define GRF_PCIE30PHY_CON5 0x14
 #define GRF_PCIE30PHY_CON6 0x18

@@ -97,6 +100,17 @@
                 (0x1 << 15) | (0x1 << 31));
    }

+
+   /* rx0_cmn_refclk_mode disabled */
+   regmap_write(priv->phy_grf, GRF_PCIE30PHY_CON5, (0x0) | (0x1 << 25));
+   /* rx1_cmn_refclk_mode disabled */
+   regmap_write(priv->phy_grf, GRF_PCIE30PHY_CON6, (0x0) | (0x1 << 25));
+
    regmap_write(priv->phy_grf, GRF_PCIE30PHY_CON4,
             (0x0 << 14) | (0x1 << (14 + 16))); //sdram_ld_done
    regmap_write(priv->phy_grf, GRF_PCIE30PHY_CON4,
```

{% endraw %}
