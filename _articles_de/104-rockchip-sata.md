---
title: "Vollständiger Rockchip-Linux-SATA-Leitfaden: DTS, U-Boot, Ratenbegrenzung und FBS"
description: "Vollständiger Rockchip-Linux-SATA-Leitfaden: DTS, U-Boot, Ratenbegrenzung und FBS — RK-KF-YF-148 V2.4.0, RK3566/RK3568/RK3588/RK3576."
translation_key: "104-rockchip-sata"
slug: "104-rockchip-sata"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SATA", "U-Boot", "FBS", "DTS"]
excerpt: "Vollständiger Rockchip-Linux-SATA-Leitfaden: DTS, U-Boot, Ratenbegrenzung und FBS — RK-KF-YF-148 V2.4.0, RK3566/RK3568/RK3588/RK3576."
---

{% raw %}

# Vollständiger Rockchip-Linux-SATA-Leitfaden: DTS, U-Boot, Ratenbegrenzung und FBS

Der technische Inhalt von RK-KF-YF-148 V2.4.0 wird vollständig übernommen (CN Seiten 4–13, EN 5–14). Quellenumfang: RK356X/Kernel 4.19; RK3588/RK3588S/RK356X/Kernel 5.10; RK3576/Kernel 6.1. Der Text enthält außerdem Kernel-6.1-Treiberkonfigurationen und U-Boot-Patches mehrerer Plattformen. Der Code folgt in allen vier Sprachen den chinesischen Beispielen. Für ArmSoM SATA-Leitungsführung, gemeinsam genutzte PHYs, Versorgung, PM-Erweiterungschip, SDK/BSP, Kernel und U-Boot-Zweig prüfen. Plattformreferenz ohne ArmSoM-Leistungs-, Schlafmodus- oder Patchkompatibilitätstests. Beide Quellen enthalten keine eigenständigen technischen Abbildungen; alle Tabellen sind editierbar.

> Quellenprobleme bleiben erhalten: `status = <okay>;`, das typografische Abschlusszeichen bei phy-names und die doppelte Nummer 6 in §2. Dies ist kein validiertes, direkt kompilierbares DTS. PHY-Teilung und alternative Leiterführung hängen vom SoC und der Platine ab; „gegenseitig ausschließend“ gilt nicht pauschal für alle Controller des Systems. Patchzugriff ungeprüft. Keine Abschalt-, Schlaf-, Treiber- oder Registerbeispiele wurden ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. Chipressourcen

RK3566

| Ressource | Modus | Erweiterung durch PM-Chip | PHY-Mehrfachnutzung | Hinweise |
| --- | --- | --- | --- | --- |
| SATA1 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | PCIE、QSGMII |  |

RK3568

| Ressource | Rate | Erweiterung durch PM-Chip | PHY-Mehrfachnutzung | Hinweise |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | USB |  |
| SATA1 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | PCIE、QSGMII |  |

RK3588S

| Ressource | Modus | Erweiterung durch PM-Chip | PHY-Mehrfachnutzung | Hinweise |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | PCIE |  |
| SATA2 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | PCIE、USB |  |

RK3588

| Ressource | Rate | Erweiterung durch PM-Chip | PHY-Mehrfachnutzung | Hinweise |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | PCIE |  |
| SATA1 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | PCIE |  |
| SATA2 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | PCIE、USB |  |

RK3576

| Ressource | Rate | Erweiterung durch PM-Chip | PHY-Mehrfachnutzung | Hinweise |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | PCIE |  |
| SATA1 | 6G/3G/1.5G | Unterstützt (5 Festplatten) | PCIE、USB |  |

## 2. DTS-Konfiguration

RK3566

| Ressource | Referenzkonfiguration | Controllerknoten | PHY-Knoten |
| --- | --- | --- | --- |
| SATA1 | rk3568.dtsi | sata1 | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3568

| Ressource | Referenzkonfiguration | Controllerknoten | PHY-Knoten |
| --- | --- | --- | --- |
| SATA0 | rk3568.dtsi | sata0 | combphy0_us |
| SATA1 | rk3568.dtsi | sata1 | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3588

| Ressource | Referenzkonfiguration | Controllerknoten | PHY-Knoten |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3588.dtsi | sata1 | combphy1_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3588s

| Ressource | Referenzkonfiguration | Controllerknoten | PHY-Knoten |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3576

| Ressource | Referenzkonfiguration | Controllerknoten | PHY-Knoten |
| --- | --- | --- | --- |
| SATA0 | rk3576.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3576.dtsi | sata1 | combphy1_psu |

1. `compatible = "rockchip,rk-ahci", "snps,dwc-ahci";` Erforderliche Standardkonfiguration; zugehöriger Treiber: `drivers/ata/ahci_platform.c`.

2. `phy-names = "sata-phy“;`

Erforderlich und nicht zu ändern: Der AHCI-Treiber findet den zugehörigen combphy-Knoten über den Namen "sata-phy“.

3. `status = <okay>;` Erforderlich: Sowohl den SATA-Controllerknoten als auch den zugehörigen phy-Knoten aktivieren.

4. `assigned-clock-rates = <100000000>;` Erforderlich: Mögliche Referenztaktfrequenzen sind 24000000, 25000000 und 100000000; empfohlen wird 100000000.

5. `pinctrl-0 = <&sata_pm_reset>;`

```text
sata_pm_reset: sata-pm-reset {
    rockchip,pins = <4 RK_PD2 RK_FUNC_GPIO &pcfg_output_high>;
};

&combphy1_usq {
    pinctrl-names = "default";
    pinctrl-0 = <&sata_pm_reset>;
};
```

Optional: Bei Erweiterung der SATA-Ports durch einen externen PM-Chip kann ein GPIO für dessen Reset erforderlich sein. Siehe rk3568-nvr-demo-v10.dtsi.

6. `pinctrl-0 = <&sata2_pins>;`

```text
&sata0 {
    pinctrl-names = "default";
    pinctrl-0 = <&sata0_pins>;
};

&sata1 {
    pinctrl-names = "default";
    pinctrl-0 = <&sata1_pins>;
};

&sata2 {
    pinctrl-names = "default";
    pinctrl-0 = <&sata2_pins>;
};
```

Optional: Im zugehörigen sata-Controllerknoten pinctrl ergänzen, um die SATA ACT LED zu aktivieren.

6. `dma-coherent;` Optional: RK3576 unterstützt Cache-Kohärenz, im SDK standardmäßig aktiviert und in DTS konfigurierbar. Auf anderen Plattformen darf dieser Parameter nicht gesetzt werden. Die doppelte Nummer stammt aus der Quelle.

## 3. menuconfig-Konfiguration

Folgende Optionen für die korrekte SATA-Funktion aktivieren.

Für Kernel 4.19 und Kernel 5.10:

```text
CONFIG_ATA=y
CONFIG_SATA_AHCI=y
CONFIG_SATA_AHCI_PLATFORM=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
```

Für Kernel 6.1:

```text
CONFIG_ATA=y
CONFIG_SATA_AHCI=y
CONFIG_AHCI_DWC=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
```

## 4. SATA-Unterstützung in U-Boot

### 4.1 DTS-Anpassungen

In DTS combphy und den sata-Controller sowie referenzierte php_grf- und pipe_phyx_grf-Knoten aktivieren. Es folgt ein Konfigurationsbeispiel für RK3588 SATA0.

```text
diff --git a/arch/arm/dts/rk3588-u-boot.dtsi b/arch/arm/dts/rk3588-u-boot.dtsi
index 3fe8054aac..29cb50e122 100644
--- a/arch/arm/dts/rk3588-u-boot.dtsi
+++ b/arch/arm/dts/rk3588-u-boot.dtsi
@@ -192,6 +192,16 @@
        status = "okay";
 };

+&sata0 {
+       u-boot,dm-pre-reloc;
+       status = "okay";
+};
+
+&combphy0_ps {
+       u-boot,dm-pre-reloc;
+       status = "okay";
+};
+
 /* Support SPL-PINCTRL:
  * 1. ioc
  * 2. pinctrl(sdmmc)
```

### 4.2 Kompilierung

RK356x verwendet rk3568-sata.config. Build-Befehl:

```text
./make.sh rk3568-sata
```

RK3588(s) verwendet rk3588-sata.config. Build-Befehl:

```text
./make.sh rk3588-sata
```

## 5. Häufige Fragen

### 5.1 Kann PM-Firmware über SATA geladen werden?

RK356X und RK3588 unterstützen den Firmwaredownload für JMB575. Quellenlink: [JMB575-Firmwaredownload-Patch](https://redmine.rock-chips.com/documents/108) (Verfügbarkeit und Zugriff nicht geprüft).

### 5.2 Wie wird die SATA-Leistung getestet?

Siehe RK-KF-YF-138, Rockchip_RK3568_Reference_SATA_Performance_CN.

### 5.3 Warum erkennt das Standard-SDK das SATA-Gerät nicht?

Softwarefall 1: Wird in der ersten SDK-Version nur uboot aktualisiert, kann dieses Problem auftreten. Auch den phy-Treiber im Kernel aktualisieren.

```text
commit b3f78165e536d35b2337063093bb33a018ff518d
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Wed Dec 23 16:17:31 2020 +0800

    phy: rockchip: naneng-combphy: Reset phy if not being used

    Change-Id: Ia62481ebf5aa5684c359fd00a3933bb02e2caaff
    Signed-off-by: Shawn Lin <shawn.lin@rock-chips.com>
```

Softwarefall 2: SATA und PCIE schließen sich gegenseitig aus; PCIE in DTS deaktivieren. Hardwarefall: SATA und PCIE schließen sich ebenfalls aus. Ein Layout für beide Optionen kann Signale beeinträchtigen; den PCIE-Leitungsabzweig entfernen.

### 5.4 Wie wird SATA auf 1.5G oder 3G begrenzt?

Der PHY-Treiber unterstützt standardmäßig 6G. Zur Begrenzung der maximalen PHY-Rate den Treiber ändern. Es folgen Referenzpatches für verschiedene Plattformen. RK356X: Begrenzung auf 1.5G.

```text
diff --git a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
index 08445c1890eb..3df0e0e05ab4 100644
--- a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
@@ -604,7 +604,7 @@ static const struct rockchip_combphy_grfcfg rk3568_combphy_grfcfgs = {
        .con2_for_sata          = { 0x0008, 15, 0, 0x00, 0x80c3 },
        .con3_for_sata          = { 0x000c, 15, 0, 0x00, 0x4407 },
        /* pipe-grf */
-       .pipe_con0_for_sata     = { 0x0000, 15, 0, 0x00, 0x2220 },
+       .pipe_con0_for_sata     = { 0x0000, 15, 0, 0x00, 0x0000 },
        .pipe_sgmii_mac_sel     = { 0x0040, 1, 1, 0x00, 0x01 },
        .pipe_xpcs_phy_ready    = { 0x0040, 2, 2, 0x00, 0x01 },
        .u3otg0_port_en         = { 0x0104, 15, 0, 0x0181, 0x1100 },
```

RK356X: Begrenzung auf 3G.

```text
diff --git a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
index 08445c1890eb..3df0e0e05ab4 100644
--- a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
@@ -604,7 +604,7 @@ static const struct rockchip_combphy_grfcfg rk3568_combphy_grfcfgs = {
        .con2_for_sata          = { 0x0008, 15, 0, 0x00, 0x80c3 },
        .con3_for_sata          = { 0x000c, 15, 0, 0x00, 0x4407 },
        /* pipe-grf */
-       .pipe_con0_for_sata     = { 0x0000, 15, 0, 0x00, 0x2220 },
+       .pipe_con0_for_sata     = { 0x0000, 15, 0, 0x00, 0x1110 },
        .pipe_sgmii_mac_sel     = { 0x0040, 1, 1, 0x00, 0x01 },
        .pipe_xpcs_phy_ready    = { 0x0040, 2, 2, 0x00, 0x01 },
        .u3otg0_port_en         = { 0x0104, 15, 0, 0x0181, 0x1100 },
```

RK3588(S): Begrenzung auf 1.5G.

```text
diff --git a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
index 6f7aa8ebc292..062116ad09e8 100644
--- a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
@@ -868,8 +868,8 @@ static const struct rockchip_combphy_grfcfg rk3588_combphy_grfcfgs = {
        .con2_for_sata          = { 0x0008, 15, 0, 0x00, 0x80c1 },
        .con3_for_sata          = { 0x000c, 15, 0, 0x00, 0x0407 },
        /* pipe-grf */

-       .pipe_con0_for_sata     = { 0x0000, 11, 5, 0x00, 0x22 },
-       .pipe_con1_for_sata     = { 0x0004, 2, 0, 0x00, 0x2 },

+       .pipe_con0_for_sata     = { 0x0000, 11, 5, 0x00, 0x00 },
+       .pipe_con1_for_sata     = { 0x0004, 2, 0, 0x00, 0x0 },
         };

 static const struct clk_bulk_data rk3588_clks[] = {
```

RK3588(S): Begrenzung auf 3G.

```text
diff --git a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
index 6f7aa8ebc292..062116ad09e8 100644
--- a/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-naneng-combphy.c
@@ -868,8 +868,8 @@ static const struct rockchip_combphy_grfcfg rk3588_combphy_grfcfgs = {
        .con2_for_sata          = { 0x0008, 15, 0, 0x00, 0x80c1 },
        .con3_for_sata          = { 0x000c, 15, 0, 0x00, 0x0407 },
        /* pipe-grf */

-       .pipe_con0_for_sata     = { 0x0000, 11, 5, 0x00, 0x22 },
-       .pipe_con1_for_sata     = { 0x0004, 2, 0, 0x00, 0x2 },

+       .pipe_con0_for_sata     = { 0x0000, 11, 5, 0x00, 0x11 },
+       .pipe_con1_for_sata     = { 0x0004, 2, 0, 0x00, 0x1 },
         };

 static const struct clk_bulk_data rk3588_clks[] = {
```

### 5.5 Wie wird FBS auf RK356X aktiviert?

Bei einem externen PM-Chip kann FBS die Lese-/Schreibleistung verbessern.

Für Kernel 4.19 und Kernel 5.10 den folgenden Patch anwenden und im sata-Knoten der dtsi `compatible = "rockchip,rk-ahci", "snps,dwc-ahci";` setzen.

```text
diff --git a/drivers/ata/ahci_platform.c b/drivers/ata/ahci_platform.c
index 3aab2e3d57f3..1825b33cc274 100644
--- a/drivers/ata/ahci_platform.c
+++ b/drivers/ata/ahci_platform.c
@@ -62,6 +62,9 @@ static int ahci_probe(struct platform_device *pdev)
        if (of_device_is_compatible(dev->of_node, "hisilicon,hisi-ahci"))
                hpriv->flags |= AHCI_HFLAG_NO_FBS | AHCI_HFLAG_NO_NCQ;

+       if (of_device_is_compatible(dev->of_node, "rockchip,rk-ahci"))
+               hpriv->flags |= AHCI_HFLAG_YES_FBS;
+
        port = acpi_device_get_match_data(dev);
        if (!port)
                port = &ahci_port_info;
@@ -88,6 +91,7 @@ static const struct of_device_id ahci_of_match[] = {
        { .compatible = "snps,dwc-ahci", },
        { .compatible = "hisilicon,hisi-ahci", },
        { .compatible = "cavium,octeon-7130-ahci", },
+       { .compatible = "rockchip,rk-ahci", },
        {},
 };
```

Kernel 6.1 verwendet einen anderen Treiber; die folgenden U-Boot-Patches setzen dies um. RK356X-U-Boot-Patch:

```text
diff --git a/arch/arm/mach-rockchip/rk3568/rk3568.c b/arch/arm/mach-rockchip/rk3568/rk3568.c
index 3b33322a6c7..89e0eb3ca5a 100644
--- a/arch/arm/mach-rockchip/rk3568/rk3568.c
+++ b/arch/arm/mach-rockchip/rk3568/rk3568.c
@@ -61,6 +61,13 @@ DECLARE_GLOBAL_DATA_PTR;

 #define EBC_PRIORITY_REG       (0xfe158008)

+#define SATA0_BASE_ADDR                        0xfc000000
+#define SATA1_BASE_ADDR                        0xfc400000
+#define SATA2_BASE_ADDR                        0xfc800000
+#define SATA_PI                                0xC
+#define SATA_PORT_CMD                  0x118
+#define SATA_FBS_ENABLE                        BIT(22)
+
 enum {
        /* PMU_GRF_GPIO0C_IOMUX_L */
        GPIO0C1_SHIFT           = 4,
@@ -945,6 +952,15 @@ int arch_cpu_init(void)
        writel((0x77771111), GRF_BASE + GRF_GPIO1C_IOMUX_L);
        writel((0x07770111), GRF_BASE + GRF_GPIO1C_IOMUX_H);
 #endif
+       /*
+        * Set SATA FBSCP and PORTS_IMPL for kernel drivers
+        */
+       writel(SATA_FBS_ENABLE, SATA0_BASE_ADDR + SATA_PORT_CMD);
+       writel(1, SATA0_BASE_ADDR + SATA_PI);
+       writel(SATA_FBS_ENABLE, SATA1_BASE_ADDR + SATA_PORT_CMD);
+       writel(1, SATA1_BASE_ADDR + SATA_PI);
+       writel(SATA_FBS_ENABLE, SATA2_BASE_ADDR + SATA_PORT_CMD);
+       writel(1, SATA2_BASE_ADDR + SATA_PI);
 #endif

        return 0;
```

RK3576-U-Boot-Patch:

```text
diff --git a/arch/arm/mach-rockchip/rk3576/rk3576.c b/arch/arm/mach-rockchip/rk3576/rk3576.c
index c664c743f36..5758af56b13 100644
--- a/arch/arm/mach-rockchip/rk3576/rk3576.c
+++ b/arch/arm/mach-rockchip/rk3576/rk3576.c
@@ -94,6 +94,12 @@ DECLARE_GLOBAL_DATA_PTR;
 #define PMU1_CRU_GATE_CON03    0x080C
 #define PMU1_CRU_SOFTRST_CON03 0x0a0C

+#define SATA0_BASE_ADDR                        0x2a240000
+#define SATA1_BASE_ADDR                        0x2a250000
+#define SATA_PI                                0xC
+#define SATA_PORT_CMD                  0x118
+#define SATA_FBS_ENABLE                        BIT(22)
+
 #ifdef CONFIG_ARM64
 #include <asm/armv8/mmu.h>

@@ -400,6 +406,14 @@ int arch_cpu_init(void)
         * Module: GMAC0/1, MMU0/1(PCIe, SATA, USB3)
         */
        writel(0xffffff00, SYS_SGRF_BASE + SYS_SGRF_SOC_CON20);
+#else
+       /*
+        * Set SATA FBSCP and PORTS_IMPL for kernel drivers
+        */
+       writel(SATA_FBS_ENABLE, SATA0_BASE_ADDR + SATA_PORT_CMD);
+       writel(1, SATA0_BASE_ADDR + SATA_PI);
+       writel(SATA_FBS_ENABLE, SATA1_BASE_ADDR + SATA_PORT_CMD);
+       writel(1, SATA1_BASE_ADDR + SATA_PI);
 #endif

 #if defined(CONFIG_ROCKCHIP_EMMC_IOMUX)
```

RK3588-U-Boot-Patch:

```text
diff --git a/arch/arm/mach-rockchip/rk3588/rk3588.c b/arch/arm/mach-rockchip/rk3588/rk3588.c
index e42a1aef996..986bf56519b 100644
--- a/arch/arm/mach-rockchip/rk3588/rk3588.c
+++ b/arch/arm/mach-rockchip/rk3588/rk3588.c
@@ -102,6 +102,13 @@ DECLARE_GLOBAL_DATA_PTR;
 #define MMU600PHP_TCU_PRIORITY_REG     0xfdf3a808
 #define QOS_PRIORITY_LEVEL(h, l)       ((((h) & 7) << 8) | ((l) & 7))

+#define SATA0_BASE_ADDR                        0xfe210000
+#define SATA1_BASE_ADDR                        0xfe220000
+#define SATA2_BASE_ADDR                        0xfe230000
+#define SATA_PI                                0xC
+#define SATA_PORT_CMD                  0x118
+#define SATA_FBS_ENABLE                        BIT(22)
+
 #ifdef CONFIG_ARM64
 #include <asm/armv8/mmu.h>

@@ -1067,6 +1074,16 @@ int arch_cpu_init(void)
         */
        writel(QOS_PRIORITY_LEVEL(4, 4), MMU600PHP_TBU_PRIORITY_REG);
        writel(QOS_PRIORITY_LEVEL(4, 4), MMU600PHP_TCU_PRIORITY_REG);
+
+       /*
+        * Set SATA FBSCP and PORTS_IMPL for kernel drivers
+        */
+       writel(SATA_FBS_ENABLE, SATA0_BASE_ADDR + SATA_PORT_CMD);
+       writel(1, SATA0_BASE_ADDR + SATA_PI);
+       writel(SATA_FBS_ENABLE, SATA1_BASE_ADDR + SATA_PORT_CMD);
+       writel(1, SATA1_BASE_ADDR + SATA_PI);
+       writel(SATA_FBS_ENABLE, SATA2_BASE_ADDR + SATA_PORT_CMD);
+       writel(1, SATA2_BASE_ADDR + SATA_PI);
 #endif

        /* Select usb otg0 phy status to 0 that make rockusb can work at high-speed */
```

### 5.6 Wie wird eine Festplatte in Standby oder Schlaf versetzt?

Beim Herunterfahren die Festplatte in Standby oder Schlaf versetzen, um Schäden durch abrupten Stromausfall zu vermeiden. Nach den folgenden Befehlen kann es 10 Sekunden dauern, bis die Platte stillsteht und in Standby oder Schlaf wechselt. Ein Zugriff weckt sie erneut. Beim Herunterfahren die Platte vorher aushängen, damit das System keine weiteren Lese-/Schreibzugriffe ausführt.

```text
待机： busybox hdparm -y /dev/block/sda
休眠： busybox hdparm -Y /dev/block/sda
```

{% endraw %}
