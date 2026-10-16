---
title: "Rockchip DDR: Vollständige Kompatibilitätsmatrix freigegebener Speicher"
description: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
translation_key: "025-rockchip-ddr-avl"
slug: "025-rockchip-ddr-avl"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "production"
products: ["Sige7", "CM5"]
tags: ["Rockchip", "AVL", "ddr-approved", "hardware"]
keywords: "Rockchip DDR: Vollständige Kompatibilitätsmatrix freigegebener Speicher, ArmSoM, BSP"
excerpt: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
---

{% raw %}
# Rockchip DDR: Vollständige Kompatibilitätsmatrix freigegebener Speicher

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

Diese Referenz unterstützt die Bauteilauswahl auf Plattformebene für ArmSoM-Projekte. Die aufgeführten Bauteile sind nicht auf jedem ArmSoM-Board als austauschbar geprüft. Beachten Sie für Sige7 (RK3588) und CM5 (RK3576) die genaue SoC-Spalte, den Schaltplan, die bestückte Stückliste, das Gehäuse, die Versorgungsspannungen und die Boardrevision. Signalqualität und Eignung für die Serienproduktion müssen auf Boardebene geprüft werden. Die Quelle legt keine allgemeingültige SDK-/BSP- oder Kernelversion fest. Verwenden Sie zusammenpassende Versionen von BSP, Bootfirmware und Treibern und beachten Sie die bauteilspezifischen Hinweise. Für diesen Artikel wurden keine Hardwaretests durchgeführt; Statusangaben und Beispiele stammen aus der Quelle.

Quelle: `Rockchip_DDR_Approved_Vendor_List_ver3.01.pdf`, V3.01.

Die in den chinesischen und englischen Ordnern bereitgestellten Dateien sind bytegleich und überwiegend englischsprachig. Die Sprachfassungen verwenden dieselben Originalabbildungen; gesonderte chinesische Abbildungen liegen nicht vor. Deckblatt, rechtliche Hinweise und Versionshistorie wurden weggelassen. Technische Fußnoten bleiben erhalten.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Redaktionelle Hinweise](/docs/rockchip-avl-ddr-approved/EDITORIAL-NOTES.md)

## 1. Hinweise zur Verwendung dieser Liste

Statussymbole beschreiben den Prüfumfang der Quelle und stellen keine automatische Freigabe für Ihr Board dar. Leere Zellen bleiben leer und dürfen nicht als Unterstützung interpretiert werden. Teilenummern, Suffixe, Mengen und Plattformstatus bleiben unverändert. EOL bezeichnet das Produktlebensende; AUTO und IT bleiben als Kennzeichnungen der Quelle erhalten und stellen keine neue Zertifizierung dar.

| Symbol | Bedeutung in diesem Dokument |
| --- | --- |
| √ | Vollständig geprüft und in Serienproduktion. |
| T/A | Muster geprüft und geeignet; Produktionsverifikation erforderlich. |
| S/A | Muster geprüft und geeignet; geringe Reserven oder andere Risiken erfordern eine Produktionsvalidierung. |
| N/A | Nicht geeignet. |
| Leer | Nicht bewertet. |

- Rockchip prüft eine begrenzte Anzahl von Herstellermustern. Führen Sie vor der Serienproduktion eine Validierung auf Produktebene einschließlich der geltenden Sicherheitsanforderungen durch.

- Befolgen Sie das PCB-Referenzlayout und die Layoutregeln von Rockchip für den DRAM-Bereich, ohne das Referenzmodell zu verändern.

- DRAM-Teilenummern bestehen meist aus zwei durch einen Bindestrich getrennten Abschnitten. Der erste beschreibt Speichertyp, Speicherdichte, Organisation und Gehäuse; der zweite bezeichnet gewöhnlich die Datenrate. Bei Herstellern wie ESMT, RAYSON, CXMT, BIWIN, Kingston, Foresee und Goldkey enthält der zweite Abschnitt zusätzlich weitere wichtige Angaben.

- Die Quelle behandelt Bauteile mit gleichem ersten Teilenummernabschnitt bei Kennzeichnung mit √, T/A oder S/A als unterstützt und lässt dabei ausschließlich Datenraten-Suffixe außer Betracht. Prüfen Sie die tatsächliche Datenrate im DRAM-Datenblatt und konfigurieren Sie Kernel-menuconfig entsprechend. Suffixe mit anderen Angaben dürfen nicht ignoriert werden.

- Die Original-PDF markiert Aktualisierungen gelb. Diese Ausgabe erhält die gelbe Markierung befüllter Tabellenzellen, soweit sie vorliegt.

- Laut Quelle erfordern die aufgeführten DDR-Produkte keine Softwareänderung, sofern ein Anwendungshinweis nichts anderes festlegt. Beachten Sie stets die Hinweise zum genauen Bauteil und zur Plattform.

- Tests gelten für die jeweilige Plattform. Ergebnisse einer Plattform dürfen nicht als Nachweis für eine andere verwendet werden.

## 2. Anwendungshinweise

### [1]

Da dem Gehäuse der Adresspin A15 fehlt, unterstützen RK2906-6, RK2906-8 und RK3066 kein 512M*8-DDR3.

### [2]

Es wird ausschließlich RK3128 unterstützt.

### [3]

Bei diesen SoCs müssen DRAM VDD und VDDQ mit 1.5V versorgt werden.

### [4]

Verwenden Sie auf RK3399 für stabilen Betrieb rk3399_ddr_XXXMHz_v1.22.bin und rk3399_bl31_v1.28.elf oder neuere Versionen. Auf RK3399pro sind rk3399pro_ddr_XXXMHz_v1.22.bin und rk3399pro_bl31_v1.28.elf oder neuere Versionen erforderlich.

### [5]

Es dürfen nur Bauteile nach Wochencode 1937 (2019, Woche 37) verwendet werden. Frühere Bauteile können Abstürze oder Instabilität verursachen.

![Originalfoto der Bauteilkennzeichnung [5]](/docs/rockchip-avl-ddr-approved/assets/en-p04-figure01.png)

*Originalfoto der Bauteilkennzeichnung [5]*

### [6]

Der DDR-Speicher muss mit 400MHz starten. Verwenden Sie beim Zusammenführen des Loaders XXXX_ddr_400MHz_vX.XX.bin.

### [7]

Aktualisieren Sie auf RK3568/RK3566 den Loader auf rk3568_ddr_xxxMHz_v1.09.bin / rk3566_ddr_xxxMHz_v1.09.bin oder neuer.

### [8]

Verwenden Sie nur Bauteile nach Wochencode 2101 (2021, Woche 01); frühere Bauteile können Abstürze oder Instabilität verursachen.

![Originalfoto der Bauteilkennzeichnung [8]](/docs/rockchip-avl-ddr-approved/assets/en-p04-figure02.png)

*Originalfoto der Bauteilkennzeichnung [8]*

### [9]

Verwenden Sie nur Bauteile nach Wochencode 2118. Die ersten vier Ziffern der dritten Beschriftungszeile stehen für 2021, Woche 18. Frühere Bauteile können Abstürze oder Instabilität verursachen.

![Originalfoto der Bauteilkennzeichnung [9]](/docs/rockchip-avl-ddr-approved/assets/en-p04-figure03.png)

*Originalfoto der Bauteilkennzeichnung [9]*

### [10]

Verwenden Sie nur Bauteile nach Wochencode 022. Die ersten drei Ziffern der vierten Beschriftungszeile stehen für 2020, Woche 22. Frühere Bauteile können Abstürze oder Instabilität verursachen.

![Originalfoto der Bauteilkennzeichnung [10]](/docs/rockchip-avl-ddr-approved/assets/en-p04-figure04.png)

*Originalfoto der Bauteilkennzeichnung [10]*

### [11]

Bei kombinierten LPDDR4-/LPDDR4X-Produkten ist nur der LPDDR4-Modus freigegeben. Ein stabiler LPDDR4X-Betrieb wird nicht garantiert. VDDQ muss 1.1V betragen, nicht 0.6V.

### [12]

Aktualisieren Sie für den LPDDR4X-Modus auf RK3568/RK3566 die DDR-bin-Datei auf V1.13 oder neuer.

### [13]

Verwenden Sie nur Bauteile nach Wochencode 201. Die Quelle deutet die ersten drei Ziffern der vierten Zeile als 2022, Woche 2; frühere Bauteile können abstürzen. Die Zuordnung von Code und Datum muss bestätigt werden.

![Originalfoto der Bauteilkennzeichnung [13]](/docs/rockchip-avl-ddr-approved/assets/en-p04-figure05.png)

*Originalfoto der Bauteilkennzeichnung [13]*

### [14]

Bei 4266Mbps bestehen nicht behebbare Probleme. Die Quelle begrenzt die maximale Frequenz auf 3733, ohne die Einheit anzugeben.

### [15]

Die LPDDR4-/LPDDR4X-Leistung auf RV1126/RV1109 ist unzureichend; prüfen Sie die Eignung vor dem Einsatz.

### [16]

Zwischen 400MHz und 625MHz ist kein ordnungsgemäßer Betrieb möglich. Verwenden Sie diesen Frequenzbereich nicht in DTS.

### [17]

Aktualisieren Sie auf RK3588 auf rk3588_ddr_lp4_2112MHz_lp5_2736MHz_v1.10.bin und rk3588_bl31_v1.37.elf oder neuere Versionen.

### [18]

Im Mustervergleich der Quelle kann das linke Muster beim Booten scheitern; das rechte Muster bestand den Test der Quelle.

![Originalfoto der Bauteilkennzeichnung [18] — FAIL](/docs/rockchip-avl-ddr-approved/assets/en-p04-figure06.png)

*Originalfoto der Bauteilkennzeichnung [18] — FAIL*

![Originalfoto der Bauteilkennzeichnung [18] — PASS](/docs/rockchip-avl-ddr-approved/assets/en-p04-figure07.png)

*Originalfoto der Bauteilkennzeichnung [18] — PASS*

### [19]

Aktualisieren Sie auf RK3576 die DDR-bin-Datei auf V1.04 oder neuer.

### [20]

Nur Produkte nach Wochencode 2328 sind mit S/A gekennzeichnet. Produkte vor 2328 sind N/A und funktionieren möglicherweise nicht in Kundenanwendungen. Die Quelle deutet die letzten vier Ziffern der dritten Zeile zugleich als 2024, Woche 11, während ein anderer Satz 2023, Woche 28 nennt. Dieser Widerspruch bleibt zur Klärung erhalten.

![Originalfoto der Bauteilkennzeichnung [20]](/docs/rockchip-avl-ddr-approved/assets/en-p05-figure01.png)

*Originalfoto der Bauteilkennzeichnung [20]*

### [21]

Verwenden Sie die Vorlage, in der DDR3_A15 mit dem DDR-Chip verbunden ist.

### [22]

Deaktivieren Sie vor dem Einsatz automatischen Self-Refresh, Frequenzumschaltung und Aufwachen aus Standby. Siehe https://redmine.rock-chips.com/boards/6/topics/274 .

### [23]

Produkte mit den Wochencodes 2333, 2409, 2417, 2419, 2427 und 2431 erfüllen die Anforderungen nicht. Das Beispiel verwendet die ersten vier Ziffern der dritten Zeile; 2333 steht für 2023, Woche 33.

![Originalfoto der Bauteilkennzeichnung [23]](/docs/rockchip-avl-ddr-approved/assets/en-p05-figure02.png)

*Originalfoto der Bauteilkennzeichnung [23]*

### [24]

Aktualisieren Sie ddr.bin auf v1.23 oder neuer. Ziehen Sie den DDR-Pin CA_ODT auf VDD2 hoch; dafür ist eine Änderung des PCB-Layouts erforderlich.

### [25]

Verwenden Sie auf RK3588 rk3588_ddr_lp4_2112MHz_lp5_2736MHz_v1.18.bin oder neuer; auf RK3576 rk3576_ddr_lp4_2112MHz_lp5_2736MHz_v1.06.bin oder neuer.

### [26]

Wenn ein DDR-Produkt eine niedrigere Frequenz als das Plattformmaximum unterstützt, stellen Sie selbst eine passende Frequenz ein. Siehe „修改DDR bin文件“ in Rockchip_Developer_Guide_DDR_CN oder „Modify the DDR bin file“ in Rockchip_Developer_Guide_DDR_EN.

### [27]

Ändern Sie für K3PE0E000A-XGC2 RZQ auf NC.

### [28]

Ändern Sie für K3PE0E000M-XGC2 RZQ auf 150ohm.

### [29]

Wenden Sie für 256M16-DRAM auf RK3066 und RK31xx die Patches für feste Frequenzen an. Halten Sie das PCB-Referenzlayout strikt ein, da hohe Anforderungen an die Integrität der Referenzfläche bestehen.

### [30]

NT5AD512M16C4-JR (Specific Version) bestand die Qualifikationstests der Quelle. Ältere Fertigungschargen weisen jedoch bekannte Probleme auf. Wenden Sie sich zur Unterscheidung geprüfter Chargen an Nanya Technology.

### [31]

Verwenden Sie auf RK3576 rk3576_ddr_lp4_2112MHz_lp5_2736MHz_v1.10.bin oder neuer.

### [32]

BWMYAX32P8A-64G nach Wochencode 2514 ist S/A. Frühere Produktion ist N/A und funktioniert in der genannten Kundenanwendung nicht ordnungsgemäß. Die Quelle bezeichnet 2514 sowohl als „2025, Woche 4“ als auch als „Woche 14“; die Chargengrenze muss geklärt werden. BWMYAX32P8A-32G nach Wochencode 2502 ist S/A. Frühere Produktion ist N/A; vor Woche 2 des Jahres 2025 tritt der beschriebene Fehler in der Kundenanwendung auf.

![Originalfoto der Bauteilkennzeichnung [32]](/docs/rockchip-avl-ddr-approved/assets/en-p05-figure03.png)

*Originalfoto der Bauteilkennzeichnung [32]*

## Vollständige Kompatibilitätstabellen

Die Tabellen sind zur Rückverfolgbarkeit nach Quellseiten getrennt und vollständig erhalten. Scrollen Sie horizontal, um sämtliche SoC-Spalten zu sehen. Wiederholte Einträge einschließlich widersprüchlicher Duplikate bleiben erhalten.

### Konsumelektronik — Quellseite 7

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Micron | MT47H64M16HR-25 | EOL | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT41J128M8JP-15E:G (D9MNL) |  | 1G bit | 128M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT41K128M8DA-107:J (D9RDJ) |  | 1G bit | 128M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |
| Micron | MT41K64M16TW-107:J (D9SFT) |  | 1G bit | 64M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT41J128M16HA-15E:D (D9LGQ) |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT41J256M8HX-15E:D (D9LGK) |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Micron | MT41K256M8DA-125:K (D9PSH) |  | 2G bit | 256M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Micron | MT41K256M8DA-125:M (D9PFJ) |  | 2G bit | 256M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Micron | MT41K128M16HA-15E:D (D9LJM) |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT41K128M16JT-125:K (D9PTK) |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  | T/A |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A |
| Micron | MT41K128M16JT-107:K (D9PSZ) |  | 2G bit | 128M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  | T/A |  | T/A |  |  |  |  |  |
| Micron | MT41K512M8RH-125:E (D9QBJ) |  | 4G bit | 512M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A [1] |
| Micron | MT41K512M8RG-107:N (D9RVX) |  | 4G bit | 512M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |
| Micron | MT41K512M8DA-107:P (D9SGQ) |  | 4G bit | 512M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |
| Micron | MT41K256M16RE-15E:D (D9PBF) |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT41K256M16HA-125:E (D9PXV) |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Micron | MT41K256M16LY-107:N (D9SDD) |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A | T/A | T/A | T/A |
| Micron | MT41K256M16TW-107:P (D9SHD) |  | 4G bit | 256M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  |  | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  |  | T/A |
| Micron | MT41K256M16TW-107 IT:P (D9SHG) |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Micron | MT41K512M16HA-125:A (D9STQ) | EOL | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | √ |  |  |  |  | T/A |  |  |  |  |  |  |
| Micron | MT41K512M16HA-107:A (D9SDQ) | EOL | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Micron | MT41K512M16VRP-107IT:P (D9ZWN) |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Micron | MT40A256M16GE-083E:B (D9TGQ) | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  |  | T/A |  | T/A |  |  |  |  |  |
| Micron | MT40A256M16GE-075E:B (D9TGS) | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A | T/A | T/A |  | T/A |  |  |  |  |  |
| Micron | MT40A512M16TB-062E:J (D9WWP) | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  | T/A |  | T/A |  |  |  |  |  |
| Micron | MT40A512M16JY-083E:B (D9TBK) |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  | T/A |  | T/A |  |  |  |  |  |  |  |  |  |  |
| Micron | MT40A512M16TB-062E:R (D8BPK) |  | 8G bit | 512M×16 | DDR4 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Micron | MT40A512M16LY-062E:E (D9WFJ) | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT40A1G16WBU-083E:B (D9TPH) | EOL | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  |  | T/A |  | T/A |  |  |  |  |  |
| Micron | MT40A1G16KD-062E:E (D9ZFW) | EOL | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| Micron | MT40A1G16TB-062E:F (D8CJX) |  | 16G bit | 1024M×16 | DDR4 | 96ball | T/A | T/A |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Micron | MT40A2G16SKL-062E:B (D9XQF) |  | 32G bit | 2048M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT42L128M32D1GU-25 WT:A (Z9QHG) |  | 4G bit | 128M×32 | LPDDR2 | 134ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Micron | MT42L256M16D1GU-18 WT:A (D9RLT) |  | 4G bit | 256M×16 | LPDDR2 | 134ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT42L128M64D2LL-25 WT:A (D9QQG) |  | 8G bit | 128M×32×2Ch | LPDDR2 | 216ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | N/A |
| Micron | MT52L256M32D1PF-107 WT:B (D9SRZ) |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |
| Micron | MT52L512M32D2PF-107 WT:B (D9SSF) |  | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A |  |  |  |
| Micron | MT52L256M32D1PF-093 WT:B (D9SVR) |  | 8G bit | 256M×32 | LPDDR3 | 178ball | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT52L512M32D2PF-093 WT:B (D9SVT) |  | 16G bit | 512M×32 | LPDDR3 | 178ball | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E128M16D1DS-046 WT:A (D9WXT) |  | 2G bit | 128M×16 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  |  |  |  | S/A [11][15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E128M32D2DS-046 WT:A (D9WXR) |  | 4G bit | 128M×32 | LPDDR4/LPDDR4X | 200ball | T/A |  |  |  | T/A |  |  |  |  | S/A [11][15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53B256M32D1NP-062 WT:C (D9TFT) | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Micron | MT53E256M32D2DS-053 WT:B (D9WRB) | EOL | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  |  |  | T/A [11] | S/A [11][15] |  |  | T/A [4][11] |  |  |  |  | T/A [4][11] |  |  |  |  |  |  |
| Micron | MT53E256M32D2FW-046 WT:B (D9ZKT) |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A [7][11] | T/A | T/A [7][11] | T/A [7][11] | S/A [11][15] |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Micron | MT53E256M32D1KS-046 WT:L (D8FCW) |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball | T/A |  |  |  | T/A | T/A |  | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Micron | MT53E384M32D2DS-053 WT:E (D9WRN) |  | 12G bit | 384M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E384M32D2FW-046 WT:E (D8BBR) |  | 12G bit | 384M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A [7][11] | T/A | T/A [7][11] | T/A [7][11] |  |  |  |  |  | T/A [11] |  |  |  |  |  |  |  |  |  |
| Micron | MT53B512M32D2NP-062 WT:C (D9TFW) | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Micron | MT53D512M32D2DS-053 WT:D (D9WHZ) |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  | T/A [11] | T/A |  | T/A | T/A | S/A [15] |  |  | T/A [11] |  |  |  |  | T/A |  |  |  |  |  |  |
| Micron | MT53E512M32D2NP-046 WT:E (D9WGB) | EOL | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A [7][11] | T/A [11] | T/A [7][11] | T/A [7][11] | S/A [11][15] |  |  | T/A [11] |  |  |  |  | T/A [11] |  |  |  |  |  |  |
| Micron | MT53E512M32D2NP-046 WT:F (D9XRR) | EOL | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  | T/A [11] |  |  |  |  |  |  |  |  |  |
| Micron | MT53E512M32D2FW-046 WT:D (D9ZZL) |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A [7] | T/A | T/A [7] | T/A [7] |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Micron | MT53E512M32D1NP-046 WT:B (D8BQM) |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A [11] | T/A | T/A [11] | T/A [11] |  |  |  | T/A |  | T/A [11] |  |  | T/A |  |  |  |  |  |  |
| Micron | MT53E512M32D4NQ-053 RS WT:F (D9ZBD) |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  |  |  | T/A [11] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E512M32D1ZW-046 WT:B (D8CSC) |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball | T/A |  |  |  | T/A | T/A |  | T/A | T/A |  |  |  | T/A |  | T/A |  |  | T/A |  |  |  |  |  |  |
| Micron | MT53E512M32D1ZW-046 B WT:B (D8FLP) |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Micron | MT53E768M32D4DT-046 WT:E (D9WRP) |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Micron | MT53E768M32D2ZW-046 WT:C (D8DTV) |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball | T/A |  |  | T/A | T/A | T/A | T/A | T/A | T/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| Micron | MT53D1024M32D4DT-053 WT:D (D9WHV) |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  | T/A | T/A [11] |  | T/A [7][11] | T/A [11] | S/A [11][15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53D1024M32D4DT-046 WT:D (D9WQG) |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  | T/A [11] |  |  |  |  |  |  |  | T/A [11] |  |  |  |  |  |  |  |  |  |
| Micron | MT53E1G32D2FW-046 WT:B (D8CJG) |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball | T/A |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  | T/A [11] |  |  |  |  |  |  |  |  |  |
| Micron | MT53E1G32D2FW-046 WT:C (D8DVT) |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | <mark>T/A</mark> | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E1536M32D4DE-046 WT:B (D8BDQ) | EOL | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E1536M32DDNQ-046 WT:A(D8BWF) |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E1536M32D4DE-046 WT:C(D8DDB) |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E2G32D4DE-046 WT:A (D9ZRD) |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A [7][11] | T/A | T/A [7][11] | T/A [7][11] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E2G32D4DE-046 WT:C (D8CJN） |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E2G32D4NQ-046 WT:C (D8BQX) |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E4G32D8CY-046 WT:C (D8CBG) |  | 128G bit | 4G×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A [17] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E4G32D8GS-046 WT:C (D8DPM) |  | 128G bit | 4G×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53B512M64D4NK-053 WT:C (D9TGF) | EOL | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Micron | MT53E512M64D4NK-046 WT:D (D9XPK) | EOL | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Micron | MT62F512M32D2DS-031 WT:B (D8BCN) |  | 16G bit | 512M×32 | LPDDR5 | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F512M32D1DS-020 WT:E (D8GSM) |  | 16G bit | 512M×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F768M32D2DS-020B WT:D (D8HHC) |  | 24G bit | 768M×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | <mark>T/A</mark> |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F1G32D4DS-031 WT:B (D8BFH) | EOL | 32G bit | 1024M×32 | LPDDR5 | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F1G32D2DS-026 WT:B (D8CTX) |  | 32G bit | 1G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F1G32D2DS-026 WT:C (D8DHC) |  | 32G bit | 1G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F1G32D2DS-020 WT:F(D8FQT) |  | 32G bit | 1G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F1536M32D4DS-026 WT:B(D8CNS) |  | 48G bit | 1536M×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F1536M32D4DS-020B WT:D(D8HPL) |  | 48G bit | 1536M×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | <mark>T/A</mark> |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F2G32D4DS-026 WT:B (D8CTP) | EOL | 64G bit | 2G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F2G32D4DS-026 WT:C (D8DNF) |  | 64G bit | 2G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F2G32D4DS-020 WT:F(D8GBN) |  | 64G bit | 2G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F3G32D8DV-026 WT:B (D8CPV) |  | 96G bit | 3G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A [17] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F3G32D8DV-023 WT:C (D8FMF) |  | 96G bit | 3G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F4G32D8DV-026 WT:B (D8CWL) | EOL | 128G bit | 4G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  |  |  |  | T/A [17] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F4G32D8DV-026 WT:C (D8DVL) |  | 128G bit | 4G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A [19] |  |  | T/A [25] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F4G32D8DV-020 WT:F(D8GJJ) |  | 128G bit | 4G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F768M64D4ZU-026 WT:B (D8CCJ) |  | 48G bit | 768M×64 | LPDDR5/LPDDR5X | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F1G64D4ZX-023 WT:C (D8DRK) |  | 64G bit | 1024M×64 | LPDDR5/LPDDR5X | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F1536M64D8CL-026 WT:B (D8CCN) |  | 96G bit | 1536M×64 | LPDDR5/LPDDR5X | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT62F2G64D8ZA-023 WT:C (D8DQK) |  | 128G bit | 2048M×64 | LPDDR5/LPDDR5X | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 8

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Samsung | K4T1G164QE |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4B1G0846G |  | 1G bit | 128M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Samsung | K4B1G1646I-&#42;C&#42;&#42; |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4B1G1646I-&#42;Y&#42;&#42; |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4B2G0846C |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4B2G0846F-&#42;Y&#42;&#42; |  | 2G bit | 256M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Samsung | K4B2G1646C |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4B2G1646E |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Samsung | K4B2G1646Q |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  | T/A | T/A | T/A | T/A | T/A |
| Samsung | K4B2G1646F-&#42;Y&#42;&#42; |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A |  | T/A | T/A | T/A | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A |
| Samsung | K4B4G0846E-&#42;C&#42;&#42; |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |
| Samsung | K4B4G1646B-&#42;C&#42;&#42; |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Samsung | K4B4G1646Q-&#42;Y&#42;&#42; | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | √ | T/A | T/A |  |  |  | T/A | T/A | T/A | T/A | T/A |
| Samsung | K4B4G1646D-&#42;Y&#42;&#42; | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | √ | T/A | T/A |  |  |  | T/A | T/A | T/A | T/A | T/A |
| Samsung | K4B4G1646D-&#42;C&#42;&#42; | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Samsung | K4W4G1646Q-&#42;C&#42;&#42; |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Samsung | K4B4G1646E-&#42;Y&#42;&#42; |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A | T/A | T/A | T/A |
| Samsung | K4B4G1646E-&#42;C&#42;&#42; |  | 4G bit | 256M×16 | DDR3 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  | T/A | T/A |  | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |
| Samsung | K4B8G1646D-&#42;Y&#42;&#42; | EOL | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A | √ | T/A | T/A | T/A |  | √ |  | T/A |  |  |  |  |
| Samsung | K4A4G165WE-BC&#42;&#42; | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A |  |  | T/A |  | T/A | T/A | T/A | T/A |  | T/A |  |  |  |  |  |
| Samsung | K4A4G165WF-BC&#42;&#42; | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  | T/A |  | √ | T/A | T/A |  |  |  |  |  |  |  |  |
| Samsung | K4A4G165WG-BC&#42;&#42; |  | 4G bit | 256M×16 | DDR4 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | <mark>T/A</mark> |  |  |  |  |  |  |  |  |
| Samsung | K4A8G085WC-BC&#42;&#42; |  | 8G bit | 1024M×8 | DDR4 | 78ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4A8G165WB-BC&#42;&#42; | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  | T/A |  | T/A |  |  | T/A |  | T/A |  |  |  |  |  |
| Samsung | K4A8G165WC-BC&#42;&#42; | EOL | 8G bit | 512M×16 | DDR4 | 96ball | T/A | T/A |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | S/A [16] | S/A [16] | T/A |  | T/A |  |  |  |  |  |
| Samsung | K4A8G165WG-BC&#42;&#42; |  | 8G bit | 512M×16 | DDR4 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| Samsung | K4AAG165WA-BC&#42;&#42; | EOL | 16G bit | 1024Mx16 | DDR4 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  | T/A |  | T/A |  |  |  |  |  |
| Samsung | K4AAG165WB-MC&#42;&#42; | EOL | 16G bit | 1024Mx16 | DDR4 | 96ball |  |  |  |  | T/A |  |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4AAG165WB-BC&#42;&#42; | EOL | 16G bit | 1024Mx16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4AAG165WC-BC&#42;&#42; |  | 16G bit | 1024Mx16 | DDR4 | 96ball | T/A | T/A |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Samsung | K4ABG165WA-MC&#42;&#42; |  | 32G bit | 2048M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K3PE0E000A-XGC2 | EOL | 16Gb/2Channel | 256M×32×2Ch | LPDDR2 | 220ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A [27] |  |  |  | N/A |
| Samsung | K3PE0E000M-XGC2 | EOL | 16Gb/2Channel | 256M×32×2Ch | LPDDR2 | 216ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A [28] |  |  |  | N/A |
| Samsung | K4E8E304ED-EGCC | EOL | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |
| Samsung | K4E8E304EE-EGCE | EOL | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  | T/A |  |  |  |  |
| Samsung | K4E8E324EB-AGCF | EOL | 8G bit | 256M×32 | LPDDR3 | 168ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |
| Samsung | K4E8E324EB-EGCF | EOL | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A |  |  |  |
| Samsung | K4E8E324ED-EGCG | EOL | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A | T/A | T/A |  |  |  |  |  |
| Samsung | K3QF1F10DM-AGCE | EOL | 8Gb/2Channel | 128M×32×2Ch | LPDDR3 | 253ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Samsung | K3QF1F10EM-BGCF | EOL | 8G bit | 128M×32×2Ch | LPDDR3 | 216ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Samsung | K4E6E304EE-EGCE | EOL | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  | T/A | T/A |  |  |  |
| Samsung | K4E6E304EB-EGCF | EOL | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |
| Samsung | K4E6E304EC-EG&#42;&#42; | EOL | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A |  |  |  |  |
| Samsung | K4E6E304ED-EG&#42;&#42; | EOL | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  | T/A |  |  | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |
| Samsung | K4EBE304EC-EG&#42;&#42; | EOL | 32G bit | 1024M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |
| Samsung | K3QF3F30BM-QGCF | EOL | 16G bit | 256M×32×2Ch | LPDDR3 | 216ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Samsung | K3QF3F30BM-BGCF | EOL | 16G bit | 256M×32×2Ch | LPDDR3 | 216ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Samsung | K4F4E3S4HF-MG&#42;&#42; |  | 4G bit | 128M×32 | LPDDR4 | 200ball |  |  |  |  | T/A |  |  |  |  | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4F8E304HB-MG&#42;&#42; | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  | T/A |  | T/A | T/A | S/A [15] |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Samsung | K4F8E3S4HD-MG&#42;&#42; |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  | T/A | T/A | T/A [7] | T/A | T/A [7] | T/A [7] | S/A [15] |  |  | T/A |  | T/A |  |  | T/A |  |  |  |  |  |  |
| Samsung | K4F2E3S4HM-MG&#42;&#42; |  | 12G bit | 384M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  | T/A [7] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4F6E3S4HM-MG&#42;&#42; |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  | T/A |  | T/A | T/A | S/A [15] |  |  | T/A |  | T/A |  |  | T/A |  |  |  |  |  |  |
| Samsung | K4F6E3S4HM-SG&#42;&#42; |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4F6E3S4HB-MG&#42;&#42; |  | 16G bit | 512M×32 | LPDDR4 | 200ball | T/A | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  | T/A |  | T/A |  |  | T/A |  |  |  |  |  |  |
| Samsung | K4FHE3D4HM-MG&#42;&#42; | EOL | 24G bit | 768M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  | T/A [7] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4FBE3D4HM-MG&#42;&#42; |  | 32G bit | 1024M×32 | LPDDR4 | 200ball |  |  |  |  |  | N/A | N/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4FBE3D4HB-MG&#42;&#42; |  | 32G bit | 1024M×32 | LPDDR4 | 200ball | T/A | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Samsung | K4U8E3S4AD-MG&#42;&#42; |  | 8G bit | 256M×32 | LPDDR4X | 200ball | T/A |  |  | T/A |  | T/A [7] | T/A | T/A [7] | T/A [7] | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4U6E3S4AM-MG&#42;&#42; |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4U6E3S4AA-MG&#42;&#42; | EOL | 16G bit | 512M×32 | LPDDR4X | 200ball | T/A |  |  |  |  | T/A | S/A | T/A | T/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4U6E3S4AB-MG&#42;&#42; |  | 16G bit | 512M×32 | LPDDR4X | 200ball | T/A |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4UHE3S4AA-MG&#42;&#42; |  | 24G bit | 768M×32 | LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| Samsung | K4UHE3D4AB-MG&#42;&#42; | EOL | 24G bit | 768M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A | S/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4UBE3S4AM-MG&#42;&#42; |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4UBE3D4AA-MG&#42;&#42; | EOL | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  |  | T/A | T/A [7] | S/A | T/A [7] | T/A [7] | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4UBE3D4AB-MG&#42;&#42; |  | 32G bit | 1024M×32 | LPDDR4X | 200ball | T/A |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4UJE3D4AA-MG&#42;&#42; |  | 48G bit | 1536M×32 | LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4UCE3Q4AA-MG&#42;&#42; | EOL | 64G bit | 2048M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A | S/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4UCE3Q4AB-MGCL |  | 64G bit | 2048M×32 | LPDDR4X | 200ball |  |  |  | S/A [14] |  | S/A | S/A [14] | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4UKE3Q4AA-MG&#42;&#42; |  | 96G bit | 3072M×32 | LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K3RG2G20CM-MGCJ | EOL | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A [4] |  |  |  |  | T/A [4] |  |  |  |  |  |  |
| Samsung | K3LKBKB0BM-MG&#42;&#42; |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K3LKCKC0BM-MG&#42;&#42; |  | 64G bit | 2048M×32 | LPDDR5 | 315ball |  |  |  | S/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K3KL8L80QM-MG&#42;&#42; |  | 32G bit | 1024M×32 | LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K3KL9L90QM-MG&#42;&#42; |  | 64G bit | 2048M×32 | LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | <mark>K3KL8L80EM-MG&#42;&#42;</mark> |  | <mark>64G bit</mark> | <mark>2048M×32</mark> | <mark>LPDDR5X</mark> | <mark>315ball</mark> |  |  |  | <mark>T/A</mark> |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K3KL3L30CM-BG&#42;&#42; |  | 64G bit | 1024M×64 | LPDDR5 | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K3LK7K70BM-BG&#42;&#42; |  | 64G bit | 1024M×64 | LPDDR5 | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K3LK4K40CM-BG&#42;&#42; |  | 96G bit | 1536M×64 | LPDDR5 | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K3LK6K60BM-BG&#42;&#42; |  | 128G bit | 2048M×64 | LPDDR5 | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 9

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hynix | H5PS1G63CFP | EOL | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H5PS1G63EFR | EOL | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H5TQ1G83DFR | EOL | 1G bit | 128M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Hynix | H5TQ1G83TFR | EOL | 1G bit | 128M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H5TQ2G83CFR | EOL | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | √ |  | √ | √ | √ |
| Hynix | H5TQ2G83BFR | EOL | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | √ |  | T/A | T/A | √ |
| Hynix | H5TQ2G83EFR | EOL | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Hynix | H5TQ2G83FFR | EOL | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  |
| Hynix | H5TQ2G83GFR | EOL | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Hynix | H5TQ2G63BFR | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H5TQ2G63FFR | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  |
| Hynix | H5TQ2G63GFR | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  | T/A | T/A | T/A | T/A | T/A |
| Hynix | H5TC2G63GFR | EOL | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  | T/A |  | T/A |  | T/A |  |  |  |
| Hynix | H5TQ2G63DFR | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Hynix | H5TQ4G83AFR | EOL | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A [1] |
| Hynix | H5TC4G83AFR | EOL | 4G bit | 512M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A [1] |
| Hynix | H5TQ4G83MFR | EOL | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A [1] |
| Hynix | H5TC4G83BFR | EOL | 4G bit | 512M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  |
| Hynix | H5TQ4G63MFR | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Hynix | H5TQ4G63AFR | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A | T/A | T/A | T/A |
| Hynix | H5TC4G63AFR | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Hynix | H5TC4G63CFR | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  | T/A | T/A |  |  | T/A |
| Hynix | H5TC4G63EFR |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A |  |  | T/A |
| Hynix | H5TQ4G63EFR |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |
| Hynix | H5TQ4G63CFR | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A | T/A | T/A | T/A |
| Hynix | H5TC8G63AMR | EOL | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Hynix | H5TC8G63CMR | EOL | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Hynix | H5AN4G6NAFR | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  |  | T/A |  | T/A |  |  |  |  |  |
| Hynix | H5AN4G6NBJR |  | 4G bit | 256M×16 | DDR4 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  | T/A |  |  |  | T/A | T/A |  | T/A |  | T/A | T/A |  | T/A |  | T/A |  |  |  |  |  |
| Hynix | H5AN8G6NAFR | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  | T/A |  |  |  |  |  |
| Hynix | H5AN8G6NCJR | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | T/A | T/A |  | T/A |  |  |  |  |  |
| Hynix | H5AN8G6NDJR |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |
| Hynix | H5AG36EXNJX017N |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H5ANAG6NAMR | EOL | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | T/A | T/A |  | T/A |  |  |  |  |  |
| Hynix | H5ANAG6NCMR | EOL | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H5ANAG6NCJR |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  | T/A |  | T/A |  |  |  |  |  |  |  |  |  |  |
| Hynix | H5AG36EXNDX017N |  | 8G bit | 512M×16 | DDR4 | 96ball | T/A | T/A |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| Hynix | H5AG46DXNDX117N |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| Hynix | H9TCNNN8JDMMPR |  | 8Gb/2CS | 256M×32 | LPDDR2 | 134ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Hynix | H8TJR00X0MLR |  | 8Gb/2CS | 256M×32 | LPDDR2 | 168ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Hynix | H9TKNNN8KDMPQR |  | 8Gb/2Channel | 128M×32×2Ch | LPDDR2 | 216ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A [2] |  |  |
| Hynix | H9TKNNNBPDMRAR |  | 16Gb/2Channel | 256M×32×2Ch | LPDDR2 | 220ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | N/A |
| Hynix | H9CCNNN8JTALAR | EOL | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Hynix | H9CCNNN8GTMLAR | EOL | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A |  |  |  |  |
| Hynix | H9CCNNN8JTMLAR | EOL | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Hynix | H9CCNNNBJTALAR | EOL | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A |  | T/A |  |  |  |  |  |  |
| Hynix | H9CCNNNBLTALAR | EOL | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  | T/A |  |  |  |  |
| Hynix | H9CCNNNBJTMLAR | EOL | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A | N/A |  |  |  | N/A |  | T/A | N/A | N/A | N/A | N/A |
| Hynix | H9CKNNNBPTMRLR | EOL | 16G bit | 512M×32 | LPDDR3 | 216ball |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Hynix | H9CKNNNDATMUPR |  | 24G bit | 786M×32 | LPDDR3 | 256ball |  |  |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H9CKNNNCPTMRPR | EOL | 32G bit | 1024M×32 | LPDDR3 | 256ball |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Hynix | H9HCNNN8KUMLHR | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| Hynix | H9HCNNNBPUMLHR | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| Hynix | H9HCNNNBKUMLHR | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  | N/A | N/A |  | N/A | N/A | S/A [15] |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| Hynix | H9HCNNNBKUMLXR | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  | T/A | N/A | N/A | T/A | N/A | S/A | N/A |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| Hynix | H9HCNNNCPUMLXR |  | 32G bit | 1024M×32 | LPDDR4 | 200ball | T/A | T/A |  | T/A |  |  | T/A |  |  | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H9HCNNNBKMMLHR | EOL | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  | N/A | N/A |  | N/A | S/A | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H9HCNNNBKMMLXR |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H9HCNNNCPMMLXR |  | 32G bit/2cs | 1024M×32 | LPDDR4X | 200ball | T/A |  |  | T/A |  |  | T/A | S/A [7] | S/A [7] | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H54GE6CYRBX262N |  | 48G bit | 1536M×32 | LPDDR4X | 200ball |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Hynix | H9HKNNNECMMUJR |  | 48G bit | 1536M×32 | LPDDR4X | 200ball |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Hynix | H9HCNNNFAMMLXR |  | 64G bit | 2048M×32 | LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H54G38AYRBX259N |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | N/A | N/A | T/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Hynix | H54G38AYRBX259 |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | N/A | N/A | T/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Hynix | H54G46CYRBX267N |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A | S/A | S/A |  |  |  | S/A |  | S/A |  |  | S/A |  |  |  |  |  |  |
| Hynix | H54G56CYRBX247N |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Hynix | H54G38AYRBX247 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Hynix | H9HKNNNDBUMUBR | EOL | 24G bit | 384M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| Hynix | H9HKNNNCUUMUBR | EOL | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| Hynix | H9HKNNNCTUMUBR | EOL | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| Hynix | H9JCNNNBK3MLYR |  | 16G bit | 512M×32 | LPDDR5 | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H9JCNNNCP3MLYR |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  |  |  | S/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H9JCNNNFA5MLYR |  | 64G bit | 2048M×32 | LPDDR5 | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H58G56CK8BX146N |  | 32G bit | 1024M×32 | LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hynix | H58G66CK8BX147N |  | 64G bit | 2048M×32 | LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 10

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nanya | NT5TU32M16CG-3C |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5TU32M16FG |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5TU64M16HG |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5CB64M16GP |  | 1G bit | 64M×16 | DDR3 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  |
| Nanya | NT5CC64M16GP |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5CB128M8DN |  | 1G bit | 128M×8 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5CC128M8DN |  | 1G bit | 128M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Nanya | NT5CB128M8FN |  | 1G bit | 128M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Nanya | NT5CC128M8GN |  | 1G bit | 128M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |
| Nanya | NT5CB256M8GN |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Nanya | NT5CB256M8BN |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Nanya | NT5CB256M8FN |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Nanya | NT5CB256M8IN |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |
| Nanya | NT5CC256M8IN |  | 2G bit | 256M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  | T/A |
| Nanya | NT5CB128M16BP |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Nanya | NT5CB128M16HP |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Nanya | NT5CC128M16BP |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5CB128M16FP |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Nanya | NT5CC128M16IP | EOL | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A |
| Nanya | NT5CB128M16IP | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A | T/A |  |  |  | T/A | T/A | T/A | T/A | T/A |
| Nanya | NT5CB128M16JR |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5CC128M16JR |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  | T/A |  |  |  |  |  |  | T/A | T/A | T/A |  | T/A | T/A | T/A | T/A |  | T/A | T/A | T/A |  |  |  |
| Nanya | NT5CB512M8DN |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |
| Nanya | NT5CB512M8BN |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A [1] |
| Nanya | NT5CC512M8CN |  | 4G bit | 512M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A [1] |
| Nanya | NT5CC512M8DN |  | 4G bit | 512M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  | T/A |
| Nanya | NT5CC512M8EN |  | 4G bit | 512M×8 | DDR3L | 78ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  | T/A |  |  |  |
| Nanya | NT5CB256M16BP |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Nanya | NT5CB256M16CP | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Nanya | NT5CB256M16DP | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Nanya | NT5CB256M16EP |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  |  | T/A |  |  |  |
| Nanya | NT5CC256M16CP | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Nanya | NT5CC256M16DP | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A | T/A | T/A | T/A |
| Nanya | NT5CC256M16EP |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A | T/A |  | T/A |
| Nanya | NT5CC256M16ER |  | 4G bit | 256M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A |  |  |  |
| Nanya | NT5CB256M16ER |  | 4G bit | 256M×16 | DDR3 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  | T/A | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5AD256M16B2 | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  |  | T/A |  | T/A |  |  |  |  |  |
| Nanya | NT5AD256M16D4 | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A |  | T/A | T/A | T/A | T/A |  | T/A |  |  |  |  |  |
| Nanya | NT5AD256M16E4 |  | 4G bit | 256M×16 | DDR4 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | <mark>T/A</mark> |  |  |  |  |  |  |  |  |
| Nanya | NT5AD512M16A4 | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  |  |  |  |  |
| Nanya | NT5AD512M16C4 |  | 8G bit | 512M×16 | DDR4 | 96ball | N/A | N/A |  |  | N/A | N/A [30] |  | N/A [30] | N/A [30] | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Nanya | NT5AD512M16G4 | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| Nanya | <mark>NT5AD512M16H4</mark> |  | <mark>8G bit</mark> | <mark>512M×16</mark> | <mark>DDR4</mark> | <mark>96ball</mark> |  |  |  |  |  | <mark>T/A</mark> |  | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT6TL128M32AQ |  | 4G bit | 128M×32 | LPDDR2 | 168ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Nanya | NT6TL256F32AI |  | 8G bit | 256M×32 | LPDDR2 | 134ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Nanya | NT6TL256T32AI |  | 8G bit | 256M×32 | LPDDR2 | 134ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Nanya | NT6TL256T32AQ |  | 8G bit | 256M×32 | LPDDR2 | 168ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| Nanya | NT6CL128M32BM |  | 4G bit | 128M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Nanya | NT6CL128M32CM |  | 4G bit | 128M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A | T/A | T/A |  |  |  |  |  |
| Nanya | NT6CL128M32DM |  | 4G bit | 128M×32 | LPDDR3 | 178ball | T/A | T/A |  |  |  |  |  |  |  | T/A |  |  | T/A |  |  |  | T/A | T/A | T/A |  |  |  |  |  |
| Nanya | NT6CL256T32CM |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |  |
| Nanya | NT6CL256T32BM |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A |  |  |  |
| Nanya | NT6CL256M32AM |  | 8G bit | 256M×32 | LPDDR3 | 178ball | T/A | T/A |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |
| Nanya | NT6CL512T32AM |  | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  | T/A |  | T/A [5] | T/A | T/A [5] | T/A | T/A |  | T/A |  | T/A [5] | T/A |  |  |  |
| Nanya | NT6CL1024F32AP |  | 32G bit | 1024M×32 | LPDDR3 | 178ball | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT6CL256T32AQ |  | 8G bit | 256M×32 | LPDDR3 | 168ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |
| Nanya | NT6AN256T32AV |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| Nanya | NT6AN512T32AV |  | 16G bit | 512M×32 | LPDDR4 | 200ball | T/A | T/A |  |  | N/A | N/A |  | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Nanya | NT6AN1024F32AV |  | 32G bit | 1024M×32 | LPDDR4 | 200ball |  |  |  |  |  |  | N/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT6AP256T32AV |  | 8G bit | 256M×32 | LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT6AP256T32BV |  | 8G bit | 256M×32 | LPDDR4X | 200ball | T/A |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT6AP512T32BV |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT6AP512T32AV |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  |  | T/A |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT6AP512T32BL |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  | N/A | N/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT6AP1024F32BV |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 11

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229 /PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CXMT | CXDQ2BFAMCG | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A [6] |  | T/A [6] |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDQ2BFAM-CE-B |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| CXMT | CXDQ3BFAMCG | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A [6] |  | T/A [6] |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDQ3BFAM-CQ-A | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  | S/A [22] | N/A |  | N/A | S/A [22] | N/A |  | N/A |  | N/A | S/A [22] | N/A | N/A |  | N/A |  |  |  |  |  |
| CXMT | CXDQ3BFAM-CJ-A | EOL | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  | N/A | S/A [22] |  | S/A [22] | S/A [22] | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| CXMT | CXDQ4BFAM-CJ-M |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | S/A [16] |  | S/A [16] | S/A [16] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB3ABAM-MK |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A [7][12] |  | T/A [7][12] | T/A [7][12] | S/A [15] |  |  | T/A |  | T/A |  |  | T/A |  |  |  |  |  |  |
| CXMT | CXDB3ABAM-MK-A |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> | T/A | T/A | T/A [26] | T/A | T/A | S/A [11][15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB3CBAM-MA-A |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB4ABAM-MK |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | T/A [7][12] | T/A [26] | T/A [7][12] | T/A [7][12] | S/A [15] |  |  | T/A |  | T/A |  |  | T/A |  |  |  |  |  |  |
| CXMT | CXDB4CBAM-MK-A |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> | T/A | T/A | T/A [17][26] | T/A | T/A |  |  |  | T/A |  | T/A |  |  | T/A |  |  |  |  |  |  |
| CXMT | CXDB4CBAM-ML-A |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A [17] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB4CCAM-MJ |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | <mark>CXDB4CBAM-MA-B</mark> |  | <mark>16G bit</mark> | <mark>512M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  |  |  | <mark>T/A</mark> |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDBBCCBM-MK-B |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> | T/A | T/A | T/A [26] | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB5CCAM-MK |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | T/A [12] | T/A | T/A [12] | T/A [12] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB5CCAM-ML |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB5CCBM-M&#42;-A |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball | T/A |  |  | T/A | T/A | S/A | T/A [17] | S/A | S/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB5CBAM-MA-B |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball | T/A |  |  | T/A | T/A | T/A | T/A | T/A | T/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| CXMT | CXDBCCCDM-MA-M |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB6CCDM-MA-M |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A [31] |  | T/A | T/A [17] | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB6CCBM-MA-A |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDBDCCCM-MA-M |  | 96G bit | 3G×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A [25] |  |  | T/A [25] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDB7CCDM-MA-M |  | 128G bit | 4G×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDCCDCBM-MT-M |  | 48G bit | 1536M×32 | <mark>LPDDR5</mark> | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CXMT | CXDCDJEDM-MT-M |  | 96G bit | 1536M×64 | LPDDR5 | 496ball |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDP1BFLM-CB |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| GigaDevice/XCMemory | GDP1BFLM-CA |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDP1BFLA-C&#42; |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  | T/A |  | N/A | T/A |  | T/A | T/A |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDP2BFLM-C&#42; |  | 4G bit | 256M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  | T/A | T/A |  | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A |  |  |  | T/A |  |  |  |  |
| GigaDevice/XCMemory | GDP2BFLM-WA |  | 4G bit | 256M×16 | DDR3L | 96ball | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDP3BELM-CB |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  | T/A |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| GigaDevice/XCMemory | GDQ2BFAA-CE |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | N/A |  |  |  | T/A | T/A |  |  |  |  | T/A | T/A | N/A |  | N/A |  |  |  |  |  |
| GigaDevice/XCMemory | GDQ2BFAA-CQ |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | N/A | S/A [20] |  | S/A [20] | S/A [20] | S/A [20] |  | N/A |  | N/A | S/A [20] | S/A [20] | N/A |  | N/A |  |  |  |  |  |
| GigaDevice/XCMemory | GDQ2BFAA-CJ |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| GigaDevice/XCMemory | GDQ2BFAC-CJ |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDQ3BFAM-CJ |  | 8G bit | 512M×16 | DDR4 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | <mark>T/A</mark> |  |  |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDB4CBQM-MK |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  | T/A | T/A |  | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDB4CBQN-M&#42; |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDB4CBQM-ML |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDB5CCQN-ML |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| GigaDevice/XCMemory | GDB5CBQN-ML |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| JHICC | CA4S4G16V-F9&#42;&#42;C |  | 4G bit | 256M×16 | DDR4 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  | T/A [8] |  | T/A [8] | T/A [8] | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| JHICC | CA4S8G16V-F9&#42;&#42;C |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| ESMT | M14D1G1664A-1.8BG2S |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ESMT | M15T1G1664A-DEBG2C |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | N/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ESMT | M15T1G1664A-DEBG2CS |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |
| ESMT | M15T1G1664A-EFBG2S |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ESMT | M15T1G1664A-DEBG2S |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  | T/A |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ESMT | M15T2G16128A-DEBG2L | EOL | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | N/A | N/A |  |  |  |  | T/A |  |  |  |
| ESMT | M15T2G16128A-DEBG2LS | EOL | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  | T/A | T/A | T/A |  | T/A | T/A | T/A |  |  |  |
| ESMT | M15T2G16128A–DEBG2R |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| ESMT | M15T2G16128A-DEBG2D |  | 2G bit | 128M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ESMT | M15T4G16256A-DEBG2L | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |
| ESMT | M15F4G16256A-DEBG2L | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  |  |  |  | N/A |  |  |  |
| ESMT | M15T4G16256A–DEBG2R | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| ESMT | M15T4G16256A–DEBG2G | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| ESMT | M15T4G16256A–DEBG2S |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ESMT | M15T4G16256A-DEBG2P |  | 4G bit | 256M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  |  |  |  |  |  |  | T/A |  |  |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |
| ESMT | M16U4G16256A-KJBG |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| ESMT | M16U4G16256A-QLBG |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| ESMT | M16U4G16256A-QLBG2Z |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| ESMT | M16U8G16512A-NLBG2W |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ESMT | M16U8G16512A-NLBG2C |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| ESMT | M56Z8G32256A-SMBIG |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  | S/A [15] |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| ESMT | M56Z8G32256A-SMBYIG |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  | N/A | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ESMT | M56Z16G32512A-TNBYG2D |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| UniIC | SCB15H1G160CF-13K |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| UniIC | SCB15H1G160AF-13K |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| UniIC | SCB13H1G160EF-11M |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| UniIC | SCN13H2G160AF-13K |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |
| UniIC | SCB13H2G160AF-11M |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  | T/A |  |  |  |
| UniIC | SCB15H2G160AF-13K | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| UniIC | SCB13H2G160AF-13K |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  | N/A |  | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| UniIC | SCB13H2G160EF-09N |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  | <mark>T/A</mark> |  | T/A |  |  |  |  | T/A | T/A |  |  |  | T/A | T/A | T/A |  | T/A | T/A |  |  |  |  |
| UniIC | SCB13H4G160AF-11M |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A | T/A |  |  |  |
| UniIC | SCB13H4G160BF-11M |  | 4G bit | 256M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| UniIC | HXB15H4G800AF-13K |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  | T/A |  |  |  |
| UniIC | HXB13H4G160AF-13KT |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A |  |
| UniIC | HXI15H4G160AF-13K |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| UniIC | SCB13H8G162BF-11M |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A | T/A | T/A |  | T/A |  | T/A |  |  |  |  |
| UniIC | SCB12Q4G160AF-07Q |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | N/A | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| UniIC | SCB12Q4G160BF-07Q |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| UniIC | SCB12Q4G160BF-06S |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | T/A | T/A |  | T/A | T/A |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| UniIC | SCB12Q8G160BF-06S |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| UniIC | SCE11N4G320AF-06YA3 |  | 4G bit | 128M×32 | LPDDR4 | 200ball |  |  |  |  |  | N/A |  | N/A | N/A |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| UniIC | SCE11N8G322AF-062YA2 |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| UniIC | SCE11R8G322AF-062YA2 |  | 8G bit | 256M×32 | LPDDR4X | 200ball |  |  |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 12

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCSemicon | HXB18T1G160AF-25D |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCSemicon | HXB18T2G160AF-25D |  | 2G bit | 128M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCSemicon | HXB15H2G800BF-15H |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | N/A | T/A |
| SCSemicon | HXB15H2G160CF-13K |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |
| SCSemicon | HXB15H4G800BF-15H |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | N/A | T/A [1] |
| SCSemicon | HXB15H4G160BF-15H |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A [29] |
| Winbond | W9751G6KB-25 |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W9751G6NB-25 |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W971GG6SB-18 |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W631GG6KB-12 |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  | T/A |  |  |  |
| Winbond | W631GG6MB-12 | EOL | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W631GU6NB-12 |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A [10] |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W631GU6RB-11 |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W632GG6KB-15 |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Winbond | W632GG6NB-12 |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Winbond | W632GU6NB-09 |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W632GU6QB-09 |  | 2G bit | 128M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W632GU6RB-&#42;&#42; |  | 2G bit | 128M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  | <mark>T/A</mark> |  |
| Winbond | W634GU6QB-11 |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A [13] |  |  |  |  | T/A [13] |  |  |  |  |  |  |
| Winbond | W634GU6QB-09 |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| Winbond | W634GU6RB-&#42;&#42; |  | 4G bit | 256M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> | T/A |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |
| Winbond | W638GU6QB-11I |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Winbond | W638GU6QB-09 |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  | T/A |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W664GG6RB-06 |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |
| Winbond | W66BL6NBUAFI |  | 2G bit | 128M×16 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Winbond | W66DP2RQQA&#42;J |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Etron Tech | EM68B16CWPA-25H |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM68B16CWQK-18H |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM68B16CWQH-18H |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6GC16EWKG-12H |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |  | T/A |  |  |  |
| Etron Tech | EM6HC16EWBJ-10H |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6GC16EWKE-12H | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6GC16EWXD-12H | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6GD16EWKG-12H | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A | T/A |  |  |  |  | T/A |  |  |  |
| Etron Tech | EM6GD16EWXF-12H | EOL | EOL | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A | T/A |  |  |  |  | T/A |  |  |  |
| Etron Tech | EM6GD16EWBH-12H |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  |  | T/A |  |  |
| Etron Tech | EM6HC16EWBH-09H |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  | N/A | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Etron Tech | EM6GE16EW5B-15H |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Etron Tech | EM6GE08EW8C-12H |  | 4G bit | 512M×8 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  |
| Etron Tech | EM6GE16EWXC-12H |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| Etron Tech | EM6HE16EWXD-12H | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A | T/A |  | T/A |  | T/A |  |  |  |
| Etron Tech | EM6GE16EWXD-10H | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |
| Etron Tech | EM6GE16EW5F-12H | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |
| Etron Tech | EM6HE16EW5F-12H | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |
| Etron Tech | EM6HE16EWAKG-10H |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  | <mark>T/A</mark> |  |  | T/A |  | T/A | T/A | T/A |  | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |
| Etron Tech | EM6HE16EWAKG-09H |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6GE16EWAKG-10H |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  | <mark>T/A</mark> |  |  | T/A |  | T/A | T/A | T/A |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Etron Tech | EM6HF16EBXB-10SH |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6HF16EBXB-10ESH |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |
| Etron Tech | EM6HF16EBXB-09SH |  | 8G bit | 512M×16 | DDR3L | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  | T/A [21] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6OE16NWAKA-08H |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6OE16NWBB-62H |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6OE16NWBB-07H |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | T/A |  |  |  | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6OF16NWBD-62H |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Etron Tech | EM6OF16NWBE-62H |  | 8G bit | 512M×16 | DDR4 | 96ball | <mark>T/A</mark> | <mark>T/A</mark> |  |  | T/A | T/A |  | T/A | T/A |  |  |  |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6OG16NWBB-62H |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Etron Tech | EM6PH32MVAJA-46SH |  | 32G bit | 1024M×32 | LPDDR4 | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Zentel | A3R12E40DBF-AH |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Zentel | A3T1GF40CBF-HP |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Zentel | A3T1GF40CBF-GM |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Zentel | A3T2GF40BBF-GM |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  | T/A |  |  |
| Zentel | A3T2GF40CBF-HP |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Zentel | A3T4GF40BBF-HP |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Zentel | A3T4GF40ABF-GM |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |
| Zentel | A3T8GF33BBF-GM&#42;&#42; |  | 8G bit | 1G×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A |  |  |  |  |  |  |  |  |
| Zentel | A3T8GF33BBF-HP&#42;&#42; |  | 8G bit | 1G×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A |  |  |  |  |  |  |  |  |
| Zentel | A3F4GH40CBF-WD |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Zentel | A3F8GH40BBF-KD |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Zentel | A3F4GH40ABF-WD |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |
| Zentel | A3F8GH40BBF-MC |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Zentel | A8XAGH50BBA-PM |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Zentel | A8XAGH50ABA-PM |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  |  | T/A [26] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Zentel | A8XBGH52ABA-PM |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  |  | T/A [26] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Zentel | A8XBGH52BBA-PM |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Zentel | A8XBGH50BBA-CM |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 13

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| πPM | PME810816CBR-G8DN |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| πPM | PMF510816ABR-G8DN |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| πPM | PMF410816EBR-MBDN |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| πPM | PMF511816ABR-G8DN |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| πPM | PMF511816DBR-KADN |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| πPM | PMF411816HBR-NCDN |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| πPM | PMF412816HBR-KADN |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| πPM | PMF512816BBR-KADN |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| πPM | PMF512816DBR-KADN |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| πPM | PMF512816HBR-KADN |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A [9] |  |  |  |  |
| πPM | PMF512816HBR-NCDN |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| πPM | PMF412816FBR-KADN |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| τ Memory | TMF41G6EBR-MBDN |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  | T/A |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| τ Memory | TMF42G6HBR-MBDN |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| τ Memory | TMF42G6HBR-NCDN |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| τ Memory | TMF54G6HBR-KADN |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A [9] |  |  |  |  |
| τ Memory | TMF54G6HBR-NCDN |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| τ Memory | TDG64G6DB-KCNN |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| τ Memory | TDG68G6CB-KCNN |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISSI | IS43TR16640B-125KBL |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISSI | IS43TR16128C-125KBL |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A | T/A | T/A |  | T/A |  | T/A |  |  |  |
| ISSI | IS43TR16512BL-125KBLI |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  | T/A |  |  |  |  |
| Essencore | I5TQ4G63EFR |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |
| Essencore | EL38NMAAA1-PBER |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Essencore | EL4BPMBBB1-S4ER |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| SPECTEK | PE918-15E (PRN256M8V79DG8GQF-15E) |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| SPECTEK | PE936-15E (PRN256M8V89CG8GQF-15E) |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  | T/A | T/A | N/A |
| SPECTEK | PEB08-15E (PRN512M8V80AG8RHF-15E) |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  | T/A | T/A [1] |
| SPECTEK | PEB15-15E (PRN256M16V80AG8GPF-15E) |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A |
| SPECTEK | PEB16-15E (PRM256M16V80AG8GPF-15E) |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  | T/A | T/A |
| SPECTEK | PE017 (SUU256M16V90BG8LY-125TP) |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |
| SPECTEK | PE039 (SUU256M16V90BG8LY-125TP) |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  | T/A |  |  |  |
| SPECTEK | PE029 (PRN256M16V00HG8GNF-125) |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| SPECTEK | Z9QHG (SM128MX32U80MD1LGU-25FT) |  | 4G bit | 128M×32 | LPDDR2 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |
| SPECTEK | PB047 (SS256M32V01MD1LPF-107BT) |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A |  |  |  |  |  |  |  |  |
| SPECTEK | PB008 (SM512M322E0FD4LHL) |  | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| SPECTEK | PS006 (SU256M32Z01MD1BNP) |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| SPECTEK | PS007 (SU512M32Z01MD2BNP) |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| SPECTEK | (PS086) SU256M64Z00MD4DKN) |  | 16G bit | 256M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| SPECTEK | PS004 (SM512M64Z91MD4BNK) |  | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| SPECTEK | PS035 (SU512M64Z01MD4BNK) |  | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| SPECTEK | PS013 (SM512M64Z01MD4BNK) |  | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| SPECTEK | PU031 (SM768M64Y4BMD4FZU-UT) |  | 48G bit | 768M×64 | LPDDR5/LPDDR5X | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SPECTEK | PU055 (SM1G64Y42MD4FZV-UT) |  | 64G bit | 1G×64 | LPDDR5/LPDDR5X | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SPECTEK | PU032 (SM1536M64Y4BMD8FCL-UT) |  | 96G bit | 1536M×64 | LPDDR5/LPDDR5X | 496ball |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SPECTEK | PU054 (SM2G64Y42MD8FCL-UT ) |  | 128G bit | 2G×64 | LPDDR5/LPDDR5X | 496ball |  |  |  |  |  |  | T/A [18] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 14

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK290x RK2918 | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| elixir | N2CB2G16JR-FL |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| elixir | N2CB4G16ER-FL |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| elixir | N2AD4G16E4-JR |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | S/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| elixir | N2AD8G16C4-JR |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| MIRA | P3R1GE4CFF-G8E |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | √ |  |  |
| MIRA | P3R1GE3FGF-G8E |  | 1G bit | 128M×8 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | √ |  |  |
| MIRA | P2P2GF4ALF-GGN |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  | T/A |  |  |  |
| MIRA | P2P2GF4ALF-GJS |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |
| MIRA | P3P4GF3BLF-GGN |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  | N/A | N/A |
| MIRA | P3P4GF4BLF-GGN |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| MIRA | P3P4GF4BLF-GJS |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| MIRA | P3P4GF4DMF-GJS |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |
| MIRA | P5M4GK4CMF-GMX |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  |  |  |  |  |
| Kingston | D1216ECMDXGJD |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| Kingston | D5128EETBPGGBU |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  | T/A | T/A [29] |
| Kingston | D2516EC4BXGGB | EOL | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A [3] |  |  |  |  |  |  |  |  | T/A [3] | T/A [3] |  | T/A [3] | T/A [3][29] |
| Kingston | D2516ECMDXGJD |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A | T/A |  | T/A | T/A | T/A | T/A |  | T/A | T/A | T/A |  |  |  |
| Kingston | D2516JC4BXGJD |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Kingston | B5116ECMDXGJD |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  | T/A |  |  |  |  |
| Kingston | D2516ACPCXGRK | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| Kingston | D2516AN9EXGXN |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | S/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| Kingston | D5116AH8CXGUM |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  | T/A |  | T/A |  |  |  |  |  |  |  |  |  |  |
| Kingston | D5116AN9CXGXN |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Kingston | D2532LA3WLGJA |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  | T/A |  |  |  |
| Kingston | D2532LA6MLGJA |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  | T/A |  |  |  |  |  |
| Kingston | D0811LN2ALGJA |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Kingston | KB23AADL3E08G |  | 8G bit | 512M×16 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Kingston | C1612LN2ALGJA |  | 8G bit | 512M×16 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Kingston | D2516PC1CDGPLR | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Kingston | B1621PC6FDGUKR | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  | T/A [7] | N/A | T/A [7] | T/A [7] | S/A [15] |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| Kingston | Q5116PH1MDGPAR | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Kingston | B5116PH3MDGPAR | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  | S/A [15] |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Kingston | B1621XH5ADGTKR | EOL | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  |  |  | S/A [7] | T/A [7] | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Kingston | B1621XH6BDGTAR | EOL | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Kingston | B1621XH7CDGUAR |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  |  | T/A [26] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Kingston | B2421XC4FDGTKR | EOL | 24G bit | 768M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| Kingston | B3221XC5GDGTKR | EOL | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A [7] |  | T/A [7] | T/A [7] | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| Kingston | Q3222XH6BDGUAR | EOL | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  |  | T/A [26] | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 15

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK290x RK2918 | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FORESEE | F60C1A0002-M6 |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  | <mark>T/A</mark> |  |  |  |  |  |  | T/A | T/A |  |  |  | T/A | T/A | T/A |  | T/A | T/A | T/A |  | <mark>T/A</mark> |  |
| FORESEE | F60C1A0004-M7 |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A | T/A |  | T/A |  | T/A | T/A |  | T/A |  | T/A | T/A |  |  |  |
| FORESEE | F62C1A0004-M5 |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FD4V10004-22 |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| FORESEE | FD45116ZSA062C |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| FORESEE | MD4C10004-N93R |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| FORESEE | MD4C1001G-N43R |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| FORESEE | MD4C1002G-W43R |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  | T/A | T/A |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| FORESEE | NCLD3B1128M32 |  | 4G bit | 128M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| FORESEE | NCLD3B2256M32 |  | 8G bit/ 2cs | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  | T/A |  |  |  |  |
| FORESEE | NCLD4C1MA256M32 | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| FORESEE | NCLDXC1MG256M32 |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| FORESEE | FL4C2001G-D9 |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC2002G-N2 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A [11] |  | T/A [11] | T/A [11] | S/A [11][15] |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| FORESEE | FLXC2002G-26 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A [11] |  | T/A [11] | T/A [11] | S/A [11][15] |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC2002G-C4 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | NCLD4C2MA512M32 | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| FORESEE | NCLDXC1MC512M32 | EOL | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A [11] |  |  |  |  | T/A [11] |  |  |  |  |  |  |
| FORESEE | NCLDXC1MJ512M32 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| FORESEE | FLXC1002G-N1 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A [11] |  |  |  |  | T/A [11] |  |  |  |  |  |  |
| FORESEE | FLXC2002G-W6 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC2003G-49 |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC4003G-W7 |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | N/A | T/A [26] | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC4004G-26 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC2004G-N1 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXW2004G-P1 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC4004G-W6 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | N/A | T/A [26] | N/A | N/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC4004G-61 |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC2004G-30 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>S/A [26]</mark> |  |  | S/A [26] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC4006G-20 |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | N/A | T/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC4006G-63 |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXCE006G-61 |  | 48G bit | 1536M×32 | LPDDR4X | 200ball |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  |  | N/A |  |  |  |  |  |
| FORESEE | FLXC4006G-49 |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC8008G-61 |  | 64G bit | 2048M×32 | LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXC4008G-30 |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FLXW4008G-P1 |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FL5P4004G-N5 |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FL5P2004G-60 |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | <mark>FX5P2004G-60</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR5X</mark> | <mark>315ball</mark> |  |  |  | <mark>T/A</mark> |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FL5P4006G-62 |  | 48G bit | 1536M×32 | LPDDR5 | 315ball |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | FL5P4008G-60 |  | 64G bit | 2048M×32 | LPDDR5 | 315ball |  |  |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 16

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK290x RK2918 | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BIWIN | BWPDD3X16A9B-04Gb |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | T/A | N/A |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |
| BIWIN | BWSD3X16N8B-04Gb |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWND3X16J8B-04Gb |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |
| BIWIN | BWSDD4X16A9B-04Gb |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  | T/A | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| BIWIN | BW52L256M32D1PF |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| BIWIN | BW52L512M32D2PF |  | 16G bit | 512M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  | T/A |  | T/A |  |  |  |
| BIWIN | BWMD4X32H2A-08Gb | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| BIWIN | BWMECX32H2A-08Gb | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  | S/A [15] |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| BIWIN | BWMD4X32H2A-16Gb | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| BIWIN | BWME9X32H2A-16Gb |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  | T/A |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| BIWIN | BWMEYX32H2A-16Gb |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| BIWIN | BWME9X32H2A-16Gb-X |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZAX32H2A-16G-X |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | S/A | T/A [26] | S/A | S/A |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| BIWIN | BWMZEX32H2A-16G-X |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | T/A | T/A [26] | T/A | T/A |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| BIWIN | BWSR8X32H2A-16G-X |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | <mark>S/A [26]</mark> |  | T/A | S/A [26] | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWSRSX32H2A-16G-X |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWCC2X32N2A-16G-X |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> | T/A | T/A | T/A [26] | T/A | T/A |  |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| BIWIN | BWCC1X32N2A-16G-X |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  | T/A | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWME4X32H2A-24Gb-X |  | 24G bit | 768M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMEXX32H2A-24Gb-X |  | 24G bit | 768M×32 | LPDDR4X | 200ball |  |  |  | <mark>S/A [26]</mark> |  | N/A | S/A [26] | N/A | N/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMEIX32H2A-24G-X |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| BIWIN | BWCC4X32N2A-24G-X |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | <mark>BWSRGX32H2A-24G-X</mark> |  | <mark>24G bit</mark> | <mark>768M×32</mark> | <mark>LPDDR4X</mark> | <mark>200ball</mark> |  |  |  | <mark>T/A</mark> |  | <mark>T/A</mark> | <mark>T/A</mark> | <mark>T/A</mark> | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMEDX32H2A-32Gb-X |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  | T/A |  | T/A [7] | T/A | T/A [7] | T/A [7] | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| BIWIN | BWSR8X32H2A-32G-X | EOL | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  |  | N/A | N/A | T/A [26] | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| BIWIN | BWSRSX32H2A-32G-X |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZAX32H2A-32Gb-X |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | T/A | T/A [26] | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZCX32H2A-32G-X |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | T/A | T/A [26] | T/A | T/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| BIWIN | BWCC2X32N2A-32G-X |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | T/A | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWCGBX32N2A-32G-X |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A | S/A | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMEIX32H2A-48G-X |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMEXX32H2A-48Gb-X |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZCX32H2A-64G-X |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | S/A | T/A [26] | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMEDX32H2A-64Gb-X |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | N/A | T/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWCGBX32N2A-64G-X |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZGX32P8A-24G |  | 24G bit | 768M×32 | LPDDR5 | 315ball |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWSR9X98P8A-24Gb |  | 24G bit | 768M×32 | LPDDR5 | 315ball |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZJX32P8A-32G |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMYAX32P8A-32G |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  |  |  | <mark>S/A [32]</mark> |  |  | <mark>S/A [32]</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZGX32P8A-48G |  | 48G bit | 1536M×32 | <mark>LPDDR5</mark> | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | <mark>BWMEJX32P8A-48G</mark> |  | <mark>48G bit</mark> | <mark>1536M×32</mark> | <mark>LPDDR5/LPDDR5X</mark> | <mark>315ball</mark> |  |  |  | <mark>T/A</mark> |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMYAX32P8A-64G |  | 64G bit | 2048M×32 | <mark>LPDDR5/LPDDR5X</mark> | 315ball |  |  |  | <mark>S/A [32]</mark> |  |  | <mark>S/A [32]</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZJX32P8A-64G |  | 64G bit | 2048M×32 | LPDDR5 | 315ball |  |  |  | T/A |  |  | S/A [25] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 17

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B | RV1126B-P | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK290x RK2918 | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RAYSON | RS128M16VRDK-93BT | EOL | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| RAYSON | RS128M16V8DB-107AT |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  | T/A |  |  | T/A |  | T/A | T/A |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS256M16V0DB-107AT |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  | T/A |  |  | T/A |  | T/A | T/A |  | T/A |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| RAYSON | RS256M16VRDK-93BT | EOL | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS256M16VNDG-107AT |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| RAYSON | RS256M16ZADD-75DT |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS256M16Z0DC-75DT | EOL | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| RAYSON | RS512M16Z2DD-62DT |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  | T/A | T/A |  | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1G16Z3DK-75DT |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  | N/A | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1G16Z3DK-62DT |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1G16Z4DD-62DT |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS128M32LD3D1LMZ-125BT | EOL | 4G bit | 128M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A | T/A |  |  |  |  |  |  |  |  |
| RAYSON | RS256M32LD3D1LMZ-125BT |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | <mark>RS512M32LD3D2LMZ-125BT</mark> |  | <mark>16G bit</mark> | <mark>512M×32</mark> | <mark>LPDDR3</mark> | <mark>178ball</mark> |  |  |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS128M32LZ4D1ANP-75BT |  | 4G bit | 128M×32 | LPDDR4/LPDDR4X | 200ball | <mark>T/A</mark> |  |  |  | T/A |  |  |  |  | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS256M32LZ4D1ANP-75BT | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  | N/A |  | N/A | N/A | S/A [15] |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| RAYSON | RS256M32LZ4D2BNP-62BT |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| RAYSON | RS256M32LS4D1BNR-46BT |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| RAYSON | RS512M32LZ4D2ANP-75BT | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  | S/A [15] |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| RAYSON | RS512M32LM4D2BDS-53BT |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| RAYSON | RS512M32LO4D1BDS-53BT |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> | T/A | T/A | T/A [26] | T/A | T/A | S/A [11][15] |  |  | N/A |  | T/A |  |  | N/A |  |  |  |  |  |  |
| RAYSON | RS512M32LO4D1BDS-46BT |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS512M32LX4D2BNR-53BT |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> | T/A | T/A | T/A [26] | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS768M32LB4D2BDS-53BT |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A |  | T/A | T/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| RAYSON | RS768M32LP4D2BDS-53BT |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | N/A | T/A [26] | N/A | N/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1G32LF4D2BDS-53BT | EOL | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A [11] | N/A | T/A [11] | T/A [11] | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1G32LO4D2BDS-53BT |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | T/A | T/A [26] | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1G32LO4D2BDS-46BT |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1G32LX4D4BNR-53BT |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | T/A | T/A [26] | T/A | T/A |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1G32LR4D2BNR-46BT |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | <mark>RS1G32LV4D2BDS-46BT</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  |  |  | <mark>T/A</mark> |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1536M32LB4D4BDT-53BT |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | N/A | T/A [26] | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS2G32LV4D4BDT-53BT |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | T/A | T/A [26] | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS2G32LV4D4BDT-46BT |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS2G32LF4D4BDT-53BT | EOL | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | T/A | N/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS2G32LX4D8BNR-53BT |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  | T/A | T/A [26] | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS2G32LR4D4BNR-46BT |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS4G32LV4D8BDT-53BT |  | 128G bit | 4G×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>T/A [26]</mark> |  |  | T/A [26] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1G32LO5D2FDB-31BT |  | 32G bit | 1024M×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS1536M32LG5D4FDB-31BT |  | 48G bit | 1536M×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | N/A |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS2G32LO5D4FDB-31BT |  | 64G bit | 2G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | S/A [23] |  |  | S/A [23] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS3G32LG5D8FDB-31BT |  | 96G bit | 3G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | T/A |  |  | S/A [25] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| RAYSON | RS4G32LO5D8FDB-31BT |  | 128G bit | 4G×32 | LPDDR5/LPDDR5X | 315ball |  |  |  | S/A |  |  | S/A [25] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DP3B04G16BBB |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A | N/A |  |  |  | N/A |  |  |  |  |
| SCY | SD4D8G6-FC |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DP4D04G16FJB |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |
| SCY | DP4D08G16FJB |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | D4A16G32D2V-DC | EOL | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  |  |  |  | S/A [11][15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DL4A16G32K1V-DC | EOL | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A |  | S/A | S/A |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| SCY | DL4A16G32T2V-EC |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>S/A [26]</mark> | S/A | S/A | S/A [26] | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DL4A24G32A2V-EC |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DL4A24G32P4V-EC |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DL4A32G32N2V-EC |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A |  | S/A | S/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| SCY | DL4A32G32T4V-EC |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  | <mark>S/A [26]</mark> |  | S/A | S/A [26] | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DL4A32G32S2V-EC |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | <mark>DL4A32G32H4V-EC</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  |  |  | <mark>S/A</mark> |  |  | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DL4A48G32E4V-DC |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | N/A | S/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DL4A48G32A4V-EC |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DL4A64G32N4V-EC |  | 64G bit | 2G×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | DL4A64G32S4V-EC |  | 64G bit | 2G×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | SL5D32G32A2A-GC0 |  | 32G bit | 1024M×32 | <mark>LPDDR5</mark> | 315ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | <mark>SL5D48G32B4A-GC0</mark> |  | <mark>48G bit</mark> | <mark>1536M×32</mark> | <mark>LPDDR5X</mark> | <mark>315ball</mark> |  |  |  | <mark>S/A</mark> |  |  | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SCY | SL5D64G32C4A-GC0 |  | 64G bit | 2G×32 | <mark>LPDDR5X</mark> | 315ball |  |  |  | <mark>S/A</mark> |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hosin | HG-DR30232-62001 |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A |  | S/A |  |  |  |  |
| Hosin | HG512M32D2PDA1-H2 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hosin | HG4XB02G-C2JA |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | <mark>S/A [26]</mark> |  | S/A | S/A [26] | S/A | S/A |  |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Hosin | HG768M32D4LQM1-H1 |  | 24G bit | 768M×32 | LPDDR4 | 200ball |  |  |  |  |  | N/A |  | N/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hosin | HG4XD03G-C4JA |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hosin | HG4XD04G-C2JA |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Hosin | HG4XD08G-C8JA |  | 64G bit | 2G×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dosilicon | FM38E16SAB-9MGD |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |
| Dosilicon | FM38F16SBB-9MGD |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |  |  | S/A |  |  |  |  |

### Industrie und erweiterter Temperaturbereich — Quellseite 18

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RV1126B J | RV1126B-P | RK3506J | RK3576J | RK3528 | RK3562J | RK3588J | RK3568J | RK3566 | RV1126K | RV1108K1 RK3308J | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3358J | RK1808K | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229 /PX5 | RK290x RK2918 | RK2926/RK3026/RK3036/RK3036G/RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Micron | MT41K128M16JT-107 IT:K(D9RQN) |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |
| Micron | MT41K256M16TW-107 IT:P(D9SHG) |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Micron | MT41K512M16VRP-107IT:P(D9ZWN) |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |
| Micron | MT40A512M16TB-062E IT:R(D8BVB) |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT40A1G16TD-062E AIT:F (D8CHH) |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT40A1G16TB-062E IT:F (D8CJZ) |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E256M32D1KS-046 IT:L (D8FCZ) |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E384M32D2FW-046 IT:E (D8BXT) |  | 12G bit | 384M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E512M32D1ZW-046 BIT:B (D8FLQ) |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Micron | MT53E1G32D2FW-046 IT:C (D8DVP) |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4B4G1646E-BMMA |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  | T/A |  | T/A |  |  |  |  |  |  |
| Samsung | <mark>K4A4G165WG-BIWE</mark> |  | <mark>4G bit</mark> | <mark>256M×16</mark> | <mark>DDR4</mark> | <mark>96ball</mark> | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Samsung | K4F6E3S4HM-TF&#42;&#42; |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  | S/A [15] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5CC256M16ER-EKI |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| Nanya | NT5AD256M16E4-JRI |  | 4G bit | 256M×16 | DDR4 | 96ball | <mark>T/A</mark> |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nanya | NT5AD512M16C4-JRI |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Nanya | NT6AN512T32AV-J1I |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| CXMT | CXDQ3BFAM-IJ-A |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  | N/A | S/A [22] |  | S/A [22] | S/A [22] | N/A |  | N/A |  | N/A | N/A | S/A [22] | N/A |  | N/A |  |  |  |  |  |
| GigaDevice | GDP1BFLA-WB |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GigaDevice | GDP2BFLM-WB |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GigaDevice | GDQ2BFAA-WJ |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  | S/A [20] |  | S/A [20] | S/A [20] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| UniIC | SCB13H8G162BF-13KI |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  | T/A |  |  |  |  |  |  |
| UniIC | SCB12Q8G160BF-06SI |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| winbond | W632GU6NB-11K |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |
| winbond | W634GU6NB-11K |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |
| ISSI | IS46DR16320E-25DBLA2 |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISSI | IS43TR16128DL-125KBLI |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISSI | IS43TR16512BL-107MBLI |  | 8G bit | 512M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISSI | IS43QR16256B-083RBLI |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| ISSI | IS46QR16512A-075VBLA2 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISSI | IS43QR16512A-083TBLI |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |
| ISSI | IS43LD16128C-18BLI |  | 2Gb bit | 128M×16 | LPDDR2 | 134ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISSI | IS43LQ32256A-062BLI |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  |  | S/A [24] | S/A [24] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ISSI | IS43LQ32256B-0&#42;&#42;BL&#42;&#42; |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| Zentel | A3R12E40DBF-8EA |  | 512M bit | 32M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Zentel | A3T2GF40CBF-HPI |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZAX32H2A-16GI-X |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | BWMZCX32H2A-32GI-X |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | N/A | T/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIWIN | <mark>BWMZCX32H2A-64GI-X</mark> |  | <mark>64G bit</mark> | <mark>2048M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  |  |  | <mark>T/A</mark> |  |  | <mark>T/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| FORESEE | F60C1A0004-M79W |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |  | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Artmem | ATL4X2G32M1D-46 IT |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Artmem | ATL4X4G32M1D-46 IT |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  | T/A | T/A | T/A | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Artmem | ATL4X8G32M2D-46 IT |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | T/A |  |  | T/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Automobilbereich — Quellseite 19

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RK2118 | RK3576M | RK3588M | RK3568M | RK3308M | RK3358M |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Micron | MT53E256M32D1KS-046 AAT:L (D8FDP) |  | 8G bit | 256M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Micron | MT53E512M32D1ZW-046 AAT:B (D8CSG) |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A | T/A |  |  |
| Micron | MT53E768M32D2ZW-046 AIT:C（D8DTX） |  | 24G bit | 768M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Micron | MT53E1G32D2FW-046 AAT:B (D8CJB) |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A | T/A |  |  |
| Micron | MT53E1536M32D4DE-046 AIT:C (D8DCZ) |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A | T/A |  |  |
| Micron | MT53E2G32D4DE-046 AAT:C (D8CJK) |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A | T/A |  |  |
| Micron | MT53E2G32D4DE-046 AAT:A (D9ZRB) |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Micron | MT53E4G32D8GS-046 AIT:C (D8DHH) |  | 128G bit | 4G×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Micron | MT53E1G32D2FW-046 AIT:C (D8DWK) |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Samsung | K4F8E3S4HD-GF&#42;&#42; |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  | T/A | T/A | T/A |  |  |
| Samsung | K4F6E3S4HB-KH&#42;&#42; |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  | T/A | T/A |  |  |  |
| Samsung | K4FHE3S4HA-KH&#42;&#42; |  | 24G bit | 768M×32 | LPDDR4 | 200ball |  |  |  | N/A |  |  |
| Samsung | K4FBE3D4HB-KH&#42;&#42; |  | 32G bit | 1024M×32 | LPDDR4 | 200ball |  | T/A | T/A | T/A |  |  |
| Samsung | K4U6E3S4AB-KH&#42;&#42; |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Samsung | K4UJE3Q4AA-T&#42;&#42;&#42; |  | 48G bit | 1536M×32 | LPDDR4X | 200ball |  |  | N/A | N/A |  |  |
| Samsung | K4UCE3Q4AB-KH&#42;&#42; |  | 64G bit | 2048M×32 | LPDDR4X | 200ball |  |  | N/A | T/A |  |  |
| Hynix | H54G66BYYVX104 |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Hynix | H54G46BYYQX085N |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Hynix | H54G56BYYQX089N |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Hynix | H54G56BYYQX089 |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Nanya | NT5CC64M16GP-EKH |  | 1G bit | 64M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |
| Nanya | NT5CC256M16ER-EKA |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  | T/A |
| Nanya | NT6AN512T32AC-J2J |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  | N/A |  |  |
| Nanya | NT6AN512T32AC-J1H |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  | N/A | N/A |  |  |
| CXMT | CXDB4CBAM-EA-M |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A | T/A |  |  |
| CXMT | CXDB4CBAM-EA-A |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| CXMT | CXDB5CCBM-EA-M |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | N/A |  |  |
| CXMT | CXDB5CCBM-EA-A |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| CXMT | CXDBCCCDM-EA-M |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| CXMT | CXDB6CCDM-EA-M |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| ISSI | IS46LQ32256B-053BLA1 |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  | N/A |  |  |  |
| Foresee | FLXCE004G-61 |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| BIWIN | BWLGYB008GN6ZC |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Artmem | ATL4X4G32M1D-46 AIT |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Artmem | ATL4X6G32M2D-46 AAT |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |
| Artmem | ATL4X8G32M2D-46 AAT |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | T/A | T/A |  |  |  |

### Ausschließlich vom Hersteller geprüft — Quellseite 20

Die Quelle enthält die Abschnittsüberschrift, aber keine Bauteilzeilen.

<table><thead><tr><th>Hersteller</th><th>Teilenummer</th><th>Produktstatus</th><th>Speicherdichte</th><th>Organisation</th><th>Typ</th><th>Gehäuse</th><th>RV1126B</th><th>RV1126B-P</th><th>RK3506/RK2118</th><th>RK3576</th><th>RK3528</th><th>RK3562</th><th>RK3588/RK3588S</th><th>RK3568</th><th>RK3566</th><th>RV1126/RV1109</th><th>RV1108/RK3308/RK3308B-S</th><th>RK3228H</th><th>RK3399</th><th>RK3328</th><th>RK3326S/PX30S</th><th>RK3326/PX30</th><th>RK1808/RK1806</th><th>RK3399PRO CPU&#95;RAM</th><th>RK3399PRO NPU&#95;RAM</th><th>RK3288</th><th>RK3368/RK3228A/RK3228B/RK3229/PX5</th><th>RK2928/RK3028A/RK3128/PX3-SE</th><th>RK2926/RK3026/RK3036/RK3036G/RK3126</th><th>RK3066/RK3066A/PX2/RK3168/RK3188/PX3</th></tr></thead><tbody></tbody></table>

Dieser Abschnitt wurde ausschließlich von DRAM-Herstellern geprüft, nicht von Rockchip. Wenden Sie sich bei Bauteilproblemen an den DRAM-Hersteller und führen Sie vor der Serienproduktion umfassende Produktionsverifikationstests (PVT) durch.

## Offizielle Quellen

[Rockchip Redmine](https://redmine.rock-chips.com/documents/49)

Einige Redmine-Ressourcen erfordern ein berechtigtes Konto. Diese Ausgabe basiert auf der bereitgestellten Version; ihre Aktualität gegenüber späteren Releases wird nicht behauptet.

{% endraw %}
