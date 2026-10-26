---
title: "Rockchip-Speicherleitfaden: Flash, Startablauf, Partitionen, Programmierung und Vendor Storage"
description: "Rockchip-Speicherleitfaden: Flash, Startablauf, Partitionen, Programmierung und Vendor Storage — RK-SM-YF-017, V2.2.0; BOOTROM, FTL, MTD, GPT."
translation_key: "099-rockchip-storage-application"
slug: "099-rockchip-storage-application"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Flash", "NAND", "EMMC", "Vendor Storage", "RK3588"]
excerpt: "Rockchip-Speicherleitfaden: Flash, Startablauf, Partitionen, Programmierung und Vendor Storage — RK-SM-YF-017, V2.2.0; BOOTROM, FTL, MTD, GPT."
---

{% raw %}

# Rockchip-Speicherleitfaden: Flash, Startablauf, Partitionen, Programmierung und Vendor Storage

Gemeinsame Grundlage ist der vollständige technische Text von RK-SM-YF-017, chinesische V2.2.0, kapitelweise mit dem englischen Original abgeglichen und um dessen zusätzliche Inhalte ergänzt. Das englische Deckblatt nennt V2.5.0, die Änderungstabelle endet jedoch bei V2.2.0; daraus folgt kein durchgehend neuerer technischer Inhalt. Chinesisch verwendet chinesische Originalbilder, Englisch, Russisch und Deutsch englische Originalbilder. Nur im englischen Original vorhandene Zusatzbilder werden in allen Sprachen ausdrücklich zugeordnet. Die Quelle nennt „alle Produkte“ ohne Kernelversion; dies belegt keine Unterstützung jeder ArmSoM-Platine. Dies ist eine Plattformreferenz: SoC, Speichercontroller und Baustein, SDK/BSP, BOOTROM, Loader, U-Boot, Kernel und Partitionierung prüfen. Es erfolgte keine ArmSoM-Hardwarevalidierung. Herstellertests und Preise sind Quellenangaben und historische Beispiele, keine ArmSoM-Messungen, aktuellen Angebote oder Lieferzusagen.

> Sicherheit: Löschen, Flashen, efuse/OTP, Neupartitionierung und Vendor-ID-Schreibzugriffe können Datenverlust oder irreversible Änderungen verursachen. Das Beispiel schreibt ID 1 (SN); nicht auf Produktionsgeräten ausführen. Geräteidentität und Firmware zuerst sichern. Diese Seite führt keine Befehle aus.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-storage-application/EDITORIAL-NOTES.md)

Weitere Quelldokumente (jeweils zu Partitionen, U-Boot, Vendor Storage, Produktionsprogrammierung, offener Flash-Lösung und zwei Speichern):

- `Rockchip_Introduction_Partition`
- `Rockchip-Developer-Guide-UBoot-nextdev-CN`
- `RK Vendor Storage Application Note`
- `Rockchip量产烧录指南_v1.2`
- `Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN`
- `Rockchip_Developer_Guide_Dual_Storage_CN`

<!-- Chinese baseline PDF p.5 -->

## Quellenunterschiede und Vorgehen

Die folgenden Tabellen verwenden einheitlich die freigegebene chinesische V2.2.0. Widersprüchliche englische Werte werden nicht stillschweigend eingesetzt:

- §2.3: Chinesisch nennt für SPI-NOR `5x4 SOP8/8x6 WSON`, Englisch auf Seite 9 nur `5x4 SOP8`. Der vollständigere chinesische Eintrag bleibt erhalten.
- §2.8: Englisch präzisiert auf Seite 17 den SLC-NAND-/Nand-V6-ECC als `16 bits per 1KB`; die chinesische Tabelle nennt `16bits ECC`, der Text in §3.1 zusätzlich `16bits/1KB`. Die englische Präzisierung steht hier, ohne die Quelltabelle umzuschreiben.
- §4.1: Chinesisch nennt auf Seite 23 für RK2108 SD Boot `N`, Englisch auf Seite 25 `Y`. Für RK3328 und RK3399 nennt Chinesisch EMMC/NAND Boot `Y/N`, Englisch für beide `N/Y`. RK3399 SPI NAND lautet chinesisch `Y*1`, englisch `Y`. Die chinesische Zeile `RK3229` entspricht englisch `RK3228`. Diese Quellenwidersprüche müssen geprüft werden; keine Tabelle bestätigt die Startfähigkeit einer Platine.
- §4.2: Englisch schränkt auf Seite 26 die USB1-Zelle von RK3568/RK3566 zusätzlich mit `3.0 OTG (RK3568 Only)` ein; Chinesisch nennt auf Seite 25 nur `3.0 OTG`. Die englische Einschränkung bleibt für Anpassungsprüfungen erhalten; daraus folgt keine allgemeine RK3566-Fähigkeitszusage.
- §4.3: Beide Startreihenfolgetabellen enthalten `EMMC--`; die Schreibweise bleibt bis zur Klärung erhalten. Diagrammumbrüche stammen aus der PDF-Paginierung; beide Teile bleiben ohne Neuzeichnung oder vermutete Verbindungen erhalten.
- §7.2: Der Tabellenpfad `drivers/rkand` widerspricht dem späteren `./drivers/rk_nand/`. Beide bleiben erhalten. API-Namen `vendor_storage_read`, `rk_vendor_write` und Codezeichenfolgen wie `% s` und `% x` werden ebenfalls beibehalten; direkte Kompilierbarkeit und sichere Ausführung sind nicht bestätigt.
- §6.1.4–6.1.5: Beide Quellen vergleichen das Linux-Werkzeug mit dem „Android-Werkzeug“; dies wurde nicht zu Windows geändert. Die ursprüngliche Rücklesebeschreibung von `RB_CHECK_OFF` und die Flag-Polarität sind unklar; Einstellwerte nicht aus dem Namen ableiten.

## 1. Namenskonventionen

| Name | Beschreibung |
| --- | --- |
| SPI Nand | NAND über SPI, meist SLC-NAND |
| SPI Nor | NOR über SPI |
| PP Nand | Parallel peripherals NAND; paralleles NAND, SLC\MLC\TLC NAND |
| Flash | Sammelbegriff für SPI-NAND, SPI-NOR und PP-NAND |
| Nand | Sammelbegriff für NAND-Bausteine einschließlich SPI-NAND und PP-NAND |
| Octal SPI DTR Nor flash | Octal-SPI-NOR-Flash mit Abtastung auf beiden Flanken |
| OCTA flash | Octal-SPI-Flash, einschließlich Octal-SPI-NOR und Octal-SPI-NAND |

<!-- Chinese baseline PDF p.6 -->

## 2. Einführung in Flash-Speicher

### 2.1 Flash-Speichertypen

Im weiteren Sinne umfasst Flash alle nichtflüchtigen Speicher auf Basis von NAND- und NOR-Flash: etwa EMMC und SPI-Flash in RK-Geräten sowie die in den letzten Jahren bekannter gewordenen PCIe-SSDs, SATA-SSDs und UFS. Die folgende Einführung erläutert ihre Unterschiede. Ein Speicherbaustein besteht im Wesentlichen aus Speicher-Die und Schnittstellencontroller, üblicherweise die und controller genannt.

![2.1 Flash-Speichertypen: Originalabbildung, englische Quelle, Seite 7](/docs/rockchip-storage-application/assets/en-p007-figure-01.png)

*2.1 Flash-Speichertypen: Originalabbildung, englische Quelle, Seite 7*

Der Flash-Die speichert letztlich die Benutzerdaten, wie das NAND Flash Array in der Abbildung zeigt. Hersteller fertigen Dies unterschiedlicher Kapazität und kombinieren sie mit verschiedenen Controllern zu Speicherbausteinen für unterschiedliche Branchen. Ein NAND-Flash-Die mit EMMC-Schnittstelle bildet beispielsweise einen EMMC-Baustein, ein NOR-Flash-Die mit SPI-Schnittstelle einen SPI-Flash-Baustein. Wie RK-Chips besitzen auch diese Bausteine üblicherweise interne Firmware. Im Folgenden werden einige Ausführungen beschrieben:

<!-- Chinese baseline PDF p.7 -->

| Baustein | Bausteinaufbau | Hostcontroller | Spezielle Hostsoftware |
| --- | --- | --- | --- |
| SPI Nor | NOR + SPI-Schnittstelle | FSPI/SPI-Controller | Relativ einfach: Ein Dateisystem mit Wear-Leveling und Out-of-place-Updates genügt |
| PP Nand | NAND + parallele Schnittstelle | NandC-Controller | FTL-Algorithmus oder Dateisystem mit FTL |
| SPI Nand | NAND + SPI-Schnittstelle | FSPI/SPI-Controller | FTL-Algorithmus oder Dateisystem mit FTL |
| eMMC | NAND + EMMC-Schnittstelle + FTL-Algorithmus | SDMMC/SDHCI-Controller | MMC-Protokollframework |
| SD-Karte | NAND + SDIO-Schnittstelle + FTL-Algorithmus | SDMMC-Controller | MMC-Protokollframework |
| SATA SSD | NAND + SATA-Schnittstelle + FTL-Algorithmus | Sata-Controller | SATA-Protokollframework |
| NVMe<br>SSD | NAND + PCIe-Schnittstelle + FTL-Algorithmus | PCIe-Controller | NVMe-Protokollframework |
| UFS | NAND + UFS-Schnittstelle + FTL-Algorithmus | UFS-Controller | UFS-Protokollframework |
| ... |  |  |  |

Hinweise:

- Flash-Bausteine entwickeln sich zu schnelleren Schnittstellencontrollern, höherer interner Parallelität und größeren Kapazitäten.
- Neben den genannten verbreiteten Speichern unterstützten RK-Produkte auch SD-NAND in SMD-Gehäusen.
- Alle auf NAND-Flash beruhenden Bausteine benötigen einen FTL-Algorithmus zur NAND-Verwaltung; die Gründe werden im Abschnitt zu den NAND-Grundlagen erläutert.
- PP-NAND und SPI-NAND integrieren keinen eigenen FTL-Algorithmus. Daher muss die Hostsoftware einen FTL oder ein Dateisystem mit FTL bereitstellen.

Die folgende Abbildung erklärt die Beziehung zwischen Die-Herstellern, Speicheranbietern und RK-Controllern:

![2.1 Flash-Speichertypen: Originalabbildung, englische Quelle, Seite 9](/docs/rockchip-storage-application/assets/en-p009-figure-01.png)

*2.1 Flash-Speichertypen: Originalabbildung, englische Quelle, Seite 9*

> Ergänzung aus dem englischen Original (Seite 9): Die FTL-Abhängigkeit von MLC/TLC-NAND, der SoC-Flächenbedarf von NandC und die PP-NAND-Pinzahl führten zum schrittweisen Verzicht auf PP-NAND. Die Quelle beschreibt ihre damaligen Flash-Produkte deshalb überwiegend als SPI-Flash. Dies ist Plattformhintergrund der Quelle, keine Aussage über alle heutigen ArmSoM-Produkte.

<!-- Chinese baseline PDF p.8 -->

### 2.2 Auswahl von Flash-Speicher

SLC-NAND, SPI-NAND und SPI-NOR: Die GigaDevice-Auswahlreferenz erläutert den verfügbaren Flash-Bausteinumfang. Siehe den Link zur GD-Bausteinauswahl.

### 2.3 Kurzvergleich der Flash-Typen

Ein einfacher Vergleich mehrerer primärer Speichertypen für RK:

| Speichertyp | Stabilität | Stückpreis | Gängige Abmessungen und Gehäuse | I/O-Rate | Gängige Kapazität |
| --- | --- | --- | --- | --- | --- |
| EMMC | Good | High | 13x11.5 153 FBGA | 200M DDR<br>(HS400) | >= 1GB |
| SLC Nand | Nornal | Nornal | 20x12 TSOP48 | 30M SDR | 128MB~512MB |
| SPI Nand | Nornal | Low | 8x6 WSON | 133M SDR<br>80M DDR | 64MB~512MB |
| SPI Nor | Good | Low | 5x4 SOP8/8x6 WSON | 166M SDR<br>104M DDR | <= 128MB |
| Octal SPI Nand | Nornal | High | 8x6 24-BALL TFBGA | 120M DDR | 128MB~512MB |
| Octal SPI Nor | Good | High | 8x6 24-BALL TFBGA | 200M DDR | <= 128MB |

Hinweise:

- EMMC bietet hohe Kapazität, relativ hohe Stabilität und schnelle Lese-/Schreibzugriffe, ist aber pro Baustein teurer, benötigt ein größeres Gehäuse und verursacht höheren Initialisierungsaufwand, üblicherweise mehrere hundert Millisekunden.
- SPI-NAND bietet kleine Gehäuse, niedrige Stückpreise und mehr Kapazität als NOR-Flash. ECC und Speicherverwaltungsalgorithmen begrenzen jedoch Lese-/Schreibgeschwindigkeit und Stabilität auf ein eher durchschnittliches Niveau.
- SPI-NOR bietet kleine Gehäuse, hohe Stabilität, niedrige Stückpreise und geringen Software-Initialisierungsaufwand. Besonders bei kleiner Firmware ist die Ladegeschwindigkeit gut; kontinuierliche Übertragung ist jedoch langsamer als bei EMMC, und größere Kapazitäten verteuern den Baustein.
- Wegen der FTL-Abhängigkeit von MLC/TLC-PP-NAND, der großen Chipfläche des NandC-Controllers und vieler Pins hat RK die PP-NAND-Schnittstelle in den letzten Jahren aufgegeben. Kleine Speicher bedeuten daher hauptsächlich SPI-Flash; MLC/TLC-PP-NAND ist in der Tabelle nicht aufgeführt.
- Preise gelten nur pro Baustein; der Preis je MB sinkt mit steigender Kapazität.

### 2.4 Gängige Flash-Gehäuse

Vergleich mehrerer Gehäuseformen:

<!-- Chinese baseline PDF p.9 -->

![2.4 Gängige Flash-Gehäuse: Originalabbildung, englische Quelle, Seite 10](/docs/rockchip-storage-application/assets/en-p010-figure-01.png)

*2.4 Gängige Flash-Gehäuse: Originalabbildung, englische Quelle, Seite 10*

![2.4 Gängige Flash-Gehäuse: Originalabbildung, englische Quelle, Seite 11](/docs/rockchip-storage-application/assets/en-p011-figure-01.png)

*2.4 Gängige Flash-Gehäuse: Originalabbildung, englische Quelle, Seite 11*

Übliche Gehäuse für SLC-NAND/SPI-Flash:

<!-- Chinese baseline PDF p.10 -->

![2.4 Gängige Flash-Gehäuse: Originalabbildung, englische Quelle, Seite 11](/docs/rockchip-storage-application/assets/en-p011-figure-02.png)

*2.4 Gängige Flash-Gehäuse: Originalabbildung, englische Quelle, Seite 11*

Einführung zu Gehäusen

<!-- Chinese baseline PDF p.11 -->

### 2.5 Flash-Preise

| Speichertyp | Kapazität | Preis (USD) |
| --- | --- | --- |
| SPINand | 1Gbits QPI Consumer | 0.53 |
| SPINand | 2Gbits QPI Consumer | 0.75 |
| SPINand | 4Gbits QPI Consumer | 1.7 |
| SPI-NAND (begrenzte Bausteinauswahl für Continuous read mode) | Gegenüber Bausteinen gleicher Kapazität | Etwa +30% |
| PP | 1Gbits QPI Consumer | 0.6 |
| PP | 2Gbits QPI Consumer | 1.7 |
| PP | 4Gbits QPI Consumer | 3.8 |
| Nor | 32Mbits QPI Consumer | 0.15 |
| Nor | 64Mbits QPI Consumer | 0.19 |
| Nor | 128Mbits QPI Consumer | 0.35 |
| Nor | 256Mbits QPI Consumer | 1.0 |
| Nor | 512Mbits QPI Consumer | 2.5 |
| Nor | 1Gbits QPI Consumer | 5.5 |
| Nor | 2Gbits QPI Consumer | 11.5 |
| Nor | 256Mbits OPI Auto | 2.1 |
| Nor | 512Mbits OPI Auto | 3.6 |

Hinweise:

- Die obigen Preise sind Marktangebote bestimmter Hersteller ohne Aufschlag für die Kundenabstimmung.
- Sie zeigen vor allem Preisunterschiede zwischen Speichertypen und den Preisanstieg mit wachsender Kapazität innerhalb desselben Typs.

<!-- Chinese baseline PDF p.12 -->

### 2.6 NAND-Grundlagen

Physischer Aufbau eines NAND-Flash-Arrays am Beispiel einer üblichen SLC-NAND-Struktur:

![2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 13](/docs/rockchip-storage-application/assets/en-p013-figure-01.png)

*2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 13*

Hinweise:

- SLC-NAND besteht aus mehreren Flash-Blöcken, üblicherweise 1024, 2048 oder 4096; die Abbildung zeigt 2048 Blöcke.
- Ein Block ist die kleinste Löscheinheit. SLC-NAND-Blöcke sind meist 128KB oder 256KB groß; Löschen ändert logisch 0 zu 1.
- Ein Block umfasst üblicherweise 64 Seiten, bei manchen Bausteinen bis zu 128.
- Eine Seite ist die grundlegende Programmier- und Leseeinheit. SLC-NAND-Seiten sind meist 2KB oder 4KB groß; Programmieren ändert logisch 1 zu 0.
- Logische 0 und 1 entsprechen physisch Spannungspegeln in den einzelnen Bitzellen.

Das folgende Beispiel zeigt SLC-NAND mit Floating-Gate-Technik:

<!-- Chinese baseline PDF p.13 -->

![2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 14](/docs/rockchip-storage-application/assets/en-p014-figure-01.png)

*2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 14*

Flash speichert Daten tatsächlich im internen Floating Gate. Spannungen an Control Gate und Substrat bestimmen, ob Ladung ein- oder austritt. Logisch 0 oder 1 hängt davon ab, ob die durch gespeicherte Ladung erzeugte Spannung einen bestimmten Schwellwert Vth überschreitet:

- Beim NAND-Programmieren lädt eine hohe Control-Gate-Spannung das Floating Gate auf. Oberhalb Vth wird 0 dargestellt.
- Data Retention: Ladung gelangt unter hoher Spannung ins Floating Gate und bleibt ohne Löschvorgang erhalten; das elektrische Feld zwischen Gate und Substrat bewirkt jedoch allmählichen Ladungsverlust.
- P/E Cycle: Mit zunehmenden Program/Erase-Zyklen altert das Oxid zwischen Floating Gate und Substrat, was die Ladungsspeicherung beeinträchtigt.
- Beim NAND-Löschen entlädt eine hohe Substratspannung das Floating Gate. Unterhalb Vth wird 1 dargestellt.

Wordline- und Bitline-Aufbau: Hilfsschaltungen ermöglichen das effiziente Laden/Entladen Tausender NAND-Zellen. Seriell verbundene Zellen bilden NAND-Strings mit Bit Line und Source line an den Enden. Jedes Control Gate ist mit einer Wordline verbunden; die gemeinsam gesteuerten Zellen bilden eine logische Seite. Zusammen bilden sie einen Block mit gemeinsamem Substrat, weshalb ein Block die kleinste Löscheinheit ist.

<!-- Chinese baseline PDF p.14 -->

![2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 15](/docs/rockchip-storage-application/assets/en-p015-figure-01.png)

*2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 15*

![2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 15](/docs/rockchip-storage-application/assets/en-p015-figure-02.png)

*2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 15*

<!-- Chinese baseline PDF p.15 -->

Quelle der Bitline-Abbildung. SLC/MLC/TLC/QLC-Grundlagen: Bitline steuert Laden und Entladen und damit den Zellpegel. Über die Ladungsmenge kann eine einzelne Bitzelle außerdem unterschiedliche Pegel darstellen:

- SLC (Single Level Cell): 1 Bit pro Zelle, zwei logische Pegel 0/1.
- MLC: 2 Bit, vier Pegel 0–3.
- TLC: 3 Bit, acht Pegel 0–7.
- QLC: 4 Bit, sechzehn Pegel 0–15.

![2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 16](/docs/rockchip-storage-application/assets/en-p016-figure-01.png)

*2.6 NAND-Grundlagen: Originalabbildung, englische Quelle, Seite 16*

Abbildung aus dem Internet.

Versagt die Ladungsspeicherung einer Bitzelle, entstehen Bitfehler. Die NAND-Struktur kann instabile Spannungen beim Laden/Entladen sowie physische Alterung durch Programmier-/Löschverschleiß verursachen. Dadurch kann sich die Ladung und damit der logische Pegel ändern: Ein Bit kippt. Für Benutzer äußert sich dies als Datenfehler, Firmwarestörung oder Dateisystembeschädigung. NAND-Produkte integrieren deshalb ECC-Verfahren unterschiedlicher Stärke, um Lebensdauer und Robustheit zu erhöhen.

Aus den physikalischen Grundlagen ergeben sich folgende NAND-Eigenschaften:

- Out-of-Place-Update: NAND-Programmierung ändert eine Zelle nur von 1 zu 0; vor erneutem Programmieren ist daher Löschen erforderlich. Programmieren erfolgt seitenweise, Löschen blockweise über mehrere Seiten. Würde dieselbe logische Adresse immer am selben physischen Ort aktualisiert, wäre jedes Mal ein Löschvorgang nötig. Da Löschen Zeit kostet und Flash verschleißt, bildet FTL aktualisierte Daten gewöhnlich auf einen neuen Ort ab.

<!-- Chinese baseline PDF p.16 -->

- Begrenzte P/E-Zahl: Jeder NAND-Block besitzt eine begrenzte Löschzyklenzahl. Nach genügend Zyklen wird der Block instabil, geschriebene Daten werden fehleranfällig und Löschen kann scheitern. SLC-NAND älterer Fertigungsprozesse erreichte gewöhnlich 100K Zyklen; neuere kostengünstigere Prozesse können geringere Lebensdauer aufweisen.
- Höhere Leistung: Anders als mechanische Festplatten benötigt Flash keine Mechanik oder Suchbewegung, weshalb der Adresszugriffsaufwand überall ähnlich ist. Besonders zufälliges Lesen ist bei SSDs wesentlich schneller. Obwohl zufällige und sequenzielle Zugriffe damit theoretisch gleich schnell sein könnten, unterstützen Flash-Bausteine Cache-Operationen: Bei sequenziellem Lesen wird die nächste Seite vorab in interne Register geladen. Sequenzielle Zugriffe sind daher schneller.
- Unterschiedliche Lese-/Schreibgeschwindigkeit: Elektronen in das Floating Gate einzubringen (Schreiben) dauert länger, als dessen elektrischen Zustand zu erkennen (Lesen). FTL versucht deshalb Schreib- und Löschvorgänge zu minimieren.

### 2.7 NOR-Grundlagen

NOR beruht auf ähnlichen Prinzipien wie NAND, mit folgenden Unterschieden:

- Die Bitzelle funktioniert ähnlich, ihre beiden Enden sind jedoch direkt mit Bit Line und Source line verbunden. Dies ist stabiler; NOR benötigt gegen physische Alterung gewöhnlich keine ECC, obwohl sehr seltene Bitfehler möglich bleiben. Die umgebende Schaltung ist komplexer, wodurch der Die bei gleicher Kapazität teurer wird.
- Block- und Seitengrößen unterscheiden sich von NAND.
- Übliche Löscheinheiten sind Block und Sector mit 64KB beziehungsweise 4KB.
- Die grundlegende Programmiereinheit page beträgt gewöhnlich 256B.

### 2.8 ECC-Abhängigkeit von NAND

Integration bei RK:

| Bausteintyp | Hostcontroller | ECC bereitgestellt durch |
| --- | --- | --- |
| EMMC | Kein Host-ECC erforderlich | EMMC-Baustein |
| SPI Nand | Ohne ECC | SPI-NAND-Baustein |
| SLC Nand | Nand V6 verwendet 16-Bit-ECC | NandC-Controller |
| MLC TLC Nand | Nand V9 verwendet 16-Bit-ECC oder stärkeren ECC | NandC-Controller |

Hinweis: Manche SLC-NAND-Bausteine enthalten ECC. Andere PP-NAND-Bausteine integrieren keine ECC und benötigen die ECC des Controllers.

### 2.9 Werkseitige fehlerhafte NAND-Blöcke

Aufgrund der physikalischen Eigenschaften von NAND-Flash ist ein gewisser Anteil werkseitig fehlerhafter Blöcke zulässig. Bei der Fertigung werden entsprechende Markierungen in einem bestimmten Flash-Bereich gesetzt, meist im ersten Spare-Byte, auch OOB-Bereich genannt. Diese Markierungen dürfen gewöhnlich nicht zerstört werden. W25N01GV SPI-NAND bildet eine Ausnahme.

<!-- Chinese baseline PDF p.17 -->

### 2.10 NAND-Lebensdauer und ECC-Fehler

Die NAND-Lebensdauer wird gewöhnlich durch P/E-Zyklen (Löschen/Schreiben) beschrieben. Nach einer bestimmten Zahl können Bausteine ausfallen. In den Quellentests zeigten einzelne minderwertige Bausteine bereits bei etwa 30K Zyklen Auffälligkeiten. Weicht dies von Herstellerangaben ab, soll der Kunde den Hersteller zur Diagnose kontaktieren.

Nahe dem Lebensdauerende treten typischerweise folgende Warnungen auf:

- Gelesene Bitfehler erreichen die Schwelle für einen Daten-Refresh.
- Die Daten bleiben gültig und die Nutzung normal.

Bei erreichter oder überschrittener Lebensdauer sind möglich:

- Bitfehler erfordern einen Refresh; Daten bleiben gültig und die Nutzung normal.
- ECC fail beim Lesen: Daten sind ungültig. Wiederholungsversuche auf niedriger Ebene können hohe CPU-Last im Thread verursachen.
- Teilweiser Datenverlust führt zu Fehlern höherer Ebenen.
- Lösch-/Schreibfehler: Der Block wird als fehlerhaft markiert, ohne Nutzung oder Datenbestand zu beeinträchtigen.

### 2.11 Schlüsseltechnologien von NAND-FTL-Algorithmen

- Adressabbildung: Ein Flash-Gerät ist eine Blackbox mit NAND-Flash und FTL. Anwendungen verwenden logische Adressen; FTL bildet sie auf physische Adressen ab und verwaltet den jeweils neuesten Datenort.
- Garbage Collection: Beim Schreiben werden Teile der Daten in Blöcken ungültig. Gültige Daten werden verschoben, anschließend wird der Block für neue Daten gelöscht.
- Wear Leveling und Bad-Block-Verwaltung: Jeder Block hat begrenzte P/E-Lebensdauer. Ohne Ausgleich könnten manche Blöcke ständig genutzt und beschädigt werden, während selten angesprochene Blöcke unberührt bleiben. FTL gleicht die Nutzung durch Garbage Collection und Verwaltung des freien Blockpools aus; idealerweise erreichen alle Blöcke gemeinsam die Verschleißgrenze. Da Flash werkseitige Defektblöcke enthält und weitere Blöcke im Betrieb altern, meidet FTL unbrauchbare Blöcke und kopiert Daten instabiler Blöcke rechtzeitig an stabile Orte.

### 2.12 Entwicklung der NAND-Lösungen (PP-NAND und SPI-NAND)

- Frühe RK-Produkte unterstützten nur die geschlossene FTL-Lösung rkflash, hauptsächlich RK3326, RK3308 und RV1108.
- Kundenanforderungen an UBIFS, MTD und das Flashen per Programmiergerät erforderten das MTD-Speichertreiberframework.
- Ab RK3308 sind Treiber, Algorithmen und Dateisystem dieser Lösung offen; intern wird sie daher als MTD-Open-Source-Lösung von der geschlossenen Lösung unterschieden.
- RK3308 liefert den Low-Level-Treiber; leistungsfähige Kunden integrieren die oberen Schichten selbst.
- Das RK3308-Produktteam stellte früher eine SDK-Konfiguration für eine offene PP-SLC-NAND-MTD-Lösung bereit.
- Anschließend wechselten SDKs vollständig zu MTD Open Source, mit ausführlicherer Unterstützung und Anleitung:

<!-- Chinese baseline PDF p.18 -->

RV1126, RK3568 und spätere Chips.

### 2.13 Flash-Hostcontroller

#### 2.13.1 SFC-Controller

Der Serial Flash Controller (SFC) steuert Übertragungen zwischen dem Chipsystem und seriellen NOR-/NAND-Flash-Bausteinen. Merkmale:

- Unterstützung für SPI-NOR und SPI-NAND.
- SPI-NOR-Übertragung über 1, 2 und 4 Leitungen.
- DMA-Übertragung.

#### 2.13.2 FSPI-Controller

FSPI (Flexible Serial Peripheral Interface) ist ein flexibler serieller Übertragungscontroller und ein neuer SFC-Entwurf. Der geänderte Name berücksichtigt den veränderten Umfang unterstützter Geräte. Merkmale:

- SPI-NOR, SPI-NAND sowie PSRAM und SRAM mit SPI-Protokoll.
- SPI-NOR-Übertragung über 1, 2 und 4 Leitungen; ab Version 8 auch 8-Leitungs-DDR.
- XIP-Technik.
- DMA-Übertragung.

#### 2.13.3 NandC-Controller

NandC überträgt Daten zwischen NAND-Flash und Hauptchip und unterstützt direkte Transfers als AHB-Bus-Master. Für unterschiedliche Anwendungen besitzt RK hauptsächlich zwei Versionen: den umfangreich integrierten NandC V9 und den vereinfachten, flächensparenden NandC V6. Die Auswahl richtet sich gewöhnlich nach der Marktpositionierung des Chips. NandC V6 unterstützt nur SLC-NAND und wird meist in Produkten kleiner Speicherkapazität eingesetzt, gewöhnlich unter 512MB. NandC V9 unterstützt MLC und TLC und eignet sich für größere Kapazitäten.

#### 2.13.4 Allgemeine SPI-Schnittstelle

FSPI ist eine dedizierte SPI-Flash-Schnittstelle. RK-SoCs besitzen gewöhnlich zusätzlich mehrere allgemeine SPI-Schnittstellen für externe SPI-Flash-Bausteine; diese Geräte können jedoch üblicherweise nicht als bootdev dienen.

### 2.14 Statistik der SPI-Flash-Ausgangsverzögerung

Übersicht:

<!-- Chinese baseline PDF p.19 -->

|  | 1.8 V | 3.3 V | 1.65-3.6 |
| --- | --- | --- | --- |
| FORESEE |  | < 8 ns |  |
| BIWIN |  | < 9 ns |  |
| Dosilicon | <10 ns | <8 ns |  |
| ESMT |  | <8 ns |  |
| Toshiba |  | <6 ns |  |
| WINBONG |  | <7 ns |  |
| MXIC |  | <8 ns |  |
| MXIC (SPI NOR) |  |  | <12 ns(30 pf)<10 ns(15 pf) |

Hinweis: Maßgeblich ist das Datenblatt des konkreten Bausteins; die Tabelle dient nur als Referenz.

<!-- Chinese baseline PDF p.20 -->

## 3. Validierung von Speicherbausteinen

### 3.1 Überblick zur Validierung von SLC-NAND/SPI-NAND/SPI-NOR

Prüferläuterung: Bausteine kleiner Kapazität sind relativ stabil und meist gut mit dem Hauptcontroller kompatibel. Die meisten werden deshalb nur funktional geprüft; Zuverlässigkeit und Stabilität beruhen hauptsächlich auf umfangreichen Herstellertests und deren Berichten.

**1.** Funktionsprüfung

**2.** Grundlegende Zuverlässigkeitsprüfung über die Produktlebensdauer

**3.** Prüfung der Softwarekompatibilität und -stabilität

| Speichertyp | Funktionsvalidierung | Bausteinzuverlässigkeitsprüfung | Software-Kompatibilitäts- und Stabilitätsprüfung |
| --- | --- | --- | --- |
| SPI Nor | Y | N*1 | N |
| SPI Nand | Y | Y | TBD*2 |
| SLC Nand | Y | N*3 | TBD*2 |

Anmerkungen:

**1.** SPI-NOR wird nur funktional geprüft, da es relativ stabil und kompatibel ist und Grenzfälle sehr große Testumfänge erfordern. Zuverlässigkeit und Stabilität werden vom Bausteinhersteller abgesichert.

**2.** TBD: Entsprechende Tests erfolgen nur bei Bausteinen mit größeren Kompatibilitätsänderungen oder wesentlich aktualisierten Speichertreibern. Üblicherweise wird dieser Test nicht ausgeführt.

**3.** Bei SLC-NAND liefert hauptsächlich der RK-NAND-Controller die ECC mit bis zu 16bits/1KB Korrektur. Dadurch bestehen hohe Redundanz und Stabilität; weitere Baustein-Zuverlässigkeitstests erfolgen nicht. Zuverlässigkeit und Stabilität verantwortet der Hersteller.

Prüfverfahren:

**1.** Funktionsprüfung: Controllerkompatibilität, erfolgreicher Systemstart, normale Grundfunktionen und bestandener Flash-Stresstest mit 10 Durchläufen.

**2.** Baustein-Zuverlässigkeit. Retention-Test: Nach einem bestimmten Anteil von P/E-Zyklen folgt ein Temperatur-Burn-in zur Simulation der Produktlebensdauer.

**3.** Prüfung der Softwarekompatibilität und -stabilität bei abruptem Stromausfall; empfohlen wird das tatsächliche Produkt.

Stromausfalltest:

- Einmal pro Minute die Versorgung abschalten.
- Nach dem Einschalten Linux starten.
- Während der Betriebszeit kontinuierlich mit dd lesen/schreiben, ohne Datenvergleich; geprüft wird hauptsächlich die Integrität der FTL-Datenverschiebung.

<!-- Chinese baseline PDF p.21 -->

7 Tage fortsetzen; dies erfüllt die Grundanforderungen der meisten Produkte: etwa 10K Lese-/Schreibvorgänge und rund 10.000 Stromunterbrechungen.

### 3.2 Überblick der Anforderungen an RK-Flash-Muster

#### 3.2.1 Voraussetzungen der Validierung

Allgemeine Hinweise:

**1.** Speicher kleiner Kapazität umfasst SLC-PP-NAND, SPI-NAND und SPI-Flash.

**2.** Vorrangig sollen verbreitete, aktuell vertriebene Bausteine eingereicht werden.

**3.** Dieser Kanal dient der Treiberprüfung; geschäftliche Empfehlungen werden derzeit nicht gegeben.

**4.** Die Freigabeliste kleiner Speicher wird gewöhnlich alle 1–2 Monate aktualisiert. Die tatsächliche Prüfdauer variiert; die Prüfung ist jedoch vor der Listenaktualisierung abgeschlossen.

**5.** Mindestens 10 pcs zusammen mit dem zugehörigen Bausteindatenblatt einreichen.

**6.** Dringend benötigte Kundenbausteine werden bevorzugt geprüft.

Besondere Hinweise für SPI-NAND:

**1.** Der Baustein muss ein eigenes ECC-Modul enthalten; andernfalls wird er nicht unterstützt, da der RK-Controller kein ECC-Modul integriert.

**2.** Am Flash-Ende dürfen keine aufeinanderfolgenden Defektblöcke liegen, da sonst die dortige Bad-Block-Tabelle beschädigt wird. Ohne Lösung dieses Problems ist keine Unterstützung möglich.

**3.** Ein Odd-Plane-Block muss ohne Plane-Select-Bits auswählbar sein. Manche Bausteine mit zwei Planes benötigen diese Bits in der übertragenen Adresse zur Auswahl der ungeraden Plane. Solche Bausteine haben RK-Kompatibilitätsprobleme, erfordern Treiberanpassungen und werden nicht empfohlen.

Besondere Hinweise für SPI-NOR:

**1.** SPI-NOR erfordert tRST unter 200us.

#### 3.2.2 Validierungsablauf

Interne Funktions- und Stresstests prüfen die Kompatibilität zwischen Baustein und Controller. Die eigene Bausteinstabilität und das Lastverhalten richten sich nach Herstellerangaben. Geprüft wird nur auf repräsentativen Plattformen. RK-Controller für kleine Speicher nutzen kompatibles IP; RK3568-Prüfungen decken daher die meisten SoCs mit entsprechendem Controller ab. Beispielsweise ist auf RK3568 geprüfter SPI-NAND mit RV1126 und RK3308 kompatibel.

#### 3.2.4 Bereitstellung von Kundenpatches

Neue Flash-Bausteine, insbesondere SPI-Flash, benötigen nach der Prüfung üblicherweise einen Quellcodepatch. Kunden mit Treiberbedarf sollen eine Anfrage auf RK Redmine stellen; das Patchpaket wird anschließend online bereitgestellt.

<!-- Chinese baseline PDF p.22 -->

## 4. Gerätestartablauf

Der Bootprozess ist der Softwareablauf vom Einschalten bis zum abgeschlossenen Systemstart. Die folgende Abbildung zeigt den Linux-Start:

![4. Gerätestartablauf: Originalabbildung, englische Quelle, Seite 24](/docs/rockchip-storage-application/assets/en-p024-vector-01.png)

*4. Gerätestartablauf: Originalabbildung, englische Quelle, Seite 24*

<!-- Chinese baseline PDF p.23 -->

### 4.1 BOOTROM-Startunterstützung der RK-SoCs

| Chip | Emmc Boot | Nand Boot | SPI NAND Boot | SD Boot | SPI NOR Boot |
| --- | --- | --- | --- | --- | --- |
| RV1108 | Y | Y | Y | Y | Y |
| RV1126/RV1109 | Y | Y | Y | Y | Y |
| RK2108 | Y | N | N | N | Y |
| RK2206 | Y | N | N | Y | Y |
| RK3036 | Y | Y | Y | Y | Y |
| RK3126C | Y | Y | Y*1 | Y | Y |
| RK3128 | Y | Y | Y | Y | Y |
| RK3229 | Y | Y | Y*1 | Y | Y |
| RK3288 | Y | Y | Y | Y | Y |
| RK3308 | Y | Y | Y | Y | Y |
| RK3326/PX30 | Y | Y | Y*1 | Y | Y |
| RK3328 | Y | N | Y*1 | Y | Y |
| RK3368/PX5 | Y | Y | Y*1 | Y | Y*1 |
| RK3399 | Y | N | Y*1 | Y | Y |
| RK3568/RK3566 | Y | Y | Y | Y | Y |
| RK3588 | Y | N | Y | Y | Y |
| RV1106/RV1103 | Y | N | Y | Y | Y |
| RK3528 | Y | N | Y | Y | Y |
| RK3562 | Y | N | Y | Y | Y |

*1: Von der Chiphardware unterstützt, nicht jedoch vom veröffentlichten SDK-Entwicklungspaket.

<!-- Chinese baseline PDF p.24 -->

### 4.2 Speicherschnittstellen der RK-SoCs

| AP | NANDC | SPI0 | SPI1 | SPI2 | SFC | SD | SDIO | EMMC | USB0 | USB1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RK3188 | 60bits MLC<br>SLC | Boot |  | - | - | SD<br>3.0 | SDIO<br>3.0 | SD50<br>DDR50 | 2.0 Host | 2.0 OTG |
| RK3128 | 60bits MLC<br>SLC |  | - | - | Boot | SD<br>3.0 | SDIO<br>3.0 | SD50<br>DDR50 | 2.0 Host | 2.0 OTG |
| RK3126 | 60bits MLC<br>SLC |  | - | - | Boot | SD<br>3.0 | SDIO<br>3.0 | SD50<br>DDR50 | 2.0 Host | 2.0 OTG |
| RK3036 | 60bits MLC<br>SLC |  | - | - | Boot | SD<br>3.0 | SDIO<br>3.0 | SD50<br>DDR50 | 2.0 Host | 2.0 OTG |
| RK3288 | 60bits MLC<br>SLC |  |  | Boot | - | SD<br>3.0 | SDIO<br>3.0 | HS200 | 2.0 Host | 2.0 OTG |
| RK3399 | - | - | Boot | - | - | SD<br>3.0 | SDIO<br>3.0 | HS400<br>HS200 | 3.0 OTG<br>TYPEC | 3.0 OTG<br>TYPEC |
| RK3368 | 60bits MLC<br>SLC |  |  |  | Boot | SD<br>3.0 | SDIO<br>3.0 | HS200 | 2.0 Host | 2.0 OTG |
| RK3228 RK3229 | 60bits MLC<br>SLC | Boot | - | - | - | SD<br>3.0 | SDIO<br>3.0 | HS200 | 2.0 Host | 2.0 OTG |
| RK3328 | - |  |  | Boot |  | SD<br>3.0 | SDIO<br>3.0 | HS200 | 2.0 Host | 3.0 OTG |
| RK3228H | - |  |  | Boot |  | SD<br>3.0 | SDIO<br>3.0 | HS200 | 2.0 Host | 3.0 OTG |
| RK3128X | 60bits MLC<br>SLC | Boot | - | - | - | SD<br>3.0 | SDIO<br>3.0 | SD50<br>DDR50 | 2.0 Host | 2.0 OTG |
| RV1107 RV1108 | 16bits SLC |  |  |  | Boot | SD<br>3.0 | SDIO<br>3.0 | HS200 | - | 2.0 OTG |
| RV1109 RV1126 | 16bits SLC |  |  |  | Boot | SD<br>3.0 | SDIO<br>3.0 | HS200 | - | 2.0 OTG |
| RK3308 | 16bits SLC |  |  |  | Boot | SD<br>3.0 | SDIO<br>3.0 | HS200 |  |  |
| RK3326 | 70bits TLC<br>MLC SLC |  |  |  | Boot | SD<br>3.0 | SDIO<br>3.0 | HS200 |  |  |
| RKPX3 | 60bits MLC<br>SLC | Boot |  | - | - | SD<br>3.0 | SDIO<br>3.0 | SD50<br>DDR50 | 2.0 Host | 2.0 OTG |
| RKPX3SE | 60bits MLC<br>SLC |  |  |  | Boot | SD<br>3.0 | SDIO<br>3.0 | SD50<br>DDR50 |  |  |
| RKPX5 | 60bits MLC<br>SLC |  |  |  | Boot | SD<br>3.0 | SDIO<br>3.0 | HS200 | 2.0 Host | 2.0 OTG |
| RKPX30 | 70bits TLC<br>MLC SLC |  |  |  | Boot | SD<br>3.0 | SDIO<br>3.0 | HS200 |  |  |
| RK1608 | - | Boot | - | - | - | - | - | - |  |  |
| RK1808 | - |  |  |  | Boot | - | - | HS200 |  |  |

<!-- Chinese baseline PDF p.25 -->

| AP | NANDC | SPI0 | SPI1 | SPI2 | SFC | SD | SDIO | EMMC | USB0 | USB1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RK3568 RK3566 | 70bits TLC<br>MLC SLC |  |  |  | Boot | SD<br>3.0 | SDIO<br>3.0 | HS200 | 2.0 Host | 3.0 OTG |
| RK3588 | - | - | - | - | Boot | SD<br>3.0 | SDIO<br>3.0 | HS400 | 2.0 Host | 3.0 OTG |
| RV1106/RV1103 | - | - | - | - | Boot | SD<br>3.0 | - | HS50 |  |  |
| RK3528 | - | - | - | - | Boot | SD<br>3.0 | SDIO<br>3.0 | HS400 | 2.0 Host | 3.0 OTG |
| RK3562 | - | - | - | - | Boot | SD<br>3.0 | SDIO<br>3.0 | HS400 | 2.0 Host | 3.0 OTG |

Hinweis: „Boot“ bei SPIx oder SFC bedeutet, dass BOOTROM über diese SPI-/SFC-Schnittstelle starten kann.

### 4.3 BOOTROM-Ablauf

Nach dem Einschalten eines RK-Chips läuft zuerst der unveränderbare, im Chip integrierte Maskencode BOOTROM. Sowohl AP als auch MCU enthalten ihn. BOOTROM erkennt externe Speicher und lädt deren Loader-Code. Die Abfragereihenfolge unterscheidet sich je nach Chip. Das folgende Ablaufdiagramm zeigt ein BOOTROM-Startbeispiel:

![4.3 BOOTROM-Ablauf: Originalabbildung, englische Quelle, Seite 28](/docs/rockchip-storage-application/assets/en-p028-vector-01.png)

*4.3 BOOTROM-Ablauf: Originalabbildung, englische Quelle, Seite 28*

![4.3 BOOTROM-Ablauf: Originalabbildung, englische Quelle, Seite 29](/docs/rockchip-storage-application/assets/en-p029-vector-01.png)

*4.3 BOOTROM-Ablauf: Originalabbildung, englische Quelle, Seite 29*

<!-- Chinese baseline PDF p.27 -->

Hinweise:

- Manche Chips wählen den von BOOTROM abgefragten Speicher über unterschiedliche ADC-Key-Eingangspegel. Schlägt diese Abfrage fehl, folgt direkt der Maskrom-Modus.
- Zur Speichererkennung wird gewöhnlich die Geräte-ID gelesen, um ein externes Gerät festzustellen.
- Ohne gültige Firmware auf irgendeinem Gerät wartet der Maskrom-Modus auf Download über eine vorgesehene Schnittstelle wie USB/UART. Nicht alle Chips unterstützen USB-/UART-Updates.

<!-- Chinese baseline PDF p.28 -->

BOOTROM-Startreihenfolge je Chip

| AP | No.1 | No.2 | No.3 | No.4 | No.5 | No.6 |
| --- | --- | --- | --- | --- | --- | --- |
| RK3188 | SD0 | NAND | SPI NOR(SPI0) | SPI NAND(SPI0) | EMMC | USB |
| RK3128 | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RK3126(B) | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RK3036 | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RK3288 | NAND | EMMC | SPI NOR(SPI2) | SPI NAND(SPI2) | SD0 | USB |
| RK3399 | SPI NOR(SPI2) | SPI NAND(SPI2) | EMMC | SD0 | USB | -- |
| RK3368 | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RK3228/9 | NAND | EMMC | SPI NOR(SPI2) | SPI NAND(SPI2) | SD0 | USB |
| RK3328 | EMMC | SPI NOR(SPI2) | SPI NAND(SPI2) | SD0 | USB | -- |
| RK3228H | EMMC | SPI NOR(SPI2) | SPI NAND(SPI2) | SD0 | USB | -- |
| RK3128X/H | NAND | EMMC | SPI NOR(SPI2) | SPI NAND(SPI2) | SD0 | USB |
| RV1107/8 | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RV1109 | SPI NOR(SFC) | SPI NAND(SFC) | NAND | EMMC | SD0 | USB |
| RV1126 | SPI NOR(SFC) | SPI NAND(SFC) | NAND | EMMC | SD0 | USB |
| RK3308 | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RK3326 | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RKPX3 | SD0 | NAND | SPI NOR(SPI0) | SPI NAND(SPI0) | EMMC | USB |
| RKPX3SE | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RKPX5 | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RKPX30 | NAND | EMMC | SPI NOR(SFC) | SPI NAND(SFC) | SD0 | USB |
| RK1608 | SPI SLAVE | SPI NOR(SPI2) | SPI NAND(SPI2) | -- | -- | -- |
| RK1808 | SPI SLAVE | SPI NOR(SFC) | SPI NAND(SFC) | EMMC | USB | -- |
| RK3399PRO | SPI NOR(SPI2) | SPI NAND(SPI2) | EMMC | SD0 | USB | -- |
| RK3568 | SPI NOR(SFC) | SPI NAND(SFC) | NAND | EMMC | SD0 | USB |
| RK3566 | SPI NOR(SFC) | SPI NAND(SFC) | NAND | EMMC | SD0 | USB |
| RK3588 | SPI NOR(SFC) | SPI NAND(SFC) | EMMC-- | SD0 | USB |  |
| RV1106/RV1103 | SPI NOR(SFC) | SPI NAND(SFC) | EMMC-- | SD0 | USB/UART |  |
| RK3528 | SPI NOR(SFC) | SPI NAND(SFC) | EMMC-- | SD0 | USB |  |
| RK3562 | SPI NOR(SFC) | SPI NAND(SFC) | EMMC-- | SD0 | USB |  |

<!-- Chinese baseline PDF p.29 -->

### 4.4 Pre-Loader-Ablauf

Ein RK-SDK-Build erzeugt gewöhnlich MiniloaderAll.bin mit zwei Hauptfunktionen: den Flashvorgang ermöglichen und das IDB-Image schreiben. Das IDB-Image ist der aus MiniloaderAll.bin entpackte Nutzinhalt, auch idblock genannt, und wird letztlich in Flash geschrieben. Es kombiniert üblicherweise ddr.bin und Pre Loader; manche Chips unterstützen weitere Funktionsimages. Die Quelle unterscheidet drei Haupttypen: geschlossener miniloader, U-Boot SPL und loader.

#### 4.4.1 Miniloader

Einführung: miniloader ist die geschlossene Pre-Loader-Firmware von RK und wird gewöhnlich zusammen mit ddr.bin und usbplug.bin als loader.bin gepackt. Der Aufbau folgt unten:

![4.4.1 Miniloader: Originalabbildung, englische Quelle, Seite 31](/docs/rockchip-storage-application/assets/en-p031-figure-01.png)

*4.4.1 Miniloader: Originalabbildung, englische Quelle, Seite 31*

Erläuterungen:

**1.** ddr.bin: DDR-Initialisierungsfirmware, kurz 471.

**2.** usbplug.bin: Laufzeitfirmware zur Durchführung des Flashens, kurz 472.

**3.** miniloader.bin: geschlossene Pre-Loader-Firmware.

**4.** MiniloaderAll.bin: einheitlicher SDK-Dateiname, tatsächlich die gepackte loader.bin des jeweiligen Chips.

**5.** Beim Update extrahieren RK-Werkzeuge idblock.bin aus loader.bin, aktualisieren es und legen mehrere Sicherungskopien an.

**6.** idblock kombiniert ddr.bin und Pre Loader; in der geschlossenen Variante bezeichnet Pre Loader die miniloader.bin.

<!-- Chinese baseline PDF p.30 -->

Miniloader mit dem rkbin-Repository packen. Für RK3308 im SDK-rkbin-Verzeichnis rk3308_loader_v1.xx.1xx.bin erzeugen:

```text
./tools/boot_merger ./RKBOOT/RK3308MINIALL.ini .
./tools/boot_merger ./RKBOOT/RK3308MINIALL_WO_FTL.ini . /* 尾缀为 _WO_FTL ⽂件、为开源存储⽅案选
⽤的 Pre Loader，⽂件系统选择ubifs或者jaffs2 */
./tools/boot_merger ./RKBOOT/RK3326MINIALL_SLC.ini . /* 尾缀为 _SLC ⽂件、为⼩容量存储（SLC
Nand、SPI Nand、SPI Nor）⽅案专⽤的 Pre Loader，内带rk ftl算法，不⽀持ubifs */
```

Wie BOOTROM fragt Pre Loader zur Unterstützung verschiedener Speichertypen unterschiedliche Speichergeräte ab:

![4.4.1 Miniloader: Originalabbildung, englische Quelle, Seite 32](/docs/rockchip-storage-application/assets/en-p032-vector-02.png)

*4.4.1 Miniloader: Originalabbildung, englische Quelle, Seite 32*

Da der Code geschlossen ist, können Benutzer die Startreihenfolge nicht selbst ändern.

Bootablauf:

![4.4.1 Miniloader: Originalabbildung, englische Quelle, Seite 33](/docs/rockchip-storage-application/assets/en-p033-vector-01.png)

*4.4.1 Miniloader: Originalabbildung, englische Quelle, Seite 33*

<!-- Chinese baseline PDF p.31 -->

#### 4.4.2 u-boot spl

Chipunterstützung siehe Rockchip-Developer-Guide-UBoot-nextdev-CN. NAND und SPI-NAND verwenden nur offene NAND-Treiber ohne FTL; empfohlen wird UBIFS.

Einführung:

![4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 34](/docs/rockchip-storage-application/assets/en-p034-figure-01.png)

*4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 34*

Erläuterungen:

**1.** ddr.bin: DDR-Initialisierungsfirmware, kurz 471.

**2.** usbplug.bin: Laufzeitfirmware zur Durchführung des Flashens, kurz 472.

**3.** spl.bin: aus dem U-Boot-Quellcode erzeugte SPL-Firmware; Ausgabe unter spl/u-boot-spl.bin im U-Boot-Verzeichnis.

**4.** MiniloaderAll.bin: einheitlicher SDK-Dateiname, tatsächlich das chipspezifische Paket spl_loader.bin.

**5.** Beim Update extrahieren RK-Werkzeuge idblock.bin aus loader.bin, aktualisieren es und legen mehrere Sicherungskopien an.

**6.** idblock kombiniert ddr.bin und Pre Loader. In der SPL-Variante ist dies u-boot-spl.bin. RK SDK baut u-boot-spl.bin regelmäßig und speichert es im entsprechenden rkbin-Verzeichnis als rkxxxx_spl_vx.xx.bin.

**7.** Das PC-Upgradewerkzeug hält für SLC-NAND/SPI-Flash zwei idblock-Kopien und für andere Speicher fünf Kopien vor.

Im BOOTROM-Kontext bedeutet „xxx.bin laden und Funktion xxx ausführen“ Folgendes. Flashvorgang:

- BOOTROM lädt ddr.bin zur DDR-Initialisierung.
- BOOTROM lädt usbplug.bin und verwendet die USB-Plug-Firmware zum Flashen.

Systemstart:

<!-- Chinese baseline PDF p.32 -->

- BOOTROM lädt ddr.bin zur DDR-Initialisierung.
- BOOTROM lädt spl.bin für Loader-Funktionen und nachfolgende Firmware.

Manche Chips packen auch mcu.bin und PCIe.bin mit ähnlichem Zweck in idblock: den Pre-Loader vorladen.

SPL-Speicherabfragereihenfolge:

![4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 35](/docs/rockchip-storage-application/assets/en-p035-vector-01.png)

*4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 35*

Hinweise:

- SPL kann SD-Boot aktivieren: Bei erkannter Karte mit gültiger Firmware werden nachfolgende Images davon geladen.
- SPL mit atags bevorzugt den von BOOTROM erfolgreich erkannten Speicher; Einzelheiten zu atags stehen im U-Boot-Entwicklerhandbuch.

SPL-Speicherprotokoll:

```text
U-Boot SPL 2017.09-gcc781e0266-230509-dirty #ldq (Nov 24 2023 - 00:15:39)
unknown raw ID 0 0 0
unrecognized JEDEC id bytes: 00, 00, 00
Trying to boot from MMC2
MMC: no card present
mmc_init: -123, time 0
spl: mmc init failed with error: -123
Trying to boot from MMC1                # bootdev 探测结果：MMC2(SD Card)、MMC1(EMMC)、
MTD0(SLC Nand)、MTD1(SPI Nand)、MTD2(SPI Nor)
No misc partition
Trying fit image at 0x4000 sector
```

Bootablauf:

![4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 36](/docs/rockchip-storage-application/assets/en-p036-vector-01.png)

*4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 36*

> Ergänzung aus dem englischen Original: Auf Seiten 36–37 stehen nach dem SPL-Text zusätzliche Loader-Abfrage- und Startdiagramme, die später im Loader-Abschnitt wiederholt werden. Das chinesische Original enthält hier keine Bilder. Sie bleiben in Quellreihenfolge erhalten; ihre Position belegt keinen eigenen SPL-spezifischen Ablauf.

![4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 36](/docs/rockchip-storage-application/assets/en-p036-vector-02.png)

*4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 36*

![4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 37](/docs/rockchip-storage-application/assets/en-p037-vector-01.png)

*4.4.2 u-boot spl: Originalabbildung, englische Quelle, Seite 37*

<!-- Chinese baseline PDF p.33 -->

#### 4.4.3 loader

Unterstützte Plattformen sind RV1107, RV1108, RK3036, RK3128 und RK3229. Dieser Loader wird meist für kleine Speicher eingesetzt und startet den Kernel ohne U-Boot direkt.

| Chip | SD CARD | SLC NAND | EMMC | SPI NOR | SPI NAND |
| --- | --- | --- | --- | --- | --- |
| RV1107/8 | Unterstützt | Unterstützt | Unterstützt | Unterstützt | Unterstützt |
| RK3036 | Unterstützt | Unterstützt*1 | Unterstützt*1 | Unterstützt | Unterstützt |
| RK3128 | Unterstützt | Unterstützt*1 | Unterstützt*1 | Unterstützt | Unterstützt |
| RK3229 | Unterstützt | Unterstützt*1 | Unterstützt*1 | Unterstützt | Nicht unterstützt |

*1: RK3036-, RK3128- und RK3229-Projekte mit SLC-NAND oder EMMC verwenden gewöhnlich direkt miniloader.

Speicherabfragereihenfolge:

![4.4.3 loader: Originalabbildung, englische Quelle, Seite 38](/docs/rockchip-storage-application/assets/en-p038-vector-02.png)

*4.4.3 loader: Originalabbildung, englische Quelle, Seite 38*

Bootablauf:

![4.4.3 loader: Originalabbildung, englische Quelle, Seite 39](/docs/rockchip-storage-application/assets/en-p039-vector-01.png)

*4.4.3 loader: Originalabbildung, englische Quelle, Seite 39*

<!-- Chinese baseline PDF p.35 -->

## 5. Partitionen und Datenspeicherung

### 5.1 Datenspeicherung

#### 5.1.1 Einführung in die Adressübersetzung

Die meisten Speicher sind nicht flach abgebildet: Eine logische Sektoradresse LBA wird in eine physische Flash-Sektoradresse PBA übersetzt. Diese FTL-Abbildung (Flash Translation Layer) berücksichtigt Verschleiß, Defektblöcke und Garbage Collection. Mit oder ohne FTL müssen Benutzer und Dateien nur logische Adressen beachten; die Übersetzung erledigt Software. Für Sektoradresse 0x4000 gilt folgende Beziehung:

![5.1.1 Einführung in die Adressübersetzung: Originalabbildung, englische Quelle, Seite 40](/docs/rockchip-storage-application/assets/en-p040-figure-01.png)

*5.1.1 Einführung in die Adressübersetzung: Originalabbildung, englische Quelle, Seite 40*

Bei einem Dateisystemschnittstellenzugriff auf Sektoradresse 0x4000 erfolgt die Adressübersetzung so:

<!-- Chinese baseline PDF p.36 -->

![5.1.1 Einführung in die Adressübersetzung: Originalabbildung, englische Quelle, Seite 41](/docs/rockchip-storage-application/assets/en-p041-figure-01.png)

*5.1.1 Einführung in die Adressübersetzung: Originalabbildung, englische Quelle, Seite 41*

<!-- Chinese baseline PDF p.37 -->

#### 5.1.2 Partitionen und logische Datenadressen

![5.1.2 Partitionen und logische Datenadressen: Originalabbildung, englische Quelle, Seite 42](/docs/rockchip-storage-application/assets/en-p042-figure-01.png)

*5.1.2 Partitionen und logische Datenadressen: Originalabbildung, englische Quelle, Seite 42*

### 5.2 Partitionstabellenschemata

RK-Speicherlösungen kennen drei auf dem Speicher ablegbare Partitionstabellentypen: MTD Partition, GPT und RK partition. Einzelheiten siehe Rockchip_Introduction_Partition.

| Partition | Beschreibung | Plattformen | Einschränkungen |
| --- | --- | --- | --- |
| MTD<br>Partition | In parameter definiert und per cmdline übergeben; ab uboot-next nicht mehr unterstützt | Alle APs*1 | Separate Partition erforderlich |
| GPT | EFI-GUID-Partitionstabelle; von uboot-next unterstützt | Alle APs*2 | Etwas höherer Ressourcenbedarf |
| RK partition | An GPT angelehnt; vor allem für kleine Speicher zur Ressourcenschonung | RV1107/8,<br>MCU | RK-spezifisch, nicht universell |

*1: Plattformen des uboot-next-Zweigs unterstützen MTD partition nicht mehr; bei Bedarf ist eine eigene Anpassung nötig.

<!-- Chinese baseline PDF p.38 -->

*2: uboot-next-Plattformen verwenden standardmäßig GPT; andere Typen erfordern Anpassungen.

#### 5.2.1 MTD Partition

Siehe Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.md.

#### 5.2.2 GPT

GPT wird über eine parameter-Datei ähnlich MTD Partition konfiguriert. Vier Unterschiede:

**1.** TYPE auf GPT setzen.

**2.** Keine parameter-Partition definieren; selbst definiert wird sie nicht verwendet.

**3.** Der letzten Partition das Schlüsselwort grow hinzufügen.

**4.** Die rootfs-UUID angeben; SDK-Vorgaben können abweichen und müssen zur rootfs-UUID im DTS passen.

```text
FIRMWARE_VER:8.1
MACHINE_MODEL:RK3326
MACHINE_ID:007
MANUFACTURER: RK3326
MAGIC: 0x5041524B
ATAG: 0x00200800
MACHINE: 3326
CHECK_MASK: 0x80
PWR_HLD: 0,0,A,0,1
TYPE: GPT /* GPT 分区 */
CMDLINE:mtdparts=rk29xxnand:0x00002000@0x00004000 (uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000 (misc),0x00008000@0x0000a000 (resource),0x00010000@0x00012000(kernel),0x00010000@0x00022000 (boot),0x00020000@0x00032000 (recovery),0x00038000@0x00052000(backup),0x00002000@0x0008a000 (security),0x000c0000@0x0008c000(cache),0x00300000@0x0014c000 (system),0x00008000@0x0044c000(metadata),0x000c0000@0x00454000 (vendor),0x00040000@0x00514000 (oem),0x00000400@0x00554000(frp),-@0x00554400 (userdata:grow)
uuid:rootfs=614e0000-0000-4b53-8000-1d28000054a9
```

GPT-Updateablauf:

**1.** Das Werkzeug liest die Partitionen aus parameter.

**2.** Es erhält die Speicherkapazität vom Loader.

**3.** Es passt die letzte Partition an und erzeugt die GPT-Datei.

**4.** Es schreibt die Tabelle an Adresse 0 und an -33 am Speicherende.

Hinweis 1: Die parameter-Datei selbst wird nicht auf den Speicher geschrieben.

<!-- Chinese baseline PDF p.39 -->

#### 5.2.3 RK partition

RK partition ist eine eigene Tabelle mit GPT-ähnlicher Struktur, geringem Ressourcenbedarf und schnellerer Initialisierung, hauptsächlich für RV1107/8 und MCU. Es folgt eine Linux-/Android-Partitionsvorlage:

```text
#Flag ⽬前只有两个值，1 为分区需要下载，0 为不需要下载
#type ⽬前有 5 种值，0x1=Vendor 分区 0x2=IDBlock 分区 0x4=Kernel 分区 0x8=boot 分区 0x80000000 = 普通分区

#PartSize 和 PartOffset 字段的值都是以扇区为单位
[System]
FwVersion=16.12.23
# 如果 Nano=1, 则⽣成 nano 的 idblock
Nano=
# 如果 BLANK_GAP＝1, 则⽣成的 idblock 按每 2k 数据间隔 2k 空⽩保存
BLANK_GAP=1
#FILL_BYTE 表⽰分区尾部空⽩⽤什么数据填充，默认为 0
FILL_BYTE=
[IDBlock]
Flag=1
DDR_Bin=rk3399_DDR_800MHz_v1.17.bin
Loader_Bin=rk3399_miniloader_spi_nor_v1.14.bin
PartOffset=0x40
PartSize=0x780
[UserPart1]
Name=trust
Type=0x10
Flag=1
File=trust_1MB.img
PartOffset=0x800
PartSize=0x800
[UserPart2]
Name=uboot
Type=0x20
Flag=1
File=uboot_1MB.img
PartOffset=0x1000
PartSize=0x800
```

Normale Partition

Es folgt die RTOS-Vorlage. Die Spezifikation für bits [8,10] in Flag gilt in der Quelle derzeit nur für RTOS-Produkte:

```text
#Flag:
#  bits filed:
#  [0]    : skip                  : 0 - disabled (default), 1 - enable
#  [2]    : no partition size     : 0 - diabled (default), 1 - enable
#  [8, 9] : property              : 0 - do not register (default), 1 - read only, 2 - write only, 3 - rw
#  [10]   : register type         : 0 - block partition (default), 1 - MTD partition
#type can suppot 32 partiton types,0x0:undefined 0x1:Vendor 0x2:IDBlock ,bit3:bit31 are available
#PartSize and PartOffset unit by sector
#Gpt_Enable 1:compact gpt,0:normal gpt
#Backup_Partition_Enable 0:no backup,1:backup
#Loader_Encrypt 0:no encrypt,1:rc4
#nano 1:generate idblock in nano format
[System]
FwVersion=1.0
Gpt_Enable=
Backup_Partition_Enable=
Nano=
Loader_Encrypt=
Chip=
Model=
[UserPart1]
Name=IDBlock
Type=0x2
PartOffset=0x80
PartSize=0x80
Flag=
File=../../Image/rk2108_loader.bin,../../Image/Boot2_Fake.bin
[UserPart2]
Name=rtthread
Type=0x8
PartOffset=0x100
PartSize=0xa00
Flag=
File=../../Image/rtthread.img
[UserPart3]
Name=root
Type=
PartOffset=0x1100
PartSize=0x6f00
Flag=0x305
File=../../Image/root.img
```

<!-- Chinese baseline PDF p.40 -->

#### 5.2.4 ENV-Partitionen

ENV (Environment-Variables) ist ein U-Boot-Verfahren für globale Datenverwaltung und -übergabe über eine Hashtabelle mit Schlüssel-Daten-Einträgen. Einige RK-Plattformen speichern ENV als Flash-Partition, erzeugen mtdparts-Informationen aus cmdlines, tragen sie in die ENV-Tabelle ein und übergeben sie von SPL oder U-Boot an den Kernel.

### 5.3 Werkzeug zum Bearbeiten der parameter-Partitionstabelle

Das Partitionstabellenwerkzeug ändert die in parameter definierten Partitionen. Eine Größenänderung passt auch die Offsets aller folgenden Partitionen an.

<!-- Chinese baseline PDF p.41 -->

![5.3 Werkzeug zum Bearbeiten der parameter-Partitionstabelle: Originalabbildung, englische Quelle, Seite 47](/docs/rockchip-storage-application/assets/en-p047-figure-01.png)

*5.3 Werkzeug zum Bearbeiten der parameter-Partitionstabelle: Originalabbildung, englische Quelle, Seite 47*

### 5.4 Partitionsschreibschutz

#### 5.4.1 Schreibschutz für Blockgerätepartitionen

EMMC und SD CARD sind im Linux-Kernel Blockgeräte; NAND FLASH mit rknand oder rkflash ebenfalls. Die folgenden Befehle setzen Partitionszugriffsrechte. Beispiel 1: system schreibgeschützt setzen:

```text
./busybox blockdev --setro /dev/block/by-name/system
```

Beispiel 2: system les- und schreibbar setzen:

```text
./busybox blockdev --setrw /dev/block/by-name/system
```

Hinweis: Die Partition vor dem Mounten konfigurieren. Wird eine schreibbar gemountete Partition nachträglich schreibgeschützt, meldet das Dateisystem Fehler.

#### 5.4.2 Schreibschutz für MTD-Partitionen

MTD-Partitionen werden gewöhnlich per cmdline definiert. ro hinter dem Namen macht eine Partition schreibgeschützt. Dazu mtdparts bei der cmdline-Übergabe von U-Boot an den Kernel ändern. Beispiel: boot schreibgeschützt setzen:

<!-- Chinese baseline PDF p.42 -->

```text
mtdparts=rk29xxnand:0x00002000@0x00004000(uboot),0x00004000@0x00006000(boot)ro,...
```

<!-- Chinese baseline PDF p.43 -->

## 6. Firmware-Programmierung

Für das Flashen in der Serienfertigung gibt es drei Hauptverfahren: USB-Upgrade, SD-Karten-Upgrade und einen dedizierten Programmer.

### 6.1 USB-Upgrade

USB-Upgrades verwenden die Protokolle rockusb und fastboot. Dieses Dokument beschreibt nur rockusb; zu fastboot siehe Rockchip-Developer-Guide-UBoot-nextdev-CN.

#### 6.1.1 Ablaufdiagramm

![6.1.1 Ablaufdiagramm: Originalabbildung, englische Quelle, Seite 49](/docs/rockchip-storage-application/assets/en-p049-vector-01.png)

*6.1.1 Ablaufdiagramm: Originalabbildung, englische Quelle, Seite 49*

AP rockusb: maskrom rockusb, miniloader rockusb und uboot rockusb. NVM: SPI NOR, SPI NAND, SLC NAND, EMMC, M/TLC NAND.

#### 6.1.2 Windows: RKDevTool

Für GPT/RKPartition stellt das AP SDK Entwicklungswerkzeuge zum Konfigurieren und Aktualisieren vollständiger Firmware oder einzelner Partitionen bereit. Einzelheiten enthalten die zugehörigen Werkzeugdokumente. Einige praktische Funktionen:

**1.** Gerätepartitionstabelle lesen: im Loader-Upgrademodus auf „Gerätepartitionstabelle“ klicken.

**2.** Im MSC/MTP-Modus auf „Umschalten“ klicken, um in den Loader-Modus zu wechseln.

**3.** Unter „Erweiterte Funktionen“ mit „maskrom aufrufen“ vom Loader- in den maskrom-Modus wechseln.

**4.** Im Loader- oder maskrom-Modus „Gerät neu starten“ verwenden. Werkzeugoberfläche:

<!-- Chinese baseline PDF p.44 -->

![6.1.2 Windows: RKDevTool: Originalabbildung, englische Quelle, Seite 50](/docs/rockchip-storage-application/assets/en-p050-figure-01.png)

*6.1.2 Windows: RKDevTool: Originalabbildung, englische Quelle, Seite 50*

Erweiterte Funktionen:

![6.1.2 Windows: RKDevTool: Originalabbildung, englische Quelle, Seite 50](/docs/rockchip-storage-application/assets/en-p050-figure-02.png)

*6.1.2 Windows: RKDevTool: Originalabbildung, englische Quelle, Seite 50*

**1.** Im maskrom-Modus einen Loader auswählen und zur Ausführung im DDR herunterladen.

**2.** update.img entpacken.

**3.** Ein Skript ausführen.

**4.** FLASH ID lesen.

**5.** FLASH-Informationen lesen.

**6.** Chipinformationen lesen.

**7.** Die vom Loader unterstützten Erweiterungsfunktionen lesen.

**8.** Die Gerätebereitschaft prüfen.

**9.** Das Gerät neu starten.

**10.** In maskrom neu starten, üblicherweise zum Wechsel von Loader zu maskrom.

<!-- Chinese baseline PDF p.45 -->

**11.** Daten überschreiben, um die Seriennummer zu löschen. Dieser Vorgang kann die Firmware beschädigen.

**12.** Die IDB-Struktur im Loader-Header exportieren.

**13.** Mit Startadresse und Sektoranzahl aus den Feldern 16 und 17 löschen. Der Bereich muss auf 4 MB ausgerichtet sein; andernfalls kann zu viel oder zu wenig gelöscht werden.

**14.** Serielle Laufzeitmeldungen des Loaders in das output-Verzeichnis des Werkzeugs exportieren.

**15.** Ein Firmware-Image mit Startadresse und Sektoranzahl aus den Feldern 16 und 17 in das output-Verzeichnis exportieren.

**16.** Den Startsektor festlegen.

**17.** Die Sektoranzahl des Vorgangs festlegen.

**18.** Werkzeugprotokoll.

#### 6.1.3 Windows: SocToolKit

Einige APs unterstützen das offene ENV-Schema für Partitionsinformationen. Partitionstabelle und bootargs werden in ENV geschrieben und über cmdline an den Kernel übergeben. Dafür gibt es eigene Image-Pack- und Upgradewerkzeuge. Oberfläche:

![6.1.3 Windows: SocToolKit: Originalabbildung, englische Quelle, Seite 51](/docs/rockchip-storage-application/assets/en-p051-figure-01.png)

*6.1.3 Windows: SocToolKit: Originalabbildung, englische Quelle, Seite 51*

#### 6.1.4 Linux: upgrade_tool

Das Linux-Werkzeug bietet ähnliche Funktionen wie das Android-Werkzeug. Oberfläche:

<!-- Chinese baseline PDF p.46 -->

![6.1.4 Linux: upgrade_tool: Originalabbildung, englische Quelle, Seite 52](/docs/rockchip-storage-application/assets/en-p052-figure-01.png)

*6.1.4 Linux: upgrade_tool: Originalabbildung, englische Quelle, Seite 52*

#### 6.1.5 Linux: SocToolKit

Das Linux-Werkzeug bietet ähnliche Funktionen wie das Android-Werkzeug.

#### 6.1.6 Produktionswerkzeug

Das Produktionswerkzeug unterstützt das asynchrone Flashen mehrerer Geräte. Nach dem Start des Upgrades wird jedes angeschlossene Gerät unabhängig aktualisiert. Oberfläche:

<!-- Chinese baseline PDF p.47 -->

![6.1.6 Produktionswerkzeug: Originalabbildung, englische Quelle, Seite 53](/docs/rockchip-storage-application/assets/en-p053-figure-01.png)

*6.1.6 Produktionswerkzeug: Originalabbildung, englische Quelle, Seite 53*

Jede Option in config.ini ist ausführlich kommentiert. Häufig verwendete Einstellungen:

**1.** FW_BURN_EFUSE: beim Flashen efuse schreiben, um Secure Boot zu aktivieren. Dies darf nicht aktiviert werden, wenn der AP OTP verwendet oder die Platine keine EFUSE-Spannungssteuerung besitzt.

**2.** NOTRESET_AFTER_UPGRADE: nach dem Upgrade nicht neu starten. Dies ist bei Produkten erforderlich, deren erster Start nicht durch Stromausfall unterbrochen werden darf.

**3.** FORCE_DATA_BAND: die USB-Paketgröße ändern. Bei USB-Zeitüberschreitungen mit SPI-NOR kann sie verringert werden.

**4.** SN_DLL_ON: die Seriennummer während des Upgrades schreiben.

**5.** RB_CHECK_OFF: steuert, ob beim Firmware-Upgrade eine Rückleseprüfung erforderlich ist. Die ursprüngliche Beschreibung definiert hier die Flag-Polarität nicht.

### 6.2 SD-Karten-Upgrade

SD_Firmware_Tool schreibt update.img auf eine SD-Upgrade-Karte. Die Karte in den SD/TF-Steckplatz einsetzen und einschalten: Das Gerät startet von SD, wechselt in recovery und aktualisiert den internen Speicher. Oberfläche:

<!-- Chinese baseline PDF p.48 -->

![6.2 SD-Karten-Upgrade: Originalabbildung, englische Quelle, Seite 54](/docs/rockchip-storage-application/assets/en-p054-figure-01.png)

*6.2 SD-Karten-Upgrade: Originalabbildung, englische Quelle, Seite 54*

Werkzeugfunktionen:

**1.** PCBA-Test: vor dem Upgrade testen.

**2.** SD-Start: eine Startkarte mit der vollständigen Firmware erstellen.

**3.** Datenträger wiederherstellen: den Bootcode entfernen und die Karte wieder als normale SD-Karte verwenden.

### 6.3 UART-Upgrade

UART-Upgrades für unterstützte Chips sind in den Linux-, Windows- und Produktionswerkzeugen verfügbar.

<!-- Chinese baseline PDF p.49 -->

![6.3 UART-Upgrade: Originalabbildung, englische Quelle, Seite 55](/docs/rockchip-storage-application/assets/en-p055-figure-01.png)

*6.3 UART-Upgrade: Originalabbildung, englische Quelle, Seite 55*

### 6.4 EMMC-Image-Programmierung

SpiImageTools wandelt update.img in ein Image für einen dedizierten Programmer um. Oberfläche:

![6.4 EMMC-Image-Programmierung: Originalabbildung, englische Quelle, Seite 55](/docs/rockchip-storage-application/assets/en-p055-figure-02.png)

*6.4 EMMC-Image-Programmierung: Originalabbildung, englische Quelle, Seite 55*

Werkzeugkonfiguration:

**1.** Leerbereichsfüllung: für EMMC 0x0 auswählen.

**2.** SPI FLASH nicht aktivieren.

**3.** Datenbereichsreservierung aktivieren. Für ein GPT-Firmware-Image muss parameter DISKSIZE enthalten; siehe „Rockchip 量产烧录指南_v1.2“. Programmer-Einstellungen:

**1.** data.bin in die EMMC-Benutzerpartition schreiben.

**2.** Bei RK3188/RKPX3 boot0.bin sowohl in EMMC boot1 als auch boot2 schreiben.

<!-- Chinese baseline PDF p.50 -->

**3.** Das Überspringen vollständig aus Nullen bestehender Daten im Programmer aktivieren.

**4.** Alle CSD-Werte unverändert auf Standardwerten belassen.

**5.** Nicht aufgeführte EXTCSD-Einträge auf ihren Standardwerten belassen.

RK3188/RKPX3:

- EXT_CSD[167] = 0x1f (muss gesetzt werden, falls vom Speicher unterstützt).
- EXT_CSD[162] = 0x1: Reset-Pin aktivieren.
- EXT_CSD[177] = 0x0 (Standard).
- EXT_CSD[178] = 0x0 (Standard).
- EXT_CSD[179] = 0x8: aus boot1 starten.

Andere APs:

- EXT_CSD[167] = 0x1f (bei Unterstützung zu konfigurieren).
- EXT_CSD[162], EXT_CSD[177], EXT_CSD[178] und EXT_CSD[179] = 0x0 (Standard).

### 6.5 SLC NAND-Image-Programmierung

Siehe den entsprechenden Abschnitt in Rockchip_Developer_Guide_Linux_Nand_Flash_Open_Source_Solution_CN.pdf.

### 6.6 SPI NAND-Image-Programmierung

Siehe den entsprechenden Abschnitt in Rockchip_Developer_Guide_Linux_Nand_Flash_Open_Source_Solution_CN.pdf.

### 6.7 SPI NOR-Image-Programmierung

Siehe den entsprechenden Abschnitt in Rockchip_Developer_Guide_Linux_Nand_Flash_Open_Source_Solution_CN.pdf.

<!-- Chinese baseline PDF p.51 -->

## 7. Konfiguration der Speichertreiber

Rockchip stellt hauptsächlich die folgenden Speicherlösungen bereit:

| Lösung | Hauptsächlich unterstützte Bausteintypen | Hauptsächlich unterstützte Dateisysteme | Programmierverfahren |
| --- | --- | --- | --- |
| eMMC-Lösung | eMMC | FAT、EXT、<br>SquashFS | USB-Upgrade, SD-Karten-Upgrade |
| rknand-Lösung | MLC、TLC Nand | FAT、EXT、<br>SquashFS | USB-Upgrade, SD-Karten-Upgrade |
| rkflash-Lösung | SLC Nand、SPI<br>Nand | FAT、EXT、<br>SquashFS | USB-Upgrade, SD-Karten-Upgrade |
| rkflash-Lösung (SPI-NOR-Unterstützung) | SPI Nor | SquashFS、JFFS2 | USB-Upgrade, SD-Karten-Upgrade, Programmer |
| Offene SLC Nand-Lösung | SLC Nand | UBIFS | USB-Upgrade, SD-Karten-Upgrade, Programmer |
| Offene SPI Nand-Lösung | SPI Nand | UBIFS | USB-Upgrade, SD-Karten-Upgrade, Programmer |
| Offene SPI Nor-Lösung | SPI Nor | SquashFS、JFFS2 | USB-Upgrade, SD-Karten-Upgrade, Programmer |

### 7.1 u-boot

Einzelheiten zu U-Boot siehe CH05 „Treibermodule“ / Storage in Rockchip-Developer-Guide-UBoot-nextdev-CN.

### 7.2 kernel

In Kernel 4.4 und älter ist die offene SPI-Flash-Unterstützung unvollständig. Die offene Flash-Lösung des Kernels unterscheidet sich von derjenigen in U-Boot.

<!-- Chinese baseline PDF p.52 -->

| Lösung | Hauptsächlich unterstützte Bausteintypen | Hostcontrollertreiber | Flash-Framework | Registrierter Gerätetyp | Hauptsächlich unterstützte Dateisysteme | Programmierverfahren |
| --- | --- | --- | --- | --- | --- | --- |
| rknand-Lösung | MLC TLC<br>Nand | drivers/rkand | drivers/rkand | Blockgerät | FAT、EXT、<br>SquashFS | USB-Upgrade, SD-Karten-Upgrade |
| rkflash-Lösung | SLC<br>Nand、<br>SPI Nand | drivers/rkflash | drivers/rkflash | Blockgerät | FAT、EXT、<br>SquashFS | USB-Upgrade, SD-Karten-Upgrade |
| rkflash-Lösung (SPI-NOR-Unterstützung) | SPI Nor | drivers/rkflash | drivers/rkflash | Block- oder MTD-Gerät | SquashFS、<br>JFFS2 | USB-Upgrade, SD-Karten-Upgrade, Programmer |
| Offene SLC Nand-Lösung | SLC Nand | drivers/mtd/<br>nand/raw | drivers/mtd/<br>nand/raw | mtd | UBIFS | USB-Upgrade, SD-Karten-Upgrade, Programmer |
| Offene SPI Nand-Lösung | SPI Nand | drivers/rkflash | drivers/rkflash | mtd | UBIFS | USB-Upgrade, SD-Karten-Upgrade, Programmer |
| Offene SPI Nor-Lösung | SPI Nor | drivers/rkflash | drivers/rkflash | MTD- oder MTD-Blockgerät | SquashFS、<br>JFFS2 | USB-Upgrade, SD-Karten-Upgrade, Programmer |

#### 7.2.1 MLC-NAND/TLC-NAND: rknand-Lösung

Konfiguration:

```text
CONFIG_RK_NAND=y
```

Treiberdateien:

```text
./drivers/rk_nand/
```

<!-- Chinese baseline PDF p.53 -->

#### 7.2.2 SLC-NAND/SPI-NAND/SPI-NOR: rkflash-Lösung

Siehe Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.md.

#### 7.2.3 SLC-NAND/SPI-NAND/SPI-NOR: offene MTD-Lösung

Siehe Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.md.

### 7.3 Speicher-iomux/clk-Konfiguration und Abfragereihenfolge je Startphase

| Phase | Speichergerät | iomux-Konfiguration | Clock-Konfiguration | Treiberkonfiguration |
| --- | --- | --- | --- | --- |
| maskrom | nor, spinand, emmc, sdcard abfragen | Nur für erfolgreich erkanntes Gerät konfiguriert | Konfiguriert |  |
| spl | Priorität 1 (mit atags): von maskrom erkanntes Gerät.<br>Priorität 2: nor, spinand, emmc, sdcard abfragen. | 1. Nicht konfiguriert (Standard).<br>2. Erforderliche iommux-Konfiguration ergänzen. | Im Treiber konfiguriert | dts/defconfig gemäß dem jeweiligen SDK konfigurieren |
| uboot | Priorität 1 (standardmäßig deaktiviert): Ziel gemäß CONFIG_ROCKCHIP_BOOTDEV.<br>Priorität 2 (mit atags): von maskrom erkanntes Gerät.<br>Priorität 3: nor, spinand, emmc, sdcard abfragen. | Nicht konfiguriert | Im Treiber konfiguriert | dts/defconfig gemäß dem jeweiligen SDK konfigurieren |
| kernel | nor, spinand, emmc, sdcard abfragen |  |  | dts/defconfig gemäß dem jeweiligen SDK konfigurieren |

### 7.4 Erweiterung mit zwei Speichern

Siehe Rockchip_Developer_Guide_Dual_Storage_CN.md.

<!-- Chinese baseline PDF p.54 -->

## 8. OTA für offene Lösungen

Siehe Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.md.

<!-- Chinese baseline PDF p.55 -->

## 9. Dateisystemunterstützung

### 9.1 UBIFS-Dateisystem

Siehe Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.md.

### 9.2 JFFS2-Dateisystemunterstützung

Siehe Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.md.

<!-- Chinese baseline PDF p.56 -->

## 10. Vendor Storage verwenden

Vendor Storage speichert kleine, nicht sicherheitsbezogene Daten wie Seriennummern und MAC-Adressen. Referenzen:

- EMMC: Rockchip_Application_Notes_VendorStorage.
- Flash mit rkflash: Rockchip_Application_Notes_VendorStorage.
- Flash mit MTD: Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.pdf.

### 10.1 Vendor Storage ID

Eine Vendor ID ist 16 Bit breit und bezeichnet Daten unabhängig von ihrem Speicherort, ähnlich einem Index oder Dateinamen. IDs 0–31 sind für allgemeine SDK-Funktionen reserviert; Kunden können 32–65535 verwenden. Die Funktionen der IDs sind unten aufgeführt:

<!-- Chinese baseline PDF p.57 -->

| ID | Function |
| --- | --- |
| 0 | reserved |
| 1 | SN |
| 2 | WIFI MAC |
| 3 | LAN MAC |
| 4 | BT MAC |
| 5 | HDCP 1.4 HDMI |
| 6 | HDCP 1.4 DP |
| 7 | HDCP 2.X |
| 8 | DRM KEY |
| 9 | PLAYREADY Cert |
| 10 | ATTENTION KEY |
| 11 | PLAYREADY ROOT KEY 0 |
| 12 | PLAYREADY ROOT KEY 1 |
| 13 | SENSOR CALIBRATION |
| 14 | RK reserved for future use |
| 15 | IMEI |
| 16 | LAN_RGMII_DL |
| 17 – 31 | RK reserved for future use |
| 32 - 65535 | Vendor use |

### 10.2 Vendor Storage API

#### 10.2.1 Uboot API

```text
int vendor_storage_init (void)
    function: Initialize vendor storage
    input: none
    return: 0, Initialize success
            other, Initialize fail
```

<!-- Chinese baseline PDF p.58 -->

```text
int vendor_storage_read (u32 id, void *pbuf, u32 size)
    function: read vendor storage by id
    input: id, item id; pbuf, data buffer; size, number byte to read.
    return: -1, read fail.
            other: number byte have read.
```

```text
int rk_vendor_write (u32 id, void *pbuf, u32 size)
    function: write vendor storage by id
    input: id, item id; pbuf: data buffer; size: number bytes to write.
    return: 0: write success
            other : write fail
```

#### 10.2.2 kernel API

Quellcode: kernel/drivers/soc/rockchip/rk_vendor_storage.c

Headerdatei: include/linux/soc/rockchip/rk_vendor_storage.h

```text
int vendor_storage_init (void)
    function: Initialize vendor storage
    input: none
    return:  0, Initialize success
            other, Initialize fail
```

```text
int vendor_storage_read (u32 id, void *pbuf, u32 size)
    function: read vendor storage by id
    input: id, item id; pbuf, data buffer; size, number byte to read.
    return: -1, read fail.
            other: number byte have read.
```

```text
int rk_vendor_write (u32 id, void *pbuf, u32 size)
    function: write vendor storage by id
    input: id, item id; pbuf: data buffer; size: number bytes to write.
    return: 0: write success
            other : write fail
```

#### 10.2.3 User API

Eine Benutzeranwendung liest und schreibt über IOCTL. Referenzcode:

```text
#include <fcntl.h>
#include <sys/ioctl.h>

#define VENDOR_REQ_TAG  0x56524551
#define VENDOR_READ_IO  _IOW ('v', 0x01, unsigned int)
#define VENDOR_WRITE_IO _IOW ('v', 0x02, unsigned int)
#define VENDOR_SN_ID        1
#define VENDOR_WIFI_MAC_ID  2
#define VENDOR_LAN_MAC_ID   3
#define VENDOR_BLUETOOTH_ID 4

struct rk_vendor_req {
    u32 tag;
    u16 id;
    u16 len;
    u8 data [1];
};

static void print_hex_data (uint8 *s, uint32 *buf, uint32 len)
{
    uint32 i, j, count;

    ERROR ("% s", s);
    for (i = 0; i < len; i += 4)
        ERROR ("% x % x % x % x", buf [i], buf [i + 1], buf [i + 2], buf [i + 3]);
}

int vendor_storage_read_test (void)
{
    u32 i;
    int ret, sys_fd;
    u8 p_buf [2048];/* malloc req buffer or used extern buffer */
    struct rk_vendor_req *req;

    req = (struct rk_vendor_req *) p_buf;
    sys_fd = open ("/dev/vendor_storage", O_RDWR, 0);
    if (sys_fd < 0){
        ERROR ("vendor_storage open fail\n");
        return -1;
    }

    req->tag = VENDOR_REQ_TAG;
    req->id = VENDOR_SN_ID;
    req->len = 512; /* max read length to read*/
    ret = ioctl (sys_fd, VENDOR_READ_IO, req);
    print_hex_data ("vendor read:", (uint32*) req, req->len + 8);
/* return req->len is the real data length stored in the NV-storage */
    if (ret){
        ERROR ("vendor read error\n");
        return -1;
    }

    return 0;
}

int vendor_storage_write_test (void)
{
    uint32 i;
    int ret, sys_fd;
    uint8 p_buf [2048]; /* malloc req buffer or used extern buffer */
    struct rk_vendor_req *req;

    req = (struct rk_vendor_req *) p_buf;
    sys_fd = open ("/dev/vendor_storage", O_RDWR, 0);
    if (sys_fd < 0){
        ERROR ("vendor_storage open fail\n");
        return -1;
    }

    req->tag = VENDOR_REQ_TAG;
    req->id = VENDOR_SN_ID;
    req->len = 32; /* data len */
    for (i = 0; i < 32; i++)
        req->data [i] = i;
    print_hex_data ("vendor write:", (uint32*) req, req->len + 8);
    ret = ioctl (sys_fd, VENDOR_WRITE_IO, req);
    if (ret){
        ERROR ("vendor write error\n");
        return -1;
    }

    return 0;
}
```

<!-- Chinese baseline PDF p.60 -->

#### 10.2.4 PC Tool API

Das PC-Werkzeug stellt den Quellcode eines C++-Referenzprojekts mit zwei Lese-/Schreib-APIs bereit:

```text
int RK_ReadProvisioningData (int id, (PBYTE) pbuf, int size)
    function: read vendor storage by id
    input: id, item id; pbuf, data buffer; size, number byte to read.
    return: 0, read data okay.
            other: read fail.
```

```text
int  RK_WriteProvisioningData (int id, (PBYTE) pbuf, int size)
    function: write vendor storage by id
    input: id, item id; pbuf: data buffer; size: number bytes to write.
    return:  0: write success
            other : write fail
```

### 10.3 Nutzungshinweise

#### 10.3.1 Maximale Datengröße eines VENDOR-Elements

Die Vendor-Partition ist bei NAND/EMMC insgesamt 64 KB und bei NOR 4 KB groß. Die Daten liegen in der vendor-Struktur.

<!-- Chinese baseline PDF p.61 -->

```text
struct vendor_info {
    struct vendor_hdr *hdr; //32byte
    struct vendor_item *item; //8byte * item
    u8 *data; //size = sum (item 1, item 2, ... item n)
    u32 *hash;
    u32 *version2;
};
```

Wenn nur ein Element geschrieben wird:

NAND/EMMC: Ein einzelnes Datenelement kann 64*1024-32-8-4-4 = 65488 Byte belegen.

NOR: Ein einzelnes Datenelement kann 4*1024-32-8-4-4 = 4048 Byte belegen.

#### 10.3.2 Zwei-Kopien-Unterstützung für VENDOR-Daten

Standardmäßig werden zwei Kopien gepflegt:

- Bei Stromausfall während des Schreibens der ersten Kopie ist das Beibehalten alter Daten unvermeidlich.
- Bei Stromausfall während des Schreibens der zweiten Kopie wird die erste verwendet.

<!-- Chinese baseline PDF p.62 -->

## 11. Referenzen im Anhang

Referenzlinks:

- http://www.linux-mtd.infradead.org/faq/ubi.html
- http://www.linux-mtd.infradead.org/faq/ubifs.html#L_lebsz_mismatch
- http://www.linux-mtd.infradead.org/faq/general.html

{% endraw %}
