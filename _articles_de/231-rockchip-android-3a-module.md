---
title: "Entwicklerhandbuch zum Rockchip Android-3A-Modul"
description: "Entwicklerhandbuch zum Rockchip Android-3A-Modul — V1.0.0"
excerpt: "Entwicklerhandbuch zum Rockchip Android-3A-Modul"
translation_key: "231-rockchip-android-3a-module"
slug: "231-rockchip-android-3a-module"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, AEC]
---

{% raw %}

# Entwicklerhandbuch zum Rockchip Android-3A-Modul

Vollständige technische Ausgabe der vier Kapitel aus der chinesischen Quelle RK-KF-YF-793 V1.0.0 vom : Kompilierung, Aktivierung, Parameter und Fehlerbehebung. Die Quelltabelle nennt alle Chips und Kernelversionen; das ist der historische Geltungsbereich, keine aktuelle Kompatibilitätszusage. Es existiert nur eine chinesische Quelle, keine englischen Originalbilder. Monospace-Audiopfaddiagramme bleiben editierbarer Code und werden durch Originalausschnitte des chinesischen PDF ergänzt; keine behauptete Bildlokalisierung. Rechts-, Zielgruppen-, Revisions- und doppelte Inhaltsangaben entfallen, technische Parameter nicht. Keine Befehle, Aufnahmen oder Hardwaretests wurden ausgeführt.

Redaktionelle Hinweise: Seitengetrennte Codeblöcke/Tabellen wurden verbunden, UUID-Umbrüche und das letzte Zeichen von Überschrift 4.1 repariert. Leere Beschreibungen für attenuate_time und fünf DOA-Parameter bleiben wie im Original leer. supEnergy2 nennt „Punkt 1“; fRk1/fRk2 nennen eine unwirksame Expansionssteigung; Schreibweisen HardThreshold/PrioriRatio bleiben ohne Vermutung über die Algorithmik erhalten. Codekommentare, UUIDs, Parameternamen, Logs und ursprüngliche Auslassungen bleiben unverändert. Sicherheit: adb root/remount und setenforce 0 nur auf autorisierten Debuggeräten; letzteres deaktiviert SELinux-Erzwingung, daher nach Tests die Richtlinie wiederherstellen. Audiodumps können private Aufnahmen enthalten: Zugriff beschränken und nicht mehr benötigte Dateien löschen.

<!-- source:cn p2 unit:0 -->

## 1. Kompilierung

<!-- source:cn p3 unit:1 -->

### 1.1 BoardConfig.mk des Projekts finden

<!-- source:cn p3 unit:2 -->

Der Pfad von BoardConfig.mk hängt vom Chip und dem mit lunch gewählten product ab. Beispiel: Chip rk3588, product rk3588_u.

<!-- source:cn p3 unit:3 -->

```text
# echo $TARGET_PRODUCT
# rk3588_u
```

<!-- source:cn p3 unit:4 -->

Dann liegt BoardConfig.mk unter device/rockchip/rk3588/rk3588_u/BoardConfig.mk.

<!-- source:cn p3 unit:5 -->

### 1.2 Build-Schalter hinzufügen

<!-- source:cn p3 unit:6 -->

Den folgenden Schalter in BoardConfig.mk eintragen, damit hardware/rockchip/audio/preprocess kompiliert wird.

<!-- source:cn p3 unit:7 -->

```text
BOARD_USE_AUDIO_PREPROCESS := true
```

<!-- source:cn p3 unit:8 -->

## 2. Aktivierung

<!-- source:cn p3 unit:9 -->

### 2.1 Effekte deklarieren

<!-- source:cn p3 unit:10 -->

In frameworks/av/media/libeffects/data/audio_effects.xml die folgende Effektsammlung deklarieren.

<!-- source:cn p3 unit:11 -->

```text
<libraries>
    <!-- 保留已有内容, 添加下面的配置项 -->
    <library name="rkpreprocess" path="librkpreprocess.so"/>
</libraries>
<effects>
    <!-- 保留已有内容, 添加下面的配置项 -->
    <effect name="preproc_aec_normal" library="rkpreprocess" uuid="bb392ec0-8d4d-11e0-a896-0002a5d5c51b"/>
    <effect name="preproc_aec_delay" library="rkpreprocess" uuid="55fa4ede-4adb-45fe-80b9-0002a5d5c51b"/>
    <effect name="preproc_aec_array_reset" library="rkpreprocess"
uuid="49cd17f2-819f-4acd-9541-0002a5d5c51b"/>
    <effect name="preproc_bf_fast_aec" library="rkpreprocess" uuid="b5bfc822-0b26-4230-adcb-0002a5d5c51b"/>
    <effect name="preproc_bf_wakeup" library="rkpreprocess" uuid="9ed2a703-5336-4a49-9bbf-0002a5d5c51b"/>
    <effect name="preproc_bf_dereverb" library="rkpreprocess" uuid="bd266323-f95b-4c4f-ab34-0002a5d5c51b"/>
    <effect name="preproc_bf_nlp" library="rkpreprocess" uuid="53e4a6d1-4e6b-4421-afbc-0002a5d5c51b"/>
    <effect name="preproc_bf_aes" library="rkpreprocess" uuid="3ad36ef7-2f2a-42cc-afa3-0002a5d5c51b"/>
    <effect name="preproc_bf_agc" library="rkpreprocess" uuid="aa8130e0-66fc-11e0-bad0-0002a5d5c51b"/>
    <effect name="preproc_bf_anr" library="rkpreprocess" uuid="20b2732e-28e9-4b6b-968a-0002a5d5c51b"/>
    <effect name="preproc_bf_gsc" library="rkpreprocess" uuid="19d4a390-7e23-488b-8568-0002a5d5c51b"/>
    <effect name="preproc_bf_gsc_method" library="rkpreprocess" uuid="79dbccc7-d690-4ed3-be87-0002a5d5c51b"/>
    <effect name="preproc_bf_fix" library="rkpreprocess" uuid="8e8fe0d9-e335-4a75-847a-0002a5d5c51b"/>
    <effect name="preproc_bf_dtd" library="rkpreprocess" uuid="97ef38d0-9346-48d3-aeed-0002a5d5c51b"/>
    <effect name="preproc_bf_cng" library="rkpreprocess" uuid="c0c12199-fccb-45a0-a912-0002a5d5c51b"/>
    <effect name="preproc_bf_eq" library="rkpreprocess" uuid="5f4428b2-6827-4a06-842f-0002a5d5c51b"/>
    <effect name="preproc_bf_chn_select" library="rkpreprocess" uuid="874978b4-1b82-470f-be80-0002a5d5c51b"/>
    <effect name="preproc_bf_howling" library="rkpreprocess" uuid="22075603-4d9d-40a6-bfac-0002a5d5c51b"/>
    <effect name="preproc_bf_doa" library="rkpreprocess" uuid="50404545-a180-40ad-a8f4-0002a5d5c51b"/>
    <effect name="preproc_bf_wind" library="rkpreprocess" uuid="2b8fea18-547e-4af7-85c9-0002a5d5c51b"/>
    <effect name="preproc_bf_ainr" library="rkpreprocess" uuid="a2913959-f123-43bc-ad9c-0002a5d5c51b"/>
    <effect name="preproc_rx_anr" library="rkpreprocess" uuid="9b6b4c6f-9fba-453b-9f33-0002a5d5c51b"/>
    <effect name="preproc_rx_howling" library="rkpreprocess" uuid="f55efb11-dc37-4844-a160-0002a5d5c51b"/>
    <effect name="preproc_ref_hw" library="rkpreprocess" uuid="b95396ba-60ed-424d-8ec7-0002a5d5c51b"/>
    <effect name="preproc_ref_sw_dlp" library="rkpreprocess" uuid="7583028a-e283-4cb5-9c0f-0002a5d5c51b"/>
    <effect name="preproc_ref_sw_alp_playback" library="rkpreprocess"
uuid="d3cb7c9b-79a1-4a84-b26c-0002a5d5c51b"/>
    <effect name="preproc_ref_sw_alp_capture" library="rkpreprocess"
uuid="4f7f9f58-122b-4dc6-831d-0002a5d5c51b"/>
</effects>
```

<!-- source:cn p4 unit:13 -->

### 2.2 Effekte aktivieren

<!-- source:cn p4 unit:14 -->

Einzelheiten stehen in Rockchip_Developer_Guide_Microphone_Array_Tuning.pdf. Vor der Aktivierung sind zwei Änderungen erforderlich:

<!-- source:cn p4 unit:15 -->

1) Die Aufnahmerahmenlänge in tinyalsa_hal auf 16 ms setzen und abrunden.

<!-- source:cn p4 unit:16 -->

```text
period_size = (int)(rate * 0.016 / 4) * 4
```

<!-- source:cn p4 unit:17 -->

Bei 48000 Hz gilt period_size = (int)(48000 * 0.016 / 4) * 4 = 768. Bei 44100 Hz gilt period_size = (int)(44100 * 0.016 / 4) * 4 = 704. Anschließend die entsprechende pcm config in hardware/rockchip/audio/tinyalsa_hal/audio_hw.c ändern.

<!-- source:cn p4 unit:18 -->

```text
static struct pcm_config pcm_config_in = {
    // ...
    .rate = 48000,
    .period_size = 768,
};
```

<!-- source:cn p4 unit:19 -->

2) Die Anzahl der MIC-Kanäle ändern.

<!-- source:cn p5 unit:20 -->

Nach Prüfung der MIC-Kanalzahl folgende Konfiguration anpassen; Beispiel für zwei MIC-Kanäle in hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p5 unit:21 -->

```text
#define PCM_CAPTURE_CHANNELS 2
```

<!-- source:cn p5 unit:22 -->

Ein einzelnes MIC wird derzeit als zwei Kanäle behandelt.

<!-- source:cn p5 unit:23 -->

#### 2.2.1 AEC

<!-- source:cn p5 unit:24 -->

| <code>effect</code> | Beschreibung |
| --- | --- |
| <code>preproc_aec_normal</code> | AEC-Modul |
| <code>preproc_aec_delay</code> | AEC-Untermodul zur Verzögerungsschätzung |
| <code>preproc_aec_array_reset</code> | AEC-Eingangsaudiokanäle umordnen |
| <code>preproc_ref_hw</code> | Hardware-Rückführsignal |
| <code>preproc_ref_sw_dlp</code> | Software-Rückführung über DLP |
| <code>preproc_ref_sw_alp_playback</code> | Software-Rückführung: Aloop-Daten puffern |
| <code>preproc_ref_sw_alp_capture</code> | Software-Rückführung: Aloop-Daten erfassen |

<!-- source:cn p5 unit:25 -->

AEC benötigt ein rückgeführtes Referenzsignal zur Echounterdrückung. Daher entsprechend dem tatsächlichen Audiopfad bzw. der Topologie konfigurieren.

<!-- source:cn p5 unit:26 -->

1) Hardware-Rückführung. In den Diagrammen bezeichnet [L1][R1]... Referenzdaten, die vor dem SPK zu einer Audioschnittstelle (CPU DAI1) zurückgeführt werden; [L2][R2]... sind MIC-Daten.

<!-- source:cn p5 unit:27 -->

```text
HAL                 | Kernel                             | Hardware
                    |                                    |
                    |                      +----------+  |
+----------------+  | [L1][R1]...          | CPU DAI0 |  |               +-----+
| Output Stream  *------------------------>*          *----\------------>* SPK |
+----------------+  |                      +----------+  |  \            +-----+
                    |                                    |  |(Wired)
                    |                      +----------+  |  |
+----------------+  | [L2][R2][L1][R1]...  | CPU DAI1 |  |  v [L2][R2]...+-----+
| Input Stream   *<========================*          *<====+<-----------* MIC |
+----------------+  |                      +----------+  |               +-----+
                    |                                    |
```

![Audio](/docs/rockchip-android-3a-module/assets/cn-diagram-27.png)

<!-- source:cn p5 unit:28 -->

```text
HAL                 | Kernel                             | Hardware
                    |                                    |
                    |                      +----------+  |
+----------------+  | [L1][R1]...          | CPU DAI0 |  |               +-----+
| Output Stream  *------------------------>*          *----\------------>* SPK |
+----------------+  |                      +----------+  |  \            +-----+
                    |                                    |  |
                    |                     +------------+ |  |(Wired)
                    |                     | Combo DAI  | |  |
                    |                     |+----------+| |  |
                    |                     || CPU DAI1 || |  /
                    |                     ||          *<---/
+----------------+  | [L2][R2][L1][R1]... |+----------+| |
| Input Stream   *<=======================*            | |
+----------------+  |                     |+----------+| |
                    |                     || CPU DAI2 || |    [L2][R2]...+-----+
                    |                     ||          *<-----------------* MIC |
                    |                     |+----------+| |               +-----+
                    |                     +------------+ |
```

![Audio](/docs/rockchip-android-3a-module/assets/cn-diagram-28.png)

![Audio](/docs/rockchip-android-3a-module/assets/cn-diagram-29.png)

<!-- source:cn p6 unit:30 -->

Die Referenzkanalzahl ändern; Beispiel: zwei Referenzkanäle in hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p6 unit:31 -->

```text
#define PCM_REFERENCE_CHANNELS 2
```

<!-- source:cn p6 unit:32 -->

In frameworks/av/media/libeffects/data/audio_effects.xml die entsprechenden Streams an folgende Effekte binden.

<!-- source:cn p6 unit:33 -->

```text
<!-- 如果没有声明 preprocess, 则直接添加下面的配置, 并忽略下面的注释 -->
<preprocess>
    <stream type="mic">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_aec_normal"/>
        <apply effect="preproc_ref_hw"/>
    </stream>
    <stream type="voice_communication">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_aec_normal"/>
        <apply effect="preproc_ref_hw"/>
    </stream>
</preprocess>
```

<!-- source:cn p6 unit:34 -->

2) Software-Rückführung über DLP gilt, wenn Wiedergabe und Aufnahme denselben cpu dai verwenden. [L1][R1]... sind in DLP gepufferte Referenzdaten, [L2][R2]... MIC-Daten.

<!-- source:cn p6 unit:35 -->

```text
HAL                 | Kernel                             | Hardware
                    |                                    |
                    |                      +----------+  |
+----------------+  | [L1][R1]...          | CPU DAI0 |  |
| Output Stream  *-------------------------*---\      |  |
+----------------+  |                      |    \     |  |
                    |                      |    |(DLP)|  |
+----------------+  | [L2][R2][L1][R1]...  |    v     |  |  [L2][R2]...  +-----+
| Input Stream   *<========================*====+<----*------------------* MIC |
+----------------+  |                      |          |  |               +-----+
                    |                      +----------+  |
```

![Audio](/docs/rockchip-android-3a-module/assets/cn-diagram-35.png)

<!-- source:cn p6 unit:36 -->

Die Kernelkonfiguration zum Kompilieren von DLP ändern.

<!-- source:cn p6 unit:37 -->

```text
CONFIG_SND_SOC_ROCKCHIP_DLP_PCM
```

<!-- source:cn p6 unit:38 -->

In der dts-Konfiguration DLP am betreffenden cpu dai aktivieren.

<!-- source:cn p7 unit:39 -->

```text
&i2s {
        rockchip,digital-loopback;
};
```

<!-- source:cn p7 unit:40 -->

Mögliche cpu dai sind i2s0_8ch, i2s1_8ch, i2s2_2ch, i2s3_2ch, sai0, sai1 usw. Die zugehörige Route in tinyalsa_hal ergänzen. Soundkartennamen verweisen auf unterschiedliche Konfigurationsdateien; sound_card_config_list prüfen. Ohne Treffer wird default_config.h verwendet. Beispiel: zwei MIC- plus zwei Referenzkanäle.

<!-- source:cn p7 unit:41 -->

```text
diff --git a/tinyalsa_hal/codec_config/default_config.h
b/tinyalsa_hal/codec_config/default_config.h
index a554492..114e3d2 100755
--- a/tinyalsa_hal/codec_config/default_config.h
+++ b/tinyalsa_hal/codec_config/default_config.h
@@ -198,6 +202,10 @@ const struct config_control
default_main_mic_capture_controls[] = {
         .ctl_name = "Capture MIC Path",
         .str_val = "Main Mic",
     },
+    {
+        .ctl_name = "Software Digital Loopback Mode",
+        .str_val = "4CH: 2 Mics + 2 Loopbacks",
+    },
 };

 const struct config_control default_hands_free_mic_capture_controls[] = {
```

<!-- source:cn p7 unit:42 -->

Die verfügbaren Optionen folgen; passend zur Anzahl der MIC- und Referenzkanäle konfigurieren.

<!-- source:cn p7 unit:43 -->

```text
static const char *const dlp_text[] = {
        "Disabled",
        "2CH: 1 Loopback + 1 Mic",
        "2CH: 1 Mic + 1 Loopback",
        "2CH: 1 Mic + 1 Loopback-mixed",
        "2CH: 2 Loopbacks",
        "4CH: 2 Mics + 2 Loopbacks",
        "4CH: 2 Mics + 1 Loopback-mixed",
        "4CH: 4 Loopbacks",
        "6CH: 4 Mics + 2 Loopbacks",
        "6CH: 4 Mics + 1 Loopback-mixed",
        "6CH: 6 Loopbacks",
        "8CH: 6 Mics + 2 Loopbacks",
        "8CH: 6 Mics + 1 Loopback-mixed",
        "8CH: 8 Loopbacks",
        "10CH: 8 Mics + 2 Loopbacks",
        "10CH: 8 Mics + 1 Loopback-mixed",
        "16CH: 8 Mics + 8 Loopbacks",
};
```

<!-- source:cn p7 unit:44 -->

Die Referenzkanalzahl ändern; Beispiel: zwei Referenzkanäle in hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p8 unit:45 -->

```text
#define PCM_REFERENCE_CHANNELS 2
```

<!-- source:cn p8 unit:46 -->

In frameworks/av/media/libeffects/data/audio_effects.xml die entsprechenden Streams an folgende Effekte binden.

<!-- source:cn p8 unit:47 -->

```text
<!-- 如果没有声明 preprocess, 则直接添加下面的配置, 并忽略下面的注释 -->
<preprocess>
    <stream type="mic">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_aec_normal"/>
        <apply effect="preproc_ref_sw_dlp"/>
    </stream>
    <stream type="voice_communication">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_aec_normal"/>
        <apply effect="preproc_ref_sw_dlp"/>
    </stream>
</preprocess>
```

<!-- source:cn p8 unit:48 -->

3) Software-Rückführung über Aloop gilt bei unterschiedlichen cpu dai für Wiedergabe und Aufnahme. [L1][R1]... sind in Aloop gepufferte Referenzdaten; [L2][R2]... MIC-Daten. MIC- und Referenzdaten werden in Step#4 zusammengeführt.

<!-- source:cn p8 unit:49 -->

```text
HAL                 | Kernel                             | Hardware
                    |                                    |
  <Far End In>      |                      +----------+  |
+------*---------+  | [L1][R1]...          | CPU DAI0 |  |               +-----+
| Output Stream  *------------------------>*          *----------------->* SPK |
+------*---------+  |                      +----------+  |               +-----+
       | Step#1     |                                    |
       |[L1][R1]... |                                    |
       v            |                                    |
+------*--------+   |                      +----------+  |
|               |   |                      | Aloop    |  |
|(optional pre  *------------------------->* Playback |  |
|  resampler)   |   |                      | PCM      |  |
+---------------+   |                      +----------+  |
                    |                        |#cable0    |
                    |                        |           |
                    |                        v           |
+---------------+   |                      +-*--------+  |
|               |   | Step#2               | Aloop    |  |
|(optional post *<-------------------------* Capture  |  |
|  resampler)   |   |                      | PCM      |  |
+-----*-*-------+   |                      +----------+  |
Step#4| ^ Step#3    |                                    |
<AEC> | |[L2][R2]...|                                    |
      v |           |                      +----------+  |            <Near End>
+-----*-*--------+  | Step#2'              | CPU DAI1 |  |  [L2][R2]...  +-----+
| Input Stream   *<------------------------*          *<-----------------* MIC |
+-----*----------+  |                      +----------+  |               +-----+
  <Far End Out>     |                                    |
```

![Audio](/docs/rockchip-android-3a-module/assets/cn-diagram-49.png)

<!-- source:cn p9 unit:50 -->

Die Kernelkonfiguration zum Kompilieren von Aloop ändern.

<!-- source:cn p9 unit:51 -->

```text
CONFIG_SND_DRIVERS
CONFIG_SND_ALOOP
```

<!-- source:cn p9 unit:52 -->

Referenzkanalzahl: Keine Konfiguration nötig, da Aloop standardmäßig zwei Kanäle verwendet. Datei: hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p9 unit:53 -->

```text
#define PCM_REFERENCE_CHANNELS 0
```

<!-- source:cn p9 unit:54 -->

In frameworks/av/media/libeffects/data/audio_effects.xml die entsprechenden Streams an folgende Effekte binden.

<!-- source:cn p9 unit:55 -->

```text
<!-- 如果没有声明 preprocess, 则直接添加下面的配置, 并忽略下面的注释 -->
<preprocess>
    <stream type="mic">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_aec_normal"/>
        <apply effect="preproc_ref_sw_alp_capture"/>
    </stream>
    <stream type="voice_communication">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_aec_normal"/>
        <apply effect="preproc_ref_sw_alp_capture"/>
    </stream>
</preprocess>

<!-- 如果没有声明 postprocess, 则直接添加下面的配置, 并忽略下面的注释 -->
<postprocess>
    <stream type="voice_call">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_ref_sw_alp_playback"/>
    </stream>
</postprocess>
```

<!-- source:cn p9 unit:56 -->

#### 2.2.2 BF

<!-- source:cn p10 unit:57 -->

| <code>effect</code> | Beschreibung |
| --- | --- |
| <code>preproc_bf_fast_aec</code> | Lineare BF-Restechounterdrückung für den Aufweckpfad |
| <code>preproc_bf_wakeup</code> | BF-Aufweckmodul |
| <code>preproc_bf_dereverb</code> | BF-Enthallungsmodul |
| <code>preproc_bf_nlp</code> | Nichtlineare BF-Restechounterdrückung im Gesprächspfad (veraltet) |
| <code>preproc_bf_aes</code> | Nichtlineare BF-Restechounterdrückung |
| <code>preproc_bf_agc</code> | Automatische BF-Verstärkungsregelung |
| <code>preproc_bf_anr</code> | BF-Rauschunterdrückung |
| <code>preproc_bf_gsc</code> | BF-Beamforming-Nachfilter zur weiteren Rauschunterdrückung; je nach tatsächlichem Ergebnis aktivieren |
| <code>preproc_bf_gsc_method</code> | BF: Deaktiviert verwendet GSC LMS, aktiviert RLS; RLS benötigt mehr Rechenleistung als LMS |
| <code>preproc_bf_fix</code> | BF mit fester Strahlrichtung |
| <code>preproc_bf_dtd</code> | BF-Erkennung von Einzel-/Doppelsprechen |
| <code>preproc_bf_cng</code> | BF-Komfortrauschmodul |
| <code>preproc_bf_eq</code> | BF-EQ-Anpassung |
| <code>preproc_bf_chn_select</code> | BF für kundenspezifische MIC-Erweiterungen |
| <code>preproc_bf_howling</code> | BF-Rückkopplungsunterdrückung; je nach Anwendung aktivieren |
| <code>preproc_bf_doa</code> | BF-Schallquellenlokalisierung schätzt die Richtung; nach Bedarf aktivieren |
| <code>preproc_bf_wind</code> | BF-Windgeräuschunterdrückung; nach Bedarf aktivieren |
| <code>preproc_bf_ainr</code> | KI-basierte BF-Rauschunterdrückung; aktiviert schaltet sie ANR zwangsweise aus |

<!-- source:cn p10 unit:58 -->

Vor preproc_bf_fast_aec und preproc_bf_aes zuerst AEC konfigurieren. In frameworks/av/media/libeffects/data/audio_effects.xml die Streams an folgende Effekte binden.

<!-- source:cn p10 unit:59 -->

1) Empfohlene BF-Effekte zum Aufwecken:

<!-- source:cn p10 unit:60 -->

```text
<!-- 如果没有声明 preprocess, 则直接添加下面的配置, 并忽略下面的注释 -->
<preprocess>
    <stream type="mic">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_bf_wakeup"/>
        <apply effect="preproc_bf_fast_aec"/>
        <apply effect="preproc_bf_dtd"/>
        <apply effect="preproc_bf_agc"/>
    </stream>
    <stream type="voice_communication">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_bf_wakeup"/>
        <apply effect="preproc_bf_fast_aec"/>
        <apply effect="preproc_bf_dtd"/>
        <apply effect="preproc_bf_agc"/>
    </stream>
</preprocess>
```

<!-- source:cn p11 unit:62 -->

2) Empfohlene BF-Effekte für Sprachgespräche:

<!-- source:cn p11 unit:63 -->

```text
<!-- 如果没有声明 preprocess, 则直接添加下面的配置, 并忽略下面的注释 -->
<preprocess>
    <stream type="mic">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_bf_fast_aec"/>
        <apply effect="preproc_bf_dtd"/>
        <apply effect="preproc_bf_aes"/>
        <apply effect="preproc_bf_anr"/>
        <apply effect="preproc_bf_agc"/>
        <apply effect="preproc_bf_dereverb"/>
    </stream>
    <stream type="voice_communication">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_bf_fast_aec"/>
        <apply effect="preproc_bf_dtd"/>
        <apply effect="preproc_bf_aes"/>
        <apply effect="preproc_bf_anr"/>
        <apply effect="preproc_bf_agc"/>
        <apply effect="preproc_bf_dereverb"/>
    </stream>
</preprocess>
```

<!-- source:cn p11 unit:64 -->

3) Weitere Effekte nach Bedarf binden.

<!-- source:cn p11 unit:65 -->

#### 2.2.3 RX

<!-- source:cn p11 unit:66 -->

| <code>effect</code> | Beschreibung |
| --- | --- |
| <code>preproc_rx_anr</code> | Rauschunterdrückung; je nach Anwendung aktivieren |
| <code>preproc_rx_howling</code> | Rückkopplungsunterdrückung; je nach Anwendung aktivieren |

<!-- source:cn p11 unit:67 -->

In frameworks/av/media/libeffects/data/audio_effects.xml die Streams an die nachfolgend benötigten Effekte binden.

<!-- source:cn p11 unit:68 -->

```text
<!-- 如果没有声明 preprocess, 则直接添加下面的配置, 并忽略下面的注释 -->
<preprocess>
    <stream type="mic">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_rx_anr"/>
        <apply effect="preproc_rx_howling"/>
    </stream>
    <stream type="voice_communication">
        <!-- 保留已有内容, 添加下面的配置项 -->
        <apply effect="preproc_rx_anr"/>
        <apply effect="preproc_rx_howling"/>
    </stream>
</preprocess>
```

<!-- source:cn p12 unit:69 -->

### 2.3 Überprüfung

<!-- source:cn p12 unit:70 -->

1) Die Registrierung bei AudioFlinger mit dumpsys media.audio_flinger prüfen.

<!-- source:cn p12 unit:71 -->

```text
# dumpsys media.audio_flinger
[...]
Libraries loaded:
 [...]
 Library rkpreprocess
  path: /vendor/lib/soundfx/librkpreprocess.so
  Aloop Capture / Rockchip Electronics Co. Ltd.
    UUID: 4f7f9f58-122b-4dc6-831d-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  Aloop Playback / Rockchip Electronics Co. Ltd.
    UUID: d3cb7c9b-79a1-4a84-b26c-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820204
  Digital Loopback / Rockchip Electronics Co. Ltd.
    UUID: 7583028a-e283-4cb5-9c0f-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  HW Loopback / Rockchip Electronics Co. Ltd.
    UUID: b95396ba-60ed-424d-8ec7-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  RX HOWLING / Rockchip Electronics Co. Ltd.
    UUID: f55efb11-dc37-4844-a160-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  RX ANR / Rockchip Electronics Co. Ltd.
    UUID: 9b6b4c6f-9fba-453b-9f33-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  BF AINR / Rockchip Electronics Co. Ltd.
    UUID: a2913959-f123-43bc-ad9c-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  BF WIND / Rockchip Electronics Co. Ltd.
    UUID: 2b8fea18-547e-4af7-85c9-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  BF DOA / Rockchip Electronics Co. Ltd.
    UUID: 50404545-a180-40ad-a8f4-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
BF HOWLING / Rockchip Electronics Co. Ltd.
  UUID: 22075603-4d9d-40a6-bfac-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF CHN Select / Rockchip Electronics Co. Ltd.
  UUID: 874978b4-1b82-470f-be80-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF EQ / Rockchip Electronics Co. Ltd.
  UUID: 5f4428b2-6827-4a06-842f-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF CNG / Rockchip Electronics Co. Ltd.
  UUID: c0c12199-fccb-45a0-a912-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF DTD / Rockchip Electronics Co. Ltd.
  UUID: 97ef38d0-9346-48d3-aeed-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF FIX / Rockchip Electronics Co. Ltd.
  UUID: 8e8fe0d9-e335-4a75-847a-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF GSC Method / Rockchip Electronics Co. Ltd.
  UUID: 79dbccc7-d690-4ed3-be87-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF GSC / Rockchip Electronics Co. Ltd.
  UUID: 19d4a390-7e23-488b-8568-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF ANR / Rockchip Electronics Co. Ltd.
  UUID: 20b2732e-28e9-4b6b-968a-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF AGC / Rockchip Electronics Co. Ltd.
  UUID: aa8130e0-66fc-11e0-bad0-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF AES / Rockchip Electronics Co. Ltd.
  UUID: 3ad36ef7-2f2a-42cc-afa3-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
  apiVersion: 00020000
  flags: 00820203
BF NLP / Rockchip Electronics Co. Ltd.
  UUID: 53e4a6d1-4e6b-4421-afbc-0002a5d5c51b
  TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  BF De-Reverberation / Rockchip Electronics Co. Ltd.
    UUID: bd266323-f95b-4c4f-ab34-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  BF Wakeup / Rockchip Electronics Co. Ltd.
    UUID: 9ed2a703-5336-4a49-9bbf-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  BF Fast AEC / Rockchip Electronics Co. Ltd.
    UUID: b5bfc822-0b26-4230-adcb-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  AEC Array Reset / Rockchip Electronics Co. Ltd.
    UUID: 49cd17f2-819f-4acd-9541-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  AEC Delay / Rockchip Electronics Co. Ltd.
    UUID: 55fa4ede-4adb-45fe-80b9-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
  AEC Normal / Rockchip Electronics Co. Ltd.
    UUID: bb392ec0-8d4d-11e0-a896-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820203
[...]
```

<!-- source:cn p14 unit:74 -->

2) Die Bindung an den richtigen Stream prüfen. Bei Aufnahme oder Sprachgespräch dumpsys media.audio_flinger auswerten. Beispiel: Sprachgespräch mit Aloop-Software-Referenz.

<!-- source:cn p14 unit:75 -->

```text
<preprocess>
    <stream type="voice_communication">
        <apply effect="preproc_aec_normal"/>
        <apply effect="preproc_bf_fast_aec"/>
        <apply effect="preproc_bf_aes"/>
        <apply effect="preproc_bf_anr"/>
        <apply effect="preproc_bf_dereverb"/>
        <apply effect="preproc_rx_anr"/>
        <apply effect="preproc_ref_sw_alp_capture"/>
    </stream>
</preprocess>

<postprocess>
    <stream type="voice_call">
        <apply effect="preproc_ref_sw_alp_playback"/>
    </stream>
</postprocess>
```

<!-- source:cn p15 unit:76 -->

```text
# dumpsys media.audio_flinger
[...]
Output thread 0xb40000784395ba60, name AudioOut_D, tid 642, type 0 (MIXER):
  I/O handle: 13
  Standby: no
  [...]
  1 Effect Chains
    1 effects for session 249
        In buffer    Out buffer                           Active tracks:
        0x78439e0000   0x7843d34000 -> 0xb400007730317020   1
        Effect ID 75:
                [...]
                - UUID: d3cb7c9b-79a1-4a84-b26c-0002a5d5c51b
                [...]
                - name: Aloop Playback
                [...]
  [...]
[...]
Input thread 0xb40000784388dc60, name AudioIn_2E, tid 6501, type 3 (RECORD):
  I/O handle: 30
  Standby: no
  [...]
  1 Effect Chains
    7 effects for session 257
        In buffer    Out buffer         Active tracks:
        nullptr   nullptr   0
        Effect ID 139:
                [...]
                - UUID: bb392ec0-8d4d-11e0-a896-0002a5d5c51b
                [...]
                - name: AEC Normal
                [...]
        Effect ID 147:
                [...]
                - UUID: b5bfc822-0b26-4230-adcb-0002a5d5c51b
                [...]
                - name: BF Fast AEC
                [...]
        Effect ID 155:
                [...]
                - UUID: 3ad36ef7-2f2a-42cc-afa3-0002a5d5c51b
                [...]
                - name: BF AES
                [...]
        Effect ID 163:
                [...]
                - UUID: 20b2732e-28e9-4b6b-968a-0002a5d5c51b
                [...]
                - name: BF ANR
                [...]
        Effect ID 171:
                [...]
                - UUID: bd266323-f95b-4c4f-ab34-0002a5d5c51b
                [...]
                - name: BF De-Reverberation
                [...]
        Effect ID 179:
                [...]
                - UUID: 9b6b4c6f-9fba-453b-9f33-0002a5d5c51b
                [...]
                - name: RX ANR
                [...]
        Effect ID 187:
                [...]
                - UUID: 4f7f9f58-122b-4dc6-831d-0002a5d5c51b
                [...]
                - name: Aloop Capture
                [...]
  [...]
[...]
```

<!-- source:cn p16 unit:78 -->

## 3. Parameter

<!-- source:cn p16 unit:79 -->

Standardwerte stehen in rkaudio_effect_preprocess.xml, im SDK unter hardware/rockchip/audio/preprocess/ und auf dem Gerät unter /vendor/etc/.

<!-- source:cn p16 unit:80 -->

### 3.1 Parameterbeschreibung

<!-- source:cn p16 unit:81 -->

Siehe Rockchip_Developer_Guide_Microphone_Array_Tuning.pdf. Nach der Integration stehen die Parameter standardmäßig in rkaudio_effect_preprocess.xml; folgende Erläuterungen beziehen sich auf dieses Dokument und diese XML-Datei.

<!-- source:cn p16 unit:82 -->

### 3.2 Parametereinstellung

<!-- source:cn p16 unit:83 -->

#### 3.2.1 AEC-Modulparameter

<!-- source:cn p16 unit:84 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>pos</code> | Position der Referenzkanäle: 0 vor den MIC-Daten, 1 danach. |
| <code>drop_ref_channel</code> | Anzahl nicht verarbeiteter Referenzkanäle. |
| <code>delay_len</code> | Bei deaktivierter Verzögerungsschätzung der Standard-Verzögerungspunkt der Hardware-Referenz; andernfalls der Startpunkt der Schätzung. |
| <code>look_ahead</code> | MIC-Pufferlänge. Nur konfigurieren, wenn die MIC-Erfassung nachweislich hinter der Referenz liegt; sonst 0 belassen. |
| <code>filter_len</code> | Länge des linearen AEC-Filters. Größere Werte verbessern die Echoschätzung, verlangsamen jedoch die Konvergenz und erhöhen den Rechenaufwand. Üblich: 2/4/6/8. |
| <code>Array_list</code> | Reihenfolge der Audiokanäle; erfordert preproc_aec_array_reset. |

<!-- source:cn p16 unit:85 -->

Parameter der Verzögerungsschätzung (erfordert preproc_aec_delay).

<!-- source:cn p17 unit:86 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>max_frame</code> | Maximale Framezahl der Schätzung; normalerweise 16. |
| <code>least_delay</code> | Minimale Framezahl der Schätzung; 0 empfohlen, sofern MaxFrame nicht besonders groß ist. |
| <code>jump_frame</code> | Anfangs übersprungene Frames; normalerweise 12. |
| <code>delay_offset</code> | Frame-Offset, damit eine zu große Verzögerungsschätzung das MIC-Signal nicht hinter die Referenz verschiebt; normalerweise 1. |
| <code>mic_amp_thr</code> | Minimale MIC-Energieschwelle; darunter wird die Verzögerungsschätzung nicht aktualisiert. Normalerweise 50. |
| <code>ref_amp_thr</code> | Minimale Referenz-Energieschwelle; darunter wird die Verzögerungsschätzung nicht aktualisiert. Normalerweise 50. |
| <code>start_freq</code> | Startfrequenz der Verzögerungsschätzung. Hauptsprachband wählen und anhand der Aufnahme anpassen; normalerweise 500. |
| <code>end_freq</code> | Endfrequenz der Verzögerungsschätzung. Hauptsprachband wählen und anhand der Aufnahme anpassen; normalerweise 4000. |
| <code>smooth_factor</code> | Glättungsfaktor, meist [0.95,1). Höhere Werte stabilisieren die Schätzung, niedrigere aktualisieren schneller. Üblich: 0.97/0.99. |

<!-- source:cn p17 unit:87 -->

#### 3.2.2 BF-Modulparameter

<!-- source:cn p17 unit:88 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>ref_pos</code> | Position der Referenzkanäle: 0 vor den MIC-Daten, 1 danach. |
| <code>targ</code> | Aufnahmerichtung bei aktiviertem preproc_bf_fix. |
| <code>drop_ref_channel</code> | Anzahl nicht verarbeiteter Referenzkanäle. |

<!-- source:cn p17 unit:89 -->

1) AES-Parameter (erfordert preproc_bf_aes).

<!-- source:cn p18 unit:90 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>beta_up</code> | Anstiegsrate: Größere Werte verstärken die nichtlineare Unterdrückung. Empfohlen: 0.001-0.01. |
| <code>beta_down</code> | Abfallrate: Größere Werte schwächen die nichtlineare Unterdrückung. Empfohlen: 0.001-0.01. |
| <code>beta_up_low</code> | Anstiegsrate im unteren Band; Verhalten und Bereich wie beta_up. |
| <code>beta_down_low</code> | Abfallrate im unteren Band; Verhalten und Bereich wie beta_down. |
| <code>low_freq</code> | Untere Frequenzbandgrenze. |
| <code>high_freq</code> | Obere Frequenzbandgrenze. |
| <code>thd_flag</code> | 1 aktiviert die Unterdrückung harmonischer Verzerrungen, 0 deaktiviert sie. |
| <code>hard_flag</code> | 1 aktiviert den Hard-Modus: stärkere Echounterdrückung, jedoch mögliche Überunterdrückung der Sprache. |
| <code>limit_ratio_0</code> | Minimaler Restechoanteil je Band; empfohlen [1.0f, 5.0f]. Größere Werte verstärken die Echounterdrückung. Die drei Spalten sind unteres, mittleres und oberes Band, getrennt durch low_freq und high_freq. |
| <code>limit_ratio_1</code> | Restecho-Unterdrückungsverhältnis je Band; empfohlen [1.0f, 3.0f]. Größere Werte verstärken die Unterdrückung. Drei Spalten entsprechen unterem, mittlerem und oberem Band gemäß low_freq und high_freq. |
| <code>thd_split_freq_0</code> | Bänder der Harmonischenunterdrückung. Unbenötigte Zeile vollständig auf 0 setzen. Jede Zeile ist ein Band: Start in Spalte 1, Ende in Spalte 2; beide Werte in [0,1/2 * sample rate]. |
| <code>thd_split_freq_1</code> | Wie oben. |
| <code>thd_split_freq_2</code> | Wie oben. |
| <code>thd_split_freq_3</code> | Wie oben. |
| <code>thd_sup_degree_0</code> | Unterdrückungsverhältnisse für die obigen Bänder. Eine vollständig nullgesetzte Bandzeile deaktiviert die zugehörige Verhältniszeile. Die Spalten bestimmen die Unterdrückung der Grundfrequenz, wenn daraus die 2. bis 11. Harmonische im Band entstehen kann. Empfohlen [0.001f,1.0f]; höhere Werte verstärken die Wirkung. |
| <code>thd_sup_degree_1</code> | Wie oben. |
| <code>thd_sup_degree_2</code> | Wie oben. |
| <code>thd_sup_degree_3</code> | Wie oben. |
| <code>hard_split_freq_0</code> | Hard-Modus-Bänder und das Band zur Berechnung der mittleren Verstärkung. Spalten 1/2 sind Start/Ende in [0,1/2*sample rate]. Höchstens vier Hard-Bänder; die letzte Zeile definiert das Band für die mittlere Verstärkung, das HardThreshold unten verwendet. |
| <code>hard_split_freq_1</code> | Wie oben. |
| <code>hard_split_freq_2</code> | Wie oben. |
| <code>hard_split_freq_3</code> | Wie oben. |
| <code>hard_split_freq_4</code> | Wie oben. |
| <code>hard_threshold</code> | Hard-Aktivierungsschwellen: Vier Schwellen entsprechen den vier obigen Bändern. Liegt die mittlere Verstärkung unter der jeweiligen Schwelle, wird Hard im betreffenden Band aktiviert. |

<!-- source:cn p19 unit:93 -->

2) AGC-Parameter (erfordert preproc_bf_agc).

<!-- source:cn p19 unit:94 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>attack_time</code> | Empfohlen 20-600 ms. Ansprechzeit bis zum Anstieg der AGC-Verstärkung. |
| <code>release_time</code> | Empfohlen 20-600 ms. Abklingzeit bis zum Abfall der AGC-Verstärkung. |
| <code>attenuate_time</code> |  |
| <code>max_gain</code> | Empfohlen 0-50 dB. Maximalverstärkung, zugleich Verstärkung des linearen Abschnitts. |
| <code>max_peak</code> | Bereich 0 bis -87 dB. Maximale Sprachenergie nach AGC. |
| <code>fRth0</code> | Bereich 0 bis -87 dB. Noise-Gate-Schwelle; Sprache darunter wird nicht verstärkt. |
| <code>fRth1</code> | Bereich 0 bis -87 dB. Energieschwelle am Ende der Expansion; Sprache darüber erhält max_gain. |
| <code>fRth2</code> | Bereich 0 bis -87 dB. Energieschwelle für den Kompressionsbeginn; darüber sinkt die Sprachverstärkung schrittweise auf 0 dB. |
| <code>fRk0</code> | Steigung des Expansionsabschnitts. |
| <code>fRk1</code> | Steigung des Expansionsabschnitts (unwirksamer Parameter). |
| <code>fRk2</code> | Steigung des Expansionsabschnitts (unwirksamer Parameter). |
| <code>fLineGainDb</code> | Anhebung des linearen Abschnitts in dB (unwirksamer Parameter). |
| <code>swSmL0</code> | Zeitbereichs-Glättungspunkte der Expansion (unwirksamer Parameter). |
| <code>swSmL1</code> | Zeitbereichs-Glättungspunkte des linearen Abschnitts (unwirksamer Parameter). |
| <code>swSmL2</code> | Zeitbereichs-Glättungspunkte der Kompression (unwirksamer Parameter). |

<!-- source:cn p19 unit:95 -->

3) ANR-Parameter (erfordert preproc_bf_anr).

<!-- source:cn p20 unit:96 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>noiseFactor</code> | Rauschschätzpegel, meist [0.5f,1.5f]; höhere Werte entfernen Rauschen gründlicher. |
| <code>swU</code> | Zeitfenster der Rauschschätzung, meist [2,20]. Höhere Werte schätzen stationäres Rauschen genauer, reagieren aber langsamer auf Sprünge. Niedrigere Werte reagieren schneller, können jedoch Sprache übermäßig unterdrücken. |
| <code>psiMin</code> | Schwelle für Sprachpräsenzwahrscheinlichkeit, [0.0f,1.0f]; höhere Werte verstärken die Rauschunterdrückung. |
| <code>psiMax</code> | Schwelle für Sprachpräsenzwahrscheinlichkeit, [0.0f,1.0f]; höhere Werte verstärken die Rauschunterdrückung. |
| <code>fGmin</code> | Minimaler Rauschunterdrückungswert, [0.0f,1.0f]; kleinere Werte verstärken die Unterdrückung. |
| <code>supFreq1</code> | Punkt 1 zur Unterdrückung konstantfrequenten Rauschens, [0,1/2*sample rate]; Rauschen dort wird stets unterdrückt. |
| <code>supFreq2</code> | Punkt 2 zur Unterdrückung konstantfrequenten Rauschens, [0,1/2*sample rate]; Rauschen dort wird stets unterdrückt. |
| <code>supEnergy1</code> | Energieschwelle für Punkt 1 der konstantfrequenten Unterdrückung, normalerweise 100000. Bei Überschreitung durch die Frequenzenergie wird die Rauschschätzung aktualisiert. |
| <code>supEnergy2</code> | Energieschwelle für Punkt 1 der konstantfrequenten Unterdrückung, normalerweise 100000. Bei Überschreitung durch die Frequenzenergie wird die Rauschschätzung aktualisiert. |
| <code>interV</code> | Frame-Abtastintervall, meist [2,20]. Höhere Werte stabilisieren das geschätzte Rauschen, ähnlich swU. |
| <code>biasMin</code> | Rauschkompensation, meist [1.0f, 2.0f]; höhere Werte verstärken die Unterdrückung. |
| <code>updateFrm</code> | Länge der schnellen Konvergenz, normalerweise 15: schnelle Konvergenz in den ersten 15 Frames. |
| <code>nPreGammaThr</code> | Schwelle der Wahrscheinlichkeit reinen Rauschens, meist (3.0f,5.0f); höhere Werte verstärken die Unterdrückung. |
| <code>nPreZetaThr</code> | Schwelle der Wahrscheinlichkeit reinen Rauschens, meist (1.0f,3.0f); höhere Werte verstärken die Unterdrückung. |
| <code>sabsGammaThr0</code> | Schwelle der Sprachabwesenheitswahrscheinlichkeit, meist (0.5f,1.5f); höhere Werte verstärken die Unterdrückung. |
| <code>sabsGammaThr1</code> | Schwelle der Sprachabwesenheitswahrscheinlichkeit, meist (2.f,4.0f); höhere Werte verstärken die Unterdrückung. |
| <code>infSmooth</code> | Glättungskoeffizient des Eingangssignals, (0.0f,1.0f). |
| <code>probSmooth</code> | Glättungskoeffizient der Sprachpräsenzwahrscheinlichkeit, (0.0f,1.0f). |
| <code>compCoeff</code> | Rauschkompensation, meist [1.0f, 2.0f], für Bänder unter der mittleren Rauschschätzung. Höhere Werte verstärken die Unterdrückung. |
| <code>prioriMin</code> | Minimales A-priori-SNR, (0.0f, 0.5f); höhere Werte schwächen die Rauschunterdrückung. |
| <code>postMax</code> | Maximales A-posteriori-SNR; normalerweise 40. |
| <code>prioriRatio</code> | Glättungskoeffizient des A-priori-SNR, (0.0f,1.0f); höhere Werte verstärken die Rauschunterdrückung. |
| <code>prioriRatioLow</code> | Glättungskoeffizient des A-priori-SNR, (0.0f,1.0f); höhere Werte verstärken die Rauschunterdrückung. |
| <code>splitBand</code> | Bandtrennindex, [0,32]. Darunter A-priori-SNR mit PrioriRatioLow glätten, andernfalls mit PrioriRatio. |
| <code>prioriSmooth</code> | Glättungskoeffizient des A-priori-SNR, (0.0f,1.0f); höhere Werte verstärken die Rauschunterdrückung. |
| <code>tranMode</code> | Impulsrauschmodus: 0 aus, 1 detektionsbasierte Entfernung, 2 schätzungsbasierte Entfernung. |

<!-- source:cn p21 unit:99 -->

4) Enthallungsparameter (erfordert preproc_bf_dereverb).

<!-- source:cn p21 unit:100 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>rlsLg</code> | RLS-Filterordnung für die Enthallung beim Aufwecken. Innerhalb gewisser Grenzen verstärken höhere Ordnungen die Wirkung und erhöhen den Rechenaufwand. Empfohlen: 4. |
| <code>curveLg</code> | Ordnung der Verteilungskurve für Gesprächsenthallung. Höhere Werte verstärken die Wirkung und das Risiko der Überunterdrückung. Empfohlen: 10. |
| <code>delay</code> | RLS-Filterverzögerung bestimmt den Erhalt früher Reflexionen. Empfohlen: 2. |
| <code>forgetting</code> | RLS-Vergessensfaktor. Kleinere Werte verstärken die Enthallung und das Risiko der Überunterdrückung. Empfohlen: 0.98-0.999. |
| <code>t60</code> | Geschätzte Nachhallzeit in Sekunden. Höhere Werte verstärken die Enthallung, aber auch das Überunterdrückungsrisiko. Empfohlen: 0.68 bei geringem, 1.5 bei mittlerem/starkem Nachhall. |
| <code>coCoeff</code> | Anpassung der gegenseitigen Kohärenz gegen Überunterdrückung. Kleinere Werte verstärken die Wirkung. Empfohlen: 2 bei geringem, 1 bei mittlerem/starkem Nachhall. |

<!-- source:cn p21 unit:101 -->

5) Komfortrauschparameter (erfordert preproc_bf_cng).

<!-- source:cn p21 unit:102 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>fGain</code> | Empfohlen 0-50 dB. Amplitudenverhältnis des zugesetzten Komfortrauschens; Standard 2. |
| <code>fMpy</code> | Empfohlen 0-50 dB. Amplitude der Weißrausch-Zufallserzeugung; Standard 5. |
| <code>fSmoothAlpha</code> | Bereich 0.0f-1.0f. Glättung des Komfortrauschens; Standard 0.92. |
| <code>fSpeechGain</code> | Bereich 0.0f-1.0f. Grad der Sprachtextursimulation im Komfortrauschen; Standard 0.3. |

<!-- source:cn p21 unit:103 -->

6) DTD-Parameter (erfordert preproc_bf_dtd).

<!-- source:cn p21 unit:104 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>ksiThd_high</code> | Obere Entscheidungsschwelle für Einzel-/Doppelsprechen; darüber gilt Einzelsprechen. |
| <code>ksiThd_low</code> | Untere Entscheidungsschwelle; darunter gilt Einzelsprechen. |

<!-- source:cn p21 unit:105 -->

7) DOA-Parameter (erfordert preproc_bf_doa).

<!-- source:cn p22 unit:106 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>rad</code> |  |
| <code>start_freq</code> |  |
| <code>end_freq</code> |  |
| <code>lg_num</code> |  |
| <code>lg_pitch_num</code> |  |

<!-- source:cn p22 unit:107 -->

8) EQ-Parameter (erfordert preproc_bf_eq).

<!-- source:cn p22 unit:108 -->

| Attribut | Beschreibung |
| --- | --- |
| <code>shwParaLen</code> | Anzahl der Filterkoeffizienten. |
| <code>filter_bank_0</code> | Filterkoeffizienten. |
| <code>filter_bank_1</code> | Filterkoeffizienten. |
| <code>filter_bank_2</code> | Filterkoeffizienten. |
| <code>filter_bank_3</code> | Filterkoeffizienten. |
| <code>filter_bank_4</code> | Filterkoeffizienten. |

<!-- source:cn p22 unit:109 -->

### 3.3 Parameterabstimmung

<!-- source:cn p22 unit:110 -->

Eine userdebug-Version verwenden und die ADB-Verbindung vom PC sicherstellen. Folgende zwei Befehle am PC ausführen.

<!-- source:cn p22 unit:111 -->

```text
adb root
adb remount
```

<!-- source:cn p22 unit:112 -->

#### 3.3.1 Parameter aktualisieren

<!-- source:cn p22 unit:113 -->

rkaudio_effect_preprocess.xml ändern und per push in das betreffende Geräteverzeichnis übertragen.

<!-- source:cn p22 unit:114 -->

```text
adb push rkaudio_effect_preprocess.xml /vendor/etc/
```

<!-- source:cn p22 unit:115 -->

#### 3.3.2 Ausgabe analysieren

<!-- source:cn p22 unit:116 -->

Aufnahme oder Sprachgespräch neu starten, um das Ergebnis bzw. die Ausgabe der Gegenseite zu prüfen. Alternativ Ein-/Ausgabe direkt dumpen und die Datenströme analysieren.

<!-- source:cn p22 unit:117 -->

```text
setenforce 0
setprop vendor.audio.preproc.debug 1
```

<!-- source:cn p22 unit:118 -->

Danach die folgenden zwei Dateien exportieren und mit Audacity oder einem anderen PC-Werkzeug analysieren.

<!-- source:cn p23 unit:119 -->

```text
/data/misc/audioserver/preproc_input_xxxhz_xxxch.pcm
/data/misc/audioserver/preproc_output_xxxhz_xxxch.pcm
```

<!-- source:cn p23 unit:120 -->

xxxhz bezeichnet die Abtastrate, xxxch die Kanalzahl. In Audacity Datei, Importieren, Rohdaten wählen und Abtastrate sowie Kanalzahl einstellen. Bei zufriedenstellendem Ergebnis rkaudio_effect_preprocess.xml unter hardware/rockchip/audio/preprocess/ aktualisieren.

<!-- source:cn p23 unit:121 -->

## 4. Fragen und Antworten

<!-- source:cn p23 unit:122 -->

### 4.1 Nach Hinzufügen von DLP scheitert die Aufnahme mit der angegebenen MIC- plus Referenzkanalzahl an einem Parameterfehler

<!-- source:cn p23 unit:123 -->

Beispiel: zwei MIC- und zwei Referenzkanäle.

<!-- source:cn p23 unit:124 -->

```text
# tinycap /sdcard/mic.wav -D xxx -c 4 -r 48000
Unable to open PCM device (cannot set hw params: Invalid argument)
Captured 0 frames
```

<!-- source:cn p23 unit:125 -->

xxx ist der Soundkartenindex aus cat /proc/asound/cards.

<!-- source:cn p23 unit:126 -->

#### 4.1.1 Routenkonfiguration prüfen

<!-- source:cn p23 unit:127 -->

(1) Prüfen, ob sich die Route einstellen lässt.

<!-- source:cn p23 unit:128 -->

```text
# tinymix -D xxx "Software Digital Loopback Mode" "4CH: 2 Mics + 2 Loopbacks"
```

<!-- source:cn p23 unit:129 -->

Bei einem Fehler die folgenden drei Punkte prüfen:

<!-- source:cn p23 unit:130 -->

```text
Invalid mixer control: Software Digital Loopback Mode
```

<!-- source:cn p23 unit:131 -->

Prüfen, ob der aktuelle Kernel DLP unterstützt; andernfalls SDK aktualisieren oder Patch einspielen.

<!-- source:cn p23 unit:132 -->

```text
# grep rockchip,digital-loopback -r ./sound/soc/rockchip/
./sound/soc/rockchip/rockchip_sai.c:    if (device_property_read_bool(&pdev->dev,
"rockchip,digital-loopback"))
./sound/soc/rockchip/rockchip_i2s.c:    if (device_property_read_bool(&pdev->dev,
"rockchip,digital-loopback"))
./sound/soc/rockchip/rockchip_i2s_tdm.c:        if
(device_property_read_bool(dev, "rockchip,digital-loopback")) {
```

<!-- source:cn p23 unit:133 -->

Prüfen, ob DLP im Kernel aktiviert ist.

<!-- source:cn p23 unit:134 -->

```text
CONFIG_SND_SOC_ROCKCHIP_DLP_PCM
```

<!-- source:cn p23 unit:135 -->

DLP am betreffenden cpu dai in dts aktivieren.

<!-- source:cn p23 unit:136 -->

```text
&i2s {
        rockchip,digital-loopback;
};
```

<!-- source:cn p24 unit:137 -->

cpu dai kann i2s0_8ch, i2s1_8ch, i2s2_2ch, i2s3_2ch, sai0, sai1 usw. sein. (2) Prüfen, ob die Route wirksam wurde.

<!-- source:cn p24 unit:138 -->

```text
# tinymix -D xxx
...
13      ENUM    1       Software Digital Loopback Mode           4CH: 2 Mics + 2
Loopbacks
...
```

<!-- source:cn p24 unit:139 -->

#### 4.1.2 Soundkarte prüfen

<!-- source:cn p24 unit:140 -->

Prüfen, ob der in dts gebundene codec dai driver Unterstützung für vier Aufnahmekanäle deklariert.

<!-- source:cn p24 unit:141 -->

```text
// ...
demo_sound: demo-sound {
    compatible = "simple-audio-card";
    // ...
    simple-audio-card,codec {
        sound-dai = <&demo>;
    };
    // ...
};

// ...
// 或者
demo_sound: demo-sound {
    compatible = "rockchip,multicodecs-card";
    // ...
    rockchip,codec = <&demo>;
    // ...
};
```

<!-- source:cn p24 unit:142 -->

```text
struct snd_soc_dai_driver demo_dai = {
    // 没有 capture, 或者 channels_max 小于 4 channel, 则说明不支持
    .capture = {
        .channels_min = 1,
        .channels_max = 2,
    },
    // ...
};
```

<!-- source:cn p24 unit:143 -->

Falls nicht, "rockchip,multicodecs-card" verwenden und zusätzlich einen virtuellen Hilfs-codec binden.

<!-- source:cn p24 unit:144 -->

```text
// 修改前 (例1)
#if 0
demo_sound: demo-sound {
    status = "okay";
    compatible = "simple-audio-card";
    simple-audio-card,format = "i2s";
    simple-audio-card,name = "rockchip,demo-codec";
    simple-audio-card,mclk-fs = <256>;
    simple-audio-card,cpu {
        sound-dai = <&i2s>;
    };
    simple-audio-card,codec {
        sound-dai = <&demo>;
    };
};
#endif

// 修改前 (例2)
#if 0
demo_sound: demo-sound {
    status = "okay";
    compatible = "rockchip,multicodecs-card";
    rockchip,format = "i2s";
    rockchip,card-name = "rockchip,demo-codec";
    rockchip,mclk-fs = <256>;
    rockchip,cpu = <&i2s>;
    rockchip,codec = <&demo>;
};
#endif
```

<!-- source:cn p25 unit:146 -->

```text
// 修改后
// 声明虚拟 codec 节点
demo_aux: demo-aux {
    status = "okay";
    compatible = "rockchip,dummy-codec";
    sound-name-prefix = "demo-aux";
    #sound-dai-cells = <0>;
};

// 使用 "rockchip,multicodecs-card" 绑定 codec 和虚拟 codec
demo_sound: demo-sound {
    status = "okay";
    compatible = "rockchip,multicodecs-card";
    rockchip,format = "i2s";
    rockchip,card-name = "rockchip,demo-codec";
    rockchip,mclk-fs = <256>;
    rockchip,cpu = <&i2s>;
    rockchip,codec = <&demo &demo_aux>;
};
```

{% endraw %}
