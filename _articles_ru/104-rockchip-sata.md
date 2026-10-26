---
title: "Полное руководство Rockchip Linux SATA: DTS, U-Boot, ограничение скорости и FBS"
description: "Полное руководство Rockchip Linux SATA: DTS, U-Boot, ограничение скорости и FBS — RK-KF-YF-148 V2.4.0, RK3566/RK3568/RK3588/RK3576."
translation_key: "104-rockchip-sata"
slug: "104-rockchip-sata"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SATA", "U-Boot", "FBS", "DTS"]
excerpt: "Полное руководство Rockchip Linux SATA: DTS, U-Boot, ограничение скорости и FBS — RK-KF-YF-148 V2.4.0, RK3566/RK3568/RK3588/RK3576."
---

{% raw %}

# Полное руководство Rockchip Linux SATA: DTS, U-Boot, ограничение скорости и FBS

Полностью сохранены технические главы китайского/английского RK-KF-YF-148 V2.4.0 (CN стр. 4–13, EN 5–14). Область источника: RK356X/kernel 4.19; RK3588/RK3588S/RK356X/kernel 5.10; RK3576/kernel 6.1. Также приведены настройки драйвера kernel 6.1 и патчи U-Boot нескольких платформ. Код во всех четырёх языках следует китайским примерам. Для ArmSoM проверьте разводку SATA, общие PHY, питание, PM-расширитель, SDK/BSP, ветки ядра и U-Boot. Это платформенная справка без измерений ArmSoM или проверки сна и совместимости патчей. Отдельных технических рисунков нет; таблицы доступны для редактирования.

> Сохранены проблемы оригинала: `status = <okay>;`, типографская закрывающая кавычка phy-names и повтор номера 6 в §2. Это не проверенный готовый к компиляции DTS. Общие PHY и альтернативная разводка зависят от SoC/платы; взаимоисключение не распространяется автоматически на все контроллеры системы. Доступ к патчу не проверен. Примеры выключения, сна, драйверов и регистров не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. Ресурсы микросхем

RK3566

| Ресурс | Режим | Расширение через PM | Совместное использование PHY | Примечания |
| --- | --- | --- | --- | --- |
| SATA1 | 6G/3G/1.5G | Поддерживается (5 дисков) | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | Поддерживается (5 дисков) | PCIE、QSGMII |  |

RK3568

| Ресурс | Скорость | Расширение через PM | Совместное использование PHY | Примечания |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Поддерживается (5 дисков) | USB |  |
| SATA1 | 6G/3G/1.5G | Поддерживается (5 дисков) | USB、QSGMII |  |
| SATA2 | 6G/3G/1.5G | Поддерживается (5 дисков) | PCIE、QSGMII |  |

RK3588S

| Ресурс | Режим | Расширение через PM | Совместное использование PHY | Примечания |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Поддерживается (5 дисков) | PCIE |  |
| SATA2 | 6G/3G/1.5G | Поддерживается (5 дисков) | PCIE、USB |  |

RK3588

| Ресурс | Скорость | Расширение через PM | Совместное использование PHY | Примечания |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Поддерживается (5 дисков) | PCIE |  |
| SATA1 | 6G/3G/1.5G | Поддерживается (5 дисков) | PCIE |  |
| SATA2 | 6G/3G/1.5G | Поддерживается (5 дисков) | PCIE、USB |  |

RK3576

| Ресурс | Скорость | Расширение через PM | Совместное использование PHY | Примечания |
| --- | --- | --- | --- | --- |
| SATA0 | 6G/3G/1.5G | Поддерживается (5 дисков) | PCIE |  |
| SATA1 | 6G/3G/1.5G | Поддерживается (5 дисков) | PCIE、USB |  |

## 2. Настройка DTS

RK3566

| Ресурс | Эталонная конфигурация | Узел контроллера | Узел PHY |
| --- | --- | --- | --- |
| SATA1 | rk3568.dtsi | sata1 | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3568

| Ресурс | Эталонная конфигурация | Узел контроллера | Узел PHY |
| --- | --- | --- | --- |
| SATA0 | rk3568.dtsi | sata0 | combphy0_us |
| SATA1 | rk3568.dtsi | sata1 | combphy1_usq |
| SATA2 | rk3568.dtsi | sata2 | combphy2_psq |

RK3588

| Ресурс | Эталонная конфигурация | Узел контроллера | Узел PHY |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3588.dtsi | sata1 | combphy1_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3588s

| Ресурс | Эталонная конфигурация | Узел контроллера | Узел PHY |
| --- | --- | --- | --- |
| SATA0 | rk3588s.dtsi | sata0 | combphy0_ps |
| SATA2 | rk3588s.dtsi | sata2 | combphy2_psu |

RK3576

| Ресурс | Эталонная конфигурация | Узел контроллера | Узел PHY |
| --- | --- | --- | --- |
| SATA0 | rk3576.dtsi | sata0 | combphy0_ps |
| SATA1 | rk3576.dtsi | sata1 | combphy1_psu |

1. `compatible = "rockchip,rk-ahci", "snps,dwc-ahci";` Обязательная настройка по умолчанию; драйвер: `drivers/ata/ahci_platform.c`.

2. `phy-names = "sata-phy“;`

Обязательный неизменяемый параметр: драйвер AHCI находит соответствующий узел combphy по имени "sata-phy“.

3. `status = <okay>;` Обязательно: включите одновременно узел контроллера SATA и соответствующий узел phy.

4. `assigned-clock-rates = <100000000>;` Обязательно: допустимые частоты опорного тактирования — 24000000, 25000000 и 100000000; рекомендуется 100000000.

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

Необязательно: при расширении портов SATA внешней микросхемой PM может потребоваться GPIO для её сброса. См. настройки в rk3568-nvr-demo-v10.dtsi.

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

Необязательно: добавьте pinctrl в соответствующий узел контроллера sata, чтобы включить SATA ACT LED.

6. `dma-coherent;` Необязательно: RK3576 поддерживает когерентность кэша; SDK включает её по умолчанию, настройка доступна в DTS. На других платформах этот параметр задавать нельзя. Повтор номера сохранён из источника.

## 3. Настройка menuconfig

Для правильной работы SATA включите следующие параметры.

Для kernel 4.19 и kernel 5.10:

```text
CONFIG_ATA=y
CONFIG_SATA_AHCI=y
CONFIG_SATA_AHCI_PLATFORM=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
```

Для kernel 6.1:

```text
CONFIG_ATA=y
CONFIG_SATA_AHCI=y
CONFIG_AHCI_DWC=y
CONFIG_PHY_ROCKCHIP_NANENG_COMBO_PHY=y
```

## 4. Поддержка SATA в U-Boot

### 4.1 Изменения DTS

В DTS включите combphy и контроллер sata, а также используемые узлы php_grf и pipe_phyx_grf. Ниже приведён пример настройки RK3588 SATA0.

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

### 4.2 Сборка

Для RK356x используется rk3568-sata.config. Команда сборки:

```text
./make.sh rk3568-sata
```

Для RK3588(s) используется rk3588-sata.config. Команда сборки:

```text
./make.sh rk3588-sata
```

## 5. Часто задаваемые вопросы

### 5.1 Можно ли загружать прошивку PM через SATA?

RK356X и RK3588 поддерживают загрузку прошивки JMB575. Ссылка из источника: [патч загрузки прошивки JMB575](https://redmine.rock-chips.com/documents/108) (доступность и права не проверены).

### 5.2 Как проверить производительность SATA?

См. RK-KF-YF-138, Rockchip_RK3568_Reference_SATA_Performance_CN.

### 5.3 Почему стандартный SDK не обнаруживает SATA-устройство?

Программный случай 1: обновление только uboot в первой версии SDK может вызвать эту проблему. Обновите также драйвер phy в kernel.

```text
commit b3f78165e536d35b2337063093bb33a018ff518d
Author: Shawn Lin <shawn.lin@rock-chips.com>
Date:   Wed Dec 23 16:17:31 2020 +0800

    phy: rockchip: naneng-combphy: Reset phy if not being used

    Change-Id: Ia62481ebf5aa5684c359fd00a3933bb02e2caaff
    Signed-off-by: Shawn Lin <shawn.lin@rock-chips.com>
```

Программный случай 2: SATA и PCIE взаимоисключающие; отключите PCIE в DTS. Аппаратный случай: SATA и PCIE также взаимоисключающие. Разводка для обоих вариантов может влиять на сигнал; уберите ответвление трассы PCIE.

### 5.4 Как ограничить SATA до 1.5G или 3G?

Драйвер PHY по умолчанию поддерживает 6G. Измените его для ограничения максимальной скорости PHY. Ниже примеры патчей для разных платформ. RK356X: ограничение до 1.5G.

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

RK356X: ограничение до 3G.

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

RK3588(S): ограничение до 1.5G.

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

RK3588(S): ограничение до 3G.

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

### 5.5 Как включить FBS на RK356X?

При использовании внешней микросхемы PM включение FBS может повысить скорость чтения/записи.

Для kernel 4.19 и kernel 5.10 примените следующий патч и задайте в узле sata файла dtsi `compatible = "rockchip,rk-ahci", "snps,dwc-ahci";`.

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

Kernel 6.1 использует другой драйвер; реализация выполняется следующими патчами U-Boot. Патч U-Boot для RK356X:

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

Патч U-Boot для RK3576:

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

Патч U-Boot для RK3588:

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

### 5.6 Как перевести диск в ожидание или сон?

При выключении переведите диск в ожидание или сон, чтобы избежать повреждения из-за резкого отключения питания. После следующих команд остановка вращения и переход в ожидание/сон могут занять 10 секунд. Обращение к диску снова разбудит его. При выключении сначала размонтируйте диск, чтобы система больше не читала и не писала на него.

```text
待机： busybox hdparm -y /dev/block/sda
休眠： busybox hdparm -Y /dev/block/sda
```

{% endraw %}
