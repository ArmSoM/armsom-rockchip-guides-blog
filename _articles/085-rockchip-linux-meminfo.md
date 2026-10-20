---
title: "Rockchip Linux Memory Debugging: meminfo, slab, memblock and Pressure"
description: "Complete memory diagnostic commands, kernel code, output logs and field definitions, with source inconsistencies flagged."
translation_key: "085-rockchip-linux-meminfo"
slug: "085-rockchip-linux-meminfo"
lang: "en"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Linux memory"]
keywords: "ArmSoM Rockchip Linux linux meminfo"
excerpt: "Complete memory diagnostic commands, kernel code, output logs and field definitions, with source inconsistencies flagged."
---

{% raw %}

# Rockchip Linux Memory Debugging: meminfo, slab, memblock and Pressure

## ArmSoM applicability and source

Platform reference for adapting ArmSoM, translated from Chinese V1.0.0. Source scope: ARM, Linux 4.19. No English PDF was supplied; English, Russian and German fully translate the Chinese source. German reuses the English article’s image URLs. No specific ArmSoM board, SDK/BSP or driver combination has been confirmed or hardware-tested. Check the actual SoC, board memory layout, SDK/BSP, kernel configuration and driver implementation. Code, addresses, logs and measurements are source examples, not ArmSoM test results.

[Editorial notes](/docs/rockchip-linux-meminfo/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

This source covers Linux commands for total memory, usage and reservations. It contains no technical figures. Commands that write sysrq or drop_caches change runtime state; they are preserved examples and were not executed during editing. The x in `echo x` is a source placeholder, not a numeric value to copy.

| Source SoC | Source kernel |
| --- | --- |
| ARM | Linux 4.19 |

<!-- Source CN PDF p.3, unit 0 -->

## 1. Total memory information

<!-- Source CN PDF p.3, unit 1 -->

### 1.1 meminfo

<!-- Source CN PDF p.3, unit 2 -->

```text
cat /proc/meminfo
```

<!-- Source CN PDF p.3, unit 3 -->

```text
MemTotal: 1497696 kB
MemFree: 590524 kB
MemAvailable: 773252 kB
Buffers: 768 kB
Cached: 216892 kB
SwapCached: 14204 kB
Active: 260884 kB
Inactive: 176744 kB
Active(anon): 120620 kB
Inactive(anon): 106688 kB
Active(file): 140264 kB
Inactive(file): 70056 kB
Unevictable: 3224 kB
Mlocked: 3224 kB
SwapTotal: 748844 kB
SwapFree: 346156 kB
Dirty: 776 kB
Writeback: 0 kB
AnonPages: 220804 kB
Mapped: 194276 kB
Shmem: 4968 kB
KReclaimable: 43900 kB
Slab: 111060 kB
SReclaimable: 40648 kB
SUnreclaim: 70412 kB
KernelStack: 18496 kB
PageTables: 42096 kB
NFS_Unstable: 0 kB
Bounce: 0 kB
WritebackTmp: 0 kB
CommitLimit: 1497692 kB
Committed_AS: 41751048 kB
VmallocTotal: 263061440 kB
VmallocUsed: 30368 kB
VmallocChunk: 0 kB
Percpu: 2528 kB
CmaTotal: 532480 kB
CmaFree: 0 kB
```

<!-- Source CN PDF p.4, unit 5 -->

`MemTotal = MemFree + Buffers + Cached`

Editorial warning: this is the source equation. Its example numbers do not satisfy it; it is not a general memory identity. The source has not been silently corrected.

<!-- Source CN PDF p.4, unit 6 -->

`SwapTotal`/`SwapFree`: the source says swap is enabled and allocated by a `swap` command in system scripts. This command name is source-specific and requires BSP verification.

<!-- Source CN PDF p.4, unit 7 -->

The swap partition is a special area on storage. When physical memory is insufficient, the operating system moves temporarily unused data there to free memory for running programs.

<!-- Source CN PDF p.4, unit 8 -->

Slab reports current slab usage: reclaimable `SReclaimable` and unreclaimable `SUnreclaim`. Excessive growth may indicate a memory leak.

<!-- Source CN PDF p.4, unit 9 -->

Vmalloc: `VmallocTotal` is the total size, `VmallocUsed` the used size.

<!-- Source CN PDF p.4, unit 10 -->

CMA: `CmaTotal` is total size, `CmaFree` free size.

<!-- Source CN PDF p.4, unit 11 -->

CMA pages borrowed by the system also count as used and reduce `CmaFree`.

<!-- Source CN PDF p.4, unit 12 -->

### 1.2 sysrq-trigger

<!-- Source CN PDF p.4, unit 13 -->

```text
echo m > /proc/sysrq-trigger
```

<!-- Source CN PDF p.4, unit 14 -->

```text
Mem-Info:
active_anon:43194 inactive_anon:26284 isolated_anon:0
 active_file:35286 inactive_file:17959 isolated_file:0
 unevictable:806 dirty:0 writeback:0 unstable:0
 slab_reclaimable:10164 slab_unreclaimable:17630
 mapped:48836 shmem:1280 pagetables:10550 bounce:0
 free:134653 free_pcp:717 free_cma:0
Node 0 active_anon:172776kB inactive_anon:105136kB active_file:141144kB
inactive_file:71836kB unevictable:3224kB isolated(anon):0kB
isolated(file):0kB mapped:195344kB dirty:0kB writeback:0kB shmeo
DMA32 free:538612kB min:4884kB low:24024kB high:25520kB active_anon:172776kB
inactive_anon:105136kB active_file:141144kB inactive_file:71836kB
unevictable:3224kB writepending:0kB present:2095104kB
lowmem_reserve[]: 0 0 0
DMA32: 13625*4kB (UEH) 12210*8kB (UEH) 8286*16kB (UMEH) 4151*32kB (UMEH)
1157*64kB (UMEH) 223*128kB (UM) 46*256kB (U) 9*512kB (U) 2*1024kB (U)
0*2048kB 0*4096kB = 538612kB
58687 total pagecache pages
3564 pages in swap cache
Swap cache stats: add 155134, delete 151579, find 11930/52536
Free swap = 346412kB
Total swap = 748844kB
523776 pages RAM
0 pages HighMem/MovableOnly
149352 pages reserved
133120 pages cma reserved
```

<!-- Source CN PDF p.5, unit 16 -->

## 2. Kernel memory information

<!-- Source CN PDF p.5, unit 17 -->

### 2.1 slab

<!-- Source CN PDF p.5, unit 18 -->

Enable two build configuration macros for this kernel allocation debugging interface:

<!-- Source CN PDF p.5, unit 19 -->

```text
CONFIG_SLUB_SYSFS=y
CONFIG_SLUB_DEBUG=y
```

<!-- Source CN PDF p.5, unit 20 -->

Command for calculating total slab size:

<!-- Source CN PDF p.5, unit 21 -->

```text
echo `cat /proc/slabinfo |awk 'BEGIN{sum=0;}{sum=sum+$3*$4;}END{print sum/1024/1024}'` MB
```

<!-- Source CN PDF p.5, unit 22 -->

#### 2.1.1 kernfs_node_cache

<!-- Source CN PDF p.5, unit 23 -->

The source example reports kernfs usage of 2.5M: 655 pages = 2.55859375 MBytes.

<!-- Source CN PDF p.5, unit 24 -->

```text
[root@RV1126_RV1109:/]# cat /proc/slabinfo |grep kernfs_node_cache
kernfs_node_cache 18319 18340 144 28 1 : tunables 0 0 0 :
slabdata 655 655 0
```

<!-- Source CN PDF p.5, unit 25 -->

Code location: `fs/kernfs/mount.c`.

<!-- Source CN PDF p.5, unit 26 -->

```text
void __init kernfs_init(void)
{

    /*
     * the slab is freed in RCU context, so kernfs_find_and_get_node_by_ino
     * can access the slab lock free. This could introduce stale nodes,
     * please see how kernfs_find_and_get_node_by_ino filters out stale
     * nodes.
     */
    kernfs_node_cache = kmem_cache_create("kernfs_node_cache",
                          sizeof(struct kernfs_node),
                          0,
                          SLAB_PANIC | SLAB_TYPESAFE_BY_RCU,
                          NULL);
}
```

<!-- Source CN PDF p.6, unit 28 -->

#### 2.1.2 inode_cache

<!-- Source CN PDF p.6, unit 29 -->

The source says inode cache uses 3.2M: 816 pages = 3.1875 MBytes. Its log below instead shows 317 slabs; this mismatch is retained for verification.

<!-- Source CN PDF p.6, unit 30 -->

```text
[root@RV1126_RV1109:/]# cat /proc/slabinfo |grep inode_cache
inode_cache 6282 6340 408 20 2 : tunables 0 0 0 :
slabdata 317 317 0
```

<!-- Source CN PDF p.6, unit 31 -->

Code location: `fs/inode.c`.

<!-- Source CN PDF p.6, unit 32 -->

```text
void __init inode_init(void)
{
    /* inode slab cache */
    inode_cachep = kmem_cache_create("inode_cache",
                     sizeof(struct inode),
                     0,
                     (SLAB_RECLAIM_ACCOUNT|SLAB_PANIC|
                     SLAB_MEM_SPREAD|SLAB_ACCOUNT),
                     init_once);
}
```

<!-- Source CN PDF p.6, unit 33 -->

### 2.2 memblock

<!-- Source CN PDF p.6, unit 34 -->

This interface debugs system-reserved memory. Add `memblock=debug` to bootargs in the build configuration:

<!-- Source CN PDF p.6, unit 35 -->

```text
chosen {
    bootargs = "earlycon=uart8250,mmio32,0xff570000 console=ttyFIQ0 memblock=debug";
};
```

<!-- Source CN PDF p.7, unit 36 -->

```text
[ 0.000000] MEMBLOCK configuration:
[ 0.000000] memory size = 0x3fdb8000 reserved size = 0x11706eb8
[ 0.000000] memory.cnt = 0x2
[ 0.000000] memory[0x0] [0x00000000-0x083fffff], 0x08400000 bytes flags: 0x0
[ 0.000000] memory[0x1] [0x08648000-0x3fffffff], 0x379b8000 bytes flags: 0x0
[ 0.000000] reserved.cnt = 0x7
[ 0.000000] reserved[0x0] [0x00004000-0x00007fff], 0x00004000 bytes flags: 0x0
[ 0.000000] reserved[0x1] [0x00100000-0x00e32b2f], 0x00d32b30 bytes flags: 0x0
[ 0.000000] reserved[0x2] [0x08000000-0x080fffff], 0x00100000 bytes flags: 0x0
[ 0.000000] reserved[0x3] [0x08300000-0x08318fff], 0x00019000 bytes flags: 0x0
[ 0.000000] reserved[0x4] [0x2dc00000-0x3dbfffff], 0x10000000 bytes flags: 0x0 CMA
[ 0.000000] reserved[0x5] [0x3df00000-0x3dfb7387], 0x000b7388 bytes flags: 0x0
[ 0.000000] reserved[0x6] [0x3f800000-0x3fffffff], 0x00800000 bytes flags: 0x0 CMA
```

<!-- Source CN PDF p.7, unit 37 -->

The larger reservations include initrd (used to load root) and node memmap (used to manage memory pages).

<!-- Source CN PDF p.7, unit 38 -->

initrd reserves 13MBytes:

<!-- Source CN PDF p.7, unit 39 -->

```text
void __init arm_memblock_init(const struct machine_desc *mdesc)
{
    arm_initrd_init();
}
```

<!-- Source CN PDF p.7, unit 40 -->

node memmap reserves 8MBytes:

<!-- Source CN PDF p.7, unit 41 -->

```text
[ 0.000000] On node 0 totalpages: 262006
[ 0.000000] memblock_reserve: [0x3ef75000-0x3f774fff]
memblock_virt_alloc_internal+0x108/0x1a4
[ 0.000000] alloc_node_mem_map: node 0, pgdat b0d4bd00, node_mem_map eef75000
[ 0.000000] Normal zone: 2048 pages used for memmap
[ 0.000000] Normal zone: 0 pages reserved
[ 0.000000] Normal zone: 262006 pages, LIFO batch:63
```

<!-- Source CN PDF p.7, unit 42 -->

Device memory layout printed at boot:

<!-- Source CN PDF p.8, unit 43 -->

```text
[ 0.000000] Virtual kernel memory layout:
[ 0.000000] vector : 0xffff0000 - 0xffff1000 ( 4 kB)
[ 0.000000] fixmap : 0xffc00000 - 0xfff00000 (3072 kB)
[ 0.000000] vmalloc : 0xf0800000 - 0xff800000 ( 240 MB)
[ 0.000000] lowmem : 0xb0000000 - 0xf0000000 (1024 MB)
[ 0.000000] pkmap : 0xafe00000 - 0xb0000000 ( 2 MB)
[ 0.000000] modules : 0xaf000000 - 0xafe00000 ( 14 MB)
[ 0.000000] .text : 0x(ptrval) - 0x(ptrval) (9184 kB)
[ 0.000000] .init : 0x(ptrval) - 0x(ptrval) (1024 kB)
[ 0.000000] .data : 0x(ptrval) - 0x(ptrval) ( 332 kB)
[ 0.000000] .bss : 0x(ptrval) - 0x(ptrval) ( 896 kB)
```

<!-- Source CN PDF p.8, unit 44 -->

```text
[ 0.000000] Memory: 752320K/1048024K available (8192K kernel code, 331K rwdata, 1900K rodata, 1024K init, 895K bss, 25368K reserved, 270336K cma-reserved, 0K highmem)
```

<!-- Source CN PDF p.8, unit 45 -->

`752320K`: available free-page memory, `nr_free_pages() << (PAGE_SHIFT - 10)`.

<!-- Source CN PDF p.8, unit 46 -->

`1048024K`: total visible physical memory, `physpages << (PAGE_SHIFT - 10)`.

<!-- Source CN PDF p.8, unit 47 -->

`kernel code`: kernel code, `codesize = _etext - _stext`.

<!-- Source CN PDF p.8, unit 48 -->

`rwdata`: read/write data, `datasize = _edata - _sdata`.

<!-- Source CN PDF p.8, unit 49 -->

`rodata`: read-only data, `rosize = __end_rodata - __start_rodata`.

<!-- Source CN PDF p.8, unit 50 -->

`init`: `init_data_size = __init_end - __init_begin` plus `init_code_size = _einittext - _sinittext`.

<!-- Source CN PDF p.8, unit 51 -->

`bss`: uninitialized global variables, `bss_size = __bss_stop - __bss_start`.

<!-- Source CN PDF p.8, unit 52 -->

`reserved`: memory reserved by memblock, `physpages - totalram_pages - totalcma_pages`.

<!-- Source CN PDF p.8, unit 53 -->

`cma-reserved`: CMA-reserved memory, `totalcma_pages`.

<!-- Source CN PDF p.8, unit 54 -->

```text
[ 0.000000] Reserved memory: created CMA memory pool at 0x3f800000, size 8 MiB
[ 0.000000] OF: reserved mem: initialized node linux,cma, compatible id shared-dma-pool
[ 0.000000] Reserved memory: created CMA memory pool at 0x2dc00000, size 256 MiB
[ 0.000000] OF: reserved mem: initialized node isp, compatible id shared-dma-pool
```

<!-- Source CN PDF p.8, unit 55 -->

#### 2.2.1 memory

<!-- Source CN PDF p.8, unit 56 -->

The kernel supports multiple memory blocks. Before entering the kernel, Rockchip platforms use some memory for special purposes. For example, OPTEE/ATF code must be placed at 132M–135M; the `0x248000` block below stores OPTEE code in the source example.

<!-- Source CN PDF p.8, unit 57 -->

```text
[root@RV1126_RV1109:/]# cat /sys/kernel/debug/memblock/memory
   0: 0x00000000..0x083fffff
   1: 0x08648000..0x3fffffff
```

<!-- Source CN PDF p.9, unit 58 -->

#### 2.2.2 reserved

<!-- Source CN PDF p.9, unit 59 -->

```text
[root@RV1126_RV1109:/]# cat /sys/kernel/debug/memblock/reserved
   0: 0x00004000..0x00007fff
   1: 0x00100000..0x00e32b2f
   2: 0x08000000..0x080fffff
   3: 0x08300000..0x08318fff
   4: 0x083ff000..0x083fffff
   5: 0x2dc00000..0x3dbfffff
   6: 0x3df00000..0x3dfb7387
   7: 0x3ee41000..0x3ef3cfff
   8: 0x3ef3f480..0x3ef3f4f7
   9: 0x3ef3f500..0x3ef3f803
  10: 0x3ef3f834..0x3f7fefff
  11: 0x3f7ff040..0x3f7ff384
  12: 0x3f7ff3c0..0x3f7ff3fb
  13: 0x3f7ff400..0x3f7ff583
  14: 0x3f7ff5c0..0x3f7ff784
  15: 0x3f7ff7c0..0x3f7ff837
  16: 0x3f7ff840..0x3f7ff84f
  17: 0x3f7ff880..0x3f7ff88f
  18: 0x3f7ff8c0..0x3f7ff8c3
  19: 0x3f7ff900..0x3f7ff903
  20: 0x3f7ff940..0x3f7ffa4b
  21: 0x3f7ffa80..0x3f7ffb8b
  22: 0x3f7ffbc0..0x3f7ffccb
  23: 0x3f7ffcf0..0x3f7ffd08
  24: 0x3f7ffd0c..0x3f7ffd24
  25: 0x3f7ffd28..0x3f7ffd72
  26: 0x3f7ffd74..0x3f7ffd8e
  27: 0x3f7ffd90..0x3f7ffdaa
  28: 0x3f7ffdac..0x3f7ffdc6
  29: 0x3f7ffdc8..0x3f7ffde2
  30: 0x3f7ffde4..0x3f7ffdfe
  31: 0x3f7ffe00..0x3f7ffedf
  32: 0x3f7ffee8..0x3f7fff9f
  33: 0x3f7fffb0..0x3fffffff
```

<!-- Source CN PDF p.9, unit 60 -->

### 2.3 zoneinfo

<!-- Source CN PDF p.9, unit 61 -->

```text
cat /proc/zoneinfo
```

<!-- Source CN PDF p.9, unit 62 -->

```text
Node 0, zone DMA32
  per-node stats
      nr_inactive_anon 28250
      nr_active_anon 34245
      nr_inactive_file 29724
      nr_active_file 33943
      nr_unevictable 806
      nr_slab_reclaimable 10088
      nr_slab_unreclaimable 17495
      nr_isolated_anon 0
    nr_isolated_file 0
    workingset_refault 258089
    workingset_activate 54883
    workingset_restore 35120
    workingset_nodereclaim 4574
    nr_anon_pages 59384
    nr_mapped 65408
    nr_file_pages 70824
    nr_dirty 31
    nr_writeback 0
    nr_writeback_temp 0
    nr_shmem 1581
    nr_shmem_hugepages 0
    nr_shmem_pmdmapped 0
    nr_anon_transparent_hugepages 0
    nr_unstable 0
    nr_vmscan_write 148946
    nr_vmscan_immediate_reclaim 2540
    nr_dirtied 798484
    nr_written 938957
    nr_kernel_misc_reclaimable 0
    nr_unreclaimable_pages 0
    nr_ion_heap 0
    nr_ion_heap_pool 0
    nr_gpu_heap 0
pages free 133183
      min 1221
      low 6006
      high 6380
      spanned 523776
      present 523776
      managed 374424
      protection: (0, 0, 0)
    nr_free_pages 133183
    nr_zone_inactive_anon 28250
    nr_zone_active_anon 34245
    nr_zone_inactive_file 29724
    nr_zone_active_file 33943
    nr_zone_unevictable 806
    nr_zone_write_pending 31
    nr_mlock 806
    nr_page_table_pages 10425
    nr_kernel_stack 18256
    nr_bounce 0
    nr_zspages 26061
    nr_free_cma 0
pagesets
  cpu: 0
            count: 342
            high: 378
            batch: 63
vm stats threshold: 30
  cpu: 1
            count: 301
            high: 378
            batch: 63
  vm stats threshold: 30
    cpu: 2
              count: 32
              high: 378
              batch: 63
  vm stats threshold: 30
    cpu: 3
              count: 296
              high: 378
              batch: 63
  vm stats threshold: 30
  node_unreclaimable: 0
  start_pfn: 512
Node 0, zone Normal
  pages free 0
        min 0
        low 0
        high 0
        spanned 0
        present 0
        managed 0
        protection: (0, 0, 0)
Node 0, zone Movable
  pages free 0
        min 0
        low 0
        high 0
        spanned 0
        present 0
        managed 0
        protection: (0, 0, 0)
```

<!-- Source CN PDF p.11, unit 65 -->

## 3. Free memory

<!-- Source CN PDF p.11, unit 66 -->

### 3.1 free

<!-- Source CN PDF p.11, unit 67 -->

`total`: total memory under kernel page management.

<!-- Source CN PDF p.11, unit 68 -->

`used`: memory currently in use.

<!-- Source CN PDF p.11, unit 69 -->

`free`: free memory.

<!-- Source CN PDF p.11, unit 70 -->

`shared`: shared memory, described in the source with anonymous pages as an example.

<!-- Source CN PDF p.11, unit 71 -->

`buffers`: buffer memory.

<!-- Source CN PDF p.11, unit 72 -->

`cached`: cache memory.

<!-- Source CN PDF p.11, unit 73 -->

The source distinguishes cached and buffers as follows. Cached accelerates reads: previously read data stays in memory, so a later read need not access disk. Buffers accelerates writes: scattered writes are first collected in memory and then written to disk in batches, reducing disk fragmentation and repeated seeking. This is the source’s simplified explanation, not a complete description of modern Linux caching.

<!-- Source CN PDF p.12, unit 74 -->

```text
free
```

<!-- Source CN PDF p.12, unit 75 -->

```text
                  total used free shared buffers
  Mem: 1533640704 1308901376 224739328 6422528 921600
-/+ buffers/cache: 1307979776 225660928
  Swap: 766816256 401342464 365473792
```

<!-- Source CN PDF p.12, unit 76 -->

```text
free -m
```

<!-- Source CN PDF p.12, unit 77 -->

```text
                  total used free shared buffers
  Mem: 1462 1249 213 6 0
-/+ buffers/cache: 1248 214
  Swap: 731 382 348
```

<!-- Source CN PDF p.12, unit 78 -->

```text
free -h
```

<!-- Source CN PDF p.12, unit 79 -->

```text
                total used free shared buffers
Mem: 1.4G 1.2G 212M 6.1M 900K
-/+ buffers/cache: 1.2G 213M
Swap: 731M 383M 349M
```

<!-- Source CN PDF p.12, unit 80 -->

## 4. Clearing caches

<!-- Source CN PDF p.12, unit 81 -->

### 4.1 drop_caches

<!-- Source CN PDF p.12, unit 82 -->

```text
echo x > /proc/sys/vm/drop_caches
```

<!-- Source CN PDF p.12, unit 83 -->

Clear pagecache:

<!-- Source CN PDF p.12, unit 84 -->

```text
echo 1 > /proc/sys/vm/drop_caches
```

<!-- Source CN PDF p.12, unit 85 -->

Clear dentries and inodes:

<!-- Source CN PDF p.12, unit 86 -->

```text
echo 2 > /proc/sys/vm/drop_caches
```

<!-- Source CN PDF p.12, unit 87 -->

Clear all listed caches (pagecache, dentries and inodes):

<!-- Source CN PDF p.12, unit 88 -->

```text
echo 3 > /proc/sys/vm/drop_caches
```

<!-- Source CN PDF p.13, unit 89 -->

## 5. Virtual memory usage

<!-- Source CN PDF p.13, unit 90 -->

### 5.1 vmallocinfo

<!-- Source CN PDF p.13, unit 91 -->

```text
cat /proc/vmallocinfo
```

<!-- Source CN PDF p.13, unit 92 -->

```text
0x0000000000000000-0x0000000000000000 8192 bpf_jit_binary_alloc+0x70/0x110
pages=1 vmalloc
...
0x0000000000000000-0x0000000000000000 20480 start_kernel+0x330/0x4f0
pages=4 vmalloc
0x0000000000000000-0x0000000000000000 8192 of_iomap+0x4c/0xb8
phys=0x00000000fdd00000 ioremap
0x0000000000000000-0x0000000000000000 20480 start_kernel+0x330/0x4f0
pages=4 vmalloc
0x0000000000000000-0x0000000000000000 8192 of_iomap+0x4c/0xb8
phys=0x00000000fdd20000 ioremap
0x0000000000000000-0x0000000000000000 20480 start_kernel+0x330/0x4f0
pages=4 vmalloc
```

<!-- Source CN PDF p.13, unit 93 -->

### 5.2 vmstat

<!-- Source CN PDF p.13, unit 94 -->

```text
cat /proc/vmstat
```

<!-- Source CN PDF p.13, unit 95 -->

## 6. Memory pressure

<!-- Source CN PDF p.13, unit 96 -->

### 6.1 pressure

<!-- Source CN PDF p.13, unit 97 -->

```text
cat /proc/pressure/memory
```

<!-- Source CN PDF p.13, unit 98 -->

VSS — Virtual Set Size: virtual memory usage, including shared libraries.

<!-- Source CN PDF p.13, unit 99 -->

RSS — Resident Set Size: actual physical memory usage, including shared libraries.

<!-- Source CN PDF p.13, unit 100 -->

PSS — Proportional Set Size: physical memory usage with shared-library memory apportioned proportionally.

<!-- Source CN PDF p.13, unit 101 -->

USS — Unique Set Size: physical memory used exclusively by the process, excluding shared libraries.

<!-- Source CN PDF p.13, unit 102 -->

The usual relationship given by the source is `VSS >= RSS >= PSS >= USS`.

{% endraw %}
