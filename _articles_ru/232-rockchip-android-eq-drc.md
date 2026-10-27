---
title: "Руководство разработчика Android EQ/DRC Rockchip"
description: "Руководство разработчика Android EQ/DRC Rockchip — V1.1.0"
excerpt: "Руководство разработчика Android EQ/DRC Rockchip"
translation_key: "232-rockchip-android-eq-drc"
slug: "232-rockchip-android-eq-drc"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, EQ, DRC]
---

{% raw %}

# Руководство разработчика Android EQ/DRC Rockchip

Полный технический текст китайского RK-KF-YF-774 V1.1.0 от : сборка, включение и параметры. Источник указывает все чипы и версии ядра; это не утверждение о текущей проверке совместимости. Есть только китайский источник, английских оригинальных рисунков и растровых иллюстраций здесь нет. Код, конфигурации и журналы редактируемы, исходные комментарии сохранены. Удалены юридические/контактные страницы, аудитория, история изменений и повторное оглавление. Команды, аудио- и аппаратные тесты не выполнялись.

Редакция и безопасность: восстановлены переносы UUID, многостраничного Java-примера и комментариев. Источник говорит о двух командах, но перечисляет три; сохранены все три. Имена equalizer/mEqualizer, написание channnel и списки предустановок сохранены. adb root, remount и setenforce 0 — только для разрешённой отладки userdebug; сохраните параметры, после тестов восстановите SELinux и не переносите отладочные настройки в серийный продукт.

<!-- source:cn p2 unit:0 -->

## 1. Сборка

<!-- source:cn p2 unit:1 -->

### 1.1 Найдите BoardConfig.mk проекта

<!-- source:cn p2 unit:2 -->

Расположение BoardConfig.mk зависит от чипа и product, выбранного через lunch.

<!-- source:cn p3 unit:3 -->

Пример: чип rk3588, product rk3588_u.

<!-- source:cn p3 unit:4 -->

```text
# echo $TARGET_PRODUCT
# rk3588_u
```

<!-- source:cn p3 unit:5 -->

Тогда BoardConfig.mk расположен в device/rockchip/rk3588/rk3588_u/BoardConfig.mk.

<!-- source:cn p3 unit:6 -->

### 1.2 Добавьте флаг сборки

<!-- source:cn p3 unit:7 -->

Добавьте следующий флаг в BoardConfig.mk проекта для сборки hardware/rockchip/audio/eqdrc.

<!-- source:cn p3 unit:8 -->

```text
BOARD_USE_AUDIO_EQDRC := true
```

<!-- source:cn p3 unit:9 -->

## 2. Включение

<!-- source:cn p3 unit:10 -->

### 2.1 Объявление эффекта

<!-- source:cn p3 unit:11 -->

Объявите EQ/DRC в frameworks/av/media/libeffects/data/audio_effects.xml.

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

### 2.2 Включение эффекта

<!-- source:cn p3 unit:14 -->

Выберите способ привязки согласно требуемой области действия эффекта.

<!-- source:cn p3 unit:15 -->

#### 2.2.1 Динамическая привязка

<!-- source:cn p3 unit:16 -->

Динамически привяжите EQ/DRC при создании MediaPlayer или AudioTrack. Это действует на отдельный аудиопоток.

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

#### 2.2.2 Привязка Stream HAL

<!-- source:cn p3 unit:19 -->

Задайте тип потока в audio_effects.xml. Это глобально действует на потоки выбранного типа, например выходные потоки music.

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

Можно привязать несколько типов выходных потоков.

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

Доступны следующие типы выходных потоков:

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

### 2.3 Проверка

<!-- source:cn p4 unit:26 -->

#### 2.3.1 Проверка регистрации эффекта

<!-- source:cn p4 unit:27 -->

Проверьте регистрацию объявленного эффекта в AudioFlinger командой dumpsys media.audio_flinger.

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

#### 2.3.2 Проверка привязки эффекта

<!-- source:cn p5 unit:30 -->

Проверьте привязку эффекта к нужному выходному потоку. Запустите звук в Android-приложении и проверьте dumpsys media.audio_flinger.

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

## 3. Параметры

<!-- source:cn p5 unit:33 -->

### 3.1 Файлы и каталоги параметров

<!-- source:cn p5 unit:34 -->

#### 3.1.1 Файлы параметров

<!-- source:cn p5 unit:35 -->

Параметры по умолчанию хранятся в следующих двух двоичных файлах.

<!-- source:cn p5 unit:36 -->

```text
rkaudio_effect_eqdrc_44100hz_2ch.bin
rkaudio_effect_eqdrc_48000hz_2ch.bin
```

<!-- source:cn p5 unit:37 -->

Поддерживаются и другие файлы предустановленных параметров.

<!-- source:cn p6 unit:38 -->

```text
rkaudio_effect_eqdrc_48000hz_2ch_classroom.bin
rkaudio_effect_eqdrc_48000hz_2ch_meeting.bin
rkaudio_effect_eqdrc_48000hz_2ch_standard.bin
```

<!-- source:cn p6 unit:39 -->

#### 3.1.2 Каталоги параметров

<!-- source:cn p6 unit:40 -->

В SDK значения по умолчанию находятся в hardware/rockchip/audio/eqdrc/configs/ и устанавливаются в /vendor/etc/. В userdebug инструмент ПК отправляет файлы в /vendor/etc/. При стандартной конфигурации приложения (preset 0) параметры сохраняются в /data/vendor/audio/. При создании EQ/DRC сначала загружает параметры оттуда, а при отсутствии — из каталога по умолчанию.

<!-- source:cn p6 unit:41 -->

### 3.2 Описание параметров

<!-- source:cn p6 unit:42 -->

См. Rockchip_Developer_Audio_Effect_Tool.pdf.

<!-- source:cn p6 unit:43 -->

### 3.3 Настройка параметров

<!-- source:cn p6 unit:44 -->

Поддерживаются два способа: приложение и инструмент ПК. Выбирайте по необходимости.

<!-- source:cn p6 unit:45 -->

#### 3.3.1 Настройка своим приложением

<!-- source:cn p6 unit:46 -->

Если EQ/DRC привязан в audio_effects.xml, этот экземпляр обрабатывает звук. Дополнительная привязка EQ/DRC из приложения служит каналом настройки параметров.

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

Вызовите соответствующие API android.media.audiofx.RockchipEqualizer.Settings. Пример ниже задаёт параметры EQ.

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

Можно загрузить готовую настройку. Без явного выбора используется "custom"; только она позволяет менять параметры выше.

<!-- source:cn p7 unit:52 -->

```text
mEqualizer.usePreset(0); // 使用 "custom" 预设
mEqualizer.usePreset(1); // 使用 "standard" 预设
mEqualizer.usePreset(2); // 使用 "meeting" 预设
mEqualizer.usePreset(3); // 使用 "classical" 预设
mEqualizer.usePreset(4); // 使用 "classroom" 预设
```

<!-- source:cn p7 unit:53 -->

#### 3.3.2 Настройка инструментом ПК

<!-- source:cn p7 unit:54 -->

Для настройки с ПК нужны сборка userdebug и подключение устройства через adb.

<!-- source:cn p7 unit:55 -->

1) Расположение инструмента. Обычно в SDK: RKTools/windows/AudioEffect_Tool.rar.

<!-- source:cn p7 unit:56 -->

2) Дополнительные функции. load загружает параметры из любого каталога; save сохраняет текущие параметры; push через adb push отправляет их в /vendor/etc/ устройства; pull через adb pull сохраняет текущие параметры устройства в выбранный каталог. Подробности — Rockchip_Developer_Audio_Effect_Tool.pdf.

<!-- source:cn p7 unit:57 -->

Примечание: push/pull используют имя rkaudio_effect_eqdrc_xhz_ych.bin, где x/y — частота дискретизации/число каналов инструмента.

<!-- source:cn p7 unit:58 -->

3) Порядок настройки. Сначала выполните на ПК две следующие команды.

<!-- source:cn p7 unit:59 -->

```text
adb root
adb remount
adb shell setenforce 0
```

<!-- source:cn p8 unit:60 -->

Откройте AudioEffect_tool.exe. SampleRate должен совпадать с rate текущего pcm_config в hardware/rockchip/audio/tinyalsa_hal/.

<!-- source:cn p8 unit:61 -->

```text
static struct pcm_config pcm_config = {
    // ...
    .rate = 48000,
    // ...
};
```

<!-- source:cn p8 unit:62 -->

NumChan должен совпадать с channels текущего pcm_config в hardware/rockchip/audio/tinyalsa_hal/.

<!-- source:cn p8 unit:63 -->

```text
static struct pcm_config pcm_config = {
    .channels = 2,
    // ...
};
```

<!-- source:cn p8 unit:64 -->

При необходимости нажмите pull для сохранения параметров устройства. Нажмите load и выберите каталог параметров. Воспроизведите звук в Android-приложении, настройте параметры и нажмите push. На устройстве logcat покажет журнал повторной загрузки параметров.

<!-- source:cn p8 unit:65 -->

```text
# logcat | grep eqdrc
06-19 07:33:12.286   714  2068 D eqdrc   : eqdrc_fx_process : reload profile
from tuner
```

<!-- source:cn p8 unit:66 -->

Проверьте результат на слух или аудиотестером, например AP. Если результат устраивает, нажмите save и сохраните параметры в hardware/rockchip/audio/eqdrc/configs SDK; иначе повторите настройку.

{% endraw %}
