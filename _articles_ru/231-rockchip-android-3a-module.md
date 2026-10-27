---
title: "Руководство разработчика модуля Android 3A Rockchip"
description: "Руководство разработчика модуля Android 3A Rockchip — V1.0.0"
excerpt: "Руководство разработчика модуля Android 3A Rockchip"
translation_key: "231-rockchip-android-3a-module"
slug: "231-rockchip-android-3a-module"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, AEC]
---

{% raw %}

# Руководство разработчика модуля Android 3A Rockchip

Полное техническое издание четырёх глав китайского RK-KF-YF-793 V1.0.0 от : сборка, включение, параметры и устранение ошибок. Таблица применимости указывает все чипы и версии ядра; это историческая область источника, не обещание текущей совместимости. Есть только китайский источник, английских оригинальных рисунков нет. Символьные схемы аудиотракта сохранены как редактируемый код и дополнены исходными фрагментами китайского PDF; изображения не объявляются локализованными. Исключены юридические страницы, аудитория, история изменений и повторное оглавление, но не технические параметры. Команды, запись и аппаратные тесты не выполнялись.

Редакционные замечания: соединены разрывы кода и таблиц между страницами, восстановлены UUID и последний символ заголовка 4.1. Пустые описания attenuate_time и пяти параметров DOA оставлены пустыми, как в источнике. supEnergy2 описан как «точка 1»; fRk1/fRk2 — неактивный наклон экспандирования; регистр HardThreshold/PrioriRatio сохранён без догадок об алгоритме. Комментарии кода, UUID, имена параметров, журналы и исходные многоточия сохранены. Безопасность: adb root/remount и setenforce 0 предназначены только для разрешённой отладки; последняя команда отключает принудительное применение SELinux, после теста восстановите политику. Аудиодампы могут содержать личные записи: ограничьте доступ и удаляйте ненужные файлы.

<!-- source:cn p2 unit:0 -->

## 1. Сборка

<!-- source:cn p3 unit:1 -->

### 1.1 Найдите BoardConfig.mk проекта

<!-- source:cn p3 unit:2 -->

Расположение BoardConfig.mk зависит от чипа и product, выбранного через lunch. Пример: чип rk3588, product rk3588_u.

<!-- source:cn p3 unit:3 -->

```text
# echo $TARGET_PRODUCT
# rk3588_u
```

<!-- source:cn p3 unit:4 -->

Тогда BoardConfig.mk расположен в device/rockchip/rk3588/rk3588_u/BoardConfig.mk.

<!-- source:cn p3 unit:5 -->

### 1.2 Добавьте флаг сборки

<!-- source:cn p3 unit:6 -->

Добавьте следующий флаг в BoardConfig.mk проекта для сборки hardware/rockchip/audio/preprocess.

<!-- source:cn p3 unit:7 -->

```text
BOARD_USE_AUDIO_PREPROCESS := true
```

<!-- source:cn p3 unit:8 -->

## 2. Включение

<!-- source:cn p3 unit:9 -->

### 2.1 Объявление эффектов

<!-- source:cn p3 unit:10 -->

Измените frameworks/av/media/libeffects/data/audio_effects.xml, объявив следующий набор эффектов.

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

### 2.2 Включение эффектов

<!-- source:cn p4 unit:14 -->

Подробности об эффектах см. в Rockchip_Developer_Guide_Microphone_Array_Tuning.pdf. Перед включением выполните два изменения:

<!-- source:cn p4 unit:15 -->

1) Установите длительность кадра записи tinyalsa_hal в 16 мс с округлением вниз.

<!-- source:cn p4 unit:16 -->

```text
period_size = (int)(rate * 0.016 / 4) * 4
```

<!-- source:cn p4 unit:17 -->

При 48000 Гц period_size = (int)(48000 * 0.016 / 4) * 4 = 768. При 44100 Гц period_size = (int)(44100 * 0.016 / 4) * 4 = 704. Затем измените соответствующий pcm config в hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p4 unit:18 -->

```text
static struct pcm_config pcm_config_in = {
    // ...
    .rate = 48000,
    .period_size = 768,
};
```

<!-- source:cn p4 unit:19 -->

2) Измените число каналов MIC.

<!-- source:cn p5 unit:20 -->

Уточнив число каналов MIC, измените конфигурацию ниже; пример для двух каналов MIC в hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p5 unit:21 -->

```text
#define PCM_CAPTURE_CHANNELS 2
```

<!-- source:cn p5 unit:22 -->

Один MIC сейчас обрабатывается как два канала.

<!-- source:cn p5 unit:23 -->

#### 2.2.1 AEC

<!-- source:cn p5 unit:24 -->

| <code>effect</code> | Описание |
| --- | --- |
| <code>preproc_aec_normal</code> | Модуль AEC |
| <code>preproc_aec_delay</code> | Подмодуль оценки задержки AEC |
| <code>preproc_aec_array_reset</code> | Перестановка входных аудиоканалов AEC |
| <code>preproc_ref_hw</code> | Аппаратный опорный сигнал обратного захвата |
| <code>preproc_ref_sw_dlp</code> | Программный опорный сигнал через DLP |
| <code>preproc_ref_sw_alp_playback</code> | Программный обратный захват: буферизация данных Aloop |
| <code>preproc_ref_sw_alp_capture</code> | Программный обратный захват: получение данных Aloop |

<!-- source:cn p5 unit:25 -->

Для подавления эха AEC необходим опорный сигнал обратного захвата; конфигурация зависит от аудиотракта или топологии.

<!-- source:cn p5 unit:26 -->

1) Аппаратный обратный захват. На схемах [L1][R1]... — опорные данные, возвращаемые с точки перед SPK на аудиоинтерфейс CPU DAI1; [L2][R2]... — данные MIC.

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

Измените число опорных каналов; пример: два канала в hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p6 unit:31 -->

```text
#define PCM_REFERENCE_CHANNELS 2
```

<!-- source:cn p6 unit:32 -->

В frameworks/av/media/libeffects/data/audio_effects.xml привяжите соответствующие потоки к следующим эффектам.

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

2) Программный обратный захват DLP применяется, когда запись и воспроизведение используют один cpu dai. На схеме [L1][R1]... — опорные данные в буфере DLP, [L2][R2]... — данные MIC.

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

Измените конфигурацию ядра для сборки DLP.

<!-- source:cn p6 unit:37 -->

```text
CONFIG_SND_SOC_ROCKCHIP_DLP_PCM
```

<!-- source:cn p6 unit:38 -->

В dts включите DLP для соответствующего cpu dai.

<!-- source:cn p7 unit:39 -->

```text
&i2s {
        rockchip,digital-loopback;
};
```

<!-- source:cn p7 unit:40 -->

Варианты cpu dai: i2s0_8ch, i2s1_8ch, i2s2_2ch, i2s3_2ch, sai0, sai1 и другие. Добавьте маршрут в tinyalsa_hal. Имена звуковых карт соответствуют разным файлам конфигурации; проверьте sound_card_config_list. При отсутствии совпадения используется default_config.h. Пример: два канала MIC + два опорных канала.

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

Доступные варианты перечислены ниже; выберите согласно числу каналов MIC и опорных каналов.

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

Измените число опорных каналов; пример: два канала в hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p8 unit:45 -->

```text
#define PCM_REFERENCE_CHANNELS 2
```

<!-- source:cn p8 unit:46 -->

В frameworks/av/media/libeffects/data/audio_effects.xml привяжите соответствующие потоки к следующим эффектам.

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

3) Программный обратный захват Aloop используется при разных cpu dai для записи и воспроизведения. [L1][R1]... — опорные данные в Aloop, [L2][R2]... — данные MIC. Данные объединяются на Step#4.

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

Измените конфигурацию ядра для сборки Aloop.

<!-- source:cn p9 unit:51 -->

```text
CONFIG_SND_DRIVERS
CONFIG_SND_ALOOP
```

<!-- source:cn p9 unit:52 -->

Число опорных каналов задавать не нужно: Aloop использует два канала по умолчанию. Файл: hardware/rockchip/audio/tinyalsa_hal/audio_hw.c.

<!-- source:cn p9 unit:53 -->

```text
#define PCM_REFERENCE_CHANNELS 0
```

<!-- source:cn p9 unit:54 -->

В frameworks/av/media/libeffects/data/audio_effects.xml привяжите соответствующие потоки к следующим эффектам.

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

| <code>effect</code> | Описание |
| --- | --- |
| <code>preproc_bf_fast_aec</code> | Линейное подавление остаточного эха BF для дополнительной очистки тракта пробуждения |
| <code>preproc_bf_wakeup</code> | Модуль пробуждения BF |
| <code>preproc_bf_dereverb</code> | Модуль подавления реверберации BF |
| <code>preproc_bf_nlp</code> | Нелинейное подавление остаточного эха BF в тракте разговора (устаревший модуль) |
| <code>preproc_bf_aes</code> | Нелинейное подавление остаточного эха BF |
| <code>preproc_bf_agc</code> | Автоматическая регулировка усиления BF |
| <code>preproc_bf_anr</code> | Подавление шума BF |
| <code>preproc_bf_gsc</code> | Постфильтр формирования луча BF для дополнительного шумоподавления; включать по результатам проверки |
| <code>preproc_bf_gsc_method</code> | BF: выключено — GSC использует LMS; включено — RLS, требующий больше вычислений, чем LMS |
| <code>preproc_bf_fix</code> | BF с фиксированным направлением луча |
| <code>preproc_bf_dtd</code> | Определение односторонней/одновременной речи BF |
| <code>preproc_bf_cng</code> | Комфортный шум BF |
| <code>preproc_bf_eq</code> | Регулировка эквалайзера BF |
| <code>preproc_bf_chn_select</code> | BF для индивидуального расширения MIC |
| <code>preproc_bf_howling</code> | Подавление акустической обратной связи BF; включать по необходимости |
| <code>preproc_bf_doa</code> | Локализация источника звука BF оценивает его направление; включать по необходимости |
| <code>preproc_bf_wind</code> | Подавление ветрового шума BF; включать по необходимости |
| <code>preproc_bf_ainr</code> | Шумоподавление BF с ИИ; при включении ANR принудительно отключается |

<!-- source:cn p10 unit:58 -->

Для preproc_bf_fast_aec и preproc_bf_aes сначала настройте AEC. В frameworks/av/media/libeffects/data/audio_effects.xml привяжите потоки к эффектам ниже.

<!-- source:cn p10 unit:59 -->

1) Рекомендуемые эффекты BF для пробуждения:

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

2) Рекомендуемые эффекты BF для голосовых вызовов:

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

3) При необходимости привяжите другие эффекты.

<!-- source:cn p11 unit:65 -->

#### 2.2.3 RX

<!-- source:cn p11 unit:66 -->

| <code>effect</code> | Описание |
| --- | --- |
| <code>preproc_rx_anr</code> | Подавление шума; включать согласно условиям применения |
| <code>preproc_rx_howling</code> | Подавление акустической обратной связи; включать по необходимости |

<!-- source:cn p11 unit:67 -->

В frameworks/av/media/libeffects/data/audio_effects.xml привяжите потоки к необходимым эффектам ниже.

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

### 2.3 Проверка

<!-- source:cn p12 unit:70 -->

1) Проверьте регистрацию в AudioFlinger командой dumpsys media.audio_flinger.

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

2) Проверьте привязку к нужному потоку. Во время записи или разговора используйте dumpsys media.audio_flinger. Пример: разговор с программным опорным сигналом Aloop.

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

## 3. Параметры

<!-- source:cn p16 unit:79 -->

Значения по умолчанию находятся в rkaudio_effect_preprocess.xml: в SDK — hardware/rockchip/audio/preprocess/, на устройстве — /vendor/etc/.

<!-- source:cn p16 unit:80 -->

### 3.1 Описание параметров

<!-- source:cn p16 unit:81 -->

См. Rockchip_Developer_Guide_Microphone_Array_Tuning.pdf. После интеграции параметры по умолчанию хранятся в rkaudio_effect_preprocess.xml; далее рассматриваются этот документ и XML.

<!-- source:cn p16 unit:82 -->

### 3.2 Настройка параметров

<!-- source:cn p16 unit:83 -->

#### 3.2.1 Параметры AEC

<!-- source:cn p16 unit:84 -->

| Атрибут | Описание |
| --- | --- |
| <code>pos</code> | Позиция опорных каналов: 0 — перед данными MIC, 1 — после них. |
| <code>drop_ref_channel</code> | Число необрабатываемых опорных каналов. |
| <code>delay_len</code> | Без оценки задержки — точка задержки аппаратного опорного сигнала по умолчанию; с оценкой — начальная точка оценки задержки. |
| <code>look_ahead</code> | Длина буфера MIC. Настраивать только если известно, что захват MIC запаздывает относительно опорного сигнала; иначе оставить 0. |
| <code>filter_len</code> | Длина линейного фильтра AEC. Большая длина повышает точность оценки эха, но замедляет сходимость и увеличивает вычисления. Типичные значения: 2/4/6/8. |
| <code>Array_list</code> | Порядок аудиоканалов; требуется preproc_aec_array_reset. |

<!-- source:cn p16 unit:85 -->

Параметры оценки задержки (требуется preproc_aec_delay).

<!-- source:cn p17 unit:86 -->

| Атрибут | Описание |
| --- | --- |
| <code>max_frame</code> | Максимальное число кадров оценки; обычно 16. |
| <code>least_delay</code> | Минимальное число кадров оценки; рекомендуется 0, если MaxFrame не особенно велик. |
| <code>jump_frame</code> | Число кадров, пропускаемых в начале; обычно 12. |
| <code>delay_offset</code> | Смещение в кадрах, предотвращающее запаздывание MIC относительно опоры из-за чрезмерной оценки задержки; обычно 1. |
| <code>mic_amp_thr</code> | Минимальная энергия MIC: ниже порога оценка задержки не обновляется. Обычно 50. |
| <code>ref_amp_thr</code> | Минимальная энергия опорного сигнала: ниже порога оценка задержки не обновляется. Обычно 50. |
| <code>start_freq</code> | Начальная частота оценки задержки. Выбирайте основной речевой диапазон и корректируйте по результатам записи; обычно 500. |
| <code>end_freq</code> | Конечная частота оценки задержки. Выбирайте основной речевой диапазон и корректируйте по результатам записи; обычно 4000. |
| <code>smooth_factor</code> | Коэффициент сглаживания, обычно [0.95,1). Большие значения стабилизируют оценку задержки, меньшие ускоряют обновление. Обычно 0.97/0.99. |

<!-- source:cn p17 unit:87 -->

#### 3.2.2 Параметры BF

<!-- source:cn p17 unit:88 -->

| Атрибут | Описание |
| --- | --- |
| <code>ref_pos</code> | Позиция опорных каналов: 0 — перед данными MIC, 1 — после них. |
| <code>targ</code> | Направление приёма при включённом preproc_bf_fix. |
| <code>drop_ref_channel</code> | Число необрабатываемых опорных каналов. |

<!-- source:cn p17 unit:89 -->

1) Параметры AES (требуется preproc_bf_aes).

<!-- source:cn p18 unit:90 -->

| Атрибут | Описание |
| --- | --- |
| <code>beta_up</code> | Скорость нарастания: большие значения усиливают нелинейное подавление. Рекомендуется 0.001-0.01. |
| <code>beta_down</code> | Скорость спада: большие значения ослабляют нелинейное подавление. Рекомендуется 0.001-0.01. |
| <code>beta_up_low</code> | Низкочастотная скорость нарастания; свойства и диапазон как у beta_up. |
| <code>beta_down_low</code> | Низкочастотная скорость спада; свойства и диапазон как у beta_down. |
| <code>low_freq</code> | Граница низкочастотного диапазона. |
| <code>high_freq</code> | Граница высокочастотного диапазона. |
| <code>thd_flag</code> | 1 включает подавление гармонических искажений, 0 отключает. |
| <code>hard_flag</code> | 1 включает Hard mode: сильнее подавляет эхо, но может чрезмерно подавлять речь. |
| <code>limit_ratio_0</code> | Минимальная доля остаточного эха в диапазоне; рекомендуется [1.0f, 5.0f]. Большие значения усиливают подавление. Три столбца — низкий, средний и высокий диапазоны, задаваемые low_freq и high_freq. |
| <code>limit_ratio_1</code> | Доля подавления остаточного эха по диапазонам; рекомендуется [1.0f, 3.0f]. Большие значения усиливают подавление. Три столбца — низкий, средний и высокий диапазоны, разделённые low_freq и high_freq. |
| <code>thd_split_freq_0</code> | Диапазоны подавления гармоник. Неиспользуемую строку заполните нулями. Каждая строка — диапазон: начало в столбце 1, конец в столбце 2; диапазон обоих значений [0,1/2 * sample rate]. |
| <code>thd_split_freq_1</code> | То же, что выше. |
| <code>thd_split_freq_2</code> | То же, что выше. |
| <code>thd_split_freq_3</code> | То же, что выше. |
| <code>thd_sup_degree_0</code> | Коэффициенты подавления гармоник для указанных диапазонов. Нулевая строка диапазона отключает соответствующую строку коэффициентов. Столбцы задают подавление основной частоты, способной образовать в диапазоне гармоники со 2-й по 11-ю. Рекомендуется [0.001f,1.0f]; большее значение усиливает подавление. |
| <code>thd_sup_degree_1</code> | То же, что выше. |
| <code>thd_sup_degree_2</code> | То же, что выше. |
| <code>thd_sup_degree_3</code> | То же, что выше. |
| <code>hard_split_freq_0</code> | Диапазоны Hard mode и диапазон вычисления среднего усиления. Столбцы 1/2 — начало/конец в [0,1/2*sample rate]. Не более четырёх диапазонов Hard mode; последняя строка задаёт диапазон среднего усиления для HardThreshold ниже. |
| <code>hard_split_freq_1</code> | То же, что выше. |
| <code>hard_split_freq_2</code> | То же, что выше. |
| <code>hard_split_freq_3</code> | То же, что выше. |
| <code>hard_split_freq_4</code> | То же, что выше. |
| <code>hard_threshold</code> | Пороги включения Hard mode: четыре порога соответствуют четырём диапазонам выше. Если среднее усиление ниже порога, в соответствующем диапазоне включается Hard mode. |

<!-- source:cn p19 unit:93 -->

2) Параметры AGC (требуется preproc_bf_agc).

<!-- source:cn p19 unit:94 -->

| Атрибут | Описание |
| --- | --- |
| <code>attack_time</code> | Рекомендуется 20-600 мс. Время атаки — время увеличения усиления AGC. |
| <code>release_time</code> | Рекомендуется 20-600 мс. Время восстановления — время снижения усиления AGC. |
| <code>attenuate_time</code> |  |
| <code>max_gain</code> | Рекомендуется 0-50 дБ. Максимальное усиление, также усиление линейного участка. |
| <code>max_peak</code> | Диапазон от 0 до -87 дБ. Максимальная энергия речи после AGC. |
| <code>fRth0</code> | Диапазон от 0 до -87 дБ. Порог шумового затвора: речь ниже него не усиливается. |
| <code>fRth1</code> | Диапазон от 0 до -87 дБ. Энергетический порог конца экспандирования; речь выше него усиливается на max_gain. |
| <code>fRth2</code> | Диапазон от 0 до -87 дБ. Порог начала компрессии; выше него усиление речи постепенно падает до 0 дБ. |
| <code>fRk0</code> | Наклон участка экспандирования. |
| <code>fRk1</code> | Наклон участка экспандирования (неактивный параметр). |
| <code>fRk2</code> | Наклон участка экспандирования (неактивный параметр). |
| <code>fLineGainDb</code> | Повышение линейного участка в дБ (неактивный параметр). |
| <code>swSmL0</code> | Число точек временного сглаживания экспандирования (неактивный параметр). |
| <code>swSmL1</code> | Число точек временного сглаживания линейного участка (неактивный параметр). |
| <code>swSmL2</code> | Число точек временного сглаживания компрессии (неактивный параметр). |

<!-- source:cn p19 unit:95 -->

3) Параметры ANR (требуется preproc_bf_anr).

<!-- source:cn p20 unit:96 -->

| Атрибут | Описание |
| --- | --- |
| <code>noiseFactor</code> | Уровень оценки шума, обычно [0.5f,1.5f]; большие значения сильнее удаляют шум. |
| <code>swU</code> | Временной интервал оценки шума, обычно [2,20]. Большие значения точнее оценивают стационарный шум, но замедляют сходимость при скачках; меньшие быстрее реагируют на скачки, но могут чрезмерно подавлять речь. |
| <code>psiMin</code> | Порог вероятности наличия речи, [0.0f,1.0f]; большие значения усиливают шумоподавление. |
| <code>psiMax</code> | Порог вероятности наличия речи, [0.0f,1.0f]; большие значения усиливают шумоподавление. |
| <code>fGmin</code> | Минимальное значение шумоподавления, [0.0f,1.0f]; меньшие значения усиливают подавление. |
| <code>supFreq1</code> | Точка 1 подавления тонального шума, [0,1/2*sample rate]; шум на заданной частоте подавляется постоянно. |
| <code>supFreq2</code> | Точка 2 подавления тонального шума, [0,1/2*sample rate]; шум на заданной частоте подавляется постоянно. |
| <code>supEnergy1</code> | Энергетический порог точки 1 подавления тонального шума, обычно 100000. При превышении энергии частотной составляющей оценка тонального шума обновляется. |
| <code>supEnergy2</code> | Энергетический порог точки 1 подавления тонального шума, обычно 100000. При превышении энергии частотной составляющей оценка тонального шума обновляется. |
| <code>interV</code> | Интервал выборки кадров, обычно [2,20]. Большие значения делают оценку шума стабильнее, подобно swU. |
| <code>biasMin</code> | Компенсация шума, обычно [1.0f, 2.0f]; большие значения усиливают подавление. |
| <code>updateFrm</code> | Длина быстрой сходимости, обычно 15: ускоренная сходимость первых 15 кадров. |
| <code>nPreGammaThr</code> | Порог вероятности чистого шума, обычно (3.0f,5.0f); большие значения усиливают подавление. |
| <code>nPreZetaThr</code> | Порог вероятности чистого шума, обычно (1.0f,3.0f); большие значения усиливают подавление. |
| <code>sabsGammaThr0</code> | Порог вероятности отсутствия речи, обычно (0.5f,1.5f); большие значения усиливают подавление. |
| <code>sabsGammaThr1</code> | Порог вероятности отсутствия речи, обычно (2.f,4.0f); большие значения усиливают подавление. |
| <code>infSmooth</code> | Коэффициент сглаживания входного сигнала, (0.0f,1.0f). |
| <code>probSmooth</code> | Коэффициент сглаживания вероятности наличия речи, (0.0f,1.0f). |
| <code>compCoeff</code> | Компенсация шума, обычно [1.0f, 2.0f], для диапазонов ниже средней оценки шума. Большие значения усиливают подавление. |
| <code>prioriMin</code> | Минимальное априорное SNR, (0.0f, 0.5f); большие значения ослабляют шумоподавление. |
| <code>postMax</code> | Максимальное апостериорное SNR; обычно 40. |
| <code>prioriRatio</code> | Коэффициент сглаживания априорного SNR, (0.0f,1.0f); большие значения усиливают шумоподавление. |
| <code>prioriRatioLow</code> | Коэффициент сглаживания априорного SNR, (0.0f,1.0f); большие значения усиливают шумоподавление. |
| <code>splitBand</code> | Индекс разделения диапазонов, [0,32]. Ниже него априорное SNR сглаживается PrioriRatioLow, иначе — PrioriRatio. |
| <code>prioriSmooth</code> | Коэффициент сглаживания априорного SNR, (0.0f,1.0f); большие значения усиливают шумоподавление. |
| <code>tranMode</code> | Режим импульсного шума: 0 — выключен, 1 — подавление по обнаружению, 2 — по оценке. |

<!-- source:cn p21 unit:99 -->

4) Параметры подавления реверберации (требуется preproc_bf_dereverb).

<!-- source:cn p21 unit:100 -->

| Атрибут | Описание |
| --- | --- |
| <code>rlsLg</code> | Порядок RLS-фильтра подавления реверберации для пробуждения. В определённых пределах больший порядок усиливает эффект и увеличивает вычисления. Рекомендуется 4. |
| <code>curveLg</code> | Порядок кривой распределения для подавления реверберации в разговоре. Большие значения усиливают эффект и риск чрезмерного подавления. Рекомендуется 10. |
| <code>delay</code> | Задержка RLS-фильтра определяет сохранение ранней реверберации. Рекомендуется 2. |
| <code>forgetting</code> | Коэффициент забывания RLS. Меньшие значения усиливают подавление реверберации и риск чрезмерного подавления. Рекомендуется 0.98-0.999. |
| <code>t60</code> | Оценка времени реверберации в секундах. Большие значения усиливают подавление и риск чрезмерной обработки. Рекомендуется 0.68 при слабой реверберации, 1.5 при средней/сильной. |
| <code>coCoeff</code> | Коэффициент взаимной когерентности против чрезмерного подавления. Меньшие значения усиливают эффект. Рекомендуется 2 при слабой реверберации, 1 при средней/сильной. |

<!-- source:cn p21 unit:101 -->

5) Параметры комфортного шума (требуется preproc_bf_cng).

<!-- source:cn p21 unit:102 -->

| Атрибут | Описание |
| --- | --- |
| <code>fGain</code> | Рекомендуется 0-50 дБ. Коэффициент амплитуды добавляемого комфортного шума; по умолчанию 2. |
| <code>fMpy</code> | Рекомендуется 0-50 дБ. Амплитуда случайного генератора белого шума; по умолчанию 5. |
| <code>fSmoothAlpha</code> | Диапазон 0.0f-1.0f. Сглаживание комфортного шума; по умолчанию 0.92. |
| <code>fSpeechGain</code> | Диапазон 0.0f-1.0f. Степень имитации речевой структуры комфортного шума; по умолчанию 0.3. |

<!-- source:cn p21 unit:103 -->

6) Параметры DTD (требуется preproc_bf_dtd).

<!-- source:cn p21 unit:104 -->

| Атрибут | Описание |
| --- | --- |
| <code>ksiThd_high</code> | Верхний порог односторонней/одновременной речи; выше него определяется односторонняя речь. |
| <code>ksiThd_low</code> | Нижний порог; ниже него определяется односторонняя речь. |

<!-- source:cn p21 unit:105 -->

7) Параметры DOA (требуется preproc_bf_doa).

<!-- source:cn p22 unit:106 -->

| Атрибут | Описание |
| --- | --- |
| <code>rad</code> |  |
| <code>start_freq</code> |  |
| <code>end_freq</code> |  |
| <code>lg_num</code> |  |
| <code>lg_pitch_num</code> |  |

<!-- source:cn p22 unit:107 -->

8) Параметры EQ (требуется preproc_bf_eq).

<!-- source:cn p22 unit:108 -->

| Атрибут | Описание |
| --- | --- |
| <code>shwParaLen</code> | Число коэффициентов фильтра. |
| <code>filter_bank_0</code> | Коэффициенты фильтра. |
| <code>filter_bank_1</code> | Коэффициенты фильтра. |
| <code>filter_bank_2</code> | Коэффициенты фильтра. |
| <code>filter_bank_3</code> | Коэффициенты фильтра. |
| <code>filter_bank_4</code> | Коэффициенты фильтра. |

<!-- source:cn p22 unit:109 -->

### 3.3 Настройка и отладка параметров

<!-- source:cn p22 unit:110 -->

Используйте сборку userdebug и проверьте подключение ПК через ADB. На ПК выполните две следующие команды.

<!-- source:cn p22 unit:111 -->

```text
adb root
adb remount
```

<!-- source:cn p22 unit:112 -->

#### 3.3.1 Обновление параметров

<!-- source:cn p22 unit:113 -->

Измените rkaudio_effect_preprocess.xml и отправьте его через push в соответствующий каталог устройства.

<!-- source:cn p22 unit:114 -->

```text
adb push rkaudio_effect_preprocess.xml /vendor/etc/
```

<!-- source:cn p22 unit:115 -->

#### 3.3.2 Анализ выхода

<!-- source:cn p22 unit:116 -->

Перезапустите запись для проверки результата либо разговор для проверки выхода удалённой стороны. Также можно выгрузить вход/выход и проанализировать потоки напрямую.

<!-- source:cn p22 unit:117 -->

```text
setenforce 0
setprop vendor.audio.preproc.debug 1
```

<!-- source:cn p22 unit:118 -->

Затем экспортируйте два следующих файла и проанализируйте их в Audacity или другом инструменте ПК.

<!-- source:cn p23 unit:119 -->

```text
/data/misc/audioserver/preproc_input_xxxhz_xxxch.pcm
/data/misc/audioserver/preproc_output_xxxhz_xxxch.pcm
```

<!-- source:cn p23 unit:120 -->

xxxhz обозначает частоту дискретизации, xxxch — число каналов. В Audacity выберите «Файл», «Импорт», «Необработанные данные», затем задайте частоту и каналы. После проверки результата обновите rkaudio_effect_preprocess.xml в hardware/rockchip/audio/preprocess/.

<!-- source:cn p23 unit:121 -->

## 4. Вопросы и ответы

<!-- source:cn p23 unit:122 -->

### 4.1 После добавления DLP запись с заданным числом каналов MIC + опоры завершается ошибкой параметров

<!-- source:cn p23 unit:123 -->

Пример: два канала MIC и два опорных канала.

<!-- source:cn p23 unit:124 -->

```text
# tinycap /sdcard/mic.wav -D xxx -c 4 -r 48000
Unable to open PCM device (cannot set hw params: Invalid argument)
Captured 0 frames
```

<!-- source:cn p23 unit:125 -->

xxx — индекс соответствующей звуковой карты в выводе cat /proc/asound/cards.

<!-- source:cn p23 unit:126 -->

#### 4.1.1 Проверка маршрута

<!-- source:cn p23 unit:127 -->

(1) Проверьте возможность установки маршрута.

<!-- source:cn p23 unit:128 -->

```text
# tinymix -D xxx "Software Digital Loopback Mode" "4CH: 2 Mics + 2 Loopbacks"
```

<!-- source:cn p23 unit:129 -->

При ошибке проверьте три пункта:

<!-- source:cn p23 unit:130 -->

```text
Invalid mixer control: Software Digital Loopback Mode
```

<!-- source:cn p23 unit:131 -->

Проверьте наличие поддержки DLP в текущем ядре; иначе обновите SDK или примените патч.

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

Проверьте, включён ли DLP в ядре.

<!-- source:cn p23 unit:134 -->

```text
CONFIG_SND_SOC_ROCKCHIP_DLP_PCM
```

<!-- source:cn p23 unit:135 -->

Включите DLP для соответствующего cpu dai в dts.

<!-- source:cn p23 unit:136 -->

```text
&i2s {
        rockchip,digital-loopback;
};
```

<!-- source:cn p24 unit:137 -->

cpu dai может быть i2s0_8ch, i2s1_8ch, i2s2_2ch, i2s3_2ch, sai0, sai1 и т. д. (2) Проверьте, применён ли маршрут.

<!-- source:cn p24 unit:138 -->

```text
# tinymix -D xxx
...
13      ENUM    1       Software Digital Loopback Mode           4CH: 2 Mics + 2
Loopbacks
...
```

<!-- source:cn p24 unit:139 -->

#### 4.1.2 Проверка звуковой карты

<!-- source:cn p24 unit:140 -->

Проверьте, объявляет ли привязанный в dts codec dai driver поддержку четырёхканального захвата.

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

Если нет, используйте "rockchip,multicodecs-card" с дополнительным вспомогательным виртуальным codec.

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
