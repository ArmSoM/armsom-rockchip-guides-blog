---
title: "Rockchip UFS-Freigabeliste: Bausteinauswahl für RK3576"
description: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
translation_key: "030-rockchip-ufs-avl"
slug: "030-rockchip-ufs-avl"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "storage"
products: []
tags: ["Rockchip", "AVL", "ufs", "hardware"]
keywords: "Rockchip UFS-Freigabeliste: Bausteinauswahl für RK3576, ArmSoM, BSP"
excerpt: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
---

{% raw %}
# Rockchip UFS-Freigabeliste: Bausteinauswahl für RK3576

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

Diese Referenz unterstützt die Bauteilauswahl auf Plattformebene für ArmSoM-Projekte. Die aufgeführten Bauteile sind nicht auf jedem ArmSoM-Board als austauschbar geprüft. Beachten Sie für Sige7 (RK3588) und CM5 (RK3576) die genaue SoC-Spalte, den Schaltplan, die bestückte Stückliste, das Gehäuse, die Versorgungsspannungen und die Boardrevision. Signalqualität und Eignung für die Serienproduktion müssen auf Boardebene geprüft werden. Die Quelle legt keine allgemeingültige SDK-/BSP- oder Kernelversion fest. Verwenden Sie zusammenpassende Versionen von BSP, Bootfirmware und Treibern und beachten Sie die bauteilspezifischen Hinweise. Für diesen Artikel wurden keine Hardwaretests durchgeführt; Statusangaben und Beispiele stammen aus der Quelle.

Diese UFS-Liste enthält ausschließlich eine RK3576-Spalte. CM5 verwendet RK3576, sein dokumentierter Onboard-Speicher ist jedoch eMMC. Die Liste belegt weder eine nutzbare UFS-Schnittstelle auf CM5 noch UFS-Unterstützung auf RK3588-Boards. Verwenden Sie sie als Referenz für eigene RK3576-Hardware, bis Schaltplan und BSP-Unterstützung geprüft sind.

Quelle: `Rockchip_UFS_Approved_Vendor_List_Ver1.04.pdf`, V1.04.

Die in den chinesischen und englischen Ordnern bereitgestellten Dateien sind bytegleich und überwiegend englischsprachig. Die Sprachfassungen verwenden dieselben Originalabbildungen; gesonderte chinesische Abbildungen liegen nicht vor. Deckblatt, rechtliche Hinweise und Versionshistorie wurden weggelassen. Technische Fußnoten bleiben erhalten.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Redaktionelle Hinweise](/docs/rockchip-avl-ufs/EDITORIAL-NOTES.md)

## 1. Hinweise zur Verwendung dieser Liste

Statussymbole beschreiben den Prüfumfang der Quelle und stellen keine automatische Freigabe für Ihr Board dar. Leere Zellen bleiben leer und dürfen nicht als Unterstützung interpretiert werden. Teilenummern, Suffixe, Mengen und Plattformstatus bleiben unverändert. EOL bezeichnet das Produktlebensende; AUTO und IT bleiben als Kennzeichnungen der Quelle erhalten und stellen keine neue Zertifizierung dar.

| Symbol | Bedeutung in diesem Dokument |
| --- | --- |
| √ | Vollständig geprüft, geeignet und in Serienproduktion. |
| T/A | Vollständig geprüft, geeignet und bereit für die Serienproduktion. |
| S/A | Muster haben Zuverlässigkeitstests bestanden; vor der Serienproduktion ist weiterhin eine Plattformkompatibilitätsprüfung erforderlich. |
| D/A | Laut Datenblatt geeignet; Muster müssen noch geprüft werden. |
| N/A | Nicht geeignet. |

## Vollständige Kompatibilitätstabellen

Die Tabellen sind zur Rückverfolgbarkeit nach Quellseiten getrennt und vollständig erhalten. Scrollen Sie horizontal, um sämtliche SoC-Spalten zu sehen. Wiederholte Einträge einschließlich widersprüchlicher Duplikate bleiben erhalten.

### Quellseite 4

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KIOXIA | THGJFGT2T85BAB5 | 512Gb TLC x 8 | 512GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGT1T45BAB8 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGT0T25BAB8 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGG9T15BAB8 | 512Gb TLC x 1 | 64GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -40/105 | T/A | AUTO |
| KIOXIA | THGJFGT1E45BAIL | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -25/85 | T/A |  |
| KIOXIA | THGJFGT2T85BAIR | 512Gb TLC x 8 | 512GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -25/85 | T/A |  |

### Quellseite 5

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MICRON | MTFC64GAZAOTD-AIT | 256Gb TLC x 2 | 64GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| MICRON | MTFC128GAZAOTD-AIT | 256Gb TLC x 4 | 128GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| MICRON | MTFC256GAZAOTD-AIT | 256Gb TLC x 8 | 256GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| MICRON | MTFC128GBCAVHF-WT | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| MICRON | MTFC128GBCAVTC-AAT | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| MICRON | MTFC256GBCAVTC-AAT | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| MICRON | MTFC256GBEAXHF-WT | 512Gb TLC x 4 | 256GB | 3D | 4.0 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| MICRON | MTFC128GBCAYAL-AAT | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| MICRON | MTFC256GBCAYAL-AAT | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |

### Quellseite 6

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SAMSUNG | KLUDG4UHGC-B0E1 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| SAMSUNG | KLUCG2U1DC-B0F1 | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| SAMSUNG | KLUDG2R1DE-B0F1 | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| SAMSUNG | KLUEG4R1DE-B0F1 | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| SAMSUNG | KLUCG4J1ZD-C0CQ | 128Gb MLC x 4 | 64GB | 2D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| SAMSUNG | KLUDG8J1ZD-C0CQ | 128Gb MLC x 8 | 128GB | 2D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| SAMSUNG | KLUDG4UHYB-B0EQ | 256Gb TLC x 4 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SAMSUNG | KLUEG8UHYB-B0EQ | 256Gb TLC 8 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SAMSUNG | KLUCG1R1JF-C0F1 | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| SAMSUNG | KLUDG2R1JF-C0F1 | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| SAMSUNG | KLUEG2N1JB-C0F1 | 1Tb TLC x 2 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| SAMSUNG | KLUFG4N1JB-C0F1 | 1Tb TLC x 4 | 512GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| SAMSUNG | KLUDG2R1VF-B0FQ | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A | AUTO |
| SAMSUNG | KLUCG1R1VF-B0FQ | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A | AUTO |
| SAMSUNG | KLUBG1R1VF-B0FQ | 512Gb TLC x 1 | 32GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A | AUTO |

### Quellseite 7

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WD | SDINFDQ6-256G-ZA | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5/3.3 | 1.2 | - | -45/85 | T/A | AUTO |

### Quellseite 8

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| YMTC | YMUS8B4TF1D1C1 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | D/A |  |
| YMTC | YMUS9B4TF2D1C1 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| YMTC | YMUSAB4TF3D1C1 | 512Gb TLC x 8 | 512GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| YMTC | YMUS7B2TE1A2C1 | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| YMTC | YMUS8B2TE2A2C1 | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | D/A |  |
| YMTC | YMUS9B2TE3A2C1 | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| YMTC | YMUS8B5TH1A1C1 | 1Tb TLC x 1 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| YMTC | YMUS9B5TH2A1C1 | 1Tb TLC x 2 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| YMTC | YMUSAB5TH3A1C1 | 1Tb TLC x 4 | 512GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Quellseite 9

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BIWIN | BWU3AKC26C128G | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| BIWIN | BWU3AKC46C256G | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| BIWIN | BWU2A0526B128G | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| BIWIN | BWU2A0516B064G | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Quellseite 10

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FORESEE | FEUDME064G-B8A19 | 512Gb TLC x 1 | 64GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| FORESEE | FEUDME128G-B8A19 | 512Gb TLC x 2 | 128GB | 3D | 2.1 | 3.3 | - | 1.8 | -40/105 | T/A | AUTO |
| FORESEE | FEUDME256G-C8H09 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 |  | -40/105 | T/A | AUTO |
| FORESEE | FEUDNN064G-C2G07 | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| FORESEE | FEUDNN128G-C2G07 | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| FORESEE | FEUDNN256G-C2G07 | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| FORESEE | FEUDNN512G-C2G07 | 512Gb TLC x 8 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Quellseite 11

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HOSIN | HBE3-1280CHAA | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Quellseite 12

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kingston | UFS256-CY14 | 512Gb TLC x 4 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| Kingston | UFS128-CY14 | 512Gb TLC x 2 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -25/85 | T/A |  |
| Kingston | UFS256-TY7B | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| Kingston | UFS128-TY7B | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Quellseite 13

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PHISON | PSUF22H17-B064SS | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| PHISON | PSUF22H17-B128SS | 512Gb TLC x 2 | 128GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |
| PHISON | PSUF22H17-B256SS | 512Gb TLC x 4 | 256GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

### Quellseite 14

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SMI | SM671PBD-C8V | 1Tb TLC x 1 | 128GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SMI | SM671PBE-C8V | 1Tb TLC x 2 | 256GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |
| SMI | SM671PBF-C8V | 1Tb TLC x 4 | 512GB | 3D | 3.1 | 2.5 | 1.2 | - | -40/105 | T/A | AUTO |

### Quellseite 15

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | VCC （V） | VCCQ （V） | VCCQ2 （V） | Temperatur (°C) | RK3576 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rayson | RS80A64G4M05B | 512Gb TLC x 1 | 64GB | 3D | 2.2 | 3.3 | - | 1.8 | -25/85 | T/A |  |

## Offizielle Quellen

[Rockchip Redmine](https://redmine.rock-chips.com/documents/50)

Einige Redmine-Ressourcen erfordern ein berechtigtes Konto. Diese Ausgabe basiert auf der bereitgestellten Version; ihre Aktualität gegenüber späteren Releases wird nicht behauptet.

{% endraw %}
