---
title: "RK2118 NPU, Teil 1: Hardware, Anschluss und serielle Konsole"
description: "RK2118 NPU, Teil 1: Hardware, Anschluss und serielle Konsole · RKNN2 V2.5.0"
excerpt: "RK2118 NPU, Teil 1: Hardware, Anschluss und serielle Konsole"
translation_key: "rknn-v250-rk2118-hardware"
slug: "rknn-v250-rk2118-hardware"
lang: "de"
date: "2026-10-28"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

Plattformreferenz für das Evaluierungsboard RK_EVB1_RK2118G_V20 (RK2118) der Quelle. Ein entsprechendes ArmSoM-Board ist nicht bestätigt; diese Anschlussanweisungen nicht direkt auf RK3588/RK3576 übertragen. Grundlage sind Kapitel 1–2 (Seiten 4–7) der lokalen chinesischen und englischen RKNN2 RK2118 QuickStart V2.5.0. Das anschließende SDK verwendet RT-Thread; ein Linux-Kernel oder geprüfter BSP wird hier nicht festgelegt. Es wurden keine Tests auf ArmSoM-Hardware durchgeführt.

Quellenvergleich: Beide PDFs tragen V2.5.0. Die chinesischen Anschlussschritte bezeichnen USB2.0 HOST als Flash-Port; später wird er auch für einen USB-Stick genutzt. In den englischen Anschlussschritten fehlt die Flash-Port-Aussage. Vor Verwendung Schaltplan und Flash-Anleitung des Boards prüfen; aus dieser Formulierung keinen Port-Modus ableiten. Chinesisch behält seine Reihenfolge bei, die übrigen Sprachen folgen der englischen. Die chinesische Fassung nutzt fünf Abbildungen aus dem chinesischen PDF, die übrigen fünf aus dem englischen PDF.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**RK2118-Einstiegsserie · 1/5**

**RK2118 NPU, Teil 1: Hardware, Anschluss und serielle Konsole**

[RK2118 NPU, Teil 2: Host-Umgebung und Toolkit2-Installation](/de/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU, Teil 3: RT-Thread und DSP-Firmware](/de/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU, Teil 4: Modellkonvertierung, USB-Eingaben und Inferenzergebnisse](/de/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU, Teil 5: Docker, häufige Fragen und Referenzen](/de/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 1. Einführung

Dieses Dokument erläutert für Einsteiger, wie Modelle mit RKNN-Toolkit2 auf einem Computer konvertiert und auf einem Rockchip-Evaluierungsboard bereitgestellt werden.

Unterstützte Plattform: RK2118.

## 2. Evaluierungsboard vorbereiten

Der Anschluss des Boards an den Computer wird in drei Teilen beschrieben:

- Hardwareliste

- Board und Verbindungsmittel

- Board mit dem Computer verbinden

### 2.1 Hardwareliste

| Hardware | Anzahl |
| --- | --- |
| Computer | 1 |
| Evaluierungsboard RK_EVB1_RK2118G_V20 | 1 |
| USB-A-Datenkabel | 1 |
| USB-C-Datenkabel | 1 |
| RK2118-Netzteil | 1 |

Hinweis: Das RK_EVB1_RK2118G_V20 wird im Folgenden als RK2118 bezeichnet.

### 2.2 Board und Verbindungsmittel

**1. Evaluierungsboard**

![Abbildung 2-1. Evaluierungsboard RK_EVB1_RK2118G_V20](/assets/images/rknn-v250/rk2118/en/p005-figure-01.png)

Abbildung 2-1. Evaluierungsboard RK_EVB1_RK2118G_V20

![Abbildung 2-2. Evaluierungsboard RK_EVB1_RK2118G_V20](/assets/images/rknn-v250/rk2118/en/p005-figure-02.png)

Abbildung 2-2. Evaluierungsboard RK_EVB1_RK2118G_V20

**2. Datenkabel zwischen Board und Computer**

![Abbildung 2-3. USB-C-Datenkabel](/assets/images/rknn-v250/rk2118/en/p006-figure-01.png)

Abbildung 2-3. USB-C-Datenkabel

![Abbildung 2-4. USB-A-Datenkabel](/assets/images/rknn-v250/rk2118/en/p006-figure-02.png)

Abbildung 2-4. USB-A-Datenkabel

**3. Netzteil**

![Abbildung 2-5. Netzteil mit Ausgang 12V-2A](/assets/images/rknn-v250/rk2118/en/p006-figure-03.png)

Abbildung 2-5. Netzteil mit Ausgang 12V-2A

### 2.3 Board mit dem Computer verbinden

Die Verbindung wird im Folgenden am Beispiel des RK2118-Boards erläutert.

- Einen Computer mit Ubuntu 18.04, Ubuntu 20.04 oder Ubuntu 22.04 vorbereiten.

- Art und Position der Anschlüsse können sich je nach Produktionscharge unterscheiden. Den Stromanschluss anhand des mitgelieferten Schaltplans oder der Dokumentation bestimmen und das Netzteil anschließen.

- Den Netzschalter einschalten und warten, bis das System des Boards gestartet ist.

- Den Anschluss SYSTEM DEBUG des Boards mit einem USB-Type-C-Kabel an den Computer anschließen.

- Den Zustand des RK2118 mit einem seriellen Kommunikationsprogramm auf dem Computer beobachten, beispielsweise minicom. Den seriellen Anschluss auf 1500000 8N1 einstellen.

{% endraw %}
