---
title: "Rockchip: Anpassung von Drittsystemen"
description: "Rockchip: Anpassung von Drittsystemen — V1.0.2"
excerpt: "Rockchip: Anpassung von Drittsystemen"
translation_key: "206-rockchip-third-party-system-adaptation"
slug: "206-rockchip-third-party-system-adaptation"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, Debian]
---

{% raw %}

# Rockchip: Anpassung von Drittsystemen

ArmSoM-Plattformreferenz: RK-KF-YF-917 V1.0.2, CN/EN mit 9/10 Seiten. Quellenumfang: RK3568/Linux 4.19 und RK3588/Linux 5.10, vor allem Userspace-Bibliotheken und Dienste Debian-ähnlicher Systeme. Keine Installationsgarantie für alle ArmSoM-Platinen. SoC, SDK/BSP, Kernel, Architektur, Paket-ABI, GPU, Kamera und Funkmodul abgleichen. Die Quellbefehle wurden nicht auf ArmSoM-Hardware ausgeführt.

Beide Quellen sind V1.0.2; alle acht Kapitel, beide Tabellen und sämtliche Beispiele sind erhalten. Keine technischen Abbildungen. §4.1 nennt opengl, Tabelle und §4.6 opengles: Der Widerspruch bleibt dokumentiert, nicht als aktuelle Supportmatrix. Der §5.5-Befehl mit uri/file/Anführungszeichen und Anzeige-Sink ist ein unvollständiges Quellbeispiel. In §6.2 enthält Englisch `/tmp /0.yuv` ein Leerzeichen, Chinesisch `/tmp/0.yuv` nicht. Quellschreibweisen bleiben markiert erhalten; Syntax und Knoten prüfen.

## 1. Anzupassende RK-Hardware

Die GPU (Graphics Processing Unit), auch Grafikkern oder visueller Prozessor genannt, beschleunigt geometrische Transformationen, Beleuchtung, Cube Mapping, Vertex Blending, Texturkompression, Bump Mapping sowie die in der Quelle genannte 256-Bit-Rendering-Engine mit zwei Texturen und vier Pixeln. Die RK-GPU ist im SoC integriert.

RGA ist ein im SoC integrierter 2D-Beschleuniger für Drehen, Zuschneiden, Skalieren und weitere Operationen.

VPU beschleunigt Video-En-/Dekodierung verschiedener Formate und ist im SoC integriert.

ISP verarbeitet das Ausgangssignal des vorgeschalteten Bildsensors nach und ist im SoC integriert.

NPU ist ein eingebetteter neuronaler Prozessor mit datengetriebener paralleler Rechenarchitektur, besonders für große Video- und Bilddatenmengen geeignet. Er ist für IoT-KI ausgelegt, beschleunigt neuronale Netze und adressiert deren geringe Effizienz auf herkömmlichen Chips; er ist im SoC integriert.

Wi-Fi/BT ist ein an die Platine angepasstes Nahbereichs-Kommunikationsmodul.

## 2. RK-Softwareanpassung

| Quellpfad | Beschreibung |
| --- | --- |
| SDK/external/libmali | Userspace-GPU-Schnittstellen, vor allem allgemeines OpenGL ES. Anwendungsschnittstellen für Debian-ähnliches xserver/wayland entsprechend anpassen. |
| SDK/external/xserver | xserver-Hardwarebeschleunigungs-Patches. Für xserver die Patches dieses Repositories nutzen. |
| SDK/external/linux-rga | RGA-Userspace-Schnittstelle. |
| SDK/external/mpp | VPU-Userspace-Schnittstelle. |
| SDK/external/rknpu2 | NPU-Userspace-Schnittstelle. |
| SDK/external/camera_engine_rkaiq | ISP-Userspace-Schnittstelle. |
| SDK/external/drm-cursor | Userspace-Schnittstelle der Hardware-Cursorebene. |

## 3. Besonderheiten der Softwareanpassung

Debian-ähnliche Systeme können zahlreiche Versionsabhängigkeiten besitzen. Falls die folgenden Pakete nicht installierbar sind, die Quellen auf dem Zielgerät neu bauen:

```text
cd 'Source code directory'
sudo apt build-dep .
sudo DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d  -us
```

## 4. Anzeigedienste

### 4.1 Übersicht

Anzeigeaufbau eines Debian-ähnlichen Systems: Anzeigeanwendung + Grafikframework + Grafikschnittstelle + Grafikhardware. Anwendungen sind beispielsweise x11, gnome, kde, xfce4 und sdl2; Frameworks wayland, xserver und gbm. Die Quelle nennt hier ausschließlich opengl für Rockchip; die Hardware ist die GPU. Nachfolgend die Kombinationen. Den Quellenstand beachten und die Unterstützung auf den offiziellen Projektseiten prüfen.

| Anwendung | Unterstütztes Framework | Unterstützte Schnittstelle |
| --- | --- | --- |
| x11 | xserver | opengles/gbm |
| gnome | xserver/wayland | opengles/gbm |
| kde | xserver/wayland | opengles/gbm |
| xfce4 | xserver | opengles/gbm |
| sdl2 | xserver/wayland | opengles/gbm |

Zunächst die Anzeigeanwendung und anschließend deren Framework, xserver oder wayland, bestimmen und passend anpassen.

### 4.2 GPU

xserver oder wayland bestimmen — die beiden in der Quelle unterstützten Frameworks — und SDK/debian/packages/"ARCH"/libmali/libmali-***.deb installieren. Für x11 auf RK3588 mit GPU valhall-g610-g6p0 beispielsweise:

```text
SDK/debian/packages/arm64/libmali/libmali-valhall-g610-g6p0-x11_1.9-1_arm64.deb
```

### 4.3 RGA

Installationspaket:

```text
SDK/debian/packages/'ARCH'/rga/*.deb
```

### 4.4 drm-cursor

Installationspaket:

```text
SDK/debian/packages/arm64/libdrm-cursor/*.deb
```

### 4.5 xserver

Es gibt viele xserver-Versionen. Die Systemversion bestimmen, die RK-Quellpatches darauf übertragen und neu bauen. Patches erzeugen:

```text
cd 'source directory'

git format-patch e4f4521ca
```

Vorgebaute Pakete der Version 1.20.11:

```text
SDK/debian/packages/'ARCH'/xserver/xserver-common_1.20.11-1_all.deb

SDK/debian/packages/'ARCH'/xserver/xserver-xorg-core_1.20.11-1_'ARCH'.deb

SDK/debian/packages/'ARCH'/xserver/xserver-xorg-legacy_1.20.11-1_'ARCH'.deb
```

xserver benötigt ein Startskript für Initialisierungen. In Debian-ähnlichen Systemen kann es kopiert werden; andernfalls anhand des Skripts selbst konfigurieren:

```text
SDK/debian/overlay/etc/X11
```

### 4.6 Anpassung prüfen

Anzeigebeschleunigung nutzt die opengles-Standardschnittstelle. Verwendet das System opengl, verlangt die Quelle eine Portierung auf opengles. Bei erfolgreicher Anpassung ändert sich beim Rendern oder Verschieben von Fenstern die GPU-Auslastung am entsprechenden Knoten. RK3588-Beispiel:

```text
cat /sys/devices/platform/fb000000.gpu/utilisation
```

Hinweis: GPU-Knoten unterscheiden sich je nach Plattform.

## 5. Video-En-/Dekodierung

### 5.1 Übersicht

Der Dienst besteht aus übergeordnetem Multimediaframework, mpp-Zwischenschicht und Hardwarecodec. GStreamer ist im Open-Source-Bereich verbreitet und dient nachfolgend als Beispiel. mpp verbindet allgemeine Drittanbietersoftware wie GStreamer mit Hardwarecodecs.

### 5.2 mpp

Installationspaket:

```text
SDK/debian/packages/'ARCH'/mpp/*.deb
```

Berechtigungen bestimmter Knoten anhand folgender Datei setzen:

```text
SDK/debian/overlay/etc/udev/rules.d/99-rockchip-permissions.rules
```

mpp-Konfiguration prüfen:

```text
# mpi_enc_test -w 1920 -h 1080 -t 7 -o /tmp/test.h264
# mpi_dec_test -w 1920 -h 1080 -t 7 -i /tmp/test.h264
```

### 5.3 Multimediasoftware

Es gibt viele Multimediaframeworks. Die Quelle empfiehlt, mpp-Schnittstellen direkt aus dem Player für die Codec-Anpassung aufzurufen. Siehe Rockchip_Developer_Guide_MPP_CN.pdf.

### 5.4 GStreamer

Für RK stehen vorgebaute gst-base-Pakete bereit:

```text
SDK/debian/packages/'ARCH'/gst-plugins-base1.0/*.deb
SDK/debian/packages/'ARCH'/gst-plugins-bad1.0/*.deb
SDK/debian/packages/'ARCH'/gst-plugins-good1.0/*.deb
```

RK unterstützt auch das allgemeine GStreamer-Framework. Zuerst offizielle GStreamer-Komponenten oder die obigen, zum System kompatiblen gst-base-Pakete installieren, danach das gst-rockchip-Plugin:

```text
SDK/debian/packages/'ARCH'/gst-rkmpp/*.deb
```

### 5.5 Anpassung prüfen

```text
sudo GST_DEBUG=2 gst-launch-1.0 playbin uri=file 'absolute video path' video-sink=“show sink” audio-sink=fakesink
```

Meldungen über mpp-Aufrufe zeigen laut Quelle die erfolgreiche Hardwaredekoder-Anbindung an.

## 6. Kameradienste

### 6.1 camera_engine_rkaiq

Installationspaket:

```text
SDK/debian/packages/'ARCH'/rkaiq/camera_engine_rkaiq_'ARCH'.deb
```

### 6.2 Anpassung prüfen

Mit v4l2 erfolgreichen Bildfang und korrektes Bild prüfen. Knoten, Formate und Auflösungen unterscheiden sich nach Kamera und Plattform; den Befehl entsprechend anpassen:

```text
v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-skip=3 --stream-to=/tmp /0.yuv --stream-count=1 --stream-poll
```

## 7. NPU-Dienste

### 7.1 rknn_runtime

rknn_runtime ist eine Userspace-Bibliothek; in das Zieldateisystem kopieren.

```text
SDK/external/rknpu2/Linux/librknn_api/'ARCH'/librknn_api.so

SDK/external/rknpu2/Linux/librknn_api/'ARCH'/librknnrt.so
```

### 7.2 rknn_server

rknn_server dient der Kommunikation mit der Platine bei rknntool2 auf dem PC. Wird ein Modell auf dem PC trainiert, nach rknn konvertiert und anschließend auf die Platine übertragen, ist dieser Dienst nicht nötig.

```text
SDK/external/rknpu2/Linux/rknn_server/'ARCH'/usr/bin/*
```

### 7.3 rknn-Demos

Siehe:

```text
SDK/external/rknpu2/examples
```

## 8. Wi-Fi-/BT-Dienste

Details in Rockchip_Developer_Guide_Linux_WIFI_BT_CN.pdf. Das SDK enthält vorgebaute Pakete:

```text
SDK\debian\packages\'ARCH'\rkwifibt\*.deb
```

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
