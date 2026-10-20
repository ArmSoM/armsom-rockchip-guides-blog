---
title: "Rockchip DRM-Anzeigetreiber: Vollständiger Leitfaden zu VOP, DCLK und Mehrschirmbetrieb"
description: "Vollständige Rockchip-DRM-Referenz V5.9.0: U-Boot- und Kerneltreiber, DTS, Farbraum, VOP/DCLK-Zuteilung, Mehrschirmbetrieb, Timing, Bandbreite, Diagnose und häufige Fragen."
translation_key: "044-rockchip-drm-display-driver"
slug: "044-rockchip-drm-display-driver"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Redaktion · Rockchip-Quelldokumentation"
category: "linux"
products: ["Sige7", "Sige3", "Sige5", "CM5"]
tags: ["DRM", "VOP", "DCLK", "RK3588", "RK3576", "Linux"]
keywords: "ArmSoM Rockchip DRM VOP DCLK RK3588 RK3576 Mehrschirmbetrieb"
excerpt: "Vollständige Rockchip-DRM-Referenz V5.9.0: U-Boot- und Kerneltreiber, DTS, Farbraum, VOP/DCLK-Zuteilung, Mehrschirmbetrieb, Timing, Bandbreite, Diagnose und häufige Fragen."
---

{% raw %}
# Rockchip DRM-Anzeigetreiber: Vollständiger Leitfaden zu VOP, DCLK und Mehrschirmbetrieb

## Anwendbarkeit auf ArmSoM

Dies ist eine Plattformreferenz des Herstellers, kein ArmSoM-Testbericht. Die offizielle ArmSoM-Dokumentation ordnet Sige7 dem RK3588, Sige3 dem RK3568B2 und Sige5/CM5 dem RK3576 zu. Die entsprechenden SoC-Kapitel können für diese Plattformen hilfreich sein. Tatsächliche Anzeigeschnittstellen, SDK/BSP-Branch, Device Tree und Kernelpatches des Boards müssen jedoch geprüft werden. Die Quelle behandelt die unten aufgeführten Linux-Versionen 4.4, 4.19, 5.10 und 6.1; allein die Kernelversion belegt nicht, dass ein Mainline-Kernel diese Herstellerfunktionen enthält. Änderungen an Zielhardware, Registern, Takten, Speicher und Spannungen wurden nicht validiert.

Quellen: Das chinesische und das englische *Rockchip DRM Display Driver Developer Guide* tragen beide V5.9.0; das chinesische PDF hat 81, das englische 87 Seiten. Chinesisch folgt dem chinesischen, Englisch und Russisch dem englischen Original. Deutsch übersetzt vollständig die englische Artikelfassung und verwendet dieselben Bild-URLs. Die Kapitelnummern stimmen überein, Tabellenlayout, Begriffe und Beispieltexte weichen jedoch ab; siehe die [redaktionellen Prüfnotizen](/docs/rockchip-drm-display-driver/EDITORIAL-NOTES.md). Die chinesische Fassung verwendet alle 55 chinesischen Originalabbildungen, Englisch, Russisch und Deutsch die 55 englischen Originalabbildungen als eigenständige Dateien. Nichttechnische Titelseitenangaben, Zielgruppe und Änderungshistorie sind entfernt; technische Versionen und alle 12 Kapitel bleiben erhalten. Die Boardanpassung anhand der [offiziellen ArmSoM-Dokumentation](https://docs.armsom.org/) prüfen.

> Lesehinweis: Parameter und Protokolle sind Quellbeispiele, keine ArmSoM-Messwerte. Unklarheiten betreffen unter anderem die 600MHz-Grenze, Aussagen zur PLL-Frequenzteilung, Layer-Zuteilungszahlen und Dateinamen. Die ursprünglichen technischen Informationen bleiben erhalten und sind einzeln in den Prüfnotizen erfasst. Spannungs-, Takt-, IOMMU- und Registeränderungen müssen mit Ziel-BSP und Hardwaregrenzen abgeglichen werden; nicht direkt auf Produktivgeräte anwenden.

## Vorwort und Produktversionen

Dieser Leitfaden beschreibt grundlegende Eigenschaften, Abläufe und typische Probleme von VOP und Anzeigeschnittstellen der Rockchip-Prozessoren im DRM-Framework. Er soll das Verständnis der DRM-Anzeigetreiber und Hardwareschnittstellen verbessern und die Diagnose sowie Behebung häufiger Probleme beschleunigen.

| Chip | Kernelversion |
| --- | --- |
| RK3036 | Linux-Kernel 4.4 oder neuer |
| RK312X/PX3SE | Linux-Kernel 4.4 oder neuer |
| RK3288 | Linux-Kernel 4.4 oder neuer |
| RK322X/RK312XH | Linux-Kernel 4.4 oder neuer |
| RK3308 | Linux-Kernel 4.4 oder neuer |
| RK322XH/RK332X | Linux-Kernel 4.4 oder neuer |
| RK3326/PX30 | Linux-Kernel 4.4 oder neuer |
| RK3368/PX5 | Linux-Kernel 4.4 oder neuer |
| RK3399 | Linux-Kernel 4.4 oder neuer |
| RK1808 | Linux-Kernel 4.4 oder neuer |
| RV1109/RV1126 | Linux-Kernel 4.19 oder neuer |
| RK356X | Linux-Kernel 4.19 oder neuer |
| RK3588 | Linux-Kernel 5.10 oder neuer |
| RV1103/RV1106 | Linux-Kernel 5.10 oder neuer |
| RK3528 | Linux-Kernel 4.19 oder neuer |
| RK3562 | Linux-Kernel 5.10 oder neuer |
| RK3576 | Linux-Kernel 6.1 oder neuer |
| RK3506 | Linux-Kernel 6.1 oder neuer |
| RV1126B | Linux-Kernel 6.1 oder neuer |

## 1. Überblick über das Rockchip-Anzeigesubsystem (DSS)

Das Anzeigesubsystem bezeichnet gemeinsam die Software- und Hardwaresysteme der Rockchip-Anzeigeausgabe. Dazu gehören VOP, auf älteren Plattformen wie RK3188/RK3066 als LCDC bezeichnet, sowie Ausgabemodule für RGB, BT1120, BT656, I8080 (MCU-Anzeigeschnittstelle), LVDS, MIPI DSI, EDP, DP und HDMI samt zugehörigen Treibern.

Die Hardwarestruktur des gesamten Anzeigesystems ist nachfolgend dargestellt:

![Originalabbildung: 1. Überblick über das Rockchip-Anzeigesubsystem (DSS); PDF S. 7](/docs/rockchip-drm-display-driver/assets/en-p7-X148.png)

Architektur des Anzeigesubsystems VOP 1.0

![Originalabbildung: 1. Überblick über das Rockchip-Anzeigesubsystem (DSS); PDF S. 7](/docs/rockchip-drm-display-driver/assets/en-p7-X150.png)

Architektur des Anzeigesubsystems VOP 2.0

Das DSS-Blockbild zeigt ein Grafikbeschleunigungsmodul aus RGA, GPU und VPU im Anzeigepfad. Diese für Bildverarbeitung optimierten Hardware-IPs erzeugen und verarbeiten Bilder effizient: Die GPU rendert über OpenGL, RGA übernimmt etwa Skalierung, Rotation und Komposition in 2D, und VPU dekodiert Video. Dadurch wird die CPU entlastet.

Die von diesen Beschleunigern verarbeiteten Daten liegen im DDR und werden von VOP gelesen. Nach anwendungsabhängiger Alpha-Überlagerung, Farbraumumwandlung, Gammakorrektur und HDR-Konvertierung gehen sie an das jeweilige Anzeigeschnittstellenmodul (HDMI/DP/DSI/RGB/LVDS). Diese Module wandeln die Daten in protokollkonforme Ströme um und senden sie an Monitor oder Panel.

Rockchip verwendet zwei VOP-Architekturen: VOP 1.0 und VOP 2.0. Sie unterscheiden sich vor allem im Mehrschirmbetrieb. VOP 1.0 nutzt mehrere VOPs: Normalerweise erzeugt ein VOP gleichzeitig nur ein unabhängiges Anzeigetiming für einen Bildschirm mit eigenen Inhalten. Zwei unabhängige Anzeigen benötigen zwei VOPs. Deshalb besitzen Zweischirmplattformen wie RK3288, RK3399 und PX30 zwei unabhängige VOPs.

VOP 2.0 verwendet eine einheitliche Architektur mit nur einem VOP im gesamten SoC, aber mehreren unabhängigen Video-Port-Ausgängen (VP) am hinteren Ende. Diese arbeiten gleichzeitig und liefern unabhängige Timings. Die drei VPs im gezeigten Blockbild ermöglichen beispielsweise drei Bildschirme mit unterschiedlichen Inhalten.

Welche Chips VOP 1.0 oder VOP 2.0 verwenden, erläutert das spätere Kapitel Display Feature.

## 2. Überblick über DRM

DRM steht für Direct Rendering Manager und verwaltet Anzeigeausgabe, Pufferzuweisung und Framebuffer. Die zugehörige Userspace-Bibliothek libdrm kapselt Steuerfunktionen und erleichtert Anzeigesteuerung sowie Pufferanforderung. DRM-Geräteknoten heißen "/dev/dri/cardX" mit X von 0–15; standardmäßig wird /dev/dri/card0 verwendet.

Seit Linux 4.4 verwenden die Rockchip-Anzeigetreiber das DRM-Anzeigeframework.

Ein System kann mehrere DRM-Geräte enthalten. Die Zuordnung ihrer /dev/dri/cardX-Knoten ist nicht fest, sondern hängt von der Ladereihenfolge der DRM-Treiber ab.

Beispielsweise verwenden auf den beschriebenen Rockchip-Plattformen sowohl Anzeigesubsystem als auch NPU-Treiber DRM. Deshalb erscheinen meist /dev/dri/card0 und /dev/dri/card1. Welcher Knoten Anzeige oder NPU entspricht, ist nicht festgelegt; üblicherweise wird der zuerst geladene Treiber als card0 registriert.

Nach dem Öffnen von /dev/dri/card0 oder /dev/dri/card1 muss eine Anwendung daher zusätzlich prüfen, ob es ein Anzeigegerät ist. Rockchip bietet dafür zwei Verfahren:

1. Mit der libdrm-API drmIsKMS(int fd) prüfen, ob das geöffnete Gerät die Anzeigefunktion unterstützt. NPU-Geräte unterstützen diese nicht.

2. Mit drmOpen("rockchip", NULL) aus libdrm gezielt den Rockchip-DRM-Treiber öffnen.

### 2.1 Grundbegriffe

Zur Verwaltung der Hardwaremodule im Anzeigepfad definiert DRM folgende Begriffe:

| Grundbegriff | Beschreibung |
| --- | --- |
| CRTC | Anzeigecontroller. Auf Rockchip die Abstraktion des SoC-internen VOP-Moduls (in manchen Dokumenten LCDC) oder eines Video Ports in VOP2 |
| Plane | Bildebene: Abstraktion eines win-Layers im SoC-internen VOP-/LCDC-Modul |
| Encoder | Ausgabewandler für Anzeigeschnittstellen wie RGB, LVDS, DSI, eDP, DP, HDMI, CVBS oder VGA |
| Connector | Schnittstellenanteil für die Verbindung zwischen Encoder und Panel |
| Bridge | Brückengerät, meist zur Registrierung eines hinter dem Encoder angeschlossenen Wandlers, beispielsweise DSI2HDMI |
| Panel | Bildschirm beziehungsweise Abstraktion verschiedener LCD-Anzeigegeräte |
| GEM | DRM-Pufferverwaltung und -zuweisung, vergleichbar mit ION und DMA BUFFER |

### 2.2 Anzeigepfad

![Originalabbildung: 2.2 Anzeigepfad; PDF S. 9](/docs/rockchip-drm-display-driver/assets/en-p9-X162.png)

### 2.3 Interaktion zwischen DRM-Treiber und libdrm

![Originalabbildung: 2.3 Interaktion zwischen DRM-Treiber und libdrm; PDF S. 10](/docs/rockchip-drm-display-driver/assets/en-p10-X166.png)

## 3. Softwaretreiber

### 3.1 U-Boot-Treiber

Der U-Boot-Anzeigetreiber hat hauptsächlich zwei Aufgaben: Startlogo und Ladeanzeige darstellen.

Auf Rockchip ist das Startlogo üblicherweise zweistufig: U-Boot-Logo und Kernel-Logo.

![Originalabbildung: 3.1 U-Boot-Treiber; PDF S. 10](/docs/rockchip-drm-display-driver/assets/en-p10-X167.png)

Standard-U-Boot-Logo

![Originalabbildung: 3.1 U-Boot-Treiber; PDF S. 11](/docs/rockchip-drm-display-driver/assets/en-p11-X173.png)

Standard-Kernel-Logo

Beide Bilder liegen standardmäßig im Wurzelverzeichnis des Linux-Kernels (logo.bmp und logo_kernel.bmp). Beim Kernelbuild werden sie in resource.img und anschließend in Boot.img gepackt.

Beim Start lädt U-Boot beide Dateien in den Speicher. Das U-Boot-Logo erscheint während der U-Boot-Phase. Die Speicheradresse des Kernel-Logos wird an Linux übergeben, das es bei der Initialisierung des DRM-Treibers anzeigt.

#### 3.1.1 Treiberverzeichnis

```text
drivers/video/drm/
```

#### 3.1.2 Treiberdateien

| Treiber | Datei |
| --- | --- |
| Core | rockchip_display.c<br>rockchip_crtc.c<br>rockchip_connector.c<br>rockchip_phy.c<br>rockchip_panel.c<br>rockchip_bridge.c |
| VOP | rockchip_vop.c<br>rockchip_vop_reg.c<br>rockchip_vop2.c<br>rockchip_vop2_reg.c |
| RGB | rockchip_rgb.c<br>inno_video_combo_phy.c |
| LVDS | rockchip_lvds.c<br>inno_video_combo_phy.c |
| MIPI-DSI | drm_mipi_dsi.c<br>dw_mipi_dsi2.c<br>inno_mipi_phy.c<br>inno_video_combo_phy.c<br>samsung_mipi_dcphy.c |
| eDP | rockchip_analogix_dp.c<br>rockchip_analogix_dp_reg.c |
| HDMI | dw_hdmi.c<br>rockchip_dw_hdmi.c<br>rockchip-inno-hdmi-phy.c<br>inno_hdmi.c<br>dw_hdmi_qp.c<br>rockchip_dw_hdmi_qp.c<br>phy-rockchip-samsung-hdptx-hdmi.c |
| TVE /CVBS | rockchip_drm_tve.c |
| DP | dw-dp.c<br>drm_dp_helper.c<br>phy-rockchip-usbdp.c |

Die Treiberdateien können sich je nach U-Boot-Version geringfügig unterscheiden. Der Großteil und die Frameworkstruktur bleiben weitgehend gleich; die Angaben anhand der tatsächlichen Version anpassen.

#### 3.1.3 Schnittstellenbeschreibung

1\. U-Boot-Logo anzeigen

```text
void rockchip_show_logo(void)
```

2\. Bestimmtes BMP-Bild anzeigen, derzeit hauptsächlich für das Ladelogo

```text
void rockchip_show_bmp(const char *bmp)
```

3\. In U-Boot bestimmte Variablen durch Ändern der dtb-Datei an den Kernel übergeben, etwa Größe, Adresse, Format und Ausgabe-

timing sowie Overscan-Konfiguration des Kernel-Logos.

```text
void rockchip_display_fixup(void *blob)
```

#### 3.1.4 Anwendung der Logoanzeige

1\. U-Boot-Logo aktivieren

Das Logo wird über den route_xxx-Knoten der jeweiligen Schnittstelle im Kernel-DTS gesteuert; U-Boot-Anzeigemodul und Kernel verwenden dieselbe dtb. xxx kann dsi, edp, hdmi oder lvds sein. Im DTS nach route suchen.

Für MIPI DSI0 im Board-DTS den Knoten route_dsi0 suchen und status auf "okay" setzen:

```text
&route_dsi0 {
     status = "okay";
     connect = <&vp3_out_dsi0>;
};
```

Die Eigenschaft connect wird im späteren Kapitel zur DTS-Konfiguration erläutert.

2\. U-Boot-Logo bildschirmfüllend konfigurieren

Das Logo erscheint standardmäßig zentriert. Für Vollbild den route-Knoten der jeweiligen Schnittstelle ändern.

Für eine bildschirmfüllende DSI0-Logoausgabe die Eigenschaft logo,mode von route_dis0 auf "fullscreen" setzen. Die Quellschreibweise route_dis0 bleibt als dokumentierte Unstimmigkeit erhalten.

![Originalabbildung: 3.1.4 Anwendung der Logoanzeige; PDF S. 13](/docs/rockchip-drm-display-driver/assets/en-p13-X187.png)

3\. Anforderungen an Logobilder

U-Boot- und Linux-Kernel-Logo haben dieselbe Auflösung. Da VOP die virtuelle Breite in Wörtern angibt, muss die Bildbreite auf 4 Pixel ausgerichtet sein. Bei nicht durch 4 teilbaren Bildschirmbreiten für Vollbild die Bildbreite nach unten auf 4 Pixel ausrichten und logo,mode = "fullscreen" setzen.

Unterstützt werden nur BMP-Bilder mit 8, 16, 24 oder 32 Bit.

U-Boot- und Kernel-Logo müssen gleichzeitig aktiviert werden; sowohl logo.bmp als auch logo_kernel.bmp sind erforderlich.

4\. Startprotokoll prüfen

Ist die Logofunktion aktiviert und funktionsfähig, erscheint in U-Boot ein Protokoll ähnlich dem folgenden:

```text
Rockchip UBOOT DRM driver version: v1.0.1
vp0 have layer nr:2[0 2 ], primary plane: 2
vp1 have layer nr:2[1 3 ], primary plane: 3
vp2 have layer nr:2[6 8 ], primary plane: 8
vp3 have layer nr:2[7 9 ], primary plane: 9
Using display timing dts
dsi@fde20000: detailed mode clock 132000 kHz, flags[a]
  H: 1080 1095 1099 1129
  V: 1920 1935 1937 1952
bus_format: 100e
VOP update mode to: 1080x1920p0, type: MIPI0 for VP3
VOP VP3 enable Esmart3[654x270->654x270@213x825] fmt[2] addr[0xedf04000]
final DSI-Link bandwidth: 880000 Kbps x 4
......
hdmi_select_link_config use tmds mode
mode:1920x1080 bus_format:0x100a
hdmi@fde80000: detailed mode clock 148500 kHz, flags[5]
  H: 1920 2008 2052 2200
  V: 1080 1084 1089 1125
bus_format: 100a
VOP update mode to: 1920x1080p0, type: HDMI0 for VP0
......
VOP VP0 enable Esmart0[654x270->654x270@633x405] fmt[2] addr[0xedf04000]
......
CLK: (uboot. arm: enter 1200000 KHz, init 1200000 KHz, kernel 0N/A)
```

Das Protokoll zeigt die Logoausgabe auf VP0 und VP3.

VP0 verwendet 1920 x 1080 und HDMI.

VP3 verwendet 1080 x 1920 und MIPI DSI.

Das angezeigte Logo ist 654 x 270 groß.

5\. Logo um einen festen Winkel drehen

Soll das Logo wegen Hoch- oder Querformat gedreht erscheinen, es auf dem PC drehen, als neues Bild speichern und logo.bmp sowie kernel_logo.bmp im Kernelprojekt ersetzen. Die abweichende Quellschreibweise kernel_logo.bmp bleibt dokumentiert.

6\. Logoanzeige im Split-Modus

Im Split-Modus ist ein CRTC über zwei Connectoren mit zwei Bildschirmen verbunden. Für unterschiedliche linke und rechte Inhalte als zusammenhängendes Gesamtbild beide Bilder auf dem PC zusammensetzen, als ein Bild speichern und logo.bmp sowie kernel_logo.bmp im Kernelprojekt ersetzen.

7\. Nur ein Bild anzeigen

Für dasselbe Bild in U-Boot und Kernel entweder logo.bmp und kernel_logo.bmp identisch gestalten oder die Eigenschaften "logo,uboot" und "logo,kernel" im DTS-route-Knoten auf dasselbe Bild setzen.

8\. Logoanzeige mit 4K-Auflösung unterstützen

Die Standard-defconfig der Plattformen erlaubt keine normale 4K-Logoanzeige. Auf der seriellen Konsole erscheint etwa folgendes Protokoll:

```text
......
bmp[logo.bmp] size[23MB] is over the limitation MAX_IMAGE_BYTES[8MB]
failed to display uboot logo
CLK: (uboot. arm: enter 1008000 KHz, init 1008000 KHz, kernel 0N/A)
 bpll 816000 KHz
 lpll 816000 KHz
......
```

Am Beispiel RK3576 sind folgende Änderungen erforderlich:

```text
diff --git a/drivers/video/drm/rockchip_display.c b/drivers/video/drm/rockchip_display.c
index b1773ba6942..d1606db1ba5 100644
--- a/drivers/video/drm/rockchip_display.c
+++ b/drivers/video/drm/rockchip_display.c
@@ -52,7 +52,7 @@
#define RK_BLK_SIZE 512
#define BMP_PROCESSED_FLAG 8399
#define BYTES_PER_PIXEL sizeof(uint32_t)
-#define MAX_IMAGE_BYTES (8 * 1024 * 1024)
+#define MAX_IMAGE_BYTES (32 * 1024 * 1024)
DECLARE_GLOBAL_DATA_PTR;
static LIST_HEAD(rockchip_display_list);
diff --git a/include/configs/rk3576_common.h b/include/configs/rk3576_common.h
index 16abba314c5..b4a8ec3b898 100644
--- a/include/configs/rk3576_common.h
+++ b/include/configs/rk3576_common.h
@@ -22,7 +22,7 @@
#endif
#define CONFIG_SPL_LOAD_FIT_ADDRESS 0x42000000

-#define CONFIG_SYS_MALLOC_LEN (32 << 20)
+#define CONFIG_SYS_MALLOC_LEN (32 << 21)
#define CONFIG_SYS_CBSIZE 1024
#ifdef CONFIG_SUPPORT_USBPLUG
```

Außerdem muss CONFIG_DRM_MEM_RESERVED_SIZE_MBYTES auf 64 MB gesetzt werden.

Die Gründe für diese Änderungen:

(1) Wegen Speicherbedarf und Standard-Partitionstabelle sind sehr große BMP-Logos nicht empfohlen. MAX_IMAGE_BYTES ist deshalb auf 8 MB begrenzt. Für größere Bilder wird BMP im Format BI_RLE4/BI_RLE8 empfohlen.

(2) Ein übliches 4K-BMP mit BI_RGB und 24bpp ist etwa 24 MB groß. Der standardmäßige malloc-Heap umfasst meist 32 MB; BMP-Dekodierfunktionen können deshalb möglicherweise keinen Speicher anfordern.

(3) Für einen nahtlosen Übergang zwischen U-Boot- und Kernel-Logo haben beide Bilder meist dieselbe Auflösung und dasselbe Format. Der per CONFIG_DRM_MEM_RESERVED_SIZE_MBYTES reservierte Logobereich von standardmäßig 32 MB reicht dafür nicht aus.

9\. Verschiedene Inhalte auf verschiedenen Bildschirmen anzeigen

Nach folgendem Verfahren neue Bilder in resource.img packen und die entsprechende DTS-Datei ändern:

```text
--- a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
@@ -854,7 +854,7 @@ &display_subsystem {
     route {
         route_dp1: route-dp1 {
              status = "disabled";
-             logo,uboot = "logo.bmp";
+             logo,uboot = "logo_new.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
--- a/scripts/mkimg
+++ b/scripts/mkimg
+LOGO_NEW_PATH=${srctree}/logo_new.bmp
+[ -f ${LOGO_NEW_PATH} ] && LOGO_NEW=logo_new.bmp
+
LOGO_KERNEL_PATH=${srctree}/logo_kernel.bmp
[ -f ${LOGO_KERNEL_PATH} ] && LOGO_KERNEL=logo_kernel.bmp
@@ -233,6 +236,9 @@ if [ -x ${srctree}/scripts/bmpconvert ]; then
     if [ -f ${LOGO_PATH} ]; then
         ${srctree}/scripts/bmpconvert ${LOGO_PATH};
     fi
+    if [ -f ${LOGO_NEW_PATH} ]; then
+        ${srctree}/scripts/bmpconvert ${LOGO_NEW_PATH};
+    fi
@@ -242,12 +248,15 @@ if [ "${srctree}" != "${objtree}" ]; then
     if [ -f ${LOGO_PATH} ]; then
         cp -a ${LOGO_PATH} ${objtree}/;
     fi
+    if [ -f ${LOGO_NEW_PATH} ]; then
+        cp -a ${LOGO_NEW_PATH} ${objtree}/;
+    fi
fi
-scripts/resource_tool ${DTB_PATH} ${LOGO} ${LOGO_KERNEL} >/dev/null
-echo " Image: resource.img (with ${DTB} ${LOGO} ${LOGO_KERNEL}) is ready"
+scripts/resource_tool ${DTB_PATH} ${LOGO} ${LOGO_NEW} ${LOGO_KERNEL} >/dev/null
+echo " Image: resource.img (with ${DTB} ${LOGO} ${LOGO_NEW} ${LOGO_KERNEL}) is ready"
```

#### 3.1.5 Anwendung der Videokonsole

Diese Funktion zeigt U-Boot-Startmeldungen und Kommandozeile auf Bildschirm oder Monitor. Wie im Kapitel U-Boot-Treiber beschrieben, gibt es ein U-Boot- und ein Kernel-Logo. Bei aktivierter Videokonsole ersetzt deren Textanzeige das U-Boot-Logo; das Kernel-Logo erscheint weiterhin normal.

DTS-Konfiguration: Die U-Boot-Anzeige wie in Schritt 1 der Beschreibung zur Logoanzeige aktivieren.

defconfig-Konfiguration:

Videokonsole aktivieren:

```text
/* enable the video console */
CONFIG_ROCKCHIP_VIDCONSOLE=y
```

Auflösung und BPP (Bits Per Pixel) der Videokonsole konfigurieren, hier 1920x1080 16bpp:

```text
/* the resolution of the video console */
CONFIG_ROCKCHIP_VIDCONSOLE_WIDTH=1920
CONFIG_ROCKCHIP_VIDCONSOLE_HEIGHT=1080

/* the bits per pixel the of video console */
CONFIG_ROCKCHIP_VIDCONSOLE_BPP32 is not set
CONFIG_ROCKCHIP_VIDCONSOLE_BPP16=y
CONFIG_ROCKCHIP_VIDCONSOLE_BPP8 is not set
```

Ohne Vorgabe ist die horizontale Auflösung das Minimum der horizontalen Auflösungen aller Bildschirme beziehungsweise Monitore in den Anzeigepfaden. Dasselbe gilt vertikal. So wird die standardmäßige Framebuffergröße minimiert.

Beispiel RK3588: Gibt VP0 HDMI0 mit 1920x1080 und VP3 DSI0 mit 1080x1920 aus, verwendet die Videokonsole standardmäßig 1080x1080.

Ohne Vorgabe beträgt BPP standardmäßig 32.

Framebuffergröße der Videokonsole konfigurieren. Die Formel lautet:

`size = width × height × bpp / (8 × 1024 × 1024)`

Für 1920x1080 32bpp:

`size = 1920 × 1080 × 32 / (8 × 1024 × 1024) = 8 MB`

```text
/* the framebuffer size of video console */
CONFIG_ROCKCHIP_VIDCONSOLE_MEM_RESERVED_SIZE_MBYTES=8
```

Ohne Vorgabe beträgt die Framebuffergröße 16M. Benötigt die Videokonsole mehr, beispielsweise bei 3840x2160 32bpp, erscheint folgende Fehlermeldung und die Anzeige fällt auf das U-Boot-Logo zurück:

```text
......
video console fb size [33177600 Bytes] is over reserved [16777216 Bytes], then back to show uboot logo
......
```

#### 3.1.6 Flackern oder fehlende Anzeige beim Übergang vom U-Boot- zum Linux-Kernel-Logo untersuchen

1\. Normales Laden des DRM-Treibers prüfen

Beim Laden können Ressourcen noch fehlen, sodass das Binden des DRM-Treibers zunächst scheitert. Beispielsweise erscheint:

```text
[1.792387] dw-mipi-dsi2 fde20000.dsi: [drm:dw_mipi_dsi2_bind] *ERROR* Failed to find panel or bridge: -517
```

Das bedeutet, dass Panel oder Bridge noch nicht bereit sind. Das normale Treiberframework versucht später erneut zu binden. Erscheint schließlich das folgende Protokoll, ist der DRM-Treiber erfolgreich geladen; ein oder zwei anfängliche Bindefehler sind dann nicht besonders relevant:

```text
[2.566831] rockchip-drm display-subsystem: [drm] fb0: rockchipdrmfb frame buffer device
```

Wiederholen sich Bindefehler während des gesamten Starts, die DTS-Konfiguration prüfen. Häufige Produktprobleme: Ein GPIO wurde bereits von einem anderen Gerät registriert, eine falsche Panel-compatible-Angabe verhindert die Registrierung oder der Hintergrundbeleuchtungstreiber registriert sich nicht.

Bei folgenden Logo-Fehlermeldungen im Kernelprotokoll ist eine genaue Analyse zusammen mit dem Code erforderlich:

```text
rockchip-drm display-subsystem: failed to parse resources for logo display
rockchip-drm display-subsystem: connector[HDMI-A-1] can't found any modes
rockchip-drm display-subsystem: can't not find any logo display
rockchip-drm display-subsystem: failed to show loader logo
```

2\. DDR-Frequenzänderung verursacht Flackern oder verschobene Anzeige

(1) Den DDR-Frequenzwechselknoten im DTS testweise deaktivieren, damit während der Kernelphase keine DDR-Frequenzänderung erfolgt:

```text
&dmc {
  status = "disabled";
};
```

(2) Die DCLK-Frequenzanpassung während DDR-Frequenzwechseln testweise deaktivieren:

```text
&dmc {
  vop-dclk-mode = <1>;
};
```

3\. Änderungen am Taktbaum als Ursache

Auf manchen Plattformen werden die Taktbäume in U-Boot und Kernel unabhängig konfiguriert. Unterschiedliche Taktstrategien können beim erneuten Initialisieren der Kerneltakte Flackern auslösen. Für RK3399 lässt sich dies wie folgt prüfen:

(1) Am Eingang von rk3399_clk_init()@kernel/drivers/clk/rockchip/clk-rk3399.c while(1); ergänzen und prüfen, ob Flackern auftritt.

(2) Am Ende von rk3399_clk_init()@kernel/drivers/clk/rockchip/clk-rk3399.c while(1) ergänzen und erneut prüfen.

(3) Tritt bei (1) kein, bei (2) jedoch Flackern auf, liegt die Ursache sehr wahrscheinlich im veränderten Taktbaum. Laut Quelle die verantwortliche CRU-Person der Plattform kontaktieren oder einen Redmine-Eintrag mit Zuweisung an die PLL-Verantwortlichen erstellen.

4\. Abschalten von Takten als Ursache

Ablauf- oder Softwarefehler können dazu führen, dass benötigte Takte bei der Treiberregistrierung nicht aktiviert sind. Das Framework schaltet sie später automatisch ab und die Anzeige wird fehlerhaft. Zum Testen lassen sich die Takte standardmäßig eingeschaltet lassen:

Im DTS den chosen-Knoten suchen und clk_ignore_unused an bootargs anhängen, beispielsweise bootargs = "xxxx clk_ignore_unused”; die Originalanführungszeichen sind nicht als geprüftes DTS-Beispiel zu verstehen.

![Originalabbildung: 3.1.6 Flackern oder fehlende Anzeige beim Übergang vom U-Boot- zum Linux-Kernel-Logo untersuchen; PDF S. 18](/docs/rockchip-drm-display-driver/assets/en-p18-X212.png)

5\. Unterschiedliche Bildgrößen von U-Boot- und Kernel-Logo

Rockchip verlangt dieselben Auflösungen beider Logobilder. Ist U-Boot korrekt und die Kernelanzeige fehlerhaft, die Auflösungen von logo.bmp und logo_kernel.bmp im Kernelverzeichnis vergleichen.

![Originalabbildung: 3.1.6 Flackern oder fehlende Anzeige beim Übergang vom U-Boot- zum Linux-Kernel-Logo untersuchen; PDF S. 18](/docs/rockchip-drm-display-driver/assets/en-p18-X213.png)

6\. Erneute Initialisierung von Versorgungs-GPIOs beim Kernelstart

Hier sind zahlreiche Ursachen möglich. Beim Portieren eines Projekts rechtzeitig prüfen, ob die anzeigebezogenen Versorgungs-GPIOs mit anderen Modulen kollidieren.

Ist das DTS korrekt, anhand der seriellen Protokollschlüssel im Kernelcode suchen. Durch binäres Eingrenzen mit Haltepunkten an den Modul-Ladepositionen den flackerauslösenden Punkt ermitteln.

7\. VOP-Prioritätskonfiguration

Hat VOP nicht die höchste Priorität, können andere IPs während des Kernelstarts den Bus belegen und Flackern verursachen. Laut Quelle ist dieses Problem üblicherweise vor SDK-Auslieferung behoben.

8\. Versorgung und Signale messen

Falls die genannten Verfahren die Ursache nicht finden, mit dem Oszilloskop CLK, DATA, Versorgung und weitere relevante Signale vom U-Boot- bis zum Kernelstart aufzeichnen und einen Redmine-Eintrag erstellen.

### 3.2 Kerneltreiber

#### 3.2.1 Treiberverzeichnis

```text
drivers/gpu/drm/rockchip/
drivers/gpu/drm/bridge/analogix/
drivers/gpu/drm/bridge/synopsys/
drivers/phy/rockchip/
```

#### 3.2.2 Treiberdateien

| Treiber | Datei | Dokument |
| --- | --- | --- |
| Core | rockchip_drm_drv.c<br>rockchip_drm_fb.c<br>rockchip_drm_fbdev.c<br>rockchip_drm_gem.c<br>rockchip_drm_logo.c<br>rockchip_drm_direct_show.c<br>panel-simple.c | rockchip-drm.txt oder rockchip-drm.yaml |
| VOP | rockchip_drm_vop.c<br>rockchip_vop_reg.c<br>rockchip_drm_vop2.c<br>rockchip_vop2_reg.c | rockchip-vop.txt oder rockchip-vop.yaml |
| RGB | rocckhip_rgb.c<br>phy-rockchip-inno-video-combo-phy.c | rockchip-rgb.txt |
| LVDS | rockchip_lvds.c<br>phy-rockchip-inno-video-combo-phy.c | rockchip-lvds.txt |
| MIPI-DSI | dw-mipi-dsi.c<br>phy-rockchip-inno-dsidphy.c<br>phy-rockchip-inno-video-combo-phy.c<br>dw-mipi-dsi2-rockchip.c<br>phy-rockchip-samsung-dcphy.c | dw_mipi_dsi_rockchip.txt<br>phy-rockchip-inno-mipi-dphy.txt |
| eDP | analogix_dp_core.c<br>analogix_dp-rockchip.c<br>analogix_dp_reg.c<br>phy-rockchip-dp.c | analogix_dp-rockchip.txt<br>analogix_dp.txt<br>rockchip-dp-phy.txt |
| DP | cdn-dp-core.c<br>cdn-dp-reg.c<br>dw-dp.c<br>phy-rockchip-usbdp.c<br>phy-rockchip-samsung-hdptx-hdmi.c | cdn-dp-rockchip.txt |
| HDMI | inno_hdmi.c<br>dw-hdmi.c<br>dw_hdmi-rockchip.c<br>phy-rockchip-inno-hdmi-phy.c<br>dw-hdmi-qp.c<br>phy-rockchip-samsung-hdptx-hdmi.c | inno_hdmi-rockchip.txt<br>dw_hdmi-rockchip.txt<br>phy-rockchip-inno-hdmi-phy.txt |
| TVE/CVBS | rockchip_drm_tve.c | rockchip_drm_tve.txt |

Die Treiberdateien können je nach Kernelversion geringfügig angepasst sein. Der Großteil und die Frameworkstruktur bleiben jedoch weitgehend unverändert. Bei der Verwendung die tatsächliche Version berücksichtigen.

#### 3.2.3 Ablauf des Treiberladens

![Originalabbildung: 3.2.3 Ablauf des Treiberladens; PDF S. 20](/docs/rockchip-drm-display-driver/assets/en-p20-X221.png)

Der DRM-Treiber setzt sich aus Treibern mehrerer anzeigebezogener Module zusammen. Im Anzeigepfad hängen etwa Hintergrundbeleuchtung, Panel, rgb, lvds, dsi, edp, lvds, hdmi und vop voneinander ab. Erst wenn sämtliche benötigten Module geladen sind, kann das DRM-System vollständig starten.

Bei diesen komplexen Abhängigkeiten kann während der DRM-Initialisierung eine Ressource vorübergehend fehlen und das Laden eines Moduls verhindern. Deshalb verwendet DRM das Deferred-Probe-Verfahren der Linux-Treiber: Fehlt eine abhängige Ressource, gibt der Treiber -EPROBE_DEFER(-517) zurück und beendet den Versuch. Der Kernel versucht später erneut zu laden, bis die Ressource verfügbar und der Treiber erfolgreich geladen ist.

```text
[1.747190] rockchip-drm display-subsystem: bound fdd90000.vop (ops vop2_component_ops)
[1.747877] dwhdmi-rockchip fde80000.hdmi: registered ddc I2C bus driver
[1.748022] rockchip-drm display-subsystem: bound fde80000.hdmi (ops dw_hdmi_rockchip_ops)
[1.748676] dwhdmi-rockchip fdea0000.hdmi: registered ddc I2C bus driver
[1.748807] rockchip-drm display-subsystem: bound fdea0000.hdmi (ops dw_hdmi_rockchip_ops)
[1.748840] dw-mipi-dsi2 : [drm:dw_mipi_dsi2_bind] *ERROR* Failed to find panel or bridge: -517
[1.755174] panel-simple-dsi fde20000.dsi.0: failed to get power regulator: -517
[1.759296] brd: module loaded
[1.764374] loop: module loaded
[1.764528] zram: Added device: zram0
[1.764698] system_heap: orders[0] = 6
[2.248871] imx415 5-001a: supply dovdd not found, using dummy regulator
[2.416673] rockchip-drm display-subsystem: bound fdd90000.vop (ops vop2_component_ops)
[2.418711] dwhdmi-rockchip fde80000.hdmi: registered ddc I2C bus driver
[2.420336] rockchip-drm display-subsystem: bound fde80000.hdmi (ops dw_hdmi_rockchip_ops)
[2.421725] dwhdmi-rockchip fdea0000.hdmi: registered ddc I2C bus driver
[2.422291] rockchip-drm display-subsystem: bound fdea0000.hdmi (ops dw_hdmi_rockchip_ops)
[2.422318] dw-mipi-dsi2 : [drm:dw_mipi_dsi2_bind] *ERROR* Failed to find panel or bridge: -517
[2.433888] input: adc-keys as /devices/platform/adc-keys/input/input3
[2.466237] rockchip-drm display-subsystem: bound fdd90000.vop (ops vop2_component_ops)
[2.468705] dwhdmi-rockchip fde80000.hdmi: registered ddc I2C bus driver
[2.469751] rockchip-drm display-subsystem: bound fde80000.hnd fde20000.dsi (ops dw_mipi_dsi2_ops)
[2.472282] rockchip-drm display-subsystem: bound fde50000.dp (ops dw_dp_component_ops)
[2.472319] rockchip-drm display-subsystem: bound fde60000.dp (ops dw_dp_component_ops)
[2.531892] rockchip-drm display-subsystem: [drm] fb0: rockchipdrmfb frame buffer device
[2.532850] [drm] Initialized rockchip 3.0.0 20140818 for display-subsystem on minor 0
```

Im Protokoll gibt der MIPI-DSI-Treiber in Zeile 6 und 18 wegen eines fehlenden Panels oder einer Bridge -EPROBE_DEFER zurück. In Zeile 23 ist die Ressource verfügbar und DSI bindet erfolgreich. Schließlich erscheint die Standardmeldung für den vollständig geladenen DRM-Treiber.

```text
[2.532850] [drm] Initialized rockchip 3.0.0 20140818 for display-subsystem on minor 0
```

#### 3.2.4 DTS-Konfiguration

##### 3.2.4.1 Grundkonfiguration

Ein SoC kann mehrere VOP-, HDMI-, eDP-, DP-, MIPI- und Panelmodule besitzen. Ein konkretes Produkt verwendet daraus möglicherweise nur einen Teil für seinen Anzeigepfad. Welche Module beteiligt sind und wie sie verbunden werden, legt das DTS fest.

Im zentralen DTSI jedes SoC mit DRM-Anzeigeunterstützung gibt es folgenden display_subsystem-Knoten:

```text
display_subsystem: display-subsystem {
    compatible = "rockchip,display-subsystem";
    memory-region = <&drm_logo>, <&drm_cubic_lut>;
    memory-region-names = "drm-logo", "drm-cubic-lut";
    ports = <&vop_out>;
    devfreq = <&dmc>;

    route {
         route_dsi0: route-dsi0 {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp0_out_dsi0>;
         };
         route_dsi1: route-dsi1 {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp0_out_dsi1>;
         };
         route_edp: route-edp {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp0_out_edp>;
         };
         route_hdmi: route-hdmi {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp1_out_hdmi>;
         };
         route_lvds: route-lvds {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp1_out_lvds>;
         };
         route_rgb: route-rgb {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp2_out_rgb>;
         };
    };
};
```

Dieser Knoten steuert das Laden von rockchip_drm_drv.c.

memory-region steuert Zuweisung und Übergabe des Logoanzeigepuffers. U-Boot ändert die Eigenschaft beim Start dynamisch und übergibt sie an den Kernel.

route_xxx-Knoten bestimmen, ob das Startlogo der jeweiligen Schnittstelle aktiviert ist. Standardmäßig sind sie deaktiviert.

Die zugehörigen Eigenschaften am Beispiel route_rgb:

```text
route_rgb: route-rgb {
  status = "disabled";
     logo,uboot = "logo.bmp";
     logo,kernel = "logo_kernel.bmp";
     logo,mode = "center";
     charge_logo,mode = "center";
     connect = <&vp2_out_rgb>;
};
```

logo,uboot und logo,kernel geben die Bildnamen für U-Boot- und Kernelphase an und müssen zu den tatsächlichen Bildressourcen passen.

logo,mode und charege_logo,mode steuern die Bilddarstellung mit den Modi center und fullscreen. Die Quellschreibweise charege_logo,mode bleibt erhalten.

connect legt fest, mit welchem Video Port von VOP 2.0 beziehungsweise welchem VOP bei VOP 1.0 die Schnittstelle verbunden ist. Dies entsprechend der tatsächlichen Nutzung konfigurieren.

Die meisten Eigenschaften von display_subsystem müssen nicht geändert werden. Üblicherweise genügt es, die benötigten Logoknoten nach Produktanforderung zu aktivieren oder zu deaktivieren.

Der vop-Knoten:

```text
vop: vop@fe040000 {
  compatible = "rockchip,rk3568-vop";
  reg = <0x0 0xfe040000 0x0 0x3000>, <0x0 0xfe044000 0x0 0x1000>;
  reg-names = "regs", "gamma_lut";
  rockchip,grf = <&grf>;
  interrupts = <GIC_SPI 148 IRQ_TYPE_LEVEL_HIGH>;
  clocks = <&cru ACLK_VOP>, <&cru HCLK_VOP>, <&cru DCLK_VOP0>, <&cru DCLK_VOP1>, <&cru DCLK_VOP2>;
  clock-names = "aclk_vop", "hclk_vop", "dclk_vp0", "dclk_vp1", "dclk_vp2";
  iommus = <&vop_mmu>;
  power-domains = <&power RK3568_PD_VO>;
  status = "disabled";
  vop_out: ports {
     ......
     vp0: port@0 {
       ......
       vp0_out_dsi0: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dsi0_in_vp0>;
       };
       vp0_out_dsi1: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&dsi1_in_vp0>;
       };

       vp0_out_edp: endpoint@2 {
         reg = <2>;
         remote-endpoint = <&edp_in_vp0>;
       };
       vp0_out_hdmi: endpoint@3 {
         reg = <3>;
         remote-endpoint = <&hdmi_in_vp0>;
       };
     };
     vp1: port@1 {
       ......
       vp1_out_dsi0: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dsi0_in_vp1>;
       };

       vp1_out_dsi1: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&dsi1_in_vp1>;
       };

       vp1_out_edp: endpoint@2 {
         reg = <2>;
         remote-endpoint = <&edp_in_vp1>;
       };
       vp1_out_hdmi: endpoint@3 {
         reg = <3>;
         remote-endpoint = <&hdmi_in_vp1>;
       };

       vp1_out_lvds: endpoint@4 {
         reg = <4>;
         remote-endpoint = <&lvds_in_vp1>;
       };
     };
     vp2: port@2 {
       ......
       vp2_out_lvds: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&lvds_in_vp2>;
       };
       vp2_out_rgb: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&rgb_in_vp2>;
       };
     };
  };
};
```

Dieser Knoten beschreibt VOP-Hardwareressourcen und steuert das Laden von rockchip_drm_vop.c/rockchip_drm_vop2.c. Er legt folgende Verbindungen des Anzeigepfads fest:

![Originalabbildung: 3.2.4.1 Grundkonfiguration; PDF S. 25](/docs/rockchip-drm-display-driver/assets/en-p25-X236.png)

vop_out: ports beschreibt die VOP-Ausgabekanäle. vp0/1/2 entsprechen den drei unabhängigen Ausgabepfaden Video Port0/1/2.

endpoint-Knoten unter vp0/1/2 : port beschreiben die Verbindung von VP und Anzeigeschnittstelle. Im Beispiel enthält vp0 vier Knoten: vp0_out_dsi0, vp0_out_dsi1, vp0_out_edp und vp0_out_hdmi. VP0 kann somit mit dsi0, dsi1, edp oder hdmi verbunden werden.

Jeder endpoint bildet über remote-endpoint einen Verbindungspfad mit der zugehörigen Schnittstelle. Beispiel HDMI:

```text
hdmi: hdmi@fe0a0000 {
  compatible = "rockchip,rk3568-dw-hdmi";
  ......
  status = "disabled";

  ports {
     ......
     port@0 {
       reg = <0>;
       ......
       hdmi_in_vp0: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&vp0_out_hdmi>;
         status = "disabled";
       };
       hdmi_in_vp1: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&vp1_out_hdmi>;
         status = "disabled";
       };
     };
  };
};
```

Aus diesem DTS folgt, dass HDMI auf rk3568 mit vp0 oder vp1 des VOP verbunden werden kann.

Eine Anzeigeschnittstelle kann gleichzeitig nur mit einem VP verbunden sein. Im Board-DTS die verwendeten Pfade aktivieren und ungenutzte auf disabled setzen.

Soll HDMI im Produkt mit vp0 verbunden werden, sind folgende DTS-Einstellungen erforderlich:

```text
&hdmi {
     status = "okay";
};

&hdmi_in_vp0 {
     status = "okay";
};
&hdmi_in_vp1 {
     status = "disabled";
};

&route_hdmi {
     status = "okay";
     connect = <&vp0_out_hdmi>;
};
```

##### 3.2.4.2 Strategie zur Layer-Zuteilung festlegen

VOP2 verwendet eine einheitliche Anzeigearchitektur. Die unabhängigen Video Ports teilen sämtliche VOP-Layerressourcen, die jedoch exklusiv verwendet werden müssen: Ein Layer kann gleichzeitig nur einem Video Port gehören.

Damit alle Layer sinnvoll genutzt werden, erzeugt U-Boot anhand der im Produkt-DTS konfigurierten Schnittstellentypen und -anzahl eine Standardzuteilung. Ohne U-Boot-Logo oder bei besonderen Anforderungen kann die Layer-Zuteilung nach folgendem Muster im DTS festgelegt werden:

rockchip,plane-mask: Maske der diesem VP zugewiesenen Layer-IDs. Die IDs stehen in dt-bindings/display/rockchip_vop.h.

rockchip,primary-plane: primären Layer festlegen. Dieser muss zu rockchip,plane-mask des aktuellen VP gehören. Üblicherweise wird ein Smart- oder Esmart-Layer gewählt.

Grundregel ist, alle Layer möglichst gleichmäßig auf die verwendeten VPs zu verteilen: rk3568 hat 6, rk3588 8 Layer. Ungenutzte VPs erhalten üblicherweise keine. Da Cluster, Esmart und Smart unterschiedliche Leistung und Beschränkungen besitzen, möglichst auch die Layertypen gleichmäßig verteilen.

Das folgende typische RK3568-Beispiel verteilt 6 Layer (2 Cluster + 2 Esmart + 2 Smart) für drei unterschiedliche Anzeigen. Laut Quelle sollen dem häufigsten Hauptbildschirm, hier VP1, möglichst mehr als drei und den übrigen Schnittstellen mindestens zwei Layer zugewiesen werden. Diese Zahlen sind mit insgesamt sechs Layern nicht gleichzeitig erfüllbar; die Originalangaben bleiben als Prüfpunkt erhalten.

```text
#include <dt-bindings/display/rockchip_vop.h> // Layer ID definition header file

&vp0 {
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER1 | 1 << ROCKCHIP_VOP2_SMART1)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART1>;
};

&vp1 {
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER0 | 1 << ROCKCHIP_VOP2_ESMART0 | 1 <<
ROCKCHIP_VOP2_SMART0)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART0>;
};
&vp2 {
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_ESMART1)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_ESMART1>;
};
```

Nach wirksamer Konfiguration zeigen U-Boot- und Kernel-Startprotokolle die ausgewerteten plane masks.

```text
Rockchip UBOOT DRM driver version: v1.0.1
VOP have 3 active VP
vp0 have layer nr:2[1 5 ], primary plane: 5
vp1 have layer nr:3[0 2 4 ], primary plane: 4
vp2 have layer nr:1[3 ], primary plane: 3
Using display timing dts
dsi@fe060000: detailed mode clock 132000 kHz, flags[8000000a]
  H: 1080 1095 1097 1127
  V: 1920 1935 1937 1952
bus_format: 100e
VOP update mode to: 1080x1920p0, type: MIPI0 for VP1
VOP VP1 enable Smart0[654x270->654x270@213x825] fmt[2] addr[0x7df04000]
final DSI-Link bandwidth: 876 Mbps x 4
disp info 0, type:11, id:0
xfer: num: 2, addr: 0x50
xfer: num: 2, addr: 0x50
```

```text
[2.314574] panel-simple-dsi fe060000.dsi.0: Specify missing connector_type
[2.315764] rockchip-vop2 : [drm:vop2_bind] vp0 assign plane mask: 0x22, primary plane phy id: 5
[2.315807] rockchip-vop2 : [drm:vop2_bind] vp1 assign plane mask: 0x15, primary plane phy id: 4
[2.315828] rockchip-vop2 : [drm:vop2_bind] vp2 assign plane mask: 0x8, primary plane phy id: 3
[2.316713] rockchip-drm display-subsystem: bound fe040000.vop (ops vop2_component_ops)
[2.317966] rockchip-drm display-subsystem: bound fe0c0000.edp (ops rockchip_dp_component_ops)
[2.318378] dwhdmi-rockchip : Detected HDMI TX controller v2.11a with HDCP (DWC HDMI 2.0 TX PHY)
[2.319625] dwhdmi-rockchip : registered DesignWare HDMI I2C bus driver
[2.321857] rockchip-drm display-subsystem: bound fe0a0000.hdmi (ops dw_hdmi_rockchip_ops)
[2.322069] rockchip-drm display-subsystem: bound fe060000.dsi (ops dw_mipi_dsi_rockchip_ops)
```

###### 3.2.4.2.1 Layer-Zuteilung für RK3566

RK3566 unterscheidet Haupt- und Spiegellayer. Cluster1 kann nur dieselbe Adresse wie Hauptlayer Cluster0 lesen; entsprechend sind Esmart1/Smart1 an die Adressen von Esmart0/Smart0 gebunden. Deshalb zuerst die Hauptlayer verwenden. Normalerweise setzt U-Boot plane-mask anhand des Schnittstellentyps. Ohne U-Boot-Logo gelten folgende DTS-Regeln:

1\. Für einen Bildschirm kann folgende Konfiguration verwendet werden:

```text
#include <dt-bindings/display/rockchip_vop.h> // Layer ID definition header file

&vpx { // x depends on the used vp id, such as vp0
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER0 | 1 << ROCKCHIP_VOP2_ESMART0 | 1 <<
ROCKCHIP_VOP2_SMART0 | 1 << ROCKCHIP_VOP2_CLUSTER1 | 1 << ROCKCHIP_VOP2_ESMART1 | 1 << ROCKCHIP_VOP2_SMART1)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART0>;
};
```

2\. Bei zwei Bildschirmen unterstützt RK3566 laut Quelle derzeit nur Android-Produkte und verlangt gleiche Bildwiederholraten. Der ständig angeschlossene Pfad ohne Hotplug verwendet Hauptlayer, der andere Spiegellayer:

```text
#include <dt-bindings/display/rockchip_vop.h> // Layer ID definition header file

&vpx { // x depends on the used vp id, such as vp0
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER0 | 1 << ROCKCHIP_VOP2_ESMART0 | 1 <<
ROCKCHIP_VOP2_SMART0)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART0>;
}; // Single-screen or non-hot-plugging main display device in dual-screen display uses the main layer
&vpx { // x depends on the used vp id, such as vp1
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER1 | 1 << ROCKCHIP_VOP2_ESMART1 | 1 <<
ROCKCHIP_VOP2_SMART1)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART1>;
};
```

##### 3.2.4.3 Einen Layer als Mauszeigerebene festlegen

Anwendungen mit Atomic-Anzeige-API müssen nicht zwischen primary, overlay und cursor unterscheiden. Sie können jeden verfügbaren Layer gemäß dessen unterstützten Formaten verwenden.

Unter Linux ohne Android verwenden manche Anwendungen noch die Legacy-API, die Layertypen berücksichtigt: primary für den Desktophintergrund, overlay für Videos und cursor für den Mauszeiger.

Der Rockchip-DRM-Treiber registriert standardmäßig nur primary und overlay, nicht cursor. Benötigt ein Linux-System einen Cursor-Layer, kann cursor-win-id unter dem entsprechenden VP-Knoten im DTS einen solchen für den zugehörigen CRTC festlegen.

```text
&vp0 {
  cursor-win-id = <ROCKCHIP_VOP2_CLUSTER0>;
};
```

Die Cluster-Layer von RK3566/RK3568 unterstützen ausschließlich AFBC. Unkomprimierte beziehungsweise nicht-AFBC-RGB-/YUV-Daten dürfen in keinem Szenario an Cluster gesendet werden. Wird unter Linux wie Buildroot oder Debian ein Cluster als Mauszeigerebene verwendet, ist die libdrm-cursor-Bibliothek des Linux-SDK nötig. Sie konvertiert das Datenformat entsprechend dem Layer. Einzelheiten siehe Rockchip_Developer_Guide_Debian_CN.pdf.

###### 3.2.4.3.1 Verbindungen zwischen Layern und VPs

Bei RK356X/RK3588/RK3562 kann jeder Layer mit jedem VP verbunden werden, ohne besondere Konfiguration. Bei RK3528/RK3576 gilt dies nicht. Als Cursor-Layer eines VP muss daher ein damit verbindbarer Layer gewählt werden. Die Zuordnungen:

1\. RK3528

| VP | Layer |
| --- | --- |
| VP0 | Cluster0, Esmart0, Esmart1, Esmart2 |
| VP1 | Esmart2, Esmart3 |

2\. RK3576

| VP | Layer |
| --- | --- |
| VP0 | Cluster0, Cluster1, Esmart0, Esmart2 |
| VP1 | Cluster0, Cluster1, Esmart1, Esmart3 |
| VP2 | Esmart0, Esmart1, Esmart2, Esmart3 |

##### 3.2.4.4 esmart-Layer aufteilen

Auf RK3528 und RK3576 teilen mehrere esmart-Layer einen Linebuffer. Seine produktabhängige Aufteilung ermöglicht unterschiedliche Layeranzahlen und Leistungen:

###### 3.2.4.4.1 esmart-Aufteilung auf RK3528

Auf RK3528 teilen esmart0/1/2/3 den Linebuffer. Standard ist VOP3_ESMART_4K_2K_2K_MODE: Neben dem festen Cluster werden esmart0[4k], esmart2[2k] und esmart3[2k] registriert. Produktabhängig lässt sich dies im DTS ändern. Für zwei 4k-fähige esmart-Layer beispielsweise:

```text
&vop {
  esmart_lb_mode = /bits/ 8 <1>;
};
```

Konfigurationsbeschreibung:

| esmart_lb_mode | Wert | Layeranzahl und Leistung |
| --- | --- | --- |
| VOP3_ESMART_4K_4K_MODE | 1 | Registriert cluster[4k], esmart0[4k], esmart2[4k] |
| VOP3_ESMART_4K_2K_2K_MODE | 2 | Registriert cluster[4k], esmart0[4k], esmart2[2k], esmart3[2k] |
| VOP3_ESMART_2K_2K_2K_2K_MODE | 3 | Registriert cluster[4k], esmart0[2k], esmart1[2k], esmart2[2k], esmart3[2k] |

###### 3.2.4.4.2 esmart-Aufteilung auf RK3576

Auf RK3576 sind Cluster0/1[4k] und esmart0/1[4k] fest konfiguriert. esmart2[2k] und esmart3[2k] teilen einen Linebuffer, standardmäßig als zwei 2k-Layer. Für einen 4k-Layer folgende Konfiguration verwenden:

```text
&vop {
  esmart_lb_mode = /bits/ 8 <4>;
};
```

Konfigurationsbeschreibung:

| esmart_lb_mode | Wert | Layeranzahl und Leistung |
| --- | --- | --- |
| VOP3_ESMART_4K_4K_4K_MODE | 4 | Registriert cluster0[4k], cluster1[4k], esmart0[4k], esmart1[4k], esmart2[4k] |
| VOP3_ESMART_4K_4K_2K_2K_MODE | 5 | Registriert cluster0[4k], cluster1[4k], esmart0[4k], esmart1[4k], esmart2[2k],<br>esmart3[2k] |

##### 3.2.4.5 Layer-Migration verhindern

RK3568 und RK3588 unterstützen keine freie Layer-Migration zwischen VPs/CRTCs während des Betriebs. Unter den meisten Linux-Systemen ohne Android sollen Layer deshalb exklusiv einem festen CRTC gehören. Dafür muss disable-win-move unter dem vop-Knoten im DTS vorhanden sein.

```text
&vop {
     disable-win-move;
}
```

Nach dem Start mit modetest die Eigenschaft possible crtcs jedes Layers prüfen. Genau ein Bit darf gesetzt sein; andernfalls entspricht die Konfiguration nicht der Vorgabe.

#### 3.2.5 Farbraumkonfiguration

Linux 6.1 ergänzt im DRM-Framework standardisierte Farbraumdefinitionen. Der ältere DRM-Treiber nutzte die weniger passende und schwer verständliche V4L2-Definition. Ab Linux 6.1 verwendet Plane deshalb die DRM-Standarddefinition. Nachfolgend die Farbraumkonfiguration verschiedener Rockchip-Kernelversionen:

##### 3.2.5.1 Farbraum einer Plane konfigurieren

1\. Kernelversionen vor Linux 6.1

Private RK-Eigenschaft verwenden: COLOR_SPACE

| Konfigurationswert | Farbraum | Beschreibung |
| --- | --- | --- |
| V4L2_COLORSPACE_SMPTE170M / V4L2_COLORSPACE_470_SYSTEM_M /<br>V4L2_COLORSPACE_470_SYSTEM_BG | BT.601L | V4L2-Definition |
| V4L2_COLORSPACE_REC709 / V4L2_COLORSPACE_SMPTE240M /<br>V4L2_COLORSPACE_DEFAULT | BT.709L | V4L2-Definition |
| V4L2_COLORSPACE_JPEG | BT.601F | V4L2-Definition |
| V4L2_COLORSPACE_BT2020 | BT.2020L | V4L2-Definition |
| V4L2_COLORSPACE_BT709F | BT.709F | Private RK-Definition |
| V4L2_COLORSPACE_BT2020F | BT.2020F | Private RK-Definition |

2\. Linux 6.1 und neuere Kernelversionen

Die beiden DRM-Eigenschaften COLOR_ENCODING und COLOR_RANGE verwenden.

COLOR_ENCODING

| Konfigurationswert | Farbraum | Beschreibung |
| --- | --- | --- |
| DRM_COLOR_YCBCR_BT601 | BT.601 | DRM-Definition |
| DRM_COLOR_YCBCR_BT709 | BT.709 | DRM-Definition |
| DRM_COLOR_YCBCR_BT2020 | BT.2020 | DRM-Definition |

COLOR_RANGE

| Konfigurationswert | Bereich | Beschreibung |
| --- | --- | --- |
| DRM_COLOR_YCBCR_FULL_RANGE | Full (voll) | DRM-Definition |
| DRM_COLOR_YCBCR_LIMITED_RANGE | Limit (begrenzt) | DRM-Definition |

##### 3.2.5.2 Farbraum eines Connectors konfigurieren

1\. Kernelversionen vor Linux 5.10

Der Farbraum verwendet die private RK-Eigenschaft hdmi_output_colorimetry.

| Eigenschaftswert | Farbraum | Beschreibung |
| --- | --- | --- |
| HDMI_COLORIMETRY_NONE | Default (Standard) | Private RK-Definition |
| RK_HDMI_COLORIMETRY_BT2020 | BT.2020 | Private RK-Definition |

Der Wertebereich verwendet die private RK-Definition hdmi_quant_range.

| Konfigurationswert | Bereich | Beschreibung |
| --- | --- | --- |
| HDMI_QUANTIZATION_RANGE_DEFAULT | Default (Standard) | Private RK-Definition |
| HDMI_QUANTIZATION_RANGE_LIMITED | Limit (begrenzt) | Private RK-Definition |
| HDMI_QUANTIZATION_RANGE_FULL | Full (voll) | Private RK-Definition |

2\. Kernelversion Linux 5.10

Der Farbraum verwendet die DRM-Standardeigenschaft Colorspace.

| Konfigurationswert | Farbraum | Beschreibung |
| --- | --- | --- |
| Default = 0 | Default (Standard) | DRM-Definition |
| DRM_MODE_COLORIMETRY_SMPTE_170M_YCC | SMPTE_170M_YCC | DRM-Definition |
| DRM_MODE_COLORIMETRY_BT709_YCC | BT709_YCC | DRM-Definition |
| DRM_MODE_COLORIMETRY_XVYCC_601 | XVYCC_601 | DRM-Definition |
| DRM_MODE_COLORIMETRY_XVYCC_709 | XVYCC_709 | DRM-Definition |
| DRM_MODE_COLORIMETRY_SYCC_601 | SYCC_601 | DRM-Definition |
| DRM_MODE_COLORIMETRY_OPYCC_601 | opYCC_601 | DRM-Definition |
| DRM_MODE_COLORIMETRY_OPRGB | opRGB | DRM-Definition |
| DRM_MODE_COLORIMETRY_BT2020_CYCC | BT2020_CYCC | DRM-Definition |
| DRM_MODE_COLORIMETRY_BT2020_RGB | BT2020_RGB | DRM-Definition |
| DRM_MODE_COLORIMETRY_BT2020_YCC | BT2020_YCC | DRM-Definition |
| DRM_MODE_COLORIMETRY_DCI_P3_RGB_D65 | P3_RGB_D65 | DRM-Definition |
| DRM_MODE_COLORIMETRY_DCI_P3_RGB_THEATER | P3_RGB_Theater | DRM-Definition |

Der DRM-HDMI-Treiber unterscheidet laut Quelle derzeit nur mehrere BT2020-Farbräume. Gibt die Anwendung nicht BT2020 vor, bestimmt der Treiber den HDMI-Ausgabefarbraum anhand der Auflösung.

Der Wertebereich verwendet die private RK-Definition hdmi_quant_range.

| Konfigurationswert | Bereich | Beschreibung |
| --- | --- | --- |
| HDMI_QUANTIZATION_RANGE_DEFAULT | Default (Standard) | Private RK-Definition |
| HDMI_QUANTIZATION_RANGE_LIMITED | Limit (begrenzt) | Private RK-Definition |
| HDMI_QUANTIZATION_RANGE_FULL | Full (voll) | Private RK-Definition |

3\. Kernelversion Linux 6.1

Der Farbraum entspricht Linux 5.10 und verwendet die DRM-Standardeigenschaft Colorspace.

Der Bereich bleibt eine private RK-Eigenschaft. Der Name ändert sich von "hdmi_quant_range" zu "quant_range", hauptsächlich zur gemeinsamen Verwendung mit DP:

| Konfigurationswert | Bereich | Beschreibung |
| --- | --- | --- |
| HDMI_QUANTIZATION_RANGE_DEFAULT | Default (Standard) | Private RK-Definition |
| HDMI_QUANTIZATION_RANGE_LIMITED | Limit (begrenzt) | Private RK-Definition |
| HDMI_QUANTIZATION_RANGE_FULL | Full (voll) | Private RK-Definition |

##### 3.2.5.3 Weitere Hinweise

1\. DP wird weitgehend wie HDMI konfiguriert. Manche Funktionen können laut Quelle noch fehlen und sollen später ergänzt werden.

2\. Die Kernelversion lässt sich mit der libdrm-Standardschnittstelle drmGetVersion() unterscheiden.

| Kernelversion | Versionsnummer |
| --- | --- |
| Linux 4.4 | 1.0 |
| Linux 4.19 | 2.0 |
| Linux 5.10 | 3.0 |
| Linux 6.1 | 4.0 |

3\. Die Plane-Eigenschaften des DRM-Frameworks berücksichtigen bislang nur YUV, nicht den RGB-Farbraum. Deshalb wird vorläufig auch für RGB die YUV-Farbraumdefinition verwendet:

Für übliche UI-Daten (SRGB + Full Range) gelten COLOR_ENCODING = DRM_COLOR_YCBCR_BT709 und COLOR_RANGE = DRM_COLOR_YCBCR_FULL_RANGE.

## 4. Anzeigefunktionen

### 4.1 Grundlegende VOP-Funktionen der Plattformen

| SOC | VOP-Version | 8K | 4K | MMU | i-MODE | A/IFBDC | MULTIAREA | BCSH | gamma | 3D-LUT | POST-SCALE | X-mirror |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RK3066/PX2 | V1.0 | × | × | × | × | × | × | × | √ | × | × | × |
| RK3188/PX3 | V1.0 | × | × | × | × | × | × | × | √ | × | × | × |
| RK3126/RK3126C | V1.0 | × | × | √ | × | × | × | √ | √ | × | × | × |
| RK3128/PX3SE | V1.0 | × | × | √ | √ | × | × | √ | √ | × | × | × |
| RK3036 | V1.0 | × | × | √ | √ | × | × | √ | √ | × | × | × |
| RK322X/RK312XH | V1.0 | × | √ | √ | √ | × | × | √ | × | × | √ | × |
| RK322XH/RK332X | V1.0 | × | √ | √ | √ | × | × | √ | × | × | √ | × |
| SOFIA 3GR | V1.0 | × | × | √ | × | × | × | √ | √ | × | × | × |
| RV1108 | V1.0 | × | × | × | √ | × | × | √ | √ | × | × | × |
| RK3288 | V1.0 | × | √ | √ | × | × | √ | √ | √ | × | √ | × |
| RK3368/PX5 | V1.0 | × | √ | √ | × | √ | √ | √ | √ | × | √ | × |
| RK3399 | V1.0 | × | √ | √ | √ | √ | √ | √ | √ | × | √ | × |
| RK3326/PX30 | V1.0 | × | × | √ | √ | √ | √ | √ | √ | × | × | × |
| RK3308 | V1.0 | × | × | × | × | × | × | √ | √ | × | × | × |
| RK1808 | V1.0 | × | × | √ | × | × | × | √ | √ | × | × | × |
| RV1109/RV1126 | V1.0 | × | × | √ | × | × | × | √ | √ | × | × | × |
| RV1103/RV1106 | V1.0 | × | × | × | √ | × | × | √ | √ | × | × | × |
| RK356X | V2.0 | × | √ | √ | √ | √ | √ | √ | √ | √ | √ | √ |
| RK3588 | V2.0 | √ | √ | √ | √ | √ | √ | √ | √ | √ | × | √ |
| RK3528 | V3.0 | × | √ | √ | √ | √ | √ | √ | √ | √ | √ | √ |
| RK3562 | V3.0 | × | × | √ | √ | × | √ | √ | √ | √ | √ | √ |
| RK3576 | V3.0 | × | √ | √ | √ | √ | √ | √ | √ | √ | √ | √ |
| RK3506 | V1.0 | × | × | × | √ | × | × | √ | √ | × | × | × |
| RV1126B | V1.0 | × | × | √ | √ | × | × | √ | √ | × | × | × |

### 4.2 Maximale Ausgabeauflösungen und Schnittstellenstandards je Plattform

| Plattform | Anzeigeschnittstelle | Maximale Ausgabeauflösung | Protokollstandard |
| --- | --- | --- | --- |
| RK3036 | HDMI | 1920x1080@60hz | Unterstützt HDMI 1.4a Protokollstandard |
| RK3036 | CVBS | 720x480i@60hz/720x576i@50hz | Unterstützt NTSC/PAL Standardausgabe |
| RK312X/PX3SE | RGB | 1280x800@60hz | Unterstützt RGB666/sRGB888 |
| RK312X/PX3SE | LVDS | 1280x800@60hz | Unterstützt VESA und JEIDA LVDS Datenformate |
| RK312X/PX3SE | MIPI | 1920x1080@60hz | Unterstützt DSI v1.0, DCS v1.0, DPHY v1.0 Protokollstandards |
| RK312X/PX3SE | HDMI | 1920x1080@60hz | Unterstützt HDMI 1.4a Protokollstandard |
| RK312X/PX3SE | CVBS | 720x480i@60hz/720x576i@50hz | Unterstützt NTSC/PAL Standardausgabe |
| RK322X/RK312XH | HDMI | 4096x2160@60hz | Unterstützt HDMI 1.4a Protokollstandard |
| RK322X/RK312XH | CVBS | 720x480i@60hz/720x576i@50hz | Unterstützt NTSC/PAL Standardausgabe |
| RK3288 | RGB | 1920x1080@60hz | Unterstützt GB888/RGB666/sRGB888 |
| RK3288 | LVDS | Einzelkanal 1280x800@60hz<br>Zweikanal:1920x1080@60hz | Unterstützt VESA und JEIDA LVDS Datenformate |
| RK3288 | eDP | 2560x1600@60hz | Unterstützt DP1.2a und eDP1.3 Protokollstandards |
| RK3288 | MIPI | Einzelkanal1920x1080@60hz<br>Zweikanal:2560x1600@60hz | Unterstützt DSI v1.1, DCS v1.1, DPHY v1.1 Protokollstandards |
| RK3288 | HDMI | VOP BIG: 3840x2160@60hz<br>VOP LIT: 1920x1080@60hz | Unterstützt HDMI 1.4a und 2.0 Protokollstandards |
| RK3308 | RGB | 1280x800@60hz | Unterstützt RGB888/RGB666/sRGB888/MCU |
| RK1808 | RGB | 1280x800@60hz | Unterstützt RGB888/RGB666/sRGB888/MCU |
| RK1808 | MIPI | 1280X800@60hz | Unterstützt DSI v1.0, DCS v1.0, DPHY v1.0 Protokollstandards |
| RK322XH/RK332X | HDMI | 3840x2160@60hz | Unterstützt HDMI 1.4a und 2.0 Protokollstandards |
| RK322XH/RK332X | CVBS | 720x480i@60hz/720x576i@50hz | Unterstützt NTSC/PAL Standardausgabe |
| RK3326/px30 | RGB | 1280x800@60hz | Unterstützt RGB888/RGB666/sRGB888/MCU |
| RK3326/px30 | LVDS | 1280x800@60hz | Unterstützt VESA und JEIDA LVDS Datenformate |
| RK3326/px30 | MIPI | 1920x1080@60hz | Unterstützt DSI v1.0, DCS v1.0, DPHY v1.0 Protokollstandards |
| RK3368/PX5 | RGB | 1280x800@60hz | Unterstützt RGB888/RGB666/sRGB888/MCU |
| RK3368/PX5 | LVDS | 1280x800@60hz | Unterstützt VESA und JEIDA LVDS Datenformate |
| RK3368/PX5 | MIPI | 1920x1080@60hz | Unterstützt DSI v1.0, DCS v1.0, DPHY v1.0 Protokollstandards |
| RK3368/PX5 | eDP | 2560x1600@60hz | Unterstützt DP1.2a und eDP1.3 Protokollstandards |
| RK3368/PX5 | HDMI | 4096x2160@60hz | Unterstützt HDMI 1.4a und 2.0 Protokollstandards |
| RK3399 | MIPI | Einzelkanal:1280x800@60hz<br>Zweikanal:2560x1600@60hz | Unterstützt DSI v1.1, DCS v1.1, DPHY v1.1 Protokollstandards |
| RK3399 | eDP | 2560x1600@60hz | Unterstützt DP1.2a und eDP1.3 Protokollstandards |
| RK3399 | HDMI | VOP BIG: 4096x2160@60hz<br>VOP LIT: 2560x1600@60hz | Unterstützt HDMI 1.4a und 2.0a Protokollstandards |
| RK3399 | DP | VOP BIG: 3840x2160@60hz<br>VOP LIT: 2560x1600@60hz | Unterstützt DP 1.2 Protokollstandard |
| RV1109/RV1126 | RGB | 1920x1080@60hz | Unterstützt RGB888/RGB666/sRGB888/MCU/BT.1120 |
| RV1109/RV1126 | MIPI | 1920x1080@60hz | Unterstützt DSI v1.1, DCS v1.1, DPHY v1.2 Protokollstandards |
| RK356X | RGB | 1920x1080@60hz | Unterstützt RGB888/RGB666/BT.656/BT.1120 |
| RK356X | MIPI | Einzelkanal:1920x1080@60hz<br>Zweikanal:2560x1600@60hz | Unterstützt DSI v1.1, DCS v1.1, DPHY v1.1 Protokollstandards |
| RK356X | eDP | 2560x1600@60hz | Unterstützt DP 1.2a und eDP 1.3 Protokollstandards |
| RK356X | HDMI | 4096x2160@60hz | Unterstützt HDMI 1.4a und 2.0a Protokollstandards |
| RK3588 | RGB | 1920x1080@60hz | Unterstützt BT.656/BT.1120 |
| RK3588 | MIPI | 3840x2160@60hz | Zwei MIPI, unterstützt DSI v1.1, DCS v1.1, DPHY v2.0, CPHY<br>V1.1 Protokollstandards |
| RK3588 | eDP0 | 3840x2160@60hz | Zwei eDP, unterstützt DP1.2a und eDP1.3 Protokollstandards |
| RK3588 | HDMI | 7680x4320@60hz | Zwei HDMI, unterstützt HDMI 2.1 Protokollstandard |
| RK3588 | DP | 7680x4320@30hz | Zwei DP, unterstützt DP1.4 Protokollstandard |
| RV1103/RV1106 | RGB | 1280x720@60hz | Unterstützt<br>RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3528 | HDMI | 4096x2160@60hz | Unterstützt HDMI 2.0 Protokollstandard |
| RK3528 | CVBS | 720x480i@60hz/720x576i@50hz | Unterstützt NTSC/PAL Standardausgabe |
| RK3562 | RGB | 1920x1080@60hz | Unterstützt<br>RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3562 | MIPI | 2048x1080@60hz | Unterstützt DSI v1.1, DCS v1.1, DPHY v1.2 Protokollstandards |
| RK3562 | LVDS | 1280x800@60hz | Unterstützt VESA und JEIDA LVDS Datenformate |
| RK3576 | HDMI | 4096x2160@120hz | Unterstützt HDMI 2.1 Protokollstandard |
| RK3576 | DP | 4096x2160@120hz | Unterstützt DP1.4 Protokollstandard |
| RK3576 | MIPI | 2560x1600@60hz | Unterstützt DSI v1.1, DCS v1.4, DPHY v2.0 Protokollstandards |
| RK3576 | eDP | 4096x2160@60hz | Unterstützt DP1.2 und eDP1.3 Protokollstandards |
| RK3576 | RGB | 1920x1080@60hz | Unterstützt<br>RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3506 | RGB | 1280x720@60hz | Unterstützt<br>RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3506 | MIPI | 1280x720@60hz | Unterstützt DSI v1.1, DCS v1.1, DPHY v1.2 Protokollstandards |
| RV1126B | RGB | 1920x1080@60hz | Unterstützt<br>RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RV1126B | MIPI | 1920x1080@60hz | Unterstützt DSI v1.1, DCS v1.1, DPHY v1.2 Protokollstandards |

Hinweis:

1. Auf RK3576/RK3588 teilen eDP und HDMI Combo-PHYs. Wird HDMI0 verwendet, ist eDP0 auf demselben Produkt nicht verfügbar; ebenso schließen sich HDMI1 und eDP1 aus.

### 4.3 Anzeigepfade auf VOP2-Plattformen

#### 4.3.1 Verbindungen zwischen RK3528-VPs und Anzeigeschnittstellen

![Originalabbildung: 4.3.1 Verbindungen zwischen RK3528-VPs und Anzeigeschnittstellen; PDF S. 36](/docs/rockchip-drm-display-driver/assets/en-p36-X280.png)

VP0 verwendet als 4K-Auflösung 4096x2304, VP1 als 576i-Auflösung 720x576. Einzelheiten stehen in den Kapiteln Display Interface und Video Output Processor des Rockchip RK3528 datasheet.

#### 4.3.2 Verbindungen zwischen RK3562-VP und Anzeigeschnittstellen

![Originalabbildung: 4.3.2 Verbindungen zwischen RK3562-VP und Anzeigeschnittstellen; PDF S. 37](/docs/rockchip-drm-display-driver/assets/en-p37-X285.png)

Die 2K-Auflösung von VP0 ist 2048x1080. Weitere Angaben stehen in Display Interface und Video Output Processor des Rockchip RK3562 datasheet.

#### 4.3.3 Verbindungen zwischen RK3568-VPs und Anzeigeschnittstellen

![Originalabbildung: 4.3.3 Verbindungen zwischen RK3568-VPs und Anzeigeschnittstellen; PDF S. 37](/docs/rockchip-drm-display-driver/assets/en-p37-X236.png)

Einzelheiten stehen in Display Interface und Video Output Processor des Rockchip RK3568 datasheet.

#### 4.3.4 Verbindungen zwischen RK3576-VPs und Anzeigeschnittstellen

![Originalabbildung: 4.3.4 Verbindungen zwischen RK3576-VPs und Anzeigeschnittstellen; PDF S. 38](/docs/rockchip-drm-display-driver/assets/en-p38-X290.png)

Die als 2K bezeichnete Auflösung von VP1 beträgt hier 2560x1600. Einzelheiten stehen in Display Interface und Video Output Processor des Rockchip RK3576 datasheet.

#### 4.3.5 Verbindungen zwischen RK3588-VPs und Anzeigeschnittstellen

![Originalabbildung: 4.3.5 Verbindungen zwischen RK3588-VPs und Anzeigeschnittstellen; PDF S. 38](/docs/rockchip-drm-display-driver/assets/en-p38-X291.png)

HDMI und DP des RK3588 unterstützen 8K. Im 8K-Modus belegt eine Schnittstelle jedoch VP0 und VP1 gleichzeitig. Für 8K-Produkte deshalb keine andere Schnittstelle mit VP1 verbinden. Einzelheiten stehen in Display Interface und Video Output Processor des Rockchip RK3588 datasheet.

Siehe Rockchip RK3588 datasheet, Display Interface und Video Output Processor.

### 4.4 Anzeigespezifikationen abgeleiteter Chips

#### 4.4.1 RK3566

Im Unterschied zu RK3568 unterstützt RK3566 nur zwei Bildschirme mit gleichem Inhalt. Dafür gelten:

Beide Bildschirme müssen dieselbe Bildwiederholrate verwenden.

Beide Bildschirme müssen gleich ausgerichtet sein: beide im Hoch- oder beide im Querformat.

Für den Zweischirmbetrieb siehe den Abschnitt zur RK3566-Layer-Zuteilung.

#### 4.4.2 RK3576s

Im Unterschied zu RK3576 besitzt RK3576s nur Video Port0; RGB/BT.1120/BT.656/MCU-Anzeigeschnittstellen sind nicht verfügbar.

#### 4.4.3 RK3588s

Im Unterschied zu RK3588 fehlen RK3588s die Schnittstellen HDMI1, DP1 und eDP1.

### 4.5 DCLK-Taktzuteilung auf VOP-Plattformen

#### 4.5.1 DCLK-Zuteilung für RK3399 VOP

RK3399 hat zwei VOPs: VOPB[VOP0] und VOPL[VOP1]. Beide können VPLL/CPLL verwenden, wobei VPLL für die Anzeige vorgesehen ist. Im HDMI-Pfad muss VOP-DCLK aus VPLL abgeleitet und im DTS korrekt angegeben werden. Bei falscher Konfiguration schaltet der Treiber den HDMI-Pfad auf VPLL und führt einen Auflösungswechsel aus, sichtbar als Aus- und Wiedereinschalten. DTS-Beispiel:

```text
&hdmi_in_vopl {
  status = "disabled";
};

&hdmi_in_vopb {
  status = "okay";
};
&route_hdmi {
  connect = <&vopb_out_hdmi>;
};

&vopb {
  status = "okay";
  assigned-clocks = <&cru DCLK_VOP0_DIV>;
  /* The dclk parent for VOP->HDMI must from VPLL */
  assigned-clock-parents = <&cru PLL_VPLL>;
};
&vopl {
  status = "okay";
  assigned-clocks = <&cru DCLK_VOP1_DIV>;
  assigned-clock-parents = <&cru PLL_CPLL>;
};
```

#### 4.5.2 DCLK-Zuteilung für RK3528 VOP

##### 4.5.2.1 Überblick über RK3528-DCLK

RK3528 hat 2 Video Ports. Ihr dclk-Taktbaum:

![Originalabbildung: 4.5.2.1 Überblick über RK3528-DCLK; PDF S. 40](/docs/rockchip-drm-display-driver/assets/en-p40-X305.png)

Für DCLK von Video Port0 kann hdmi_phy_pll oder dclk_vp0_src als Elterntakt gewählt werden. dclk_vp0_src kann seinerseits CPLL oder GPLL verwenden.

Für DCLK von Video Port1 kann CPLL oder GPLL als Elterntakt gewählt werden.

Eigenschaften von hdmi_phy_pll:

Unterstützt beliebige Frequenzteilung.

Eigenschaften von CPLL und GPLL:

Die PLL wird mit anderen IP-Modulen geteilt.

Keine beliebige Frequenzteilung; laut Originalwortlaut ist die Ausgangsfrequenz ein ganzzahliges Vielfaches der PLL-Frequenz. Diese fragliche Formulierung ist in den Prüfnotizen vermerkt.

HDMI verwendet standardmäßig hdmi_phy_pll als DCLK-Elterntakt und erfüllt damit unterschiedliche Frequenzanforderungen. CVBS hat nur wenige feste Auflösungen und benötigt entsprechend wenige DCLK-Frequenzen; CPLL oder GPLL reichen dafür aus.

#### 4.5.3 DCLK-Zuteilung für RK3562 VOP

##### 4.5.3.1 Überblick über RK3562-DCLK

RK3562 hat nur 1 Video Port. Sein dclk-Taktbaum:

![Originalabbildung: 4.5.3.1 Überblick über RK3562-DCLK; PDF S. 41](/docs/rockchip-drm-display-driver/assets/en-p41-X310.png)

Als Elterntakt kann VPLL, GPLL oder APLL verwendet werden. HPLL ist laut Quelle exklusiv für Audio vorgesehen und steht VOP nicht zur Verfügung.

Eigenschaften von VPLL:

Kann exklusiv VOP zugewiesen werden.

Unterstützt beliebige Ausgangsfrequenzen.

VPLL ist der standardmäßige Elterntakt von VP0.

Eigenschaften von GPLL und APLL:

Die PLL wird mit anderen IP-Modulen geteilt.

Keine beliebige Frequenzteilung; laut Originalwortlaut ist die Ausgangsfrequenz ein ganzzahliges Vielfaches der PLL-Frequenz. Diese fragliche Formulierung ist in den Prüfnotizen vermerkt.

VPLL als standardmäßiger Elterntakt von VP0 erfüllt die verschiedenen Frequenzanforderungen.

#### 4.5.4 DCLK-Zuteilung für RK3568 VOP

##### 4.5.4.1 Überblick über RK3568-DCLK

RK3568 hat 3 Video Ports. Ihre dclk-Taktbäume:

![Originalabbildung: 4.5.4.1 Überblick über RK3568-DCLK; PDF S. 41](/docs/rockchip-drm-display-driver/assets/en-p41-X311.png)

Alle Video Ports können VPLL, GPLL, CPLL oder HPLL als DCLK-Elterntakt verwenden.

Eigenschaften von VPLL und HPLL:

Kann exklusiv VOP zugewiesen werden.

Unterstützt beliebige Ausgangsfrequenzen.

Im DTS ist HPLL standardmäßig VP0 und VPLL VP1 zugewiesen:

```text
assigned-clocks = <&cru DCLK_VOP0>, <&cru DCLK_VOP1>, <&cru DCLK_VOP2>;
assigned-clock-parents = <&pmucru PLL_HPLL>, <&cru PLL_VPLL>, <&cru PLL_GPLL>;
```

Eigenschaften von GPLL und CPLL:

Die PLL wird mit anderen IP-Modulen geteilt.

Keine beliebige Frequenzteilung; laut Originalwortlaut ist die Ausgangsfrequenz ein ganzzahliges Vielfaches der PLL-Frequenz. Diese fragliche Formulierung ist in den Prüfnotizen vermerkt.

#### 4.5.5 DCLK-Zuteilung für RK3576 VOP

##### 4.5.5.1 Überblick über RK3576-DCLK

RK3576 hat 3 Video Ports. Ihre dclk-Taktbäume:

![Originalabbildung: 4.5.5.1 Überblick über RK3576-DCLK; PDF S. 42](/docs/rockchip-drm-display-driver/assets/en-p42-X318.png)

Alle Video Ports können hdmi_phy_pll oder dclk_vpx_src0/1/2 als DCLK-Elterntakt verwenden. dclk_vpx_src0/1/2 kann seinerseits VPLL, CPLL, GPLL, BPLL oder LPLL verwenden.

VPLL, CPLL, GPLL, BPLL und LPLL liegen in der System-CRU, hdmi_phy_pll dagegen im HDMI-PHY.

Eigenschaften von VPLL:

Diese PLL kann exklusiv VOP zugewiesen werden.

Unterstützt beliebige Ausgangsfrequenzen.

Im DTS wird sie standardmäßig VP2 zugewiesen:

```text
&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_VPLL>;
};
```

Eigenschaften von CPLL, GPLL, BPLL und LPLL:

Die PLL wird mit anderen IP-Modulen geteilt.

Keine beliebige Frequenzteilung; laut Originalwortlaut ist die Ausgangsfrequenz ein ganzzahliges Vielfaches der PLL-Frequenz. Diese fragliche Formulierung ist in den Prüfnotizen vermerkt.

dclk_vp0/1/ ist standardmäßig an GPLL gebunden; die Quellschreibweise bleibt erhalten.

BPLL und LPLL werden seltener verwendet. BPLL dient standardmäßig der CPU. Soll VOP sie verwenden, muss die CPU-PLL auf PVTPLL wechseln. Die BPLL-Teilung erlaubt außerdem nur die Faktoren 2, 3, 4, 6 oder 8.

Die standardmäßigen Elterntaktbindungen der Video Ports:

![Originalabbildung: 4.5.5.1 Überblick über RK3576-DCLK; PDF S. 43](/docs/rockchip-drm-display-driver/assets/en-p43-X323.png)

Eigenschaften von hdmi_phy_pll:

1. Unterstützt beliebige Frequenzteilung.

2. Ohne aktives HDMI verwendet VOP die PLL exklusiv; bei aktivem HDMI teilt VOP sie mit dem HDMI-PHY.

3. HDMI und EDP teilen den PHY. Bei aktivem EDP steht dessen PLL VOP nicht zur Verfügung.

Die zweite und dritte Eigenschaft schränken die Verwendung ein. Beispiele:

1\. Bei aktivem HDMI an Video Port0 gelten folgende Möglichkeiten für hdmi_phy_pll; bei Video Port1/2 entsprechend:

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy_pll | DCLK &lt;= 600MHz verfügbar; DCLK &gt; 600MHz nicht verfügbar | nicht verfügbar | nicht verfügbar |

2\. Bei aktivem EDP an Video Port0 gelten folgende Möglichkeiten für hdmi_phy_pll; bei Video Port1/2 entsprechend:

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy_pll | nicht verfügbar | nicht verfügbar | nicht verfügbar |

CPLL, GPLL, BPLL und LPLL erlauben als VP-DCLK-Quelle keine beliebige Teilung. Für genaue Frequenzen kann unter den genannten Einschränkungen hdmi_phy_pll verwendet werden. Dafür gibt es drei Strategien:

1. Statische Zuteilung: hdmi_phy_pll wird fest an einen Video Port gebunden und von diesem dauerhaft als DCLK-Quelle verwendet.

2. Dynamische Zuteilung mit Bindung an HDMI: hdmi_phy_pll steht nur dem VP mit HDMI zur Verfügung. Dieser kann dynamisch zwischen CRU-PLL und hdmi_phy_pll wechseln.

3. Dynamische Zuteilung: hdmi_phy_pll steht allen geeigneten VPs und Schnittstellen offen. Diese komplexeste Strategie verlangt, Konflikte beim Aktivieren von Schnittstellen und VPs zu berücksichtigen. Laut Quelle ist sie derzeit nur für NVR-Produkte vorgesehen.

Für die DCLK-Zuteilung gewöhnlicher Produkte reichen die ersten beiden Strategien.

##### 4.5.5.2 Statische DCLK-Zuteilung für RK3576 VOP

Die statische Strategie hat folgende Grenzen:

1\. Normalerweise kann eine hdmi_phy_pll nur einem Video Port aus VP0/VP1/VP2 zugewiesen werden.

2\. Bei aktivem HDMI darf dessen hdmi_phy_pll nur dem zugehörigen Video Port zugewiesen werden

oder gar nicht als DCLK-Quelle dienen.

3\. Bei aktivem HDMI und Zuweisung seiner hdmi_phy_pll an den zugehörigen Video Port darf der Pixeltakt der Ausgabeauflösung 600MHz nicht überschreiten.

4\. Ist EDP am gemeinsamen PHY aktiv, darf hdmi_phy_pll nicht als VP-DCLK-Quelle verwendet werden.

Statische Zuteilung bindet den VP-DCLK-Elterntakt im DTSI. Nach dieser Konfiguration bleibt die Bindung unverändert.

```text
&hdptxphy_hdmi {
  status = "okay";
};

&vp0 {
  assigned-clocks = <&cru DCLK_VP0>;
  assigned-clock-parents = <&hdptxphy_hdmi>;
};
```

Hier ist dclk_vp0 fest an hdmi_phy_pll gebunden.

Die Wirksamkeit lässt sich im Taktbaum prüfen:

```text
rk3588_s:/ # cat /sys/kernel/debug/clk/clk_summary | grep "hdmiphy" -A 4
    clk_hdmiphy_pixel0 1   2    0     132000000 0   0  50000  ?
 27da0000.hdmi      link_clk

 display-subsystem  hdmi0_phy_pll

 hdmi@27da0000      no_connection_id
 deviceless         no_connection_id
      dclk_vp0        1    3    0     132000000 0   0  50000  Y
   27d00000.vop       dclk_vp0
```

Die Elterntaktbindung ist wirksam; dclk_vp0 ist auf 132MHz gesetzt. Das stimmt mit dem Protokoll überein.

In der letzten Protokollzeile bedeutet set dclk_vp0 to 132000000, get 132000000: 132MHz angefordert und tatsächlich ausgegeben, passend zum Taktbaum.

```text
[  5.598827][ T331] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 1080x1920p60, type: 16(if:MIPI0, flag:0x0) for vp0 dclk: 132000000
[  5.599012][ T331] rockchip-hdptx-phy-hdmi 2b000000.hdmiphy: hdptx_ropll_cmn_config bus_width:0 rate:742500
[  5.599185][ T331] rockchip-hdptx-phy-hdmi 2b000000.hdmiphy: hdptx phy pll locked!
[  5.599237][ T331] rockchip-hdptx-phy-hdmi 2b000000.hdmiphy: hdptx_ropll_cmn_config bus_width:0 rate:1320000
[  5.599415][ T331] rockchip-hdptx-phy-hdmi 2b000000.hdmiphy: hdptx phy pll locked!
[  5.599423][ T331] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vp0 to 132000000, get 132000000
```

##### 4.5.5.3 Dynamische DCLK-Zuteilung für RK3576 mit HDMI-Bindung

hdmi_phy_pll wird nur dem Video Port mit HDMI zugewiesen. Dieser schaltet seine DCLK-Quelle abhängig vom HDMI-Betriebsmodus dynamisch zwischen CRU-PLL und hdmi_phy_pll um. Konfiguration:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi>;
  clock-names = "hdmi0_phy_pll";
};
```

Bei HDMI0 an VP0 wird die DCLK-Quelle abhängig vom Pixeltakt gewählt:

|  | Pixeltakt &gt; 600MHz | Pixeltakt &lt; 600MHz |
| --- | --- | --- |
| VP0--&gt;HDMI0 | CRU PLL | hdmi0 phy pll |

##### 4.5.5.4 Dynamische DCLK-Zuteilung für RK3576 VOP

Für die dynamische Bindung ist folgende DTSI-Konfiguration nötig:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi>;
  clock-names = "hdmi0_phy_pll";
};
&vop {
  rockchip,extend-phy-pll-shared-mode;
};
```

Gegenüber der zweiten Strategie kommt lediglich rockchip,extend-phy-pll-shared-mode unter dem vop-Knoten hinzu.

Nur wenige PLL-Quellen erlauben beliebige Teilung, und die HDMI-PHY-PLL unterliegt Einschränkungen. Deshalb ist die dynamische Strategie komplex und begrenzt die möglichen Anwendungsszenarien.

Bei jedem Aktivieren eines Video Ports wird DCLK nach folgenden Regeln gebunden:

1\. HDMI, eventuell zusammen mit DP oder MIPI am selben Video Port0/1/2, verwendet den nachfolgend VP_A genannten Port mit DCLK unter 600MHz:

Ist hdmi_phy_pll konfiguriert und von keinem anderen VP belegt, verwendet VP_A hdmi_phy0_pll.

Ist hdmi_phy_pll konfiguriert, aber bereits von einem anderen VP belegt, wird ein Fehler gemeldet.

2\. Wenn nur DP an einem Video Port0/1/2 hängt:

Bei Video Port2 wird der standardmäßig konfigurierte Elterntakt VPLL verwendet.

Ist hdmi_phy_pll nicht von anderen VPs belegt, wird sie bevorzugt; andernfalls bleibt der standardmäßig konfigurierte DCLK-Elterntakt.

Ist der benötigte DCLK laut Quellformulierung „größer als 4k@60Hz“, wird die Standard-PLL verwendet. Diese dimensionsgemischte Angabe bleibt als Prüfpunkt erhalten.

Um hdmi_phy0_pll bei dynamischer Konfiguration möglichst gut zu nutzen, empfiehlt die Quelle:

Den HDMI-VP möglichst nicht an VPLL als Elterntakt binden.

Empfehlungen für VP- und Schnittstellenzuordnung in einigen RK3576-Szenarien:

Bei einer HDMI- und einer DP-Ausgabe:

| Video Port | Schnittstellenkonfiguration 1 | Schnittstellenkonfiguration 2 |
| --- | --- | --- |
| Video Port0 | HDMI | Andere Anzeigeschnittstelle |
| Video Port1 | Andere Anzeigeschnittstelle | HDMI |
| Video Port2 | DP | DP |

DP verwendet dann VPLL auf VP2 und HDMI die hdmi_phy_pll auf VP0; beide erhalten genaue Frequenzen.

Ist der DP-Elterntakt nicht VPLL, versucht DP hdmi_phy_pll zu erhalten. Ist diese schon von HDMI belegt, erscheint:

```text
[ 71.673928][ T397] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 2560x1440p60, type: 1lag:0x0) for vp1 dclk: 241500000
[ 71.674040][ T397] [drm] No free hdmi phy pll for DP, use default parent
[ 71.674088][ T397] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vp1 to 241500000, get 23760
```

DP verwendet dann den aktuellen Standardelterntakt und erhält möglicherweise keine genaue Frequenz.

##### 4.5.5.5 DCLK-Zuteilungsstrategie für RK3576 auswählen

Die drei Strategien sollen vor allem beliebige Teilung für HDMI und DP ermöglichen. In den meisten Szenarien reicht die dynamische HDMI-gebundene Strategie. Beispiele:

(1) Drei Ausgabeports, wobei DP und HDMI beliebige Teilung benötigen

| Video Port | Schnittstelle |
| --- | --- |
| VP0 | HDMI |
| VP1 | DP |
| VP2 | DSI |

Die HDMI-gebundene dynamische Strategie verwenden. Überschreitet der HDMI-Pixeltakt 600MHz nicht, wählt VP0 die HDMI-PHY-PLL für beliebige Teilung. Bei einem Pixeltakt größer oder gleich 600MHz verwendet die Quelle dagegen die CRU-PLL mit ganzzahliger Teilung und filtert ungeeignete Auflösungen. Die überlappende 600MHz-Grenze bleibt dokumentiert. VP1 für DP verwendet VPLL zur beliebigen Teilung.

DTS-Konfiguration:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi>;
  clock-names = "hdmi0_phy_pll";
};
&vp1 {
  assigned-clocks = <&cru DCLK_VP1_SRC>;
  assigned-clock-parents = <&cru PLL_VPLL>;
};
```

(2) Zwei 4K-Anzeigen, DP als Hauptbildschirm. Unterstützt werden VP0 zu DP + HDMI oder VP0 zu DP und VP1 zu HDMI. Beide VP-Pixeltakte liegen unter 600MHz. Beide umschaltbaren Varianten sollen beliebige Teilung unterstützen:

| Video Port | Schnittstelle |
| --- | --- |
| VP0 | DP + HDMI |

oder

| Video Port | Schnittstelle |
| --- | --- |
| VP0 | DP |
| VP1 | HDMI |

Da HDMI den VP wechseln kann, statische Zuteilung verwenden: VP0 fest mit VPLL und VP1 fest mit hdm phy pll. Die abweichende Quellbezeichnung hdm phy pll bleibt erhalten. DTS:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&vp0 {
  assigned-clocks = <&cru DCLK_VP0_SRC>;
  assigned-clock-parents = <&cru PLL_VPLL>;
};
&vp1 {
  assigned-clocks = <&cru DCLK_VP1>;
  assigned-clock-parents = <&hdptxphy_hdmi>;
};
```

(3) Schnittstellen wechseln frei zwischen VPs und benötigen jeweils beliebige Teilung. Dieses komplexe Szenario wird laut Quelle derzeit nur für NVR genutzt. Beispielsweise können HDMI/DP/DSI alle VP0/1/2 verwenden:

| Video Port | Schnittstelle |
| --- | --- |
| VP0, VP1, VP2 | HDMI |
| VP0, VP1, VP2 | DP |
| VP0, VP1, VP2 | DSI |

Dafür folgende dynamische Strategie im DTS verwenden:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi>;
  clock-names = "hdmi0_phy_pll";
};
&vop {
  rockchip,extend-phy-pll-shared-mode;
};

&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_VPLL>;
};
```

Anfangs verwendet beispielsweise nur DP den VP2 und HDMI den VP0. Dann gelten folgende Bindungen:

| Pfad | DCLK-Quelle |
| --- | --- |
| VP0-&gt;HDMI | hdmi phy pll |
| VP2-&gt;DP | VPLL |

Wird anschließend HDMI abgezogen, DP mit VP1 und DSI mit VP2 verbunden, verwendet DP hdmi phy pll und DSI VPLL:

| Pfad | DCLK-Quelle |
| --- | --- |
| VP1-&gt;DP | hdmi phy pll |
| VP2-&gt;DSI | VPLL |

Bei dieser dynamischen Strategie wählt HDMI seine zugehörige HDMI-PHY-PLL; sie darf nicht schon durch eine andere Schnittstelle belegt sein. Nicht-HDMI-Schnittstellen können hdmi phy pll verwenden, wenn ihr VP nicht VPLL als Quelle hat und die PHY-PLL frei ist. Vor dem Aktivieren von HDMI muss die Anwendung sicherstellen, dass dessen PHY-PLL nicht anderweitig belegt ist.

#### 4.5.6 DCLK-Zuteilung für RK3588 VOP

##### 4.5.6.1 Überblick über RK3588-DCLK

RK3588 hat 4 Video Ports. Ihre dclk-Taktbäume:

![Originalabbildung: 4.5.6.1 Überblick über RK3588-DCLK; PDF S. 48](/docs/rockchip-drm-display-driver/assets/en-p48-X338.png)

dclk_vp0/1/2 kann hdmi_phy0_pll, hdmi_phy1_pll oder dclk_vpx_src0/1/2 als Elterntakt verwenden. Für dclk_vpx_src0/1/2 stehen V0PLL, CPLL, GPLL und AUPLL zur Wahl.

dclk_vp3 kann V0PLL, CPLL, GPLL oder AUPLL als Elterntakt verwenden.

V0PLL, CPLL, GPLL und AUPLL liegen in der System-CRU; hdmi_phy0_pll und hdmi_phy1_pll befinden sich in den HDMI-PHYs.

Eigenschaften von V0PLL:

1. Diese PLL ist üblicherweise exklusiv VOP zugewiesen.

2. Unterstützt beliebige Frequenzen.

3. Im DTS standardmäßig an dclk_vp2 gebunden:

```text
vp2: port@2 {
  assigned-clocks = <&cru DCLK_VOP2_SRC>;
  assigned-clock-parents = <&cru PLL_V0PLL>;
}
```

Eigenschaften von CPLL, GPLL und AUPLL:

1. Die PLL wird mit anderen IP-Modulen geteilt.

2. Keine beliebige Frequenzteilung; die Quelle nennt die Ausgangsfrequenz ein ganzzahliges Vielfaches der PLL-Frequenz. Diese fragliche Originalaussage bleibt dokumentiert.

3. dclk_vp0/1/3 ist standardmäßig an GPLL gebunden.

Standardmäßige Elterntaktbindungen der Video Ports:

![Originalabbildung: 4.5.6.1 Überblick über RK3588-DCLK; PDF S. 49](/docs/rockchip-drm-display-driver/assets/en-p49-X343.png)

Eigenschaften von hdmi_phy0_pll und hdmi_phy1_pll:

1. Unterstützen beliebige Frequenzteilung.

2. Ohne aktives HDMI gehört die PLL exklusiv VOP; bei aktivem HDMI teilen VOP und HDMI-PHY sie.

3. HDMI und EDP teilen einen PHY. Bei aktivem EDP kann dessen PLL nicht von VOP verwendet werden.

Die zweite und dritte Eigenschaft schränken die Nutzung von hdmi_phy0_pll/hdmi_phy1_pll ein. Beispiele:

1\. HDMI0 aktiv an Video Port0: folgende Möglichkeiten für hdmi_phy0_pll/hdmi_phy1_pll; bei Video Port1/2 entsprechend.

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | DCLK &lt;= 600MHz verfügbar; DCLK &gt; 600MHz nicht verfügbar | nicht verfügbar | nicht verfügbar |
| hdmi_phy1_pll | verfügbar | verfügbar | verfügbar |

2\. HDMI1 aktiv an Video Port0: folgende Möglichkeiten; bei Video Port1/2 entsprechend.

| HDMI PHY PLL | VP0 DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | verfügbar | verfügbar | verfügbar |
| hdmi_phy1_pll | DCLK &lt;= 600MHz verfügbar; DCLK &gt; 600MHz nicht verfügbar | nicht verfügbar | nicht verfügbar |

3\. HDMI0 und HDMI1 gleichzeitig aktiv an Video Port0: folgende Möglichkeiten; bei Video Port1/2 entsprechend.

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | DCLK &lt;= 600MHz verfügbar; DCLK &gt; 600MHz nicht verfügbar | nicht verfügbar | nicht verfügbar |
| hdmi_phy1_pll | DCLK &lt;= 600MHz verfügbar; DCLK &gt; 600MHz nicht verfügbar | nicht verfügbar | nicht verfügbar |

4\. EDP0 aktiv an Video Port0: folgende Möglichkeiten; bei Video Port1/2 entsprechend.

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | nicht verfügbar | nicht verfügbar | nicht verfügbar |
| hdmi_phy1_pll | verfügbar | verfügbar | verfügbar |

5\. EDP1 aktiv an Video Port0: folgende Möglichkeiten; bei Video Port1/2 entsprechend.

| HDMI PHY PLL | VP0 DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | verfügbar | verfügbar | verfügbar |
| hdmi_phy1_pll | nicht verfügbar | nicht verfügbar | nicht verfügbar |

6\. EDP0 und EDP1 gleichzeitig aktiv an Video Port0: folgende Möglichkeiten; bei Video Port1/2 entsprechend.

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | nicht verfügbar | nicht verfügbar | nicht verfügbar |
| hdmi_phy1_pll | nicht verfügbar | nicht verfügbar | nicht verfügbar |

CPLL, GPLL und AUPLL erlauben als VP-DCLK-Quelle keine beliebige Teilung. Für genaue Frequenzen kann unter den genannten Einschränkungen hdmi_phy0_pll oder hdmi_phy1_pll verwendet werden. Dafür gibt es drei Strategien:

1. Statische Zuteilung: hdmi_phy_pll wird fest an einen Video Port gebunden und von diesem dauerhaft als DCLK-Quelle verwendet.

2. Dynamische Zuteilung mit Bindung an HDMI: hdmi_phy_pll steht nur dem VP mit HDMI zur Verfügung. Dieser kann dynamisch zwischen CRU-PLL und hdmi_phy_pll wechseln.

3. Dynamische Zuteilung: hdmi_phy_pll steht allen geeigneten VPs und Schnittstellen offen. Diese komplexeste Strategie verlangt, Konflikte beim Aktivieren von Schnittstellen und VPs zu berücksichtigen. Laut Quelle ist sie derzeit nur für NVR-Produkte vorgesehen.

Für die DCLK-Zuteilung gewöhnlicher Produkte reichen die ersten beiden Strategien.

##### 4.5.6.2 Statische DCLK-Zuteilung für RK3588 VOP

Die statische Strategie hat folgende Grenzen:

1. Normalerweise kann eine hdmi_phy_pll nur einem Video Port aus VP0/VP1/VP2 zugewiesen werden.

2. Bei aktivem HDMI darf dessen hdmi_phy_pll nur dem zugehörigen Video Port zugewiesen werden oder gar nicht als DCLK-Quelle dienen.

3. Bei aktivem HDMI und Zuweisung seiner hdmi_phy_pll an den zugehörigen Video Port darf der Pixeltakt der Ausgabeauflösung 600MHz nicht überschreiten.

4. Bei aktivem EDP am gemeinsamen PHY darf hdmi_phy_pll nicht als VP-DCLK-Quelle verwendet werden.

Statische Zuteilung bindet den VP-DCLK-Elterntakt im DTSI. Nach dieser Konfiguration bleibt die Bindung unverändert.

Referenzkonfiguration für Kernel 5.10:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&hdptxphy_hdmi_clk0 {
  status = "okay";
};

&hdptxphy_hdmi_clk1 {
  status = "okay";
};

&vp0 {
  assigned-clocks = <&cru DCLK_VOP0>;
  assigned-clock-parents = <&hdptxphy_hdmi_clk0>;
};
&vp1 {
  assigned-clocks = <&cru DCLK_VOP1>;
  assigned-clock-parents = <&hdptxphy_hdmi_clk1>;
};
```

Referenzkonfiguration für Kernel 6.1 und neuer:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&vp0 {
  assigned-clocks = <&cru DCLK_VOP0>;
  assigned-clock-parents = <&hdptxphy_hdmi0>;
};

&vp1 {
  assigned-clocks = <&cru DCLK_VOP1>;
  assigned-clock-parents = <&hdptxphy_hdmi1>;
};
```

dclk_vp0 ist an hdmi_phy0_pll, dclk_vp1 an hdmi_phy1_pll gebunden.

Die Wirksamkeit lässt sich im Taktbaum prüfen:

```text
rk3588_s:/ # cat /sys/kernel/debug/clk/clk_summary | grep "hdmiphy" -A 1
    clk_hdmiphy_pixel1 0    1     0      0     0   0 50000
      dclk_vop1        0    3     0      0     0   0 50000
    clk_hdmiphy_pixel0 1    1     0 148500000  0   0 50000
      dclk_vop0        2    5     0 148500000  0   0 50000
```

Die Elterntaktbindung ist wirksam. dclk_vp0 ist auf 148.5MHz eingestellt, passend zur Protokollausgabe.

Die letzte Zeile set dclk_vop0 to 148500000, get 148500000 bedeutet 148.5MHz angefordert und tatsächlich ausgegeben; das stimmt mit dem Taktbaum überein.

```text
[ 270.974623][ T381] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 1920x1080p60, type: 11(if:800) for vp0 dclk: 148500000
[ 270.974837][ T381] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out0 div: 0 dclk_core0 div: 2
[ 270.974891][ T381] rockchip-hdptx-phy-hdmi fed60000.hdmiphy: hdptx_ropll_cmn_config bus_width:16a8c8 rate:1485000
[ 270.975264][ T381] rockchip-hdptx-phy-hdmi fed60000.hdmiphy: hdptx phy pll locked!
[ 270.975304][ T381] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vop0 to 148500000, get 148500000
```

##### 4.5.6.3 Dynamische DCLK-Zuteilung für RK3588 mit HDMI-Bindung

hdmi_phy_pll wird nur dem VP mit HDMI zugewiesen. Dieser schaltet abhängig vom HDMI-Betriebsmodus zwischen CRU-PLL und HDMI-PHY-PLL um. Konfiguration für Kernel 5.10:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&hdptxphy_hdmi_clk0 {
  status = "okay";
};

&hdptxphy_hdmi_clk1 {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi_clk0>, <&hdptxphy_hdmi_clk1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};
```

Referenzkonfiguration für Kernel 6.1 und neuer:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>, <&hdptxphy_hdmi1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};
```

Bei HDMI0 an VP0 und HDMI1 an VP1 wechseln die DCLK-Quellen abhängig vom Pixeltakt wie folgt:

|  | Pixeltakt &gt; 600MHz | Pixeltakt &lt; 600MHz |
| --- | --- | --- |
| VP0--&gt;HDMI0 | CRU PLL | hdmi0 phy pll |
| VP1--&gt;HDMI1 | CRU PLL | hdmi1 phy pll |

##### 4.5.6.4 Dynamische DCLK-Zuteilung für RK3588 VOP

Dynamische Zuteilung unter Kernel 5.10:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&hdptxphy_hdmi_clk0 {
  status = "okay";
};

&hdptxphy_hdmi_clk1 {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi_clk0>, <&hdptxphy_hdmi_clk1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};
&vop {
  rockchip,extend-phy-pll-shared-mode;
};
```

Referenzkonfiguration für Kernel 6.1 und neuer:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>, <&hdptxphy_hdmi1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};

&vop {
  rockchip,extend-phy-pll-shared-mode;
};
```

Gegenüber der zweiten Strategie kommt lediglich rockchip,extend-phy-pll-shared-mode unter dem vop-Knoten hinzu.

Nur wenige PLL-Quellen erlauben beliebige Teilung, und die HDMI-PHY-PLL unterliegt Einschränkungen. Deshalb ist die dynamische Strategie komplex und begrenzt die möglichen Anwendungsszenarien.

Bei jedem Aktivieren eines Video Ports wird DCLK nach folgenden Regeln gebunden:

1\. HDMI0 und HDMI1, eventuell zusammen mit DP/MIPI, hängen am selben Video Port0/1/2, DCLK unter 600MHz:

1.1 Sind hdmi_phy0_pll und hdmi_phy1_pll von keinem anderen VP belegt, wird hdmi_phy0_pll Elterntakt des aktuellen VP. Beide PHY-PLLs stehen dann keinem anderen VP zur Verfügung.

1.2 Ist eine der beiden PHY-PLLs von einem anderen VP belegt, wird ein Fehler gemeldet.

2\. HDMI0, eventuell zusammen mit DP/MIPI, hängt am nachfolgend VP_A genannten Video Port0/1/2, DCLK unter 600MHz:

2.1 Existieren beide PHY-PLLs und ist hdmi_phy0_pll frei, verwendet VP_A diese exklusiv.

2.2 Existieren beide PHY-PLLs, verwendet VP_B hdmi_phy0_pll und ist hdmi_phy1_pll frei, muss VP_B zu hdmi_phy1_pll wechseln. VP_A erhält hdmi_phy0_pll.

2.3 Sind beide PHY-PLLs vorhanden und von anderen VPs belegt, wird ein Fehler gemeldet.

2.4 Ist nur hdmi_phy0_pll konfiguriert und frei, verwendet VP_A diese.

2.5 Ist nur hdmi_phy0_pll konfiguriert und anderweitig belegt, wird ein Fehler gemeldet.

3\. HDMI1, eventuell zusammen mit DP/MIPI, hängt an Video Port0/1/2, DCLK unter 600MHz: Die Strategie entspricht Punkt 2 und wird nicht erneut ausgeführt.

4\. Nur DP hängt an Video Port0/1/2:

4.1 Für Video Port2 wird der standardmäßig konfigurierte DCLK-Elterntakt verwendet.

4.2 Ist eine der beiden PHY-PLLs frei, wird hdmi_phy0_pll oder hdmi phy1_pll bevorzugt, andernfalls der Standardelterntakt verwendet. Die abweichende Quellschreibweise bleibt erhalten.

Ist der benötigte DCLK laut Quelle „größer als 4k@60Hz“, wird die Standard-PLL verwendet; die dimensionsgemischte Originalangabe ist als Prüfpunkt dokumentiert.

Für eine möglichst gute Nutzung beider HDMI-PHY-PLLs empfiehlt die Quelle:

1. HDMI0 und HDMI1 möglichst nicht an Video Port2 anschließen.

2. HDMI0 und HDMI1 möglichst nicht an denselben Video Port anschließen.

Zuordnungen für einige Anwendungsszenarien:

Bei zwei HDMI- und einer DP-Ausgabe:

| Video Port | Schnittstellenkonfiguration 1 | Schnittstellenkonfiguration 2 |
| --- | --- | --- |
| Video Port0 | HDMI0 | HDMI1 |
| Video Port1 | HDMI1 | HDMI0 |
| Video Port2 | DP0/DP1 | DP0/DP1 |

Bei zwei DP- und einer HDMI-Ausgabe:

| Video<br>Port | Schnittstellenkonfiguration 1 | Schnittstellenkonfiguration 2 | Schnittstellenkonfiguration 3 | Schnittstellenkonfiguration 4 |
| --- | --- | --- | --- | --- |
| Video<br>Port0 | HDMI0/1 | HDMI0/1 | DP0 | DP1 |
| Video<br>Port1 | DP0 | DP1 | HDMI0/1 | HDMI0/1 |
| Video<br>Port2 | DP1 | DP0 | DP1 | DP0 |

Weitere Anwendungsszenarien anhand der dynamischen Zuteilungsregeln sinnvoll konfigurieren.

Die dynamische Strategie kann beide HDMI-PHY-PLLs belegen. Das Protokoll zeigt dann deren Belegung:

```text
[ 220.692900][ T383] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 1920x1080p60, type: 11(if:1000) for vp1 dclk: 148500000
[ 220.693048][ T383] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out1 div: 0 dclk_core1 div: 2
[ 220.693094][ T383] [drm:vop2_clk_set_parent_extend.isra.61] *ERROR* hdmi1 phy pll is used by vp0:vp2
```

Hier belegt Video Port0 die hdmi_phy0_pll und Video Port2 die hdmi_phy1_pll.

Wenn nur eine HDMI-PHY-PLL konfiguriert ist, beispielsweise:

```text
&display_subsystem {
     clocks = <&hdptxphy_hdmi_clk0>;
     clock-names = "hdmi0_phy_pll";
};
```

Folgendes Protokoll zeigt, dass hdmi_phy0_pll bereits von Video Port2 belegt ist.

```text
[ 35.059306][ T386] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 1920x1080p60, type: 11(if:800) for vp0 dclk: 148500000
[ 35.059416][ T386] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out0 div: 0 dclk_core0 div: 2
[ 35.059447][ T386] [drm:vop2_clk_set_parent_extend.isra.61] *ERROR* hdmi0: phy pll is used by vp2
```

##### 4.5.6.5 DCLK-Zuteilungsstrategie für RK3588 auswählen

Die drei Strategien ermöglichen vor allem beliebige Teilung für HDMI und DP. In den meisten Anwendungen reicht die HDMI-gebundene dynamische Strategie. Einige Beispiele:

(1) Vier Video-Port-Ausgaben; DP und HDMI benötigen beliebige Teilung.

| Video Port | Schnittstelle |
| --- | --- |
| VP0 | HDMI0 |
| VP1 | HDMI1 |
| VP2 | DP0 |
| VP3 | DSI0 |

Die HDMI-gebundene dynamische Strategie verwenden. Bei HDMI-Pixeltakt kleiner oder gleich 600MHz wird die HDMI-PHY-PLL für beliebige Teilung gewählt. Laut Quelle wird zugleich bei größer oder gleich 600MHz die CRU-PLL mit ganzzahliger Teilung verwendet und nicht unterstützte Auflösungen werden gefiltert. Die überlappende 600MHz-Grenze bleibt als Prüfpunkt erhalten. VP2 für DP0 verwendet VPLL zur beliebigen Teilung.

DTS-Konfiguration für Kernel 6.1 und neuer:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>, <&hdptxphy_hdmi1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};
&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_V0PLL>;
};
```

(2) Vier Video-Port-Ausgaben; DP und HDMI benötigen beliebige Teilung.

| Video Port | Schnittstelle |
| --- | --- |
| VP0 | HDMI0 |
| VP1 | DP0 |
| VP2 | DP1 |
| VP3 | DSI0 |

Die HDMI-gebundene dynamische Strategie verwenden. Überschreitet HDMI0 600MHz nicht, verwendet VP0 hdmi phy pll für beliebige Teilung. Bei größer oder gleich 600MHz nennt die Quelle CRU-PLL-Teilung und das Filtern ungeeigneter Auflösungen; die Grenzwertüberschneidung bleibt dokumentiert. VP1 für DP0 verwendet hdmi phy1 pll, VP2 für DP1 V0PLL. Damit erhalten beide beliebige Teilung.

DTS-Konfiguration für Kernel 6.1 und neuer:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>;
  clock-names = "hdmi0_phy_pll";
};

&vp1 {
  assigned-clocks = <&cru DCLK_VP1>;
  assigned-clock-parents = <&hdptxphy_hdmi1>;
};
&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_V0PLL>;
};
```

(3) Schnittstellen können frei zwischen VPs wechseln und benötigen jeweils beliebige Teilung. Dieses komplexe Szenario wird laut Quelle derzeit nur für NVR verwendet. Beispielsweise können HDMI/DP/DSI VP0/1/2 wechseln:

| Video Port | Schnittstelle |
| --- | --- |
| VP0, VP1, VP2 | HDMI0 |
| VP0, VP1, VP2 | HDMI1 |
| VP0, VP1, VP2 | DP0 |
| VP0, VP1, VP2 | DP1 |

Dafür folgende dynamische Zuteilung unter Kernel 6.1 und neuer verwenden:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>, <&hdptxphy_hdmi1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};

&vop {
  rockchip,extend-phy-pll-shared-mode;
};

&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_V0PLL>;
};
```

Im Beispiel nennt der Text zunächst HDMI0 an VP0, HDMI1 an VP1 und DP0 an VP1. Die folgende Originaltabelle ordnet DP0 dagegen VP2 zu; beide Angaben bleiben ausdrücklich zur Prüfung erhalten:

| Pfad | DCLK-Quelle |
| --- | --- |
| VP0-&gt;HDMI0 | hdmi phy0 pll |
| VP1-&gt;HDMI1 | hdmi phy1 pll |
| VP2-&gt;DP0 | V0PLL |

Werden HDMI0 und HDMI1 abgezogen, anschließend zuerst HDMI1 mit VP0 und dann DP1 mit VP1 verbunden, gelten:

| Pfad | DCLK-Quelle |
| --- | --- |
| VP0-&gt;HDMI1 | hdmi phy1 pll |
| VP1-&gt;DP1 | hdmi phy0 pll |
| VP2-&gt;DP0 | V0PLL |

HDMI wählt in dieser dynamischen Strategie die zugehörige HDMI-PHY-PLL, die nicht anderweitig belegt sein darf. Nicht-HDMI-Schnittstellen können eine freie PHY-PLL als DCLK-Quelle verwenden, wenn ihre VP-Quelle nicht V0PLL ist. Vor dem Aktivieren von HDMI muss die Anwendung die Verfügbarkeit der zugehörigen PHY-PLL sicherstellen.

## 5. Mehrschirmbetrieb mit VOP 2.0

Bei VOP 1.0 werden für unterschiedliche Bildschirminhalte üblicherweise mehrere VOPs benötigt. Deshalb unterstützen nur Plattformen mit zwei VOPs wie RK3288, RK3399 und PX30 zwei unabhängige Anzeigen.

VOP 2.0 nutzt IP-Ressourcen durch seine einheitliche Architektur effizienter. Im einfachsten Fall entspricht die Zahl unabhängiger Ausgaben der VP-Anzahl. Wie im Kapitel zu VOP2-Anzeigepfaden beschrieben, besitzt RK3568 drei und RK3588 vier unabhängige VPs und kann damit grundsätzlich drei beziehungsweise vier unabhängige Anzeigen erzeugen.

### 5.1 Connector-mirror

Connector-mirror erlaubt einem VP, mehrere Schnittstellen gleichzeitig mit demselben Timing und Inhalt anzusteuern.

![Originalabbildung: 5.1 Connector-mirror; PDF S. 58](/docs/rockchip-drm-display-driver/assets/en-p58-X366.png)

Das Bild zeigt auf RK3588 zwei HDMI/eDP an VP0, zwei DP an VP1 und zwei MIPI DSI an VP2. Die Quelle beschreibt zusätzlich VP3 über BT656/BT1120 und insgesamt sieben gleichzeitige Kanäle in vier unabhängigen Ausgabegruppen. Schnittstellen derselben VP-Gruppe verwenden identisches Timing und denselben Inhalt. Die genaue Kanalzuordnung ist anhand der Originalgrafik und des Ziel-BSP zu prüfen.

Die maximale Auflösung jeder Gruppe wird vom jeweiligen Video Port und der Anzeigeschnittstelle begrenzt.

Zum Aktivieren im DTS zwei Schnittstellen mit demselben VP verbinden:

```text
&hdmi0 {
     status = "okay";
};

&hdmi1 {
     status = "okay";
};

&hdmi0_in_vp0 {
     status = "okay";
};
&hdmi1_in_vp0 {
     status = "okay";
};

&hdmi0_in_vp1 {
     status = "disabled";
};
&hdmi0_in_vp2 {
     status = "disabled";
};

&hdmi1_in_vp1 {
     status = "disabled";
};

&hdmi1_in_vp2 {
     status = "disabled";
};
```

Diese Konfiguration verbindet HDMI0 und HDMI1 mit VP0 und aktiviert Connector-mirror.

Laut Quelle unterstützt das NVR-SDK diese Funktion. Android benötigt eine HWC-Version neuer als 1.4.15.

### 5.2 Connector-split

Connector-split ähnelt dem MIPI-Zweikanalmodus. Die Ausgabe eines VP wird horizontal in zwei Pfade geteilt und steuert zwei Schnittstellen mit identischem Timing, aber unterschiedlichen Inhalten an.

![Originalabbildung: 5.2 Connector-split; PDF S. 60](/docs/rockchip-drm-display-driver/assets/en-p60-X374.png)

Bei aktiviertem Split auf VP0 kann dessen Ausgabe zwei Schnittstellen gleichzeitig ansteuern, etwa HDMI0/1, eDP0/1 oder andere mit VP0 verbindbare Schnittstellen. Beide zeigen die linke beziehungsweise rechte Hälfte. Bei einer VP0-Auflösung von 3840x1080 zeigt jede Schnittstelle beispielsweise 1920x1080.

Damit lassen sich auf RK3588 laut Quelle sieben unabhängige Anzeigeausgaben realisieren.

Die beiden Split-Schnittstellen jedes VP müssen identisches Ausgabetiming und gleiche Bildrate haben.

Connector-split erweitert den Mehrschirmbetrieb mit unterschiedlichen Inhalten. Laut Quelle unterstützen derzeit nur RK3588/RK3576 diese Funktion. Nach Schnittstellentyp gibt es zwei Modi:

1\. Split für gleichartige Schnittstellen: rockchip,split-mode

(1) Ein VP verbindet zwei Schnittstellen/Bildschirme mit exakt gleichem Timing. (2) Die Bildschirme zeigen linke und rechte Bildhälfte. (3) DTS/EDID liefert das Einzelbildschirmtiming; drm_mode_convert_to_split_mode() verdoppelt die horizontalen Timingwerte für VOP. (4) Die Software registriert einen Connector; die Anwendung sieht ein Anzeigegerät.

Beide Split-Schnittstellen im DTS mit demselben VP verbinden und rockchip,split-mode an der linken Schnittstelle aktivieren.

Beispiel für HDMI0/HDMI1-Split auf VP0:

```text
&hdmi0 {
     status = "okay";
};

&hdmi1 {
     status = "okay";
     rockchip,split-mode;
};
&hdmi0_in_vp0 {
     status = "okay";
};

&hdmi1_in_vp0 {
     status = "okay";
};
&hdmi0_in_vp1 {
     status = "disabled";
};

&hdmi0_in_vp2 {
     status = "disabled";
};
&hdmi1_in_vp1 {
     status = "disabled";
};

&hdmi1_in_vp2 {
     status = "disabled";
};
```

Damit Anwendungen ähnlich wie bei MIPI-Zweikanalbetrieb arbeiten und Implementierungsunterschiede verborgen bleiben, registriert der Treiber für die beiden Split-Schnittstellen eines VP nur einen Encoder und Connector bei DRM. Im Userspace erscheint deshalb ein Connector pro CRTC/VP. Dies lässt sich mit modetest prüfen.

Für Android-Anwendungen, die je Bildschirm ein eigenes Anzeigegerät erwarten, wurde Rockchip-HWC entsprechend angepasst. Einzelheiten siehe DrmHwc2 Multi-screen Stitching and Different-display Function Description.

2\. Split für unterschiedliche Schnittstellen: rockchip,dual-connector-split

(1) Ein VP verbindet zwei unterschiedliche Schnittstellentypen mit exakt gleichem Timing. (2) Beide Bildschirme zeigen linke beziehungsweise rechte Bildhälfte. (3) DTS/EDID liefert das Einzelbildschirmtiming; drm_mode_convert_to_split_mode() verdoppelt die horizontalen Timingwerte für VOP. (4) Die Software registriert zwei Connectoren; die Anwendung sieht zwei Anzeigegeräte.

Der Hauptunterschied zu rockchip,split-mode sind zwei unterschiedliche Schnittstellentypen. DRM muss ihre Treiber separat verwalten und registriert daher zwei Connectoren. Die Anwendung sieht zwei Geräte. rockchip,dual-connector-split an den jeweiligen Schnittstellenknoten aktiviert den Modus, rockchip,left-display markiert den linken Bildschirm.

Beispiel: HDMI0/DP0-Split an VP0, wobei HDMI0 die linke Bildhälfte zeigt:

```text
&hdmi0 {
     status = "okay";
     rockchip,dual-connector-split;
     rockchip,left-display;
};

&dp0 {
     status = "okay";
     rockchip,dual-connector-split;
};
&hdmi0_in_vp0 {
     status = "okay";
};

&dp0_in_vp0 {
     status = "okay";
};
&hdmi0_in_vp1 {
     status = "disabled";
};

&hdmi0_in_vp2 {
     status = "disabled";
};

&dp0_in_vp1 {
     status = "disabled";
};
&dp0_in_vp2 {
     status = "disabled";
};
```

## 6. Hardwareaspekte

### 6.1 Hardwareverbindung für RGB-Ausgabe und TTL-Modus

#### 6.1.1 RGB-Hardwareverbindung bei VOP 1.0

1\. Die VOP-Version zur Unterscheidung von VOP 1.0 und 2.0 nachschlagen. Die Quelle verweist auf 3.1; die Funktionstabelle steht tatsächlich in 4.1.

2\. Hardwareanschluss eines SoC mit 24-Bit-RGB-Ausgabe:

![Originalabbildung: 6.1.1 RGB-Hardwareverbindung bei VOP 1.0; PDF S. 62](/docs/rockchip-drm-display-driver/assets/en-p62-X379.png)

3\. Hardwareanschluss eines SoC mit 18-Bit-RGB-Ausgabe:

![Originalabbildung: 6.1.1 RGB-Hardwareverbindung bei VOP 1.0; PDF S. 63](/docs/rockchip-drm-display-driver/assets/en-p63-X385.png)

4\. Bei der MCU-Schnittstelle von VOP 1.0 entsprechen die Datenleitungen der parallelen RGB-Verbindung. Die vier RGB-Taktsignale werden als MCU-Steuersignale mehrfach genutzt. Zuordnung:

![Originalabbildung: 6.1.1 RGB-Hardwareverbindung bei VOP 1.0; PDF S. 63](/docs/rockchip-drm-display-driver/assets/en-p63-X386.png)

#### 6.1.2 RGB-Hardwareverbindung bei VOP 2.0 und neuer

![Originalabbildung: 6.1.2 RGB-Hardwareverbindung bei VOP 2.0 und neuer; PDF S. 64](/docs/rockchip-drm-display-driver/assets/en-p64-X389.png)

#### 6.1.3 Softwarekonfiguration für verschiedene display mode index

![Originalabbildung: 6.1.3 Softwarekonfiguration für verschiedene display mode index; PDF S. 64](/docs/rockchip-drm-display-driver/assets/en-p64-X390.png)

#### 6.1.4 BT.656- und BT.1120-Hardwareverbindung

![Originalabbildung: 6.1.4 BT.656- und BT.1120-Hardwareverbindung; PDF S. 64](/docs/rockchip-drm-display-driver/assets/en-p64-X391.png)

Bei falschen Farben lässt sich bus_formats im DTS an die Y/U/V-Verarbeitungsreihenfolge des Empfängers anpassen. BT.656 und BT.1120 besitzen jeweils vier Konfigurationen:

BT.656:

```text
#define MEDIA_BUS_FMT_UYVY8_2X8 0x2006
#define MEDIA_BUS_FMT_VYUY8_2X8 0x2007
#define MEDIA_BUS_FMT_YUYV8_2X8 0x2008
#define MEDIA_BUS_FMT_YVYU8_2X8 0x2009
```

BT.1120:

```text
#define MEDIA_BUS_FMT_UYVY8_1X16 0x200f
#define MEDIA_BUS_FMT_VYUY8_1X16 0x2010
#define MEDIA_BUS_FMT_YUYV8_1X16 0x2011
#define MEDIA_BUS_FMT_YVYU8_1X16 0x2012
```

Die MEDIA_BUS_FMT-Definitionen stehen unter:

```text
./include/uapi/linux/media-bus-format.h
```

### 6.2 LVDS-Datenzuordnung

![Originalabbildung: 6.2 LVDS-Datenzuordnung; PDF S. 65](/docs/rockchip-drm-display-driver/assets/en-p65-X397.png)

## 7. Hinweise zum Anzeigetiming

### 7.1 Übliches Timingdiagramm

![Originalabbildung: 7.1 Übliches Timingdiagramm; PDF S. 66](/docs/rockchip-drm-display-driver/assets/en-p66-X403.png)

### 7.2 Timingdefinition von DRM

![Originalabbildung: 7.2 Timingdefinition von DRM; PDF S. 66](/docs/rockchip-drm-display-driver/assets/en-p66-X405.png)

### 7.3 Zuordnung und Umrechnung der Softwarekonfiguration

![Originalabbildung: 7.3 Zuordnung und Umrechnung der Softwarekonfiguration; PDF S. 67](/docs/rockchip-drm-display-driver/assets/en-p67-X409.png)

![Originalabbildung: 7.3 Zuordnung und Umrechnung der Softwarekonfiguration; PDF S. 67](/docs/rockchip-drm-display-driver/assets/en-p67-X411.png)

### 7.4 Aktuell konfiguriertes Timing anzeigen

![Originalabbildung: 7.4 Aktuell konfiguriertes Timing anzeigen; PDF S. 67](/docs/rockchip-drm-display-driver/assets/en-p67-X412.png)

## 8. Bandbreite berechnen

### 8.1 Bildbandbreite

Beispiel mit 1080P-Bilddaten im ARGB-Format:

![Originalabbildung: 8.1 Bildbandbreite; PDF S. 68](/docs/rockchip-drm-display-driver/assets/en-p68-X418.png)

Ein ARGB-Pixel belegt 4 Byte.

Speicherbedarf von 1080P-ARGB: 1920 x 1080 x 4Byte/pixel = 8,100 Kbyte.

Bei 60fps beträgt die Bandbreite: 8,100 x 60fps = 474.6 Mbyte/s.

Bei YUV420SP(NV12):

![Originalabbildung: 8.1 Bildbandbreite; PDF S. 68](/docs/rockchip-drm-display-driver/assets/en-p68-X419.png)

Ein NV12-Pixel belegt 1.5 Byte.

Speicherbedarf von 1080P-NV12: 1920 x 1080 x 1.5Byte/pixel = 3,037.5 Kbyte.

Bei 60fps: 3,037.5 x 60fps = 178 Mbyte/s.

### 8.2 Bandbreite der Anzeigeschnittstelle

![Originalabbildung: 8.2 Bandbreite der Anzeigeschnittstelle; PDF S. 68](/docs/rockchip-drm-display-driver/assets/en-p68-X420.png)

Beim gezeigten Timing werden für 60 Bilder pro Sekunde 131994240 hz DCLK benötigt. Im DTS wird auf 132000000 hz gerundet:

```text
htotal = hfp + hsync + hbp + hactive = 15 + 2 + 30 + 1080 = 1,127
vtotal = vfp + vsync + vbp + vactive = 15 + 2 + 15 + 1920 = 1,952
dclk = htotal x vtotal x fps = 1127 x 1952 x 60fps = 131,994,240
```

Die über MIPI übertragene Frequenz beträgt:

```text
132M x 3(RGB) x 8(bpc) / 4(lane) / 0.9 = 880 Mbps
```

Dabei bedeutet:

x3(RGB): Jedes Pixel enthält 3 RGB-Komponenten.

x8(bpc): Jede Komponente besitzt 8bit Bittiefe.

/4(lane): Die gesamte Datenmenge wird auf 4 Lanes verteilt, um die Datenrate pro Lane zu bestimmen.

/0.9: berücksichtigt die Übertragungseffizienz des MIPI-Timings.

## 9. Übliche Diagnoseverfahren

### 9.1 Aktuellen Anzeigezustand auslesen

#### 9.1.1 Befehl verwenden

```text
cat /sys/kernel/debug/dri/0/summary
```

![Originalabbildung: 9.1.1 Befehl verwenden; PDF S. 70](/docs/rockchip-drm-display-driver/assets/en-p70-X431.png)

Der Befehl benötigt Kernel-debugfs. Ist debugfs nicht aktiviert oder nicht eingehängt, CONFIG_DEBUG_FS im Kernel einschalten und debugfs manuell wie folgt einhängen:

```text
mount -t debugfs none /sys/kernel/debug
```

#### 9.1.2 Parameter erläutert

1\. Die roten Rahmen zeigen die verwendeten VOPs ff900000.vop und ff8f0000.vop.

2\. Grün zeigt Connectorinformationen: Die beiden Geräte sind ein eDP- und ein MIPI-Panel.

3\. Rosa zeigt den Anzeigemodus mit Timing, DCLK und Bildrate. Im Beispiel: eDP mit 1536x2048p60 und MIPI mit 1280x720p29.

4\. Blau zeigt VOP-Layerinformationen. Das erste Gerät nutzt win0 mit 1536x2048 XRGB, das zweite win0 mit 1280x720 XRGB. src und dst bezeichnen Größe und Position von Quelldaten und Anzeige. Unterschiedliche Größen lösen VOP-Skalierung aus, beispielsweise:

![Originalabbildung: 9.1.2 Parameter erläutert; PDF S. 71](/docs/rockchip-drm-display-driver/assets/en-p71-X437.png)

5\. Orange enthält VOP-HDR- und CSC-Status. SDR bedeutet SDR-Anwendungsdaten; bei HDR-Daten erscheint HDR.

6\. Die VOP2-Zusammenfassung entspricht weitgehend älteren Plattformen. VOP heißt hier Video Port, und winx-Layer heißen Cluster-winx oder Esmart-winx:

![Originalabbildung: 9.1.2 Parameter erläutert; PDF S. 71](/docs/rockchip-drm-display-driver/assets/en-p71-X438.png)

7\. Die format-Eigenschaft jedes Layers kann einen standardisierten fourcc-Wert wie AB24, XR24 oder NV12 enthalten und bezeichnet das Framebuffer-Datenformat. Einzelheiten siehe [drm fourcc](https://elixir.bootlin.com/linux/latest/source/include/uapi/drm/drm_fourcc.h).

#### 9.1.3 Aktuelle VOP-Konfiguration auslesen

Wegen der komplexen VOP2-Architektur und zahlreicher Registerkonfigurationen gibt es zwei Ausleseverfahren:

1\. Konfiguration über cat an DRM-Geräteknoten auslesen:

(1) Registerkonfiguration der aktiven VOP-Module:

```text
cat /sys/kernel/debug/dri/0/active_regs
```

(2) Registerkonfiguration aller VOP-Untermodule:

```text
cat /sys/kernel/debug/dri/0/regs
```

Beide Befehle liefern VOP-Register. Zusammen mit cat /sys/kernel/debug/dri/0/summary lässt sich der aktuelle Anzeigezustand weitgehend erfassen.

Diese Funktion ist laut Quelle ab Linux-6.1 standardmäßig unterstützt. Unter Linux-5.10 und Linux-

4.19 wird ein neuerer Treiberstand benötigt. Ist ein Update dieser beiden Kernel nicht möglich, Verfahren 2 verwenden.

2\. Das Skript [vop2_dump](https://gitee.com/andyshrk/drm/blob/master/res/vop2_dump.sh).sh verwenden.

Das Skript liest VOP-Anzeigeinformationen bequem aus und gehört meist zum SDK. Andernfalls ist es unter [vop2_dump](https://gitee.com/andyshrk/drm/blob/master/res/vop2_dump.sh) erhältlich.

Auch dieses Skript benötigt debugfs. Zusätzlich CONFIG_DEVMEM im Kernel aktivieren, damit es Register mit io lesen kann.

### 9.2 Aktuell angezeigten Puffer auslesen

Fehlerhafte Bildinhalte können im Pfad VOP → Schnittstelle → Bildschirm/Monitor oder bereits in den von der Anwendung gezeichneten Daten entstehen. Den angezeigten VOP-Layerpuffer auslesen und etwa mit 7yuv prüfen. Sind schon diese Daten fehlerhaft, liegt das Problem bei den Userspace-Daten; andernfalls den Pfad ab VOP bis zum Bildschirm prüfen.

#### 9.2.1 Verwendung

Zunächst CONFIG_ROCKCHIP_DRM_DEBUG in make menuconfig des Kernels aktivieren.

![Originalabbildung: 9.2.1 Verwendung; PDF S. 72](/docs/rockchip-drm-display-driver/assets/en-p72-X443.png)

1\. Einen aktuell angezeigten Frame auslesen

```text
echo dump > /sys/kernel/debug/dri/0/**ff900000.vop**/vop_dump/dump
```

2\. Fortlaufend n angezeigte Frames auslesen

```text
echo dumpn > /sys/kernel/debug/dri/0/**ff900000.vop**/vop_dump/dump
```

3\. Die Dateien liegen unter /data/vop_buf/ und können mit 7yuv betrachtet werden.

4\. Der hervorgehobene Pfadteil [ff900000.vop] ist plattformabhängig. Den VOP/VP anhand von cat /sys/kernel/debug/dri/0/summary zuordnen. Auf RK3588 lautet der Pfad beispielsweise /sys/kernel/debug/dri/0/**video_port0**/dump.

### 9.3 Farbbalken im VP-Selbsttest anzeigen

Bei VOP2 unterstützt jeder VP Farbbalken im Selbsttest. Beispiel VP0:

```text
Enable horizontal color bar:
  echo 1 > /sys/kernel/debug/dri/0/video_port0/color_bar
Enable vertical color bar:
  echo 2 > /sys/kernel/debug/dri/0/video_port0/color_bar
Disable color bar:
  echo 0 > /sys/kernel/debug/dri/0/video_port0/color_bar
```

1\. Anzeige bei color_bar = 1

![Originalabbildung: 9.3 Farbbalken im VP-Selbsttest anzeigen; PDF S. 73](/docs/rockchip-drm-display-driver/assets/en-p73-X451.png)

2\. Anzeige bei color_bar = 2

![Originalabbildung: 9.3 Farbbalken im VP-Selbsttest anzeigen; PDF S. 73](/docs/rockchip-drm-display-driver/assets/en-p73-X452.png)

Bei fehlender oder fehlerhafter Anzeige den VP-Selbsttest wie folgt zur Diagnose nutzen:

1. Sind die Farbbalken korrekt, schließt die Quelle Fehler von Schnittstelle und Bildschirmseite aus. Dann VOP und Userspace gezielt untersuchen.

2. Sind die Farbbalken fehlerhaft, VOP und die nachfolgenden Module untersuchen.

### 9.4 DRM-Protokollstufe einstellen

DRM definiert die folgenden Protokollstufen je Schnittstelle. Der Debugknoten steuert, welche Ausgaben ein- oder ausgeschaltet werden. Für ATOMIC beispielsweise:

```text
echo 0x10 > /sys/module/drm/parameters/debug
```

Für alle Diagnoseinformationen:

```text
echo 0xff > /sys/module/drm/parameters/debug
```

Bit 5, entsprechend 0x20, aktiviert umfangreiche vsync-Informationen. Wird dies nicht benötigt, das Bit normalerweise nicht setzen.

Weitere Protokollstufen sind wie folgt definiert:

```text
Enable debug output, where each bit enables a debug category.
Bit 0 (0x01) will enable CORE messages (drm core code)
Bit 1 (0x02) will enable DRIVER messages (drm controller code)
Bit 2 (0x04) will enable KMS messages (modesetting code)
Bit 3 (0x08) will enable PRIME messages (prime code)
Bit 4 (0x10) will enable ATOMIC messages (atomic code)
Bit 5 (0x20) will enable VBL messages (vblank code)
Bit 7 (0x80) will enable LEASE messages (leasing code)
Bit 8 (0x100) will enable DP messages (displayport code)
```

Die umfangreichen Ausgaben erscheinen standardmäßig nicht vollständig an der seriellen Konsole. Nach Aktivieren eines Debugschalters sieht man dort nur einen Teil. Für das vollständige Protokoll dmesg verwenden.

### 9.5 Aktuellen Anzeigetakt prüfen

Der Takt beeinflusst das Anzeigemodul entscheidend. Den aktuell vom System bereitgestellten Takt mit folgenden Befehlen ermitteln:

1\. Gesamten Taktbaum anzeigen

```text
cat /sys/kernel/debug/clk/clk_summary
```

2\. Nur VOP-Takte anzeigen

```text
cat /sys/kernel/debug/clk/clk_summary | grep vop
```

HDMI/DP/VGA/CVBS verlangen je Auflösung einen genau standardisierten DCLK. Ein falscher Takt kann fehlende Anzeige oder Kompatibilitätsprobleme verursachen. eDP/LVDS/MIPI/RGB besitzen üblicherweise einen gewissen Spielraum.

Beim Aktivieren einer Schnittstelle zeigt VOP2 den angeforderten und den tatsächlich vom System erhaltenen Takt. Auf Abweichungen besonders achten:

```text
rockchip-vop2: [vop2_crtc_atomic_enable] Update mode to 3840x2160p60, type: 10(if:200) for vp2 dclk: 533280000
fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out2 div: 2 dclk_core2 div: 2
fdd90000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vop2 to 533280000, get 533279987
```

Das Protokoll aktiviert anhand von type erkennbar DP an VP2 mit 4K. Benötigt werden 533280000 HZ, das System liefert 533279987 HZ. Da DP einen sehr genauen DCLK verlangt, bleibt der Bildschirm laut Quelle in diesem Fall höchstwahrscheinlich dunkel.

### 9.6 Anzeigegerät zwangsweise ein- oder ausschalten

Beispiel LVDS:

LVDS ausschalten: echo off &gt; /sys/class/drm/card0-LVDS-1/status

LVDS einschalten: echo on &gt; /sys/class/drm/card0-LVDS-1/status

### 9.7 DRM-Pufferbelegung anzeigen

Die Belegung der über DRM GEM angeforderten Puffer zeigt folgender Befehl:

```text
cat /sys/kernel/debug/dri/0/mm_dump
```

![Originalabbildung: 9.7 DRM-Pufferbelegung anzeigen; PDF S. 75](/docs/rockchip-drm-display-driver/assets/en-p75-X460.png)

### 9.8 GPIO-Zustand prüfen

Beim ersten Inbetriebnehmen und Aktivieren des Bildschirms werden Versorgung oder Hintergrundbeleuchtung häufig über GPIOs gesteuert. Ob die softwareseitigen GPIO-Zustände stimmen, lässt sich wie folgt prüfen:

```text
cat /sys/kernel/debug/gpio
```

![Originalabbildung: 9.8 GPIO-Zustand prüfen; PDF S. 75](/docs/rockchip-drm-display-driver/assets/en-p75-X461.png)

### 9.9 modetest verwenden

modetest ist das in libdrm integrierte Kommandozeilenwerkzeug zum Testen von DRM. Es bietet folgende Funktionen:

1\. Grundzustand des DRM-Systems auslesen

```text
[root@RK356X:/]# modetest -M rockchip
Encoders:
id   crtc type possible crtcs possible clones
151  0   Virtual 0x00000007 0x00000000
153  0   TMDS 0x00000002 0x00000000
155  71  TMDS 0x00000001 0x00000000
166  0   DPI  0x00000004 0x00000000
Connectors:
id   encoder status name     size (mm) modes encoders
154  0    disconnected eDP-1 0x0       0    153
 props:
     1 EDID:
          flags: immutable blob
          blobs:
          value:
     2 DPMS:
          flags: enum
          enums: On=0 Standby=1 Suspend=2 Off=3
          value: 0
156  155  connected HDMI-A-1 530x300   31   155
 modes:
     name refresh (Hz) hdisp hss hse htot vdisp vss vse vtot)
 1920x1080 60 1920 2008 2052 2200 1080 1084 1089 1125 148500 flags: phsync, pvsync; type: preferred, driver
 1920x1080 60 1920 2008 2052 2200 1080 1084 1089 1125 148352 flags: phsync, pvsync; type: driver
 1920x1080 50 1920 2448 2492 2640 1080 1084 1089 1125 148500 flags: phsync, pvsync; type: driver
 1280x720 60 1280 1390 1430 1650 720 725 730 750 74250 flags: phsync, pvsync; type: driver
 720x576 50 720 732 796 864 576 581 586 625 27000 flags: nhsync, nvsync; type: driver
 720x480 60 720 736 798 858 480 489 495 525 27027 flags: nhsync, nvsync; type: driver
 props:
167  0    disconnected HDMI-A-2 0x0    0    166
 props:
CRTCs:
id   fb   pos  size
71   0    (0,0) (1920x1080)
  60 1920 2008 2052 2200 1080 1084 1089 1125 148500 flags: phsync, pvsync; type: userdef
 props:
     72 PLANE_MASK:
          flags: immutable bitmask
          values: Cluster0=0x1 Cluster1=0x2 Esmart0=0x4 Esmart1=0x8 Smart0=0x10 Smart1=0x20 Cluster2=0x40 Cluster3=0x80 Esmart2=0x100 Esmart3=0x200
          value: 21
     26 GAMMA_LUT:
          flags: blob
          blobs:
          value:
     27 GAMMA_LUT_SIZE:
          flags: immutable range
          values: 0 4294967295
          value: 1024
87   0    (0,0) (0x0)
  0 0 0 0 0 0 0 0 0 0 flags: ; type:
 props:
     88 PLANE_MASK:
          flags: immutable bitmask
          values: Cluster0=0x1 Cluster1=0x2 Esmart0=0x4 Esmart1=0x8 Smart0=0x10 Smart1=0x20 Cluster2=0x40 Cluster3=0x80 Esmart2=0x100 Esmart3=0x200
          value: 34
     26 GAMMA_LUT:
          flags: blob
          blobs:
          value:
     27 GAMMA_LUT_SIZE:
          flags: immutable range
          values: 0 4294967295
          value: 1024
103  0    (0,0) (0x0)
  0 0 0 0 0 0 0 0 0 0 flags: ; type:
 props:
     104 PLANE_MASK:
          flags: immutable bitmask
          values: Cluster0=0x1 Cluster1=0x2 Esmart0=0x4 Esmart1=0x8 Smart0=0x10 Smart1=0x20 Cluster2=0x40 Cluster3=0x80 Esmart2=0x100 Esmart3=0x200
          value: 8
     26 GAMMA_LUT:
          flags: blob
          blobs:
          value:
     27 GAMMA_LUT_SIZE:
          flags: immutable range
          values: 0 4294967295
          value: 1024
Planes:
id   crtc fb   CRTC x,y x,y  gamma size possible crtcs
57   0    0    0,0      0,0  0         0x00000007
 formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16
 props:
     8 type:
          flags: immutable enum
          enums: Overlay=0 Primary=1 Cursor=2
          value: 1
     60 alpha:
          flags: range
          values: 0 65535
          value: 65535
     61 pixel blend mode:
          flags: enum
          enums: None=2 Pre-multiplied=0 Coverage=1
          value: 0
     62 zpos:
          flags: range
          values: 0 7
          value: 0
     63 NAME:
          flags: immutable bitmask
          values: Smart0-win0=0x1
          value: 1
     70 colorkey:
          flags: range
          values: 0 2164260863
          value: 0
73   0    0    0,0      0,0  0         0x00000007
 formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16
 props:
     8 type:
          flags: immutable enum
          enums: Overlay=0 Primary=1 Cursor=2
          value: 1
     76 alpha:
          flags: range
          values: 0 65535
          value: 65535
     77 pixel blend mode:
          flags: enum
          enums: None=2 Pre-multiplied=0 Coverage=1
          value: 0
     78 zpos:
          flags: range
          values: 0 7
          value: 1
     79 NAME:
          flags: immutable bitmask
          values: Smart1-win0=0x2
         value: 2
     86 colorkey:
         flags: range
         values: 0 2164260863
         value: 0
89   0   0    0,0       0,0  0        0x00000007
 formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16 NV12 NV16 NV24 NA12 NA16 NA24 YVYU VYUY
 props:
     8 type:
         flags: immutable enum
         enums: Overlay=0 Primary=1 Cursor=2
         value: 1
     92 alpha:
         flags: range
         values: 0 65535
         value: 65535
     93 pixel blend mode:
         flags: enum
         enums: None=2 Pre-multiplied=0 Coverage=1
         value: 0
     94 zpos:
         flags: range
         values: 0 7
         value: 2
     95 NAME:
         flags: immutable bitmask
         values: Esmart1-win0=0x4
         value: 4
105  0   0    0,0       0,0  0        0x00000007
 formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16 NV12 NV16 NV24 NA12 NA16 NA24 YVYU VYUY
 props:
     8 type:
         flags: immutable enum
         enums: Overlay=0 Primary=1 Cursor=2
         value: 0
     108 alpha:
         flags: range
         values: 0 65535
         value: 65535
     109 pixel blend mode:
         flags: enum
         enums: None=2 Pre-multiplied=0 Coverage=1
         value: 0
     110 zpos:
         flags: range
         values: 0 7
         value: 3
     111 NAME:
         flags: immutable bitmask
         values: Esmart0-win0=0x8
         value: 8
```

Der erste Ausgabeabschnitt Encoders entspricht dem zweiten Abschnitt Connectors. eDP-1 hat ID 154 und Encoder-ID 153. `disconnected` bedeutet, dass der Treiber keine eDP-Verbindung erkannt hat. `possible crtcs` von Encoder 153 ist 2, also BIT(1). Diese bitweise Maske zeigt, dass eDP nur mit VP1 verbunden werden kann.

HDMI-A-1 hat ID 156, Encoder-ID 155 und den Zustand `connected`: Der Treiber erkennt ein angeschlossenes HDMI-Anzeigegerät. `modes` enthält dessen vom Treiber gemeldete Auflösungen. CRTC entspricht einem VP bei VOP 2.0 oder VOP bei VOP 1.0, Planes den Layern. Die Ausgabe enthält mögliche VPs (`possible crtcs`) und Datenformate (`formats`).

2. Farbbalken an der gewünschten Schnittstelle ausgeben, um den DRM-Treiber grundlegend zu prüfen.

```sh
modetest -M rockchip -s 156@71:1920x1080
```

Der Befehl erzeugt etwa folgende SMPTE-Farbbalken auf HDMI-A-1. 156 ist dessen ID, 71 die ID von VP0.

![Originalabbildung: 9.9 modetest verwenden; PDF S. 79](/docs/rockchip-drm-display-driver/assets/en-p79-X475.jpg)

3\. Einzelne DRM-Eigenschaften vorübergehend manuell ändern

Weitere Verwendungsmöglichkeiten zeigt die folgende Hilfe:

![Originalabbildung: 9.9 modetest verwenden; PDF S. 80](/docs/rockchip-drm-display-driver/assets/en-p80-X478.png)

modetest wählt plane, crtc und connector über IDs. Diese lassen sich mit modetest oder folgendem Befehl ermitteln:

```text
cat /sys/kernel/debug/dri/0/state
```

### 9.10 xrandr verwenden

xrandr konfiguriert Anzeigen unter Xserver. Es kann Anzeigeinformationen auslesen und die Ausgabe einstellen.

```text
root@linaro-alip:/# xrandr
Screen 0: minimum 320 x 200, current 1920 x 2048, maximum 8192 x 8192
eDP-1 connected primary 1536x2048+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
  1536x2048 59.99*+
HDMI-1 connected 1920x1080+0+0 (normal left inverted right x axis y axis) 708mm x 398mm
  1920x1080 60.00*+ 50.00 59.94 30.00 24.00 29.97 23.98
  1920x1080i 60.00 50.00 59.94
  1280x1024 60.02
  1440x900 59.90
  1360x768 60.02
  1280x720 60.00 50.00 59.94
  1024x768 60.00
  800x600 60.32
  720x576 50.00
  720x576i 50.00
  720x480 60.00 59.94
  720x480i 60.00 59.94
  640x480 60.00 59.94
DP-1 disconnected (normal left inverted right x axis y axis)
```

Das Werkzeug ist allgemein unter Xserver einsetzbar. Ausführliche Bedienung siehe [Xrandr](https://wiki.archlinux.org/title/Xrandr).

### 9.11 Anzeigeprozess anhalten und fortsetzen

Für die Diagnose soll die Anwendung gelegentlich auf einem festen Bild stehen bleiben. Folgende Befehle pausieren und reaktivieren den Anzeigeprozess.

Android-Prozess Surfaceflinger:

1\. Prozess anhalten

```text
kill -STOP `pgrep surfaceflinger`
```

2\. Prozess fortsetzen

```text
kill -CONT `pgrep surfaceflinger`
```

Linux-Prozess weston:

1\. Prozess anhalten

```text
Kill -STOP `pgrep weston`
```

2\. Prozess fortsetzen

```text
kill -CONT `pgrep weston`
```

Linux-Prozess Xserver:

1\. Prozess anhalten

```text
Kill -STOP `pgrep Xorg`
```

2\. Prozess fortsetzen

```text
kill -CONT `pgrep Xorg`
```

Werden während der Entwicklung VOP-Register vorübergehend mit io verändert, um einen Anzeigeeffekt zu prüfen, zuerst den entsprechenden Userspace-Anzeigehauptprozess anhalten. Andernfalls können dessen Aktualisierungen die lokalen Registeränderungen jederzeit überschreiben.

### 9.12 EDID-Informationen auslesen

Beispiel HDMI:

```text
cat /sys/class/drm/card0-HDMI-A-1/edid > /data/edid.bin
```

### 9.13 HDMI-Status anzeigen

```text
cat /sys/kernel/debug/dw-hdmi/status
```

![Originalabbildung: 9.13 HDMI-Status anzeigen; PDF S. 81](/docs/rockchip-drm-display-driver/assets/en-p81-X484.png)

## 10. Häufige Fragen

### 10.1 VOP POST_BUF_EMPTY

Mögliches Protokoll:

![Originalabbildung: 10.1 VOP POST_BUF_EMPTY; PDF S. 82](/docs/rockchip-drm-display-driver/assets/en-p82-X490.png)

Mögliche Ursachen:

1\. Unzureichende Bandbreite

Bei zu geringer Systembandbreite erhält VOP nicht rechtzeitig Daten und meldet post buf empty. Mögliche Versuche:

(1) DDR testweise auf die höchste Frequenz festsetzen. (2) Die Austastperiode des Bildschirms verlängern, um mehr Datenabrufzeit je Zeile zu erhalten.

2\. IOMMU-Fehler

Auf einen IOMMU-pagefault wie im Bild prüfen. Zunächst einen aktuellen Codestand testen. Besteht das Problem weiter, laut Quelle einen remine-Eintrag mit Protokoll erstellen; die Quellschreibweise bleibt erhalten.

![Originalabbildung: 10.1 VOP POST_BUF_EMPTY; PDF S. 82](/docs/rockchip-drm-display-driver/assets/en-p82-X492.png)

3\. Zu niedrige Logic-Spannung

Eine zu niedrige Logic-Spannung kann VOP-Störungen auslösen. Die Quelle schlägt testweise +100mv vor. Dies ist kein geprüfter ArmSoM-Wert; zuerst BSP- und Hardwaregrenzen prüfen.

4\. Ausrichtungsanforderungen von AFBDC/IFBDC

Bei PX30/RK3326, RK3368, RK3399, RK356X und RK3588 mit nicht auf 16 Pixel ausgerichteter Auflösung kann AFBDC/IFBDC testweise deaktiviert werden. Vorgehen siehe FAQ-DRM-HWC, Kapitel 1.3.1.

### 10.2 Bildwirkung einstellen

Das VOP-Modul BCSH regelt Helligkeit, Kontrast, Sättigung und Farbton. Die Connector-Eigenschaften lassen sich mit modetest konfigurieren. Android besitzt eine eigene Eigenschaftskonfiguration. Standardwert ist 50, N wird jeweils um 1 erhöht.

Vor Android 9.0 folgende Befehle verwenden:

```text
setprop persist.sys.brightness.main val
setprop persist.sys.contrast.main val
setprop persist.sys.saturation.main val
setprop persist.sys.hue.main val
setprop sys.display.timeline N+1
```

Nach Android 9.0 folgende Befehle verwenden:

```text
setprop persist.vendor.brightness.main val
setprop persist.vendor.contrast.main val
setprop persist.vendor.saturation.main val
setprop persist.vendor.hue.main val
setprop vendor.display.timeline N+1
```

Ab Android 11 enthält das SDK einen vollständigen Werkzeugsatz mit Dokumentation zur Bildanpassung. Siehe im Android-SDK:

RKDocs/common/display/Rockchip_Introduction_Display_Adjust_APK_CN.pdf

### 10.3 Bildschirm bleibt dunkel, fehlerhafte Anzeige nach Ruhezustand oder keine Ausgabe

Folgende Punkte genauer prüfen:

1. Ist die Hintergrundbeleuchtung vorhanden?

2. Sind Bildschirmversorgung und Resetsteuerung korrekt?

3. Entsprechen Einschalt- und Ausschaltsequenz den Panelspezifikationen?

### 10.4 Anzeigefunktion für RK3308/RV1106/RV1103 aktivieren

RK3308/RV1106/RV1103 sind auf geringe Ressourcen und kleine Speichergrößen ausgelegt; die Anzeigefunktion ist deshalb standardmäßig deaktiviert. Zum Aktivieren sind folgende Konfigurationen nötig:

1\. U-Boot anpassen

RK3308-Referenzkonfiguration für RGB/MCU in U-Boot: rk3308-display.config:

```text
make rk3308_defconfig rk3308-display.config &&./make.sh
```

RV1106/RV1103-Referenzkonfiguration für RGB/MCU in U-Boot: rv1106-display.config:

```text
make rv1106_defconfig rv1106-display.config &&./make.sh
```

2\. Kernel anpassen

RK3308 VOP unterstützt keine IOMMU. Speicher muss deshalb aus reserviertem CMA zugewiesen werden. Standard-CMA_SIZE ist 16M. Bei fehlgeschlagener Zuweisung CMA_SIZE wie folgt ändern:

```text
@@ -784,7 +786,12 @@ CONFIG_ARCH_SUPPORTS_MEMORY_FAILURE=y
# CONFIG_MEMORY_FAILURE is not set
# CONFIG_TRANSPARENT_HUGEPAGE is not set
# CONFIG_CLEANCACHE is not set
-# CONFIG_CMA is not set
+CONFIG_CMA=y
+# CONFIG_CMA_INACTIVE is not set
+# CONFIG_CMA_DEBUG is not set
+# CONFIG_CMA_DEBUGFS is not set
+# CONFIG_CMA_SYSFS is not set
+CONFIG_CMA_AREAS=7
# CONFIG_ZPOOL is not set
# CONFIG_ZBUD is not set
# CONFIG_ZSMALLOC is not set
@@ -4917,6 +4925,18 @@ CONFIG_DMA_NONCOHERENT_MMAP=y
CONFIG_DMA_COHERENT_POOL=y
CONFIG_DMA_REMAP=y
CONFIG_DMA_DIRECT_REMAP=y
+CONFIG_DMA_CMA=y
+# CONFIG_DMA_PERNUMA_CMA is not set
+
+#
+# Default contiguous memory area size:
+#
+CONFIG_CMA_SIZE_MBYTES=32
+CONFIG_CMA_SIZE_SEL_MBYTES=y
+# CONFIG_CMA_SIZE_SEL_PERCENTAGE is not set
+# CONFIG_CMA_SIZE_SEL_MIN is not set
+# CONFIG_CMA_SIZE_SEL_MAX is not set
+CONFIG_CMA_ALIGNMENT=8
# CONFIG_DMA_API_DEBUG is not set
CONFIG_SGL_ALLOC=y
CONFIG_CPU_RMAP=y
```

RK3308-Kernelreferenz für RGB zu MIPI über Bridgechip RK618: rk3308bs_mipi_display.config:

```text
make ARCH=arm64 rk3308_linux_defconfig rk3308bs_mipi_display.config
```

RV1106/RV1103-Kernelreferenz für RGB/MCU: rv1106-evb.config:

```text
make ARCH=arm rv1106_defconfig rv1106-evb.config
```

### 10.5 IOMMU deaktivieren

Ohne VOP-IOMMU wird über DRM angeforderter Speicher aus CMA zugewiesen. Der Standardumfang beträgt 16M und muss dem Bedarf angepasst werden; andernfalls kann die Speicheranforderung scheitern.

![Originalabbildung: 10.5 IOMMU deaktivieren; PDF S. 84](/docs/rockchip-drm-display-driver/assets/en-p84-X502.png)

### 10.6 Referenzdokumente der Schnittstellen

| Modul | Dokument |
| --- | --- |
| RGB/MCU | Rockchip_Developer_Guide_RGB_MCU_CN.pdf |
| BT656/BT1120 | Rockchip_Developer_Guide_BT656_TX_AND_BT1120_TX_CN.pdf |
| LVDS | Rockchip_Developer_Guide_LVDS_CN.pdf |
| MIPI DSI | Rockchip_Developer_Guide_MIPI_DSI2_CN.pdf |
| eDP | Rockchip_Developer_Guide_eDP_CN.pdf |
| DP | Rockchip_Developer_Guide_DisplayPort_CN.pdf |
| HDMI | Rockchip_Developer_Guide_HDMI_CN.pdf |

### 10.7 Bildrate von RGB-/MCU-Panels berechnen

Gegeben:

```text
htotal = hactive + hback-porch + hfront-porch + hsync-len
vtotal = vactive + vback-porch + vfront-porch + vsync-len
```

N bezeichnet die zum Senden eines Pixels benötigten Zyklen:

| bus_format | Zyklen N je Pixel |
| --- | --- |
| MEDIA_BUS_FMT_RGB888_1X24<br>MEDIA_BUS_FMT_RGB666_1X18<br>MEDIA_BUS_FMT_RGB565_1X16 | 1 |
| MEDIA_BUS_FMT_RGB888_3X8 | 3 |
| MEDIA_BUS_FMT_RGB888_DUMMY_4X8 | 4 |

Damit ergibt sich die Bildrate:

| Schnittstellentyp | Bildratenberechnung |
| --- | --- |
| RGB | fps = dclk / (htotal x vtotal x N) |
| MCU | fps = dclk / (htotal x vtotal x (mcu-pix-total + 1) x N) |

### 10.8 Treiber für einen externen Wandler schreiben

Benötigt ein externer Wandler einen Softwaretreiber, wird sein Connector über die Bridge-Schnittstelle des DRM-Frameworks registriert. Beim RGB2HDMI SII902X dient rockchip_rgb.c als Encoder und sii902x.c als Connector. Siehe die SII902X-Implementierung:

```text
drivers/gpu/drm/bridge/sii902x.c
```

### 10.9 Anzahl der RK3588-DSC-Slices und maximale slice width

RK3588 besitzt 2 DSCs. HDMI0 und DSI0 verwenden DSC0 (DSC_8K) mit 1, 2, 4 oder 8 Slices und Breiten xres / 1, xres / 2, xres / 4 beziehungsweise xres / 8. DSC_8K unterstützt maximal 7680 Breite, daher auch maximal slice_width 7680. HDMI1 und DSI1 verwenden DSC1 (DSC_4K) mit 1 oder 2 Slices und Breiten xres / 1 beziehungsweise xres / 2. Die maximale Breite und slice_width von DSC_4K betragen 4096.

### 10.10 aclk-Anforderungen oberhalb von 4kP60

Plattformen wie RK3588 mit 4KP120, 8KP30 oder 8KP60 benötigen mehr als den standardmäßigen 500M aclk. Im DTS aclk auf 800M setzen. Andernfalls können wegen zu geringer VOP-Leistung horizontale Streifen auftreten. Quellbeispiel:

```text
&vop {
  assigned-clocks = <&cru ACLK_VOP>;
  assigned-clock-rates = <800000000>;
};
```

### 10.11 Spiegelanzeige standardmäßig aktivieren

Abweichende Gehäuseformen und Bildschirmorientierungen können eine standardmäßige Software-Spiegelung erforderlich machen.

Eine standardmäßige Y-Spiegelung ist nicht unterstützt. Standardmäßige X-Spiegelung gibt es nur ab VOP V2.0; siehe die grundlegenden Plattformfunktionen. Konfigurationsbeispiel:

```text
&vp1 {
  xmirror-enable;
};
```

### 10.12 Kleine Auflösungen auf RV1106/RV1103: keine oder fehlerhafte Anzeige

dclk_vop von RV1106/RV1103 kann GPLL oder CPLL verwenden. Die Standardfrequenzen betragen 1188000 KHz beziehungsweise 1000000 KHz. Der CRU erlaubt maximal den DCLK-Teiler 32:

![Originalabbildung: Abschnitt 10.12; PDF S. 86](/docs/rockchip-drm-display-driver/assets/en-p86-X513.png)

Daraus folgen standardmäßige Mindestfrequenzen von 37125 KHz beziehungsweise 31250 KHz. Benötigt das Panel einen kleineren Pixeltakt, kann es dunkel bleiben oder fehlerhaft anzeigen. Für kleinere Auflösungen wie 720x480p60/720x576p60 mit 27000 KHz muss die Frequenz von GPLL oder CPLL verändert werden, um die DCLK-Untergrenze zu senken:

```text
&vop {
  assigned-clocks = <&cru PLL_GPLL>;
  assigned-clock-rates = <594000000>;
};
```

Zu beachten:

RGB-/MCU-Panels unterstützen üblicherweise einen Taktbereich entsprechend MIN/TYP/MAX im

Datenblatt. Liegt der standardmäßige minimale DCLK bereits innerhalb der MAX-Anforderung, GPLL/CPLL möglichst nicht verändern. Beide versorgen meist mehrere Module. Je nach Anwendung prüfen, ob eine Frequenzänderung andere Module neben VOP beeinträchtigt.

## 11. Probleme effizienter eingrenzen

Systematische Analyse und Kommunikation helfen, Fehler in der Entwicklung schneller einzugrenzen und zu beheben. Für Anzeigeprobleme empfiehlt die Quelle:

1. Kernel- und Anwendungsprotokolle auf offensichtliche Fehlermeldungen prüfen.

2. Bei einer Kernelmeldung den entsprechenden Treibercode suchen und nachvollziehen, welche Bedingung sie auslöst.

3. Prüfen, ob das Problem sporadisch oder zuverlässig reproduzierbar ist.

4. Bei HDMI/DP mit mehreren Auflösungen prüfen, ob nur eine oder alle Auflösungen betroffen sind und ob das Problem nur an einem oder an allen Monitoren auftritt.

5. Bei HDMI-/DP-Kompatibilitätsproblemen ein Fremdgerät unter denselben kontrollierten Bedingungen zum Vergleich testen.

6. Bei Videowiedergabe prüfen, ob nur bestimmte Videos oder Anwendungen betroffen sind oder jede Wiedergabe.

7. Fehlt ein Ansatz, klären, ob der Fehler immer bestand oder erst nach einem Code-/Versionsupdate auftrat. Im zweiten Fall durch binäres Eingrenzen und kontrollierte Änderungen die auslösende Version beziehungsweise das Modul bestimmen.

## 12. Referenzdokumente

1. Rockchip_drm_integration_helper-zh.pdf

2. Rockchip_DRM_Panel_Porting_Guide.pdf

3. Rockchip_Developer_Guide_HDMI_CN.pdf

4. RK3588_MIPI_DSI2_Developer_Guide_CN.pdf

5. Rockchip_BT656_TX_AND_BT1120_TX_Developer_Guide_CN.pdf

6. Rockchip RK3568 Datasheet.pdf

7. Rockchip rk fb development guide.pdf

8. Wikipedia zu Direct_Rendering_Manager

9. Linux DRM Developer’s Guide (Entwicklerhandbuch)

{% endraw %}
