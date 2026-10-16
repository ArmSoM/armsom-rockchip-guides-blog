---
title: "Rockchip eMMC: Vollständige Matrix freigegebener Bausteine und SoCs"
description: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
translation_key: "027-rockchip-emmc-avl"
slug: "027-rockchip-emmc-avl"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "storage"
products: ["Sige7", "CM5"]
tags: ["Rockchip", "AVL", "emmc", "hardware"]
keywords: "Rockchip eMMC: Vollständige Matrix freigegebener Bausteine und SoCs, ArmSoM, BSP"
excerpt: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
---

{% raw %}
# Rockchip eMMC: Vollständige Matrix freigegebener Bausteine und SoCs

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

Diese Referenz unterstützt die Bauteilauswahl auf Plattformebene für ArmSoM-Projekte. Die aufgeführten Bauteile sind nicht auf jedem ArmSoM-Board als austauschbar geprüft. Beachten Sie für Sige7 (RK3588) und CM5 (RK3576) die genaue SoC-Spalte, den Schaltplan, die bestückte Stückliste, das Gehäuse, die Versorgungsspannungen und die Boardrevision. Signalqualität und Eignung für die Serienproduktion müssen auf Boardebene geprüft werden. Die Quelle legt keine allgemeingültige SDK-/BSP- oder Kernelversion fest. Verwenden Sie zusammenpassende Versionen von BSP, Bootfirmware und Treibern und beachten Sie die bauteilspezifischen Hinweise. Für diesen Artikel wurden keine Hardwaretests durchgeführt; Statusangaben und Beispiele stammen aus der Quelle.

Quelle: `Rockchip_EMMC_Approved_Vendor_List_Ver1.93.pdf`, V1.93.

Die in den chinesischen und englischen Ordnern bereitgestellten Dateien sind bytegleich und überwiegend englischsprachig. Die Sprachfassungen verwenden dieselben Originalabbildungen; gesonderte chinesische Abbildungen liegen nicht vor. Deckblatt, rechtliche Hinweise und Versionshistorie wurden weggelassen. Technische Fußnoten bleiben erhalten.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Redaktionelle Hinweise](/docs/rockchip-avl-emmc/EDITORIAL-NOTES.md)

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

### Quellseite 8

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Micron | MTFC16GAPALBH-IT | 128Gb MLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| Micron | MTFC32GAPALBH-IT | 128Gb MLC x 2 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Micron | MTFC64GAPALBH-IT | 128Gb MLC x 4 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Micron | MTFC128GAPALNS-IT | 128Gb MLC x 8 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Micron | MTFC64GAZAQHD-AAT | 128Gb MLC x 4 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| Micron | MTFC64GBCAQTC-AAT | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| Micron | MTFC128GBCAQTC-AAT | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| Micron | MTFC128GBCAQTC-WT | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | WT |
| Micron | MTFC256GBCAQTC-WT | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | WT |
| Micron | MTFC64GBCAQTC-WT | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | WT |

### Quellseite 9

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen | Additional remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KIOXIA | THGBMHG6C1LBAIL | 64Gb MLC x1 | 8GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMHG7C1LBAIL | 128Gb MLC x1 | 16GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMHG7C2LBAIL | 64Gb MLC x2 | 16GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMHG8C4LBAIR | 64Gb MLC x4 | 32GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMHG9C4LBAIR | 128Gb MLC x4 | 64GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMHG8C2LBAIL | 128Gb MLC x2 | 32GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMNG5D1LBAIL | 32Gb MLC x 1 | 4GB | 15nm | 5.0 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMJG6C1LBAIL | 64Gb MLC x1 | 8GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMJG7C1LBAIL | 128Gb MLC x1 | 16GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMJG8C2LBAIL | 128Gb MLC x2 | 32GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGAMRG7T13BAIL | 128Gb TLC x1 | 16GB | BICS3 | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGAMRG8T13BAIL | 256Gb TLC x1 | 32GB | BICS3 | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGAMRG9T23BAIL | 256Gb TLC x2 | 64GB | BICS3 | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGAMRT0T43BAIR | 256Gb TLC x4 | 128GB | BICS3 | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGBMJG8C4LBAU8 | 64Gb MLC x4 | 32GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGAMVG7T13BAIL | 128Gb TLC x1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGAMVG8T13BAIL | 256Gb TLC x1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGAMVG9T23BAIL | 256Gb TLC x2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGAMVT0T43BAIR | 256Gb TLC x4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGBMUG6C1LBAIL | 64Gb MLC x1 | 8GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGAMSG9T24BAIL | 256Gb TLC x2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGAMST0T24BAIL | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGBMTG5D1LBAIL | 32Gb MLC x1 | 4GB | 15nm | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| KIOXIA | THGBMJG7C2LBAU8 | 64Gb MLC x2 | 16GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | IT |  |
| KIOXIA | THGBMJG6C1LBAU7 | 64Gb MLC x1 | 8GB | 15nm | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | IT |  |
| KIOXIA | THGAMST0T25BAIL | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGAMSG9T15BAIL | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |  |
| KIOXIA | THGAMVT1T83BAB5 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V | AUTO |
| KIOXIA | THGAMVT0T43BAB8 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V | AUTO |
| KIOXIA | THGAMVG9T23BAB8 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V | AUTO |

### Quellseite 10

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SanDisk / WD | SDINBDG4-8GB(-B) | 64Gb MLC x 1 | 8GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDG4-16GB(-B) | 64Gb MLC x 2 | 16GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDG4-32GB(-B) | 64Gb MLC x 4 | 32GB | 15nm | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA4-32GB | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDA4-64GB | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDG4-16GB-XI1 | 64Gb MLC x 2 | 16GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDG4-32GB-XI1 | 64Gb MLC x 4 | 32GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-16G(-I / XI) | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-32G(-I / XI) | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-64G(-I / XI) | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-128G(-I / XI) | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-256G(-I / XI) | 256Gb TLC x 8 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA2-16G | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-16G-H | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-32G-H | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-64G-H | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA4-64GB | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDA4-128G | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDA4-256G | 256Gb TLC x 8 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDV4-128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDV4-256G | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDV4-64G(-P) | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDV4-32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDA6-64G-ZA1 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-128G-ZA1 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-256G-ZA1 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDJ4-8G | 64Gb MLC x 1 | 8GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDJ4-16G | 64Gb MLC x 2 | 16GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SanDisk / WD | SDINBDA6-32G-ZA | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  | S/A | S/A |  |
| SanDisk / WD | SDINBDI4-64G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |
| SanDisk / WD | SDINBDI4-128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V |

### Quellseite 11

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SKHynix | H26M51002KPR | 128Gb MLC x1 | 16GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SKHynix | H26M62002JPR | 128Gb MLC x2 | 32GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SKHynix | H26M74002HMR | 128Gb MLC x4 | 64GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |

### Quellseite 12

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Samsung | KLM4G1FETE-B041 | 32Gb MLC x 1 | 4GB | 14nm | 5.1 | 11 x 10 | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Samsung | KLM8G1GETF-B041 | 64Gb MLC x 1 | 8GB | 14nm | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | T/A | T/A | S/A | S/A | S/A |  |
| Samsung | KLMAG1JETD-B041 | 128Gb MLC x 1 | 16GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | S/A | S/A |  |
| Samsung | KLMBG2JETD-B041 | 128Gb MLC x 2 | 32GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | T/A | T/A | S/A | S/A | S/A |  |
| Samsung | KLMCG4JETD-B041 | 128Gb MLC x 4 | 64GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | T/A | T/A | S/A | S/A | S/A |  |
| Samsung | KLMCG2UCTB-B041 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| Samsung | KLMDG4UCTB-B041 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Samsung | KLMCG4JEUD-B04(Q/P) | 128Gb MLC x 4 | 64GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| Samsung | KLMDG8JEUD-B04(Q/P) | 128Gb MLC x 8 | 128GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| Samsung | KLMDG2RCTE-B041 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Samsung | KLMCG1RCTE-B041 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Samsung | KLMDG2RCTE-B041 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| Samsung | KLMEG4RCTE-B041 | 512Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Samsung | KLMBG1UCTC-B041 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |

### Quellseite 13

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| YMTC | YMEC6A2TB1A2C3 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| YMTC | YMEC7A2TB2A2C3 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| YMTC | YMEC8A2TB3A2C3 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| YMTC | YMEC7B0TE1A2C3 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| YMTC | YMEC8B0TE2A2C3 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| YMTC | YMEC9B0TE3A2C3 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| YMTC | YMEC7C0TG1A2C3 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| YMTC | YMEC8C0TG2A2C3 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| YMTC | YMEC9C0TG3A2C3 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |

### Quellseite 14

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BIWIN | BWCMMQ511G08G | 64Gb MLC x 1 | 8GB | 2D | 5.0 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTASC11P32G | 256Gb TLC x 1 | 32GB | 3D | 5.0 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTAK611G16G | 128Gb MLC x 1 | 16GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTAK411G32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTASC21P64G | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | N/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTA1311X32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTARV11X64G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTA1321X64G | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTARJ11X32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | T/A | T/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTARI11X32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTARV21X128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTAKJ11X64G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWCTAKJ21X128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWCTA1511X64G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTAKJ41X256G | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWCMMQ511G08G(5.1) | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | T/A | T/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCMAQB11T08GI | 128Gb MLC x 1 | 8GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | IT |
| BIWIN | BWCMARD11G04G | 32Gb MLC x 1 | 4GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTARJ21X64G | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| BIWIN | BWCTA0211X64G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWCTAKC11X64G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWEFMI032GN2RJ | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| BIWIN | BWCTAKL21X256G | 1Tb TLC x 2 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWEFMA128GN1KC | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | AUTO |
| BIWIN | BWCTAKL11X128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWCTAKL41X512G | 1Tb TLC x 4 | 512GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWEFMA064GN1KC | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| BIWIN | BWEFMI128GN223 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWEFMA008GN9RE | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| BIWIN | BWCTAQK11X32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  |
| BIWIN | BWEFMI064GN223 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | IT |
| BIWIN | BWCMAB811G04G | 32Gb MLC x 1 | 4GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |

### Quellseite 15

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dahua Memory | EY3ST264GY3EA | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EY2SM28GY3EA | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EY3ST3128GY3EA | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EY1ST132GY3EA | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EY2SM316GY3EA | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EY2SM14GY3EA | 32Gb MLC x 1 | 4GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EH1SM28GS4EA | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EH2ST116GS4EA | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EH2ST232GS4EA | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EH2YT264GS4EA | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Dahua Memory | EH2YT2128GS4EA | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |

### Quellseite 16

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen | Additional remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FORESEE | NCEMASLD-32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | NCEMASLD-64G | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FSEIASLD-32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | - |  | EOL |
| FORESEE | FEMDRW032G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN004G-58A42 | 32Gb MLC x 1 | 4GB |  | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN008G-08A39 | 64Gb MLC x 1 | 8GB | 14nm | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDRW064G-88A19 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDRW032G-88A19 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN016G-58A43 | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN032G-58k73 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN064G-58k72 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN128G-58k72 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FSEIASLD-64G | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | - |  | EOL |
| FORESEE | FSEIASLD-128G | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | - |  | EOL |
| FORESEE | FEMDRM016G-58A43 | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | - |  | EOL |
| FORESEE | FEMDRW008G-88A37 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN032G-A3A55 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN064G-A3A56 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  |  |
| FORESEE | FEMDNN008G-58A39 | 64Gb MLC x 1 | 8GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | NCEMASLD-128 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN256G-A3A44 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN064G-A3A44 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDRW016G-88A43 | 128Gb MLC x 1 | 16GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDRM008G-58A39 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | - |  | EOL |
| FORESEE | FEMDRW008G-88A39 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDRM016G-88A43 | 128Gb MLC x 1 | 16GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN032G-58A46 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | N/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN064G-58A44 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN128G-A3A44 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN128G-A3A56 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |  |
| FORESEE | FEMDRM032G-A3A55 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | - |  | EOL |
| FORESEE | FEMDRW128G-88A19 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN016G-58A46 | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN008G-A3A55 | 256Gb TLC x 1 | 8GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN016G-A3A55 | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDRM016G-A3A55 | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDRM008G-A3A55 | 256Gb TLC x 1 | 8GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | - | IT | EOL |
| FORESEE | FEMDRM064G-A3A56 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | - | IT | EOL |
| FORESEE | FEMDNN256G-A3A56 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |  |

### Quellseite 17

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen | Additional remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FORESEE | FEMDME016G-A8A43 | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | AUTO |  |
| FORESEE | FEMDRM128G-A3A56 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | - | IT | EOL |
| FORESEE | FEMDME008G-A8A43 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | AUTO |  |
| FORESEE | FEMDNN032G-C9A55 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN064G-A3A55 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |  |
| FORESEE | FEMDNN512G-A3A56 | 512Gb TLC x 8 | 512GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN064G-A3V01 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN128G-A3V01 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN256G-A3V01 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |  |
| FORESEE | FEMDNN128G-C9C76 | 1024Gb QLC x1 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  | Hinweis &#42;1 |
| FORESEE | FEMDNN008G-C9A39 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN016G-C9A43 | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDNN256G-C9C76 | 1024Gb QLC x2 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  | Hinweis &#42;1 |
| FORESEE | FEMDNN512G-C9C76 | 1024Gb QLC x4 | 512GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  | Hinweis &#42;1 |
| FORESEE | FEMJNM032G-58C29 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| FORESEE | FEMDRE032G-D8A43 | 128Gb MLC x 2 | 32GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT | Hinweis &#42;2 |
| FORESEE | FEMDNN064G-C9A61 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  | Hinweis &#42;2 |
| FORESEE | FEMDNN128G-C9A61 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  | Hinweis &#42;2 |
| FORESEE | FEMDNN256G-C9A61 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  | Hinweis &#42;2 |
| FORESEE | FEMDNN128G-C9A92 | 1Tb TLC x1 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |  |
| FORESEE | FEMDNN256G-C9A92 | 1Tb TLC x2 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |  |
| FORESEE | FEMDME064G-D8H09 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |  |
| ISOCOM | MEMA016G-M0T00 | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| ISOCOM | MEMA032G-M0D01 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| ISOCOM | MEMDNN032G-M1S07 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| ISOCOM | MEMDNN064G-M1D03 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |

### Quellseite 18

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HIKSEMI | HSEMSBS2S2B32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| HIKSEMI | HSEMSBS2D2B64G | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| HIKSEMI | HSEMSBS3S2B08G | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| HIKSEMI | HSEMSDS6S2B32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| HIKSEMI | HSEMSDS7S2B64G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| HIKSEMI | HSEMSES2S2B16G | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| HIKSEMI | HSEMSDS7D2B128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| HIKSEMI | HSEMSDS7F2B256G | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| HIKSEMI | HSEMSDW5D2B128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| HIKSEMI | HSEMTCY2S2B8GG | pSLC | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | IT |
| HIKSEMI | HSEMSCS2F2B128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| HIKSEMI | HSEMTEY2S2B16GG | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| HIKSEMI | HSEMTCY2S2B32GG | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| HIKSEMI | HSEMTCY2D2B64GG | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| HIKSEMI | HSEMSBS4S2B04G | 32Gb MLC x 1 | 4GB |  | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| HOSIN | HG-EMC032-N1110 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| HOSIN | HG-EMC064-N1110 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| HOSIN | HG-EMC032-N1510 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| HOSIN | HG-EMC064-N1510 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| HOSIN | HG-EMC128-N1510 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| HOSIN | HG-EMC008-N1110 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| HOSIN | HAH11-1280BRAA | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| HOSIN | HAC21-2560BSAC | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| HOSIN | HAC21-64G0BSAC | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| HOSIN | HAC10-32G0BRAC | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  |

### Quellseite 19

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kingston | EMMC32G-T527 | 64Gb TLC x 4 | 32GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A |  |
| Kingston | EMMC16G-TB28 | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC32G-TA28 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC64G-TA28 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC08G-MB29 | 64Gb MLC x 1 | 8GB | 15nm | 5.1 | 11.5 x 13 | T/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC04G-MK27 | 32Gb MLC x 1 | 4GB | 15nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A |  |
| Kingston | EMMC32G-TX29 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A |  |
| Kingston | EMMC64G-TX29 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC128G-TX29 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC16G-TB29 | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC08G-ML36 | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC32G-TJ30 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC128-TA29 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC64G-TJ30 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC64G-TY29 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| Kingston | EMMC128-TY29 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| Kingston | EMMC256-TY29 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| Kingston | EMMC32G-PJ30 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC16G-PJ30 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC128-TM30 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC64G-TM30 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC64G-IY29 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | WT |
| Kingston | EMMC08G-MV36 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC16G-WW28 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | WT |
| Kingston | EMMC08G-WV28 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | WT |
| Kingston | EMMC16G-MW28 | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC04G-MT32 | 32Gb MLC x 1 | 4GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| Kingston | EMMC32G-TS0A | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |

### Quellseite 20

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KOWIN | KAS03111 | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KAS04111 | 32Gb MLC x 1 | 4GB |  | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASA6211 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | T/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASA7211 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASG5111 | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASC6311 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASD7311 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASH6311 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASJ7311 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASJ8311 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASG511D | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KAS0311D | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASK62T1 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| KOWIN | KASW7311 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| KOWIN | KASW8311 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A |  |
| KONSEMI | KS81AAB0 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A |  |
| KONSEMI | KS81AAC0 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| KONSEMI | KS81AAD0 | 1Tb TLC x 1 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| KONSEMI | KS81AA80 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |

### Quellseite 21

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PHISON | PTE4A0YJ-32GE | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4A0YJ-64GE | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4A0YJ-X28E | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| PHISON | PNE5A0YG-08GE | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| PHISON | PSE6A0SL-08GE | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A |  |
| PHISON | PTE7A0YJ-32GE | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE7A0YJ-64GE | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4A0TN-64GE | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4A0TN-X28E | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4A0TN-X56E | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE7A0YJ-16GE | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4ABTE-X28X | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| PHISON | PSE2A0SL-08GI | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| PHISON | PTE8A0HR-64GE | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| PHISON | PTE8A0HR-X28E | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE8A0HR-X56E | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE7AAMI-32GI | 256Gb TLC x 2 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| PHISON | PTE7ABTO-X56X | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| PHISON | PTE4A0SP-32GE | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4A0SP-16GE | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE8A0HR-X12E | 512Gb TLC x 8 | 512GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| PHISON | PSE2A0SL-08GI | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | IT |
| PHISON | PTE7ABTO-64GX | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| PHISON | PTE7ABTO-X28X | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | AUTO |
| PHISON | PTE7ABTO-X28A | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | AUTO |
| PHISON | PTE4A0TE-32GE | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4A0YU-64GE | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  |
| PHISON | PTE4A0TE-16GE | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4A0YU-32GE | 512Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| PHISON | PTE4ABTE-32GX | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| CORE STORAGE | CAD04-32G0BRAC | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| CORE STORAGE | CAD04-64G0BRAC | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |

### Quellseite 22

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCY | E32GDSAA1ABE00 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E08GDSGF1ABE00 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E16GDH8D1ABE00 | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E32GCYNB1ABE00 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E128BSAA4ABE00 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E128BIB64ABE00 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E64GDSAA2ABE00 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E64GCSAF2ABE00 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E32GCSAF1ABE00 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E32GCSAB1ABE00 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E64GCSAH1ABE00 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| SCY | E128CYNT2ABE00 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| SCY | E64GCYNT1ABE00 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| SCY | E04GDML31ABE00 | 32Gb MLC x 1 | 4GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E64GCSAG1ABE00 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| SCY | E128CSAG2ABE00 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| SCY | E16GCSAB1ABE00 | 128Gb MLC x 1 | 16GB | 14nm | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E256CSAG4ABE00 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| SCY | E16GCYNB1ABE00 | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| SCY | E128GCM7T2ABE00 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| SCY | E64GCM7T1ABE00 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E256CDK52ABE00 | 1Tb TLC x 2 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| SCY | E64GCH9T1ABE00 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SCY | E128CSV81ABE00 | 1Tb TLC x 1 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  |
| SCY | E256CSV82ABE00 | 1Tb TLC x 2 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A |  |
| SCY | E128CYNE2ABE00 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  |
| SCY | E512CSV84ABE00 | 1Tb TLC x 4 | 512GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  |
| SCY | E64GCYNE1ABE00 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A |  |
| SMI | SM662PACBE | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| SMI | SM662PBEBFSTV303 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| SMI | SM662PBDBFSTV303 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| SMI | SM662PBB-C6V | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| SMI | SM662PE8-C4V | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | IT |
| SMI | SM662PEA-C4V | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | IT |

### Quellseite 23

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SiliconGo | SGM8000C-S27B8G | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8000C-S21BAG | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8000C-S03BBG | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | N/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8100C-Y02BBG | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8100C-Y02BCG | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8000C-S03BCG | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8100C-Y02DDG | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8100C-S36BCG | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| SiliconGo | SGM8100C-S36BDG | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8000C-S30B4G | 32Gb MLC x 1 | 4GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | N/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8005I-S21B8G | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8100C-S32BBG | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8103I-S36BBG | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8000I-S27B8G | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| SiliconGo | SGM8103J-S36DDG | pMLC | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| SiliconGo | SGM8103I-S36BCG | pMLC | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |
| SiliconGo | SGM8000I-S27B8G | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| SiliconGo | SGM8200C-Y18BDG | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A |  |
| SiliconGo | SGM8200C-Y18BCG | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8200C-S32BBG | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| SiliconGo | SGM8000J-S21BAG | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | AUTO |
| SiliconGo | SGM8000J-S21BBG | 128Gb MLC x 2 | 32GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | AUTO |
| SiliconGo | SGM8105I-Y02B8G | pSLC | 8GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| SiliconGo | SGM8105I-Y02BAG | pSLC | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| SiliconGo | SGM8002I-S21BAG | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | IT |
| SiliconGo | SGM8002J-S21BAG | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | AUTO |
| SiliconGo | SGM8000I-S21DCG | 128Gb MLC x 4 | 64GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| SiliconGo | SGM8205I-Y18BAG | pSLC | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| SiliconGo | SGM8200I-Y18BCG | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | IT |

### Quellseite 24

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GOKE | XPA72EA0E-008 | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| GOKE | XPB73EA0E-032 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| GOKE | XPB73EA0E-064 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| GOKE | XPB73EA0E-128 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| GOKE | XSE75EA0E-064 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| GOKE | XSE75EA0E-128 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| GOKE | XPE72EA0I-008 | 64Gb MLC x 1 | 8GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | IT |
| GOKE | XPE76EA0I-008 | 32Gb SLC x 2 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | IT |
| GOKE | XPE72EA0I-016 | 64Gb MLC x 2 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| XITC | XSC75EA0E-064 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| XITC | XSC75EA0E-128 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| XITC | XPA72EA0I-008 | 64Gb MLC x 1 | 8GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | IT |
| XITC | XPA72EA0I-016 | 64Gb MLC x 2 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| XITC | XPF73EA0I-032 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| XITC | XPF73EA0I-064 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A | IT |
| XITC | XPF73EA0E-032 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| XITC | XPF73EA0I-128 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A | IT |
| XITC | XPF73EA0E-064 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| XITC | XPF73EA0E-128 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| XITC | XPA76EA0I-008 | 64Gb MLC x 1 | 8GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| XITC | XPF79EA0I-032 | 256Gb TLC x 4 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| XITC | XPF79EA0I-016 | 256Gb TLC x 2 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| XITC | XPF79EA0I-008 | 256Gb TLC x 1 | 8GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |

### Quellseite 25

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rayson | RS70B32G4Y01F | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Rayson | RS70B08G3S03F | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Artmem | AT70B16G3Y02F | 64Gb MLC x 2 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | WT |
| Artmem | AT70B08G3Y02F | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | WT |
| Rayson | RS70B16G4S10F | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Artmem | AT70B32G3S10F | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | WT |
| Rayson | RS70B32G4S10F | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Rayson | RS70B64G4S09F | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Rayson | RS70BT7G4S09F | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Rayson | RS70B32G4S15G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A |  |
| Rayson | RS70B64G4S16G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| Rayson | RS70BT7G4S16G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| Artmem | AT70B08G3Y02F2 | 64Gb MLC x 2 | 8GB | pSLC | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | WT |
| Rayson | RS70B16G4S15G | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Rayson | RS70B64G4M08G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Rayson | RS70BT7G4M08G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| Rayson | RS70BT8G4M08G | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Artmem | AT70B16G3Y06G | pSLC | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | IT |
| Rayson | RS70B64G4M05G | RS70B64G4M0581G | 2Gb TLC | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A |  |

### Quellseite 26

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DBTC | D064G1YTCD-E00 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| DBTC | D032G1YTCD-E00 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| DBTC | D032S0S6CD-E00 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| DBTC | D016S0S2CD-E00 | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| DBTC | D016S0S5CD-E00 | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| DBTC | D016C1YJCD-E00 | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| DBTC | D032A2YJCD-E00 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| DBTC | D016A2YJCD-E00 | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| DBTC | D032C1YJCD-E00 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| DBTC | D064S0S6CD-E00 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| DBTC | D128S0S6CD-E00 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| DBTC | D008A2SACD-E00 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| DBTC | D064P2S5CD-E00 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| DBTC | D128P2S5CD-E00 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| ESMT | FC51L08SFY3A | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| ESMT | FC51J16SJTS1SA | pSLC | 16GB |  | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| ESMT | FC51J32SJTS1A | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| ESMT | FC51J08SJTS1SA | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| ESMT | FC51J32SJTS2A | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| ESSENCORE | ENEAGQ8BE1MR-H9 | 128Gb MLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| ESSENCORE | ENECGQ8BE1MR-HL | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| ESSENCORE | ENEDGQ8BE7MR-HL | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Exascend | ESEMSA032GYBG | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |

### Quellseite 27

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen | Additional remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EOREX | EMMF5BB-008GC | 3D TLC x 1 | 8GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | - | HS200 | EOL |
| EOREX | EMMF5BB-016GC | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | - | HS200 | EOL |
| EOREX | EMMF5BA-032GC | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | - | HS200 | EOL |
| Etron | EM74M08LVAGA-H | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| Etron | EM74K08LVAGA-H | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| Greenliant | 85VM1016T-T-W-B1YE | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| Greenliant | 85VM1032C-M-I-BZYE | 128Gb MLC x 2 | 32GB |  | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| Greenliant | 85VM1032T-T-W-B1YE | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| GStar | GSE51BMS8GL | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  | EOL |
| GStar | GSE5ABTS16GX | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  | EOL |
| GStar | GSE5ABTS32GX | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  | EOL |
| ISSI | IS21ES16G-JCLI | 128Gb MLC x 1 | 16GB | 2D | 5.0 | 11.5 x 13 | S/A | T/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  | EOL |
| ISSI | IS21ES08GA-JCLI | 64Gb MLC x 1 | 8GB | 2D | 5.0 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  | EOL |
| ISSI | IS22TF128G-JCLA(1 / 2) | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | AUTO |  |
| ISSI | IS21TF32G-JCLI | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |  |
| ISSI | IS22EF16G-JCLA2 | 64Gb MLC x 2 | 16GB | 2D | 5.1 | 11.5 x 13 | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | AUTO |  |
| ISSI | IS21EF04GP-JCLI | 64Gb MLC x 1 | 4GB | pSLC | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | IT |  |
| ISSI | IS21EF16G-JCLI | 64Gb MLC x 2 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | IT |  |
| ISSI | IS21EF08G-JCLI | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |  |
| JSC | MC08AUA2ASAEA | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| JSC | MC04AUM1ASAEA | 32Gb MLC x 1 | 4GB |  | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| JSC | MC08AUM1ASAEA | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |

### Quellseite 28

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kimtigo | KM310MY1032GxA | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| Kimtigo | KM3MA5032G-A00W | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Kimtigo | KM3MA6064G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Kimtigo | KM3MA6128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| MasonSemi | NPE1A051-032G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| MasonSemi | NPE1A021-064G | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| MasonSemi | NPE1A021-128G | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| MasonSemi | NPE1A091-128G | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| MasonSemi | NPE1A091-256G | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| MasonSemi | NPE1A051-064G | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| MasonSemi | NPE1A051-128G | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| MasonSemi | NPE1A0A1-032G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| MasonSemi | NPE1A111-064G | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  |
| Metorage | MIE3032CH7CC | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Metorage | MIE3064CH7CC | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Metorage | MPE3008EH7CC | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| Metorage | MIE3128CH7CC | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Metorage | MWE3032CH7CC | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Metorage | MWE3064CH7CC | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| Metorage | MPE3016EH7CC | 64Gb MLC x 2 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| Metorage | MWE3016CH7 | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Metorage | MWE3128CH7 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| Metorage | MA33256CWG | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| MMY | MME2720G1IA37UB | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| MMY | MME2720H1IA37UB | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| MMY | MME5001G1DH07DA | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| MMY | MME5001G1SH07DA | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |

### Quellseite 29

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen | Additional remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MXIC | MX52LM08A11XV | 32Gb MLC x 2 | 8GB |  | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| MXIC | MX52LM04A11XV | 32Gb MLC x 1 | 4GB |  | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| MXIC | MX52LM08A11XV | 32Gb MLC x 2 | 8GB |  | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| NanoWell | NW-EM064G-S06M0 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| NanoWell | NW-EM008G-S09D1 | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |  |
| NanoWell | NW-EM128G-S06M0 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| NanoWell | NW-EM032G-S05M0 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| Netac | NE8GSFY1SBAC-MN00 | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| Netac | NEBGS6S2SBAC-MN00 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |  |
| Netac | NECGS6S2SBAC-MN00 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| SkyHigh | S40FC004C1B1C00000 | 32Gb MLC x 1 | 4GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| SkyHigh | S40FC004C1B1I00000 | 32Gb MLC x 1 | 4GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | IT |  |
| SkyHigh | S40FC008C3B1I00000 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |  |
| SkyHigh | S40FC016C3B1I00000 | 128Gb MLC x 1 | 16GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | VCCQ : 1.8V | IT |
| SINKER | EMC032TYD-X1PWA | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| SWISSBIT | EM256GB1ED118H111 | 256Gb TLC x 8 | 256GB | 3D | 5.1 | 11.5 x 13 | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |  |
| TOPDISK | A121-16G | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | T/A | S/A | N/A | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  | EOL |
| TOPDISK | A132-32G | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | T/A | S/A | N/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  | EOL |

### Quellseite 30

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UDSTORE | UEMDGS23T0 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| UDSTORE | UEMCGS23T0 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| TWSC | TEMBG104T10-A0S5 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A |  |
| TWSC | TEM8G124M10-A0S5 | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| UDSTORE | UEMAGS23S0 | 128Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| UDSTORE | UEMBGS23T0 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| TWSC | TEMEG101T10-A0S5 | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| TWSC | TEMCG101T10-A0S5 | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| UDSTORE | UEMFGS03S0A | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| UDSTORE | UEMDGS03S0A | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| UDSTORE | UEMCGS03S0A | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| TWSC | TEMBG101T10-A0S5 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| TWSC | TEMEG105T10-A8S5 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| TWSC | TEM8G124M10-A0W5DT | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| TWSC | TEMBG104T10-A0W5DT | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| TWSC | TEMCG102T10-A0S5 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| TWSC | TEMEG102T10-A0S5 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| TWSC | TEMAGB09T11-A0W5DP | pSLC | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| TWSC | TEMFG105T10-A0S5 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| TWSC | TEMBG101T30-A0S5 | 512Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| TWSC | TEMAG104T10-A0S5 | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| TWSC | TEMCG101T30-A0S5 | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A |  |
| TWSC | TEMEG101T30-A0S5 | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| TWSC | TEMFG101T30-A0S5 | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| UNIC | UNMEN05GC1C31AS | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | T/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| UNIC | UNMEN06GC2C31AS | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| UNIC | UNMEN07GC4C31BS | 256Gb TLC x 4 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |

### Quellseite 31

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Union Memory | RETMHSK64GSBB | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| XINCUN | XC08MAAJ-NT | 64Gb MLC x 1 | 8GB | 2D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| XINCUN | XC32MAAJ-NTS | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| XTX | XT28EG16GA4YJECGA | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| XTX | XT28EG16GA3MIEIGA | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A |  |
| XTX | XT28EG08GA1SLECGA | 64Gb MLC x 1 | 8GB |  | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| XTX | XT28EG32GA4YJECGA | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| XTX | XT28EG64GA2TNECGA | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| XTX | XT28EG32GA3MIEIGA | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | IT |
| XTX | XT28EG64GA2YUECGA | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| XTX | XT28EG32GA2YUECGA | 512Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |

### Quellseite 32

| Hersteller | Teilenummer | Bausteinkapazität (Bit) | Kapazität in Byte | Prozess | Version | Gehäusegröße (mm) | RK328X | RV1126 RV1109 RV1126B | RK3528 | RK3562 | RK3368 RK3368H RKPX5 | RK3308 | RV1106 RV1103 | RK3399/RK3399PRO | RKPX30 RK3326 RK3358 | RK3568 RK3566 | RK3588 | RK3328 RK3228H | RK3576 | RV1108 RV1107 | RK3506 | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| YOTTAWIN | DYE032GFTC1 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| YOTTAWIN | DYE064GFTI | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| YOTTAWIN | DYE128GFTI | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSAG2PX-BC | 128Gb MLC x 1 | 16GB | 3D | 5.0 | 11.5 x 13 | S/A | S/A | N/A | N/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSBG6PX-AE | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSAG6PX-AE | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSCG6PX-AE | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSDG6PX-AE | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSCG6PX-AJ | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSAG6PE-AE | 256Gb TLC x 1 | 16GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| YXSC | YXSBG6PE-AE | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | IT |
| YXSC | YXSCG6PE-AJ | 256Gb TLC x 2 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSEG6PX-AK | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSDG6PX-AK | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSCG6PX-AK | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A |  |
| YXSC | YXSCG6PE-AK | 512Gb TLC x 1 | 64GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | IT |
| YXSC | YXSDG6PE-AK | 512Gb TLC x 2 | 128GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | IT |
| YXSC | YXSEG6PE-AK | 512Gb TLC x 4 | 256GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | IT |
| ZBIT | ZBEM32G03RIF1 | 256Gb TLC x 1 | 32GB | 3D | 5.1 | 11.5 x 13 | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A |  |

## Offizielle Quellen

[Rockchip Redmine](https://redmine.rock-chips.com/documents/50)

Einige Redmine-Ressourcen erfordern ein berechtigtes Konto. Diese Ausgabe basiert auf der bereitgestellten Version; ihre Aktualität gegenüber späteren Releases wird nicht behauptet.

{% endraw %}
