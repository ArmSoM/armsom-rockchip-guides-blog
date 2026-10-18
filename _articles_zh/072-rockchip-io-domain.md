---
title: "Rockchip IO-Domain 完整指南：供电映射、电压寄存器与 DTS 排障"
description: "完整保留 IO-domain 供电映射、GRF/PMUGRF、fixed regulator 和 RK3399 电压核对步骤。"
translation_key: "072-rockchip-io-domain"
slug: "072-rockchip-io-domain"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "power"
products: []
tags: ["ArmSoM", "Rockchip", "IO-Domain"]
keywords: "ArmSoM Rockchip rockchip io domain"
excerpt: "完整保留 IO-domain 供电映射、GRF/PMUGRF、fixed regulator 和 RK3399 电压核对步骤。"
---

{% raw %}

# Rockchip IO-Domain 完整指南：供电映射、电压寄存器与 DTS 排障

## ArmSoM 适用说明与原文范围

本文为 ArmSoM 适配前的平台参考，依据 CN V1.0.1; no EN PDF。未进行板卡、SDK/BSP、内核或接线组合的硬件验证。下表沿用原稿范围，不表示所有 ArmSoM 板卡或所有内核均支持；请核对具体 SoC、板卡原理图、SDK/BSP、内核驱动和引脚复用。命令、补丁、日志、测试数字均为原文示例，不是 ArmSoM 实测。

未提供英文 PDF；英文、俄文完整翻译中文原稿并沿用中文原图，图注按语言本地化。

| 原文芯片 | 原文内核范围 |
| --- | --- |
| RK3188 | 4.4 |
| RK3288 | 4.4 |
| RK3036 | 4.4 |
| RK312x | 4.4 |
| RK322x | 4.4 |
| RK3368 | 3.10 |
| RK3368 | 4.4 |
| RK3366 | 4.4 |
| RK3399 | 4.4 |
| RV1108 | 3.10 |
| RV1108 | 4.4 |
| RK3228H | 3.10 |
| RK3328 | 4.4 |
| RK3326/PX30 | 4.4 |
| RK3308 | 4.4 |

一般 IO 电源可为 1.8v、3.3v、2.5v、5.0v 等，部分 IO 支持多种电压。IO-domain 按真实硬件电压范围配置 IO 电源域寄存器，否则无法正常工作。下表为原文列出的需配置芯片，不代表任意引脚都耐受上述全部电压。

[校对记录](/docs/rockchip-io-domain/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, unit 0 -->

## 1. 驱动文件与 DTS 节点

<!-- Source CN PDF p.4, unit 1 -->

### 1.1 驱动文件

<!-- Source CN PDF p.4, unit 2 -->

驱动文件所在位置：drivers/power/avs/rockchip-io-domain.c

<!-- Source CN PDF p.4, unit 3 -->

### 1.2 DTS 节点

<!-- Source CN PDF p.4, unit 4 -->

内核 3.10 版本的 DTS 节点合并：

<!-- Source CN PDF p.4, unit 5 -->

```text
io-domains {
    compatible = "rockchip,rk3368-io-voltage-domain";
    rockchip,grf = <&grf>;
    rockchip,pmugrf = <&pmugrf>;
    /*GRF_IO_VSEL*/
    dvp-supply = <&ldo7_reg>; /* DVPIO_VDD */
    wifi-supply = <&ldo7_reg>; /* APIO2_VDD */
    audio-supply = <&dcdc2_reg>; /* APIO3_VDD */
    sdcard-supply = <&ldo1_reg>; /* SDMMC0_VDD */
    gpio30-supply = <&dcdc2_reg>; /* APIO1_VDD */
    gpio1830-supply = <&dcdc2_reg>;/* ADIO4_VDD */
    /*PMU_GRF_IO_VSEL*/
    pmu-supply = <&ldo5_reg>; /* PMUIO_VDD */
    vop-supply = <&ldo5_reg>; /* LCDC_VDD */
};
```

<!-- Source CN PDF p.4, unit 6 -->

内核 4.4 版本的 DTS 节点 GRF 和 PMUGRF 分开：

<!-- Source CN PDF p.4, unit 7 -->

```text
&io_domains {
    status = "okay";
    dvp-supply = <&vcc_18>;
    audio-supply = <&vcc_io>;
    gpio30-supply = <&vcc_io>;
    gpio1830-supply = <&vcc_io>;
    sdcard-supply = <&vccio_sd>;
    wifi-supply = <&vccio_wl>;
};
&pmu_io_domains {
    status = "okay";
    pmu-supply = <&vcc_io>;
    vop-supply = <&vcc_io>;
};
```

<!-- Source CN PDF p.5, unit 8 -->

## 2. TRM 中的描述

<!-- Source CN PDF p.5, unit 9 -->

很多工程师反映在 TRM 中找不到 io-domain 相关的寄存器，可以通过 TRM 来搜索需要配置的 io-domain 寄存器描述，在 GRF/PMUGRF 章节搜索 ’vsel‘ ， ‘VSEL’ 或者 ‘volsel’ 索引，PMUGRF 中的 io-domain 是用来控制 PMU IO。

<!-- Source CN PDF p.5, unit 10 -->

支持配置的两种电压 1.8v / 3.3v：

<!-- Source CN PDF p.5, unit 11 -->

寄存器配置成 1，一般对应的电压范围是 1.62v ~ 1.98v，typical 电压 1.8v；

<!-- Source CN PDF p.5, unit 12 -->

寄存器配置成 0，一般对应的电压范围是 3.00v ~ 3.60v，typical 电压 3.3v。

<!-- Source CN PDF p.5, unit 13 -->

具体电压范围要以实际芯片的 Datasheet 为准。

<!-- Source CN PDF p.5, unit 14 -->

## 3. 驱动软件流程

<!-- Source CN PDF p.5, unit 15 -->

下面是 rockchip-io-domain.c 驱动的软件流程图，主要分为两个方面：

<!-- Source CN PDF p.5, unit 16 -->

### 3.1 初始化配置

<!-- Source CN PDF p.5, unit 17 -->

在驱动的 probe 函数中的 supply name，获取 dts 中对应 supply name 定义的 regulator，再根据regulator 的电压配置 io-domain 寄存器，如果是 1.8v 那一档，该 bit 配置为 1；如果是 3.3v 那一档，该 bit 配置为 0。

<!-- Source CN PDF p.6, unit 18 -->

![技术图 — 072, 来源 CN PDF p.6, cn-p06-initialization-flow.png](/docs/rockchip-io-domain/assets/cn-p06-initialization-flow.png)

*技术图 — 072, 来源 CN PDF p.6, cn-p06-initialization-flow.png.*

流程：开始 → 匹配 Supply_Name → 获取 Regulator 是否成功？否：丢弃；是：配置 io-domain。是否继续？是：处理下一供电项；否：结束。

<!-- Source CN PDF p.6, unit 25 -->

### 3.2 动态配置

<!-- Source CN PDF p.6, unit 26 -->

在初始化的过程中，会绑定 regulator，通过注册 notify 的方式，一旦这个 regulator 的电压发生变化，就会通知 io-domain 驱动更新成对应的寄存器，做到动态更新寄存器的效果。

<!-- Source CN PDF p.6, unit 27 -->

## 4. 如何配置 io-domain

<!-- Source CN PDF p.6, unit 28 -->

不是每个 IO 电源域都需要配置，有些 IO 的电源域是固定的，不需要配置。下面 3 个步骤描述如何通过软件配置 io-domian：

<!-- Source CN PDF p.7, unit 29 -->

### 4.1 通过 rockchip-io-domain.txt 文档寻找名称

<!-- Source CN PDF p.7, unit 30 -->

需要在软件上通过 dts 配置的 IO 电源域在 Linux Kernel 的目录下的文件都有描述：Documentation/devicetree/bindings/power/rockchip-io-domain.txt；由于 TRM 文档和硬件原理图上对同一个 io-domain 名称描述可能有差异，在 rockchip-io-domain.txt 文档上统一描述了 TRM 与 硬件原理图上 io-domain 名称的对应关系。

<!-- Source CN PDF p.7, unit 31 -->

例如 RK3399 Soc，通过查看 rockchip-io-domain.txt 文档， 我们知道了 RK3399 的电源域需要配置包含 bt565，audio，sdmmc，gpio1830，以及 PMUGRF 下面的 pmu1830 这几个 supply，后面的 Thesupply connected to “***_VDD” 表示在硬件原理图上对应的名称。

<!-- Source CN PDF p.7, unit 32 -->

Possible supplies for rk3399:

<!-- Source CN PDF p.7, unit 33 -->

bt656-supply: The supply connected to APIO2_VDD.

<!-- Source CN PDF p.7, unit 34 -->

audio-supply: The supply connected to APIO5_VDD.

<!-- Source CN PDF p.7, unit 35 -->

sdmmc-supply: The supply connected to SDMMC0_VDD.

<!-- Source CN PDF p.7, unit 36 -->

gpio1830-supply: The supply connected to APIO4_VDD.

<!-- Source CN PDF p.7, unit 37 -->

Possible supplies for rk3399 pmu-domains:

<!-- Source CN PDF p.7, unit 38 -->

pmu1830-supply:The supply connected to PMUIO2_VDD.

<!-- Source CN PDF p.7, unit 39 -->

### 4.2 通过硬件原理图寻找 io-domain 配置的真实电压

<!-- Source CN PDF p.7, unit 40 -->

仍以 RK3399-EVB 原理图 和 bt656 IO 电源域为例，我们在 rockchip-io-domain.txt 中找到了 bt656 对应的硬件原理图上表示为 APIO2_VDD。所以通过逆向搜索 ‘APIO2_VDD’ 得到 RK3399-EVB 硬件原理图上的 APIO2_VDD 电源是由 RK808 下的 VCC1V8_DVP 供给。

<!-- Source CN PDF p.7, unit 41 -->

![技术图 — 072, 来源 CN PDF p.7, cn-p07-figure1.png](/docs/rockchip-io-domain/assets/cn-p07-figure1.png)

*技术图 — 072, 来源 CN PDF p.7, cn-p07-figure1.png.*

<!-- Source CN PDF p.8, unit 42 -->

![技术图 — 072, 来源 CN PDF p.8, cn-p08-figure1.png](/docs/rockchip-io-domain/assets/cn-p08-figure1.png)

*技术图 — 072, 来源 CN PDF p.8, cn-p08-figure1.png.*

<!-- Source CN PDF p.8, unit 43 -->

### 4.3 通过 DTS 配置

<!-- Source CN PDF p.8, unit 44 -->

以上两步做完后，得到了配置的名称和供电源头，在 DTS 里面找到对应的 regulator: vcc1v8_dvp，就可以在 rk3399-evb.dtsi 配置上 “bt656-supply = `<&vcc1v8_dvp>`;”，其他的电源域配置类似。

<!-- Source CN PDF p.8, unit 45 -->

## 5. 通过硬件 Pin 脚控制的电源域一般不做配置

<!-- Source CN PDF p.8, unit 46 -->

在 RK Soc 中的一些 IO 电源域在硬件上已经通过某个 Pin 脚来控制的，这种情况下我们 kernel 的 DTS一般不去配置，不破坏当前的硬件状态，像 flash 和 emmc 这些模块的 IO 电源域一般都是 Pin 脚来控制的。

<!-- Source CN PDF p.8, unit 47 -->

在 TRM 的 io-domain 寄存器描述中，我们可以看到哪些电源域是可以通过 Pin 脚来控制的，以及通过硬件上这个 Pin 脚的输入电压状态来确认当前这个电压域的配置；也可以通过 GRF 寄存器来配置，两种选择。

<!-- Source CN PDF p.8, unit 48 -->

例如，RK3368 Soc 的 TRM 和 RK3368-evb 的硬件原理图上有下面寄存器的描述和硬件上 Pin 脚的配置。

<!-- Source CN PDF p.8, unit 49 -->

TRM 寄存器描述：

<!-- Source CN PDF p.8, unit 50 -->

![技术图 — 072, 来源 CN PDF p.8, cn-p08-figure2.png](/docs/rockchip-io-domain/assets/cn-p08-figure2.png)

*技术图 — 072, 来源 CN PDF p.8, cn-p08-figure2.png.*

原图可见内容的可编辑转录；表头为编辑补充，寄存器值不变。

| 位 | 访问 | 复位值 | 字段 / 含义 |
| --- | --- | --- | --- |
| 14 | RW | 0x0 | flash_poc_control<br>Flash IO 域 POC 控制选择<br>0：由 gpio_0b5 pad 控制<br>1：由 IO_VSEL 的 bit 2 控制 |

<!-- Source CN PDF p.8, unit 51 -->

![技术图 — 072, 来源 CN PDF p.8, cn-p08-figure3.png](/docs/rockchip-io-domain/assets/cn-p08-figure3.png)

*技术图 — 072, 来源 CN PDF p.8, cn-p08-figure3.png.*

原图可见内容的可编辑转录；表头为编辑补充，寄存器值不变。

| 位 | 访问 | 复位值 | 字段 / 含义 |
| --- | --- | --- | --- |
| 2 | RW | 0x1 | flash0_v18sel<br>FLASH0 IO 域 1.8V 电压选择<br>1'b0: 3.3V/2.5V<br>1'b1: 1.8V |

<!-- Source CN PDF p.8, unit 52 -->

硬件原理图：

<!-- Source CN PDF p.9, unit 53 -->

![技术图 — 072, 来源 CN PDF p.9, cn-p09-figure1.png](/docs/rockchip-io-domain/assets/cn-p09-figure1.png)

*技术图 — 072, 来源 CN PDF p.9, cn-p09-figure1.png.*

<!-- Source CN PDF p.9, unit 54 -->

![技术图 — 072, 来源 CN PDF p.9, cn-p09-figure2.png](/docs/rockchip-io-domain/assets/cn-p09-figure2.png)

*技术图 — 072, 来源 CN PDF p.9, cn-p09-figure2.png.*

原图可见内容的可编辑转录；表头为编辑补充，寄存器值不变。

| FLASH_VOL_SEL | FLASH_IO Voltage |
| --- | --- |
| 1.8V or 2.5V or 3.3V | 1.8V Driver IO |
| 0V | 3.3V Driver IO |

原理图还标注 `FLASH_VOLTAGE_SEL=0 FLASH_IO=3.3V` 和 `FLASH_VOLTAGE_SEL=1 FLASH_IO=1.8V`。这是原文电路标注，不是通用引脚耐压。

<!-- Source CN PDF p.9, unit 55 -->

## 6. DTS 中无定义 Regulator 情况处理

<!-- Source CN PDF p.9, unit 56 -->

在使用的过程中可能会遇到，你找不到相应的 regulator 来配置，可能项目上面未使用 pmic 等电源，只是简单的拉了一个电源过来，dts 上找不到 regulator 的定义，那么你需要在 dts 文件里面增加 fixedregulator 的定义，一般 3.3v 和 1.8v 两个 regulator 就够用了。

<!-- Source CN PDF p.9, unit 57 -->

下面是 rk3229-evb.dts 的配置例子，确定硬件上的电压是用 1.8v 还是 3.3v，配置成相应的 regulator：

<!-- Source CN PDF p.9, unit 58 -->

```text
    regulators {
       compatible = "simple-bus";
       #address-cells = <1>;
       #size-cells = <0>;
       vccio_1v8_reg: regulator@0 {
           compatible = "regulator-fixed";
           regulator-name = "vccio_1v8";
           regulator-min-microvolt = <1800000>;
           regulator-max-microvolt = <1800000>;
           regulator-always-on;
       };
       vccio_3v3_reg: regulator@1 {
           compatible = "regulator-fixed";
           regulator-name = "vccio_3v3";
           regulator-min-microvolt = <3300000>;
           regulator-max-microvolt = <3300000>;
           regulator-always-on;
       };
    };
&io_domains {
    status = "okay";
    vccio1-supply = <&vccio_3v3_reg>;
    vccio2-supply = <&vccio_1v8_reg>;
    vccio4-supply = <&vccio_3v3_reg>;
};
```

<!-- Source CN PDF p.10, unit 60 -->

## 7. 常见问题

<!-- Source CN PDF p.10, unit 61 -->

### 7.1 如何确定某个 Pin 脚所在的电源域寄存器是否配置正确

<!-- Source CN PDF p.10, unit 62 -->

经常遇到客戶报的问题是某 pin 脚的电压与所期望的不符，很有可能就是电源域配置问题。例如，在RK3399 上，软件上代码已经让 GPIO2_B1 输出高，但是实际通过量测发现电压不对；通过读取寄存器已经确认该 pin 脚已经将 iomux 配置成 gpio，并且也设置成输出高，这就很有可能是 io-domain 没有配置正确。那么这时候就要确认电源域寄存器是否配置正确，方法就是上面介绍的如何配置电源域的相反步骤。

<!-- Source CN PDF p.10, unit 63 -->

先确定这个 io 所在的电源域，一般是看硬件原理图或者 Datasheet 来确定。例如，RK3399 下面通过硬件原理如图发现 GPIO2_B1 所在的电源域硬件上表示为 APIO2_VDD，并且 APIO2_VDD 是接的电压是 VCC1V8_DVP 。

<!-- Source CN PDF p.10, unit 64 -->

![技术图 — 072, 来源 CN PDF p.10, cn-p10-figure1.png](/docs/rockchip-io-domain/assets/cn-p10-figure1.png)

*技术图 — 072, 来源 CN PDF p.10, cn-p10-figure1.png.*

<!-- Source CN PDF p.11, unit 65 -->

![技术图 — 072, 来源 CN PDF p.11, cn-p11-figure1.png](/docs/rockchip-io-domain/assets/cn-p11-figure1.png)

*技术图 — 072, 来源 CN PDF p.11, cn-p11-figure1.png.*

<!-- Source CN PDF p.11, unit 66 -->

通过 rockchip-io-domain.txt 文档找到对应的名称。例如，在 rockchip-io-domain.txt 文档上找到的电源域对应的名称是 “bt656”。

<!-- Source CN PDF p.11, unit 67 -->

![技术图 — 072, 来源 CN PDF p.11, cn-p11-figure2.png](/docs/rockchip-io-domain/assets/cn-p11-figure2.png)

*技术图 — 072, 来源 CN PDF p.11, cn-p11-figure2.png.*

截图中的可复制 binding 摘录（原图写作 `gpio1830`，没有 `-supply` 后缀和冒号；不静默改写）：

```text
Possible supplies for rk3368 pmu-domains:
- pmu-supply:    The supply connected to PMUIO_VDD.
- vop-supply:    The supply connected to LCDC_VDD.

Possible supplies for rk3399:
- bt656-supply:  The supply connected to APIO2_VDD.
- audio-supply:  The supply connected to APIO5_VDD.
- sdmmc-supply:  The supply connected to SDMMC0_VDD.
- gpio1830      The supply connected to APIO4_VDD.

Possible supplies for rk3399 pmu-domains:
- pmu1830-supply:The supply connected to PMUIO2_VDD.
```

RK3368 PMU 域的 pmu/vop 分别连接 PMUIO_VDD/LCDC_VDD；RK3399 的 bt656/audio/sdmmc/gpio1830 分别连接 APIO2_VDD/APIO5_VDD/SDMMC0_VDD/APIO4_VDD，PMU 电源连接 PMUIO2_VDD。

<!-- Source CN PDF p.11, unit 68 -->

在 TRM 上找到这个寄存器，通过 io 命令或者其他方式读取这个寄存器的值，一般基地址是 GRF 或者 PMUGRF。例如，在 TRM 文档上搜索到 “bt656” 寄存器描述，为 bit0，查看寄存器偏移为0xe640，GRF 基地址为 0xff770000。在串口终端输入 “io -4 0xff77e640”，得到 io-domain 寄存器值，如果该寄存器值 bit0 为 1，表示 1.8v， 与硬件实际电压 VCC1V8_DVP，dts 中该项配置正确；如果 bit0 为 0，则表示 3.3v，与硬件实际电压 VCC1V8_DVP 不符，dts 中该项配置不正确。

<!-- Source CN PDF p.11, unit 69 -->

![技术图 — 072, 来源 CN PDF p.11, cn-p11-figure3.png](/docs/rockchip-io-domain/assets/cn-p11-figure3.png)

*技术图 — 072, 来源 CN PDF p.11, cn-p11-figure3.png.*

原图可见内容的可编辑转录；表头为编辑补充，寄存器值不变。

| 位 | 访问 | 复位值 | 字段 / 含义 |
| --- | --- | --- | --- |
| 3 | RW | 0x0 | gpio1833_gpio4cd_ms |
| 2 | RW | 0x0 | sdmmc_gpio4b_ms |
| 1 | RW | 0x0 | audio_gpio3d4a_ms |
| 0 | RW | 0x0 | bt656_gpio2ab_ms |

寄存器截图写作 `gpio1833_gpio4cd_ms`，binding 截图写作 `gpio1830`；两处原始拼写分别保留，需结合对应 TRM/BSP 核对。

<!-- Source CN PDF p.12, unit 70 -->

### 7.2 io-domain 的寄存器不正确

<!-- Source CN PDF p.12, unit 71 -->

常见的寄存器错误，可能是以下几个问题

<!-- Source CN PDF p.12, unit 72 -->

所配置的 regulator 电压不对；

<!-- Source CN PDF p.12, unit 73 -->

未配置 Regulator 或 Regulator 未使能；

<!-- Source CN PDF p.12, unit 74 -->

Regulator 比 io-domain 驱动加载更慢，获取 regulator 失败。

{% endraw %}
