---
title: "Herstellerparameter für MediaCodec unter Rockchip Android"
description: "Herstellerparameter für MediaCodec unter Rockchip Android"
excerpt: "Herstellerparameter für MediaCodec unter Rockchip Android"
translation_key: "270-rockchip-mediacodec-vendor-parameters"
slug: "270-rockchip-mediacodec-vendor-parameters"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Dieser Artikel enthält sämtliche Decoder- und Encoder-Erweiterungen aus der chinesischen Quelle RK-SM-YF-E12 V1.0.0. Grundlage ist Codec2 unter Android ab 12; genannt werden Linux 4.19, 5.10 und 6.1. Der Tunnelmodus verlangt zusätzlich Kernel ≥ 5.10. „Alle Chips“ beschreibt den Plattformumfang, keine geprüfte Unterstützung jeder ArmSoM-Platine. SoC, Android-BSP, Treiber und Schnittstellen müssen passen. Es erfolgte keine Hardwareprüfung; Leistungsangaben stammen aus der Quelle. Die einzige technische Grafik besitzt bereits englische Beschriftungen und bleibt in allen Sprachen erhalten.

## 1 Decoder-Erweiterungen

### 1.1 Decodierung mit geringer Latenz

Schnelles internes Frame-Parsing und das Ignorieren der Referenzreihenfolge ermöglichen eine sofortige Bildausgabe. Geeignet für Bildschirmübertragung und Livestreams. Das Verfahren „ein Eingang, ein Ausgang“ eignet sich nicht für B-Frames: Vorwärts- und Rückwärtsreferenzen können die Ausgabereihenfolge stören.

```java
mediaFormat.setInteger("low-latency", 1);
```

```cpp
c2_info("enable lowLatency, enable mpp fast-out mode");
```

Die vorstehende Protokollmeldung bestätigt die Aktivierung.

### 1.2 Multimedia-Tunneling

Der Decoder stellt einen direkten Tunnel zum Displaytreiber unter Umgehung von Android SurfaceFlinger her. Bei hoher Bitrate und Bildrate sinkt der Softwareaufwand, Ressourcen werden frei; für geringe Latenz erfolgt die Synchronisation direkt zum VOP. Siehe [Android-Dokumentation](https://source.android.google.cn/docs/devices/tv/multimedia-tunneling?hl=zh-cn).

#### Patch-Konfiguration

Kernel ≥ 5.10 ist erforderlich. Zuerst `rkvtunnel` im Board-DTS aktivieren:

```diff
diff --git a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
index 8c1d0f37b8a3..8bd65c9ed85b 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
@@ -846,6 +846,10 @@ &usbhost_dwc3_0 {
     status = "disabled";
 };
+&rkvtunnel {
+    status = "okay";
+};
+
 /* vp0 & vp3 are not used on this board */
 &vp0 {
     /delete-property/ rockchip,plane-mask;
```

Anschließend die Tunnel-Wiedergabe in `media_codecs.xml` deklarieren. Das RK3588-AVC-Beispiel an den jeweiligen Chip und Decoder anpassen.

```diff
~/3_android_14/vendor/rockchip/common/vpu/etc$ git diff .
diff --git a/vpu/etc/media_codecs_c2_rk3588.xml b/vpu/etc/media_codecs_c2_rk3588.xml
index 28c1f947..d01da2d5 100644
--- a/vpu/etc/media_codecs_c2_rk3588.xml
+++ b/vpu/etc/media_codecs_c2_rk3588.xml
@@ -20,6 +20,7 @@
 </Settings>
 <Decoders>
     <MediaCodec name="c2.rk.avc.decoder" type="video/avc">
+        <Feature name="tunneled-playback" required="true"/>
         <Alias name="OMX.rk.video_decoder.avc" />
         <Limit name="size" min="64x64" max="7680x4320" />
         <Limit name="alignment" value="2x2" />
```

#### Anwendung

Genannt werden AUDIO_HW_SYNC, HW_AV_SYNC und REALTIME; die ersten beiden benötigen den System-Tunertreiber. Die beschriebene Implementierung unterstützt nur Echtzeit-Rendering: Latenz hat Vorrang, decodierte Bilder werden sofort angezeigt. Pseudocode:

```java
// 1. get tunneled codec name
format.setFeatureEnabled(MediaCodecInfo.CodecCapabilities.FEATURE_TunneledPlayback, true);
MediaCodecList mcl = new MediaCodecList(MediaCodecList.ALL_CODECS);
String codecName = mcl.findDecoderForFormat(format);
// 2. start tunneled video playback
MediaCodec mCodec = MediaCodec.createByCodecName(codecName);
mCodec.configure(format, mSurface, null, 0);
mCodec.start();
while (!isEOS) {
    int inIndex = mCodec.dequeueInputBuffer(0);
    if (inIndex >= 0) {
        ByteBuffer buffer = mCodec.getInputBuffer(inIndex);
        int sampleSize = mExtractor.readSampleData(buffer, 0);
        if (sampleSize > 0) {
            mCodec.queueInputBuffer(inIndex, 0, sampleSize,
                mExtractor.getSampleTime(), 0);
            mExtractor.advance();
        } else {
            mCodec.queueInputBuffer(inIndex, 0, 0,
                0, MediaCodec.BUFFER_FLAG_END_OF_STREAM);
            isEOS = true;
        }
    }
}
mCodec.stop();
mCodec.release();
```

### 1.3 H264-Kontinuitätsprüfung ignorieren

Konferenz- und Überwachungsstreams können Frames oder Pakete verlieren. Standardmäßig markiert ein POC-Sprung die gesamte GOP als fehlerhaft; ihre Error-Frames werden bis zum nächsten Keyframe verworfen. Hardwarekorrektur kann geringe Verluste teilweise ausgleichen, sodass die Prüfung deaktiviert werden kann. Starke Verluste verursachen weiterhin Bildfehler. Die POC-Prüfung gehört zum Standardablauf; die Abschaltung ist daher eine ausdrückliche Benutzeroption. Bei Ruckeln durch geringe Verluste folgende Einstellung und Protokollkontrolle verwenden.

```cpp
mediaFormat.setInteger("vendor.disable-dpb-check.value", 1);
c2_info("disable poc discontinuous check");
```

## 2 Encoder-Erweiterungen

### 2.1 Zeitlich skalierbare Codierung (TSVC)

SVC zerlegt Video in kombinierbare Qualitätsstufen mit zusätzlicher Auflösung oder flüssigerer Bewegung. Bei schlechtem Netz wird die Basisschicht, bei gutem Netz die Erweiterung decodiert. Bei Fehlern können Auflösung und Bildrate stufenweise sinken; die Quelle nennt 20 % tolerierten Paketverlust. Ihre Aussage, untere Schichten nutzten höhere zur Fehlerkorrektur, bleibt als Quellenbeschreibung erhalten und wurde nicht unabhängig geprüft. SVC wird bei Überwachung und Konferenzen eingesetzt, etwa Tencent Rooms und Microsoft Teams. Rockchip bietet TSVC mit 2–4 Schichten; das Beispiel wählt drei. Über Protokoll oder erzeugten Bitstream prüfen.

```cpp
mediaFormat->setString("ts-schema", "android.generic.3");
c2_info("setupTemporalLayers: layers %d", layerCount);
```

### 2.2 QP-Bereich

QP liegt zwischen 1 und 51. Ein kleinerer QP erhöht gewöhnlich Qualität und Bitrate, ein größerer senkt beide. Qualität und Dateigröße abwägen. Das Beispiel setzt 10–40 für I-Frames und 10–30 für P-Frames; per Protokoll oder Bitstream prüfen.

```cpp
mediaFormat->setInt32("video-qp-i-min", 10);
mediaFormat->setInt32("video-qp-i-max", 40);
mediaFormat->setInt32("video-qp-p-min", 10);
mediaFormat->setInt32("video-qp-p-max", 30);
c2_info("setupQp: qpInit %d i %d-%d p %d-%d", qpInit, iMin, iMax, pMin, pMax);
```

### 2.3 Rotation

Unterstützt werden 90, 180 und 270 Grad. Das Beispiel dreht die Ausgabe um 90 Grad im Uhrzeigersinn; im Protokoll prüfen.

```cpp
mediaFormat->setInt32("rotation", 90);
c2_info("setupRotation: degrees %d", degrees);
```

### 2.4 Skalierung

Die Encoderhardware selbst führt diese Skalierung nicht aus. RGA verarbeitet die Eingabe vor, wodurch die Codierzeit etwas steigen kann. Beispiel für 720P-Ausgabe:

```cpp
mediaFormat->setInt32("vendor.input-scalar.width", 1280);
mediaFormat->setInt32("vendor.input-scalar.height", 720);
c2_info("setupBaseCodec: coding %s w %d h %d hor %d ver %d",
        toStr_Coding(mCodingType), mSize->width, mSize->height, mHorStride,
        mVerStride);
```

### 2.5 Mehrere Slices

Die Quelle bezeichnet Makroblöcke (MB) als kleinste H264/H265-Einheit: aufeinanderfolgende MB bilden einen Slice mit einem NALU. Standardmäßig enthält ein Slice ein ganzes Bild, kann aber auch nur einen Teil enthalten. Geteilt wird nach MB-Anzahl oder aufsummierten Bytes. Eigene Header erhöhen bei feinerer Teilung die Bitrate. Diese Makroblockterminologie anhand des tatsächlichen Codecstandards prüfen.

Anwendungen: (1) MTU-Limits, etwa 1500-Byte-Pakete; (2) parallele Slice-Codierung auf Mehrkern-Encodern wie RK3588; (3) kleinere Korrekturbereiche und geringerer Aufwand bei Netzverlusten. Standardmäßig wird byteweise geteilt:

```cpp
mediaFormat->setInt32("vendor.slice-size.value", 1500);
c2_info("setupSliceSize: slice-size %d", c2Size->value);
```

### 2.6 Übergroße Frames erneut codieren

Große Frames belasten das Netz; die Option glättet die Bitrate, weitere Versuche können aber die Frame-Zeit erhöhen. Die Quelle nennt „höchstens drei Wiederholungen“, setzt im Code jedoch `1500`. Dieser Widerspruch bleibt erhalten; im SDK prüfen und nicht als bestätigte Drei-Versuche-Konfiguration verwenden.

```cpp
mediaFormat->setInt32("vendor.reenc-times.value", 1500);
c2_info("setupReencTimes: reenc-times %d", reencTime->value);
```

### 2.7 Intelligente Codierung auf RK3576/RK3588

Für geringere Bandbreite und höhere Bildqualität:

- 1.0 passt die Quantisierung anhand Inter-/Intra-Komplexität, ROI-Anteil und Bitratengrenzen an.
- 2.0 nutzt mehr Statistiken und stabilere Ratenregelung für statische, schwach texturierte Szenen.
- 3.0 erkennt ROI mit neuronalen Netzen und verbessert die Qualität.

Die Quelle beschränkt die Unterstützung auf RK3576/RK3588. MediaCodec-Parameter bieten 1.0 und 2.0; genannt werden 21%+, 85%+ und 90%+ Bitratenoptimierung bei starker Bewegung, geringer Bewegung und statischen Szenen. Dies sind keine ArmSoM-Messungen. Das Beispiel priorisiert Qualität bei Bewegung.

```cpp
mediaFormat->setInt32("vendor.super-encoding-mode.value", 1);
// 设置值：
// 1 ===== 普通运动场景，画质优先，追求更高的 psnr 和 vmaf 值
// 2 ===== 普通运动场景，码率优先，追求更高的视频压缩率
// 3 ===== IPC 相对静止场景，画质优先，追求更高的 psnr 和 vmaf 值
// 4 ===== IPC 相对静止场景，码率优先，追求更高的视频压缩率
c2_info("setupSuperMode: setup super mode %d", superMode);
```

Modi 1/2 priorisieren Qualität/Bitrate bei normaler Bewegung, 3/4 bei relativ statischen IPC-Szenen. Qualitätsvorrang zielt auf höhere PSNR/VMAF-Werte, Bitratenvorrang auf stärkere Kompression.

### 2.8 Microsoft-MVCT-Protokollzertifizierung

![MVCT-Erweiterungsarchitektur (englische Grafik im chinesischen PDF)](/docs/rockchip-mediacodec-vendor-parameters/images/pdf-p08-1.png)

MVCT-Erweiterungsarchitektur (englische Grafik im chinesischen PDF)

MVCT (Microsoft Codec Validation Tool) ist der Codec-Protokollteil der Teams-Zertifizierung: TSVC, lange/kurze Referenzframes, QP je Frame, mehrere Slices sowie dynamische Bitrate/Auflösung. Die anspruchsvolle, langwierige Zertifizierung betrifft Medien, Kamera und Audio:

1. MVCT: Erweiterungen implementieren, Prefix-NAL-Informationen ergänzen und sämtliche Tests bestehen.
2. VCT: parallele Codecs und Displays unter Last testen; Leistung, CPU- und Speichernutzung müssen normal bleiben.
3. Hardwarezertifizierung: Audio, Kameras, Optik und weitere Hardware.

Die Quelle nennt Protokollunterstützung für RK3588, RK3399 und PX30 sowie entsprechende Teams-Geräte; RK3588 werde von Microsoft als inländischer Chip empfohlen. Dies bestätigt keine Zertifizierung eines ArmSoM-Produkts. Die Quelle verwendet auch MCVT; ihr Werkzeuglink bleibt erhalten.

[MVCT-Testwerkzeug (Quellenlink)](https://install.appcenter.ms/orgs/ic3-media-platform/apps/microsoft-codec-validation-tool-mcvt/distribution_groups/external%20partners) · [ArmSoM-Dokumentation](https://docs.armsom.org/)

{% endraw %}
