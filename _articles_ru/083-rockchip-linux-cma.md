---
title: "Rockchip Linux CMA: драйвер, резервирование памяти и отладка"
description: "Полная настройка CMA, DTS, отдельные блоки, debugfs, схема и журналы загрузки."
translation_key: "083-rockchip-linux-cma"
slug: "083-rockchip-linux-cma"
lang: "ru"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "CMA"]
keywords: "ArmSoM Rockchip Linux linux cma"
excerpt: "Полная настройка CMA, DTS, отдельные блоки, debugfs, схема и журналы загрузки."
---

{% raw %}

# Rockchip Linux CMA: драйвер, резервирование памяти и отладка

## Применимость к ArmSoM и источник

Справочный материал для адаптации ArmSoM, переведённый с китайского V1.1.0. Область исходника: RK3588 / RK3568 / RK3399 / RK3288 / RK3368 / RV1126 / PX30, Linux 4.4 / 4.19 / 5.10. Английский PDF отсутствует; английская, русская и немецкая версии полностью переведены с китайского. Немецкая использует те же изображения, что английская статья. Конкретные платы ArmSoM, SDK/BSP и сочетания драйверов не подтверждены и аппаратно не проверены. Сверьте SoC, карту памяти платы, SDK/BSP, конфигурацию ядра и реализацию драйвера. Код, адреса, журналы и числа — примеры исходника, а не результаты тестов ArmSoM.

[Редакционные примечания](/docs/rockchip-linux-cma/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

Единственная схема взята со страницы 4 китайского PDF; английского оригинала нет.

| SoC исходника | Ядро исходника |
| --- | --- |
| RK3588 / RK3568 / RK3399 / RK3288 / RK3368 / RV1126 / PX30 | Linux 4.4 / 4.19 / 5.10 |

<!-- Source CN PDF p.4, unit 0 -->

## 1. Структура драйвера CMA

<!-- Source CN PDF p.4, unit 1 -->

![Структура драйвера CMA (китайский PDF, страница 4)](/docs/rockchip-linux-cma/assets/cn-p004-X37.png)

*Структура драйвера CMA (китайский PDF, страница 4)*

<!-- Source CN PDF p.4, unit 2 -->

Драйвер CMA состоит из трёх основных частей:

<!-- Source CN PDF p.4, unit 3 -->

1. `size@address`

<!-- Source CN PDF p.4, unit 4 -->

Параметры передаются тремя способами. Приоритет в исходном BSP: `DTS > CMDLINE > DEFCONFIG`. Если в DTS есть допустимый узел, применяется его конфигурация; иначе проверяется `cma=size@base` в cmdline, затем четыре определения макросов defconfig, упомянутые в исходнике.

<!-- Source CN PDF p.4, unit 5 -->

2. `reserved cma_areas[]`

<!-- Source CN PDF p.4, unit 6 -->

Через DTS можно настроить несколько узлов CMA; cmdline и defconfig задают только узел default. Все зарезервированные области хранятся в глобальном `cma_areas[]`.

<!-- Source CN PDF p.4, unit 7 -->

3. `active cma_area`

<!-- Source CN PDF p.4, unit 8 -->

Разбор параметров и резервирование памяти выполняются на этапе `setup_arch`. Активация вызывается через `core_initcall` до всех драйверов: создаётся bitmap области CMA, а страницы CMA добавляются в buddy system.

<!-- Source CN PDF p.5, unit 9 -->

## 2. Выделение резервируемой памяти

<!-- Source CN PDF p.5, unit 10 -->

### 2.1 Способ 1: резервирование 16MByte через menuconfig

<!-- Source CN PDF p.5, unit 11 -->

```text
CONFIG_DMA_CMA=y
CONFIG_CMA_SIZE_MBYTES=16
CONFIG_CMA_SIZE_SEL_MBYTES=y
```

<!-- Source CN PDF p.5, unit 12 -->

### 2.2 Способ 2: узел reserved-memory в DTS

<!-- Source CN PDF p.5, unit 13 -->

См. `Documentation/devicetree/bindings/reserved-memory/reserved-memory.txt`.

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

## 3. Выделение памяти отдельному устройству

<!-- Source CN PDF p.5, unit 16 -->

Описанные выше способы создают общий системный блок. Повторные выделения и освобождения разными устройствами приводят к фрагментации. Некоторым периферийным устройствам нужны большие непрерывные блоки CMA; фрагментация может нарушить их работу. Для них следует выделять отдельный блок.

<!-- Source CN PDF p.6, unit 17 -->

### 3.1 Способ 1: отдельный блок, который может заимствовать система

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

Область назначается устройству через `of_reserved_mem_device_init`.

<!-- Source CN PDF p.6, unit 20 -->

```text
#include <linux/of_reserved_mem.h>
static inline int of_reserved_mem_device_init(struct device *dev)
{
    return of_reserved_mem_device_init_by_idx(dev, dev->of_node, 0);
}
```

<!-- Source CN PDF p.6, unit 21 -->

### 3.2 Способ 2: блок memblock

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

Результат выделения доступен в `/sys/kernel/debug/memblock/reserved`.

<!-- Source CN PDF p.6, unit 24 -->

Показанные диапазоны memblock объединены и упорядочены.

<!-- Source CN PDF p.6, unit 25 -->

Такие блоки не управляются подсистемой страниц ядра. В исходнике сказано при необходимости создать «page scale list»; термин сохранён до уточнения.

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

## 4. Отладка резервирования памяти

<!-- Source CN PDF p.7, unit 28 -->

### 4.1 Макросы отладки CMA

<!-- Source CN PDF p.7, unit 29 -->

```text
CONFIG_CMA_DEBUGFS=y #打开调试文件节点
CONFIG_CMA_DEBUG=y #打印CMA日志信息
```

`CONFIG_CMA_DEBUGFS=y` создаёт узлы отладки; `CONFIG_CMA_DEBUG=y` включает журнал CMA.

<!-- Source CN PDF p.7, unit 30 -->

### 4.2 Узлы отладки CMA

<!-- Source CN PDF p.7, unit 31 -->

```text
console:/sys/kernel/debug/cma # ls
cma-region@8800 cma-reserved
console:/sys/kernel/debug/cma/cma-reserved # ls
alloc bitmap free order_per_bit used
base_pfn count maxchunk
```

<!-- Source CN PDF p.7, unit 32 -->

`alloc`: выделяет память текущего блока CMA, единица — страницы.

<!-- Source CN PDF p.7, unit 33 -->

`bitmap`: состояние каждой страницы CMA; 1 — выделена, 0 — не выделена.

<!-- Source CN PDF p.7, unit 34 -->

`free`: освобождает память текущего блока CMA, единица — страницы.

<!-- Source CN PDF p.7, unit 35 -->

`order_per_bit`: порядок числа страниц, представляемых одним битом.

<!-- Source CN PDF p.7, unit 36 -->

`used`: число выделенных в данный момент страниц.

<!-- Source CN PDF p.7, unit 37 -->

`base_pfn`: номер кадра первой страницы текущего блока CMA.

<!-- Source CN PDF p.7, unit 38 -->

`maxchunk`: максимальное число непрерывных свободных страниц текущего блока CMA.

<!-- Source CN PDF p.7, unit 39 -->

## 5. Сообщения резервирования при загрузке

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

Успешное выделение первого блока CMA:

<!-- Source CN PDF p.8, unit 43 -->

```text
[ 0.000000] Reserved memory: created CMA memory pool at 0x88000000, size 24 MiB
[ 0.000000] OF: reserved mem: initialized node region@88000000, compatible id shared-dma-pool
```

<!-- Source CN PDF p.8, unit 44 -->

Успешное выделение второго блока CMA (системного по умолчанию):

<!-- Source CN PDF p.8, unit 45 -->

```text
[ 0.000000] cma: Reserved 16 MiB at 0x9f000000
```

{% endraw %}
