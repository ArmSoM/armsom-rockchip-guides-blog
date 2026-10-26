---
title: "Rockchip Linux SATA 完整开发指南：DTS、U-Boot、速率限制与 FBS"
description: "Rockchip Linux SATA 完整开发指南：DTS、U-Boot、速率限制与 FBS — RK-KF-YF-148 V2.4.0, RK3566/RK3568/RK3588/RK3576."
translation_key: "104-rockchip-sata"
slug: "104-rockchip-sata"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SATA", "U-Boot", "FBS", "DTS"]
excerpt: "Rockchip Linux SATA 完整开发指南：DTS、U-Boot、速率限制与 FBS — RK-KF-YF-148 V2.4.0, RK3566/RK3568/RK3588/RK3576."
---

{% raw %}

# Rockchip Linux SATA 完整开发指南：DTS、U-Boot、速率限制与 FBS

本文完整整理 RK-KF-YF-148 V2.4.0 中英文技术正文（中文第 4–13 页、英文第 5–14 页）。适用范围按原稿为 RK356X / kernel 4.19，RK3588/RK3588S/RK356X / kernel 5.10，RK3576 / kernel 6.1；正文另列 kernel 6.1 驱动配置和多个平台 U-Boot 补丁。中文技术示例作为四语代码共同基准。用于 ArmSoM 须核对板卡实际 SATA 引出、复用 PHY、供电、PM 扩展芯片、SDK/BSP、内核及 U-Boot 分支。本篇为平台参考，未实测 ArmSoM 性能、休眠或补丁兼容性。两稿无独立技术配图，全部技术表格恢复为可编辑表格。

> 原文疑点保留：`status = <okay>;` 和 phy-names 末尾弯引号照录，不能当作已校验的可直接编译 DTS；§2 重复编号 6。PHY 共享及兼容布板说明须按具体 SoC/板卡判断，不把“二选一”扩大为整机所有控制器互斥。补丁下载链接未验证权限；关机、休眠、驱动和寄存器示例均未执行。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. 芯片资源介绍

RK3566

| 资源 | 模式 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA1 | 6G/3G/1.5G | 支持(支持5个硬盘) | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | 支持(支持5个硬盘) | PCIE、QSGMII |  |

RK3568

| 资源 | 速率 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | 支持(支持5个硬盘) | USB |  |
| SATA1 | 6G/3G/1.5G | 支持(支持5个硬盘) | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | 支持(支持5个硬盘) | PCIE、QSGMII |  |

RK3588S

| 资源 | 模式 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | 支持(支持5个硬盘) | PCIE |  |
| SATA2 | 6G/3G/1.5G | 支持(支持5个硬盘) | PCIE、USB |  |

RK3588

| 资源 | 速率 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | 支持(支持5个硬盘) | PCIE |  |
| SATA1 | 6G/3G/1.5G | 支持(支持5个硬盘) | PCIE |  |
| SATA2 | 6G/3G/1.5G | 支持(支持5个硬盘) | PCIE、USB |  |

RK3576

| 资源 | 速率 | 支持PM芯片扩展 | PHY复用 | 备注 |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | 支持(支持5个硬盘) | PCIE |  |
| SATA1 | 6G/3G/1.5G | 支持(支持5个硬盘) | PCIE、USB |  |

## 2. DTS 配置

RK3566

| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA1 | rk3568.dtsi | sata1 | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3568

| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA0 | rk3568.dtsi | sata0 | combphy0_us |
| SATA1 | rk3568.dtsi | sata1 | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3588

| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3588.dtsi | sata1 | combphy1_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3588s

| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3576

| 资源 | 参考配置 | 控制器节点 | PHY节点 |
| --- | --- | --- | --- |
| SATA0 | rk3576.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3576.dtsi | sata1 | combphy1_psu |

1. compatible = "rockchip,rk-ahci", "snps,dwc-ahci";必须配置项:默认配置,对应驱动:drivers/ata/ahci_platform.c。

2. phy-names = "sata-phy“;

必须配置项:不可以修改,AHCI驱动会根据"sata-phy“名字找到对应combphy节点。

3. status = <okay>;必须配置项:此配置需要在 SATA控制器节点和对应的 phy 节点同时使能。

4. assigned-clock-rates = <100000000>;必须配置项:可以配置的参考时钟频率值有:24000000、25000000和100000000,推荐配置100000000。

5. pinctrl-0 = <&sata_pm_reset>;

```text
sata_pm_reset: sata-pm-reset {
    rockchip,pins = <4 RK_PD2 RK_FUNC_GPIO &pcfg_output_high>;
};

&combphy1_usq {
    pinctrl-names = "default";
    pinctrl-0 = <&sata_pm_reset>;
};
```

可选配置项:外接PM芯片扩展SATA口时,可能需要一个GPIO来复位PM芯片,具体可以参考“rk3568-nvr-demo-v10.dtsi”里面设置。

6. pinctrl-0 = <&sata2_pins>;

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

可选配置项:在对应的sata控制器节点增加pinctrl配置来启用SATA ACT LED功能。

6. dma-coherent;可选配置项:RK3576支持CACHE一致性,SDK默认已经启用功能,dts可以配置,其他平台不能配置这个参数。

## 3. menuconfig 配置

需要确保如下配置打开,方可正确的使用 SATA相关功能。

kernel 4.19和kernel 5.10配置如下:

```text
CONFIG_ATA=y
CONFIG_SATA_AHCI=y
CONFIG_SATA_AHCI_PLATFORM=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
```

kernel 6.1配置如下:

```text
CONFIG_ATA=y
CONFIG_SATA_AHCI=y
CONFIG_AHCI_DWC=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
```

## 4. U-boot支持SATA

### 4.1 DTS修改

DTS需要启用combphy和sata控制器, 引用到的php_grf和pipe_phyx_grf节点也需要启用,下面代码是RK3588 SATA0的配置参考:

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

### 4.2 编译

RK356x的配置文件为“rk3568-sata.config”,编译命令:

```text
./make.sh rk3568-sata
```

RK3588(s)的配置文件为“rk3588-sata.config”,编译命令:

```text
./make.sh rk3588-sata
```

## 5. 常⻅问题

### 5.1 是否支持通过SATA接口给PM芯片下载固件?

RK356X 和 RK3588 都支持 JMB575 下载固件。原稿补丁链接：[JMB575 固件下载补丁](https://redmine.rock-chips.com/documents/108)（访问权限与有效性未验证）。

### 5.2 SATA性能怎么测试?

参考文档 RK-KF-YF-138 《Rockchip_RK3568_Reference_SATA_Performance_CN》。

### 5.3 默认SDK代码认不到SATA设备,什么原因?

软件情况1:第一版SDK代码单独更新uboot后,会出现这个问题,需要更新一下kernel下phy驱动。

```text
commit b3f78165e536d35b2337063093bb33a018ff518d
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Wed Dec 23 16:17:31 2020 +0800

    phy: rockchip: naneng-combphy: Reset phy if not being used

    Change-Id: Ia62481ebf5aa5684c359fd00a3933bb02e2caaff
    Signed-off-by: Shawn Lin <shawn.lin@rock-chips.com>
```

软件情况2: SATA和PCIE只能二选一,DTS里面需要把PCIE配置为disabled。硬件情况: SATA和PCIE只能二选一 ,如果有做兼容布板会影响信号,把PCIE走线部分的分支去掉。

### 5.4 如何限制SATA速度到1.5G或者3G?

PHY驱动默认支持6G速率,通过修改PHY驱动来限制PHY的最高支持速率,下面是不同平台参考补丁。RK356X 限制到1.5G补丁:

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

RK356X 限制到3G补丁:

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

RK3588(S) 限制到1.5G补丁:

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

RK3588(S) 限制到3G补丁:

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

### 5.5 RK356X怎么启用FBS功能?

外接PM芯片时,开启FBS功能,可以提高读写性能。

kernel 4.19 和 kernel 5.10 更新下面补丁，修改 dtsi 的 sata 节点为 `compatible = "rockchip,rk-ahci", "snps,dwc-ahci";`。

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

kernel 6.1使用不同的驱动,通过u-boot更新下面补丁实现。RK356X平台u-boot补丁:

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

RK3576平台u-boot补丁:

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

RK3588平台u-boot补丁:

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

### 5.6 硬盘怎么设置进入待机或者休眠?

关机的时候,需要设置硬盘进入待机或者休眠,避免直接下电造成硬盘损坏。执行下面命令后,可能需要等待10秒硬盘才会停转并进入待机或者休眠,有访问硬盘时又会重新被唤醒,关机时建议硬盘umount后再执行命令,避免系统还有读写访问。

```text
待机： busybox hdparm -y /dev/block/sda
休眠： busybox hdparm -Y /dev/block/sda
```

{% endraw %}
