---
title: "Benutzerhandbuch für Rockchip Linux GStreamer"
description: "Benutzerhandbuch für Rockchip Linux GStreamer — V1.2.1"
excerpt: "Benutzerhandbuch für Rockchip Linux GStreamer"
translation_key: "195-rockchip-linux-gstreamer"
slug: "195-rockchip-linux-gstreamer"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux, GStreamer, MPP]
---

{% raw %}

# Benutzerhandbuch für Rockchip Linux GStreamer

Grundlage sind die chinesische und englische Fassung von Rockchip RK-YH-YF-921, V1.2.1 vom 2024-01-16; die technischen Kapitel 1–12 bleiben erhalten. Die chinesische Fassung bildet die Grundlage; Ergänzungen und Abweichungen stehen unten. Für ArmSoM sind konkrete SoC, Platine, SDK/BSP, Kernel und Peripherie zu prüfen. Es wurden keine Befehle oder Hardwaretests ausgeführt. Codeblöcke bewahren originale Befehle, Kommentare und gst-inspect-Ausgaben; Standardwerte und Bereiche gelten für die Quellversion.

| System | GStreamer-Version |
| --- | --- |
| Buildroot | 1.22.x |
| Debian 10 (Buster) | 1.14.4 |
| Debian 11 (Bullseye) | 1.18.5 |
| Yocto | 1.20.x |

## 1. Einführung in GStreamer

GStreamer ist ein quelloffenes Multimediaframework. In den Linux-SDKs (außer IPC) verbindet GStreamer überwiegend Anwendungen mit Codec-Komponenten. An die Rockchip-Hardware angepasste Plugins ermöglichen Anwendungen die hardwarebeschleunigte Codierung und Decodierung.

### 1.1 Anpassung der GStreamer-Videocodecs

Die folgende Abbildung zeigt anhand der Videowiedergabe den grundlegenden Ablauf von Codierung, Decodierung und Anzeige auf der Rockchip-Plattform.

![Benutzerhandbuch für Rockchip Linux GStreamer](/docs/rockchip-linux-gstreamer/assets/en-p005-figure-01.png)

Ein Demuxer zerlegt die Videodatei, etwa mp4, zunächst in einen Videostream (beispielsweise H264/H265) und einen Audiostream. Ein Videodecoder wie mppvideodec oder mppjpegdec decodiert das Video; ein Audiodecoder decodiert den Ton. Anzeigeplugins wie xvimagesink oder waylandsink geben die decodierten Videodaten aus; Audioplugins wie alsasink übertragen die decodierten Audiodaten zur Soundkarte. Rockchip implementiert die Hardwarebeschleunigung durch rockchipmpp, einschließlich der Decoder mppvideodec und mppjpegdec sowie der Encoder mpph264enc, mppvp8enc, mppjpegenc und weiterer. GStreamer bevorzugt rockchipmpp bei der Videodecodierung. Plugins wie mppvideodec rufen die MPP-API auf; diese Videocodec-Middleware von Rockchip verwendet den VPU-Treiber vpu_service. Hardwarecodecs können auch direkt mit den MPP-Testprogrammen, etwa mpi_dec_test und mpi_enc_test, geprüft werden. Anzeigeplugins übertragen die decodierten Daten zum Anzeigegerät. Sie verwenden jeweils die passende Grafik-API: xvimagesink verwendet X11, waylandsink verwendet Wayland.

Details zur Anzeige stehen in Rockchip_Developer_Guide_Linux_Graphics_EN.pdf im SDK. MPP-Quellen: &lt;SDK&gt;/external/mpp/. MPP-Dokumentation: &lt;SDK&gt;/docs/Linux/Multimedia/Rockchip_Developer_Guide_MPP_EN.pdf. Testprogramme: &lt;SDK&gt;/external/mpp/test.

## 2. Quellcode und Kompilierung

### 2.1 Quellcodepfade

Buildroot: GStreamer und die Plugin-Quellen werden aus dem Netz geladen und anschließend mit den RK-Patches versehen; siehe &lt;SDK&gt;/buildroot/package/gstreamer1/. Debian: Quellen aus dem Debian-Repository laden und Rockchip-Patches anwenden; Debian 10 verwendet 1.14.4, Debian 11 verwendet 1.18.5. Gstreamer-rockchip: Die Quellen der MPP-Plugins und von rkximagesink liegen unter &lt;SDK&gt;/external/gstreamer-rockchip. Buildroot und Debian verwenden dasselbe Repository.

### 2.2 Kompilierung

Buildroot: Die betreffenden Makros aktivieren (standardmäßig aktiviert) und direkt im SDK-Hauptverzeichnis kompilieren. Die Makros stehen in &lt;SDK&gt;/buildroot/configs/rockchip/*_gst.config und müssen in die Zielkonfiguration aufgenommen werden. Die Version lässt sich beispielsweise über BR2_PACKAGE_GSTREAMER1_18 oder BR2_PACKAGE_GSTREAMER1_20 auswählen.

```text
BR2_PACKAGE_MPP=y
BR2_PACKAGE_MPP_ALLOCATOR_DRM=y
BR2_PACKAGE_GSTREAMER1_ROCKCHIP=y
BR2_PACKAGE_LINUX_RGA=y
BR2_PACKAGE_CA_CERTIFICATES=y
BR2_PACKAGE_LIBSOUP_SSL=y
BR2_PACKAGE_GSTREAMER1=y
BR2_PACKAGE_GST1_PLUGINS_BASE=y
BR2_PACKAGE_GST1_PLUGINS_BASE_PLUGIN_ALSA=y
BR2_PACKAGE_GST1_PLUGINS_BASE_PLUGIN_VIDEOCONVERT=y
BR2_PACKAGE_GST1_PLUGINS_BASE_PLUGIN_VIDEOTESTSRC=y
BR2_PACKAGE_GST1_PLUGINS_GOOD=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_AUDIOPARSERS=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_AUTODETECT=y
```

```text
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_DEINTERLACE=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_FLV=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_GDKPIXBUF=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_MATROSKA=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_MPG123=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_SOUPHTTPSRC=y
BR2_PACKAGE_GST1_PLUGINS_BAD=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DVBSUBOVERLAY=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DVDSPU=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_JPEGFORMAT=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_KMS=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_MPEGDEMUX=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_MPEG2ENC=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_VIDEOPARSERS=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_ADPCMDEC=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_ADPCMENC=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_FAAD=y
BR2_PACKAGE_GST1_PLUGINS_UGLY=y
BR2_PACKAGE_GST1_PLUGINS_UGLY_PLUGIN_ASFDEMUX=y
BR2_PACKAGE_GST1_PLUGINS_UGLY_PLUGIN_DVDLPCMDEC=y
BR2_PACKAGE_GST1_PLUGINS_UGLY_PLUGIN_DVDSUB=y
BR2_PACKAGE_GST1_PLUGINS_UGLY_PLUGIN_MPEG2DEC=y
...
```

Die vollständige Plugin-Liste steht unter menuconfig → Target packages → Audio and video applications → gstreamer 1.x. Debian: Quellen auf der Platine ablegen und sicherstellen, dass ihr Hauptverzeichnis einen Ordner debian enthält. Im Quellcode-Hauptverzeichnis ausführen:

```text
# 1 Update software sources
apt update
# 2 Install dependent libraries
apt build-dep .
# 3 Optional: start building the deb installation package
dpkg-buildpackage -b -d -uc -us
# After the building is completed, the deb installation package will be generated
in the upper directory, which can be installed by using dpkg -i xxx.deb.
# 3 Optional: build and install
meson build && ninja -C build install
```

Empfohlen wird die erste Methode, die ein deb-Installationspaket erstellt und einheitliche Build- und Installationsoptionen gewährleistet. Einige Optionen hängen von Makros in Headern wie video-format.h ab. Zuerst libgstreamer-plugins-base1.0-dev installieren, damit aktuelle Header und die entsprechenden Funktionen verfügbar sind. Fehlen Plugins, Buildskript und Protokoll prüfen, alle Abhängigkeiten installieren, den Eintrag in debian/*.install sicherstellen und erneut kompilieren.

## 3. Häufig verwendete Befehle

gst-launch-1.0 erstellt schnell GStreamer-Pipelines. Beispiele:

```text
# Generate a video by videotestsrc, and display it through xvimagesink
gst-launch-1.0 videotestsrc ! xvimagesink
```

gst-play-1.0 ist der GStreamer-Player für verschiedene Medienstreams. Beispiele:

```text
  # Play test.mp4 and display it through xvimagesink
  gst-play-1.0 test.mp4 --videosink=xvimagesink
  # Commonly used command options
--flags          # bit0: video, bit1: audio, bit2: subtitle, such as --flags=1
means only video is played
  --videosink    # specify videosink
  --audiosink    # specify audiosink
  --use-playbin3 # use playbin3, otherwise use playbin2
```

gst-inspect-1.0 listet Plugins oder zeigt detaillierte Informationen zu einem Plugin. Beispiel:

```text
# Without any parameters, list all plugins
gst-inspect-1.0
# List all information about the xvimagesink plugin
gst-inspect-1.0 xvimagesink
```

gst-discoverer-1.0 analysiert das Streamformat einer URI und prüft auf fehlende Plugins. Beispiele:

```text
# analyze local file
gst-discoverer-1.0 test.mp4
# analyze rtsp streaming
gst-discoverer-1.0 rtsp://127.0.0.1:8554/
```

Protokollierung aktivieren

```text
  #Set environment variables
  export GST_DEBUG=2
  #Or specified before the command, and invalid after the end of the command
  GST_DEBUG=2 gst-play-1.0 ...

  #Specify different log levels for different modules, support wildcards,
fpsdisplaysink is specified as DEBUG (5), xvimage* is specified as FIXME (3),
others are specified as WARNING (2)
  GST_DEBUG=2,fpsdisplaysink:5,xvimage*:3
```

Protokollstufen: ERROR(1), WARNING(2), FIXME(3), INFO(4), DEBUG(5), LOG(6), TRACE(7) und weitere.

## 4. Plugins

Dieses Kapitel beschreibt Rockchip-Plugins und häufig verwendete Plugins; weitere Informationen stehen in der offiziellen Onlinedokumentation. Es gibt drei Hauptkategorien: Source, Verarbeitung und Sink. Source-Plugins erzeugen ausschließlich Daten: filesrc liest Dateien, videotestsrc erzeugt Bilder. Verarbeitungselemente empfangen Daten, bearbeiten sie und leiten sie weiter; Beispiele sind Demuxer, Codecs und Filter. Sink-Plugins empfangen ausschließlich Daten: filesink speichert Dateien, waylandsink zeigt Bilder an. Die Plugins gehören zu Paketen wie gst-plugins-base, gst-plugins-bad, gst-plugins-good und gst-plugins-ugly. Nachfolgend stehen häufige Plugins, Eigenschaften und Pipeline-Beispiele. Die vollständige Liste samt Beschreibungen ist mit gst-inspect-1.0 abrufbar.

### 4.1 gstreamer-rockchip

Quellcode: &lt;SDK&gt;/external/gstreamer-rockchip.

#### 4.1.1 kmssrc

Bilddaten vom angegebenen Objekt abrufen. Quellcode: &lt;SDK&gt;/external/gstreamer-rockchip/gst/kmssrc. Pipeline-Beispiele:

```text
# Get and render image
gst-launch-1.0 kmssrc ! waylandsink
# Get and render image with specified framerate
gst-launch-1.0 kmssrc sync-fb=0 ! 'video/x-raw,framerate=10/1' ! fpsdisplaysink
video-sink=fakesink
# Get and encode image
gst-launch-1.0 kmssrc sync-fb=0 ! mpph264enc ! h264parse ! filesink
location=/tmp/out.h264
```

Eigenschaften: connector-id

Bilddaten vom angegebenen Connector abrufen; ID mit modetest -c ermitteln.

```text
connector-id        : DRM connector ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

crtc-id: Bilddaten vom angegebenen CRTC abrufen; ID mit modetest -p ermitteln.

```text
crtc-id             : DRM crtc ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

encoder-id: Bilddaten vom angegebenen Encoder abrufen; ID mit modetest -e ermitteln.

```text
encoder-id          : DRM encoder ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

fb-id: Bilddaten vom angegebenen Framebuffer abrufen; ID mit modetest -p ermitteln.

```text
fb-id               : DRM FB ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

plane-id: Bilddaten vom angegebenen Plane abrufen; ID mit modetest -p ermitteln.

```text
plane-id            : DRM plane ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

dma-feature

```text
dma-feature         : Enable GST DMA feature
                      flags: readable, writable
                      Boolean. Default: false
```

framerate-limit

```text
framerate-limit     : Limited framerate
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 120
```

num-buffers

```text
num-buffers         : Number of buffers to output before sending EOS (-1 =
unlimited)
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

sync-fb

```text
sync-fb             : Sync with FB flip
                      flags: readable, writable
                      Boolean. Default: true
```

sync-vblank

```text
sync-vblank         : Sync with vblank
                      flags: readable, writable
                      Boolean. Default: true
```

#### 4.1.2 mppvideodec

Decodierung über die MPP-API. Unterstützt werden H263, H264, H265, AV1, VP8, VP9 und MPEG. Die Fähigkeiten hängen von der Plattform ab; siehe Datenblatt. Quellcode: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp/. Pipeline-Beispiele:

```text
# mppvideodec has the highest rank, it will be automatically selected.
gst-play-1.0 test.mp4
# or create the pipeline menually
gst-launch-1.0 filesrc location=test.mp4 ! parsebin ! mppvideodec ! waylandsink
```

Eigenschaften: arm-afbc versucht ARM AFBC zur Leistungssteigerung zu nutzen; nicht alle Sinks unterstützen dies.

```text
arm-afbc            : Prefer ARM AFBC compressed format
                      flags: readable, writable
                      Boolean. Default: false
```

crop-rectangle

```text
crop-rectangle      : The crop rectangle ('<x, y, width, height>')
                      flags: writable
                      Default: "<  >"
                      GstValueArray of GValues of type "gint" Write only
```

dma-feature

```text
dma-feature         : Enable GST DMA feature
                      flags: readable, writable
                      Boolean. Default: false
```

fast-mode

```text
fast-mode           : Enable MPP fast decode mode
                      flags: readable, writable
                      Boolean. Default: true
```

ignore-error

```text
ignore-error        : Ignore MPP decode errors
                      flags: readable, writable
                      Boolean. Default: true
```

format: Konvertierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
format              : Prefered output format
                      flags: readable, writable
                      Enum "GstMppVideoDecFormat" Default: 0, "auto"
                         (0): auto             - Auto
                         (23): NV12             - NV12
                         (24): NV21             - NV21
                         (2): I420             - I420
                         (3): YV12             - YV12
                         (51): NV16             - NV16
                         (60): NV61             - NV61
                         (30): BGR16            - BGR565
                         (15): RGB              - RGB
                         (16): BGR              - BGR
                         (11): RGBA             - RGBA8888
                         (12): BGRA             - BGRA8888
                         (7): RGBx             - RGBX8888
                         (8): BGRx             - BGRX8888
```

width: Skalierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
width               : Width (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

height: Skalierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
height              : Height (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

rotation: Drehung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
rotation            : Rotation
                      flags: readable, writable
                      Enum "GstMppDecRotation" Default: 0, "0"
                         (0): 0                - Rotate 0
                         (90): 90               - Rotate 90
                         (180): 180              - Rotate 180
                         (270): 270              - Rotate 270
```

#### 4.1.3 mppjpegdec

JPEG-Decodierung über die MPP-API. Die Decodierfähigkeiten hängen von der Plattform ab; siehe Datenblatt. Quellcode: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp/. Pipeline-Beispiele:

```text
gst-launch-1.0 filesrc location=nv12.jpg ! parsebin ! mppjpegdec ! filesink
location=nv12.yuv
```

Eigenschaften: crop-rectangle

```text
crop-rectangle      : The crop rectangle ('<x, y, width, height>')
                      flags: writable
                      Default: "<  >"
                      GstValueArray of GValues of type "gint" Write only
```

dma-feature

```text
dma-feature         : Enable GST DMA feature
                      flags: readable, writable
                      Boolean. Default: false
```

fast-mode

```text
fast-mode           : Enable MPP fast decode mode
                      flags: readable, writable
                      Boolean. Default: true
```

ignore-error

```text
ignore-error        : Ignore MPP decode errors
                      flags: readable, writable
                      Boolean. Default: true
```

format: Konvertierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
format              : Prefered output format
                      flags: readable, writable
                      Enum "GstMppVideoDecFormat" Default: 0, "auto"
                         (0): auto             - Auto
                         (23): NV12             - NV12
                         (24): NV21             - NV21
                         (2): I420             - I420
                         (3): YV12             - YV12
                         (51): NV16             - NV16
                         (60): NV61             - NV61
                         (30): BGR16            - BGR565
                         (15): RGB              - RGB
                         (16): BGR              - BGR
                         (11): RGBA             - RGBA8888
                         (12): BGRA             - BGRA8888
                         (7): RGBx             - RGBX8888
                         (8): BGRx             - BGRX8888
```

width: Skalierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
width               : Width (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

height: Skalierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
height              : Height (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

rotation: Drehung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
rotation            : Rotation
                      flags: readable, writable
                      Enum "GstMppDecRotation" Default: 0, "0"
                         (0): 0                - Rotate 0
                         (90): 90               - Rotate 90
                         (180): 180              - Rotate 180
                         (270): 270              - Rotate 270
```

#### 4.1.4 mpph264enc/mpph265enc/mppvp8enc

Codierung über die MPP-API. Unterstützt werden H264, H265 und VP8. Die Plattformfähigkeiten unterscheiden sich; siehe Datenblatt (die Quelle spricht hier von Decodierung). Quellcode: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp/. Pipeline-Beispiele:

```text
# Encode 10s long 640x320@NV12 raw to H264 and package to MP4 file.
gst-launch-1.0 videotestsrc num-buffers=600 ! video/x-
raw,format=NV12,width=640,height=320,framerate=60/1 ! mpph264enc ! h264parse !
qtmux ! filesink location=h264.mp4
# Encode 10s long 640x320@NV12 raw to H265 and package to MP4 file.
gst-launch-1.0 videotestsrc num-buffers=600 ! video/x-
raw,format=NV12,width=640,height=320,framerate=60/1 ! mpph265enc ! h265parse !
qtmux ! filesink location=h265.mp4
# Encode 10s long 640x320@NV12 raw to VP8 and package to MP4 file.
gst-launch-1.0 videotestsrc num-buffers=600 ! video/x-
raw,format=NV12,width=640,height=320,framerate=60/1 ! mppvp8enc ! qtmux !
filesink location=vp8.mp4
```

Eigenschaften: arm-afbc

```text
arm-afbc            : Input is ARM AFBC compressed format
                      flags: readable, writable
                      Boolean. Default: false
```

bps

```text
bps                 : Target BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

bps-max

```text
bps-max             : Max BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

bps-min

```text
bps-min             : Min BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

gop

```text
gop                 : Group of pictures starting with I frame (-1 = FPS, 1 = all
I frames)
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

qp-init

```text
qp-init             : Initial QP (lower value means higher quality)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 26
```

qp-max

```text
qp-max              : Max QP (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 0
```

qp-max-i

```text
qp-max-i            : Max Intra QP (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 0
```

qp-min

```text
qp-min              : Min QP (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 0
```

qp-min-i

```text
qp-min-i            : Min Intra QP (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 0
```

rc-mode

```text
rc-mode             : RC mode
                      flags: readable, writable
                      Enum "GstMppEncRcMode" Default: 1, "cbr"
                         (0): vbr              - Variable bitrate
                         (1): cbr              - Constant bitrate
                         (2): fixqp            - Fixed QP
```

width

Skalierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
width               : Width (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

height: Skalierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
height              : Height (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

rotation: Drehung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
rotation            : Rotation
                      flags: readable, writable
                      Enum "GstMppEncRotation" Default: 0, "0"
                         (0): 0                - Rotate 0
                         (90): 90               - Rotate 90
                         (180): 180              - Rotate 180
                         (270): 270              - Rotate 270
```

#### 4.1.5 mppjpegenc

JPEG-Codierung über die MPP-API. Die Plattformfähigkeiten unterscheiden sich; siehe Datenblatt (die Quelle spricht hier von Decodierung). Quellcode: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp/. Pipeline-Beispiele:

```text
# Encode 640x320@NV12 raw to jpeg file.
gst-launch-1.0 videotestsrc num-buffers=1 ! video/x-
raw,format=NV12,width=640,height=320,framerate=60/1 ! mppjpegenc ! filesink
location=nv12.jpg
```

Eigenschaften: arm-afbc

```text
arm-afbc            : Input is ARM AFBC compressed format
                      flags: readable, writable
                      Boolean. Default: false
```

bps

```text
bps                 : Target BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

bps-max

```text
bps-max             : Max BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

bps-min

```text
bps-min             : Min BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

q-factor

```text
q-factor            : Quality Factor
                      flags: readable, writable
                      Unsigned Integer. Range: 1 - 99 Default: 80
```

qf-max

```text
qf-max              : Max Quality Factor
                      flags: readable, writable
                      Unsigned Integer. Range: 1 - 99 Default: 99
```

qf-min

```text
qf-min              : Min Quality Factor
                      flags: readable, writable
                      Unsigned Integer. Range: 1 - 99 Default: 1
```

rc-mode

```text
rc-mode             : RC mode
                      flags: readable, writable
                      Enum "GstMppEncRcMode" Default: 1, "cbr"
                         (0): vbr              - Variable bitrate
                         (1): cbr              - Constant bitrate
                         (2): fixqp            - Fixed QP
```

width: Skalierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
width               : Width (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

height: Skalierung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
height              : Height (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

rotation: Drehung durch RGA. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und die Umgebungsvariable GST_MPP_NO_RGA entfernen.

```text
rotation            : Rotation
                      flags: readable, writable
                      Enum "GstMppEncRotation" Default: 0, "0"
                         (0): 0                - Rotate 0
                         (90): 90               - Rotate 90
                         (180): 180              - Rotate 180
                         (270): 270              - Rotate 270
```

#### 4.1.6 rkximagesink

Erstellt ein Fenster über die X-API und zeigt das Bild über DRM an. Die Ausgabe ohne Kopieren belegt eine Hardwareebene des VOP. Quellcode: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rkximage/. Pipeline-Beispiele:

```text
gst-launch-1.0 videotestsrc ! rkximagesink
```

Eigenschaften: connector-id gibt das Bild am angegebenen Connector aus; ID mit modetest -c ermitteln.

```text
connector-id        : DRM connector id
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

plane-id: Bild auf der angegebenen Ebene ausgeben; ID mit modetest -p ermitteln.

```text
plane-id            : DRM plane id
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

sync

```text
sync                : Sync on the clock
                      flags: readable, writable
                      Boolean. Default: true
```

### 4.2 Kernelemente

#### 4.2.1 fakesink

Nimmt Daten entgegen und verwirft sie. Pipeline-Beispiele:

```text
gst-launch-1.0 filesrc location=/tmp/test ! fakesink
gst-play-1.0 /oem/SampleVideo_1280x720_5mb.mp4 --audiosink=fakesink
```

#### 4.2.2 filesrc

Liest ab einer beliebigen Position in einer Datei. Pipeline-Beispiele:

```text
gst-launch-1.0 filesrc location=/tmp/test ! filesink location=/tmp/test2
gst-launch-1.0 filesrc location=nv12_640x320.yuv blocksize=307200 ! video/x-
raw,format=NV12,width=640,height=320 ! mpph264enc ! filesink location=out.h264
```

Eigenschaften: blocksize

```text
blocksize           : Size in bytes to read per buffer (-1 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 4294967295 Default: 4096
```

location

```text
location            : Location of the file to read
                      flags: readable, writable, changeable only in NULL or READY
state
                      String. Default: null
```

num-buffers

```text
num-buffers         : Number of buffers to output before sending EOS (-1 =
unlimited)
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

#### 4.2.3 filesink

Schreibt einen Stream in eine Datei. Pipeline-Beispiele:

```text
gst-launch-1.0 filesrc location=/tmp/test ! filesink location=/tmp/test2
```

Eigenschaften: blocksize

```text
blocksize           : Size in bytes to pull per buffer (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 4294967295 Default: 4096
```

location

```text
location            : Location of the file to write
                      flags: readable, writable
                      String. Default: null
```

### 4.3 gst1-plugins-base

#### 4.3.1 appsrc

Erlaubt einer Anwendung, Puffer in eine Pipeline einzuspeisen. Codebeispiele: gst-plugins-base-&lt;version&gt;/tests/examples/app/.

#### 4.3.2 appsink

Erlaubt einer Anwendung den Zugriff auf Rohdatenpuffer. Codebeispiele: gst-plugins-base-&lt;version&gt;/tests/examples/app/.

#### 4.3.3 decodebin/decodebin3

Verbindet Elemente automatisch und decodiert zu Rohmediendaten. Pipeline-Beispiele:

```text
gst-launch-1.0 filesrc location=/oem/SampleVideo_1280x720_5mb.mp4 ! decodebin !
waylandsink
gst-launch-1.0 filesrc location=/oem/SampleVideo_1280x720_5mb.mp4 ! decodebin
name=d d. ! waylandsink d. ! pulsesink
```

#### 4.3.4 playbin/playbin3

Verbindet Elemente automatisch und spielt Medien von einer URI ab. Pipeline-Beispiele:

```text
gst-launch-1.0 playbin uri=file:///oem/SampleVideo_1280x720_5mb.mp4
# select sinks menually, enable video and audio
gst-launch-1.0 playbin uri=file:///oem/SampleVideo_1280x720_5mb.mp4
videosink=waylandsink audiosink=pulsesink flags=3
```

Eigenschaften: audio-sink

```text
audio-sink          : the audio output element to use (NULL = default sink)
                      flags: readable, writable
                      Object of type &quot;GstElement&quot;
```

flags

```text
flags               : Flags to control behaviour
                      flags: readable, writable
                      Flags "GstPlayFlags" Default: 0x00000617, "soft-
colorbalance+deinterlace+soft-volume+text+audio+video"
                         (0x00000001): video            - Render the video stream
                         (0x00000002): audio            - Render the audio stream
                         (0x00000004): text             - Render subtitles
                         (0x00000008): vis              - Render visualisation
when no video is present
                         (0x00000010): soft-volume      - Use software volume
                         (0x00000020): native-audio     - Only use native audio
formats
                         (0x00000040): native-video     - Only use native video
formats
                         (0x00000080): download         - Attempt progressive
download buffering
                         (0x00000100): buffering        - Buffer demuxed/parsed
data
                         (0x00000200): deinterlace      - Deinterlace video if
necessary
                         (0x00000400): soft-colorbalance - Use software color
balance
                         (0x00000800): force-filters    - Force audio/video
filter(s) to be applied
                         (0x00001000): force-sw-decoders - Force only software-
based decoders (no effect for playbin3)
```

video-sink

```text
video-sink          : the video output element to use (NULL = default sink)
                      flags: readable, writable
                      Object of type "GstElement"
```

#### 4.3.5 uridecodebin/uridecodebin3

Verbindet Elemente automatisch und decodiert eine URI zu Rohmediendaten. Pipeline-Beispiele:

```text
gst-launch-1.0 uridecodebin uri=file:///oem/SampleVideo_1280x720_5mb.mp4 !
waylandsink
gst-launch-1.0 uridecodebin uri=file:///oem/SampleVideo_1280x720_5mb.mp4 name=d
d. ! waylandsink d. ! pulsesink
```

Eigenschaften: uri

```text
uri                 : URI to decode
                      flags: readable, writable
                      String. Default: null
```

#### 4.3.6 videoconvert

Konvertiert Video zwischen Farbräumen. Unterstützt RGA-2D-Beschleunigung; die RGA-Fähigkeiten hängen von der Plattform ab, siehe Datenblatt. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und export GST_VIDEO_CONVERT_USE_RGA=1 ausführen. Pipeline-Beispiele:

```text
# uncomment these two variables in /etc/profile.d/gst.sh, or export manually
export GST_VIDEO_CONVERT_USE_RGA=1
export GST_VIDEO_FLIP_USE_RGA=1
gst-launch-1.0 videotestsrc ! video/x-raw,format=NV12 ! videoconvert ! video/x-
raw,format=BGRA ! waylandsink
```

#### 4.3.7 videoscale

Ändert die Videogröße. Unterstützt RGA-2D-Beschleunigung; die RGA-Fähigkeiten hängen von der Plattform ab, siehe Datenblatt. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und export GST_VIDEO_CONVERT_USE_RGA=1 ausführen. Pipeline-Beispiele:

```text
# uncomment these two variables in /etc/profile.d/gst.sh, or export manually
export GST_VIDEO_CONVERT_USE_RGA=1
export GST_VIDEO_FLIP_USE_RGA=1
gst-launch-1.0 videotestsrc ! video/x-raw,width=640,height=320 ! videoscale !
video/x-raw,width=1280,height=720 ! waylandsink
```

#### 4.3.8 videotestsrc

Erzeugt einen Testvideostream. Pipeline-Beispiele:

```text
  # create a default stream
  gst-launch-1.0 videotestsrc ! xvimagesink
  # create a 1920x1080@NV12 stream
  gst-launch-1.0 videotestsrc ! "video/x-raw,width=1920,height=1080,format=
(string)NV12" ! xvimagesink
```

#### 4.3.9 xvimagesink

Videoausgabe auf Basis von Xv. Pipeline-Beispiele:

```text
gst-launch-1.0 videotestsrc ! xvimagesink
```

### 4.4 gst1-plugins-good

#### 4.4.1 v4l2src

Liest Frames von einem Video4Linux2-Gerät. Pipeline-Beispiele:

```text
gst-launch-1.0 v4l2src ! video/x-raw,width=1920,height=1080,format=NV12 !
waylandsink
```

Eigenschaften: device

```text
device              : Device location
                      flags: readable, writable
                      String. Default: "/dev/video-camera0"
```

min-buffers

```text
min-buffers         : Override the driver's min buffers (0 means auto)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 64 Default: 0
```

num-buffers

```text
num-buffers         : Number of buffers to output before sending EOS (-1 =
unlimited)
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

#### 4.4.2 rtspsrc

Empfängt Daten über das Netzwerk mittels RTSP (RFC 2326). Pipeline-Beispiele:

```text
gst-launch-1.0 rtspsrc location=rtsp://192.168.1.105:8554/ ! rtph264depay !
h264parse ! mppvideodec ! waylandsink
```

Eigenschaften: location

```text
location            : Location of the RTSP url to read
                      flags: readable, writable
                      String. Default: null
```

#### 4.4.3 videoflip

Spiegelt und dreht Video. Unterstützt RGA-2D-Beschleunigung; die RGA-Fähigkeiten hängen von der Plattform ab, siehe Datenblatt. BR2_PREFER_ROCKCHIP_RGA in menuconfig aktivieren und export GST_VIDEO_FLIP_USE_RGA=1 ausführen. Pipeline-Beispiele:

```text
# uncomment these two variables in /etc/profile.d/gst.sh, or export manually
export GST_VIDEO_CONVERT_USE_RGA=1
export GST_VIDEO_FLIP_USE_RGA=1
gst-launch-1.0 videotestsrc ! videoflip video-direction=90r ! waylandsink
```

Eigenschaften: video-direction

```text
video-direction     : Video direction: rotation and flipping
                      flags: readable, writable, controllable, changeable in
NULL, READY, PAUSED or PLAYING state
                      Enum "GstVideoOrientationMethod" Default: 0, "identity"
                         (0): identity         - GST_VIDEO_ORIENTATION_IDENTITY
                         (1): 90r              - GST_VIDEO_ORIENTATION_90R
                         (2): 180              - GST_VIDEO_ORIENTATION_180
                         (3): 90l              - GST_VIDEO_ORIENTATION_90L
                         (4): horiz            - GST_VIDEO_ORIENTATION_HORIZ
                         (5): vert             - GST_VIDEO_ORIENTATION_VERT
                         (6): ul-lr            - GST_VIDEO_ORIENTATION_UL_LR
                         (7): ur-ll            - GST_VIDEO_ORIENTATION_UR_LL
                         (8): auto             - GST_VIDEO_ORIENTATION_AUTO
                         (9): custom           - GST_VIDEO_ORIENTATION_CUSTOM
```

### 4.5 gst1-plugins-bad

#### 4.5.1 kmssink

Videoausgabe über die Kernel-Mode-Setting-API von Linux. Pipeline-Beispiele:

```text
gst-launch-1.0 videotestsrc ! kmssink
```

Eigenschaften: connector-id

```text
connector-id        : DRM connector id
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

fullscreen

```text
fullscreen          : Force showing fullscreen
                      flags: readable, writable
                      Boolean. Default: false
```

hdr-enable

```text
hdr-enable          : Enable HDR
                      flags: readable, writable
                      Boolean. Default: true
```

plane-id

```text
plane-id            : DRM plane id
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

render-rectangle

```text
render-rectangle    : The render rectangle ('<x, y, width, height>')
                      flags: writable
                      Default: "<  >"
                      GstValueArray of GValues of type "gint" Write only
```

sync

```text
sync                : Sync on the clock
                      flags: readable, writable
                      Boolean. Default: true
```

sync-mode

```text
sync-mode           : Prefered frame syncing mode
                      flags: readable, writable
                      Enum "GstKMSSyncMode" Default: 0, "auto"
                         (0): auto             - Sync with page flip or vblank
event
                         (1): flip             - Sync with page flip event
                         (2): vblank           - Sync with vblank event
                         (3): none             - Ignore syncing
```

#### 4.5.2 waylandsink

Ausgabe auf einer Wayland-Oberfläche. Pipeline-Beispiele:

```text
gst-launch-1.0 videotestsrc ! waylandsink
```

Eigenschaften: fullscreen

```text
fullscreen          : Whether the surface should be made fullscreen
                      flags: readable, writable
                      Boolean. Default: false
```

layer

```text
layer               : Wayland window layer
                      flags: readable, writable
                      Enum "GstWlWindowLayer" Default: 1, "normal"
                         (0): top              - Top
                         (1): normal           - Normal
                         (2): bottom           - Bottom
```

render-rectangle

```text
render-rectangle    : The render rectangle ('<x, y, width, height>')
                      flags: writable
                      Default: "<  >"
                      GstValueArray of GValues of type "gint" Write only
```

rotate-method

```text
rotate-method       : rotate method
                      flags: readable, writable
                      Enum "GstVideoOrientationMethod" Default: 0, "identity"
                         (0): identity         - GST_VIDEO_ORIENTATION_IDENTITY
                         (1): 90r              - GST_VIDEO_ORIENTATION_90R
                         (2): 180              - GST_VIDEO_ORIENTATION_180
                         (3): 90l              - GST_VIDEO_ORIENTATION_90L
                         (4): horiz            - GST_VIDEO_ORIENTATION_HORIZ
                         (5): vert             - GST_VIDEO_ORIENTATION_VERT
                         (6): ul-lr            - GST_VIDEO_ORIENTATION_UL_LR
                         (7): ur-ll            - GST_VIDEO_ORIENTATION_UR_LL
                         (8): auto             - GST_VIDEO_ORIENTATION_AUTO
                         (9): custom           - GST_VIDEO_ORIENTATION_CUSTOM
```

sync

```text
sync                : Sync on the clock
                      flags: readable, writable
                      Boolean. Default: true
```

#### 4.5.3 fpsdisplaysink

Zeigt die aktuelle Bildrate und die Rate verworfener Frames des Videosinks als Einblendung oder Text auf stdout an. Pipeline-Beispiele:

```text
  # debug level TRACE(7) for avg-rate per second, debug level DEBUG(5) for
min/max rate.
  GST_DEBUG=fpsdisplaysink:7 gst-play-1.0 --flags=3 --videosink="fpsdisplaysink
video-sink=xvimagesink signal-fps-measurements=true text-overlay=false
sync=false"
```

Eigenschaften: signal-fps-measurements

```text
signal-fps-measurements: If the fps-measurements signal should be emitted.
                      flags: readable, writable
                      Boolean. Default: false
```

sync

```text
sync                : Sync on the clock (if the internally used sink doesn't have
this property it will be ignored
                      flags: readable, writable
                      Boolean. Default: true
```

text-overlay

```text
text-overlay        : Whether to use text-overlay
                      flags: readable, writable
                      Boolean. Default: true
```

video-sink

```text
video-sink          : Video sink to use (Must only be called on NULL state)
                      flags: readable, writable
                      Object of type "GstElement"
```

## 5. Rockchip-MPP-Plugins

Die Encoder- und Decoder-Plugins basieren auf MPP. Die Decoder-Basisklasse ist GstVideoDecoder, die Encoder-Basisklasse GstVideoEncoder. Quellcode: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp. Decoderformate: JPEG, MPEG, VP8, VP9, H264, H265 [1]. Encoderformate: JPEG, H264, H265, VP8.

### 5.1 gstmppdec

Die Quellen liegen in gstreamer-rockchip/gst/rockchipmpp und enthalten mppvideodec sowie mppjpegdec. Nachfolgend dient mppvideodec als Beispiel.

```text
gstreamer-rockchip/gst/rockchipmpp/
├── gstmppdec.c
├── gstmppdec.h
├── gstmppjpegdec.c
├── gstmppjpegdec.h
├── gstmppvideodec.c
├── gstmppvideodec.h
……
```

#### 5.1.1 Wichtigste Funktionen

gst_mpp_dec_start: erstellt MPP und Allocator. gst_mpp_dec_set_format: initialisiert MPP, legt Codec-Typ und Format fest und konfiguriert Eigenschaften wie Fast Mode und Ignore Error.

gst_mpp_dec_handle_frame: holt über get_mpp_packet ein MPP-Paket, füllt dessen Daten und übergibt es mit send_mpp_packet an MPP. gst_mpp_dec_loop: holt den decodierten Frame über poll_mpp_frame und gibt ihn an das nächste Plugin weiter. gst_mpp_dec_rga_convert: führt bei Bedarf Formatkonvertierung, Drehung, Skalierung oder Zuschnitt über RGA [2] aus und leitet das Ergebnis anschließend weiter.

#### 5.1.2 Wichtigste Eigenschaften

rotation: Drehwinkel 0°, 90°, 180° oder 270°. width: 0 deaktiviert die Skalierung. height: 0 deaktiviert die Skalierung. crop-rectangle: Bereich &lt;x, y, w, h&gt;; ab &lt;x, y&gt; wird ein Bild der Größe w*h für das nächste Plugin ausgeschnitten. Die Skalierung erfolgt vor dem Zuschnitt; dessen Parameter sind daher aus den skalierten Abmessungen zu berechnen. Die Abbildung zeigt den Ablauf für crop-rectangle='&lt;1920,0,1920,1080&gt;' width=3840 height=1080.

![Benutzerhandbuch für Rockchip Linux GStreamer](/docs/rockchip-linux-gstreamer/assets/en-p030-figure-01.png)

arm-afbc: ARM Frame Buffer Compression, standardmäßig deaktiviert. Einige Plattformen, etwa RK3399, unterstützen AFBC nicht. Aktivierung reduziert die DDR-Bandbreitennutzung und verbessert die Decodierleistung mancher Chips deutlich. format: Ausgabeformat; bei einem anderen Wert als 0-"auto" wird konvertiert. fast-mode: schneller MPP-Modus, standardmäßig aktiviert. Beispielsweise können auf RK3588 Teile der Decodierung parallel laufen. ignore-error: ignoriert MPP-Decoderfehler und erzwingt die Ausgabe des decodierten Frames; standardmäßig aktiviert.

### 5.2 gstmppenc

Die Quellen liegen in gstreamer-rockchip/gst/rockchipmpp und enthalten unter anderem mpph264enc, mppvp8enc und mppjpegenc. Nachfolgend dient mpph264enc als Beispiel.

```text
gstreamer-rockchip/gst/rockchipmpp/
├── gstmppenc.c
├── gstmppenc.h
├── gstmppjpegenc.c
├── gstmppjpegenc.h
├── gstmpph264enc.c
├── gstmpph264enc.h
……
```

#### 5.2.1 Wichtigste Funktionen

gst_mpp_enc_start: erstellt MPP und setzt Codec-Typ und Format. gst_mpp_enc_apply_properties: konfiguriert Eigenschaften wie gop und bps. gst_mpp_enc_handle_frame: empfängt und speichert den Puffer des vorherigen Plugins. gst_mpp_rga_convert: führt nötige Drehungen und Skalierungen vor dem Speichern über RGA [3] aus. gst_mpp_enc_loop: entnimmt den ältesten Frame der Warteschlange, übergibt ihn mit encode_put_frame an MPP, erhält das Paket über encode_get_packet und leitet es an das nächste Plugin weiter.

#### 5.2.2 Wichtigste Eigenschaften

width und height: 0 deaktiviert die Skalierung. rc-mode: Bitratenregelung mit VBR, CBR und Fixed QP. bps: Zielbitrate; bps-max: maximale; bps-min: minimale Bitrate. Alle drei werden bei Fixed QP ignoriert. gop: Group Of Picture, Abstand zwischen I-Frames. 0 bedeutet einen I-Frame und danach P-Frames; 1 bedeutet ausschließlich I-Frames; 2 ergibt I P I P I P… Standardmäßig entspricht gop der Bildrate. level: level_idc in SPS. profile: profile_idc in SPS. rotation: Winkel 0°, 90°, 180° oder 270°.

## 6. Umgebungsvariablen

Häufige Umgebungsvariablen sind in /etc/profile.d/gst.sh zusammengefasst. Ausführliche Hinweise stehen in den Skriptkommentaren.

```text
# Convert to NV12(using RGA) when output format is NV12_10.
export GST_MPP_DEC_DISABLE_NV12_10=1
# Convert to NV12(using RGA) when output format is NV16_10.
export GST_MPP_DEC_DISABLE_NV16_10=1
# Convert to NV12(using RGA) when output format is not NV12.
export GST_MPP_VIDEODEC_DEFAULT_FORMAT=NV12
# Try to use ARM AFBC to get better performance, but not work for all sinks.
export GST_MPP_VIDEODEC_DEFAULT_ARM_AFBC=1
# Preferred formats for V4L2
export GST_V4L2_PREFERRED_FOURCC=NV12:YU12:NV16:YUY2
# Preferred formats for videoconvert
export GST_VIDEO_CONVERT_PREFERRED_FORMAT=NV12:NV16:I420:YUY2
# Max resolution for v4l2src
export GST_V4L2SRC_MAX_RESOLUTION=3840x2160
# Min buffers for V4L2 plugins
export GST_V4L2_MIN_BUFS=64
# Try RGA 2D accel in videoconvert, videoscale and videoflip.
# NOTE: Might not success, and might behave different from the official plugin.
export GST_VIDEO_CONVERT_USE_RGA=1
export GST_VIDEO_FLIP_USE_RGA=1
...
```

## 7. Befehlsbeispiele

### 7.1 Videowiedergabe

```text
gst-play-1.0 --flags=3 --videosink="fpsdisplaysink video-sink=xvimagesink signal-
fps-measurements=true text-overlay=false sync=false" --audiosink="alsasink
device=hw:0,0" test.mp4
```

### 7.2 Wiedergabe mehrerer Videos

```text
# Use the render-rectangle of waylandsink for different rendering positions
gst-launch-1.0 filesrc location=/usr/local/test.mp4 ! parsebin ! mppvideodec !
waylandsink render-rectangle='<0,0,400,400>' &
gst-launch-1.0 filesrc location=/usr/local/test.mp4 ! parsebin ! mppvideodec !
waylandsink render-rectangle='<0,500,400,400>' &
gst-launch-1.0 filesrc location=/usr/local/test.mp4 ! parsebin ! mppvideodec !
waylandsink render-rectangle='<0,1000,400,400>' &
```

### 7.3 Codierung und Vorschau

Das tee-Plugin verzweigt die Kameradaten: Der erste Zweig geht zur Codierung an mpph264enc und anschließend zur Speicherung an filesink; der zweite geht zur Anzeige an autovideosink. Hinter tee ist queue einzufügen: Die Pufferung verhindert eine Blockierung des Streams.

```text
gst-launch-1.0 v4l2src ! 'video/x-raw,format=NV12' ! tee name=tv ! queue !
mpph264enc ! 'video/x-h264' ! h264parse ! 'video/x-h264' ! filesink
location=/data/out.h264 tv. ! queue ! autovideosink
```

### 7.4 Aufteilen von Streams

Einige Plugins wie qtdemux erzeugen mehrere Ausgangspads, etwa für Audio, Video und Untertitel. Geben Sie dem Plugin einen Namen, um den gewünschten Stream anzusprechen. Im Beispiel heißt qtdemux qt: qt.audio_0 ist der erste Audiostream, qt.video_0 der erste Videostream; beide werden in getrennte Dateien geschrieben. Auch hier ist queue nötig. Pad-Namen unterscheiden sich je nach Plugin; mit gst-inspect prüfen oder direkt qt. ! queue ! mppvideodec verwenden. GStreamer handelt dann die caps mit dem nächsten Plugin aus.

```text
gst-launch-1.0 filesrc location=test.mp4 ! qtdemux name=qt qt.audio_0 ! queue !
filesink location=audio.bin qt.video_0 ! queue ! filesink location=video.bin
```

## 8. AFBC

AFBC steht für ARM Frame Buffer Compression, ein Kompressionsformat zur Einsparung von Bandbreite. mppvideodec unterstützt AFBC für H264, H265 und VP9; Farbformate sind NV12, NV12 10bit und NV16. Aktivierung:

```text
# Enable global AFBC，applicable to situations where mppvideodec cannot be
directly operated using some command like gst-play-1.0
export GST_MPP_VIDEODEC_DEFAULT_ARM_AFBC=1
# Enable afbc for current pipeline
gst-launch-1.0 filesrc location=/test.mp4 ! parsebin ! mppvideodec arm-afbc=true
! waylandsink
```

waylandsink und xvimagesink unterstützen die Anzeige von AFBC. Alternativ kann kmssink/rkximagesink mit einer ausdrücklich gewählten Cluster-Ebene verwendet werden; dafür ist eine exklusiv verfügbare Ebene erforderlich. Beispiele:

```text
# GST_DEBUG=*mpp*:4 enable the log of mpp plugin, you can use the log to check if
the AFBC is enabled successfully, if "AFBC" is not printed, it may be
unsuccessfully opened or the format does not in support
GST_DEBUG=*mpp*:4 gst-play-1.0 --flags=3 --videosink=waylandsink test.mp4
GST_DEBUG=*mpp*:4 gst-play-1.0 --flags=3 --videosink="kmssink plane-id=101"
...
0:00:00.256819945 29143   0x7f70008700 INFO                  mppdec
gstmppdec.c:465:gst_mpp_dec_apply_info_change:<mppvideodec0> applying NV12(AFBC)
1920x1080 (1920x1104)
...
```

### 8.1 Decodierte AFBC-Daten ausgeben

Zur Prüfung der Hardwaredecodierung in GStreamer lassen sich die decodierten Bilder (üblicherweise NV12 und weitere Formate) wie folgt speichern.

1. MPP-Protokollierung aktivieren

```text
export mpp_debug=0x400
```

Im Verzeichnis /data erscheinen die von der integrierten MPP-Debugfunktion gespeicherten decodierten Daten. Bei aktiviertem AFBC wird diese Ausgabe nicht unterstützt. Ohne AFBC liegen die Daten gewöhnlich in NV12 vor und lassen sich mit rawplayer oder einem anderen Rohdatenplayer anzeigen.

2. Die decodierten Daten mit dem GStreamer-Plugin filesink speichern. Dies funktioniert mit und ohne AFBC. Anwendung:

```text
gst-launch-1.0 uridecodebin uri=file://xxx ! filesink location=xxx.yuv
```

Die decodierten AFBC-Daten liegen in xxx.yuv. Vor der Anzeige mit rawplayer oder einem anderen Rohdatenplayer müssen sie dekomprimiert werden. Der folgende Befehl dient dazu; das Programm afbcDec ist beim zuständigen Ansprechpartner erhältlich.

```text
./afbcDec filename w h format afbcmode
#eg: ./afbcDec 178_Surfa_id-26_1088x1824_z-0.bin 1088 1824 0 1
# 0=RGBA,1=NV12,2=RGB888, afbcmode 0=afbc, 1=afbc|YTR
```

afbcDec gibt ARGB-Bilder aus. Zur Prüfung jedes Frames muss die filesink-Datei in einzelne Frames aufgeteilt werden: Das Dekompressionsprogramm verarbeitet nur einen Frame, während die gespeicherte Videodatei alle Frames enthält. Beispiel für die Aufteilung:

```text
# GST_DEBUG view the size of each frame
GST_DEBUG=filesink:6 gst-launch-1.0 uridecodebin uri=file://xxx ! filesink
location=xxx.yuv

0:00:01.224149631 14266   0x7f7c00ab00 DEBUG  filesink
gstfilesink.c:769:gst_file_sink_flush_buffer:<filesink0> Flushing out buffer of
size 1390080
# Use the split command to split frames
split -b 1390080 -a 5 -d  xxx.yuv dump_frame
```

## 9. Untertitel

Aktivierte Untertitel können Verzögerungen verursachen. Für die Komposition werden üblicherweise Bilder aus dem Video entnommen, nach RGB konvertiert, mit Untertiteln versehen und vor der Anzeige ins Ausgangsformat zurückkonvertiert. Zusätzlich zur Decodierzeit fällt Kompositionszeit an, wodurch die Bildrate sinkt. Mit gst-play-1.0 testen und Untertitel durch --flags=3 abschalten. Untertitel sollten mit einem Framework wie QT unabhängig von der Videoebene dargestellt werden.

## 10. Ebenenzuweisung

rkximagesink und kmssink benötigen eine exklusive Hardwareebene. Das Plugin wählt automatisch eine Ebene, die jedoch möglicherweise nicht den Anforderungen entspricht. Dann muss die Ebene manuell festgelegt werden:

```text
gst-play-1.0 --flags=3 test.mp4 --videosink="kmssink plane-id=117"
```

117 ist die ID der Zielebene; sie lässt sich in /sys/kernel/debug/dri/0/state prüfen. Der folgende Befehl listet alle Ebenen:

```text
root@linaro-alip:/# cat /sys/kernel/debug/dri/0/state | grep "plane\["
plane[57]: Smart1-win0
plane[71]: Cluster1-win0
plane[87]: Smart0-win0
plane[101]: Cluster0-win0
plane[117]: Esmart1-win0
plane[131]: Esmart0-win0
# You can also use cat /sys/kernel/debug/dri/0/state directly to list complete
information
```

plane[xx] gibt die plane-id an. Verschiedene Ebenen unterstützen üblicherweise unterschiedliche Formate: Cluster unterstützt beispielsweise AFBC, Esmart nicht. Details stehen im Datenblatt oder TRM. Fehlt der Knoten, kann modetest -p die Ebenen auflisten.

## 11. Analyse einer GStreamer-Pipeline

GStreamer kann den Pipeline-Zustand zur Analyse in dot-Dateien ausgeben. Befehle:

```text
# Execute thess cmds in DUT
# Enable dump dot files
$ export GST_DEBUG_DUMP_DOT_DIR=/tmp
# Run your tests
$ gst-play-1.0 test.mp4
# Check if the dot files are dumped successfully
$ ls -alF /tmp/*.dot
-rw-rw-r-- 1 root root 49141 1  16 10:35 /tmp/0.00.00.385340438-gst-play.async-
done.dot
# Execute thess cmds in PC
$ adb pull /tmp/0.00.00.385340438-gst-play.async-done.dot .
$ dot 0.00.00.385340438-gst-play.async-done.dot -Tpng > out.png
```

out.png zeigt den Gesamtzustand der GStreamer-Pipeline. Im Verzeichnis dot können mehrere Dateien für unterschiedliche Zeitpunkte liegen; diese lassen sich einzeln zur Analyse konvertieren. Der Befehl dot gehört zum Paket graphviz: https://www.graphviz.org/download/.

## 12. Häufige Fragen

### 12.1 4K 30FPS läuft flüssig, Verzögerungen entstehen jedoch bei der Wiedergabe von 4K 60FPS

Systemlast, DDR-Bandbreite und weitere Faktoren können 4K 60FPS verhindern. AFBC entsprechend dem betreffenden Kapitel ausprobieren. Außerdem lassen sich Untertitel und Sink-Synchronisierung abschalten: gst-play-1.0 test.mp4 --flags=3 --videosink="waylandsink sync=false". Werden 60FPS nicht erreicht, führt aktiviertes sync zu Abweichungen zwischen Frame-Zeitstempeln und Takt und damit zu deutlichen Frameverlusten.

### 12.2 Manche Quellen werden verzögert wiedergegeben, wobei die CPU-Auslastung sehr hoch ist

Dieser Quellabschnitt nennt H264, H265, VP8, VP9 und MPEG für die Hardwaredecodierung. DEBUG mit echo 0x100 &gt; /sys/module/rk_vcodec/parameters/mpp_dev_debug aktivieren und die serielle Ausgabe oder dmesg auf Decodiermeldungen prüfen. Fehlen sie, wird das Format möglicherweise nicht vom Hardwaredecoder unterstützt.

### 12.3 Manche Quellen lassen sich nicht wiedergeben, das Protokoll stockt, der Fortschritt fehlt oder bleibt bei 0

playbin3 ausprobieren: gst-play-1.0 --flags=3 --use-playbin3 test.mp4.

### 12.4 Flackern bei der 4K-Wiedergabe nach Aktivierung von AFBC

Zunächst den Leistungsmodus aktivieren: `echo performance | tee $(find /sys/ -name *governor)`. Danach auf starke vertikale Skalierung prüfen, etwa bei einem horizontalen Video auf einem hochkant ausgerichteten Display. In diesem Fall kann die Leistung mit AFBC schlechter als ohne AFBC sein.

### 12.5 Bild vorhanden, aber kein Ton

audiosink manuell festlegen, etwa gst-play-1.0 --flags=3 test.mp4 --audiosink="alsasink device=hw:0,0". Zunächst mit einem einfachen Werkzeug wie aplay prüfen, ob die Audioausgabe funktioniert, danach mit GStreamer testen.

### 12.6 Beim Start des Dekompressionsprogramms afbcDec wird die fehlende Bibliothek libgraphic_lsf.so gemeldet

libgraphic_lsf.so beim zuständigen Ansprechpartner anfordern und die fehlende Bibliothek nach /usr/lib/ kopieren.

### 12.7 Frameverluste bei v4l2src

1. Leistungsmodus aktivieren: `echo performance | tee $(find /sys/ -name *governor)`.

2. Bildrate mit v4l2-ctl messen: v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=3 --stream-skip=1 --stream-poll. Den Knoten /dev/video0 und das Format an die eigene Konfiguration anpassen.

3. Liefert v4l2-ctl die erwartete Bildrate, v4l2src jedoch nicht, min-buffers ausprobieren: gst-launch-1.0 v4l2src min-buffers=64 ! video/x-raw,width=1920,height=1080,format=NV12 ! waylandsink.

4. Das queue-Plugin ausprobieren:

```text
# min-threshold-time in ns, it is 5s here
gst-launch-1.0 v4l2src ! queue max-size-buffers=0 max-size-time=0 max-size-
bytes=0 min-threshold-time=5000000000 ! autovideosink
```

5. ts-offset für den Videosink festlegen:

```text
# ts-offset in ns, it is 0.5s here
gst-launch-1.0 v4l2src ! queue max-size-bytes=1000000000 max-size-buffers=0 max-
size-time=0 ! autovideosink ts-offset=500000000
```

6. Das Kopieren von v4l2src-Puffern erzwingen:

```text
gst1-plugins-good $ git diff
diff --git a/sys/v4l2/gstv4l2object.c b/sys/v4l2/gstv4l2object.c
index 2fb9091b..efa94561 100644
@@ -4792,6 +4794,7 @@ gst_v4l2_object_decide_allocation (GstV4l2Object * obj,
GstQuery * query)
  /* We can't share our own pool, if it exceed V4L2 capacity */
  if (min + obj->min_buffers + 1 > VIDEO_MAX_FRAME)
    can_share_own_pool = FALSE;
+  can_share_own_pool = FALSE;

  /* select a pool */
  switch (obj->mode) {
```

### 12.8 Aushandlung bei v4l2src fehlgeschlagen

v4l2-ctl -d /dev/video0 --list-formats-ext listet alle Formate und Auflösungen; /dev/video0 entsprechend anpassen. Gibt die Kamera YUV (etwa NV12, NV16) oder RGB (etwa BGRA, BGRx) aus, können videosink oder videoencoder die Daten verarbeiten. JPEG-Ausgabe muss zuerst mit mppjpegdec decodiert werden. Passt das Kameraformat nicht zum folgenden Plugin, videoconvert dazwischenschalten.

### 12.9 v4l2src mit HDMIIN

Zum Lesen von HDMIIN- beziehungsweise HDMIRX-Streams wird üblicherweise v4l2src wie bei einer Kamera verwendet. Den hdmirx-Knoten mit grep '' /sys/class/video4linux/*/name suchen.

### 12.10 v4l2src erfasst keine Frames oberhalb von 4K

Die Begrenzung steht im Skript. /etc/profile.d/gst.sh bearbeiten und export GST_V4L2SRC_MAX_RESOLUTION=3840x2160 ändern. Originaldatei in Buildroot: &lt;SDK&gt;/buildroot/package/gstreamer1/gstremaer1/gst.sh; in Debian: &lt;SDK&gt;/debian/overlay/etc/profile.d/gst.sh.

1. Hier stehen nur die vom Plugin unterstützten Formate. Ob der konkrete Chip sie unterstützt, ist im zugehörigen Datenblatt zu prüfen.

Die Quelle weist darauf hin, dass RGA auf einigen Plattformen wie RK3588 fehlerhaft arbeitet und deshalb nicht empfohlen wird.

Die Quelle weist darauf hin, dass RGA auf einigen Plattformen wie RK3588 fehlerhaft arbeitet und deshalb nicht empfohlen wird.

## Quellenabgleich und Ergänzungen aus der chinesischen Grundlage

- Buildroot-Pfade unterscheiden sich: Chinesisch nennt `<SDK>/buildroot/configs/rockchip/multimedia/gst/`, Englisch `<SDK>/buildroot/configs/rockchip/*_gst.config` sowie die Versionswahl `BR2_PACKAGE_GSTREAMER1_18` / `BR2_PACKAGE_GSTREAMER1_20`. Den eigenen SDK-Baum prüfen. Debian-Patches sind laut chinesischer Quelle bei Entwicklern etwa über Redmine erhältlich.
- Plugin-Kategorien sind Source, Filter und Sink. Der Kern stellt Basisklassen und Elementdefinitionen bereit und verarbeitet selbst kaum Multimedia; dies übernehmen Plugins. Laut Quelle führt der neuere GitLab-Baum Kern und Plugin-Bibliotheken als subprojects zusammen.
- Chinesisch nennt in Kapitel 5 zusätzlich AV1; Englisch nennt AV1 in Kapitel 4, lässt es aber in Kapitel 5 aus. Chipunterstützung anhand des Datenblatts prüfen. Chinesisch nennt `gop=-1` als Standard: GOP aus der Bildrate ableiten, also ein I-Frame pro Sekunde. Decoderstandards sind 0° Drehung, width/height=0 und format=0/auto.
- Encoder-arm-afbc muss bei AFBC-komprimierter Eingabe aktiviert werden. bps, bps-max und bps-min geben Bitrate und Grenzen an; qp-init und JPEG-q-factor beeinflussen Qualität und Bitrate. Encoder-width/height beschreiben Eingabeabmessungen; Abweichungen lösen RGA-Skalierung aus, die Drehung betrifft den Eingabepuffer. Decoderabmessungen und -format betreffen die Ausgabe. AFBC spart Bandbreite und kann von passenden Modulen wie VOP verarbeitet werden.
- kmssrc dma-feature gibt DMA-Puffer aus; die chinesische Decoderbeschreibung spricht von Eingabe-DMA-Puffern. framerate-limit begrenzt die Bildrate; num-buffers erzeugt nach der angegebenen Anzahl EOS. sync-fb folgt FB-Wechseln, sync-vblank folgt vblank. crop-rectangle legt den Zuschnitt fest; fast-mode beschleunigt unterstützte Plattformen und Formate; ignore-error ignoriert MPP-Fehler.
- Bei rohem YUV für einen Encoder muss filesrc blocksize zur Framegröße passen: Der Standard 4096 ist meist kleiner und kann Encoderfehler auslösen. location akzeptiert absolute oder relative Pfade; num-buffers begrenzt die Frameanzahl. Bei filesink bezeichnet blocksize die Block-/Framegröße und location den Speicherpfad. fakesink verwirft Daten, etwa zum Abschalten von Audio.
- appsrc importiert externe Daten, etwa nachdem eine Anwendung einen proprietären Stream entschlüsselt hat. appsink exportiert Daten, etwa decodierte Frames zur algorithmischen Verarbeitung. Diese Elemente dienen vorwiegend programmierten Anwendungen. Sie lassen sich koppeln: appsink → Verarbeitung → appsrc. Beispiele: `gst-plugins-base-<version>/tests/examples/app/`.
- decodebin wählt Decoder und erzeugt separate Wege für Audio, Video und Untertitel. playbin kombiniert decodebin mit automatischer Sink-Wahl. uridecodebin kombiniert decodebin mit einer zur URI passenden Quelle. Chinesisch nennt `file://`, `rtps://`, `http://`; `rtps://` bleibt als Quellschreibweise erhalten und ist gegen die beabsichtigte RTSP-URI zu prüfen.
- audio-sink wählt beispielsweise alsasink/pulsesink, video-sink waylandsink/kmssink; flags bestimmt die ausgegebenen Medien. videotestsrc erzeugt verschiedene Formate und Auflösungen. Chinesisch beschreibt xvimagesink und waylandsink als GPU-komponierte Ausgabe; kmssink benötigt eine exklusive Hardwareebene. Manche Plattformen besitzen kein RGA; Datenblatt prüfen.
- Bei v4l2src wählt device den Knoten, min-buffers die minimale Treiberpufferung und num-buffers die Frameanzahl. rtspsrc location bestimmt die Streamadresse, video-direction die Ausrichtung. connector-id, plane-id, render-rectangle, fullscreen, hdr-enable, sync-mode, layer, rotate-method und sync wählen Anschluss, Ebene, Ausgabebereich, Vollbild, HDR, Framesynchronisierung, Ebenenreihenfolge, Drehung und Taktsynchronisierung. signal-fps-measurements aktiviert das Messsignal; text-overlay blendet die Rate ein; fpsdisplaysink video-sink wählt den tatsächlichen Renderer und leitet Bilder an ihn weiter.
- RGA-Warnungen gelten für die Quellversion, nicht als heutiger Test aller SDKs. Der Quellpfad `gstremaer1/gst.sh` bleibt erhalten. Chinesisch schreibt einmal `mppvidedec`, Englisch `mppvideodec`; gegen das SDK prüfen. PDF-Zeilenumbrüche in Befehlen sind keine Ausführungsgrenzen der Shell.

{% endraw %}
