---
title: "Rockchip RK628 For-All: vollständige Anleitung zu Anzeige, HDMI IN, Audio und Fehlersuche"
description: "Vollständige RK628D/F/H-For-All-Referenz zu Treiberportierung, DTS, Signalabstimmung, HDMI-Eingang, Audio, Tests und Fehlerbehebung."
translation_key: "053-rockchip-rk628-porting"
slug: "053-rockchip-rk628-porting"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["RK628", "Display", "HDMI", "I2C", "V4L2"]
keywords: "ArmSoM Rockchip RK628 For-All Display HDMI IN V4L2"
excerpt: "Vollständige RK628D/F/H-For-All-Referenz zu Treiberportierung, DTS, Signalabstimmung, HDMI-Eingang, Audio, Tests und Fehlerbehebung."
---

{% raw %}

# Rockchip RK628 For-All: vollständige Anleitung zu Anzeige, HDMI IN, Audio und Fehlersuche

## Anwendbarkeit auf ArmSoM

Dies ist eine Rockchip-Plattformreferenz, kein ArmSoM-Hardwaretestbericht. RK628D/F/H sind externe Bridge-Chips; die Verwendung auf einer bestimmten ArmSoM-Platine hängt von herausgeführten Signalen, Stromversorgung, I2C, GPIO, Interrupts, Takten und dem Ziel-SDK/BSP ab. Die Quelle behandelt getrennt Misc-, Media- und U-Boot-Treiber, unter anderem für RK3399, RK356x, RK3588, RK3576 und RK3562 unter unterschiedlichen Kernelzweigen. Dies begründet keine Unterstützung auf jeder Platine. Prüfen Sie für jedes Szenario die Plattform- und Kernelvoraussetzungen. Es wurde keine Hardwarevalidierung durchgeführt.

Wie ausdrücklich genehmigt, bildet die chinesische V2.7 (122 Seiten) die gemeinsame Grundlage der drei bisherigen Sprachfassungen. Die englische V2.3 (117 Seiten) liefert Vergleichsbelege und passende Originalabbildungen. Inhalte, die in dieser älteren Ausgabe fehlen oder abweichen, werden vollständig aus dem Chinesischen übersetzt, darunter Treiberportierung, Signalanpassung/SSC, GVI-Lane-Swap und Media-Konfiguration. Die chinesische Fassung verwendet chinesische Abbildungen; die englische und russische Fassung verwenden zugeordnete englische Originale mit Quellseitenangaben in den Bildunterschriften. Diese deutsche Fassung übersetzt den vollständigen englischen Artikel und übernimmt dessen Bildadressen. Editierbare Screenshot-Übertragungen folgen den neueren chinesischen Belegen.

> Sicherheit und Quellenwidersprüche: Registerschreibzugriffe, chmod 0666 und setenforce 0 sind Debug-Beispiele der Quelle, keine Produktionsempfehlungen. Widersprüchliche Knotennamen, Signalpfadbeschreibungen und Plattformgeltungsbereiche bleiben erhalten und werden dokumentiert statt durch Vermutungen beseitigt. Die ursprüngliche Nummerierung beginnt bei Kapitel 2, weil das Inhaltsverzeichniskapitel entfällt.

[Redaktionelle Hinweise](/docs/rockchip-rk628-porting/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/)

<!-- source: CN V2.7 p10; unit 0 -->

## 2. Vorwort

<!-- source: CN V2.7 p10; unit 1 -->

RK628 besitzt einen Display-Pfad und einen HDMI-IN-Pfad. In der SDK-Version basiert Display auf DRM und HDMI IN auf V4L2. Unterschiedliche Frameworks oder Kernelversionen benötigen entsprechend angepasste Treiber; die SDK-Version gilt nur für Rockchip-Plattformen. Der For-All-Treiber wurde eingeführt, um andere Plattformen zu unterstützen und die Portierung zu vereinfachen. Er unterstützt derzeit RK628D und RK628F/H. Zur Versionsverwaltung der Treiberpatches siehe die RK628-Treiberversionshinweise im SDK-Patchpaket.

<!-- source: CN V2.7 p10; unit 2 -->

Auch der For-All-Treiber besitzt Display- und HDMI-IN-Pfade. Der Display-Treiber befindet sich unter drivers/misc/rk628/ und unterstützt RGB-/BT1120-/HDMI-Eingang sowie RGB-/BT1120-/LVDS-/GVI-/DSI-/HDMI-Ausgang. Der HDMI-IN-Treiber befindet sich unter drivers/media/i2c/rk628/ und unterstützt HDMI-Eingang sowie CSI-/BT1120-Ausgang. Im Folgenden bezeichnen Misc und Media diese beiden unabhängigen Treiber; jeder kann separat kompiliert und ausgeführt werden.

<!-- source: CN V2.7 p10; unit 3 -->

### 2.1 RK628-Blockdiagramm

<!-- source: CN V2.7 p10; unit 4 -->

![Technische Originalabbildung — EN V2.3, S. 9](/docs/rockchip-rk628-porting/assets/en-p9-X182.png)

*Technische Originalabbildung: EN V2.3, S. 9.*

<!-- source: CN V2.7 p11; unit 5 -->

### 2.2 Typischer RK628-Hardwareentwurf

<!-- source: CN V2.7 p11; unit 6 -->

![Technische Originalabbildung — EN V2.3, S. 9](/docs/rockchip-rk628-porting/assets/en-p9-X184.png)

*Technische Originalabbildung: EN V2.3, S. 9.*

<!-- source: CN V2.7 p11; unit 7 -->

### 2.3 Wichtigste RK628-Spezifikationen

<!-- source: CN V2.7 p11; unit 8 -->

#### 2.3.1 Wichtigste RK628D-Spezifikationen

<!-- source: CN V2.7 p11; unit 9 -->

| Videoeingangsschnittstelle | Typische Auflösung | Typisches Format |
| --- | --- | --- |
| HDMI IN | 4K@30 | YUV420(4K@60) / YUV422 / YUV444 /<br>RGB888 |
| BT1120 IN | 1080P@60 | YUV422 8bit |
| RGB IN | 1080P@60 | RGB888 |
| Videoausgangsschnittstelle | Typische Auflösung | Typisches Format |
| GVI OUT | 4K@60 | RGB888 |
| MIPI CSI | 4K@30 | YUV422 8bit |
| MIPI DSI | 1080P@60 /<br>2.5K@60 | RGB888 |
| LVDS OUT | 720P@60 /<br>1080P@60 | RGB888 |
| BT1120 OUT | 1080P@60 | YUV422 8bit |
| RGB OUT | 1080P@60 | RGB888 |
| HDMI OUT | 1080P@60 | RGB888/YUV444 8bit |

<!-- source: CN V2.7 p12; unit 11 -->

#### 2.3.2 Wichtigste RK628F-Spezifikationen

<!-- source: CN V2.7 p12; unit 12 -->

| Videoeingangsschnittstelle | Typische Auflösung | Typisches Format |
| --- | --- | --- |
| HDMI IN | 4K@60 | RGB888 / YUV422 8bit / YUV422 10bit<br>/ YUV420 8bit (> 4k@30Hz) / YUV420 10bit<br>(> 4k@30Hz) |
| BT1120 IN | 1080P@60 | YUV422 8bit |
| RGB IN | 1080P@60 | RGB888 |
| Videoausgangsschnittstelle | Typische Auflösung | Typisches Format |
| GVI OUT | 4K@60 | RGB888 |
| MIPI CSI | Dual MIPI, 4K@60 | YUV422 8bit |
| MIPI DSI | 1080P@60 /<br>2.5K@60 | RGB888 |
| LVDS OUT | 720P@60 /<br>1080P@60 | RGB888 |
| BT1120 OUT | 1080P@60 | YUV422 8bit |
| RGB OUT | 1080P@60 | RGB888 |
| HDMI OUT | 1080P@60 | RGB888 / YUV444 8bit |

<!-- source: CN V2.7 p12; unit 13 -->

#### 2.3.3 Wichtigste RK628H-Spezifikationen

<!-- source: CN V2.7 p12; unit 14 -->

Im Vergleich zu RK628F besitzt RK628H keine GVI-Schnittstelle.

<!-- source: CN V2.7 p13; unit 15 -->

| Videoeingangsschnittstelle | Typische Auflösung | Typisches Format |
| --- | --- | --- |
| HDMI IN | 4K@60 | RGB888 / YUV422 8bit / YUV422 10bit<br>/ YUV420 8bit (> 4k@30Hz) / YUV420 10bit<br>(> 4k@30Hz) |
| BT1120 IN | 1080P@60 | YUV422 8bit |
| RGB IN | 1080P@60 | RGB888 |
| Videoausgangsschnittstelle | Typische Auflösung | Typisches Format |
| MIPI CSI | Dual MIPI, 4K@60 | YUV422 8bit |
| MIPI DSI | 1080P@60 /<br>2.5K@60 | RGB888 |
| LVDS OUT | 720P@60 /<br>1080P@60 | RGB888 |
| BT1120 OUT | 1080P@60 | YUV422 8bit |
| RGB OUT | 1080P@60 | RGB888 |
| HDMI OUT | 1080P@60 | RGB888 / YUV444 8bit |

<!-- source: CN V2.7 p14; unit 16 -->

### 2.4 Verbesserungen und Optimierungen von RK628F/H gegenüber RK628D

<!-- source: CN V2.7 p14; unit 17 -->

| Funktionsblock | RK628D | RK628F/H |
| --- | --- | --- |
| HDMIRX | Bis 4K@60 YUV420; TMDS CLK 297M | Bis 4K@60 RGB/YUV444; TMDS CLK 594M |
| HDMIRX | Unterstützte Frequenzen sind eingeschränkt; eine bestimmte Auflösung muss bewertet werden und wird möglicherweise nicht unterstützt | Unterstützt beliebige Frequenzen von 27M bis 594M für unterschiedliche Eingangsauflösungen |
| HDMIRX | DVI MODE nicht unterstützt | DVI MODE unterstützt |
| HDMIRX | Kann yuv422-/yuv420-Eingangsvideoformate nicht erkennen | Der Controller erkennt das Eingangsvideoformat |
| HDMIRX | RK628D rxphy kann bei niedriger Amplitude der clk-Lane der Quelle nicht einrasten | Dieses Problem besteht nicht |
| HDMIRX | HDMI RX hat Probleme bei der Bitfehlererkennung | Dieses Problem besteht nicht |
| MIPI<br>CSI | Ein Kanal, 4 Lanes | Zwei Kanäle, 8 Lanes |
| MIPI<br>CSI | Maximal 4k@30 yuv422 8bit | Maximal 4k@60 yuv422 8bit |
| GVI | Einige Panelmodelle bleiben dunkel oder zeigen fehlerhaft an | Die Quelle berichtet bei Tests mehrerer handelsüblicher Panelmodelle von keinen Auffälligkeiten; siehe Ausgangsmodulkonfiguration → GVI-Ausgang → Liste getesteter RK628F-GVI-Modelle |
| GVI | Gemeinsame Taktquelle erforderlich | Gemeinsame Taktquelle nicht erforderlich |
| audio | Kein Audio-mclk; bei Codec-Verwendung muss der Host mclk liefern | Kann mclk liefern |
| audio | HDMI-Hotplug kann I2S-FIFO-Überlauf und falsche Kanalumschaltung verursachen | Behebt eine inkonsistente Kanalreihenfolge nach FIFO-Überlauf |
| csc | Einige Ein-/Ausgangskombinationen benötigen Farbraumkonvertierung oder Auf-/Abtastung des Bildformats; geringfügige Farbdetailabweichungen sind möglich | Dieses Problem besteht nicht |
| hdmi tx | Gemeinsame Taktquelle erforderlich | rgb2hdmi benötigt eine gemeinsame Taktquelle; hdmi2hdmi nicht |
| Mehrere Anzeigen | Gleichzeitige Ausgabe über rgb/bt1120 und hdmi tx mit gleicher Auflösung | Gleichzeitige Ausgabe über rgb/bt1120, hdmi tx und gvi/dsi/csi/lvds mit gleicher Auflösung |
| MCU | Kein integrierter MCU | Integrierter MCU |

<!-- source: CN V2.7 p15; unit 18 -->

## 3. Anleitung zur Treiberportierung

<!-- source: CN V2.7 p15; unit 19 -->

Der For-All-Treiber besitzt Display- und HDMI-IN-Pfade. Der Display-U-Boot-Treiber befindet sich unter drivers/video/drm/rk628/, der Kerneltreiber unter drivers/misc/rk628/. Unterstützt werden RGB-/BT1120-/HDMI-Eingang und RGB-/BT1120-/LVDS-/GVI-/DSI-/HDMI-Ausgang. Der HDMI-IN-Treiber befindet sich unter drivers/media/i2c/rk628/ und unterstützt HDMI-Eingang sowie CSI-/DSI-/BT1120-Ausgang.

<!-- source: CN V2.7 p15; unit 20 -->

Portieren Sie nach Bedarf die folgenden Treiber getrennt:

<!-- source: CN V2.7 p15; unit 21 -->

### 3.1 Display-Pfad

<!-- source: CN V2.7 p15; unit 22 -->

#### 3.1.1 U-Boot (drivers/video/drm/rk628)

<!-- source: CN V2.7 p15; unit 23 -->

Auf Rockchip-U-Boot-Plattformen wurden für die folgenden RK628F/H-Anzeigepfade Treiber entwickelt, um ein schnelles U-Boot-Startlogo zu unterstützen.

<!-- source: CN V2.7 p15; unit 24 -->

| IC | Anzeigepfad | Unterstützung |
| --- | --- | --- |
| RK628F/H | HDMI2(Dual)DSI | Unterstützt |
| RK628F/H | HDMI2(Dual)LVDS | Unterstützt |
| RK628F | HDMI2GVI | Unterstützt |
| RK628F/H | HDMI2BT1120/RGB | Unterstützt |
| RK628F/H | BT1120/RGB2(Dual)DSI | Unterstützt |
| RK628F/H | BT1120/RGB2(Dual)LVDS | Unterstützt |
| RK628F | BT1120/RGB2GVI | Unterstützt |

<!-- source: CN V2.7 p15; unit 25 -->

Hinweis: Der U-Boot-Startlogotreiber unterstützt RK628D nicht, weil dessen HDMIRX nicht mit beliebigen Frequenzen arbeiten kann.

<!-- source: CN V2.7 p15; unit 26 -->

Wenn Sie den RK628-Misc-Treiber erstmals hinzufügen oder unter drivers/video/drm noch kein RK628-Treiber vorhanden ist, kopieren Sie den U-Boot-Misc-RK628-Quellcode direkt nach drivers/video/drm und ändern Sie folgende Quelldateien:

<!-- source: CN V2.7 p15; unit 27 -->

```text
drivers/video/drm/rockchip_display.c
drivers/video/drm/Kconfig
drivers/video/drm/Makefile

configs/rk3568_defconfig //以rk3568平台为例
```

<!-- source: CN V2.7 p15; unit 28 -->

Siehe folgenden Patch:

<!-- source: CN V2.7 p15; unit 29 -->

```text
diff --git a/drivers/video/drm/rockchip_display.c b/drivers/video/drm/rockchip_display.c

index a1cb40a000e..041b8bdd84f 100644
--- a/drivers/video/drm/rockchip_display.c
+++ b/drivers/video/drm/rockchip_display.c
@@ -918,6 +918,23 @@ static int display_enable(struct display_state *state)
      if (state->enabled_at_spl == false)
           rockchip_connector_enable(state);

+#ifdef CONFIG_DRM_ROCKCHIP_RK628

+     /*
+     * trigger .probe helper of U_BOOT_DRIVER(rk628) in ./rk628/rk628.c
+     */
+     struct udevice * dev;
+     int phandle, ret;
+
+     phandle = ofnode_read_u32_default(state->node, "bridge", -1);
+     if (phandle < 0)
+          printf("%s failed to find bridge phandle\n",
ofnode_get_name(state->node));
+
+     ret = uclass_get_device_by_phandle_id(UCLASS_I2C_GENERIC, phandle, &dev);

+     if (ret && ret != -ENOENT)
+          printf("%s:%d failed to get rk628 device ret:%d\n", __func__,
__LINE__, ret);
+
+#endif
+
      if (crtc_state->soft_te)
           crtc_funcs->apply_soft_te(state);
diff --git a/drivers/video/drm/Kconfig b/drivers/video/drm/Kconfig
index ddc65818cba..c5073b9926b 100644
--- a/drivers/video/drm/Kconfig

+++ b/drivers/video/drm/Kconfig
@@ -191,6 +191,13 @@ config DRM_ROCKCHIP_RK618
       Choose this option to enable support for Rockchip RK618 display
       bridge chips driver. say Y to enable its driver.

+config DRM_ROCKCHIP_RK628
+     bool "Rockchip RK628 display bridge driver"
+     depends on DRM_ROCKCHIP
+     help
+      Choose this option to enable support for Rockchip RK628 display
+      bridge chips driver. say Y to enable its driver.
+
diff --git a/drivers/video/drm/Makefile b/drivers/video/drm/Makefile
index ea4219d9cf6..f11a8ff4885 100644

--- a/drivers/video/drm/Makefile
+++ b/drivers/video/drm/Makefile
@@ -36,6 +36,7 @@ obj-$(CONFIG_DRM_ROCKCHIP_RGB) += rockchip_rgb.o
 obj-$(CONFIG_DRM_ROCKCHIP_PANEL) += rockchip_panel.o
 obj-$(CONFIG_DRM_ROHM_BU18XL82) += rohm-bu18tl82.o rohm-bu18rl82.o
 obj-$(CONFIG_DRM_ROCKCHIP_RK618) += rk618.o rk618_lvds.o rk618_dsi.o
+obj-$(CONFIG_DRM_ROCKCHIP_RK628) += rk628/
 obj-$(CONFIG_DRM_ROCKCHIP_RK1000) += rk1000.o rk1000_tve.o
 obj-$(CONFIG_DRM_ROCKCHIP_SAMSUNG_MIPI_DCPHY) += samsung_mipi_dcphy.o
 obj-$(CONFIG_DRM_SII902X) += sii902x.o
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index acd1fb18169..94f1050eb4f 100644
--- a/configs/rk3568_defconfig

+++ b/configs/rk3568_defconfig
@@ -224,3 +224,4 @@ CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
 CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_DRM_ROCKCHIP_RK628=y
```

<!-- source: CN V2.7 p16; unit 30 -->

<!-- source: CN V2.7 p16; unit 31 -->

<!-- source: CN V2.7 p16; unit 32 -->

<!-- source: CN V2.7 p17; unit 33 -->

<!-- source: CN V2.7 p17; unit 34 -->

Ergänzen Sie abschließend folgende DTS-Konfiguration, um das U-Boot-Startlogo zu aktivieren:

<!-- source: CN V2.7 p17; unit 35 -->

Für RGB-Eingang:

<!-- source: CN V2.7 p17; unit 36 -->

```text
 &route_rgb {
      status = "okay";

+
+     bridge = <&i2c2_rk628>;
 };
```

<!-- source: CN V2.7 p17; unit 37 -->

Für HDMI-Eingang:

<!-- source: CN V2.7 p17; unit 38 -->

```text
&route_hdmi {
      status = "okay";
+

+     bridge = <&i2c2_rk628>;
      force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
      force-output;
      force_timing{
```

<!-- source: CN V2.7 p17; unit 39 -->

Damit der Übergang vom U-Boot-Logo zum Kernel-Logo nicht flackert, stellen Sie sicher, dass der Kernel den Patch mit folgenden Commit-Informationen enthält:

<!-- source: CN V2.7 p17; unit 40 -->

```text
misc: rk628: add support uboot logo

Type: Function

Redmine ID: #496880 #491750
Associated modifications: NULL
Test: NULL

Change-Id: I311e2c9682f835b377ea9082e1d3a88688167172
Signed-off-by: Guochun Huang <hero.huang@rock-chips.com>
```

<!-- source: CN V2.7 p17; unit 41 -->

#### 3.1.2 Kernel (drivers/misc/rk628)

<!-- source: CN V2.7 p17; unit 42 -->

Wenn Sie auf einer Rockchip-Kernelplattform RK628 Misc erstmals hinzufügen oder unter drivers/misc kein RK628-Treiber vorhanden ist, kopieren Sie den Kernel-Misc-RK628-Quellcode direkt nach drivers/misc. Ändern Sie drivers/misc/Kconfig, drivers/misc/Makefile und arch/arm64/configs/rockchip_defconfig, um RK628 in die Kompilierung aufzunehmen. Siehe folgenden Patch:

<!-- source: CN V2.7 p18; unit 43 -->

```text
diff --git a/drivers/misc/Kconfig b/drivers/misc/Kconfig
index 276c7c4fef15..8481b9613bc9 100644
--- a/drivers/misc/Kconfig

+++ b/drivers/misc/Kconfig
@@ -5,6 +5,8 @@

 menu "Misc devices"

+source "drivers/misc/rk628/Kconfig"
+
 config RK803
      tristate "RK803"
      default n
diff --git a/drivers/misc/Makefile b/drivers/misc/Makefile
index b296e760fd47..14642c54a2bc 100644

--- a/drivers/misc/Makefile
+++ b/drivers/misc/Makefile
@@ -3,6 +3,7 @@
 # Makefile for misc devices that really don't fit anywhere else.
 #

+obj-y                 += rk628/
 obj-$(CONFIG_RK803)   += rk803.o
 obj-y                 += rockchip/
 obj-$(CONFIG_LT7911D_FB_NOTIFIER) += lt7911d-fb-notifier.o
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index 28340b4bdfae..dbb7d9e55b62 100644

--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -294,6 +294,8 @@ CONFIG_BLK_DEV_LOOP_MIN_COUNT=16
 CONFIG_BLK_DEV_RAM=y
 CONFIG_BLK_DEV_RAM_SIZE=8192
 CONFIG_BLK_DEV_NVME=y
+CONFIG_RK628_MISC=y
+CONFIG_RK628_MISC_HDMITX=y
 CONFIG_LT7911D_FB_NOTIFIER=y
 CONFIG_SRAM=y
 CONFIG_UID_SYS_STATS=y
@@ -557,7 +559,6 @@ CONFIG_ROCKCHIP_THERMAL=y

 CONFIG_WATCHDOG=y
 CONFIG_DW_WATCHDOG=y
 CONFIG_MFD_RK618=y
-CONFIG_MFD_RK628=y
 CONFIG_MFD_RK630_I2C=y
 CONFIG_MFD_RK806_I2C=y
 CONFIG_MFD_RK806_SPI=y
@@ -640,7 +641,6 @@ CONFIG_ROCKCHIP_LVDS=y
 CONFIG_ROCKCHIP_RGB=y
 CONFIG_ROCKCHIP_DW_HDCP2=y
 CONFIG_DRM_ROCKCHIP_RK618=y
-CONFIG_DRM_ROCKCHIP_RK628=y
CONFIG_DRM_PANEL_SIMPLE=y
CONFIG_DRM_PANEL_MAXIM_MAX96752F=y
CONFIG_DRM_PANEL_MAXIM_MAX96772=y
```

<!-- source: CN V2.7 p18; unit 44 -->

<!-- source: CN V2.7 p18; unit 45 -->

<!-- source: CN V2.7 p19; unit 46 -->

<!-- source: CN V2.7 p19; unit 47 -->

Wichtig: CONFIG_MFD_RK628 und CONFIG_DRM_ROCKCHIP_RK628 wählen ältere RK628-Treiber aus und müssen aus rockchip_defconfig entfernt werden.

<!-- source: CN V2.7 p19; unit 48 -->

Misc-Treiber werden standardmäßig kompiliert; das DTS legt fest, welcher Treiber ausgeführt wird.

<!-- source: CN V2.7 p19; unit 49 -->

### 3.2 HDMI-IN-Pfad (drivers/media/i2c/rk628)

<!-- source: CN V2.7 p19; unit 50 -->

Verwenden Sie für Kernel vor 5.10 das Patchpaket rk628_for-all und für Kernel 5.10 kernel_5.10_rk628_media_patch. Kopieren Sie den Media-RK628-Treiber nach drivers/media/i2c/rk628/ und ändern Sie drivers/media/i2c/Kconfig, drivers/media/i2c/Makefile sowie arch/arm64/configs/rockchip_defconfig, damit RK628 kompiliert wird. Siehe folgenden Patch:

<!-- source: CN V2.7 p19; unit 51 -->

```text
diff --git a/drivers/media/i2c/Kconfig b/drivers/media/i2c/Kconfig
index f3273756c612..609bb5e3db07 100644
--- a/drivers/media/i2c/Kconfig

+++ b/drivers/media/i2c/Kconfig
@@ -414,6 +414,8 @@ config VIDEO_OTP_EEPROM
      help
       This driver supports OTP load from eeprom.

+source "drivers/media/i2c/rk628/Kconfig"
+
 config VIDEO_SAA7110
      tristate "Philips SAA7110 video decoder"
      depends on VIDEO_V4L2 && I2C
diff --git a/drivers/media/i2c/Makefile b/drivers/media/i2c/Makefile
index 26edd6f7590e..d6f4128b19a5 100644

--- a/drivers/media/i2c/Makefile
+++ b/drivers/media/i2c/Makefile
@@ -141,6 +141,7 @@ obj-$(CONFIG_VIDEO_ML86V7667) += ml86v7667.o
 obj-$(CONFIG_VIDEO_OV2659) += ov2659.o
 obj-$(CONFIG_VIDEO_TC358743) += tc358743.o
 obj-$(CONFIG_VIDEO_TC35874X) += tc35874x.o
+obj-$(CONFIG_VIDEO_RK628) += rk628/
 obj-$(CONFIG_VIDEO_AR0230) += ar0230.o
 obj-$(CONFIG_VIDEO_GC02M2) += gc02m2.o
 obj-$(CONFIG_VIDEO_GC08A3) += gc08a3.o
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index 95ad81b12a69..c66f67ecd0c2 100644

--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -567,6 +567,8 @@ CONFIG_VIDEO_ROCKCHIP_ISPP=y
 CONFIG_VIDEO_ROCKCHIP_HDMIRX=y
 CONFIG_VIDEO_LT6911UXC=y
 CONFIG_VIDEO_LT7911D=y
+CONFIG_VIDEO_RK628_CSI=y
+CONFIG_VIDEO_RK628_BT1120=y
 CONFIG_VIDEO_TC35874X=y
 CONFIG_VIDEO_GC0312=y
 CONFIG_VIDEO_GC2145=y
```

<!-- source: CN V2.7 p19; unit 52 -->

<!-- source: CN V2.7 p20; unit 53 -->

<!-- source: CN V2.7 p20; unit 54 -->

Media-Treiber werden standardmäßig kompiliert; das DTS legt fest, welcher Treiber ausgeführt wird.

<!-- source: CN V2.7 p20; unit 55 -->

## 4. I2C-Kommunikation zwischen SoC und RK628

<!-- source: CN V2.7 p20; unit 56 -->

Der SoC kommuniziert über I2C mit RK628. Die typische 7-Bit-Adresse des RK628 lautet 0x50. Wenn mehrere RK628-Geräte denselben I2C-Bus verwenden, ändern Sie ihre I2C-Adressen wie folgt mithilfe der RK628-GPIOs:

<!-- source: CN V2.7 p20; unit 57 -->

![Technische Originalabbildung — EN V2.3, S. 13](/docs/rockchip-rk628-porting/assets/en-p13-X201.png)

*Technische Originalabbildung: EN V2.3, S. 13.*

Bildtext: Die I2C-Adresse umfasst 7 Bits. Die oberen vier kennzeichnen das Gerät und sind auf 4'b1010 gesetzt; die unteren drei bilden die Geräteadresse. GPIOs ermöglichen die Programmierung der Slave-Adresse für unterschiedliche Szenarien. Die typische Adresse lautet 7'b1010000.

| Adressbit | Pad-Name | GPIO-Einstellung |
| --- | --- | --- |
| cfg_slvadr[2] | IO_GPIO0a1 | GPIO0A_OE[1]=1’b1 |
| cfg_slvadr[1] | IO_GPIO0a0 | GPIO0A_OE[0]=1’b1 |
| cfg_slvadr[0] | IO_GPIO3b3 | GPIO3B_OE[2]=1’b1 |

<!-- source: CN V2.7 p20; unit 58 -->

Beispielsweise die Slave-Adressen 0x50 und 0x51:

<!-- source: CN V2.7 p20; unit 59 -->

![Technische Originalabbildung — EN V2.3, S. 13](/docs/rockchip-rk628-porting/assets/en-p13-X202.png)

*Technische Originalabbildung: EN V2.3, S. 13.*

<!-- source: CN V2.7 p20; unit 60 -->

![Technische Originalabbildung — EN V2.3, S. 13](/docs/rockchip-rk628-porting/assets/en-p13-X203.png)

*Technische Originalabbildung: EN V2.3, S. 13.*

| I2C SEL | I2C ADDR |
| --- | --- |
| 0 | 7'b1010000 (0x50) |
| 1 | 7'b1010001 (0x51) |

<!-- source: CN V2.7 p20; unit 61 -->

Halten Sie GPIO0a0 und GPIO0a1 auf Low. Bei GPIO3b3 auf High lautet die Slave-Adresse 0x51 (7'b1010001), bei GPIO3b3 auf Low dagegen 0x50 (7'b1010000).

<!-- source: CN V2.7 p21; unit 62 -->

## 5. Misc

<!-- source: CN V2.7 p21; unit 63 -->

### 5.1 Einführung in den MISC-Treiber

<!-- source: CN V2.7 p21; unit 64 -->

Der RK628-Misc-Treiber implementiert den RK628-Display-Pfad zur Konvertierung von Anzeigeprotokollen. Eingänge sind RGB, BT1120 oder HDMI; Ausgänge LVDS, GVI, DSI, RGB, BT1120 oder HDMI.

<!-- source: CN V2.7 p21; unit 65 -->

#### 5.1.1 Treiberportierung

<!-- source: CN V2.7 p21; unit 66 -->

Siehe Anleitung zur Treiberportierung → Display-Pfad.

<!-- source: CN V2.7 p21; unit 67 -->

#### 5.1.2 Verzeichnisstruktur des U-Boot-Treibers

<!-- source: CN V2.7 p21; unit 68 -->

```text
drivers/video/drm/rk628/
├── Makefile

├── panel.c
├── panel.h
├── rk628.c
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_dsi.c
├── rk628_dsi.h
├── rk628_gvi.c
├── rk628_gvi.h
├── rk628.h

├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_hdmitx.h
├── rk628_lvds.c
├── rk628_lvds.h
├── rk628_post_process.c
├── rk628_post_process.h
├── rk628_rgb.c
└── rk628_rgb.h
```

<!-- source: CN V2.7 p21; unit 69 -->

#### 5.1.3 Verzeichnisstruktur des Kerneltreibers

<!-- source: CN V2.7 p21; unit 70 -->

```text
drivers/misc/rk628/
├── Kconfig
├── Makefile

├── panel.c
├── panel.h
├── rk628.c
├── rk628_combrxphy.c
├── rk628_combrxphy.h
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_config.c

├── rk628_config.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_csi.c
├── rk628_csi.h
├── rk628_dsi.c
├── rk628_dsi.h
├── rk628_efuse.c
├── rk628_efuse.h
├── rk628_gpio.h
├── rk628_grf.h
├── rk628_gvi.c

├── rk628_gvi.h
├── rk628.h
├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_hdmitx.c
├── rk628_hdmitx.h
├── rk628_lvds.c
├── rk628_lvds.h
├── rk628_pinctrl.c
├── rk628_pinctrl.h
├── rk628_post_process.c
├── rk628_post_process.h
├── rk628_rgb.c

├── rk628_rgb.h
```

<!-- source: CN V2.7 p22; unit 71 -->

<!-- source: CN V2.7 p22; unit 72 -->

#### 5.1.4 Überblick über die DTS-Konfiguration

<!-- source: CN V2.7 p22; unit 73 -->

Beispiel: RGB → DSI.

<!-- source: CN V2.7 p22; unit 74 -->

```text
&i2c2 {
   clock-frequency = <400000>;

   status = "okay";

   i2c2_rk628: rk628@50 {
      compatible = "rockchip,rk628";
      reg = <0x50>;
      interrupt-parent = <&gpio0>;
      interrupts = <20 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio2 RK_PA2 GPIO_ACTIVE_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_reset>;
      status = "okay";
   };

};

&pinctrl {
   rk628 {
      rk628_reset: rk628-reset {
         rockchip,pins = <2 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
      };

   };
};

&i2c2_rk628 {
   /* soc_24M optional */
   pinctrl-names = "default";
   pinctrl-0 = <&rk628_reset &refclk_pins>;
   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clocks = <&pmucru CLK_WIFI>;
   clock-names = "soc_24M";


   panel-backlight = <&backlight>;
   panel-power-supply = <&vcc3v3_lcd0_n>;
   panel-enable-gpios = <&gpio2 RK_PC6 GPIO_ACTIVE_HIGH>;

   panel-reset-delay-ms = <10>;
   panel-enable-delay-ms = <10>;
   panel-prepare-delay-ms = <60>;
   panel-unprepare-delay-ms = <10>;
   panel-disable-delay-ms = <60>;
   panel-init-delay-ms = <60>;

   rk628-rgb-in;
   rk628-dsi-out {

      dsi,eotp;
      dsi,video-mode;
      dsi,format = "rgb888";
      dsi,lanes = <4>;
      status = "okay";

      rk628-panel {
         panel-init-sequence = [
            05 78 01 11
            05 78 01 29
         ];


         panel-exit-sequence = [
            05 00 01 28
            05 00 01 10
         ];
      };
   };

   display-timings {
      src-timing {
         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;

         hsync-len = <44>;
         hback-porch = <148>;
         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;
         hsync-active = <1>;

         vsync-active = <1>;
         de-active = <0>;
         pixelclk-active = <0>;
      };

      dst-timing {
         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;
         hsync-len = <44>;
         hback-porch = <148>;

         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;
         hsync-active = <1>;
         vsync-active = <1>;
         de-active = <0>;
         pixelclk-active = <0>;
      };
   };
};
```

<!-- source: CN V2.7 p23; unit 75 -->

<!-- source: CN V2.7 p24; unit 76 -->

<!-- source: CN V2.7 p24; unit 77 -->

### 5.2 Konfiguration des Kerntreibers

<!-- source: CN V2.7 p24; unit 78 -->

#### 5.2.1 RK628-Knotenkonfiguration

<!-- source: CN V2.7 p24; unit 79 -->

Der SoC kommuniziert über I2C mit RK628. Fügen Sie am Beispiel RK3568 einen RK628-Knoten (i2c2_rk628: rk628@50) unter dem DTS-I2C-Knoten i2c2 hinzu:

<!-- source: CN V2.7 p24; unit 80 -->

```text
&i2c2 {
   clock-frequency = <400000>;

   status = "okay";

   i2c2_rk628: rk628@50 {
      compatible = "rockchip,rk628";
      reg = <0x50>;
      enable-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio2 RK_PA2 GPIO_ACTIVE_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_reset>;
      status = "okay";
   };
};


&pinctrl {
   rk628 {
      rk628_reset: rk628-reset {
         rockchip,pins = <2 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
      };
   };
};
```

<!-- source: CN V2.7 p25; unit 81 -->

<!-- source: CN V2.7 p25; unit 82 -->

Eigenschaften des RK628-Knotens:

<!-- source: CN V2.7 p25; unit 83 -->

| Eigenschaft | Beschreibung | Optionswert |
| --- | --- | --- |
| compatible | compatible | RK628-Misc-compatible auf "rockchip,rk628" setzen |
| reg | RK628-I2C-Slave-Adresse | 0x50/0x51, entsprechend der Hardware |
| enable-gpios | RK628-Enable-GPIO-Referenz | Entsprechend der Hardware konfigurieren |
| reset-gpios | RK628-Reset-GPIO-Referenz | Entsprechend der Hardware konfigurieren |
| pinctrl-names | RK628-Reset-Pinmux auf GPIO setzen | Entsprechend der Hardware konfigurieren |
| pinctrl-0 | RK628-Reset-Pinmux auf GPIO setzen | Entsprechend der Hardware konfigurieren |

<!-- source: CN V2.7 p25; unit 84 -->

#### 5.2.2 24-MHz-Betriebstakt

<!-- source: CN V2.7 p25; unit 85 -->

Der 24-MHz-Betriebstakt des RK628 kann von einem externen 24M-Quarz oder einem 24-MHz-CLK-Pin des SoC stammen. Bei Verwendung eines externen Quarzes kann die folgende Konfiguration entfallen.

<!-- source: CN V2.7 p25; unit 86 -->

Beachten Sie, dass die HDMI-/GVI-OUT-Pfade des RK628D und der RGB-→-HDMI-Pfad des RK628F/H den 24-MHz-CLK-Ausgang des SoC als RK628-Betriebstakt benötigen, damit die Takte dieselbe Quelle verwenden. Ein externer 24M-Quarz kann in diesen Fällen Darstellungsprobleme verursachen. RK628F/H verbessert die Behandlung gemeinsamer Taktquellen: Der von HDMI RX erkannte TMDS CLK wird als Referenz der CRU PLL verwendet. Daher benötigen HDMI-IN-Pfade den 24-MHz-CLK des SoC nicht als Referenz.

<!-- source: CN V2.7 p25; unit 87 -->

Beim RK3568 können mehrere Pins 24 MHz ausgeben, darunter REF_CLKOUT (clk_wifi / gpio0_a0), CAM_CLKOUT1 (clk_cam1_out / gpio4_b0) und ETH_REFCLK_25M_M0 (clk_mac1_out / gpio3_b0). Andere Rockchip-Plattformen behandelt der Abschnitt zum RK628-24M-Quarztakt von einem anderen SoC. Nachfolgend wird der erste Pin verwendet.

<!-- source: CN V2.7 p25; unit 88 -->

1\. Referenzieren Sie folgende Konfiguration im RK628-DTS-Knoten:

<!-- source: CN V2.7 p25; unit 89 -->

```text
&i2c2_rk628 {
   /* soc_24M optional */
   pinctrl-names = "default";

   pinctrl-0 = <&rk628_reset &refclk_pins>;
   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clocks = <&pmucru CLK_WIFI>;
   clock-names = "soc_24M";
   ......
};
```

<!-- source: CN V2.7 p26; unit 90 -->

2\. Die folgende Konfiguration ist bereits in rk3568-pinctrl.dtsi enthalten:

<!-- source: CN V2.7 p26; unit 91 -->

```text
&pinctrl {
   ......
   refclk {

      /omit-if-no-ref/
      refclk_pins: refclk-pins {
         rockchip,pins =
           /* refclk_ou */
           <0 RK_PA0 1 &pcfg_pull_none>;
      };
   };
   ......
};
```

<!-- source: CN V2.7 p26; unit 92 -->

24-MHz-CLK-Eigenschaften:

<!-- source: CN V2.7 p26; unit 93 -->

| Eigenschaft | Beschreibung | Optionswert |
| --- | --- | --- |
| pinctrl-names | refclk-Pinmux einstellen | Entsprechend der Hardware konfigurieren. Dies überschreibt die obigen RK628-Eigenschaften; daher auch die Referenz rk628_reset aufnehmen |
| pinctrl-0 | refclk-Pinmux einstellen | Entsprechend der Hardware konfigurieren. Dies überschreibt die obigen RK628-Eigenschaften; daher auch die Referenz rk628_reset aufnehmen |
| assigned-clocks | RK628 zugewiesene Taktreferenz | Entsprechend der Hardware konfigurieren |
| assigned-clock-rates | RK628 zugewiesene Taktfrequenz (Hz) | <24000000> |
| clocks | Liste referenzierter Takt-Handles | Entsprechend der Hardware konfigurieren |
| clock-names | Dem Takt zugewiesener Name | "soc_24M" |

<!-- source: CN V2.7 p26; unit 94 -->

#### 5.2.3 Auswahl der Ein- und Ausgangsmodule

<!-- source: CN V2.7 p26; unit 95 -->

Konfigurieren Sie im RK628-DTS-Knoten die benötigten Ein-/Ausgangsmoduleigenschaften (boolesch) oder Knoten. Konfigurieren Sie die jeweiligen Funktionsparameter im betreffenden Modulknoten:

<!-- source: CN V2.7 p26; unit 96 -->

```text
&i2c2_rk628 {
   ......

   rk628-rgb-in;
   rk628-dsi-out {
      ......
   };
   ......
};
```

<!-- source: CN V2.7 p26; unit 97 -->

Für RGB → DSI setzen Sie die Eigenschaft „rk628-rgb-in;“ zur Auswahl des RGB-Eingangs und den Knoten „rk628-dsi-out“ zur Auswahl des DSI-Ausgangs. Aktuelle Misc-Eingangsmodule sind RGB IN, BT1120 IN und HDMI IN; Ausgangsmodule sind LVDS, GVI, DSI und HDMI. Einzelheiten finden Sie unter Eingangsmodulkonfiguration und Ausgangsmodulkonfiguration.

<!-- source: CN V2.7 p27; unit 98 -->

#### 5.2.4 Panelkonfiguration

<!-- source: CN V2.7 p27; unit 99 -->

Konfigurieren Sie im RK628-DTS-Knoten Hintergrundbeleuchtung, Versorgung, Reset-Pin, Einschalttiming und Anzeigetiming gemäß der Panelspezifikation. Für einen HDMITX-Pfad ist diese Konfiguration nicht erforderlich:

<!-- source: CN V2.7 p27; unit 100 -->

```text
&i2c2_rk628 {
   ......

   panel-backlight = <&backlight>;
   panel-power-supply = <&vcc3v3_lcd0_n>;
   panel-enable-gpios = <&gpio2 RK_PC6 GPIO_ACTIVE_HIGH>;

   panel-reset-delay-ms = <10>;
   panel-enable-delay-ms = <10>;
   panel-prepare-delay-ms = <60>;
   panel-unprepare-delay-ms = <10>;
   panel-disable-delay-ms = <60>;
   panel-init-delay-ms = <60>;
   ......
   display-timings {
      src-timing {

         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;
         hsync-len = <44>;
         hback-porch = <148>;
         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;
         hsync-active = <1>;
         vsync-active = <1>;
         de-active = <0>;

         pixelclk-active = <0>;
      };

      dst-timing {
         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;
         hsync-len = <44>;
         hback-porch = <148>;
         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;

         hsync-active = <1>;
         vsync-active = <1>;
         de-active = <0>;
         pixelclk-active = <0>;
      };
   };
   ......
};
```

<!-- source: CN V2.7 p28; unit 101 -->

Paneleigenschaften:

<!-- source: CN V2.7 p28; unit 102 -->

| Eigenschaft | Beschreibung | Optionswert |
| --- | --- | --- |
| panel-enable-gpios | Panel-Enable-GPIO-Referenz [optional] | Entsprechend der Hardware konfigurieren |
| panel-reset-gpios | Panel-Reset-GPIO-Referenz [optional] | Entsprechend der Hardware konfigurieren |
| panel-backlight | Panel-Hintergrundbeleuchtung [optional] | Entsprechend der Hardware konfigurieren |
| panel-reset-delay-ms | Einschalttiming des Panels | Siehe Panelspezifikation |
| panel-enable-delay-ms | Einschalttiming des Panels | Siehe Panelspezifikation |
| panel-prepare-delay-ms | Einschalttiming des Panels | Siehe Panelspezifikation |
| panel-unprepare-delay-ms | Einschalttiming des Panels | Siehe Panelspezifikation |
| panel-disable-delay-ms | Einschalttiming des Panels | Siehe Panelspezifikation |
| panel-init-delay-ms | Einschalttiming des Panels | Siehe Panelspezifikation |
| src-timing | Anzeigetiming-Knoten von SoC zu RK628 | Gegenüber dst-timing horizontal und vertikal getrennt skalieren |
| dst-timing | Anzeigetiming-Knoten des Panels | Siehe Panelspezifikation |
| clock-frequency | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| hactive | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| vactive | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| hfront-porch | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| hback-porch | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| hsync-len | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| vfront-porch | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| vback-porch | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| vsync-len | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| hsync-active | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| vsync-active | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| de-active | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |
| pixelclk-active | Anzeigetiming | Siehe Panelspezifikation und tatsächliche Scaler-Konfiguration |

<!-- source: CN V2.7 p28; unit 103 -->

Beim Skalieren zwischen unterschiedlichen Ein- und Ausgangsauflösungen tragen Sie das Eingangstiming in src-timing und das Ausgangstiming in dst-timing ein. Der aktive Anzeigebereich und die Austastabschnitte müssen dasselbe Skalierungsverhältnis verwenden:

<!-- source: CN V2.7 p29; unit 104 -->

```text
src: hactive / dst: hactive = src: hblanking / dst: hblanking
src: vactive / dst: vactive = src: vblanking / dst: vblanking
hblanking = hfront-porch + hback-porch + hsync-len

vblanking = vfront-porch + vback-porch + vsync-len
```

<!-- source: CN V2.7 p29; unit 105 -->

Auch die Bildrate muss vor und nach der Skalierung unverändert bleiben.

<!-- source: CN V2.7 p29; unit 106 -->

```text
src: clock-frequency / (htotal * vtotal) = dst: clock-frequency / (htotal *
vtotal)
htotal = hactive + hfront-porch + hback-porch + hsync-len

vtotal = vactive + vfront-porch + vback-porch + vsync-len
```

<!-- source: CN V2.7 p29; unit 107 -->

Bei identischer Ein- und Ausgangsauflösung verwenden Sie dasselbe Zieltiming in src-timing und dst-timing.

<!-- source: CN V2.7 p29; unit 108 -->

Für zwei DSI-Panels gleicher Auflösung oder zwei LVDS-Panels gleicher Auflösung multiplizieren Sie clock-frequency, hactive, hfront-porch, hback-porch und hsync-len sowohl in src-timing als auch in dst-timing gegenüber der ursprünglichen Einzelpanelkonfiguration mit 2.

<!-- source: CN V2.7 p29; unit 109 -->

#### 5.2.5 Unterschiedliche Anzeigepfadkombinationen

<!-- source: CN V2.7 p29; unit 110 -->

Beachten Sie die folgenden DTS-Beispiele. Einzelheiten zu jedem Pfad stehen unter den derzeit durch DTS unterstützten Kombinationen.

<!-- source: CN V2.7 p29; unit 111 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2bt1120-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-dual-ddr4-v10.dts

arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2gvi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-dual-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2gvi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2hdmi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p29; unit 112 -->

#### 5.2.6 Anpassung des Ausgangssignals

<!-- source: CN V2.7 p29; unit 113 -->

##### 5.2.6.1 Signalanpassung für GVI / LVDS / MIPI TX

<!-- source: CN V2.7 p29; unit 114 -->

1\. Die comb_tx-Register für Spannung und Preemphasis steuern unabhängig voneinander 10 Lane-Paare (tx0 ~ tx9 in der Registerkonfiguration). Die Schnittstellenzuordnung lautet:

<!-- source: CN V2.7 p30; unit 116 -->

| COMB_TX | GVI | LVDS / MIPI |
| --- | --- | --- |
| TX0 P/N | GVI_TX0 P/N | L/M0_TX0 P/N |
| TX1 P/N | GVI_TX1 P/N | L/M0_TX1 P/N |
| TX2 P/N | / | L/M0_TXCLK P/N |
| TX3 P/N | GVI_TX2 P/N | L/M0_TX2 P/N |
| TX4 P/N | GVI_TX3 P/N | L/M0_TX3 P/N |
| TX5 P/N | GVI_TX4 P/N | L/M1_TX0 P/N |
| TX6 P/N | GVI_TX5 P/N | L/M1_TX1 P/N |
| TX7 P/N | / | L/M1_TXCLK P/N |
| TX8 P/N | GVI_TX6 P/N | L/M1_TX2 P/N |
| TX9 P/N | GVI_TX7 P/N | L/M1_TX3 P/N |

<!-- source: CN V2.7 p30; unit 117 -->

2\. Testen Sie Signalanpassungen durch direktes Schreiben der Register. Diese Einstellungen bleiben nach einem Neustart nicht erhalten; ändern Sie für eine dauerhafte Konfiguration den folgenden Patch.

<!-- source: CN V2.7 p30; unit 118 -->

```text
# 1. 电压缩放 N=0(75%), 1/2(100%), 3(125%) (通常无需调节)
# echo 0x90004 $val > /d/rk628/2-0050/registers/combtxphy

# $val:
#   tx0[Bit1:0], tx1[Bit3:2], tx2[Bit5:4], tx3[Bit7:6], tx4[Bit9:8]
#   tx5[Bit17:16], tx6[Bit19:18], tx7[Bit21:20], tx8[Bit23:22], tx9[Bit25:24]
# 以 1(100%) 为例:
echo 0x90004 0x01550155 > /d/rk628/2-0050/registers/combtxphy

# 2. 电压调节 N=0~7
# echo 0x90008 $val > /d/rk628/2-0050/registers/combtxphy
# $val:
#   tx0[Bit2:0], tx1[Bit5:3], tx2[Bit8:6], tx3[Bit11:9], tx4[Bit14:12]
#   tx5[Bit18:16], tx6[Bit21:19], tx7[Bit24:22], tx8[Bit27:25], tx9[Bit30:28]
# 以 3 档为例:
echo 0x90008 0x36db36db > /d/rk628/2-0050/registers/combtxphy


# 3. 预加重调节 N=0~9
# echo 0x9000c $val > /d/rk628/2-0050/registers/combtxphy
# $val: tx0[Bit3:0], tx1[Bit7:4], tx2[Bit11:8], tx3[Bit15:12], tx4[Bit19:16]
# echo 0x90010 $val > /d/rk628/2-0050/registers/combtxphy
# $val: tx5[Bit3:0], tx6[Bit7:4], tx7[Bit11:8], tx8[Bit15:12], tx9[Bit19:16]
# 以 5 档为例:
echo 0x9000c 0x55555 > /d/rk628/2-0050/registers/combtxphy
echo 0x90010 0x55555 > /d/rk628/2-0050/registers/combtxphy
```

<!-- source: CN V2.7 p30; unit 119 -->

3\. Patch zur Ausgangssignalanpassung am Beispiel GVI TX. Beachten Sie die obigen Einstellungen.

<!-- source: CN V2.7 p30; unit 120 -->

```text
diff --git a/drivers/misc/rk628/rk628_combtxphy.c b/drivers/misc/rk628/rk628_combtxphy.c

index 3387d8bd73b9..70d7a5422a35 100644
--- a/drivers/misc/rk628/rk628_combtxphy.c
+++ b/drivers/misc/rk628/rk628_combtxphy.c
@@ -139,6 +139,14 @@ static void rk628_combtxphy_gvi_power_on(struct rk628
*rk628)
      usleep_range(100, 200);

      rk628_i2c_update_bits(rk628, COMBTXPHY_CON0,
                      SW_TX_IDLE_MASK, 0);
+
+     // amplitude scale
+     rk628_i2c_write(rk628, COMBTXPHY_CON1, 0x01550155);
+     // amplitude level
+     rk628_i2c_write(rk628, COMBTXPHY_CON2, 0x36db36db);
+     // emphasis level
+     rk628_i2c_write(rk628, COMBTXPHY_CON3, 0x00055555);
+     rk628_i2c_write(rk628, COMBTXPHY_CON4, 0x00055555);
 }


 void rk628_combtxphy_power_on(struct rk628 *rk628)
```

<!-- source: CN V2.7 p31; unit 121 -->

<!-- source: CN V2.7 p31; unit 122 -->

##### 5.2.6.2 HDMI-TX-Signalanpassung

<!-- source: CN V2.7 p31; unit 123 -->

1\. Testen Sie Signalanpassungen durch direktes Schreiben der Register. Diese Einstellungen bleiben nach einem Neustart nicht erhalten; ändern Sie für dauerhafte Einstellungen den folgenden Patch.

<!-- source: CN V2.7 p31; unit 124 -->

```text
# 1. 驱动强度调节
# echo 0x70388 $val > /d/rk628/2-0050/registers/hdmi

# $val: clk_driver_strength[Bit7:4], data_driver_strength[Bit3:0]
#      范围（强度从低到高）：0x0  ~ 0xF
# 以 0x8 为例:
echo 0x70388 0x88 > /d/rk628/2-0050/registers/hdmi

# 2. 预加重调节
# echo 0x7038c $val > /d/rk628/2-0050/registers/hdmi
# $val: pre_emphasis_strength[Bit6:4]
#      范围（强度从低到高）：0x0  ~ 0x7
#     clk_pre_driver_strength[Bit3:2], data_pre_driver_strength[Bit1:0]
#      范围（强度从低到高）：0x0  ~ 0x3
# 以 pre_emphasis_strength = 0x3, clk/data_pre_driver_strength = 0x3 为例:

echo 0x7038c 0x3f > /d/rk628/2-0050/registers/hdmi
```

<!-- source: CN V2.7 p31; unit 125 -->

2\. Patch zur HDMI-Ausgangssignalanpassung. Dieses Beispiel unterteilt (74.25M, 165M] in (74.25M, 148.5M] und (148.5M, 165M].

<!-- source: CN V2.7 p31; unit 127 -->

{ obere Frequenzbandgrenze, Preemphasis, Treiberstärke }: siehe die obigen Einstellungen.

<!-- source: CN V2.7 p32; unit 128 -->

```text
diff --git a/drivers/misc/rk628/rk628_hdmitx.c b/drivers/misc/rk628/rk628_hdmitx.c
index f28b78a6b525..2120cf504ebe 100644

--- a/drivers/misc/rk628/rk628_hdmitx.c
+++ b/drivers/misc/rk628/rk628_hdmitx.c
@@ -231,6 +231,7 @@ static void rk628_hdmi_sys_power(struct rk628_hdmi *hdmi,
bool enable)
 static struct rk628_hdmi_phy_config rk628_hdmi_phy_config[] = {
      /* pixelclk pre-emp vlev */
      { 74250000, 0x3f, 0x88 },
+     { 148500000, 0x3f, 0x88 },
      { 165000000, 0x3f, 0x88 },
      { ~0UL,  0x00, 0x00 }
 };
```

<!-- source: CN V2.7 p32; unit 129 -->

##### 5.2.6.3 SSC (Spreizspektrum)

<!-- source: CN V2.7 p32; unit 130 -->

1\. Wenden Sie globales Spreizspektrum auf CPLL an, um in einem GVI-TX-Szenario eine Spreizspektrumausgabe zu erzeugen.

<!-- source: CN V2.7 p32; unit 131 -->

```text
# echo 0xc000c $((val | 0xffff0000)) > /d/rk628/2-0050/registers/cru
# $val:
#   ssmod_spread[Bit12:8](Spread amplitude / 0.1%)

#   ssmod_divval[Bit7:4](Divider required to set the modulation frequency)
#   参数说明⻅下方描述
# 例 ssmod_spread = 3, ssmod_divval = 6 (推荐值):
echo 0xc000c 0xffff0360 > /d/rk628/2-0050/registers/cru
```

<!-- source: CN V2.7 p32; unit 132 -->

(1) ssmod_spread [Bit12:8]: Modulationstiefe. Sie sollte im Allgemeinen 5000 ppm nicht überschreiten. Da reale Umgebungen komplex sind, haben Messungen Vorrang: Der gemessene Wert darf 0.3% nicht überschreiten; empfohlen ist die Einstellung 0.3%, also `spread = 3`.

<!-- source: CN V2.7 p32; unit 133 -->

(2) ssmod_divval [Bit7:4]: Modulationsfrequenz; beschreibt, wie schnell sich die Frequenz ändert. Die Formel lautet:

`f_mod = f_CLKSSCG / (128 × divval)`; `f_CLKSSCG = f_PFD = f_REF / refdiv`.

<!-- source: CN V2.7 p32; unit 134 -->

Dabei ist f_mod die Modulationsfrequenz, die 30–33 kHz betragen sollte; f_REF ist der Referenz- beziehungsweise Quarztakt. refdiv ist standardmäßig 1. Empfohlen wird divval = 6, wodurch f_mod = 31.25 kHz entsteht.

<!-- source: CN V2.7 p32; unit 135 -->

2\. SSC-Patch am Beispiel GVI TX. Siehe die obigen Einstellungen.

<!-- source: CN V2.7 p32; unit 136 -->

```text
diff --git a/drivers/misc/rk628/rk628_combtxphy.c b/drivers/misc/rk628/rk628_combtxphy.c

index 3387d8bd73b9..70d7a5422a35 100644
--- a/drivers/misc/rk628/rk628_combtxphy.c
+++ b/drivers/misc/rk628/rk628_combtxphy.c
@@ -139,6 +139,9 @@ static void rk628_combtxphy_gvi_power_on(struct rk628 *rk628)
      usleep_range(100, 200);
      rk628_i2c_update_bits(rk628, COMBTXPHY_CON0,
                      SW_TX_IDLE_MASK, 0);
+
+     // ssmod
+     rk628_i2c_write(rk628, CRU_CPLL_CON3, 0xffff0360);
 }
void rk628_combtxphy_power_on(struct rk628 *rk628)
```

<!-- source: CN V2.7 p33; unit 137 -->

<!-- source: CN V2.7 p33; unit 138 -->

### 5.3 Eingangsmodulkonfiguration

<!-- source: CN V2.7 p33; unit 139 -->

#### 5.3.1 RGB-Eingang

<!-- source: CN V2.7 p33; unit 140 -->

##### 5.3.1.1 Konfiguration des RGB-Eingangs

<!-- source: CN V2.7 p33; unit 141 -->

1\. Ergänzen Sie im RK628-DTS-Knoten die boolesche Eigenschaft „rk628-rgb-in;“:

<!-- source: CN V2.7 p33; unit 142 -->

```text
&i2c2_rk628 {
   ......

   rk628-rgb-in;
   ......
};
```

<!-- source: CN V2.7 p33; unit 143 -->

RGB IN / RGB OUT / BT1120 IN / BT1120 OUT teilen sich Pins; diese vier Funktionen können daher nicht gleichzeitig verwendet werden.

<!-- source: CN V2.7 p33; unit 144 -->

2\. Konfigurieren Sie die RGB-Ausgabe des SoC. Beim RK3568 verwendet die RGB-Ausgabe DRM; RK628 wird als virtuelles Panel dargestellt:

<!-- source: CN V2.7 p33; unit 145 -->

```text
/ {
   panel@0 {
      compatible = "simple-panel";


      disp_timings3: display-timings {
         native-mode = <&rgb2dsi_timing>;
         rgb2dsi_timing: timing0 {
           clock-frequency = <148500000>;
           hactive = <1920>;
           vactive = <1080>;
           hfront-porch = <88>;
           hsync-len = <44>;
           hback-porch = <148>;
           vfront-porch = <4>;
           vsync-len = <5>;
           vback-porch = <36>;

           hsync-active = <1>;
           vsync-active = <1>;
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
&route_rgb {
   status = "okay";


   /* for u-boot logo display */
   bridge = <&i2c2_rk628>;
};

&rgb_in_vp2 {
   status = "okay";
};

&rgb {
   status = "okay";


   ports {
      port@1 {
         reg = <1>;

         rgb_out_panel: endpoint {
           remote-endpoint = <&panel_in_rgb>;
         };
      };
   };c
};
```

<!-- source: CN V2.7 p34; unit 146 -->

<!-- source: CN V2.7 p34; unit 147 -->

Das Timing in „panel@0/display-timings/timing0“ muss mit „&i2c2_rk628/display-timings/src-timing“ übereinstimmen.

<!-- source: CN V2.7 p34; unit 148 -->

#### 5.3.2 BT1120-Eingang

<!-- source: CN V2.7 p34; unit 149 -->

##### 5.3.2.1 Konfiguration des BT1120-Eingangs

<!-- source: CN V2.7 p34; unit 150 -->

Folgen Sie der RGB-Eingangskonfiguration und ersetzen Sie im RK628-DTS-Knoten die boolesche Eigenschaft „rk628-rgb-in;“ durch „rk628-bt1120-in;“:

<!-- source: CN V2.7 p34; unit 151 -->

```text
&i2c2_rk628 {
   ......

   rk628-bt1120-in;
   // bt1120-dual-edge;
   // bt1120-yc-swap;
   // bt1120-uv-swap;
   ......
};
```

<!-- source: CN V2.7 p34; unit 152 -->

Ergänzen Sie für BT1120 mit beiden Taktflanken die boolesche Eigenschaft „bt1120-dual-edge;“ im RK628-Knoten.

<!-- source: CN V2.7 p34; unit 153 -->

Die Eigenschaften „bt1120-yc-swap“ und „bt1120-uv-swap“ ändern, wie RK628 die BT1120-Signalreihenfolge auf dem Kabel interpretiert. Probieren Sie diese Eigenschaften aus, wenn die Bildgeometrie korrekt, die Farben aber falsch sind.

<!-- source: CN V2.7 p34; unit 154 -->

RGB IN / RGB OUT / BT1120 IN / BT1120 OUT teilen sich Pins und können daher nicht gleichzeitig verwendet werden.

<!-- source: CN V2.7 p35; unit 155 -->

#### 5.3.3 HDMI-Eingang

<!-- source: CN V2.7 p35; unit 156 -->

##### 5.3.3.1 Konfiguration des HDMI-Eingangs

<!-- source: CN V2.7 p35; unit 157 -->

Für den HDMI-Eingang gibt es zwei Verbindungstypen: direkte Verbindung zum SoC oder Verbindung über ein HDMI-Kabel.

<!-- source: CN V2.7 p35; unit 158 -->

##### 5.3.3.2 Direkte SoC-Verbindung

<!-- source: CN V2.7 p35; unit 159 -->

Konfigurieren Sie den RK628-DTS-Knoten wie folgt:

<!-- source: CN V2.7 p35; unit 160 -->

```text
&i2c2_rk628 {
   ......
   rk628-hdmi-in;

   // src-mode-4k-yuv420;
   ......
};
```

<!-- source: CN V2.7 p35; unit 161 -->

Eine direkte SoC-Verbindung erfordert, dass die HDMI-Quelle standardmäßig ausgibt. RK628 benötigt daher keinen IO-Pin zur Hotplug-Erkennung der Quelle, und Auflösungswechsel werden nicht unterstützt. In diesem Modus fragt der Treiber zyklisch ab, ob ein HDMI-Eingangssignal anliegt.

<!-- source: CN V2.7 p35; unit 162 -->

Gibt die Quelle 4K YUV420 aus (force-bus-format = MEDIA_BUS_FMT_UYYVYY8_0_5X24 und force_timing legt 4K fest), ergänzen Sie unter RK628 die boolesche Eigenschaft „src-mode-4k-yuv420“. HDMIRX kann nämlich nicht vorab feststellen, ob die Quelle YUV420 ausgibt.

<!-- source: CN V2.7 p35; unit 163 -->

Die HDMI-Quelle des SoC auf eine bestimmte Auflösung festlegen:

<!-- source: CN V2.7 p35; unit 164 -->

Konfigurieren Sie beim RK3568 HDMI als erzwungene Ausgabe und legen Sie Quelltiming und bus-format fest:

<!-- source: CN V2.7 p35; unit 165 -->

```text
#include <dt-bindings/display/media-bus-format.h>

&hdmi {

   status = "okay";
   force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
   force-output;
   force_timing{
      clock-frequency = <594000000>;
      hactive = <3840>;
      vactive = <2160>;
      hback-porch = <296>;
      hfront-porch = <176>;
      vback-porch = <72>;
      vfront-porch = <8>;
      hsync-len = <88>;
      vsync-len = <10>;

      hsync-active = <1>;
      vsync-active = <1>;
      de-active = <0>;
      pixelclk-active = <0>;
   };
};

&hdmi_in_vp0 {
   status = "okay";
};


&hdmi_in_vp1 {
   status = "disabled";
};

&route_hdmi {
   status = "okay";

   /* for u-boot logo display */
   bridge = <&i2c2_rk628>;
   force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
   force-output;
   force_timing{

      clock-frequency = <594000000>;
      hactive = <3840>;
      vactive = <2160>;
      hback-porch = <296>;
      hfront-porch = <176>;
      vback-porch = <72>;
      vfront-porch = <8>;
      hsync-len = <88>;
      vsync-len = <10>;
      hsync-active = <1>;
      vsync-active = <1>;
      de-active = <0>;
      pixelclk-active = <0>;

   };
};
```

<!-- source: CN V2.7 p36; unit 166 -->

<!-- source: CN V2.7 p36; unit 167 -->

Aktivieren Sie „&route_hdmi“, damit der HDMIRX-Pfad das Kernel-Startlogo anzeigen kann. Seine Werte „force-output“, „force-bus-format“ und „force_timing“ müssen mit dem Knoten „hdmi“ übereinstimmen.

<!-- source: CN V2.7 p36; unit 168 -->

Binden Sie beim Konfigurieren von force-bus-format `<dt-bindings/display/media-bus-format.h>` im DTS ein. Dieser Header definiert die Anzeigedatenformate.

<!-- source: CN V2.7 p36; unit 169 -->

Patch für erzwungene HDMI-Ausgabe auf dem SoC

<!-- source: CN V2.7 p36; unit 170 -->

Auf Rockchip-SoCs erfordert die erzwungene HDMI-Ausgabe mit festgelegter Auflösung den entsprechenden folgenden Patch. Vergleichen Sie ihn mit dem Quellcode, um festzustellen, ob er bereits angewendet wurde:

<!-- source: CN V2.7 p37; unit 171 -->

| Patchliste | Commit-Nachricht | Patchbeschreibung |
| --- | --- | --- |
| 0190-drm-bridge-dw-hdmi-qp-Support-hdmi-force-output-kernel-5-10.patch | drm/bridge: dw-hdmi-qp:<br>Support hdmi force<br>output | Anwenden, falls im HDMI-TX-Treiber von Rockchip-Kernel 5.10 nicht enthalten |
| 0190-drm-bridge-synopsys-Support-hdmi-force-output-kernel-5-10.patch | drm/bridge: synopsys:<br>Support hdmi force<br>output | Anwenden, falls im HDMI-TX-Treiber von Rockchip-Kernel 5.10 nicht enthalten |
| 0190-drm-bridge-synopsys-Support-hdmi-force-output-kernel-4-19.patch | drm/bridge: synopsys:<br>Support hdmi force<br>output | Anwenden, falls im HDMI-TX-Treiber von Rockchip-Kernel 4.19 nicht enthalten |
| 0190-drm-bridge-synopsys-Support-hdmi-force-output.patch | drm/bridge: synopsys:<br>Support hdmi force<br>output | Anwenden, falls im HDMI-TX-Treiber von Rockchip-Kernel 4.4 nicht enthalten |
| 0189-drm-bridge-synopsys-dw-hdmi-Support-force-logo-displ.patch | drm/bridge: synopsys:<br>dw-hdmi: Support force<br>logo display | Anwenden, falls im HDMI-TX-Treiber von Rockchip-Kernel 4.4 nicht enthalten |

<!-- source: CN V2.7 p37; unit 172 -->

##### 5.3.3.3 Verbindung über HDMI-Kabel

<!-- source: CN V2.7 p37; unit 173 -->

Konfigurieren Sie den RK628-DTS-Knoten wie folgt:

<!-- source: CN V2.7 p37; unit 174 -->

```text
&i2c2_rk628 {
   ......
   interrupt-parent = <&gpio0>;

   interrupts = <20 IRQ_TYPE_LEVEL_HIGH>;
   plugin-det-gpios = <&gpio2 RK_PA4 GPIO_ACTIVE_LOW>;
   // hpd-output-inverted;
   rk628-hdmi-in;
   ......
};
```

<!-- source: CN V2.7 p37; unit 175 -->

Bei einem HDMI-Kabel erkennt RK628 das Hotplug der Quelle über IO und muss Änderungen der Auflösung und des Farbformats unterstützen. Konfigurieren Sie „plugin-det-gpios“, „interrupt-parent“ und „interrupts“. Dieser Hotplug-Pin erkennt die HDMI-Quelle aus Sicht des RK628, nicht RK628 aus Sicht der HDMI-Seite; normalerweise müssen beide Enden die Gegenseite erkennen.

<!-- source: CN V2.7 p37; unit 176 -->

Die boolesche Eigenschaft „hpd-output-inverted“ invertiert die obige Hotplug-Erkennungs-IO-Konfiguration. Aktivieren Sie sie, wenn die Schaltung den HPD-Ausgangspegel invertiert. Häufig ermöglichen auch GPIO_ACTIVE_LOW / GPIO_ACTIVE_HIGH eine softwareseitige Invertierung.

<!-- source: CN V2.7 p37; unit 177 -->

Um die HDMIRX-Auflösung im Kabelmodus zu ändern, setzen Sie src-timing im Abschnitt Panelkonfiguration auf die gewünschte Auflösung.

<!-- source: CN V2.7 p38; unit 178 -->

##### 5.3.3.4 Audiokonfiguration

<!-- source: CN V2.7 p38; unit 179 -->

Bei HDMI als Eingang gibt RK628 Audio als Master über I2S aus. DTS-Soundkartenkonfiguration:

<!-- source: CN V2.7 p38; unit 180 -->

```text
rk628_dc: rk628-dc {
   compatible = "rockchip,dummy-codec";
   #sound-dai-cells = <0>;

};

&i2s0 {
   rockchip,capture-only;
   status = "okay";
};

/ {
   hdmiin-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";
      simple-audio-card,name = "rockchip,hdmiin";

      simple-audio-card,bitclock-master = <&dailink0_master>;
      simple-audio-card,frame-master = <&dailink0_master>;
      status = "okay";
      simple-audio-card,cpu {
         sound-dai = <&i2s0>;
      };
      dailink0_master: simple-audio-card,codec {
         sound-dai = <&rk628_dc>;
      };
   };
};
```

<!-- source: CN V2.7 p38; unit 181 -->

Arbeitet das I2S des SoC als Slave, wartet sein Treiber, wenn kein Takt vorhanden ist. Übermäßiges Warten kann Android zum Absturz bringen. Der folgende Patch ändert die Zeitüberschreitung:

<!-- source: CN V2.7 p38; unit 182 -->

```text
diff --git a/sound/soc/rockchip/rockchip_i2s.c b/sound/soc/rockchip/rockchip_i2s.c

index 9bc29fdd13c5..230c350c6765
--- a/sound/soc/rockchip/rockchip_i2s.c
+++ b/sound/soc/rockchip/rockchip_i2s.c
@@ -468,6 +468,9 @@ static int rockchip_i2s_trigger(struct snd_pcm_substream
*substream,
           ret = -EINVAL;
           break;
      }
+     if(substream->stream == SNDRV_PCM_STREAM_CAPTURE) {
+          substream->wait_time = msecs_to_jiffies(100);
+     }

      return ret;

 }
diff --git a/sound/soc/rockchip/rockchip_i2s_tdm.c b/sound/soc/rockchip/rockchip_i2s_tdm.c
index b0c4ce01e2be..0602df42c309
--- a/sound/soc/rockchip/rockchip_i2s_tdm.c
+++ b/sound/soc/rockchip/rockchip_i2s_tdm.c
@@ -1776,6 +1776,9 @@ static int rockchip_i2s_tdm_trigger(struct

snd_pcm_substream *substream,
           ret = -EINVAL;
           break;
      }
+     if(substream->stream == SNDRV_PCM_STREAM_CAPTURE) {
+          substream->wait_time = msecs_to_jiffies(100);
+     }

      return ret;
 }
```

<!-- source: CN V2.7 p39; unit 183 -->

<!-- source: CN V2.7 p39; unit 184 -->

### 5.4 Ausgangsmodulkonfiguration

<!-- source: CN V2.7 p39; unit 185 -->

#### 5.4.1 RGB-Ausgang

<!-- source: CN V2.7 p39; unit 186 -->

##### 5.4.1.1 Konfiguration des RGB-Ausgangs

<!-- source: CN V2.7 p39; unit 187 -->

Ergänzen Sie im RK628-DTS-Knoten die boolesche Eigenschaft „rk628-rgb-out;“:

<!-- source: CN V2.7 p39; unit 188 -->

```text
&i2c2_rk628 {
   ......
   rk628-rgb-out;

   ......
};
```

<!-- source: CN V2.7 p39; unit 189 -->

RGB IN / RGB OUT / BT1120 IN / BT1120 OUT teilen sich Pins; diese Funktionen können daher nicht gleichzeitig verwendet werden.

<!-- source: CN V2.7 p39; unit 190 -->

#### 5.4.2 BT1120-Ausgang

<!-- source: CN V2.7 p39; unit 191 -->

##### 5.4.2.1 Konfiguration des BT1120-Ausgangs

<!-- source: CN V2.7 p39; unit 192 -->

Ergänzen Sie im RK628-DTS-Knoten die boolesche Eigenschaft „rk628-bt1120-out;“:

<!-- source: CN V2.7 p39; unit 193 -->

```text
&i2c2_rk628 {
   ......
   rk628-bt1120-out;

   // bt1120-dual-edge;
   ......
};
```

<!-- source: CN V2.7 p39; unit 194 -->

Ergänzen Sie für BT1120 mit beiden Taktflanken „bt1120-dual-edge;“. RGB IN / RGB OUT / BT1120 IN / BT1120 OUT teilen sich Pins und können nicht gleichzeitig verwendet werden.

<!-- source: CN V2.7 p40; unit 195 -->

#### 5.4.3 DSI-Ausgang

<!-- source: CN V2.7 p40; unit 196 -->

##### 5.4.3.1 Konfiguration des DSI-Ausgangs

<!-- source: CN V2.7 p40; unit 197 -->

Ergänzen Sie unter dem RK628-DTS-Knoten einen Knoten „rk628-dsi-out“:

<!-- source: CN V2.7 p40; unit 198 -->

```text
&i2c2_rk628 {
   ......
   rk628-dsi-out {

      // rockchip,lane-mbps = <1100>;
      // rockchip,dual-channel;
      dsi,eotp;
      dsi,video-mode;
      // dsi,clk-non-continuous;
      dsi,format = "rgb888";
      dsi,lanes = <4>;
      status = "okay";

      rk628-panel {
         panel-init-sequence = [
           ......

           05 78 01 11
           05 78 01 29
         ];

         panel-exit-sequence = [
           05 00 01 28
           05 00 01 10
         ];
      };
   };
   ......
};
```

<!-- source: CN V2.7 p40; unit 199 -->

Eigenschaften von „rk628-dsi-out“:

<!-- source: CN V2.7 p41; unit 200 -->

| Eigenschaft | Beschreibung | Optionswert |
| --- | --- | --- |
| rockchip,lane-mbps | Festgelegte MIPI-Datenbandbreite [optional] |  |
| rockchip,dual-channel | Einzel-/Dual-MIPI [optional] | Standardmäßig Einzel-MIPI; Hinzufügen der Eigenschaft wählt Dual-MIPI |
| dsi,eotp | EOT-Paket [optional] |  |
| dsi,video-mode | Video-/Befehlsmodus [optional] | Standardmäßig Befehlsmodus; Hinzufügen der Eigenschaft wählt Videomodus |
| dsi,clk-non-continuous | Kontinuierlicher/nicht kontinuierlicher Takt [optional] | Standardmäßig kontinuierlicher Takt; Hinzufügen der Eigenschaft wählt nicht kontinuierlichen Takt |
| dsi,format | DSI-Datenformat | "rgb888" / "rgb666" / "rgb666-packed"<br>/ "rgb565" |
| dsi,lanes | DSI-Lanes | Bei Dual-MIPI die Lane-Anzahl wie bei Einzel-MIPI konfigurieren |
| panel-init-sequence | Panelinitialisierungssequenz | Spalte 1: Datentyp; Spalte 2: mdelays; Spalte 3: payload_lenth jedes Befehls; übrige Spalten: Befehlsnutzdaten |
| panel-exit-sequence | Panel-Abschaltsequenz | Wie oben |

<!-- source: CN V2.7 p41; unit 201 -->

Gängige Datentypen

<!-- source: CN V2.7 p41; unit 202 -->

| Datentyp | Beschreibung | Paketgröße |
| --- | --- | --- |
| 0x03 | Generisches kurzes Schreiben, keine Parameter | kurz |
| 0x13 | Generisches kurzes Schreiben, 1 Parameter | kurz |
| 0x23 | Generisches kurzes Schreiben, 2 Parameter | kurz |
| 0x29 | Generisches langes Schreiben | lang |
| 0x05 | DCS-Kurzschreiben, keine Parameter | kurz |
| 0x15 | DCS-Kurzschreiben, 1 Parameter | kurz |

<!-- source: CN V2.7 p41; unit 203 -->

##### 5.4.3.2 Anpassung des Ausgangssignals

<!-- source: CN V2.7 p41; unit 204 -->

Siehe Konfiguration des Kerntreibers → Anpassung des Ausgangssignals → Signalanpassung für GVI / LVDS / MIPI TX.

<!-- source: CN V2.7 p42; unit 205 -->

#### 5.4.4 LVDS-Ausgang

<!-- source: CN V2.7 p42; unit 206 -->

##### 5.4.4.1 Konfiguration des LVDS-Ausgangs

<!-- source: CN V2.7 p42; unit 207 -->

Ergänzen Sie unter dem RK628-DTS-Knoten einen Knoten „rk628-lvds-out“:

<!-- source: CN V2.7 p42; unit 208 -->

```text
&i2c2_rk628 {
   ......
   rk628-lvds {

      bus-format = <MEDIA_BUS_FMT_RGB888_1X7X4_SPWG>;
      link-type = "single_link";
      status = "okay";
   };
   ......
};
```

<!-- source: CN V2.7 p42; unit 209 -->

Eigenschaften von „rk628-lvds-out“:

<!-- source: CN V2.7 p42; unit 210 -->

| Eigenschaft | Beschreibung | Optionswert |
| --- | --- | --- |
| bus-format | Busformat | <MEDIA_BUS_FMT_RGB666_1X7X3_SPWG> /<br><MEDIA_BUS_FMT_RGB888_1X7X4_SPWG> /<br><MEDIA_BUS_FMT_RGB888_1X7X4_JEIDA> |
| link-type | Verbindungstyp | "single_link": ein Kanal<br>"dual_link_odd_even_pixels": zwei Kanäle; links/rechts übertragen ungerade/gerade Pixel<br>"dual_link_even_odd_pixels": zwei Kanäle; links/rechts übertragen gerade/ungerade Pixel<br>"dual_link_left_right_pixels": zwei Kanäle; linkes/rechtes Panel<br>"dual_link_right_left_pixels": zwei Kanäle; rechtes/linkes Panel |

<!-- source: CN V2.7 p42; unit 211 -->

##### 5.4.4.2 Anpassung des Ausgangssignals

<!-- source: CN V2.7 p42; unit 212 -->

Siehe Konfiguration des Kerntreibers → Anpassung des Ausgangssignals → Signalanpassung für GVI / LVDS / MIPI TX.

<!-- source: CN V2.7 p42; unit 213 -->

#### 5.4.5 GVI-Ausgang

<!-- source: CN V2.7 p42; unit 214 -->

##### 5.4.5.1 Konfiguration des GVI-Ausgangs

<!-- source: CN V2.7 p42; unit 215 -->

Ergänzen Sie unter dem RK628-DTS-Knoten einen Knoten „rk628-gvi-out“:

<!-- source: CN V2.7 p43; unit 216 -->

```text
&i2c2_rk628 {
   ......
   rk628-gvi-out {

      bus-format = "rgb888";
      gvi,lanes = <8>;
      // rockchip,division-mode;
      // rockchip, gvi-frm-rst;
      status = "okay";
   };
   ......
};
```

<!-- source: CN V2.7 p43; unit 217 -->

Eigenschaften von „rk628-gvi-out“:

<!-- source: CN V2.7 p43; unit 218 -->

| Eigenschaft | Beschreibung | Optionswert |
| --- | --- | --- |
| bus-format | Busformat | "rgb666" / "rgb888" / "rgb101010" /<br>"yuyv8" / "yuyv10" |
| gvi,lanes | GVI-Lanes | 1、2、4、8 |
| rockchip,division-mode | ein Abschnitt / zwei Abschnitte<br>[optional] | Standardmäßig ein Abschnitt; Hinzufügen der Eigenschaft wählt zwei Abschnitte |
| rockchip, gvi-frm-rst | GVI-Reset bei Bildbeginn<br>aktivieren [optional] | Standardmäßig deaktiviert; Hinzufügen der Eigenschaft aktiviert die Funktion |

<!-- source: CN V2.7 p43; unit 219 -->

##### 5.4.5.2 Vertauschen der Lane-Reihenfolge

<!-- source: CN V2.7 p43; unit 220 -->

Werden benachbarte Pixel im Bild regelmäßig vertauscht, ändern Sie folgende Register, um die Zuordnung zwischen combtx-Lanes und gvi_phy_datalane anzupassen:

<!-- source: CN V2.7 p43; unit 221 -->

```text
# echo 0x80004 $val > /d/rk628/2-0050/registers/combtxphy
# $val(combtx_lane_n):

#   lane0[Bit2:0], lane1[Bit6:4], lane2[Bit10:8], lane3[Bit14:12]
#   lane4[Bit18:16], lane5[Bit22:20], lane6[Bit26:24], lane7[Bit30:28]
# 显示异常时可以优先考虑如下常用   val 值：
# 0x01234567 0x76543210 0x10325476 0x67452301 0x45670123 0x32107654 0x54761023
0x23016745
# 例：
echo 0x80004 0x01234567 > /d/rk628/2-0050/registers/combtxphy
```

<!-- source: CN V2.7 p43; unit 222 -->

Die entsprechende Softwareänderung lautet:

<!-- source: CN V2.7 p44; unit 223 -->

```text
diff --git a/drivers/misc/rk628/rk628_gvi.c b/drivers/misc/rk628/rk628_gvi.c
index fb41c2143bb5..ef47e58ad377 100644
--- a/drivers/misc/rk628/rk628_gvi.c

+++ b/drivers/misc/rk628/rk628_gvi.c
@@ -150,6 +150,8 @@ static void rk628_gvi_pre_enable(struct rk628 *rk628, struct
rk628_gvi *gvi)

      rk628_i2c_update_bits(rk628, GVI_SYS_CTRL1, SYS_CTRL1_COLOR_DEPTH_MASK,
                      SYS_CTRL1_COLOR_DEPTH(gvi->color_depth));
+
+     rk628_i2c_write(rk628, GVI_SYS_CTRL3, 0x01234567);
 }

 static void rk628_gvi_enable_color_bar(struct rk628 *rk628,
```

<!-- source: CN V2.7 p44; unit 224 -->

##### 5.4.5.3 Ausgangssignalanpassung und Spreizspektrum

<!-- source: CN V2.7 p44; unit 225 -->

Siehe Konfiguration des Kerntreibers → Anpassung des Ausgangssignals → Signalanpassung für GVI / LVDS / MIPI TX.

<!-- source: CN V2.7 p44; unit 226 -->

Zu SSC siehe Konfiguration des Kerntreibers → Anpassung des Ausgangssignals → SSC.

<!-- source: CN V2.7 p45; unit 227 -->

##### 5.4.5.4 Liste getesteter RK628F-GVI-Modelle

<!-- source: CN V2.7 p46; unit 229 -->

| TCON | Modell | Panelhersteller | Auflösung |
| --- | --- | --- | --- |
| IN8205A | M280DGJ-L30 | Innolux | 3840*2160 |
| IN8205A | M315DJJ | Innolux |  |
| Ursprünglich IN8908A; Ende 2021 auf IN8210 geändert | S500DJ2-KS5 | Innolux |  |
| Ursprünglich IN8908A; Ende 2021 auf IN8210 geändert | V500DJ2-KS5 | Innolux |  |
| SW0894A | LC860EQY-FJA5 | Xunshi (Quelle: 巡视) |  |
|  | LC550EGE | LGDisplay |  |
| Hi3231V530 | HV550QUB-N8D | BOE |  |
| SW0894A | MZ860004-07 | ACT |  |
| SW0894A | 86S13DCX |  |  |
| TLi2461MC | ACT-MZ750004-07 |  |  |
| LP71517 |  |  |  |
| SW08006A | 848.2 |  |  |
| TLi2380EP | ist-ITV-016 | FunTV |  |
| SW08008 |  |  |  |
| 10301 | L22650USWL1 | Lenove |  |
| 10302 | HV860QUB-E1D |  |  |
| CSQ12-B0S | SG8561D03-1 |  |  |
| CSTU01-A0H | H750D4-BA080AA |  |  |
| CSTU01-A0W | SL(LX)-23 |  |  |
| KV7636-VPP | ST7461D02-6 |  |  |
| KV7626 |  |  |  |
| AUO-12417 |  |  |  |
| AUO-12415 | ICB-VN65 | HiteVision |  |
| NT71120MFG-001 |  |  |  |
| EK76603E | V650DK-KS5 |  |  |
| iLITEK-2326 |  |  |  |
| IN8205A |  |  |  |
| MST6M60FV | TN2A1FV4LCZZ |  |  |
|  | HS-86AW-L09PA |  |  |
|  | HV650QUB-F70 |  |  |
|  | CEJZ650L07Q1 | CSOT |  |
|  | MT5461D01-1 | CSOT |  |
|  | BOEI650WQ1 |  |  |
|  | UV650QUB-N90 |  |  |
|  | LC650EQQ-SMA5 |  |  |

<!-- source: CN V2.7 p47; unit 239 -->

#### 5.4.6 HDMI-Ausgang

<!-- source: CN V2.7 p47; unit 240 -->

Zur Unterstützung von Auflösungswechseln ist der aktuelle Misc-RK628-Treiber als DRM-Bridge implementiert:

<!-- source: CN V2.7 p47; unit 241 -->

![Technische Originalabbildung — EN V2.3, S. 37](/docs/rockchip-rk628-porting/assets/en-p37-X290.png)

*Technische Originalabbildung: EN V2.3, S. 37.*

<!-- source: CN V2.7 p47; unit 242 -->

##### 5.4.6.1 Konfiguration des HDMI-Ausgangs

<!-- source: CN V2.7 p47; unit 243 -->

Ergänzen Sie im RK628-DTS-Knoten die boolesche Eigenschaft „rk628-hdmi-out“. Verbinden Sie „&rgb“ und RK628 über „remote-endpoint“:

<!-- source: CN V2.7 p47; unit 244 -->

```text
&i2c2_rk628 {
   pinctrl-names = "default";

   pinctrl-0 = <&rk628_reset &refclk_pins>;
   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clock-names = "soc_24M";
   clocks = <&pmucru CLK_WIFI>;

   rk628-rgb-in;
   rk628-hdmi-out;
   // mode-sync-pol = <0>;
   status = "okay";

   port {

      rgb_in_hdmi: endpoint {
         remote-endpoint = <&rgb_out_hdmi>;
      };
   };
};
&route_rgb {
   status = "disabled";

};

&rgb_in_vp2 {
   status = "okay";
};

&rgb {
   status = "okay";

   ports {
      port@1 {
         reg = <1>;


         rgb_out_hdmi: endpoint {
           remote-endpoint = <&rgb_in_hdmi>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p48; unit 245 -->

<!-- source: CN V2.7 p48; unit 246 -->

Auflösung und Polarität von HDMITX folgen Standardauflösungen; daher werden keine Panelparameter konfiguriert. Setzen Sie bei RGB-/BT1120-Eingang mode-sync-pol entsprechend den tatsächlichen Werten von hsync-active und vsync-active. Da es nur eine Eigenschaft gibt, müssen hsync-active und vsync-active gleich sein. Die Standardpolarität ist 1 (positiv). Probieren Sie diese Eigenschaft bei einem gestörten Bild aus.

<!-- source: CN V2.7 p48; unit 247 -->

Der HDMITX-Pfad benötigt Takte aus einer gemeinsamen Quelle; andernfalls können Darstellungsfehler auftreten. Siehe Konfiguration des Kerntreibers → 24-MHz-Betriebstakt.

<!-- source: CN V2.7 p48; unit 248 -->

##### 5.4.6.2 Anpassung des Ausgangssignals

<!-- source: CN V2.7 p48; unit 249 -->

Siehe Konfiguration des Kerntreibers → Anpassung des Ausgangssignals → HDMI-TX-Signalanpassung.

<!-- source: CN V2.7 p48; unit 250 -->

##### 5.4.6.3 Audiokonfiguration

<!-- source: CN V2.7 p48; unit 251 -->

```text
&i2s0 {
   rockchip,playback-only;

   status = "oaky";
};

/ {
   rk628_sound: rk628-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";
      simple-audio-card,mclk-fs = <128>;
      simple-audio-card,name = "rockchip,hdmi-rk628";
      status = "oaky";
      simple-audio-card,cpu {
         sound-dai = <&i2s0>;
      };
      simple-audio-card,codec {
         sound-dai = <&i2c2_rk628>;
      };

   };
}
```

<!-- source: CN V2.7 p49; unit 252 -->

<!-- source: CN V2.7 p49; unit 253 -->

### 5.5 Derzeit durch DTS unterstützte Kombinationen

<!-- source: CN V2.7 p49; unit 254 -->

#### 5.5.1 Konvertierung RGB → DSI

<!-- source: CN V2.7 p49; unit 255 -->

Referenz-DTS:

<!-- source: CN V2.7 p49; unit 256 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
```

<!-- source: CN V2.7 p49; unit 257 -->

Diese DTS-Dateien erweitern rk3568-evb.dtsi um RK628-RGB-zu-MIPI-DSI-Unterstützung. Vergleichen Sie den Code mit den Abschnitten zur Ein- und Ausgangsmodulkonfiguration, um die Unterschiede zu verstehen.

<!-- source: CN V2.7 p49; unit 258 -->

Zur RGB-Ausgabe des SoC mit festgelegtem Timing siehe Eingangsmodulkonfiguration → RGB-Eingang.

<!-- source: CN V2.7 p49; unit 259 -->

#### 5.5.2 Konvertierung RGB → LVDS

<!-- source: CN V2.7 p49; unit 260 -->

Referenz-DTS:

<!-- source: CN V2.7 p49; unit 261 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p49; unit 262 -->

Die Quelle beschreibt diese DTS-Dateien als Ergänzung von RK628-RGB-zu-MIPI-DSI-Unterstützung in rk3568-evb.dtsi, obwohl dieser Abschnitt LVDS behandelt. rk3568-evb-rk628-rgb2lvds-ddr4-v10.dts gibt einkanaliges LVDS aus; rk3568-evb-rk628-rgb2lvds-dual-ddr4-v10.dts zweikanaliges LVDS. Vergleichen Sie den Code mit den Ein-/Ausgangsmodulbeschreibungen.

<!-- source: CN V2.7 p49; unit 263 -->

Zur RGB-Ausgabe des SoC mit festgelegtem Timing siehe Eingangsmodulkonfiguration → RGB-Eingang.

<!-- source: CN V2.7 p49; unit 264 -->

#### 5.5.3 Konvertierung RGB → GVI

<!-- source: CN V2.7 p49; unit 265 -->

Referenz-DTS:

<!-- source: CN V2.7 p49; unit 266 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2gvi-ddr4-v10.dts
```

<!-- source: CN V2.7 p49; unit 267 -->

Diese DTS-Dateien erweitern rk3568-evb.dtsi um die RK628-RGB-zu-GVI-Konvertierung. Vergleichen Sie den Code mit den Ein-/Ausgangsmodulbeschreibungen.

<!-- source: CN V2.7 p49; unit 268 -->

Zur RGB-Ausgabe des SoC mit festgelegtem Timing siehe Eingangsmodulkonfiguration → RGB-Eingang.

<!-- source: CN V2.7 p50; unit 269 -->

#### 5.5.4 Konvertierung RGB → HDMI

<!-- source: CN V2.7 p50; unit 270 -->

Referenz-DTS:

<!-- source: CN V2.7 p50; unit 271 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2hdmi-ddr4-v10.dts
```

<!-- source: CN V2.7 p50; unit 272 -->

Diese DTS-Dateien erweitern rk3568-evb.dtsi um die RK628-RGB-zu-HDMI-Konvertierung. Vergleichen Sie den Code mit den Ein-/Ausgangsmodulbeschreibungen.

<!-- source: CN V2.7 p50; unit 273 -->

HDMITX erkennt die vom Panel unterstützten Auflösungen und wählt eine Zielauflösung aus. Daher wird das RGB-Ausgabetiming des SoC nicht im DTS konfiguriert.

<!-- source: CN V2.7 p50; unit 274 -->

#### 5.5.5 Konvertierung HDMI → DSI

<!-- source: CN V2.7 p50; unit 275 -->

Referenz-DTS:

<!-- source: CN V2.7 p50; unit 276 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts

arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p50; unit 277 -->

Diese DTS-Dateien erweitern rk3568-evb.dtsi um die RK628-HDMI-zu-DSI-Konvertierung im direkten SoC-Modus. rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts gibt Einzel-MIPI-DSI aus; rk3568-evb-rk628-hdmi2dsi-dual-ddr4-v10.dts Dual-MIPI-DSI. Vergleichen Sie den Code mit den Ein-/Ausgangsmodulbeschreibungen.

<!-- source: CN V2.7 p50; unit 278 -->

Zur SoC-Ausgabe mit festgelegtem Timing nennt die Quelle RGB, verweist jedoch auf Eingangsmodulkonfiguration → HDMI-Eingang; überprüfen Sie diese Terminologie.

<!-- source: CN V2.7 p50; unit 279 -->

#### 5.5.6 Konvertierung HDMI → LVDS

<!-- source: CN V2.7 p50; unit 280 -->

Referenz-DTS:

<!-- source: CN V2.7 p50; unit 281 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-ddr4-v10.dts

arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p50; unit 282 -->

Diese DTS-Dateien erweitern rk3568-evb.dtsi um die RK628-HDMI-zu-LVDS-Konvertierung im direkten SoC-Modus. rk3568-evb-rk628-hdmi2lvds-ddr4-v10.dts gibt einkanaliges LVDS aus; rk3568-evb-rk628-hdmi2lvds-dual-ddr4-v10.dts zweikanaliges LVDS. Vergleichen Sie den Code mit den Ein-/Ausgangsmodulbeschreibungen.

<!-- source: CN V2.7 p50; unit 283 -->

Zur SoC-Ausgabe mit festgelegtem Timing nennt die Quelle RGB, verweist jedoch auf Eingangsmodulkonfiguration → HDMI-Eingang; überprüfen Sie diese Terminologie.

<!-- source: CN V2.7 p50; unit 284 -->

#### 5.5.7 Konvertierung HDMI → GVI

<!-- source: CN V2.7 p50; unit 285 -->

Referenz-DTS:

<!-- source: CN V2.7 p51; unit 286 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2gvi-ddr4-v10.dts
```

<!-- source: CN V2.7 p51; unit 287 -->

Diese DTS-Dateien erweitern rk3568-evb.dtsi um die RK628-HDMI-zu-GVI-Konvertierung im direkten SoC-Modus. Vergleichen Sie den Code mit den Ein-/Ausgangsmodulbeschreibungen.

<!-- source: CN V2.7 p51; unit 288 -->

Zur SoC-Ausgabe mit festgelegtem Timing nennt die Quelle RGB, verweist jedoch auf Eingangsmodulkonfiguration → HDMI-Eingang; überprüfen Sie diese Terminologie.

<!-- source: CN V2.7 p51; unit 289 -->

### 5.6 Grundlegende Debug-Befehle

<!-- source: CN V2.7 p51; unit 290 -->

#### 5.6.1 Register-Debug-Knoten

<!-- source: CN V2.7 p51; unit 291 -->

Unter /sys/kernel/debug/regmap:

<!-- source: CN V2.7 p51; unit 292 -->

```text
rk3568_t:/ # ls /sys/kernel/debug/regmap/
0-001c        2-0050-dsi1 2-0050-hdmirx 4-0050-gpio0
0-0020        2-0050-efuse 4-0050-adapter 4-0050-gpio1

0-0020-rk817-codec 2-0050-gpio0 4-0050-combrxphy 4-0050-gpio2
2-0050-adapter 2-0050-gpio1 4-0050-combtxphy 4-0050-gpio3
2-0050-combrxphy 2-0050-gpio2 4-0050-cru 4-0050-grf
2-0050-combtxphy 2-0050-gpio3 4-0050-csi 4-0050-gvi
2-0050-cru    2-0050-grf 4-0050-dsi0  4-0050-hdmi
2-0050-csi    2-0050-gvi 4-0050-dsi1  4-0050-hdmirx
2-0050-dsi0   2-0050-hdmi 4-0050-efuse ......
```

<!-- source: CN V2.7 p51; unit 293 -->

Oder unter /sys/kernel/debug/rk628/x-xxxx/registers:

<!-- source: CN V2.7 p51; unit 294 -->

```text
rk3568_t:/ # ls /sys/kernel/debug/rk628/2-0050/registers/
adapter combrxphy combtxphy cru csi dsi0 dsi1 efuse gpio0 gpio1 gpio2
gpio3 grf gvi hdmi hdmirx
```

<!-- source: CN V2.7 p51; unit 295 -->

Dabei ist 2 die I2C-Busnummer und 0050 die RK628-Slave-Adresse.

<!-- source: CN V2.7 p51; unit 296 -->

1\. Register lesen, am Beispiel GRF:

<!-- source: CN V2.7 p51; unit 297 -->

Unter /sys/kernel/debug/regmap:

<!-- source: CN V2.7 p51; unit 298 -->

```text
rk3568_t:/ # cat /sys/kernel/debug/regmap/2-0050-grf/registers
000: 06000088
004: ffffffff

008: 00000000
00c: 00000000
010: 00000001
014: 00000000
018: 00050000
01c: 002c0898
020: 00c00840
......

rk3568_t:/ # cat /sys/kernel/debug/regmap/2-0050-grf/registers | grep 200:
200: 20230321
```

<!-- source: CN V2.7 p52; unit 299 -->

Oder unter /sys/kernel/debug/rk628/x-xxxx/registers:

<!-- source: CN V2.7 p52; unit 300 -->

```text
rk3568_t:/ # cat /sys/kernel/debug/rk628/2-0050/registers/grf
rk628_grf:


0x0000: 06000298 ffffffff 00000000 00000001
0x0010: 00000001 00000000 000404b6 002804ba
0x0020: 0046047e 000a079e 00140794 0046047e
0x0030: 00140794 00000004 00000000 00000000
0x0040: 04380004 80000000 00000000 00000000
0x0050: 80000000 00000000 10000000 00000000
0x0060: 000002ea 01f0ea00 00000000 01f00000
0x0070: 0000155c 00005602 00000000 00000000
0x0080: 00006000 00000000 00000000 00000000
......

rk3568_t:/ # cat /sys/kernel/debug/rk628/2-0050/registers/grf | grep 0200:

0x0200: 20230321 00000000 00000000 00000000
```

<!-- source: CN V2.7 p52; unit 301 -->

2\. Register schreiben, am Beispiel GRF:

<!-- source: CN V2.7 p52; unit 302 -->

Unter /sys/kernel/debug/regmap:

<!-- source: CN V2.7 p52; unit 303 -->

```text
rk3568_t:/ # echo 0x010 0x02000200 > /sys/kernel/debug/regmap/2-0050-
grf/registers
```

<!-- source: CN V2.7 p52; unit 304 -->

Oder unter /sys/kernel/debug/rk628/x-xxxx/registers:

<!-- source: CN V2.7 p52; unit 305 -->

```text
rk3568_t:/ # echo 0x010 0x02000200 > /sys/kernel/debug/rk628/2-0050/registers/grf
```

<!-- source: CN V2.7 p52; unit 306 -->

#### 5.6.2 Selbsttestbefehle

<!-- source: CN V2.7 p52; unit 307 -->

Verwenden Sie bei fehlerhafter Ausgabe den folgenden Befehl, um festzustellen, ob das Problem auf der RK628-Eingangs- oder Ausgangsseite liegt. Dies ist nur auf RK628F/H verfügbar.

<!-- source: CN V2.7 p52; unit 308 -->

```text
# Enable horizontal color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/scaler_color_bar


# Enable vertical color bar
rk3568_t:/ # echo 2 > /sys/kernel/debug/rk628/2-0050/scaler_color_bar

# Disable color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/scaler_color_bar
```

<!-- source: CN V2.7 p52; unit 309 -->

Wird der Scaler-Farbbalken korrekt angezeigt, untersuchen Sie die Hostausgabe, den RK628-Eingang und die RK628-Process-Konfiguration. Prüfen Sie andernfalls zuerst den RK628-Ausgang und verwenden Sie dann die folgenden Schnittstellen-Farbbalken, um Controller, PHY und Panelpfad einzeln zu testen. Funktionieren diese Modulfarbbalken, während der Scaler-Farbbalken weiterhin fehlt, untersuchen Sie den RK628-Eingang weiter.

<!-- source: CN V2.7 p52; unit 310 -->

Die folgenden Befehle testen den Ausgangscontroller, seinen PHY und den Panelpfad:

<!-- source: CN V2.7 p52; unit 311 -->

1\. HDMITX-Farbbalken

<!-- source: CN V2.7 p53; unit 312 -->

```text
# Enable normal color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar


# Enable special color bar
rk3568_t:/ # echo 2 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar

# Enable black color bar
rk3568_t:/ # echo 3 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar

# Disable color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar
```

<!-- source: CN V2.7 p53; unit 313 -->

2\. DSI-Farbbalken

<!-- source: CN V2.7 p53; unit 314 -->

```text
# Enable dsi color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/dsi_color_bar


# Disable dsi color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/dsi_color_bar
```

<!-- source: CN V2.7 p53; unit 315 -->

3\. GVI-Farbbalken

<!-- source: CN V2.7 p53; unit 316 -->

```text
# Enable color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/gvi_color_bar


# Disable color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/gvi_color_bar
```

<!-- source: CN V2.7 p53; unit 317 -->

#### 5.6.3 RGB-IN-Fehlersuche (nur RK628F/H)

<!-- source: CN V2.7 p53; unit 318 -->

Auf RK628F/H meldet der folgende Befehl die tatsächlich von RGB IN empfangene Auflösung und hilft zu bestimmen, ob RGB RX korrekt arbeitet:

<!-- source: CN V2.7 p53; unit 319 -->

```text
rk3568_t:/ # cat /sys/kernel/debug/rk628/2-0050/rgb_resolution
1080x1920 pclk:131967000
```

<!-- source: CN V2.7 p53; unit 320 -->

### 5.7 Häufige Anzeigeprobleme

<!-- source: CN V2.7 p53; unit 321 -->

#### 5.7.1 Kein regmap-Knoten

<!-- source: CN V2.7 p53; unit 322 -->

Prüfen Sie die Protokolle auf RK628-Fehler wie die folgenden, die eine erfolgreiche Probe-Initialisierung verhindern:

<!-- source: CN V2.7 p53; unit 323 -->

```text
rk3568_t:/ # dmesg | grep rk628
[  0.294331] rk628 2-0050: the driver version is 0.1.0 of RK628-F/B/G

[  0.294426] rk628 2-0050: failed to request enable GPIO: -16
```

<!-- source: CN V2.7 p54; unit 324 -->

#### 5.7.2 I2C-Kommunikationsfehler

<!-- source: CN V2.7 p54; unit 325 -->

Diese Protokolle zeigen, dass RK628-I2C-Fehler die Registrierung seiner Module verhindern. Prüfen Sie die RK628-Einschaltreihenfolge, den 24-MHz-Referenztakt (siehe Allgemeine Anforderungen) und das IOMUX der betreffenden Pins.

<!-- source: CN V2.7 p54; unit 326 -->

```text
[  0.960609] rk628 1-0050: failed to access register: -6
```

<!-- source: CN V2.7 p54; unit 327 -->

#### 5.7.3 DSI/GVI zeigt Inhalte, aber ein gestörtes Bild

<!-- source: CN V2.7 p54; unit 328 -->

Versuchen Sie, die Austastpolaritäten in src-timing im DTS zu ändern. Dies gilt sowohl für DSI als auch für GVI.

<!-- source: CN V2.7 p54; unit 329 -->

Beispielsweise:

<!-- source: CN V2.7 p54; unit 330 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
@@ -347,8 +347,8 @@ src-timing {

                       vfront-porch = <15>;
                       hsync-len = <2>;
                       vsync-len = <2>;
-                      hsync-active = <0>;
-                      vsync-active = <0>;
+                      hsync-active = <1>;
+                      vsync-active = <1>;
                       de-active = <0>;
                       pixelclk-active = <0>;
```

<!-- source: CN V2.7 p54; unit 331 -->

#### 5.7.4 Keine DSI-Anzeige nach Erhöhung von clock-frequency

<!-- source: CN V2.7 p54; unit 332 -->

Eine höhere Bildwiederholrate erfordert normalerweise eine Erhöhung von clock-frequency, beispielsweise:

<!-- source: CN V2.7 p54; unit 333 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
@@ -338,7 +338,7 @@ rk628-panel {


           display-timings {
                 src-timing {
-                      clock-frequency = <132000000>;
+                      clock-frequency = <148500000>;
                       hactive = <1080>;
                       vactive = <1920>;
                       hback-porch = <30>;
@@ -354,7 +354,7 @@ src-timing {
                 };

                 dst-timing {

-                      clock-frequency = <132000000>;
+                      clock-frequency = <148500000>;
                       hactive = <1080>;
                       vactive = <1920>;
                       hback-porch = <30>;
```

<!-- source: CN V2.7 p55; unit 334 -->

Ein höherer CLK kann Flackern oder ein fehlendes Bild verursachen. Versuchen Sie dann, die Lane-Rate wie folgt anzupassen:

<!-- source: CN V2.7 p55; unit 335 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
@@ -57,6 +57,7 @@ &i2c2_rk628 {


           rk628-rgb-in;
           rk628-dsi-out {
+                rockchip,lane-mbps = <1000>;
                 //rockchip,dual-channel;
                 dsi,eotp;
                 dsi,video-mode;
```

<!-- source: CN V2.7 p55; unit 336 -->

#### 5.7.5 Bildversatz

<!-- source: CN V2.7 p55; unit 337 -->

Erzeugt beispielsweise der HDMI-Eingang nachgelagert ein versetztes Bild, passen Sie im DTS die Panel-Austastzeiten entsprechend der Versatzrichtung an: hfront-porch/hback-porch/hsync-len und vfront-porch/vback-porch/vsync-len in src-timing/dst-timing. Stellen Sie sicher, dass die Ausgangs-clock-frequency dem HDMI-Eingang entspricht, beispielsweise 148500000 auf beiden Seiten.

<!-- source: CN V2.7 p55; unit 338 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts
@@ -314,7 +314,7 @@ src-timing {

                 hfront-porch = <60>;
                 vback-porch = <10>;
                 vfront-porch = <10>;
-                hsync-len = <20>;
+                hsync-len = <40>;
                 vsync-len = <10>;
                 hsync-active = <1>;
                 vsync-active = <1>;
```

<!-- source: CN V2.7 p55; unit 339 -->

#### 5.7.6 Ansteuern der RK628-GPIOs

<!-- source: CN V2.7 p55; unit 340 -->

Rufen Sie an der gewünschten Stelle die GPIO-Schnittstelle auf und binden Sie rk628_pinctrl.h sowie rk628_gpio.h ein. Die Schnittstelle umfasst IOMUX, Richtung und Pegel. Folgendes setzt I2S_D2_M0 in den GPIO-Modus und treibt es auf High:

<!-- source: CN V2.7 p55; unit 341 -->

```text
#include "rk628_pinctrl.h"
#include "rk628_gpio.h"


rk628_misc_gpio_direction_output(rk628, GPIO0_A6, 1);
```

<!-- source: CN V2.7 p55; unit 342 -->

Zum Wiederherstellen der ursprünglichen Funktion rufen Sie auf:

<!-- source: CN V2.7 p55; unit 343 -->

```text
rk628_misc_pinctrl_set_mux(rk628, GPIO0_A6, I2SM0D2);
```

<!-- source: CN V2.7 p56; unit 344 -->

## 6. Media

<!-- source: CN V2.7 p56; unit 345 -->

### 6.1 Treiberüberblick

<!-- source: CN V2.7 p56; unit 346 -->

![Technische Originalabbildung — EN V2.3, S. 46](/docs/rockchip-rk628-porting/assets/en-p46-X330.png)

*Technische Originalabbildung: EN V2.3, S. 46.*

<!-- source: CN V2.7 p56; unit 347 -->

Media ist der Treibercode für den HDMI-IN-Pfad des RK628. Er verwendet RK628 wie ein Kameragerät, um die oben dargestellten Funktionen umzusetzen.

<!-- source: CN V2.7 p56; unit 348 -->

#### 6.1.1 Verbesserungen von RK628F/H gegenüber RK628D

<!-- source: CN V2.7 p56; unit 349 -->

Der Media-Treiber verbindet hauptsächlich HDMI2CSI, HDMI2DSI oder HDMI2BT1120 mit einem Host-SoC. Gegenüber RK628D sind die wichtigsten Verbesserungen von RK628F/H in diesem Bereich:

<!-- source: CN V2.7 p56; unit 350 -->

```text
主要改进点
```

<!-- source: CN V2.7 p56; unit 351 -->

Modul

<!-- source: CN V2.7 p56; unit 352 -->

Unterstützt HDMI2.0 und RGB-4K60-Eingang.

<!-- source: CN V2.7 p56; unit 353 -->

HDMIRX unterstützt zusätzliche Frequenzpunkte.

<!-- source: CN V2.7 p56; unit 354 -->

Unterstützt DVI-Modus mit schnellerem und stabilerem Einrasten.

<!-- source: CN V2.7 p56; unit 355 -->

```text
解决了不同图像格式输入，格式转换下采样引入的色偏问题
增加一路  MIPI-CSI，双 MIPI-CSI 支持 4K60 输出
```

<!-- source: CN V2.7 p56; unit 356 -->

MIPI-CSI

<!-- source: CN V2.7 p56; unit 357 -->

CSC ergänzt eine Matrix für flexiblere Bildfarbraumkonvertierung.

<!-- source: CN V2.7 p56; unit 358 -->

#### 6.1.2 Treiberverzeichnisstruktur

<!-- source: CN V2.7 p56; unit 359 -->

Der RK628-Media-Treibercode unterscheidet sich je nach Kernelversion. Vor kernel-5.10 verwenden Sie das Patchpaket rk628_for-all, für kernel-5.10 dagegen kernel_5.10_rk628_media_patch.

<!-- source: CN V2.7 p56; unit 360 -->

Für Kernel vor kernel-5.10 lautet die Verzeichnisstruktur:

<!-- source: CN V2.7 p56; unit 361 -->

```text
drivers/media/i2c/rk628
├── Makefile

├── rk628_bt1120_v4l2.c
├── rk628.c
├── rk628_combrxphy.c
├── rk628_combrxphy.h
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_csi.c
├── rk628_csi.h
├── rk628_csi_v4l2.c
├── rk628_dsi.c

├── rk628_dsi.h
├── rk628_gpio.h
├── rk628_grf.h
├── rk628.h
├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_mipi_dphy.c
├── rk628_mipi_dphy.h
├── rk628_pinctrl.c
├── rk628_pinctrl.h
├── rk628_post_process.c
├── rk628_post_process.h

└── rk628_v4l2_controls.h
```

<!-- source: CN V2.7 p57; unit 362 -->

<!-- source: CN V2.7 p57; unit 363 -->

Für kernel-5.10 lautet das Treiberverzeichnis:

<!-- source: CN V2.7 p57; unit 364 -->

```text
drivers/media/i2c/rk628
├── Makefile

├── rk628_bt1120_v4l2.c
├── rk628.c
├── rk628_combrxphy.c
├── rk628_combrxphy.h
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_csi.c
├── rk628_csi.h
├── rk628_csi_v4l2.c
├── rk628_dsi.c
├── rk628_dsi.h

├── rk628.h
├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_mipi_dphy.c
├── rk628_mipi_dphy.h
├── rk628_post_process.c
└── rk628_post_process.h
```

<!-- source: CN V2.7 p57; unit 365 -->

Die wichtigsten Treiberdateien und vorgesehenen Anwendungsfälle sind:

<!-- source: CN V2.7 p57; unit 366 -->

rk628_csi.c: HDMI2CSI für CameraHal1 und Drittanbieter-SoCs.

<!-- source: CN V2.7 p57; unit 367 -->

rk628_csi_v4l2.c: HDMI2CSI / HDMI2DSI für V4L2-basierte Plattformen wie CameraHal3 und TV input.

<!-- source: CN V2.7 p57; unit 368 -->

rk628_bt1120_v4l2.c: HDMI2BT1120 für V4L2-basierte Plattformen wie CameraHal3.

<!-- source: CN V2.7 p58; unit 369 -->

#### 6.1.3 Treiberportierung

<!-- source: CN V2.7 p58; unit 370 -->

Siehe Treiberportierung → HDMI-IN-Pfad (drivers/media/i2c/rk628).

<!-- source: CN V2.7 p58; unit 371 -->

### 6.2 HDMI-IN-Videoframework

<!-- source: CN V2.7 p58; unit 372 -->

Die HDMI-IN-Videoimplementierung modelliert RK628 als MIPI-SoC-Kameragerät. Das Kamera- oder TV-Framework empfängt Video zur Anzeige in einer APK. HDMI-IN-Hotplug und automatische Auflösungsanpassung kommen für HDMI-Eingangsszenarien hinzu.

<!-- source: CN V2.7 p58; unit 373 -->

Android9/10/11 verwendet cameraHAL3. Siehe Rockchip_Developer_Guide_HDMI_IN_Based_On_CameraHal3_CN.pdf unter RKDocs/common/camera/hdmi-in im SDK.

<!-- source: CN V2.7 p58; unit 374 -->

Android12/13 verwendet cameraHAL3/TVinput. Siehe folgendes Dokument unter RKDocs/common/camera/hdmi-in im SDK:

<!-- source: CN V2.7 p58; unit 375 -->

Rockchip_Developer_Guide_Android12+_HDMI_IN_Bridge_CN

<!-- source: CN V2.7 p58; unit 376 -->

#### 6.2.1 Ablauf der HDMI-IN-APK

<!-- source: CN V2.7 p58; unit 377 -->

Der allgemeine APK-Ablauf ist nachfolgend dargestellt:

<!-- source: CN V2.7 p59; unit 378 -->

![Technische Originalabbildung — EN V2.3, S. 49](/docs/rockchip-rk628-porting/assets/en-p49-X343.png)

*Technische Originalabbildung: EN V2.3, S. 49.*

<!-- source: CN V2.7 p59; unit 379 -->

Bei kernel-4.19 oder kernel-4.4 (Android 9/10/11) kann rkCamera2 die Vorschau direkt öffnen.

<!-- source: CN V2.7 p59; unit 380 -->

Unterscheiden Sie bei kernel-5.10 (Android 12/13) zwischen Kamera- und TV-Framework. Siehe:

<!-- source: CN V2.7 p59; unit 381 -->

Rockchip_Developer_Guide_Android12+_HDMI_IN_Bridge_CN

<!-- source: CN V2.7 p60; unit 382 -->

#### 6.2.2 Architektur des RK628-Treibers

<!-- source: CN V2.7 p60; unit 383 -->

Drei Treiberbereiche erfordern besondere Aufmerksamkeit: Initialisierung, Hotplug-Interruptbehandlung und Behandlung von Auflösungsänderungsinterrupts. Es folgen Referenzablaufdiagramme:

<!-- source: CN V2.7 p60; unit 384 -->

![Technische Originalabbildung — EN V2.3, S. 51](/docs/rockchip-rk628-porting/assets/en-p51-X351.png)

*Technische Originalabbildung: EN V2.3, S. 51.*

<!-- source: CN V2.7 p60; unit 385 -->

![Technische Originalabbildung — EN V2.3, S. 50](/docs/rockchip-rk628-porting/assets/en-p50-X348.png)

*Technische Originalabbildung: EN V2.3, S. 50.*

<!-- source: CN V2.7 p61; unit 386 -->

![Technische Originalabbildung — EN V2.3, S. 52](/docs/rockchip-rk628-porting/assets/en-p52-X354.png)

*Technische Originalabbildung: EN V2.3, S. 52.*

<!-- source: CN V2.7 p61; unit 387 -->

### 6.3 DTS-Konfiguration

<!-- source: CN V2.7 p61; unit 388 -->

#### 6.3.1 RK628-Knotenkonfiguration

<!-- source: CN V2.7 p61; unit 389 -->

```text
&i2c5 {
   status = "okay";


   rk628_csi: rk628_csi@50 {
      reg = <0x50>;
      compatible = "rockchip,rk628-csi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio2>;
      interrupts = <RK_PC4 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA0 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PC6 GPIO_ACTIVE_HIGH>;
      plugin-det-gpios = <&gpio1 RK_PA1 GPIO_ACTIVE_LOW>;

      continues-clk = <1>;

      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI";
      rockchip,camera-module-lens-name = "RK628-CSI";

      multi-dev-info {
         dev-idx-l = <0>;
         dev-idx-r = <1>;
         combine-idx = <0>;
         pixel-offset = <0>;

         dev-num = <2>;
      };

      port {
         hdmiin_out0: endpoint {
           remote-endpoint = <&hdmi_mipi0_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p62; unit 390 -->

<!-- source: CN V2.7 p62; unit 391 -->

reg: I2C-Adresse. Die typische 7-Bit-Adresse des RK628 ist 0x50. Bei mehreren RK628-Geräten kann dessen GPIO die Adresse ändern; siehe I2C-Kommunikation zwischen SoC und RK628.

<!-- source: CN V2.7 p62; unit 392 -->

compatible:

<!-- source: CN V2.7 p62; unit 393 -->

compatible = "rockchip,rk628-csi" wählt rk628_csi.c; compatible = "rockchip,rk628-csi-v4l2" wählt rk628_csi_v4l2.c; compatible = "rockchip,rk628-bt1120-v4l2" wählt rk628_bt1120_v4l2.c.

<!-- source: CN V2.7 p62; unit 394 -->

interrupt-parent/interrupts: GPIO-Pin, der mit dem RK628-Interrupt verbunden ist.

<!-- source: CN V2.7 p62; unit 395 -->

enable-gpios: GPIO zur RK628-Stromversorgungssteuerung; bei dauerhafter Versorgung weglassen.

<!-- source: CN V2.7 p62; unit 396 -->

reset-gpios: GPIO zur RK628-Resetsteuerung.

<!-- source: CN V2.7 p62; unit 397 -->

hpd-output-inverted: HPD-Ausgabe invertieren. Aktivieren, wenn die Hardwareschaltung den HPD-Pegel invertiert.

<!-- source: CN V2.7 p62; unit 398 -->

![Technische Originalabbildung — EN V2.3, S. 54](/docs/rockchip-rk628-porting/assets/en-p54-X361.png)

*Technische Originalabbildung: EN V2.3, S. 54.*

<!-- source: CN V2.7 p63; unit 399 -->

plugin-det-gpios: GPIO zur Erkennung des HDMI-Einsteckens. Prüfen Sie, ob die Schaltung den Pegel invertiert, und konfigurieren Sie den aktiven Pegel entsprechend.

<!-- source: CN V2.7 p63; unit 400 -->

![Technische Originalabbildung — EN V2.3, S. 54](/docs/rockchip-rk628-porting/assets/en-p54-X362.png)

*Technische Originalabbildung: EN V2.3, S. 54.*

<!-- source: CN V2.7 p63; unit 401 -->

power-gpios: GPIO zur Steuerung der MIPI-RX-Stromversorgungsdomäne des Rockchip-Hosts; bei dauerhafter Versorgung weglassen.

<!-- source: CN V2.7 p63; unit 402 -->

hdcp-enable: HDCP aktivieren.

<!-- source: CN V2.7 p63; unit 403 -->

continues-clk: kontinuierlichen oder nicht kontinuierlichen MIPI-CSI-Ausgabetakt wählen.

<!-- source: CN V2.7 p63; unit 404 -->

multi-dev-info: für Dual-MIPI 4K60 erforderlich (nur RK628F/H). Die Quelle nennt RK3588/RK3562/RK3576 und Kernelversionen ab 5.10.

<!-- source: CN V2.7 p63; unit 405 -->

#### 6.3.2 Bildempfangspfade

<!-- source: CN V2.7 p63; unit 406 -->

Entwickeln Sie RK628 als kameraähnlichen Konverter mit einem V4L2-Treiber, ebenso wie einen Kamerasensor. Konfigurieren Sie den Datenpfad wie bei einem MIPI-SoC-Sensor. Drei häufige Kombinationen sind:

<!-- source: CN V2.7 p63; unit 407 -->

RK628 → HDMI2CSI → SoC

<!-- source: CN V2.7 p63; unit 408 -->

RK628 → HDMI2DSI → SoC

<!-- source: CN V2.7 p63; unit 409 -->

RK628 → HDMI2BT1120 → SoC

<!-- source: CN V2.7 p63; unit 410 -->

#### 6.3.3 HDMI2CSI-Pfad

<!-- source: CN V2.7 p63; unit 411 -->

##### 6.3.3.1 RK628D

<!-- source: CN V2.7 p63; unit 412 -->

Beispiel RK3288 + CSI_V4L2: Pfadkonfiguration rk628 + isp1.

<!-- source: CN V2.7 p63; unit 413 -->

```text
&rk628_csi {
   status = "okay";
   /*

   * If the hpd output level is inverted on the circuit,
   * the following configuration needs to be enabled.
   */
   /* hpd-output-inverted; */
   plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
   power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
   rockchip,camera-module-index = <0>;
   rockchip,camera-module-facing = "back";
   rockchip,camera-module-name = "RK628-CSI";

   rockchip,camera-module-lens-name = "NC";

   port {
      hdmiin_out0: endpoint {
         remote-endpoint = <&mipi_in>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&mipi_phy_rx0 {
   status = "okay";


   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&hdmiin_out0>;

            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         dphy_rx_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&isp_mipi_in>;

         };
      };
   };
};

&rkisp1 {
   status = "okay";
   port {
      #address-cells = <1>;
      #size-cells = <0>;

      isp_mipi_in: endpoint@0 {
         reg = <0>;

         remote-endpoint = <&dphy_rx_out>;
      };
   };
};

&isp_mmu {

   status = "okay";
};
```

<!-- source: CN V2.7 p64; unit 414 -->

<!-- source: CN V2.7 p65; unit 415 -->

<!-- source: CN V2.7 p65; unit 416 -->

Beispiel RK3568 + CSI_V4L2: Pfadkonfiguration rk628 + isp2:

<!-- source: CN V2.7 p65; unit 417 -->

```text
&i2c2 {
   status = "okay";

   pinctrl-names = "default";
   pinctrl-0 = <&i2c2m1_xfer>;

   rk628_csi: rk628_csi@32 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;

      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
           remote-endpoint = <&mipi_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};


&csi2_dphy_hw {
   status = "okay";
};

&csi2_dphy0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;

         #size-cells = <0>;

         mipi_in: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&rk628_out>;
           data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;

         #address-cells = <1>;
         #size-cells = <0>;

         csidphy0_out: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&isp0_in>;
         };
      };
   };
};

&rkisp {

   status = "okay";
};

&rkisp_mmu {
   status = "okay";
};

&rkisp_vir0 {
   status = "okay";

   port {
      #address-cells = <1>;
      #size-cells = <0>;


      isp0_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&csidphy0_out>;
      };
   };
};
```

<!-- source: CN V2.7 p66; unit 418 -->

<!-- source: CN V2.7 p66; unit 419 -->

RK3568-Pfadkonfiguration rk628 + vicap:

<!-- source: CN V2.7 p66; unit 420 -->

```text
&i2c2 {
   status = "okay";
   pinctrl-names = "default";

   pinctrl-0 = <&i2c2m1_xfer>;

   rk628_csi: rk628_csi@32 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;

      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";

      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
            remote-endpoint = <&mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };
   };
};

&csi2_dphy_hw {

   status = "okay";
};

&csi2_dphy0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi_in: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&rk628_out>;
            data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;


         csidphy0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&mipi_csi2_input>;
            data-lanes = <1 2 3 4>;
         };
      };
   };
};

&mipi_csi2 {
   status = "okay";

   ports {

      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;

         #size-cells = <0>;

         mipi_csi2_input: endpoint@1 {
           reg = <1>;
           remote-endpoint = <&csidphy0_out>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;

         #size-cells = <0>;

         mipi_csi2_output: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&cif_mipi_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};

&rkcif {
   status = "okay";

};

&rkcif_mipi_lvds {
   status = "okay";

   port {
      cif_mipi_in: endpoint {
         remote-endpoint = <&mipi_csi2_output>;
         data-lanes = <1 2 3 4>;
      };
   };
};


&rkcif_mmu {
   status = "okay";
};
```

<!-- source: CN V2.7 p67; unit 421 -->

<!-- source: CN V2.7 p68; unit 422 -->

<!-- source: CN V2.7 p68; unit 423 -->

##### 6.3.3.2 RK628F/H

<!-- source: CN V2.7 p68; unit 424 -->

Die DTS-Konfiguration des Host-SoC für RK628F/H entspricht im Wesentlichen RK628D; siehe das dortige Beispiel.

<!-- source: CN V2.7 p68; unit 425 -->

RK628F/H unterstützt Dual-MIPI. Dieser Absatz nennt nur RK3588/RK3562 als unterstützte Hosts. Das folgende RK3588-Dual-MIPI-Beispiel verbindet RK628F/H CSI0/CSI1 über vicap mit RK3588 CSI0/CSI1.

<!-- source: CN V2.7 p68; unit 426 -->

```text
&csi2_dphy0 {
   status = "okay";
   ports {
      #address-cells = <1>;

      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         hdmi_mipi2_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&hdmiin_out1>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         csidphy0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&mipi2_csi2_input>;
         };
      };
   };
};


&csi2_dphy0_hw {
   status = "okay";
};

&csi2_dphy1_hw {
   status = "okay";
};

&i2c3 {
   status = "okay";
   clock-frequency = <400000>;


   rk628_csi: rk628_csi@50 {
      reg = <0x50>;
      compatible = "rockchip,rk628-csi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio1>;
      interrupts = <RK_PB2 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA7 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio1 RK_PB1 GPIO_ACTIVE_HIGH>;
      plugin-det-gpios = <&gpio2 RK_PB6 GPIO_ACTIVE_LOW>;
      continues-clk = <1>;


      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI2";
      rockchip,camera-module-lens-name = "RK628-CSI";


      multi-dev-info {
         dev-idx-l = <2>;
         dev-idx-r = <4>;
         combine-idx = <2>;
         pixel-offset = <0>;
         dev-num = <2>;
      };

      port {
         hdmiin_out1: endpoint {
            remote-endpoint = <&hdmi_mipi2_in>;
            data-lanes = <1 2 3 4>;

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


&mipi2_csi2 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi2_csi2_input: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&csidphy0_out>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi2_csi2_output: endpoint@0 {
            reg = <0>;

            remote-endpoint = <&cif_mipi_in2>;
         };
      };
   };
};


&rkcif {
   status = "okay";
};

&rkcif_mipi_lvds2 {
   status = "okay";

   port {
      cif_mipi_in2: endpoint {
         remote-endpoint = <&mipi2_csi2_output>;
      };
   };

};

&rkcif_mmu {
   status = "okay";
};
```

<!-- source: CN V2.7 p69; unit 427 -->

<!-- source: CN V2.7 p70; unit 428 -->

<!-- source: CN V2.7 p71; unit 429 -->

<!-- source: CN V2.7 p71; unit 430 -->

#### 6.3.4 HDMI2DSI-Konvertierung

<!-- source: CN V2.7 p71; unit 431 -->

##### 6.3.4.1 RK628D

<!-- source: CN V2.7 p71; unit 432 -->

Bei RK628D HDMI-zu-MIPI-CSI können Farbraumkonvertierung oder Auf-/Abwärtsabtastung geringe Abweichungen bei Farbdetails verursachen. HDMI-zu-MIPI-DSI ist eine Alternative: Der Host empfängt RGB888 direkt und die Anwendung konvertiert es mit rgb2yuv. Beachten Sie:

<!-- source: CN V2.7 p71; unit 433 -->

Maximale Auflösung: 1080P60.

<!-- source: CN V2.7 p71; unit 434 -->

Als Unterstützung für MIPI-DSI-Empfang nennt die Quelle folgende APs: RK1109, RK1126, RK3566, RK3568, RK3588, RK3562 und RK3576 (Schreibweisen der Quelle beibehalten).

<!-- source: CN V2.7 p71; unit 435 -->

Ältere APs wie RK3288, RK3326, RK3368 und RK3399 unterstützen keinen MIPI-DSI-Empfang.

<!-- source: CN V2.7 p71; unit 436 -->

CSI und DSI verwenden gemeinsamen kompatiblen Code und werden durch DTS compatible unterschieden:

<!-- source: CN V2.7 p71; unit 437 -->

CSI: compatible = "rockchip,rk628-csi-v4l2";

<!-- source: CN V2.7 p71; unit 438 -->

DSI: compatible = "rockchip,rk628-dsi-v4l2";

<!-- source: CN V2.7 p71; unit 439 -->

RK3568-Beispiel:

<!-- source: CN V2.7 p71; unit 440 -->

```text
&i2c2 {
   status = "okay";
   pinctrl-names = "default";

   pinctrl-0 = <&i2c2m1_xfer>;

   rk628_csi: rk628_csi@32 {
      compatible = "rockchip,rk628-dsi-v4l2";
      reg = <0x50>;

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;

      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
            remote-endpoint = <&hdmi2mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };
   };

};

&mipi_csi2 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi_csi2_input: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&csidphy_out>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi_csi2_output: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&cif_mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };
   };
};

&rkcif {
   status = "okay";
};


&rkcif_mipi_lvds {
   status = "okay";
   port {
      cif_mipi_in: endpoint {

         remote-endpoint = <&mipi_csi2_output>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&rkcif_mmu {
   status = "okay";
};

&csi2_dphy_hw {
   status = "okay";

};

&csi2_dphy0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         hdmi2mipi_in: endpoint@0 {
           reg = <1>;
           remote-endpoint = <&rk628_out>;
           data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         csidphy_out: endpoint@0 {

           reg = <0>;
           remote-endpoint = <&mipi_csi2_input>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p72; unit 441 -->

<!-- source: CN V2.7 p73; unit 442 -->

<!-- source: CN V2.7 p73; unit 443 -->

Bei einem RK3568-Host mit älterem Code benötigt CIF folgenden Commit zum Empfang von RGB888:

<!-- source: CN V2.7 p73; unit 444 -->

Die RK3588-Treiber für kernel-5.10 unterstützen RGB888 standardmäßig.

<!-- source: CN V2.7 p73; unit 445 -->

```text
From e925e385a41a857e8e50020b5df9a2d41b166d83 Mon Sep 17 00:00:00 2001
From: Zefa Chen <zefa.chen@rock-chips.com>
Date: Thu, 02 Sep 2021 15:07:13 +0800

Subject: [PATCH] media: rockchip: cif fix errors in rgb24 data format
Signed-off-by: Zefa Chen <zefa.chen@rock-chips.com>
Change-Id: I0766997860f06dc25e604c2ea8425049a987fdc5

---

diff --git a/drivers/media/platform/rockchip/cif/capture.c b/drivers/media/platform/rockchip/cif/capture.c
index 6c0aa7d..36bd2c9 100644
--- a/drivers/media/platform/rockchip/cif/capture.c
+++ b/drivers/media/platform/rockchip/cif/capture.c
@@ -1785,13 +1785,11 @@
     * needs aligned with :ALIGN(bits_per_pixel * width * 2, 8), to optimize
reading and
     * writing of ddr, aliged with 256
     */

-   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact) {
+   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact &&
+      fmt->csi_fmt_val != CSI_WRDDR_TYPE_RGB888) {
       channel->virtual_width = ALIGN(channel->width * fmt->raw_bpp / 8, 256);
    } else {
-      if (fmt->fmt_type == CIF_FMT_TYPE_RAW && fmt->csi_fmt_val !=
CSI_WRDDR_TYPE_RAW8)
-         channel->virtual_width = ALIGN(channel->width * 2, 8);
-      else
-         channel->virtual_width = ALIGN(channel->width * fmt->bpp[0] / 8, 8);
+      channel->virtual_width = ALIGN(channel->width * fmt->bpp[0] / 8, 8);
    }


    if (channel->fmt_val == CSI_WRDDR_TYPE_RGB888)
@@ -3240,7 +3238,8 @@

       if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact &&
          (dev->active_sensor->mbus.type == V4L2_MBUS_CSI2 ||
-         dev->active_sensor->mbus.type == V4L2_MBUS_CCP2)) {
+         dev->active_sensor->mbus.type == V4L2_MBUS_CCP2) &&
+         fmt->csi_fmt_val != CSI_WRDDR_TYPE_RGB888) {
          bpl = ALIGN(width * fmt->raw_bpp / 8, 256);
       } else {
          bpp = rkcif_align_bits_per_pixel(stream, fmt, i);
@@ -4659,13 +4658,11 @@

     * needs aligned with :ALIGN(bits_per_pixel * width * 2, 8), to optimize
reading and
     * writing of ddr, aliged with 256
     */
-   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact) {
+   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact &&
+      fmt->csi_fmt_val != CSI_WRDDR_TYPE_RGB888) {
       *crop_vwidth = ALIGN(raw_width * fmt->raw_bpp / 8, 256);
    } else {
-      if (fmt->fmt_type == CIF_FMT_TYPE_RAW)
-         *crop_vwidth = ALIGN(raw_width * 2, 8);
-      else
-         *crop_vwidth = ALIGN(raw_width * fmt->bpp[0] / 8, 8);

+      *crop_vwidth = ALIGN(raw_width * fmt->bpp[0] / 8, 8);
    }
if (channel->fmt_val == CSI_WRDDR_TYPE_RGB888)
```

<!-- source: CN V2.7 p74; unit 446 -->

<!-- source: CN V2.7 p75; unit 447 -->

<!-- source: CN V2.7 p75; unit 448 -->

rk628-dsi gibt standardmäßig im Befehlsmodus aus; auch der CIF-Empfang muss den Befehlsmodus verwenden. Ändern Sie Folgendes:

<!-- source: CN V2.7 p75; unit 449 -->

```text
diff --git a/drivers/media/platform/rockchip/cif/capture.c b/drivers/media/platform/rockchip/cif/capture.c

index 36bd2c99c707..fc4181daed2c 100644
--- a/drivers/media/platform/rockchip/cif/capture.c
+++ b/drivers/media/platform/rockchip/cif/capture.c
@@ -1753,7 +1753,7 @@ static int rkcif_csi_channel_init(struct rkcif_stream
*stream,

      channel->fmt_val = stream->cif_fmt_out->csi_fmt_val;

-     channel->cmd_mode_en = 0; /* default use DSI Video Mode */
+     channel->cmd_mode_en = 1; /* default use DSI Video Mode */

      if (stream->crop_enable) {
           channel->crop_en = 1;
```

<!-- source: CN V2.7 p75; unit 450 -->

Anbindung an das Kamera-Framework

<!-- source: CN V2.7 p75; unit 451 -->

RK356X-Hosts können nur das Kamera-Framework verwenden, das RGB nicht direkt zur Anzeige weiterleiten kann. Fügen Sie die Bibliothek rgb2yuv hinzu.

<!-- source: CN V2.7 p75; unit 452 -->

Fügen Sie CameraHal die folgende rgb2yuv-Bibliothek hinzu. Wenden Sie bei Android-11-R9-SDK-Code rk356x_HAL3_support_rgb2yuv_patch.rar direkt an.

<!-- source: CN V2.7 p75; unit 453 -->

Nehmen Sie bei R10 oder R11 zunächst die folgende Änderung unter hardware/rockchip/camera vor und wenden Sie anschließend den obigen Patch an.

<!-- source: CN V2.7 p75; unit 454 -->

```text
diff --git a/psl/rkisp2/RKISP2GraphConfig.cpp b/psl/rkisp2/RKISP2GraphConfig.cpp
index 2a5fa5a..3d2409c 100755
--- a/psl/rkisp2/RKISP2GraphConfig.cpp

+++ b/psl/rkisp2/RKISP2GraphConfig.cpp
@@ -76,6 +76,7 @@ const string MEDIACTL_POSTVIEWNAME = "postview";

 const string MEDIACTL_STATNAME = "rkisp1-statistics";
 const string MEDIACTL_VIDEONAME_CIF = "stream_cif_dvp_id0";
+const string MEDIACTL_VIDEONAME_CIF_MIPI_ID0 = "stream_cif_mipi_id0";

 RKISP2GraphConfig::RKISP2GraphConfig() :
      mManager(nullptr),
@@ -2620,6 +2621,13 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
            addLinkParams("rkisp-isp-subdev", 2, "rkisp_mainpath", 0, 1,

MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
            addLinkParams("rkisp-isp-subdev", 2, "rkisp_selfpath", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
         }
+     } else if(mipName2.find("mipi") != std::string::npos) {
+        addLinkParams(mipName, mipSrcPad, mipName2, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 1, "stream_cif_mipi_id0", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 2, "stream_cif_mipi_id1", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 3, "stream_cif_mipi_id2", 0, 1,

MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 4, "stream_cif_mipi_id3", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        mSensorLinkedToCIF = true;
      } else {
         addLinkParams(mipName, mipSrcPad, csiName, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
         addLinkParams(csiName, csiSrcPad, IspName, ispSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
@@ -2628,6 +2636,12 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
         addLinkParams(csiName, 5, "rkisp_rawwr3", 0, 1,

MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
      }
   }
+  if(mSensorLinkedToCIF){
+     addImguVideoNode(IMGU_NODE_VIDEO, MEDIACTL_VIDEONAME_CIF_MIPI_ID0,
mediaCtlConfig);
+     addFormatParams(MEDIACTL_VIDEONAME_CIF_MIPI_ID0, mCurSensorFormat.width,
mCurSensorFormat.height,
+           0, V4L2_PIX_FMT_NV12, 0, 0, mediaCtlConfig);
+     return OK;
+  }
   // isp input pad format and selection config
   addFormatParams(IspName, ispInWidth, ispInHeight, ispSinkPad, ispInFormat,

0, 0, mediaCtlConfig);
   addSelectionParams(IspName, ispInWidth, ispInHeight, 0, 0,
V4L2_SEL_TGT_CROP, ispSinkPad, mediaCtlConfig);
```

<!-- source: CN V2.7 p76; unit 455 -->

<!-- source: CN V2.7 p76; unit 456 -->

Dieser Patch gilt nur für RK3568+ANDROID11.

<!-- source: CN V2.7 p76; unit 457 -->

Anbindung an das TV-Framework

<!-- source: CN V2.7 p76; unit 458 -->

Bei RK3588 oder RK3576 kann HDMI-zu-DSI über das TV-Framework RGB888 ohne rgb2yuv-Bibliothek direkt zur Anzeige weiterleiten. Siehe APK-Anpassung weiter unten.

<!-- source: CN V2.7 p76; unit 459 -->

##### 6.3.4.2 RK628F/H

<!-- source: CN V2.7 p76; unit 460 -->

RK628F/H behebt die bei RK628D durch Konvertierung/Abwärtsabtastung verschiedener Eingabeformate verursachten Farbabweichungen.

<!-- source: CN V2.7 p76; unit 461 -->

Für Anwendungen mit hohen Bildqualitätsanforderungen kann RK628F/H RGB888 über DSI ausgeben. Hosts wie RK3588 können RGB888 empfangen und ohne Farbkonvertierung direkt über TV anzeigen; laut Quelle bleibt so die Bildqualität erhalten. RK628F/H besitzt zwei MIPI-DSI-Schnittstellen und unterstützt außerdem eine Dual-MIPI-Verbindung zu RK3588.

<!-- source: CN V2.7 p76; unit 462 -->

Dual-MIPI-Beispiel RK3588 + RK628F/H:

<!-- source: CN V2.7 p76; unit 463 -->

Nur compatible muss auf den DSI-Wert geändert werden.

<!-- source: CN V2.7 p76; unit 464 -->

```text
......
&i2c3 {

   status = "okay";
   clock-frequency = <400000>;
   rk628_csi: rk628_csi@50 {
      reg = <0x50>;

      compatible = "rockchip,rk628-dsi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio1>;
      interrupts = <RK_PB2 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA7 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio1 RK_PB1 GPIO_ACTIVE_HIGH>;
      plugin-det-gpios = <&gpio2 RK_PB6 GPIO_ACTIVE_LOW>;

      rockchip,camera-module-index = <0>;

      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI2";
      rockchip,camera-module-lens-name = "RK628-CSI";

      multi-dev-info {
         dev-idx-l = <2>;
         dev-idx-r = <4>;
         combine-idx = <2>;
         pixel-offset = <0>;
         dev-num = <2>;
      };

      port {

         hdmiin_out1: endpoint {
           remote-endpoint = <&hdmi_mipi2_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};
......
```

<!-- source: CN V2.7 p77; unit 465 -->

<!-- source: CN V2.7 p77; unit 466 -->

#### 6.3.5 HDMI2BT1120-Konvertierung

<!-- source: CN V2.7 p77; unit 467 -->

Die HDMI2BT1120-Pfadkonfiguration ist bei RK628D und RK628F/H im Wesentlichen gleich und wird daher nicht wiederholt.

<!-- source: CN V2.7 p77; unit 468 -->

Beispiel RK3568 + BT1120_V4L2:

<!-- source: CN V2.7 p77; unit 469 -->

```text
&i2c4 {
   pinctrl-names = "default";
   pinctrl-0 = <&i2c4m1_xfer>;

   clock-frequency = <400000>;
   status = "okay";

   rk628_bt1120: rk628_bt1120@50 {
      compatible = "rockchip,rk628-bt1120-v4l2";
      reg = <0x50>;
      status = "disabled";
      pinctrl-names = "default";
      pinctrl-0 = <&cif_dvp_clk &cif_dvp_bus16 &cif_dvp_bus8>;
      interrupt-parent = <&gpio2>;
      interrupts = <15 IRQ_TYPE_LEVEL_HIGH>;

      enable-gpios = <&gpio2 RK_PC0 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio2 RK_PB0 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio1 RK_PA2 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-BT1120";
      rockchip,camera-module-lens-name = "NC";
      dual-edge = <1>;

      port {
         lt8619c_out: endpoint {
           remote-endpoint = <&cif_para_in>;

           bus-width = <16>;
           pclk-sample = <1>;
         };
      };
   };
};

&rkcif_dvp {
   status = "okay";

   port {
      /* Parallel bus endpoint */
      cif_para_in: endpoint {

         remote-endpoint = <&lt8619c_out>;
      };
   };
};

&rkcif {
   status = "okay";
};

&rkcif_mmu {
   status = "okay";
};
```

<!-- source: CN V2.7 p78; unit 470 -->

<!-- source: CN V2.7 p78; unit 471 -->

### 6.4 HDCP aktivieren

<!-- source: CN V2.7 p78; unit 472 -->

RK628 HDMIRX unterstützt HDCP1.4. HDCP ist standardmäßig deaktiviert; aktivieren Sie es bei Bedarf:

<!-- source: CN V2.7 p78; unit 473 -->

1\. Aktivieren Sie HDCP im RK628-DTS-Knoten.

<!-- source: CN V2.7 p78; unit 474 -->

```text
           reset-gpios = <&gpio7 RK_PB4 GPIO_ACTIVE_LOW>;
           plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;

           power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
+          hdcp-enable = <1>;
```

<!-- source: CN V2.7 p79; unit 475 -->

2\. Programmieren Sie den HDCP-RX-Schlüssel.

<!-- source: CN V2.7 p79; unit 476 -->

HDCP-Schlüssel müssen bei der HDCP-Vereinigung erworben werden; Rockchip stellt sie nicht bereit. Das Original unterscheidet TX und „RK Key“ und verlangt „RK Key“. Diese Schreibweise widerspricht der RX-Überschrift und bleibt als Unklarheit der Quelle dokumentiert, statt stillschweigend korrigiert zu werden.

<!-- source: CN V2.7 p79; unit 477 -->

Verwenden Sie nach Erhalt der Schlüsselquelldatei KeyConverter, um die Schlüssel aufzuteilen und in .skf-Programmierdateien umzuwandeln; befolgen Sie die Werkzeuganleitung.

<!-- source: CN V2.7 p79; unit 478 -->

Programmieren Sie die .skf-Datei mit RKDevInfoWriteTool, das den Schlüssel verschlüsselt. Siehe Werkzeuganleitung.

<!-- source: CN V2.7 p79; unit 479 -->

### 6.5 Scaler aktivieren

<!-- source: CN V2.7 p79; unit 480 -->

Einige Hosts können MIPI 4K nicht empfangen, obwohl RK628 HDMI IN 4K-Eingang akzeptiert. Ergänzen Sie folgende DTS-Konfiguration, um CSI unabhängig von der Eingangsauflösung mit 1080P auszugeben:

<!-- source: CN V2.7 p79; unit 481 -->

```text
           reset-gpios = <&gpio7 RK_PB4 GPIO_ACTIVE_LOW>;
           plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
           power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;

+          scaler-en = <1>;
```

<!-- source: CN V2.7 p79; unit 482 -->

### 6.6 CSI mit zwei Lanes

<!-- source: CN V2.7 p79; unit 483 -->

CSI verwendet standardmäßig 4 Lanes:

<!-- source: CN V2.7 p79; unit 484 -->

```text
csi->csi_lanes_in_use = USE_4_LANES;
```

<!-- source: CN V2.7 p79; unit 485 -->

Setzen Sie für 2 Lanes csi->csi_lanes_in_use auf 2.

<!-- source: CN V2.7 p79; unit 486 -->

### 6.7 Kontinuierliches und nicht kontinuierliches MIPI

<!-- source: CN V2.7 p79; unit 487 -->

Konfigurieren Sie DTS zum Aktivieren des kontinuierlichen MIPI-Modus:

<!-- source: CN V2.7 p79; unit 488 -->

```text
continues-clk = <1>;
```

<!-- source: CN V2.7 p79; unit 489 -->

### 6.8 Dual-MIPI-Konfiguration (nur RK628F/H)

<!-- source: CN V2.7 p79; unit 490 -->

Die MIPI-DPHY-Datenrate begrenzt RK628F/H bei einer MIPI-Schnittstelle auf 4K30. RK628F/H besitzt zwei MIPI-CSI-Schnittstellen. Bei Hosts wie RK3588/RK3562 mit mehreren CSI-Eingängen lässt sich 4K60-Video in eine linke und rechte Hälfte teilen, über zwei MIPI-CSI-Verbindungen mit jeweils 4 Lanes übertragen und im Host wieder zu 4K60 zusammensetzen.

<!-- source: CN V2.7 p79; unit 491 -->

Laut Quelle setzen Hosts wie RK3588 die Bilder direkt im VI-Treiber ohne zusätzliche Latenz oder Last zusammen. Dies ist eine Aussage der Quelle, keine ArmSoM-Messung.

<!-- source: CN V2.7 p80; unit 492 -->

#### 6.8.1 Dual-MIPI-Teilungsmodus

<!-- source: CN V2.7 p80; unit 493 -->

RK628F/H kann das HDMIRX-Bild intern in eine linke und rechte Hälfte teilen und jede über eine CSI-Schnittstelle ausgeben:

<!-- source: CN V2.7 p80; unit 494 -->

![Technische Originalabbildung — EN V2.3, S. 72](/docs/rockchip-rk628-porting/assets/en-p72-X413.png)

*Technische Originalabbildung: EN V2.3, S. 72.*

<!-- source: CN V2.7 p80; unit 495 -->

So können Hosts mit mehreren MIPI-Schnittstellen wie RK3588 4K60 über Dual-MIPI empfangen. Der Funktionsablauf ist nachfolgend dargestellt.

<!-- source: CN V2.7 p80; unit 496 -->

![Technische Originalabbildung — EN V2.3, S. 72](/docs/rockchip-rk628-porting/assets/en-p72-X414.png)

*Technische Originalabbildung: EN V2.3, S. 72.*

<!-- source: CN V2.7 p80; unit 497 -->

#### 6.8.2 Dual-MIPI-Konfiguration

<!-- source: CN V2.7 p80; unit 498 -->

Die folgende Konfiguration verbindet RK628F/H über Dual-MIPI mit RK3588 für 4K60-HDMI-IN.

<!-- source: CN V2.7 p80; unit 499 -->

Zum Dual-MIPI-Debugging mit Rockchip-SoCs siehe Rockchip_RK3588_HDMI_To_CSI_Dual_Mipi_Developer_Guide unter RKDocs/common/camera/HAL3 im SDK.

<!-- source: CN V2.7 p80; unit 500 -->

##### 6.8.2.1 RK628F/H-Konfiguration

<!-- source: CN V2.7 p80; unit 501 -->

Der RK628F/H-Treiber unterstützt Dual-MIPI und verwendet standardmäßig zwei CSI-Schnittstellen für 4K60-HDMI-IN. Die DTS-Felder von multi-dev-info sind:

<!-- source: CN V2.7 p80; unit 502 -->

dev-idx-l: MIPI-Schnittstellenindex für die linke Bildhälfte.

<!-- source: CN V2.7 p80; unit 503 -->

dev-idx-r: MIPI-Schnittstellenindex für die rechte Bildhälfte.

<!-- source: CN V2.7 p80; unit 504 -->

combine-idx: Index, unter dem beide Bildhälften zusammengeführt werden; verwenden Sie diesen Index für den DTS-Pfad.

<!-- source: CN V2.7 p81; unit 505 -->

pixel-offset: Pixelversatz, standardmäßig 0.

<!-- source: CN V2.7 p81; unit 506 -->

dev-num: Anzahl der zusammenzuführenden MIPI-Geräte.

<!-- source: CN V2.7 p81; unit 507 -->

Beispiel: RK628F/H CSI0/1 mit RK3588 CSI0/1 RX verbunden:

<!-- source: CN V2.7 p81; unit 508 -->

```text
&i2c3 {
   status = "okay";

   clock-frequency = <400000>;

   rk628_csi: rk628_csi@50 {
      reg = <0x50>;
      compatible = "rockchip,rk628-csi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio1>;
      interrupts = <RK_PB2 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA7 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio1 RK_PB1 GPIO_ACTIVE_HIGH>;

      plugin-det-gpios = <&gpio2 RK_PB6 GPIO_ACTIVE_LOW>;
      continues-clk = <1>;

      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI2";
      rockchip,camera-module-lens-name = "RK628-CSI";

      multi-dev-info {
         dev-idx-l = <2>;
         dev-idx-r = <4>;
         combine-idx = <2>;

         pixel-offset = <0>;
         dev-num = <2>;
      };

      port {
         hdmiin_out1: endpoint {
           remote-endpoint = <&hdmi_mipi2_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p81; unit 509 -->

##### 6.8.2.2 Anforderungen an den Host-SoC-Treiber

<!-- source: CN V2.7 p81; unit 510 -->

Die Quelle nennt RK3588/RK3562/RK3576 als Rockchip-Hosts mit Dual-MIPI-Unterstützung; erforderlich ist Code der kernel-5.10-Generation oder neuer. Der Host-Code muss ausreichend aktuell sein; aktualisieren Sie das Android-12/13-SDK gemäß der Quellenempfehlung. Ein allein aktualisierter RK628-Treiber für kernel-

<!-- source: CN V2.7 p81; unit 511 -->

5.10 kann Kompilierungsfehler verursachen, wenn das restliche SDK für Dual-MIPI zu alt ist. Aktualisieren Sie das SDK oder kontaktieren Sie Rockchip-Entwickler über Redmine.

<!-- source: CN V2.7 p82; unit 512 -->

### 6.9 Empfangsfähigkeiten nach Chip

<!-- source: CN V2.7 p82; unit 513 -->

Die maximale Empfangsfähigkeit hängt von der ISP/VICAP-Leistung der Plattform ab. Siehe Tabelle:

<!-- source: CN V2.7 p82; unit 514 -->

| SoC-Plattform | Empfangscontroller | Maximal unterstützte Auflösung |
| --- | --- | --- |
| RK3288/RK3326/RK3368 | isp | 1920x1080P60 |
| RK3399 | isp | 3840x2160P30 (ISP-Übertaktung erforderlich) |
| RK3566/RK3568 | vicap/isp | 3840x2160P30 (bei ISP-Anbindung maximal 1080P60) |
| RK3588/RK3562/RK3576 | vicap | 3840x2160P60 (Dual-MIPI) |

<!-- source: CN V2.7 p82; unit 515 -->

#### 6.9.1 ISP-Übertaktung konfigurieren

<!-- source: CN V2.7 p82; unit 516 -->

Konfigurieren Sie RK3399 PLL_NPLL auf 650M:

<!-- source: CN V2.7 p82; unit 517 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3399-vop-clk-set.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399-vop-clk-set.dtsi
@@ -148,7 +148,7 @@

                  <50000000>, <100000000>,
                  <75000000>, <75000000>,
                  <816000000>, <816000000>,
-                 <600000000>, <200000000>,
+                 <650000000>, <200000000>,
                  <800000000>, <150000000>,
                  <75000000>, <37500000>,
                  <300000000>, <100000000>,
```

<!-- source: CN V2.7 p82; unit 518 -->

Ändern Sie die maximal unterstützte ISP-Frequenz des RK3399 auf 650M:

<!-- source: CN V2.7 p82; unit 519 -->

```text
--- a/drivers/media/platform/rockchip/isp1/dev.c
+++ b/drivers/media/platform/rockchip/isp1/dev.c
@@ -757,7 +757,7 @@ static const unsigned int rk3368_isp_clk_rate[] = {


 /* isp clock adjustment table (MHz) */
 static const unsigned int rk3399_isp_clk_rate[] = {
-     300, 400, 600
+     300, 400, 650
 };

 static struct isp_irqs_data rk1808_isp_irqs[] = {
```

<!-- source: CN V2.7 p82; unit 520 -->

Bei sporadischen RK3288-ISP-Fehlern kann ebenfalls eine höhere ISP-Frequenz erprobt werden. Gewöhnlich muss nur die höchste Frequenz verbleiben. Diese Änderung dient ausschließlich der Diagnose.

<!-- source: CN V2.7 p83; unit 521 -->

```text
--- a/drivers/media/platform/rockchip/isp1/dev.c
+++ b/drivers/media/platform/rockchip/isp1/dev.c
@@ -849,7 +849,7 @@ static const unsigned int rk1808_isp_clk_rate[] = {


 /* isp clock adjustment table (MHz) */
static const unsigned int rk3288_isp_clk_rate[] = {
-     150, 384, 500, 594
+     594
 };
```

<!-- source: CN V2.7 p83; unit 522 -->

Konfigurieren Sie die ISP-Frequenz im Konvertertreiber.

<!-- source: CN V2.7 p83; unit 523 -->

```text
#define RK628_CSI_PIXEL_RATE_HIGH 600000000
...


static int rk628_csi_set_fmt(struct v4l2_subdev *sd,
           struct v4l2_subdev_pad_config *cfg,
           struct v4l2_subdev_format *format)
{
...
      if ((mode->width == 3840) && (mode->height == 2160)) {
           v4l2_dbg(1, debug, sd,
                 "%s res wxh:%dx%d, link freq:%llu, pixrate:%u\n",
                 __func__, mode->width, mode->height,
                 link_freq_menu_items[1], RK628_CSI_PIXEL_RATE_HIGH);
           __v4l2_ctrl_s_ctrl(csi->link_freq, 1);
           __v4l2_ctrl_s_ctrl_int64(csi->pixel_rate,

                 RK628_CSI_PIXEL_RATE_HIGH);
      }
...
}
```

<!-- source: CN V2.7 p83; unit 524 -->

Der ISP-Treiber addiert eine Reserve von 25% zur konfigurierten Frequenz; setzen Sie daher RK628_CSI_PIXEL_RATE_HIGH im Treiber entsprechend.

<!-- source: CN V2.7 p83; unit 525 -->

```text
drivers/media/platform/rockchip/isp1/dev.c

static int __isp_pipeline_s_isp_clk(struct rkisp1_pipeline *p)

{
...
      ctrl = v4l2_ctrl_find(sd->ctrl_handler, V4L2_CID_PIXEL_RATE);
      if (!ctrl) {
           v4l2_warn(sd, "No pixel rate control in subdev\n");
           return -EPIPE;
      }

      /* calculate data rate */
      data_rate = v4l2_ctrl_g_ctrl_int64(ctrl) *
              dev->isp_sdev.in_fmt.bus_width;
      data_rate >>= 3;
      do_div(data_rate, 1000 * 1000);


      /* increase 25% margin */
      data_rate += data_rate >> 2;
...
}
```

<!-- source: CN V2.7 p84; unit 526 -->

<!-- source: CN V2.7 p84; unit 527 -->

#### 6.9.2 ISP für CMA-Speicher konfigurieren

<!-- source: CN V2.7 p84; unit 528 -->

Auf einigen Plattformen kann die Systemlast während des HDMI-IN-Empfangs zu unzureichender Bandbreite und damit zu verlorenen Bildern oder MIPI-Fehlern führen. Beispiel eines Fehlerprotokolls:

<!-- source: CN V2.7 p84; unit 529 -->

```text
[ 228.999567] rkisp1: MIPI mis error: 0x00800000
[ 228.999925] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 228.999976] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:

CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000081] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000187] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000294] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
```

<!-- source: CN V2.7 p84; unit 530 -->

Erhöhen Sie die DDR-Frequenz. Hilft dies nicht, reservieren Sie zur Verbesserung CMA-Speicher für ISP:

<!-- source: CN V2.7 p84; unit 531 -->

Reservieren Sie 128MB CMA in rockchip_defconfig.

<!-- source: CN V2.7 p84; unit 532 -->

```text
CONFIG_CMA=y
CONFIG_CMA_SIZE_MBYTES=128
```

<!-- source: CN V2.7 p84; unit 533 -->

Deaktivieren Sie ISP IOMMU in DTS und verwenden Sie CMA-Speicher.

<!-- source: CN V2.7 p84; unit 534 -->

```text
&isp_mmu {
      status = "disabled";

};
```

<!-- source: CN V2.7 p84; unit 535 -->

### 6.10 EDID-Konfiguration

<!-- source: CN V2.7 p84; unit 536 -->

RK628 unterstützt die EDID-Konfiguration. Der aktuelle Quelltreiber meldet gängige Auflösungen, darunter:

<!-- source: CN V2.7 p84; unit 537 -->

3840x2160P60, 3840x2160P30, 1920x1080P60, 1920x1080P30, 1280x720P60, 720x576P50 und 720x480P60. Ändern Sie zur Anpassung der unterstützten Auflösungen EDID direkt im Treiber:

<!-- source: CN V2.7 p84; unit 538 -->

```text
static u8 rk628f_edid_init_data[] = {
   0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
   0x24, 0xD0, 0x8F, 0x62, 0x01, 0x00, 0x00, 0x00,

   0x2D, 0x21, 0x01, 0x03, 0x80, 0x78, 0x44, 0x78,
   0x0A, 0xCF, 0x74, 0xA3, 0x57, 0x4C, 0xB0, 0x23,
   0x09, 0x48, 0x4C, 0x21, 0x08, 0x00, 0x61, 0x40,
   0x01, 0x01, 0x81, 0x00, 0x95, 0x00, 0xA9, 0xC0,
   0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x08, 0xE8,
   0x00, 0x30, 0xF2, 0x70, 0x5A, 0x80, 0xB0, 0x58,
   0x8A, 0x00, 0xC4, 0x8E, 0x21, 0x00, 0x00, 0x1E,
   0x02, 0x3A, 0x80, 0x18, 0x71, 0x38, 0x2D, 0x40,
   0x58, 0x2C, 0x45, 0x00, 0xB9, 0xA8, 0x42, 0x00,
   0x00, 0x1E, 0x00, 0x00, 0x00, 0xFC, 0x00, 0x49,
   0x46, 0x50, 0x20, 0x44, 0x69, 0x73, 0x70, 0x6C,

   0x61, 0x79, 0x0A, 0x20, 0x00, 0x00, 0x00, 0xFD,
   0x00, 0x3B, 0x46, 0x1F, 0x8C, 0x3C, 0x00, 0x0A,
   0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x01, 0xA8,

   0x02, 0x03, 0x39, 0xF2, 0x4D, 0x01, 0x03, 0x12,
   0x13, 0x84, 0x22, 0x1F, 0x90, 0x5D, 0x5E, 0x5F,
   0x60, 0x61, 0x23, 0x09, 0x07, 0x07, 0x83, 0x01,
   0x00, 0x00, 0x6D, 0x03, 0x0C, 0x00, 0x10, 0x00,
   0x00, 0x44, 0x20, 0x00, 0x60, 0x03, 0x02, 0x01,
   0x67, 0xD8, 0x5D, 0xC4, 0x01, 0x78, 0xC0, 0x00,
   0xE3, 0x05, 0x03, 0x01, 0xE4, 0x0F, 0x00, 0x18,
   0x00, 0x02, 0x3A, 0x80, 0x18, 0x71, 0x38, 0x2D,

   0x40, 0x58, 0x2C, 0x45, 0x00, 0xB9, 0xA8, 0x42,
   0x00, 0x00, 0x1E, 0x08, 0xE8, 0x00, 0x30, 0xF2,
   0x70, 0x5A, 0x80, 0xB0, 0x58, 0x8A, 0x00, 0xC4,
   0x8E, 0x21, 0x00, 0x00, 0x1E, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x93,
};
```

<!-- source: CN V2.7 p85; unit 539 -->

<!-- source: CN V2.7 p85; unit 540 -->

Die Quelle empfiehlt diesen EDID-Editor (historischer Quellenlink, kein aktuell geprüfter Download): http://www.quantumdata.com/support/downloads/980/release_5_05/R_980mgr_5.05_Win32.msi

<!-- source: CN V2.7 p85; unit 541 -->

### 6.11 camera3_profiles.xml konfigurieren

<!-- source: CN V2.7 p85; unit 542 -->

Die Vorschau über das Kamera-Framework benötigt eine Anpassung von camera3_profiles.xml zur Registrierung des Kamerageräts.

<!-- source: CN V2.7 p85; unit 543 -->

camera3_profiles.xml liegt im SDK-Verzeichnis des jeweiligen Chips:

<!-- source: CN V2.7 p85; unit 544 -->

```text
hardware/rockchip/camera/etc/camera/camera3_profiles_rk3xxx.xml
```

<!-- source: CN V2.7 p85; unit 545 -->

Es folgen wichtige Konfigurationspunkte. Einzelheiten siehe SoC-Sensor-Konfiguration.

<!-- source: CN V2.7 p85; unit 546 -->

name: muss einschließlich Groß-/Kleinschreibung dem Treibernamen entsprechen.

<!-- source: CN V2.7 p85; unit 547 -->

moduleId: muss index im DTS des Treibers entsprechen.

<!-- source: CN V2.7 p85; unit 548 -->

![Technische Originalabbildung — EN V2.3, S. 78](/docs/rockchip-rk628-porting/assets/en-p78-X436.png)

*Technische Originalabbildung: EN V2.3, S. 78.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
</Profiles>
<Profiles cameraId="0" name="rk628-csi" moduleId="m00">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
```

<!-- source: CN V2.7 p86; unit 549 -->

![Technische Originalabbildung — EN V2.3, S. 78](/docs/rockchip-rk628-porting/assets/en-p78-X437.png)

*Technische Originalabbildung: EN V2.3, S. 78.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
&rk628_csi {
    status = "okay";
    /*
     * If the hpd output level is inverted on the circuit,
     * the following configuration needs to be enabled.
     */
    /* hpd-output-inverted; */
    plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
    power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
    rockchip,camera-module-index = <0>;
    rockchip,camera-module-facing = "back";
    rockchip,camera-module-name = "RK628-CSI";
    rockchip,camera-module-lens-name = "NC";
```

<!-- source: CN V2.7 p86; unit 550 -->

scaler.availableStreamConfigurations/scaler.availableMinFrameDurations/scaler.availableStallDurations: unterstützte Auflösungen und minimale Bildintervalle korrekt angeben. Ergänzen Sie passende Einträge, sobald der Treiber eine Auflösung hinzufügt.

<!-- source: CN V2.7 p86; unit 551 -->

![Technische Originalabbildung — EN V2.3, S. 79](/docs/rockchip-rk628-porting/assets/en-p79-X441.png)

*Technische Originalabbildung: EN V2.3, S. 79.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
<scaler.availableStreamConfigurations value="BLOB,3840x2160,OUTPUT,
    BLOB,1920x1080,OUTPUT,
    BLOB,1280x720,OUTPUT,
    BLOB,720x576,OUTPUT,
    BLOB,720x480,OUTPUT,
    YCbCr_420_888,3840x2160,OUTPUT,
    YCbCr_420_888,1920x1080,OUTPUT,
    YCbCr_420_888,1280x720,OUTPUT,
    YCbCr_420_888,720x576,OUTPUT,
    YCbCr_420_888,720x480,OUTPUT,
    IMPLEMENTATION_DEFINED,3840x2160,OUTPUT,
    IMPLEMENTATION_DEFINED,1920x1080,OUTPUT,
    IMPLEMENTATION_DEFINED,1280x720,OUTPUT,
    IMPLEMENTATION_DEFINED,720x576,OUTPUT,
    IMPLEMENTATION_DEFINED,720x480,OUTPUT" />
<scaler.availableMinFrameDurations value="BLOB,3840x2160,33333333,
    BLOB,1920x1080,16666667,
    BLOB,1280x720,16666667,
    BLOB,720x576,20000000,
    BLOB,720x480,16666667,
    YCbCr_420_888,3840x2160,33333333,
    YCbCr_420_888,1920x1080,16666667,
    YCbCr_420_888,1280x720,16666667,
    YCbCr_420_888,720x576,20000000,
    YCbCr_420_888,720x480,16666667,
    IMPLEMENTATION_DEFINED,3840x2160,33333333,
    IMPLEMENTATION_DEFINED,1920x1080,16666667,
    IMPLEMENTATION_DEFINED,1280x720,16666667,
    IMPLEMENTATION_DEFINED,720x576,20000000,
    IMPLEMENTATION_DEFINED,720x480,16666667"/>
<scaler.availableStallDurations value="BLOB,3840x2160,33333333,
    BLOB,1920x1080,16666667,
    BLOB,1280x720,16666667,
    BLOB,720x576,20000000,
    BLOB,720x480,16666667"/>
```

<!-- source: CN V2.7 p87; unit 552 -->

sensor.orientation: Bilddrehung; unterstützt 0, 90, 180 und 270.

<!-- source: CN V2.7 p87; unit 553 -->

![Technische Originalabbildung — EN V2.3, S. 79](/docs/rockchip-rk628-porting/assets/en-p79-X442.png)

*Technische Originalabbildung: EN V2.3, S. 79.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
<sensor.maxAnalogSensitivity value="2400"/>
<sensor.orientation value="0"/>
<sensor.profileHueSatMapDimensions value="0,0,0"/>
```

<!-- source: CN V2.7 p87; unit 554 -->

### 6.12 HDMI-IN-APK anpassen

<!-- source: CN V2.7 p87; unit 555 -->

#### 6.12.1 Android 9/10/11

<!-- source: CN V2.7 p87; unit 556 -->

Android 9/10/11 verwendet kernel-4.4/kernel-4.19 und das For-All-Patchpaket. Nur cameraHAL3 steht zur Verfügung.

<!-- source: CN V2.7 p87; unit 557 -->

##### 6.12.1.1 APK-Quellen beziehen und bauen

<!-- source: CN V2.7 p87; unit 558 -->

Die APK-Quellen liegen in diesem SDK-Verzeichnis:

<!-- source: CN V2.7 p87; unit 559 -->

```text
RKDocs/common/hdmi-in/apk/rkCamera2_based_on_CameraHal3_V1.3.tar.gz
```

<!-- source: CN V2.7 p87; unit 560 -->

Kopieren und entpacken Sie die Quellen nach:

<!-- source: CN V2.7 p87; unit 561 -->

```text
packages/apps/
```

<!-- source: CN V2.7 p87; unit 562 -->

Ändern Sie für RK3288 device/rockchip/rk3288/ wie folgt, um rkCamera2 zu bauen:

<!-- source: CN V2.7 p87; unit 563 -->

```text
diff --git a/device.mk b/device.mk
index 6667b5c..96f08f1 100644

--- a/device.mk
+++ b/device.mk
@@ -17,7 +17,8 @@
 PRODUCT_PACKAGES += \
   memtrack.$(TARGET_BOARD_PLATFORM) \
   WallpaperPicker \
-  Launcher3
+  Launcher3 \
+  rkCamera2

 #$_rbox_$_modify_$_zhengyang: add displayd
 PRODUCT_PACKAGES += \
```

<!-- source: CN V2.7 p87; unit 564 -->

##### 6.12.1.2 APK-Quellen anpassen

<!-- source: CN V2.7 p87; unit 565 -->

Die APK greift über ioctl auf den RK628-Geräteknoten zu, um Verbindungsstatus und Auflösung abzufragen. Der Knoten kann zwischen isp1/isp2/vicap-Pfaden variieren. Passen Sie die APK-Quellen an den tatsächlichen Knoten an; Beispiele zum Auffinden stehen bei den Debugging-Befehlen.

<!-- source: CN V2.7 p87; unit 566 -->

```text
rkCamera2/jni/native.cpp
```

<!-- source: CN V2.7 p88; unit 567 -->

![Technische Originalabbildung — EN V2.3, S. 81](/docs/rockchip-rk628-porting/assets/en-p81-X452.png)

*Technische Originalabbildung: EN V2.3, S. 81.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
static void openDevice(JNIEnv *env, jobject thiz)
{
    (void)*env;
    (void)thiz;

    char video_name[64];
    memset(video_name, 0, sizeof(video_name));
    strcat(video_name, "/dev/v4l-subdev2");

    camFd = open(video_name, O_RDWR);
    if (camFd < 0) {
        LOGE("open %s failed,erro=%s",video_name,strerror(errno));
    } else {
        LOGD("open %s success,fd=%d",video_name,camFd);
    }
}
```

<!-- source: CN V2.7 p88; unit 568 -->

Code zum Abfragen von Verbindungsstatus und Auflösung:

<!-- source: CN V2.7 p88; unit 569 -->

![Technische Originalabbildung — EN V2.3, S. 81](/docs/rockchip-rk628-porting/assets/en-p81-X453.png)

*Technische Originalabbildung: EN V2.3, S. 81.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
static void getDeviceFormat(int *format)
{
    struct v4l2_control control;
    memset(&control, 0, sizeof(struct v4l2_control));
    control.id = V4L2_CID_DV_RX_POWER_PRESENT;
    int err = ioctl(camFd, VIDIOC_G_CTRL, &control);
    if (err < 0) {
        LOGV("Set POWER_PRESENT failed ,%d(%s)", errno, strerror(errno));
    }

    unsigned int noSignalAndSync = 0;
    ioctl(camFd, VIDIOC_G_INPUT, &noSignalAndSync);
    LOGV("noSignalAndSync ? %s",noSignalAndSync?"YES":"NO");

    struct v4l2_dv_timings dv_timings;
    memset(&dv_timings, 0 ,sizeof(struct v4l2_dv_timings));
    err = ioctl(camFd, VIDIOC_SUBDEV_QUERY_DV_TIMINGS, &dv_timings);
    if (err < 0) {
        LOGV("Set VIDIOC_SUBDEV_QUERY_DV_TIMINGS failed ,%d(%s)", errno, strerror(errno));
    }

    format[0] = dv_timings.bt.width;
    format[1] = dv_timings.bt.height;
    format[2] = control.value && !noSignalAndSync;
}
```

<!-- source: CN V2.7 p88; unit 570 -->

Da die APK auf einen Geräteknoten zugreift, fordert die Quelle eine Prüfung mit getenforce, ob SELinux deaktiviert ist. Dies ist eine Debugging-Anweisung der Quelle, keine Sicherheitsempfehlung für den Produktivbetrieb:

<!-- source: CN V2.7 p88; unit 571 -->

![Technische Originalabbildung — EN V2.3, S. 81](/docs/rockchip-rk628-porting/assets/en-p81-X454.png)

*Technische Originalabbildung: EN V2.3, S. 81.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
rk3288:/ # getenforce
Enforcing
rk3288:/ # setenforce 0
rk3288:/ #
rk3288:/ # getenforce
Permissive
```

<!-- source: CN V2.7 p89; unit 572 -->

##### 6.12.1.3 APK-Debugging vorbereiten

<!-- source: CN V2.7 p89; unit 573 -->

Schließen Sie zunächst das Treiber-Debugging ab (siehe Treiber-Debugging). Prüfen Sie anschließend die Kameraregistrierung in CameraHal mit folgendem Befehl. Bei fehlerhafter Registrierung prüfen Sie camera3_profiles.xml gemäß dem zugehörigen Konfigurationsabschnitt.

<!-- source: CN V2.7 p89; unit 574 -->

![Technische Originalabbildung — EN V2.3, S. 82](/docs/rockchip-rk628-porting/assets/en-p82-X457.png)

*Technische Originalabbildung: EN V2.3, S. 82.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
rk3288:/ #
rk3288:/ # dumpsys media.camera

== Service global info: ==

Number of camera devices: 1
Number of normal camera devices: 1
    Device 0 maps to "0"
Active Camera Clients:
[]
Allowed user IDs: 0

== Camera service events log (most recent at top): ==
  04-08 11:08:31 : USER_SWITCH previous allowed user IDs: <None>, current allowed user IDs: 0
  01-18 08:50:15 : ADD device 0, reason: (Device status changed from 0 to 1)
  01-18 08:50:15 : ADD device 0, reason: (Device added)
```

<!-- source: CN V2.7 p89; unit 575 -->

#### 6.12.2 Android 12+

<!-- source: CN V2.7 p89; unit 576 -->

Android 12/13 verwendet kernel-5.10 und das passende Treiber-Patchpaket. Anwendungen verwenden entweder Kamera oder TV (nachfolgend auch TIF genannt). Zum Debugging siehe Rockchip_Android12+_HDMI_TO_MIPI_Developer_Guide.

<!-- source: CN V2.7 p89; unit 577 -->

Android14 verwendet kernel-6.1; der Treiber ist im SDK enthalten. Die Quelle empfiehlt das TV-Framework.

<!-- source: CN V2.7 p89; unit 578 -->

##### 6.12.2.1 APK-Quellen

<!-- source: CN V2.7 p89; unit 579 -->

packages/apps/TV/partner_support/samples: TV-Quelldatendienst, der über das Framework mit HAL und der Vorschau-APK interagiert. Er läuft als verborgener Dienst beim Systemstart; sein APK-Symbol wird daher im Launcher ausgeblendet.

<!-- source: CN V2.7 p89; unit 580 -->

hardware/rockchip/tv_input: TVHAL-Code zum Befehlsaustausch mit dem Treiber für Stream-Start/-Stopp, Hotplug und Auflösungsänderungen.

<!-- source: CN V2.7 p89; unit 581 -->

hardware/rockchip/camera: cameraHAL-Code für Kamera-Streaming, Einzelbildaufnahme und verwandte Funktionen.

<!-- source: CN V2.7 p89; unit 582 -->

vendor/rockchip/hardware/interfaces/hdmi: vom Kamerasystem verwendet; überwacht Auflösungsänderungen und Hotplug und kommuniziert mit Treiber und APK.

<!-- source: CN V2.7 p89; unit 583 -->

packages/apps/rkCamera2: Vorschau-APK mit zwei Ansichten. Die standardmäßige MainActivity zeigt die Vorschau über TIF und interagiert über das Framework mit dem TV-Quelldienst. RockchipCamera2 zeigt die Vorschau über Camera und öffnet mit der Standard-Camera-API die cameraid des MIPI-Knotens. Das Launcher-Symbol heißt HdmiIn. Kunden ersetzen sie häufig durch eine eigene Vorschau-APK.

<!-- source: CN V2.7 p89; unit 584 -->

HDMI IN ist im Standard-SDK deaktiviert. Setzen Sie die folgende Eigenschaft, um es zu aktivieren und die relevanten Module einschließlich der obigen APKs zu bauen:

<!-- source: CN V2.7 p89; unit 585 -->

```text
vim device/rockchip/rk3588/BoardConfig.mk
BOARD_HDMI_IN_SUPPORT := true
```

<!-- source: CN V2.7 p89; unit 586 -->

Aktivieren Sie für das Kamera-Framework:

<!-- source: CN V2.7 p90; unit 587 -->

```text
vim device/rockchip/rk3588/BoardConfig.mk
CAMERA_SUPPORT_HDMI := true
```

<!-- source: CN V2.7 p90; unit 588 -->

Wenn nur CAMERA_SUPPORT_HDMI ohne BOARD_HDMI_IN_SUPPORT konfiguriert ist, nehmen Sie rkCamera2 in den Build auf und setzen persist.sys.hdmiinmode auf 2, um die Vorschau mit rkCamera2 über das Kamerasystem anzuzeigen. Weitere Einzelheiten siehe:

<!-- source: CN V2.7 p90; unit 589 -->

Rockchip_Developer_Guide_HDMI_RX_CN

<!-- source: CN V2.7 p90; unit 590 -->

```text
PRODUCT_PACKAGES += \
   rkCamera2
```

<!-- source: CN V2.7 p90; unit 591 -->

##### 6.12.2.2 APK-Vorschau

<!-- source: CN V2.7 p90; unit 592 -->

Die APK zeigt entweder den RK3588-HDMI-RX-Pfad oder den HDMI-zu-MIPI-CSI-Pfad an; wählen Sie den passenden Pfad.

<!-- source: CN V2.7 p90; unit 593 -->

Wählen Sie für die TIF-Vorschau den MIPI-CSI2-Pfad:

<!-- source: CN V2.7 p90; unit 594 -->

```text
setprop vendor.tvinput.hdmiin.type 1
```

<!-- source: CN V2.7 p90; unit 595 -->

Öffnen Sie für die Kamera-Vorschau RockchipCamera2 und stellen Sie sicher, dass CAMERA_SUPPORT_HDMI aktiviert ist.

<!-- source: CN V2.7 p90; unit 596 -->

```text
setprop persist.sys.hdmiinmode 2
```

<!-- source: CN V2.7 p90; unit 597 -->

##### 6.12.2.3 TIF- und Kamera-Vorschau im Vergleich

<!-- source: CN V2.7 p90; unit 598 -->

|  | TIF | Kamera |
| --- | --- | --- |
| Vorteile | Geringe Latenz | Die Anwendung kann Vorschaudaten zur Nachverarbeitung erhalten |
| Nachteile | Keine Bildschirmdrehung, geteilte Ansicht oder Bild-in-Bild; die Anwendung kann keine Vorschaupufferdaten erhalten; screencap-Bildschirmaufnahmebefehle werden nicht unterstützt | Höhere Latenz als TIF |

<!-- source: CN V2.7 p90; unit 599 -->

### 6.13 Gängige Methoden zum Treiber-Debugging

<!-- source: CN V2.7 p90; unit 600 -->

Debuggen Sie den Treiber wie einen SoC-Sensor. Weitere Informationen enthält das Redmine-Dokument:

<!-- source: CN V2.7 p90; unit 601 -->

https://redmine.rock-chips.com/documents/53

<!-- source: CN V2.7 p90; unit 602 -->

#### 6.13.1 Debugging-Werkzeuge beziehen

<!-- source: CN V2.7 p90; unit 603 -->

media-ctl und v4l2-ctl werden benötigt. Das Quell-SDK kopiert sie beim Build automatisch in die Firmware; ihr SDK-Verzeichnis lautet:

<!-- source: CN V2.7 p90; unit 604 -->

```text
hardware/rockchip/camera/etc/tools/
```

<!-- source: CN V2.7 p90; unit 605 -->

Bei älteren SDK-Versionen beziehen Sie sie über Redmine:

<!-- source: CN V2.7 p91; unit 606 -->

https://redmine.rock-chips.com/documents/104

<!-- source: CN V2.7 p91; unit 607 -->

Kopieren Sie media-ctl und v4l2-ctl mit adb push nach /vendor/bin/ auf dem Gerät.

<!-- source: CN V2.7 p91; unit 608 -->

#### 6.13.2 Beispiele für Debugging-Befehle

<!-- source: CN V2.7 p91; unit 609 -->

Dieses Beispiel verwendet RK3288 + RK628 mit 1920x1080P-Empfang. Passen Sie es an das tatsächliche System an. Geben Sie folgende Befehle in der angegebenen Reihenfolge ein; übersprungene Konfigurationen können den Betrieb verhindern.

<!-- source: CN V2.7 p91; unit 610 -->

Verbindungstopologie prüfen:

<!-- source: CN V2.7 p91; unit 611 -->

Führen Sie den Befehl zum Prüfen der Medienknotentopologie aus. Je nach Plattform und Verbindungen kann der Knoten /dev/media0 oder /dev/media1 sein.

<!-- source: CN V2.7 p91; unit 612 -->

```text
media-ctl -d /dev/media0 –p
```

<!-- source: CN V2.7 p91; unit 613 -->

Im RK628-Auszug lautet das Gerät /dev/v4l-subdev2 und die erkannte HDMI-IN-Auflösung 1920x1080.

<!-- source: CN V2.7 p91; unit 614 -->

```text
...
- entity 8: m00_b_rk628-csi rk628-csi (1 pad, 1 link)
         type V4L2 subdev subtype Sensor

         device node name /dev/v4l-subdev2
      pad0: Source
           [fmt:UYVY2X8/1920x1080]
           -> "rockchip-mipi-dphy-rx":0 [ENABLED]
...
```

<!-- source: CN V2.7 p91; unit 615 -->

Verbindungen konfigurieren:

<!-- source: CN V2.7 p91; unit 616 -->

Nach Reset/Systemstart sind die Verbindungen standardmäßig hergestellt. Öffnen und Schließen der HDMI-IN-APK trennt sie. Stellen Sie sie nur wieder her, wenn in der Topologie [ENABLED] fehlt.

<!-- source: CN V2.7 p91; unit 617 -->

```text
media-ctl -d /dev/media0 -l \
'"m00_b_rk628-csi rk628-csi":0->"rockchip-mipi-dphy-rx":0 [1]'

media-ctl -d /dev/media0 -l \
'"rockchip-mipi-dphy-rx":1->"rkisp1-isp-subdev":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-input-params":0->"rkisp1-isp-subdev":1 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":2->"rkisp1_mainpath":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":2->"rkisp1_selfpath":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":3->"rkisp1-statistics":0 [1]'
```

<!-- source: CN V2.7 p91; unit 618 -->

Auflösung konfigurieren:

<!-- source: CN V2.7 p91; unit 619 -->

```text
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":0[fmt:UYVY2X8/1920x1080]'
media-ctl -d /dev/media0 \

--set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/1920x1080]'
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":2[fmt:UYVY2X8/1920x1080]'
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/1920x1080]'
```

<!-- source: CN V2.7 p92; unit 620 -->

Bildstrom erfassen:

<!-- source: CN V2.7 p92; unit 621 -->

Konfigurationsergebnisse prüfen:

<!-- source: CN V2.7 p92; unit 622 -->

```text
media-ctl -d /dev/media0 –p
```

<!-- source: CN V2.7 p92; unit 623 -->

Bildstrom erfassen:

<!-- source: CN V2.7 p92; unit 624 -->

```text
v4l2-ctl --verbose -d /dev/video0 --set-fmt-
video=width=1920,height=1080,pixelformat='NV12' --stream-mmap=4
```

<!-- source: CN V2.7 p92; unit 625 -->

Erfassen Sie eine YUV-Bilddatei, übertragen Sie sie mit adb pull und prüfen Sie sie beispielsweise mit 7yuv:

<!-- source: CN V2.7 p92; unit 626 -->

```text
v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat='NV12'
--stream-mmap=3 --stream-skip=4 --stream-to=/data/1920x1080p60_nv12.yuv --stream-
count=5 --stream-poll
```

<!-- source: CN V2.7 p92; unit 627 -->

Bei normalem Bilddatenempfang werden Bildraten ausgegeben. Protokollbeispiel der Quelle:

<!-- source: CN V2.7 p92; unit 628 -->

```text
VIDIOC_QUERYCAP: ok
VIDIOC_G_FMT: ok
VIDIOC_S_FMT: ok

Format Video Capture Multiplanar:
      Width/Height : 1920/1080
      Pixel Format : 'NV12'
      Field        : None
      Number of planes : 1
      Flags        :
      Colorspace   : Default
      Transfer Function : Default
      YCbCr Encoding : Default
      Quantization : Full Range
      Plane 0      :
        Bytes per Line : 1920
        Size Image : 3110400

VIDIOC_G_SELECTION: ok
VIDIOC_S_SELECTION: ok
VIDIOC_REQBUFS: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok

VIDIOC_STREAMON: ok
idx: 0 seq: 0 bytesused: 3110400 ts: 131.560377
idx: 1 seq: 1 bytesused: 3110400 ts: 131.577023 delta: 16.646 ms
idx: 2 seq: 2 bytesused: 3110400 ts: 131.593697 delta: 16.674 ms
idx: 3 seq: 3 bytesused: 3110400 ts: 131.610363 delta: 16.666 ms
idx: 0 seq: 4 bytesused: 3110400 ts: 131.627033 delta: 16.670 ms fps: 60.01
idx: 1 seq: 5 bytesused: 3110400 ts: 131.643721 delta: 16.688 ms fps: 59.99
idx: 2 seq: 6 bytesused: 3110400 ts: 131.660390 delta: 16.669 ms fps: 59.99
idx: 3 seq: 7 bytesused: 3110400 ts: 131.677058 delta: 16.668 ms fps: 59.99
```

<!-- source: CN V2.7 p93; unit 629 -->

<!-- source: CN V2.7 p93; unit 630 -->

#### 6.13.3 Protokollierung aktivieren

<!-- source: CN V2.7 p93; unit 631 -->

Aktivieren Sie RK628-Protokolle mit folgendem Befehl und erfassen Sie anschließend das Kernelprotokoll. Die Quelle schreibt den Abrufbefehl demsg; prüfen Sie den tatsächlichen Befehl dmesg auf dem Zielsystem.

<!-- source: CN V2.7 p93; unit 632 -->

```text
echo 1 > /sys/kernel/debug/rk628/x-0050/debug //x为挂载的i2c总线，50为对应的i2c地址
echo 2 > /sys/module/rk628_csi/parameters/debug
echo 2 > /sys/module/rk628_csi_v4l2/parameters/debug //内核为linux4.4或者4.19

dmesg -n 8
```

<!-- source: CN V2.7 p93; unit 633 -->

Ändern Sie zur Erfassung von Einschalt-/Bootprotokollen den Code direkt und bauen/flashen Sie die Kernelkomponenten erneut:

<!-- source: CN V2.7 p93; unit 634 -->

```text
diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index c763a9558169..bd7f3effb45a 100644
--- a/drivers/media/i2c/rk628_csi_v4l2.c

+++ b/drivers/media/i2c/rk628_csi_v4l2.c
@@ -34,7 +34,7 @@
 #include <video/videomode.h>
 #include "rk628_csi.h"

-static int debug;
+static int debug = 1;
 module_param(debug, int, 0644);
 MODULE_PARM_DESC(debug, "debug level (0-3)");

diff --git a/include/media/v4l2-common.h b/include/media/v4l2-common.h
index 1cc0c5ba16b3..e74f3a85f0b8 100644
--- a/include/media/v4l2-common.h

+++ b/include/media/v4l2-common.h
@@ -75,7 +75,7 @@
 #define v4l2_dbg(level, debug, dev, fmt, arg...)   \
      do {                                          \
           if (debug >= (level))                    \
-                v4l2_printk(KERN_DEBUG, dev, fmt , ## arg); \
+                v4l2_printk(KERN_INFO, dev, fmt , ## arg); \
      } while (0)
```

<!-- source: CN V2.7 p93; unit 635 -->

#### 6.13.4 Register lesen und schreiben

<!-- source: CN V2.7 p93; unit 636 -->

Es folgen die RK628-Register-Debugknoten. In diesem Beispiel befindet sich RK628 an I2C3 mit Adresse 0x50:

<!-- source: CN V2.7 p93; unit 637 -->

```text
console:/ # ls /sys/kernel/debug/rk628/3-0050/registers/
adapter combtxphy csi dsi0 gpio0 gpio2 grf hdmirxphy

combrxphy cru   csi1 dsi1 gpio1 gpio3 hdmirx
```

<!-- source: CN V2.7 p93; unit 638 -->

Die Registerknoten unterstützen Lese- und Schreibzugriffe.

<!-- source: CN V2.7 p93; unit 639 -->

Register lesen:

<!-- source: CN V2.7 p94; unit 640 -->

```text
console:/ # cat /sys/kernel/debug/rk628/3-0050/registers/cru
rk628_cru:


0xc0000: 00001031 00000441 00800000 00000007
0xc0010: 00007f00
0xc0020: 00001028 00000441 00f5c28f 00000007
0xc0030: 00007f00
0xc0040: 00005019 00000541 0099735e 00000007
0xc0050: 00007f00
0xc0060: 00000015
0xc0080: 00008989 00000003 00000007 00004b80
0xc0090: 03355460 000080d7 00008004 0000003b
0xc00a0: 00002c00 00000000 00000000 00000000
0xc00b0: 00285f58 00010008 00010008 00000103
0xc00c0: 00000300 00000703 0000000b 00000008

0xc00d0: 0001000a 00000b07
0xc0180: 00000000 00000000 00000000 00000000
0xc0190: 00000000 00000000
0xc0200: 00000000 00000000 00000000 00000000
0xc0210: 00000000
```

<!-- source: CN V2.7 p94; unit 641 -->

Register schreiben:

<!-- source: CN V2.7 p94; unit 642 -->

```text
rk3288:/ # echo 0x000 0xffffffff > /sys/kernel/debug/rk628/3-0050/registers/grf
```

<!-- source: CN V2.7 p94; unit 643 -->

#### 6.13.5 HDMI-RX-Status lesen

<!-- source: CN V2.7 p94; unit 644 -->

Lesen Sie HDMI-RX-Informationen einschließlich Auflösung, Verriegelungszustand, Steckzustand und Farbformat mit:

<!-- source: CN V2.7 p94; unit 645 -->

```text
console:/ # cat /sys/kernel/debug/rk628/3-0050/hdmirx/status
status: plugin

Clk-Ch:Lock Ch0:Lock   Ch1:Lock    Ch2:Lock
Color Format: RGB
Timing: 1920x1080p60 (2200x1125)   hfp:88 hs:45 hbp:147 vfp:4
vs:5 vbp:36
Pixel Clk: 148500000
Mode: HDMI
Color Depth: 8 bit
Color Range: Limited
Color Space: RGB
```

<!-- source: CN V2.7 p94; unit 646 -->

#### 6.13.6 Testmusterausgabe

<!-- source: CN V2.7 p94; unit 647 -->

RK628 unterstützt die Farbbalkenausgabe des Scalers. Befehle:

<!-- source: CN V2.7 p94; unit 648 -->

```text
echo 1 > /sys/kernel/debug/rk628/3-0050/scaler_color_bar

//pattern 模式选择

echo 2 > /sys/kernel/debug/rk628/3-0050/scaler_color_bar
```

<!-- source: CN V2.7 p95; unit 649 -->

### 6.14 Audiomodul

<!-- source: CN V2.7 p95; unit 650 -->

Audio lässt sich abhängig von HDMIRX oder HDMITX als Ausgang oder Eingang konfigurieren. Bei HDMIRX wird empfangenes HDMI-Audio entpackt und über I2S ausgegeben. Bei HDMITX empfängt RK628D I2S Audio, das paketiert und über HDMITX gesendet wird. Beide Konfigurationen folgen:

<!-- source: CN V2.7 p95; unit 651 -->

#### 6.14.1 HDMIRX

<!-- source: CN V2.7 p95; unit 652 -->

HDMIRX initialisiert Audio gewöhnlich beim Laden des Treibers; zusätzliche Konfiguration ist nicht erforderlich. Wenn der HDMI-Sender Audio wiedergibt, gibt RK628 es über I2S aus und muss als Master arbeiten. RK628 I2S kann direkt mit einem I2S-fähigen DAC oder SoC verbunden werden. I2S-Format:

<!-- source: CN V2.7 p95; unit 653 -->

![Technische Originalabbildung — EN V2.3, S. 86](/docs/rockchip-rk628-porting/assets/en-p86-X477.png)

*Technische Originalabbildung: EN V2.3, S. 86.*

<!-- source: CN V2.7 p95; unit 654 -->

Bei Anschluss an einen SoC benötigt RK628 I2S keine zusätzliche Konfiguration; verwenden Sie dummy_codec, um eine Soundkarte für das System anzulegen:

<!-- source: CN V2.7 p95; unit 655 -->

```text
rk628_dc: rk628-dc {
      compatible = "rockchip,dummy-codec";
      #sound-dai-cells = <0>;

};

hdmiin-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";
      simple-audio-card,name = "rockchip,hdmiin";
      simple-audio-card,bitclock-master = <&dailink0_master>;
      simple-audio-card,frame-master = <&dailink0_master>;
      status = "okay";
      simple-audio-card,cpu {
                 sound-dai = <&i2s0>;
      };

      dailink0_master: simple-audio-card,codec {
                 sound-dai = <&rk628_dc>;
      };
};
```

<!-- source: CN V2.7 p95; unit 656 -->

Bei einem DAC ist die obige Soundkartenkonfiguration unnötig; der DAC erzeugt direkt ein Analogsignal. Die meisten DACs benötigen MCLK, wofür RK628 keinen Anschluss vorgesehen hat. Die Quellenlösung verwendet GPIO1_A0 (H7) als TEST_CLKO zur Ausgabe eines 128FS-Takts. Die Quelle berichtet Kompatibilität mit vielen DACs sowie Tests mit CS4344 und ES7144; dies sind keine ArmSoM-Tests. Rufen Sie zur Aktivierung von MCLK an GPIO1_A0 die folgende Initialisierungsschnittstelle auf und wählen Sie den passenden Projekttreiber:

<!-- source: CN V2.7 p95; unit 657 -->

```text
--- a/drivers/media/i2c/rk628/rk628_hdmirx.h
+++ b/drivers/media/i2c/rk628/rk628_hdmirx.h
@@ -392,5 +392,5 @@ bool rk628_audio_ctsnints_enabled(HAUDINFO info);
 void rk628_csi_isr_ctsn(HAUDINFO info, u32 pdec_ints);

 void rk628_csi_isr_fifoints(HAUDINFO info, u32 fifo_ints);
 int rk628_is_avi_ready(struct rk628 *rk628, bool avi_rcv_rdy);
+void rk628_hdmirx_audio_set_mclk_output(HAUDINFO info);

--- a/drivers/media/i2c/rk628/rk628_csi.c
+++ b/drivers/media/i2c/rk628/rk628_csi.c
@@ -957,6 +957,9 @@ static void rk628_csi_initial_setup(struct rk628_csi *csi)
 {
      struct v4l2_subdev_edid def_edid;

+     //enable rk628 mclk
+     rk628_hdmirx_audio_set_mclk_output(csi->audio_info);


--- a/drivers/media/i2c/rk628/rk628_csi_v4l2.c
+++ b/drivers/media/i2c/rk628/rk628_csi_v4l2.c
@@ -1096,6 +1096,9 @@ static void rk628_csi_initial_setup(struct v4l2_subdev *sd)
      struct rk628_csi *csi = to_csi(sd);
      struct v4l2_subdev_edid def_edid;

+     //enable rk628 mclk
+     rk628_hdmirx_audio_set_mclk_output(csi->audio_info);
```

<!-- source: CN V2.7 p96; unit 658 -->

<!-- source: CN V2.7 p96; unit 659 -->

Für RK3288 EVB erklärt die Quelle, dass sowohl RK3288 I2S als auch RK628 I2S mit RT5651 I2S2 verbunden sind. Durch Umschalten der internen RT5651-Routen werden verschiedene Aufnahme-/Wiedergabepfade gewählt. DTS-Konfiguration:

<!-- source: CN V2.7 p96; unit 660 -->

```text
hdmiin-sound {
      compatible = "rockchip,rockchip-rt5651-rk628-sound";
      rockchip,cpu = <&i2s>;

      rockchip,codec = <&rt5651>;
      status = "okay";
};
```

<!-- source: CN V2.7 p96; unit 661 -->

Standardmäßig gibt I2S nur während der Vorschau aus. Ergänzen Sie für kontinuierliche Ausgabe i2s-enable-default in DTS.

<!-- source: CN V2.7 p96; unit 662 -->

```text
&i2c4 {
      clock-frequency = <400000>;
      status = "okay";

      rk628_csi_v4l2: rk628_csi_v4l2@50 {
           reg = <0x50>;
           compatible = "rockchip,rk628-csi-v4l2";
           ....
           i2s-enable-default;
           ....
      };
};
```

<!-- source: CN V2.7 p97; unit 663 -->

#### 6.14.2 HDMITX

<!-- source: CN V2.7 p97; unit 664 -->

HDMITX benötigt nur die HDMI-Soundkartenkonfiguration. Hier ist RK628 I2S mit SoC I2S0 verbunden:

<!-- source: CN V2.7 p97; unit 665 -->

```text
hdmi_sound: hdmi-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";

      simple-audio-card,name = "hdmi-sound";
      status = "okay";
      simple-audio-card,cpu {
           sound-dai = <&i2s0>;
      };
      simple-audio-card,codec {
           sound-dai = <&rk628_hdmi>;
      };
};
```

<!-- source: CN V2.7 p97; unit 666 -->

#### 6.14.3 Audio-Fehlersuche

<!-- source: CN V2.7 p97; unit 667 -->

##### 6.14.3.1 Keine I2S-Ausgabe

<!-- source: CN V2.7 p97; unit 668 -->

```text
echo 0x000 0x6000220 > /sys/kernel/debug/regmap/0-0050-grf/registers //i2s 的
IOMUX

echo 0x70 0xfffff55c > /sys/kernel/debug/regmap/0-0050-grf/registers
echo 0x70 0x155c155c > /sys/kernel/debug/regmap/0-0050-grf/registers // 设置输出
```

<!-- source: CN V2.7 p97; unit 669 -->

##### 6.14.3.2 v4l2_dbg-Ausgabe aktivieren

<!-- source: CN V2.7 p97; unit 670 -->

```text
diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index 5e8e3710a82f..638ac2acc472 100644

--- a/drivers/media/i2c/rk628_csi.c
+++ b/drivers/media/i2c/rk628_csi.c
@@ -34,7 +34,7 @@
 #include <video/videomode.h>
 #include "rk628_csi.h"

-static int debug;
+static int debug = 3;
 module_param(debug, int, 0644);
 MODULE_PARM_DESC(debug, "debug level (0-3)");

diff --git a/include/media/v4l2-common.h b/include/media/v4l2-common.h
index cdc87ec61e54..f159118d4a6b 100644

--- a/include/media/v4l2-common.h
+++ b/include/media/v4l2-common.h
@@ -82,7 +82,7 @@
 #define v4l2_dbg(level, debug, dev, fmt, arg...)   \
      do {                                          \
           if (debug >= (level))                    \
-                v4l2_printk(KERN_DEBUG, dev, fmt , ## arg); \
+                v4l2_printk(KERN_INFO, dev, fmt , ## arg); \
      } while (0)


 /**
```

<!-- source: CN V2.7 p98; unit 671 -->

<!-- source: CN V2.7 p98; unit 672 -->

##### 6.14.3.3 Störgeräusche in Anwendungsaufnahmen

<!-- source: CN V2.7 p98; unit 673 -->

Dies kann durch eine Abweichung zwischen der Abtastrate des HDMI-Senders und der HAL-Aufnahmeabtastrate entstehen.

<!-- source: CN V2.7 p98; unit 674 -->

(1) Prüfen Sie die HDMITX-Abtastrate.

<!-- source: CN V2.7 p98; unit 675 -->

Kernelprotokollierung aktivieren: echo 3 > /sys/module/rk628_csi/parameters/debug

<!-- source: CN V2.7 p98; unit 676 -->

(2) Ermitteln Sie nach Aktivierung der Protokolle die TX-Abtastrate aus folgender Ausgabe.

<!-- source: CN V2.7 p98; unit 677 -->

```text
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000

m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfe, single offset:0, total offset:-2
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:-2, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:

HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:0, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:0, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:

HDMI_RX_AUD_FIFO_FILLSTS1:0xfa, single offset:-2, total offset:-6
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:2, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfa, single offset:-2, total offset:-6
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:

HDMI_RX_AUD_FIFO_ISTS:0x4
```

<!-- source: CN V2.7 p99; unit 678 -->

<!-- source: CN V2.7 p99; unit 679 -->

(3) HAL-Aufnahmeabtastrate:

<!-- source: CN V2.7 p99; unit 680 -->

```text
getprop vendor.hdmiin.audiorate
```

<!-- source: CN V2.7 p99; unit 681 -->

##### 6.14.3.4 IOMUX direkt einstellen

<!-- source: CN V2.7 p99; unit 682 -->

```text
 static void rk628_hdmirx_initial_setup(struct rk628_hdmirx *hdmirx)
 {
      struct v4l2_subdev_edid def_edid;

@@ -783,6 +937,8 @@ static void rk628_hdmirx_initial_setup(struct rk628_hdmirx
*hdmirx)

      // ddc and hpd pinctrl
      regmap_write(hdmirx->grf, GRF_GPIO1AB_SEL_CON, 0x07000700);
+     //i2s pinctrl
+     regmap_write(hdmirx->grf, GRF_GPIO0AB_SEL_CON, 0x155c155c);

      rk628_hdmirx_controller_reset(hdmirx);
```

<!-- source: CN V2.7 p99; unit 683 -->

##### 6.14.3.5 Falsche tmdsclk-Berechnung

<!-- source: CN V2.7 p99; unit 684 -->

1\. Stimmen Sie die Bitmaske auf den Takt ab.

<!-- source: CN V2.7 p99; unit 685 -->

```text
git sholsh@rk-intel-1:~/rk-sdk/android11-rk3399/kernel$ git show
007131063748ea69facbf4bbe7aaee71c34fd921

commit 007131063748ea69facbf4bbe7aaee71c34fd921
Author: Shunhua Lan <lsh@rock-chips.com>
Date: Fri Apr 23 18:43:59 2021 +0800

   media: i2c: rk628csi: fix mask for clkrate and fs audio align to 100

   Signed-off-by: Shunhua Lan <lsh@rock-chips.com>
   Change-Id: I15b290319463f1b41e6908e54caa99ef9c6db4f4

diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index 89c4a926a985..a970bc621e0e 100644
--- a/drivers/media/i2c/rk628_csi.c
+++ b/drivers/media/i2c/rk628_csi.c

@@ -1064,7 +1064,7 @@ static void rk628_csi_delayed_work_audio(struct work_struct
*work)

      /* fout=128*fs=ftmds*N/CTS */
      regmap_read(csi->hdmirx_regmap, HDMI_RX_HDMI_CKM_RESULT, &clkrate);
-     clkrate = clkrate & 0xfff;
+     clkrate = clkrate & 0xffff;
      /* tmdsclk = (clkrate/1000) * 49500000 */
      tmdsclk = clkrate * (49500000 / 1000);
      regmap_read(csi->hdmirx_regmap, HDMI_RX_PDEC_ACR_CTS, &cts_decoded);
@@ -1073,6 +1073,8 @@ static void rk628_csi_delayed_work_audio(struct work_struct

*work)
      if (cts_decoded != 0) {
           fs_audio = div_u64((tmdsclk * n_decoded), cts_decoded);
           fs_audio = div_u64(fs_audio, 128);
+          fs_audio = div_u64(fs_audio + 50, 100);
+          fs_audio *= 100;
      }
      v4l2_dbg(2, debug, sd,
           "%s: clkrate:%d tmdsclk:%llu, n_decoded:%d, cts_decoded:%d,
fs_audio:%llu\n",
```

<!-- source: CN V2.7 p100; unit 686 -->

<!-- source: CN V2.7 p100; unit 687 -->

Fehlerprotokoll:

<!-- source: CN V2.7 p100; unit 688 -->

```text
[67.440094] m00_b_rk628-csi rk628-csi:rk628_csi_delayed_work_audio:clkrate:1904
tmdsclk:94248000,n_decoded:6144,cts_decoded:297000,fs_audio:15232
```

<!-- source: CN V2.7 p100; unit 689 -->

Für die 4K-Anzeige in diesem Beispiel sollte der berechnete tmdsclk 297M betragen.

<!-- source: CN V2.7 p100; unit 690 -->

tmdsclk = clkrate * (49500000 / 1000);

<!-- source: CN V2.7 p100; unit 691 -->

1904 ---> 0x770

<!-- source: CN V2.7 p100; unit 692 -->

6000 ---> 0x1770

<!-- source: CN V2.7 p100; unit 693 -->

tmdsclk 6*49500000 = 297000000

<!-- source: CN V2.7 p100; unit 694 -->

##### 6.14.3.6 GPIO-Testtaktausgabe

<!-- source: CN V2.7 p100; unit 695 -->

Schnellkonfiguration:

<!-- source: CN V2.7 p100; unit 696 -->

```text
grf: gpio0 相关 iomux 切换，配置为 IO 口:
echo 0x70 0x0fff0000 > registers


gpio0 配置为输出口, 1-0051-rk628-pinctrl:
echo 0xd0008 0x00EC00EC > registers

grf，选择在哪一级拉出信号:
HDMI_RX:
echo 0x300 0x11 > registers
ASYNC_IN:
echo 0x300 0x14 > registers
ASYNC_OUT:
echo 0x300 0x15 > registers
SCALER：
echo 0x300 0x16 > registers
```

<!-- source: CN V2.7 p101; unit 697 -->

##### 6.14.3.7 Besondere IOMUX-Behandlung bei RK356X

<!-- source: CN V2.7 p101; unit 698 -->

Jede RK356X-I2S-Schnittstelle kann mehrere Pingruppen multiplexen und benötigt dafür eine zusätzliche GRF_IOFUNC_SEL4-Konfiguration:

<!-- source: CN V2.7 p101; unit 699 -->

| Bit | Attribut | Resetwert | Beschreibung |
| --- | --- | --- | --- |
| 14 | RW | 0x0 | i2s3_iomux_sel I2S3-IO-Mux-Auswahl<br>1'b0:M0-Mux-Lösung<br>1'b1:M1-Mux-Lösung |
| 12 | RW | 0x0 | i2s2_iomux_sel I2S2-IO-Mux-Auswahl<br>1'b0:M0-Mux-Lösung<br>1'b1:M1-Mux-Lösung |
| 11:10 | RW | 0x0 | i2s1_iomux_sel I2S1-IO-Mux-Auswahl<br>2'b00:M0-Mux-Lösung<br>2'b01:M1-Mux-Lösung<br>2'b10:M2-Mux-Lösung<br>2'b11: Reserviert |

<!-- source: CN V2.7 p101; unit 700 -->

Der pinctrl-Treiber konfiguriert die zugehörigen GRF-Bits entsprechend dem ausgewählten mclk. Code:

<!-- source: CN V2.7 p101; unit 701 -->

```text
static struct rockchip_mux_route_data rk3568_mux_route_data[] = {
   ....
   RK_MUXROUTE_GRF(1, RK_PA2, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1 IO

mux M0 */
   RK_MUXROUTE_GRF(3, RK_PC6, 4, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1 IO
mux M1 */
   RK_MUXROUTE_GRF(2, RK_PD0, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1 IO
mux M2 */
   RK_MUXROUTE_GRF(2, RK_PC1, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2 IO
mux M0 */
   RK_MUXROUTE_GRF(4, RK_PB6, 5, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S2 IO
mux M1 */
   RK_MUXROUTE_GRF(3, RK_PA4, 4, 0x0310, WRITE_MASK_VAL(14, 14, 0)), /* I2S3 IO
mux M0 */
   RK_MUXROUTE_GRF(4, RK_PC4, 5, 0x0310, WRITE_MASK_VAL(14, 14, 1)), /* I2S3 IO
mux M1 */

   ....
}
```

<!-- source: CN V2.7 p101; unit 702 -->

Anwendungen wie RK628, die keinen mclk benötigen, konfigurieren ihn nicht; dadurch werden diese Bits nicht gesetzt. Ergänzen Sie die Behandlung manuell. Da I2S normalerweise sclk verwendet, ergänzen Sie hier sclk. Laut Quelle wird ein späteres RK356X-SDK diesen Patch enthalten; prüfen Sie das tatsächlich verwendete SDK.

<!-- source: CN V2.7 p101; unit 703 -->

```text
diff --git a/drivers/pinctrl/pinctrl-rockchip.c b/drivers/pinctrl/pinctrl-
rockchip.c

index 871c49ef0c2a..3d10e6c2ed27 100644
--- a/drivers/pinctrl/pinctrl-rockchip.c
+++ b/drivers/pinctrl/pinctrl-rockchip.c
@@ -1046,13 +1046,26 @@ static struct rockchip_mux_route_data
rk3568_mux_route_data[] = {
      RK_MUXROUTE_GRF(2, RK_PB0, 3, 0x0310, WRITE_MASK_VAL(9, 8, 0)), /* UART9
IO mux M0 */
      RK_MUXROUTE_GRF(4, RK_PC5, 4, 0x0310, WRITE_MASK_VAL(9, 8, 1)), /* UART9
IO mux M1 */
      RK_MUXROUTE_GRF(4, RK_PA4, 4, 0x0310, WRITE_MASK_VAL(9, 8, 2)), /* UART9

IO mux M2 */
+
      RK_MUXROUTE_GRF(1, RK_PA2, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1
IO mux M0 */
      RK_MUXROUTE_GRF(3, RK_PC6, 4, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1
IO mux M1 */
      RK_MUXROUTE_GRF(2, RK_PD0, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1
IO mux M2 */
+     RK_MUXROUTE_GRF(1, RK_PA3, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1
IO mux sclk tx M0 */
+     RK_MUXROUTE_GRF(1, RK_PA4, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1
IO mux sclk rx M0 */

+     RK_MUXROUTE_GRF(3, RK_PC7, 4, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1
IO mux sclk tx M1 */
+     RK_MUXROUTE_GRF(4, RK_PA6, 5, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1
IO mux sclk rx M1 */
+     RK_MUXROUTE_GRF(2, RK_PD1, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1
IO mux sclk tx M2 */
+     RK_MUXROUTE_GRF(3, RK_PC3, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1
IO mux sclk rx M2 */
      RK_MUXROUTE_GRF(2, RK_PC1, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2
IO mux M0 */
      RK_MUXROUTE_GRF(4, RK_PB6, 5, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S2
IO mux M1 */
+     RK_MUXROUTE_GRF(2, RK_PC2, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2

IO mux sclk tx M0 */
+     RK_MUXROUTE_GRF(2, RK_PB7, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2
IO mux sclk rx M0 */
+     RK_MUXROUTE_GRF(4, RK_PB7, 4, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S1
IO mux sclk tx M1 */
+     RK_MUXROUTE_GRF(4, RK_PC1, 5, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S1
IO mux sclk rx M1 */
      RK_MUXROUTE_GRF(3, RK_PA2, 4, 0x0310, WRITE_MASK_VAL(14, 14, 0)), /* I2S3
IO mux M0 */
      RK_MUXROUTE_GRF(4, RK_PC2, 5, 0x0310, WRITE_MASK_VAL(14, 14, 1)), /* I2S3
IO mux M1 */
+     RK_MUXROUTE_GRF(3, RK_PA3, 4, 0x0310, WRITE_MASK_VAL(14, 14, 0)), /* I2S3

IO mux sclk M0 */
+     RK_MUXROUTE_GRF(4, RK_PC3, 5, 0x0310, WRITE_MASK_VAL(14, 14, 1)), /* I2S3
IO mux sclk M1 */
      RK_MUXROUTE_GRF(1, RK_PA4, 3, 0x0314, WRITE_MASK_VAL(1, 0, 0)), /* PDM IO
mux M0 */
      RK_MUXROUTE_GRF(1, RK_PA6, 3, 0x0314, WRITE_MASK_VAL(1, 0, 0)), /* PDM IO
mux M0 */
      RK_MUXROUTE_GRF(3, RK_PD6, 5, 0x0314, WRITE_MASK_VAL(1, 0, 1)), /* PDM IO
mux M1 */
```

<!-- source: CN V2.7 p102; unit 704 -->

<!-- source: CN V2.7 p103; unit 705 -->

##### 6.14.3.8 Besondere LRCK-Behandlung bei RK3399

<!-- source: CN V2.7 p103; unit 706 -->

Eine falsche Richtungseinstellung kann nach dem Öffnen der Soundkarte jeglichen Datenempfang verhindern. Es folgt ein typisches Protokoll; passen Sie die Knotenpfade an das Gerät an:

<!-- source: CN V2.7 p103; unit 707 -->

```text
console:/ # cat /proc/asound/cards
 0 [rockchiphdmi ]: rockchip_hdmi - rockchip,hdmi
                rockchip,hdmi

 1 [rockchiphdmiin ]: rockchip_hdmiin - rockchip,hdmiin
                rockchip,hdmiin

console:/ # cat /proc/asound/card1/pcm0c/sub0/status
state: RUNNING
owner_pid : 1415
trigger_time: 1632716135.151992694
tstamp   : 0.000000000
delay    : 0
avail    : 0
avail_max : 0
-----

hw_ptr   : 0
appl_ptr : 0
```

<!-- source: CN V2.7 p103; unit 708 -->

Eine normale Ausgabe sollte etwa so aussehen:

<!-- source: CN V2.7 p103; unit 709 -->

```text
console:/ # cat /proc/asound/card1/pcm0c/sub0/status
state: RUNNING
owner_pid : 1421

trigger_time: 1632892868.412331044
tstamp   : 1632892881.181113577
delay    : 232
avail    : 232
avail_max : 264
-----
hw_ptr   : 543736
appl_ptr : 543504
```

<!-- source: CN V2.7 p103; unit 710 -->

RK628 ist Master und RK3399 Slave; die Konfiguration hängt daher von der Verdrahtung ab. Wenn LRCK_TX mit RK628 verbunden ist, konfigurieren Sie rockchip,clk-trcm wie folgt:

<!-- source: CN V2.7 p103; unit 711 -->

```text
+&i2s0 {
+     rockchip,clk-trcm = <1>;

+     status = "okay";
+};

console:/ # io -4 0xff880008
ff880008: 18071f1f
```

<!-- source: CN V2.7 p103; unit 712 -->

Wenn LRCK_RX mit RK628 verbunden ist, konfigurieren Sie rockchip,clk-trcm wie folgt:

<!-- source: CN V2.7 p104; unit 713 -->

```text
+&i2s0 {
+     rockchip,clk-trcm = <2>;
+     status = "okay";

+};
正常寄存器如下：
console:/ # io -4 0xff880008
ff880008: 28071f1f
```

<!-- source: CN V2.7 p104; unit 714 -->

Die Bits 29:28 von I2S_CKR sind wie folgt definiert:

<!-- source: CN V2.7 p104; unit 715 -->

```text
Tx and Rx Common Use
2'b00/2'b11:tx_lrck/rx_lrck are used as synchronous signal for TX
/RX respectively.

2'b01:only tx_lrck is used as synchronous signal for TX and RX.
2'b10:only rx_lrck is used as synchronous signal for TX and RX.
```

<!-- source: CN V2.7 p104; unit 716 -->

Aktualisieren Sie den RK628-Code auf v15-210926 oder neuer und verwenden Sie anschließend die Audiokonfiguration in arch/arm64/boot/dts/rockchip/rk3399-evb-ind-lpddr4-rk628-hdmi2csi-v4l2-avb.dts als Referenz.

<!-- source: CN V2.7 p104; unit 717 -->

##### 6.14.3.9 Falsche HDMI-IN-Soundkarte ausgewählt

<!-- source: CN V2.7 p104; unit 718 -->

Die APK ordnet Soundkarten beim Öffnen anhand ihres Namens zu. Früher Code kann den falschen Namen zuordnen und dadurch das Öffnen der HDMI-IN-Soundkarte verhindern. Fehlerbeispiel:

<!-- source: CN V2.7 p104; unit 719 -->

```text
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: card0 id:rockchiphdmi
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: SPEAKER card, got
card=0,device=0

09-28 07:03:13.341 261 1386 D AudioHardwareTiny: HDMI card, got
card=0,device=0
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: SPDIF card, got
card=0,device=0
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: BT card, got card=0,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: card1 id:rockchiphdmiin
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: SPEAKER card, got
card=1,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: HDMI card, got
card=1,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: SPDIF card, got
card=1,device=0

09-28 07:03:13.342 261 1386 D AudioHardwareTiny: BT card, got card=1,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: No exist
proc/asound/card2/id, break and finish parsing
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dump out device info
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info SPEAKER card=1,
device:0
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info HDMI card=1,
device:0
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info SPDIF card=1,
device:0
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info BT card=1, device:0
```

<!-- source: CN V2.7 p104; unit 720 -->

HDMI card, got card=1,device=0 entspricht nicht dem tatsächlichen Gerät; daher lässt sich die Soundkarte nicht öffnen.

<!-- source: CN V2.7 p105; unit 721 -->

Wenden Sie den folgenden Patch an oder aktualisieren Sie den RK628-Code auf V15-210926 oder neuer.

<!-- source: CN V2.7 p105; unit 722 -->

```text
hardware/rockchip/audio
commit 1b51a62fc62e9d63850e4e5a39f1e3cff0aa9b88 (HEAD)
Author: Shunhua Lan <lsh@rock-chips.com>

Date: Tue Sep 28 17:25:44 2021 +0800

   [audio hal] use levenshtein distance for sound card matching

   Signed-off-by: Shunhua Lan <lsh@rock-chips.com>
   Change-Id: I16f1692715d710a0693ae74875b0272669a04ba2
```

<!-- source: CN V2.7 p105; unit 723 -->

#### 6.14.4 Weitere Audiodokumente

<!-- source: CN V2.7 p105; unit 724 -->

Für eine direkte Verbindung von RK628 zum SoC siehe RK628-DIRECT-TO-SOC.pdf.

<!-- source: CN V2.7 p105; unit 725 -->

Für eine Verbindung von RK628 über einen Audiocodec zum SoC siehe RK628-RT5640-AUDIO-CONFIG.pdf.

<!-- source: CN V2.7 p105; unit 726 -->

Zu Audioproblemen der HDMI-IN-APK siehe RK628-HDMIIN-APP-AUDIO.pdf.

<!-- source: CN V2.7 p105; unit 727 -->

Bei Abweichungen oder Widersprüchen anderer Dokumente zu diesem Quellleitfaden hat dieser Leitfaden Vorrang.

<!-- source: CN V2.7 p105; unit 728 -->

### 6.15 Gängige Methoden zur Fehlersuche

<!-- source: CN V2.7 p105; unit 729 -->

#### 6.15.1 clk-det-Fehler

<!-- source: CN V2.7 p105; unit 730 -->

##### 6.15.1.1 RK628D

<!-- source: CN V2.7 p105; unit 731 -->

Erkennt COMBRXPHY kein Signal, kann die Polarität der HDMI-Steckerkennung oder von HPD falsch sein und die normale Übertragung der Quelle verhindern. Prüfen Sie plugin-det-gpios und hpd-output-inverted unter rk628_csi und messen Sie HPD mit einem Multimeter.

<!-- source: CN V2.7 p105; unit 732 -->

Fehler lösen Wiederholungen bis retry 2 aus. Gelingt ein Wiederholungsversuch, behandelt die Quelle das Signal als normal.

<!-- source: CN V2.7 p105; unit 733 -->

```text
rk628-csi-v4l2 1-0051: clk det over cnt:10, reg_0x6654:0x403f0000
rk628-csi-v4l2 1-0051: |d2_p| level detection anomaly
rk628-csi-v4l2 1-0051: clock detected failed, cfg resistance manual!

rk628-csi-v4l2 1-0051: err, clk not stable, reg_0x6630:0x87000d,
reg_0x6608:0x110100
m00_b_rk628-csi 1-0051: hdmi rxphy power on failed
```

<!-- source: CN V2.7 p105; unit 734 -->

Das obige Protokoll zeigt eine fehlerhafte data2_p-Spannungserkennung an, möglicherweise durch fehlendes Signal oder unzureichende Amplitude.

<!-- source: CN V2.7 p105; unit 735 -->

```text
rk628-csi-v4l2 1-0051: clk det over cnt:10, reg_0x6654:0x403f0000
rk628-csi-v4l2 1-0051: Clock detection anomaly
rk628-csi-v4l2 1-0051: clock detected failed, cfg resistance manual!

rk628-csi-v4l2 1-0051: err, clk not stable, reg_0x6630:0x87000d,
reg_0x6608:0x110100
m00_b_rk628-csi 1-0051: hdmi rxphy power on failed
```

<!-- source: CN V2.7 p106; unit 736 -->

Das obige Protokoll zeigt eine fehlerhafte Frequenzerkennung an, möglicherweise außerhalb des RK628D-Bereichs. HDMIRX unterstützt laut Quelle folgende Frequenzen:

<!-- source: CN V2.7 p106; unit 737 -->

```text
25175, 27000, 33750, 40000, 59400, 65000, 68250, 74250,
75000, 83500, 85500, 88750, 928125, 101000, 102250, 108000,
118800, 119000, 135000, 148500, 150000, 162000, 165000, 297000
```

<!-- source: CN V2.7 p106; unit 738 -->

#### 6.15.2 Normalen HDMI-RX-Betrieb prüfen

<!-- source: CN V2.7 p106; unit 739 -->

Nach Verriegelung von COMBRXPHY sollte der HDMI-RX-Controller das Timing korrekt auswerten. Berechnete Timings können kleine Fehler aufweisen, häufig eine Abweichung von 1. Detaillierte Timings siehe CEA-Standards.

<!-- source: CN V2.7 p106; unit 740 -->

![Technische Originalabbildung — EN V2.3, S. 100](/docs/rockchip-rk628-porting/assets/en-p100-X525.png)

*Technische Originalabbildung: EN V2.3, S. 100.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
m00_b_rk628-csi rk628-csi: cnt_num:1000, tmds_cnt:3000, hs_cnt:15, vs_cnt:3667, hofs:192
m00_b_rk628-csi rk628-csi: SCDC_REGS1:0xffff0f00, act:1920x1080, total:2200x1125, fps:60,
m00_b_rk628-csi rk628-csi: hfp:88, hs:45, hbp:147, vfp:4, vs:5, vbp:36, interlace:0
m00_b_rk628-csi rk628-csi: rk628_csi_s_dv_timings: 1920x1080p60.0 (2200x1125)
m00_b_rk628-csi rk628-csi: enable_stream: disable
```

<!-- source: CN V2.7 p106; unit 741 -->

#### 6.15.3 Berechtigungsfehler beim Öffnen von subdev

<!-- source: CN V2.7 p106; unit 742 -->

![Technische Originalabbildung — EN V2.3, S. 100](/docs/rockchip-rk628-porting/assets/en-p100-X526.png)

*Technische Originalabbildung: EN V2.3, S. 100.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
D JNI     : JNI CAMERA CALL init
I HdmiInput-native: JNI OnLoad
I HdmiInput-native: Apk Version: V1.2
E HdmiInput-native: openDevice(91): open /dev/v4l-subdev2 failed,erro=Permission denied
D RockchipCamera2: remove fake pic button
D RockchipCamera2: recreateTextureview
D RockchipCamera2: textureView remove
D RockchipCamera2: onResume
```

<!-- source: CN V2.7 p106; unit 743 -->

Prüfen Sie, ob /dev/v4l-subdev* entsprechend dem Quellenbeispiel den Modus 666 besitzt. Abfrage in der Geräteshell:

<!-- source: CN V2.7 p106; unit 744 -->

```text
rk3288:/ # cat /vendor/ueventd.rc | grep subdev
/dev/v4l-subdev*   0666 media   camera
```

<!-- source: CN V2.7 p106; unit 745 -->

Das Quell-SDK enthält diesen Commit bereits. Falls er fehlt, passen Sie folgende Änderung unter device/rockchip/common/ an:

<!-- source: CN V2.7 p106; unit 746 -->

![Technische Originalabbildung — EN V2.3, S. 100](/docs/rockchip-rk628-porting/assets/en-p100-X527.png)

*Technische Originalabbildung: EN V2.3, S. 100.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
wendingxian@ubuntu:~/rk3288_9.0_int/device/rockchip/common$ git show
commit 17112e1430b0f10a88b57c73ad19203e58f0eeff (HEAD -> mid_9.0, rk/rk/rk33/mid/9.0/develop)
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Tue Apr 27 21:26:48 2021 +0800

    ueventd.rockchip.rc: modify the /dev/v4l-subdev* permission to 666

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: Id4848209fd983f7e525761f19c7f0420b9fee747

diff --git a/ueventd.rockchip.rc b/ueventd.rockchip.rc
index 1914490b..52935d49 100755
--- a/ueventd.rockchip.rc
+++ b/ueventd.rockchip.rc
@@ -178,7 +178,7 @@
 /dev/ovr0                0664   system     system
 
 #for rk_isp1
-/dev/v4l-subdev*         0660   media      camera
+/dev/v4l-subdev*         0666   media      camera

 /dev/video0             0660   media      camera
 /dev/video1             0660   media      camera
```

<!-- source: CN V2.7 p107; unit 747 -->

#### 6.15.4 Signal wird nicht erkannt

<!-- source: CN V2.7 p107; unit 748 -->

Schritt 1. Wenn HDMI-Ein-/Ausstecken keine RK628-Protokolle auf der seriellen Konsole erzeugt, ist die GPIO-Konfiguration des det-Pins falsch.

<!-- source: CN V2.7 p107; unit 749 -->

Schritt 2. Wenn Ausstecken Protokolle erzeugt, Einstecken jedoch nicht, ist die Polarität von plugin-det-gpios umgekehrt. Verwenden Sie bei einem invertierenden Transistor GPIO_ACTIVE_LOW. Ändern Sie zur Ereignisprüfung static int debug; in rk628_csi_v4l2.c zu static int debug = 3;. Korrekte Protokolle lauten tx_5v_power_present: 1 beim Einstecken und tx_5v_power_present: 0 beim Ausstecken.

<!-- source: CN V2.7 p107; unit 750 -->

Schritt 3. Wenn nach dem Einstecken nie ein gültiges Signal erkannt wird, prüfen Sie folgende Fälle:

<!-- source: CN V2.7 p107; unit 751 -->

Fall 1: invertiertes HPD. Der HDMI-Eingangsanschluss muss einen hohen HPD-Pegel erhalten, damit die Quelle ausgibt. Bei einem Inverter muss RK628 einen niedrigen Pegel treiben, damit am Anschluss ein hoher Pegel entsteht. Ergänzen Sie hpd-output-inverted; in DTS.

<!-- source: CN V2.7 p107; unit 752 -->

Fall 2: PHY kann nicht verriegeln; siehe clk-det-Fehlersuche.

<!-- source: CN V2.7 p107; unit 753 -->

Fall 3: Auflösung verriegelt nicht; HDMIRX erkennt möglicherweise eine Bitrate außerhalb des zulässigen Bereichs.

<!-- source: CN V2.7 p107; unit 754 -->

Fall 4: Auflösung verriegelt, aber AVI wird nicht bereit. avi_rcv_rdy sollte nach Signalverriegelung 1 werden. Wiederholtes avi_rcv_rdy:0 trotz erkannter Auflösung kann auf einen unkonfigurierten Interrupt-Pin hinweisen. Prüfen Sie zuerst die Interruptkonfiguration.

<!-- source: CN V2.7 p107; unit 755 -->

```text
rk628d 1-0050: rk628_is_avi_ready PDEC_AVI_PB:0x10000840, avi_rcv_rdy:0
rk628d 1-0050: SCDC_REGS1:0x80000f00, act:1920x1080, total:2200x1125, fps:60,

pixclk:148500000
```

<!-- source: CN V2.7 p107; unit 756 -->

Die Quelle berichtet unter diesen Bedingungen gelegentlich geteilte Bilder bei RK3288-Aufnahmen; dies ist kein ArmSoM-Test.

<!-- source: CN V2.7 p107; unit 757 -->

#### 6.15.5 Fehlerhafte Anzeige

<!-- source: CN V2.7 p107; unit 758 -->

(1) Prüfen Sie, ob die Eingangsquelle den DVI-Modus verwendet; RK628D unterstützt DVI nicht. Prüfen Sie dieses Protokoll:

<!-- source: CN V2.7 p107; unit 759 -->

```text
rk628-csi-v4l2 1-0051: DVI mode detected
```

<!-- source: CN V2.7 p107; unit 760 -->

(2) Prüfen Sie, ob die Quelle HDCP-Verschlüsselung verwendet. Aktivieren Sie in diesem Fall RK628 HDMIRX HDCP.

<!-- source: CN V2.7 p107; unit 761 -->

#### 6.15.6 Nur die halbe Bildfläche wird angezeigt

<!-- source: CN V2.7 p107; unit 762 -->

Wahrscheinlich ist eine 4K60-HDMI-Quelle an einen älteren Single-MIPI-Host wie RK3399, RK3568 oder RK3288 angeschlossen. RK628F/H teilt 4K60 in eine linke und rechte Hälfte; der Host empfängt daher nur die Hälfte. Begrenzen Sie in diesem Fall EDID durch Verwendung der RK628D-EDID auf 4K30:

<!-- source: CN V2.7 p108; unit 763 -->

```text
diff --git a/drivers/media/i2c/rk628/rk628_csi_v4l2.c b/drivers/media/i2c/rk628/rk628_csi_v4l2.c
index 32182d4433605..36568f5a081e0 100644

--- a/drivers/media/i2c/rk628/rk628_csi_v4l2.c
+++ b/drivers/media/i2c/rk628/rk628_csi_v4l2.c
@@ -1347,7 +1347,7 @@ static void rk628_csi_initial_setup(struct v4l2_subdev *sd)
      def_edid.start_block = 0;
      def_edid.blocks = 2;
      if (csi->rk628->version >= RK628F_VERSION)
-          def_edid.edid = rk628f_edid_init_data;
+          def_edid.edid = edid_init_data;
      else
           def_edid.edid = edid_init_data;
      rk628_csi_s_edid(sd, &def_edid);
```

<!-- source: CN V2.7 p108; unit 764 -->

#### 6.15.7 Aufnahmefehler

<!-- source: CN V2.7 p108; unit 765 -->

(1) Android ab 9.0 und Linux

<!-- source: CN V2.7 p108; unit 766 -->

Verwenden Sie v4l2-ctl zur Aufnahme unter Rockchip Android ab 9.0 oder Linux. Führen Sie zuerst media-ctl -d /dev/mediaX -p aus. Die Knotennummerierung hängt von der Plattform ab. Nach Deaktivierung des CIF-Controllers bleibt häufig media0; RK3399 an PHY1 kann media1 verwenden. Machen Sie sich mit der Kamerakonfiguration der Plattform vertraut. Wenn kein RK628-Knoten in der Topologie erscheint, prüfen Sie DTS. Weichen die Topologieauflösungen vom Eingang ab, setzen Sie sie mit media-ctl einheitlich.

<!-- source: CN V2.7 p108; unit 767 -->

Führen Sie anschließend aus:

<!-- source: CN V2.7 p108; unit 768 -->

```text
v4l2-ctl -d /dev/video0 --set-fmt-
video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=3`
```

<!-- source: CN V2.7 p108; unit 769 -->

Eine kontinuierliche Ausgabe von `<<<<<<<<<<` zeigt normale Aufnahme an und bedeutet gewöhnlich, dass der Treiber arbeitet. Bei dauerhaften oder sporadischen Fehlern:

<!-- source: CN V2.7 p108; unit 770 -->

```text
rkisp1: MIPI mis error:
```

<!-- source: CN V2.7 p108; unit 771 -->

Die Ursache kann in der Hardware liegen. Prüfen Sie HDMI-Leitungsabzweige und Impedanzabweichungen. Einige Platinen ergänzen Serienwiderstände in den HDMI-Leitungen, die im Referenzschaltplan fehlen; die Quelle verwendet 0 Ohm, sofern nichts anderes erforderlich ist. Andere Werte können sporadische Fehler verursachen. Analysieren Sie die tatsächliche Hardware und die Signale zwischen RK628 und Host.

<!-- source: CN V2.7 p108; unit 772 -->

Ein weiteres mögliches Protokoll lautet:

<!-- source: CN V2.7 p108; unit 773 -->

```text
rkisp-vir0: MIPI error: overflow: 0x00000001
```

<!-- source: CN V2.7 p108; unit 774 -->

Dieses Protokoll kann bei RK356X/RV11XX auftreten, wenn ISP 4K empfängt. Die Quelle empfiehlt einen RK628+VICAP-Pfad; siehe VICAP-Konfiguration in diesem Leitfaden.

<!-- source: CN V2.7 p108; unit 775 -->

SIZE_ERROR kann eine Auflösungsabweichung anzeigen, beispielsweise 720p-Eingang bei Aufnahme mit 1080p. Prüfen Sie jede Topologieauflösung und die v4l2-ctl-Aufnahmeauflösung. Die Quelle empfiehlt, zunächst durchgehend mit 1080p zu testen.

<!-- source: CN V2.7 p108; unit 776 -->

```text
rkisp1 ff910000.rkisp1: CIF_ISP_PIC_SIZE_ERROR
```

<!-- source: CN V2.7 p109; unit 777 -->

Das System fragt die Auflösung gewöhnlich über /dev/v4l-subdev2 ab, media-ctl -p kann jedoch stattdessen /dev/v4l-subdev3 anzeigen:

<!-- source: CN V2.7 p109; unit 778 -->

```text
 - entity 70: m00_b_rk628-csi rk628-csi (1 pad, 1 link)
       type V4L2 subdev subtype Sensor
       device node name /dev/v4l-subdev3

pad0: Source
   [fmt:UYVY2X8/1280x720]
   -> "rockchip-csi2-dphy0":0 []
```

<!-- source: CN V2.7 p109; unit 779 -->

Dann kann die Anwendung die Auflösung nicht erkennen und gibt möglicherweise CIF_ISP_PIC_SIZE_ERROR aus. Ändern Sie jni/native.cpp der Android-Anwendung wie folgt:

<!-- source: CN V2.7 p109; unit 780 -->

```text
strcat(video_name, "/dev/v4l-subdev2");
```

<!-- source: CN V2.7 p109; unit 781 -->

Ändern in:

<!-- source: CN V2.7 p109; unit 782 -->

```text
strcat(video_name, "/dev/v4l-subdev3");
```

<!-- source: CN V2.7 p109; unit 783 -->

(2) Keine Bilder bei 4K

<!-- source: CN V2.7 p109; unit 784 -->

4K verwendet höhere Frequenzen; daher kann schlechte Signalqualität die Ursache sein. Auch RK3399 ISP benötigt einen höheren Takt; siehe Konfigurationsmethode zur RK3399-ISP-Übertaktung.

<!-- source: CN V2.7 p109; unit 785 -->

#### 6.15.8 APK lässt sich nicht öffnen

<!-- source: CN V2.7 p109; unit 786 -->

Der veröffentlichte Patch enthält den rkCamera2-Quellcode. Bauen Sie ihn im Systemquellbaum, beispielsweise indem Sie ihn im Wurzelverzeichnis ablegen und mmm für das APK-Verzeichnis ausführen. Abstürze können folgende Ursachen haben:

<!-- source: CN V2.7 p109; unit 787 -->

(1) Abhängige Bibliotheken

<!-- source: CN V2.7 p109; unit 788 -->

Die alleinige APK-Installation kann Folgendes erzeugen:

<!-- source: CN V2.7 p109; unit 789 -->

```text
AndroidRuntime: java.lang.UnsatisfiedLinkError: dlopen failed: library
"/system/lib64/libhdmiinput_jni.so" needed or dlopened by

"/apex/com.android.runtime/lib64/libnativeloader.so" is not accessible for
the namespace "classloader-namespace"
```

<!-- source: CN V2.7 p109; unit 790 -->

Bauen und paketieren Sie die APK im SDK, damit die abhängigen Bibliotheken im Image enthalten sind.

<!-- source: CN V2.7 p109; unit 791 -->

(2) Dateiberechtigungen

<!-- source: CN V2.7 p109; unit 792 -->

Die APK greift über ioctl auf RK628-Knoten zu, beispielsweise:

<!-- source: CN V2.7 p109; unit 793 -->

```text
HdmiInput-navtive: openDevice(113): open /dev/v4l-subdev2
failed,erro=Permission denied
```

<!-- source: CN V2.7 p109; unit 794 -->

Prüfen Sie zuerst die Dateiberechtigungen; der Quellpatch setzt den Modus 666. Da die APK auf Geräteknoten zugreift, fragt die Quelle außerdem, ob SELinux deaktiviert ist; prüfen Sie seinen Zustand mit getenforce. Dies beschreibt die Debugging-Umgebung der Quelle und ist keine Empfehlung, die Sicherheit im Produktivbetrieb zu schwächen.

<!-- source: CN V2.7 p109; unit 795 -->

(3) Konfiguration der höheren Schichten

<!-- source: CN V2.7 p109; unit 796 -->

Konfigurieren Sie camera3_profiles.xml für Android ab 9.0 beziehungsweise cam_board.xml für ältere Versionen. Prüfen Sie dumpsys media.camera; fehlende Einträge können auf fehlende Konfiguration hinweisen:

<!-- source: CN V2.7 p110; unit 797 -->

```text
$ dumpsys media.camera

== Service global info: ==


Number of camera devices: 1
Number of normal camera devices: 1
```

<!-- source: CN V2.7 p110; unit 798 -->

(4) Absturz der Kamerabibliothek

<!-- source: CN V2.7 p110; unit 799 -->

Der folgende Fehler kann durch einen falschen Kameranamen entstehen: getDataFromXmlFile liefert einen Namen, der nicht zum Treiber passt, und verursacht dadurch einen Absturz.

<!-- source: CN V2.7 p110; unit 800 -->

```text
09-29 04:43:30.673 405 405 W ServiceManagement: Waited one second for
android.hardware.camera.provider@2.4::ICameraProvider/legacy/0. Waiting

another...
09-29 04:43:31.673 405 405 W ServiceManagement: Waited one second for
android.hardware.camera.provider@2.4::ICameraProvider/legacy/0. Waiting
another...
...
09-29 04:43:31.904 1404 1404 F DEBUG : backtrace:
09-29 04:43:31.904 1404 1404 F DEBUG : #00 pc 0007214e
/vendor/lib/hw/camera.rk30board.so
(android::camera2::ChromeCameraProfiles::handleAndroidStaticMetadata(char const*,
char const**)+546)
09-29 04:43:31.904 1404 1404 F DEBUG : #01 pc 00007895 /system/lib/vndk-
28/libexpat.so (doContent+432)
09-29 04:43:31.905 1404 1404 F DEBUG : #02 pc 0000637b /system/lib/vndk-

28/libexpat.so (contentProcessor+40)
09-29 04:43:31.905 1404 1404 F DEBUG : #03 pc 00003825 /system/lib/vndk-
28/libexpat.so (XML_ParseBuffer+84)
09-29 04:43:31.905 1404 1404 F DEBUG : #04 pc 000711ad
/vendor/lib/hw/camera.rk30board.so
(android::camera2::CameraProfiles::getDataFromXmlFile()+148)
09-29 04:43:31.905 1404 1404 F DEBUG : #05 pc 00071e97
/vendor/lib/hw/camera.rk30board.so
(android::camera2::ChromeCameraProfiles::init()+86)
09-29 04:43:31.905 1404 1404 F DEBUG : #06 pc 000734c7
/vendor/lib/hw/camera.rk30board.so (android::camera2::PlatformData::init()+198)
09-29 04:43:31.905 1404 1404 F DEBUG : #07 pc 000cecb3

/vendor/lib/hw/camera.rk30board.so (initCameraHAL()+46)
...
```

<!-- source: CN V2.7 p110; unit 801 -->

Wenn V4L2 erforderlich ist (Android ab 9.0), ändern Sie name="rk628-csi" in camera3_profiles_rk3399.xml wie folgt zu name="rk628-csi-v4l2":

<!-- source: CN V2.7 p110; unit 802 -->

```text
hardware/rockchip/camera
--- a/etc/camera/camera3_profiles_rk3399.xml
+++ b/etc/camera/camera3_profiles_rk3399.xml

@@ -769,7 +769,7 @@

 <!-- ******************PSL specific section end
**************************************************************-->
   </Profiles>
-  <Profiles cameraId="0" name="rk628-csi" moduleId="m00">
+  <Profiles cameraId="0" name="rk628-csi-v4l2" moduleId="m00">
```

<!-- source: CN V2.7 p111; unit 803 -->

(5) Berechtigungsbedingte APK-Abstürze

<!-- source: CN V2.7 p111; unit 804 -->

Das Protokoll dieses Problems sieht gewöhnlich wie folgt aus:

<!-- source: CN V2.7 p111; unit 805 -->

Wenn V4L2 erforderlich ist (Android ab 9.0), ändern Sie rk628-csi zu rk628-csi-v4l2.

<!-- source: CN V2.7 p111; unit 806 -->

```text
09-24 10:21:20.154 1552 1570 E AndroidRuntime: FATAL EXCEPTION: Thread-2
09-24 10:21:20.154 1552 1570 E AndroidRuntime: Process:

com.android.rockchip.camera2, PID: 1552
09-24 10:21:20.154 1552 1570 E AndroidRuntime: java.lang.IllegalStateException:
startRecording() called on an uninitialized AudioRecord.
09-24 10:21:20.154 1552 1570 E AndroidRuntime: at
android.media.AudioRecord.startRecording(AudioRecord.java:983)
09-24 10:21:20.154 1552 1570 E AndroidRuntime: at
com.android.rockchip.camera2.AudioStream$recordSound.run(AudioStream.java:199)
09-24 10:21:20.154 1552 1570 E AndroidRuntime: at
java.lang.Thread.run(Thread.java:764)
09-24 10:21:20.164 464 820 W ActivityManager: Force finishing activity
com.android.rockchip.camera2/.RockchipCamera2
09-24 10:21:20.183 1552 1552 D RockchipCamera2: onPause
```

<!-- source: CN V2.7 p111; unit 807 -->

Folgender Patch kann das Problem beheben:

<!-- source: CN V2.7 p111; unit 808 -->

```text
packages/apps/rkCamera2
--- a/AndroidManifest.xml

+++ b/AndroidManifest.xml
@@ -4,7 +4,8 @@
   package="com.android.rockchip.camera2">

      <uses-permission android:name="android.permission.CAMERA" />
-     <uses-permission
android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
+     <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
/>
+     <uses-permission android:name="android.permission.RECORD_AUDIO" />
   <application
      android:allowBackup="true"
      android:icon="@mipmap/ic_launcher"

diff --git a/src/com/android/rockchip/camera2/RockchipCamera2.java b/src/com/android/rockchip/camera2/RockchipCamera2.java
index 9dc29b8..02ee104 100755
--- a/src/com/android/rockchip/camera2/RockchipCamera2.java
+++ b/src/com/android/rockchip/camera2/RockchipCamera2.java
@@ -100,9 +100,11 @@ public class RockchipCamera2 extends Activity {
      if (ActivityCompat.checkSelfPermission(this,
         Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED
         && ActivityCompat.checkSelfPermission(this,
-             Manifest.permission.WRITE_EXTERNAL_STORAGE) !=
PackageManager.PERMISSION_GRANTED) {
+             Manifest.permission.WRITE_EXTERNAL_STORAGE) !=

PackageManager.PERMISSION_GRANTED
+        && ActivityCompat.checkSelfPermission(this,
+             Manifest.permission.RECORD_AUDIO) !=
PackageManager.PERMISSION_GRANTED) {
         ActivityCompat.requestPermissions(RockchipCamera2.this,
-          new String[] { Manifest.permission.CAMERA,
Manifest.permission.WRITE_EXTERNAL_STORAGE },
+          new String[] { Manifest.permission.CAMERA,

Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.RECORD_AUDIO},
           REQUEST_CAMERA_PERMISSION);
         return;
      }
```

<!-- source: CN V2.7 p112; unit 809 -->

<!-- source: CN V2.7 p112; unit 810 -->

#### 6.15.9 DTS verbindet mit rkcif, aber die APK-Vorschau scheitert

<!-- source: CN V2.7 p112; unit 811 -->

Wenn bei RK356X mit Android-11-Codeversion R10/R11 DTS den RK628 mit rkcif verbindet und die Bilderfassung funktioniert, die APK-Vorschau jedoch scheitert, unterstützt der cameraHAL-Code in R10 und R11 möglicherweise diese Pipeline nicht. Laut Quelle besteht das Problem bei R9 nicht. Diagnose und Behebung:

<!-- source: CN V2.7 p112; unit 812 -->

(1) cameraHAL-Debugging aktivieren:

<!-- source: CN V2.7 p112; unit 813 -->

```text
setprop persist.vendor.camera.hal.debug 5
```

<!-- source: CN V2.7 p112; unit 814 -->

(2) Erfassen Sie logcat, wenn das Öffnen der APK scheitert. Relevante Protokolleinträge:

<!-- source: CN V2.7 p112; unit 815 -->

![Technische Originalabbildung — EN V2.3, S. 107](/docs/rockchip-rk628-porting/assets/en-p107-X551.png)

*Technische Originalabbildung: EN V2.3, S. 107.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:rockchip-csi2-dphy0, srcPad:1, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:1, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:2, sinkName:rkisp_rawwr0, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:4, sinkName:rkisp_rawwr2, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:5, sinkName:rkisp_rawwr3, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addFormatParams, entityName:none, width:1920, height:1080, pad:0, format:0x2006:V4L2_MBUS_FMT_UYVY8_2X8, field:0
I RkCamera: <HAL> RKISP2GraphConfig: @addSelectionParams, width:1920, height:1080, left:0, top:0, target:0, pad:0, entityName:none
I RkCamera: <HAL> RKISP2GraphConfig: @addSelectionParams, width:1920, height:1080, left:0, top:0, target:0, pad:2, entityName:none
I RkCamera: <HAL> RKISP2GraphConfig: @addFormatParams, entityName:none, width:1920, height:1080, pad:2, format:0x2008:V4L2_MBUS_FMT_YUYV8_2X8, field:0
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:3, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:0, sinkName:none, sinkPad:1, enable:1, flags:1
D RkCamera: <HAL> RKISP2GraphConfig: @ isNeedPathCrop : stream ratios: 1.777778
D RkCamera: <HAL> RKISP2GraphConfig: @ isNeedPathCrop : mp_need_crop 1, sp_need_crop 0, sp_enabled 0
D RkCamera: <HAL> RKISP2GraphConfig: @ calc_crop : src_ratio:1.777778, dst_ratio:1.777778, src(1920x1080), dst(1920x1080)
I RkCamera: <HAL> RKISP2GraphConfig: @addSelectionVideoParams, width:1920, height:1080, left:0, top:0, target:0, type:1, flags:0 entityName:none
I RkCamera: <HAL> RKISP2GraphConfig: @addFormatParams, entityName:none, width:1920, height:1080, pad:0, format:0x3231564e:V4L2_PIX_FMT_NV12, field:0
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:2, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @getImguMediaCtlConfig : No need for selfPath
```

<!-- source: CN V2.7 p112; unit 816 -->

Wenn das obige Protokoll erscheint, hat cameraHAL die zugehörige Pipeline standardmäßig für rkisp konfiguriert, während DTS sie für rkcif konfiguriert. Die Quelle schreibt cameraHAL an dieser Stelle als ameraHAL.

<!-- source: CN V2.7 p112; unit 817 -->

(3) Lösung

<!-- source: CN V2.7 p112; unit 818 -->

Ergänzen Sie folgende Änderungen in hardware/rockchip/camera:

<!-- source: CN V2.7 p112; unit 819 -->

```text
diff --git a/psl/rkisp2/RKISP2GraphConfig.cpp b/psl/rkisp2/RKISP2GraphConfig.cpp
index 2a5fa5a..3d2409c 100755
--- a/psl/rkisp2/RKISP2GraphConfig.cpp

+++ b/psl/rkisp2/RKISP2GraphConfig.cpp
@@ -76,6 +76,7 @@ const string MEDIACTL_POSTVIEWNAME = "postview";

 const string MEDIACTL_STATNAME = "rkisp1-statistics";
 const string MEDIACTL_VIDEONAME_CIF = "stream_cif_dvp_id0";
+const string MEDIACTL_VIDEONAME_CIF_MIPI_ID0 = "stream_cif_mipi_id0";

 RKISP2GraphConfig::RKISP2GraphConfig() :
      mManager(nullptr),
@@ -2620,6 +2621,13 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
            addLinkParams("rkisp-isp-subdev", 2, "rkisp_mainpath", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);

            addLinkParams("rkisp-isp-subdev", 2, "rkisp_selfpath", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
         }
+     } else if(mipName2.find("mipi") != std::string::npos) {
+        addLinkParams(mipName, mipSrcPad, mipName2, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);

+        addLinkParams(mipName2, 1, "stream_cif_mipi_id0", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 2, "stream_cif_mipi_id1", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 3, "stream_cif_mipi_id2", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 4, "stream_cif_mipi_id3", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        mSensorLinkedToCIF = true;
      } else {
         addLinkParams(mipName, mipSrcPad, csiName, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);

         addLinkParams(csiName, csiSrcPad, IspName, ispSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
@@ -2628,6 +2636,12 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
         addLinkParams(csiName, 5, "rkisp_rawwr3", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
      }
   }
+  if(mSensorLinkedToCIF){
+     addImguVideoNode(IMGU_NODE_VIDEO, MEDIACTL_VIDEONAME_CIF_MIPI_ID0,
mediaCtlConfig);
+     addFormatParams(MEDIACTL_VIDEONAME_CIF_MIPI_ID0, mCurSensorFormat.width,
mCurSensorFormat.height,

+           0, V4L2_PIX_FMT_NV12, 0, 0, mediaCtlConfig);
+     return OK;
+  }
   // isp input pad format and selection config
   addFormatParams(IspName, ispInWidth, ispInHeight, ispSinkPad, ispInFormat,
0, 0, mediaCtlConfig);
   addSelectionParams(IspName, ispInWidth, ispInHeight, 0, 0,
V4L2_SEL_TGT_CROP, ispSinkPad, mediaCtlConfig);
```

<!-- source: CN V2.7 p113; unit 820 -->

<!-- source: CN V2.7 p113; unit 821 -->

#### 6.15.10 RK628-GPIOs bedienen

<!-- source: CN V2.7 p113; unit 822 -->

Rufen Sie die GPIO-Schnittstelle direkt an der Stelle auf, an der GPIO-Steuerung benötigt wird. Diese Schnittstelle umfasst IOMUX-Auswahl, GPIO-Richtung und Konfiguration des Ausgangspegels. Die folgenden Operationen konfigurieren beispielsweise I2C_SDA_HDMI und I2C_SCL_HDMI als GPIOs.

<!-- source: CN V2.7 p113; unit 823 -->

```text
rk628_gpio_direction_output(rk628, GPIO1_B1, GPIO_REG_HIGH);
rk628_gpio_direction_output(rk628, GPIO1_B2, GPIO_REG_HIGH)；
```

<!-- source: CN V2.7 p113; unit 824 -->

Rufen Sie zur Wiederherstellung der ursprünglichen Funktion folgende Schnittstelle auf:

<!-- source: CN V2.7 p113; unit 825 -->

```text
rk628_pinctrl_set_mux(rk628, GPIO1_B1, DDCM0SDARX);
rk628_pinctrl_set_mux(rk628, GPIO1_B2, DDCM0SCLRX)；
```

<!-- source: CN V2.7 p114; unit 826 -->

#### 6.15.11 Soundkartenregistrierung scheitert

<!-- source: CN V2.7 p114; unit 827 -->

Im folgenden Beispiel wird die hdmiin-Soundkarte nach dem Systemstart nicht gefunden:

<!-- source: CN V2.7 p114; unit 828 -->

```text
# cat /proc/asound/cards
 1 [rockchiphdmiin ]: rockchip_hdmiin - rockchip,hdmiin
                rockchip,hdmiin
```

<!-- source: CN V2.7 p114; unit 829 -->

Prüfen Sie zunächst, ob die soc-dai- und codec-dai-Geräte, von denen die Soundkarte abhängt, erfolgreich geladen wurden:

<!-- source: CN V2.7 p114; unit 830 -->

```text
rk3399:/ # cat /sys/kernel/debug/asoc/components
...
dummy-codec

ff8a0000.i2s
ff8a0000.i2s
ff880000.i2s
ff880000.i2s
...
rk3399:/ # cat /sys/kernel/debug/asoc/dais
...
ff8a0000.i2s
ff880000.i2s
dummy-codec
....
```

<!-- source: CN V2.7 p114; unit 831 -->

Falls diese Knoten nicht geladen werden, prüfen Sie defconfig und DTS.

<!-- source: CN V2.7 p114; unit 832 -->

Wenn soc dai und codec dai erfolgreich registriert werden, die Soundkarte jedoch nicht, reichen möglicherweise die DMA-Ressourcen nicht aus. Die Quelle berichtet dies besonders häufig bei RK3399. Ergänzen Sie bei Kerneln ab 4.19 folgende Eigenschaft im i2s-Knoten zur Behebung:

<!-- source: CN V2.7 p114; unit 833 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3399.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399.dtsi

@@ -1788,6 +1788,7 @@
           clocks = <&cru SCLK_I2S2_8CH>, <&cru HCLK_I2S2_8CH>;
           resets = <&cru SRST_I2S2_8CH>, <&cru SRST_H_I2S2_8CH>;
           reset-names = "reset-m", "reset-h";
+          rockchip,capture-only;
           power-domains = <&power RK3399_PD_SDIOAUDIO>;
           status = "disabled";
```

<!-- source: CN V2.7 p114; unit 834 -->

## 7. Häufige Anforderungen

<!-- source: CN V2.7 p114; unit 835 -->

### 7.1 Einen von einem anderen SoC gelieferten RK628-24M-Takt konfigurieren

<!-- source: CN V2.7 p114; unit 836 -->

Die folgenden Beispiele beschreiben die Konfiguration für mehrere Rockchip-Host-SoCs. Dabei wird vorausgesetzt, dass alle in diesen DTS-Beispielen konfigurierten Takte im Code aktiviert werden. Andernfalls wird der 24M-Takt nach dem Booten abgeschaltet, was I2C-Kommunikationsfehler verursacht.

<!-- source: CN V2.7 p115; unit 837 -->

#### 7.1.1 24M-Unterstützung auf RK3399 ergänzen

<!-- source: CN V2.7 p115; unit 838 -->

(1) Verwenden Sie folgende Konfiguration als Referenz im rk628-DTS:

<!-- source: CN V2.7 p115; unit 839 -->

```text
pinctrl-names = "default";
pinctrl-0 = <&rk628_rst>, <&clk_testout2>;
assigned-clocks = <&cru SCLK_TESTCLKOUT2>;

assigned-clock-rates = <24000000>;
clocks = <&cru SCLK_TESTCLKOUT2>;
clock-names = "soc_24M";
```

<!-- source: CN V2.7 p115; unit 840 -->

(2) Ergänzen Sie die PINCTRL-Konfiguration der I/O-Pins entsprechend den tatsächlichen Hardwareverbindungen:

<!-- source: CN V2.7 p115; unit 841 -->

```text
&pinctrl {
      test {
           clk_testout2: clk_testout2 {

           rockchip,pins = <0 8 RK_FUNC_3 &pcfg_pull_none>;
      };
};
```

<!-- source: CN V2.7 p115; unit 842 -->

#### 7.1.2 24M-Unterstützung auf RK3288 ergänzen

<!-- source: CN V2.7 p115; unit 843 -->

(1) Verwenden Sie folgende Konfiguration als Referenz im rk628-DTS:

<!-- source: CN V2.7 p115; unit 844 -->

```text
pinctrl-names = "default";
pinctrl-0 = <&test_clkout>;
assigned-clocks = <&cru SCLK_TESTOUT_SRC>;

assigned-clock-parents = <&xin24m>;
clocks = <&cru SCLK_TESTOUT>;
clock-names = "soc_24M";
```

<!-- source: CN V2.7 p115; unit 845 -->

(2) Ergänzen Sie die PINCTRL-Konfiguration der I/O-Pins entsprechend den tatsächlichen Hardwareverbindungen:

<!-- source: CN V2.7 p115; unit 846 -->

```text
&pinctrl {
      test {
           test_clkout: test-clkout {

                 rockchip,pins = <0 17 RK_FUNC_1 &pcfg_pull_none>;
           };
      };
};
```

<!-- source: CN V2.7 p115; unit 847 -->

#### 7.1.3 24M-Unterstützung auf RK356X ergänzen

<!-- source: CN V2.7 p115; unit 848 -->

RK356X besitzt mehrere Pins zur Ausgabe von 24 MHz, darunter REF_CLKOUT (clk_wifi/gpio0_a0), CAM_CLKOUT1 (clk_cam1_out/gpio4_b0) und ETH_REFCLK_25M_M0 (clk_mac1_out/gpio3_b0). Das folgende Beispiel verwendet clk_wifi.

<!-- source: CN V2.7 p115; unit 849 -->

(1) Verwenden Sie folgende Konfiguration als Referenz im rk628-DTS:

<!-- source: CN V2.7 p115; unit 850 -->

```text

&i2c2_rk628 {
   pinctrl-names = "default";
   pinctrl-0 = <&rk628_reset &refclk_pins>;

   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clocks = <&pmucru CLK_WIFI>;
   clock-names = "soc_24M";
};

&pinctrl {
   rk628 {
      rk628_reset: rk628-reset {
         rockchip,pins = <2 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
      };
   };

};
```

<!-- source: CN V2.7 p116; unit 851 -->

<!-- source: CN V2.7 p116; unit 852 -->

(2) Folgende Konfiguration ist bereits in rk3568-pinctrl.dtsi enthalten:

<!-- source: CN V2.7 p116; unit 853 -->

```text
&pinctrl {
   ......

   refclk {
      /omit-if-no-ref/
      refclk_pins: refclk-pins {
         rockchip,pins =
           /* refclk_ou */
           <0 RK_PA0 1 &pcfg_pull_none>;
      };
   };
   ......
};
```

<!-- source: CN V2.7 p116; unit 854 -->

Für hier nicht aufgeführte Rockchip-Chips siehe Rockchip_Develop_Guide_Gpio_Output_Clocks_CN.pdf zur 24M-Taktkonfiguration.

<!-- source: CN V2.7 p116; unit 855 -->

### 7.2 Unterstützung für zwei RK628

<!-- source: CN V2.7 p116; unit 856 -->

#### 7.2.1 HDMI2CSI + HDMI2CSI unterstützen

<!-- source: CN V2.7 p116; unit 857 -->

##### 7.2.1.1 Wichtige Hinweise

<!-- source: CN V2.7 p116; unit 858 -->

(1) Zwei RK628-Geräte arbeiten ähnlich wie eine Dual-Kamera-Konfiguration. Für gleichzeitigen Betrieb beider RK628 muss der Host zwei ISP-Controller unterstützen, die zwei Eingänge gleichzeitig verarbeiten, wie bei RK3399.

<!-- source: CN V2.7 p116; unit 859 -->

<!-- source: CN V2.7 p116; unit 860 -->

(2) Verbinden Sie im Hardwaredesign die beiden RK628-Geräte mit verschiedenen I2C-Bussen oder mit unterschiedlichen I2C-Adressen am selben I2C-Bus.

<!-- source: CN V2.7 p116; unit 861 -->

<!-- source: CN V2.7 p116; unit 862 -->

(3) Die DTS-Konfiguration muss dem Hardwaredesign entsprechen. Ob ein bestimmter RK628 physisch mit mipi_phy_rx0 oder mipi_phy_tx1rx1 verbunden ist, muss auch in seiner DTS-Konfiguration abgebildet sein.

<!-- source: CN V2.7 p116; unit 863 -->

<!-- source: CN V2.7 p116; unit 864 -->

(4) Beim Einsatz zweier RK628-Geräte für HDMI2CSI dürfen deren RESET- und INT-Steuer-I/Os nicht gemeinsam verwendet werden; andernfalls ist der Betrieb fehlerhaft.

<!-- source: CN V2.7 p116; unit 865 -->

<!-- source: CN V2.7 p117; unit 866 -->

##### 7.2.1.2 Kernel-DTS-Konfiguration

<!-- source: CN V2.7 p117; unit 867 -->

Das folgende Beispiel konfiguriert zwei RK628-Geräte an RK3399.

<!-- source: CN V2.7 p117; unit 868 -->

(1) rk628 -> mipi_dphy_rx0 -> rkisp1_0: Der erste Pfad hat index 0 und facing ist auf back gesetzt.

<!-- source: CN V2.7 p117; unit 869 -->

```text
&i2c1 {
   status = "okay";


   rk628_csi_v4l2: rk628_csi_v4l2@50 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;

      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
           remote-endpoint = <&hdmi2mipi_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };

};

&mipi_dphy_rx0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         hdmi2mipi_in: endpoint@1 {
           reg = <1>;
           remote-endpoint = <&rk628_out>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;


         dphy_rx0_out: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&isp0_mipi_in>;
         };
      };
   };
};

&rkisp1_0 {
   status = "okay";


   port {
      #address-cells = <1>;
      #size-cells = <0>;

      isp0_mipi_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dphy_rx0_out>;
      };
   };
};
```

<!-- source: CN V2.7 p118; unit 870 -->

<!-- source: CN V2.7 p118; unit 871 -->

(2) rk628 -> mipi_dphy_tx1rx1 -> rkisp1_1: Der zweite Pfad hat index 1 und facing ist auf front gesetzt.

<!-- source: CN V2.7 p118; unit 872 -->

```text
&i2c4 {
   status = "okay";


   rk628_csi_v4l2_1: rk628_csi_v4l2_1@50 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio3>;
      interrupts = <12 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq1>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD3 GPIO_ACTIVE_LOW>;

      plugin-det-gpios = <&gpio0 RK_PD7 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out1: endpoint {
           remote-endpoint = <&hdmi2mipi_in1>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};

&mipi_dphy_tx1rx1 {

   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         hdmi2mipi_in1: endpoint@1 {

           reg = <1>;
           remote-endpoint = <&rk628_out1>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         dphy_tx1rx1_out: endpoint@0 {
           reg = <0>;

           remote-endpoint = <&isp1_mipi_in>;
         };
      };
   };
};

&rkisp1_1 {
   status = "okay";

   port {
      #address-cells = <1>;
      #size-cells = <0>;


      isp1_mipi_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dphy_tx1rx1_out>;
      };
   };
};
```

<!-- source: CN V2.7 p119; unit 873 -->

<!-- source: CN V2.7 p119; unit 874 -->

##### 7.2.1.3 Android-Konfiguration

<!-- source: CN V2.7 p119; unit 875 -->

(1) Hinweise zur Konfiguration von camera3_profiles.xml:

<!-- source: CN V2.7 p119; unit 876 -->

moduleId muss index in DTS entsprechen.

<!-- source: CN V2.7 p119; unit 877 -->

Erster RK628:

<!-- source: CN V2.7 p120; unit 878 -->

![Technische Originalabbildung — EN V2.3, S. 115](/docs/rockchip-rk628-porting/assets/en-p115-X581.png)

*Technische Originalabbildung: EN V2.3, S. 115.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
</Profiles>
<Profiles cameraId="0" name="rk628-csi" moduleId="m00">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
    </Supported_hardware>
```

<!-- source: CN V2.7 p120; unit 879 -->

Zweiter RK628:

<!-- source: CN V2.7 p120; unit 880 -->

![Technische Originalabbildung — EN V2.3, S. 115](/docs/rockchip-rk628-porting/assets/en-p115-X582.png)

*Technische Originalabbildung: EN V2.3, S. 115.*

Editierbare Transkription des vollständig sichtbaren Screenshot-Texts. Abgeschnittene Randzeichen werden nicht rekonstruiert; Fragmente sind nicht unbedingt eigenständig ausführbare Beispiele.

```text
</Profiles>
<Profiles cameraId="1" name="rk628-csi" moduleId="m01">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
    </Supported_hardware>
```

<!-- source: CN V2.7 p120; unit 881 -->

(2) Ergänzen Sie zur gleichzeitigen Verwendung beider RK628-Geräte die cameraHAL-Unterstützung durch folgende Änderungen in SDK/hardware/rockchip/camera:

<!-- source: CN V2.7 p120; unit 882 -->

<!-- source: CN V2.7 p120; unit 883 -->

```text
diff --git a/common/platformdata/PlatformData.cpp b/common/platformdata/PlatformData.cpp

index 36d2ac9..d3fcb4b 100755
--- a/common/platformdata/PlatformData.cpp
+++ b/common/platformdata/PlatformData.cpp
@@ -1047,7 +1047,7 @@ CameraHWInfo::CameraHWInfo() :
   mProductName = "<not_set>";
   mManufacturerName = "<not set>";
   mCameraDeviceAPIVersion = CAMERA_DEVICE_API_VERSION_3_3;
-  mSupportDualVideo = false;
+  mSupportDualVideo = true;
   mSupportExtendedMakernote = false;
   mSupportFullColorRange = true;
   mSupportIPUAcceleration = false;
```

<!-- source: CN V2.7 p120; unit 884 -->

#### 7.2.2 HDMI2CSI + HDMI2DSI unterstützen

<!-- source: CN V2.7 p120; unit 885 -->

##### 7.2.2.1 Kernel-DTS-Konfiguration

<!-- source: CN V2.7 p120; unit 886 -->

Bei einer HDMI2CSI-+-HDMI2DSI-Kombination verbindet sich ein RK628 über das Kamera-Framework mit dem Host, während der andere RK628 mit der Anzeige verbunden ist. Das folgende Beispiel verwendet RK3399.

<!-- source: CN V2.7 p120; unit 887 -->

(1) HDMI2CSI-Konfiguration

<!-- source: CN V2.7 p120; unit 888 -->

Verwenden Sie rk628 -> mipi_phy_rx0 -> rkisp1_0 oder rk628 -> mipi_dphy_tx1rx1 -> rkisp1_1. Das Beispiel verbindet mit rkisp1_0.

<!-- source: CN V2.7 p120; unit 889 -->

```text
&i2c1 {
   status = "okay";


   rk628_csi_v4l2: rk628_csi_v4l2@50 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;

      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
            remote-endpoint = <&hdmi2mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };

   };
};

&mipi_dphy_rx0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;

         #size-cells = <0>;

         hdmi2mipi_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&rk628_out>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;

         #size-cells = <0>;

         dphy_rx0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&isp0_mipi_in>;
         };
      };
   };
};

&rkisp1_0 {
   status = "okay";


   port {
      #address-cells = <1>;
      #size-cells = <0>;
      isp0_mipi_in: endpoint@0 {
         reg = <0>;

         remote-endpoint = <&dphy_rx0_out>;
      };
   };
};
```

<!-- source: CN V2.7 p121; unit 890 -->

<!-- source: CN V2.7 p122; unit 891 -->

<!-- source: CN V2.7 p122; unit 892 -->

(2) HDMI2DSI-Konfiguration

<!-- source: CN V2.7 p122; unit 893 -->

Siehe direkt die HDMI2DSI-Konvertierungskonfiguration in Abschnitt 2.4.5.

<!-- source: CN V2.7 p122; unit 894 -->

##### 7.2.2.2 Android-Konfiguration

<!-- source: CN V2.7 p122; unit 895 -->

(1) HDMI2CSI: Folgen Sie der Konfiguration eines einzelnen RK628-HDMI2CSI-Pfads und konfigurieren Sie camera3_profiles.xml korrekt.

<!-- source: CN V2.7 p122; unit 896 -->

(2) HDMI2DSI: Auf Android-Seite ist keine Konfiguration erforderlich.

{% endraw %}


