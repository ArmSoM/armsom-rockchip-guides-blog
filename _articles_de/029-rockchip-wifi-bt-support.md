---
title: "Rockchip Linux: Vollständige Unterstützungsliste für WLAN- und Bluetooth-Chips und -Module"
description: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
translation_key: "029-rockchip-wifi-bt-support"
slug: "029-rockchip-wifi-bt-support"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "storage"
products: ["Sige7", "CM5"]
tags: ["Rockchip", "AVL", "wifi-bt", "hardware"]
keywords: "Rockchip Linux: Vollständige Unterstützungsliste für WLAN- und Bluetooth-Chips und -Module, ArmSoM, BSP"
excerpt: "Vollständige bearbeitbare Bauteiltabellen, ursprüngliche Statusdefinitionen und technische Hinweise zur ArmSoM-Hardwareauswahl; eine Validierung auf Boardebene ist erforderlich."
---

{% raw %}
# Rockchip Linux: Vollständige Unterstützungsliste für WLAN- und Bluetooth-Chips und -Module

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

Diese Referenz unterstützt die Bauteilauswahl auf Plattformebene für ArmSoM-Projekte. Die aufgeführten Bauteile sind nicht auf jedem ArmSoM-Board als austauschbar geprüft. Beachten Sie für Sige7 (RK3588) und CM5 (RK3576) die genaue SoC-Spalte, den Schaltplan, die bestückte Stückliste, das Gehäuse, die Versorgungsspannungen und die Boardrevision. Signalqualität und Eignung für die Serienproduktion müssen auf Boardebene geprüft werden. Die Quelle legt keine allgemeingültige SDK-/BSP- oder Kernelversion fest. Verwenden Sie zusammenpassende Versionen von BSP, Bootfirmware und Treibern und beachten Sie die bauteilspezifischen Hinweise. Für diesen Artikel wurden keine Hardwaretests durchgeführt; Statusangaben und Beispiele stammen aus der Quelle.

Die offizielle Sige7-Beschreibung nennt AP6275P. Daraus ergibt sich keine Freigabe sämtlicher hier aufgeführter Module für Sige7. Gleichen Sie SDIO/PCIe/USB, BT UART/PCM, Firmware, Treiber, Antennendesign und das genaue BSP ab. SS, ST und DS bezeichnen unterschiedliche Nachweisstufen.

Quelle: `Rockchip_Support_List_Linux_WiFi_BT_Ver2.0_20250619.pdf`, V2.0.

Die in den chinesischen und englischen Ordnern bereitgestellten Dateien sind bytegleich und überwiegend englischsprachig. Die Sprachfassungen verwenden dieselben Originalabbildungen; gesonderte chinesische Abbildungen liegen nicht vor. Deckblatt, rechtliche Hinweise und Versionshistorie wurden weggelassen. Technische Fußnoten bleiben erhalten.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Redaktionelle Hinweise](/docs/rockchip-avl-wifi-bt/EDITORIAL-NOTES.md)

## 1. Hinweise zur Verwendung dieser Liste

Statussymbole beschreiben den Prüfumfang der Quelle und stellen keine automatische Freigabe für Ihr Board dar. Leere Zellen bleiben leer und dürfen nicht als Unterstützung interpretiert werden. Teilenummern, Suffixe, Mengen und Plattformstatus bleiben unverändert. EOL bezeichnet das Produktlebensende; AUTO und IT bleiben als Kennzeichnungen der Quelle erhalten und stellen keine neue Zertifizierung dar.

- Hinweise zu weiteren AP-/Realtek-Modellen finden Sie im Portierungsabschnitt der WLAN-/BT-Entwicklungsdokumentation.

- Wenden Sie sich bei Chips oder Modulen anderer Hersteller für Unterstützung bei der Treiberportierung an den Hersteller. Auch die WLAN-/BT-Entwicklungsdokumentation beschreibt die Portierung.

- Entwicklungsleitfaden und Unterstützungsliste stehen unter https://redmine.rock-chips.com/documents/52 bereit.

- BT steht für Bluetooth; ac bezeichnet Wi-Fi 5 und ax Wi-Fi 6.

- State beschreibt den Prüfstatus oder Unterstützungsumfang auf der RK-Plattform: SS = SDK-Unterstützung; ST = Muster geprüft; DS = Unterstützung laut Datenblatt. DS belegt keine detaillierte Plattformvalidierung.

- Antenna bezieht sich auf WLAN-Antennen. Einige Module verwenden eine separate einzelne BT-Antenne: WLAN kann 2T2R unterstützen, während Bluetooth unabhängig 1T1R verwendet. Berücksichtigen Sie dies bei Auswahl und Hardwareentwurf.

## Vollständige Kompatibilitätstabellen

Die Tabellen sind zur Rückverfolgbarkeit nach Quellseiten getrennt und vollständig erhalten. Scrollen Sie horizontal, um sämtliche SoC-Spalten zu sehen. Wiederholte Einträge einschließlich widersprüchlicher Duplikate bleiben erhalten.

### Quellseite 1

| Anbieter | WLAN-Chip / -Modul | WLAN-Schnittstelle | WLAN-Generation | IEEE-802.11-Standard | Maximale Datenrate | Stromspar-MCU | 2.4GHz-Band | 5.0GHz-Band | 6.0GHz-Band | Antenne | BT-Standard | BT-Schnittstelle | Status | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rockchip | RK960 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.3 | UART/PCM | SS |  |
| Rockchip | RK962 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | 5.3 | UART/PCM | SS |  |
| Rockchip | RK915 | SDIO | Wi-Fi 4 | 802.11b/g/n | 65Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Synaptics (IC) | SYN43756E | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.4 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43711 | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.4 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43752 | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.4 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43598 | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43456 | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Synaptics (IC) | SYN43436 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Synaptics (IC) | BCM430132 | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Realtek (IC) | RTL8852C | PCIe/USB | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/USB/PC M | DS |  |
| Realtek (IC) | RTL8852B | SDIO/PCIe/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/USB/PC M | DS |  |
| Realtek (IC) | RTL8832BU | USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | × | × | DS |  |
| Realtek (IC) | RTL8851B | SDIO/PCIe/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/USB/PC M | DS |  |
| Realtek (IC) | RTL8822C | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5 | UART/USB/PC M | SS |  |
| Realtek (IC) | RTL8822E | SDIO/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | SS |  |
| Realtek (IC) | RTL8821C | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 4.2 | UART/USB/PC M | DS |  |
| Realtek (IC) | RTL8812CU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | × | × | DS | EFEM |
| Realtek (IC) | RTL8812EU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | × | × | DS |  |
| Realtek (IC) | RTL8811CU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Realtek (IC) | RTL8192E | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 300Mbps |  | √ | × | × | 2T2R | × | × | DS | EFEM |

### Quellseite 2

| Anbieter | WLAN-Chip / -Modul | WLAN-Schnittstelle | WLAN-Generation | IEEE-802.11-Standard | Maximale Datenrate | Stromspar-MCU | 2.4GHz-Band | 5.0GHz-Band | 6.0GHz-Band | Antenne | BT-Standard | BT-Schnittstelle | Status | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Realtek (IC) | RTL8192F | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 300Mbps |  | √ | × | × | 2T2R | × | × | DS |  |
| Realtek (IC) | RTL8733B | SDIO/USB | Wi-Fi 4 | 802.11 a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Realtek (IC) | RTL8723D | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | 4.2 | UART/USB/PC M | SS |  |
| Realtek (IC) | RTL8731B | SDIO/USB | Wi-Fi 4 | 802.11 a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Realtek (IC) | RTL8189FTV | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Realtek (IC) | RTL8189ES/EM | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| Realtek (IC) | RTL8188FTV | USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Realtek (IC) | RTL8761BTV | × | × | × | × |  | × | × | × | × | 5.0 | UART | ST |  |
| Realtek (IC) | RTL8188EUS-VH | USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS | EFEM |
| Infineon (IC) | CYW55572 | SDIO/PCIe | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.4 | UART/PCM | DS |  |
| Infineon (IC) | CYW55513 | SDIO/SPI | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.4 | UART/PCM | DS |  |
| Infineon (IC) | CYW54591 | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.4 | UART/PCM | DS |  |
| Infineon (IC) | CYW43455 | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | ST |  |
| Infineon (IC) | CYW4373 | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Infineon (IC) | CYW43438 | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| Infineon (IC) | CYW43012 | SDIO/SPI | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Infineon (IC) | CYW43439 | SDIO | Wi-Fi 4 | 802.11 b/g/n | 65Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| AIC (IC) | AIC8800D80 | SDIO/PCIe/USB | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| AIC (IC) | AIC8800D | SDIO/USB | Wi-Fi 6 | 802.11b/g/n/ax | 286.80Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| SeekWave (IC) | EA6621Q | SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | ST |  |
| Unisoc (IC) | UWE5621DS | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| iComm (IC) | SSV6155P | USB | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| iComm (IC) | SV6158 | SDIO | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| iComm (IC) | SV6256 | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| AltoBeam (IC) | ATBM603x | SDIO/USB | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | ST |  |
| AltoBeam (IC) | ATBM6441 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | × | × | ST |  |
| AltoBeam (IC) | ATBM6461 | SDIO | Wi-Fi 6 | 803.11b/g/n/ax | 286.8Mbps | √ | √ | × | × | 1T1R | 5.0 | × | ST |  |
| Hisilicon (IC) | Hi3861L | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | × | × | SS |  |
| Hisilicon (IC) | Hi3853 | SDIO | Wi-Fi 6 | 802.11b/g/n/ax | 150Mbps | √ | √ | × | × | 1T1R | 5.3 | × | ST |  |
| Ampak (Module) | AP6275 (SYN43752) | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | SS |  |
| Ampak (Module) | AP6611 （SYN43711） | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | ST |  |
| Ampak (Module) | AP6281 (SYN4381) | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| Ampak (Module) | AP6276 (SYN43756E） | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | ST |  |
| Ampak (Module) | AP6398S (SYN43598) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | SS |  |
| Ampak (Module) | AP6256 (SYN43456) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | SS |  |
| Ampak (Module) | AP6203BM (BCM430132) | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | ST |  |
| Ampak (Module) | AP6212 （BCM43438） | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.4 | UART/PCM | SS |  |

### Quellseite 3

| Anbieter | WLAN-Chip / -Modul | WLAN-Schnittstelle | WLAN-Generation | IEEE-802.11-Standard | Maximale Datenrate | Stromspar-MCU | 2.4GHz-Band | 5.0GHz-Band | 6.0GHz-Band | Antenne | BT-Standard | BT-Schnittstelle | Status | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ITON (Module) | BW3752-50BX (SYN43752) | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | ST |  |
| ITON (Module) | BW756E-50B2 (SYN43756E) | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | ST |  |
| ITON (Module) | BW3598-50BX (SYN43598) | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 867Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | ST |  |
| ITON (Module) | BW3456-44B1 (SYN43456) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| ITON (Module) | BW0132-44B1 (BCM430132) | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| ITON (Module) | BW436S-44B1 (SYN43436) | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| AzureWave (Module) | AW-XM606 (CYW55513) | SDIO/SPI | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-XM650 (CYW55512) | SDIO/SPI | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-XM643 (CYW55573) | SDIO/PCIE | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-XM612 (CYW55572) | SDIO/PCIE | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | ST |  |
| AzureWave (Module) | AW-XM632 (CYW55571) | SDIO/PCIE | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-CM467 (CYW4373) | SDIO/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM/U SB | DS |  |
| AzureWave (Module) | AW-CM572 (CYW54591) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.1 | UART/PCM | DS |  |
| AzureWave (Module) | AW-CM256SM (CYW43455) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (Module) | AW-AM497 (CYW43012) | SDIO | Wi-Fi 4 | 802.11 b/g/n/ac friendly | 78Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| AzureWave (Module) | AW-NM372SM (CYW43438) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.1 | UART/PCM | DS |  |
| AzureWave (Module) | AW-NM512 (CYW43439) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FCS866R (RTL8852BS-CG) | SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FCE863R (RTL8852BE-VR-CG) | PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FCU760K/FCS960K (AIC8800D80) | USB/SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Quectel (Module) | FCS961K (AIC8800DC) | SDIO | Wi-Fi 6 | 802.11 b/ g/ n/ ax | 286Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FC80A (CYW54591) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.1 | UART/PCM | DS |  |
| Quectel (Module) | FCS850R (RTL8822CS-VS-CG) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| Quectel (Module) | FCS851U (UWE5621) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| Quectel (Module) | FCS950R (RTL8821CS-CG) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 4.2 | UART/PCM | DS |  |
| Quectel (Module) | FC905A (CYW43455) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | DS |  |
| Quectel (Module) | FCS940R (RTL8723DS-CG) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | 5.0 | UART/PCM | DS |  |

### Quellseite 4

| Anbieter | WLAN-Chip / -Modul | WLAN-Schnittstelle | WLAN-Generation | IEEE-802.11-Standard | Maximale Datenrate | Stromspar-MCU | 2.4GHz-Band | 5.0GHz-Band | 6.0GHz-Band | Antenne | BT-Standard | BT-Schnittstelle | Status | Anmerkungen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Quectel (Module) | FC908A (CYW43438) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.1 | UART/PCM | ST |  |
| Quectel (Module) | FCS945R (RTL8733BS-CG) | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel (Module) | FCU741R (RTL8731BU-CG) | USB | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Quectel (Module) | FC30R (RTL8189EM-VI-CG) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| CVTE (Module) | SKI.WB800DS2.1 (AIC8800D) | SDIO/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 286Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| CVTE (Module) | SKI.WB800D80S.1 (AIC8800D80) | SDIO/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | ST |  |
| Murata (Module) | SP-ZZ1ZC-C (CYW88459) | PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.1 | UART/PCM | ST | AutoMotive |
| nFore (Module) | NF3205PQ | PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | DS | AutoMotive |

## Offizielle Quellen

[Rockchip Redmine](https://redmine.rock-chips.com/documents/52)

Einige Redmine-Ressourcen erfordern ein berechtigtes Konto. Diese Ausgabe basiert auf der bereitgestellten Version; ihre Aktualität gegenüber späteren Releases wird nicht behauptet.

{% endraw %}
