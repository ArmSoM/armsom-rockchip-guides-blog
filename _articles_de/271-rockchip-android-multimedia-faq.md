---
title: "Rockchip Android Multimedia-FAQ: Codecs, Leistung und Anwendungen"
description: "Rockchip Android Multimedia-FAQ: Codecs, Leistung und Anwendungen"
excerpt: "Rockchip Android Multimedia-FAQ: Codecs, Leistung und Anwendungen"
translation_key: "271-rockchip-android-multimedia-faq"
slug: "271-rockchip-android-multimedia-faq"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Vollständiger technischer Inhalt von RK-PC-YF-310 V1.0.2 auf Chinesisch. Übersicht: Linux4.19/5.10; Text auch Linux4.4 und Android7.1–12+. „Alle Chips“ bestätigt nicht jede ArmSoM-Platine. SoC, SDK/BSP, Kernel und Medienkomponenten abgleichen; Plattformreferenz ohne Hardwaretest. Kein englisches PDF, daher gekennzeichnete chinesische Originalgrafiken. Spezifikationen und Leistungen sind Quellenwerte, keine ArmSoM-Messungen.

## 1 Allgemeine Medien

### 1.1 Wiedergabe scheitert

#### 1.1.1 Spezifikationen

MediaInfo unter Windows/Linux zeigt Codec, Auflösung, Bitrate, Scanverfahren und Farbtiefe. Mit Datasheet/Codec Benchmark vergleichen; notwendige Chipreferenzen gegebenenfalls vom Anbieter beziehen.

![Abbildung 1, PDF-Seite 3 (chinesisches PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p03-1.png)

Abbildung 1, PDF-Seite 3 (chinesisches PDF)

#### 1.1.2 Formatlizenzen

Laut Quelle fehlen aus Lizenzgründen Audio mlp, ac3, eac3, dts, dsp, heaac und weitere Dolby-Formate sowie Video divx, xvid, rmvb, vp6, vc1, svq, ISO-Blu-ray. Dies beschreibt das SDK, keine aktuelle Rechtsbewertung.

### 1.2 Leistungstabellen

Nennwerte der Quelle. Hohe CPU-/DDR-Last kann Leistung verringern; keine universellen Parallelitätsgarantien.

#### 1.2.1 Decodierung

|SoC|H264|H265|VP9|JPEG|
|---|---|---|---|---|
|RK3588|7680x4320@30f|7680x4320@60f|7680x4320@60f|1920x1080@280f|
|RK3576|4096x2304@60f|4096x2304@60f|4096x2304@60f|3840x2160@90f|
|RK3562|1920x1080@60f|4096x2304@30f|4096x2304@30f|1920x1080@60f|
|RK3528|4096x2304@30f|4096x2304@60f|4096x2304@60f|1920x1080@120f|
|RK356X|4096x2304@30f|4096x2304@60f|4096x2304@60f|1920x1080@80f|
|RK3399|4096x2304@30f|4096x2304@60f|4096x2304@60f|1920x1080@30f|
|RK3328|4096x2304@30f|4096x2304@60f|4096x2304@60f|1920x1080@30f|
|RK3288|3840x2160@30f|4096x2304@60f|N/A|1920x1080@30f|
|RK3358/PX5|4096x2160@25f|4096x2304@60f|N/A|1920x1080@30f|
|RK3326/PX30|1920x1080@60f|1920x1080@60f|N/A|1920x1080@30f|
|RK312X|1920x1080@60f|1920x1080@60f|N/A|1920x1080@30f|

Hinweise: RK3588 zusätzlich AVS2 7680x4320@60f und AV1 3840x2160@60f; RK3528 AVS2 4096x2160@60f. RK3562 ohne mpeg1/2/4, vp8, h263; andere gelistete Chips bis1080P. Decoderzeile RK3358/PX5 widerspricht Encoder RK3368/PX5; zur Prüfung erhalten.

#### 1.2.2 Codierung

|SoC|H264|H265|VP8|JPEG|
|---|---|---|---|---|
|RK3588|7680x4320@30f|7680x4320@30f|1920x1080@30f|3840x2160@30f|
|RK3576|3840x2160@60f|3840x2160@60f|N/A|3840x2160@160f|
|RK3562|1920x1080@30f|N/A|N/A|N/A|
|RK3528|1920x1080@60f|1920x1080@60f|N/A|3840x2160@30f|
|RK356X|1920x1080@60f|1920x1080@60f|1920x1080@30f|1920x1080@60f|
|RK3399|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|
|RK3328|1920x1080@30f|1920x1080@30f|1920x1080@30f|1920x1080@30f|
|RK3288|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|
|RK3368/PX5|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|
|RK3326/PX30|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|
|RK312X|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|

### 1.3 VPU-Takt

VPU ist die Video-Hardwareeinheit. Mehr VPU-/DDR-Takt kann helfen, überhöhte Frequenzen gefährden Stabilität; vor Integration testen. DDR: SDK RKDocs/common/DDR/Rockchip-Developer-Guide-DDR/.

#### 1.3.1 Abfragen

cat /d/clk/clk_summary mit diesen Knoten:

|SoC|h264_dec|h265_dec|vp9_dec|jpeg_dec|h264_enc|h265_enc|
|---|---|---|---|---|---|---|
|RK3588|rkvdec|rkvdec|rkvdec|jpeg_decoder|rkvenc|rkvenc|
|RK3576|rkvdec|rkvdec|rkvdec|jpeg|vepu|vepu|
|RK3562|rkvdec|rkvdec|rkvdec|jdec|rkvenc|×|
|RK3528|rkvdec|rkvdec|rkvdec|jpeg_decoder|rkvenc|rkvenc|
|RK356X|rkvdec|rkvdec|rkvdec|jdec|rkvenc|rkvenc|
|RK3399|vdu|vdu|vdu|vcodec|vcodec|×|
|RK3328|rkvdec|rkvdec|rkvdec|vpu|h264|h265|
|RK3288|vcodec|hevc|×|×|vcodec|×|
|RK3368/PX5|video|video|×|video|video|×|
|RK3326/PX30|vpu|vpu|×|vpu|vpu|×|
|RK312X|vdpu|vdpu|×|vdpu|vdpu|×|

```sh
cat /d/clk/clk_summary | grep rkvdec // <aclk_rkvdec0> <aclk_rkvdec1>
cat /d/clk/clk_summary | grep vcodec // <aclk_vcodec>
cat /d/clk/clk_summary | grep h265 // <aclk_h265>
```

Oben RK3588-H264-Decoding, RK3288-H264-Decoding, RK3328-H265-Encoding. // ist kein Shellkommentar; nur Befehlsteil ausführen.

#### 1.3.2 Ändern

Linux4.4(Android7.1–9.0),500M-Beispiel; kein separater IP-Takt.

```diff
--- a/drivers/video/rockchip/vcodec/vcodec_service.c
+++ b/drivers/video/rockchip/vcodec/vcodec_service.c
@@ -2307,6 +2307,7 @@ static void vcodec_set_freq_default(struct vpu_service_info
*pservice,
{
enum VPU_FREQ curr = atomic_read(&pservice->freq_status);
+ reg->freq = VPU_FREQ_500M;
if (curr == reg->freq)
return;
```

Linux4.19/5.10(Android10+) nutzt DTSI oder temporäre Knoten. Quelle sagt RK3399 „über4K“, aber Schwelle1920x1088=2088960 und zusätzliche DTS-Kommas. Erhalten, SDK prüfen. normal-rates unter Schwelle, advanced-rates darüber.

```dts
<rk3399.dtsi>
rkvdec: rkvdec@ff660000{
clock-names = "aclk_vcodec", "hclk_vcodec",
"clk_cabac", "clk_core",;
rockchip,normal-rates = <297000000>, <0>,
<297000000>, <297000000>, ;
rockchip,advanced-rates = <500000000>, <0>,
<500000000>, <500000000>;
rockchip,default-max-load = <2088960>; // 1920x1088
};
```

```sh
echo 500000000 > /proc/mpp_service/rkvdec/aclk
echo 500000000 > /proc/mpp_service/rkvdec/clk_core
echo 500000000 > /proc/mpp_service/rkvdec/clk_cabac
```

### 1.4 Ein-/Ausgabe erfassen

Bei defekten/grünen Frames Daten speichern. MediaCodec-Eingabe vor queueInputBuffer, codierte Ausgabe nach dequeueOutputBuffer, decodierte nur ohne Surface. Verzeichnis vorbereiten, Version wählen:

```sh
setenforce 0
mkdir /data/video/
```

Android12+ Codec2:

```sh
setprop vendor.dump.c2.log 0x000000f0
```

Android11 und früher OMX:

```sh
// 解码 dec_in*.bin
setprop vendor.omx.vdec.debug 0x01000000
setprop record_omx_dec_in 1
// 编码 enc_in*.bin enc_out*.bin
setprop vendor.omx.venc.debug 0x03000000
setprop record_omx_enc_in 1
setprop record_omx_enc_out 1
```

Bleibt /data/video/ leer, Schalter der unteren Bibliothek verwenden:

```sh
setenforce 0
mkdir /data/video/
setprop mpp_dump_in /data/video/mpp_dec_in.bin
setprop mpp_dump_out /data/video/mpp_dec_out.bin
setprop vendor.mpp_dump_in /data/video/mpp_dec_in.bin
setprop vendor.mpp_dump_out /data/video/mpp_dec_out.bin
setprop mpp_debug 0x600 && setprop vendor.mpp_debug 0x600
```

### 1.5 Parallele Streams

RK3399-H264 4096x2304@30fps auf1080P@30fps umrechnen:

```text
(4096x2304x30) / (1920x1088x30) = 4.5
```

Abrunden auf4, Overhead steigt mit Streamzahl. Quelle beansprucht4 unter allen Bedingungen bei extremen Bitraten; Systemlast beachten, keine ArmSoM-Garantie. rkvdec auf RK3588/RK356X/RK3399/RK3328 kann bei normalen H264/H265/VP9 darüber liegen, etwa RK3399 bis8. Prüfen:(1)Kernel-Framezeit,(2)VPU/DDR,(3)VPU nach1.3,(4)DDR.

```sh
echo 0x0100 > /sys/module/rk_vcodec/parameters/mpp_dev_debug
cat /proc/kmsg
```

Oben4.19/5.10(Android10+); für4.4(Android7.1–9.0):

```sh
echo 0x0100 > /sys/module/rk_vcodec/parameters/debug
cat /proc/kmsg
```

Acht30fps-Streams:1000/(8*30)≈4.16ms; ohne Pipelineverluste unter4ms/Frame anstreben. Taktreserve prüfen und erneut messen.

```sh
/* VPU 频率 */
$ cat /d/clk/clk_summary | grep vdu <aclk_vdu> rk3399
$ cat /d/clk/clk_summary | grep rkvdec <aclk_rkvdec> rk3588\rk3328\rk356x
/* DDR 频率 */
$ cat /sys/class/devfreq/dmc/cur_freq
```

```sh
echo performance > /sys/class/devfreq/dmc/governor
```

### 1.6 Hohe CPU-Last

Auch Lesen/Schreiben benötigt CPU. Prozess→Thread→Funktion eingrenzen. adb shell busybox top: Quellenbeispiel com.quectel.quecencdectester47.8%. App-Threads selbst analysieren, Framework-Threads über Redmine. CodecLooper dominiert im Mehrstream-Beispiel.

```sh
adb shell busybox top
top -H -p $(pidof com.quectel.quecencdectester)
```

![Abbildung 1, PDF-Seite 9 (chinesisches PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p09-2.png)

Abbildung 1, PDF-Seite 9 (chinesisches PDF)

![Abbildung 2, PDF-Seite 9 (chinesisches PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p09-3.png)

Abbildung 2, PDF-Seite 9 (chinesisches PDF)

Android Studio TraceView/Systrace sind möglich; Quelle nutzt SDK-simpleperf. PID1349 für10Sekunden aufzeichnen, dann Bericht:

```sh
simpleperf record -o /sdcard/perf.data -g -p 1349 --duration 10
simpleperf report -i /sdcard/perf.data -g caller > /sdcard/perfdata
```

![Abbildung 1, PDF-Seite 10 (chinesisches PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p10-4.png)

Abbildung 1, PDF-Seite 10 (chinesisches PDF)

CodecLooper nutzt im Beispiel15.31%, vor allem libyuv::X420ToI420. BufferMode kopiert DMA-Ausgabe zur App, die sie nicht direkt verarbeiten kann. Abschnitt2.5 ersetzt CPU-Kopie durchRGA. Gleiches Vorgehen für andere Probleme.

### 1.7 Speicherlecks

Freier Speicher sinkt bisOOM/Neustart. meminfo vorher/nachher vergleichen; stetig wachsendeRSS/PSS deuten auf Lecks.

```sh
dumpsys meminfo
showmap $(pidof xxx)
```

showmap zeigt Zuordnungen,RSS/PSS inK. dmabuf überION/DRM/dmaBufferHeap ermöglicht Zero-Copy; Allokation/Freigabe bei Initialisierung,Abbau,info-change prüfen. malloc ausalloc/malloc mitMalloc Debug prüfen. /dmabuf steht fürDMA,malloc/anon:scudo fürmalloc.

![Abbildung 1, PDF-Seite 11 (chinesisches PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p11-5.png)

Abbildung 1, PDF-Seite 11 (chinesisches PDF)

Malloc Debug prüft native Lecks,Beschädigung,Freigabe; bionic/libc/malloc_debug/README.md. BeispielmyTest:

```sh
adb shell stop
adb shell setprop libc.debug.malloc.program myTest
adb shell setprop libc.debug.malloc.options backtrace
adb shell start
#开始测试复现问题...
kill -9 $(pidof myTest)
```

Quellensnapshot /data/local/tmp/backtrace_heap.3302.txt verwendetPID3302, Parserbeispiel3378; tatsächliche Datei nutzen. $(OUT) ist Quellennotation; Umgebung prüfen. Leck anhandout_heap-Stacks beheben.

```sh
python development/scripts/native_heapdump_viewer.py --symbols $(OUT)/symbols backtrace_heap.3378.txt > out_heap.txt
```

### 1.8 Hardware-JPEG-Demo

Native MediaCodec ohneJPEG; hardware/rockchip/libhwjpeg kapseltMPP. MpiJpegEncoder codiert,MpiJpegDecoder decodiert Bilder/MJPEG. src Implementierung,inc Header,test Beispiele; readme.txt.

## 2 Codecprobleme

### 2.1 Ruckeln/A-V-Synchronität

DisplayFPS und Kernel-Framezeit erfassen:

```sh
setprop debug.sf.fps 1
logcat -c ;logcat | grep mFps
```

Kernel-Zeitbefehle in1.5:4.19/5.10 mpp_dev_debug,4.4 debug.

1. Hardwaredecoding prüfen: Apps können Software nutzen. Logcat,Format,Spezifikation und Einstellungen prüfen. Hardware-Zeitlogs zeigen Hardwarepfad; Fehlen deutet laut Quelle auf Software.
2. Decoder/Display trennen: unter33ms bei30fps beziehungsweise16ms bei60fps und dennoch Ruckeln zuerst Komposition prüfen.
3. Bildwiederholrate prüfen: falschesDTS senktHWC-Effizienz,üblicherweise60fps:

```text

```

```text
clock-frequency = (hactive + hback-porch + hfront-porch + hsync-len) * (vactive + vback-porch + vfrontporch + vsync-len) * fps
```

vfrontporch unterscheidet sich vom üblichen vfront-porch; Binding prüfen. Bei richtigem Takt Rotation,zu viele Surface-Layer und Formate prüfen. Kompositions-/HWC-Logs sammeln:

```sh
dumpsys SurfaceFlinger
adb shell "setprop sys.hwc.log 51"
adb shell "logcat -c ;logcat" > hwc
```

Typografisches Schlusszeichen wurde zuASCII korrigiert.4)Bei error frame Eingangsverluste prüfen. Dump nach1.4(Quelle fälschlich Kapitel4); H264:eseye/Vega,H265:HEVCAnalyzer. Vorschau undPOC prüfen; bei korrektem Eingang Quelle undLogcat einreichen.

![Abbildung 1, PDF-Seite 13 (chinesisches PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p13-6.png)

Abbildung 1, PDF-Seite 13 (chinesisches PDF)

### 2.2 Unscharfe/Mosaik-Aufnahme

Verlustbehaftete Kompression verliert Bilddaten. Lokale Qualität hängt oft vonQP1–51 ab:kleiner ist besser. OhneQP-Limits senkt höhere Bitrate meistQP.

1. Frame-QP mit eseye/Vega prüfen,Beispiel16–29. Blöcke>40 können unscharf werden; Bitrate/Strategie anpassen. Bei normalemQP Eingang erfassen.
2. Keine universelle Bitratentabelle:Ist≥Soll mit hohemQP deutet auf zu kleinesSoll; erhöhen. Ist<Soll:BITRATE_MODE_VBR prüfen. Ist weit überSoll:QP manuell anpassen.

![Abbildung 1, PDF-Seite 14 (chinesisches PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p14-7.png)

Abbildung 1, PDF-Seite 14 (chinesisches PDF)

3. High profile stattbaseline versuchen; CABAC verbessert Kompression/Qualität. Android12+ unterstütztQP-Limits,Max≤40 kann helfen; qp-i-min I-Minimum,qp-p-max P-Maximum. Bitrate kann überschritten werden; prüfen. Android11/früherMPP ändern.

```cpp
format->setInt32("video-qp-i-min", 10);
format->setInt32("video-qp-i-max", 40);
format->setInt32("video-qp-p-min", 10);
format->setInt32("video-qp-p-max", 40);
```

```diff
diff --git a/mpp/legacy/vpu_api_legacy.cpp b/mpp/legacy/vpu_api_legacy.cpp
index 33d08ccb..b937f0bc 100644
--- a/mpp/legacy/vpu_api_legacy.cpp
+++ b/mpp/legacy/vpu_api_legacy.cpp
@@ -173,9 +173,9 @@ static MPP_RET vpu_api_set_enc_cfg(MppCtx mpp_ctx, MppApi
*mpi, MppEncCfg enc_cf
mpp_enc_cfg_set_s32(enc_cfg, "h264:cabac_idc", 0);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_init", is_fix_qp ? qp : -1);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_min", is_fix_qp ? qp : 10);
- mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_max", is_fix_qp ? qp : 51);
+ mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_max", is_fix_qp ? qp : 40);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_min_i", 10);
- mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_max_i", 51);
+ mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_max_i", 40);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_step", 4);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_delta_ip", 3);
} break;
```

### 2.3 MediaCodec-Bitratenüberschreitung

Ab Android12 kann1080P mit Soll1Mbps über4Mbps ergeben:mediaformatshaping korrigiert ungeeigneteQP/Bitrate. VQApply berücksichtigt Breite,Höhe,bpp und Soll und erhöht gewöhnlich über width×height×bpp. Per Eigenschaft deaktivieren oder frameworks/av-Standard ändern.

```text
D VQApply : minquality/target bitrate raised from 1258291 to 4727808 bps
```

```sh
setprop debug.stagefright.enableshaping 0
```

```diff
diff --git a/media/libstagefright/MediaCodec.cpp
b/media/libstagefright/MediaCodec.cpp
index 382324a91c..dd1dfa062f 100644
--- a/media/libstagefright/MediaCodec.cpp
+++ b/media/libstagefright/MediaCodec.cpp
@@ -2054,7 +2054,7 @@ status_t
MediaCodec::setOnFirstTunnelFrameReadyNotification(const sp<AMessage> &
* MediaFormat Shaping forward declarations
* including the property name we use for control.
*/
-static int enableMediaFormatShapingDefault = 1;
+static int enableMediaFormatShapingDefault = 0;
static const char enableMediaFormatShapingProperty[] =
"debug.stagefright.enableshaping";
static void mapFormat(AString componentName, const sp<AMessage> &format, const
char *kind,
bool reverse);
```

### 2.4 Codec-Initialisierungsfehler

Bei Wiedergabe,Aufnahme oder Fotos bedeutet mpp hal xxx init failed meist einen deaktiviertenDTS-Knoten. jpegd bezeichnet JPEG-Decoding,vdpu den zu prüfenden Knoten. /proc/mpp_service sowie rk3588-evb.dtsi beziehungsweise rk3399-android.dtsi prüfen.

```text

```

```sh
ls -al /proc/mpp_service/
```

```dts
&mpp_srv {
status = "okay";
};
&vdpu {
status = "okay";
};
```

```text
E hal_h264e_vepu541: hal_h264e_vepu541_init mpp_dev_init failed. ret: -1
E mpp_enc_hal: mpp_enc_hal_init hal hal_h264e init failed ret -1
E mpp_enc_hal: mpp_enc_hal_init could not found coding type 7
```

h264e bezeichnet H.264-Encoding; vepu aktivieren:

```dts
&mpp_srv {
status = "okay";
};
&vepu {
status = "okay";
};
```

### 2.5 BufferMode-Effizienz

Ohne Surface benötigt die App Ausgabepuffer,doch framework dmaBuffer lässt sich nicht direkt übergeben. Eine zusätzlicheCPU-Kopie erhöht Framezeit und Last,besonders bei vorhandener Belastung. SurfaceMode übergibt dmaBuffer direkt zwischen Decoder/Display ohne Kopie. RGA stattCPU-Kopie kann Last und Zeit senken; [418670](https://redmine.rock-chips.com/issues/418670).

## 3 Anwendungsprobleme

### 3.1 Kodi/bilibili ohne Hardwaredecoder

Unter Android12+ wählt ijkmedia Namen mit OMX. und übersieht Codec2 c2.rk.avc.decoder. Ein temporärer Alias OMX.c2.rk.avc.decoder schafft Kompatibilität. Auch eigene Apps können betroffen sein; IJKMEDIA-Logs prüfen. Dauerhaft ist die ijkmedia-Auswahl zu korrigieren; laut Quelle wird der Übergangspatch nicht integriert. [396998](https://redmine.rock-chips.com/issues/396998).

### 3.2 WebView-Fehler/weißer Rand

AFBC auf RK3566/3568/3588/3528 ergänzt oberhalb1080P vier obere Zeilen. ImageReader/NdkImageReader muss crop beachten,sonst erscheint ein weißer Rand. Die Standardprüfung auf Ursprung null verwirft den Puffer; Rückgabe in frameworks/av entfernen:

```text
E NdkImageReader: Crop left top corner [0, 4] not at origin
```

```diff
diff --git a/media/ndk/NdkImageReader.cpp b/media/ndk/NdkImageReader.cpp
index 067c8f4ae5..6df40cc975 100644
--- a/media/ndk/NdkImageReader.cpp
+++ b/media/ndk/NdkImageReader.cpp
@@ -455,7 +455,7 @@ AImageReader::acquireImageLocked(/*out*/AImage** image,
/*out*/int* acquireFence
Point lt = buffer->mCrop.leftTop();
if (lt.x != 0 || lt.y != 0) {
ALOGE("Crop left top corner [%d, %d] not at origin", lt.x, lt.y);
- return AMEDIA_ERROR_UNKNOWN;
+ // return AMEDIA_ERROR_UNKNOWN;
}
```

Der Rand kann bleiben. Lokale Player steuern source crop; WebView erhält GraphicBuffer über getHardwareBuffer und muss crop selbst behandeln. Das Framework kann dies derzeit nicht beheben. FBC lässt sich mit möglichem Leistungsverlust abschalten. Android11/früher:hardware/rockchip/omx_il:

```diff
diff --git a/osal/Rockchip_OSAL_Android.cpp b/osal/Rockchip_OSAL_Android.cpp
index 5950cd0..ac599cf 100755
--- a/osal/Rockchip_OSAL_Android.cpp
+++ b/osal/Rockchip_OSAL_Android.cpp
@@ -317,6 +317,7 @@ OMX_BOOL Rockchip_OSAL_Check_Use_FBCMode(OMX_VIDEO_CODINGTYPE
codecId, int32_t d
OMX_U32 pValue;
OMX_U32 width, height;
+ return OMX_FALSE;
if (pPort->bufferProcessType != BUFFER_SHARE) {
return OMX_FALSE;
}
```

Android12+:vendor/rockchip/hardware/interfaces/codec2:

```diff
diff --git a/component/osal/C2RKChipCapDef.cpp
b/component/osal/C2RKChipCapDef.cpp
index 78659ab..b66fb31 100644
--- a/component/osal/C2RKChipCapDef.cpp
+++ b/component/osal/C2RKChipCapDef.cpp
@@ -297,6 +297,7 @@ uint32_t C2RKChipCapDef::getGrallocVersion() {
uint32_t C2RKChipCapDef::getFbcOutputMode(MppCodingType codecId) {
uint32_t fbcMode = 0;
+ return 0;
for (int i = 0; i < mChipCapInfo->fbcCapNum; i++) {
if (mChipCapInfo->fbcCaps[i].codecId == codecId) {
```

### 3.3 iQiyi-Absturz im Dauertest

Unter Android10+ setzt Werbung MediaPlayer Surface spät:BufferMode wird SurfaceChange,neue Puffer sind nötig,alte freizugeben. Nicht zurückgesetzte Referenzen haltenDMA-Puffer und verursachen lowmem/Abstürze. Stetig wachsende AnzahlVPU-gebundenerDMA-Puffer bestätigt den Fehler. [423914](https://redmine.rock-chips.com/issues/423914).

```sh
cat /d/dma_buf/bufinfo
```

### 3.4 Laufende Vorschaubilder schlagen fehl

MediaMetadataRetriever ist während Wiedergabe deaktiviert,um Bandbreite zu sparen und Vordergrundwiedergabe zu schützen. Android12+ bietet die folgende Eigenschaft,auch in system prop verwendbar. Ältere Versionen benötigen ein Bibliotheksupdate überRedmine.

```text
MediaMetadataRetrieverJNI( 1574): getFrameAtTime: videoFrame is a NULL pointer
```

```sh
setprop rt_retriever_enable 1
```

### 3.5 RK356X:grüne Aufnahme/RGA

```text
E/rga_mm ( 0): RGA_MMU unsupported Memory larger than 4G!
E/rga_mm ( 0): scheduler core[4] unsupported mm_flag[0x0]!
E/rga_mm ( 0): rga_mm_map_buffer map dma_buf error!
E/rga_mm ( 0): job buffer map failed!
E/rga_mm ( 0): src channel map job buffer failed!
E/rga_mm ( 0): failed to map buffer
```

RGA2 adressiert32Bit,Puffer müssen unter4G liegen. RK356X-Encoding braucht ausgerichtete Puffer;Codec nutztRGA-Vorverarbeitung. src/dst über4G scheitern;Gralloc übernimmt die Zuweisung.

1. dst mit GraphicBufferAllocator und GRALLOC_USAGE_WITHIN_4G anlegen.
2. src stammt vomSurface,dem BufferQueue-Produzenten;Codec ist Verbraucher. Verbraucher-usage beeinflusst Produzentenzuweisung. GRALLOC_USAGE_HW_VIDEO_ENCODER kennzeichnet Hardwareencoding;Gralloc muss bei diesemusage aufRK356X unter4G zuweisen. [425094](https://redmine.rock-chips.com/issues/425094).

### 3.6 Medienformate deaktivieren

MediaPlayer kann Formate per Konfiguration ausschließen. Der Text nenntRK3588 sowieVC1/VP9,AAC/MP3,der Patch jedochRK3566/RK3567/RK3568;SDK prüfen. Die regionaleVP9-Urheberrechtsaussage wird nicht als Rechtsbewertung übernommen. device/rockchip/common:

```diff
diff --git a/rt_video_config.xml b/rt_video_config.xml
index 067b81a8..46ec980b 100644
--- a/rt_video_config.xml
+++ b/rt_video_config.xml
@@ -224,6 +224,7 @@
<chip name="RK3566,RK3567,RK3568">
<include
name="mpeg1,mpeg2,mpeg4,vp8,h264_8k_10bit_high422,hevc_8k_10bit"/>
<include name="vp9_4k_10bit"/>
+ <forbid name="vc1,vp9"/>
</chip>
<chip name="RK3528">
diff --git a/rt_audio_config.xml b/rt_audio_config.xml
index 182e2a83..af645673 100644
--- a/rt_audio_config.xml
+++ b/rt_audio_config.xml
@@ -34,4 +34,10 @@
<formats>
</formats>
</bitstream>
+ <forbid>
+ <formats>
+ <format>AAC</format>
+ <format>MP3</format>
+ </formats>
+ </forbid>
</sound>
```

Zum Prüfen /system/etc/rt_audio_config.xml und rt_video_config.xml aktualisieren,Wiedergabe neu starten. Weitere auswählbare Formate:

```text
Video: mpeg1, mpeg2, h263, mpeg4, wmv1, wmv2, wmv3, h264, vp8, vp9, hevc, vc1, avs, avs+, avs2, flv1, av1
Audio: AAC, APE, MP3, WMALOSSLESS, WMAPRO, WMAV1, WMAV2, ADPCM_IMA_QT, VORBIS, PCM_S16LE, PCM_S24LE, FLAC, MP1, MP2, AMR_WB, AMR_NB
```

### 3.7 Rötliche Camera4K-Wiedergabe

Ohne colorAspect wählt Android auflösungsabhängigBT2020;HDR-Geräte aktivierenHDR,sodass Camera/CameraRecorder4K rötlicher/kräftiger wirkt. Die Quelle beschreibt dies als Displayverstärkung. Falls unerwünscht,in frameworks/av setDefaultCodecColorAspectsIfNeeded aufBT709 ändern;exakter Schwellenwert im Code:

```diff
diff --git a/media/libstagefright/foundation/ColorUtils.cpp
b/media/libstagefright/foundation/ColorUtils.cpp
index fa722b5572..f253b68780 100644
--- a/media/libstagefright/foundation/ColorUtils.cpp
+++ b/media/libstagefright/foundation/ColorUtils.cpp
@@ -377,8 +377,8 @@ void ColorUtils::setDefaultCodecColorAspectsIfNeeded(
// Default to BT2020, BT709 or BT601 based on size. Allow 2.35:1 aspect
ratio. Limit BT601
// to PAL or smaller, BT2020 to 4K or larger, leaving BT709 for all
resolutions in between.
if (width >= 3840 || height >= 3840 || width * (int64_t)height >= 3840 *
1634) {
- primaries = ColorAspects::PrimariesBT2020;
- coeffs = ColorAspects::MatrixBT2020;
+ primaries = ColorAspects::PrimariesBT709_5;
+ coeffs = ColorAspects::MatrixBT709_5;
} else if ((width <= 720 && height > 480 && height <= 576)
|| (height <= 720 && width > 480 && width <= 576)) {
primaries = ColorAspects::PrimariesBT601_6_625;
```

### 3.8 Schwarzbild beim Videowechsel

Standardmäßig bleibt das letzte Bild bis zum ersten Bild des nächsten Videos stehen. Schwarzbildmodus fügt beim Ende einen schwarzen Surface-Frame ein. Android MediaPlayer kann die Eigenschaft setzen oder in system prop aufnehmen.

```sh
setprop media.rockit.video.black_frame 1
```

## Referenzen

[ArmSoM-Dokumentation](https://docs.armsom.org/). Redmine verweist auf Quellpatches und kann Anmeldung verlangen;Patchbeschaffung oder Hardwareprüfung wird nicht behauptet.

{% endraw %}
