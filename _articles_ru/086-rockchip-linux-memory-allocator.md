---
title: "Распределители памяти Rockchip Linux: DMA-HEAP, DRM-GEM, VB2 и отладка RV1106"
description: "Полная справка V1.0.0 по API распределителей, согласованности кэша и выводу rk-dma-heap-info для платформ RK3588/RV1106 Linux 5.10 из исходника."
translation_key: "086-rockchip-linux-memory-allocator"
slug: "086-rockchip-linux-memory-allocator"
lang: "ru"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Rockchip", "Linux", "DMA-HEAP", "DMABUF", "RV1106", "RK3588"]
keywords: "ArmSoM Rockchip Linux memory allocator DMA-HEAP DRM-GEM VB2 RV1106"
excerpt: "Полная справка V1.0.0 по API распределителей, согласованности кэша и выводу rk-dma-heap-info для платформ RK3588/RV1106 Linux 5.10 из исходника."
---

{% raw %}

# Распределители памяти Rockchip Linux: DMA-HEAP, DRM-GEM, VB2 и отладка RV1106

## Применимость к ArmSoM и источник

В таблице исходника указаны только RK3588 и RV1106 / Linux 5.10. RK-DMA-HEAP из главы 4 предназначен для RV1106 и не становится доступным на RK3588 лишь из-за одинаковой версии Linux. Это справка по платформе Rockchip, а не заявление о поддержке всех плат ArmSoM. Проверьте SoC конкретной платы, SDK/BSP, драйверы ядра, конфигурацию heap, узлы устройств и возможности DMA/IOMMU периферии. Аппаратная проверка не проводилась. Предоставлен только китайский V1.0.0 (RK-KF-YF-469, 10 страниц); английская, русская и немецкая версии полностью переводят его. Технических рисунков нет; английские оригиналы не выдуманы. Полные журналы, повторные строки устройств и исходные адреса сохранены; это не измерения ArmSoM.

[Редакционные примечания](/docs/rockchip-linux-memory-allocator/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

## Технический обзор и версии платформы

Руководство описывает распределители памяти платформы Rockchip Linux 5.10. В Linux 5.10 добавлен DMA-HEAP в `drivers/dma-buf/heaps/` для выделения памяти DMABUF; ioctl возвращает пользовательскому пространству файловый дескриптор (fd) dmabuf.

| Чип | Версия ядра |
| --- | --- |
| RK3588, RV1106 | Linux-5.10 |

## 1. Первый распределитель: DMA-HEAP

Драйверы распределителей находятся в `drivers/dma-buf/heaps/`.

```text
drivers/dma-buf/heaps/
├── cma_heap.c 物理地址连续内存分配器驱动
├── deferred-free-helper.c 内存延迟释放驱动
├── deferred-free-helper.h
├── Kconfig
├── Makefile
├── page_pool.c 内存⻚缓存驱动
├── page_pool.h
└── system_heap.c 物理地址不连续虚拟地址连续内存分配器驱动
```

Пояснения к файлам из источника: `cma_heap.c` выделяет физически непрерывную память; `deferred-free-helper.c` выполняет отложенное освобождение; `page_pool.c` обеспечивает кэш страниц; `system_heap.c` выделяет физически разрозненную, но виртуально непрерывную память.

Один heap-драйвер представляет распределитель одного типа памяти и может собираться модулем. Linux предоставляет два типовых драйвера: system-heap и cma-heap.

### 1.1 system-heap

system-heap по умолчанию поддерживает кэш CPU: доступ процессора к выделенной памяти кэшируется и выполняется быстро, но согласованность данных между устройством и CPU должна поддерживаться программно. Производный system-uncached-heap не использует кэш CPU.

system-heap по умолчанию поддерживает defer-free — отложенное освобождение памяти. Пока кэш страниц непуст, выделение выполняется быстро. Для своевременного возврата страниц используется mm shrinker.

system-heap через `add_dma_heap()` добавляет распределитель в dma-heap, получает уникальный индекс и создаёт устройства в `/dev/dma_heap/`, например `/dev/dma_heap/system-heap` и `/dev/dma_heap/system-uncached-heap`.

### 1.2 cma-heap

cma-heap по умолчанию поддерживает кэш CPU, обеспечивая быстрый кэшируемый доступ. Согласованность между устройством и CPU должна поддерживаться программно.

cma-heap выделяет страницы через `cma_alloc`; область определяется драйвером CMA, см. [руководство Linux CMA](/ru/articles/083-rockchip-linux-cma/). Память физически непрерывна и пригодна для прямого доступа периферии без IOMMU.

## 2. Второй распределитель: DRM-GEM

Драйвер распределителя находится в `drivers/gpu/drm/rockchip/`.

## 3. Третий распределитель: VB2-MEMOPS

Драйвер распределителя находится в `drivers/media/common/videobuf2/`.

## 4. Распределитель для RV1106: RK-DMA-HEAP

RK-DMA-HEAP — распределитель DMABUF для RV1106, основанный на DMA-HEAP. Основные отличия приведены ниже.

| Операция Linux | Linux API | Возвращаемое значение |
| --- | --- | --- |
| Выделение DMABUF | `rk_dma_heap_buffer_alloc` | `struct dma_buf *` |
| Выделение массива PAGE | `rk_dma_heap_alloc_contig_pages` | `struct page *` |
| Поддерживается debug list | | |

> DMA-HEAP выделяет DMABUF; RK-DMA-HEAP поддерживает также выделение обычных массивов страниц.

### 4.1 rk-dma-heap-info

Узел отладки RK-DMA-HEAP: `/proc/rk_dma_heap/rk-dma-heap-info`. Ниже полностью сохранён пример вывода исходного документа, а не результат испытаний ArmSoM.

```text
# cat /proc/rk_dma_heap/rk-dma-heap-info
dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5656
      Alloc by (vmpi ) [0x03e1b000-0x03e33fff] 0x00019000 (100 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5655
      Alloc by (vmpi ) [0x03e02000-0x03e1afff] 0x00019000 (100 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5654
      Alloc by (vmpi ) [0x03d96000-0x03e01fff] 0x0006c000 (432 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5653
      Alloc by (vmpi ) [0x03d86000-0x03d95fff] 0x00010000 (64 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5652
      Alloc by (vmpi ) [0x03d76000-0x03d85fff] 0x00010000 (64 KiB)
            Attached Devices:
            ffa50000.rkvenc
            ffa50000.rkvenc
Total 2 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5637
      Alloc by (vmpi ) [0x03c76000-0x03d75fff] 0x00100000 (1024 KiB)
            Attached Devices:
            ffa50000.rkvenc
            ffa50000.rkvenc
Total 2 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5636
      Alloc by (vmpi ) [0x03c74000-0x03c75fff] 0x00002000 (8 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5635
      Alloc by (vmpi ) [0x03c72000-0x03c73fff] 0x00002000 (8 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5626
      Alloc by (vmpi ) [0x03c40000-0x03c71fff] 0x00032000 (200 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5625
      Alloc by (vmpi ) [0x03c3f000-0x03c3ffff] 0x00001000 (4 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5624
      Alloc by (vmpi ) [0x03c37000-0x03c3efff] 0x00008000 (32 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached
dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5623
      Alloc by (vmpi ) [0x03c36000-0x03c36fff] 0x00001000 (4 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5622
      Alloc by (vmpi ) [0x03c2e000-0x03c35fff] 0x00008000 (32 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5621
      Alloc by (vmpi ) [0x03b64000-0x03c2dfff] 0x000ca000 (808 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5610
      Alloc by (vmpi ) [0x03acf000-0x03b63fff] 0x00095000 (596 KiB)
            Attached Devices:
            ffa00000.rkisp
            ffa50000.rkvenc
            ffa00000.rkisp
            ffa00000.rkisp
            ffa00000.rkisp
Total 5 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5609
      Alloc by (vmpi ) [0x03ac0000-0x03acefff] 0x0000f000 (60 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5608
      Alloc by (vmpi ) [0x03ab1000-0x03abffff] 0x0000f000 (60 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5607
      Alloc by (vmpi ) [0x038ef000-0x03ab0fff] 0x001c2000 (1800 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5606
      Alloc by (vmpi ) [0x038ed000-0x038eefff] 0x00002000 (8 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5605
      Alloc by (vmpi ) [0x038b3000-0x038ecfff] 0x0003a000 (232 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5604
      Alloc by (vmpi ) [0x038b1000-0x038b2fff] 0x00002000 (8 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5603
      Alloc by (vmpi ) [0x03877000-0x038b0fff] 0x0003a000 (232 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5602
      Alloc by (vmpi ) [0x0324e000-0x03876fff] 0x00629000 (6308 KiB)
            Attached Devices:
            ffa50000.rkvenc
Total 1 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5586
      Alloc by (ff660000.npu ) [0x0308c000-0x030f7fff] 0x0006c000 (432 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5585
      Alloc by (ff660000.npu ) [0x03087000-0x0308bfff] 0x00005000 (20 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5584
      Alloc by (ff660000.npu ) [0x03082000-0x03086fff] 0x00005000 (20 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5583
      Alloc by (ff660000.npu ) [0x0307d000-0x03081fff] 0x00005000 (20 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5582
      Alloc by (ff660000.npu ) [0x0306b000-0x0307cfff] 0x00012000 (72 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5581
      Alloc by (ff660000.npu ) [0x03059000-0x0306afff] 0x00012000 (72 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5580
      Alloc by (ff660000.npu ) [0x03047000-0x03058fff] 0x00012000 (72 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5579
      Alloc by (ff660000.npu ) [0x02e5f000-0x03046fff] 0x001e8000 (1952 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -dmabuf i_ino = 5328
      Alloc by (vmpi ) [0x02800000-0x02802fff] 0x00003000 (12 KiB)
            Attached Devices:
Total 0 devices attached

dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02803000-0x02813fff] 0x00011000 (68 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02814000-0x02824fff] 0x00011000 (68 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02825000-0x02825fff] 0x00001000 (4 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02826000-0x02826fff] 0x00001000 (4 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02827000-0x02dddfff] 0x005b7000 (5852 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x02dde000-0x02e4efff] 0x00071000 (452 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (rkisp-vir0 ) [0x02e4f000-0x02e52fff] 0x00004000 (16 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (rkisp-vir0 ) [0x02e53000-0x02e56fff] 0x00004000 (16 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (rkisp-vir0 ) [0x02e57000-0x02e5afff] 0x00004000 (16 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (rkisp-vir0 ) [0x02e5b000-0x02e5efff] 0x00004000 (16 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x030f8000-0x03249fff] 0x00152000 (1352 KiB)
dma-heap:<rk-dma-heap-cma> -non dmabuf
      Alloc by (ffa00000.rkisp ) [0x0324a000-0x0324dfff] 0x00004000 (16 KiB)

Total : 0x1634000 (22736 KiB)
```

Сведения о выделении можно отфильтровать по `Alloc`:

```text
# cat /proc/rk_dma_heap/rk-dma-heap-info |grep Alloc
            Alloc by (vmpi ) [0x03e1b000-0x03e33fff] 0x00019000 (100 KiB)
            Alloc by (vmpi ) [0x03e02000-0x03e1afff] 0x00019000 (100 KiB)
            Alloc by (vmpi ) [0x03d96000-0x03e01fff] 0x0006c000 (432 KiB)
            Alloc by (vmpi ) [0x03d86000-0x03d95fff] 0x00010000 (64 KiB)
            Alloc by (vmpi ) [0x03d76000-0x03d85fff] 0x00010000 (64 KiB)
            Alloc by (vmpi ) [0x03c76000-0x03d75fff] 0x00100000 (1024 KiB)
            Alloc by (vmpi ) [0x03c74000-0x03c75fff] 0x00002000 (8 KiB)
            Alloc by (vmpi ) [0x03c72000-0x03c73fff] 0x00002000 (8 KiB)
            Alloc by (vmpi ) [0x03c40000-0x03c71fff] 0x00032000 (200 KiB)
            Alloc by (vmpi ) [0x03c3f000-0x03c3ffff] 0x00001000 (4 KiB)
            Alloc by (vmpi ) [0x03c37000-0x03c3efff] 0x00008000 (32 KiB)
            Alloc by (vmpi ) [0x03c36000-0x03c36fff] 0x00001000 (4 KiB)
            Alloc by (vmpi ) [0x03c2e000-0x03c35fff] 0x00008000 (32 KiB)
            Alloc by (vmpi ) [0x03b64000-0x03c2dfff] 0x000ca000 (808 KiB)
            Alloc by (vmpi ) [0x03acf000-0x03b63fff] 0x00095000 (596 KiB)
            Alloc by (vmpi ) [0x03ac0000-0x03acefff] 0x0000f000 (60 KiB)
            Alloc by (vmpi ) [0x03ab1000-0x03abffff] 0x0000f000 (60 KiB)
            Alloc by (vmpi ) [0x038ef000-0x03ab0fff] 0x001c2000 (1800 KiB)
            Alloc by (vmpi ) [0x038ed000-0x038eefff] 0x00002000 (8 KiB)
            Alloc by (vmpi ) [0x038b3000-0x038ecfff] 0x0003a000 (232 KiB)
            Alloc by (vmpi ) [0x038b1000-0x038b2fff] 0x00002000 (8 KiB)
            Alloc by (vmpi ) [0x03877000-0x038b0fff] 0x0003a000 (232 KiB)
            Alloc by (vmpi ) [0x0324e000-0x03876fff] 0x00629000 (6308 KiB)
            Alloc by (ff660000.npu ) [0x0308c000-0x030f7fff] 0x0006c000 (432 KiB)
            Alloc by (ff660000.npu ) [0x03087000-0x0308bfff] 0x00005000 (20 KiB)
            Alloc by (ff660000.npu ) [0x03082000-0x03086fff] 0x00005000 (20 KiB)
            Alloc by (ff660000.npu ) [0x0307d000-0x03081fff] 0x00005000 (20 KiB)
            Alloc by (ff660000.npu ) [0x0306b000-0x0307cfff] 0x00012000 (72 KiB)
            Alloc by (ff660000.npu ) [0x03059000-0x0306afff] 0x00012000 (72 KiB)
            Alloc by (ff660000.npu ) [0x03047000-0x03058fff] 0x00012000 (72 KiB)
            Alloc by (ff660000.npu ) [0x02e5f000-0x03046fff] 0x001e8000 (1952 KiB)
            Alloc by (vmpi ) [0x02800000-0x02802fff] 0x00003000 (12 KiB)
            Alloc by (ffa00000.rkisp ) [0x02803000-0x02813fff] 0x00011000 (68 KiB)
            Alloc by (ffa00000.rkisp ) [0x02814000-0x02824fff] 0x00011000 (68 KiB)
            Alloc by (ffa00000.rkisp ) [0x02825000-0x02825fff] 0x00001000 (4 KiB)
            Alloc by (ffa00000.rkisp ) [0x02826000-0x02826fff] 0x00001000 (4 KiB)
            Alloc by (ffa00000.rkisp ) [0x02827000-0x02dddfff] 0x005b7000 (5852 KiB)
            Alloc by (ffa00000.rkisp ) [0x02dde000-0x02e4efff] 0x00071000 (452 KiB)
            Alloc by (rkisp-vir0 ) [0x02e4f000-0x02e52fff] 0x00004000 (16 KiB)
            Alloc by (rkisp-vir0 ) [0x02e53000-0x02e56fff] 0x00004000 (16 KiB)
            Alloc by (rkisp-vir0 ) [0x02e57000-0x02e5afff] 0x00004000 (16 KiB)
            Alloc by (rkisp-vir0 ) [0x02e5b000-0x02e5efff] 0x00004000 (16 KiB)
            Alloc by (ffa00000.rkisp ) [0x030f8000-0x03249fff] 0x00152000 (1352 KiB)
            Alloc by (ffa00000.rkisp ) [0x0324a000-0x0324dfff] 0x00004000 (16 KiB)
```

Формат: `Alloc by ([dmabuf name]) [0xaaaaaaaa-0xbbbbbbbb] 0xzzzzzzzz (dd KiB)`

1. `[dmabuf name]`: по умолчанию имя потока драйвера, выделяющего память; модуль может заменить его своей строкой. Например, vmpi — поток rockit, вызывающий rk-dma-heap.
2. `[0xaaaaaaaa-0xbbbbbbbb]`: начальный и конечный физические адреса области.
3. `0xzzzzzzzz`: размер области в шестнадцатеричном виде.
4. `dd KiB`: десятичный размер, переведённый в KiB.

{% endraw %}
