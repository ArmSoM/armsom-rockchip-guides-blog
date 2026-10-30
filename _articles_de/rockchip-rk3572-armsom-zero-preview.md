---
title: "RK3572: 8nm, acht Kerne und 4 TOPS — ArmSoM plant ein Board im Zero-Format"
description: "RK3572 nach der offiziellen Rockchip-Ankündigung: ArmSoMs geplantes Zero-Format, technische Eckdaten und die Grenzen der Leistungsangaben."
excerpt: "RK3572 nach der offiziellen Rockchip-Ankündigung: ArmSoMs geplantes Zero-Format, technische Eckdaten und die Grenzen der Leistungsangaben."
translation_key: "rockchip-rk3572-armsom-zero-preview"
slug: "rockchip-rk3572-armsom-zero-preview"
lang: "de"
date: "2026-10-30"
author: "ArmSoM"
category: "ai"
products: []
tags: ["ArmSoM", "Rockchip", "RK3572", "Edge AI"]
image: "/assets/rk3572/launch.jpg"
---

Kompakte Boards erleichtern die Integration von Rechenleistung in Geräte. ArmSoM plant ein Produkt mit Rockchip RK3572 im Raspberry-Pi-Zero-Format für platzsparende Embedded-Projekte.

**Dies ist eine Produktplanung. Modellname, Abmessungen, Anschlüsse, RAM-Kapazität, Betriebssystemunterstützung, Preis und Verkaufsstart werden hier noch nicht angekündigt.** Das angestrebte Format bestätigt keine Kompatibilität mit Raspberry-Pi-Pins, Gehäusen, Erweiterungen oder Systemabbildern.

## RK3572: Achtkernplattform für die AIoT-Mittelklasse

Rockchip stellte RK3572 am 8. Mai 2026 für Unterhaltungselektronik, intelligente Geräte und die AIoT-Mittelklasse vor. Nachfolgend werden die Chipinformationen, fünf Kernvorteile und Anwendungsbereiche des bereitgestellten offiziellen PDF erläutert, einschließlich der technischen Abbildungen. Herstellermessungen und ArmSoMs Produktplanung bleiben klar getrennt.

![Offizielle RK3572-Abbildung von Rockchip, Seite 1 des bereitgestellten PDF.](/assets/rk3572/launch.jpg)

*Offizielle RK3572-Abbildung von Rockchip, Seite 1 des bereitgestellten PDF.*

RK3572 wird in **8nm** gefertigt und kombiniert **2× Cortex-A73 + 6× Cortex-A53**. Das Blockdiagramm zeigt drei Cluster: zwei A73, zwei A53 und vier A53. Die **Mali-G310-GPU** unterstützt laut Ankündigung **Vulkan 1.4**. Die NPU erreicht **4 TOPS INT8**. Zwei unabhängige Displays sind mit **4K@60fps + 2K@60fps** vorgesehen; Video wird bis 8K decodiert und bis 4K encodiert.

![Offizielles RK3572-Blockdiagramm, Seite 2; Chip-Schnittstellen sind nicht mit den Anschlüssen des ArmSoM-Boards gleichzusetzen.](/assets/rk3572/block-diagram.jpg)

*Offizielles RK3572-Blockdiagramm, Seite 2; Chip-Schnittstellen sind nicht mit den Anschlüssen des ArmSoM-Boards gleichzusetzen.*

Zusätzlich nennt das Diagramm einen N320-MCU, LPDDR4/4X/5/5X, MIPI DSI (1×4 Lanes), HDMI 2.1/eDP 1.3, 24-Bit-EBC, RGB/BT.1120, SAI×6 und SPDIF TX/RX. Als Encoderformate werden H.264/AVC und H.265/HEVC aufgeführt; beim Decodieren kommen VP9, AVS2 und AV1 hinzu. Im Diagramm steht MMC4.5, im Text MMC4.51. Beide Angaben bleiben erhalten und sind anhand der jeweiligen Spezifikation und des BSP zu prüfen.

## Vorteil 1: Leistung und Verbrauch mit Testbedingungen

Rockchip nennt über 100% mehr Leistung und über 50% weniger Verbrauch in typischen Szenarien gegenüber der vorherigen Mittelklasseplattform sowie mehr als 310.000 Punkte in AnTuTu v10. Vergleichsplattform und Benchmarkkonfiguration sind nicht vollständig dokumentiert. Diese Werte gelten weder pauschal für alle Anwendungen noch als ArmSoM-Messungen.

| Testszenario des Herstellers | Verbrauch |
| --- | --- |
| Standby der zweiten Stufe | <10mW |
| 1080P-Videowiedergabe | 670mW |
| 3D-Spiel, geringe GPU-Last | <1W |

**Testbedingungen: RK3572-Tablet, 8GB LPDDR5 + 128GB UFS, Display/Touchpanel entfernt, WLAN/Bluetooth deaktiviert.** Rockchip beschreibt unter 1W für das Minimalsystem in den meisten praktischen Szenarien sowie sparsamen Standby und schnelles Aufwachen. Ein Minimalsystem ist kein vollständiges Board mit Kameras, Funkmodulen und USB-Geräten und keine Verbrauchsgarantie für ArmSoMs geplantes Produkt.

## Vorteil 2: 4-TOPS-INT8-NPU und Modellleistung

Die eigene NPU unterstützt INT4/INT8/INT16/FP4/FP8/FP16/BF16 sowie asymmetrische W4A16-MAC-Operationen. Genannt werden TensorFlow, Caffe, TFLite, PyTorch, ONNX NN, Android NN und MXNet. Für jedes Modell sind Operatoren, Quantisierungsgenauigkeit und Werkzeugversionen zu prüfen.

![Originale CNN-Leistungstabelle von Rockchip, Seite 2; die Werte sind unten transkribiert.](/assets/rk3572/cnn-performance.jpg)

*Originale CNN-Leistungstabelle von Rockchip, Seite 2; die Werte sind unten transkribiert.*

| Modell | Auflösung | Quantisierung | FPS | Latenz ms | Speicher |
| --- | --- | --- | --- | --- | --- |
| Resnet50-v2-7 | 224×224 | W8A8 | 109.03 | 9.172181 | 30.095 MB |
| Vit-base-patch16 | 224×224 | W4A16 | 24.47 | 40.87 | 47.5 MB |
| Yolov5s | 640×640 | W8A8 | 56.87 | 17.583708 | 14.416 MB |
| Yolov8s | 640×640 | W8A8 | 42.24 | 23.672386 | 17.966 MB |

![Originale LLM-Leistungstabelle von Rockchip, Seite 3; Bezeichnung Model Context und Werte bleiben erhalten.](/assets/rk3572/llm-performance.jpg)

*Originale LLM-Leistungstabelle von Rockchip, Seite 3; Bezeichnung Model Context und Werte bleiben erhalten.*

| Model | Model Context | TTFT (ms) | TPOT (ms) | Prefill TPS | Decode TPS |
| --- | --- | --- | --- | --- | --- |
| Qwen3-0.6B | 1024 | 190.09 | 43.03 | 673.38 | 23.24 |
| Qwen3-1.7B | 1024 | 360.57 | 111.57 | 354.99 | 8.96 |

TTFT bezeichnet üblicherweise die Zeit bis zum ersten Token, TPOT die Zeit je weiterem Token und TPS Token pro Sekunde. Quantisierung, Speicherkonfiguration, Takt und Softwareversionen sind nicht vollständig angegeben. Die Werte garantieren keinen Anwendungsdurchsatz; Model Context=1024 belegt keine maximale Kontextgrenze des Chips. Alle CNN-/LLM-Messwerte stammen von Rockchip, nicht von ArmSoM.

Außerdem nennt Rockchip AI-PQ-Bildoptimierung, AI-SR-Superauflösung, Bildsuche, AI-HDR, intelligente Rauschunterdrückung, Spracherkennung und AI-Beauty für Bild, Video und Audio. Nicht jede Funktion ist dadurch automatisch in einer Board-Firmware enthalten; SDK, Lizenzierung und Integration sind zu prüfen.

## Vorteil 3: 8K-Decodierung, 12M-ISP und mehrere Ein-/Ausgänge

Genannt werden bis zu 8K-Decodierung, 4K-Encoding, fünf Kameraeingänge, ein 12M-ISP und unabhängige Displays mit 4K@60fps + 2K@60fps. Einsatzfelder sind Mehrwinkelaufnahme, Aufzeichnung, Liveübertragung, POS und Digital Signage.

![Originaler RK3572-Multimediapfad, Seite 3; Kamera-, ISP-, VOP- und Ausgangsbezeichnungen bleiben erhalten.](/assets/rk3572/multimedia.jpg)

*Originaler RK3572-Multimediapfad, Seite 3; Kamera-, ISP-, VOP- und Ausgangsbezeichnungen bleiben erhalten.*

Das Diagramm zeigt vier MIPI-CSI- und einen DVP-Kamerapfad. Zwei MIPI-Gruppen mit je vier Lanes lassen sich in vier Zweilane-Gruppen teilen. Beschriftet sind ISP3.5 (12M30), VICAP, VPSS, RGA, VOP0 (4K60), VOP1 (2K60), Encoder (4K40) und Decoder (8K30). Ausgänge: MIPI DSI (2560×1600@60Hz), HDMI/eDP (4K@60Hz), RGB/BT.1120 (1080P@60Hz) und EBC. Eine vollständige Tabelle gleichzeitig nutzbarer Modi fehlt; einzelne Maximalwerte dürfen nicht addiert werden.

## Vorteil 4: Speicher-, Hochgeschwindigkeits- und Industrieschnittstellen

Speicherschnittstellen sind **eMMC 5.1 (HS400), zweikanaliges UFS 2.0, SD3.0/MMC4.51 und FSPI**. Hinzu kommen **PCIe 2.1, SATA 3.1, USB DRD 3.0/2.0, zweimal Gigabit-Ethernet, SDIO 3.0, DSMC, CAN, I2C, I3C, SPI und UART**. Sie bieten Optionen für Datenübertragung, Speichererweiterung und industrielle Kommunikation. Gemeinsame PCIe-/SATA-Beschriftungen belegen keinen unabhängigen gleichzeitigen Betrieb aller Schnittstellen; ArmSoMs Anschlussauswahl steht noch nicht fest.

## Vorteil 5: LPDDR5/5X und flexible Speicherlösungen

Rockchip hebt LPDDR5/5X für Bandbreite, Effizienz und Beschaffungsflexibilität hervor. Der DRAM-Controller unterstützt **vier Ranks**. UFS 2.0, eMMC 5.1 und SDMMC 3.0 ermöglichen unter anderem eMCP und uMCP; das Diagramm nennt auch LPDDR4/4X. Die Aussage zur langfristigen Versorgung ist Herstellerpositionierung, keine hier zugesagte Lieferdauer oder Lagergarantie. ArmSoMs Kapazitäten und Speicherkombinationen sind noch offen.

## Vier Anwendungsgruppen der Ankündigung

1. **Tablets und mobile Geräte:** heterogene CPU-Steuerung, AI-Superauflösung, Rauschunterdrückung für Gespräche und Offline-Sprache für Consumer- und Bildungstablets, tragbare Medizingeräte und Selbstbedienungsterminals.
2. **AI-Kameras:** 12M-ISP mit AI-HDR, Entschärfung von Bewegungsunschärfe und Moiré-Entfernung für Gegenlicht und Nachtaufnahmen.
3. **Überwachung und NAS:** Für NVR werden 4K@60fps-Decodierung, mehrere HD-Wiedergabeströme, Gesichts-/Kennzeichenerkennung und Verhaltensanalyse genannt; für NAS Bildsuche und intelligente Recherche.
4. **Handel und Digital Signage:** Desktop-POS, Beschilderung und Selbstbedienungsgeräte mit zwei Displays, Bildoptimierung, AI-Superauflösung, Text-zu-Bild-Suche, Bildsuche, Besucherzählung, Gesichtsanalyse und Prüfung der Inhaltssicherheit.

Rockchip nennt Büros, Bildung, Finanzen, Supermärkte, intelligente Quartiere und Smart Homes. Dies sind Plattformrichtungen, kein Nachweis für alle Funktionen oder Branchenzertifizierungen des geplanten ArmSoM-Produkts.

## Was das Zero-Format für ein Projekt bedeutet

Die Größe ist nur der Anfang. Position und Ausrichtung der Anschlüsse, Befestigungslöcher, Kühlraum und Kabelradien beeinflussen den Einbau. Entscheidend sind mechanische Zeichnungen und tatsächliche Pinbelegungen, nicht allein der Name Zero.

Kleine Bildverarbeitungsknoten, Offline-Sprachterminals und einfache interaktive Geräte sind mögliche Entwicklungsrichtungen, keine bereits validierten ArmSoM-Anwendungen. Kamera-, Audio-, Netzwerk- und Speicheranforderungen sollten vor der Auswahl von Modell und Software feststehen.

## Was neben TOPS zu prüfen ist

Mit dem Zielmodell sind Operatorunterstützung, Konvertierung, Genauigkeit nach Quantisierung, Gesamtlatenz und Speicherbedarf zu prüfen. Aufnahme, Vorverarbeitung und Anzeige können Engpässe bilden und gehören zur Messung.

BSP, Kernel, Treiber und Inferenzlaufzeit müssen zusammenpassen. Allgemeine RKNN-Anleitungen erklären Abläufe, ersetzen aber keine RK3572-Kompatibilitätsliste und bestätigen keine Unterstützung durch eine vorhandene Version.

## ArmSoMs weitere Produktplanung

ArmSoM plant die Entwicklung eines RK3572-Produkts im Raspberry-Pi-Zero-Format. Entwickler können bereits ihre Schnittstellen- und Leistungsanforderungen zusammenstellen. Verbindliche Konfigurationen folgen in offiziellen ArmSoM-Produktunterlagen.

[ArmSoM-Website](https://www.armsom.org/) · [ArmSoM-Dokumentation](https://docs.armsom.org/)
