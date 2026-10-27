---
title: "Rockchip Android BOX-Displayframework konfigurieren"
description: "DRM-Anzeigemodi und Baseparameter-Partition konfigurieren: Framebuffer, Backupaufbau und Diagnose."
excerpt: "DRM-Anzeigemodi und Baseparameter-Partition konfigurieren: Framebuffer, Backupaufbau und Diagnose."
translation_key: "256-rockchip-android-box-display"
slug: "256-rockchip-android-box-display"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}


Quelle:RK-SM-YF-504 V1.0.1,CN. BOX-SDK-Einstellungen für Auflösung,Skalierung,Farbe,BCSH,Framebuffer und Haupt-/Nebendisplay. Geltung:RK3328/RK3368/RK3229,Linux4.4/Linux4.19,Android8.1+. Keine ArmSoM-Prüfung oder Bestätigung aller Folge-SDKs;keine Befehle ausgeführt. Sechs CN-Originalbilder,keine EN-Quelle.

## 1 Displayeinstellungen

### 1.1 Ablauf der Displayeinstellungen

Beschriebene RK-Plattform Android8.1+ nutzt DRM (Direct Rendering Manager). Obere Schnittstellen konfigurieren Parameter,HWC setzt sie über libdrm um. Diagramm:TVSetting → rkdisplay → HWC → libdrm → Kernel.

![Einstellungsablauf](/docs/rockchip-android-box-display/images/display-flow.png)

Einstellungsablauf - Originalabbildung;PDF-Seite 5 (CN).

### 1.2 Auflösungsfilter

Anfangsliste enthält unnötige Modi. HWC filtert HDMI/DP-Hotplug-Modi anhand device/rockchip/common/resolution_white.xml vor Weitergabe nach oben. Jeder `<resolution>`-Block erlaubt einen Modus;Timingfelder siehe Originaldiagramm.

| Feld | Bedeutung |
| --- | --- |
| clock | Takt |
| hdisplay | Timingfeld laut Quellabbildung2 |
| hsync_start | Timingfeld laut Quellabbildung2 |
| hsync_end | Timingfeld laut Quellabbildung2 |
| htotal | Timingfeld laut Quellabbildung2 |
| hskew | Timingfeld laut Quellabbildung2 |
| vdisplay | Timingfeld laut Quellabbildung2 |
| vsync_start | Timingfeld laut Quellabbildung2 |
| vsync_end | Timingfeld laut Quellabbildung2 |
| vtotal | Timingfeld laut Quellabbildung2 |
| vscan | Timingfeld laut Quellabbildung2 |
| vrefresh | Bildrate |
| flags | Sync-/Interlace-Bits unten |
| vic | HDMI-VIC;0 falls nicht definiert |

```c
DRM_MODE_FLAG_PHSYNC (1<<0)
DRM_MODE_FLAG_NHSYNC (1<<1)
DRM_MODE_FLAG_PVSYNC (1<<2)
DRM_MODE_FLAG_NVSYNC (1<<3)
DRM_MODE_FLAG_INTERLACE (1<<4)
```

![Timingdefinitionen](/docs/rockchip-android-box-display/images/mode-timing.png)

Timingdefinitionen - Originalabbildung;PDF-Seite 6 (CN).

## 2 Baseparameter-Partition

### 2.1 Baseparameter-Abbild

Displaywerte liegen in1MB-Baseparameter-Partition,initialisiert durch Flashen von baseparameter.img. SDK-Standard:device/rockchip/common/baseparameter/baseparameter_fb1080.img. Ersatz mit saveBaseParameter erzeugen,TARGET_BASE_PARAMETER_IMAGE in BoardConfig.mk setzen:

```make
TARGET_BASE_PARAMETER_IMAGE := device/rockchip/rk3328/baseparameter.img
```

### 2.2 saveBaseParameter

Tool liest,setzt,exportiert Partition. Quelle:device/rockchip/common/baseparameter/saveBaseParameter. Standardmäßig in eng/userdebug,auf Gerät ausführen. -h Hilfe,-p Daten,-t `<path>` exportiert Abbild für Pull/Flash. Weitere Optionen der Originalhilfe:

| Option | Bedeutung/Beispiel |
| --- | --- |
| -d | Display0/1 |
| -f | 1920x1080@60 |
| -D | HDMI-A,TV |
| -c | RGB, YCbCr444-10bit |
| -u | 2 automatische Auflösung;1 feste |
| -o | Overscan100,100,100,100 |
| -b | BCSH50,50,50,50 |
| -R | 1 nur Nutzereinstellungen;2 Partition inklusive Backup zurücksetzen |

![saveBaseParameter-Hilfe](/docs/rockchip-android-box-display/images/tool-help.png)

saveBaseParameter-Hilfe - Originalabbildung;PDF-Seite 7 (CN).

![Partitionsdatenbeispiel](/docs/rockchip-android-box-display/images/partition-dump.png)

Partitionsdatenbeispiel - Originalabbildung;PDF-Seite 8 (CN).

Basisbereich erhält Nutzerwerte;Werksreset löscht ihn und kopiert Backup hinein. Beide Bereiche enthalten main/aux:resolution,color,fbinfo(Framebuffer),device,bcsh(Helligkeit,Kontrast,Sättigung,Farbton),overscan(left,top,right,bottom),feature(Flags). CLI-Overscan-Reihenfolge weicht von Struktur unten ab.

### 2.3 Partitionsdatenstrukturen

#### 2.3.1 Partitionsstruktur

```c
struct disp_info{
struct drm_display_mode resolution;
struct overscan scan;
enum output_format format;
enum output_depth depthc;
unsigned int feature;
struct hwc_inital_info hwc_info;
struct bcsh_info bcsh;
unsigned int reserve[128];
struct lut_data mlutdata;
};
```

```c
struct disp_info main;
struct disp_info aux;
```

main im ersten8KB-Bereich,aux bei Offset8KB. sizeof(disp_info) ist nicht8KB:Datensätze getrennt lesen/schreiben,vor aux lseek8KB. Diagramm:drm_display_mode52B,overscan12B,format4B,depth4B,feature4B,hwc_inital_info140B,bcsh8B,reserve512B,lut_data6KB+4. Quellbeschriftungen,kein ABI-Nachweis:lut_data unten hat16-Bit-size und drei1024×16-Bit-Arrays;Alignment mit SDK prüfen.

![Main-/Aux-Partitionsaufbau](/docs/rockchip-android-box-display/images/partition-layout.png)

Main-/Aux-Partitionsaufbau - Originalabbildung;PDF-Seite 9 (CN).

#### 2.3.2 disp_info-Felder

drm_display_mode speichert Timing,clock in kHz. overscan speichert Skalierungsgrenze und Randwerte.

```c
struct drm_display_mode {
/* Proposed mode values */
int clock; /* in kHz */
int hdisplay;
int hsync_start;
int hsync_end;
int htotal;
int vdisplay;
int vsync_start;
int vsync_end;
int vtotal;
int vrefresh;
int vscan;
unsigned int flags;
int picture_aspect_ratio;
};
```

```c
struct overscan {
unsigned int maxvalue;
unsigned short leftscale;
unsigned short rightscale;
unsigned short topscale;
unsigned short bottomscale;
};
```

output_format wählt Farbe;Auto nutzt output_ycbcr_high_subsampling:YCbCr444>YCbCr422>YCbCr420>RGB;low umgekehrt. output_depth wählt Bittiefe,Auto nutzt Automatic.

```c
enum output_format {
output_rgb=0,
output_ycbcr444=1,
output_ycbcr422=2,
output_ycbcr420=3,
output_ycbcr_high_subsampling=4, // (YCbCr444 > YCbCr422 > YCbCr420 > RGB)
output_ycbcr_low_subsampling=5 , // (RGB > YCbCr420 > YCbCr422 > YCbCr444)
invalid_output=6,
};
```

```c
enum output_depth{
Automatic=0,
depth_24bit=8,
depth_30bit=10,
};
```

feature steuert automatische Auflösung/Farbe,HDCP1.x und Whitelistfilter. hwc_inital_info setzt Framebufferbreite/-höhe,fps und main/aux-Geräte. device-Beispiel:HDMI-A,TV;fps begrenzt Bildrate.

```c
#define RESOLUTION_AUTO (1<<0)
#define COLOR_AUTO (1<<1)
#define HDCP1X_EN (1<<2)
#define RESOLUTION_WHITE_EN (1<<3)
```

```c
struct hwc_inital_info{
char device[128];
unsigned int framebuffer_width;
unsigned int framebuffer_height;
float fps;
};
```

bcsh_info:0–100,alle Standard50. reserve[128] für künftige Nutzung. lut_data speichert RGB-Lookups;size ist Anzahl je Tabelle,maximal1024.

```c
struct bcsh_info {
unsigned short brightness;
unsigned short contrast;
unsigned short saturation;
unsigned short hue;
};
```

```c
unsigned int reserve[128];
```

```c
struct lut_data{
uint16_t size;
uint16_t lred[1024];
uint16_t lgreen[1024];
uint16_t lblue[1024];
};
```

#### 2.3.3 Backupbereich

Zweite Hälfte ab512KB bewahrt Initialwerte für Werksreset. main_backup/AUX_backup liegen in ersten16KB dieser Hälfte mit8KB Abstand.

![Backupaufbau](/docs/rockchip-android-box-display/images/backup-layout.png)

Backupaufbau - Originalabbildung;PDF-Seite 11 (CN).

### 2.4 Diagnose

| Nur-Lese-Eigenschaft | Bedeutung |
| --- | --- |
| vendor.hwc.device.main | Aktueller Hauptausgang |
| vendor.hwc.device.aux | Aktueller Nebenausgang |

<code>logcat &#124; grep BP</code> prüft HWC-Lesen von Baseparameter beim Boot.

```sh
logcat | grep BP
```

### 2.5 FAQ:1280×720-Framebuffer

Schritte:a)root;b)zurücksetzen;c)Werte schreiben;d)ausgeben/prüfen;e)exportieren/pullen. Achtung:-R2 setzt auch Backup zurück;vorher bestehende Daten sichern. Befehle nur dokumentiert,nicht ausgeführt.

```sh
su
saveBaseParameter -R 2
saveBaseParameter -d 0 -f 1280x720@60 -D "HDMI-A,TV" -c Auto -u 2 -o "100,100,100,100" -b "50,50,50,50"
saveBaseParameter -p
saveBaseParameter -t /sdcard/baseparameter.img
adb pull /sdcard/baseparameter.img
```

f)Erzeugtes Abbild flashen,neu starten,HWC per <code>logcat &#124; grep BP</code> prüfen. g)In SDK legen,z.B.device/rockchip/rk3328/baseparameter.img,BoardConfig unten ändern,neu bauen. Gedruckter Umbruch der Zuweisung unten zu einer Make-Zeile verbunden.

```diff
diff --git a/rk3328_box/BoardConfig.mk b/rk3328_box/BoardConfig.mk
index 3831ce8..f151fe7 100755
--- a/rk3328_box/BoardConfig.mk
+++ b/rk3328_box/BoardConfig.mk
@@ -16,6 +16,8 @@
TARGET_BOARD_PLATFORM_PRODUCT := box
+TARGET_BASE_PARAMETER_IMAGE := device/rockchip/rk3328/baseparameter.img
+
# Use the non-open-source parts, if they're present
-include vendor/rockchip/rk3328/BoardConfigVendor.mk
-include device/rockchip/common/BoardConfig.mk
```

{% endraw %}
