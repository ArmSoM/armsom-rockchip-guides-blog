---
title: "RKNN Toolkit Lite2 V2.5.0, Teil 3: Modellladen, Verschlüsselung und Runtime-Initialisierung"
description: "RKNN Toolkit Lite2 V2.5.0, Teil 3: Modellladen, Verschlüsselung und Runtime-Initialisierung · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, Teil 3: Modellladen, Verschlüsselung und Runtime-Initialisierung"
translation_key: "rknn-v250-lite-api-loading-runtime"
slug: "rknn-v250-lite-api-loading-runtime"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Plattformreferenz für RKNN Toolkit Lite2 V2.5.0, Debian 10/11/12 aarch64 und die genannten SoCs. Auf ArmSoM SoC, Architektur, Python-Wheel, BSP-NPU-Treiber und Runtime abgleichen. Keine Hardwaretests durchgeführt. Der Verschlüsselungsabschnitt nennt mehr Plattformen als die Lite2-Installationstabelle; beide Listen bleiben erhalten, ohne daraus zusätzliche Lite2-Geräteunterstützung abzuleiten.

Nach den lokalen chinesischen und englischen V2.5.0-Quellen mit ursprünglicher Abschnittsnummerierung. Chinesisch verwendet chinesische Abbildungen, die übrigen Sprachen die der englischen Quelle. PDF-Umbrüche, fortgesetzte Tabellen und Codeeinrückungen wurden wiederhergestellt. Beispielausgaben sind keine ArmSoM-Tests.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN Toolkit Lite2 V2.5.0, Teil 1: Installation, ResNet18 und Rückgabewerte](/de/articles/rknn-v250-lite-api-installation/)

[RKNN Toolkit Lite2 V2.5.0, Teil 2: Lebenszyklus, Eingaben und Ausgabewiederverwendung](/de/articles/rknn-v250-lite-api-programming-model/)

**RKNN Toolkit Lite2 V2.5.0, Teil 3: Modellladen, Verschlüsselung und Runtime-Initialisierung**

[RKNN Toolkit Lite2 V2.5.0, Teil 4: Inferenz-, Geräte- und Versions-APIs](/de/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0, Teil 5: Fehlerprüfung, Core Mask und Protokolle](/de/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 3. Klasse RKNNLite

RKNNLite ist die zentrale Python-Klasse von RKNN Toolkit Lite2: Objektinitialisierung, RKNN-Laden, Geräteauflistung, Runtime-Initialisierung, Inferenz, SDK-Versions- und Modellplattformabfrage sowie Ressourcenfreigabe.

### 3.1 Objekt initialisieren und freigeben

init

| API | RKNNLite(...) |
| --- | --- |
| Funktion | RKNNLite-Objekt initialisieren. verbose und verbose_file steuern ausführliche Protokolle. |
| Parameter | verbose: Legt fest, ob ausführliche Protokolle am Bildschirm erscheinen. |
|  | verbose_file: Protokolldateipfad. Bei gesetztem Pfad und verbose=True werden Protokolle zusätzlich in die Datei geschrieben. |
| Rückgabe | RKNNLite-Objekt. |

Beispiel:

```text
# Show detailed logs on screen and save them to inference.log.
rknn_lite = RKNNLite(
    verbose=True,
    verbose_file='./inference.log'
)

# Only show detailed logs on screen.
rknn_lite = RKNNLite(verbose=True)
```

release

| API | release |
| --- | --- |
| Funktion | RKNNLite-Ressourcen nach Verwendung freigeben. |
| Parameter | Keine |
| Rückgabe | None. |

Beispiel:

```text
rknn_lite.release()
```

Verwendungshinweise:

release() aufrufen, sobald das RKNNLite-Objekt nicht mehr benötigt wird.

Vor der Freigabe Inferenz und zugehörige Abfragen abschließen.

### 3.2 Modell laden und Runtime initialisieren

load_rknn

| API | load_rknn |
| --- | --- |
| Funktion | RKNN-Modell laden. |
| Parameter | path: Pfad der RKNN-Modelldatei. |
|  | key_path: optionaler Pfad zum Schlüsselumschlag eines verschlüsselten Modells. Für RKCE erforderlich, bei unverschlüsselten Modellen weglassbar. |
| Rückgabe | Erfolg: 0; Fehler: -1. |

Beispiel für ein unverschlüsseltes Modell:

```text
# Load resnet_18.rknn from the current directory.
ret = rknn_lite.load_rknn('./resnet_18.rknn')
```

Beispiel für ein verschlüsseltes Modell:

```text
# Load an encrypted model together with its key envelope.
ret = rknn_lite.load_rknn(
    './encrypted_model.rknn',
    key_path='./encrypted_model_key.bin'
)
```

Verwendungshinweise:

load_rknn() vor init_runtime() aufrufen.

Die Datei muss ein mit RKNN Toolkit2 erzeugtes RKNN-Modell sein.

Beschreibung verschlüsselter Modelle:

RKNN Toolkit Lite2 lädt verschlüsselte RKNN-Modelle. Verwendet wird AES-256-CTR + RSA-OAEP: Der Dateikopf enthält RKCE, der Modellkörper ist AES-CTR-verschlüsselt, und der AES-Schlüssel wird per RSA-OAEP in einen RKKE-Schlüsselumschlag verpackt, der zusammen mit dem Modell bereitgestellt wird.

Beim Laden die Schlüsselumschlagdatei über key_path übergeben. rknn_init() erkennt RKCE automatisch und entschlüsselt transparent. Anschließend entspricht der Inferenzablauf dem eines unverschlüsselten Modells.

Verschlüsselung erfolgt auf PC/Server mit dem RKNN-Toolkit2-Werkzeug und dem öffentlichen RK-Schlüssel rk_public_key.pem. Es entstehen zwei zusammengehörige Dateien:

| Datei | Beschreibung |
| --- | --- |
| xxx.rknn | Verschlüsseltes RKNN-Modell: RKCE-Kennung und AES-CTR-verschlüsselter Körper |
| xxx_key.bin | RSA-OAEP-verschlüsselter Schlüsselumschlag, gemeinsam mit dem verschlüsselten Modell bereitgestellt |

Verschlüsselte Modelle werden auf RK3562, den Serien RK3566, RK3568, RK3576, RK3588, RV1126B sowie den Serien RV1103B und RV1106B unterstützt.

Hinweise:

Modell und Schlüsselumschlag müssen als zusammengehöriges Paar verwendet werden; keine Datei darf fehlen.

Der Umschlag enthält Schlüsselmaterial zur Entschlüsselung und muss vor Offenlegung geschützt werden.

Details zu Verfahren und Werkzeug stehen unter „Model Encryption“ im RKNN2 SDK Development Guide.

init_runtime

| API | init_runtime |
| --- | --- |
| Funktion | Runtime-Umgebung initialisieren. Vor der Inferenz erforderlich. |
| Parameter | target: Zielplattform, Standard None. Für die lokale NPU eines aarch64-Geräts normalerweise None belassen. |
|  | device_id: Geräte-ID, Standard None. Nur verwenden, wenn die aktuelle Umgebung Geräteauswahl ausdrücklich unterstützt. |
|  | async_mode: asynchronen Modus aktivieren; Standard False. |
|  | core_mask: NPU-Core-Modus; Standard RKNNLite.NPU_CORE_AUTO. |
| Rückgabe | 0 bei Erfolg; -1 bei fehlenden Voraussetzungen oder fehlgeschlagener Runtime-Initialisierung. |

core_mask kann folgende Konstanten der Klasse RKNNLite verwenden:

| core_mask | Wert | Beschreibung |
| --- | --- | --- |
| RKNNLite.NPU_CORE_AUTO | 0 | Automatischer Modus, Standardwert |
| RKNNLite.NPU_CORE_0 | 1 | Core 0 |
| RKNNLite.NPU_CORE_1 | 2 | Core 1 |
| RKNNLite.NPU_CORE_2 | 4 | Core 2 |
| RKNNLite.NPU_CORE_0_1 | 3 | Kombination Core 0/1 |
| RKNNLite.NPU_CORE_0_1_2 | 7 | Kombination Core 0/1/2; laut aktueller Schnittstellenbeschreibung nur auf RK3588 unterstützt |
| RKNNLite.NPU_CORE_ALL | 0xffff | Alle NPU-Cores |

Im Quellcode ist core_mask als nur für RK3576 / RK3588 gültig vermerkt.

Beispiel:

```text
ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

Verwendungshinweise:

Zuerst load_rknn() aufrufen. Ohne geladenes Modell liefert die API unmittelbar -1.

Eine vorhandene Runtime wird vor erneuter Initialisierung freigegeben.

Bei einer Ausnahme während Runtime-Erstellung, Graphaufbau, Core-Mask-Einstellung oder Versionsprüfung liefert die API -1.

inference() darf erst nach erfolgreichem init_runtime() aufgerufen werden. Auch get_sdk_version() benötigt eine initialisierte Runtime.

{% endraw %}
