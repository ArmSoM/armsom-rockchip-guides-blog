---
title: "Rockchip Parameter File Format 1.4: Fields, GPT and Legacy Partitions"
description: "Rockchip Parameter File Format 1.4: Fields, GPT and Legacy Partitions"
excerpt: "Rockchip Parameter File Format 1.4: Fields, GPT and Legacy Partitions"
translation_key: "238-rockchip-parameter-file-format"
slug: "238-rockchip-parameter-file-format"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "parameter", "GPT", "Android"]
---

{% raw %}

# Rockchip Parameter File Format 1.4: Fields, GPT and Legacy Partitions

ArmSoM platform reference, based in full on the sole Chinese source Rockchip Parameter File Format 1.4 (2018.1, 5 pages). No English source was supplied; English, Russian and German are translations of Chinese, and all four languages use its two technical figures. No hardware validation was performed, and compatibility with unlisted SoCs or ArmSoM boards is not claimed. Check the actual SDK, boot chain, storage and board partition layout. Flashing or repartitioning can destroy data: back up first.

Internal source differences: section 3.6 gives ATAG `0x60000800`, while both screenshots show `0x00200800`. Section 3.7 is headed MACHINE `3226`, while the screenshots and RK3326 identifier list say `3326`. Both are retained explicitly, without pretending either was validated. `updata.img` preserves source spelling; check the actual SDK package name. MB/KB notation is retained; partition arithmetic uses 512 Bytes/sector. GPT screenshot addresses differ from the later legacy example and must not be mixed. Screenshot `androidboot.selinux=permissive` is a historical example, not production security advice.

## 1. Overview

Rockchip Android platforms use the parameter file to configure system parameters such as firmware version and storage partitions. This critical configuration should be modified only after understanding each field; invalid settings can prevent the system from working. The file must not exceed 64KB.

The source lists RK3066, RK3168, RK3188, RK3288, RK312X, RK3036, RK3399, RK3368, RK322X, RK3328 and RK3326, among others.

## 2. Parameter file examples

The original figures show GPT and legacy cmdline partitioning. Files differ between projects and platforms; this guide explains fields using the RK3326 reference definition. Screenshot code is also transcribed below, joining wrapped CMDLINE text into logical lines.

![Figure 1: GPT partitioning](/docs/rockchip-parameter-file-format/assets/cn-p002-figure-01.png)

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER:rk3326
MAGIC:0x5041524B
ATAG:0x00200800
MACHINE:3326
CHECK_MASK:0x80
TYPE:GPT
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(misc),0x00008000@0x0000a000(resource),0x00010000@0x00012000(kernel),0x00010000@0x00022000(boot),0x00020000@0x00032000(recovery),0x00038000@0x00052000(backup),0x00002000@0x0008a000(security),0x00100000@0x0008c000(cache),0x00400000@0x0018c000(system),0x00008000@0x0058c000(metadata),0x00080000@0x00594000(vendor),0x00080000@0x00614000(oem),0x00000400@0x00694000(frp),-@0x00694400(userdata:grow)
```

![Figure 2: legacy cmdline partitioning](/docs/rockchip-parameter-file-format/assets/cn-p002-figure-02.png)

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER:rk3326
MAGIC:0x5041524B
ATAG:0x00200800
MACHINE:3326
CHECK_MASK:0x80
CMDLINE:console=ttyFIQ0 androidboot.baseband=N/A androidboot.selinux=permissive androidboot.veritymode=/dev/block/rknand_metadata androidboot.hardware=rk30board androidboot.console=ttyFIQ0 init=/init initrd=0x62000000,0x00800000 mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),0x00002000@0x00006000(misc),0x00008000@0x00008000(resource),0x00010000@0x00010000(kernel),0x00010000@0x00020000(boot),0x00020000@0x00030000(recovery),0x00038000@0x00050000(backup),0x00002000@0x00088000(security),0x00100000@0x0008a000(cache),0x00400000@0x0018a000(system),0x00008000@0x0058a000(metadata),0x00080000@0x00592000(vendor),0x00080000@0x00612000(oem),0x00000400@0x00692000(frp),-@0x00692400(userdata)
```

## 3. Field descriptions

### 3.1. `FIRMWARE_VER:8.1`

Firmware version, used when packing the image called `updata.img` in the source; the upgrade tool uses it to identify the firmware version.

### 3.2. `MACHINE_MODEL:RK3326`

Machine model used when packing `updata.img`. Projects may customize it for display in the upgrade tool. Recovery updates can use it to check firmware compatibility.

### 3.3. `MACHINE_ID:007`

Product development ID, which may combine letters and digits, used when packing `updata.img`. Different projects use different IDs to identify models; recovery updates can also use it to check firmware compatibility.

### 3.4. `MANUFACTURER: rk3326`

Manufacturer information used when packing `updata.img`; customizable for display in the upgrade tool.

### 3.5. `MAGIC: 0x5041524B`

MAGIC value: do not modify it. Some newer APs use DTS and no longer use this field, but it must still not be deleted or changed for compatibility.

### 3.6. `ATAG: 0x60000800`

Do not modify ATAG. Some newer APs use DTS and no longer use this field, but it must remain unchanged for compatibility.

### 3.7. `MACHINE: 3226`

Used for kernel identification; it must match the kernel and must not be changed arbitrarily. Source identification codes follow.

```text
RK29xx: MACHINE:2929
RK292x: MACHINE:2928
RK3066: MACHINE:3066
RK3326: MACHINE:3326
```

### 3.8. `CHECK_MASK: 0x80`

Reserved field; do not modify.

### 3.9. `TYPE: GPT`

Specifies that CMDLINE partition definitions are used to create GPT. The source states that in this mode the parameter file itself is not flashed into NVM devices such as NAND or EMMC.

### 3.10. CMDLINE

`console=ttyFIQ0 androidboot.console=ttyFIQ0` defines the serial console.

For `initrd=0x62000000,0x00800000`, the first value is the SDRAM load address of boot.img and the second is the ramdisk size. The source states that ramdisk size was unrestricted at that time.

`androidboot.xxx` is used during Android startup; some platforms define it in kernel DTS. Normally retain the released SDK defaults.

#### MTD partition definitions

```text
mtdparts=rk29xxnand:0x00002000@0x00002000(uboot),0x00002000@0x00004000(trust),0x00002000@0x00006000(misc),0x00008000@0x00008000(resource),0x00010000@0x00010000(kernel),0x00010000@0x00020000(boot),0x00020000@0x00030000(recovery),0x00038000@0x00050000(backup),0x00002000@0x00088000(security),0x00100000@0x0008a000(cache),0x00400000@0x0018a000(system),0x00008000@0x0058a000(metadata),0x00080000@0x00592000(vendor),0x00080000@0x00612000(oem),0x00000400@0x00692000(frp),-@0x00692400(userdata)
```

1. For compatibility, RK APs described by the source use the `rk29xxnand` identifier.

2. In `0x00002000@0x00008000(boot)`, the value before `@` is partition size, the value after it is the start, and parentheses contain the name. Values are sectors; 1 sector = 512 Bytes. This boot starts at 0x8000 sectors and spans 0x2000 sectors, called 4MB in the source (4 MiB in binary units).

3. For performance, partition starts must align to 32KB (64 sectors), and sizes must be multiples of 32KB.

4. Updating sparse-format images erases data. For better compatibility, align corresponding partitions to 4MB and use sizes that are multiples of 4MB.

5. In GPT mode, parameter addresses are actual logical block addresses (LBA). If uboot is defined at 0x4000, it is flashed at logical address 0x4000 on both EMMC and NAND. The final partition must specify grow so that the tool allocates all remaining space to it.

| Name | Parameter address | EMMC logical address | NAND logical address | Size |
| --- | --- | --- | --- | --- |
| GPT | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| Reserved | -- | 0x2000 | 0x2000 | 4MB |
| UBOOT | 0x4000 | 0x4000 | 0x4000 | 4MB |
| TRUST | 0x6000 | 0x6000 | 0x6000 | 4MB |

6. Legacy cmdline mode reserves the first 0–4MB of EMMC for loader, so add 4MB (0x2000 sectors) to parameter addresses. A uboot definition at 0x2000 is written at EMMC address 0x4000, matching the GPT example. For compatibility with older products, NAND uses the defined address directly: 0x2000 is written at 0x2000, unlike the GPT example.

| Name | Parameter address | EMMC logical address | NAND logical address | Size |
| --- | --- | --- | --- | --- |
| Reserved | -- | 0 | 0 | 32KB |
| LOADER | -- | 0x40 | 0x40 | 4MB-32KB |
| parameter | -- | 0x2000 | 0x0 | 4MB |
| UBOOT | 0x2000 | 0x4000 | 0x2000 | 4MB |
| TRUST | 0x4000 | 0x6000 | 0x4000 | 4MB |

NAND FLASH devices may write loader at 0x40 within the same 4MB region as parameter. The source states that valid data occupy separate positions without overlap. This does not make arbitrary custom layouts safe.

## 4. Common problems and solutions

Page 5 contains only this heading, with no questions or answers. Missing content is not invented.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
