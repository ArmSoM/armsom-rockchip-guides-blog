---
title: "RK2118 NPU, Teil 4: Modellkonvertierung, USB-Eingaben und Inferenzergebnisse"
description: "RK2118 NPU, Teil 4: Modellkonvertierung, USB-Eingaben und Inferenzergebnisse · RKNN2 V2.5.0"
excerpt: "RK2118 NPU, Teil 4: Modellkonvertierung, USB-Eingaben und Inferenzergebnisse"
translation_key: "rknn-v250-rk2118-model-demo"
slug: "rknn-v250-rk2118-model-demo"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

Plattformreferenz für RK_EVB1_RK2118G_V20 (RK2118) und das passende RT-Thread SDK. Ein entsprechendes ArmSoM-Board ist nicht bestätigt; die Anleitung nicht direkt auf andere SoCs übertragen. Es werden weder ein geprüfter BSP noch ein Linux-Kernel festgelegt; ArmSoM-Hardwaretests fanden nicht statt.

Quelle: lokale chinesische und englische RKNN2 RK2118 QuickStart V2.5.0; ursprüngliche Abschnittsnummern bleiben erhalten. Chinesisch folgt seiner Quelle, die übrigen Sprachen der englischen. PDF-Zeilenumbrüche in Dateinamen, URLs, Kommentaren und Befehlen wurden zusammengeführt. Abschnitt 5.3 verweist für den RT-Thread-Download auf 3.1; die Schritte stehen tatsächlich in 3.3.1. Docker bindet /rt-thread ein, der spätere Befehl verwendet jedoch den relativen Pfad rt-thread/...; das Arbeitsverzeichnis des Containers prüfen. Diese Abweichung wurde nicht stillschweigend geändert. Protokolle, 45ms und Referenzausgaben stammen aus der Quelle, nicht aus ArmSoM-Tests. Installationsbefehle mit latest oder ohne feste Version garantieren nicht V2.5.0; mit dem tatsächlichen SDK abgleichen.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**RK2118-Einstiegsserie · 4/5**

[RK2118 NPU, Teil 1: Hardware, Anschluss und serielle Konsole](/de/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU, Teil 2: Host-Umgebung und Toolkit2-Installation](/de/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU, Teil 3: RT-Thread und DSP-Firmware](/de/articles/rknn-v250-rk2118-firmware/)

**RK2118 NPU, Teil 4: Modellkonvertierung, USB-Eingaben und Inferenzergebnisse**

[RK2118 NPU, Teil 5: Docker, häufige Fragen und Referenzen](/de/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 4. Beispielprogramme ausführen

Dieses Kapitel zeigt den schnellen Start eines Beispiels auf dem Board. Es besteht aus drei Teilen:

- Einführung in das RKNN SDK

- RKNN-Modellkonvertierung

- NPU Demo verwenden

### 4.1 Einführung in das RKNN SDK

Auf RK2118 übernimmt HIFI4 DSP0 die NPU-Inferenz; CPU0 greift nicht direkt auf die NPU-Hardware zu. Der zugehörige Code gliedert sich in drei Bereiche:

```text
components/hifi4/samples/rk2118/npu_demo/ # DSP0 firmware project
| # (menuconfig: HIFI4 Project → npu Demo)
└── npu_demo_dsp0/
    └── src/rknn_api_test.c # Main test program on the DSP side; runs automatically at boot
components/hifi4/rtt/rknn_dsp_comm/ # CPU0-side service (rknn_demo_server)
                                        # Handshakes with the DSP and provides file I/O
components/hifi4/rtt/dsp_fw/npu_demo/ # DSP firmware for packaging
                                        # (dsp0.bin, updated automatically by the DSP build)
```

Datenfluss zur Laufzeit:

1. Nach dem Systemstart lädt CPU0 die DSP0-Firmware auf DSP0 und startet sie; rknn_demo_server wird auf CPU0 bereit.

2. rknn_api_test.c auf DSP0 führt über IPC einen Handshake mit CPU0 durch und fordert anschließend die Modelldatei check.rknn vom USB-Stick an.

3. DSP0 ruft APIs wie rknn_init und rknn_run auf, um die Inferenz auf der NPU auszuführen.

4. CPU0 schreibt die Inferenzausgabe auf den USB-Stick zurück, damit sie auf dem PC elementweise mit den Referenzdaten verglichen werden kann.

Die Anwendung auf CPU0 ruft die RKNN-APIs nicht direkt auf. Die gesamte Testlogik liegt in der DSP0-Firmware. Bei Änderungen an der Testlogik die DSP-Firmware neu bauen und verpacken; siehe Abschnitt 3.3.3.

### 4.2 Modellkonvertierung

Die Konvertierung eines RKNN-Modells wird am Beispiel MobileNetV1 erläutert.

In rt-thread/components/rknpu/examples/rknn_benchmark/res wechseln und convert.py ausführen. Das Skript konvertiert das ursprüngliche PB-Modell in ein RKNN-Modell:

```text
cd rt-thread/components/rknpu/examples/rknn_benchmark/res
python convert.py
```

Bei erfolgreicher Konvertierung entstehen mobilenetv1.rknn und dog.npy. dog.npy ist die Eingabedatei des Modells.

Hinweis: Vor der Vorbereitung des USB-Sticks mobilenetv1.rknn in check.rknn und dog.npy in input_0.npy umbenennen.

### 4.3 NPU Demo verwenden

Die Verwendung der DSP-basierten NPU Demo wird anhand von npu_demo erklärt.

#### 4.3.1 Startverfahren

Nach dem Flashen startet DSP0 npu_demo automatisch beim Systemstart. Es müssen keine Befehle manuell ausgeführt werden. Die Protokolle über den seriellen Anschluss beobachten; alle Meldungen beginnen mit [DSP0 INFO].

#### 4.3.2 Dateien auf dem USB-Stick vorbereiten

Einen FAT32-formatierten USB-Stick vorbereiten, die Dateien in der folgenden Struktur ablegen und den Stick am Anschluss USB 2.0 HOST einstecken. Das System bindet ihn automatisch unter /udisk ein:

```text
/udisk
└── golden/
    ├── check.rknn # Model file generated in Section 4.2
    └── t0/
        └── <input_tensor_name>.npy # One file for each model input
```

Anforderungen an die Eingabedateien:

- Die Datei muss eine standardkonforme NumPy-.npy-Datei mit Datentyp float32 sein. Die Datenmenge in Byte muss der Anzahl der Eingabeelemente × 4 entsprechen. Die Firmware prüft dies strikt und meldet bei abweichender Größe Input %d size mismatch.

- Der Dateiname muss dem Namen des Modelleingabetensors entsprechen; /, : und . werden durch _ ersetzt. Aus input:0 wird beispielsweise input_0.npy.

- Maßgeblich ist der beim ersten Lauf im seriellen Protokoll ausgegebene Dateiname, etwa load file: /udisk/golden/t0/xxx.npy.

- Die Eingabedatei .npy wird aus RKNN-Toolkit2 als Referenzdatensatz (golden data) exportiert.

#### 4.3.3 Ergebnisse anzeigen

Die Ergebnisse stehen an zwei Stellen bereit:

1. Serielles Protokoll: Ein- und Ausgabeinformationen des Modells, NPU-Inferenzzeit jeder Iteration, Minimum und Maximum des Ausgabetensors sowie jeweils die ersten und letzten 16 Elemente. rknn api test done kennzeichnet den erfolgreichen Abschluss des Tests.

2. USB-Stick: Die vollständige Ausgabe wird als float32 nach /udisk/golden/t0_`<output_tensor_name>`.npy geschrieben, mit denselben Namensregeln wie oben. Sie lässt sich direkt mit NumPy lesen und elementweise mit der Referenzausgabe auf dem PC vergleichen.

Es folgt ein Auszug aus dem MobileNetV1-Messprotokoll der Quelle, kein ArmSoM-Test:

```text
[DSP0 INFO] Read model file success: model_buffer = 0xA016CE80, model_size=...
[DSP0 INFO] index=0, name=input:0, n_dims=4, dims=[1, 224, 224, 3], ...
[DSP0 INFO] fmt=NHWC, w_stride=224, size_with_stride=301056, type=FP16
[DSP0 INFO] load file: /udisk/golden/t0/input_0.npy
[DSP0 INFO] Input 0 size check passed: 602112 bytes
[DSP0 INFO] NPU wait 0: Elapse Time = 45ms.
[DSP0 INFO] [0] MobilenetV1/Logits/SpatialSqueeze:0:
[DSP0 INFO] min = -8.1718752, max = 19.21875
```

Hinweise:

- Für einen Modellwechsel nur check.rknn und die Eingabedateien .npy unter t0/ auf dem USB-Stick ersetzen. Die Firmware muss nicht neu gebaut werden.

- Bei Änderungen der Testlogik, etwa loop_count oder dem Dump-Schalter, die DSP-Firmware neu bauen und verpacken; siehe Abschnitt 3.3.3.

{% endraw %}
