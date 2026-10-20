---
title: "Rockchip BT.656 / BT.1120 TX: Timing, Pinzuordnung und Linux-Anzeigekonfiguration"
description: "Vollständige Referenz für progressives und Interlaced-Timing, EAV/SAV, Plattformunterstützung, Verdrahtung, DTS-/DRM-Konfiguration und alle 12 Fragen der Quelle."
translation_key: "039-rockchip-bt656-bt1120"
slug: "039-rockchip-bt656-bt1120"
lang: "de"
date: "2026-10-16"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "linux"
products: []
tags: ["Rockchip", "BT.656", "BT.1120", "DRM", "display"]
keywords: "ArmSoM Rockchip BT656 BT1120 TX DTS Linux DRM RK3588 RK3576"
excerpt: "Vollständige Referenz für progressives und Interlaced-Timing, EAV/SAV, Plattformunterstützung, Verdrahtung, DTS-/DRM-Konfiguration und alle 12 Fragen der Quelle."
---

# Rockchip BT.656 / BT.1120 TX: Timing, Pinzuordnung und Linux-Anzeigekonfiguration

Dies ist eine vollständige Aufbereitung des Rockchip BT.656 TX and BT.1120 TX Developer Guide V2.2.0 (RK-YH-YF-178). Es wurde ausschließlich ein chinesisches PDF bereitgestellt; Englisch und Russisch sind vollständige Übersetzungen, und diese deutsche Fassung folgt dem geprüften englischen Artikel. Alle sechs Originalabbildungen stammen aus diesem PDF: Englische Beschriftungen innerhalb einer Abbildung bedeuten nicht, dass ein englisches Quell-PDF vorliegt. Die Tabellen sind bearbeitbar; bei Tabellen innerhalb von Bildern bleibt neben den kopierbaren Daten auch die Originalabbildung erhalten.

Dies ist eine Plattformreferenz für das Rockchip-BSP, keine Zusage der Unterstützung auf jedem ArmSoM-Board. Nachfolgend steht die Produktversionstabelle der Quelle. RK3576 erscheint in den Abschnitten zu Fähigkeiten und Verdrahtung, fehlt jedoch in dieser Kernel-Versionstabelle; dafür wird keine Kernel-Version erfunden. Nutzen Sie die Referenz für ArmSoM [Sige5](https://docs.armsom.org/armsom-sige5) (RK3576) oder [Sige7](https://docs.armsom.org/armsom-sige7) (RK3588) erst nach Prüfung der herausgeführten Pins, Trägerplatine, Stromversorgung, des Empfängers, SDK/BSP und Kernel-Treibers. Eine Prüfung an ArmSoM-Hardware wurde nicht durchgeführt. Die folgenden Beispiele stammen aus der Quelle.

| Chip | Kernel-Version |
|---|---|
| RV1109/RV1126 | Linux-Kernel 4.19 und neuer |
| RV1103/RV1106 | Linux-Kernel 5.10 und neuer |
| RK356X | Linux-Kernel 4.19 und neuer |
| RK3588 | Linux-Kernel 5.10 und neuer |
| RK3562 | Linux-Kernel 5.10 und neuer |
| RK3506 | Linux-Kernel 6.1 und neuer |
| RV1126B | Linux-Kernel 6.1 und neuer |

## 1. Grundlagen

BT.656 und BT.1120 definieren Schnittstellen für SDTV beziehungsweise HDTV. Die Timing-Referenzcodes EAV und SAV übertragen während der Austastung eingebettete Synchronisationsinformationen; die Daten verwenden YCbCr 4:2:2. Manche Handbücher bezeichnen diese Signale als Video- oder YUV-Signale. Auf den in der Quelle beschriebenen RK-Plattformen haben sowohl Bilddaten als auch Timing-Referenzcodes eine Tiefe von 8 Bit. Protokolldetails finden Sie in Rec. ITU-R BT.1120 und Rec. ITU-R BT.656.

### 1.1 Timing bei progressiver Abtastung (P)

![Progressive Abtastung: aktives Bild, Austastung und EAV-/SAV-Positionen innerhalb eines Frames](/docs/rockchip-bt656-bt1120/assets/cn-p04-figure1.png)

### 1.2 Timing bei Zeilensprungabtastung (I)

![Zeilensprungabtastung: aktives Bild, Austastung und Referenzcodes für zwei Halbbilder](/docs/rockchip-bt656-bt1120/assets/cn-p05-figure1.png)

### 1.3 Timing-Referenzcodes

Die ersten drei Wörter sind fest auf `0xFF, 0x00, 0x00` gesetzt; das vierte hängt von der Abtastposition ab. Bit9 ist fest 1. Für Bit8(F) beschreibt die Quelle F=0 als gerades und F=1 als ungerades Halbbild. Bit7(V) ist bei einer Zeile mit aktivem Bildinhalt 0, andernfalls 1. Bit6(H) ist für SAV 0 und für EAV 1. Bit[5,2] (P3,P2,P1,P0) wird aus F/V/H berechnet. Bit[1,0] ist fest 0; beim 8-Bit-Betrieb der RK-Plattformen können diese beiden niederwertigen Bits als nicht vorhanden betrachtet werden.

```text
Bit5 = V XOR H
Bit4 = F XOR H
Bit3 = F XOR V
Bit2 = F XOR V XOR H
```

![Bitbelegung der Referenzcodes und Definitionen für progressive und Zeilensprungabtastung](/docs/rockchip-bt656-bt1120/assets/cn-p06-figure1.png)

| Wort | 9 (MSB) | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 (LSB) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 4 | 1 | F | V | H | P3 | P2 | P1 | P0 | 0 | 0 |

Die Originalabbildung definiert zusätzlich F=1 im Halbbild/Segment 2 und F=0 im Halbbild/Segment 1 für Zeilensprung- bzw. segmentierte Framesysteme. Während der Halbbild-/Segmentaustastung gilt V=1, sonst 0. Bei progressiven Systemen gilt F=0; während der Frameaustastung ist V=1, sonst 0. In beiden Fällen gilt H=1 für EAV und H=0 für SAV. Nachfolgend stehen die Schutzbits für jede Kombination aus F, V und H.

![Tabelle der SAV-/EAV-Schutzbits](/docs/rockchip-bt656-bt1120/assets/cn-p07-figure1.png)

| Bit9 | F | V | H | P3 | P2 | P1 | P0 | Bit1 | Bit0 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 0 | 1 | 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 0 |

Aus diesen Definitionen ergeben sich folgende Timing-Referenzcodes für die Austastintervalle:

| EAV | Code | SAV | Code |
|---|---|---|---|
| 1 | 0XFF 0X00 0X00 0X9D | 0 | 0XFF 0X00 0X00 0X80 |
| 3 | 0XFF 0X00 0X00 0XB6 | 2 | 0XFF 0X00 0X00 0XAB |
| 5 | 0XFF 0X00 0X00 0XDA | 4 | 0XFF 0X00 0X00 0XC7 |
| 7 | 0XFF 0X00 0X00 0XF1 | 6 | 0XFF 0X00 0X00 0XEC |

## 2. Unterstützung auf RK-Plattformen

| SoC-Plattform | BT.656-Unterstützung | BT.1120-Unterstützung | Abtastmodi |
|---|---|---|---|
| RV1109/RV1126 | N | Y | Nur progressiv |
| RV1103 | Y | N | Progressiv und interlaced |
| RV1106 | Y | Y | Progressiv und interlaced |
| RK3566/RK3568 | Y | Y | Progressiv und interlaced |
| RK3588 | Y | Y | Progressiv und interlaced |
| RK3562 | Y | Y | Progressiv und interlaced |
| RK3576 | Y | Y | Progressiv und interlaced |
| RK3506 | Y | Y | Progressiv und interlaced |
| RV1126B | Y | Y | Progressiv und interlaced |

## 3. Hardwareverbindungen

### 3.1 RV1109/RV1126/RV1103/RV1106/RK3566/RK3568/RK3588

Die folgenden drei Verdrahtungsvarianten werden unterstützt. Stellen Sie entsprechend der tatsächlichen Verdrahtung das passende `bus_format` in DTS oder im Wandler-Treiber ein.

![BT.656- und zwei BT.1120-Verdrahtungsvarianten mit bus_format](/docs/rockchip-bt656-bt1120/assets/cn-p08-figure1.png)

| Schnittstelle | Takt | D15 | D14 | D13 | D12 | D11 | D10 | D9 | D8 | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | bus_format |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BT.656 | Takt | - | - | - | - | - | - | - | - | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | MEDIA_BUS_FMT_UYVY8_2X8 |
| BT.1120 (1) | Takt | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | MEDIA_BUS_FMT_YUYV8_1X16 |
| BT.1120 (2) | Takt | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | MEDIA_BUS_FMT_UYVY8_1X16 |

### 3.2 RK3562/RK3576/RK3506/RV1126B

BT.656 sendet Bilddaten gleichzeitig an die Pin-Gruppen m0 und m1. Damit sind je nach Bedarf ein einzelnes Display oder zwei gespiegelte Displays möglich.

| Komponentenname | Pinname | BT1120 | BT656 |
|---|---|---|---|
| Busformat | × | MEDIA_BUS_FMT_YUYV8_1X16/ MEDIA_BUS_FMT_UYVY8_1x16 | MEDIA_BUS_FMT_UYVY8_2X8 |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) |
| R7_D23 | VO_LCDC_D23 | √ | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | × | × |
| R1_D17 | VO_LCDC_D17 | × | × |
| R0_D16 | VO_LCDC_D16 | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | × | × |
| G0_D8 | VO_LCDC_D8 | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | × | × |
| B1_D1 | VO_LCDC_D1 | × | × |
| B0_D0 | VO_LCDC_D0 | × | × |

### 3.3 RV1126B-P

RV1126B-P führt Datenzuordnungen ein, um die Kompatibilität zur bisherigen RV1126-Verdrahtung zu erhalten. Eine Datenzuordnung wählt die Pins für die Datenübertragung aus. Die Definitionen in `include/dt-bindings/display/rockchip_vop.h` lauten:

```text
 /* { 8'd0, BT1120[15:0] } */
 #define ROCKCHIP_BT1120_DATA_MAP_DATA_PADLO 0
 /* { BT1120[15:0], 8'd0 }*/

 #define ROCKCHIP_BT1120_DATA_MAP_DATA_PADHI 1
 /*
  * { BT1120[15:11], 3'd0, BT1120[10:5], 2'd0, BT1120[4:0], 3'b0 }
  * That is:
  *   LCDC_D23 -> BT1120_D15
  *   LCDC_D22 -> BT1120_D14
  *   LCDC_D21 -> BT1120_D13
  *   LCDC_D20 -> BT1120_D12
  *   LCDC_D19 -> BT1120_D11
  *   LCDC_D18 -> N/A
  *   LCDC_D17 -> N/A
  *   LCDC_D16 -> N/A

  *   LCDC_D15 -> BT1120_D10
  *   LCDC_D14 -> BT1120_D9
  *   LCDC_D13 -> BT1120_D8
  *   LCDC_D12 -> BT1120_D7
  *   LCDC_D11 -> BT1120_D6
  *   LCDC_D10 -> BT1120_D5
  *   LCDC_D9 -> N/A
  *   LCDC_D8 -> N/A
  *   LCDC_D7 -> BT1120_D4
  *   LCDC_D6 -> BT1120_D3
  *   LCDC_D5 -> BT1120_D2
  *   LCDC_D4 -> BT1120_D1
  *   LCDC_D3 -> BT1120_D0

  *   LCDC_D2 -> N/A
  *   LCDC_D1 -> N/A
  *   LCDC_D0 -> N/A
  */
 #define ROCKCHIP_BT1120_DATA_MAP_DATA_WITH_DUMMY_0 3
 /* { 16'd0, BT656[7:0] }*/
 #define ROCKCHIP_BT656_DATA_MAP_PADLO 0
 /* { 8'd0, BT656[7:0], 8'd0 }*/
 #define ROCKCHIP_BT656_DATA_MAP_DUMMY_HI_LO 1
 /* { BT656[7:0], 16'd0 }*/
 #define ROCKCHIP_BT656_DATA_MAP_PADHI 2
 /*

  * { BT656[7:3], 3'd0, BT656[2:0], BT656[7:5], 2'd0, BT656[4:0], 3'd0 }
  * That is:
  *   LCDC_D23 -> BT656_D7_M1
  *   LCDC_D22 -> BT656_D6_M1
  *   LCDC_D21 -> BT656_D5_M1
  *   LCDC_D20 -> BT656_D4_M1
  *   LCDC_D19 -> BT656_D3_M1
  *   LCDC_D18 -> N/A
  *   LCDC_D17 -> N/A
  *   LCDC_D16 -> N/A
  *   LCDC_D15 -> BT656_D2_M1
  *   LCDC_D14 -> BT656_D1_M1
  *   LCDC_D13 -> BT656_D0_M1
  *   LCDC_D12 -> BT656_D7_M0
  *   LCDC_D11 -> BT656_D6_M0
  *   LCDC_D10 -> BT656_D5_M0

  *   LCDC_D9 -> N/A
  *   LCDC_D8 -> N/A
  *   LCDC_D7 -> BT656_D4_M0
  *   LCDC_D6 -> BT656_D3_M0
  *   LCDC_D5 -> BT656_D2_M0
  *   LCDC_D4 -> BT656_D1_M0
  *   LCDC_D3 -> BT656_D0_M0
  *   LCDC_D2 -> N/A
  *   LCDC_D1 -> N/A
  *   LCDC_D0 -> N/A
  */
 #define ROCKCHIP_BT656_DATA_MAP_DATA_WITH_DUMMY_0 3
```

Die Standardverdrahtung des RV1126B entspricht `ROCKCHIP_BT1120_DATA_MAP_DATA_WITH_DUMMY_0` beziehungsweise `ROCKCHIP_BT656_DATA_MAP_DATA_WITH_DUMMY_0`, wie nachfolgend dargestellt.

| Komponentenname | Pinname | BT1120 | BT656 |
|---|---|---|---|
| Busformat | × | MEDIA_BUS_FMT_YUYV8_1X16/ MEDIA_BUS_FMT_UYVY8_1x16 | MEDIA_BUS_FMT_UYVY8_2X8 |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) |
| R7_D23 | VO_LCDC_D23 | √ | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | × | × |
| R1_D17 | VO_LCDC_D17 | × | × |
| R0_D16 | VO_LCDC_D16 | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | × | × |
| G0_D8 | VO_LCDC_D8 | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | × | × |
| B1_D1 | VO_LCDC_D1 | × | × |
| B0_D0 | VO_LCDC_D0 | × | × |

Zur Anpassung an die bisherige RV1126-Verdrahtung verwendet RV1126B-P standardmäßig `ROCKCHIP_BT1120_DATA_MAP_DATA_PADLO` für BT.1120 und `ROCKCHIP_BT656_DATA_MAP_PADLO` für BT.656. Die Verbindungen sind nachfolgend dargestellt.

![Standardverdrahtung des RV1126B-P](/docs/rockchip-bt656-bt1120/assets/cn-p12-figure1.png)

| Schnittstelle | Takt | D15 | D14 | D13 | D12 | D11 | D10 | D9 | D8 | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | bus_format |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BT.656 | Takt | - | - | - | - | - | - | - | - | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | MEDIA_BUS_FMT_UYVY8_2X8 |
| BT.1120 (1) | Takt | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | MEDIA_BUS_FMT_YUYV8_1X16 |
| BT.1120 (2) | Takt | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | MEDIA_BUS_FMT_UYVY8_1X16 |

Bei beiden Plattformen ist die Verdrahtung normalerweise vordefiniert und erfordert keine zusätzliche Einstellung. Falls eine Änderung nötig ist, verwenden Sie DTS. Das Beispiel lässt RV1126B die bisherige RV1126-Verdrahtung verwenden; beim RV1126B-P ist dies bereits die Standardeinstellung.

```text
 &rgb {
    /*
    * RV1126 compatible pin output mode 0.

    *
    * BT1120: ROCKCHIP_BT1120_DATA_MAP_DATA_PADLO
    * BT656: ROCKCHIP_BT656_DATA_MAP_PADLO
    */
    rockchip,data-map-mode = <0>;
 };
```

## 4. Softwarekonfiguration

### 4.1 Aktivieren von BT.656/BT.1120

(1) Wenn das Empfangsgerät keinen senderseitigen Softwaretreiber benötigt (keine Registrierung eines DRM-Connectors), konfigurieren Sie den DTS-Panel-Knoten:

```text
 panel {
    ……

    bus-format = MEDIA_BUS_FMT_YUYV8_1X16; //or
 MEDIA_BUS_FMT_YUYV8_1X16/MEDIA_BUS_FMT_UYVY8_1X16
    ……
 }
```

(2) Falls ein senderseitiger Treiber und die Registrierung eines DRM-Connectors erforderlich sind, verwenden Sie das oben beschriebene DTS-Verfahren oder setzen Sie das Format in `drm_connector_helper_funcs -> get_modes` des Connector-Treibers. Siehe `drivers/gpu/drm/bridge/sii902x.c`:

```text
 static int sii902x_get_modes(struct drm_connector *connector)
 {
    u32 bus_format = MEDIA_BUS_FMT_YUYV8_1X16;//depend on hardware

    ……
    drm_display_info_set_bus_formats(&connector->display_info, &bus_format, 1);
    ……
 }
```

Nach der Konfiguration von `bus_format` mit einem der beiden Verfahren aktiviert der VOP-Treiber BT.656/BT.1120 und stellt die entsprechende Pinzuordnung ein.

### 4.2 Timing-Konfiguration

Es gibt drei Verfahren zur Timing-Konfiguration. Erstens: Bei einem Produkt mit fester Auflösung wird das Timing im DTS-Panel-Knoten konfiguriert. Beispiel für progressive Abtastung:

```text
 timing_1080p: timing-1080p {
    clock-frequency = <148500000>;

    hactive = <1920>;
    vactive = <1080>;
    hback-porch = <100>;
    hfront-porch = <200>;
    vback-porch = <10>;
    vfront-porch = <10>;
    hsync-len = <20>;
    vsync-len = <20>;
    hsync-active = <0>;
    vsync-active = <0>;
    de-active = <0>;
    pixelclk-active = <0>;
 };
```

Beispiel für Zeilensprungabtastung:

```text
 timing_ntsc: timing-ntsc {
    clock-frequency = <13500000>;
    hactive = <720>;

    vactive = <480>;
    hback-porch = <43>;
    hfront-porch = <33>;
    vback-porch = <36>;
    vfront-porch = <3>;
    hsync-len = <62>;
    vsync-len = <6>;
    hsync-active = <0>;
    vsync-active = <0>;
    de-active = <0>;
    pixelclk-active = <0>;
    interlaced;

    doubleclk; //only NTSC(480i60) mode and PAL(576i50) mode need this property
 };
```

Zweitens: EDID lesen. Unterstützt das Display mehrere Auflösungen und stellt EDID bereit, orientieren Sie sich am sii902x-Treiber und lesen Sie EDID über DDC/I2C aus, um die unterstützten Modi zu ermitteln.

```text
 //dts
 &i2c3 {
    clock-frequency = <400000>;
    status = "okay";

    sii9022: sii9022@39 {
       compatible = "sil,sii9022";
       reg = <0x39>;
       pinctrl-names = "default";
       ……
       ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
            reg = <0>;
            sii9022_in_rgb: endpoint {
               remote-endpoint = <&rgb_out_sii9022>;

            };
          };
       };
    };
 };

 &rgb {
    status = "okay";
    ……
    ports {
       port@1 {
          reg = <1>;
          #address-cells = <1>;

          #size-cells = <0>;

          rgb_out_sii9022: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&sii9022_in_rgb>;
          };
       };
    };
 };

 //drivers/gpu/drm/bridge/sii902x.c
 static int sii902x_probe(struct i2c_client *client, const struct i2c_device_id *id)

 {
    ……
    i2c_set_clientdata(client, sii902x);
    sii902x->i2cmux =
    i2c_mux_alloc(client->adapter, dev, 1, 0, I2C_MUX_GATE, sii902x_i2c_bypass_select,
 sii902x_i2c_bypass_deselect);
    if (!sii902x->i2cmux)
       return -ENOMEM;
    sii902x->i2cmux->priv = sii902x;
    return i2c_mux_add_adapter(sii902x->i2cmux, 0, 0, 0);
    ……
 }
 static int sii902x_get_modes(struct drm_connector *connector)
 {
    struct sii902x *sii902x = connector_to_sii902x(connector);


    edid = drm_get_edid(connector, sii902x->i2cmux->adapter[0]);
    drm_connector_update_edid_property(connector, edid);
    if (edid) {
       if (drm_detect_hdmi_monitor(edid))
          output_mode = SII902X_SYS_CTRL_OUTPUT_HDMI;
       num = drm_add_edid_modes(connector, edid);
       kfree(edid);
    }
 }
```

Drittens: Modi im Connector-Treiber definieren. Dies ist bei der Fehlersuche hilfreich oder wenn mehrere Auflösungen ohne I2C-/DDC-Kanal benötigt werden. Beispiel aus sii902x.c:

```text
 static int sii902x_get_modes(struct drm_connector *connector)
 {

    struct sii902x *sii902x = connector_to_sii902x(connector);

    ……
    for (i = 0; i < ARRAY_SIZE(sii902x_default_modes); i++) {
       const struct drm_display_mode *ptr = &sii902x_default_modes[i];

       mode = drm_mode_duplicate(connector->dev, ptr);
       if (mode) {
          if (!i)
            mode->type = DRM_MODE_TYPE_PREFERRED;
          drm_mode_probed_add(connector, mode);
          ret++;
       }

    }
    ……
 }
```

## 5. Häufig gestellte Fragen

### 5.1 Voller oder begrenzter Wertebereich?

Die Ausgabe verwendet den begrenzten Wertebereich: Aktive Bilddaten liegen in `[16, 235]`; nur Timing-Referenzcodes dürfen `0xFF, 0x00` enthalten.

### 5.2 Wie lässt sich die konfigurierte Ausgabe prüfen?

Führen Sie `cat /sys/kernel/debug/dri/0/summary` aus, prüfen Sie `bus_format` unter VOP/VP und vergleichen Sie den Wert mit den Tabellen in Abschnitt 3. Ausgabebeispiel aus der Quelle:

```text
 cat /sys/kernel/debug/dri/0/summary
    Video Port0: ACTIVE

    ……
    bus_format[2025]: YUV8_1X24
    ……
```

### 5.3 Entsprechen die Signale den Standards?

Die Quelle bejaht dies: Das Design basiert auf Rec. ITU-R BT.656 und Rec. ITU-R BT.1120. Für diesen Artikel wurde jedoch keine unabhängige Konformitätsprüfung durchgeführt; beachten Sie außerdem die Unterschiede bei den Austastdaten in §5.12.

### 5.4 Triggerung auf einer oder beiden Flanken?

Es wird auf einer Flanke getriggert. Standardmäßig liegt die steigende Taktflanke in der Datenmitte. Benötigt der Empfänger dort die fallende Flanke, setzen Sie `pixelclk-active` in DTS auf `1`.

### 5.5 DTS-Referenzdateien

```text
BT.656: arch/arm64/boot/dts/rockchip/rk3568-evb6-ddr3-v10-rk630-bt656-to-cvbs.dts
BT.1120: arch/arm64/boot/dts/rockchip/rk3568-evb2-lp4x-v10-bt1120-to-hdmi.dts
```

### 5.6 Wie werden Wandler anderer Hersteller angesteuert?

Funktioniert der Wandler nach dem Einschalten ohne Registerprogrammierung, konfigurieren Sie GPIOs und Versorgungen im DTS-Panel-Knoten und stellen Sie die korrekte Stromversorgung sicher. Ein zusätzlicher Treiber ist nicht erforderlich; `rockchip_rgb.c` registriert DRM-Encoder und -Connector.

Ist Registerprogrammierung erforderlich, konfigurieren Sie GPIOs und Versorgungen in DTS und implementieren Sie einen Wandler-Treiber. `rockchip_rgb.c` registriert den Encoder; der Wandler-Treiber registriert den Connector, der über eine DRM-Bridge verbunden wird. Siehe `drivers/gpu/drm/bridge/sii902x.c`.

### 5.7 Wie wird RK628 BT.1120 verwendet?

Die Quelle verweist auf `Rockchip_DRM_RK628_Porting_Guide_CN`.

### 5.8 Zusammenhang mit BT.656/BT.1120 bei Kameras

Dieser Leitfaden behandelt die parallelen Ausgänge BT.656 TX/BT.1120 TX. Kameraschnittstellen sind parallele Eingänge BT.656 RX/BT.1120 RX. Sie verwenden dieselben Protokolle; RX-Entwicklungsdokumente müssen über den technischen Support des Herstellers oder das ISP-Team bezogen werden und liegen außerhalb dieses TX-Leitfadens.

### 5.9 Zusammenhang mit VOP

BT.656/BT.1120 sind parallele Ausgänge mit eingebetteter Synchronisation. VOP setzt mehrere Ebenen (Puffer) zusammen und sendet das Ergebnis über diese Schnittstellen.

### 5.10 Zusammenhang mit RGB

BT.656/BT.1120 verwenden eingebettete Synchronisation; RGB besitzt separate HSYNC-/VSYNC-/DEN-Signale. Es sind unabhängige Anzeigeschnittstellen ohne direkten Zusammenhang innerhalb der Anzeigepipeline, obwohl ihre IO-Pins multiplexiert sein können.

### 5.11 Sind HSYNC/VSYNC/DEN an externe IOs herausgeführt?

- RV1126/RV1109/RK3562/RK3576: Alle Signale sind herausgeführt; die Daten folgen den Synchronisationssignalen mit 1 Taktzyklus Verzögerung.
- RV1126B: Alle Signale sind herausgeführt. BT.1120-Daten sind synchron; BT.656-Daten folgen mit 2 Taktzyklen Verzögerung.
- RK3566/RK3568/RK3588: Keines der Signale ist herausgeführt.
- RV1103/RV1106/RK3506: Alle Signale sind herausgeführt; die Daten sind synchron.

### 5.12 Austastdaten

Bei RV1126/RK3566/RK3568/RK3588 lauten die BT.656-Austastdaten `0x80 0x10 0x80 0x10`; sowohl der Y- als auch der UV-Kanal von BT.1120 verwenden ebenfalls `0x80 0x10 0x80 0x10`. Die Quelle weist ausdrücklich darauf hin, dass diese BT.1120-Austastdaten vom Protokoll abweichen und bei empfindlichen Empfängern Anzeigeprobleme verursachen können.

Auf anderen Plattformen lauten die BT.656-Austastdaten `0x80 0x10 0x80 0x10`; BT.1120 verwendet `0x80` auf Y und `0x10` auf UV. Diese Quellwerte bleiben erhalten, ohne Y/UV zu vertauschen.

## Redaktionelle Hinweise

Das kleingeschriebene x in `MEDIA_BUS_FMT_UYVY8_1x16`, das wiederholte Makro im DTS-Panel-Beispiel und die Ausgabe `YUV8_1X24` in §5.2 bleiben wie in der Quelle erhalten. Prüfen Sie diese Angaben anhand der tatsächlichen Kernel-Bindings und Treiber. Die Y-/UV-Werte in §5.12 und die Beschreibungen der Halbbildnummern in §1.3 dürfen nicht stillschweigend geändert werden. [Vollständiges Prüfprotokoll](/docs/rockchip-bt656-bt1120/EDITORIAL-NOTES.md).
