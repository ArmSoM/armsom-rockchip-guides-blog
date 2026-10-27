---
title: "Rockchip Android 3A Module Developer Guide"
description: "Rockchip Android 3A Module Developer Guide — V1.0.0"
excerpt: "Rockchip Android 3A Module Developer Guide"
translation_key: "231-rockchip-android-3a-module"
slug: "231-rockchip-android-3a-module"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, AEC]
---

{% raw %}

# Rockchip Android 3A Module Developer Guide

Complete four-chapter technical edition of the Chinese RK-KF-YF-793 V1.0.0 source dated : build, enablement, parameters and troubleshooting. Its applicability table says all chips/all kernel versions; this is the historical source scope, not a current compatibility promise. Only a Chinese source exists, with no English original figures. Monospaced audio-path diagrams remain editable code, accompanied by original Chinese-PDF diagram crops; these are not claimed to be localized artwork. Legal, audience, revision and duplicate contents material is omitted, not technical parameters. No commands, recording or hardware tests were performed.

Editorial notes: page-split code/tables are joined, PDF line wraps inside UUIDs repaired, and the final character of heading 4.1 restored. The source leaves attenuate_time and all five DOA descriptions blank; they remain blank. supEnergy2 says “point 1”; fRk1/fRk2 say expansion slope and inactive; HardThreshold/PrioriRatio casing is retained rather than guessing algorithm semantics. Code comments, UUIDs, parameter names, logs and source ellipses are preserved. Security: adb root/remount and setenforce 0 are only for authorized debug devices; the latter disables SELinux enforcement, so restore policy after testing. Audio dumps may contain private recordings: restrict access and remove them when no longer needed.

<!-- source:cn p2 unit:0 -->

## 1. Build

<!-- source:cn p3 unit:1 -->

### 1.1 Locate the project's BoardConfig.mk

<!-- source:cn p3 unit:2 -->

The BoardConfig.mk location depends on the chip and the product selected with lunch. Example: chip rk3588, product rk3588_u.

<!-- source:cn p3 unit:3 -->

```text
# echo $TARGET_PRODUCT
# rk3588_u
```

<!-- source:cn p3 unit:4 -->

Then BoardConfig.mk is at device/rockchip/rk3588/rk3588_u/BoardConfig.mk.

<!-- source:cn p3 unit:5 -->

### 1.2 Add the build switch

<!-- source:cn p3 unit:6 -->

Add the following switch to the project's BoardConfig.mk so hardware/rockchip/audio/preprocess is built.

<!-- source:cn p3 unit:7 -->

```text
BOARD_USE_AUDIO_PREPROCESS := true
```

<!-- source:cn p3 unit:8 -->

## 2. Enable

<!-- source:cn p3 unit:9 -->

### 2.1 Declare the effects

<!-- source:cn p3 unit:10 -->

Modify frameworks/av/media/libeffects/data/audio_effects.xml to declare the following effect collection.

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

### 2.2 Enable the effects

<!-- source:cn p4 unit:14 -->

For effect details, see Rockchip_Developer_Guide_Microphone_Array_Tuning.pdf. Before enabling effects, make the following two changes:

<!-- source:cn p4 unit:15 -->

1) Set the tinyalsa_hal recording frame length to 16 ms, rounding down.

<!-- source:cn p4 unit:16 -->

```text
period_size = (int)(rate * 0.016 / 4) * 4
```

<!-- source:cn p4 unit:17 -->

At 48000 Hz, period_size = (int)(48000 * 0.016 / 4) * 4 = 768. At 44100 Hz, period_size = (int)(44100 * 0.016 / 4) * 4 = 704. Then update the corresponding pcm config in hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p4 unit:18 -->

```text
static struct pcm_config pcm_config_in = {
    // ...
    .rate = 48000,
    .period_size = 768,
};
```

<!-- source:cn p4 unit:19 -->

2) Change the MIC channel count.

<!-- source:cn p5 unit:20 -->

After confirming the MIC channel count, update the configuration below; example: 2-channel MIC, in hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p5 unit:21 -->

```text
#define PCM_CAPTURE_CHANNELS 2
```

<!-- source:cn p5 unit:22 -->

A single MIC is currently handled as 2 channels.

<!-- source:cn p5 unit:23 -->

#### 2.2.1 AEC

<!-- source:cn p5 unit:24 -->

| <code>effect</code> | Description |
| --- | --- |
| <code>preproc_aec_normal</code> | AEC module |
| <code>preproc_aec_delay</code> | AEC delay-estimation submodule |
| <code>preproc_aec_array_reset</code> | Reorder AEC input audio channels |
| <code>preproc_ref_hw</code> | Hardware loopback reference |
| <code>preproc_ref_sw_dlp</code> | Software loopback reference using DLP |
| <code>preproc_ref_sw_alp_playback</code> | Software loopback: buffer Aloop data |
| <code>preproc_ref_sw_alp_capture</code> | Software loopback: acquire Aloop data |

<!-- source:cn p5 unit:25 -->

AEC needs a loopback reference signal to cancel echo, so configure it for the actual audio path or topology.

<!-- source:cn p5 unit:26 -->

1) Hardware loopback. In the diagrams, [L1][R1]... is reference data looped from before the SPK to an audio interface (CPU DAI1); [L2][R2]... is MIC data.

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

Change the reference channel count; example: 2 reference channels in hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p6 unit:31 -->

```text
#define PCM_REFERENCE_CHANNELS 2
```

<!-- source:cn p6 unit:32 -->

Modify frameworks/av/media/libeffects/data/audio_effects.xml to bind the appropriate streams to the following effects.

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

2) Software loopback using DLP applies when playback and recording use the same cpu dai. In the diagram, [L1][R1]... is reference data buffered in DLP; [L2][R2]... is MIC data.

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

Modify the kernel configuration to build DLP.

<!-- source:cn p6 unit:37 -->

```text
CONFIG_SND_SOC_ROCKCHIP_DLP_PCM
```

<!-- source:cn p6 unit:38 -->

Modify the dts configuration to enable DLP on the corresponding cpu dai.

<!-- source:cn p7 unit:39 -->

```text
&i2s {
        rockchip,digital-loopback;
};
```

<!-- source:cn p7 unit:40 -->

Possible cpu dai values include i2s0_8ch, i2s1_8ch, i2s2_2ch, i2s3_2ch, sai0 and sai1. Add the corresponding route configuration in tinyalsa_hal. Different sound-card names use different configuration files; check sound_card_config_list. If none matches, default_config.h is used. Example: 2-channel MIC + 2-channel reference.

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

The available options are listed below; configure them for the MIC and reference channel counts.

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

Change the reference channel count; example: 2 reference channels in hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p8 unit:45 -->

```text
#define PCM_REFERENCE_CHANNELS 2
```

<!-- source:cn p8 unit:46 -->

Modify frameworks/av/media/libeffects/data/audio_effects.xml to bind the appropriate streams to the following effects.

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

3) Software loopback using Aloop applies when playback and recording use different cpu dai interfaces. [L1][R1]... is reference data buffered in Aloop; [L2][R2]... is MIC data. MIC and reference data are combined in Step#4.

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

Modify the kernel configuration to build Aloop.

<!-- source:cn p9 unit:51 -->

```text
CONFIG_SND_DRIVERS
CONFIG_SND_ALOOP
```

<!-- source:cn p9 unit:52 -->

Reference channel count: no configuration is needed because Aloop defaults to 2 channels. File: hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p9 unit:53 -->

```text
#define PCM_REFERENCE_CHANNELS 0
```

<!-- source:cn p9 unit:54 -->

Modify frameworks/av/media/libeffects/data/audio_effects.xml to bind the appropriate streams to the following effects.

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

| <code>effect</code> | Description |
| --- | --- |
| <code>preproc_bf_fast_aec</code> | BF linear residual-echo cancellation; further suppresses echo in the wake-up path |
| <code>preproc_bf_wakeup</code> | BF wake-up module |
| <code>preproc_bf_dereverb</code> | BF dereverberation module |
| <code>preproc_bf_nlp</code> | BF nonlinear residual-echo cancellation for further echo suppression in the call path (deprecated) |
| <code>preproc_bf_aes</code> | BF nonlinear residual-echo cancellation |
| <code>preproc_bf_agc</code> | BF automatic gain control |
| <code>preproc_bf_anr</code> | BF noise suppression |
| <code>preproc_bf_gsc</code> | BF beamforming post-filter for further noise suppression; enable according to actual results |
| <code>preproc_bf_gsc_method</code> | BF: disabled selects LMS for GSC; enabled selects RLS, which requires more computation than LMS |
| <code>preproc_bf_fix</code> | BF fixed-direction beam |
| <code>preproc_bf_dtd</code> | BF single-/double-talk detection |
| <code>preproc_bf_cng</code> | BF comfort-noise module |
| <code>preproc_bf_eq</code> | BF EQ adjustment |
| <code>preproc_bf_chn_select</code> | BF customized MIC expansion scenarios |
| <code>preproc_bf_howling</code> | BF howling suppression; enable as required by the scenario |
| <code>preproc_bf_doa</code> | BF sound-source localization estimates source direction; enable as required |
| <code>preproc_bf_wind</code> | BF wind-noise suppression; enable as required |
| <code>preproc_bf_ainr</code> | BF AI noise reduction; enabling it forcibly disables ANR |

<!-- source:cn p10 unit:58 -->

To enable preproc_bf_fast_aec and preproc_bf_aes, first configure AEC. Modify frameworks/av/media/libeffects/data/audio_effects.xml to bind the streams to the effects below.

<!-- source:cn p10 unit:59 -->

1) Recommended BF effects for wake-up:

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

2) Recommended BF effects for voice calls:

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

3) Bind other effects as needed.

<!-- source:cn p11 unit:65 -->

#### 2.2.3 RX

<!-- source:cn p11 unit:66 -->

| <code>effect</code> | Description |
| --- | --- |
| <code>preproc_rx_anr</code> | Noise suppression; enable as required by the scenario |
| <code>preproc_rx_howling</code> | Howling suppression; enable as required by the scenario |

<!-- source:cn p11 unit:67 -->

Modify frameworks/av/media/libeffects/data/audio_effects.xml to bind streams to the required effects below.

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

### 2.3 Verification

<!-- source:cn p12 unit:70 -->

1) Check registration with AudioFlinger using dumpsys media.audio_flinger.

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

2) Check binding to the corresponding stream. During recording or a voice call, inspect dumpsys media.audio_flinger. Example: a voice call with Aloop software reference.

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

## 3. Parameters

<!-- source:cn p16 unit:79 -->

Defaults are in rkaudio_effect_preprocess.xml, stored in hardware/rockchip/audio/preprocess/ in the SDK and installed to /vendor/etc/ on the device.

<!-- source:cn p16 unit:80 -->

### 3.1 Parameter descriptions

<!-- source:cn p16 unit:81 -->

Refer to Rockchip_Developer_Guide_Microphone_Array_Tuning.pdf. After integration, parameters default to rkaudio_effect_preprocess.xml; the following descriptions refer to that document and XML file.

<!-- source:cn p16 unit:82 -->

### 3.2 Parameter configuration

<!-- source:cn p16 unit:83 -->

#### 3.2.1 AEC module parameters

<!-- source:cn p16 unit:84 -->

| Attribute | Description |
| --- | --- |
| <code>pos</code> | Reference-channel position: 0 places reference channels before MIC data; 1 places them after it. |
| <code>drop_ref_channel</code> | Number of reference channels not processed. |
| <code>delay_len</code> | With delay estimation disabled, the default hardware-reference delay point; when enabled, the initial delay-estimation point. |
| <code>look_ahead</code> | MIC-side buffer length. Configure only when MIC acquisition is known to lag the reference; otherwise leave at 0. |
| <code>filter_len</code> | Linear AEC filter length. Longer filters estimate echo more accurately but converge more slowly and require more computation. Typical values: 2/4/6/8. |
| <code>Array_list</code> | Audio-channel order; requires preproc_aec_array_reset. |

<!-- source:cn p16 unit:85 -->

Delay-estimation submodule parameters (requires preproc_aec_delay).

<!-- source:cn p17 unit:86 -->

| Attribute | Description |
| --- | --- |
| <code>max_frame</code> | Maximum estimation frame count; normally 16. |
| <code>least_delay</code> | Minimum estimation frame count; use 0 unless MaxFrame is particularly large. |
| <code>jump_frame</code> | Frames initially skipped; normally 12. |
| <code>delay_offset</code> | Offset in frames preventing excessive estimated delay from making MIC lag the reference; normally 1. |
| <code>mic_amp_thr</code> | Minimum MIC energy threshold; below it the delay estimate is not updated. Normally 50. |
| <code>ref_amp_thr</code> | Minimum reference energy threshold; below it the delay estimate is not updated. Normally 50. |
| <code>start_freq</code> | Start frequency for delay estimation. Select the main speech band and adjust to actual capture results; normally 500. |
| <code>end_freq</code> | End frequency for delay estimation. Select the main speech band and adjust to actual capture results; normally 4000. |
| <code>smooth_factor</code> | Smoothing factor, usually [0.95,1). Higher values stabilize delay estimates; lower values update faster. Normally 0.97/0.99. |

<!-- source:cn p17 unit:87 -->

#### 3.2.2 BF module parameters

<!-- source:cn p17 unit:88 -->

| Attribute | Description |
| --- | --- |
| <code>ref_pos</code> | Reference-channel position: 0 places reference channels before MIC data; 1 places them after it. |
| <code>targ</code> | Pickup direction when preproc_bf_fix is enabled. |
| <code>drop_ref_channel</code> | Number of reference channels not processed. |

<!-- source:cn p17 unit:89 -->

1) AES parameters (requires preproc_bf_aes).

<!-- source:cn p18 unit:90 -->

| Attribute | Description |
| --- | --- |
| <code>beta_up</code> | Rise rate: larger values strengthen nonlinear suppression. Recommended: 0.001-0.01. |
| <code>beta_down</code> | Fall rate: larger values weaken nonlinear suppression. Recommended: 0.001-0.01. |
| <code>beta_up_low</code> | Low-band rise rate; behavior and range as beta_up. |
| <code>beta_down_low</code> | Low-band fall rate; behavior and range as beta_down. |
| <code>low_freq</code> | Low-frequency band division. |
| <code>high_freq</code> | High-frequency band division. |
| <code>thd_flag</code> | 1 enables harmonic-distortion suppression; 0 disables it. |
| <code>hard_flag</code> | 1 enables Hard mode, strengthening echo suppression but potentially over-suppressing speech. |
| <code>limit_ratio_0</code> | Minimum residual-echo ratio in each band; recommended [1.0f, 5.0f]. Larger values strengthen echo cancellation. The three columns are the low, middle and high bands divided by low_freq and high_freq. |
| <code>limit_ratio_1</code> | Residual-echo removal ratio in each band; recommended [1.0f, 3.0f]. Larger values strengthen cancellation. The three columns are low, middle and high bands divided by low_freq and high_freq. |
| <code>thd_split_freq_0</code> | Harmonic-suppression bands. Set a row entirely to 0 if unused. Each row is one band: start in column 1, end in column 2; both range over [0,1/2 * sample rate]. |
| <code>thd_split_freq_1</code> | Same as above. |
| <code>thd_split_freq_2</code> | Same as above. |
| <code>thd_split_freq_3</code> | Same as above. |
| <code>thd_sup_degree_0</code> | Harmonic suppression ratios for the bands above. An all-zero band row disables its corresponding ratio row. Columns specify suppression of the relevant fundamental when it can generate the 2nd through 11th harmonic within the band. Recommended [0.001f,1.0f]; larger values strengthen suppression. |
| <code>thd_sup_degree_1</code> | Same as above. |
| <code>thd_sup_degree_2</code> | Same as above. |
| <code>thd_sup_degree_3</code> | Same as above. |
| <code>hard_split_freq_0</code> | Hard-mode bands and the band used to calculate average gain. Columns 1/2 are start/end, both in [0,1/2*sample rate]. Configure at most four Hard-mode bands; the last row defines the average-gain band used by HardThreshold below. |
| <code>hard_split_freq_1</code> | Same as above. |
| <code>hard_split_freq_2</code> | Same as above. |
| <code>hard_split_freq_3</code> | Same as above. |
| <code>hard_split_freq_4</code> | Same as above. |
| <code>hard_threshold</code> | Hard-mode activation thresholds: four thresholds match the four bands above. Compare average gain with the threshold; if gain is lower, Hard mode activates for that band. |

<!-- source:cn p19 unit:93 -->

2) AGC parameters (requires preproc_bf_agc).

<!-- source:cn p19 unit:94 -->

| Attribute | Description |
| --- | --- |
| <code>attack_time</code> | Recommended 20-600 ms. Attack time: time needed for AGC gain to rise. |
| <code>release_time</code> | Recommended 20-600 ms. Release time: time needed for AGC gain to fall. |
| <code>attenuate_time</code> |  |
| <code>max_gain</code> | Recommended 0-50 dB. Maximum gain, also the linear-segment gain. |
| <code>max_peak</code> | Range 0 to -87 dB. Maximum speech energy after AGC. |
| <code>fRth0</code> | Range 0 to -87 dB. Noise-gate threshold; speech below it is not amplified. |
| <code>fRth1</code> | Range 0 to -87 dB. End-of-expansion energy threshold; speech above it receives max_gain. |
| <code>fRth2</code> | Range 0 to -87 dB. Start-of-compression energy threshold; above it speech gain gradually falls to 0 dB. |
| <code>fRk0</code> | Expansion-segment slope. |
| <code>fRk1</code> | Expansion-segment slope (inactive parameter). |
| <code>fRk2</code> | Expansion-segment slope (inactive parameter). |
| <code>fLineGainDb</code> | Linear-segment boost in dB (inactive parameter). |
| <code>swSmL0</code> | Time-domain smoothing points in the expansion segment (inactive parameter). |
| <code>swSmL1</code> | Time-domain smoothing points in the linear segment (inactive parameter). |
| <code>swSmL2</code> | Time-domain smoothing points in the compression segment (inactive parameter). |

<!-- source:cn p19 unit:95 -->

3) ANR parameters (requires preproc_bf_anr).

<!-- source:cn p20 unit:96 -->

| Attribute | Description |
| --- | --- |
| <code>noiseFactor</code> | Noise-estimation level, normally [0.5f,1.5f]; larger values remove noise more thoroughly. |
| <code>swU</code> | Noise-estimation frame time slice, normally [2,20]. Higher values improve stationary-noise estimation but slow convergence for abrupt noise. Lower values converge faster for abrupt noise but risk speech over-suppression. |
| <code>psiMin</code> | Speech-presence probability threshold, [0.0f,1.0f]; larger values strengthen noise suppression. |
| <code>psiMax</code> | Speech-presence probability threshold, [0.0f,1.0f]; larger values strengthen noise suppression. |
| <code>fGmin</code> | Minimum noise-suppression value, [0.0f,1.0f]; smaller values strengthen suppression. |
| <code>supFreq1</code> | Constant-frequency noise suppression point 1, [0,1/2*sample rate]; always suppresses noise at that point. |
| <code>supFreq2</code> | Constant-frequency noise suppression point 2, [0,1/2*sample rate]; always suppresses noise at that point. |
| <code>supEnergy1</code> | Energy threshold for constant-frequency suppression point 1, normally 100000. When frequency-bin energy exceeds it, the constant-frequency noise estimate is updated. |
| <code>supEnergy2</code> | Energy threshold for constant-frequency suppression point 1, normally 100000. When frequency-bin energy exceeds it, the constant-frequency noise estimate is updated. |
| <code>interV</code> | Frame sampling interval, normally [2,20]. Larger values make the estimated noise more stationary, similar to swU. |
| <code>biasMin</code> | Noise compensation, normally [1.0f, 2.0f]; larger values strengthen suppression. |
| <code>updateFrm</code> | Fast-convergence length, normally 15: rapid convergence during the first 15 frames. |
| <code>nPreGammaThr</code> | Pure-noise probability threshold, normally (3.0f,5.0f); larger values strengthen suppression. |
| <code>nPreZetaThr</code> | Pure-noise probability threshold, normally (1.0f,3.0f); larger values strengthen suppression. |
| <code>sabsGammaThr0</code> | Speech-absence probability threshold, normally (0.5f,1.5f); larger values strengthen suppression. |
| <code>sabsGammaThr1</code> | Speech-absence probability threshold, normally (2.f,4.0f); larger values strengthen suppression. |
| <code>infSmooth</code> | Input-signal smoothing coefficient, (0.0f,1.0f). |
| <code>probSmooth</code> | Speech-presence probability smoothing coefficient, (0.0f,1.0f). |
| <code>compCoeff</code> | Noise compensation, normally [1.0f, 2.0f], for bands below the average noise estimate. Larger values strengthen suppression. |
| <code>prioriMin</code> | Minimum a priori SNR, (0.0f, 0.5f); larger values weaken noise suppression. |
| <code>postMax</code> | Maximum a posteriori SNR; normally 40. |
| <code>prioriRatio</code> | A priori SNR smoothing coefficient, (0.0f,1.0f); larger values strengthen noise suppression. |
| <code>prioriRatioLow</code> | A priori SNR smoothing coefficient, (0.0f,1.0f); larger values strengthen noise suppression. |
| <code>splitBand</code> | Band-split index, [0,32]. Below this index smooth a priori SNR with PrioriRatioLow; otherwise use PrioriRatio. |
| <code>prioriSmooth</code> | A priori SNR smoothing coefficient, (0.0f,1.0f); larger values strengthen noise suppression. |
| <code>tranMode</code> | Impulsive-noise mode: 0 disabled, 1 detection-based removal, 2 estimation-based removal. |

<!-- source:cn p21 unit:99 -->

4) Dereverberation parameters (requires preproc_bf_dereverb).

<!-- source:cn p21 unit:100 -->

| Attribute | Description |
| --- | --- |
| <code>rlsLg</code> | RLS filter order for wake-up dereverberation. Within limits, higher orders strengthen dereverberation and increase computation. Recommended: 4. |
| <code>curveLg</code> | Distribution-curve order for call dereverberation. Higher values strengthen dereverberation but increase over-suppression risk. Recommended: 10. |
| <code>delay</code> | RLS filter delay controls how much early reverberation is retained. Recommended: 2. |
| <code>forgetting</code> | RLS forgetting factor. Smaller values strengthen dereverberation but increase over-suppression risk. Recommended: 0.98-0.999. |
| <code>t60</code> | Estimated reverberation time in seconds. Larger values strengthen dereverberation but increase over-suppression risk. Recommended: 0.68 for low reverberation, 1.5 for medium/high reverberation. |
| <code>coCoeff</code> | Mutual-coherence adjustment to prevent over-suppression. Smaller values strengthen the effect. Recommended: 2 for low reverberation, 1 for medium/high reverberation. |

<!-- source:cn p21 unit:101 -->

5) Comfort-noise parameters (requires preproc_bf_cng).

<!-- source:cn p21 unit:102 -->

| Attribute | Description |
| --- | --- |
| <code>fGain</code> | Recommended 0-50 dB. Applied comfort-noise amplitude ratio; default 2. |
| <code>fMpy</code> | Recommended 0-50 dB. White-noise random-generation amplitude; default 5. |
| <code>fSmoothAlpha</code> | Range 0.0f-1.0f. Comfort-noise smoothing; default 0.92. |
| <code>fSpeechGain</code> | Range 0.0f-1.0f. Degree of speech-texture simulation in comfort noise; default 0.3. |

<!-- source:cn p21 unit:103 -->

6) DTD parameters (requires preproc_bf_dtd).

<!-- source:cn p21 unit:104 -->

| Attribute | Description |
| --- | --- |
| <code>ksiThd_high</code> | Single-/double-talk decision ceiling; above it classify as single talk. |
| <code>ksiThd_low</code> | Decision floor; below it classify as single talk. |

<!-- source:cn p21 unit:105 -->

7) DOA parameters (requires preproc_bf_doa).

<!-- source:cn p22 unit:106 -->

| Attribute | Description |
| --- | --- |
| <code>rad</code> |  |
| <code>start_freq</code> |  |
| <code>end_freq</code> |  |
| <code>lg_num</code> |  |
| <code>lg_pitch_num</code> |  |

<!-- source:cn p22 unit:107 -->

8) EQ parameters (requires preproc_bf_eq).

<!-- source:cn p22 unit:108 -->

| Attribute | Description |
| --- | --- |
| <code>shwParaLen</code> | Number of filter coefficients. |
| <code>filter_bank_0</code> | Filter coefficients. |
| <code>filter_bank_1</code> | Filter coefficients. |
| <code>filter_bank_2</code> | Filter coefficients. |
| <code>filter_bank_3</code> | Filter coefficients. |
| <code>filter_bank_4</code> | Filter coefficients. |

<!-- source:cn p22 unit:109 -->

### 3.3 Parameter tuning

<!-- source:cn p22 unit:110 -->

Use a userdebug build and ensure the PC can connect through ADB. Run the following two commands on the PC.

<!-- source:cn p22 unit:111 -->

```text
adb root
adb remount
```

<!-- source:cn p22 unit:112 -->

#### 3.3.1 Update parameters

<!-- source:cn p22 unit:113 -->

Modify rkaudio_effect_preprocess.xml and push it to the corresponding device directory.

<!-- source:cn p22 unit:114 -->

```text
adb push rkaudio_effect_preprocess.xml /vendor/etc/
```

<!-- source:cn p22 unit:115 -->

#### 3.3.2 Analyze output

<!-- source:cn p22 unit:116 -->

Restart recording to check results, or restart the voice call to check the far-end output. You can also dump input/output and analyze their data streams directly.

<!-- source:cn p22 unit:117 -->

```text
setenforce 0
setprop vendor.audio.preproc.debug 1
```

<!-- source:cn p22 unit:118 -->

Then export the following two files and analyze them with Audacity or another PC tool.

<!-- source:cn p23 unit:119 -->

```text
/data/misc/audioserver/preproc_input_xxxhz_xxxch.pcm
/data/misc/audioserver/preproc_output_xxxhz_xxxch.pcm
```

<!-- source:cn p23 unit:120 -->

xxxhz denotes sample rate and xxxch channel count. In Audacity select File, Import, Raw Data, then set sample rate and channel count. Once results meet requirements, update rkaudio_effect_preprocess.xml in hardware/rockchip/audio/preprocess/.

<!-- source:cn p23 unit:121 -->

## 4. Q&A

<!-- source:cn p23 unit:122 -->

### 4.1 After adding DLP, recording with the specified MIC + reference channel count fails with an invalid-parameter error

<!-- source:cn p23 unit:123 -->

Example: 2 MIC channels and 2 reference channels.

<!-- source:cn p23 unit:124 -->

```text
# tinycap /sdcard/mic.wav -D xxx -c 4 -r 48000
Unable to open PCM device (cannot set hw params: Invalid argument)
Captured 0 frames
```

<!-- source:cn p23 unit:125 -->

xxx is the corresponding sound-card index shown by cat /proc/asound/cards.

<!-- source:cn p23 unit:126 -->

#### 4.1.1 Check route configuration

<!-- source:cn p23 unit:127 -->

(1) Check whether the route can be set.

<!-- source:cn p23 unit:128 -->

```text
# tinymix -D xxx "Software Digital Loopback Mode" "4CH: 2 Mics + 2 Loopbacks"
```

<!-- source:cn p23 unit:129 -->

If an error occurs, check these three points:

<!-- source:cn p23 unit:130 -->

```text
Invalid mixer control: Software Digital Loopback Mode
```

<!-- source:cn p23 unit:131 -->

Check whether the current kernel includes DLP support; otherwise update the SDK or apply the patch.

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

Check whether DLP is enabled in the kernel.

<!-- source:cn p23 unit:134 -->

```text
CONFIG_SND_SOC_ROCKCHIP_DLP_PCM
```

<!-- source:cn p23 unit:135 -->

Enable DLP on the corresponding cpu dai in dts.

<!-- source:cn p23 unit:136 -->

```text
&i2s {
        rockchip,digital-loopback;
};
```

<!-- source:cn p24 unit:137 -->

cpu dai may be i2s0_8ch, i2s1_8ch, i2s2_2ch, i2s3_2ch, sai0, sai1, etc. (2) Check whether the route took effect.

<!-- source:cn p24 unit:138 -->

```text
# tinymix -D xxx
...
13      ENUM    1       Software Digital Loopback Mode           4CH: 2 Mics + 2
Loopbacks
...
```

<!-- source:cn p24 unit:139 -->

#### 4.1.2 Check the sound card

<!-- source:cn p24 unit:140 -->

Check whether the codec dai driver bound in dts declares support for 4-channel capture.

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

If not, use "rockchip,multicodecs-card" and also bind an auxiliary virtual codec.

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
