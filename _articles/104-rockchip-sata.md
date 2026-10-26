---
title: "Complete Rockchip Linux SATA Developer Guide: DTS, U-Boot, Rate Limits and FBS"
description: "Complete Rockchip Linux SATA Developer Guide: DTS, U-Boot, Rate Limits and FBS — RK-KF-YF-148 V2.4.0, RK3566/RK3568/RK3588/RK3576."
translation_key: "104-rockchip-sata"
slug: "104-rockchip-sata"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SATA", "U-Boot", "FBS", "DTS"]
excerpt: "Complete Rockchip Linux SATA Developer Guide: DTS, U-Boot, Rate Limits and FBS — RK-KF-YF-148 V2.4.0, RK3566/RK3568/RK3588/RK3576."
---

{% raw %}

# Complete Rockchip Linux SATA Developer Guide: DTS, U-Boot, Rate Limits and FBS

This article preserves the complete technical body of Chinese/English RK-KF-YF-148 V2.4.0 (Chinese pages 4–13; English 5–14). Source scope: RK356X/kernel 4.19; RK3588/RK3588S/RK356X/kernel 5.10; RK3576/kernel 6.1. The body also provides kernel 6.1 driver configuration and U-Boot patches for several platforms. Code follows the Chinese examples across all four languages. For ArmSoM, verify actual SATA routing, shared PHYs, power, PM expansion chip, SDK/BSP, kernel and U-Boot branch. This is a platform reference, without ArmSoM performance, sleep or patch-compatibility testing. Neither source has independent technical figures; all technical tables are editable.

> Source issues retained: `status = <okay>;`, the curly closing quote in phy-names, and duplicate item 6 in §2. These are not validated, directly compilable DTS. PHY sharing and alternative board routing depend on the specific SoC/board; “mutually exclusive” does not mean all controllers in a system are exclusive. Patch-link access is unverified. No shutdown, sleep, driver or register examples were executed.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. Chip resources

RK3566

| Resource | Mode | PM-chip expansion | Shared PHY | Notes |
| --- | --- | --- | --- | --- |
| SATA1 | 6G/3G/1.5G | Supported (5 disks) | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | Supported (5 disks) | PCIE、QSGMII |  |

RK3568

| Resource | Rate | PM-chip expansion | Shared PHY | Notes |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Supported (5 disks) | USB |  |
| SATA1 | 6G/3G/1.5G | Supported (5 disks) | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | Supported (5 disks) | PCIE、QSGMII |  |

RK3588S

| Resource | Mode | PM-chip expansion | Shared PHY | Notes |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Supported (5 disks) | PCIE |  |
| SATA2 | 6G/3G/1.5G | Supported (5 disks) | PCIE、USB |  |

RK3588

| Resource | Rate | PM-chip expansion | Shared PHY | Notes |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Supported (5 disks) | PCIE |  |
| SATA1 | 6G/3G/1.5G | Supported (5 disks) | PCIE |  |
| SATA2 | 6G/3G/1.5G | Supported (5 disks) | PCIE、USB |  |

RK3576

| Resource | Rate | PM-chip expansion | Shared PHY | Notes |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Supported (5 disks) | PCIE |  |
| SATA1 | 6G/3G/1.5G | Supported (5 disks) | PCIE、USB |  |

## 2. DTS configuration

RK3566

| Resource | Reference configuration | Controller node | PHY node |
| --- | --- | --- | --- |
| SATA1 | rk3568.dtsi | sata1 | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3568

| Resource | Reference configuration | Controller node | PHY node |
| --- | --- | --- | --- |
| SATA0 | rk3568.dtsi | sata0 | combphy0_us |
| SATA1 | rk3568.dtsi | sata1 | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3588

| Resource | Reference configuration | Controller node | PHY node |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3588.dtsi | sata1 | combphy1_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3588s

| Resource | Reference configuration | Controller node | PHY node |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3576

| Resource | Reference configuration | Controller node | PHY node |
| --- | --- | --- | --- |
| SATA0 | rk3576.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3576.dtsi | sata1 | combphy1_psu |

1. `compatible = "rockchip,rk-ahci", "snps,dwc-ahci";` Required default configuration; corresponding driver: `drivers/ata/ahci_platform.c`.

2. `phy-names = "sata-phy“;`

Required and must not be changed: the AHCI driver uses the name "sata-phy“ to locate the corresponding combphy node.

3. `status = <okay>;` Required: enable both the SATA controller node and its corresponding phy node.

4. `assigned-clock-rates = <100000000>;` Required: available reference clock frequencies are 24000000, 25000000 and 100000000; 100000000 is recommended.

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

Optional: when an external PM chip expands SATA ports, a GPIO may be needed to reset the PM chip. See the settings in rk3568-nvr-demo-v10.dtsi.

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

Optional: add pinctrl configuration to the corresponding sata controller node to enable the SATA ACT LED.

6. `dma-coherent;` Optional: RK3576 supports cache coherency, enabled by default in the SDK and configurable in DTS. This parameter must not be configured on other platforms. The duplicate item number is from the source.

## 3. menuconfig configuration

Enable the following options to use SATA functions correctly.

For kernel 4.19 and kernel 5.10:

```text
CONFIG_ATA=y
CONFIG_SATA_AHCI=y
CONFIG_SATA_AHCI_PLATFORM=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
```

For kernel 6.1:

```text
CONFIG_ATA=y
CONFIG_SATA_AHCI=y
CONFIG_AHCI_DWC=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
```

## 4. SATA support in U-Boot

### 4.1 DTS changes

Enable combphy and the sata controller in DTS, together with referenced php_grf and pipe_phyx_grf nodes. The following is an RK3588 SATA0 configuration example.

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

### 4.2 Compilation

RK356x uses rk3568-sata.config. Build command:

```text
./make.sh rk3568-sata
```

RK3588(s) uses rk3588-sata.config. Build command:

```text
./make.sh rk3588-sata
```

## 5. Frequently asked questions

### 5.1 Can PM firmware be downloaded through SATA?

RK356X and RK3588 both support firmware download for JMB575. Source patch link: [JMB575 firmware download patch](https://redmine.rock-chips.com/documents/108) (availability and access not verified).

### 5.2 How is SATA performance tested?

Refer to RK-KF-YF-138, Rockchip_RK3568_Reference_SATA_Performance_CN.

### 5.3 Why does the default SDK not detect the SATA device?

Software case 1: updating only uboot in the first SDK release can cause this issue. Update the kernel phy driver as well.

```text
commit b3f78165e536d35b2337063093bb33a018ff518d
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Wed Dec 23 16:17:31 2020 +0800

    phy: rockchip: naneng-combphy: Reset phy if not being used

    Change-Id: Ia62481ebf5aa5684c359fd00a3933bb02e2caaff
    Signed-off-by: Shawn Lin <shawn.lin@rock-chips.com>
```

Software case 2: SATA and PCIE are mutually exclusive; disable PCIE in DTS. Hardware case: SATA and PCIE are mutually exclusive. A layout supporting both options can affect signals; remove the PCIE trace branch.

### 5.4 How is SATA limited to 1.5G or 3G?

The PHY driver supports 6G by default. Modify it to limit the maximum PHY rate. Reference patches for different platforms follow. RK356X: limit to 1.5G.

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

RK356X: limit to 3G.

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

RK3588(S): limit to 1.5G.

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

RK3588(S): limit to 3G.

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

### 5.5 How is FBS enabled on RK356X?

When using an external PM chip, FBS can improve read/write performance.

For kernel 4.19 and kernel 5.10, apply the following patch and change the dtsi sata node to `compatible = "rockchip,rk-ahci", "snps,dwc-ahci";`.

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

Kernel 6.1 uses a different driver; implement this through the following U-Boot patches. RK356X U-Boot patch:

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

RK3576 U-Boot patch:

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

RK3588 U-Boot patch:

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

### 5.6 How is a disk put into standby or sleep?

During shutdown, place the disk in standby or sleep to avoid damage from abrupt power removal. After the commands below, it may take 10 seconds for the disk to stop spinning and enter standby or sleep. Access wakes it again. During shutdown, unmount the disk before running the command to prevent further system reads or writes.

```text
待机： busybox hdparm -y /dev/block/sda
休眠： busybox hdparm -Y /dev/block/sda
```

{% endraw %}
