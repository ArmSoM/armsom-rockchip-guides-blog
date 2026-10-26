---
title: "Rockchip PCIe EP Linux 完整开发指南：启动、BAR、固件和复位"
description: "Rockchip PCIe EP Linux 完整开发指南：启动、BAR、固件和复位 — RK-KF-YF-C51 V3.2.0; RK3588, RK3568."
translation_key: "108-rockchip-pcie-ep"
slug: "108-rockchip-pcie-ep"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, PCIe, RK3588, RK3568]
excerpt: "Rockchip PCIe EP Linux 完整开发指南：启动、BAR、固件和复位 — RK-KF-YF-C51 V3.2.0; RK3588, RK3568."
---

{% raw %}

本文完整整理 RK-KF-YF-C51 V3.2.0 中文原稿。原稿范围：RK3588 Linux 6.1/5.10；RK3568 Linux 6.1/5.10/4.19；RT-Thread 仅在 RK PCIe EP 侧实现。没有对应英文 PDF，四语统一采用中文原图。本文是平台参考，需核对实际 ArmSoM 板卡的 PCIe 引出、供电、PERST#/WAKE#、SDK/BSP、Loader 和内核配置；尚未完成 ArmSoM 硬件验证。

> 原稿疑点：BAR 范围“1MB(2^0)到8EB(2^20)”算术不一致；SPL_PCIE_EP_SUPPOR 与代码中的 SUPPORT 拼写不同；reset-gpios 和 wake-gpios 均示例为 gpio3 13；§1.4 末句不完整，§7.2.2 诊断措辞含混，§7.2.3 正文写 Host Reset。原值保留待核对，勿直接部署。烧写、OTP、分区和复位操作可能丢失数据；本文未执行这些命令。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

<!-- Source PDF p.5 -->

## 1. 启动方案

### 1.1 启动方案方案汇总

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| PCIe Boot | PCIe快速初始化、无存储、支持上位机下载固<br>件 | PCIe可调参数少、兼<br>容性一般 |
| Flash Boot - 集成PCIe Bin及EP<br>Boot软件方案 | 支持通用RC、PCIe参数完全可调、小存储、<br>支持上位机下载固件 | 软件流程相对复杂 |
| Flash Boot - 集成PCIe Bin软件方<br>案 | 支持通用RC、PCIe参数完全可调、支持本地<br>存储 | 大存储 |
| Common Boot | 软件流程最简单、支持本地存储 | 大存储、仅支持特定<br>RC |

### 1.2 PCIe Boot

PCIe Boot为ROM code中集成的PCIe固件加载逻辑,PCIe Boot方案在ROM code中实现完成PCIe枚举、固件加载事务:PCIe快速初始化、无存储、支持上位机下载固件,需查阅"RK SOC PCIe互联特性"章节确认芯片支持情况由于PCIe初始化代码为掩模固化代码,大多数参数不可调,仅支持OTP修改特定PCIe配置,推荐应用于固定类型的RC环境以下为流程框图:

<!-- Source PDF p.6 -->

![中文原稿流程图，第 6](/docs/rockchip-pcie-ep/assets/cn-p006-figure-01.png)

*中文原稿流程图，第 6*

说明:红色箭头涉及上位机下载固件行为主要流程说明:BootROM:完成PCIe枚举,集成PCIe Boot固件加载逻辑,上位机下载Pre-Loader固件,运行Pre-Loader固件Loader:运行多个前级固件,通常包括:ddr.bin:初始化ddrloader.bin:集成EP Boot固件加载逻辑,上位机下载firmware固件,通常包括后级固件、算法等数据,运行后级固件,Linux方案该loader.bin为spl.binOS:后级固件,kernel/userspace下运行芯片互联chips connectr开发包

### 1.3 Flash Boot - 集成PCIe Bin及EP Boot软件方案

Flash Boot为RK SOC SPI Flash启动方案,Flash Boot方案SPI Flash Boot基础上,于Loader阶段实现:集成PCIe Bin固件实现PCIe快速初始化Loader阶段集成EP Boot逻辑,实现上位机推送后级固件的功能以下为流程框图:

<!-- Source PDF p.7 -->

![中文原稿流程图，第 7](/docs/rockchip-pcie-ep/assets/cn-p007-figure-01.png)

*中文原稿流程图，第 7*

须知:使用SPI Flash作为启动存储,集成PCIe Bin固件实现PCIe快速初始化,由上位机推送后级固件支持接入通用PC

说明:红色箭头为上位机引导固件下载主要流程说明:BootROM:加载运行PCIe Bin/Pre-LoaderPCIe Bin:完成PCIe枚举Loader:运行多个前级固件,通常包括:pcie.bin:完成PCIe枚举ddr.bin:初始化ddrloader.bin:集成EP Boot固件加载逻辑,上位机下载 fw packet 固件,通常包括后级固件、算法等数据,运行后级固件,Linux方案该loader.bin为spl.binOS:后级固件,kernel/userspace下运行芯片互联chips connect开发包

### 1.4 Flash Boot - 集成PCIe Bin软件方案

Flash Boot为RK SOC SPI Flash启动方案,Flash Boot方案SPI Flash Boot基础上,于Loader阶段实现:集成PCIe Bin固件实现PCIe快速初始化,支持接入通用PC支持本地存储:单存储方案:SPI Flash中加载后级固件双存储方案:SPI Flash作为启动存储,并集成NVMe/eMMC等大容量存储组成双存储,从大容量存储中

<!-- Source PDF p.8 -->

加载后级固件,详细参考《Rockchip_Developer_Guide_Dual_Storage_CN.pdf》文档以下为流程框图:

![中文原稿流程图，第 8](/docs/rockchip-pcie-ep/assets/cn-p008-figure-01.png)

*中文原稿流程图，第 8*

说明:红色箭头为上位机引导固件下载主要流程说明:BootROM:加载运行PCIe Bin/Pre-LoaderPCIe Bin:完成PCIe枚举Loader:运行多个前级固件,通常包括:pcie.bin:完成PCIe枚举ddr.bin:初始化ddrloader.bin:加载运行后级固件OS:后级固件,kernel/userspace下运行芯片互联chips connect开发包支持扩展双存储方案,SPI Flash启动存储,NVMe/eMMC等大容量存储作为主存储,详细参考《Rockchip_Developer_Guide_Dual_Storage_CN.pdf》文档该方案支持扩展为SPI Nand Flash Boot,将RC下载固件动作优化为EP

### 1.5 Common Boot

Common Boot指RK SOC通用启动方案,支持内核阶段完成PCIe初始化及枚举该方案由于未实现PCIe快速初始化,所以不支持对接通用PC,适用于RK芯片互联、EP板卡非标准独立供电方案、可定制RC主板等场景以下为流程框图:

<!-- Source PDF p.9 -->

![中文原稿流程图，第 9](/docs/rockchip-pcie-ep/assets/cn-p009-figure-01.png)

*中文原稿流程图，第 9*

## 2. 硬件配置

详细的硬件设计可以向RK申请提供原理图参考设计,例如RK3588&lt;RK_PCIeEP_DEMO_RK3588_LP4XD200P232SD8_V10_20230323RZF.pdf&gt;。PCIe EP产品,还应根据实际产品形态进一步调整硬件设计。

## 3. DTS配置

```text
/{
    reserved-memory {
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;
        bar0_region: bar0-region@3c000000 {
            reg = <0x0 0x3c000000 0x0 0x00400000>;
        };
        bar2_region: bar2-region@40000000 {
            reg = <0x0 0x40000000 0x0 0x04000000>; # Bar⼤⼩配置：0x04000000Bytes
        };
    };
}

&pcie3x4 {
        compatible = "rockchip,rk3588-pcie-std-ep";
        memory-region = <&bar0_region>, <&bar2_region>;
        memory-region-names = "bar0", "bar2";
        reset-gpios = <&gpio4 RK_PB6 GPIO_ACTIVE_LOW>; # PERST# GPIO配置
        rockchip,ep-power-independent; # PERST# GPIO配置
        status = "okay";
};
```

RK芯片互联独立供电方案特殊配置(标准卡无需配置)

1. reset-gpios = &lt;&gpio3 13 GPIO_ACTIVE_HIGH&gt;;必须配置项:此项是设置PCIe接口的PERST#复位输入信号;不论是插槽还是焊贴的设备,请在原理图上找到该引脚,并正确配置。否则很有可能将无法稳定完成链路建立。

2. wake-gpios = &lt;&gpio3 13 GPIO_ACTIVE_HIGH&gt;;必须配置项:此项是设置 PCIe 接口的 WAKE#输出信号;不论是插槽还是焊贴的设备,请在原理图上找到该引脚,并正确配置。否则无法实现休眠唤醒对主机的信号通知。

## 4. Menuconfig配置

```text
CONFIG_PCIE_DW_ROCKCHIP_EP=y
# CONFIG_STRICT_DEVMEM is not set   #建议开发阶段关闭STRICT_DEVMEM限制，⽅便使⽤io命令调试
```

## 5. 设备驱动配置

PCIe EP(Endpoint)设备驱动是运行在Root Complex(RC)侧的驱动程序,用于控制总线上的数据传输,并为应用层提供所需的内核接口。RK RC Kconfig配置

```text
CONFIG_PCIE_FUNC_RKEP=y
```

通用RC-FUNC驱动RK Chips Connect开发包支持KO编译,详细参考 chips_connect/patch-kernelx.xx/通用RC-FUNC驱动/ 。

## 6. 其他软件开发配置

### 6.1 软件开发须知

EP卡部分软件配置为关联配置,如做修改应修改所有关联处,如关于Bar大小配置:PCIe Bin阶段-Bar大小配置(双存储方案)SPL阶段-Bar大小配置

<!-- Source PDF p.11 -->

### 6.2 PCIe Bin阶段配置

PCIe bin仅支持完成PCIe控制器EP mode功能的初始化,且早于dram.bin初始化。提供编译完成的pcie.bin以及源码供自定义修改,pcie.bin存放在SDK/rkbin/bin/rkxx/对应文件下,源码路径如下:patch-*/bootloader建议客戶直接修改pcie.bin配置,除非特殊修改再去通过源码自定义编译。

#### 6.2.1 动态配置pcie.bin

pcie.bin支持直接修改bin文件中预留的配置空间从而实现常用的PCIe配置变换,目前已经实现以下配置修改:PCIe GenerationPCIe lanespcie.bin串口波特率PCIe vendor idPCIe device id修改用脚本为 rkbin/tools/pcie_idb_config.sh文,命令介绍:

```text
./tools/pcie_idb_config.sh <soc> <gen> <lanes> <uart_baundary> <vid_l> <vid_h> <did_l> <did_h> <input>
like following:
./tools/pcie_idb_config.sh RK3588 3 4 1500000 87 1d 6a 35 bin/rk35/rk3588_pcie_v*.bin
#vid=0x1d87 did=0x356a
./tools/pcie_idb_config.sh RK3588 3 2 1500000 87 1d 6a 35 bin/rk35/rk3588_pcie_v*.bin
./tools/pcie_idb_config.sh RK3588 3 1 1500000 87 1d 6a 35 bin/rk35/rk3588_pcie_v*.bin
./tools/pcie_idb_config.sh RK3588 3 4 115200  87 1d 6a 35 bin/rk35/rk3568_pcie_v*.bin
./tools/pcie_idb_config.sh RK3568 3 2 1500000 87 1d 6a 35 bin/rk35/rk3588_pcie_v*.bin
```

若以上开放配置不满足需求,客戶可以修改源码自定义功能。

#### 6.2.2 源码编译pcie.bin

源码依赖 rkbin 内的工具,要求源码解压缩在 rkbin/ 同级目录进行开发,或者直接修改 tools/mk_pcie_idb.sh 里boot_merger 和 programmer_image_tool 工具路径编译工具链从src/platform/common/GCC/Cortex-A.mk中确认工具链:

<!-- Source PDF p.12 -->

```text
#############################################################################
# Cross compiler
#############################################################################
ifneq ($(wildcard ${ROOT_PATH}/../prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.2-2020.11-x86_64-aarch64-none-linux-gnu/bin),)
CROSS_COMPILE   ?= ${ROOT_PATH}/../prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.2-2020.11-x86_64-aarch64-none-linux-bin/aarch64-none-linux-gnu-else ifeq ($(wildcard /opt/prebuilts/gcc/linux-x86/aarch64/arm-gnu-toolchain-11.3.rel1-x86_64-aarch64-none-linux-gnu/bin),)
CROSS_COMPILE   ?= /opt/prebuilts/gcc/linux-x86/aarch64/arm-gnu-toolchain-11.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-else
CROSS_COMPILE   ?= aarch64-none-linux-gnu-endif
```

编译命令RK3588:

```text
./tools/mk_pcie_idb.sh RK3588
```

RK3568:

```text
./tools/mk_pcie_idb.sh RK3588
```

输出文件:pcie_idb.img

##### 6.2.2.1 BSP配置

以RK3588为例,源码src/platform/RK3588/bsp/platform.h

```text
#define BOOT_USING_UART_BAUD 1500000                      // 修改波特率，⽀持1500000或115200
```

##### 6.2.2.2 BAR默认配置

源码src/driver/pcie/pcie_ep.cDemo使用如下默认配置,除了BAR4,项目可以根据实际需求进行修改:BAR0: 32bits 4MB,命令流;BAR2: 64bits 64MB,数据流;BAR4:32bits 1MB,EP端PCIe寄存器,不可修改;其中BAR4的offset映射如下,可以通过RC端直接操作对应寄存器:0: DMA0x2000: iATU

<!-- Source PDF p.13 -->

0x20000: MSI-X table

##### 6.2.2.3 BAR大小配置

在PCIe_EP_Init()完成BAR的size配置,通过控制器的resize BAR功能实现。配置BAR SIZE,(bar_id * 0x8)指定目标Bar ID,bit[13:8]用于配置BAR size,结果为2^n,所以支持1MB(2^0)到8EB(2^20),以下为Bar0~5配置:

```text
writel(0x2c0, resbar_base + 0x8 + 0 * 0x8);
writel(0x2c0, resbar_base + 0x8 + 1 * 0x8);
writel(0x6c0, resbar_base + 0x8 + 2 * 0x8);
writel(0x6c0, resbar_base + 0x8 + 3 * 0x8);
writel(0x0c0, resbar_base + 0x8 + 4 * 0x8); /* wired register */
writel(0x6c0, resbar_base + 0x8 + 5 * 0x8);
```

配置BAR属性,选择已定义的宏进行配置,支持32bit和64bit,是否PREFETCH:

```text
    rockchip_pcie_ep_set_bar_flag(dbi_base, 0, PCI_BASE_ADDRESS_MEM_TYPE_32);
    rockchip_pcie_ep_set_bar_flag(dbi_base, 2, PCI_BASE_ADDRESS_MEM_PREFETCH |
PCI_BASE_ADDRESS_MEM_TYPE_64);
    rockchip_pcie_ep_set_bar_flag(dbi_base, 4, PCI_BASE_ADDRESS_MEM_TYPE_32);
```

关掉不使用的BAR:

```text
//writel(0x0, dbi_base + 0x100000 + 0x10 + 0 * 4);
writel(0x0, dbi_base + 0x100000 + 0x10 + 1 * 4); /* BAR1 disabled */
//writel(0x0, dbi_base + 0x100000 + 0x10 + 2 * 4);
//writel(0x0, dbi_base + 0x100000 + 0x10 + 3 * 4);
//writel(0x0, dbi_base + 0x100000 + 0x10 + 4 * 4);
writel(0x0, dbi_base + 0x100000 + 0x10 + 5 * 4);  /* BAR5 disabled */
```

须知:映射PCIe Bin阶段-Bar大小配置 为关联配置,应同时修改:PCIe Bin阶段-Bar大小配置(双存储方案)SPL阶段-Bar大小配置Kernel阶段-Bar大小配置

##### 6.2.2.4 BAR映射配置

以 RK3588 为例,源码 src/platform/RK3588/bsp/platform.h

```text
#define BOOT_USING_PCIE_EP_BAR0_CPU_ADDRESS 0x3C000000    // 调整Bar0映射地址
```

代码中实现:

<!-- Source PDF p.14 -->

```text
HAL_PCIE_InboundConfig(pcie, 0, 0, BOOT_USING_PCIE_EP_BAR0_CPU_ADDRESS);
```

须知:PCIe.bin阶段-Bar映射配置与Kernel阶段配置独立,可根据需求映射不同空间

##### 6.2.2.5 PHY模式配置

RK3588 默认 phy0/1 为合并使用以支持 Gen3x4,可支持拆分为 Gen3x2、Gen3x2、Gen3x1,配置如下:RK3588 PCIe PHY 3x2实例:

```text
diff --git a/src/hal/lib/bsp/RK3588/hal_bsp.c b/src/hal/lib/bsp/RK3588/hal_bsp.c
index 4a6c2e6..f03995b 100644
--- a/src/hal/lib/bsp/RK3588/hal_bsp.c
+++ b/src/hal/lib/bsp/RK3588/hal_bsp.c
@@ -123,7 +123,7 @@ const struct HAL_UART_DEV g_uart9Dev =
 #ifdef HAL_PCIE_MODULE_ENABLED
 const struct HAL_PHY_SNPS_PCIE3_DEV g_phy_pcie3Dev =
 {
-    .phyMode = PHY_MODE_PCIE_AGGREGATION,
+    .phyMode = PHY_MODE_PCIE_NANBNB,
 };

 struct HAL_PCIE_DEV g_pcieDev =
```

RK3588 PCIe PHY 3x1实例:

```text
diff --git a/src/hal/lib/bsp/RK3588/hal_bsp.c b/src/hal/lib/bsp/RK3588/hal_bsp.c
index 4a6c2e6..f03995b 100644
--- a/src/hal/lib/bsp/RK3588/hal_bsp.c
+++ b/src/hal/lib/bsp/RK3588/hal_bsp.c
@@ -123,7 +123,7 @@ const struct HAL_UART_DEV g_uart9Dev =
 #ifdef HAL_PCIE_MODULE_ENABLED
 const struct HAL_PHY_SNPS_PCIE3_DEV g_phy_pcie3Dev =
 {
-    .phyMode = PHY_MODE_PCIE_AGGREGATION,
+    .phyMode = PHY_MODE_PCIE_NABIBI,
 };

 struct HAL_PCIE_DEV g_pcieDev =
```

<!-- Source PDF p.15 -->

#### 6.2.3 PCIe Bin打包烧写

##### 6.2.3.1 工具烧写

1. pcie.bin转pcie_idb.img

```text
#⽣成 loader
./tools/boot_merger RKBOOT/RK3588MINIALL_PCIE_EP.ini
$git:(master) $ ls rk3588_pcie_loader_v1.00.bin
rk3588_pcie_loader_v1.00.bin

#spinand 制作 idb，要求使⽤ spinand type 做对⻬
./tools/programmer_image_tool -i rk3588_pcie_loader_v1.00.bin -b 128 -p 2 -t spinand -o ./
#emmc
./tools/programmer_image_tool -i rk3588_pcie_loader_v1.00.bin -t emmc -o ./

#制作双备份的 pcie_idb.img
cat idblock.img > pcie_idb.img
cat idblock.img >> pcie_idb.img
rm idblock.img
```

2. 分立烧写工具添加pcie_idb分区,emmc flash起始地址:0x40;spi flash起始地址:0x100;修改烧写工具配置文件,烧写工具目录下config.ini使能配置:CLOSE_CHECK_IDB=TRUE板子进入Maskrom模式,工具点击烧写

3. 完整包烧写修改分区表添加pcie_idb分区,如下是emmc分区,spi nand只是地址不同

```text
CMDLINE:
mtdparts=rk29xxnand:0x00000400@0x00000040(pcie_idb),0x00000800@0x00002000(security),0x00002000@0x00004000(uboot),0x00010000@0x00006000(boot),0x00064000@0x00016000(rootfs),-@0x0007a000(userdata:grow)
```

修改package-file,tools/linux/Linux_Pack_Firmware/rockdev/rk3588-package-file-nvr-emmc / spi-nand

```text
package-file    package-file
bootloader      Image/MiniLoaderAll.bin
pcie_idb        Image/pcie_idb.img    #添加pcie_idb⽂件
parameter       Image/parameter.txt
uboot           Image/uboot.img
boot            Image/boot.img
rootfs          Image/rootfs.img
userdata        Image/userdata.img
```

执行build_emmc.sh 编译update.img烧写

<!-- Source PDF p.16 -->

##### 6.2.3.2 烧录器烧写

参考EP卡固件烧录

### 6.3 SPL阶段配置

#### 6.3.1 Kconfig配置

本功能在SPL中有一下三个Kconfig项,对于需要EP Boot功能的产品需要全部选上,对于不需要EP Boot功能的产品只需要选上SPL_PCIE_EP_SUPPOR即可。

```text
CONFIG_SPL_PCIE_EP_SUPPORT=y
CONFIG_SPL_RAM_SUPPORT=y
CONFIG_SPL_RAM_DEVICE=y
```

#### 6.3.2 BAR默认配置

Demo使用如下默认配置,除了BAR4,项目可以根据实际需求进行修改:BAR0: 32bits 4MB,命令流;BAR2: 64bits 64MB,数据流;BAR4:32bits 1MB,EP端PCIe寄存器,不可修改;其中BAR4的offset映射如下,可以通过RC端直接操作对应寄存器:0: DMA0x2000: iATU0x20000: MSI-X table

#### 6.3.3 BAR大小配置

在pcie_bar_init()完成BAR的size配置,通过控制器的resize BAR功能实现。配置BAR SIZE,offset+0x8寄存器,bit[13:8]用于配置BAR size,结果为2^n,所以支持1MB(2^0)到8EB(2^20):

```text
/* Resize BAR0 to support 4M 32bits */
resbar_base = dbi_base + 0x2e8;
writel(0xfffff0, resbar_base + 0x4);
writel(0x2c0, resbar_base + 0x8);
/* BAR2: 64M 64bits */
writel(0xfffff0, resbar_base + 0x14);
writel(0x6c0, resbar_base + 0x18);
/* BAR4: Fixed for EP wired register, 2M 32bits */
writel(0xfffff0, resbar_base + 0x24);
writel(0xc0, resbar_base + 0x28);
```

<!-- Source PDF p.17 -->

配置BAR属性,选择已定义的宏进行配置,支持32bit和64bit,是否PREFETCH:

```text
        rockchip_pcie_ep_set_bar_flag(dbi_base, 0, PCI_BASE_ADDRESS_MEM_TYPE_32);
        rockchip_pcie_ep_set_bar_flag(dbi_base, 2, PCI_BASE_ADDRESS_MEM_PREFETCH |
PCI_BASE_ADDRESS_MEM_TYPE_64);
        rockchip_pcie_ep_set_bar_flag(dbi_base, 4, PCI_BASE_ADDRESS_MEM_TYPE_32);
```

关掉不使用的BAR:

```text
/* Close bar1 bar3 bar5 */
writel(0x0, dbi_base + 0x100000 + 0x14);
//writel(0x0, dbi_base + 0x100000 + 0x18);
writel(0x0, dbi_base + 0x100000 + 0x1c);
//writel(0x0, dbi_base + 0x100000 + 0x20);
writel(0x0, dbi_base + 0x100000 + 0x24);
/* Close ROM BAR */
writel(0x0, dbi_base + 0x100000 + 0x30);
```

须知:SPL 阶段-Bar大小配置为关联配置,应同时修改:PCIe Bin阶段-Bar大小配置(双存储方案)SPL阶段-Bar大小配置Kernel阶段-Bar大小配置

#### 6.3.4 BAR映射配置

每个BAR对应的空间,通过pcie_inbound_config()配置映射到内部的内存地址区域,可以修改RKEP_BAR0_ADDR,RKEP_BAR2_ADDR的宏定义来修改要映射的目标地址。

```text
/* BAR0: RKEP_BAR0_ADDR */
writel(RKEP_BAR0_ADDR, base + PCIE_ATU_CPU_ADDR_LOW);
writel(0, base + PCIE_ATU_CPU_ADDR_HIGH);
writel(0, base + PCIE_ATU_UNR_REGION_CTRL1);
/* PCIE_ATU_UNR_REGION_CTRL2 */
writel(PCIE_ATU_ENABLE | PCIE_ATU_BAR_MODE_ENABLE | (0 << 8),
       base + PCIE_ATU_UNR_REGION_CTRL2);
```

须知:SPL阶段-Bar映射配置与Kernel阶段配置独立,可根据需求映射不同空间

#### 6.3.5 PHY模式配置

Demo默认使用的是0xfe150000控制器PCIe3x4模式,也就是PHY也是4lane模式,由于PHY是支持拆分的,如果方案需要修改为其他模式,可以修改pcie_cru_init()的对应配置, 如PCIe工作于2lane+2lane模式可以将PHY_MODE_PCIE_AGGREGATION修改为PHY_MODE_PCIE_NANBNB或其他:

<!-- Source PDF p.18 -->

RK3588 PCIe PHY 3x2实例:

```text
diff --git a/arch/arm/mach-rockchip/spl_pcie_ep_boot.c b/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
index 8b054d91558..54f9d22cde2 100644
--- a/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
+++ b/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
@@ -384,7 +384,7 @@ static void pcie_board_init(void)
 #define PHY_MODE_PCIE_NABINB   2       /* P1:PCIe3x1*2 + P0:PCIe3x2 */
 #define PHY_MODE_PCIE_NABIBI   3       /* P1:PCIe3x1*2 + P0:PCIe3x1*2 */

-#define PHY_MODE_PCIE                  PHY_MODE_PCIE_AGGREGATION
+#define PHY_MODE_PCIE                  PHY_MODE_PCIE_NANBNB

 #define CRU_BASE_ADDR                  0xfd7c0000
 #define CRU_SOFTRST_CON32              (CRU_BASE_ADDR + 0x0a80)
```

RK3588 PCIe PHY 3x1实例:

```text
diff --git a/arch/arm/mach-rockchip/spl_pcie_ep_boot.c b/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
index 8b054d91558..54f9d22cde2 100644
--- a/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
+++ b/arch/arm/mach-rockchip/spl_pcie_ep_boot.c
@@ -384,7 +384,7 @@ static void pcie_board_init(void)
 #define PHY_MODE_PCIE_NABINB   2       /* P1:PCIe3x1*2 + P0:PCIe3x2 */
 #define PHY_MODE_PCIE_NABIBI   3       /* P1:PCIe3x1*2 + P0:PCIe3x1*2 */

-#define PHY_MODE_PCIE                  PHY_MODE_PCIE_AGGREGATION
+#define PHY_MODE_PCIE                  PHY_MODE_PCIE_NABIBI

 #define CRU_BASE_ADDR                  0xfd7c0000
 #define CRU_SOFTRST_CON32              (CRU_BASE_ADDR + 0x0a80)
```

#### 6.3.6 EP Boot配置

原理介绍中提到EP会等待固件并运行固件,涉及跟RC间的固件下载协议和BootLoader前后级的固件位置约定。固件的下载函数pcie_wait_for_fw()和后级固件位置约定函数pcie_update_atags(), 可以通过下文提到的地址来做对应修改,请务必保证RC与EP约定的命令和地址一致,BootLoader前后级约定的固件位置一致,才能顺利完成整个固件的下载和启动过程。如果不理解全过程,请勿修改。跟RC间的固件下载协议内容是,先按要求把固件下载到指定位置,然后发送运行固件命令。

1. 固件下载位置约定下载两个固件

<!-- Source PDF p.19 -->

| 固件名 | 打包格式 | 内容 | 下载地址 |
| --- | --- | --- | --- |
| uboot.img | FIT | ATF和U-Boot | BAR2+0 |
| boot.img | FIT | Kernel、DTB、ramdisk | BAR2+0x400000 |

2. 运行固件命令

| 命令名称 | 命令位置 | 命令值 | 操作 |
| --- | --- | --- | --- |
| CMD_LOADER_RUN | BAR0 + 0x400 | 0x524b4501 | 运行下载的固件 |

从RC下载过来的两个固件,其中uboot.img会被SPL(运行EP Boot的环境)直接解析并运行,然后通过一个RK自定义的RAM_PARTITION来传递boot.img的位置给U-Boot。pcie_update_atags()函数定义了boot分区在RAM的其实地址和SIZE,由于默认使用的BAR2是64M,其中起始4M分给了uboot.img,后续的60M分给了boot.img,这是为了方便RC端直接通过CPU从BAR2把固件写过来,如果size不够,可以在RC端调用EP的dma来下载固件,这样size不受BAR2大小限制,需要注意同步更新RAM_PARTITION中的size配置。

#### 6.3.7 SRNS配置

对于可以使用SRNS模式参考时钟的方案,需要打开相关配置,打开配置后EP端会使用内部的100MHz时钟作为参考时钟,不依赖外部提供的时钟。在代码中直接打开如下宏配置即可:

```text
/* SRNS: Use Seperate refclk(internal clock) instead of from RC */
// #define PCIE_ENABLE_SRNS_PLL_REFCLK
```

须知:SPL 阶段-SRNS配置为关联配置,应同时修改:PCIe Bin阶段-SRNS配置(双存储方案)SPL阶段-SRNS大小配置Kernel阶段-SRNS配置

### 6.4 Kernel阶段配置

#### 6.4.1 BAR大小配置

在rockchip_pcie_resize_bar完成BAR的size配置,通过控制器的resize BAR功能实现。配置BAR SIZE,offset+0x8寄存器,bit[13:8]用于配置BAR size,结果为2^n,所以支持1MB(2^0)到8EB(2^20),配置BAR属性,选择已定义的宏进行配置,支持32bit和64bit,是否PREFETCH:

```text
/* Resize BAR0 4M 32bits, BAR2 64M 64bits-pref, BAR4 1MB 32bits */
bar = BAR_0;
dw_pcie_writel_dbi(pci, resbar_base + 0x4 + bar * 0x8, 0xfffff0);
dw_pcie_writel_dbi(pci, resbar_base + 0x8 + bar * 0x8, 0x2c0);
rockchip_pcie_ep_set_bar_flag(rockchip, bar, PCI_BASE_ADDRESS_MEM_TYPE_32);

bar = BAR_2;
dw_pcie_writel_dbi(pci, resbar_base + 0x4 + bar * 0x8, 0xfffff0);
dw_pcie_writel_dbi(pci, resbar_base + 0x8 + bar * 0x8, 0x6c0);
rockchip_pcie_ep_set_bar_flag(rockchip, bar,PCI_BASE_ADDRESS_MEM_PREFETCH |
PCI_BASE_ADDRESS_MEM_TYPE_64);

bar = BAR_4;
dw_pcie_writel_dbi(pci, resbar_base + 0x4 + bar * 0x8, 0xfffff0);
dw_pcie_writel_dbi(pci, resbar_base + 0x8 + bar * 0x8, 0xc0);
rockchip_pcie_ep_set_bar_flag(rockchip, bar, PCI_BASE_ADDRESS_MEM_TYPE_32);
```

关掉不使用的BAR:

```text
/* Disable BAR1 BAR5*/
bar = BAR_1;
dw_pcie_writel_dbi(pci, PCIE_TYPE0_HDR_DBI2_OFFSET + 0x10 + bar * 4, 0);
bar = BAR_5;
dw_pcie_writel_dbi(pci, PCIE_TYPE0_HDR_DBI2_OFFSET + 0x10 + bar * 4, 0);
```

须知:Kernel阶段-Bar大小配置为关联配置,应同时修改:PCIe Bin阶段-Bar大小配置(双存储方案)SPL阶段-Bar大小配置Kernel阶段-Bar大小配置Kernel阶段-Bar映射配置与SPL阶段配置独立,可根据需求映射不同空间

#### 6.4.2 BAR映射配置

每个BAR对应的空间,通过配置映射到内部的内存地址区域,可以修改dts来修改要映射的目标地址。

```text
reserved-memory {
       #address-cells = <2>;
       #size-cells = <2>;
       ranges;
       bar0_region: bar0-region@3c000000 {
                reg = <0x0 0x3c000000 0x0 0x00400000>;
       };
       bar2_region: bar2-region@40000000 {
                reg = <0x0 0x40000000 0x0 0x04000000>;
       };
};
```

说明:支持新增bar1/bar5映射内存地址,同时自动使能bar1/5,如果使用PCIe Bin/SPL初始化PCIe,需参考“BAR大小配置”注释掉bar1/5 disabeld代码

<!-- Source PDF p.21 -->

#### 6.4.3 SRNS配置

SRNS配置为补丁形式添加,请从开发包中获取补丁文件 0001-TEST-kernel5.10-rk3588-SRNS.patchKernel 阶段-SRNS配置为关联配置,应同时修改:PCIe Bin阶段-SRNS配置(双存储方案)SPL阶段-SRNS大小配置Kernel阶段-SRNS配置

### 6.5 EP卡固件编译

参考patch目录说明打上对应补丁后根据场景选择对应的编译说明:Flash Boot - 集成PCIe Bin软件方案单存储:增加pcie_idb分区,升级pcie_idb.img镜像增加normal_idb分区,升级normal_idb.img镜像,由MiniLoaderAll.bin自动升级其余镜像同普通固件一样不需要其它特殊配置,直接编译出各个分区img以及update.img。双存储,参考《Rockchip_Developer_Guide_Dual_Storage_CN.pdf》文档“RK PCIe EP 双存储方案”相关章节说明。SDK默认不支持把双存储固件打包成update.img,需要借助tools目录下的dual_storage工具打包,参考tools/dual_storage/README.txt说明把各个分区img固件拷⻉到对应目录下,执行build.sh即可把分立img打包成update.img。Flash Boot - 集成PCIe Bin及EP Boot软件方案对接通用PC:增加pcie_idb分区,升级pcie_idb.img镜像增加normal_idb分区,升级normal_idb.img镜像,由MiniLoaderAll.bin自动升级其余固件由上位机推送对接RK RC:可省略PCIe Bin集成,仅SPL实现EP Boot功能,EP卡存储器件仅储存Miniloader镜像其余固件由上位机推送Common Boot和普通固件一样不需要其它特殊配置,直接编译出各个分区img以及update.img。

<!-- Source PDF p.22 -->

### 6.6 EP卡固件烧录

单存储单存储方案固件烧写和正常固件烧写方式一致,参考各芯片发布文档刷机说明章节即可。双存储详细参考 《Rockchip_Developer_Guide_Dual_Storage_CN.pdf》文档”RK PCIe EP 双存储方案固件打包“章节。

### 6.7 EP卡OTA

分区升级原理都是通过分区表信息让内核创建对应的设备节点,上层通过写入/dev/下的设备节点,来实现更新分区的功能。OTA升级可以使用RK方案通过recovery模式进行分区更新,或者使用自定义方案,只需要写入/dev/下的设备节点。

1. Flash Boot - 集成PCIe Bin软件方案OTA单存储单存储方案OTA和正常固件方式一致,参考docs\Linux\Recovery\Rockchip_Developer_Guide_Linux_Recovery_CN.pdf章节更新即可。双存储详细参考 《Rockchip_Developer_Guide_Dual_Storage_CN.pdf》文档”RK PCIe EP 双存储方案 OTA 升级 “章节。

2. Flash Boot - 集成PCIe Bin及EP Boot软件方案OTAEP Boot方案只有loader分区,需要在分区表中添加loader分区信息。Nor:可以参考EP卡OTA-&gt;双存储章节-&gt;Nor配置 Uboot分区配置。EMMC:可以参考EP卡OTA-&gt;双存储章节-&gt;EMMC配置,直接在分区表添加loader信息。RK OTA方案不支持单独升级loader,需要自定义实现。不推荐对loader分区进行升级,⻛险较高。注意:MiniLoaderAll.bin和parameter.txt 不能直接写到/dev/下的设备节点,需要转成二进制文件才能写入。

## 7. 常⻅问题处理

### 7.1 EP卡启动异常排查

EP卡SPL阶段打印

<!-- Source PDF p.23 -->

```text
U-Boot SPL board init
RKEP: Init PCIe EP
RKEP: 175301 - PHY Mode 0x4
RKEP: 176542 - RefClock in common clock_mode
RKEP: 187578 - BAR0: 0x3c000000
RKEP: 187848 - BAR2: 0x010000000
RKEP: 188227 - init PCIe fast Link up
RKEP: 208576 - Link up 230011
RKEP: 243683 - Done
```

问题简单分析:如设备仅运行到"RKEP: Init PCIe EP",通常为枚举fail,请确认EP卡的参考时钟、12V供电是否正常,PERST#是否释放EP卡Kernel阶段打印

```text
[root@RK3588:/]# dmesg | grep pci
[    3.371073] rk-pcie-ep fe150000.pcie: bar0: assigned [0x3c000000-3c3fffff]
[    3.371890] rk-pcie-ep fe150000.pcie: bar2: assigned [0x40000000-43ffffff]
[    3.371901] rk-pcie-ep fe150000.pcie: no vpcie3v3 regulator found
[    3.371918] rk-pcie-ep fe150000.pcie: already linkup
[    3.372001] rk-pcie-ep fe150000.pcie: register misc device pcie_ep
[    3.725930] ehci-pci: EHCI PCI platform driver
[    3.869983] pcie30_avdd1v8: supplied by avcc_1v8_s0
[    3.870541] pcie30_avdd0v75: supplied by avdd_0v75_s0
```

EP卡设备驱动打印内核模块:

```text
rk3588_s:/ # dmesg | grep rkep
[    2.278964] pcie-rkep 0000:01:00.0: success to request msi irq
    # 成功申请MSI 中断 log
[    2.280601] pcie-rkep 0000:01:00.0: successfully allocate continuouse buffer for
userspace   # 成功预留⽤⼾内存，默认不开
[    2.280619] pcie-rkep 0000:01:00.0: vid=1d87
    # 正常访问EP卡config空间
[    2.280625] pcie-rkep 0000:01:00.0: did=356a
[    2.280629] pcie-rkep 0000:01:00.0: obj_info magic=524b4550, ver=100
    # 正常访问EP卡bar空间
```

### 7.2 异常处理

实际产品在使用过程中,会因为系统稳定性或者外部环境干扰等各种原因,导致一些异常,PCIe的物理设计机制已经能够进行一定程度的抗干扰,比如每一层协议有增加CRC,在出错时有重传机制,保证控制器输出的数据本身一定是没有错误的数据,如果发生仅通过PCIe控制器无法恢复的问题,则需要更多手段来保障设备的运行。

<!-- Source PDF p.24 -->

#### 7.2.1 EP状态信息

在软件上,建议在EP运行一个小程序用来表征EP设备当前的健康状态,可以通过tick进行简单更新,这样在RC端可以通过读取EP的健康状态来确定设备是否正常工作。我们在Demo的BAR0中预留了一段空间用来配合实现EP健康状态信息的更新和查询。

#### 7.2.2 Watchdog

RK3588带有watchdog,可以在系统异常的时候自动复位。watchdog可以考虑加在健康状态信息程序中进行喂狗,系统异常时复位系统。这种情况比较可能的是EP端的PCIe模块本身工作异常,但是系统其它模块发生异常导致系统卡住,无法正常运行健康状态信息更新程序。如果EP端因系统异常主动进行复位,那么RC的软件层是不知道的,在EP完成复位后PCIe物理层会自动进行重连,但是RC扫描过程配置到EP的寄存器如BAR地址等,需要EP自行恢复,才能跟RC继续通讯。

#### 7.2.3 Hot Reset

Host Reset是PCIe定义的信号,通过普通数据线传输实现,EP端控制器可以检测到该信号彬触发中断,需要注意的是HotReset在控制器硬件会自动进行响应,复位掉BAR相关的寄存器,所以在收到Hot Reset的中断处理中需要做一次EP的初始化,保证BAR和ATU配置正确。

#### 7.2.4 Warm Reset(PERST)

PERST是PCIe模块的独立复位信号,观察发现在x86的重启过程中会拉PERST信号,但是不会对PCIe Slot的供电进行重新上下电,所以EP端需要保证PERST时能够进行完整复位,在RK平台的具体做法就是按我们建议之间接到RK3588芯片和PMIC的NPOR信号,目标是达到跟上电复位一样的效果。如果部分产品对于RC端可控,对上电复位要求没有那么高,PERST可以作为一个可中断的GPIO,在中断触发时通过软件配置RK3588芯片的global reset进行全局复位。

#### 7.2.5 Cold Reset(Power On Reset)

上电复位对应设备的开机流程。

#### 7.2.6 RK芯片互联独立供电方案复位、休眠唤醒处理

软硬件要求RC设备要求实现PMU IO域内的WAKE# GPIO信号,独立于PCIe框架单独实现GPIO唤醒功能RC设备要求增⻓"rockchip,wait-for-link-ms"枚举延⻓时间,以应对EP板卡上电时序,视EP板卡具体启动时间决定,参考“Rockchip_Developer_Guide_PCIe_CN.pdf”手册相关配置EP板卡要求实现WAKE# GPIO信号,参考“Kernel阶段配置”章节的“RK芯片互联独立供电方案特殊配置”EP板卡要求实现PERST# GPIO信号,参考“Kernel阶段配置”章节的“RK芯片互联独立供电方案特殊配置”

<!-- Source PDF p.25 -->

EP板卡建议接出复位控制信号,作为边界问题的硬件复位机制EP板卡建议使能Watchdog,作为边界问题的软件复位机制,详细参考“Watchdog“章节该方案有较多软硬件定制化处理流程,要求做专项拷机流程该方案为RK参考方案,可根据自身项目经验和业务需求进一步优化复位流程简介RC复位,EP保持供电:RC用戶层通知EP,用戶层业务反初始化,参考“软件消息通知机制”章节RC复位用戶层业务重新初始化RC保持供电,EP复位:RC用戶层通知EP,用戶层业务反初始化,参考“软件消息通知机制”章节EP复位用戶层业务重新初始化,包括RC执行PCIe rescan命令休眠唤醒流程简介RC休眠唤醒,EP保持供电:RC用戶层通知EP,用戶层业务反初始化,参考“软件消息通知机制”章节RC休眠唤醒用戶层业务重新初始化,包括RC执行PCIe rescan命令RC保持供电,EP休眠唤醒:EP用戶层通知RC,用戶层业务反初始化,参考“软件消息通知机制”章节EP休眠唤醒用戶层业务重新初始化,包括RC执行PCIe rescan命令RC,EP同时休眠唤醒,建议先后休眠唤醒,例如RC休眠-&gt;EP休眠-&gt;EP唤醒-&gt;RC唤醒EP通知RC进入休眠EP使用WAKE#信号唤醒RC

{% endraw %}
