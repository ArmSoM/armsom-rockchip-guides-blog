---
title: "Rockchip-RGB/MCU-Entwicklerleitfaden: Pinzuordnung, Panels, SPI und Timing"
description: "Vollständige RGB-/MCU-Protokolle, Plattformunterstützung, Pinzuordnungen, Device Trees, Initialisierungssequenzen, Bildratenformeln und Frame-Schreib-/Lesezugriffe."
translation_key: "052-rockchip-rgb-mcu"
slug: "052-rockchip-rgb-mcu"
lang: "de"
date: "2026-10-16"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "media"
products: []
tags: ["RGB", "MCU", "RK3576", "RK3506", "RV1126B", "SPI"]
keywords: "ArmSoM Rockchip RGB MCU Panel SPI RK3576 RK3506"
excerpt: "Vollständige RGB-/MCU-Protokolle, Plattformunterstützung, Pinzuordnungen, Device Trees, Initialisierungssequenzen, Bildratenformeln und Frame-Schreib-/Lesezugriffe."
---

{% raw %}

# Rockchip-RGB/MCU-Entwicklerleitfaden: Pinzuordnung, Panels, SPI und Timing

Dies ist eine Rockchip-RGB/MCU-Plattformreferenz. Die Unterstützungstabelle von V1.7.1 nennt RK1808, RK312X/PX3SE, RK3288, RK3308B/BS, RK3326/PX30, RK3506, RK3562, RK3568, RK3576, RV1103/1106, RV1109/RV1126 und RV1126B mit unterschiedlichen Fähigkeiten. Daraus folgt keine Unterstützung auf jedem ArmSoM-Board. Die SPI-/Panel-Konfiguration unterscheidet zwischen Kernel 4.19 und älter sowie 5.10 und neuer. Prüfen Sie SDK/BSP, herausgeführte Schnittstelle, Pinmultiplexing, Spannung und Panel-Timing des Boards. Eine Prüfung an ArmSoM-Hardware wurde nicht durchgeführt; Werte und Abbildungen der Quelle sind Plattformbeispiele.

Quelle: Rockchip_Developer_Guide_RGB_MCU_CN.pdf, V1.7.1, 34 Seiten. Nur die chinesische Quelle wurde bereitgestellt. Englisch, Russisch und diese deutsche Fassung übersetzen den vollständigen technischen Haupttext; alle Fassungen verwenden die chinesischen PDF-Abbildungen, ohne übersetzte Bildbeschriftungen vorzutäuschen.

[Redaktionelle Hinweise](/docs/rockchip-rgb-mcu/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Grundlagen

### 1.1 RGB-Schnittstelle

RGB wird auch DPI (Display Pixel Interface) genannt. Es verwendet vier Synchronisationssignale: Vsync, Hsync, Den (Enable) und DCLK (Dotclk). Nach dem Synchronisationsverfahren werden DE- und SYNC-Modus unterschieden. Das RGB-Ausgabetiming von Rockchip kann beide unterstützen.

![Timing im DE-Modus](/docs/rockchip-rgb-mcu/assets/cn-p4-1.png)

*Timing im DE-Modus*

#### 1.1.1 DE-Modus

Die Gültigkeit von DB[23:0] hängt ausschließlich von Den ab. Laut Quelle sind die Daten bei Low-Pegel gültig und andernfalls ungültig.

#### 1.1.2 SYNC-Modus

![Timing im SYNC-Modus](/docs/rockchip-rgb-mcu/assets/cn-p5-1.png)

*Timing im SYNC-Modus*

Die Daten DB[23:0] werden durch Vsync und Hsync synchronisiert und entsprechend dem obigen Timing abgetastet.

### 1.2 MCU-Schnittstelle

MCU wird auch DBI oder 8080-Schnittstelle genannt. Es unterstützt bidirektionale Kommunikation zwischen TX und RX mit vier Synchronisationssignalen: RS (CSX), CSN (D/CX), WEN (WRX) und REN (RDX). Der einleitende Quellabsatz behauptet, Rockchip unterstütze nur MCU TX; die spätere Plattformtabelle nennt jedoch Leseunterstützung für RK3506 und RV1126B. Dieser Widerspruch bleibt zur Überprüfung erhalten.

#### 1.2.1 Schreibtiming

![MCU-Schreibtiming](/docs/rockchip-rgb-mcu/assets/cn-p6-1.png)

*MCU-Schreibtiming*

CSX, D/CX und WRX werden nacheinander auf Low gesetzt. Während DB[23:0] gültig ist, wechselt WRX zuerst auf Low und dann auf High.

#### 1.2.2 Lesetiming

![MCU-Lesetiming und anfängliche Dummy-Daten](/docs/rockchip-rgb-mcu/assets/cn-p6-2.png)

*MCU-Lesetiming und anfängliche Dummy-Daten*

CSX, D/CX und RDX werden nacheinander auf Low gesetzt. Während DB[23:0] gültig ist, wechselt RDX zuerst auf Low und dann auf High.

Vor dem Lesen wird die Registeradresse durch einen Schreibzugriff an das Panel übertragen.

Der erste Lesezugriff liefert ungültige Daten; gültige Daten beginnen mit dem zweiten Lesezugriff.

MCU-Lesezugriffe werden häufig zur Panel-Fehlersuche, zum Ermitteln von Panel-IDs für die Unterstützung mehrerer Panels und für die später beschriebene Frame-Lesefunktion verwendet.

#### 1.2.3 Bypass- und Normalmodus

Der Bypass-Modus wird verwendet, wenn MCU und Panel Befehle durch Schreib-/Lesezugriffe austauschen.

Das Senden von Initialisierungs-/Deinitialisierungsbefehlen aus panel-init-sequence/panel-exit-sequence und Frame-Schreib-/Lesezugriffe gehören zum Bypass-Modus. Siehe die entsprechenden Abschnitte zur Softwarekonfiguration.

Im Normalmodus sendet der Host Bilddaten über MCU in den Panel-RAM für die normale Anzeige. Dieser Modus beginnt gewöhnlich nach Übertragung von panel-init-sequence und Bestätigung einer erfolgreichen Panel-Initialisierung.

Der Bypass-Modus kann Schreib- und Lesezugriffe umfassen; der Normalmodus umfasst ausschließlich Schreibzugriffe.

## 2. Unterstützung auf Rockchip-Plattformen

| SoC-Plattform | RGB-Unterstützung | MCU-Unterstützung | MCU-Leseunterstützung | VOP-Version | Video-Port-Pfad (VOP 2.0) | Unterstützte Ausgabemodi |
| --- | --- | --- | --- | --- | --- | --- |
| RK1808 | Y | Y | N | VOP 1.0 |  | RGB666/RGB565 |
| RK312X/PX3SE | Y | N | N | VOP 1.0 |  | RGB888/RGB666/RGB565 |
| RK3288 | Y | Y | N | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8 |
| RK3308B/RK3308BS | Y | Y | N | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8 |
| RK3326/PX30 | Y | Y | N | VOP 1.0 |  | RGB888/RGB666/RGB565 |
| RK3506 | Y | Y | Y | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8/RGB3x6/RGB2x8 |
| RK3562 | Y | Y | N | VOP 2.0 | VP0 | RGB888/RGB666/RGB565/RGB3x8 |
| RK3568 | Y | N | N | VOP 2.0 | VP2 | RGB888/RGB666/RGB565 |
| RK3576 | Y | Y | N | VOP 2.0 | VP1/VP2 | RGB888/RGB666/RGB565/RGB3x8/RGB3x6/RGB2x8 |
| RV1103 | Y | Y | N | VOP 1.0 |  | RGB3x8 |
| RV1106 | Y | Y | N | VOP 1.0 |  | RGB666/RGB565/RGB3x8 |
| RV1109/RV1126 | Y | Y | N | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8 |
| RV1126B | Y | Y | Y | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8/RGB3x6/RGB2x8 |

Zu VOP und VP (Video Port) siehe Rockchip_Developer_Guide_DRM_Display_Driver_CN.

## 3. Hardwareverbindungen

### 3.1 RK3562/RK3576/RK3506/RV1126B

| Komponentenname | Pinname | RGB888 (MCU) | RGB666 (MCU) | RGB565 (MCU) | RGB3x8 (MCU) | RGB3x6 (MCU) | RGB2x8 (MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | VO_LCDC_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | VO_LCDC_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | VO_LCDC_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | VO_LCDC_D23 | √ | √ | √ | √ (D7_m1) | √ (D5_m1) | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ | √ | √ (D6_m1) | √ (D4_m1) | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ | √ | √ (D5_m1) | √ (D3_m1) | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ | √ | √ (D4_m1) | √ (D2_m1) | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ | √ | √ (D3_m1) | √ (D1_m1) | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | √ | √ | × | × | × | × |
| R1_D17 | VO_LCDC_D17 | √ | × | × | × | × | × |
| R0_D16 | VO_LCDC_D16 | √ | × | × | × | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ | √ | √ (D2_m1) | √ (D0_m1) | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ | √ | √ (D1_m1) | × | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ | √ | √ (D0_m1) | × | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ | √ | √ (D7_m0) | √ (D5_m0) | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ | √ | √ (D6_m0) | √ (D4_m0) | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ | √ | √ (D5_m0) | √ (D3_m0) | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | √ | × | × | × | × | × |
| G0_D8 | VO_LCDC_D8 | √ | × | × | × | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ | √ | √ (D4_m0) | √ (D2_m0) | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ | √ | √ (D3_m0) | √ (D1_m0) | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ | √ | √ (D2_m0) | √ (D0_m0) | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ | √ | √ (D1_m0) | × | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ | √ | √ (D0_m0) | × | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | √ | √ | × | × | × | × |
| B1_D1 | VO_LCDC_D1 | √ | × | × | × | × | × |
| B0_D0 | VO_LCDC_D0 | √ | × | × | × | × | × |

### 3.2 RK3568

| Komponentenname | Pinname | RGB888 | RGB666 | RGB565 |
| --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK | DCLK | DCLK | DCLK |
| VSYNC | LCDC_VSYNC | VSYNC | VSYNC | VSYNC |
| HSYNC | LCDC_HSYNC | HSYNC | HSYNC | HSYNC |
| DEN | LCDC_DEN | DEN | DEN | DEN |
| R7_D23 | LCDC_D23 | √ | √ | √ |
| R6_D22 | LCDC_D22 | √ | √ | √ |
| R5_D21 | LCDC_D21 | √ | √ | √ |
| R4_D20 | LCDC_D20 | √ | √ | √ |
| R3_D19 | LCDC_D19 | √ | √ | √ |
| R2_D18 | LCDC_D18 | √ | √ | × |
| R1_D17 | LCDC_D17 | √ | × | × |
| R0_D16 | LCDC_D16 | √ | × | × |
| G7_D15 | LCDC_D15 | √ | √ | √ |
| G6_D14 | LCDC_D14 | √ | √ | √ |
| G5_D13 | LCDC_D13 | √ | √ | √ |
| G4_D12 | LCDC_D12 | √ | √ | √ |
| G3_D11 | LCDC_D11 | √ | √ | √ |
| G2_D10 | LCDC_D10 | √ | √ | √ |
| G1_D9 | LCDC_D9 | √ | × | × |
| G0_D8 | LCDC_D8 | √ | × | × |
| B7_D7 | LCDC_D7 | √ | √ | √ |
| B6_D6 | LCDC_D6 | √ | √ | √ |
| B5_D5 | LCDC_D5 | √ | √ | √ |
| B4_D4 | LCDC_D4 | √ | √ | √ |
| B3_D3 | LCDC_D3 | √ | √ | √ |
| B2_D2 | LCDC_D2 | √ | √ | × |
| B1_D1 | LCDC_D1 | √ | × | × |
| B0_D0 | LCDC_D0 | √ | × | × |

### 3.3 RK312X/PX3SE/RK3288/RK3308B/RK3308BS/RK3328/RK3326/PX30/RV1109/RV1126

| Komponentenname | Pinname | RGB888 (MCU) | RGB666 (MCU) | RGB666_CPADHI (MCU) | RGB565 (MCU) | RGB565_CPADHI (MCU) | RGB3x8 (MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK/LCD_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | LCDC_VSYNC/LCD_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC/LCD_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | LCDC_DEN/LCD_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | LCDC_D23/LCD_D23 | √ | × | √ | × | √ | × |
| R6_D22 | LCDC_D22/LCD_D22 | √ | × | √ | × | √ | × |
| R5_D21 | LCDC_D21/LCD_D21 | √ | × | √ | × | √ | × |
| R4_D20 | LCDC_D20/LCD_D20 | √ | × | √ | × | √ | × |
| R3_D19 | LCDC_D19/LCD_D19 | √ | × | √ | × | √ | × |
| R2_D18 | LCDC_D18/LCD_D18 | √ | × | √ | × | × | × |
| R1_D17 | LCDC_D17/LCD_D17 | √ | √ | × | × | × | × |
| R0_D16 | LCDC_D16/LCD_D16 | √ | √ | × | × | × | × |
| G7_D15 | LCDC_D15/LCD_D15 | √ | √ | √ | √ | √ | × |
| G6_D14 | LCDC_D14/LCD_D14 | √ | √ | √ | √ | √ | × |
| G5_D13 | LCDC_D13/LCD_D13 | √ | √ | √ | √ | √ | × |
| G4_D12 | LCDC_D12/LCD_D12 | √ | √ | √ | √ | √ | × |
| G3_D11 | LCDC_D11/LCD_D11 | √ | √ | √ | √ | √ | × |
| G2_D10 | LCDC_D10/LCD_D10 | √ | √ | √ | √ | √ | × |
| G1_D9 | LCDC_D9/LCD_D9 | √ | √ | × | √ | × | × |
| G0_D8 | LCDC_D8/LCD_D8 | √ | √ | × | √ | × | × |
| B7_D7 | LCDC_D7/LCD_D7 | √ | √ | √ | √ | √ | √ |
| B6_D6 | LCDC_D6/LCD_D6 | √ | √ | √ | √ | √ | √ |
| B5_D5 | LCDC_D5/LCD_D5 | √ | √ | √ | √ | √ | √ |
| B4_D4 | LCDC_D4/LCD_D4 | √ | √ | √ | √ | √ | √ |
| B3_D3 | LCDC_D3/LCD_D3 | √ | √ | √ | √ | √ | √ |
| B2_D2 | LCDC_D2/LCD_D2 | √ | √ | √ | √ | × | √ |
| B1_D1 | LCDC_D1/LCD_D1 | √ | √ | × | √ | × | √ |
| B0_D0 | LCDC_D0/LCD_D0 | √ | √ | × | √ | × | √ |

### 3.4 RK1808/RV1106

| Komponentenname | Pinname | RGB666 (MCU) | RGB565 (MCU) | RGB565 (MCU) | RGB3x8 (MCU) |
| --- | --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK/LCD_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | LCDC_VSYNC/LCD_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC/LCD_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | LCDC_DEN/LCD_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R5_D17 | LCDC_D17/LCD_D17 | √ | × | × | × |
| R4_D16 | LCDC_D16/LCD_D16 | √ | × | × | × |
| R3_D15 | LCDC_D15/LCD_D15 | √ | √ | √ | × |
| R2_D14 | LCDC_D14/LCD_D14 | √ | √ | √ | × |
| R1_D13 | LCDC_D13/LCD_D13 | √ | √ | √ | × |
| R0_D12 | LCDC_D12/LCD_D12 | √ | √ | √ | × |
| G5_D11 | LCDC_D11/LCD_D11 | √ | √ | √ | × |
| G4_D10 | LCDC_D10/LCD_D10 | √ | √ | √ | × |
| G3_D9 | LCDC_D9/LCD_D9 | √ | √ | √ | × |
| G2_D8 | LCDC_D8/LCD_D8 | √ | √ | √ | × |
| G1_D7 | LCDC_D7/LCD_D7 | √ | √ | √ | √ |
| G0_D6 | LCDC_D6/LCD_D6 | √ | √ | √ | √ |
| B5_D5 | LCDC_D5/LCD_D5 | √ | √ | √ | √ |
| B4_D4 | LCDC_D4/LCD_D4 | √ | √ | √ | √ |
| B3_D3 | LCDC_D3/LCD_D3 | √ | √ | √ | √ |
| B2_D2 | LCDC_D2/LCD_D2 | √ | √ | √ | √ |
| B1_D1 | LCDC_D1/LCD_D1 | √ | √ | √ | √ |
| B0_D0 | LCDC_D0/LCD_D0 | √ | √ | √ | √ |

### 3.5 RV1103

| Komponentenname | Pinname | RGB3x8 (MCU) |
| --- | --- | --- |
| DCLK | LCDC_CLK | DCLK(RS) |
| VSYNC | LCDC_VSYNC | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC | HSYNC(WRN) |
| DEN | LCDC_DEN | DEN(RDN) |
| D7 | LCDC_D7 | √ |
| D6 | LCDC_D6 | √ |
| D5 | LCDC_D5 | √ |
| D4 | LCDC_D4 | √ |
| D3 | LCDC_D3 | √ |
| D2 | LCDC_D2 | √ |
| D1 | LCDC_D1 | √ |
| D0 | LCDC_D0 | √ |

### 3.6 RV1126B-P

RV1126B-P führt eine Datenzuordnung ein, um das Hardware-Verbindungsschema des bisherigen RV1126 beizubehalten. Unterschiedliche Datenzuordnungen leiten Daten an unterschiedliche Hardware-Pins.

Die vollständigen Definitionen der Datenzuordnungen stehen in include/dt-bindings/display/rockchip_vop.h:

```text
/* mcu_data[23:0] */
#define ROCKCHIP_MCU_DATA_MAP_DATA_1x24 0
/*

 * { mcu_data[7:3], 3'b0, mcu_data[2:0], mcu_data[7:5], 2'b0, mcu_data[4:0], 3'b0 }
 * That is:
 *   LCDC_D23 -> MCU_D7_M1
 *   LCDC_D22 -> MCU_D6_M1
 *   LCDC_D21 -> MCU_D5_M1
 *   LCDC_D20 -> MCU_D4_M1
 *   LCDC_D19 -> MCU_D3_M1
 *   LCDC_D18 -> N/A
 *   LCDC_D17 -> N/A
 *   LCDC_D16 -> N/A
 *   LCDC_D15 -> MCU_D2_M1
 *   LCDC_D14 -> MCU_D1_M1

 *   LCDC_D13 -> MCU_D0_M1
 *   LCDC_D12 -> MCU_D7_M0
 *   LCDC_D11 -> MCU_D6_M0
 *   LCDC_D10 -> MCU_D5_M0
 *   LCDC_D9 -> N/A

 *   LCDC_D8 -> N/A
 *   LCDC_D7 -> MCU_D4_M0
 *   LCDC_D6 -> MCU_D3_M0
 *   LCDC_D5 -> MCU_D2_M0
 *   LCDC_D4 -> MCU_D1_M0
 *   LCDC_D3 -> MCU_D0_M0
 *   LCDC_D2 -> N/A
 *   LCDC_D1 -> N/A
 *   LCDC_D0 -> N/A
 */
#define ROCKCHIP_MCU_DATA_MAP_DATA_WITH_DUMMY_0 1
```

Beim Standard-RV1126B entsprechen die folgenden MCU-Standardverbindungen ROCKCHIP_MCU_DATA_MAP_DATA_WITH_DUMMY_0.

| Komponentenname | Pinname | RGB888 (MCU) | RGB666 (MCU) | RGB565 (MCU) | RGB3x8 (MCU) | RGB3x6 (MCU) | RGB2x8 (MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | VO_LCDC_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | VO_LCDC_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | VO_LCDC_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | VO_LCDC_D23 | √ | √ | √ | √ (D7_m1) | √ (D5_m1) | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ | √ | √ (D6_m1) | √ (D4_m1) | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ | √ | √ (D5_m1) | √ (D3_m1) | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ | √ | √ (D4_m1) | √ (D2_m1) | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ | √ | √ (D3_m1) | √ (D1_m1) | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | √ | √ | × | × | × | × |
| R1_D17 | VO_LCDC_D17 | √ | × | × | × | × | × |
| R0_D16 | VO_LCDC_D16 | √ | × | × | × | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ | √ | √ (D2_m1) | √ (D0_m1) | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ | √ | √ (D1_m1) | × | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ | √ | √ (D0_m1) | × | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ | √ | √ (D7_m0) | √ (D5_m0) | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ | √ | √ (D6_m0) | √ (D4_m0) | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ | √ | √ (D5_m0) | √ (D3_m0) | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | √ | × | × | × | × | × |
| G0_D8 | VO_LCDC_D8 | √ | × | × | × | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ | √ | √ (D4_m0) | √ (D2_m0) | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ | √ | √ (D3_m0) | √ (D1_m0) | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ | √ | √ (D2_m0) | √ (D0_m0) | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ | √ | √ (D1_m0) | × | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ | √ | √ (D0_m0) | × | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | √ | √ | × | × | × | × |
| B1_D1 | VO_LCDC_D1 | √ | × | × | × | × | × |
| B0_D0 | VO_LCDC_D0 | √ | × | × | × | × | × |

RV1126B-P verwendet ROCKCHIP_MCU_DATA_MAP_DATA_1x24, damit die MCU-Hardwareausgabe dem bisherigen RV1126 entspricht. Die Verbindungen sind nachfolgend dargestellt:

| Komponentenname | Pinname | RGB888 (MCU) | RGB666 (MCU) | RGB666_CPADHI (MCU) | RGB565 (MCU) | RGB565_CPADHI (MCU) | RGB3x8 (MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK/LCD_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | LCDC_VSYNC/LCD_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC/LCD_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | LCDC_DEN/LCD_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | LCDC_D23/LCD_D23 | √ | × | √ | × | √ | × |
| R6_D22 | LCDC_D22/LCD_D22 | √ | × | √ | × | √ | × |
| R5_D21 | LCDC_D21/LCD_D21 | √ | × | √ | × | √ | × |
| R4_D20 | LCDC_D20/LCD_D20 | √ | × | √ | × | √ | × |
| R3_D19 | LCDC_D19/LCD_D19 | √ | × | √ | × | √ | × |
| R2_D18 | LCDC_D18/LCD_D18 | √ | × | √ | × | × | × |
| R1_D17 | LCDC_D17/LCD_D17 | √ | √ | × | × | × | × |
| R0_D16 | LCDC_D16/LCD_D16 | √ | √ | × | × | × | × |
| G7_D15 | LCDC_D15/LCD_D15 | √ | √ | √ | √ | √ | × |
| G6_D14 | LCDC_D14/LCD_D14 | √ | √ | √ | √ | √ | × |
| G5_D13 | LCDC_D13/LCD_D13 | √ | √ | √ | √ | √ | × |
| G4_D12 | LCDC_D12/LCD_D12 | √ | √ | √ | √ | √ | × |
| G3_D11 | LCDC_D11/LCD_D11 | √ | √ | √ | √ | √ | × |
| G2_D10 | LCDC_D10/LCD_D10 | √ | √ | √ | √ | √ | × |
| G1_D9 | LCDC_D9/LCD_D9 | √ | √ | × | √ | × | × |
| G0_D8 | LCDC_D8/LCD_D8 | √ | √ | × | √ | × | × |
| B7_D7 | LCDC_D7/LCD_D7 | √ | √ | √ | √ | √ | √ |
| B6_D6 | LCDC_D6/LCD_D6 | √ | √ | √ | √ | √ | √ |
| B5_D5 | LCDC_D5/LCD_D5 | √ | √ | √ | √ | √ | √ |
| B4_D4 | LCDC_D4/LCD_D4 | √ | √ | √ | √ | √ | √ |
| B3_D3 | LCDC_D3/LCD_D3 | √ | √ | √ | √ | √ | √ |
| B2_D2 | LCDC_D2/LCD_D2 | √ | √ | √ | √ | × | √ |
| B1_D1 | LCDC_D1/LCD_D1 | √ | √ | × | √ | × | √ |
| B0_D0 | LCDC_D0/LCD_D0 | √ | √ | × | √ | × | √ |

Normalerweise benötigen weder RV1126B noch RV1126B-P eine zusätzliche Konfiguration. Falls Änderungen nötig sind, können sie in DTS angegeben werden.

Das folgende Beispiel konfiguriert RV1126B für die bisherigen RV1126-Hardwareverbindungen. Beim RV1126B-P ist dies bereits die Standardeinstellung.

```text
&rgb {
   /*

   * RV1126 compatible pin output mode 0.
   * MCU: ROCKCHIP_MCU_DATA_MAP_DATA_1x24
   */
   rockchip,data-map-mode = <0>;
};
```

## 4. Softwarekonfiguration

### 4.1 Anzeigepfade

![RGB-/MCU-Pfade für VOP 1.0/2.0](/docs/rockchip-rgb-mcu/assets/cn-p15-1.png)

*RGB-/MCU-Pfade für VOP 1.0/2.0*

VOP (Video Output Process) ist Rockchips Anzeigeverarbeitungseinheit. VOP 1.0 und VOP 2.0 unterscheiden sich hauptsächlich in der Mehrdisplay-Unterstützung; siehe Rockchip_Developer_Guide_DRM_Display_Driver_CN. Die linke und rechte Abbildung zeigen die RGB-/MCU-Pfade für VOP 1.0 bzw. VOP 2.0. VOP liest und verarbeitet Bilddaten aus DDR und sendet sie an RGB/MCU. Die Schnittstelle wandelt das Bild in einen protokollkonformen Datenstrom um und überträgt ihn an das Panel.

### 4.2 Panel-Konfiguration

Der RGB-Panel-Treiber steht in drivers/gpu/drm/panel/panel-simple.c. Ein typischer Panel-Knoten lautet:

```text
/ {
   panel: panel {

      compatible = "simple-panel";
      bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
      backlight = <&backlight>;
      enable-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
      enable-delay-ms = <20>;
      reset-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_LOW>;
      reset-delay-ms = <10>;
      status = "okay";

      display-timings {

         native-mode = <&fx070_dhm11boe_timing>;

         fx070_dhm11boe_timing: timing0 {
           clock-frequency = <50000000>;
           hactive = <1024>;
           vactive = <600>;
           hback-porch = <140>;
           hfront-porch = <160>;
           vback-porch = <20>;
           vfront-porch = <20>;
           hsync-len = <20>;
           vsync-len = <2>;

           hsync-active = <0>;
           vsync-active = <0>;
           de-active = <0>;
           pixelclk-active = <0>;
         };
      };

      port {
         panel_in_rgb: endpoint {
           remote-endpoint = <&rgb_out_panel>;
         };
      };
   };

};

&backlight {
   pwms = <&pwm9 0 25000 0>;
   status = "okay";
};
```

Setzen Sie bus-format entsprechend dem Anzeigemodus des Panels, normalerweise ermittelt aus den Pin-Definitionen im Datenblatt und den vom Treiber-IC unterstützten Anzeigemodi. DTS-Makros sind in include/uapi/linux/media-bus-format.h definiert. Ihre Hardwarezuordnungen lauten:

| Anzeigemodus | Busformat | Takte pro Pixel |
| --- | --- | --- |
| RGB888 (24bit) | MEDIA_BUS_FMT_RGB888_1X24 | 1 |
| RGB666 (18bit) | MEDIA_BUS_FMT_RGB666_1X18 | 1 |
| RGB666_CPADHI (18bit) | MEDIA_BUS_FMT_RGB666_1X24_CPADHI | 1 |
| RGB565 (16bit) | MEDIA_BUS_FMT_RGB565_1X16 | 1 |
| RGB565_CPADHI (16bit) | MEDIA_BUS_FMT_RGB565_1X24_CPADHI | 1 |
| RGB3x8 (8bit) | MEDIA_BUS_FMT_RGB888_3X8 MEDIA_BUS_FMT_RGB888_3X8 | 3 |
| RGB4x8(8bit) | MEDIA_BUS_FMT_RGB888_DUMMY_4X8 MEDIA_BUS_FMT_BGR888_DUMMY_4X8 | 4 |

Passen Sie die pwms-Konfiguration des backlight-Knotens an die tatsächliche Verdrahtung an. Stellen Sie sicher, dass die Hintergrundbeleuchtung vor der Bildanzeige eingeschaltet ist. Siehe Rockchip_Developer_Guide_Linux_PWM_CN.

Konfigurieren Sie enable-gpios/reset-gpios und enable-delay-ms/reset-delay-ms/prepare-delay-ms/unprepare-delay-ms/disable-delay-ms entsprechend den Stromversorgungs-/Reset-Timinganforderungen des Panels und der tatsächlichen Schaltung.

Optional: enable steuert normalerweise die Panel-Stromversorgung. Die GPIO-Konfiguration hängt von der Versorgungsschaltung ab.

Optional: Das Panel führt üblicherweise einen Reset-Pin heraus und beschreibt die Reset-Bedingungen im Datenblatt. Die GPIO-Konfiguration hängt von der Reset-Schaltung ab.

Optional: Konfigurieren Sie enable-delay-ms/reset-delay-ms/prepare-delay-ms/unprepare-delay-ms/disable-delay-ms nach dem Versorgungs-, Reset- und Signaltiming des Datenblatts.

Das Panel-Datenblatt empfiehlt Werte für display-timings. Diese dürfen innerhalb der angegebenen Minimal-/Maximalgrenzen an die Anwendung angepasst werden. Das folgende Datenblatt gehört zum Beispiel-Panel-Knoten:

![Original-Timingtabelle des Beispielpanels](/docs/rockchip-rgb-mcu/assets/cn-p17-1.png)

*Original-Timingtabelle des Beispielpanels*

| Modus | Parameter | Symbol | Min | Typ | Max | Einheit | Hinweis |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DE | Pixeltakt | 1/tCLK | 45 | 51.2 | 57 | MHz |  |
| DE | DCLK-Tastgrad | Tcwh | 40 | 50 | 60 | % |  |
| DE | Horizontale Gesamtdauer | tH | 1324 | 1344 | 1364 | tCLK |  |
| DE | Horizontaler aktiver Bereich | tHA |  | 1024 |  | tCLK |  |
| DE | Horizontale Austastung | tHB | 300 | 320 | 340 | tCLK |  |
| DE | Vertikale Gesamtdauer | tV | 625 | 635 | 645 | tH |  |
| DE | Vertikaler aktiver Bereich | tVA |  | 600 |  | tH |  |
| DE | Vertikale Austastung | tVB | 25 | 35 | 45 | tH |  |
| SYNC | Horizontale Gesamtdauer | TH | 1324 | 1344 | 1364 | tCLK |  |
| SYNC | Horizontale Pulsbreite | Thpw |  | 20 | - | tCLK | thb + thpw = 160DCLK (fest) |
| SYNC | Horizontale hintere Schwarzschulter | Thb |  | 140 | - | tCLK | thb + thpw = 160DCLK (fest) |
| SYNC | Horizontale vordere Schwarzschulter | Thfp | 140 | 160 | 180 | tCLK |  |
| SYNC | Horizontaler aktiver Bereich | THA |  | 1024 |  | tCLK |  |
| SYNC | Vertikale Gesamtdauer | TV | 625 | 635 | 645 | th |  |
| SYNC | Vertikale Pulsbreite | Tvpw |  | 3 | - | th | tvpw + tvb = 23th (fest) |
| SYNC | Vertikale hintere Schwarzschulter | Tvb | - | 20 | - | th | tvpw + tvb = 23th (fest) |
| SYNC | Vertikale vordere Schwarzschulter | Tvfp | 2 | 12 | 22 | th |  |
| SYNC | Vertikaler gültiger Bereich | Tvd |  | 600 |  | th |  |

Die DRM-Struktur display_timing und die Beschreibungen ihrer Mitglieder stehen in include/video/display_timing.h:

```text
/*
 * Single "mode" entry. This describes one set of signal timings a display can
 * have in one setting. This struct can later be converted to struct videomode

 * (see include/video/videomode.h). As each timing_entry can be defined as a
 * range, one struct display_timing may become multiple struct videomodes.
 *
 * Example: hsync active high, vsync active low
 *
 *            Active Video
 * Video ______________________XXXXXXXXXXXXXXXXXXXXXX_____________________
 *  |<- sync ->|<- back ->|<----- active ----->|<- front ->|<- sync..
 *  |    |  porch |        |  porch |
 *
 * HSync _|¯¯¯¯¯¯¯¯¯¯|___________________________________________|¯¯¯¯¯¯¯¯¯
 *

 * VSync ¯|__________|¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|_________
 */
struct display_timing {
   struct timing_entry pixelclock;

   struct timing_entry hactive; /* hor. active video */
   struct timing_entry hfront_porch; /* hor. front porch */
   struct timing_entry hback_porch; /* hor. back porch */
   struct timing_entry hsync_len; /* hor. sync len */

   struct timing_entry vactive; /* ver. active video */
   struct timing_entry vfront_porch; /* ver. front porch */
   struct timing_entry vback_porch; /* ver. back porch */

   struct timing_entry vsync_len; /* ver. sync len */

   enum display_flags flags; /* display flags */
};
```

Bei RGB/MCU bestimmt clock-frequency in display-timings die VOP-Ausgabebildrate. Zur Berechnung dienen die DRM-Timingwerte htotal und vtotal. Nachfolgend ein Auszug; Details stehen in include/drm/drm_modes.h.

Die Bildratenberechnung implementiert drm_mode_vrefresh() in drivers/gpu/drm/drm_modes.c. Mit fr als Bildrate lautet die Formel:

```text
fr = clock / (htotal * vtotal)
```

```text
/**
 * struct drm_display_mode - DRM kernel-internal display mode structure

 * @hdisplay: horizontal display size
 * @hsync_start: horizontal sync start
 * @hsync_end: horizontal sync end
 * @htotal: horizontal total size
 * @hskew: horizontal skew?!
 * @vdisplay: vertical display size
 * @vsync_start: vertical sync start
 * @vsync_end: vertical sync end
 * @vtotal: vertical total size
 * @vscan: vertical scan?!
......
 *

 * The horizontal and vertical timings are defined per the following diagram.
 *
 * ::
 *
 *
 *          Active           Front      Sync       Back
 *         Region           Porch                  Porch
 *   <-----------------------><----------------><-------------><-------------->
 *    //////////////////////|
 *    ////////////////////// |
 *   ////////////////////// |.................. ................
 *                                  _______________

 *   <----- [hv]display ----->
 *   <------------- [hv]sync_start ------------>
 *   <--------------------- [hv]sync_end --------------------->
 *   <-------------------------------- [hv]total ----------------------------->*
 *
......
 */

/**
 * drm_mode_vrefresh - get the vrefresh of a mode
 * @mode: mode
 *
 * Returns:

 * @modes's vrefresh rate in Hz, rounded to the nearest integer. Calculates the
 * value first if it is not yet set.
 */
int drm_mode_vrefresh(const struct drm_display_mode *mode)
{
   unsigned int num, den;

   if (mode->htotal == 0 || mode->vtotal == 0)
      return 0;

   num = mode->clock;
   den = mode->htotal * mode->vtotal;


   if (mode->flags & DRM_MODE_FLAG_INTERLACE)
      num *= 2;
   if (mode->flags & DRM_MODE_FLAG_DBLSCAN)
      den *= 2;
   if (mode->vscan > 1)
      den *= mode->vscan;

   return DIV_ROUND_CLOSEST_ULL(mul_u32_u32(num, 1000), den);
}
EXPORT_SYMBOL(drm_mode_vrefresh);
```

#### 4.2.1 SPI-Initialisierung

Manche RGB-Panels benötigen Initialisierungsbefehle über SPI. drivers/gpu/drm/panel/panel-simple.c unterstützt das serielle Dreidrahtprotokoll mit 9 Bit:

![Dreidraht-SPI-Initialisierungsprotokoll mit 9 Bit](/docs/rockchip-rgb-mcu/assets/cn-p20-1.png)

*Dreidraht-SPI-Initialisierungsprotokoll mit 9 Bit*

Rockchips SPI-Hardware unterstützt Übertragungseinheiten von 4/8/16 Bit, dieses Protokoll verwendet jedoch 9 Bit. Deshalb implementiert panel-simple SPI durch GPIO-Bit-Banging.

Typische Konfiguration für Kernel 5.10 und neuer:

```text
spi_gpio: spi-gpio {
   compatible = "spi-gpio";

   #address-cells = <0x1>;
   #size-cells = <0x0>;
   pinctrl-names = "default";
   pinctrl-0 = <&spi_gpio_pins>;
   spi-delay-us = <10>;
   status = "okay";

   sck-gpios = <&gpio4 RK_PA5 GPIO_ACTIVE_HIGH>;
   miso-gpios = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
   mosi-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_HIGH>;
   cs-gpios = <&gpio4 RK_PA4 GPIO_ACTIVE_HIGH>;
   num-chipselects = <1>;


   /*
   * 320x480 RGB/MCU screen K350C4516T
   */
   panel: panel {
      compatible = "simple-panel-spi";
      reg = <0>;
      bus-format = <MEDIA_BUS_FMT_RGB666_1X18>;
      backlight = <&backlight>;
      enable-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
      enable-delay-ms = <20>;
      reset-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_LOW>;
      reset-delay-ms = <10>;

      prepare-delay-ms = <20>;
      unprepare-delay-ms = <20>;
      disable-delay-ms = <20>;
      init-delay-ms = <10>;
      width-mm = <217>;
      height-mm = <136>;
      rockchip,cmd-type = "spi";

      status = "okay";

      // type:0 is cmd, 1 is data
      panel-init-sequence = [
         /* type delay num val1 val2 val3 */
         00 00 01 e0
         01 00 01 00
         ......
         00 78 01 11
         00 00 01 29
      ];


      panel-exit-sequence = [
         //type delay num val1 val2 val3
         00 0a 01 28
         00 78 01 10
      ];

      display-timings {
         native-mode = <&kd050fwfba002_timing>;

         kd050fwfba002_timing: timing0 {
           /*
            * 10453500 for RGB666(18bit)
            */

           clock-frequency = <10453500>;
           hactive = <320>;
           vactive = <480>;
           hback-porch = <10>;
           hfront-porch = <5>;
           vback-porch = <10>;
           vfront-porch = <5>;
           hsync-len = <10>;
           vsync-len = <10>;
           hsync-active = <0>;
           vsync-active = <0>;
           de-active = <0>;

           pixelclk-active = <1>;
         };
      };

      port {
         panel_in_rgb: endpoint {
           remote-endpoint = <&rgb_out_panel>;
         };
      };
   };
};
```

Aktivieren Sie CONFIG_SPI_GPIO und konfigurieren Sie sck-gpios, miso-gpios, mosi-gpios sowie

cs-gpios entsprechend der Hardware; siehe drivers/spi/spi-gpio.c. Der Panel-Knoten entspricht im Wesentlichen dem obigen, mit folgenden Besonderheiten:

Ändern Sie compatible in "simple-panel-spi".

Setzen Sie rockchip,cmd-type auf "spi".

Tragen Sie in panel-init-sequence/panel-exit-sequence die passenden Initialisierungs-/Deinitialisierungssequenzen ein.

Bei Kernel 4.19 und älter emuliert simple-panel SPI RGB SDI/SCL/CS direkt über GPIO, ohne zusätzlichen SPI-Treiber. SDI wird tatsächlich nicht unterstützt: Die als SDI bezeichnete DTS-Eigenschaft meint Hardware-SDO; dies ist ein Tippfehler der frühen Version. Beispiel:

```text
panel: panel {
   compatible = "simple-panel";

   ......
   spi-sdi-gpios = <&gpio1 RK_PC7 GPIO_ACTIVE_HIGH>;
   spi-scl-gpios = <&gpio1 RK_PD0 GPIO_ACTIVE_HIGH>;
   spi-cs-gpios = <&gpio1 RK_PD1 GPIO_ACTIVE_HIGH>;
   ......
   rockchip,cmd-type = "spi";

   /* type:0 is cmd, 1 is data */
   panel-init-sequence = [
      /* type delay num val1 val2 val3 */
       00  00 01 e0
       ......
       00  78 01 11

       00  00 01 29
   ];

   panel-exit-sequence = [
      /* type delay num val1 val2 val3 */
      00 0a 01 28
      00 78 01 10
   ];
   ......
};
```

SPI-RGB-Referenzkonfigurationen nach Kernel-Version:

Kernel 4.19 und älter: arch/arm64/boot/dts/rockchip/rk3308-evb-ext-v10.dtsi

Kernel 5.10 und neuer: arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-rgb-k350c4516t.dts

### 4.3 RGB-Schnittstelle

Der RGB-Treiber ist drivers/gpu/drm/rockchip/rockchip_rgb.c. DTS-Referenzkonfiguration:

```text
&rgb {
   status = "okay";

   pinctrl-0 = <&rgb666_pins>;
   ports {
      port@1 {
         reg = <1>;


         rgb_out_panel: endpoint {
           remote-endpoint = <&panel_in_rgb>;
         };
      };
   };
};

//VOP 1.0
&rgb_in_vop {
   status = "okay";
};


//VOP 2.0
&rgb_in_vp0 {
   status = "okay";
};
```

Die RGB-Knotenkonfiguration unterscheidet sich zwischen VOP 1.0 und VOP 2.0. Referenzkonfigurationen:

VOP 1.0: arch/arm/boot/dts/rv1106-evb-ext-rgb-v10.dtsi.

VOP 2.0: arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-rgb-FX070-DHM11BOE-A.dts.

Wählen Sie pinctrl entsprechend den tatsächlichen Hardwareverbindungen. Definitionen der Pinreihenfolge stehen in rkxxxx-pinctrl.dtsi/rvxxxx-pinctrl.dtsi.

### 4.4 MCU-Schnittstelle

MCU-Schnittstellen- und MCU-Panel-Treiber stehen in drivers/gpu/drm/rockchip/rockchip_rgb.c. DTS entspricht im Wesentlichen RGB, ergänzt um MCU-Modusauswahl und Timing. Referenzkonfiguration:

```text
&rgb {
   status = "okay";

   rockchip,data-sync-bypass;
   pinctrl-names = "default";
   /*
   * rgb3x8_pins_m0/rgb3x8_pins_m1 for RGB3x8(8bit)
   * rgb565_pins for RGB565(16bit)
   */
   pinctrl-0 = <&rgb565_pins>;

   /*
   * 320x480 RGB/MCU screen K350C4516T
   */
   mcu_panel: mcu-panel {
      /*

      * MEDIA_BUS_FMT_RGB888_3X8 for RGB3x8(8bit)
       * MEDIA_BUS_FMT_RGB565_1X16 for RGB565(16bit)
       */
      bus-format = <MEDIA_BUS_FMT_RGB565_1X16>;

      backlight = <&backlight>;
      enable-gpios = <&gpio1 RK_PA3 GPIO_ACTIVE_LOW>;
      enable-delay-ms = <20>;
      reset-gpios = <&gpio1 RK_PA4 GPIO_ACTIVE_LOW>;
      reset-value = <0>;
      reset-delay-ms = <10>;
      prepare-delay-ms = <20>;
      unprepare-delay-ms = <20>;
      disable-delay-ms = <20>;
      init-delay-ms = <10>;
      width-mm = <217>;
      height-mm = <136>;


      // type:0 is cmd, 1 is data
      panel-init-sequence = [
         //type delay num val1 val2 val3
          ......
          01  00 01 55 /*
                       * interface pixel format:
                       * 66 for RGB3x8(8bit)
                       * 55 for RGB565(16bit)
                       */
          ......
          01  00 01 a0 /*
                       * frame rate control:

                       * 70 (45hz) for RGB3x8(8bit)
                       * a0 (60hz) for RGB565(16bit)
                       */
          ......
          01  00 01 02 /*
                       * display function control:
                       * 32 for RGB
                       * 02 for MCU
                       */
          00  78 01 11
          00  32 01 29
          00  00 01 2c

      ];

      panel-exit-sequence = [
         //type delay num val1 val2 val3
          00  0a 01 28
          00  78 01 10
      ];

      display-timings {
         native-mode = <&kd050fwfba002_timing>;

         kd050fwfba002_timing: timing0 {
            /*
             * 7840125 for frame rate 45Hz
             * 10453500 for frame rate 60Hz
             */

            clock-frequency = <10453500>;
            hactive = <320>;
            vactive = <480>;
            hback-porch = <10>;
            hfront-porch = <5>;
            vback-porch = <10>;
            vfront-porch = <5>;
            hsync-len = <10>;
            vsync-len = <10>;
            hsync-active = <0>;
            vsync-active = <0>;
            de-active = <0>;

            pixelclk-active = <1>;
         };
      };

      port {
            panel_in_rgb: endpoint {
               remote-endpoint = <&rgb_out_panel>;
            };
         };
      };

      ports {
         rgb_out: port@1 {

            reg = <1>;
            #address-cells = <1>;
            #size-cells = <0>;

            rgb_out_panel: endpoint@0 {
               reg = <0>;
               remote-endpoint = <&panel_in_rgb>;
            };
         };
      };
   };
};


//VOP 1.0
&rgb_in_vop {
   status = "okay";
};

&vop {
   status = "okay";

   /*
    * Default config is as follows:
    *
    * mcu-pix-total = <9>;
   * mcu-cs-pst = <1>;
   * mcu-cs-pend = <8>;
   * mcu-rw-pst = <2>;

   * mcu-rw-pend = <5>;
   * mcu-hold-mode = <0>; // default set to 0
   *
   * To increase the frame rate, reduce all parameters because
   * the max dclk rate of mcu is 150M in rv1103/rv1106.
   */
   mcu-timing {
      mcu-pix-total = <5>;
      mcu-cs-pst = <1>;
      mcu-cs-pend = <4>;
      mcu-rw-pst = <2>;
      mcu-rw-pend = <3>;


      mcu-hold-mode = <0>; // default set to 0
   };
};

//VOP 2.0
&rgb_in_vp0 {
   status = "okay";
};

&vp0 {
   status = "okay";


   /*
   * Default config is as follows:
   *
   * mcu-pix-total = <9>;
   * mcu-cs-pst = <1>;
   * mcu-cs-pend = <8>;
   * mcu-rw-pst = <2>;
   * mcu-rw-pend = <5>;
   * mcu-hold-mode = <0>; // default set to 0
   *
   * To increase the frame rate, reduce all parameters because
   * the max dclk rate of mcu is 150M in rk3562.

   */
   mcu-timing {
      mcu-pix-total = <5>;
      mcu-cs-pst = <1>;
      mcu-cs-pend = <4>;
      mcu-rw-pst = <2>;
      mcu-rw-pend = <3>;

      mcu-hold-mode = <0>; // default set to 0
   };
};
```

Die MCU-Knotenkonfiguration unterscheidet sich zwischen VOP 1.0 und VOP 2.0. Referenzkonfigurationen:

VOP 1.0: arch/arm/boot/dts/rv1106-evb-ext-mcu-v10.dtsi.

VOP 2.0: arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-mcu-k350c4516t.dts. Der Treiber wählt MCU oder RGB über rockchip,data-sync-bypass im rgb-Knoten. Ohne diese Eigenschaft gilt standardmäßig RGB; ihre Aktivierung wählt MCU.

Bei Kernel 5.10 und neuer wird das MCU-Panel unter dem rgb-Knoten angeordnet. Bei Kernel 4.19 und älter erfolgt die Initialisierung über simple-panel als eigenständigen Knoten. Beim Verschieben eines Panel-Knotens von simple-panel unter rgb beachten Sie:

Benennen Sie den Knoten mcu-panel; anhand dieses Namens erkennt und verarbeitet der Treiber die MCU-Panel-Parameter.

Die Eigenschaft compatible kann entfernt werden; sie ist nicht erforderlich.

Ein MCU-Panel benötigt gewöhnlich eine Initialisierungssequenz für Anzeigemodus, Pixelformat und Bildrate, abhängig vom Treiber-IC, sowie eine Deinitialisierungssequenz zum Abschalten oder Wechsel in einen Energiesparmodus. Für panel-init-sequence und panel-exit-sequence gilt:

Der Panel-Hersteller liefert die Sequenz, die meist aus einer C-Datei nach DTS übertragen werden muss.

Jede Sequenzzeile enthält von links nach rechts: Befehlstyp cmd/data, Wartezeit in ms, Datenlänge in Bytes und Daten.

Die Bildrate wird normalerweise während der Sequenzinitialisierung konfiguriert und muss zur im Abschnitt Panel-Konfiguration berechneten Rate passen. Das Beispielhandbuch des Treiber-ICs nennt:

![Originaltabelle des FRMCTR1-Registers zur Bildratensteuerung](/docs/rockchip-rgb-mcu/assets/cn-p27-1.png)

*Originaltabelle des FRMCTR1-Registers zur Bildratensteuerung*

| FRMCTR1 (B1h) | D/CX | RDX | WRX | D[23:8] | D7..D0 | HEX |
| --- | --- | --- | --- | --- | --- | --- |
| Befehl | 0 | 1 | ↑ | XX | 1 0 1 1 0 0 0 1 | B1h |
| 1. Parameter | 1 | 1 | ↑ | XX | FRS[3:0] / 0 / 0 / DIVA[1:0] | B0h |
| 2. Parameter | 1 | 1 | ↑ | XX | 0 / 0 / 0 / RTNA[4:0] | 11h |

![Originalauszug zur Zuordnung von FRS und Bildrate](/docs/rockchip-rgb-mcu/assets/cn-p27-2.png)

*Originalauszug zur Zuordnung von FRS und Bildrate*

| FRS[3:0] | CNT | Hz / TE OFF (R34h) | Hz / TE ON (R35h), VBP+VFP &lt;24 |
| --- | --- | --- | --- |
| 0000 | 37 | 28.78 | 27.64 |
| 0001 | 35 | 30.38 | 29.17 |
| 0010 | 33 | 32.17 | 30.89 |
| 0011 | 31 | 34.18 | 32.82 |
| 0100 | 29 | 36.46 | 35.01 |
| 0101 | 27 | 39.06 | 37.51 |
| 0110 | 25 | 42.07 | 40.40 |
| 0111 | 23 | 45.57 | 43.76 |
| 1000 | 21 | 49.71 | 47.74 |
| 1001 | 19 | 54.69 | 52.52 |
| 1010 | 17 | 60.76 | 58.35 |
| 1011 | 15 | 68.36 | 65.65 |
| 1100 | 13 | 78.13 | 75.03 |
| 1101 | 11 | 91.15 | 87.53 |

mcu-timing konfiguriert die Normalmodus-Steuersignale CSN/WEN/REN. Seine Eigenschaften entsprechen den folgenden Zeitintervallen. Die detaillierten Timing- und Intervallanforderungen stammen aus dem Datenblatt des im DTS-Beispiel verwendeten Panels. Nachfolgend wird die Konfiguration von mcu-timing und clock-frequency in display-timings erläutert.

![Steuersignaltiming im normalen MCU-Modus](/docs/rockchip-rgb-mcu/assets/cn-p28-1.png)

*Steuersignaltiming im normalen MCU-Modus*

![Schreib-/Lesetiming des Panels](/docs/rockchip-rgb-mcu/assets/cn-p28-2.png)

*Schreib-/Lesetiming des Panels*

![Original-Timinganforderungen des Panel-Treiber-ICs](/docs/rockchip-rgb-mcu/assets/cn-p29-1.png)

*Original-Timinganforderungen des Panel-Treiber-ICs*

| Signal | Symbol | Parameter | Min | Max | Einheit | Beschreibung |
| --- | --- | --- | --- | --- | --- | --- |
| DCX | tast | Adress-Setup-Zeit | 0 | - | ns | - |
| DCX | that | Adresshaltezeit (Schreiben/Lesen) | 0 | - | ns | - |
| CSX | tchw | CSX-High-Pulsbreite | 0 | - | ns | - |
| CSX | tcs | Chip-Select-Setup (Schreiben) | 15 | - | ns | - |
| CSX | trcs | Chip-Select-Setup (ID lesen) | 45 | - | ns | - |
| CSX | trcsfm | Chip-Select-Setup (FM lesen) | 355 | - | ns | - |
| CSX | tcsf | Chip-Select-Wartezeit (Schreiben/Lesen) | 0 | - | ns | - |
| WRX | twc | Schreibzyklus | 30 | - | ns | - |
| WRX | twrh | High-Dauer der Schreibsteuerung | 15 | - | ns | - |
| WRX | twrl | Low-Dauer der Schreibsteuerung | 15 | - | ns | - |
| RDX (FM) | trcfm | Lesezyklus (FM) | 450 | - | ns | Framespeicher lesen |
| RDX (FM) | trdhfm | High-Dauer der Lesesteuerung (FM) | 90 | - | ns | Framespeicher lesen |
| RDX (FM) | trdlfm | Low-Dauer der Lesesteuerung (FM) | 355 | - | ns | Framespeicher lesen |
| RDX (ID) | trc | Lesezyklus (ID) | 160 | - | ns | ID-Daten lesen |
| RDX (ID) | trdh | High-Dauer der Lesesteuerung | 90 | - | ns | ID-Daten lesen |
| RDX (ID) | trdl | Low-Dauer der Lesesteuerung | 45 | - | ns | ID-Daten lesen |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | tdst | Setup-Zeit der Schreibdaten | 10 | - | ns | Maximum: CL=30pF; Minimum: CL=8pF |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | tdht | Haltezeit der Schreibdaten | 10 | - | ns | Maximum: CL=30pF; Minimum: CL=8pF |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | trat | Lesezugriff | - | 40 | ns | Maximum: CL=30pF; Minimum: CL=8pF |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | tratfm | Lesezugriff | - | 340 | ns | Maximum: CL=30pF; Minimum: CL=8pF |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | trod | Deaktivierung des Leseausgangs | 20 | 80 | ns | Maximum: CL=30pF; Minimum: CL=8pF |

ptotal bezeichnet mcu-pix-total in mcu-timing. Laut Panel-Datenblatt darf das MCU_PIX_TOTAL-Intervall nicht kürzer als tmin sein:

Das Panel-Datenblatt nennt twc = 40, das Treiber-IC-Datenblatt dagegen twc = 30. Verwenden Sie den größeren Wert.

```text
tmin = T_CHW + T_AST + T_WC + T_CHW = 40 ns
```

Das Beispielpanel unterstützt MEDIA_BUS_FMT_RGB888_3X8 und MEDIA_BUS_FMT_RGB565_1X16. cpp bezeichnet Cycles Per Pixel, die Anzahl der Takte zur Übertragung eines Pixels; siehe Panel-Konfiguration. Die theoretischen maximalen Bildraten frs-max und frp-max lauten:

```text
fr < 1000000000 / (htotal * ptotal * cpp * tmin)
htotal = hactive + hback-porch + hfront-porch + hsync-len = 345
vtotal = vactive + vback-porch + vfront-porch + vsync-len = 505
fr_s-max < 1000000000 / (345 * 505 * 3 * 40) ≈ 47.83 Hz
fr_p-max < 1000000000 / (345 * 505 * 1 * 40) ≈ 143.49 Hz
```

Redaktioneller Hinweis: Die allgemeine Quellformel verwendet `ptotal`, setzt numerisch jedoch `505` ein, also den angegebenen `vtotal`-Wert. Beides bleibt erhalten, ohne die Formel stillschweigend zu korrigieren.

Die Quelle wählt daher frs = 45(Hz) für serielles rgb3x8 und frp = 60(Hz) für paralleles rgb1x16.

Nachfolgend bedeutet das Suffix s seriell und p parallel.

Die clock-frequency-Werte in display-timings lauten:

```text
clock_s = fr_s * htotal * vtotal = 45 * 345 * 505 = 7840125
clock_p = fr_p * htotal * vtotal = 60 * 345 * 505 = 10453500
```

Jede Plattform begrenzt MCU dclk. Siehe mcu_max_dclk_rate in drivers/gpu/drm/rockchip/rockchip_rgb.c; üblicherweise beträgt die Grenze 150000000 Hz. Die Prüfung erfolgt in rockchip_rgb_encoder_mode_valid().

Berechnen Sie aus dclkmax und der in der Initialisierungssequenz konfigurierten Bildrate fr, normalerweise 60Hz, den maximalen ptotal-Wert:

```text
ptotal_max < dclk_max / (cpp * clock) - 1
ptotal_s-max < 150000000 / (3 * 7840125) - 1 ≈ 5.38
ptotal_p-max < 150000000 / (1 * 10453500) - 1 ≈ 13.35
```

Wählen Sie den kleineren Wert ptotal = 5 und bestimmen Sie die übrigen mcu-timing-Werte anhand des Timingdiagramms.

Prüfen Sie abschließend die berechneten tatsächlichen Werte gegen die Timinganforderungen des Datenblatts.

Der tatsächliche MCU-dclk entspricht nicht einfach clock-frequency aus display-timings, sondern hängt auch von mcu-pix-total in mcu-timing und Cycles Per Pixel ab:

```text
dclk = clock * cpp * (ptotal + 1)
dclk_s = 7840125 * 3 * 6 = 141122250
dclk_p = 10453500 * 1 * 6 = 62721000
```

Beide dclk-Werte bleiben unter dclkmax. Die tatsächlichen MCU_PIX_TOTAL-Zeiten lauten:

```text
t_s = (ptotal + 1) * 1000000000 / dclk_s ≈ 42.52 ns
t_p = (ptotal + 1) * 1000000000 / dclk_p ≈ 95.66 ns
```

Beide MCU_PIX_TOTAL-Zeiten t erfüllen die Anforderung, über 40 ns zu liegen.

#### 4.4.1 MCU-Bypass-Timing

Frühe MCU-fähige Plattformen wie RK3308 und PX30 verwenden dasselbe Timing für Bypass- und Normalmodus. Ab RK3562 wurde das IC-Design optimiert; der Treiber stellt ein Standard-Bypass-Timing für die meisten Schreib-/Leseanforderungen bereit. Siehe beispielsweise die vop_mcu_bypass_cfg-Definitionen in drivers/gpu/drm/rockchip/rockchip_vop_reg.c und drivers/gpu/drm/rockchip/rockchip_vop2_reg.c:

```text
static struct rockchip_mcu_timing rk3506_mcu_bypass_timing = {
   .mcu_pix_total = 26,
   .mcu_cs_pst = 3,

   .mcu_cs_pend = 24,
   .mcu_rw_pst = 6,
   .mcu_rw_pend = 15,
};

static const struct vop_mcu_bypass_cfg rk3506_mcu_bypass_cfg = {
   .timing = &rk3506_mcu_bypass_timing,
   .dclk_rate = 120000000,
};
```

Erfüllt das Standard-Bypass-Timing die Anwendungsanforderungen nicht, geben Sie es in DTS an; siehe arch/arm/boot/dts/rk3506g-evb1-v10-mcu-k350c4516t.dts:

```text
&vop {
   mcu-timing {

      mcu-pix-total = <5>;
      mcu-cs-pst = <1>;
      mcu-cs-pend = <4>;
      mcu-rw-pst = <2>;
      mcu-rw-pend = <3>;

      mcu-hold-mode = <0>;
   };

   mcu-bypass-timing {
      mcu-pix-total = <9>;
      mcu-cs-pst = <1>;
      mcu-cs-pend = <8>;

      mcu-rw-pst = <2>;
      mcu-rw-pend = <7>;

      mcu-hold-mode = <0>;
   };
};
```

Der Bypass-Modus kann MCU-Lesezugriffe umfassen. Die Mindestzeiten für Lesen sind normalerweise größer als für Schreiben; siehe das vorherige Beispieldatenblatt. Deshalb wird mcu-bypass-timing meist anhand der Lesegrenzen berechnet, um beide Anforderungen zu erfüllen.

#### 4.4.2 MCU-Frame-Schreib-/Lesezugriffe

Im normalen MCU-Modus ermöglichen Frame-Schreib-/Lesezugriffe den Befehlsaustausch zwischen Host und Panel zwischen den Frames, etwa zum Lesen von Statusregistern oder Ändern der Anzeigestartposition. Dies wird häufig bei elektrostatischen Belastungstests oder bei Panels verwendet, deren Anzeigestart für jeden Frame aktualisiert werden muss.

Aktivieren Sie die Funktion durch Konfiguration von panel-frame-sequence in DTS. Siehe arch/arm/boot/dts/rk3506g-evb1-v10-mcu-k350c4516t.dts:

```text
&rgb {
   ......
   mcu_panel: mcu-panel {

      ......
      panel-frame-sequence = [
         //type delay num val1 val2 val3
          00  00 01 0a
          02  00 01 0a
          02  00 01 0a
          00  00 01 2c
      ];
      ......
   };
   ......
};
```

Die Schreib-/Lesezugriffe zwischen Frames sind in drivers/gpu/drm/rockchip/rockchip_rgb.c implementiert:

```text
static void mcu_interframe_work_func(struct work_struct *work)
{
   struct rockchip_mcu_panel *mcu_panel =

      container_of(work, struct rockchip_mcu_panel, interframe_work);
   struct drm_panel *panel = &mcu_panel->base;
   struct drm_display_mode *mode = mcu_panel->desc->mode;
   struct drm_crtc *crtc = mcu_panel->encoder->crtc;
   u32 timeout = DIV_ROUND_CLOSEST_ULL(1000, drm_mode_vrefresh(mode));
   int ret;

   ret = rockchip_drm_wait_vact_end(crtc, timeout);
   if (ret) {
      DRM_DEV_ERROR(panel->dev, "wairt vact end timed out\n");
      return;
   }


   ret = rockchip_mcu_panel_xfer_mcu_cmd_seq(mcu_panel, mcu_panel->desc->frame_seq);
   if (ret) {
      DRM_DEV_ERROR(panel->dev, "failed to send frame cmds seq\n");
      return;
   }

   schedule_work(&mcu_panel->interframe_work);
};
```

Passen Sie für spezielle Anwendungsanforderungen die Implementierung des obigen Work-Items an.

## 5. Vorgehen bei der Fehlersuche

1\. Prüfen Sie die Hardwareverbindungen sämtlicher RGB-/MCU-Pins. Pinzuordnungen können sich zwischen Plattformen unterscheiden; siehe

den obigen Abschnitt Hardwareverbindungen.

![Beispielhafte RGB-/MCU-Pinverbindungen](/docs/rockchip-rgb-mcu/assets/cn-p33-1.png)

*Beispielhafte RGB-/MCU-Pinverbindungen*

2\. Konfigurieren Sie anhand des Panel-Datenblatts Enable-/Reset-Polarität, Einschaltreihenfolge und PWM-Kanal der Hintergrundbeleuchtung. Stellen Sie bei MCU-Panels zusätzlich die richtige Initialisierungssequenz ein.

![Beispielverbindungen für Reset, Enable und Hintergrundbeleuchtungs-PWM](/docs/rockchip-rgb-mcu/assets/cn-p33-2.png)

*Beispielverbindungen für Reset, Enable und Hintergrundbeleuchtungs-PWM*

3\. Prüfen Sie bei eingeschalteter Hintergrundbeleuchtung erneut die Enable-/Reset-Pegel. Weichen Messwerte weiterhin ab, prüfen Sie die korrekte GPIO-Auswahl durch iomux.

## 6. Häufige Probleme

### 6.1 RGB/MCU zeigt ein gestörtes oder versetztes Bild

Versuchen Sie, die dclk-Polarität über pixelclk-active in display-timings umzukehren. Dies ändert die relative Phase zwischen dclk und Daten.

```text
display-timings {
   native-mode = <&fx070_dhm11boe_timing>;


   fx070_dhm11boe_timing: timing0 {
      clock-frequency = <50000000>;
      hactive = <1024>;
      vactive = <600>;
      hback-porch = <140>;
      hfront-porch = <160>;
      vback-porch = <20>;
      vfront-porch = <20>;
      hsync-len = <20>;
      vsync-len = <2>;
      hsync-active = <0>;
      vsync-active = <0>;

      de-active = <0>;
      pixelclk-active = <0>; // 1 翻转，0 不翻转
   };
};
```

{% endraw %}
