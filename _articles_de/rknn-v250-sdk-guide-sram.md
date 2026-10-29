---
title: "RKNN2 SDK V2.5.0 · NPU-SRAM auf RK3588/RK3576"
description: "RKNN2 SDK V2.5.0 · NPU-SRAM auf RK3588/RK3576 · Vollständige Entwicklerhandbuchreihe"
excerpt: "NPU-SRAM auf RK3588/RK3576"
translation_key: "rknn-v250-sdk-guide-sram"
slug: "rknn-v250-sdk-guide-sram"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Plattformreferenz nach dem Rockchip RKNN2 SDK Development Guide V2.5.0. Erfasst werden nur die im Original genannten SoCs sowie Linux-/Android-Runtime- und Toolkit-Kombinationen. Funktionen gelten unter den jeweiligen Chip-, SDK-, Treiber- und Kernelbedingungen und nicht automatisch für jedes ArmSoM-Board. Prüfen Sie vor der Bereitstellung BSP, NPU-Treiber, Runtime und Modellversion des konkreten Boards. Es erfolgte keine ArmSoM-Hardwarevalidierung; Protokolle, Leistungswerte und Beispiele stammen aus dem Original.

Quellen und Prüfung: Chinesisch folgt der chinesischen V2.5.0 (182 Seiten); Englisch, Russisch und Deutsch folgen der englischen V2.5.0 (208 Seiten). Quellenspezifische technische Angaben bleiben erhalten; Inhalte älterer Versionen werden nicht als neue Fakten dargestellt. Chinesische Abbildungen stammen aus dem chinesischen PDF, EN/RU/DE-Abbildungen aus dem englischen PDF einschließlich separat extrahierter Vektorflussdiagramme. Abschnitts- und Formelnummern bleiben erhalten. Einige Querverweise verwenden alte Kapitelnummern; Dynamic-Shape-Beispiele enthalten „1224+140=264“, TP_NORM-Aussagen widersprechen sich, und init()/rknn.val_perf() weichen von späteren API-Beschreibungen ab. Diese Quellenprobleme bleiben dokumentiert und sind vor Ausführung anhand der tatsächlichen V2.5.0-Header und API-Referenzen zu prüfen. Code und Parameter bleiben erhalten; PDF-Umbrüche und Tabellenfortsetzungen wurden bereinigt.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 15/22**

[1. Softwarestack und Grundbegriffe](/de/articles/rknn-v250-sdk-guide-overview/)

[2. Entwicklungsumgebung, Versionen und Board-Anbindung](/de/articles/rknn-v250-sdk-guide-environment/)

[3. Entwicklungsablauf und Schnittstellenwahl](/de/articles/rknn-v250-sdk-guide-workflow/)

[4. Modellkonvertierung und ONNX-Bearbeitung](/de/articles/rknn-v250-sdk-guide-conversion/)

[5. Quantisierung, hybride Quantisierung und QAT](/de/articles/rknn-v250-sdk-guide-quantization/)

[6. Inferenz sowie Genauigkeits-, Leistungs- und Speicherbewertung](/de/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime-Lebenszyklus, Layouts und Speicher](/de/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Zero-Copy-Schnittstellen und Ein-/Ausgabebedingungen](/de/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C-API-Bereitstellung und Codegenerierung](/de/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Python-Bereitstellung mit Toolkit Lite2](/de/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul-API und Matrixlayouts](/de/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU-Mehrkernkonfiguration und Leistung](/de/articles/rknn-v250-sdk-guide-multicore/)

[13. Modelle mit dynamischen Formen und Bereitstellung](/de/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Inferenz mit mehreren Batches](/de/articles/rknn-v250-sdk-guide-multi-batch/)

**NPU-SRAM auf RK3588/RK3576**

[16. Cache-Kohärenz und Sparse-Inferenz](/de/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Benutzerdefinierte Operatoren: Python und C API](/de/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Bereitstellung verschlüsselter Modelle](/de/articles/rknn-v250-sdk-guide-encryption/)

[19. Diagnose von Genauigkeitsproblemen](/de/articles/rknn-v250-sdk-guide-accuracy/)

[20. Leistungsanalyse und Netzwerkoptimierung](/de/articles/rknn-v250-sdk-guide-performance/)

[21. Speicheranalyse, gemeinsame Nutzung und Wiederverwendung](/de/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, Fehlerbehandlung und Referenzen](/de/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.1.5 NPU-SRAM von RK3588/RK3576

RK3588 enthält 1MB SRAM; davon können 956KB von den IP-Blöcken des SoC genutzt und gezielt RKNPU zugewiesen werden.

RK3576 enthält 512KB SRAM; davon können 480KB von den IP-Blöcken des SoC genutzt und gezielt RKNPU zugewiesen werden.

SRAM kann den DDR-Bandbreitenbedarf von RKNPU-Anwendungen reduzieren, die Inferenzzeit jedoch beeinflussen.

#### 4.1.5.1 Anforderungen an die RKNPU-Umgebung

##### 4.1.5.1.1 Kernelanforderungen

RKNPU-Treiberversion &gt;=0.8.0

In der Kernelkonfiguration CONFIG_ROCKCHIP_RKNPU_SRAM=y aktivieren.

Konfigurationspfad für Android:

```text
<path-to-your-kernel>/arch/arm64/configs/rockchip_defconfig
```

Konfigurationspfad für Linux:

```text
<path-to-your-kernel>/arch/arm64/configs/rockchip_linux_defconfig
```

Im entsprechenden Kernel-DTS muss Systemspeicher aus der SRAM für RKNPU zugewiesen werden.

Weisen Sie die erforderliche Größe zu: maximal 956KB auf RK3588 und 480KB auf RK3576. Die Größe muss auf 4K ausgerichtet sein.

Hinweis: SRAM kann standardmäßig bereits anderen IP-Blöcken, etwa dem Codec, zugewiesen sein. Die Bereiche verschiedener Blöcke dürfen sich nicht überlappen, sonst führen gleichzeitige Lese- und Schreibzugriffe zu Datenverfälschungen.

Beispiel zur Zuweisung von 956KB auf RK3588 und 480KB auf RK3576 an RKNPU:

RK3588:

```text
syssram: sram@ff001000 {
  compatible = "mmio-sram";
  reg = <0x0 0xff001000 0x0 0xef000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0xff001000 0xef000>;
  /* Allocate RKNPU SRAM /
  / start address and size should be 4k algin */
  rknpu_sram: rknpu_sram@0 {
    reg = <0x0 0xef000>; // 956KB
  };
};
```

Ordnen Sie die allokierte SRAM dem RKNPU-Knoten zu und ändern Sie die dtsi-Datei wie folgt:

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
rknpu: npu@fdab0000 {
  compatible = "rockchip,rk3588-rknpu";
  /* ... /
  / Add reference RKNPU sram */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

RK3576:

```text
sram: sram@3ff88000 {
  compatible = "mmio-sram";
  reg = <0x0 0x3ff88000 0x0 0x78000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0x3ff88000 0x78000>;
  /* Allocate RKNPU SRAM /
  / start address and size should be 4k algin */
  rknpu_sram: rknpu-sram@0 {
      reg = <0x0 0x78000>; // 480KB
  };
};
```

Ordnen Sie die allokierte SRAM dem RKNPU-Knoten zu und ändern Sie die dtsi-Datei wie folgt:

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3576.dtsi
rknpu: npu@27700000 {
  compatible = "rockchip,rk3576-rknpu";
  /* ... /
  / Add reference RKNPU sram */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

##### 4.1.5.1.2 Anforderungen an die RKNN-SDK-Version

Version der RKNPU-Runtime-Bibliothek (librknnrt.so) &gt;=1.6.0

#### 4.1.5.2 Verwendung

Setzen Sie RKNN_FLAG_ENABLE_SRAM im flags-Parameter von rknn_init(), um SRAM für diesen Kontext zu aktivieren.

Beispiel:

```text
ret = rknn_init(&ctx, rknn_model, size, RKNN_FLAG_ENABLE_SRAM, NULL);
```

Bei gesetztem RKNN_FLAG_ENABLE_SRAM wird möglichst viel verfügbare System-SRAM für den Internal-Tensor-Speicher des Modells allokiert.

Hinweis:

Belegt ein rknn-Kontext einen SRAM-Bereich, können andere Kontexte diesen nicht wiederverwenden. RKNN_FLAG_SHARE_SRAM in rknn_api.h ist noch nicht implementiert.

Belegt ein Kontext nicht die gesamte SRAM, kann der Rest von anderen rknn-Kontexten verwendet werden.

#### 4.1.5.3 Debugging

##### 4.1.5.3.1 SRAM-Aktivierung prüfen

Im Kernel-Startprotokoll prüfen, ob SRAM aktiv ist. Es enthält Adressbereich und Größe des RKNPU zugewiesenen SRAM, beispielsweise:

```text
rk3588_s:/ # dmesg | grep rknpu -i
RKNPU fdab0000.npu: RKNPU: sram region: [0x00000000ff001000, 0x00000000ff0f0000), sram size: 0xef000
```

##### 4.1.5.3.2 SRAM-Nutzung abfragen

Die SRAM-Nutzung kann über Knoten abgefragt werden.

Bitmap ungenutzter SRAM; jeder Punkt entspricht 4K:

```text
rk3588_s:/ # cat /sys/kernel/debug/rknpu/mm
SRAM bitmap: "*" - used, "." - free (1bit = 4KB)
[000] [................................]
[001] [................................]
[002] [................................]
[003] [................................]
[004] [................................]
[005] [................................]
[006] [................................]
[007] [...............]
SRAM total size: 978944, used: 0, free: 978944
# Unit is Byte
```

Bitmap nach Verwendung von 512KB SRAM:

```text
rk3588_s:/ # cat /sys/kernel/debug/rknpu/mm
SRAM bitmap: "*" - used, "." - free (1bit = 4KB)
[000] [********************************]
[001] [********************************]
[002] [********************************]
[003] [********************************]
[004] [................................]
[005] [................................]
[006] [................................]
[007] [...............]
SRAM total size: 978944, used: 524288, free: 454656
# Unit is Byte
```

##### 4.1.5.3.3 SRAM-Größe über die RKNN-API abfragen

Fragen Sie die SRAM-Größe über RKNN_QUERY_MEM_SIZE von rknn_query() ab.

```text
typedef struct _rknn_mem_size {
  uint32_t total_weight_size;
  uint32_t total_internal_size;
  uint64_t total_dma_allocated_size;
  uint32_t total_sram_size;
  uint32_t free_sram_size;
  uint32_t reserved[10];
} rknn_mem_size;
```

total_sram_size ist die gesamte vom System für RKNPU zugewiesene SRAM-Größe in Byte.

free_sram_size ist die verbleibende verfügbare SRAM-Größe für RKNPU in Byte.

##### 4.1.5.3.4 SRAM-Belegung des Modells abfragen

Setzen Sie vor dem Start der RKNN-Anwendung auf dem Gerät folgende Umgebungsvariable, um die prognostizierte SRAM-Nutzung auszugeben:

```text
export RKNN_LOG_LEVEL=3
```

Die schichtweise Belegung der für Internal allokierten SRAM zeigt folgendes Protokoll:

```text
---------------------------------------------------------------------------
Total allocated Internal SRAM Size: 524288, Addr: [0xff3e0000, 0xff460000)
---------------------------------------------------------------------------
---------------------------------------------------------------------+---------
-------------------------+-----------
ID User Tensor DataType OrigShape NativeShape |
[Start End) Size | SramHit
---------------------------------------------------------------------+---------
-------------------------+-----------
1 ConvRelu input0 INT8 (1,3,224,224) (1,1,224,224,3) |
0xff3b0000 0xff3d4c00 0x00024c00 | \
2 ConvRelu output2 INT8 (1,32,112,112) (1,2,112,112,16) |
0xff404c00 0xff466c00 0x00062000 | 0x0005b400
3 ConvRelu output4 INT8 (1,32,112,112) (1,4,112,112,16) |
0xff466c00 0xff52ac00 0x000c4000 | 0x00000000
4 ConvRelu output6 INT8 (1,64,112,112) (1,4,112,112,16) |
0xff52ac00*0xff5eec00 0x000c4000 | 0x00000000
5 ConvRelu output8 INT8 (1,64,56,56) (1,4,56,56,16) |
0xff3e0000 0xff411000 0x00031000 | 0x00031000
6 ConvRelu output10 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff411000 0xff473000 0x00062000 | 0x0004f000
7 ConvRelu output12 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff473000 0xff4d5000 0x00062000 | 0x00000000
8 ConvRelu output14 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff3e0000 0xff442000 0x00062000 | 0x00062000
9 ConvRelu output16 INT8 (1,128,28,28) (1,8,28,28,16) |
0xff442000 0xff45a800 0x00018800 | 0x00018800
10 ConvRelu output18 INT8 (1,256,28,28) (1,16,28,28,16) |
0xff3e0000 0xff411000 0x00031000 | 0x00031000
11 ConvRelu output20 INT8 (1,256,28,28) (1,16,28,28,16) |
0xff411000 0xff442000 0x00031000 | 0x00031000
12 ConvRelu output22 INT8 (1,256,28,28) (1,16,28,28,16) |
0xff3e0000 0xff411000 0x00031000 | 0x00031000
13 ConvRelu output24 INT8 (1,256,14,14) (1,16,14,14,16) |
0xff411000 0xff41d400 0x0000c400 | 0x0000c400
14 ConvRelu output26 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
15 ConvRelu output28 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
16 ConvRelu output30 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
17 ConvRelu output32 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
18 ConvRelu output34 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
19 ConvRelu output36 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
20 ConvRelu output38 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
21 ConvRelu output40 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
22 ConvRelu output42 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
23 ConvRelu output44 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
24 ConvRelu output46 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
25 ConvRelu output48 INT8 (1,512,7,7) (1,33,7,7,16) |
0xff3f8800 0xff3ff000 0x00006800 | 0x00006800
26 ConvRelu output50 INT8 (1,1024,7,7) (1,67,7,7,16) |
0xff3e0000 0xff3ed000 0x0000d000 | 0x0000d000
27 ConvRelu output52 INT8 (1,1024,7,7) (1,67,7,7,16) |
0xff3ed000 0xff3fa000 0x0000d000 | 0x0000d000
28 AveragePool output54 INT8 (1,1024,7,7) (1,67,7,7,16) |
0xff3e0000 0xff3ed000 0x0000d000 | 0x0000d000
29 Conv output55 INT8 (1,1024,1,1) (1,64,1,1,16) |
0xff3ed000 0xff3ed400 0x00000400 | 0x00000400
30 Softmax output56 INT8 (1,1000,1,1) (1,64,1,1,16) |
0xff3e0000 0xff3e0400 0x00000400 | 0x00000400
31 OutputOperator output57 FLOAT (1,1000,1,1) (1,1000,1,1) |
0xff3ae000 0xff3aefa0 0x00000fa0 | \
---------------------------------------------------------------------+---------
-------------------------+-----------
----------------------------------------
Total Weight Memory Size: 4260864
Total Internal Memory Size: 2157568
Predict Internal Memory RW Amount: 11068320
Predict Weight Memory RW Amount: 4260832
Predict SRAM Hit RW Amount: 6688768
----------------------------------------
```

SRAM Hit bezeichnet in der Tabelle die SRAM-Größe des Tensors der aktuellen Schicht und damit die gegenüber dem Betrieb ohne SRAM eingesparte DDR-Lese-/Schreibdatenmenge.

Predict SRAM Hit RW Amount ist die prognostizierte SRAM-Lese-/Schreibmenge des gesamten Modells und zeigt die pro Frame gegenüber dem Betrieb ohne SRAM eingesparte DDR-Datenmenge.

Hinweis: Unter Linux werden Protokolle ins Terminal umgeleitet, unter Android nach logcat.

{% endraw %}
