---
title: "Rockchip Android EQ/DRC Entwicklerhandbuch"
description: "Rockchip Android EQ/DRC Entwicklerhandbuch — V1.1.0"
excerpt: "Rockchip Android EQ/DRC Entwicklerhandbuch"
translation_key: "232-rockchip-android-eq-drc"
slug: "232-rockchip-android-eq-drc"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, EQ, DRC]
---

{% raw %}

# Rockchip Android EQ/DRC Entwicklerhandbuch

Vollständiger technischer Text der chinesischen Quelle RK-KF-YF-774 V1.1.0 vom : Kompilierung, Aktivierung und Parameter. Der Quellumfang nennt alle Chips/Kernelversionen, nicht aktuell geprüfte Kompatibilität. Es gibt nur eine chinesische Quelle, keine englischen Originalbilder oder Bitmap-Abbildungen in diesem Dokument. Code, Konfigurationen und Logs bleiben editierbar, Quellkommentare erhalten. Rechts-/Kontakt-, Zielgruppen-, Revisions- und doppelte Inhaltsangaben entfallen. Keine Befehle oder Audio-/Hardwaretests wurden ausgeführt.

Redaktion/Sicherheit: UUID-Umbrüche, das seitengetrennte Java-Beispiel und Kommentarumbrüche sind repariert. Der Text nennt zwei Befehle, listet aber drei; alle bleiben erhalten. equalizer/mEqualizer, die Schreibweise channnel und Presetlisten bleiben wie im Original. adb root, remount und setenforce 0 nur auf autorisierten userdebug-Geräten; Parameter sichern, danach SELinux-Erzwingung wiederherstellen und Debug-Einstellungen nicht unverändert in Seriengeräte übernehmen.

<!-- source:cn p2 unit:0 -->

## 1. Kompilierung

<!-- source:cn p2 unit:1 -->

### 1.1 BoardConfig.mk des Projekts finden

<!-- source:cn p2 unit:2 -->

Der Pfad von BoardConfig.mk hängt vom Chip und dem mit lunch gewählten product ab.

<!-- source:cn p3 unit:3 -->

Beispiel: Chip rk3588, product rk3588_u.

<!-- source:cn p3 unit:4 -->

```text
# echo $TARGET_PRODUCT
# rk3588_u
```

<!-- source:cn p3 unit:5 -->

Dann liegt BoardConfig.mk unter device/rockchip/rk3588/rk3588_u/BoardConfig.mk.

<!-- source:cn p3 unit:6 -->

### 1.2 Build-Schalter hinzufügen

<!-- source:cn p3 unit:7 -->

Den folgenden Schalter in BoardConfig.mk eintragen, damit hardware/rockchip/audio/eqdrc kompiliert wird.

<!-- source:cn p3 unit:8 -->

```text
BOARD_USE_AUDIO_EQDRC := true
```

<!-- source:cn p3 unit:9 -->

## 2. Aktivierung

<!-- source:cn p3 unit:10 -->

### 2.1 Effekt deklarieren

<!-- source:cn p3 unit:11 -->

EQ/DRC in frameworks/av/media/libeffects/data/audio_effects.xml deklarieren.

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

### 2.2 Effekt aktivieren

<!-- source:cn p3 unit:14 -->

Die Bindungsart entsprechend dem gewünschten Wirkungsbereich wählen.

<!-- source:cn p3 unit:15 -->

#### 2.2.1 Dynamische Bindung

<!-- source:cn p3 unit:16 -->

EQ/DRC beim Erzeugen von MediaPlayer oder AudioTrack dynamisch binden. Dies wirkt auf den einzelnen Audiostream.

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

#### 2.2.2 Stream-HAL-Bindung

<!-- source:cn p3 unit:19 -->

Den Streamtyp in audio_effects.xml angeben. Dies wirkt global auf Streams dieses Typs, beispielsweise music-Ausgabestreams.

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

Auch mehrere Ausgabestreamtypen können gebunden werden.

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

Folgende Ausgabestreamtypen sind verfügbar:

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

### 2.3 Überprüfung

<!-- source:cn p4 unit:26 -->

#### 2.3.1 Effektregistrierung prüfen

<!-- source:cn p4 unit:27 -->

Mit dumpsys media.audio_flinger prüfen, ob der deklarierte Effekt bei AudioFlinger registriert ist.

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

#### 2.3.2 Effektbindung prüfen

<!-- source:cn p5 unit:30 -->

Prüfen, ob der Effekt an den richtigen Ausgabestream gebunden ist. Audio in einer Android-App abspielen und dumpsys media.audio_flinger prüfen.

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

## 3. Parameter

<!-- source:cn p5 unit:33 -->

### 3.1 Parameterdateien und Verzeichnisse

<!-- source:cn p5 unit:34 -->

#### 3.1.1 Parameterdateien

<!-- source:cn p5 unit:35 -->

Standardparameter stehen in den folgenden zwei Binärdateien.

<!-- source:cn p5 unit:36 -->

```text
rkaudio_effect_eqdrc_44100hz_2ch.bin
rkaudio_effect_eqdrc_48000hz_2ch.bin
```

<!-- source:cn p5 unit:37 -->

Weitere voreingestellte Parameterdateien werden ebenfalls unterstützt.

<!-- source:cn p6 unit:38 -->

```text
rkaudio_effect_eqdrc_48000hz_2ch_classroom.bin
rkaudio_effect_eqdrc_48000hz_2ch_meeting.bin
rkaudio_effect_eqdrc_48000hz_2ch_standard.bin
```

<!-- source:cn p6 unit:39 -->

#### 3.1.2 Parameterverzeichnisse

<!-- source:cn p6 unit:40 -->

Das SDK speichert Standardwerte unter hardware/rockchip/audio/eqdrc/configs/ und installiert sie nach /vendor/etc/. Bei userdebug überträgt das PC-Werkzeug Dateien nach /vendor/etc/. Nutzt eine App die Standardkonfiguration (preset 0), werden ihre Parameter unter /data/vendor/audio/ gespeichert. Beim Erzeugen lädt EQ/DRC zuerst aus diesem Verzeichnis, andernfalls aus dem Standardverzeichnis.

<!-- source:cn p6 unit:41 -->

### 3.2 Parameterbeschreibung

<!-- source:cn p6 unit:42 -->

Siehe Rockchip_Developer_Audio_Effect_Tool.pdf.

<!-- source:cn p6 unit:43 -->

### 3.3 Parameterabstimmung

<!-- source:cn p6 unit:44 -->

Zwei Methoden werden unterstützt: App und PC-Werkzeug. Nach Bedarf auswählen.

<!-- source:cn p6 unit:45 -->

#### 3.3.1 Abstimmung mit eigener App

<!-- source:cn p6 unit:46 -->

Ist EQ/DRC in audio_effects.xml gebunden, verarbeitet diese Instanz den Effekt. Eine zusätzliche Bindung aus der App dient dann als Kanal zur Parameteranpassung.

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

Die entsprechenden APIs von android.media.audiofx.RockchipEqualizer.Settings aufrufen. Folgendes Beispiel setzt EQ-Parameter.

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

Ein Preset kann auch direkt geladen werden. Ohne explizite Auswahl gilt "custom"; nur dieses erlaubt die obigen Parameteränderungen.

<!-- source:cn p7 unit:52 -->

```text
mEqualizer.usePreset(0); // 使用 "custom" 预设
mEqualizer.usePreset(1); // 使用 "standard" 预设
mEqualizer.usePreset(2); // 使用 "meeting" 预设
mEqualizer.usePreset(3); // 使用 "classical" 预设
mEqualizer.usePreset(4); // 使用 "classroom" 预设
```

<!-- source:cn p7 unit:53 -->

#### 3.3.2 Abstimmung mit dem PC-Werkzeug

<!-- source:cn p7 unit:54 -->

Für das PC-Werkzeug sind ein userdebug-Build und eine adb-Verbindung zum Gerät erforderlich.

<!-- source:cn p7 unit:55 -->

1) Werkzeugpfad. Das PC-Werkzeug liegt standardmäßig im SDK unter RKTools/windows/AudioEffect_Tool.rar.

<!-- source:cn p7 unit:56 -->

2) Weitere Funktionen. load lädt Parameter aus einem beliebigen Verzeichnis; save speichert aktuelle Parameter; push überträgt sie per adb push nach /vendor/etc/ auf dem Gerät; pull speichert die aktuellen Geräteparameter per adb pull im gewählten Verzeichnis. Details: Rockchip_Developer_Audio_Effect_Tool.pdf.

<!-- source:cn p7 unit:57 -->

Hinweis: push/pull verwenden rkaudio_effect_eqdrc_xhz_ych.bin; x/y sind Abtastrate/Kanalzahl des Werkzeugs.

<!-- source:cn p7 unit:58 -->

3) Vorgehen. Vor der Abstimmung folgende zwei Befehle am PC ausführen.

<!-- source:cn p7 unit:59 -->

```text
adb root
adb remount
adb shell setenforce 0
```

<!-- source:cn p8 unit:60 -->

AudioEffect_tool.exe öffnen. SampleRate muss der rate der vorhandenen pcm_config in hardware/rockchip/audio/tinyalsa_hal/ entsprechen.

<!-- source:cn p8 unit:61 -->

```text
static struct pcm_config pcm_config = {
    // ...
    .rate = 48000,
    // ...
};
```

<!-- source:cn p8 unit:62 -->

NumChan muss channels der vorhandenen pcm_config in hardware/rockchip/audio/tinyalsa_hal/ entsprechen.

<!-- source:cn p8 unit:63 -->

```text
static struct pcm_config pcm_config = {
    .channels = 2,
    // ...
};
```

<!-- source:cn p8 unit:64 -->

Optional mit pull die aktuellen Geräteparameter sichern. Mit load das Parameterverzeichnis wählen. Audio in einer Android-App abspielen, Parameter anpassen und mit push aktualisieren. logcat auf dem Gerät zeigt das erneute Laden der Parameter.

<!-- source:cn p8 unit:65 -->

```text
# logcat | grep eqdrc
06-19 07:33:12.286   714  2068 D eqdrc   : eqdrc_fx_process : reload profile
from tuner
```

<!-- source:cn p8 unit:66 -->

Das Ergebnis anhören oder mit Audiomesstechnik wie AP prüfen. Bei Erfolg mit save unter hardware/rockchip/audio/eqdrc/configs im SDK speichern; andernfalls erneut abstimmen.

{% endraw %}
