---
layout: "article"
title: "RKNN-Toolkit2 Python API V2.5.0 — Modellkonfiguration und Quantisierungsparameter"
date: "2026-10-29"
author: "ArmSoM"
lang: "de"
translation_key: "rknn-v250-toolkit-api-configuration"
slug: "rknn-v250-toolkit-api-configuration"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "toolkit"]
products: []
reference_products: []
description: "RKNN-Toolkit2 Python API V2.5.0 — Modellkonfiguration und Quantisierungsparameter | Vollständige Parameter, Beispiele und Plattformgrenzen"
excerpt: "RKNN-Toolkit2 Python API V2.5.0 — Modellkonfiguration und Quantisierungsparameter | Vollständige Parameter, Beispiele und Plattformgrenzen"
permalink: "/de/articles/rknn-v250-toolkit-api-configuration/"
---

## Plattform und Quelle

Dieser Artikel basiert auf dem RKNN-V2.5.0-PDF des Herstellers und gilt nur für die dort genannten Chips und Schnittstellen. Bei ArmSoM-Boards zuerst SoC, NPU-Treiber, Toolkit/Runtime, SDK/BSP und Kernelversion prüfen. Eine ArmSoM-Hardwareprüfung wurde nicht durchgeführt; Beispiele und Messwerte stammen aus der Quelle, nicht aus ArmSoM-Tests.

## Seriennavigation

- [Umgebung und Objektlebenszyklus](/de/articles/rknn-v250-toolkit-api-requirements-lifecycle/)
- [Modellkonfiguration und Quantisierungsparameter](/de/articles/rknn-v250-toolkit-api-configuration/)
- [Caffe, TensorFlow, ONNX und PyTorch laden](/de/articles/rknn-v250-toolkit-api-model-loading/)
- [Aufbau, hybride Quantisierung und Export](/de/articles/rknn-v250-toolkit-api-build-quantize-export/)
- [Laufzeit, Operatorregistrierung und Inferenz](/de/articles/rknn-v250-toolkit-api-runtime-inference/)
- [Genauigkeit, Leistung, Speicher und Geräteabfragen](/de/articles/rknn-v250-toolkit-api-evaluation-query/)
- [C++-Bereitstellungsbeispiele erzeugen, bauen und ausführen](/de/articles/rknn-v250-toolkit-api-cpp-codegen/)

{% raw %}

<!-- source EN p8 unit 39 -->

## 3 API zur Modellkonfiguration

<!-- source EN p8 unit 40 -->

Vor dem Erstellen des RKNN-Modells dieses zunächst über config konfigurieren.

<!-- source EN p8 unit 41 -->

| API | config |
| --- | --- |
| Beschreibung | Parameter für die Modellkonvertierung festlegen. |
| Parameter | mean_values: Mittelwerte der Eingabe. Der Parameter ist eine Liste mit einer oder mehreren Mittelwert-Unterlisten. Bei mehreren Modelleingaben werden mehrere Unterlisten verwendet. Die Länge jeder Unterliste entspricht der Kanalzahl der Eingabe. Beispielsweise bedeutet [[128,128,128]], dass von den Werten aller drei Kanäle einer Eingabe jeweils 128 abgezogen wird.<br>Standardwert: None; alle Mittelwerte sind damit null. |
| Parameter | std_values: Normalisierungswerte der Eingabe. Der Parameter ist eine Liste mit einer oder mehreren Unterlisten von Normalisierungswerten. Bei mehreren Eingaben werden mehrere Unterlisten verwendet. Die Länge jeder Unterliste entspricht der Kanalzahl der Eingabe. Beispielsweise bedeutet [[128,128,128]], dass von den Werten der drei Kanäle einer Eingabe zunächst der Mittelwert abgezogen und das Ergebnis anschließend durch 128 geteilt wird.<br>Standardwert: None; alle std-Werte sind damit eins. |
| Parameter | quant_img_RGB2BGR: Gibt an, ob beim Laden eines Quantisierungsbildes zuerst RGB2BGR ausgeführt werden muss. Bei mehreren Eingaben werden die jeweiligen Parameter mit ‘,’ getrennt, etwa [True, True, False]. Standardwert: False.<br>Diese Einstellung wird meist für Caffe-Modelle verwendet. Beim Training der meisten Caffe-Modelle werden die Datensatzbilder zunächst mit RGB2BGR umgewandelt; in diesem Fall ist True einzustellen.<br>Die Einstellung gilt nur für Quantisierungsbilder im Format jpg/png/bmp. Beim Lesen von npy wird sie ignoriert. Wenn die Modelleingabe BGR verwendet, müssen daher auch die npy-Daten im BGR-Format vorliegen.<br>Die Einstellung wird nur zum Lesen der Bilder während der Quantisierung (Schnittstelle build) oder der Quantisierungsgenauigkeitsanalyse (accuracy_analysis) verwendet und nicht im endgültigen RKNN-Modell gespeichert. Bei einer BGR-Modelleingabe muss deshalb vor dem Aufruf von inference des Toolkits oder der run-Funktion der C-API sichergestellt sein, dass die importierten Bilddaten ebenfalls BGR verwenden. |
| Parameter | quantized_dtype: Quantisierungstyp. Unterstützt werden "w8a8", "w4a16", "w8a16" und "w16a16i_dfp". Standard: "w8a8".<br>- w8a8: Gewichte und Aktivierungen werden asymmetrisch mit 8 Bit quantisiert. RK2118 wird nicht unterstützt.<br>- w4a16: Gewichte werden symmetrisch mit 4 Bit quantisiert; Aktivierungen verwenden 16-Bit-Gleitkommazahlen. Unterstützt werden Faltungen mit 'group=1' und konstanten Gewichten sowie MatMul mit konstanten Eingaben (automatische Umwandlung in äquivalente 1x1-Faltungen); andere Operatoren werden nicht unterstützt. Nur RK3576/RV1126B.<br>- w8a16: Asymmetrische 8-Bit-Gewichte und 16-Bit-Gleitkommaaktivierungen. Nur RK3562.<br>- w16a16i_dfp: Gewichte und Aktivierungen verwenden dynamische 16-Bit-Festkommaquantisierung. Nur RV1103/RV1106. |
| Parameter | quantized_algorithm: Algorithmus zur Berechnung der Quantisierungsparameter jedes Layers. Unterstützt werden normal, mmse, kl_divergence und gdq. Standardwert: normal.<br>normal ist schnell. Empfohlen werden gewöhnlich etwa 20-100 Quantisierungsdaten; mehr Daten verbessern die Genauigkeit möglicherweise nicht weiter.<br>mmse ist wegen seines iterativen Durchprobierens langsamer, erreicht jedoch meist eine höhere Genauigkeit als normal. Empfohlen werden etwa 20-50 Daten. Je nach Quantisierungsdauer kann ihre Anzahl entsprechend erhöht oder verringert werden.<br>kl_divergence benötigt mehr Zeit als normal, aber deutlich weniger als mmse. In manchen Szenarien, etwa bei ungleichmäßiger Merkmalsverteilung, erzielt kl_divergence bessere Ergebnisse. Empfohlen werden etwa 20-100 Daten.<br>gdq gilt nur für w4a16 und w8a16 und kann deren Gewichtsgenauigkeit wirksam verbessern. Empfohlen werden mehr als 200 Daten. |
| Parameter | quantized_method: Unterstützt werden layer, channel und group{SIZE}. Standardwert: channel.<br>- layer: Jedes Gewicht besitzt nur einen Satz Quantisierungsparameter.<br>- channel: Jeder Gewichtskanal besitzt einen eigenen Satz Quantisierungsparameter. channel ist meist genauer als layer.<br>- group{SIZE}: Aufbauend auf channel werden die Gewichte jedes Ausgabekanals entlang des Eingabekanals entsprechend {SIZE} in mehrere Gruppen unterteilt. Jede Gruppe besitzt einen Parametersatz. group{SIZE} ist gewöhnlich genauer als channel. {SIZE} ist ein Vielfaches von 32 zwischen 32 und 256, etwa 'group32' oder 'group128'. group{SIZE} gilt derzeit nur bei quantized_dtype = w4a16. |
| Parameter | float_dtype: Datentyp für Gleitkommadaten im nicht quantisierten Fall. Unterstützt wird float16. Standardwert: float16. |
| Parameter | optimization_level: Optimierungsstufe des Modells. Standardwert: 3.<br>Damit lassen sich einige oder alle bei der Konvertierung verwendeten Optimierungsregeln deaktivieren. Bei 3 sind alle Optimierungen eingeschaltet. Bei 2 oder 1 werden einige Optionen deaktiviert, die die Genauigkeit bestimmter Modelle beeinflussen können. Bei 0 werden alle Optimierungen ausgeschaltet. |
| Parameter | target_platform: Zielchip des RKNN-Modells: 'rv1103', 'rv1103b', 'rv1106', 'rv1106b', 'rv1126b', 'rk2118', 'rk3562', 'rk3566', 'rk3568', 'rk3576', 'rk3588'. Die Signatur verwendet None als Standard, doch None ist kein gültiger Konfigurationswert. Der Parameter muss beim Aufruf von config gesetzt werden. |
| Parameter | custom_string: Fügt dem RKNN-Modell eine benutzerdefinierte Zeichenfolge hinzu, die zur Laufzeit abgefragt werden kann. Standardwert: None. |
| Parameter | remove_weight: Entfernt die Gewichte, um ein untergeordnetes RKNN-Modell zu erzeugen, das die Gewichte mit dem vollständigen RKNN-Modell teilen kann. Dies reduziert den Speicherverbrauch. Standardwert: False. |
| Parameter | compress_weight: Komprimiert die Modellgewichte und kann dadurch die Größe des RKNN-Modells reduzieren. Standardwert: False. |
| Parameter | single_core_mode: Gibt an, ob nur ein Einkernmodell erzeugt werden soll. Dies kann Modellgröße und Speicherverbrauch reduzieren. Standardwert: False. Gilt nur für RK3588 / RK3576. Standardwert: False. |
| Parameter | model_pruning: Beschneidet das Modell. Bei Modellen mit dünn besetzten Gewichten können dadurch Größe und Rechenaufwand des konvertierten RKNN-Modells reduziert werden. Standardwert: False. |
| Parameter | op_target: Legt das Ausführungsziel jeder Operation fest (NPU/CPU/GPU usw.). Format: {'op0_output_name':'cpu', 'op1_output_name':'cpu', ...}; alternativ über op_type: {'op_type':'cpu‘, 'op0_output_name':'cpu'....}. Beide Verfahren lassen sich kombinieren, beispielsweise {'op_type':'cpu‘, 'op0_output_name':'cpu'....}. Standardwert: None.<br>'op0_output_name' und 'op1_output_name' sind die Ausgabetensornamen der jeweiligen OP und können den Ergebnissen von accuracy_analysis entnommen werden. 'cpu' und 'npu' bedeuten, dass die zu diesem Tensor gehörige OP auf CPU bzw. NPU ausgeführt wird. Verfügbar sind 'cpu' / 'npu' / 'gpu' / 'auto'; 'auto' wählt das Ziel automatisch.<br>Auch op_type wird aus den Ergebnissen von accuracy_analysis ermittelt. Damit kann das Ausführungsziel aller OP dieses Typs im Modell eingestellt werden, etwa {'Add':'cpu', 'Expand':'cpu',....}. |
| Parameter | dynamic_input: Simuliert dynamische Eingaben anhand mehrerer vom Benutzer vorgegebener Eingabeform-Sätze. Format: [[input0_shapeA, input1_shapeA, ...], [input0_shapeB, input1_shapeB, ...], ...].<br>Standardwert: None; experimentell.<br>Beispielsweise lautet die ursprüngliche Eingabeform [1,3,224,224], [1,3,height,width] oder [1,3,-1,-1], das bereitzustellende Modell muss jedoch drei Formen unterstützen: [1,3,224,224], [1,3,192,192] und [1,3,160,160]. Dafür kann dynamic_input=[[[1,3,224,224]], [[1,3,192,192]], [[1,3,160,160]]] gesetzt werden. Bei der Inferenz mit dem konvertierten RKNN-Modell müssen Daten der entsprechenden Form übergeben werden.<br>Hinweise:<br>1. Die Funktion kann nur aktiviert werden, wenn das ursprüngliche Modell selbst dynamische Eingaben unterstützt; andernfalls entsteht ein Fehler.<br>2. Ist die ursprüngliche Eingabeform dynamisch, dürfen unterschiedliche Werte nur für dynamische Achsen gesetzt werden. |
| Parameter | quantize_weight: Wenn 'do_quantization' von rknn.build False ist, wird die Größe des rknn-Modells durch Quantisierung einiger Gewichte reduziert.<br>Standardwert: False. |
| Parameter | remove_reshape: Entfernt mögliche 'Reshape' an Modelleingängen und -ausgängen, um die Laufzeitleistung zu verbessern. Standardwert: False.<br>Hinweis: Dies kann die Form der Eingabe- oder Ausgabeknoten verändern. Beachten Sie die Warnmeldungen während der Konvertierung und berücksichtigen Sie die Auswirkungen der Formänderungen bei der Bereitstellung. |
| Parameter | sparse_infer: Führt zur Leistungssteigerung eine dünn besetzte Inferenz auf bereits ausgedünnten Modellen aus. Gilt nur für RK3576/RV1126B. Standardwert: False. |
| Parameter | enable_flash_attention: Gibt an, ob Flash Attention aktiviert werden soll. Standardwert: False.<br>Hinweis: FlashAttention basiert auf https://arxiv.org/abs/2307.08691. Durch die Cache-Nutzung innerhalb der Schleife lassen sich Beschleunigung und geringerer Bandbreitenbedarf erreichen. Die Modellgröße kann dabei jedoch steigen. Entscheiden Sie anhand des jeweiligen Szenarios und Modells. Weitere Details stehen bei 'exSDPAttention' in 'RKNN Compiler Support Operator List'. |
| Parameter | auto_hybrid_cos_thresh： Schwellenwert des Kosinusabstands bei der automatischen gemischten Modellquantisierung. Standardwert: 0.98. |
| Parameter | auto_hybrid_euc_thresh： Schwellenwert des euklidischen Abstands bei der automatischen gemischten Modellquantisierung. Standardwert: None, also nicht aktiviert. |
| Parameter | memory_plan_strategy: Verfahren zur Zuweisung des internen Speichers beim Kompilieren des RKNN-Modells; beeinflusst den Speicherbedarf während der Inferenz. Optionen: "BestFit", "GreedyBySize", "GreedyByLifetime", "SlowPeakGrowth". Standard: "BestFit".<br>BestFit — Aufgaben nach Startzeit sortieren; bei gleicher Startzeit hat die Aufgabe mit dem größten Speicherbedarf Vorrang. Adressen nacheinander zuweisen und unter den freien Blöcken im bereits zugewiesenen Adressraum den größenmäßig passendsten Block wählen.<br>GreedyBySize — Aufgaben nach Speicherbedarf sortieren; bei gleicher Größe hat die frühere Startzeit Vorrang. Nacheinander zuweisen und einen freien Block mit möglichst passender Größe im bereits zugewiesenen Adressraum suchen.<br>GreedyByLifetime — nach Startzeit sortieren, bei Gleichstand größere Aufgaben zuerst. Endadressen zugewiesener Blöcke und Adresse 0 als Kandidaten sammeln. Einen Kandidaten mit längster Lebensdauer ohne Konflikt im unteren Bereich wählen; bis zum Abschluss wiederholen.<br>SlowPeakGrowth — nach Startzeit sortieren, bei Gleichstand größere Aufgaben zuerst. Endadressen zugewiesener Blöcke und Adresse 0 sammeln. Die Aufgabe mit dem kleinsten Wachstum des Spitzenspeicherbedarfs und einen konfliktfreien Kandidaten im unteren Bereich wählen; bis zum Abschluss wiederholen. |
| Parameter | compute_order: Topologische Reihenfolge des Graphen während der RKNN-Inferenz. Beeinflusst den internen Speicherbedarf bestimmter Modelle, insbesondere mit mehreren Zweigen. Optionen "WidthFirst" und "DepthFirst"; Standard "WidthFirst". |
| Rückgabewert | 0: Konfiguration erfolgreich.<br>Bei ungültiger Konfiguration wird ValueError ausgelöst. |

<!-- source EN p11 unit 45 -->

Beispielcode:

<!-- source EN p11 unit 46 -->

```python
# model config
rknn.config(mean_values=[[103.94, 116.78, 123.68]],
           std_values=[[58.82, 58.82, 58.82]],
           quant_img_RGB2BGR=True,
           target_platform='rk3566')
```

{% endraw %}

## Quelle und redaktionelle Hinweise

Technische Kapitel sind nach Anwendung aufgeteilt. Code, Bezeichner und Parameter bleiben erhalten. Chinesisch folgt der chinesischen Quelle, Englisch, Russisch und Deutsch der englischen. Für Kapitel ohne Abbildungen wurden keine erfundenen Bilder hinzugefügt.

Redaktionelle Hinweise: Protokolle mit SDK 1.5.2 bleiben historische Beispiele, keine V2.5.0-Messungen. Die Python-Zelle für Ubuntu20.04 unterscheidet sich: chinesisch 3.8/3.9, englisch 3.8/3.8; ebenso für Debian11; im ARM64-Abschnitt ist Debian weiterhin als x64 bezeichnet. Quellwerte bleiben erhalten; tatsächliches Installationspaket prüfen. V2.5.0 ergänzt C++ codegen und präzisiert Quantisierung und Speicherstrategien; alte Parameter ersetzen nicht die neue Quelle.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
