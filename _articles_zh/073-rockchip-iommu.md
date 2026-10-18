---
title: "Rockchip Linux IOMMU V1/V2 完整指南：页表、DMA 映射与排障"
description: "以中文 V1.2.0 为基准，完整包含 V2 页表、RK3588 dump、DMA/DRM/system heap 及 18 节排障。"
translation_key: "073-rockchip-iommu"
slug: "073-rockchip-iommu"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "IOMMU"]
keywords: "ArmSoM Rockchip rockchip iommu"
excerpt: "以中文 V1.2.0 为基准，完整包含 V2 页表、RK3588 dump、DMA/DRM/system heap 及 18 节排障。"
---

{% raw %}

# Rockchip Linux IOMMU V1/V2 完整指南：页表、DMA 映射与排障

## ArmSoM 适用说明与原文范围

本文为 ArmSoM 适配前的平台参考，依据 CN V1.2.0 baseline; EN V1.0.1 comparison。未进行板卡、SDK/BSP、内核或接线组合的硬件验证。下表沿用原稿范围，不表示所有 ArmSoM 板卡或所有内核均支持；请核对具体 SoC、板卡原理图、SDK/BSP、内核驱动和引脚复用。命令、补丁、日志、测试数字均为原文示例，不是 ArmSoM 实测。

按用户确认，以中文 V1.2.0 为三语共同基准。英文旧稿缺少 V2 布局、RK3588 页表 dump、system heap 映射及 FAQ 5.9–5.18，均完整补译并保留中文页码来源。四张共有图在英文、俄文中使用英文原图，两张 V2 新图无英文对应，沿用中文原图并注明。旧英文公式使用 &&，中文使用 &；本批依据中文保留，双版本值记入校对记录。

| 原文芯片 | 原文内核范围 |
| --- | --- |
| ROCKCHIP | 4.4/4.19/5.10/6.1 |

IOMMU 用于 32 位虚拟地址与物理地址的转换，提供读写控制位，可产生缺页异常和总线异常中断。

[校对记录](/docs/rockchip-iommu/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, unit 0 -->

## 1. IOMMU结构

<!-- Source CN PDF p.4, unit 1 -->

使用二级页表结构， 如下：

<!-- Source CN PDF p.4, unit 2 -->

![IOMMU 二级页表结构 — 来源 CN PDF p.4](/docs/rockchip-iommu/assets/cn-p04-figure1.png)

*IOMMU 二级页表结构 — 来源 CN PDF p.4.*

<!-- Source CN PDF p.4, unit 3 -->

![IOMMU 32 位虚拟地址字段 — 来源 CN PDF p.4](/docs/rockchip-iommu/assets/cn-p04-figure2.png)

*IOMMU 32 位虚拟地址字段 — 来源 CN PDF p.4.*

<!-- Source CN PDF p.4, unit 4 -->

32位地址结构，前10位第一级页表偏移，中间10位二级页表偏移，最后12位页内偏移

<!-- Source CN PDF p.4, unit 5 -->

DTE结构：

<!-- Source CN PDF p.4, unit 6 -->

![IOMMU V1 DTE 布局 — 来源 CN PDF p.4](/docs/rockchip-iommu/assets/cn-p04-figure3.png)

*IOMMU V1 DTE 布局 — 来源 CN PDF p.4.*

<!-- Source CN PDF p.4, unit 7 -->

V2版本DTE结构：

<!-- Source CN PDF p.4, unit 8 -->

![IOMMU V2 DTE 布局 — 来源 CN PDF p.4](/docs/rockchip-iommu/assets/cn-p04-figure4.png)

*IOMMU V2 DTE 布局 — 来源 CN PDF p.4.*

<!-- Source CN PDF p.4, unit 9 -->

bit0：下一级页表是否存在

<!-- Source CN PDF p.4, unit 10 -->

PTE结构：

<!-- Source CN PDF p.5, unit 11 -->

![IOMMU V1 PTE 布局与权限 — 来源 CN PDF p.5](/docs/rockchip-iommu/assets/cn-p05-figure1.png)

*IOMMU V1 PTE 布局与权限 — 来源 CN PDF p.5.*

<!-- Source CN PDF p.5, unit 12 -->

bit0：实际的物理页是否存在

<!-- Source CN PDF p.5, unit 13 -->

bit1：读允许

<!-- Source CN PDF p.5, unit 14 -->

bit2：写允许

<!-- Source CN PDF p.5, unit 15 -->

V2版本PTE结构：

<!-- Source CN PDF p.5, unit 16 -->

![IOMMU V2 PTE 布局 — 来源 CN PDF p.5](/docs/rockchip-iommu/assets/cn-p05-figure2.png)

*IOMMU V2 PTE 布局 — 来源 CN PDF p.5.*

前面的 V1 正文写 bit1=读、bit2=写，但本张 V2 原图标注为 bit2=read permission、bit1=write permission（bit0=page present）。此处按原图明确保留版本差异，不能未经对应驱动/TRM 核对就把 V1 权限位套用于 V2；未进行硬件验证。

<!-- Source CN PDF p.5, unit 17 -->

## 2. IOMMU驱动

<!-- Source CN PDF p.5, unit 18 -->

### 2.1 驱动文件

<!-- Source CN PDF p.5, unit 19 -->

驱动文件所在位置：

<!-- Source CN PDF p.5, unit 20 -->

```text
drivers/iommu/rockchip-iommu.c
```

<!-- Source CN PDF p.5, unit 21 -->

### 2.2 DTS 节点配置

<!-- Source CN PDF p.5, unit 22 -->

DTS 配置参考文档 为 Documentation/devicetree/bindings/iommu/rockchip,iommu.txt ，本文主要说明如下参数:

<!-- Source CN PDF p.5, unit 23 -->

`compatible = "rockchip,iommu";`

<!-- Source CN PDF p.5, unit 24 -->

`compatible = "rockchip,iommu-v2";`

<!-- Source CN PDF p.6, unit 25 -->

对于所有设备的iommu，compatible字段值相同`interrupts = <GIC_SPI 119 IRQ_TYPE_LEVEL_HIGH 0>;`用于异常中断，比如缺页中断

<!-- Source CN PDF p.6, unit 26 -->

`clocks = <&cru ACLK_VOP1>, <&cru HCLK_VOP1>;`

<!-- Source CN PDF p.6, unit 27 -->

`clock-names = "aclk", "hclk";`iommu和master共享clock，这里用于iommu驱动单独控制clock

<!-- Source CN PDF p.6, unit 28 -->

`power-domains = <&power RK3399_PD_VOPL>;`用于iommu驱动操作pd功能

<!-- Source CN PDF p.6, unit 29 -->

`iommu-cells = <0>;`必须为0，详见iommu.txt

<!-- Source CN PDF p.6, unit 30 -->

## 3. IOMMU使用

<!-- Source CN PDF p.6, unit 31 -->

ROCKCHIP IOMMU驱动依赖IOMMU框架

<!-- Source CN PDF p.6, unit 32 -->

```text
drivers/iommu/iommu.c
```

<!-- Source CN PDF p.6, unit 33 -->

主要实现

<!-- Source CN PDF p.6, unit 34 -->

```text
struct iommu_ops rk_iommu_ops
```

<!-- Source CN PDF p.6, unit 35 -->

当中的回调函数，然后master调用iommu框架提供的API对iommu进行操作，如下:

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

创建页表，建立虚拟地址和物理地址的映射关系，debug时候将iommu_map里面的dbg打印打开，观察mapping过程

<!-- Source CN PDF p.6, unit 43 -->

**4. iommu unmap**

<!-- Source CN PDF p.6, unit 44 -->

```text
iommu_unmap -> rk_iommu_unmap
```

<!-- Source CN PDF p.7, unit 45 -->

解除虚拟地址和物理地址的映射关系，释放虚拟地址空间，debug时候将iommu_unmap里面的dbg打印打开，观察unmapping过程

<!-- Source CN PDF p.7, unit 46 -->

**5. domain alloc**

<!-- Source CN PDF p.7, unit 47 -->

```text
iommu_domain_alloc -> rk_iommu_domain_alloc
```

<!-- Source CN PDF p.7, unit 48 -->

申请页表基地址，用于attach/detach操作

<!-- Source CN PDF p.7, unit 49 -->

**6. domain free**

<!-- Source CN PDF p.7, unit 50 -->

```text
iommu_domain_free -> rk_iommu_domain_free
```

<!-- Source CN PDF p.7, unit 51 -->

释放页表空间

<!-- Source CN PDF p.7, unit 52 -->

**7. dump iommu页表以3399 vopl_iommu为例，假设当前访问的虚拟地址VA为0x00001000，依照如下顺序dump页表：a. 获取一级页表基地址: DT**

<!-- Source CN PDF p.7, unit 53 -->

```text
io -4 0xff8f3f00
```

<!-- Source CN PDF p.7, unit 54 -->

b. 计算一级页表偏移

<!-- Source CN PDF p.7, unit 55 -->

```text
index1 = VA >> 22
```

<!-- Source CN PDF p.7, unit 56 -->

c. 计算一级页表物理地址: DTE

<!-- Source CN PDF p.7, unit 57 -->

```text
DTE = index1 * 4 + DT
```

<!-- Source CN PDF p.7, unit 58 -->

d. 获取二级页表基地址：PT

<!-- Source CN PDF p.7, unit 59 -->

```text
PT = io -4 DTE
```

<!-- Source CN PDF p.7, unit 60 -->

e. 计算二级页表偏移

<!-- Source CN PDF p.7, unit 61 -->

```text
index2 = VA & 0x3ff000
```

<!-- Source CN PDF p.7, unit 62 -->

f. 计算二级页表物理地址: PTE

<!-- Source CN PDF p.7, unit 63 -->

```text
PTE = index2 * 4 + PT
```

<!-- Source CN PDF p.7, unit 64 -->

g. 获取PAGE物理地址: page

<!-- Source CN PDF p.7, unit 65 -->

```text
page = io -4 PTE
```

<!-- Source CN PDF p.7, unit 66 -->

h. 计算页内偏移: offset

<!-- Source CN PDF p.7, unit 67 -->

```text
offset = page + (VA & 0xfff)
```

<!-- Source CN PDF p.8, unit 68 -->

offset就是虚拟地址0x00001000对应的物理地址，master可以用此来分析数据是否正确以RK3588 vop_mmu为例，假设当前访问的虚拟地址VA为0x00001000，依照如下顺序dump页表：a. 获取一级页表基地址: DT

<!-- Source CN PDF p.8, unit 69 -->

```text
DT = io -4 0xfdd97e00
DT = ((DT & 0xf0) << 32) | ((DT & 0xf00) << 24) | (DT & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 71 -->

b. 计算一级页表偏移

<!-- Source CN PDF p.8, unit 72 -->

```text
index1 = VA >> 22
```

<!-- Source CN PDF p.8, unit 73 -->

c. 计算一级页表物理地址: DTE

<!-- Source CN PDF p.8, unit 74 -->

```text
DTE = index1 * 4 + DT
```

<!-- Source CN PDF p.8, unit 75 -->

d. 获取二级页表基地址：PT

<!-- Source CN PDF p.8, unit 76 -->

```text
PT = io -4 DTE
PT = ((PT & 0xf0) << 32) | ((PT & 0xf00) << 24) | (PT & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 78 -->

e. 计算二级页表偏移

<!-- Source CN PDF p.8, unit 79 -->

```text
index2 = VA & 0x3ff000
```

<!-- Source CN PDF p.8, unit 80 -->

f. 计算二级页表物理地址: PTE

<!-- Source CN PDF p.8, unit 81 -->

```text
PTE = index2 * 4 + PT
```

<!-- Source CN PDF p.8, unit 82 -->

g. 获取PAGE物理地址: page

<!-- Source CN PDF p.8, unit 83 -->

```text
page = io -4 PTE
page = ((page & 0xf0) << 32) | ((page & 0xf00) << 24) | (page & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 85 -->

h. 计算页内偏移: offset

<!-- Source CN PDF p.8, unit 86 -->

```text
offset = page + (VA & 0xfff)
```

<!-- Source CN PDF p.8, unit 87 -->

offset就是虚拟地址0x00001000对应的物理地址，master可以用此来分析数据是否正确

<!-- Source CN PDF p.8, unit 88 -->

**8. dma-mappinga. dev为非iommu设备**

<!-- Source CN PDF p.9, unit 89 -->

```text
ARM32: dev->dma_ops = arm_dma_ops;
ARM64: dev->dma_ops = arm64_swiotlb_dma_ops;
```

<!-- Source CN PDF p.9, unit 90 -->

b. dev为iommu设备

<!-- Source CN PDF p.9, unit 91 -->

```text
ARM32: dev->dma_ops = iommu_ops;
ARM64: dev->dma_ops = iommu_dma_ops;
```

<!-- Source CN PDF p.9, unit 92 -->

以dma_alloc_attrs函数为例：

<!-- Source CN PDF p.9, unit 93 -->

**1. 非iommu dev，从a的dma_ops调用alloc回调申请连续物理内存和内核态虚拟地址**

<!-- Source CN PDF p.9, unit 94 -->

**2. iommu dev，从b的dma_ops调用alloc回调申请物理内存，并通过iommu框架调用iommu_map来创建iommu页表，建立虚拟地址和物理地址映射关系，返回iommu虚拟地址首地址和内核态虚拟地址**

<!-- Source CN PDF p.9, unit 95 -->

一个最简单的使用iommu的步骤

<!-- Source CN PDF p.9, unit 96 -->

```text
1. domain = iommu_domain_alloc(&platform_bus_type);
2. iommu_map(domain, iova, paddr, size, prot)；
3. iommu_attach_device(domain, dev)；
4. master启动访问iommu
```

<!-- Source CN PDF p.9, unit 97 -->

iommu是一个基础的部件，可以嵌入各种内存分配的框架中，比如ion/drm，以ARM64环境下drm为例，一次完整的iommu buffer分配以及映射过程如下：

<!-- Source CN PDF p.9, unit 98 -->

```text
rockchip_gem_alloc_buf ->
rockchip_gem_get_pages ->
rockchip_gem_iommu_map ->
iommu_map_sg ->
iommu_map
```

<!-- Source CN PDF p.9, unit 99 -->

通过传递fd的iommu映射过程如下：

<!-- Source CN PDF p.9, unit 100 -->

DRM方式

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

SYSTEM HEAP方式

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

## 4. 内核配置

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

## 5. IOMMU常见问题

<!-- Source CN PDF p.10, unit 107 -->

### 5.1 pagefault中断

<!-- Source CN PDF p.10, unit 108 -->

出现pagefault中断，说明当前iommu产生了缺页异常，即当前正在访问的虚拟地址没有创建对应的映射关系。有三种可能，一是访问unmap的地址，二是越界访问，三是没有map就开始访问，历史上这三种情况master都有出现过。

<!-- Source CN PDF p.10, unit 109 -->

### 5.2 iommu enable stall异常

<!-- Source CN PDF p.10, unit 110 -->

这个很有可能是iommu已经出现pagefault异常，然后master没有处理异常，继续访问，从log可以看出该问题。

<!-- Source CN PDF p.10, unit 111 -->

还有一种可能是CLK使用不当，可以常开PD和CLK先排除这两个问题。

<!-- Source CN PDF p.11, unit 112 -->

### 5.3 iommu寄存器不能访问

<!-- Source CN PDF p.11, unit 113 -->

很有可能是master对pd的处理即pm_runtime_get_sync/pm_runtime_put_sync使用不合理导致，即没有开iommupower domain的情况下去访问iommu寄存器。

<!-- Source CN PDF p.11, unit 114 -->

### 5.4 iommu持续报中断

<!-- Source CN PDF p.11, unit 115 -->

DTS中断号填写错误。

<!-- Source CN PDF p.11, unit 116 -->

master持续访问没有映射的IOVA，这类现象经常出现在显示异常上。

<!-- Source CN PDF p.11, unit 117 -->

### 5.5 开机闪屏

<!-- Source CN PDF p.11, unit 118 -->

在vop显示过程中，使能iommu，导致vop取数异常，在没有帧生效功能的芯片中，需要等到vop没有取数再使能iommu。

<!-- Source CN PDF p.11, unit 119 -->

### 5.6 iommu寄存器异常

<!-- Source CN PDF p.11, unit 120 -->

master越界访问iommu寄存器会引起该问题

<!-- Source CN PDF p.11, unit 121 -->

master复位整个IP。因为iommu本身是集成在master IP内部，master复位也会导致 iommu被复位。

<!-- Source CN PDF p.11, unit 122 -->

因此，如果master有复位的行为，需要恢复iommu寄存器的配置。

<!-- Source CN PDF p.11, unit 123 -->

### 5.7 iommu集成device link

<!-- Source CN PDF p.11, unit 124 -->

将PD的操作权限交给master，master需要注意pm_runtime_get/pm_runtime_put的使用。

<!-- Source CN PDF p.11, unit 125 -->

master调用pm_runtime_get会使能iommu。

<!-- Source CN PDF p.11, unit 126 -->

master调用pm_runtime_put会关闭iommu。

<!-- Source CN PDF p.11, unit 127 -->

### 5.8 页表维护

<!-- Source CN PDF p.11, unit 128 -->

ARM32环境下，共享iommu的master需要维护独立的页表，比如vepu和vdpu，每次访问之前需要attach对应的页表，ARM64则是共享页表，不需要每次attach。

<!-- Source CN PDF p.11, unit 129 -->

### 5.9 高频复位问题

<!-- Source CN PDF p.11, unit 130 -->

RK3288重启压力测试，会出现vop pagefault，由于vop有超频，在超频状态vop iommu的force reset操作有可能会出现异常，解决办法是vop iommu attach时候忽略force reset。

<!-- Source CN PDF p.12, unit 131 -->

### 5.10 RK3128和RK3126的vop iommu无法读

<!-- Source CN PDF p.12, unit 132 -->

这两颗芯片vop iommu寄存器不能读，需要使用以下workaround方案，vop iommu的dts配置添加以下代码：

<!-- Source CN PDF p.12, unit 133 -->

```text
rockchip,skip-mmu-read
```

<!-- Source CN PDF p.12, unit 134 -->

驱动会忽略相应的读操作，对应的驱动代码标记为iommu->skip_read。

<!-- Source CN PDF p.12, unit 135 -->

### 5.11 reset操作

<!-- Source CN PDF p.12, unit 136 -->

对isp iommu做reset操作之后，但是无法通过读iommu状态寄存器来判断是否reset成功，实际上reset操作正确执行了。针对这个问题，isp iommu的dts配置加入以下定义作为workaround方案：

<!-- Source CN PDF p.12, unit 137 -->

```text
rockchip,disable-mmu-reset
```

<!-- Source CN PDF p.12, unit 138 -->

因此，会忽略isp iommu的reset操作，对应的驱动代码标志是：iommu->reset_disabled。

<!-- Source CN PDF p.12, unit 139 -->

### 5.12 写命令生效

<!-- Source CN PDF p.12, unit 140 -->

RK1126和RV1109的rkvenc的iommu有可能会出现写命令失效，需要重复几次写命令，防止失效

<!-- Source CN PDF p.12, unit 141 -->

### 5.13 VOP IOMMU关闭自动attach

<!-- Source CN PDF p.12, unit 142 -->

从4.19内核之后，vop由自己主动attach iommu，不在注册设备节点的时候自动attach，防止在uboot进内核阶段出现显示异常。

<!-- Source CN PDF p.12, unit 143 -->

### 5.14 刷iommu tlb导致的性能问题

<!-- Source CN PDF p.12, unit 144 -->

由于映射过程需要刷iommu tlb, 如果buffer比较离散，就会出现多次刷iommu tlb，导致性能下降。解决办法是添加标志位，只刷一次iommu tlb。

<!-- Source CN PDF p.12, unit 145 -->

### 5.15 VOP iommu添加一一映射功能

<!-- Source CN PDF p.12, unit 146 -->

可以规避从uboot到内核因为等待帧生效引起的显示异常，比如RK356X master个数超过iommu个数，无法使用等帧生效，一一映射功能可以规避这个问题。

<!-- Source CN PDF p.13, unit 147 -->

### 5.16 一个master两个iommu

<!-- Source CN PDF p.13, unit 148 -->

如果没有特殊需求，可以优化master驱动，两个iommu使用相同的页表。

<!-- Source CN PDF p.13, unit 149 -->

最新的iommu驱动对一个master带多个iommu就是采取使用相同页表的方式，这个是iommu驱动自动完成，不需要master驱动介入。

<!-- Source CN PDF p.13, unit 150 -->

### 5.17 px30 264/265切换

<!-- Source CN PDF p.13, unit 151 -->

正确切换顺序如下：

<!-- Source CN PDF p.13, unit 152 -->

1. 确保clock都打开
2. 确保pd都打开
3. 关闭所有的iommu
4. 切换grf
5. 打开当前的iommu

<!-- Source CN PDF p.13, unit 157 -->

### 5.18 RK3368 vpu和hevc同时工作异常

<!-- Source CN PDF p.13, unit 158 -->

由于RK3368的vpu和hevc共享iommu tlb，所以必须保证对tlb的操作串行化，就是映射必须串行化，否则会引起异常。

{% endraw %}
