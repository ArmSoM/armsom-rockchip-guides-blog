---
title: "Rockchip Android EQ/DRC 开发指南"
description: "Rockchip Android EQ/DRC 开发指南 — V1.1.0"
excerpt: "Rockchip Android EQ/DRC 开发指南"
translation_key: "232-rockchip-android-eq-drc"
slug: "232-rockchip-android-eq-drc"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, EQ, DRC]
---

{% raw %}

# Rockchip Android EQ/DRC 开发指南

完整技术正文依据 RK-KF-YF-774 V1.1.0中文原稿，包含编译、启用、参数三章。原稿范围为所有芯片、所有内核版本，不代表当前兼容性验证。仅有中文来源，没有英文原图；此稿无位图插图，所有代码、配置、日志均为可编辑文本，原注释保留。封面法律、联络、受众、修订和重复目录移除。未执行命令或音频/硬件测试。

校对与安全：UUID 折行、跨页 Java 示例和注释折行已恢复；源文“两个指令”后实际列出三个，保留全部三个。原代码变量 equalizer/mEqualizer、channnel 拼写及预设列表按源保留。adb root、remount、setenforce 0 仅用于获授权的 userdebug 设备；备份参数，测试后恢复 SELinux 强制策略，勿将调试设置直接用于量产。

<!-- source:cn p2 unit:0 -->

## 1. 编译

<!-- source:cn p2 unit:1 -->

### 1.1 确认项目 BoardConfig.mk 位置

<!-- source:cn p2 unit:2 -->

BoardConfig.mk 的位置与芯片型号和 lunch 时选择的 product 有关

<!-- source:cn p3 unit:3 -->

比如芯片名称为 rk3588 , product 为 rk3588_u

<!-- source:cn p3 unit:4 -->

```text
# echo $TARGET_PRODUCT
# rk3588_u
```

<!-- source:cn p3 unit:5 -->

则 BoardConfig.mk 的位置为 device/rockchip/rk3588/rk3588_u/BoardConfig.mk

<!-- source:cn p3 unit:6 -->

### 1.2 添加编译开关

<!-- source:cn p3 unit:7 -->

在项目的 BoardConfig.mk 添加下面的编译开关, 确保 hardware/rockchip/audio/eqdrc 被编译

<!-- source:cn p3 unit:8 -->

```text
BOARD_USE_AUDIO_EQDRC := true
```

<!-- source:cn p3 unit:9 -->

## 2. 启用

<!-- source:cn p3 unit:10 -->

### 2.1 声明音效

<!-- source:cn p3 unit:11 -->

在 frameworks/av/media/libeffects/data/audio_effects.xml 中声明 EQ/DRC 音效

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

### 2.2 启用音效

<!-- source:cn p3 unit:14 -->

根据应用音效的范围选择绑定方式

<!-- source:cn p3 unit:15 -->

#### 2.2.1 动态绑定

<!-- source:cn p3 unit:16 -->

在 MediaPlayer 或 AudioTrack 创建时动态绑定 EQ/DRC, 这种方法对局部的音频流有效

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

#### 2.2.2 Stream HAL 绑定

<!-- source:cn p3 unit:19 -->

在 audio_effects.xml 中指定对应的流类型来绑定, 这种方法对全局的特定类型的音频流有效比如绑定到 music 类型的 output stream

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

也可以绑定多个类型的 output stream

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

目前总共有下面几种类型的 output stream:

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

### 2.3 验证

<!-- source:cn p4 unit:26 -->

#### 2.3.1 确认音效注册状态

<!-- source:cn p4 unit:27 -->

确认声明的音效是否已经注册到 AudioFlinger通过 dumpsys media.audio_flinger 确认

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

#### 2.3.2 确认音效绑定状态

<!-- source:cn p5 unit:30 -->

确认需要的音效是否能正常绑定到对应的 output stream在 Android App 播放音频, 通过 dumpsys media.audio_flinger 确认

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

## 3. 参数

<!-- source:cn p5 unit:33 -->

### 3.1 参数文件及目录

<!-- source:cn p5 unit:34 -->

#### 3.1.1 参数文件

<!-- source:cn p5 unit:35 -->

默认参数文件保存在以下两个 bin 文件

<!-- source:cn p5 unit:36 -->

```text
rkaudio_effect_eqdrc_44100hz_2ch.bin
rkaudio_effect_eqdrc_48000hz_2ch.bin
```

<!-- source:cn p5 unit:37 -->

也支持其他预设的参数文件

<!-- source:cn p6 unit:38 -->

```text
rkaudio_effect_eqdrc_48000hz_2ch_classroom.bin
rkaudio_effect_eqdrc_48000hz_2ch_meeting.bin
rkaudio_effect_eqdrc_48000hz_2ch_standard.bin
```

<!-- source:cn p6 unit:39 -->

#### 3.1.2 参数目录

<!-- source:cn p6 unit:40 -->

SDK 默认保存到 hardware/rockchip/audio/eqdrc/configs/出厂默认 install 到设备的 /vendor/etc/userdebug 版本下, PC 工具 push 的参数文件会保存到设备的 /vendor/etc/App 使用默认配置时 (preset 为 0), 下发的参数将会保存到设备的 /data/vendor/audio/ , EQ/DRC 创建时首先加载这个目录的参数文件, 如果没有则加载默认目录的参数文件

<!-- source:cn p6 unit:41 -->

### 3.2 参数说明

<!-- source:cn p6 unit:42 -->

请参考 Rockchip_Developer_Audio_Effect_Tool.pdf

<!-- source:cn p6 unit:43 -->

### 3.3 参数调试

<!-- source:cn p6 unit:44 -->

支持 App 调参和 PC 工具调参,共两种调参方式,根据需要选择即可

<!-- source:cn p6 unit:45 -->

#### 3.3.1 自定义 App 调参

<!-- source:cn p6 unit:46 -->

如果你在 audio_effects.xml 中绑定了 EQ/DRC, 它将作为一个音效处理的实例,。此时 App 再绑定的EQ/DRC 将作为调整参数的通道

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

调用 android.media.audiofx.RockchipEqualizer.Settings 对应的 API 即可, 下面是设置 EQ 参数的例子

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

也可以直接加载预设的配置, 默认不指定使用的是 "custom", 只有在此预设下才可以调整上述的参数

<!-- source:cn p7 unit:52 -->

```text
mEqualizer.usePreset(0); // 使用 "custom" 预设
mEqualizer.usePreset(1); // 使用 "standard" 预设
mEqualizer.usePreset(2); // 使用 "meeting" 预设
mEqualizer.usePreset(3); // 使用 "classical" 预设
mEqualizer.usePreset(4); // 使用 "classroom" 预设
```

<!-- source:cn p7 unit:53 -->

#### 3.3.2 PC 工具调参

<!-- source:cn p7 unit:54 -->

PC 工具调参需要确保 build 版本是 userdebug,确保 PC 可以通过 adb 连接到设备

<!-- source:cn p7 unit:55 -->

1) 工具目录PC 工具默认放置在 SDK 的 RKTools/windows/AudioEffect_Tool.rar

<!-- source:cn p7 unit:56 -->

2) 工具补充介绍load : 加载任意目录的参数文件save : 保存当前参数文件到任意目录push : 通过 adb push 把当前参数文件保存到设备的 /vendor/etc/pull : 通过 adb pull 保存当前设备的参数文件到所选目录更多工具的介绍请参考 Rockchip_Developer_Audio_Effect_Tool.pdf

<!-- source:cn p7 unit:57 -->

注: 在 push 和 pull 操作下, 对应参数文件名的格式是 rkaudio_effect_eqdrc_xhz_ych.bin, x 和 y 分别是工具设置的采样率和通道数

<!-- source:cn p7 unit:58 -->

3) 调参步骤调参前需要在 PC 端执行下面两个指令

<!-- source:cn p7 unit:59 -->

```text
adb root
adb remount
adb shell setenforce 0
```

<!-- source:cn p8 unit:60 -->

打开 AudioEffect_tool.exeSampleRate 采样率需要和原有 pcm_config 的 rate 一致hardware/rockchip/audio/tinyalsa_hal/

<!-- source:cn p8 unit:61 -->

```text
static struct pcm_config pcm_config = {
    // ...
    .rate = 48000,
    // ...
};
```

<!-- source:cn p8 unit:62 -->

NumChan 通道数需要和原有 pcm_config 的 channels 一致hardware/rockchip/audio/tinyalsa_hal/

<!-- source:cn p8 unit:63 -->

```text
static struct pcm_config pcm_config = {
    .channels = 2,
    // ...
};
```

<!-- source:cn p8 unit:64 -->

点击 pull , 保存设备当前参数文件到所选目录 (此步骤可选)点击 load , 选择参数文件所在的目录, 加载参数文件在 Android App 播放音频调整参数后点击 push 更新参数文件到设备此时在设备端通过 logcat 可以查看到重新加载参数文件的日志

<!-- source:cn p8 unit:65 -->

```text
# logcat | grep eqdrc
06-19 07:33:12.286   714  2068 D eqdrc   : eqdrc_fx_process : reload profile
from tuner
```

<!-- source:cn p8 unit:66 -->

人耳朵听音或使用 AP 等音频测试设备,确认效果。效果达到预期则进行以下步骤,否则重复调整参数点击 save 保存到 SDK 的 hardware/rockchip/audio/eqdrc/configs 目录下

{% endraw %}
