---

title: "Rockchip RMSL Linux: Tiefenstreams, APIs, Dekodierung und Anzeige"

description: "Rockchip RMSL Linux: Tiefenstreams, APIs, Dekodierung und Anzeige · V1.0.1"

excerpt: "Rockchip RMSL Linux: Tiefenstreams, APIs, Dekodierung und Anzeige"

translation_key: 184-rockchip-linux-rmsl

slug: 184-rockchip-linux-rmsl

lang: de

date: "2026-10-24"

category: camera

tags: [ArmSoM, Rockchip, RMSL, Camera, Linux]

---



{% raw %}



Plattformreferenz: Hersteller-V1.0.1 (RK-KF-YF-355) beschreibt RMSL-Nutzung und APIs im Linux-SDK. Die Structured-Light-3D-Kamera enthält einen 30.000-Punkte-Projektor, eine 5-MP-RGB-Kamera, eine 1-MP-IR-Kamera mit Global Shutter und IR-Beleuchtung; Anwendungen sind Zahlung, Zutrittskontrolle, Gesten-/Körpererkennung und präzise 3D-Modellierung. Konkrete ArmSoM-Boards, Kernel und BSPs sind nicht validiert; USB-Versorgung, Bibliotheken und Geräteknoten prüfen. Leistungswerte sind Herstellerbeispiele, keine ArmSoM-Messungen; keine Befehle ausgeführt. ZH nutzt chinesische, EN/RU/DE englische Originalbilder.



[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)



<!-- en PDF p.4; unit 0 -->

## 1. Schnittstelle des RMSL-Moduls

<!-- en PDF p.4; unit 1 -->

### 1.1 Überblick

<!-- en PDF p.4; unit 2 -->

Rockchip RMSL ist ein USB-Plug-and-play-Gerät mit drei gleichzeitigen Ausgängen: Depth, RGB und IR. Depth liefert YUYV, RGB und IR liefern MJPG.

<!-- en PDF p.4; unit 3 -->

| Video | Max.<br>Auflösung | Format | Bildrate | Beschreibung |
| --- | --- | --- | --- | --- |
| Depth | 640x480 | YUYV | 15fps | Disparitätsbild; algorithmisch in Tiefenbild oder Punktwolke umwandelbar |
| RGB | 1920x1080 | MJPG | 30fps | RGB-Bild, nach NV12 dekodierbar |
| IR | 640x480 | MJPG | 15fps | Infrarotbild, nach NV12 dekodierbar |

<!-- en PDF p.4; unit 4 -->

### 1.2 RMSL-Modell

<!-- en PDF p.4; unit 5 -->

Das RK-RMSL-Modell lässt sich aus der Seriennummer SN bestimmen. Die zur Dokumentzeit unterstützten Structured-Light-Modelle sind unten aufgeführt.

<!-- en PDF p.4; unit 6 -->

| Modell | Passende SN | Schnittstelle |
| --- | --- | --- |
| RMSL201-1301 | R2011301xxxxxxxxx | USB |

<!-- en PDF p.4; unit 7 -->

### 1.3 Buildroot konfigurieren

<!-- en PDF p.4; unit 8 -->

Im Buildroot-Linux-SDK liegen Schnittstellen und Beispiele unter app/demo/rmsl. Standardmäßig wird das Programm nicht gebaut. BR2_PACKAGE_APP_DEMO_RMSL sowie seine Abhängigkeiten aktivieren: BR2_PACKAGE_CAMERA_ENGINE_RKISP für den V4L2-Datenstrom; BR2_PACKAGE_MPP zur MJPG-Dekodierung; BR2_PACKAGE_LINUX_RGA zur YUV-Verarbeitung für die Anzeige; BR2_PACKAGE_LIBDRM zur Bildschirmausgabe (optional). Fehlen Schalter oder Beispielcode, SDK aktualisieren oder den in der Quelle verlinkten GitHub-Code beziehen.

<!-- en PDF p.5; unit 9 -->

external/camera_engine_rkisp/ muss mindestens den Stand 86dc5bf1 apps: rkisp_api: add usb camera supports enthalten. Bei nicht aktualisiertem SDK kann der Code aus dem GitHub-Repository bezogen werden.

<!-- en PDF p.5; unit 10 -->

### 1.4 Bauen und ausführen

<!-- en PDF p.5; unit 11 -->

Im SDK-Verzeichnis das Modul mit folgendem Befehl bauen:

<!-- en PDF p.5; unit 12 -->

```text
# make app_demo
```

<!-- en PDF p.5; unit 13 -->

Für einen erneuten Build:

<!-- en PDF p.5; unit 14 -->

```text
# make app_demo-dirclean
# make app_demo
```

<!-- en PDF p.5; unit 15 -->

Es entstehen die ausführbaren Dateien rmsl_linux_demo und rmsl_tool.

<!-- en PDF p.5; unit 16 -->

```text
# ls -1 /usr/bin/rmsl*
/usr/bin/rmsl_linux_demo
/usr/bin/rmsl_tool
```

<!-- en PDF p.5; unit 17 -->

Wegen vieler Abhängigkeiten wird nach §1.3 ein vollständiger sauberer Buildroot-Neubau empfohlen. RMSL anschließen und Geräteinformationen mit rmsl_tool abfragen. Geräteknoten ermitteln:

<!-- en PDF p.5; unit 18 -->

```text
# rmsl_tool --list_devices
Device /dev/video6 info:
      usb interface: UVC DEPTH
        driver name: uvcvideo
          card type: RV1108
           bus_info: usb-ff340000.usb-1
Device /dev/video8 info:
      usb interface: UVC RGB
        driver name: uvcvideo
          card type: RV1108
           bus_info: usb-ff340000.usb-1
Device /dev/video10 info:
      usb interface: UVC IR
        driver name: uvcvideo
          card type: RV1108
           bus_info: usb-ff340000.usb-1
```

<!-- en PDF p.5; unit 19 -->

Die drei Knoten /dev/video6, /dev/video8 und /dev/video10 stehen für DEPTH, RGB und IR. USB-Knoten und Treiberinformationen werden ebenfalls angezeigt. SN und Softwareversion abfragen:

<!-- en PDF p.6; unit 20 -->

```text
# rmsl_tool --get_sn --get_version --device /dev/video6
SN: R2011301200801448
Version: 2.2.0
```

<!-- en PDF p.6; unit 21 -->

Vor dem Datenstrom das Gerät initialisieren:

<!-- en PDF p.6; unit 22 -->

```text
# rmsl_tool --init --device /dev/video6
```

<!-- en PDF p.6; unit 23 -->

Nach dem Datenstrom das Gerät deinitialisieren:

<!-- en PDF p.6; unit 24 -->

```text
# rmsl_tool --deinit --device /dev/video6
```

<!-- en PDF p.6; unit 25 -->

Nach Ende des Datenstroms kann das Gerät auch zurückgesetzt werden:

<!-- en PDF p.6; unit 26 -->

```text
# rmsl_tool --reset --device /dev/video6
```

<!-- en PDF p.6; unit 27 -->

Nach der Initialisierung können Open-Source-Werkzeuge wie v4l2-ctl und vlc den Strom lesen; Format und Größe beachten. rmsl_linux_demo demonstriert den ganzen Ablauf mit Initialisierung, Aufnahme, Dekodierung, Deinitialisierung und Anzeige. Es initialisiert RMSL selbst; eine vorherige Initialisierung mit rmsl_tool ist unnötig. Hilfe von rmsl_linux_demo:

<!-- en PDF p.6; unit 28 -->

```text
# rmsl_linux_demo --help
Usage of rmsl_linux_demo:
To display and/or save decode frames to files:
 --screen-width,   screen width,  required if need display
 --screen-height,  screen height, required if need display
 --no-display,     disable display, by default it's enabled
 --save-ir-to,     path to save IR    decoded frames in NV12
 --save-depth-to,  path to save DEPTH decoded frames with bpp = 16
 --save-rgb-to,    path to save RGB   decoded frames in NV12
```

<!-- en PDF p.6; unit 29 -->

rmsl_linux_demo erfasst den Strom, speichert ihn als Datei und zeigt ihn an. Die Anzeige ist standardmäßig aktiv; --no-display deaktiviert sie. Bildschirmausgabe:

<!-- en PDF p.6; unit 30 -->

```text
# rmsl_linux_demo --screen-width 1536 --screen-height 2048

UVC DEPTH: /dev/video5: draw in (0, 480)[640 x 480]
UVC RGB: /dev/video7: draw in (320, 0)[640 x 480]
UVC IR: /dev/video9: draw in (640, 480)[640 x 480]
```

<!-- en PDF p.7; unit 31 -->

![RMSL · en PDF p.7](/docs/rockchip-linux-rmsl/assets/en-p007-figure-01.png)

<!-- en PDF p.7; unit 32 -->

Auf dem RK3288-Bildschirm (1536x2048) sind von oben nach unten und links nach rechts RGB, DEPTH und IR zu sehen. Alle Bilder sind 640x480 groß. Die Depth-Disparitätskarte wird direkt als RGB565 dargestellt. Folgendes Beispiel deaktiviert die Anzeige und speichert dekodierte Frames:

<!-- en PDF p.7; unit 33 -->

```text
# rmsl_linux_demo --no-display \
                  --save-ir-to    /tmp/ir.bin  \
                  --save-rgb-to   /tmp/rgb.bin \
                  --save-depth-to /tmp/depth.bin
```

<!-- en PDF p.7; unit 34 -->

Ohne Anzeige werden drei Dateien geschrieben: ir.bin enthält NV12 640x480, rgb.bin NV12 640x480, depth.bin Tiefendaten 640x480 mit 2 Byte pro Pixel. Standardgröße ist 640×480, die RGB-Kamera unterstützt aber 1080p. Auf dem PC lassen sich Dateien mit YUVPlayer unter Windows oder mplayer unter Linux ansehen. mplayer-Beispiele:

<!-- en PDF p.7; unit 35 -->

```text
# mplayer /tmp/ir.bin -loop 0 -demuxer rawvideo -fps 15 \
    -rawvideo w=640:h=480:size=$((640*480*3/2)):format=nv12

# mplayer /tmp/rgb.bin -loop 0 -demuxer rawvideo -fps 15 \
    -rawvideo w=640:h=480:size=$((640*480*3/2)):format=nv12

# mplayer /tmp/depth.bin -loop 0 -demuxer rawvideo -fps 15 \
    -rawvideo w=640:h=480:size=$((640*480*2)):format=rgb16
```

<!-- en PDF p.8; unit 36 -->

## 2. Beispielcode

<!-- en PDF p.8; unit 37 -->

app/demo/rmsl/ enthält RMSL-Einstellungen, Abfrageschnittstellen, Aufnahme, Dekodierung und Anzeige.

<!-- en PDF p.8; unit 38 -->

```text
# tree app/demo/rmsl/
app/demo/rmsl/
├── CMakeLists.txt
├── main.c              # main of rmsl_linux_demo
├── rkdrm_display.c     # use DRM to display directly on Overlay Plane of
Rockchip devices
├── rkdrm_display.h
├── rmsl_api.h          # RMSL API Definition
├── rmsl_ctrl.c         # Implementation of rmsl control, query and other
routines
├── rmsl_depth.c        # Implementation of depth image conversion
├── rmsl_tool.c         # The rmsl_tool source code
├── vpu_decode.c        # vpu jpeg hardware decoding interface
└── vpu_decode.h
```

<!-- en PDF p.8; unit 39 -->

### 2.1 RMSL-Steuerungsschnittstelle

<!-- en PDF p.8; unit 40 -->

Version lesen:

<!-- en PDF p.8; unit 41 -->

```text
int rmsl_get_version(int fd, char *ver, int size);
```

<!-- en PDF p.8; unit 42 -->

Parameter: fd ist der Deskriptor des /dev/video-Knotens; ver die zurückgegebene Version; size die Größe von ver, mindestens RMSL_DATA_SIZE_QUERY. Rückgabe 0 bei Erfolg, Fehlerwert bei einem Fehler. Seriennummer lesen:

<!-- en PDF p.8; unit 43 -->

```text
int rmsl_get_sn(int fd, char *sn, int size);
```

<!-- en PDF p.8; unit 44 -->

Parameter: fd ist der Deskriptor von /dev/video; sn die zurückgegebene Seriennummer; size die Größe von sn, mindestens RMSL_DATA_SIZE_QUERY. Rückgabe 0 bei Erfolg, Fehlerwert bei Fehler. Initialisieren/deinitialisieren:

<!-- en PDF p.8; unit 45 -->

```text
int rmsl_init_device(int fd);
int rmsl_deinit_device(int fd);
```

<!-- en PDF p.8; unit 46 -->

Initialisierung und Deinitialisierung steuern die Datenausgabe des Videoknotens.

<!-- en PDF p.9; unit 47 -->

fd bezeichnet den Videoknoten-Deskriptor. Rückgabe 0 bei Erfolg, sonst Fehlerwert. Gerät zurücksetzen:

<!-- en PDF p.9; unit 48 -->

```text
int rmsl_reset_device(int fd);
```

<!-- en PDF p.9; unit 49 -->

fd bezeichnet den Videoknoten-Deskriptor. Rückgabe 0 bei Erfolg, sonst Fehlerwert. Suspend-Modus aktivieren:

<!-- en PDF p.9; unit 50 -->

```text
int rmsl_suspend_device(int fd);
```

<!-- en PDF p.9; unit 51 -->

fd bezeichnet den Videoknoten-Deskriptor. Rückgabe 0 bei Erfolg, sonst Fehlerwert. Videogerätepfade abfragen:

<!-- en PDF p.9; unit 52 -->

```text
int rmsl_get_devices(char *dev_depth, char *dev_ir, char *dev_rgb, int silent);
```

<!-- en PDF p.9; unit 53 -->

Liefert die Pfade der drei Videoknoten, etwa /dev/video6 und /dev/video8. dev_depth liefert Depth, dev_ir IR, dev_rgb RGB. silent=1 unterdrückt Logs, 0 gibt Meldungen aus. Rückgabe 0 bei Erfolg, sonst Fehlerwert. Depth in Punktwolke und Tiefenbild umwandeln:

<!-- en PDF p.9; unit 54 -->

```text
int rmsl_get_point_cloud_depth(const uint16_t *pIn, struct rmsl_pc *pc_out,
                               uint16_t *depth_out, int width, int height);
```

<!-- en PDF p.9; unit 55 -->

Aus der Disparitätskarte werden Punktwolke und Tiefenbild berechnet. pIn enthält den Disparitätsframe von Depth, BPP=16; pc_out ist die Punktwolke, NULL überspringt deren Berechnung; depth_out das Tiefenbild, NULL überspringt dessen Berechnung; width und height sind Breite und Höhe. Rückgabe 0 bedeutet erfolgreiche Berechnung.

<!-- en PDF p.10; unit 56 -->

Ein negativer Wert bedeutet Fehler. Englisch schreibt „A positive 0“ für den Fall, dass die Eingangsdaten bereits ein Tiefenbild sind und keine Berechnung brauchen (derzeit kein solcher Fall); Chinesisch nennt einen Wert größer als 0. Dies ist eine Quellabweichung, kein neu definierter Rückgabecode.

<!-- en PDF p.10; unit 57 -->

### 2.2 Datenstrom erfassen

<!-- en PDF p.10; unit 58 -->

rmsl_linux_demo erfasst über rkisp_api.so. Gegenüber einer gewöhnlichen USB-Kamera ist ein zusätzlicher Initialisierungsschritt nötig. Details der Schnittstelle stehen in Rockchip_Developer_Guide_Linux_Camera_EN.pdf.

<!-- en PDF p.10; unit 59 -->

### 2.3 Dekodieren

<!-- en PDF p.10; unit 60 -->

Rockchip MPP dekodiert MJPG: Der von rkisp_api gelieferte Strom geht an MPP. RGA kann den dekodierten Puffer anschließend skalieren/kopieren und anzeigen; deshalb wird der Dekodierpuffer über RGA angelegt. Code:

<!-- en PDF p.10; unit 61 -->

```text
ret = vpu_decode_jpeg_init(&ctx->decoder, ctx->width, ctx->height);
while (has new frame)
    vpu_decode_jpeg_doing(&ctx->decoder, ctx->cur_frame->buf,
            ctx->cur_frame->size, ctx->rga_bo_fd, ctx->rga_bo.ptr);
vpu_decode_jpeg_done(&ctx->decoder);
```

<!-- en PDF p.10; unit 62 -->

decoder ist der VPU-Dekodierhandle; rga_bo_fd der RGA-Pufferhandle; rga_bo.ptr die virtuelle Pufferadresse.

<!-- en PDF p.10; unit 63 -->

### 2.4 Anzeige

<!-- en PDF p.10; unit 64 -->

Zur effizienten Verarbeitung unter Berücksichtigung verschiedener SoCs verwendet rmsl_linux_demo direkt libdrm. RGA kopiert die drei Bilder an festgelegte Offsets eines Zielpuffers; dieser geht an die Overlay-Plane des Rockchip VOP. Der Ablauf folgt unten.

<!-- en PDF p.11; unit 65 -->

MJPG-Frame der RGB-Kamera; MJPG-Frame der IR-Kamera.

![RMSL · en PDF p.11](/docs/rockchip-linux-rmsl/assets/en-p011-vector-01.png)

<!-- en PDF p.11; unit 66 -->

Beide Frames werden durch MPP dekodiert.

<!-- en PDF p.11; unit 67 -->

Depth-Kameraframe; RGB-NV12-Frame; IR-NV12-Frame.

<!-- en PDF p.11; unit 68 -->

Depth: algorithmische Berechnung oder RGA-Kopie. RGB und IR: RGA-Konvertierung nach RGB565 und Kopie.

<!-- en PDF p.11; unit 69 -->

Die Berechnungszweige liefern Tiefenbild und Punktwolke. Drei Bilder werden in einem Anzeigepuffer zusammengeführt.

<!-- en PDF p.11; unit 70 -->

Anzeige auf der VOP-Overlay-Ebene.

<!-- en PDF p.11; unit 71 -->

Annahme: Nur eine Overlay-Ebene ist verfügbar, etwa bei px30/rk3326. RGA kopiert Bilder deshalb an unterschiedliche Offsets eines Zielpuffers. Die Disparitätskarte wird lediglich zur Demonstration als RGB565 angezeigt: Beide Formate haben 16 Bit pro Pixel, sodass Konturen klar erkennbar sind. RGA-Konvertierung/Kopie wird hardwarebeschleunigt. Das Beispiel erreicht auf px30, rk3288 und rk3399 15fps; IR und Depth begrenzen auf maximal 15fps. Optimierungen: Bei mehreren Overlay-Planes NV12 direkt getrennt anzeigen. Insgesamt sind drei nötig, je eine für RGB-NV12, IR-NV12 und Depth. Damit entfallen RGA-Konvertierung/Kopie; RGB kann 30fps erreichen. Mehrere Threads verbessern die Parallelität, besonders bei Punktwolkenberechnungen mit Gleitkommaoperationen.

<!-- en PDF p.11; unit 72 -->

#### 2.4.1 Integration mit QT

<!-- en PDF p.11; unit 73 -->

Wenn QT Menüs, Schaltflächen und andere UI-Elemente zeichnet, im Hauptfenster einen Bereich für Video-Overlay reservieren. Video liegt stets über der UI. Überlappen Dialoge oder Menüs den Videobereich, die Overlay-Plane vorübergehend ausblenden. Dies ist nur ein Entwurfsansatz; die konkrete Gestaltung richtet sich nach der Anwendung.

<!-- en PDF p.11; unit 74 -->

## 3. Häufige Fragen

<!-- en PDF p.12; unit 75 -->

### 3.1 Gerät trennt sich nach dem Öffnen der Kamera

<!-- en PDF p.12; unit 76 -->

Ursache ist unzureichende Stromversorgung. Einen USB-Hub mit externer Versorgung verwenden.

## Quellunterschiede

Die Abweichung „A positive 0“ gegenüber chinesisch „größer als 0“ ist oben benannt; tatsächliche Bibliothek prüfen. Abweichende Beispiele der anderen Quelle sind unabhängig, nicht zu einem Skript verbinden.

**CN PDF p.8 · 37**

```text
# tree app/demo/rmsl/
app/demo/rmsl/
├── CMakeLists.txt
├── main.c              # rmsl_linux_demo的主程序
├── rkdrm_display.c     # ⽤于overlay直接显⽰
├── rkdrm_display.h
├── rmsl_api.h          # rmsl 主要接⼝定义
├── rmsl_ctrl.c         # rmsl 控制、查询等⽅法的实现
├── rmsl_depth.c        # 深度图转换的实现
├── rmsl_tool.c         # rmsl_tool的主程序
├── vpu_decode.c        # vpu jpeg硬件解码接⼝
└── vpu_decode.h
```

{% endraw %}
