---
title: "Rockchip PCIe Device Virtualization: Complete QEMU, KVM, SMMU and VFIO Guide"
description: "Rockchip PCIe Device Virtualization: Complete QEMU, KVM, SMMU and VFIO Guide — RK-KF-YF-170 V1.0.0, kernel 4.19, RK3588."
translation_key: "112-rockchip-pcie-virtualization"
slug: "112-rockchip-pcie-virtualization"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "PCIe", "QEMU", "KVM", "SMMU", "VFIO"]
excerpt: "Rockchip PCIe Device Virtualization: Complete QEMU, KVM, SMMU and VFIO Guide — RK-KF-YF-170 V1.0.0, kernel 4.19, RK3588."
---

{% raw %}

# Rockchip PCIe Device Virtualization: Complete QEMU, KVM, SMMU and VFIO Guide

This article preserves the complete technical body (pages 4–7) and technical preface of Chinese RK-KF-YF-170 V1.0.0. QEMU + ARM KVM + PCIe + SMMU + VFIO lets a virtual machine directly access PCIe peripherals, including mounting NVMe SSDs and connecting PCIe NICs. The source covers Rockchip chips with SMMU and kernel 4.19, using RK3588 registers as an example. For ArmSoM, verify the individual board’s SoC SMMU/PCIe, kernel branch, BSP, device tree and IOMMU isolation. This is a platform reference without ArmSoM hardware validation. Only a Chinese PDF is available; English, Russian and German are full translations. The original has no independent technical figures.

> Source items to verify: the Realtek 8169 example gives device ID `0000`; it is retained, but use the actual lspci output on hardware. The final `dev->archdata.dma_coherent = false;` workaround is source-specific; verify target-kernel structures and consistency requirements. The source mentions a prebuilt ramdisk, but only the PDF was supplied, not firmware; this article does not claim to supply it. Unbinding interrupts host use of the device. Commands below are reference examples and were not executed.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. Environment setup

### 1.1 Guest OS kernel configuration

Enable the following options.

```text
CONFIG_ARM64_VA_BITS_39=y
CONFIG_ARM64_VA_BITS=39
```

Disable the following options.

```text
CONFIG_HUGETLBFS
CONFIG_HUGETLB_PAGE
```

Build the guest OS kernel image with the following command.

```text
make ARCH=arm64
```

Image location:

```text
arch/arm64/boot/Image
```

### 1.2 Guest OS ramdisk preparation

Include busybox, lspci and ifconfig.

### 1.3 HOST OS kernel configuration

Enable the following additional options on top of rockchip_defconfig.

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

### 1.4 QEMU preparation

Compile qemu using the Rockchip buildroot project. The executable is named qemu-system-aarch64.

### 1.5 Host OS ramdisk preparation

Generate a ramdisk with the Rockchip buildroot project, including qemu-system-aarch64, the guest OS kernel image and the guest OS ramdisk image. Refer to the buildroot documentation for project configuration and compilation. The source guide supplies a precompiled ramdisk directory containing all required images. Under Ubuntu, abootimg-pack-initrd generates initrd.img alongside the ramdisk directory; abootimg-unpack-initrd unpacks initrd.img.

## 2. DTS configuration

### 2.1 SMMU configuration

```text
compatible = "arm,smmu-v3";
```

Required to match the ARM SMMU-v3 driver. The register and interrupt configuration below uses RK3588 as an example.

```text
reg = <0x0 0xfc900000 0x0 0x100000>;
```

ARM SMMU-v3 base address and size.

```text
interrupts = <GIC_SPI 369 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 371 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 374 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 367 IRQ_TYPE_EDGE_RISING>;
interrupt-names = "eventq", "gerror", "priq", "cmdq-sync";
```

See Documentation/devicetree/bindings/iommu/arm,smmu-v3.txt.

```text
#iommu-cells = <1>;
```

Must be 1 to describe the device stream ID. See Documentation/devicetree/bindings/iommu/arm,smmu-v3.txt.

### 2.2 Additional PCIe configuration

```text
iommu-map = <0x0 &smmu 0x0 0x10000>;
```

Create SMMU page tables for PCIe peripherals.

## 3. Running

1. Unbind the host PCIe device driver. Use lspci to obtain the device address. Assuming 0002:21:00.0, run the following command to unbind it.

```text
echo 0002:21:00.0 > /sys/bus/pci/devices/0002\:21\:00.0/driver/unbind
```

2. Bind the PCIe device to VFIO-PCI. Obtain vendor id and device id with lspci. The source uses a Realtek 8169 PCIe NIC example with vendor id 10ec and device id 0000, and binds it as follows.

```text
echo 10ec 0000 > /sys/bus/pci/drivers/vfio-pci/new_id
```

3. Run qemu.

```text
qemu-system-aarch64 -nographic -monitor none -m 128 -machine virt,highmem=off -serial stdio -cpu host -enable-kvm  -device vfio-pci,host=0002:21:00.0 -kernel /Image -initrd /ramdisk_ok.img
```

The qemu parameters are explained below.

```text
qemu-system-aarch64
```

The qemu executable built by Rockchip buildroot, placed in the bin/ directory of the host OS root filesystem.

```text
-m 128
```

Allocate 128M of memory to the virtual machine.

```text
highmem=off
```

Use the low 32-bit address space.

```text
-device vfio-pci,host=0002:21:00.0
```

Create a vfio device using the PCIe device address as a parameter, allowing the virtual machine to access it.

```text
-kernel /Image -initrd /ramdisk_ok.img
```

These specify the guest OS kernel image and root-filesystem image, respectively. Both images are placed in the root directory of the host OS root filesystem.

4. After the virtual machine has started, configure the PCIe NIC with the following commands.

```text
ifconfig eth0 up

ifconfig eth0 192.168.31.120 netmask 255.255.255.0

route add default gw 192.168.31.1
```

Configure the address and gateway for the actual network.

5. Test network connectivity with the following command.

```text
ping 8.8.8.8
```

Normally, ping output should appear.

## 4. Remaining issue

In the virtual machine, PCIe devices are set coherent by default, so allocated dma buffers are cacheable, causing data-consistency problems. To avoid this, the source requires manually setting the device non-coherent during the virtual-machine PCIe device probe as follows.

```text
dev->archdata.dma_coherent = false;
```

{% endraw %}
