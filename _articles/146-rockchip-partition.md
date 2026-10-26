---
title: "Rockchip Partitions: Complete Parameter, GPT, CMDLINE and Flash-Address Guide"
description: "Rockchip Partitions: Complete Parameter, GPT, CMDLINE and Flash-Address Guide — V1.5.1"
excerpt: "Rockchip Partitions: Complete Parameter, GPT, CMDLINE and Flash-Address Guide"
translation_key: 146-rockchip-partition
slug: 146-rockchip-partition
lang: en
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: storage
products: []
tags: [ArmSoM, Rockchip, GPT, CMDLINE, parameter]
---

{% raw %}

# Rockchip Partitions: Complete Parameter, GPT, CMDLINE and Flash-Address Guide

Both Chinese and English sources are V1.5.1. All technical prose and tables are retained. ArmSoM platform reference: verify the exact SoC, SDK/BSP, U-Boot, kernel, storage and existing partition table; this is not universally applicable to every board. RK3326 is the source example. No flashing/partition commands or hardware tests were performed. Neither source contains standalone technical figures.

> Source discrepancies retained: preview ATAG is 0x00200800 but section 2.6 says 0x60000800; section 2.7 says MACHINE:3226 while the preview/platform table says 3326. The source spelling updata.img is retained rather than silently changed to update.img. Flashing or repartitioning can erase data; verify and back up first.

Technical preface: Rockchip Android uses parameter to configure firmware version, storage partitions and other system settings. This critical file must only be changed with an understanding of each setting; invalid configuration can prevent correct operation. The file must not exceed 64KB.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip tools](https://github.com/rockchip-linux/rkdeveloptool)

## 1. Parameter-file preview

The parameter file primarily defines the partition table. It supports GPT and legacy CMDLINE partitions. Its contents vary by project and platform. This guide uses RK3326 examples. RK3326 GPT parameter definition:

```text
FIRMWARE_VER:9.0
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(misc),0x00002000@0x0000a000(dtb),0x00002000@0x0000c000(dtbo),0x00000800@0x0000e000(vbmeta),0x00010000@0x0000e800(boot),0x00030000@0x0001e800(recovery),0x00028000@0x0004e800(backup),0x00002000@0x00076800(security),0x00070000@0x00078800(cache),0x002d0000@0x000e8800(system),0x00008000@0x003b8800(metadata),0x00070000@0x003c0800(vendor),0x00020000@0x00430800(oem),0x00000400@0x00450800(frp),-@0x00450c00(userdata:grow)
uuid:system=af01642c-9b84-11e8-9b2a-234eb5e198a0
```

RK3326 legacy CMDLINE parameter definition:

```text
FIRMWARE_VER:9.0
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
CMDLINE:console=ttyFIQ0 androidboot.console=ttyFIQ0 initrd=0x62000000,0x00800000 mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(misc),0x00002000@0x0000a000(dtb),0x00002000@0x0000c000(dtbo),0x00000800@0x0000e000(vbmeta),0x00010000@0x0000e800(boot),0x00030000@0x0001e800(recovery),0x00028000@0x0004e800(backup),0x00002000@0x00076800(security),0x00070000@0x00078800(cache),0x002d0000@0x000e8800(system),0x00008000@0x003b8800(metadata),0x00070000@0x003c0800(vendor),0x00020000@0x00430800(oem),0x00000400@0x00450800(frp),-@0x00450c00(userdata)
```

Main parameter-file differences for GPT versus legacy partitions: define TYPE: GPT.

Add grow to the last partition, for example userdata:grow. Specify the system or rootfs UUID, for example uuid:system=af01642c-9b84-11e8-9b2a-234eb5e198a0. The parameter file itself is not written to NVM (EMMC, NAND, etc.); only its mtdparts partition definitions and UUID are used. Other information exists for upgrade-tool compatibility.

## 2. File contents

### 2.1 FIRMWARE_VER:9.0

| Item | FIRMWARE_VER |
| --- | --- |
| Type | Decimal, format X.X |
| Value | 0 - 255 |
| Description | Used when packaging updata.img; the upgrade tool identifies the firmware version from this value. |

### 2.2 MACHINE_MODEL:RK3326

| Item | MACHINE_MODEL |
| --- | --- |
| Type | String |
| Length | 255 (maximum) |
| Description | Machine model, used to package updata.img. May differ by project and is displayed by the upgrade tool. During recovery updates it can check whether firmware matches the machine. |

### 2.3 MACHINE_ID:007

| Item | MACHINE_ID |
| --- | --- |
| Type | String |
| Length | 255 (maximum) |
| Description | Product development ID, a combination of letters and digits used in updata.img packaging. Different projects use different IDs to identify the model. Recovery updates can use it to check firmware compatibility. |

### 2.4 MANUFACTURER:rk3326

| Item | MANUFACTURER |
| --- | --- |
| Type | String |
| Length | 255 (maximum) |
| Description | Manufacturer information for updata.img packaging; editable and displayed by the upgrade tool. |

### 2.5 MAGIC:0x5041524B

| Item | MAGIC |
| --- | --- |
| Type | Hexadecimal |
| Value | 0x5041524B (fixed) |
| Description | MAGIC signature; do not modify. Some newer APs use DTS and do not use this field, but retain it unchanged for compatibility. |

### 2.6 ATAG:0x60000800

| Item | ATAG |
| --- | --- |
| Type | Hexadecimal |
| Value | 32-bit DDR address |
| Description | DDR storage address for ATAG. Some newer APs use DTS and do not use this field; do not remove or modify it, for compatibility. |

### 2.7 MACHINE:3226

| Item | MACHINE |
| --- | --- |
| Type | String |
| Length | 255 (maximum) |
| Description | Used for kernel identification; do not change it because it must match the kernel. |

Values for several platforms:

| Chip | MACHINE |
| --- | --- |
| RK29xx | 2929 |
| RK292X | 2928 |
| RK3066 | 3066 |
| RK3126C | 3126c |
| RK3326 | 3326 |
| RK3399 | 3399 |
| RK3308 | 3308 |

### 2.8 CHECK_MASK:0x80

| Item | CHECK_MASK |
| --- | --- |
| Type | Hexadecimal |
| Value | 0x80 (fixed) |
| Description | Reserved; do not modify. |

### 2.9 TYPE:GPT

GPT partition-table identifier. The flashing tool creates a GPT table from the partitions in CMDLINE. The parameter file is not written into NVM storage (NAND, EMMC, etc.).

### 2.10 CMDLINE:

console=ttyFIQ0 androidboot.console=ttyFIQ0 defines the serial console. In initrd=0x62000000,0x00800000, the first value is the RAMDISK load address in DDR and the second its size; the source states that RAMDISK size is currently unrestricted. androidboot.xxx definitions are used at Android startup and may be defined in the kernel DTS on some platforms. Usually retain the released SDK defaults without modifying these definitions. MTD partition definition:

```text
mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),0x00002000@0x00006000(misc),0x00008000@0x00008000(resource),0x00010000@0x00010000(kernel),0x00010000@0x00020000(boot),0x00020000@0x00030000(recovery),0x00038000@0x00050000(backup),0x00002000@0x00088000(security),0x00100000@0x0008a000(cache),0x00400000@0x0018a000(system),0x00008000@0x0058a000(metadata),0x00080000@0x00592000(vendor),0x00080000@0x00612000(oem),0x00000400@0x00692000(frp),-@0x00692400(userdata)
```

Partition-definition notes:

1. For compatibility, all APs currently use rk29xxnand as their identifier.

2. For a partition such as 0x00002000@0x00008000(boot), the value before @ is the size, the value after @ is the starting position, and the name is in parentheses. All values use sectors of 512Bytes. This boot partition starts at sector 0x8000 and occupies 0x2000 sectors (4MB).

3. For performance, every partition start must be aligned to 32KB (64 sectors), and its size must be a multiple of 32KB.

4. Upgrading a sparse-format image erases data. For better compatibility, align the corresponding partition to 4MB and make its size a multiple of 4MB.

5. With GPT, parameter addresses are actual logical block addresses (LBA). For example, uboot at 0x4000 is written at logical address 0x4000 in both EMMC and NAND.

| Name | Parameter address | EMMC logical address | NAND logical address | Size |
| --- | --- | --- | --- | --- |
| GPT | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| Reserved | -- | 0x2000 | 0x2000 | 4MB |
| UBOOT | 0x4000 | 0x4000 | 0x4000 | 4MB |
| TRUST | 0x6000 | 0x6000 | 0x6000 | 4MB |

Specify grow for the final partition; the tool assigns all remaining space to it.

6. With legacy cmdline partitions on EMMC, 0–4MB is reserved for loader, so add 4MB to all parameter partition addresses. For example, uboot defined at 0x2000 is actually written to EMMC at 0x4000, as with GPT. On NAND, all addresses are actual logical addresses for compatibility with older products: uboot defined at 0x2000 is written at NAND logical address 0x2000, unlike GPT.

| Name | Parameter address | EMMC logical address | NAND logical address | Size |
| --- | --- | --- | --- | --- |
| Reserved | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| parameter | -- | 0x2000 | 0x0 | 4MB |
| UBOOT | 0x2000 | 0x4000 | 0x2000 | 4MB |
| TRUST | 0x4000 | 0x6000 | 0x4000 | 4MB |

Note: on NAND FLASH systems, a loader image may be written at 0x40, in the same 4MB region as parameter. Valid data is stored at separate offsets and does not overlap.

## 3. Partition-definition rules

1. Put every partition written by bootrom, pre-loader, uboot or trust before recovery.

2. Any customer-added partition written by pre-loader, uboot or trust must also precede recovery.

3. Rockchip early-stage firmware currently accesses misc, vbmeta and security; all must be before recovery.

{% endraw %}
