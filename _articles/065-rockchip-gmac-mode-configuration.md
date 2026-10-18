---
title: "Rockchip GMAC Mode Configuration: RGMII, RMII, SGMII and QSGMII"
description: "Complete GMAC clock, PHY-mode and pinctrl configurations for 14 Rockchip platform groups, including RK3576/RK3588."
translation_key: "065-rockchip-gmac-mode-configuration"
slug: "065-rockchip-gmac-mode-configuration"
lang: "en"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["Rockchip", "GMAC", "Ethernet", "Linux"]
keywords: "ArmSoM Rockchip GMAC Ethernet RGMII RMII PHY"
excerpt: "Complete GMAC clock, PHY-mode and pinctrl configurations for 14 Rockchip platform groups, including RK3576/RK3588."
---

{% raw %}

# Rockchip GMAC Mode Configuration: RGMII, RMII, SGMII and QSGMII

## ArmSoM applicability

This is a Rockchip platform reference, not an ArmSoM hardware test report. Adaptation requires checking the particular board's Ethernet interface, PHY, power, reset, IOMUX, reference clocks and target SDK/BSP. It does not establish support on every ArmSoM board. No hardware validation was performed. All source logs, throughput figures and timing results are source examples, not ArmSoM measurements.

Both editions are V1.4.0, with 65 Chinese and 68 English pages. The 14 platform groups are PX30, RK1808, RK3128, RK3228, RK3288, RK3328, RK3368, RK3399, RK3528, RK3562, RK3568, RK3588/RK3576, RV1108 and RV1126. The original product table says “all versions”; this is a source generalization, not proof that every BSP or board can use these examples directly. Technical changes retained: V1.1.0 added RK3588, V1.2.0 RK3528, V1.3.0 RK3562, and V1.4.0 RK3576 using RK3588 configuration as reference. Chinese follows Chinese; English/Russian follow English. All six figures come from the respective original PDFs.

> Same-version differences are retained: §3.4.5 uses phy-mode rmii in Chinese but RMII in English; §3.10.4 English omits semicolons at two PHY child-node closures; §3.10.5 gmac0m0 ends with rgmiim1_rgmii_bus in Chinese versus rgmiim0_rgmii_bus in English. These are not verified ready-to-build configurations. The + signs are source change markers; review against the target BSP before use. Technical values were not silently corrected.

[Editorial notes](/docs/rockchip-gmac-mode-configuration/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)

## Source product scope

| Chipset | Kernel version |
| --- | --- |
| Rockchip | All versions (source generalization; BSP-specific) |

<!-- source: EN PDF p5; unit 0 -->

The main mode connection diagrams for RGMII/RMII are listed as follows:

<!-- source: EN PDF p5; unit 1 -->

## 1.   RGMII Mode

<!-- source: EN PDF p5; unit 2 -->

When using the master PLL output clock method, the 125M clock provided by the PHY as an input method serves as an alternative solution.

<!-- source: EN PDF p5; unit 3 -->

### 1.1   PLL Output 125M for TX_CLK, Crystal 25M for PHY

<!-- source: EN PDF p5; unit 4 -->

The main controller PLL provides the clock required for TXCLK, while the PHY 25M clock is supplied by the crystal oscillator.

<!-- source: EN PDF p6; unit 5 -->

![Original mode connection diagram, EN p6](/docs/rockchip-gmac-mode-configuration/assets/en-p6-X116.png)

*Original mode connection diagram: EN PDF p6.*

<!-- source: EN PDF p6; unit 6 -->

### 1.2   PLL Output 125M for TX_CLK, PLL 25M for PHY

<!-- source: EN PDF p6; unit 7 -->

The master PLL provides the clock required for TXCLK, and the PHY 25M clock is supplied by the master controller.

<!-- source: EN PDF p7; unit 8 -->

![Original mode connection diagram, EN p7](/docs/rockchip-gmac-mode-configuration/assets/en-p7-X121.png)

*Original mode connection diagram: EN PDF p7.*

<!-- source: EN PDF p7; unit 9 -->

### 1.3   125M TX_CLK Input from PHY, PLL 25M for PHY

<!-- source: EN PDF p7; unit 10 -->

The required clock for TXCLK is provided by the PHY, and the 25M clock for the PHY is provided by the master controller.

<!-- source: EN PDF p8; unit 11 -->

![Original mode connection diagram, EN p8](/docs/rockchip-gmac-mode-configuration/assets/en-p8-X125.png)

*Original mode connection diagram: EN PDF p8.*

<!-- source: EN PDF p8; unit 12 -->

### 1.4   125M TX_CLK input from PHY, Crystal 25M for PHY

<!-- source: EN PDF p8; unit 13 -->

The TXCLK required clock is provided by the PHY, and the PHY 25M clock is supplied by the crystal oscillator.

<!-- source: EN PDF p9; unit 14 -->

![Original mode connection diagram, EN p9](/docs/rockchip-gmac-mode-configuration/assets/en-p9-X129.png)

*Original mode connection diagram: EN PDF p9.*

<!-- source: EN PDF p9; unit 15 -->

## 2.   RMII Mode

<!-- source: EN PDF p9; unit 16 -->

### 2.1   RMII Clock Output

<!-- source: EN PDF p9; unit 17 -->

The controller provides the required clock for RMII

<!-- source: EN PDF p10; unit 18 -->

![Original mode connection diagram, EN p10](/docs/rockchip-gmac-mode-configuration/assets/en-p10-X134.png)

*Original mode connection diagram: EN PDF p10.*

<!-- source: EN PDF p10; unit 19 -->

### 2.2   RMII Clock Input

<!-- source: EN PDF p10; unit 20 -->

PHY provides the clock required for RMII

<!-- source: EN PDF p11; unit 21 -->

![Original mode connection diagram, EN p11](/docs/rockchip-gmac-mode-configuration/assets/en-p11-X138.png)

*Original mode connection diagram: EN PDF p11.*

<!-- source: EN PDF p11; unit 22 -->

Similarly, in RMII mode, the crystal can also be replaced by the master control output of 25M.

<!-- source: EN PDF p11; unit 23 -->

## 3.   Mode Configuration

<!-- source: EN PDF p11; unit 24 -->

Configurations under different modes primarily include settings for phy mode, clock, and pinctrl, which are interrelated and need to be configured simultaneously; otherwise, they will not function properly. Below are references for different configuration methods under various chips, using the SDK board-level DTS as an example, with a focus on modifications to the '+' part within the gmac node in the dts.

<!-- source: EN PDF p12; unit 25 -->

### 3.1   PX30

<!-- source: EN PDF p12; unit 26 -->

#### 3.1.1   PX30 RMII Clock Output

<!-- source: EN PDF p12; unit 27 -->

```text
&gmac {
      phy-supply = <&vcc_phy>;
+     clock_in_out = "output";

+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-rates = <50000000>;
      snps,reset-gpio = <&gpio2 13 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 50000 50000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins &mac_refclk_12ma>;
      status = "okay";
};
```

<!-- source: EN PDF p12; unit 28 -->

#### 3.1.2   PX30 RMII Clock Input

<!-- source: EN PDF p12; unit 29 -->

```text
&gmac {
      phy-supply = <&vcc_phy>;
+     clock_in_out = "input";

+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-parents = <&gmac_clkin>;
      snps,reset-gpio = <&gpio2 13 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 50000 50000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins &mac_refclk>;
      status = "okay";
};
```

<!-- source: EN PDF p12; unit 30 -->

### 3.2   RK1808

<!-- source: EN PDF p12; unit 31 -->

#### 3.2.1   RK1808 RMII Clock Output

<!-- source: EN PDF p12; unit 32 -->

```text
&gmac {
      phy-supply = <&vcc_phy>;

+     phy-mode = "rmii";
+     clocks = <&cru SCLK_GMAC>, <&cru SCLK_GMAC_RX_TX>,
+            <&cru SCLK_GMAC_RX_TX>, <&cru SCLK_GMAC_REF>,
+            <&cru SCLK_GMAC_REFOUT>, <&cru ACLK_GMAC>,
+            <&cru PCLK_GMAC>, <&cru SCLK_GMAC_RMII_SPEED>;
+     clock-names = "stmmaceth", "mac_clk_rx",
+                "mac_clk_tx", "clk_mac_ref",
+                "clk_mac_refout", "aclk_mac",
+                "pclk_mac", "clk_mac_speed";
+     assigned-clocks = <&cru SCLK_GMAC_RX_TX>;

+     assigned-clock-parents = <&cru SCLK_GMAC_RMII_SPEED>;
      snps,reset-gpio = <&gpio0 10 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 50000 50000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      status = "okay";
};
```

<!-- source: EN PDF p13; unit 33 -->

<!-- source: EN PDF p13; unit 34 -->

#### 3.2.2   RK1808 RMII Clock Input

<!-- source: EN PDF p13; unit 35 -->

```text
+&gmac_clkin {
+     clock-frequency = <50000000>;
+};


&gmac {
      phy-supply = <&vcc_phy>;
      phy-mode = "rmii";
+     clock_in_out = "input";
+     clocks = <&cru SCLK_GMAC>, <&cru SCLK_GMAC_RX_TX>,
+            <&cru SCLK_GMAC_RX_TX>, <&cru SCLK_GMAC_REF>,
+            <&cru SCLK_GMAC_REFOUT>, <&cru ACLK_GMAC>,
+            <&cru PCLK_GMAC>, <&cru SCLK_GMAC_RMII_SPEED>;
+     clock-names = "stmmaceth", "mac_clk_rx",
+                "mac_clk_tx", "clk_mac_ref",
+                "clk_mac_refout", "aclk_mac",
+                "pclk_mac", "clk_mac_speed";

+     assigned-clocks = <&cru SCLK_GMAC_RX_TX>, <&cru SCLK_GMAC>;
+     assigned-clock-parents = <&cru SCLK_GMAC_RMII_SPEED>, <&gmac_clkin>;
      snps,reset-gpio = <&gpio0 10 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 50000 50000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      status = "okay";
};
```

<!-- source: EN PDF p13; unit 36 -->

#### 3.2.3   RK1808 RGMII Clock Output

<!-- source: EN PDF p13; unit 37 -->

```text
&gmac {
      phy-supply = <&vcc_phy>;

+     phy-mode = "rgmii";
+     clock_in_out = "output";
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-rates = <125000000>;
      snps,reset-gpio = <&gpio0 10 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

      tx_delay = <0x50>;
      rx_delay = <0x3a>;
      status = "okay";
};
```

<!-- source: EN PDF p14; unit 38 -->

<!-- source: EN PDF p14; unit 39 -->

#### 3.2.4   RK1808 RGMII Clock Input

<!-- source: EN PDF p14; unit 40 -->

```text
&gmac {
      phy-supply = <&vcc_phy>;
+     phy-mode = "rgmii";

+     clock_in_out = "input";
+     assigned-clocks = <&cru SCLK_GMAC>;
+     assigned-clock-parents = <&gmac_clkin>;
      snps,reset-gpio = <&gpio0 10 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;
      tx_delay = <0x50>;
      rx_delay = <0x3a>;
      status = "okay";
};
```

<!-- source: EN PDF p14; unit 41 -->

### 3.3   RK3128

<!-- source: EN PDF p14; unit 42 -->

#### 3.3.1   RK3128 RMII Clock Output

<!-- source: EN PDF p14; unit 43 -->

```text
&gmac {
+     assigned-clocks = <&cru SCLK_MAC_SRC>;

+     assigned-clock-rates = <50000000>;
+     clock_in_out = "output";
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";
      snps,reset-active-low;
      snps,reset-delays-us = <0 10000 50000>;
      snps,reset-gpio = <&gpio2 24 GPIO_ACTIVE_LOW>;
      status = "okay";
};
```

<!-- source: EN PDF p15; unit 44 -->

#### 3.3.2   RK3128 RMII Clock Input

<!-- source: EN PDF p15; unit 45 -->

```text
+&clkin_gmac {
+     clock-frequency = <50000000>;
+};


&gmac {
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-parents = <&clkin_gmac>;
+     clock_in_out = "input";
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";
      snps,reset-active-low;
      snps,reset-delays-us = <0 10000 50000>;
      snps,reset-gpio = <&gpio2 24 GPIO_ACTIVE_LOW>;

      status = "okay";
};
```

<!-- source: EN PDF p15; unit 46 -->

#### 3.3.3   RK3128 RGMII Clock Input

<!-- source: EN PDF p15; unit 47 -->

```text
&gmac {
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-parents = <&clkin_gmac>;

+     clock_in_out = "input";
+     pinctrl-names = "default";
+     pinctrl-0 = <&rgmii_pins>;
      phy-supply = <&vcc_phy>;
+     phy-mode = "rgmii";
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
      snps,reset-gpio = <&gpio2 24 GPIO_ACTIVE_LOW>;
      tx_delay = <0x30>;
      rx_delay = <0x16>;
      status = "okay";
};
```

<!-- source: EN PDF p15; unit 48 -->

### 3.4   RK3228

<!-- source: EN PDF p15; unit 49 -->

#### 3.4.1   RK3228 RMII Clock Output

<!-- source: EN PDF p15; unit 50 -->

```text
&gmac {
+     assigned-clocks = <&cru SCLK_MAC_EXTCLK>, <&cru SCLK_MAC>;

+     assigned-clock-parents = <&ext_gmac>, <&cru SCLK_MAC_EXTCLK>;
+     assigned-clock-rates = <0>, <50000000>;
+     clock_in_out = "output";
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";

+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      snps,reset-gpio = <&gpio2 RK_PD0 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
      status = "okay";
};
```

<!-- source: EN PDF p16; unit 51 -->

<!-- source: EN PDF p16; unit 52 -->

#### 3.4.2   RK3228 RMII Clock Input

<!-- source: EN PDF p16; unit 53 -->

```text
+&ext_gmac: external-gmac-clock {
+     clock-frequency = <50000000>;
+}


&gmac {
+     assigned-clocks = <&cru SCLK_MAC_EXTCLK>, <&cru SCLK_MAC>;
+     assigned-clock-parents = <&ext_gmac>, <&cru SCLK_MAC_EXTCLK>;
+     clock_in_out = "input";
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      snps,reset-gpio = <&gpio2 RK_PD0 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;

      status = "okay";
};
```

<!-- source: EN PDF p16; unit 54 -->

#### 3.4.3   RK3228 RGMII Clock Output

<!-- source: EN PDF p16; unit 55 -->

```text
&gmac {
+     assigned-clocks = <&cru SCLK_MAC_EXTCLK>, <&cru SCLK_MAC>;
+     assigned-clock-parents = <&ext_gmac>, <&cru SCLK_MAC_EXTCLK>;

+     assigned-clock-rates = <0>, <125000000>;
+     clock_in_out = "output";
      phy-supply = <&vcc_phy>;
+     phy-mode = "rgmii";
+     pinctrl-names = "default";
+     pinctrl-0 = <&rgmii_pins>;
      snps,reset-gpio = <&gpio2 RK_PD0 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
      tx_delay = <0x30>;
      rx_delay = <0x10>;
      status = "okay";
};
```

<!-- source: EN PDF p17; unit 56 -->

<!-- source: EN PDF p17; unit 57 -->

#### 3.4.4   RK3228 RGMII Clock Input

<!-- source: EN PDF p17; unit 58 -->

```text
&gmac {
+     assigned-clocks = <&cru SCLK_MAC_EXTCLK>, <&cru SCLK_MAC>;

+     assigned-clock-parents = <&ext_gmac>, <&cru SCLK_MAC_EXTCLK>;
+     clock_in_out = "input";
      phy-supply = <&vcc_phy>;
+     phy-mode = "rgmii";
+     pinctrl-names = "default";
+     pinctrl-0 = <&rgmii_pins>;
      snps,reset-gpio = <&gpio2 RK_PD0 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
      tx_delay = <0x30>;
      rx_delay = <0x10>;
      status = "okay";

};
```

<!-- source: EN PDF p17; unit 59 -->

#### 3.4.5   RK3228 Internal EPHY

<!-- source: EN PDF p17; unit 60 -->

```text
&gmac {
+     assigned-clocks = <&cru SCLK_MAC_SRC>;
+     assigned-clock-rates = <50000000>;

+     clock_in_out = "output";
      phy-supply = <&vcc_phy>;
+     phy-mode = "RMII";
      phy-handle = <&phy>;
      status = "okay";

      mdio {
           compatible = "snps,dwmac-mdio";
           #address-cells = <1>;
           #size-cells = <0>;

           phy: ethernet-phy@0 {

                 compatible = "ethernet-phy-id1234.d400", "ethernet-phy-ieee802.3-c22";
                 reg = <0>;
                 clocks = <&cru SCLK_MAC_PHY>;
                 resets = <&cru SRST_MACPHY>;
                 phy-is-integrated;
           };
      };
};
```

<!-- source: EN PDF p18; unit 61 -->

### 3.5   RK3288

<!-- source: EN PDF p18; unit 62 -->

#### 3.5.1   RK3288 RMII Clock Output

<!-- source: EN PDF p18; unit 63 -->

```text
&gmac {
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";

+     clock_in_out = "output";
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-rates = <50000000>;
      snps,reset-gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 1000000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      status = "okay";
};
```

<!-- source: EN PDF p18; unit 64 -->

#### 3.5.2   RK3288 RMII Clock Input

<!-- source: EN PDF p18; unit 65 -->

```text
+&ext_gmac: external-gmac-clock {
+     clock-frequency = <50000000>;
+}


&gmac {
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";
+     clock_in_out = "input";
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-parents = <&ext_gmac>;
      snps,reset-gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 1000000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;

      status = "okay";
};
```

<!-- source: EN PDF p18; unit 66 -->

#### 3.5.3   RK3288 RGMII Clock Input

<!-- source: EN PDF p18; unit 67 -->

```text
&gmac {
      phy-supply = <&vcc_phy>;
+     phy-mode = "rgmii";

+     clock_in_out = "input";
      snps,reset-gpio = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 1000000>;
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-parents = <&ext_gmac>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&rgmii_pins>;
      tx_delay = <0x30>;
      rx_delay = <0x10>;
      status = "okay";
};
```

<!-- source: EN PDF p19; unit 68 -->

<!-- source: EN PDF p19; unit 69 -->

### 3.6   RK3328

<!-- source: EN PDF p19; unit 70 -->

#### 3.6.1   RK3328 RMII Clock Output

<!-- source: EN PDF p19; unit 71 -->

```text
&gmac2io {
      phy-supply = <&vcc_phy>;

+     phy-mode = "rmii";
+     clock_in_out = "output";
+     assigned-clocks = <&cru SCLK_MAC2IO>;
+     assigned-clock-rates = <50000000>;
      snps,reset-gpio = <&gpio1 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmiim1_pins>;
      status = "okay";
};
```

<!-- source: EN PDF p19; unit 72 -->

#### 3.6.2   RK3328 RMII Clock Input

<!-- source: EN PDF p19; unit 73 -->

```text
+&clkin_gmac {
+     clock-frequency = <50000000>;

+};

&gmac2io {
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";
+     clock_in_out = "input";
+     assigned-clocks = <&cru SCLK_MAC2IO>, <&cru SCLK_MAC2IO_EXT>;
+     assigned-clock-parents = <&gmac_clkin>, <&gmac_clkin>;
      snps,reset-gpio = <&gpio1 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmiim1_pins>;

      status = "okay";
};
```

<!-- source: EN PDF p20; unit 74 -->

#### 3.6.3   RK3328 RGMII Clock Input

<!-- source: EN PDF p20; unit 75 -->

```text
&gmac2io {
      phy-supply = <&vcc_phy>;
+     phy-mode = "rgmii";

+     clock_in_out = "input";
+     assigned-clocks = <&cru SCLK_MAC2IO>, <&cru SCLK_MAC2IO_EXT>;
+     assigned-clock-parents = <&gmac_clkin>, <&gmac_clkin>;
      snps,reset-gpio = <&gpio1 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rgmiim1_pins>;
      tx_delay = <0x26>;
      rx_delay = <0x11>;
      status = "okay";
};
```

<!-- source: EN PDF p20; unit 76 -->

#### 3.6.4   RK3328 Internal EPHY

<!-- source: EN PDF p20; unit 77 -->

```text
&gmac2phy {
      phy-supply = <&vcc_phy>;

+     clock_in_out = "output";
+     assigned-clocks = <&cru SCLK_MAC2PHY_SRC>;
+     assigned-clock-rate = <50000000>;
+     assigned-clocks = <&cru SCLK_MAC2PHY>;
+     assigned-clock-parents = <&cru SCLK_MAC2PHY_SRC>;
      status = "okay";
};
```

<!-- source: EN PDF p20; unit 78 -->

### 3.7   RK3368

<!-- source: EN PDF p20; unit 79 -->

#### 3.7.1   RK3368 RMII Clock Output

<!-- source: EN PDF p20; unit 80 -->

```text
&gmac {
      phy-supply = <&vcc_lan>;

+     phy-mode = "rmii";
+     clock_in_out = "output";
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-rates = <50000000>;
      snps,reset-gpio = <&gpio3 12 0>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      status = "ok";
};
```

<!-- source: EN PDF p21; unit 81 -->

<!-- source: EN PDF p21; unit 82 -->

#### 3.7.2   RK3368 RMII Clock Input

<!-- source: EN PDF p21; unit 83 -->

```text
+&ext_gmac {
+     clock-frequency = <50000000>;

+}

&gmac {
      phy-supply = <&vcc_lan>;
+     phy-mode = "rmii";
+     clock_in_out = "input";
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-parents = <&ext_gmac>;
      snps,reset-gpio = <&gpio3 12 0>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     pinctrl-names = "default";

+     pinctrl-0 = <&rmii_pins>;
      status = "ok";
};
```

<!-- source: EN PDF p21; unit 84 -->

#### 3.7.3   RK3368 RGMII Clock Input

<!-- source: EN PDF p21; unit 85 -->

```text
&gmac {
      phy-supply = <&vcc_lan>;

+     phy-mode = "rmii";
+     clock_in_out = "input";
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-parents = <&ext_gmac>;
      snps,reset-gpio = <&gpio3 12 0>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      status = "okay";
};
```

<!-- source: EN PDF p21; unit 86 -->

### 3.8   RK3399

<!-- source: EN PDF p21; unit 87 -->

#### 3.8.1   RK3399 RMII Clock Output

<!-- source: EN PDF p21; unit 88 -->

```text
&gmac {
+     assigned-clocks = <&cru SCLK_MAC>;

+     assigned-clock-rates = <50000000>;
+     clock_in_out = "output";
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";

+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      snps,reset-gpio = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
      status = "okay";
};
```

<!-- source: EN PDF p22; unit 89 -->

<!-- source: EN PDF p22; unit 90 -->

#### 3.8.2   RK3399 RMII Clock Input

<!-- source: EN PDF p22; unit 91 -->

```text
+&clkin_gmac {
+     clock-frequency = <50000000>;
+};


&gmac {
+     assigned-clocks = <&cru SCLK_RMII_SRC>;
+     assigned-clock-parents = <&clkin_gmac>;
+     clock_in_out = "input";
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      snps,reset-gpio = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;

      status = "okay";
};
```

<!-- source: EN PDF p22; unit 92 -->

#### 3.8.3   RK3399 RGMII Clock Input

<!-- source: EN PDF p22; unit 93 -->

```text
&gmac {
+     assigned-clocks = <&cru SCLK_RMII_SRC>;
+     assigned-clock-parents = <&clkin_gmac>;

+     clock_in_out = "input";
      phy-supply = <&vcc_phy>;
+     phy-mode = "rgmii";
+     pinctrl-names = "default";
+     pinctrl-0 = <&rgmii_pins>;
      snps,reset-gpio = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
      tx_delay = <0x28>;
      rx_delay = <0x11>;
      status = "okay";
};
```

<!-- source: EN PDF p23; unit 94 -->

### 3.9   RK3528

<!-- source: EN PDF p23; unit 95 -->

#### 3.9.1   GMAC1 RMII Clock 50M Output, PLL 25M Output

<!-- source: EN PDF p23; unit 96 -->

```text
&gmac1 {
   phy-mode = "rmii";
   clock_in_out = "output";


   snps,reset-gpio = <&gpio3 RK_PC3 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   snps,reset-delays-us = <0 10000 50000>;

   pinctrl-names = "default";
   pinctrl-0 = <&rgmii_miim
         &rgmii_tx_bus2
         &rgmii_rx_bus2
         &rgmii_clk
         &eth_pins>;

   phy-handle = <&rmii1_phy>;

   status = "okay";
};

&mdio1 {
   rmii1_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      clocks = <&cru CLK_GMAC1_VPU_25M>;
   };
};
```

<!-- source: EN PDF p23; unit 97 -->

#### 3.9.2   GMAC1 RMII Clock 50M Input, PLL 25M Output

<!-- source: EN PDF p23; unit 98 -->

```text
&gmac1 {
   phy-mode = "rmii";

   clock_in_out = "input";

   snps,reset-gpio = <&gpio3 RK_PC3 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   snps,reset-delays-us = <0 10000 50000>;

   pinctrl-names = "default";
   pinctrl-0 = <&rgmii_miim
         &rgmii_tx_bus2
         &rgmii_rx_bus2
         &rgmii_clk
         &eth_pins>;
   phy-handle = <&rmii1_phy>;
   status = "okay";
};


&mdio1 {
   rmii1_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      clocks = <&cru CLK_GMAC1_VPU_25M>;
   };
};
```

<!-- source: EN PDF p24; unit 99 -->

<!-- source: EN PDF p24; unit 100 -->

#### 3.9.3   GMAC1 RGMII PLL Output 25M for PHY, PLL Output 125M for TX_CLK

<!-- source: EN PDF p24; unit 101 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "output";

   snps,reset-gpio = <&gpio4 RK_PC2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x30>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmii_miim
         &rgmii_tx_bus2

         &rgmii_rx_bus2
         &rgmii_rgmii_clk
         &rgmii_rgmii_bus
         &eth_pins>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio1 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";

      reg = <0x1>;
      clocks = <&cru CLK_GMAC1_VPU_25M>;
   };
};
```

<!-- source: EN PDF p25; unit 102 -->

#### 3.9.4   GMAC1 RGMII Crystal 25M for PHY, PLL output 125M for TX_CLK

<!-- source: EN PDF p25; unit 103 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "output";

   snps,reset-gpio = <&gpio4 RK_PC2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x30>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmii_miim

         &rgmii_tx_bus2
         &rgmii_rx_bus2
         &rgmii_rgmii_clk
         &rgmii_rgmii_bus>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio1 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;

   };
};
```

<!-- source: EN PDF p25; unit 104 -->

#### 3.9.5   GMAC1 RGMII PLL Output 25M for PHY, RGMII_CLK Input 125M for TX_CLK

<!-- source: EN PDF p25; unit 105 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */

   phy-mode = "rgmii-rxid";
   clock_in_out = "input";

   snps,reset-gpio = <&gpio4 RK_PC2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x30>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmii_miim
            &rgmii_tx_bus2
            &rgmii_rx_bus2
            &rgmii_rgmii_clk

            &rgmii_rgmii_bus
            &rgmii_clk
            &eth_pins>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio1 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;

      clocks = <&cru CLK_GMAC1_VPU_25M>;
   };
};
```

<!-- source: EN PDF p26; unit 106 -->

<!-- source: EN PDF p26; unit 107 -->

#### 3.9.6   GMAC1 RGMII Crystal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: EN PDF p26; unit 108 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "input";

   snps,reset-gpio = <&gpio4 RK_PC2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x30>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmii_miim
         &rgmii_tx_bus2

         &rgmii_rx_bus2
         &rgmii_rgmii_clk
         &rgmii_rgmii_bus
         &rgmii_clk>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio1 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";

      reg = <0x1>;
   };
};
```

<!-- source: EN PDF p27; unit 109 -->

<!-- source: EN PDF p27; unit 110 -->

#### 3.9.7   GMAC0 & FEPHY

<!-- source: EN PDF p27; unit 111 -->

GMAC0 is connected internally with FEPHY and is fixed to RMII, with no configurable modes; however, the PHY LED function can be configured based on the hardware schematic. There are 3 functional IOs that can be configured by setting the corresponding IO iomux, with the default configuration as follows:

<!-- source: EN PDF p27; unit 112 -->

```text
&rmii0_phy {
   pinctrl-names = "default";
   pinctrl-0 = <&fephym0_led_link &fephym0_led_spd>;

};
```

<!-- source: EN PDF p27; unit 113 -->

### 3.10   RK3562

<!-- source: EN PDF p27; unit 114 -->

#### 3.10.1   RK3562 RMII Clock Output

<!-- source: EN PDF p27; unit 115 -->

gmac0m0

<!-- source: EN PDF p27; unit 116 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */

   phy-mode = "rmii";
   clock_in_out = "output";

   snps,reset-gpio = <&gpio4 RK_PB1 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim0_miim
         &rgmiim0_tx_bus2
         &rgmiim0_rx_bus2
         &rgmiim0_clk>;


   phy-handle = <&rmii_phy>;
   status = "okay";
};

&mdio0 {
   rmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
   };
};
```

<!-- source: EN PDF p27; unit 117 -->

gmac0m1:

<!-- source: EN PDF p28; unit 118 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rmii";

   clock_in_out = "output";

   snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim1_miim
         &rgmiim1_tx_bus2
         &rgmiim1_rx_bus2
         &rgmiim1_clk>;


   phy-handle = <&rmii_phy>;
   status = "okay";
};

&mdio0 {
   rmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
   };
};
```

<!-- source: EN PDF p28; unit 119 -->

gmac1(MAC100):

<!-- source: EN PDF p28; unit 120 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */

   phy-mode = "rmii";
   clock_in_out = "output";

   snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   pinctrl-names = "default";
   pinctrl-0 = <&rmii_pins>;

   phy-handle = <&rmii_phy>;

   status = "okay";
};

&mdio1 {
   rmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
   };
};
```

<!-- source: EN PDF p29; unit 121 -->

#### 3.10.2   RMII Clock Input, PLL out 25M for PHY

<!-- source: EN PDF p29; unit 122 -->

gmac0m0

<!-- source: EN PDF p29; unit 123 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rmii";

   clock_in_out = "input";

   snps,reset-gpio = <&gpio4 RK_PB1 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim0_miim
         &rgmiim0_tx_bus2
         &rgmiim0_rx_bus2
         &rgmiim0_clk
         &ethm0_pins>;


   phy-handle = <&rmii_phy>;
   status = "okay";
};

&mdio0 {
   rmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clock-rates = <25000000>;

   };
};
```

<!-- source: EN PDF p29; unit 124 -->

gmac0m1:

<!-- source: EN PDF p29; unit 125 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rmii";

   clock_in_out = "input";

   snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim1_miim
         &rgmiim1_tx_bus2
         &rgmiim1_rx_bus2
         &rgmiim1_clk
         &ethm1_pins>;


   phy-handle = <&rmii_phy>;
   status = "okay";
};

&mdio0 {
   rmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clock-rates = <25000000>;
   };

};
```

<!-- source: EN PDF p30; unit 126 -->

<!-- source: EN PDF p30; unit 127 -->

gmac1(MAC100):

<!-- source: EN PDF p30; unit 128 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */

   phy-mode = "rmii";
   clock_in_out = "input";

   snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   pinctrl-names = "default";
   pinctrl-0 = <&rmii_pins
         &ethm1_pins>;

   phy-handle = <&rmii_phy>;

   status = "okay";
};

&mdio1 {
   rmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clock-rates = <25000000>;
   };
};
```

<!-- source: EN PDF p31; unit 129 -->

#### 3.10.3   RGMII PLL Output 25M for PHY, PLL Output 125M for TX_CLK

<!-- source: EN PDF p31; unit 130 -->

gmac0m0

<!-- source: EN PDF p31; unit 131 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "output";

   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x3f>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim0_miim
            &rgmiim0_tx_bus2

            &rgmiim0_rx_bus2
            &rgmiim0_rgmii_clk
            &rgmiim0_rgmii_bus
            &ethm0_pins>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio0 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";

      reg = <0x1>;
      clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clock-rates = <25000000>;
   };
};
```

<!-- source: EN PDF p31; unit 132 -->

gmac0m1

<!-- source: EN PDF p31; unit 133 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "output";

   snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;
   tx_delay = <0x3f>;
   /* rx_delay = <0x3f>; */


   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim1_miim
            &rgmiim1_tx_bus2
            &rgmiim1_rx_bus2
            &rgmiim1_rgmii_clk
            &rgmiim1_rgmii_bus
            &ethm1_pins>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};


&mdio0 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clock-rates = <25000000>;
   };
};
```

<!-- source: EN PDF p32; unit 134 -->

<!-- source: EN PDF p32; unit 135 -->

#### 3.10.4   RGMII PLL Output 25M for PHY, RGMII_CLK Input 125M for TX_CLK

<!-- source: EN PDF p32; unit 136 -->

gmac0m0

<!-- source: EN PDF p32; unit 137 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "input";

   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x3f>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim0_miim

            &rgmiim0_tx_bus2
            &rgmiim0_rx_bus2
            &rgmiim0_rgmii_clk
            &rgmiim0_rgmii_bus
            &rgmiim0_clk
            &ethm0_pins>;
   phy-handle = <&rgmii_phy>;
   status = "okay";
};


&mdio0 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clock-rates = <25000000>;
   }
};
```

<!-- source: EN PDF p33; unit 138 -->

<!-- source: EN PDF p33; unit 139 -->

gmac0m1

<!-- source: EN PDF p33; unit 140 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */

   phy-mode = "rgmii-rxid";
   clock_in_out = "input";

   snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x39>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim1_miim

            &rgmiim1_tx_bus2
            &rgmiim1_rx_bus2
            &rgmiim1_rgmii_clk
            &rgmiim1_rgmii_bus
            &rgmiim1_clk
            &ethm1_pins>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio0 {

   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clocks = <&cru CLK_GMAC_ETH_OUT2IO>;
      assigned-clock-rates = <25000000>;
   }
};
```

<!-- source: EN PDF p34; unit 141 -->

#### 3.10.5   RGMII Crystal 25M for PHY, PLL output 125M for TX_CLK

<!-- source: EN PDF p34; unit 142 -->

gmac0m0

<!-- source: EN PDF p34; unit 143 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "output";

   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x3f>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim0_miim
         &rgmiim0_tx_bus2

         &rgmiim0_rx_bus2
         &rgmiim0_rgmii_clk
         &rgmiim0_rgmii_bus>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio0 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;

   };
};
```

<!-- source: EN PDF p34; unit 144 -->

gmac0m1

<!-- source: EN PDF p34; unit 145 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "output";

   snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x3f>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim1_miim
         &rgmiim1_tx_bus2
         &rgmiim1_rx_bus2

         &rgmiim1_rgmii_clk
         &rgmiim1_rgmii_bus>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio0 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
   };

};
```

<!-- source: EN PDF p35; unit 146 -->

<!-- source: EN PDF p35; unit 147 -->

#### 3.10.6   RGMII Crystal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: EN PDF p35; unit 148 -->

gmac0m0

<!-- source: EN PDF p35; unit 149 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "input";

   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x3f>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim0_miim

            &rgmiim0_tx_bus2
            &rgmiim0_rx_bus2
            &rgmiim0_rgmii_clk
            &rgmiim0_rgmii_bus
            &rgmiim0_clk>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio0 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";

      reg = <0x1>;
   };
};
```

<!-- source: EN PDF p36; unit 150 -->

<!-- source: EN PDF p36; unit 151 -->

gmac0m1

<!-- source: EN PDF p36; unit 152 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   phy-mode = "rgmii-rxid";

   clock_in_out = "input";

   snps,reset-gpio = <&gpio0 RK_PB0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   tx_delay = <0x39>;
   /* rx_delay = <0x3f>; */

   pinctrl-names = "default";
   pinctrl-0 = <&rgmiim1_miim
            &rgmiim1_tx_bus2

            &rgmiim1_rx_bus2
            &rgmiim1_rgmii_clk
            &rgmiim1_rgmii_bus
            &rgmiim1_clk>;

   phy-handle = <&rgmii_phy>;
   status = "okay";
};

&mdio0 {
   rgmii_phy: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";

      reg = <0x1>;
   };
};
```

<!-- source: EN PDF p36; unit 153 -->

### 3.11   RK3568

<!-- source: EN PDF p36; unit 154 -->

#### 3.11.1   RK3568 RMII Clock Output

<!-- source: EN PDF p36; unit 155 -->

gmac0

<!-- source: EN PDF p36; unit 156 -->

```text
&gmac0 {
+     phy-mode = "rmii";

+     clock_in_out = "output";
+     assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>;
+     assigned-clock-parents = <&cru SCLK_GMAC0_RMII_SPEED>;
+     assigned-clock-rates = <0>, <50000000>;
      snps,reset-gpio = <&gpio3 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;

      pinctrl-names = "default";
      pinctrl-0 = <&gmac0_miim &gmac0_clkinout &gmac0_rx_bus2 &gmac0_tx_bus2>;

      phy-handle = <&rmii_phy0>;
      status = "okay";
};

&mdio0 {
      rmii_phy0: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
      };

};
```

<!-- source: EN PDF p37; unit 157 -->

<!-- source: EN PDF p37; unit 158 -->

gmac1m0:

<!-- source: EN PDF p37; unit 159 -->

```text
&gmac1 {
+     phy-mode = "rmii";

+     clock_in_out = "output";
+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RMII_SPEED>;
+     assigned-clock-rates = <0>, <50000000>;

      snps,reset-gpio = <&gpio3 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m0_miim &gmac1m0_clkinout &gmac1m0_rx_bus2 &gmac1m0_tx_bus2>;

      phy-handle = <&rmii_phy1>;

      status = "okay";
};

&mdio1 {
      rmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p37; unit 160 -->

gmac1m1:

<!-- source: EN PDF p37; unit 161 -->

```text
&gmac1 {
+     phy-mode = "rmii";

+     clock_in_out = "output";
+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RMII_SPEED>;
+     assigned-clock-rates = <0>, <50000000>;
      snps,reset-gpio = <&gpio3 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;

      snps,reset-delays-us = <0 20000 100000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m1_miim &gmac1m1_clkinout &gmac1m1_rx_bus2 &gmac1m1_tx_bus2>;

      phy-handle = <&rmii_phy1>;
      status = "okay";
};

&mdio1 {
      rmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";

           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p38; unit 162 -->

<!-- source: EN PDF p38; unit 163 -->

#### 3.11.2   RK3568 RMII Clock Input

<!-- source: EN PDF p38; unit 164 -->

gmac0

<!-- source: EN PDF p38; unit 165 -->

```text
+&gmac0_clkin{
+     clock-frequency = <50000000>;

+};

&gmac0 {
+     phy-mode = "rmii";
+     clock_in_out = "input";

      snps,reset-gpio = <&gpio3 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>;
+     assigned-clock-parents = <&cru SCLK_GMAC0_RMII_SPEED>, <&gmac0_clkin>;


+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac0_miim &gmac0_clkinout &gmac0_rx_bus2 &gmac0_tx_bus2>;

      phy-handle = <&rmii_phy0>;
      status = "okay";
};

&mdio0 {
      rmii_phy0: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
      };

};
```

<!-- source: EN PDF p39; unit 166 -->

gmac1m0:

<!-- source: EN PDF p39; unit 167 -->

```text
+&gmac1_clkin{
+     clock-frequency = <50000000>;
+};


&gmac1 {
+     phy-mode = "rmii";
+     clock_in_out = "input";

      snps,reset-gpio = <&gpio3 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RMII_SPEED>, <&gmac1_clkin>;

+     pinctrl-names = "default";

+     pinctrl-0 = <&gmac1m0_miim &gmac1m0_clkinout &gmac1m0_rx_bus2 &gmac1m0_tx_bus2>;

      phy-handle = <&rmii_phy1>;
      status = "okay";
};
&mdio1 {
      rmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p39; unit 168 -->

gmac1m1:

<!-- source: EN PDF p39; unit 169 -->

```text
+&gmac1_clkin{
+     clock-frequency = <50000000>;

+};

&gmac1 {
+     phy-mode = "rmii";
+     clock_in_out = "input";

      snps,reset-gpio = <&gpio3 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RMII_SPEED>, <&gmac1_clkin>;

+     pinctrl-names = "default";

+     pinctrl-0 = <&gmac1m1_miim &gmac1m1_clkinout &gmac1m1_rx_bus2 &gmac1m1_tx_bus2>;

      phy-handle = <&rmii_phy1>;
      status = "okay";
};
&mdio1 {
      rmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";

           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p40; unit 170 -->

<!-- source: EN PDF p40; unit 171 -->

#### 3.11.3   RGMII PLL Output 25M for PHY, PLL Output 125M for TX_CLK

<!-- source: EN PDF p40; unit 172 -->

gmac0

<!-- source: EN PDF p40; unit 173 -->

```text
&gmac0 {
+     phy-mode = "rgmii";
+     clock_in_out = "output";

+     assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>, <&cru CLK_MAC0_OUT>;
+     assigned-clock-parents = <&cru SCLK_GMAC0_RGMII_SPEED>;
+     assigned-clock-rates = <0>, <125000000>, <25000000>;

      snps,reset-gpio = <&gpio2 RK_PD3 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac0_miim
+               &gmac0_tx_bus2

+               &gmac0_rx_bus2
+               &gmac0_rgmii_clk
+               &gmac0_rgmii_bus
+               &eth0_pins>;

      tx_delay = <0x3c>;
      rx_delay = <0x2f>;
      phy-handle = <&rgmii_phy0>;
      status = "okay";
};

&mdio0 {
      rgmii_phy0: phy@0 {

           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
+           clocks = <&cru CLK_MAC0_OUT>;
      };
};
```

<!-- source: EN PDF p40; unit 174 -->

gmac1m0

<!-- source: EN PDF p40; unit 175 -->

```text
&gmac1 {
+     phy-mode = "rgmii";

+     clock_in_out = "output";
      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;

      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>, <&cru CLK_MAC1_OUT>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>;
+     assigned-clock-rates = <0>, <125000000>, <25000000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m0_miim
+               &gmac1m0_tx_bus2
+               &gmac1m0_rx_bus2
+               &gmac1m0_rgmii_clk

+               &gmac1m0_rgmii_bus
+               &eth1m0_pins>;

      tx_delay = <0x4f>;
      rx_delay = <0x26>;

      phy-handle = <&rgmii_phy1>;
      status = "okay";
};

&mdio1 {
      rgmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";

           reg = <0x0>;
+           clocks = <&cru CLK_MAC1_OUT>;
      };
};
```

<!-- source: EN PDF p41; unit 176 -->

<!-- source: EN PDF p41; unit 177 -->

gmac1m1

<!-- source: EN PDF p41; unit 178 -->

```text
&gmac1 {
+     phy-mode = "rgmii";
+     clock_in_out = "output";


      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>, <&cru CLK_MAC1_OUT>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>;
+     assigned-clock-rates = <0>, <125000000>, <25000000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m1_miim

+               &gmac1m1_tx_bus2
+               &gmac1m1_rx_bus2
+               &gmac1m1_rgmii_clk
+               &gmac1m1_rgmii_bus
+               &eth1m1_pins>;


      tx_delay = <0x4f>;
      rx_delay = <0x26>;

      phy-handle = <&rgmii_phy1>;
      status = "okay";
};

&mdio1 {
      rgmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
+           clocks = <&cru CLK_MAC1_OUT>;

      };
};
```

<!-- source: EN PDF p42; unit 179 -->

<!-- source: EN PDF p42; unit 180 -->

#### 3.11.4   RGMII PLL Output 25M for PHY, RGMII_CLK Input 125M for TX_CLK

<!-- source: EN PDF p42; unit 181 -->

gmac0

<!-- source: EN PDF p42; unit 182 -->

```text
&gmac0 {
+     phy-mode = "rgmii";
+     clock_in_out = "input";

+     assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>, <&cru CLK_MAC0_OUT>;
+     assigned-clock-parents = <&cru SCLK_GMAC0_RGMII_SPEED>, <&gmac0_clkin>;
+     assigned-clock-rates = <0>, <125000000>, <25000000>;

      snps,reset-gpio = <&gpio2 RK_PD3 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac0_miim
+               &gmac0_tx_bus2

+               &gmac0_rx_bus2
+               &gmac0_rgmii_clk
+               &gmac0_rgmii_bus
+               &eth0_pins
+               &gmac0_clkinout>;

      tx_delay = <0x3c>;
      rx_delay = <0x2f>;
      phy-handle = <&rgmii_phy0>;
      status = "okay";
};

&mdio0 {

      rgmii_phy0: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
+           clocks = <&cru CLK_MAC0_OUT>;

      };
};
```

<!-- source: EN PDF p43; unit 183 -->

<!-- source: EN PDF p43; unit 184 -->

gmac1m0

<!-- source: EN PDF p43; unit 185 -->

```text
&gmac1 {
+     phy-mode = "rgmii";

+     clock_in_out = "input";

      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>, <&cru CLK_MAC1_OUT>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>, <&gmac1_clkin>;
+     assigned-clock-rates = <0>, <125000000>, <25000000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m0_miim

+               &gmac1m0_tx_bus2
+               &gmac1m0_rx_bus2
+               &gmac1m0_rgmii_clk
+               &gmac1m0_rgmii_bus
+               &eth1m0_pins
+               &gmac1m0_clkinout>;

      tx_delay = <0x4f>;
      rx_delay = <0x26>;

      phy-handle = <&rgmii_phy1>;
      status = "okay";

};

&mdio0 {
      rgmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
+           clocks = <&cru CLK_MAC0_OUT>;
      };
};
```

<!-- source: EN PDF p43; unit 186 -->

gmac1m1

<!-- source: EN PDF p43; unit 187 -->

```text
&gmac1 {
+     phy-mode = "rgmii";

+     clock_in_out = "input";

      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;


+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>, <&cru CLK_MAC1_OUT>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>, <&gmac1_clkin>;
+     assigned-clock-rates = <0>, <125000000>, <25000000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m1_miim
+               &gmac1m1_tx_bus2
+               &gmac1m1_rx_bus2
+               &gmac1m1_rgmii_clk
+               &gmac1m1_rgmii_bus
+               &eth1m1_pins

+               &gmac1m1_clkinout>;

      tx_delay = <0x4f>;
      rx_delay = <0x26>;

      phy-handle = <&rgmii_phy1>;
      status = "okay";
};

&mdio1 {
      rgmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;

+           clocks = <&cru CLK_MAC1_OUT>;
      };
};
```

<!-- source: EN PDF p44; unit 188 -->

<!-- source: EN PDF p44; unit 189 -->

#### 3.11.5   RGMII Crystal 25M for PHY, PLL output 125M for TX_CLK

<!-- source: EN PDF p44; unit 190 -->

gmac0

<!-- source: EN PDF p44; unit 191 -->

```text
&gmac0 {
+     phy-mode = "rgmii";
+     clock_in_out = "output";

+     assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>;
+     assigned-clock-parents = <&cru SCLK_GMAC0_RGMII_SPEED>;
+     assigned-clock-rates = <0>, <125000000>;

      snps,reset-gpio = <&gpio2 RK_PD3 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac0_miim
+               &gmac0_tx_bus2
+               &gmac0_rx_bus2
+               &gmac0_rgmii_clk
+               &gmac0_rgmii_bus>;


      tx_delay = <0x3c>;
      rx_delay = <0x2f>;
      phy-handle = <&rgmii_phy0>;
      status = "okay";
};

&mdio0 {
      rgmii_phy0: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
      };

};
```

<!-- source: EN PDF p45; unit 192 -->

<!-- source: EN PDF p45; unit 193 -->

gmac1m0

<!-- source: EN PDF p45; unit 194 -->

```text
&gmac1 {
+     phy-mode = "rgmii";

+     clock_in_out = "output";

      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>;
+     assigned-clock-rates = <0>, <125000000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m0_miim

+               &gmac1m0_tx_bus2
+               &gmac1m0_rx_bus2
+               &gmac1m0_rgmii_clk
+               &gmac1m0_rgmii_bus>;

      tx_delay = <0x4f>;
      rx_delay = <0x26>;

      phy-handle = <&rgmii_phy1>;
      status = "okay";
};


&mdio1 {
      rgmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p46; unit 195 -->

gmac1m1

<!-- source: EN PDF p46; unit 196 -->

```text
&gmac1 {
+     phy-mode = "rgmii";
+     clock_in_out = "output";


      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>;
+     assigned-clock-rates = <0>, <125000000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m1_miim

+               &gmac1m1_tx_bus2
+               &gmac1m1_rx_bus2
+               &gmac1m1_rgmii_clk
+               &gmac1m1_rgmii_bus>;

      tx_delay = <0x4f>;
      rx_delay = <0x26>;

      phy-handle = <&rgmii_phy1>;
      status = "okay";
};

&mdio1 {

      rgmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p46; unit 197 -->

#### 3.11.6   RGMII Crystal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: EN PDF p46; unit 198 -->

gmac0

<!-- source: EN PDF p46; unit 199 -->

```text
&gmac0 {
+     phy-mode = "rgmii";

+     clock_in_out = "input";
+     assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>;
+     assigned-clock-parents = <&cru SCLK_GMAC0_RGMII_SPEED>, <&gmac0_clkin>;
+     assigned-clock-rates = <0>, <125000000>;

      snps,reset-gpio = <&gpio2 RK_PD3 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac0_miim

+               &gmac0_tx_bus2
+               &gmac0_rx_bus2
+               &gmac0_rgmii_clk
+               &gmac0_rgmii_bus
+               &gmac0_clkinout>;

      tx_delay = <0x3c>;
      rx_delay = <0x2f>;
      phy-handle = <&rgmii_phy0>;
      status = "okay";
};


&mdio0 {
      rgmii_phy0: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p47; unit 200 -->

<!-- source: EN PDF p47; unit 201 -->

gmac1m0

<!-- source: EN PDF p47; unit 202 -->

```text
&gmac1 {
+     phy-mode = "rgmii";
+     clock_in_out = "input";


      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>, <&gmac1_clkin>;
+     assigned-clock-rates = <0>, <125000000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m0_miim

+               &gmac1m0_tx_bus2
+               &gmac1m0_rx_bus2
+               &gmac1m0_rgmii_clk
+               &gmac1m0_rgmii_bus
+               &gmac1m0_clkinout>;

      tx_delay = <0x4f>;
      rx_delay = <0x26>;

      phy-handle = <&rgmii_phy1>;
      status = "okay";
};


&mdio1 {
      rgmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;

      };
};
```

<!-- source: EN PDF p48; unit 203 -->

<!-- source: EN PDF p48; unit 204 -->

gmac1m1

<!-- source: EN PDF p48; unit 205 -->

```text
&gmac1 {
+     phy-mode = "rgmii";

+     clock_in_out = "input";

      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>;
+     assigned-clock-parents = <&cru SCLK_GMAC1_RGMII_SPEED>, <&gmac1_clkin>;
+     assigned-clock-rates = <0>, <125000000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1m1_miim

+               &gmac1m1_tx_bus2
+               &gmac1m1_rx_bus2
+               &gmac1m1_rgmii_clk
+               &gmac1m1_rgmii_bus
+               &gmac1m1_clkinout>;

      tx_delay = <0x4f>;
      rx_delay = <0x26>;

      phy-handle = <&rgmii_phy1>;
      status = "okay";
};


&mdio1 {
      rgmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p48; unit 206 -->

#### 3.11.7   SGMII

<!-- source: EN PDF p48; unit 207 -->

DTS, in addition to configuring the gmac and mac phy nodes, also requires configuring the xpcs and combophy nodes.

<!-- source: EN PDF p48; unit 208 -->

combophy

<!-- source: EN PDF p48; unit 209 -->

The property  rockchip,sgmii-mac-sel  indicates which gmac is being used:

<!-- source: EN PDF p49; unit 210 -->

```text
&combphy1_usq {
+     rockchip,sgmii-mac-sel = <0>; /* Use gmac0 for sgmii */
      status = "okay";

};
```

<!-- source: EN PDF p49; unit 211 -->

xpcs

<!-- source: EN PDF p49; unit 212 -->

```text
&xpcs {
      status = "okay";
};
```

<!-- source: EN PDF p49; unit 213 -->

gmac0

<!-- source: EN PDF p49; unit 214 -->

```text
&gmac0 {
      phy-mode = "sgmii";


      rockchip,pipegrf = <&pipegrf>;
      rockchip,xpcs = <&xpcs>;

      snps,reset-gpio = <&gpio2 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;

      assigned-clocks = <&cru SCLK_GMAC0_RX_TX>;
      assigned-clock-parents = <&gmac0_xpcsclk>;

      pinctrl-names = "default";
      pinctrl-0 = <&gmac0_miim>;


      power-domains = <&power RK3568_PD_PIPE>;
      phys = <&combphy1_usq PHY_TYPE_SGMII>;
      phy-handle = <&sgmii_phy>;
      status = "okay";
};

&mdio0 {
      sgmii_phy: phy@1 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x1>;
      };
};
```

<!-- source: EN PDF p49; unit 215 -->

gmac1

<!-- source: EN PDF p49; unit 216 -->

```text
&gmac1 {
      phy-mode = "sgmii";


      rockchip,pipegrf = <&pipegrf>;
      rockchip,xpcs = <&xpcs>;

      snps,reset-gpio = <&gpio2 RK_PC2 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;


      assigned-clocks = <&cru SCLK_GMAC1_RX_TX>;
      assigned-clock-parents = <&gmac1_xpcsclk>;

      pinctrl-names = "default";
      pinctrl-0 = <&gmac1_miim>;

      power-domains = <&power RK3568_PD_PIPE>;
      phys = <&combphy1_usq PHY_TYPE_SGMII>;
      phy-handle = <&sgmii_phy>;
      status = "okay";
};


&mdio1 {
      sgmii_phy: phy@1 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x1>;
      };
};
```

<!-- source: EN PDF p50; unit 217 -->

<!-- source: EN PDF p50; unit 218 -->

#### 3.11.8   QSGMII

<!-- source: EN PDF p50; unit 219 -->

Similar to SGMIIL, DTS in addition to configuring the gmac and mac phy nodes, also needs to configure the xpcs and combophy nodes.

<!-- source: EN PDF p50; unit 220 -->

combophy

<!-- source: EN PDF p50; unit 221 -->

```text
&combphy2_psq {
   status = "okay";
};
```

<!-- source: EN PDF p50; unit 222 -->

xpcs

<!-- source: EN PDF p50; unit 223 -->

```text
&xpcs {
   status = "okay";
};
```

<!-- source: EN PDF p50; unit 224 -->

```text
&gmac0 {
   phy-supply = <&pcie20_3v3>;
   phy-mode = "qsgmii";

   rockchip,xpcs = <&xpcs>;

   snps,reset-gpio = <&gpio2 RK_PC2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   snps,reset-delays-us = <0 20000 100000>;

   assigned-clocks = <&cru SCLK_GMAC0_RX_TX>;
   assigned-clock-parents = <&gmac0_xpcsclk>;
   pinctrl-names = "default";
   pinctrl-0 = <&gmac0_miim>;


   power-domains = <&power RK3568_PD_PIPE>;
   phys = <&combphy2_psq PHY_TYPE_QSGMII>;
   phy-handle = <&qsgmii_phy0>;

   status = "okay";
};

&gmac1 {
   phy-supply = <&pcie20_3v3>;
   phy-mode = "qsgmii";


   assigned-clocks = <&cru SCLK_GMAC1_RX_TX>;
   assigned-clock-parents = <&gmac1_xpcsclk>;

   power-domains = <&power RK3568_PD_PIPE>;
   phy-handle = <&qsgmii_phy1>;

   status = "okay";
};

&mdio0 {
   qsgmii_phy0: phy@0 {
      compatible = "ethernet-phy-id001c.c942", "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;

   };
   qsgmii_phy1: phy@1 {
      compatible = "ethernet-phy-id001c.c942", "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
   };
   qsgmii_phy2: phy@2 {
      compatible = "ethernet-phy-id001c.c942", "ethernet-phy-ieee802.3-c22";
      reg = <0x2>;
   };
   qsgmii_phy3: phy@3 {
      compatible = "ethernet-phy-id001c.c942", "ethernet-phy-ieee802.3-c22";
      reg = <0x3>;

   };
};
```

<!-- source: EN PDF p51; unit 225 -->

<!-- source: EN PDF p51; unit 226 -->

### 3.12   RK3588/RK3576

<!-- source: EN PDF p51; unit 227 -->

#### 3.12.1   RK3588/RK3576 RMII Clock Output

<!-- source: EN PDF p51; unit 228 -->

gmac0

<!-- source: EN PDF p51; unit 229 -->

```text
&gmac0 {
+     phy-mode = "rmii";
+     clock_in_out = "output";


     snps,reset-gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_LOW>;
     snps,reset-active-low;
     /* Reset time is 20ms, 100ms for rtl8211f */
     snps,reset-delays-us = <0 20000 100000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac0_miim
+              &gmac0_tx_bus2
+              &gmac0_rx_bus2
+              &gmac0_clkinout>;

     phy-handle = <&rmii_phy0>;

     status = "okay";
};

&mdio0 {
     rmii_phy0: phy@1 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x1>;
     };
};
```

<!-- source: EN PDF p52; unit 230 -->

<!-- source: EN PDF p52; unit 231 -->

gmac1:

<!-- source: EN PDF p52; unit 232 -->

```text
&gmac1 {
+     phy-mode = "rmii";
+     clock_in_out = "output";


     snps,reset-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
     snps,reset-active-low;
     /* Reset time is 20ms, 100ms for rtl8211f */
     snps,reset-delays-us = <0 20000 100000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac1_miim
+              &gmac1_tx_bus2
+              &gmac1_rx_bus2
+              &gmac1_clkinout>;


     phy-handle = <&rmii_phy1>;
     status = "okay";
};

&mdio1 {
     rmii_phy1: phy@1 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x1>;
     };
};
```

<!-- source: EN PDF p53; unit 233 -->

#### 3.12.2   RK3588/RK3576 RMII Clock Input

<!-- source: EN PDF p53; unit 234 -->

gmac0

<!-- source: EN PDF p53; unit 235 -->

```text
&gmac0 {
+     phy-mode = "rmii";
+     clock_in_out = "input";


     snps,reset-gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_LOW>;
     snps,reset-active-low;
     /* Reset time is 20ms, 100ms for rtl8211f */
     snps,reset-delays-us = <0 20000 100000>;

+     pinctrl-names = "default";
+     pinctrl-0 = <&gmac0_miim
+              &gmac0_tx_bus2
+              &gmac0_rx_bus2
+              &gmac0_clkinout>;

     phy-handle = <&rmii_phy0>;

     status = "okay";
};

&mdio0 {
     rmii_phy0: phy@1 {
           compatible = "ethernet-phy-ieee802.3-c22";
           reg = <0x1>;
     };
};
```

<!-- source: EN PDF p53; unit 236 -->

gmac1:

<!-- source: EN PDF p53; unit 237 -->

```text
&gmac1 {
+  phy-mode = "rmii";

+  clock_in_out = "input";

   snps,reset-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  pinctrl-names = "default";
+  pinctrl-0 = <&gmac1_miim
+           &gmac1_tx_bus2
+           &gmac1_rx_bus2
+           &gmac1_clkinout>;


   phy-handle = <&rmii_phy1>;
   status = "okay";
};
&mdio1 {
   rmii_phy1: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";

      reg = <0x1>;
   };
};
```

<!-- source: EN PDF p54; unit 238 -->

<!-- source: EN PDF p54; unit 239 -->

#### 3.12.3   RGMII PLL Output 25M for PHY, PLL Output 125M for TX_CLK

<!-- source: EN PDF p54; unit 240 -->

gmac0

<!-- source: EN PDF p54; unit 241 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   +  phy-mode = "rgmii-rxid";

   clock_in_out = "output";

   snps,reset-gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   +  pinctrl-names = "default";
   +  pinctrl-0 = <&gmac0_miim
   +          &gmac0_tx_bus2
   +          &gmac0_rx_bus2
   +          &gmac0_rgmii_clk

   +          &gmac0_rgmii_bus
   +          &eth0_pins>;

   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy0>;
   status = "okay";
};

&mdio0 {
   rgmii_phy0: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";

      reg = <0x1>;
      +  clocks = <&cru REFCLKO25M_ETH0_OUT>;
   };
};
```

<!-- source: EN PDF p54; unit 242 -->

gmac1

<!-- source: EN PDF p54; unit 243 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   +  phy-mode = "rgmii-rxid";

   +  clock_in_out = "output";
   snps,reset-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;

   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   +  pinctrl-names = "default";
   +  pinctrl-0 = <&gmac1_miim
   +          &gmac1_tx_bus2
   +          &gmac1_rx_bus2
   +          &gmac1_rgmii_clk
   +          &gmac1_rgmii_bus
   +          &eth1_pins>;

   tx_delay = <0x45>;

   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy1>;
   status = "okay";
};

&mdio1 {
   rgmii_phy1: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      +  clocks = <&cru REFCLKO25M_ETH0_OUT>;
   };
};
```

<!-- source: EN PDF p55; unit 244 -->

<!-- source: EN PDF p55; unit 245 -->

#### 3.12.4   RGMII PLL Output 25M for PHY, RGMII_CLK Input 125M for TX_CLK

<!-- source: EN PDF p55; unit 246 -->

gmac0

<!-- source: EN PDF p55; unit 247 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   +  phy-mode = "rgmii-rxid";

   +  clock_in_out = "input";

   snps,reset-gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   +  pinctrl-names = "default";
   +  pinctrl-0 = <&gmac0_miim
   +          &gmac0_tx_bus2
   +          &gmac0_rx_bus2
   +          &gmac0_rgmii_clk
   +          &gmac0_rgmii_bus

   +          &gmac0_clkinout
   +          &eth0_pins>;
   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */


   phy-handle = <&rgmii_phy0>;
   status = "okay";
};

&mdio0 {
   rgmii_phy0: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      +  clocks = <&cru REFCLKO25M_ETH0_OUT>;
   };
};
```

<!-- source: EN PDF p56; unit 248 -->

<!-- source: EN PDF p56; unit 249 -->

gmac1

<!-- source: EN PDF p56; unit 250 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   +  phy-mode = "rgmii-rxid";

   +  clock_in_out = "input";

   snps,reset-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   +  pinctrl-names = "default";
   +  pinctrl-0 = <&gmac1_miim
   +          &gmac1_tx_bus2
   +          &gmac1_rx_bus2
   +          &gmac1_rgmii_clk
   +          &gmac1_rgmii_bus

   +          &gmac1_clkinout
   +          &eth1_pins>;

   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy1>;
   status = "okay";
};

&mdio1 {
   rgmii_phy1: phy@1 {

      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
      +  clocks = <&cru REFCLKO25M_ETH0_OUT>;
   };
};
```

<!-- source: EN PDF p57; unit 251 -->

#### 3.12.5   RGMII Crystal 25M for PHY, PLL output 125M for TX_CLK

<!-- source: EN PDF p57; unit 252 -->

gmac0

<!-- source: EN PDF p57; unit 253 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   +  phy-mode = "rgmii-rxid";

   +  clock_in_out = "output";

   snps,reset-gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   +  pinctrl-names = "default";
   +  pinctrl-0 = <&gmac0_miim
   +          &gmac0_tx_bus2
   +          &gmac0_rx_bus2
   +          &gmac0_rgmii_clk
   +          &gmac0_rgmii_bus>;


   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy0>;
   status = "okay";
};

&mdio0 {
   rgmii_phy0: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;

   };
};
```

<!-- source: EN PDF p57; unit 254 -->

gmac1

<!-- source: EN PDF p57; unit 255 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   +  phy-mode = "rgmii-rxid";

   +  clock_in_out = "output";

   snps,reset-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   +  pinctrl-names = "default";
   +  pinctrl-0 = <&gmac1_miim
   +          &gmac1_tx_bus2
   +          &gmac1_rx_bus2
   +          &gmac1_rgmii_clk
   +          &gmac1_rgmii_bus>;


   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy1>;
   status = "okay";
};

&mdio1 {
   rgmii_phy1: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;
   };

};
```

<!-- source: EN PDF p58; unit 256 -->

<!-- source: EN PDF p58; unit 257 -->

#### 3.12.6   RGMII Crystal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: EN PDF p58; unit 258 -->

gmac0

<!-- source: EN PDF p58; unit 259 -->

```text
&gmac0 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   +  phy-mode = "rgmii-rxid";

   +  clock_in_out = "input";

   snps,reset-gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   +  pinctrl-names = "default";
   +  pinctrl-0 = <&gmac0_miim
   +          &gmac0_tx_bus2
   +          &gmac0_rx_bus2
   +          &gmac0_rgmii_clk

   +          &gmac0_rgmii_bus
   +          &gmac0_clkinout>;

   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy0>;
   status = "okay";
};

&mdio0 {
      rgmii_phy0: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";

           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p59; unit 260 -->

<!-- source: EN PDF p59; unit 261 -->

gmac1

<!-- source: EN PDF p59; unit 262 -->

```text
&gmac1 {
   /* Use rgmii-rxid mode to disable rx delay inside Soc */
   +  phy-mode = "rgmii-rxid";

   +  clock_in_out = "input";

   snps,reset-gpio = <&gpio3 RK_PB2 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

   +  pinctrl-names = "default";
   +  pinctrl-0 = <&gmac1_miim
   +          &gmac1_tx_bus2
   +          &gmac1_rx_bus2
   +          &gmac1_rgmii_clk
   +          &gmac1_rgmii_bus

   +          &gmac1_clkinout>;

   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy1>;
   status = "okay";
};

&mdio1 {
      rgmii_phy1: phy@0 {
           compatible = "ethernet-phy-ieee802.3-c22";

           reg = <0x0>;
      };
};
```

<!-- source: EN PDF p59; unit 263 -->

### 3.13   RV1108

<!-- source: EN PDF p59; unit 264 -->

#### 3.13.1   RV1108 RMII Clock Input

<!-- source: EN PDF p59; unit 265 -->

```text
+gmac_clkin: gmac_clkin {
+     compatible = "fixed-clock";

+     clock-output-names = "gmac_clkin";
+     clock-frequency = <50000000>;
+     #clock-cells = <0>;
+};

&gmac {
+     phy-mode = "rmii";
+     clock_in_out = "input";
+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-parents = <&gmac_clkin>;

      snps,reset-gpio = <&gpio3 12 0>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      status = "ok";
};
```

<!-- source: EN PDF p60; unit 266 -->

<!-- source: EN PDF p60; unit 267 -->

#### 3.13.2   RV1108 RMII Clock Output

<!-- source: EN PDF p60; unit 268 -->

```text
&gmac {
+     phy-mode = "rmii";
+     clock_in_out = "output";

+     assigned-clocks = <&cru SCLK_MAC>;
+     assigned-clock-rates = <50000000>;
      snps,reset-gpio = <&gpio3 12 0>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 20000 100000>;
+     pinctrl-names = "default";
+     pinctrl-0 = <&rmii_pins>;
      status = "ok";
};
```

<!-- source: EN PDF p60; unit 269 -->

### 3.14   RV1126

<!-- source: EN PDF p60; unit 270 -->

#### 3.14.1   RGMII PLL Output 25M for PHY, PLL Output 125M for TX_CLK

<!-- source: EN PDF p60; unit 271 -->

gmac m0

<!-- source: EN PDF p60; unit 272 -->

```text
&gmac {
+  phy-mode = "rgmii";
+  clock_in_out = "output";


   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
+  assigned-clock-parents = <&cru CLK_GMAC_SRC_M0>, <&cru RGMII_MODE_CLK>;
+  assigned-clock-rates = <125000000>, <0>, <25000000>;

+  pinctrl-names = "default";

+  pinctrl-0 = <&rgmiim0_miim &rgmiim0_bus2 &rgmiim0_bus4 &clkm0_out_ethernet>;
   tx_delay = <0x2a>;
   rx_delay = <0x1a>;


   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;
+     clocks = <&cru CLK_GMAC_ETHERNET_OUT>;
   };
};
```

<!-- source: EN PDF p61; unit 273 -->

<!-- source: EN PDF p61; unit 274 -->

gmac m1

<!-- source: EN PDF p61; unit 275 -->

```text
&gmac {
+  phy-mode = "rgmii";
+  clock_in_out = "output";


   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
+  assigned-clock-parents = <&cru CLK_GMAC_SRC_M1>, <&cru RGMII_MODE_CLK>;
+  assigned-clock-rates = <125000000>, <0>, <25000000>;

+  pinctrl-names = "default";
+  pinctrl-0 = <&rgmiim1_miim &rgmiim1_bus2 &rgmiim1_bus4 &clkm1_out_ethernet>;


   tx_delay = <0x2a>;
   rx_delay = <0x1a>;

   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;

+     clocks = <&cru CLK_GMAC_ETHERNET_OUT>;
   };
};
```

<!-- source: EN PDF p62; unit 276 -->

#### 3.14.2   RGMII PLL Output 25M for PHY, RGMII Clock Input 125M for TX_CLK

<!-- source: EN PDF p62; unit 277 -->

gmac m0

<!-- source: EN PDF p62; unit 278 -->

```text
&gmac {
+  phy-mode = "rgmii";
+  clock_in_out = "input";


   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
+  assigned-clock-parents = <&cru CLK_GMAC_SRC_M0>, <&cru RGMII_MODE_CLK>;
+  assigned-clock-rates = <125000000>, <0>, <25000000>;

+  pinctrl-names = "default";
+  pinctrl-0 = <&rgmiim0_miim &rgmiim0_bus2 &rgmiim0_bus4 &clkm0_out_ethernet>;


   tx_delay = <0x2a>;
   rx_delay = <0x1a>;

   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;

+     clocks = <&cru CLK_GMAC_ETHERNET_OUT>;
   };
};
```

<!-- source: EN PDF p62; unit 279 -->

gmac m1

<!-- source: EN PDF p62; unit 280 -->

```text
&gmac {
+  phy-mode = "rgmii";
+  clock_in_out = "input";


   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
+  assigned-clock-parents = <&cru CLK_GMAC_SRC_M1>, <&cru RGMII_MODE_CLK>;
+  assigned-clock-rates = <125000000>, <0>, <25000000>;
+  pinctrl-names = "default";
+  pinctrl-0 = <&rgmiim1_miim &rgmiim1_bus2 &rgmiim1_bus4 &clkm1_out_ethernet>;


   tx_delay = <0x2a>;
   rx_delay = <0x1a>;

   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;

+     clocks = <&cru CLK_GMAC_ETHERNET_OUT>;
   };
};
```

<!-- source: EN PDF p63; unit 281 -->

<!-- source: EN PDF p63; unit 282 -->

#### 3.14.3   RGMII Crystal 25M for PHY, PLL Output 125M for TX_CLK

<!-- source: EN PDF p63; unit 283 -->

gmac m0

<!-- source: EN PDF p63; unit 284 -->

```text
&gmac {
+  phy-mode = "rgmii";

+  clock_in_out = "output";

   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+  assigned-clock-parents = <&cru CLK_GMAC_SRC_M0>, <&cru RGMII_MODE_CLK>;
+  assigned-clock-rates = <125000000>, <0>;

+  pinctrl-names = "default";

+  pinctrl-0 = <&rgmiim0_miim &rgmiim0_bus2 &rgmiim0_bus4 &clkm0_out_ethernet>;

   tx_delay = <0x2a>;
   rx_delay = <0x1a>;

   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;

   };
};
```

<!-- source: EN PDF p64; unit 285 -->

<!-- source: EN PDF p64; unit 286 -->

gmac m1

<!-- source: EN PDF p64; unit 287 -->

```text
&gmac {
+  phy-mode = "rgmii";
+  clock_in_out = "output";


   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+  assigned-clock-parents = <&cru CLK_GMAC_SRC_M1>, <&cru RGMII_MODE_CLK>;
+  assigned-clock-rates = <125000000>, <0>;

+  pinctrl-names = "default";
+  pinctrl-0 = <&rgmiim1_miim &rgmiim1_bus2 &rgmiim1_bus4 &clkm1_out_ethernet>;


   tx_delay = <0x2a>;
   rx_delay = <0x1a>;

   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;
   };

};
```

<!-- source: EN PDF p64; unit 288 -->

#### 3.14.4   RGMII Crystal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: EN PDF p64; unit 289 -->

gmac m0

<!-- source: EN PDF p64; unit 290 -->

```text
&gmac {
+  phy-mode = "rgmii";
+  clock_in_out = "input";


   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  assigned-clocks = <&cru CLK_GMAC_RGMII_M0>, <&cru CLK_GMAC_SRC_M0>, <&cru CLK_GMAC_SRC>,
<&cru CLK_GMAC_TX_RX>;
+  assigned-clock-parents = <&gmac_clkin_m0>, <&cru CLK_GMAC_RGMII_M0>, <&cru
CLK_GMAC_SRC_M0>, <&cru RGMII_MODE_CLK>;


+  pinctrl-names = "default";
+  pinctrl-0 = <&rgmiim0_miim &rgmiim0_bus2 &rgmiim0_bus4>;

   tx_delay = <0x2a>;
   rx_delay = <0x1a>;

   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {

      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;
   };
};
```

<!-- source: EN PDF p65; unit 291 -->

<!-- source: EN PDF p65; unit 292 -->

gmac m1

<!-- source: EN PDF p65; unit 293 -->

```text
&gmac {
+  phy-mode = "rgmii";

+  clock_in_out = "input";

   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>, <&cru
CLK_GMAC_ETHERNET_OUT>;
+  assigned-clock-parents = <&cru CLK_GMAC_SRC_M1>, <&cru RGMII_MODE_CLK>;
+  assigned-clock-rates = <125000000>, <0>, <25000000>;


+  pinctrl-names = "default";
+  pinctrl-0 = <&rgmiim1_miim &rgmiim1_bus2 &rgmiim1_bus4>;

   tx_delay = <0x2a>;
   rx_delay = <0x1a>;

   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";

      reg = <0x0>;
   };
};
```

<!-- source: EN PDF p66; unit 294 -->

#### 3.14.5   RV1126 RMII Clock Output

<!-- source: EN PDF p66; unit 295 -->

gmac m0

<!-- source: EN PDF p66; unit 296 -->

```text
&gmac {
+  phy-mode = "rmii";
+  clock_in_out = "output";


   snps,reset-gpio = <&gpio3 RK_PC5 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   snps,reset-delays-us = <0 50000 50000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC_M0>, <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+  assigned-clock-rates = <0>, <50000000>;
+  assigned-clock-parents = <&cru CLK_GMAC_RGMII_M0>, <&cru CLK_GMAC_SRC_M0>, <&cru
RMII_MODE_CLK>;

+  pinctrl-names = "default";
+  pinctrl-0 = <&rmiim0_miim &rgmiim0_rxer &rmiim0_bus2 &rgmiim0_mclkinout>;


   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;
   };
};
```

<!-- source: EN PDF p66; unit 297 -->

gmac m1

<!-- source: EN PDF p66; unit 298 -->

```text
&gmac {
+  phy-mode = "rmii";
+  clock_in_out = "output";


   snps,reset-gpio = <&gpio3 RK_PC5 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   snps,reset-delays-us = <0 50000 50000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC_M1>, <&cru CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+  assigned-clock-rates = <0>, <50000000>;
+  assigned-clock-parents = <&cru CLK_GMAC_RGMII_M1>, <&cru CLK_GMAC_SRC_M1>, <&cru
RMII_MODE_CLK>;

+  pinctrl-names = "default";
+  pinctrl-0 = <&rmiim1_miim &rgmiim1_rxer &rmiim10_bus2 &rgmiim1_mclkinout>;


   phy-handle = <&phy>;
   status = "okay";
};

&mdio {

   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;
   };
};
```

<!-- source: EN PDF p67; unit 299 -->

<!-- source: EN PDF p67; unit 300 -->

#### 3.14.6   RV1126 RMII Clock Input

<!-- source: EN PDF p67; unit 301 -->

gmac m0

<!-- source: EN PDF p67; unit 302 -->

```text
+&gmac_clkin_m0 {
+  clock-frequency = <50000000>;

+};

&gmac {
+  phy-mode = "rmii";
+  clock_in_out = "input";

   snps,reset-gpio = <&gpio3 RK_PC5 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   snps,reset-delays-us = <0 50000 50000>;

+  assigned-clocks = <&cru CLK_GMAC_RGMII_M0>, <&cru CLK_GMAC_SRC_M0>, <&cru CLK_GMAC_SRC>,
<&cru CLK_GMAC_TX_RX>;
+  assigned-clock-rates = <0>, <0>, <50000000>;

+  assigned-clock-parents = <&gmac_clkin_m0>,<&cru CLK_GMAC_RGMII_M0>, <&cru
CLK_GMAC_SRC_M0>, <&cru RMII_MODE_CLK>;

+  pinctrl-names = "default";
+  pinctrl-0 = <&rmiim0_miim &rgmiim0_rxer &rmiim0_bus2 &rgmiim0_mclkinout_level0>;

   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {

      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;
   };
};
```

<!-- source: EN PDF p67; unit 303 -->

gmac m1

<!-- source: EN PDF p67; unit 304 -->

```text
+&gmac_clkin_m1 {
+  clock-frequency = <50000000>;

+};
&gmac {
+  phy-mode = "rmii";

+  clock_in_out = "input";

   snps,reset-gpio = <&gpio3 RK_PC5 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   snps,reset-delays-us = <0 50000 50000>;

+  assigned-clocks = <&cru CLK_GMAC_RGMII_M1>, <&cru CLK_GMAC_SRC_M1>, <&cru CLK_GMAC_SRC>,
<&cru CLK_GMAC_TX_RX>;
+  assigned-clock-rates = <0>, <0>, <50000000>;
+  assigned-clock-parents = <&gmac_clkin_m1>,<&cru CLK_GMAC_RGMII_M1>, <&cru
CLK_GMAC_SRC_M1>, <&cru RMII_MODE_CLK>;


+  pinctrl-names = "default";
+  pinctrl-0 = <&rmiim1_miim &rgmiim1_rxer &rmiim1_bus2 &rgmiim1_mclkinout_level0>;

   phy-handle = <&phy>;
   status = "okay";
};

&mdio {
   phy: phy@0 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x0>;
   };
};
```

<!-- source: EN PDF p68; unit 305 -->

{% endraw %}
