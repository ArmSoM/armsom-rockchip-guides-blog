---
title: "RK3528 Datasheet V1.0: Multimedia und schlanke Linux-Projekte mit ArmSoM Sige1"
description: "CPU, Video, Display, Speicher und USB/PCIe-Abwägungen des RK3528 mit einem praktischen Prüfplan für Sige1."
excerpt: "CPU, Video, Display, Speicher und USB/PCIe-Abwägungen des RK3528 mit einem praktischen Prüfplan für Sige1."
translation_key: "rk3528-datasheet-v10"
slug: "rk3528-datasheet-v10"
lang: "de"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["Sige1"]
tags: ["RK3528", "hardware design", "ArmSoM"]
image: "/assets/datasheet-series-20261110/rk3528-datasheet-p14.png"
---

Dieser thematische Leitfaden erläutert das Quelldokument mit wichtigen Daten, Grenzen und Originalabbildungen. Er ist keine seitenweise Übersetzung und kein vollständiges Pin- oder Registerhandbuch. Herstellerbeispiele sind keine ArmSoM-Messungen. Vor der Anwendung sind Platinenrevision, Schaltplan, SDK/BSP, Kernel und Treiber zu prüfen; für diesen Artikel wurden keine neuen Hardwaretests durchgeführt.

**Hauptquelle：** `Rockchip RK3528 Datasheet V1.0-20230522.pdf` · PDF 28 Seiten.

## Wofür RK3528 ausgelegt ist

Das Datasheet V1.0 positioniert RK3528 für IPTV, OTT und Multimedia-Geräte. Vier Cortex-A53-Kerne übernehmen Anwendungen und Netzwerkaufgaben, spezielle Blöcke Video und Grafik. ArmSoM bestätigt RK3528 für Sige1 als Einstieg zur Softwareprüfung. Das SoC-Blockdiagramm ist keine Liste der Sige1-Anschlüsse.



[![RK3528-Blockdiagramm des Herstellers](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)](/assets/datasheet-series-20261110/rk3528-datasheet-p14.png)

*RK3528-Blockdiagramm des Herstellers — Englische Originalabbildung. `Rockchip RK3528 Datasheet V1.0-20230522.pdf`, PDF p. 14.*



## Daten und Grenzen

| Merkmal | Angabe der Quelle | Auswahlkriterium |
| --- | --- | --- |
| CPU / GPU | 4× Cortex-A53; Mali-450; OpenGL ES 1.1/2.0, OpenVG 1.1 | Keine Zusage für moderne Vulkan-Anwendungen |
| Speicher | 32-bit; DDR3(L)/LPDDR3/DDR4/LPDDR4(4X); 4GB Adressraum | Bestückung und Typ hängen von der Platine ab |
| eMMC | eMMC 5.1, HS400, CMD Queue | Controller-Fähigkeit ist keine dauerhafte Flash-Schreibrate |
| Decoding | H.264/H.265/AVS2 bis 4K×2K@60fps | Format, Profil, Farbtiefe und Player-Pfad abgleichen |
| Encoding | H.264/H.265 bis 1920×1080@60fps; JPEG | Kameraeingang und Treiber separat prüfen |
| Display | HDMI 2.0b; CVBS 480i/576i; HDR10, HLG, Vivid HDR | Monitor, Farbformat, Bandbreite und Software zusammen prüfen |
| Netzwerk | Gigabit-MAC sowie Fast-Ethernet-MAC/PHY-Ressourcen | Sige1-Anschlüsse und Schaltplan sind maßgeblich |

Dieses Datasheet liefert keinen Beleg für eine NPU. Sige1 wird hier deshalb nicht als Plattform mit RKNN-NPU-Beschleunigung beworben. CPU-Ausführung und dedizierte NPU-Beschleunigung sind unterschiedliche Wege.

## USB und PCIe gegeneinander abwägen

Die Fußnote auf S. 13 nennt zwei Kombinationen: `1× USB2 Host + 1× USB2 OTG + PCIe` oder `1× USB2 Host + 1× USB3.0`. USB3 und PCIe sind keine unabhängig gleichzeitig verfügbaren Ressourcen. Für USB-Kamera, externen Datenträger oder Erweiterungscontroller zuerst die Verdrahtung, dann die PHY-Konfiguration im BSP prüfen.

Der Abschnitt PCIe2.1 nennt zugleich Base Specification Revision 3.0, führt aber nur 2.5/5.0Gbps je Lane auf. Diese Abweichung bleibt kenntlich; daraus wird kein PCIe Gen3 mit 8.0Gbps abgeleitet.

## Drei Projektwege mit Sige1

**Digitale Beschilderung und Informationsterminals:** reale Medien auswählen, Hardware-Decoding, Untertitel, Rotation und Audio/Video-Synchronität prüfen. Danach Offline-Wiedergabe, Update-Rollback und Wiederanlauf testen. Maximale Decoder-Auflösung garantiert keine flüssige komplexe Browseranimation im selben System.

**Lokale Medien und leichte Dienste:** Dateifreigabe, Gerätezustandsanzeige oder Wiedergabeverwaltung evaluieren. Netzwerk, Speicher und Protokollaufwand getrennt messen. Verhalten bei vollem Datenträger, beschädigten Dateien und Stromausfall festlegen. Ein Durchsatzwert belegt keine Langzeitzuverlässigkeit.

**Gerätekommunikation und Lehre:** nur dokumentiert herausgeführte Schnittstellen nutzen. Vor dem Anschluss Pegel und Multiplexing prüfen. Diensteverwaltung, Logrotation, Watchdog und Updates gehören ebenfalls zum wartbaren Linux-Gerät.

## Multimedia-Angaben brauchen Bedingungen

Codec-Unterstützung umfasst nicht automatisch jedes Profil, jede Farbtiefe und jeden Container. Dateieigenschaften, Player-Version, Decoder-Gerät, CPU-Last, verlorene Frames, Temperatur und Laufzeit gemeinsam erfassen. Beim Encoding zusätzlich Bitratenregelung, Latenz und Qualität prüfen.

Im HDMI-Abschnitt steht wörtlich `10.2bps`, was nicht zur Größenordnung des Kontexts passt. Hier wird weder stillschweigend eine Einheit ergänzt noch daraus die Ausgabefähigkeit berechnet. Dafür sind aktualisierte Spezifikationen und der konkrete Modus erforderlich.

## Versorgung, Temperatur und Revision

Elektrische Grenzwerte enthalten mehrfach `TBD`, Temperaturfelder `NA`; das Wärmekapitel verlangt separat eine Sperrschichttemperatur unter 125℃. Fehlende Daten sind keine Freigabe ohne Grenzen, Sperrschichttemperatur ist keine Umgebungstemperatur. Passende Versorgung auswählen und Kühlung unter Dauerlast prüfen, bevor das Gehäuse feststeht.

Sige1-Revision, Image, Kernel und Treiber dokumentieren und Display, Netzwerk und Speicher einzeln sowie gemeinsam testen. Bestehende RK3528-Artikel behandeln Schaltplan und PCB; dieser Leitfaden übersetzt die Chipdaten in Auswahl- und Prüffragen.


## Produkte und Entwicklungsunterlagen

- **Sige1** — [Produkt](https://www.armsom.org/sige1) · [Dokumentation](https://docs.armsom.org/armsom-sige1)

<!-- datasheet-series-20261110 -->

## Datenblattserie und Original-PDF

- [RK3528 Übersicht](/de/articles/rk3528-datasheet-v10/)
- [RK3528-Architektur: Speicher, 4K-Video und gemeinsame PHYs](/de/articles/rk3528-architecture-memory-media/)
- [RK3528: Gehäuse und vollständige Tabelle der 401 Balls](/de/articles/rk3528-package-pin-reference/)
- [RK3528: Versorgung, I/O und Wärmewiderstand](/de/articles/rk3528-electrical-power-thermal/)
- [Vollständiges Original-PDF herunterladen](/assets/datasheet-series-20261110/Rockchip-RK3528-Datasheet-V1.0-20230522.pdf)


<!-- datasheet-related-20261110 -->
## Weitere Chipdatenblätter

Diese Links dienen der plattformübergreifenden Recherche; elektrische Bedingungen und Pins sind nicht austauschbar.

- [RK3506B](/de/articles/rk3506b-datasheet-v10/)
- [RK3576](/de/articles/rk3576-datasheet-v10/)
- [RK3588](/de/articles/rk3588-datasheet-v14/)
- [RK3568](/de/articles/rk3568-datasheet-v12/)
- [RK730](/de/articles/rk730-audio-codec-design/)
