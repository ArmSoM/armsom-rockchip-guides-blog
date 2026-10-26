---
title: "Rockchip Linux Graphics: Architektur und Mehrbildschirmbetrieb"
description: "Rockchip Linux Graphics: Architektur und Mehrbildschirmbetrieb — V1.2.0"
excerpt: "Rockchip Linux Graphics: Architektur und Mehrbildschirmbetrieb"
translation_key: "191-rockchip-linux-graphics"
slug: "191-rockchip-linux-graphics"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Linux Graphics: Architektur und Mehrbildschirmbetrieb

ArmSoM-Plattformreferenz anhand der bereitgestellten chinesischen und englischen Rockchip-Quellen. Konkrete Platine, SoC, SDK/BSP, Kernel und Peripherie einzeln abgleichen; keine allgemeine Unterstützung aller ArmSoM-Platinen. Quellbeispiele und Messwerte sind keine ArmSoM-Tests. Keine Befehle oder Hardwaretests ausgeführt.

Die Buildroot-/Debian-/Yocto-Matrix ist historische Referenz; GPU, Treiberpaket und APIs anhand des BSP prüfen.

Beide V1.2.0; technische Vorwortmatrix und Volltext erhalten. ZH nutzt 2 chinesische, EN/RU/DE 2 englische Abbildungen. „Kein OPENGL“ beschreibt den Quelltreiberstack, nicht alle Chips, Mesa oder spätere BSPs. Die Beziehung drmModeSetCrtc/SetPlane/PageFlip ist in der Quelle vereinfacht; tatsächliche APIs anhand der verwendeten libdrm prüfen.

| Chip | Buildroot | Debian | Yocto |
| --- | --- | --- | --- |
| RK180X | Y | N | N |
| RK3036 | Y | N | N |
| RK312X/PX3SE | Y | N | N |
| RK322X | Y | N | N |
| RK3288 | Y | Y | Y |
| RK3308 | Y | N | N |
| RK3326/PX30 | Y | Y | Y |
| RK3358 | Y | N | N |
| RK3399/RK3399Pro | Y | Y | Y |
| RK356X | Y | Y | Y |
| RK3588 | Y | Y | Y |

## 1. Einführung in Rockchip Linux Graphics

### 1.1 Überblick

Die Grafikverarbeitung von Rockchip Linux basiert auf DRM und DMA-BUF und stellt eine effiziente, ARM-Linux-konforme Umgebung bereit. Die allgemeine Architektur vereinfacht Anpassungen und erlaubt die breite Nutzung vorhandener Komponenten; laut Quelle wählen sie deshalb zahlreiche offene ARM-Projekte. Die technische und architektonische Komplexität erfordert jedoch Einarbeitung. Weitere Informationen enthalten docs/cn/Common/DISPLAY/, docs/cn/Linux/Graphics/ und das Rockchip-Wiki.

### 1.2 Hardwaremodule des SoC

#### 1.2.1 VOP (Video Output Processor)

VOP überträgt Bilder aus Speicher-Framebuffern an Anzeigegeräte, beispielsweise NV12- oder RGB-Puffer auf einen Bildschirm. Die Fähigkeiten unterscheiden sich je Plattform: maximale Schnittstellenauflösung, 4K-Unterstützung, AFBC (Arm Frame Buffer Compression) usw. Details: docs/cn/Common/DISPLAY/Rockchip_Developer_Guide_DRM_Display_Driver_CN.pdf.

#### 1.2.2 GPU (Graphics Process Unit)

Die GPU beschleunigt auf Grundlage offener Standards 2D-, 3D- und allgemeine GPGPU-Berechnungen. In der beschriebenen Rockchip-Linux-Auslieferung stellt sie OpenGL ES, EGL und OpenCL bereit, jedoch kein Desktop-OpenGL. API-Liste (konkrete Chipunterstützung im jeweiligen Handbuch prüfen):

- OpenGL ES 3.0
- OpenGL ES 2.0
- OpenGL ES 1.1
- OpenCL 1.2
- OpenCL 1.1
- OpenCL 1.0

#### 1.2.3 RGA (Raster Graphic Acceleration)

Rockchip RGA ist ein eigenständiger zweidimensionaler Rasterbeschleuniger für Pixel/Linien, Skalierung, Rotation, Bitmap-Operationen, Bildkomposition usw. Unterstützte Bildformate unterscheiden sich je Chip; dessen Handbuch konsultieren. Code: SDK/external/linux-rga. Weitere Dokumentation: docs/en/Common/RGA/Rockchip_Developer_Guide_RGA_EN.pdf.

### 1.3 Grafiksoftwaremodule

Wichtig sind die Beziehungen zwischen libdrm, Wayland und X11 (Compositoren) sowie Mesa, libmali und GTK (Anwendungen). Siehe Linux_Graphics_Stack in den Quellverweisen.

#### 1.3.1 LIBDRM

LIBDRM ist treiberübergreifende Middleware, mit der Userspace-Anwendungen wie Mesa und 2D-Treiber über DRI mit dem Kernel kommunizieren. DRM-Struktur:

![Technische Abbildung der englischen Quelle](/docs/rockchip-linux-graphics/assets/en-p005-figure-01.png)

LIBDRM vermittelt zwischen Treiber und Userspace. Früher konnten Anwendungen Grafiktreiber unmittelbar über open(fb) ansprechen. Neue Hardware wirft jedoch weitere Fragen auf:

- mehrere Ebenen;
- mehrere Bildschirme;
- vsync-Synchronisation ohne Tearing;
- Zero-Copy-Speicherübergabe mit dmabuf.

LIBDRM erleichtert dies und stellt APIs für X11/Wayland bereit. Ein einfacher Werbeplayer mit Videoschleife könnte LIBDRM direkt aufrufen; die Quelle rät davon ab. Erstens ist die API vergleichsweise neu und wird vor allem von DRM- und Wayland/Xserver-Entwicklern verwendet. Zweitens entwickelt sie sich schnell: atomic und legacy unterscheiden sich, und vieles hängt von der Herstellerimplementierung ab. Rockchip hat das Verhalten zentraler APIs für Projekte angepasst, weshalb dieselbe API je Plattform unterschiedlich wirken kann. Gemeint ist nicht, zwingend X11/Wayland zu verwenden, sondern vorhandene Abstraktionen: etwa GStreamer mit kmssink statt direkter LIBDRM-Aufrufe für die Videoschleife.

Drei DRM-Begriffe:

- connector steht für den Bildschirmanschluss: HDMI und DSI besitzen eigene connector-Nummern;
- crtc entspricht VOP, üblicherweise einer pro Bildschirm;
- plane ist eine Ebene: beispielsweise Video auf plane2 über der UI auf plane1.

Es gibt legacy und atomic APIs. Legacy ist älter und wird laut Quelle von den meisten dort beschriebenen Programmen verwendet. Wichtige Funktionen sind drmModeSetCrtc, drmModeSetPlane und drmModePageFlip. drmModeSetCrtc setzt üblicherweise UI-Ebene und Auflösung. drmModeSetPlane konfiguriert eine einzelne Ebene, etwa Video: Puffer-fd, Ebene, Ausgabegröße und Puffergröße; der Puffer wird skaliert und angezeigt. Auf Rockchip ist der Aufruf asynchron: Zwei unmittelbar aufeinanderfolgende Aufrufe können den vorherigen überschreiben, sodass drmWaitVBlank erforderlich sein kann.

Beim legacy-Mehrschichtbetrieb ruft jede Ebene drmModeSetPlane auf und wartet anschließend auf vsync. Bei zwei nacheinander behandelten Ebenen und 60 Hz ergibt sich im Beispiel eine Grenze von 30 fps. Zur Lösung entwickelten Upstream-Entwickler die atomic API.

Die atomic API bündelt Änderungen aller Ebenen in einem Commit: Statt zweier drmModeSetPlane-Aufrufe erfolgt ein drmModeAtomicCommit mit allen Parametern.

```text
mainline source code:
git clone https://gitlab.freedesktop.org/mesa/drm.git
```

Weitere Quellverweise: Rockchip-Wiki (Libdrm), offizielle Dokumentation. Legacy-Beispiele: modetest in libdrm, kmssink in GStreamer. Atomic-Beispiel: modeset-atomic. Die Links stehen am Artikelende.

#### 1.3.2 LIBMALI

Für OpenGL ES, EGL und OpenCL LIBMALI in das rootfs aufnehmen. Vorgefertigte Binärdateien: SDK/external/libmali. Namensschema: GPU-Modell – Softwareversion – Hardwareversion (etwa r1p0 zur Unterscheidung von RK3288 und RK3288w) – Build-Optionen.

Ohne Suffix ist x11-gbm gemeint. GBM dient der DRM-Speicherverwaltung. fbdev außer beim Kernel 3.10 nicht verwenden. GBM eignet sich etwa für QT EGLFS ohne X11-/Wayland-Abhängigkeit. Wayland bzw. Wayland-gbm sind für Wayland vorgesehen.

#### 1.3.3 ZERO-COPY

Bei der Mali-Anzeige von dmabuf-Daten, etwa Kamera/Video, vermeidet dmabuf ZERO-COPY die CPU-Kopie beim Texturladen. X11/Wayland bieten ZERO-COPY-Konfigurationen; siehe auch Wayland-dmabuf-Materialien.

#### 1.3.4 X11

X11 ähnelt einer üblichen Desktop-Plattform; die Quelle nennt jedoch ein GPU-Leistungsproblem. Code: SDK/external/xserver. Weitere Links:

```text
https://en.wikipedia.org/wiki/X.Org_Server
https://www.comptechdoc.org/os/linux/howlinuxworks/linux_hlxwindows.html
https://dri.freedesktop.org/wiki/DDX/
https://www.freedesktop.org/wiki/Software/Glamor/
https://en.wikipedia.org/wiki/X.Org_Server
```

#### 1.3.5 Wayland

Für Wayland-Entwicklung wird Yocto/Buildroot SDK empfohlen. Laut Quelle ist Wayland etwas effizienter als X11; auch Kompatibilität spielt eine Rolle. Wenn kein Desktop, aber mehrere Fenster erforderlich sind, kommt Wayland infrage. Materialien:

```text
https://en.wikipedia.org/wiki/Wayland
```

#### 1.3.6 None

Neben X11/Wayland gibt es den im Embedded-Bereich verbreiteten Modus None; die Quelle nennt LVGL und SDL als Beispiele.

#### 1.3.7 Anzeigearchitektur auswählen

Varianten: EGL-Programm + X11; X11; Wayland; None.

- Mehrere Fenster: X11 oder Wayland.
- Desktop-Funktion: X11.
- 4K-Video im Vollbild: X11 oder Wayland.
- 4K-Video mit mehreren Fenstern: X11 oder Wayland.

### 1.4 Mehrbildschirmfunktionen

Auf den beschriebenen Rockchip-Linux-Plattformen Debian/Buildroot lassen sich DP/HDMI/MIPI/eDP/LVDS und weitere Schnittstellen für gleiche oder unterschiedliche Bildschirminhalte kombinieren. Beim unabhängigen Zweischirmbetrieb gibt es einen Haupt- und einen Nebenbildschirm. Die Verwendung folgt.

#### 1.4.1 Zwei Bildschirme unter Debian

Unter Debian mit X11 werden Spiegelung und unabhängige Anzeige mit xrandr eingestellt. Dies ist das offizielle RandR-Werkzeug (Resize and Rotate) für das X Window System: Größe, Ausrichtung, Spiegelung. Für mehrere Monitore siehe den Quellverweis Multihead.

##### 1.4.1.1 Anzeigegeräte und Gerätenamen

Zweischirmbetrieb lässt sich per Befehlszeile oder Menü konfigurieren. Oberfläche: Rechtsklick → Application → Settings → Display.

![Technische Abbildung der englischen Quelle](/docs/rockchip-linux-graphics/assets/en-p009-figure-01.png)

Befehl:

```text
su linaro -c "DISPLAY=:0 xrandr"
```

Ausgabe:

```text
root@linaro-alip:/# su linaro -c "DISPLAY=:0 xrandr"
Screen 0: minimum 320 x 200, current 3000 x 1920, maximum 16384 x 16384
HDMI-1 connected 1920x1080+0+0 (normal left inverted right x axis y axis) 0mm x
0mm
   1920x1080     60.00*+  60.00
   1600x900      60.00
   1280x1024     60.02
   1280x720      60.00    60.00
   720x480       59.94    59.94
HDMI-2 disconnected (normal left inverted right x axis y axis)
DSI-1 connected 1080x1920+1920+0 (normal left inverted right x axis y axis) 0mm x
0mm
   1080x1920     59.90*+
DP-1 disconnected (normal left inverted right x axis y axis)
DP-2 disconnected (normal left inverted right x axis y axis)
```

Im Beispiel werden zwei Anzeigegeräte erkannt: HDMI-1 und DSI-1.

##### 1.4.1.2 Zweischirmmodus

Gleiche und unterschiedliche Inhalte werden unterstützt. Bei unabhängiger Anzeige gibt es vier Positionen: rechts (On right), oben (Above), links (On left), unten (Below). Im Anzeigemenü den Modus durch Ziehen der Bildschirmposition ändern. Befehl:

```text
su linaro -c "DISPLAY=:0 xrandr --output HDMI-1 --above DSI-1"
```

Statt --above --right-of, --left-of, --below oder --same-as verwenden. Standard-/same-as-Modus zeigt gleiche Inhalte.

#### 1.4.2 Zwei Bildschirme unter Buildroot

Weston im Buildroot SDK unterstützt gleiche/verschiedene Inhalte auf mehreren Bildschirmen und Hotplug. Die DRM-Namen aus dem Weston-Startprotokoll oder /sys/class/drm/card0- unterscheiden die Bildschirme. Konfiguration über Umgebungsvariablen:

```text
    # /etc/profile.d/weston.sh
    export WESTON_DRM_PRIMARY=HDMI-A-1 # Specify HDMI-A-1 as primary monitor
    export WESTON_DRM_SINGLE_HEAD=1 # Force using single monitor
    export WESTON_DRM_MIRROR=1 # In mirror mode (multi-screen with the same display), without setting this environment variable will be with different display
    export WESTON_DRM_KEEP_RATIO=1 # In mirror mode, scaling maintains the aspect ratio, without setting this variable will be full screen by force
    export WESTON_DRM_HEAD_MODE=primary # Only enable primary monitor
    export WESTON_DRM_HEAD_MODE=internal # Only enable internal monitors
    export WESTON_DRM_HEAD_MODE=external # Only enable external monitors
    export WESTON_DRM_HEAD_MODE=external-dual # Enable all monitors, and prefer the external ones
    export WESTON_DRM_HEAD_FALLBACK=1 # Fallback to any available monitor when none matched
    export WESTON_DRM_MASTER=1 # Allow disabling unused monitors

    export WESTON_OUTPUT_FLOW=horizontal # Laying outputs horizontally by default
    export WESTON_OUTPUT_FLOW=vertical # Laying outputs vertically by default
    export WESTON_OUTPUT_FLOW=same-as # Laying outputs at (0,0) by default
```

Das Skalieren gespiegelter Inhalte benötigt RGA-Beschleunigung. Ein einzelner Bildschirm lässt sich unter output in weston.ini deaktivieren:

```text
# /etc/xdg/weston/weston.ini

[output]
name=LVDS-1

mode=off
# off|current|preferred|<WIDTHxHEIGHT@RATE>
```

Details: docs/en/Linux/Graphics/Rockchip_Developer_Guide_Buildroot_Weston_EN.pdf.

### 1.5 Bilddarstellung einstellen

Unter Linux lassen sich Farbton (hue), Sättigung (saturation), Kontrast (contrast) und Helligkeit (brightness) mit modetest einstellen. Eigenschaften werden über -w gesetzt; die Quelle nennt das Muster `-w <obj_id>:<prop_name>:`. Für eDP zuerst modetest -M rockchip ausführen; im Beispiel ist die Connectors-ID 92.

```text
Connectors:
id      encoder status          name            size (mm)       modes   encoders
92      91      connected       eDP-1           129x171         1       91
  modes:
        name refresh (Hz) hdisp hss hse htot vdisp vss vse vtot)
  1536x2048 60 1536 1548 1564 1612 2048 2056 2060 2068 200000 flags: nhsync,
nvsync; type: preferred
...
```

eDP-hue auf 60 setzen; Standardwert 50, Bereich 0–100.

```text
modetest -M rockchip -w 92:hue:60
```

Entsprechend lassen sich hue, saturation, contrast und brightness für LVDS/HDMI/MIPI einstellen. Unter X11 wird Gamma per xrandr geändert. Zunächst folgende Konfiguration in etc/X11/xorg.conf.d/20-modesetting.conf prüfen:

```text
Option      "UseGammaLUT"    "true"
```

Fehlt sie, das xserver-deb-Paket für die Unterstützung aktualisieren. Befehl zur Gammaänderung mit Bildschirmwahl und RGB-Gewichten:

```text
xrandr --output HDMI-1 --gamma 1:1:0.9
```

## Quellverweise

[ArmSoM Docs](https://docs.armsom.org/)

[http://opensource.rock-chips.com/wiki_Graphics](http://opensource.rock-chips.com/wiki_Graphics)

[https://upload.wikimedia.org/wikipedia/commons/c/c2/Linux_Graphics_Stack_2013.svg](https://upload.wikimedia.org/wikipedia/commons/c/c2/Linux_Graphics_Stack_2013.svg)

[http://opensource.rock-chips.com/wiki_Libdrm](http://opensource.rock-chips.com/wiki_Libdrm)

[https://dri.freedesktop.org/docs/drm/gpu/drm-kms.html](https://dri.freedesktop.org/docs/drm/gpu/drm-kms.html)

[https://gitlab.freedesktop.org/mesa/drm/-/blob/main/tests/modetest/modetest.c](https://gitlab.freedesktop.org/mesa/drm/-/blob/main/tests/modetest/modetest.c)

[https://github.com/rockchip-linux/gstreamer-rockchip-extra/blob/master/gst/kms/gstkmssink.c](https://github.com/rockchip-linux/gstreamer-rockchip-extra/blob/master/gst/kms/gstkmssink.c)

[https://github.com/dvdhrm/docs/blob/master/drm-howto/modeset-atomic.c](https://github.com/dvdhrm/docs/blob/master/drm-howto/modeset-atomic.c)

[https://wiki.archlinux.org/index.php/Multihead](https://wiki.archlinux.org/index.php/Multihead)

{% endraw %}
