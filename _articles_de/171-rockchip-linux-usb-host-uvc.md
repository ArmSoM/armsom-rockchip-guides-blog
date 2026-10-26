---
title: "Rockchip Linux USB Host UVC: Diagnose, Treiber, Bandbreite und Latenz"
description: "Rockchip Linux USB Host UVC: Diagnose, Treiber, Bandbreite und Latenz — V1.0.0"
excerpt: "Rockchip Linux USB Host UVC: Diagnose, Treiber, Bandbreite und Latenz"
translation_key: "171-rockchip-linux-usb-host-uvc"
slug: "171-rockchip-linux-usb-host-uvc"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, UVC, Linux]
---

{% raw %}

Vollständiger technischer Text der chinesischen RK-PC-YF-493 V1.0.0. Die Geltungstabelle nennt alle Rockchip-Chips außer MCUs und Linux4.19 oder neuer; konkrete Diagnosemethoden basieren überwiegend auf Linux5.10. Keine pauschale Kernel- oder ArmSoM-Boardunterstützung. Board, SoC, SDK/BSP, Host-Controller, V4L2/libusb und Kamera prüfen. Keine Hardwarebefehle oder ArmSoM-Tests ausgeführt. Kein englisches PDF vorhanden; vollständige Übersetzungen verwenden die fünf chinesischen Originalbilder.

> Unklarheiten und Risiken: H256 bleibt als möglicher Codec-Schreibfehler erhalten. 95% oder mehr periodische Bandbreite weichen von der genannten USB2.0-80%-Grenze ab, können nichtperiodische Geräte stören und gelten nicht für xHCI; keine ungeprüfte allgemeine Lösung. Feste hohe CPU-/DDR-Frequenzen sowie abgeschaltetes IDLE/autosuspend erhöhen Verbrauch und Wärme; bind/unbind unterbricht USB-Dienste. Zuerst sichern sowie SDK, Wiederherstellung und Bauteilgrenzen prüfen.

> uvc-data.py greift im angenommenen Analysatorformat auf line[0]/line[1] zu, ohne leere/kurze Zeilen oder Hexadezimalsyntax zu prüfen. Zeilenübergreifender eof-Zustand und Speicherung des letzten Bilds müssen mit echten Daten geprüft werden. Der Originalalgorithmus bleibt erhalten; keine Extraktion ausgeführt oder validiert.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. UVC-Kommunikationsablauf

Abbildung 1 zeigt die UVC-Kommunikation unter Linux: links UVC-Module und Kernelpfade des USB Device, rechts diejenigen des USB Host. Diese Anleitung behandelt die Diagnose des Host-UVC-Treibers; die Methoden beziehen sich überwiegend auf Rockchip Linux-5.10, gelten nicht zwingend für alle Kernel und dienen nicht der Diagnose von UVC-Anwendungsproblemen. Host-Anwendungen können über V4L2 den UVC-Treiber oder über libusb den allgemeinen USB-Treiber Devio ansprechen. Rockchip unterstützt beide Wege; die Anwendung entscheidet.

![Abbildung aus dem chinesischen Original](/docs/rockchip-linux-usb-host-uvc/assets/cn-p004-figure-01.png)

Abbildung 1. Linux-UVC-Kommunikationsablauf

## 2. UVC-Diagnosewerkzeuge

### 2.1 USB-Protokollanalysator

Ein USB-Protokollanalysator zeichnet die Buskommunikation in Echtzeit für Paketmitschnitt und Protokollanalyse auf. Abbildung 2 zeigt den üblichen USB-2.0-Anschluss: Der Analysator wird zwischen Device und Host eingeschleift; auf dem PC wird die passende Analysesoftware installiert. Dies ist die direkteste und effektivste Methode, die Fehlerseite Device oder Host zu bestimmen.

![Abbildung aus dem chinesischen Original](/docs/rockchip-linux-usb-host-uvc/assets/cn-p005-figure-01.png)

Abbildung 2. Anschluss des USB-Analysators. Er eignet sich für folgende typische UVC-Probleme:

1. UVC-Vorschau lässt sich nicht starten.

2. Verzögerte UVC-Vorschau.

3. Eingefrorene UVC-Vorschau.

4. Bildratenstatistik und Analyse der Bilddaten.

5. Fehler beim Laden des UVC-Treibers. Der Analysator eignet sich nicht für folgende Probleme:

1. USB-Signalqualität.

2. Unerwartete UVC-Trennung.

3. EMI-Fehler des USB-Controllers während UVC-Kommunikation. Zur Untersuchung von Signalen, Trennungen und EMI dient ein breitbandiges Oszilloskop: USB-Augendiagramm, High-Speed-Handshake und VBUS-Spannungseinbrüche messen.

### 2.2 usbmon-Mitschnitt und Analyse

usbmon (USB monitor) ist das Linux-Kernelwerkzeug zum Mitschneiden zwischen USB Core und Klassentreibern wie UVC sowie zwischen USB Core und Host-Controllertreiber. Mit vusb-analyzer oder Wireshark lassen sich die Pakete analysieren, die UVC-Verarbeitung im Kernel nachvollziehen und UVC-/Controllertreiberprobleme eingrenzen. Das Modul liegt unter drivers/usb/mon/. Aktivierung:

1. CONFIG_USB_MON im Kernel aktivieren.

2. debugfs einhängen: mount -t debugfs none_debugs /sys/kernel/debug. Die Meldung busy bedeutet, dass debugfs bereits eingehängt ist. Die meisten Rockchip-SDK-Ausgaben unterstützen usbmon standardmäßig; prüfen mit ls /sys/kernel/debug/usb/usbmon/. vusb-analyzer: https://vusb-analyzer.sourceforge.net/download.html. Ubuntu-Installation: sudo apt-get install vusb-analyzer. Es folgt ein UVC-Beispiel an USB2 HOST0 des RK3588 EVB1.

1. Die von usbmon erkannten USB-Busnummern anzeigen. 1/2/3 usw. bezeichnen die Busse der Plattform; jedes USB-Gerät gehört zu einem Bus. 0 erfasst alle Busse. s/t/u kennzeichnen das Speicherformat; üblicherweise wird u verwendet.

```text
console:/sys/kernel/debug/usb/usbmon # ls
0s  1s  1u  2t  3s  3u  4t  5s  5u  6t
0u  1t  2s  2u  3t  4s  4u  5t  6s  6u
```

2. Den Bus des zu überwachenden Geräts mit lsusb ermitteln; anhand Hersteller- und Produkt-ID unterscheiden.

```text
console:/sys/kernel/debug/usb/usbmon # lsusb
Bus 005 Device 001: ID 1d6b:0002
Bus 003 Device 001: ID 1d6b:0001
Bus 002 Device 005: ID 046d:0823
Bus 001 Device 001: ID 1d6b:0002
Bus 006 Device 001: ID 1d6b:0003
Bus 004 Device 001: ID 1d6b:0001
Bus 002 Device 001: ID 1d6b:0002
```

Bus 002 bezeichnet Bus 2. ID 046d:0823 ist die Hersteller-/Produkt-ID des überwachten Geräts; es verwendet Bus 2.

3. Kommunikation mit usbmon erfassen: cat /sys/kernel/debug/usb/usbmon/2u &gt; /data/usbmon.mon

4. Pakete analysieren: vusb-analyzer usbmon.mon

### 2.3 v4l2-ctl

v4l2-ctl steuert Linux-V4L2-Videogeräte (/dev/video*), etwa zum Abfragen unterstützter Formate oder Aufnehmen mit vorgegebener Auflösung und Format. Der Linux-UVC-Treiber basiert auf V4L2. Wird die UVC-Anwendung als Ursache vermutet, lässt sich ihr Einfluss mit v4l2-ctl ausschließen.

1. v4l2-ctl --list-devices — alle Geräte einschließlich sämtlicher über V4L2 registrierter Videogeräte auflisten.

Beispiel:

```text
console:/ # v4l2-ctl --list-devices
UVC Camera (046d:0823) (usb-fc800000.usb-1):
        /dev/video21
        /dev/video22
```

Eine USB-Kamera entspricht zwei Geräten: Bild-/Videoaufnahme und Metadatenaufnahme.

2. v4l2-ctl --list-formats-ext --device path/to/video_device — unterstützte Vorschauformate des angegebenen Geräts auflisten. Beispiel:

```text
console:/ # v4l2-ctl --list-formats-ext --device /dev/video21
ioctl: VIDIOC_ENUM_FMT
        Index       : 0
        Type        : Video Capture
        Pixel Format: 'YUYV'
        Name        : YUYV 4:2:2
                Size: Discrete 640x480
                        Interval: Discrete 0.033s (30.000 fps)
                        Interval: Discrete 0.042s (24.000 fps)
                        Interval: Discrete 0.050s (20.000 fps)
                        Interval: Discrete 0.067s (15.000 fps)
                        Interval: Discrete 0.100s (10.000 fps)
                        Interval: Discrete 0.133s (7.500 fps)
                        Interval: Discrete 0.200s (5.000 fps)
         ......
```

3. v4l2-ctl --all --device path/to/video_device — alle Informationen des angegebenen Geräts abrufen. Beispiel:

```text
console:/ # v4l2-ctl --all --device /dev/video21
Driver Info:
        Driver name      : uvcvideo
        Card type        : UVC Camera (046d:0823)
        Bus info         : usb-fc800000.usb-1
        Driver version   : 5.10.198
        Capabilities     : 0x84a00001
                Video Capture
                Metadata Capture
                Streaming
                Extended Pix Format
                Device Capabilities
        Device Caps      : 0x04200001
                Video Capture
                Streaming
                Extended Pix Format
        ......
```

4. v4l2-ctl --device path/to/video_device --set-fmt-video=width=width,height=height,pixelformat=MJPG --stream-mmap --stream-to=path/to/output.jpg --stream-count=1 — Bild mit bestimmter Auflösung und Format aufnehmen. Beispiel: ein MJPG-Bild mit 1920x1080 von video21 unter /sdcard/DCIM/ speichern.

```text
v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap --stream-to=/sdcard/DCIM/output_1920.jpg --stream-count=1
```

5. v4l2-ctl --device path/to/video_device --set-fmt-video=width=width,height=height,pixelformat=format --stream-mmap --stream-to=path/to/output --stream-count=number_of_frames_to_capture — Stream mit bestimmter Auflösung erfassen. Beispiel 1: 100 MJPG-Bilder mit 1920x1080 von video21 unter /sdcard/DCIM/ speichern.

```text
v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap --stream-to=/sdcard/DCIM/output.mjpg --stream-count=100
```

Beispiel 2: kontinuierlich MJPG mit 1920x1080 von video21 erfassen.

```text
v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap
```

## 3. Kernel-UVC-Diagnoseschnittstellen

### 3.1 UVC-Treiberdiagnose

Der UVC-Treiber liegt unter drivers/media/usb/uvc. Seine system-module-Schnittstelle aktiviert Trace dynamisch; standardmäßig ist Trace aus: /sys/module/uvcvideo/parameters/trace. Einschalten: echo 0xffff &gt; /sys/module/uvcvideo/parameters/trace. Meldungen haben KERN_DEBUG und sind mit dmesg sichtbar. Für Ausgabe am seriellen Terminal printk anpassen: echo 8 &gt; /proc/sys/kernel/printk.

Dynamisch abschalten: echo 0 &gt; /sys/module/uvcvideo/parameters/trace. Es folgt der Trace beim Start der UVC-Vorschau an RK3588 USB2 HOST0:

```text
[   60.780597][  T477] uvcvideo: uvc_v4l2_open
[   60.843298][  T477] uvcvideo: Resuming interface 2
[   60.843318][  T477] uvcvideo: Resuming interface 3
[   60.852317][  T477] uvcvideo: uvc_v4l2_release
[   60.855127][  T477] uvcvideo: uvc_v4l2_open
[   60.877415][  T477] uvcvideo: Trying format 0x47504a4d (MJPG): 2592x1944.
[   60.877525][  T477] uvcvideo: Using default frame interval 100000.0 us (10.0
fps).
[   60.910575][  T477] uvcvideo: Device requested 3060 B/frame bandwidth.
[   60.910622][  T477] uvcvideo: Selecting alternate setting 11 (3060 B/frame
bandwidth).
[   60.913504][  T477] uvcvideo: Allocated 5 URB buffers of 32x3060 bytes each.
[   60.913836][  T477] uvcvideo: uvc_v4l2_poll
[   62.010310][    C0] uvcvideo: Frame complete (EOF found).
[   62.010438][    C0] uvcvideo: frame 1 stats: 1111/763/1876 packets,
1/1111/1876 pts (early initial), 1875/1876 scr, last pts/stc/sof
223854994/228661160/514
```

### 3.2 V4L2-Diagnose

Der Linux-UVC-Treiber verwendet V4L2 für queue buf und dequeue buf mit der Anwendung. V4L2 stellt Tracepoints [1] des Kernel-Tracing-Frameworks bereit, um queue buf, dequeue buf und buf done zu verfolgen. Folgende Trace-Konfigurationen im Kernel sind erforderlich:

```text
Kernel hacking  --->
    [*] Tracers  --->
        [*]   Trace process context switches and events
        [*]   Enable uprobes-based dynamic events
        [*]   Trace gpio events：
```

V4L2 unterstützt folgende Trace Events:

```text
/sys/kernel/debug/tracing/events/vb2# ls
enable  filter  vb2_buf_done  vb2_buf_queue  vb2_dqbuf  vb2_qbuf
/sys/kernel/debug/tracing/events/v4l2]# ls
enable  v4l2_dqbuf  vb2_v4l2_buf_done   vb2_v4l2_dqbuf
filter  v4l2_qbuf   vb2_v4l2_buf_queue  vb2_v4l2_qbuf
```

Ausführliche Nutzung: /sys/kernel/debug/tracing/README.

### 3.3 Dynamische USB-Controller-Neuinitialisierung

/sys/bus/platform/drivers/[usb_controller_name]/bind, unbind. [usb_controller_name] durch den USB-Controllernamen des Chips ersetzen. Bei gestörter UVC-Übertragung ohne automatische Wiederherstellung kann eine manuelle Controller-Neuinitialisierung prüfen, ob der Controller beteiligt ist. Beispiel RK3588 EVB1:

```text
/* USB2 HOST0/1 OHCI 控制器驱动 */
console:/sys/bus/platform/drivers/ohci-platform # ls
bind  fc840000.usb  fc8c0000.usb  uevent  unbind

/* USB2 HOST0/1 EHCI 控制器驱动 */
console:/sys/bus/platform/drivers/ehci-platform # ls
bind  fc800000.usb  fc880000.usb  uevent  unbind

/* USB3 OTG1_HOST 控制器驱动 */
console:/sys/bus/platform/drivers/xhci-hcd # ls
bind  uevent  unbind  xhci-hcd.8.auto

/* USB3 OTG0/1 控制器驱动 */
console:/sys/bus/platform/drivers/dwc3 # ls
bind  fc000000.usb  fc400000.usb  uevent  unbind

执⾏如下命令，可以重新初始化 USB2 HOST0 接⼝对应的 OHCI/EHCI 控制器
echo fc840000.usb > /sys/bus/platform/drivers/ohci-platform/unbind
echo fc800000.usb > /sys/bus/platform/drivers/ehci-platform/unbind
echo fc800000.usb > /sys/bus/platform/drivers/ehci-platform/bind
echo fc840000.usb > /sys/bus/platform/drivers/ohci-platform/bind
```

## 4. UVC-Diagnoseverfahren

### 4.1 CPU-Affinität der USB-Interrupts

Zweck: Bildfehler und instabile UVC-Bildraten unter hoher Last durch langsame USB-Interruptbearbeitung untersuchen und beheben. Linux bietet /proc/irq/[irq_num]/smp_affinity_list für die CPU-Affinität eines Interrupts; die Datei enthält eine dezimale CPU-Liste. Die Nummerierung beginnt mit 0, etwa CPU0 und CPU1. Beispiel: USB OTG0 des RK3588 EVB1 an CPU1 binden:

```text
console:/ # cat /proc/interrupts | grep dwc
153:         77          0          0          0          0          0          0
         0     GICv3 252 Level     dwc3
console:/ # echo 1 > /proc/irq/153/smp_affinity_list
```

### 4.2 UVC autosuspend deaktivieren

Zweck: autosuspend-Kompatibilitätsprobleme einzelner UVC-Geräte auf Rockchip untersuchen. Der folgende Befehl deaktiviert USB autosuspend dynamisch zur ersten Eingrenzung.

```text
for i in $(find /sys -name control | grep usb);
do echo on > $i;
echo "echo on > $i";
done;
```

Behebt das Abschalten das Problem eines bestimmten Geräts, deutet dies auf autosuspend-Inkompatibilität auf Rockchip hin. Das Gerät kann im USB-Treiber auf die autosuspend-Sperrliste gesetzt werden. Linux-5.10-Beispiel für VID,PID=0x05a3,0x9230:

```text
diff --git a/drivers/usb/core/quirks.c b/drivers/usb/core/quirks.c
index 76ac5d6555ae..d799e93b9a0d 100644
--- a/drivers/usb/core/quirks.c
+++ b/drivers/usb/core/quirks.c
@@ -322,6 +322,9 @@ static const struct usb_device_id usb_quirk_list[] = {
        /* Alcor Micro Corp. Hub */
        { USB_DEVICE(0x058f, 0x9254), .driver_info = USB_QUIRK_RESET_RESUME },

+       /* HD Camera Manufacturer */
+       { USB_DEVICE(0x05a3, 0x9230), .driver_info = USB_QUIRK_AUTO_SUSPEND },
```

Tabelle 1 enthält bekannte UVC-Geräte mit autosuspend-Problemen. Tabelle 1. USB Camera auto suspend blacklist.

| VID | PID | Hersteller |
| --- | --- | --- |
| 0x05a3 | 0x9230 | Microdia |
| 0x05a3 | 0x9320 | Microdia |
| 0x0c45 | 0x6321 | Sonix |
| 0x0c45 | 0x636a | Sonix |
| 0x0c45 | 0x636b | Sonix |
| 0x0c45 | 0x64ab | Sonix |
| 0x0c45 | 0x64ac | Sonix |
| 0x0e8d | 0x7668 | unknown |
| 0x2bc5 | 0x051f | MediaTek |
| 0x1e10 | 0x4000 | Point Grey Research |
| 0x15aa | 0x1555 | Gearway Electronics |

### 4.3 CPU IDLE deaktivieren

Zweck: Bildfehler und instabile Bildraten durch langen CPU-IDLE-Austritt und dadurch verzögerte USB-Interruptbearbeitung analysieren. Beispiel RK3588 EVB1:

```text
cpunum=$(cat /proc/cpuinfo | grep processor | wc -l)
for i in `seq 0 $(($cpunum-1))`
do
echo 1 > /sys/devices/system/cpu/cpu$i/cpuidle/state0/disable
echo 1 > /sys/devices/system/cpu/cpu$i/cpuidle/state1/disable
done
```

Die state*-Knoten unterscheiden sich je nach Plattform; RK3399 bietet beispielsweise state0/1/2.

### 4.4 Feste hohe CPU-Frequenz

Zweck: instabile UVC-Bildraten bei hoher Last untersuchen und beheben. Die CPU-Regelstrategie performance hält die CPU für maximale Leistung auf der höchsten Frequenz.

```text
cpunum=$(cat /proc/cpuinfo | grep processor | wc -l)
for i in `seq 0 $(($cpunum-1))`
do
echo performance > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor
done
```

### 4.5 Feste hohe DDR-Frequenz

Zweck: Vorschaufehler, Bildstörungen oder instabile Bildraten durch dynamische DDR-Frequenzwechsel untersuchen. Die meisten Rockchip-Plattformen unterstützen diese zur Energieeinsparung. Zwei Fälle können betroffen sein: Niedrige DDR-Frequenz beim Vorschaustart kann sporadisch den Start verhindern; während der Vorschau kann sie instabile Bildraten oder gestörte komprimierte Bilder verursachen. Zwei Verfahren setzen DDR auf die höchste Frequenz. Verfahren 1 dient vor allem der Diagnose und hält DDR unabhängig von UVC dauerhaft auf Maximum. Verfahren 2 eignet sich für Serienprodukte: Maximum nur während UVC aktiv ist, sonst lastabhängige Frequenz. Verfahren 1: Einstellung per Kommandozeile am RK3588.

```text
console:/ # cd /sys/class/devfreq/dmc
console:/sys/class/devfreq/dmc # cat max_freq
2112000000
console:/sys/class/devfreq/dmc # echo userspace > governor
console:/sys/class/devfreq/dmc # echo 2112000000 > userspace/set_freq
```

Verfahren 2: UVC-Treiber für hohe DDR-Frequenz anpassen [empfohlen]. Linux-4.19-Beispiel:

```text
From 970e4749125d685dc03ea32e3ae77e6f0ab7cff7 Mon Sep 17 00:00:00 2001
From: "william.wu" <william.wu@rock-chips.com>
Date: Sat, 11 Nov 2023 15:41:10 +0800
Subject: [PATCH] media: uvcvideo: set system status to performance when stream
 on

For rockchip platforms, set performance frequency for the
memory controller when uvc stream on, and clear it after
uvc stream off. It can improve uvc streaming stability.

Signed-off-by: william.wu <william.wu@rock-chips.com>
Change-Id: I1dc0cf10c552bba2c3a0f8a1bb37d90f546eb4a3
---
 drivers/media/usb/uvc/uvc_video.c | 6 ++++++
 1 file changed, 6 insertions(+)

diff --git a/drivers/media/usb/uvc/uvc_video.c b/drivers/media/usb/uvc/uvc_video.c
index ef3832b03709..d2158c94ae47 100644
--- a/drivers/media/usb/uvc/uvc_video.c
+++ b/drivers/media/usb/uvc/uvc_video.c
@@ -25,6 +25,8 @@
 #include <media/v4l2-common.h>
 #include "uvcvideo.h"
+#include <dt-bindings/soc/rockchip-system-status.h>
+#include <soc/rockchip/rockchip-system-status.h>

 /* ------------------------------------------------------------------------
  * UVC Controls
@@ -2149,6 +2151,7 @@ int uvc_video_enable(struct uvc_streaming *stream, int
enable)
        }

        uvc_video_clock_cleanup(stream);
+       rockchip_clear_system_status(SYS_STATUS_PERFORMANCE);
        return 0;
    }

@@ -2161,6 +2164,8 @@ int uvc_video_enable(struct uvc_streaming *stream, int
enable)
    if (ret < 0)
        goto error_commit;

+   rockchip_set_system_status(SYS_STATUS_PERFORMANCE);
+
    ret = uvc_init_video(stream, GFP_KERNEL);
    if (ret < 0)
        goto error_video;
@@ -2168,6 +2173,7 @@ int uvc_video_enable(struct uvc_streaming *stream, int
enable)
    return 0;

 error_video:
+   rockchip_clear_system_status(SYS_STATUS_PERFORMANCE);
    usb_set_interface(stream->dev->udev, stream->intfnum, 0);
 error_commit:
    uvc_video_clock_cleanup(stream);
--
2.34.1
```

Linux-5.10-Beispiel:

```text
From ab0546fdd01a8a8df0f15d0c648fa73aba76d173 Mon Sep 17 00:00:00 2001
From: William Wu <william.wu@rock-chips.com>
Date: Wed, 8 Nov 2023 09:49:48 +0800
Subject: [PATCH] media: uvcvideo: set system status to performance when stream
 on

For rockchip platforms, set performance frequency for the
memory controller when uvc stream on, and clear it after
uvc stream off. It can improve uvc streaming stability.

Signed-off-by: William Wu <william.wu@rock-chips.com>
Change-Id: I1dc0cf10c552bba2c3a0f8a1bb37d90f546eb4a3
---
 drivers/media/usb/uvc/uvc_video.c | 6 ++++++
 1 file changed, 6 insertions(+)
diff --git a/drivers/media/usb/uvc/uvc_video.c b/drivers/media/usb/uvc/uvc_video.c
index 03dfe96bceba..79ffe93b19ae 100644
--- a/drivers/media/usb/uvc/uvc_video.c
+++ b/drivers/media/usb/uvc/uvc_video.c
@@ -20,6 +20,8 @@
 #include <media/v4l2-common.h>

 #include "uvcvideo.h"
+#include <dt-bindings/soc/rockchip-system-status.h>
+#include <soc/rockchip/rockchip-system-status.h>

 /* ------------------------------------------------------------------------
  * UVC Controls
@@ -2139,6 +2141,8 @@ int uvc_video_start_streaming(struct uvc_streaming *stream)
    if (ret < 0)
        goto error_commit;

+   rockchip_set_system_status(SYS_STATUS_PERFORMANCE);
+
    ret = uvc_video_start_transfer(stream, GFP_KERNEL);
    if (ret < 0)
        goto error_video;
@@ -2146,6 +2150,7 @@ int uvc_video_start_streaming(struct uvc_streaming *stream)
    return 0;

 error_video:
+   rockchip_clear_system_status(SYS_STATUS_PERFORMANCE);
    usb_set_interface(stream->dev->udev, stream->intfnum, 0);
 error_commit:
    uvc_video_clock_cleanup(stream);
@@ -2176,4 +2181,5 @@ void uvc_video_stop_streaming(struct uvc_streaming *stream)
    }

    uvc_video_clock_cleanup(stream);
+   rockchip_clear_system_status(SYS_STATUS_PERFORMANCE);
 }
--
2.34.1
```

### 4.6 UVC-Bilder dekodieren

Zweck: Bildstörungen bei Vorschau oder Aufnahme analysieren und zwischen UVC Device und Host eingrenzen. Beispiel: MJPG-Bilder einer Logitech UVC Camera (idVendor=046d, idProduct=0823) mit High-Bandwidth-Isochronübertragung. Datenaufnahme und Bildextraktion:

1. USB-Kommunikation der MJPG-Vorschau mit einem Ellisys-USB2.0-Analysator aufzeichnen.

2. Gemäß Abbildung 3 als Text exportieren und speichern: File -&gt; Export -&gt; Transactions data -&gt; Text.

3. UVC-txt-Datei im Editor öffnen und den Bildheader gemäß Format of the Payload Header der UVC-Spezifikation [2] suchen. In Abbildung 4 beträgt die Headerlänge 0x0C, die Headerinformation 0x8C.

4. Die Headerinformation an das Python-Skript uvc-data.py übergeben, um die txt-Datei zu analysieren; das Skript speichert UVC-Bilder automatisch als .jpg.

![Abbildung aus dem chinesischen Original](/docs/rockchip-linux-usb-host-uvc/assets/cn-p016-figure-01.png)

Abbildung 3. UVC-Analysatordaten

![Abbildung aus dem chinesischen Original](/docs/rockchip-linux-usb-host-uvc/assets/cn-p016-figure-02.png)

Abbildung 4. UVC-Textdaten. Python-Skript uvc-data.py zur Bildextraktion:

```text
# -*- coding: utf-8 -*-
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--file', '-f', type=str, required=True, default='',
help='The txt format file of uvc data')
parser.add_argument('--header_len', '-l', type=str, required=True, default='',
help='Length of uvc header in bytes')
parser.add_argument('--header_info','-i', type=str, required=True, default='',
help='Information of uvc header')
parser.add_argument('--count', '-n', type=int, default=10, help='The count of images to saved')
args = parser.parse_args()

def get_photo(cnt = 0):
    src = open(args.file, 'r')
    uvc_header_len = int(args.header_len, 16)
    uvc_header_info = int(args.header_info, 16)
    uvc_header_even_frame = uvc_header_info & 0xFC
    uvc_header_even_frame_eof = uvc_header_even_frame | 0x02
    uvc_header_odd_frame = (uvc_header_info & 0xFC) | 0x01
    uvc_header_odd_frame_eof = (uvc_header_odd_frame | 0x02)
    pic = []
    num = 0
    eof = 0
    uvc_first_frame = 0
    uvc_payload_offset = 0

    print('UVC Header Length:        ', hex(uvc_header_len), 'Bytes')
    print('UVC Header EVEN Frame:    ', hex(uvc_header_even_frame))
    print('UVC Header EVEN Frame EOF:', hex(uvc_header_even_frame_eof))
    print('UVC Header ODD Frame:     ', hex(uvc_header_odd_frame))
    print('UVC Header ODD Frame EOF: ', hex(uvc_header_odd_frame_eof))

    for line in src:
        line = line.split(' ')
        data0 = int(line[0], 16)
        data1 = int(line[1], 16)

        if ((data0 == uvc_header_len) and
            ((data1 == uvc_header_even_frame) or (data1 ==
uvc_header_odd_frame))):
            uvc_payload_offset = uvc_header_len
            uvc_first_frame = 1
        elif ((data0 == uvc_header_len) and
            ((data1 == uvc_header_even_frame_eof) or
            (data1 == uvc_header_odd_frame_eof) or
            (data1 == ((uvc_header_even_frame_eof & 0x0F) | 0x10)) or
            (data1 == ((uvc_header_odd_frame_eof & 0x0F) | 0x10)))):
            uvc_payload_offset = uvc_header_len
            uvc_first_frame = 0
            eof = 1
        else:
            uvc_payload_offset = 0
            uvc_first_frame = 0
            eof = 0

        if (eof == 1 and uvc_first_frame == 1):
            path = 'photo_' + str(num) + '.jpg'
            print(path + ' Saved ' + str(len(pic)) + 'Bytes')
            dst = open(path, 'wb+')
            dst.write(bytes.fromhex(''.join(pic)))
            dst.close()
            num += 1
            pic = []
            eof = 0
            if (cnt != 0 and cnt == num):
                break
        if (len(line) > uvc_payload_offset):
            for i in range(uvc_payload_offset, len(line)):
                pic.append(line[i])

    src.close()

get_photo(args.count)
```

Anwendungsbeispiel:

```text
# 查看 uvc-data.py 使⽤⽅法
# -f: 待解析的 uvc 数据⽂本⽂件，必要参数；
# -l: 待解析的  帧头⻓度，必要参数；
# -i: 待解析的 uvc 帧头信息，必要参数；
# -n：待解析和保存的 uvc 帧图像数量；
python uvc-data.py -h
usage: uvc-data.py [-h] --file FILE --header_len HEADER_LEN --header_info
HEADER_INFO [--count COUNT]

options:
  -h, --help            show this help message and exit
  --file FILE, -f FILE  The txt format file of uvc data
  --header_len HEADER_LEN, -l HEADER_LEN
                        Length of uvc header in bytes
  --header_info HEADER_INFO, -i HEADER_INFO
                        Information of uvc header
  --count COUNT, -n COUNT
                        The count of images to saved
# 解析 uvcdata.txt，uvc 帧头⻓度为 0x0c，uvc 帧头信息为 0x8c，保存 5 张图象
python uvc-data.py -f uvcdata.txt -l 0c -i 8c -n 5
UVC Header Length:         0xc Bytes
UVC Header EVEN Frame:     0x8c
UVC Header EVEN Frame EOF: 0x8e
UVC Header ODD Frame:      0x8d
UVC Header ODD Frame EOF:  0x8f
photo_0.jpg Saved 516573Bytes
photo_1.jpg Saved 827193Bytes
photo_2.jpg Saved 827585Bytes
photo_3.jpg Saved 3120193Bytes
photo_4.jpg Saved 188340Bytes
```

### 4.7 UVC-Treiber optimieren

1. Anzahl der UVC-URBs erhöhen. Zweck: höhere Toleranz gegenüber USB-Interruptlatenz. Folge: URBs puffern Bilddaten und erhöhen die Vorschauverzögerung. Linux-4.19-Beispiel:

```text
diff --git a/drivers/media/usb/uvc/uvcvideo.h b/drivers/media/usb/uvc/uvcvideo.h
index 96632cc58d77..3761946af110 100644
--- a/drivers/media/usb/uvc/uvcvideo.h
+++ b/drivers/media/usb/uvc/uvcvideo.h
@@ -173,7 +173,7 @@
 #define DRIVER_VERSION         "1.1.1"

 /* Number of isochronous URBs. */
-#define UVC_URBS               5
+#define UVC_URBS               32
 /* Maximum number of packets per URB. */
 #define UVC_MAX_PACKETS                32
 /* Maximum status buffer size in bytes of interrupt URB. */
```

2. UVC-DMA-Pufferallokation ändern: usb_alloc_coherent durch kmalloc ersetzen, um Lesen und Auswerten der Pufferdaten zu beschleunigen. Folge: Der USB-Treiber muss die Cache-Kohärenz des DMA-Puffers sicherstellen. Rockchip-USB-Treiber unterstützen dies standardmäßig; zusätzliche Änderungen sind nicht nötig.

```text
diff --git a/drivers/media/usb/uvc/uvc_video.c b/drivers/media/usb/uvc/uvc_video.c
index d2158c94ae47..fff3c710bc97 100644
--- a/drivers/media/usb/uvc/uvc_video.c
+++ b/drivers/media/usb/uvc/uvc_video.c
@@ -1604,7 +1604,7 @@ static void uvc_free_urb_buffers(struct uvc_streaming
*stream)
                struct uvc_urb *uvc_urb = &stream->uvc_urb[i];

                if (uvc_urb->buffer) {
-#ifndef CONFIG_DMA_NONCOHERENT
+#if 0
                        usb_free_coherent(stream->dev->udev, stream->urb_size,
                                        uvc_urb->buffer, uvc_urb->dma);
 #else
@@ -1651,7 +1651,7 @@ static int uvc_alloc_urb_buffers(struct uvc_streaming
*stream,
                        struct uvc_urb *uvc_urb = &stream->uvc_urb[i];

                        stream->urb_size = psize * npackets;
-#ifndef CONFIG_DMA_NONCOHERENT
+#if 0
                        uvc_urb->buffer = usb_alloc_coherent(
                                stream->dev->udev, stream->urb_size,
                                gfp_flags | __GFP_NOWARN, &uvc_urb->dma);
@@ -1768,7 +1768,7 @@ static int uvc_init_video_isoc(struct uvc_streaming
*stream,
                urb->context = uvc_urb;
                urb->pipe = usb_rcvisocpipe(stream->dev->udev,
                                ep->desc.bEndpointAddress);
-#ifndef CONFIG_DMA_NONCOHERENT
+#if 0
                urb->transfer_flags = URB_ISO_ASAP | URB_NO_TRANSFER_DMA_MAP;
                urb->transfer_dma = uvc_urb->dma;
 #else
@@ -1834,7 +1834,7 @@ static int uvc_init_video_bulk(struct uvc_streaming
*stream,

                usb_fill_bulk_urb(urb, stream->dev->udev, pipe, uvc_urb->buffer,
                                  size, uvc_video_complete, uvc_urb);
-#ifndef CONFIG_DMA_NONCOHERENT
+#if 0
                urb->transfer_flags = URB_NO_TRANSFER_DMA_MAP;
                urb->transfer_dma = uvc_urb->dma;
 #endif
```

## 5. Häufige UVC-Probleme

### 5.1 Vorschau startet nicht

Fehler beim Start der Vorschau lassen sich meist fünf Fällen zuordnen. Fall 1: High-Speed-Handshake schlägt fehl. Die meisten UVC-Geräte arbeiten nur mit high-speed oder super-speed. Eine signalbedingte Rückstufung auf full-speed verhindert normale Vorschau. USB-Enumeration am seriellen Port prüfen: Eine full-speed-Meldung wie unten deutet auf fehlgeschlagenen High-Speed-Handshake hin.

```text
usb 3: new full-speed USB device number 3 using ohci-platform
usb 3: not running at top speed; connect to a high speed hub
```

Abhilfe: Die Handshake-Signale mit einem Oszilloskop prüfen, die Ursache bestimmen und Hardwareoptimierung mit PHY-Register-Tuning kombinieren. Fall 2: Fehler der Bandbreitenverhandlung über UVC Probe Control/Commit Control. Vor der Vorschau stimmen Host und Device die Parameter in vier Schritten gemäß Abbildung 5 ab:

1. Host sendet die gewünschten Einstellungen an das Gerät (PROBE).

2. Das Gerät passt sie an seine Möglichkeiten an und meldet sie zurück (PROBE).

3. Sind die Einstellungen geeignet, bestätigt der Host sie (COMMIT).

4. Das Gerät setzt Format, Auflösung, Bandbreite und weitere Parameter gemäß Host-COMMIT.

![Abbildung aus dem chinesischen Original](/docs/rockchip-linux-usb-host-uvc/assets/cn-p021-figure-01.png)

Abbildung 5. UVC-Parameterverhandlung. Abhilfe: Die gesamte Enumeration und den Vorschaustart mit USB-Analysator oder usbmon erfassen und die Verhandlung prüfen. Bei bestätigtem Probe-/Commit-Fehler die entsprechende Treiber- oder Anwendungslogik korrigieren.

Fall 3: fehlerhafter Host. Nach USB 2.0 initiiert der Host sämtliche Transaktionen; das Device kann nicht selbstständig Daten senden. Führt der Host beim Start kein SetInterface streaming on aus oder sendet danach keine IN-Pakete an den Streaming-Endpunkt, liefert das Device keine Bilder. Abhilfe: vollständiger Transaktionsmitschnitt mit dem Analysator. Ist keiner verfügbar, Host-Verhalten gemäß usbmon-Abschnitt beobachten.

Fall 4: autosuspend-Inkompatibilität. Rockchip UVC Host aktiviert autosuspend zur Energieeinsparung, manche Geräte sind jedoch inkompatibel und verursachen Vorschaufehler. Siehe Abschnitt zum Abschalten von UVC autosuspend.

Fall 5: DDR-Frequenzwechsel stören den Stream. Niedrige DDR-Frequenz erhöht die Buslatenz des USB-Controllers; überschreitet sie die Toleranz isochroner UVC-Übertragung, kann die Vorschau fehlschlagen. Siehe Abschnitt zur festen hohen DDR-Frequenz.

### 5.2 Instabile Vorschau-Bildrate

Die Bildrate hängt unter anderem von USB-Interruptreaktion, USB-Buslatenz und der Bildanalysezeit im UVC-Treiber ab. Bei hoher Last treten Schwankungen stärker hervor. Abhilfe: gemäß den jeweiligen Abschnitten USB-Interrupts an CPUs binden, CPU IDLE abschalten sowie hohe CPU- und DDR-Frequenzen festlegen, um Interruptreaktion, Buslatenz und CPU-Leistung zu verbessern.

### 5.3 Gestörte Vorschaubilder

Hauptursache von Bildstörungen: Die meisten UVC-Geräte übertragen isochron über USB — zeitnah, aber ohne Zuverlässigkeitsgarantie; fehlerhafte oder verlorene Daten werden nicht erneut gesendet. Ein USB-Analysator beschleunigt die Eingrenzung. Es gibt unkomprimierte Formate (YUV) und komprimierte Formate (MJPG/H264/H256, Originalschreibweise); ihre Fehlerursachen unterscheiden sich. Fall 1: gestörte unkomprimierte Bilder. Der Treiber prüft die vollständige Bildgröße und verwirft das Bild bei Abweichung vom Sollwert, um Bildfehler durch physische Übertragungsfehler oder verlorene Frames zu vermeiden. Daher können Signalprobleme und verspätete Isochronbearbeitung des Controllertreibers zunächst ausgeschlossen werden. Analyseschritte:

1. Unkomprimierte Vorschau kontinuierlich mit dem USB-Analysator erfassen und beobachten. Bei Bildstörungen den Mitschnitt umgehend stoppen, speichern und die Bilder gemäß dem Abschnitt zur Bildextraktion mit dem Python-Skript auswerten.

2. Sind Mitschnitt und extrahierte Bilder korrekt, liegt die Ursache beim Host. Andernfalls sind bereits die UVC-Quelldaten fehlerhaft; das Device untersuchen.

3. Beim Host insbesondere die Cache-Kohärenz des USB-Controller-DMA-Puffers prüfen.

4. Mit v4l2-ctl streamen, um den Einfluss der Anwendung zu prüfen. Fall 2: gestörte komprimierte Bilder. Sie treten leichter auf, da die Bildgröße variiert und der Treiber die tatsächlich empfangene Größe nicht zuverlässig prüfen kann. Analyseschritte:

1. Die komprimierte Vorschau kontinuierlich mitschneiden und beobachten. Bei Störungen den Analysator umgehend stoppen, Daten speichern und Bilder gemäß dem entsprechenden Abschnitt mit Python extrahieren.

2. Bei eindeutigen Übertragungsfehlern wie CRC error oder unvollständigen Paketen zuerst die USB-Signalqualität untersuchen.

3. Sind auch die aus Analysatordaten extrahierten Bilder gestört, sind bereits die Daten auf dem physischen USB-Bus fehlerhaft. Zugehörige Transaktionen suchen. Fehlen IN-Pakete des Host über mehrere aufeinanderfolgende Mikroframes, kann eine verspätete Isochronbearbeitung des Controllers verantwortlich sein. Bei normalem Host-Verhalten können Device-Quelldaten fehlerhaft sein; das Device weiter untersuchen.

4. Sind extrahierte Bilder korrekt, auf dem Host DMA-Cache-Kohärenz des USB-Controllers, USB/CPU-Buspriorität (QOS), UVC-Anwendungsverarbeitung und weitere Faktoren prüfen.

5. Mit v4l2-ctl den Anwendungseinfluss prüfen. Abhilfemaßnahmen:

1. Signalqualität: USB-HS-Augendiagramm messen und anhand des Berichts Hardware sowie PHY-Parameter im Treiber optimieren [4].

2. Verspätete Isochronbearbeitung: die Abschnitte zu USB-Interruptaffinität, deaktiviertem CPU IDLE und festen hohen CPU-/DDR-Frequenzen nutzen, um Reaktionszeit, Buslatenz und Leistung zu verbessern.

3. USB/CPU-Buspriorität (QOS) erhöhen.

### 5.4 Bandbreitenmangel bei mehreren UVC-Streams

Bandbreitenmangel tritt meist auf, wenn zwei oder mehr USB2.0-UVC-Kameras über einen Hub am USB Host hängen: Die Vorschau startet nicht und der Kernel meldet Fehler:

1. USB3.0-Host-Fehlerprotokoll

```text
usb 5-1.4: Not enough bandwidth for new device state.
usb 5-1.4: Not enough bandwidth for altsetting 11
VIDIOC_STREAMON: failed: No space left on device
```

2. USB2.0-Host-Fehlerprotokoll

```text
uvcvideo: Failed to submit URB 0 (-28).
VIDIOC_STREAMON: failed: No space left on device
```

Fallbeispiel: Ein Hub erweitert RK3588 USB2.0 Host; an zwei Downstream-Ports hängen Logitech HD C93 und UVC Camera (046d:0823). Reproduktion:

```text
# step1. 查看 UVC video 节点信息
console:/ # v4l2-ctl --list-devices
罗技⾼清⽹络摄像机 C93 (usb-fc880000.usb-1.1):
        /dev/video21
        /dev/video22

UVC Camera (046d:0823) (usb-fc880000.usb-1.4):
        /dev/video23
        /dev/video24

# step2. 两路 UVC 同时以分辨率 1920*1080 图像格式 MJPG ⽅式取流
console:/ # v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap &
console:/ # v4l2-ctl --device /dev/video23 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap &
# step3. video21 取流成功，但 video23 取流失败，串⼝提⽰log
console:/ # uvcvideo: Failed to submit URB 0 (-28).
console:/ # VIDIOC_STREAMON: failed: No space left on device
```

Problemanalyse:

```text
# 查看 UVC 设备的端点信息
console:/ # cat /sys/kernel/debug/usb/devices
# 对应 罗技⾼清⽹络摄像机 C93 设备
T:  Bus=02 Lev=02 Prnt=02 Port=00 Cnt=01 Dev#=  3 Spd=480  MxCh= 0
D:  Ver= 2.00 Cls=ef(misc ) Sub=02 Prot=01 MxPS=64 #Cfgs=  1
P:  Vendor=046d ProdID=0891 Rev= 0.19
S:  Product=罗技⾼清⽹络摄像机 C930c
S:  SerialNumber=83FBB5EE
......
I:* If#= 1 Alt= 0 #EPs= 0 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
I:  If#= 1 Alt= 1 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS= 192 Ivl=125us
I:  If#= 1 Alt= 2 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
......
I:  If#= 1 Alt=10 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS=2688 Ivl=125us
I:  If#= 1 Alt=11 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS=3072 Ivl=125us

# 对应 UVC Camera (046d:0823) 设备
T:  Bus=02 Lev=02 Prnt=02 Port=03 Cnt=02 Dev#=  4 Spd=480  MxCh= 0
D:  Ver= 2.00 Cls=ef(misc ) Sub=02 Prot=01 MxPS=64 #Cfgs=  1
P:  Vendor=046d ProdID=0823 Rev= 0.10
S:  SerialNumber=7F65EA20
......
I:* If#= 3 Alt= 0 #EPs= 0 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
I:  If#= 3 Alt= 1 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS= 192 Ivl=125us
......
E:  Ad=81(I) Atr=05(Isoc) MxPS=1984 Ivl=125us
I:  If#= 3 Alt=10 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS=3060 Ivl=125us
I:  If#= 3 Alt=11 #EPs= 1 Cls=0e(video) Sub=02 Prot=00 Driver=uvcvideo
E:  Ad=81(I) Atr=05(Isoc) MxPS=3060 Ivl=125us
```

Die Endpunktinformationen zeigen dynamische Bandbreitenkonfiguration beider Logitech-Kameras. Der minimale Maxpacket size beträgt jeweils 192 bytes, die Maxima 3072 beziehungsweise 3060 bytes. Max packet size bezeichnet hier die maximale Datenmenge pro USB-Mikroframe. Die dynamische Konfiguration passt sie an Auflösung und Format an. UVC Trace gemäß dem Treiberdiagnoseabschnitt aktivieren, um die beim Vorschaustart verwendete Bandbreite zu ermitteln.

```text
# 查看 UVC 设备占⽤的 USB 总线带宽信息
console:/ # echo 0xffff > /sys/module/uvcvideo/parameters/trace
console:/ # echo 8 > /proc/sys/kernel/printk
console:/ # v4l2-ctl --device /dev/video21 --set-fmt-video=width=1920,height=1080,pixelformat=MJPG --stream-mmap

# 罗技⾼清⽹络摄像机 C93 设备的 trace 关键信息如下：
uvcvideo: Selecting alternate setting 11 (3072 B/frame bandwidth).

# 同样的操作⽅法，UVC Camera (046d:0823) 设备的 trace 关键信息如下：
uvcvideo: Selecting alternate setting 11 (3060 B/frame bandwidth).
```

Der Trace zeigt: Für MJPG mit 1920*1080 benötigt Logitech HD C93 3072 B/frame, die Kamera 046d:0823 3060 B/frame. Frame bezeichnet hier einen USB-Mikroframe von 125 Mikrosekunden. USB2.0 [5], Abschnitt 5.6.4 Isochronous Transfer Bus Access Constraints, erlaubt High-Speed-Endpunkten höchstens 80% eines Mikroframes für periodische Transfers. Maximale Zeit: 125 us * 80% = 100us; der Rest bleibt nichtperiodischen Geräten vorbehalten. Abschnitt 5.11.3 Calculating Bus Transaction Times beschreibt:

```text
High-speed (Input)
Isochronous Transfer (No Handshake)
= (38 * 8 * 2.083) + (2.083 * Floor(3.167 + BitStuffTime(Data_bc))) +
Host_Delay
```

Der Linux-Kernel-USB-Treiber folgt den USB-2.0-Vorgaben strikt. Implementierung:

```text
include/linux/usb/hcd.h
/*
 * Ceiling [nano/micro]seconds (typical) for that many bytes at high speed
 * ISO is a bit less, no ACK ... from USB 2.0 spec, 5.11.3 (and needed
 * to preallocate bandwidth)
 */
#define USB2_HOST_DELAY 5       /* nsec, guess */
#define HS_NSECS(bytes) (((55 * 8 * 2083) \
        + (2083UL * (3 + BitTime(bytes))))/1000 \
        + USB2_HOST_DELAY)
#define HS_NSECS_ISO(bytes) (((38 * 8 * 2083) \
        + (2083UL * (3 + BitTime(bytes))))/1000 \
        + USB2_HOST_DELAY)
#define HS_USECS(bytes)         NS_TO_US(HS_NSECS(bytes))
#define HS_USECS_ISO(bytes)     NS_TO_US(HS_NSECS_ISO(bytes))

drivers/usb/core/hcd.c
long usb_calc_bus_time (int speed, int is_input, int isoc, int bytecount)
{
        unsigned long   tmp;
        ......
        case USB_SPEED_HIGH:    /* ISOC or INTR */
                /* FIXME adjust for input vs output */
                if (isoc)
                        tmp = HS_NSECS_ISO (bytecount);
                else
                        tmp = HS_NSECS (bytecount);
        ......
}
```

Nach dieser Berechnung ergeben unterschiedliche ISOC Max packet size folgende Buszeiten:

| Max. Paket (bytes/uframe) | Buszeit (us) |
| --- | --- |
| 256 | 5 |
| 640 | 13 |
| 1024 | 20 |
| 1920 | 37 |
| 3072 | 60 |

Zwei Kameras mit hoher Bandbreite, beispielsweise je 3072bytes/uframe, überschreiten somit die USB2.0-Grenze von 100us und verursachen Bandbreitenmangel. Verfahren 1: UVC-Bandbreitenzuteilung optimieren [bevorzugt]. Zweck: die maximale Anforderung bestimmter Geräte reduzieren. Folge: mögliche Verringerung der Bildrate unkomprimierter YUV-Formate. Linux-5.10-Beispiel:

```text
diff --git a/drivers/media/usb/uvc/uvc_video.c b/drivers/media/usb/uvc/uvc_video.c
index f6373d678d25..ee798b778255 100644
--- a/drivers/media/usb/uvc/uvc_video.c
+++ b/drivers/media/usb/uvc/uvc_video.c
@@ -1845,6 +1845,7 @@ static int uvc_video_start_transfer(struct uvc_streaming *stream,
        struct usb_interface *intf = stream->intf;
        struct usb_host_endpoint *ep;
        struct uvc_urb *uvc_urb;
+       struct usb_device *udev = interface_to_usbdev(intf);
        unsigned int i;
        int ret;

@@ -1866,6 +1867,13 @@ static int uvc_video_start_transfer(struct uvc_streaming *stream,
                /* Isochronous endpoint, select the alternate setting. */
                bandwidth = stream->ctrl.dwMaxPayloadTransferSize;

+               if ((le16_to_cpu(udev->descriptor.idVendor) == 0x2bdf) &&
+                   (le16_to_cpu(udev->descriptor.idProduct) == 0x0293) &&
+                   (bandwidth > 1600)){
+                       printk("UVC_DBG: limit bandwidth from %u to 1600B\n", bandwidth);
+                       bandwidth = 1600;
+               }
+
                if (bandwidth == 0) {
                        uvc_trace(UVC_TRACE_VIDEO, "Device requested null "
                                "bandwidth, defaulting to lowest.\n");
```

Verfahren 2: den für periodische USB-Transfers reservierten Anteil auf 95% oder höher erhöhen. Dies vergrößert ihre Bandbreite, kann aber nichtperiodische Geräte desselben Busses, etwa USB-Speicher, funktionsunfähig machen. Einschränkung: nicht für USB3.0 Host xHCI geeignet. Änderungsbeispiel für USB2.0 Host EHCI:

```text
diff --git a/drivers/usb/host/ehci-hcd.c b/drivers/usb/host/ehci-hcd.c
index 8aff19ff8e8f..bed879a4ab5b 100644
--- a/drivers/usb/host/ehci-hcd.c
+++ b/drivers/usb/host/ehci-hcd.c
@@ -475,7 +475,7 @@ static int ehci_init(struct usb_hcd *hcd)
         * by default set standard 80% (== 100 usec/uframe) max periodic
         * bandwidth as required by USB 2.0
         */
-       ehci->uframe_periodic_max = 100;
+       ehci->uframe_periodic_max = 125;

        /*
         * hw default: 1K periodic list heads, one per frame.
```

Beispiel für USB2.0 Host DWC2:

```text
diff --git a/drivers/usb/dwc2/hcd_queue.c b/drivers/usb/dwc2/hcd_queue.c
index b2e0721a3eb8..e8b394bd9aae 100644
--- a/drivers/usb/dwc2/hcd_queue.c
+++ b/drivers/usb/dwc2/hcd_queue.c
@@ -119,7 +119,7 @@ static int dwc2_check_periodic_bandwidth(struct
dwc2_hsotg *hsotg,
                 * High speed mode
                 * Max periodic usecs is 80% x 125 usec = 100 usec
                 */
-               max_claimed_usecs = 100 - qh->host_us;
+               max_claimed_usecs = 125 - qh->host_us;
        } else {
                /*
                 * Full speed mode
```

### 5.5 Vorschauverzögerung

Der UVC-Bildpfad ist lang; jede Modulverzögerung beeinflusst die gesamte Vorschauverzögerung. Zunächst den vollständigen Startdatenstrom mit dem Analysator erfassen und das Nadelöhr auf Device oder Host lokalisieren. Beim Host die Verzögerungen jedes Teilmoduls separat untersuchen. Beispiel: Host-Pufferung verzögert MJPEG 1080P eines Structured-Light-Moduls. APK libuvc kopiert Kernelbilder per memcopy in eine eigene frame queue, asynchron zu den 10 Kernel-URBs für zyklischen Empfang. Softwaredekodierung und Anzeige von 1080P sind langsam: Das erste Bild erscheint erst, nachdem Kernel und libuvc bereits 6–7 Bilder empfangen und eingereiht haben. Diese gepufferten Bilder verursachen die Verzögerung. Abhilfe: Host-Softwaredekodierung beschleunigen und Bildstau vermeiden.

### 5.6 UVC-EMI-Probleme

EMI hängt meist mit dem Hardwaredesign des USB-Geräts zusammen und kann UVC stören, etwa Vorschaustart verhindern oder Bilder einfrieren. Linux Host meldet dann häufig: usb usb1-port1: disabled by hub (EMI?), re-enabling... Erkennungsprinzip: Der Host-Controller, etwa EHCI, prüft fortlaufend port enable. Wird ein Port plötzlich disabled, während das Anschlussregister weiterhin ein Gerät meldet, vermutet der Treiber EMI und protokolliert dies. Die Meldung ist daher ein wichtiger Diagnosehinweis, aber kein Beweis für EMI als Ursache. Maßnahmen:

1. USB-Augendiagramm mit dem Oszilloskop messen und den Bericht an Hardware- und USB-Treiberentwickler geben. Anhand dessen Schaltung und PHY-Register für bessere Signalqualität und EMI-Verhalten anpassen.

2. Single-Ended- und Differenzsignale von DP/DM messen. Hoher Rauschpegel verschlechtert die Signalqualität und kann EMI auslösen. Drei Hardwaremaßnahmen: (1) Gleichtaktdrossel in Serie zu DP/DM; (2) zusätzliche gemeinsame Masseverbindung zwischen Device und Host; (3) USB-Host-Buchse mit größerer DP/DM-Kontaktfläche.

## 6. Referenzen

1. kernel/Documentation/trace/ftrace.rst

2. USB Video Class v1.1

3. „Rockchip_Developer_Guide_USB_CN“

4. „Rockchip_Introduction_USB_SQ_Tool_CN“

5. USB 2.0 Specification

{% endraw %}
