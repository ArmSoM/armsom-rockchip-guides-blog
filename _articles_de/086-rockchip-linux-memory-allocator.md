---
title: "Rockchip-Linux-Speicherallokatoren: DMA-HEAP, DRM-GEM, VB2 und RV1106-Debugging"
description: "Vollständige V1.0.0-Referenz zu Allokator-APIs, Cache-Kohärenz und rk-dma-heap-info-Ausgaben für die Quellplattformen RK3588/RV1106 mit Linux 5.10."
translation_key: "086-rockchip-linux-memory-allocator"
slug: "086-rockchip-linux-memory-allocator"
lang: "de"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Rockchip", "Linux", "DMA-HEAP", "DMABUF", "RV1106", "RK3588"]
keywords: "ArmSoM Rockchip Linux memory allocator DMA-HEAP DRM-GEM VB2 RV1106"
excerpt: "Vollständige V1.0.0-Referenz zu Allokator-APIs, Cache-Kohärenz und rk-dma-heap-info-Ausgaben für die Quellplattformen RK3588/RV1106 mit Linux 5.10."
---

{% raw %}

# Rockchip-Linux-Speicherallokatoren: DMA-HEAP, DRM-GEM, VB2 und RV1106-Debugging

## Anwendbarkeit auf ArmSoM und Quelle

Die Produkttabelle nennt ausschließlich RK3588 und RV1106 / Linux 5.10. RK-DMA-HEAP in Kapitel 4 ist RV1106-spezifisch und nicht allein wegen derselben Linux-Version auf RK3588 verfügbar. Dies ist eine Rockchip-Plattformreferenz, keine Zusage für alle ArmSoM-Platinen. Konkreten Board-SoC, SDK/BSP, Kerneltreiber, Heap-Konfiguration, Geräteknoten und DMA-/IOMMU-Fähigkeiten der Peripherie prüfen. Es wurde keine Hardwarevalidierung durchgeführt. Vorhanden ist nur die chinesische V1.0.0-Quelle (RK-KF-YF-469, 10 Seiten); Englisch, Russisch und Deutsch übersetzen sie vollständig. Die Quelle enthält keine technischen Abbildungen; englische Originale werden nicht erfunden. Vollständige Logs, doppelte Gerätezeilen und Quelladressen bleiben erhalten; es sind keine ArmSoM-Messungen.

[Redaktionelle Hinweise](/docs/rockchip-linux-memory-allocator/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

## Technischer Überblick und Produktversionen

Diese Anleitung beschreibt Speicherallokatoren der Rockchip-Linux-5.10-Plattform. Linux 5.10 ergänzt DMA-HEAP unter `drivers/dma-buf/heaps/` zur Allokation von DMABUF-Speicher; ein ioctl liefert dessen Dateideskriptor (fd) an den Benutzerraum.

| Chip | Kernelversion |
| --- | --- |
| RK3588, RV1106 | Linux-5.10 |

## 1. Erster Allokator: DMA-HEAP

Die Allokatortreiber liegen unter `drivers/dma-buf/heaps/`.

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

Dateierläuterungen der Quelle: `cma_heap.c` allokiert physisch zusammenhängenden Speicher; `deferred-free-helper.c` übernimmt die verzögerte Freigabe; `page_pool.c` stellt den Seitencache bereit; `system_heap.c` allokiert physisch nicht zusammenhängenden, aber virtuell zusammenhängenden Speicher.

Ein Heap-Treiber steht für einen Allokator eines Speichertyps und unterstützt den Bau als Modul. Linux stellt zwei typische Treiber bereit: system-heap und cma-heap.

### 1.1 system-heap

system-heap unterstützt standardmäßig CPU-Caching. CPU-Zugriffe sind dadurch schnell; die Datenkohärenz zwischen Gerät und CPU muss jedoch softwareseitig gewährleistet werden. Daraus abgeleitet ist system-uncached-heap ohne CPU-Caching.

system-heap unterstützt standardmäßig defer-free, also verzögerte Speicherfreigabe. Bei nicht leerem Seitencache ist die Allokation schnell; mm shrinker gibt diesen Cache bedarfsgerecht frei.

system-heap fügt mit `add_dma_heap()` einen Allokator zu dma-heap hinzu, erhält einen eindeutigen Index und erzeugt Geräte unter `/dev/dma_heap/`, beispielsweise `/dev/dma_heap/system-heap` und `/dev/dma_heap/system-uncached-heap`.

### 1.2 cma-heap

cma-heap unterstützt standardmäßig CPU-Caching für schnelle Zugriffe. Die Kohärenz zwischen Gerät und CPU muss softwareseitig gewährleistet werden.

cma-heap allokiert Seiten mit `cma_alloc`. Den CMA-Bereich bestimmt der CMA-Treiber; siehe [Linux-CMA-Referenz](/de/articles/083-rockchip-linux-cma/). Der Speicher ist physisch zusammenhängend und für direkten Zugriff durch Peripherie ohne IOMMU geeignet.

## 2. Zweiter Allokator: DRM-GEM

Der Allokatortreiber liegt unter `drivers/gpu/drm/rockchip/`.

## 3. Dritter Allokator: VB2-MEMOPS

Der Allokatortreiber liegt unter `drivers/media/common/videobuf2/`.

## 4. RV1106-spezifischer Allokator: RK-DMA-HEAP

RK-DMA-HEAP ist ein auf DMA-HEAP basierender DMABUF-Allokator speziell für RV1106. Die wesentlichen Unterschiede folgen.

| Linux-Funktion | Linux API | Rückgabewert |
| --- | --- | --- |
| DMABUF allokieren | `rk_dma_heap_buffer_alloc` | `struct dma_buf *` |
| PAGE-Array allokieren | `rk_dma_heap_alloc_contig_pages` | `struct page *` |
| Unterstützt debug list | | |

> DMA-HEAP allokiert DMABUF-Objekte; RK-DMA-HEAP unterstützt zusätzlich gewöhnliche Seitenarrays.

### 4.1 rk-dma-heap-info

Der RK-DMA-HEAP-Debugknoten ist `/proc/rk_dma_heap/rk-dma-heap-info`. Es folgt die vollständige Beispielausgabe der Quelle, kein ArmSoM-Testergebnis.

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

Allokationsinformationen lassen sich gewöhnlich nach `Alloc` filtern:

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

Format: `Alloc by ([dmabuf name]) [0xaaaaaaaa-0xbbbbbbbb] 0xzzzzzzzz (dd KiB)`

1. `[dmabuf name]`: standardmäßig Name des allokierenden Treiberthreads; eine modulspezifische Zeichenkette kann ihn überschreiben. Beispielsweise ist vmpi der rockit-Thread, der rk-dma-heap aufruft.
2. `[0xaaaaaaaa-0xbbbbbbbb]`: physische Anfangs- und Endadresse des Bereichs.
3. `0xzzzzzzzz`: hexadezimale Bereichsgröße.
4. `dd KiB`: dezimale, nach KiB umgerechnete Größe.

{% endraw %}
