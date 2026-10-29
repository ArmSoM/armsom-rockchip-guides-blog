---
title: "RKNN2 SDK V2.5.0 · Diagnose von Genauigkeitsproblemen"
description: "RKNN2 SDK V2.5.0 · Diagnose von Genauigkeitsproblemen · Vollständige Entwicklerhandbuchreihe"
excerpt: "Diagnose von Genauigkeitsproblemen"
translation_key: "rknn-v250-sdk-guide-accuracy"
slug: "rknn-v250-sdk-guide-accuracy"
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

**RKNN2 SDK V2.5.0 · 19/22**

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

[15. NPU-SRAM auf RK3588/RK3576](/de/articles/rknn-v250-sdk-guide-sram/)

[16. Cache-Kohärenz und Sparse-Inferenz](/de/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Benutzerdefinierte Operatoren: Python und C API](/de/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Bereitstellung verschlüsselter Modelle](/de/articles/rknn-v250-sdk-guide-encryption/)

**Diagnose von Genauigkeitsproblemen**

[20. Leistungsanalyse und Netzwerkoptimierung](/de/articles/rknn-v250-sdk-guide-performance/)

[21. Speicheranalyse, gemeinsame Nutzung und Wiederverwendung](/de/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, Fehlerbehandlung und Referenzen](/de/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

## 5. Fehlerbehebung und Optimierung

## 5.1 Fehlersuche bei der Genauigkeit

Genauigkeitsprobleme eines Modells werden normalerweise auf zwei Ebenen untersucht: im Simulator und in der Runtime auf der Platine. Korrekte Simulatorergebnisse sind Voraussetzung für korrekte Runtime-Ergebnisse. Daher muss zunächst die Simulatorinferenz geprüft werden, bevor die Runtime auf der Platine untersucht wird. Die Reihenfolge lautet „FP16-Genauigkeit des Simulators → Quantisierungsgenauigkeit des Simulators → Genauigkeit mit angeschlossener Platine → Runtime-Genauigkeit“. Jeder Schritt setzt die Korrektheit des vorherigen voraus.

Dieses Kapitel enthält Empfehlungen und Lösungen zur Genauigkeitsprüfung im Simulator und in der Runtime. Die einzelnen Schritte zeigt die folgende Abbildung:

![Abbildung 5-1. Schritte der Genauigkeitsanalyse ](/assets/images/rknn-v250/sdk-guide/en/p154-figure-01.png)

Abbildung 5-1. Schritte der Genauigkeitsanalyse

Die Genauigkeitsprüfung des Simulators umfasst zwei Schritte: FP16-Prüfung und Quantisierungsprüfung (dunkle Kästen in der obigen Abbildung).

Die Runtime-Genauigkeitsprüfung umfasst die Prüfung mit angeschlossener Platine und die Runtime-Prüfung (helle Kästen in der obigen Abbildung).

Die Kosinusdistanz kann als grundlegendes Genauigkeitskriterium dienen; die endgültige Auswirkung der Quantisierung muss jedoch anhand des Datensatzes validiert werden.

### 5.1.1 Fehlersuche bei der Simulatorgenauigkeit

Korrekte Simulatorinferenz ist Voraussetzung für korrekte Board-Inferenz und muss daher zuerst sichergestellt werden.

Der Simulator von RKNN-Toolkit2 führt je nach Quantisierung des Modells FP16-Inferenz oder quantisierte Inferenz aus. Korrekte FP16-Ergebnisse sind Voraussetzung für korrekte quantisierte Ergebnisse. Bei Genauigkeitsproblemen der quantisierten Inferenz ist daher zuerst FP16 zu prüfen, anschließend die Quantisierung.

#### 5.1.1.1 FP16-Genauigkeit im Simulator

RKNPU unterstützt derzeit keine FP32-Berechnungen, daher verwendet der Simulator ohne Quantisierung standardmäßig FP16. Zur Umwandlung in ein FP16-RKNN-Modell wird rknn.build() mit do_quantization = False aufgerufen. Anschließend liefern rknn.init_runtime(target=None) und rknn.inference() die FP16-Simulatorergebnisse.

Bei falscher FP16-Ausgabe sind folgende Prüfungen möglich:

Konfigurationsfehler

Die meisten Modelleinstellungen liegen in rknn.config(); auch einzelne Einstellungen anderer APIs können jedoch die FP16-Genauigkeit beeinflussen. Die wichtigsten Parameter sind:

mean_values / std_values: Normalisierungsparameter. Im ursprünglichen Modell wird die Normalisierung gewöhnlich in der Eingabevorverarbeitung ausgeführt. Bei RKNN kann sie in der Inferenz enthalten sein; bei aktivierter Quantisierung wird zunächst der Kalibrierdatensatz normalisiert. Verwendet das ursprüngliche Modell eine Normalisierung, müssen diese Parameter mit dessen Werten übereinstimmen.

input_size_list: Falsche Eingabeknotenformen in rknn.load_tensorflow(), rknn.load_pytorch() oder rknn.load_onnx() führen zu falschen Inferenzergebnissen.

inputs / outputs: Falsche Eingabe- oder Ausgabeknotennamen in rknn.load_tensorflow() und rknn.load_onnx() führen zu falschen Inferenzergebnissen.

Parameter von inference: Die wichtigsten Eingabeparameter von rknn.inference() sind inputs und data_format.

In Python werden Bilder gewöhnlich mit cv2.imread() gelesen; das Ergebnis ist BGR. Erwartet das ursprüngliche Modell BGR, wie die meisten caffe-Modelle, muss die RGB-Reihenfolge nicht geändert werden. Für RGB-Eingaben wird cv2.cvtColor(img, cv2.COLOR_BGR2RGB) benötigt. cv2.imread() liefert 3 Dimensionen, die meisten Modelle erwarten jedoch 4. Daher muss vor rknn.inference() mit np.expand_dims(img, 0) eine Dimension ergänzt werden. Das Layout von cv2.imread() und der Standardwert von data_format sind NHWC; data_format muss deshalb nicht gesetzt werden.

Werden die Daten nicht mit cv2.imread() gelesen, muss ihr Layout bekannt sein und data_format entsprechend gesetzt werden. Die Datenform muss mit dem ursprünglichen Modell übereinstimmen; bei Bildern gilt dies auch für die RGB-Reihenfolge.

Die Parameterprüfung ist entscheidend: Falsche Einstellungen sind eine häufige Ursache fehlerhafter FP16-Ergebnisse. Vorgehen:

a. Führen Sie die Inferenz des Originalmodells im ursprünglichen Framework aus und speichern Sie die Ergebnisse.

b. Konvertieren Sie das Originalmodell mit RKNN-Toolkit2 und führen Sie die Inferenz mit denselben Eingabedaten im FP16-Modus aus: do_quantization=False in rknn.build(). Setzen Sie target=None in rknn.init_runtime(), um den RKNN-Toolkit2-Simulator zu verwenden, und speichern Sie die Ergebnisse.

c. Vergleichen Sie die Ergebnisse beider Inferenzläufe. Stimmen sie weitgehend überein, beispielsweise gemessen an der Kosinusdistanz, sind die genannten Einstellungen korrekt.

d. Bei abweichenden Ergebnissen prüfen Sie die genannten Parameter.

Sind die Einstellungen korrekt und die Ergebnisse trotzdem unterschiedlich, überschreiten Modell-Tensoren möglicherweise den FP16-Wertebereich.

Überschreitung des FP16-Wertebereichs

Beim Übergang von FP32 zu FP16 können Zwischentensoren überlaufen. Modelle rechnen gewöhnlich mit FP32; Werte außerhalb des FP16-Bereichs (-65504～65504) verursachen Überläufe und fehlerhafte Ergebnisse.

Zur Überlaufprüfung dient rknn.accuracy_analysis(..., target=None), siehe Modellgenauigkeitsanalyse. Auffällige Werte wie 'inf' in entire oder single unter simulator_error können FP16-Überläufe anzeigen. Die Struktur kann beispielsweise durch zusätzliche BN-Layer so angepasst werden, dass alle Tensoren im FP16-Bereich bleiben.

Sind Einstellungen korrekt und FP16-Überläufe ausgeschlossen, können Unterschiede auf die Simulatorimplementierung zurückgehen. Stellen Sie dem Rockchip-NPU-Team eine reproduzierbare Modelldatei zur Analyse und Behebung bereit.

#### 5.1.1.2 Quantisierungsgenauigkeit im Simulator

Nach Ausschluss von FP16-Problemen quantisieren Sie das Modell mit do_quantization=True in rknn.build(). Rufen Sie anschließend rknn.accuracy_analysis(..., target=None) auf, um die Quantisierungsgenauigkeit im Simulator zu analysieren; siehe „Modellgenauigkeitsanalyse“.

Wenn die Genauigkeit in der Spalte entire von simulator_error deutlich sinkt, aber in der Spalte single kein einzelner Layer einen besonders großen Verlust zeigt, untersuchen Sie vor allem folgende Punkte:

Konfigurationsfehler

Wie bei FP16 können falsche Einstellungen Genauigkeitsprobleme der quantisierten Inferenz verursachen. Nach Prüfung der FP16-Konfiguration müssen daher zusätzlich folgende Quantisierungsparameter kontrolliert werden.

quant_img_RGB2BGR: Steuert die RGB2BGR-Umwandlung beim Laden der Quantisierungsbilder und wird meist für caffe-Modelle verwendet. Details stehen in der Parameterbeschreibung. Die Einstellung muss der Kanalreihenfolge der Trainingsbilder entsprechen; eine falsche Konfiguration kann die Genauigkeit deutlich verringern.

optimization_level: Auswahl der Optimierungsstufe. Standardwert 3 priorisiert Geschwindigkeit und aktiviert Regeln, die die Leistung verbessern, aber die Genauigkeit leicht beeinflussen. Ein niedrigerer Wert, beispielsweise 0, deaktiviert diese Regeln.

dataset: Kalibrierungsdatensatz für rknn.build(), aus dem beim Quantisieren geeignete scale / zero_point für jeden Tensor berechnet werden. Weicht er stark vom tatsächlichen Einsatz ab, kann die Genauigkeit sinken. Auch zu viele oder zu wenige Bilder beeinflussen das Ergebnis; üblich sind 20~200 Bilder.

Zur Prüfung der Quantisierungsparameter werden üblicherweise folgende Schritte ausgeführt:

a. Führen Sie quantisierte Inferenz aus und vergleichen Sie die Ergebnisse mit dem Originalmodell im ursprünglichen Framework. Bei geringen Abweichungen können quant_img_RGB2BGR und dataset als grundsätzlich korrekt gelten.

b. Sind die Abweichungen weiterhin deutlich:

Wenn das Originalmodell BGR erwartet, was bei caffe häufig vorkommt, setzen Sie quant_img_RGB2BGR=True. Die Eingabekanalreihenfolge lässt sich aus dem Vorverarbeitungscode der vorherigen FP16-Prüfung bestimmen.

Quantisieren Sie zunächst mit nur einem Bild, also einer Zeile in dataset.txt, und verwenden Sie dasselbe Bild für die Inferenz. Verbessert sich dessen Genauigkeit deutlich, war der bisherige Kalibrierungsdatensatz ungeeignet; wählen Sie passendere Bilder für den Einsatzfall. Ohne deutliche Verbesserung liegt die Ursache möglicherweise nicht im Datensatz.

Wurde ursprünglich nur ein Bild beziehungsweise eine Zeile in dataset.txt verwendet, erhöhen Sie die Anzahl auf ungefähr 20~200 Kalibrierungsbilder.

Nach diesen Prüfungen sollten die Quantisierungsergebnisse nicht vollständig falsch sein. Andernfalls prüfen Sie die Einstellungen erneut. Sind sie korrekt, aber die Genauigkeit reicht nicht aus, ändern Sie beispielsweise Quantisierungsmethode und -algorithmus.

Quantisierungsmethoden und Quantisierungsalgorithmen

Einige Modelle sind schlecht für Quantisierung geeignet. Probieren Sie andere Methoden und Algorithmen. Die drei Hauptmethoden sind layer, channel und group; group wirkt nur auf lineare Layer, siehe 2.2.1.3 „Quantisierungsgranularität“. Sie werden über quantized_method in rknn.config() festgelegt, standardmäßig channel. Die vier Hauptalgorithmen normal, kl_divergence, mmse und gdq stehen unter 2.2.3.2 „Interne Quantisierungsalgorithmen“. Sie werden über quantized_algorithm in rknn.config() gewählt, standardmäßig normal. Vorgehen:

a. Wechseln Sie von layer zu channel. Die Genauigkeit von channel ist normalerweise deutlich höher als die von layer.

b. Reicht channel nicht aus, wechseln Sie von normal zu kl_divergence oder mmse. Die Quantisierung dauert deutlich länger, liefert aber bessere Genauigkeit als normal, ohne die Runtime-Leistung zu beeinflussen.

Eigenschaften der Algorithmen und empfohlene Mengen an Kalibrierungsdaten sind nachfolgend zusammengefasst:

| Quantisierungsalgorithmus | Eigenschaften | Empfohlene Menge an Kalibrierungsdaten |
| --- | --- | --- |
| normal (Standard) | Konventionelle, schnelle Kalibrierung | 20~100 Bilder |
| kl_divergence | Gute Verbesserung bei ungleichmäßiger Merkmalsverteilung; etwas langsamer als normal | 20~100 Bilder |
| mmse | Sucht den Quantisierungsbereich iterativ; meist höhere Genauigkeit, aber deutlich mehr Zeit- und Speicherbedarf | 20~50 Bilder |
| gdq | Wirkt nur bei w4a16 und w8a16 und kann die Genauigkeit der Gewichtsquantisierung wirksam erhöhen | Mehr als 200 Bilder |

Beginnen Sie mit normal und probieren Sie bei unzureichender Genauigkeit kl_divergence, mmse oder gdq. Der Algorithmus beeinflusst nur die Modellkonvertierung, nicht die Ausführungsleistung auf der Platine.

Bleibt die Genauigkeit von entire in simulator_error schlecht und zeigen einzelne Layer in single große Verluste, kann die Gewichtsverteilung dieser Layer ungünstig sein. Bei stark ungleichmäßigen Gewichten eines Conv-Layers kann hybride Quantisierung helfen. Schritte:

a. Analysieren Sie die Genauigkeit, ermitteln Sie Layer mit großen Verlusten und notieren Sie deren Ausgabetensornamen. Fehler akkumulieren über die Layer; frühe Layer beeinflussen das Endergebnis stärker. Berücksichtigen Sie daher sowohl den Verlust in single von simulator_error als auch die Position im Modell.

b. Tragen Sie die ermittelten Tensornamen in die Konfigurationsdatei der hybriden Quantisierung ein; siehe „Hybride Quantisierung“.

c. Schließen Sie die hybride Quantisierung ab und prüfen Sie die Genauigkeit. Änderungen können weiterhin über die Genauigkeitsanalyse beobachtet werden.

Hybride Quantisierung verbessert normalerweise die Genauigkeit. Reicht die Verbesserung nicht aus, beziehen Sie mehr Layer ein; dies verringert jedoch die Inferenzleistung. Genauigkeit und Geschwindigkeit müssen abgewogen werden. Liegt der problematische Op im letzten Layer, kann dessen Ausführung auch in die Nachverarbeitung verlagert werden, um den Genauigkeitsverlust zu vermeiden.

QAT (quantisierungsbewusstes Training):

Reicht die Genauigkeit nach hybrider Quantisierung nicht aus oder wird sie nur bei unzureichender Leistung erreicht, trainieren Sie das Modell mit quantisierungsbewusstem Training erneut und exportieren Sie es mit Quantisierungsparametern, etwa als onnx/pt/pb/tflite. Siehe „Quantization-Aware Training (QAT)“.

### 5.1.2 Fehlersuche bei der Laufzeitgenauigkeit

Trotz korrekter Simulatorergebnisse kann die C-API-Bereitstellung auf dem Board falsche Ergebnisse liefern. Typische Ursachen sind ein Fehler der Board-Runtime, falsche Verwendung der RKNPU2 C API oder fehlerhafte Vor-/Nachverarbeitung.

Prüfen Sie zunächst im Modus mit angeschlossenem Board, ob ein Runtime-Fehler vorliegt. Funktioniert dieser korrekt, untersuchen Sie die C-API-Bereitstellung.

#### 5.1.2.1 Genauigkeit mit angeschlossenem Board

1 Richten Sie die Board-Debuggingumgebung gemäß NPU-Umgebungseinrichtung ein, verbinden Sie das Board per USB mit dem PC und führen Sie RKNN-Toolkit2-Inferenz mit target in rknn.init_runtime() aus, etwa target='rk3566'. Prüfen Sie die ungefähre Richtigkeit: Der Simulator bildet die NPU nicht exakt nach, daher müssen die Ergebnisse nicht vollständig übereinstimmen.

2 Deutliche Abweichungen vom Simulator deuten zunächst auf einen Board-Runtime-Fehler hin. Führen Sie die Genauigkeitsanalyse mit rknn.accuracy_analysis() und target aus, etwa target='rk3566'; siehe Modellgenauigkeitsanalyse. Danach werden die Ergebnisse jedes Layers ausgegeben.

3. Prüfen Sie die Spalte single_sim von runtime_error. Ist die Kosinusdistanz cos niedrig oder die euklidische Distanz euc hoch (gelb oder rot dargestellt), sodass sich die Abweichung zwischen entire von runtime_error und entire von simulator_error vergrößert, kann die Runtime bei der Implementierung dieses Layers Genauigkeit verlieren oder fehlerhaft arbeiten. Analyseergebnisse und Reproduktionsmodell können dem Rockchip-NPU-Team zur Behebung übermittelt werden.

#### 5.1.2.2 Runtime-Genauigkeit

Ist die Genauigkeit mit angeschlossener Platine korrekt, das Anwendungsergebnis aber weiterhin falsch, kann die Ursache im eigenen C/C++-Code für die RKNN C API liegen. Prüfen Sie API-Einstellungen sowie Vor- und Nachverarbeitung; sie müssen vollständig dem Simulator entsprechen. Gehen Sie wie folgt vor:

**1 Eingabekonfiguration und -daten prüfen**

Prüfen Sie die Eingabe der C API. Wurden Mittelwert und Varianz bei der Modellkonvertierung mit RKNN-Toolkit2 bereits konfiguriert, ist im C/C++-Code keine Normalisierung nötig. Bei drei Kanälen muss deren Reihenfolge dem Training entsprechen; für 4D gilt fmt=NHWC, sonst fmt=UNDEFINED. In der allgemeinen API entspricht die Puffergröße der Anzahl der Eingabetensorelemente * Bytes je Element. Für zero-copy beschreibt 3.1.6 „RKNN Runtime Zero-Copy-Schnittstelle“ Speichergröße und Eingabeformat von rknn_create_mem.

Nach Prüfung der Einstellungen untersuchen Sie die Daten des Eingabelayers. Setzen Sie vor dem Programmstart RKNN_LOG_LEVEL=5. Die layerweisen Ergebnisse werden als numpy-Dateien unter /data/dumps bei Android oder /userdata/dumps bei Linux gespeichert. Prüfen Sie die Datei mit InputOperator. Bei der allgemeinen API enthält sie das Ergebnis der Eingabenormalisierung, bei zero-copy die Daten davor.

**2 Ausgabekonfiguration und -daten prüfen**

Nach Prüfung der Eingabe kontrollieren Sie die Ausgabeeinstellungen. In der allgemeinen API liefert want_float=1 float32; want_float=0 liefert den quantisierten Datentyp oder float16 bei nicht quantisierten Daten. Für zero-copy stehen Speichergröße und Datenformat von rknn_create_mem() in 3.1.6 „RKNN Runtime Zero-Copy-Schnittstelle“.

Öffnen Sie zur Ausgabeprüfung die erzeugte numpy-Datei mit OutputOperator. Ist die Eingabe nachweislich korrekt, die Ausgabe aber falsch, verarbeitet die Runtime möglicherweise bestimmte Ein-/Ausgabetypen fehlerhaft. Übermitteln Sie Analyse und Reproduktionsmodell an das Rockchip-NPU-Team.

{% endraw %}
