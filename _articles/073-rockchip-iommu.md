---
title: "Rockchip Linux IOMMU V1/V2: Page Tables, DMA Mapping and Troubleshooting"
description: "Complete Chinese V1.2.0 baseline with V2 page tables, RK3588 dumps, DMA/DRM/system heap and all 18 FAQ sections."
translation_key: "073-rockchip-iommu"
slug: "073-rockchip-iommu"
lang: "en"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "IOMMU"]
keywords: "ArmSoM Rockchip rockchip iommu"
excerpt: "Complete Chinese V1.2.0 baseline with V2 page tables, RK3588 dumps, DMA/DRM/system heap and all 18 FAQ sections."
---

{% raw %}

# Rockchip Linux IOMMU V1/V2: Page Tables, DMA Mapping and Troubleshooting

## ArmSoM applicability and source scope

Platform reference for adapting ArmSoM systems, based on CN V1.2.0 baseline; EN V1.0.1 comparison. No board, SDK/BSP, kernel or wiring combination has been hardware-validated here. The source scope below is not a claim that every ArmSoM board or kernel supports these features. Check the exact SoC, board schematic, SDK/BSP, kernel driver and pinmux. Commands, patches, logs and measurements are source examples, not ArmSoM test results.

By user approval, all languages follow Chinese V1.2.0, including V2 layouts, RK3588 page dumps, system-heap mapping and FAQ 5.9–5.18 missing from EN V1.0.1. Additions retain Chinese source-page comments. English/Russian use matching English originals for the four common figures; the two V2 figures use Chinese originals because no English equivalent was supplied. The older English formulas use && where Chinese uses &; the baseline uses Chinese literals, with both variants recorded in the notes.

| Source SoC | Source kernel scope |
| --- | --- |
| ROCKCHIP | 4.4/4.19/5.10/6.1 |

IOMMU translates 32-bit virtual addresses to physical addresses, provides read/write permission bits and can raise page-fault and bus-exception interrupts.

[Editorial notes](/docs/rockchip-iommu/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, unit 0 -->

## 1. IOMMU structure

<!-- Source CN PDF p.4, unit 1 -->

A two-level page-table structure is used:

<!-- Source CN PDF p.4, unit 2 -->

![IOMMU two-level page-table structure — source EN PDF p.6](/docs/rockchip-iommu/assets/en-p06-figure1.png)

*IOMMU two-level page-table structure — source EN PDF p.6.*

<!-- Source CN PDF p.4, unit 3 -->

![32-bit IOMMU virtual address fields — source EN PDF p.6](/docs/rockchip-iommu/assets/en-p06-figure2.png)

*32-bit IOMMU virtual address fields — source EN PDF p.6.*

<!-- Source CN PDF p.4, unit 4 -->

The 32-bit address contains a 10-bit first-level table offset, a 10-bit second-level table offset and a 12-bit offset within the page.

<!-- Source CN PDF p.4, unit 5 -->

DTE structure:

<!-- Source CN PDF p.4, unit 6 -->

![IOMMU V1 DTE layout — source EN PDF p.6](/docs/rockchip-iommu/assets/en-p06-figure3.png)

*IOMMU V1 DTE layout — source EN PDF p.6.*

<!-- Source CN PDF p.4, unit 7 -->

V2 DTE structure (Chinese V1.2.0 source):

<!-- Source CN PDF p.4, unit 8 -->

![IOMMU V2 DTE layout — source CN PDF p.4](/docs/rockchip-iommu/assets/cn-p04-figure4.png)

*IOMMU V2 DTE layout — source CN PDF p.4.*

<!-- Source CN PDF p.4, unit 9 -->

bit0: whether the next-level page table exists.

<!-- Source CN PDF p.4, unit 10 -->

PTE structure:

<!-- Source CN PDF p.5, unit 11 -->

![IOMMU V1 PTE layout and permissions — source EN PDF p.7](/docs/rockchip-iommu/assets/en-p07-figure1.png)

*IOMMU V1 PTE layout and permissions — source EN PDF p.7.*

<!-- Source CN PDF p.5, unit 12 -->

bit0: whether the physical page exists.

<!-- Source CN PDF p.5, unit 13 -->

bit1: read permission.

<!-- Source CN PDF p.5, unit 14 -->

bit2: write permission.

<!-- Source CN PDF p.5, unit 15 -->

V2 PTE structure (Chinese V1.2.0 source):

<!-- Source CN PDF p.5, unit 16 -->

![IOMMU V2 PTE layout — source CN PDF p.5](/docs/rockchip-iommu/assets/cn-p05-figure2.png)

*IOMMU V2 PTE layout — source CN PDF p.5.*

The preceding V1 text says bit1=read and bit2=write, but the V2 diagram labels bit2=read permission and bit1=write permission (bit0=page present). This version-specific discrepancy is preserved exactly as shown. Do not apply V1 permissions to V2 without checking the matching driver/TRM; no hardware validation was performed.

<!-- Source CN PDF p.5, unit 17 -->

## 2. IOMMU driver

<!-- Source CN PDF p.5, unit 18 -->

### 2.1 Driver file

<!-- Source CN PDF p.5, unit 19 -->

Driver file location:

<!-- Source CN PDF p.5, unit 20 -->

```text
drivers/iommu/rockchip-iommu.c
```

<!-- Source CN PDF p.5, unit 21 -->

### 2.2 DTS node configuration

<!-- Source CN PDF p.5, unit 22 -->

Refer to `Documentation/devicetree/bindings/iommu/rockchip,iommu.txt` for DTS configuration. The main parameters are described below:

<!-- Source CN PDF p.5, unit 23 -->

`compatible = "rockchip,iommu";`

<!-- Source CN PDF p.5, unit 24 -->

`compatible = "rockchip,iommu-v2";` — V2, from the Chinese V1.2.0 source.

<!-- Source CN PDF p.6, unit 25 -->

The source states that the compatible value is shared by the IOMMUs of devices. It lists `interrupts = <GIC_SPI 119 IRQ_TYPE_LEVEL_HIGH 0>;` for exception interrupts such as page faults. Preserve this example and verify it against the actual DTS binding; the source has both V1 and V2 compatible strings above.

<!-- Source CN PDF p.6, unit 26 -->

`clocks = <&cru ACLK_VOP1>, <&cru HCLK_VOP1>;`

<!-- Source CN PDF p.6, unit 27 -->

`clock-names = "aclk", "hclk";` — IOMMU and master share clocks; these entries allow the IOMMU driver to control the clocks independently.

<!-- Source CN PDF p.6, unit 28 -->

`power-domains = <&power RK3399_PD_VOPL>;` — enables power-domain operations in the IOMMU driver.

<!-- Source CN PDF p.6, unit 29 -->

`iommu-cells = <0>;` — the source requires 0; see iommu.txt. The missing `#` in this source spelling is retained and flagged in the editorial notes.

<!-- Source CN PDF p.6, unit 30 -->

## 3. Using IOMMU

<!-- Source CN PDF p.6, unit 31 -->

The Rockchip IOMMU driver depends on the IOMMU framework:

<!-- Source CN PDF p.6, unit 32 -->

```text
drivers/iommu/iommu.c
```

<!-- Source CN PDF p.6, unit 33 -->

It mainly implements callbacks in:

<!-- Source CN PDF p.6, unit 34 -->

```text
struct iommu_ops rk_iommu_ops
```

<!-- Source CN PDF p.6, unit 35 -->

The master invokes the framework APIs to operate the IOMMU, as follows:

<!-- Source CN PDF p.6, unit 36 -->

**1. iommu attach**

<!-- Source CN PDF p.6, unit 37 -->

```text
iommu_attach_device -> rk_iommu_attach_device /* enable iommu */
```

<!-- Source CN PDF p.6, unit 38 -->

**2. iommu detach**

<!-- Source CN PDF p.6, unit 39 -->

```text
iommu_detach_device -> rk_iommu_detach_device /* disable iommu */
```

<!-- Source CN PDF p.6, unit 40 -->

**3. iommu map**

<!-- Source CN PDF p.6, unit 41 -->

```text
iommu_map -> rk_iommu_map
```

<!-- Source CN PDF p.6, unit 42 -->

Create page tables and mappings between virtual and physical addresses. Enable the dbg output inside iommu_map during debugging to observe mapping.

<!-- Source CN PDF p.6, unit 43 -->

**4. iommu unmap**

<!-- Source CN PDF p.6, unit 44 -->

```text
iommu_unmap -> rk_iommu_unmap
```

<!-- Source CN PDF p.7, unit 45 -->

Remove virtual-to-physical mappings and free virtual address space. Enable dbg output inside iommu_unmap to observe unmapping.

<!-- Source CN PDF p.7, unit 46 -->

**5. domain alloc**

<!-- Source CN PDF p.7, unit 47 -->

```text
iommu_domain_alloc -> rk_iommu_domain_alloc
```

<!-- Source CN PDF p.7, unit 48 -->

Allocate the page-table base address used by attach/detach.

<!-- Source CN PDF p.7, unit 49 -->

**6. domain free**

<!-- Source CN PDF p.7, unit 50 -->

```text
iommu_domain_free -> rk_iommu_domain_free
```

<!-- Source CN PDF p.7, unit 51 -->

Free page-table space.

<!-- Source CN PDF p.7, unit 52 -->

**7. Dump IOMMU page tables. For RK3399 vopl_iommu and virtual address VA=0x00001000, use this sequence. a. Obtain the first-level table base DT:**

<!-- Source CN PDF p.7, unit 53 -->

```text
io -4 0xff8f3f00
```

<!-- Source CN PDF p.7, unit 54 -->

b. Calculate the first-level table offset:

<!-- Source CN PDF p.7, unit 55 -->

```text
index1 = VA >> 22
```

<!-- Source CN PDF p.7, unit 56 -->

c. Calculate the physical address of the first-level entry DTE:

<!-- Source CN PDF p.7, unit 57 -->

```text
DTE = index1 * 4 + DT
```

<!-- Source CN PDF p.7, unit 58 -->

d. Obtain the second-level table base PT:

<!-- Source CN PDF p.7, unit 59 -->

```text
PT = io -4 DTE
```

<!-- Source CN PDF p.7, unit 60 -->

e. Calculate the second-level table offset:

<!-- Source CN PDF p.7, unit 61 -->

```text
index2 = VA & 0x3ff000
```

<!-- Source CN PDF p.7, unit 62 -->

f. Calculate the physical address of the second-level entry PTE:

<!-- Source CN PDF p.7, unit 63 -->

```text
PTE = index2 * 4 + PT
```

<!-- Source CN PDF p.7, unit 64 -->

g. Obtain the physical PAGE address, page:

<!-- Source CN PDF p.7, unit 65 -->

```text
page = io -4 PTE
```

<!-- Source CN PDF p.7, unit 66 -->

h. Calculate the in-page offset, offset:

<!-- Source CN PDF p.7, unit 67 -->

```text
offset = page + (VA & 0xfff)
```

<!-- Source CN PDF p.8, unit 68 -->

The source calls offset the physical address corresponding to virtual address 0x00001000; the master can inspect data there. For RK3588 vop_mmu with VA=0x00001000, the Chinese V1.2.0 source adds the following sequence. a. Obtain the first-level table base DT:

<!-- Source CN PDF p.8, unit 69 -->

```text
DT = io -4 0xfdd97e00
DT = ((DT & 0xf0) << 32) | ((DT & 0xf00) << 24) | (DT & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 71 -->

b. Calculate the first-level table offset:

<!-- Source CN PDF p.8, unit 72 -->

```text
index1 = VA >> 22
```

<!-- Source CN PDF p.8, unit 73 -->

c. Calculate physical address DTE:

<!-- Source CN PDF p.8, unit 74 -->

```text
DTE = index1 * 4 + DT
```

<!-- Source CN PDF p.8, unit 75 -->

d. Obtain second-level table base PT:

<!-- Source CN PDF p.8, unit 76 -->

```text
PT = io -4 DTE
PT = ((PT & 0xf0) << 32) | ((PT & 0xf00) << 24) | (PT & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 78 -->

e. Calculate the second-level table offset:

<!-- Source CN PDF p.8, unit 79 -->

```text
index2 = VA & 0x3ff000
```

<!-- Source CN PDF p.8, unit 80 -->

f. Calculate physical address PTE:

<!-- Source CN PDF p.8, unit 81 -->

```text
PTE = index2 * 4 + PT
```

<!-- Source CN PDF p.8, unit 82 -->

g. Obtain physical page address page:

<!-- Source CN PDF p.8, unit 83 -->

```text
page = io -4 PTE
page = ((page & 0xf0) << 32) | ((page & 0xf00) << 24) | (page & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 85 -->

h. Calculate offset:

<!-- Source CN PDF p.8, unit 86 -->

```text
offset = page + (VA & 0xfff)
```

<!-- Source CN PDF p.8, unit 87 -->

The source calls offset the physical address corresponding to VA=0x00001000; the master can use it to inspect data. The formulas are reproduced literally and have not been validated on hardware.

<!-- Source CN PDF p.8, unit 88 -->

**8. dma-mapping. a. For a device without IOMMU:**

<!-- Source CN PDF p.9, unit 89 -->

```text
ARM32: dev->dma_ops = arm_dma_ops;
ARM64: dev->dma_ops = arm64_swiotlb_dma_ops;
```

<!-- Source CN PDF p.9, unit 90 -->

b. For an IOMMU device:

<!-- Source CN PDF p.9, unit 91 -->

```text
ARM32: dev->dma_ops = iommu_ops;
ARM64: dev->dma_ops = iommu_dma_ops;
```

<!-- Source CN PDF p.9, unit 92 -->

Taking dma_alloc_attrs as an example:

<!-- Source CN PDF p.9, unit 93 -->

**1. For a non-IOMMU device, the alloc callback in the dma_ops from (a) allocates contiguous physical memory and a kernel virtual address.**

<!-- Source CN PDF p.9, unit 94 -->

**2. For an IOMMU device, alloc in the dma_ops from (b) allocates physical memory and invokes iommu_map through the framework to create page tables and virtual-to-physical mappings. It returns the initial IOMMU virtual address and the kernel virtual address.**

<!-- Source CN PDF p.9, unit 95 -->

A minimal IOMMU usage sequence:

<!-- Source CN PDF p.9, unit 96 -->

```text
1. domain = iommu_domain_alloc(&platform_bus_type);
2. iommu_map(domain, iova, paddr, size, prot)；
3. iommu_attach_device(domain, dev)；
4. master启动访问iommu
```

<!-- Source CN PDF p.9, unit 97 -->

IOMMU is a basic component that can be embedded in allocators such as ion/drm. In ARM64 DRM, a complete IOMMU buffer allocation and mapping sequence is:

<!-- Source CN PDF p.9, unit 98 -->

```text
rockchip_gem_alloc_buf ->
rockchip_gem_get_pages ->
rockchip_gem_iommu_map ->
iommu_map_sg ->
iommu_map
```

<!-- Source CN PDF p.9, unit 99 -->

IOMMU mapping when passing an fd:

<!-- Source CN PDF p.9, unit 100 -->

DRM path:

<!-- Source CN PDF p.9, unit 101 -->

```text
1. struct dma_buf *dmabuf = dma_buf_get(fd) ->
dma_buf_attach -> dma_buf_map_attachment ->
map_dma_buf -> drm_gem_map_dma_buf ->
dma_map_sg_attrs -> map_sg ->
__iommu_map_sg_attrs ->
iommu_dma_map_sg ->
iommu_map_sg ->
iommu_map
```

<!-- Source CN PDF p.9, unit 102 -->

SYSTEM HEAP path:

<!-- Source CN PDF p.10, unit 103 -->

```text
2. struct dma_buf *dmabuf = dma_buf_get(fd) ->
dma_buf_attach -> dma_buf_map_attachment ->
map_dma_buf -> system_heap_map_dma_buf ->
dma_map_sgtable -> __dma_map_sg_attrs ->
map_sg -> iommu_dma_map_sg ->
iommu_map_sg_atomic ->
__iommu_map_sg ->
__iommu_map
```

<!-- Source CN PDF p.10, unit 104 -->

## 4. Kernel configuration

<!-- Source CN PDF p.10, unit 105 -->

```text
Symbol: ROCKCHIP_IOMMU [=y]
Type : boolean
Prompt: Rockchip IOMMU Support
    Location:
        -> Device Drivers
            -> IOMMU Hardware Support (IOMMU_SUPPORT [=y])
    Defined at drivers/iommu/Kconfig:211
    Depends on: IOMMU_SUPPORT [=y] && (ARM || ARM64 [=y]) && (ARCH_ROCKCHIP [=y] ||
                COMPILE_TEST [=n])
    Selects: IOMMU_API [=y] && ARM_DMA_USE_IOMMU
```

<!-- Source CN PDF p.10, unit 106 -->

## 5. IOMMU frequently asked questions

<!-- Source CN PDF p.10, unit 107 -->

### 5.1 Page-fault interrupt

<!-- Source CN PDF p.10, unit 108 -->

A page-fault interrupt means that the virtual address currently accessed has no corresponding mapping. Three cases have occurred in masters: accessing an unmapped address, accessing out of bounds, or starting access before mapping.

<!-- Source CN PDF p.10, unit 109 -->

### 5.2 IOMMU enable-stall failure

<!-- Source CN PDF p.10, unit 110 -->

An IOMMU page fault may already have occurred and the master continues accessing without handling it; inspect the log.

<!-- Source CN PDF p.10, unit 111 -->

Incorrect clock handling is another possibility. Temporarily keep PD and CLK enabled to rule out those causes.

<!-- Source CN PDF p.11, unit 112 -->

### 5.3 Inaccessible IOMMU registers

<!-- Source CN PDF p.11, unit 113 -->

The master's power-domain handling may use pm_runtime_get_sync/pm_runtime_put_sync incorrectly, accessing IOMMU registers before enabling the IOMMU power domain.

<!-- Source CN PDF p.11, unit 114 -->

### 5.4 Continuous IOMMU interrupts

<!-- Source CN PDF p.11, unit 115 -->

The interrupt number in DTS may be wrong.

<!-- Source CN PDF p.11, unit 116 -->

The master may continuously access unmapped IOVA; this often accompanies display failures.

<!-- Source CN PDF p.11, unit 117 -->

### 5.5 Boot-time display flicker

<!-- Source CN PDF p.11, unit 118 -->

Enabling IOMMU while VOP is displaying may disrupt data fetching. On chips without frame-effective switching, wait until VOP is not fetching before enabling IOMMU.

<!-- Source CN PDF p.11, unit 119 -->

### 5.6 Abnormal IOMMU registers

<!-- Source CN PDF p.11, unit 120 -->

Out-of-bounds master accesses to IOMMU registers can cause this problem.

<!-- Source CN PDF p.11, unit 121 -->

Resetting the entire master IP also resets IOMMU, because IOMMU is integrated inside that IP.

<!-- Source CN PDF p.11, unit 122 -->

After a master reset, restore the IOMMU register configuration.

<!-- Source CN PDF p.11, unit 123 -->

### 5.7 IOMMU device-link integration

<!-- Source CN PDF p.11, unit 124 -->

Power-domain control is handed to the master; ensure correct use of pm_runtime_get/pm_runtime_put.

<!-- Source CN PDF p.11, unit 125 -->

Calling pm_runtime_get in the master enables IOMMU.

<!-- Source CN PDF p.11, unit 126 -->

Calling pm_runtime_put in the master disables IOMMU.

<!-- Source CN PDF p.11, unit 127 -->

### 5.8 Page-table maintenance

<!-- Source CN PDF p.11, unit 128 -->

In ARM32, masters sharing IOMMU, such as vepu and vdpu, need separate page tables and must attach the appropriate table before every access. ARM64 shares page tables, so repeated attach is unnecessary.

<!-- Source CN PDF p.11, unit 129 -->

### 5.9 Reset failure at high clock frequency

<!-- Source CN PDF p.11, unit 130 -->

RK3288 reboot stress tests can trigger VOP page faults. If VOP is overclocked, force reset of VOP IOMMU may fail. The source workaround is to skip force reset when attaching VOP IOMMU.

<!-- Source CN PDF p.12, unit 131 -->

### 5.10 Unreadable VOP IOMMU on RK3128/RK3126

<!-- Source CN PDF p.12, unit 132 -->

These chips' VOP IOMMU registers cannot be read. Add this workaround to the VOP IOMMU DTS configuration:

<!-- Source CN PDF p.12, unit 133 -->

```text
rockchip,skip-mmu-read
```

<!-- Source CN PDF p.12, unit 134 -->

The driver skips the relevant reads; its flag is iommu->skip_read.

<!-- Source CN PDF p.12, unit 135 -->

### 5.11 Reset operation

<!-- Source CN PDF p.12, unit 136 -->

After resetting ISP IOMMU, its status register may not confirm completion even though reset succeeded. Add this workaround to the ISP IOMMU DTS node:

<!-- Source CN PDF p.12, unit 137 -->

```text
rockchip,disable-mmu-reset
```

<!-- Source CN PDF p.12, unit 138 -->

This skips ISP IOMMU reset; the driver flag is iommu->reset_disabled.

<!-- Source CN PDF p.12, unit 139 -->

### 5.12 Ensuring write commands take effect

<!-- Source CN PDF p.12, unit 140 -->

The source names RK1126 and RV1109 rkvenc IOMMU as possibly losing write commands; repeat writes several times to avoid this. RK1126 is preserved as written and requires verification.

<!-- Source CN PDF p.12, unit 141 -->

### 5.13 Disable automatic VOP IOMMU attach

<!-- Source CN PDF p.12, unit 142 -->

From the 4.19 kernel onward, VOP explicitly attaches IOMMU rather than attaching automatically when the device node is registered, preventing display problems at the U-Boot-to-kernel handover.

<!-- Source CN PDF p.12, unit 143 -->

### 5.14 Performance loss from IOMMU TLB flushing

<!-- Source CN PDF p.12, unit 144 -->

Mapping requires TLB flushes. Fragmented buffers can cause many flushes and reduce performance; add a flag so the TLB is flushed only once.

<!-- Source CN PDF p.12, unit 145 -->

### 5.15 One-to-one mapping for VOP IOMMU

<!-- Source CN PDF p.12, unit 146 -->

One-to-one mapping avoids display faults caused by waiting for frame-effective updates at the U-Boot/kernel transition. For example, RK356X has more masters than IOMMUs, so waiting for frame-effective updates is unavailable; identity mapping avoids that problem.

<!-- Source CN PDF p.13, unit 147 -->

### 5.16 One master with two IOMMUs

<!-- Source CN PDF p.13, unit 148 -->

Unless special requirements apply, optimize the master driver so both IOMMUs use the same page table.

<!-- Source CN PDF p.13, unit 149 -->

The source's newer IOMMU driver automatically shares the same page table across multiple IOMMUs of one master; no master-driver intervention is needed.

<!-- Source CN PDF p.13, unit 150 -->

### 5.17 PX30 H.264/H.265 switching

<!-- Source CN PDF p.13, unit 151 -->

Use this switching order:

<!-- Source CN PDF p.13, unit 152 -->

1. Ensure all clocks are enabled.
2. Ensure all power domains are enabled.
3. Disable all IOMMUs.
4. Switch GRF.
5. Enable the current IOMMU.

<!-- Source CN PDF p.13, unit 157 -->

### 5.18 RK3368 VPU and HEVC simultaneous-operation failures

<!-- Source CN PDF p.13, unit 158 -->

RK3368 VPU and HEVC share an IOMMU TLB. Serialize TLB operations, and therefore mapping operations, to prevent failures.

{% endraw %}
