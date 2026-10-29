---
title: "RKNN2 V2.5.0, Teil 2: Hardwareanschluss und ADB-Prüfung"
description: "RKNN2 V2.5.0, Teil 2: Hardwareanschluss und ADB-Prüfung · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0, Teil 2: Hardwareanschluss und ADB-Prüfung"
translation_key: "rknn-v250-sdk-quickstart-hardware"
slug: "rknn-v250-sdk-quickstart-hardware"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Geltungsbereich: RKNN2-V2.5.0-Plattformreferenz für RK3562, die Serien RK3566/3568/3576/3588 und RV1126B. Auch ein ArmSoM-Board mit demselben SoC benötigt passende BSP-, NPU-Treiber- und Runtime-Versionen. Versorgung, USB und Firmware des Rockchip-EVB nicht ungeprüft übernehmen. Host- und Treiberanforderungen stehen im Text. Keine ArmSoM-Hardwarevalidierung durchgeführt.

Nach den lokalen chinesischen und englischen V2.5.0-Quellen mit ursprünglicher Abschnittsnummerierung. Chinesisch verwendet chinesische Abbildungen, die übrigen Sprachen die der englischen Quelle. PDF-Umbrüche, fortgesetzte Tabellen und Codeeinrückungen wurden wiederhergestellt. Beispielausgaben sind keine ArmSoM-Tests.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN2 V2.5.0, Teil 1: Bereitstellung, Plattformen und SDK-Repositorys](/de/articles/rknn-v250-sdk-quickstart-deployment-flow/)

**RKNN2 V2.5.0, Teil 2: Hardwareanschluss und ADB-Prüfung**

[RKNN2 V2.5.0, Teil 3: Toolkit, Android/Linux-Runtime und Compiler](/de/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0, Teil 4: MobileNet konvertieren und bereitstellen](/de/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0, Teil 5: YOLOv5-Erkennung und Genauigkeitsbewertung](/de/articles/rknn-v250-sdk-quickstart-yolov5/)

[RKNN2 V2.5.0, Teil 6: Docker, Startprobleme und Referenzen](/de/articles/rknn-v250-sdk-quickstart-docker-faq/)

{% raw %}

## 2. Hardwareanschluss und Prüfungen

Dieses Kapitel behandelt nur den Hardwareanschluss und die für den ersten Lauf notwendige Prüfung der Geräteerkennung.

### 2.1 Hardwareliste

Für die Beispielprogramme wird folgende Hardware benötigt:

| Hardware | Anzahl | Beschreibung |
| --- | --- | --- |
| Computer | 1 | Ubuntu 18.04/20.04/22.04 |
| Entwicklungsboard | 1 | RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B |
| Datenkabel | 1 | Typ abhängig vom Board, siehe Abschnitt 2.2 |
| Netzteil | 1 | Spezifikation abhängig vom Board, siehe Abschnitt 2.2 |

Hinweis: Typ und Position des Datenanschlusses können je nach Produktionscharge des Boards variieren. Üblicherweise ist der betreffende Anschluss mit OTG beschriftet.

### 2.2 Entwicklungsboard und Anschlussmittel

1. Entwicklungsboard

RK3562-Entwicklungsboard:

![Abbildung der englischen Quelle · PDF 8](/assets/images/rknn-v250/sdkquick/en/p008-figure-01.png)

*Abbildung der englischen Quelle · PDF 8*

Abbildung 2-1: RK3562-Entwicklungsboard

RK3566-Entwicklungsboard:

![Abbildung der englischen Quelle · PDF 9](/assets/images/rknn-v250/sdkquick/en/p009-figure-01.png)

*Abbildung der englischen Quelle · PDF 9*

Abbildung 2-2: RK3566-Entwicklungsboard

RK3568-Entwicklungsboard:

![Abbildung der englischen Quelle · PDF 9](/assets/images/rknn-v250/sdkquick/en/p009-figure-02.png)

*Abbildung der englischen Quelle · PDF 9*

Abbildung 2-3: RK3568-Entwicklungsboard

RK3588-Entwicklungsboard:

![Abbildung der englischen Quelle · PDF 9](/assets/images/rknn-v250/sdkquick/en/p009-figure-03.png)

*Abbildung der englischen Quelle · PDF 9*

Abbildung 2-4: RK3588-Entwicklungsboard

RK3576-Entwicklungsboard:

![Abbildung der englischen Quelle · PDF 10](/assets/images/rknn-v250/sdkquick/en/p010-figure-01.png)

*Abbildung der englischen Quelle · PDF 10*

Abbildung 2-5: RK3576-Entwicklungsboard

RV1126B-Entwicklungsboard:

![Abbildung der englischen Quelle · PDF 10](/assets/images/rknn-v250/sdkquick/en/p010-figure-02.png)

*Abbildung der englischen Quelle · PDF 10*

Abbildung 2-6: RV1126B-Entwicklungsboard

RV1126B-Entwicklungsboard, Seitenansicht:

![Abbildung der englischen Quelle · PDF 10](/assets/images/rknn-v250/sdkquick/en/p010-figure-03.png)

*Abbildung der englischen Quelle · PDF 10*

Abbildung 2-7: RV1126B-Entwicklungsboard, Seitenansicht

2. Datenkabel

USB-A-Datenkabel für RK3562/RK3568-Boards:

![Abbildung der englischen Quelle · PDF 11](/assets/images/rknn-v250/sdkquick/en/p011-figure-01.png)

*Abbildung der englischen Quelle · PDF 11*

Abb. 2-8 USB-A-Datenkabel für RK3562/RK3568-Boards

Micro-USB-Datenkabel für das RK3566-Board:

![Abbildung der englischen Quelle · PDF 11](/assets/images/rknn-v250/sdkquick/en/p011-figure-02.png)

*Abbildung der englischen Quelle · PDF 11*

Abb. 2-9 Micro-USB-Datenkabel für das RK3566-Board

USB-C-Datenkabel für RK3576/RK3588-Boards:

![Abbildung der englischen Quelle · PDF 11](/assets/images/rknn-v250/sdkquick/en/p011-figure-03.png)

*Abbildung der englischen Quelle · PDF 11*

Abb. 2-10 USB-C-Datenkabel für RK3576/RK3588-Boards

3. Netzteil

12V-2A-Netzteil für RK3562/RK3566/RK3568-Boards:

![Abbildung der englischen Quelle · PDF 12](/assets/images/rknn-v250/sdkquick/en/p012-figure-01.png)

*Abbildung der englischen Quelle · PDF 12*

Abb. 2-11 12V-2A-Netzteil für RK3562/RK3566/RK3568-Boards

12V-3A-Netzteil für RK3576/RK3588-Boards:

![Abbildung der englischen Quelle · PDF 12](/assets/images/rknn-v250/sdkquick/en/p012-figure-02.png)

*Abbildung der englischen Quelle · PDF 12*

Abb. 2-12 12V-3A-Netzteil für RK3576/RK3588-Boards

### 2.3 Board anschließen

Der Anschluss an den Computer wird am Beispiel von RK3568 erläutert:

1. Einen Computer mit Ubuntu18.04 / Ubuntu20.04 / Ubuntu22.04 vorbereiten.

2. Den Stromanschluss in der Abbildung finden und das Netzteil des Entwicklungsboards anschließen.

3. Entwicklungsboard und Computer mit dem Datenkabel verbinden. Je nach Fertigungscharge können Anschlusstyp und Position abweichen. Üblicherweise kennzeichnet die Aufschrift OTG am Board den Datenanschluss.

4. Den Netzschalter einschalten und warten, bis das System des Entwicklungsboards vollständig gestartet ist.

5. Verbindung zwischen Board und Computer prüfen

Im Terminal des Computers (Befehlszeile) folgenden Befehl ausführen:

```text
# If adb has not been installed, please install it first using 'sudo apt install adb'
adb devices
```

Bei erfolgreicher Verbindung erscheint folgende Ausgabe. 13af7b28115662cd ist eine beispielhafte RK3568-Geräte-ID; der tatsächliche Wert hängt vom Gerät ab. Wird kein Gerät angezeigt, Abschnitt 6.1 zur Fehlerbehebung lesen.

```text
List of devices attached
13af7b28115662cd device
```

### 2.4 Geräteverbindung prüfen

Vor Installation und Modellkonvertierung müssen mindestens alle folgenden Prüfungen erfolgreich sein:

| Prüfpunkt | Befehl | Erfolgskriterium |
| --- | --- | --- |
| ADB verfügbar | adb version | adb-Version wird normal angezeigt |
| Board sichtbar | adb devices | Board erscheint in der Geräteliste mit Status device |

Nach erfolgreichen Prüfungen mit der Umgebungsvorbereitung auf Host und Board fortfahren.

{% endraw %}
