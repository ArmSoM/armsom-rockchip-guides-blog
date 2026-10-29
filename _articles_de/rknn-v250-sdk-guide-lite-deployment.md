---
title: "RKNN2 SDK V2.5.0 · Python-Bereitstellung mit Toolkit Lite2"
description: "RKNN2 SDK V2.5.0 · Python-Bereitstellung mit Toolkit Lite2 · Vollständige Entwicklerhandbuchreihe"
excerpt: "Python-Bereitstellung mit Toolkit Lite2"
translation_key: "rknn-v250-sdk-guide-lite-deployment"
slug: "rknn-v250-sdk-guide-lite-deployment"
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

**RKNN2 SDK V2.5.0 · 10/22**

[1. Softwarestack und Grundbegriffe](/de/articles/rknn-v250-sdk-guide-overview/)

[2. Entwicklungsumgebung, Versionen und Board-Anbindung](/de/articles/rknn-v250-sdk-guide-environment/)

[3. Entwicklungsablauf und Schnittstellenwahl](/de/articles/rknn-v250-sdk-guide-workflow/)

[4. Modellkonvertierung und ONNX-Bearbeitung](/de/articles/rknn-v250-sdk-guide-conversion/)

[5. Quantisierung, hybride Quantisierung und QAT](/de/articles/rknn-v250-sdk-guide-quantization/)

[6. Inferenz sowie Genauigkeits-, Leistungs- und Speicherbewertung](/de/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime-Lebenszyklus, Layouts und Speicher](/de/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Zero-Copy-Schnittstellen und Ein-/Ausgabebedingungen](/de/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C-API-Bereitstellung und Codegenerierung](/de/articles/rknn-v250-sdk-guide-c-deployment/)

**Python-Bereitstellung mit Toolkit Lite2**

[11. Matmul-API und Matrixlayouts](/de/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU-Mehrkernkonfiguration und Leistung](/de/articles/rknn-v250-sdk-guide-multicore/)

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

## 3.3 Python-Bereitstellung mit Toolkit Lite

RKNN-Toolkit Lite2 stellt eine Python-Schnittstelle für die Modellinferenz auf der Platine bereit und erleichtert die Entwicklung von KI-Anwendungen mit Python.

Hinweis: Vor der Entwicklung einer KI-Anwendung mit RKNN-Toolkit Lite2 muss das Modell des ursprünglichen Frameworks mit RKNN-Toolkit2 in RKNN konvertiert werden. Einzelheiten stehen in 2.1.

### 3.3.1 Laufzeitumgebung und Installation

RKNN-Toolkit Lite2 läuft auf dem Entwicklungsboard. Unterstützte Hardware, Betriebssysteme, Python-Versionen und Bibliotheken richten sich nach dem jeweiligen Releasepaket. Den genauen Umfang beschreibt der Abschnitt zu Versionen und Plattformen in „04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0“.

Die Installation erfolgt über ein Python-Wheel. Passende Plattform- und Python-Pakete liegen im SDK unter rknn-toolkit-lite2/packages. Wählen Sie das Wheel für die Python-Version des Boards und installieren Sie es mit pip3 install. Beispiel:

```text
pip3 install rknn_toolkit_lite2-x.y.z-cpxx-cpxx-linux_aarch64.whl
```

Stellen Sie vor der Installation sicher, dass Python, pip und die erforderlichen Abhängigkeiten auf dem Board vorhanden sind. Vollständige Schritte stehen im Installations- und Umgebungsabschnitt von „04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0“.

### 3.3.2 Grundlegender Bereitstellungsablauf

Der zentrale Einstiegspunkt der Python-API von RKNN-Toolkit Lite2 ist das Objekt RKNNLite. Der typische Board-Ablauf lautet:

```text
Create RKNNLite object
      ↓
  load_rknn()
      ↓
 init_runtime()
      ↓
Prepare input and complete pre-processing
      ↓
  inference()
      ↓
  Process inference results
      ↓
  release()
```

Wesentliche Schnittstellen:

RKNNLite(): erstellt ein RKNN-Toolkit-Lite2-Objekt.

load_rknn(): lädt das RKNN-Modell.

init_runtime(): initialisiert die Runtime-Umgebung.

inference(): übergibt Eingabedaten und führt die Inferenz aus.

release(): gibt das RKNNLite-Objekt und zugehörige Ressourcen frei.

Vor inference() liest die Anwendung die Daten und verarbeitet sie entsprechend den Modelleingaben vor. Nach der Inferenz erfolgt modellabhängige Nachverarbeitung, etwa Klassifikation oder Detektionsauswertung.

### 3.3.3 Wesentliche Funktionsschnittstellen

Neben dem grundlegenden Ablauf bietet RKNN-Toolkit Lite2 Abfragen zu Runtime-Informationen und unterstützten Plattformen. Häufige Schnittstellen sind:

| Schnittstelle | Funktion |
| --- | --- |
| RKNNLite() | RKNNLite-Objekt mit konfigurierbarer Protokollierung erstellen |
| load_rknn() | RKNN-Modell laden |
| init_runtime() | Für die Inferenz benötigte Runtime initialisieren |
| inference() | Inferenz ausführen und Ergebnisse zurückgeben |
| get_sdk_version() | Versionen von Runtime, Treiber und Modell abfragen |
| list_support_target_platform() | Vom RKNN-Modell unterstützte Zielplattformen abfragen |
| release() | Laufzeitressourcen freigeben |

init_runtime() kann den NPU-Kernmodus für die unterstützte Plattform konfigurieren. inference() nimmt Eingaben als Liste von ndarray-Objekten an und erlaubt die Angabe des Datenlayouts. Parameterwerte, Einschränkungen und Rückgabekonventionen stehen in „04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0“.

### 3.3.4 Referenzbeispiel

Das folgende grundlegende Beispiel zeigt Erstellung von RKNNLite, Modellladen, Runtime-Initialisierung, Inferenz und Ressourcenfreigabe. input_data bezeichnet bereits gemäß den Modellanforderungen vorverarbeitete Daten.

```text
rknn_lite = RKNNLite(verbose=True)

# 1. Load RKNN model
ret = rknn_lite.load_rknn('./model.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

# 2. Initialize Runtime
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_AUTO)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)

# 3. Run inference
outputs = rknn_lite.inference(inputs=[input_data])

# 4. Post-process outputs according to the model type
# ...

# 5. Release resources
rknn_lite.release()
```

Das SDK-Verzeichnis examples/inference_with_lite enthält ein vollständiges ResNet18-Bildklassifikationsbeispiel. Kopieren Sie Beispiel, RKNN-Modell und Testdaten auf ein Board mit RKNN-Toolkit Lite2, wechseln Sie in das Beispielverzeichnis und führen Sie aus:

```text
cd examples/inference_with_lite
python3 test.py
```

Das Beispiel umfasst Vorverarbeitung, Inferenz und Top-5-Klassifikationsauswertung und dient als Referenz für Anwendungen. Parameter, Rückgaben und Einschränkungen von RKNNLite, load_rknn(), init_runtime(), inference() und release() beschreibt „04_RKNN2_Toolkit_Lite_Python_API_Reference_V2.5.0“.

{% endraw %}
