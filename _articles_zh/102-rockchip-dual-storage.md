---
title: "Rockchip 双存储开发完整指南：NOR + eMMC/NVMe、PCIe EP、打包与 OTA"
description: "Rockchip 双存储开发完整指南：NOR + eMMC/NVMe、PCIe EP、打包与 OTA — RK-KF-YF-461 V1.5.1; kernel 4.19+, BOOTROM, U-Boot, Vendor Storage."
translation_key: "102-rockchip-dual-storage"
slug: "102-rockchip-dual-storage"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Dual Storage", "NVMe", "SPI NOR", "EMMC", "PCIe EP", "OTA"]
excerpt: "Rockchip 双存储开发完整指南：NOR + eMMC/NVMe、PCIe EP、打包与 OTA — RK-KF-YF-461 V1.5.1; kernel 4.19+, BOOTROM, U-Boot, Vendor Storage."
---

{% raw %}

# Rockchip 双存储开发完整指南：NOR + eMMC/NVMe、PCIe EP、打包与 OTA

本文完整整理 RK-KF-YF-461 中英文 V1.5.1 技术正文：中文第 4–18 页，英文第 5–19 页。两稿章节对应，以中文保留技术示例和代码，EN/RU/DE 完整翻译；中文使用 5 张中文原图，英文、俄文和德文使用对应 5 张英文原图。原稿适用条件为“具备多个 IO 独立的存储的芯片”、kernel 4.19 及以上；不据此宣称每块 ArmSoM 板卡均支持。须核对实际 SoC、独立 IO、NOR/eMMC/NVMe/SATA 拓扑、电源、SDK/BSP、Loader/U-Boot、内核、Android 分支、分区单位和驱动。RK3588s EVB1、RK3568 EVB1 均为原厂参考板补丁，不是 ArmSoM 直用补丁或实测。未执行烧录、OTA、寄存器写入或硬件验证。

> 重要原文疑点：§7.1 的 vnvm 与 uboot 都从 `0x00000c00` sector 开始，存在重叠；§7.2 uboot 的 byte 偏移又与之不一致。§6.2 SPI NAND 的 mtdparts 数值看起来沿用 sector 形式，与本章其他 byte 示例及文字单位要求需进一步核对。以下全部照录，不猜测改值，不可直接用于生产分区或 OTA。打包脚本包含删除临时文件的命令，本文仅展示，不执行。先备份数据及设备身份。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-dual-storage/EDITORIAL-NOTES.md)

<!-- Chinese baseline PDF p.4 -->

## 1. 简介

<!-- Chinese baseline PDF p.4 -->

多存储支持RK SOC 通常支持多个 IO 独立的存储控制器,如 RK3568 同时支持 Nor flash 与 eMMC,RK3588 支持Nor flash 与 PCIe SSD,对应存储控制器的 IO 相互独立。 而根据是否支持被掩膜代码探测到可将存储器件分为 Bootable 和 Non-bootable 类型,例如:bootable 器件:eMMC、SPI Flash、PP NandNon-bootable 器件:NVMe SSD、SATA(仅 Non-bootable 存储方案掩膜代码无法正常引导启动)应用方案为了支持 Non-bootable 主存方案,所以需要搭配一个 bootable 存储器件,例如:Nor + NVMe SSD\SATA 实现大容量存储支持除此之外,还有以下应用:Nor + eMMC 实现特殊固件保护机制,例如可恢复小系统存储在 Nor 中避免 eMMC 出现不可挽救异常。

<!-- Chinese baseline PDF p.4 -->

## 2. 原理

<!-- Chinese baseline PDF p.4 -->

### 2.1 RK 通用双存储方案启动

<!-- Chinese baseline PDF p.4 -->

![2.1 RK 通用双存储方案启动：中文原图，第 4 页](/docs/rockchip-dual-storage/assets/cn-p004-figure-01.png)

*2.1 RK 通用双存储方案启动：中文原图，第 4 页*

<!-- Chinese baseline PDF p.4 -->

RK 双存储方案流程及固件信息:

<!-- Chinese baseline PDF p.5 -->

| 启动阶段 | 固件存储位置 | 该阶段所初始化的主存储 | 所需配置 |
| --- | --- | --- | --- |
| Bootrom | 芯片掩膜 ROM | bootable storage,例如<br>Nor | \ |
| SPL | bootable storage,例如<br>Nor | bootable storage,例如<br>Nor | \ |
| u-boot | bootable storage,例如<br>Nor | main storage,例如 NVMe | u-boot 特殊配<br>置 |
| kernel | main storage,例如 NVMe | main storage,例如 NVMe | 内核标准配置 |

<!-- Chinese baseline PDF p.5 -->

说明:u-boot 阶段默认初始化前级所用的存储类型,所以此时要转换为初始化主存储,如 NVMe,需要添加 u-boot 特殊配置,详细参考 “配置” 章节

<!-- Chinese baseline PDF p.5 -->

### 2.2 RK PCIe EP 双存储方案启动

<!-- Chinese baseline PDF p.5 -->

RK 部分 SOC 支持 PCIe EP 功能,支持设计为 PCIe EP 标准卡对接通用 PC,因此 PCIe 控制器有 earlyinit 的需求,故增加 pcie_idb.img 镜像实现该功能,流程如下:

<!-- Chinese baseline PDF p.5 -->

![2.2 RK PCIe EP 双存储方案启动：中文原图，第 5 页](/docs/rockchip-dual-storage/assets/cn-p005-figure-01.png)

*2.2 RK PCIe EP 双存储方案启动：中文原图，第 5 页*

<!-- Chinese baseline PDF p.5 -->

RK 双存储方案流程及固件信息:

<!-- Chinese baseline PDF p.6 -->

| 启动阶段 | 固件存储位置 | 该阶段所初始化的主存储 | 所需配置 |
| --- | --- | --- | --- |
| Bootrom | 芯片掩膜 ROM | bootable storage,例如<br>Nor | \ |
| PCIe.bin | bootable storage,例如<br>Nor | NULL | \ |
| SPL | bootable storage,例如<br>Nor | bootable storage,例如<br>Nor | \ |
| u-boot | bootable storage,例如<br>Nor | main storage,例如 NVMe | u-boot 特殊配<br>置 |
| kernel | main storage,例如 NVMe | main storage,例如 NVMe | 内核标准配置 |

<!-- Chinese baseline PDF p.6 -->

说明:u-boot 阶段默认初始化前级所用的存储类型,所以此时要转换为初始化主存储,如 NVMe,需要添加 u-boot 特殊配置,详细参考 “配置” 章节

<!-- Chinese baseline PDF p.6 -->

## 3. 配置

<!-- Chinese baseline PDF p.6 -->

如 “原理” 章节所述,RK 双存储方案 SDK 在 u-boot 阶段修改为初始化目标存储,因此 u-boot 配置需关注以下主存储驱动配置、主存储转换配置和使用 Embedded Kernel DTB 配置。

<!-- Chinese baseline PDF p.6 -->

### 3.1 u-boot 配置

<!-- Chinese baseline PDF p.6 -->

#### 3.1.1 主存储驱动配置

<!-- Chinese baseline PDF p.6 -->

参考 《Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf》 文档 “CH05-驱动模块” 章节:emmc 参考 "Storage" 章节,通常默认兼容PCIe NVMe 参考 “PCIe” 章节

<!-- Chinese baseline PDF p.6 -->

#### 3.1.2 主存储转换配置

<!-- Chinese baseline PDF p.6 -->

defconfig 添加配置;

<!-- Chinese baseline PDF p.6 -->

```text
CONFIG_ROCKCHIP_BOOTDEV="nvme 0"  # 可择 "nvme"-NVMe "mmc"-eMMC "scsi"-SATA
CONFIG_ROCKCHIP_EMMC_IOMUX=y   # Nor + eMMC ⽅案 spl.bin 中完成 eMMC iomux
```

<!-- Chinese baseline PDF p.7 -->

#### 3.1.3 NVMe/SATA 使用 Embedded Kernel DTB 配置

<!-- Chinese baseline PDF p.7 -->

RK u-boot 分为两个阶段:u-boot 初始化早期,使用 u-boot 标准 dtb,dtb 信息量少,相关配置参考 “存储驱动配置” 章节u-boot 后期阶段,可选:using kernel dtb:使用后级镜像中的 kernel dtb 文件,启动过程中解析并初始化对应设备驱动using embedded dtb:打包 u-boot 特定目录下的 dtb 文件到 u-boot 镜像内,启动过程中解析并初始化对应设备驱动 —— 使用该配置using embedded dtbdefconfig 配置:

<!-- Chinese baseline PDF p.7 -->

```text
CONFIG_EMBED_KERNEL_DTB_ALWAYS=y
CONFIG_EMBED_KERNEL_DTB_PATH="dts/rk3588-evb1-lp4-v10.dtb"  # dtb 存放⽬录
CONFIG_SPL_FIT_IMAGE_KB=2560               # 通常使⽤ embedded dtb 后 u-boot 固件会变⼤
```

<!-- Chinese baseline PDF p.7 -->

添加 dtb 文件:编译内核所需的 kernel dtb,存放在 u-boot/dts/ 目录下,建议沿用 kernel dtb 命名以作区分后续如有更新需要,更新替换 dtb 即可

<!-- Chinese baseline PDF p.7 -->

### 3.2 Kernel 配置

<!-- Chinese baseline PDF p.7 -->

使用 Kernel 标准配置。

<!-- Chinese baseline PDF p.7 -->

### 3.3 Android 配置

<!-- Chinese baseline PDF p.7 -->

Android 中修改存储介质为对应的 pcie,用于分区挂载。

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

## 4. 固件分区布局及打包

<!-- Chinese baseline PDF p.8 -->

### 4.1 RK 通用双存储方案固件

<!-- Chinese baseline PDF p.8 -->

默认 SDK 仅支持单存储固件打包,客戶可参考以下脚本修改 SDK 打包脚本,或直接使用新打包方案实现双存储固件打包。工具目录

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

新增 Image-nor 目录编译生成的 Nor flash 固件置于 Image-nor 目录中,其中 parameter.txt 布局可参考如下配置:

<!-- Chinese baseline PDF p.8 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000800@0x00000080(idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.8 -->

修改 mkupdate.sh 脚本以支持双存储打包

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

执行脚本RK3568:

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

### 4.2 RK PCIe EP 双存储方案固件打包

<!-- Chinese baseline PDF p.10 -->

打包方案原理同 RK 通用双存储方案。工具目录

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

说明:pcie_idb.img 请参考以下命令生成,进入 rkbin 目录:

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

nornal_idb.img 请参考以下命令生成,进入 rkbin 目录:

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

新增 Image-flash 目录并设定 parameter 配置SPI Nor 参考:

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000080(pcie_idb),0x00000b80@0x00000480(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

2KB page size SPI Nand 参考:

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000100(pcie_idb),0x00000400@0x00000500(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

4KB page size SPI Nand(兼容 2KB page size) 参考:

<!-- Chinese baseline PDF p.11 -->

```text
CMDLINE:mtdparts=rk29xxnand:0x00000080@0x00000000(gpt),0x00000400@0x00000200(pcie_idb),0x00000400@0x00000600(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.11 -->

修改 mkupdate.sh 脚本以支持双存储打包·同 “RK 通用双存储方案” 相应章节。执行脚本同 “RK 通用双存储方案” 相应章节。

<!-- Chinese baseline PDF p.11 -->

## 5. 固件烧录

<!-- Chinese baseline PDF p.11 -->

RK 烧录工具支持多存储烧录的方式。windows:RKDevTool_Release_v2.93 及以上版本工具,详细参考阅读工具包下的《开发工具用戶手册》中的 “1.12 多设备选择 ” 章节。一次性烧录

<!-- Chinese baseline PDF p.12 -->

![5. 固件烧录：中文原图，第 12 页](/docs/rockchip-dual-storage/assets/cn-p012-figure-01.png)

*5. 固件烧录：中文原图，第 12 页*

<!-- Chinese baseline PDF p.12 -->

仅烧录 SPI Nor设备进入 maskrom mode,仅勾选存储为 SPINOR 固件仅烧录 NVMe设备进入 loader mode,仅勾选存储为 PCIe 固件

<!-- Chinese baseline PDF p.12 -->

## 6. OTA 升级

<!-- Chinese baseline PDF p.12 -->

### 6.1 RK 通用双存储方案 OTA 升级

<!-- Chinese baseline PDF p.12 -->

Nor+ eMMC 为例Nor配置:Nor 部分包含 MiniLoader 、parameter.txt 、 uboot.img 这三个分区都可以支持OTA升级,这里以 uboot 分区举例。不推荐对 MiniLoader 和paramter.txt 分区进行升级,⻛险较高。uboot 分区是在 Nor 的存储设备中,boot 和 rootfs 是在eMMC存储设备中,所以需要在内核中添加 uboot 的分区信息以及 Nor 的设备配置。添加分区信息:基于 “RK 通用双存储方案固件打包” 章节中的 parameter.txt 布局定义recovery dts mtdparts 分区表:

<!-- Chinese baseline PDF p.12 -->

```text
mtdparts=sfc_nor:0x00100000@0x00010000(idb),0x00100000@0x00200000(vnvm),0x00400000@0x00300000(uboot)
```

<!-- Chinese baseline PDF p.12 -->

添加Nor的设备配置:

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

添加成功后即可在根文件系统查看是否存在 /dev/mtdblock 设备。若设备不存在请检查配置信息以及查看开机 log,是否有 spi-nor 相关报错,可能是 iomux 配置错误或者 Nor 的型号不支持等问题。eMMC 配置:eMMC 的分区信息都在 eMMC 设备的 parameter.txt 中,只要在分区表添加对应分区,根文件系统就会生成对应的 mmcblock 设备。Nor 和 eMMC 设备对应的分区节点都生成后,使用 RK OTA 方案可以通过如下链接下载 recovery 补丁,参考补丁说明进行 OTA 升级。自定义升级方案可自由选择方式对分区节点进行升级:

<!-- Chinese baseline PDF p.13 -->

[原稿 recovery 补丁链接（有效性及权限未确认）](https://pan.baidu.com/s/1LiutCDJZ8BXiEN6X8U6teQ?pwd=nwm3) — `nwm3`

<!-- Chinese baseline PDF p.13 -->

### 6.2 RK PCIe EP 双存储方案 OTA 升级

<!-- Chinese baseline PDF p.13 -->

原理同RK 通用双存储方案 OTA 升级,仅修改添加分区信息。基于 “RK PCIe EP 双存储方案固件打包” 章节中的 parameter.txt 布局定义recovery dts mtdparts 分区表:SPI Nor 配置:

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=sfc_nor:0x00080000@0x00010000(pcie_idb),0x00170000@0x00090000(normal_idb),0x00100000@0x00200000(vnvm),0x00400000@0x00300000(uboot)
```

<!-- Chinese baseline PDF p.13 -->

2KB page size SPI Nand 参考:

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=spi-nand0:0x00000080@0x00000000(gpt),0x00000400@0x00000100(pcie_idb),0x00000400@0x00000500(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.13 -->

4KB page size SPI Nand(兼容 2KB page size) 参考:

<!-- Chinese baseline PDF p.13 -->

```text
mtdparts=spi-nand0:0x00000080@0x00000000(gpt),0x00000400@0x00000200(pcie_idb),0x00000400@0x00000600(normal_idb),0x00000800@0x00001000(vnvm),0x00002000@0x00001800(uboot)
```

<!-- Chinese baseline PDF p.14 -->

## 7. SPI NOR VENDOR STORAGE支持

<!-- Chinese baseline PDF p.14 -->

使用SPI NOR + SSD(SATA或NVME)双存储时,SN、MAC等数据是需要写到SPI NOR中。SPI NOR需要定义一个"vnvm"分区来存放VENDOR STORAGE的数据,分区起始位置和大小都需要是64KB的整数倍。

<!-- Chinese baseline PDF p.14 -->

### 7.1 分区表修改

<!-- Chinese baseline PDF p.14 -->

在SPI NOR的分区表文件“parameter.txt”中增加一个"vnvm"分区,单位是sector(512 bytes)。参考:

<!-- Chinese baseline PDF p.14 -->

```text
CMDLINE: mtdparts=rk29xxnand:0x00000200@0x00000c00(vnvm),0x00003000@0x00000c00(uboot)
```

<!-- Chinese baseline PDF p.14 -->

### 7.2 Kernel增加SPI NOR分区表

<!-- Chinese baseline PDF p.14 -->

Kernel需要在dts的CMDLINE里面增加SPI NOR的分区表,和“parameter.txt”里面定义的各个分区的起始位置和大小都相同,单位是byte。参考:

<!-- Chinese baseline PDF p.14 -->

```text
CMDLINE: mtdparts=sfc_nor:0x00040000@0x00180000(vnvm),0x00600000@0x00200000(uboot)
```

<!-- Chinese baseline PDF p.14 -->

## 8. 常⻅问题

<!-- Chinese baseline PDF p.14 -->

### 8.1 Nor Flash 固件分区布局裁剪建议

<!-- Chinese baseline PDF p.14 -->

默认方案双存储中 Nor flash 升级 Loader 固件时会自动布局 idb 镜像,包括升级起始地址和多备份,建议保持默认方案。如需调整 Nor flash 固件分区布局,以下以 RK3568 Nor + eMMC 方案提供建议。AndroidTool 工具固件分区布局:

<!-- Chinese baseline PDF p.15 -->

![8.1 Nor Flash 固件分区布局裁剪建议：中文原图，第 15 页](/docs/rockchip-dual-storage/assets/cn-p015-figure-01.png)

*8.1 Nor Flash 固件分区布局裁剪建议：中文原图，第 15 页*

配置截图的可复制转录如下；保留原图空值及注释，不将其视为推荐默认配置：

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

AndroidTool 工具配置文件修改:

<!-- Chinese baseline PDF p.15 -->

![8.1 Nor Flash 固件分区布局裁剪建议：中文原图，第 15 页](/docs/rockchip-dual-storage/assets/cn-p015-figure-02.png)

*8.1 Nor Flash 固件分区布局裁剪建议：中文原图，第 15 页*

<!-- Chinese baseline PDF p.15 -->

说明:

<!-- Chinese baseline PDF p.15 -->

**1.** 改 Loader 选项为 LoaderToDDR:取消 Loader 选项带来的 idb 镜像自动布局,该 Loader 固件仅做引导升级工具

<!-- Chinese baseline PDF p.15 -->

**2.** SPI Nor 固件:其中 parameter 既能以 parameter 项 - parameter.txt 文件的方式由工具自动分区表升级,又能以 gpt 项 - gpt.img 镜像方式升级

<!-- Chinese baseline PDF p.15 -->

**3.** eMMC 固件:整体同单存储 eMMC 方案,一样要有 parameter.txt 文件生成对应分区表

<!-- Chinese baseline PDF p.15 -->

**4.** 由于取消 idb 镜像自动布局,升级工具需关闭 idb 镜像检测

<!-- Chinese baseline PDF p.16 -->

## 9. 附录

<!-- Chinese baseline PDF p.16 -->

### 9.1 RK3588s EVB1 Nor + NVMe 参考补丁

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

### 9.2 RK3568 EVB1 Nor + eMMC 参考补丁

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

说明:

<!-- Chinese baseline PDF p.18 -->

无需启用 Embedded Kernel DTB 配置

{% endraw %}
