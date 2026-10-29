---
title: "RKNN2 SDK V2.5.0 · NPU-Mehrkernkonfiguration und Leistung"
description: "RKNN2 SDK V2.5.0 · NPU-Mehrkernkonfiguration und Leistung · Vollständige Entwicklerhandbuchreihe"
excerpt: "NPU-Mehrkernkonfiguration und Leistung"
translation_key: "rknn-v250-sdk-guide-multicore"
slug: "rknn-v250-sdk-guide-multicore"
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

**RKNN2 SDK V2.5.0 · 12/22**

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

**NPU-Mehrkernkonfiguration und Leistung**

[13. Modelle mit dynamischen Formen und Bereitstellung](/de/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Inferenz mit mehreren Batches](/de/articles/rknn-v250-sdk-guide-multi-batch/)

[15. NPU-SRAM auf RK3588/RK3576](/de/articles/rknn-v250-sdk-guide-sram/)

[16. Cache-Kohärenz und Sparse-Inferenz](/de/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Benutzerdefinierte Operatoren: Python und C API](/de/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Bereitstellung verschlüsselter Modelle](/de/articles/rknn-v250-sdk-guide-encryption/)

[19. Diagnose von Genauigkeitsproblemen](/de/articles/rknn-v250-sdk-guide-accuracy/)

[20. Leistungsanalyse und Netzwerkoptimierung](/de/articles/rknn-v250-sdk-guide-performance/)

[21. Speicheranalyse, gemeinsame Nutzung und Wiederverwendung](/de/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, Fehlerbehandlung und Referenzen](/de/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.1.2 Mehrkern-NPU konfigurieren

RK3588 bietet mit einer 3-Kern-NPU, RK3576 mit einer 2-Kern-NPU höhere Rechenleistung. Dieser Abschnitt erläutert die Mehrkernkonfiguration zur effizienteren Modellinferenz.

Hinweis: Mehrkernbetrieb eignet sich für Netze mit hoher Rechenlast je Schicht. Kleine Netze profitieren wenig; der Wechsel zwischen Ein- und Mehrkernbetrieb benötigt CPU-Eingriffe und kann die Leistung sogar verringern.

#### 4.1.2.1 Mehrkernbetrieb konfigurieren

In Python wird der NPU-Kern über core_mask in init_runtime() von RKNN-Toolkit2 oder RKNN-Toolkit Lite2 gesetzt. Parameterbeschreibung:

Tabelle 4-6. Parameter core_mask von init_runtime

| Parameter | Beschreibung |
| --- | --- |
| core_mask | Legt den NPU-Kern des Modells fest: NPU_CORE_AUTO: automatische Planung auf einem freien NPU-Kern im Einkernmodus. NPU_CORE_0: NPU Core0. NPU_CORE_1: NPU Core1. NPU_CORE_2: NPU Core2. NPU_CORE_0_1: NPU Core0 und Core1 gleichzeitig. NPU_CORE_0_1_2: NPU Core0, Core1 und Core2 gleichzeitig. NPU_CORE_ALL: Kernanzahl automatisch je Plattform. Standard NPU_CORE_AUTO. In RKNN-Toolkit Lite2 RKNNLite voranstellen, etwa RKNNLite.NPU_CORE_AUTO; in RKNN-Toolkit2 RKNN, etwa RKNN.NPU_CORE_AUTO. |

Beispiel zur Kernwahl mit RKNN-Toolkit2:

```text
## Python
......
# Init runtime environment
print('--> Init runtime environment')
ret = rknn.init_runtime(target='rk3588', core_mask=RKNN.NPU_CORE_0)
if ret != 0:
    print('Init runtime environment failed!')
    exit(ret)
```

Beispiel zur Kernwahl mit RKNN-Toolkit Lite2:

```text
## Python
......
# Init runtime environment
print('--> Init runtime environment')
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_0)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
print('done')
```

In C/C++ legt rknn_set_core_mask() den Kern für das Modell fest. Beschreibung von core_mask:

Tabelle 4-7. Parameter core_mask von rknn_set_core_mask

| Parameter | Beschreibung |
| --- | --- |
| core_mask | Legt den NPU-Kern des Modells fest: RKNN_NPU_CORE_AUTO: automatische Planung auf einem freien NPU-Kern im Einkernmodus. RKNN_NPU_CORE_0: NPU Core0. RKNN_NPU_CORE_1: NPU Core1. RKNN_NPU_CORE_2: NPU Core2. RKNN_NPU_CORE_0_1: NPU Core0 und Core1 gleichzeitig. RKNN_NPU_CORE_0_1_2: NPU Core0, Core1 und Core2 gleichzeitig. RKNN_NPU_CORE_ALL: Kernanzahl automatisch je Plattform. |

Beispiel zur Kernwahl über die C/C++-API:

```text
// C++
// rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

#### 4.1.2.2 Mehrkern-Ausführungsstatus prüfen

Dieser Abschnitt erläutert die Wirkung des Mehrkernbetriebs eines RKNN-Modells.

Bei RKNN-Toolkit2-Inferenz mit angeschlossenem Board perf_debug=True in rknn.init_runtime() setzen und anschließend rknn.eval_perf() aufrufen, um Laufzeitinformationen jeder Schicht auszugeben. Beispiel:

```text
#Python
# Init runtime environment
ret = rknn.init_runtime(target='rk3588', device_id='29d5dd97766a5c27',
perf_debug=True)
if ret != 0:
    print('Init runtime environment failed!')
    exit(ret)

# Eval performance
rknn.eval_perf()
```

Bei direkter Board-Inferenz vor dem Anwendungsstart RKNN_LOG_LEVEL auf mindestens 4 setzen, um Informationen jeder Schicht auszugeben. Einstellung:

```text
# Python
# When using the Python interface provided by RKNN-Toolkit Lite2, simply set verbose to True when creating the RKNNLite object
rknnlite = RKNNLite(verbose=True)

# When using the C/C++ interface, the following environment variable must be set before running the binary program
export RKNN_LOG_LEVEL=4
```

Für lenet erscheint danach beispielsweise folgendes Protokoll. Zur besseren Darstellung wurden InputShape, OutputShape, DDR Cycles, NPU Cycles, Total Cycles, Time(us), MacUsage(%), Task Number, Lut Number, RW(kb) und FullName entfernt.

```text
ID OpType DataType Target WorkLoad(0/1/2)-ImproveTherical
1 InputOperator UINT8 CPU 100.0%/0.0%/0.0% - Up:0.0%
2 Conv UINT8 NPU 50.0%/50.0%/0.0% - Up:50.0%
3 MaxPool INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
4 Conv INT8 NPU 50.0%/50.0%/0.0% - Up:50.0%
5 MaxPool INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
6 ConvRelu INT8 NPU 48.1%/51.9%/0.0% - Up:48.1%
7 Conv INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
8 Softmax INT8 CPU 0.0%/0.0%/0.0% - Up:0.0%
9 OutputOperator FLOAT16 CPU 0.0%/0.0%/0.0% - Up:0.0%
Total Operator Elapsed Time(us): 591
Total Memory RW Amount(MB): 0
```

WorkLoad(0/1/2)-ImproveTherical wird nur bei Mehrkern-NPUs ausgegeben und zeigt Aufgabenverteilung und theoretische Leistungssteigerung je Schicht. "50.0%/50.0%/0.0% - Up:50.0%" bedeutet beispielsweise je 50% auf Core0 und Core1 sowie theoretisch 50% mehr Leistung als mit einem Kern. Fehlt eine Steigerung, etwa bei "100.0%/0.0%/0.0% - Up:0.0%", kommen folgende Ursachen infrage:

Die Schichtlast liegt unter der Granularität der Mehrkernaufteilung und läuft daher auf einem Kern;

Die Mehrkernaufteilung dieses Operators ist im NPU-Treiber noch nicht implementiert und für spätere Versionen vorgesehen. Unterstützt werden derzeit Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu, PRelu und LeakyRelu.

#### 4.1.2.3 Mehrkernleistung verbessern

Zur Leistungsverbesserung können Sie Folgendes versuchen:

CPU-/DDR-/NPU-Frequenzen auf das Maximum setzen.

Die Anwendung an einen großen CPU-Kern binden.

Den NPU-Interrupt an denselben großen CPU-Kern binden.

Befehle zur festen Frequenzeinstellung hängen von der Firmware ab; siehe 5.2.1.1.

Für die letzten beiden Punkte zeigt folgendes Skript die Bindung an CPU4:

```text
interrupts=$(cat /proc/interrupts | grep npu)
interrupts_array=($interrupts)

irq1=$(echo ${interrupts_array[0]} | awk -F ':' '{print $1}')
irq2=$(echo ${interrupts_array[14]} | awk -F ':' '{print $1}')
irq3=$(echo ${interrupts_array[28]} | awk -F ':' '{print $1}')

for irq in $irq1 $irq2 $irq3; do
 echo 4 > /proc/irq/$irq/smp_affinity_list
done

taskset 10 ./rknn_benchmark lenet.rknn "" 10 3 # The taskset mask value corresponding to CPU4 is 0x10
```

Das Skript führt folgende Schritte aus:

Führt `cat /proc/interrupts | grep npu` aus und extrahiert drei Interruptnummern ohne Doppelpunkte.

Setzt in einer Schleife smp_affinity_list jedes Interrupts auf 4, die ID von CPU4.

Führt `taskset 10 ./rknn_benchmark lenet.rknn "" 10 3` aus. Der taskset-Parameter für CPU4 ist 10. Zur Verwendung von taskset siehe https://man7.org/linux/man-pages/man1/taskset.1.html.

Damit laufen NPU-Interrupt und rknn_benchmark auf CPU4; der Kernwechselaufwand bei der NPU-Interruptverarbeitung entfällt.

{% endraw %}
