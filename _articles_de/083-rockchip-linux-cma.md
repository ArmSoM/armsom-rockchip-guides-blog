---
title: "Rockchip Linux CMA: Treiberaufbau, Speicherreservierung und Diagnose"
description: "Vollständige CMA-Konfiguration mit DTS, gerätespezifischen Bereichen, debugfs, Ablaufgrafik und Startprotokollen."
translation_key: "083-rockchip-linux-cma"
slug: "083-rockchip-linux-cma"
lang: "de"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "CMA"]
keywords: "ArmSoM Rockchip Linux linux cma"
excerpt: "Vollständige CMA-Konfiguration mit DTS, gerätespezifischen Bereichen, debugfs, Ablaufgrafik und Startprotokollen."
---

{% raw %}

# Rockchip Linux CMA: Treiberaufbau, Speicherreservierung und Diagnose

## ArmSoM-Anwendbarkeit und Quelle

Plattformreferenz zur Anpassung an ArmSoM, übersetzt aus der chinesischen Fassung V1.1.0. Geltungsbereich der Quelle: RK3588 / RK3568 / RK3399 / RK3288 / RK3368 / RV1126 / PX30, Linux 4.4 / 4.19 / 5.10. Ein englisches PDF liegt nicht vor; Englisch, Russisch und Deutsch sind vollständig aus dem Chinesischen übersetzt. Die deutsche Fassung verwendet dieselben Bild-URLs wie die englische. Bestimmte ArmSoM-Boards, SDK/BSP- oder Treiberkombinationen wurden weder bestätigt noch an Hardware geprüft. SoC, Speicheraufteilung des Boards, SDK/BSP, Kernelkonfiguration und Treiberimplementierung prüfen. Code, Adressen, Protokolle und Messwerte sind Quellbeispiele, keine ArmSoM-Testergebnisse.

[Redaktionelle Prüfnotizen](/docs/rockchip-linux-cma/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

Die einzige Ablaufgrafik stammt von Seite 4 des chinesischen PDFs; ein englisches Original liegt nicht vor.

| SoC der Quelle | Kernel der Quelle |
| --- | --- |
| RK3588 / RK3568 / RK3399 / RK3288 / RK3368 / RV1126 / PX30 | Linux 4.4 / 4.19 / 5.10 |

<!-- Source CN PDF p.4, unit 0 -->

## 1. Aufbau des CMA-Treibers

<!-- Source CN PDF p.4, unit 1 -->

![Aufbau des CMA-Treibers (chinesisches PDF, Seite 4)](/docs/rockchip-linux-cma/assets/cn-p004-X37.png)

*Aufbau des CMA-Treibers (chinesisches PDF, Seite 4)*

<!-- Source CN PDF p.4, unit 2 -->

Der CMA-Treiber besteht aus drei Hauptteilen:

<!-- Source CN PDF p.4, unit 3 -->

1. `size@address`

<!-- Source CN PDF p.4, unit 4 -->

Parameter lassen sich auf drei Wegen übergeben. Im beschriebenen BSP gilt `DTS > CMDLINE > DEFCONFIG`: Ein gültiger DTS-Knoten bestimmt die endgültigen Werte; andernfalls wird `cma=size@base` in der Kernel-Kommandozeile geprüft und zuletzt werden die im Quelltext erwähnten vier defconfig-Makros herangezogen.

<!-- Source CN PDF p.4, unit 5 -->

2. `reserved cma_areas[]`

<!-- Source CN PDF p.4, unit 6 -->

Im DTS lassen sich mehrere CMA-Knoten konfigurieren; cmdline und defconfig definieren nur den Standardknoten. Sämtliche reservierten Bereiche werden im globalen Array `cma_areas[]` gespeichert.

<!-- Source CN PDF p.4, unit 7 -->

3. `active cma_area`

<!-- Source CN PDF p.4, unit 8 -->

Parameter werden während `setup_arch` ausgewertet und Speicher wird dort reserviert. Die Aktivierung erfolgt über `core_initcall` vor allen Treibern. Dabei werden hauptsächlich die Bitmap des CMA-Bereichs erstellt und CMA-Seiten in das Buddy-System aufgenommen.

<!-- Source CN PDF p.5, unit 9 -->

## 2. Reservierten Speicher zuweisen

<!-- Source CN PDF p.5, unit 10 -->

### 2.1 Verfahren 1: 16MByte über menuconfig reservieren

<!-- Source CN PDF p.5, unit 11 -->

```text
CONFIG_DMA_CMA=y
CONFIG_CMA_SIZE_MBYTES=16
CONFIG_CMA_SIZE_SEL_MBYTES=y
```

<!-- Source CN PDF p.5, unit 12 -->

### 2.2 Verfahren 2: der DTS-Knoten reserved-memory

<!-- Source CN PDF p.5, unit 13 -->

Siehe `Documentation/devicetree/bindings/reserved-memory/reserved-memory.txt`.

<!-- Source CN PDF p.5, unit 14 -->

```text
reserved-memory {
    #address-cells = <1>;
    #size-cells = <1>;
    ranges;

    /* global autoconfigured region for contiguous allocations */
    linux,cma {
        compatible = "shared-dma-pool";
        reusable;
        size = <0x1000000>;
        alignment = <0x2000>;
        linux,cma-default;
    };
};
```

<!-- Source CN PDF p.5, unit 15 -->

## 3. Gerätespezifischen Speicher zuweisen

<!-- Source CN PDF p.5, unit 16 -->

Die genannten Verfahren weisen einen gemeinsam vom System genutzten Speicherbereich zu. Wiederholtes Anfordern und Freigeben durch mehrere Geräte kann ihn fragmentieren. Benötigt eine Peripherie große zusammenhängende CMA-Blöcke, kann dies ihre Funktion beeinträchtigen. Dafür wird ein eigener Bereich zugewiesen.

<!-- Source CN PDF p.6, unit 17 -->

### 3.1 Verfahren 1: separater Bereich, den das System ausleihen darf

<!-- Source CN PDF p.6, unit 18 -->

```text
reserved-memory {
    #address-cells = <1>;
    #size-cells = <1>;
    ranges;

    cma_region: region@88000000 {
        compatible = "shared-dma-pool";
        reusable;
        reg = <0x88000000 0x1800000>;
    };
};
```

<!-- Source CN PDF p.6, unit 19 -->

Dieser Bereich lässt sich mit `of_reserved_mem_device_init` einem bestimmten Gerät zuordnen.

<!-- Source CN PDF p.6, unit 20 -->

```text
#include <linux/of_reserved_mem.h>
static inline int of_reserved_mem_device_init(struct device *dev)
{
    return of_reserved_mem_device_init_by_idx(dev, dev->of_node, 0);
}
```

<!-- Source CN PDF p.6, unit 21 -->

### 3.2 Verfahren 2: ein memblock-Bereich

<!-- Source CN PDF p.6, unit 22 -->

```text
reserved-memory {
    #address-cells = <1>;
    #size-cells = <1>;
    ranges;

    display_reserved: framebuffer@78000000 {
        reg = <0x78000000 0x800000>;
    };
};
```

<!-- Source CN PDF p.6, unit 23 -->

Das Ergebnis lässt sich unter `/sys/kernel/debug/memblock/reserved` prüfen.

<!-- Source CN PDF p.6, unit 24 -->

Die dort angezeigten memblock-Bereiche wurden zusammengeführt und bereinigt.

<!-- Source CN PDF p.6, unit 25 -->

Dieser Speicher unterliegt nicht der Seitenverwaltung des Kernels. Laut Quelle erstellt der Nutzer bei Bedarf eine „page scale list“. Der unklare Originalbegriff bleibt zur Klärung erhalten.

<!-- Source CN PDF p.6, unit 26 -->

```text
console:/sys/kernel/debug/cma # cat /sys/kernel/debug/memblock/reserved
    0: 0x60004000..0x60007fff
    1: 0x60100000..0x61404a07
    2: 0x62e00000..0x62eeffff
    3: 0x68300000..0x6830d07f
...
```

<!-- Source CN PDF p.7, unit 27 -->

## 4. Speicherreservierung untersuchen

<!-- Source CN PDF p.7, unit 28 -->

### 4.1 CMA-Debugoptionen

<!-- Source CN PDF p.7, unit 29 -->

```text
CONFIG_CMA_DEBUGFS=y #打开调试文件节点
CONFIG_CMA_DEBUG=y #打印CMA日志信息
```

`CONFIG_CMA_DEBUGFS=y` erstellt Debugknoten; `CONFIG_CMA_DEBUG=y` aktiviert CMA-Protokollausgaben.

<!-- Source CN PDF p.7, unit 30 -->

### 4.2 CMA-Debugknoten

<!-- Source CN PDF p.7, unit 31 -->

```text
console:/sys/kernel/debug/cma # ls
cma-region@8800 cma-reserved
console:/sys/kernel/debug/cma/cma-reserved # ls
alloc bitmap free order_per_bit used
base_pfn count maxchunk
```

<!-- Source CN PDF p.7, unit 32 -->

`alloc`: Speicher aus dem aktuellen CMA-Bereich anfordern, Einheit: Seiten.

<!-- Source CN PDF p.7, unit 33 -->

`bitmap`: Belegungsstatus der Seiten; 1 bedeutet angefordert, 0 bedeutet nicht angefordert.

<!-- Source CN PDF p.7, unit 34 -->

`free`: Speicher im aktuellen CMA-Bereich freigeben, Einheit: Seiten.

<!-- Source CN PDF p.7, unit 35 -->

`order_per_bit`: Ordnung der Seitenanzahl, die ein einzelnes Bit darstellt.

<!-- Source CN PDF p.7, unit 36 -->

`used`: Anzahl der derzeit angeforderten Seiten.

<!-- Source CN PDF p.7, unit 37 -->

`base_pfn`: Seitenrahmennummer der ersten Seite im aktuellen CMA-Bereich.

<!-- Source CN PDF p.7, unit 38 -->

`maxchunk`: größte Anzahl zusammenhängender freier Seiten im aktuellen CMA-Bereich.

<!-- Source CN PDF p.7, unit 39 -->

## 5. Meldungen zur Speicherreservierung beim Start

<!-- Source CN PDF p.7, unit 40 -->

```text
[ 0.000000] Booting Linux on physical CPU 0xf00
[ 0.000000] CPU: ARMv7 Processor [410fc075] revision 5 (ARMv7), cr=10c5387d
[ 0.000000] CPU: div instructions available: patching division code
[ 0.000000] CPU: PIPT / VIPT nonaliasing data cache, VIPT aliasing instruction cache
[ 0.000000] OF: fdt: Machine model: Rockchip RK3126 bnd-d708 board
[ 0.000000] earlycon: uart8250 at MMIO32 0x20068000 (options '')
[ 0.000000] bootconsole [uart8250] enabled
[ 0.000000] Memory policy: Data cache writealloc
[ 0.000000] Reserved memory: created CMA memory pool at 0x88000000, size 24 MiB
[ 0.000000] OF: reserved mem: initialized node region@88000000, compatible id shared-dma-pool
[ 0.000000] cma: Reserved 16 MiB at 0x9f000000
[ 0.000000] On node 0 totalpages: 258560
[ 0.000000] Normal zone: 1728 pages used for memmap
[ 0.000000] Normal zone: 0 pages reserved
[ 0.000000] Normal zone: 193024 pages, LIFO batch:63
[ 0.000000] HighMem zone: 65536 pages, LIFO batch:15
[ 0.000000] psci: probing for conduit method from DT.
[ 0.000000] psci: PSCIv65535.65535 detected in firmware.
[ 0.000000] psci: Using standard PSCI v0.2 function IDs
[ 0.000000] psci: MIGRATE_INFO_TYPE not supported.
[ 0.000000] psci: SMC Calling Convention v1.0
[ 0.000000] percpu: Embedded 17 pages/cpu s38924 r8192 d22516 u69632
[ 0.000000] pcpu-alloc: s38924 r8192 d22516 u69632 alloc=17*4096
[ 0.000000] pcpu-alloc: [0] 0 [0] 1 [0] 2 [0] 3
[ 0.000000] Built 1 zonelists, mobility grouping on. Total pages: 256832
[ 0.000000] Dentry cache hash table entries: 131072 (order: 7, 524288 bytes)
[ 0.000000] Inode-cache hash table entries: 65536 (order: 6, 262144 bytes)
[ 0.000000] mem auto-init: stack:off, heap alloc:off, heap free:off
[ 0.000000] Memory: 960940K/1034240K available (11264K kernel code, 985K rwdata, 3180K rodata, 1024K init, 2104K bss, 32340K reserved, 40960K cma-reserved, 245024K highmem)
...
```

<!-- Source CN PDF p.8, unit 42 -->

Erfolgreiche Zuweisung des ersten CMA-Bereichs:

<!-- Source CN PDF p.8, unit 43 -->

```text
[ 0.000000] Reserved memory: created CMA memory pool at 0x88000000, size 24 MiB
[ 0.000000] OF: reserved mem: initialized node region@88000000, compatible id shared-dma-pool
```

<!-- Source CN PDF p.8, unit 44 -->

Erfolgreiche Zuweisung des zweiten CMA-Bereichs (Systemstandard):

<!-- Source CN PDF p.8, unit 45 -->

```text
[ 0.000000] cma: Reserved 16 MiB at 0x9f000000
```

{% endraw %}
