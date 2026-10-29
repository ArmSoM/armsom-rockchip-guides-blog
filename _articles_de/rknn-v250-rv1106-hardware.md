---
title: "RKNN auf RV1103/RV1106, Teil 2: Hardwareanschluss und Geräteprüfung"
description: "RKNN auf RV1103/RV1106, Teil 2: Hardwareanschluss und Geräteprüfung · RKNN2 V2.5.0"
excerpt: "RKNN auf RV1103/RV1106, Teil 2: Hardwareanschluss und Geräteprüfung"
translation_key: "rknn-v250-rv1106-hardware"
slug: "rknn-v250-rv1106-hardware"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RV1103", "RV1106", "Mini Runtime"]
---

Plattformreferenz zum RKNN2-V2.5.0-Einstieg für RV1103/RV1103B/RV1106/RV1106B mit passendem Board-SDK, RKNPU2-Treiber und librknnmrt.so. Ein entsprechendes ArmSoM-Board ist nicht bestätigt. Das Linux-5.10.160-Protokoll und Inferenzausgaben sind Quellenbeispiele, keine ArmSoM-Hardwaretests. Versorgung, Anschlüsse und Treiber mit dem tatsächlichen Board-BSP abgleichen.

Quelle: lokale chinesische und englische V2.5.0-PDFs. Chinesisch verwendet chinesischen Text und Abbildungen, Englisch, Russisch und Deutsch die englische Quelle. Alle technischen Kapitel, Befehle und Tabellen bleiben erhalten; PDF-Zeilenumbrüche und Verzeichniseinrückungen wurden wiederhergestellt. Ein alter Treiber im Beispielprotokoll ist nicht die empfohlene Version; die Empfehlung steht im Text. Downloads und pip-Installationen ohne Versionsbindung mit dem SDK abgleichen.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN auf RV1103/RV1106, Teil 1: Ablauf, Plattformen und Repositorys](/de/articles/rknn-v250-rv1106-deployment-flow/)

**RKNN auf RV1103/RV1106, Teil 2: Hardwareanschluss und Geräteprüfung**

[RKNN auf RV1103/RV1106, Teil 3: Host-Umgebung und Mini Runtime](/de/articles/rknn-v250-rv1106-host-runtime/)

[RKNN auf RV1103/RV1106, Teil 4: YOLOv5, Python und C-Bereitstellung](/de/articles/rknn-v250-rv1106-yolov5/)

[RKNN auf RV1103/RV1106, Teil 5: Docker, Startprobleme und Referenzen](/de/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 2. Hardware anschließen und prüfen

Dieses Kapitel behandelt nur Hardwareanschluss und Geräteerkennung für den ersten Lauf. Sobald der Computer das Board über ADB erkennt, mit Umgebungsinstallation und Modellkonvertierung fortfahren.

### 2.1 Hardwareliste

Für die Beispiele dieses Leitfadens wird folgende Hardware benötigt:

| Hardware | Anzahl |
| --- | --- |
| Ubuntu-Computer | 1 |
| Entwicklungsboard RV1103/RV1103B/RV1106/RV1106B | 1 |
| Micro-USB-Datenkabel | 1 |
| 12V-2A-Netzteil | 1 |

### 2.2 Boards und Verbindungsmittel

RV1103-Evaluierungsboard

![Abbildung der englischen Quelle · PDF 10](/assets/images/rknn-v250/rv1106/en/p010-figure-01.png)

*Abbildung der englischen Quelle · PDF 10*

Abbildung 2-1. RV1103-Evaluierungsboard

RV1103B-Evaluierungsboard

![Abbildung der englischen Quelle · PDF 10](/assets/images/rknn-v250/rv1106/en/p010-figure-02.png)

*Abbildung der englischen Quelle · PDF 10*

Abbildung 2-2. RV1103B-Evaluierungsboard

RV1106-Evaluierungsboard

![Abbildung der englischen Quelle · PDF 11](/assets/images/rknn-v250/rv1106/en/p011-figure-01.png)

*Abbildung der englischen Quelle · PDF 11*

Abbildung 2-3. RV1106-Evaluierungsboard

Micro-USB-Datenkabel

![Abbildung der englischen Quelle · PDF 11](/assets/images/rknn-v250/rv1106/en/p011-figure-02.png)

*Abbildung der englischen Quelle · PDF 11*

Abbildung 2-4. Micro-USB-Datenkabel

Netzteil

![Abbildung der englischen Quelle · PDF 12](/assets/images/rknn-v250/rv1106/en/p012-figure-01.png)

*Abbildung der englischen Quelle · PDF 12*

Abbildung 2-5. Netzteil mit Ausgang 12V-2A

### 2.3 Board anschließen

Der Anschluss an den Computer wird am Beispiel RV1106 gezeigt:

1. Einen Computer mit Ubuntu 18.04 / Ubuntu 20.04 / Ubuntu 22.04 vorbereiten.

2. Den Stromanschluss des Boards suchen und das Netzteil anschließen.

3. Board und Computer mit einem Datenkabel verbinden. Art und Position des Anschlusses können je nach Produktionscharge variieren. Üblicherweise ist der mit OTG beschriftete Anschluss der Datenkabelanschluss.

4. Den Netzschalter einschalten und den Systemstart des Boards abwarten.

![Abbildung der englischen Quelle · PDF 13](/assets/images/rknn-v250/rv1106/en/p013-figure-01.png)

*Abbildung der englischen Quelle · PDF 13*

Abbildung 2-6. RV1106-Evaluierungsboard

### 2.4 Geräteverbindung prüfen

Folgende Befehle im Terminal des Computers ausführen:

```text
# Install adb if it is not already installed
sudo apt install adb

# Query ADB devices
adb devices
```

Bei erfolgreicher Verbindung erscheint eine ähnliche Ausgabe. 421ca310c9b9242b ist die RV1106-Gerätekennung dieses Beispiels; die tatsächliche Kennung hängt vom Board ab.

```text
List of devices attached
421ca310c9b9242b device
```

Vor Installation und Modellkonvertierung mindestens folgende Prüfungen durchführen:

| Prüfpunkt | Befehl | Erwartetes Ergebnis |
| --- | --- | --- |
| ADB verfügbar | adb version | ADB-Versionsinformationen werden korrekt angezeigt |
| Board sichtbar | adb devices | Das Board erscheint mit Status device in der Liste |

Wenn adb devices kein Gerät anzeigt, siehe Abschnitt 6.1 „Gerät wird nicht erkannt“.

{% endraw %}
