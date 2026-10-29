---
title: "RKNN2 SDK V2.5.0 · Inferenz mit mehreren Batches"
description: "RKNN2 SDK V2.5.0 · Inferenz mit mehreren Batches · Vollständige Entwicklerhandbuchreihe"
excerpt: "Inferenz mit mehreren Batches"
translation_key: "rknn-v250-sdk-guide-multi-batch"
slug: "rknn-v250-sdk-guide-multi-batch"
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

**RKNN2 SDK V2.5.0 · 14/22**

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

**Inferenz mit mehreren Batches**

[15. NPU-SRAM auf RK3588/RK3576](/de/articles/rknn-v250-sdk-guide-sram/)

[16. Cache-Kohärenz und Sparse-Inferenz](/de/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Benutzerdefinierte Operatoren: Python und C API](/de/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Bereitstellung verschlüsselter Modelle](/de/articles/rknn-v250-sdk-guide-encryption/)

[19. Diagnose von Genauigkeitsproblemen](/de/articles/rknn-v250-sdk-guide-accuracy/)

[20. Leistungsanalyse und Netzwerkoptimierung](/de/articles/rknn-v250-sdk-guide-performance/)

[21. Speicheranalyse, gemeinsame Nutzung und Wiederverwendung](/de/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, Fehlerbehandlung und Referenzen](/de/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.1.4 Multi-Batch verwenden

#### 4.1.4.1 Multi-Batch-Prinzip

RK3588 besitzt 3 NPU-Kerne, RK3576 2. Multi-Batch-Inferenz nutzt diese effizienter. Dabei kopiert rknn_dup_context nur Internal des Kontexts; Weight wird wiederverwendet. Bei rknn_batch_size=2 entsteht eine Kopie, bei rknn_batch_size&gt;=3 zwei, da höchstens drei Kerne gleichzeitig arbeiten und zusätzliche Kopien Speicher verschwenden. core_mask jedes Kontexts wird für automatische Planung zwischen den Kernen auf 0 gesetzt. rknn_run() erstellt intern einen Threadpool; drei Threads führen gleichzeitig die drei Kontexte aus.

![Abbildung 4-7. Internes Multi-Batch-Prinzip ](/assets/images/rknn-v250/sdk-guide/en/p121-figure-01.png)

Abbildung 4-7. Internes Multi-Batch-Prinzip

#### 4.1.4.2 Multi-Batch verwenden

Verwendung von Multi-Batch:

1 Multi-Batch in Python aktivieren:

```text
ret = rknn.build(do_quantization=True, dataset='./dataset.txt', rknn_batch_size=3)
```

Für optimale Leistung sollte rknn_batch_size auf RK3588 ein Vielfaches von 3 und auf RK3576 ein Vielfaches von 2 sein.

2 Die Zero-Copy-Schnittstelle wird empfohlen.

#### 4.1.4.3 Multi-Batch-Ein- und Ausgaben

Mit Multi-Batch sind abgefragte Ein-/Ausgabegrößen rknn_batch_size-mal so groß. Jeder interne Kontext berechnet seinen Eingabeoffset, liest die Daten und schreibt das Ergebnis an seinen berechneten Ausgabeoffset. Für den zweiten Batch ist der Eingabeoffset input_size/rknn_batch_size und der Ausgabeoffset output_size/rknn_batch_size.

![Abbildung 4-8. Interne Multi-Batch-Ein-/Ausgabeoffsets ](/assets/images/rknn-v250/sdk-guide/en/p122-figure-01.png)

Abbildung 4-8. Interne Multi-Batch-Ein-/Ausgabeoffsets

{% endraw %}
