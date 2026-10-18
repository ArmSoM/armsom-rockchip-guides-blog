---
title: "Rockchip GMAC 模式配置大全：RGMII、RMII、SGMII 与 QSGMII"
description: "完整收录 14 组 Rockchip 平台 GMAC 时钟、PHY 模式及 pinctrl 配置，包含 RK3576/RK3588。"
translation_key: "065-rockchip-gmac-mode-configuration"
slug: "065-rockchip-gmac-mode-configuration"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["Rockchip", "GMAC", "Ethernet", "Linux"]
keywords: "ArmSoM Rockchip GMAC Ethernet RGMII RMII PHY"
excerpt: "完整收录 14 组 Rockchip 平台 GMAC 时钟、PHY 模式及 pinctrl 配置，包含 RK3576/RK3588。"
---

{% raw %}

# Rockchip GMAC 模式配置大全：RGMII、RMII、SGMII 与 QSGMII

## ArmSoM 适用说明

本文是 Rockchip 平台参考，不是 ArmSoM 实测报告。必须结合具体板卡的以太网接口引出、PHY、供电、复位、IOMUX、参考时钟和目标 SDK/BSP 进行适配；不能推断所有 ArmSoM 板卡均支持。尚未进行硬件验证。原厂日志、吞吐量和延时均为原文示例，不是 ArmSoM 测试结果。

中英文均 V1.4.0，分别 65/68 页，正文包含 14 组平台：PX30、RK1808、RK3128、RK3228、RK3288、RK3328、RK3368、RK3399、RK3528、RK3562、RK3568、RK3588/RK3576、RV1108、RV1126。原产品表写“所有版本”，仅是原稿概括，不表示任意 BSP/板卡均可直接使用示例。技术变更保留：V1.1.0 加入 RK3588，V1.2.0 加入 RK3528，V1.3.0 加入 RK3562，V1.4.0 加入 RK3576（参考 RK3588 配置）。中文按中文，英文/俄文按英文；全部 6 张图分别采用对应语言原 PDF 的独立原图。

> 同版本差异已保留：§3.4.5 phy-mode 中文为 rmii、英文为 RMII；§3.10.4 英文两个 PHY 子节点闭合处缺分号；§3.10.5 gmac0m0 最后引脚组中文为 rgmiim1_rgmii_bus、英文为 rgmiim0_rgmii_bus。不能把这些示例视为已验证的可直接编译配置。DTS 中的 + 是原文修改标记，使用前必须依目标 BSP 审核，未自动改技术值。

[校对记录](/docs/rockchip-gmac-mode-configuration/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)

## 原文产品范围

| 芯片 | 内核版本 |
| --- | --- |
| Rockchip | 所有版本（原文概括，具体取决于 BSP） |

<!-- source: CN PDF p5; unit 0 -->

RGMII/RMII 主要模式连接图罗列如下：

<!-- source: CN PDF p5; unit 1 -->

## 1.   RGMII 模式

<!-- source: CN PDF p5; unit 2 -->

一般使用主控 PLL 输出 时钟 output 方式，PHY 提供的 125M 时钟作为 input 方式为备选方案。

<!-- source: CN PDF p5; unit 3 -->

### 1.1   PLL output 125M for TX_CLK, Crystal 25M for PHY

<!-- source: CN PDF p5; unit 4 -->

主控 PLL 提供 TXCLK 所需时钟，PHY 25M 时钟由晶振提供。

<!-- source: CN PDF p5; unit 5 -->

![原始模式连接图, CN p5](/docs/rockchip-gmac-mode-configuration/assets/cn-p5-X112.png)

*原始模式连接图: CN PDF p5.*

<!-- source: CN PDF p5; unit 6 -->

### 1.2   PLL output 125M for TX_CLK, PLL 25M for PHY

<!-- source: CN PDF p5; unit 7 -->

主控 PLL 提供 TXCLK 所需时钟，PHY 25M 时钟由主控提供。

<!-- source: CN PDF p6; unit 8 -->

![原始模式连接图, CN p6](/docs/rockchip-gmac-mode-configuration/assets/cn-p6-X119.png)

*原始模式连接图: CN PDF p6.*

<!-- source: CN PDF p6; unit 9 -->

### 1.3   125M TX_CLK input  from PHY, PLL 25M for PHY

<!-- source: CN PDF p6; unit 10 -->

TXCLK 所需时钟由 PHY 提供，PHY 25M 时钟由主控提供。

<!-- source: CN PDF p7; unit 11 -->

![原始模式连接图, CN p7](/docs/rockchip-gmac-mode-configuration/assets/cn-p7-X123.png)

*原始模式连接图: CN PDF p7.*

<!-- source: CN PDF p7; unit 12 -->

### 1.4   125M TX_CLK input  from PHY, Crystal 25M for PHY

<!-- source: CN PDF p7; unit 13 -->

TXCLK 所需时钟由 PHY 提供，PHY 25M 时钟由晶振提供。

<!-- source: CN PDF p8; unit 14 -->

![原始模式连接图, CN p8](/docs/rockchip-gmac-mode-configuration/assets/cn-p8-X127.png)

*原始模式连接图: CN PDF p8.*

<!-- source: CN PDF p8; unit 15 -->

## 2.   RMII 模式

<!-- source: CN PDF p8; unit 16 -->

### 2.1   RMII Clock Output

<!-- source: CN PDF p8; unit 17 -->

主控提供 RMII 所需时钟

<!-- source: CN PDF p9; unit 18 -->

![原始模式连接图, CN p9](/docs/rockchip-gmac-mode-configuration/assets/cn-p9-X132.png)

*原始模式连接图: CN PDF p9.*

<!-- source: CN PDF p9; unit 19 -->

### 2.2   RMII Clock Input

<!-- source: CN PDF p9; unit 20 -->

PHY 提供 RMII 所需时钟

<!-- source: CN PDF p10; unit 21 -->

![原始模式连接图, CN p10](/docs/rockchip-gmac-mode-configuration/assets/cn-p10-X136.png)

*原始模式连接图: CN PDF p10.*

<!-- source: CN PDF p10; unit 22 -->

同样，RMII 模式下，晶振也可以由主控输出 25M 替代。

<!-- source: CN PDF p10; unit 23 -->

## 3.   模式配置

<!-- source: CN PDF p10; unit 24 -->

不同模式下的配置主要包含了 phy mode，clock 和 pinctrl 的配置，这些配置都是关联的，需要同时配置，否则无法工作。以下是各芯片不同模式下，以 SDK 板级 DTS 为例的不同配置方式的参考，关注 dts 中 gmac 节点里 '+'部分的修改。

<!-- source: CN PDF p10; unit 25 -->

### 3.1   PX30

<!-- source: CN PDF p10; unit 26 -->

#### 3.1.1   RMII Clock Output

<!-- source: CN PDF p10; unit 27 -->

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

<!-- source: CN PDF p11; unit 28 -->

<!-- source: CN PDF p11; unit 29 -->

#### 3.1.2   RMII Clock Input

<!-- source: CN PDF p11; unit 30 -->

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

<!-- source: CN PDF p11; unit 31 -->

### 3.2   RK1808

<!-- source: CN PDF p11; unit 32 -->

#### 3.2.1   RMII Clock Output：

<!-- source: CN PDF p11; unit 33 -->

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

<!-- source: CN PDF p12; unit 34 -->

#### 3.2.2   RMII Clock Input

<!-- source: CN PDF p12; unit 35 -->

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

<!-- source: CN PDF p12; unit 36 -->

#### 3.2.3   RGMII Clock Output

<!-- source: CN PDF p12; unit 37 -->

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

<!-- source: CN PDF p13; unit 38 -->

#### 3.2.4   RGMII Clock Input

<!-- source: CN PDF p13; unit 39 -->

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

<!-- source: CN PDF p13; unit 40 -->

### 3.3   RK3128

<!-- source: CN PDF p13; unit 41 -->

#### 3.3.1   RMII Clock Output

<!-- source: CN PDF p13; unit 42 -->

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

<!-- source: CN PDF p13; unit 43 -->

#### 3.3.2   RMII Clock Input

<!-- source: CN PDF p13; unit 44 -->

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

<!-- source: CN PDF p14; unit 45 -->

<!-- source: CN PDF p14; unit 46 -->

#### 3.3.3   RGMII Clock Input

<!-- source: CN PDF p14; unit 47 -->

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

<!-- source: CN PDF p14; unit 48 -->

### 3.4   RK3228

<!-- source: CN PDF p14; unit 49 -->

#### 3.4.1   RMII Clock Output

<!-- source: CN PDF p14; unit 50 -->

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

<!-- source: CN PDF p15; unit 51 -->

#### 3.4.2   RMII Clock Input

<!-- source: CN PDF p15; unit 52 -->

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

<!-- source: CN PDF p15; unit 53 -->

#### 3.4.3   RGMII Clock Output

<!-- source: CN PDF p15; unit 54 -->

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

<!-- source: CN PDF p15; unit 55 -->

#### 3.4.4   RGMII Clock Input

<!-- source: CN PDF p15; unit 56 -->

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

<!-- source: CN PDF p16; unit 57 -->

<!-- source: CN PDF p16; unit 58 -->

#### 3.4.5   Internal EPHY

<!-- source: CN PDF p16; unit 59 -->

```text
&gmac {
+     assigned-clocks = <&cru SCLK_MAC_SRC>;

+     assigned-clock-rates = <50000000>;
+     clock_in_out = "output";
      phy-supply = <&vcc_phy>;
+     phy-mode = "rmii";
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

<!-- source: CN PDF p16; unit 60 -->

### 3.5   RK3288

<!-- source: CN PDF p16; unit 61 -->

#### 3.5.1   RMII  Clock Output

<!-- source: CN PDF p16; unit 62 -->

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

<!-- source: CN PDF p17; unit 63 -->

<!-- source: CN PDF p17; unit 64 -->

#### 3.5.2   RMII Clock Input

<!-- source: CN PDF p17; unit 65 -->

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

<!-- source: CN PDF p17; unit 66 -->

#### 3.5.3   RGMII Clock Input

<!-- source: CN PDF p17; unit 67 -->

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

<!-- source: CN PDF p17; unit 68 -->

### 3.6   RK3328

<!-- source: CN PDF p17; unit 69 -->

#### 3.6.1   RMII Clock Output

<!-- source: CN PDF p17; unit 70 -->

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

<!-- source: CN PDF p18; unit 71 -->

<!-- source: CN PDF p18; unit 72 -->

#### 3.6.2   RMII Clock Input

<!-- source: CN PDF p18; unit 73 -->

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

<!-- source: CN PDF p18; unit 74 -->

#### 3.6.3   RGMII Clock Input

<!-- source: CN PDF p18; unit 75 -->

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

<!-- source: CN PDF p19; unit 76 -->

#### 3.6.4   Internal EPHY

<!-- source: CN PDF p19; unit 77 -->

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

<!-- source: CN PDF p19; unit 78 -->

### 3.7   RK3368

<!-- source: CN PDF p19; unit 79 -->

#### 3.7.1   RMII Clock Output

<!-- source: CN PDF p19; unit 80 -->

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

<!-- source: CN PDF p19; unit 81 -->

#### 3.7.2   RMII Clock Input

<!-- source: CN PDF p19; unit 82 -->

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

<!-- source: CN PDF p20; unit 83 -->

<!-- source: CN PDF p20; unit 84 -->

#### 3.7.3   RGMII Clock Input

<!-- source: CN PDF p20; unit 85 -->

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

<!-- source: CN PDF p20; unit 86 -->

### 3.8   RK3399

<!-- source: CN PDF p20; unit 87 -->

#### 3.8.1   RMII Clock Output

<!-- source: CN PDF p20; unit 88 -->

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

<!-- source: CN PDF p20; unit 89 -->

#### 3.8.2   RMII Clock Input

<!-- source: CN PDF p20; unit 90 -->

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

<!-- source: CN PDF p21; unit 91 -->

<!-- source: CN PDF p21; unit 92 -->

#### 3.8.3   RGMII Clock Input

<!-- source: CN PDF p21; unit 93 -->

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

<!-- source: CN PDF p21; unit 94 -->

### 3.9   RK3528

<!-- source: CN PDF p21; unit 95 -->

#### 3.9.1   GMAC1 RMII Clock 50M Output,  PLL 25M Output

<!-- source: CN PDF p21; unit 96 -->

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

<!-- source: CN PDF p22; unit 97 -->

<!-- source: CN PDF p22; unit 98 -->

#### 3.9.2   GMAC1 RMII Clock 50M Input, PLL 25M Output

<!-- source: CN PDF p22; unit 99 -->

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

<!-- source: CN PDF p22; unit 100 -->

#### 3.9.3   GMAC1 RGMII PLL output 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p22; unit 101 -->

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

<!-- source: CN PDF p23; unit 102 -->

<!-- source: CN PDF p23; unit 103 -->

#### 3.9.4   GMAC1 RGMII Crystal 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p23; unit 104 -->

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

<!-- source: CN PDF p24; unit 105 -->

#### 3.9.5   GMAC1 RGMII  PLL output 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: CN PDF p24; unit 107 -->

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

<!-- source: CN PDF p24; unit 108 -->

#### 3.9.6   GMAC1 RGMII  Crystal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: CN PDF p24; unit 110 -->

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

<!-- source: CN PDF p25; unit 111 -->

<!-- source: CN PDF p25; unit 112 -->

#### 3.9.7   GMAC0 & FEPHY

<!-- source: CN PDF p25; unit 113 -->

GMAC0 与内部 FEPHY 相连，是固定的 RMII，没有模式可以配置；但可以根据硬件原理图配置 PHY led功能，有 3 个功能 IO 可配置，配置对应 IO  的 iomux 即可，默认配置如下：

<!-- source: CN PDF p25; unit 114 -->

```text
&rmii0_phy {
   pinctrl-names = "default";
   pinctrl-0 = <&fephym0_led_link &fephym0_led_spd>;

};
```

<!-- source: CN PDF p25; unit 115 -->

### 3.10   RK3562

<!-- source: CN PDF p25; unit 116 -->

#### 3.10.1   RMII Clock Output

<!-- source: CN PDF p25; unit 117 -->

gmac0m0

<!-- source: CN PDF p25; unit 118 -->

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

<!-- source: CN PDF p26; unit 119 -->

<!-- source: CN PDF p26; unit 120 -->

gmac0m1:

<!-- source: CN PDF p26; unit 121 -->

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

<!-- source: CN PDF p26; unit 122 -->

gmac1(MAC100):

<!-- source: CN PDF p26; unit 123 -->

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

<!-- source: CN PDF p27; unit 124 -->

<!-- source: CN PDF p27; unit 125 -->

#### 3.10.2   RMII Clock Input, PLL out 25M for PHY

<!-- source: CN PDF p27; unit 126 -->

gmac0m0

<!-- source: CN PDF p27; unit 127 -->

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

<!-- source: CN PDF p27; unit 128 -->

gmac0m1:

<!-- source: CN PDF p27; unit 129 -->

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

<!-- source: CN PDF p28; unit 130 -->

<!-- source: CN PDF p28; unit 131 -->

gmac1(MAC100):

<!-- source: CN PDF p28; unit 132 -->

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

<!-- source: CN PDF p29; unit 133 -->

<!-- source: CN PDF p29; unit 134 -->

#### 3.10.3   RGMII PLL output 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p29; unit 135 -->

gmac0m0

<!-- source: CN PDF p29; unit 136 -->

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

<!-- source: CN PDF p29; unit 137 -->

gmac0m1

<!-- source: CN PDF p29; unit 138 -->

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

<!-- source: CN PDF p30; unit 139 -->

<!-- source: CN PDF p30; unit 140 -->

#### 3.10.4   RGMII PLL output 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: CN PDF p30; unit 141 -->

gmac0m0

<!-- source: CN PDF p30; unit 142 -->

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
   };
};
```

<!-- source: CN PDF p31; unit 143 -->

<!-- source: CN PDF p31; unit 144 -->

gmac0m1

<!-- source: CN PDF p31; unit 145 -->

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
   };
};
```

<!-- source: CN PDF p32; unit 146 -->

#### 3.10.5   RGMII Crystal 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p32; unit 147 -->

gmac0m0

<!-- source: CN PDF p32; unit 148 -->

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

<!-- source: CN PDF p32; unit 149 -->

gmac0m1

<!-- source: CN PDF p32; unit 150 -->

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

<!-- source: CN PDF p33; unit 151 -->

<!-- source: CN PDF p33; unit 152 -->

#### 3.10.6   RGMII Crystal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: CN PDF p33; unit 153 -->

gmac0m0

<!-- source: CN PDF p33; unit 154 -->

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

<!-- source: CN PDF p33; unit 155 -->

gmac0m1

<!-- source: CN PDF p33; unit 156 -->

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

<!-- source: CN PDF p34; unit 157 -->

<!-- source: CN PDF p34; unit 158 -->

### 3.11   RK3568

<!-- source: CN PDF p34; unit 159 -->

#### 3.11.1   RMII Clock Output

<!-- source: CN PDF p34; unit 160 -->

gmac0

<!-- source: CN PDF p34; unit 161 -->

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

<!-- source: CN PDF p35; unit 162 -->

<!-- source: CN PDF p35; unit 163 -->

gmac1m0:

<!-- source: CN PDF p35; unit 164 -->

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
+     pinctrl-0 = <&gmac1m0_miim &gmac1m0_clkinout &gmac1m0_rx_bus2
&gmac1m0_tx_bus2>;

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

<!-- source: CN PDF p35; unit 165 -->

gmac1m1:

<!-- source: CN PDF p35; unit 166 -->

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
+     pinctrl-0 = <&gmac1m1_miim &gmac1m1_clkinout &gmac1m1_rx_bus2
&gmac1m1_tx_bus2>;
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

<!-- source: CN PDF p36; unit 167 -->

<!-- source: CN PDF p36; unit 168 -->

#### 3.11.2   RMII Clock Input

<!-- source: CN PDF p36; unit 169 -->

gmac0

<!-- source: CN PDF p36; unit 170 -->

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

<!-- source: CN PDF p36; unit 171 -->

gmac1m0:

<!-- source: CN PDF p36; unit 172 -->

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
+     pinctrl-0 = <&gmac1m0_miim &gmac1m0_clkinout &gmac1m0_rx_bus2
&gmac1m0_tx_bus2>;

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

<!-- source: CN PDF p37; unit 173 -->

<!-- source: CN PDF p37; unit 174 -->

gmac1m1:

<!-- source: CN PDF p37; unit 175 -->

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

+     pinctrl-0 = <&gmac1m1_miim &gmac1m1_clkinout &gmac1m1_rx_bus2
&gmac1m1_tx_bus2>;

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

<!-- source: CN PDF p38; unit 176 -->

#### 3.11.3   RGMII PLL output 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p38; unit 177 -->

gmac0

<!-- source: CN PDF p38; unit 178 -->

```text
&gmac0 {
+     phy-mode = "rgmii";
+     clock_in_out = "output";

+     assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>, <&cru
CLK_MAC0_OUT>;
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

<!-- source: CN PDF p38; unit 179 -->

gmac1m0

<!-- source: CN PDF p38; unit 180 -->

```text
&gmac1 {
+     phy-mode = "rgmii";
+     clock_in_out = "output";


      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>, <&cru
CLK_MAC1_OUT>;
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

<!-- source: CN PDF p39; unit 181 -->

<!-- source: CN PDF p39; unit 182 -->

gmac1m1

<!-- source: CN PDF p39; unit 183 -->

```text
&gmac1 {
+     phy-mode = "rgmii";

+     clock_in_out = "output";

      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>, <&cru
CLK_MAC1_OUT>;
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

<!-- source: CN PDF p40; unit 184 -->

<!-- source: CN PDF p40; unit 185 -->

#### 3.11.4   RGMII PLL output 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: CN PDF p40; unit 186 -->

gmac0

<!-- source: CN PDF p40; unit 187 -->

```text
&gmac0 {
+     phy-mode = "rgmii";
+     clock_in_out = "input";

+     assigned-clocks = <&cru SCLK_GMAC0_RX_TX>, <&cru SCLK_GMAC0>, <&cru
CLK_MAC0_OUT>;
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

<!-- source: CN PDF p40; unit 188 -->

gmac1m0

<!-- source: CN PDF p40; unit 189 -->

```text
&gmac1 {
+     phy-mode = "rgmii";
+     clock_in_out = "input";
      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;

      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>, <&cru
CLK_MAC1_OUT>;
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

<!-- source: CN PDF p41; unit 190 -->

<!-- source: CN PDF p41; unit 191 -->

gmac1m1

<!-- source: CN PDF p41; unit 192 -->

```text
&gmac1 {
+     phy-mode = "rgmii";

+     clock_in_out = "input";

      snps,reset-gpio = <&gpio2 RK_PD1 GPIO_ACTIVE_LOW>;
      snps,reset-active-low;
      /* Reset time is 20ms, 100ms for rtl8211f */
      snps,reset-delays-us = <0 20000 100000>;

+     assigned-clocks = <&cru SCLK_GMAC1_RX_TX>, <&cru SCLK_GMAC1>, <&cru
CLK_MAC1_OUT>;
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

<!-- source: CN PDF p42; unit 193 -->

<!-- source: CN PDF p42; unit 194 -->

#### 3.11.5   RGMII Crystal 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p42; unit 195 -->

gmac0

<!-- source: CN PDF p42; unit 196 -->

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

<!-- source: CN PDF p43; unit 197 -->

<!-- source: CN PDF p43; unit 198 -->

gmac1m0

<!-- source: CN PDF p43; unit 199 -->

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

<!-- source: CN PDF p43; unit 200 -->

gmac1m1

<!-- source: CN PDF p43; unit 201 -->

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

<!-- source: CN PDF p44; unit 202 -->

<!-- source: CN PDF p44; unit 203 -->

#### 3.11.6   RGMII Crystal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: CN PDF p44; unit 204 -->

gmac0

<!-- source: CN PDF p44; unit 205 -->

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

<!-- source: CN PDF p45; unit 206 -->

<!-- source: CN PDF p45; unit 207 -->

gmac1m0

<!-- source: CN PDF p45; unit 208 -->

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

<!-- source: CN PDF p45; unit 209 -->

gmac1m1

<!-- source: CN PDF p45; unit 210 -->

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

<!-- source: CN PDF p46; unit 211 -->

<!-- source: CN PDF p46; unit 212 -->

#### 3.11.7   SGMII

<!-- source: CN PDF p46; unit 213 -->

DTS 除了配置 gmac 和 mac phy 节点外，还需要配置 xpcs 和 combophy 节点。

<!-- source: CN PDF p46; unit 214 -->

combophy

<!-- source: CN PDF p46; unit 215 -->

其中属性  rockchip,sgmii-mac-sel  表示使用的是哪个 gmac：

<!-- source: CN PDF p46; unit 216 -->

```text
&combphy1_usq {
+     rockchip,sgmii-mac-sel = <0>; /* Use gmac0 for sgmii */

      status = "okay";
};
```

<!-- source: CN PDF p46; unit 217 -->

xpcs

<!-- source: CN PDF p46; unit 218 -->

```text
&xpcs {
      status = "okay";
};
```

<!-- source: CN PDF p46; unit 219 -->

gmac0

<!-- source: CN PDF p46; unit 220 -->

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

<!-- source: CN PDF p47; unit 221 -->

<!-- source: CN PDF p47; unit 222 -->

gmac1

<!-- source: CN PDF p47; unit 223 -->

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

<!-- source: CN PDF p48; unit 224 -->

#### 3.11.8   QSGMII

<!-- source: CN PDF p48; unit 225 -->

同 SGMIIl 类似，DTS 除了配置 gmac 和 mac phy 节点外，还需要配置 xpcs 和 combophy 节点。

<!-- source: CN PDF p48; unit 226 -->

combophy

<!-- source: CN PDF p48; unit 227 -->

```text
&combphy2_psq {
   status = "okay";
};
```

<!-- source: CN PDF p48; unit 228 -->

xpcs

<!-- source: CN PDF p48; unit 229 -->

```text
&xpcs {
   status = "okay";
};
```

<!-- source: CN PDF p48; unit 230 -->

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

<!-- source: CN PDF p49; unit 231 -->

<!-- source: CN PDF p49; unit 232 -->

### 3.12   RK3588/RK3576

<!-- source: CN PDF p49; unit 233 -->

#### 3.12.1   RMII Clock Output

<!-- source: CN PDF p49; unit 234 -->

gmac0

<!-- source: CN PDF p49; unit 235 -->

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

<!-- source: CN PDF p49; unit 236 -->

gmac1:

<!-- source: CN PDF p49; unit 237 -->

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

<!-- source: CN PDF p50; unit 238 -->

<!-- source: CN PDF p50; unit 239 -->

#### 3.12.2   RMII Clock Input

<!-- source: CN PDF p50; unit 240 -->

gmac0

<!-- source: CN PDF p50; unit 241 -->

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

<!-- source: CN PDF p51; unit 242 -->

<!-- source: CN PDF p51; unit 243 -->

gmac1:

<!-- source: CN PDF p51; unit 244 -->

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

<!-- source: CN PDF p51; unit 245 -->

#### 3.12.3   RGMII PLL output 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p51; unit 246 -->

gmac0

<!-- source: CN PDF p51; unit 247 -->

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
+        &gmac0_tx_bus2
+        &gmac0_rx_bus2
+        &gmac0_rgmii_clk

+        &gmac0_rgmii_bus
+        &eth0_pins>;

   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy0>;

   status = "okay";
};

&mdio0 {
   rgmii_phy0: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
+     clocks = <&cru REFCLKO25M_ETH0_OUT>;
   };
};
```

<!-- source: CN PDF p52; unit 248 -->

<!-- source: CN PDF p52; unit 249 -->

gmac1

<!-- source: CN PDF p52; unit 250 -->

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
+        &gmac1_tx_bus2
+        &gmac1_rx_bus2
+        &gmac1_rgmii_clk

+        &gmac1_rgmii_bus
+        &eth1_pins>;

   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy1>;
   status = "okay";
};

&mdio1 {
   rgmii_phy1: phy@1 {

      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
+     clocks = <&cru REFCLKO25M_ETH0_OUT>;
   };
};
```

<!-- source: CN PDF p53; unit 251 -->

#### 3.12.4   RGMII PLL output 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: CN PDF p53; unit 252 -->

gmac0

<!-- source: CN PDF p53; unit 253 -->

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
+        &gmac0_tx_bus2
+        &gmac0_rx_bus2
+        &gmac0_rgmii_clk
+        &gmac0_rgmii_bus

+        &gmac0_clkinout
+        &eth0_pins>;

   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy0>;
   status = "okay";
};

&mdio0 {
   rgmii_phy0: phy@1 {

      compatible = "ethernet-phy-ieee802.3-c22";
      reg = <0x1>;
+     clocks = <&cru REFCLKO25M_ETH0_OUT>;
   };
};
```

<!-- source: CN PDF p53; unit 254 -->

gmac1

<!-- source: CN PDF p53; unit 255 -->

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
+        &gmac1_tx_bus2
+        &gmac1_rx_bus2
+        &gmac1_rgmii_clk
+        &gmac1_rgmii_bus
+        &gmac1_clkinout

+        &eth1_pins>;

   tx_delay = <0x45>;
   /* rx_delay = <0x43>; */

   phy-handle = <&rgmii_phy1>;
   status = "okay";
};

&mdio1 {
   rgmii_phy1: phy@1 {
      compatible = "ethernet-phy-ieee802.3-c22";

      reg = <0x1>;
+     clocks = <&cru REFCLKO25M_ETH0_OUT>;
   };
};
```

<!-- source: CN PDF p54; unit 256 -->

<!-- source: CN PDF p54; unit 257 -->

#### 3.12.5   RGMII Crystal 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p54; unit 258 -->

gmac0

<!-- source: CN PDF p54; unit 259 -->

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
+        &gmac0_tx_bus2
+        &gmac0_rx_bus2
+        &gmac0_rgmii_clk

+        &gmac0_rgmii_bus>;

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

<!-- source: CN PDF p55; unit 260 -->

<!-- source: CN PDF p55; unit 261 -->

gmac1

<!-- source: CN PDF p55; unit 262 -->

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
+        &gmac1_tx_bus2
+        &gmac1_rx_bus2
+        &gmac1_rgmii_clk
+        &gmac1_rgmii_bus>;


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

<!-- source: CN PDF p55; unit 263 -->

#### 3.12.6   RGMII Crystal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: CN PDF p55; unit 264 -->

gmac0

<!-- source: CN PDF p55; unit 265 -->

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
+        &gmac0_tx_bus2
+        &gmac0_rx_bus2
+        &gmac0_rgmii_clk
+        &gmac0_rgmii_bus
+        &gmac0_clkinout>;


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

<!-- source: CN PDF p56; unit 266 -->

<!-- source: CN PDF p56; unit 267 -->

gmac1

<!-- source: CN PDF p56; unit 268 -->

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
+        &gmac1_tx_bus2
+        &gmac1_rx_bus2
+        &gmac1_rgmii_clk

+        &gmac1_rgmii_bus
+        &gmac1_clkinout>;

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

<!-- source: CN PDF p57; unit 269 -->

### 3.13   RV1108

<!-- source: CN PDF p57; unit 270 -->

#### 3.13.1   RMII Clock Input

<!-- source: CN PDF p57; unit 271 -->

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

<!-- source: CN PDF p57; unit 272 -->

#### 3.13.2   RMII Clock Output

<!-- source: CN PDF p57; unit 273 -->

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

<!-- source: CN PDF p57; unit 274 -->

### 3.14   RV1126

<!-- source: CN PDF p57; unit 275 -->

#### 3.14.1   RGMII PLL output 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p57; unit 276 -->

gmac m0

<!-- source: CN PDF p57; unit 277 -->

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

<!-- source: CN PDF p58; unit 278 -->

<!-- source: CN PDF p58; unit 279 -->

gmac m1

<!-- source: CN PDF p58; unit 280 -->

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

<!-- source: CN PDF p59; unit 281 -->

<!-- source: CN PDF p59; unit 282 -->

#### 3.14.2   RGMII PLL output 25M for PHY, RGMII Clock input 125M for TX_CLK

<!-- source: CN PDF p59; unit 283 -->

gmac m0

<!-- source: CN PDF p59; unit 284 -->

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

<!-- source: CN PDF p59; unit 285 -->

gmac m1

<!-- source: CN PDF p59; unit 286 -->

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

<!-- source: CN PDF p60; unit 287 -->

<!-- source: CN PDF p60; unit 288 -->

#### 3.14.3   RGMII Crytal 25M for PHY, PLL output 125M for TX_CLK

<!-- source: CN PDF p60; unit 289 -->

gmac m0

<!-- source: CN PDF p60; unit 290 -->

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

<!-- source: CN PDF p61; unit 291 -->

<!-- source: CN PDF p61; unit 292 -->

gmac m1

<!-- source: CN PDF p61; unit 293 -->

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

<!-- source: CN PDF p61; unit 294 -->

#### 3.14.4   RGMII Crytal 25M for PHY, RGMII_CLK input 125M for TX_CLK

<!-- source: CN PDF p61; unit 295 -->

gmac m0

<!-- source: CN PDF p61; unit 296 -->

```text
&gmac {
+  phy-mode = "rgmii";
+  clock_in_out = "input";


   snps,reset-gpio = <&gpio3 RK_PA0 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   /* Reset time is 20ms, 100ms for rtl8211f */
   snps,reset-delays-us = <0 20000 100000>;

+  assigned-clocks = <&cru CLK_GMAC_RGMII_M0>, <&cru CLK_GMAC_SRC_M0>, <&cru
CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
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

<!-- source: CN PDF p62; unit 297 -->

<!-- source: CN PDF p62; unit 298 -->

gmac m1

<!-- source: CN PDF p62; unit 299 -->

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

<!-- source: CN PDF p63; unit 300 -->

#### 3.14.5   RMII Clock Output

<!-- source: CN PDF p63; unit 301 -->

gmac m0

<!-- source: CN PDF p63; unit 302 -->

```text
&gmac {
+  phy-mode = "rmii";
+  clock_in_out = "output";


   snps,reset-gpio = <&gpio3 RK_PC5 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   snps,reset-delays-us = <0 50000 50000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC_M0>, <&cru CLK_GMAC_SRC>, <&cru
CLK_GMAC_TX_RX>;
+  assigned-clock-rates = <0>, <50000000>;
+  assigned-clock-parents = <&cru CLK_GMAC_RGMII_M0>, <&cru CLK_GMAC_SRC_M0>,
<&cru RMII_MODE_CLK>;

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

<!-- source: CN PDF p63; unit 303 -->

gmac m1

<!-- source: CN PDF p63; unit 304 -->

```text
&gmac {
+  phy-mode = "rmii";
+  clock_in_out = "output";


   snps,reset-gpio = <&gpio3 RK_PC5 GPIO_ACTIVE_LOW>;
   snps,reset-active-low;
   snps,reset-delays-us = <0 50000 50000>;

+  assigned-clocks = <&cru CLK_GMAC_SRC_M1>, <&cru CLK_GMAC_SRC>, <&cru
CLK_GMAC_TX_RX>;
+  assigned-clock-rates = <0>, <50000000>;
+  assigned-clock-parents = <&cru CLK_GMAC_RGMII_M1>, <&cru CLK_GMAC_SRC_M1>,
<&cru RMII_MODE_CLK>;

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

<!-- source: CN PDF p64; unit 305 -->

<!-- source: CN PDF p64; unit 306 -->

#### 3.14.6   RMII Clock Input

<!-- source: CN PDF p64; unit 307 -->

gmac m0

<!-- source: CN PDF p64; unit 308 -->

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

+  assigned-clocks = <&cru CLK_GMAC_RGMII_M0>, <&cru CLK_GMAC_SRC_M0>, <&cru
CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+  assigned-clock-rates = <0>, <0>, <50000000>;
+  assigned-clock-parents = <&gmac_clkin_m0>,<&cru CLK_GMAC_RGMII_M0>, <&cru

CLK_GMAC_SRC_M0>, <&cru RMII_MODE_CLK>;

+  pinctrl-names = "default";
+  pinctrl-0 = <&rmiim0_miim &rgmiim0_rxer &rmiim0_bus2
&rgmiim0_mclkinout_level0>;

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

<!-- source: CN PDF p64; unit 309 -->

gmac m1

<!-- source: CN PDF p64; unit 310 -->

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

+  assigned-clocks = <&cru CLK_GMAC_RGMII_M1>, <&cru CLK_GMAC_SRC_M1>, <&cru
CLK_GMAC_SRC>, <&cru CLK_GMAC_TX_RX>;
+  assigned-clock-rates = <0>, <0>, <50000000>;
+  assigned-clock-parents = <&gmac_clkin_m1>,<&cru CLK_GMAC_RGMII_M1>, <&cru
CLK_GMAC_SRC_M1>, <&cru RMII_MODE_CLK>;

+  pinctrl-names = "default";
+  pinctrl-0 = <&rmiim1_miim &rgmiim1_rxer &rmiim1_bus2
&rgmiim1_mclkinout_level0>;


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

<!-- source: CN PDF p65; unit 311 -->

{% endraw %}
