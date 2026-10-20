---
title: "Vollständiger Rockchip-eDP-Entwicklerleitfaden: Panels, Link-Training, PSR und Signal-Debugging"
description: "Vollständige eDP-Architektur, DTS, EDID-Timing, PSR, Zweikanalkonfiguration, Debug-Befehle und Diagnose-Patches für AUX und Link-Training."
translation_key: "045-rockchip-edp"
slug: "045-rockchip-edp"
lang: "de"
date: "2026-10-16"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "linux"
products: []
tags: ["eDP", "RK3288", "RK3399", "RK3568", "RK3588", "RK3576", "PSR"]
keywords: "ArmSoM Rockchip eDP Panel Link Training PSR RK3576 RK3588"
excerpt: "Vollständige eDP-Architektur, DTS, EDID-Timing, PSR, Zweikanalkonfiguration, Debug-Befehle und Diagnose-Patches für AUX und Link-Training."
---

{% raw %}

# Vollständiger Rockchip-eDP-Entwicklerleitfaden: Panels, Link-Training, PSR und Signal-Debugging

Dies ist eine Rockchip-eDP-Plattformreferenz. Die Produkttabelle der Quelle nennt RK3288/RK3399 mit Linux-Kernel 4.4 oder neuer, RK356x mit 4.19 oder neuer, RK3588 mit 5.10 oder neuer und RK3576 mit 6.1 oder neuer. Prüfen Sie bei einem ArmSoM-Projekt den tatsächlichen SoC, die herausgeführte eDP-Schnittstelle, Panel-Stromversorgung und Hintergrundbeleuchtung, HPD-/PHY-Verdrahtung, SDK/BSP und Kernel-Patches. SoC-Fähigkeiten bedeuten keine Unterstützung auf jedem Board. Eine Prüfung an ArmSoM-Hardware wurde nicht durchgeführt; der PSR-Wert von 470mW, Protokolle und Anzeigefotos sind Beispiele aus der Quelle, keine ArmSoM-Messungen.

Quelle: Rockchip eDP Interface Developer Guide, in beiden Quellsprachen V2.3.0. Die chinesische Fassung folgt der chinesischen Quelle; Englisch, Russisch und diese deutsche Fassung folgen der englischen Quelle mit denselben technischen Kapiteln. Die chinesischen Abbildungen stammen aus dem chinesischen PDF, die englischen, russischen und deutschen aus dem englischen PDF. Widersprüche der Quelle, einschließlich der RK3399-Datenratentabelle gegenüber dem Bandbreitenbeispiel, sind dokumentiert, ohne Adressen oder Konfigurationskonstanten stillschweigend zu ändern.

[Redaktionelle Hinweise](/docs/rockchip-edp/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Überblick

Dieses Dokument beschreibt die grundlegenden Funktionen, Abläufe und die Analyse häufiger Probleme der eDP-Anzeigeschnittstelle von Rockchip-Prozessoren. Es soll Ingenieuren das Treiberframework und die Hardware-Schnittstelle näherbringen und anhand typischer Fehleranalysen eine schnelle Eingrenzung, Optimierung und Behebung von Problemen ermöglichen.

## 2. Grundlagen von eDP

### 2.1 DRM-Anzeigeframework

Die Interaktion zwischen Anwendungen und dem DRM-Treiber über libdrm erfolgt wie folgt:

![Technische Originalabbildung (englisches PDF, S. 6)](/docs/rockchip-edp/assets/en-p6-1.png)

### 2.2 Systemarchitektur der eDP-Schnittstelle

Die folgende Abbildung zeigt ein typisches eDP-Anwendungsblockdiagramm:

![Technische Originalabbildung (englisches PDF, S. 7)](/docs/rockchip-edp/assets/en-p7-1.png)

Das eDP-Protokoll erweitert DP (Display Port) für eingebettete Anwendungen und wird verbreitet in Laptops, Tablets und Mobiltelefonen eingesetzt.

Die eDP-Hardware-Schnittstelle besteht hauptsächlich aus Main-Link, AUX CH und HPD, die gemeinsam die Kommunikation zwischen eDP-Quelle (Source) und -Senke (Sink) ermöglichen.

Main-Link: Besteht aus 1/2/4 differentiellen Signalpaaren zur Übertragung von Video- und Audiodatenströmen.

eDP v1.3 unterstützt RBR 1.62G/HBR 2.7G/HBR2 5.4G bps/lane; eDP v1.4 ergänzt die vier empfohlenen Datenraten R216 2.16G/R243 2.43G/R324 3.24G/R432 4.32G bps/lane.

AUX CH: Ein differentielles Halbduplex-Datenpaar zum Austausch von Konfigurationsinformationen zwischen Source und Sink, etwa DPCD-Lese-/Schreibzugriffen und EDID-Auswertung, mit 1 Mbps Übertragungsrate.

HPD: Auf der Source-Seite normalerweise ein einzelner Pin zur Hotplug-Erkennung. Er erkennt den Verbindungsstatus des Sink-Geräts und reagiert auf dessen HDP-IRQ-Anforderungen (Schreibweise der Quelle).

Beim Wechsel des Sink-Geräts von getrennt zu verbunden muss der HPD-Pin von Low auf High wechseln.

HPD kann den Betriebszustand des Sink-Geräts anzeigen. High bedeutet normalerweise, dass die Senke für die normale Anzeige bereit ist. Es wird empfohlen, bereits beim Hardwaredesign die HPD-Pins von Source und Sink zu verbinden.

### 2.3 eDP-Link-Training

![Technische Originalabbildung (englisches PDF, S. 8)](/docs/rockchip-edp/assets/en-p8-1.png)

Wie oben dargestellt, läuft das Link-Training folgendermaßen ab:

1: Nach dem Einschalten sendet die Senke einen HPD-Plug-Impuls an die Quelle;

2-3: Die Quelle liest die DPCD der Senke, um deren unterstützte Funktionen zu bestimmen;

4-5: Die Quelle liest die EDID der Senke, um deren unterstützte Anzeigetimings zu bestimmen;

6: Die Quelle schreibt die Link-Konfiguration in DPCD, etwa MAX_LINK_RATE und MAX_LANE_COUNT;

7: Die Quelle startet das Link-Training; die Senke führt Taktrückgewinnung und Entzerrung durch;

8-9: Die Quelle liest den Link-Status aus DPCD, um das Trainingsergebnis zu bestimmen. Bei einem Fehler geht sie zu Schritt 7 zurück;

10: Nach erfolgreichem Link-Training sendet die Quelle MSA-Daten. Die Senke wertet die Videostream-Konfiguration aus und gewinnt den Stream-Takt zurück;

11: Die Quelle überträgt den Videodatenstrom.

## 3. eDP auf der Rockchip-Plattform

### 3.1 Funktionsmerkmale

| Merkmal | RK3288 | RK3399 | RK3568 | RK3588 | RK3576 |
| --- | --- | --- | --- | --- | --- |
| eDP-Version | v1.3 | v1.3 | v1.3 | v1.3 | v1.3 |
| DP-Modus | Nicht unterstützt | Nicht unterstützt | Nicht unterstützt | v1.2 | v1.2 |
| Maximale Auflösung | 2560x1600@60Hz | 2560x1600@60Hz | 2560x1600@60Hz | 3840x2160@60Hz | 3840x2160@60Hz |
| Main-Link-Lanes | 1/2/4 Lanes | 1/2/4 Lanes | 1/2/4 Lanes | 1/2/4 Lanes | 1/2/4 Lanes |
| Main-Link-Datenrate | 2.7/1.62 Gbps/lane | 2.7/1.62 Gbps/lane | 2.7/1.62 Gbps/lane | 5.4/4.32/3.24/2.7/2.43/2.16/1.62 Gbps/lane | 5.4/4.32/3.24/2.7/2.43/2.16/1.62 Gbps/lane |
| AUX_CH | 1 M | 1 M | 1 M | 1 M | 1 M |
| Farbformat | RGB | RGB | RGB | RGB/YUV444/YUV422 | RGB/YUV444/YUV422 |
| Farbtiefe | 8 bpc | 8 bpc | 8 bpc | 8/10 bpc (6bpc nur für RGB) | 8/10 bit (6bpc nur für RGB) |
| ASSR | Unterstützt | Unterstützt | Unterstützt | Unterstützt | Unterstützt |
| I2S | Nicht unterstützt | Nicht unterstützt | Nicht unterstützt | Unterstützt | Unterstützt |
| SPDIF | Nicht unterstützt | Nicht unterstützt | Nicht unterstützt | Unterstützt | Unterstützt |
| PSR | Nicht unterstützt | Nicht unterstützt | Nicht unterstützt | Unterstützt | Unterstützt |
| Geteilter Anzeigemodus | Nicht unterstützt | Nicht unterstützt | Nicht unterstützt | Unterstützt | Unterstützt |

### 3.2 eDP-Verbindung mit VOP

Details stehen im Abschnitt „VOP2 Platform Display Pathway“ von „Rockchip_Developer_Guide_DRM_Display_Driver_CN“.

### 3.3 Treiberdateien

U-Boot-Treiber:

```text
/* Controller */
drivers/video/drm/analogix_dp.c
drivers/video/drm/analogix_dp.h

drivers/video/drm/analogix_dp_reg.c

/* PHY */
/* RK3568 */
drivers/phy/phy-rockchip-naneng-edp.c
/* RK3588/RK3576 */
drivers/phy/phy-rockchip-samsung-hdptx.c

/* Panel */
drivers/video/drm/rockchip_panel.c
```

Kernel-Treiber:

```text
/* Controller */
drivers/gpu/drm/bridge/analogix/analogix_dp_core.c

drivers/gpu/drm/bridge/analogix/analogix_dp_core.h
drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
drivers/gpu/drm/bridge/analogix/analogix_dp_reg.h
drivers/gpu/drm/rockchip/analogix_dp-rockchip.c
include/drm/bridge/analogix_dp.h

/* PHY */
/* RK3568 */
drivers/phy/rockchip/phy-rockchip-naneng-edp.c
/* RK3588/RK3576 */
drivers/phy/rockchip/phy-rockchip-samsung-hdptx.c

/* Panel */

drivers/gpu/drm/panel/panel-simple.c
```

Für den eDP-PHY von RK3288/RK3399 gibt es keinen separaten Treiber; PHY-Konfigurationsoperationen sind im Analogix-DP-Controller-Treiber enthalten.

## 4. Softwarekonfiguration

### 4.1 Modulaktivierung

#### 4.1.1 DTS-Konfiguration des Controllers

Die DTS-Konfiguration des eDP-Controllers hängt vom angeschlossenen Anzeigegerät ab. Unterschieden werden Panel- und Monitor-Szenarien. Nachfolgend dient die eDP0-Ausgabe des RK3588 als Beispiel.

4.1.1.1 HPD-Konfiguration

Obwohl HPD laut eDP-Protokoll optional ist, ist sein Pegel ein wichtiges Kriterium für den Betriebszustand der Senke. Die HPD-Konfiguration sollte deshalb bereits im Hardwaredesign berücksichtigt werden.

Bei einer Störung am Panel kann HPD den Hauptcontroller benachrichtigen, um Probleme zu vermeiden.

HPD kann durch ungünstige Timingkonfiguration verursachte Anzeigestörungen wie AUX-Fehler oder fehlgeschlagenes Link-Training wirksam reduzieren.

Unterstützt das Hardwaredesign keine HDP-Funktion (Quellschreibweise), muss Force HPD aktiviert werden. Für Designs mit HDP unterstützt Rockchip sowohl HPD über einen Funktionspin als auch über GPIO:

HPD erzwingen

```text
&edp0 {
 force-hpd;
};
```

HPD über Funktionspin:

```text
&edp0 {
 pinctrl-names = "default";
 pinctrl-0 = <&hdmim0_tx0_hpd>;

};
```

Die pinctrl-Konfigurationen der HPD-Funktionspins der verschiedenen Plattformen sind nachfolgend aufgeführt. Prüfen Sie sie anhand des konkreten Hardware-Schaltplans.

|  | Pinctrl-Konfiguration |
| --- | --- |
| RK3288 | edp_hpd (GPIO7_B3) |
| RK3399 | edp_hpd (GPIO4_C7) |
| RK3568 | edpdpm0_pins (GPIO4_C4) \| edpdpm1_pins (GPIO0_C2) |
| RK3588 | hdmim0_tx0_hpd (GPIO1_A5) \| hdmim0_tx1_hpd (GPIO1_A6) \| hdmim1_tx0_hpd (GPIO3_D4) \| hdmim1_tx1_hpd (GPIO3_B7) |
| RK3576 | edp_txm0_pins (GPIO4_C1) \| edp_txm1_pins (GPIO0_B6) |

HPD über GPIO:

Für die HPD-Funktion kann ein beliebiger GPIO gewählt werden.

```text
&edp0 {
 pinctrl-names = "default";
 pinctrl-0 = <&edp0_hpd>;

 hpd-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_HIGH>;
};

&pinctrl {
 edp {
   edp0_hpd: edp0-hpd {
    rockchip,pins = <1 RK_PA5 0 &pcfg_pull_none>;
   };
 };
};
```

Erkennt der Treiber fälschlich den Zustand Connected, obwohl Source und Sink nicht per Kabel verbunden sind, kann der entsprechende GPIO zur Stabilisierung mit Pull-down konfiguriert werden.

```text
&pinctrl {
 edp {
   edp0_hpd: edp0-hpd {

    rockchip,pins = <1 RK_PA5 0 &pcfg_pull_down>;
   };
 };
};
```

4.1.1.2 Panel-Szenario

```text
&edp0 {
   status = "okay";
   pinctrl-names = "default";

   pinctrl-0 = <&hdmim0_tx0_hpd>;

   ports {
      port@1 {
         reg = <1>;

         edp_out_panel: endpoint {
           remote-endpoint = <&panel_in_edp>;
         };
      };
   };
};
```

4.1.1.3 Monitor-Szenario

Die eDP-Schnittstelle von RK3588/RK3576 unterstützt DP-Modus. Bei Verwendung als DP muss HPD konfiguriert werden; siehe „HPD-DTS-Konfiguration“.

Siehe arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4-v10-hdmi2dp.dts. Der Name erklärt sich daraus, dass HDMI und eDP einen Combo-PHY nutzen und dieses Board die HDMI-Buchse direkt in eine DP-Buchse umsetzt, um eDP als DP zu verwenden:

```text
&edp1 {
   pinctrl-names = "default";
   pinctrl-0 = <&hdmim0_tx1_hpd>;

   status = "okay";
};
```

#### 4.1.2 DTS-Konfiguration des PHY

RK3568/RK3588/RK3576 benötigen eine PHY-DTS-Konfiguration, RK3288/RK3399 hingegen nicht.

```text
/* RK3568 */
&edp_phy {
      status = "okay";

};

/* RK3588/RK3576 */
&hdptxphy0 {
     status = "okay";
};

&hdptxphy_hdmi0 {
     status = "disabled";
};
```

Bei RK3588 und RK3576 teilen eDP und HDMI einen Combo-PHY. Stellen Sie bei eDP-Nutzung sicher, dass die entsprechenden HDMI-PHY-Knoten hdptxphy_hdmi0/hdptxphy_hdmi1 deaktiviert sind.

Bei RK3588 und RK3576 kann der eDP-PHY eine konfigurierte Link-Training-Tabelle anstelle der Standardwerte verwenden, etwa zur Optimierung der Signalqualität und Anpassung von Augendiagrammkennwerten.

```text
&hdptxphy0 {
      /* Single Vdiff Training Table (optional) */
      training-table = /bits/ 8 <

         /* voltage swing 0, pre-emphasis 0->3 */
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         /* voltage swing 1, pre-emphasis 0->2 */
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         /* voltage swing 2, pre-emphasis 0->1 */
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04

         /* voltage swing 3, pre-emphasis 0 */
         0x0d 0x0a 0x04 0x06 0x00 0x04
      >;
      status = "okay";
};
```

eDP auf RK3588 und RK3576 unterstützt das Vertauschen differentieller Lane-Signale P/N. Dies ist für Hardwaredesigns vorgesehen, bei denen Lane-P/N zwischen Source und Sink vertauscht sind. Referenzkonfiguration:

```text
&hdptxphy0 {
      /* swap lane1 P/N */

      lane-polarity-invert = <0 1 0 0>;
      status = "okay";
};
```

#### 4.1.3 DTS-Konfiguration des Panels

Im Panel-Szenario wird das eDP-Anzeigetiming über den Panel-Treiber übermittelt. Auf Rockchip ist dies drivers/gpu/drm/panel/panel-simple.c.

Ab Kernel 5.10 siehe Documentation/devicetree/bindings/display/panel/panel-simple.yaml.

Für Kernel 4.19 und älter siehe Documentation/devicetree/bindings/display/panel/simple-panel.txt.

Für eine normale eDP-Anzeige muss das Panel-Timing ausgegeben werden. Informationen dazu stehen im Abschnitt „Scan Timing Description“ von „Rockchip_Developer_Guide_DRM_Display_Driver_CN.pdf“.

Panel-Timing kann auf folgende Weise ermittelt werden:

Durch Lesen der EDID (empfohlen)

Aus der Tabelle der Signaltiming-Spezifikationen im Panel-Datenblatt

Durch Anfrage beim Panel-Hersteller

Hinweis: Bei manchen Panels ist die EDID beschädigt und nicht lesbar. Verwenden Sie dann ein anderes Verfahren zur Timingermittlung.

Es gibt zwei DTS-Konfigurationsverfahren:

Keinen Timing-Knoten konfigurieren; Timing über EDID ermitteln und ausgeben (empfohlen)

Einen Timing-Knoten konfigurieren und das fest eingestellte Timing ausgeben

Anforderungen an HPD und Verzögerungen:

Ohne konfigurierten Timing-Knoten muss HPD im Hardwaredesign verbunden sein, um Probleme durch fehlerhafte Zeitabläufe zu verhindern.

Auch bei konfiguriertem Timing-Knoten wird eine HPD-Verbindung empfohlen.

Ist HPD nicht verbunden, muss prepare-delay-ms die Zeit zwischen Einschalten von VCC und erstem AUX-Zugriff so festlegen, dass die Einschalt-Timinganforderungen des Panels erfüllt werden.

4.1.3.1 DTS-Konfiguration mit EDID

Am Beispiel RK3588S EVB1 liegt die entsprechende DTS für Kernel 6.1 unter arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi.

```text
panel-edp {
   compatible = "simple-panel";
   backlight = <&backlight>;

   power-supply = <&vcc3v3_lcd_edp>;
   prepare-delay-ms = <120>;
   enable-delay-ms = <120>;
   unprepare-delay-ms = <120>;
   disable-delay-ms = <120>;
   width-mm = <120>;
   height-mm = <160>;

   port {
      panel_in_edp: endpoint {
         remote-endpoint = <&edp_out_panel>;
      };
   };

};
```

Passen Sie pwms im backlight-Knoten an die tatsächliche Verdrahtung an. Die Hintergrundbeleuchtung muss vor der Bildanzeige ordnungsgemäß eingeschaltet sein.

Details enthält die PWM-Referenz Rockchip_Developer_Guide_Linux_PWM_CN.

power-supply konfiguriert die Panel-Stromversorgung.

Bei einer gestörten Senke wird das Panel oder die Bridge häufig durch Aus- und Einschalten zurückgesetzt. Stellen Sie sicher, dass der Hauptcontroller die Panel-Stromversorgung ein- und ausschalten kann.

enable-gpios/reset-gpios konfiguriert die Enable-/Reset-Pins des Panels entsprechend der tatsächlichen Schaltung.

(Optional) Der enable-Pin aktiviert gewöhnlich die panelseitige Stromversorgung; die GPIO-Konfiguration hängt von der Versorgungsschaltung ab.

(Optional) Der Reset-Pin ist normalerweise direkt am Panel herausgeführt. Die Auslösebedingungen stehen im Datenblatt; die GPIO-Konfiguration hängt von der Reset-Schaltung ab.

Die delay-ms-Konfiguration muss die im Panel-Datenblatt angegebenen Ein-/Ausschalt- und Reset-Zeiten erfüllen.

(Optional) enable-delay-ms/disable-delay-ms steuert die Wartezeit nach Aktivierung bzw. vor Deaktivierung des enable-Pins.

(Optional) reset-delay-ms steuert die Wartezeit nach Aktivierung des Reset-Pins.

(Optional) prepare-delay-ms/unprepare-delay-ms steuert die Wartezeit nach Einschalten bzw. vor Ausschalten von power-supply.

(Die folgende Erläuterung zu delay-ms stammt aus Documentation/devicetree/bindings/display/panel/panel-simple.yaml.)

```text
......
 prepare-delay-ms:
   description: |

    the time (in milliseconds) that it takes for the panel to
    become ready and start receiving video data
 enable-delay-ms:
   description: |
    the time (in milliseconds) that it takes for the panel to
    display the first valid frame after starting to receive
    video data
 disable-delay-ms:
   description: |
    the time (in milliseconds) that it takes for the panel to
    turn the display off (no content is visible)
 unprepare-delay-ms:

   description: |
    the time (in milliseconds) that it takes for the panel
    to power itself down completely
 reset-delay-ms:
   description: |
    the time (in milliseconds) that it takes for the panel to
    reset itself completely
 init-delay-ms:
   description: |
    the time (in milliseconds) that it takes for the panel to
    send init command sequence after reset deassert
......
```

4.1.3.2 DTS-Konfiguration mit festem Timing

Vorteile eines festen Panel-Timings in DTS:

Die Schnittstelle liest keine EDID mehr und vermeidet dadurch Fehler infolge fehlerhafter EDID-Abfragen.

Timingparameter können bedarfsgerecht angepasst werden, etwa bei erforderlicher Pixelausrichtung oder speziellen Taktteilungsverhältnissen.

Nachteile eines festen Panel-Timings in DTS:

Erfüllt das Timing die Panel-Anforderungen nicht, kann das Training scheitern oder die Anzeige gestört sein.

Bei Sonderfällen wie fehlerhaften EDID-Daten, besonderen Taktfrequenzen oder erforderlichen Timinganpassungen kann das Timing in DTS fest vorgegeben werden.

Die Beschreibung der DRM-Struktur display_timing und ihrer Variablen steht in include/video/display_timing.h. Beispiel:

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
 * Video ______________________XXXXXXXXXXXXXXXXXXXXXXX____________________
 *  |<- sync ->|<- back ->|<----- active ----->|<- front ->|<- sync..
 *  |    |  porch |        |  porch |
 *
 * HSync _|¯¯¯¯¯¯¯¯¯¯¯|___________________________________________|¯¯¯¯¯¯¯¯¯
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

Die grundlegenden Timingparameter werden wie folgt berechnet:

htotal = hsync_len + hback_porch + hactive + hfront_porch

hsync_start = hfront_porch + hactive

hsync_end = htotal - hback_porch = hsync_len + hactive + hfront_porch

vtotal = vsync_len + vback_porch + vactive + vfront_porch

vsync_start = vfront_porch + vactive

vsync_end = vtotal - vback_porch = vsync_len + vactive + vfront_porch

Nach Ermittlung des Timings wird es im Panel-Knoten konfiguriert. DRM erkennt die Parameter und trägt sie in die entsprechende display_timing-Struktur ein. Referenzkonfiguration:

```text
panel-edp {
   compatible = "simple-panel";
   backlight = <&backlight>;
   power-supply = <&vcc3v3_lcd_edp>;

   prepare-delay-ms = <120>;
   enable-delay-ms = <120>;
   unprepare-delay-ms = <120>;
   disable-delay-ms = <120>;
   width-mm = <120>;
   height-mm = <160>;

   panel-timing {
      clock-frequency = <200000000>;
      hactive = <1536>;
      vactive = <2048>;
      hfront-porch = <12>;

      hsync-len = <16>;
      hback-porch = <48>;
      vfront-porch = <8>;
      vsync-len = <4>;
      vback-porch = <8>;
      hsync-active = <0>;
      vsync-active = <0>;
      de-active = <0>;
      pixelclk-active = <0>;
   };

   port {
      panel_in_edp: endpoint {

         remote-endpoint = <&edp_out_panel>;
      };
   };
};
```

clock-frequency bestimmt die VOP-Ausgabebildrate. Die Berechnung benötigt die DRM-Timingparameter htotal und vtotal.

Falls eine spezielle clock-frequency nicht durch Taktteilung erzeugt werden kann, lässt sich testweise auf ganze MHz runden, indem die niedrigeren Stellen auf null gesetzt werden.

Zur Bildratenberechnung siehe drm_mode_vrefresh() in drivers/gpu/drm/drm_modes.c. Mit fr als Bildrate lautet die Formel:

```text
fr = clock / (htotal * vtotal)
```

```text
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

hsync-active/vsync-active/de-active/pixelclk-active bestimmen die Polarität der Synchronisationssignale hsync/vsync/den und pixelclk. Makrodefinitionen stehen im folgenden Abschnitt zu display_flags.

hsync-active = <0>; entspricht DISPLAY_FLAGS_HSYNC_LOW, also Low-aktivem HSYNC; andernfalls gilt DISPLAY_FLAGS_HSYNC_HIGH für High-aktives HSYNC.

vsync-active = <0>; entspricht DISPLAY_FLAGS_VSYNC_LOW, also Low-aktivem VSYNC; andernfalls gilt DISPLAY_FLAGS_VSYNC_HIGH für High-aktives VSYNC.

de-active = <0>;

Entspricht DISPLAY_FLAGS_DE_LOW für Low-aktives DEN; andernfalls gilt DISPLAY_FLAGS_DE_HIGH für High-aktives DEN.

pixelclk-active = <0>; entspricht DISPLAY_FLAGS_PIXDATA_NEGEDGE: DATA ist auf der fallenden Taktflanke gültig. Andernfalls gilt DISPLAY_FLAGS_PIXDATA_POSEDGE für Gültigkeit auf der steigenden Taktflanke.

4.1.3.2.1 Timing anhand der EDID zurückschreiben

Ist im DTS-Panel-Knoten kein Timing-Knoten konfiguriert (EDID-Beispiel in Abschnitt 4.1.3.1), werden standardmäßig die Panel-EDID-Informationen über AUX gelesen.

Nach Anschluss des Displays erscheinen folgende Informationen an der seriellen U-Boot-Konsole:

```text
#Old version code prints other EDID information
Maximum visible display size: 26 cm x 17 cm
Power management features: no active off, no suspend, no standby

Established timings:
Standard timings:
2400x1600 59 Hz (detailed)
Monitor name: LQ123P1JX31
Detailed mode clock 252750 kHz, flags[a]
H: 2400 2448 2480 2560
V: 1600 1603 1613 1646
bus_format: 1009
```

```text
#New version does not print other EDID information
edp@fded0000: detailed mode clock 148500 kHz, flags[5]
   H: 1920 2008 2052 2200

   V: 1080 1084 1089 1125
bus_format: 100a
```

Prüfen Sie unbedingt, dass die folgende Meldung nicht im U-Boot-Protokoll erscheint. Andernfalls ist im betreffenden DTS-Panel-Knoten weiterhin ein Timing konfiguriert, und die Schnittstelle liest keine EDID:

```text
Using display timing dts
```

Aus den obigen Informationen ergibt sich:

clock-frequency = 252750 kHz

hactive = 2400 hsync_start = 2448 hsync_end = 2480 htotal = 2560

vactive = 1600 vsync_start = 1603 vsync_end = 1613 vtotal = 1646

flags = 0xa

Diese flags entsprechen hsync-active/vsync-active/de-active/pixelclk-active und weiteren display_flags des Timing-Knotens.

Die Definition von display_flags steht in include/video/display_timing.h:

```text
enum display_flags {
   DISPLAY_FLAGS_HSYNC_LOW = BIT(0),
   DISPLAY_FLAGS_HSYNC_HIGH = BIT(1),

   DISPLAY_FLAGS_VSYNC_LOW = BIT(2),
   DISPLAY_FLAGS_VSYNC_HIGH = BIT(3),

   /* data enable flag */
   DISPLAY_FLAGS_DE_LOW = BIT(4),
   DISPLAY_FLAGS_DE_HIGH = BIT(5),
   /* drive data on pos. edge */
   DISPLAY_FLAGS_PIXDATA_POSEDGE = BIT(6),
   /* drive data on neg. edge */
   DISPLAY_FLAGS_PIXDATA_NEGEDGE = BIT(7),
   DISPLAY_FLAGS_INTERLACED = BIT(8),
   DISPLAY_FLAGS_DOUBLESCAN = BIT(9),
   DISPLAY_FLAGS_DOUBLECLK = BIT(10),
   /* drive sync on pos. edge */
   DISPLAY_FLAGS_SYNC_POSEDGE = BIT(11),

   /* drive sync on neg. edge */
   DISPLAY_FLAGS_SYNC_NEGEDGE = BIT(12),
};
```

bus_format = 1009

Bezeichnet das aktuell verwendete Farbformat; Details stehen in include/uapi/linux/media-bus-format.h

```text
/* RGB - next is 0x1024 */
#define MEDIA_BUS_FMT_RGB444_1X12 0x1016

#define MEDIA_BUS_FMT_RGB444_2X8_PADHI_BE 0x1001
#define MEDIA_BUS_FMT_RGB444_2X8_PADHI_LE 0x1002
#define MEDIA_BUS_FMT_RGB555_2X8_PADHI_BE 0x1003
#define MEDIA_BUS_FMT_RGB555_2X8_PADHI_LE 0x1004
#define MEDIA_BUS_FMT_RGB565_1X16 0x1017
#define MEDIA_BUS_FMT_BGR565_2X8_BE 0x1005
#define MEDIA_BUS_FMT_BGR565_2X8_LE 0x1006
#define MEDIA_BUS_FMT_RGB565_2X8_BE 0x1007
#define MEDIA_BUS_FMT_RGB565_2X8_LE 0x1008
#define MEDIA_BUS_FMT_RGB666_1X18 0x1009
#define MEDIA_BUS_FMT_RBG888_1X24 0x100e
#define MEDIA_BUS_FMT_RGB666_1X24_CPADHI 0x1015
#define MEDIA_BUS_FMT_RGB666_1X7X3_SPWG 0x1010

#define MEDIA_BUS_FMT_BGR888_1X24 0x1013
#define MEDIA_BUS_FMT_BGR888_3X8 0x101b
#define MEDIA_BUS_FMT_GBR888_1X24 0x1014
#define MEDIA_BUS_FMT_RGB888_1X24 0x100a
#define MEDIA_BUS_FMT_RGB888_2X12_BE 0x100b
#define MEDIA_BUS_FMT_RGB888_2X12_LE 0x100c
#define MEDIA_BUS_FMT_RGB888_3X8 0x101c
#define MEDIA_BUS_FMT_RGB888_3X8_DELTA 0x101d
#define MEDIA_BUS_FMT_RGB888_1X7X4_SPWG 0x1011
#define MEDIA_BUS_FMT_RGB888_1X7X4_JEIDA 0x1012
```

4.1.3.2.2 Berechnung anhand des Datenblatts

Die folgende Abbildung stammt aus dem Datenblatt des DTS-Beispielpanels "lg,lp079qx1-sp0v":

![Technische Originalabbildung (englisches PDF, S. 22)](/docs/rockchip-edp/assets/en-p22-1.png)

Bearbeitbare Übertragung der obigen Timingtabelle; leere Hinweisfelder bleiben leer:

| Eintrag | Beschreibung | Symbol | Min. | Typ. | Max. | Einheit | Hinweis |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | Frequenz | fCLK | - | 200.02 | - | MHz |  |
| Hsync | Aktiver Bereich | tWHA | - | 1536 | - | tCLK |  |
| Hsync | Periode | tHP | - | 1612 | - | tCLK |  |
| Hsync | Aktive Pulsbreite | tWH | - | 16 | - | tCLK |  |
| Vsync | Aktiver Bereich | tWVA | - | 2048 | - | tHP |  |
| Vsync | Periode | tVP | - | 2068 | - | tHP |  |
| Vsync | Aktive Pulsbreite | tWV | - | 4 | - | tHP |  |
| Data Enable | Horizontale hintere Schwarzschulter | tHBP | - | 48 | - | tCLK |  |
| Data Enable | Horizontale vordere Schwarzschulter | tHFP | - | 12 | - | tCLK |  |
| Data Enable | Vertikale hintere Schwarzschulter | tVBP | - | 8 | - | tHP |  |
| Data Enable | Vertikale vordere Schwarzschulter | tVFP | - | 8 | - | tHP |  |

Die Konfiguration kann entsprechend den Anwendungsanforderungen innerhalb der im Panel-Datenblatt angegebenen oberen und unteren Grenzwerte feinjustiert werden.

Tragen Sie die berechneten Timingparameter wie oben beschrieben fest in den eDP-Panel-Timing-Knoten ein, um das vorgegebene Timing auszugeben.

### 4.2 Funktionskonfiguration

#### 4.2.1 Panel-Selbsttestmodus

Dieser Modus wird üblicherweise bei der Panel-Fehlersuche verwendet. Ist die normale Anzeige gestört, der Panel-Selbsttest jedoch korrekt, arbeitet die Senke ordnungsgemäß; das Problem muss auf der Source-Seite untersucht werden. Details stehen bei den häufigen Problemen und Analyseverfahren.

Am Beispiel RK3588S EVB1 in arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi wird die Eigenschaft panel-self-test zum edp-Knoten hinzugefügt:

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
index 8c1d0f37b8a3..e58dd8aae2ee 100644

--- a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
@@ -262,6 +262,7 @@ &dp0_sound{
 };

 &edp0 {
+     panel-self-test;
      force-hpd;
      status = "okay";
```

Beim Panel "lg,lp079qx1-sp0v" wechselt der Panel-Selbsttest dynamisch zwischen den folgenden beiden Bildern:

![Technische Originalabbildung (englisches PDF, S. 23)](/docs/rockchip-edp/assets/en-p23-1.png)

![Technische Originalabbildung (englisches PDF, S. 24)](/docs/rockchip-edp/assets/en-p24-1.png)

#### 4.2.2 Controller-Selbsttestmodus

Dieser Modus dient üblicherweise der Panel-Fehlersuche. Ist die normale Anzeige gestört, nach Aktivierung des Controller-Selbsttests aber korrekt, ist die Kette eDP-Controller -> PHY -> Panel funktionsfähig. Die Analyse muss dann weiter stromaufwärts beim VOP erfolgen. Siehe dazu Rockchip_Developer_Guide_DRM_Display_Driver_CN.

Am Beispiel RK3588S EVB1 in arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi wird analogix,video-bist-enable im edp-Knoten ergänzt:

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi

index 8c1d0f37b8a3..07a9de32f910 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
@@ -262,6 +262,7 @@ &dp0_sound{
 };

 &edp0 {
+     analogix,video-bist-enable;
      force-hpd;
      status = "okay";
```

Der eDP-Controller-Selbsttest zeigt standardmäßig folgendes Bild:

![Technische Originalabbildung (englisches PDF, S. 25)](/docs/rockchip-edp/assets/en-p25-1.png)

#### 4.2.3 PSR-Modus

PSR (Panel Self-Refresh), eingeführt mit eDP v1.3, ist sowohl für Source als auch Sink optional. Die Funktion kann nur korrekt aktiviert werden, wenn beide Enden sie unterstützen.

Bei aktiviertem PSR wechseln VOP und eDP in der Anzeigepipeline VOP -> eDP -> Panel bei statischen Bildern, etwa einem unveränderten Android-Desktop, automatisch in einen Stromsparzustand. Das reduziert den Gesamtverbrauch. Mit der Kernel-6.1-Konfiguration arch/arm64/boot/dts/rockchip/rk3576-evb1-v10-edp-NE160QAM-NX1.dts und einem einzelnen Panel NE160QAM-NX1 bei statischem Desktop ergab die Quellmessung durch PSR eine mittlere Systemleistungsreduktion von ungefähr 470mW.

```text
commit 303b0de1b8fd9f33a8cbfa935e0885c53fe9f78c
Author: Damon Ding <damon.ding@rock-chips.com>

Date: Wed Jul 16 14:22:21 2025 +0800

   drm/bridge: analogix_dp: Add &analogix_dp_plat_data.disable_psr to check whether to
disable PSR

   First of all, since the PSR feature can help to reduce the power
   consumption, the Source device, which can support PSR function,
should enable PSR if the PSR capability of Sink device is detected
rather than depending on the user to add 'support-psr' DTS property
manually.


Different platforms that use the same Analogix DP bridge driver may
have different methods for parsing the PSR capability. Therefore, add
a new flag &analogix_dp_plat_data.disable_psr to disable PSR forcely,
which set in the platform side, should be more reasonable.

If the user truly does not want to enable PSR function or the Panel
has something wrong with it, the property 'rockchip,disable-psr' will
be helpful.

Fixes: 9622f2d0f10a ("drm/bridge: analogix_dp: disable PSR feature by default")
Change-Id: Id2fce34857df80de5a1ec97f342709a6e2840ed4

Signed-off-by: Damon Ding <damon.ding@rock-chips.com>
```

Bei Kernel-Versionen mit dem obigen Commit prüft der eDP-Treiber die PSR-Unterstützung der Senke über DPCD, Register DP_PSR_SUPPORT an Adresse 0x70. Unterstützt die Senke PSR, aktiviert der Treiber die Funktion automatisch auf der Source-Seite. Liefert DP_PSR_SUPPORT den Wert 1, funktioniert PSR aber fehlerhaft, klären Sie die tatsächliche Unterstützung mit dem Panel-Hersteller. Als Umgehung kann PSR über die Eigenschaft rockchip,disable-psr im edp-Knoten des Device Tree erzwungen deaktiviert werden.

```text
&edp {
   rockchip,disable-psr;

};
```

Ist dieser Commit nicht enthalten, aktivieren Sie PSR manuell durch support-psr im edp-Knoten:

```text
&edp {
   support-psr;
};
```

#### 4.2.4 Connector-split-Modus

Die VOP2-Funktion Connector-split ähnelt dem MIPI-Zweikanalmodus. Sie teilt die Ausgabe eines Video Ports horizontal in zwei Hälften, um zwei gleiche oder unterschiedliche Schnittstellen mit übereinstimmendem Timing anzusteuern. Details stehen im Abschnitt „Connector-split“ von „Rockchip_Developer_Guide_DRM_Display_Driver_CN“.

Für Connector-split mit zwei eDP-Ausgängen gelten folgende Anwendungseigenschaften:

1. Ein einzelner VP steuert zwei eDP-Panels mit übereinstimmendem Timing an.

2. Die beiden eDP-Panels zeigen jeweils die linke bzw. rechte Bildhälfte.

3. DRM registriert nur einen Connector; die Anwendungsschicht kann nur das Gerät eDP0 abfragen.

![Technische Originalabbildung (englisches PDF, S. 27)](/docs/rockchip-edp/assets/en-p27-1.png)

Die Beispiel-DTS ist unter Kernel 6.1 arch/arm64/boot/dts/rockchip/rk3588-vehicle-serdes-display-v20.dtsi. Wesentliche Einstellungen:

edp0 und edp1 müssen vom selben VP ausgegeben werden. Im Beispiel werden edp0_in_vp1 und edp1_in_vp1 gleichzeitig aktiviert.

Die Schnittstelle für die linke Anzeige benötigt bei Connector-split die Eigenschaft rockchip,split-mode.

```text
&edp0 {
   rockchip,split-mode;
   force-hpd;

   status = "okay";

   ports {
      port@1 {
         reg = <1>;

         edp0_out_i2c5_bu18tl82: endpoint {
           remote-endpoint = <&i2c5_bu18tl82_in_edp0>;
         };
      };
   };
};


&edp0_in_vp0 {
   status = "disabled";
};

&edp0_in_vp1 {
   status = "okay";
};

&edp0_in_vp2 {
   status = "disabled";
};


&edp1 {
   force-hpd;
   status = "okay";

   ports {
      port@1 {
         reg = <1>;

         edp1_out_i2c7_bu18tl82: endpoint {

           remote-endpoint = <&i2c7_bu18tl82_in_edp1>;
         };
      };
   };
};

&edp1_in_vp0 {
   status = "disabled";
};

&edp1_in_vp1 {
   status = "okay";

};

&edp1_in_vp2 {
   status = "disabled";
};
```

#### 4.2.5 Zweikanalmodus

Connector-split verteilt normalerweise die von einem VP gesteuerte Schnittstelle auf zwei Panels/Monitore. Sollen zwei identische Schnittstellen ein einziges Panel bzw. einen Monitor ansteuern, muss rockchip,dual-channel an der linken Anzeigeschnittstelle aktiviert werden.

![Technische Originalabbildung (englisches PDF, S. 28)](/docs/rockchip-edp/assets/en-p28-1.png)

Der Zweikanalmodus ist als Teilmenge von Connector-split mit demselben Implementierungsmechanismus zu verstehen. Beim Zuordnen des linken Connectors muss dessen Timing der tatsächlichen VP-Ausgabe entsprechen; bei aktiviertem split-mode wird dagegen die Hälfte des tatsächlichen VP-Timings konfiguriert.

Das eDP-Panelmodul M280DCA mit 8 Lanes und 3840x2160@144Hz verlangt laut Datenblatt folgende Datenzuordnung:

| Bereich | Lane | Datenstrom |
| --- | --- | --- |
| Links | Lane 0 | Pixel 1,5,9, ...... ,1913,1917 |
|  | Lane 1 | Pixel 2,6,10, ...... ,1914,1918 |
|  | Lane 2 | Pixel 3,7,11, ...... ,1915,1919 |
|  | Lane 3 | Pixel 4,8,12, ...... ,1916,1920 |
| Rechts | Lane 4 | Pixel 1921,1925,1929, ...... ,3833,3837 |
|  | Lane 5 | Pixel 1922,1926,1930, ...... ,3834,3838 |
|  | Lane 6 | Pixel 1923,1927,1931, ...... ,3835,3839 |
|  | Lane 7 | Pixel 1924,1928,1932, ...... ,3836,3840 |

RK3588 unterstützt bei einem einzelnen eDP-Ausgang mit 4 Lanes 3840x2160@60Hz. Mit der Zweikanalfunktion sind über 8 Lanes 3840x2160@144Hz möglich. Beispiel-DTS: arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4-v10-edp-8lanes-M280DCA.dts. Wesentliche Einstellungen:

edp0 und edp1 müssen vom selben VP ausgegeben werden; im Beispiel werden edp0_in_vp0 und edp1_in_vp0 gemeinsam aktiviert.

Im Zweikanalmodus muss die linke Anzeigeschnittstelle rockchip,dual-channel erhalten.

```text
/ {
   panel-edp {
      compatible = "simple-panel";

      backlight = <&backlight>;
      power-supply = <&vcc3v3_edp>;
      enable-gpios = <&gpio4 RK_PC1 GPIO_ACTIVE_HIGH>;
      prepare-delay-ms = <120>;
      enable-delay-ms = <120>;
      unprepare-delay-ms = <120>;
      disable-delay-ms = <120>;

      display-timings {
         native-mode = <&timing_4kp144>;
         timing_4kp144: timing0 {
           clock-frequency = <1360800000>;

           hactive = <3840>;
           vactive = <2160>;
           hfront-porch = <160>;
           hsync-len = <40>;
           hback-porch = <160>;
           vfront-porch = <40>;
           vsync-len = <10>;
           vback-porch = <40>;
           hsync-active = <0>;
           vsync-active = <0>;
            de-active = <0>;
            pixelclk-active = <0>;
         };


         timing_4kp120: timing1 {
            clock-frequency = <1188000000>;
            hactive = <3840>;
            vactive = <2160>;
            hfront-porch = <240>;
            hsync-len = <80>;
            hback-porch = <240>;
            vfront-porch = <40>;
            vsync-len = <10>;
            vback-porch = <40>;
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
            panel_in_edp0: endpoint {

               remote-endpoint = <&edp0_out_panel>;
            };
         };

         port@1 {
            reg = <1>;
            panel_in_edp1: endpoint {
               remote-endpoint = <&edp1_out_panel>;
            };
         };
      };
   };

};

&edp0 {
   force-hpd;
   status = "okay";
   dual-channel;

   ports {
      port@1 {
         reg = <1>;

         edp0_out_panel: endpoint {
            remote-endpoint = <&panel_in_edp>;
         };
      };
   };

};

&edp0 {
   force-hpd;
   rockchip,dual-channel;
   rockchip,data-swap;
   status = "okay";

   ports {
      port@1 {
         reg = <1>;


         edp0_out_panel: endpoint {
            remote-endpoint = <&panel_in_edp0>;
         };
      };
   };
};

&edp0_in_vp0 {
   status = "okay";
};

&edp0_in_vp1 {
   status = "disabled";

};

&edp0_in_vp2 {
   status = "disabled";
};

&edp1 {
   force-hpd;
   status = "okay";

   ports {
      port@1 {

         reg = <1>;

         edp1_out_panel: endpoint {
            remote-endpoint = <&panel_in_edp1>;
         };
      };
   };
};

&edp1_in_vp0 {
   status = "okay";
};
&edp1_in_vp1 {
   status = "disabled";
};


&edp1_in_vp2 {
   status = "disabled";
};
```

## 5. Gängige Debugging-Verfahren

### 5.1 DRM-Connector-Status prüfen

Als Beispiel dient RK3588S EVB1 mit der DTS-Datei arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi.

Unter Linux sind registrierte DRM-Geräte in /sys/class/drm sichtbar. Im folgenden Protokoll bezeichnet card0 das Display-subsystem von Rockchip; card0-DP-1 und card0-eDP-1 entsprechen der DP- bzw. eDP-Schnittstelle.

```text
console:/ # cat /sys/class/drm/
card0-DP-1/   card0-eDP-1/   card1/        renderD129/
card0-Writeback-1/ card0/    renderD128/   version
```

Das Verzeichnis von card0-eDP-1 enthält beispielsweise:

```text
console:/ # ls /sys/class/drm/card0-eDP-1/
device dpms edid enabled modes power status subsystem uevent
```

dpms: Energiezustand des Geräts.

```text
console:/ # cat /sys/class/drm/card0-eDP-1/dpms
On
```

edid: Die vom Sink-Gerät gelesenen EDID-Informationen.

Sie können mit edid-decode ausgewertet werden:

```text
console:/ # edid-decode /sys/class/drm/card0-eDP-1/edid
edid-decode (hex):


00 ff ff ff ff ff ff 00 16 83 00 00 00 00 00 00
04 17 01 00 a5 10 0c 78 06 ef 05 a3 54 4c 99 26
0f 50 54 00 00 00 01 01 01 01 01 01 01 01 01 01
01 01 01 01 01 01 ea 4e 00 4c 60 00 14 80 0c 10
84 00 78 a0 00 00 00 18 00 00 00 10 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 fe 00 4c
50 30 37 39 51 58 31 2d 53 50 30 56 00 00 00 fc
00 43 6f 6c 6f 72 20 4c 43 44 0a 20 20 20 00 3f

----------------

Block 0, Base EDID:
 EDID Structure Version & Revision: 1.0
 Vendor & Product Identification:
   Manufacturer: ETC
   Model: 0
   Made in: week 4 of 2013
 Basic Display Parameters & Features:
   Digital display
   Maximum image size: 16 cm x 12 cm
   Gamma: 2.20
   Monochrome or grayscale display
   Default (sRGB) color space is primary color space

   First detailed timing is the preferred timing
 Color Characteristics:
   Red : 0.6396, 0.3300
   Green: 0.2998, 0.6005
   Blue : 0.1484, 0.0585
   White: 0.3134, 0.3291
 Established Timings I & II: none
 Standard Timings: none
 Detailed Timing Descriptors:
   DTD 1: 1536x2048 60.600861 Hz 3:4 125.323 kHz 202.020000 MHz (120
mm x 160 mm)
            Hfront 12 Hsync 16 Hback 48 Hpol N
            Vfront 8 Vsync 4 Vback 8 Vpol N

   Dummy Descriptor:
   Alphanumeric Data String: 'LP079QX1-SP0V'
   Display Product Name: 'Color LCD'
Checksum: 0x3f
```

Ist edid-decode im aktuellen SDK nicht verfügbar, können Sie die EDID als Binärdatei speichern und anschließend auswerten:

```text
cat /sys/class/drm/card0-eDP-1/edid > /data/edid.bin
```

Die Auswertung der EDID des Panels "lg,lp079qx1-sp0v" über https://hverkuil.home.xs4all.nl/edid-decode/edid-decode.html liefert folgendes Ergebnis:

```text
edid-decode (hex):

00 ff ff ff ff ff ff 00 16 83 00 00 00 00 00 00

04 17 01 00 a5 10 0c 78 06 ef 05 a3 54 4c 99 26
0f 50 54 00 00 00 01 01 01 01 01 01 01 01 01 01
01 01 01 01 01 01 ea 4e 00 4c 60 00 14 80 0c 10
84 00 78 a0 00 00 00 18 00 00 00 10 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 fe 00 4c
50 30 37 39 51 58 31 2d 53 50 30 56 00 00 00 fc
00 43 6f 6c 6f 72 20 4c 43 44 0a 20 20 20 00 3f

----------------
Block 0, Base EDID:
  EDID Structure Version & Revision: 1.0
  Vendor & Product Identification:

   Manufacturer: ETC
   Model: 0
   Made in: week 4 of 2013
  Basic Display Parameters & Features:
   Digital display
   Maximum image size: 16 cm x 12 cm
   Gamma: 2.20
   Monochrome or grayscale display
   Default (sRGB) color space is primary color space
   First detailed timing is the preferred timing
  Color Characteristics:
   Red : 0.6396, 0.3300

   Green: 0.2998, 0.6005
   Blue : 0.1484, 0.0585
   White: 0.3134, 0.3291
  Established Timings I & II: none
  Standard Timings: none
  Detailed Timing Descriptors:
   DTD 1: 1536x2048 60.600861 Hz 3:4 125.323 kHz 202.020000 MHz (120
mm x 160 mm)
             Hfront 12 Hsync 16 Hback 48 Hpol N
             Vfront 8 Vsync 4 Vback 8 Vpol N
   Dummy Descriptor:
   Alphanumeric Data String: 'LP079QX1-SP0V'
   Display Product Name: 'Color LCD'

Checksum: 0x3f

----------------
Preferred Video Timing if only Block 0 is parsed:
  DTD 1: 1536x2048 60.600861 Hz 3:4 125.323 kHz 202.020000 MHz (120
mm x 160 mm)
             Hfront 12 Hsync 16 Hback 48 Hpol N
             Vfront 8 Vsync 4 Vback 8 Vpol N

----------------
Native Video Resolution:
  1536x2048


----------------
edid-decode SHA: dc3a7b9f5453 2025-04-29 13:26:06

Warnings:

Block 0, Base EDID:
  EDID Structure Version & Revision: EDID 1.0 is deprecated, do not use.

Failures:

Block 0, Base EDID:
 Basic Display Parameters & Features: Digital Video Interface Standard set to
reserved value 0x25.
 Basic Display Parameters & Features: sRGB is signaled, but the chromaticities

do not match.
 Detailed Timing Descriptor #1: Mismatch of image size 120x160 mm vs display
size 160x120 mm.
 Display Descriptor #2: Has descriptor blocks other than detailed timings.
 Display Descriptor #3: Has descriptor blocks other than detailed timings.
 Display Descriptor #4: Has descriptor blocks other than detailed timings.
EDID:
 Base EDID: The DTD max image size is 120x160mm, which is larger than the
display size 160.0x120.0mm.

EDID conformity: FAIL
```

enabled: Aktivierungszustand des Geräts.

```text
console:/ # cat /sys/class/drm/card0-eDP-1/enabled
enabled
```

modes: Liste der unterstützten Auflösungen.

```text
console:/ # cat /sys/class/drm/card0-eDP-1/modes
1536x2048
```

status: Verbindungszustand des Geräts.

```text
cat /sys/class/drm/card0-eDP-1/status
connected
```

### 5.2 Controller-/PHY-Register anzeigen

Die Basisadressen von Controller und PHY der verschiedenen eDP-Plattformen lauten:

|  | RK3288 | RK3399 | RK3568 | RK3588 | RK3576 |
| --- | --- | --- | --- | --- | --- |
| Controller | 0xff970000 | 0xff970000 | 0xfe0c0000 | 0xfdec0000/0xfded0000 | 0x27dc0000 |
| PHY | 0xff970600 | 0xff970600 | 0xfdcb0000 | 0xfed60000/0xfed70000 | 0x2b000000 |

Befehl zum Auslesen der Controller-Register am Beispiel RK3576:

```text
io -4 -l 0x400 0x27dc0000
```

Die Befehle zum Auslesen der PHY-Register unterscheiden sich nach Plattform:

RK3288/RK3399

```text
io -4 -l 0x200 0xff970600
```

RK3568

```text
io -4 -l 0x100 0xfdcb0000
```

RK3588/RK3576

```text
cat /sys/kernel/debug/regmap/2b000000.phy/registers
```

### 5.3 VOP-Status prüfen

Details stehen im Abschnitt „Dumping the Current Display Status“ von „Rockchip_Developer_Guide_DRM_Display_Driver_CN“.

### 5.4 Taktkonfiguration anzeigen

Details stehen im Abschnitt „Viewing Current Display Clock“ von „Rockchip_Developer_Guide_DRM_Display_Driver_CN“.

### 5.5 eDP zwangsweise ein-/ausschalten

Am Beispiel RK3576 lässt sich der eDP-Anzeigepfad über den unter „DRM-Connector-Status prüfen“ beschriebenen status-Knoten zwangsweise ein- oder ausschalten:

```text
console:/ # echo off > /sys/class/drm/card0-eDP-1/status
console:/ # [ 480.579852][ T333] rockchip-vop2 27d00000.vop:

[drm:vop2_crtc_atomic_disable] Crtc atomic disable vp1
[ 480.589443][ T333] [WLAN_RFKILL]: wlan_early_suspend :enter
......
console:/ # echo on > /sys/class/drm/card0-eDP-1/status
console:/ # [ 503.199908][ T333] [WLAN_RFKILL]: wlan_late_resume :enter
[ 503.199952][ T333] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] Update mode
to 1536x2048p60, type: 14(if:eDP0, flag:0x0) for vp1 dclk: 200000000
[ 503.200223][ T333] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] set
dclk_vp1 to 200000000, get 200000000
```

### 5.6 DPCD lesen und schreiben

DPCD-Lese-/Schreibzugriffe erfolgen über drm_dp_aux_dev; der Treiber steht in /drivers/gpu/drm/drm_dp_aux_dev.c.

Nach Aktivierung von CONFIG_DRM_DP_AUX_CHARDEV können DPCD-Zugriffe mit folgenden Befehlen erfolgen:

Werte von 16 DPCD-Registern ab Adresse 0x00000 lesen:

```text
console:/ # dd if=/dev/drm_dp_aux0 bs=1 skip=$((0x00000)) count=16 status=none | od -tx1
0000000 11 06 84 41 00 00 01 c0 02 00 00 00 0f 03 00 00
0000020
```

if: Gibt den AUX-Knoten an. Bei zwei registrierten eDP-Schnittstellen stehen /dev/drm_dp_aux0 und /dev/drm_dp_aux1 zur Verfügung.

skip: Startadresse der DPCD-Register.

count: Anzahl der zu lesenden DPCD-Register.

0x0a und 0x80 in zwei DPCD-Register ab 0x100 schreiben:

```text
console:/ # echo -e -n "\x0a\x80" | dd of=/dev/drm_dp_aux0 bs=1 seek=$((0x100)) count=2
status=none
```

of: Gibt den AUX-Knoten an. Bei zwei registrierten eDP-Schnittstellen stehen /dev/drm_dp_aux0 und /dev/drm_dp_aux1 zur Verfügung.

seek: Startadresse der DPCD-Register.

count: Anzahl der zu schreibenden DPCD-Register.

### 5.7 DRM-Protokollkategorien anpassen

Die Erläuterung der DRM-Debug-Protokollstufen steht in drivers/gpu/drm/drm_print.c.

```text
/*
 * __drm_debug: Enable debug output.
 * Bitmask of DRM_UT_x. See include/drm/drm_print.h for details.

 */
unsigned long __drm_debug;
EXPORT_SYMBOL(__drm_debug);

MODULE_PARM_DESC(debug, "Enable debug output, where each bit enables a debug category.\n"
"\t\tBit 0 (0x01) will enable CORE messages (drm core code)\n"
"\t\tBit 1 (0x02) will enable DRIVER messages (drm controller code)\n"
"\t\tBit 2 (0x04) will enable KMS messages (modesetting code)\n"
"\t\tBit 3 (0x08) will enable PRIME messages (prime code)\n"
"\t\tBit 4 (0x10) will enable ATOMIC messages (atomic code)\n"
"\t\tBit 5 (0x20) will enable VBL messages (vblank code)\n"
"\t\tBit 7 (0x80) will enable LEASE messages (leasing code)\n"

"\t\tBit 8 (0x100) will enable DP messages (displayport code)");
```

Passen Sie die DRM-Protokollkategorien nach Bedarf an. Für Ausgaben zu DPCD-Lese-/Schreibzugriffen verwenden Sie:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

Sie können auch den Wert der obigen Variablen __drm_debug direkt ändern. Hinweis: Dieses Verfahren gilt nicht für SDKs in der GKI-Version.

```text
diff --git a/drivers/gpu/drm/drm_print.c b/drivers/gpu/drm/drm_print.c
index 5b93c11895bb..8da96cde8308 100644
--- a/drivers/gpu/drm/drm_print.c

+++ b/drivers/gpu/drm/drm_print.c
@@ -39,7 +39,7 @@
 * __drm_debug: Enable debug output.
 * Bitmask of DRM_UT_x. See include/drm/drm_print.h for details.
 */
-unsigned long __drm_debug;
+unsigned long __drm_debug = 0x100;
 EXPORT_SYMBOL(__drm_debug);
```

## 6. Häufig gestellte Fragen

### 6.1 Bandbreitenberechnung

Die unter einem bestimmten Anzeigemodus pro eDP-Lane erforderliche Bandbreite wird wie folgt berechnet:

```text
bandwidth_per_lane = pixel_clk * bit_per_pixel * 1.25 / lane_count
```

bit_per_pixel bezeichnet die Bits pro Pixel, 1.25 den vom eDP-Protokoll vorgegebenen Datenkodierungsfaktor der Lanes und lane_count die Anzahl verfügbarer Lanes. Das Ergebnis bandwith_per_lane ist die erforderliche Mindestbandbreite je Lane. Liegt die aktuelle Lane-Datenrate darunter, filtert der eDP-Treiber den entsprechenden pixel-clk-Anzeigemodus heraus.

Ein Panel mit 2 Lanes, 2K@60Hz und pixel clk 297MHz benötigt bei RGB888 beispielsweise folgende Mindestbandbreite je Lane:

```text
bandwidth_per_lane = 297 * 24 * 1.25 / 2 = 4.46 Gbps/lane
```

Die Quelle folgert anhand der Funktionsübersicht, dass RK3399/RK3588/RK3576 dieses Panel unterstützen, RK3288/RK3568 dagegen nicht. Beachten Sie den dokumentierten Widerspruch zur RK3399-Datenratentabelle.

### 6.2 DCLK-Genauigkeit

Prüfen Sie während U-Boot anhand des folgenden Protokolls, ob erwarteter und tatsächlicher DCLK voneinander abweichen. Beispiel RK3588S EVB1:

```text
edp@fdec0000: detailed mode clock 200000 kHz, flags[a] //expected dclk rate
   H: 1536 1548 1564 1612
   V: 2048 2056 2060 2068

bus_format: 100e
VOP update mode to: 1536x2048p60, type: eDP0 for VP2
VP2 set crtc_clock to 200000KHz         //actual dclk rate
```

Während der Kernel-Phase erfolgt die Prüfung mit cat /sys/kernel/debug/dri/0/summary:

```text
console:/ # cat /sys/kernel/debug/dri/0/summary
Video Port1: DISABLED
Video Port2: ACTIVE

   Connector:eDP-1 Encoder: TMDS-463
      bus_format[100a]: RGB888_1X24
      overlay_mode[0] output_mode[f] SDR[0] color-encoding[BT.709] color-range[Full]
   Display mode: 1536x2048p60
      dclk[200000 kHz] real_dclk[200000 kHz] aclk[500000 kHz] type[48] flag[a]
//dclk[expected] real_dclk[actual]
      H: 1536 1548 1564 1612
      V: 2048 2056 2060 2068
      Fixed H: 1536 1548 1564 1612
      Fixed V: 2048 2056 2060 2068
   Cluster2-win0: ACTIVE
      win_id: 4
      format: AB24 little-endian (0x34324241)_AFBC-16x16 pixel_blend_mode[0]

glb_alpha[0xff]
      color: SDR[0] color-encoding[BT.709] color-range[Full]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]
      zpos: 0
      src: pos[0, 0] rect[1536 x 2048]
      dst: pos[0, 0] rect[1536 x 2048]
      buf[0]: addr: 0x00000000f16bb000 pitch: 6144 offset: 0
```

Weichen tatsächlicher und erwarteter DCLK voneinander ab, prüfen Sie zuerst anhand des Panel-Datenblatts, ob der tatsächlich zugewiesene DCLK die Anforderungen erfüllt. Ist dies der Fall, funktioniert die Anzeige normal und entspricht die Bildrate den Erwartungen, kann die Abweichung außer Acht gelassen werden:

eDP-Panels besitzen üblicherweise eine gewisse Toleranz gegenüber Abweichungen des Pixeltakts. Innerhalb dieses Bereichs funktionieren Anzeige und Bildrate normal.

Die PLL-Ressourcen jeder Chipplattform sind begrenzt; eine exakte DCLK-Zuweisung für jedes Modul kann nicht garantiert werden. Grundsätzlich wird die nächstliegende durch Frequenzteilung erreichbare Frequenz gewählt. Einzelheiten enthält Rockchip_Developer_Guide_Clock_CN.

Bestätigt der Bildschirmhersteller eine hohe Empfindlichkeit des Panels gegenüber der Pixeltaktgenauigkeit und verursacht die Abweichung des tatsächlichen vom erwarteten DCLK Anzeigefehler, konfigurieren Sie den entsprechenden VOP/VP-DCLK auf eine ausschließlich für die Anzeige verwendete PLL. Siehe den Abschnitt zum DCLK der VOP-Plattform in Rockchip_Developer_Guide_DRM_Display_Driver_CN.

### 6.3 Analyse und Behebung von AUX-Fehlern

```text
/* DEMO1 */
[  11.591242] Rockchip-dp fe0c0000.edp: AUX CH error occurred: 0x2 (1)
[  11.592663] Rockchip-dp fe0c0000.edp: AUX CH error occurred: 0x2 (1)

[  11.594057] Rockchip-dp fe0c0000.edp: AUX CH error occurred: 0x2 (1)
/* DEMO2 */
console:/ # dmesg | grep edp
[ 3.236549] Rockchip-dp fdec0000.edp: failed to read max link rate
[ 3.260422] Rockchip-dp fdec0000.edp: failed to read max link rate
[ 3.284163] Rockchip-dp fdec0000.edp: failed to read max link rate
```

Prüfen und bestätigen Sie die folgenden Punkte:

#### 6.3.1 PHY-Konfiguration prüfen

Prüfen Sie anhand der PHY-DTS-Konfiguration, ob die zu eDP0/eDP1 gehörenden PHY-Knoten korrekt aktiviert sind.

#### 6.3.2 Panel-Konfiguration prüfen

Prüfen Sie anhand der Panel-DTS-Konfiguration, ob sämtliche Einstellungen den Anforderungen des Datenblatts entsprechen.

Prüfen Sie außerdem, ob die Versorgungskonfiguration den Anforderungen des Panels entspricht; die konkreten Anforderungen stehen im Panel-Datenblatt. Einzelheiten enthält Rockchip_Developer_Guide_Linux_IO_DOMAIN_CN.

Die Panel-Stromversorgung sollte durch den Hauptcontroller steuerbar sein, damit sich das Panel bei besonderen Fehlerfällen zurücksetzen lässt.

#### 6.3.3 HPD-Status und Einschaltsequenz prüfen

Prüfen Sie die gewählte HPD-Konfiguration anhand des entsprechenden Abschnitts. Wählen Sie eines der Verfahren Force HPD, Function Pin HPD oder GPIO HPD.

Erzwungenes HPD (Force HPD)

Im Modus Force HPD meldet kein HPD-Signal der Quelle, dass die Senke bereit ist. Daher kann die Einschaltsequenz von den Anforderungen des Datenblatts abweichen.

Prüfen Sie anhand des Abschnitts zur Panel-DTS-Konfiguration die Einstellungen enable-delay-ms/reset-delay-ms/prepare-delay-ms/unprepare-delay-ms/disable-delay-ms mit einem Oszilloskop.

![Technische Originalabbildung (englisches PDF, S. 41)](/docs/rockchip-edp/assets/en-p41-1.png)

Sind alle Zeitvorgaben des Datenblatts erfüllt und treten dennoch AUX-Fehler auf, kann T3 aus der Abbildung, also prepare-delay-ms, angemessen verlängert werden – gegebenenfalls sogar über die geforderte Grenze ≤ 200 hinaus. Dadurch ist die Senke bereit, bevor die Quelle die AUX-Kommunikation beginnt. Beispiel:

```text
&panel {
   prepare-delay-ms = <500>;
}
```

GPIO HPD

Prüfen Sie bei GPIO HPD zusätzlich zur beschriebenen Einschaltsequenz, ob andere Module den vorgesehenen HPD-Pin belegen. Dies lässt sich mit cat /d/gpio feststellen:

```text
console:/ # cat /d/gpio
gpiochip1: GPIOs 32-63, parent: platform/ff730000.gpio1, gpio1:
 gpio-33 (            |?              ) out lo

 gpio-34 (            |int-n          ) in hi
 gpio-45 (            |enable         ) out lo
 gpio-46 (            |vsel           ) out lo
 gpio-49 (            |vsel           ) out lo
 gpio-50 (            |vbus-5v        ) out lo
 gpio-55 (            |reset          ) out lo
... ...
gpiochip5: GPIOs 511-511, parent: platform/rk805-pinctrl, rk817-gpio, can sleep:
```

Eine Pulldown-Konfiguration des Pins kann außerdem eine stabile Erkennung des HPD-Signals gewährleisten. Siehe HPD-Konfiguration.

#### 6.3.4 AUX-Hardwaredesign prüfen

Prüfen Sie, ob die positive und negative Leitung des AUX-Differenzpaares vertauscht sind. Bei einer versehentlichen Vertauschung im Hardwaredesign dienen die folgenden Änderungen als Referenz:

U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp_reg.c b/drivers/video/drm/analogix_dp_reg.c
index 292a5076705..373189e9157 100644

--- a/drivers/video/drm/analogix_dp_reg.c
+++ b/drivers/video/drm/analogix_dp_reg.c
@@ -1241,7 +1241,7 @@ ssize_t analogix_dp_aux_transfer(struct drm_dp_aux *aux, struct
drm_dp_aux_msg *
      }

      /* Enable AUX CH operation */
-     reg = AUX_EN;
+     reg = AUX_EN | 0x4;

      /* Zero-sized messages specify address-only transactions. */
      if (msg->size < 1)
```

Kernel:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
index 810b5a2f6041..2dbde10033c5 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
@@ -1202,7 +1202,7 @@ ssize_t analogix_dp_transfer(struct analogix_dp_device *dp,
      }

      /* Enable AUX CH operation */
-     reg = AUX_EN;
+     reg = AUX_EN | 0x4;

      /* Zero-sized messages specify address-only transactions. */
      if (msg->size < 1)
```

Beim Hardwaredesign der AUX-Verbindung für eDP v1.2 und höher sollten Pullup- und Pulldown-Widerstände an den AUX-Differenzleitungen entfernt werden. Treten weiterhin AUX-Fehler auf, kann eine Verringerung der Serienkapazität der AUX-Signalleitungen versucht werden.

### 6.4 Analyse und Behebung von Link-Training-Fehlern

Fehler beim eDP-Link-Training sehen beispielsweise so aus:

```text
# Link Training CR(Clock Recovery) phase failure
[ 1410.198900][ T318] rockchip-dp fdec0000.edp: CR Max reached (0,3,0)

[ 1410.202213][ T318] rockchip-dp fdec0000.edp: LT CR failed!
[ 1410.202227][ T318] rockchip-dp fdec0000.edp: eDP link training failed (-5)
[ 1410.202238][ T318] rockchip-dp fdec0000.edp: unable to do link train, ret=-5

# Link Training EQ(Channel Equalization) phase failure
[ 6673.100385][ T318] rockchip-dp fdec0000.edp: EQ Max loop
[ 6673.101511][ T318] rockchip-dp fdec0000.edp: LT EQ failed!
[ 6673.101515][ T318] rockchip-dp fdec0000.edp: eDP link training failed (-5)
[ 6673.101517][ T318] rockchip-dp fdec0000.edp: unable to do link train, ret=-5
[ 6673.101522][ T318] [drm:analogix_dp_bridge_atomic_enable] ERROR dp commit error, ret = -5
[ 6673.101533][ T318] rockchip-dp fdec0000.edp: failed to set bridge, retry: 0
```

Die Hauptschleife des eDP-Link-Trainings ist ungefähr wie folgt aufgebaut; einzelne Versionen unterscheiden sich:

```text
while (!retval && !training_finished) {
   switch (dp->link_train.lt_state) {

      case START:
         retval = analogix_dp_link_start(dp);
         if (retval)
           dev_err(dp->dev, "LT link start failed!\n");
         break;
      case CLOCK_RECOVERY:
         retval = analogix_dp_process_clock_recovery(dp);
         if (retval)
           dev_err(dp->dev, "LT CR failed!\n");
         break;
      case EQUALIZER_TRAINING:
         retval = analogix_dp_process_equalizer_training(dp);

         if (retval)
           dev_err(dp->dev, "LT EQ failed!\n");
         break;
      case FINISHED:
         training_finished = 1;
         break;
      case FAILED:
         return -EREMOTEIO;
   }
}
```

Das eDP-Link-Training gliedert sich im Treiber in drei Phasen: START, CLOCK_RECOVERY und EQUALIZER_TRAINING:

START: Initialisierung der Startparameter des Trainings.

CLOCK_RECOVERY: Wiederherstellung des Verbindungstakts.

EQUALIZER_TRAINING: Entzerrung der Verbindung.

Anhand des Protokolls lässt sich feststellen, in welcher Phase das Link-Training scheitert.

#### 6.4.1 Protokollunterstützung des Panels prüfen

Vergleichen Sie die im Abschnitt zu den Funktionsmerkmalen beschriebene Protokollunterstützung der eDP-Schnittstelle auf RK-Plattformen mit der im Panel-Datenblatt angegebenen Version. Die von der Schnittstelle unterstützte Protokollversion muss mindestens der Version des Panels entsprechen.

#### 6.4.2 Hardwaredesign der Hauptverbindung prüfen

Jede Lane der Hauptverbindung muss an Quelle und Senke eindeutig einander zugeordnet sein. Bei einem Fehler im Hardwaredesign können Sie die Lane-Zuordnung anhand der folgenden Änderungen anpassen:

```text
&edp0 {
   data-lanes = <3 2 1 0>;

};
```

Prüfen Sie, ob das Hardwaredesign der Hauptverbindung den Vorgaben entspricht. Verwenden Sie den offiziellen Hardware-Designleitfaden der jeweiligen RK-Plattform, beispielsweise den „Rockchip RK3576 Hardware Design Guide“ für RK3576.

#### 6.4.3 Konformität von Bildschirmkabel und Anschluss prüfen

Die Spezifikationen und Anforderungen für Bildschirmkabel und Anschlüsse sind mit dem Bildschirmhersteller abzuklären. Häufig gelten folgende Anforderungen:

Die Länge des Bildschirmkabels sollte 30cm nicht überschreiten.

Das Bildschirmkabel sollte abgeschirmt sein.

Die Verbindung zwischen Bildschirmkabel und Anschluss muss korrekt und stabil sein.

#### 6.4.4 HPD-Status und Einschaltsequenz bestätigen

Siehe den vorherigen Abschnitt zum Prüfen von HPD-Status und Einschaltsequenz.

#### 6.4.5 Voremphase und Spannungshub konfigurieren

Die Einstellungen für PE (Pre-emphasic, Voremphase) und VS (Voltage Swing, Spannungshub) beeinflussen die Qualität der eDP-Signale wesentlich. Folgende Kombinationen sind vorgesehen:

| Spannungshubstufe | Voremphasestufe 0 Vdiff_pre_pp | Voremphasestufe 1 Vdiff_pre_pp | Voremphasestufe 2 Vdiff_pre_pp | Voremphasestufe 3 Vdiff_pre_pp |
| --- | --- | --- | --- | --- |
| 0 | Erforderlich | Erforderlich | Erforderlich | Optional |
| 1 | Erforderlich | Erforderlich | Erforderlich | Nicht zulässig |
| 2 | Erforderlich | Erforderlich | Nicht zulässig | Nicht zulässig |
| 3 | Optional | Nicht zulässig | Nicht zulässig | Nicht zulässig |

6.4.5.1 Anfangskonfiguration ändern

Das eDP-Protokoll schreibt PE Level 0/ VS Level 0 als Anfangskonfiguration vor. Durch Änderung der folgenden PE/VS-Anfangswerte lassen sich verschiedene Kombinationen erproben. Die Parameter sind wie folgt definiert:

```text
# define DP_TRAIN_MAX_SWING_REACHED (1 << 2)
# define DP_TRAIN_VOLTAGE_SWING_LEVEL_0 (0 << 0)
# define DP_TRAIN_VOLTAGE_SWING_LEVEL_1 (1 << 0)

# define DP_TRAIN_VOLTAGE_SWING_LEVEL_2 (2 << 0)
# define DP_TRAIN_VOLTAGE_SWING_LEVEL_3 (3 << 0)

# define DP_TRAIN_PRE_EMPHASIS_MASK (3 << 3)
# define DP_TRAIN_PRE_EMPH_LEVEL_0 (0 << 3)
# define DP_TRAIN_PRE_EMPH_LEVEL_1 (1 << 3)
# define DP_TRAIN_PRE_EMPH_LEVEL_2 (2 << 3)
# define DP_TRAIN_PRE_EMPH_LEVEL_3 (3 << 3)
```

Referenzänderung für U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.c b/drivers/video/drm/analogix_dp.c
index c4b50018baa..0afb116104f 100644
--- a/drivers/video/drm/analogix_dp.c

+++ b/drivers/video/drm/analogix_dp.c
@@ -240,8 +240,8 @@ static int analogix_dp_link_start(struct analogix_dp_device *dp)
      /* Set TX voltage-swing and pre-emphasis to minimum */
      for (lane = 0; lane < lane_count; lane++)
           dp->link_train.training_lane[lane] =
-                      DP_TRAIN_VOLTAGE_SWING_LEVEL_0 |
-                      DP_TRAIN_PRE_EMPH_LEVEL_0;
+                      DP_TRAIN_VOLTAGE_SWING_LEVEL_2 |
+                      DP_TRAIN_PRE_EMPH_LEVEL_1;
      analogix_dp_set_lane_link_training(dp);

      /* Set training pattern 1 */

@@ -254,8 +254,8 @@ static int analogix_dp_link_start(struct analogix_dp_device *dp)
           return retval;

      for (lane = 0; lane < lane_count; lane++)
-          buf[lane] = DP_TRAIN_PRE_EMPH_LEVEL_0 |
-                   DP_TRAIN_VOLTAGE_SWING_LEVEL_0;
+          buf[lane] = DP_TRAIN_PRE_EMPH_LEVEL_1 |
+                   DP_TRAIN_VOLTAGE_SWING_LEVEL_2;

      retval = drm_dp_dpcd_write(&dp->aux, DP_TRAINING_LANE0_SET, buf,
                         lane_count);
```

Referenzänderung für den Kernel:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c

index 4015073bbb39..10407e67c95f 100644
--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
@@ -435,8 +435,8 @@ static int analogix_dp_link_start(struct analogix_dp_device *dp)
      /* Set TX voltage-swing and pre-emphasis to minimum */
      for (lane = 0; lane < lane_count; lane++)
           dp->link_train.training_lane[lane] =
-                            DP_TRAIN_VOLTAGE_SWING_LEVEL_0 |
-                            DP_TRAIN_PRE_EMPH_LEVEL_0;
+                            DP_TRAIN_VOLTAGE_SWING_LEVEL_2 |
+                            DP_TRAIN_PRE_EMPH_LEVEL_1;
      analogix_dp_set_lane_link_training(dp);


      /* Set training pattern 1 */
@@ -450,8 +450,8 @@ static int analogix_dp_link_start(struct analogix_dp_device *dp)
           return retval;

      for (lane = 0; lane < lane_count; lane++)
-          buf[lane] = DP_TRAIN_PRE_EMPH_LEVEL_0 |
-                   DP_TRAIN_VOLTAGE_SWING_LEVEL_0;
+          buf[lane] = DP_TRAIN_PRE_EMPH_LEVEL_2 |
+                   DP_TRAIN_VOLTAGE_SWING_LEVEL_1;


      retval = drm_dp_dpcd_write(&dp->aux, DP_TRAINING_LANE0_SET, buf,
                         lane_count);
```

6.4.5.2 Protokollausgaben ergänzen

Scheitert das anfängliche Link-Training nach dem Setzen von Voltage_swing und Pre-emphasis, verwendet der nächste Durchlauf die vom Panel empfohlenen Parameter. Ergänzen Sie anhand der folgenden Beispiele Protokollausgaben, um die später verwendeten Werte für Voremphase und Spannungshub festzustellen. U-Boot-Referenz:

```text
diff --git a/drivers/video/drm/analogix_dp_reg.c b/drivers/video/drm/analogix_dp_reg.c
index d2cb10cc0e..c96495f5e9 100644
--- a/drivers/video/drm/analogix_dp_reg.c

+++ b/drivers/video/drm/analogix_dp_reg.c
@@ -1002,6 +1002,7 @@ void analogix_dp_set_lane_link_training(struct analogix_dp_device *dp)
               DP_TRAIN_PRE_EMPHASIS_SHIFT;
           phy_cfg.dp.voltage[lane] = vs;
           phy_cfg.dp.pre[lane] = pe;
+          printf("[Link Training] vs = %d pe = %d\n", vs, pe);
      }

      phy_cfg.dp.lanes = dp->link_train.lane_count;
```

Kernel-Referenz:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
index 42d1cbe28b40..ea5657770cfb 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
@@ -733,10 +733,14 @@ void analogix_dp_set_lane_link_training(struct analogix_dp_device *dp)
      u8 lane;
      int ret;

-     for (lane = 0; lane < dp->link_train.lane_count; lane++)
+     for (lane = 0; lane < dp->link_train.lane_count; lane++) {
           analogix_dp_write(dp,
                         ANALOGIX_DP_LN0_LINK_TRAINING_CTL + 4 * lane,
                         dp->link_train.training_lane[lane]);
+          printk("[Link Training] vs = %d pe = %d\n",

+                       (dp->link_train.training_lane[lane] &
DP_TRAIN_VOLTAGE_SWING_MASK) >> DP_TRAIN_VOLTAGE_SWING_SHIFT,
+                       (dp->link_train.training_lane[lane] &
DP_TRAIN_PRE_EMPHASIS_MASK) >> DP_TRAIN_PRE_EMPHASIS_SHIFT);
+     }
if (dp->phy) {
     union phy_configure_opts phy_cfg;
```

#### 6.4.6 Datenrate probeweise verringern

Die Berechnung der Bandbreite ist im vorherigen Abschnitt zur Bandbreitenberechnung beschrieben.

Bei ausreichender Bandbreite kann eine Verringerung der Link Rate versucht werden. DTS-Konfigurationsbeispiel:

```text
&edp {
   force-hpd;

   status = "okay";
   ports {
      port@1 {
         reg = <1>;
         edp_out: endpoint {
           link-frequencies = <2700000000>;
           remote-endpoint = <&panel_in>;
         };
      };
   };
};
```

Alternativ lässt sich die Link Rate im Treiber erzwingen. Die zugehörigen Makros lauten:

```text
# define DP_LINK_BW_1_62  0x06
# define DP_LINK_BW_2_7 0x0a
# define DP_LINK_BW_5_4 0x14

# define DP_LINK_BW_8_1 0x1e
```

Referenzänderung für U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.c b/drivers/video/drm/analogix_dp.c
index c4b50018baa..35daf949017 100644

--- a/drivers/video/drm/analogix_dp.c
+++ b/drivers/video/drm/analogix_dp.c
@@ -665,6 +665,7 @@ static int analogix_dp_get_max_rx_bandwidth(struct analogix_dp_device
*dp,

           *bandwidth = data;
      }
+     *bandwidth = DP_LINK_BW_1_62;

      return 0;
 }
```

Referenzänderung für den Kernel:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
index 4015073bbb39..f70898e0319e 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
@@ -851,6 +851,7 @@ static int analogix_dp_get_max_rx_bandwidth(struct analogix_dp_device
*dp,

           *bandwidth = data;
      }
+     *bandwidth = DP_LINK_BW_1_62;

      return 0;
 }
```

#### 6.4.7 Anzahl der Wiederholungen in der CR/EQ-Phase erhöhen

Das eDP-Protokoll sieht höchstens 5 Wiederholungen in der CR/EQ-Phase vor. Manche Bildschirme benötigen jedoch mehr Wiederholungen, damit das Link-Training gelingt.

Referenzänderung für U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.h b/drivers/video/drm/analogix_dp.h
index c6cb113190e..f9312f7391d 100644
--- a/drivers/video/drm/analogix_dp.h

+++ b/drivers/video/drm/analogix_dp.h
@@ -460,9 +460,9 @@
 /* ANALOGIX_DP_LINK_POLICY */
 #define ALTERNATE_SR_ENABLE       (0x1 << 7)

-#define DP_TIMEOUT_LOOP_COUNT 100
-#define MAX_CR_LOOP 5
-#define MAX_EQ_LOOP 5
+#define DP_TIMEOUT_LOOP_COUNT 200
+#define MAX_CR_LOOP 10
+#define MAX_EQ_LOOP 10

 /* I2C EDID Chip ID, Slave Address */

 #define I2C_EDID_DEVICE_ADDR      0x50
```

Referenzänderung für den Kernel:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.h b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.h
index 879a56eab2b7..8d493a0f76d1 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.h
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.h
@@ -13,9 +13,9 @@
 #include <drm/drm_crtc.h>
 #include <drm/drm_bridge.h>
-#define DP_TIMEOUT_LOOP_COUNT 100
-#define MAX_CR_LOOP 5

-#define MAX_EQ_LOOP 5
+#define DP_TIMEOUT_LOOP_COUNT 200
+#define MAX_CR_LOOP 10
+#define MAX_EQ_LOOP 10
 #define MAX_PLL_LOCK_LOOP 5

 /* Training takes 22ms if AUX channel comm fails. Use this as retry interval */
```

#### 6.4.8 Panel-Rücksetzvorgänge ergänzen

Referenzänderungen für U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.c b/drivers/video/drm/analogix_dp.c
index c4b50018baa..91ff3fa2ae6 100644
--- a/drivers/video/drm/analogix_dp.c

+++ b/drivers/video/drm/analogix_dp.c
@@ -715,6 +715,12 @@ static int analogix_dp_init_training(struct analogix_dp_device *dp,
      /* All DP analog module power up */
      analogix_dp_set_analog_power_down(dp, POWER_ALL, 0);

+     if (dp->connector.panel->funcs->unprepare)
+          dp->connector.panel->funcs->unprepare(dp->connector.panel);
+
+     if (dp->connector.panel->funcs->prepare)
+          dp->connector.panel->funcs->prepare(dp->connector.panel);
+
      return 0;

 }
```

Referenzänderungen für den Kernel:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
index 4015073bbb39..4dfc04a6ccae 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
@@ -910,6 +910,11 @@ static int analogix_dp_full_link_train(struct analogix_dp_device *dp,
      /* All DP analog module power up */
      analogix_dp_set_analog_power_down(dp, POWER_ALL, 0);

+     if (dp->plat_data->panel) {
+          analogix_dp_panel_unprepare(dp);
+          analogix_dp_panel_prepare(dp);
+     }
+
      dp->link_train.lt_state = START;
/* Process here */
```

#### 6.4.9 Erzwungene Ausgabe versuchen

Führen alle obigen Verfahren nicht zu einem erfolgreichen Link-Training, kann zur Eingrenzung des Problems eine erzwungene Ausgabe versucht werden.

Referenzänderung für U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.c b/drivers/video/drm/analogix_dp.c
index c4b50018baa..5cf45165698 100644

--- a/drivers/video/drm/analogix_dp.c
+++ b/drivers/video/drm/analogix_dp.c
@@ -1035,6 +1035,7 @@ static int analogix_dp_connector_enable(struct rockchip_connector
*conn,
      u32 fmt_id;
      u32 val;
      int ret;
+     int i;

      drm_mode_copy(&video->mode, &conn_state->mode);

@@ -1097,8 +1098,11 @@ static int analogix_dp_connector_enable(struct rockchip_connector
*conn,

      ret = analogix_dp_set_link_train(dp, dp->video_info.max_lane_count,
                              dp->video_info.max_link_rate);
      if (ret) {
-          dev_err(dp->dev, "unable to do link train\n");
-          return ret;
+          dev_err(dp->dev, "unable to do link train, using default strength\n");
+          for (i = 0; i < dp->link_train.lane_count; i++) {
+                dp->link_train.training_lane[i] = DP_TRAIN_VOLTAGE_SWING_LEVEL_0 |
DP_TRAIN_PRE_EMPH_LEVEL_0;
+          }
+          analogix_dp_set_lane_link_training(dp);
      }


      ret = analogix_dp_enable_scramble(dp, 1);
```

Referenzänderung für den Kernel:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
index 4015073bbb39..b97cd40ef205 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
@@ -1341,6 +1341,7 @@ static int analogix_dp_commit(struct analogix_dp_device *dp)
 {
      struct video_info *video = &dp->video_info;
      int ret;
+     int i;
      ret = drm_dp_read_dpcd_caps(&dp->aux, dp->dpcd);
      if (ret < 0) {

@@ -1362,8 +1363,10 @@ static int analogix_dp_commit(struct analogix_dp_device *dp)

      ret = analogix_dp_train_link(dp);
      if (ret) {
-          dev_err(dp->dev, "unable to do link train, ret=%d\n", ret);
-          return ret;
+          dev_err(dp->dev, "unable to do link train, using default strength\n");
+          for (i = 0; i < dp->link_train.lane_count; i++)
+                dp->link_train.training_lane[i] = DP_TRAIN_VOLTAGE_SWING_LEVEL_0 |
DP_TRAIN_PRE_EMPH_LEVEL_0;
+          analogix_dp_set_lane_link_training(dp);
      }


      ret = analogix_dp_enable_scramble(dp, 1);
```

Hinweis: Das obige Verfahren zur erzwungenen Ausgabe entspricht nicht der eDP-Protokollspezifikation. Selbst wenn sich der Bildschirm einschalten lässt, können verborgene Risiken bestehen. Wenden Sie sich zur weiteren Analyse an den Bildschirmhersteller.

### 6.5 Anzeigefehler trotz erfolgreichen Trainings analysieren und beheben

Bleibt die Anzeige trotz erfolgreichen Link-Trainings schwarz oder fehlerhaft, versuchen Sie die folgenden Diagnoseverfahren nacheinander.

#### 6.5.1 Selbsttestmodus aktivieren

Einzelheiten enthalten die Abschnitte zum Selbsttestmodus des Panels und des Controllers.

#### 6.5.2 Erwarteten VOP-Status prüfen

Siehe den vorherigen Abschnitt zum Prüfen des VOP-Status.

#### 6.5.3 Erwartete Taktkonfiguration prüfen

Siehe den vorherigen Abschnitt zum Anzeigen der Taktkonfiguration.

### 6.6 Signalqualität optimieren

#### 6.6.1 PE/VS-Stufen optimieren

Siehe den Abschnitt zum Ändern der PE/VS-Konfiguration.

#### 6.6.2 SSC aktivieren

SSC (Spread Spectrum Clocking) kann elektromagnetische Störungen (EMI) sowie den Einfluss von Versorgungsspannungsrauschen verringern und dadurch die Signalintegrität verbessern.

RK-Plattformen aktivieren SSC standardmäßig, wenn die Senke diese Funktion unterstützt. Die Erkennungsfunktion ist nachfolgend dargestellt; durch zusätzliche Protokollausgaben lässt sich die Unterstützung prüfen:

```text
bool analogix_dp_ssc_supported(struct analogix_dp_device *dp)
{
   /* Check if SSC is supported by both sides */

   return dp->plat_data->ssc && dp->link_train.ssc;
}
```

Um SSC zu erzwingen, lassen Sie die obige Funktion True zurückgeben. U-Boot und Kernel müssen beide entsprechend geändert werden.

{% endraw %}
