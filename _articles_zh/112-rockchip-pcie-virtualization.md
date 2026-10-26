---
title: "Rockchip PCIe 设备虚拟化：QEMU、KVM、SMMU 与 VFIO 完整指南"
description: "Rockchip PCIe 设备虚拟化：QEMU、KVM、SMMU 与 VFIO 完整指南 — RK-KF-YF-170 V1.0.0, kernel 4.19, RK3588."
translation_key: "112-rockchip-pcie-virtualization"
slug: "112-rockchip-pcie-virtualization"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "PCIe", "QEMU", "KVM", "SMMU", "VFIO"]
excerpt: "Rockchip PCIe 设备虚拟化：QEMU、KVM、SMMU 与 VFIO 完整指南 — RK-KF-YF-170 V1.0.0, kernel 4.19, RK3588."
---

{% raw %}

# Rockchip PCIe 设备虚拟化：QEMU、KVM、SMMU 与 VFIO 完整指南

本文完整整理中文 RK-KF-YF-170 V1.0.0 技术正文（第 4–7 页）及技术前言。方案基于 QEMU + ARM KVM + PCIe + SMMU + VFIO，使虚拟机直接访问 PCIe 外设，包括挂载 NVMe SSD 和连接 PCIe 网卡。原稿适用带 SMMU 的 Rockchip 芯片、内核 4.19，寄存器以 RK3588 为例。用于 ArmSoM 时须逐板核对 SoC 的 SMMU/PCIe、内核分支、BSP、设备树和 IOMMU 隔离；本文是平台参考，未进行 ArmSoM 硬件验证。只有中文 PDF，英文、俄文、德文完整译自中文；原稿无独立技术图片。

> 原文待核对：Realtek 8169 示例的 device ID 写为 `0000`，保留原值，实际操作须以 `lspci` 输出为准。末章 `dev->archdata.dma_coherent = false;` 是原文针对其环境的处理，需核对目标内核结构及一致性要求。原文称提供预编译 ramdisk，但当前输入仅 PDF，没有附带固件，本文不声称提供这些文件。解除驱动绑定会中断该设备在宿主机中的使用；以下仅为参考命令，未执行。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. 环境搭建

### 1.1 Guest OS内核配置

使能如下配置。

```text
CONFIG_ARM64_VA_BITS_39=y
CONFIG_ARM64_VA_BITS=39
```

关闭如下配置。

```text
CONFIG_HUGETLBFS
CONFIG_HUGETLB_PAGE
```

使用以下命令生成guest os内核固件。

```text
make ARCH=arm64
```

固件位置。

```text
arch/arm64/boot/Image
```

### 1.2 Guest OS ramdisk准备

包含busybox工具,lspci,ifconfig工具。

### 1.3 HOST OS内核配置

在rockchip_defconfig基础上再使能如下配置。

```text
CONFIG_KVM
CONFIG_VFIO
CONFIG_VFIO_PCI
CONFIG_IOMMU_SUPPORT
CONFIG_ARM_SMMU_V3
CONFIG_VFIO_IOMMU_TYPE1
CONFIG_BLK_DEV_NVME
CONFIG_R8169
CONFIG_PCIE_DW
CONFIG_PCIE_DW_HOST
CONFIG_PCIE_DW_ROCKCHIP
```

### 1.4 QEMU准备

使用Rockchip的buildroot工程编译qemu,可执行文件名称qemu-system-aarch64。

### 1.5 Host OS ramdisk准备

使用Rockchip的buildroot工程生成ramdisk,包含qemu-system-aarch64,guest os内核固件,guestos ramdisk固件。Rockchip的buildroot工程配置以及编译方法参考buildroot使用文档,本指南提供预先编译好的ramdisk目录,包含需要的所有固件,在ubuntu环境下,使用abootimg-pack-initrd,会在ramdisk同级目录生成initrd.img固件,使用abootimg-unpack-initrd解压initrd.img。

## 2. DTS 配置

### 2.1 SMMU配置

```text
compatible = "arm,smmu-v3";
```

必须配置,用于匹配ARM SMMU-v3驱动。以下寄存器以及中断配置以RK3588为例。

```text
reg = <0x0 0xfc900000 0x0 0x100000>;
```

ARM SMMU-v3基地址以及大小。

```text
interrupts = <GIC_SPI 369 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 371 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 374 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 367 IRQ_TYPE_EDGE_RISING>;
interrupt-names = "eventq", "gerror", "priq", "cmdq-sync";
```

详⻅Documentation/devicetree/bindings/iommu/arm,smmu-v3.txt。

```text
#iommu-cells = <1>;
```

必须为1,用于描述设备的stream ID,详⻅Documentation/devicetree/bindings/iommu/arm,smmu-v3.txt。

### 2.2 PCIe补充配置

```text
iommu-map = <0x0 &smmu 0x0 0x10000>;
```

为PCIe外设创建SMMU⻚表。

## 3. 运行

1. 卸载宿主机PCIe设备驱动使用lspci得到设备地址,假设设备地址为0002:21:00.0,执行以下命令卸载。

```text
echo 0002:21:00.0 > /sys/bus/pci/devices/0002\:21\:00.0/driver/unbind
```

2. 将PCIe设备重新挂载到VFIO-PCI驱动使用lspci得到设备vendor id和device id,以Realtek 8169PCIe网卡为例,vendor id和device id分别为10ec,0000,使用以下命令挂载。

```text
echo 10ec 0000 > /sys/bus/pci/drivers/vfio-pci/new_id
```

3. 运行qemu

```text
qemu-system-aarch64 -nographic -monitor none -m 128 -machine virt,highmem=off -serial stdio -cpu host -enable-kvm  -device vfio-pci,host=0002:21:00.0 -kernel /Image -initrd /ramdisk_ok.img
```

以下qemu参数说明。

```text
qemu-system-aarch64
```

Rockchip buildroot编译出来的qemu二进制文件,放在host os根文件系统的bin/目录下。

```text
-m 128
```

为虚拟机创建128M的内存空间。

```text
highmem=off
```

使用低32位地址空间。

```text
-device vfio-pci,host=0002:21:00.0
```

使用PCIe设备地址作为参数创建vfio设备,用于虚拟机访问。

```text
-kernel /Image -initrd /ramdisk_ok.img
```

分别是guset os内核固件,guest os根文件系统固件,这里将这两个固件放在host os根文件系统的根目录。

4. 待虚拟机启动完成,使用以下命令配置PCIe网卡

```text
ifconfig eth0 up

ifconfig eth0 192.168.31.120 netmask 255.255.255.0

route add default gw 192.168.31.1
```

地址以及网关根据实际情况配置。

5. 实用以下命令测试网络连接

```text
ping 8.8.8.8
```

正常情况下,能看到ping信息。

## 4. 遗留问题

在虚拟机里面PCIe设备默认被设置为coherent属性,所以申请的dma buffer被设置成cacheable,从而导致数据一致性的问题,需要在虚拟机PCIe设备probe时候,手动设置为non-coherent,如下,才能规避数据一致性问题。

```text
dev->archdata.dma_coherent = false;
```

{% endraw %}
