---
title: "Rockchip Linux Flash Open-Source Solution: Complete Developer Guide"
description: "Rockchip Linux Flash Open-Source Solution: Complete Developer Guide — NAND, NOR, MTD, UBIFS, JFFS2, OTA; V3.18.0."
translation_key: "103-rockchip-flash-open-source"
slug: "103-rockchip-flash-open-source"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: [ArmSoM, Rockchip, Flash, NAND, NOR, UBIFS, MTD]
excerpt: "Rockchip Linux Flash Open-Source Solution: Complete Developer Guide — NAND, NOR, MTD, UBIFS, JFFS2, OTA; V3.18.0."
---

{% raw %}

Based on the Chinese technical body of RK-KF-YF-314 V3.18.0, checked against the same-version English source. Scope: chips with FSPI (formerly SFC), Linux 4.4, 4.19, 5.10 and 6.1. The source describes early 4.4 SDK proprietary implementations and subsequent migration to open source; this is historical vendor context, not a guarantee for every ArmSoM BSP. Platform reference only: verify the board Flash type, wiring, Loader, SDK/BSP and kernel driver configuration. No ArmSoM hardware validation was performed. This language uses original English figures.

> Source conflicts: Chinese baseline as approved. In §5.3.1 NAND off\|partition is in bytes (page-aligned, excluding OOB), while count is a hexadecimal page count; the English source instead says page and byte respectively. Verify the actual U-Boot command implementation before execution. For ENV SPI NAND IDB, Chinese specifies blocks 1–3 and English 1–7; retain the Chinese values and verify the Loader. The source equation 5456KB + 4KB *256 =6456KB is inconsistent; 512B/s used for a sector unit and SPI NAND mentioned in a SPI NOR paragraph also need checking. Erase, programming and partition commands can permanently destroy data; none were executed.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

<!-- Chinese baseline PDF p.7 -->

## 1 Open-source solution notes

### 1.1 Solution features

Confirm the following open-source implementation features:

| Solution | Main supported flash types | Registered device types | Main supported filesystems | Supported programming methods |
| --- | --- | --- | --- | --- |
| SLC NAND open-source solution (parallel NAND) | SLC Nand | mtd devices, ubiblock | SquashFS、UBIFS | USB, SD-card and programmer updates |
| SPI NAND open-source solution | SPI Nand | mtd devices, ubiblock | SquashFS、UBIFS | USB, SD-card and programmer updates |
| SPI NOR open-source solution | SPI Nor | mtd devices, mtdblock devices | SquashFS、JFFS2 | USB, SD-card and programmer updates |

Main checks: selected flash-device type and whether the filesystem meets requirements.

### 1.2 NAND Flash selection

UBIFS images depend on the NAND device specifications and cannot be shared between devices with different page sizes or block sizes. NAND component specifications must remain consistent. SLC NAND in this document means parallel NAND.

### 1.3 Partition-extension support by chip

As described under Partition Configuration, the RK SDK adds special MTD partition extensions. Check the support for each chip:

<!-- Chinese baseline PDF p.8 -->

| Chip | GPT partition extension | ENV partition extension |
| --- | --- | --- |
| RK3308 | Y | N |
| RV1126 & RV1109 | Y | N |
| RK3568 & RK3566 | Y | N |
| RK3588 & RK3588s | Y (default) | Y (optional) |
| RV1106/RV1103 | N | Y |
| RK3528 | Y | N |
| RK3562 | Y | N |
| RK3576 | Y | N |
| RV1106B/RV1103B | N | Y |
| RK3506 | Y | N |

### 1.4 FSPI/SFC key features

Only SoCs using open-source storage are listed:

| SOC | FSPI/SFC IO rate | FSPI/SFCdata io lines | ROM ContRead support |
| --- | --- | --- | --- |
| RK3308 | <= 48MHz (recommended) | x1\x4 | N |
| RV1126 & RV1109 | <= 125MHz | x1\x4 | N |
| RK3568/RK3566 | <= 150MHz, fixed frequencies OSC\50\75\100\125\150 MHz | x1\x4 | N |
| RK3588/RK3588s | <= 150MHz | x1\x4 | N |
| RV1106/RV1103 | <= 150MHz; 125MHz and 150MHz supported, but intermediate frequencies unavailable because of divider limits | x1\x4 | N |
| RK3528 | <= 150MHz | x1\x4 | N |
| RK3562 | <= 150MHz | x1\x4 | N |
| RK3576 | <= 133MHz; limited to 125MHz by clock division | x1\x4 | Y |
| RV1106B/RV1103B | FSPI0 <= 133MHz,FSPI1 <= 125MHz | x1\x4 | Y |
| RK3506 | <= 133MHz | x1\x4 | Y |

Notes:

<!-- Chinese baseline PDF p.9 -->

The IP supports x4 and is compatible with x2, but the open-source framework does not support dual SPI. Although the IP supports higher frequencies, the SDK usually defaults to a lower rate; 80MHz is recommended, adjustable to the project and device limits. Quad SPI NAND normally supports up to 133MHz; Quad SPI NOR normally up to 133MHz, with some reaching 166MHz. Octal SPI Flash normally supports up to 200MHz. Near the device limit, measure the actual rate to detect overclocking and reduce the frequency as needed; matching the device specification against the oscilloscope-measured average rate is usually sufficient.

### 1.5 Partition extensions and IDB layout

#### 1.5.1 Partition-extension schemes

| Chip | GPT partition extension | ENV partition extension |
| --- | --- | --- |
| RK3308 | Default scheme (compatibility scheme 1) | N |
| RV1126/RV1109 | Default scheme (compatibility scheme 2) | N |
| RK3568/RK3566 | Default scheme | N |
| RK3588/RK3588s | Default scheme | N |
| RV1106/RV1103 | N | Default scheme |
| RK3528 | Default scheme | N |
| RK3562 | Default scheme | N |
| RK3576 | Default scheme | N |
| RV1106B/RV1103B | N | Default scheme |
| RK3506 | Default scheme | N |

See GPT Partition Extension IDB Planning for compatibility-scheme changes.

#### 1.5.2 ENV partition-extension IDB layout

| Storage type | idb start address | Multiple-copy requirements |
| --- | --- | --- |
| SLC Nand | 256KB | Two image copies required |
| SPI Nand | 256KB | Multiple image copies required |
| SPI Nor | 64KB | Two image copies required |

<!-- Chinese baseline PDF p.10 -->

#### 1.5.3 GPT partition-extension IDB layout

| Storage type | idb start address | Multiple-copy requirements |
| --- | --- | --- |
| SLC Nand | flash block size (128KB or 256KB) | Tool must support two copies; size aligned to flash block size |
| SPI Nand | flash block size (128KB or 256KB) | Tool must support two copies; size aligned to flash block size |
| SPI Nor | 64KB | Tool must support two copies; size aligned to 64KB |

PC upgrade tools support dual-copy IDB programming. Compatibility scheme 1: RK3308 SPI NOR IDB supports only one copy; SPI NAND blocks 1–8 form the multiple-IDB-copy region, holding up to five copies. Scheme 2: RV1126/RV1109 SPI NOR IDB starts at 32KB and supports only one copy.

## 2 Storage driver configuration

### 2.1 Basic SPL and U-Boot configuration

defconfig settings:

```text
// MTD 驱动⽀持
CONFIG_MTD=y
CONFIG_CMD_MTD_BLK=y
CONFIG_SPL_MTD_SUPPORT=y
CONFIG_MTD_BLK=y
CONFIG_MTD_DEVICE=y

// spi nand 驱动⽀持
CONFIG_MTD_SPI_NAND=y
CONFIG_ROCKCHIP_SFC=y
CONFIG_SPL_SPI_FLASH_SUPPORT=y
CONFIG_SPL_SPI_SUPPORT=y

// nand 驱动⽀持
CONFIG_NAND=y
CONFIG_CMD_NAND=y
CONFIG_NAND_ROCKCHIP=y /* NandC v6 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，0x00000801 */
//CONFIG_NAND_ROCKCHIP_V9=y  /* NandC v9 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x56393030, 例如：RK3326/PX30 为此版本 */
CONFIG_SPL_NAND_SUPPORT=y
CONFIG_SYS_NAND_U_BOOT_LOCATIONS=y

// spi nor 驱动⽀持
CONFIG_CMD_SF=y
CONFIG_CMD_SPI=y
CONFIG_SPI_FLASH=y
CONFIG_SF_DEFAULT_MODE=0x1
CONFIG_SF_DEFAULT_SPEED=50000000
CONFIG_SPI_FLASH_GIGADEVICE=y
CONFIG_SPI_FLASH_MACRONIX=y
CONFIG_SPI_FLASH_WINBOND=y
CONFIG_SPI_FLASH_MTD=y
CONFIG_ROCKCHIP_SFC=y
CONFIG_SPL_SPI_SUPPORT=y
CONFIG_SPL_MTD_SUPPORT=y
CONFIG_SPL_SPI_FLASH_SUPPORT=y
```

Remove rkflash/rknand macro settings:

```text
CONFIG_RKFLASH=n
CONFIG_RKNAND=n
```

Driver files:

```text
./drivers/mtd/nand/raw          //SLC Nand 主控驱动及协议层
./drivers/mtd/nand/spi          //SPI Nand 协议层
./drivers/spi/rockchip_sfc.c    //SPI Flash 主控驱动
./drivers/mtd/spi               //SPI Nor 协议层
```

For SPI NOR, consult drivers/mtd/spi/spi-nor-ids.c; the source calls the supported devices SPI NAND here, an apparent terminology inconsistency retained for review. For Winbound SPI NAND, consult drivers/mtd/nand/spi/winbond.c; other devices are in the same directory. Match the source by flash ID or package marking.

### 2.2 Basic kernel configuration

#### 2.2.1 SLC NAND

Framework overview:

| Solution | Main supported flash types | Controller driver | Flash framework |
| --- | --- | --- | --- |
| SLC NAND open-source solution | SLC Nand | drivers/mtd/nand/raw | drivers/mtd/nand/raw |

defconfig settings:

<!-- Chinese baseline PDF p.12 -->

```text
CONFIG_RK_NANDC_NAND=n   /* 不兼容 */
CONFIG_MTD_NAND_ROCKCHIP_V6=y /* NandC v6 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x00000801 */
# CONFIG_MTD_NAND_ROCKCHIP_V9=y /* NandC v9 可根据 TRM NANDC->NANDC_NANDC_VER 寄存器确认，
0x56393030 */
CONFIG_MTD_CMDLINE_PARTS=y
```

#### 2.2.2 SPI NOR/NAND

##### 2.2.2.1 Linux 4.19 and earlier

Framework overview:

| Solution | Main supported flash types | Controller driver | Flash framework |
| --- | --- | --- | --- |
| SPI NAND open-source solution | SPI Nand | drivers/rkflash | drivers/rkflash |
| SPI NOR open-source solution | SPI Nor | drivers/rkflash | drivers/rkflash |

defconfig settings:

```text
CONFIG_RK_FLASH=y

CONFIG_RK_SFC_NAND=y     /* SPI Nand flash */
CONFIG_RK_SFC_NAND_MTD=y /* SPI Nand flash 及其分区注册为 mtd 设备，不选中则注册为普通 block 设备
（rkflash0pn） */
CONFIG_RK_SFC_NOR=y      /* SPI Nor flash */
CONFIG_RK_SFC_NOR_MTD=y  /* SPI Nor flash 及其分区注册为 mtd 设备，不选中则注册为普通 block 设备
（rkflash0pn） */
CONFIG_MTD_CMDLINE_PARTS=y
```

DTS settings:

```text
&sfc {
    assigned-clocks = <&cru SCLK_SFC>; # 选择 dtsi sfc 设备节点中的 clk_sfc 对应时钟源修改 IO 速率
    assigned-clock-rates = <100000000>;
    status = "okay";
};
```

##### 2.2.2.2 Linux 5.10 and later

Framework overview:

<!-- Chinese baseline PDF p.13 -->

| Solution | Main supported flash types | Controller driver | Flash framework |
| --- | --- | --- | --- |
| SPI NAND open-source solution | SPI Nand | drivers/spi/spi-rockchip-sfc.c | drivers/mtd/nand/spi |
| SPI NOR open-source solution | SPI Nor | drivers/spi/spi-rockchip-sfc.c | drivers/mtd/spi-nor |

For Winbound SPI NOR, supported devices are listed in drivers/mtd/spi-nor/winbond.c; other vendors are in the same directory. For Winbound SPI NAND, use drivers/mtd/nand/spi/winbond.c and the same-directory files for other devices. Match flash ID or package marking. Software identifies the device by flash ID. When both its source configuration and the controller DTS bus-width are quad/octal, the driver selects quad/octal transfers. defconfig settings:

```text
CONFIG_SPI_ROCKCHIP_SFC=y
CONFIG_MTD_SPI_NAND=y
CONFIG_MTD_SPI_NOR=y
```

DTS settings:

```text
&fspi { # 旧平台节点命名为 sfc
    sfc-cs-gpios = <&gpio4 RK_PB0 GPIO_ACTIVE_LOW>, <&gpio4 RK_PA5 GPIO_ACTIVE_LOW>; # 扩展 gpio 为 CSN
    status = "okay";

    flash@0 {
        compatible = "spi-nand";    # compatible = "jedec,spi-nor"; for spinor
        reg = <0>;
        spi-max-frequency = <75000000>; # 修改 IO 速率
        spi-rx-bus-width = <4>;         # 阅读 "芯⽚ FSPI/SFC 关键特性" 确认⽀持的线宽
        spi-tx-bus-width = <1>;         # 阅读 "芯⽚ FSPI/SFC 关键特性" 确认⽀持的线宽，x4 软件⾃动降级为兼容性更好的 x1 传输
    };
};
```

### 2.3 Partition configuration

#### 2.3.1 MTD partition basics

The open-source flash solution registers storage as MTD devices and parses standard mtd partition information only. Upstream normally defines mtdparts in the kernel DTS cmdline.

<!-- Chinese baseline PDF p.14 -->

#### 2.3.2 GPT partition extension

Some RK SDKs parse GPT in U-Boot, generate MTD mtdparts information and pass it to the kernel through cmdline. Check chip support under the corresponding partition-extension section. GPT-to-mtdparts conversion is implemented in u-boot/drivers/mtd_blk.c. GPT is configured through a parameter file similar to MTD Partition, with four differences:

1. Set TYPE to GPT.

2. Do not define a parameter partition; if defined, it is unused.

3. Add the grow keyword to the last partition.

4. MTD does not require a rootfs UUID.

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000 (uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000 (misc),0x00008000@0x0000a000 (resource),0x00010000@0x00012000(kernel),0x00010000@0x00022000 (boot),0x00020000@0x00032000 (recovery),0x00038000@0x00052000(backup),0x00002000@0x0008a000 (security),0x000c0000@0x0008c000(cache),0x00300000@0x0014c000 (system),0x00008000@0x0044c000(metadata),0x000c0000@0x00454000 (vendor),0x00040000@0x00514000 (oem),0x00000400@0x00554000(frp),-@0x00554400 (userdata:grow)
```

GPT partition-table upgrade sequence:

1. Read partition definitions from parameter.

2. Obtain storage capacity from Loader.

3. Adjust the final partition size and create the GPT file.

4. Program the table at storage addresses 0 and -33 (end).

5. The parameter file itself is not written to storage.

#### 2.3.3 ENV partition extension

Some RK SDKs support an ENV partition with standard U-Boot environment variables passed to the kernel through cmdline. Check chip support in the partition-extension section. Create ENV images using ./tools/mkenvimage under U-Boot, with a custom configuration file such as env.txt:

<!-- Chinese baseline PDF p.15 -->

```text
mtdparts=spi-nand0:256K(env),256K@256K(idblock),4M(uboot),8M(boot),72M(rootfs),32M(userdata),-(media)
sys_bootargs=ubi.mtd=4 root=ubi0:rootfs rootfstype=ubifs
```

SPI NAND example: ./tools/mkenvimage -s 0x40000 -p 0x0 -o env.img env_.txt. SPI NOR example: ./tools/mkenvimage -s 0x10000 -p 0x0 -o env.img env.txt. Set sys_bootargs according to the actual SDK and its development manual.

#### 2.3.4 NAND partition planning

Reserve 3–4 flash blocks per SLC/SPI NAND partition for bad-block replacement, especially U-Boot. Above 10MB, increase the reserve using 4 + partition block count * 1%; for 128KB blocks and a 16MB oem partition (128 blocks), consider 5. Align partition starts to flash block size. Reserve the final four blocks globally for the bad-block table; exclude them from the last user partition. Including them creates four deliberately marked bad blocks and reduces usable capacity by four blocks. A much smaller image may still work, but including the table area remains discouraged.

### 2.4 Vendor Storage

Vendor Storage stores small nonsecure data such as SN/MAC. Define vnvm after IDB and before uboot, preferably four flash blocks: SPI NOR 256KB, SPI NAND 1MB (128KB/256KB compatible). parameter.txt examples: NOR 0x00000200@0x00000800(vnvm), NAND 0x00000800@0x00001800(vnvm). env.txt: NOR 256K@1M(vnvm), NAND 1M@3M(vnvm). U-Boot enables it with CONFIG_MTD_BLK = y; implementation arch/arm/mach-rockchip/vendor.c, interface ./arch/arm/include/asm/arch-rockchip/vendor.h. Kernel uses CONFIG_ROCKCHIP_MTD_VENDOR_STORAGE=y, drivers/soc/rockchip/mtd_vendor_storage.c and ./include/linux/soc/rockchip/rk_vendor_storage.h.

<!-- Chinese baseline PDF p.16 -->

PC tools, production tools and kernel userspace interfaces are supported; see Rockchip_Application_Notes_Storage_CN.pdf.

## 3 Customized solutions

### 3.1 Thunder Boot with SPI NAND Continuous Read Mode

Some SPI NAND families support continuous read without page-size limits, potentially increasing specific workloads from 20MB/s to about 50MB/s. RK integrates this into Thunder Boot: ROM loads through continuous read on supported SoCs (see Rom ContRead support under FSPI/SFC features); SPL also uses continuous read. usbplug replaces bad blocks during programming, allowing fast ramdisk continuous reads without checking ECC results before decompression. Other stages use conventional Buffer Read because small filesystem accesses do not benefit. Costs are higher. Reserve bbm_reserved at the flash end for bad-block mapping. For 1Gbit: blocks [0000,999] user/scan; [1000,1019] user/replay/bbm_reserved; [1020,1023] reserved/RK bbt. For 2Gbit: [0000,2003] user/scan; [2004,2043] user/replay/bbm_reserved; [2044,2047] reserved/RK bbt. For 4Gbit: [0000,4011] user/scan; [4012,4091] user/replay/bbm_reserved; [4092,4095] reserved/RK bbt. Whole-device remapping must happen as preprocessing, so programmer pre-burning is unsupported. For supported ROMs, select the rkbin loader packaging configuration ending _CONT_TB.ini.

<!-- Chinese baseline PDF p.17 -->

Enable CONFIG_SPI_NAND_CONT_READ in SPL/U-Boot. In the kernel enable the rockchip,thunder-boot-sfc node and CONFIG_ROCKCHIP_THUNDER_BOOT_SFC.

### 3.2 SPI NOR AUTO_MERGE software solution

#### 3.2.1 Introduction

RK SDK supports extra SPI NOR through cs-gpio, but the devices operate independently: PC tools program CS0 only, and SPL/U-Boot/Linux manage CS0/CS1 separately. AUTO_MERGE combines two SPI NORs into one virtual double-capacity device for PC tools and SPL/U-Boot/Linux. Both chips must be the same model. Single-chip hardware remains compatible, but the CS1N GPIO pin emits probing signals during boot. In fast-boot projects, preload firmware such as ramdisk must not span devices. usbplug_auto_merge is open source and built from U-Boot, but supports USB downloading only; UART requires a closed-source usbplug.bin rebuilt for the CS1 GPIO. Verify the following U-Boot patch:

```text
spi: rockchip_sfc: Support auto_merge

Change-Id: I4416b004d315f2f5689312b1eb53e36fce7f6bbf
Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

Verify the following kernel patch:

```text
spi: rockchip-sfc: Support sfc-cs-gpio

Change-Id: I24bfbf39ed7bea0596f299d3413159c7e2038ba8
Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese baseline PDF p.18 -->

#### 3.2.2 Basic configuration

Complete rv1103b configuration example: U-Boot DTS settings.

```text
&gpio1 {
+   u-boot,dm-spl;
    status = "okay";
};

&gpio2 {
+   u-boot,dm-spl;
    status = "okay";
};

&sfc {
+   sfc-cs-gpios= <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio2 RK_PA6 GPIO_ACTIVE_LOW>;
    u-boot,dm-spl;
    status = "okay";

@@ -104,6 +105,7 @@
        spi-tx-bus-width = <1>;
        spi-rx-bus-width = <4>;
        spi-max-frequency = <80000000>;
+       status = "disabled";
    };
```

U-Boot CS0/CS1 GPIO IOMUX settings.

```text
diff --git a/arch/arm/mach-rockchip/rv1103b/rv1103b.c b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
index 7353528afdd..8e30240076e 100644
--- a/arch/arm/mach-rockchip/rv1103b/rv1103b.c
+++ b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
@@ -252,9 +252,9 @@ int arch_cpu_init(void)
        writel(0x00000000, USBPHY_APB_BASE + USBPHY_FSLS_DIFF_RECEIVER);

+#ifdef CONFIG_SPI_FLASH_AUTO_MERGE
+       /* gpio1a5/gpio2a6 cs-gpio */
+       writel(0x00F00000, GPIO1_IOC_BASE + GPIO1A_IOMUX_SEL_1_0);
+       writel(0x0F000000, GPIO2_IOC_BASE + GPIO2A_IOMUX_SEL_1_1);
+#endif
 #endif
```

U-Boot defconfig settings.

```text
CONFIG_SPI_FLASH_AUTO_MERGE=y
CONFIG_SPL_GPIO_SUPPORT=y
```

Kernel DTS settings.

<!-- Chinese baseline PDF p.19 -->

```text
&fspi0 {
    sfc-cs-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA6 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&fspi_cs0n &fspi_cs1n>;
    status = "okay";

    flash@0 {
        compatible = "jedec,spi-nor";
        reg = <0>;
        spi-max-frequency = <75000000>;
        spi-rx-bus-width = <4>;
        spi-tx-bus-width = <1>;
    };
};

&pinctrl {
    fspi {
        fspi_cs0n: fspi-cs0n {
            rockchip,pins = <1 RK_PA5 RK_FUNC_GPIO &pcfg_pull_up>;
        };
        fspi_cs1n: fspi-cs1n {
            rockchip,pins = <1 RK_PA6 RK_FUNC_GPIO &pcfg_pull_up>;
        };
    };
};
```

Kernel defconfig settings.

```text
CONFIG_MTD_SPI_NOR_AUTO_MERGE=y
```

#### 3.2.3 USBPLUG update

usbplug.bin is Rockchip boot-programming firmware. For auto_merge use the recommended CS1 GPIO and the default usbplug_auto_merge version in the U-Boot source directory:

```text
./make.sh rv1103b-usbplug
cp u-boot.bin ./../rkbin/bin/rv11/rv1103b_usbplug_*.bin
./make.sh loader
```

Default CS1 GPIO settings for selected usbplug_auto_merge firmware:

| Chip | CS1 GPIO |
| --- | --- |
| RV1103B | GPIO2_A6 |

<!-- Chinese baseline PDF p.20 -->

#### 3.2.4 Functional testing

Stress-test with rockchip_test flash_stresstest: add a 20MB userdata partition using JFFS2, spanning the SPI NOR devices.

## 4 Programming with PC tools

### 4.1 PC programming: GPT partition extension

Require AndroidTools V2.7.8 or later and upgrade_tools V1.5.6 or later. NAND PC programming copies IDB into blocks 1–7: the first 1MB of 2KB-page flash, or 2MB of 4KB-page flash, holds GPT and IDB. NOR programming makes two IDB copies: the first at 64KB, the second immediately after it with 64KB size alignment. After changing GPT during development, upgrade in Maskrom mode to avoid UBIFS mounting problems. Tools recognize UBIFS images, erase the target partition and then program it (the English source completes the truncated Chinese sentence).

### 4.2 PC programming: ENV partition extension

Use SocToolKit, available for Windows and Linux, with a matching production tool.

## 5 OTA

### 5.1 OTA notes

Unmount the target UBIFS filesystem before online upgrading. For MTD devices using parameter partition information, add gpt/idb partitions to parameter.txt if GPT and IDB must be updated:

<!-- Chinese baseline PDF p.21 -->

128KB-block NAND: 0x00000100@0x00000000(gpt),0x00000700@0x00000100(idb). 256KB-block NAND: 0x00000200@0x00000000(gpt),0x00000e00@0x00000200(idb). SPI NOR: 0x00000080@0x00000000(gpt),0x00000780@0x00000080(idb).

### 5.2 Image sources

OTA supports pre-created images only; see image creation in the flash-programmer chapter.

### 5.3 Online MTD partition updates from the command line

For UBIFS in an MTD partition, use the shell-based UBIFS update chapter instead. This MTD procedure concerns read-only firmware partitions without a filesystem, such as IDB, U-Boot and kernel.

#### 5.3.1 SLC NAND in U-Boot

nand info:

```text
nand info
```

nand erase:

```text
nand erase off size
```

off and size: block-size aligned, bytes, hexadecimal only, excluding OOB. For 128KB data plus 8KB OOB, use 128KB. nand write:

```text
nand write.raw[.noverify] - addr off|partition [count]
```

addr: hexadecimal memory address. off\|partition: page aligned, bytes, hexadecimal, excluding OOB (128KB data + 8KB OOB counts as 128KB). count: pages, hexadecimal; include OOB in the image size, e.g. 0x800 data + 0x80 OOB gives count = file_size / 0x880. Write-read verification is enabled by default. nand read:

```text
nand read.raw - addr off|partition [count]
```

<!-- Chinese baseline PDF p.22 -->

addr: hexadecimal memory address. off\|partition: page aligned, bytes, hexadecimal, excluding OOB (128KB data + 8KB OOB counts as 128KB). count: pages, hexadecimal; include OOB in the image size, e.g. 0x800 data + 0x80 OOB gives count = file_size / 0x880. Recommended partition-update sequence:

```text
tftp 0x4000000 rootfs.img
nand erase 0x600000 0x200000                        /* 升级分区时先擦除整个分区 */
nand write.raw 0x4000000 0x600000 0x1000
```

#### 5.3.2 SLC NAND in the kernel

flash_erase:

```text
flash_erase       /* 例如: flash_erase /dev/mtd1 0 0 */
```

nanddump:

```text
nanddump -o -n --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img
```

--bb=skipbad: skip bad blocks; -o: read OOB data; -n: read without ECC. nandwrite:

```text
nandwrite -o -n -p /dev/mtd3 /rockchip_test/rockchip_test.sh
```

-o: input includes OOB; -n: write without ECC. Recommended partition-update sequence:

```text
flash_erase /dev/mtd4 0 0                       /* 升级分区时先擦除整个分区 */
nandwrite -o -n -p /dev/mtd4 /userdata/boot.img
sync
nanddump -o -n --bb=skipbad /dev/mtd4 -f /userdata/boot_read.img -l 0xXXXX
md5sum /userdata/boot_read.img ...              /* 建议添加校验 */
```

<!-- Chinese baseline PDF p.23 -->

#### 5.3.3 SPI NAND in U-Boot

SPI NAND cannot use nand commands. Use cmd/mtd.c, which still skips bad blocks. mtd erase:

```text
mtd erase <name> <off> <size>
```

name: spi-nand0 for the SPI NAND MTD device. off and size: block-size aligned, in bytes, hexadecimal only. mtd write:

```text
mtd write <name> <addr> <off> <size>
```

name: spi-nand0. addr: memory address, hexadecimal only. off and size: page-size aligned, in bytes, hexadecimal only. mtd read:

```text
mtd read <name> <addr> <off> <size>
```

name: spi-nand0. addr: memory address, hexadecimal only. off and size: page-size aligned, in bytes, hexadecimal only. Recommended partition-update sequence:

```text
tftp 0x4000000 rootfs.img
mtd erase spi-nand0 0x600000 0x200000                       /* 升级分区时先擦除整个分区 */
mtd write spi-nand0 0x4000000 0x600000 0x200000
```

#### 5.3.4 SPI NAND in the kernel

flash_erase:

```text
flash_erase       /* 例如: flash_erase /dev/mtd1 0 0 */
```

nanddump:

```text
nanddump --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img
```

<!-- Chinese baseline PDF p.24 -->

--bb=skipbad: skip bad blocks. nandwrite:

```text
nandwrite -p /dev/mtd3 /rockchip_test/rockchip_test.sh
```

Recommended partition-update sequence:

```text
flash_erase /dev/mtd4 0 0                       /* 升级分区时先擦除整个分区 */
nandwrite -p /dev/mtd4 /userdata/boot.img
sync
nanddump --bb=skipbad /dev/mtd3 /userdata/boot_read.img -l 0xXXXX
md5sum /userdata/boot_read.img ...              /* 建议添加校验 */
```

#### 5.3.5 SPI NOR in U-Boot

Use the MTD interface; cmd/sf.c is an alternative. mtd erase:

```text
mtd erase <name> <off> <size>
```

name: nor0 for SPI NOR MTD. off and size: sector aligned (4KB per sector), in bytes, hexadecimal only. mtd write:

```text
mtd write <name> <addr> <off> <size>
```

name: nor0. addr: memory address, hexadecimal only. off and size: minimum byte alignment, byte units, hexadecimal only. mtd read:

```text
mtd read <name> <addr> <off> <size>
```

name: nor0. addr: memory address, hexadecimal only. off and size: minimum byte alignment, byte units, hexadecimal only. Recommended partition-update sequence:

<!-- Chinese baseline PDF p.25 -->

```text
tftp 0x4000000 rootfs.img
mtd erase nor0 0x600000 0x200000                        /* 升级分区时先擦除整个分区 */
mtd write nor0 0x4000000 0x600000 0x200000
```

#### 5.3.6 SPI NOR in the kernel

Use the mtd_debug interface.

### 5.4 Online UBIFS image partition updates from the command line

See UBIFS Filesystem → UBIFS OTA.

### 5.5 MTD partition updates through function interfaces

For MTD images using UBIFS, follow the shell UBIFS-update chapter; these raw MTD operations target filesystem-free read-only IDB/U-Boot/kernel partitions. U-Boot: use bad-block-aware read/write/erase APIs in drivers/mtd/nand/raw/nand_util.c. For small complete writes (recommended below 2KB per power-on), consider RK MTD-to-block interfaces in drivers/mtd/mtd_blk.c. Every write erases the corresponding flash block regardless of request size; frequent fragmented writes reduce flash life. Kernel: consult mtd-utils ./miscutils/nandwrite.c and ./miscutils/flash_eraseall.c and use bad-block-aware APIs. Userspace: use those same examples with MTD ioctl commands listed in include/uapi/mtd/mtd-abi.h. Read returns: 0 means valid data/ECC OK; -EUCLEAN means valid data with ECC at maximum correction capability, consider refreshing by read/erase/rewrite; -EBADMSG means bad data/ECC failure; -EIO and other errors indicate invalid data and controller or other processing failures. Common return-value handling follows:

<!-- Chinese baseline PDF p.26 -->

```text
ret = mtd_read(mtd, from, len, &retlen, data);
if (ret < 0 && ret != -EUCLEAN) {
    return ret;
}
```

## 6 Filesystems

### 6.1 UBIFS filesystem

#### 6.1.1 Introduction

UBIFS means Unsorted Block Image File System, commonly used on raw NAND as a JFFS2 successor. The source says UBIFS handles interactions with MTD through the UBIFS subsystem.

#### 6.1.2 Configuration

Kernel support:

```text
CONFIG_MTD_UBI=y
CONFIG_UBIFS_FS=y
CONFIG_UBIFS_FS_ADVANCED_COMPR=y
CONFIG_UBIFS_FS_LZO=y /* 建议选⽤ lzo 压缩 */
```

#### 6.1.3 Image creation and mounting

##### 6.1.3.1 Offline image creation

Detailed command description:

```text
Usage: mkfs.ubifs [OPTIONS] target
Make a UBIFS file system image from an existing directory tree
Examples:
Build file system from directory /opt/img, writting the result in the ubifs.img file
        mkfs.ubifs -m 512 -e 128KiB -c 100 -r /opt/img ubifs.img
The same, but writting directly to an UBIFS volume
        mkfs.ubifs -r /opt/img/dev/ubi0_0
Creating an empty UBIFS filesystem on an UBIFS volume
        mkfs.ubifs/dev/ubi0_0
Options:
-r, -d, --root=DIR         build file system from directory DIR, 待制作的⽂件系统⽬录
-m, --min-io-size=SIZE     minimum I/O unit size，最⼩输⼊输出⼤⼩, NAND FLASH 的最⼩读写单元，⼀
般为 page size，有 4096 或 2048
-e, --leb-size=SIZE        logical erase block size 逻辑可擦出块⼤⼩，为 block size-2x (page
size)，如 block_size 256KB page_size 2KB 应设置 -e 258048，如 block_size 128KB page_size 2KB 应
设置 -e 126976
-c, --max-leb-cnt=COUNT    maximum logical erase block count 最⼤逻辑可擦出块数⽬，autoresize 时
⽂件系统的的上限
-o, --output=FILE          output to FILE 输出⽂件名
-j, --jrn-size=SIZE        journal size
-R, --reserved=SIZE        how much space should be reserved for the super-user
-x, --compr=TYPE           compression type - "lzo", "favor_lzo", "zlib" or "none" (default:
"lzo")
-X, --favor-percent        may only be used with favor LZO compression and defines how many
percent better zlib should compress to make mkfs.ubifs use zlib instead of LZO (default 20%)
-f, --fanout=NUM           fanout NUM (default: 8)
-F, --space-fixup          file-system free space has to be fixed up on first mount(requires
kernel version 3.0 or greater),如果是通过 u-boot 烧写需要使能此功能。
-k, --keyhash=TYPE         key hash type - "r5" or "test" (default: "r5")
-p, --orph-lebs=COUNT      count of erase blocks for orphans (default: 1)
-D, --devtable=FILE        use device table FILE
-U, --SquashFS-uids        SquashFS owners making all files owned by root
-l, --log-lebs=COUNT       count of erase blocks for the log (used only for debugging)
-v, --verbose              verbose operation
-V, --version              display version information
-g, --debug=LEVEL          display debug information (0 - none, 1 - statistics, 2 - files, 3
- more details)
-h, --help                 display this help text
```

Procedure:

1. Create the UBIFS image; normally only the following parameters need configuration.

```text
mkfs.ubifs -F -d rootfs_dir -e real_value -c real_value -m real_value -v -o rootfs.ubifs
```

2. Convert to flash-programming format.

```text
ubinize -o ubi.img -m 2048 -p 128KiB ubinize.cfg
```

-p: block size. -m: minimum NAND read/write unit, usually page size. -o: output ubi.img. ubinize.cfg settings:

```text
[ubifs-volumn]
mode=ubi
image=rootfs.ubifs
vol_id=0
vol_type=dynamic
vol_alignment=1
vol_name=ubifs
vol_flags=autoresize
```

<!-- Chinese baseline PDF p.28 -->

mode=ubi is mandatory; other values are reserved for future use. image=out/rootfs.ubifs is the input file. vol_id=0 distinguishes volumes in a multivolume UBI image. vol_type=dynamic means read/write; static is read-only. vol_name=ubifs names the volume. vol_flags=autosize allows expansion. Example: 2KB pages, 64 pages/block, 128KB blocks and 64MB partition:

```text
mkfs.ubifs -F -d /path-to-it/buildroot/output/rockchip_rv1126_rv1109_spi_nand/target -e 0x1f000 -c 0x200 -m 0x800 -v -o rootfs.ubifs
ubinize -o ubi.img -m 2048 -p 128KiB ubinize.cfg
```

2KB pages, 128 pages/block, 256KB blocks, 64MB partition:

```text
mkfs.ubifs -F -d /path-to-it/buildroot/output/rockchip_rv1126_rv1109_spi_nand/target -e 0x3f000 -c 0x100 -m 0x800 -v -o rootfs.ubifs
ubinize -o ubi.img -m 2048 -p 256KiB ubinize.cfg
```

4KB pages, 64 pages/block, 256KB blocks, 64MB partition:

```text
mkfs.ubifs -F -d /path-to-it/buildroot/output/rockchip_rv1126_rv1109_spi_nand/target -e 0x3e000 -c 0x100 -m 0x1000 -v -o rootfs.ubifs
ubinize -o ubi.img -m 0x1000 -p 256KiB ubinize.cfg
```

Multivolume example: 2KB pages, 64 pages/block, 128KB blocks; combine 8MB oem and 8MB userdata in one multivolume partition.

```text
mkfs.ubifs -F -d oem -e 0x1f000 -c 0x40 -m 0x800 -v -o oem.ubifs
mkfs.ubifs -F -d userdata -e 0x1f000 -c 0x40 -m 0x800 -v -o userdata.ubifs
ubinize -o oem_userdata.img -p 0x20000 -m 2048 -s 2048 -v ubinize_oem_userdata.cfg
```

Set ubinize_oem_userdata.cfg as follows:

```text
[oem-volume]
mode=ubi
image=oem.ubifs
vol_id=0
vol_size=8MiB
vol_type=dynamic
vol_name=oem

[userdata-volume]
mode=ubi
image=userdata.ubifs
vol_id=1
vol_size=8MiB
vol_type=dynamic
vol_name=userdata
vol_flags=autoresize
```

Mount the partitions:

```text
ubiattach /dev/ubi_ctrl -m 4 -d 4 -b 5
mount -t ubifs /dev/ubi4_0 /oem
mount -t ubifs /dev/ubi4_1 /uesrdata
```

Individual volumes cannot be simply updated independently using direct flash read/write interfaces. OTA requirements and update frequency of volumes sharing an image should therefore be similar.

##### 6.1.3.2 Online low-level partition formatting in the kernel

```text
umount userdata/
ubidetach -m 4
ubiformat -y /dev/mtd4
ubiattach /dev/ubi_ctrl -m 4 -d 4
ubimkvol /dev/ubi4 -N userdata -m                        # -N 指定卷名，-m 将分区设备 autorisize 可动态调整到最⼤
mount -t ubifs /dev/ubi4_0 /userdata
```

##### 6.1.3.3 Mounting UBIFS by command

Attach the MTD device to UBI:

```text
ubiattach /dev/ubi_ctrl -m 4 -d 4
```

-m: MTD partition number. -d: resulting UBI number, preferably matching MTD. -b/--max-beb-per1024: expected maximum bad eraseblocks per 1024; note:

1. If omitted, the default is 20.

2. With a prebuilt image: partition spare flash blocks &lt; actual --max-beb-per1024 &lt; configured --max-beb-per1024. The actual value may be smaller.

3. Creating an empty UBI partition by command gives the configured value as the actual value.

4. SDK default may be set to 10; older SDKs may not set it.

5. To optimize space use 4 + partition block count * 1%; e.g. 128KB blocks and 16MB oem (128 blocks), consider 5.

```text
mount -t ubifs /dev/ubi4_0 /oem
```

<!-- Chinese baseline PDF p.30 -->

##### 6.1.3.4 Automatic UBIFS mounting

```text
ubi.mtd=4 root=ubi0:rootfs rootfstype=ubifs
```

##### 6.1.3.5 UBI partition overhead

Usable mounted UBI capacity is smaller than the partition because of UBIFS metadata and reserved bad-block replacements. Exact calculation:

```text
UBI overhead = (B + 4) * SP + 0 * (P - B - 4) /* 该空间⽤⼾⽆法获取 */
P - MTD 设备上物理除块的总数
SP - 物理擦除块⼤⼩,通常为 128KB 或 256KB
SL - 逻辑擦除块，即 mkfs 时 -e 参数值,通常为 block_size - 2 * page_size
B - 为坏块替换预留的 f1ash blocks,与 ubiattach- b参数相关
O - 与以字节为单位存储 EC 和 VID ⽂件头有关的开销, i.e. 0 = SP - SL
```

Example 1: 128KB flash blocks, 2KB pages, 128MB device; ubiattach -b defaults to 20.

```text
SP = block size = 128KB
SL = 128kb - 2 * 2KB = 124KB
B = --max-beb-per1024 * n_1024 = 20 * 1 = 20
O = 128KB -124KB = 4KB
UBI overhead = (20 + 4) * 128KB + 4KB * (P - 20 - 4) = 2976KB + 4KB * P
```

For a 32MB partition, P = 256: UBI overhead = 2976KB + 4KB * 256 = 4000KB. Example 2: 128KB blocks, 2KB pages, 256MB device; ubiattach -b defaults to 20.

```text
SP = block size = 128KB
SL = 128kb - 2 * 2KB = 124KB
B = --max-beb-per1024 * n_1024 = 20 * 2 = 40
O = 128KB -124KB = 4KB
UBI overhead = (40 + 4) * 128KB + 4KB * (P - 40 - 4) = 5456KB + 4KB * P
```

For a 32MB partition, P = 256: the source prints UBI overhead = 5456KB + 4KB * 256 = 6456KB. See Flash space overhead: http://www.linux-mtd.infradead.org/doc/ubi.html#L_overhead.

#### 6.1.4 SquashFS support through UBI Block

Kernel configuration:

```text
+CONFIG_MTD_UBI_BLOCK=y
```

<!-- Chinese baseline PDF p.31 -->

Specify rootfs in DTS:

```text
dts 中 bootargs 参数指定了 cmdline 中相关 ubi 的参数。

- ubi.mtd=4              : 选择 MTD 设备（从0开始）
- ubi.block=0,rootfs     : "rootfs" 是 vol_name (参考 ubinize.cfg), block=0 指定了ubi block的序
号
- root=/dev/ubiblock0_0  : 指定 rootfs 分区名；由 ubi block 驱动根据 ubi.block 参数⽣成的块设备
- rootfstype=squashfs    : 指定⽂件系统类型
```

Example:

```text
ubi.mtd=3 ubi.block=0,rootfs root=/dev/ubiblock0_0 rootfstype=squashfs
```

Notes:

1. If U-Boot derives MTD partitions from GPT, they correspond one-to-one with parameter.txt, numbered from mtd0 or mtdblock0.

2. mtd is a character device; mtdblock is a block device. To create a SquashFS UBI volume, Buildroot normally packages SquashFS. For separate packaging use mksquashfs, for example:

```text
sudo mksquashfs squashfs-root/ squashfs.img -noappend -always-use-fragments
```

Package SquashFS as a UBI image with ubinize. First create ubinize.cfg:

```text
cat > ubinize.cfg << EOF
[ubifs]
mode=ubi
vol_id=0
vol_type=static
vol_name=rootfs
vol_alignment=1
vol_flags=autoresize
image=/data/rk/projs/rv1126/sdk/buildroot/output/rockchip_rv1126_robot/images/rootfs.squashfs
EOF
```

vol_type=static selects read-only; image specifies the SquashFS path. Then run ubinize:

```text
ubinize -o rootfs.ubi -p 0x20000 -m 2048 -s 2048 -v ubinize.cfg
```

<!-- Chinese baseline PDF p.32 -->

-p: physical eraseblock size. -m: minimum I/O unit, 1 for NOR and page size for NAND. -s: subpage size, 1 for NOR and the NAND subpage-size parameter for NAND. The resulting rootfs.ubi is used for upgrading. On NAND with the open-source solution, mount SquashFS on UBI block, not mtdblock: mtdblock lacks bad-block detection and cannot skip bad blocks. Manual UBI-block mount example:

```text
ubiattach /dev/ubi_ctrl -m 4 -d 4   /* 先挂载 UBI 设备 */
ubiblock -c /dev/ubi4_0             /* UBI 设备上扩展 UBI block ⽀持 */
mount -t squashfs /dev/ubiblock4_0 /oem
```

#### 6.1.5 Image size optimization

Usable image capacity can be optimized in three ways:

1. Choose --max-beb-per1024 appropriately; see item 5 of the -b explanation under empty UBI creation and mounting.

2. Share UBIFS overhead with multiple UBI volumes; see multivolume image creation.

3. Use SquashFS over UBI block; see the corresponding section. Minimum UBIFS partition:

```text
Minimum block num = 4（固定预留） + B + 17  /* B - 为坏块替换预留的 f1ash blocks,与 ubiattach - b
参数相关，UBIFS_MIN_LEB_CNT 等于 17 */
```

Check the ubiattach log, for example:

```text
ubi4: available PEBs: 7, total reserved PEBs: 24, PEBs reserved for bad PEB handling: 20
/* B = 20 */
```

Mounting fails if available PEBs + total reserved PEBs &lt; Minimum block num:

```text
mount: mounting /dev/ubi4_0 on userdata failed: Invalid argument
```

#### 6.1.6 UBIFS OTA

Update UBIFS partitions with ubiupdatevol:

```text
ubiupdatevol /dev/ubi1_0 rootfs.ubifs
```

<!-- Chinese baseline PDF p.33 -->

rootfs.ubifs is created by mkfs.ubifs, not the final programming image from ubinize.

#### 6.1.7 UBIFS FASTMAP

FASTMAP is described as an experimental optional UBI feature enabled with CONFIG_MTD_UBI_FASTMAP=y. When fm_autoconvert=1 (default 0), UBI automatically creates an internal fastmap volume on attached images for faster later attachment. The pool consumes at most 5% of physical blocks and at least two blocks for fastmaps. Larger partitions may benefit; source measurements found no clear boot-time benefit for 128MB UBIFS/UBI Block SquashFS. Kernel settings:

```text
CONFIG_MTD_UBI_FASTMAP=y
```

Enable fm_autoconvert after kernel boot:

```text
echo 1 > /sys/module/ubi/parameters/fm_autoconvert
```

Then attach the device with ubiattach, for example:

```text
ubiattach /dev/ubi_ctrl -m 7 -d 7
```

fastmap can be disabled during ubiattach; some older tools do not support this option.

```text
ubiattach /dev/ubi_ctrl -m 7 -d 7 -f
```

Because no obvious benefit appears in the general SDK, this setting is disabled by default; enable it only as needed.

#### 6.1.8 UBIFS support in U-Boot

U-Boot UBIFS supports reads only, not writes or deletion. SLC NAND patch: see RK3308 support below.

```text
CONFIG_CMD_UBI=y

diff --git a/include/configs/rk3308_common.h b/include/configs/rk3308_common.h
index 1c2b9e4461..bc861acde8 100644
--- a/include/configs/rk3308_common.h
+++ b/include/configs/rk3308_common.h
@@ -57,6 +57,9 @@
 #define CONFIG_USB_FUNCTION_MASS_STORAGE
 #define CONFIG_ROCKUSB_G_DNL_PID        0x330d
+#define MTDIDS_DEFAULT "nand0=rk-nand"
+#define MTDPARTS_DEFAULT "mtdparts=rk-nand:0x100000@0x400000(uboot),0x100000@0x500000(trust),0x600000@0x600000(boot),0x3000000@0xc00000(rootfs),0x1200000@0x4000000(oem),0x9f60000@0x6000000(userdata)"
+
 #ifdef CONFIG_ARM64
 #define ENV_MEM_LAYOUT_SETTINGS \
        "scriptaddr=0x00500000\0" \
```

SPI NAND patch: see RK3568 support below.

```text
diff --git a/include/configs/rk3568_common.h b/include/configs/rk3568_common.h
index cce44b52a8..eb93455c62 100644
--- a/include/configs/rk3568_common.h
+++ b/include/configs/rk3568_common.h
@@ -92,6 +92,9 @@
        "run distro_bootcmd;"
 #endif
+#define MTDIDS_DEFAULT "spi-nand0=spi-nand0"
+#define MTDPARTS_DEFAULT "mtdparts=spi-nand0:0x100000@0x400000(vnvm),0x440000@0x500000(uboot),0x1600000@0xa00000(boot),0x4400000@0x2000000(rootfs),0x1b60000@0x6400000(userdata)"
+
 /* rockchip ohci host driver */
 #define CONFIG_USB_OHCI_NEW
 #define CONFIG_SYS_USB_OHCI_MAX_ROOT_PORTS     1
(END)
```

Enable macros in menuconfig:

```text
#define CONFIG_CMD_UBI = y
```

Mounting example for rootfs; details in doc/README.ubi.

```text
mtdpart
ubi part rootfs
ubifsmount ubi0:rootfs
ubifsls
```

U-Boot passes mtdparts through cmdline as described under GPT extension, except MTDPARTS_DEFAULT. Add mtdparts to the kernel cmdline to define kernel MTD partitions.

<!-- Chinese baseline PDF p.35 -->

#### 6.1.9 UBIFS SDK configuration

RK3568 EVB1 example: trim the SDK and generate rootfs.ubi by editing buildroot/configs/rockchip_rk3568_defconfig.

```text
#include "base/base.config"
#include "chips/rk3566_rk3568_aarch64.config"
#include "fs/ubifs.config"
```

Change the output rootfs.img symlink to rootfs.ubi.

```text
diff --git a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
index a2788203..31528f73 100644
--- a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
+++ b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
@@ -1,3 +1,6 @@
 RK_KERNEL_DTS_NAME="rk3568-evb1-ddr4-v10-linux"
 RK_PARAMETER="parameter-buildroot-fit.txt"
 RK_USE_FIT_IMG=y
+RK_ROOTFS_UBI=y
```

Change default NAND parameters from 2KB pages/128KB blocks to 4KB pages/256KB blocks:

```text
diff --git a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
index a2788203..31528f73 100644
--- a/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
+++ b/.chips/rk3566_rk3568/rockchip_rk3568_evb1_ddr4_v10_defconfig
@@ -1,3 +1,6 @@
 RK_KERNEL_DTS_NAME="rk3568-evb1-ddr4-v10-linux"
 RK_PARAMETER="parameter-buildroot-fit.txt"
 RK_USE_FIT_IMG=y
+RK_UBI_PAGE_SIZE=0x1000
+RK_UBI_BLOCK_SIZE=0x40000
```

RK_UBI_PAGE_SIZE and RK_UBI_BLOCK_SIZE map to these Buildroot parameters:

```text
BR2_TARGET_ROOTFS_UBI=y
BR2_TARGET_ROOTFS_UBI_PEBSIZE=0x40000
BR2_TARGET_ROOTFS_UBI_SUBSIZE=4096
BR2_TARGET_ROOTFS_UBI_OPTS="-v"
BR2_TARGET_ROOTFS_UBIFS_LEBSIZE=0x3e000
BR2_TARGET_ROOTFS_UBIFS_MINIOSIZE=4096
BR2_TARGET_ROOTFS_UBIFS_MAX_SIZE=1024
BR2_TARGET_ROOTFS_UBIFS_OPTS="-F -v"
```

Rebuild rootfs and repackage firmware after changing parameters.

<!-- Chinese baseline PDF p.36 -->

### 6.2 JFFS2 filesystem support

#### 6.2.1 Introduction

JFFS2 means Journalling Flash FileSystem Version 2. It implements a journaled filesystem directly on MTD, without a translation layer for conventional filesystems. At mount, it scans the MTD log and reconstructs filesystem structures in RAM.

#### 6.2.2 Notes

1. mkfs.jffs2 cannot pre-create JFFS2 images with 4KB erase size.

1. Standard mtd-utils does not support 4KB erasing.

2. RK Buildroot modifies mtd-utils for 4KB erasing; see the changes below.

```text
diff --git a/jffsX-utils/mkfs.jffs2.c b/jffsX-utils/mkfs.jffs2.c
index 9aa6c39..3cec529 100644
--- a/jffsX-utils/mkfs.jffs2.c
+++ b/jffsX-utils/mkfs.jffs2.c
@@ -1668,6 +1668,11 @@ int main(int argc, char **argv)

                          /* If it's less than 8KiB, they're not allowed */
                          if (erase_block_size < 0x2000) {
+                             if (erase_block_size == 0x1000) {
+                                 warnmsg("Set Erase size to 4KB with Experimental.\n");
+                                 erase_block_size = 0x1000;
+                                 break;
+                             }
                              fprintf(stderr, "Erase size 0x%x too small. Increasing to 8KiB minimum\n",
                                      erase_block_size);
                              erase_block_size = 0x2000;
diff --git a/jffsX-utils/sumtool.c b/jffsX-utils/sumtool.c
index 68268a9..836b426 100644
--- a/jffsX-utils/sumtool.c
+++ b/jffsX-utils/sumtool.c
@@ -194,6 +194,11 @@ static void process_options (int argc, char **argv)

                          /* If it's less than 8KiB, they're not allowed */
                          if (erase_block_size < 0x2000) {
+                             if (erase_block_size == 0x1000) {
+                                 warnmsg("Set Erase size to 4KB with Experimental.\n");
+                                 erase_block_size = 0x1000;
+                                 break;
+                             }
                              warnmsg("Erase size 0x%x too small. Increasing to 8KiB minimum\n",
                                    erase_block_size);
                              erase_block_size = 0x2000;
--
2.23.0-rc1
```

2. Kernel JFFS2 supports NOR 4KB erasing and flash_erase -j low-level formatting to create a usable 4KB JFFS2 partition.

#### 6.2.3 Configuration

Kernel configuration:

```text
CONFIG_JFFS2_FS=y
CONFIG_MTD_SPI_NOR_USE_4K_SECTORS=n /* 内核版本 5.10 及更⾼版本可配 */
```

In Linux 5.10+, RK SPI NOR uses the standard MTD NOR framework. Most supported chips have SECT_4K; CONFIG_MTD_SPI_NOR_USE_4K_SECTORS selects 64KB/4KB erasing. 64KB is faster (GD25Q256E typical 0.12s/0.15s) but alignment wastes more space. 4KB is slower (GD25Q256E typical 30ms, under one-third of block-erase throughput) but improves space utilization.

#### 6.2.4 Image creation

Image creation example:

```text
mkfs.jffs2 -r data/ -o data.jffs2 -e 0x10000 --pad=0x400000 -s 0x1000 -n
Options:
 --pad [=SIZE]            Pad output to SIZE bytes with 0xFF. If SIZE is
                          not specified, the output is padded to the end of
                          the final erase block
  -r, -d, --root=DIR      Build file system from directory DIR (default: cwd)
  -s, --pagesize=SIZE     Use page size (max data node size) SIZE.
                          Set according to target system's memory management
                          page size (default: 4KiB)
  -e, --eraseblock=SIZE   Use erase block size SIZE (default: 64KiB)
  -n, --no-cleanmarkers   Don't add a cleanmarker to every eraseblock
```

--pad: match partition size. -e: erase size, normally 64KB only; modify mtd-utils for 4KB as described under Notes. -s: default 4KB.

<!-- Chinese baseline PDF p.38 -->

## 7 Programming with a hardware programmer

### 7.1 SPI NAND image programming: GPT

#### 7.1.1 Create a SPI NAND programming image

Input: SDK output images for PC programming tools.

```text
[/IMAGES] tree
.
├── parameter.txt
├── MiniLoaderAll.bin
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

programmer_image_tool is under SDK rkbin/. Usage:

```text
./tools/programmer_image_tool  --help
NAME
        programmer_image_tool - creating image for programming on flash
SYNOPSIS
        programmer_image_tool [-iotbpsvh]
DESCRIPTION
        This tool aims to convert firmware into image for programming
        From now on,it can support slc nand(rk)|spi nand|nor|emmc.
OPTIONS:
          -i    input firmware
          -o    output directory
          -t    storage type,range in[SLC|SPINAND|SPINOR|EMMC]
          -b    block size,unit KB
          -p    page size,unit KB
          -s    oob size,unit B
          -2    2k data in one page
          -l    using page linked l
```

Example: rv1126 flash with 128KB blocks and 2KB pages; 256KB, 4KB * 64.

```text
./tools/programmer_image_tool  -i update.img -b 128 -p 2 -t spinand -o out
input firmware is 'update.img'
block size is '128'
page size is '2'
flash type is 'spinand'
output directory is 'out'
writing idblock...
start to write partitions...gpt=1
preparing gpt saving at out/gpt.img
writing gpt...OK
preparing trust saving at out/trust.img
writing trust...OK
preparing uboot saving at out/uboot.img
writing uboot...OK
preparing boot saving at out/boot.img
writing boot...OK
preparing rootfs saving at out/rootfs.img
writing rootfs...OK
preparing recovery saving at out/recovery.img
writing recovery...OK
preparing oem saving at out/oem.img
writing oem...OK
preparing userdata:grow saving at out/userdata:grow.img
writing userdata:grow...OK
preparing misc saving at out/misc.img
writing misc...OK
creating programming image ok.
```

For 4KB pages add -2 to programmer_image_tool. Output: programmer images.

```text
out
├── boot.img
├── gpt.img
├── idblock.img            // ⾃⾏根据需求制作 idblock_mutli_copies.img 的多备份镜像
├── misc.img
├── oem.img
├── recovery.img
├── rootfs.img
├── trust.img
├── uboot.img
└── userdata.img
```

IDB multiple-copy command example; two copies normally suffice:

```text
cat out/idblock.img > out/idblock_mutli_copies.img   // 1 copy
cat out/idblock.img >> out/idblock_mutli_copies.img  // 2 copies
```

<!-- Chinese baseline PDF p.40 -->

#### 7.1.2 Program SPI NAND with a programmer

Programming addresses: comparison of PC-tool and programmer settings for 128KB flash blocks:

| Programmer image source: SDK default output image | PC programming-tool sector address | Programmer image | Programmer block start address | End address | Firmware size | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| paramter.txt | 0 | gpt.img | 0x0 | 0x1 | 0x1 | Note 1 |
| MiniLoaderAll.bin | 0 | idblock_mutli_copies.img | 0x1 | 0x7 | 0x6 | Note 2 |
| uboot.img | 0x2000 | uboot.img | 0x20 | 0x47 | 0x20 | Note 3 |
| boot.img | 0x4800 | boot.img | 0x48 | 0xa0 | 0x50 |  |
| ... | ... | ... | ... |  |  |  |
| xxx.img | 0x3E000 | xxx.img | 0x3e0 | 0x3fb | 0x18 | Note 4 |

Table notes:

1. gpt.img is programmed in block 0; U-Boot automatically repairs/creates backup GPT.

2. idblock_mutli_copies.img starts at block 1 and ends at block 7; image size must be below partition size, reserving one bad-block replacement block.

3. Except gpt.img/idblocks.img with special addresses, program firmware at parameter.txt addresses. The source writes sector units as 512B/s; calculation uses 512 bytes: programmer block address = sectors * 512B / block_size, or sectors / 0x100 for 128KB and / 0x200 for 256KB. Except gpt.img, keep images 1–2 blocks smaller than partitions for bad-block replacement.

4. Reserve the final four flash blocks for the bad-block table. User partitions must not reach this area; consider a reverved partition (source spelling) to prevent use or later misuse. Additional notes:

1. RK SPI NAND FSPI (formerly SFC) has no integrated ECC, so device ECC is required. Programmer images contain no OOB; the programmer fills OOB with FF and must enable device ECC.

2. On nonempty flash, erase all good blocks before programming.

3. Enable programming verification.

<!-- Chinese baseline PDF p.41 -->

### 7.2 SLC NAND image programming: GPT

#### 7.2.1 Create a SLC NAND programming image

Input: SDK output images for PC programming tools.

```text
[/IMAGES] tree
.
├── parameter.txt
├── MiniLoaderAll.bin
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

Image creation example: rv1126, 128KB blocks, 2KB pages, OOB size 128.

```text
./tools/programmer_image_tool -i update.img -b 128 -p 2 -s 128 -t slc -o out
input firmware is 'update.img'
block size is '128'
page size is '2'
oob size is '128'
flash type is 'slc'
2k data page on.
output directory is 'out'
writing idblock...
start to write partitions...gpt=1
preparing gpt saving at out/gpt.img
writing gpt...OK
preparing trust saving at out/trust.img
writing trust...OK
preparing uboot saving at out/uboot.img
writing uboot...OK
preparing boot saving at out/boot.img
writing boot...OK
preparing rootfs saving at out/rootfs.img
writing rootfs...OK
preparing recovery saving at out/recovery.img
writing recovery...OK
preparing oem saving at out/oem.img
writing oem...OK
preparing userdata:grow saving at out/userdata:grow.img
writing userdata:grow...OK
preparing misc saving at out/misc.img
writing misc...OK
creating programming image ok.
```

<!-- Chinese baseline PDF p.42 -->

Add -l for RK3326/PX30/RK3568 to change linked-list linkage. Add -2 for RV1126/RK3326/PX30/RK3308 with 4KB pages. Output aligns to block size with OOB; see NAND information. Output is used by the programmer.

```text
out
├── boot.img
├── gpt.img
├── idblock.img            // ⾃⾏根据需求制作 idblock_mutli_copies.img 的多备份镜像
├── misc.img
├── oem.img
├── recovery.img
├── rootfs.img
├── trust.img
├── uboot.img
└── userdata.img
```

IDB multiple-copy command reference; backup is normally sufficient:

```text
cat out/idblock.img > out/idblock_mutli_copies.img   // 1 copy
cat out/idblock.img >> out/idblock_mutli_copies.img  // 2 copies
```

#### 7.2.2 Program SLC NAND with a programmer

Programming addresses: comparison of PC-tool and programmer settings for 128KB flash blocks:

| Programmer image source: SDK default output image | PC programming-tool sector address | Programmer image | Programmer block start address | End address | Firmware size | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| paramter.txt | 0 | gpt.img | 0x0 | 0x1 | 0x1 | Note 1 |
| MiniLoaderAll.bin | 0 | idblock_mutli_copies.img | 0x1 | 0x7 | 0x6 | Note 2 |
| uboot.img | 0x2000 | uboot.img | 0x20 | 0x47 | 0x20 | Note 3 |
| boot.img | 0x4800 | boot.img | 0x48 | 0xa0 | 0x50 |  |
| ... | ... | ... | ... |  |  |  |
| xxx.img | 0x3E000 | xxx.img | 0x3e0 | 0x3fb | 0x18 | Note 4 |

Table notes:

<!-- Chinese baseline PDF p.43 -->

1. Program gpt.img in block 0.

2. idblock_mutli_copies.img starts at block 1, ends at block 7, and must be under seven blocks, reserving one replacement block.

3. Except gpt.img/idblocks.img with special addresses, program firmware at parameter.txt addresses. The source writes sector units as 512B/s; calculation uses 512 bytes: programmer block address = sectors * 512B / block_size, or sectors / 0x100 for 128KB and / 0x200 for 256KB. Except gpt.img, keep images 1–2 blocks smaller than partitions for bad-block replacement.

4. Reserve the final four flash blocks for the bad-block table. User partitions must not reach this area; consider a reverved partition (source spelling) to prevent use or later misuse. Additional notes:

1. All images include OOB data.

2. On nonempty flash, erase all good blocks before programming.

3. Enable programming verification.

### 7.3 SPI NOR image programming: GPT

#### 7.3.1 Create a SPI NOR programming image

Input: SDK output images for PC programming tools.

```text
[/IMAGES] tree
.
├── parameter.txt
├── MiniLoaderAll.bin
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

Image creation example:

```text
./tools/programmer_image_tool -i update.img  -t SPINOR -o ./out
input firmware is 'update.img'
flash type is 'SPINOR'
output directory is './out'
writing idblock...
start to write partitions...gpt=1
preparing gpt at 0x00000000
writing gpt...OK
preparing trust at 0x00002800
writing trust...OK
preparing uboot at 0x00002000
writing uboot...OK
preparing boot at 0x00009800
writing boot...OK
preparing rootfs at 0x0000c800
writing rootfs...OK
preparing recovery at 0x00003800
writing recovery...OK
preparing misc at 0x00003000
writing misc...OK
creating programming image ok.
```

Output: images for the programmer.

```text
tree
.
└── out_image.img
```

#### 7.3.2 Program SPI NOR with a programmer

Program programmer_image_tool output at SPI NOR address 0.

### 7.4 SPI NAND image programming: ENV

#### 7.4.1 Create a SPI NAND programming image

Input: SDK output images.

```text
[/IMAGES] tree
.
├── boot.img
├── download.bin
├── env.img
├── idblock.img
├── oem_2KB_128KB_48MB.ubi
├── oem_2KB_256KB_48MB.ubi
├── oem_4KB_256KB_48MB.ubi
├── oem.img
├── rootfs_2KB_128KB_32MB.ubi
├── rootfs_2KB_256KB_32MB.ubi
├── rootfs_4KB_256KB_32MB.ubi
├── rootfs.img
├── sd_update.txt
├── tftp_update.txt
├── uboot.img
├── update.img
├── userdata_2KB_128KB_32MB.ubi
├── userdata_2KB_256KB_32MB.ubi
├── userdata_4KB_256KB_32MB.ubi
└── userdata.img
```

SDK images serve both PC upgrade tools and programmers. Default idblock.img supports 2KB-page SPI NAND; recreate it for 4KB-page devices. Output remains idblock.img:

```text
./rkbin/tools/programmer_image_tool  -i download.bin -b 256 -p 4 -2 -t spinand -o ./
```

#### 7.4.2 Program SPI NAND with a programmer

Programming addresses: comparison of PC-tool and programmer settings for 128KB flash blocks:

| Programmer image source: SDK default output image | PC programming-tool sector address | Programmer image | Programmer block start address | End address | Firmware size | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| env.img | 0 | env.img | 0x0 | 0x1 | 0x1 | Note 1 |
| idblock.img | 0x40000 | idblock_mutli_copies.img | 0x1 | 0x3 | 0x3 | Note 2 |
| uboot.img | 0x80000 | uboot.img | 0x4 | 0x7 | 0x4 | Note 3 |
| boot.img | 0xC0000 | boot.img | 0x8 | 0x47 | 0x40 |  |
| ... | ... | ... | ... |  |  |  |
| xxx.img | 0x58C0000 | xxx.img | 0x2c6 | 0x3fc | 0x136 | Note 4 |

Table notes:

1. Program env.img in block 0.

2. idblock_mutli_copies.img starts at block 1 and ends at block 3; keep it below partition size with one spare block.

3. Except gpt.img/idblocks.img with special addresses (source wording), use env.img addresses in bytes. Block address = address / block_size: / 0x20000 for 128KB, / 0x40000 for 256KB. Except env.img, leave 1–2 blocks spare in each partition.

4. Reserve the final four flash blocks for the bad-block table. User partitions must not reach this area; consider a reverved partition (source spelling) to prevent use or later misuse. Additional notes:

<!-- Chinese baseline PDF p.46 -->

1. RK SPI NAND FSPI (formerly SFC) has no integrated ECC, so device ECC is required. Programmer images contain no OOB; the programmer fills OOB with FF and must enable device ECC.

2. On nonempty flash, erase all good blocks before programming.

3. Enable programming verification.

### 7.5 SPI NOR image programming: ENV

#### 7.5.1 Create a SPI NOR programming image

Input: SDK output images for PC programming tools.

```text
[/IMAGES] tree
.
├── env.img
├── idblock.img
├── uboot.img
├── boot.img
├── rootfs.img
├── oem.img
└── update.img                  // ⽤以制作烧录镜像
```

Image creation example:

```text
./tools/programmer_image_tool -i update.img  -t SPINOR -o ./out
input firmware is 'update.img'
flash type is 'SPINOR'
output directory is './out'
start to write partitions...env
preparing env at 0x00000000
writing env...OK
preparing idblock at 0x00000200
writing idblock...OK
preparing uboot at 0x00000400
writing uboot...OK
preparing boot at 0x00000600
writing boot...OK
preparing rootfs at 0x00004600
writing rootfs...OK
preparing oem at 0x00014600
writing oem...OK
preparing userdata at 0x0002c600
writing userdata...OK
creating programming image ok.
```

Output: images for the programmer.

<!-- Chinese baseline PDF p.47 -->

```text
tree
.
└── out_image.img
```

#### 7.5.2 Program SPI NOR with a programmer

Program programmer_image_tool output at SPI NOR address 0.

## 8 Test items

### 8.1 NAND Flash product tests

Applies to SLC parallel NAND and SPI NAND products.

#### 8.1.1 flash_stress_test read/write stress testing

Objective: SPI NAND read/write stress stability. Tests are normally integrated into SDK Buildroot; enable rockchip_test. Prepare ten devices with about 30MB reserved in userdata. Procedure:

1. Select “3 flash_stress_test” in SDK Buildroot ./rockchip_test/rockchip_test.sh. Keep power uninterrupted.

Record test logs.

3. Press ctrl + c on the host to stop.

Pass if the device still operates normally after 24 hours; otherwise fail. Search logs for ubi and error to find obvious failures.

#### 8.1.2 power_lost_test unexpected power loss

NAND products, especially batteryless devices, may experience repeated unexpected power loss; targeted robustness testing is recommended. Tests normally exist in SDK Buildroot; add rockchip_test. Prepare ten devices with approximately 30MB free in userdata. Procedure:

1. Select “18 nand power lost test” in ./rockchip_test/rockchip_test.sh. After power cycling, continuous testing starts; record serial logs.

<!-- Chinese baseline PDF p.48 -->

2. Supply power for 14 seconds then remove it for 3 seconds: 17-second cycles for 24 hours, about 5000 power losses. Ensure each restart completes boot and starts the script within 17 seconds.

Record test logs.

4. Stop from the host with: echo off &gt; /data/cfg/rockchip_test/reboot_cnt

Pass if the device still operates normally after 24 hours; otherwise fail. Search logs for ubi and error to find obvious failures.

## 9 Frequently asked questions

### 9.1 NAND Flash information

For UBIFS and IDB (Pre loader) images, obtain NAND parameters from its manual: page size usually 2KB/4KB; OOB usually 64B/128B/256B; pages/block usually 64/128. block size = page_size * page_per_block, usually 128KB/256KB; block size with OOB = (page_size + oob_size) * page_per_block. Programmer and UBIFS images commonly default to 2KB pages/128KB blocks; adjust for other devices after checking the manual.

![English source figure, page 52](/docs/rockchip-flash-open-source/assets/en-p052-figure-01.png)

*English source figure, page 52*

<!-- Chinese baseline PDF p.49 -->

### 9.2 IDB layout

IDB packages ddr.bin and spl.bin as the first firmware after mask ROM. PC tools fill flash blocks 1–7 with backup copies. For programmer placement, see Programming addresses in the programmer chapter.

### 9.3 Measure SPI Flash throughput in the kernel

Choose an idle MTD partition with no mounted filesystem to avoid interference; measure speed with mtd_debug:

```text
#测试准备
dd if=/dev/random of=/tmp/test4M bs=1M count=4
mtd_debug read /dev/mtd6 0 0x400000 /tmp/test_backup
sync

#写速率测试
mtd_debug erase /dev/mtd6 0 0x400000 && sync
time mtd_debug write /dev/mtd6 0 0x400000 /tmp/test4M && time sync

#读测试
time mtd_debug read /dev/mtd6 0 0x400000 /tmp/test4M && time sync

#擦除测试
time mtd_debug erase /dev/mtd6 0 0x400000 && time sync

#测试结束
time mtd_debug write /dev/mtd6 0 0x400000 /tmp/test_backup && time sync
```

SPI NAND nominal-rate example W25N01KVxxIR, AC Electrical Characteristics: 128KB block, 2KB page; typical tBE 2ms, tPP 250us, ECC-enabled tRD 45us. At 100MHz single-line I/O, tIO 160us, programming page_size/(tPP+tIO) is about 5MB/s; kernel defaults to single-line programming. At 100MHz quad I/O, tIO 40us, reading page_size/(tRD+tIO) is about 23MB/s.

<!-- Chinese baseline PDF p.50 -->

Erase ignores I/O delay: block_size/tBE ≈64MB/s. SPI NOR XT25F128B example: 64KB block, 256B page, typical tBE 200ms and tPP 300us, read time near I/O time tIO. At 100MHz single-line and source tIO 160us, programming page_size/(tPP+tIO) ≈557KB/s; kernel defaults to single-line. Reading at 100MHz quad is about 50MB/s. Erase block_size/tBE ≈320KB/s.

### 9.4 NAND product lifetime

NAND erase/program endurance is specified in P/E cycles, commonly 100K. Allow a margin: vendors constrain repeated writes to the same block and sometimes data balance to preserve charge balance. Account for actual endurance and vendor differences, for example use 50%, or 50K cycles. A 100M partition then permits 50K * 100M raw data. Filesystem policy reduces this: UBIFS overhead is around 20% (about 25KB of a 128KB block), giving 50K * 100M * 80% = 4T usable data. With 50% compression this becomes about 8T user data. This estimates only main factors; actual filesystem, compression and device endurance change the result. During boot, UBIFS prints partition P/E information:

```text
ubi0: max/mean erase counter: 164/10, WL threshold: 4096, image sequence number: 207598880
```

Explanation:

<!-- Chinese baseline PDF p.51 -->

max is the largest block erase count in the partition. Compare after stress testing to estimate life: an increase of 100 in 24h with a derated 50K P/E budget suggests 500 days. For testing without a filesystem, the following patch monitors userdata:

```text
diff --git a/drivers/mtd/mtdcore.c b/drivers/mtd/mtdcore.c
index ad527bdbd463..ae34665e5c89 100644
--- a/drivers/mtd/mtdcore.c
+++ b/drivers/mtd/mtdcore.c
@@ -36,6 +36,28 @@

 struct backing_dev_info *mtd_bdi;

+#include <linux/moduleparam.h>
+
+static int e_count;
+module_param(e_count, int, S_IRUGO);
+MODULE_PARM_DESC(e_count, "e_count");
+
+static int p_count;
+module_param(p_count, int, S_IRUGO);
+MODULE_PARM_DESC(p_count, "p_count");
+
+static int r_count;
+module_param(r_count, int, S_IRUGO);
+MODULE_PARM_DESC(r_count, "r_count");
+
+static inline int mtd_trace(struct mtd_info *mtd, char *cmp_name, int len)
+{
+       if (cmp_name && strcmp(mtd->name, cmp_name))
+               return 0;
+       else
+               return len;
+}
+
 #ifdef CONFIG_PM_SLEEP

 static int mtd_cls_suspend(struct device *dev)
@@ -1336,6 +1358,8 @@ int mtd_erase(struct mtd_info *mtd, struct erase_info *instr)
        struct erase_info adjinstr;
        int ret;

+       e_count += mtd_trace(mtd, "userdata", mtd->erasesize);
+
        instr->fail_addr = MTD_FAIL_ADDR_UNKNOWN;
        adjinstr = *instr;

@@ -1467,6 +1491,8 @@ int mtd_read(struct mtd_info *mtd, loff_t from, size_t len, size_t *retlen,
        };
        int ret;

+       r_count += mtd_trace(mtd, "userdata", len);
+
        ret = mtd_read_oob(mtd, from, &ops);
        *retlen = ops.retlen;

@@ -1483,6 +1509,8 @@ int mtd_write(struct mtd_info *mtd, loff_t to, size_t len, size_t *retlen,
        };
        int ret;

+       p_count += mtd_trace(mtd, "userdata", len);
+
        ret = mtd_write_oob(mtd, to, &ops);
        *retlen = ops.retlen;

(END)
```

Install patched firmware, stress-test, then obtain erase/program/read (e/p/r) byte counts with:

```text
cat /sys/module/mtd/parameters/e_count
cat /sys/module/mtd/parameters/p_count
cat /sys/module/mtd/parameters/r_count
```

Calculate MB written per hour. A 50MB partition at 100K P/E nominally supports 5T; estimated life is total data / hourly written data. P/E endurance is the main flash-life metric; other metrics have relatively less impact in the source model.

### 9.5 Unexpected NAND power loss

Unexpected power loss omits normal system deinitialization and can leave NAND operating at unstable voltage. Erase and program operations are most affected: milliseconds for erase, hundreds of microseconds for programming. A 3V3 device normally requires at least 2.7V; consult its manual. Typical failures include incomplete data being written, and:

<!-- Chinese baseline PDF p.53 -->

Commands processed at unstable voltage can cause random faults. Filesystem recovery protects structure against incomplete writes, but data can be lost. PMIC monitors a rail and asserts CPU reset below a threshold, stopping NAND erase/write commands; discharge circuitry sustains working voltage for about 1ms to finish the last operation. Reset IC works similarly. RK NPOR raises an interrupt below threshold and allows voltage-state queries. Prefer battery-backed or constant power. Otherwise monitor VCC IO with PMIC/Reset IC/RK NPOR to reset the CPU before low-voltage writes, and optimize VCC3V3 capacitors using RK drawings to sustain the final operation for tPROG, preferably tBERS if possible. Reduce outages during flash accesses. Protect key data with dual firmware copies and read-only storage; writable partitions should have recovery or OTA. In real product/workload conditions, run power_lost_test and capture VCC3V3/RESETn power-down timing:

![English source figure, page 57](/docs/rockchip-flash-open-source/assets/en-p057-figure-01.png)

*English source figure, page 57*

<!-- Chinese baseline PDF p.54 -->

On the oscilloscope, mark RESETn trigger as Y1 and VCC3V3 falling to 2V7 as Y2 (use the device minimum voltage). Measure ΔY1Y2 repeatedly and take the minimum; signal overlays may help. Some RKNPOR SoCs hide RESETn internally; use the final FSPI CSN falling edge instead, e.g. RV1106.

### 9.6 Kernel Flash signal-test script

The MTD_TESTS framework is in drivers/mtd/tests. For SPI NAND write-signal tests, add delay to skip status polling and avoid excessive status reads.

```text
diff --git a/drivers/mtd/nand/spi/core.c b/drivers/mtd/nand/spi/core.c
index f0ba92a09ae5..3f1d09200f74 100644
--- a/drivers/mtd/nand/spi/core.c
+++ b/drivers/mtd/nand/spi/core.c
@@ -573,6 +573,7 @@ static int spinand_write_page(struct spinand_device *spinand,
        if (ret)
                return ret;

+       mdelay(1);
        ret = spinand_wait(spinand, &status);
        if (!ret && (status & STATUS_PROG_FAILED))
                ret = -EIO;
```

Enable CONFIG_MTD_TESTS=m. Output modules: mtd_readtest.ko, mtd_torturetest.ko. Transfer the stress-test modules:

```text
adb push mtd_readtest.ko mtd_torturetest.ko /data
```

Read/write commands:

<!-- Chinese baseline PDF p.55 -->

```text
insmod /data/mtd_readtest.ko dev=0 cycles_count=10                  # 读测试，可以通过修改 cycles_count 来调整测试时⻓
rmmod mtd_readtest                                                  # 读测试清除，如需重新测试，重新 insmod

insmod /data/mtd_torturetest.ko dev=0 check=0 cycles_count=10 random_pattern=1      # 写测试，可以通过修改 cycles_count 来调整测试时⻓
rmmod mtd_torturetest                                               # 写测试清除，如需重新测试，重新 insmod
```

For reads choose a large partition with valid data so data lines show high/low transitions. For writes choose an idle partition to avoid disrupting the system.

### 9.7 Update or boot failure after replacing Flash with a supported part

New flash components usually require updated storage drivers. Request Redmine access from RK business contacts and synchronize storage patches.

### 9.8 Intermittent boot failures or filesystem read checksum errors

Try signal changes; if stress testing then succeeds, measure and optimize flash signal quality. Lower frequency as described in Kernel Basic Configuration. Try single-line transfer: for MTD set the DTS spiflash spi-rx-bus-width to 1 for single-line write/read. rkflash SPI NAND patch follows:

```text
diff --git a/drivers/rkflash/sfc_nand.c b/drivers/rkflash/sfc_nand.c
index 4accf3d791c6..98b1cfecc821 100644
--- a/drivers/rkflash/sfc_nand.c
+++ b/drivers/rkflash/sfc_nand.c
@@ -1179,6 +1179,8 @@ u32 sfc_nand_init(void)
                return -ENOMEM;
        }

+       p_nand_info->feature &= ~(FEA_4BIT_READ | FEA_4BIT_PROG); // 单线写、单线读
+       // p_nand_info->feature &= (~FEA_4BIT_PROG); // 单线写、四线读
        if (p_nand_info->feature & FEA_4BIT_READ) {
                if ((p_nand_info->has_qe_bits && sfc_nand_enable_QE() == SFC_OK) ||
                    !p_nand_info->has_qe_bits) {
```

rkflash SPI NOR single-line patch:

```text
diff --git a/drivers/rkflash/sfc_nor.c b/drivers/rkflash/sfc_nor.c
index c38801b4fb0d..4badff4249ac 100644
--- a/drivers/rkflash/sfc_nor.c
+++ b/drivers/rkflash/sfc_nor.c
@@ -678,7 +678,9 @@ static int snor_parse_flash_table(struct SFNOR_DEV *p_dev,
                        p_dev->write_status = snor_write_status1;
                else if (i == 2)
                        p_dev->write_status = snor_write_status2;

+               g_spi_flash_info->feature &= ~(FEA_4BIT_READ | FEA_4BIT_PROG); // 单线写、单线读
+               // g_spi_flash_info->feature &= ~(FEA_4BIT_PROG); // 单线写、四线读
                if (g_spi_flash_info->feature & FEA_4BIT_READ) {
                        ret = SFC_OK;
                        if (g_spi_flash_info->QE_bits)
```

### 9.9 Mounting UBIFS with ro does not make it truly read-only

Even with ro mounting, UBIFS background storage algorithms can erase/write NAND. For a truly read-only filesystem, use SquashFS on UBI Block.

### 9.10 SPI NOR ROM fast boot

RK SPI NOR ROM fast boot: PC-tool usbplug adds bootconfig to valid Loader idblock automatically. Programmer default: prebuilt images lack bootconfig, so no ROM fast boot; on first kernel boot idb_bootconfig adds it with one idblock erase/write. Preprocessing alternative: add BOOT0_PARAM to the relevant rkbin/RKBOOT packaging INI to inject bootconfig into idblock.img. Obtain parameters from PC-programming serial logs, for example:

```text
[BOOT0_PARAM]
WORD_0=0x524f4e53
WORD_1=0x0
WORD_2=0xe
WORD_3=0x326b0203
WORD_4=0x90dd820
WORD_5=0x2000000
WORD_6=0x0
WORD_7=0x0
WORD_8=0x0
WORD_9=0x0
```

<!-- Chinese baseline PDF p.57 -->

Add the corresponding information to the INI file:

```text
diff --git a/RKBOOT/RV1103BMINIALL.ini b/RKBOOT/RV1103BMINIALL.ini
index de54116c2106..4b27d284c5f4 100644
--- a/RKBOOT/RV1103BMINIALL.ini
+++ b/RKBOOT/RV1103BMINIALL.ini
@@ -25,3 +25,14 @@ NEWIDB=true
 471_RC4_OFF=true
 RC4_OFF=true
 CREATE_IDB=true
+[BOOT0_PARAM]
+WORD_0=0x524f4e53
+WORD_1=0x0
+WORD_2=0xe
+WORD_3=0x326b0203
+WORD_4=0x90dd820
+WORD_5=0x2000000
+WORD_6=0x0
+WORD_7=0x0
+WORD_8=0x0
+WORD_9=0x0
```

### 9.11 Other troubleshooting

For other issues read Rockchip_Developer_FAQ_Storage_CN.pdf (Redmine spelling: Rokchip_Developer_FAQ_Storage_CN.pdf). For flash fundamentals see Flash Introduction and Device Verification in Rockchip_Application_Notes_Storage_CN.pdf (Redmine: Rockchip_Application_Notes_Storage_CN). For dual-storage drivers see Rockchip_Developer_Guide_Dual_Storage_CN.pdf, also the Redmine path.

## 10 Appendix references

[1] UBI FAQ: http://www.linux-mtd.infradead.org/faq/ubi.html
[2] UBIFS FAQ: http://www.linux-mtd.infradead.org/faq/ubifs.html#L_lebsz_mismatch
[3] MTD FAQ: http://www.linux-mtd.infradead.org/faq/general.html

### English-source additions and exact differences

English §6.1.4 additionally states that ubinize `-p, --peb-size` is mandatory and accepts a physical eraseblock size in bytes, KiB or MiB. `-s, --sub-page-size` specifies the minimum I/O unit used for UBI headers, such as a NAND subpage; by default it equals the minimum I/O unit size.

The English §5.3.2 readback example is `nanddump -o -n --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img -l 0xXXXX`, whereas the Chinese example reads `/dev/mtd4`. English §5.3.4 uses `nanddump --bb=skipbad /dev/mtd3 -f /userdata/boot_read.img -l 0xXXXX`; the Chinese line omits `-f`. Main examples retain the Chinese source. Verify the target partition and installed tool arguments before use; these are not validated executable instructions.

The English ENV programmer table gives idblock Size(block) as `0x6`, versus Chinese `0x3`; xxx.img PC address is English `0x3E000`, versus Chinese `0x58C0000`. Both give Programmer Start(block) `0x2c6`. Tables retain Chinese values; neither layout is represented as validated.

{% endraw %}
