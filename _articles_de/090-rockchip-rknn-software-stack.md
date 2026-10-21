---
title: "Rockchip-RKNN-Softwarestack: Toolkit2, Runtime, Plattformen und v2.3.2-Referenz"
description: "Vollständige technische README-PDF-Referenz zu RKNN-Architektur, Plattformen, Downloads, Python-Kompatibilität, LLM und v2.3.2-Änderungen mit Originalabbildung."
translation_key: "090-rockchip-rknn-software-stack"
slug: "090-rockchip-rknn-software-stack"
lang: "de"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
tags: ["Rockchip", "RKNN", "RK3588", "RK3576", "NPU", "Toolkit2"]
keywords: "ArmSoM Rockchip RKNN Toolkit2 Runtime RK3588 RK3576 NPU"
excerpt: "Vollständige technische README-PDF-Referenz zu RKNN-Architektur, Plattformen, Downloads, Python-Kompatibilität, LLM und v2.3.2-Änderungen mit Originalabbildung."
---

{% raw %}

# Rockchip-RKNN-Softwarestack: Toolkit2, Runtime, Plattformen und v2.3.2-Referenz

## Anwendbarkeit auf ArmSoM und Quelle

Dies ist eine Rockchip-Plattformreferenz, kein ArmSoM-Testbericht. Die Quelle nennt RK3588, RK3576 und weitere Plattformen, aber kein Board, SDK/BSP und keine Kernelversion. Vor der Anpassung an eine konkrete ArmSoM-Platine passende NPU-Treiber-, Runtime-, Toolkit-, Betriebssystem- und Modellunterstützung prüfen; ein gleicher SoC-Name allein belegt keine Kompatibilität. README.pdf in chinesischem und englischem Verzeichnis ist byteidentisch und enthält englischen Text. Chinesisch, Russisch und Deutsch übersetzen diesen vollständig. Chinesisch verwendet die Abbildung aus dem chinesischen Verzeichnis (mit englischen Beschriftungen); Englisch, Russisch und Deutsch das entsprechende Original aus dem englischen Verzeichnis. Es gibt keine Dokumentversionsnummer; v2.3.2 bezeichnet den Softwarestand, nicht die derzeit neueste Version. Keine Hardware- oder Modellleistungsvalidierung wurde durchgeführt.

[Redaktionelle Hinweise](/docs/rockchip-rknn-software-stack/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)

## 1. Beschreibung des Softwarestacks

Der RKNN-Softwarestack unterstützt die schnelle Bereitstellung von KI-Modellen auf Rockchip-Chips. Der Gesamtaufbau folgt.

![Originaldiagramm des RKNN-Softwarestacks, PDF-Seite 1](/docs/rockchip-rknn-software-stack/assets/en-p001-framework.png)

Für RKNPU zunächst RKNN-Toolkit2 auf dem Computer ausführen und das trainierte Modell in das RKNN-Format umwandeln. Anschließend auf dem Entwicklungsboard mit der RKNN C API oder Python API inferieren.

- **RKNN-Toolkit2** ist ein Entwicklungskit für Modellkonvertierung, Inferenz und Leistungsbewertung auf PCs und Rockchip-NPU-Plattformen.
- **RKNN-Toolkit-Lite2** stellt Python-Schnittstellen für Rockchip-NPU-Plattformen bereit, um RKNN-Modelle bereitzustellen und KI-Anwendungen schneller umzusetzen.
- **RKNN Runtime** stellt C/C++-Schnittstellen für Rockchip-NPU-Plattformen zur Bereitstellung von RKNN-Modellen und schnelleren Umsetzung von KI-Anwendungen bereit.
- **RKNPU kernel driver** kommuniziert mit der NPU-Hardware. Er ist quelloffen und im Rockchip-Kernelcode zu finden.

## 2. Unterstützte Plattformen laut Quelle

- RK3588-Serie
- RK3576-Serie
- RK3566/RK3568-Serie
- RK3562-Serie
- RV1103/RV1106
- RV1103B/RV1106B
- RV1126B
- RK2118

Für RK1808/RV1109/RV1126/RK3399Pro verweist die Quelle stattdessen auf folgende Projekte. Diese nicht mit der obigen Toolkit2-Plattformliste gleichsetzen:

- [rknn-toolkit](https://github.com/airockchip/rknn-toolkit)
- [rknpu](https://github.com/airockchip/rknpu)
- [RK3399Pro_npu](https://github.com/airockchip/RK3399Pro_npu)

## 3. Download

Pakete, Docker-Images, Beispiele, Dokumentation und platform-tools sind auch über [RKNPU2_SDK](https://console.zbox.filez.com/l/I00fc3) erhältlich; die Quelle nennt den Abrufcode `rknn`. Weitere Beispiele stehen in [rknn_model_zoo](https://github.com/airockchip/rknn_model_zoo). Dies sind Downloadverweise der Quelle; im Rahmen dieser Arbeit wurde keine Software daraus heruntergeladen oder ausgeführt.

## 4. Hinweise und Python-Versionen

RKNN-Toolkit2 ist nicht mit [RKNN-Toolkit](https://github.com/airockchip/rknn-toolkit) kompatibel. Die Quelle nennt folgende Python-Versionen:

- Python 3.6
- Python 3.7
- Python 3.8
- Python 3.9
- Python 3.10
- Python 3.11
- Python 3.12

Die Quelle schreibt „Latest version: v2.3.2“. Dies dokumentiert den PDF-Stand, nicht die derzeit neueste Veröffentlichung. Ebenso wird nicht zugesichert, dass jedes Paket alle genannten Python-Versionen unterstützt.

## 5. RKNN LLM

Zur Bereitstellung von LLMs (Large Language Models) nennt die Quelle ein SDK namens RKNN-LLM; siehe [rknn-llm](https://github.com/airockchip/rknn-llm). Originalname und Link bleiben erhalten, statt sie stillschweigend durch ein anderes Produkt zu ersetzen.

## 6. Technische Änderungen in v2.3.2

- Unterstützung der RV1126B-Plattform.
- Verbesserte Unterstützung für einsum- und Norm-Operationen.
- Automatische gemischte Präzision ergänzt.
- Erweiterte Möglichkeiten zur Graphoptimierung.

Für ältere Versionen verweist die Quelle auf `CHANGELOG`. Der PDF-Link zeigt auf eine interne lokale Datei statt auf eine öffentliche Seite. Der Dateiname bleibt erhalten, jedoch ohne anklickbaren internen Pfad. Die Historie im CHANGELOG des verwendeten SDK prüfen.

{% endraw %}
