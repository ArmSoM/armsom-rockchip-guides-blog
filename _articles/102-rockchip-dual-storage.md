---
title: "Complete Rockchip Dual-Storage Guide: NOR + EMMC/NVMe, PCIe EP, Packaging and OTA"
description: "Complete Rockchip Dual-Storage Guide: NOR + EMMC/NVMe, PCIe EP, Packaging and OTA — RK-KF-YF-461 V1.5.1; kernel 4.19+, BOOTROM, U-Boot, Vendor Storage."
translation_key: "102-rockchip-dual-storage"
slug: "102-rockchip-dual-storage"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Dual Storage", "NVMe", "SPI NOR", "EMMC", "PCIe EP", "OTA"]
excerpt: "Complete Rockchip Dual-Storage Guide: NOR + EMMC/NVMe, PCIe EP, Packaging and OTA — RK-KF-YF-461 V1.5.1; kernel 4.19+, BOOTROM, U-Boot, Vendor Storage."
---

{% raw %}

# Complete Rockchip Dual-Storage Guide: NOR + EMMC/NVMe, PCIe EP, Packaging and OTA

This article preserves the complete technical body of RK-KF-YF-461 V1.5.1: Chinese pages 4–18 and English pages 5–19. Chapters correspond; technical examples and code follow Chinese, with full English/Russian/German translation. Chinese uses five Chinese original figures; English, Russian and German use the five corresponding English originals. The source scope is chips with multiple I/O-independent storage devices, kernel 4.19 and later; this does not certify every ArmSoM board. Verify actual SoC, independent I/O, NOR/EMMC/NVMe/SATA topology, power, SDK/BSP, Loader/U-Boot, kernel, Android branch, partition units and drivers. RK3588s EVB1 and RK3568 EVB1 patches are vendor reference-board examples, not drop-in ArmSoM patches or measurements. No programming, OTA, register writes or hardware validation were performed.

> Important source issues: §7.1 gives both vnvm and uboot the same start, `0x00000c00` sectors, creating overlap; the §7.2 uboot byte offset also disagrees. §6.2 SPI NAND mtdparts values appear sector-like and require reconciliation with the other byte examples and stated units. All are preserved below without guessed corrections; do not use them directly for production partitioning or OTA. The packaging script deletes temporary files; this page displays but never executes it. Back up data and device identity first.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-dual-storage/EDITORIAL-NOTES.md)

<!-- Chinese baseline PDF p.4 -->

## 1. Introduction

<!-- Chinese baseline PDF p.4 -->

Multi-storage support: RK SoCs commonly have multiple storage controllers with independent I/O. For example, RK3568 supports NOR flash plus eMMC, and RK3588 supports NOR flash plus PCIe SSD. Devices are classified by whether mask-ROM code can detect them:

- Bootable: eMMC, SPI flash, parallel NAND.
- Non-bootable: NVMe SSD and SATA. A system containing only non-bootable storage cannot be started by the mask ROM.

To use non-bootable main storage, pair it with a bootable device, for example NOR + NVMe SSD/SATA for large capacity. Another application is NOR + eMMC firmware protection: a small recovery system in NOR can remain available if eMMC suffers an unrecoverable failure.

<!-- Chinese baseline PDF p.4 -->

## 2. Principle

<!-- Chinese baseline PDF p.4 -->

### 2.1 General RK dual-storage boot scheme

<!-- Chinese baseline PDF p.4 -->

![2.1 General RK dual-storage boot scheme: English original, page 5](/docs/rockchip-dual-storage/assets/en-p005-figure-01.png)

*2.1 General RK dual-storage boot scheme: English original, page 5*

<!-- Chinese baseline PDF p.4 -->

RK dual-storage boot flow and firmware information:

<!-- Chinese baseline PDF p.5 -->

| Boot stage | Firmware location | Primary storage initialized at this stage | Required configuration |
| --- | --- | --- | --- |
| Bootrom | Chip mask ROM | Bootable storage, e.g. NOR | \ |
| SPL | Bootable storage, e.g. NOR | Bootable storage, e.g. NOR | \ |
| u-boot | Bootable storage, e.g. NOR | Main storage, e.g. NVMe | Special U-Boot configuration |
| kernel | Main storage, e.g. NVMe | Main storage, e.g. NVMe | Standard kernel configuration |

<!-- Chinese baseline PDF p.5 -->

U-Boot normally initializes the storage type used by the preceding stage. To switch to main storage such as NVMe, add special U-Boot configuration; see Configuration.

<!-- Chinese baseline PDF p.5 -->

### 2.2 RK PCIe EP dual-storage boot scheme

<!-- Chinese baseline PDF p.5 -->

Some RK SoCs support PCIe EP and can form standard PCIe endpoint cards for general-purpose PCs. Their PCIe controller requires early initialization, provided by an additional pcie_idb.img image. Flow:

<!-- Chinese baseline PDF p.5 -->

![2.2 RK PCIe EP dual-storage boot scheme: English original, page 6](/docs/rockchip-dual-storage/assets/en-p006-figure-01.png)

*2.2 RK PCIe EP dual-storage boot scheme: English original, page 6*

<!-- Chinese baseline PDF p.5 -->

RK dual-storage boot flow and firmware information:

<!-- Chinese baseline PDF p.6 -->

| Boot stage | Firmware location | Primary storage initialized at this stage | Required configuration |
| --- | --- | --- | --- |
| Bootrom | Chip mask ROM | Bootable storage, e.g. NOR | \ |
| PCIe.bin | Bootable storage, e.g. NOR | NULL | \ |
| SPL | Bootable storage, e.g. NOR | Bootable storage, e.g. NOR | \ |
| u-boot | Bootable storage, e.g. NOR | Main storage, e.g. NVMe | Special U-Boot configuration |
| kernel | Main storage, e.g. NVMe | Main storage, e.g. NVMe | Standard kernel configuration |

<!-- Chinese baseline PDF p.6 -->

U-Boot normally initializes the storage type used by the preceding stage. To switch to main storage such as NVMe, add special U-Boot configuration; see Configuration.

<!-- Chinese baseline PDF p.6 -->

## 3. Configuration

<!-- Chinese baseline PDF p.6 -->

As described under Principle, the SDK switches target-storage initialization in U-Boot. Configure the main-storage driver, main-storage transition and Embedded Kernel DTB as follows.

<!-- Chinese baseline PDF p.6 -->

### 3.1 U-Boot configuration

<!-- Chinese baseline PDF p.6 -->

#### 3.1.1 Main-storage driver configuration

<!-- Chinese baseline PDF p.6 -->

See CH05 Driver Modules in Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf:

- eMMC: Storage chapter; normally compatible by default.
- PCIe NVMe: PCIe chapter.

<!-- Chinese baseline PDF p.6 -->

#### 3.1.2 Main-storage transition configuration

<!-- Chinese baseline PDF p.6 -->

Add to defconfig:

<!-- Chinese baseline PDF p.6 -->

```text
CONFIG_ROCKCHIP_BOOTDEV="nvme 0"  # 可择 "nvme"-NVMe "mmc"-eMMC "scsi"-SATA
CONFIG_ROCKCHIP_EMMC_IOMUX=y   # Nor + eMMC ⽅案 spl.bin 中完成 eMMC iomux
```

<!-- Chinese baseline PDF p.7 -->

#### 3.1.3 Embedded Kernel DTB for NVMe/SATA

<!-- Chinese baseline PDF p.7 -->

RK U-Boot has two stages:

- Early initialization uses the standard U-Boot DTB with limited information; see Main Storage Driver Configuration.
- Later initialization offers two choices: using kernel dtb loads the DTB from a subsequent image and initializes its drivers; using embedded dtb packages a DTB from a U-Boot directory into the U-Boot image and initializes drivers from it. Use the embedded option here.

Embedded-DTB defconfig:

<!-- Chinese baseline PDF p.7 -->

```text
CONFIG_EMBED_KERNEL_DTB_ALWAYS=y
CONFIG_EMBED_KERNEL_DTB_PATH="dts/rk3588-evb1-lp4-v10.dtb"  # dtb 存放⽬录
CONFIG_SPL_FIT_IMAGE_KB=2560               # 通常使⽤ embedded dtb 后 u-boot 固件会变⼤
```

<!-- Chinese baseline PDF p.7 -->

Add the DTB: compile the required kernel DTB and place it under u-boot/dts/. Retain its kernel filename for clarity. Replace it there when updates are needed.

<!-- Chinese baseline PDF p.7 -->

### 3.2 Kernel configuration

<!-- Chinese baseline PDF p.7 -->

Use standard kernel configuration.

<!-- Chinese baseline PDF p.7 -->

### 3.3 Android configuration

<!-- Chinese baseline PDF p.7 -->

In Android, change the storage medium to the corresponding PCIe device for partition mounting:

<!-- Chinese baseline PDF p.7 -->

```text
@sys2_206:~/4_Android12_29_sdk/device/rockchip/rk3588$ git diff
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -25,7 +25,7 @@ PRODUCT_KERNEL_CONFIG ?= rockchip_defconfig pcie_wifi.config

#BOARD_AVB_ENABLE := true
# used for fstab_generator, sdmmc controller address
-PRODUCT_BOOT_DEVICE := fe2e0000.mmc
+PRODUCT_BOOT_DEVICE := fe180000.pcie
PRODUCT_SDMMC_DEVICE := fe2c0000.mmc

SF_PRIMARY_DISPLAY_ORIENTATION := 0
```

<!-- Chinese baseline PDF p.8 -->

## 4. Firmware partition layout and packaging

<!-- Chinese baseline PDF p.8 -->

### 4.1 General RK dual-storage firmware

<!-- Chinese baseline PDF p.8 -->

The default SDK packages only single-storage firmware. Adapt its packaging scripts using the example below, or use the new packaging scheme directly for dual-storage firmware.

Tool directory:

<!-- Chinese baseline PDF p.8 -->

```text
.
├── afptool
├── gen-package-file.sh
├── Image             # main storage 固件
│ ├── boot.img
│ ├── MiniLoaderAll.bin
│ ├── parameter.txt
│ └── userdata.img
├── Image-nor            # boot storage 固件
│ ├── MiniLoaderAll.bin
│ ├── parameter.txt
│ └── uboot.img
├── mkupdate.sh
└── rkImageMaker
```

<!-- Chinese baseline PDF p.8 -->

Create Image-nor and put the compiled NOR firmware there. Example parameter.txt layout:

<!-- Chinese baseline PDF p.8 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000800@0x00000080(idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.8 -->

Modify mkupdate.sh for dual-storage packaging:

<!-- Chinese baseline PDF p.8 -->

```text
#!/bin/bash
# Author: kenjc@rock-chips.com
# 2021-08-13
# Use: ./mkupdate.sh PLATFORM IMAGE_PATH to pack update.img

declare -A vendor_id_map
vendor_id_map["rk3588"]="-RK3588"
vendor_id_map["rk356x"]="-RK3568"
vendor_id_map["rk3326"]="-RK3326"
vendor_id_map["px30"]="-RKPX30"
vendor_id_map["rk3368"]="-RK330A"
vendor_id_map["rk322x"]="-RK322A"
vendor_id_map["rk3399pro"]="-RK330C"
vendor_id_map["rk3328"]="-RK322H"
vendor_id_map["rk3288"]="-RK32"
vendor_id_map["rk3126c"]="-RK312A"
vendor_id_map["rk3399"]="-RK330C"

readonly PLATFORM=$1
readonly IMAGE_PATH=$2
readonly IMAGE_PATH_NOR=$3
readonly PACKAGE_FILE=package-file-tmp

echo "packing update.img with $IMAGE_PATH ${vendor_id_map[$PLATFORM]}"

pause() {
 echo "Press any key to quit:"
 read -n1 -s key
 exit 1
}

if [ ! -f "$IMAGE_PATH/parameter.txt" ]; then
  echo "Error:No found parameter!"
# pause
fi

echo "regenernate $PACKAGE_FILE..."
if [ -f "$PACKAGE_FILE" ]; then
  rm -rf $PACKAGE_FILE
fi
./gen-package-file.sh $IMAGE_PATH > $PACKAGE_FILE

echo "start to make emmc update.img..."
./afptool -pack ./ $IMAGE_PATH/update.img $PACKAGE_FILE || pause
./rkImageMaker ${vendor_id_map[$PLATFORM]} $IMAGE_PATH/MiniLoaderAll.bin $IMAGE_PATH/update.img emmc_update.img -os_type:androidos -storage:emmc || pause
echo "Making emmc_update.img OK."

echo "regenernate $PACKAGE_FILE..."
if [ -f "$PACKAGE_FILE" ]; then
  rm -rf $PACKAGE_FILE
fi

./gen-package-file.sh $IMAGE_PATH_NOR > $PACKAGE_FILE

echo "start to make spinor update.img..."

./afptool -pack ./ $IMAGE_PATH_NOR/update.img $PACKAGE_FILE || pause
./rkImageMaker ${vendor_id_map[$PLATFORM]} $IMAGE_PATH_NOR/MiniLoaderAll.bin $IMAGE_PATH_NOR/update.img spinor_update.img -os_type:androidos -storage:spinor || pause
echo "Making spi_update.img OK."

./rkImageMaker -merge ./update.img ./emmc_update.img ./spinor_update.img
rm ./spinor_update.img ./emmc_update.img

exit 0
```

<!-- Chinese baseline PDF p.9 -->

Run the script — RK3568:

<!-- Chinese baseline PDF p.9 -->

```text
./mkupdate.sh rk356x Image/ Image-nor/
```

<!-- Chinese baseline PDF p.10 -->

RK3588:

<!-- Chinese baseline PDF p.10 -->

```text
./mkupdate.sh rk3588 Image/ Image-nor/
```

<!-- Chinese baseline PDF p.10 -->

### 4.2 RK PCIe EP dual-storage firmware packaging

<!-- Chinese baseline PDF p.10 -->

The packaging principle is the same as the general RK dual-storage scheme. Tool directory:

<!-- Chinese baseline PDF p.10 -->

```text
.
├── afptool
├── gen-package-file.sh
├── Image          # main storage 固件
│ ├── boot.img
│ ├── MiniLoaderAll.bin
│ ├── parameter.txt
│ └── userdata.img
├── Image-flash        # boot storage 固件
│ ├── MiniLoaderAll.bin
│ ├── normal_idb.img     # idblock.img，包含 ddr.bin 和 spl.bin
│ ├── parameter.txt
│ ├── pcie_idb.img      # PCIe_idblock.img，源码⼯程 bootloader-ep 默认输出双备份镜像，包含 pcie.bin
│ └── uboot.img
├── mkupdate.sh
└── rkImageMaker
```

<!-- Chinese baseline PDF p.10 -->

Generate pcie_idb.img using the following commands from rkbin:

<!-- Chinese baseline PDF p.10 -->

```text
#⽣成 loader
./tools/boot_merger RKBOOT/RK3588MINIALL_PCIE_EP.ini
$ls rk3588_pcie_loader_v1.00.bin
rk3588_pcie_loader_v1.00.bin

#制作 idb，要求使⽤ spinand type 做对⻬
./tools/programmer_image_tool -i rk3588_pcie_loader_v1.00.bin -b 128 -p 2 -t spinand -o ./

#制作双备份的 pcie_idb.img
cat idblock.img > pcie_idb.img
cat idblock.img >> pcie_idb.img
rm idblock.img
```

<!-- Chinese baseline PDF p.10 -->

Generate normal_idb.img from rkbin using these commands. The Chinese prose misspells it nornal_idb.img; the actual command filename is preserved:

<!-- Chinese baseline PDF p.11 -->

```text
#⽣成 loader
./tools/boot_merger RKBOOT/RK3588MINIALL.ini
$ls rk3588_spl_loader_v1.14.113.bin
rk3588_spl_loader_v1.14.113.bin

#制作 idb，要求使⽤ spinand type 做对⻬
./tools/programmer_image_tool -i rk3588_spl_loader_v1.14.113.bin -b 128 -p 2 -t spinand -o ./

#制作双备份的 normal_idb.img
cat idblock.img > normal_idb.img
cat idblock.img >> normal_idb.img
rm idblock.img
```

<!-- Chinese baseline PDF p.11 -->

Create Image-flash and configure parameter. SPI NOR example:

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000080(pcie_idb),0x00000b80@0x00000480(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

2KB-page SPI NAND example:

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000100(pcie_idb),0x00000400@0x00000500(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

4KB-page SPI NAND example (also compatible with 2KB pages):

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000200(pcie_idb),0x00000400@0x00000600(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

Modify mkupdate.sh and execute it as described in the general RK dual-storage packaging section.

<!-- Chinese baseline PDF p.11 -->

## 5. Firmware programming

<!-- Chinese baseline PDF p.11 -->

RK tools support programming multiple storage devices. On Windows, use RKDevTool_Release_v2.93 or later; see §1.12 Multi-device Selection in the Development Tools User Manual supplied with the tool.

Program both in one operation:

<!-- Chinese baseline PDF p.12 -->

![5. Firmware programming: English original, page 13](/docs/rockchip-dual-storage/assets/en-p013-figure-01.png)

*5. Firmware programming: English original, page 13*

<!-- Chinese baseline PDF p.12 -->

SPI NOR only: enter maskrom and select only firmware whose storage is SPINOR.

NVMe only: enter Loader mode and select only PCIe-storage firmware.

<!-- Chinese baseline PDF p.12 -->

## 6. OTA upgrade

<!-- Chinese baseline PDF p.12 -->

### 6.1 General RK dual-storage OTA

<!-- Chinese baseline PDF p.12 -->

NOR + eMMC example. The NOR side contains MiniLoader, parameter.txt and uboot.img, all described as OTA-capable. The example updates uboot. Updating MiniLoader or parameter.txt is not recommended because the risk is high.

U-Boot resides in NOR, while boot/rootfs reside in eMMC. Add the U-Boot partition and NOR device configuration to the kernel. Based on parameter.txt in the general dual-storage packaging section, define recovery-DTS mtdparts as follows:

<!-- Chinese baseline PDF p.12 -->

```text
mtdparts=sfc_nor:0x00100000@0x00010000(idb),0x00100000@0x00200000(vnvm),0x00400000@0x00300000(uboot)
```

<!-- Chinese baseline PDF p.12 -->

Add the NOR device configuration:

<!-- Chinese baseline PDF p.13 -->

```text
&sfc {
   status = "okay";
   pinctrl-names = "default";
   pinctrl-0 = <&fspim1_pins>;       // 选择实际 io
   flash@0 {
       compatible = "jedec,spi-nor";
       reg = <0>;
       spi-max-frequency = <75000000>;
       spi-rx-bus-width = <4>;
       spi-tx-bus-width = <1>;
   };
};
```

<!-- Chinese baseline PDF p.13 -->

After adding it, check for /dev/mtdblock in the root filesystem. If absent, inspect configuration and boot logs for SPI-NOR errors, such as incorrect iomux or an unsupported NOR model.

EMMC configuration: its partition information resides in the EMMC parameter.txt. Adding the relevant partitions generates corresponding mmcblock devices in the root filesystem. Once both NOR and EMMC partition nodes exist, obtain the recovery patch from the source link and follow its OTA instructions. A custom updater can choose its own method of writing these partition nodes:

<!-- Chinese baseline PDF p.13 -->

[Source recovery-patch link (availability/access not verified)](https://pan.baidu.com/s/1LiutCDJZ8BXiEN6X8U6teQ?pwd=nwm3) — `nwm3`

<!-- Chinese baseline PDF p.13 -->

### 6.2 RK PCIe EP dual-storage OTA

<!-- Chinese baseline PDF p.13 -->

The principle matches general RK dual-storage OTA; only partition information changes. Based on parameter.txt in the PCIe-EP packaging section, add recovery-DTS mtdparts. SPI NOR:

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=sfc_nor:0x00080000@0x00010000(pcie_idb),0x00170000@0x00090000(normal_idb),0x00100000@0x00200000(vnvm),0x00400000@0x00300000(uboot)
```

<!-- Chinese baseline PDF p.13 -->

2KB-page SPI NAND example:

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=spi-nand0:0x00000080@0x00000000(gpt),0x00000400@0x00000100(pcie_idb),0x00000400@0x00000500(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.13 -->

4KB-page SPI NAND example (also compatible with 2KB pages):

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=spi-nand0:0x00000080@0x00000000(gpt),0x00000400@0x00000200(pcie_idb),0x00000400@0x00000600(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.14 -->

## 7. SPI NOR Vendor Storage support

<!-- Chinese baseline PDF p.14 -->

With SPI NOR + SSD (SATA or NVMe), store SN, MAC and similar data in SPI NOR. Define a vnvm partition for Vendor Storage; both its offset and size must be multiples of 64KB.

<!-- Chinese baseline PDF p.14 -->

### 7.1 Modify the partition table

<!-- Chinese baseline PDF p.14 -->

Add vnvm to SPI NOR parameter.txt. Units are sectors (512 bytes). Source example:

<!-- Chinese baseline PDF p.14 -->

```text
CMDLINE: mtdparts=rk29xxnand:0x00000200@0x00000c00(vnvm),0x00003000@0x00000c00(uboot)
```

<!-- Chinese baseline PDF p.14 -->

### 7.2 Add SPI NOR partitions in the kernel

<!-- Chinese baseline PDF p.14 -->

Add the SPI NOR partition table to kernel DTS CMDLINE, matching each parameter.txt partition offset and size but expressed in bytes. Source example:

<!-- Chinese baseline PDF p.14 -->

```text
CMDLINE: mtdparts=sfc_nor:0x00040000@0x00180000(vnvm),0x00600000@0x00200000(uboot)
```

<!-- Chinese baseline PDF p.14 -->

## 8. Frequently asked questions

<!-- Chinese baseline PDF p.14 -->

### 8.1 Trimming the NOR firmware partition layout

<!-- Chinese baseline PDF p.14 -->

By default, NOR Loader upgrades automatically place IDB images, including their start offset and multiple copies. Keep that scheme if possible. If changing NOR partition layout, the following RK3568 NOR + eMMC example gives guidance. AndroidTool firmware partition layout:

<!-- Chinese baseline PDF p.15 -->

![8.1 Trimming the NOR firmware partition layout: English original, page 16](/docs/rockchip-dual-storage/assets/en-p016-figure-01.png)

*8.1 Trimming the NOR firmware partition layout: English original, page 16*

<!-- Chinese baseline PDF p.15 -->

Modify the AndroidTool configuration file:

<!-- Chinese baseline PDF p.15 -->

![8.1 Trimming the NOR firmware partition layout: English original, page 17](/docs/rockchip-dual-storage/assets/en-p017-figure-01.png)

*8.1 Trimming the NOR firmware partition layout: English original, page 17*

The tool screenshots above come from the English PDF, whose interface and configuration comments remain Chinese. Editable transcription of the configuration screenshot follows; empty values are preserved and are not recommended defaults:

```ini
MSC_VIDPID=
ADB_VIDPID=
MTP_VIDPID=
UVC_VIDPID=

#指定是否支持全速usb设备,当SUPPORTLOWUSB=TRUE时,增加全速usb设备支持,默认只支持高速usb设备
SUPPORTLOWUSB=true
#设置烧写固件时单次传输的数据带宽,取值在[0-6]之间,6代表1M,5代表512K,0代表16K
FORCE_DATA_BAND=
MSC_TIMEOUT=30
ROCKUSB_TIMEOUT=30
#指定启动时加载的镜像配置文件,默认为config.cfg
DEFAULT_IMAGE_CONFIG=config.cfg
#下载Image镜像后是否进行设备重启
RESET_AFTER_DOWNLOAD=TRUE
#当设置FW_NOT_CHECK=TRUE时,固件加载时不进行完整性校验
FW_NOT_CHECK=TRUE
#当设置RB_CHECK_OFF=FALSE时,固件升级时才进行回读校验
RB_CHECK_OFF=
#LBA_PARITY=TRUE时,设备端开启写后校验
LBA_PARITY=
#NorFlash单个IDBlock
NOR_SINGLE_IDB=
#当设置CLOSE_CHECK_IDB=TRUE时,不检查IDBLOCK是否会被覆盖
CLOSE_CHECK_IDB=TRUE
#自动保存配置
AUTO=true
```

<!-- Chinese baseline PDF p.15 -->

Explanation:

<!-- Chinese baseline PDF p.15 -->

**1.** Change Loader to LoaderToDDR to disable automatic IDB layout. This Loader then only starts the upgrade tool.

<!-- Chinese baseline PDF p.15 -->

**2.** SPI NOR firmware: update the partition table automatically with parameter / parameter.txt, or explicitly with gpt / gpt.img.

<!-- Chinese baseline PDF p.15 -->

**3.** EMMC firmware follows the single-storage EMMC scheme and still requires parameter.txt to generate its partition table.

<!-- Chinese baseline PDF p.15 -->

**4.** Because automatic IDB layout is disabled, disable IDB-image checking in the upgrade tool.

<!-- Chinese baseline PDF p.16 -->

## 9. Appendix

<!-- Chinese baseline PDF p.16 -->

### 9.1 RK3588s EVB1 NOR + NVMe reference patch

<!-- Chinese baseline PDF p.16 -->

```text
From 89825ff12bc92ba9dd9e063e9835ecb03b732b92 Mon Sep 17 00:00:00 2001
From: Jon Lin <jon.lin@rock-chips.com>
Date: Fri, 19 Nov 2021 20:57:52 +0800
Subject: [PATCH] TEST: uboot: rk3588s-tablet&evb1: nvme

Change-Id: I332fcceb8984712a4cd3eec053f813590f4e9bbe
Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
---
arch/arm/dts/rk3588-u-boot.dtsi | 34 +++++++++++++++++++++++++++++++++
configs/rk3588_defconfig   | 12 ++++++++++++
2 files changed, 46 insertions(+)

diff --git a/arch/arm/dts/rk3588-u-boot.dtsi b/arch/arm/dts/rk3588-u-boot.dtsi
index 3fe8054aac..25ebf26873 100644
--- a/arch/arm/dts/rk3588-u-boot.dtsi
+++ b/arch/arm/dts/rk3588-u-boot.dtsi
@@ -22,6 +22,33 @@
   compatible = "rockchip,rk3588-secure-otp";
   reg = <0x0 0xfe3a0000 0x0 0x4000>;
  };
+
+ vcc12v_dcin: vcc12v-dcin {
+   u-boot,dm-pre-reloc;
+   compatible = "regulator-fixed";
+   regulator-name = "vcc12v_dcin";
+   regulator-always-on;
+   regulator-boot-on;
+   regulator-min-microvolt = <12000000>;
+   regulator-max-microvolt = <12000000>;
+ };
+
+ vcc3v3_pcie20: vcc3v3-pcie20 {
+   u-boot,dm-pre-reloc;
+   compatible = "regulator-fixed";
+   regulator-name = "vcc3v3_pcie20";
+   regulator-min-microvolt = <3300000>;
+   regulator-max-microvolt = <3300000>;
+   enable-active-high;
+   gpio = <&gpio4 RK_PB1 GPIO_ACTIVE_HIGH>;
+   startup-delay-us = <5000>;
+   vin-supply = <&vcc12v_dcin>;
+ };
+};
+
+&combphy2_psu {
+ u-boot,dm-pre-reloc;
+ status = "okay";
};
&firmware {
@@ -201,6 +228,13 @@
  u-boot,dm-spl;
};

+&pcie2x1l1 {
+ u-boot,dm-pre-reloc;
+ reset-gpios = <&gpio4 RK_PA2 GPIO_ACTIVE_HIGH>;
+ vpcie3v3-supply = <&vcc3v3_pcie20>;
+ status = "okay";
+};
+
&pinctrl {
  u-boot,dm-spl;
  /delete-node/ sdmmc;
diff --git a/configs/rk3588_defconfig b/configs/rk3588_defconfig
index f65da00444..f9fbaa145b 100644
--- a/configs/rk3588_defconfig
+++ b/configs/rk3588_defconfig
@@ -226,3 +226,15 @@ CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V2=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_CMD_PCI=y
+CONFIG_NVME=y
+CONFIG_PCI=y
+CONFIG_DM_PCI=y
+CONFIG_DM_PCI_COMPAT=y
+CONFIG_PCIE_DW_ROCKCHIP=y
+CONFIG_PHY_ROCKCHIP_NANENG_COMBOPHY=y
+CONFIG_PHY_ROCKCHIP_SNPS_PCIE3=y
+CONFIG_DM_REGULATOR_FIXED=y
+CONFIG_ROCKCHIP_BOOTDEV="nvme 0"
+CONFIG_EMBED_KERNEL_DTB_ALWAYS=y
+CONFIG_SPL_FIT_IMAGE_KB=2560
--
2.17.1
```

<!-- Chinese baseline PDF p.17 -->

### 9.2 RK3568 EVB1 NOR + eMMC reference patch

<!-- Chinese baseline PDF p.17 -->

```text
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index d157307403..82801f3dcb 100644
--- a/configs/rk3568_defconfig
+++ b/configs/rk3568_defconfig
@@ -222,3 +222,5 @@ CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V2=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_ROCKCHIP_EMMC_IOMUX=y
+CONFIG_ROCKCHIP_BOOTDEV="mmc 0"
```

<!-- Chinese baseline PDF p.17 -->

Note:

<!-- Chinese baseline PDF p.18 -->

Embedded Kernel DTB need not be enabled for this reference patch.

{% endraw %}
