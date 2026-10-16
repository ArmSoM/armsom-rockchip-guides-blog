---
title: "Rockchip DDR-Referenzliste: Vollständige Matrix und Anwendungshinweise"
description: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
translation_key: "026-rockchip-ddr-reference"
slug: "026-rockchip-ddr-reference"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "production"
products: ["Sige7", "CM5"]
tags: ["Rockchip", "AVL", "ddr-reference", "hardware"]
keywords: "Rockchip DDR-Referenzliste: Vollständige Matrix und Anwendungshinweise, ArmSoM, BSP"
excerpt: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
---

{% raw %}
# Rockchip DDR-Referenzliste: Vollständige Matrix und Anwendungshinweise

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

Diese Referenz unterstützt die Bauteilauswahl auf Plattformebene für ArmSoM-Projekte. Die aufgeführten Bauteile sind nicht auf jedem ArmSoM-Board als austauschbar geprüft. Beachten Sie für Sige7 (RK3588) und CM5 (RK3576) die genaue SoC-Spalte, den Schaltplan, die bestückte Stückliste, das Gehäuse, die Versorgungsspannungen und die Boardrevision. Signalqualität und Eignung für die Serienproduktion müssen auf Boardebene geprüft werden. Die Quelle legt keine allgemeingültige SDK-/BSP- oder Kernelversion fest. Verwenden Sie zusammenpassende Versionen von BSP, Bootfirmware und Treibern und beachten Sie die bauteilspezifischen Hinweise. Für diesen Artikel wurden keine Hardwaretests durchgeführt; Statusangaben und Beispiele stammen aus der Quelle.

Quelle: `Rockchip_DDR_Reference_Vendor_List_ver3.01.pdf`, V3.01.

Die in den chinesischen und englischen Ordnern bereitgestellten Dateien sind bytegleich und überwiegend englischsprachig. Die Sprachfassungen verwenden dieselben Originalabbildungen; gesonderte chinesische Abbildungen liegen nicht vor. Deckblatt, rechtliche Hinweise und Versionshistorie wurden weggelassen. Technische Fußnoten bleiben erhalten.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Redaktionelle Hinweise](/docs/rockchip-avl-ddr-reference/EDITORIAL-NOTES.md)

## 1. Hinweise zur Verwendung dieser Liste

Statussymbole beschreiben den Prüfumfang der Quelle und stellen keine automatische Freigabe für Ihr Board dar. Leere Zellen bleiben leer und dürfen nicht als Unterstützung interpretiert werden. Teilenummern, Suffixe, Mengen und Plattformstatus bleiben unverändert. EOL bezeichnet das Produktlebensende; AUTO und IT bleiben als Kennzeichnungen der Quelle erhalten und stellen keine neue Zertifizierung dar.

| Symbol | Bedeutung in diesem Dokument |
| --- | --- |
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

Die Hinweise zur Referenzliste besagen, dass Rockchip keine Serienproduktionserfahrung mit den aufgeführten DDR-Produkten hat. Musterprüfungen ersetzen keine Serienfreigabe.

## 2. Anwendungshinweise

### [1]

Aktualisieren Sie auf RK3568/RK3566 den Loader auf rk3568_ddr_xxxMHz_v1.09.bin / rk3566_ddr_xxxMHz_v1.09.bin oder neuer.

### [2]

Bei kombinierten LPDDR4-/LPDDR4X-Produkten ist nur der LPDDR4-Modus freigegeben. Ein stabiler LPDDR4X-Betrieb wird nicht garantiert. VDDQ muss 1.1V betragen, nicht 0.6V.

### [3]

Die LPDDR4-/LPDDR4X-Leistung auf RV1126/RV1109 ist unzureichend; prüfen Sie die Eignung vor dem Einsatz.

### [4]

Wenn ein DDR-Produkt eine niedrigere Frequenz als das Plattformmaximum unterstützt, stellen Sie selbst eine passende Frequenz ein. Siehe „修改DDR bin文件“ in Rockchip_Developer_Guide_DDR_CN oder „Modify the DDR bin file“ in Rockchip_Developer_Guide_DDR_EN.

## Vollständige Kompatibilitätstabellen

Die Tabellen sind zur Rückverfolgbarkeit nach Quellseiten getrennt und vollständig erhalten. Scrollen Sie horizontal, um sämtliche SoC-Spalten zu sehen. Wiederholte Einträge einschließlich widersprüchlicher Duplikate bleiben erhalten.

### Konsumelektronik — Quellseite 6

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G /RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GCAI | GDF08G16LP0-M12 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GCAI | GDT42A32BF0-T3E |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A |  |  |  |  |  |  |  |  |
| GCAI | GD81B32MJ0-41M2 | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  | S/A [3] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GCAI | GD82B32MJ0-41M2 | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| GCAI | GD82D32MJ0-42C2 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| GCAI | GD82D32MJ0-42M3 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GCAI | GDA2D32MJ0-42M6 |  | 24G bit | 768M×32 | LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| GCAI | GDB2D32MJ0-42M7 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A [1][2] |  | S/A [1][2] | S/A [1][2] | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| GCAI | GD84D32MJ0-42C2 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dli | DD4N08GBCDSO2-C2 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Dli | DN4H16GCCPDI4-D2 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  | S/A | <mark>N/A</mark> | <mark>N/A</mark> | S/A | <mark>N/A</mark> | <mark>N/A</mark> | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  |  |  |  |  |  |
| Dli | DN4H16GCBPDI4-C7 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  | <mark>N/A</mark> | <mark>N/A</mark> | S/A [4] | <mark>N/A</mark> | <mark>N/A</mark> | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  |  |  |  |  |  |
| Dli | DN4H32GCCPQI4-D2 |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | S/A | <mark>N/A</mark> | <mark>N/A</mark> | S/A | <mark>N/A</mark> | <mark>N/A</mark> | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  |  |  |  |  |  |
| Dli | <mark>DN4H32GVBPQI4-C7</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4X</mark> | <mark>200ball</mark> |  |  | <mark>N/A</mark> | <mark>N/A</mark> |  | <mark>N/A</mark> | <mark>N/A</mark> | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  |  |  |  |  |  |
| YEESTOR | SGA128M16A8HC-G03 |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ICMAX | IMD128M16R322J8LY |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |
| ICMAX | IMD256M16R30HG8GNF-107 |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  | S/A |  |  | S/A |  | N/A | N/A |  | S/A |  |  |  |  |  |  |
| ICMAX | IMD256M16R324J8LY |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  | S/A |  | S/A | S/A |  | S/A |  | S/A |  |  |  |  |
| ICMAX | IMD512M16R31AG8GPF |  | 8G bit | 512M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| ICMAX | IMD256M16R4ABD8LY |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  |  |
| ICMAX | IMD256M16R4ZAD8TB |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ICMAX | IMD512M16R4DBD8LY |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ICMAX | IMD512M16R4AZD8JY |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  |  |
| ICMAX | IMD512M16R4FCD8TB |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |
| ICMAX | IMH256M32Z1D1DNP |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  | S/A [3] |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| ICMAX | IMH512M32H2D2ENA |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  | S/A [4] | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ICMAX | IMH512M32Z2D2ENP |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| TMTC | TN4G16D3CSEP-EK |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| TMTC | TN8G16D4DSA4-GZ |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| TMTC | TM8G32MD4LSA1-I4 |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| TMTC | TH16G32MD4LQM1-I4 |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 7

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G /RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Goldkey | GH4061600HRL-1833 |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | S/A |  | S/A | S/A | S/A |  |  |  |  |  |  |  |  |
| Goldkey | GE4062666HD |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Goldkey | GE8062666ND |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Goldkey | GE8062400HD-1833 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  | S/A |  |  |  |  |  |
| Goldkey | L4D32H71-06242 |  | 32G bit | 1024M×32 | LPDDR4 | 200ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eorex | EM47DM1688SBA |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eorex | EM47EM0888SBA-150 |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  | N/A | N/A | S/A |
| Eorex | EM47EM1688SBA-150 |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eorex | EM47EM1688SBB-150A |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  | S/A | S/A | S/A |
| Eorex | EM47FM0888SBA-150 |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |
| Eorex | EM47FM0888SBA-150A |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |
| Eorex | EM47EM3288MBA-125 |  | 8G bit | 256M×32 | DDR3 | 136ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | S/A |
| Eorex | EM49FM1688PBA-075 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |
| Eorex | EM45FM3288LBA-187F |  | 16Gb/2Channel | 256M×32×2Ch | LPDDR2 | 220ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | N/A |
| axeme | H2A301G1656BC6C |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  | S/A | N/A | N/A | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A | N/A |
| axeme | H2A401G1666BFBC |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| axeme | H2A402G1666BFBC |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |
| axeme | H2A404G1666CFMC |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | S/A |  | S/A | S/A | S/A |  |  |  |  |  |  |  |  |
| axeme | H2A404G0866CD8C |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | S/A |
| Sinker | SNB2816S21PS13 |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Sinker | SNB5616S21PS13 |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |
| ProMOS | V59C1G01168QBASXJ25 |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A | N/A |
| ProMOS | V73CAG01808RA JI9 |  | 1G bit | 128M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ProMOS | V59C1G02168QB |  | 2G bit | 128M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A | N/A |
| QCHP | QN3B128M16H-13A |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN3R256M16M-16G |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| QCHP | QN4A256M16M-26G |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4A512M16M-26E |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |
| QCHP | <mark>QN4A1GM16S-32J</mark> |  | <mark>16G bit</mark> | <mark>1024M×16</mark> | <mark>DDR4</mark> | <mark>96ball</mark> |  |  |  |  |  | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4LPD512M32M-32H |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| QCHP | QNLP4D512M32S-32I |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  | <mark>S/A</mark> | <mark>N/A</mark> |  | <mark>N/A</mark> | <mark>N/A</mark> |  |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| QCHP | QNLP4D512M32T-37I |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  | S/A [4] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QNLP4D1GM32T-42I |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4LPXD1GM32SP-32H |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4XLPE32GM16H-42I |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4LPXD1536M32SP-32H |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4XLPE64GM16H-42J |  | 64G bit | 2048M×32 | LPDDR4X | 200ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 8

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229 /PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G /RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| XINCUN | XCCB128M16FP-EKNAH |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |
| XINCUN | XCCC128M16FP-EKNAB |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| XINCUN | XCCC256M16FP-EKNAY |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| XINCUN | XCCB256M16DP-EKNAH |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |
| XINCUN | XCCC256M16EP-EKNAY |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| HIKSEMI | HSED4HB04G-JD3 |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | HSED4HB08G-JD4 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | HSEL4XSA2G-HD8 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  | S/A [4] | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | HSEL4XFA4G-CA9M |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | HSEL4XFA4G-HD9 |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | S/A |  |  | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | <mark>HSEL4XFA4G-CA8M</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  |  |  | <mark>S/A</mark> |  | <mark>S/A</mark> | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DS4D82FBFCENY |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| DBTC | DS4D162FBFCENY |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DL4008E2FSCE2GHY |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DL4X16E3FDEE2GHY |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DL4X16E3FSEE2GMR |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | S/A | N/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DL4X32E3CQEE2GCX |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KEYMOS | KL4X162BD-C2B |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | N/A | N/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KEYMOS | KL4X164CD-C7A |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  | S/A | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KEYMOS | KL4X322BQ-C7B |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  | N/A | N/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KEYMOS | KL4X321CD-D2B |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Netsol | S5RG2G20CMS-MGCJ |  | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| MT.MOSET | ED3E25608CE-P9 |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  | S/A | N/A | S/A |
| sMART | S4B2G0846C-HYH9 |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | S/A |
| sMART | S4B2G0846D-HYK0 |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | S/A |
| WINS | VP5TQ2G1635FFP-F9 |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A |  |
| ISDT | IL2BR20E8H |  | 16Gb/2Channel | 256M×32×2Ch | LPDDR2 | 220ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| YXSC | YX3H2816AB-M9LC |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| YXSC | YX3H4816AB-M9LC |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| YXSC | YX4H8A16AB-NCMC |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| YXSC | YX4LA816BC-MGPE |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Konsumelektronik — Quellseite 9

| Hersteller | Teilenummer | Produktstatus | Speicherdichte | Organisation | Typ | Gehäuse | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229 /PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G /RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KOWIN | KAD3N2M33BNT |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| KOWIN | KAD4N3M46GUT |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| KOWIN | KAL3S3C55FN2 |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |
| KOWIN | KALXX4S43AY2 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  | S/A | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KOWIN | KALXX5S43AY2 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCT536HLC0-OB |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  | S/A |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCT536HLC0-OD |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCTA36HLC0-OB |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A | S/A |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCTA36HLC0-OD |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCTB36HLC0-OD |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GSTO | GSD02GHFB3-E3N3C |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  | N/A | N/A |  |  |  |  |  |  |  |  |
| GSTO | GSD04GHFB4-E3N3C |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |
| GSTO | GSD04GHGB5-S3L3C |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GSTO | GSD08GHGB6-S3L3C |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Artmem | ATL4X12324M102 |  | 12G bit | 384M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| BIIE | BI4D4G16M00-DL1 |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |
| BIIE | BI4D4G16M00-DL2 |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIIE | BI4D8G1666-DL1 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| BIIE | BI4D8G1666-DL2 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| BIIE | BI16G32MD4PDC1-J1 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIIE | BI32G32MD4PQC1-J1 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Rocfour | MC4X1GM32BQ200A-32T |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Rocfour | MC4X1GM32BQ200A-42T |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Rocfour | MC4X2GM32CQ200A-42T |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Rocfour | MC5D1GM32DQ315B-64T |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Yangtze Mason | MSP4C0D5I-032G |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Barycn | SPMNBBQMCM-MJXU |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| JSC | JSL5HCG329TKA-03 |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| JSC | JSL5HDG32ATKA-03 |  | 64G bit | 2048M×32 | LPDDR5 | 315ball |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| <mark>TWSC</mark> | TEL4XCC32ACY-32G |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| <mark>TWSC</mark> | <mark>TEL4XMA32ACX-32G</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  |  |  | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| XUNSHAN | XSRGBQCA1MG-L |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| TSEM | T5LC32BQBM-CP |  | 64G bit | 2048M×32 | LPDDR5 | 315ball |  | N/A |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| <mark>PLUSE</mark> | <mark>PSX4S0D4S-32G</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  | <mark>S/A</mark> |  |  | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Industrie und erweiterter Temperaturbereich — Quellseite 10

Die Quelle enthält die Abschnittsüberschrift, aber keine Bauteilzeilen.

<table><thead><tr><th>Hersteller</th><th>Teilenummer</th><th>Produktstatus</th><th>Speicherdichte</th><th>Organisation</th><th>Typ</th><th>Gehäuse</th><th>RK3506J</th><th>RK3576J</th><th>RK3528</th><th>RK3562J</th><th>RK3588J</th><th>RK3568J</th><th>RK3566</th><th>RV1126K</th><th>RV1108K1 RK3308J</th><th>RK3228H</th><th>RK3399</th><th>RK3328</th><th>RK3326S/PX30S</th><th>RK3358J</th><th>RK1808K</th><th>RK3399PRO CPU&#95;RAM</th><th>RK3399PRO NPU&#95;RAM</th><th>RK3288</th></tr></thead><tbody></tbody></table>

## Offizielle Quellen

[Rockchip Redmine](https://redmine.rock-chips.com/documents/49)

Einige Redmine-Ressourcen erfordern ein berechtigtes Konto. Diese Ausgabe basiert auf der bereitgestellten Version; ihre Aktualität gegenüber späteren Releases wird nicht behauptet.

{% endraw %}
