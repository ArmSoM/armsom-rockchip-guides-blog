---
title: "RK3588S erklärt: acht CPU-Kerne, 6-TOPS-NPU und ArmSoM-Plattformen"
description: "RK3588S: CPU, GPU, NPU, Video und Schnittstellen sowie Entwicklungswege mit ArmSoM CM7S und Sige7S."
excerpt: "RK3588S: CPU, GPU, NPU, Video und Schnittstellen sowie Entwicklungswege mit ArmSoM CM7S und Sige7S."
translation_key: "rk3588s-chip-guide"
slug: "rk3588s-chip-guide"
lang: "de"
date: "2026-11-01"
last_modified_at: "2026-11-02"
author: "ArmSoM"
category: "ai"
products: ["CM7S", "Sige7S"]
tags: ["RK3588S", "CM7S", "Sige7S", "ArmSoM", "Rockchip"]
image: "/assets/rk3588s/block-diagram.png"
---

RK3588S vereint Anwendungsprozessor, Grafik, neuronale Inferenz, Videocodecs und Kameraverarbeitung in einem SoC. ArmSoM bietet dafür zwei Wege: den **Sige7S-Einplatinencomputer** für Anwendungsprototypen und das **CM7S-Rechenmodul** für eine eigene Trägerplatine.

![Originales RK3588S-Blockdiagramm](/assets/rk3588s/block-diagram.png)

## CPU, GPU und NPU haben unterschiedliche Aufgaben

Vier Cortex-A76- und vier Cortex-A55-Kerne übernehmen allgemeine Rechenaufgaben. A76-Kerne eignen sich für anspruchsvolle Anwendungsthreads, A55-Kerne für Hintergrunddienste; die tatsächliche Verteilung bestimmt der Scheduler. V1.3 nennt je A76 64KB Befehls-, 64KB Daten- und 512KB L2-Cache; je A55 32KB Befehls-, 32KB Daten- und 128KB L2-Cache sowie 3MB gemeinsamen L3-Cache.

Die Mali-G610 MP4 verarbeitet Grafik und unterstützte Rechenaufgaben. Die separate NPU ist mit bis zu 6 TOPS angegeben. Das entspricht weder einer Bildrate noch einer LLM-Geschwindigkeit in Tokens/s. Modellstruktur, Präzision, Eingabegröße, Operatorunterstützung und Datentransfers bestimmen das Ergebnis.

## Fähigkeiten des Chips

| Einheit | Angaben aus V1.3 | Für das Produkt prüfen |
|---|---|---|
| CPU | 4× Cortex-A76 + 4× Cortex-A55, Armv8-A | Image, Kühlung und Takt |
| GPU | Mali-G610 MP4; OpenGL ES 3.2, OpenCL 2.2, Vulkan 1.2 | Installierter Treiber und verfügbare APIs |
| NPU | Bis 6 TOPS; INT4/INT8/INT16/FP16 | Durchsatz je Präzision und SDK |
| Speichercontroller | LPDDR4/LPDDR4X/LPDDR5, 4×16-bit, bis 32GB Adressraum | Tatsächlich bestückter Speicher |
| Decodierung | H.265/VP9 8K60; H.264 8K30; AV1 4K60 | Format, Bittiefe, gleichzeitige Last |
| Encodierung | H.264/H.265 bis 8K30 | Eingabeformat und Verarbeitungskette |
| ISP | Eingaben bis zur 48MP-Klasse | Sensor, Objektiv und IQ-Abstimmung |

## RK3588-Schnittstellen nicht auf RK3588S übertragen

Ähnliche Namen garantieren keine identische Erweiterbarkeit. V1.3 nennt einen Gigabit-Ethernet-Controller und gemeinsam genutzte Combo-PHY-Ressourcen für PCIe 2.1, SATA und USB. Daraus ergeben sich weder PCIe 3.0 x4 noch zwei Netzwerkports oder die gleichzeitige Nutzbarkeit aller Multiplexfunktionen.

Auch die LPDDR5-Unterstützung des Chips sagt nichts über die Bestückung eines konkreten Boards aus. Für CM7S und Sige7S nennen die Produktunterlagen LPDDR4/LPDDR4X. Maßgeblich sind SKU, Hardwareversion und Schaltplan.

## Welche Anwendungen ermöglicht RK3588S?

RK3588S kann Erfassung, Verarbeitung, Inferenz und Anzeige auf einer Plattform verbinden. Die acht Szenarien sind Entwicklungsvorschläge auf Basis von Chipfunktionen und Boardbauformen, keine abgeschlossenen Kundenprojekte oder Benchmarks. Schnittstellen, Software und Dauerlast müssen gemeinsam betrachtet werden.

### 1. Bildverarbeitung und industrielle Sichtprüfung

Eine Kamera erfasst Teile oder Verpackungen; die Bildverarbeitung skaliert und konvertiert; ein angepasstes NPU-Modell erkennt oder klassifiziert; die CPU übergibt das Ergebnis an die Anwendung. Lokale Verarbeitung kann das Hochladen jedes Einzelbildes vermeiden.

Mit Sige7S und einer geprüften USB-Kamera beginnen. Für spezielle Kameras, Trigger oder Gehäuse kommt eine CM7S-Trägerplatine infrage. Beleuchtung, Belichtung, Optik, Kalibrierung und Fehlklassifikationen bleiben Entwicklungsaufgaben. Deterministische Trigger, isolierte IO oder Steuerung können einen separaten Controller benötigen.

### 2. Intelligente Kameras und Videoanalyse-Gateways

Für Handel, Lager oder Geländeüberwachung lässt sich eine Kette aus Stream-Eingang, Hardwaredecodierung, Vorverarbeitung, Erkennung und Ereignisaufzeichnung aufbauen. Videoeinheiten und NPU übernehmen passende Aufgaben; die CPU verwaltet Regeln, Dienste und Daten.

Zunächst einen vollständigen Stream auf Sige7S prüfen, dann die Last erhöhen. CM7S eignet sich als Basis eines eigenen Gateway-Designs. Weder 8K-Decodierung noch 6 TOPS bestimmen die Zahl paralleler Streams. Reale Videos, Modelle, Netzwerk, Speicher und Kühlung testen; Aufzeichnungskapazität und Schreibbelastung einplanen.

### 3. Digital Signage, Kioske und interaktive Displays

Wegweiser, Besprechungsanzeigen, Bestellterminals und Ausstellungen kombinieren Video, Webinhalte und Grafik. GPU, Decoder und Displayeinheit bilden die Hardwarebasis für Wiedergabe, Touch-Bedienung und lokale Geschäftslogik.

Sige7S erlaubt einen Prototyp mit externem Bildschirm, CM7S ein eigenes Displaygerät. Mehrere Anzeigen, Touch, Rotation und Decodierung im gewählten Image prüfen. Ein unterstützter Standard garantiert nicht jede Ausgangskombination mit maximalen Werten.

### 4. Roboterwahrnehmung und übergeordnete Berechnung

RK3588S kann Bilderkennung, Oberfläche, Aufgabenplanung und Protokollierung übernehmen, während ein MCU oder eigener Controller Motorregelung und Notabschaltung ausführt. So bleiben rechenintensive Aufgaben von deterministischer Steuerung getrennt.

Sige7S passt zu Labortests von Algorithmen und Kommunikation; CM7S zu angepasstem Bauraum, Anschlüssen oder Versorgung. ARM64-Abhängigkeiten, Systemversion, Kameratreiber und benötigte ROS-Pakete prüfen. Ein startendes Linux bestätigt noch keine vollständig unterstützte Robotiksoftware.

### 5. Lokale Sprachbedienung und KI-Assistenten

Konferenzterminals, Ausstellungsgeräte oder Offline-Bedienoberflächen können Aufnahme, Spracherkennung, Textverarbeitung und Sprachausgabe verbinden. CPU und NPU bedienen unterschiedliche Stufen; die Modelle können verschiedene Softwarewege benötigen. Für Bildmodelle RKNN-Toolkit2 und für Sprachmodelle die Unterstützung durch RKNN-LLM getrennt prüfen.

Zuerst einen kompletten Dialog auf Sige7S testen, danach Speichergröße und gegebenenfalls CM7S-Hardware wählen. Erste Antwortzeit, Generierungsrate, Kontextlänge, Spitzenspeicher und Mikrofonqualität messen. Bestimmte Modellgrößen oder Tokens/s werden hier nicht zugesagt.

### 6. ARM-Linux-Arbeitsplätze und Lehre

Acht CPU-Kerne, Grafik und wählbarer Speicher machen RK3588S für die Bewertung von ARM-Linux-Desktops, Softwareentwicklung, Containern und Embedded-Kursen interessant. GPIO-, Video- und Modellübungen verbinden Software mit Hardware.

Sige7S bietet einen fertigen Einstieg mit Monitor, Tastatur und Netzwerk. Das Ergebnis hängt von Image, Desktop, Treibern und Speicher ab. Reine x86-Software läuft nicht allein durch eine Linux-Installation nativ. CM7S passt eher zur anschließenden Entwicklung eines eigenen Produkts.

### 7. Medienserver und leichte Speicheranwendungen

RK3588S kann Medienverwaltung, Dateidienste und Container ausführen. Die CPU verarbeitet Dienste; geeignete Software kann Videobeschleunigung nutzen. Transcodierung hängt von Framework, Treibern sowie Ein- und Ausgabeformat ab.

Grundfunktionen auf Sige7S testen, für besondere Speicheranschlüsse oder Gehäuse eine CM7S-Trägerplatine prüfen. Netzwerk, Laufwerksanbindung, Stromversorgung, Sicherung und Kühlung berücksichtigen. RK3588S bietet nicht automatisch eine SATA-Mehrplatten- oder PCIe-3.0-NAS-Plattform; Multiplexfunktionen am Schaltplan prüfen.

### 8. Industrielle HMI, Überwachung und Protokoll-Gateways

Maschinenoberflächen zeigen Zustände, speichern Daten, erlauben Netzwerkverwaltung und kommunizieren mit Steuerungen. RK3588S kann diese übergeordneten Funktionen mit Grafik und Fernwartung verbinden.

Sige7S dient zum Prüfen von Oberfläche und Kommunikation. Eine CM7S-Trägerplatine kann passende Transceiver, Isolation und Steckverbinder ergänzen. Feldbuspegel, EMV, Temperatur und Dauerbetrieb müssen am Gesamtsystem validiert werden; die Controllerliste des Chips allein belegt keine Industrietauglichkeit.

### Vom Szenario zur Plattform

| Phase oder Vorgabe | Zu prüfender Weg | Erste Prüfung |
|---|---|---|
| Schnell eine vollständige Anwendung zeigen | Sige7S | Gesamtablauf und Peripherie |
| Festes Gehäuse und spezielle Anschlüsse | CM7S + eigene Trägerplatine | Pins, Versorgung, Mechanik, Signalintegrität |
| Erst Software, später eigene Hardware | CM7S + CM7S-IO | Versionen und Testbasis auf passendem Träger |
| KI, Video und Oberfläche gleichzeitig | Beide Wege validieren | Latenz, Bandbreite, Temperatur und Dauerleistung |

Mit der kleinsten funktionierenden Verarbeitungskette beginnen, dann Kamerazahl, Modellkomplexität und Anzeigelast erhöhen. Anwendungsform und Messergebnisse sollten die ArmSoM-Auswahl bestimmen, nicht allein Kernzahl oder TOPS.

## Vom Chip zum Produkt

Sige7S eignet sich als Ausgangspunkt für Software- und Peripherietests auf einem fertigen Board. CM7S ist interessant, wenn Gehäuse, Steckverbinder und spezielle Schnittstellen die Entwicklung bestimmen. Gleicher SoC bedeutet nicht, dass Images, Device Trees oder Zubehör austauschbar sind.

Die Leistungsangaben stammen aus Unterlagen und sind keine neuen ArmSoM-Messungen. Vor Funktions- und Dauertests sollten Boardversion, Image, Kernel und SDK festgehalten werden.


## Weiterführende Artikel und Produkte

- [CM7S oder Sige7S? Die passende RK3588S-Plattform wählen](/de/articles/cm7s-sige7s-rk3588s-selection/)
- [Edge-KI und Multimedia mit RK3588S: Produkte mit CM7S und Sige7S planen](/de/articles/rk3588s-edge-ai-multimedia/)
- [RK3588S Datasheet V1.3: Download, Blockdiagramm und Hardware-Leitfaden](/de/articles/rk3588s-datasheet-v13/)

### Produkte und Entwicklungsunterlagen

- [CM7S](https://www.armsom.org/cm7s) · [CM7S Docs](https://docs.armsom.org/armsom-cm7s)
- [Sige7S](https://www.armsom.org/sige7s) · [Sige7S Docs](https://docs.armsom.org/armsom-sige7s)
- [Rockchip RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [RKNN-LLM](https://github.com/airockchip/rknn-llm)
