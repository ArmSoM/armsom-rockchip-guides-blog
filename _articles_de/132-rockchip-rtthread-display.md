---
title: "Rockchip-RT-Thread-Anzeigeleitfaden: VOP, Panels, Teilaktualisierung und Color Key"
description: "Rockchip-RT-Thread-Anzeigeleitfaden: VOP, Panels, Teilaktualisierung und Color Key — V1.4.0"
excerpt: "Rockchip-RT-Thread-Anzeigeleitfaden: VOP, Panels, Teilaktualisierung und Color Key"
translation_key: "132-rockchip-rtthread-display"
slug: "132-rockchip-rtthread-display"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, VOP, MIPI, LCD]
---

{% raw %}

# Rockchip-RT-Thread-Anzeigeleitfaden: VOP, Panels, Teilaktualisierung und Color Key

Vollständiger technischer Inhalt des chinesischen RK-KF-YF-105 V1.4.0. Die Quellplattformversionen stehen unten. Dies ist ein RT-Thread-Treiberleitfaden, keine Linux-DRM-Konfiguration. Vor ArmSoM-Einsatz SoC, RT-Thread-BSP/HAL, VOP, Schnittstelle, Panelmodell, Timing und Versorgung prüfen. Keine konkrete Boardkombination bestätigt: Plattformreferenz, keine universelle Unterstützung. Es liegt kein englisches PDF vor; alle vier Sprachen verwenden die 16 technischen Abbildungen der chinesischen Quelle. Tabellen und Code aus Screenshots wurden zusätzlich editierbar übertragen. Die Beispiele wurden nicht auf Hardware getestet.

| SoC | RT-Thread |
| --- | --- |
| RK2108 | lts-v3.1.x |
| RK3308 | lts-v4.1.x |
| RV1109/RV1126 | lts-v3.1.x |
| RV1103/RV1106 | lts-v4.1.x |
| RK2118 | lts-v4.1.x |
| RK3506 | lts-v4.1.x |

> Quellenprobleme bleiben erhalten: Der VOP-Dateipfad beginnt mit `dsp/rockchip-common/...`, andere mit bsp. Die Multiplikationsreihenfolge im Matrixbild und einzelne Festkommawerte (0.0691 → 0x05, 0.0880 → 0x08) passen nicht zur angegebenen Multiplikation mit 0x80; Werte bleiben unverändert. Abschnitt 6.4 nennt hsync/vsync „porch“, das Diagramm „pulse“; MIPI-Takteinheiten bleiben Mbps. Die Strukturen in Abschnitt 4 führen nicht alle in Abschnitt 7 verwendeten Felder auf. Initialisierungsarrays in Screenshots sind Ausschnitte; fehlende Enden oder Befehle werden nicht erfunden. YUVY422 bleibt wie im Original. Vor Verwendung HAL, Register und Panelspezifikation prüfen.

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

## 1. Überblick

Der Rockchip-RT-Thread-Anzeigetreiber registriert über das IO-Gerätemodell von RT-Thread einen LCD-Treiber beim Betriebssystem und unterstützt GUIs wie LittlevGL. Erweiterte Schnittstellen ermöglichen Mehrschichtkomposition, Farbeffekte, nachgelagerte Skalierung und MIPI switch.

### 1.1 Grundbegriffe

CRTC: Abstraktion des SoC-Anzeigecontrollers VOP, in manchen Dokumenten LCDC genannt.

Plane: Abstraktion einer win-Ebene im VOP/LCDC.

Encoder/Connector: Softwareabstraktion der Ausgänge RGB, LVDS, DSI, eDP, HDMI usw.

Panel: Abstraktion von LCD-, HDMI- und anderen Anzeigegeräten.

### 1.2 Anzeigepfad

RK2108

![RK2108-Anzeigepfad](/docs/rockchip-rtthread-display/assets/cn-p004-figure-01.png)

*RK2108-Anzeigepfad*

Für andere Plattformen siehe die Anzeigepfade in Rockchip_Developer_Guide_DRM_Display_Driver_CN.

## 2. Softwarearchitektur

![Anzeige-Softwarearchitektur](/docs/rockchip-rtthread-display/assets/cn-p005-figure-01.png)

*Anzeige-Softwarearchitektur*

### 2.1 Dateien der Driver-Schicht

| Treiber | Datei | Beschreibung |
| --- | --- | --- |
| Core | bsp/rockchip-common/drivers/drv_display.c | RT-Thread-Anzeigeframework: registriert den Treiber, lädt Anzeigemodule, verbindet Anwendungen und Treiber und verwaltet alle Module. |
| VOP | bsp/rockchip-common/drivers/drv_vop.c<br>dsp/rockchip-common/drivers/drv_vop.h | Treiber des VOP-Anzeigemoduls |
| DSI | bsp/rockchip-common/drivers/drv_dsi.c<br>bsp/rockchip-common/drivers/drv_dsi.h | Treiber des DSI/DPHY-Anzeigemoduls |
| PANEL | bsp/rockchip-common/drivers/drv_panel.c<br>bsp/rockchip-common/drivers/drv_panel_cfg.h | Paneltreiber zur Abstraktion von Initialisierungsbefehlen, Timing, Energieverwaltung und weiteren Paneloperationen. |

### 2.2 Dateien der HAL-Schicht

| Treiber | Datei | Beschreibung |
| --- | --- | --- |
| Core | bsp/rockchip-common/hal/lib/hal/inc/hal_display.h | Definitionen grundlegender Anzeigedatenstrukturen |
| VOP | bsp/rockchip-common/hal/lib/hal/src/hal_vop.c<br>bsp/rockchip-common/hal/lib/hal/inc/hal_vop.h | VOP-Hardwarefunktionen |
| DSI | bsp/rockchip-common/hal/lib/hal/src/hal_dsi.c<br>bsp/rockchip-common/hal/lib/hal/inc/hal_dsi.h | DSI/DPHY-Hardwarefunktionen |

## 3. Gängige Schnittstellen

RT-Thread-GUIs kommunizieren mit Treibern über control-Operationen, ähnlich Linux-IOCTL. Die erweiterten Operationen umfassen:

| Parameter | Beschreibung |
| --- | --- |
| RK_DISPLAY_CTRL_ENABLE | Anzeigegerät aktivieren |
| RK_DISPLAY_CTRL_DISABLE | Anzeigegerät deaktivieren |
| RK_DISPLAY_CTRL_SET_PLANE | Angegebene Ebene einstellen |
| RK_DISPLAY_CTRL_SET_SCALE | Nachgelagerte Skalierung einstellen |
| RK_DISPLAY_CTRL_LOAD_LUT | bpp-Nachschlagetabelle konfigurieren |
| RK_DISPLAY_CTRL_SET_COLOR_MATRIX | Farbumwandlungsmatrix einstellen |
| RK_DISPLAY_CTRL_SET_GAMMA_COE | Gamma-Koeffizienten einstellen |
| RK_DISPLAY_CTRL_SET_BCSH | BCSH für Helligkeit, Kontrast, Sättigung und Farbton konfigurieren |
| RK_DISPLAY_CTRL_SET_POST_CLIP | Clip-Koeffizient einstellen |
| RK_DISPLAY_CTRL_MIPI_SWITCH | MIPI-switch-Pfad umschalten |

| Parameter | Beschreibung |
| --- | --- |
| RK_DISPLAY_CTRL_COMMIT | Anzeigekonfiguration aktualisieren |

## 4. Wichtige Datenstrukturen

### 4.1 struct display_state

Die zentrale Treiberstruktur enthält RTT-device und graphic_info sowie Rockchip-Hardwareabstraktionen.

| Parameter | Beschreibung |
| --- | --- |
| struct rt_device_graphic_info graphic_info | RTT-Struktur mit Anzeigegeräteinformationen |
| struct rt_device lcd | LCD-Gerätestruktur |
| uint32_t *rtt_framebuffer | RTT-Framebuffer-Adresse |
| struct crtc_state crtc_state | Rockchip-VOP-Anzeigecontroller |
| struct connector_state conn_state | Rockchip-MIPI-DSI-Anzeigeumwandlungsmodul |
| struct panel_state panel_state | Panelinitialisierung, Versorgung und zugehörige Informationen |
| struct DISPLAY_MODE_INFO mode | Scan-Timing und weitere Panelinformationen |

### 4.2 struct crtc_state

Beschreibt das VOP-Modul des Rockchip-Prozessors mit folgenden Hauptfeldern:

| Parameter | Beschreibung |
| --- | --- |
| struct VOP_REG *hw_base | VOP-Registerbasisadresse |
| const struct rockchip_crtc_funcs *funcs | Funktionszeiger für grundlegende VOP-Operationen |
| struct CRTC_WIN_STATE win_state | WIN-Ebenenstruktur |
| struct VOP_POST_SCALE_INFO post_scale | Informationen zur nachgelagerten Skalierung |
| uint8_t irqno | VOP-Interruptnummer |
| uint8_t power_state | Versorgungszustand |

### 4.3 struct CRTC_WIN_STATE

Beschreibt eine WIN-Ebene des Rockchip-VOP-Moduls:

| Parameter | Beschreibung |
| --- | --- |
| bool winEn | Ebene: 0 aus, 1 ein |
| uint8_t winId | Ebenenauswahl: 0,1,2 bedeuten win0,win1,win2 |
| uint8_t zpos | Z-Reihenfolge: 0,1,2 von unten nach oben |
| uint8_t format | Format; Werte in rt-thread/include/rtdef.h |
| uint32_t yrgbAddr | RGBX-Adresse oder Y-Komponentenadresse von YUV |
| uint32_t cbcrAddr | YUV-UV-Komponentenadresse |
| uint16_t xVir | Virtuelle Breite; 4Byte-Ausrichtung erforderlich |
| uint16_t srcX | X-Anzeigeposition der Ebene |
| uint16_t srcY | Y-Anzeigeposition der Ebene |
| uint16_t srcW | Anzeigebreite der Ebene |
| uint16_t srcH | Anzeigehöhe der Ebene |
| uint8_t hwFormat | Vom Treiber umgerechneter Hardwarewert; keine Anwendungskonfiguration |
| uint16_t hwCrtcX | Vom Treiber umgerechneter Hardwarewert; keine Anwendungskonfiguration |
| uint16_t hwCrtcY | Vom Treiber umgerechneter Hardwarewert; keine Anwendungskonfiguration |
| uint16_t xLoopOffset | X-loop-Konfiguration |
| uint16_t yLoopOffset | Y-loop-Konfiguration |
| bool alphaEn | Alpha-Aktivierung |
| uint8_t alphaMode | Globales Alpha: VOP_ALPHA_MODE_USER_DEFINED; pro Pixel: VOP_ALPHA_MODE_PER_PIXEL |
| uint8_t alphaPreMul | Vormultipliziertes Alpha: YES VOP_PREMULT_ALPHA; NO VOP_NON_PREMULT_ALPHA |
| uint8_t alphaSatMode | Alpha ändern: 1 bedeutet alpha = alpha + alpha[7]; 0 unverändert. Empfohlen: 0. |
| uint8_t globalAlphaValue | Globaler Alpha-Wert: 0~0xff |
| uint32_t *lut | bpp-Nachschlagetabelle; siehe display_test.c oder eigene Tabelle verwenden |

### 4.4 struct VOP_POST_SCALE_INFO

Beschreibt die nachgelagerte Skalierung im Rockchip-VOP:

| Parameter | Beschreibung |
| --- | --- |
| uint16_t srcW | X-Quellauflösung |
| uint16_t srcH | Y-Quellauflösung |
| uint16_t dstX | X-Anzeigeposition nach Skalierung |
| uint16_t dstY | Y-Anzeigeposition nach Skalierung |
| uint16_t dstW | Anzeigebreite nach Skalierung |
| uint16_t dstH | Anzeigehöhe nach Skalierung |
| bool postScaleEn | Hardwareskalierung aktivieren; Treiber entscheidet, Anwendung muss nichts setzen |
| eVOP_PostSclMode postSclHmode | Hardwareskalierungsfaktor vom Treiber berechnet; keine Anwendungseinstellung |
| eVOP_PostSclMode postSclVmode | Hardwareskalierungsfaktor vom Treiber berechnet; keine Anwendungseinstellung |

### 4.5 struct VOP_BCSH_INFO

Beschreibt die nachgelagerte BCSH-Stufe des VOP:

| Parameter | Beschreibung |
| --- | --- |
| uint8_t brightness | Helligkeit: 0~100, Standard 50 |
| uint8_t contrast | Kontrast: 0~100, Standard 50 |
| uint8_t satCon | Sättigung: 0~100, Standard 50 |
| uint8_t hue | Farbton: 0~100, Standard 50 |

### 4.6 struct VOP_COLOR_MATRIX_INFO

Beschreibt die nachgelagerte Farbmatrix des VOP:

| Parameter | Beschreibung |
| --- | --- |
| bool colorMatrixEn | Aktivierung |
| uint8_t *colorMatrixCoe | Umwandlungsmatrix-Koeffizienten |
| uint8_t *colorMatrixOffset | Umwandlungsmatrix-Offsets |

![Originale Farbumwandlungsmatrix](/docs/rockchip-rtthread-display/assets/cn-p010-figure-01.png)

*Originale Farbumwandlungsmatrix*

```text
[csc_out0]   [csc_in0]   [coe00 coe01 coe02]   [offset0]
[csc_out1] = [csc_in1] X [coe10 coe11 coe12] + [offset1]
[csc_out2]   [csc_in2]   [coe20 coe21 coe22]   [offset2]
```

Beispiel: bt709tobt2020-Umwandlungsmatrix:

```text
{0.6274, 0.3293, 0.0433},
{0.0691, 0.9195, 0.0114},
{0.0164, 0.0880, 0.8956}
```

Nach Festkommaumrechnung mit 0x80 (bit7 ist das Vorzeichenbit):

```text
coe00 = 0.6274 * 0x80  = 0x50
coe01 = 0.3293 * 0x80  = 0x2a
coe02 = 0.0433 * 0x80  = 0x05
```

Entsprechend gibt die Quelle an:

```text
colorMatrixCoe[3][3] = {
    {0x50, 0x2a, 0x05},
    {0x05, 0x75, 0x02},
    {0x02, 0x08, 0x72}
};
```

### 4.7 struct VOP_POST_CLIP_INFO

Beschreibt die nachgelagerte Clip-Stufe des VOP:

| Parameter | Beschreibung |
| --- | --- |
| bool postClipEn | Aktivierung |
| uint8_t postYThres | Zu begrenzender Wert |

## 5. Ausrichtungsanforderungen

### 5.1 Datenausrichtung

RK2108

![RK2108-Datenausrichtung](/docs/rockchip-rtthread-display/assets/cn-p011-figure-01.png)

*RK2108-Datenausrichtung*

| Format | crtc W (Pixel) | crtc H (Zeilen) | xLoopOffset (Pixel) | yLoopOffset (Zeilen) | xVir (Bytes) | act_xoff (Pixel) | act_yoff (Zeilen) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RGB ARGB8888 | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| RGB RGB888 | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| RGB RGB565 | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| RGB RGB444 | 1 | 1 | 2 | 1 | 4 | 2 | 1 |
| YUV YUV420 4bit | 4 | 2 | 4 | 2 | 4 | 4 | 2 |
| YUV YUV420 8bit | 2 | 2 | 2 | 2 | 4 | 2 | 2 |
| YUV YUV422 4bit | 4 | 1 | 4 | 1 | 4 | 4 | 1 |
| YUV YUV422 8bit | 2 | 1 | 2 | 1 | 4 | 2 | 1 |
| YUV YUV444 4bit | 4 | 1 | 4 | 1 | 4 | 4 | 1 |
| YUV YUV444 8bit | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| YUV YUVY422 4bit | 2 | 1 | 2 | 1 | 4 | 2 | 1 |
| YUV YUVY422 8bit | 2 | 1 | 2 | 1 | 4 | 2 | 1 |
| 8BPP | 1 | 1 | 1 | 1 | 4 | 1 | 1 |
| 4BPP | 1 | 1 | 2 | 1 | 4 | 2 | 1 |
| 2BPP | 1 | 1 | 4 | 1 | 4 | 4 | 1 |
| 1BPP | 1 | 1 | 8 | 1 | 4 | 8 | 1 |

### 5.2 Panelausrichtung

Manche Panels verlangen eine Ausrichtung. Beim S6E3HC2 mit 1440x3120 beträgt der DSC-Slice 720x65: Positionen bei Teilaktualisierung auf 720x65, Bereichsgrößen auf 720x195 ausrichten. Bei 720x1560 beträgt der Slice 360x52: Positionen auf 360x52 und Größen auf 360x390 ausrichten.

## 6. Panelkonfiguration

### 6.1 Unterstütztes Panel auswählen

Die Panelkonfiguration über dieses Menü auswählen:

```text
cd bsp/rockchip-pisces
    scons --menuconfig
        RT-Thread rockchip common drivers  --->
            Panel Type (R17 SS mipi panel, resolution is 1080x2340)  --->
```

### 6.2 Neues Panel hinzufügen

1. In das Konfigurationsverzeichnis wechseln: `cd bsp/rockchip-common/drivers/panel_cfg`.

2. Eine vorhandene .h-Datei nach new_panel.h kopieren und die Parameter anhand Abschnitt 6.4 und Panelspezifikation ändern.

3. Mit `cd ../` nach bsp/rockchip-common/drivers/ zurückkehren.

4. Kconfig öffnen, „Panel Type“ suchen und RT_USING_PANEL_NEW_PANEL nach dem Vorbild der config-RT_USING_PANEL-Einträge definieren.

![Neues Panel in Kconfig](/docs/rockchip-rtthread-display/assets/cn-p012-figure-01.png)

*Neues Panel in Kconfig*

```text
--- a/bsp/rockchip-common/drivers/Kconfig
+++ b/bsp/rockchip-common/drivers/Kconfig
@@ -58,6 +58,9 @@ choice

     config RT_USING_PANEL_S6E3HC2_X4
        bool "S6E3HC2_X4 mipi panel, resolution is 720x1560"
+
+    config RT_USING_PANEL_NEW_PANEL
+       bool "It's a new panel demo, resolution is wxh"
 endchoice
```

### 6.3 Typische Scan-Timing-Darstellung

![Anzeige-Scan-Timing](/docs/rockchip-rtthread-display/assets/cn-p012-figure-02.png)

*Anzeige-Scan-Timing*

### 6.4 Panelparameter

| Parameter | Beschreibung |
| --- | --- |
| RT_HW_LCD_XRES | Horizontale Auflösung; hactive in 6.3 |
| RT_HW_LCD_YRES | Vertikale Auflösung; vactive in 6.3 |
| RT_HW_LCD_PIXEL_CLOCK | Pixeltakt, khz |
| RT_HW_LCD_LANE_MBPS | MIPI-DPHY-CLK-Lane-Takt, Mbps |
| RT_HW_LCD_LEFT_MARGIN | Linke Austastung; hback-porch in 6.3 |
| RT_HW_LCD_RIGHT_MARGIN | Rechte Austastung; hfront-porch in 6.3 |
| RT_HW_LCD_UPPER_MARGIN | Obere Austastung; vback-porch in 6.3 |
| RT_HW_LCD_LOWER_MARGIN | Untere Austastung; vfront-porch in 6.3 |
| RT_HW_LCD_HSYNC_LEN | Horizontale Sync-Dauer; Quelle nennt hsync-porch in 6.3 |
| RT_HW_LCD_VSYNC_LEN | Vertikale Sync-Dauer; Quelle nennt vsync-porch in 6.3 |
| RT_HW_LCD_CONN_TYPE | Paneltyp, z. B. RK_DISPLAY_CONNECTOR_DSI |
| RT_HW_LCD_BUS_FORMAT | Panelbusformat, z. B. MEDIA_BUS_FMT_RGB888_1X24 |
| RT_HW_LCD_VMODE_FLAG | Polarität, DSC-Unterstützung und weitere Flags |
| RT_HW_LCD_INIT_CMD_TYPE | Befehlstyp; CMD_TYPE_DEFAULT standardmäßig MIPI CMD |
| RT_HW_LCD_DISPLAY_MODE | CMD- oder Videomodus auswählen |
| RT_HW_LCD_AREA_DISPLAY | Unterstützung für Teilaktualisierung |
| RT_HW_LCD_XACT_ALIGN | Bereichsbreitenausrichtung in Pixeln |
| RT_HW_LCD_YACT_ALIGN | Bereichshöhenausrichtung in Pixeln |

| Parameter | Beschreibung |
| --- | --- |
| RT_HW_LCD_XPOS_ALIGN | X-Positionsausrichtung des Bereichs in Pixeln |
| RT_HW_LCD_YPOS_ALIGN | Y-Positionsausrichtung des Bereichs in Pixeln |
| RT_HW_LCD_PREPARE_DELAY_MS | Zeit bis zur Bereitschaft für Bilddaten, ms |
| RT_HW_LCD_UNPREPARE_DELAY_MS | Zeit bis zur vollständigen Abschaltung, ms |
| RT_HW_LCD_ENABLE_DELAY_MS | Zeit von Bereitschaft bis normaler Bildanzeige, ms |
| RT_HW_LCD_DISABLE_DELAY_MS | Zeit zum Verlassen des normalen Anzeigezustands, ms |
| RT_HW_LCD_INIT_DELAY_MS | Zeit vom Reset bis zum Senden von Initialisierungsbefehlen, ms |
| RT_HW_LCD_RESET_DELAY_MS | Zeit für vollständigen Panelreset, ms |
| struct rockchip_cmd cmd_on[] | Panelinitialisierungsbefehle |
| struct rockchip_cmd cmd_off[] | Panel-Deinitialisierungsbefehle |
| struct rockchip_cmd cmd_aod_on[] | Befehle zum Aktivieren von AOD |
| struct rockchip_cmd cmd_aod_off[] | Befehle zum Verlassen von AOD |

### 6.5 Panel-Initialisierungsbefehle

1. MIPI-DSI-CMD-Beispiel:

![Ausschnitt der Initialisierungsbefehle](/docs/rockchip-rtthread-display/assets/cn-p014-figure-01.png)

*Ausschnitt der Initialisierungsbefehle*

```text
struct rockchip_cmd cmd_on[] =
{
    /* sleep out */
    {0x05, 0x05, 0x01, {0x11}},
    /* FD Setting */
    {0x29, 0x00, 0x03, {0xf0, 0x5a, 0x5a}},
    {0x23, 0x00, 0x02, {0xb0, 0x01}},
    {0x23, 0x00, 0x02, {0xcd, 0x01}},
    {0x29, 0x14, 0x03, {0xf0, 0xa5, 0xa5}},
    /* 4. Common Setting */
    /* 4.1 TE(Vync) ON/OFF */
    {0x29, 0x00, 0x03, {0x9f, 0xa5, 0xa5}},
    {0x15, 0x00, 0x02, {0x35, 0x00}},
    {0x29, 0x00, 0x03, {0x9f, 0x5a, 0x5a}},
```

Die ersten drei hexadezimalen Bytes sind Data Type, Delay und Payload Length. Ab dem vierten Byte folgen Payload-Length-Bytes Nutzdaten.

2. Dekodierung des ersten Befehls:

![Erster Initialisierungsbefehl](/docs/rockchip-rtthread-display/assets/cn-p014-figure-02.png)

*Erster Initialisierungsbefehl*

```text
/* sleep out */
{0x05, 0x05, 0x01, {0x11}},
```

Data Type: 0x05 (DCS Short Write)

Delay: 0x05 (5 ms)

Payload Length: 0x01 (1 Byte)

Payload: 0x11

3. Dekodierung des zweiten Befehls:

![Zweiter Initialisierungsbefehl](/docs/rockchip-rtthread-display/assets/cn-p015-figure-01.png)

*Zweiter Initialisierungsbefehl*

```text
/* FD Setting */
{0x29, 0x00, 0x03, {0xf0, 0x5a, 0x5a}},
```

Data Type: 0x29 (Generic Long Write)

Delay: 0x00 (0 ms)

Payload Length: 0x03 (3 Bytes)

Payload: 0xf0 0x5a 0x5a

4. Data-Type-Definitionen

![Prozessorseitige Pakettypen](/docs/rockchip-rtthread-display/assets/cn-p015-figure-02.png)

*Prozessorseitige Pakettypen*

| Data Type (hex) | Data Type (binary) | Beschreibung | Pakettyp |
| --- | --- | --- | --- |
| 0x01 | 00 0001 | V-Sync-Start | Kurz |
| 0x11 | 01 0001 | V-Sync-Ende | Kurz |
| 0x21 | 10 0001 | H-Sync-Start | Kurz |
| 0x31 | 11 0001 | H-Sync-Ende | Kurz |
| 0x08 | 00 1000 | Übertragungsendepaket (EoTp) | Kurz |
| 0x02 | 00 0010 | Color Mode (CM) ausschalten | Kurz |
| 0x12 | 01 0010 | Color Mode (CM) einschalten | Kurz |
| 0x22 | 10 0010 | Peripherie ausschalten | Kurz |
| 0x32 | 11 0010 | Peripherie einschalten | Kurz |
| 0x03 | 00 0011 | Generic Short WRITE, ohne Parameter | Kurz |
| 0x13 | 01 0011 | Generic Short WRITE, 1 Parameter | Kurz |
| 0x23 | 10 0011 | Generic Short WRITE, 2 Parameter | Kurz |
| 0x04 | 00 0100 | Generic READ, ohne Parameter | Kurz |
| 0x14 | 01 0100 | Generic READ, 1 Parameter | Kurz |
| 0x24 | 10 0100 | Generic READ, 2 Parameter | Kurz |
| 0x05 | 00 0101 | DCS Short WRITE, ohne Parameter | Kurz |
| 0x15 | 01 0101 | DCS Short WRITE, 1 Parameter | Kurz |
| 0x06 | 00 0110 | DCS READ, ohne Parameter | Kurz |
| 0x37 | 11 0111 | Maximale Antwortpaketgröße einstellen | Kurz |
| 0x09 | 00 1001 | Null-Paket ohne Daten | Lang |
| 0x19 | 01 1001 | Austastpaket ohne Daten | Lang |
| 0x29 | 10 1001 | Generic Long Write | Lang |
| 0x39 | 11 1001 | DCS-Long-Write/write_LUT-Befehlspaket | Lang |
| 0x0C | 00 1100 | Lose gepackter Pixelstrom, 20-bit YCbCr, 4:2:2 | Lang |
| 0x1C | 01 1100 | Gepackter Pixelstrom, 24-bit YCbCr, 4:2:2 | Lang |
| 0x2C | 10 1100 | Gepackter Pixelstrom, 16-bit YCbCr, 4:2:2 | Lang |
| 0x0D | 00 1101 | Gepackter Pixelstrom, 30-bit RGB, 10-10-10 | Lang |
| 0x1D | 01 1101 | Gepackter Pixelstrom, 36-bit RGB, 12-12-12 | Lang |

![Fortsetzung der Pakettypen](/docs/rockchip-rtthread-display/assets/cn-p016-figure-01.png)

*Fortsetzung der Pakettypen*

| Data Type (hex) | Data Type (binary) | Beschreibung | Pakettyp |
| --- | --- | --- | --- |
| 0x3D | 11 1101 | Gepackter Pixelstrom, 12-bit YCbCr, 4:2:0 | Lang |
| 0x0E | 00 1110 | Gepackter Pixelstrom, 16-bit RGB, 5-6-5 | Lang |
| 0x1E | 01 1110 | Gepackter Pixelstrom, 18-bit RGB, 6-6-6 | Lang |
| 0x2E | 10 1110 | Lose gepackter Pixelstrom, 18-bit RGB, 6-6-6 | Lang |
| 0x3E | 11 1110 | Gepackter Pixelstrom, 24-bit RGB, 8-8-8 | Lang |
| 0xX0 / 0xXF / unspecified | XX 0000 / XX 1111 | NICHT VERWENDEN. Nicht angegebene Codes sind reserviert. |  |

5. DCS Write

![DCS-Write-Typen](/docs/rockchip-rtthread-display/assets/cn-p016-figure-02.png)

*DCS-Write-Typen*

| Data Type (hex) | Data Type (binary) | Beschreibung | Pakettyp |
| --- | --- | --- | --- |
| 0x05 | 00 0101 | DCS Short WRITE, ohne Parameter | Kurz |
| 0x15 | 01 0101 | DCS Short WRITE, 1 Parameter | Kurz |
| 0x39 | 11 1001 | DCS-Long-Write/write_LUT-Befehlspaket | Lang |

Ein DCS-Paket enthält ein Befehlsbyte und n Parameterbytes. Für n < 2 wird ein Short Packet verwendet: n=0 sendet nur den Befehl mit Data Type 0x05; n=1 einen Parameter mit Data Type 0x15. Für n >= 2 wird ein Long Packet mit Befehl und n Parametern, Data Type 0x39, verwendet.

6. Generic Write

![Generic-Write-Typen](/docs/rockchip-rtthread-display/assets/cn-p016-figure-03.png)

*Generic-Write-Typen*

| Data Type (hex) | Data Type (binary) | Beschreibung | Pakettyp |
| --- | --- | --- | --- |
| 0x03 | 00 0011 | Generic Short WRITE, ohne Parameter | Kurz |
| 0x13 | 01 0011 | Generic Short WRITE, 1 Parameter | Kurz |
| 0x23 | 10 0011 | Generic Short WRITE, 2 Parameter | Kurz |
| 0x29 | 10 1001 | Generic Long Write | Lang |

Ein Generic Packet enthält n Parameterbytes. Für n < 3 wird ein Short Packet verwendet: n=0 ohne Parameter, Data Type 0x03; n=1 mit einem Parameter, 0x13; n=2 mit zwei Parametern, 0x23. Für n >= 3 wird ein Long Packet mit n Parametern, Data Type 0x29, verwendet.

7. Delay bezeichnet die Wartezeit in ms nach dem aktuellen Paket vor dem nächsten Befehl.

8. Payload Length ist die Nutzdatenlänge des Pakets.

9. Payload sind die Nutzdaten mit der Länge Payload Length.

10. Beispiel

![Dimmwerte und Befehle](/docs/rockchip-rtthread-display/assets/cn-p017-figure-01.png)

*Dimmwerte und Befehle*

| Command | R/W | Values | Beschreibung |
| --- | --- | --- | --- |
| 0xF0 | W | { 0x5A, 0x5A } | Level2-Schlüsselzugriff aktivieren |
| 0xB0 | W | { 0x07 } |  |
| 0xB7 | W | { 0xXX }; /* 0xFF : 255Frames; ~; 0x01 : 1Frame */ | Dimmgeschwindigkeit einstellen |
| 0xF0 | W | { 0xA5, 0xA5 } | Level2-Schlüsselzugriff deaktivieren |
| 0x53 | W | { 0x28 } | WRCTRLD |
| 0x51 | W | { 0xXX, 0xXX }; /* Brightness can control */ | WRDISBV |

```text
/* 5.1 Dimming Setting */
{0x29, 0x00, 0x03, {0xf0, 0x5a, 0x5a}},
{0x23, 0x00, 0x02, {0xb0, 0x07}},
{0x23, 0x00, 0x02, {0xb7, 0x01}},
{0x29, 0x00, 0x03, {0xf0, 0xa5, 0xa5}},
{0x15, 0x00, 0x02, {0x53, 0x28}},
{0x39, 0x00, 0x03, {0x51, 0x03, 0xff}},
```

## 7. Werkzeug display_test

display_test gilt nur für RK2108. Andere Plattformen verwenden das unten beschriebene modetest für Anzeigetests.

### 7.1 Unterstützte Testfälle

Befehl:

```text
display_test cmd
dsc; winloop; winmove; winalpha; scale; coe;  bcsh; gamma; clip; mipi_switch;
ebook; color_bar
```

| Parameter | Beschreibung |
| --- | --- |
| winloop | Ebenen-loop testen |
| winmove | Ebenenbewegung testen |
| dsc | Teilaktualisierung mit DSC-Ausrichtung eines 2k-Panels testen |
| winalpha | Ebenen-Alpha testen |
| scale | Nachgelagerte Skalierung testen |
| coe | Farbumwandlung testen; Demo verwendet 709to2020 |
| bcsh | Helligkeit, Kontrast, Sättigung und Farbton über BCSH testen |
| gamma | Anzeigeeffekt mit Gamma-Kurve ändern |
| clip | Clip testen |
| mipi_switch | MIPI switch testen |
| ebook | E-Book-Demo mit 1bpp-Bild |
| color_bar | Demo mit umlaufenden Farbbalken |

### 7.2 Demoablauf

1. LCD-Gerät suchen.

```text
g_display_dev = rt_device_find("lcd");
RT_ASSERT(g_display_dev != RT_NULL);
```

2. LCD-Gerät öffnen.

```text
ret = rt_device_open(g_display_dev, RT_DEVICE_FLAG_RDWR);
RT_ASSERT(ret == RT_EOK);
```

3. LCD-Gerät aktivieren.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_ENABLE, NULL);
RT_ASSERT(ret == RT_EOK);
```

4. Panelinformationen abrufen.

```text
ret = rt_device_control(g_display_dev, RTGRAPHIC_CTRL_GET_INFO, (void *)graphic_info);
RT_ASSERT(ret == RT_EOK);
```

5. win_config und post_scale initialisieren. win_config-Initialisierung:

```text
static void display_win_init(struct CRTC_WIN_STATE *win_config)
{
    win_config->winEn = true;
    win_config->winId = 0;
    win_config->zpos  = 0;
    win_config->format   = SRC_DATA_FMT;
    win_config->yrgbAddr = (uint32_t)rtt_framebuffer_test;
    win_config->cbcrAddr = (uint32_t)rtt_framebuffer_uv;
    win_config->yrgbLength = 0;
    win_config->cbcrLength = 0;
    win_config->xVir = SRC_DATA_W;
    win_config->srcX = 0;
    win_config->srcY = 0;
    win_config->srcW = SRC_DATA_W;
    win_config->srcH = SRC_DATA_H;
    win_config->crtcX = 0;
    win_config->crtcY = 0;
    win_config->crtcW = SRC_DATA_W;
    win_config->crtcH = SRC_DATA_H;
    win_config->xLoopOffset = 0;
    win_config->yLoopOffset = 0;
}
```

post_scale für Vollbild ohne Skalierung initialisieren:

```text
static void display_post_init(struct CRTC_WIN_STATE *win_config,
                              struct VOP_POST_SCALE_INFO *post_scale,
                              struct rt_device_graphic_info *graphic_info)
{
    post_scale->srcW = graphic_info->width;
    post_scale->srcH = graphic_info->height;
    post_scale->dstX = 0;
    post_scale->dstY = 0;
    post_scale->dstW = graphic_info->width;
    post_scale->dstH = graphic_info->height;
}
```

post_scale für Teilaktualisierung mit zweifacher horizontaler und vertikaler Vergrößerung initialisieren:

```text
static void display_post_init(struct CRTC_WIN_STATE *win_config,
                              struct VOP_POST_SCALE_INFO *post_scale,
                              struct rt_device_graphic_info *graphic_info)
{
    post_scale->srcW = graphic_info->width / 2;
    post_scale->srcH = win_config->srcH;
    post_scale->dstX = 0;
    post_scale->dstY = 0;
    post_scale->dstW = graphic_info->width;
    post_scale->dstH = win_config->srcH * 2;
}
```

6. LUT-Palette für bpp-Bilder laden; bei anderen Formaten überspringen.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_LOAD_LUT, &lut_state);
RT_ASSERT(ret == RT_EOK);
```

7. post_scale mit Datenabmessungen vor und Anzeigeabmessungen nach der Skalierung konfigurieren.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_SCALE, post_scale);
RT_ASSERT(ret == RT_EOK);
```

8. Ebeneninformationen in win_config konfigurieren.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_PLANE, win_config);
RT_ASSERT(ret == RT_EOK);
```

9. Anzeige übernehmen.

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_COMMIT, NULL);
RT_ASSERT(ret == RT_EOK);
```

Für ein Bild Schritte 1–9 ausführen. Für mehrere Bilder win_config und post_scale ändern und Schritte 7, 8 und 9 wiederholen.

### 7.3 Koordinaten der Teilaktualisierung

1. Demo für Panels mit Teilaktualisierung in X und Y.

![XY-Teilaktualisierungskoordinaten](/docs/rockchip-rtthread-display/assets/cn-p021-figure-01.png)

*XY-Teilaktualisierungskoordinaten*

Der rote Bereich ist win0 bei (X0,Y0), Größe (W0,H0). Konfiguration:

```text
win_config->winId = 0;
win_config->winEn = 1;
……
win_config->srcX = X0;
win_config->srcY = Y0;
win_config->srcW = W0;
win_config->srcH = H0;
```

Der grüne Bereich ist win1 bei (X1,Y1), Größe (W1,H1). Konfiguration:

```text
win_config->winId = 1;
win_config->winEn = 1;
……
win_config->srcX = X1;
win_config->srcY = Y1;
win_config->srcW = W1;
win_config->srcH = H1;
```

Konfiguration der nachgelagerten Skalierung:

```text
post_scale->srcW = W1;
post_scale->srcH = H2;
post_scale->dstX = X1;
post_scale->dstY = Y0;
post_scale->dstW = W1;
post_scale->dstH = H2;
```

Im Anzeigecode zuerst die nachgelagerte Skalierung konfigurieren:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_SCALE, post_scale);
RT_ASSERT(ret == RT_EOK);
```

Danach WIN0 und WIN1 konfigurieren:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_PLANE, win_config);
RT_ASSERT(ret == RT_EOK);
```

Abschließend die Anzeige übernehmen:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_COMMIT, NULL);
RT_ASSERT(ret == RT_EOK);
```

2. Demo für Teilaktualisierung nur in Y, ohne X-Unterstützung.

![Teilaktualisierungskoordinaten nur Y](/docs/rockchip-rtthread-display/assets/cn-p023-figure-01.png)

*Teilaktualisierungskoordinaten nur Y*

Der rote Bereich ist win0 bei (X0,Y0), Größe (W0,H0). Konfiguration:

```text
win_config->winId = 0;
win_config->winEn = 1;
……
win_config->srcX = X0;
win_config->srcY = Y0;
win_config->srcW = W0;
win_config->srcH = H0;
```

Der grüne Bereich ist win1 bei (X1,Y1), Größe (W1,H1). Konfiguration:

```text
win_config->winId = 1;
win_config->winEn = 1;
……
win_config->srcX = X1;
win_config->srcY = Y1;
win_config->srcW = W1;
win_config->srcH = H1;
```

Konfiguration der nachgelagerten Skalierung:

```text
post_scale->srcW = Xres;
post_scale->srcH = H2;
post_scale->dstX = 0;
post_scale->dstY = Y0;
post_scale->dstW = Xres;
post_scale->dstH = H2;
```

Ohne X-Teilaktualisierung sind anders als in Fall 1 die Post-Scale-Quellbreite und dstW gleich der tatsächlichen Panelbreite Xres; dstX ist 0. Die übrigen Schritte entsprechen Fall 1. Zuerst die Skalierung konfigurieren:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_SCALE, post_scale);
RT_ASSERT(ret == RT_EOK);
```

Danach WIN0 und WIN1 konfigurieren:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_SET_PLANE, win_config);
RT_ASSERT(ret == RT_EOK);
```

Abschließend die Anzeige übernehmen:

```text
ret = rt_device_control(g_display_dev, RK_DISPLAY_CTRL_COMMIT, NULL);
RT_ASSERT(ret == RT_EOK);
```

## 8. Werkzeug modetest

### 8.1 Unterstützte Testfälle

```text
modetest [-afgp]

        -p <plane_id>:<w>x<h>:<crtc_w>x<crtc_h>[+<x>+<y>][#<zpos>][@<format>]  set plane
        -f <pattern>    specify fill pattern
        -a      test alpha
        -g      test gamma
```

Beispielbefehl:

```text
modetest -p 0:720x1280:720x1280@AR24 -a -g
```

## 9. Color Key

VOP kann eine gewählte Farbe einer Ebene vollständig transparent machen und so die nächste Ebene oder den Hintergrund zeigen. Der Treiber verwendet win_config.colorKey: Bits [23,0] enthalten die RGB-Schlüsselkomponenten, bit24 aktiviert/deaktiviert die Funktion. In den RGB888-/RGB565-Beispielen stehen R_VAL, G_VAL und B_VAL für die transparent zu machenden Farbwerte.

```text
#define COLOR_KEY_EN    BIT(24)
```

### 9.1 Color Key für RGB888 konfigurieren

1. Rot vollständig transparent machen:

```text
win_config->colorKey = 0xFF0000 | COLOR_KEY_EN;
```

2. Grün vollständig transparent machen:

```text
win_config->colorKey = 0x00FF00 | COLOR_KEY_EN;
```

3. Blau vollständig transparent machen:

```text
win_config->colorKey = 0x0000FF | COLOR_KEY_EN;
```

Das heißt:

```text
win_config->colorKey = (R_VAL << 16) | (G_VAL << 8) | (B_VAL) | COLOR_KEY_EN;
```

### 9.2 Color Key für RGB565 konfigurieren

1. Rot vollständig transparent machen:

```text
win_config->colorKey = 0xF80000 | COLOR_KEY_EN;
```

2. Grün vollständig transparent machen:

```text
win_config->colorKey = 0x00FC00 | COLOR_KEY_EN;
```

3. Blau vollständig transparent machen:

```text
win_config->colorKey = 0x0000F8 | COLOR_KEY_EN;
```

Das heißt:

```text
R_VAL_CONFIG = R_VAL << 3;  //R[4,0] -> R[7,0]

G_VAL_CONFIG = G_VAL << 2;  //G[5,0] -> G[7,0]

B_VAL_CONFIG = B_VAL << 3;  //B[4,0] -> B[7,0]

win_config->colorKey = (R_VAL_CONFIG  << 16) | (G_VAL_CONFIG << 8) | B_VAL_CONFIG | COLOR_KEY_EN;
```

### 9.3 Color Key deaktivieren

```text
win_config->colorKey = 0;
```

## 10. LUT aktualisieren

Eine Ebenen-LUT benötigt lut_en. Nach Aktivierung ist die LUT geschützt; ihre Register können weder gelesen noch geschrieben werden. Änderungen an lut_en werden bildweise wirksam. Für eine LUT-Aktualisierung beim Szenariowechsel wie folgt vorgehen:

1. LUT deaktivieren. (1) Ein Nicht-bpp-Ebenenformat wählen, also keines der folgenden:

```text
RTGRAPHIC_PIXEL_FORMAT_GRAY1
RTGRAPHIC_PIXEL_FORMAT_GRAY4,
RTGRAPHIC_PIXEL_FORMAT_GRAY16,
RTGRAPHIC_PIXEL_FORMAT_GRAY256,
RTGRAPHIC_PIXEL_FORMAT_RGB332,
```

(2) Alle Ebenen deaktivieren und ein 32x32-Bild an einer Stelle ohne Anzeigeinhalt aktualisieren. 32x32 ist nicht verbindlich: Ein unwirksames Bild soll die lut_en-Abschaltung übernehmen, ohne den aktuellen Bildinhalt zu beeinflussen.

2. LUT-Array aktualisieren und RK_DISPLAY_CTRL_LOAD_LUT aufrufen.

3. Neues Bild konfigurieren: win auf das passende bpp-Format setzen und ein Bild aktualisieren. Damit wird die neue LUT wirksam.

## 11. Referenzen

1. Rockchip DRM Display Driver Development Guide

2. Rockchip_DRM_Panel_Porting_Guide.pdf

{% endraw %}
