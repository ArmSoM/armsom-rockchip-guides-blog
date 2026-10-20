---
title: "Rockchip MIPI DSI2: Entwickleranleitung für Panels, DSC, Protokoll und Signaldiagnose"
description: "Vollständige RK3576/RK3588-MIPI-DSI2-Referenz: D/C-PHY, DSC/PPS, Panel-Konfiguration, Ein-/Zweikanalbetrieb, Protokollwellenformen, häufige Fragen, Treiberpatch und Signalparameter."
translation_key: "050-rockchip-mipi-dsi2"
slug: "050-rockchip-mipi-dsi2"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["Rockchip", "RK3576", "RK3588", "MIPI DSI2"]
excerpt: "Vollständige RK3576/RK3588-MIPI-DSI2-Referenz: D/C-PHY, DSC/PPS, Panel-Konfiguration, Ein-/Zweikanalbetrieb, Protokollwellenformen, häufige Fragen, Treiberpatch und Signalparameter."
---

{% raw %}

# Rockchip MIPI DSI2: Entwickleranleitung für Panels, DSC, Protokoll und Signaldiagnose

Diese vollständige Referenz folgt der 74-seitigen chinesischen Quelle V2.3.0, vollständig ins Englische und Russische übersetzt; Deutsch folgt der geprüften englischen Aufbereitung. Ein entsprechendes englisches PDF wurde nicht bereitgestellt; alle Fassungen verwenden die chinesischen Originalabbildungen mit ihren eingebetteten Beschriftungen. Dies ist eine ArmSoM-Plattformreferenz. Die Quelle umfasst RK3576 mit Kernel 6.1 sowie RK3588 mit Kernel 5.10/6.1. Prüfen Sie tatsächliches Board, SDK/BSP, Panel, Einschaltsequenz und Schnittstellenverdrahtung. Es erfolgte keine Hardwareprüfung auf Board-Ebene; allgemeine Unterstützung aller ArmSoM-Boards wird nicht behauptet.

Beispiele, Wellenformen und Messungen stammen aus dem Quelldokument, nicht aus ArmSoM-Tests. Registerzugriffe, Änderungen an PHY-Spannung/Timing und Patches können Anzeige oder System stören; es wurden keine Hardwarebefehle ausgeführt. Code, Kommentare, Befehle und Parameter bleiben im Quelltext erhalten; Widersprüche werden nicht stillschweigend korrigiert.

[Redaktionelle Hinweise](/docs/rockchip-mipi-dsi2/EDITORIAL-NOTES.md) · [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.6, block 0 -->

## 1. Einführung

<!-- Source CN PDF p.6, block 1 -->

DSI-2 gehört zu den Kommunikationsprotokollen der MIPI Alliance. DWC-MIPI-DSI2 ist ein digitaler Controller-Kern, der sämtliche in der MIPI-DSI2-Spezifikation definierten Protokollfunktionen umsetzt. Er unterstützt die physikalischen Schnittstellen D-PHY und C-PHY sowie zwei Datenpfade für Display Stream Compression (DSC).

<!-- Source CN PDF p.6, block 2 -->

![Technische Originalabbildung — PDF S.6](/docs/rockchip-mipi-dsi2/assets/cn-p06-figure1.png)

<!-- Source CN PDF p.6, block 3 -->

## 2. MIPI-DSI2-Funktionen

<!-- Source CN PDF p.6, block 4 -->

1\. MIPI® Alliance-Spezifikation Display Serial Interface 2 (DSI-2), Version 1.1

<!-- Source CN PDF p.6, block 5 -->

2\. MIPI® Alliance-Spezifikation Display Command Set (DCS), Version 1.4

<!-- Source CN PDF p.6, block 6 -->

3\. MIPI® Alliance-Spezifikation D-PHY v2.0

<!-- Source CN PDF p.6, block 7 -->

4\. MIPI® Alliance-Spezifikation C-PHY v1.1

<!-- Source CN PDF p.6, block 8 -->

5\. Vier Daten-Lanes bei D-PHY und drei Daten-Trios bei C-PHY

<!-- Source CN PDF p.6, block 9 -->

6\. Bidirektionale Kommunikation und Escape-Modus über Daten-Lane 0

<!-- Source CN PDF p.6, block 10 -->

7\. Kontinuierlicher und nichtkontinuierlicher Takt bei D-PHY sowie nichtkontinuierlicher Takt bei C-PHY

<!-- Source CN PDF p.6, block 11 -->

8\. End-of-Transmission-Paket (EoTp)

<!-- Source CN PDF p.6, block 12 -->

9\. Scrambling

<!-- Source CN PDF p.6, block 13 -->

10\. VESA DSC 1.1/1.2a

<!-- Source CN PDF p.6, block 14 -->

11\. Bis 4.5 Gbps je Lane bei D-PHY

<!-- Source CN PDF p.6, block 15 -->

12\. Bis 2.0 Gsps je Trio bei C-PHY

<!-- Source CN PDF p.7, block 16 -->

## 3. Unterschiede zwischen den DSI-Schnittstellen von RK3576 und RK3588

<!-- Source CN PDF p.7, block 17 -->

| Merkmal | RK3576 | RK3588 |
|---|---|---|
| Zweikanalbetrieb | Nicht unterstützt | Unterstützt |
| Maximale Auflösung | 2560x1600@60Hz | 4096x2304@60Hz |
| Daten-Lanes | 1/2/4 Lanes | 1/2/4/8 Lanes |
| Maximale Lane-Rate | D-PHY: 2.5Gbps/lane<br>C-PHY: 1.7Gsps/lane | D-PHY: 4.5Gbps/lane<br>C-PHY: 2.0Gsps/lane |
| Farbformat | RGB | RGB |
| Maximale Farbtiefe | 10 Bit | 10 Bit |
| DSC | Nicht unterstützt | Unterstützt VESA DSC 1.1/1.2a |
| C-PHY | Unterstützt | Unterstützt |

<!-- Source CN PDF p.7, block 18 -->

## 4. Unterschiede zwischen MIPI DSI-2 Host und MIPI DSI Host

<!-- Source CN PDF p.7, block 19 -->

MIPI DSI-2 unterstützt alle Funktionen des MIPI-DSI-Protokolls und zusätzlich MIPI C-PHY.

<!-- Source CN PDF p.7, block 20 -->

![Technische Originalabbildung — PDF S.7](/docs/rockchip-mipi-dsi2/assets/cn-p07-figure1.png)

Editierbare Abschrift der Originalabbildung:

| DSI | D-PHY 1.01 | D-PHY 1.1 | D-PHY 1.2 | D-PHY 2.0 | C-PHY 1.0 |
|---|---|---|---|---|---|
| DSI 1.0 | Ja | Ja | Ja | Ja | Nein |
| DSI 1.1 | Ja | Ja | Ja | Ja | Nein |
| DSI 1.2 | Ja | Ja | Ja | Ja | Nein |
| DSI 1.3 | Ja | Ja | Ja | Ja | Nein |
| DSI-2 1.0 | Ja | Ja | Ja | Ja | Ja |

<!-- Source CN PDF p.7, block 21 -->

## 5. Unterschiede bei MIPI DPHY

<!-- Source CN PDF p.7, block 22 -->

Die MIPI-DPHY-Version von RK3588 unterscheidet sich von früheren Plattformen und unterstützt bis 4.5 Gbps Bandbreite.

<!-- Source CN PDF p.8, block 23 -->

![Technische Originalabbildung — PDF S.8](/docs/rockchip-mipi-dsi2/assets/cn-p08-figure1.png)

<!-- Source CN PDF p.8, block 24 -->

## 6. Anwendungen

<!-- Source CN PDF p.8, block 25 -->

MIPI DSI verwendet differentielle Signalübertragung, um Pinanzahl und Hardwarekomplexität bei guter Hardwarekompatibilität zu reduzieren. MIPI-DSI-basierte IP zeichnet sich außerdem durch geringen Energieverbrauch und geringe elektromagnetische Störungen aus.

<!-- Source CN PDF p.8, block 26 -->

Die folgende Abbildung zeigt Anwendungsbereiche.

<!-- Source CN PDF p.8, block 27 -->

![Technische Originalabbildung — PDF S.8](/docs/rockchip-mipi-dsi2/assets/cn-p08-figure2.png)

<!-- Source CN PDF p.8, block 28 -->

## 7. Treibercode

<!-- Source CN PDF p.8, block 29 -->

### 7.1 U-Boot

<!-- Source CN PDF p.8, block 30 -->

#### 7.1.1 Treiberpfad

<!-- Source CN PDF p.9, block 31 -->

```text
drivers/video/drm/dw_mipi_dsi2.c
drivers/video/drm/samsung_mipi_dcphy.c
```

<!-- Source CN PDF p.9, block 32 -->

#### 7.1.2 Treiberkonfiguration

<!-- Source CN PDF p.9, block 33 -->

```text
CONFIG_DRM_ROCKCHIP_DW_MIPI_DSI2=y
CONFIG_DRM_ROCKCHIP_SAMSUNG_MIPI_DCPHY=y
```

<!-- Source CN PDF p.9, block 34 -->

### 7.2 Kernel

<!-- Source CN PDF p.9, block 35 -->

#### 7.2.1 Treiberpfad

<!-- Source CN PDF p.9, block 36 -->

```text
MIPI DSI-2 host controller:
drivers/gpu/drm/rockchip/dw-mipi-dsi2-rockchip.c
MIPI DCPHY:
drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
```

<!-- Source CN PDF p.9, block 37 -->

#### 7.2.2 Treiberkonfiguration

<!-- Source CN PDF p.9, block 38 -->

```text
cONFIG_ROCKCHIP_DW_MIPI_DSI=y
CONFIG_PHY_ROCKCHIP_SAMSUNG_DCPHY=y
```

<!-- Source CN PDF p.9, block 39 -->

#### 7.2.3 Referenz-Device-Trees

<!-- Source CN PDF p.9, block 40 -->

DTS-Pfade:

<!-- Source CN PDF p.9, block 41 -->

```text
arch/arm64/boot/dts/rockchip/rk3588-evb.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb2-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb3-lp5.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb4-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb2-lp5.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb4-lp4x.dtsi
```

<!-- Source CN PDF p.9, block 42 -->

DTS-Konfigurationsszenarien:

<!-- Source CN PDF p.10, block 43 -->

```text
rk3588-evb1: dsi0->dphy->1080p_panel && dsi1->dphy->1080p_panel;
rk3588-evb2: dsi1->dphy->1080p_panel;
rk3588-evb3: dsi0->dphy->1080p_panel && dsi1->cphy->cphy_panel;
rk3588-evb4: dsi0->dphy->1080p_panel;
rk3588s-evb1: dsi0->dphy->1080p_panel && dsi1->dphy->cmd_no_dsc_panel;
rk3588s-evb2: dsi0->cphy->cphy_panel & dsi1->dphy->1080p_panel;
rk3588s-evb4: dsi0->dphy->1080p_panel && dsi1->dphy->cmd_dsc_panel;
```

<!-- Source CN PDF p.10, block 44 -->

## 8. DSI-Controller und Panel konfigurieren

<!-- Source CN PDF p.10, block 45 -->

### 8.1 DTS-Konfiguration

<!-- Source CN PDF p.10, block 46 -->

```text
&dsi0 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
};
&dsi0_panel {
    status = "okay";
    compatible = "simple-panel-dsi";
    reg = <0>;
    power-supply = <&vcc3v3_lcd_n>;
    backlight = <&backlight>;
    reset-gpios = <&gpio2 RK_PB4 GPIO_ACTIVE_LOW>;
    reset-delay-ms = <10>;
    enable-delay-ms = <10>;
    prepare-delay-ms = <10>;
    unprepare-delay-ms = <10>;
    disable-delay-ms = <60>;
    dsi,flags = <(MIPI_DSI_MODE_VIDEO | MIPI_DSI_MODE_VIDEO_BURST |
        MIPI_DSI_MODE_LPM | MIPI_DSI_MODE_EOT_PACKET)>;
    dsi,format = <MIPI_DSI_FMT_RGB888>;
    dsi,lanes = <4>;
    //phy-c-option;
    //compressed-data;
    //slice-width = <720>;
    //slice-height = <65>;
    //version-major = <1>;
    //version-minor = <1>;
    panel-init-sequence = [
        ...
        05 78 01 11
        05 00 01 29
    ];
    panel-exit-sequence = [
        05 00 01 28
        05 00 01 10
    ];
    disp_timings0: display-timings {
        native-mode = <&dsi0_timing0>;
        dsi0_timing0: timing0 {
            clock-frequency = <132000000>;
            hactive = <1080>;
            vactive = <1920>;
            hfront-porch = <15>;
            hsync-len = <4>;
            hback-porch = <30>;
            vfront-porch = <15>;
            vsync-len = <2>;
            vback-porch = <15>;
            hsync-active = <0>;
            vsync-active = <0>;
            de-active = <0>;
            pixelclk-active = <0>;
        };
    };
};
```

<!-- Source CN PDF p.11, block 48 -->

### 8.2 Konfigurationsdetails

<!-- Source CN PDF p.11, block 49 -->

#### 8.2.1 Allgemeine Konfiguration

<!-- Source CN PDF p.11, block 50 -->

| Eigenschaft | Beschreibung | Wert |
|---|---|---|
| rockchip,lane-rate | MIPI-Lane-Rate manuell festlegen | Unterstützte Einheiten:<br>D-PHY: Mbps/lane oder Kbps/lane<br>C-PHY: Msps/lane oder Ksps/lane<br>Für 800Mbps: rockchip,lane-rate = &lt;800&gt;; oder rockchip,lane-rate = &lt;800000&gt;; |
| auto-calculation | Auto-Calculation-Modus aktivieren | Zeichenfolge vom booleschen Typ (Formulierung der Quelle) |
| disable-hold-mode | Frame-Aktualisierungen ohne TE-Konfiguration erlauben | Zeichenfolge vom booleschen Typ (Formulierung der Quelle) |
| support-psr | PSR aktivieren | Zeichenfolge vom booleschen Typ (Formulierung der Quelle) |
| compatible | compatible | simple-panel-dsi |
| power-supply | Panelversorgung [optional] | Referenz auf den zugehörigen Spannungsregler |
| backlight | Hintergrundbeleuchtung | Referenz auf die Hintergrundbeleuchtung |
| enable-gpios | GPIO zur Panelaktivierung [optional] | GPIO-Referenz |
| reset-gpios | GPIO für Panel-Reset | GPIO-Referenz |
| reset-delay-ms | Verzögerung der<br>Panel-Sequenz | Siehe Panel-Spezifikation |
| enable-delay-ms | Verzögerung der<br>Panel-Sequenz | Siehe Panel-Spezifikation |
| prepare-delay-ms | Verzögerung der<br>Panel-Sequenz | Siehe Panel-Spezifikation |
| unprepare-delay-ms | Verzögerung der<br>Panel-Sequenz | Siehe Panel-Spezifikation |
| disable-delay-ms | Verzögerung der<br>Panel-Sequenz | Siehe Panel-Spezifikation |
| dsi,flags | DSI2-Betriebsmodus | Befehlsmodus:<br>MIPI_DSI_MODE_LPM \|<br>MIPI_DSI_MODE_EOT_PACKET |
| dsi,flags | DSI2-Betriebsmodus | Videomodus:<br>MIPI_DSI_MODE_VIDEO \|<br>MIPI_DSI_MODE_VIDEO_BURST \|<br>MIPI_DSI_MODE_LPM \|<br>MIPI_DSI_MODE_EOT_PACKET |
| dsi,format | Pixeldatenformat | MIPI_DSI_FMT_RGB888 |
| dsi,format | Pixeldatenformat | MIPI_DSI_FMT_RGB666 |
| dsi,format | Pixeldatenformat | MIPI_DSI_FMT_RGB666_PACKED |
| dsi,format | Pixeldatenformat | MIPI_DSI_FMT_RGB565 |
| dsi,lanes | Anzahl der MIPI-Daten-Lanes | 1/2/3 Trios [cphy] |
| dsi,lanes | Anzahl der MIPI-Daten-Lanes | 6 Trios [Zweikanal-CPHY] |
| dsi,lanes | Anzahl der MIPI-Daten-Lanes | 1/2/3/4 Lanes [dphy] |
| dsi,lanes | Anzahl der MIPI-Daten-Lanes | 8 Lanes [Zweikanal-DPHY] |
| phy-c-option | C-PHY-Panel [Option] | Zeichenfolge vom booleschen Typ (Formulierung der Quelle) |
| compressed-data | Panel mit DSC [optional] | Zeichenfolge vom booleschen Typ (Formulierung der Quelle) |
| slice-width | DSC-Slice-Breite [optional] | Siehe Panel-Spezifikation |
| slice-height | DSC-Slice-Höhe [optional] | Siehe Panel-Spezifikation |
| version-major | DSC-Version [optional] | Siehe Panel-Spezifikation |
| version-minor | DSC-Version [optional] | Siehe Panel-Spezifikation |
| panel-init-sequence | Initialisierungssequenz beim Einschalten des Panels | [hex]<br>data_type delay_ms payload_lenth payload |
| panel-exit-sequence | Ausschaltsequenz des Panels | [hex]<br>data_type delay_ms payload_lenth payload |
| display-timing | Panel-Timing | Siehe Panel-Spezifikation |

<!-- Source CN PDF p.13, block 53 -->

#### 8.2.2 Anzeige-Timing

<!-- Source CN PDF p.13, block 54 -->

![Technische Originalabbildung — PDF S.13](/docs/rockchip-mipi-dsi2/assets/cn-p13-figure1.png)

<!-- Source CN PDF p.13, block 55 -->

#### 8.2.3 dsi,flags

<!-- Source CN PDF p.13, block 56 -->

##### 8.2.3.1 Taktart

<!-- Source CN PDF p.13, block 57 -->

Abschnitt 5.6.1 „Clock Requirements“ der MIPI-DSI-Spezifikation verlangt, dass jeder DSI-Sender und -Empfänger kontinuierlichen Taktbetrieb auf der Clock-Lane unterstützt; nichtkontinuierlicher Betrieb ist optional. Daher bestimmen die Anforderungen der Peripherie, ob die Clock-Lane einer Displayanwendung kontinuierlich oder nichtkontinuierlich arbeitet.

<!-- Source CN PDF p.13, block 58 -->

Standardmäßig arbeitet die MIPI-DPHY-Clock-Lane kontinuierlich; Master und Slave eines DSI-Anzeigesystems unterstützen dies. Benötigt die Peripherie den Host-Takt, muss die Clock-Lane wie nachfolgend gezeigt kontinuierlich betrieben werden.

<!-- Source CN PDF p.14, block 59 -->

![Technische Originalabbildung — PDF S.14](/docs/rockchip-mipi-dsi2/assets/cn-p14-figure1.png)

<!-- Source CN PDF p.14, block 60 -->

Ist Energieeinsparung wichtig, insbesondere während der Übertragung, vermeidet nichtkontinuierlicher Takt unnötigen Verbrauch ohne Datenübertragungsbedarf. Ergänzen Sie MIPI_DSI_CLOCK_NON_CONTINUOUS in dsi,flags, um die MIPI-DPHY-Clock-Lane wie gezeigt nichtkontinuierlich zu betreiben.

<!-- Source CN PDF p.14, block 61 -->

![Technische Originalabbildung — PDF S.14](/docs/rockchip-mipi-dsi2/assets/cn-p14-figure2.png)

<!-- Source CN PDF p.14, block 62 -->

##### 8.2.3.2 Eotp

<!-- Source CN PDF p.14, block 63 -->

DSI-Spezifikation V1.0 und ältere Versionen unterstützen Eotp nicht. Geräte nach neueren Spezifikationen müssen Eotp erzeugen und erkennen können. Die Quelle bezeichnet die RK3588/RK3576-DSI-Version hier als V2.0. Für die Zusammenarbeit mit älteren Geräten muss der Host Erzeugung und Erkennung ein- oder ausschalten können. Ob Eotp aktiviert wird, richtet sich letztlich nach der Panel-Unterstützung.

<!-- Source CN PDF p.14, block 64 -->

Eotp ist ein Kurzpaket, das das Ende der Hochgeschwindigkeitsübertragung auf der Datenverbindung kennzeichnet. Es soll vor allem deren Robustheit verbessern; im LP-Modus muss DSI daher kein Eotp senden.

<!-- Source CN PDF p.15, block 65 -->

Anders als andere DSI-Pakete besitzt Eotp ein festes Format:

<!-- Source CN PDF p.15, block 66 -->

```text
Data Type = DI [5:0] = 0b001000
Virtual Channel = DI [7:6] = 0b00
Payload Data [15:0] = 0x0F0F
ECC [7:0] = 0x01
```

<!-- Source CN PDF p.15, block 67 -->

MIPI_DSI_MODE_EOT_PACKET in dsi,flags steuert, ob der SoC-MIPI-DSI-TX im Hochgeschwindigkeitsmodus Eotp sendet. Die folgende Wellenform zeigt Eotp im HSDT-Modus.

<!-- Source CN PDF p.15, block 68 -->

![Technische Originalabbildung — PDF S.15](/docs/rockchip-mipi-dsi2/assets/cn-p15-figure1.png)

<!-- Source CN PDF p.15, block 69 -->

##### 8.2.3.3 BLANK_HS_EN

<!-- Source CN PDF p.15, block 70 -->

Auf einer Daten-Lane enthält eine Zeile normalerweise zwei LP11-Austastintervalle, wie nachfolgend gezeigt.

<!-- Source CN PDF p.15, block 71 -->

![Technische Originalabbildung — PDF S.15](/docs/rockchip-mipi-dsi2/assets/cn-p15-figure2.png)

<!-- Source CN PDF p.16, block 72 -->

Manche Anzeigemodule oder externen MIPI-Bridge-Chips unterstützen keine zwei LP-11-Intervalle während Hblank. Ergänzen Sie BLK_HFP_HS_EN oder BLK_HBP_HS_EN in dsi,flags, damit HFP beziehungsweise HBP im Hochgeschwindigkeitsmodus bleibt.

<!-- Source CN PDF p.16, block 73 -->

![Technische Originalabbildung — PDF S.16](/docs/rockchip-mipi-dsi2/assets/cn-p16-figure1.png)

<!-- Source CN PDF p.16, block 74 -->

#### 8.2.4 Einschaltsequenz des Panels

<!-- Source CN PDF p.16, block 75 -->

![Technische Originalabbildung — PDF S.16](/docs/rockchip-mipi-dsi2/assets/cn-p16-figure2.png)

<!-- Source CN PDF p.17, block 76 -->

#### 8.2.5 Ausschaltsequenz des Panels

<!-- Source CN PDF p.17, block 77 -->

![Technische Originalabbildung — PDF S.17](/docs/rockchip-mipi-dsi2/assets/cn-p17-figure1.png)

<!-- Source CN PDF p.17, block 78 -->

#### 8.2.6 Übliche Datentypen der Initialisierungssequenz

<!-- Source CN PDF p.17, block 79 -->

| Datentyp | Beschreibung | Paketgröße |
|---|---|---|
| 0x03 | Generisches kurzes WRITE, ohne Parameter | Kurz |
| 0x13 | Generisches kurzes WRITE, 1 Parameter | Kurz |
| 0x23 | Generisches kurzes WRITE, 2 Parameter | Kurz |
| 0x29 | Generisches langes WRITE | Lang |
| 0x05 | Kurzes DCS-WRITE, ohne Parameter | Kurz |
| 0x15 | Kurzes DCS-WRITE, 1 Parameter | Kurz |
| 0x07 | Kurzes DCS-WRITE, 1 Parameter, DSC EN | Kurz |
| 0x0a | Langes DCS-WRITE, PPS, 128 Byte | Lang |

<!-- Source CN PDF p.18, block 80 -->

## 9. Timing im DSI-Videomodus

<!-- Source CN PDF p.18, block 81 -->

![Technische Originalabbildung — PDF S.18](/docs/rockchip-mipi-dsi2/assets/cn-p18-figure1.png)

<!-- Source CN PDF p.18, block 82 -->

## 10. Bandbreite

<!-- Source CN PDF p.18, block 83 -->

Der MIPI-DSI-Treiber berechnet die Bandbreite für jeden Betriebsmodus automatisch anhand folgender Formeln. Bei der Fehlersuche können Sie das Ergebnis mit rockchip,lane-rate im DTS-dsi-Knoten feinabstimmen. Einheiten sind Kbps/Mbps für D-PHY beziehungsweise Ksps/Msps für C-PHY. Die Beispiele zeigen, dass RK3588-MIPI-DSI-DPHY 4K@60 ohne DSC unterstützt, während CPHY seine maximale Bandbreite geringfügig überschreitet.

<!-- Source CN PDF p.19, block 84 -->

![Technische Originalabbildung — PDF S.19](/docs/rockchip-mipi-dsi2/assets/cn-p19-figure1.png)

Editierbare Abschrift der Originalabbildung:

| Parameter | Wert |
|---|---|
| Auflösung | 3840x2160 |
| hact / hfp / hsync / hbp | 3840 / 176 / 88 / 296 |
| vact / vfp / vsync / vbp | 2160 / 8 / 10 / 72 |
| bpp / lanes | 24 / 4 |

```text
Htotal = hact + hfp + hsync + hbp = 4400
Vtotal = vact + vfp + vsync + vbp = 2250
Pixel-CLK = Htotal * Vtotal * framerate = 4400 * 2250 * 60
D-PHY Video Burst: BW = Htotal * Vtotal * framerate * BPP * 10 / lanes / 9
= 4400 * 2250 * 60 * 24 * 10 / 4 / 9 = 3.96 Gbps
D-PHY Non Burst Sync Pulse/Event: BW = Htotal * Vtotal * framerate * BPP / lanes
= 4400 * 2250 * 60 * 24 / 4 = 3.57 Gbps
C-PHY Video Burst: BW = Htotal * Vtotal * framerate * BPP * 10 / lanes / 9 / 2.28
= 4450 * 2250 * 60 * 24 * 10 / 3 / 9 / 2.28 = 2.32 Gbps
C-PHY Non Burst Sync Pulse/Event: BW = Htotal * Vtotal * framerate * BPP / lanes / 2.28
= 4450 * 2250 * 60 * 24 / 3 / 2.28 = 2.11 Gbps
```

Die ursprünglichen C-PHY-Einsetzungen verwenden 4450 statt Htotal=4400. Die Ergebniseinheit lautet Gbps, während der Text für C-PHY Gsps verwendet. Beide Abweichungen bleiben erhalten; es handelt sich weder um Messwerte noch um korrigierte Berechnungen.

<!-- Source CN PDF p.19, block 85 -->

## 11. DSC

<!-- Source CN PDF p.19, block 86 -->

DSC steht für Display Stream Compression. Das folgende Diagramm zeigt ein vollständiges DSC-System im Echtzeitbetrieb. Unkomprimierte Pixel gelangen in Rasterabtastreihenfolge in den Encoder; dessen Bitstrom wird in Echtzeit über die Displayverbindung zum Decoder übertragen. Dieser rekonstruiert die Videopixel und sendet sie an das Anzeigemodul. Das decodierte Bild hat dasselbe Datenformat wie das Eingangssignal des Encoders. RK3588 besitzt zwei DSC-Encoder, die hochauflösende Inhalte mit niedriger Bandbreite und geringer Latenz übertragen und dadurch höher auflösende MIPI-DSI-Displays ermöglichen.

<!-- Source CN PDF p.19, block 87 -->

![Technische Originalabbildung — PDF S.19](/docs/rockchip-mipi-dsi2/assets/cn-p19-figure2.png)

<!-- Source CN PDF p.19, block 88 -->

### 11.1 Slice

<!-- Source CN PDF p.19, block 89 -->

Zur Beschleunigung der Codierung und Verringerung von Kompressionsverzerrungen teilt DSC jeden Frame in gleichzeitig codierte Slices. Unterstützt werden 1, 2, 4, 8 oder mehr Slices. Die Einheit ist Slices/Zeile; eine Zeile ist eine Rasterabtastzeile von Pixeln. Auch Slice-Breite und -Höhe können variieren. Die Beispiele rechts oben und rechts unten enthalten jeweils vier Slices je Zeile, oben als lange Streifen, unten als kürzere Rechtecke. Die Geometrie hängt von den unterstützten Slice-Anzahlen der DSC-Quelle und -Senke sowie ihren Kompressions-/Dekompressionsraten ab. RK3588 DSC0 unterstützt bis 8 Slices, DSC1 bis 2.

<!-- Source CN PDF p.20, block 90 -->

![Technische Originalabbildung — PDF S.20](/docs/rockchip-mipi-dsi2/assets/cn-p20-figure1.png)

<!-- Source CN PDF p.20, block 91 -->

Prüfen Sie mit folgenden Formeln, ob RK3588 DSC eine bestimmte Auflösung und Slice-Anzahl unterstützt:

<!-- Source CN PDF p.20, block 92 -->

```text
DSC_8K: active_slice_num * slice_width <= 960 * 8
DSC_4K: active_slice_num * slice_width <= 2048 * 2
```

<!-- Source CN PDF p.20, block 93 -->

### 11.2 DSC-Codierung

<!-- Source CN PDF p.20, block 94 -->

Vor der Kompression vereinbaren Quelle und Senke eine unterstützte Slice-Anzahl und teilen das Bild in gleich große Rasterbereiche. Ein Bild mit 3840x2160 kann bei Unterstützung von 8 Slices durch beide Geräte in vier Spalten und zwei Zeilen zerlegt werden. Besitzt der DSC-Encoder vier unabhängige parallele Kompressionskerne, lassen sich die links gezeigten acht Slices in vier Gruppen gleichzeitig komprimieren, um 4K-Inhalte mit niedriger Bandbreite und geringer Latenz zu übertragen.

<!-- Source CN PDF p.20, block 95 -->

![Technische Originalabbildung — PDF S.20](/docs/rockchip-mipi-dsi2/assets/cn-p20-figure2.png)

<!-- Source CN PDF p.21, block 96 -->

### 11.3 DSC-Bandbreite

<!-- Source CN PDF p.21, block 97 -->

Für 4Kp60 vergleicht folgende Tabelle die MIPI-D/C-PHY-Bandbreite vor und nach Aktivierung von DSC. DSC kann die benötigte Verbindungsbandbreite auf ein Drittel bis die Hälfte des unkomprimierten Bedarfs reduzieren.

<!-- Source CN PDF p.21, block 98 -->

![Technische Originalabbildung — PDF S.21](/docs/rockchip-mipi-dsi2/assets/cn-p21-figure1.png)

Editierbare Abschrift der Originalabbildung:

| 3840x2160 / 60Hz | 24-Bit-RGB | DSC 8-Bit-RGB |
|---|---|---|
| D-PHY Video Burst | 3.96 x 4 Gbps | 1.32 x 4 Gbps |
| C-PHY Video Burst | 2.32 x 3 Gsps | 0.774 x 3 Gsps |

<!-- Source CN PDF p.21, block 99 -->

Die folgenden Quellwellenformen wurden bei Ansteuerung eines 1440x3120p60-Anzeigemoduls mit 4 Lanes und DSC durch RK3588 MIPI DSI gemessen, einmal mit ursprünglicher Bandbreite und einmal mit deren Drittel.

<!-- Source CN PDF p.21, block 100 -->

![Technische Originalabbildung — PDF S.21](/docs/rockchip-mipi-dsi2/assets/cn-p21-figure2.png)

<!-- Source CN PDF p.21, block 101 -->

### 11.4 PPS

<!-- Source CN PDF p.21, block 102 -->

PPS umfasst 128 Byte. Die folgende Tabelle beschreibt wichtige Informationen für das DSC-System:

<!-- Source CN PDF p.21, block 103 -->

1\. DSC-Version;

<!-- Source CN PDF p.21, block 104 -->

2\. BPC vor DSC-Kompression;

<!-- Source CN PDF p.21, block 105 -->

3\. BPP nach DSC-Kompression;

<!-- Source CN PDF p.21, block 106 -->

4\. Breite und Höhe des ursprünglichen Eingangsbildes vor der Kompression;

<!-- Source CN PDF p.21, block 107 -->

5\. Breite und Höhe der DSC-Slices.

<!-- Source CN PDF p.22, block 108 -->

![Technische Originalabbildung — PDF S.22](/docs/rockchip-mipi-dsi2/assets/cn-p22-figure1.png)

Editierbare Abschrift der Originalabbildung:

PPS-Beispiel: 1600 × 2560, Slice 40. Nachfolgend werden alle vollständig sichtbaren Felder und PA1–PA31 übertragen; weitere, in der Quellabbildung nicht enthaltene PPS-Bytes werden nicht ergänzt.

| Feld | Dezimal | Hexadezimal |
| --- | --- | --- |
| force_reg_dsc_version_major[3:0] | 1 | 1 |
| force_reg_dsc_version_minor[3:0] | 1 | 1 |
| force_reg_pps_identifier[7:0] | 0 | 00 |
| force_reg_bits_per_component[3:0] | 8 | 8 |
| force_reg_linebuf_depth[3:0] | 9 | 9 |
| force_reg_block_pred_enable | 1 | 1 |
| force_reg_convert_rgb | 1 | 1 |
| force_reg_simple_422 | 0 | 0 |
| force_reg_vbr_enable | 0 | 0 |
| force_reg_bits_per_pixel[9:0] | 128 | 80 |
| force_reg_pic_height[15:0] | 2560 | 0A00 |
| force_reg_pic_width[15:0] | 1600 | 0640 |
| force_reg_slice_height[15:0] | 40 | 28 |
| force_reg_slice_width[15:0] | 1600 | 0640 |
| force_reg_chunk_size[15:0] | 1600 | 0640 |
| force_reg_initial_xmit_delay[9:0] | 512 | 0200 |
| force_reg_initial_dec_delay[15:0] | 1057 | 0421 |
| force_reg_initial_scale_value[5:0] | 32 | 0020 |
| force_reg_scale_inc_interval[15:0] | 1488 | 05D0 |
| force_reg_scale_dec_interval[11:0] | 22 | 0016 |
| force_reg_first_line_bpg_offset[4:0] | 12 | 0C |
| force_reg_nfl_bpg_offset[15:0] | 631 | 0277 |
| force_reg_slice_bpg_offset[15:0] | 218 | 00DA |
| force_reg_initial_offset[15:0] | 6144 | 1800 |
| force_reg_final_offset[15:0] | 4320 | 10E0 |
| force_reg_flatness_min_qp[4:0] | 3 | 03 |
| force_reg_flatness_max_qp[4:0] | 12 | 0C |

| PA | Hexadezimal | PPS |
| --- | --- | --- |
| PA1 | 11 | PPS1 |
| PA2 | 00 | PPS2 |
| PA3 | 00 | PPS3 |
| PA4 | 89 | PPS4 |
| PA5 | 30 | PPS5 |
| PA6 | 80 | PPS6 |
| PA7 | 0A | PPS7 |
| PA8 | 00 | PPS8 |
| PA9 | 06 | PPS9 |
| PA10 | 40 | PPS10 |
| PA11 | 00 | PPS11 |
| PA12 | 28 | PPS12 |
| PA13 | 06 | PPS13 |
| PA14 | 40 | PPS14 |
| PA15 | 06 | PPS15 |
| PA16 | 40 | PPS16 |
| PA17 | 02 | PPS17 |
| PA18 | 00 | PPS18 |
| PA19 | 04 | PPS19 |
| PA20 | 21 | PPS20 |
| PA21 | 00 | PPS21 |
| PA22 | 20 | PPS22 |
| PA23 | 05 | PPS23 |
| PA24 | D0 | PPS24 |
| PA25 | 00 | PPS25 |
| PA26 | 16 | PPS26 |
| PA27 | 00 | PPS27 |
| PA28 | 0C | PPS28 |
| PA29 | 02 | PPS29 |
| PA30 | 77 | PPS30 |
| PA31 | 00 | PPS31 |

<!-- Source CN PDF p.22, block 109 -->

### 11.5 Beispiele

<!-- Source CN PDF p.22, block 110 -->

#### 11.5.1 Wann DSC aktiviert werden sollte

<!-- Source CN PDF p.22, block 111 -->

Die folgenden, vom Kunden bereitgestellten Parameter eines Anzeigemoduls veranschaulichen, wann DSC in einem MIPI-DSI-Projekt aktiviert werden kann:

<!-- Source CN PDF p.22, block 112 -->

1\. Das Modul besitzt eine DPHY-Schnittstelle mit 4 Daten-Lanes und unterstützt bis 1Gbps/lane;

<!-- Source CN PDF p.22, block 113 -->

2\. Es verwendet Video-Burst-Modus; ursprüngliche Bandbreite: 1.866Gbps, 24-Bit-RGB, 60 Frames/s;

<!-- Source CN PDF p.22, block 114 -->

3\. Es unterstützt DSC mit 1 Slice;

<!-- Source CN PDF p.22, block 115 -->

4\. Seine Zielrate beträgt 676Mbps/lane.

<!-- Source CN PDF p.23, block 116 -->

![Technische Originalabbildung — PDF S.23](/docs/rockchip-mipi-dsi2/assets/cn-p23-figure1.png)

Editierbare Abschrift der Originalabbildung:

| Parameter | Wert |
|---|---|
| Bildrate | 60 Hz |
| Pixeltakt | 84.5 MHz |
| MIPI-Lanes | 1 Port * 4 Lanes |
| MIPI-Geschwindigkeit | 676 M sps |
| HSW / HBP / HACT / HFP | 20 / 40 / 1600 / 118 |
| VSW / VBP / VACT / VFP | 4 / 18 / 2560 / 60 |

<!-- Source CN PDF p.23, block 117 -->

#### 11.5.2 DSC für Zweikanal-MIPI aktivieren

<!-- Source CN PDF p.23, block 118 -->

Das folgende Diagramm zeigt den Anzeigepfad einer Kundenlösung mit einem 2560x2560p120-Dual-MIPI-Anzeigemodul und DSC.

<!-- Source CN PDF p.23, block 119 -->

![Technische Originalabbildung — PDF S.23](/docs/rockchip-mipi-dsi2/assets/cn-p23-figure2.png)

<!-- Source CN PDF p.24, block 120 -->

## 12. Anzeigeroute

<!-- Source CN PDF p.24, block 121 -->

![Technische Originalabbildung — PDF S.24](/docs/rockchip-mipi-dsi2/assets/cn-p24-figure1.png)

<!-- Source CN PDF p.24, block 122 -->

### 12.1 MIPI mit DSC

<!-- Source CN PDF p.24, block 123 -->

![Technische Originalabbildung — PDF S.24](/docs/rockchip-mipi-dsi2/assets/cn-p24-figure2.png)

<!-- Source CN PDF p.25, block 124 -->

### 12.2 MIPI mit DSC-Bypass

<!-- Source CN PDF p.25, block 125 -->

![Technische Originalabbildung — PDF S.25](/docs/rockchip-mipi-dsi2/assets/cn-p25-figure1.png)

<!-- Source CN PDF p.25, block 126 -->

### 12.3 DTS-Konfiguration

<!-- Source CN PDF p.25, block 127 -->

Beispiel: DSI0 an VP3:

<!-- Source CN PDF p.25, block 128 -->

```text
&dsi0_in_vp2 {
    status = "disabled";
};
&dsi0_in_vp3 {
    status = "okay";
};
```

<!-- Source CN PDF p.25, block 129 -->

Beispiel: DSI1 an VP2:

<!-- Source CN PDF p.25, block 130 -->

```text
&dsi1_in_vp2 {
    status = "okay";
};
&dsi1_in_vp3 {
    status = "disabled";
};
```

<!-- Source CN PDF p.26, block 131 -->

## 13. Startlogo

<!-- Source CN PDF p.26, block 132 -->

### 13.1 route_dsi0

<!-- Source CN PDF p.26, block 133 -->

Beispielsweise vp3->dsi0 oder vp3->dsc0->dsi0:

<!-- Source CN PDF p.26, block 134 -->

```text
&route_dsi0 {
    status = "okay";
    connect = <&vp3_out_dsi0>;
};
```

<!-- Source CN PDF p.26, block 135 -->

### 13.2 route_dsi1

<!-- Source CN PDF p.26, block 136 -->

Beispielsweise vp2->dsi1 oder vp2->dsc1->dsi1:

<!-- Source CN PDF p.26, block 137 -->

```text
&route_dsi1 {
    status = "okay";
    connect = <&vp2_out_dsi1>;
};
```

<!-- Source CN PDF p.26, block 138 -->

### 13.3 route_dsi0 && route_dsi1

<!-- Source CN PDF p.26, block 139 -->

Beispielsweise (vp3->dsi0 oder vp3->dsc0->dsi0) && (vp2->dsi1 oder vp2->dsc1->dsi1):

<!-- Source CN PDF p.26, block 140 -->

```text
&route_dsi0 {
    status = "okay";
    connect = <&vp3_out_dsi0>;
};
&route_dsi1 {
    status = "okay";
    connect = <&vp2_out_dsi1>;
};
```

<!-- Source CN PDF p.26, block 141 -->

## 14. DSI-HOST

<!-- Source CN PDF p.26, block 142 -->

DSI unterstützt die Modi Manual und Auto-Calculation. Standardmäßig verwendet der Treiber Manual; Nutzer können Auto-Calculation mit folgenden Eigenschaften auswählen.

<!-- Source CN PDF p.26, block 143 -->

Der Host entnimmt den IPI- und PPI-Schnittstellen automatisch alle erforderlichen Informationen und Timing-Parameter, um das Frame-Timing im Videomodus zu erfüllen. Auto-Calculation bietet folgende Vorteile:

<!-- Source CN PDF p.27, block 144 -->

Der Nutzer muss keinen Registersatz konfigurieren.

<!-- Source CN PDF p.27, block 145 -->

Die Konfiguration wird einfacher und unerwartetes Controller-Verhalten unwahrscheinlicher.

<!-- Source CN PDF p.27, block 146 -->

IPI-Frames können sich dynamisch ändern, während der Controller seine Ausgabeframes anpasst.

<!-- Source CN PDF p.27, block 147 -->

In den folgenden Beispielen verknüpft ports die Display-Schnittstelle mit dem Panel. Konfigurationsdetails stehen in diesem Dokument:

<!-- Source CN PDF p.27, block 148 -->

```text
Documentation/devicetree/bindings/graph.txt
```

<!-- Source CN PDF p.27, block 149 -->

### 14.1 Einzel-DSI

<!-- Source CN PDF p.27, block 150 -->

![Technische Originalabbildung — PDF S.27](/docs/rockchip-mipi-dsi2/assets/cn-p27-figure1.png)

<!-- Source CN PDF p.27, block 151 -->

#### 14.1.1 DSI0

<!-- Source CN PDF p.27, block 152 -->

```text
&dsi0 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi0_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi: endpoint {
                    remote-endpoint = <&dsi_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi>;
            };
        };
    };
};
&mipi_dcphy0 {
    status = "okay";
};
```

<!-- Source CN PDF p.28, block 154 -->

#### 14.1.2 DSI1

<!-- Source CN PDF p.28, block 155 -->

```text
&dsi1 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi1_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi1: endpoint {
                    remote-endpoint = <&dsi1_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi1_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi1>;
            };
        };
    };
};
&mipi_dcphy1 {
    status = "okay";
};
```

<!-- Source CN PDF p.29, block 157 -->

### 14.2 Zweikanal-DSI

<!-- Source CN PDF p.29, block 158 -->

MODE1:

<!-- Source CN PDF p.29, block 159 -->

![Technische Originalabbildung — PDF S.29](/docs/rockchip-mipi-dsi2/assets/cn-p29-figure1.png)

<!-- Source CN PDF p.29, block 160 -->

MODE2:

<!-- Source CN PDF p.29, block 161 -->

![Technische Originalabbildung — PDF S.29](/docs/rockchip-mipi-dsi2/assets/cn-p29-figure2.png)

<!-- Source CN PDF p.29, block 162 -->

Beachten Sie für Zweikanalbetrieb die hervorgehobenen Eigenschaften: rockchip,dual-channel = `<&dsi1>` und dsi,lanes = `<8>`; für ein DPHY-Panel. Setzen Sie die Lane-Anzahl bei einem CPHY-Panel auf 6. Es folgen die vollständigen DTS-Beispiele der Quelle.

<!-- Source CN PDF p.29, block 163 -->

```text
&dsi0 {
    status = "okay";
    rockchip,dual-channel = <&dsi1>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi0_panel {
        status = "okay";
        compatible = "simple-panel-dsi";
        dsi,lanes = <8>;
        ...
        display-timings {
            native-mode = <&timing0>;
            timing0: timing0 {
                clock-frequency = <260000000>;
                hactive = <1440>;
                vactive = <2560>;
                hfront-porch = <150>;
                hsync-len = <30>;
                hback-porch = <60>;
                vfront-porch = <8>;
                vsync-len = <4>;
                vback-porch = <4>;
                hsync-active = <0>;
                vsync-active = <0>;
                de-active = <0>;
                pixelclk-active = <0>;
            };
        };
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi0: endpoint {
                    remote-endpoint = <&dsi0_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi0_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi0>;
            };
        };
    };
};
&dsi1 {
    status = "okay";
};
&mipi_dcphy0 {
    status = "okay";
};
&mipi_dcphy1 {
    status = "okay";
};
```

<!-- Source CN PDF p.31, block 167 -->

### 14.3 Dual-Link-DSI

<!-- Source CN PDF p.31, block 168 -->

![Technische Originalabbildung — PDF S.31](/docs/rockchip-mipi-dsi2/assets/cn-p31-figure1.png)

<!-- Source CN PDF p.31, block 169 -->

```text
&dsi0 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi0_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi: endpoint {
                    remote-endpoint = <&dsi_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi>;
            };
        };
    };
};
&dsi1 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi1_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi1: endpoint {
                    remote-endpoint = <&dsi1_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi1_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi1>;
            };
        };
    };
};
&mipi_dcphy0 {
    status = "okay";
};
&mipi_dcphy1 {
    status = "okay";
};
```

<!-- Source CN PDF p.33, block 173 -->

### 14.4 DSI-Anwendungsszenarien

<!-- Source CN PDF p.33, block 174 -->

#### 14.4.1 DSI- plus SerDer-Entwurf

<!-- Source CN PDF p.33, block 175 -->

![Technische Originalabbildung — PDF S.33](/docs/rockchip-mipi-dsi2/assets/cn-p33-figure1.png)

<!-- Source CN PDF p.33, block 176 -->

#### 14.4.2 Zusammensetzung mehrerer Anzeigen

<!-- Source CN PDF p.33, block 177 -->

![Technische Originalabbildung — PDF S.33](/docs/rockchip-mipi-dsi2/assets/cn-p33-figure2.png)

<!-- Source CN PDF p.34, block 178 -->

## 15. DC-PHY

<!-- Source CN PDF p.34, block 179 -->

Die Standardkonfiguration verwendet D-PHY. Wie im Panel-Konfigurationsabschnitt erläutert, wählt folgende Einstellung C-PHY:

<!-- Source CN PDF p.34, block 180 -->

```text
dsi0_panel: panel@0 {
    ...
    phy-c-option;
    ...
};
```

<!-- Source CN PDF p.34, block 181 -->

### 15.1 D-PHY

<!-- Source CN PDF p.34, block 182 -->

![Technische Originalabbildung — PDF S.34](/docs/rockchip-mipi-dsi2/assets/cn-p34-figure1.png)

<!-- Source CN PDF p.34, block 183 -->

1\. Bis 4.5 Gbps je Lane bei D-PHY;

<!-- Source CN PDF p.34, block 184 -->

2\. Ein D-PHY-Port besitzt bis zu 4 Lanes mit jeweils zwei differentiellen Leitungen;

<!-- Source CN PDF p.34, block 185 -->

3\. D bezeichnet die römische Zahl 500. Ursprünglich hatte D-PHY eine maximale Datenrate von 1G (DDR) mit zugehörigem 500MHz-Takt. Moderne D-PHY-Raten liegen darüber, daher besitzt D diese Bedeutung nicht mehr.

<!-- Source CN PDF p.35, block 186 -->

### 15.2 C-PHY

<!-- Source CN PDF p.35, block 187 -->

![Technische Originalabbildung — PDF S.35](/docs/rockchip-mipi-dsi2/assets/cn-p35-figure1.png)

<!-- Source CN PDF p.35, block 188 -->

1\. Bis 2.0 Gsps je Trio bei C-PHY;

<!-- Source CN PDF p.35, block 189 -->

2\. Ein C-PHY-Port besitzt bis zu 3 Lanes mit jeweils einem Dreileiter-Trio (in der Quelle als „tree-wire-trios“ geschrieben);

<!-- Source CN PDF p.35, block 190 -->

3\. C-PHY besitzt keine getrennte Clock-Lane; der Takt ist im Kommunikationstiming eingebettet;

<!-- Source CN PDF p.35, block 191 -->

4\. C bedeutet Channel-limited: Die Kanalanzahl ist auf 3 begrenzt. C-PHY besitzt 3 Lanes mit jeweils Dreileiterübertragung.

<!-- Source CN PDF p.35, block 192 -->

## 16. Dynamischer Bildratenwechsel

<!-- Source CN PDF p.35, block 193 -->

MIPI DSI unterstützt dynamischen, nahtlosen Bildratenwechsel, etwa zwischen 120fps und 60fps. Details stehen in Rockchip_RK3588_Developer_Guide_Vsync_Adjust_CN.

<!-- Source CN PDF p.35, block 194 -->

![Technische Originalabbildung — PDF S.35](/docs/rockchip-mipi-dsi2/assets/cn-p35-figure2.png)

<!-- Source CN PDF p.36, block 195 -->

## 17. PSR

<!-- Source CN PDF p.36, block 196 -->

Arbeitet MIPI DSI im COMMAND-Modus und besitzt das Panel GRAM, kann bei einem statischen Bild die Host-DSI-Ausgabe zur Energieeinsparung deaktiviert werden. Das Panel aktualisiert dieses Bild weiterhin aus GRAM. Sobald ein neuer Frame Bildinhalte ändert, muss der Host die Ausgabe aktivieren und das Panel-GRAM aktualisieren.

<!-- Source CN PDF p.36, block 197 -->

![Technische Originalabbildung — PDF S.36](/docs/rockchip-mipi-dsi2/assets/cn-p36-figure1.png)

<!-- Source CN PDF p.36, block 198 -->

## 18. Protokollanalyse

<!-- Source CN PDF p.36, block 199 -->

### 18.1 DSI-Schichtdefinitionen

<!-- Source CN PDF p.36, block 200 -->

![Technische Originalabbildung — PDF S.36](/docs/rockchip-mipi-dsi2/assets/cn-p36-figure2.png)

<!-- Source CN PDF p.37, block 201 -->

### 18.2 D-Option

<!-- Source CN PDF p.37, block 202 -->

#### 18.2.1 Lane-Zustände und Leitungspegel

<!-- Source CN PDF p.37, block 203 -->

![Technische Originalabbildung — PDF S.37](/docs/rockchip-mipi-dsi2/assets/cn-p37-figure1.png)

<!-- Source CN PDF p.37, block 204 -->

Die folgende Tabelle nennt sämtliche Lane-Zustände, die im normalen DPHY-Betrieb auftreten können.

<!-- Source CN PDF p.37, block 205 -->

![Technische Originalabbildung — PDF S.37](/docs/rockchip-mipi-dsi2/assets/cn-p37-figure2.png)

Editierbare Abschrift der Originalabbildung:

| Zustand | Dp-Leitung | Dn-Leitung | HS-Burst | LP-Steuerung | LP-Escape |
|---|---|---|---|---|---|
| HS-0 | HS-Low | HS-High | Differentiell-0 | Nicht anwendbar (1) | Nicht anwendbar (1) |
| HS-1 | HS-High | HS-Low | Differentiell-1 | Nicht anwendbar (1) | Nicht anwendbar (1) |
| LP-00 | LP-Low | LP-Low | Nicht anwendbar | Bridge | Space |
| LP-01 | LP-Low | LP-High | Nicht anwendbar | HS-Rqst | Mark-0 |
| LP-10 | LP-High | LP-Low | Nicht anwendbar | LP-Rqst | Mark-1 |
| LP-11 | LP-High | LP-High | Nicht anwendbar | Stop | Nicht anwendbar (2) |

(1) Während der Hochgeschwindigkeitsübertragung sehen die Low-Power-Empfänger LP-00. (2) LP-11 im Escape-Modus führt die Leitung zu Stop zurück (Steuermodus LP-11).

<!-- Source CN PDF p.38, block 206 -->

#### 18.2.2 Globales Betriebsablaufdiagramm

<!-- Source CN PDF p.38, block 207 -->

![Technische Originalabbildung — PDF S.38](/docs/rockchip-mipi-dsi2/assets/cn-p38-figure1.png)

<!-- Source CN PDF p.38, block 208 -->

Eine DSI-Daten-Lane kann folgende drei Modi annehmen:

<!-- Source CN PDF p.38, block 209 -->

1\. Escape-Modus (nur Dp0/Dn0 arbeitet in diesem Modus);

<!-- Source CN PDF p.38, block 210 -->

2\. Bus-Turnaround-Anforderung (nur Dp0/Dn0 arbeitet in diesem Modus);

<!-- Source CN PDF p.38, block 211 -->

3\. Hochgeschwindigkeits-Datenübertragung.

<!-- Source CN PDF p.38, block 212 -->

Diese Modi und ihre Eintrittssequenzen werden nachfolgend definiert.

<!-- Source CN PDF p.38, block 213 -->

![Technische Originalabbildung — PDF S.38](/docs/rockchip-mipi-dsi2/assets/cn-p38-figure2.png)

Editierbare Abschrift der Originalabbildung:

| Modus | Eintritt | Austritt |
|---|---|---|
| Escape-Modus | LP-11 → LP-10 → LP-00 → LP-01 → LP-00 | LP-00 → LP-10 → LP-11 (Mark-1) |
| Hochgeschwindigkeits-Datenübertragung | LP-11 → LP-01 → LP-00 → HS-0 | (HS-0 oder HS-1) → LP-11 |
| Bus-Turnaround-Anforderung | LP-11 → LP-10 → LP-00 → LP-10 → LP-00 | Hi-Z |

<!-- Source CN PDF p.38, block 214 -->

##### 18.2.2.1 Escape-Modi

<!-- Source CN PDF p.38, block 215 -->

Während die Daten-Lanes im LP-Modus arbeiten, dient Daten-Lane 0 dem Escape-Modus. Der Eintritt erfolgt über LP-11->LP-10->LP-00->LP-01->LP-00, der Austritt über LP-00->LP-10->LP-11.

<!-- Source CN PDF p.39, block 216 -->

![Technische Originalabbildung — PDF S.39](/docs/rockchip-mipi-dsi2/assets/cn-p39-figure1.png)

<!-- Source CN PDF p.39, block 217 -->

###### 18.2.2.1.1 Escape-Befehle

<!-- Source CN PDF p.39, block 218 -->

Nach Eintritt der Daten-Lane in den Escape-Modus sendet der Sender einen 8-Bit-Escape-Befehl zur Kennzeichnung der gewünschten Aktion. Die Befehle sind nachfolgend aufgeführt.

<!-- Source CN PDF p.39, block 219 -->

![Technische Originalabbildung — PDF S.39](/docs/rockchip-mipi-dsi2/assets/cn-p39-figure2.png)

Editierbare Abschrift der Originalabbildung:

| Escape-Befehl | Typ | Erstes → letztes übertragenes Bit | Dn | D0 |
|---|---|---|---|---|
| Low-Power-Datenübertragung | Modus | 1110 0001 b | - | X |
| Ultra-Low-Power-Modus | Modus | 0001 1110 b | X | X |
| Undefiniert-1 (1) | Modus | 1001 1111 b | - | - |
| Undefiniert-2 (1) | Modus | 1101 1110 b | - | - |
| Entfernte Anwendung zurücksetzen | Auslöser | 0110 0010 b | - | X |
| Bestätigung | Auslöser | 0010 0001 b | - | X |
| Unbekannt-5 (1) | Auslöser | 1010 0000 b | - | - |

(1) Dieser Escape-Befehl ist auf dem Anzeigemodul nicht implementiert. n=1; X=unterstützt; -=nicht unterstützt.

<!-- Source CN PDF p.39, block 220 -->

###### 18.2.2.1.2 LPDT

<!-- Source CN PDF p.39, block 221 -->

Nachdem die Lane in den Escape-Modus gewechselt ist und die Low-Power-Data-Transmission-Sequenz (LPDT) an das Anzeigemodul gesendet hat, kann der SoC-MIPI-DSI-TX Daten im LPDT-Modus übertragen. So werden üblicherweise Initialisierungssequenzen an MIPI-Anzeigemodule übertragen.

<!-- Source CN PDF p.40, block 222 -->

![Technische Originalabbildung — PDF S.40](/docs/rockchip-mipi-dsi2/assets/cn-p40-figure1.png)

<!-- Source CN PDF p.40, block 223 -->

Die folgende Oszilloskopaufnahme zeigt LPDT.

<!-- Source CN PDF p.40, block 224 -->

![Technische Originalabbildung — PDF S.40](/docs/rockchip-mipi-dsi2/assets/cn-p40-figure2.png)

<!-- Source CN PDF p.41, block 225 -->

###### 18.2.2.1.3 ULPS

<!-- Source CN PDF p.41, block 226 -->

![Technische Originalabbildung — PDF S.41](/docs/rockchip-mipi-dsi2/assets/cn-p41-figure1.png)

<!-- Source CN PDF p.41, block 227 -->

##### 18.2.2.2 HSDT

<!-- Source CN PDF p.41, block 228 -->

Arbeitet die DPHY-Clock-Lane im Hochgeschwindigkeitstaktmodus, kann das Anzeigemodul Hochgeschwindigkeits-Datenübertragung verwenden. Alle Daten-Lanes treten gleichzeitig in diesen Modus ein, müssen ihn aber nicht gleichzeitig verlassen. Eintrittssequenz:

<!-- Source CN PDF p.41, block 229 -->

LP-11 -> LP-01 -> LP-00 -> HS-0 -> SoT(0001_1101).

<!-- Source CN PDF p.41, block 230 -->

```text
1. Start: LP-11
2. HS-Request: LP-01
3. HS-Settle: LP-00 -> HS-0 (RX: Lane Termination Enable)
4. Rx Synchronization: SoT(0001_1101)
5. End: High-Speed Data Transmission (HSDT) - Ready to receive High-Speed Data Load
```

<!-- Source CN PDF p.41, block 231 -->

Zum Beenden der Hochgeschwindigkeitsübertragung wird unmittelbar nach dem letzten Nutzdatum der differentielle Zustand invertiert und für Ths-trail gehalten.

<!-- Source CN PDF p.41, block 232 -->

![Technische Originalabbildung — PDF S.41](/docs/rockchip-mipi-dsi2/assets/cn-p41-figure2.png)

<!-- Source CN PDF p.41, block 233 -->

Die folgende Oszilloskopaufnahme zeigt HSDT.

<!-- Source CN PDF p.42, block 234 -->

![Technische Originalabbildung — PDF S.42](/docs/rockchip-mipi-dsi2/assets/cn-p42-figure1.png)

<!-- Source CN PDF p.42, block 235 -->

##### 18.2.2.3 BTA

<!-- Source CN PDF p.42, block 236 -->

Zum Abrufen von Informationen aus dem Anzeigemodul führt die erste SoC-DPHY-Daten-Lane eine Bus-Richtungsumkehr durch. Das Verfahren ist nachfolgend dargestellt.

<!-- Source CN PDF p.42, block 237 -->

![Technische Originalabbildung — PDF S.42](/docs/rockchip-mipi-dsi2/assets/cn-p42-figure2.png)

Editierbare Abschrift der Originalabbildung:

BTA-Ablauf: Die MCU beginnt bei LP-11 und fordert die Richtungsumkehr mit LP-11 → LP-10 → LP-00 → LP-10 → LP-00 an. Sie wartet, bis das Modul D0P/N treibt, und beendet dann das eigene Treiben dieser Lanes (High-Z). Das Modul wechselt über LP-00 → LP-10 → LP-11 zu Stop.

<!-- Source CN PDF p.42, block 238 -->

Die folgende Oszilloskopaufnahme zeigt BTA beim Zurücklesen aus dem Anzeigemodul während HSDT.

<!-- Source CN PDF p.43, block 239 -->

![Technische Originalabbildung — PDF S.43](/docs/rockchip-mipi-dsi2/assets/cn-p43-figure1.png)

<!-- Source CN PDF p.43, block 240 -->

#### 18.2.3 Byte- und Bitreihenfolge

<!-- Source CN PDF p.43, block 241 -->

Sowohl bei LP- als auch bei HS-Übertragung werden Daten in lange und kurze Pakete verpackt und zum Anzeigemodul gesendet.

<!-- Source CN PDF p.43, block 242 -->

##### 18.2.3.1 SPa

<!-- Source CN PDF p.43, block 243 -->

![Technische Originalabbildung — PDF S.43](/docs/rockchip-mipi-dsi2/assets/cn-p43-figure2.png)

<!-- Source CN PDF p.43, block 244 -->

Beispiel:

<!-- Source CN PDF p.43, block 245 -->

![Technische Originalabbildung — PDF S.43](/docs/rockchip-mipi-dsi2/assets/cn-p43-figure3.png)

<!-- Source CN PDF p.44, block 246 -->

###### 18.2.3.1.1 LPDT-SPa

<!-- Source CN PDF p.44, block 247 -->

Die folgende Oszilloskopaufnahme zeigt das obige SPa beim Senden zum Anzeigemodul im LPDT-Modus.

<!-- Source CN PDF p.44, block 248 -->

![Technische Originalabbildung — PDF S.44](/docs/rockchip-mipi-dsi2/assets/cn-p44-figure1.png)

<!-- Source CN PDF p.44, block 249 -->

###### 18.2.3.1.2 HSDT-SPa

<!-- Source CN PDF p.44, block 250 -->

Die folgende Oszilloskopaufnahme zeigt das obige SPa beim Senden zum Anzeigemodul im HSDT-Modus.

<!-- Source CN PDF p.44, block 251 -->

![Technische Originalabbildung — PDF S.44](/docs/rockchip-mipi-dsi2/assets/cn-p44-figure2.png)

<!-- Source CN PDF p.45, block 252 -->

##### 18.2.3.2 LPa

<!-- Source CN PDF p.45, block 253 -->

![Technische Originalabbildung — PDF S.45](/docs/rockchip-mipi-dsi2/assets/cn-p45-figure1.png)

<!-- Source CN PDF p.45, block 254 -->

Beispiel:

<!-- Source CN PDF p.45, block 255 -->

![Technische Originalabbildung — PDF S.45](/docs/rockchip-mipi-dsi2/assets/cn-p45-figure2.png)

<!-- Source CN PDF p.46, block 256 -->

###### 18.2.3.2.1 LPDT-LPa

<!-- Source CN PDF p.46, block 257 -->

Die folgende Oszilloskopaufnahme zeigt das obige LPa beim Senden zum Anzeigemodul im LPDT-Modus.

<!-- Source CN PDF p.46, block 258 -->

![Technische Originalabbildung — PDF S.46](/docs/rockchip-mipi-dsi2/assets/cn-p46-figure1.png)

<!-- Source CN PDF p.46, block 259 -->

###### 18.2.3.2.2 HSDT-LPa

<!-- Source CN PDF p.46, block 260 -->

Die folgende Oszilloskopaufnahme zeigt das obige LPa beim Senden zum Anzeigemodul im HSDT-Modus.

<!-- Source CN PDF p.46, block 261 -->

![Technische Originalabbildung — PDF S.46](/docs/rockchip-mipi-dsi2/assets/cn-p46-figure2.png)

<!-- Source CN PDF p.46, block 262 -->

##### 18.2.3.3 DI

<!-- Source CN PDF p.46, block 263 -->

SPa und LPa enthalten beide eine Datenidentifikation (DI), die festlegt, ob das Paket lang oder kurz ist. DI gehört zum Paketkopf und besteht aus zwei Teilen:

<!-- Source CN PDF p.47, block 264 -->

![Technische Originalabbildung — PDF S.47](/docs/rockchip-mipi-dsi2/assets/cn-p47-figure1.png)

Editierbare Abschrift der Originalabbildung:

| DI-Feld | Bits | Breite |
|---|---|---|
| VC (virtueller Kanal) | DI[7:6] | 2 |
| DT (Datentyp) | DI[5:0] | 6 |

<!-- Source CN PDF p.47, block 265 -->

Die meisten aktuell im MIPI-Protokoll definierten Datentypen sind nachfolgend aufgeführt.

<!-- Source CN PDF p.48, block 266 -->

![Technische Originalabbildung — PDF S.48](/docs/rockchip-mipi-dsi2/assets/cn-p48-figure1.png)

Editierbare Abschrift der Originalabbildung:

| Datentyp (hex) | Binär | Beschreibung | Paketgröße |
| --- | --- | --- | --- |
| 0x01 | 00 0001 | Synchronereignis: V-Sync-Beginn | Kurz |
| 0x11 | 01 0001 | Synchronereignis: V-Sync-Ende | Kurz |
| 0x21 | 10 0001 | Synchronereignis: H-Sync-Beginn | Kurz |
| 0x31 | 11 0001 | Synchronereignis: H-Sync-Ende | Kurz |
| 0x07 | 00 0111 | Kompressionsmodus-Befehl | Kurz |
| 0x08 | 00 1000 | End-of-Transmission-Paket (EoTp) | Kurz |
| 0x02 | 00 0010 | Befehl zum Ausschalten des Farbmodus (CM) | Kurz |
| 0x12 | 01 0010 | Befehl zum Einschalten des Farbmodus (CM) | Kurz |
| 0x22 | 10 0010 | Befehl zum Abschalten der Peripherie | Kurz |
| 0x32 | 11 0010 | Befehl zum Einschalten der Peripherie | Kurz |
| 0x03 | 00 0011 | Generisches kurzes WRITE, ohne Parameter | Kurz |
| 0x13 | 01 0011 | Generisches kurzes WRITE, 1 Parameter | Kurz |
| 0x23 | 10 0011 | Generisches kurzes WRITE, 2 Parameter | Kurz |
| 0x04 | 00 0100 | Generisches READ, ohne Parameter | Kurz |
| 0x14 | 01 0100 | Generisches READ, 1 Parameter | Kurz |
| 0x24 | 10 0100 | Generisches READ, 2 Parameter | Kurz |
| 0x05 | 00 0101 | Kurzes DCS-WRITE, ohne Parameter | Kurz |
| 0x15 | 01 0101 | Kurzes DCS-WRITE, 1 Parameter | Kurz |
| 0x06 | 00 0110 | DCS-READ, ohne Parameter | Kurz |
| 0x16 | 01 0110 | Warteschlange ausführen | Kurz |
| 0x37 | 11 0111 | Maximale Rückgabepaketgröße festlegen | Kurz |
| 0x27 | 10 0111 | Scrambling-Modus-Befehl | Kurz |
| 0x09 | 00 1001 | Nullpaket, ohne Daten | Lang |
| 0x19 | 01 1001 | Austastpaket, ohne Daten | Lang |
| 0x29 | 10 1001 | Generisches langes Write | Lang |
| 0x39 | 11 1001 | Langes DCS-Write-/write_LUT-Befehlspaket | Lang |
| 0x0A | 00 1010 | Bildparametersatz | Lang |
| 0x0B | 00 1011 | Komprimierter Pixelstrom | Lang |
| 0x0C | 00 1100 | Locker gepackter Pixelstrom, 20-Bit-YCbCr, Format 4:2:2 | Lang |

<!-- Source CN PDF p.49, block 267 -->

#### 18.2.4 Schnittstellen-Timing im Videomodus

<!-- Source CN PDF p.49, block 268 -->

##### 18.2.4.1 Vertikales Anzeige-Timing (Videomodus)

<!-- Source CN PDF p.49, block 269 -->

![Technische Originalabbildung — PDF S.49](/docs/rockchip-mipi-dsi2/assets/cn-p49-figure1.png)

<!-- Source CN PDF p.49, block 270 -->

##### 18.2.4.2 Horizontales Anzeige-Timing (Videomodus)

<!-- Source CN PDF p.49, block 271 -->

![Technische Originalabbildung — PDF S.49](/docs/rockchip-mipi-dsi2/assets/cn-p49-figure2.png)

<!-- Source CN PDF p.50, block 272 -->

##### 18.2.4.3 Non-Burst-Modus mit Synchronimpulsen

<!-- Source CN PDF p.50, block 273 -->

![Technische Originalabbildung — PDF S.50](/docs/rockchip-mipi-dsi2/assets/cn-p50-figure1.png)

<!-- Source CN PDF p.50, block 274 -->

Die folgende Oszilloskopaufnahme zeigt den Betrieb Non Burst Sync Pulse.

<!-- Source CN PDF p.50, block 275 -->

![Technische Originalabbildung — PDF S.50](/docs/rockchip-mipi-dsi2/assets/cn-p50-figure2.png)

<!-- Source CN PDF p.51, block 276 -->

##### 18.2.4.4 Burst-Modus

<!-- Source CN PDF p.51, block 277 -->

![Technische Originalabbildung — PDF S.51](/docs/rockchip-mipi-dsi2/assets/cn-p51-figure1.png)

<!-- Source CN PDF p.51, block 278 -->

Die folgende Oszilloskopaufnahme zeigt Video-Burst-Betrieb.

<!-- Source CN PDF p.51, block 279 -->

![Technische Originalabbildung — PDF S.51](/docs/rockchip-mipi-dsi2/assets/cn-p51-figure2.png)

<!-- Source CN PDF p.52, block 280 -->

## 19. Häufige Probleme

<!-- Source CN PDF p.52, block 281 -->

### 19.1 VOP-Timing und Connector-Informationen prüfen

<!-- Source CN PDF p.52, block 282 -->

```text
console:/ # cat /d/dri/0/summary
Video Port0: DISABLED
Video Port1: DISABLED
Video Port2: DISABLED
Video Port3: ACTIVE
    Connector: DSI-2
        bus_format[100a]: RGB888_1X24
        overlay_mode[0] output_mode[0] color_space[0]
    Display mode: 1080x1920p60
        clk[132000] real_clk[132000] type[48] flag[a]
        H: 1080 1095 1099 1129
        V: 1920 1935 1937 1952
    Cluster3-win0: ACTIVE
        win_id: 6
        format: AB24 little-endian (0x34324241) SDR[0] color_space[0] glb_alpha[0xff]
        rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
        csc: y2r[0] r2y[0] csc mode[0]
        zpos: 0
        src: pos[0, 0] rect[1080 x 1920]
        dst: pos[0, 0] rect[1080 x 1920]
        buf[0]: addr: 0x000000000376e000 pitch: 4352 offset: 0
```

<!-- Source CN PDF p.52, block 283 -->

### 19.2 DSI2-Taktbaum prüfen

<!-- Source CN PDF p.52, block 284 -->

Wenn MIPI ohne DSC arbeitet, überträgt seine Schnittstelle 4 Pixel je Taktzyklus. Die Takte müssen erfüllen:

<!-- Source CN PDF p.52, block 285 -->

video_timing_pixel_rate / 4 = mipi_pixel_clock × K = dclk_out × K = dclk_core

<!-- Source CN PDF p.52, block 286 -->

Wenn MIPI mit DSC arbeitet, müssen die Takte erfüllen:

<!-- Source CN PDF p.52, block 287 -->

mipi_pixel_clock = cds_clk / 2

<!-- Source CN PDF p.52, block 288 -->

Hinweis: Standardmäßig gilt K = 1; bei Zweikanal-MIPI-Anzeige gilt K = 2.

<!-- Source CN PDF p.52, block 289 -->

```text
console:/ # cat /d/clk/clk_summary | grep vop
    clk_vop_pmu 0 0 0 24000000 0 0 50000
          dclk_vop3 1 2 0 33000000 0 0 50000
          dclk_vop1_src 0 1 0 594000000 0 0 50000
             dclk_vop1 0 1 0 594000000 0 0 50000
          dclk_vop0_src 0 1 0 594000000 0 0 50000
             dclk_vop0 0 1 0 594000000 0 0 50000
             aclk_vop_low_root 1 1 0 396000000 0 0 50000
             hclk_vop_root 2 4 0 198000000 0 0 50000
                hclk_vop 1 3 0 198000000 0 0 50000
          aclk_vop_root 1 1 0 500000000 0 0 50000
             aclk_vop_doby 0 0 0 500000000 0 0 50000
             aclk_vop_sub_src 1 1 0 500000000 0 0 50000
                aclk_vop 1 4 0 500000000 0 0 50000
             pclk_vop_root 3 5 0 100000000 0 0 50000
          dclk_vop2_src 1 1 0 148500000 0 0 50000
             dclk_vop2 1 2 0 148500000 0 0 50000
console:/ # cat /d/clk/clk_summary | grep dsi
                pclk_dsihost1 1 2 0 100000000 0 0 50000
                pclk_dsihost0 1 2 0 100000000 0 0 50000
    clk_dsihost1 1 2 0 351000000 0 0 50000
    clk_dsihost0 1 2 0 351000000 0 0 50000
console:/ # cat /d/clk/clk_summary | grep mipi
          mipi1_clk_src 0 0 0 33000000 0 0 50000
             mipi1_pixclk 0 0 0 33000000 0 0 50000
          mipi0_clk_src 0 0 0 148500000 0 0 50000
             mipi0_pixclk 0 0 0 148500000 0 0 50000
    clk_usbdpphy_mipidcpphy_ref 5 5 0 24000000 0 0 50000
    clk_mipi_camaraout_m4 0 0 0 24000000 0 0 50000
    clk_mipi_camaraout_m3 0 0 0 24000000 0 0 50000
    clk_mipi_camaraout_m2 0 0 0 24000000 0 0 50000
    clk_mipi_camaraout_m0 0 0 0 24000000 0 0 50000
          clk_mipi_camaraout_m1 0 0 0 37125000 0 0 50000
                pclk_mipi_dcphy1 1 1 0 100000000 0 0 50000
                pclk_mipi_dcphy0 1 1 0 100000000 0 0 50000
console:/ #
```

<!-- Source CN PDF p.53, block 291 -->

### 19.3 Konfigurierte DSI-Lane-Rate prüfen

<!-- Source CN PDF p.53, block 292 -->

Die DSI-Lane-Rate lässt sich auf zwei Arten bestimmen. Eine ist die automatische Treiberberechnung:

<!-- Source CN PDF p.53, block 293 -->

```text
dmesg | grep dsi
[ 77.369812] dw-mipi-dsi2 fde20000.dsi: [drm:dw_mipi_dsi2_encoder_enable] final DSI-Link
bandwidth: 879 x 4 Mbps
```

<!-- Source CN PDF p.53, block 294 -->

Die andere ist die manuelle Vorgabe mit dieser Eigenschaft:

<!-- Source CN PDF p.53, block 295 -->

```text
&dsi0 {
    ...
    rockchip,lane-rate = <1000>;
    ...
}
```

<!-- Source CN PDF p.54, block 296 -->

### 19.4 MIPI DSI2 HOST besitzt keine interne Farbbalkenfunktion; verwenden Sie VOP2-Farbbalken mit folgenden Befehlen

<!-- Source CN PDF p.54, block 297 -->

Wählen Sie den zur Anzeigeroute passenden Befehl:

<!-- Source CN PDF p.54, block 298 -->

#### 19.4.1 RK3588

<!-- Source CN PDF p.54, block 299 -->

```text
vp0:
io -4 0xfdd90c08 0x1 && io -4 0xfdd90000 0xffffffff
vp1:
io -4 0xfdd90d08 0x1 && io -4 0xfdd90000 0xffffffff
vp2:
io -4 0xfdd90e08 0x1 && io -4 0xfdd90000 0xffffffff
vp3:
io -4 0xfdd90f08 0x1 && io -4 0xfdd90000 0xffffffff
```

<!-- Source CN PDF p.54, block 300 -->

#### 19.4.2 RK3576

<!-- Source CN PDF p.54, block 301 -->

```text
vp0:
io -4 0x27d00c08 0x1 && io -4 0x27d00000 0xffffffff
vp1:
io -4 0x27d00d08 0x1 && io -4 0x27d00000 0xffffffff
vp2:
io -4 0x27d00e08 0x1 && io -4 0x27d00000 0xffffffff
```

<!-- Source CN PDF p.54, block 302 -->

### 19.5 Kommunikation zwischen MIPI DSI2 und Panel bei fehlerhafter Anzeige prüfen

<!-- Source CN PDF p.54, block 303 -->

U-Boot:

<!-- Source CN PDF p.54, block 304 -->

```text
--- a/drivers/video/drm/rockchip_panel.c
+++ b/drivers/video/drm/rockchip_panel.c
@@ -260,6 +260,7 @@ static void panel_simple_prepare(struct rockchip_panel *panel)
    struct rockchip_panel_priv *priv = dev_get_priv(panel->dev);
    struct mipi_dsi_device *dsi = dev_get_parent_platdata(panel->dev);
    int ret;
+ u8 mode;
    if (priv->prepared)
        return;
@@ -285,6 +286,8 @@ static void panel_simple_prepare(struct rockchip_panel *panel)
    if (plat->delay.init)
        mdelay(plat->delay.init);
+ mipi_dsi_dcs_get_power_mode(dsi, &mode);
+ printf("===>mode: 0x%x\n", mode);
    if (plat->on_cmds) {
        if (priv->cmd_type == CMD_TYPE_SPI)
            ret = rockchip_panel_send_spi_cmds(panel->state,
@@ -298,6 +301,8 @@ static void panel_simple_prepare(struct rockchip_panel *panel)
            printf("failed to send on cmds: %d\n", ret);
    }
+ mipi_dsi_dcs_get_power_mode(dsi, &mode);
+ printf("===>mode: 0x%x\n", mode);
    priv->prepared = true;
 }
```

<!-- Source CN PDF p.55, block 306 -->

Kernel:

<!-- Source CN PDF p.55, block 307 -->

```text
--- a/drivers/gpu/drm/panel/panel-simple.c
+++ b/drivers/gpu/drm/panel/panel-simple.c
@@ -506,6 +506,7 @@ static int panel_simple_prepare(struct drm_panel *panel)
    unsigned int delay;
    int err;
    int hpd_asserted;
+ u8 mode;
    if (p->prepared)
        return 0;
@@ -554,6 +555,8 @@ static int panel_simple_prepare(struct drm_panel *panel)
        }
    }
+ mipi_dsi_dcs_get_power_mode(p->dsi, &mode);
+ printk("===>mode: 0x%x\n", mode);
    if (p->desc->init_seq)
        if (p->dsi)
            panel_simple_xfer_dsi_cmd_seq(p, p->desc->init_seq);
@@ -561,6 +564,9 @@ static int panel_simple_prepare(struct drm_panel *panel)
    if (p->desc->delay.init)
        msleep(p->desc->delay.init);
+ mipi_dsi_dcs_get_power_mode(p->dsi, &mode);
+ printk("===>mode: 0x%x\n", mode);
+
    p->prepared = true;
    return 0;
```

<!-- Source CN PDF p.55, block 308 -->

Normale Kommunikation liefert folgende Meldungen. Andernfalls prüfen Sie das Panel-Timing und stellen sicher, dass das Panel bereit ist:

<!-- Source CN PDF p.56, block 309 -->

```text
===> mode: 0x8
===> mode: 0x9c
```

<!-- Source CN PDF p.56, block 310 -->

#### 19.5.1 Zwei Wellenformen beim Zurücklesen von get_power_mode

<!-- Source CN PDF p.56, block 311 -->

##### 19.5.1.1 Normale Panelantwort 0x08 (0x11 und 0x29 nicht gesendet)

<!-- Source CN PDF p.56, block 312 -->

![Technische Originalabbildung — PDF S.56](/docs/rockchip-mipi-dsi2/assets/cn-p56-figure1.png)

<!-- Source CN PDF p.57, block 313 -->

##### 19.5.1.2 Normale Panelantwort 0x9c (0x11 und 0x29 bereits gesendet)

<!-- Source CN PDF p.57, block 314 -->

![Technische Originalabbildung — PDF S.57](/docs/rockchip-mipi-dsi2/assets/cn-p57-figure1.png)

<!-- Source CN PDF p.57, block 315 -->

### 19.6 DRM-Treiber wird nicht gebunden

<!-- Source CN PDF p.57, block 316 -->

Prüfen Sie mit diesem Befehl, ob die Bindung einer Komponente fehlgeschlagen ist. Beispielsweise kann ein deaktivierter DP-PHY die DP-Bindung verhindern:

<!-- Source CN PDF p.57, block 317 -->

```text
/sys/kernel/debug/device_component/display-subsystem <
master name status
-------------------------------------------------------------
display-subsystem bound
device name status
-------------------------------------------------------------
fdd90000.vop bound
fde20000.dsi bound
fde30000.dsi bound
fde50000.dp bound
```

<!-- Source CN PDF p.57, block 318 -->

### 19.7 Probe des Hintergrundbeleuchtungstreibers schlägt fehl

<!-- Source CN PDF p.57, block 319 -->

```text
console:/ # dmesg | grep backlight
[ 3.164274] pwm-backlight: probe of backlight failed with error -16
```

<!-- Source CN PDF p.58, block 320 -->

### 19.8 TE für ein Anzeigemodul im Befehlsmodus konfigurieren

<!-- Source CN PDF p.58, block 321 -->

Zur Vermeidung von Tearing sollte die Aktualisierungsrate des Displaycontrollers der Rate entsprechen, mit der das Anzeigemodul Bilder aus GRAM liest. RK3588 und RK3576 unterstützen ausschließlich externe TE-Rückmeldung vom Anzeigemodul.

<!-- Source CN PDF p.58, block 322 -->

#### 19.8.1 Hardware-TE

<!-- Source CN PDF p.58, block 323 -->

MIPI DSI besitzt dedizierte Pins, die als TE gemultiplext werden können.

<!-- Source CN PDF p.58, block 324 -->

```text
&dsi0 {
    ...
    /* 显示模组TE信号连接到MIPI_TE0 */
    pinctrl-names = "default";
    pinctrl-0 = <&mipi_te0>;
    ...
};
&dsi1 {
    ...
    /* 显示模组TE信号连接到MIPI_TE1，only RK3588 support dsi1 */
    pinctrl-names = "default";
    pinctrl-0 = <&mipi_te1>;
    ...
};
```

<!-- Source CN PDF p.58, block 325 -->

#### 19.8.2 Software-TE

<!-- Source CN PDF p.58, block 326 -->

Wird der Hardware-TE-Pin anderweitig verwendet, kann ein freier GPIO als Eingang dienen und TE-Interrupts an das Anzeigesystem melden.

<!-- Source CN PDF p.58, block 327 -->

```text
&dsi0 {
    status = "okay";
    te-gpios = <&gpio0 RK_PC4 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&lcd_te_gpio>;
};
```

<!-- Source CN PDF p.58, block 328 -->

Die folgende Aufnahme zeigt die Übereinstimmung der MIPI-DSI-Datenfeldrate mit der TE-Frequenz des Anzeigemoduls:

<!-- Source CN PDF p.59, block 329 -->

![Technische Originalabbildung — PDF S.59](/docs/rockchip-mipi-dsi2/assets/cn-p59-figure1.png)

<!-- Source CN PDF p.59, block 330 -->

### 19.9 Master-/Slave-Reihenfolge bei Zweikanal-MIPI umkehren

<!-- Source CN PDF p.59, block 331 -->

Sind die beiden MIPI-Ports im Hardwareentwurf vertauscht, korrigieren Sie die Reihenfolge softwareseitig mit folgender Konfiguration:

<!-- Source CN PDF p.59, block 332 -->

```text
&dsi0 {
    ...
    rockchip,data-swap;
    rockchip,dual-channel = <&dsi1>;
    ...
};
&dsi1 {
    status = "okay";
};
```

<!-- Source CN PDF p.59, block 333 -->

### 19.10 Debug-Knoten

<!-- Source CN PDF p.59, block 334 -->

Beim Testen von MIPI-DSI-Signalen kann eine Signalanpassung erforderlich sein. Die zugehörigen Debug-Knoten liegen unter:

<!-- Source CN PDF p.59, block 335 -->

```text
dcphy0：
cd /sys/devices/platform/feda0000.phy/
dcphy1：
cd /sys/devices/platform/fedb0000.phy/
```

<!-- Source CN PDF p.60, block 336 -->

#### 19.10.1 Patch

<!-- Source CN PDF p.60, block 337 -->

```diff
diff --git a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
index cd6b615228d9..26bb1d030d08 100644
--- a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
@@ -219,6 +219,25 @@
 #define RX_S0D3_DESKEW_CON4 (0xF50)
 #define RX_S0D3_ADI_STAT0 (0XFEC)
 #define MIPI_DCPHY_MAX_REGISGER RX_S0D3_ADI_STAT0
+#define REG_400M_MASK GENMASK(6, 4)
+#define REG_400M(x) UPDATE(x, 6, 4)
+#define REG_645M_MASK GENMASK(2, 0)
+#define REG_645M(x) UPDATE(x, 2, 0)
+
+#define BIAS_CON4 0x0010
+#define I_MUX_SEL_MASK GENMASK(6, 5)
+#define I_MUX_SEL(x) UPDATE(x, 6, 5)
+#define CAP_PEAKING_MASK GENMASK(14, 8)
+#define RES_UP_MASK GENMASK(7, 4)
+#define RES_UP(x) UPDATE(x, 7, 4)
+#define RES_DN_MASK GENMASK(3, 0)
+#define RES_DN(x) UPDATE(x, 3, 0)
+#define T_HS_ZERO_MASK GENMASK(15, 8)
+#define T_HS_PREPARE_MASK GENMASK(7, 0)
+#define T_HS_EXIT_MASK GENMASK(15, 8)
+#define T_HS_TRAIL_MASK GENMASK(7, 0)
+#define T_TA_GET_MASK GENMASK(7, 4)
+#define T_TA_GO_MASK GENMASK(3, 0)
 struct samsung_mipi_dphy_timing {
    unsigned int max_lane_mbps;
@@ -1780,10 +1799,10 @@ static struct v4l2_subdev *get_remote_sensor(struct v4l2_subdev *sd);
 static int samsung_mipi_dcphy_power_on(struct phy *phy)
 {
    struct samsung_mipi_dcphy *samsung = phy_get_drvdata(phy);
- enum phy_mode mode = phy_get_mode(phy);
    int on = 0;
    struct v4l2_subdev *sensor_sd = NULL;
+ samsung->mode = phy_get_mode(phy);
    pm_runtime_get_sync(samsung->dev);
    reset_control_assert(samsung->apb_rst);
    udelay(1);
@@ -1801,7 +1820,7 @@ static int samsung_mipi_dcphy_power_on(struct phy *phy)
                     RKMODULE_SET_QUICK_STREAM, &on);
    }
- switch (mode) {
+ switch (samsung->mode) {
    case PHY_MODE_MIPI_DPHY:
        samsung_mipi_dphy_power_on(samsung);
        break;
@@ -2381,6 +2400,467 @@ static const struct regmap_config samsung_mipi_dcphy_regmap_config = {
    .max_register = MIPI_DCPHY_MAX_REGISGER,
 };
+static ssize_t
+reg_645m_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, BIAS_CON2, &val);
+ level = (val & REG_645M_MASK) >> 4;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+reg_645m_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 7)
+ val = 7;
+
+ regmap_update_bits(samsung->regmap, BIAS_CON2, REG_645M_MASK, REG_645M(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(reg_645m);
+
+static ssize_t
+reg_400m_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, BIAS_CON2, &val);
+ level = (val & REG_400M_MASK) >> 4;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+reg_400m_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 7)
+ val = 7;
+
+ regmap_update_bits(samsung->regmap, BIAS_CON2, REG_400M_MASK, REG_400M(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(reg_400m);
+
+static ssize_t
+cap_peaking_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, COMBO_MD0_ANA_CON0, &val);
+ level = (val & CAP_PEAKING_MASK) >> 12;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+cap_peaking_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 7)
+ val = 7;
+
+ regmap_update_bits(samsung->regmap, DPHY_MC_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+
+ return count;
+}
+static DEVICE_ATTR_RW(cap_peaking);
+
+static ssize_t
+res_up_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, COMBO_MD0_ANA_CON0, &val);
+ level = (val & RES_UP_MASK) >> 4;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+res_up_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 15)
+ val = 15;
+
+ regmap_update_bits(samsung->regmap, DPHY_MC_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD0_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD1_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD2_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, DPHY_MD3_ANA_CON0, RES_UP_MASK, RES_UP(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(res_up);
+
+static ssize_t
+res_dn_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, COMBO_MD0_ANA_CON0, &val);
+ level = (val & RES_DN_MASK);
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+res_dn_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 15)
+ val = 15;
+
+ regmap_update_bits(samsung->regmap, DPHY_MC_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD0_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD1_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD2_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, DPHY_MD3_ANA_CON0, RES_DN_MASK, RES_DN(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(res_dn);
+
+static ssize_t
+output_voltage_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, BIAS_CON4, &val);
+ level = (val & I_MUX_SEL_MASK) >> 5;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+output_voltage_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 3)
+ val = 3;
+
+ regmap_update_bits(samsung->regmap, BIAS_CON4,
+ I_MUX_SEL_MASK, I_MUX_SEL(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(output_voltage);
+
+static ssize_t
+hs_exit_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_exit;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON2, &val);
+ hs_exit = (val & GENMASK(15, 8)) >> 8;
+
+ return sprintf(buf, "%d\n", hs_exit);
+
+}
+
+static ssize_t hs_exit_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_exit;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_exit = T_HS_EXIT(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_exit);
+
+static ssize_t
+hs_trail_or_post_3_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_trail;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON2, &val);
+ hs_trail = val & GENMASK(7, 0);
+
+ return sprintf(buf, "%d\n", hs_trail);
+
+}
+
+static ssize_t hs_trail_or_post_3_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_trail;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_trail = T_HS_TRAIL(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_trail_or_post_3);
+
+static ssize_t
+hs_zero_or_prebegin_3_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_zero;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON1, &val);
+ hs_zero = (val & GENMASK(15, 8)) >> 8;
+
+ return sprintf(buf, "%d\n", hs_zero);
+
+}
+
+static ssize_t hs_zero_or_prebegin_3_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_zero;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_zero = T_HS_ZERO(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_zero_or_prebegin_3);
+
+static ssize_t
+hs_prepare_or_prepare_3_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_prepare;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON1, &val);
+ hs_prepare = val & GENMASK(7, 0);
+
+ return sprintf(buf, "%d\n", hs_prepare);
+}
+
+static ssize_t hs_prepare_or_prepare_3_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_prepare;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_prepare = T_HS_PREPARE(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_prepare_or_prepare_3);
+
+static ssize_t
+lpx_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int lpx;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON0, &val);
+ lpx = (val & GENMASK(11, 4)) >> 4;
+
+ return sprintf(buf, "%d\n", lpx);
+
+}
+
+static ssize_t lpx_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long lpx = 0;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ lpx |= T_LPX(val);
+ /* T_LP_EXIT_SKEW/T_LP_ENTRY_SKEW unconfig */
+ regmap_write(samsung->regmap, COMBO_MD0_TIME_CON0, lpx);
+ regmap_write(samsung->regmap, COMBO_MD1_TIME_CON0, lpx);
+ regmap_write(samsung->regmap, COMBO_MD2_TIME_CON0, lpx);
+
+ if (!samsung->c_option) {
+ regmap_write(samsung->regmap, DPHY_MC_TIME_CON0, lpx);
+ regmap_write(samsung->regmap, DPHY_MD3_TIME_CON0, lpx);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(lpx);
+
+static struct attribute *samsung_mipi_dcphy_cts_attrs[] = {
+ &dev_attr_lpx.attr,
+ &dev_attr_hs_prepare_or_prepare_3.attr,
+ &dev_attr_hs_zero_or_prebegin_3.attr,
+ &dev_attr_hs_trail_or_post_3.attr,
+ &dev_attr_hs_exit.attr,
+ &dev_attr_output_voltage.attr,
+ &dev_attr_res_up.attr,
+ &dev_attr_res_dn.attr,
+ &dev_attr_cap_peaking.attr,
+ &dev_attr_reg_400m.attr,
+ &dev_attr_reg_645m.attr,
+ NULL
+};
+
+static const struct attribute_group samsung_mipi_dcphy_cts_attr_group = {
+ .attrs = samsung_mipi_dcphy_cts_attrs,
+};
+
+static int samsung_mipi_dcphy_cts_sysfs_add(struct samsung_mipi_dcphy *samsung)
+{
+ struct device *dev = samsung->dev;
+ int ret;
+
+ ret = sysfs_create_group(&dev->kobj, &samsung_mipi_dcphy_cts_attr_group);
+ if (ret) {
+ dev_err(dev, "failed to register sysfs. err: %d\n", ret);
+ return ret;
+ };
+
+ return 0;
+}
+
+
 static int samsung_mipi_dcphy_probe(struct platform_device *pdev)
 {
    struct device *dev = &pdev->dev;
@@ -2474,6 +2954,7 @@ static int samsung_mipi_dcphy_probe(struct platform_device *pdev)
    samsung->stream_off = samsung_dcphy_rx_stream_off;
    mutex_init(&samsung->mutex);
    pm_runtime_enable(dev);
+ samsung_mipi_dcphy_cts_sysfs_add(samsung);
    return 0;
 }
diff --git a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h
index b5e827d7cfc1..a53356c0eed6 100644
--- a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h
+++ b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h
@@ -48,6 +48,7 @@ struct samsung_mipi_dcphy {
    struct clk *pclk;
    struct regmap *regmap;
    struct regmap *grf_regmap;
+ int mode;
    struct reset_control *m_phy_rst;
    struct reset_control *s_phy_rst;
    struct reset_control *apb_rst;
```

<!-- Source CN PDF p.70, block 357 -->

#### 19.10.2 Treiberstärke

<!-- Source CN PDF p.70, block 358 -->

##### 19.10.2.1 Auswahlpin für die Ausgangsspannung (400mV/200mV/530mV)

<!-- Source CN PDF p.70, block 359 -->

```text
echo level > output_voltage
```

<!-- Source CN PDF p.70, block 360 -->

Treibervorgaben:

<!-- Source CN PDF p.70, block 361 -->

1\. D-PHY: 2'b00

<!-- Source CN PDF p.70, block 362 -->

2\. C-PHY: 2'b10

<!-- Source CN PDF p.70, block 363 -->

Referenzwerte der Stufen:

<!-- Source CN PDF p.70, block 364 -->

1\. 2b'00 : 400mV

<!-- Source CN PDF p.70, block 365 -->

2\. 2b'01 : 200mV

<!-- Source CN PDF p.70, block 366 -->

3\. 2b'10 : 530mV

<!-- Source CN PDF p.70, block 367 -->

4\. 2b'11 : 530mV

<!-- Source CN PDF p.70, block 368 -->

##### 19.10.2.2 LP-Gleichtaktspannung

<!-- Source CN PDF p.70, block 369 -->

```text
echo level > reg_645m
```

<!-- Source CN PDF p.70, block 370 -->

Referenzwerte der Stufen:

<!-- Source CN PDF p.70, block 371 -->

Referenzspannung des LP-Funktionssteuerpins: 645mV

<!-- Source CN PDF p.71, block 372 -->

1\. 3'b000: 605mV

<!-- Source CN PDF p.71, block 373 -->

2\. 3'b001: 625mV

<!-- Source CN PDF p.71, block 374 -->

3\. 3'b010: 635mV

<!-- Source CN PDF p.71, block 375 -->

4\. 3'b011: 645mV

<!-- Source CN PDF p.71, block 376 -->

5\. 3'b100: 655mV

<!-- Source CN PDF p.71, block 377 -->

6\. 3'b101: 665mV

<!-- Source CN PDF p.71, block 378 -->

7\. 3'b110: 685mV

<!-- Source CN PDF p.71, block 379 -->

8\. 3'b111: 725mV

<!-- Source CN PDF p.71, block 380 -->

##### 19.10.2.3 HS-Gleichtaktspannung

<!-- Source CN PDF p.71, block 381 -->

```text
echo level > reg_400m
```

<!-- Source CN PDF p.71, block 382 -->

Referenzwerte der Stufen:

<!-- Source CN PDF p.71, block 383 -->

1\. 3'b000: 380mV / 230mV

<!-- Source CN PDF p.71, block 384 -->

2\. 3'b001: 390mV / 220mV

<!-- Source CN PDF p.71, block 385 -->

3\. 3'b010: 400mV / 210mV

<!-- Source CN PDF p.71, block 386 -->

4\. 3'b011: 410mV / 200mV

<!-- Source CN PDF p.71, block 387 -->

5\. 3'b100: 420mV / 190mV

<!-- Source CN PDF p.71, block 388 -->

6\. 3'b101: 430mV / 180mV

<!-- Source CN PDF p.71, block 389 -->

7\. 3'b110: 440mV / 170mV

<!-- Source CN PDF p.71, block 390 -->

8\. 3'b111: 450mV / 160mV

<!-- Source CN PDF p.71, block 391 -->

##### 19.10.2.4 HS-Differenzspannung

<!-- Source CN PDF p.71, block 392 -->

Die Hochgeschwindigkeits-Differenzspannung wird gemeinsam durch die nachfolgend konfigurierbaren Pull-up- und Pull-down-Widerstände bestimmt:

<!-- Source CN PDF p.71, block 393 -->

VREG entspricht der Gleichtaktspannung (Registerfeld REG_400M).

<!-- Source CN PDF p.71, block 394 -->

###### 19.10.2.4.1 Pull-up-Widerstand des Hochgeschwindigkeitstreibers steuern

<!-- Source CN PDF p.71, block 395 -->

```text
echo level > res_up
```

<!-- Source CN PDF p.71, block 396 -->

Referenzwerte der Stufen:

<!-- Source CN PDF p.71, block 397 -->

1\. 4'b0000: 43 ohm

<!-- Source CN PDF p.71, block 398 -->

2\. 4'b0001: 46 ohm

<!-- Source CN PDF p.71, block 399 -->

3\. 4'b0010: 49 ohm

<!-- Source CN PDF p.71, block 400 -->

4\. 4'b0011: 52 ohm

<!-- Source CN PDF p.72, block 401 -->

5\. 4'b0100: 56 ohm

<!-- Source CN PDF p.72, block 402 -->

6\. 4'b0101: 60 ohm

<!-- Source CN PDF p.72, block 403 -->

7\. 4'b0110: 66 ohm

<!-- Source CN PDF p.72, block 404 -->

8\. 4'b0111: 73 ohm

<!-- Source CN PDF p.72, block 405 -->

9\. 4'b1000: 30 ohm

<!-- Source CN PDF p.72, block 406 -->

10\. 4'b1001: 31.2 ohm

<!-- Source CN PDF p.72, block 407 -->

11\. 4'b1010: 32.5 ohm

<!-- Source CN PDF p.72, block 408 -->

12\. 4'b1011: 34 ohm

<!-- Source CN PDF p.72, block 409 -->

13\. 4'b1100: 35.5 ohm

<!-- Source CN PDF p.72, block 410 -->

14\. 4'b1101: 37 ohm

<!-- Source CN PDF p.72, block 411 -->

15\. 4'b1110: 39 ohm

<!-- Source CN PDF p.72, block 412 -->

16\. 4'b1111: 41 ohm

<!-- Source CN PDF p.72, block 413 -->

###### 19.10.2.4.2 Steuerung des Pull-down-Widerstands des High-Speed-Treibers

<!-- Source CN PDF p.72, block 414 -->

```text
echo level > res_dn
```

<!-- Source CN PDF p.72, block 415 -->

Referenzwerte der Stufen:

<!-- Source CN PDF p.72, block 416 -->

1\. 4'b0000: 43 ohm

<!-- Source CN PDF p.72, block 417 -->

2\. 4'b0001: 46 ohm

<!-- Source CN PDF p.72, block 418 -->

3\. 4'b0010: 49 ohm

<!-- Source CN PDF p.72, block 419 -->

4\. 4'b0011: 52 ohm

<!-- Source CN PDF p.72, block 420 -->

5\. 4'b0100: 56 ohm

<!-- Source CN PDF p.72, block 421 -->

6\. 4'b0101: 60 ohm

<!-- Source CN PDF p.72, block 422 -->

7\. 4'b0110: 66 ohm

<!-- Source CN PDF p.72, block 423 -->

8\. 4'b0111: 73 ohm

<!-- Source CN PDF p.72, block 424 -->

9\. 4'b1000: 30 ohm

<!-- Source CN PDF p.72, block 425 -->

10\. 4'b1001: 31.2 ohm

<!-- Source CN PDF p.72, block 426 -->

11\. 4'b1010: 32.5 ohm

<!-- Source CN PDF p.72, block 427 -->

12\. 4'b1011: 34 ohm

<!-- Source CN PDF p.72, block 428 -->

13\. 4'b1100: 35.5 ohm

<!-- Source CN PDF p.72, block 429 -->

14\. 4'b1101: 37 ohm

<!-- Source CN PDF p.72, block 430 -->

15\. 4'b1110: 39 ohm

<!-- Source CN PDF p.72, block 431 -->

16\. 4'b1111: 41 ohm

<!-- Source CN PDF p.73, block 432 -->

##### 19.10.2.5 Kapazitives Peaking

<!-- Source CN PDF p.73, block 433 -->

![Technische Originalabbildung — PDF S. 73](/docs/rockchip-mipi-dsi2/assets/cn-p73-figure1.png)

Editierbare Abschrift der Originalabbildung:

Zugehöriges Register: `M%_COMBO_MD#_ANA_CON0`, Offset `0x0708`, Bereich `[31:0]`, D-PHY-Standardwert `0x0000_7333`, C-PHY-Standardwert `0x0000_1188`.

| Feld | Bereich | Zugriffstag | RTL-Tag | D-PHY | C-PHY |
| --- | --- | --- | --- | --- | --- |
| RESERVED0 | [31:16] | RWi | RWi | 0x0 | 0x0 |
| RESERVED1 | [15] | R/W |  | 0x0 | 0x0 |
| EDGE_CON | [14:12] | R/W |  | 0x7 | 0x1 |
| RESERVED2 | [11:10] | R/W |  | 0x0 | 0x0 |
| EDGE_CON_DIR | [9] | R/W |  | 0x1 | 0x0 |
| EDGE_CON_EN | [8] | R/W |  | 0x1 | 0x1 |
| RES_UP | [7:4] | R/W |  | 0x3 | 0x8 |
| RES_DN | [3:0] | R/W |  | 0x3 | 0x8 |

Quellhinweis: Alle Register `M%_COMBO_MD#_ANA_CON0`, `M%_DPHY_MD#_ANA_CON0` und `M%_DPHY_MC_ANA_CON0` sollten dieselbe Einstellung verwenden. Das konzeptionelle Diagramm links zeigt Strom, EL-Intensität, Zeit, Peaking-Effekt und Ladungsträger-Ausräumeffekt.

<!-- Source CN PDF p.73, block 434 -->

![Technische Originalabbildung — PDF S. 73](/docs/rockchip-mipi-dsi2/assets/cn-p73-figure2.png)

Editierbare Abschrift der Originalabbildung:

| Feld | Wert | Bedeutung |
| --- | --- | --- |
| EDGE_CON | 3'b111 | Starkes kapazitives Peaking |
| EDGE_CON | 3'b011 | Mittleres kapazitives Peaking |
| EDGE_CON | 3'b001 | Schwaches kapazitives Peaking |
| EDGE_CON | 3'b000 | Aus, unabhängig von EDGE_CON_EN/EDGE_CON_DIR |
| EDGE_CON_DIR | 1'b0 | D-PHY rückwärts (langsamerer Übergang); C-PHY vorwärts (schnellerer Übergang) |
| EDGE_CON_DIR | 1'b1 | D-PHY vorwärts (schnellerer Übergang); C-PHY rückwärts (langsamerer Übergang) |
| EDGE_CON_EN | 1'b0 | Deaktiviert |
| EDGE_CON_EN | 1'b1 | Aktiviert |

`EDGE_CON` verwendet Thermometerkodierung. `RES_UP` und `RES_DN` steuern den High-Speed-Pull-up-/Pull-down-Widerstand; gleiche Codes entsprechen gleichen Widerständen. Die Tabelle bewahrt die Werte der Quellabbildung, die bei einigen Stufen von den Werten 43/46/49/52/56/60/66 Ohm im Fließtext abweichen. Diese Unterschiede werden nicht stillschweigend vereinheitlicht.

| RES_UP / RES_DN | Ohm | Standard |
| --- | --- | --- |
| 4'b0000 | 42 |  |
| 4'b0001 | 44 |  |
| 4'b0010 | 46 |  |
| 4'b0011 | 49 | D-PHY |
| 4'b0100 | 52 |  |
| 4'b0101 | 58 |  |
| 4'b0110 | 64 |  |
| 4'b0111 | 73 |  |
| 4'b1000 | 30 | C-PHY |
| 4'b1001 | 31.2 |  |
| 4'b1010 | 32.5 |  |
| 4'b1011 | 34 |  |
| 4'b1100 | 35.5 |  |
| 4'b1101 | 37 |  |
| 4'b1110 | 39 |  |
| 4'b1111 | 41 |  |

<!-- Source CN PDF p.73, block 435 -->

```text
echo level > cap_peaking
level: 0~7
```

<!-- Source CN PDF p.73, block 436 -->

#### 19.10.3 Signaltiming

<!-- Source CN PDF p.73, block 437 -->

Alle Signalparameter in den folgenden roten Rechtecken lassen sich anpassen.

<!-- Source CN PDF p.73, block 438 -->

![Technische Originalabbildung — PDF S. 73](/docs/rockchip-mipi-dsi2/assets/cn-p73-figure3.png)

<!-- Source CN PDF p.74, block 439 -->

![Technische Originalabbildung — PDF S. 74](/docs/rockchip-mipi-dsi2/assets/cn-p74-figure1.png)

<!-- Source CN PDF p.74, block 440 -->

Passen Sie die Signalzählwerte relativ zu ihren zurückgelesenen Werten an, beispielsweise Tlpx:

<!-- Source CN PDF p.74, block 441 -->

```text
cat lpx
```

<!-- Source CN PDF p.74, block 442 -->

##### 19.10.3.1 Tlpx

<!-- Source CN PDF p.74, block 443 -->

```text
echo count > lpx
```

<!-- Source CN PDF p.74, block 444 -->

##### 19.10.3.2 Ths_prepare_or_prepare_3

<!-- Source CN PDF p.74, block 445 -->

```text
echo count > hs_prepare_or_prepare_3
```

<!-- Source CN PDF p.74, block 446 -->

##### 19.10.3.3 Ths_zero_or_prebegin_3

<!-- Source CN PDF p.74, block 447 -->

```text
echo count > hs_zero_or_prebegin_3
```

<!-- Source CN PDF p.74, block 448 -->

##### 19.10.3.4 Ths_trail_or_post_3

<!-- Source CN PDF p.74, block 449 -->

```text
echo count > hs_trail_or_post_3
```

<!-- Source CN PDF p.74, block 450 -->

##### 19.10.3.5 Ths_exit

<!-- Source CN PDF p.74, block 451 -->

```text
echo count > hs_exit
```

{% endraw %}
