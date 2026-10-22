---
title: "RKNN-Toolkit2-API: Konfiguration, Konvertierung, Quantisierung und Inferenz"
description: "Vollständige V2.3.2-Referenz zu Framework-Abhängigkeiten, sämtlichen API-Parametern, gemischter Quantisierung, Genauigkeits-/Leistungs-/Speicherbewertung und eigenen Operatoren."
translation_key: "093-rockchip-rknn-toolkit2-api"
slug: "093-rockchip-rknn-toolkit2-api"
lang: "de"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
tags: ["Rockchip", "RKNN", "Toolkit2", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip RKNN Toolkit2 Python API quantization"
excerpt: "Vollständige V2.3.2-Referenz zu Framework-Abhängigkeiten, sämtlichen API-Parametern, gemischter Quantisierung, Genauigkeits-/Leistungs-/Speicherbewertung und eigenen Operatoren."
---

{% raw %}

# RKNN-Toolkit2-API: Konfiguration, Konvertierung, Quantisierung und Inferenz

## Anwendbarkeit auf ArmSoM und Quelle

Dies ist eine Rockchip-Plattformreferenz, kein ArmSoM-Testbericht. Quellen: RK-YH-YF-412, V2.3.2, 22 chinesische und 25 englische Seiten. Chinesisch folgt dem chinesischen, Englisch dem englischen Original; Russisch und Deutsch übersetzen Englisch vollständig. Die PDFs enthalten keine technischen Abbildungen: Der gesamte Inhalt besteht aus editierbarem Text, Tabellen und Code, ohne erfundene englische Bilder. Genannt sind RV1103/RV1103B/RV1106/RV1106B/RV1126B, RK2118, RK3562 und RK3566/3568/3576/3588-Serien, aber keine SDK/BSP- oder Kernelkombination eines konkreten ArmSoM-Boards. NPU-Treiber, Toolkit2/Runtime/Server-Versionen, Hostsystem/-architektur, Python, Framework und Modellformat abgleichen. x64-Funktionen nicht auf ARM64 verallgemeinern. Versions-, top-5-, Speicher- und SDK-Ausgaben sind Quellbeispiele, keine ArmSoM-Tests. V2.3.2 bezeichnet den Quellstand, nicht die neueste Veröffentlichung.

> Redaktionshinweis: Auch die Quellen derselben Version unterscheiden sich. Die Python-Zelle für Ubuntu20.04 enthält chinesisch 3.8/3.9, englisch 3.8/3.8; im ARM64-Abschnitt sind Debian-Einträge als x64 markiert. Quellwerte bleiben ohne vermutete Kompatibilitätskorrektur erhalten. Weitere Zweifel stehen in den redaktionellen Hinweisen; API/Code sind keine ArmSoM-validierten Anpassungen.

[EDITORIAL-NOTES](/docs/rockchip-rknn-toolkit2-api/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)


<!-- source: EN PDF p4; unit 0 -->

## 1 Anforderungen

<!-- source: EN PDF p4; unit 1 -->

### 1.1 Unterstützte Chipmodelle

<!-- source: EN PDF p4; unit 2 -->

RV1103

<!-- source: EN PDF p4; unit 3 -->

RV1103B

<!-- source: EN PDF p4; unit 4 -->

RV1106

<!-- source: EN PDF p4; unit 5 -->

RV1106B

<!-- source: EN PDF p4; unit 6 -->

RV1126B

<!-- source: EN PDF p4; unit 7 -->

RK2118

<!-- source: EN PDF p4; unit 8 -->

RK3562

<!-- source: EN PDF p4; unit 9 -->

RK3566-Serie

<!-- source: EN PDF p4; unit 10 -->

RK3568-Serie

<!-- source: EN PDF p4; unit 11 -->

RK3576-Serie

<!-- source: EN PDF p4; unit 12 -->

RK3588-Serie

<!-- source: EN PDF p4; unit 13 -->

Hinweis: RK3566 / RK3568 / RK3576 / RK3588 bezeichnen im Folgenden jeweils die entsprechenden RK3566-/RK3568-/RK3576-/RK3588-Serien.

<!-- source: EN PDF p4; unit 14 -->

### 1.2 Anforderungen an Umgebung und Abhängigkeiten

<!-- source: EN PDF p4; unit 15 -->

Für die Betriebssystemumgebung werden folgende Anforderungen empfohlen:

<!-- source: EN PDF p4; unit 16 -->

| Betriebssystem-<br>version | Ubuntu18.04<br>(x64) | Ubuntu20.04<br>(x64) | Ubuntu22.04<br>(x64) | Ubuntu24.04<br>(x64) |
| --- | --- | --- | --- | --- |
| Python-Version | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 | 3.12 |

<!-- source: EN PDF p4; unit 17 -->

Für ARM64:

<!-- source: EN PDF p4; unit 18 -->

| Betriebssystemversion | Debian10 (x64) | Debian11 (x64) | Debian12 (x64) |
| --- | --- | --- | --- |
| Python-Version | 3.6 / 3.7 | 3.8 / 3.8 | 3.10 / 3.11 / 3.12 |

<!-- source: EN PDF p4; unit 19 -->

Hinweise:

<!-- source: EN PDF p4; unit 20 -->

1\. Detaillierte Python-Bibliotheksabhängigkeiten stehen in doc/requirements*.txt.

<!-- source: EN PDF p4; unit 21 -->

2\. Die Dokumentbeispiele verwenden hauptsächlich Ubuntu 20.04 / Python3.8.

<!-- source: EN PDF p4; unit 22 -->

### 1.3 Unterstützte Deep-Learning-Frameworks

<!-- source: EN PDF p4; unit 23 -->

RKNN-Toolkit2 unterstützt Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet und PyTorch.

<!-- source: EN PDF p4; unit 24 -->

Die Zuordnung zwischen RKNN-Toolkit2 und den Framework-Versionen ist nachfolgend aufgeführt:

<!-- source: EN PDF p5; unit 25 -->

| RKNN-Toolkit2 | Caffe | TensorFlow | TF Lite | ONNX | DarkNet | PyTorch |
| --- | --- | --- | --- | --- | --- | --- |
| 1.4.0<br>1.4.2<br>1.5.0<br>1.5.2 | 1.0 | 1.12.0<br>~2.8.0 | Schema-<br>Version=3 | 1.7.0<br>~1.10.0 | Commit-ID:<br>810d7f7 | 1.6.0<br>~1.10.1 |
| 1.6.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema-<br>Version=3 | 1.7.0<br>~1.14.0 | Commit-ID:<br>810d7f7 | 1.6.0<br>~1.13.1 |
| 2.0.0<br>2.1.0<br>2.2.0 | 1.0 | 1.12.0<br>~2.14.0 | Schema-<br>Version=3 | 1.7.0<br>~1.14.1 | Commit-ID:<br>810d7f7 | 1.10.1<br>~2.1.0 |
| 2.3.0<br>2.3.2 | 1.0 | 1.12.0<br>~2.14.0 | Schema-<br>Version=3 | 1.7.0<br>~1.17.0 | Commit-ID:<br>810d7f7 | 1.10.1<br>~2.4.0 |

<!-- source: EN PDF p5; unit 26 -->

Hinweise:

<!-- source: EN PDF p5; unit 27 -->

1\. Aufgrund der TensorFlow-Versionskompatibilität werden theoretisch auch pb-Dateien unterstützt, die vor TensorFlow 1.12.0 exportiert wurden. Einzelheiten zur Kompatibilität verschiedener Versionen stehen in der offiziellen Dokumentation: [https://www.tensorflow.org/guide/versions](https://www.tensorflow.org/guide/versions)

<!-- source: EN PDF p5; unit 28 -->

2\. Die Schemas verschiedener TFLite-Versionen sind nicht miteinander kompatibel. Unterscheidet sich das Schema eines exportierten TFLite-Modells von der durch RKNN-Toolkit2 verwendeten Schemaversion, kann das Laden fehlschlagen.

<!-- source: EN PDF p5; unit 29 -->

3\. Das Caffe-Protokoll von RKNN-Toolkit2 basiert mit Änderungen auf dem offiziellen Berkeley-Protokoll. Quelle: [https://github.com/BVLC/caffe/tree/master/src/caffe/proto,](https://github.com/BVLC/caffe/tree/master/src/caffe/proto,) Commit 828dd10. RKNN-Toolkit2 ergänzt darauf aufbauend einige Operatoren.

<!-- source: EN PDF p5; unit 30 -->

4\. Die Zuordnung zwischen ONNX-Releases, opset- und IR-Versionen ist in der onnxruntime-Dokumentation beschrieben: [https://github.com/microsoft/onnxruntime/blob/v1.10.0/docs/Versioning.md](https://github.com/microsoft/onnxruntime/blob/v1.10.0/docs/Versioning.md)

<!-- source: EN PDF p5; unit 31 -->

5\. Offizielles DarkNet-Repository: [https://github.com/pjreddie/darknet.](https://github.com/pjreddie/darknet.) Die Konvertierungsregeln des Dokumentstands beruhen auf dessen letztem master-Commit 810d7f7; dies ist keine Aussage über den heutigen HEAD.

<!-- source: EN PDF p5; unit 32 -->

6\. Beim Laden eines PyTorch-Modells (torchscript) wird dieselbe PyTorch-Version für Modellexport und RKNN-Konvertierung empfohlen. Unterschiedliche Versionen können zum Konvertierungsfehler führen.

<!-- source: EN PDF p5; unit 33 -->

7\. Die ARM64-Version unterstützt laut Dokumentstand nur PyTorch und ONNX; andere Frameworks werden dort nicht unterstützt.

<!-- source: EN PDF p6; unit 34 -->

## 2 RKNN-Toolkit2-API-Beschreibung

<!-- source: EN PDF p6; unit 35 -->

### 2.1 RKNN initialisieren und freigeben

<!-- source: EN PDF p6; unit 36 -->

Diese Funktionsgruppe initialisiert das RKNN-Objekt und gibt es frei. Vor der Verwendung sämtlicher RKNN-Toolkit2-APIs RKNN() aufrufen; nach Abschluss der Aufgabe das Objekt mit release() freigeben.

<!-- source: EN PDF p6; unit 37 -->

Bei der Initialisierung steuern verbose und verbose_file die ausführliche Protokollierung etwa beim Laden und Erstellen von Modellen. verbose hat den Typ bool: True aktiviert detaillierte Ausgaben von RKNN-Toolkit2. verbose_file ist eine Zeichenfolge; enthält sie einen Dateipfad, wird das Protokoll dort gespeichert. Auch dafür muss verbose auf True stehen.

<!-- source: EN PDF p6; unit 38 -->

Beispielcode:

<!-- source: EN PDF p6; unit 39 -->

```text
# Print the detailed log information.
rknn = RKNN(verbose=True)

…

rknn.release()
```

<!-- source: EN PDF p6; unit 40 -->

### 2.2 Modell konfigurieren

<!-- source: EN PDF p6; unit 41 -->

Vor dem Erstellen des RKNN-Modells dieses zunächst über config konfigurieren.

<!-- source: EN PDF p6; unit 42 -->

| API | config |
| --- | --- |
| Beschreibung | Parameter für die Modellkonvertierung festlegen. |
| Parameter | mean_values: Mittelwerte der Eingabe. Der Parameter ist eine Liste mit einer oder mehreren Mittelwert-Unterlisten. Bei mehreren Modelleingaben werden mehrere Unterlisten verwendet. Die Länge jeder Unterliste entspricht der Kanalzahl der Eingabe. Beispielsweise bedeutet [[128,128,128]], dass von den Werten aller drei Kanäle einer Eingabe jeweils 128 abgezogen wird.<br>Standardwert: None; alle Mittelwerte sind damit null. |
| Parameter | std_values: Normalisierungswerte der Eingabe. Der Parameter ist eine Liste mit einer oder mehreren Unterlisten von Normalisierungswerten. Bei mehreren Eingaben werden mehrere Unterlisten verwendet. Die Länge jeder Unterliste entspricht der Kanalzahl der Eingabe. Beispielsweise bedeutet [[128,128,128]], dass von den Werten der drei Kanäle einer Eingabe zunächst der Mittelwert abgezogen und das Ergebnis anschließend durch 128 geteilt wird.<br>Standardwert: None; alle std-Werte sind damit eins. |
| Parameter | quant_img_RGB2BGR: Gibt an, ob beim Laden eines Quantisierungsbildes zuerst RGB2BGR ausgeführt werden muss. Bei mehreren Eingaben werden die jeweiligen Parameter mit ‘,’ getrennt, etwa [True, True, False]. Standardwert: False.<br>Diese Einstellung wird meist für Caffe-Modelle verwendet. Beim Training der meisten Caffe-Modelle werden die Datensatzbilder zunächst mit RGB2BGR umgewandelt; in diesem Fall ist True einzustellen.<br>Die Einstellung gilt nur für Quantisierungsbilder im Format jpg/png/bmp. Beim Lesen von npy wird sie ignoriert. Wenn die Modelleingabe BGR verwendet, müssen daher auch die npy-Daten im BGR-Format vorliegen.<br>Die Einstellung wird nur zum Lesen der Bilder während der Quantisierung (Schnittstelle build) oder der Quantisierungsgenauigkeitsanalyse (accuracy_analysis) verwendet und nicht im endgültigen RKNN-Modell gespeichert. Bei einer BGR-Modelleingabe muss deshalb vor dem Aufruf von inference des Toolkits oder der run-Funktion der C-API sichergestellt sein, dass die importierten Bilddaten ebenfalls BGR verwenden. |
| Parameter | quantized_dtype: Quantisierungstyp. Unterstützt werden "w8a8", "w4a16", "w8a16", "w4a8", "w16a16i" und "w16a16i_dfp". Standardwert: "w8a8".<br>- w8a8: Gewichte und Aktivierungen mit asymmetrischer 8-Bit-Quantisierung. (RK2118 wird nicht unterstützt.)<br>- w4a16: Gewichte mit asymmetrischer 4-Bit-Quantisierung, Aktivierungen mit 16-Bit-Gleitkommapräzision. (Nur RK3576/RV1126B.)<br>- w8a16: Gewichte mit asymmetrischer 8-Bit-Quantisierung, Aktivierungen mit 16-Bit-Gleitkommapräzision. (Nur RK3562.)<br>- w4a8: Gewichte mit asymmetrischer 4-Bit-, Aktivierungen mit asymmetrischer 8-Bit-Quantisierung. (Noch nicht unterstützt.)<br>- w16a16i: Gewichte und Aktivierungen mit asymmetrischer 16-Bit-Quantisierung. (Nur RV1103/RV1106.)<br>- w16a16i_dfp: Gewichte und Aktivierungen mit dynamischer 16-Bit-Festkommaquantisierung. (Nur RV1103/RV1106.) |
| Parameter | quantized_algorithm: Algorithmus zur Berechnung der Quantisierungsparameter jedes Layers. Unterstützt werden normal, mmse, kl_divergence und gdq. Standardwert: normal.<br>normal ist schnell. Empfohlen werden gewöhnlich etwa 20-100 Quantisierungsdaten; mehr Daten verbessern die Genauigkeit möglicherweise nicht weiter.<br>mmse ist wegen seines iterativen Durchprobierens langsamer, erreicht jedoch meist eine höhere Genauigkeit als normal. Empfohlen werden etwa 20-50 Daten. Je nach Quantisierungsdauer kann ihre Anzahl entsprechend erhöht oder verringert werden.<br>kl_divergence benötigt mehr Zeit als normal, aber deutlich weniger als mmse. In manchen Szenarien, etwa bei ungleichmäßiger Merkmalsverteilung, erzielt kl_divergence bessere Ergebnisse. Empfohlen werden etwa 20-100 Daten.<br>gdq gilt nur für w4a16 und w8a16 und kann deren Gewichtsgenauigkeit wirksam verbessern. Empfohlen werden mehr als 200 Daten. |
| Parameter | quantized_method: Unterstützt werden layer, channel und group{SIZE}. Standardwert: channel.<br>- layer: Jedes Gewicht besitzt nur einen Satz Quantisierungsparameter.<br>- channel: Jeder Gewichtskanal besitzt einen eigenen Satz Quantisierungsparameter. channel ist meist genauer als layer.<br>- group{SIZE}: Aufbauend auf channel werden die Gewichte jedes Ausgabekanals entlang des Eingabekanals entsprechend {SIZE} in mehrere Gruppen unterteilt. Jede Gruppe besitzt einen Parametersatz. group{SIZE} ist gewöhnlich genauer als channel. {SIZE} ist ein Vielfaches von 32 zwischen 32 und 256, etwa 'group32' oder 'group128'. group{SIZE} gilt derzeit nur bei quantized_dtype = w4a16. |
| Parameter | float_dtype: Datentyp für Gleitkommadaten im nicht quantisierten Fall. Unterstützt wird float16. Standardwert: float16. |
| Parameter | optimization_level: Optimierungsstufe des Modells. Standardwert: 3.<br>Damit lassen sich einige oder alle bei der Konvertierung verwendeten Optimierungsregeln deaktivieren. Bei 3 sind alle Optimierungen eingeschaltet. Bei 2 oder 1 werden einige Optionen deaktiviert, die die Genauigkeit bestimmter Modelle beeinflussen können. Bei 0 werden alle Optimierungen ausgeschaltet. |
| Parameter | target_platform: Ziel-Chipplattform des RKNN-Modells. Unterstützt werden 'rv1103', 'rv1103b', 'rv1106', 'rv1106b', 'rv1126b', 'rk2118', 'rk3562', 'rk3566', 'rk3568', 'rk3576' und 'rk3588'. Standardwert: None. |
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
| Rückgabewert | None. |

<!-- source: EN PDF p10; unit 47 -->

Beispielcode:

<!-- source: EN PDF p10; unit 48 -->

```text
# model config
rknn.config(mean_values=[[103.94, 116.78, 123.68]],
     std_values=[[58.82, 58.82, 58.82]],
     quant_img_RGB2BGR=True,
     target_platform='rk3566')
```

<!-- source: EN PDF p10; unit 49 -->

### 2.3 Modell laden

<!-- source: EN PDF p10; unit 50 -->

RKNN-Toolkit2 unterstützt das Laden noch nicht in RKNN umgewandelter Modelle aus Caffe, TensorFlow, TensorFlow Lite, ONNX, DarkNet und PyTorch. Je Format bestehen unterschiedliche, nachfolgend beschriebene Schnittstellen.

<!-- source: EN PDF p10; unit 51 -->

#### 2.3.1 Caffe-Modell laden

<!-- source: EN PDF p10; unit 52 -->

| API | load_caffe |
| --- | --- |
| Beschreibung | Caffe-Modell laden. (Unter ARM64 nicht verfügbar.) |
| Parameter | model: Pfad zur Caffe-Modellstrukturdatei (Endung ".prototxt"). |
| Parameter | blobs: Pfad zur binären Caffe-Modelldatei (Endung ".caffemodel"). |
| Parameter | input_name: Bei mehreren Eingaben des Caffe-Modells kann hier die Reihenfolge der Eingabeschichtnamen festgelegt werden, beispielsweise ['input1','input2','input3']. Die Namen müssen mit den Modelleingaben übereinstimmen. Standardwert: None; die Reihenfolge wird dann automatisch aus der Caffe-Modelldatei mit Endung .prototxt übernommen. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source: EN PDF p11; unit 54 -->

Beispielcode:

<!-- source: EN PDF p11; unit 55 -->

```text
# Load the mobilenet_v2 Caffe model in the current path
ret = rknn.load_caffe(model='./mobilenet_v2.prototxt',
          blobs='./mobilenet_v2.caffemodel')
```

<!-- source: EN PDF p11; unit 56 -->

#### 2.3.2 TensorFlow-Modell laden

<!-- source: EN PDF p11; unit 57 -->

| API | load_tensorflow |
| --- | --- |
| Beschreibung | TensorFlow-Modell laden. (Unter ARM64 nicht verfügbar.) |
| Parameter | tf_pb: Pfad zur TensorFlow-Modelldatei (Endung ".pb"). |
| Parameter | inputs: Eingabeknoten des Modells (Operandennamen); mehrere Knoten werden unterstützt. Alle Zeichenfolgen der Eingabeknoten werden in einer Liste abgelegt. |
| Parameter | input_size_list: Formen der Eingabeknoten, gemeinsam in einer Liste. Für das Modell ssd_mobilenet_v1 muss input_size_list beispielsweise auf [[1,300,300,3]] gesetzt werden. |
| Parameter | outputs: Ausgabeknoten des Modells (Operandennamen); mehrere Knoten werden unterstützt. Alle Ausgabeknoten werden in einer Liste abgelegt. |
| Parameter | input_is_nchw: Gibt an, ob die Modelleingabe bereits im NCHW-Layout vorliegt. Standardwert: False; das Standardlayout ist damit NHWC. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source: EN PDF p11; unit 58 -->

Beispielcode:

<!-- source: EN PDF p11; unit 59 -->

```text
# Load ssd_mobilenet_v1_coco_2017_11_17 TF model in the current path
ret = rknn.load_tensorflow(tf_pb='./ssd_mobilenet_v1_coco_2017_11_17.pb',
            inputs=['Preprocessor/sub'],
            outputs=['concat', 'concat_1'],
            input_size_list=[[300, 300, 3]])
```

<!-- source: EN PDF p12; unit 60 -->

#### 2.3.3 TensorFlow Lite-Modell laden

<!-- source: EN PDF p12; unit 61 -->

| API | load_tflite |
| --- | --- |
| Beschreibung | TensorFlow-Lite-Modell laden. (Unter ARM64 nicht verfügbar.) |
| Parameter | model: Pfad zur TensorFlow-Lite-Modelldatei (Endung ".tflite"). |
| Parameter | input_is_nchw: Gibt an, ob die Modelleingabe bereits im NCHW-Layout vorliegt. Standardwert: False; das Standardlayout ist damit NHWC. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source: EN PDF p12; unit 62 -->

Beispielcode:

<!-- source: EN PDF p12; unit 63 -->

```text
# Load the mobilenet_v1 TF-Lite model in the current path
ret = rknn.load_tflite(model='./mobilenet_v1.tflite')
```

<!-- source: EN PDF p12; unit 64 -->

#### 2.3.4 ONNX-Modell laden

<!-- source: EN PDF p12; unit 65 -->

| API | load_onnx |
| --- | --- |
| Beschreibung | ONNX-Modell laden. |
| Parameter | model: Pfad zur ONNX-Modelldatei (Endung ".onnx"). |
| Parameter | inputs: Eingabeknoten des Modells (Operandennamen); mehrere Knoten werden unterstützt. Alle Zeichenfolgen der Eingabeknoten werden in einer Liste abgelegt. Standardwert: None; die Knoten werden aus dem Modell übernommen. |
| Parameter | input_size_list: Formen der Eingabeknoten, gemeinsam in einer Liste. Wenn inputs gesetzt wird, muss auch input_size_list gesetzt werden. Standardwert: None. |
| Parameter | input_initial_val: Anfangswerte der Modelleingaben als ndarray-Liste. Standardwert: None.<br>Hauptsächlich dazu gedacht, einige Eingaben als Konstanten festzulegen. Eingaben, die nicht konstant sein sollen, können auf None gesetzt werden, etwa [None, np.array([1])]. |
| Parameter | outputs: Ausgabeknoten des Modells (Operandennamen); mehrere Knoten werden unterstützt. Alle Ausgabeknoten werden in einer Liste abgelegt. Standardwert: None; sie werden aus dem Modell übernommen. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source: EN PDF p12; unit 66 -->

Beispielcode:

<!-- source: EN PDF p13; unit 67 -->

```text
# Load the arcface onnx model in the current path
ret = rknn.load_onnx(model='./arcface.onnx')
```

<!-- source: EN PDF p13; unit 68 -->

#### 2.3.5 DarkNet-Modell laden

<!-- source: EN PDF p13; unit 69 -->

| API | load_darknet |
| --- | --- |
| Beschreibung | DarkNet-Modell laden. (Unter ARM64 nicht verfügbar.) |
| Parameter | model: Pfad zur DarkNet-Modellstrukturdatei (Endung ".cfg"). |
| Parameter | weight: Pfad zur Gewichtsdatei (Endung ".weight"). |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source: EN PDF p13; unit 70 -->

Beispielcode:

<!-- source: EN PDF p13; unit 71 -->

```text
# Load the yolov3-tiny DarkNet model in the current path
ret = rknn.load_darknet(model='./yolov3-tiny.cfg',
           weight= './yolov3.weights')
```

<!-- source: EN PDF p13; unit 72 -->

#### 2.3.6 PyTorch-Modell laden

<!-- source: EN PDF p13; unit 73 -->

| API | load_pytorch |
| --- | --- |
| Beschreibung | PyTorch-Modell laden.<br>Modelle mit quantisierungsbewusstem Training (Quantization Aware Training, QAT) werden unterstützt; dafür muss torch auf Version '1.9.0' oder höher aktualisiert werden. |
| Parameter | model: Pfad zur PyTorch-Modellstrukturdatei (Endung ".pt"); erforderlich ist ein Modell im torchscript-Format. |
| Parameter | input_size_list: Formen der Eingabeknoten, gemeinsam in einer Liste. |
| Rückgabewert | 0: Import erfolgreich. |
| Rückgabewert | -1: Import fehlgeschlagen. |

<!-- source: EN PDF p13; unit 74 -->

Beispielcode:

<!-- source: EN PDF p13; unit 75 -->

```text
# Load the PyTorch model resnet18 in the current path
ret = rknn.load_pytorch(model='./resnet18.pt',
           input_size_list=[[1,3,224,224]])
```

<!-- source: EN PDF p14; unit 76 -->

### 2.4 RKNN-Modell erstellen

<!-- source: EN PDF p14; unit 77 -->

| API | build |
| --- | --- |
| Beschreibung | Aus dem importierten Modell das entsprechende RKNN-Modell erstellen. |
| Parameter | do_quantization: Gibt an, ob das Modell quantisiert werden soll. Standardwert: True. |
| Parameter | dataset: Eingabedatensatz zur Kalibrierung der Quantisierungsparameter. Unterstützt wird eine Textdatei, in der Pfade zu Kalibrierungsbildern (jpg oder png) oder npy-Dateien stehen. Pro Zeile ein Pfad, beispielsweise:<br>a.jpg<br>b.jpg<br>oder<br>a.npy<br>b.npy<br>Bei mehreren Eingaben werden die zugehörigen Dateien durch Leerzeichen getrennt, etwa:<br>a.jpg a2.jpg<br>b.jpg b2.jpg<br>oder<br>a.npy a2.npy<br>b.npy b2.npy<br>Hinweis: Im Allgemeinen sollten die Quantisierungsbilder dem späteren Vorhersageszenario entsprechen. |
| Parameter | rknn_batch_size: Passt die Batch-Größe der Eingabe an. Standardwert: None.<br>Bei Werten größer als 1 kann die NPU mehrere Eingabebilder oder Datensätze in einem Inferenzlauf verarbeiten. Beispielsweise hat MobileNet ursprünglich die Eingabeform [1, 224, 224, 3] und Ausgabeform [1, 1001]. Bei rknn_batch_size = 4 werden daraus [4, 224, 224, 3] und [4, 1001].<br>Hinweise:<br>1. rknn_batch_size verbessert die Leistung (Kernauslastung) nur auf NPU-Mehrkernplattformen. Der Wert sollte daher der Anzahl der NPU-Kerne entsprechen.<br>2. Eine Änderung von rknn_batch_size verändert die Eingabe- und Ausgabeformen. Die Eingaben für inference müssen die richtige Größe besitzen; auch die zurückgegebenen Ausgaben sind in der Nachverarbeitung entsprechend zu behandeln. |
| Parameter | auto_hybrid: Aktiviert die automatische gemischte Quantisierung zur Anpassung der Genauigkeit oder Behandlung von Überläufen. Standardwert: False, also keine Anpassung. Während der Modellquantisierung wandelt auto_hybrid Operationen, deren Kosinusabstand und euklidischer Abstand unter den festgelegten Schwellenwerten liegen, in FP16-Berechnungen um (derzeit nur bei 'w8a8'-Quantisierung unterstützt). Wird das Modell nicht quantisiert, wandelt auto_hybrid Operationen außerhalb des FP16-Wertebereichs in INT16-Berechnungen um.<br>Hinweis:<br>1. Die Schwellenwerte lassen sich über auto_hybrid_cos_thresh und auto_hybrid_euc_thresh der Schnittstelle config festlegen. |
| Rückgabewert | 0: Erstellung erfolgreich. |
| Rückgabewert | -1: Erstellung fehlgeschlagen. |

<!-- source: EN PDF p15; unit 79 -->

Beispielcode:

<!-- source: EN PDF p15; unit 80 -->

```text
# Build and quantize RKNN model
ret = rknn.build(do_quantization=True, dataset='./dataset.txt')
```

<!-- source: EN PDF p15; unit 81 -->

### 2.5 RKNN-Modell exportieren

<!-- source: EN PDF p15; unit 82 -->

Das über build erstellte RKNN-Modell kann zur Bereitstellung in einer Datei gespeichert werden.

<!-- source: EN PDF p15; unit 83 -->

| API | export_rknn |
| --- | --- |
| Beschreibung | RKNN-Modell in der angegebenen Datei speichern (Endung ".rknn"). |
| Parameter | export_path: Pfad zur erzeugten RKNN-Modelldatei. |
| Rückgabewert | 0: Export erfolgreich. |
| Rückgabewert | -1: Export fehlgeschlagen. |

<!-- source: EN PDF p15; unit 84 -->

Beispielcode:

<!-- source: EN PDF p15; unit 85 -->

```text
# save the built RKNN model as a mobilenet_v1.rknn file in the current path
ret = rknn.export_rknn(export_path='./mobilenet_v1.rknn')
```

<!-- source: EN PDF p15; unit 86 -->

### 2.6 RKNN-Modell laden

<!-- source: EN PDF p15; unit 87 -->

| API | load_rknn |
| --- | --- |
| Beschreibung | RKNN-Modell laden.<br>Danach entfallen Modellkonfiguration, Laden des ursprünglichen Modells und Erstellen des RKNN-Modells. Das geladene Modell kann nur mit angeschlossener NPU-Hardware für Inferenz oder Leistungsmessdaten verwendet werden, nicht für Simulator oder Genauigkeitsanalyse. |
| Parameter | path: Pfad zur RKNN-Modelldatei. |
| Rückgabewert | 0: Laden erfolgreich. |
| Rückgabewert | -1: Laden fehlgeschlagen. |

<!-- source: EN PDF p15; unit 88 -->

Beispielcode:

<!-- source: EN PDF p16; unit 89 -->

```text
# Load the mobilenet_v1 RKNN model in the current path
ret = rknn.load_rknn(path='./mobilenet_v1.rknn')
```

<!-- source: EN PDF p16; unit 90 -->

### 2.7 Laufzeitumgebung initialisieren

<!-- source: EN PDF p16; unit 91 -->

Vor Inferenz oder Leistungsbewertung die Laufzeitumgebung initialisieren. Diese Schnittstelle legt deren Typ fest: Hardwareplattform oder Softwaresimulator.

<!-- source: EN PDF p16; unit 92 -->

| API | init_runtime |
| --- | --- |
| Beschreibung | Laufzeitumgebung initialisieren. |
| Parameter | target: Ziel-Hardwareplattform. Unterstützt werden 'rv1103', 'rv1103b', 'rv1106', 'rv1106b', 'rv1126b', 'rk3562', 'rk3566', 'rk3568', 'rk3576' und 'rk3588'. Standardwert: "None"; das Modell läuft damit im Simulator.<br>Hinweis: Bei target = None muss zuerst build oder hybrid_quantization aufgerufen werden. |
| Parameter | device_id: Gerätekennung. Wenn mehrere Geräte am PC angeschlossen sind, muss dieser Parameter angegeben werden. Er lässt sich über list_devices ermitteln. Standardwert: None. |
| Parameter | perf_debug: Debug-Modus für die Leistungsbewertung. Damit lässt sich die Laufzeit jedes Layers ermitteln; andernfalls wird nur die Gesamtlaufzeit des Modells ausgegeben. Standardwert: False. |
| Parameter | eval_mem: Aktiviert den Speicherbewertungsmodus. Bei True kann anschließend eval_memory aufgerufen werden, um den Speicherverbrauch während der Modellausführung zu ermitteln. Standardwert: False. |
| Parameter | async_mode: Gibt an, ob der asynchrone Modus verwendet werden soll. Standardwert: False.<br>inference umfasst das Setzen des Eingabebildes, die Modellausführung und das Abholen des Ergebnisses. Im asynchronen Modus erfolgt das Setzen der aktuellen Eingabe gleichzeitig mit der Inferenz des vorherigen Frames. Mit Ausnahme des ersten Frames lässt sich dadurch die Eingabevorbereitung jedes weiteren Frames überlappen, was die Leistung verbessert. Das jeweils zurückgegebene Ergebnis gehört zum vorherigen Frame. (Noch nicht unterstützt.) |
| Parameter | core_mask: Legt die NPU-Kerne zur Laufzeit fest. Unterstützt werden RK3588 / RK3576 mit folgenden Konfigurationen:<br>RKNN.NPU_CORE_AUTO: automatische Planung; das Modell läuft auf einem aktuell freien NPU-Kern.<br>RKNN.NPU_CORE_0: Ausführung auf NPU0.<br>RKNN.NPU_CORE_1: Ausführung auf NPU1.<br>RKNN.NPU_CORE_2: Ausführung auf NPU2.<br>RKNN.NPU_CORE_0_1: gleichzeitige Ausführung auf NPU0 und NPU1.<br>RKNN.NPU_CORE_0_1_2: gleichzeitige Ausführung auf NPU0, NPU1 und NPU2.<br>RKNN.NPU_CORE_ALL: Die Anzahl verwendeter NPU-Kerne hängt von der Plattform ab.<br>Standardwert: "RKNN.NPU_CORE_AUTO".<br>Hinweis: RK3576 besitzt nur 2 Kerne; NPU_CORE_2 und NPU_CORE_0_1_2 dürfen daher nicht gesetzt werden. |
| Parameter | fallback_prior_device: Bevorzugtes Ausweichgerät für eine von der NPU nicht unterstützte OP. Unterstützt werden 'gpu' und 'cpu'; 'gpu' gilt nur für Plattformen mit GPU-Hardware. Standardwert: 'cpu'. |
| Rückgabewert | 0: Laufzeitumgebung erfolgreich initialisiert. |
| Rückgabewert | -1: Initialisierung der Laufzeitumgebung fehlgeschlagen. |

<!-- source: EN PDF p17; unit 94 -->

Beispielcode:

<!-- source: EN PDF p17; unit 95 -->

```text
# Initialize the runtime environment
ret = rknn.init_runtime(target='rk3566')
```

<!-- source: EN PDF p17; unit 96 -->

### 2.8 Inferenz mit dem RKNN-Modell

<!-- source: EN PDF p17; unit 97 -->

Diese Schnittstelle startet die RKNN-Modellinferenz und liefert deren Ergebnis.

<!-- source: EN PDF p17; unit 98 -->

| API | inference |
| --- | --- |
| Beschreibung | Mit dem Modell und den angegebenen Eingaben eine Inferenz durchführen und das Ergebnis abrufen.<br>Wenn bei der Initialisierung target auf Rockchip NPU gesetzt wurde, erfolgt die Inferenz auf der angegebenen Hardwareplattform. Ohne target wird der Simulator verwendet. |
| Parameter | inputs: Liste der zu inferierenden Eingaben. Der Objekttyp ist ndarray. |
| Parameter | data_format: Liste der Eingabedatenlayouts: "nchw" oder "nhwc"; nur bei 4-dimensionalen Eingaben wirksam. Standardwert: None; alle Eingaben verwenden dann "nhwc". |
| Parameter | inputs_pass_through: pass_through-Flag. Standardwert: None; für alle Eingaben ist pass_through damit deaktiviert.<br>Ohne pass_through zieht das Werkzeug vor der Übergabe an den NPU-Treiber den Mittelwert ab, dividiert durch die Varianz usw.; mit pass_through entfallen diese Operationen.<br>Der Parameter ist eine Liste. Soll beispielsweise input0 direkt durchgereicht werden, input1 jedoch nicht, lautet der Wert [1, 0]. |
| Rückgabewert | results: Inferenzergebnis als ndarray-Liste. |

<!-- source: EN PDF p18; unit 100 -->

Beispielcode:

<!-- source: EN PDF p18; unit 101 -->

Für ein Klassifikationsmodell wie mobilenet_v1 folgt dieser Code; der vollständige Code wird in der Quelle unter example/tfilte/mobilenet_v1 angegeben. Die Schreibweise tfilte bleibt als Quellangabe erhalten.

<!-- source: EN PDF p18; unit 102 -->

```text
# Preform inference for a picture with a model and get a top-5 result
outputs = rknn.inference(inputs=[img])
show_outputs(outputs)
```

<!-- source: EN PDF p18; unit 103 -->

Beispielergebnis für top-5:

<!-- source: EN PDF p18; unit 104 -->

```text
-----TOP 5-----
[ 156] score:0.928223 class:"Shih-Tzu"
[ 155] score:0.063171 class:"Pekinese, Pekingese, Peke"
[ 205] score:0.004299 class:"Lhasa, Lhasa apso"
[ 284] score:0.003096 class:"Persian cat"
[ 285] score:0.000171 class:"Siamese cat, Siamese"
```

<!-- source: EN PDF p18; unit 105 -->

### 2.9 Modellleistung bewerten

<!-- source: EN PDF p18; unit 106 -->

| API | eval_perf |
| --- | --- |
| Beschreibung | Modellleistung bewerten.<br>Das Modell muss auf einem mit dem PC verbundenen RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588 laufen. Ist perf_debug bei init_runtime False, enthalten die von der Hardware ermittelten Leistungsdaten nur die Gesamtlaufzeit. Bei perf_debug = True werden zusätzlich die Laufzeiten der einzelnen Layer detailliert erfasst. |
| Parameter | is_print: Gibt an, ob Leistungsdaten ausgegeben werden. Standardwert: True. |
| Parameter | fix_freq: Gibt an, ob die Hardwarefrequenz festgehalten wird. Standardwert: True. |
| Rückgabewert | perf_result: Leistungsinformationen (Zeichenfolgen). |

<!-- source: EN PDF p18; unit 107 -->

Beispielcode:

<!-- source: EN PDF p19; unit 108 -->

```text
# Evaluate model performance
perf_detail = rknn.eval_perf()
```

<!-- source: EN PDF p19; unit 109 -->

### 2.10 Speicherbedarf bewerten

<!-- source: EN PDF p19; unit 110 -->

| API | eval_memory |
| --- | --- |
| Beschreibung | Speicherverbrauch bei der Modellausführung auf der Hardwareplattform ermitteln.<br>Das Modell muss auf einem mit dem PC verbundenen RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588 laufen. |
| Parameter | is_print: Gibt an, ob die Speicherbewertung im Standardformat ausgegeben wird. Standardwert: True. |
| Rückgabewert | memory_detail: Detaillierte Speicherverbrauchsdaten als Dictionary.<br>Beispiel:<br>{<br>'weight_memory': 3698688,<br>'internal_memory': 1756160,<br>'other_memory': 484352,<br>'total_memory': 5939200,<br>}<br>- 'weight_memory' bezeichnet den Speicherbedarf der Modellgewichte.<br>- 'internal_memory' bezeichnet den Speicherverbrauch der internen Tensoren.<br>- 'other_memory' bezeichnet den Speicherverbrauch anderer Tensoren.<br>- 'total_memory' bezeichnet den gesamten Modellspeicherbedarf, also die Summe aus Gewichten, internen Tensoren und sonstigem Speicher. |

<!-- source: EN PDF p19; unit 111 -->

Beispielcode:

<!-- source: EN PDF p19; unit 112 -->

```text
# eval memory usage
memory_detail = rknn.eval_memory()
```

<!-- source: EN PDF p19; unit 113 -->

Für das Beispiel examples/caffe/mobilenet_v2 zeigt die Quelle folgende Speicherbelegung auf RK3588. Dies sind Originalwerte, keine ArmSoM-Messungen.

<!-- source: EN PDF p19; unit 114 -->

```text
======================================================
     Memory Profile Info Dump
======================================================
NPU model memory detail(bytes):
  Weight Memory: 3.53 MiB
  Internal Tensor Memory: 1.67 MiB
  Other Memory: 473.00 KiB
  Total Memory: 5.66 MiB

INFO: When evaluating memory usage, we need consider
the size of model, current model size is: 4.09 MiB
======================================================
```

<!-- source: EN PDF p20; unit 115 -->

### 2.11 SDK-Version abfragen

<!-- source: EN PDF p20; unit 116 -->

| API | get_sdk_version |
| --- | --- |
| Beschreibung | API- und Treiberversion des verwendeten SDK abrufen.<br>Hinweis: Vorher müssen das Modell geladen und die Laufzeitumgebung initialisiert werden. Die API ist nur auf RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588 nutzbar. |
| Parameter | None. |
| Rückgabewert | sdk_version: API- und Treiberversion. Datentyp: Zeichenfolge. |

<!-- source: EN PDF p20; unit 117 -->

Beispielcode:

<!-- source: EN PDF p20; unit 118 -->

```text
# Get SDK version
sdk_version = rknn.get_sdk_version()
print(sdk_version)
```

<!-- source: EN PDF p20; unit 119 -->

Beispielausgabe der SDK-Version:

<!-- source: EN PDF p20; unit 120 -->

```text
==============================================
RKNN VERSION:
  API: 1.5.2 (8babfea build@2023-08-25T02:31:12)
  DRV: rknn_server: 1.5.2 (8babfea build@2023-08-25T10:30:12)
  DRV: rknnrt: 1.5.3b13 (42cbca6f5@2023-10-27T10:13:21)
==============================================
```

<!-- source: EN PDF p20; unit 121 -->

### 2.12 Gemischte Quantisierung

<!-- source: EN PDF p20; unit 122 -->

#### 2.12.1 hybrid_quantization_step1

<!-- source: EN PDF p20; unit 123 -->

Die erste Phase der gemischten Quantisierung verwendet hybrid_quantization_step1. Er erzeugt eine temporäre Modelldatei (&lt;model_name&gt;.model), eine Datendatei (&lt;model_name&gt;.data) und die Quantisierungskonfiguration (&lt;model_name&gt;.quantization.cfg). Schnittstellendetails:

<!-- source: EN PDF p20; unit 124 -->

| API | hybrid_quantization_step1 |
| --- | --- |
| Beschreibung | Aus dem geladenen ursprünglichen Modell werden entsprechende temporäre Modelldateien, Datendateien und Quantisierungskonfigurationen erzeugt. |
| Parameter | dataset: Siehe 2.4 „RKNN-Modell erstellen“. |
| Parameter | rknn_batch_size: Siehe 2.4 „RKNN-Modell erstellen“. |
| Parameter | proposal: Erzeugt Konfigurationsvorschläge für gemischte Quantisierung. Standardwert: False. |
| Parameter | proposal_dataset_size: Größe des für proposal verwendeten Datensatzes. Standardwert: 1. Da proposal zeitaufwendig ist, beträgt die voreingestellte Größe 1. |
| Parameter | custom_hybrid: Wählt den Teilgraphen für gemischte Quantisierung anhand mehrerer vom Benutzer vorgegebener Eingabe-/Ausgabenamenpaare aus. Format: [[input0_name, output0_name], [input1_name, output1_name], …]. Standardwert: None.<br>Hinweis: Die Namen sind anhand der temporären Modelldatei (&lt;model_name&gt;.model) auszuwählen. |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source: EN PDF p21; unit 126 -->

Beispielcode:

<!-- source: EN PDF p21; unit 127 -->

```text
# Call hybrid_quantization_step1 to generate quantization config
ret = rknn.hybrid_quantization_step1(dataset='./dataset.txt')
```

<!-- source: EN PDF p21; unit 128 -->

#### 2.12.2 hybrid_quantization_step2

<!-- source: EN PDF p21; unit 129 -->

Zur Erzeugung des gemischt quantisierten RKNN-Modells wird hybrid_quantization_step2 aufgerufen. Schnittstellendetails:

<!-- source: EN PDF p21; unit 130 -->

| API | hybrid_quantization_step2 |
| --- | --- |
| Beschreibung | Nimmt die temporäre Modelldatei, Datendatei, Quantisierungskonfiguration und den Kalibrierdatensatz entgegen und erzeugt daraus ein gemischt quantisiertes RKNN-Modell. |
| Parameter | model_input: Pfad zur von hybrid_quantization_step1 erzeugten temporären Modelldatei (&lt;model_name&gt;.model). |
| Parameter | data_input: Pfad zur von hybrid_quantization_step1 erzeugten Modelldatendatei (&lt;model_name&gt;.data). |
| Parameter | model_quantization_cfg: Pfad zur bearbeiteten, von hybrid_quantization_step1 erzeugten Quantisierungskonfigurationsdatei (&lt;model_name&gt;.quantization.cfg). |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source: EN PDF p21; unit 131 -->

Beispielcode:

<!-- source: EN PDF p21; unit 132 -->

```text
# Call hybrid_quantization_step2 to generate hybrid quantized RKNN model
ret = rknn.hybrid_quantization_step2(
       model_input='./ssd_mobilenet_v2.model',
       data_input='./ssd_mobilenet_v2.data',
       model_quantization_cfg='./ssd_mobilenet_v2.quantization.cfg')
```

<!-- source: EN PDF p22; unit 133 -->

### 2.13 Quantisierungsgenauigkeit analysieren

<!-- source: EN PDF p22; unit 134 -->

Diese Schnittstelle führt die Inferenz mit dem quantisierten Modell aus und erzeugt die Ausgaben jeder Schicht zur Analyse der Quantisierungsgenauigkeit.

<!-- source: EN PDF p22; unit 135 -->

| API | accuracy_analysis |
| --- | --- |
| Beschreibung | Mit dem quantisierten Modell eine Inferenz durchführen und einen Snapshot erzeugen, also die Tensordaten jedes Layers ausgeben. Zur Berechnung des Quantisierungsfehlers werden Snapshots beider Datentypen fp32 und quant ausgegeben.<br>Hinweise:<br>1. Die Schnittstelle darf erst nach build oder hybrid_quantization_step2 aufgerufen werden.<br>2. Ist target None und das ursprüngliche Modell bereits quantisiert (QAT-Modell), schlägt der Aufruf fehl.<br>3. Das Quantisierungsverfahren entspricht der Einstellung in config. |
| Parameter | inputs: Liste der Bildpfade (jpg/png/bmp/npy). |
| Parameter | output_dir: Ausgabeverzeichnis für sämtliche Snapshot-Daten. Standardwert: './snapshot'.<br>Ohne target werden in output_dir folgende Inhalte erzeugt:<br>- Verzeichnis simulator: Ergebnisse jedes Layers im Simulator bei vollständiger Ausführung des quantisierten Modells (die Ausgabe wurde in float32 konvertiert).<br>- Verzeichnis golden: Ergebnisse jedes Layers im Simulator bei vollständiger Ausführung des Gleitkommamodells.<br>- error_analysis.txt: Kosinusabstand (entire_error und single_error) zwischen den Layer-Ergebnissen des quantisierten Modells im Simulator und dem Gleitkommamodell im Simulator während der vollständigen Berechnung des quantisierten Modells. entire_error/single_error unterscheiden sich darin, ob die Eingabe des jeweiligen Layers aus dem quantisierten Modell oder dem Gleitkommamodell stammt. Weitere Details stehen in error_analysis.txt.<br>Mit target werden zusätzliche Inhalte in output_dir erzeugt:<br>- Verzeichnis runtime: Ergebnisse jedes Layers bei vollständiger Ausführung des quantisierten Modells auf der NPU (die Ausgabe wurde in float32 konvertiert).<br>- error_analysis.txt: zusätzlich der Kosinusabstand (entire_error) zwischen den Layer-Ergebnissen im Simulator und auf der NPU während der vollständigen Berechnung des quantisierten Modells. Weitere Details stehen in error_analysis.txt. |
| Parameter | target: Ziel-Hardwareplattform. Unterstützt werden 'rv1103', 'rv1103b', 'rv1106', 'rv1106b', 'rv1126b', 'rk3562', 'rk3566', 'rk3568', 'rk3576' und 'rk3588'. Standardwert: "None".<br>Bei gesetztem target werden die Ausgaben jedes NPU-Layers ermittelt und auf Genauigkeit analysiert. |
| Parameter | device_id: Gerätekennung. Bei mehreren am PC angeschlossenen Geräten muss sie angegeben werden; der Wert wird über list_devices ermittelt. Standardwert: "None ". |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source: EN PDF p23; unit 136 -->

Beispielcode:

<!-- source: EN PDF p23; unit 137 -->

```text
# Accuracy analysis
ret = rknn.accuracy_analysis(inputs=['./dog_224x224.jpg'])
```

<!-- source: EN PDF p23; unit 138 -->

### 2.14 Geräte auflisten

<!-- source: EN PDF p23; unit 139 -->

| API | list_devices |
| --- | --- |
| Beschreibung | Angeschlossene RV1103 / RV1103B / RV1106 / RV1106B / RV1126B / RK3562 / RK3566 / RK3568 / RK3576 / RK3588 auflisten.<br>Hinweis: Es gibt zwei Geräteverbindungsmodi, ADB und NTB. Bei mehreren Geräten müssen die Modi übereinstimmen. |
| Parameter | None. |
| Rückgabewert | Gibt die Listen adb_devices und ntb_devices zurück. Wenn keine Geräte am PC angeschlossen sind, werden zwei leere Listen zurückgegeben. |

<!-- source: EN PDF p23; unit 140 -->

Beispielcode:

<!-- source: EN PDF p23; unit 141 -->

```text
rknn.list_devices()
```

<!-- source: EN PDF p23; unit 142 -->

Beispielgeräteliste:

<!-- source: EN PDF p23; unit 143 -->

```text
*************************
all device(s) with adb mode:
VD46C3KM6N
*************************
```

<!-- source: EN PDF p23; unit 144 -->

### 2.15 Verschlüsseltes RKNN-Modell exportieren

<!-- source: EN PDF p23; unit 145 -->

Diese Schnittstelle verschlüsselt ein gewöhnliches RKNN-Modell und liefert das verschlüsselte Modell.

<!-- source: EN PDF p23; unit 146 -->

| API | export_encrypted_rknn_model |
| --- | --- |
| Beschreibung | Verschlüsselt das normale RKNN-Modell gemäß der vom Benutzer gewählten Verschlüsselungsstufe.<br>Hinweis: RV1103/RV1103B/RV1106/RV1106B/RK2118 werden noch nicht unterstützt. |
| Parameter | input_model: Pfad zum zu verschlüsselnden RKNN-Modell. |
| Parameter | output_model: Speicherpfad für das verschlüsselte Modell. Standardwert: None; dann wird {original_model_name}.crypt.rknn verwendet. |
| Parameter | crypt_level: Verschlüsselungsstufe. Unterstützt werden 1, 2 oder 3; Standardwert: 1.<br>Je höher die Stufe, desto höher die Sicherheit und desto zeitaufwendiger die Entschlüsselung; bei niedrigerer Stufe sinkt die Sicherheit, die Entschlüsselung wird jedoch schneller. |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source: EN PDF p24; unit 148 -->

Beispielcode:

<!-- source: EN PDF p24; unit 149 -->

```text
ret = rknn.export_encrypted_rknn_model('test.rknn')
```

<!-- source: EN PDF p24; unit 150 -->

### 2.16 Benutzerdefinierten Operator registrieren

<!-- source: EN PDF p24; unit 151 -->

Diese Schnittstelle registriert einen benutzerdefinierten Operator.

<!-- source: EN PDF p24; unit 152 -->

| API | reg_custom_op |
| --- | --- |
| Beschreibung | Benutzerdefinierten Operator registrieren; nur für ONNX-Modelle unterstützt. |
| Parameter | custom_op: Benutzerdefinierte Operatorklasse für einen neuen OP außerhalb der ONNX-OP-Spezifikation. op_type des neuen OP sollte mit 'cst' beginnen; die Funktionen shape_infer und compute müssen vom Benutzer implementiert werden.<br>Hinweis: Die Klasse custom_op dient nur der Modellkonvertierung und Erzeugung von RKNN-Modellen mit benutzerdefinierten Operatoren. Für die Bereitstellung auf dem Gerät ist zusätzlich Kapitel 5.5 des 'RKNN SDK User Guide' zu beachten. |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source: EN PDF p24; unit 153 -->

Beispielcode:

<!-- source: EN PDF p24; unit 154 -->

```text
import numpy as np
from rknn.api.custom_op import get_node_attr
class cstSoftmax:
  op_type = 'cstSoftmax'
  def shape_infer(self, node, in_shapes, in_dtypes):
    out_shapes = in_shapes.copy()
    out_dtypes = in_dtypes.copy()
    return out_shapes, out_dtypes
  def compute(self, node, inputs):
    x = inputs[0]
    axis = get_node_attr(node, 'axis')
    x_max = np.max(x, axis=axis, keepdims=True)
    tmp = np.exp(x - x_max)
    s = np.sum(tmp, axis=axis, keepdims=True)
    outputs = [tmp / s]
    return outputs

ret = rknn.reg_custom_op(cstSoftmax)
```

<!-- source: EN PDF p25; unit 155 -->

### 2.17 C++-Bereitstellungsbeispiel erzeugen

<!-- source: EN PDF p25; unit 156 -->

| API | codegen |
| --- | --- |
| Beschreibung | C++-Bereitstellungsbeispiel erzeugen. |
| Parameter | output_path: Ausgabeverzeichnis; dessen Name kann vom Benutzer festgelegt werden. |
| Parameter | inputs: Liste der Pfade zu den Modelleingaben; sie darf leer bleiben. Gültige Dateiformate sind jpg/png/npy. Bei npy-Eingaben müssen die Datendimensionen mit denen der Modelleingabe übereinstimmen. |
| Parameter | overwrite: Bei True werden die Dateien im Verzeichnis output_path überschrieben. Standardwert: False. |
| Rückgabewert | 0: Erfolgreich. |
| Rückgabewert | -1: Fehlgeschlagen. |

<!-- source: EN PDF p25; unit 157 -->

Beispielcode:

<!-- source: EN PDF p25; unit 158 -->

```text
ret = rknn.codegen(output_path='./rknn_app_demo',
        inputs=['./mobilenet_v2/dog_224x224.jpg'],
        overwrite=True)
```

{% endraw %}
