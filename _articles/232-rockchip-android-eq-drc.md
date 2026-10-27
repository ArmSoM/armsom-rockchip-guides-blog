---
title: "Rockchip Android EQ/DRC Developer Guide"
description: "Rockchip Android EQ/DRC Developer Guide — V1.1.0"
excerpt: "Rockchip Android EQ/DRC Developer Guide"
translation_key: "232-rockchip-android-eq-drc"
slug: "232-rockchip-android-eq-drc"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, EQ, DRC]
---

{% raw %}

# Rockchip Android EQ/DRC Developer Guide

Complete technical text from the Chinese RK-KF-YF-774 V1.1.0 source , covering build, enablement and parameters. The source scope is all chips/all kernel versions, not a claim of current compatibility testing. Only a Chinese source exists; there are no English original figures or bitmap illustrations in this document. All code, configurations and logs are editable, with source comments retained. Legal/contact, audience, revision and duplicate contents material is omitted. No commands or audio/hardware tests were performed.

Editorial/security notes: UUID wraps, the page-split Java example and wrapped comments are restored. The source says “two commands” but lists three; all three are retained. Original equalizer/mEqualizer variables, channnel spelling and preset lists are preserved. Use adb root, remount and setenforce 0 only on authorized userdebug devices; back up parameters, restore SELinux enforcement after tests and do not carry debug settings directly into production.

<!-- source:cn p2 unit:0 -->

## 1. Build

<!-- source:cn p2 unit:1 -->

### 1.1 Locate the project's BoardConfig.mk

<!-- source:cn p2 unit:2 -->

The BoardConfig.mk location depends on the chip and the product selected with lunch.

<!-- source:cn p3 unit:3 -->

Example: chip rk3588, product rk3588_u.

<!-- source:cn p3 unit:4 -->

```text
# echo $TARGET_PRODUCT
# rk3588_u
```

<!-- source:cn p3 unit:5 -->

Then BoardConfig.mk is at device/rockchip/rk3588/rk3588_u/BoardConfig.mk.

<!-- source:cn p3 unit:6 -->

### 1.2 Add the build switch

<!-- source:cn p3 unit:7 -->

Add the following switch to the project's BoardConfig.mk so hardware/rockchip/audio/eqdrc is built.

<!-- source:cn p3 unit:8 -->

```text
BOARD_USE_AUDIO_EQDRC := true
```

<!-- source:cn p3 unit:9 -->

## 2. Enable

<!-- source:cn p3 unit:10 -->

### 2.1 Declare the effect

<!-- source:cn p3 unit:11 -->

Declare EQ/DRC in frameworks/av/media/libeffects/data/audio_effects.xml.

<!-- source:cn p3 unit:12 -->

```text
<libraries>
    <!-- 保留已有内容, 添加下面的配置项 -->
    <library name="rkeqdrc" path="librkeqdrc.so"/>
</libraries>
<effects>
    <!-- 保留已有内容, 添加下面的配置项 -->
    <effect name="eqdrc" library="rkeqdrc" uuid="79fe72b2-4182-44c1-b2ea-0002a5d5c51b"/>
</effects>
```

<!-- source:cn p3 unit:13 -->

### 2.2 Enable the effect

<!-- source:cn p3 unit:14 -->

Choose the binding method according to the desired scope of the effect.

<!-- source:cn p3 unit:15 -->

#### 2.2.1 Dynamic binding

<!-- source:cn p3 unit:16 -->

Bind EQ/DRC dynamically when creating MediaPlayer or AudioTrack. This affects the individual audio stream.

<!-- source:cn p3 unit:17 -->

```text
import android.media.MediaPlayer;
import android.media.audiofx.RockchipEqualizer;

MediaPlayer mediaPlayer = new MediaPlayer();
RockchipEqualizer equalizer = new RockchipEqualizer(0,
mediaPlayer.getAudioSessionId());
equalizer.setEnabled(true);
```

<!-- source:cn p3 unit:18 -->

#### 2.2.2 Stream HAL binding

<!-- source:cn p3 unit:19 -->

Bind by specifying the stream type in audio_effects.xml. This globally affects audio streams of that type, for example music output streams.

<!-- source:cn p4 unit:20 -->

```text
<!-- 如果没有声明 postprocess, 则直接添加下面的配置, 忽略下面的注释 -->
<postprocess>
    <!-- 保留已有内容, 添加下面的配置项 -->
    <stream type="music">
        <apply effect="eqdrc"/>
    </stream>
</postprocess>
```

<!-- source:cn p4 unit:21 -->

Multiple output-stream types can also be bound.

<!-- source:cn p4 unit:22 -->

```text
<!-- 如果没有声明 postprocess, 则直接添加下面的配置, 忽略下面的注释 -->
<postprocess>
    <!-- 保留已有内容, 添加下面的配置项 -->
    <stream type="music">
        <apply effect="eqdrc"/>
    </stream>
    <stream type="voice_call">
        <apply effect="eqdrc"/>
    </stream>
</postprocess>
```

<!-- source:cn p4 unit:23 -->

The following output-stream types are currently available:

<!-- source:cn p4 unit:24 -->

```text
/** All output stream types which support effects.
 * This need to be kept in sync with the xsd streamOutputType.
 */
template <>
constexpr std::pair<audio_stream_type_t, const char*>
STREAM_NAME_MAP<audio_stream_type_t>[] = {
        {AUDIO_STREAM_VOICE_CALL, "voice_call"},
        {AUDIO_STREAM_SYSTEM, "system"},
        {AUDIO_STREAM_RING, "ring"},
        {AUDIO_STREAM_MUSIC, "music"},
        {AUDIO_STREAM_ALARM, "alarm"},
        {AUDIO_STREAM_NOTIFICATION, "notification"},
        {AUDIO_STREAM_BLUETOOTH_SCO, "bluetooth_sco"},
        {AUDIO_STREAM_ENFORCED_AUDIBLE, "enforced_audible"},
        {AUDIO_STREAM_DTMF, "dtmf"},
        {AUDIO_STREAM_TTS, "tts"},
        {AUDIO_STREAM_ASSISTANT, "assistant"},
};
```

<!-- source:cn p4 unit:25 -->

### 2.3 Verification

<!-- source:cn p4 unit:26 -->

#### 2.3.1 Check effect registration

<!-- source:cn p4 unit:27 -->

Check whether the declared effect is registered with AudioFlinger using dumpsys media.audio_flinger.

<!-- source:cn p5 unit:28 -->

```text
# dumpsys media.audio_flinger
[...]
Libraries loaded:
  path: /vendor/lib/soundfx/librkeqdrc.so
  EQ DRC / Rockchip Electronics Co. Ltd.
    UUID: 79fe72b2-4182-44c1-b2ea-0002a5d5c51b
    TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
    apiVersion: 00020000
    flags: 00820204
[...]
```

<!-- source:cn p5 unit:29 -->

#### 2.3.2 Check effect binding

<!-- source:cn p5 unit:30 -->

Check whether the required effect is bound to the correct output stream. Play audio in an Android app and inspect dumpsys media.audio_flinger.

<!-- source:cn p5 unit:31 -->

```text
# dumpsys media.audio_flinger
[...]
Output thread 0xb40000784395ba60, name AudioOut_D, tid 642, type 0 (MIXER):
  I/O handle: 13
  Standby: no
  [...]
  1 Effect Chains
    1 effects for session 49
        [...]
        Effect ID 11:
                Session State Registered Enabled Suspended:
                00049   003   y          y       n
                Descriptor:
                - UUID: 79fe72b2-4182-44c1-b2ea-0002a5d5c51b
                - TYPE: 34805d32-2e6d-4d1e-9296-0002a5d5c51b
                - apiVersion: 00000000
                [...]
                - name: EQ DRC
                - implementor: Rockchip Electronics Co. Ltd.
                [...]
        Effect ID 11 HAL dump:
  [...]
[...]
```

<!-- source:cn p5 unit:32 -->

## 3. Parameters

<!-- source:cn p5 unit:33 -->

### 3.1 Parameter files and directories

<!-- source:cn p5 unit:34 -->

#### 3.1.1 Parameter files

<!-- source:cn p5 unit:35 -->

Default parameters are stored in the following two binary files.

<!-- source:cn p5 unit:36 -->

```text
rkaudio_effect_eqdrc_44100hz_2ch.bin
rkaudio_effect_eqdrc_48000hz_2ch.bin
```

<!-- source:cn p5 unit:37 -->

Other preset parameter files are also supported.

<!-- source:cn p6 unit:38 -->

```text
rkaudio_effect_eqdrc_48000hz_2ch_classroom.bin
rkaudio_effect_eqdrc_48000hz_2ch_meeting.bin
rkaudio_effect_eqdrc_48000hz_2ch_standard.bin
```

<!-- source:cn p6 unit:39 -->

#### 3.1.2 Parameter directories

<!-- source:cn p6 unit:40 -->

The SDK stores defaults in hardware/rockchip/audio/eqdrc/configs/ and installs them to /vendor/etc/. On userdebug builds, the PC tool pushes files to /vendor/etc/. When an app uses the default configuration (preset 0), its parameters are saved to /data/vendor/audio/. When EQ/DRC is created, it first loads parameters from that directory; if absent, it loads the default directory.

<!-- source:cn p6 unit:41 -->

### 3.2 Parameter descriptions

<!-- source:cn p6 unit:42 -->

See Rockchip_Developer_Audio_Effect_Tool.pdf.

<!-- source:cn p6 unit:43 -->

### 3.3 Parameter tuning

<!-- source:cn p6 unit:44 -->

Two methods are supported: app-based and PC-tool tuning. Choose as needed.

<!-- source:cn p6 unit:45 -->

#### 3.3.1 Tuning with a custom app

<!-- source:cn p6 unit:46 -->

If EQ/DRC is bound in audio_effects.xml, that instance performs effect processing. An additional EQ/DRC binding from the app then acts as the parameter-adjustment channel.

<!-- source:cn p6 unit:47 -->

```text
import android.media.MediaPlayer;
import android.media.audiofx.RockchipEqualizer;

MediaPlayer mediaPlayer = new MediaPlayer();
// 绑定
RockchipEqualizer equalizer = new RockchipEqualizer(0,
mediaPlayer.getAudioSessionId());
// 使能
equalizer.setEnabled(true);
```

<!-- source:cn p6 unit:48 -->

Call the corresponding android.media.audiofx.RockchipEqualizer.Settings APIs. The following example sets EQ parameters.

<!-- source:cn p6 unit:49 -->

```text
// 获取所有配置
RockchipEqualizer.Settings settings = equalizer.getProperties();
// 使能 EQ10
settings.setEq10Enabled(1);

// 获取当前 EQ, 总共 2 channnel 的 EQ
Collection<RockchipEqualizer.Settings.Eq> eqs = settings.getEqs();
// 创建 EQ 迭代器
Iterator<RockchipEqualizer.Settings.Eq> eqsIterator = eqs.iterator();
// 遍历所有 channel 的 EQ
while (eqsIterator.hasNext()) {
    RockchipEqualizer.Settings.Eq eq = eqsIterator.next();
    Log.d(TAG, "eq: " + eq.toString());

    // 获取当前 channel 的 EQ 的所有 band 配置
    Collection<RockchipEqualizer.Settings.Eq.EqBand> eqBands = eq.getBands();
    // 创建 band 迭代器
    Iterator<RockchipEqualizer.Settings.Eq.EqBand> eqBandsIterator =
eqBands.iterator();
    // 遍历当前 channel 的 EQ 的所有 band 配置
    while (eqBandsIterator.hasNext()) {
        RockchipEqualizer.Settings.Eq.EqBand eqBand = eqBandsIterator.next();
        Log.d(TAG, "band: " + eqBand.toString());
        // 设置 band 参数, 具体可以看对应的 set API
        // eqBand.setBoost(0); 滤波器中心频率增益，单位 dB
        // eqBand.setFilter(0); 0 表示 Parametric，1 表示 LowShelf，2 表示 HighShelf，3 表示 GeneralLP，4 表示 GeneralHP
        // eqBand.setFc(0); 滤波器的中心频率，单位 Hz
        // eqBand.setQ(0); filter 为 Parametric 时，Q 为品质因数，范围为[0.01, 16]； filter 为 LowShelf/HighShelf时，Q 为Slope，范围为[0.01, 2]
        // eqBand.setEnabled(0); 是否启用该滤波器，1 表示启用，0 表示bypass
    }
}

// 更新配置
equalizer.setProperties(settings);
```

<!-- source:cn p7 unit:51 -->

You can also load a preset directly. Without an explicit selection, "custom" is used; only that preset allows the parameter changes above.

<!-- source:cn p7 unit:52 -->

```text
mEqualizer.usePreset(0); // 使用 "custom" 预设
mEqualizer.usePreset(1); // 使用 "standard" 预设
mEqualizer.usePreset(2); // 使用 "meeting" 预设
mEqualizer.usePreset(3); // 使用 "classical" 预设
mEqualizer.usePreset(4); // 使用 "classroom" 预设
```

<!-- source:cn p7 unit:53 -->

#### 3.3.2 Tuning with the PC tool

<!-- source:cn p7 unit:54 -->

PC-tool tuning requires a userdebug build and an adb connection from the PC to the device.

<!-- source:cn p7 unit:55 -->

1) Tool location. The PC tool is normally in RKTools/windows/AudioEffect_Tool.rar in the SDK.

<!-- source:cn p7 unit:56 -->

2) Additional tool functions. load loads parameters from any directory; save saves current parameters to any directory; push uses adb push to store parameters in /vendor/etc/ on the device; pull uses adb pull to save the device's current parameters to the selected directory. See Rockchip_Developer_Audio_Effect_Tool.pdf for more details.

<!-- source:cn p7 unit:57 -->

Note: push/pull use filenames rkaudio_effect_eqdrc_xhz_ych.bin, where x/y are the tool's sample rate/channel count.

<!-- source:cn p7 unit:58 -->

3) Tuning procedure. Before tuning, run the following two commands on the PC.

<!-- source:cn p7 unit:59 -->

```text
adb root
adb remount
adb shell setenforce 0
```

<!-- source:cn p8 unit:60 -->

Open AudioEffect_tool.exe. SampleRate must match the existing pcm_config rate in hardware/rockchip/audio/tinyalsa_hal/.

<!-- source:cn p8 unit:61 -->

```text
static struct pcm_config pcm_config = {
    // ...
    .rate = 48000,
    // ...
};
```

<!-- source:cn p8 unit:62 -->

NumChan must match the existing pcm_config channels in hardware/rockchip/audio/tinyalsa_hal/.

<!-- source:cn p8 unit:63 -->

```text
static struct pcm_config pcm_config = {
    .channels = 2,
    // ...
};
```

<!-- source:cn p8 unit:64 -->

Optionally click pull to save current device parameters. Click load and select the parameter directory. Play audio in an Android app, adjust parameters and click push to update the device. On the device, logcat shows the parameter-reload log.

<!-- source:cn p8 unit:65 -->

```text
# logcat | grep eqdrc
06-19 07:33:12.286   714  2068 D eqdrc   : eqdrc_fx_process : reload profile
from tuner
```

<!-- source:cn p8 unit:66 -->

Check results by listening or using audio test equipment such as AP. If results are satisfactory, click save to store parameters in hardware/rockchip/audio/eqdrc/configs in the SDK; otherwise repeat tuning.

{% endraw %}
